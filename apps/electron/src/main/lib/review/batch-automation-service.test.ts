import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import type { DocumentVersion, ReviewCaseV2, ReviewRunV2, RuleSpec } from '@profer/shared'
import { createAggregate, readAggregate, submitCommand } from './case-store-v2'
import { createBatchV2, configureBatchAutomation, readBatchStateV2, saveBatchStateV2, requeueCaseAfterSupplement, updateCaseStatus, runBatchQueue, readFinalizedSnapshot } from './batch-store'
import { canonicalContentHash, publishPolicy, savePolicyDraft } from './policy-store'
import { publishTemplate, saveDraft, getTemplate } from './template-store'
import { computeRunInputHash } from './run-service-v2'
import { saveRunV2 } from './run-store-v2'
import { runBatchAutomation, finalizeCompletedBatch } from './batch-automation-service'
import { checkAutoBatchAction } from './batch-automation-gates'
import { respondSupplementV2, resolveSupplementV2 } from './stage-workflow'
import { getSettings, updateSettings, clearSettingsCache } from '../settings-service'

const root = join(import.meta.dir, '../../../../../../work/tmp', `test-batch-auto-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root
afterAll(() => { clearSettingsCache(); rmSync(root, { recursive: true, force: true }) })
let n = 0
const id = (prefix: string) => `${prefix}-${++n}`
const owner = { actorId: 'template-owner-test', role: 'template-owner' as const, actorSource: 'local' as const }
const reviewer = { actorId: 'manual-reviewer', role: 'reviewer' as const, actorSource: 'local' as const }

function createTemplate(): void {
  if (getTemplate('batch-auto-test', 1)) return
  const body = '本业务要求：申请应提供有效且能够证明身份与资格的材料'
  const hash = canonicalContentHash(body)
  const rule: RuleSpec = {
    id: 'proof-rule', policyVersionId: 'auto-policy@1', title: '有效材料检查',
    when: { field: 'proof', op: 'exists' }, requirement: '提供能够证明申请资格的有效原件',
    targetScope: 'case', execution: 'semantic', onFail: 'supplement', onUnknown: 'needs-confirmation',
    sourceRefIds: ['clause-1'], priority: 1, confirmation: 'confirmed',
    confirmedBy: owner.actorId, confirmedAt: '2026-10-10T00:00:00Z',
  }
  savePolicyDraft({
    policyId: 'auto-policy', version: 1, title: '测试审核依据', content: body, contentHash: hash,
    origin: { kind: 'owner-statement', text: body, enteredBy: owner.actorId, enteredAt: '2026-10-10T00:00:00Z' },
    status: 'draft', confirmations: [{ actorId: owner.actorId, role: owner.role, at: '2026-10-10T00:00:00Z' }],
    compiledRules: [rule],
  })
  publishPolicy('auto-policy', 1)
  saveDraft({
    templateId: 'batch-auto-test', version: 1, schemaVersion: 2,
    name: '自动化验收专用', objectType: 'person', displayName: { template: '{{title}}' },
    fields: [], materialSlots: [],
    policyVersionIds: ['auto-policy'], policyRefs: [{ policyId: 'auto-policy', version: 1, contentHash: hash }],
    stages: [{ id: 'auto-review', name: '自动审核', kind: 'auto-check', executorRole: 'reviewer' }],
    outputs: [{ id: 'review-output', kind: 'approval', audience: 'reviewer' }],
    autoPassPolicy: { enabled: true },
    status: 'draft', createdAt: '2026-10-10T00:00:00Z',
  })
  publishTemplate('batch-auto-test', 1)
}

async function createCase(status: 'compliant' | 'awaiting-supplement' = 'compliant', withSource = true): Promise<{ caseId: string; run: ReviewRunV2 }> {
  createTemplate()
  const caseId = id('case-auto')
  const doc: DocumentVersion = {
    documentId: 'd1', versionId: `${caseId}-doc-v1`, contentHash: 'content',
    role: 'evidence', fileName: '资格证明.pdf', mimeType: 'application/pdf', sizeBytes: 32,
    assetPath: 'proof.pdf', parseRevision: 1, parseStatus: 'parsed',
    blocks: [{ blockId: 'b1', text: '资格证明', kind: 'text' }], usage: 'read', active: true,
  }
  const caseV2: ReviewCaseV2 = {
    id: caseId, title: caseId, templateId: 'batch-auto-test', templateVersion: 1,
    objectType: 'person', caseFields: {}, subjects: [], documents: [doc], stage: 'reviewing',
    revision: 0, createdAt: '2026-10-10T00:00:00Z', updatedAt: '2026-10-10T00:00:00Z',
  }
  await createAggregate(caseId, caseV2)
  const run: ReviewRunV2 = {
    id: id('run'), caseId, templateId: 'batch-auto-test', templateVersion: 1,
    inputManifest: { hash: computeRunInputHash(caseV2, [], []), templateVersion: 1,
      policyVersions: [{ policyVersionId: 'auto-policy', version: 1 }],
      documentVersions: [{ documentId: doc.documentId, versionId: doc.versionId, contentHash: doc.contentHash }],
      observationIds: [], evidenceLinkIds: [], effectiveRuleIds: ['proof-rule'],
    },
    status: 'completed', checkpoints: [],
    checks: [{ checkId: id('check'), ruleId: 'proof-rule',
      target: { scope: 'case', subjectIds: [] }, status,
      reason: status === 'compliant' ? '材料完整有效' : '缺少证明要素',
      sourceRefs: withSource ? [{ caseId, documentVersionId: doc.versionId, parseRevision: 1, location: { kind: 'file' } }] : [],
      executedBy: 'semantic', executedAt: '2026-10-10T00:00:00Z',
    }],
    opinions: [], coverage: { documents: [{ documentVersionId: doc.versionId, status: 'read' }], plannedChecks: 1,
      completedChecks: 1, effectiveVerdicts: 1, pendingChecks: status === 'compliant' ? 0 : 1 },
    diagnostics: [], startedAt: '2026-10-10T00:00:00Z', completedAt: '2026-10-10T00:00:01Z',
  }
  saveRunV2(run)
  return { caseId, run }
}

function makeBatch(caseIds: string[]): string {
  const batchId = id('auto-batch')
  createBatchV2({ id: batchId, name: batchId, caseIds,
    templateId: 'batch-auto-test', templateVersion: 1,
    policyVersionLock: [{ policyVersionId: 'auto-policy', version: 1 }],
    createdAt: '2026-10-10T00:00:00Z' })
  for (const caseId of caseIds) updateCaseStatus(batchId, caseId, 'done')
  const ready = readBatchStateV2(batchId)!
  ready.status = 'queued'
  saveBatchStateV2(ready)
  return batchId
}

describe('C 阶段：显式授权的自动通过与退回', () => {
  test('默认辅助模式不能自动执行；未确认或缺少全局授权也不允许开自动通过', async () => {
    const a = await createCase()
    const batchId = makeBatch([a.caseId])
    await expect(runBatchAutomation(batchId)).rejects.toThrow('尚未启用')
    expect(() => configureBatchAutomation(batchId, 'auto-return', false)).toThrow('确认')
    updateSettings({ reviewAgentAutoApproval: false })
    expect(() => configureBatchAutomation(batchId, 'auto-approve', true)).toThrow('全局')
    expect(readAggregate(a.caseId)?.decisions).toHaveLength(0)
  })

  test('授权后自动通过+自动补件使用原 V2 单案事务，重放不会重复生效', async () => {
    const pass = await createCase('compliant')
    const returned = await createCase('awaiting-supplement')
    const batchId = makeBatch([pass.caseId, returned.caseId])
    updateSettings({ reviewAgentAutoApproval: true })
    configureBatchAutomation(batchId, 'auto-approve', true)
    const report = await runBatchAutomation(batchId)
    expect(report.applied).toBe(2)
    expect(report.blocked).toBe(0)
    const approved = readAggregate(pass.caseId)!
    expect(approved.caseV2.stage).toBe('decided')
    expect(approved.decisions.at(-1)?.result).toBe('pass')
    expect(approved.decisions.at(-1)?.actor.actorSource).toBe('system')
    expect(approved.receiptLog.at(-1)?.type).toBe('RecordWorkspaceBusinessDecision')
    const supplemented = readAggregate(returned.caseId)!
    expect(supplemented.caseV2.stage).toBe('awaiting-supplement')
    expect(supplemented.decisions.at(-1)?.result).toBe('return')
    expect(supplemented.supplements.at(-1)?.requiredElements[0]).toContain('证明申请资格')
    const next = await runBatchAutomation(batchId)
    expect(next.applied).toBe(0)
    expect(readAggregate(pass.caseId)?.decisions).toHaveLength(1)
    expect(readAggregate(returned.caseId)?.supplements).toHaveLength(1)
    expect(() => finalizeCompletedBatch(batchId)).toThrow('仍待补件')
  })

  test('自动补件模式绝不自动通过', async () => {
    const a = await createCase('compliant')
    const batchId = makeBatch([a.caseId])
    configureBatchAutomation(batchId, 'auto-return', true)
    const report = await runBatchAutomation(batchId)
    expect(report.applied).toBe(0)
    expect(readAggregate(a.caseId)?.decisions).toHaveLength(0)
  })

  test('自动通过授权撤销后，已存在的批次也不能再自动通过', async () => {
    const a = await createCase('compliant')
    const batchId = makeBatch([a.caseId])
    updateSettings({ reviewAgentAutoApproval: true })
    configureBatchAutomation(batchId, 'auto-approve', true)
    updateSettings({ reviewAgentAutoApproval: false })
    const report = await runBatchAutomation(batchId)
    expect(report.applied).toBe(0)
    expect(report.blocked).toBe(1)
    expect(readAggregate(a.caseId)?.decisions).toHaveLength(0)
  })

  test('证据缺失、旧输入、人工审批门槛或未确认政策不能冒充自动通过', async () => {
    updateSettings({ reviewAgentAutoApproval: true })
    const a = await createCase('compliant', false)
    const batchId = makeBatch([a.caseId])
    configureBatchAutomation(batchId, 'auto-approve', true)
    expect((await runBatchAutomation(batchId)).blocked).toBe(1)
    expect(readAggregate(a.caseId)?.decisions).toHaveLength(0)
  })

  test('补件满足后自动重新入队，重新审核前不沿用旧运行自动批准', async () => {
    const a = await createCase('awaiting-supplement')
    const batchId = makeBatch([a.caseId])
    configureBatchAutomation(batchId, 'auto-return', true)
    expect((await runBatchAutomation(batchId)).applied).toBe(1)
    const request = readAggregate(a.caseId)!.supplements[0]!
    const responded = await respondSupplementV2(a.caseId, {
      requestId: id('respond'), actor: { actorId: 'student', actorSource: 'local', role: 'student' },
      expectedRevision: readAggregate(a.caseId)!.caseV2.revision,
      payload: { supplementId: request.id, note: '已经补齐所需材料' },
    })
    expect(responded.ok).toBeTrue()
    // No requeue while merely responded; a reviewer must resolve supplement.
    expect(requeueCaseAfterSupplement(a.caseId)).toEqual([])
    const resolved = await resolveSupplementV2(a.caseId, {
      requestId: id('resolve'), actor: reviewer, expectedRevision: readAggregate(a.caseId)!.caseV2.revision,
      payload: { supplementId: request.id, outcome: 'satisfied', reason: '核对完成' },
    })
    expect(resolved.ok).toBeTrue()
    // The workflow command itself requeues (not merely the IPC handler).
    expect(readBatchStateV2(batchId)?.cases[0]?.status).toBe('queued')
    expect(requeueCaseAfterSupplement(a.caseId)).toEqual([]) // idempotent
    expect((await runBatchAutomation(batchId)).applied).toBe(0)
    expect(readAggregate(a.caseId)?.decisions.filter((d) => d.result === 'pass')).toHaveLength(0)
  })

  test('AI 提供的证据指针指向不存在的材料时不能自动通过', async () => {
    const a = await createCase('compliant')
    const run = { ...a.run, checks: a.run.checks.map((check) => ({
      ...check, sourceRefs: [{ caseId: a.caseId, documentVersionId: 'fabricated-doc',
        parseRevision: 1, location: { kind: 'file' as const } }],
    })) }
    saveRunV2(run)
    const batchId = makeBatch([a.caseId])
    updateSettings({ reviewAgentAutoApproval: true })
    configureBatchAutomation(batchId, 'auto-approve', true)
    const result = await runBatchAutomation(batchId)
    expect(result.applied).toBe(0)
    expect(result.blocked).toBe(1)
    expect(readAggregate(a.caseId)?.decisions).toHaveLength(0)
  })

  test('审核完成后修改案卷输入，自动处理必须拒绝旧运行', async () => {
    const a = await createCase('compliant')
    const batchId = makeBatch([a.caseId])
    updateSettings({ reviewAgentAutoApproval: true })
    configureBatchAutomation(batchId, 'auto-approve', true)
    const change = await submitCommand(a.caseId, {
      requestId: id('modify'), actor: reviewer, expectedRevision: 0,
      type: 'TestChangeCase', payload: { changed: true },
    }, () => ({ summary: '材料变更', mutate: (agg) => {
      agg.caseV2.caseFields = { proof: { kind: 'text', value: '新提交内容' } }
    } }))
    expect(change.ok).toBeTrue()
    const result = await runBatchAutomation(batchId)
    expect(result.applied).toBe(0)
    expect(result.failed).toBe(1)
    expect(readAggregate(a.caseId)?.decisions).toHaveLength(0)
  })

  test('批次授权被关闭后原 system 身份无法绕过事务门槛审批', async () => {
    const a = await createCase('compliant')
    const batchId = makeBatch([a.caseId])
    updateSettings({ reviewAgentAutoApproval: true })
    const configured = configureBatchAutomation(batchId, 'auto-approve', true)
    configureBatchAutomation(batchId, 'assist', true)
    const { decideWorkspaceCaseV2 } = await import('./workspace-business-service-v2')
    const result = await decideWorkspaceCaseV2(a.caseId, {
      requestId: id('illegal-auto-actor'),
      actor: { actorSource: 'system', actorId: `batch-auto:${encodeURIComponent(batchId)}:${configured.automation!.revision}`, role: 'reviewer' },
      expectedRevision: 0,
      payload: { result: 'pass', reason: '绕过自动策略', basedOnRunId: a.run.id, inputHash: a.run.inputManifest.hash },
    })
    expect(result.ok).toBeFalse()
    if (!result.ok) expect(result.code).toBe('AGENT_DECISION_DISABLED')
    expect(readAggregate(a.caseId)?.decisions).toHaveLength(0)
  })

  test('自动审批不接受缺失有效材料的本轮读取记录，即使材料标记为历史已读', async () => {
    const a = await createCase('compliant')
    const batchId = makeBatch([a.caseId])
    updateSettings({ reviewAgentAutoApproval: true })
    configureBatchAutomation(batchId, 'auto-approve', true)
    const template = getTemplate('batch-auto-test', 1)!
    const runWithoutCoverage = {
      ...a.run,
      coverage: { ...a.run.coverage, documents: [] },
    }
    // Direct gate test: the legacy aggregate document "usage=read" is not
    // evidence that the current autonomous run actually inspected it.
    const gate = checkAutoBatchAction(readBatchStateV2(batchId)!, readAggregate(a.caseId)!, runWithoutCoverage, template, 'pass')
    expect(gate.allowed).toBeFalse()
    if (!gate.allowed) expect(gate.reason).toContain('全部有效材料')
  })

  test('有效规则集有两条但运行重复同一条检查时，不得假称所有规则检查完成', async () => {
    const a = await createCase('compliant')
    const batchId = makeBatch([a.caseId])
    updateSettings({ reviewAgentAutoApproval: true })
    configureBatchAutomation(batchId, 'auto-approve', true)
    const template = getTemplate('batch-auto-test', 1)!
    // "proof-rule" is duplicated in the checks while "other-rule" has no
    // matching result. This must be rejected even if check count matches plan.
    const duplicated = {
      ...a.run,
      inputManifest: { ...a.run.inputManifest, effectiveRuleIds: ['proof-rule', 'other-rule'] },
      checks: [{ ...a.run.checks[0]! }, { ...a.run.checks[0]!, checkId: 'duplicate' }],
      coverage: { ...a.run.coverage, plannedChecks: 2, completedChecks: 2, effectiveVerdicts: 2 },
    }
    const gate = checkAutoBatchAction(readBatchStateV2(batchId)!, readAggregate(a.caseId)!, duplicated, template, 'pass')
    expect(gate.allowed).toBeFalse()
  })

  test('混合批次逐案分流：符合的通过、可补正的退回、人工问题保留、无证据的阻断', async () => {
    const pass = await createCase('compliant')
    const supplement = await createCase('awaiting-supplement')
    const manual = await createCase('compliant')
    const noSource = await createCase('compliant', false)
    saveRunV2({
      ...manual.run,
      checks: manual.run.checks.map((check) => ({ ...check, status: 'non-compliant' as const, reason: '资格条款冲突，需人工处理' })),
    })
    const batchId = makeBatch([pass.caseId, supplement.caseId, manual.caseId, noSource.caseId])
    updateSettings({ reviewAgentAutoApproval: true })
    configureBatchAutomation(batchId, 'auto-approve', true)
    const report = await runBatchAutomation(batchId)
    expect(report.applied).toBe(2)
    expect(report.blocked).toBe(1)
    expect(report.failed).toBe(0)
    expect(readAggregate(pass.caseId)?.decisions.at(-1)?.result).toBe('pass')
    expect(readAggregate(supplement.caseId)?.decisions.at(-1)?.result).toBe('return')
    expect(readAggregate(manual.caseId)?.decisions).toHaveLength(0)
    expect(readAggregate(noSource.caseId)?.decisions).toHaveLength(0)
    expect(readBatchStateV2(batchId)?.automationReceipts?.filter((item) => item.status === 'applied')).toHaveLength(2)
  })

  test('多个补件请求未全部核验满足，不得提前回流并重复执行旧结果', async () => {
    const target = await createCase('awaiting-supplement')
    const batchId = makeBatch([target.caseId])
    configureBatchAutomation(batchId, 'auto-return', true)
    expect((await runBatchAutomation(batchId)).applied).toBe(1)
    const first = readAggregate(target.caseId)!.supplements[0]!
    const extra = await submitCommand(target.caseId, {
      requestId: id('second-supplement'), actor: reviewer,
      expectedRevision: readAggregate(target.caseId)!.caseV2.revision,
      type: 'TestSecondSupplement', payload: {},
    }, () => ({ summary: '追加第二项待办补件', mutate: (agg) => {
      agg.supplements = [...agg.supplements, {
        ...first, id: id('sup-extra'), status: 'open', responses: [],
        reason: '另一份待核实材料', requiredElements: ['其他证明'],
      }]
    } }))
    expect(extra.ok).toBeTrue()
    const complete = async (supplementId: string) => resolveSupplementV2(target.caseId, {
      requestId: id('resolve-supplement'), actor: reviewer,
      expectedRevision: readAggregate(target.caseId)!.caseV2.revision,
      payload: { supplementId, outcome: 'satisfied', reason: '审核员已核验' },
    })
    expect((await complete(first.id)).ok).toBeTrue()
    expect(readAggregate(target.caseId)?.caseV2.stage).toBe('awaiting-supplement')
    expect(readBatchStateV2(batchId)?.cases[0]?.status).toBe('done')
    const second = readAggregate(target.caseId)!.supplements.find((s) => s.id !== first.id)!
    expect((await complete(second.id)).ok).toBeTrue()
    expect(readAggregate(target.caseId)?.caseV2.stage).toBe('reviewing')
    expect(readBatchStateV2(batchId)?.cases[0]?.status).toBe('queued')
  })

  test('完整批次链路：审核队列 → 自动正式通过 → 可审计定稿 → 重启不可重复执行', async () => {
    const first = await createCase('compliant')
    const second = await createCase('compliant')
    const batchId = makeBatch([first.caseId, second.caseId])
    const preparing = readBatchStateV2(batchId)!
    preparing.cases = preparing.cases.map((entry) => ({ ...entry, status: 'queued' as const }))
    preparing.status = 'queued'
    saveBatchStateV2(preparing)

    updateSettings({ reviewAgentAutoApproval: true })
    configureBatchAutomation(batchId, 'auto-approve', true)
    const dispatched: string[] = []
    const reviewed = await runBatchQueue(batchId, {
      runCase: async (caseId) => { dispatched.push(caseId); return { status: 'completed' } },
    })
    expect(dispatched).toEqual([first.caseId, second.caseId])
    expect(reviewed.cases.map((entry) => entry.status)).toEqual(['done', 'done'])
    expect(readAggregate(first.caseId)?.decisions).toHaveLength(0)
    const report = await runBatchAutomation(batchId)
    expect(report.applied).toBe(2)
    expect(report.failed).toBe(0)
    expect(report.blocked).toBe(0)
    for (const caseId of dispatched) {
      const actual = readAggregate(caseId)!
      expect(actual.caseV2.stage).toBe('decided')
      expect(actual.decisions.at(-1)?.finality).toBe('final')
      expect(actual.decisions.at(-1)?.actor.actorSource).toBe('system')
    }
    const finalized = finalizeCompletedBatch(batchId)
    expect(finalized.status).toBe('finalized')
    const snapshot = readFinalizedSnapshot(batchId)
    expect(snapshot).toBeDefined()
    expect((snapshot?.decisions as unknown[]).length).toBe(2)
    expect(() => finalizeCompletedBatch(batchId)).toThrow('批次状态不允许')
    await expect(runBatchQueue(batchId, { runCase: async () => {
      throw new Error('不应重跑')
    } })).rejects.toThrow('重开')
    expect(readAggregate(first.caseId)?.decisions).toHaveLength(1)
    expect(readAggregate(second.caseId)?.decisions).toHaveLength(1)
  })

  test('已真实形成所有最终业务决定后才允许批次定稿', async () => {
    const a = await createCase('compliant')
    const batchId = makeBatch([a.caseId])
    updateSettings({ reviewAgentAutoApproval: true })
    configureBatchAutomation(batchId, 'auto-approve', true)
    expect(() => finalizeCompletedBatch(batchId)).toThrow('未完成正式审批')
    expect((await runBatchAutomation(batchId)).applied).toBe(1)
    expect(finalizeCompletedBatch(batchId).status).toBe('finalized')
    await expect(runBatchAutomation(batchId)).rejects.toThrow('只有已完成')
  })
})
