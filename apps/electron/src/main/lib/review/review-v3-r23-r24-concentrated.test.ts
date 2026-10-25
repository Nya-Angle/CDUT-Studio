import {describe,expect,it} from 'bun:test'
import {
  REVIEW_C0_SCHEMA_VERSION,type CanonicalPlan,type Principal,
  type RunEvidenceIdentity,type SourceIdentity,
} from '@profer/shared'
import {V3ReviewOwnerAdapter,type OwnerPersistence} from './review-pi-owner-adapter'
import {V3AProposalProducer} from './review-v3-execution-proposal-producer'
import {
  A23ObservedHostTechnicalAdapter,type A23HostOperation,
  type A23ObservedTechnicalHostEvent,
} from './review-v3-a23-physical-host-observer'
import {
  A24BoundedTechnicalBatchScheduler,
  type A24ScheduledCase,
} from './review-v3-a24-bounded-technical-batch'
import type {V3ABackgroundTechnicalCoordinator,
  A22BackgroundTask} from './review-v3-background-technical-coordinator'

class Memory implements OwnerPersistence{
  text:string|null=null
  read(){return this.text}
  write(v:string){this.text=v}
  compareAndWrite(a:string|null,b:string){
    if(this.text!==a)throw Error('stale')
    this.text=b
  }
}
const hex='f'.repeat(64)
function hostFixture(){
  const principal:Principal={source:'local',principalId:'main-a23',role:'reviewer',
    sessionId:'frame23',assurance:'local-device',
    scope:{caseIds:['case-a23'],actions:['start-review']}}
  const source:SourceIdentity={
    schemaVersion:REVIEW_C0_SCHEMA_VERSION,caseId:'case-a23',
    materialId:'mat',documentVersionId:'ver',rawSha256:hex,
    parseRevision:'rev1',blockId:'block',location:{kind:'paragraph',locator:'p1'}}
  const run:RunEvidenceIdentity={
    schemaVersion:REVIEW_C0_SCHEMA_VERSION,runId:'run-a23',caseId:'case-a23',
    caseRevision:1,planFingerprint:'planfp',templateVersion:'v1',
    inputManifestHash:hex,sourceVersionIds:['ver'],checkKeys:['check1'],
    attemptId:'attempt',ownerGeneration:1}
  const plan:CanonicalPlan={
    schemaVersion:REVIEW_C0_SCHEMA_VERSION,planId:'plan',fingerprint:'planfp',
    templateId:'template',templateVersion:'v1',moduleDigests:[],bindings:[{
      checkKey:'check1',targetKey:'t',objectKey:'o',subjectId:'s',
      applicability:'applicable',sourceVersionIds:['ver'],conditionFingerprint:'cond'
    }]}
  let allowed=true,physical=0
  const owners=new V3ReviewOwnerAdapter(new Memory(),{
    authorizeExecution:()=>{},
    isCurrent:()=>allowed,
  })
  const grant=owners.grant({principal,run,plan,sources:[source],
    sessionId:'private-host-23',senderKey:'main-frame-23',
    expiresAt:Date.now()+120000,
    permittedTools:['review_submit_result','review_read_documents']})
  const call={sessionId:grant.sessionId,grantId:grant.grantId,
    senderKey:grant.senderKey,principal,tool:'review_submit_result' as const}
  const observations=new Map<string,A23ObservedTechnicalHostEvent>()
  let next:(request:A23HostOperation)=>Promise<{
    technicalReceiptId:string;result:A23HostOperation['requested']
  }>=async operation=>{
    physical++
    const result=operation.requested.kind==='check'
      ?{...operation.requested,check:{...operation.requested.check,status:'accepted' as const}}
      :operation.requested
    const receiptId='physical-r23-'+physical
    observations.set(operation.operationId,{
      operationId:operation.operationId,run:operation.run,
      permissionGrantId:operation.permissionGrantId,
      ownerProcessEpoch:operation.ownerProcessEpoch,
      dispatchId:operation.dispatchId,technicalReceiptId:receiptId,
      observed:result,
    })
    return {technicalReceiptId:receiptId,result}
  }
  const executor={execute:(op:A23HostOperation)=>next(op)}
  const adapter=new A23ObservedHostTechnicalAdapter(
    owners,call,executor,{observe:id=>observations.get(id)},()=>null)
  const producer=new V3AProposalProducer(new Memory(),owners,adapter)
  return {run,call,source,plan,owners,grant,adapter,producer,
    setAllowed:(x:boolean)=>{allowed=x},
    setPhysical:(fn:typeof next)=>{next=fn},
    observation:observations,
    invoked:()=>physical,
  }
}
function job(id:string,caseId:string):A24ScheduledCase{
  const f=hostFixture()
  return {caseId,request:{
    requestId:id,call:f.call,
    sequence:{version:'v3-dev-a-technical-sequence/1',
      expectedUsedTurns:0,modes:['hidden','batch']},
  }}
}
function task(caseId:string,id:string):A22BackgroundTask{
  const j=job(id,caseId)
  return {requestId:id,caseId,
    run:{...hostFixture().run,caseId,runId:'run-'+caseId},
    sessionId:j.request.call.sessionId,
    senderKey:j.request.call.senderKey,
    ownerGrantId:j.request.call.grantId,
    processEpoch:'synthetic-local-test',
    modes:['hidden','batch'],initialUsedTurns:0,
    committedUsedTurns:2,completedSteps:2,state:'completed-technical'}
}
describe('Dev-A R23 native Host physical technical observation (NOT C receipt)',()=>{
  it('R23-01 actual executor and independent hook produce A2 read/check/terminal',async()=>{
    const f=hostFixture()
    const a=await f.producer.read({...f.call,tool:'review_read_documents',
      source:f.source})
    const b=await f.producer.check(f.call,{
      checkKey:'check1',targetKey:'t',objectKey:'o',subjectId:'s'})
    const c=await f.producer.terminal(f.call,'partial')
    expect([a.kind,b.kind,c.kind]).toEqual(['read','check','terminal'])
    expect([a.sequence,b.sequence,c.sequence]).toEqual([1,2,3])
    const proof=f.adapter.snapshots()
    expect(proof).toHaveLength(3)
    expect(proof.every(x=>x.cHostReceiptVerified===false&&
      x.trust==='A_TECHNICAL_OBSERVATION_NOT_C_HOST_RECEIPT'&&
      x.operation.run.runId==='run-a23'&&x.observation.dispatchId===null)).toBe(true)
    expect(f.adapter.needsRecovery()).toBe(false)
  })
  it('R23-02 revoke-after-await and missing observer quarantine all later calls',async()=>{
    const f=hostFixture()
    f.setPhysical(async op=>{
      f.setAllowed(false)
      return {technicalReceiptId:'physical-without-observer',
        result:op.requested}
    })
    await expect(f.producer.read({...f.call,tool:'review_read_documents',
      source:f.source})).rejects.toThrow()
    expect(f.adapter.needsRecovery()).toBe(true)
    await expect(f.adapter.terminal('partial')).rejects.toThrow('uncertain')
    expect(f.adapter.snapshots()).toHaveLength(0)
  })
  it('R23-03 replayed physical receipt and changed observer provenance blocked',async()=>{
    const f=hostFixture()
    let counter=0
    f.setPhysical(async op=>{
      const n=++counter
      const receipt='one-reused-physical-receipt'
      f.observation.set(op.operationId,{
        operationId:op.operationId,run:op.run,
        permissionGrantId:op.permissionGrantId,
        ownerProcessEpoch:op.ownerProcessEpoch,dispatchId:op.dispatchId,
        technicalReceiptId:receipt,observed:op.requested})
      return {technicalReceiptId:receipt,result:op.requested}
    })
    await f.adapter.read(f.source)
    await expect(f.adapter.terminal('partial')).rejects.toThrow('duplicate receipt')
    expect(f.adapter.needsRecovery()).toBe(true)
    expect(counter).toBe(2)
  })
})
describe('Dev-A R24 bounded hidden/batch Case scheduling (no business finalizer)',()=>{
  it('R24-01 bounded parallel Cases and no duplicate active request admission',async()=>{
    let inflight=0,peak=0
    const coordinator={
      run:async ({requestId}:A24ScheduledCase['request'])=>{
        inflight++;peak=Math.max(peak,inflight)
        await Promise.resolve()
        inflight--
        return task('case-'+requestId,requestId)
      },
      stop:()=>{throw Error('not active')},
    } as unknown as V3ABackgroundTechnicalCoordinator
    const scheduler=new A24BoundedTechnicalBatchScheduler(coordinator,2)
    const list=[job('01','case-01'),job('02','case-02'),
      job('03','case-03'),job('04','case-04')]
    const result=await scheduler.runBatch(list)
    expect(result).toMatchObject({started:4,completed:4,notStarted:0})
    expect(peak).toBe(2)
    expect(result.results.every(x=>x.outcome==='technical')).toBe(true)
    await expect(scheduler.runBatch([list[0]!,list[0]!]))
      .rejects.toThrow('duplicate Case')
  })
  it('R24-02 stop prevents queued Provider call; late success is not PASS',async()=>{
    let start=0
    let resolveFirst:((t:A22BackgroundTask)=>void)|undefined
    const coordinator={
      run:async ({requestId}:A24ScheduledCase['request'])=>{
        start++
        return new Promise<A22BackgroundTask>(resolve=>{resolveFirst=resolve})
      },
      stop:()=>({state:'stopping'}),
    } as unknown as V3ABackgroundTechnicalCoordinator
    const scheduler=new A24BoundedTechnicalBatchScheduler(coordinator,1)
    const list=[job('01','case-01'),job('02','case-02'),job('03','case-03')]
    const ongoing=scheduler.runBatch(list)
    expect(start).toBe(1)
    scheduler.stop()
    resolveFirst?.(task('case-01','01'))
    const result=await ongoing
    expect(result).toMatchObject({started:1,completed:0,notStarted:2})
    expect(result.results.map(x=>x.outcome)).toEqual([
      'recovery-required','not-started','not-started'])
    expect(start).toBe(1)
  })
  it('R24-03 invalid modes or duplicate Case rejected before side effects',async()=>{
    let count=0
    const coordinator={run:async()=>{
      count++;throw Error('should not execute')
    }} as unknown as V3ABackgroundTechnicalCoordinator
    const scheduler=new A24BoundedTechnicalBatchScheduler(coordinator,2)
    const original=job('01','case-01')
    const malformed={...original,request:{...original.request,
      sequence:{...original.request.sequence,modes:['direct' as const]}}}
    await expect(scheduler.runBatch([malformed])).rejects.toThrow(
      'untrusted hidden/batch mode')
    expect(count).toBe(0)
  })
  it('R24-04 live progress and cancellation of only one queued Case',async()=>{
    let releaseFirst:((t:A22BackgroundTask)=>void)|undefined
    const invoked:string[]=[]
    const coordinator={
      run:async ({requestId}:A24ScheduledCase['request'])=>{
        invoked.push(requestId)
        if(requestId==='01')
          return new Promise<A22BackgroundTask>(resolve=>{releaseFirst=resolve})
        return task('case-'+requestId,requestId)
      },
      inspect:(id:string)=>task(id,id.slice(-2)),
      stop:()=>({state:'stopping'}),
    } as unknown as V3ABackgroundTechnicalCoordinator
    const scheduler=new A24BoundedTechnicalBatchScheduler(coordinator,1)
    const pending=scheduler.runBatch([
      job('01','case-01'),job('02','case-02'),job('03','case-03'),
    ])
    expect(scheduler.progress()).toMatchObject({
      state:'running',started:1,total:3,
      active:[{caseId:'case-01',requestId:'01'}],
      queued:[{caseId:'case-02'},{caseId:'case-03'}],
    })
    expect(scheduler.stopCase('case-02')).toBe(true)
    expect(scheduler.progress().queued.map(x=>x.caseId)).toEqual(['case-03'])
    releaseFirst?.(task('case-01','01'))
    const result=await pending
    expect(result).toMatchObject({started:2,completed:2,notStarted:1})
    expect(result.results.map(x=>x.outcome)).toEqual([
      'technical','not-started','technical'])
    expect(invoked).toEqual(['01','03'])
    expect(scheduler.progress()).toMatchObject({
      state:'idle',total:3,started:2,
    })
  })
  it('R24-05 Provider recovery-required cannot count as a successful batch Case',async()=>{
    const coordinator={
      run:async ({requestId}:A24ScheduledCase['request'])=>({
        ...task('case-'+requestId,requestId),
        state:'recovery-required' as const,
        reason:'PROVIDER_QUOTA_OR_RECEIPT_UNKNOWN',
      }),
      inspect:()=>null,
      stop:()=>({state:'stopping'}),
    } as unknown as V3ABackgroundTechnicalCoordinator
    const scheduler=new A24BoundedTechnicalBatchScheduler(coordinator,2)
    const result=await scheduler.runBatch([job('01','case-01')])
    expect(result).toMatchObject({started:1,completed:0,notStarted:0})
    expect(result.results).toEqual([{
      caseId:'case-01',requestId:'01',outcome:'recovery-required',
      reason:'PROVIDER_QUOTA_OR_RECEIPT_UNKNOWN',
    }])
  })
})
