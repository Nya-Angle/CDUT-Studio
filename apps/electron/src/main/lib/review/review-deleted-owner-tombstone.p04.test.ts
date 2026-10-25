/**
 * P04-S03: a deleted review owner must not turn into an unknown ordinary ID.
 * Tests use an isolated synthetic on-disk index, not an Electron/real Pi session.
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { randomUUID } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { AgentEventBus } from '../agent-event-bus'
import { getAgentSessionsIndexPath } from '../config-paths'
import {
  assertOrdinaryAgentSession,
  createAgentSession,
  createDelegatedChildSessionMeta,
  createReviewOwnedAgentSession,
  deleteAgentSession,
  getAgentSessionMeta,
  isReviewOwnedOrDeletedAgentSessionId,
} from '../agent-session-manager'
import {
  configureAgentSessionProjectionPublisher,
  publishAgentSessionDeletion,
  publishAgentSessionProjection,
} from '../agent-session-ui-projection-publisher'
import { handleRemoteCommand, mayPublishAgentEventToRemote } from '../remote-service'

const directory = mkdtempSync(join(tmpdir(), 'p04-review-tombstone-'))
process.env.PROFER_CONFIG_DIR = directory
afterAll(() => rmSync(directory, { recursive: true, force: true }))

function fixture() {
  const suffix = randomUUID().slice(0, 10)
  const owned = createReviewOwnedAgentSession({
    caseId: `case-tombstone-${suffix}`, title: `private-review-${suffix}`, channelId: 'mock-channel',
  })
  const ordinary = createAgentSession(`ordinary-${suffix}`, 'mock-channel')
  return { owned, ordinary }
}

describe('P04-S03 deleted internal review owner isolation', () => {
  test('deletion preserves an ID-only tombstone atomically in the existing session index', () => {
    const { owned, ordinary } = fixture()
    expect(isReviewOwnedOrDeletedAgentSessionId(owned.id)).toBe(true)
    deleteAgentSession(owned.id)
    expect(getAgentSessionMeta(owned.id)).toBeUndefined()
    expect(isReviewOwnedOrDeletedAgentSessionId(owned.id)).toBe(true)
    expect(() => assertOrdinaryAgentSession(owned.id)).toThrow('内部审核会话')
    expect(getAgentSessionMeta(ordinary.id)?.id).toBe(ordinary.id)
    const persisted = JSON.parse(readFileSync(getAgentSessionsIndexPath(), 'utf8')) as {
      reviewOwnerDeletionTombstones?: string[]
      sessions: Array<{ id: string }>
    }
    expect(persisted.reviewOwnerDeletionTombstones).toContain(owned.id)
    expect(persisted.sessions.some(s => s.id === owned.id)).toBe(false)
    expect(persisted.reviewOwnerDeletionTombstones?.some(x => x.includes('case-tombstone'))).toBe(false)
  })

  test('ordinary deletion stays ordinary; unknown IDs are not falsely classified as owners', () => {
    const { ordinary } = fixture()
    deleteAgentSession(ordinary.id)
    expect(getAgentSessionMeta(ordinary.id)).toBeUndefined()
    expect(isReviewOwnedOrDeletedAgentSessionId(ordinary.id)).toBe(false)
    expect(isReviewOwnedOrDeletedAgentSessionId('unknown-'+randomUUID())).toBe(false)
    expect(() => assertOrdinaryAgentSession(ordinary.id)).not.toThrow()
  })

  test('delayed deletion/projection event after metadata removal is suppressed only for review owner', () => {
    const { owned, ordinary } = fixture()
    const bus = new AgentEventBus()
    const emitted: Array<{ id: string; operation?: string; kind: string }> = []
    bus.on((id, payload) => emitted.push({
      id, kind: payload.kind, operation: payload.kind === 'session_projection' ? payload.operation : undefined,
    }))
    configureAgentSessionProjectionPublisher(bus)
    const staleOwned = { ...owned }
    deleteAgentSession(owned.id)
    publishAgentSessionProjection(staleOwned)
    // A delayed legacy/full-meta snapshot can lose owner after deletion: ID fence still wins.
    publishAgentSessionProjection({ ...staleOwned, owner: undefined })
    publishAgentSessionDeletion(owned.id, 101)
    expect(emitted.some(x => x.id === owned.id)).toBe(false)
    deleteAgentSession(ordinary.id)
    publishAgentSessionDeletion(ordinary.id, 102)
    expect(emitted).toContainEqual({ id: ordinary.id, kind: 'session_projection', operation: 'delete' })
  })

  test('remote replay-append guard and ordinary command router reject deleted owner ID', async () => {
    const { owned, ordinary } = fixture()
    deleteAgentSession(owned.id)
    expect(mayPublishAgentEventToRemote(owned.id)).toBe(false)
    expect(mayPublishAgentEventToRemote(ordinary.id)).toBe(true)
    expect(await handleRemoteCommand(JSON.stringify({
      type: 'session_detail', sessionId: owned.id,
    }))).toEqual({ ok: false, error: '会话不存在' })
    const normal = await handleRemoteCommand(JSON.stringify({
      type: 'session_detail', sessionId: ordinary.id,
    }))
    expect(normal.ok).toBe(true)
  })

  test('a deleted owner ID cannot be reused as a delegated ordinary session', () => {
    const { owned } = fixture()
    deleteAgentSession(owned.id)
    expect(() => createDelegatedChildSessionMeta({
      childSessionId: owned.id, parentSessionId: 'ordinary-parent',
      sourceDelegationId: 'fake-delegation', title: 'attempt to resurrect',
    })).toThrow('已删除的内部审核会话')
    expect(isReviewOwnedOrDeletedAgentSessionId(owned.id)).toBe(true)
  })
})
