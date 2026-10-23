/**
 * Dev-B R30–R32 display-only composition. Source of truth is a fresh C Main
 * read of existing B20/B30/R26/R27 interfaces, not browser-provided identity.
 * The view model never manufactures Case, grant, Gold, Check PASS or source.
 */
import type { B20CurrentCandidateRead } from '../../../main/lib/review/review-v3-b1-b2-main-read-bundle-v3-b'
import type { B30SourceInventory } from '../../../main/lib/review/review-v3-b30-current-materials-read'
import type { B26Workbench, B26Issue, B26IssueKind } from '../../../main/lib/review/review-v3-b4-bulk-evidence-workbench'
import type { B27Readiness } from '../../../main/lib/review/review-v3-b-candidate-readiness-workbench'
import type { B23RecoveryPreflight } from '../../../main/lib/review/review-v3-b1-b2-recovery-preflight-v3-b'
import type { B3RouteState } from '../../../main/lib/review/review-intake-routing-adapter-v3-b3'
import type { B29HumanAuthorIntent,B29UnmatchedAuthorDraft } from '../../../main/lib/review/review-v3-b3-unmatched-author-bootstrap'

const reject=(code:string):never=>{throw new Error('B_PRODUCT_'+code)}
const sha=/^[a-f0-9]{64}$/
export type { B29HumanAuthorIntent, B29UnmatchedAuthorDraft }
export interface B32ProductRead {
  schemaVersion:'review-v3-b32-product-read/1'
  /** Supplied by a C Main port; displaying the value never grants access. */
  readVersion:string
  caseCandidateId:string
  mainConnection:'C_MAIN_READ_CONNECTED'|'NOT_INSTALLED'
  route:B3RouteState
  inventory:B30SourceInventory|null
  candidate:B20CurrentCandidateRead|null
  readiness:B27Readiness|null
  recovery:B23RecoveryPreflight|null
  historical:B26Workbench|null
  candidateOnly:true
  publicationAllowed:false
  businessWriteAllowed:false
  schoolPolicyVerified:false
}
export interface B32MaterialRow {
  candidateId:string;fileName:string;role:string;subjectId:string|null
  documentVersionId:string;rawSha256:string;byteLength:number
  sourceType:'ZIP_ENTRY'|'DIRECT_MATERIAL';needsHumanAction:boolean
  reviewReason:string
}
export interface B32CheckRow {
  key:string;checkKey:string;targetKey:string;objectKey:string;subjectId:string
  applicability:'applicable'|'not-applicable'|'unknown'
  sources:Array<{
    sourceId:string;state:string;documentVersionId:string|null
    parserBlockId:string|null;parseRevision:string|null;rawSha256:string|null
    locator:string;reason:string
  }>
  unresolved:boolean
}
export interface B32ProductView {
  readVersion:string;caseCandidateId:string
  routeStatus:B3RouteState['status'];mainConnected:boolean
  totalStaged:number;zipEntries:number;applications:number;unassigned:number
  materials:B32MaterialRow[];checks:B32CheckRow[]
  outstandingHistorical:number;sourceUnknown:number;scopeUnknown:number
  availableForHumanAuthor:boolean
  readyForSchoolApproval:false
  warnings:string[]
}
/** Parser extent coordinates are owned by B2; never invent a page/block. */
function locatorOf(extent:unknown):string {
  if(!extent||typeof extent!=='object')return '未提供可信解析定位'
  const r=extent as Record<string,unknown>
  const block=r.source&&typeof r.source==='object' ?
    (r.source as Record<string,unknown>).blockId : null
  return typeof block==='string'&&block?block:'需重新读取解析块位置'
}
/**
 * Fail closed on incomplete material universe, drifted B20 source snapshots
 * or changed candidate read authority. Route-alone mode is allowed only when
 * Main separately provided actual complete B30 physical material inventory.
 */
export function buildB32ProductView(data:B32ProductRead):B32ProductView {
 if(!data||data.schemaVersion!=='review-v3-b32-product-read/1'||
    typeof data.readVersion!=='string'||!data.readVersion.trim()||
    data.candidateOnly!==true||data.publicationAllowed!==false||
    data.businessWriteAllowed!==false||data.schoolPolicyVerified!==false||
    !data.route||!data.caseCandidateId?.trim())reject('INVALID_READ')
 const connected=data.mainConnection==='C_MAIN_READ_CONNECTED'
 if(!connected){
  if(data.mainConnection!=='NOT_INSTALLED'||data.inventory!==null||
     data.candidate!==null||data.readiness!==null)reject('DISCONNECTED_DATA_FORGED')
  return {
   readVersion:data.readVersion,caseCandidateId:data.caseCandidateId,
   routeStatus:data.route.status,mainConnected:false,totalStaged:0,
   zipEntries:0,applications:0,unassigned:0,
   materials:[],checks:[],outstandingHistorical:0,
   sourceUnknown:0,scopeUnknown:0,availableForHumanAuthor:false,
   readyForSchoolApproval:false,warnings:['真实 Main 候选读接口未安装；不得把演示材料当成实际暂存资料'],
  }
 }
 const inventory=data.inventory
 if(!inventory)throw new Error('B_PRODUCT_CURRENT_MATERIAL_UNIVERSE_INVALID')
 if(inventory.schemaVersion!=='review-v3-b30-complete-source-inventory/1'||
    inventory.candidateOnly!==true||inventory.publicationAllowed!==false||
    inventory.caseCandidateId!==data.caseCandidateId||
    !sha.test(inventory.scopeIdentitySha256)||
    inventory.allStagedCount!==inventory.sources.length||
    new Set(inventory.sources.map(x=>x.candidateId)).size!==inventory.sources.length||
    inventory.applicationCount!==inventory.sources.filter(x=>x.role==='application').length||
    inventory.unassignedCount!==inventory.sources.filter(x=>x.role==='unassigned').length||
    inventory.archivedZipEntryCount!==inventory.sources.filter(x=>x.archiveDerived).length||
    inventory.sources.some(x=>x.rawBytesRechecked!==true||
      !sha.test(x.rawSha256)||!x.candidateId||!x.documentVersionId))
   reject('CURRENT_MATERIAL_UNIVERSE_INVALID')
 const candidate=data.candidate
 if(candidate){
  if(candidate.schemaVersion!=='review-v3-b20-main-read-bundle/1'||
     candidate.candidateOnly!==true||candidate.publicationAllowed!==false||
     candidate.caseCandidateId!==data.caseCandidateId||
     candidate.ownerId!==inventory.ownerId||
     candidate.ownerGeneration!==inventory.ownerGeneration||
     candidate.frozenFingerprint!==candidate.candidateProvenance?.planFingerprint||
     candidate.businessWriteAllowed!==false||
     candidate.candidateProvenance?.businessWriteAllowed!==false)
    reject('CANDIDATE_SCOPE_STALE')
  if(!data.readiness||
     data.readiness.schemaVersion!=='review-v3-b27-candidate-readiness/1'||
     data.readiness.caseCandidateId!==candidate.caseCandidateId||
     data.readiness.ownerId!==candidate.ownerId||
     data.readiness.authorFingerprint!==candidate.frozenFingerprint||
     data.readiness.publicationAllowed!==false||
     data.readiness.readyForFormalDecision!==false)
    reject('READINESS_STALE')
 }else if(data.readiness!==null)reject('READINESS_WITHOUT_CANDIDATE')
 const materialsById=new Map(inventory.sources.map(x=>[x.candidateId,x]))
 const warnings:string[]=[]
 if(inventory.applicationCount!==1)warnings.push('申请主体数量不是 1，禁止自动选择或生成单主体模板')
 if(inventory.unassignedCount)warnings.push('存在未确认角色的原件，需要先分配材料用途')
 if(data.recovery?.archives.length)warnings.push('检测到历史 ZIP：重新打开必须进行本机 Picker、原件及解析确认')
 const materials=inventory.sources.map(x=>({
  candidateId:x.candidateId,fileName:x.fileName,role:x.role,
  subjectId:x.subjectId,documentVersionId:x.documentVersionId,
  rawSha256:x.rawSha256,byteLength:x.byteLength,
  sourceType:x.archiveDerived?'ZIP_ENTRY' as const:'DIRECT_MATERIAL' as const,
  needsHumanAction:x.role==='unassigned'||!x.subjectId,
  reviewReason:x.role==='unassigned'?'材料角色未确认':
    !x.subjectId?'未确认 Subject':'当前 B2 原件字节已读回，仍须 Main 授权和来源审核',
 }))
 const checks:B32CheckRow[]=(candidate?.candidateProvenance.bindings??[]).map(binding=>{
  const rows=binding.sources.map(source=>{
   const id=source.candidateId
   if(source.state==='linked-candidate'){
    const current=id?materialsById.get(id):undefined
    if(!current)throw new Error('B_PRODUCT_CHECK_LINK_TO_MISSING_MATERIAL')
    if(current.rawSha256!==source.rawSha256||
       current.documentVersionId!==source.documentVersionId||
       current.subjectId!==source.subjectId)
      reject('CHECK_SOURCE_VERSION_OR_SUBJECT_STALE')
   }
   const locator=locatorOf(source.readExtent)
   return {sourceId:source.sourceId,state:source.state,
     documentVersionId:source.documentVersionId,
     parserBlockId:source.blockId,parseRevision:source.parseRevision,
     rawSha256:source.rawSha256,locator,reason:source.reason}
  })
  return {
   key:JSON.stringify([binding.checkKey,binding.targetKey]),
   checkKey:binding.checkKey,targetKey:binding.targetKey,
   objectKey:binding.objectKey,subjectId:binding.subjectId,
   applicability:binding.applicability,sources:rows,
   unresolved:binding.applicability==='unknown'||rows.some(x=>x.state!=='linked-candidate'),
  }
 })
 if(new Set(checks.map(x=>x.key)).size!==checks.length)
   reject('DUPLICATE_CHECK_TARGET')
 if(data.historical&&(
   data.historical.schemaVersion!=='review-v3-b26-source-workbench/1'||
   data.historical.publicationAllowed!==false||
   data.historical.counts.unknownSourceRefs!==4163||
   data.historical.counts.unscoped!==34||
   data.historical.counts.templates!==50))
   reject('HISTORICAL_GAPS_DRIFTED')
 return {readVersion:data.readVersion,caseCandidateId:data.caseCandidateId,
  routeStatus:data.route.status,mainConnected:true,
  totalStaged:inventory.allStagedCount,zipEntries:inventory.archivedZipEntryCount,
  applications:inventory.applicationCount,unassigned:inventory.unassignedCount,
  materials,checks,outstandingHistorical:data.historical?.issues.length??0,
  sourceUnknown:data.historical?.counts.unknownSourceRefs??0,
  scopeUnknown:data.historical?.counts.unscoped??0,
  availableForHumanAuthor:data.route.status==='unmatched'&&inventory.applicationCount===1&&
    inventory.unassignedCount===0&&
    new Set(inventory.sources.map(x=>x.subjectId)).size===1&&
    inventory.sources.length>0,
  readyForSchoolApproval:false,warnings}
}
/** Filtering is a view operation; the complete inventory remains in the read snapshot. */
export function filterB32Materials(
 rows:readonly B32MaterialRow[], query:string, role:'all'|'application'|'supporting'|'unassigned'='all',
):B32MaterialRow[]{
 const needle=query.trim().toLocaleLowerCase()
 return rows.filter(row=>(role==='all'||row.role===role)&&(
  !needle||[row.fileName,row.candidateId,row.subjectId??'',row.documentVersionId,
    row.rawSha256,row.sourceType].some(value=>value.toLocaleLowerCase().includes(needle))))
}
export function filterB32Checks(
 rows:readonly B32CheckRow[],query:string,onlyUnresolved=false,
):B32CheckRow[]{
 const needle=query.trim().toLocaleLowerCase()
 return rows.filter(row=>(!onlyUnresolved||row.unresolved)&&(
  !needle||[row.checkKey,row.targetKey,row.objectKey,row.subjectId,
    ...row.sources.flatMap(source=>[source.sourceId,source.locator,source.reason,
      source.rawSha256??'',source.documentVersionId??''])].some(
    value=>value.toLocaleLowerCase().includes(needle))))
}
export function pageB32Checks(rows:readonly B32CheckRow[],offset:number,limit=25):
 {total:number;items:B32CheckRow[];nextOffset:number|null}{
 if(!Number.isSafeInteger(offset)||offset<0||!Number.isSafeInteger(limit)||
    limit<1||limit>100)reject('CHECK_PAGE_INVALID')
 return {total:rows.length,items:rows.slice(offset,offset+limit),
   nextOffset:offset+limit<rows.length?offset+limit:null}
}
export function pageB32Issues(data:B26Workbench|null,offset:number,limit=25,
 filter?:{domain?:string;kind?:B26IssueKind;query?:string}):
 {total:number;items:B26Issue[];nextOffset:number|null}{
 if(!Number.isSafeInteger(offset)||offset<0||!Number.isSafeInteger(limit)||
    limit<1||limit>100)reject('ISSUE_PAGE_INVALID')
 const needle=filter?.query?.trim().toLocaleLowerCase()??''
 const filtered=(data?.issues??[]).filter(x=>
  (!filter?.domain||x.domain===filter.domain)&&
  (!filter?.kind||x.kind===filter.kind)&&
  (!needle||[x.templateId,x.checkId??'',x.sourceId??'',x.ruleId??'',
   x.reason,x.id].some(value=>value.toLocaleLowerCase().includes(needle))))
 return {total:filtered.length,items:filtered.slice(offset,offset+limit),
  nextOffset:offset+limit<filtered.length?offset+limit:null}
}
export function assertB32StillCurrent(before:B32ProductRead,after:B32ProductRead):void{
 const a=buildB32ProductView(before),b=buildB32ProductView(after)
 if(!a.mainConnected||!b.mainConnected||
    a.caseCandidateId!==b.caseCandidateId||
    a.readVersion!==b.readVersion||
    JSON.stringify(before.route)!==JSON.stringify(after.route)||
    JSON.stringify(before.readiness)!==JSON.stringify(after.readiness)||
    JSON.stringify(before.recovery)!==JSON.stringify(after.recovery)||
    JSON.stringify(before.candidate)!==JSON.stringify(after.candidate)||
    JSON.stringify(before.inventory)!==JSON.stringify(after.inventory)||
    before.candidate?.frozenFingerprint!==after.candidate?.frozenFingerprint||
    before.candidate?.authorRevisionDigest!==after.candidate?.authorRevisionDigest||
    before.candidate?.candidateProvenance.snapshotHash!==
      after.candidate?.candidateProvenance.snapshotHash||
    before.historical?.snapshotSha256!==after.historical?.snapshotSha256)
  reject('REOPENED_CURRENT_SOURCE_CHANGED')
}
