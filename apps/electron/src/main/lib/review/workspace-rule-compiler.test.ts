import { describe, expect, test } from 'bun:test'
import type { RuleOutlineItem, RulePack } from '@profer/shared'
import { compileWorkspaceRule } from './workspace-rule-compiler'

const pack: RulePack = { id: 'pack-1', documentId: 'rules-doc', name: '审核依据', publisher: '', academicYear: '2025-2026', version: 'v1', outline: [], confirmed: true }
function outline(id: string, constraint?: RuleOutlineItem['constraint']): RuleOutlineItem {
  return { id, category: '分值', title: id, summary: '测试规则', anchors: [], generatedBy: 'ai', ...(constraint ? { constraint } : {}) }
}

describe('审核依据规则编译', () => {
  test('可结构化比较的分值和日期约束进入 deterministic', () => {
    expect(compileWorkspaceRule(pack, outline('score', { kind: 'score-value', value: 4, appliesWhen: { field: 'category', equals: '竞赛' } })).execution).toBe('deterministic')
    expect(compileWorkspaceRule(pack, outline('unsafe-score', { kind: 'score-value', value: 4 })).execution).toBe('manual')
    expect(compileWorkspaceRule(pack, outline('date', { kind: 'date-range', dateFrom: '2025-01-01', dateTo: '2025-12-31' })).execution).toBe('deterministic')
  })

  test('证明槽要求进入 deterministic；暂不支持的互斥约束进入 manual', () => {
    expect(compileWorkspaceRule(pack, outline('evidence', { kind: 'required-evidence', requiredEvidenceTypes: ['certificate'] })).execution).toBe('deterministic')
    expect(compileWorkspaceRule(pack, outline('exclusive', { kind: 'mutual-exclusion', exclusionGroup: 'same-event' })).execution).toBe('manual')
  })

  test('适用条件不能替代审核要求：越界金额/日期仍要接受判定，固定分只用于指定类别',()=>{
    const amount=compileWorkspaceRule(pack,outline('money',{kind:'amount-limit',value:180}))
    const date=compileWorkspaceRule(pack,outline('period',{kind:'date-range',dateFrom:'2025-01-01',dateTo:'2025-12-31'}))
    const fixed=compileWorkspaceRule(pack,outline('level',{kind:'score-value',value:4,appliesWhen:{field:'category',equals:'contest'}}))
    expect(amount.when).toEqual({field:'amount',op:'exists'})
    expect(date.when).toEqual({field:'activityDate',op:'exists'})
    expect(fixed.when).toEqual({field:'category',op:'eq',value:'contest'})
  })

  test('未确认规则始终人工核验；确认的自由文本才交给 semantic', () => {
    expect(compileWorkspaceRule({ ...pack, confirmed: false }, outline('max', { kind: 'max-score', value: 8 })).execution).toBe('manual')
    expect(compileWorkspaceRule(pack, outline('impact')).execution).toBe('semantic')
  })

  test('最大分值可通过组级确定性上限计算', () => {
    const compiled = compileWorkspaceRule(pack, outline('cap', { kind: 'max-score', value: 8 }))
    expect(compiled.execution).toBe('deterministic')
    expect(compiled.targetScope).toBe('group')
    expect(compiled.calculation?.cap).toEqual({ value: '8', unit: 'point' })
  })
})
