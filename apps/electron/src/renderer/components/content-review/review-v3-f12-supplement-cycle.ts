/**
 * F12 补件周期只读投影：合并重复的补正要素，不合并/改写原始补件事务。
 * 所有判定以 CaseAggregateV2 为准；此处不生成身份、Run 或业务决定。
 */
import type { CaseAggregateV2, DocumentVersion, SupplementRequest } from '@profer/shared'

export const F12_UNRESOLVED_STATUSES = new Set<SupplementRequest['status']>([
  'open', 'responded', 'insufficient',
])

export interface F12ChecklistItem {
  title: string
  requestIds: string[]
  /** 同一要素可能来自多条请求；只在所有来源关闭后才算结清。 */
  unresolvedRequestIds: string[]
}

export interface F12SupplementCycle {
  requests: SupplementRequest[]
  unresolved: SupplementRequest[]
  awaitingReply: SupplementRequest[]
  awaitingVerification: SupplementRequest[]
  checklist: F12ChecklistItem[]
  /** 请求全部关闭仅代表补件业务结清，绝不等于审查通过。 */
  readyForReview: boolean
  /** 请求全已关闭，但唯一权威案卷仍在等待补件，不得自作主张跳转。 */
  stageStillAwaitingSupplement: boolean
}

/** 将相同要素收敛为提交方的一张清单，仍保留每条请求的独立责任和核验结果。 */
export function buildF12SupplementCycle(aggregate: CaseAggregateV2): F12SupplementCycle {
  const requests = [...aggregate.supplements].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  const unresolved = requests.filter((request) => F12_UNRESOLVED_STATUSES.has(request.status))
  const byElement = new Map<string, F12ChecklistItem>()
  for (const request of requests) {
    for (const raw of request.requiredElements) {
      const title = raw.trim()
      if (!title) continue
      const key = title.toLocaleLowerCase()
      const item = byElement.get(key) ?? { title, requestIds: [], unresolvedRequestIds: [] }
      if (!item.requestIds.includes(request.id)) item.requestIds.push(request.id)
      if (F12_UNRESOLVED_STATUSES.has(request.status) && !item.unresolvedRequestIds.includes(request.id)) {
        item.unresolvedRequestIds.push(request.id)
      }
      byElement.set(key, item)
    }
  }
  const allClosed = requests.length > 0 && unresolved.length === 0
  return {
    requests, unresolved,
    awaitingReply: unresolved.filter((request) => request.status !== 'responded'),
    awaitingVerification: unresolved.filter((request) => request.status === 'responded'),
    checklist: [...byElement.values()],
    readyForReview: allClosed && ['reviewing', 'awaiting-review'].includes(aggregate.caseV2.stage)
      && requests.some((request) => request.status === 'satisfied'),
    stageStillAwaitingSupplement: allClosed && aggregate.caseV2.stage === 'awaiting-supplement',
  }
}

export interface F12DocumentCandidates {
  documents: DocumentVersion[]
  /** 老请求缺少基线快照时，禁止宣称其中任一材料是新增。 */
  verifiedAsAddedAfterRequest: boolean
}

/** 显示候选版本，不替代 Main 对提交方与 DocumentVersion 的校验。 */
export function getF12ReplyDocumentCandidates(
  request: SupplementRequest,
  documents: DocumentVersion[],
): F12DocumentCandidates {
  const active = documents.filter((document) => document.active !== false)
  if (!request.documentVersionIdsAtRequest) {
    return { documents: active, verifiedAsAddedAfterRequest: false }
  }
  const existing = new Set(request.documentVersionIdsAtRequest)
  return {
    documents: active.filter((document) => !existing.has(document.versionId)),
    verifiedAsAddedAfterRequest: true,
  }
}
