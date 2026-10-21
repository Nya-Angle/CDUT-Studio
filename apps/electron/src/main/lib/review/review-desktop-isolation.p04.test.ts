/**
 * P04-S01 bounded desktop audit: direct content search, session reference
 * search, archived counters/cleanup and UI projection event suppression.
 * All tests use a synthetic isolated session index. Actual Electron window,
 * persisted tabs and event replay remain LIVE-06 NOT-RUN.
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { randomUUID } from 'node:crypto'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { AgentEventBus } from '../agent-event-bus'
import {
  appendAgentMessage,
  autoArchiveAgentSessions,
  countArchivedAgentSessions,
  findOrphanSessions,
  createAgentSession,
  createReviewOwnedAgentSession,
  getAgentSessionMeta,
  searchAgentSessionMessages,
  searchAgentSessionReferences,
  updateAgentSessionMeta,
} from '../agent-session-manager'
import {
  configureAgentSessionProjectionPublisher,
  publishAgentSessionProjection,
  updateAgentSessionUiMeta,
} from '../agent-session-ui-projection-publisher'

const root = mkdtempSync(join(tmpdir(), 'p04-desktop-'))
process.env.PROFER_CONFIG_DIR = root
afterAll(() => rmSync(root, { recursive: true, force: true }))

function fixture() {
  const suffix = randomUUID().slice(0, 10)
  const workspaceId = `synthetic-workspace-${suffix}`
  const caseId = `case-p04-${suffix}`
  const owned = createReviewOwnedAgentSession({
    caseId, title: `private-case-${suffix}`, channelId: 'mock-channel',
    workspaceId, modelId: 'mock-model',
  })
  const ordinary = createAgentSession(`public-agent-${suffix}`, 'mock-channel',
    workspaceId, 'mock-model', 'pi')
  return { owned, ordinary, suffix, workspaceId }
}

describe('P04-S01 Main search and projection desktop boundary', () => {
  test('search by body, title, and blank reference query excludes review owner', async () => {
    const { owned, ordinary, suffix, workspaceId } = fixture()
    const marker = `unique-content-${suffix}`
    appendAgentMessage(owned.id, { id: randomUUID(), role: 'user', content: marker } as never)
    appendAgentMessage(ordinary.id, { id: randomUUID(), role: 'user', content: marker } as never)
    const hits = await searchAgentSessionMessages(marker)
    expect(hits.map(h => h.sessionId)).toContain(ordinary.id)
    expect(hits.map(h => h.sessionId)).not.toContain(owned.id)
    const recent = searchAgentSessionReferences({ workspaceId, query: '', limit: 25 })
    expect(recent.map(h => h.sessionId)).toContain(ordinary.id)
    expect(recent.map(h => h.sessionId)).not.toContain(owned.id)
    const titled = searchAgentSessionReferences({ workspaceId, query: suffix, limit: 25 })
    expect(titled.map(h => h.sessionId)).toContain(ordinary.id)
    expect(titled.map(h => h.sessionId)).not.toContain(owned.id)
    const bodyHits = searchAgentSessionReferences({ workspaceId, query: marker, limit: 25 })
    expect(bodyHits.map(h => h.sessionId)).toContain(ordinary.id)
    expect(bodyHits.map(h => h.sessionId)).not.toContain(owned.id)
  })

  test('archived count excludes owned sessions and automatic archiving leaves owners unchanged', () => {
    const { owned, ordinary } = fixture()
    updateAgentSessionMeta(owned.id, { archived: true })
    updateAgentSessionMeta(ordinary.id, { archived: true })
    const before = countArchivedAgentSessions()
    expect(before).toBeGreaterThanOrEqual(1)
    updateAgentSessionMeta(owned.id, { archived: false })
    expect(countArchivedAgentSessions()).toBe(before)
    // threshold=-1 days makes all current ordinary sessions old enough.
    const autoArchived = autoArchiveAgentSessions(-1)
    expect(autoArchived).toBeGreaterThanOrEqual(0)
    expect(getAgentSessionMeta(owned.id)?.archived).toBe(false)
    expect(getAgentSessionMeta(ordinary.id)?.archived).toBe(true)
  })

  test('desktop orphan health inventory excludes review owner IDs and titles', () => {
    const { owned, ordinary } = fixture()
    const health = findOrphanSessions()
    expect(health.some(item => item.sessionId === owned.id)).toBe(false)
    expect(health.some(item => item.title === owned.title)).toBe(false)
    expect(health.some(item => item.sessionId === ordinary.id)).toBe(true)
  })

  test('known review owner produces zero UI projection upserts; ordinary metadata updates remain visible', () => {
    const { owned, ordinary } = fixture()
    const events: Array<{ id: string; kind: string }> = []
    const bus = new AgentEventBus()
    bus.on((id, payload) => events.push({ id, kind: payload.kind }))
    configureAgentSessionProjectionPublisher(bus)
    publishAgentSessionProjection(owned)
    updateAgentSessionUiMeta(owned.id, { title: 'internal-updated' })
    expect(events.some(v => v.id === owned.id)).toBeFalse()
    updateAgentSessionUiMeta(ordinary.id, { title: 'public-updated' })
    expect(events).toContainEqual({ id: ordinary.id, kind: 'session_projection' })
    expect(getAgentSessionMeta(owned.id)?.title).toBe('internal-updated')
  })
})
