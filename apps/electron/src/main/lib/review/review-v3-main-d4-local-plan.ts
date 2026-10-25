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
import { attachD2RuntimePlan, compileD2RuntimePlan, makeD2CandidateShell, verifyD2InstalledPlan } from './review-d2-runtime'
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

/**
 * F05 改类后只尝试恢复能够由当前受控 D4 目录重新编译、且与旧计划来源完全一致的方案。
 * 不重放旧 Plan，也不写入旧 Run；缺少原始选择/来源时保持案卷未绑定，供后续处理。
 * 重试是安全的：已重新绑定的计划不会被二次写入。
 */
export async function recoverD4PlanAfterRemediation(
  caseId: string,
  invalidatedFingerprint: string,
  authorizeAtCommit?: () => void,
): Promise<{ status: 'rebuilt' | 'pending'; reason: string }> {
  const current = readAggregate(caseId)
  if (!current || !isNativeWorkspaceCaseV3(current)) {
    return { status: 'pending', reason: '原生案卷已不可用，无法恢复技术方案' }
  }
  const old = current.d2RuntimePlanHistory?.findLast(plan => plan.fingerprint === invalidatedFingerprint)
  if (!old || !current.remediationRecords?.some(item => item.status === 'applied'
    && item.invalidatedPlanFingerprint === invalidatedFingerprint)) {
    return { status: 'pending', reason: '找不到本次纠错对应的原始技术方案' }
  }
  if (current.d2RuntimePlan) {
    if (current.d2RuntimePlan.fingerprint === old.fingerprint && verifyD2InstalledPlan(current).length === 0) {
      return { status: 'rebuilt', reason: '本次纠错后的技术方案已经恢复，无需重复写入' }
    }
    return { status: 'pending', reason: '已有新的技术方案，未覆盖现有方案' }
  }
  if (current.canonicalPlan || current.caseV2.stage !== 'draft'
    || current.caseV2.templateId !== 'pending-template-v3' || current.caseV2.templateVersion !== 0
    || current.caseV2.subjects.length || current.caseV2.reviewRules?.length) {
    return { status: 'pending', reason: '案卷状态已变化，不能自动恢复技术方案' }
  }
  try {
    const entry = loadD4UnifiedCatalog().templates.find(item => item.templateId === old.templateId
      && item.templateVersion === old.templateVersion)
    if (!entry) return { status: 'pending', reason: '原方案不是可重新编译的本地 D4 候选，保留原始记录待重新配置' }
    const workspace = loadD4UnifiedWorkspace(entry)
    const selection = localD4Selection(entry, base(entry.workspacePath))
    // 在写入前用当前案卷与真实作者态重新编译，并要求输出与原方案逐字节同源。
    const selectedCase = { ...current.caseV2, templateId: old.templateId, templateVersion: old.templateVersion }
    const candidate = compileD2RuntimePlan(workspace, selection, selectedCase, old.trustedStudentSnapshot)
    if (candidate.fingerprint !== old.fingerprint || candidate.workspaceId !== old.workspaceId
      || candidate.authoringDigest !== old.authoringDigest) {
      return { status: 'pending', reason: '原方案选择或作者态已变化，不能无依据地自动恢复' }
    }
    const preflight = structuredClone(current)
    preflight.caseV2.templateId = candidate.templateId
    preflight.caseV2.templateVersion = candidate.templateVersion
    preflight.caseV2.subjects = structuredClone(candidate.subjects)
    preflight.caseV2.reviewRules = structuredClone(candidate.rules)
    preflight.caseV2.caseFields.d2PlanFingerprint = { kind: 'text', value: candidate.fingerprint }
    preflight.d2RuntimePlan = structuredClone(candidate)
    const problems = verifyD2InstalledPlan(preflight)
    if (problems.length) return { status: 'pending', reason: '恢复前检查失败：' + problems.join('；') }
    for (const doc of current.caseV2.documents.filter(item => item.active !== false)) {
      assertC2PhysicalOriginalBytes(current, doc.versionId)
    }
    authorizeAtCommit?.()
    const installed = await attachD2RuntimePlan({
      caseId, requestId: 'f05-d4-rebuild-' + invalidatedFingerprint + '-' + current.caseV2.revision,
      actor: reviewer, expectedRevision: current.caseV2.revision,
      workspace, selection, trustedStudentSnapshot: old.trustedStudentSnapshot,
    })
    if (!installed.ok) return { status: 'pending', reason: installed.message }
    const errors = verifyD2InstalledPlan(installed.aggregate)
    if (errors.length) return { status: 'pending', reason: '新计划未通过一致性检查：' + errors.join('；') }
    return { status: 'rebuilt', reason: '原 D4 方案已按受控来源重新编译，仍须开启新的 Pi 审核' }
  } catch (error) {
    return { status: 'pending', reason: error instanceof Error ? error.message : String(error) }
  }
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
    // 已绑定正式模板的案卷不能再套技术方案：否则会落到案卷自身模板上，
    // 报出「模板失去受控候选资格」这种用户无法理解的内部原因。
    if(aggregate.caseV2.templateId!=='pending-template-v3'||aggregate.caseV2.templateVersion!==0)
      throw new Error('LOCAL_D4_TEMPLATE_ALREADY_BOUND: 当前案卷已绑定「'+
        aggregate.caseV2.templateId+'」，不能再用这套审核方案覆盖。请新建一个未绑定模板的案卷后再试。')
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
