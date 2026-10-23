import { describe, expect, test } from 'bun:test'
import type { ReviewRunV2, CheckResult, ReviewBatch } from '../types'
import { groupBatchIssues, triageBatchCase, prepareBatchIssueActionDraft, type BatchTriageInput } from './batch-review-triage'

const batch: Pick<ReviewBatch, 'templateId' | 'templateVersion' | 'policyVersionLock'> = {
  templateId: 't', templateVersion: 2,
  policyVersionLock: [{ policyVersionId: 'policy', version: 3 }],
}

const check = (overrides: Partial<CheckResult> = {}): CheckResult => ({
  checkId: 'check-1', ruleId: 'rule-1', target: { scope: 'case', subjectIds: [] },
  status: 'compliant', reason: '检查符合', sourceRefs: [], executedBy: 'semantic', executedAt: '2026-10-10T00:00:00.000Z',
  ...overrides,
})

function run(overrides: Partial<ReviewRunV2> = {}): ReviewRunV2 {
  return {
    id: 'run-1', caseId: 'c1', templateId: 't', templateVersion: 2,
    inputManifest: {
      hash: 'input-hash', templateVersion: 2,
      policyVersions: [{ policyVersionId: 'policy', version: 3 }],
      documentVersions: [], observationIds: [], evidenceLinkIds: [], effectiveRuleIds: ['rule-1'],
    },
    status: 'completed', checkpoints: [], checks: [check()], opinions: [],
    coverage: { documents: [{ documentVersionId: 'doc-1', status: 'read' }], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 },
    diagnostics: [], startedAt: '2026-10-10T00:00:00.000Z', completedAt: '2026-10-10T00:00:01.000Z',
    ...overrides,
  }
}

function item(overrides: Partial<BatchTriageInput> = {}): BatchTriageInput {
  return { caseId: 'c1', entryStatus: 'done', caseStage: 'reviewing', run: run(), batch, ...overrides }
}

describe('批量审核分流只产生候选，不执行正式决定', () => {
  test('所有检查符合只是可通过候选，须再次经过业务门槛', () => {
    const actual = triageBatchCase(item())
    expect(actual.route).toBe('auto-pass-candidate')
    expect(actual.requiresBusinessGate).toBe(true)
  })

  test('尚未执行或正在执行，不能根据旧运行误判已通过', () => {
    expect(triageBatchCase(item({ entryStatus: 'queued' })).route).toBe('pending')
    expect(triageBatchCase(item({ entryStatus: 'running' })).route).toBe('pending')
    expect(triageBatchCase(item({ entryStatus: 'paused' })).route).toBe('pending')
  })

  test('已决定或正在补件，不重复自动提交动作', () => {
    expect(triageBatchCase(item({ caseStage: 'decided' })).route).toBe('already-decided')
    expect(triageBatchCase(item({ caseStage: 'awaiting-supplement' })).route).toBe('awaiting-supplement')
  })

  test('没有有效规则、结果或完整材料读取时不能认定无异常', () => {
    expect(triageBatchCase(item({ run: run({ coverage: { documents: [], plannedChecks: 0, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 0 }, checks: [] }) })).route).toBe('technical-exception')
    expect(triageBatchCase(item({ run: run({ coverage: { ...run().coverage, documents: [{ documentVersionId: 'doc-1', status: 'unread' }] } }) })).route).toBe('technical-exception')
    expect(triageBatchCase(item({ run: run({ coverage: { ...run().coverage, completedChecks: 0 } }) })).route).toBe('technical-exception')
    expect(triageBatchCase(item({ run: run({ status: 'partially-completed' }) })).route).toBe('technical-exception')
    expect(triageBatchCase(item({ run: undefined })).route).toBe('technical-exception')
  })

  test('模板或政策版本不匹配时阻止自动候选', () => {
    expect(triageBatchCase(item({ run: run({ templateVersion: 1 }) })).route).toBe('technical-exception')
    expect(triageBatchCase(item({ run: run({ inputManifest: { ...run().inputManifest, policyVersions: [{ policyVersionId: 'policy', version: 2 }] } }) })).route).toBe('technical-exception')
    expect(triageBatchCase(item({ run: run({ caseId: 'other-case' }) })).route).toBe('technical-exception')
  })

  test('规则检查明确不符合或需要确认，不能自动退回或自动通过', () => {
    expect(triageBatchCase(item({ run: run({ checks: [check({ status: 'non-compliant' })] }) })).route).toBe('manual-review')
    expect(triageBatchCase(item({ run: run({ checks: [check({ status: 'awaiting-confirmation' })] }) })).route).toBe('manual-review')
  })

  test('只有明确补件检查时才产生可退回候选', () => {
    expect(triageBatchCase(item({ run: run({ checks: [check({ status: 'awaiting-supplement', reason: '需补交清晰证书' })] }) })).route).toBe('auto-return-candidate')
    expect(triageBatchCase(item({ run: run({ checks: [check({ status: 'awaiting-supplement', reason: '' })] }) })).route).toBe('manual-review')
  })

  test('未执行、失败检查与技术故障分离于业务违规', () => {
    expect(triageBatchCase(item({ entryStatus: 'failed' })).route).toBe('technical-exception')
    expect(triageBatchCase(item({ run: run({ checks: [check({ status: 'not-executed' })] }) })).route).toBe('technical-exception')
    expect(triageBatchCase(item({ run: run({ checks: [check({ status: 'execution-failed' })] }) })).route).toBe('technical-exception')
  })

  test('需要人工最终认定的阶段保持人工处理', () => {
    expect(triageBatchCase(item({ caseStage: 'awaiting-final' })).route).toBe('manual-review')
    expect(triageBatchCase(item({ caseStage: 'awaiting-rating' })).route).toBe('manual-review')
  })

  test('案卷索引出现未知阶段时按人工处理，不产生自动候选', () => {
    expect(triageBatchCase(item({ caseStage: 'unknown-future-stage' })).route).toBe('manual-review')
  })
})

describe('相似问题保守归组', () => {
  test('同规则、同状态、相同根因合并，影响案卷数去重', () => {
    const a = item({ run: run({ checks: [
      check({ checkId: 'a1', status: 'awaiting-supplement', reason: '缺少证明。' }),
      check({ checkId: 'a2', status: 'awaiting-supplement', reason: '缺少证明。' }),
    ], coverage: { ...run().coverage, plannedChecks: 2, completedChecks: 2 } }) })
    const b = item({ caseId: 'c2', run: run({ caseId: 'c2', id: 'run-2', checks: [check({ checkId: 'b1', status: 'awaiting-supplement', reason: '缺少证明' })] }) })
    const groups = groupBatchIssues([a, b])
    expect(groups).toHaveLength(1)
    expect(groups[0]!.caseIds).toEqual(['c1', 'c2'])
    expect(groups[0]!.occurrences).toHaveLength(3)
  })

  test('同一条规则但不同原因不盲目合并', () => {
    const a = item({ run: run({ checks: [check({ status: 'non-compliant', reason: '证书过期' })] }) })
    const b = item({ caseId: 'c2', run: run({ caseId: 'c2', checks: [check({ status: 'non-compliant', reason: '获奖等级不符' })] }) })
    expect(groupBatchIssues([a, b])).toHaveLength(2)
  })

  test('不同规则与状态不盲目合并，同案不同问题可以出现在不同组', () => {
    const a = item({ run: run({ checks: [
      check({ checkId: 'a1', status: 'awaiting-supplement', reason: '缺少证明' }),
      check({ checkId: 'a2', status: 'non-compliant', reason: '缺少证明' }),
      check({ checkId: 'a3', ruleId: 'rule-2', status: 'awaiting-supplement', reason: '缺少证明' }),
    ] }) })
    expect(groupBatchIssues([a])).toHaveLength(3)
  })

  test('外层模板版本符合但 manifest 版本不符时，技术异常不能同时进入问题组（回归）', () => {
    const invalid = item({ run: run({
      checks: [check({ status: 'awaiting-supplement', reason: '缺少证明' })],
      inputManifest: { ...run().inputManifest, templateVersion: 1 },
    }) })
    expect(triageBatchCase(invalid).route).toBe('technical-exception')
    expect(groupBatchIssues([invalid])).toHaveLength(0)
  })

  test('输入哈希缺失、检查不完整、材料未读都不能进入问题组', () => {
    const badRuns = [
      run({ checks: [check({ status: 'awaiting-supplement' })], inputManifest: { ...run().inputManifest, hash: '' } }),
      run({ checks: [check({ status: 'awaiting-supplement' })], coverage: { ...run().coverage, plannedChecks: 2, completedChecks: 1 } }),
      run({ checks: [check({ status: 'awaiting-supplement' })], coverage: { ...run().coverage, documents: [{ documentVersionId: 'doc-1', status: 'unread' }] } }),
      run({ checks: [check({ status: 'not-executed' })] }),
      run({ checks: [check({ status: 'awaiting-supplement' })], inputManifest: { ...run().inputManifest, effectiveRuleIds: [] } }),
    ]
    for (const invalidRun of badRuns) {
      const invalid = item({ run: invalidRun })
      expect(triageBatchCase(invalid).route).toBe('technical-exception')
      expect(groupBatchIssues([invalid])).toEqual([])
    }
  })

  test('已形成正式决定或正在补件的运行不产生当前待处理问题组', () => {
    const withIssue = run({ checks: [check({ status: 'awaiting-supplement' })] })
    expect(groupBatchIssues([item({ caseStage: 'decided', run: withIssue })])).toEqual([])
    expect(groupBatchIssues([item({ caseStage: 'awaiting-supplement', run: withIssue })])).toEqual([])
  })

  test('未完成或批次版本不匹配的运行不参与当前问题组', () => {
    const a = item({ entryStatus: 'queued', run: run({ checks: [check({ status: 'awaiting-supplement' })] }) })
    const b = item({ caseId: 'c2', run: run({ caseId: 'c2', templateVersion: 1, checks: [check({ status: 'non-compliant' })] }) })
    expect(groupBatchIssues([a, b])).toEqual([])
  })
})


describe('问题组人工处置草稿不自动写入决定', () => {
  test('仅当前有效组能生成草稿，每案均携带 runId/inputHash 和检查 ID', () => {
    const a = item({ run: run({ checks: [check({ status: 'awaiting-supplement', reason: '缺少等级证明' })] }) })
    const b = item({ caseId: 'c2', run: run({ id: 'r2', caseId: 'c2', checks: [check({ checkId: 'c2-ch', status: 'awaiting-supplement', reason: '缺少等级证明' })] }) })
    const group = groupBatchIssues([a, b])[0]!
    const draft = prepareBatchIssueActionDraft([a, b], group.key)
    expect(draft?.action).toBe('supplement-draft')
    expect(draft?.eligibleCount).toBe(2)
    expect(draft?.cases.map((item) => item.caseId)).toEqual(['c1', 'c2'])
    expect(draft?.cases[1]?.runId).toBe('r2')
    expect(draft?.cases[1]?.inputHash).toBe('input-hash')
    expect(draft?.cases[1]?.findingKeys).toEqual(['c2-ch'])
  })

  test('同组中仅部分案卷可处理时，不将不合格的案卷计入可执行范围', () => {
    const a = item({ run: run({ checks: [check({ status: 'awaiting-supplement', reason: '补证明' })] }) })
    const b = item({ caseId: 'c2', run: run({
      caseId: 'c2',
      checks: [check({ checkId: 'b', status: 'awaiting-supplement', reason: '补证明' }),
        check({ checkId: 'b2', ruleId: 'r2', status: 'non-compliant', reason: '资格不符' })],
      coverage: { ...run().coverage, plannedChecks: 2, completedChecks: 2 },
    }) })
    const group = groupBatchIssues([a, b]).find((g) => g.status === 'awaiting-supplement')!
    const draft = prepareBatchIssueActionDraft([a, b], group.key)
    expect(draft?.eligibleCount).toBe(1)
    expect(draft?.cases.find((x) => x.caseId === 'c2')?.eligible).toBe(false)
    expect(prepareBatchIssueActionDraft([a, b], group.key, ['c2'])?.eligibleCount).toBe(0)
  })

  test('不允许用旧输入哈希或无效版本的组构造草稿', () => {
    const invalid = item({ run: run({
      inputManifest: { ...run().inputManifest, templateVersion: 999 },
      checks: [check({ status: 'awaiting-supplement', reason: '补证明' })],
    }) })
    expect(groupBatchIssues([invalid])).toEqual([])
    expect(prepareBatchIssueActionDraft([invalid], 'nonexistent')).toBeNull()
  })
})
