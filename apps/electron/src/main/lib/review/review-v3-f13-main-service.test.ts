/** F13 Main 申诉端到端：真实 Case CAS、申诉/任务/回执一次保存。 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { BusinessDecision, ReviewCaseV2 } from '@profer/shared'

const directory = mkdtempSync(join(tmpdir(), 'review-f13-main-'))
process.env.PROFER_CONFIG_DIR = directory
afterAll(() => rmSync(directory, { force: true, recursive: true }))

const { createAggregate, readAggregate, submitCommand } = await import('./case-store-v2')
const { submitLocalF13Appeal, reviewLocalF13Appeal, withdrawLocalF13Appeal, runCoversAppealEvidence } =
  await import('./review-v3-f13-main-service')

const reviewer = { actorId: 'local-reviewer', actorSource: 'local' as const, role: 'reviewer' as const }

async function seedDecidedCase(id: string): Promise<void> {
  const at = new Date().toISOString()
  const reviewCase: ReviewCaseV2 = {
    id, title: '本地申诉案卷', templateId: 'tpl-local', templateVersion: 1,
    objectType: 'person', caseFields: {}, subjects: [],
    documents: [{ id: 'doc', versionId: 'doc-1', fileName: '证明.pdf', active: true } as never],
    stage: 'decided', revision: 0, createdAt: at, updatedAt: at,
  }
  await createAggregate(id, reviewCase)
  const decision: BusinessDecision = {
    id: 'decision-original', actor: reviewer, scope: { kind: 'case', ids: [] },
    stageId: 'final', result: 'reject', reason: '原材料未满足要求',
    basedOnRunId: 'run-original', basedOnRevision: 0, at, finality: 'final',
  }
  await submitCommand(id, {
    requestId: `seed-decision-${id}`, expectedRevision: 0, actor: reviewer,
    type: 'FixtureFinalDecision', payload: {},
  }, () => ({ summary: '准备有效最终决定', mutate: (draft) => {
    draft.decisions = [decision]
  } }))
}

describe('F13 Main 本地申诉闭环', () => {
  test('Given 旧案卷未绑定提交方 When 确认本地提交并申诉 Then Appeal+任务+身份+回执原子保存', async () => {
    const caseId = 'f13-submit-local'
    await seedDecidedCase(caseId)
    const missingConsent = await submitLocalF13Appeal({
      caseId, requestId: 'submit-without-consent', expectedRevision: 1,
      againstDecisionId: 'decision-original', statement: '请复核', newEvidenceDocumentVersionIds: [],
    })
    expect(missingConsent.ok).toBe(false)
    expect(readAggregate(caseId)?.caseV2.submitter).toBeUndefined()

    const result = await submitLocalF13Appeal({
      caseId, requestId: 'submit-with-consent', expectedRevision: 1,
      againstDecisionId: 'decision-original', statement: '新理由，请复核',
      newEvidenceDocumentVersionIds: [], confirmLocalSubmitter: true,
    })
    expect(result.ok).toBe(true)
    const aggregate = readAggregate(caseId)!
    expect(aggregate.caseV2.submitter?.actorId).toBe('local-student')
    expect(aggregate.caseV2.stage).toBe('awaiting-review')
    expect(aggregate.appeals).toHaveLength(1)
    expect(aggregate.tasks.find((task) => task.stageId === 'appeal-review')?.assigneeActorId).toBe('local-teacher')
    expect(aggregate.receiptLog.at(-1)?.actor?.role).toBe('student')
    expect(aggregate.decisions).toHaveLength(1)

    const retry = await submitLocalF13Appeal({
      caseId, requestId: 'submit-with-consent', expectedRevision: 1,
      againstDecisionId: 'decision-original', statement: '新理由，请复核',
      newEvidenceDocumentVersionIds: [], confirmLocalSubmitter: true,
    })
    expect(retry.ok).toBe(true)
    expect(readAggregate(caseId)?.appeals).toHaveLength(1)
  })

  test('Given 申诉已提交 When 本机受指派复核人维持原决定 Then 案卷恢复 decided 且原决定保留', async () => {
    const caseId = 'f13-review-local'
    await seedDecidedCase(caseId)
    const submitted = await submitLocalF13Appeal({
      caseId, requestId: 'submit-review', expectedRevision: 1,
      againstDecisionId: 'decision-original', statement: '请核实',
      newEvidenceDocumentVersionIds: [], confirmLocalSubmitter: true,
    })
    expect(submitted.ok).toBe(true)
    const result = await reviewLocalF13Appeal({
      caseId, requestId: 'review-maintain', expectedRevision: 2,
      appealId: readAggregate(caseId)!.appeals[0]!.id,
      resolution: 'maintain-original', reason: '重新核对后仍不符合要求',
    })
    expect(result.ok).toBe(true)
    const aggregate = readAggregate(caseId)!
    expect(aggregate.appeals[0]?.status).toBe('upheld')
    expect(aggregate.caseV2.stage).toBe('decided')
    expect(aggregate.tasks[0]?.status).toBe('completed')
    expect(aggregate.decisions).toHaveLength(1)
    expect(aggregate.receiptLog.at(-1)?.actor?.actorId).toBe('local-teacher')
  })

  test('Given 申诉新增证据但尚未重审 When 要求改判 Then 禁止修改既有决定', async () => {
    const caseId = 'f13-evidence-no-run'
    await seedDecidedCase(caseId)
    const submitted = await submitLocalF13Appeal({
      caseId, requestId: 'submit-evidence', expectedRevision: 1,
      againstDecisionId: 'decision-original', statement: '提交了证明',
      newEvidenceDocumentVersionIds: ['doc-1'], confirmLocalSubmitter: true,
    })
    expect(submitted.ok).toBe(true)
    const result = await reviewLocalF13Appeal({
      caseId, requestId: 'review-without-run', expectedRevision: 2,
      appealId: readAggregate(caseId)!.appeals[0]!.id,
      resolution: 'amend-original', amendedResult: 'pass', reason: '已认可证明',
    })
    expect(result.ok).toBe(false)
    expect(readAggregate(caseId)?.decisions).toHaveLength(1)
  })

  test('RUN-24: 时间较新但未冻结新证据版本的 Run 不能为新证据背书', () => {
    const manifest = (versions: Array<{ documentId: string; versionId: string; contentHash: string }>) => ({
      hash: 'h', templateVersion: 1, policyVersions: [], documentVersions: versions,
      observationIds: [], evidenceLinkIds: [],
    })
    const oldRun = { inputManifest: manifest([{ documentId: 'doc', versionId: 'doc-0', contentHash: 'c0' }]) }
    const newRun = { inputManifest: manifest([{ documentId: 'doc', versionId: 'doc-1', contentHash: 'c1' }]) }
    // 同 document 的旧版本不能为新 version 背书（QA RUN-24 exact-version）。
    expect(runCoversAppealEvidence(oldRun, ['doc-1'])).toBe(false)
    expect(runCoversAppealEvidence(oldRun, ['doc'])).toBe(false)
    expect(runCoversAppealEvidence(newRun, ['doc-1'])).toBe(true)
    expect(runCoversAppealEvidence(newRun, ['doc'])).toBe(false)
    expect(runCoversAppealEvidence(newRun, [])).toBe(true)
  })

  test('Given 待处理申诉 When 本地原提交人撤回 Then 申诉关闭而原判与历史不删除', async () => {
    const caseId = 'f13-withdraw-local'
    await seedDecidedCase(caseId)
    await submitLocalF13Appeal({
      caseId, requestId: 'submit-withdraw', expectedRevision: 1,
      againstDecisionId: 'decision-original', statement: '先申请复核',
      newEvidenceDocumentVersionIds: [], confirmLocalSubmitter: true,
    })
    const result = await withdrawLocalF13Appeal({
      caseId, requestId: 'withdraw-appeal', expectedRevision: 2,
      appealId: readAggregate(caseId)!.appeals[0]!.id,
    })
    expect(result.ok).toBe(true)
    const aggregate = readAggregate(caseId)!
    expect(aggregate.appeals[0]?.status).toBe('withdrawn')
    expect(aggregate.tasks[0]?.status).toBe('cancelled')
    expect(aggregate.decisions).toHaveLength(1)
    expect(aggregate.caseV2.stage).toBe('decided')
    expect(aggregate.receiptLog.at(-1)?.actor?.actorId).toBe('local-student')
  })
})
