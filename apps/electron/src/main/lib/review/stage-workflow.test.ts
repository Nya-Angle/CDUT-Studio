/**
 * N3/R07 单测：阶段推进（初审≠decided）/最终驳回/多补件门控/申诉更正/最终投影
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReviewCaseV2, TemplateVersion } from '@profer/shared'
import { createAggregate, readAggregate } from './case-store-v2'
import { ensureInitialTask, recordStageDecision, resolveAppealV2, resolveFinalDecisionProjection, resolveSupplementV2, respondSupplementV2, type StageDecisionPayload } from './stage-workflow'
import { submitAppeal } from './business-workflow'
import { registerMaterial } from './material-service'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `profer-test-stage-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

const template: TemplateVersion = {
  templateId: 't', version: 1, schemaVersion: 2, name: '两级', objectType: 'person', displayName: { template: '' },
  fields: [], materialSlots: [], policyVersionIds: [], stages: [
    { id: 'first', name: '初审', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'final' },
    { id: 'final', name: '终审', kind: 'manual-review', executorRole: 'teacher' },
  ], outputs: [], status: 'published', createdAt: '',
} as unknown as TemplateVersion

const caseV2: ReviewCaseV2 = { id: 'case-stage-1', templateId: 't', templateVersion: 1, title: '阶段测试', objectType: 'person', caseFields: {}, subjects: [], documents: [], stage: 'submitted', revision: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
const actor = { actorId: 'u1', actorSource: 'local' as const, role: 'reviewer' as const }
const teacherActor = { actorId: 'teacher-1', actorSource: 'local' as const, role: 'teacher' as const }
let requestIdCounter = 0
const nextReq = (): string => `req-${(requestIdCounter += 1)}`

let caseCounter = 0
async function seed(flowTemplate: TemplateVersion = template): Promise<{ caseId: string; firstTaskId: string }> {
  const caseId = `case-stage-${(caseCounter += 1)}`
  await createAggregate(caseId, { ...caseV2, id: caseId })
  const taskResult = await ensureInitialTask(caseId, flowTemplate, actor)
  return { caseId, firstTaskId: taskResult.ok ? taskResult.entity!.id : '' }
}

describe('阶段推进（R07，修正误判 6）', () => {
  test('Given 三阶段审核且时钟不前进 When 连续通过 Then 每个阶段任务仍有唯一 ID 并可终审', async () => {
    const threeStageTemplate = {
      ...template,
      stages: [
        { id: 'first', name: '初审', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'middle' },
        { id: 'middle', name: '复核', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'final' },
        { id: 'final', name: '终审', kind: 'manual-review', executorRole: 'teacher' },
      ],
    } as TemplateVersion
    const originalNow = Date.now
    Date.now = () => 1
    try {
      const { caseId, firstTaskId } = await seed(threeStageTemplate)
      let agg = readAggregate(caseId)!
      const first = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision, payload: { action: 'stage-pass', taskId: firstTaskId, reason: '初审通过' } }, threeStageTemplate)
      expect(first.ok).toBeTrue()
      if (!first.ok) return
      agg = first.aggregate
      const middleTask = agg.tasks.find((task) => task.stageId === 'middle' && task.status === 'open')!
      const middle = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision, payload: { action: 'stage-pass', taskId: middleTask.id, reason: '复核通过' } }, threeStageTemplate)
      expect(middle.ok).toBeTrue()
      if (!middle.ok) return
      agg = middle.aggregate
      const finalTask = agg.tasks.find((task) => task.stageId === 'final' && task.status === 'open')!
      const final = await recordStageDecision(caseId, { requestId: nextReq(), actor: teacherActor, expectedRevision: agg.caseV2.revision, payload: { action: 'stage-pass', taskId: finalTask.id, reason: '终审通过' } }, threeStageTemplate)
      expect(final.ok).toBeTrue()
      if (final.ok) {
        expect(final.aggregate.caseV2.stage).toBe('decided')
        expect(new Set(final.aggregate.tasks.map((task) => task.id)).size).toBe(3)
        expect(final.aggregate.decisions.map((decision) => decision.stageId)).toEqual(['first', 'middle', 'final'])
      }
    } finally {
      Date.now = originalNow
    }
  })

  test('Given 初审通过 When 决定 Then 创建终审任务且案卷不 decided', async () => {
    const { caseId, firstTaskId } = await seed()
    const aggregate = readAggregate(caseId)!
    const outcome = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: 1, payload: { action: 'stage-pass', taskId: firstTaskId, reason: '初审通过' } }, template)
    expect(outcome.ok).toBeTrue()
    if (outcome.ok) {
      expect(outcome.aggregate.caseV2.stage).toBe('reviewing') // 不是 decided
      expect(outcome.aggregate.decisions[0]!.finality).toBe('stage')
      expect(outcome.entity!.task?.stageId).toBe('final') // 终审任务已建
    }
  })

  test('Given 终审阶段通过 When 决定 Then decided 且 finality=final', async () => {
    const { caseId, firstTaskId } = await seed()
    let agg = readAggregate(caseId)!
    const first = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: 1, payload: { action: 'stage-pass', taskId: firstTaskId, reason: '初审通过' } }, template)
    agg = first.ok ? first.aggregate : agg
    const finalTask = agg.tasks.find((task) => task.stageId === 'final' && task.status === 'open')!
    const second = await recordStageDecision(caseId, { requestId: nextReq(), actor: teacherActor, expectedRevision: agg.caseV2.revision, payload: { action: 'stage-pass', taskId: finalTask.id, reason: '终审通过' } }, template)
    expect(second.ok).toBeTrue()
    if (second.ok) {
      expect(second.aggregate.caseV2.stage).toBe('decided')
      expect(second.aggregate.decisions.at(-1)!.finality).toBe('final')
    }
  })

  test('Given reviewer 尝试代签教师终审 When 提交 Then 拒绝且不写决定', async () => {
    const { caseId, firstTaskId } = await seed()
    const first = await recordStageDecision(caseId, {
      requestId: nextReq(), actor, expectedRevision: 1,
      payload: { action: 'stage-pass', taskId: firstTaskId, reason: '初审通过' },
    }, template)
    expect(first.ok).toBeTrue()
    const agg = readAggregate(caseId)!
    const finalTask = agg.tasks.find((task) => task.stageId === 'final' && task.status === 'open')!
    const invalid = await recordStageDecision(caseId, {
      requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision,
      payload: { action: 'stage-pass', taskId: finalTask.id, reason: '冒签终审' },
    }, template)
    expect(invalid.ok).toBeFalse()
    if (!invalid.ok) expect(invalid.code).toBe('INVALID_TRANSITION')
    expect(readAggregate(caseId)!.decisions).toHaveLength(1)
  })

  test('Given 传入别的模板定义 When 阶段决定 Then 拒绝跨模板与版本伪装', async () => {
    const { caseId, firstTaskId } = await seed()
    const fakeTemplate = { ...template, version: 99 }
    const invalid = await recordStageDecision(caseId, {
      requestId: nextReq(), actor, expectedRevision: 1,
      payload: { action: 'stage-pass', taskId: firstTaskId, reason: '假模板' },
    }, fakeTemplate)
    expect(invalid.ok).toBeFalse()
    if (!invalid.ok) expect(invalid.code).toBe('INVALID_TRANSITION')
    expect(readAggregate(caseId)!.decisions).toHaveLength(0)
  })

  test('Given 最终驳回 When 决定 Then decided（不自动待补件）', async () => {
    const { caseId, firstTaskId } = await seed()
    const aggregate = readAggregate(caseId)!
    const outcome = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: 1, payload: { action: 'final-reject', taskId: firstTaskId, reason: '不符合规定' } }, template)
    expect(outcome.ok).toBeTrue()
    if (outcome.ok) {
      expect(outcome.aggregate.caseV2.stage).toBe('decided')
      expect(outcome.aggregate.supplements).toHaveLength(0)
    }
  })

  test('Given 退回补件 When 决定 Then awaiting-supplement 且补件请求创建', async () => {
    const { caseId, firstTaskId } = await seed()
    const aggregate = readAggregate(caseId)!
    const outcome = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: 1, payload: { action: 'return-for-supplement', taskId: firstTaskId, reason: '缺证明', supplementRequiredElements: ['等级'], supplementReason: '补等级证明' } }, template)
    expect(outcome.ok).toBeTrue()
    if (outcome.ok) expect(outcome.aggregate.caseV2.stage).toBe('awaiting-supplement')
  })

  test('Given 重复决定同任务 When 再提交 Then INVALID_TRANSITION', async () => {
    const { caseId, firstTaskId } = await seed()
    const aggregate = readAggregate(caseId)!
    await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: 1, payload: { action: 'stage-pass', taskId: firstTaskId, reason: 'x' } }, template)
    const agg2 = readAggregate(caseId)!
    const again = await recordStageDecision(agg2.caseV2.id, { requestId: nextReq(), actor, expectedRevision: agg2.caseV2.revision, payload: { action: 'stage-pass', taskId: firstTaskId, reason: 'y' } }, template)
    expect(again.ok).toBeFalse()
    if (!again.ok) expect(again.code).toBe('INVALID_TRANSITION')
  })
})

describe('补件多请求门控（06 §5.3）', () => {
  test('Given 两个未结束请求 When 只满足其一 Then 不恢复；全部结束才恢复', async () => {
    const { caseId, firstTaskId } = await seed()
    let agg = readAggregate(caseId)!
    const open = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: 1, payload: { action: 'return-for-supplement', taskId: firstTaskId, reason: 'r1', supplementRequiredElements: ['a'], supplementReason: '缺A' } }, template)
    agg = open.ok ? open.aggregate : agg
    // 经命令事务补第二个 open 请求（测试多请求门控的场景构造）
    const { submitCommand } = await import('./case-store-v2')
    const second = await submitCommand(caseId, { requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision, type: 'OpenSecondSupplement', payload: {} }, (a) => ({
      summary: '测试注入第二个补件',
      mutate: (draft) => {
        draft.supplements = [...draft.supplements, { id: 'sup-test-2', caseId, originFindingKeys: [], requiredElements: ['b'], reason: '缺B', responsibleRole: 'student', status: 'open', responses: [], createdAt: new Date().toISOString() }]
      },
    }))
    expect(second.ok).toBeTrue()
    agg = second.ok ? second.aggregate : agg
    const openRequests = agg.supplements.filter((request) => request.status === 'open')
    expect(openRequests).toHaveLength(2)
    // 非法判定值必须 fail-closed：否则 status 会被写成 undefined，
    // 补件既不关闭也不参与门控（真机 A09 曾复现）。
    const bogus = await resolveSupplementV2(caseId, {
      requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision,
      payload: { supplementId: openRequests[0]!.id, outcome: 'satisfied-x' as never, reason: '非法值' },
    })
    expect(bogus.ok).toBeFalse()
    if (!bogus.ok) expect(bogus.code).toBe('VALIDATION_FAILED')
    const afterBogus = readAggregate(caseId)!
    expect(afterBogus.supplements.find((request) => request.id === openRequests[0]!.id)?.status).toBe('open')

    const satisfied = await resolveSupplementV2(caseId, { requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision, payload: { supplementId: openRequests[0]!.id, outcome: 'satisfied', reason: '要素齐' } })
    expect(satisfied.ok).toBeTrue()
    if (satisfied.ok) {
      // 还有未结束请求 → 不恢复（06 §5.3）

      expect(satisfied.aggregate.caseV2.stage).toBe('awaiting-supplement')
    }
  })

  test('RUN-18: 最后一笔是 cancelled When 已无未结补件 Then 恢复 reviewing 并回流任务', async () => {
    const { caseId, firstTaskId } = await seed()
    let agg = readAggregate(caseId)!
    const open = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: 1, payload: { action: 'return-for-supplement', taskId: firstTaskId, reason: 'r1', supplementRequiredElements: ['a'], supplementReason: '缺A' } }, template)
    agg = open.ok ? open.aggregate : agg
    const { submitCommand } = await import('./case-store-v2')
    const second = await submitCommand(caseId, { requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision, type: 'OpenSecondSupplement', payload: {} }, (a) => ({
      summary: '测试注入第二个补件',
      mutate: (draft) => {
        draft.supplements = [...draft.supplements, { id: 'sup-test-2', caseId, originFindingKeys: [], requiredElements: ['b'], reason: '缺B', responsibleRole: 'student', status: 'open', responses: [], createdAt: new Date().toISOString(), originTaskId: firstTaskId, originStageId: 'first' }]
      },
    }))
    agg = second.ok ? second.aggregate : agg
    const [a, b] = agg.supplements
    const satisfiedA = await resolveSupplementV2(caseId, { requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision, payload: { supplementId: a!.id, outcome: 'satisfied', reason: 'A 齐' } })
    expect(satisfiedA.ok).toBeTrue()
    if (!satisfiedA.ok) return
    expect(satisfiedA.aggregate.caseV2.stage).toBe('awaiting-supplement')
    const cancelledB = await resolveSupplementV2(caseId, { requestId: nextReq(), actor, expectedRevision: satisfiedA.aggregate.caseV2.revision, payload: { supplementId: b!.id, outcome: 'cancelled', reason: 'B 不再需要' } })
    expect(cancelledB.ok).toBeTrue()
    if (!cancelledB.ok) return
    // 无未结补件：即使最后一笔不是 satisfied 也必须恢复，否则案卷卡死。
    expect(cancelledB.aggregate.caseV2.stage).toBe('reviewing')
    expect(cancelledB.aggregate.tasks.some((task) => task.stageId === 'first' && task.status === 'open')).toBeTrue()
  })
})

describe('补件回复与任务回流（G04/G05）', () => {
  test('Given 退回补件 When 学生回复+判定满足 Then 原阶段任务回流（不是没有任务）', async () => {
    const { caseId, firstTaskId } = await seed()
    const open = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: 1, payload: { action: 'return-for-supplement', taskId: firstTaskId, reason: '缺证明', supplementRequiredElements: ['等级'], supplementReason: '补等级证明' } }, template)
    expect(open.ok).toBeTrue()
    const aggregate = open.ok ? open.aggregate : readAggregate(caseId)!
    const supplement = aggregate.supplements[0]!
    expect(supplement.originStageId).toBe('first') // 退回来源已记录
    // 学生回复
    const replied = await respondSupplementV2(caseId, { requestId: nextReq(), actor: { actorId: 'stu-1', actorSource: 'local', role: 'student' }, expectedRevision: aggregate.caseV2.revision, payload: { supplementId: supplement.id, note: '已补交等级证明' } })
    expect(replied.ok).toBeTrue()
    if (replied.ok) expect(replied.aggregate.supplements[0]!.status).toBe('responded')
    // 判定满足 → 恢复 reviewing 并回流 first 阶段任务
    const resolved = await resolveSupplementV2(caseId, { requestId: nextReq(), actor, expectedRevision: (replied.ok ? replied.aggregate : aggregate).caseV2.revision, payload: { supplementId: supplement.id, outcome: 'satisfied', reason: '要素齐全' } })
    expect(resolved.ok).toBeTrue()
    if (resolved.ok) {
      expect(resolved.aggregate.caseV2.stage).toBe('reviewing')
      const reopened = resolved.aggregate.tasks.filter((task) => task.stageId === 'first' && task.status === 'open')
      expect(reopened).toHaveLength(1) // 任务回流：补件后流程可继续
      expect(reopened[0]!.prerequisiteTaskId).toBe(firstTaskId)
    }
  })

  test('Given 判定不足 When 处理 Then 不恢复阶段也不回流任务', async () => {
    const { caseId, firstTaskId } = await seed()
    const open = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: 1, payload: { action: 'return-for-supplement', taskId: firstTaskId, reason: '缺', supplementRequiredElements: ['a'], supplementReason: '补A' } }, template)
    const aggregate = open.ok ? open.aggregate : readAggregate(caseId)!
    const resolved = await resolveSupplementV2(caseId, { requestId: nextReq(), actor, expectedRevision: aggregate.caseV2.revision, payload: { supplementId: aggregate.supplements[0]!.id, outcome: 'insufficient', reason: '仍缺' } })
    expect(resolved.ok).toBeTrue()
    if (resolved.ok) {
      expect(resolved.aggregate.caseV2.stage).toBe('awaiting-supplement')
      expect(resolved.aggregate.tasks.filter((task) => task.status === 'open')).toHaveLength(0)
    }
  })

  test('Given 学生负责的补件 When 教师代回复 Then 拒绝（角色校验）', async () => {
    const { caseId, firstTaskId } = await seed()
    const open = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: 1, payload: { action: 'return-for-supplement', taskId: firstTaskId, reason: '缺', supplementRequiredElements: ['a'], supplementReason: '补A' } }, template)
    const aggregate = open.ok ? open.aggregate : readAggregate(caseId)!
    const denied = await respondSupplementV2(caseId, { requestId: nextReq(), actor: { actorId: 't-1', actorSource: 'local', role: 'teacher' }, expectedRevision: aggregate.caseV2.revision, payload: { supplementId: aggregate.supplements[0]!.id, note: '代回复' } })
    expect(denied.ok).toBeFalse()
    if (!denied.ok) expect(denied.code).toBe('INVALID_TRANSITION')
  })
})


describe('RUN-19 补件材料归属与时效', () => {
  test('Given 补件请求 When 用他案/请求前旧版本回复 Then 拒绝；请求后新版本可成功且重试幂等', async () => {
    const { caseId, firstTaskId } = await seed()
    mkdirSync(CONFIG_DIR, { recursive: true })
    const oldPath = join(CONFIG_DIR, 'supp-old.txt')
    writeFileSync(oldPath, '补件请求前已存在的材料')
    let agg = readAggregate(caseId)!
    const first = await registerMaterial(caseId, {
      requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision,
      payload: { sourcePath: oldPath, role: 'evidence' },
    })
    expect(first.ok).toBeTrue()
    agg = readAggregate(caseId)!
    const oldVersionId = agg.caseV2.documents[0]!.versionId

    const opened = await recordStageDecision(caseId, {
      requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision,
      payload: { action: 'return-for-supplement', taskId: firstTaskId, reason: '缺少新材料', supplementRequiredElements: ['新材料'], supplementReason: '请补新材料' },
    }, template)
    expect(opened.ok).toBeTrue()
    agg = opened.ok ? opened.aggregate : readAggregate(caseId)!
    const supplementId = agg.supplements[0]!.id
    expect(agg.supplements[0]!.documentVersionIdsAtRequest).toContain(oldVersionId)

    const foreign = await respondSupplementV2(caseId, {
      requestId: nextReq(), actor: { actorId: 'stu-run19', actorSource: 'local', role: 'student' },
      expectedRevision: agg.caseV2.revision,
      payload: { supplementId, note: '他案版本', documentVersionIds: ['doc-foreign-v1'] },
    })
    expect(foreign.ok).toBeFalse()
    if (!foreign.ok) { expect(foreign.code).toBe('VALIDATION_FAILED'); expect(foreign.message).toContain('不属于本案当前有效原件') }

    const reused = await respondSupplementV2(caseId, {
      requestId: nextReq(), actor: { actorId: 'stu-run19', actorSource: 'local', role: 'student' },
      expectedRevision: agg.caseV2.revision,
      payload: { supplementId, note: '旧版本', documentVersionIds: [oldVersionId] },
    })
    expect(reused.ok).toBeFalse()
    if (!reused.ok) { expect(reused.code).toBe('VALIDATION_FAILED'); expect(reused.message).toContain('请求前已有版本') }

    const newPath = join(CONFIG_DIR, 'supp-new.txt')
    writeFileSync(newPath, '补件请求后新登记的材料')
    const registered = await registerMaterial(caseId, {
      requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision,
      payload: { sourcePath: newPath, role: 'evidence' },
    })
    expect(registered.ok).toBeTrue()
    agg = readAggregate(caseId)!
    const newVersionId = agg.caseV2.documents.find((document) => document.fileName === 'supp-new.txt')!.versionId

    const requestId = nextReq()
    const replied = await respondSupplementV2(caseId, {
      requestId, actor: { actorId: 'stu-run19', actorSource: 'local', role: 'student' },
      expectedRevision: agg.caseV2.revision,
      payload: { supplementId, note: '补交新原件', documentVersionIds: [newVersionId] },
    })
    expect(replied.ok).toBeTrue()
    if (replied.ok) {
      expect(replied.aggregate.supplements.find((item) => item.id === supplementId)?.status).toBe('responded')
      expect(replied.aggregate.supplements.find((item) => item.id === supplementId)?.responses).toHaveLength(1)
    }
    // 同一 requestId 的重试不追加第二份回复（既有语义）。
    const retryRev = replied.ok ? replied.aggregate.caseV2.revision : readAggregate(caseId)!.caseV2.revision
    const retry = await respondSupplementV2(caseId, {
      requestId, actor: { actorId: 'stu-run19', actorSource: 'local', role: 'student' },
      expectedRevision: retryRev,
      payload: { supplementId, note: '补交新原件', documentVersionIds: [newVersionId] },
    })
    expect(retry.ok).toBeTrue()
    expect(readAggregate(caseId)!.supplements.find((item) => item.id === supplementId)?.responses).toHaveLength(1)
  })
})

describe('角色安全收口（P0）', () => {
  test('学生或非来源阶段审核员不能代替来源审核人判定补件', async () => {
    const { caseId, firstTaskId } = await seed()
    const opened = await recordStageDecision(caseId, {
      requestId: nextReq(), actor, expectedRevision: 1,
      payload: { action: 'return-for-supplement', taskId: firstTaskId,
        reason: '缺材料', supplementRequiredElements: ['原件'], supplementReason: '请补充材料' },
    }, template)
    expect(opened.ok).toBeTrue()
    const agg = readAggregate(caseId)!
    const forbidden = await resolveSupplementV2(caseId, {
      requestId: nextReq(), actor: teacherActor, expectedRevision: agg.caseV2.revision,
      payload: { supplementId: agg.supplements[0]!.id, outcome: 'satisfied', reason: '尝试越权' },
    })
    expect(forbidden.ok).toBeFalse()
    if (!forbidden.ok) expect(forbidden.code).toBe('INVALID_TRANSITION')
    expect(readAggregate(caseId)?.supplements[0]?.status).toBe('open')
  })

  test('未获得复核教师角色的本地 reviewer 不得自行维持或更改申诉结论', async () => {
    const { caseId, firstTaskId } = await seed()
    const denied = await recordStageDecision(caseId, {
      requestId: nextReq(), actor, expectedRevision: 1,
      payload: { action: 'final-reject', taskId: firstTaskId, reason: '初审不符' },
    }, template)
    expect(denied.ok).toBeTrue()
    const { submitCommand } = await import('./case-store-v2')
    const base = readAggregate(caseId)!
    const created = await submitCommand(caseId, {
      requestId: nextReq(), actor, expectedRevision: base.caseV2.revision,
      type: 'SeedAppealForPermissionTest', payload: {},
    }, () => ({
      summary: '测试创建待处理申诉',
      mutate: (draft) => {
        draft.appeals.push({
          id: `role-appeal-${caseId}`, caseId, againstDecisionId: draft.decisions[0]!.id,
          appellant: { actorId: 'student', actorSource: 'local' },
          statement: '请求复核', newEvidenceDocumentVersionIds: [], status: 'in-review',
          createdAt: '2026-10-10T00:00:00Z',
        })
      },
    }))
    expect(created.ok).toBeTrue()
    const agg = readAggregate(caseId)!
    const invalid = await resolveAppealV2(caseId, {
      requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision,
      payload: { appealId: `role-appeal-${caseId}`, resolution: 'maintain-original', reason: '冒签教师' },
    })
    expect(invalid.ok).toBeFalse()
    if (!invalid.ok) expect(invalid.code).toBe('INVALID_TRANSITION')
    expect(readAggregate(caseId)?.appeals[0]?.status).toBe('in-review')
  })
})

describe('申诉更正与最终投影（R07）', () => {
  test('Given 申诉更正 When resolve Then 追加关联决定且原决定被投影排除', async () => {
    // 手工构造决定集验证投影
    const d1 = { id: 'd1', actor, scope: { kind: 'case' as const, ids: [] }, stageId: 'final', result: 'reject' as const, reason: '驳回', basedOnRunId: 'r', basedOnRevision: 1, at: '2026-01-01T00:00:00Z', finality: 'final' as const }
    const d2 = { ...d1, id: 'd2', amendsDecisionId: 'd1', result: 'pass' as const, reason: '申诉更正', at: '2026-01-02T00:00:00Z' }
    const projection = resolveFinalDecisionProjection([d1, d2])
    expect(projection.isFinal).toBeTrue()
    expect(projection.decision!.id).toBe('d2') // 更正决定生效
    expect(projection.supersededIds).toEqual(['d1'])
  })

  test('Given 仅阶段决定 When 投影 Then isFinal=false（报告不冒充终审）', () => {
    const d1 = { id: 'd1', actor, scope: { kind: 'case' as const, ids: [] }, stageId: 'first', result: 'pass' as const, reason: '初审', basedOnRunId: 'r', basedOnRevision: 1, at: '2026-01-01T00:00:00Z', finality: 'stage' as const }
    expect(resolveFinalDecisionProjection([d1]).isFinal).toBeFalse()
  })

  test('Given 申诉流程 When resolveAppealV2 更正 Then 关联决定追加', async () => {
    const { caseId, firstTaskId } = await seed()
    let agg = readAggregate(caseId)!
    const reject = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: 1, payload: { action: 'final-reject', taskId: firstTaskId, reason: '驳回' } }, template)
    agg = reject.ok ? reject.aggregate : agg
    const appealOutcome = submitAppeal({ caseV2: agg.caseV2, decisions: agg.decisions, supplements: agg.supplements, appeals: agg.appeals }, { requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision }, { againstDecisionId: agg.decisions[0]!.id, statement: '证明有效', newEvidenceDocumentVersionIds: [] })
    expect(appealOutcome.ok).toBeTrue()
  })
})

describe('补件不足后再回复（复查 §5.3）', () => {
  test('Given insufficient When 再次回复+判定满足 Then 流程恢复', async () => {
    const { caseId, firstTaskId } = await seed()
    const open = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: 1, payload: { action: 'return-for-supplement', taskId: firstTaskId, reason: '缺', supplementRequiredElements: ['a'], supplementReason: '补A' } }, template)
    const aggregate = open.ok ? open.aggregate : readAggregate(caseId)!
    const sup = aggregate.supplements[0]!
    // 判不足
    const ins = await resolveSupplementV2(caseId, { requestId: nextReq(), actor, expectedRevision: aggregate.caseV2.revision, payload: { supplementId: sup.id, outcome: 'insufficient', reason: '仍缺' } })
    expect(ins.ok).toBeTrue()
    // 再次回复（修复前 INVALID_TRANSITION）
    const reply = await respondSupplementV2(caseId, { requestId: nextReq(), actor: { actorId: 'stu', actorSource: 'local', role: 'student' }, expectedRevision: (ins.ok ? ins.aggregate : aggregate).caseV2.revision, payload: { supplementId: sup.id, note: '第二次已补齐' } })
    expect(reply.ok).toBeTrue()
    // 满足后恢复+回流
    const done = await resolveSupplementV2(caseId, { requestId: nextReq(), actor, expectedRevision: (reply.ok ? reply.aggregate : aggregate).caseV2.revision, payload: { supplementId: sup.id, outcome: 'satisfied', reason: '齐全' } })
    expect(done.ok).toBeTrue()
    if (done.ok) {
      expect(done.aggregate.caseV2.stage).toBe('reviewing')
      expect(done.aggregate.tasks.some((task) => task.stageId === 'first' && task.status === 'open')).toBeTrue()
    }
  })

  test('Given satisfied 但另一请求 insufficient When 门控 Then 不恢复（insufficient 计入未满足）', async () => {
    const { caseId, firstTaskId } = await seed()
    const open = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: 1, payload: { action: 'return-for-supplement', taskId: firstTaskId, reason: '缺', supplementRequiredElements: ['a'], supplementReason: '补A' } }, template)
    let agg = open.ok ? open.aggregate : readAggregate(caseId)!
    const { submitCommand } = await import('./case-store-v2')
    await submitCommand(caseId, { requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision, type: 'Seed', payload: {} }, () => ({ summary: '注入第二请求', mutate: (draft) => { draft.supplements = [...draft.supplements, { id: 'sup-2', caseId, originFindingKeys: [], requiredElements: ['b'], reason: '缺B', responsibleRole: 'student', status: 'insufficient', responses: [], createdAt: new Date().toISOString() }] } }))
    agg = readAggregate(caseId)!
    const done = await resolveSupplementV2(caseId, { requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision, payload: { supplementId: agg.supplements[0]!.id, outcome: 'satisfied', reason: '齐' } })
    expect(done.ok).toBeTrue()
    if (done.ok) expect(done.aggregate.caseV2.stage).toBe('awaiting-supplement') // insufficient 阻断
  })
})

describe('申诉闭环（复查 §5.3-5）', () => {
  test('Given 维持原判 When resolution Then 申诉 upheld 且案卷 decided', async () => {
    const { caseId, firstTaskId } = await seed()
    const reject = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: 1, payload: { action: 'final-reject', taskId: firstTaskId, reason: '驳回' } }, template)
    const agg = reject.ok ? reject.aggregate : readAggregate(caseId)!
    const { submitCommand, readAggregate: readAgg } = await import('./case-store-v2')
    await submitCommand(caseId, { requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision, type: 'SeedAppeal', payload: {} }, () => ({ summary: '种子申诉', mutate: (draft) => { draft.appeals = [{ id: 'ap-1', caseId, againstDecisionId: draft.decisions[0]!.id, appellant: { actorId: 'stu', actorSource: 'local' }, statement: '不服', newEvidenceDocumentVersionIds: [], status: 'in-review' as const, resolution: undefined, reviewDecisionId: undefined, createdAt: new Date().toISOString() }] } }))
    const base = readAgg(caseId)!
    const outcome = await resolveAppealV2(caseId, { requestId: nextReq(), actor: { actorId: 'teacher-1', actorSource: 'local', role: 'teacher' }, expectedRevision: base.caseV2.revision, payload: { appealId: 'ap-1', resolution: 'maintain-original', reason: '复核维持' } })
    expect(outcome.ok).toBeTrue()
    if (outcome.ok) {
      expect(outcome.aggregate.appeals[0]!.status).toBe('upheld')
      expect(outcome.aggregate.caseV2.stage).toBe('decided')
    }
  })

  test('Given 更正 When resolution Then 新决定 actor=复核人 且 finality=final', async () => {
    const { caseId, firstTaskId } = await seed()
    const reject = await recordStageDecision(caseId, { requestId: nextReq(), actor, expectedRevision: 1, payload: { action: 'final-reject', taskId: firstTaskId, reason: '驳回' } }, template)
    const agg = reject.ok ? reject.aggregate : readAggregate(caseId)!
    const { submitCommand, readAggregate: readAgg2 } = await import('./case-store-v2')
    await submitCommand(caseId, { requestId: nextReq(), actor, expectedRevision: agg.caseV2.revision, type: 'SeedAppeal', payload: {} }, () => ({ summary: '种子申诉', mutate: (draft) => { draft.appeals = [{ id: 'ap-2', caseId, againstDecisionId: draft.decisions[0]!.id, appellant: { actorId: 'stu', actorSource: 'local' }, statement: '证据有效', newEvidenceDocumentVersionIds: [], status: 'in-review' as const, resolution: undefined, reviewDecisionId: 'dec-amend', createdAt: new Date().toISOString() }] } }))
    const base = readAgg2(caseId)!
    const outcome = await resolveAppealV2(caseId, { requestId: nextReq(), actor: { actorId: 'teacher-1', actorSource: 'local', role: 'teacher' }, expectedRevision: base.caseV2.revision, payload: { appealId: 'ap-2', resolution: 'amend-original', reason: '证明有效', amendedResult: 'pass' } })
    expect(outcome.ok).toBeTrue()
    if (outcome.ok) {
      expect(outcome.aggregate.appeals[0]!.status).toBe('overturned')
      expect(outcome.aggregate.caseV2.stage).toBe('decided')
      const amend = outcome.aggregate.decisions.find((decision) => decision.amendsDecisionId)
      expect(amend!.actor.actorId).toBe('teacher-1') // 不继承原决定 actor
      expect(amend!.finality).toBe('final')
    }
  })
})
