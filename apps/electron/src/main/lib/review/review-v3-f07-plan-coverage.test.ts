import { describe, expect, test } from 'bun:test'
import {
  REVIEW_C0_SCHEMA_VERSION,
  type CanonicalPlan, type DocumentVersion, type PlanBinding, type RuleSpec, type SourceRef,
} from '@profer/shared'
import type { T04PublishedRuleBinding } from './review-v3-t04-published-plan'
import type { T04PlanProposal, T04Status } from './review-v3-t04-rules-scoring'
import { reconcileF07PublishedPlan } from './review-v3-f07-plan-coverage'

const binding = (subjectId: string, sources: string[] = ['v1']): PlanBinding => ({
  checkKey: 'headcount', targetKey: 'group:shared', objectKey: 'org:shared', subjectId,
  applicability: 'applicable', sourceVersionIds: sources, conditionFingerprint: 'condition-1',
})
const rule = {
  id: 'headcount', policyVersionId: 'policy-1', title: '人数核验', targetScope: 'subject',
  confirmation: 'confirmed', execution: 'deterministic', when: { all: [] },
} as unknown as RuleSpec
const planOf = (...items: PlanBinding[]): CanonicalPlan => ({
  schemaVersion: REVIEW_C0_SCHEMA_VERSION, planId: 'plan-1', fingerprint: 'frozen-1',
  templateId: 'tpl', templateVersion: '1', moduleDigests: [], bindings: items,
})
const bound = (item: PlanBinding): T04PublishedRuleBinding => ({
  binding: item, rule, operation: { kind: 'value-limit', field: 'number', maximum: '20' },
  policyVersionId: 'policy-1',
})
const proposal = (item: PlanBinding, status: T04Status, sourceRefIds: string[] = []): T04PlanProposal => ({
  planFingerprint: 'frozen-1', checkKey: item.checkKey, targetKey: item.targetKey,
  objectKey: item.objectKey, ruleId: 'headcount', policyVersionId: 'policy-1',
  sourceVersionIds: [...item.sourceVersionIds],
  outcome: { status, result: null, reason: status === 'not-applicable' ? '条件不适用' : '执行结论',
    detailLines: [], missingFields: [], sourceRefIds },
})
const document = (usage: DocumentVersion['usage'] = 'read'): DocumentVersion => ({
  documentId: 'd1', versionId: 'v1', fileName: '证据.pdf', usage, parseStatus: 'parsed',
  parseRevision: 1, contentHash: 'hash',
}) as DocumentVersion
const source: SourceRef = { caseId: 'case-1', documentVersionId: 'v1', parseRevision: 1, location: { kind: 'file' } }
const checked = (items: PlanBinding[], statuses: T04Status[], sources: string[][] = []) =>
  reconcileF07PublishedPlan({
    plan: planOf(...items), bindings: items.map(bound),
    results: items.map((item, index) => ({ binding: item, proposal: proposal(item, statuses[index]!, sources[index]) })),
    caseId: 'case-1', documents: [document()], verifiedSources: [source],
    recordedAt: '2026-10-21T00:00:00Z',
  })

describe('F07 冻结计划 × 真实检查结果', () => {
  test('共享 Check/target/object 的两个不同主体必须得到两个唯一 checkId', () => {
    const output = checked([binding('alice'), binding('bob')], ['compliant', 'compliant'], [['v1'], ['v1']])
    expect(output.coverage).toMatchObject({ plannedChecks: 2, completedChecks: 2, effectiveVerdicts: 2, pendingChecks: 0 })
    expect(new Set(output.checks.map(item => item.checkId)).size).toBe(2)
    expect(output.checks.map(item => item.target.subjectIds[0])).toEqual(['alice', 'bob'])
    expect(output.checks.every(item => item.sourceRefs.length === 1)).toBeTrue()
    expect(output.allClearVerdictAllowed).toBeTrue()
  })

  test('缺一个执行结果，保留完整分母并明确记录 not-executed', () => {
    const a = binding('alice'), b = binding('bob')
    const output = reconcileF07PublishedPlan({
      plan: planOf(a, b), bindings: [bound(a), bound(b)],
      results: [{ binding: a, proposal: proposal(a, 'compliant') }],
      caseId: 'case-1', documents: [document()], verifiedSources: [source], recordedAt: '2026-10-21T00:00:00Z',
    })
    expect(output.checks.map(item => item.status)).toEqual(['compliant', 'not-executed'])
    expect(output.coverage).toMatchObject({ plannedChecks: 2, completedChecks: 1, pendingChecks: 1 })
    expect(output.allClearVerdictAllowed).toBeFalse()
  })

  test('来源只附实际核实且被该项使用的原件，未知引用阻止全符合', () => {
    const a = binding('alice')
    expect(checked([a], ['compliant']).checks[0]?.sourceRefs).toEqual([])
    const uncertain = checked([a], ['compliant'], [['v2']])
    expect(uncertain.checks[0]?.sourceRefs).toEqual([])
    expect(uncertain.blockers.join()).toContain('来源 v2 未通过')
    expect(uncertain.allClearVerdictAllowed).toBeFalse()
    const staleGeometry = reconcileF07PublishedPlan({
      plan: planOf(a), bindings: [bound(a)],
      results: [{ binding: a, proposal: proposal(a, 'compliant', ['v1']) }],
      caseId: 'case-1', documents: [document()],
      verifiedSources: [{ ...source, parseRevision: 0 }], recordedAt: '2026-10-21T00:00:00Z',
    })
    expect(staleGeometry.checks[0]?.sourceRefs).toEqual([])
    expect(staleGeometry.allClearVerdictAllowed).toBeFalse()
  })

  test('计划指纹或原件身份不同不能伪装成已执行，重复回件也不任选', () => {
    const a = binding('alice')
    const wrong = proposal(a, 'compliant')
    wrong.planFingerprint = 'stale'
    const input = { plan: planOf(a), bindings: [bound(a)], caseId: 'case-1',
      documents: [document()], verifiedSources: [source], recordedAt: '2026-10-21T00:00:00Z' }
    const stale = reconcileF07PublishedPlan({ ...input, results: [{ binding: a, proposal: wrong }] })
    expect(stale.checks[0]?.status).toBe('not-executed')
    const repeated = reconcileF07PublishedPlan({ ...input,
      results: [
        { binding: a, proposal: proposal(a, 'compliant') },
        { binding: a, proposal: proposal(a, 'non-compliant') },
      ],
    })
    expect(repeated.checks[0]?.status).toBe('not-executed')
    expect(repeated.allClearVerdictAllowed).toBeFalse()
  })

  test('合法零问题、待定、全部不适用与未读原件分别判定', () => {
    const a = binding('alice')
    expect(checked([a], ['compliant']).allClearVerdictAllowed).toBeTrue()
    expect(checked([a], ['awaiting-confirmation']).coverage.pendingChecks).toBe(1)
    expect(checked([a], ['not-applicable']).allClearVerdictAllowed).toBeFalse()
    const unread = reconcileF07PublishedPlan({
      plan: planOf(a), bindings: [bound(a)], results: [{ binding: a, proposal: proposal(a, 'compliant') }],
      caseId: 'case-1', documents: [document('unread')], verifiedSources: [source],
      recordedAt: '2026-10-21T00:00:00Z',
    })
    expect(unread.allClearVerdictAllowed).toBeFalse()
  })
})
