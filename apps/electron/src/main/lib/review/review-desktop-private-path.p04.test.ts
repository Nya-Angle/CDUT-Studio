/**
 * P04-PATH-01 path-only desktop preview / filesystem protocol boundary.
 * Synthetic fixtures, no real Electron window and no actual user files.
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import {
  createAgentSession, createReviewOwnedAgentSession, deleteAgentSession,
} from '../agent-session-manager'
import { createAgentWorkspace } from '../agent-workspace-manager'
import { getAgentSessionMessagesPath, getAgentSessionWorkspacePath, getAgentSessionsDir, getAgentWorkspacesDir, getConfigDir, getPiCheckpointsDir, getWorkspaceFilesDir } from '../config-paths'
import { filterOrdinaryDesktopFileEntries, isReviewPrivateDesktopPath, isUnsafeAgentWorkspaceMutationPath, renameOrdinaryAgentFileEntry } from '../review-private-file-access'
import { isReadOnlyPreviewPathAllowed } from '../preview-path-policy'
import { registerProferDirectoryPath, registerProferFilePath, handleProferFileRequest } from '../local-file-protocol'
import { searchFileCandidate } from '../file-search-service'

const sandbox = mkdtempSync(join(tmpdir(), 'p04-path-sandbox-'))
process.env.PROFER_CONFIG_DIR = sandbox
afterAll(() => rmSync(sandbox, { recursive: true, force: true }))
function file(path: string, content = 'synthetic') {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
  return path
}
function fixture() {
  const key = randomUUID().slice(0, 9)
  const ws = createAgentWorkspace('P04 Path ' + key)
  const normal = createAgentSession('ordinary-' + key, 'mock', ws.id)
  const owner = createReviewOwnedAgentSession({
    caseId: 'p04-' + key, title: 'private-' + key, channelId: 'mock', workspaceId: ws.id,
  })
  const root = getAgentSessionWorkspacePath(ws.slug, owner.id)
  const normalFile = file(join(getAgentSessionWorkspacePath(ws.slug, normal.id), 'normal.md'), 'ordinary-data')
  const secret = file(join(root, 'private.md'), 'secret-data')
  const shared = file(join(getWorkspaceFilesDir(ws.slug), 'shared.md'), 'shared-data')
  return { ws, owner, normal, root, normalFile, secret, shared }
}
describe('P04-PATH-01 desktop path-only private owner exclusion', () => {
  test('private folder and file are denied even when ordinary same-workspace files are allowed', () => {
    const { root, secret, shared, normalFile } = fixture()
    expect(isReviewPrivateDesktopPath(root)).toBe(true)
    expect(isReviewPrivateDesktopPath(secret)).toBe(true)
    expect(isReadOnlyPreviewPathAllowed(secret)).toBe(false)
    expect(isReadOnlyPreviewPathAllowed(root)).toBe(false)
    expect(isReviewPrivateDesktopPath(shared)).toBe(false)
    expect(isReadOnlyPreviewPathAllowed(shared)).toBe(true)
    expect(isReadOnlyPreviewPathAllowed(normalFile)).toBe(true)
  })

  test('realpath symlink aliases from a shared workspace or outside config cannot bypass the fence', () => {
    const { ws, root, secret, shared } = fixture()
    const alias = join(getWorkspaceFilesDir(ws.slug), 'link-private.md')
    const dirAlias = join(getWorkspaceFilesDir(ws.slug), 'link-private-dir')
    symlinkSync(secret, alias)
    symlinkSync(root, dirAlias, 'dir')
    const outerAlias = join(sandbox + '-outer-alias', 'private.md')
    mkdirSync(dirname(outerAlias), { recursive: true })
    symlinkSync(secret, outerAlias)
    for (const path of [alias, dirAlias, join(dirAlias, 'private.md'), outerAlias]) {
      expect(isReviewPrivateDesktopPath(path)).toBe(true)
      expect(isReadOnlyPreviewPathAllowed(path)).toBe(false)
    }
    expect(isReviewPrivateDesktopPath(shared)).toBe(false)
  })

  test('review transcript and checkpoint paths rejected; deleted owner tombstones remain guarded', () => {
    const { owner, root, secret } = fixture()
    const transcript = file(getAgentSessionMessagesPath(owner.id), 'synthetic-review-msg')
    const checkpoint = file(join(getPiCheckpointsDir(), owner.id, 'snapshot.bin'))
    for (const path of [transcript, checkpoint, root, secret]) expect(isReviewPrivateDesktopPath(path)).toBe(true)
    deleteAgentSession(owner.id)
    file(secret, 'synthetic-residual')
    for (const path of [transcript, checkpoint, root, secret]) {
      expect(isReviewPrivateDesktopPath(path)).toBe(true)
      expect(isReadOnlyPreviewPathAllowed(path)).toBe(false)
    }
  })

  test('listing policy hides private child entry names, not only read contents', () => {
    const { root, secret, normalFile, shared } = fixture()
    const visible = filterOrdinaryDesktopFileEntries([
      { path: root, name: 'owner-private' },
      { path: secret, name: 'private.md' },
      { path: normalFile, name: 'normal.md' },
      { path: shared, name: 'shared.md' },
    ])
    expect(visible.map(x => x.name)).toEqual(['normal.md', 'shared.md'])
  })

  test('destructive IPC must not mutate private roots or shared workspace containers', () => {
    const { ws, root, secret, normalFile, shared } = fixture()
    expect(isUnsafeAgentWorkspaceMutationPath(getAgentWorkspacesDir())).toBe(true)
    expect(isUnsafeAgentWorkspaceMutationPath(join(getAgentWorkspacesDir(), ws.slug))).toBe(true)
    expect(isUnsafeAgentWorkspaceMutationPath(root)).toBe(true)
    expect(isUnsafeAgentWorkspaceMutationPath(secret)).toBe(true)
    expect(isUnsafeAgentWorkspaceMutationPath(normalFile)).toBe(false)
    expect(isUnsafeAgentWorkspaceMutationPath(shared)).toBe(false)
  })

  test('token-gated local file protocol cannot register private direct file or root', () => {
    const { root, secret, shared } = fixture()
    expect(() => registerProferFilePath(secret)).toThrow('审核内部会话路径不可注册')
    expect(() => registerProferDirectoryPath(root)).toThrow('审核内部会话路径不可注册')
    expect(registerProferFilePath(shared)).toMatch(/^cdut-file:\/\//)
  })

  test('directory URL registered for ordinary shared parent cannot fetch a private descendant', async () => {
    const { ws, owner, secret } = fixture()
    const parent = join(getAgentWorkspacesDir(), ws.slug)
    const url = registerProferDirectoryPath(parent)
    const request = new Request(url + '/' + encodeURIComponent(owner.id) + '/private.md')
    const response = await handleProferFileRequest(request)
    expect(response.status).toBe(403)
    expect(existsSync(secret)).toBe(true)
  })

  test('ordinary file candidate search never returns hidden review file names from shared parent roots', async () => {
    const { ws, secret, normalFile } = fixture()
    const parent = join(getAgentWorkspacesDir(), ws.slug)
    const hidden = await searchFileCandidate({ requestId: 'private', targetName: 'private.md', roots: [parent], maxDepth: 3, denyPath: isReviewPrivateDesktopPath })
    expect(hidden.candidates).toEqual([])
    const normal = await searchFileCandidate({ requestId: 'normal', targetName: 'normal.md', roots: [parent], maxDepth: 3, denyPath: isReviewPrivateDesktopPath })
    expect(normal.candidates?.map(x => x.path)).toContain(normalFile)
    const explicit = await searchFileCandidate({ requestId: 'target', targetName: 'private.md', targetPath: secret, roots: [parent], maxDepth: 3, denyPath: isReviewPrivateDesktopPath })
    expect(explicit.candidates).toEqual([])
  })

  test('directory URL remains denied after owner deletion even if original token stays valid', async () => {
    const { ws, owner, secret } = fixture()
    const url = registerProferDirectoryPath(join(getAgentWorkspacesDir(), ws.slug))
    deleteAgentSession(owner.id)
    file(secret, 'residual-secret')
    const response = await handleProferFileRequest(new Request(url + '/' + owner.id + '/private.md'))
    expect(response.status).toBe(403)
  })
  test('actual guarded rename cannot overwrite an existing review transcript; ordinary rename still works', () => {
    const { owner } = fixture()
    const normal = file(join(getAgentSessionsDir(), 'ordinary-' + randomUUID() + '.jsonl'), 'ordinary-transcript')
    const secret = file(getAgentSessionMessagesPath(owner.id), 'protected-transcript')
    expect(() => renameOrdinaryAgentFileEntry(normal, secret)).toThrow('审核内部或共享容器路径不可操作')
    expect(readFileSync(normal, 'utf8')).toBe('ordinary-transcript')
    expect(readFileSync(secret, 'utf8')).toBe('protected-transcript')

    const renamed = join(getAgentSessionsDir(), 'renamed-' + randomUUID() + '.jsonl')
    renameOrdinaryAgentFileEntry(normal, renamed)
    expect(existsSync(normal)).toBe(false)
    expect(readFileSync(renamed, 'utf8')).toBe('ordinary-transcript')
  })

  test('actual guarded move cannot create a previously absent file under review workspace', () => {
    const { root, normalFile } = fixture()
    const destination = join(root, 'injected.md')
    expect(existsSync(destination)).toBe(false)
    expect(() => renameOrdinaryAgentFileEntry(normalFile, destination)).toThrow('审核内部或共享容器路径不可操作')
    expect(existsSync(normalFile)).toBe(true)
    expect(existsSync(destination)).toBe(false)
  })

  test('missing target behind a symlinked parent is guarded, while ordinary workspace moves succeed', () => {
    const { ws, root, normalFile } = fixture()
    const alias = join(getWorkspaceFilesDir(ws.slug), 'alias-' + randomUUID())
    symlinkSync(root, alias, 'dir')
    const absentPrivateTarget = join(alias, 'new-secret.md')
    expect(existsSync(absentPrivateTarget)).toBe(false)
    expect(isReviewPrivateDesktopPath(absentPrivateTarget)).toBe(true)
    expect(() => renameOrdinaryAgentFileEntry(normalFile, absentPrivateTarget)).toThrow('审核内部或共享容器路径不可操作')
    expect(existsSync(normalFile)).toBe(true)

    const normalDestination = join(getWorkspaceFilesDir(ws.slug), 'moved-' + randomUUID() + '.md')
    renameOrdinaryAgentFileEntry(normalFile, normalDestination)
    expect(existsSync(normalFile)).toBe(false)
    expect(readFileSync(normalDestination, 'utf8')).toBe('ordinary-data')
  })

  test('deleted review tombstone prevents actual rename into leftover private path', () => {
    const { owner } = fixture()
    const normal = file(join(getAgentSessionsDir(), 'ordinary-' + randomUUID() + '.jsonl'), 'ordinary-before-delete')
    deleteAgentSession(owner.id)
    const deletedTarget = getAgentSessionMessagesPath(owner.id)
    expect(isReviewPrivateDesktopPath(deletedTarget)).toBe(true)
    expect(() => renameOrdinaryAgentFileEntry(normal, deletedTarget)).toThrow('审核内部或共享容器路径不可操作')
    expect(readFileSync(normal, 'utf8')).toBe('ordinary-before-delete')
    expect(existsSync(deletedTarget)).toBe(false)
  })

  test('actual guarded mutations refuse shared workspace container changes', () => {
    const { ws, normalFile } = fixture()
    expect(() => renameOrdinaryAgentFileEntry(join(getAgentWorkspacesDir(), ws.slug), normalFile))
      .toThrow('审核内部或共享容器路径不可操作')
    expect(existsSync(normalFile)).toBe(true)
  })

})
