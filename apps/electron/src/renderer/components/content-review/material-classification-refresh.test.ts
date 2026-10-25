/**
 * 自动分类完成事件刷新协调的最小回归：
 * 其他案卷的迟到通知被忽略；同一案卷多个事件合并为一次刷新；撤销后不再刷新。
 */
import { describe, expect, test } from 'bun:test'
import { CLASSIFICATION_REFRESH_DELAY_MS, createClassificationRefreshCoalescer } from './material-classification-refresh'

function makeHarness() {
  let handler: (() => void) | null = null
  const scheduled: number[] = []
  const refreshes: string[] = []
  const coalescer = createClassificationRefreshCoalescer((caseId) => refreshes.push(caseId), {
    delayMs: 50,
    setTimeoutFn: (fn) => { handler = fn; scheduled.push(1); return scheduled.length },
    clearTimeoutFn: (handle) => { if (handle === scheduled.length) handler = null },
  })
  return { coalescer, refreshes, scheduled, flush: () => handler?.() }
}

describe('分类完成刷新协调', () => {
  test('只接受当前案卷事件，迟到旧案通知被忽略', () => {
    const { coalescer, scheduled, refreshes, flush } = makeHarness()
    coalescer.notify('case-old', 'case-current')
    expect(scheduled).toHaveLength(0)
    coalescer.notify('case-current', null)
    expect(scheduled).toHaveLength(0)
    coalescer.notify('case-current', 'case-current')
    expect(scheduled).toHaveLength(1)
    flush()
    expect(refreshes).toEqual(['case-current'])
  })

  test('同一案卷多个事件合并成一次刷新', () => {
    const { coalescer, scheduled, refreshes, flush } = makeHarness()
    coalescer.notify('case-a', 'case-a')
    coalescer.notify('case-a', 'case-a')
    coalescer.notify('case-a', 'case-a')
    expect(scheduled).toHaveLength(1)
    expect(coalescer.pending()).toBe(true)
    flush()
    expect(refreshes).toEqual(['case-a'])
    expect(coalescer.pending()).toBe(false)
  })

  test('撤销后清空待处理，不再触发刷新', () => {
    const { coalescer, refreshes, flush } = makeHarness()
    coalescer.notify('case-a', 'case-a')
    coalescer.dispose()
    expect(coalescer.pending()).toBe(false)
    flush()
    expect(refreshes).toEqual([])
  })

  test('默认合并窗口为短延迟', () => {
    expect(CLASSIFICATION_REFRESH_DELAY_MS).toBe(400)
  })
})
