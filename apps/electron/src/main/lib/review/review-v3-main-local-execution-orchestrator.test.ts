import {describe,expect,test} from 'bun:test'
import {REVIEW_C0_SCHEMA_VERSION,type RunEvidenceIdentity}
  from '@profer/shared'
import {
  C11MainLocalExecutionOrchestrator,
  type C11MainLocalExecutionAuthority,
} from './review-v3-main-local-execution-orchestrator'

function fixture(){
  const run:RunEvidenceIdentity={
    schemaVersion:REVIEW_C0_SCHEMA_VERSION,
    caseId:'local-run-case',runId:'run-1',attemptId:'attempt-1',
    ownerGeneration:2,caseRevision:1,templateVersion:'1',
    planFingerprint:'a'.repeat(64),inputManifestHash:'b'.repeat(64),
    sourceVersionIds:['v1'],checkKeys:['one'],
  }
  const call={sessionId:'sess',senderKey:'trusted-main',grantId:'grant-2',
    tool:'review_submit_result',principal:{source:'local',principalId:'p',
      role:'reviewer',sessionId:'sess',assurance:'local-device',
      scope:{caseIds:['local-run-case'],actions:['start-review']}}}
  const request={requestId:'main-local-1',call,sequence:{
    version:'v3-dev-a-technical-sequence/1',expectedUsedTurns:0,
    modes:['direct'],
  }}
  const task={
    requestId:request.requestId,run,caseId:run.caseId,
    sessionId:'sess',senderKey:'trusted-main',ownerGrantId:'grant-2',
    processEpoch:'fresh-pid',initialUsedTurns:0,committedUsedTurns:1,
    completedSteps:1,state:'completed-technical',
  }
  const preview={
    version:'c11-local-candidate-preview/1',status:'local-manual-review',
    officialSchoolApproved:false,schoolPolicyPublished:false,
    businessWriteAllowed:false,formalReviewRunSealed:false,
    hostSource:'independent-c-main-physical-observer',
    caseId:run.caseId,runId:run.runId,sourceVersionIds:['v1'],
    seenPhysicalEvents:2,readCount:1,checkCount:0,
    terminalObserved:true,unresolvedProviderEffect:false,
  }
  let current:RunEvidenceIdentity|undefined=run
  let runner=async()=>({...task})
  let physical=()=>({...preview})
  let snapshot=()=>({run,canSealCReviewRun:false})
  let runCount=0,stopCount=0
  const authorities={
    currentRun:()=>current,
    background:{
      run:async()=>{runCount++;return runner()},
      inspect:()=>null,
      stop:()=>{stopCount++;return task},
      stopSession:()=>{stopCount++;return [task]},
    },
    handoff:{snapshot:()=>snapshot()},
    physicalReview:{inspect:()=>physical()},
  } as unknown as C11MainLocalExecutionAuthority
  const create=()=>new C11MainLocalExecutionOrchestrator(authorities)
  return{
    run,call,request,preview,create,
    setRun:(x:RunEvidenceIdentity|undefined)=>{current=x},
    setRunner:(fn:typeof runner)=>{runner=fn},
    setReview:(fn:typeof physical)=>{physical=fn},
    setHandoff:(fn:typeof snapshot)=>{snapshot=fn},
    calls:()=>runCount,stops:()=>stopCount,
  }
}
describe('C R11 Main local A Pi → independent C Host review disposition',()=>{
  test('only local manual review, never fabricated School/Case/Run ACK',async()=>{
    const f=fixture(),worker=f.create()
    const value=await worker.execute(f.request as never)
    expect(value).toMatchObject({
      version:'c11-local-execution/1',state:'candidate-manual-review',
      requestId:f.request.requestId,
      preview:{status:'local-manual-review',
        officialSchoolApproved:false,schoolPolicyPublished:false,
        businessWriteAllowed:false,formalReviewRunSealed:false},
    })
    expect(f.calls()).toBe(1)
  })
  test('changing current C Main Owner while Pi SDK awaits cannot be accepted',async()=>{
    const f=fixture()
    f.setRunner(async()=>{
      f.setRun({...f.run,ownerGeneration:3})
      return {requestId:f.request.requestId,run:f.run,
        caseId:f.run.caseId,sessionId:'sess',senderKey:'trusted-main',
        ownerGrantId:'grant-2',processEpoch:'fresh-pid',initialUsedTurns:0,
        committedUsedTurns:1,completedSteps:1,state:'completed-technical'}
    })
    const value=await f.create().execute(f.request as never)
    expect(value).toMatchObject({
      state:'recovery-required',reason:'MAIN_OWNER_OR_RUN_REVOKED_AFTER_A_SDK_AWAIT',
      officialSchoolApproved:false,businessWriteAllowed:false,
    })
  })
  test('unknown Provider/C physical Host not observed -> recovery, no implied successful Run',async()=>{
    const f=fixture()
    f.setRunner(async()=>({
      requestId:f.request.requestId,run:f.run,caseId:f.run.caseId,
      sessionId:'sess',senderKey:'trusted-main',ownerGrantId:'grant-2',
      processEpoch:'fresh-pid',initialUsedTurns:0,committedUsedTurns:0,
      completedSteps:0,state:'recovery-required',reason:'COLD_PID',
    }))
    expect(await f.create().execute(f.request as never))
      .toMatchObject({state:'recovery-required',reason:'COLD_PID'})
    const g=fixture()
    g.setReview(()=>{throw Error('independent actual Host receipt missing')})
    expect(await g.create().execute(g.request as never))
      .toMatchObject({state:'recovery-required',
        reason:'INDEPENDENT_C_PHYSICAL_HOST_OR_ORIGINAL_NOT_VERIFIED'})
  })
  test('user stop, Owner session revoke and C Main close cannot self-run another Provider',async()=>{
    const f=fixture(),worker=f.create()
    worker.stop('local-run-case','main-local-1')
    worker.stopSession('sess')
    expect(f.stops()).toBe(2)
    worker.close()
    await expect(worker.execute(f.request as never))
      .rejects.toThrow('MAIN_LOCAL_EXECUTION_DISPOSED')
    expect(f.calls()).toBe(0)
    expect(()=>worker.stop('local-run-case','main-local-1'))
      .toThrow('MAIN_LOCAL_EXECUTION_DISPOSED')
  })
  test('A handoff or C Host preview reporting formal authority fails closed',async()=>{
    const f=fixture()
    f.setHandoff(()=>({run:f.run,canSealCReviewRun:true}))
    await expect(f.create().execute(f.request as never))
      .resolves.toMatchObject({state:'recovery-required'})
    const g=fixture()
    g.setReview(()=>({...g.preview,businessWriteAllowed:true}))
    expect(await g.create().execute(g.request as never))
      .toMatchObject({state:'recovery-required'})
  })
})
