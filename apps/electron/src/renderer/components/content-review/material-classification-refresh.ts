/**
 * 材料自动分类完成事件的刷新协调（纯逻辑，不依赖 React/Electron）。
 *
 * 目的：多个分类完成事件合并成一次刷新；其他案卷的迟到通知直接忽略。
 * 只决定“何时刷新哪个案卷”，刷新内容与异步守卫由调用方保持。
 */
export const CLASSIFICATION_REFRESH_DELAY_MS = 400

export interface ClassificationRefreshCoalescerDeps {
  delayMs?: number
  setTimeoutFn?: (handler: () => void, ms: number) => unknown
  clearTimeoutFn?: (handle: unknown) => void
}

export interface ClassificationRefreshCoalescer {
  /** 收到事件：仅当案卷与当前一致时记录并安排一次合并刷新。 */
  notify(eventCaseId: string, currentCaseId: string | null): void
  /** 是否有待处理的刷新。 */
  pending(): boolean
  /** 撤销监听/切案时清空待处理刷新。 */
  dispose(): void
}

export function createClassificationRefreshCoalescer(
  run: (caseId: string) => void,
  deps: ClassificationRefreshCoalescerDeps = {},
): ClassificationRefreshCoalescer {
  const delayMs = deps.delayMs ?? CLASSIFICATION_REFRESH_DELAY_MS
  const schedule = deps.setTimeoutFn ?? ((handler, ms) => setTimeout(handler, ms))
  const cancel = deps.clearTimeoutFn ?? ((handle) => clearTimeout(handle as ReturnType<typeof setTimeout>))
  let pendingCaseId: string | null = null
  let timer: unknown = null

  const flush = (): void => {
    timer = null
    const caseId = pendingCaseId
    pendingCaseId = null
    if (caseId) run(caseId)
  }

  return {
    notify(eventCaseId, currentCaseId) {
      if (!currentCaseId || eventCaseId !== currentCaseId) return
      pendingCaseId = eventCaseId
      if (timer) return // 已安排刷新：合并到同一次
      timer = schedule(flush, delayMs)
    },
    pending() { return timer !== null },
    dispose() {
      if (timer) cancel(timer)
      timer = null
      pendingCaseId = null
    },
  }
}
