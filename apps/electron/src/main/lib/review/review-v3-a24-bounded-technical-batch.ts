/**
 * Dev-A R24: bounded, Main-internal hidden/batch Case scheduling.
 *
 * Queued jobs exist only in this process and are NOT a persisted provider
 * intent. A crash loses the queue; callers inspect A22 durable per-Case
 * spool before any EXPLICIT, newly authorized resubmission. Active jobs
 * persist via the A22 coordinator and NEVER auto-replay after a restart.
 *
 * This is not a school batch finalizer, a graph DAG planner, or a C Run writer.
 */
import {C0ContractError} from '@profer/shared'
import type {
  V3ABackgroundTechnicalCoordinator,A22BackgroundRequest,
  A22BackgroundTask,
} from './review-v3-background-technical-coordinator'
export interface A24ScheduledCase {
  readonly caseId:string
  readonly request:A22BackgroundRequest
}
export type A24CaseResult=
 |{readonly caseId:string;readonly requestId:string;
    readonly outcome:'technical';readonly task:A22BackgroundTask}
 |{readonly caseId:string;readonly requestId:string;
    readonly outcome:'not-started'|'recovery-required';readonly reason:string}
export interface A24BatchResult {
  readonly version:'v3-dev-a-bounded-batch/1'
  readonly results:readonly A24CaseResult[]
  readonly started:number
  readonly completed:number
  readonly notStarted:number
}
/** Main can poll this during a running physical batch. This is NOT a C Batch ACK. */
export interface A24BatchProgress {
  readonly version:'v3-dev-a-batch-progress/1'
  readonly state:'idle'|'running'|'stopping'
  readonly queued:readonly {caseId:string;requestId:string}[]
  readonly active:readonly {caseId:string;requestId:string;
    task:A22BackgroundTask|null}[]
  readonly finished:readonly A24CaseResult[]
  readonly started:number
  readonly total:number
}
const deny=(why:string):never=>{
  throw new C0ContractError('RECOVERY_REQUIRED','A24_BATCH: '+why)
}
/** One instance owned by the V3-only Main/worker, not an IPC singleton. */
export class A24BoundedTechnicalBatchScheduler {
  private busy=false
  private stopped=false
  private readonly active=new Map<string,string>()
  private jobs:readonly A24ScheduledCase[]=[]
  private finished:(A24CaseResult|undefined)[]=[]
  private cursor=0
  private started=0
  private readonly cancelledCases=new Set<string>()
  constructor(
    private readonly coordinator:V3ABackgroundTechnicalCoordinator,
    private readonly maxConcurrentCases=4,
    private readonly maxBatchCases=32,
  ){
    if(!coordinator||typeof coordinator.run!=='function'||
       !Number.isSafeInteger(maxConcurrentCases)||maxConcurrentCases<1||
       maxConcurrentCases>16||!Number.isSafeInteger(maxBatchCases)||
       maxBatchCases<1||maxBatchCases>128){
      throw new C0ContractError('CONTRACT_INVALID',
        'Bounded trusted technical batch limits required')
    }
  }
  activeCaseIds():readonly string[]{return [...this.active.keys()]}
  /** Read-only technical task status for a local progress view. */
  progress():A24BatchProgress {
    const active=[...this.active].map(([caseId,requestId])=>({
      caseId,requestId,task:this.coordinator.inspect(caseId),
    }))
    const queued=this.jobs.slice(this.cursor).map(x=>({
      caseId:x.caseId,requestId:x.request.requestId,
    })).filter(x=>!this.cancelledCases.has(x.caseId))
    return {version:'v3-dev-a-batch-progress/1',
      state:!this.busy?'idle':this.stopped?'stopping':'running',
      queued,active,finished:this.finished.filter(
        (x):x is A24CaseResult=>!!x).map(x=>structuredClone(x)),
      started:this.started,total:this.jobs.length}
  }
  /**
   * Stop one active Case or prevent its queued task from launching.
   * Never treat a Provider that completes after this stop as successful.
   */
  stopCase(caseId:string):boolean {
    if(!this.busy||!this.jobs.some(x=>x.caseId===caseId))
      return false
    const alreadyFinished=this.finished.some(x=>x?.caseId===caseId)
    if(alreadyFinished)return false
    this.cancelledCases.add(caseId)
    const requestId=this.active.get(caseId)
    if(requestId){
      try{this.coordinator.stop(caseId,requestId)}
      catch{ /* Original A22 spool remains observable for manual recovery. */ }
    }
    return true
  }
  /**
   * Cancel all queued-but-unstarted work and request a stop for active Cases.
   * A stop does not attest that a previously sent Provider request was undone.
   */
  stop():void {
    this.stopped=true
    for(const [caseId,requestId] of [...this.active]){
      try{this.coordinator.stop(caseId,requestId)}
      catch{ /* On failed CAS, A22 recovery must remain visible. */ }
    }
  }
  async runBatch(cases:readonly A24ScheduledCase[],
    signal?:AbortSignal):Promise<A24BatchResult>{
    if(this.busy||this.active.size)deny('another batch is active')
    if(!Array.isArray(cases)||cases.length===0||
       cases.length>this.maxBatchCases)deny('invalid batch size')
    if(signal?.aborted)deny('batch cancelled before admission')
    const ids=new Set<string>(),requests=new Set<string>()
    for(const item of cases){
      if(!item||typeof item.caseId!=='string'||!item.caseId.trim()||
         ids.has(item.caseId)||!item.request?.requestId||
         requests.has(item.request.requestId)||
         !Array.isArray(item.request.sequence?.modes)||
         !item.request.sequence.modes.length||
         item.request.sequence.modes.some(m=>!['hidden','batch'].includes(m))){
        deny('duplicate Case/request or untrusted hidden/batch mode')
      }
      ids.add(item.caseId);requests.add(item.request.requestId)
    }
    // Snapshot queue intent before any await. No floating renderer request
    // may mutate a running batch while actual Main SDK work is pending.
    const jobs=[...cases].map(x=>({
      caseId:x.caseId,request:structuredClone(x.request),
    }))
    const results:(A24CaseResult|undefined)[]=Array(jobs.length).fill(undefined)
    let cursor=0,started=0,completed=0
    this.jobs=jobs
    this.finished=results
    this.cursor=0
    this.started=0
    this.cancelledCases.clear()
    this.busy=true
    this.stopped=false
    const onAbort=()=>this.stop()
    signal?.addEventListener('abort',onAbort,{once:true})
    if(signal?.aborted)this.stop()
    const take=async()=>{
      while(true){
        // JS sync queue acquisition makes each index unique in this process.
        if(this.stopped||cursor>=jobs.length)return
        const i=cursor++
        this.cursor=cursor
        const job=jobs[i]!
        const {caseId,request}=job
        if(this.cancelledCases.has(caseId)){
          results[i]={caseId,requestId:request.requestId,
            outcome:'not-started',
            reason:'CASE_CANCELLED_BEFORE_PROVIDER_DISPATCH'}
          continue
        }
        this.active.set(caseId,request.requestId)
        started++
        this.started=started
        try {
          const task=await this.coordinator.run(request)
          if(task.caseId!==caseId||task.requestId!==request.requestId){
            deny('Main scheduler Case/technical receipt mismatch')
          }
          if(task.state==='recovery-required'||task.state==='stopping'||
             task.state==='running'||this.stopped||
             this.cancelledCases.has(caseId)){
            // A stopped, unresolved or cancelled Provider task is NEVER a
            // successful batch item, including a late terminal callback.
            results[i]={caseId,requestId:request.requestId,
              outcome:'recovery-required',
              reason:task.reason??'PROVIDER_OUTCOME_REQUIRES_MANUAL_REVIEW'}
          }else{
            results[i]={caseId,requestId:request.requestId,
              outcome:'technical',task}
            completed++
          }
        }catch(error){
          // Never silently retry an unknown Provider request or another Case.
          results[i]={caseId,requestId:request.requestId,
            outcome:'recovery-required',
            reason:error instanceof Error?error.message:'UNKNOWN_TECHNICAL_FAILURE'}
        }finally {
          this.active.delete(caseId)
        }
      }
    }
    try {
      await Promise.all(Array.from({
        length:Math.min(this.maxConcurrentCases,jobs.length),
      },()=>take()))
      for(let i=0;i<jobs.length;i++){
        if(!results[i])results[i]={
          caseId:jobs[i]!.caseId,requestId:jobs[i]!.request.requestId,
          outcome:'not-started',reason:'BATCH_STOPPED_BEFORE_PHYSICAL_DISPATCH',
        }
      }
      return {
        version:'v3-dev-a-bounded-batch/1',
        results:results as A24CaseResult[],
        started,completed,notStarted:jobs.length-started,
      }
    }finally{
      signal?.removeEventListener('abort',onAbort)
      this.active.clear()
      this.busy=false
      // Keep last finished results visible for UI until the next explicit batch.
      this.stopped=false
    }
  }
}
