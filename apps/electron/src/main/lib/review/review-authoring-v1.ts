/**
 * D1 作者态 -> 既有 TemplateVersion / RuleSpec 的可验证候选快照。
 * 复用 D0.5 已验证组合；运行时仍只有现有 resolveEffectiveRules/Pi 服务。
 * 不确认真实校规，不生成审批结论；高级约束不能映射时 fail-closed。
 */
import { createHash } from 'node:crypto'
import type {
  CaseAggregateV2, ReviewAuthoringManifestV1, ReviewAuthoringRuleMapV1,
  ReviewAuthoringWorkspaceV1, ReviewAuthoringSourceV1, TemplateVersion,
} from '@profer/shared'
import { previewDemo, projectSimpleDemoDraft, validateDemoState, type DemoState, type DemoPreview } from './semantic-module-demo'
import { resolveEffectiveRules, hashEffectiveRuleSet } from './effective-rules'
import { validateTemplate } from './template-store'
import { validateD3WorkspaceLocks } from './review-d3-workspace-locks'
import { validateD2ExecutionGate } from './review-d2-execution-gates'

const ID = /^[a-z][a-z0-9-]{0,79}$/
const sha = (value: unknown): string => createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex')
/** criterionId 完全复用 D0.5 对原始 checkId UTF-8 文本的 hash 约定。 */
const shaCheckId = (value: string): string => createHash('sha256').update(value, 'utf8').digest('hex')
const toDemo = (workspace: ReviewAuthoringWorkspaceV1): DemoState => ({
  revision: workspace.revision,
  modules: workspace.definitions.modules,
  templates: workspace.definitions.templates,
})

const sourceUsableInCandidate = (source: ReviewAuthoringSourceV1): boolean =>
  (source.kind === 'synthetic' || source.kind === 'user-request') &&
  source.applicability === 'request-scope'
const STRUCTURE_KEYS = {
  workspace: ['schemaVersion', 'workspaceId', 'revision', 'definitions', 'sources', 'sourceBindings', 'sharedModuleLocks', 'advanced'],
  definitions: ['modules', 'templates'],
  module: ['moduleId', 'version', 'name', 'purpose', 'scope', 'limits', 'source', 'tasks', 'parameters', 'references'],
  template: ['templateId', 'version', 'name', 'purpose', 'limits', 'source', 'scenarios', 'genericScenarioAxes', 'modules', 'localTasks'],
  responsibility: ['id', 'title', 'requirement', 'completion', 'limits'],
  use: ['id', 'moduleId', 'version', 'scenario', 'objectKey', 'bindings'],
  parameter: ['key', 'description', 'defaultValue'],
  source: ['sourceId', 'kind', 'label', 'reference', 'verification', 'applicability', 'note'],
  inlineSource: ['kind', 'note'],
  documentReference: ['documentVersionId', 'locator', 'excerpt'],
  binding: ['checkId', 'sourceIds', 'applicabilityNote', 'gate', 'studentScope', 'genericScope', 'caseScopeJustification'],
  advanced: ['objectRoleKeys', 'claimKeys', 'evidenceRelations'],
  evidenceRelation: ['claimKey', 'requiredSourceIds'],
} as const

/** 未认识的结构化约束不等于空条件：不能因 schema 较轻就静默忽略。 */
function checkKnownFields(value: unknown, allowed: readonly string[], at: string, issues: string[]): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) issues.push(at + ' 含未映射结构化字段：' + key)
  }
}


/** 不使用模型语义推测来填补 sourceBindings，未映射一律报告。 */
export function validateReviewAuthoringV1(workspace: ReviewAuthoringWorkspaceV1): string[] {
  const issues: string[] = []
  if (workspace?.schemaVersion !== 1) return ['作者态 schemaVersion 必须为 1']
  if (!ID.test(workspace.workspaceId)) issues.push('作者态 workspaceId 非法')
  if (!Number.isSafeInteger(workspace.revision) || workspace.revision < 0) issues.push('草稿修订号无效')
  if (!workspace.definitions || !Array.isArray(workspace.definitions.modules) || !Array.isArray(workspace.definitions.templates)) {
    return [...issues, '作者态定义列表缺失']
  }
  if (!Array.isArray(workspace.sources) || !Array.isArray(workspace.sourceBindings)) {
    return [...issues, '来源或责任绑定列表缺失']
  }
  checkKnownFields(workspace, STRUCTURE_KEYS.workspace, '作者态工作区', issues)
  checkKnownFields(workspace.definitions, STRUCTURE_KEYS.definitions, '作者态定义', issues)
  for (const mod of workspace.definitions.modules) {
    checkKnownFields(mod, STRUCTURE_KEYS.module, mod.moduleId, issues)
    checkKnownFields(mod.source, STRUCTURE_KEYS.inlineSource, mod.moduleId + '.source', issues)
    for (const task of mod.tasks ?? []) checkKnownFields(task, STRUCTURE_KEYS.responsibility, mod.moduleId + '/' + task.id, issues)
    for (const param of mod.parameters ?? []) checkKnownFields(param, STRUCTURE_KEYS.parameter, mod.moduleId + '.param', issues)
    for (const use of mod.references ?? []) checkKnownFields(use, STRUCTURE_KEYS.use, mod.moduleId + '/' + use.id, issues)
  }
  for (const template of workspace.definitions.templates) {
    checkKnownFields(template, STRUCTURE_KEYS.template, template.templateId, issues)
    checkKnownFields(template.source, STRUCTURE_KEYS.inlineSource, template.templateId + '.source', issues)
    for (const task of template.localTasks ?? []) checkKnownFields(task, STRUCTURE_KEYS.responsibility, template.templateId + '/' + task.id, issues)
    for (const use of template.modules ?? []) checkKnownFields(use, STRUCTURE_KEYS.use, template.templateId + '/' + use.id, issues)
    if (template.genericScenarioAxes) {
      const axes = template.genericScenarioAxes
      checkKnownFields(axes, ['primary', 'conditions'], template.templateId + '.genericScenarioAxes', issues)
      const primary = axes.primary, conditions = axes.conditions
      if (!Array.isArray(primary) || !Array.isArray(conditions) || !primary.length ||
          primary.length > 13 || conditions.length > 13 ||
          [...primary, ...conditions].some(x => typeof x !== 'string' || !ID.test(x)) ||
          new Set([...primary, ...conditions]).size !== primary.length + conditions.length ||
          new Set([...primary, ...conditions]).size !== (template.scenarios ?? []).length ||
          [...primary, ...conditions].some(x => !(template.scenarios ?? []).includes(x))) {
        issues.push(template.templateId + ': D2_GENERIC_AXES_INVALID')
      }
    }
  }
  for (const source of workspace.sources) {
    checkKnownFields(source, STRUCTURE_KEYS.source, source.sourceId, issues)
    checkKnownFields(source.reference, STRUCTURE_KEYS.documentReference, source.sourceId + '.reference', issues)
  }
  for (const link of workspace.sourceBindings) {
    checkKnownFields(link, STRUCTURE_KEYS.binding, link.checkId, issues)
    if (link.gate) issues.push(...validateD2ExecutionGate(link.gate).map(msg => link.checkId + ': ' + msg))
    if (link.caseScopeJustification !== undefined && (typeof link.caseScopeJustification !== 'string' || link.caseScopeJustification.trim().length < 12 || link.studentScope || link.genericScope)) {
      issues.push(link.checkId + ': D2_STUDENT_CASE_SCOPE_INVALID')
    }
    if (link.genericScope) {
      const scope = link.genericScope
      checkKnownFields(scope, ['businessTypes', 'evidenceFacts'], link.checkId + '.genericScope', issues)
      if (link.studentScope || !Array.isArray(scope.businessTypes) || !scope.businessTypes.length ||
          scope.businessTypes.length > 32 || new Set(scope.businessTypes).size !== scope.businessTypes.length ||
          scope.businessTypes.some(x => typeof x !== 'string' || !ID.test(x)) ||
          !Array.isArray(scope.evidenceFacts) || !scope.evidenceFacts.length ||
          scope.evidenceFacts.length > 32 || new Set(scope.evidenceFacts).size !== scope.evidenceFacts.length ||
          scope.evidenceFacts.some(x => typeof x !== 'string' || !/^[a-zA-Z][a-zA-Z0-9:._-]{0,119}$/.test(x))) {
        issues.push(link.checkId + ': D2_GENERIC_SCOPE_INVALID')
      }
    }
    if (link.studentScope) {
      const scope = link.studentScope
      checkKnownFields(scope, ['fieldKeys', 'intents', 'enrollmentStatuses'], link.checkId + '.studentScope', issues)
      for (const [name, values] of [['fieldKeys', scope.fieldKeys], ['intents', scope.intents], ['enrollmentStatuses', scope.enrollmentStatuses ?? []]] as const) {
        if (!Array.isArray(values) || (name !== 'enrollmentStatuses' && !values.length) ||
          values.length > 32 || new Set(values).size !== values.length ||
          values.some(value => typeof value !== 'string' || !ID.test(value))) {
          issues.push(link.checkId + ': D2_STUDENT_SCOPE_INVALID ' + name)
        }
      }
    }
  }
  if (workspace.advanced) {
    checkKnownFields(workspace.advanced, STRUCTURE_KEYS.advanced, '作者态高级约束', issues)
    for (const relation of workspace.advanced.evidenceRelations ?? []) {
      checkKnownFields(relation, STRUCTURE_KEYS.evidenceRelation, '证据关系', issues)
    }
  }
  issues.push(...validateDemoState(toDemo(workspace)))
  issues.push(...validateD3WorkspaceLocks(workspace))
  const sourceMap = new Map<string, ReviewAuthoringSourceV1>()
  for (const source of workspace.sources) {
    if (!ID.test(source.sourceId)) issues.push('来源 ID 非法：' + source.sourceId)
    if (sourceMap.has(source.sourceId)) issues.push('重复来源 ID：' + source.sourceId)
    sourceMap.set(source.sourceId, source)
    if (!source.label?.trim() || !source.note?.trim()) issues.push('来源缺少标签或性质说明：' + source.sourceId)
    if (!['synthetic', 'user-request', 'cross-school-reference', 'policy-candidate'].includes(source.kind)) issues.push('未知来源性质：' + source.sourceId)
    if (!['unverified', 'content-checked'].includes(source.verification)) issues.push('来源内容核验状态无效：' + source.sourceId)
    if (!['unknown', 'reference-only', 'request-scope'].includes(source.applicability)) issues.push('来源适用状态无效：' + source.sourceId)
    if (source.reference && (!source.reference.documentVersionId?.trim() || !source.reference.locator?.trim())) {
      issues.push('来源文件引用缺少原件版本或段落定位：' + source.sourceId)
    }
    if (source.kind === 'policy-candidate' && source.applicability !== 'unknown') {
      issues.push('未由政策治理确认的制度候选不得直接宣称适用于本案：' + source.sourceId)
    }
    if (source.kind === 'cross-school-reference' && source.applicability === 'request-scope') {
      issues.push('跨校参考规则不得自动作为本案生效要求：' + source.sourceId)
    }
  }

  // 多分支在制作阶段逐个展开以获得全部责任；不把未选择情景当成无责任。
  const expected = new Set<string>()
  for (const template of workspace.definitions.templates) {
    const scenarios = template.scenarios?.length ? template.scenarios : [undefined]
    for (const scenario of scenarios) {
      const preview = previewDemo(toDemo(workspace), template.templateId, template.version, scenario)
      issues.push(...preview.issues.map((item) => template.templateId + '@' + template.version + ': ' + item))
      for (const task of preview.tasks) expected.add(template.templateId + '@' + template.version + ':' + task.checkId)
    }
  }
  const bindings = new Map<string, string[]>()
  for (const binding of workspace.sourceBindings) {
    // 业务模板 ID 和 checkId 分开连接；同一模块可被不同模板引用。
    const id = binding.checkId
    if (bindings.has(id)) issues.push('同一责任出现重复来源绑定：' + id)
    bindings.set(id, binding.sourceIds)
    if (!expected.has(id)) issues.push('来源绑定指向不存在的责任：' + id)
    if (!binding.sourceIds?.length) issues.push('审核责任必须有明确来源性质或待核来源：' + id)
    if (new Set(binding.sourceIds).size !== binding.sourceIds.length) issues.push('来源列表重复：' + id)
    for (const sourceId of binding.sourceIds ?? []) {
      if (!sourceMap.has(sourceId)) issues.push('来源绑定引用不存在的来源：' + id + ' -> ' + sourceId)
    }
  }
  for (const id of expected) if (!bindings.has(id)) issues.push('审核责任缺少来源绑定：' + id)
  if (workspace.advanced?.evidenceRelations?.length) {
    const sourceIds = new Set(workspace.sources.map((item) => item.sourceId))
    const claims = new Set(workspace.advanced.claimKeys ?? [])
    for (const relation of workspace.advanced.evidenceRelations) {
      if (!claims.has(relation.claimKey) || !relation.requiredSourceIds?.length ||
          relation.requiredSourceIds.some((id) => !sourceIds.has(id))) {
        issues.push('高级证据关系引用无效：' + relation.claimKey)
      }
    }
  }
  return [...new Set(issues)]
}

export interface ReviewAuthoringCandidateV1 {
  template: TemplateVersion
  manifest: ReviewAuthoringManifestV1
  preview: DemoPreview
}

/**
 * 不支持的条件、逐操作对象、高级 Claim/Evidence 关系不能静默降级。
 * 以现有 resolveEffectiveRules 的结果为真值，验证 ID/要求/数量与作者责任一一对应。
 */
export function compileReviewAuthoringCandidateV1(
  workspace: ReviewAuthoringWorkspaceV1,
  templateId: string,
  version: number,
): ReviewAuthoringCandidateV1 {
  const issues = validateReviewAuthoringV1(workspace)
  if (issues.length) throw new Error('AUTHORING_INVALID: ' + issues.join('；'))
  if (workspace.advanced && Object.values(workspace.advanced).some((value) => Array.isArray(value) && value.length > 0)) {
    throw new Error('UNMAPPABLE_ADVANCED: 高级角色/Claim/Evidence 关系尚未映射至有效规则，不得静默投影')
  }
  if (workspace.sourceBindings.some(binding => binding.gate)) {
    throw new Error('D1_UNMAPPABLE_EXECUTION_GATE: 结构化条件必须通过 D2 固定案卷执行，不能丢失条件后降级成 D1 无条件候选')
  }
  const lockIssues = validateD3WorkspaceLocks(workspace, true)
  if (lockIssues.length) throw new Error('D3_FROZEN_LOCK_INVALID: ' + lockIssues.join('；'))
  // 先递归审查全部引用树是否能无损落到旧模板，再按当前情景生成候选任务。
  const template = projectSimpleDemoDraft(toDemo(workspace), templateId, version)
  const preview = previewDemo(toDemo(workspace), templateId, version)
  if (preview.blocked) throw new Error('审核责任预览仍被阻断：' + preview.issues.join('；'))

  const sourceMap = new Map(workspace.sources.map((item) => [item.sourceId, item]))
  const links = new Map(workspace.sourceBindings.map((item) => [item.checkId, item.sourceIds]))
  for (const task of preview.tasks) {
    const key = templateId + '@' + version + ':' + task.checkId
    const ids = links.get(key) ?? []
    if (ids.some((id) => !sourceUsableInCandidate(sourceMap.get(id)!))) {
      throw new Error('UNVERIFIED_AUTHORITY: 跨校参考、制度候选或未知适用范围不得编译成当前生效要求：' + key)
    }
  }
  // 在现有 criterion 中保留来源性质，使 Pi 最终收到的任务文本不丢失来源警告；
  // sourceIds 在 manifest 中提供精确机读对应，但不伪造真实材料的 SourceRef。
  for (const task of preview.tasks) {
    const id = 'demo-' + shaCheckId(task.checkId).slice(0, 16)
    const criterion = template.sections?.flatMap((section) => section.criteria).find((entry) => entry.id === id)
    if (!criterion) throw new Error('RULE_TRUTH_MISMATCH: 无法为审核责任追加来源声明：' + task.checkId)
    const sourceIds = links.get(templateId + '@' + version + ':' + task.checkId)!
    const notes = sourceIds.map((sourceId) => {
      const anchor = sourceMap.get(sourceId)!
      return sourceId + ' / ' + anchor.kind + ' / ' + anchor.applicability + ' / ' + anchor.label
    })
    criterion.requirement += '\n作者态来源（非制度批准）：' + notes.join('；')
  }
  template.description = '[D1 作者态候选，非已发布学校制度] ' + (template.description ?? '')
  template.sourceNote = 'D1_AUTHORING_CANDIDATE: 只有制作与运行投影校验，禁止无授权发布'
  const templateIssues = validateTemplate(template).filter((issue) => issue.level === 'error')
  if (templateIssues.length) throw new Error('TEMPLATE_INVALID: ' + templateIssues.map((item) => item.message).join('；'))
  const criteria = template.sections?.flatMap((section) => section.criteria.map((criterion) => ({ section, criterion }))) ?? []
  const effective = resolveEffectiveRules({ caseV2: { reviewRules: [] } } as unknown as Pick<CaseAggregateV2, 'caseV2'>, template)
  const ruleMap = new Map(effective.map(({ rule }) => [rule.id, rule]))
  if (criteria.length !== preview.tasks.length || effective.length !== preview.tasks.length) {
    throw new Error('RULE_TRUTH_MISMATCH: 作者责任、模板标准与运行规则数量不一致')
  }

  const mapping: ReviewAuthoringRuleMapV1[] = preview.tasks.map((task) => {
    const id = 'demo-' + shaCheckId(task.checkId).slice(0, 16)
    const criterion = criteria.find((item) => item.criterion.id === id)
    if (!criterion) throw new Error('RULE_TRUTH_MISMATCH: 审核责任未生成标准 ' + task.checkId)
    const ruleId = 'section-' + criterion.section.id + '-' + id
    const rule = ruleMap.get(ruleId)
    if (!rule || rule.title !== criterion.criterion.title || rule.requirement !== criterion.criterion.requirement ||
        rule.execution !== criterion.criterion.execution || rule.targetScope !== criterion.criterion.targetScope) {
      throw new Error('RULE_TRUTH_MISMATCH: 生效 RuleSpec 与编辑器 criterion 不一致：' + task.checkId)
    }
    const sourceIds = links.get(templateId + '@' + version + ':' + task.checkId)!
    return {
      checkId: task.checkId,
      criterionId: id,
      ruleId,
      ruleDigest: sha(rule),
      sourceIds,
      sourceKinds: sourceIds.map((sourceId) => sourceMap.get(sourceId)!.kind),
    }
  })
  const manifest: ReviewAuthoringManifestV1 = {
    schemaVersion: 1, workspaceId: workspace.workspaceId, revision: workspace.revision,
    templateId, templateVersion: version, authoringDigest: sha(workspace), previewFingerprint: preview.fingerprint,
    templateDigest: digestAuthoringTemplateV1(template),
    effectiveRuleDigest: hashEffectiveRuleSet(effective),
    mapping, status: 'review-candidate', publicationAllowed: false,
  }
  return { template, manifest, preview }
}

/** 不包含时间戳/状态；有且只有模板内容修改才改变结构 digest。 */
export function digestAuthoringTemplateV1(template: TemplateVersion): string {
  const { createdAt: _createdAt, publishedAt: _publishedAt, status: _status, ...content } = template
  return sha(content)
}

/** 检查作者态 Sidecar 是否仍与实际模板和运行规则一致；修改后不能用旧 manifest。 */
export function verifyReviewAuthoringManifestV1(
  template: TemplateVersion,
  manifest: ReviewAuthoringManifestV1,
  workspace: ReviewAuthoringWorkspaceV1,
): string[] {
  const issues: string[] = []
  if (!workspace || manifest.authoringDigest !== sha(workspace) || manifest.workspaceId !== workspace.workspaceId ||
      manifest.revision !== workspace.revision) {
    issues.push('作者态定义或来源绑定已变化，原 manifest 不可信')
  }
  if (workspace && validateReviewAuthoringV1(workspace).length) {
    issues.push('作者态数据校验未通过，不能作为来源证明')
  }
  if (workspace?.definitions?.templates?.some((it) => it.templateId === manifest.templateId && it.version === manifest.templateVersion)) {
    const preview = previewDemo(toDemo(workspace), manifest.templateId, manifest.templateVersion)
    if (preview.blocked || preview.fingerprint !== manifest.previewFingerprint) {
      issues.push('当前生效责任包指纹与作者态 manifest 不一致')
    }
  } else issues.push('作者态缺少对应的业务模板定义')
  if (manifest.publicationAllowed !== false || manifest.status !== 'review-candidate') {
    issues.push('作者态候选不得伪装成已获发布授权')
  }
  if (manifest.templateId !== template.templateId || manifest.templateVersion !== template.version ||
      manifest.templateDigest !== digestAuthoringTemplateV1(template)) {
    issues.push('模板内容或版本与作者态 manifest 不符')
  }
  const effective = resolveEffectiveRules({ caseV2: { reviewRules: [] } } as unknown as Pick<CaseAggregateV2, 'caseV2'>, template)
  if (manifest.effectiveRuleDigest !== hashEffectiveRuleSet(effective)) issues.push('生效规则集与作者态 manifest 不符')
  const rules = new Map(effective.map(({ rule }) => [rule.id, rule]))
  if (manifest.mapping.length !== rules.size || new Set(manifest.mapping.map((it) => it.ruleId)).size !== manifest.mapping.length) {
    issues.push('规则来源映射存在遗漏或重复')
  }
  const authoredBindings = new Map(workspace?.sourceBindings?.map((entry) => [entry.checkId, entry.sourceIds]) ?? [])
  const sourceMap = new Map(workspace?.sources?.map((entry) => [entry.sourceId, entry]) ?? [])
  for (const entry of manifest.mapping) {
    const rule = rules.get(entry.ruleId)
    if (!rule || entry.ruleDigest !== sha(rule)) issues.push('生效规则内容或来源映射不匹配：' + entry.checkId)
    const linked = authoredBindings.get(manifest.templateId + '@' + manifest.templateVersion + ':' + entry.checkId)
    if (!linked || sha(linked) !== sha(entry.sourceIds) ||
        sha(linked.map((id) => sourceMap.get(id)?.kind)) !== sha(entry.sourceKinds)) {
      issues.push('责任来源映射与作者态不一致：' + entry.checkId)
    }
  }
  return issues
}
