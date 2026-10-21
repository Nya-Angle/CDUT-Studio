import { describe, expect, test } from 'bun:test'
import type { RuleSpec } from '@profer/shared'
import { resolveF03PolicyRules, type F03RuleEntry } from './f03-policy-resolution'

function policy(policyId: string, id: string, cap: number, patch: Partial<RuleSpec> = {}): F03RuleEntry {
  return {
    origin: { kind: 'policy', policyId, version: 1 },
    rule: {
      id, policyVersionId: `${policyId}@1`, title: '活动上限',
      when: { all: [] }, requirement: `活动限额 ${cap}`, targetScope: 'case',
      execution: 'deterministic', workspaceConstraint: { kind: 'amount-limit', value: cap },
      onFail: 'reject', onUnknown: 'needs-confirmation', sourceRefIds: [`${policyId}:clause-1`],
      priority: 1, confirmation: 'confirmed', ...patch,
    },
  }
}

describe('F03 多政策来源与人工优先关系', () => {
  test('同名而相反的限额不能被上传顺序覆盖；其他条款正常进入计划', () => {
    const school = policy('school', 'cap', 10)
    const faculty = policy('faculty', 'cap', 8)
    const notice = policy('notice', 'deadline', 5, { title: '通知时间要求' })
    const resolved = resolveF03PolicyRules([school, faculty, notice])
    expect(resolved.rules).toHaveLength(3)
    expect(new Set(resolved.rules.map(entry => entry.rule.id)).size).toBe(3)
    expect(resolved.conflicts).toHaveLength(1)
    expect(resolved.conflicts[0]!.candidates.map(entry => entry.policyId)).toEqual(['faculty', 'school'])
    expect(resolved.rules.filter(entry => entry.originalRuleId === 'cap').every(entry =>
      entry.rule.confirmation === 'conflict' && entry.rule.execution === 'manual')).toBe(true)
    expect(resolved.rules.find(entry => entry.rule.id === 'deadline')?.rule.execution).toBe('deterministic')
    expect(resolveF03PolicyRules([notice, faculty, school]).conflicts[0]!.candidatesHash)
      .toBe(resolved.conflicts[0]!.candidatesHash)
  })

  test('相同语义的多份条款去重计一次，但保存全部正式来源', () => {
    const school = policy('school', 'cap', 10)
    const faculty = policy('faculty', 'cap', 10, { sourceRefIds: ['faculty:clause-9'] })
    const resolved = resolveF03PolicyRules([faculty, school])
    expect(resolved.rules).toHaveLength(1)
    expect(resolved.conflicts).toHaveLength(0)
    expect(resolved.rules[0]?.rule.sourceRefIds).toEqual(['faculty:clause-9', 'school:clause-1'])
    expect(resolved.rules[0]?.policySources).toEqual([
      { policyId: 'faculty', version: 1 }, { policyId: 'school', version: 1 },
    ])
  })

  test('具名裁定必须选取具体版本并绑定全部候选内容；改变限额后旧裁定失效', () => {
    const school = policy('school', 'cap', 10)
    const faculty = policy('faculty', 'cap', 8)
    const first = resolveF03PolicyRules([school, faculty])
    const decision = {
      claimKey: 'same-rule-id:cap', selected: { policyId: 'school', version: 1, ruleId: 'cap' },
      candidatesHash: first.conflicts[0]!.candidatesHash,
      confirmedBy: 'owner-01', confirmedAt: '2026-10-21T08:00:00Z', reason: '已核实适用学校制度及学院补充关系',
    }
    const confirmed = resolveF03PolicyRules([school, faculty], { decisions: [decision] })
    expect(confirmed.rules.map(item => item.rule.policyVersionId)).toEqual(['school@1'])
    expect(confirmed.excluded.map(item => item.policyId)).toEqual(['faculty'])
    expect(confirmed.conflicts).toHaveLength(0)
    const stale = resolveF03PolicyRules([school, policy('faculty', 'cap', 7)], { decisions: [decision] })
    expect(stale.conflicts).toHaveLength(1)
    expect(stale.rules.every(item => item.rule.execution === 'manual')).toBe(true)
    const anonymous = resolveF03PolicyRules([school, faculty], { decisions: [{ ...decision, confirmedBy: '' }] })
    expect(anonymous.conflicts).toHaveLength(1)
  })

  test('不同条款 ID 必须显式配置同一 claimKey，不能凭标题/严格程度猜测', () => {
    const school = policy('school', 'R01', 10)
    const faculty = policy('faculty', 'F12', 8)
    expect(resolveF03PolicyRules([school, faculty]).conflicts).toHaveLength(0)
    const claims = [
      { policyId: 'school', version: 1, ruleId: 'R01', claimKey: 'activity-cap' },
      { policyId: 'faculty', version: 1, ruleId: 'F12', claimKey: 'activity-cap' },
    ]
    const resolved = resolveF03PolicyRules([school, faculty], { claims })
    expect(resolved.conflicts.map(item => item.claimKey)).toEqual(['activity-cap'])
    expect(resolved.rules.map(item => item.rule.id).sort()).toEqual(['F12', 'R01'])
    expect(resolved.rules.every(item => item.rule.confirmation === 'conflict')).toBe(true)
  })

  test('有效期必须以可信业务日期判断；没有日期或无效区间不能自动给结论', () => {
    const old = policy('school', 'old', 10, { effectiveFrom: '2025-01-01', effectiveUntil: '2025-12-31' })
    const current = policy('notice', 'current', 8, { effectiveFrom: '2026-01-01' })
    expect(resolveF03PolicyRules([old, current]).rules.every(x => x.rule.execution === 'manual')).toBe(true)
    expect(resolveF03PolicyRules([old, current], { asOfDate: '2026-10-21' }).rules.map(x => x.rule.id)).toEqual(['current'])
    expect(() => resolveF03PolicyRules([old], { asOfDate: '2026-02-30' })).toThrow('F03_AS_OF_DATE_INVALID')
    const inverted = policy('school', 'bad-window', 10, { effectiveFrom: '2026-12-31', effectiveUntil: '2026-01-01' })
    expect(resolveF03PolicyRules([inverted], { asOfDate: '2026-10-21' }).rules[0]?.rule.execution).toBe('manual')
  })

  test('未确认规则不产生确定性结论，也不能通过具名优先关系擅自提权', () => {
    const pending = policy('school', 'cap', 10, { confirmation: 'unconfirmed' })
    const confirmed = policy('faculty', 'cap', 8)
    const initial = resolveF03PolicyRules([pending, confirmed])
    const attempt = resolveF03PolicyRules([pending, confirmed], { decisions: [{
      claimKey: 'same-rule-id:cap', selected: { policyId: 'school', version: 1, ruleId: 'cap' },
      candidatesHash: initial.conflicts[0]!.candidatesHash, confirmedBy: 'owner',
      confirmedAt: '2026-10-21T08:00:00Z', reason: '口头选择',
    }] })
    expect(attempt.conflicts).toHaveLength(1)
    expect(attempt.rules.every(item => item.rule.execution === 'manual')).toBe(true)
  })

  test('部分配置的跨政策 claimKey 不得绕开同名条款冲突', () => {
    const school = policy('school', 'cap', 10)
    const faculty = policy('faculty', 'cap', 8)
    const output = resolveF03PolicyRules([school, faculty], {
      claims: [{ policyId: 'school', version: 1, ruleId: 'cap', claimKey: 'custom-key' }],
    })
    expect(output.conflicts.map(x => x.claimKey)).toEqual(['same-rule-id:cap'])
    const split = resolveF03PolicyRules([school, faculty], { claims: [
      { policyId: 'school', version: 1, ruleId: 'cap', claimKey: 'school-rule' },
      { policyId: 'faculty', version: 1, ruleId: 'cap', claimKey: 'faculty-rule' },
    ] })
    expect(split.conflicts.map(x => x.claimKey)).toEqual(['same-rule-id:cap'])
  })
})
