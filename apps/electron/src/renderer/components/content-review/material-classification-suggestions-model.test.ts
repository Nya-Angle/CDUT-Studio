import { describe, expect, test } from 'bun:test'
import type { CaseAggregateV2, DocumentVersion, MaterialSlotSpec, TemplateVersion } from '@profer/shared'
import { buildMaterialSuggestionRows } from './material-classification-suggestions-model'

const slot = (id: string, name: string, hints?: MaterialSlotSpec['classificationHints']): MaterialSlotSpec => ({
  id, name, purpose: `收取${name}`, requiredElements: [], acceptedKinds: ['pdf', 'office', 'image'],
  minCount: 0, maxCount: 5, allowReuseAcrossSubjects: false,
  ...(hints ? { classificationHints: hints } : {}),
})

const template = (slots: MaterialSlotSpec[]): TemplateVersion => ({ materialSlots: slots } as unknown as TemplateVersion)

const document = (input: Partial<DocumentVersion> & Pick<DocumentVersion, 'documentId' | 'versionId' | 'fileName' | 'role'>): DocumentVersion => ({
  contentHash: 'content-' + input.versionId,
  mimeType: 'application/pdf',
  sizeBytes: 120,
  assetPath: `source-docs/${input.versionId}/original.pdf`,
  parseRevision: 0,
  parseStatus: 'parsed',
  blocks: [],
  usage: 'registered',
  active: true,
  ...input,
})

const aggregate = (documents: DocumentVersion[]): CaseAggregateV2 => ({
  caseV2: { id: 'case-1', templateId: 'tpl-1', templateVersion: 3, documents },
} as unknown as CaseAggregateV2)

describe('材料分类建议：只给候选，人工确认优先', () => {
  test('Given 待分类附件命中模板别名 When 生成建议 Then 给出角色与真实槽位理由', () => {
    const rows = buildMaterialSuggestionRows(aggregate([document({
      documentId: 'd1', versionId: 'v1', role: 'attachment', fileName: '全国竞赛获奖证书.pdf',
      blocks: [{ blockId: 'b1', text: '获奖等级：二等奖；颁发单位：中国材料学会', kind: 'text', format: 'table-cell' }],
    })]), template([slot('M002', '竞赛获奖证明', { aliases: ['获奖证书'], positiveKeywords: ['获奖等级'] })]), {})
    expect(rows).toHaveLength(1)
    expect(rows[0]!.verdict?.role).toBe('evidence')
    expect(rows[0]!.verdict?.slotId).toBe('M002')
    expect(rows[0]!.verdict?.reasons.some((reason) => reason.includes('获奖证书'))).toBe(true)
  })

  test('Given 同案相同字节已人工确认 When 新文件仅改名 Then 复用同一角色但不伪造概率', () => {
    const rows = buildMaterialSuggestionRows(aggregate([
      document({ documentId: 'd1', versionId: 'v1', role: 'evidence', materialSlotId: 'M002', fileName: '旧名.pdf', byteHash: 'a'.repeat(64),
        classificationCorrection: { role: 'evidence', materialSlotId: 'M002', at: '2026-10-25T00:00:00Z' } }),
      document({ documentId: 'd2', versionId: 'v2', role: 'attachment', fileName: '新名.pdf', byteHash: 'a'.repeat(64) }),
    ]), template([slot('M002', '竞赛获奖证明')]), {})
    expect(rows).toHaveLength(1)
    expect(rows[0]!.document.versionId).toBe('v2')
    expect(rows[0]!.verdict?.role).toBe('evidence')
    expect(rows[0]!.verdict?.slotId).toBe('M002')
    expect(rows[0]!.local.source).toBe('same-byte-confirmation')
  })

  test('Given 材料已人工确认 When 存在旧 AI 候选 Then 仍以人工确认呈现且不提供改类入口', () => {
    const rows = buildMaterialSuggestionRows(aggregate([document({
      documentId: 'd1', versionId: 'v1', role: 'rule', fileName: '奖学金评审办法.pdf',
      classificationCorrection: { role: 'rule', at: '2026-10-25T00:00:00Z' },
      blocks: [{ blockId: 'b1', text: '第一条 适用范围', kind: 'text' }],
    })]), template([slot('M001', '评审办法')]), {
      v1: { ai: { status: 'proposed', role: 'application', rationale: '模型误判', submittedChars: 80 } },
    })
    expect(rows).toHaveLength(1)
    expect(rows[0]!.verdict?.role).toBe('rule')
    expect(rows[0]!.verdict?.origin).toBe('local')
  })

  test('Given 扫描件没有文字 When 尚无 OCR 结果 Then 只提示按需 OCR，不凭空分类', () => {
    const rows = buildMaterialSuggestionRows(aggregate([document({
      documentId: 'd1', versionId: 'v1', role: 'attachment', fileName: 'IMG_1025.png',
      mimeType: 'image/png', parseStatus: 'partial', blocks: [{ blockId: 'b1', text: '', kind: 'image' }],
    })]), template([slot('M002', '竞赛获奖证明')]), {})
    expect(rows).toHaveLength(1)
    expect(rows[0]!.verdict).toBeUndefined()
    expect(rows[0]!.needsOcr).toBe(true)
    expect(rows[0]!.local.status).toBe('needs-ocr')
  })

  test('Given 本地 OCR 已识别文字 When 生成建议 Then 使用 OCR 候选且标记来源', () => {
    const rows = buildMaterialSuggestionRows(aggregate([document({
      documentId: 'd1', versionId: 'v1', role: 'attachment', fileName: 'IMG_1025.png',
      mimeType: 'image/png', parseStatus: 'partial', blocks: [{ blockId: 'b1', text: '', kind: 'image' }],
    })]), template([slot('M002', '竞赛获奖证明', { aliases: ['获奖证书'] })]), {
      v1: { ocr: { status: 'recognized', documentVersionId: 'v1', message: '本地 OCR 已识别文字', engine: 'tesseract-cli',
        classification: { status: 'high', source: 'local-rules', excerpts: ['获奖证书'],
          candidates: [{ role: 'evidence', slotId: 'M002', slotName: '竞赛获奖证明', score: 20, reasons: ['文件名匹配“获奖证书”'] }] } } },
    })
    expect(rows[0]!.verdict?.origin).toBe('ocr')
    expect(rows[0]!.verdict?.slotId).toBe('M002')
  })

  test('Given 材料已是建议的角色与槽位 When 生成建议 Then 不重复列出', () => {
    const rows = buildMaterialSuggestionRows(aggregate([document({
      documentId: 'd1', versionId: 'v1', role: 'evidence', materialSlotId: 'M002', fileName: '获奖证书.pdf',
      blocks: [{ blockId: 'b1', text: '获奖等级：二等奖', kind: 'text' }],
    })]), template([slot('M002', '竞赛获奖证明', { aliases: ['获奖证书'] })]), {})
    expect(rows).toHaveLength(0)
  })
})
