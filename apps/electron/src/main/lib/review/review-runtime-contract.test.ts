/**
 * RUN-01/02/04/05/07/09/14/22 权威业务 Run 合同与冷启动续交（RUN-43）。
 *
 * 只测纯 Main 函数与 V2 存储：不启动 Electron、不调用模型、不写真实案卷。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { CaseAggregateV2, CheckResult, ReviewRunV2 } from '@profer/shared'

const configDir = mkdtempSync(join(tmpdir(), 'run-contract-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const {
  classifyRunAuthority, freezeAttemptIdentity, isSameAttempt, isCurrentBusinessRun,
  resolveCurrentBusinessRun, decisionRunRelation, expectedCheckIdsFromPlan, interruptedResumeGate,
} = await import('./review-runtime-contract')
const {
  INTERRUPTED_RUN_MARKER, isInterruptedRunV2, isResumableInterruptedRunV2,
  markStaleRunsInterrupted, reopenInterruptedRunForResume, saveRunV2,
} = await import('./run-store-v2')

const CASE = 'case-contract'

function check(checkId: string, status: CheckResult['status'] = 'compliant'): CheckResult {
  return {
    checkId, ruleId: 'rule-' + checkId,
    target: { scope: 'case', subjectIds: [] },
    status, reason: '', sourceRefs: [], executedBy: 'deterministic', executedAt: '2026-10-23T00:00:00Z',
  }
}

function run(overrides: Partial<ReviewRunV2> & { id: string }): ReviewRunV2 {
  const base: ReviewRunV2 = {
    id: overrides.id,
    caseId: CASE,
    templateId: 'tpl',
    templateVersion: 1,
    inputManifest: {
      hash: 'input-hash', templateVersion: 1, policyVersions: [],
      documentVersions: [], observationIds: [], evidenceLinkIds: [],
      effectiveRuleIds: ['rule-a'], planFingerprint: 'plan-1',
    },
    status: 'completed',
    checkpoints: [],
    checks: [check('t04:["a"]')],
    opinions: [],
    coverage: { documents: [], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 },
    diagnostics: [],
    startedAt: '2026-10-23T00:00:00Z',
  }
  return { ...base, ...overrides }
}

function aggregate(overrides: Partial<CaseAggregateV2> = {}): CaseAggregateV2 {
  return {
    caseV2: {
      id: CASE, revision: 1, templateId: 'tpl', templateVersion: 1, stage: 'reviewing',
      documents: [], caseFields: {}, reviewRules: [],
    },
    tasks: [], decisions: [], supplements: [], receiptLog: [],
    ...overrides,
  } as CaseAggregateV2
}

describe('Run 权威分类与冻结身份', () => {
  test('模板阶段与诊断 Run 不得成为当前业务 Run', () => {
    expect(classifyRunAuthority({ id: 'run-tpl-1' })).toBe('diagnostic')
    expect(classifyRunAuthority({ id: 'run-diag-9' })).toBe('diagnostic')
    expect(classifyRunAuthority({ id: 'run-pi-1' })).toBe('business-attempt')
    expect(classifyRunAuthority({ id: 'run-1' })).toBe('business-attempt')
    expect(isCurrentBusinessRun({ id: 'run-tpl-1' })).toBe(false)
    expect(isCurrentBusinessRun({ id: 'run@rev12' })).toBe(false)
    expect(isCurrentBusinessRun({ id: 'run-pi-1' })).toBe(true)
  })

  test('缺少 planFingerprint 的运行没有冻结身份，不能拿 input hash 冒充计划', () => {
    const noPlan = run({ id: 'run-pi-1', inputManifest: {
      hash: 'h', templateVersion: 1, policyVersions: [], documentVersions: [],
      observationIds: [], evidenceLinkIds: [],
    } })
    expect(freezeAttemptIdentity(noPlan)).toBeUndefined()
    expect(freezeAttemptIdentity(run({ id: 'run-pi-1' }))?.planFingerprint).toBe('plan-1')
  })

  test('同输入同计划视为同一 attempt，计划不同则不是', () => {
    const a = run({ id: 'run-pi-1' })
    const b = run({ id: 'run-pi-2' })
    const otherPlan = run({ id: 'run-pi-3', inputManifest: { ...a.inputManifest, planFingerprint: 'plan-2' } })
    expect(isSameAttempt(a, b)).toBe(true)
    expect(isSameAttempt(a, otherPlan)).toBe(false)
  })
})

describe('当前业务 Run 选择（RUN-04：不得跳过最新失败）', () => {
  test('最新 attempt 失败时不回退到旧的成功 Run', () => {
    const older = run({ id: 'run-pi-old', startedAt: '2026-10-23T00:00:00Z' })
    const latest = run({
      id: 'run-pi-new', status: 'failed', startedAt: '2026-10-23T01:00:00Z',
      error: '模型调用失败', checks: [],
    })
    const decision = resolveCurrentBusinessRun({
      aggregate: aggregate(), runs: [latest, older], stale: () => false,
    })
    expect(decision.run).toBeUndefined()
    expect(decision.reason).toBe('latest-attempt-failed')
    expect(decision.blockedByRunId).toBe('run-pi-new')
  })

  test('最新 attempt 仍在执行时同样阻断，不展示旧结果', () => {
    const older = run({ id: 'run-pi-old', startedAt: '2026-10-23T00:00:00Z' })
    const running = run({
      id: 'run-pi-new', status: 'running', startedAt: '2026-10-23T01:00:00Z', checks: [],
    })
    const decision = resolveCurrentBusinessRun({
      aggregate: aggregate(), runs: [running, older], stale: () => false,
    })
    expect(decision.reason).toBe('latest-attempt-in-progress')
    expect(decision.run).toBeUndefined()
  })

  test('较新的诊断 Run 不影响业务 Run 选择', () => {
    const business = run({ id: 'run-pi-1', startedAt: '2026-10-23T00:00:00Z' })
    const diagnostic = run({
      id: 'run-tpl-9', startedAt: '2026-10-23T02:00:00Z',
      inputManifest: { ...business.inputManifest, planFingerprint: undefined },
    })
    const decision = resolveCurrentBusinessRun({
      aggregate: aggregate(), runs: [diagnostic, business], stale: () => false,
    })
    expect(decision.run?.id).toBe('run-pi-1')
  })

  test('最新业务 Run 已过期时明确阻断，而不是继续用旧成功', () => {
    const latest = run({ id: 'run-pi-1' })
    const decision = resolveCurrentBusinessRun({
      aggregate: aggregate(), runs: [latest], stale: () => true,
    })
    expect(decision.run).toBeUndefined()
    expect(decision.reason).toBe('latest-attempt-not-current')
  })
})

describe('决定引用与计划 Check 清单', () => {
  test('决定引用被新 Run 取代时标记 superseded，同一 attempt 记为历史', () => {
    const decisionRun = run({ id: 'run-pi-1' })
    const sameAttempt = run({ id: 'run-pi-2', startedAt: '2026-10-23T01:00:00Z' })
    const otherAttempt = run({
      id: 'run-pi-3', startedAt: '2026-10-23T02:00:00Z',
      inputManifest: { ...decisionRun.inputManifest, hash: 'changed' },
    })
    expect(decisionRunRelation({
      decisionRunId: 'run-pi-1', currentRun: sameAttempt, runs: [decisionRun, sameAttempt],
    })).toBe('same-attempt-history')
    expect(decisionRunRelation({
      decisionRunId: 'run-pi-1', currentRun: otherAttempt, runs: [decisionRun, otherAttempt],
    })).toBe('superseded')
    expect(decisionRunRelation({ decisionRunId: undefined, currentRun: decisionRun, runs: [decisionRun] })).toBe('unbound')
  })

  test('冻结计划派生 CheckId 与 F07 公式一致', () => {
    const plan = {
      planId: 'p', fingerprint: 'plan-1', templateId: 'tpl', templateVersion: '1',
      moduleDigests: [], bindings: [{
        checkKey: 'limit', targetKey: 'case', objectKey: 'doc', subjectId: 's1',
        applicability: 'unknown' as const, conditionFingerprint: 'c',
      }],
    }
    expect(expectedCheckIdsFromPlan(plan as never)).toEqual([
      't04:' + JSON.stringify(['limit', 'case', 'doc', 's1']),
    ])
  })
})

describe('RUN-43 冷启动中断运行按原 RunId 续交', () => {
  test('崩溃遗留 running 标为 failed 但保留可续交标记', () => {
    const interrupted = run({
      id: 'run-pi-crash', status: 'running', startedAt: '2026-10-23T00:00:00Z',
      checks: [check('t04:["a"]'), check('t04:["b"]', 'execution-failed')],
      checkpoints: [{ nodeId: 'n1', inputHash: 'h', status: 'done', attempts: 1 }],
    })
    saveRunV2(interrupted)
    expect(markStaleRunsInterrupted(CASE)).toBe(1)
    expect(isResumableInterruptedRunV2(interrupted)).toBe(false) // 内存对象未被修改

    const reopened = reopenInterruptedRunForResume(CASE, 'run-pi-crash')
    expect(reopened?.id).toBe('run-pi-crash')
    expect(reopened?.status).toBe('partially-completed')
    expect(reopened?.checkpoints).toHaveLength(1)
    expect(reopened?.diagnostics).toContain(INTERRUPTED_RUN_MARKER)
    expect(reopened?.diagnostics.some((item) => item.startsWith('resume-interrupted'))).toBe(true)
    // 续交后不再拒止该 Run 的授权
    expect(isInterruptedRunV2(CASE, 'run-pi-crash')).toBe(false)
  })

  test('无检查点也无已接受检查的中断运行不得伪装可续交', () => {
    expect(isResumableInterruptedRunV2({
      status: 'failed', diagnostics: [INTERRUPTED_RUN_MARKER], checks: [], checkpoints: [],
    })).toBe(false)
    expect(isResumableInterruptedRunV2({
      status: 'failed', diagnostics: [], checks: [check('x')], checkpoints: [],
    })).toBe(false)
    expect(reopenInterruptedRunForResume(CASE, 'run-pi-absent')).toBeUndefined()
  })
})

describe('RUN-43 中断续跑：未知 effect 不自动重放', () => {
  test('未显式确认时失败关闭；确认续交或重新审核才放行', () => {
    expect(interruptedResumeGate({ interruptedResumable: true }).allowed).toBe(false)
    expect(interruptedResumeGate({ interruptedResumable: true, mode: 'update' }).allowed).toBe(false)
    expect(interruptedResumeGate({ interruptedResumable: true, mode: 'update', resumeInterrupted: true }).allowed).toBe(true)
    expect(interruptedResumeGate({ interruptedResumable: true, mode: 'restart' }).allowed).toBe(true)
    expect(interruptedResumeGate({ interruptedResumable: false }).allowed).toBe(true)
    expect(interruptedResumeGate({ interruptedResumable: true, mode: 'update' }).message).toContain('未确认的模型请求')
  })

  test('用户确认续交只恢复检查点，并明确记为“新回合”', () => {
    saveRunV2(run({
      id: 'run-pi-confirmed', status: 'running', startedAt: '2026-10-23T01:00:00Z',
      checks: [check('t04:["a"]')],
      checkpoints: [{ nodeId: 'n1', inputHash: 'h', status: 'done', attempts: 1 }],
    }))
    expect(markStaleRunsInterrupted(CASE)).toBe(1)
    const reopened = reopenInterruptedRunForResume(CASE, 'run-pi-confirmed', { confirmedByUser: true })
    expect(reopened?.status).toBe('partially-completed')
    expect(reopened?.diagnostics.some((item) =>
      item.startsWith('resume-interrupted') && item.includes('新回合'))).toBe(true)
    expect(reopened?.diagnostics.some((item) => item.includes('不会被重放'))).toBe(true)
    expect(isInterruptedRunV2(CASE, 'run-pi-confirmed')).toBe(false)
  })
})
