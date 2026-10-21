/**
 * 已发布模板 → T04 可执行计划的 Main 适配（ARCH-CLOSURE-R01 D1 / §4.3）。
 *
 * 职责边界：
 * - **只做无损适配**：T01 的负责人确认约束 `field-number-limit{lte}` 可以无歧义
 *   映射到 T04 既有 `field-maximum`；`gte` 没有对应算子，**不映射、不猜语义**，
 *   进入 `unresolved` 并由 Main 显式报出。
 * - **规则身份统一**：正式运行规则身份沿用 `resolveEffectiveRules()` 的
 *   `template:<id>@<version>`，T01 的 `template-owner:...` 只作为发布证据留存，
 *   不冒充学校政策来源。
 * - **不改写 T04/T01 领域代码**：编译与算子全部调用它们的既有实现。
 * - **不建第二套 PlanStore**：产物只是入参，安装与 Run 写入仍走
 *   `case-store-v2` / `run-store-v2` 的既有 writer。
 */
import type {
  CaseAggregateV2, TemplateVersion, TemplateCriterionSpec, RuleSpec,
} from '@profer/shared'
import {
  compilePublishedTemplateReviewPlan,
  type T04PublishedConstraint,
  type T04PublishedPlanOutput,
  type T04PublishedTarget,
} from './review-v3-t04-published-plan'
import { resolveEffectiveRules } from './effective-rules'
import type { T04Value } from './review-v3-t04-rules-scoring'

/** T01 在 criterion 上保存的负责人确认约束（只读解析，不重建其编辑器语义）。 */
interface TemplateCriterionDeterministicConstraint {
  schemaVersion?: number
  kind?: string
  fieldKey?: string
  fieldScope?: string
  operator?: string
  threshold?: number
  unit?: string
  ownerStatement?: { kind?: string; text?: string; enteredBy?: string; enteredAt?: string; actorId?: string; confirmedAt?: string; statement?: string }
}

/** 一个未映射的约束：必须如实报出，不能静默丢弃或降级。 */
export interface T04UnresolvedConstraint {
  ruleId: string
  fieldKey: string
  operator: string
  reason: string
}

export interface T04TemplatePlanBridgeResult {
  /** 编译产物；存在未映射约束时为 undefined（不拿不完整计划冒充可执行） */
  compiled?: T04PublishedPlanOutput
  constraints: T04PublishedConstraint[]
  unresolved: T04UnresolvedConstraint[]
  /** 参与编译的规则身份，便于台账核对 */
  ruleIds: string[]
}

function criterionOf(template: TemplateVersion): Array<{ sectionId: string; order: number; criterion: TemplateCriterionSpec }> {
  return (template.sections ?? []).flatMap((section) =>
    section.criteria.map((criterion) => ({ sectionId: section.id, order: section.order ?? 0, criterion })))
}

/**
 * 把已发布模板上「负责人已确认」的数值约束适配为 T04 输入。
 *
 * 只接受 `lte`：它等价于「该字段不得超过上限」，与 T04 既有 `field-maximum` 一致。
 * `gte`（下限）在 T04 尚无对应算子，按 unresolved 报出，等 Owner 提供真实算子。
 */
export function adaptT01ConstraintsToT04(
  template: TemplateVersion, effectiveRules: readonly RuleSpec[],
): { constraints: T04PublishedConstraint[]; unresolved: T04UnresolvedConstraint[] } {
  const constraints: T04PublishedConstraint[] = []
  const unresolved: T04UnresolvedConstraint[] = []
  const ruleIdOf = (sectionId: string, criterionId: string): string => `section-${sectionId}-${criterionId}`
  const rulePolicy = new Map(effectiveRules.map((rule) => [rule.id, rule.policyVersionId]))

  for (const { sectionId, criterion } of criterionOf(template)) {
    const raw = (criterion as TemplateCriterionSpec & { deterministicConstraint?: TemplateCriterionDeterministicConstraint })
      .deterministicConstraint
    if (!raw || raw.kind !== 'field-number-limit') continue
    const ruleId = ruleIdOf(sectionId, criterion.id)

    // 真实 T01 作者编辑器与旧 A15 夹具均可读取，保留实际确认人和时间。
    const statement = raw.ownerStatement
    const confirmedBy = statement?.enteredBy?.trim() || statement?.actorId?.trim()
    const confirmedAt = statement?.enteredAt || statement?.confirmedAt
    const authored = statement?.enteredBy !== undefined
    if (!confirmedBy || !confirmedAt || !Number.isFinite(Date.parse(confirmedAt)) ||
        (authored && (statement?.kind !== 'owner-statement' || !statement.text?.trim()))) {
      unresolved.push({ ruleId, fieldKey: raw.fieldKey ?? '', operator: raw.operator ?? '', reason: '负责人尚未确认该数值规则' })
      continue
    }
    if (!raw.fieldKey || typeof raw.threshold !== 'number' || !Number.isFinite(raw.threshold)) {
      unresolved.push({ ruleId, fieldKey: raw.fieldKey ?? '', operator: raw.operator ?? '', reason: '约束缺少字段键或阈值' })
      continue
    }
    // 字段必须真实存在于该模板版本，禁止硬编码任何字段名
    if (!template.fields.some((field) => field.key === raw.fieldKey)) {
      unresolved.push({ ruleId, fieldKey: raw.fieldKey, operator: raw.operator ?? '', reason: '模板中不存在该字段' })
      continue
    }
    if (raw.operator !== 'lte' && raw.operator !== 'gte') {
      unresolved.push({ ruleId, fieldKey: raw.fieldKey, operator: raw.operator ?? '',
        reason: `T04 不支持 ${String(raw.operator)}，不得猜测比较语义` })
      continue
    }
    const policyVersionId = rulePolicy.get(ruleId)
    if (!policyVersionId) {
      unresolved.push({ ruleId, fieldKey: raw.fieldKey, operator: raw.operator, reason: '有效规则中找不到同名规则身份' })
      continue
    }
    constraints.push({
      templateId: template.templateId,
      templateVersion: template.version,
      ruleId,
      // 正式运行规则身份与 resolveEffectiveRules 一致，不采用 template-owner: 前缀
      policyVersionId,
      confirmedBy,
      confirmedAt,
      constraint: raw.operator === 'gte'
        ? { kind: 'field-minimum', fieldKey: raw.fieldKey, minimum: String(raw.threshold),
            ...(raw.unit ? { unit: raw.unit } : {}) }
        : { kind: 'field-maximum', fieldKey: raw.fieldKey, maximum: String(raw.threshold),
            ...(raw.unit ? { unit: raw.unit } : {}) },
    })
  }
  return { constraints, unresolved }
}

/**
 * 由真实案卷构造 T04 目标快照（字段值、原件版本、材料槽状态）。
 *
 * `fieldUnits` 来自负责人已确认的约束：T04 的 `value-limit` 只有在
 * 「字段值单位」与「规则单位」一致时才比较，否则判定为比较依据未知。
 * 单位只用于同一字段的等值比较，不引入任何新业务含义。
 */
export function buildT04TargetFromCase(
  aggregate: CaseAggregateV2, template: TemplateVersion,
  fieldUnits: Readonly<Record<string, string>> = {},
): T04PublishedTarget {
  // 来源必须是当前有效原件；缺失即空数组，绝不虚构来源
  const active = (aggregate.caseV2.documents ?? []).filter((document) => document.active !== false)
  const caseFields: Record<string, T04Value> = {}
  for (const [key, value] of Object.entries(aggregate.caseV2.caseFields ?? {})) {
    const record = value as { kind?: string; value?: unknown }
    if (!record || record.value === undefined || record.value === null) continue
    if (record.kind === 'number') {
      const numeric = typeof record.value === 'number' ? record.value : Number(record.value)
      // confirmed=false 表示尚未人工确认，T04 会据此给出 pending 而不是当成 0
      if (Number.isFinite(numeric)) {
        const unit = fieldUnits[key]
        caseFields[key] = { value: numeric, confirmed: true, ...(unit ? { unit } : {}) }
      }
    } else if (record.kind === 'text' || record.kind === 'date' || record.kind === 'enum') {
      caseFields[key] = { value: String(record.value), confirmed: true }
    }
  }
  const materialSlots: T04PublishedTarget['materialSlots'] = {}
  for (const slot of template.materialSlots ?? []) {
    const ids = active.filter((document) => document.materialSlotId === slot.id).map((document) => document.versionId)
    // confirmed=false 表示「未核实」，与「已确认缺件」不同，不能混为 0
    materialSlots[slot.id] = { documentVersionIds: ids, confirmed: true }
  }
  return {
    scope: 'case',
    targetKey: `case:${aggregate.caseV2.id}`,
    objectKey: `case:${aggregate.caseV2.id}`,
    subjectId: aggregate.caseV2.id,
    fields: caseFields,
    sourceVersionIds: active.map((document) => document.versionId),
    materialSlots,
  }
}

export interface CompileTemplatePlanInput {
  aggregate: CaseAggregateV2
  template: TemplateVersion
  phase?: 'submission' | 'decision'
  /** 已确认事实的额外来源版本（例如补件后新增原件）；默认用案卷当前有效原件 */
  extraSourceVersionIds?: string[]
}

/**
 * 用真实案卷 + 已发布模板编译可执行计划。
 *
 * 有未映射约束时不返回 compiled——宁可 BLOCKED_OWNER，也不拿不完整计划跑审核。
 */
export function compileTemplatePlanForCase(input: CompileTemplatePlanInput): T04TemplatePlanBridgeResult {
  const { aggregate, template } = input
  if (template.status !== 'published') {
    throw new Error('只能为已发布模板编译审核计划')
  }
  const effectiveRules: RuleSpec[] = resolveEffectiveRules(aggregate, template).map((entry) => entry.rule)
  const { constraints, unresolved } = adaptT01ConstraintsToT04(template, effectiveRules)
  const ruleIds = constraints.map((item) => item.ruleId)
  if (unresolved.length > 0) {
    return { constraints, unresolved, ruleIds }
  }
  const fieldUnits: Record<string, string> = {}
  for (const item of constraints) {
    if (item.constraint.unit) fieldUnits[item.constraint.fieldKey] = item.constraint.unit
  }
  const target = buildT04TargetFromCase(aggregate, template, fieldUnits)
  const compiled = compilePublishedTemplateReviewPlan({
    template,
    effectiveRules,
    constraints,
    targets: [target],
    phase: input.phase ?? 'submission',
  })
  return { compiled, constraints, unresolved, ruleIds }
}
