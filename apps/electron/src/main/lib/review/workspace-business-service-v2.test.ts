import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { assessDecisionReadiness, type Actor, type ReviewCaseV2, type ReviewRunV2 } from '@profer/shared'
import { createAggregate, readAggregate, submitCommand } from './case-store-v2'
import { computeRunInputHash } from './run-service-v2'
import { saveRunV2 } from './run-store-v2'
import { getTemplate, publishTemplate, saveDraft } from './template-store'
import { respondSupplementV2 } from './stage-workflow'
import { decideWorkspaceCaseV2, isWorkspaceRunStaleV2, openWorkspaceSupplementV2, recordWorkspaceDispositionV2, recordWorkspaceSubjectAdjudicationV2 } from './workspace-business-service-v2'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `profer-test-workspace-business-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

const actor: Actor = { actorId: 'reviewer-1', actorSource: 'local', role: 'reviewer' }
let caseCounter = 0
let requestCounter = 0
const request = (): string => `workspace-command-${++requestCounter}`

function ensureTestTemplate(): void {
  if (getTemplate('workspace-test', 1)) return
  saveDraft({
    templateId: 'workspace-test', version: 1, schemaVersion: 2, name: '工作台业务服务测试', objectType: 'person',
    displayName: { template: '{{title}}' }, fields: [], materialSlots: [], policyVersionIds: [], policyRefs: [],
    stages: [{ id: 'review', name: '审核', kind: 'manual-review', executorRole: 'reviewer' }], outputs: [{ id: 'approval', kind: 'approval', audience: 'reviewer' }],
    status: 'draft', createdAt: '2026-01-01T00:00:00.000Z',
  })
  publishTemplate('workspace-test', 1)
}

async function seed(subjects: ReviewCaseV2['subjects'] = []): Promise<{ caseId: string; run: ReviewRunV2 }> {
  ensureTestTemplate()
  const caseId = `workspace-business-${++caseCounter}`
  const caseV2: ReviewCaseV2 = {
    id: caseId, templateId: 'workspace-test', templateVersion: 1, title: '工作台业务服务测试', objectType: 'person', caseFields: {}, subjects, documents: [],
    stage: 'reviewing', revision: 0, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  }
  await createAggregate(caseId, caseV2)
  const aggregate = readAggregate(caseId)!
  const reviewRun: ReviewRunV2 = {
    id: `run-${caseId}`, caseId, templateId: caseV2.templateId, templateVersion: 1,
    inputManifest: { hash: computeRunInputHash(caseV2, [], []), templateVersion: 1, policyVersions: [], documentVersions: [], observationIds: [], evidenceLinkIds: [] },
    status: 'completed', checkpoints: [],
    checks: [{ checkId: 'check-a', ruleId: 'rule-a', target: { scope: 'case', subjectIds: [] }, status: 'non-compliant', reason: '需要审核员确认', sourceRefs: [], executedBy: 'deterministic', executedAt: '2026-01-01T00:00:01.000Z' }],
    opinions: [], coverage: { documents: [], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 1 }, diagnostics: [], startedAt: '2026-01-01T00:00:00.000Z', completedAt: '2026-01-01T00:00:02.000Z',
  }
  saveRunV2(reviewRun)
  expect(aggregate.caseV2.id).toBe(caseId)
  return { caseId, run: reviewRun }
}

describe('三栏单案的 V2 业务闭环事务', () => {
  test('Given 未处理检查 When 直接决定 Then 阻断；处置后决定持久化为最终业务决定', async () => {
    const { caseId, run } = await seed()
    const blocked = await decideWorkspaceCaseV2(caseId, {
      requestId: request(), actor, expectedRevision: 0,
      payload: { result: 'pass', reason: '审核通过', basedOnRunId: run.id, inputHash: run.inputManifest.hash },
    })
    expect(blocked.ok).toBeFalse()
    if (!blocked.ok) expect(blocked.code).toBe('DEPENDENCY_UNRESOLVED')

    const disposition = await recordWorkspaceDispositionV2(caseId, {
      requestId: request(), actor, expectedRevision: 0,
      payload: { findingKey: 'check-a', disposition: 'false-positive', reason: '核对申报字段与证明后确认规则误报', runId: run.id, inputHash: run.inputManifest.hash },
    })
    expect(disposition.ok).toBeTrue()
    const after = readAggregate(caseId)!
    expect(after.dispositions[0]?.actorSource).toBe('local')
    expect(after.dispositions[0]?.inputHash).toBe(run.inputManifest.hash)

    const decision = await decideWorkspaceCaseV2(caseId, {
      requestId: request(), actor, expectedRevision: after.caseV2.revision,
      payload: { result: 'pass', reason: '材料符合当前审核依据', basedOnRunId: run.id, inputHash: run.inputManifest.hash },
    })
    expect(decision.ok).toBeTrue()
    if (decision.ok) {
      expect(decision.aggregate.caseV2.stage).toBe('decided')
      expect(decision.entity?.result).toBe('pass')
      expect(decision.aggregate.decisions.at(-1)?.basedOnRunId).toBe(run.id)
    }
  })

  test('人工核实 AI 无法判定项符合时，保存为独立的符合结论而不是 AI 误报', async () => {
    const { caseId, run } = await seed()
    saveRunV2({ ...run, checks: [{ ...run.checks[0]!, status: 'awaiting-confirmation' }] })
    const result = await recordWorkspaceDispositionV2(caseId, {
      requestId: request(), actor, expectedRevision: 0,
      payload: {
        findingKey: 'check-a',
        disposition: 'human-confirmed-compliant',
        reason: '审核员对照审核依据和材料后确认本项符合',
        runId: run.id,
        inputHash: run.inputManifest.hash,
      },
    })

    expect(result.ok).toBeTrue()
    if (result.ok) {
      expect(result.entity?.disposition).toBe('human-confirmed-compliant')
      expect(result.receipt.summary).toContain('人工确认本项符合')
    }
  })

  test('当前审核有未处理项时仍允许审核员以理由驳回', async () => {
    const { caseId, run } = await seed()
    const result = await decideWorkspaceCaseV2(caseId, {
      requestId: request(), actor, expectedRevision: 0,
      payload: { result: 'reject', reason: '当前材料与审核要求不符，按问题结论驳回', basedOnRunId: run.id, inputHash: run.inputManifest.hash },
    })
    expect(result.ok).toBeTrue()
    if (result.ok) {
      expect(result.entity?.result).toBe('reject')
      expect(result.aggregate.caseV2.stage).toBe('decided')
      expect(result.aggregate.decisions.at(-1)?.reason).toContain('驳回')
    }
  })

  test('Given 案卷输入变更 When 处理旧运行 Then 明确拒绝过期处置', async () => {
    const { caseId, run } = await seed()
    await submitCommand(caseId, { requestId: request(), actor, expectedRevision: 0, type: 'InputChanged', payload: {} }, (_aggregate) => ({
      summary: '测试输入变化', mutate: (draft) => { draft.caseV2 = { ...draft.caseV2, caseFields: { applicant: { kind: 'text', value: '修改后的申请人' } } } },
    }))
    const current = readAggregate(caseId)!
    const result = await recordWorkspaceDispositionV2(caseId, {
      requestId: request(), actor, expectedRevision: current.caseV2.revision,
      payload: { findingKey: 'check-a', disposition: 'confirmed-issue', reason: '人工确认', runId: run.id, inputHash: run.inputManifest.hash },
    })
    expect(result.ok).toBeFalse()
    if (!result.ok) expect(result.code).toBe('STALE_INPUT')
  })

  test('要求补件不让当前审核作废；仍可处理其他待办，但未完成补件时不能通过', async () => {
    const { caseId, run } = await seed()
    const runWithSecondCheck: ReviewRunV2 = {
      ...run,
      coverage: { ...run.coverage, plannedChecks: 2, completedChecks: 2, effectiveVerdicts: 2, pendingChecks: 2 },
      checks: [run.checks[0]!, { ...run.checks[0]!, checkId: 'check-b', ruleId: 'rule-b', reason: '另一项仍需审核' }],
    }
    saveRunV2(runWithSecondCheck)
    const result = await openWorkspaceSupplementV2(caseId, {
      requestId: request(), actor, expectedRevision: 0,
      payload: { findingKey: 'check-a', runId: run.id, inputHash: run.inputManifest.hash, requiredElements: ['证书日期'], reason: '证明文件没有日期' },
    })
    expect(result.ok).toBeTrue()
    if (result.ok) {
      expect(result.aggregate.caseV2.stage).toBe('awaiting-supplement')
      expect(result.aggregate.supplements[0]?.status).toBe('open')
      expect(result.aggregate.dispositions[0]?.disposition).toBe('supplement-requested')
      expect(isWorkspaceRunStaleV2(result.aggregate, run.id)).toBeFalse()
      const readiness = assessDecisionReadiness({ aggregate: result.aggregate, run: runWithSecondCheck, runStale: false, template: getTemplate('workspace-test', 1) })
      expect(readiness.ready).toBeFalse()
      expect(readiness.blockers.some((blocker) => blocker.kind === 'open-supplement')).toBeTrue()

      const otherAction = await recordWorkspaceDispositionV2(caseId, {
        requestId: request(), actor, expectedRevision: result.aggregate.caseV2.revision,
        payload: { findingKey: 'check-b', disposition: 'confirmed-issue', reason: '已核实另一项问题属实', runId: run.id, inputHash: run.inputManifest.hash },
      })
      expect(otherAction.ok).toBeTrue()
    }
  })

  test('补件回复到达后，旧运行标记为过期并要求重新审核', async () => {
    const { caseId, run } = await seed()
    const opened = await openWorkspaceSupplementV2(caseId, {
      requestId: request(), actor, expectedRevision: 0,
      payload: { findingKey: 'check-a', runId: run.id, inputHash: run.inputManifest.hash, requiredElements: ['证书日期'], reason: '证明文件没有日期' },
    })
    if (!opened.ok) throw new Error(opened.message)
    const replied = await respondSupplementV2(caseId, {
      requestId: request(), actor, expectedRevision: opened.aggregate.caseV2.revision,
      payload: { supplementId: opened.entity!.id, note: '已补充说明' },
    })
    expect(replied.ok).toBeTrue()
    if (replied.ok) expect(isWorkspaceRunStaleV2(replied.aggregate, run.id)).toBeTrue()
  })

  test('事项认定追加历史，并从当前认定派生 partial-pass 与最终分数', async () => {
    const subjects: ReviewCaseV2['subjects'] = [
      { id: 'subject-a', type: 'item', title: '竞赛奖励', fields: { level: { kind: 'enum', value: '国家级二等奖' }, declaredScore: { kind: 'number', value: 8 } }, sourceRefs: [], correction: 'user-confirmed', status: 'identified' },
      { id: 'subject-b', type: 'item', title: '志愿服务', fields: { declaredScore: { kind: 'number', value: 2 } }, sourceRefs: [], correction: 'user-confirmed', status: 'identified' },
    ]
    const { caseId, run } = await seed(subjects)
    const disposed = await recordWorkspaceDispositionV2(caseId, {
      requestId: request(), actor, expectedRevision: 0,
      payload: { findingKey: 'check-a', disposition: 'false-positive', reason: '当前测试中的规则问题已由审核员核实', runId: run.id, inputHash: run.inputManifest.hash },
    })
    expect(disposed.ok).toBeTrue()

    if (!disposed.ok) throw new Error(disposed.message)
    let revision = disposed.aggregate.caseV2.revision
    const accepted = await recordWorkspaceSubjectAdjudicationV2(caseId, {
      requestId: request(), actor, expectedRevision: revision,
      payload: { subjectId: 'subject-a', outcome: 'accepted', reason: '先记录原认定', runId: run.id, inputHash: run.inputManifest.hash },
    })
    expect(accepted.ok).toBeTrue()
    if (!accepted.ok) throw new Error(accepted.message)
    revision = accepted.aggregate.caseV2.revision
    const modified = await recordWorkspaceSubjectAdjudicationV2(caseId, {
      requestId: request(), actor, expectedRevision: revision,
      payload: { subjectId: 'subject-a', outcome: 'modified', finalFields: { level: { kind: 'enum', value: '省级二等奖' }, declaredScore: { kind: 'number', value: 4 } }, reason: '证书等级对应省级二等奖，按当前确认规则计 4 分', runId: run.id, inputHash: run.inputManifest.hash },
    })
    expect(modified.ok).toBeTrue()
    if (!modified.ok) throw new Error(modified.message)
    revision = modified.aggregate.caseV2.revision
    expect(modified.aggregate?.adjudications).toHaveLength(2)
    expect(modified.aggregate?.adjudications?.at(-1)?.supersedesAdjudicationId).toBe(accepted.entity?.id)

    const rejected = await recordWorkspaceSubjectAdjudicationV2(caseId, {
      requestId: request(), actor, expectedRevision: revision,
      payload: { subjectId: 'subject-b', outcome: 'rejected', reason: '无法提供要求的有效证明', runId: run.id, inputHash: run.inputManifest.hash },
    })
    expect(rejected.ok).toBeTrue()
    if (!rejected.ok) throw new Error(rejected.message)
    revision = rejected.aggregate.caseV2.revision
    const decision = await decideWorkspaceCaseV2(caseId, {
      requestId: request(), actor, expectedRevision: revision,
      payload: { result: 'partial-pass', reason: '按事项分别核定结果', basedOnRunId: run.id, inputHash: run.inputManifest.hash },
    })
    expect(decision.ok).toBeTrue()
    if (!decision.ok) throw new Error(decision.message)
    expect(decision.aggregate?.decisions.at(-1)?.finalScores).toEqual([
      { subjectId: 'subject-a', value: '4', basisRunId: run.id },
      { subjectId: 'subject-b', value: '0', basisRunId: run.id },
    ])
  })
})
