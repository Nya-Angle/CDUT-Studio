/**
 * 身份授权闭环回归（AUTH-01/06/07/08/09/18）
 *
 * 只验证 Main 侧合同与持久行为：不伪造 GUI、不声称学校真人权限。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

const config = mkdtempSync(join(tmpdir(), 'review-identity-'))
process.env.PROFER_CONFIG_DIR = config
afterAll(() => rmSync(config, { recursive: true, force: true }))

const principalService = await import('./review-principal-service')
const {
  issueLocalPrincipal, assertPrincipalAllows, assertNoRendererRoleEscalation,
  describePrincipalForAudit, PrincipalError, SIMULATED_NOT_SCHOOL_AUTHORIZED,
} = principalService
const assignment = await import('./review-agent-assignment')
const { createAssignment, checkAssignment, revokeAssignment, checkCaseReadScope, isCaseVisible } = assignment

describe('AUTH-01 统一 Principal：本机试办不得冒充校方', () => {
  test('教师/评委/校方角色不能由本机签发', () => {
    for (const role of ['teacher', 'school-admin'] as const) {
      expect(() => issueLocalPrincipal({ role, caseIds: ['c1'], actions: ['decide'], sessionId: 's1' }))
        .toThrow(PrincipalError)
    }
  })

  test('本地 reviewer 主体显式标注 SIMULATED_NOT_SCHOOL_AUTHORIZED 与 BLOCKED_EXTERNAL', () => {
    const principal = issueLocalPrincipal({ role: 'reviewer', caseIds: ['case-a'], actions: ['RECORD_STAGE_DECISION_V2'], sessionId: 'main:1' })
    expect(principal.assurance).toBe('local-device')
    expect(principal.schoolAuthorized).toBe(false)
    expect(principal.externalAuthorization).toBe('BLOCKED_EXTERNAL')
    expect(principal.assuranceLabel).toBe('LOCAL_OPERATOR')
    const audit = describePrincipalForAudit(principal)
    expect(audit.simulationMarker).toBe(SIMULATED_NOT_SCHOOL_AUTHORIZED)
    expect(audit.realPerson).toBe(false)
    expect(audit.display).toContain('非校方认证')
  })

  test('模拟教师主体在审计中不得显示为真实人员', () => {
    const simulated = issueLocalPrincipal({ role: 'student', caseIds: ['case-a'], actions: ['respond'], sessionId: 'main:1' })
    const audit = describePrincipalForAudit(simulated)
    expect(audit.label).toBe('LOCAL_SIMULATION')
    expect(audit.realPerson).toBe(false)
    expect(audit.display).toContain('本机模拟')
  })

  test('Renderer claim 升级到 teacher/judge 被拒绝', () => {
    expect(() => assertNoRendererRoleEscalation({ actorId: 'x', role: 'teacher' })).toThrow(PrincipalError)
    expect(() => assertNoRendererRoleEscalation({ role: 'judge' })).toThrow(PrincipalError)
    expect(() => assertNoRendererRoleEscalation({ role: 'audience' })).toThrow(PrincipalError)
    expect(assertNoRendererRoleEscalation({ role: 'reviewer' })).toBe('reviewer')
  })
})

describe('AUTH-01 写事务重核：范围与有效期', () => {
  test('案卷/动作越界与过期一律拒绝', () => {
    const principal = issueLocalPrincipal({ role: 'reviewer', caseIds: ['case-a'], actions: ['decide'], sessionId: 's', ttlMs: 60_000 })
    expect(() => assertPrincipalAllows(principal, { caseId: 'case-a', action: 'decide' })).not.toThrow()
    expect(() => assertPrincipalAllows(principal, { caseId: 'case-b', action: 'decide' })).toThrow(PrincipalError)
    expect(() => assertPrincipalAllows(principal, { caseId: 'case-a', action: 'other' })).toThrow(PrincipalError)
    const expired = issueLocalPrincipal({ role: 'reviewer', caseIds: ['case-a'], actions: ['decide'], sessionId: 's' })
    expect(() => assertPrincipalAllows({ ...expired, expiresAt: new Date(Date.now() - 1000).toISOString() }, { caseId: 'case-a' }))
      .toThrow(PrincipalError)
    expect(() => assertPrincipalAllows(undefined, { caseId: 'case-a' })).toThrow(PrincipalError)
  })
})

describe('AUTH-07 指派轮次绑定', () => {
  test('跨轮复用旧 grant 被拒绝，同一轮放行', () => {
    const created = createAssignment({ sessionId: 'sess-turn', turnId: 'turn-1', caseId: 'case-turn', actions: ['submit-result'] })
    expect(created.turnPolicy).toBe('single-turn')
    expect(checkAssignment({ assignmentId: created.id, sessionId: 'sess-turn', action: 'submit-result', turnTriggeredBy: 'user', turnId: 'turn-1' }).ok).toBeTrue()
    const reuse = checkAssignment({ assignmentId: created.id, sessionId: 'sess-turn', action: 'submit-result', turnTriggeredBy: 'user', turnId: 'turn-2' })
    expect(reuse.ok).toBeFalse()
    expect(reuse.code).toBe('TURN_MISMATCH')
  })

  test('写操作要求可信轮次 ID 时，缺失即拒绝', () => {
    const created = createAssignment({ sessionId: 'sess-req', turnId: 'turn-1', caseId: 'case-req', actions: ['decide-stage'] })
    const missing = checkAssignment({ assignmentId: created.id, sessionId: 'sess-req', action: 'decide-stage', turnTriggeredBy: 'user', requireTurnMatch: true })
    expect(missing.ok).toBeFalse()
    expect(missing.code).toBe('TURN_UNVERIFIED')
  })

  test('长期指派缺少到期时间视为配置无效', () => {
    const created = createAssignment({ sessionId: 'sess-long', turnId: 'turn-1', caseId: 'case-long', actions: ['list'] })
    const all = JSON.parse(readFileSync(join(config, 'review-agent-assignments.json'), 'utf-8')) as { assignments: Array<Record<string, unknown>> }
    const target = all.assignments.find((item) => item.id === created.id)
    if (!target) throw new Error('指派未落盘')
    target.turnPolicy = 'multi-turn'
    writeFileSync(join(config, 'review-agent-assignments.json'), JSON.stringify(all))
    const check = checkAssignment({ assignmentId: created.id, sessionId: 'sess-long', action: 'list', turnId: 'turn-9' })
    expect(check.ok).toBeFalse()
    expect(check.code).toBe('ASSIGNMENT_EXPIRED')
  })
})

describe('AUTH-08 撤销持久化：主账本写失败后重启仍拒绝', () => {
  test('撤销意图独立落盘，主账本仍是旧行也拒绝', () => {
    const created = createAssignment({ sessionId: 'sess-revoke', turnId: 'turn-1', caseId: 'case-revoke', actions: ['submit-result'] })
    expect(revokeAssignment(created.id, '测试：撤销后重启')).toBeTrue()
    const intentsPath = join(config, 'review-agent-assignment-revocations.json')
    expect(existsSync(intentsPath)).toBeTrue()
    const intents = JSON.parse(readFileSync(intentsPath, 'utf-8')) as { revocations: Array<{ assignmentId: string }> }
    expect(intents.revocations.some((item) => item.assignmentId === created.id)).toBeTrue()

    // 模拟“撤销写盘失败但意图已落盘”：把主账本恢复成未撤销的旧行。
    const all = JSON.parse(readFileSync(join(config, 'review-agent-assignments.json'), 'utf-8')) as { assignments: Array<Record<string, unknown>> }
    for (const item of all.assignments) if (item.id === created.id) { delete item.revokedAt; delete item.revokeReason }
    writeFileSync(join(config, 'review-agent-assignments.json'), JSON.stringify(all))

    const afterRestart = checkAssignment({ assignmentId: created.id, sessionId: 'sess-revoke', action: 'submit-result', turnTriggeredBy: 'user', turnId: 'turn-1' })
    expect(afterRestart.ok).toBeFalse()
    expect(afterRestart.code).toBe('ASSIGNMENT_REVOKED')
  })
})

describe('AUTH-09 读取范围与写范围对齐', () => {
  test('无指派且未声明本地所有者浏览时不得读取案卷', () => {
    const denied = checkCaseReadScope({})
    expect(denied.ok).toBeFalse()
    expect(denied.code).toBe('READ_SCOPE_UNVERIFIED')
    expect(checkCaseReadScope({ localOwnerBrowsing: true }).ok).toBeTrue()
  })

  test('指派只暴露绑定案卷，未绑定案卷不可见', () => {
    const created = createAssignment({ sessionId: 'sess-read', turnId: 'turn-1', caseId: 'case-visible', actions: ['list'] })
    const scope = checkCaseReadScope({ assignment: created })
    expect(scope.ok).toBeTrue()
    expect(scope.caseIds).toEqual(['case-visible'])
    expect(isCaseVisible(scope, 'case-visible')).toBeTrue()
    expect(isCaseVisible(scope, 'case-other')).toBeFalse()
  })
})

describe('AUTH-06 旧通道 sender 收口合同', () => {
  test('非主窗口 sender 被拒绝（guard 层不依赖 IPC handler 自觉）', async () => {
    const guard = await import('./review-ipc-actor-guard')
    const destroyed = { isDestroyed: () => true, id: 7 }
    const fakeEvent = { sender: destroyed, senderFrame: { } } as unknown as Parameters<typeof guard.bindVerifiedLocalReviewerCommand>[0]
    expect(() => guard.bindVerifiedLocalReviewerCommand(fakeEvent, { requestId: 'r' }, { caseId: 'c1', action: 'RECORD_STAGE_DECISION_V2' }))
      .toThrow()
  })
})
