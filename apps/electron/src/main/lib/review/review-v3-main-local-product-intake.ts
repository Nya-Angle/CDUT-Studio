/**
 * C11 production Main intake: physical native Case originals -> B2 scoped
 * material staging -> B30 complete inventory -> B3 conservative routing.
 * This is candidate-only. It does NOT manufacture a Run, policy, Check PASS,
 * School ACK or a second durable Case. Main proves bytes on EVERY read.
 */
import {createHash} from 'node:crypto'
import {readFileSync} from 'node:fs'
import {assertReviewPreuploadAllowed} from './review-preupload-gate'
import {resolve} from 'node:path'
import {ipcMain,type IpcMainInvokeEvent} from 'electron'
import {REVIEW_IPC_CHANNELS,rankTemplateCandidates,createGenericModelDeepMatcher,
  type TemplateDeepMatchResponse,type TemplateRouteCatalogEntry} from '@profer/shared'
import {getConfigDir} from '../config-paths'
import {getMainWindow} from '../main-window-state'
import {assertC0ReviewMainSender} from './review-c0-authority'
import {assertSafeReviewStorageId} from './review-storage-id'
import {readAggregate} from './case-store-v2'
import {isNativeWorkspaceCaseV3,updateNativeWorkspaceSettingsV3} from './native-workspace-case-v3'
import {assertC2PhysicalOriginalBytes} from './review-v3-main-trust-port'
import {ReviewB2StagingService,type B2MainContext,type B2MaterialCandidate} from './review-intake-adapter-v3-b2'
import {decodeReviewB2Zip} from './review-zip-intake-v3-b2'
import {readB30AllCurrentMaterials} from './review-v3-b30-current-materials-read'
import {ReviewB3OwnerBoundRouteSession,type B3ManualCatalogEntry,type B3RouteState,type B3RouteSuggestion} from './review-intake-routing-adapter-v3-b3'
import {installBundledR02TechnicalTemplate,isTemplateCandidateHeld,listTemplateVersions} from './template-store'
import {isBundledR02TemplateId,loadBundledR02Template,R02_TECHNICAL_CATALOG} from './r02-template-catalog/r02-technical-catalog'
import {reclassifyForSelectedTemplate} from './material-auto-classification'
import {loadD4UnifiedCatalog,loadD4UnifiedWorkspace} from './review-d4-catalog'
import {prepareB29UnmatchedAuthorDraft,type B29HumanAuthorIntent,
  type B29UnmatchedAuthorDraft} from './review-v3-b3-unmatched-author-bootstrap'
import {classifyD4ApplicationDocuments,getD4TemplateKeywords,
  hasConflictingD4BusinessDeclarations} from './review-v3-d4-content-router'
import {requestT01ModelDraft} from './review-v3-t01-model-draft-service'
import type {B20MainReadScope} from './review-v3-b1-b2-main-read-bundle-v3-b'
import type {B32ProductRead} from '../../../renderer/components/review-v3-dev-b/review-v3-product-workflow'

type Snapshot = NonNullable<ReturnType<typeof readAggregate>>
export interface C11RouteCandidate {
  templateId:string
  templateVersion:string
  name:string
  matchedSignals:string[]
  confidence:number
  autoEligible:boolean
  evidence:string
  tier:'exact'|'keyword'|'business-content-l1'
}
export interface C11MainLocalProductRead {
  read:B32ProductRead
  catalog:B3ManualCatalogEntry[]
  sessionKey:string
  /** All current-catalog matches from exact declarations, business rules and keyword combinations. */
  routeCandidates:C11RouteCandidate[]
  /** Main ran the generic-model/JEV-compatible matcher against this Case's verified bytes. */
  deepMatch?:TemplateDeepMatchResponse
}
export interface C11MainLocalTechnicalChoiceAck {
  candidateOnly:true;technicalChoiceRecorded:true
  caseCandidateId:string;templateId:string;templateVersion:string
  requiresPlanSetup?:true
}
interface Session {
  signature:string
  ctx:B20MainReadScope
  staging:ReviewB2StagingService
  router:ReviewB3OwnerBoundRouteSession
  interrupted:boolean
  chosen:{templateId:string;templateVersion:string}|null
  deepMatch?:TemplateDeepMatchResponse
  deepMatchPending?:Promise<TemplateDeepMatchResponse>
}
const sessions=new Map<string,Session>()
const digest=(value:unknown):string=>
  createHash('sha256').update(JSON.stringify(value)).digest('hex')
function local(event:IpcMainInvokeEvent,caseId:string):{
  aggregate:Snapshot;scope:B20MainReadScope;key:string;signature:string
}{
  assertC0ReviewMainSender(event)
  assertSafeReviewStorageId(caseId,'caseId')
  const main=getMainWindow(),frame=event.senderFrame
  if(!main||main.isDestroyed()||main.webContents.id!==event.sender.id||
     !frame||frame!==event.sender.mainFrame||
     !Number.isSafeInteger(frame.routingId)||frame.routingId<0)
    throw new Error('C11_NATIVE_MAIN_FRAME_UNAVAILABLE')
  const aggregate=readAggregate(caseId)
  if(!aggregate||!isNativeWorkspaceCaseV3(aggregate)||
     aggregate.caseV2.id!==caseId||aggregate.caseV2.stage==='archived')
    throw new Error('C11_NATIVE_CASE_UNAVAILABLE')
  const scope:B20MainReadScope={
    principalId:'local-reviewer',
    sessionId:'local-main:'+event.sender.id,
    senderId:event.sender.id,frameId:frame.routingId,
    ownerId:'native-case-'+caseId,
    ownerGeneration:aggregate.caseV2.revision,
    authorityEpoch:0,caseCandidateId:caseId,
  }
  const signature=digest([
    caseId,scope.sessionId,scope.frameId,scope.ownerGeneration,
    aggregate.caseV2.documents.filter(doc=>doc.active!==false)
      .map(doc=>[doc.versionId,doc.byteHash,doc.role,doc.parseRevision]),
    aggregate.caseV2.subjects.map(item=>[item.id,item.sourceRefs]),
  ])
  return {aggregate,scope,key:scope.sessionId+':'+scope.frameId+':'+caseId,signature}
}
function sameScope(a:B20MainReadScope,b:B20MainReadScope):boolean {
  return a.caseCandidateId===b.caseCandidateId&&a.sessionId===b.sessionId&&
    a.frameId===b.frameId&&a.ownerGeneration===b.ownerGeneration
}
function stageOriginals(aggregate:Snapshot,ctx:B20MainReadScope,staging:ReviewB2StagingService):void {
  assertReviewPreuploadAllowed('read', { caseId: aggregate.caseV2.id })
  const active=aggregate.caseV2.documents.filter(doc=>doc.active!==false)
  if(active.length>500)throw new Error('C11_NATIVE_MORE_THAN_500_CURRENT_MATERIALS')
  // A native Case has no real Subject until its Plan is fixed. For a single
  // application, use the existing Case as a temporary routing group only.
  // Template routing precedes definitive material classification. Multiple
  // documents may jointly form an application, or the business may not have
  // an "application form" at all. Never infer independent cases from role count.
  const mayUseCaseScope=aggregate.caseV2.subjects.length===0
  for(const doc of active){
    // C's disk verifier resolves, rehashes and verifies the exact Case original.
    assertC2PhysicalOriginalBytes(aggregate,doc.versionId)
    const raw=readFileSync(resolve(getConfigDir(),'review-cases',aggregate.caseV2.id,doc.assetPath))
    if(digestBytes(raw)!==doc.byteHash)
      throw new Error('C11_NATIVE_ORIGINAL_CHANGED_AFTER_VERIFY')
    const associated=aggregate.caseV2.subjects.filter(item=>
      item.sourceRefs.some(source=>source.caseId===aggregate.caseV2.id&&
        source.documentVersionId===doc.versionId&&source.parseRevision===doc.parseRevision))
    const subjectId=associated.length===1?associated[0]!.id:
      mayUseCaseScope?'case-scope-'+aggregate.caseV2.id:null
    const role:B2MaterialCandidate['role']=doc.role==='application'?'application':
      // Routing-only provisional role; true rule/attachment slots are fixed
      // after choosing the template, never rewritten here.
      'supporting'
    const add=(fileName:string,bytes:Uint8Array,physicalSourceKey:string,requestId:string,
      inputRole:B2MaterialCandidate['role'],inputSubject:string|null):void=>{
      const grant=staging.grant(ctx)
      staging.stage(ctx,grant.token,{fileName,bytes,physicalSourceKey,requestId,
        role:inputRole,subjectId:inputSubject})
    }
    add(doc.fileName,raw,'native-'+digest([doc.versionId,doc.byteHash]),
      'doc-'+digest(doc.versionId),doc.fileName.toLowerCase().endsWith('.zip')?'unassigned':role,
      doc.fileName.toLowerCase().endsWith('.zip')?null:subjectId)
    // Every accepted native ZIP entry is independently represented, not just
    // the first: names do not authorize a Subject or material role.
    if(doc.fileName.toLowerCase().endsWith('.zip')){
      const entries=decodeReviewB2Zip(raw)
      if(entries.receipts.some(x=>x.status==='rejected'))
        throw new Error('C11_NATIVE_ZIP_HAS_REJECTED_ENTRIES')
      for(const entry of entries.accepted)
        add(entry.entryName.split('/').at(-1)??entry.entryName,entry.bytes,
          'zip-'+digest([doc.versionId,doc.byteHash,entry.index,entry.entryName]),
          'zip-'+digest([doc.versionId,entry.index,entry.entryName]),
          'unassigned',null)
    }
  }
}
function digestBytes(bytes:Uint8Array):string {
  return createHash('sha256').update(bytes).digest('hex')
}
function session(event:IpcMainInvokeEvent,caseId:string):{data:ReturnType<typeof local>;s:Session} {
  const data=local(event,caseId)
  // 缓存会话不得沿用旧授权：每次取用 session 都必须在任何原件重哈希/读取前重验。
  assertReviewPreuploadAllowed('read', { caseId: data.aggregate.caseV2.id })
  for(const key of sessions.keys())if(key.endsWith(':'+caseId)&&key!==data.key)sessions.delete(key)
  let s=sessions.get(data.key)
  if(!s||s.signature!==data.signature||!sameScope(s.ctx,data.scope)){
    const staging=new ReviewB2StagingService()
    stageOriginals(data.aggregate,data.scope,staging)
    s={signature:data.signature,ctx:data.scope,staging,
      router:new ReviewB3OwnerBoundRouteSession(staging,()=>Date.now()),interrupted:false,chosen:null}
    sessions.set(data.key,s)
  }
  // A changed raw source must be detected even when the JSON Case revision is
  // unchanged; an old in-memory B2 copy cannot mask a modified disk original.
  for(const doc of data.aggregate.caseV2.documents.filter(x=>x.active!==false))
    assertC2PhysicalOriginalBytes(data.aggregate,doc.versionId)
  return {data,s}
}
let historicalD4Catalog:B3ManualCatalogEntry[]|undefined
function safeTextList(value:unknown):string[] {
  if(typeof value==='string')return value.trim()?[value.trim()]:[]
  if(!Array.isArray(value))return []
  return value.filter((item):item is string=>typeof item==='string'&&item.trim().length>0)
    .map(item=>item.trim()).slice(0,100)
}
function templateSearchMetadata(value:unknown):{keywords:string[];aliases:string[];description:string} {
  if(!value||typeof value!=='object')return {keywords:[],aliases:[],description:''}
  const item=value as Record<string,unknown>
  const keywords=[
    ...safeTextList(item.keywords),...safeTextList(item.searchKeywords),
    ...safeTextList(item.businessKeywords),...safeTextList(item.subjectKeywords),
  ]
  const aliases=[...safeTextList(item.aliases),...safeTextList(item.synonyms),...safeTextList(item.businessAliases)]
  const descriptions=[item.description,item.purpose,item.summary,item.businessScope]
    .filter((entry):entry is string=>typeof entry==='string'&&entry.trim().length>0)
  for(const key of ['materialSlots','fields','sections']){
    const list=item[key]
    if(!Array.isArray(list))continue
    for(const entry of list.slice(0,100)){
      if(!entry||typeof entry!=='object')continue
      const record=entry as Record<string,unknown>
      for(const label of ['name','label','title','key','description']){
        if(typeof record[label]==='string'&&(record[label] as string).trim()){
          keywords.push((record[label] as string).trim())
        }
      }
      if(Array.isArray(record.criteria))for(const criterion of record.criteria.slice(0,30)){
        if(!criterion||typeof criterion!=='object')continue
        const criterionRecord=criterion as Record<string,unknown>
        for(const label of ['name','label','title','description'])
          if(typeof criterionRecord[label]==='string'&&(criterionRecord[label] as string).trim())
            keywords.push((criterionRecord[label] as string).trim())
      }
    }
  }
  const dedupe=(values:string[])=>[...new Map(values.map(text=>[text.normalize('NFKC').toLocaleLowerCase(),text])).values()]
  return {keywords:dedupe(keywords).slice(0,120),aliases:dedupe(aliases).slice(0,80),
    description:descriptions.join('；').slice(0,2000)}
}
function catalog():B3ManualCatalogEntry[] {
  const published=listTemplateVersions().filter(x=>x.status==='published'&&
    !isBundledR02TemplateId(x.templateId)).map(x=>{
    const metadata=templateSearchMetadata(x)
    const d4Keywords=getD4TemplateKeywords(x.templateId)
    return {
      templateId:x.templateId,templateVersion:String(x.version),name:x.name,
      availability:isTemplateCandidateHeld(x.templateId,x.version)
        ?'candidate-held' as const:'authorized-for-technical-selection' as const,
      keywords:[...metadata.keywords,...d4Keywords],
      aliases:metadata.aliases,description:metadata.description,
    }
  })
  if(!historicalD4Catalog){
    historicalD4Catalog=loadD4UnifiedCatalog().templates.map(entry=>({
      templateId:entry.templateId,
      templateVersion:String(entry.templateVersion),
      name:loadD4UnifiedWorkspace(entry).definitions.templates[0]!.name,
      availability:'authorized-for-technical-selection' as const,
      keywords:getD4TemplateKeywords(entry.templateId),
      aliases:[] as string[],description:'',
    }))
  }
  // R02 业务骨架来自随应用打包的可信索引，与政策资料、校方决定相互独立。
  // 普通草稿不能仿冒这一索引，也无需预先把 143 份大对象全部写入用户配置。
  const localCatalog=[...published,...R02_TECHNICAL_CATALOG]
  const existing=new Set(localCatalog.map(x=>x.templateId+'@'+x.templateVersion))
  return [...localCatalog,...historicalD4Catalog.filter(x=>
    !existing.has(x.templateId+'@'+x.templateVersion))]
}
/** Only Main-verified model results with high confidence enter B3 auto-selection. */
export function trustedC11ModelAutoCandidates(
  result:TemplateDeepMatchResponse|undefined,items:readonly B3ManualCatalogEntry[],
):C11RouteCandidate[] {
  if(result?.scope!=='matched')return []
  return result.matches.flatMap(match=>{
    const entry=items.find(item=>item.templateId===match.templateId&&
      item.templateVersion===match.templateVersion&&
      item.availability==='authorized-for-technical-selection')
    return entry&&Number.isFinite(match.confidence)&&match.confidence>=0.95&&match.confidence<=1?[{
      templateId:entry.templateId,templateVersion:entry.templateVersion,
      name:entry.name,matchedSignals:[],confidence:match.confidence,
      autoEligible:true,evidence:'Main 已核验来源的模型匹配：'+match.reason,
      tier:'keyword' as const,
    }]:[]
  })
}
function evaluate(s:Session,items:B3ManualCatalogEntry[]):B3RouteState {
  const ids=s.staging.listScopedCandidateIds(s.ctx)
  const all=ids.map(id=>s.staging.getCandidate(s.ctx,id))
  const installed=readAggregate(s.ctx.caseCandidateId)?.caseV2
  const selected=items.find(x=>x.templateId===installed?.templateId&&
    x.templateVersion===String(installed?.templateVersion)&&
    x.availability==='authorized-for-technical-selection')
  const activeDocs=installed?.documents.filter(doc=>doc.active!==false)??[]
  const conflictingDeclarations=hasConflictingD4BusinessDeclarations(activeDocs)
  const scoped=all.length>0&&
    all.every(x=>x.role!=='unassigned'&&Boolean(x.subjectId))&&
    new Set(all.map(x=>x.subjectId)).size===1
  if(selected&&scoped&&!s.chosen){
    return {status:'manually-selected',remainingMs:0,
      chosen:{templateId:selected.templateId,templateVersion:selected.templateVersion},
      candidates:[{templateId:selected.templateId,templateVersion:selected.templateVersion,
        confidence:1,reason:'当前原生案卷已持久绑定该模板版本'}],
      reason:'当前案卷已持久绑定模板；不重新启动20秒默认选择'}
  }
  let routeCandidates:C11RouteCandidate[]=scoped
    ?buildRouteCandidatesForRead(items,activeDocs):[]
  // A current, already-authorized template binding is stronger than text classification.
  const selectedCandidate=selected&&scoped?{
    templateId:selected.templateId,templateVersion:selected.templateVersion,
    name:selected.name,matchedSignals:['当前案卷已绑定模板'],
    confidence:1,autoEligible:true,evidence:'current-native-template-binding',tier:'exact' as const,
  }:undefined
  if(selectedCandidate&&!routeCandidates.some(item=>item.templateId===selectedCandidate.templateId&&
    item.templateVersion===selectedCandidate.templateVersion)){
    routeCandidates=[selectedCandidate,...routeCandidates]
  }
  routeCandidates.sort((a,b)=>b.confidence-a.confidence||
    a.templateId.localeCompare(b.templateId)||a.templateVersion.localeCompare(b.templateVersion))
  const ruleAutomatic=selectedCandidate?[selectedCandidate]:routeCandidates.filter(item=>
    item.autoEligible&&items.some(entry=>entry.templateId===item.templateId&&
      entry.templateVersion===item.templateVersion&&
      entry.availability==='authorized-for-technical-selection'))
  // AI 结果只能由 Main 对当前原件与已授权目录调用模型后记录。低置信度
  // 仍可供人工选取，但不会凭模型输出独立触发自动默认绑定。
  const modelAutomatic=trustedC11ModelAutoCandidates(s.deepMatch,items)
  // 多份原件各自声明了不同办理事项时，不允许由一条高置信候选绕过人工分案。
  const automatic=conflictingDeclarations?[]:ruleAutomatic.length?ruleAutomatic:modelAutomatic
  const suggestions:B3RouteSuggestion[]=scoped?automatic.map((candidate,index)=>({
    templateId:candidate.templateId,templateVersion:candidate.templateVersion,
    availability:'authorized-for-technical-selection',
    confidence:candidate.confidence,rank:-index,caseCandidateId:s.ctx.caseCandidateId,
    evidence:all.map(x=>({materialCandidateId:x.candidateId,rawSha256:x.rawSha256,
      reason:candidate.evidence||('规则匹配：'+candidate.matchedSignals.join('、'))})),
  })):[]
  return s.router.evaluate(s.ctx,{
    automaticSelectionEnabled:true,materialCandidates:all,suggestions,
    manualCatalog:items,userInterrupted:s.interrupted,
    ...(s.chosen?{userChoseTemplateId:s.chosen.templateId,
      userChoseTemplateVersion:s.chosen.templateVersion}:{}),
  })
}
export function buildRouteCandidatesForRead(items:B3ManualCatalogEntry[],documents:Snapshot['caseV2']['documents']):C11RouteCandidate[] {
  const active=documents.filter(doc=>doc.active!==false)
  const applications=active.filter(doc=>doc.role==='application')
  if(!active.length)return []
  const d4Matches=classifyD4ApplicationDocuments(items,active)
  const inputs=applications.length?applications:active
  const strongBlocks=inputs.flatMap(doc=>doc.blocks.filter(block=>block.kind==='text'&&
    block.format!=='ocr-text'&&block.format!=='vision-text'))
  const allTextBlocks=inputs.flatMap(doc=>doc.blocks.filter(block=>block.kind==='text'))
  const reliable=applications.length>0&&strongBlocks.length>0&&
    applications.every(doc=>doc.parseStatus==='parsed')
    &&!hasConflictingD4BusinessDeclarations(active)
  const evidenceText=(reliable?strongBlocks:allTextBlocks)
    .map(block=>block.text.slice(0,6000)).join('\n').slice(0,30000)
  const genericMatches=rankTemplateCandidates(evidenceText,items as TemplateRouteCatalogEntry[])
  // An explicit declaration is the strongest signal. Otherwise, exact names/IDs
  // beat keyword candidates, while D4's object+action rules join the keyword tier.
  const explicitD4=d4Matches.filter(match=>match.evidence==='application-declaration')
  if(explicitD4.length){
    return explicitD4.flatMap(match=>{
      const entry=items.find(item=>item.templateId===match.templateId&&
        item.availability==='authorized-for-technical-selection')
      if(!entry)return []
      return [{
        templateId:entry.templateId,templateVersion:entry.templateVersion,name:entry.name,
        matchedSignals:match.matchedSignals,confidence:match.confidence,
        autoEligible:match.confidence>=0.95&&reliable,
        evidence:match.evidence,tier:'exact' as const,
      }]
    })
  }
  const genericExact=genericMatches.filter(match=>match.tier==='exact')
  const genericKeyword=genericMatches.filter(match=>match.tier==='keyword')
  const exactMatches=genericExact.flatMap(match=>{
    const entry=items.find(item=>item.templateId===match.templateId&&
      item.templateVersion===match.templateVersion&&
      item.availability==='authorized-for-technical-selection')
    if(!entry)return []
    const confidence=reliable?match.confidence:Math.min(0.89,match.confidence)
    return [{
      templateId:entry.templateId,templateVersion:entry.templateVersion,name:entry.name,
      matchedSignals:match.matchedSignals,confidence,autoEligible:confidence>=0.95,
      evidence:match.reason,tier:'exact' as const,
    }]
  })
  if(exactMatches.length)return exactMatches
  const combined=new Map<string,C11RouteCandidate>()
  for(const match of d4Matches){
    const entry=items.find(item=>item.templateId===match.templateId&&
      item.availability==='authorized-for-technical-selection')
    if(!entry)continue
    const confidence=reliable?match.confidence:Math.min(0.89,match.confidence)
    const key=entry.templateId+'@'+entry.templateVersion
    combined.set(key,{
      templateId:entry.templateId,templateVersion:entry.templateVersion,name:entry.name,
      matchedSignals:match.matchedSignals,confidence,autoEligible:confidence>=0.95,
      evidence:match.evidence,tier:'business-content-l1',
    })
  }
  for(const match of genericKeyword){
    const entry=items.find(item=>item.templateId===match.templateId&&
      item.templateVersion===match.templateVersion&&
      item.availability==='authorized-for-technical-selection')
    if(!entry)continue
    const confidence=reliable?match.confidence:Math.min(0.89,match.confidence)
    const key=entry.templateId+'@'+entry.templateVersion
    const prior=combined.get(key)
    if(prior){
      const signals=[...new Set([...prior.matchedSignals,...match.matchedSignals])]
      combined.set(key,{...prior,matchedSignals:signals,
        confidence:Math.max(prior.confidence,confidence),
        autoEligible:Math.max(prior.confidence,confidence)>=0.95,
        evidence:prior.evidence+'；'+match.reason})
    }else combined.set(key,{
      templateId:entry.templateId,templateVersion:entry.templateVersion,name:entry.name,
      matchedSignals:match.matchedSignals,confidence,autoEligible:confidence>=0.95,
      evidence:match.reason,tier:'keyword',
    })
  }
  return [...combined.values()].sort((a,b)=>b.confidence-a.confidence||
    b.matchedSignals.length-a.matchedSignals.length||
    a.templateId.localeCompare(b.templateId)||a.templateVersion.localeCompare(b.templateVersion))
}
/** 路由深匹配证据来自同一案卷全部当前原件，而非恰好一份申请主件。 */
export function buildC11DeepMatchEvidence(documents:Snapshot['caseV2']['documents']):string {
  return documents.filter(doc=>doc.active!==false).map(doc=>{
    const body=doc.blocks.filter(block=>block.kind==='text')
      .map(block=>block.text).join('\n').slice(0,8000)
    return '材料名称：'+doc.fileName+'\n材料角色：'+doc.role+'\n'+body
  }).join('\n\n').slice(0,24000)
}
function read(event:IpcMainInvokeEvent,caseId:string):C11MainLocalProductRead {
  const {data,s}=session(event,caseId)
  const current=()=>local(event,caseId).scope
  const inventory=readB30AllCurrentMaterials(current,s.staging)
  const currentCatalog=catalog()
  const route=evaluate(s,currentCatalog)
  if(!sameScope(local(event,caseId).scope,s.ctx))
    throw new Error('C11_NATIVE_CASE_CHANGED_DURING_READ')
  const result:B32ProductRead={
    schemaVersion:'review-v3-b32-product-read/1',
    readVersion:digest([s.signature,inventory.sources.map(x=>[
      x.documentVersionId,x.rawSha256,x.role,x.subjectId]),route]),
    caseCandidateId:caseId,mainConnection:'C_MAIN_READ_CONNECTED',
    route,inventory,candidate:null,readiness:null,recovery:null,historical:null,
    candidateOnly:true,publicationAllowed:false,businessWriteAllowed:false,
    schoolPolicyVerified:false,
  }
  const routeCandidates=buildRouteCandidatesForRead(currentCatalog,data.aggregate.caseV2.documents)
  return {read:result,catalog:currentCatalog,sessionKey:s.signature,routeCandidates,
    ...(s.deepMatch?{deepMatch:s.deepMatch}:{})}
}
export function installC11LocalNativeProductIntake():void {
  ipcMain.handle(REVIEW_IPC_CHANNELS.LOCAL_PRODUCT_CURRENT_V3,
    (event:IpcMainInvokeEvent,caseId:string)=>read(event,caseId))
  ipcMain.handle(REVIEW_IPC_CHANNELS.LOCAL_PRODUCT_DEEP_MATCH_V3,
    async (event:IpcMainInvokeEvent,input:{caseId:string;sessionKey:string;retry?:boolean}):Promise<C11MainLocalProductRead>=>{
      if(!input||typeof input.caseId!=='string'||typeof input.sessionKey!=='string'||!input.sessionKey)
        throw new Error('C11_NATIVE_DEEP_MATCH_INVALID')
      const {data,s}=session(event,input.caseId)
      if(s.signature!==input.sessionKey)throw new Error('C11_NATIVE_ROUTE_SESSION_STALE')
      // 只有明确点击重试才重新调用模型；刷新/轮询复用已有结论。
      if(input.retry===true&&!s.deepMatchPending)s.deepMatch=undefined
      if(!s.deepMatch){
        if(!s.deepMatchPending){
          const evidence=buildC11DeepMatchEvidence(data.aggregate.caseV2.documents)
          if(!evidence.trim())throw new Error('C11_NATIVE_DEEP_MATCH_NO_EVIDENCE')
          const trustedCatalog=catalog()
          const matcher=createGenericModelDeepMatcher(async prompt=>
            (await requestT01ModelDraft(prompt)).raw)
          s.deepMatchPending=matcher.match({caseEvidence:evidence,templates:trustedCatalog})
        }
        try{
          const matched=await s.deepMatchPending
          const current=session(event,input.caseId)
          if(current.s!==s||current.s.signature!==input.sessionKey)
            throw new Error('C11_NATIVE_ROUTE_SESSION_STALE')
          s.deepMatch=matched
        }finally{
          s.deepMatchPending=undefined
        }
      }
      return read(event,input.caseId)
    })
  ipcMain.handle(REVIEW_IPC_CHANNELS.LOCAL_PRODUCT_INTERRUPT_V3,
    (event:IpcMainInvokeEvent,caseId:string)=>{
      const {s}=session(event,caseId)
      s.interrupted=true
      return read(event,caseId)
    })
  /**
   * T02 只读暂存预览（Local-L04 桥接）。
   *
   * 复用本文件已有的 `session(event, caseId)` 派生 B2MainContext，绝不
   * 接受渲染层传入的任意物理路径；产物是 staging-only 预览，不产生
   * DocumentVersion，也不改变案卷。
   */
  ipcMain.handle(REVIEW_IPC_CHANNELS.T02_STAGED_INVENTORY_V3,
    async (event:IpcMainInvokeEvent,caseId:string)=>{
      if(typeof caseId!=='string'||!caseId)throw new Error('参数 caseId 非法')
      const {s}=session(event,caseId)
      const {previewT02StagedInventory}=
        require('./review-v3-t02-staged-source-preview') as typeof import('./review-v3-t02-staged-source-preview')
      return previewT02StagedInventory(s.ctx,s.staging)
    })
  ipcMain.handle(REVIEW_IPC_CHANNELS.LOCAL_PRODUCT_UNMATCHED_V3,
    (event:IpcMainInvokeEvent,input:{
      caseId:string;intent:B29HumanAuthorIntent
    }):B29UnmatchedAuthorDraft=>{
      if(!input||typeof input.caseId!=='string')
        throw new Error('C11_NATIVE_UNMATCHED_CASE_REQUIRED')
      const {data,s}=session(event,input.caseId)
      const route=evaluate(s,catalog())
      if(route.status!=='unmatched')
        throw new Error('C11_NATIVE_UNMATCHED_ROUTE_NOT_CURRENT')
      const materials=s.staging.listScopedCandidateIds(s.ctx)
        .map(id=>s.staging.getCandidate(s.ctx,id))
      const candidate=prepareB29UnmatchedAuthorDraft(route,materials,input.intent)
      // Independent C authority and exact native original bytes are rechecked
      // even though B29 is candidate-only and does not issue a formal Case write.
      if(local(event,input.caseId).signature!==data.signature)
        throw new Error('C11_NATIVE_SOURCE_CHANGED_DURING_AUTHOR_PREPARE')
      for(const doc of data.aggregate.caseV2.documents.filter(x=>x.active!==false))
        assertC2PhysicalOriginalBytes(data.aggregate,doc.versionId)
      return candidate
    })
  ipcMain.handle(REVIEW_IPC_CHANNELS.LOCAL_PRODUCT_MANUAL_CHOICE_V3,
    async (event:IpcMainInvokeEvent,input:{
      caseId:string;templateId:string;templateVersion:string;sessionKey:string;
      selectionMode:'manual'|'default'
    }):Promise<C11MainLocalTechnicalChoiceAck>=>{
      if(!input||typeof input.caseId!=='string'||
        typeof input.templateId!=='string'||typeof input.templateVersion!=='string'||
        typeof input.sessionKey!=='string'||!input.sessionKey||
        !['manual','default'].includes(input.selectionMode))
        throw new Error('C11_NATIVE_MANUAL_CHOICE_INVALID')
      const {s}=session(event,input.caseId)
      // 异步模型回包或旧倒计时不得在材料换版/重新分类后选择旧候选。
      if(s.signature!==input.sessionKey)
        throw new Error('C11_NATIVE_ROUTE_SESSION_STALE')
      if(!catalog().some(x=>x.templateId===input.templateId&&
        x.templateVersion===input.templateVersion&&
        x.availability==='authorized-for-technical-selection'))
        throw new Error('C11_NATIVE_TEMPLATE_NOT_AVAILABLE')
      // 到点自动选择必须由 Main 当前倒计时状态证明；Renderer 不能把
      // 用户已中断的过期自动回调伪装成一次新的人工确认。
      if(input.selectionMode==='default'){
        const route=evaluate(s,catalog())
        if(route.status!=='default-selected'||
          route.chosen?.templateId!==input.templateId||
          route.chosen?.templateVersion!==input.templateVersion)
          throw new Error('C11_NATIVE_DEFAULT_CHOICE_NOT_CURRENT')
      }
      s.chosen={templateId:input.templateId,templateVersion:input.templateVersion}
      const current=evaluate(s,catalog())
      if(current.status!=='manually-selected'||current.chosen?.templateId!==input.templateId)
        throw new Error('C11_NATIVE_MANUAL_CHOICE_NOT_CONFIRMED')
      // Apply the user's explicit choice to the existing native Case, rather
      // than leaving it only in the ephemeral B3 routing session. This is a
      // local draft template binding, not a school or approval decision.
      const version=Number(input.templateVersion)
      if(!Number.isSafeInteger(version)||version<1)
        throw new Error('C11_NATIVE_TEMPLATE_VERSION_INVALID')
      // D4 author candidates route to visible scenario setup. A temporary
      // route choice is not a published template or fixed Case Plan.
      if(loadD4UnifiedCatalog().templates.some(item=>
        item.templateId===input.templateId&&item.templateVersion===version)){
        return {candidateOnly:true,technicalChoiceRecorded:true,requiresPlanSetup:true,
          caseCandidateId:input.caseId,templateId:input.templateId,
          templateVersion:input.templateVersion}
      }
      if(isBundledR02TemplateId(input.templateId)){
        const bundled=await loadBundledR02Template(input.templateId)
        if(bundled.version!==version)throw new Error('C11_R02_BUNDLED_VERSION_MISMATCH')
        installBundledR02TechnicalTemplate(bundled)
      }
      await updateNativeWorkspaceSettingsV3(input.caseId,{
        caseId:input.caseId,
        reviewTemplate:{templateId:input.templateId,version},
      },undefined,()=>assertC0ReviewMainSender(event))
      const updated=readAggregate(input.caseId)
      if(!updated||updated.caseV2.templateId!==input.templateId||
         updated.caseV2.templateVersion!==version)
        throw new Error('C11_NATIVE_TEMPLATE_BINDING_NOT_PERSISTED')
      // 技术模板已经在案卷中生效；按该模板槽位重新分类当前原件并保存纠错轨迹。
      await reclassifyForSelectedTemplate(input.caseId,
        {actorId:'local-reviewer',actorSource:'local',role:'reviewer'})
      // The Case revision changed: discard the old staged route session.
      // The next read reconstructs the inventory from current originals.
      sessions.delete(local(event,input.caseId).key)
      return {candidateOnly:true,technicalChoiceRecorded:true,
        caseCandidateId:input.caseId,templateId:input.templateId,
        templateVersion:input.templateVersion}
    })
}
