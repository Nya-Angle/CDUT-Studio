/** F14 工作台纯逻辑：限制大量案卷历史读取的并发，并保持可见范围操作的准确性。 */

export async function mapWithConcurrency<T, R>(
  items: readonly T[], concurrency: number, task: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let cursor = 0
  const worker = async (): Promise<void> => {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await task(items[index]!)
    }
  }
  const workerCount = Math.min(items.length, Math.max(1, Number.isFinite(concurrency) ? Math.floor(concurrency) || 1 : 1))
  await Promise.all(Array.from({ length: workerCount }, worker))
  return results
}

export function latestBatchRun<T extends { startedAt: string; completedAt?: string }>(history: readonly T[]): T | undefined {
  return history.reduce<T | undefined>((latest, run) =>
    !latest || (run.completedAt ?? run.startedAt) > (latest.completedAt ?? latest.startedAt) ? run : latest, undefined)
}

/** 全选只作用于当前可见的候选案卷，不丢失搜索范围外的选择。 */
export function selectVisibleBatchCases(
  selected: readonly string[], visible: readonly string[], checked: boolean,
): string[] {
  const result = new Set(selected)
  for (const caseId of visible) {
    if (checked) result.add(caseId)
    else result.delete(caseId)
  }
  return [...result]
}
