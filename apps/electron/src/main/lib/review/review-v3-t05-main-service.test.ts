/** T05 可信阶段事务：身份派生、准备度判定、原子写入与角色边界。 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const configDir = mkdtempSync(join(tmpdir(), 't05m-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const { deriveT05LocalActor, t05DecisionReadiness, isLocalBusinessCase,
  t05ActionEligibility, isT05DiagnosticRun } =
  await import('./review-v3-t05-main-service')

function aggregate(overrides: Record<string, unknown> = {}) {
  return {
    caseV2: { id: 'case-t05', revision: 3, templateId: 'tpl', templateVersion: 1, stage: 'submitted', documents: [] },
    tasks: [], decisions: [], supplements: [], receiptLog: [],
    ...overrides,
  } as never
}

describe('T05 可信阶段边界', () => {
  test('渲染层只能声明角色，actor 由 Main 派生', () => {
    expect(deriveT05LocalActor(undefined).actorId).toBe('local-reviewer')
    expect(deriveT05LocalActor({ role: 'teacher' }).role).toBe('teacher')
    // 非法角色降级为本地审核员，绝不按渲染层自称提权
    expect(deriveT05LocalActor({ role: 'superadmin' }).role).toBe('reviewer')
  })

  test('技术预审与 CanonicalPlan 案卷不得走业务阶段', () => {
    expect(isLocalBusinessCase(aggregate())).toBe(true)
    expect(isLocalBusinessCase(aggregate({ d2RuntimePlan: { id: 'p' } }))).toBe(false)
    expect(isLocalBusinessCase(aggregate({ canonicalPlan: { planId: 'p' } }))).toBe(false)
  })

  test('没有有效 Run 时准备度为 blocked', () => {
    expect(t05DecisionReadiness(aggregate(), undefined)).toMatchObject({ readiness: 'blocked' })
  })

  test('检查待确认或执行失败时准备度为 blocked', () => {
    const run = { id: 'run-1', status: 'completed', checks: [
      { checkId: 'c1', status: 'compliant' },
      { checkId: 'c2', status: 'awaiting-confirmation' },
      { checkId: 'c3', status: 'execution-failed' },
    ] }
    const r = t05DecisionReadiness(aggregate(), run as never)
    expect(r.readiness).toBe('blocked')
    // 必须同时报出两类阻断，不能只看一个
    expect(r.blockers.length).toBeGreaterThanOrEqual(2)
  })

  test('未结束的补件请求阻断定稿', () => {
    const run = { id: 'run-1', status: 'completed', checks: [{ checkId: 'c1', status: 'compliant' }] }
    const r = t05DecisionReadiness(
      aggregate({ supplements: [{ id: 's1', status: 'responded' }] }) as never, run as never)
    expect(r.readiness).toBe('blocked')
    expect(r.blockers.join()).toContain('补件')
  })

  test('有效人工处置可结掉待确认项，但待补件与执行失败仍阻断', () => {
    const run = { id: 'run-1', status: 'completed', checks: [
      { checkId: 'c1', status: 'awaiting-confirmation' },
      { checkId: 'c2', status: 'awaiting-supplement' },
      { checkId: 'c3', status: 'execution-failed' },
    ] }
    // c1 已人工确认合规，c2 只请求了补件（仍在等材料），c3 执行失败
    const aggregateWithDispositions = aggregate({ dispositions: [
      { findingKey: 'c1', disposition: 'human-confirmed-compliant', actor: 'local-reviewer', reason: '已核对', at: '' },
      { findingKey: 'c2', disposition: 'supplement-requested', actor: 'local-reviewer', reason: '等材料', at: '' },
    ] })
    const r = t05DecisionReadiness(aggregateWithDispositions, run as never)
    expect(r.readiness).toBe('blocked')
    // 仍有一项待补件、一项执行失败
    expect(r.blockers.join()).toContain('待确认或待补件')
    expect(r.blockers.join()).toContain('执行失败')
  })

  test('旧 Run 的处置不得沿用到新 Run', () => {
    const run = { id: 'run-new', status: 'completed', checks: [{ checkId: 'c1', status: 'awaiting-confirmation' }] }
    const stale = aggregate({ dispositions: [
      { findingKey: 'c1', disposition: 'human-confirmed-compliant', actor: 'local-reviewer', reason: '旧', at: '', runId: 'run-old' },
    ] })
    expect(t05DecisionReadiness(stale, run as never).readiness).toBe('blocked')
  })

  test('全部检查通过且无未结束补件时准备度为 ready', () => {
    const run = { id: 'run-1', status: 'completed',
      coverage: { plannedChecks: 1, completedChecks: 1, pendingChecks: 0, documents: [] },
      checks: [{ checkId: 'c1', status: 'compliant' }],
    }
    expect(t05DecisionReadiness(aggregate() as never, run as never).readiness).toBe('ready')
  })

  test('RUN-05：部分完成的 Run 不得通过阶段，只能拒绝或退回', () => {
    const run = { id: 'run-1', status: 'partially-completed',
      inputManifest: { hash: 'h' },
      coverage: { plannedChecks: 1, completedChecks: 1, pendingChecks: 0, documents: [] },
      checks: [{ checkId: 'c1', status: 'compliant' }],
    }
    const r = t05ActionEligibility(aggregate() as never, run as never)
    expect(r.readiness).toBe('ready')
    expect(r.allowed['stage-pass']).toBe(false)
    expect(r.reasons['stage-pass'].join()).toContain('完整结束')
    // 退回补件永远保留；不能因「不能通过」连带封死正当退回
    expect(r.allowed['return-for-supplement']).toBe(true)
  })

  test('RUN-07/02：模板规则与诊断 Run 不冒充当前业务 Run', () => {
    expect(isT05DiagnosticRun({ id: 'run-tpl-1' })).toBe(true)
    expect(isT05DiagnosticRun({ id: 'run-diag-1' })).toBe(true)
    expect(isT05DiagnosticRun({ id: 'run-pi-1' })).toBe(false)
    expect(isT05DiagnosticRun({ id: 'run@rev3' })).toBe(true)
  })
})
