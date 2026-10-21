/**
 * Dev-A R23: evidence-producing physical Host hook boundary.
 *
 * An injected privileged physical *executor* must be distinct from an injected
 * technical *observer*. Neither this adapter nor the observer can attest the
 * independently reverified C2 Main physical Host receipt at Case CAS.
 *
 * A physical operation whose result is missing, malformed, revoked, aborted or
 * conflicting is permanently uncertain for this instance. Never retry it.
 */
import {randomUUID} from 'node:crypto'
import {
  C0ContractError,type CanonicalPlan,type RunEvidenceIdentity,
  type SourceIdentity,
} from '@profer/shared'
import type {V3ReviewOwnerAdapter,V3OwnerLease} from './review-pi-owner-adapter'
import type {V3ReviewToolCall} from './review-execution-event-adapter'
import type {
  AVerifiedExecutionHost,ATechnicalStatus,ACheckResult,
} from './review-v3-execution-proposal-producer'

type Binding=CanonicalPlan['bindings'][number]
type Extent='block'|'full-document'
type Kind='read'|'check'|'terminal'
type A23Read={kind:'read';source:SourceIdentity;extent:Extent;
  coveredPhysicalBlocks?:number;totalPhysicalBlocks?:number}
type A23Check={kind:'check';check:ACheckResult}
type A23Terminal={kind:'terminal';status:ATechnicalStatus;reason?:string}
type Outcome=A23Read|A23Check|A23Terminal

/** Main-pinned trusted execution input: not an IPC command or Pi model JSON. */
export interface A23HostOperation {
  readonly operationId:string
  readonly run:RunEvidenceIdentity
  readonly permissionGrantId:string
  readonly ownerSessionId:string
  readonly ownerProcessEpoch:string
  readonly dispatchId:string|null
  readonly requested:Outcome
}
export interface A23ObservedTechnicalHostEvent {
  readonly operationId:string
  readonly run:RunEvidenceIdentity
  readonly permissionGrantId:string
  readonly ownerProcessEpoch:string
  readonly dispatchId:string|null
  readonly technicalReceiptId:string
  readonly observed:Outcome
}
/** Actual executor and independent Main-observed hook are separate ports. */
export interface A23PhysicalExecutor {
  execute(operation:Readonly<A23HostOperation>):
    Promise<{technicalReceiptId:string;result:Outcome}>
}
export interface A23TechnicalPhysicalObserver {
  observe(operationId:string):Readonly<A23ObservedTechnicalHostEvent>|undefined
}
export interface A23TechnicalHostSnapshot {
  readonly version:'v3-dev-a-physical-hook/1'
  readonly trust:'A_TECHNICAL_OBSERVATION_NOT_C_HOST_RECEIPT'
  readonly operation:A23HostOperation
  readonly observation:A23ObservedTechnicalHostEvent
  readonly cHostReceiptVerified:false
}
const stable=(value:unknown):string=>{
  if(value===null||typeof value!=='object')return JSON.stringify(value)??'null'
  if(Array.isArray(value))return '['+value.map(stable).join(',')+']'
  const obj=value as Record<string,unknown>
  return '{'+Object.keys(obj).filter(k=>obj[k]!==undefined).sort()
    .map(k=>JSON.stringify(k)+':'+stable(obj[k])).join(',')+'}'
}
const same=(a:unknown,b:unknown)=>stable(a)===stable(b)
const deny=(message:string):never=>{
  throw new C0ContractError('RECOVERY_REQUIRED','A23_HOST_HOOK: '+message)
}
const valid=(id:string)=>typeof id==='string'&&id.trim().length>0&&id.length<=512
const checkTuple=(b:Pick<Binding,'checkKey'|'targetKey'|'objectKey'|'subjectId'>,
  c:Pick<ACheckResult,'checkKey'|'targetKey'|'objectKey'|'subjectId'>)=>b.checkKey===c.checkKey&&
  b.targetKey===c.targetKey&&b.objectKey===c.objectKey&&b.subjectId===c.subjectId
/** The executor may truthfully report a Check status and physical read extent. */
function equivalentOutcome(request:Outcome,actual:Outcome):boolean{
  if(request.kind!==actual.kind)return false
  if(request.kind==='read'&&actual.kind==='read'){
    return same(request.source,actual.source)&&
      ['block','full-document'].includes(actual.extent)
  }
  if(request.kind==='check'&&actual.kind==='check'){
    return checkTuple(request.check,actual.check)&&
      ['accepted','rejected','missing','unknown'].includes(actual.check.status)
  }
  return request.kind==='terminal'&&actual.kind==='terminal'&&
    request.status===actual.status
}
/**
 * One bound Run/Grant, Main process-local. Never a C observer implementation.
 * Close on window removal/revoke; a thrown executor callback never permits
 * a second physical call even if the remote request may have succeeded.
 */
export class A23ObservedHostTechnicalAdapter implements AVerifiedExecutionHost {
  private busy=false
  private closed=false
  private uncertain=false
  private readonly receiptIds=new Set<string>()
  private readonly observations:A23TechnicalHostSnapshot[]=[]
  constructor(
    private readonly owners:V3ReviewOwnerAdapter,
    private readonly call:V3ReviewToolCall,
    private readonly executor:A23PhysicalExecutor,
    private readonly observer:A23TechnicalPhysicalObserver,
    private readonly getDispatchId:()=>string|null,
  ){
    if(!executor||typeof executor.execute!=='function'||
       !observer||typeof observer.observe!=='function'||
       typeof getDispatchId!=='function'){
      throw new C0ContractError('ACTOR_UNTRUSTED',
        'Separate physical executor and observer required')
    }
  }
  close():void{this.closed=true}
  /** Diagnostic only; cannot register these receipts in C physical registry. */
  snapshots():readonly A23TechnicalHostSnapshot[]{
    return structuredClone(this.observations)
  }
  needsRecovery():boolean{return this.uncertain}
  private current():V3OwnerLease{
    if(this.closed||this.uncertain||this.busy){
      deny('Host adapter closed, uncertain or concurrent')
    }
    return this.owners.assertAuthorized(this.call.sessionId,this.call.grantId,
      this.call.senderKey,this.call.principal,'review_submit_result')
  }
  private pinned(lease:V3OwnerLease):{
    run:RunEvidenceIdentity;plan:CanonicalPlan
  }{
    const run=lease.runEvidence,plan=lease.planSnapshot
    if(!run||!plan)throw new C0ContractError('RECOVERY_REQUIRED',
      'Main frozen Run/Plan identity absent')
    if(run.runId!==lease.runId||
      run.caseId!==lease.caseId||run.attemptId!==lease.attemptId||
      run.ownerGeneration!==lease.generation||
      run.planFingerprint!==lease.planFingerprint||
      run.inputManifestHash!==lease.manifestHash){
      deny('Main frozen Run/Plan identity absent')
    }
    return {run,plan}
  }
  private async perform(requested:Outcome):Promise<{
    technicalReceiptId:string;result:Outcome
  }>{
    const before=this.current()
    const {run,plan}=this.pinned(before)
    if(requested.kind==='read'&&
      (!before.sourceIdentities.some(s=>same(s,requested.source))||
       !run.sourceVersionIds.includes(requested.source.documentVersionId))){
      deny('requested read outside frozen Source')
    }
    if(requested.kind==='check'&&
      !plan.bindings.some(b=>checkTuple(b,requested.check))){
      deny('requested Check not in frozen Plan')
    }
    if(requested.kind==='terminal'&&![
      'completed-technical','partial','cancelled','timed-out','needs-resume','failed',
    ].includes(requested.status)){
      deny('unsupported terminal status')
    }
    const dispatchId=this.getDispatchId()
    if(dispatchId!==null&&!valid(dispatchId))deny('bad SDK dispatch identity')
    const operation:A23HostOperation={
      operationId:randomUUID(),run:structuredClone(run),
      permissionGrantId:before.grantId,ownerSessionId:before.sessionId,
      ownerProcessEpoch:before.processEpoch,dispatchId,
      requested:structuredClone(requested),
    }
    this.busy=true
    try{
      const response=await this.executor.execute(structuredClone(operation))
      const observed=this.observer.observe(operation.operationId)
      if(!observed)throw new C0ContractError('RECOVERY_REQUIRED',
        'Independent physical Host observation missing')
      // Do not accept an executor's self-declared receipt without a separate
      // observed hook; do not silently equate either with C's physical receipt.
      if(!response||!observed||!valid(response.technicalReceiptId)||
         !valid(observed.technicalReceiptId)||
         this.receiptIds.has(response.technicalReceiptId)||
         response.technicalReceiptId!==observed.technicalReceiptId||
         !same(response.result,observed.observed)||
         !same(observed.run,run)||
         observed.operationId!==operation.operationId||
         observed.permissionGrantId!==operation.permissionGrantId||
         observed.ownerProcessEpoch!==operation.ownerProcessEpoch||
         observed.dispatchId!==operation.dispatchId||
         !equivalentOutcome(requested,response.result)||
         (response.result.kind==='read'&&response.result.extent==='full-document'&&
           (!Number.isSafeInteger(response.result.coveredPhysicalBlocks)||
            !Number.isSafeInteger(response.result.totalPhysicalBlocks)||
            response.result.totalPhysicalBlocks!<=0||
            response.result.coveredPhysicalBlocks!==response.result.totalPhysicalBlocks))){
        deny('physical hook mismatch, duplicate receipt or missing observation')
      }
      if(this.closed||this.getDispatchId()!==dispatchId)
        deny('Host closed or dispatch changed while physical request was pending')
      const after=this.owners.assertAuthorized(
        this.call.sessionId,this.call.grantId,this.call.senderKey,
        this.call.principal,'review_submit_result')
      if(!same(this.pinned(after).run,run)||
         after.processEpoch!==before.processEpoch||
         after.grantId!==before.grantId){
        deny('Host owner rotated across physical await')
      }
      this.receiptIds.add(response.technicalReceiptId)
      this.observations.push({
        version:'v3-dev-a-physical-hook/1',
        trust:'A_TECHNICAL_OBSERVATION_NOT_C_HOST_RECEIPT',
        operation,observation:structuredClone(observed),
        cHostReceiptVerified:false,
      })
      return response
    }catch(error){
      // Unknown physical effects: permanently stop this instance.
      this.uncertain=true
      throw error
    }finally{this.busy=false}
  }
  async read(source:SourceIdentity):ReturnType<AVerifiedExecutionHost['read']>{
    const {technicalReceiptId,result}=await this.perform({
      kind:'read',source,extent:'block'})
    if(result.kind!=='read')throw new C0ContractError('RECOVERY_REQUIRED',
      'physical read kind changed')
    return {receiptId:technicalReceiptId,actualSource:result.source,
      extent:result.extent,...(result.coveredPhysicalBlocks!==undefined?
      {coveredPhysicalBlocks:result.coveredPhysicalBlocks}:{}),
      ...(result.totalPhysicalBlocks!==undefined?
      {totalPhysicalBlocks:result.totalPhysicalBlocks}:{})}
  }
  async check(binding:Binding):ReturnType<AVerifiedExecutionHost['check']>{
    const result:ACheckResult={
      checkKey:binding.checkKey,targetKey:binding.targetKey,
      objectKey:binding.objectKey,subjectId:binding.subjectId,status:'unknown'}
    const receipt=await this.perform({kind:'check',check:result})
    if(receipt.result.kind!=='check')throw new C0ContractError('RECOVERY_REQUIRED',
      'physical Check kind changed')
    return {receiptId:receipt.technicalReceiptId,actualCheck:receipt.result.check}
  }
  async terminal(status:ATechnicalStatus):
    ReturnType<AVerifiedExecutionHost['terminal']>{
    const result=await this.perform({kind:'terminal',status})
    if(result.result.kind!=='terminal')throw new C0ContractError('RECOVERY_REQUIRED',
      'physical terminal kind changed')
    return {receiptId:result.technicalReceiptId,actualStatus:result.result.status,
      ...(result.result.reason?{reason:result.result.reason}:{})}
  }
}
