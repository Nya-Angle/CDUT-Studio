/**
 * Dev-B R28: resumable technical evidence worklist and non-destructive,
 * checksum-linked bulk remediation diff. NOT an authority or Case writer.
 */
import { createHash } from 'node:crypto'
import type {
  B26Workbench,B26Issue,B26IssueKind,
} from './review-v3-b4-bulk-evidence-workbench'
import type { B27Readiness,B27Action } from './review-v3-b-candidate-readiness-workbench'
const sha=/^[0-9a-f]{64}$/
const reject=(why:string):never=>{throw new Error('B_R28_'+why)}
function verified(work:B26Workbench):void{
  if(!work||work.schemaVersion!=='review-v3-b26-source-workbench/1'||
     work.candidateOnly!==true||work.publicationAllowed!==false||
     work.schoolAuthorityVerified!==false||
     work.counts.domains!==8||work.counts.templates!==50||
     work.counts.checks!==3875||work.counts.unknownSourceRefs!==4163||
     work.counts.unscoped!==34||!Array.isArray(work.issues)||
     !Array.isArray(work.templates)||work.templates.length!==50)
    reject('WORKLIST_INVALID')
  const identity=createHash('sha256').update(JSON.stringify({
    templates:work.templates,issues:work.issues,counts:work.counts,
  })).digest('hex')
  if(work.snapshotSha256!==identity||
     new Set(work.issues.map(x=>x.id)).size!==work.issues.length||
     work.issues.some(x=>x.canAutoClear!==false||
       x.schoolAuthorityVerified!==false||x.publicationAllowed!==false))
    reject('WORKLIST_TAMPERED')
}
export type B28RemediationKind =
  'REACQUIRE_FROZEN_RAW'|'QUARANTINE_DIFFERENT_VERSION'|
  'REQUEST_SOURCE_DOCUMENT'|'CONFIRM_OBJECT_SUBJECT_SCOPE'|
  'REQUEST_INDEPENDENT_SCHOOL_GOLD'
export interface B28Remediation {
  issueId:string;kind:B28RemediationKind
  domain:string;templateId:string;checkId:string|null
  sourceId:string|null;ruleId:string|null
  requiredEvidence:string[]
  proposedStatus:'NEEDS_HUMAN_EVIDENCE'
  schoolAuthorization:false;businessWriteAllowed:false
}
export interface B28ReviewPacket {
  schemaVersion:'review-v3-b28-remediation-packet/1'
  parentSnapshotSha256:string
  selectedIssueIds:string[]
  actions:B28Remediation[]
  createdFrom:'B26_FROZEN_CANDIDATE_QUEUE'
  candidateOnly:true;publicationAllowed:false;canApplyToCurrentCase:false
  packetSha256:string
}
function remediation(row:B26Issue):B28Remediation{
  let kind:B28RemediationKind,requiredEvidence:string[]
  switch(row.kind){
  case 'ORIGINAL_RAW_NOT_OBSERVED':
    kind='REACQUIRE_FROZEN_RAW'
    requiredEvidence=['full original unmodified bytes','SHA256 exact frozen match','original version and provenance']
    break
  case 'ORIGINAL_VERSION_CONFLICT':
    kind='QUARANTINE_DIFFERENT_VERSION'
    requiredEvidence=['both immutable original versions','distinct SHA256','human conflict determination']
    break
  case 'UNVERIFIED_SOURCE_APPLICABILITY':
    kind='REQUEST_SOURCE_DOCUMENT'
    requiredEvidence=['exact SourceRef documentVersionId + locator','issuer and effective-date independently verified','scope and policy Gold']
    break
  case 'UNSCOPED_OBJECT_AND_CASE':
    kind='CONFIRM_OBJECT_SUBJECT_SCOPE'
    requiredEvidence=['specific object and Subject','requested operation and case scope','human issuer authorization evidence']
    break
  case 'HIGH_RISK_CLAUSE_REQUIRES_INDEPENDENT_GOLD':
    kind='REQUEST_INDEPENDENT_SCHOOL_GOLD'
    requiredEvidence=['per-rule original condition','object/Subject positive and negative Gold','authorized policy issuer and revocation status']
    break
  default:return reject('UNKNOWN_ISSUE')
  }
  return {
    issueId:row.id,domain:row.domain,templateId:row.templateId,
    checkId:row.checkId,sourceId:row.sourceId,ruleId:row.ruleId,
    kind,requiredEvidence,proposedStatus:'NEEDS_HUMAN_EVIDENCE',
    schoolAuthorization:false,businessWriteAllowed:false,
  }
}
/** Export selected issues for author assistance; never marks them resolved. */
export function prepareB28RemediationPacket(
  work:B26Workbench,selected:readonly string[],
  expectedSha256:string,
):B28ReviewPacket{
  verified(work)
  if(expectedSha256!==work.snapshotSha256||
     !Array.isArray(selected)||selected.length===0||selected.length>500||
     selected.some(x=>typeof x!=='string'||!x.trim())||
     new Set(selected).size!==selected.length)reject('INVALID_SELECTION_OR_STALE_SNAPSHOT')
  const byId=new Map(work.issues.map(x=>[x.id,x]))
  const sorted=[...selected].sort()
  const actions=sorted.map(id=>{
    const item=byId.get(id)
    if(!item)throw new Error('B_R28_ISSUE_NOT_IN_SNAPSHOT')
    return remediation(item)
  })
  const packet={schemaVersion:'review-v3-b28-remediation-packet/1' as const,
    parentSnapshotSha256:expectedSha256,selectedIssueIds:sorted,
    actions,createdFrom:'B26_FROZEN_CANDIDATE_QUEUE' as const,
    candidateOnly:true as const,publicationAllowed:false as const,
    canApplyToCurrentCase:false as const}
  const packetSha256=createHash('sha256').update(JSON.stringify(packet)).digest('hex')
  return {...packet,packetSha256}
}
export interface B28QueueChange {
  issueId:string;domain:string;templateId:string;kind:B26IssueKind
  from:B26Issue['state'];to:B26Issue['state']
  /** Change tracks only documented candidate technical evidence, not closure. */
  status:'TECHNICAL_CANDIDATE_OBSERVATION_ONLY'
}
export interface B28QueueReconcile {
  schemaVersion:'review-v3-b28-queue-reconcile/1'
  previousSnapshotSha256:string;currentSnapshotSha256:string
  changed:B28QueueChange[];stillUnresolved:number
  policyGapsCleared:0;publicationAllowed:false;canAutoApply:false
  reconciliationSha256:string
}
/**
 * From one complete frozen evidence workbench to another. New observations
 * may annotate precisely one existing issue but cannot delete source gaps,
 * introduce new duties or silently elevate "candidate observed" to approved.
 */
export function reconcileB28CandidateObservations(
  previous:B26Workbench,next:B26Workbench,
  expectedPreviousSha256:string,
):B28QueueReconcile{
  verified(previous);verified(next)
  if(expectedPreviousSha256!==previous.snapshotSha256)
    reject('STALE_PREVIOUS_SNAPSHOT')
  if(previous.frozenD4SHA!==next.frozenD4SHA||
     previous.counts.unscoped!==next.counts.unscoped||
     previous.counts.unknownSourceRefs!==next.counts.unknownSourceRefs||
     previous.issues.length!==next.issues.length)
    reject('FROZEN_ISSUE_SET_CHANGED')
  const before=new Map(previous.issues.map(x=>[x.id,x]))
  const changed:B28QueueChange[]=[]
  for(const item of next.issues){
    const older=before.get(item.id)
    if(!older)throw new Error('B_R28_FROZEN_ISSUE_IDENTITY_CHANGED')
    if(older.domain!==item.domain||
       older.templateId!==item.templateId||
       older.checkId!==item.checkId||
       older.sourceId!==item.sourceId||
       older.ruleId!==item.ruleId||older.kind!==item.kind||
       older.priority!==item.priority)
      reject('FROZEN_ISSUE_IDENTITY_CHANGED')
    if(older.state!==item.state){
      if(!['missing','candidate-observed-unverified','quarantined','awaiting-school-gold']
         .includes(item.state))reject('UNSUPPORTED_EVIDENCE_STATE')
      changed.push({issueId:item.id,domain:item.domain,templateId:item.templateId,
        kind:item.kind,from:older.state,to:item.state,
        status:'TECHNICAL_CANDIDATE_OBSERVATION_ONLY'})
    }
  }
  const payload={schemaVersion:'review-v3-b28-queue-reconcile/1' as const,
    previousSnapshotSha256:previous.snapshotSha256,
    currentSnapshotSha256:next.snapshotSha256,changed,
    stillUnresolved:next.issues.length,
    policyGapsCleared:0 as const,publicationAllowed:false as const,
    canAutoApply:false as const}
  return {...payload,reconciliationSha256:createHash('sha256').update(
    JSON.stringify(payload)).digest('hex')}
}
export interface B28CandidateHandoff {
  schemaVersion:'review-v3-b28-candidate-handoff/1'
  caseCandidateId:string;authorFingerprint:string
  routeRequiresHuman:boolean;safeNextActions:readonly B27Action[]
  candidateOnly:true;autoCreateCase:false;autoRunPi:false
  canPublish:false;canWritePolicy:false
}
/**
 * B1/B2/B3/B4 workbench handoff for renderer preview. It may show repair
 * steps; only C Main is allowed to authorize real Case/Run transactions.
 */
export function describeB28CandidateHandoff(readiness:B27Readiness):B28CandidateHandoff{
  if(!readiness||readiness.schemaVersion!=='review-v3-b27-candidate-readiness/1'||
     readiness.publicationAllowed!==false||
     readiness.businessWriteAllowed!==false||
     readiness.currentMainAuthorityRecheckedByC!==false||
     readiness.readyForFormalDecision!==false||
     !sha.test(readiness.authorFingerprint)||!sha.test(readiness.snapshotSha256)||
     !Array.isArray(readiness.actions))reject('READINESS_INVALID')
  return {schemaVersion:'review-v3-b28-candidate-handoff/1',
    caseCandidateId:readiness.caseCandidateId,
    authorFingerprint:readiness.authorFingerprint,
    routeRequiresHuman:!readiness.technicalRoutingReady,
    safeNextActions:readiness.actions.map(x=>({...x})),
    candidateOnly:true,autoCreateCase:false,autoRunPi:false,
    canPublish:false,canWritePolicy:false}
}
