import type { CaseAggregateV2, SourceRef } from '@profer/shared'
import { resolveT08Source } from './review-v3-t08-case-report'

export type ReviewSourcePurpose = 'rule' | 'application' | 'evidence'

/** 来源去重必须包括解析版本和坐标；同文件的不同出处不能折叠成一个按钮。 */
export function uniqueReviewSourceRefs(refs: readonly SourceRef[]): SourceRef[] {
  const seen = new Set<string>()
  return refs.filter((ref) => {
    const key = JSON.stringify([ref.caseId, ref.documentVersionId, ref.parseRevision, ref.location])
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/** 只用精确的 V2 DocumentVersion 判定目标栏，不从文件名或旧 V1 ID 猜测。 */
export function reviewSourcePurpose(ref: SourceRef, aggregate: CaseAggregateV2): ReviewSourcePurpose | null {
  const resolved = resolveT08Source(ref, aggregate)
  if (!resolved.document || resolved.state === 'foreign-case' || resolved.state === 'parse-revision-mismatch') return null
  return resolved.document.role === 'rule' ? 'rule'
    : resolved.document.role === 'application' ? 'application' : 'evidence'
}

export function reviewSourceStatusLabel(state: ReturnType<typeof resolveT08Source>['state']): string {
  switch (state) {
    case 'located': return '已定位到解析块'
    case 'file-only': return '仅能定位到文件，需人工核对原件'
    case 'version-unavailable': return '原件版本已不可用'
    case 'parse-revision-mismatch': return '解析版本不匹配，禁止按旧坐标定位'
    case 'foreign-case': return '来源不属于当前案卷'
  }
}
