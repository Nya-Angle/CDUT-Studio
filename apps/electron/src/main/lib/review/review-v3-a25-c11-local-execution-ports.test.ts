/** A25 real composition path: Main-frozen Owner -> native Pi HTTP -> A Host -> C11 ports.
 * Synthetic upstream HTTPS is intentionally NOT an external Provider/Gate E.
 */
import {describe,expect,it} from 'bun:test'
import type {AgentSession} from '@earendil-works/pi-coding-agent'
import type {StreamFn} from '@earendil-works/pi-agent-core'
import {REVIEW_C0_SCHEMA_VERSION,type CanonicalPlan,type Principal,
  type RunEvidenceIdentity,type SourceIdentity} from '@profer/shared'
import {V3ReviewOwnerAdapter,type OwnerPersistence} from './review-pi-owner-adapter'
import {A25C11LocalExecutionPorts} from './review-v3-a25-c11-local-execution-ports'
import type {A23ObservedTechnicalHostEvent}
  from './review-v3-a23-physical-host-observer'
import {verifyA22TechnicalEvidenceHash}
  from './review-v3-a-host-technical-handoff'
class Memory implements OwnerPersistence{
  private data:string|null=null
  read(){return this.data}
  write(text:string){this.data=text}
  compareAndWrite(expected:string|null,next:string){
    if(this.data!==expected)throw Error('stale A journal')
    this.data=next
  }
}
const hex='a'.repeat(64)
const principal:Principal={source:'local',principalId:'main-a25',
  role:'reviewer',sessionId:'main-window',assurance:'local-device',
  scope:{caseIds:['case-a25'],actions:['start-review']}}
const run:RunEvidenceIdentity={
  schemaVersion:REVIEW_C0_SCHEMA_VERSION,caseId:'case-a25',runId:'run-a25',
  caseRevision:1,planFingerprint:'frozen-a25',templateVersion:'v1',
  inputManifestHash:hex,sourceVersionIds:['source-version'],
  checkKeys:['ck-a25'],attemptId:'attempt-a25',ownerGeneration:1,
}
const source:SourceIdentity={
  schemaVersion:REVIEW_C0_SCHEMA_VERSION,caseId:'case-a25',
  materialId:'material',documentVersionId:'source-version',rawSha256:hex,
  parseRevision:'parse1',blockId:'block',location:{kind:'paragraph',locator:'p1'},
}
const plan:CanonicalPlan={
  schemaVersion:REVIEW_C0_SCHEMA_VERSION,planId:'p-a25',
  fingerprint:'frozen-a25',templateId:'local',templateVersion:'v1',
  moduleDigests:[],bindings:[{
    checkKey:'ck-a25',targetKey:'target',objectKey:'object',
    subjectId:'subject',applicability:'applicable',
    sourceVersionIds:['source-version'],conditionFingerprint:'condition',
  }],
}
type NativeEvent={type:'turn_start'|'turn_end'|'agent_end'|'agent_settled';
  message?:{role:'assistant';stopReason:'stop'};willRetry?:boolean}
function fixture(){
  let current=true,requests=0,physical=0
  const owners=new V3ReviewOwnerAdapter(new Memory(),{
    authorizeExecution:()=>{},isCurrent:()=>current,
  })
  const grant=owners.grant({
    principal,run,plan,sources:[source],sessionId:'review-a25',
    senderKey:'main-a25',expiresAt:Date.now()+120000,
    permittedTools:['review_submit_result','review_read_documents'],
  })
  const call={sessionId:grant.sessionId,grantId:grant.grantId,
    senderKey:grant.senderKey,principal,tool:'review_submit_result' as const}
  const ports=new A25C11LocalExecutionPorts(()=>current?run:undefined)
  const observations=new Map<string,A23ObservedTechnicalHostEvent>()
  ports.bindCase({
    call,owners,stores:{
      turns:new Memory(),dispatch:new Memory(),
      proposals:new Memory(),background:new Memory(),
    },
    physicalExecutor:{execute:async op=>{
      physical++
      const result=op.requested.kind==='check'
        ?{...op.requested,check:{...op.requested.check,status:'accepted' as const}}
        :op.requested
      const technicalReceiptId='a25-physical-'+physical
      observations.set(op.operationId,{
        operationId:op.operationId,run:op.run,
        permissionGrantId:op.permissionGrantId,
        ownerProcessEpoch:op.ownerProcessEpoch,
        dispatchId:op.dispatchId,technicalReceiptId,observed:result,
      })
      return {technicalReceiptId,result}
    }},
    physicalObserver:{observe:id=>observations.get(id)},
    piSessions:{create:async()=>{
      let listener:((event:NativeEvent)=>void)|undefined
      const streamFunction:StreamFn=async (_model,_context,options)=>{
        const response=await options!.fetch!(
          'https://approved.example/v1/chat/completions',{method:'POST'})
        await response.text()
        listener?.({type:'turn_end',
          message:{role:'assistant',stopReason:'stop'}})
        return {} as Awaited<ReturnType<StreamFn>>
      }
      const session={
        agent:{state:{isStreaming:false},streamFunction},
        subscribe(cb:(event:NativeEvent)=>void){listener=cb;return ()=>{listener=undefined}},
        dispose(){listener=undefined},
        async prompt(){
          listener?.({type:'turn_start'})
          await session.agent.streamFunction(
            {api:'openai-completions',provider:'openai',id:'test'} as never,
            {messages:[]} as never,{transport:'sse'} as never)
          // Real Main Pi tool handler exercises A23 separately observed Host.
          await ports.read(call,source)
          await ports.check(call,{
            checkKey:'ck-a25',targetKey:'target',
            objectKey:'object',subjectId:'subject',
          })
          await ports.terminal(call,'partial')
          listener?.({type:'agent_end',willRetry:false})
          listener?.({type:'agent_settled'})
        },
      }
      const typedSession=session as unknown as
        Pick<AgentSession,'agent'|'subscribe'|'prompt'|'dispose'>
      return {session:typedSession,prompt:'trusted Main frozen input',
        trustedOrigin:'https://approved.example',
        transportFetch:async ()=>{
          requests++
          return new Response('data: [DONE]\n\n',{
            headers:{'x-request-id':'provider-a25-one',
              'content-type':'text/event-stream'},
          })
        }}
    }},
  })
  return {ports,call,setCurrent:(v:boolean)=>{current=v},
    physical:()=>physical,requests:()=>requests}
}
describe('A25 real C11 technical ports composition',()=>{
  it('A25-01 one native Pi HTTP turn, A23 Read/Check/terminal and C11 handoff',async()=>{
    const f=fixture()
    const task=await f.ports.background.run({
      requestId:'a25-one',call:f.call,
      sequence:{version:'v3-dev-a-technical-sequence/1',
        expectedUsedTurns:0,modes:['hidden']},
    })
    expect(task).toMatchObject({state:'completed-technical',
      committedUsedTurns:1,completedSteps:1})
    expect(f.requests()).toBe(1)
    expect(f.physical()).toBe(3)
    expect(f.ports.inspect(run.caseId)?.state).toBe('completed-technical')
    const handoff=f.ports.handoff.snapshot(f.call)
    expect(handoff.technicalEvents.map(x=>x.kind)).toEqual([
      'read','check','terminal'])
    expect(handoff.turnBudget.usedTurns).toBe(1)
    expect(handoff.sdkDispatches).toMatchObject([
      {state:'settled',technicalReceiptId:'provider-a25-one'}])
    expect(handoff.canSealCReviewRun).toBe(false)
    expect(verifyA22TechnicalEvidenceHash(handoff)).toBe(true)
    expect((await f.ports.background.run({
      requestId:'a25-one',call:f.call,
      sequence:{version:'v3-dev-a-technical-sequence/1',
        expectedUsedTurns:0,modes:['hidden']},
    })).state).toBe('completed-technical')
    expect(f.requests()).toBe(1)
  })
  it('A25-02 C Main Run revocation blocks new technical effects',async()=>{
    const f=fixture()
    f.setCurrent(false)
    await expect(f.ports.background.run({
      requestId:'a25-revoked',call:f.call,
      sequence:{version:'v3-dev-a-technical-sequence/1',
        expectedUsedTurns:0,modes:['hidden']},
    })).rejects.toThrow('C_MAIN_RUN_NO_LONGER_CURRENT')
    expect(f.requests()).toBe(0)
    expect(()=>f.ports.handoff.snapshot(f.call)).toThrow()
  })
})
