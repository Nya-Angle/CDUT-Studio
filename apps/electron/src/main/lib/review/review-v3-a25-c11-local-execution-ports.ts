/**
 * Dev-A R25: concrete A-only ports for C11MainLocalExecutionOrchestrator.
 *
 * C/Main supplies its current Run, already-authorized Owner, real Pi session
 * factory, physical Host executor/observer and durable per-Case stores.
 * This binds EXISTING A22/A23/A24 implementation. No Case/Run/Decision write,
 * C physical receipt, Renderer credential or school publication is created.
 */
import {C0ContractError,type CanonicalPlan,type RunEvidenceIdentity,
  type SourceIdentity} from '@profer/shared'
import type {OwnerPersistence,V3ReviewOwnerAdapter}
  from './review-pi-owner-adapter'
import type {V3ReviewToolCall} from './review-execution-event-adapter'
import {V3ATurnBudget} from './review-v3-execution-turn-budget'
import {V3ASDKDispatchFence} from './review-v3-sdk-dispatch-fence'
import {V3AProposalProducer,type ATechnicalStatus}
  from './review-v3-execution-proposal-producer'
import {V3ASDKTurnBridge} from './review-v3-main-sdk-turn-bridge'
import {V3APhysicalSDKTurnPort} from './review-v3-sdk-physical-turn-port'
import {V3APiHttpSingleRequestEngine,type V3APiHttpSingleRequestFactory}
  from './review-v3-pi-http-provider-engine'
import {V3ATechnicalSequenceDriver} from './review-v3-technical-sequence-driver'
import {V3ABackgroundTechnicalCoordinator,type A22BackgroundTask}
  from './review-v3-background-technical-coordinator'
import {A22TechnicalEvidenceHandoff,type A22TechnicalEvidenceEnvelope}
  from './review-v3-a-host-technical-handoff'
import {A23ObservedHostTechnicalAdapter,type A23PhysicalExecutor,
  type A23TechnicalPhysicalObserver}
  from './review-v3-a23-physical-host-observer'
import {A24BoundedTechnicalBatchScheduler}
  from './review-v3-a24-bounded-technical-batch'
import {A26NativeReviewPiSessionFactory,
  type A26MainReviewPiSelectionPort}
  from './review-v3-a26-native-pi-session-factory'

export interface A25MainCaseExecutionBinding {
  /** Main-issued scoped submit capability; never accept this from Renderer. */
  readonly call:V3ReviewToolCall
  readonly owners:V3ReviewOwnerAdapter
  /** Separate real CAS files: no aliases, no in-memory production stores. */
  readonly stores:{
    readonly turns:OwnerPersistence
    readonly dispatch:OwnerPersistence
    readonly proposals:OwnerPersistence
    readonly background:OwnerPersistence
  }
  /** Existing factory, used when C already has a dedicated Pi session adapter. */
  readonly piSessions?:V3APiHttpSingleRequestFactory
  /** Preferred: current Main model/channel/tool selection; A constructs real Pi. */
  readonly piMainSelection?:A26MainReviewPiSelectionPort
  readonly physicalExecutor:A23PhysicalExecutor
  readonly physicalObserver:A23TechnicalPhysicalObserver
}
type ActiveCase={
  readonly call:V3ReviewToolCall
  readonly run:RunEvidenceIdentity
  readonly owners:V3ReviewOwnerAdapter
  readonly driver:V3ATechnicalSequenceDriver
  readonly producer:V3AProposalProducer
  readonly host:A23ObservedHostTechnicalAdapter
  readonly handoff:A22TechnicalEvidenceHandoff
  readonly store:OwnerPersistence
}
const reject=(reason:string):never=>{
  throw new C0ContractError('RECOVERY_REQUIRED','A25_C11_PORT: '+reason)
}
const stable=(value:unknown):string=>{
  if(value===null||typeof value!=='object')return JSON.stringify(value)??'null'
  if(Array.isArray(value))return '['+value.map(stable).join(',')+']'
  const r=value as Record<string,unknown>
  return '{'+Object.keys(r).filter(k=>r[k]!==undefined).sort()
    .map(k=>JSON.stringify(k)+':'+stable(r[k])).join(',')+'}'
}
const same=(a:unknown,b:unknown)=>stable(a)===stable(b)

/**
 * Install in trusted C Main, then pass `background` and `handoff` to the
 * existing C11MainLocalExecutionOrchestrator. C still provides currentRun
 * and its independent physicalReview; never pass the A23 observer as C proof.
 */
export class A25C11LocalExecutionPorts {
  private readonly cases=new Map<string,ActiveCase>()
  readonly background:V3ABackgroundTechnicalCoordinator
  readonly handoff:Pick<A22TechnicalEvidenceHandoff,'snapshot'>
  readonly batch:A24BoundedTechnicalBatchScheduler

  constructor(private readonly currentRun:
    (call:V3ReviewToolCall)=>RunEvidenceIdentity|undefined) {
    if(typeof currentRun!=='function')reject('C_MAIN_CURRENT_RUN_REQUIRED')
    this.background=new V3ABackgroundTechnicalCoordinator({
      assertCurrent:call=>this.assertBound(call).run,
      driverForCase:caseId=>this.byCase(caseId).driver,
      storeForCase:caseId=>this.byCase(caseId).store,
    })
    this.handoff={snapshot:call=>this.assertBound(call).handoff.snapshot(call)}
    this.batch=new A24BoundedTechnicalBatchScheduler(this.background)
  }

  /** Called only after C Main authorizes a new live Owner/Run. */
  bindCase(input:A25MainCaseExecutionBinding):void {
    const call=input?.call
    if(!call||call.tool!=='review_submit_result')
      reject('MAIN_SUBMIT_CAPABILITY_REQUIRED')
    const mainRun=this.currentRun(call)
    if(!mainRun)return reject('C_MAIN_RUN_NOT_CURRENT')
    const lease=input.owners.assertAuthorized(call.sessionId,call.grantId,
      call.senderKey,call.principal,'review_submit_result')
    if(!lease.runEvidence||!lease.planSnapshot||
       !same(mainRun,lease.runEvidence))
      return reject('C_MAIN_RUN_NOT_EQUAL_TO_A_OWNER')
    const previous=this.cases.get(mainRun.caseId)
    if(previous){
      if(same(previous.run,mainRun)&&
         previous.call.sessionId===call.sessionId&&
         previous.call.grantId===call.grantId)return
      const last=this.background.inspect(mainRun.caseId)
      if(last&&(last.state==='running'||last.state==='stopping'))
        reject('ACTIVE_CASE_MUST_BE_STOPPED_FIRST')
      previous.host.close()
      this.cases.delete(mainRun.caseId)
    }
    const stores=input.stores
    if(!stores?.turns?.compareAndWrite||!stores.dispatch?.compareAndWrite||
       !stores.proposals?.compareAndWrite||!stores.background?.compareAndWrite)
      reject('FOUR_DURABLE_CASE_CAS_STORES_REQUIRED')
    const piSessions=input.piSessions ??
      (input.piMainSelection
        ? new A26NativeReviewPiSessionFactory(input.piMainSelection)
        : undefined)
    if(!piSessions?.create)
      return reject('REAL_PI_SESSION_FACTORY_NOT_CONFIGURED')
    const turns=new V3ATurnBudget(stores.turns,input.owners)
    const dispatch=new V3ASDKDispatchFence(stores.dispatch,input.owners)
    const host=new A23ObservedHostTechnicalAdapter(
      input.owners,call,input.physicalExecutor,input.physicalObserver,
      ()=>{
        const inFlight=dispatch.technicalSnapshot(call).findLast(
          x=>x.state==='in-flight')
        return inFlight?.dispatchId??null
      })
    const producer=new V3AProposalProducer(
      stores.proposals,input.owners,host,turns)
    const sdk=new V3APhysicalSDKTurnPort(
      new V3APiHttpSingleRequestEngine(piSessions))
    const bridge=new V3ASDKTurnBridge(
      input.owners,turns,producer,sdk,dispatch)
    const driver=new V3ATechnicalSequenceDriver(
      input.owners,turns,bridge)
    const handoff=new A22TechnicalEvidenceHandoff(
      input.owners,producer,turns,dispatch)
    this.cases.set(mainRun.caseId,{
      call:structuredClone(call),run:structuredClone(mainRun),
      owners:input.owners,driver,producer,host,handoff,
      store:stores.background,
    })
  }

  private byCase(caseId:string):ActiveCase{
    return this.cases.get(caseId)??reject('CASE_NOT_BOUND_IN_C_MAIN')
  }
  private assertBound(call:V3ReviewToolCall):ActiveCase{
    const run=this.currentRun(call)
    if(!run)return reject('C_MAIN_RUN_NO_LONGER_CURRENT')
    const bound=this.byCase(run.caseId)
    if(!same(run,bound.run)||
       call.sessionId!==bound.call.sessionId||
       call.grantId!==bound.call.grantId||
       call.senderKey!==bound.call.senderKey)
      return reject('MAIN_OWNER_OR_RUN_CHANGED')
    bound.owners.assertAuthorized(call.sessionId,call.grantId,
      call.senderKey,call.principal,'review_submit_result')
    return bound
  }

  /** Privileged Pi tool-handler entrypoints: actual A23 physical events only. */
  read(call:V3ReviewToolCall,source:SourceIdentity){
    return this.assertBound(call).producer.read({
      ...call,tool:'review_read_documents',source})
  }
  check(call:V3ReviewToolCall,binding:Pick<CanonicalPlan['bindings'][number],
    'checkKey'|'targetKey'|'objectKey'|'subjectId'>){
    // Callers commonly use the complete frozen Plan binding. Only the
    // four immutable Check identity fields belong in this physical request.
    // Forwarding applicability/sourceVersionIds would make a valid Host
    // observation fail A2's exact tuple comparison after the physical call.
    const {checkKey,targetKey,objectKey,subjectId}=binding
    return this.assertBound(call).producer.check(call,{
      checkKey,targetKey,objectKey,subjectId,
    })
  }
  terminal(call:V3ReviewToolCall,status:ATechnicalStatus){
    return this.assertBound(call).producer.terminal(call,status)
  }
  /** UI may poll this A technical task; no C formal ReviewRun inferred. */
  inspect(caseId:string):A22BackgroundTask|null {
    return this.background.inspect(caseId)
  }
  stop(caseId:string,requestId:string):A22BackgroundTask{
    const task=this.background.stop(caseId,requestId)
    this.cases.get(caseId)?.host.close()
    return task
  }
  stopSession(sessionId:string):A22BackgroundTask[]{
    const tasks=this.background.stopSession(sessionId)
    for(const bound of this.cases.values())
      if(bound.call.sessionId===sessionId)bound.host.close()
    return tasks
  }
  /** Technical-only evidence for C independently to inspect, not a C ACK. */
  snapshot(call:V3ReviewToolCall):A22TechnicalEvidenceEnvelope{
    return this.handoff.snapshot(call)
  }
}
