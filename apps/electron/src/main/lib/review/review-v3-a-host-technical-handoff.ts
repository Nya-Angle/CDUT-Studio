/**
 * Dev-A R22-B: A-owned immutable TECHNICAL handoff to C.
 * A proposal is not C's independently observed physical Host receipt. This
 * module never creates V3VerifiedHostReceipt, Case/Run writes or ACKs.
 */
import {createHash} from 'node:crypto'
import {C0ContractError,type RunEvidenceIdentity,
  type CanonicalPlan} from '@profer/shared'
import type {V3ReviewToolCall} from './review-execution-event-adapter'
import type {V3ReviewOwnerAdapter,V3OwnerLease} from './review-pi-owner-adapter'
import type {V3ATurnBudget,V3ATurnSnapshot} from './review-v3-execution-turn-budget'
import type {V3ASDKDispatchFence,V3ATechnicalDispatchWitness}
  from './review-v3-sdk-dispatch-fence'
import type {AExecutionProposal,V3AProposalProducer} from
  './review-v3-execution-proposal-producer'

const stable=(value:unknown):string=>{
  if(value===null||typeof value!=='object')return JSON.stringify(value)??'null'
  if(Array.isArray(value))return '['+value.map(stable).join(',')+']'
  const x=value as Record<string,unknown>
  return '{'+Object.keys(x).filter(k=>x[k]!==undefined).sort()
    .map(k=>JSON.stringify(k)+':'+stable(x[k])).join(',')+'}'
}
const sha=(value:unknown)=>createHash('sha256').update(stable(value)).digest('hex')
const reject=(s:string):never=>{throw new C0ContractError('RECOVERY_REQUIRED',s)}
export interface A22TechnicalEvidenceEnvelope {
  readonly version:'v3-dev-a-host-handoff/1'
  readonly trust:'A_TECHNICAL_ONLY_C_PHYSICAL_OBSERVER_REQUIRED'
  readonly run:RunEvidenceIdentity
  readonly owner:{
    readonly sessionId:string
    readonly senderKey:string
    readonly generation:number
    readonly processEpoch:string
    readonly grantId:string
    readonly sourceVersionIds:readonly string[]
    readonly planFingerprint:string
    readonly inputManifestHash:string
  }
  readonly planBindings:ReadonlyArray<{
    readonly checkKey:string;readonly targetKey:string
    readonly objectKey:string;readonly subjectId:string
    readonly sourceVersionIds:readonly string[]
  }>
  /** A-verified Host read/check/terminal proposal chain, NOT C Host facts. */
  readonly technicalEvents:readonly AExecutionProposal[]
  readonly turnBudget:V3ATurnSnapshot
  readonly sdkDispatches:readonly V3ATechnicalDispatchWitness[]
  readonly unresolvedProviderEffect:boolean
  readonly canSealCReviewRun:false
  readonly evidenceHash:string
}
/** Main-bound live Owner + durable A ledgers; no IPC/Renderer entrypoint. */
export class A22TechnicalEvidenceHandoff {
  constructor(
    private readonly owners:V3ReviewOwnerAdapter,
    private readonly producer:V3AProposalProducer,
    private readonly turns:V3ATurnBudget,
    private readonly dispatch:V3ASDKDispatchFence,
  ){}
  snapshot(call:V3ReviewToolCall):A22TechnicalEvidenceEnvelope{
    if(call?.tool!=='review_submit_result')reject('Main submit capability required')
    const lease=this.owners.assertAuthorized(
      call.sessionId,call.grantId,call.senderKey,call.principal,'review_submit_result')
    if(!lease.runEvidence||!lease.planSnapshot||
      lease.runEvidence.runId!==lease.runId||
      lease.runEvidence.attemptId!==lease.attemptId||
      lease.runEvidence.ownerGeneration!==lease.generation||
      lease.runEvidence.inputManifestHash!==lease.manifestHash||
      lease.runEvidence.planFingerprint!==lease.planFingerprint){
      reject('Owner lacks pinned execution identity')
    }
    const run=lease.runEvidence
    const plan=lease.planSnapshot
    if(!run||!plan){
      throw new C0ContractError('RUN_IDENTITY_MISMATCH',
        'Owner immutable Run/Plan unavailable')
    }
    const events=this.producer.replayCandidates()
      .filter(x=>x.run.runId===run.runId&&
        x.run.attemptId===run.attemptId&&
        x.run.ownerGeneration===run.ownerGeneration)
      .sort((a,b)=>a.sequence-b.sequence)
    const ids=new Set<string>()
    let terminal=false
    for(let i=0;i<events.length;i++){
      const item=events[i]!
      if(stable(item.run)!==stable(run)||
        !Number.isSafeInteger(item.sequence)||item.sequence!==i+1||
        !item.hostReceiptId?.trim()||
        !item.permissionGrantId?.trim()||
        ids.has(item.eventId)||
        // Same canonical content hash as A2 createAV3ProposalId.
        !verifyTechnicalEventDigest(item)){
        reject('A technical event sequence/content seal invalid')
      }
      ids.add(item.eventId)
      if(terminal)reject('A event recorded after technical terminal')
      if(item.kind==='terminal')terminal=true
      else if(item.kind==='read'){
        if(!lease.sourceIdentities.some(s=>stable(s)===stable(item.read.source))||
          !run.sourceVersionIds.includes(item.read.source.documentVersionId)){
          reject('A read event outside frozen Source set')
        }
      }else if(item.kind==='check'){
        const b=plan.bindings.find(b=>sameCheck(b,item.check))
        if(!b||!run.checkKeys.includes(item.check.checkKey)){
          reject('A check event outside frozen Plan')
        }
      }
    }
    const budget=this.turns.snapshot(lease)
    const sdkDispatches=this.dispatch.technicalSnapshot(call)
    const unknown=this.dispatch.unresolved(run)
    if(unknown!==sdkDispatches.some(x=>
      x.state==='in-flight'||x.state==='late-denied')){
      reject('technical Dispatch journal readbacks differ')
    }
    // Recheck after multiple immutable A ledgers were read; C STILL must
    // independently verify current physical Main Host receipts at commit.
    this.owners.assertAuthorized(
      call.sessionId,call.grantId,call.senderKey,call.principal,'review_submit_result')
    const proof={
      version:'v3-dev-a-host-handoff/1' as const,
      trust:'A_TECHNICAL_ONLY_C_PHYSICAL_OBSERVER_REQUIRED' as const,
      run:structuredClone(run),
      owner:{
        sessionId:lease.sessionId,senderKey:lease.senderKey,
        generation:lease.generation,processEpoch:lease.processEpoch,
        grantId:lease.grantId,
        sourceVersionIds:[...run.sourceVersionIds],
        planFingerprint:lease.planFingerprint,
        inputManifestHash:lease.manifestHash,
      },
      planBindings:plan.bindings.map(b=>({
        checkKey:b.checkKey,targetKey:b.targetKey,objectKey:b.objectKey,
        subjectId:b.subjectId,sourceVersionIds:[...b.sourceVersionIds],
      })),
      technicalEvents:structuredClone(events),
      turnBudget:budget,sdkDispatches:structuredClone(sdkDispatches),
      unresolvedProviderEffect:unknown,
      canSealCReviewRun:false as const,
    }
    return {...proof,evidenceHash:sha(proof)}
  }
}
function sameCheck(b:CanonicalPlan['bindings'][number],
  c:{checkKey:string;targetKey:string;objectKey:string;subjectId:string}):boolean{
  return b.checkKey===c.checkKey&&b.targetKey===c.targetKey&&
    b.objectKey===c.objectKey&&b.subjectId===c.subjectId
}
function verifyTechnicalEventDigest(e:AExecutionProposal):boolean {
  const {eventId,...payload}=e
  return eventId===sha(payload)
}
/** C may compare this against A's original only. Never an independently verified ACK. */
export function verifyA22TechnicalEvidenceHash(
  evidence:Readonly<A22TechnicalEvidenceEnvelope>,
):boolean{
  if(evidence.version!=='v3-dev-a-host-handoff/1'||
    evidence.trust!=='A_TECHNICAL_ONLY_C_PHYSICAL_OBSERVER_REQUIRED'||
    evidence.canSealCReviewRun!==false)return false
  const {evidenceHash,...payload}=evidence
  return evidenceHash===sha(payload)
}
