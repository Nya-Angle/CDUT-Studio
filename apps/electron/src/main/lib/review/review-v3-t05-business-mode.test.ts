/**
 * R01 D2/D3：可信业务模式解析与按动作适格判定。
 *
 * 这些是架构裁决的直接反证：
 * - CanonicalPlan 不再因为「有计划」就被判技术预审，但也没有自动业务许可；
 * - D2 技术预审永远不能形成正式业务决定；
 * - 非合规项不能靠 Run completed 直接 stage-pass；
 * - 计划覆盖不足、执行失败、未执行都阻断通过，但允许退回/拒绝。
 */
import { afterAll, afterEach, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  resolveT05BusinessMode, t05ActionEligibility, registerT05LocalBusinessConfirmation,
  clearT05LocalBusinessConfirmations,
} from './review-v3-t05-main-service'
import type { CaseAggregateV2, ReviewCaseV2, ReviewRunV2 } from '@profer/shared'
import { saveRunV2 } from './run-store-v2'
import { computeRunInputHash } from './run-service-v2'

// D3 要求 Run 必须在 RunStore 可查，因此测试持久化真实 Run 而不是内存对象
const configDir = mkdtempSync(join(tmpdir(), 't05arch-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))
afterEach(() => { clearT05LocalBusinessConfirmations() })

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
  test('无计划：模板绑定的本地业务案卷可办理阶段', () => {
    expect(resolveT05BusinessMode(aggregate())).toMatchObject({ mode: 'local-business' })
  })

  test('D2 技术预审：即便有其他结构也不具备业务决定权', () => {
    const result = resolveT05BusinessMode(aggregate({ d2RuntimePlan: { id: 'd2' } }))
    expect(result.mode).toBe('technical-pre-review')
  })

  test('CanonicalPlan 未经 Main 确认时按技术预审处理（fail closed）', () => {
    const result = resolveT05BusinessMode(aggregate({
      canonicalPlan: { fingerprint: 'fp-1', planId: 'p' },
    }))
    expect(result.mode).toBe('technical-pre-review')
    expect(result.reason).toContain('尚未经 Main 确认')
  })

  test('CanonicalPlan + 指纹与模板版本相符的本地业务确认 → local-business', () => {
    registerT05LocalBusinessConfirmation({
      caseId: 'case-arch', planFingerprint: 'fp-1', templateId: 'tpl-arch',
      templateVersion: 1, confirmedBy: 'local-organizer', confirmedAt: '', reason: '本地业务发布',
    })
    const result = resolveT05BusinessMode(aggregate({ canonicalPlan: { fingerprint: 'fp-1', planId: 'p' } }))
    expect(result.mode).toBe('local-business')
  })

  test('计划指纹变化后确认失效（升版必须重新确认）', () => {
    registerT05LocalBusinessConfirmation({
      caseId: 'case-arch', planFingerprint: 'fp-1', templateId: 'tpl-arch',
      templateVersion: 1, confirmedBy: 'local-organizer', confirmedAt: '', reason: '本地业务发布',
    })
    const result = resolveT05BusinessMode(aggregate({ canonicalPlan: { fingerprint: 'fp-2', planId: 'p' } }))
    expect(result.mode).toBe('technical-pre-review')
    expect(result.reason).toContain('指纹')
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
      aggregate({ dispositions: [{ findingKey: 'headcount', disposition: 'waived', actor: 'local-reviewer', reason: '具名例外', at: '', runId: persisted.id }] }),
      persisted)
    expect(e.readiness).toBe('ready')
    expect(e.allowed['stage-pass']).toBe(true)
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
