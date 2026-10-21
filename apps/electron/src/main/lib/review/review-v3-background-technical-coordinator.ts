/**
 * Dev-A R22-C: durable, per-Case TECHNICAL background execution coordination.
 * Not the V2 Pi background service, not a C Case/Run/Batch/Decision writer.
 *
 * C/Main injects actual Principal/Owner currentness and a separate A SDK
 * sequence driver per Case. The spool has NO authority to create an Owner
 * grant, reopen a crashed physical Provider effect, or auto-resume a Run.
 * Every state change uses the A file persistence's cross-PID CAS.
 */
import {createHash,randomUUID} from 'node:crypto'
import {C0ContractError,assertC0RunEvidenceIdentity,
  type RunEvidenceIdentity} from '@profer/shared'
import {assertSafeReviewStorageId} from './review-storage-id'
import type {OwnerPersistence} from './review-pi-owner-adapter'
import type {V3ReviewToolCall} from './review-execution-event-adapter'
import type {V3ATechnicalSequence,
  V3ATechnicalSequenceDriver,V3ATechnicalSequenceResult}
  from './review-v3-technical-sequence-driver'

const sha=(v:string)=>createHash('sha256').update(v).digest('hex')
const deny=(why:string):never=>{
  throw new C0ContractError('RECOVERY_REQUIRED','A22_BACKGROUND: '+why)
}
export type A22TaskState =
  'running'|'stopping'|'completed-technical'|
  'terminal-technical'|'recovery-required'
export interface A22BackgroundTask {
  readonly requestId:string
  readonly caseId:string
  readonly run:RunEvidenceIdentity
  readonly sessionId:string
  readonly senderKey:string
  readonly ownerGrantId:string
  readonly processEpoch:string
  readonly modes:readonly V3ATechnicalSequence['modes'][number][]
  readonly initialUsedTurns:number
  readonly committedUsedTurns:number
  readonly completedSteps:number
  readonly state:A22TaskState
  readonly reason?:string
  readonly terminalStatus?:string
}
type Journal={
  version:'v3-dev-a-background-tasks/1'
  tasks:A22BackgroundTask[]
}
type Sealed={payload:Journal;sha256:string}
export interface A22BackgroundRequest {
  readonly requestId:string
  readonly call:V3ReviewToolCall
  readonly sequence:V3ATechnicalSequence
}
/** Main-only, not Renderer-provided Run verification or a C ACK. */
export interface A22BackgroundTrustPort {
  /** Independent Main verification of current Owner, frozen Case/Run/Source. */
  assertCurrent(call:V3ReviewToolCall):RunEvidenceIdentity
  /** A driver scoped to exactly this Case, with its OWN Owner/Dispatch/Budget. */
  driverForCase(caseId:string):V3ATechnicalSequenceDriver
  /** Durable isolated technical spool. Must be a real compare-and-write store. */
  storeForCase(caseId:string):OwnerPersistence
}
function decode(raw:string|null):Journal {
  if(raw===null)return {version:'v3-dev-a-background-tasks/1',tasks:[]}
  let x:Sealed
  try{x=JSON.parse(raw) as Sealed}catch{return deny('technical spool JSON corrupt')}
  if(!x?.payload||x.payload.version!=='v3-dev-a-background-tasks/1'||
    !Array.isArray(x.payload.tasks)||
    x.sha256!==sha(JSON.stringify(x.payload)))deny('technical spool seal mismatch')
  const ids=new Set<string>()
  for(const t of x.payload.tasks){
    if(!t.requestId||ids.has(t.requestId)||!t.sessionId||
      !t.senderKey||!t.ownerGrantId||
      !t.caseId||!t.processEpoch||
      !['running','stopping','completed-technical',
        'terminal-technical','recovery-required'].includes(t.state)||
      !Number.isSafeInteger(t.initialUsedTurns)||
      !Number.isSafeInteger(t.committedUsedTurns)||
      t.committedUsedTurns<t.initialUsedTurns||
      !Number.isSafeInteger(t.completedSteps)||t.completedSteps<0||
      !Array.isArray(t.modes)){
      deny('technical spool malformed task history')
    }
    assertC0RunEvidenceIdentity(t.run)
    if(t.caseId!==t.run.caseId)deny('technical spool cross-Case Run')
    ids.add(t.requestId)
  }
  return x.payload
}
const terminal=(s:A22TaskState)=>s==='completed-technical'||
  s==='terminal-technical'||s==='recovery-required'
export class V3ABackgroundTechnicalCoordinator {
  readonly processEpoch=randomUUID()
  private readonly active=new Map<string,{
    requestId:string;sessionId:string;abort:AbortController
  }>()
  constructor(private readonly trust:A22BackgroundTrustPort){
    if(!trust||typeof trust.assertCurrent!=='function'||
      typeof trust.driverForCase!=='function'||
      typeof trust.storeForCase!=='function'){
      throw new C0ContractError('ACTOR_UNTRUSTED',
        'Privileged Main background technical port required')
    }
  }
  private store(caseId:string):OwnerPersistence{
    assertSafeReviewStorageId(caseId,'caseId')
    const x=this.trust.storeForCase(caseId)
    if(!x||typeof x.read!=='function'||
      typeof x.compareAndWrite!=='function')deny('cross-PID technical CAS required')
    return x
  }
  private update(caseId:string,apply:(j:Journal)=>Journal):Journal{
    const store=this.store(caseId),old=store.read(),current=decode(old)
    if(current.tasks.some(t=>t.caseId!==caseId))deny('cross-Case spool collision')
    const next=apply(structuredClone(current))
    if(next.tasks.length>256)deny('technical tombstone capacity exhausted')
    // Rechecked inside atomic compareAndWrite; never rewrite an old snapshot.
    store.compareAndWrite!(old,JSON.stringify({
      payload:next,sha256:sha(JSON.stringify(next)),
    }))
    return next
  }
  private last(caseId:string):A22BackgroundTask|undefined {
    const journal=decode(this.store(caseId).read())
    if(journal.tasks.some(t=>t.caseId!==caseId))deny('cross-Case spool collision')
    return journal.tasks.at(-1)
  }
  /** Cold PID projection NEVER adopts another process's active task. */
  inspect(caseId:string):A22BackgroundTask|null{
    const task=this.last(caseId)
    if(!task)return null
    const local=this.active.get(caseId)
    if((task.state==='running'||task.state==='stopping')&&
      (task.processEpoch!==this.processEpoch||
       local?.requestId!==task.requestId)){
      return {...task,state:'recovery-required',
        reason:'COLD_PID_OR_UNKNOWN_PROVIDER_EFFECT'}
    }
    return structuredClone(task)
  }
  private transition(caseId:string,requestId:string,
    update:(task:A22BackgroundTask)=>A22BackgroundTask):A22BackgroundTask{
    const j=this.update(caseId,current=>{
      const prior=current.tasks.at(-1)
      if(!prior)throw new C0ContractError('RECOVERY_REQUIRED',
        'A22_BACKGROUND: no existing task for update')
      if(prior.requestId!==requestId||
        prior.processEpoch!==this.processEpoch){
        deny('stale background completion or foreign PID')
      }
      current.tasks[current.tasks.length-1]=update(prior)
      return current
    })
    return structuredClone(j.tasks[j.tasks.length-1]!)
  }
  /**
   * True asynchronous technical work. Different Cases can run concurrently.
   * This returns when that attempt reaches its technical local disposition;
   * it does NOT attest physical Provider cancellation after an abort.
   */
  async run(input:A22BackgroundRequest):Promise<A22BackgroundTask>{
    if(!input?.requestId||input.requestId.length>128||
      !/^[A-Za-z0-9_.-]+$/.test(input.requestId)||
      !input.call||!input.sequence||
      input.sequence.version!=='v3-dev-a-technical-sequence/1'||
      !Array.isArray(input.sequence.modes)||
      input.sequence.modes.length===0){
      throw new C0ContractError('CONTRACT_INVALID','Invalid background technical request')
    }
    const run=this.trust.assertCurrent(input.call)
    assertC0RunEvidenceIdentity(run)
    const caseId=run.caseId
    this.store(caseId)
    const old=this.inspect(caseId)
    if(old){
      if(old.requestId===input.requestId){
        // Do not start a second physical side effect for a duplicate ID.
        if(old.run.runId!==run.runId||
          old.run.attemptId!==run.attemptId||
          old.sessionId!==input.call.sessionId||
          old.senderKey!==input.call.senderKey||
          old.ownerGrantId!==input.call.grantId||
          old.initialUsedTurns!==input.sequence.expectedUsedTurns||
          JSON.stringify(old.modes)!==JSON.stringify(input.sequence.modes)){
          deny('requestId replay collision')
        }
        return old
      }
      if(!terminal(old.state)||old.state==='recovery-required'){
        deny('Case has unresolved background technical dispatch')
      }
      if(old.run.runId===run.runId){
        deny('a different request cannot re-run a completed immutable Run')
      }
    }
    if(this.active.has(caseId))deny('Case already active in this process')
    const abort=new AbortController()
    const task:A22BackgroundTask={
      requestId:input.requestId,caseId,run:structuredClone(run),
      sessionId:input.call.sessionId,senderKey:input.call.senderKey,
      ownerGrantId:input.call.grantId,processEpoch:this.processEpoch,
      modes:[...input.sequence.modes],
      initialUsedTurns:input.sequence.expectedUsedTurns,
      committedUsedTurns:input.sequence.expectedUsedTurns,completedSteps:0,
      state:'running',
    }
    this.update(caseId,j=>{
      const prior=j.tasks.at(-1)
      if(j.tasks.some(v=>v.requestId===task.requestId)){
        deny('replayed background request')
      }
      if(prior&&(!terminal(prior.state)||
        prior.state==='recovery-required'||prior.run.runId===run.runId)){
        deny('Case in-flight or duplicate Run in durable spool')
      }
      return {...j,tasks:[...j.tasks,task]}
    })
    this.active.set(caseId,{requestId:task.requestId,
      sessionId:task.sessionId,abort})
    try{
      const driver=this.trust.driverForCase(caseId)
      const result=await driver.execute(input.call,input.sequence,abort.signal,{
        afterTurn:({usedTurns})=>{
          this.transition(caseId,task.requestId,prev=>{
            if(prev.state!=='running')deny('stopped task cannot accept late SDK evidence')
            return {...prev,committedUsedTurns:usedTurns,
              completedSteps:usedTurns-prev.initialUsedTurns}
          })
        },
      })
      const current=this.trust.assertCurrent(input.call)
      if(JSON.stringify(current)!==JSON.stringify(run)){
        deny('Main Run changed across background SDK await')
      }
      return this.transition(caseId,task.requestId,prev=>{
        if(prev.state!=='running'||abort.signal.aborted){
          return {...prev,state:'recovery-required',
            reason:'STOP_OR_LATE_PROVIDER_OUTCOME_UNCERTAIN'}
        }
        return result.kind==='terminal-proposal'
          ?{...prev,state:'terminal-technical',
             committedUsedTurns:input.sequence.expectedUsedTurns+result.executed,
             completedSteps:result.executed,terminalStatus:result.result.status}
          :{...prev,state:'completed-technical',
             committedUsedTurns:result.budget.usedTurns,
             completedSteps:result.executed}
      })
    }catch(error){
      // Keep common user-actionable failure classes visible to C's local
      // recovery workbench, without leaking Provider response bodies/tokens.
      // Even a missing model or quota failure does NOT authorize redispatch
      // of an already persisted SDK intent.
      const message=error instanceof Error?error.message:''
      const reason=abort.signal.aborted
        ?'STOP_OR_PROVIDER_COMPLETION_UNCONFIRMED'
        :/EXTERNAL_PROVIDER_NOT_CONFIGURED|MAIN_MODEL_CHANNEL_NOT_INSTALLED|MAIN_FROZEN_PI_SELECTION_MISSING/.test(message)
          ?'EXTERNAL_PROVIDER_NOT_CONFIGURED'
        :/PROVIDER_PROTOCOL_NOT_YET_SUPPORTED|PROVIDER_HTTPS_REQUIRED/.test(message)
          ?'PROVIDER_PROTOCOL_NOT_SUPPORTED'
        :/(?:429|rate.limit|quota|insufficient.credits)/i.test(message)
          ?'PROVIDER_QUOTA_OR_RATE_LIMIT_REQUIRES_REVIEW'
        :'EXECUTION_OR_PROVIDER_EFFECT_UNCONFIRMED'
      try{
        return this.transition(caseId,task.requestId,prev=>({
          ...prev,state:'recovery-required',reason,
        }))
      }catch{
        // If storage CAS failed after a physical effect, only the cold
        // projection is safe. Never manufacture a successful local terminal.
        throw error
      }
    }finally{
      if(this.active.get(caseId)?.requestId===task.requestId){
        this.active.delete(caseId)
      }
    }
  }
  /** Stops scheduling; may NOT assert that an already sent Provider request stopped. */
  stop(caseId:string,requestId:string):A22BackgroundTask{
    const running=this.active.get(caseId)
    if(!running||running.requestId!==requestId){
      const old=this.inspect(caseId)
      if(old&&old.requestId===requestId)return old
      return deny('no current PID-owned task for stop')
    }
    try{
      return this.transition(caseId,requestId,prev=>{
        if(prev.state!=='running')deny('background stop no longer current')
        return {...prev,state:'stopping',reason:'STOP_REQUESTED_UNKNOWN_PROVIDER_EFFECT'}
      })
    }finally{
      // Abort even if stopping CAS fails: never allow another Provider call.
      running.abort.abort()
    }
  }
  /** Electron Window close/session revoke path, not ordinary chat takeover. */
  stopSession(sessionId:string):A22BackgroundTask[]{
    const stopped:A22BackgroundTask[]=[]
    for(const [caseId,active] of [...this.active]){
      if(active.sessionId===sessionId){
        stopped.push(this.stop(caseId,active.requestId))
      }
    }
    return stopped
  }
}
