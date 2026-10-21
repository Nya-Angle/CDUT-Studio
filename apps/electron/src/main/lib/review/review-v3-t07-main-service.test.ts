/** T07 桥接层：身份派生、修订号守卫、持久化与视图投影。 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const configDir = mkdtempSync(join(tmpdir(), 't07-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const { deriveT07Actor, applyT07MainAction, getT07View, readT07RoundSummary, initT07MainState } =
  await import('./review-v3-t07-main-service')
const { readT07State } = await import('./review-v3-t07-state-store')
const { createBatchV2 } = await import('./batch-store')
const { saveDraft, publishTemplate } = await import('./template-store')

function initialState(batchId: string) {
  return {
    batchId, rubricVersion: 1,
    rubric: {
      id: 'r1', name: '评分表', version: 1, strategy: 'weighted-mean' as const,
      dimensions: [
        { id: 'quality', name: '质量', weight: 1, min: 0, max: 5 },
        { id: 'impact', name: '影响', weight: 1, min: 0, max: 5 },
      ],
      minEffectiveJudges: 2,
      conversion: { mode: 'linear' as const, targetMax: 100 },
    },
    cases: [{ caseId: 'case-a', blindLabel: '案件 A' }, { caseId: 'case-b', blindLabel: '案件 B' }],
    rounds: [{ number: 1, assignments: [], votes: [], divergenceReasons: {}, tieOrders: {} }],
  }
}

function seedPublishedBatch(batchId: string): void {
  const templateId = 'judging-' + batchId
  saveDraft({
    templateId, version: 1, schemaVersion: 2, name: '本地独立评分',
    objectType: 'organization', displayName: { template: '{{name}}' },
    fields: [], sections: [], materialSlots: [], policyVersionIds: [], policyRefs: [],
    outputs: [],
    // 发布测试走真实服务端校验；量表模板也须包含一条合法业务流程。
    stages: [{ id: 'judge-review', name: '评委审核', kind: 'manual-review', executorRole: 'reviewer' }],
    status: 'draft', createdAt: '2026-10-21T00:00:00Z',
    rubric: {
      dimensions: [
        { id: 'quality', name: '质量', min: 0, max: 5, weight: 1 },
        { id: 'impact', name: '影响', min: 0, max: 5, weight: 1 },
      ],
      missingStrategy: 'block', totalPrecision: 2, minEffectiveJudges: 2,
      tieBreaker: 'shared-rank', scaleConversion: { fromMax: 5, toMax: 100 },
    },
  } as never)
  publishTemplate(templateId, 1)
  createBatchV2({
    id: batchId, name: '本地评分批次', templateId, templateVersion: 1,
    policyVersionLock: [], caseIds: ['case-a', 'case-b'],
    createdAt: '2026-10-21T00:00:00Z',
  })
}

describe('T07 桥接层', () => {
  test('组织者身份由 Main 固定为本地审核员，不接受渲染层自称', () => {
    expect(deriveT07Actor({ role: 'organizer' })).toEqual({ actorId: 'local-reviewer', role: 'organizer', actorSource: 'local' })
    expect(() => deriveT07Actor(undefined)).toThrow('T07_ACTOR_REQUIRED')
  })

  test('评委必须给出合法本地标识', () => {
    expect(deriveT07Actor({ role: 'judge', reviewerId: 'local-judge-1' }).actorId).toBe('local-judge-1')
    expect(() => deriveT07Actor({ role: 'judge' })).toThrow('T07_JUDGE_ID_REQUIRED')
    expect(() => deriveT07Actor({ role: 'judge', reviewerId: '../etc' })).toThrow('T07_JUDGE_ID_INVALID')
  })

  test('首次建立轮次后持久化，且修订号从 0 起步', () => {
    const batchId = 'batch-t07-init'
    seedPublishedBatch(batchId)
    const first = initT07MainState({
      batchId, claim: { role: 'organizer' }, state: initialState(batchId) as never,
    })
    expect(first.revision).toBe(1)
    const stored = readT07State(batchId)
    expect(stored?.revision).toBe(1)
    expect(stored?.state.cases).toHaveLength(2)
    expect(stored?.state.cases[0]?.blindLabel).toBe('匿名项目 001')
    expect(stored?.state.rubric.dimensions.map((d) => d.id)).toEqual(['quality', 'impact'])
  })

  test('修订号不符时拒绝写入，避免并发覆盖', () => {
    const batchId = 'batch-t07-conflict'
    seedPublishedBatch(batchId)
    initT07MainState({ batchId, claim: { role: 'organizer' }, state: initialState(batchId) as never })
    expect(() => applyT07MainAction({
      batchId, claim: { role: 'organizer' }, expectedRevision: 0,
      action: { type: 'assign', caseId: 'case-a', reviewerId: 'local-judge-1', assignmentId: 'a1' },
    })).toThrow('T07_REVISION_CONFLICT')
  })

  test('分配与评分落到持久状态，视图可重新读取', () => {
    const batchId = 'batch-t07-flow'
    seedPublishedBatch(batchId)
    initT07MainState({ batchId, claim: { role: 'organizer' }, state: initialState(batchId) as never })
    const assigned = applyT07MainAction({
      batchId, claim: { role: 'organizer' }, expectedRevision: 1,
      action: { type: 'assign', caseId: 'case-a', reviewerId: 'local-judge-1', assignmentId: 'a1' },
    })
    expect(assigned.revision).toBe(2)

    const submitted = applyT07MainAction({
      batchId, claim: { role: 'judge', reviewerId: 'local-judge-1' }, expectedRevision: 2,
      action: {
        type: 'submit', assignmentId: 'a1', publicFeedback: '完成',
        scores: [{ dimensionId: 'quality', score: 4, na: false }, { dimensionId: 'impact', score: 5, na: false }],
      },
    })
    expect(submitted.revision).toBe(3)

    // 评委视图只含本人任务
    const judgeView = getT07View(batchId, { role: 'judge', reviewerId: 'local-judge-1' })
    expect(judgeView.view.role).toBe('judge')
    if (judgeView.view.role === 'judge') expect(judgeView.view.tasks).toHaveLength(1)

    const summary = readT07RoundSummary(batchId)
    expect(summary).toMatchObject({ round: 1, caseCount: 2, assignmentCount: 1, voted: 1, finalized: false })
  })

  test('缺评时不能定稿（沿用 T07 门控）', () => {
    const batchId = 'batch-t07-finalize'
    seedPublishedBatch(batchId)
    initT07MainState({ batchId, claim: { role: 'organizer' }, state: initialState(batchId) as never })
    applyT07MainAction({ batchId, claim: { role: 'organizer' }, expectedRevision: 1,
      action: { type: 'assign', caseId: 'case-a', reviewerId: 'local-judge-1', assignmentId: 'a1' } })
    expect(() => applyT07MainAction({
      batchId, claim: { role: 'organizer' }, expectedRevision: 2,
      action: { type: 'finalize' },
    })).toThrow()
  })
})
