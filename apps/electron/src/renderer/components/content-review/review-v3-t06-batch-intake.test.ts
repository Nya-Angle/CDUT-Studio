import { describe, expect, test } from 'bun:test'
import { buildBatchSummaryCsv, parseBatchManifest, previewBatchAssignment } from './review-v3-t06-batch-intake'

describe('T06 roster intake and case assignment', () => {
  test('parses Chinese CSV headers and quoted multiline cells without treating filenames as identity', () => {
    const data = parseBatchManifest('\uFEFF案卷ID,申报人,学号,材料文件\nc1,张三,1001,"证明1.pdf,证明2.pdf"\nc2,李四,1002,"第一页\n第二页"', 'roster.csv')
    expect(data.errors).toEqual([])
    expect(data.rows).toHaveLength(2)
    expect(data.rows[0]?.caseId).toBe('c1')
    expect(data.rows[0]?.files).toBe('证明1.pdf,证明2.pdf')
    expect(data.rows[1]?.files).toBe('第一页\n第二页')
  })

  test('unknown IDs, duplicate binding and name conflicts cannot silently become committed cases', () => {
    const rows = parseBatchManifest('案卷ID,申报人\nc1,张三\nc1,张三\nc2,李四\n,王五').rows
    const cases = [{ caseId: 'c1', applicant: '张三' }, { caseId: 'c2', applicant: '赵六' }, { caseId: 'c3', applicant: '王五' }]
    const first = previewBatchAssignment(rows, cases)
    expect(first.map((item) => item.status)).toEqual(['duplicate', 'duplicate', 'name-conflict', 'unassigned'])
    const repaired = previewBatchAssignment(rows, cases, { [rows[1]!.line]: 'c3', [rows[2]!.line]: 'c2' }, new Set([rows[3]!.line]))
    expect(repaired.map((item) => item.status)).toEqual(['ready', 'ready', 'ready', 'excluded'])
  })

  test('exports CSV values as data, not spreadsheet formulas', () => {
    const csv = buildBatchSummaryCsv([{
      caseId: 'c1', title: '=2+2', applicant: '张,三', status: 'failed', route: '技术异常',
      completed: 0, planned: 5, pending: 5, error: '坏文件',
    }])
    expect(csv).toContain('"\'=2+2"')
    expect(csv).toContain('"张,三"')
    expect(csv).toContain('"0","5","5"')
  })
})
