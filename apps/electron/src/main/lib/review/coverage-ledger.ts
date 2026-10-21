/**
 * 覆盖账本（M2，设计 03 §6 材料账本 + 检查账本；A08/K06）
 *
 * - 材料账本：每份文档版本都有 read/partially-read/unread 状态与原因；"未识别"不从分母消失
 * - 检查账本：每个计划检查（规则×目标）都有 CheckResult；缺失记 not-executed
 * - "全部符合"结论仅当：无未读材料 且 计划检查全部执行 且 无 awaiting
 */

import type { CheckResult, DocumentVersion, RuleSpec } from '@profer/shared'

export interface DocumentLedgerEntry {
  documentVersionId: string
  fileName: string
  status: DocumentVersion['usage']
  reason?: string
}

/** 材料账本：解析失败的旧材料即使残留 usage=read，也不能当作读过原件。 */
export function buildDocumentLedger(documents: DocumentVersion[]): DocumentLedgerEntry[] {
  return documents.map((doc) => {
    const parseFailed = doc.parseStatus === 'failed'
    if (doc.manualReadReceipt) {
      return {
        documentVersionId: doc.versionId,
        fileName: doc.fileName,
        status: 'read',
        reason: `审核员已核对原件：${doc.manualReadReceipt.reason}`,
      }
    }
    return {
      documentVersionId: doc.versionId,
      fileName: doc.fileName,
      status: parseFailed ? 'unread' : doc.usage,
      reason: parseFailed
        ? `自动解析失败；空占位块不代表读过原件。${doc.parseError ? `解析原因：${doc.parseError}` : '请重新解析或打开原件核验。'}`
        : doc.unusedReason,
    }
  })
}

export interface CheckLedgerEntry {
  ruleId: string
  targetKey: string
  status: CheckResult['status'] | 'not-executed'
  reason?: string
}

const CHECK_STATUSES = new Set<CheckResult['status']>([
  'compliant', 'non-compliant', 'not-applicable', 'awaiting-confirmation',
  'awaiting-supplement', 'not-executed', 'execution-failed',
])

interface CheckLedgerReconciliation {
  entries: CheckLedgerEntry[]
  /** 未被计划唯一消费的结果必须单独报告，不能以零问题掩盖错案/重复检查。 */
  unexpectedResults: number
}

function reconcileCheckLedger(
  plannedRules: RuleSpec[], subjectIds: string[], results: CheckResult[],
  groupValues?: Record<string, string[]>, sectionSubjectIds?: Record<string, string[]>,
): CheckLedgerReconciliation {
  const entries: CheckLedgerEntry[] = []
  const matched = new Set<number>()
  const resultKeys = new Map<string, number[]>()
  const checkIdCounts = new Map<string, number>()
  const ruleIdCounts = new Map<string, number>()
  for (const rule of plannedRules) ruleIdCounts.set(rule.id, (ruleIdCounts.get(rule.id) ?? 0) + 1)

  const add = (key: string, index: number) =>
    resultKeys.set(key, [...(resultKeys.get(key) ?? []), index])
  for (const [index, result] of results.entries()) {
    if (result.checkId?.trim()) {
      checkIdCounts.set(result.checkId, (checkIdCounts.get(result.checkId) ?? 0) + 1)
    }
    const target = result.target
    if (!result.ruleId || !target || !Array.isArray(target.subjectIds)) continue
    const ids = target.subjectIds
    if (target.scope === 'subject' && ids.length === 1 && ids[0]) {
      add(`${result.ruleId}::subject::${ids[0]}`, index)
    } else if (target.scope === 'case') {
      add(`${result.ruleId}::case`, index)
    } else if (target.scope === 'group') {
      if (target.groupKey) add(`${result.ruleId}::group-key::${target.groupKey}`, index)
      else add(`${result.ruleId}::group::${[...ids].sort().join(',')}`, index)
    }
  }

  const record = (ruleId: string, targetKey: string, keys: string[], missingReason: string) => {
    const candidates = [...new Set(keys.flatMap(key => resultKeys.get(key) ?? []))]
    const hit = candidates.length === 1 ? results[candidates[0]!] : undefined
    if (ruleIdCounts.get(ruleId) !== 1) {
      entries.push({ ruleId, targetKey, status: 'not-executed', reason: '同名规则来自多个版本，缺少可核实的唯一检查身份' })
    } else if (candidates.length !== 1) {
      entries.push({ ruleId, targetKey, status: 'not-executed',
        reason: candidates.length ? '同一计划目标收到多个结果，不能任意选一个' : missingReason })
    } else if (!hit?.checkId?.trim() || checkIdCounts.get(hit.checkId) !== 1 ||
      !CHECK_STATUSES.has(hit.status) ||
      (hit.status === 'not-applicable' && !hit.reason?.trim())) {
      entries.push({ ruleId, targetKey, status: 'not-executed', reason: '检查身份、状态或不适用理由无效，不能计为已覆盖' })
    } else {
      matched.add(candidates[0]!)
      entries.push({ ruleId, targetKey, status: hit.status, ...(hit.reason ? { reason: hit.reason } : {}) })
    }
  }

  for (const rule of plannedRules) {
    const ruleSubjects = rule.sectionId ? sectionSubjectIds?.[rule.sectionId] ?? [] : subjectIds
    if (rule.targetScope === 'subject') {
      if (!ruleSubjects.length) {
        entries.push({ ruleId: rule.id, targetKey: 'subject:unknown', status: 'not-executed', reason: '规则作用域没有可核实的主体' })
      }
      for (const subjectId of ruleSubjects) {
        record(rule.id, subjectId, [`${rule.id}::subject::${subjectId}`], '计划主体检查未产生结果记录')
      }
    } else if (rule.targetScope === 'group') {
      const groups = groupValues?.[rule.id] ?? (rule.groupBy?.length ? [] : ['group'])
      if (!groups.length) {
        entries.push({ ruleId: rule.id, targetKey: 'group', status: 'not-executed', reason: '组规则未提供组值，无法展开' })
      }
      for (const group of groups) {
        const aggregateKey = `${rule.id}::group::${[...ruleSubjects].sort().join(',')}`
        const keys = group === 'group' && !rule.groupBy?.length
          ? [aggregateKey, `${rule.id}::group-key::${group}`]
          : [`${rule.id}::group-key::${group}`, `${rule.id}::group::${group}`]
        record(rule.id, group, keys, '组内计划检查未产生结果记录')
      }
    } else {
      record(rule.id, rule.targetScope, [`${rule.id}::case`], '案卷级计划检查未产生结果记录')
    }
  }
  return { entries, unexpectedResults: results.length - matched.size }
}

/**
 * 检查账本：以「计划检查」为分母核对执行结果。
 * 计划 = 规则 × 其目标分组键的笛卡尔：subject 规则按主体展开；group 规则按组值逐组展开
 * （G12/误判 5：组规则不再折叠成一个聚合 key——每组一条账目，缺组即 not-executed）。
 */
export function buildCheckLedger(
  plannedRules: RuleSpec[],
  subjectIds: string[],
  results: CheckResult[],
  groupValues?: Record<string, string[]>,
  sectionSubjectIds?: Record<string, string[]>,
): CheckLedgerEntry[] {
  return reconcileCheckLedger(plannedRules, subjectIds, results, groupValues, sectionSubjectIds).entries
}

export interface CoverageSummary {
  documents: Array<{ documentVersionId: string; status: DocumentVersion['usage']; reason?: string }>
  plannedChecks: number
  completedChecks: number
  effectiveVerdicts: number
  pendingChecks: number
  /** "全部符合"是否成立（未读材料/未执行/待确认任一存在即不成立） */
  allClearVerdictAllowed: boolean
  blockers: string[]
}

/** 组合双账本 → ReviewRunV2.coverage + 全部符合判定（A08） */
export function combineCoverage(
  documents: DocumentVersion[],
  plannedRules: RuleSpec[],
  subjectIds: string[],
  results: CheckResult[],
  groupValues?: Record<string, string[]>,
  sectionSubjectIds?: Record<string, string[]>,
): CoverageSummary {
  const documentLedger = buildDocumentLedger(documents)
  const reconciliation = reconcileCheckLedger(plannedRules, subjectIds, results, groupValues, sectionSubjectIds)
  const checkLedger = reconciliation.entries
  const unread = documentLedger.filter((entry) => entry.status !== 'read')
  const notExecuted = checkLedger.filter((entry) => entry.status === 'not-executed' || entry.status === 'execution-failed')
  const awaiting = checkLedger.filter((entry) => entry.status === 'awaiting-confirmation' || entry.status === 'awaiting-supplement')
  const violations = checkLedger.filter((entry) => entry.status === 'non-compliant')
  const blockers: string[] = []
  if (checkLedger.length === 0) blockers.push('没有有效检查计划，不能宣称全部符合')
  else if (checkLedger.every((entry) => entry.status === 'not-applicable')) blockers.push('本次没有适用检查，不能宣称全部符合')
  for (const entry of unread) blockers.push(`材料「${entry.fileName}」未完整读取${entry.reason ? `（${entry.reason}）` : ''}`)
  if (notExecuted.length > 0) blockers.push(`${notExecuted.length} 项计划检查未执行`)
  if (awaiting.length > 0) blockers.push(`${awaiting.length} 项检查待确认/待补件`)
  if (violations.length > 0) blockers.push(`${violations.length} 项检查不符合`)
  if (reconciliation.unexpectedResults > 0) {
    blockers.push(`${reconciliation.unexpectedResults} 项检查结果无法与计划唯一对应（含多余、重复或无效结果）`)
  }
  return {
    documents: documentLedger,
    plannedChecks: checkLedger.length,
    completedChecks: checkLedger.filter((entry) => entry.status !== 'not-executed' && entry.status !== 'execution-failed').length,
    effectiveVerdicts: checkLedger.filter((entry) => entry.status === 'compliant' || entry.status === 'non-compliant').length,
    pendingChecks: awaiting.length + notExecuted.length,
    allClearVerdictAllowed: blockers.length === 0,
    blockers,
  }
}
