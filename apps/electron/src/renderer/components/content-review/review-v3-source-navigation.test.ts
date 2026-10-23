import { describe, expect, test } from 'bun:test'
import type { CaseAggregateV2, SourceRef } from '@profer/shared'
import { resolveT08Source } from './review-v3-t08-case-report'
import { reviewSourcePurpose, reviewSourceStatusLabel, uniqueReviewSourceRefs } from './review-v3-source-navigation'

const aggregate = {
  caseV2: {
    id: 'case-1',
    documents: [
      {
        documentId: 'rule', versionId: 'rule-v2', role: 'rule', fileName: '制度.pdf', parseRevision: 2,
        blocks: [{ blockId: 'page-1', text: '具体条款', kind: 'text', location: { kind: 'pdf-rect', page: 1, rect: { x: 0, y: 0, w: 200, h: 50 } } }],
      },
      {
        documentId: 'sheet', versionId: 'sheet-v1', role: 'evidence', fileName: '材料.xlsx', parseRevision: 1,
        blocks: [
          { blockId: 'cell-a1', text: '姓名', kind: 'table', location: { kind: 'sheet-cell', sheet: '汇总', row: 1, column: 'A' } },
          { blockId: 'cell-b1', text: '小明', kind: 'table', location: { kind: 'sheet-cell', sheet: '汇总', row: 1, column: 'B' } },
        ],
      },
    ],
  },
} as unknown as CaseAggregateV2

const sheetRef = (column: string, parseRevision = 1): SourceRef => ({
  caseId: 'case-1', documentVersionId: 'sheet-v1', parseRevision,
  location: { kind: 'sheet-cell', sheet: '汇总', row: 1, column },
})

describe('F10 来源逐处导航', () => {
  test('同一原件的不同单元格、不同解析版本仍是独立出处', () => {
    const refs = [sheetRef('A'), sheetRef('B'), sheetRef('A'), sheetRef('A', 2)]
    const result = uniqueReviewSourceRefs(refs)
    expect(result).toHaveLength(3)
    expect(result.map((ref) => ref.location)).toEqual([refs[0]!.location, refs[1]!.location, refs[3]!.location])
  })

  test('表格精确落点和 PDF 区域使用 V2 原件块定位', () => {
    expect(resolveT08Source(sheetRef('B'), aggregate)).toMatchObject({ state: 'located', blockId: 'cell-b1' })
    const ruleRef: SourceRef = { caseId: 'case-1', documentVersionId: 'rule-v2', parseRevision: 2, location: { kind: 'pdf-rect', page: 1, rect: { x: 12, y: 5, w: 30, h: 10 } } }
    expect(resolveT08Source(ruleRef, aggregate)).toMatchObject({ state: 'located', blockId: 'page-1' })
    expect(reviewSourcePurpose(ruleRef, aggregate)).toBe('rule')
    expect(reviewSourcePurpose(sheetRef('B'), aggregate)).toBe('evidence')
  })

  test('解析版本不一致或跨案不允许假装精确定位', () => {
    const wrongRevision = sheetRef('A', 2)
    const otherCase: SourceRef = { ...sheetRef('A'), caseId: 'other-case' }
    expect(resolveT08Source(wrongRevision, aggregate).state).toBe('parse-revision-mismatch')
    expect(reviewSourcePurpose(wrongRevision, aggregate)).toBeNull()
    expect(reviewSourcePurpose(otherCase, aggregate)).toBeNull()
    expect(reviewSourceStatusLabel('parse-revision-mismatch')).toContain('禁止')
  })

  test('没有匹配块时明确降级为文件级，不伪造 sheet 单元格', () => {
    expect(resolveT08Source(sheetRef('C'), aggregate).state).toBe('file-only')
    expect(reviewSourcePurpose(sheetRef('C'), aggregate)).toBe('evidence')
  })
})
