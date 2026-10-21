/**
 * F03：对同一审核目的的多份政策条款做保守归并与具名冲突裁定。
 *
 * 本模块不发布政策、不写入案卷，也不相信规则 priority 代表制度效力。
 * 裁定由可信 Main 在写入业务版本后作为已核验的快照传入；这里再次
 * 检查候选集合指纹，防止旧裁定在政策/适用规则变更后继续生效。
 */
import { createHash } from 'node:crypto'
import type { RuleSpec } from '@profer/shared'

export type F03RuleSource =
  | { kind: 'policy'; policyId: string; version: number }
  | { kind: 'template'; templateId: string; version: number }
  | { kind: 'workspace'; rulePackId?: string }

export interface F03RuleEntry {
  rule: RuleSpec
  origin: F03RuleSource
  /** 只读溯源，不得把来源 ID 当作文件原文引用。 */
  policySources?: Array<{ policyId: string; version: number }>
  originalRuleId?: string
}

export interface F03ClaimLink {
  policyId: string
  version: number
  ruleId: string
  /** 不同 ID 的条款涉及同一限制时，须由负责人明确配置同一个 claimKey。 */
  claimKey: string
}

export interface F03PriorityDecision {
  claimKey: string
  selected: { policyId: string; version: number; ruleId: string }
  /** 必须绑定完整候选语义，不能只绑定旧的 policyId 或规则数量。 */
  candidatesHash: string
  confirmedBy: string
  confirmedAt: string
  reason: string
}

export interface F03Conflict {
  claimKey: string
  candidatesHash: string
  candidates: Array<{ policyId: string; version: number; ruleId: string; title: string; sourceRefIds: string[] }>
  reason: string
}

export interface F03Resolution {
  rules: F03RuleEntry[]
  conflicts: F03Conflict[]
  /** 显式决定排除的规则仍在诊断账本中，而非伪装不存在。 */
  excluded: Array<{ claimKey: string; policyId: string; version: number; ruleId: string; reason: string }>
}

type PolicyEntry = F03RuleEntry & { origin: Extract<F03RuleSource, { kind: 'policy' }> }
const canonical = (value: unknown): string => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']'
  const o = value as Record<string, unknown>
  return '{' + Object.keys(o).sort().map(k => JSON.stringify(k) + ':' + canonical(o[k])).join(',') + '}'
}
const digest = (value: unknown): string => createHash('sha256').update(canonical(value)).digest('hex')
const sourceIdentity = (item: PolicyEntry): string =>
  canonical([item.origin.policyId, item.origin.version, item.rule.id])
const nonempty = (value: string): boolean => typeof value === 'string' && value.trim().length > 0
const dateOnly = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const d = new Date(value + 'T00:00:00.000Z')
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
}

/** 只有审核语义相同才可合并来源；不比较显示顺序、规则 ID 和来源定位。 */
function ruleMeaning(rule: RuleSpec): unknown {
  return {
    title: rule.title, when: rule.when, requirement: rule.requirement,
    targetScope: rule.targetScope, sectionId: rule.sectionId, groupBy: rule.groupBy,
    execution: rule.execution, calculation: rule.calculation, dataCheck: rule.dataCheck,
    workspaceConstraint: rule.workspaceConstraint, semanticOutputEnum: rule.semanticOutputEnum,
    onFail: rule.onFail, onUnknown: rule.onUnknown, exceptions: rule.exceptions,
    effectiveFrom: rule.effectiveFrom, effectiveUntil: rule.effectiveUntil,
  }
}

/** 所有定义、版本和确认状态都参与指纹；选过的旧裁定不能自动适用新版本。 */
function candidatesHash(group: PolicyEntry[]): string {
  return digest(group.map(item => ({
    source: sourceIdentity(item), rule: ruleMeaning(item.rule),
    confirmation: item.rule.confirmation, sourceRefIds: [...item.rule.sourceRefIds].sort(),
  })).sort((a, b) => a.source.localeCompare(b.source)))
}

function guarded(entry: F03RuleEntry, reason: 'conflict' | 'unconfirmed'): F03RuleEntry {
  const rule = entry.rule
  // 旧 V2 计算分支未统一检查 confirmation，故暂时将不可信规则投影为人工待核。
  // 仅修改运行时投影，不改写原始已发布 PolicyRecord/RuleSpec。
  // D2 的未认证语义检查必须仍能提交 awaiting-confirmation；Pi 已在写入边界
  // 显式拒绝 unconfirmed→compliant。若降成 manual，旧审核器会在身份校验前
  // 报「非语义检查」，破坏 D2 正式校规不能被模型确认的明确业务门禁。
  const guardedExecution = reason === 'unconfirmed' && rule.execution === 'semantic'
    ? 'semantic' : 'manual'
  return { ...entry, rule: { ...rule, execution: guardedExecution, confirmation: reason === 'conflict' ? 'conflict' : 'unconfirmed',
    // 防止未知或冲突政策携带确定性自动执行载荷。
    dataCheck: undefined, calculation: undefined,
    onFail: 'manual-review', onUnknown: 'needs-confirmation' } }
}

/** 日期只用于确定是否进入本轮计划；缺少可信 asOfDate 不自动采用机器今天日期。 */
function applicable(entry: F03RuleEntry, asOfDate?: string): boolean {
  const { effectiveFrom, effectiveUntil } = entry.rule
  if (!asOfDate || (effectiveFrom && !dateOnly(effectiveFrom)) || (effectiveUntil && !dateOnly(effectiveUntil)) ||
      (effectiveFrom && effectiveUntil && effectiveFrom > effectiveUntil)) return true
  return (!effectiveFrom || asOfDate >= effectiveFrom) && (!effectiveUntil || asOfDate <= effectiveUntil)
}

function guardUncertain(entry: F03RuleEntry, asOfDate?: string): F03RuleEntry {
  const { rule } = entry
  if (rule.confirmation !== 'confirmed') return guarded(entry, rule.confirmation === 'conflict' ? 'conflict' : 'unconfirmed')
  if ((rule.effectiveFrom || rule.effectiveUntil) &&
      (!asOfDate || (rule.effectiveFrom && !dateOnly(rule.effectiveFrom)) ||
        (rule.effectiveUntil && !dateOnly(rule.effectiveUntil)) ||
        (rule.effectiveFrom && rule.effectiveUntil && rule.effectiveFrom > rule.effectiveUntil))) {
    return guarded(entry, 'unconfirmed')
  }
  return entry
}

/**
 * 多政策规则决议纯领域入口。没有明确 claimKey 时只自动识别跨政策同名规则；
 * 不会根据标题、数值大小、上传顺序或较新版本猜测制度优先级。
 */
export function resolveF03PolicyRules(
  entries: readonly F03RuleEntry[],
  options: { claims?: readonly F03ClaimLink[]; decisions?: readonly F03PriorityDecision[]; asOfDate?: string } = {},
): F03Resolution {
  if (options.asOfDate && !dateOnly(options.asOfDate)) throw new Error('F03_AS_OF_DATE_INVALID')
  const active = entries.filter(entry => applicable(entry, options.asOfDate))
  const policies = active.filter((entry): entry is PolicyEntry => entry.origin.kind === 'policy')
  const claimLinks = new Map((options.claims ?? []).map(link => [canonical([link.policyId, link.version, link.ruleId]), link.claimKey]))
  const byId = new Map<string, PolicyEntry[]>()
  for (const item of policies) byId.set(item.rule.id, [...(byId.get(item.rule.id) ?? []), item])
  const qualifiedIdentities = policies.map(sourceIdentity)
  if (new Set(qualifiedIdentities).size !== qualifiedIdentities.length) throw new Error('F03_DUPLICATE_POLICY_RULE')
  const groups = new Map<string, PolicyEntry[]>()
  for (const item of policies) {
    const sameId = byId.get(item.rule.id) ?? []
    const crossPolicySameId = sameId.length > 1
    const linkedKeys = new Set(sameId.map(entry => claimLinks.get(sourceIdentity(entry))))
    // 同一原始 ID 的两条政策不得通过漏配或拆成不同 claimKey 绕开冲突。
    const key = crossPolicySameId
      ? linkedKeys.size === 1 && !linkedKeys.has(undefined)
        ? [...linkedKeys][0]!
        : 'same-rule-id:' + item.rule.id
      : claimLinks.get(sourceIdentity(item)) ?? 'individual:' + sourceIdentity(item)
    groups.set(key, [...(groups.get(key) ?? []), item])
  }

  const result: F03RuleEntry[] = active.filter(entry => entry.origin.kind !== 'policy')
    .map(entry => guardUncertain(entry, options.asOfDate))
  const conflicts: F03Conflict[] = [], excluded: F03Resolution['excluded'] = []
  for (const [claimKey, candidates] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
    const ordered = [...candidates].sort((a, b) => sourceIdentity(a).localeCompare(sourceIdentity(b)))
    const hash = candidatesHash(ordered)
    const sameMeaning = new Set(ordered.map(item => digest(ruleMeaning(item.rule)))).size === 1
    const allConfirmed = ordered.every(item => item.rule.confirmation === 'confirmed')
    if (ordered.length === 1) {
      result.push(guardUncertain(ordered[0]!, options.asOfDate))
      continue
    }
    if (sameMeaning && allConfirmed) {
      const primary = ordered[0]!
      result.push(guardUncertain({ ...primary, rule: {
        ...primary.rule, sourceRefIds: [...new Set(ordered.flatMap(item => item.rule.sourceRefIds))].sort(),
      }, policySources: ordered.map(item => ({ policyId: item.origin.policyId, version: item.origin.version })) }, options.asOfDate))
      continue
    }
    const decision = (options.decisions ?? []).find(d => d.claimKey === claimKey && d.candidatesHash === hash &&
      nonempty(d.confirmedBy) && nonempty(d.reason) && !Number.isNaN(Date.parse(d.confirmedAt)) &&
      ordered.some(item => item.origin.policyId === d.selected.policyId && item.origin.version === d.selected.version &&
        item.rule.id === d.selected.ruleId && item.rule.confirmation === 'confirmed'))
    if (decision) {
      const chosen = ordered.find(item => item.origin.policyId === decision.selected.policyId &&
        item.origin.version === decision.selected.version && item.rule.id === decision.selected.ruleId)!
      result.push(guardUncertain(chosen, options.asOfDate))
      for (const item of ordered) if (item !== chosen) excluded.push({
        claimKey, policyId: item.origin.policyId, version: item.origin.version,
        ruleId: item.rule.id, reason: `具名裁定 ${decision.confirmedBy} 选择 ${chosen.origin.policyId}@${chosen.origin.version}：${decision.reason}`,
      })
      continue
    }
    conflicts.push({
      claimKey, candidatesHash: hash,
      candidates: ordered.map(item => ({ policyId: item.origin.policyId, version: item.origin.version,
        ruleId: item.rule.id, title: item.rule.title, sourceRefIds: [...item.rule.sourceRefIds] })),
      reason: '适用依据冲突或缺少有效的具名裁定；仅受影响条款待确认',
    })
    result.push(...ordered.map(item => guarded(item, 'conflict')))
  }

  // V2 的覆盖/CheckResult 当前只用裸 rule.id 作身份；重复 ID 必须稳定区分，
  // 避免报告把两份政策当作同一条规则。原始 ID 保留在 originalRuleId。
  const counts = new Map<string, number>()
  for (const item of result) counts.set(item.rule.id, (counts.get(item.rule.id) ?? 0) + 1)
  const rules = result.map(item => (counts.get(item.rule.id) ?? 0) < 2 ? item : {
    ...item,
    originalRuleId: item.rule.id,
    rule: { ...item.rule, id: 'f03-' + digest([item.origin, item.rule.policyVersionId, item.rule.id]).slice(0, 24) },
  }).sort((a, b) => a.rule.priority - b.rule.priority || a.rule.id.localeCompare(b.rule.id))
  if (new Set(rules.map(item => item.rule.id)).size !== rules.length) throw new Error('F03_RULE_ID_COLLISION')
  return { rules, conflicts, excluded }
}
