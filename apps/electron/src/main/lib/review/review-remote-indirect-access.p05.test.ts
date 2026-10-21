/** P05-S01 Pocket indirect request IDs, legacy file IDs and replay; controlled synthetic test. */
import { afterAll, describe, expect, spyOn, test } from 'bun:test'
import { randomUUID } from 'node:crypto'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createAgentSession, createReviewOwnedAgentSession, deleteAgentSession } from '../agent-session-manager'
import { permissionService } from '../agent-permission-service'
import { askUserService } from '../agent-ask-user-service'
import { exitPlanService } from '../agent-exit-plan-service'
import { handleRemoteCommand, mayPublishAgentEventToRemote, selectOrdinaryRemoteReplayRecords } from '../remote-service'

const dir = mkdtempSync(join(tmpdir(), 'p05-pocket-'))
process.env.PROFER_CONFIG_DIR = dir
afterAll(() => rmSync(dir, { recursive: true, force: true }))
const cmd = (type: string, fields: Record<string, unknown> = {}, context?: { activeSessionId?: string }) =>
  handleRemoteCommand(JSON.stringify({ type, ...fields }), null, context)
const fixture = () => {
  const id = randomUUID().slice(0, 10)
  return {
    owner: createReviewOwnedAgentSession({ caseId: 'p05-' + id, title: 'hidden-' + id, channelId: 'mock' }),
    normal: createAgentSession('ordinary-' + id, 'mock'),
  }
}
describe('P05-S01 remote indirect owner boundaries', () => {
  test('global and scoped pending interaction snapshots exclude hidden owner for all three kinds', async () => {
    const { owner, normal } = fixture()
    const requests = [{ requestId: 'hidden', sessionId: owner.id }, { requestId: 'public', sessionId: normal.id }]
    const p = spyOn(permissionService, 'getPendingRequests').mockReturnValue(requests as ReturnType<typeof permissionService.getPendingRequests>)
    const a = spyOn(askUserService, 'getPendingRequests').mockReturnValue(requests as ReturnType<typeof askUserService.getPendingRequests>)
    const e = spyOn(exitPlanService, 'getPendingRequests').mockReturnValue(requests as ReturnType<typeof exitPlanService.getPendingRequests>)
    try {
      const result = await cmd('get_pending_interactions')
      expect(result.ok).toBe(true)
      if (!result.ok) throw new Error(result.error)
      const data = result.data as Record<string, typeof requests>
      for (const key of ['permissions', 'askUsers', 'exitPlans']) {
        expect(data[key]?.map(r => r.requestId)).toEqual(['public'])
      }
      const scoped = await cmd('get_pending_interactions', { sessionId: normal.id })
      expect(scoped.ok).toBe(true)
      if (!scoped.ok) throw new Error(scoped.error)
      expect((scoped.data as Record<string, typeof requests>).permissions?.map(r => r.requestId)).toEqual(['public'])
      expect(await cmd('get_pending_interactions', { sessionId: owner.id }))
        .toEqual({ ok: false, error: '会话不存在' })
    } finally { p.mockRestore(); a.mockRestore(); e.mockRestore() }
  })

  test('requestId alone cannot approve internal permissions, ordinary permissions still respond', async () => {
    const { owner, normal } = fixture()
    const requests = [{ requestId: 'hidden', sessionId: owner.id }, { requestId: 'public', sessionId: normal.id }]
    const p = spyOn(permissionService, 'getPendingRequests').mockReturnValue(requests as ReturnType<typeof permissionService.getPendingRequests>)
    const respond = spyOn(permissionService, 'respondToPermission').mockReturnValue(normal.id)
    try {
      expect(await cmd('respond_permission', { requestId: 'hidden', behavior: 'allow', alwaysAllow: true }))
        .toEqual({ ok: false, error: '权限请求不存在或已处理' })
      expect(respond).not.toHaveBeenCalled()
      expect((await cmd('respond_permission', { requestId: 'public', behavior: 'deny' })).ok).toBe(true)
      expect(respond).toHaveBeenCalledTimes(1)
    } finally { p.mockRestore(); respond.mockRestore() }
  })

  test('requestId alone cannot resolve internal AskUser or ExitPlan, ordinary requests still respond', async () => {
    const { owner, normal } = fixture()
    const requests = [{ requestId: 'hidden', sessionId: owner.id }, { requestId: 'public', sessionId: normal.id }]
    const a = spyOn(askUserService, 'getPendingRequests').mockReturnValue(requests as ReturnType<typeof askUserService.getPendingRequests>)
    const e = spyOn(exitPlanService, 'getPendingRequests').mockReturnValue(requests as ReturnType<typeof exitPlanService.getPendingRequests>)
    const ask = spyOn(askUserService, 'respondToAskUser').mockResolvedValue(normal.id)
    const plan = spyOn(exitPlanService, 'respondToExitPlanMode').mockReturnValue({ sessionId: normal.id, targetMode: null })
    try {
      expect(await cmd('respond_ask_user', { requestId: 'hidden', answers: { q: 'a' } }))
        .toEqual({ ok: false, error: '提问请求不存在或已处理' })
      expect(await cmd('respond_exit_plan_mode', { requestId: 'hidden', action: 'approve_auto' }))
        .toEqual({ ok: false, error: '计划审批不存在或已处理' })
      expect(ask).not.toHaveBeenCalled()
      expect(plan).not.toHaveBeenCalled()
      expect((await cmd('respond_ask_user', { requestId: 'public', answers: { q: 'a' } })).ok).toBe(true)
      expect((await cmd('respond_exit_plan_mode', { requestId: 'public', action: 'deny' })).ok).toBe(true)
      expect(ask).toHaveBeenCalledTimes(1)
      expect(plan).toHaveBeenCalledTimes(1)
    } finally { a.mockRestore(); e.mockRestore(); ask.mockRestore(); plan.mockRestore() }
  })

  test('both legacy file command aliases deny nested and connection-context owner IDs before path access', async () => {
    const { owner, normal } = fixture()
    const fields = { filePath: '/nonexistent-synthetic-file', access: { sessionId: owner.id } }
    for (const type of ['resolve_and_read_file', 'read_file_as_data_url']) {
      expect(await cmd(type, fields)).toEqual({ ok: false, error: '会话不存在' })
      expect(await cmd(type, { filePath: fields.filePath }, { activeSessionId: owner.id }))
        .toEqual({ ok: false, error: '会话不存在' })
      const normalResult = await cmd(type, { filePath: fields.filePath, access: { sessionId: normal.id } })
      expect(normalResult.ok).toBe(false)
      if (!normalResult.ok) expect(normalResult.error).not.toBe('会话不存在')
    }
    deleteAgentSession(owner.id)
    expect(await cmd('resolve_and_read_file', fields)).toEqual({ ok: false, error: '会话不存在' })
  })

  test('old replay records and delayed live queue recheck owner after deletion without dropping normal order', () => {
    const { owner, normal } = fixture()
    const records = [{ eventId: 3, sessionId: normal.id }, { eventId: 4, sessionId: owner.id },
      { eventId: 5, sessionId: normal.id }]
    expect(selectOrdinaryRemoteReplayRecords(records).map(x => x.eventId)).toEqual([3, 5])
    expect(mayPublishAgentEventToRemote(owner.id)).toBe(false)
    deleteAgentSession(owner.id)
    expect(selectOrdinaryRemoteReplayRecords(records).map(x => x.eventId)).toEqual([3, 5])
    expect(mayPublishAgentEventToRemote(normal.id)).toBe(true)
  })
})
