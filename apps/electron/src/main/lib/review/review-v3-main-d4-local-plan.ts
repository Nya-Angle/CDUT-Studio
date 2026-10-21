/** Main-only D4 G01–G08 technical plan binding for an existing native V3 case.
 * Reuses the original D4 workspace, D2 compiler and single V2 Case writer.
 * A candidate is a local technical review; never a school publication.
 */
import { randomUUID } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { ipcMain, type IpcMainInvokeEvent } from 'electron'
import type { D4ClientSelection, D4ClientTemplate, D2ScenarioSelection, D2TrustedStudentSnapshotV1, Actor } from '@profer/shared'
import { REVIEW_IPC_CHANNELS } from '@profer/shared'
import { assertC0ReviewMainSender } from './review-c0-authority'
import { readAggregate } from './case-store-v2'
import { isNativeWorkspaceCaseV3 } from './native-workspace-case-v3'
import { loadD4UnifiedCatalog, loadD4UnifiedWorkspace, resolveD4SourcePath, type D4UnifiedEntry } from './review-d4-catalog'
import { attachD2RuntimePlan, makeD2CandidateShell, verifyD2InstalledPlan } from './review-d2-runtime'
import { getTemplate, isAuthoringCandidateDraft, saveAuthoringCandidateDraft } from './template-store'
import { assertC2PhysicalOriginalBytes } from './review-v3-main-trust-port'

const reviewer: Actor = { actorId:'local-reviewer', actorSource:'local', role:'reviewer' }
const readJson=<T>(path:string):T=>JSON.parse(readFileSync(resolveD4SourcePath(path),'utf8')) as T
const base=(path:string):string=>path.replace(/\/workspace(?:\/workspace)?\.json$/, '')
/** 唯一使用受控合成学籍快照的候选；其选择冻结在 fixtures/selections.json 的 two 分支。 */
const CONTROLLED_STUDENT_TEMPLATE='g01-student-identity-correction'

/**
 * 读取单个候选的冻结选择。缺件一律抛错，由调用方把该候选标记为不可用：
 * 绝不返回 targets:[] 之类的空选择冒充「无需对象/条件」。
 */
export function localD4Selection(entry:D4UnifiedEntry,directory:string):D2ScenarioSelection {
  if(entry.templateId===CONTROLLED_STUDENT_TEMPLATE){
    const path=directory+'/fixtures/selections.json'
    if(!existsSync(resolveD4SourcePath(path)))
      throw new Error('D4_SELECTION_MISSING: 受控学籍选择文件缺失 '+path)
    const frozen=readJson<{two?:D2ScenarioSelection}>(path).two
    if(!frozen||!Array.isArray(frozen.targets)||!frozen.targets.length)
      throw new Error('D4_SELECTION_MISSING: 受控学籍选择 two 分支为空 '+path)
    return frozen
  }
  const fixture=['selection.json','synthetic-selection.json','fixtures/selection.json']
    .map(name=>directory+'/'+name).find(path=>existsSync(resolveD4SourcePath(path)))
  if(!fixture)throw new Error('D4_SELECTION_MISSING: 候选缺少冻结选择 '+directory)
  return readJson<D2ScenarioSelection>(fixture)
}

/** 不可用候选：保留目录身份，selection 仅作空占位，原因经 selectionIssue 如实暴露。 */
function unavailableLocalD4Template(entry:D4UnifiedEntry,reason:string):D4ClientTemplate {
  return {templateId:entry.templateId,version:entry.templateVersion,domain:entry.domain,
    name:entry.templateId,workspaceGitBlobSha:entry.workspaceGitBlobSha,
    primary:[],conditions:[],
    selection:{templateId:entry.templateId,version:entry.templateVersion,targets:[]},
    controlledStudentFixture:entry.templateId===CONTROLLED_STUDENT_TEMPLATE,
    selectionIssue:reason}
}

/** 逐候选隔离：单个候选缺件/损坏只影响自身，不能让整套 50 套目录整体不可读。 */
export function buildLocalD4Templates(entries:readonly D4UnifiedEntry[]):D4ClientTemplate[] {
  return entries.map(entry=>{
    try{
      const workspace=loadD4UnifiedWorkspace(entry)
      const template=workspace.definitions.templates[0]!
      return {templateId:entry.templateId,version:entry.templateVersion,domain:entry.domain,
        name:template.name,workspaceGitBlobSha:entry.workspaceGitBlobSha,
        primary:template.genericScenarioAxes?.primary??[],
        conditions:template.genericScenarioAxes?.conditions??[],
        selection:localD4Selection(entry,base(entry.workspacePath)),
        controlledStudentFixture:entry.templateId===CONTROLLED_STUDENT_TEMPLATE}
    }catch(error){
      const reason=error instanceof Error?error.message:String(error)
      console.error('[review-v3] D4 候选不可用 '+entry.templateId+'@'+entry.templateVersion+'：'+reason)
      return unavailableLocalD4Template(entry,reason)
    }
  })
}
export function listLocalD4Templates(): D4ClientTemplate[] {
  return buildLocalD4Templates(loadD4UnifiedCatalog().templates)
}
export function installC11NativeD4TechnicalPlan():void {
  ipcMain.handle(REVIEW_IPC_CHANNELS.LOCAL_D4_LIST_V3,(event:IpcMainInvokeEvent)=>{
    assertC0ReviewMainSender(event)
    return listLocalD4Templates()
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.LOCAL_D4_ATTACH_PLAN_V3,async(
    event:IpcMainInvokeEvent,input:{caseId:string;d4:D4ClientSelection}
  )=>{
    assertC0ReviewMainSender(event)
    if(!input||typeof input.caseId!=='string'||!input.d4?.selection||
      !Array.isArray(input.d4.selection.targets))
      throw new Error('LOCAL_D4_CASE_AND_SCENARIO_REQUIRED')
    const aggregate=readAggregate(input.caseId)
    if(!isNativeWorkspaceCaseV3(aggregate)||!aggregate||
      aggregate.caseV2.id!==input.caseId||aggregate.caseV2.stage!=='draft'||
      aggregate.canonicalPlan||aggregate.d2RuntimePlan)
      throw new Error('LOCAL_D4_NATIVE_DRAFT_CASE_REQUIRED')
    if(aggregate.caseV2.subjects.length||aggregate.caseV2.reviewRules?.length)
      throw new Error('LOCAL_D4_EXISTING_ITEMS: 请为该任务新建草稿案卷')
    const selection=input.d4.selection
    const entry=loadD4UnifiedCatalog().templates.find(e=>
      e.templateId===selection.templateId&&e.templateVersion===selection.version)
    if(!entry)throw new Error('LOCAL_D4_CANDIDATE_NOT_FOUND')
    const workspace=loadD4UnifiedWorkspace(entry)
    for(const doc of aggregate.caseV2.documents.filter(x=>x.active!==false))
      assertC2PhysicalOriginalBytes(aggregate,doc.versionId)
    let snapshot:D2TrustedStudentSnapshotV1|undefined
    if(input.d4.useControlledStudentFixture){
      if(entry.templateId!=='g01-student-identity-correction')
        throw new Error('LOCAL_D4_STUDENT_FIXTURE_SCOPE_INVALID')
      const directory=base(entry.workspacePath)
      snapshot=readJson<D2TrustedStudentSnapshotV1>(directory+'/fixtures/controlled-registry.json')
    }
    const current=getTemplate(entry.templateId,entry.templateVersion)
    if(current&&!isAuthoringCandidateDraft(entry.templateId,entry.templateVersion))
      throw new Error('LOCAL_D4_TEMPLATE_ID_ALREADY_PUBLISHED_OR_OCCUPIED')
    if(!current)saveAuthoringCandidateDraft(makeD2CandidateShell(workspace,entry.templateId,entry.templateVersion))
    assertC0ReviewMainSender(event)
    const result=await attachD2RuntimePlan({
      caseId:input.caseId,requestId:'local-d4-'+randomUUID(),
      actor:reviewer,expectedRevision:aggregate.caseV2.revision,
      workspace,selection,trustedStudentSnapshot:snapshot,
    })
    if(!result.ok)throw new Error(result.code+': '+result.message)
    const errors=verifyD2InstalledPlan(result.aggregate)
    if(errors.length)throw new Error('LOCAL_D4_PLAN_INVALID: '+errors.join('; '))
    assertC0ReviewMainSender(event)
    return {caseId:input.caseId,templateId:entry.templateId,
      templateVersion:entry.templateVersion,
      checks:result.aggregate.d2RuntimePlan!.mapping.length,
      fingerprint:result.aggregate.d2RuntimePlan!.fingerprint}
  })
}
