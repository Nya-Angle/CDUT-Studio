/**
 * P04-TECHDEBT-01: real persisted-index cache invalidation and bounded
 * synthetic scale measurements; not production Electron or a GC policy.
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { performance } from 'node:perf_hooks'
import { fileURLToPath } from 'node:url'
import { getAgentSessionsIndexPath } from '../config-paths'
import { writeJsonFileAtomic } from '../safe-file'
import {
  assertOrdinaryAgentSession,
  createAgentSession, createReviewOwnedAgentSession, deleteAgentSession,
  getAgentSessionMeta, isReviewOwnedOrDeletedAgentSessionId, updateAgentSessionMeta,
} from '../agent-session-manager'

const root = mkdtempSync(join(tmpdir(), 'p04-tombstone-scale-'))
process.env.PROFER_CONFIG_DIR = root
afterAll(() => rmSync(root, { recursive: true, force: true }))

const uuid = (i: number) => `00000000-0000-4000-8000-${i.toString(16).padStart(12, '0')}`
const summary = (samples: number[]) => {
  const ordered = samples.slice().sort((a, b) => a - b)
  const at = (percentile: number) => Number(ordered[Math.ceil((ordered.length - 1) * percentile)]!.toFixed(4))
  return { p50_ms: at(0.5), p95_ms: at(0.95) }
}

describe('P04-TECHDEBT-01 index-coupled owner membership', () => {
  test('index write, deletion, and stale ownerless event keep tombstone durable without GC', () => {
    const normal = createAgentSession('ordinary-index-cache', 'mock')
    const owner = createReviewOwnedAgentSession({ caseId: 'techdebt-' + randomUUID().slice(0, 8), title: 'review-private', channelId: 'mock' })
    expect(isReviewOwnedOrDeletedAgentSessionId(owner.id)).toBe(true)
    expect(isReviewOwnedOrDeletedAgentSessionId(normal.id)).toBe(false)
    deleteAgentSession(owner.id)
    expect(isReviewOwnedOrDeletedAgentSessionId(owner.id)).toBe(true)
    expect(() => assertOrdinaryAgentSession(owner.id)).toThrow('内部审核会话')
    updateAgentSessionMeta(normal.id, { title: 'ordinary-index-cache-updated' })
    expect(getAgentSessionMeta(normal.id)?.title).toBe('ordinary-index-cache-updated')
    expect(isReviewOwnedOrDeletedAgentSessionId(owner.id)).toBe(true)
    expect(isReviewOwnedOrDeletedAgentSessionId(normal.id)).toBe(false)
    expect(JSON.parse(readFileSync(getAgentSessionsIndexPath(), 'utf8')).reviewOwnerDeletionTombstones).toContain(owner.id)
  })

  test('external index replacement forces membership rebuild and legacy missing field stays valid', () => {
    const path = getAgentSessionsIndexPath()
    const deletedId = randomUUID()
    const activeId = randomUUID()
    const oldIndex = { version: 1, sessions: [{ id: activeId, title: 'normal external', channelId: 'mock', agentRuntime: 'pi', createdAt: 1, updatedAt: 1 }] }
    writeJsonFileAtomic(path, oldIndex)
    expect(isReviewOwnedOrDeletedAgentSessionId(activeId)).toBe(false)
    expect(isReviewOwnedOrDeletedAgentSessionId(deletedId)).toBe(false)
    const imported = { ...oldIndex, reviewOwnerDeletionTombstones: [deletedId] }
    writeJsonFileAtomic(path, imported)
    expect(isReviewOwnedOrDeletedAgentSessionId(deletedId)).toBe(true)
    expect(() => assertOrdinaryAgentSession(deletedId)).toThrow('内部审核会话')
    const ownerIndex = { ...imported, sessions: [{ ...oldIndex.sessions[0]!, owner: { kind: 'review-case', caseId: 'external-active' } }] }
    writeJsonFileAtomic(path, ownerIndex)
    expect(isReviewOwnedOrDeletedAgentSessionId(activeId)).toBe(true)
    writeJsonFileAtomic(path, imported)
    // P06-FIX-01: removing a live owner from an externally restored index must
    // not silently demote it into an ordinary session. The independent ID-only
    // deny journal is monotonic, just like deletion tombstones.
    expect(isReviewOwnedOrDeletedAgentSessionId(activeId)).toBe(true)
    expect(() => assertOrdinaryAgentSession(activeId)).toThrow('内部审核会话')
    expect(isReviewOwnedOrDeletedAgentSessionId(deletedId)).toBe(true)
  })

  test('failed atomic index write cannot leave the in-memory membership authoritative', () => {
    const oldOwner = createReviewOwnedAgentSession({ caseId: 'failed-write-' + randomUUID().slice(0, 8), title: 'write-fail-owner', channelId: 'mock' })
    const path = getAgentSessionsIndexPath()
    const tmp = path + '.tmp'
    mkdirSync(tmp)
    try {
      expect(() => deleteAgentSession(oldOwner.id)).toThrow('写入 Agent 会话索引失败')
      expect(getAgentSessionMeta(oldOwner.id)?.id).toBe(oldOwner.id)
      expect(isReviewOwnedOrDeletedAgentSessionId(oldOwner.id)).toBe(true)
    } finally {
      rmSync(tmp, { recursive: true, force: true })
    }
    deleteAgentSession(oldOwner.id)
    expect(isReviewOwnedOrDeletedAgentSessionId(oldOwner.id)).toBe(true)
    expect(getAgentSessionMeta(oldOwner.id)).toBeUndefined()
  })

  test('a fresh Bun process reloads the persisted deleted-owner identity', () => {
    const owned = createReviewOwnedAgentSession({
      caseId: 'restart-' + randomUUID().slice(0, 8), title: 'private-restart-check', channelId: 'mock',
    })
    deleteAgentSession(owned.id)
    const moduleUrl = new URL('../agent-session-manager.ts', import.meta.url).href
    const script = `import { isReviewOwnedOrDeletedAgentSessionId as hidden } from ${JSON.stringify(moduleUrl)}; if (!hidden(${JSON.stringify(owned.id)})) process.exit(13)`
    const preload = fileURLToPath(new URL('../../../../../../test/preload-electron-mock.ts', import.meta.url))
    const child = spawnSync(process.execPath, ['--preload', preload, '-e', script], {
      env: { ...process.env, PROFER_CONFIG_DIR: root }, encoding: 'utf8', timeout: 20_000,
    })
    if (child.status !== 0) {
      throw new Error('Restart probe exited ' + child.status + ': ' + (child.stderr || child.stdout).slice(-2500))
    }
    expect(child.signal).toBeNull()
  })

  test('0 / 1k / 10k / 100k UUID tombstone persisted-index benchmarks (non-gating)', () => {
    const path = getAgentSessionsIndexPath()
    const records: Array<Record<string, unknown>> = []
    for (const count of [0, 1_000, 10_000, 100_000]) {
      const tombstones = Array.from({ length: count }, (_, i) => uuid(i + 1))
      const ordinary = { id: 'benchmark-ordinary', title: 'bench', channelId: 'mock', agentRuntime: 'pi', createdAt: 1, updatedAt: 1 }
      const index = { version: 1, sessions: [ordinary], reviewOwnerDeletionTombstones: tombstones }
      const initialWriteStart = performance.now()
      writeJsonFileAtomic(path, index)
      const seedWriteMs = performance.now() - initialWriteStart
      const lookupId = count ? tombstones[count - 1]! : 'missing-bench-id'
      const coldStart = performance.now()
      const answer = isReviewOwnedOrDeletedAgentSessionId(lookupId)
      const coldLoadMs = performance.now() - coldStart
      expect(answer).toBe(count > 0)
      expect(isReviewOwnedOrDeletedAgentSessionId('nonexistent-' + randomUUID())).toBe(false)
      const samples: number[] = []
      for (let i = 0; i < 512; i++) {
        const begin = performance.now()
        const allowed = isReviewOwnedOrDeletedAgentSessionId(i % 2 ? lookupId : 'ordinary-id-not-in-index')
        expect(allowed).toBe(i % 2 === 1 && count > 0)
        samples.push(performance.now() - begin)
      }
      // Equivalent old hot path after a cache hit: stat + linear tombstone search.
      // It is an explicit reference comparison, not a pre-change CI result.
      const linearSamples: number[] = []
      for (let i = 0; i < 512; i++) {
        const begin = performance.now()
        statSync(path)
        const found = tombstones.includes(i % 2 ? lookupId : 'ordinary-id-not-in-index')
        expect(found).toBe(i % 2 === 1 && count > 0)
        linearSamples.push(performance.now() - begin)
      }
      const writeStart = performance.now()
      updateAgentSessionMeta(ordinary.id, { title: 'bench-' + count })
      const indexedWriteMs = performance.now() - writeStart
      expect(isReviewOwnedOrDeletedAgentSessionId(lookupId)).toBe(count > 0)
      records.push({
        tombstones: count, index_bytes: statSync(path).size,
        cold_load_ms: Number(coldLoadMs.toFixed(3)),
        seed_atomic_write_ms: Number(seedWriteMs.toFixed(3)),
        index_update_ms: Number(indexedWriteMs.toFixed(3)),
        hot_guard: summary(samples), linear_reference: summary(linearSamples),
      })
    }
    console.log('P04_TECHDEBT_01_BENCHMARK=' + JSON.stringify({ platform: process.platform, arch: process.arch, sample_size: 512, measurements: records }))
  })
})
