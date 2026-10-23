/** 审核动作仅调用 Main 业务入口；页面轮询负责显示，不持有 Pi 执行生命周期。 */
import * as React from 'react'
import { useAtomValue, useStore } from 'jotai'
import type { ReviewRunV2 } from '@profer/shared'
import { reviewErrorAtom, reviewExecutionByCaseAtom, selectedCaseIdAtom } from '@/atoms/review-atoms'
import { createReviewActionsController, type ReviewRunMode } from './review-actions-controller'

export type ReviewActions = ReturnType<typeof createReviewActionsController>
export type { CreateCaseInput } from './review-actions-controller'
export { REVIEW_DOCUMENT_ROLE_LABELS } from './review-actions-controller'

export function useReviewActions() {
  const store = useStore()
  const caseId = useAtomValue(selectedCaseIdAtom)
  const startPiReview = React.useCallback(async (id: string, mode: ReviewRunMode): Promise<ReviewRunV2> => {
    const receipt = await window.reviewAPI.startBackgroundPiReviewV2({ caseId: id, mode })
    if (!receipt.runId) throw new Error('审核未取得有效运行记录')
    const run = await window.reviewAPI.getRunV2(id, receipt.runId)
    if (!run) throw new Error('审核记录不存在，请刷新案卷')
    return run
  }, [])
  const actions = React.useMemo(() => createReviewActionsController(store, window.reviewAPI, startPiReview), [store, startPiReview])

  React.useEffect(() => {
    if (!caseId) return
    let disposed = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const refresh = async () => {
      try {
        await actions.refreshBackgroundReview(caseId)
      } catch (error) {
        if (!disposed && store.get(selectedCaseIdAtom) === caseId) {
          store.set(reviewErrorAtom, `读取审核状态失败：${error instanceof Error ? error.message : String(error)}`)
        }
      }
      if (disposed) return
      const status = store.get(reviewExecutionByCaseAtom)[caseId]?.status
      // 空闲页同样允许发现另一窗口的启动；关闭页面只结束显示轮询。
      timer = setTimeout(refresh, status === 'running' || status === 'preparing' ? 1500 : 5000)
    }
    void refresh()
    return () => {
      disposed = true
      if (timer) clearTimeout(timer)
      actions.invalidateRefresh(caseId)
    }
  }, [actions, caseId, store])
  return actions
}
