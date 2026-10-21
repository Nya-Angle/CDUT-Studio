/**
 * Dev-B R29: user-confirmed B3 unmatched case -> existing B1 held author
 * editor candidate. No new autonomous/generic "school approved" template.
 * No writes. Call B1's existing authenticated save/freeze flow separately.
 *
 * The caller must obtain the complete current B2 staged set from an existing
 * Main-derived scope; we do not authenticate any Renderer claims here.
 */
import { createHash } from 'node:crypto'
import {
  compileReviewB1Plan, type B1AuthorDocument, type ImmutablePlanDescriptorB1,
} from './review-template-plan-adapter-v3-b1'
import type { B2MaterialCandidate } from './review-intake-adapter-v3-b2'
import type { B3RouteState } from './review-intake-routing-adapter-v3-b3'
import type { B26Workbench } from './review-v3-b4-bulk-evidence-workbench'

const sha64=/^[0-9a-f]{64}$/
const safeId=/^[A-Za-z][A-Za-z0-9._-]{0,79}$/
const subjectId=/^[A-Za-z][A-Za-z0-9._:/-]{0,127}$/
const refuse=(reason:string):never=>{throw new Error('B_R29_'+reason)}
const present=(x:unknown):x is string=>typeof x==='string'&&x.trim().length>0
export interface B29HumanAuthorIntent {
  templateId:string
  name:string
  purpose:string
  scenario:string
  objectKey:string
  humanRequirement:string
  recordedBy:string
  reviewerRole:string
  /** Caller must record an explicit local human choice for unmatched business. */
  userConfirmedAuthoring:true
}
export interface B29UnmatchedAuthorDraft {
  schemaVersion:'review-v3-b29-unmatched-author-draft/1'
  caseCandidateId:string
  ownerId:string;ownerGeneration:number;subjectId:string
  sourceCandidates:Array<{
    candidateId:string;documentVersionId:string;rawSha256:string
    role:'application'|'supporting'
  }>
  rawMaterialsRevalidatedByB:false
  currentMainAuthorityRecheckedByC:false
  requiresMainPickerAndRoleRecheck:true
  candidateOnly:true;publicationAllowed:false;businessWriteAllowed:false
  schoolPolicyVerified:false
  planCondition:'unknown'
  document:B1AuthorDocument
  descriptor:ImmutablePlanDescriptorB1
  snapshotSha256:string
}
/**
 * Must not merge multi-Subject or conflicting applications automatically.
 * Preserves every source as a B1 user-declared SOURCE reference, but its file
 * SHA is only a technical candidate record until C Main verifies real bytes.
 */
export function prepareB29UnmatchedAuthorDraft(
  routing:B3RouteState,
  materialCandidates:readonly B2MaterialCandidate[],
  intent:B29HumanAuthorIntent,
  historical?:B26Workbench,
):B29UnmatchedAuthorDraft{
  if(!routing||routing.status!=='unmatched'||routing.chosen!==undefined||
     routing.remainingMs!==0||!routing.reason?.trim())
    refuse('EXPLICIT_UNMATCHED_ROUTE_REQUIRED')
  if(!intent||intent.userConfirmedAuthoring!==true||
     !safeId.test(intent.templateId)||!present(intent.name)||
     !present(intent.purpose)||!present(intent.scenario)||
     !present(intent.objectKey)||!present(intent.humanRequirement)||
     !present(intent.recordedBy)||!present(intent.reviewerRole))
    refuse('HUMAN_AUTHOR_INTENT_INCOMPLETE')
  if(historical){
    if(historical.schemaVersion!=='review-v3-b26-source-workbench/1'||
       historical.publicationAllowed!==false||
       historical.templates.some(t=>t.templateId===intent.templateId))
      refuse('HISTORICAL_FROZEN_ID_COLLISION')
  }
  if(!Array.isArray(materialCandidates)||materialCandidates.length<1||
     materialCandidates.length>100)refuse('MATERIAL_SET_REQUIRED')
  const materials=[...materialCandidates]
  const owners=new Set(materials.map(x=>JSON.stringify([
    x?.ownerId,x?.ownerGeneration,x?.caseCandidateId])))
  const subjects=new Set(materials.map(x=>x?.subjectId))
  const ids=new Set(materials.map(x=>x?.candidateId))
  const versions=new Set(materials.map(x=>x?.documentVersionId))
  const applications=materials.filter(x=>x.role==='application')
  if(owners.size!==1||subjects.size!==1||ids.size!==materials.length||
     versions.size!==materials.length||applications.length!==1||
     materials.some(x=>!x||!present(x.candidateId)||
       !present(x.caseCandidateId)||!present(x.ownerId)||
       !Number.isSafeInteger(x.ownerGeneration)||x.ownerGeneration<0||
       !present(x.documentVersionId)||!present(x.materialId)||
       !sha64.test(x.rawSha256)||!Number.isSafeInteger(x.byteLength)||
       x.byteLength<=0||x.status!=='accepted'||
       !['application','supporting'].includes(x.role)||
       !x.subjectId||!subjectId.test(x.subjectId)||
       !present(x.physicalSourceKey)||!present(x.requestId)))
    refuse('COMPLETE_HOMOGENEOUS_B2_SET_REQUIRED')
  const first=applications[0]
  if(!first)throw new Error('B_R29_MISSING_APPLICATION')
  const sources=materials.map((m,i)=>({
    sourceId:'candidate_source_'+(i+1),
    kind:'user-declared' as const,
    documentVersionId:m.documentVersionId,
    /** Selector, not a direct filesystem path, SHA-derived SourceIdentity, or grant. */
    locator:'b2-candidate:'+m.candidateId,
    recordedBy:intent.recordedBy,
  }))
  const doc:B1AuthorDocument={
    schemaVersion:'review-b1/1',
    templateId:intent.templateId,templateVersion:'draft-1',
    name:intent.name,purpose:intent.purpose,
    fields:[{key:'human_scope_confirmed',label:'业务对象和现行政策适用性已由人确认',
      type:'boolean',required:true,sourceId:sources[0]!.sourceId}],
    sources,
    targets:[{targetKey:'target-primary',objectKey:intent.objectKey,
      subjectId:first.subjectId!,scenario:intent.scenario,
      fieldValues:{human_scope_confirmed:null}}],
    modules:[{moduleId:'human-intake-review',version:'1',dependsOn:[],
      checks:[{checkKey:'unmatched-business-intake',
        requirement:intent.humanRequirement,
        sourceIds:sources.map(x=>x.sourceId),
        targetKeys:['target-primary'],
        condition:{kind:'field-equals',fieldKey:'human_scope_confirmed',equals:true},
        responsibility:intent.reviewerRole}]}],
    stages:[{stageId:'human-intake',role:intent.reviewerRole,mode:'manual'},
      {stageId:'technical-review',role:'author',mode:'technical'}],
    outputs:[{outputId:'candidate-preview',kind:'non-authoritative-business-candidate'}],
    status:'candidate-held',
  }
  const descriptor=compileReviewB1Plan(doc)
  if(descriptor.publicationAllowed!==false||
     descriptor.bindingDetails.length!==1||
     descriptor.bindingDetails[0]?.applicability!=='unknown'||
     descriptor.bindingDetails[0]?.sourceIds.length!==materials.length)
    refuse('NOT_AN_UNCERTAIN_CANDIDATE')
  const records=materials.map(x=>({
    candidateId:x.candidateId,documentVersionId:x.documentVersionId,
    rawSha256:x.rawSha256,role:x.role as 'application'|'supporting',
  }))
  const payload={
    schemaVersion:'review-v3-b29-unmatched-author-draft/1' as const,
    caseCandidateId:first.caseCandidateId,ownerId:first.ownerId,
    ownerGeneration:first.ownerGeneration,subjectId:first.subjectId!,
    sourceCandidates:records,
    rawMaterialsRevalidatedByB:false as const,
    currentMainAuthorityRecheckedByC:false as const,
    requiresMainPickerAndRoleRecheck:true as const,
    candidateOnly:true as const,publicationAllowed:false as const,
    businessWriteAllowed:false as const,schoolPolicyVerified:false as const,
    planCondition:'unknown' as const,
    document:doc,descriptor,
  }
  return {...payload,snapshotSha256:createHash('sha256').update(
    JSON.stringify(payload)).digest('hex')}
}
