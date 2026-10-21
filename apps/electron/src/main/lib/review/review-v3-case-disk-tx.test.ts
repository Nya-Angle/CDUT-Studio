import { afterAll, describe, expect, test } from 'bun:test'
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { once } from 'node:events'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import type { Actor, ReviewCaseV2 } from '@profer/shared'
import { createAggregate, readAggregate, submitCommand, writeAggregate } from './case-store-v2'
import {
  inspectC2CaseDiskLock, recoverC2AbandonedCaseDiskLock,
  withC2CaseDiskTransaction,
} from './review-v3-case-disk-tx'

const root=join(import.meta.dir,'../../../../../../work/tmp',`v3-c-tx-r01-${Date.now()}`)
process.env.PROFER_CONFIG_DIR=root
afterAll(()=>rmSync(root,{recursive:true,force:true}))
let serial=0
const actor:Actor={actorId:'verified-main-test',actorSource:'local',role:'reviewer'}
const state=(id:string):ReviewCaseV2=>({
  id,title:'initial',templateId:'template',templateVersion:1,
  objectType:'document',caseFields:{},subjects:[],documents:[],
  stage:'reviewing',revision:0,
  createdAt:'2026-10-20T00:00:00Z',updatedAt:'2026-10-20T00:00:00Z',
})
const seed=async()=>{const id='c-tx-case-'+ ++serial;await createAggregate(id,state(id));return id}
const command=(id:string,requestId:string,expectedRevision:number,title:string)=>
  submitCommand(id,{
    requestId,actor,expectedRevision,type:'C-Tx-ChangeTitle',
    payload:{title},
  },(_aggregate,payload)=>({
    summary:'change title: '+payload.title,
    mutate:draft=>{draft.caseV2.title=payload.title},
  }))

const moduleUrl=new URL('./review-v3-case-disk-tx.ts',import.meta.url).href
function startHolder(id:string,crash:boolean):ChildProcessWithoutNullStreams {
  const script=`import {withC2CaseDiskTransaction} from ${JSON.stringify(moduleUrl)};
    await withC2CaseDiskTransaction(${JSON.stringify(id)},async()=>{
      process.stdout.write('LOCKED\\n');
      ${crash?"await new Promise(resolve=>process.stdout.write('GOODBYE\\\\n',()=>{process.exit(0)}));":"await new Promise(resolve=>setTimeout(resolve,450));"}
    });`
  return spawn(process.execPath,['-e',script],{
    env:{...process.env,PROFER_CONFIG_DIR:root},
    stdio:['pipe','pipe','pipe'],
  })
}
async function awaitLocked(child:ChildProcessWithoutNullStreams):Promise<void> {
  await new Promise<void>((resolve,reject)=>{
    let data=''
    const timeout=setTimeout(()=>reject(Error('child lock startup timed out '+data)),10000)
    child.stdout.on('data',chunk=>{
      data+=chunk.toString()
      if(data.includes('LOCKED')){clearTimeout(timeout);resolve()}
    })
    child.once('error',err=>{clearTimeout(timeout);reject(err)})
    child.once('exit',code=>{
      if(!data.includes('LOCKED')){clearTimeout(timeout);reject(Error('child exited before lock '+code))}
    })
  })
}

describe('C-Tx R01 same-Case durable multi-PID CAS fence',()=>{
  test('two concurrent local writers commit at most one expected revision',async()=>{
    const id=await seed()
    const [a,b]=await Promise.all([
      command(id,'req-a',0,'first'),
      command(id,'req-b',0,'second'),
    ])
    expect([a.ok,b.ok].filter(Boolean)).toHaveLength(1)
    expect([a,b].filter(x=>!x.ok).map(x=>x.ok?'':x.code)).toEqual(['VERSION_CONFLICT'])
    const result=readAggregate(id)!
    expect(result.caseV2.revision).toBe(1)
    expect(result.receiptLog).toHaveLength(1)
    const winner=a.ok?'req-a':'req-b'
    const again=await command(id,winner,0,result.caseV2.title)
    expect(again.ok).toBe(true)
    expect(readAggregate(id)?.receiptLog).toHaveLength(1)
  })

  test('real independent Bun PID holds same case lock; parent CAS waits rather than overwriting',async()=>{
    if(process.platform==='win32')return
    const id=await seed()
    const child=startHolder(id,false)
    try {
      await awaitLocked(child)
      const locked=inspectC2CaseDiskLock(id)
      expect(locked.locked).toBe(true)
      expect(locked.owner?.pid).toBe(child.pid)
      expect(()=>writeAggregate(readAggregate(id)!)).toThrow('C_TX_RECOVERY_REQUIRED')
      const at=Date.now()
      const result=await command(id,'parent-after-child',0,'updated')
      expect(result.ok).toBe(true)
      expect(Date.now()-at).toBeGreaterThanOrEqual(100)
      expect(readAggregate(id)?.caseV2.revision).toBe(1)
    } finally {
      if(child.exitCode===null) {
        child.kill()
        await once(child,'close').catch(()=>undefined)
      }
    }
    expect(inspectC2CaseDiskLock(id).locked).toBe(false)
  })

  test('crashed PID remains fenced until independent offline exact owner recovery',async()=>{
    if(process.platform==='win32')return
    const id=await seed()
    const child=startHolder(id,true)
    await awaitLocked(child)
    if(child.exitCode===null)await once(child,'close')
    const lock=inspectC2CaseDiskLock(id)
    expect(lock.locked).toBe(true)
    expect(lock.owner?.pid).toBe(child.pid)
    expect(()=>recoverC2AbandonedCaseDiskLock(id,()=>{throw Error('not authorized')}))
      .toThrow('not authorized')
    expect(inspectC2CaseDiskLock(id).locked).toBe(true)
    recoverC2AbandonedCaseDiskLock(id,owner=>{
      if(owner.pid!==child.pid || owner.token!==lock.owner?.token)
        throw Error('wrong owner')
    })
    expect(inspectC2CaseDiskLock(id).locked).toBe(false)
    expect((await command(id,'after-explicit-recovery',0,'recovered')).ok).toBe(true)
    expect(readAggregate(id)?.receiptLog).toHaveLength(1)
  })

  test('live current PID must never be stolen even by apparent maintenance approval',async()=>{
    const id='c-tx-live-'+ ++serial
    await withC2CaseDiskTransaction(id,async()=>{
      expect(()=>recoverC2AbandonedCaseDiskLock(id,()=>{}))
        .toThrow('alive')
    })
    expect(inspectC2CaseDiskLock(id).locked).toBe(false)
  })
})
