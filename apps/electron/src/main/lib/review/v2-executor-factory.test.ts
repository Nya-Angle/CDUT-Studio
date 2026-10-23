import { afterAll, describe, expect, test } from 'bun:test'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { CaseAggregateV2, DocumentVersion, ReviewCaseV2, RuleSpec } from '@profer/shared'
import { buildDeterministicRuleChecks, collectV2VisionImages, recognizeDocumentImages, recognizeV2VisionBatches } from './v2-executor-factory'

const VISION_ROOT = join(tmpdir(), `cdut-review-v2-vision-${Date.now()}`)
afterAll(() => rmSync(VISION_ROOT, { recursive: true, force: true }))

function makeAggregate(): CaseAggregateV2 {
  const caseV2: ReviewCaseV2 = {
    id: 'case-rule-scope',
    templateId: 'template-test',
    templateVersion: 1,
    title: '字段隔离测试',
    objectType: 'person',
    caseFields: {},
    subjects: [
      { id: 'subject-a', type: 'item', title: '事项 A', sectionId: 'study', fields: { level: { kind: 'text', value: '国家级' }, declaredScore: { kind: 'number', value: 4 } }, sourceRefs: [], correction: 'ai-extracted', status: 'identified' },
      { id: 'subject-b', type: 'item', title: '事项 B', sectionId: 'service', fields: { level: { kind: 'text', value: '省级' }, declaredScore: { kind: 'number', value: 4 } }, sourceRefs: [], correction: 'ai-extracted', status: 'identified' },
    ],
    documents: [],
    stage: 'submitted',
    revision: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return { caseV2, observations: [], evidenceLinks: [], dispositions: [], tasks: [], decisions: [], supplements: [], appeals: [], receiptLog: [] }
}

function rule(overrides: Partial<RuleSpec>): RuleSpec {
  return {
    id: 'rule',
    policyVersionId: 'policy@1',
    title: '规则',
    when: { field: 'level', op: 'eq', value: '国家级' },
    requirement: '等级符合要求',
    targetScope: 'subject',
    execution: 'deterministic',
    onFail: 'reject',
    onUnknown: 'needs-confirmation',
    sourceRefIds: [],
    priority: 1,
    confirmation: 'confirmed',
    ...overrides,
  }
}

describe('V2 规则执行正确性门禁', () => {
  test('模型视觉输入只读取案卷内激活材料的图像页', () => {
    const imagePath = join(VISION_ROOT, 'source-docs', 'page-001.png')
    mkdirSync(join(VISION_ROOT, 'source-docs'), { recursive: true })
    writeFileSync(imagePath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jTy8AAAAASUVORK5CYII=', 'base64'))
    const aggregate = makeAggregate()
    const document: DocumentVersion = {
      documentId: 'visual-proof', versionId: 'visual-proof-v1', contentHash: 'hash', role: 'evidence',
      fileName: '扫描证书.pdf', mimeType: 'application/pdf', sizeBytes: 10, assetPath: 'source-docs/scan.pdf',
      parseRevision: 1, parseStatus: 'partial', usage: 'unread', active: true,
      blocks: [{ blockId: 'page-1-image', text: '', kind: 'image', imageAssetPath: 'source-docs/page-001.png' }],
    }
    aggregate.caseV2.documents = [document, { ...document, documentId: 'removed', versionId: 'removed-v1', active: false }]
    const images = collectV2VisionImages(aggregate, VISION_ROOT)
    expect(images).toHaveLength(1)
    expect(images[0]).toStartWith('data:image/png;base64,')
  })

  test('超过单次视觉图片上限时分批识别并逐张校验原图块 ID', async () => {
    const attachments = Array.from({ length: 10 }, (_, index) => ({
      dataUrl: `data:image/png;base64,${index}`,
      documentVersionId: 'visual-v1',
      fileName: '扫描附件.pdf',
      blockId: `page-${index + 1}`,
    }))
    const batchSizes: number[] = []
    const result = await recognizeV2VisionBatches(attachments, {
      protocol: 'openai-chat',
      async complete({ images }) {
        const batch = images ?? []
        batchSizes.push(batch.length)
        const offset = batchSizes.length === 1 ? 0 : 8
        return { content: JSON.stringify(batch.map((_image, index) => ({ documentVersionId: 'visual-v1', blockId: `page-${offset + index + 1}`, text: `第 ${offset + index + 1} 页文字` }))) }
      },
    })
    expect(batchSizes).toEqual([8, 2])
    expect(result.recognized.map((item) => item.attachment.blockId)).toHaveLength(10)
    expect(result.failed).toHaveLength(0)
  })

  test('视觉批次失败只标记该批图片，不中断其他可识别页', async () => {
    const attachments = Array.from({ length: 9 }, (_, index) => ({
      dataUrl: `data:image/png;base64,${index}`,
      documentVersionId: 'visual-v1',
      fileName: '扫描附件.pdf',
      blockId: `page-${index + 1}`,
    }))
    let callCount = 0
    const result = await recognizeV2VisionBatches(attachments, {
      protocol: 'openai-chat',
      async complete({ images }) {
        callCount++
        if (callCount === 1) return { content: '图像请求失败', imagesDropped: true, imageFailureReason: '网关拒绝图像' }
        return { content: JSON.stringify((images ?? []).map((_image, index) => ({ documentVersionId: 'visual-v1', blockId: `page-${index + 9}`, text: '可辨认文字' }))) }
      },
    })
    expect(callCount).toBe(2)
    expect(result.failed.map((item) => item.attachment.blockId)).toHaveLength(8)
    expect(result.recognized.map((item) => item.attachment.blockId)).toEqual(['page-9'])
  })

  test('视觉连续失败两批后停止重复等待并把剩余页面标为人工核对', async () => {
    const attachments = Array.from({ length: 20 }, (_, index) => ({
      dataUrl: `data:image/png;base64,${index}`,
      documentVersionId: 'visual-v1',
      fileName: '扫描附件.pdf',
      blockId: `page-${index + 1}`,
    }))
    let callCount = 0
    const result = await recognizeV2VisionBatches(attachments, {
      protocol: 'openai-chat',
      async complete() {
        callCount++
        return { content: '图片请求失败', imagesDropped: true, imageFailureReason: '上游不支持当前图片请求' }
      },
    })
    expect(callCount).toBe(2)
    expect(result.failed).toHaveLength(20)
    expect(result.failed[19]?.reason).toContain('为避免重复等待')
  })

  test('PDF 页图经 OCR 写回可引用文字块与原页坐标', async () => {
    const caseRoot = join(VISION_ROOT, 'ocr-case')
    mkdirSync(join(caseRoot, 'source-docs'), { recursive: true })
    const aggregate = makeAggregate()
    aggregate.caseV2.documents = [{
      documentId: 'scan', versionId: 'scan-v1', contentHash: 'scan-hash', role: 'evidence', fileName: '扫描证明.pdf', mimeType: 'application/pdf', sizeBytes: 10, assetPath: 'scan.pdf', parseRevision: 2, parseStatus: 'partial', usage: 'registered', active: true,
      blocks: [{ blockId: 'page-3-image', kind: 'image', text: '', imageAssetPath: 'source-docs/page-003.png', location: { kind: 'pdf-rect', page: 3, rect: { x: 0, y: 0, w: 500, h: 700 } } }],
    }]
    const pages = await recognizeDocumentImages(aggregate, aggregate.caseV2.id, {
      available: true,
      async recognize() { return { engine: 'test-ocr', engineVersion: '1', imageWidth: 500, imageHeight: 700, blocks: [{ text: '获奖金额 300 元', confidence: 0.92, rect: { x: 20, y: 30, w: 110, h: 24 } }] } },
    }, undefined, caseRoot)
    expect(pages).toHaveLength(1)
    expect(pages[0]?.status).toBe('done')
    const ocrBlock = aggregate.caseV2.documents[0]?.blocks.find((block) => block.format === 'ocr-text')
    expect(ocrBlock?.text).toBe('获奖金额 300 元')
    expect(ocrBlock?.ocr?.imageBlockId).toBe('page-3-image')
    expect(ocrBlock?.location).toEqual({ kind: 'pdf-rect', page: 3, rect: { x: 20, y: 30, w: 110, h: 24 } })
  })

  test('按 subject 隔离同名字段，并标记正确目标', () => {
    const checks = buildDeterministicRuleChecks(makeAggregate(), [rule({ id: 'level-national' })])
    expect(checks).toHaveLength(2)
    expect(checks.find((check) => check.target.subjectIds[0] === 'subject-a')?.status).toBe('compliant')
    expect(checks.find((check) => check.target.subjectIds[0] === 'subject-b')?.status).toBe('non-compliant')
  })

  test('同案分项规则只检查本分项的申报事项', () => {
    const checks = buildDeterministicRuleChecks(makeAggregate(), [rule({ id: 'study-level', sectionId: 'study' })])
    expect(checks).toHaveLength(1)
    expect(checks[0]?.target.subjectIds).toEqual(['subject-a'])
    expect(checks[0]?.status).toBe('compliant')
  })

  test('完整处理嵌套 all/any/not 条件', () => {
    const checks = buildDeterministicRuleChecks(makeAggregate(), [rule({
      id: 'nested',
      when: { all: [{ field: 'level', op: 'exists' }, { not: { any: [{ field: 'level', op: 'eq', value: '校级' }, { field: 'level', op: 'eq', value: '班级' }] } }] },
    })])
    expect(checks.every((check) => check.status === 'compliant')).toBe(true)
  })

  test('semantic 规则交给模型，manual 规则进入待确认', () => {
    const checks = buildDeterministicRuleChecks(makeAggregate(), [
      rule({ id: 'semantic-rule', execution: 'semantic' }),
      rule({ id: 'manual-rule', execution: 'manual' }),
    ])
    expect(checks.map((check) => check.ruleId)).toEqual(['manual-rule', 'manual-rule'])
    expect(checks.every((check) => check.status === 'awaiting-confirmation' && check.executedBy === 'manual')).toBe(true)
  })

  test('人工确认事实优先于原申报字段，用于重跑后的规则计算', () => {
    const checks = buildDeterministicRuleChecks(makeAggregate(), [rule({ id: 'reviewed-level', when: { field: 'level', op: 'eq', value: '省级' } })], [
      { subjectId: 'subject-a', fieldKey: 'level', value: { kind: 'text', value: '省级' }, extractedBy: 'user', confirmed: true },
    ])
    expect(checks.find((check) => check.target.subjectIds[0] === 'subject-a')?.status).toBe('compliant')
    expect(checks.find((check) => check.target.subjectIds[0] === 'subject-b')?.status).toBe('compliant')
  })

  test('确定性预算规则逐行求和、排除合计行并引用申报值与表格单元格', () => {
    const aggregate = makeAggregate()
    aggregate.caseV2.caseFields.budget = { kind: 'number', value: 1680, unit: '元' }
    aggregate.caseV2.documents = [
      {
        documentId: 'application', versionId: 'application-v1', contentHash: 'app-hash', role: 'application', fileName: '申请书.docx', mimeType: 'application/docx', sizeBytes: 1, assetPath: 'application.docx', parseRevision: 1, parseStatus: 'parsed', usage: 'registered', blocks: [
          { blockId: 'budget-text', kind: 'text', text: '申请经费：1,680 元', location: { kind: 'paragraph', index: 2 } },
        ],
      },
      {
        documentId: 'budget-sheet', versionId: 'budget-sheet-v1', contentHash: 'sheet-hash', role: 'evidence', materialSlotId: 'budget', fileName: 'activity-budget.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', sizeBytes: 1, assetPath: 'activity-budget.xlsx', parseRevision: 1, parseStatus: 'parsed', usage: 'registered', blocks: [
          ['A', '活动材料包'], ['B', '20'], ['C', '30'], ['D', '600'],
          ['A', '场地耗材'], ['B', '10'], ['C', '48'], ['D', '480'],
          ['A', '宣传印制'], ['B', '4'], ['C', '10'], ['D', '40'],
          ['A', '设备使用支持'], ['B', '3'], ['C', '120'], ['D', '360'],
          ['A', '申请表申报总额'], ['D', '1680'], ['A', '明细合计'], ['D', '1480'],
        ].map(([column, text], index) => ({ blockId: `budget-${index + 1}`, kind: 'table' as const, text: text!, location: { kind: 'sheet-cell' as const, sheet: '预算明细', row: index < 16 ? 6 + Math.floor(index / 4) : index < 18 ? 10 : 11, column: column! } })),
      },
    ]
    const budgetRule = rule({ id: 'budget-sum', targetScope: 'case', dataCheck: { kind: 'sheet-sum-match', materialSlotId: 'budget', sheetName: '预算明细', firstDataRow: 6, labelColumn: 'A', valueColumn: 'D', stopLabels: ['申请表申报总额', '明细合计'], applicantFieldKey: 'budget', quantityColumn: 'B', unitPriceColumn: 'C' } })
    const [check] = buildDeterministicRuleChecks(aggregate, [budgetRule])
    expect(check?.status).toBe('non-compliant')
    expect(check?.reason).toContain('差额 200 元')
    expect(check?.calculation?.result).toBe('148000')
    expect(check?.sourceRefs.some((ref) => ref.documentVersionId === 'application-v1' && ref.location.kind === 'paragraph')).toBe(true)
    expect(check?.sourceRefs.some((ref) => ref.documentVersionId === 'budget-sheet-v1' && ref.location.kind === 'sheet-cell' && ref.location.column === 'D')).toBe(true)
  })

  test('重复票号报出具体行，金额缺失时不按零完成合计', () => {
    const aggregate = makeAggregate()
    const makeExpenseDoc = (missingAmount = false): DocumentVersion => ({
      documentId: 'expense', versionId: 'expense-v1', contentHash: 'expense-hash', role: 'evidence', materialSlotId: 'claim-form', fileName: 'expense-claim.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', sizeBytes: 1, assetPath: 'expense.xlsx', parseRevision: 1, parseStatus: 'parsed', usage: 'registered',
      blocks: [
        ['A', 6, 'TEST-INV-01'], ['A', 7, 'TEST-INV-02'], ['A', 8, 'TEST-INV-02'], ['A', 9, 'TEST-INV-03'], ['A', 11, '明细合计'],
        ...(missingAmount ? [['E', 8, ''] as [string, number, string]] : []),
      ].map(([column, row, text], index) => ({ blockId: `expense-${index}`, kind: 'table' as const, text: String(text), location: { kind: 'sheet-cell' as const, sheet: '报销明细', row: Number(row), column: String(column) } })),
    })
    aggregate.caseV2.documents = [makeExpenseDoc()]
    const duplicateRule = rule({ id: 'duplicate-invoice', targetScope: 'case', dataCheck: { kind: 'sheet-unique-values', materialSlotId: 'claim-form', sheetName: '报销明细', firstDataRow: 6, labelColumn: 'A', valueColumn: 'A', stopLabels: ['明细合计'] } })
    const [duplicate] = buildDeterministicRuleChecks(aggregate, [duplicateRule])
    expect(duplicate?.status).toBe('non-compliant')
    expect(duplicate?.reason).toContain('TEST-INV-02')
    expect(duplicate?.reason).toContain('7、8')

    aggregate.caseV2.caseFields.totalAmount = { kind: 'number', value: 4580, unit: '元' }
    aggregate.caseV2.documents = [
      makeExpenseDoc(true),
      { documentId: 'claim', versionId: 'claim-v1', contentHash: 'claim-hash', role: 'application', fileName: 'claim.docx', mimeType: 'application/docx', sizeBytes: 1, assetPath: 'claim.docx', parseRevision: 1, parseStatus: 'parsed', usage: 'registered', blocks: [{ blockId: 'claim-total', kind: 'text', text: '申报总金额 4,580 元', location: { kind: 'paragraph', index: 1 } }] },
    ]
    const [missing] = buildDeterministicRuleChecks(aggregate, [rule({ id: 'expense-sum', targetScope: 'case', dataCheck: { kind: 'sheet-sum-match', materialSlotId: 'claim-form', sheetName: '报销明细', firstDataRow: 6, labelColumn: 'A', valueColumn: 'E', stopLabels: ['明细合计'], applicantFieldKey: 'totalAmount' } })])
    expect(missing?.status).toBe('awaiting-confirmation')
    expect(missing?.reason).toContain('未按 0 处理')
  })

  test('等级映射也使用人工更正值，并在检查结果中保留事实、证明与出处链', () => {
    const aggregate = makeAggregate()
    aggregate.caseV2.documents.push({
      documentId: 'certificate', versionId: 'certificate-v1', contentHash: 'hash', role: 'evidence', fileName: '获奖证书.pdf', mimeType: 'application/pdf', sizeBytes: 10,
      assetPath: 'certificate.pdf', parseRevision: 1, parseStatus: 'parsed', blocks: [], usage: 'read', active: true,
    })
    aggregate.evidenceLinks.push({ id: 'link-certificate', documentVersionId: 'certificate-v1', subjectId: 'subject-a', supportsFact: '等级', status: 'confirmed', linkedBy: 'user' })
    const checks = buildDeterministicRuleChecks(aggregate, [rule({
      id: 'level-mapping',
      workspaceConstraint: { kind: 'level-mapping', levels: { '国家级一等奖': 8, '省级二等奖': 4 } },
    })], [{
      id: 'observation-corrected-level', subjectId: 'subject-a', fieldKey: 'level', value: { kind: 'text', value: '省级二等奖' },
      extractedBy: 'user', confirmed: true,
      sourceRefs: [{ caseId: aggregate.caseV2.id, documentVersionId: 'certificate-v1', parseRevision: 1, location: { kind: 'file' } }],
    }])
    const check = checks.find((candidate) => candidate.target.subjectIds[0] === 'subject-a')!
    expect(check.status).toBe('compliant')
    expect(check.basis?.observationIds).toContain('observation-corrected-level')
    expect(check.basis?.evidenceLinkIds).toContain('link-certificate')
    expect(check.sourceRefs.some((ref) => ref.documentVersionId === 'certificate-v1')).toBeTrue()
  })
})
