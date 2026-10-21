import { describe, expect, test } from 'bun:test'
import type { ReviewSubject, RuleSpec } from '@profer/shared'
import { subjectsForRule } from './rule-section-scope'

const subjects: ReviewSubject[] = [
  { id: 'study-a', type: 'item', title: '课程成绩', sectionId: 'study', fields: {}, sourceRefs: [], correction: 'user-confirmed', status: 'identified' },
  { id: 'service-a', type: 'item', title: '服务记录', sectionId: 'service', fields: {}, sourceRefs: [], correction: 'user-confirmed', status: 'identified' },
]

const rule = (sectionId?: string): RuleSpec => ({
  id: 'criterion', policyVersionId: 'template@1', title: '核对标准', when: { all: [] }, requirement: '按本分项要求核对',
  targetScope: 'subject', execution: 'semantic', onFail: 'manual-review', onUnknown: 'needs-confirmation',
  sourceRefIds: [], priority: 1, confirmation: 'confirmed', ...(sectionId ? { sectionId } : {}),
})

describe('分项规则的事项范围', () => {
  test('一条分项规则只接收所属分项事项', () => {
    expect(subjectsForRule(subjects, rule('study')).map((subject) => subject.id)).toEqual(['study-a'])
  })

  test('未限定分项的规则仍作用于整份案卷', () => {
    expect(subjectsForRule(subjects, rule()).map((subject) => subject.id)).toEqual(['study-a', 'service-a'])
  })
})
