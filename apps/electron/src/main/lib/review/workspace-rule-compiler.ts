/** 将案卷中人工确认的 V1 规则摘要编译成 V2 可执行规则；不支持的约束明确降为人工核验。 */
import type { RuleConstraint, RuleOutlineItem, RulePack, RuleSpec } from '@profer/shared'

export function compileWorkspaceRule(pack: RulePack, outline: RuleOutlineItem, priority = 1): RuleSpec {
  const constraint = outline.constraint
  let execution: RuleSpec['execution'] = pack.confirmed ? 'semantic' : 'manual'
  let targetScope: RuleSpec['targetScope'] = 'subject'
  let when: RuleSpec['when'] = { field: 'title', op: 'exists' }
  let calculation: RuleSpec['calculation']

  if (!pack.confirmed) {
    execution = 'manual'
  } else if (constraint?.kind === 'max-score' && typeof constraint.value === 'number') {
    execution = 'deterministic'
    targetScope = 'group'
    when = { field: 'declaredScore', op: 'exists' }
    calculation = { valueFrom: 'declaredScore', aggregate: 'sum', cap: { value: String(constraint.value), unit: 'point' }, allocation: 'score-desc-then-subject-id' }
  } else if (constraint?.kind === 'score-value' && typeof constraint.value === 'number') {
    // 固定分值必须有明确适用条件；没有条件时转人工核对，避免误套到全部事项。
    execution = constraint.appliesWhen ? 'deterministic' : 'manual'
    // appliesWhen defines applicability, not the fixed-score requirement itself.
    when = constraint.appliesWhen
      ? { field: constraint.appliesWhen.field, op: 'eq', value: constraint.appliesWhen.equals }
      : { field: 'title', op: 'exists' }
  } else if (constraint?.kind === 'date-range' && (constraint.dateFrom || constraint.dateTo)) {
    execution = 'deterministic'
    // A date outside the required range is a violation, never "not applicable".
    // The actual inclusive bounds are evaluated from workspaceConstraint.
    when = { field: 'activityDate', op: 'exists' }
  } else if (constraint?.kind === 'amount-limit' && typeof constraint.value === 'number') {
    execution = 'deterministic'
    // Do not exclude over-limit amounts from the check's denominator.
    when = { field: 'amount', op: 'exists' }
  } else if (constraint?.kind === 'level-mapping' && Object.keys(constraint.levels ?? {}).length > 0) {
    execution = 'deterministic'
    when = { field: 'level', op: 'exists' }
  } else if (constraint?.kind === 'required-evidence' && (constraint.requiredEvidenceTypes?.length ?? 0) > 0) {
    execution = 'deterministic'
    when = { field: 'title', op: 'exists' }
  } else if (constraint) {
    // mutual-exclusion、required-clause 等尚无可表达的通用引擎，明确进入人工核验。
    execution = 'manual'
  }

  const rule: RuleSpec = {
    id: `workspace:${pack.id}:${outline.id}`,
    policyVersionId: `workspace:${pack.id}@${pack.version}`,
    title: `${outline.category} · ${outline.title}`,
    when,
    requirement: outline.summary ? `${outline.title}：${outline.summary}` : outline.title,
    targetScope,
    execution,
    ...(calculation ? { calculation } : {}),
    onFail: 'manual-review',
    onUnknown: 'needs-confirmation',
    sourceRefIds: [`${pack.documentId}-v1`],
    priority,
    confirmation: pack.confirmed ? 'confirmed' : 'unconfirmed',
    ...(pack.confirmed && execution === 'semantic' ? { semanticOutputEnum: ['compliant', 'non-compliant', 'awaiting-confirmation'] } : {}),
    ...(constraint ? { workspaceConstraint: constraint as RuleConstraint } : {}),
  }
  return rule
}
