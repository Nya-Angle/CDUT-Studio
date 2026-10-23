import type { ReviewCase } from '@profer/shared'

export interface ReviewInputChanges {
  applicationMaterialsChanged?: boolean
  domainPackChanged?: boolean
  subjectDocumentsChanged?: boolean
}

/**
 * 输入变化后清除依赖这些输入的 V1 派生产物。
 * 已保存运行不会删除；它仍可作历史查看，但 run-service 会按输入指纹标为过期。
 */
export function invalidateDerivedReviewInputs(reviewCase: ReviewCase, changes: ReviewInputChanges): ReviewCase {
  const itemsChanged = changes.applicationMaterialsChanged || changes.domainPackChanged || changes.subjectDocumentsChanged
  if (!itemsChanged && !changes.domainPackChanged) return reviewCase
  return {
    ...reviewCase,
    ...(itemsChanged ? { items: [] } : {}),
    ...(changes.domainPackChanged
      ? { rulePacks: reviewCase.rulePacks.map((pack) => ({ ...pack, outline: [], confirmed: false })) }
      : {}),
  }
}
