/**
 * P06-FIX-01: old .bak must not erase ownership/deny knowledge.
 * Real on-disk index, real SDK JSONL getter, event & path predicates.
 * No production user data, provider, or actual socket is involved.
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const root = mkdtempSync(join(tmpdir(), 'p06-owner-recovery-'))
process.env.PROFER_CONFIG_DIR = root
afterAll(() => rmSync(root, { recursive: true, force: true }))
const manager = await import('./agent-session-manager')
const { getAgentSessionsIndexPath } = await import('./config-paths')
const { mayPublishAgentEventToRemote } = await import('./remote-service')
const { isReviewPrivateDesktopPath } = await import('./review-private-file-access')

const indexPath = () => getAgentSessionsIndexPath()
const fencePath = () => join(root, 'review-owner-ids.log')
const privateFile = (id: string) => join(root, 'agent-workspaces', 'default', id, 'synthetic-only.txt')
const owned = () => manager.createReviewOwnedAgentSession({
  caseId: 'synthetic-' + randomUUID(), title: '合成隐藏审核', channelId: 'mock-channel',
})
const ordinary = () => manager.createAgentSession('合成普通 Agent', 'mock-channel')

describe('P06-FIX-01 owner identity survives index recovery', () => {
  test('old pre-owner .bak rollback cannot open ordinary IPC, remote events or private paths', () => {
    const normal = ordinary()
    const owner = owned()
    const bak = JSON.parse(readFileSync(indexPath() + '.bak', 'utf8')) as { sessions: Array<{ id: string }> }
    expect(bak.sessions.some(s => s.id === owner.id)).toBeFalse()
    expect(existsSync(fencePath())).toBeTrue()
    const journal = readFileSync(fencePath(), 'utf8')
    expect(journal).toContain(owner.id)
    expect(journal).not.toContain(owner.owner!.caseId)
    writeFileSync(indexPath(), '{ broken synthetic main index')
    expect(() => manager.assertOrdinaryAgentSession(owner.id)).toThrow('内部审核会话')
    expect(mayPublishAgentEventToRemote(owner.id, { kind: 'sdk_message' })).toBeFalse()
    expect(isReviewPrivateDesktopPath(privateFile(owner.id))).toBeTrue()
    expect(manager.getAgentSessionMeta(owner.id)).toBeUndefined()
    expect(manager.getAgentSessionMeta(normal.id)?.id).toBe(normal.id)
    expect(() => manager.assertOrdinaryAgentSession(normal.id)).not.toThrow()
    expect(mayPublishAgentEventToRemote(normal.id)).toBeTrue()
    expect(isReviewPrivateDesktopPath(privateFile(normal.id))).toBeFalse()
  })

  test('both tombstoned and still-live owners survive recovery from an obsolete backup', () => {
    const owner = owned()
    manager.deleteAgentSession(owner.id)
    expect(manager.getAgentSessionMeta(owner.id)).toBeUndefined()
    // Simulate an obsolete but syntactically valid old index lacking its tombstone.
    const index = JSON.parse(readFileSync(indexPath(), 'utf8'))
    index.reviewOwnerDeletionTombstones = (index.reviewOwnerDeletionTombstones ?? []).filter((id: string) => id !== owner.id)
    writeFileSync(indexPath(), JSON.stringify(index, null, 2))
    expect(manager.isReviewOwnedOrDeletedAgentSessionId(owner.id)).toBeTrue()
    expect(() => manager.assertOrdinaryAgentSession(owner.id)).toThrow('内部审核会话')
  })

  test('missing metadata owner fields cannot turn a journalled owner into a normal session', () => {
    const owner = owned()
    const index = JSON.parse(readFileSync(indexPath(), 'utf8'))
    const row = index.sessions.find((x: { id: string }) => x.id === owner.id)
    delete row.owner
    writeFileSync(indexPath(), JSON.stringify(index, null, 2))
    expect(manager.isReviewOwnedOrDeletedAgentSessionId(owner.id)).toBeTrue()
    expect(mayPublishAgentEventToRemote(owner.id)).toBeFalse()
    expect(isReviewPrivateDesktopPath(privateFile(owner.id))).toBeTrue()
  })

  test('all three damaged index files must fail closed for owner and unknown IDs', () => {
    const owner = owned()
    const before = readFileSync(indexPath(), 'utf8')
    writeFileSync(indexPath(), '{ broken')
    writeFileSync(indexPath() + '.tmp', '{ broken')
    writeFileSync(indexPath() + '.bak', '{ broken')
    expect(manager.isReviewOwnedOrDeletedAgentSessionId(owner.id)).toBeTrue()
    expect(manager.isReviewOwnedOrDeletedAgentSessionId(randomUUID())).toBeTrue()
    expect(mayPublishAgentEventToRemote(owner.id)).toBeFalse()
    expect(isReviewPrivateDesktopPath(privateFile(owner.id))).toBeTrue()
    expect(() => manager.getAgentSessionMeta(randomUUID())).toThrow('索引损坏')
    writeFileSync(indexPath(), before)
    // readJsonFileSafe intentionally removes corrupt .tmp during recovery.
    if (existsSync(indexPath() + '.tmp')) unlinkSync(indexPath() + '.tmp')
    if (existsSync(indexPath() + '.bak')) unlinkSync(indexPath() + '.bak')
    expect(manager.isReviewOwnedOrDeletedAgentSessionId(owner.id)).toBeTrue()
  })


  test('a new Bun process still denies an orphaned owner after old index recovery', () => {
    const review = owned()
    const index = JSON.parse(readFileSync(indexPath(), 'utf8'))
    index.sessions = index.sessions.filter((s: { id: string }) => s.id !== review.id)
    writeFileSync(indexPath(), JSON.stringify(index, null, 2))
    const source = new URL('./agent-session-manager.ts', import.meta.url).href
    const preload = fileURLToPath(new URL('../../../../../test/preload-electron-mock.ts', import.meta.url))
    const child = spawnSync(process.execPath, ['--preload', preload, '-e',
      `import { isReviewOwnedOrDeletedAgentSessionId as deny } from ${JSON.stringify(source)}; if (!deny(${JSON.stringify(review.id)})) process.exit(13)`,
    ], { env: { ...process.env, PROFER_CONFIG_DIR: root }, encoding: 'utf8', timeout: 20000 })
    expect(child.status).toBe(0)
    expect(child.signal).toBeNull()
    expect(manager.isReviewOwnedOrDeletedAgentSessionId(review.id)).toBeTrue()
  })

  test('deny journal itself is private, while an ordinary workspace remains usable', () => {
    const normal = ordinary()
    expect(isReviewPrivateDesktopPath(fencePath())).toBeTrue()
    expect(isReviewPrivateDesktopPath(privateFile(normal.id))).toBeFalse()
    expect(() => manager.assertOrdinaryAgentSession(normal.id)).not.toThrow()
    expect(mayPublishAgentEventToRemote(normal.id)).toBeTrue()
  })

  test('valid old index owners are backfilled before a later backup rollback', () => {
    const normal = ordinary()
    const older = randomUUID()
    const data = JSON.parse(readFileSync(indexPath(), 'utf8'))
    data.sessions.push({ ...normal, id: older, owner: { kind: 'review-case', caseId: 'synthetic-legacy' } })
    writeFileSync(indexPath(), JSON.stringify(data, null, 2))
    expect(manager.getAgentSessionMeta(older)?.id).toBe(older)
    expect(readFileSync(fencePath(), 'utf8')).toContain(older)
    data.sessions = data.sessions.filter((s: { id: string }) => s.id !== older)
    writeFileSync(indexPath(), JSON.stringify(data, null, 2))
    expect(manager.isReviewOwnedOrDeletedAgentSessionId(older)).toBeTrue()
  })

  test('unwritable / invalid deny journal refuses new owner BEFORE index creation', () => {
    const previous = fencePath() + '.restore'
    renameSync(fencePath(), previous)
    mkdirSync(fencePath())
    try {
      expect(() => owned()).toThrow('审核会话身份安全记录')
    } finally {
      rmSync(fencePath(), { recursive: true, force: true })
      renameSync(previous, fencePath())
    }
    const normal = ordinary()
    expect(manager.isReviewOwnedOrDeletedAgentSessionId(normal.id)).toBeFalse()
  })

  test('torn deny journal fails closed rather than interpreting the partial line as ordinary', () => {
    const original = readFileSync(fencePath(), 'utf8')
    writeFileSync(fencePath(), original + 'bad-partial')
    try {
      expect(manager.isReviewOwnedOrDeletedAgentSessionId(randomUUID())).toBeTrue()
      expect(() => owned()).toThrow('不完整条目')
    } finally {
      writeFileSync(fencePath(), original)
    }
    expect(manager.isReviewOwnedOrDeletedAgentSessionId(randomUUID())).toBeFalse()
  })
})
