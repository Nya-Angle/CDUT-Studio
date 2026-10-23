import { afterEach, describe, expect, test } from 'bun:test'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { DocumentVersion } from '@profer/shared'
import { DocumentCapabilityLibrary } from './document-capability-library'

const temporaryRoots: string[] = []

function temporaryRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'review-document-capability-'))
  temporaryRoots.push(root)
  return root
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true })
})

function document(blocks: DocumentVersion['blocks']): DocumentVersion {
  return {
    documentId: 'doc-1', versionId: 'doc-1-v1', contentHash: 'hash', role: 'evidence', fileName: 'proof.pdf',
    mimeType: 'application/pdf', sizeBytes: 10, assetPath: 'source-docs/doc-1-v1/proof.pdf', parseRevision: 1,
    parseStatus: 'parsed', usage: 'registered', blocks,
  }
}

describe('DocumentCapabilityLibrary', () => {
  test('按工作表读取原文，并且只有文本块与图像块都核对后才标记材料已读', () => {
    const root = temporaryRoot()
    const source = document([
      { blockId: 'cell-a1', text: '姓名', kind: 'text', location: { kind: 'sheet-cell', sheet: '成员', row: 1, column: 'A' } },
      { blockId: 'cell-b1', text: '测试同学', kind: 'text', location: { kind: 'sheet-cell', sheet: '成员', row: 1, column: 'B' } },
      { blockId: 'page-1', text: '', kind: 'image', imageAlt: '扫描证书', imageAssetPath: 'source-docs/doc-1-v1/page.png', location: { kind: 'pdf-rect', page: 1, rect: { x: 0, y: 0, w: 1, h: 1 } } },
    ])
    const library = new DocumentCapabilityLibrary({ caseId: 'case-1', caseRoot: root, documents: [source] })

    const inventory = library.listDocuments()[0]!
    expect(inventory).not.toHaveProperty('imageAssetPath')
    expect(inventory).toMatchObject({ fileName: 'proof.pdf', imageBlocks: [{ blockId: 'page-1' }] })
    expect(inventory).toMatchObject({
      imageBlockCount: 1,
      imageAssetsMissingCount: 0,
      imagesAwaitingInspection: 1,
    })
    const cells = library.read({ documentVersionId: source.versionId, sheetName: '成员', fromRow: 1, toRow: 1, limit: 10 })
    expect(cells.blocks.map((block) => block.blockId)).toEqual(['cell-a1', 'cell-b1'])
    expect(cells.fullyRead).toBeFalse()
    expect(source.usage).toBe('partially-read')
    expect(library.isFullyRead(source.versionId)).toBe(false)
    library.markImageRead(source.versionId, 'page-1')
    expect(library.listDocuments()[0]?.imagesAwaitingInspection).toBe(0)
    expect(source.usage).toBe('read')
    expect(library.isFullyRead(source.versionId)).toBe(true)
  })

  test('Office 图形只有版面块、没有图像资产时，材料目录明确统计缺失及未核验图片', () => {
    const source = document([
      { blockId: 'slide-2-picture', text: '', kind: 'image', location: { kind: 'paragraph', index: 4 } },
      { blockId: 'slide-2-title', text: '技术项目', kind: 'text', location: { kind: 'paragraph', index: 5 } },
    ])
    source.fileName = '申请介绍.pptx'
    source.parseStatus = 'partial'
    source.parseError = '图片未提取'
    const inventory = new DocumentCapabilityLibrary({ caseId: 'case-1', caseRoot: '/tmp/case', documents: [source] }).listDocuments()[0]
    expect(inventory).toMatchObject({
      parseStatus: 'partial',
      imageBlockCount: 1,
      imageAssetsMissingCount: 1,
      imagesAwaitingInspection: 1,
      parseError: '图片未提取',
    })
    const library = new DocumentCapabilityLibrary({ caseId: 'case-1', caseRoot: '/tmp/case', documents: [source] })
    expect(() => library.markImageRead(source.versionId, 'slide-2-picture')).toThrow('尚无可核验原件')
    expect(library.isFullyRead(source.versionId)).toBeFalse()
  })

  test('图像只按已登记 blockId 读取，路径受案卷目录约束并校验真实格式', () => {
    const root = temporaryRoot()
    const imagePath = join(root, 'source-docs', 'doc-1-v1', 'page.png')
    mkdirSync(join(root, 'source-docs', 'doc-1-v1'), { recursive: true })
    writeFileSync(imagePath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jVZQAAAAASUVORK5CYII=', 'base64'))
    const source = document([{ blockId: 'page-1', text: '', kind: 'image', imageAssetPath: 'source-docs/doc-1-v1/page.png', location: { kind: 'pdf-rect', page: 1, rect: { x: 0, y: 0, w: 1, h: 1 } } }])
    const library = new DocumentCapabilityLibrary({ caseId: 'case-1', caseRoot: root, documents: [source] })

    expect(library.loadImage(source.versionId, 'page-1').dataUrl).toStartWith('data:image/png;base64,')
    expect(() => library.loadImage(source.versionId, 'missing')).toThrow('图像块不存在')
    source.blocks[0]!.imageAssetPath = '../outside.png'
    expect(() => library.loadImage(source.versionId, 'page-1')).toThrow('不在当前案卷目录中')
  })

  test('独立 PNG 完成视觉核对后记为已读，不因没有文本层而永久停在部分读取', () => {
    const source = document([{ blockId: 'image-1', text: '', kind: 'image', imageAssetPath: 'source-docs/proof.png' }])
    source.fileName = '证明.png'
    source.mimeType = 'image/png'
    source.parseStatus = 'partial'
    const library = new DocumentCapabilityLibrary({ caseId: 'case-1', caseRoot: '/tmp/case', documents: [source] })

    expect(library.isFullyRead(source.versionId)).toBeFalse()
    library.markImageRead(source.versionId, 'image-1')

    expect(source.usage).toBe('read')
    expect(library.isFullyRead(source.versionId)).toBeTrue()
  })

  test('只有当前 Agent 会话读取过全部块才算完整读取', () => {
    const source = document([
      { blockId: 'p1', text: '政策第一段', kind: 'text' },
      { blockId: 'p2', text: '政策第二段', kind: 'text' },
    ])
    source.role = 'rule'
    const library = new DocumentCapabilityLibrary({ caseId: 'case-1', caseRoot: '/tmp/case', documents: [source] })

    expect(library.isFullyRead(source.versionId)).toBe(false)
    library.read({ documentVersionId: source.versionId, blockIds: ['p1'] })
    expect(library.isFullyRead(source.versionId)).toBe(false)
    library.read({ documentVersionId: source.versionId, offset: 1 })
    expect(library.isFullyRead(source.versionId)).toBe(true)
  })

  test('解析失败的历史占位块不进入材料目录，不可读取或标记为完整读取', () => {
    const source = document([{ blockId: 'placeholder', text: '', kind: 'text' }])
    source.parseStatus = 'failed'
    source.parseError = 'PDF 解析失败'
    const library = new DocumentCapabilityLibrary({ caseId: 'case-1', caseRoot: '/tmp/case', documents: [source] })

    expect(library.listDocuments()[0]).toMatchObject({ blockCount: 0, textBlockCount: 0, imageBlocks: [], parseError: 'PDF 解析失败' })
    expect(library.read({ documentVersionId: source.versionId })).toMatchObject({
      parseStatus: 'failed',
      parseError: 'PDF 解析失败',
      blocks: [],
      totalBlocks: 0,
      fullyRead: false,
    })
    expect(library.isFullyRead(source.versionId)).toBeFalse()
    expect(source.usage).toBe('registered')
  })

  test('长文本块按字符分页读取，全部页连续读取后才标记为已读', () => {
    const text = '甲'.repeat(20_500)
    const source = document([{ blockId: 'long-policy', text, kind: 'text' }])
    const library = new DocumentCapabilityLibrary({ caseId: 'case-1', caseRoot: '/tmp/case', documents: [source] })

    const firstPage = library.read({ documentVersionId: source.versionId, blockIds: ['long-policy'] })
    expect(firstPage.blocks[0]).toMatchObject({ textOffset: 0, nextTextOffset: 12_000, truncated: true })
    expect(firstPage.fullyRead).toBeFalse()
    expect(library.isFullyRead(source.versionId)).toBe(false)

    const secondPage = library.read({ documentVersionId: source.versionId, blockIds: ['long-policy'], textOffset: firstPage.nextTextOffset! })
    expect(secondPage.blocks[0]).toMatchObject({ textOffset: 12_000, truncated: false })
    expect(secondPage.blocks[0]!.text).toHaveLength(8_500)
    expect(secondPage.fullyRead).toBeTrue()
    expect(library.isFullyRead(source.versionId)).toBe(true)
    expect(() => library.read({ documentVersionId: source.versionId, blockIds: ['long-policy'], textOffset: text.length + 1 })).toThrow('超出文本块长度')
  })
})
