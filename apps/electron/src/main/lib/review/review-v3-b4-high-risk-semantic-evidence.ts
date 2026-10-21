/**
 * Dev-B B4: compare selected high-risk source clauses with frozen archived
 * technical Check/source evidence. Never elevate an archive title match to
 * semantic equivalence or live school policy authority.
 */
import type { B4Archive } from './review-v3-b4-obligation-lineage'
export interface B4HighRiskSourceEvidence {
 schemaVersion:'review-v3-b4-high-risk-semantic-evidence/1'
 d4FrozenSHA:string
 classifications:{
   ruleIdentity:'MATCHED_RAW_ORIGINAL'
   semantic:'NOT_ATTESTED'
   schoolPolicy:'NOT_VERIFIED'
   independentGold:'NOT_AUTHORIZED_OR_NOT_RUN'
   publicationAllowed:false
 }
 method:string
 items:Array<{
  domain:string;templateId:string;rawSha256:string
  original:{ruleId:string;headingLine:number;heading:string;excerpt:string;excerptEndsBeforeLine:number}
  technical:{archiveBlobSha:string;checkIds:string[];sourceIds:string[];
   sourceEvidence:Array<{sourceId:string;verification:string;applicability:string;documentVersionId:string|null;locator:string|null}>
   observedScopes:Array<{checkId:string;taskTitle:string|null;scope:unknown;applicabilityNote:string|null;responsibilityEvidence:string;sourceIds:string[]}>
   expectedReviewDimensions:string[];dimensionsNotEvidencedInArchivedCheckFields:string[]}
  disposition:{status:'CANDIDATE_CHECK_TRACEABLE_SEMANTIC_UNPROVEN';
   authorityVerified:false;applicabilityVerified:false;independentGold:false;authorMayPublish:false;
   requiredReview:string[];targetedNegativeTest:string;negativeTestStatus:'NOT_EXECUTED_TARGET_MACHINE_OR_GOLD'}
 }>
}
const reject=(name:string):never=>{throw new Error('B4_SEMANTIC_AUDIT_'+name)}
export function validateB4HighRiskEvidence(
 proof:B4HighRiskSourceEvidence,archives:Readonly<Record<string,B4Archive>>,
):{rules:number;checkEdges:number;distinctTemplates:number;semanticValidated:0;publicationAllowed:false}{
 if(!proof||proof.schemaVersion!=='review-v3-b4-high-risk-semantic-evidence/1' ||
  proof.d4FrozenSHA!=='b68443b23293b4714e61a3b81383d3d3a56434fc' ||
  proof.classifications?.ruleIdentity!=='MATCHED_RAW_ORIGINAL' ||
  proof.classifications?.semantic!=='NOT_ATTESTED' ||
  proof.classifications?.schoolPolicy!=='NOT_VERIFIED' ||
  proof.classifications?.independentGold!=='NOT_AUTHORIZED_OR_NOT_RUN' ||
  proof.classifications?.publicationAllowed!==false ||
  !Array.isArray(proof.items)||proof.items.length!==32)reject('HEADER')
 const actual=new Set<string>(),templates=new Set<string>();let edges=0
 for(const row of proof.items){
  const domain=archives[row.domain]
  const t=domain?.templates.find(x=>x.templateId===row.templateId)
  if(!domain || !t)throw new Error('B4_SEMANTIC_AUDIT_TEMPLATE_NOT_PINNED')
  if(domain.frozenSourceGitSha!==proof.d4FrozenSHA || t.sourceSha256!==row.rawSha256 ||
   actual.has(row.templateId+':'+row.original.ruleId))reject('DUPLICATE_OR_UNPINNED')
  actual.add(row.templateId+':'+row.original.ruleId);templates.add(row.templateId)
  if(!/^R-\d{2}$/.test(row.original.ruleId)||row.original.headingLine<1 ||
   !row.original.heading.startsWith('### '+row.original.ruleId+'｜')||
   !row.original.excerpt.trim()||row.original.excerpt.length<25 ||
   !Array.isArray(row.technical.checkIds)||row.technical.checkIds.length===0 ||
   row.technical.checkIds.length!==row.technical.observedScopes.length ||
   !row.technical.expectedReviewDimensions.length ||
   row.disposition.status!=='CANDIDATE_CHECK_TRACEABLE_SEMANTIC_UNPROVEN' ||
   row.disposition.authorityVerified!==false ||
   row.disposition.applicabilityVerified!==false ||
   row.disposition.independentGold!==false ||
   row.disposition.authorMayPublish!==false ||
   row.disposition.negativeTestStatus!=='NOT_EXECUTED_TARGET_MACHINE_OR_GOLD')reject('PROOF_STATUS')
  const checkIds=new Set<string>(),sourceIds:string[]=[]
  for(const checkId of row.technical.checkIds){
   if(checkIds.has(checkId))reject('DUPLICATE_CHECK')
   checkIds.add(checkId)
   const check=t.obligations.find(o=>o.checkId===checkId)
   if(!check)throw new Error('B4_SEMANTIC_AUDIT_CHECK_MISSING')
    if(check.bindingState!=='WORKSPACE_BOUND')reject('CHECK_MISSING')
   if(row.domain==='G04' ? check.taskId!=='r'+row.original.ruleId.slice(2) :
     !check.taskTitle?.startsWith(row.original.ruleId+'｜'))reject('RULE_MISMATCH')
   const observed=row.technical.observedScopes.find(x=>x.checkId===checkId)
   if(!observed||JSON.stringify(observed.scope)!==JSON.stringify(check.genericScope) ||
     JSON.stringify(observed.sourceIds)!==JSON.stringify(check.sourceIds) ||
     observed.responsibilityEvidence!=='NOT_IN_B4_CHECK_METADATA')reject('SCOPE_MISMATCH')
   sourceIds.push(...check.sourceIds);edges++
  }
  if(JSON.stringify(row.technical.sourceIds)!==JSON.stringify(sourceIds))reject('SOURCE_IDS')
  const sources=row.technical.sourceEvidence
  if(sources.length!==sourceIds.length ||
    sources.some((source,i)=>source.sourceId!==sourceIds[i] || !source.verification || !source.applicability))
    reject('SOURCE_EVIDENCE')
  const missing=row.technical.expectedReviewDimensions.filter(key=>
    !JSON.stringify(row.technical.observedScopes).includes(key))
  if(JSON.stringify(missing)!==JSON.stringify(row.technical.dimensionsNotEvidencedInArchivedCheckFields))
    reject('DIMENSION_TRUTH')
 }
 if(templates.size!==3||actual.size!==32)reject('COVERAGE')
 return {rules:32,checkEdges:edges,distinctTemplates:templates.size,semanticValidated:0,publicationAllowed:false}
}
