/**
 * P05-S04 controlled remote snapshot/replay/search/indirect-ID owner isolation.
 * No live Pocket, Relay or Feishu connection; only synthetic disk and in-process command tests.
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { randomUUID } from 'node:crypto'
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import type { AgentStreamPayload } from '@profer/shared'
import { createAgentSession, createReviewOwnedAgentSession, deleteAgentSession, isReviewOwnedOrDeletedAgentSessionId, updateAgentSessionMeta } from '../agent-session-manager'
import { createAgentWorkspace } from '../agent-workspace-manager'
import { getAgentSessionWorkspacePath, getAgentWorkspacePath, getConfigDir, getWorkspaceFilesDir } from '../config-paths'
import { isReviewPrivateConfigPath } from '../remote-file-access'
import { RemoteAgentEventLog } from '../remote-agent-event-log'
import { handleRemoteCommand, selectOrdinaryRemoteReplayRecords } from '../remote-service'
import { searchRemoteWorkspaceFiles } from '../remote-workspace-file-search'

const root = mkdtempSync(join(tmpdir(), 'p05-reconnect-search-'))
process.env.PROFER_CONFIG_DIR = root
afterAll(() => rmSync(root, { recursive: true, force: true }))
const cmd = (type: string, fields: Record<string, unknown> = {}) => handleRemoteCommand(JSON.stringify({ type, ...fields }))
function write(path: string, text = 'synthetic') {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, text)
  return path
}
function fixture() {
  const suffix = randomUUID().slice(0, 9)
  const workspace = createAgentWorkspace('p05-ws-' + suffix)
  const normal = createAgentSession('normal-' + suffix, 'mock', workspace.id)
  const owner = createReviewOwnedAgentSession({ caseId: 'private-' + suffix, title: 'private-' + suffix, channelId: 'mock', workspaceId: workspace.id })
  const normalRoot = getAgentSessionWorkspacePath(workspace.slug, normal.id)
  const ownerRoot = getAgentSessionWorkspacePath(workspace.slug, owner.id)
  const normalFile = write(join(normalRoot, 'normal-note.md'))
  const privateFile = write(join(ownerRoot, 'private-case-document.md'))
  const sharedFile = write(join(getWorkspaceFilesDir(workspace.slug), 'public-note.md'))
  const deny = (path: string) => isReviewPrivateConfigPath(path, getConfigDir(), isReviewOwnedOrDeletedAgentSessionId)
  return { workspace, normal, owner, normalRoot, ownerRoot, normalFile, privateFile, sharedFile, deny }
}
describe('P05-S04 Pocket reconnect, snapshot and search', () => {
  test('session-list and runtime-context snapshot exclude owner before and after deletion', async () => {
    const { normal, owner } = fixture()
    for (const deleted of [false, true]) {
      const list = await cmd('list_sessions')
      expect(list.ok).toBe(true)
      if (list.ok) {
        const ids = (list.data as Array<{ id: string }>).map(x => x.id)
        expect(ids).toContain(normal.id)
        expect(ids).not.toContain(owner.id)
      }
      const contexts = await cmd('get_agent_runtime_contexts', { sessionIds: [normal.id, owner.id] })
      expect(contexts.ok).toBe(true)
      if (contexts.ok) expect((contexts.data as Array<{ sessionId: string }>).some(x => x.sessionId === owner.id)).toBe(false)
      if (!deleted) deleteAgentSession(owner.id)
    }
  })

  test('Pocket search retains ordinary session and shared files but hides attached private owner paths', async () => {
    const { normal, ownerRoot, privateFile, sharedFile } = fixture()
    updateAgentSessionMeta(normal.id, { attachedDirectories: [ownerRoot], attachedFiles: [privateFile] })
    const result = await cmd('search_workspace_files', { sessionId: normal.id, query: '' })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const paths = (result.data as { entries: Array<{ path: string }> }).entries.map(x => x.path)
    expect(paths.some(x => x.includes('normal-note.md'))).toBe(true)
    expect(paths).toContain(sharedFile)
    expect(paths.some(x => x.includes('private-case-document.md'))).toBe(false)
    expect(paths).not.toContain(ownerRoot)
    expect(paths).not.toContain(privateFile)
  })

  test('search by private filename and stale parent directory remains empty after deletion', async () => {
    const { normal, owner, ownerRoot, privateFile, workspace } = fixture()
    updateAgentSessionMeta(normal.id, { attachedDirectories: [getAgentWorkspacePath(workspace.slug)] })
    for (const deleted of [false, true]) {
      const result = await cmd('search_workspace_files', { sessionId: normal.id, query: 'private-case' })
      expect(result.ok).toBe(true)
      if (result.ok) {
        const paths = (result.data as { entries: Array<{ path: string }> }).entries.map(x => x.path)
        expect(paths.some(x => x.includes(privateFile) || x.includes('private-case-document'))).toBe(false)
      }
      if (!deleted) {
        deleteAgentSession(owner.id)
        write(join(ownerRoot, 'private-case-document.md'))
      }
    }
  })

  test('search skips symlink aliases to private files and directories, including explicit attached paths', async () => {
    const { normal, workspace, ownerRoot, privateFile } = fixture()
    const sharedRoot = getWorkspaceFilesDir(workspace.slug)
    const fileAlias = join(sharedRoot, 'link-to-private.md')
    const dirAlias = join(sharedRoot, 'link-to-private-dir')
    symlinkSync(privateFile, fileAlias)
    symlinkSync(ownerRoot, dirAlias, 'dir')
    updateAgentSessionMeta(normal.id, { attachedFiles: [fileAlias], attachedDirectories: [dirAlias] })
    const result = await cmd('search_workspace_files', { sessionId: normal.id, query: '' })
    expect(result.ok).toBe(true)
    if (result.ok) {
      const paths = (result.data as { entries: Array<{ path: string }> }).entries.map(x => x.path)
      expect(paths).not.toContain(fileAlias)
      expect(paths).not.toContain(dirAlias)
      expect(paths.some(x => x.includes('private-case-document.md'))).toBe(false)
    }
  })

  test('pure search keeps normal attached paths when private filter is enabled', () => {
    const { workspace, normalRoot, normalFile, privateFile, deny } = fixture()
    const result = searchRemoteWorkspaceFiles({
      sessionRoot: normalRoot, workspaceRoot: getWorkspaceFilesDir(workspace.slug),
      sessionAttachedPaths: [normalFile, privateFile],
      denyPath: deny,
    })
    const paths = result.entries.map(x => x.path)
    expect(paths.some(x => x.includes('normal-note.md'))).toBe(true)
    expect(paths.some(x => x.includes('public-note.md'))).toBe(true)
    expect(paths).not.toContain(privateFile)
  })

  test('nested mention session IDs cannot inject private owner into an ordinary Pocket queue', async () => {
    const { normal, owner } = fixture()
    const hidden = await cmd('queue_message', { sessionId: normal.id, userMessage: 'synthetic', mentionedSessionIds: [owner.id] })
    expect(hidden).toEqual({ ok: false, error: '会话不存在' })
    deleteAgentSession(owner.id)
    const deleted = await cmd('queue_message', { sessionId: normal.id, userMessage: 'synthetic', mentionedSessionIds: [owner.id] })
    expect(deleted).toEqual({ ok: false, error: '会话不存在' })
    const ordinary = await cmd('queue_message', { sessionId: normal.id, userMessage: 'synthetic', mentionedSessionIds: [normal.id] })
    expect(ordinary).not.toEqual({ ok: false, error: '会话不存在' })
  })

  test('in-process reconnect replay filters stale owner records while preserving ordinary cursor order', () => {
    const { normal, owner } = fixture()
    const log = new RemoteAgentEventLog(10, 100_000)
    const payload = { kind: 'profer_event', event: { type: 'run_idle' } } as AgentStreamPayload
    log.append(normal.id, payload)
    // Synthetic pre-existing record: production remote never appends internal owner after P03.
    log.append(owner.id, payload)
    log.append(normal.id, payload)
    const before = selectOrdinaryRemoteReplayRecords(log.replayAfter(0).records)
    expect(before.map(x => x.eventId)).toEqual([1, 3])
    deleteAgentSession(owner.id)
    const after = selectOrdinaryRemoteReplayRecords(log.replayAfter(0).records)
    expect(after.map(x => x.eventId)).toEqual([1, 3])
    expect(selectOrdinaryRemoteReplayRecords(log.replayAfter(1).records).map(x => x.eventId)).toEqual([3])
  })

  test('out-of-window resume forces snapshot rather than incomplete private/event replay', () => {
    const { normal, owner } = fixture()
    const log = new RemoteAgentEventLog(2, 100_000)
    const payload = { kind: 'profer_event', event: { type: 'run_idle' } } as AgentStreamPayload
    log.append(normal.id, payload)
    log.append(owner.id, payload)
    log.append(normal.id, payload)
    const result = log.replayAfter(0)
    expect(result.requiresSnapshot).toBe(true)
    expect(selectOrdinaryRemoteReplayRecords(result.records)).toEqual([])
    const fresh = log.replayAfter(null)
    expect(fresh.requiresSnapshot).toBe(false)
    expect(fresh.records).toEqual([])
  })
})
