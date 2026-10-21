import {afterAll,describe,expect,test} from 'bun:test'
import {spawnSync} from 'node:child_process'
import {rmSync} from 'node:fs'
import {join} from 'node:path'
import {
  REVIEW_C0_SCHEMA_VERSION, type Actor, type ReviewCaseV2,
  type RunEvidenceIdentity,
} from '@profer/shared'
import {createAggregate,readAggregate,writeAggregate} from './case-store-v2'
import {
  assertC2HostRunNotFenced, fenceC2HostRunDurably,isC2RunDurablyFenced,
} from './review-v3-durable-host-fence'
import {C2MainPhysicalHostReceiptRegistry} from './review-v3-main-host-receipt-registry'

const root=join(import.meta.dir,'../../../../../../work/tmp','c-host-fence-r09-'+Date.now())
process.env.PROFER_CONFIG_DIR=root
afterAll(()=>rmSync(root,{recursive:true,force:true}))
const actor:Actor={actorId:'verified-main-operator',role:'reviewer',actorSource:'local'}
let index=0
const runner=(id:string)=>({
  schemaVersion:REVIEW_C0_SCHEMA_VERSION,caseId:id,runId:'run-'+id,
  attemptId:'attempt-1',caseRevision:1,planFingerprint:'a'.repeat(64),
  templateVersion:'1',inputManifestHash:'b'.repeat(64),
  sourceVersionIds:['source-v1'],checkKeys:['check-one'],
  ownerGeneration:2,
} satisfies RunEvidenceIdentity)
async function seed(){
  const id='host-fence-case-'+(++index)
  const now=new Date().toISOString()
  const record:ReviewCaseV2={
    id,title:'Host fence regression',templateId:'template51',
    templateVersion:1,objectType:'document',caseFields:{},
    stage:'reviewing',revision:0,createdAt:now,updatedAt:now,
    documents:[],subjects:[],
  }
  await createAggregate(id,record)
  const run=runner(id)
  const aggregate=readAggregate(id)!
  aggregate.v3TechnicalExecution={
    run,frozenInputDigest:'c'.repeat(64),admittedAtRevision:1,events:[],
  }
  writeAggregate(aggregate)
  return {id,run}
}
const command=(run:RunEvidenceIdentity,reason='Explicit Main operator quarantines physical Host callbacks')=>({
  requestId:'fence-'+run.caseId,
  expectedRevision:0,actor,
  payload:{run,reason},
})
describe('C-R09 Case-CAS durable Run-wide Host fencing (non-SDK business ledger)',()=>{
  test('same transaction receipt and fence survives independent cold OS PID',async()=>{
    const {id,run}=await seed()
    const result=await fenceC2HostRunDurably(id,command(run),(aggregate,current)=>{
      expect(aggregate.caseV2.id).toBe(id)
      expect(current.runId).toBe(run.runId)
    })
    expect(result.ok).toBe(true)
    expect(readAggregate(id)?.caseV2.revision).toBe(1)
    expect(readAggregate(id)?.receiptLog.map(x=>x.type)).toEqual(['FenceV3HostRun'])
    expect(readAggregate(id)?.v3HostRunFences).toHaveLength(1)
    expect(isC2RunDurablyFenced(run)).toBe(true)
    expect(()=>assertC2HostRunNotFenced(readAggregate(id)!,run)).toThrow('Durable Run-wide')
    const cold=spawnSync(process.execPath,[
      join(import.meta.dir,'review-v3-durable-host-fence.worker.ts'),id,
    ],{env:{...process.env,PROFER_CONFIG_DIR:root},encoding:'utf8'})
    expect({status:cold.status,stdout:cold.stdout?.trim(),stderr:cold.stderr?.trim()})
      .toMatchObject({status:0,stdout:'DURABLE_FENCED'})
    const replay=await fenceC2HostRunDurably(id,command(run),()=>{throw Error('SHOULD_NOT_REPEAT')})
    expect(replay.ok).toBe(true)
    expect(readAggregate(id)?.receiptLog).toHaveLength(1)
    const collision=await fenceC2HostRunDurably(id,command(run,'A different operator reason'),()=>{})
    expect(collision).toMatchObject({ok:false,code:'REQUEST_ID_COLLISION'})
    expect(readAggregate(id)?.receiptLog).toHaveLength(1)
  })
  test('revoked Main witness, stale CAS and wrong Run cannot forge a durable fence',async()=>{
    const {id,run}=await seed()
    await expect(fenceC2HostRunDurably(id,command(run),undefined as never))
      .rejects.toThrow('authorization required')
    let result=await fenceC2HostRunDurably(id,command(run),()=>{throw Error('MAIN_OPERATOR_REVOKED')})
    expect(result.ok).toBe(false)
    expect(isC2RunDurablyFenced(run)).toBe(false)
    result=await fenceC2HostRunDurably(id,{
      ...command(run),expectedRevision:9,
    },()=>{})
    expect(result).toMatchObject({ok:false,code:'VERSION_CONFLICT'})
    result=await fenceC2HostRunDurably(id,command({...run,runId:'forged-run'}),()=>{})
    expect(result).toMatchObject({ok:false,code:'STALE_INPUT'})
    result=await fenceC2HostRunDurably(id,command({...run,caseId:'another-case'}),()=>{})
    expect(result).toMatchObject({ok:false,code:'VALIDATION_FAILED'})
    expect(readAggregate(id)?.receiptLog).toHaveLength(0)
  })
  test('no physical Host callback can re-enter an old Run after fence, even under another attempt/generation',async()=>{
    const {id,run}=await seed()
    let observed=true
    const host={
      run,hostReceiptId:'phys-receipt51',permissionGrantId:'main-grant',
      verified:{permissionGrantId:'main-grant',kind:'terminal' as const,
        terminalStatus:'completed-technical' as const},
    }
    const registry=new C2MainPhysicalHostReceiptRegistry({
      getObservedPhysicalReceipt:rid=>observed&&rid===host.hostReceiptId?host:undefined,
      getCurrentOwner:r=>({
        run:r,permissionGrantId:'main-grant',active:true,
        ownerGeneration:r.ownerGeneration,inputManifestHash:r.inputManifestHash,
      }),
    },{isRunFenced:isC2RunDurablyFenced})
    registry.rememberObservedReceipt(host.hostReceiptId)
    expect(registry.getPhysicalHostReceipt(host.hostReceiptId)).toBeDefined()
    const result=await fenceC2HostRunDurably(id,command(run),()=>{})
    expect(result.ok).toBe(true)
    expect(registry.getPhysicalHostReceipt(host.hostReceiptId)).toBeUndefined()
    expect(()=>registry.rememberObservedReceipt(host.hostReceiptId)).toThrow('Run invalidated')
    const mutated={...run,attemptId:'new-attempt',ownerGeneration:9000}
    const fake=readAggregate(id)!
    expect(()=>assertC2HostRunNotFenced(fake,mutated)).toThrow('Run-wide')
    expect(isC2RunDurablyFenced({...run,runId:'different-new-run'})).toBe(false)
    observed=false
  })
  test('corrupt durable fence never defaults to permit and cannot be evicted',async()=>{
    const {id,run}=await seed()
    const agg=readAggregate(id)!
    agg.v3HostRunFences=[{
      schemaVersion:'review-v3-host-run-fence/1',run,
      requestId:'fence-one',operatorPrincipalId:'trusted',
      reason:'manual quarantine',fencedAt:new Date().toISOString(),
    }, {
      schemaVersion:'review-v3-host-run-fence/1',run,
      requestId:'fence-two',operatorPrincipalId:'trusted',
      reason:'corrupt repeated entry',fencedAt:new Date().toISOString(),
    }]
    writeAggregate(agg)
    expect(()=>isC2RunDurablyFenced(run)).toThrow('Host Run fence')
    expect(()=>assertC2HostRunNotFenced(readAggregate(id)!,run)).toThrow('Host Run fence')
  })
})
