/**
 * V3 Architecture R01 / T03: real Run identity and per-action decision readiness.
 *
 * Pure domain helper. NO IO, NO Actor selection, NO RunStore/CaseStore writers.
 * Trusted Main must supply the input-snapshot freshness result and, for a
 * CanonicalPlan, its verified frozen fingerprint + exact check-id ledger.
 *
 * A completed technical Run is NOT permission to approve a business case.
 * Technical-preview/local-business classification and actor/task permissions
 * remain independent Main checks.
 */
import type { CaseAggregateV2, CheckResult, ReviewRunV2 } from '@profer/shared'
import type { T05LocalStageAction } from './review-v3-t05-local-stage-plan'

export interface T03AuthorizedException {
  /** An exact check ID, not a free-form rule title or a renderer suggestion. */
  checkId: string
  /** Verified by Main against published template's permitted exception route. */
  authority: 'template-allowed-exception'
  policyVersionId: string
  actorId: string
  reason: string
}

export interface T03TrustedRunEvidence {
  /**
   * Supplied by Main's existing input-hash/source/observation/evidence freshness
   * verification (e.g. isWorkspaceRunStaleV2), NOT by the renderer.
   * Missing or stale evidence is not an affirmative result.
   */
  inputSnapshotFresh: boolean
  /** Required if aggregate.canonicalPlan exists; must come from the Run's
   * immutable trusted Plan installation/RunEvidenceIdentity, not Case UI. */
  runPlanFingerprint?: string
  /** Required for a CanonicalPlan. Each value is the official persisted
   * CheckResult.checkId for exactly one frozen PlanBinding. */
  expectedCheckIds?: readonly string[]
  /** Verified by Main against the published template; only for zero-check
   * explicitly manual-only business flows. */
  manualOnlyTemplate?: boolean
  /** Main-verified, policy-authorized exception decisions for stage-pass. */
  exceptions?: readonly T03AuthorizedException[]
}

export type T03GateAction = T05LocalStageAction

export interface T03RunGateResult {
  action: T03GateAction
  allowed: boolean
  /** This is about run-backed decisions, not business authorization. */
  runCurrent: boolean
  blockers: string[]
  nonCompliantCheckIds: string[]
}

function documentVersionsMatch(
  aggregate: CaseAggregateV2,
  run: ReviewRunV2,
): boolean {
  const recorded = run.inputManifest?.documentVersions
  if (!Array.isArray(recorded)) return false
  const current = aggregate.caseV2.documents
  const versions = new Map<string, { documentId: string; hash: string }>()
  for (const document of current) {
    if (!document.versionId || versions.has(document.versionId)) return false
    versions.set(document.versionId, { documentId: document.documentId, hash: document.contentHash })
  }
  if (recorded.length !== versions.size) return false
  const seen = new Set<string>()
  for (const item of recorded) {
    if (!item.versionId || seen.has(item.versionId)) return false
    seen.add(item.versionId)
    const source = versions.get(item.versionId)
    if (!source || source.hash !== item.contentHash || source.documentId !== item.documentId) return false
  }
  return true
}

function checkLedgerMatches(run: ReviewRunV2, evidence: T03TrustedRunEvidence): string[] {
  const blockers: string[] = []
  const checks = run.checks ?? []
  const ids = checks.map((check) => check.checkId)
  if (ids.some((id) => !id) || new Set(ids).size !== ids.length) {
    blockers.push('真实 Run 的检查 ID 缺失或重复')
  }

  const coverage = run.coverage
  if (!coverage || !Number.isInteger(coverage.plannedChecks)
    || !Number.isInteger(coverage.completedChecks)
    || !Number.isInteger(coverage.pendingChecks)
    || !Number.isInteger(coverage.effectiveVerdicts)
    || coverage.plannedChecks < 0 || coverage.completedChecks < 0
    || coverage.pendingChecks < 0 || coverage.effectiveVerdicts < 0
    || coverage.effectiveVerdicts > coverage.plannedChecks
    || coverage.completedChecks > coverage.plannedChecks) {
    blockers.push('运行检查覆盖账本缺失或计数无效')
    return blockers
  }
  const countedVerdicts = checks.filter((c) => c.status === 'compliant' || c.status === 'non-compliant').length
  if (coverage.effectiveVerdicts !== countedVerdicts) {
    blockers.push('有效检查结论数与实际 Check 状态不一致')
  }
  if (coverage.plannedChecks !== checks.length) {
    blockers.push('运行结果数量与冻结计划的检查分母不一致')
  }
  // Awaiting checks count both as completed execution and as pending business
  // interpretation in coverage-ledger. They are not disjoint buckets.
  const countedCompleted = checks.filter((c) =>
    c.status !== 'not-executed' && c.status !== 'execution-failed').length
  const countedPending = checks.filter((c) =>
    c.status === 'awaiting-confirmation' || c.status === 'awaiting-supplement' ||
    c.status === 'not-executed' || c.status === 'execution-failed').length
  if (coverage.completedChecks !== countedCompleted || coverage.pendingChecks !== countedPending) {
    blockers.push('执行完成数或待处理数与实际 Check 状态不一致')
  }
  if (coverage.plannedChecks === 0 && !evidence.manualOnlyTemplate) {
    blockers.push('不存在已确认的必检计划；不能将空检查结果当成通过')
  }

  const plan = run && evidence.expectedCheckIds
  if (plan) {
    const expected = new Set(plan)
    const actual = new Set(ids)
    if (expected.size !== plan.length || expected.size !== actual.size
      || [...expected].some((id) => !actual.has(id))) {
      blockers.push('冻结计划 Check ID 与实际结果不一致')
    }
    if (coverage.plannedChecks !== plan.length) {
      blockers.push('冻结计划绑定数量与运行覆盖分母不一致')
    }
  }
  return blockers
}

function supplementIsOpen(aggregate: CaseAggregateV2): number {
  return (aggregate.supplements ?? []).filter((item) =>
    item.status === 'open' || item.status === 'responded' || item.status === 'insufficient'
  ).length
}

function resolvedByHuman(
  aggregate: CaseAggregateV2, run: ReviewRunV2, check: CheckResult,
): boolean {
  return (aggregate.dispositions ?? []).some((item) =>
    (!item.runId || item.runId === run.id) &&
    (item.findingKey === check.checkId || item.findingKey === check.ruleId) &&
    (item.disposition === 'human-confirmed-compliant' || item.disposition === 'false-positive'
      || item.disposition === 'waived') &&
    !!item.reason?.trim()
  )
}

function authorizedException(
  check: CheckResult, exceptions: readonly T03AuthorizedException[],
): boolean {
  return exceptions.some((entry) =>
    entry.checkId === check.checkId &&
    entry.authority === 'template-allowed-exception' &&
    !!entry.policyVersionId.trim() && !!entry.actorId.trim() && !!entry.reason.trim()
  )
}

/**
 * Assess the chosen *action* against current immutable Run evidence.
 * Passing this helper NEVER authorizes an actor, a case mode, or a task.
 * Main must recheck those inside the CaseAggregate CAS transaction.
 */
export function assessT03RunAction(input: {
  aggregate: CaseAggregateV2
  run: ReviewRunV2 | undefined
  action: T03GateAction
  evidence?: T03TrustedRunEvidence
}): T03RunGateResult {
  const { aggregate, run, action, evidence } = input
  const blockers: string[] = []
  const nonCompliantCheckIds = (run?.checks ?? []).filter((c) => c.status === 'non-compliant')
    .map((c) => c.checkId)

  // Supplement before the first Run is a legitimate business step. The T05
  // planner separately enforces requiredElements, task, actor and case stage.
  if (action === 'return-for-supplement') {
    return { action, allowed: true, runCurrent: false, blockers, nonCompliantCheckIds }
  }

  if (!run || !evidence) {
    blockers.push('没有 Main 验证的真实运行及其输入快照')
    return { action, allowed: false, runCurrent: false, blockers, nonCompliantCheckIds }
  }
  if (run.id.length === 0 || run.id.startsWith('run@rev') ||
    run.caseId !== aggregate.caseV2.id ||
    run.templateId !== aggregate.caseV2.templateId ||
    run.templateVersion !== aggregate.caseV2.templateVersion ||
    run.inputManifest?.templateVersion !== aggregate.caseV2.templateVersion ||
    !run.inputManifest?.hash) {
    blockers.push('Run 身份或案卷模板版本不匹配')
  }
  if (!evidence.inputSnapshotFresh || !documentVersionsMatch(aggregate, run)) {
    blockers.push('Run 输入已过期：当前原件版本或内容哈希与运行快照不一致')
  }
  const plan = aggregate.canonicalPlan
  if (plan) {
    if (!evidence.runPlanFingerprint || plan.fingerprint !== evidence.runPlanFingerprint ||
      plan.templateId !== aggregate.caseV2.templateId ||
      plan.templateVersion !== String(aggregate.caseV2.templateVersion)) {
      blockers.push('Run 不能证明绑定的是本案卷当前冻结计划')
    }
    if (!evidence.expectedCheckIds) {
      blockers.push('没有来自 Main 的冻结 PlanBinding 检查清单')
    }
  }

  if (run.status !== 'completed' && run.status !== 'partially-completed') {
    blockers.push('运行生命周期尚不足以支持业务决定')
  }
  const runCurrent = blockers.length === 0

  // Reject and return-to-previous-stage can reference a real current Run even
  // when non-compliant; they are NOT synonymous with 'stage-pass'.
  if (action === 'stage-pass') {
    if (run.status !== 'completed') blockers.push('必须完整结束本次运行后才能通过阶段')
    blockers.push(...checkLedgerMatches(run, evidence))
    for (const check of run.checks ?? []) {
      switch (check.status) {
        case 'compliant':
          break
        case 'not-applicable':
          if (!check.reason?.trim()) blockers.push('不适用的检查缺少条件理由: ' + check.checkId)
          break
        case 'non-compliant':
          if (!authorizedException(check, evidence.exceptions ?? [])) {
            blockers.push('不符合规则不得无依据通过阶段: ' + check.checkId)
          }
          break
        case 'awaiting-confirmation':
        case 'awaiting-supplement':
          if (!resolvedByHuman(aggregate, run, check)) {
            blockers.push('待确认检查没有当前 Run 对应的具名人工处置: ' + check.checkId)
          }
          break
        case 'not-executed':
        case 'execution-failed':
          blockers.push('必检规则尚未形成可通过的有效判断: ' + check.checkId)
          break
        default:
          blockers.push('无法识别的规则状态: ' + check.checkId)
      }
    }
    const pendingCount = supplementIsOpen(aggregate)
    if (pendingCount > 0) blockers.push(pendingCount + ' 项补件请求仍未关闭')
    // Outstanding pending checks were handled individually above. Human
    // dispositions do not change the immutable Run coverage counters.
    // Main's existing t05ActionEligibility remains authoritative for
    // allowed business actions, actor rights and stage transitions.
  }
  return { action, allowed: blockers.length === 0, runCurrent, blockers, nonCompliantCheckIds }
}


/**
 * Replacement for T05's legacy currentT05Run scan.
 * A caller in trusted Main supplies the RunStore list and the exact freshness/
 * Plan binding proof for each candidate. This avoids the old, nonexistent
 * inputManifest.documents field and never treats a subset of old files as
 * proof that the Run is current.
 *
 * This does not load storage itself: the sole RunStore remains owned by Main.
 */
export function selectT03CurrentRun(input: {
  aggregate: CaseAggregateV2
  runs: readonly ReviewRunV2[]
  prove: (run: ReviewRunV2) => T03TrustedRunEvidence | undefined
}): ReviewRunV2 | undefined {
  for (let index = input.runs.length - 1; index >= 0; index -= 1) {
    const candidate = input.runs[index]
    if (!candidate || !['completed', 'partially-completed'].includes(candidate.status)) continue
    const result = assessT03RunAction({
      aggregate: input.aggregate,
      run: candidate,
      action: 'final-reject',
      evidence: input.prove(candidate),
    })
    if (result.runCurrent) return candidate
  }
  return undefined
}
