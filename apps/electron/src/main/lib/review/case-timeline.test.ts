import { describe, expect, test } from 'bun:test'
import type { CaseAggregateV2 } from '@profer/shared'
import { buildCaseTimeline, summarizeTimelineSources } from './case-timeline'

const aggregate = {
  receiptLog: [
    { at: '2026-10-01T10:00:00Z', type: 'ReviewLocalSubmit', summary: '提交案卷', revision: 2, actor: { actorSource: 'local', actorId: 'u1' } },
  ],
} as unknown as CaseAggregateV2

const runs = [{ id: 'run-1', status: 'completed', startedAt: '2026-10-01T11:00:00Z', initiatedBy: { actorSource: 'local', actorId: 'u1' } }]

describe('案卷时间线跨模块投影（RUN-32）', () => {
  test('纳入 T07 评分轮次、批次快照/outbox、离线回执与报告交接，并保留 Run 归属', () => {
    const entries = buildCaseTimeline(aggregate, runs, undefined, {
      t07RatingRounds: [{ id: 'round-2', at: '2026-10-01T12:00:00Z', status: 'frozen', detail: '批次 batch-1', runId: 'run-1', actor: { actorSource: 'local', actorId: 'judge-1' } }],
      batchSnapshots: [{ id: 'snap-1', at: '2026-10-01T13:00:00Z', status: 'frozen' }],
      batchOutbox: [{ id: 'push-1', at: '2026-10-01T14:00:00Z', status: 'acknowledged' }],
      offlineReceipts: [{ id: 'off-1', at: '2026-10-01T15:00:00Z', status: 'accepted' }],
      reportHandoffs: [{ id: 'handoff-1', at: '2026-10-01T16:00:00Z', status: 'exported', runId: 'run-1' }],
    })
    expect(entries.map((entry) => entry.source)).toContain('t07-rating')
    expect(entries.map((entry) => entry.source)).toContain('batch-outbox')
    expect(entries.map((entry) => entry.source)).toContain('t09-offline')
    expect(entries.map((entry) => entry.source)).toContain('report-handoff')
    const rating = entries.find((entry) => entry.source === 't07-rating')
    expect(rating?.runId).toBe('run-1')
    expect(rating?.operatorLabel).toBe('judge-1')
    // 倒序：报告交接（16:00）在最前
    expect(entries[0]?.source).toBe('report-handoff')
  })

  test('未提供的外部账本不被伪造，覆盖摘要明确缺口', () => {
    const entries = buildCaseTimeline(aggregate, runs)
    expect(entries.every((entry) => entry.source === 'receipt' || entry.source === 'run')).toBe(true)
    const coverage = summarizeTimelineSources()
    expect(coverage.find((item) => item.source === 't07-rating')?.provided).toBe(false)
    expect(coverage.find((item) => item.source === 'receipt')?.provided).toBe(true)
  })

  test('同一来源同一 id 只投影一次，避免重复事实', () => {
    const duplicate = { id: 'snap-1', at: '2026-10-01T13:00:00Z', status: 'frozen' }
    const entries = buildCaseTimeline(aggregate, runs, undefined, {
      batchSnapshots: [duplicate, { ...duplicate, status: 'reopened' }],
    })
    expect(entries.filter((entry) => entry.source === 'batch-snapshot')).toHaveLength(1)
  })
})
