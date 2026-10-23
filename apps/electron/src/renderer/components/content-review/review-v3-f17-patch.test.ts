import { expect, test } from 'bun:test'
import type { FieldSpec } from '@profer/shared'
import { makeF17FieldPatch } from './review-v3-f17-patch'
import type { T08FieldTarget } from './review-v3-t08-suggestion'

const target = (kind: FieldSpec['kind'], scope: 'case' | 'subject' = 'case'): T08FieldTarget => ({
  id: scope + ':score', label: '分数', scope, ...(scope === 'subject' ? { subjectId: 'subject-1' } : {}),
  field: { key: 'score', label: '分数', kind, scope } as FieldSpec,
})

test('F17 adapts human-reviewed typed values for the existing Main UpdateFields contract', () => {
  expect(makeF17FieldPatch(target('number'), { kind: 'number', value: 0 }))
    .toEqual({ caseFieldValues: { score: 0 } })
  expect(makeF17FieldPatch(target('date', 'subject'), { kind: 'date', value: '2026-10-21' }))
    .toEqual({ subjectFieldValues: [{ subjectId: 'subject-1', values: { score: '2026-10-21' } }] })
  expect(makeF17FieldPatch(target('boolean'), { kind: 'boolean', value: false }))
    .toEqual({ caseFieldValues: { score: false } })
  expect(makeF17FieldPatch(target('multi'), { kind: 'multi', value: ['甲', '乙'] }))
    .toEqual({ caseFieldValues: { score: ['甲', '乙'] } })
})

test('F17 refuses type substitution or an empty multi-select before calling Main', () => {
  expect(() => makeF17FieldPatch(target('number'), { kind: 'text', value: '23' })).toThrow('类型')
  expect(() => makeF17FieldPatch(target('multi'), { kind: 'multi', value: [] })).toThrow('至少')
  expect(() => makeF17FieldPatch({ ...target('text', 'subject'), subjectId: undefined }, { kind: 'text', value: 'ok' }))
    .toThrow('事项 ID')
})
