/**
 * P03-S03: trusted internal review owner, persistent index and minimal
 * ordinary desktop/Pocket ingress guards. P04/P05 remain separate full
 * surface enumeration (tabs/search/replay/Feishu) before feature release.
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { randomUUID } from 'node:crypto'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { isReviewOwnedAgentSession, isVisibleAgentSession } from '@profer/shared'
import {
  assertOrdinaryAgentSession,
  createAgentSession,
  createReviewOwnedAgentSession,
  getAgentSessionMeta,
  listAgentSessions,
  updateAgentSessionMeta,
} from '../agent-session-manager'
import { handleRemoteCommand, mayPublishAgentEventToRemote } from '../remote-service'

const directory = mkdtempSync(join(tmpdir(), 'p03-owned-'))
process.env.PROFER_CONFIG_DIR = directory
afterAll(() => rmSync(directory, { recursive: true, force: true }))

function fixture() {
  const tag = randomUUID().slice(0, 8)
  const caseId = `case-p03-${tag}`
  const owned = createReviewOwnedAgentSession({
    caseId, title: '内部审核执行', channelId: 'mock-channel', modelId: 'mock-model',
  })
  const ordinary = createAgentSession(`普通聊天-${tag}`, 'mock-channel', undefined, 'mock-model', 'pi')
  return { owned, ordinary, caseId }
}

describe('P03-S03 trusted owner and basic normal-entry barriers', () => {
  test('review owner is stamped atomically into persistent session index, not inferred from title/preset', () => {
    const { owned, ordinary, caseId } = fixture()
    expect(owned.owner).toEqual({ kind: 'review-case', caseId })
    expect(getAgentSessionMeta(owned.id)?.owner).toEqual(owned.owner)
    expect(listAgentSessions(true).find(x => x.id === owned.id)?.owner).toEqual(owned.owner)
    expect(owned.agentRuntime).toBe('pi')
    expect(isReviewOwnedAgentSession(owned)).toBeTrue()
    expect(isReviewOwnedAgentSession(ordinary)).toBeFalse()
    expect(isVisibleAgentSession(owned)).toBeFalse()
    expect(isVisibleAgentSession(ordinary)).toBeTrue()
    expect(() => assertOrdinaryAgentSession(owned.id)).toThrow('内部审核会话')
    expect(() => assertOrdinaryAgentSession(ordinary.id)).not.toThrow()
  })

  test('owner is immutable under regular updates, including runtime property injection', () => {
    const { owned, ordinary } = fixture()
    expect(() => updateAgentSessionMeta(owned.id, {
      owner: { kind: 'review-case', caseId: 'forged-case' },
    } as never)).toThrow('owner 不可')
    expect(() => updateAgentSessionMeta(ordinary.id, {
      owner: { kind: 'review-case', caseId: 'forged-case' },
    } as never)).toThrow('owner 不可')
    const changed = updateAgentSessionMeta(owned.id, { title: '内部审核进行中' })
    expect(changed.owner).toEqual(owned.owner)
    expect(getAgentSessionMeta(ordinary.id)?.owner).toBeUndefined()
    expect(() => createReviewOwnedAgentSession({ caseId: '../forged', title: 'X', channelId: 'mock-channel' })).toThrow('有效案卷')
  })

  test('Pocket session list excludes owned sessions; even a known sessionId cannot read/change/delete them', async () => {
    const { owned, ordinary } = fixture()
    const list = await handleRemoteCommand(JSON.stringify({ type: 'list_sessions' }))
    expect(list.ok).toBeTrue()
    if (!list.ok) return
    const records = list.data as { id: string }[]
    expect(records.some(s => s.id === ordinary.id)).toBeTrue()
    expect(records.some(s => s.id === owned.id)).toBeFalse()

    for (const type of ['session_detail', 'get_sdk_messages', 'delete_session', 'update_session_model',
      'send_message', 'stop_agent', 'search_workspace_files']) {
      const result = await handleRemoteCommand(JSON.stringify({
        type, sessionId: owned.id, userMessage: 'do not start', channelId: 'mock-channel',
        modelId: 'mock-model',
      }))
      expect(result).toEqual({ ok: false, error: '会话不存在' })
    }
    const normal = await handleRemoteCommand(JSON.stringify({ type: 'session_detail', sessionId: ordinary.id }))
    expect(normal.ok).toBeTrue()
  })

  test('Pocket event and runtime snapshots are denied before replay append for internal review sessions', async () => {
    const { owned, ordinary } = fixture()
    expect(mayPublishAgentEventToRemote(owned.id)).toBeFalse()
    expect(mayPublishAgentEventToRemote(ordinary.id)).toBeTrue()
    const result = await handleRemoteCommand(JSON.stringify({
      type: 'get_agent_runtime_contexts', sessionIds: [owned.id, ordinary.id],
    }))
    expect(result.ok).toBeTrue()
    if (!result.ok) return
    const contexts = result.data as Array<{ sessionId: string }>
    expect(contexts.some(c => c.sessionId === owned.id)).toBeFalse()
  })
})
