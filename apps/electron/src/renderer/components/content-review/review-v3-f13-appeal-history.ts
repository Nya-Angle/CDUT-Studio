/** F13 公开申诉历史只读投影；不推断旧英文状态的法律含义。 */
import type { Appeal, BusinessDecision, CaseAggregateV2, CommandReceipt, DocumentVersion, WorkflowTask } from '@profer/shared'

export interface F13AppealHistoryEntry {
  appeal: Appeal
  original?: BusinessDecision
  amendment?: BusinessDecision
  reviewTask?: WorkflowTask
  reviewReceipt?: CommandReceipt
  withdrawalReceipt?: CommandReceipt
  evidence: Array<{ id: string; document?: DocumentVersion }>
  statusLabel: string
  outcomeLabel: string
  /** 缺关联/旧歧义数据必须显式提示，不猜测复核有效性。 */
  warnings: string[]
  originalSuperseded: boolean
}

const pendingLabels: Record<string, string> = {
  submitted: '申诉已提交', 'in-review': '等待独立复审',
}

export function buildF13AppealHistory(aggregate: CaseAggregateV2): F13AppealHistoryEntry[] {
  const decisions = new Map(aggregate.decisions.map((decision) => [decision.id, decision]))
  const tasks = new Map(aggregate.tasks.map((task) => [task.id, task]))
  const documents = new Map(aggregate.caseV2.documents.map((document) => [document.versionId, document]))
  const superseded = new Set(aggregate.decisions.flatMap((decision) =>
    decision.amendsDecisionId ? [decision.amendsDecisionId] : []))

  return [...aggregate.appeals].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id)).map((appeal) => {
    const original = decisions.get(appeal.againstDecisionId)
    const candidate = appeal.reviewDecisionId ? decisions.get(appeal.reviewDecisionId) : undefined
    const amendment = candidate?.amendsDecisionId === appeal.againstDecisionId ? candidate : undefined
    const reviewTask = appeal.reviewTaskId ? tasks.get(appeal.reviewTaskId) : undefined
    const reviewReceipt = (aggregate.receiptLog ?? []).findLast((receipt) =>
      receipt.type === 'ReviewLocalAppealV3' && receipt.summary.includes(`申诉 ${appeal.id}：`))
    const withdrawalReceipt = (aggregate.receiptLog ?? []).findLast((receipt) =>
      receipt.type === 'WithdrawLocalAppealV3' && receipt.summary.endsWith(`撤回申诉 ${appeal.id}，原业务决定保留`))
    const evidence = appeal.newEvidenceDocumentVersionIds.map((id) => ({ id, document: documents.get(id) }))
    const warnings: string[] = []
    if (!original) warnings.push('关联的原业务决定缺失')
    if (appeal.reviewTaskId && !reviewTask) warnings.push('关联的独立复审任务缺失')
    if (evidence.some((item) => !item.document)) warnings.push('部分申诉证据版本不存在')
    if (evidence.some((item) => item.document?.active === false)) warnings.push('部分证据已被后续材料版本取代')

    let outcomeLabel: string
    if (appeal.resolution === 'withdrawn' && appeal.status === 'withdrawn') {
      outcomeLabel = '申诉已撤回，原决定未因此更改'
      if (!withdrawalReceipt) warnings.push('旧申诉记录未单独存储撤回时间；可从业务命令回执核对')
    } else if (appeal.resolution === 'maintain-original' && appeal.status === 'upheld') {
      outcomeLabel = '独立复审维持原决定'
      if (!reviewReceipt) warnings.push('维持决定的复审人、理由与时间尚未在 Appeal 中独立留痕，需核对业务命令回执')
    } else if (appeal.resolution === 'amend-original' && appeal.status === 'overturned' && amendment) {
      outcomeLabel = '独立复审已追加更正决定'
    } else if (appeal.status === 'submitted' || appeal.status === 'in-review') {
      outcomeLabel = '尚无最终复审结论'
    } else {
      outcomeLabel = '复审结论尚需人工核对'
      warnings.push('历史状态缺少明确的复审结论或关联更正决定，不能仅凭 upheld/overturned 判断')
    }
    if (amendment && !superseded.has(original?.id ?? '')) {
      warnings.push('更正决定与原决定的失效关系不一致')
    }
    return {
      appeal,
      ...(original ? { original } : {}),
      ...(amendment ? { amendment } : {}),
      ...(reviewTask ? { reviewTask } : {}),
      ...(reviewReceipt ? { reviewReceipt } : {}),
      ...(withdrawalReceipt ? { withdrawalReceipt } : {}),
      evidence,
      statusLabel: pendingLabels[appeal.status] ?? (appeal.status === 'withdrawn' ? '已撤回' : '已处理'),
      outcomeLabel,
      warnings,
      originalSuperseded: superseded.has(appeal.againstDecisionId),
    }
  })
}
