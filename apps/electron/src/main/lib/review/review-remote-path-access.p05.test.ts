/**
 * P05-S03: real disk and remote-command tests of Pocket's path-only surfaces.
 * Synthetic workspaces and attachments only; no provider, WS socket or real user data.
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import {
  createAgentSession, createReviewOwnedAgentSession, deleteAgentSession, updateAgentSessionMeta,
  isReviewOwnedOrDeletedAgentSessionId,
} from '../agent-session-manager'
import { createAgentWorkspace } from '../agent-workspace-manager'
import { getAgentSessionWorkspacePath, getAgentWorkspacePath, getAttachmentsDir, getConfigDir, getWorkspaceFilesDir } from '../config-paths'
import { isReviewPrivateConfigPath } from '../remote-file-access'
import { handleRemoteCommand } from '../remote-service'

const isolated = mkdtempSync(join(tmpdir(), 'p05-remote-path-'))
process.env.PROFER_CONFIG_DIR = isolated
afterAll(() => rmSync(isolated, { recursive: true, force: true }))
const cmd = (type: string, fields: Record<string, unknown>) => handleRemoteCommand(JSON.stringify({ type, ...fields }))
const denied = async (type: string, fields: Record<string, unknown>) => {
  const r = await cmd(type, fields)
  expect(r.ok).toBe(false)
  if (!r.ok) expect(r.error).toContain('不在当前会话授权范围')
}
function write(path: string, content: string) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
  return path
}
function fixture() {
  const key = randomUUID().slice(0, 9)
  const ws = createAgentWorkspace('P05 Path ' + key)
  const normal = createAgentSession('normal-' + key, 'mock', ws.id)
  const owner = createReviewOwnedAgentSession({ caseId: 'path-' + key, title: 'private-' + key, channelId: 'mock', workspaceId: ws.id })
  const normalFile = write(join(getAgentSessionWorkspacePath(ws.slug, normal.id), 'ordinary.txt'), 'ordinary-data')
  const privateFile = write(join(getAgentSessionWorkspacePath(ws.slug, owner.id), 'secret.txt'), 'review-secret')
  const sharedFile = write(join(getWorkspaceFilesDir(ws.slug), 'shared.txt'), 'shared-data')
  return { ws, normal, owner, normalFile, privateFile, sharedFile }
}
const aliases = ['resolve_and_read_file', 'read_file_as_data_url']

describe('P05-S03 path-only remote access isolation', () => {
  test('legacy Chat attachment reads work for relative and absolute paths strictly within attachment storage', async () => {
    const relative = 'synthetic-chat-' + randomUUID() + '/normal.txt'
    const absolute = write(join(getAttachmentsDir(), relative), 'normal-attachment')
    for (const path of [relative, absolute]) {
      const result = await cmd('chat_read_attachment', { localPath: path })
      expect(result.ok).toBe(true)
      if (result.ok) expect(Buffer.from(result.data as string, 'base64').toString()).toBe('normal-attachment')
    }
    expect((await cmd('chat_delete_attachment', { localPath: relative })).ok).toBe(true)
    expect(existsSync(absolute)).toBe(false)
  })

  test('legacy Chat cannot read or delete private review files, app config or symlink escape', async () => {
    const { privateFile, owner } = fixture()
    const configFile = write(join(getConfigDir(), 'other-sensitive-config.txt'), 'config-secret')
    const outside = write(join(getConfigDir() + '-outside', 'trick.txt'), 'prefix-trick')
    const escape = join(getAttachmentsDir(), 'synthetic-chat-' + randomUUID(), 'escape.txt')
    mkdirSync(dirname(escape), { recursive: true })
    symlinkSync(privateFile, escape)
    for (const path of [privateFile, configFile, outside, escape, '../agent-workspaces/' + owner.id]) {
      expect((await cmd('chat_read_attachment', { localPath: path })).ok).toBe(false)
      expect((await cmd('chat_delete_attachment', { localPath: path })).ok).toBe(false)
    }
    expect(readFileSync(privateFile, 'utf8')).toBe('review-secret')
    expect(readFileSync(configFile, 'utf8')).toBe('config-secret')
  })

  test('ordinary Pocket reads own session and shared workspace files under both preview aliases', async () => {
    const { normal, normalFile, sharedFile } = fixture()
    for (const type of aliases) {
      expect((await cmd(type, { sessionId: normal.id, filePath: normalFile })).ok).toBe(true)
      expect((await cmd(type, { access: { sessionId: normal.id }, filePath: sharedFile })).ok).toBe(true)
      expect((await cmd(type, { sessionId: normal.id, filePath: 'shared.txt' })).ok).toBe(true)
    }
  })

  test('a broad shared workspace root does not grant ordinary Pocket access to private sibling session', async () => {
    const { owner, normal, privateFile, ws } = fixture()
    for (const type of aliases) {
      await denied(type, { sessionId: normal.id, filePath: privateFile })
      await denied(type, { access: { sessionId: normal.id }, filePath: privateFile })
      await denied(type, { sessionId: normal.id, filePath: owner.id + '/secret.txt' })
    }
    deleteAgentSession(owner.id)
    // Simulate a delayed file still residing at the deleted owner location.
    const oldFile = write(join(getAgentWorkspacePath(ws.slug), owner.id, 'old-review.txt'), 'old-secret')
    expect(isReviewOwnedOrDeletedAgentSessionId(owner.id)).toBe(true)
    await denied('resolve_and_read_file', { sessionId: normal.id, filePath: oldFile })
  })

  test('symlink aliases and even explicitly attached private roots/files cannot override owner fence', async () => {
    const { normal, owner, privateFile, ws } = fixture()
    const alias = join(getWorkspaceFilesDir(ws.slug), 'alias-secret.txt')
    symlinkSync(privateFile, alias)
    const rootAlias = join(getWorkspaceFilesDir(ws.slug), 'alias-owner-dir')
    symlinkSync(getAgentSessionWorkspacePath(ws.slug, owner.id), rootAlias, 'dir')
    updateAgentSessionMeta(normal.id, { attachedFiles: [privateFile], attachedDirectories: [getAgentSessionWorkspacePath(ws.slug, owner.id)] })
    for (const type of aliases) {
      await denied(type, { sessionId: normal.id, filePath: alias })
      await denied(type, { sessionId: normal.id, filePath: join(rootAlias, 'secret.txt') })
      await denied(type, { sessionId: normal.id, filePath: privateFile })
    }
  })

  test('remote realpath rejects cross-workspace traversal and outside symlink without breaking normal files', async () => {
    const { normal, ws, sharedFile } = fixture()
    const other = createAgentWorkspace('P05 Other ' + randomUUID().slice(0, 9))
    const external = write(join(getWorkspaceFilesDir(other.slug), 'other.txt'), 'outside-secret')
    const alias = join(getWorkspaceFilesDir(ws.slug), 'other-symlink.txt')
    symlinkSync(external, alias)
    await denied('resolve_and_read_file', { sessionId: normal.id, filePath: external })
    await denied('resolve_and_read_file', { sessionId: normal.id, filePath: alias })
    expect((await cmd('resolve_and_read_file', { sessionId: normal.id, filePath: sharedFile })).ok).toBe(true)
  })

  test('review-private file helper recognizes transcript/checkpoint paths and owner tombstones only', () => {
    const { owner, normal, ws } = fixture()
    const cfg = getConfigDir()
    const reviewFile = join(cfg, 'agent-workspaces', ws.slug, owner.id, 'review.txt')
    const ordinaryFile = join(cfg, 'agent-workspaces', ws.slug, normal.id, 'normal.txt')
    const transcript = join(cfg, 'agent-sessions', owner.id + '.jsonl')
    const checkpoint = join(cfg, 'agent-checkpoints', owner.id, 'snapshot')
    const checker = (path: string) => isReviewPrivateConfigPath(path, cfg, isReviewOwnedOrDeletedAgentSessionId)
    expect(checker(reviewFile)).toBe(true)
    expect(checker(ordinaryFile)).toBe(false)
    expect(checker(transcript)).toBe(true)
    expect(checker(checkpoint)).toBe(true)
    deleteAgentSession(owner.id)
    expect(checker(reviewFile)).toBe(true)
    expect(checker(transcript)).toBe(true)
  })
})
