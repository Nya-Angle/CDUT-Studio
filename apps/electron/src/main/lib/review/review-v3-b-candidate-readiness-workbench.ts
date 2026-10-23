/**
 * Dev-B R27: one read-only candidate readiness surface composed from real
 * B20 Main-reader inputs, B19 physical provenance, B3 conservative routing
 * and (optional) B4 full-domain workbench. This is not a second Case writer.
 *
 * The caller must obtain B20 and B3 from their existing genuine services.
 * Never accept this payload as a C Main-authoritative principal/session/lease.
 */
import { createHash } from 'node:crypto'
import type { B20CurrentCandidateRead } from './review-v3-b1-b2-main-read-bundle-v3-b'
import type { B3RouteState } from './review-intake-routing-adapter-v3-b3'
import type { B23RecoveryPreflight } from './review-v3-b1-b2-recovery-preflight-v3-b'
import type { B26Workbench } from './review-v3-b4-bulk-evidence-workbench'

const reject=(why:string):never=>{throw new Error('B_R27_'+why)}
const sha64=/^[a-f0-9]{64}$/
export type B27NextAction =
  'SELECT_OR_AUTHOR_TEMPLATE'|'REQUEST_MANUAL_BUSINESS_CLASSIFICATION'|
  'REAUTHOR_OR_REFREEZE'|'REVALIDATE_SOURCE_OR_REPICK'|
  'CONFIRM_ROLE_AND_SUBJECT'|'RESOLVE_RULE_AND_OBJECT_SCOPE'|
  'REQUEST_SCHOOL_POLICY_OR_GOLD'|'MANUAL_REVIEW_REQUIRED'
export interface B27Action {
  action:B27NextAction;checkKey:string|null;targetKey:string|null
  sourceId:string|null;reason:string;automaticBusinessChangeAllowed:false
}
export interface B27Readiness {
  schemaVersion:'review-v3-b27-candidate-readiness/1'
  candidateOnly:true;publicationAllowed:false;businessWriteAllowed:false
  schoolPolicyVerified:false;currentMainAuthorityRecheckedByC:false
  templateId:string;caseCandidateId:string;ownerId:string
  authorFingerprint:string
  routeStatus:B3RouteState['status']
  technicalRoutingReady:boolean;technicalSourcesLinked:boolean
  pendingPhysicalReconfirmation:boolean;readyForFormalDecision:false
  actions:B27Action[];snapshotSha256:string
}
const action=(name:B27NextAction,reason:string,checkKey:string|null=null,
 targetKey:string|null=null,sourceId:string|null=null):B27Action=>({
  action:name,reason,checkKey,targetKey,sourceId,
  automaticBusinessChangeAllowed:false,
})
/**
 * Every canonical Check×target binding must have an exact B19 source binding.
 * A "linked-candidate" is ONLY a physical technical receipt, never a PASS.
 */
export function buildB27CandidateReadiness(
  candidate:B20CurrentCandidateRead,
  routing:B3RouteState,
  options:{historical?:B26Workbench;recovery?:B23RecoveryPreflight}={},
):B27Readiness{
  if(!candidate||candidate.schemaVersion!=='review-v3-b20-main-read-bundle/1'||
     !candidate.candidateOnly||candidate.businessWriteAllowed!==false||
     candidate.publicationAllowed!==false||candidate.schoolPolicyVerified!==false||
     candidate.authorityInstalledByB!==false||
     candidate.authorStatus!=='candidate-held'||!sha64.test(candidate.frozenFingerprint)||
     candidate.frozenDescriptor?.canonicalPlan?.fingerprint!==candidate.frozenFingerprint||
     candidate.frozenDescriptor.publicationAllowed!==false||
     candidate.candidateProvenance?.schemaVersion!=='review-v3-b1-b2-candidate-source/1'||
     candidate.candidateProvenance.candidateOnly!==true||
     candidate.candidateProvenance.businessWriteAllowed!==false||
     candidate.candidateProvenance.planFingerprint!==candidate.frozenFingerprint||
     candidate.candidateProvenance.ownerId!==candidate.ownerId||
     candidate.candidateProvenance.ownerGeneration!==candidate.ownerGeneration||
     candidate.candidateProvenance.caseCandidateId!==candidate.caseCandidateId||
     !sha64.test(candidate.candidateProvenance.snapshotHash)||
     !routing||!Array.isArray(candidate.frozenDescriptor.bindingDetails)||
     !Array.isArray(candidate.candidateProvenance.bindings))
    reject('INPUT_NOT_CURRENT_CANDIDATE')
  const bindingKey=(checkKey:string,targetKey:string)=>JSON.stringify([checkKey,targetKey])
  const canonical=candidate.frozenDescriptor.bindingDetails
  const current=candidate.candidateProvenance.bindings
  const expected=new Map(canonical.map(x=>[bindingKey(x.checkKey,x.targetKey),x]))
  const actual=new Map(current.map(x=>[bindingKey(x.checkKey,x.targetKey),x]))
  if(expected.size!==canonical.length||actual.size!==current.length||
     expected.size!==actual.size)reject('MISSING_OR_DUPLICATE_TARGET')
  const actions:B27Action[]=[]
  let sourcesLinked=true
  for(const [k,declared] of expected){
    const entry=actual.get(k)
    if(!entry)throw new Error('B_R27_PROVENANCE_BINDING_MISMATCH')
    if(entry.checkKey!==declared.checkKey||
       entry.targetKey!==declared.targetKey||
       entry.objectKey!==declared.objectKey||entry.subjectId!==declared.subjectId||
       entry.applicability!==declared.applicability||
       !Array.isArray(entry.sources)||
       entry.sources.length!==declared.sourceIds.length||
       new Set(entry.sources.map(x=>x.sourceId)).size!==entry.sources.length||
       declared.sourceIds.some((s,i)=>entry.sources[i]?.sourceId!==s))
      reject('PROVENANCE_BINDING_MISMATCH')
    for(const source of entry.sources){
      if(source.state!=='linked-candidate'||!sha64.test(source.rawSha256??'')||
         !source.documentVersionId||!source.parseRevision||!source.blockId||
         !source.readExtent||!source.receiptHash){
        sourcesLinked=false
        actions.push(action('REVALIDATE_SOURCE_OR_REPICK',
          'Only current exact physical bytes, parser block and human receipt may establish candidate source provenance',
          entry.checkKey,entry.targetKey,source.sourceId))
      }
      if(source.state==='needs-human-confirmation'||!source.subjectId){
        actions.push(action('CONFIRM_ROLE_AND_SUBJECT',
          'Historical or unassigned role/subject is not a fresh Main owner authority',
          entry.checkKey,entry.targetKey,source.sourceId))
      }
    }
    if(declared.applicability==='unknown')
      actions.push(action('RESOLVE_RULE_AND_OBJECT_SCOPE',
        'Rule condition is unknown for this precise target; never imply not-applicable',
        entry.checkKey,entry.targetKey))
  }
  const validRoutes=new Set<B3RouteState['status']>([
    'countdown','default-selected','manually-selected'])
  const routed=validRoutes.has(routing.status)&&
    (!routing.chosen||routing.chosen.templateId===candidate.templateId)
  if(routing.chosen&&routing.chosen.templateId!==candidate.templateId)
    reject('ROUTE_TEMPLATE_MISMATCH')
  if(routing.status==='unmatched')
    actions.push(action('SELECT_OR_AUTHOR_TEMPLATE',
      'No confident category among existing templates; offer manual review or B1 held-author entry'))
  else if(!routed)
    actions.push(action('REQUEST_MANUAL_BUSINESS_CLASSIFICATION',
      'Routing is waiting on explicit business choice or a non-interrupted evidenced technical suggestion'))
  if(options.recovery){
    const recovery=options.recovery
    if(recovery.schemaVersion!=='review-v3-b23-recovery-preflight/1'||
       recovery.candidateOnly!==true||recovery.businessWriteAllowed!==false||
       recovery.templateId!==candidate.templateId||
       recovery.frozenFingerprint!==candidate.frozenFingerprint||
       recovery.ownerId!==candidate.ownerId||
       recovery.caseCandidateId!==candidate.caseCandidateId)
      reject('RECOVERY_SCOPE_MISMATCH')
    if(recovery.archives.some(x=>x.requiresTrustedNativeRepick||
       x.requiresCurrentParserAndSourceReceipt))
      actions.push(action('REVALIDATE_SOURCE_OR_REPICK',
        'Cold restart has historic receipts only; native picker + parser + subject must be re-established'))
  }
  if(options.historical){
    const historical=options.historical
    if(historical.schemaVersion!=='review-v3-b26-source-workbench/1'||
       historical.candidateOnly!==true||historical.publicationAllowed!==false||
       !sha64.test(historical.snapshotSha256))reject('HISTORICAL_AUDIT_INVALID')
    const template=historical.templates.find(t=>t.templateId===candidate.templateId)
    // New B1 template #51 is intentionally absent from frozen D4: never
    // alias it to any of the 50 historical candidates by name.
    if(template){
      if(template.original!=='RAW_BYTES_MATCH_TECHNICAL_ONLY')
        actions.push(action('REAUTHOR_OR_REFREEZE',
          'Historic original is not presently re-read and matched; no frozen policy adoption'))
      if(template.sourceUnknown||template.scopeUnknown)
        actions.push(action('RESOLVE_RULE_AND_OBJECT_SCOPE',
          'Historic candidate retains unresolved source applicability or object/case scope'))
    }
  }
  actions.push(action('REQUEST_SCHOOL_POLICY_OR_GOLD',
    'Only the independent school issuer and Gold can establish policy authorization, never this B-owned workbench'))
  // Keep consumer presentation predictable while preserving each source's
  // precise check×target; duplicates across independent sources are fine.
  const result:Omit<B27Readiness,'snapshotSha256'>={
    schemaVersion:'review-v3-b27-candidate-readiness/1',
    candidateOnly:true,publicationAllowed:false,businessWriteAllowed:false,
    schoolPolicyVerified:false,currentMainAuthorityRecheckedByC:false,
    templateId:candidate.templateId,caseCandidateId:candidate.caseCandidateId,
    ownerId:candidate.ownerId,authorFingerprint:candidate.frozenFingerprint,
    routeStatus:routing.status,technicalRoutingReady:routed,
    technicalSourcesLinked:sourcesLinked,
    pendingPhysicalReconfirmation:!sourcesLinked||
      Boolean(options.recovery?.archives.length),
    readyForFormalDecision:false,actions,
  }
  return {...result,snapshotSha256:createHash('sha256').update(
    JSON.stringify(result)).digest('hex')}
}
