/**
 * R01 D2/D3：可信业务模式解析与按动作适格判定。
 *
 * 这些是架构裁决的直接反证：
 * - CanonicalPlan 不再因为「有计划」就被判技术预审，但也没有自动业务许可；
 * - D2 技术预审永远不能形成正式业务决定；
 * - 非合规项不能靠 Run completed 直接 stage-pass；
 * - 计划覆盖不足、执行失败、未执行都阻断通过，但允许退回/拒绝。
 */
import { afterAll, beforeEach, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  resolveT05BusinessMode, t05ActionEligibility, recordT05LocalBusinessConfirmation,
  readT05LocalBusinessConfirmation,
} from './review-v3-t05-main-service'
import type { CaseAggregateV2, ReviewCaseV2, ReviewRunV2 } from '@profer/shared'
import { readAggregate, writeAggregate } from './case-store-v2'
import { saveRunV2 } from './run-store-v2'
import { computeRunInputHash } from './run-service-v2'

// D3 要求 Run 必须在 RunStore 可查，因此测试持久化真实 Run 而不是内存对象
const configDir = mkdtempSync(join(tmpdir(), 't05arch-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

let runSeq = 0

/** 案卷夹具：保持真实类型，避免 `as never` 造成属性访问不可检查。 */
function caseFixture(): ReviewCaseV2 {
  return {
    id: 'case-arch', revision: 5, templateId: 'tpl-arch', templateVersion: 1,
    stage: 'submitted', documents: [], caseFields: {}, subjects: [],
  } as unknown as ReviewCaseV2
}

function aggregate(overrides: Record<string, unknown> = {}): CaseAggregateV2 {
  return {
    caseV2: caseFixture(),
    tasks: [], decisions: [], supplements: [], dispositions: [], receiptLog: [],
    observations: [], evidenceLinks: [],
    ...overrides,
  } as unknown as CaseAggregateV2
}

function run(checks: Array<Record<string, unknown>>, extra: Record<string, unknown> = {}) {
  runSeq += 1
  const caseV2 = aggregate().caseV2
  // 输入哈希必须与案卷当前快照一致，否则该 Run 按 D3 就是过期运行
  const realHash = computeRunInputHash(caseV2, [], [])
  const value = {
    id: `run-arch-${runSeq}`, caseId: 'case-arch', templateId: 'tpl-arch', templateVersion: 1,
    status: 'completed', createdAt: '', completedAt: '',
    inputManifest: { hash: realHash, templateVersion: 1, policyVersions: [], documentVersions: [],
      observationIds: [], evidenceLinkIds: [] },
    checkpoints: [], artifacts: [], opinions: [],
    checks,
    // 真实 Run 必须有非零冻结计划；仅一个 checks[] 不能构成业务放行依据。
    coverage: { plannedChecks: checks.length, completedChecks: checks.length, pendingChecks: 0, documents: [] },
    ...extra,
  } as unknown as ReviewRunV2
  saveRunV2(value)
  return value
}

describe('D2 可信业务模式', () => {
  beforeEach(() => writeAggregate(aggregate({ canonicalPlan: {
    fingerprint: 'fp-1', planId: 'p', templateId: 'tpl-arch', templateVersion: '1',
  } })))

  const confirm = () => recordT05LocalBusinessConfirmation('case-arch', {
    requestId: 't05-confirm-1', expectedRevision: 5,
    actor: { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' },
    payload: { planFingerprint: 'fp-1', reason: '本地审核员明确确认试办发布' },
  }, () => {})

  test('无计划：模板绑定的本地业务案卷可办理阶段', () => {
    expect(resolveT05BusinessMode(aggregate())).toMatchObject({ mode: 'local-business' })
  })

  test('D2 技术预审：即便有其他结构也不具备业务决定权', () => {
    const result = resolveT05BusinessMode(aggregate({ d2RuntimePlan: { id: 'd2' } }))
    expect(result.mode).toBe('technical-pre-review')
  })

  test('归档案卷即使仍有历史确认也不能恢复业务决定资格', () => {
    const snapshot = aggregate({
      caseV2: { ...caseFixture(), stage: 'archived' },
      localBusinessConfirmation: {
        caseId: 'case-arch', planFingerprint: 'fp-1', templateId: 'tpl-arch',
        templateVersion: 1, confirmedBy: 'local-organizer',
        confirmedAt: new Date().toISOString(), reason: '历史确认',
      },
    })
    expect(resolveT05BusinessMode(snapshot).mode).toBe('technical-pre-review')
  })

  test('CanonicalPlan 未经 Main 确认时按技术预审处理（fail closed）', () => {
    const result = resolveT05BusinessMode(aggregate({
      canonicalPlan: { fingerprint: 'fp-1', planId: 'p' },
    }))
    expect(result.mode).toBe('technical-pre-review')
    expect(result.reason).toContain('尚未经 Main 确认')
  })

  test('Main 确认同 Case CAS 落盘，冷读后仍有效且 requestId 重放不新增回执', async () => {
    const command = {
      requestId: 't05-confirm-1', expectedRevision: 5,
      actor: { actorId: 'local-reviewer', actorSource: 'local' as const, role: 'reviewer' as const },
      payload: { planFingerprint: 'fp-1', reason: '本地审核员明确确认试办发布' },
    }
    const confirmed = await recordT05LocalBusinessConfirmation('case-arch', command, () => {
      // 实机由可信 Main 的 Owner/物理确认端口核验，此处仅测试事务持久化。
    })
    expect(confirmed.ok).toBe(true)
    const recovered = readAggregate('case-arch')!
    expect(readT05LocalBusinessConfirmation('case-arch')).toMatchObject({
      caseId: 'case-arch', planFingerprint: 'fp-1', confirmedBy: 'local-organizer',
    })
    expect(resolveT05BusinessMode(recovered).mode).toBe('local-business')
    const replay = await recordT05LocalBusinessConfirmation('case-arch', command, () => {})
    expect(replay.ok).toBe(true)
    expect(readAggregate('case-arch')?.caseV2.revision).toBe(6)
    expect(readAggregate('case-arch')?.receiptLog).toHaveLength(1)
  })

  test('计划升版后旧确认不能继承业务权限，不能由伪教师身份重新确认', async () => {
    expect((await confirm()).ok).toBe(true)
    const old = readAggregate('case-arch')!
    const result = resolveT05BusinessMode({ ...old, canonicalPlan: {
      ...old.canonicalPlan!, fingerprint: 'fp-2', planId: 'p2',
    } })
    expect(result.mode).toBe('technical-pre-review')
    expect(result.reason).toContain('指纹')
    const rejected = await recordT05LocalBusinessConfirmation('case-arch', {
      requestId: 't05-teacher-forged', expectedRevision: old.caseV2.revision,
      actor: { actorId: 'local-teacher', actorSource: 'local', role: 'teacher' },
      payload: { planFingerprint: 'fp-1', reason: '直接提升权限' },
    }, () => {})
    expect(rejected.ok).toBe(false)
    expect(readAggregate('case-arch')?.receiptLog).toHaveLength(1)
  })

  test('没有可信现场确认端口及错误指纹时不允许持久授权', async () => {
    expect((await confirm()).ok).toBe(true)
    expect(() => recordT05LocalBusinessConfirmation('case-arch', {
      requestId: 'no-witness', expectedRevision: 6,
      actor: { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' },
      payload: { planFingerprint: 'fp-1', reason: '未核验' },
    }, undefined as never)).toThrow('可信 Main')
    const denied = await recordT05LocalBusinessConfirmation('case-arch', {
      requestId: 'wrong-fingerprint', expectedRevision: 6,
      actor: { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' },
      payload: { planFingerprint: 'fp-2', reason: '企图绑定另一计划' },
    }, () => {})
    expect(denied.ok).toBe(false)
    expect(readAggregate('case-arch')?.receiptLog).toHaveLength(1)
  })
})

describe('D3 按动作适格判定', () => {
  test('无有效 Run：只能补件，不能通过也不能拒绝', () => {
    const e = t05ActionEligibility(aggregate(), undefined)
    expect(e.allowed['stage-pass']).toBe(false)
    expect(e.allowed['final-reject']).toBe(false)
    expect(e.allowed['return-for-supplement']).toBe(true)
    expect(e.blockers.join()).toContain('有效审核运行')
  })

  test('全部合规且覆盖完整：允许通过、拒绝与退回', () => {
    const e = t05ActionEligibility(aggregate(), run([{ checkId: 'c1', ruleId: 'r1', status: 'compliant' }]))
    expect(e.readiness).toBe('ready')
    expect(e.allowed['stage-pass']).toBe(true)
    expect(e.allowed['final-reject']).toBe(true)
    expect(e.allowed['return-to-previous-stage']).toBe(true)
  })

  test('重复 checkId 即使列表长度等于计划数量，也不能冒充独立检查后阶段通过', () => {
    const duplicated = run([
      { checkId: 'same-check', ruleId: 'r1', status: 'compliant' },
      { checkId: 'same-check', ruleId: 'r1', status: 'compliant' },
    ])
    const eligibility = t05ActionEligibility(aggregate(), duplicated)
    expect(eligibility.allowed['stage-pass']).toBe(false)
    expect(eligibility.blockers.join()).toContain('重复的 checkId')
    expect(eligibility.allowed['final-reject']).toBe(true)
  })

  test('Run 仍为部分完成或覆盖账本未完成时，不允许靠全合规数组通过', () => {
    const check = [{ checkId: 'c1', ruleId: 'r1', status: 'compliant' }]
    const partiallyCompleted = run(check, { status: 'partially-completed' })
    const partial = t05ActionEligibility(aggregate(), partiallyCompleted)
    expect(partial.allowed['stage-pass']).toBe(false)
    expect(partial.blockers.join()).toContain('尚未完整结束')
    expect(partial.allowed['final-reject']).toBe(true)

    const misleadingCoverage = run(check, {
      coverage: { plannedChecks: 1, completedChecks: 0, pendingChecks: 1, documents: [] },
    })
    const mismatch = t05ActionEligibility(aggregate(), misleadingCoverage)
    expect(mismatch.allowed['stage-pass']).toBe(false)
    expect(mismatch.blockers.join()).toContain('检查账本尚未完整覆盖')
  })

  test('伪造规则的额外检查与全部不适用不得冒充有效通过结果', () => {
    const original = run([
      { checkId: 'valid-1', ruleId: 'r1', status: 'compliant' },
      { checkId: 'fake-2', ruleId: 'FAKE', status: 'compliant' },
    ], { inputManifest: {
      hash: computeRunInputHash(aggregate().caseV2, [], []), templateVersion: 1,
      policyVersions: [], documentVersions: [], observationIds: [], evidenceLinkIds: [],
      effectiveRuleIds: ['r1'],
    } })
    const withUnknown = t05ActionEligibility(aggregate(), original)
    expect(withUnknown.allowed['stage-pass']).toBe(false)
    expect(withUnknown.blockers.join()).toContain('不属于当前 Run 冻结的有效规则集')

    const noApplicable = t05ActionEligibility(aggregate(), run([
      { checkId: 'not-applicable', ruleId: 'r1', status: 'not-applicable' },
    ]))
    expect(noApplicable.allowed['stage-pass']).toBe(false)
    expect(noApplicable.blockers.join()).toContain('全部不适用')
  })

  test('21 人超限（non-compliant）不能仅凭 Run completed 通过', () => {
    const e = t05ActionEligibility(aggregate(), run([{ checkId: 'headcount', ruleId: 'r1', status: 'non-compliant' }]))
    expect(e.readiness).toBe('blocked')
    expect(e.nonCompliant).toContain('headcount')
    expect(e.allowed['stage-pass']).toBe(false)
    // 但拒绝与退回仍合法
    expect(e.allowed['final-reject']).toBe(true)
    expect(e.allowed['return-for-supplement']).toBe(true)
  })

  test('具名例外（waived）后非合规项不再阻断通过', () => {
    const persisted = run([{ checkId: 'headcount', ruleId: 'r1', status: 'non-compliant' }])
    const e = t05ActionEligibility(
      aggregate({ dispositions: [{ findingKey: 'headcount', disposition: 'waived', actor: 'local-reviewer', reason: '具名例外', at: '', runId: persisted.id, inputHash: persisted.inputManifest.hash }] }),
      persisted)
    expect(e.readiness).toBe('ready')
    expect(e.allowed['stage-pass']).toBe(true)
  })

  test('旧输入哈希或无运行绑定的例外不能解除当前检查', () => {
    const persisted = run([{ checkId: 'headcount', ruleId: 'r1', status: 'non-compliant' }])
    const disposition = { findingKey: 'headcount', disposition: 'waived', actor: 'local-reviewer',
      reason: '原审核例外', at: '', runId: persisted.id }
    const stale = t05ActionEligibility(
      aggregate({ dispositions: [{ ...disposition, inputHash: 'stale-input' }] }), persisted)
    expect(stale.allowed['stage-pass']).toBe(false)
    const missing = t05ActionEligibility(
      aggregate({ dispositions: [disposition] }), persisted)
    expect(missing.allowed['stage-pass']).toBe(false)
    const matching = t05ActionEligibility(
      aggregate({ dispositions: [{ ...disposition, inputHash: persisted.inputManifest.hash }] }), persisted)
    expect(matching.allowed['stage-pass']).toBe(true)
  })

  test('一条规则多个目标时不能用规则 ID 一次豁免所有检查', () => {
    const persisted = run([
      { checkId: 'r1-subject-1', ruleId: 'r1', status: 'non-compliant' },
      { checkId: 'r1-subject-2', ruleId: 'r1', status: 'non-compliant' },
    ])
    const staleScope = t05ActionEligibility(aggregate({ dispositions: [{
      findingKey: 'r1', disposition: 'waived', actor: 'local-reviewer',
      reason: '不明确是哪一项', at: '', runId: persisted.id, inputHash: persisted.inputManifest.hash,
    }] }), persisted)
    expect(staleScope.allowed['stage-pass']).toBe(false)
    const specific = t05ActionEligibility(aggregate({ dispositions: [
      { findingKey: 'r1-subject-1', disposition: 'waived', actor: 'local-reviewer',
        reason: '第一项例外', at: '', runId: persisted.id, inputHash: persisted.inputManifest.hash },
      { findingKey: 'r1-subject-2', disposition: 'waived', actor: 'local-reviewer',
        reason: '第二项例外', at: '', runId: persisted.id, inputHash: persisted.inputManifest.hash },
    ] }), persisted)
    expect(specific.allowed['stage-pass']).toBe(true)
  })

  test('同 Run/inputHash 的人工确认可以解除待确认项，不被原始 pendingChecks 统计误拦截', () => {
    const persisted = run([
      { checkId: 'needs-human', ruleId: 'r1', status: 'awaiting-confirmation' },
    ], { coverage: { plannedChecks: 1, completedChecks: 1, pendingChecks: 1, documents: [] } })
    const resolved = t05ActionEligibility(aggregate({ dispositions: [{
      findingKey: 'needs-human', disposition: 'human-confirmed-compliant',
      actor: 'local-reviewer', reason: '人工核对原件并确认符合', at: '',
      runId: persisted.id, inputHash: persisted.inputManifest.hash,
    }] }), persisted)
    expect(resolved.allowed['stage-pass']).toBe(true)
  })

  test('计划覆盖不足阻断通过', () => {
    const e = t05ActionEligibility(aggregate(), run(
      [{ checkId: 'c1', ruleId: 'r1', status: 'compliant' }],
      { inputManifest: { hash: computeRunInputHash(aggregate().caseV2, [], []), templateVersion: 1, policyVersions: [], documentVersions: [],
        observationIds: [], evidenceLinkIds: [], effectiveRuleIds: ['r1', 'r2'] } }))
    expect(e.coverage.missing).toEqual(['r2'])
    expect(e.allowed['stage-pass']).toBe(false)
  })

  test('执行失败与未执行都不许通过，但可拒绝/退回', () => {
    const e = t05ActionEligibility(aggregate(), run([
      { checkId: 'c1', ruleId: 'r1', status: 'execution-failed' },
      { checkId: 'c2', ruleId: 'r2', status: 'not-executed' },
    ]))
    expect(e.allowed['stage-pass']).toBe(false)
    expect(e.allowed['final-reject']).toBe(true)
    expect(e.blockers.join()).toContain('执行失败')
    expect(e.blockers.join()).toContain('未执行')
  })
})
