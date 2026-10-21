import { describe, expect, test } from 'bun:test'
import { latestBatchRun, mapWithConcurrency, selectVisibleBatchCases } from './review-v3-f14-batch-worklist'
import { parseBatchManifest, previewBatchAssignment, buildBatchSummaryCsv } from './review-v3-t06-batch-intake'

describe('F14 百案名册与工作台队列', () => {
  test('100 案清单只绑定精确案卷 ID，重复、错名、缺 ID 留在待处理范围', () => {
    const ids = Array.from({ length: 100 }, (_, index) => `case-${index + 1}`)
    const roster = ['案卷ID,学号,申报人',
      ...ids.map((id, index) => `${id},S${index + 1},用户${index + 1}`),
      'case-1,S101,用户1',
      'case-2,S102,他人',
      ',,未登记',
    ].join('\n')
    const parsed = parseBatchManifest(roster, 'roster.csv')
    expect(parsed.errors).toEqual([])
    const assigned = previewBatchAssignment(parsed.rows, ids.map((caseId, index) => ({ caseId, applicant: `用户${index + 1}` })))
    expect(assigned).toHaveLength(103)
    expect(assigned.filter((row) => row.status === 'ready')).toHaveLength(98)
    expect(assigned.filter((row) => row.status === 'duplicate')).toHaveLength(4)
    expect(assigned.filter((row) => row.status === 'unassigned')).toHaveLength(1)
    // 错名不能借着重复记录绕过人工核对，排除重复行后仍需确认身份。
    const repaired = previewBatchAssignment(parsed.rows, ids.map((caseId, index) => ({ caseId, applicant: `用户${index + 1}` })), {},
      new Set([parsed.rows[100]!.line, parsed.rows[1]!.line]))
    expect(repaired.find((row) => row.row.line === parsed.rows[101]!.line)?.status).toBe('name-conflict')
    expect(repaired.filter((row) => row.status === 'ready')).toHaveLength(99)
  })

  test('100 案历史查询最多 6 个并发，顺序与失败边界确定', async () => {
    let active = 0
    let maximum = 0
    const result = await mapWithConcurrency(Array.from({ length: 100 }, (_, index) => index), 6, async (item) => {
      maximum = Math.max(maximum, ++active)
      await Promise.resolve()
      active--
      return item * 2
    })
    expect(maximum).toBe(6)
    expect(result).toEqual(Array.from({ length: 100 }, (_, index) => index * 2))
  })

  test('可见范围批量选择不改动筛选外案卷，选择总量与 CSV 名册一致', () => {
    const initial = ['case-1', 'case-50']
    const selected = selectVisibleBatchCases(initial, ['case-1', 'case-2', 'case-3'], true)
    expect(selected).toEqual(['case-1', 'case-50', 'case-2', 'case-3'])
    expect(selectVisibleBatchCases(selected, ['case-1', 'case-2'], false)).toEqual(['case-50', 'case-3'])

    const csv = buildBatchSummaryCsv(Array.from({ length: 100 }, (_, index) => ({
      caseId: `case-${index + 1}`, title: `项目${index + 1}`, applicant: `用户${index + 1}`,
      status: index % 2 ? 'done' : 'failed', route: index % 2 ? '待人工判断' : '技术异常',
      completed: index % 2 ? 3 : 0, planned: 3, pending: index % 2 ? 0 : 3, error: index % 2 ? '' : '坏文件',
    })))
    expect(csv.split('\r\n')).toHaveLength(101)
    expect(csv).toContain('"case-100"')
  })

  test('最新 Run 依业务结束时间选取，不依赖 Main 返回排序', () => {
    const runs = [
      { id: 'older', startedAt: '2026-10-21T00:00:00Z', completedAt: '2026-10-21T00:01:00Z' },
      { id: 'newest', startedAt: '2026-10-21T01:00:00Z' },
      { id: 'middle', startedAt: '2026-10-21T00:20:00Z', completedAt: '2026-10-21T00:21:00Z' },
    ]
    expect(latestBatchRun(runs)?.id).toBe('newest')
    expect(latestBatchRun([])).toBeUndefined()
  })
})
