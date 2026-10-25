/**
 * 一次拖入多份材料时，业务识别必须逐份原件独立判断：
 * 多份申请件可以共同指向同一业务，但绝不能把两份材料的词拼起来凑出「对象+动作」。
 */
import { describe, expect, test } from 'bun:test'
import type { DocumentVersion } from '@profer/shared'
import { classifyD4ApplicationDocuments } from './review-v3-d4-content-router'

const templates = [
  { templateId: 'g03-t01', name: '公共教学教室借用' },
  { templateId: 'g06-t01', name: '专利成果登记' },
]

const doc = (id: string, text: string, patch: Partial<DocumentVersion> = {}): DocumentVersion => ({
  documentId: 'doc-' + id, versionId: 'version-' + id, contentHash: 'hash-' + id,
  role: 'application', fileName: id + '.txt', mimeType: 'text/plain', sizeBytes: text.length,
  assetPath: 'source-docs/' + id, parseRevision: 1, parseStatus: 'parsed',
  blocks: [{ blockId: 'block-' + id, text, kind: 'text', format: 'paragraph' }],
  usage: 'registered', active: true, byteHash: 'byte-' + id,
  ...patch,
})

describe('多份申请件的业务识别', () => {
  test('单份原件仍是唯一候选并可自动建议', () => {
    const result = classifyD4ApplicationDocuments(templates, [
      doc('a', '申请借用公共教学教室，用于班会活动。'),
    ])
    expect(result).toHaveLength(1)
    expect(result[0]!.templateId).toBe('g03-t01')
    expect(result[0]!.autoEligible).toBeTrue()
  })

  test('主表+无信号附件：仍按主表给出唯一候选', () => {
    const result = classifyD4ApplicationDocuments(templates, [
      doc('form', '申请借用公共教学教室，使用时间周三下午。'),
      doc('idcard', '姓名：张三\n学号：20230001'),
    ])
    expect(result).toHaveLength(1)
    expect(result[0]!.templateId).toBe('g03-t01')
    expect(result[0]!.autoEligible).toBeTrue()
  })

  test('两份材料分别指向不同业务时不抢答，交给人工选择', () => {
    const result = classifyD4ApplicationDocuments(templates, [
      doc('venue', '申请借用公共教学教室。'),
      doc('patent', '申请专利成果登记。'),
    ])
    expect(result.map(item => item.templateId).sort()).toEqual(['g03-t01', 'g06-t01'])
    expect(result.every(item => !item.autoEligible)).toBeTrue()
  })

  test('两份材料都写同一申请事项时按显式声明匹配', () => {
    const result = classifyD4ApplicationDocuments(templates, [
      doc('form', '申请事项：专利成果登记\n申请号：2026-001'),
      doc('copy', '申请事项：专利成果登记'),
    ])
    expect(result).toHaveLength(1)
    expect(result[0]!.templateId).toBe('g06-t01')
    expect(result[0]!.confidence).toBe(1)
    expect(result[0]!.autoEligible).toBeTrue()
  })

  test('两份材料声明的业务互相矛盾时不猜', () => {
    const result = classifyD4ApplicationDocuments(templates, [
      doc('one', '申请事项：专利成果登记'),
      doc('two', '申请事项：公共教学教室借用'),
    ])
    expect(result).toEqual([])
  })

  test('有申请件尚未解析完成时不给自动建议，但仍可人工选', () => {
    const result = classifyD4ApplicationDocuments(templates, [
      doc('form', '申请借用公共教学教室。'),
      doc('scan', '', { role: 'application', parseStatus: 'pending', blocks: [] }),
    ])
    expect(result).toHaveLength(1)
    expect(result[0]!.autoEligible).toBeFalse()
  })

  test('词分散在两份材料不算同时命中（禁止跨文档拼证据）', () => {
    const result = classifyD4ApplicationDocuments(templates, [
      doc('object', '这里提到公共教学教室。'),
      doc('action', '这里提到借用。'),
    ])
    expect(result).toEqual([])
  })

  test('非申请材料只给人工候选，autoEligible 一律 false', () => {
    // PR272 F04：未识别申请主件时仍按当前原件检索模板，但 reliable=false；
    // Main 的规则候选自动匹配（ruleAutomatic）只消费 autoEligible，
    // 因此这里只能成为人工候选。
    const result = classifyD4ApplicationDocuments(templates, [
      doc('evidence', '申请借用公共教学教室。', { role: 'evidence' }),
    ])
    expect(result).toHaveLength(1)
    expect(result[0]!).toMatchObject({
      templateId: 'g03-t01',
      name: '公共教学教室借用',
      confidence: 0.95,
      evidence: 'business-content-l1',
    })
    expect(result[0]!.matchedSignals).toEqual(['教室', '借用'])
    expect(result[0]!.autoEligible).toBeFalse()
    expect(result.every(item => !item.autoEligible)).toBeTrue()
  })
})
