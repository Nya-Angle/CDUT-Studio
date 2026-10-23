import { describe, expect, test } from 'bun:test'
import type { ReviewBatch, TemplateVersion } from '@profer/shared'
import { createT07RoundFromPublishedTemplate } from './review-v3-t07-round-setup'

const batch = {
  id: 'batch-1', name: '项目评选', templateId: 'project-judging', templateVersion: 4,
  policyVersionLock: [], caseIds: Array.from({ length: 60 }, (_, i) => `case-${i + 1}`),
  createdAt: '2026-10-21T00:00:00Z',
} satisfies ReviewBatch

const template = {
  templateId: 'project-judging', version: 4, status: 'published',
  rubric: {
    dimensions: [
      { id: 'quality', name: '质量', min: 0, max: 10, weight: 2 },
      { id: 'impact', name: '影响', min: 0, max: 10, weight: 1 },
    ],
    minEffectiveJudges: 3, missingStrategy: 'block', totalPrecision: 2,
    tieBreaker: 'owner-decides', scaleConversion: { fromMax: 10, toMax: 100 },
  },
} as TemplateVersion

describe('F15 评分轮次与正式模板绑定', () => {
  test('按批次锁定版本加载真实量表，完整保留超过 50 个案卷', () => {
    const result = createT07RoundFromPublishedTemplate(batch, template)
    expect(result.rubricVersion).toBe(4)
    expect(result.rubric.minEffectiveJudges).toBe(3)
    expect(result.rubric.dimensions.map((d) => d.id)).toEqual(['quality', 'impact'])
    expect(result.cases).toHaveLength(60)
    expect(result.cases[0]!.blindLabel).toBe('匿名项目 001')
    expect(result.cases[59]!.blindLabel).toBe('匿名项目 060')
    expect(result.rounds[0]!.assignments).toEqual([])
  })

  test('不存在量表、版本不匹配或未发布时拒绝建立，绝不退回演示量表', () => {
    expect(() => createT07RoundFromPublishedTemplate(batch, undefined)).toThrow('锁定版本')
    expect(() => createT07RoundFromPublishedTemplate(batch, { ...template, version: 5 })).toThrow('锁定版本')
    expect(() => createT07RoundFromPublishedTemplate(batch, { ...template, status: 'draft' })).toThrow('锁定版本')
    expect(() => createT07RoundFromPublishedTemplate(batch, { ...template, rubric: undefined })).toThrow('未发布评分量表')
  })

  test('不接受缺精度、重复维度、无效权重或重复案卷', () => {
    expect(() => createT07RoundFromPublishedTemplate(batch, {
      ...template, rubric: { ...template.rubric!, totalPrecision: undefined as never },
    })).toThrow('精度')
    expect(() => createT07RoundFromPublishedTemplate(batch, {
      ...template, rubric: { ...template.rubric!, dimensions: [template.rubric!.dimensions[0]!, template.rubric!.dimensions[0]!] },
    })).toThrow('重复标识')
    expect(() => createT07RoundFromPublishedTemplate(batch, {
      ...template, rubric: { ...template.rubric!, dimensions: [{ ...template.rubric!.dimensions[0]!, weight: 0 }] },
    })).toThrow('总权重')
    expect(() => createT07RoundFromPublishedTemplate({ ...batch, caseIds: ['same', 'same'] }, template)).toThrow('重复')
  })
})
