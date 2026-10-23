import { describe, expect, test } from 'bun:test'
import type { DocumentVersion } from '@profer/shared'
import { finalizePiDocumentCoverage } from './pi-document-coverage'

function document(overrides: Partial<DocumentVersion> = {}): DocumentVersion {
  return {
    documentId: 'doc-1',
    versionId: 'doc-1-v1',
    contentHash: 'hash',
    role: 'evidence',
    fileName: '申请材料.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    sizeBytes: 1,
    assetPath: '',
    parseRevision: 1,
    parseStatus: 'parsed',
    blocks: [
      { blockId: 'b1', text: '第一段', kind: 'text' },
      { blockId: 'b2', text: '第二段', kind: 'text' },
      { blockId: 'b3', text: '第三段', kind: 'text' },
    ],
    usage: 'registered',
    ...overrides,
  }
}

describe('Pi 单次运行材料覆盖账本', () => {
  test('保留本次运行已读取的部分块，即使 Agent 没有引用该文件', () => {
    const [coverage] = finalizePiDocumentCoverage({
      documents: [document()],
      previous: [{ documentVersionId: 'doc-1-v1', status: 'registered' }],
      readBlocksByDocument: { 'doc-1-v1': ['b1'] },
      citedDocumentVersionIds: new Set(),
    })

    expect(coverage).toEqual({
      documentVersionId: 'doc-1-v1',
      status: 'partially-read',
      reason: '本次审核通过材料工具读取了 1/3 个材料块',
    })
  })

  test('全部解析块都读完且解析完整时标记为已读', () => {
    const [coverage] = finalizePiDocumentCoverage({
      documents: [document()],
      previous: [{ documentVersionId: 'doc-1-v1', status: 'registered' }],
      readBlocksByDocument: { 'doc-1-v1': ['b1', 'b2', 'b3'] },
      citedDocumentVersionIds: new Set(),
    })

    expect(coverage).toEqual({ documentVersionId: 'doc-1-v1', status: 'read' })
  })

  test('解析不完整时即使读完已提取块也只能标记为部分读取', () => {
    const [coverage] = finalizePiDocumentCoverage({
      documents: [document({ parseStatus: 'partial' })],
      previous: [{ documentVersionId: 'doc-1-v1', status: 'registered' }],
      readBlocksByDocument: { 'doc-1-v1': ['b1', 'b2', 'b3'] },
      citedDocumentVersionIds: new Set(),
    })

    expect(coverage).toMatchObject({ status: 'partially-read', reason: expect.stringContaining('解析状态为 partial') })
  })

  test('解析失败时旧版空占位块不计入材料块数，也不能把材料标成部分已读', () => {
    const [coverage] = finalizePiDocumentCoverage({
      documents: [document({
        parseStatus: 'failed',
        parseError: 'PDF 解析失败',
        blocks: [{ blockId: 'placeholder', text: '', kind: 'text' }],
      })],
      previous: [{ documentVersionId: 'doc-1-v1', status: 'partially-read', reason: '已读取 1/1 个解析块' }],
      readBlocksByDocument: { 'doc-1-v1': ['placeholder'] },
      citedDocumentVersionIds: new Set(),
    })

    expect(coverage).toEqual({
      documentVersionId: 'doc-1-v1',
      status: 'unread',
      reason: '自动解析失败；读取空占位块不代表读取了原件，请重新解析或打开原件核验。解析原因：PDF 解析失败',
    })
  })

  test('解析失败但仅打开过原件时显示部分核验，不伪装成全文已读', () => {
    const [coverage] = finalizePiDocumentCoverage({
      documents: [document({ parseStatus: 'failed', parseError: '文件损坏', blocks: [] })],
      previous: [{ documentVersionId: 'doc-1-v1', status: 'unread' }],
      readBlocksByDocument: {},
      previewedDocumentVersionIds: new Set(['doc-1-v1']),
      citedDocumentVersionIds: new Set(),
    })

    expect(coverage).toMatchObject({ status: 'partially-read', reason: expect.stringContaining('未登记完整页面核验') })
  })

  test('失败材料的历史 read 状态没有完整视觉核验回执时会被纠正', () => {
    const [coverage] = finalizePiDocumentCoverage({
      documents: [document({ parseStatus: 'failed', parseError: '文件损坏', blocks: [] })],
      previous: [{ documentVersionId: 'doc-1-v1', status: 'read' }],
      readBlocksByDocument: {},
      citedDocumentVersionIds: new Set(),
    })

    expect(coverage).toMatchObject({ status: 'unread', reason: expect.stringContaining('空占位块不代表读取了原件') })
  })

  test('审核员明确确认核对原件后，解析失败材料记为已读并保留说明', () => {
    const [coverage] = finalizePiDocumentCoverage({
      documents: [document({
        parseStatus: 'failed', parseError: 'PDF 文本解析失败', blocks: [],
        manualReadReceipt: { actorId: 'reviewer', reason: '已逐页核对扫描件', at: '' },
      })],
      previous: [{ documentVersionId: 'doc-1-v1', status: 'unread' }],
      readBlocksByDocument: {},
      citedDocumentVersionIds: new Set(),
    })

    expect(coverage).toEqual({ documentVersionId: 'doc-1-v1', status: 'read', reason: '审核员已核对原件：已逐页核对扫描件' })
  })

  test('无读取回执但有真实材料引用时标记为部分读取；完全没有记录时标记未读', () => {
    const cited = finalizePiDocumentCoverage({
      documents: [document()],
      previous: [{ documentVersionId: 'doc-1-v1', status: 'registered' }],
      readBlocksByDocument: {},
      citedDocumentVersionIds: new Set(['doc-1-v1']),
    })
    const unread = finalizePiDocumentCoverage({
      documents: [document()],
      previous: [{ documentVersionId: 'doc-1-v1', status: 'registered' }],
      readBlocksByDocument: {},
      citedDocumentVersionIds: new Set(),
    })

    expect(cited[0]).toMatchObject({ status: 'partially-read' })
    expect(unread[0]).toMatchObject({ status: 'unread' })
  })

  test('解析器没有生成块但 Agent 实际打开过原件预览时记为部分读取而非未读', () => {
    const [coverage] = finalizePiDocumentCoverage({
      documents: [document({ parseStatus: 'partial', blocks: [], parseError: 'PDF 无文本层' })],
      previous: [{ documentVersionId: 'doc-1-v1', status: 'unread' }],
      readBlocksByDocument: {},
      previewedDocumentVersionIds: new Set(['doc-1-v1']),
      citedDocumentVersionIds: new Set(),
    })

    expect(coverage).toMatchObject({
      status: 'partially-read',
      reason: 'PDF 无文本层',
    })
  })

  test('扫描 PDF 的全部页面都完成视觉预览时与 Agent 的完整读取口径一致', () => {
    const [coverage] = finalizePiDocumentCoverage({
      documents: [document({ fileName: '扫描件.pdf', mimeType: 'application/pdf', parseStatus: 'partial', blocks: [] })],
      previous: [{ documentVersionId: 'doc-1-v1', status: 'unread' }],
      readBlocksByDocument: {},
      previewedDocumentVersionIds: new Set(['doc-1-v1']),
      fullyPreviewedDocumentVersionIds: new Set(['doc-1-v1']),
      citedDocumentVersionIds: new Set(),
    })

    expect(coverage).toEqual({ documentVersionId: 'doc-1-v1', status: 'read' })
  })

  test('独立图片的视觉块全部核对后记为已读，未核对时仍保持未读', () => {
    const photo = document({
      fileName: '证明.jpg', mimeType: 'image/jpeg', parseStatus: 'partial',
      blocks: [{ blockId: 'photo-1', text: '', kind: 'image' }],
      parseError: '图片原件已收录；内容由视觉模型识别（不做文本切块）',
    })
    const read = finalizePiDocumentCoverage({
      documents: [photo], previous: [], readBlocksByDocument: { 'doc-1-v1': ['photo-1'] }, citedDocumentVersionIds: new Set(),
    })
    const unread = finalizePiDocumentCoverage({
      documents: [photo], previous: [], readBlocksByDocument: {}, citedDocumentVersionIds: new Set(),
    })

    expect(read).toEqual([{ documentVersionId: 'doc-1-v1', status: 'read' }])
    expect(unread[0]?.status).toBe('unread')
  })
})
