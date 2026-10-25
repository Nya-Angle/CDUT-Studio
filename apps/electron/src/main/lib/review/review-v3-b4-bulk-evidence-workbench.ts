/**
 * Dev-B R26: full eight-domain historical-source workbench.
 * Technical repair queue only. A frozen Check, observed byte, SourceRef,
 * accepted B2 receipt or R25 original-clause match is NEVER a school policy.
 * No mutations of D4, Case, Run, Principal, Owner or formal Plan.
 */
import { createHash } from 'node:crypto'
import { auditB4FrozenUnknownCoverage } from './review-v3-b4-conflict-and-instance-guard'
import type { B4Archive, B4ArchiveTemplate, B4ArchiveCheck } from './review-v3-b4-obligation-lineage'
import type { B4R25ClauseAudit } from './review-v3-b4-r25-raw-clause-condition'

const fail=(code:string):never=>{throw new Error('B_R26_'+code)}
const sha64=/^[0-9a-f]{64}$/
const digest=(bytes:Uint8Array):string=>createHash('sha256').update(bytes).digest('hex')
const domains=['G01','G02','G03','G04','G05','G06','G07','G08'] as const
export type B26IssueKind =
  'ORIGINAL_RAW_NOT_OBSERVED'|'ORIGINAL_VERSION_CONFLICT'|
  'UNVERIFIED_SOURCE_APPLICABILITY'|'UNSCOPED_OBJECT_AND_CASE'|
  'HIGH_RISK_CLAUSE_REQUIRES_INDEPENDENT_GOLD'
export interface B26OriginalObservation {
  templateId:string
  /** Real original bytes, not a claimed digest or text-normalized copy. */
  bytes:Uint8Array
  provenance:string
}
export interface B26SourceObservation {
  checkId:string
  sourceId:string
  documentVersionId:string
  locator:string
  /**
   * Purely documentary technical observation, NOT a school approval.
   * This MUST match the precise archived SourceRef locator and version.
   */
  observationId:string
  observedSha256:string
}
export interface B26ScopeObservation {
  checkId:string
  objectKey:string
  subjectId:string
  scopeDescription:string
  /** Scope submitted by a human is never a school/owner authorization. */
  observationId:string
}
export interface B26TemplateView {
  domain:string;templateId:string;frozenSourceSha256:string
  frozenSourceVersion:string;historicalCandidateOnly:true
  original:'RAW_NOT_OBSERVED'|'RAW_BYTES_MATCH_TECHNICAL_ONLY'|'RAW_VERSION_CONFLICT'
  originalObservedSha256:string|null
  checks:number;sourceUnknown:number;scopeUnknown:number
  schoolPolicyVerified:false;publicationAllowed:false
}
export interface B26Issue {
  id:string;domain:string;templateId:string;checkId:string|null
  sourceId:string|null;ruleId:string|null;kind:B26IssueKind
  state:'missing'|'candidate-observed-unverified'|'quarantined'|'awaiting-school-gold'
  rawVersion:string;reason:string;priority:1|2|3
  canAutoClear:false;schoolAuthorityVerified:false;publicationAllowed:false
}
export interface B26Workbench {
  schemaVersion:'review-v3-b26-source-workbench/1'
  frozenD4SHA:'b68443b23293b4714e61a3b81383d3d3a56434fc'
  candidateOnly:true;publicationAllowed:false;schoolAuthorityVerified:false
  counts:{domains:8;templates:50;checks:3875;originalsSupplied:number
    originalsMatching:number;originalsConflicting:number;unscoped:34
    unknownSourceRefs:4163;highRisk:32;unresolved:number}
  templates:B26TemplateView[]
  issues:B26Issue[]
  snapshotSha256:string
}
export interface B26BatchOptions {
  rawOriginals?:readonly B26OriginalObservation[]
  sourceObservations?:readonly B26SourceObservation[]
  scopeObservations?:readonly B26ScopeObservation[]
  /** Must come from independently validated R25 original clause audit. */
  highRisk?:B4R25ClauseAudit
}
function key(...parts:(string|null)[]):string{return JSON.stringify(parts)}
function validText(x:unknown):x is string{return typeof x==='string'&&x.trim().length>0}
const newIssue=(domain:string,templateId:string,checkId:string|null,
  sourceId:string|null,ruleId:string|null,kind:B26IssueKind,
  state:B26Issue['state'],reason:string,priority:1|2|3):B26Issue=>({
    id:key(domain,templateId,checkId,sourceId,ruleId,kind),
    domain,templateId,checkId,sourceId,ruleId,kind,state,reason,priority,
    rawVersion:'FROZEN_D4_CANDIDATE_ONLY',canAutoClear:false,
    schoolAuthorityVerified:false,publicationAllowed:false,
  })
const templateOf=(archives:Readonly<Record<string,B4Archive>>,templateId:string):
  {domain:string;template:B4ArchiveTemplate}|undefined=>{
  for(const domain of domains){
    const template=archives[domain]?.templates.find(x=>x.templateId===templateId)
    if(template)return {domain,template}
  }
  return undefined
}
function observationMap<T extends {observationId:string}>(
  values:readonly T[],keyOf:(v:T)=>string,kind:string):Map<string,T>{
  const result=new Map<string,T>(),ids=new Set<string>()
  for(const v of values){
    if(!v||!validText(v.observationId)||ids.has(v.observationId))
      fail(kind+'_OBSERVATION_ID')
    ids.add(v.observationId)
    const key=keyOf(v)
    if(result.has(key))fail(kind+'_DUPLICATE_SCOPE')
    result.set(key,v)
  }
  return result
}
const sourceFor=(archives:Readonly<Record<string,B4Archive>>,checkId:string,
 sourceId:string):{domain:string;template:B4ArchiveTemplate;check:B4ArchiveCheck}|undefined=>{
 for(const domain of domains)for(const t of archives[domain]?.templates??[]){
  const check=t.obligations.find(x=>x.checkId===checkId)
  if(check&&check.sourceIds.includes(sourceId))return {domain,template:t,check}
 }
 return undefined
}

/**
 * Input completeness is all 8 archived domains, not an arbitrary partial list.
 * The queue covers EVERY frozen unknown source link, every G01 scope gap,
 * every historic original (if raw bytes were not supplied now), and every
 * independently evidenced high-risk clause. A human observation can annotate
 * one exact issue but cannot erase it or change frozen counts.
 */
export function buildB26HistoricalEvidenceWorkbench(
  archives:Readonly<Record<string,B4Archive>>,options:B26BatchOptions={},
):B26Workbench{
  const gaps=auditB4FrozenUnknownCoverage(archives)
  const raw=options.rawOriginals??[],sources=options.sourceObservations??[],
    scopes=options.scopeObservations??[]
  if(raw.length>50||sources.length>4163||scopes.length>34)fail('INPUT_BOUNDS')
  const rawMap=new Map<string,{sha:string;provenance:string}>()
  for(const file of raw){
    if(!file||!validText(file.templateId)||!validText(file.provenance)||
       !(file.bytes instanceof Uint8Array)||file.bytes.length<1||
       file.bytes.length>16*1024*1024||rawMap.has(file.templateId))
      fail('RAW_ORIGINAL_INPUT')
    if(!templateOf(archives,file.templateId))fail('RAW_UNKNOWN_TEMPLATE')
    rawMap.set(file.templateId,{sha:digest(file.bytes),provenance:file.provenance})
  }
  const sourceMap=observationMap(sources,x=>key(x.checkId,x.sourceId),'SOURCE')
  const scopeMap=observationMap(scopes,x=>x.checkId,'SCOPE')
  for(const source of sources){
    const found=sourceFor(archives,source.checkId,source.sourceId)
    const exact=found?.check.sources.find(x=>x.sourceId===source.sourceId)
    if(!found||!exact||exact.sourceApplicability!=='unknown' ||
       exact.documentVersionId!==source.documentVersionId ||
       exact.locator!==source.locator || !sha64.test(source.observedSha256) ||
       !validText(source.observationId))fail('SOURCE_PROVENANCE_MISMATCH')
  }
  const scopeKeys=new Set(gaps.scopeGaps.map(x=>x.checkId))
  for(const item of scopes){
    if(!scopeKeys.has(item.checkId)||!validText(item.objectKey)||
       !validText(item.subjectId)||!validText(item.scopeDescription))
      fail('SCOPE_NOT_IN_FROZEN_GAP')
  }
  const templates:B26TemplateView[]=[],issues:B26Issue[]=[]
  let matching=0,conflicting=0
  for(const domain of domains)for(const t of archives[domain]!.templates){
    const seen=rawMap.get(t.templateId)
    const original=!seen?'RAW_NOT_OBSERVED':
      seen.sha===t.sourceSha256?'RAW_BYTES_MATCH_TECHNICAL_ONLY':'RAW_VERSION_CONFLICT'
    if(original==='RAW_BYTES_MATCH_TECHNICAL_ONLY')matching++
    if(original==='RAW_VERSION_CONFLICT')conflicting++
    templates.push({
      domain,templateId:t.templateId,frozenSourceSha256:t.sourceSha256,
      frozenSourceVersion:t.sourceVersion,historicalCandidateOnly:true,
      original,originalObservedSha256:seen?.sha??null,checks:t.obligations.length,
      sourceUnknown:t.obligations.reduce((sum,c)=>sum+c.sources.filter(s=>
        s.sourceApplicability==='unknown').length,0),
      scopeUnknown:t.obligations.filter(x=>!x.genericScope&&!x.caseScopeJustification).length,
      schoolPolicyVerified:false,publicationAllowed:false,
    })
    issues.push(newIssue(domain,t.templateId,null,null,null,
      original==='RAW_VERSION_CONFLICT'?'ORIGINAL_VERSION_CONFLICT':'ORIGINAL_RAW_NOT_OBSERVED',
      original==='RAW_VERSION_CONFLICT'?'quarantined':
        original==='RAW_BYTES_MATCH_TECHNICAL_ONLY'?'candidate-observed-unverified':'missing',
      original==='RAW_BYTES_MATCH_TECHNICAL_ONLY'?'Raw byte identity matches historic candidate; school status unknown':
        original==='RAW_VERSION_CONFLICT'?'Observed bytes differ; keep both versions quarantined':
        'Current operation has no independently read original bytes',2))
  }
  const index=new Map<string,{domain:string;templateId:string}>()
  for(const t of templates)for(const check of archives[t.domain]!.templates.find(
    x=>x.templateId===t.templateId)!.obligations)index.set(check.checkId,t)
  for(const item of gaps.sourceGaps){
    const source=sourceMap.get(key(item.checkId,item.sourceId))
    issues.push(newIssue(item.domain,item.templateId,item.checkId,item.sourceId,null,
      'UNVERIFIED_SOURCE_APPLICABILITY',
      source?'candidate-observed-unverified':'missing',
      source?'Exact SourceRef locator/version observed; current school applicability still UNKNOWN':
        'No source observation or independent current issuer/policy Gold',1))
  }
  for(const item of gaps.scopeGaps){
    const scope=scopeMap.get(item.checkId)
    issues.push(newIssue(item.domain,item.templateId,item.checkId,null,null,
      'UNSCOPED_OBJECT_AND_CASE',scope?'candidate-observed-unverified':'missing',
      scope?'A specific object/Subject scope was described, not approved':
        'Frozen Check has no established object/case scope',1))
  }
  const risk=options.highRisk
  if(risk!==undefined){
    if(risk.rules!==32||risk.independentlyRawBound!==32||
       risk.publicationAllowed!==false||risk.schoolPolicyVerified!==false||
       !Array.isArray(risk.proofs)||risk.proofs.length!==32)
      fail('R25_AUDIT_REQUIRED')
    const keys=new Set<string>()
    for(const proof of risk.proofs){
      const match=templateOf(archives,proof.templateId)
      const k=key(proof.templateId,proof.ruleId)
      if(!match||match.domain!==proof.domain||keys.has(k)||
         proof.publicationAllowed!==false||proof.semanticValidated!==false||
         proof.technicalPredicateImplemented!==false||
         !proof.checkIds.length||proof.checkIds.some(c=>!index.has(c)||
           index.get(c)!.templateId!==proof.templateId))
        fail('R25_HIGH_RISK_PROVENANCE')
      keys.add(k)
      issues.push(newIssue(proof.domain,proof.templateId,null,null,proof.ruleId,
        'HIGH_RISK_CLAUSE_REQUIRES_INDEPENDENT_GOLD','awaiting-school-gold',
        'Original rule/check linked only technically; independent business Gold not provided',1))
    }
  }else{
    // R25 is an optional independently verified dependency; absence is not
    // evidence that the 32 obligations have been independently accepted.
    issues.push(newIssue('G03','g03-t12',null,null,'R25_32_GROUP',
      'HIGH_RISK_CLAUSE_REQUIRES_INDEPENDENT_GOLD','awaiting-school-gold',
      'R25 high-risk clause evidence dependency not supplied',1))
  }
  issues.sort((a,b)=>a.priority-b.priority||a.id.localeCompare(b.id))
  const ids=new Set(issues.map(x=>x.id))
  if(ids.size!==issues.length||templates.length!==50||
     issues.filter(x=>x.kind==='UNVERIFIED_SOURCE_APPLICABILITY').length!==4163||
     issues.filter(x=>x.kind==='UNSCOPED_OBJECT_AND_CASE').length!==34)
    fail('QUEUE_COVERAGE')
  const counts={
    domains:8 as const,templates:50 as const,checks:3875 as const,
    originalsSupplied:raw.length,originalsMatching:matching,
    originalsConflicting:conflicting,unscoped:34 as const,
    unknownSourceRefs:4163 as const,highRisk:32 as const,unresolved:issues.length,
  }
  const snapshotSha256=createHash('sha256').update(JSON.stringify({
    templates,issues,counts,
  })).digest('hex')
  return {schemaVersion:'review-v3-b26-source-workbench/1',
    frozenD4SHA:'b68443b23293b4714e61a3b81383d3d3a56434fc',
    candidateOnly:true,publicationAllowed:false,schoolAuthorityVerified:false,
    counts,templates,issues,snapshotSha256}
}
export interface B26IssuePage {
  total:number;offset:number;limit:number;nextOffset:number|null
  snapshotSha256:string;items:B26Issue[]
}
/** Stable, bounded virtualized queue for B1 author or reviewer workbench UI. */
export function pageB26EvidenceIssues(work:B26Workbench,
 options:{offset?:number;limit?:number;domain?:string;kind?:B26IssueKind;
   state?:B26Issue['state']}={}):B26IssuePage{
  if(!work||work.schemaVersion!=='review-v3-b26-source-workbench/1'||
     work.candidateOnly!==true||work.publicationAllowed!==false||
     !sha64.test(work.snapshotSha256)||!Array.isArray(work.issues))
    fail('INVALID_WORKBENCH')
  const offset=options.offset??0,limit=options.limit??50
  if(!Number.isSafeInteger(offset)||offset<0||!Number.isSafeInteger(limit)||
     limit<1||limit>200||options.domain!==undefined&&
     !domains.some(x=>x===options.domain))fail('INVALID_PAGE')
  const filtered=work.issues.filter(x=>
    (options.domain===undefined||x.domain===options.domain)&&
    (options.kind===undefined||x.kind===options.kind)&&
    (options.state===undefined||x.state===options.state))
  return {total:filtered.length,offset,limit,
    nextOffset:offset+limit<filtered.length?offset+limit:null,
    snapshotSha256:work.snapshotSha256,items:filtered.slice(offset,offset+limit)}
}
