import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import type { CaseAggregateV2, RuleSpec, TemplateVersion } from '@profer/shared'
import { canonicalContentHash, publishPolicy, savePolicyDraft } from './policy-store'
import { hashEffectiveRuleSet, resolveEffectiveRuleReport, resolveEffectiveRules } from './effective-rules'
import { buildDeterministicRuleChecks } from './v2-executor-factory'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `profer-test-effective-rules-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

function rule(id: string, requirement = id, priority = 1): RuleSpec {
  return {
    id, policyVersionId: 'policy-effective@1', title: id,
    when: { field: 'declaredScore', op: 'exists' }, requirement,
    targetScope: 'case', execution: 'deterministic', onFail: 'manual-review', onUnknown: 'pending',
    sourceRefIds: [], priority, confirmation: 'confirmed',
  }
}

const baseCase = { id: 'case-effective', reviewRules: [rule('w1'), rule('w2'), rule('w3')] } as unknown as CaseAggregateV2['caseV2']

function template(policyRefs: TemplateVersion['policyRefs'] = []): TemplateVersion {
  return { schemaVersion: 2, templateId: 'test-effective', version: 1, name: '测试', objectType: 'person', fields: [], materialSlots: [], policyVersionIds: [], policyRefs, stages: [], outputs: [], status: 'draft', createdAt: new Date(0).toISOString(), displayName: { template: '测试' } }
}

describe('唯一有效规则集', () => {
  test('没有模板政策时也包含全部 workspace reviewRules', () => {
    const resolved = resolveEffectiveRules({ caseV2: baseCase }, template())
    expect(resolved.map((item) => item.rule.id)).toEqual(['w1', 'w2', 'w3'])
    expect(resolved.every((item) => item.origin.kind === 'workspace')).toBe(true)
  })

  test('同一模板的不同分项生成分项范围规则，并随模板版本进入同一规则集', () => {
    const configured = {
      ...template(),
      sections: [
        { id: 'study', name: '学业发展', order: 2, required: true, criteria: [{ id: 'credits', title: '学分要求', requirement: '核对本分项的学分材料', execution: 'semantic' as const, targetScope: 'subject' as const }] },
        { id: 'service', name: '志愿服务', order: 1, required: true, criteria: [{ id: 'hours', title: '服务时长', requirement: '核对本分项的时长证明', execution: 'manual' as const, targetScope: 'subject' as const }] },
      ],
    }
    const resolved = resolveEffectiveRules({ caseV2: { ...baseCase, reviewRules: [] } }, configured)

    expect(resolved.map(({ rule }) => [rule.id, rule.sectionId, rule.title])).toEqual([
      ['section-service-hours', 'service', '服务时长'],
      ['section-study-credits', 'study', '学分要求'],
    ])
    expect(resolved.every(({ origin }) => origin.kind === 'template' && origin.templateId === configured.templateId && origin.version === configured.version)).toBe(true)
    expect(hashEffectiveRuleSet(resolved)).toHaveLength(64)
  })

  test('合并模板与案卷规则、同 id 时以案卷规则覆盖并稳定排序', () => {
    const content = 'test policy body'
    const compiledRules = [rule('shared', '模板版本', 1), rule('p2', '模板规则二', 4)]
    const contentHash = canonicalContentHash(content)
    savePolicyDraft({ policyId: 'policy-effective', version: 1, title: 'fixture', contentHash, content, origin: { kind: 'owner-statement', text: 'fixture', enteredBy: 'test', enteredAt: new Date(0).toISOString() }, status: 'draft', confirmations: [], compiledRules })
    const caseV2 = { ...baseCase, reviewRules: [rule('shared', '案卷覆盖', 2), rule('w3', '第三条', 3)] }
    const resolved = resolveEffectiveRules({ caseV2 }, template([{ policyId: 'policy-effective', version: 1, contentHash }]))
    expect(resolved.map((item) => item.rule.id)).toEqual(['shared', 'w3', 'p2'])
    expect(resolved[0]?.rule.requirement).toBe('案卷覆盖')
    expect(resolved[0]?.origin).toEqual({ kind: 'workspace' })
    expect(new Set(resolved.map((item) => item.rule.id)).size).toBe(3)
    expect(hashEffectiveRuleSet(resolved)).toHaveLength(64)
  })

  test('真实政策发布引用：相同裸 id 的两条相反限额均进入计划且待确认', () => {
    const refs: NonNullable<TemplateVersion['policyRefs']> = []
    for (const [policyId, cap] of [['policy-school', 10], ['policy-faculty', 8]] as const) {
      const content = `${policyId}: max ${cap}`
      const contentHash = canonicalContentHash(content)
      const recordRule: RuleSpec = {
        ...rule('R01', `金额不得超过 ${cap}`), policyVersionId: `${policyId}@1`,
        workspaceConstraint: { kind: 'amount-limit', value: cap }, sourceRefIds: [`${policyId}-clause`],
      }
      savePolicyDraft({ policyId, version: 1, title: policyId, contentHash, content, origin: {
        kind: 'owner-statement', text: content, enteredBy: 'owner-01', enteredAt: '2026-10-21T08:00:00Z',
      }, status: 'draft', confirmations: [{ actorId: 'owner-01', role: 'template-owner', at: '2026-10-21T08:01:00Z' }], compiledRules: [recordRule] })
      publishPolicy(policyId, 1)
      refs.push({ policyId, version: 1, contentHash })
    }
    const published = { ...template(refs), status: 'published' as const }
    const report = resolveEffectiveRuleReport({ caseV2: { ...baseCase, reviewRules: [] } }, published)
    expect(report.rules).toHaveLength(2)
    expect(report.conflicts).toHaveLength(1)
    expect(new Set(report.rules.map(item => item.rule.id)).size).toBe(2)
    expect(report.rules.every(item => item.rule.execution === 'manual')).toBe(true)
    expect(report.conflicts[0]?.candidates.map(item => item.sourceRefIds[0])).toEqual(['policy-faculty-clause', 'policy-school-clause'])
    const aggregate = {
      caseV2: { ...baseCase, reviewRules: [], subjects: [], documents: [] },
      observations: [], evidenceLinks: [],
    } as unknown as CaseAggregateV2
    const checks = buildDeterministicRuleChecks(aggregate, report.rules.map(item => item.rule))
    expect(checks).toHaveLength(2)
    expect(checks.every(check => check.status === 'awaiting-confirmation')).toBe(true)
    expect(() => resolveEffectiveRules({ caseV2: { ...baseCase, reviewRules: [] } }, {
      ...published, policyRefs: [{ ...refs[0]!, contentHash: 'untrusted-hash' }],
    })).toThrow('F03_POLICY_REF_INVALID')
  })
})
