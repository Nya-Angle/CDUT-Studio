/**
 * 已发布模板计划的正式安装与 Run 写入（ARCH-CLOSURE-R01 D1 / §4.3）。
 *
 * 只做 Main 该做的事：
 * 1. 从**真实已发布** TemplateVersion 与案卷已确认字段编译冻结计划；
 * 2. 用 T04 既有 `evaluateT04Plan` 得出确定性结论，再经 `reconcileF07PublishedPlan`
 *    转成正式 `CheckResult`；
 * 3. 通过既有 `run-store-v2` writer 写入**真实 ReviewRunV2**，把计划指纹、
 *    原件版本、规则集合冻结进 `inputManifest`。
 *
 * 不做的事：
 * - 不新建 PlanStore/RunStore/规则引擎；
 * - 不接受渲染层传入的 Plan、Check 或 Run；
 * - 存在未映射约束（如 `gte`）时直接拒绝，不拿不完整计划跑审核；
 * - 原生 V3 不允许另存 `run-tpl-*` 冒充当前审核结果。
 */
import { createHash } from 'node:crypto'
import type { Actor, CaseAggregateV2, CheckResult, ReviewRunV2, SourceRef, TemplateVersion } from '@profer/shared'
import { CommandValidationError, readAggregate } from './case-store-v2'
import { getTemplate } from './template-store'
import { saveRunV2, listRunsV2 } from './run-store-v2'
import { computeRunInputHash } from './run-service-v2'
import { compileTemplatePlanForCase } from './review-v3-main-template-plan-bridge'
import { evaluateT04Plan } from './review-v3-t04-rules-scoring'
import { reconcileF07PublishedPlan } from './review-v3-f07-plan-coverage'
import { isNativeWorkspaceCaseV3 } from './native-workspace-case-v3'
import { publishedPlanRunFingerprint } from './review-v3-run-plan-binding'

const MAIN_ACTOR: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }
const IGNORED_PREFIX = '[审核员忽略]'

/** 审核员显式忽略的原件：与 readiness 使用同一前缀，不得继续充当材料/来源。 */
const isIgnored = (document: { unusedReason?: string }): boolean =>
  typeof document.unusedReason === 'string' && document.unusedReason.startsWith(IGNORED_PREFIX)

/** A source is accepted only when backed by an active version in this Case. */
function sourceRefsOf(aggregate: CaseAggregateV2): SourceRef[] {
  return (aggregate.caseV2.documents ?? [])
    .filter((document) => document.active !== false && !isIgnored(document))
    .map((document) => ({
      caseId: aggregate.caseV2.id,
      documentVersionId: document.versionId,
      parseRevision: document.parseRevision ?? 0,
      location: { kind: 'file' as const },
    }))
}

export interface TemplateRuleRunResult {
  runId: string
  planFingerprint: string
  /** 与 Run.inputManifest.hash 一致，供调用方在不重新读取时关联补件 */
  inputHash: string
  checks: CheckResult[]
  status: 'completed' | 'partially-completed'
  ruleIds: string[]
  diagnostics?: string[]
}

export interface TemplateRuleEvaluation {
  planFingerprint: string
  /** T04 编译器的真实 CanonicalPlan 身份，不能用派生运行指纹代替。 */
  frozenPlan: Extract<NonNullable<ReviewRunV2['inputManifest']['frozenPlan']>, { kind: 'published-template' }>
  checks: CheckResult[]
  status: 'completed' | 'partially-completed'
  ruleIds: string[]
  coverage: ReviewRunV2['coverage']
  blockers: string[]
  /** 需要 T04 专门执行的已确认数值约束与模板材料槽位。 */
  specializedRuleIds: string[]
  /** 参与覆盖分母的完整规则集，包含由 materialSlots 派生的检查规则。 */
  coverageRules: import('@profer/shared').RuleSpec[]
  recordedAt: string
}

export function templateRuleSpecializedRuleIds(template: TemplateVersion): string[] {
  const constraintIds = (template.sections ?? []).flatMap((section) => section.criteria.flatMap((criterion) => {
    const raw = (criterion as typeof criterion & { deterministicConstraint?: { kind?: string } }).deterministicConstraint
    return raw?.kind === 'field-number-limit' ? [`section-${section.id}-${criterion.id}`] : []
  }))
  const materialIds = (template.materialSlots ?? []).filter((slot) => slot.minCount > 0)
    .map((slot) => 'required-material-' + slot.id)
  return [...new Set([...constraintIds, ...materialIds])]
}

/**
 * 计算已发布模板的权威检查，但不创建 Run。
 * 统一 Pi Run 直接消费这些检查，确保一次用户动作不会为同一审核轮次
 * 同时产生独立的 run-tpl-* 与 run-pi-* 两套账。
 */
export function evaluateTemplateRuleReview(input: {
  aggregate: CaseAggregateV2
  template: TemplateVersion
  phase?: 'submission' | 'decision'
  recordedAt?: string
  /** 业务判断日（YYYY-MM-DD）；缺省时带有效期规则保持 pending，不偷用机器时间。 */
  asOfDate?: string
}): TemplateRuleEvaluation {
  const { aggregate, template } = input
  // D2 技术预审案卷只能走技术 Run；正式业务规则计划不能替代其身份。
  if (aggregate.d2RuntimePlan) {
    throw new CommandValidationError('AGENT_DECISION_DISABLED', 'D2 技术预审案卷不得使用正式业务规则计划')
  }
  if (template.status !== 'published') {
    throw new CommandValidationError('INVALID_TRANSITION', '只有已发布模板可以生成正式审核运行')
  }
  const phase = input.phase ?? 'submission'
  const bridge = compileTemplatePlanForCase({
    aggregate, template, phase, ...(input.asOfDate ? { asOfDate: input.asOfDate } : {}),
  })
  if (!bridge.compiled) {
    throw new CommandValidationError('DEPENDENCY_UNRESOLVED',
      `模板规则尚不能编译为可执行计划：${bridge.unresolved.map((item) => `${item.ruleId}（${item.reason}）`).join('；')}`)
  }
  const { plan, checks, bindings } = bridge.compiled
  if (bindings.length === 0) {
    throw new CommandValidationError('DEPENDENCY_UNRESOLVED', '已发布模板尚无可执行检查，不能记录空运行')
  }
  const ruleIds = bindings.map((item) => item.rule.id)
  const recordedAt = input.recordedAt ?? new Date().toISOString()
  const active = (aggregate.caseV2.documents ?? []).filter((document) =>
    document.active !== false && !isIgnored(document))
  const proposals = evaluateT04Plan(plan, checks)
  if (proposals.length !== plan.bindings.length) {
    throw new CommandValidationError('DEPENDENCY_UNRESOLVED', 'T04 实际检查数量与冻结计划不一致')
  }
  const reconciled = reconcileF07PublishedPlan({
    plan, bindings,
    results: proposals.map((proposal, index) => ({ binding: plan.bindings[index]!, proposal })),
    documents: active, verifiedSources: sourceRefsOf(aggregate),
    caseId: aggregate.caseV2.id, recordedAt,
  })
  const results: CheckResult[] = reconciled.checks
  const pending = results.filter((item) =>
    item.status === 'awaiting-confirmation' || item.status === 'awaiting-supplement').length
  const failed = results.filter((item) =>
    item.status === 'execution-failed' || item.status === 'not-executed').length
  const planFingerprint = publishedPlanRunFingerprint(plan.fingerprint, ruleIds)
  const coverageRules = [...new Map(bindings.map((item) => [
    item.rule.policyVersionId + '::' + item.rule.id, item.rule,
  ])).values()]
  return {
    planFingerprint, checks: results, ruleIds, coverage: reconciled.coverage,
    frozenPlan: {
      kind: 'published-template', planId: plan.planId, fingerprint: plan.fingerprint,
      bindings: structuredClone(plan.bindings),
    },
    status: pending > 0 || failed > 0 || reconciled.blockers.length > 0 ? 'partially-completed' : 'completed',
    blockers: reconciled.blockers,
    specializedRuleIds: templateRuleSpecializedRuleIds(template),
    coverageRules, recordedAt,
  }
}

/**
 * 兼容既有独立模板规则入口。新统一工作台直接把 evaluateTemplateRuleReview
 * 的结果纳入 run-pi-*，不调用本函数；因此统一流程只创建一份 ReviewRunV2。
 */
export function runTemplateRuleReview(input: {
  caseId: string
  phase?: 'submission' | 'decision'
  initiatedBy?: Actor
  /** 业务判断日（YYYY-MM-DD），由调用方显式提供；缺省不偷用机器时间。 */
  asOfDate?: string
}): TemplateRuleRunResult {
  const aggregate = readAggregate(input.caseId)
  if (!aggregate) throw new CommandValidationError('NOT_FOUND', '案卷不存在')
  // 原生 V3 的确定性检查只能作为同一 Pi Run 的输入，不能经旧 IPC
  // 另存 run-tpl-* 并被历史/结果/决定误认为新一轮完整审核。
  if (isNativeWorkspaceCaseV3(aggregate)) {
    throw new CommandValidationError('INVALID_TRANSITION',
      '原生 V3 请使用统一初审/重新审核；独立规则运行不能作为当前审核结果')
  }
  const template: TemplateVersion | undefined = getTemplate(
    aggregate.caseV2.templateId, aggregate.caseV2.templateVersion,
  )
  if (!template) throw new CommandValidationError('DEPENDENCY_UNRESOLVED', '模板不存在')
  const evaluation = evaluateTemplateRuleReview({
    aggregate, template, phase: input.phase, ...(input.asOfDate ? { asOfDate: input.asOfDate } : {}),
  })
  const executedAt = evaluation.recordedAt
  const inputHash = computeRunInputHash(
    aggregate.caseV2,
    (aggregate.observations ?? []) as unknown as Array<Record<string, unknown>>,
    (aggregate.evidenceLinks ?? []) as unknown as Array<Record<string, unknown>>,
  )
  const run: ReviewRunV2 = {
    id: `run-tpl-${Date.now().toString(36)}-${createHash('sha256').update(evaluation.planFingerprint + executedAt).digest('hex').slice(0, 8)}`,
    caseId: aggregate.caseV2.id,
    templateId: template.templateId,
    templateVersion: template.version,
    inputManifest: {
      hash: inputHash,
      templateVersion: template.version,
      policyVersions: (template.policyRefs ?? []).map((ref) => ({ policyVersionId: ref.policyId, version: ref.version })),
      // F03 身份：manifest 必须使用与当前案卷校验一致的完整版本集和 contentHash 语义，
      // 包含已被替换的历史原件；byteHash/versionId 兜底会让刚生成的 run-tpl 误判过期。
      documentVersions: (aggregate.caseV2.documents ?? []).map((document) => ({
        documentId: document.documentId, versionId: document.versionId, contentHash: document.contentHash,
      })),
      observationIds: (aggregate.observations ?? []).map((item) => item.id),
      evidenceLinkIds: (aggregate.evidenceLinks ?? []).map((item) => item.id),
      effectiveRuleIds: evaluation.ruleIds,
      effectiveRuleSetHash: createHash('sha256').update([...evaluation.ruleIds].sort().join(',')).digest('hex'),
      planFingerprint: evaluation.planFingerprint,
      frozenPlan: evaluation.frozenPlan,
    },
    status: evaluation.status,
    checkpoints: [{ nodeId: 'template-rule-plan', inputHash: evaluation.planFingerprint, status: 'done', attempts: 1 }],
    checks: evaluation.checks,
    opinions: [],
    coverage: evaluation.coverage,
    diagnostics: [
      `模板规则计划：${evaluation.ruleIds.length} 条规则，${evaluation.checks.length} 项检查`,
      `计划指纹：${evaluation.planFingerprint}`,
      `业务判断日：${input.asOfDate ?? '未指定（带有效期规则将保持待确认）'}`,
      ...evaluation.blockers.map((reason) => `覆盖阻断：${reason}`),
    ],
    startedAt: executedAt, completedAt: executedAt,
    initiatedBy: input.initiatedBy ?? MAIN_ACTOR,
  }
  saveRunV2(run)
  return {
    runId: run.id, planFingerprint: evaluation.planFingerprint, inputHash,
    checks: evaluation.checks, status: evaluation.status, ruleIds: evaluation.ruleIds,
    diagnostics: run.diagnostics,
  }
}

/** 读取某案卷最近一次模板规则运行（供界面与台账核对）。 */
export function latestTemplateRuleRun(caseId: string): ReviewRunV2 | undefined {
  const runs = listRunsV2(caseId).filter((run) => run.id.startsWith('run-tpl-'))
  return runs[0]
}
