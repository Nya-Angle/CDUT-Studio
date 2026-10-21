import { expect, test } from 'bun:test'
import type { CaseAggregateV2, FieldSpec, TemplateVersion } from '@profer/shared'
import { getT08FieldTargets, makeT08FieldUpdate, parseT08FieldDraft } from './review-v3-t08-suggestion'

const count = { key: 'count', label: '人数', kind: 'number', min: 0, max: 20, scope: 'subject' } as FieldSpec
const remark = { key: 'remark', label: '备注', kind: 'text', scope: 'case' } as FieldSpec
const template = { templateId: 'lab', version: 1, fields: [count, remark] } as TemplateVersion
const aggregate = {
  caseV2: {
    id: 'case-1', templateId: 'lab', templateVersion: 1,
    caseFields: { remark: { kind: 'text', value: '旧备注' } },
    subjects: [{ id: 'lab-use', title: '实验室申请', fields: { count: { kind: 'number', value: 18 } } }],
  },
} as unknown as CaseAggregateV2

test('T08 only exposes actual template fields and preserves scope', () => {
  const targets = getT08FieldTargets(aggregate, template)
  expect(targets.map(item => item.label)).toEqual(['实验室申请 · 人数', '案卷 · 备注'])
  expect(() => makeT08FieldUpdate(targets[0]!, { kind: 'number', value: 20 })).toThrow('Main 的模板类型')
  expect(makeT08FieldUpdate(targets[1]!, { kind: 'text', value: '人工更正' }))
    .toEqual({ caseFieldValues: { remark: '人工更正' } })
  expect(getT08FieldTargets(aggregate, { ...template, version: 2 })).toEqual([])
  expect(getT08FieldTargets(aggregate, { ...template, fields: [{ ...remark, readOnly: true }] })).toEqual([])
})

test('T08 requires a real typed value instead of executing natural-language prose', () => {
  expect(parseT08FieldDraft(count, '0')).toEqual({ kind: 'number', value: 0 })
  expect(parseT08FieldDraft(count, '18')).toEqual({ kind: 'number', value: 18 })
  expect(() => parseT08FieldDraft(count, '21')).toThrow('模板最大值')
  expect(() => parseT08FieldDraft(count, '十八人')).toThrow('有效数字')
  expect(() => parseT08FieldDraft(count, '')).toThrow('新值')
  expect(parseT08FieldDraft({ ...count, kind: 'boolean' }, 'false')).toEqual({ kind: 'boolean', value: false })
  expect(() => parseT08FieldDraft({ ...remark, kind: 'date' }, '2026-02-30')).toThrow('真实日期')
  expect(() => makeT08FieldUpdate(getT08FieldTargets(aggregate, template)[0]!, { kind: 'text', value: '18' })).toThrow('类型')
})
