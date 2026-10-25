/**
 * D2：D1 作者态条件/对象实例 → 现有 RuleSpec/Pi 审核。
 * 没有第二套 Agent 内核；发布资格、行政决定与模型结果严格分离。
 */
import { createHash } from 'node:crypto'
import type {
  Actor, CaseAggregateV2, D2RuntimePlan, D2ScenarioSelection, D2RuleBinding, D2TargetBinding,
  ReviewAuthoringWorkspaceV1, ReviewCaseV2, ReviewCommandResult, ReviewRunV2, CommandReceipt,
  ReviewSubject, RuleSpec, TemplateVersion, D2TrustedStudentSnapshotV1,
} from '@profer/shared'
import { previewDemo, type DemoState } from './semantic-module-demo'
import { validateReviewAuthoringV1 } from './review-authoring-v1'
import { validateD3WorkspaceLocks } from './review-d3-workspace-locks'
import { CommandValidationError, createAggregate, payloadHash, readAggregate, submitCommand } from './case-store-v2'
import { getTemplate, isAuthoringCandidateDraft } from './template-store'
import { hashEffectiveRuleSet, resolveEffectiveRules } from './effective-rules'
import { computeRunInputHash } from './run-service-v2'
import { validateD2GuardSubmission } from './review-d2-execution-gates'
import { compileD4Generic } from './review-d4-common'

const sha = (value: unknown): string => createHash('sha256').update(JSON.stringify(value) ?? 'undefined', 'utf8').digest('hex')
const ID = /^[a-z][a-z0-9-]{0,79}$/
const safe = (value: string): boolean => ID.test(value)
const toDemo = (workspace: ReviewAuthoringWorkspaceV1): DemoState => ({
  revision: workspace.revision,
  modules: workspace.definitions.modules,
  templates: workspace.definitions.templates,
})
const sectionFor = (key: string): string => 'd2-scope-' + sha(key).slice(0, 16)
const runtimeRuleId = (checkId: string): string => 'd2-' + sha(checkId).slice(0, 20)
const runtimeCheckId = (ruleId: string, subjectId: string | undefined, allSubjects: string[]): string =>
  `check-${ruleId}-${subjectId ? 'subject-' + subjectId : 'case-' + (allSubjects.join('-') || 'case')}`
const scopeRef = (binding: D2TargetBinding): ReviewSubject => ({
  id: binding.subjectId, title: binding.title, type: 'custom',
  sectionId: sectionFor(binding.objectKey),
  fields: {
    d2ObjectKey: { kind: 'text', value: binding.objectKey },
    ...(binding.businessType ? {d2BusinessType:{kind:'text' as const,value:binding.businessType}} : {}),
    ...(binding.conditions ? {d2Conditions:{kind:'text' as const,value:JSON.stringify(binding.conditions)}} : {}),
    ...(binding.itemId ? { d2ItemId: { kind: 'text' as const, value: binding.itemId } } : {}),
    ...(binding.operation ? { d2Operation: { kind: 'text' as const, value: binding.operation } } : {}),
    ...(binding.operationId ? { d2OperationId: { kind: 'text' as const, value: binding.operationId } } : {}),
    ...(binding.scenario ? { d2Scenario: { kind: 'text' as const, value: binding.scenario } } : {}),
    ...(binding.studentId ? { d2StudentId: { kind: 'text' as const, value: binding.studentId } } : {}),
    ...(binding.fieldKey ? { d2FieldKey: { kind: 'text' as const, value: binding.fieldKey } } : {}),
    ...(binding.intent ? { d2RequestIntent: { kind: 'text' as const, value: binding.intent } } : {}),
  },
  sourceRefs: [], correction: 'user-confirmed', status: 'confirmed',
})
const digestPlan = (plan: Omit<D2RuntimePlan, 'fingerprint'>): string => sha(plan)
/** 业务规则只存在于 D2 的固定案卷任务包中；候选模板壳不允许夹带额外规则/政策/审批动作。 */
function d2CandidateShellProblem(template: TemplateVersion | undefined): string | undefined {
  if (!template || template.status !== 'draft' || !isAuthoringCandidateDraft(template.templateId, template.version)) {
    // 面向用户：只说清「这套方案不能用在当前案卷」，不暴露 D2/候选资格等内部概念。
    return '这套审核方案只能用于尚未绑定模板的新案卷；当前案卷已绑定其他模板，请新建案卷后再试'
  }
  if (template.fields.length || template.materialSlots.length || (template.sections ?? []).length ||
      template.policyVersionIds.length || (template.policyRefs?.length ?? 0) ||
      template.outputs.length !== 1 || template.outputs[0]?.kind !== 'item-feedback' ||
      template.stages.length !== 1 || template.stages[0]?.kind !== 'manual-review' ||
      template.stages[0]?.executorRole !== 'reviewer' || template.objectType !== 'document') {
    return 'D2 候选模板壳被加入额外政策、静态规则、字段、阶段或审批输出；不能混入技术预审'
  }
  return undefined
}

/** D2 固定为技术预审，提供可被真实 Pi 案卷加载的最小草稿壳，不是校规。 */
export function makeD2CandidateShell(workspace: ReviewAuthoringWorkspaceV1, templateId: string, version: number): TemplateVersion {
  const problems = validateReviewAuthoringV1(workspace)
  if (problems.length) throw new Error('D2_AUTHORING_INVALID: ' + problems.join('；'))
  const source = workspace.definitions.templates.find((item) => item.templateId === templateId && item.version === version)
  if (!source) throw new Error('D2_TEMPLATE_NOT_FOUND')
  return {
    templateId, version, schemaVersion: 2, name: source.name,
    description: 'D2 作者态技术预审壳：动态分支/逐操作由案卷级不可变规则快照承载',
    sourceNote: 'D1_AUTHORING_CANDIDATE: D2 技术预审，不得发布为正式校规',
    catalogKind: 'custom', objectType: 'document', displayName: { template: source.name },
    fields: [], materialSlots: [], policyVersionIds: [], policyRefs: [],
    sections: [], stages: [{ id: 'review', name: 'Pi Agent 材料预审', kind: 'manual-review', executorRole: 'reviewer' }],
    outputs: [{ id: 'review-feedback', kind: 'item-feedback', audience: 'reviewer' }],
    status: 'draft', createdAt: new Date().toISOString(),
  }
}

function validateTargets(selection: D2ScenarioSelection): void {
  const keys = new Set<string>(), subjects = new Set<string>()
  for (const target of selection.targets) {
    if (!target.objectKey?.trim() || !safe(target.subjectId) || !target.title?.trim() || keys.has(target.objectKey) || subjects.has(target.subjectId)) {
      throw new Error('D2_TARGET_INVALID: 对象键/主体 ID 重复、非法或缺少标题')
    }
    keys.add(target.objectKey)
    subjects.add(target.subjectId)
    if (target.kind === 'archive-operation') {
      if (!target.itemId || !target.operation || (target.operationId && !safe(target.operationId)) ||
          target.objectKey !== target.itemId + '/' + target.operation + (target.operationId ? '/' + target.operationId : '')) {
        throw new Error('D2_TARGET_INVALID: 档案件与操作必须精确对应 itemId/operation')
      }
    } else if (target.kind === 'archive-item') {
      if (!target.itemId || target.objectKey !== target.itemId || target.operation || target.operationId) throw new Error('D2_TARGET_INVALID: 档案级目标不能冒充具体操作')
    } else if (target.kind === 'campus-card') {
      if (!selection.scenario || target.scenario !== selection.scenario || target.operation || target.operationId) {
        throw new Error('D2_TARGET_INVALID: 校园卡主体必须绑定已选择的分支')
      }
    } else if (target.kind === 'student-field') {
      if (!target.studentId || !safe(target.studentId) || !target.fieldKey || !safe(target.fieldKey) ||
          !target.intent || !safe(target.intent) || target.objectKey !== target.studentId + '/' + target.fieldKey ||
          target.operation || target.operationId || target.itemId || target.scenario) {
        throw new Error('D2_TARGET_INVALID: 学籍目标必须绑定精确学生/字段/更正意图')
      }
    } else if(target.kind==='custom-object') {
      if(!safe(target.objectKey)||target.itemId||target.operation||
        target.studentId||target.fieldKey||target.conditions?.length||target.scenario)
        throw Error('D2_CUSTOM_OBJECT_INVALID')
    } else if (target.kind==='generic-object') {
      if(!safe(target.objectKey)||!safe(target.businessType??'')||target.operation||target.operationId||
         target.itemId||target.studentId||target.fieldKey||target.intent||
         (target.conditions!==undefined&&!Array.isArray(target.conditions)))
        throw Error('D2_GENERIC_TARGET_INVALID')
    } else throw new Error('D2_TARGET_INVALID: 未知目标种类')
  }
}

/** Validate an independent, synthetic-only registry fixture. Applicant caseFields never enter this boundary. */
function validateTrustedSnapshot(snapshot: D2TrustedStudentSnapshotV1 | undefined): void {
  if (!snapshot) return
  if (snapshot.schemaVersion !== 1 || snapshot.sourceKind !== 'controlled-synthetic' ||
      snapshot.status !== 'current' || !safe(snapshot.studentId) ||
      !safe(snapshot.sourceId) || !safe(snapshot.snapshotVersionId) ||
      !safe(snapshot.enrollmentStatus) || !snapshot.fields ||
      typeof snapshot.fields !== 'object' || Array.isArray(snapshot.fields) ||
      Object.keys(snapshot.fields).length > 32 ||
      Object.entries(snapshot.fields).some(([key, value]) => !safe(key) || typeof value !== 'string' || value.length > 200) ||
      (snapshot.fields['enrollment-status'] !== undefined && snapshot.fields['enrollment-status'] !== snapshot.enrollmentStatus)) {
    throw new Error('D2_TRUSTED_SOURCE_INVALID: 仅接受独立受控、现行的合成学籍快照')
  }
}

/**
 * 仅选择已确认情景，展开所有应审责任并严格绑定业务对象。
 * policy-candidate/跨校参考可以作为待核责任，但不得编译成已确认的校规。
 */
export function compileD2RuntimePlan(
  workspace: ReviewAuthoringWorkspaceV1,
  selection: D2ScenarioSelection,
  caseV2: ReviewCaseV2,
  trustedStudentSnapshot?: D2TrustedStudentSnapshotV1,
): D2RuntimePlan {
  const errors = validateReviewAuthoringV1(workspace)
  if (errors.length) throw new Error('D2_AUTHORING_INVALID: ' + errors.join('；'))
  // Bundled D4 candidates carry their exact frozen modules inside the
  // verified workspace; compilation must not depend on a separate user's
  // mutable D3 library installation. Lock digests/dependencies are checked.
  const lockErrors = validateD3WorkspaceLocks(workspace, false)
  if (lockErrors.length) throw new Error('D3_FROZEN_LOCK_INVALID: ' + lockErrors.join('；'))
  if (workspace.advanced && Object.values(workspace.advanced).some((value) => Array.isArray(value) && value.length)) {
    throw new Error('D2_UNMAPPED_ADVANCED: 高级 Claim/Evidence 关系尚无无损执行映射，不得忽略')
  }
  const template = workspace.definitions.templates.find((item) => item.templateId === selection.templateId && item.version === selection.version)
  if (!template || caseV2.templateId !== selection.templateId || caseV2.templateVersion !== selection.version) {
    throw new Error('D2_TEMPLATE_MISMATCH: 案卷模板与作者态不一致')
  }
  const genericMode=selection.targets.some(t=>t.kind==='generic-object')
  if(genericMode&&selection.targets.some(t=>t.kind!=='generic-object'))
    throw Error('D2_GENERIC_OBJECT_MIXED')
  const multi = selection.scenarios
  if (multi !== undefined && (!Array.isArray(multi) || !multi.length || multi.length > 13 ||
      new Set(multi).size !== multi.length || multi.some(s=>typeof s!=='string'||!safe(s)) || selection.scenario)) {
    throw new Error('D2_SCENARIOS_INVALID: 复合分支必须显式且不能与旧单分支并存')
  }
  const selectedScenarios = multi ?? (selection.scenario ? [selection.scenario] : [])
  if (!genericMode && template.scenarios?.length && (!selectedScenarios.length ||
      selectedScenarios.some(s => !template.scenarios!.includes(s)))) {
    throw new Error('D2_SCENARIO_REQUIRED: 未知分支不能当作不适用')
  }
  if (!genericMode && !template.scenarios?.length && selectedScenarios.length) throw new Error('D2_SCENARIO_INVALID: 无条件模板不接受分支')
  if (!genericMode && template.scenarios?.length) {
    const studentSelection = selection.targets.length > 0 && selection.targets.every(t => t.kind === 'student-field')
    if (!studentSelection && (!selection.scenario || selection.scenarios ||
        !selection.scenarioObjectKey || selection.targets.length !== 1 ||
        selection.targets[0]?.kind !== 'campus-card' ||
        selection.targets[0].objectKey !== selection.scenarioObjectKey)) {
      throw new Error('D2_SCENARIO_SCOPE_REQUIRED: 校园卡仍须单一主体；学籍多轴须使用实际字段目标')
    }
    if (studentSelection && selection.scenarioObjectKey) {
      throw new Error('D2_SCENARIO_SCOPE_INVALID: 学籍目标不允许伪装校园卡对象键')
    }
  } else if (!genericMode && selection.scenarioObjectKey) {
    throw new Error('D2_SCENARIO_SCOPE_INVALID: 无分支模板不能声明校园卡情景主体')
  }
  validateTargets(selection)
  validateTrustedSnapshot(trustedStudentSnapshot)
  if (trustedStudentSnapshot && selection.targets.some(t=>t.kind!=='student-field')) {
    throw new Error('D2_TRUSTED_SOURCE_INVALID: 受控合成学籍快照不能套用于档案或校园卡')
  }
  const studentTargets=selection.targets.filter(t=>t.kind==='student-field')
  if (studentTargets.length && studentTargets.length!==selection.targets.length) {
    throw new Error('D2_STUDENT_OBJECT_MIXED: 学籍字段审核必须使用一致的对象种类')
  }
  const generic=genericMode?compileD4Generic(workspace,selection):undefined
  const previews=genericMode?[]:selectedScenarios.length>1 ?
    selectedScenarios.map(s=>previewDemo(toDemo(workspace), selection.templateId, selection.version, s)) :
    [previewDemo(toDemo(workspace), selection.templateId, selection.version, selectedScenarios[0])]
  if(previews.some(v=>v.blocked))throw new Error('D2_PREVIEW_BLOCKED: '+previews.flatMap(v=>v.issues).join('；'))
  const uniqueTasks=new Map(previews.flatMap(v=>v.tasks).map(task=>[task.checkId,task]))
  const preview={tasks:[...uniqueTasks.values()],fingerprint:generic?generic.fingerprint:previews.length===1?previews[0]!.fingerprint:
    sha({scenarios:selectedScenarios,fingerprints:previews.map(v=>v.fingerprint),checks:[...uniqueTasks.keys()]})}
  if (!genericMode && !preview.tasks.length)throw new Error('D2_PREVIEW_BLOCKED: 无任何已激活责任')
  const registry = new Map(selection.targets.map((target) => [target.objectKey, target]))
  if (selection.scenarioObjectKey && !registry.has(selection.scenarioObjectKey)) {
    throw new Error('D2_SCOPE_MISSING: 分支对象未登记')
  }
  const sources = new Map(workspace.sources.map((source) => [source.sourceId, source]))
  const links = new Map(workspace.sourceBindings.map((link) => [link.checkId, link]))
  const rules: RuleSpec[] = [], mapping: D2RuleBinding[] = []
  const usedKeys = new Set<string>()
  // The D1 preview remains an immutable authoring task; D2 expands only explicitly
  // scoped student responsibilities into separate real Pi Check/Subject instances.
  const hasStudentScope=preview.tasks.some(task=>links.get(selection.templateId+'@'+selection.version+':'+task.checkId)?.studentScope)
  if(hasStudentScope && !studentTargets.length)throw new Error('D2_STUDENT_SCOPE_REQUIRED: 字段条件责任不能以零学生对象生成整案假成功')
  const expanded=generic?generic.entries:preview.tasks.flatMap(task=>{
    const source=links.get(selection.templateId+'@'+selection.version+':'+task.checkId)
    if (studentTargets.length && !source?.studentScope && !task.objectKey && !source?.caseScopeJustification) {
      throw new Error('D2_STUDENT_UNSCOPED_CHECK: 学籍模板责任缺少字段约束或明示整案例外 '+task.checkId)
    }
    if (!studentTargets.length || !source?.studentScope) return [{task,instanceCheckId:task.checkId,applicability:undefined as D2RuleBinding['applicability']}]
    if(task.objectKey)throw new Error('D2_STUDENT_OBJECT_MIXED: 同一责任不能同时绑定档案键和学生字段')
    return studentTargets.filter(t=>source.studentScope!.fieldKeys.includes(t.fieldKey!)).map(target=>{
      const restricted=source.studentScope!.enrollmentStatuses
      const snapshot=trustedStudentSnapshot?.studentId===target.studentId ? trustedStudentSnapshot : undefined
      const applicability:D2RuleBinding['applicability']=!source.studentScope!.intents.includes(target.intent!) ? 'unknown' :
        !restricted?.length ? 'applicable' : !snapshot ? 'unknown' :
        restricted.includes(snapshot.enrollmentStatus)?'applicable':'not-applicable'
      return {task:{...task,objectKey:target.objectKey},instanceCheckId:task.checkId+'#'+target.objectKey,applicability}
    })
  })
  if(studentTargets.length && !expanded.some(entry=>entry.instanceCheckId.includes('#'))) {
    throw new Error('D2_STUDENT_SCOPE_REQUIRED: 缺少字段级实例责任；不允许 0 字段假成功')
  }
  for (const [index, entry] of expanded.entries()) {
    const {task,instanceCheckId,applicability}=entry
    const objectKey = task.objectKey ?? (task.checkId.startsWith('module/') ? selection.scenarioObjectKey : undefined)
    const target = objectKey ? registry.get(objectKey) : undefined
    if (objectKey && !target) throw new Error('D2_SCOPE_MISSING: 未登记业务对象 ' + objectKey)
    if (target) usedKeys.add(target.objectKey)
    const sourceBinding = links.get(selection.templateId + '@' + selection.version + ':' + task.checkId)
    const sourceIds = sourceBinding?.sourceIds
    if (!sourceIds?.length) throw new Error('D2_SOURCE_MISSING: ' + task.checkId)
    const authority: D2RuleBinding['authority'] = task.source.kind === 'cross-school-reference' ||
      sourceIds.some((id) => {
        const source = sources.get(id)
        return !source || source.kind === 'cross-school-reference' || source.kind === 'policy-candidate' ||
          source.applicability !== 'request-scope'
      }) ? 'unverified-policy' : 'request-scope'
    const id = runtimeRuleId(selection.templateId + '@' + selection.version + ':' + instanceCheckId)
    if(target?.kind==='generic-object'&&(!sourceBinding?.genericScope||
       !sourceBinding.genericScope.businessTypes.includes(target.businessType!)))
      throw Error('D2_GENERIC_SCOPE_REQUIRED: '+task.checkId)
    if (target?.kind==='student-field' && sourceBinding?.gate?.material &&
        sourceBinding.gate.material.alternatives.some(label=>!label.startsWith('d2:student:'+target.fieldKey+':'))) {
      throw new Error('D2_STUDENT_EVIDENCE_SCOPE_INVALID: 证据事实必须绑定准确的更正字段')
    }
    const requirement = [
      task.requirement,
      '完成标准：' + task.completion,
      '责任边界：' + task.limits,
      'D2 技术预审来源：' + sourceIds.map((sourceId) => {
        const source = sources.get(sourceId)!
        return source.sourceId + '/' + source.kind + '/' + source.applicability
      }).join('；'),
      '行政边界：技术核验结果不能代替学校制度确认、授权或最终批准。',
      ...(authority === 'unverified-policy' ? ['校规/外校参考适用性未获确认：只能报告 awaiting-confirmation。'] : []),
      ...(applicability ? ['学籍字段条件：'+applicability+'；申请陈述不等于可信学籍快照。'] : []),
      ...(sourceBinding?.gate ? [
        '结构化执行条件（D2 强制门禁，不是行政制度已生效证明）：' + JSON.stringify(sourceBinding.gate),
        '执行规则：条件未知一律 awaiting-confirmation；阶段未到不得报申请人缺件；电子/纸质替代须有本对象当前版本的审核员证据确认。',
      ] : []),
    ].join('\n')
    rules.push({
      id, policyVersionId: `workspace:d2-${workspace.workspaceId}@${workspace.revision}`,
      title: task.title, requirement, when: { all: [] },
      ...(target ? { sectionId: sectionFor(target.objectKey) } : {}),
      targetScope: target ? 'subject' : 'case', execution: 'semantic',
      semanticOutputEnum: ['compliant', 'non-compliant'],
      onFail: 'manual-review', onUnknown: 'needs-confirmation', sourceRefIds: [...sourceIds],
      priority: 50000 + index, confirmation: authority === 'request-scope' ? 'confirmed' : 'unconfirmed',
    })
    mapping.push({
      checkId: instanceCheckId, ruleId: id,
      ...(target ? { objectKey: target.objectKey, subjectId: target.subjectId } : {}),
      sourceIds: [...sourceIds], authority,
      ...(applicability ? { applicability } : {}),
       ...(target?.kind==='generic-object' && sourceBinding?.genericScope ? {
         evidenceCoverage:{fieldKey:target.businessType!,supportsFacts:[...sourceBinding.genericScope.evidenceFacts]},
       } : {}),
      ...(target?.kind==='student-field' && sourceBinding?.gate?.material ? {
        evidenceCoverage: { fieldKey: target.fieldKey!, supportsFacts: [...sourceBinding.gate.material.alternatives] },
      } : {}),
      ...(sourceBinding?.gate ? { gate: structuredClone(sourceBinding.gate) } : {}),
    })
  }
  for (const target of selection.targets) if (!usedKeys.has(target.objectKey)) {
    throw new Error('D2_UNUSED_TARGET: 对象登记没有对应检查责任 ' + target.objectKey)
  }
  if (new Set(rules.map((rule) => rule.id)).size !== rules.length) throw new Error('D2_RULE_COLLISION')
  const bare: Omit<D2RuntimePlan, 'fingerprint'> = {
    schemaVersion: genericMode ? 3 : studentTargets.length ? 2 : 1, mode: 'technical-pre-review', publicationAllowed: false,
    ...(trustedStudentSnapshot ? {trustedStudentSnapshot:structuredClone(trustedStudentSnapshot)} : {}),
    workspaceId: workspace.workspaceId, revision: workspace.revision,
    templateId: selection.templateId, templateVersion: selection.version,
    ...(selection.scenario ? { scenario: selection.scenario } : {}),
    ...(selection.scenarios ? { scenarios: [...selection.scenarios] } : {}),
    authoringDigest: sha(workspace), previewFingerprint: preview.fingerprint,
    targets: structuredClone(selection.targets), subjects: selection.targets.map(scopeRef),
    rules, mapping,
  }
  return { ...bare, fingerprint: digestPlan(bare) }
}

/** 同一个案卷/运行只允许精确的任务与对象快照，人工改写规则或丢失模块关系都将拒止。 */
export function verifyD2InstalledPlan(aggregate: CaseAggregateV2): string[] {
  const plan = aggregate.d2RuntimePlan
  if (!plan) return []
  const problems: string[] = []
  const candidateProblem = d2CandidateShellProblem(getTemplate(plan.templateId, plan.templateVersion))
  if (candidateProblem) problems.push(candidateProblem)
  const { fingerprint, ...bare } = plan
  if ((plan.schemaVersion !== 1 && plan.schemaVersion !== 2 && plan.schemaVersion !== 3) ||
      (plan.targets.some(t=>t.kind==='generic-object')&&plan.schemaVersion!==3) ||
      (plan.targets.some(t=>t.kind==='student-field') && plan.schemaVersion!==2) ||
      plan.mode !== 'technical-pre-review' || plan.publicationAllowed !== false || fingerprint !== digestPlan(bare)) {
    problems.push('D2 作者态任务包指纹不匹配或伪造发布资格')
  }
  if (aggregate.caseV2.templateId !== plan.templateId || aggregate.caseV2.templateVersion !== plan.templateVersion ||
      aggregate.caseV2.caseFields.d2PlanFingerprint?.kind !== 'text' ||
      aggregate.caseV2.caseFields.d2PlanFingerprint.value !== fingerprint) {
    problems.push('D2 任务包没有绑定当前案卷模板/固定指纹')
  }
  const extraRules = (aggregate.caseV2.reviewRules ?? []).filter((rule) => !plan.rules.some((entry) => entry.id === rule.id))
  if (extraRules.length) problems.push('D2 案卷存在未登记的外部规则，不能混入固定责任包')
  const storedRules = new Map((aggregate.caseV2.reviewRules ?? []).map((item) => [item.id, item]))
  for (const rule of plan.rules) if (sha(storedRules.get(rule.id)) !== sha(rule)) problems.push('D2 生效 RuleSpec 被更改：' + rule.id)
  if ((aggregate.caseV2.reviewRules ?? []).some((rule) => rule.id.startsWith('d2-') && !plan.rules.some((entry) => entry.id === rule.id))) {
    problems.push('出现不属于当前 D2 任务包的额外规则')
  }
  const extraSubjects = aggregate.caseV2.subjects.filter((subject) => !plan.subjects.some((item) => item.id === subject.id))
  if (extraSubjects.length) problems.push('D2 案卷存在未登记的外部业务主体，可能污染整案检查范围')
  const storedSubjects = new Map(aggregate.caseV2.subjects.map((item) => [item.id, item]))
  for (const subject of plan.subjects) if (sha(storedSubjects.get(subject.id)) !== sha(subject)) {
    problems.push('D2 业务对象或操作范围被改写：' + subject.id)
  }
  for (const item of plan.mapping) {
    const rule = storedRules.get(item.ruleId)
    const expected = item.objectKey ? plan.targets.find((target) => target.objectKey === item.objectKey) : undefined
    if (!rule || sha(item.sourceIds) !== sha(rule.sourceRefIds) ||
        (expected ? expected.subjectId !== item.subjectId || rule.sectionId !== sectionFor(expected.objectKey) : !!item.subjectId || !!rule.sectionId)) {
      problems.push('D2 来源/业务对象映射失效：' + item.checkId)
    }
  }
  return problems
}

/**
 * 通过既有 submitCommand 事务持久化真实案卷的业务对象及 RuleSpec；
 * 只允许尚未执行的 D1 技术草稿壳，不产生发布或决定。更新需要新案卷/明确重新编译。
 */
export function attachD2RuntimePlan(input: {
  caseId: string
  requestId: string
  actor: Actor
  expectedRevision: number
  workspace: ReviewAuthoringWorkspaceV1
  selection: D2ScenarioSelection
  trustedStudentSnapshot?: D2TrustedStudentSnapshotV1
}): Promise<ReviewCommandResult<D2RuntimePlan>> {
  return submitCommand<{ workspace: ReviewAuthoringWorkspaceV1; selection: D2ScenarioSelection; trustedStudentSnapshot?: D2TrustedStudentSnapshotV1 }, D2RuntimePlan>(
    input.caseId, {
      requestId: input.requestId, actor: input.actor, expectedRevision: input.expectedRevision,
      type: 'AttachD2TechnicalReviewPlan', payload: { workspace: input.workspace, selection: input.selection, trustedStudentSnapshot: input.trustedStudentSnapshot },
    }, (aggregate, payload) => {
      if (aggregate.caseV2.stage !== 'draft' || aggregate.d2RuntimePlan) {
        throw new CommandValidationError('INVALID_TRANSITION', 'D2 只能绑定未开始审核且没有已固定计划的草稿案卷')
      }
      // Native V3 cases are created unbound: attach the selected candidate
      // and its entire D2 plan in one existing Case transaction.
      const nativeUnbound = aggregate.receiptLog[0]?.type === 'CreateNativeWorkspaceCaseV3' &&
        aggregate.caseV2.templateId === 'pending-template-v3' &&
        aggregate.caseV2.templateVersion === 0
      const templateId = nativeUnbound ? payload.selection.templateId : aggregate.caseV2.templateId
      const templateVersion = nativeUnbound ? payload.selection.version : aggregate.caseV2.templateVersion
      const template = getTemplate(templateId, templateVersion)
      const shellProblem = d2CandidateShellProblem(template)
      if (shellProblem || !template) throw new CommandValidationError('AGENT_DECISION_DISABLED', shellProblem ?? '候选模板不存在')
      const selectedCase = nativeUnbound ? {
        ...aggregate.caseV2, templateId, templateVersion, objectType: template.objectType,
      } : aggregate.caseV2
      const plan = compileD2RuntimePlan(payload.workspace, payload.selection, selectedCase, payload.trustedStudentSnapshot)
      if ((aggregate.caseV2.reviewRules?.length ?? 0) > 0 || aggregate.caseV2.subjects.length > 0) {
        throw new CommandValidationError('VALIDATION_FAILED', 'D2 草稿案卷不能预先混入未登记的规则或业务主体；须先固定唯一任务包')
      }
      return {
        summary: '固定 D2 技术预审计划：' + plan.templateId + (plan.scenario ? '/' + plan.scenario : '') + '，' + plan.mapping.length + ' 项检查',
        mutate: (draft) => {
          if (nativeUnbound) {
            draft.caseV2.templateId = templateId
            draft.caseV2.templateVersion = templateVersion
            draft.caseV2.objectType = template.objectType
          }
          draft.caseV2.subjects.push(...structuredClone(plan.subjects))
          draft.caseV2.reviewRules = [...(draft.caseV2.reviewRules ?? []), ...structuredClone(plan.rules)]
          draft.caseV2.caseFields = { ...draft.caseV2.caseFields, d2PlanFingerprint: { kind: 'text', value: plan.fingerprint } }
          draft.d2RuntimePlan = structuredClone(plan)
          return structuredClone(plan)
        },
      }
    },
  )
}

/**
 * 专用技术预审建案入口：正式 createCaseFromTemplate 仍只允许已发布模板，
 * 本入口只接受 D1 服务层登记的 candidate-held 草稿，并在创建前完成 D2 编译。
 * 技术建案与 attach 各有独立事务；若第二步受 I/O 故障影响，裸草稿仍不能执行审核，
 * 可用 attachD2RuntimePlan 显式恢复，绝不降级成已发布模板。
 */
export async function createD2TechnicalCase(input: {
  caseId: string
  title: string
  actor: Actor
  workspace: ReviewAuthoringWorkspaceV1
  selection: D2ScenarioSelection
  trustedStudentSnapshot?: D2TrustedStudentSnapshotV1
}): Promise<ReviewCommandResult<D2RuntimePlan>> {
  if (!safe(input.caseId) || !input.title?.trim() || !input.actor.actorId?.trim() || input.actor.role !== 'reviewer') {
    throw new CommandValidationError('VALIDATION_FAILED', 'D2 技术建案缺少安全案卷 ID、标题或审核员身份')
  }
  const template = getTemplate(input.selection.templateId, input.selection.version)
  const shellProblem = d2CandidateShellProblem(template)
  if (shellProblem || !template) throw new CommandValidationError('AGENT_DECISION_DISABLED', shellProblem ?? 'D2 候选模板不存在')
  const now = new Date().toISOString()
  const caseV2: ReviewCaseV2 = {
    id: input.caseId, templateId: template.templateId, templateVersion: template.version,
    title: input.title.trim(), objectType: template.objectType,
    caseFields: {}, subjects: [], documents: [],
    stage: 'draft', revision: 0, createdAt: now, updatedAt: now,
  }
  // 前置编译 fail-closed；坏情景、悬空对象或无来源责任不能留下半个案卷。
  compileD2RuntimePlan(input.workspace, input.selection, caseV2, input.trustedStudentSnapshot)
  const type = 'CreateD2TechnicalReviewCase'
  const createPayload = { title: caseV2.title, templateId: caseV2.templateId, templateVersion: caseV2.templateVersion }
  const receipt: CommandReceipt = {
    requestId: 'd2-create-' + input.caseId, type,
    payloadHash: payloadHash(type, createPayload), revision: 0, at: now,
    summary: '创建 D2 技术预审草稿案卷（不可形成校方行政决定）',
    actor: input.actor,
  }
  await createAggregate(input.caseId, caseV2, receipt)
  const attached = await attachD2RuntimePlan({
    caseId: input.caseId, requestId: 'd2-attach-' + input.caseId,
    actor: input.actor, expectedRevision: 0,
    workspace: input.workspace, selection: input.selection, trustedStudentSnapshot: input.trustedStudentSnapshot,
  })
  // 仅返回实际有计划且已验真配置的案卷，不冒充创建成功。
  if (attached.ok) {
    const problems = verifyD2InstalledPlan(attached.aggregate)
    if (problems.length) throw new Error('D2 创建后计划核验失败：' + problems.join('；'))
  }
  return attached
}

/**
 * 档案类「逐操作已授权/未授权」不能只看 Agent 找到的相关段落。
 * 必须有审核员在既有证据绑定事务中对这一主体、这一具体操作做了确认；
 * 一份查阅授权不会解锁复制，目录公开亦不会解锁实际开放状态。
 * 技术预审仍不产生法律/行政授权，只对可断言结论建立最低独立来源门禁。
 */
export function validateD2OperationEvidence(
  aggregate: CaseAggregateV2,
  ruleId: string,
  status: string,
  documentVersionIds: string[],
): string | undefined {
  const mapping = aggregate.d2RuntimePlan?.mapping.find((entry) => entry.ruleId === ruleId)
  const target = aggregate.d2RuntimePlan?.targets.find((item) => item.objectKey === mapping?.objectKey)
  if (!mapping || !target || (target.kind !== 'archive-operation' && target.kind !== 'archive-item')) return undefined
  if (!['compliant', 'non-compliant', 'not-applicable'].includes(status)) return undefined
  const factKey = target.kind === 'archive-operation' ? 'd2:archive:' + target.operation : 'd2:archive:open-status'
  const proven = aggregate.evidenceLinks.some((link) =>
    link.status === 'confirmed' && link.linkedBy === 'user' &&
    link.subjectId === target.subjectId && link.supportsFact === factKey &&
    documentVersionIds.includes(link.documentVersionId) &&
    aggregate.caseV2.documents.some((doc) => doc.versionId === link.documentVersionId && doc.active !== false),
  )
  if (!proven) return '档案逐操作/开放状态缺少审核员确认的独立证据绑定：' + target.objectKey + '（' + factKey + '）；不得挪用其他操作的授权'
  return undefined
}

/** 覆盖判定直接读取 Pi 的真实运行回执及 SourceRef，不能使用独立的演示回执冒充。 */
export function verifyD2PiRun(aggregate: CaseAggregateV2, run: ReviewRunV2): { complete: boolean; problems: string[] } {
  const plan = aggregate.d2RuntimePlan
  if (!plan) return { complete: false, problems: ['案卷没有 D2 固定任务包'] }
  const problems = verifyD2InstalledPlan(aggregate)
  if (run.status !== 'completed') problems.push('Pi 当前运行尚未完整完成')
  const snapshots = {
    observations: aggregate.observations.map((item) => item as unknown as Record<string, unknown>),
    evidence: aggregate.evidenceLinks.map((item) => item as unknown as Record<string, unknown>),
  }
  if (run.caseId !== aggregate.caseV2.id || run.inputManifest.hash !== computeRunInputHash(aggregate.caseV2, snapshots.observations, snapshots.evidence)) {
    problems.push('Pi 审核运行的案卷/材料输入哈希已过期')
  }
  const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
  if (!template || run.inputManifest.effectiveRuleSetHash !== hashEffectiveRuleSet(resolveEffectiveRules(aggregate, template))) {
    problems.push('Pi 当前生效 RuleSpec 与运行时版本指纹不一致')
  }
  const checkMap = new Map(run.checks.map((check) => [check.checkId, check]))
  const validDocuments = new Map(run.inputManifest.documentVersions.map((entry) => [entry.versionId, entry.contentHash]))
  for (const mapping of plan.mapping) {
    const allSubjects = aggregate.caseV2.subjects.map((item) => item.id).sort()
    const id = runtimeCheckId(mapping.ruleId, mapping.subjectId, allSubjects)
    const check = checkMap.get(id)
    if (!check || check.ruleId !== mapping.ruleId ||
        sha(check.target.subjectIds) !== sha(mapping.subjectId ? [mapping.subjectId] : allSubjects)) {
      problems.push('Pi 运行遗漏或错误复用了业务对象检查：' + mapping.checkId)
      continue
    }
    if (check.status === 'execution-failed' || check.status === 'not-executed') problems.push('检查仍未完成：' + mapping.checkId)
    if (mapping.authority === 'unverified-policy' && check.status !== 'awaiting-confirmation') {
      problems.push('未经核实的制度来源不能生成确定性结论：' + mapping.checkId)
    }
    if (!check.reason?.trim()) problems.push('审核结果缺少理由：' + mapping.checkId)
    const versionIds = check.sourceRefs.map((ref) => ref.documentVersionId)
    const operationIssue = validateD2OperationEvidence(aggregate, mapping.ruleId, check.status, versionIds)
    if (operationIssue) problems.push(operationIssue)
    const gateIssue = validateD2GuardSubmission(aggregate, mapping, check.status, versionIds)
    if (gateIssue) problems.push(gateIssue + ': ' + mapping.checkId)

    if (['compliant', 'non-compliant'].includes(check.status)) {
      if (!check.sourceRefs.length) problems.push('确定结果缺少真实 SourceRef：' + mapping.checkId)
      for (const ref of check.sourceRefs) {
        const doc = aggregate.caseV2.documents.find((entry) => entry.versionId === ref.documentVersionId && entry.active !== false)
        if (!doc || doc.parseRevision !== ref.parseRevision || !doc.contentHash || validDocuments.get(doc.versionId) !== doc.contentHash) {
          problems.push('材料版本/哈希/解析修订不匹配：' + mapping.checkId)
        }
      }
    }
  }
  return { complete: problems.length === 0, problems }
}
