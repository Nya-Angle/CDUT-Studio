/**
 * Dev-C R11 local-first Main run coordinator.
 *
 * Runs *actual imported A R22 durable Owner/SDK background execution* and
 * subsequently asks C's independently observed physical Host reviewer to
 * classify technical results. Gate L is NOT required for local preview:
 * the output is never an official School Decision or a formal ReviewRun.
 *
 * Does not install itself into IPC/ordinary Pi. A privileged Main process
 * must inject its own currentPrincipal/currentRun, physical Host source and
 * A scoped SDK driver. After SDK await, all currentity is checked again.
 */
import {C0ContractError,type RunEvidenceIdentity} from '@profer/shared'
import type {V3ReviewToolCall} from './review-execution-event-adapter'
import type {
  A22BackgroundRequest,A22BackgroundTask,
  V3ABackgroundTechnicalCoordinator,
} from './review-v3-background-technical-coordinator'
import type {A22TechnicalEvidenceHandoff}
  from './review-v3-a-host-technical-handoff'
import type {
  C11LocalCandidatePreview,C11MainLocalTechnicalReview,
} from './review-v3-main-local-technical-review'
const deny=(why:string):never=>{
  throw new C0ContractError('RECOVERY_REQUIRED','C_R11_LOCAL_RUN_'+why)
}
const stable=(value:unknown):string=>{
  if(value===null||typeof value!=='object')return JSON.stringify(value)??'null'
  if(Array.isArray(value))return '['+value.map(stable).join(',')+']'
  const o=value as Record<string,unknown>
  return '{'+Object.keys(o).filter(k=>o[k]!==undefined).sort()
    .map(k=>JSON.stringify(k)+':'+stable(o[k])).join(',')+'}'
}
export type C11LocalExecutionDisposition =
 | {version:'c11-local-execution/1';state:'candidate-manual-review';
    readonly requestId:string;readonly preview:C11LocalCandidatePreview}
 | {version:'c11-local-execution/1';state:'recovery-required';
    readonly requestId:string;readonly caseId:string;readonly reason:string;
    readonly officialSchoolApproved:false;readonly businessWriteAllowed:false}

export interface C11MainLocalExecutionAuthority {
  /** This is C trusted Main current Case/Run/Grant, NOT A callback echo. */
  currentRun(call:V3ReviewToolCall):RunEvidenceIdentity|undefined
  readonly background:Pick<V3ABackgroundTechnicalCoordinator,'run'|'inspect'|'stop'|'stopSession'>
  readonly handoff:Pick<A22TechnicalEvidenceHandoff,'snapshot'>
  readonly physicalReview:Pick<C11MainLocalTechnicalReview,'inspect'>
}
export class C11MainLocalExecutionOrchestrator {
  private closed=false
  constructor(private readonly deps:C11MainLocalExecutionAuthority) {
    if(!deps||typeof deps.currentRun!=='function'||
       typeof deps.background?.run!=='function'||
       typeof deps.handoff?.snapshot!=='function'||
       typeof deps.physicalReview?.inspect!=='function')deny('TRUSTED_C_MAIN_A_AND_HOST_PORTS_NOT_INSTALLED')
  }
  private live(call:V3ReviewToolCall):RunEvidenceIdentity {
    if(this.closed)return deny('MAIN_LOCAL_EXECUTION_DISPOSED')
    const run=this.deps.currentRun(call)
    if(!run||run.caseId.length===0||run.runId.length===0)
      return deny('NO_ACTUAL_CURRENT_MAIN_RUN')
    return structuredClone(run)
  }
  private recovery(requestId:string,caseId:string,reason:string):
    C11LocalExecutionDisposition {
    return {version:'c11-local-execution/1',state:'recovery-required',
      requestId,caseId,reason,officialSchoolApproved:false,businessWriteAllowed:false}
  }
  /** Real A SDK effects can happen here. NEVER implicitly replay on failure. */
  async execute(request:A22BackgroundRequest):Promise<C11LocalExecutionDisposition> {
    if(!request||!request.call||!request.requestId)
      return deny('INVALID_MAIN_EXECUTION_REQUEST')
    const expected=this.live(request.call)
    let result:A22BackgroundTask
    try { result=await this.deps.background.run(request) }
    catch {return this.recovery(request.requestId,expected.caseId,
      'A_SDK_DISPATCH_EFFECT_UNCERTAIN_REQUIRES_MANUAL_INSPECTION')}
    if(this.closed||!sameRun(this.deps.currentRun(request.call),expected)||
       !sameRun(result.run,expected)||
       result.ownerGrantId!==request.call.grantId||
       result.requestId!==request.requestId){
      return this.recovery(request.requestId,expected.caseId,
        'MAIN_OWNER_OR_RUN_REVOKED_AFTER_A_SDK_AWAIT')
    }
    if(result.state==='recovery-required'||result.state==='stopping'||
       result.state==='running'){
      return this.recovery(request.requestId,expected.caseId,
        result.reason||'UNKNOWN_A_PROVIDER_EFFECT_OR_UNSEALED_TASK')
    }
    let preview:C11LocalCandidatePreview
    try {
      const evidence=this.deps.handoff.snapshot(request.call)
      if(!sameRun(evidence.run,expected)||evidence.canSealCReviewRun!==false)
        return deny('A_HANDOFF_NOT_PINNED_TO_MAIN_RUN')
      preview=this.deps.physicalReview.inspect(evidence)
    }catch {
      // There may be physical Provider effects. Never reinterpret as success.
      return this.recovery(request.requestId,expected.caseId,
        'INDEPENDENT_C_PHYSICAL_HOST_OR_ORIGINAL_NOT_VERIFIED')
    }
    if(this.closed||!sameRun(this.deps.currentRun(request.call),expected))
      return this.recovery(request.requestId,expected.caseId,
        'MAIN_OWNER_CHANGED_AFTER_C_PHYSICAL_HOST_CHECK')
    if(preview.status!=='local-manual-review'||preview.runId!==expected.runId||
       preview.caseId!==expected.caseId||preview.businessWriteAllowed!==false||
       preview.schoolPolicyPublished!==false)
      return this.recovery(request.requestId,expected.caseId,
        'UNRESOLVED_PROVIDER_OR_UNTRUSTED_TECHNICAL_DISPOSITION')
    return {version:'c11-local-execution/1',state:'candidate-manual-review',
      requestId:request.requestId,preview}
  }
  stop(caseId:string,requestId:string):A22BackgroundTask{
    if(this.closed)return deny('MAIN_LOCAL_EXECUTION_DISPOSED')
    return this.deps.background.stop(caseId,requestId)
  }
  stopSession(sessionId:string):A22BackgroundTask[]{
    if(this.closed)return deny('MAIN_LOCAL_EXECUTION_DISPOSED')
    return this.deps.background.stopSession(sessionId)
  }
  close():void {
    if(this.closed)return
    this.closed=true
    // Disposal prevents new requests and result adoption. Only caller's real
    // Owner/session lifecycle can stop an already dispatched Provider request.
  }
}
const sameRun=(a:RunEvidenceIdentity|undefined,b:RunEvidenceIdentity):boolean=>
  !!a&&stable(a)===stable(b)
