/**
 * Dev-A R22 concentrated technical product tests: authentic A Owner +
 * proposal/dispatch/turn ledgers, multi-Case durable coordinator, cold PID.
 * Physical Provider and Main authority are intentionally injected here;
 * no C Host receipt, formal Run or school publisher is synthesized.
 */
import {spawnSync} from 'node:child_process'
import {mkdtempSync,readFileSync,rmSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {describe,expect,it} from 'bun:test'
import {REVIEW_C0_SCHEMA_VERSION,type CanonicalPlan,
  type Principal,type RunEvidenceIdentity,type SourceIdentity}
  from '@profer/shared'
import {V3ReviewOwnerAdapter,createFileOwnerPersistence,
  type OwnerPersistence} from './review-pi-owner-adapter'
import {V3ATurnBudget} from './review-v3-execution-turn-budget'
import {V3ASDKDispatchFence} from './review-v3-sdk-dispatch-fence'
import {V3AProposalProducer} from './review-v3-execution-proposal-producer'
import {V3ASDKTurnBridge,type V3ATurnHostOutcome}
  from './review-v3-main-sdk-turn-bridge'
import {V3ATechnicalSequenceDriver} from
  './review-v3-technical-sequence-driver'
import {A22TechnicalEvidenceHandoff,verifyA22TechnicalEvidenceHash}
  from './review-v3-a-host-technical-handoff'
import {V3ABackgroundTechnicalCoordinator,
 type A22BackgroundTrustPort} from
  './review-v3-background-technical-coordinator'

class Store implements OwnerPersistence {
  raw:string|null=null
  read(){return this.raw}
  write(s:string){this.raw=s}
  compareAndWrite(expected:string|null,s:string){
    if(this.raw!==expected)throw Error('cross-PID CAS conflict')
    this.raw=s
  }
}
function fixture(caseId:string){
  const hex='f'.repeat(64)
  const principal:Principal={
    source:'local',principalId:'main-r22',role:'reviewer',
    sessionId:'r22-main-window',assurance:'local-device',
    scope:{caseIds:[caseId],actions:['start-review']},
  }
  const source:SourceIdentity={
    schemaVersion:REVIEW_C0_SCHEMA_VERSION,
    caseId,materialId:'mat',documentVersionId:'version1',
    rawSha256:hex,parseRevision:'parser-1',blockId:'b1',
    location:{kind:'paragraph',locator:'p1'},
  }
  const run:RunEvidenceIdentity={
    schemaVersion:REVIEW_C0_SCHEMA_VERSION,runId:caseId+'-run',
    caseId,caseRevision:1,planFingerprint:'frozen-plan',
    templateVersion:'v1',inputManifestHash:hex,
    sourceVersionIds:['version1'],checkKeys:['ck1'],
    attemptId:'attempt1',ownerGeneration:1,
  }
  const plan:CanonicalPlan={
    schemaVersion:REVIEW_C0_SCHEMA_VERSION,planId:'plan-r22',
    fingerprint:'frozen-plan',templateId:'t-r22',templateVersion:'v1',
    moduleDigests:[],bindings:[{
      checkKey:'ck1',targetKey:'target',objectKey:'object',
      subjectId:'subject',applicability:'applicable',
      sourceVersionIds:['version1'],conditionFingerprint:'condition-r22',
    }],
  }
  const ownerStore=new Store()
  const owner=new V3ReviewOwnerAdapter(ownerStore,{
    authorizeExecution:()=>{},
    isCurrent:()=>current,
  })
  let current=true,invoked=0
  const lease=owner.grant({
    principal,run,plan,sources:[source],sessionId:caseId+'-session',
    senderKey:caseId+'-sender',expiresAt:Date.now()+120_000,
    permittedTools:['review_submit_result','review_read_documents'],
  })
  const call={sessionId:lease.sessionId,grantId:lease.grantId,
    senderKey:lease.senderKey,principal,tool:'review_submit_result' as const}
  const turns=new V3ATurnBudget(new Store(),owner)
  const dispatch=new V3ASDKDispatchFence(new Store(),owner)
  const producer=new V3AProposalProducer(new Store(),owner,{
    read:async s=>({receiptId:'physical-read-r22',actualSource:s,
      extent:'block'}),
    check:async b=>({receiptId:'physical-check-r22',actualCheck:{
      checkKey:b.checkKey,targetKey:b.targetKey,objectKey:b.objectKey,
      subjectId:b.subjectId,status:'accepted' as const,
    }}),
    terminal:async status=>({receiptId:'physical-terminal-'+status,
      actualStatus:status}),
  },turns)
  let sdkCall:(input:{run:RunEvidenceIdentity;dispatchId:string})=>
    Promise<V3ATurnHostOutcome>=async input=>({
      kind:'completed-turn',run:input.run,dispatchId:input.dispatchId,
      receiptId:caseId+'-physical-'+(++invoked),
    })
  const bridge=new V3ASDKTurnBridge(owner,turns,producer,{
    nextTurn:async input=>{
      // This callback is injected by the test's privileged Main fixture,
      // not a forged SDKMessage or a C physical Host registry.
      return sdkCall(input)
    },
  },dispatch)
  const driver=new V3ATechnicalSequenceDriver(owner,turns,bridge)
  const sequence=(modes:('direct'|'hidden'|'graph'|'batch')[],
    expectedUsedTurns=0)=>({
      version:'v3-dev-a-technical-sequence/1' as const,
      expectedUsedTurns,modes,
    })
  return {caseId,call,run,source,plan,lease,owner,turns,
    producer,dispatch,driver,sequence,
    setCurrent:(value:boolean)=>{current=value},
    setSDK:(fn:typeof sdkCall)=>{sdkCall=fn},
    calls:()=>invoked,
  }
}
const coldWorker=fileURLToPath(new URL(
  './review-v3-r22-cold-background.worker.ts',import.meta.url))
describe('Dev-A R22 actual owner + durable multi-turn background execution',()=>{
  it('R22-A/C-01: different Cases run independently; duplicate request cannot redispatch',async()=>{
    const a=fixture('r22-case-a'),b=fixture('r22-case-b')
    const stores=new Map<string,Store>()
    const fixtures=new Map([[a.caseId,a],[b.caseId,b]])
    const trust:A22BackgroundTrustPort={
      assertCurrent:call=>{
        const f=[a,b].find(x=>x.call.sessionId===call.sessionId)
        if(!f)throw Error('unknown Main case')
        return f.owner.assertAuthorized(call.sessionId,call.grantId,
          call.senderKey,call.principal,'review_submit_result').runEvidence!
      },
      driverForCase:id=>fixtures.get(id)!.driver,
      storeForCase:id=>{
        if(!stores.has(id))stores.set(id,new Store())
        return stores.get(id)!
      },
    }
    const coordinator=new V3ABackgroundTechnicalCoordinator(trust)
    const [aa,bb]=await Promise.all([
      coordinator.run({requestId:'req-a',call:a.call,
        sequence:a.sequence(['direct','hidden','graph'])}),
      coordinator.run({requestId:'req-b',call:b.call,
        sequence:b.sequence(['batch','direct'])}),
    ])
    expect(aa).toMatchObject({state:'completed-technical',
      committedUsedTurns:3,completedSteps:3})
    expect(bb).toMatchObject({state:'completed-technical',
      committedUsedTurns:2,completedSteps:2})
    expect(coordinator.inspect(a.caseId)).toMatchObject({state:'completed-technical'})
    expect(a.turns.snapshot(a.lease).usedTurns).toBe(3)
    expect(b.turns.snapshot(b.lease).usedTurns).toBe(2)
    const firstDispatches=a.dispatch.technicalSnapshot(a.call)
    expect(firstDispatches).toHaveLength(3)
    expect(firstDispatches.every(x=>x.state==='settled'&&
      x.grantId===a.lease.grantId&&x.caseId===a.caseId&&
      !!x.dispatchId&&!!x.technicalReceiptId)).toBe(true)
    expect((await coordinator.run({requestId:'req-a',call:a.call,
      sequence:a.sequence(['direct','hidden','graph'])})).state)
      .toBe('completed-technical')
    expect(a.turns.snapshot(a.lease).usedTurns).toBe(3)
    await expect(coordinator.run({requestId:'req-a',call:a.call,
      sequence:a.sequence(['batch','hidden','graph'])}))
      .rejects.toThrow('requestId replay collision')
    await expect(coordinator.run({requestId:'new-request',call:a.call,
      sequence:a.sequence(['direct'],3)})).rejects.toThrow('different request')
  })
  it('R22-A/C-02: stopSession + late SDK outcome never becomes success',async()=>{
    const a=fixture('r22-cancelled')
    let finish:((v:V3ATurnHostOutcome)=>void)|undefined
    let called=false
    a.setSDK(input=>new Promise(resolve=>{
      called=true
      finish=resolve
    }))
    const store=new Store()
    const coordinator=new V3ABackgroundTechnicalCoordinator({
      assertCurrent:()=>a.owner.assertAuthorized(
        a.call.sessionId,a.call.grantId,a.call.senderKey,a.call.principal,
        'review_submit_result').runEvidence!,
      driverForCase:()=>a.driver,
      storeForCase:()=>store,
    })
    const job=coordinator.run({requestId:'cancel-01',call:a.call,
      sequence:a.sequence(['hidden','hidden'])})
    expect(called).toBe(true)
    expect(coordinator.stopSession(a.call.sessionId)).toMatchObject([
      {state:'stopping',reason:'STOP_REQUESTED_UNKNOWN_PROVIDER_EFFECT'},
    ])
    const stopped=await job
    expect(stopped.state).toBe('recovery-required')
    expect(coordinator.inspect(a.caseId)?.state).toBe('recovery-required')
    finish?.({kind:'completed-turn',run:a.run,
      dispatchId:'late-cannot-be-used',receiptId:'late-provider'})
    await expect(coordinator.run({requestId:'unsafe-restart',call:a.call,
      sequence:a.sequence(['direct'])})).rejects.toThrow(
        'unresolved background technical dispatch')
    expect(a.turns.snapshot(a.lease).usedTurns).toBe(0)
    expect(a.producer.replayCandidates()).toHaveLength(0)
  })
  it('R22-B-01: physical A read/check/terminal builds scoped digest but NO C receipt',async()=>{
    const a=fixture('r22-handoff')
    const read=await a.producer.read({...a.call,tool:'review_read_documents',
      source:a.source})
    const check=await a.producer.check(a.call,{
      checkKey:'ck1',targetKey:'target',objectKey:'object',subjectId:'subject',
    })
    const term=await a.producer.terminal(a.call,'partial')
    expect([read.sequence,check.sequence,term.sequence]).toEqual([1,2,3])
    const handoff=new A22TechnicalEvidenceHandoff(
      a.owner,a.producer,a.turns,a.dispatch)
    const pack=handoff.snapshot(a.call)
    expect(pack).toMatchObject({
      trust:'A_TECHNICAL_ONLY_C_PHYSICAL_OBSERVER_REQUIRED',
      run:a.run,unresolvedProviderEffect:false,canSealCReviewRun:false,
      sdkDispatches:[],
      turnBudget:{usedTurns:0},
    })
    expect(pack.technicalEvents).toHaveLength(3)
    expect(pack.planBindings[0]).toMatchObject({
      checkKey:'ck1',sourceVersionIds:['version1']})
    expect(pack.owner).toMatchObject({generation:1,
      grantId:a.lease.grantId})
    expect(verifyA22TechnicalEvidenceHash(pack)).toBe(true)
    expect(verifyA22TechnicalEvidenceHash({
      ...pack,canSealCReviewRun:false,evidenceHash:'f'.repeat(64)}))
      .toBe(false)
    a.setCurrent(false)
    expect(()=>handoff.snapshot(a.call)).toThrow()
  })
  it('R22-C-03: separate real OS PID sees running spool as recovery-required',async()=>{
    if(process.platform!=='linux')return
    const dir=mkdtempSync(join(tmpdir(),'r22-cold-'))
    try{
      const a=fixture('r22-cold-case')
      let finish:((v:V3ATurnHostOutcome)=>void)|undefined
      a.setSDK(()=>new Promise(resolve=>{finish=resolve}))
      const journalPath=join(dir,'background.json')
      const coordinator=new V3ABackgroundTechnicalCoordinator({
        assertCurrent:()=>a.owner.assertAuthorized(
          a.call.sessionId,a.call.grantId,a.call.senderKey,a.call.principal,
          'review_submit_result').runEvidence!,
        driverForCase:()=>a.driver,
        storeForCase:()=>createFileOwnerPersistence(journalPath),
      })
      const running=coordinator.run({requestId:'cold-01',call:a.call,
        sequence:a.sequence(['direct'])})
      const previous=readFileSync(journalPath,'utf8')
      const child=spawnSync(process.execPath,
        [coldWorker,dir,a.caseId],{encoding:'utf8',timeout:30000})
      expect(child.status).toBe(0)
      const line=child.stdout.split('\n').find(x=>x.startsWith('R22_COLD '))
      expect(line).toBeDefined()
      const observed=JSON.parse(line!.slice('R22_COLD '.length)) as {
        state:string;reason:string;pid:number
      }
      expect(observed).toMatchObject({
        state:'recovery-required',reason:'COLD_PID_OR_UNKNOWN_PROVIDER_EFFECT',
      })
      expect(observed.pid).not.toBe(process.pid)
      expect(readFileSync(journalPath,'utf8')).toBe(previous)
      // The original live trusted Owner is the ONLY legitimate completer.
      finish?.({kind:'completed-turn',run:a.run,dispatchId:'ignored-late',
        receiptId:'ignored-late'})
      const settled=await running
      expect(settled.state).toBe('recovery-required')
      expect(coordinator.inspect(a.caseId)?.state).toBe('recovery-required')
    }finally{rmSync(dir,{recursive:true,force:true})}
  },90000)
  it('R22-C-04: real background status exposes quota failure and never auto-retries',async()=>{
    const a=fixture('r22-quota-case')
    let requests=0
    a.setSDK(async()=>{
      requests++
      throw new Error('429 quota exceeded')
    })
    const newStore=new Store()
    const coordinator=new V3ABackgroundTechnicalCoordinator({
      assertCurrent:()=>a.owner.assertAuthorized(
        a.call.sessionId,a.call.grantId,a.call.senderKey,a.call.principal,
        'review_submit_result').runEvidence!,
      driverForCase:()=>a.driver,
      storeForCase:()=>newStore,
    })
    const result=await coordinator.run({
      requestId:'quota-01',call:a.call,sequence:a.sequence(['hidden']),
    })
    expect(result).toMatchObject({state:'recovery-required',
      reason:'PROVIDER_QUOTA_OR_RATE_LIMIT_REQUIRES_REVIEW'})
    expect(coordinator.inspect(a.caseId)?.reason)
      .toBe('PROVIDER_QUOTA_OR_RATE_LIMIT_REQUIRES_REVIEW')
    await expect(coordinator.run({
      requestId:'quota-02',call:a.call,sequence:a.sequence(['hidden']),
    })).rejects.toThrow('unresolved background technical dispatch')
    expect(requests).toBe(1)
  })
})
