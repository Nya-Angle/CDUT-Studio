/**
 * 未匹配业务 → 可编辑模板草稿：只做脚手架，不虚构政策、不自称可发布。
 */
import { describe, expect, test } from 'bun:test'
import { fallbackDraftFromB1 } from './review-v3-fallback-template-draft'
import type { B1AuthorDocument } from './review-template-plan-adapter-v3-b1'

function document(overrides: Partial<B1AuthorDocument> = {}): B1AuthorDocument {
  return {
    schemaVersion: 'review-b1/1',
    templateId: 'unmatched-1',
    templateVersion: '1',
    name: '未匹配业务草稿',
    purpose: '由未匹配材料生成的编辑起点',
    fields: [
      { key: 'organizationName', label: '组织名称', type: 'text', required: true, sourceId: 's1' },
      { key: 'peopleCount', label: '人数', type: 'number', required: true, sourceId: 's1' },
      { key: 'usageDate', label: '日期', type: 'date', required: false, sourceId: 's1' },
    ],
    sources: [{ sourceId: 's1', kind: 'user-declared', documentVersionId: 'doc-v1', locator: 'page:1', recordedBy: 'local-organizer' }],
    targets: [{ targetKey: 'case:1', objectKey: 'case:1', subjectId: 'c1', scenario: 'default', fieldValues: {} }],
    modules: [{
      moduleId: 'basic', version: '1', dependsOn: [],
      checks: [{
        checkKey: 'need-plan', requirement: '必须提交计划书', sourceIds: ['s1'],
        targetKeys: ['case:1'], condition: { kind: 'always' }, responsibility: 'reviewer',
      }],
    }],
    stages: [
      { stageId: 'initial-review', role: 'reviewer', mode: 'manual' },
      { stageId: 'final-review', role: 'teacher', mode: 'manual' },
      { stageId: 'tech-preview', role: 'reviewer', mode: 'technical' },
    ],
    outputs: [{ outputId: 'feedback', kind: 'item-feedback' }],
    status: 'candidate-held',
    ...overrides,
  } as B1AuthorDocument
}

describe('未匹配业务 → 可编辑模板草稿', () => {
  test('产出 draft 状态与双阶段，技术阶段不进入业务阶段链', () => {
    const result = fallbackDraftFromB1(document(), 'fallback-draft-1')
    expect(result.template.status).toBe('draft')
    expect(result.template.stages.map((stage) => stage.id)).toEqual(['initial-review', 'final-review'])
    expect(result.template.stages[1]!.executorRole).toBe('teacher')
  })

  test('不虚构政策：policyVersionIds/policyRefs 为空，来源只作为证据', () => {
    const result = fallbackDraftFromB1(document(), 'fallback-draft-1')
    expect(result.template.policyVersionIds).toEqual([])
    expect(result.template.policyRefs).toEqual([])
    expect(result.sourceCandidates).toHaveLength(1)
    expect(result.sourceCandidates[0]).toMatchObject({ documentVersionId: 'doc-v1', locator: 'page:1' })
  })

  test('判据一律语义执行，不带确定性约束（等负责人确认）', () => {
    const result = fallbackDraftFromB1(document(), 'fallback-draft-1')
    const criteria = result.template.sections!.flatMap((section) => section.criteria)
    expect(criteria.length).toBeGreaterThan(0)
    for (const criterion of criteria) {
      expect(criterion.execution).toBe('semantic')
      expect((criterion as unknown as { deterministicConstraint?: unknown }).deterministicConstraint).toBeUndefined()
    }
  })

  test('字段类型与作用域按候选映射，枚举保留选项', () => {
    const result = fallbackDraftFromB1(document({
      fields: [
        { key: 'kind', label: '类型', type: 'enum', required: true, enumValues: ['A', 'B'], sourceId: 's1' },
        { key: 'itemName', label: '事项', type: 'text', required: false, sourceId: 's1', subjectScoped: true },
      ],
    } as Partial<B1AuthorDocument>), 'fallback-draft-1')
    const enumField = result.template.fields.find((field) => field.key === 'kind')!
    expect(enumField.kind).toBe('enum')
    expect((enumField as { options?: unknown[] }).options).toHaveLength(2)
    expect(result.template.fields.find((field) => field.key === 'itemName')!.scope).toBe('subject')
  })

  test('没有手审阶段时补一个最小学审阶段，避免草稿无法编辑', () => {
    const result = fallbackDraftFromB1(document({
      stages: [{ stageId: 'tech', role: 'reviewer', mode: 'technical' }],
    } as Partial<B1AuthorDocument>), 'fallback-draft-1')
    expect(result.template.stages).toHaveLength(1)
    expect(result.template.stages[0]!.executorRole).toBe('reviewer')
  })

  test('缺字段的候选被拒绝，不产出空模板', () => {
    expect(() => fallbackDraftFromB1(document({ fields: [] } as Partial<B1AuthorDocument>), 'x')).toThrow('没有字段')
    expect(() => fallbackDraftFromB1(document(), '  ')).toThrow('缺少模板 ID')
  })
})
