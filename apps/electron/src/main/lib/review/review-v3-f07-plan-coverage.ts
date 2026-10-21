/**
 * F07｜冻结 PlanBinding 与确定性结果的一对一覆盖适配。
 *
 * 不创建 Plan/Run，不写持久化，不接受 Renderer 结果。Main 必须先核实
 * 已发布模板、当前原件、计划指纹和来源身份，再把既有 T04 产物传入。
 * 结果中的 not-executed 是诚实的缺项标记，不代表实际执行过该检查。
 */
import type {
  CanonicalPlan, CheckResult, DocumentVersion, ReviewRunV2, SourceRef,
} from '@profer/shared'
import type { T04PublishedRuleBinding } from './review-v3-t04-published-plan'
import { toT04CheckResult, type T04PlanProposal } from './review-v3-t04-rules-scoring'
import { buildDocumentLedger } from './coverage-ledger'

type Binding = CanonicalPlan['bindings'][number]
const keyOf = (binding: Pick<Binding, 'checkKey' | 'targetKey' | 'objectKey' | 'subjectId'>): string =>
  JSON.stringify([binding.checkKey, binding.targetKey, binding.objectKey, binding.subjectId])
const checkIdOf = (binding: Binding): string => 't04:' + keyOf(binding)

export interface F07ReconciledPlan {
  checks: CheckResult[]
  coverage: ReviewRunV2['coverage']
  /** 供 Main 的运行状态、报告及阶段资格消费；不能代替角色/任务授权。 */
  allClearVerdictAllowed: boolean
  blockers: string[]
  expectedCheckIds: string[]
}

export function reconcileF07PublishedPlan(input: {
  plan: CanonicalPlan
  bindings: readonly T04PublishedRuleBinding[]
  /** 由可信执行调用方提供配对：T04 proposal 自身不携带 subjectId。 */
  results: readonly { binding: Binding; proposal: T04PlanProposal }[]
  documents: readonly DocumentVersion[]
  /** Main 已验证 caseId / versionId / parseRevision 的来源，不是模型引用。 */
  verifiedSources: readonly SourceRef[]
  caseId: string
  recordedAt: string
}): F07ReconciledPlan {
  const { plan, bindings, results, documents, verifiedSources, caseId, recordedAt } = input
  const blockers: string[] = []
  const byBinding = new Map<string, T04PublishedRuleBinding[]>()
  const byProposal = new Map<string, T04PlanProposal[]>()
  for (const entry of bindings) {
    const key = keyOf(entry.binding)
    byBinding.set(key, [...(byBinding.get(key) ?? []), entry])
  }
  for (const { binding, proposal } of results) {
    const key = keyOf(binding)
    // 只能由完整 Binding 身份配对；不能以同名规则或前三元组猜主体。
    if (proposal.checkKey !== binding.checkKey || proposal.targetKey !== binding.targetKey ||
        proposal.objectKey !== binding.objectKey) {
      blockers.push('执行结果声称的 Check×target×object 与配对绑定不一致')
      continue
    }
    byProposal.set(key, [...(byProposal.get(key) ?? []), proposal])
  }
  const planKeys = new Set(plan.bindings.map(keyOf))
  const planKeyCounts = new Map<string, number>()
  for (const binding of plan.bindings) {
    const key = keyOf(binding)
    planKeyCounts.set(key, (planKeyCounts.get(key) ?? 0) + 1)
  }
  if (planKeys.size !== plan.bindings.length) blockers.push('冻结计划存在重复的完整检查绑定')
  if (plan.bindings.length === 0) blockers.push('空计划没有任何可核实检查，不得宣称全部符合')
  if (bindings.length !== plan.bindings.length ||
      [...byBinding.keys()].some(key => !planKeys.has(key))) {
    blockers.push('编译规则绑定与冻结计划不一致')
  }

  const consumed = new Set<T04PlanProposal>()
  const activeSources = new Map<string, SourceRef>()
  const currentDocuments = new Map(documents.map(doc => [doc.versionId, doc]))
  if (currentDocuments.size !== documents.length) blockers.push('当前原件版本身份重复')
  for (const source of verifiedSources) {
    const document = currentDocuments.get(source.documentVersionId)
    if (source.caseId !== caseId || !source.documentVersionId || !document ||
        document.active === false || source.parseRevision !== (document.parseRevision ?? 0)) {
      blockers.push('来源引用不属于当前案卷、已失效或解析版本不匹配')
      continue
    }
    if (activeSources.has(source.documentVersionId)) {
      blockers.push('同一原件版本出现多个来源定位，需核实具体落点')
      continue
    }
    activeSources.set(source.documentVersionId, source)
  }
  const currentVersions = new Set(documents.map(doc => doc.versionId))
  const checks: CheckResult[] = []
  for (const binding of plan.bindings) {
    const id = checkIdOf(binding)
    const matchedBinding = byBinding.get(keyOf(binding)) ?? []
    const proposalsForKey = byProposal.get(keyOf(binding)) ?? []
    const scope = matchedBinding[0]?.rule.targetScope ?? 'case'
    const target: CheckResult['target'] = {
      scope,
      subjectIds: [binding.subjectId],
      ...(scope === 'group' ? { groupKey: binding.targetKey } : {}),
    }
    const fallback = (reason: string): CheckResult => ({
      checkId: id, ruleId: matchedBinding[0]?.rule.id ?? binding.checkKey,
      target, status: 'not-executed', reason, sourceRefs: [],
      executedBy: 'deterministic', executedAt: recordedAt,
    })
    if (planKeyCounts.get(keyOf(binding)) !== 1 || matchedBinding.length !== 1 || proposalsForKey.length !== 1) {
      checks.push(fallback('规则/主体身份不唯一或计划检查没有唯一执行结果'))
      continue
    }
    const proposal = proposalsForKey[0]!
    if (proposal.planFingerprint !== plan.fingerprint ||
        proposal.ruleId !== matchedBinding[0]!.rule.id ||
        proposal.policyVersionId !== matchedBinding[0]!.policyVersionId ||
        JSON.stringify([...proposal.sourceVersionIds].sort()) !==
          JSON.stringify([...binding.sourceVersionIds].sort()) ||
        binding.sourceVersionIds.some(id => !currentVersions.has(id))) {
      checks.push(fallback('结果的计划指纹、规则身份或原件版本与冻结绑定不一致'))
      continue
    }
    consumed.add(proposal)
    const selectedSources: SourceRef[] = []
    const expectedVersions = new Set(binding.sourceVersionIds)
    for (const sourceId of proposal.outcome.sourceRefIds) {
      const source = activeSources.get(sourceId)
      if (!source || !expectedVersions.has(sourceId)) {
        blockers.push(`检查 ${id} 的来源 ${sourceId} 未通过当前原件身份验证`)
      } else if (!selectedSources.some(item => item.documentVersionId === source.documentVersionId)) {
        selectedSources.push(source)
      }
    }
    checks.push({
      ...toT04CheckResult(proposal, target, selectedSources, recordedAt),
      // T04 旧展示 ID 缺 subject；F07 以完整四元组稳定识别。
      checkId: id,
    })
  }
  if (consumed.size !== results.length) {
    blockers.push(`${results.length - consumed.size} 项执行结果未与冻结计划形成唯一对应`)
  }
  const documentLedger = buildDocumentLedger([...documents])
  for (const entry of documentLedger) {
    if (entry.status !== 'read') blockers.push(`原件「${entry.fileName}」尚未完整读取`)
  }
  const pending = checks.filter(check =>
    check.status === 'awaiting-confirmation' || check.status === 'awaiting-supplement' ||
    check.status === 'not-executed' || check.status === 'execution-failed')
  const violations = checks.filter(check => check.status === 'non-compliant')
  const applicable = checks.filter(check => check.status !== 'not-applicable')
  if (!applicable.length) blockers.push('没有实际适用并完成的检查，不得宣称全部符合')
  if (pending.length) blockers.push(`${pending.length} 项计划检查待确认、补件或未完成`)
  if (violations.length) blockers.push(`${violations.length} 项计划检查不符合`)
  const coverage: ReviewRunV2['coverage'] = {
    documents: documentLedger,
    plannedChecks: plan.bindings.length,
    completedChecks: checks.filter(check => check.status !== 'not-executed' && check.status !== 'execution-failed').length,
    effectiveVerdicts: checks.filter(check => check.status === 'compliant' || check.status === 'non-compliant').length,
    pendingChecks: pending.length,
  }
  return {
    checks, coverage, blockers,
    allClearVerdictAllowed: blockers.length === 0,
    expectedCheckIds: plan.bindings.map(checkIdOf),
  }
}
