/** F18：真实 T07 评分状态的离线往返，含版本冲突、重复包和匿名投影。 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { TemplateVersion } from '@profer/shared'
import type { T07State } from './review-v3-t07-rating-workflow'

const configDir = mkdtempSync(join(tmpdir(), 'f18-judge-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const { issueT09JudgePackage, previewT09JudgePackage, importT09JudgePackage } =
  await import('./review-v3-t09-judge-adapter')
const { answerT09Task } = await import('./review-v3-t09-offline-codec')
const { initT07State, readT07State, writeT07State } = await import('./review-v3-t07-state-store')
const { applyT07MainAction } = await import('./review-v3-t07-main-service')
const { saveDraft, publishTemplate } = await import('./template-store')
const { createBatchV2 } = await import('./batch-store')

function aggregate(caseId: string, revision = 3) {
  return {
    caseV2: { id: caseId, revision, templateId: 'tpl', templateVersion: 1,
      title: '实名学生：仅本地保留', caseFields: { name: { kind: 'string', value: '张某' } },
      documents: [], subjects: [], stage: 'review' },
    supplements: [], decisions: [], observations: [], evidenceLinks: [], tasks: [], receiptLog: [],
  } as never
}

function judging(batchId: string, caseId: string): T07State {
  return {
    batchId, rubricVersion: 4,
    rubric: { totalPrecision: 2, missingStrategy: 'block',
      dimensions: [{ id: 'd1', name: '质量', min: 0, max: 5, weight: 1 }], minEffectiveJudges: 1 },
    cases: [{ caseId, blindLabel: '匿名 A' }],
    rounds: [{ number: 1, assignments: [{ id: 'asg-1', caseId, reviewerId: 'judge-1',
      rubricVersion: 4, status: 'assigned' }], votes: [], divergenceReasons: {}, tieOrders: {} }],
  }
}

/**
 * JDG-09 新增的轮次新鲜度门禁要求批次仍存在、量表版本匹配且模板仍已发布。
 * 用真实批次 + 已发布模板建立夹具，保持测试仍走 applyT07MainAction 的真实 CAS。
 */
function seedFreshBatch(batchId: string, caseId: string) {
  const template: TemplateVersion = {
    templateId: `tpl-${batchId}`, version: 4, schemaVersion: 2, name: 'F18 评分模板',
    objectType: 'person', displayName: { template: '{{title}}' }, fields: [],
    sections: [{ id: 'all', name: '核验', order: 0, required: false, criteria: [{
      id: 'check', title: '内容检查', requirement: '核对材料中的申请内容',
      execution: 'semantic', targetScope: 'case' }] }],
    materialSlots: [], policyVersionIds: [], policyRefs: [],
    stages: [{ id: 'review', name: '审核', kind: 'manual-review', executorRole: 'reviewer' }],
    outputs: [], status: 'draft', createdAt: new Date().toISOString(),
  }
  saveDraft(template)
  publishTemplate(template.templateId, 4)
  createBatchV2({
    id: batchId, name: 'F18 评分批次', templateId: template.templateId, templateVersion: 4,
    policyVersionLock: [], caseIds: [caseId], createdAt: new Date().toISOString(),
  })
}

function setup(batchId: string, caseId: string) {
  seedFreshBatch(batchId, caseId)
  initT07State(batchId, judging(batchId, caseId), 0)
  const issued = issueT09JudgePackage({ aggregate: aggregate(caseId), batchId, assignmentId: 'asg-1' })
  const task = JSON.parse(issued.json)
  const reply = answerT09Task(task, { kind: 'judge-rating-reply', assignmentId: 'asg-1',
    rubricVersion: 4, scores: [{ dimensionId: 'd1', score: 4, na: false }], publicFeedback: '审核完成' })
  return { issued, task, reply, packageJson: JSON.stringify(reply) }
}

const deps = {
  confirmLocalOrganizer: () => true,
  submitRating: async (input: { batchId: string; reviewerId: string; expectedRevision: number;
    action: Extract<import('./review-v3-t07-rating-workflow').T07Action, { type: 'submit' }> }) => {
    const outcome = applyT07MainAction({ batchId: input.batchId,
      claim: { role: 'judge', reviewerId: input.reviewerId },
      expectedRevision: input.expectedRevision, action: input.action })
    return { revision: outcome.revision }
  },
}

describe('F18 T09 评委评分离线适配', () => {
  test('签发只含匿名投影，独立回件经 T07 CAS 落盘，重导不会重复计票', async () => {
    const caseId = 'f18-judge-case-a'
    const batchId = 'f18-judge-batch-a'
    const { issued, packageJson } = setup(batchId, caseId)
    expect(issued.json).not.toContain('实名学生')
    expect(issued.json).not.toContain('张某')
    expect(issued.round).toBe(1)
    expect(previewT09JudgePackage({ aggregate: aggregate(caseId), packageJson }).preview.status).toBe('ready')

    const first = await importT09JudgePackage({ aggregate: aggregate(caseId), packageJson, deps })
    expect(first.status).toBe('accepted')
    expect(readT07State(batchId)?.state.rounds[0]?.votes).toHaveLength(1)
    expect(readT07State(batchId)?.state.rounds[0]?.votes[0]?.scores[0]?.score).toBe(4)

    // 模拟重新读取真实存储后再次导入：回执先于旧版本冲突命中。
    const noPrompt = { ...deps, confirmLocalOrganizer: () => { throw new Error('duplicate must not prompt') } }
    const second = await importT09JudgePackage({ aggregate: aggregate(caseId), packageJson, deps: noPrompt })
    expect(second.status).toBe('duplicate')
    expect(readT07State(batchId)?.state.rounds[0]?.votes).toHaveLength(1)

    // Recreate the crash window: the scoring CAS succeeded but receipts.json
    // disappeared before it could be persisted. Recovery must inspect the durable
    // offlineActionId on the vote, not the numerical scores alone.
    rmSync(join(configDir, 'review-offline', caseId, 'receipts.json'), { force: true })
    const recovered = await importT09JudgePackage({ aggregate: aggregate(caseId), packageJson, deps: noPrompt })
    expect(recovered.status).toBe('duplicate')
    expect(readT07State(batchId)?.state.rounds[0]?.votes).toHaveLength(1)
    expect(readT07State(batchId)?.state.rounds[0]?.votes[0]?.offlineActionId)
      .toBe(JSON.parse(packageJson).actionId)
  })

  test('案卷版本变动、轮次变动和回避都明确冲突，不覆盖当前评分', async () => {
    const caseId = 'f18-judge-case-b'
    const batchId = 'f18-judge-batch-b'
    const { packageJson } = setup(batchId, caseId)
    const caseConflict = previewT09JudgePackage({ aggregate: aggregate(caseId, 4), packageJson }).preview
    expect(caseConflict.status).toBe('conflict')
    expect(caseConflict.details.join(' ')).toContain('案卷版本已变化')

    const previous = readT07State(batchId)!
    const next = { ...previous.state, rounds: [{ ...previous.state.rounds[0]!,
      assignments: [{ ...previous.state.rounds[0]!.assignments[0]!, status: 'recused' as const }] }] }
    writeT07State(batchId, next, previous.revision)
    const refused = await importT09JudgePackage({ aggregate: aggregate(caseId), packageJson, deps })
    expect(refused.status).toBe('conflict')
    expect(readT07State(batchId)?.state.rounds[0]?.votes).toHaveLength(0)
  })

  test('本机组织者未确认、包被篡改，均不得写入', async () => {
    const caseId = 'f18-judge-case-c'
    const batchId = 'f18-judge-batch-c'
    const { reply, packageJson } = setup(batchId, caseId)
    await expect(importT09JudgePackage({ aggregate: aggregate(caseId), packageJson,
      deps: { ...deps, confirmLocalOrganizer: () => false } })).rejects.toThrow('T09_LOCAL_ORGANIZER_CONFIRMATION_REQUIRED')
    await expect(importT09JudgePackage({ aggregate: aggregate(caseId),
      packageJson: JSON.stringify({ ...reply, reply: { ...reply.reply, publicFeedback: '伪造反馈' } }), deps }))
      .rejects.toThrow()
    expect(readT07State(batchId)?.state.rounds[0]?.votes).toHaveLength(0)
  })
})
