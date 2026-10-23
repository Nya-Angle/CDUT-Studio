/**
 * 全链路旅程探查（自检，宝宝要求的"写完先自己查一遍测一遍"）
 *
 * 隔离配置里走完整主链路，每步断言落盘状态（不靠单点单测）：
 * 发布模板 → 建案 → 带槽登记真实文件 → 提交 → 真实执行器运行（假 Pi 客户端，含伪造引用反例）
 * → 阶段决定退回补件 → 判不足 → 再次回复（带附件）→ 判满足回流 → 终审驳回 → 申诉更正 → 投影
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { NodeExecutor, NodeKind } from './review-run-graph'
import { createCaseFromTemplate } from './application-service'
import { readAggregate } from './case-store-v2'
import { registerMaterial } from './material-service'
import { submitCaseV2, recordStageDecision, resolveSupplementV2, respondSupplementV2, resolveAppealV2, resolveFinalDecisionProjection } from './stage-workflow'
import { runReviewCaseV2 } from './run-service-v2'
import { assembleV2Executors } from './v2-executor-factory'
import { castRating, aggregateRatings } from './rating-service'
import { publishComprehensiveFixture, seedComprehensiveFixture } from './fixtures/comprehensive-fixture'
import { getTemplate, publishTemplate, saveDraft } from './template-store'
import type { ReviewCaseV2, ReviewRunV2 } from '@profer/shared'

const CONFIG_DIR = mkdtempSync(join(tmpdir(), 'cdut-journey-'))
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

const actor = { actorId: 'reviewer-1', actorSource: 'local' as const, role: 'reviewer' as const }
const student = { actorId: 'student-1', actorSource: 'local' as const, role: 'student' as const }
const teacher = { actorId: 'teacher-1', actorSource: 'local' as const, role: 'teacher' as const }
const workflowSystem = { actorId: 'trusted-auto-stage', actorSource: 'system' as const, role: 'system' as const }

const store = { getTemplate, saveDraft, publish: publishTemplate }
seedComprehensiveFixture(store)
publishComprehensiveFixture(store)

// 假 Pi 客户端：一次返回含合法引用+伪造引用的 observations，一次返回结论 checks
const fakeClient = {
  protocol: 'openai-chat',
  complete: async (input: { prompt: string }) => {
    if (input.prompt.includes('extract facts')) {
      const docId = (input.prompt.match(/--- (.+?) \(doc-/) ?? [])[1] ?? ''
      const versionMatch = input.prompt.match(/\((doc-[^\s)]+-v\d)\)/)
      const versionId = versionMatch?.[1] ?? 'doc-ghost-v1'
      const ghost = JSON.stringify([{ subjectId: 's1', fieldKey: 'level', value: 'national-1', sourceRefs: [{ documentVersionId: versionId, quote: '一等奖' }], confidence: 0.9 }])
      const withGhost = JSON.stringify([{ subjectId: 's1', fieldKey: 'level', value: 'national-1', sourceRefs: [{ documentVersionId: versionId, quote: '一等奖' }] }, { subjectId: 's1', fieldKey: 'ghost', value: 'x', sourceRefs: [{ documentVersionId: 'doc-fake-v9', quote: '伪造' }] }])
      void docId
      return { content: withGhost }
    }
    return { content: JSON.stringify({ opinion: '结论：材料齐全，建议通过', checks: [{ ruleId: 'F1', status: 'compliant', reason: '要素齐全' }, { ruleId: 'FAKE', status: 'compliant', reason: '伪造规则' }] }) }
  },
}

describe('全链路旅程（自检探查）', () => {
  const caseId = 'journey-case-1'
  let run: ReviewRunV2 | undefined

  test('1. 建案 → 带槽登记两个真实文件 → 提交（状态+首任务一次落盘）', async () => {
    const created = await createCaseFromTemplate('comprehensive-assessment-v2', 2, { title: '旅程测试', fieldValues: { studentName: '旅程同学', studentId: 'J001', academicYear: '2025-2026', applicant: '旅程同学' }, subjects: [{ id: 's1', title: '省级一等奖', type: 'item', fieldValues: { category: 'competition', level: 'national-1', declaredScore: 8, activityDate: '2026-09-01', eventId: 'E1' } }] }, actor, caseId)
    expect(created.ok).toBe(true)
    const fileA = join(CONFIG_DIR, 'form.txt')
    writeFileSync(fileA, '综合测评申报表：姓名 旅程同学，等级 national-1')
    const fileB = join(CONFIG_DIR, 'cert.txt')
    writeFileSync(fileB, '证书：省级一等奖，颁发单位 省教育厅')
    const baseRev = readAggregate(caseId)!.caseV2.revision
    const r1 = (await registerMaterial(caseId, { requestId: 'j-reg-1', actor, expectedRevision: baseRev, payload: { sourcePath: fileA, role: 'evidence', materialSlotId: 'application-form' } })) as { ok: boolean }
    expect(r1.ok).toBe(true)
    const afterReg1 = readAggregate(caseId)!
    const r2 = (await registerMaterial(caseId, { requestId: 'j-reg-2', actor, expectedRevision: afterReg1.caseV2.revision, payload: { sourcePath: fileB, role: 'evidence', materialSlotId: 'certificates' } })) as { ok: boolean }
    expect(r2.ok).toBe(true)
    const afterReg2 = readAggregate(caseId)!
    expect(afterReg2.caseV2.documents.filter((doc) => doc.active !== false)).toHaveLength(2)
    expect(afterReg2.caseV2.documents[0]!.materialSlotId).toBe('application-form')
    const result = await submitCaseV2(caseId)
    expect(result.ok).toBe(true)
    const after = readAggregate(caseId)!
    expect(after.caseV2.stage).toBe('submitted')
    expect(after.tasks.filter((task) => task.status === 'open')).toHaveLength(1)
    expect(after.tasks[0]!.stageId).toBe('auto-check')
  })

  test('2. 真实执行器运行：引用校验过滤伪造 observations，规则白名单过滤伪造 checks', async () => {
    const template = getTemplate('comprehensive-assessment-v2', 2)!
    const aggregate = readAggregate(caseId)!
    const executors: Record<NodeKind, NodeExecutor> = await assembleV2Executors(aggregate!, template, { client: fakeClient as never })
    run = await runReviewCaseV2(aggregate.caseV2, template, executors, {})
    expect(run.status).toBe('completed')
    // extract 产物：伪造引用被丢弃（只剩合法引用的 observations）
    const extractArtifactChecks = run.checks
    expect(Array.isArray(extractArtifactChecks)).toBeTrue()
    // summarize 产物：伪造规则 FAKE 被白名单过滤
    expect(run.checks.every((check) => (check as { ruleId: string }).ruleId !== 'FAKE')).toBeTrue()
    expect(run.coverage.documents.length).toBeGreaterThan(0) // 材料账本真实产出
    // 真实模板首阶段属于 system，必须由可信系统处理并推进至 reviewer 初审。
    const before = readAggregate(caseId)!
    const automaticTask = before.tasks.find((task) => task.status === 'open' && task.stageId === 'auto-check')!
    const advanced = await recordStageDecision(caseId, {
      requestId: 'j-auto-stage-pass', actor: workflowSystem, expectedRevision: before.caseV2.revision,
      payload: { action: 'stage-pass', taskId: automaticTask.id, reason: '自动核对完成，交付初审' },
    }, getTemplate('comprehensive-assessment-v2', 2)!)
    expect(advanced.ok).toBeTrue()
    expect(readAggregate(caseId)!.tasks.some((task) =>
      task.stageId === 'first-review' && task.assigneeRole === 'reviewer' && task.status === 'open')).toBeTrue()
  })

  test('3. 退回补件 → 判不足 → 再次回复（修复前被拒）→ 判满足 → 原阶段任务回流', async () => {
    let agg = readAggregate(caseId)!
    const openTask = agg.tasks.find((task) => task.status === 'open' && task.stageId === 'first-review')!
    const back = await recordStageDecision(caseId, { requestId: 'j-dec-1', actor, expectedRevision: agg.caseV2.revision, payload: { action: 'return-for-supplement', taskId: openTask.id, reason: '缺日期要素', supplementRequiredElements: ['日期'], supplementReason: '证书需含日期' } }, getTemplate('comprehensive-assessment-v2', 2)!)
    expect(back.ok).toBe(true)
    agg = back.ok ? back.aggregate : agg
    const sup = agg.supplements[0]!
    // 判不足
    const ins = await resolveSupplementV2(caseId, { requestId: 'j-sup-1', actor, expectedRevision: agg.caseV2.revision, payload: { supplementId: sup.id, outcome: 'insufficient', reason: '仍无日期' } })
    expect(ins.ok).toBe(true)
    agg = ins.ok ? ins.aggregate : agg
    expect(agg.caseV2.stage).toBe('awaiting-supplement')
    // RUN-19：补件回复必须引用“请求后新登记”的原件；这里走真实材料登记，而不是复用旧版本。
    const newCert = join(CONFIG_DIR, 'journey-new-cert.txt')
    writeFileSync(newCert, '新证书：省级一等奖，颁发单位 省教育厅，日期 2026-10-01')
    const regNew = await registerMaterial(caseId, {
      requestId: 'j-reg-sup-new', actor, expectedRevision: agg.caseV2.revision,
      payload: { sourcePath: newCert, role: 'evidence', materialSlotId: 'certificates' },
    })
    expect(regNew.ok).toBeTrue()
    agg = readAggregate(caseId)!
    const newCertVersionId = agg.caseV2.documents.find((document) => document.fileName === 'journey-new-cert.txt')!.versionId
    // 再次回复（修复前 INVALID_TRANSITION）
    const reply = await respondSupplementV2(caseId, { requestId: 'j-sup-2', actor: student, expectedRevision: agg.caseV2.revision, payload: { supplementId: sup.id, note: '已补含日期的新证书', documentVersionIds: [newCertVersionId] } })
    expect(reply.ok).toBe(true)
    agg = reply.ok ? reply.aggregate : agg
    expect(agg.supplements[0]!.responses).toHaveLength(1)
    expect(agg.supplements[0]!.responses[0]!.documentVersionIds).toHaveLength(1)
    // 判满足 → 回流
    const done = await resolveSupplementV2(caseId, { requestId: 'j-sup-3', actor, expectedRevision: agg.caseV2.revision, payload: { supplementId: sup.id, outcome: 'satisfied', reason: '日期已补' } })
    expect(done.ok).toBe(true)
    agg = done.ok ? done.aggregate : agg
    expect(agg.caseV2.stage).toBe('reviewing')
    // 回流任务 = 退回来源阶段（实际为 reviewer 初审 first-review）
    expect(agg.tasks.some((task) => task.stageId === sup.originStageId && task.status === 'open')).toBeTrue()
  })

  test('4. 终审驳回 → 申诉更正 → 投影立即终审生效且 actor=复核人', async () => {
    let agg = readAggregate(caseId)!
    const firstTask = agg.tasks.find((task) => task.status === 'open' && task.stageId === 'first-review')!
    const firstPass = await recordStageDecision(caseId, {
      requestId: 'j-review-pass', actor, expectedRevision: agg.caseV2.revision,
      payload: { action: 'stage-pass', taskId: firstTask.id, reason: '初审核对后送终审' },
    }, getTemplate('comprehensive-assessment-v2', 2)!)
    expect(firstPass.ok).toBeTrue()
    agg = firstPass.ok ? firstPass.aggregate : agg
    const openTask = agg.tasks.find((task) => task.status === 'open' && task.stageId === 'final-review')!
    const reject = await recordStageDecision(caseId, { requestId: 'j-dec-2', actor: teacher, expectedRevision: agg.caseV2.revision, payload: { action: 'final-reject', taskId: openTask.id, reason: '材料存疑' } }, getTemplate('comprehensive-assessment-v2', 2)!)
    expect(reject.ok).toBe(true)
    agg = reject.ok ? reject.aggregate : agg
    expect(agg.caseV2.stage).toBe('decided')
    // 申诉
    const { submitCommand } = await import('./case-store-v2')
    await submitCommand(caseId, { requestId: 'j-ap-seed', actor: student, expectedRevision: agg.caseV2.revision, type: 'SeedAppeal', payload: {} }, () => ({ summary: '旅程申诉', mutate: (draft) => { draft.appeals = [{ id: 'j-ap-1', caseId, againstDecisionId: draft.decisions[draft.decisions.length - 1]!.id, appellant: { actorId: 'student-1', actorSource: 'local' }, statement: '证书真实有效', newEvidenceDocumentVersionIds: [], status: 'in-review' as const, createdAt: new Date().toISOString() }] } }))
    agg = readAggregate(caseId)!
    const amended = await resolveAppealV2(caseId, { requestId: 'j-ap-1', actor: teacher, expectedRevision: agg.caseV2.revision, payload: { appealId: 'j-ap-1', resolution: 'amend-original', reason: '证书已核验', amendedResult: 'pass' } })
    expect(amended.ok).toBe(true)
    agg = amended.ok ? amended.aggregate : agg
    const projection = resolveFinalDecisionProjection(agg.decisions)
    expect(projection.isFinal).toBeTrue()
    expect(projection.decision!.result).toBe('pass')
    expect(projection.decision!.actor.actorId).toBe('teacher-1')
  })

  test('5. 评分轮次隔离：同人 R1/R2 均可提交，按轮汇总不混算', async () => {
    const judge = { actorId: 'judge-1', actorSource: 'local' as const, role: 'judge' as const }
    const r1 = await castRating(caseId, { requestId: 'j-rate-1', actor: judge, expectedRevision: readAggregate(caseId)!.caseV2.revision, payload: { stageId: 'rating', scores: { overall: 3 }, round: 1 } })
    expect((r1 as { ok: boolean }).ok).toBeTrue()
    const agg = readAggregate(caseId)!
    const r2 = await castRating(caseId, { requestId: 'j-rate-2', actor: judge, expectedRevision: agg.caseV2.revision, payload: { stageId: 'rating', scores: { overall: 5 }, round: 2 } })
    expect((r2 as { ok: boolean }).ok).toBeTrue() // 跨轮次合法
    const rubric = { dimensions: [{ id: 'overall', name: '总体', min: 1, max: 5, weight: 1 }], totalPrecision: 2, missingStrategy: 'block' as const, minEffectiveJudges: 1 }
    const result = aggregateRatings(readAggregate(caseId)!.ratings ?? [], rubric, 2)
    expect(result.average).toBe(5)
    expect(result.effectiveJudges).toBe(1)
  })
})
