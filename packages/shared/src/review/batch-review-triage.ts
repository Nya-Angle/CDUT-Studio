/**
 * Batch triage is a read-only projection: it NEVER records a business decision.
 *
 * "auto-pass-candidate" and "auto-return-candidate" are advisory statuses.
 * Actual business actions must pass the current-run, role and decision-readiness
 * gates in the workspace business service.
 *
 * Keep the deterministic first-pass clustering conservative. No fuzzy similarity
 * is permitted to authorize a bulk decision.
 */
import type { BatchStateV2, CheckResult, ReviewRunV2, ReviewBatch } from '../types'

export type BatchTriageRoute =
  | 'pending'
  | 'awaiting-supplement'
  | 'technical-exception'
  | 'manual-review'
  | 'auto-return-candidate'
  | 'auto-pass-candidate'
  | 'already-decided'

export interface BatchTriageInput {
  caseId: string
  entryStatus: BatchStateV2['cases'][number]['status']
  /** The case index currently exposes stage as string; unknown values fail closed. */
  caseStage?: string
  run?: ReviewRunV2
  batch: Pick<ReviewBatch, 'templateId' | 'templateVersion' | 'policyVersionLock'>
}

export interface BatchTriageResult {
  caseId: string
  route: BatchTriageRoute
  explanation: string
  /** Advisory only; never an authorization to write a business decision. */
  requiresBusinessGate: boolean
}

const HARD_FAILURES = new Set<CheckResult['status']>(['execution-failed', 'not-executed'])
const UNCERTAIN = new Set<CheckResult['status']>(['awaiting-confirmation', 'non-compliant'])
const ISSUE_STATUSES = new Set<CheckResult['status']>([
  'non-compliant', 'awaiting-supplement', 'awaiting-confirmation', 'not-executed', 'execution-failed',
])

function hasMatchingPolicyLock(
  actual: ReviewRunV2['inputManifest']['policyVersions'],
  locked: ReviewBatch['policyVersionLock'],
): boolean {
  return actual.length === locked.length
    && locked.every((expected) => actual.some((item) =>
      item.policyVersionId === expected.policyVersionId && item.version === expected.version))
}

/**
 * One effective-run gate for both triage and issue grouping. Do not show findings
 * from stale/incomplete/invalid runs as current actionable batch issues.
 * Note: the caller must supply the CURRENT case's run; this function cannot
 * derive current input revision from the run alone.
 */
export function validateBatchRun(input: BatchTriageInput): { valid: true; run: ReviewRunV2 } | { valid: false; reason: string } {
  if (input.entryStatus !== 'done') return { valid: false, reason: '未完成当前批次的审核运行' }
  const run = input.run
  if (!run) return { valid: false, reason: '标记完成但找不到审核结果' }
  if (run.caseId !== input.caseId
    || run.templateId !== input.batch.templateId
    || run.templateVersion !== input.batch.templateVersion
    || run.inputManifest.templateVersion !== input.batch.templateVersion
    || !run.inputManifest.hash
    || !hasMatchingPolicyLock(run.inputManifest.policyVersions, input.batch.policyVersionLock)) {
    return { valid: false, reason: '审核结果与批次锁定的模板、政策或案卷不匹配，或输入哈希缺失' }
  }
  if (run.status !== 'completed') return { valid: false, reason: '审核没有完整结束' }
  if (run.coverage.plannedChecks <= 0
    || (run.inputManifest.effectiveRuleIds && run.inputManifest.effectiveRuleIds.length === 0)
    || run.coverage.effectiveVerdicts <= 0
    || run.coverage.completedChecks < run.coverage.plannedChecks
    || run.checks.length < run.coverage.plannedChecks) {
    return { valid: false, reason: '检查结果不足或没有有效检查，不能按无异常通过' }
  }
  if (run.coverage.documents.some((document) => document.status !== 'read')) {
    return { valid: false, reason: '仍有材料未完整读取；需核实材料覆盖范围' }
  }
  if (run.checks.some((check) => HARD_FAILURES.has(check.status))) {
    return { valid: false, reason: '存在未执行或执行失败的检查' }
  }
  return { valid: true, run }
}

/** Conservative, deterministic and side-effect free. */
export function triageBatchCase(input: BatchTriageInput): BatchTriageResult {
  const result = (route: BatchTriageRoute, explanation: string): BatchTriageResult => ({
    caseId: input.caseId,
    route,
    explanation,
    requiresBusinessGate: route === 'auto-pass-candidate' || route === 'auto-return-candidate',
  })

  if (input.caseStage === 'decided' || input.caseStage === 'archived') {
    return result('already-decided', '案卷已有正式终态；查看业务决定，不重复自动处理')
  }
  if (input.caseStage === 'awaiting-supplement') {
    return result('awaiting-supplement', '已进入补件流程，等待补件后新一轮审核')
  }
  if (input.caseStage && ![
    'draft', 'submitted', 'reviewing', 'awaiting-supplement', 'awaiting-review',
    'awaiting-rating', 'awaiting-final', 'decided', 'archived',
  ].includes(input.caseStage)) {
    return result('manual-review', '无法识别当前业务阶段，请先人工核实')
  }
  if (input.entryStatus === 'failed') return result('technical-exception', '批次执行失败，需诊断或重试')
  if (input.entryStatus === 'paused') return result('pending', '批次已暂停')
  if (input.entryStatus !== 'done') return result('pending', '未完成当前批次的审核运行')

  const validated = validateBatchRun(input)
  if (!validated.valid) return result('technical-exception', validated.reason)
  const run = validated.run
  if (input.caseStage === 'awaiting-review' || input.caseStage === 'awaiting-final' || input.caseStage === 'awaiting-rating') {
    return result('manual-review', '当前流程阶段要求人工认定或评分')
  }
  if (run.checks.some((check) => UNCERTAIN.has(check.status))) {
    return result('manual-review', '存在违规或待确认检查；需结合业务规则处理')
  }
  const pendingSupplement = run.checks.filter((check) => check.status === 'awaiting-supplement')
  if (pendingSupplement.length > 0) {
    if (pendingSupplement.every((check) => !!check.reason.trim())) {
      return result('auto-return-candidate', '仅发现补件类问题；仍需检查可补正性、补件要素和正式授权')
    }
    return result('manual-review', '补件问题缺少清晰原因')
  }
  if (run.coverage.pendingChecks > 0) return result('manual-review', '还有未解除的待处理检查')
  if (run.checks.some((check) => check.status !== 'compliant' && check.status !== 'not-applicable')) {
    return result('manual-review', '检查结果无法纳入自动处理条件')
  }
  return result('auto-pass-candidate', '当前检查无异常；正式通过还须校验事实、证据、事项认定及审批授权')
}

export interface BatchIssueOccurrence {
  caseId: string
  runId: string
  inputHash: string
  checkId: string
  ruleId: string
  status: CheckResult['status']
  reason: string
  sourceRefs: CheckResult['sourceRefs']
}

export interface BatchIssueGroup {
  key: string
  ruleId: string
  status: CheckResult['status']
  reason: string
  /** Distinct affected cases, not total check occurrences. */
  caseIds: string[]
  occurrences: BatchIssueOccurrence[]
}

function normalizedCause(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/gu, ' ').replace(/[。！!，,；;：:]$/u, '')
}

/**
 * Group only identical rule + status + conservatively-normalized cause.
 * Different reasons under the same rule NEVER silently share a bulk action.
 * Input should include only runs chosen for their corresponding batch.
 */
export function groupBatchIssues(inputs: BatchTriageInput[]): BatchIssueGroup[] {
  const groups = new Map<string, BatchIssueGroup>()
  for (const input of inputs) {
    const validated = validateBatchRun(input)
    if (!validated.valid) continue
    // Already decided, awaiting supplements, or unknown case stages must not
    // surface old checks as current human-actionable groups.
    const route = triageBatchCase(input).route
    if (route !== 'manual-review' && route !== 'auto-return-candidate') continue
    const run = validated.run

    for (const check of run.checks) {
      if (!ISSUE_STATUSES.has(check.status)) continue
      const reason = check.reason.trim() || '未提供具体原因'
      // JSON encoding avoids separator collisions in policy IDs and free text.
      const key = JSON.stringify([check.ruleId, check.status, normalizedCause(reason)])
      let group = groups.get(key)
      if (!group) {
        group = { key, ruleId: check.ruleId, status: check.status, reason, caseIds: [], occurrences: [] }
        groups.set(key, group)
      }
      if (!group.caseIds.includes(input.caseId)) group.caseIds.push(input.caseId)
      if (!group.occurrences.some((item) => item.caseId === input.caseId && item.checkId === check.checkId)) {
        group.occurrences.push({
          caseId: input.caseId,
          runId: run.id,
          inputHash: run.inputManifest.hash,
          checkId: check.checkId,
          ruleId: check.ruleId,
          status: check.status,
          reason,
          sourceRefs: check.sourceRefs,
        })
      }
    }
  }
  return [...groups.values()].sort((a, b) =>
    b.caseIds.length - a.caseIds.length || a.ruleId.localeCompare(b.ruleId) || a.key.localeCompare(b.key))
}


/** Read-only batch handling preview. Its case selection never creates decisions. */
export interface BatchIssueActionDraft {
  groupKey: string
  ruleId: string
  /** No auto-reject/auto-pass is ever prepared from a group. */
  action: 'supplement-draft' | 'human-review-draft'
  suggestedReason: string
  cases: Array<{
    caseId: string
    runId: string
    inputHash: string
    findingKeys: string[]
    eligible: boolean
    note: string
  }>
  eligibleCount: number
}

/**
 * Re-derive membership from effective runs. A grouping key is NOT authority to
 * change all cases: each draft row carries its own eligibility and run identity.
 */
export function prepareBatchIssueActionDraft(
  inputs: BatchTriageInput[],
  groupKey: string,
  selectedCaseIds?: string[],
): BatchIssueActionDraft | null {
  const group = groupBatchIssues(inputs).find((candidate) => candidate.key === groupKey)
  if (!group) return null
  const selected = selectedCaseIds ? new Set(selectedCaseIds) : null
  const action = group.status === 'awaiting-supplement' ? 'supplement-draft' : 'human-review-draft'
  const cases = group.caseIds.filter((id) => !selected || selected.has(id)).map((caseId) => {
    const input = inputs.find((item) => item.caseId === caseId)!
    const triage = triageBatchCase(input)
    const related = group.occurrences.filter((item) => item.caseId === caseId)
    const eligible = action === 'supplement-draft'
      ? triage.route === 'auto-return-candidate'
      : triage.route === 'manual-review'
    return {
      caseId,
      runId: related[0]!.runId,
      inputHash: related[0]!.inputHash,
      findingKeys: [...new Set(related.map((item) => item.checkId))],
      eligible,
      note: eligible ? '仅供人工核对；正式操作前逐案复核当前证据、补件要素及权限'
        : '本案存在其他阻断因素，不能套用本问题组的建议动作',
    }
  })
  return {
    groupKey,
    ruleId: group.ruleId,
    action,
    suggestedReason: group.reason,
    cases,
    eligibleCount: cases.filter((item) => item.eligible).length,
  }
}


/** Explicit local-human batch treatment; these are not autonomous AI decisions. */
export type BatchGroupAction =
  | 'confirm-issue' | 'false-positive' | 'human-confirmed-compliant' | 'escalate'
  | 'request-supplement' | 'final-return' | 'final-pass'

export interface BatchGroupActionRequest {
  batchId: string
  groupKey: string
  caseIds: string[]
  action: BatchGroupAction
  reason: string
  requiredElements?: string[]
}

export interface BatchGroupPreviewRow {
  caseId: string
  title: string
  eligible: boolean
  reason: string
  revision: number | null
  runId: string | null
  inputHash: string | null
  findingKey: string | null
  sourceCount: number
}

export interface BatchGroupPreview {
  previewHash: string
  batchId: string
  action: BatchGroupAction
  groupKey: string
  eligibleCount: number
  rows: BatchGroupPreviewRow[]
  /** Preview has no effect on any case or business decision. */
  advisoryOnly: true
}

export interface BatchGroupApplyRequest extends BatchGroupActionRequest {
  previewHash: string
  operationId: string
  /** UI requires a fresh explicit confirmation for each operation. */
  confirmed: true
}

export interface BatchGroupApplyResult {
  batchId: string
  operationId: string
  action: BatchGroupAction
  previewHash: string
  results: Array<{ caseId: string; status: 'applied' | 'excluded' | 'conflict' | 'failed'; message: string; receiptId?: string }>
  applied: number
  excluded: number
  conflicts: number
  failed: number
}
