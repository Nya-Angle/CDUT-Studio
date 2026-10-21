import { describe, expect, test } from 'bun:test'
import type { ReviewCase } from '@profer/shared'
import { invalidateDerivedReviewInputs } from './input-invalidation'

const baseCase = {
  id: 'case-1', title: '测试案卷', type: '综合测评', applicant: '张三', academicYear: '2026',
  createdAt: '', updatedAt: '', documents: [],
  rulePacks: [{ id: 'pack-1', documentId: 'rule-1', name: '细则', publisher: '', academicYear: '2026', version: 'v1', outline: [{ id: 'r1' }], confirmed: true }],
  items: [{ id: 'item-1' }], evidences: [], isDemo: false,
} as unknown as ReviewCase

describe('审核输入派生产物失效', () => {
  test('新增待审材料后不复用旧申报事项', () => {
    const next = invalidateDerivedReviewInputs(baseCase, { applicationMaterialsChanged: true })
    expect(next.items).toEqual([])
    expect(next.rulePacks[0]?.outline).toHaveLength(1)
  })

  test('领域包变化后同时清除依赖领域的事项和规则大纲', () => {
    const next = invalidateDerivedReviewInputs(baseCase, { domainPackChanged: true })
    expect(next.items).toEqual([])
    expect(next.rulePacks[0]?.outline).toEqual([])
    expect(next.rulePacks[0]?.confirmed).toBe(false)
  })

  test('只改无关设置时保留中间产物', () => {
    expect(invalidateDerivedReviewInputs(baseCase, {})).toBe(baseCase)
  })
})
