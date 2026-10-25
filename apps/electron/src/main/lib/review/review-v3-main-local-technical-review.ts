/**
 * C-R11 local-first Pi/Host candidate review.
 *
 * NO school publisher is needed to inspect locally verified source/Host
 * evidence. This path is deliberately READ-ONLY: it cannot invoke C's formal
 * admit/record/seal, cannot mint a physical Host receipt, and cannot certify
 * school policy or official Decision. School Gate L is a FUTURE integration
 * gate, not a development prerequisite for this local product capability.
 *
 * The A22 envelope is an UNTRUSTED TECHNICAL PROPOSAL even when hashed.
 * Only the C-owned live Owner, physical case bytes and independent Host
 * observer can make any individual observation eligible for human review.
 */
import {
  assertC0RunEvidenceIdentity,C0ContractError,
  type RunEvidenceIdentity, type CaseAggregateV2,
} from '@profer/shared'
import {readAggregate} from './case-store-v2'
import {
  assertC2PhysicalOriginalBytes,
  type C2MainHostWitness,type C2MainOwnerWitness,
} from './review-v3-main-trust-port'
import {
  C2MainPhysicalHostReceiptRegistry,
  type C2MainPhysicalHostSource,
} from './review-v3-main-host-receipt-registry'
import {isC2RunDurablyFenced} from './review-v3-durable-host-fence'
import {
  verifyA22TechnicalEvidenceHash,
  type A22TechnicalEvidenceEnvelope,
} from './review-v3-a-host-technical-handoff'
import {executionProposalId} from './review-v3-execution-contract'

const reject=(x:string):never=>{
  throw new C0ContractError('RECOVERY_REQUIRED','C_R11_LOCAL_'+x)
}
const canon=(x:unknown):string=>{
  if(x===null||typeof x!=='object')return JSON.stringify(x)??'null'
  if(Array.isArray(x))return '['+x.map(canon).join(',')+']'
  const d=x as Record<string,unknown>
  return '{'+Object.keys(d).filter(k=>d[k]!==undefined).sort()
    .map(k=>JSON.stringify(k)+':'+canon(d[k])).join(',')+'}'
}
const same=(a:unknown,b:unknown)=>canon(a)===canon(b)

/** A real privileged Main observer, not A proposal DTO or Renderer input. */
export interface C11LocalReviewSource extends C2MainPhysicalHostSource {
  /** May NOT return a synthetic Case whose paths do not exist on disk. */
  readCurrentCase(run:RunEvidenceIdentity):CaseAggregateV2|undefined
}
export interface C11LocalCandidatePreview {
  readonly version:'c11-local-candidate-preview/1'
  readonly status:'local-manual-review'|'local-recovery-required'
  readonly officialSchoolApproved:false
  readonly schoolPolicyPublished:false
  readonly businessWriteAllowed:false
  readonly formalReviewRunSealed:false
  readonly hostSource:'independent-c-main-physical-observer'
  readonly caseId:string
  readonly runId:string
  readonly sourceVersionIds:readonly string[]
  readonly seenPhysicalEvents:number
  readonly readCount:number
  readonly checkCount:number
  readonly terminalObserved:boolean
  readonly unresolvedProviderEffect:boolean
}

/** Main-only, no IPC registration. Review can proceed locally without Gate L. */
export class C11MainLocalTechnicalReview {
  private closed=false
  constructor(private readonly source:C11LocalReviewSource){
    if(!source||typeof source.getCurrentOwner!=='function'||
       typeof source.getObservedPhysicalReceipt!=='function'||
       typeof source.readCurrentCase!=='function')
      reject('ACTUAL_C_MAIN_OWNER_CASE_AND_HOST_PORT_REQUIRED')
  }
  private current(run:RunEvidenceIdentity):{
    owner:C2MainOwnerWitness;aggregate:CaseAggregateV2
  } {
    if(this.closed)return reject('PORT_CLOSED')
    assertC0RunEvidenceIdentity(run)
    if(isC2RunDurablyFenced(run))return reject('RUN_WIDE_DURABLE_FENCE')
    const aggregate=this.source.readCurrentCase(run)
    if(!aggregate||aggregate.caseV2.id!==run.caseId||
       aggregate.caseV2.stage!=='reviewing'||
       aggregate.canonicalPlan?.fingerprint!==run.planFingerprint||
       aggregate.canonicalPlan.templateVersion!==run.templateVersion||
       aggregate.d2RuntimePlan)
      return reject('MAIN_CASE_AND_LOCAL_FROZEN_PLAN_NOT_CURRENT')
    const owner=this.source.getCurrentOwner(run)
    if(!owner||!owner.active||!owner.permissionGrantId||
       !same(owner.run,run)||
       owner.ownerGeneration!==run.ownerGeneration||
       owner.inputManifestHash!==run.inputManifestHash)
      return reject('MAIN_OWNER_GRANT_NOT_CURRENT')
    if(!run.sourceVersionIds.length||
       new Set(run.sourceVersionIds).size!==run.sourceVersionIds.length)
      return reject('RUN_SOURCES_NOT_UNIQUE')
    for(const sourceVersionId of run.sourceVersionIds)
      assertC2PhysicalOriginalBytes(aggregate,sourceVersionId)
    return {owner,aggregate}
  }
  /**
   * C physically observes all A proposed events independently. A's receipt
   * IDs are *lookups* only. Missing Host callbacks, stale Owner, forged source
   * identities and stale original bytes DENY. An A event can never register
   * itself as physical.
   */
  inspect(proposal:Readonly<A22TechnicalEvidenceEnvelope>):C11LocalCandidatePreview {
    if(this.closed)return reject('PORT_CLOSED')
    if(!proposal||!verifyA22TechnicalEvidenceHash(proposal)||
       proposal.trust!=='A_TECHNICAL_ONLY_C_PHYSICAL_OBSERVER_REQUIRED'||
       proposal.canSealCReviewRun!==false)
      return reject('A_TECHNICAL_HANDOFF_INVALID_OR_CLAIMS_AUTHORITY')
    const run=proposal.run
    const before=this.current(run)
    if(proposal.owner.generation!==run.ownerGeneration||
       proposal.owner.planFingerprint!==run.planFingerprint||
       proposal.owner.inputManifestHash!==run.inputManifestHash||
       proposal.owner.grantId!==before.owner.permissionGrantId||
       !same(proposal.owner.sourceVersionIds,run.sourceVersionIds))
      return reject('A_OWNER_DOES_NOT_MATCH_INDEPENDENT_C_OWNER')
    const events=proposal.technicalEvents
    if(!Array.isArray(events)||events.length===0||events.length>8192)
      return reject('TECHNICAL_EVENT_SET_INVALID_OR_NO_PHYSICAL_PROOF')
    const registry=new C2MainPhysicalHostReceiptRegistry(this.source,{
      isRunFenced:isC2RunDurablyFenced,
    })
    let readCount=0,checkCount=0,terminalObserved=false
    const seen=new Set<string>()
    try {
      for(let i=0;i<events.length;i++){
        const event=events[i]!
        if(event.sequence!==i+1||seen.has(event.hostReceiptId)||
           event.permissionGrantId!==before.owner.permissionGrantId||
           !same(event.run,run)||
           !['read','check','terminal'].includes(event.kind)||
           (terminalObserved))
          return reject('A_EVENT_IDENTITY_SEQUENCE_OR_GRANT_INVALID')
        seen.add(event.hostReceiptId)
        const {eventId:ignored,...body}=event
        if(event.eventId!==executionProposalId(body))
          return reject('A_EVENT_DIGEST_INVALID')
        registry.rememberObservedReceipt(event.hostReceiptId)
        const physical: C2MainHostWitness|undefined=
          registry.getPhysicalHostReceipt(event.hostReceiptId)
        if(!physical||physical.permissionGrantId!==before.owner.permissionGrantId||
           physical.verified.kind!==event.kind)
          return reject('INDEPENDENT_C_HOST_CALLBACK_MISSING')
        if(event.kind==='read'){
          if(physical.verified.kind!=='read'||
             !same(physical.verified.source,event.read.source)||
             physical.verified.extent!==event.read.extent)
            return reject('C_HOST_READ_OR_SOURCE_NOT_EQUAL')
          const original=before.aggregate.caseV2.documents.filter(doc=>
            doc.active!==false&&doc.versionId===event.read.source.documentVersionId&&
            doc.documentId===event.read.source.materialId)
          if(original.length!==1||original[0]!.byteHash!==event.read.source.rawSha256)
            return reject('C_HOST_READ_ORIGINAL_SHA_NOT_PINNED_TO_REAL_CASE')
          readCount++
        }else if(event.kind==='check'){
          if(physical.verified.kind!=='check'||
             !same(physical.verified.check,event.check))
            return reject('C_HOST_CHECK_NOT_EQUAL')
          const binding=before.aggregate.canonicalPlan?.bindings.find(b=>
            b.checkKey===event.check.checkKey&&b.targetKey===event.check.targetKey&&
            b.objectKey===event.check.objectKey&&b.subjectId===event.check.subjectId)
          if(!binding||!run.checkKeys.includes(event.check.checkKey)||
             binding.sourceVersionIds.some(id=>!run.sourceVersionIds.includes(id)))
            return reject('CHECK_NOT_BOUND_TO_LOCAL_FROZEN_PLAN')
          checkCount++
        }else{
          if(physical.verified.terminalStatus!==event.terminal.status)
            return reject('C_HOST_TERMINAL_NOT_EQUAL')
          terminalObserved=true
        }
      }
      const after=this.current(run)
      if(!same(before.owner,after.owner)||
         before.aggregate.caseV2.revision!==after.aggregate.caseV2.revision||
         !same(before.aggregate.canonicalPlan,after.aggregate.canonicalPlan))
        return reject('MAIN_CASE_OR_OWNER_CHANGED_AFTER_OBSERVING')
      const recovery=proposal.unresolvedProviderEffect||
        proposal.sdkDispatches.some(x=>
          x.state==='in-flight'||x.state==='late-denied')
      return {
        version:'c11-local-candidate-preview/1',
        status:recovery?'local-recovery-required':'local-manual-review',
        officialSchoolApproved:false,schoolPolicyPublished:false,
        businessWriteAllowed:false,formalReviewRunSealed:false,
        hostSource:'independent-c-main-physical-observer',
        caseId:run.caseId,runId:run.runId,
        sourceVersionIds:[...run.sourceVersionIds],
        seenPhysicalEvents:events.length,readCount,checkCount,terminalObserved,
        unresolvedProviderEffect:recovery,
      }
    }finally{registry.close()}
  }
  close():void{this.closed=true}
}

/** Default production adapter: C's actual persisted Case, never an A DTO. */
export function createC11MainLocalReview(
  observer:C2MainPhysicalHostSource,
):C11MainLocalTechnicalReview {
  if(!observer)return reject('REAL_PHYSICAL_HOST_OBSERVER_NOT_INSTALLED')
  return new C11MainLocalTechnicalReview({
    ...observer,
    readCurrentCase:run=>readAggregate(run.caseId),
  })
}
