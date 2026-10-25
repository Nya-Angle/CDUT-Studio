import { describe, expect, test } from 'bun:test'
import type { DocumentVersion } from '@profer/shared'
import { classifyRecognizedPages, selectedImageBlocks } from './material-classification-ocr'

const document = (fileName: string, blocks: DocumentVersion['blocks'] = []): DocumentVersion => ({
  documentId: 'doc-1', versionId: 'v-1', contentHash: 'abc', role: 'application',
  fileName, mimeType: 'image/png', sizeBytes: 150, assetPath: 'source-docs/v-1/original.png',
  parseRevision: 0, parseStatus: 'partial', blocks, usage: 'registered',
})

describe('复用现有 OCR 引擎的材料分类试算', () => {
  test('Given 图片原件没有预存图像块 When 选取 Then 安全使用当前版本的原件资产', () => {
    const picked = selectedImageBlocks(document('award.png'))
    expect(picked).toHaveLength(1)
    expect(picked[0]?.imageAssetPath).toBe('source-docs/v-1/original.png')
  })

  test('Given 多页扫描 PDF When 选取 Then 最多处理三页，不能无限占用 CPU', () => {
    const blocks: DocumentVersion['blocks'] = Array.from({ length: 10 }, (_, i) => ({
      blockId: `img-${i}`, kind: 'image', text: '', imageAssetPath: `source-docs/v-1/page-${i}.png`,
    }))
    expect(selectedImageBlocks(document('scan.pdf', blocks))).toHaveLength(3)
  })

  test('Given 真实 OCR 文字 When 分类 Then 复用本地算法，不修改原件或赋予审批效力', () => {
    const input = document('IMG_1025.png')
    const before = JSON.stringify(input)
    const result = classifyRecognizedPages(input, undefined, [{
      documentVersionId: input.versionId, fileName: input.fileName, imageBlockId: 'img-1',
      status: 'done', engine: 'tesseract-cli', blocks: [
        { blockId: 'ocr-1', text: '获奖证书', location: { kind: 'file' }, confidence: 0.96, rect: { x: 0, y: 0, w: 80, h: 10 } },
        { blockId: 'ocr-2', text: '颁发单位', location: { kind: 'file' }, confidence: 0.9, rect: { x: 0, y: 20, w: 80, h: 10 } },
      ],
    }])
    expect(result.status).toBe('recognized')
    expect(result.classification?.candidates[0]?.role).toBe('evidence')
    expect(result.documentVersionId).toBe('v-1')
    expect(result.engine).toBe('tesseract-cli')
    expect(JSON.stringify(input)).toBe(before)
  })

  test('Given OCR 不可用或未识别出文字 When 分类 Then 显式失败而不是编造内容', () => {
    const input = document('IMG_1025.png')
    const result = classifyRecognizedPages(input, undefined, [{
      documentVersionId: input.versionId, fileName: input.fileName, imageBlockId: 'img-1',
      status: 'unavailable', reason: '缺少中文语言包',
    }])
    expect(result.status).toBe('failed')
    expect(result.classification).toBeUndefined()
    expect(result.message).toContain('语言包')
  })
})
