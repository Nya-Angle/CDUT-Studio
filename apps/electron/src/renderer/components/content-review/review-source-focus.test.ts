import { describe, expect, test } from 'bun:test'
import type { ReviewDocumentBlock, SourceDocument, SourceRef } from '@profer/shared'
import { sourceRefTargetsBlock } from './review-source-focus'

const blocks: ReviewDocumentBlock[] = [
  { id: 'p0', kind: 'paragraph', text: '第一段申报内容', page: 1 },
  { id: 'p1', kind: 'paragraph', text: '第二段证书内容', page: 2, table: { row: 4, column: 2, sheet: '证明表' } },
]
const document: SourceDocument = { id: 'doc-app', fileName: '申请.txt', role: 'application', mimeType: 'text/plain', sizeBytes: 1, parseStatus: 'parsed', blocks, origin: 'upload', importedAt: '' }
const ref = (location: SourceRef['location']): SourceRef => ({ caseId: 'c1', documentVersionId: 'doc-app-v1', parseRevision: 1, location })

describe('V2 SourceRef 三栏定位映射', () => {
  test('段落、表格单元格和页坐标定位到对应的已解析块', () => {
    expect(sourceRefTargetsBlock(ref({ kind: 'paragraph', index: 1 }), document, blocks[1]!)).toBeTrue()
    expect(sourceRefTargetsBlock(ref({ kind: 'sheet-cell', sheet: '证明表', row: 4, column: 'B' }), document, blocks[1]!)).toBeTrue()
    expect(sourceRefTargetsBlock(ref({ kind: 'pdf-rect', page: 2, rect: { x: 0, y: 0, w: 1, h: 1 } }), document, blocks[1]!)).toBeTrue()
  })

  test('文件级引用只定位到文档首块，避免所有原文同时跳动', () => {
    expect(sourceRefTargetsBlock(ref({ kind: 'file' }), document, blocks[0]!)).toBeTrue()
    expect(sourceRefTargetsBlock(ref({ kind: 'file' }), document, blocks[1]!)).toBeFalse()
  })
})
