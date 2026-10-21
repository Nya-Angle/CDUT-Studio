/**
 * C11 production Main intake: physical native Case originals -> B2 scoped
 * material staging -> B30 complete inventory -> B3 conservative routing.
 * This is candidate-only. It does NOT manufacture a Run, policy, Check PASS,
 * School ACK or a second durable Case. Main proves bytes on EVERY read.
 */
import {createHash} from 'node:crypto'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {ipcMain,type IpcMainInvokeEvent} from 'electron'
import {REVIEW_IPC_CHANNELS} from '@profer/shared'
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
import {listTemplateVersions} from './template-store'
import {loadD4UnifiedCatalog,loadD4UnifiedWorkspace} from './review-d4-catalog'
import {prepareB29UnmatchedAuthorDraft,type B29HumanAuthorIntent,
  type B29UnmatchedAuthorDraft} from './review-v3-b3-unmatched-author-bootstrap'
import {classifyD4ApplicationDocuments,type D4ContentRouteSuggestion} from './review-v3-d4-content-router'
import type {B20MainReadScope} from './review-v3-b1-b2-main-read-bundle-v3-b'
import type {B32ProductRead} from '../../../renderer/components/review-v3-dev-b/review-v3-product-workflow'

type Snapshot = NonNullable<ReturnType<typeof readAggregate>>
export interface C11MainLocalProductRead {
  read:B32ProductRead
  catalog:B3ManualCatalogEntry[]
  sessionKey:string
  /** 当前案卷物理验真的申请原件内明确意图；歧义候选只展示不给B3默认绑定。 */
  routeCandidates:D4ContentRouteSuggestion[]
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
  const active=aggregate.caseV2.documents.filter(doc=>doc.active!==false)
  if(active.length>500)throw new Error('C11_NATIVE_MORE_THAN_500_CURRENT_MATERIALS')
  // A native Case has no real Subject until its Plan is fixed. For a single
  // application, use the existing Case as a temporary routing group only.
  const oneApplication=active.filter(doc=>doc.role==='application').length===1
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
      oneApplication?'case-scope-'+aggregate.caseV2.id:null
    const role:B2MaterialCandidate['role']=doc.role==='application'?'application':
      doc.role==='evidence'?'supporting':'unassigned'
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
  for(const key of sessions.keys())if(key.endsWith(':'+caseId)&&key!==data.key)sessions.delete(key)
  let s=sessions.get(data.key)
  if(!s||s.signature!==data.signature||!sameScope(s.ctx,data.scope)){
    const staging=new ReviewB2StagingService()
    stageOriginals(data.aggregate,data.scope,staging)
    s={signature:data.signature,ctx:data.scope,staging,
      router:new ReviewB3OwnerBoundRouteSession(staging),interrupted:false,chosen:null}
    sessions.set(data.key,s)
  }
  // A changed raw source must be detected even when the JSON Case revision is
  // unchanged; an old in-memory B2 copy cannot mask a modified disk original.
  for(const doc of data.aggregate.caseV2.documents.filter(x=>x.active!==false))
    assertC2PhysicalOriginalBytes(data.aggregate,doc.versionId)
  return {data,s}
}
let historicalD4Catalog:B3ManualCatalogEntry[]|undefined
function catalog():B3ManualCatalogEntry[] {
  const published=listTemplateVersions().filter(x=>x.status==='published').map(x=>({
    templateId:x.templateId,templateVersion:String(x.version),name:x.name,
    availability:'authorized-for-technical-selection' as const,
  }))
  // Display the complete original 50 D4 authoring workspaces alongside
  // locally published templates. Keep their candidate-held identity until
  // their per-case D2 technical plan has actually been compiled and attached.
  // Never silently swap a historical template into an unrelated published one.
  if(!historicalD4Catalog){
    historicalD4Catalog=loadD4UnifiedCatalog().templates.map(entry=>({
      templateId:entry.templateId,
      templateVersion:String(entry.templateVersion),
      name:loadD4UnifiedWorkspace(entry).definitions.templates[0]!.name,
      availability:'authorized-for-technical-selection' as const,
    }))
  }
  const existing=new Set(published.map(x=>x.templateId+'@'+x.templateVersion))
  return [...published,...historicalD4Catalog.filter(x=>
    !existing.has(x.templateId+'@'+x.templateVersion))]
}
function evaluate(s:Session,items:B3ManualCatalogEntry[]):B3RouteState {
  const ids=s.staging.listScopedCandidateIds(s.ctx)
  const all=ids.map(id=>s.staging.getCandidate(s.ctx,id))
  // 当前正式绑定、精确业务标题或已解析原件中声明的唯一模板，才允许倒计时
  // 自动建议。模糊文件名、OCR推测和受控合成示例均不能变成自动路由依据。
  const installed=readAggregate(s.ctx.caseCandidateId)?.caseV2
  const selected=items.find(x=>x.templateId===installed?.templateId&&
    x.templateVersion===String(installed?.templateVersion)&&
    x.availability==='authorized-for-technical-selection')
  const scoped=all.length>0&&all.filter(x=>x.role==='application').length===1&&
    all.every(x=>x.role!=='unassigned'&&Boolean(x.subjectId))&&
    new Set(all.map(x=>x.subjectId)).size===1
  // Exact explicitly named local business type can safely use the 20-second
  // automatic technical route. No fuzzy filename-only or unknown-policy route.
  const exactTitle=installed?.title.trim().toLocaleLowerCase()??''
  const matches=!selected&&scoped?items.filter(item=>
    item.availability==='authorized-for-technical-selection'&&
    (item.name.trim().toLocaleLowerCase()===exactTitle||
     item.templateId.toLocaleLowerCase()===exactTitle)):[]
  const content=installed?classifyD4ApplicationDocuments(items,installed.documents):[]
  const solo=content.length===1&&content[0]!.autoEligible?content[0]:undefined
  const titleMatch=matches.length===1&&(!solo||solo.templateId===matches[0]!.templateId)?matches[0]:undefined
  const fromSource=!selected&&scoped&&solo?items.find(item=>item.templateId===solo.templateId):undefined
  const auto=selected??titleMatch??fromSource
  const suggestions:B3RouteSuggestion[]=auto&&scoped?[{
    templateId:auto.templateId,templateVersion:auto.templateVersion,
    availability:'authorized-for-technical-selection',
    confidence:1,caseCandidateId:s.ctx.caseCandidateId,
    evidence:all.map(x=>({materialCandidateId:x.candidateId,rawSha256:x.rawSha256,
      reason:selected?'已绑定当前案卷本地模板':titleMatch?
        '案卷标题精确匹配唯一完整模板名称或编号':
        '已核验申请原件的唯一业务意图：'+(solo?.matchedSignals.join('、')??'未知')})),
  }]:[]
  return s.router.evaluate(s.ctx,{
    automaticSelectionEnabled:true,materialCandidates:all,suggestions,
    manualCatalog:items,userInterrupted:s.interrupted,
    ...(s.chosen?{userChoseTemplateId:s.chosen.templateId,
      userChoseTemplateVersion:s.chosen.templateVersion}:{}),
  })
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
  const routeCandidates=classifyD4ApplicationDocuments(currentCatalog,data.aggregate.caseV2.documents)
  return {read:result,catalog:currentCatalog,sessionKey:s.signature,routeCandidates}
}
export function installC11LocalNativeProductIntake():void {
  ipcMain.handle(REVIEW_IPC_CHANNELS.LOCAL_PRODUCT_CURRENT_V3,
    (event:IpcMainInvokeEvent,caseId:string)=>read(event,caseId))
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
      caseId:string;templateId:string;templateVersion:string
    }):Promise<C11MainLocalTechnicalChoiceAck>=>{
      if(!input||typeof input.caseId!=='string'||
        typeof input.templateId!=='string'||typeof input.templateVersion!=='string')
        throw new Error('C11_NATIVE_MANUAL_CHOICE_INVALID')
      const {s}=session(event,input.caseId)
      if(!catalog().some(x=>x.templateId===input.templateId&&
        x.templateVersion===input.templateVersion&&
        x.availability==='authorized-for-technical-selection'))
        throw new Error('C11_NATIVE_TEMPLATE_NOT_AVAILABLE')
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
      await updateNativeWorkspaceSettingsV3(input.caseId,{
        caseId:input.caseId,
        reviewTemplate:{templateId:input.templateId,version},
      },undefined,()=>assertC0ReviewMainSender(event))
      const updated=readAggregate(input.caseId)
      if(!updated||updated.caseV2.templateId!==input.templateId||
         updated.caseV2.templateVersion!==version)
        throw new Error('C11_NATIVE_TEMPLATE_BINDING_NOT_PERSISTED')
      // The Case revision changed: discard the old staged route session.
      // The next read reconstructs the inventory from current originals.
      sessions.delete(local(event,input.caseId).key)
      return {candidateOnly:true,technicalChoiceRecorded:true,
        caseCandidateId:input.caseId,templateId:input.templateId,
        templateVersion:input.templateVersion}
    })
}
