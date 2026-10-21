import { describe, expect, test } from 'bun:test'
import {
  REVIEW_C0_SCHEMA_VERSION, type RunEvidenceIdentity,
  type SourceIdentity,
} from '@profer/shared'
import type {
  C2MainHostWitness, C2MainOwnerWitness,
} from './review-v3-main-trust-port'
import { C2MainPhysicalHostReceiptRegistry } from './review-v3-main-host-receipt-registry'

let serial = 0
function fixture() {
  const id = 'c2-registry-' + ++serial
  const run: RunEvidenceIdentity = {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION, caseId: id,
    runId: 'run-' + id, attemptId: 'attempt-1', caseRevision: 1,
    planFingerprint: 'a'.repeat(64), templateVersion: '1',
    inputManifestHash: 'b'.repeat(64), ownerGeneration: 4,
    sourceVersionIds: ['v1'], checkKeys: ['c1'],
  }
  const source: SourceIdentity = {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION, caseId: id,
    materialId: 'doc1', documentVersionId: 'v1',
    rawSha256: 'c'.repeat(64), parseRevision: 'p1',
    blockId: 'block-1', location: { kind: 'paragraph', locator: 'p1' },
  }
  const host: C2MainHostWitness = {
    run, permissionGrantId: 'main-grant-4',
    hostReceiptId: 'host-physical-' + id,
    verified: {
      permissionGrantId: 'main-grant-4', kind: 'read',
      source, extent: 'block',
    },
  }
  const observed = new Map<string, C2MainHostWitness>()
  let active = true
  let grant = 'main-grant-4'
  let manifest = run.inputManifestHash
  const registry = new C2MainPhysicalHostReceiptRegistry({
    getObservedPhysicalReceipt: id => observed.get(id),
    getCurrentOwner: _identity => active ? {
      run, permissionGrantId: grant,
      ownerGeneration: 4, inputManifestHash: manifest, active,
    } satisfies C2MainOwnerWitness : undefined,
  })
  return {
    run, host, registry, observed,
    observe: () => observed.set(host.hostReceiptId, structuredClone(host)),
    revoke: () => { active = false },
    rotate: () => { grant = 'rotated-grant-5' },
    changeManifest: () => { manifest = 'd'.repeat(64) },
  }
}

describe('C2-R03 Main physical Host receipt registry', () => {
  test('no Main observer means no registry and no self-certified DTO ingestion', () => {
    expect(() => new C2MainPhysicalHostReceiptRegistry({} as never)).toThrow()
    const f = fixture()
    expect(f.registry.getPhysicalHostReceipt(f.host.hostReceiptId)).toBeUndefined()
    expect(() => f.registry.rememberObservedReceipt(f.host.hostReceiptId))
      .toThrow('independently')
  })

  test('accepts physical observer exactly once, clones result, and fails when source disappears', () => {
    const f = fixture()
    f.observe()
    f.registry.rememberObservedReceipt(f.host.hostReceiptId)
    f.registry.rememberObservedReceipt(f.host.hostReceiptId)
    const value = f.registry.getPhysicalHostReceipt(f.host.hostReceiptId)
    expect(value?.verified.kind).toBe('read')
    if (!value) throw Error('missing observed evidence')
    value.permissionGrantId = 'forged-copy'
    expect(f.registry.getPhysicalHostReceipt(f.host.hostReceiptId)?.permissionGrantId)
      .toBe('main-grant-4')
    f.observed.delete(f.host.hostReceiptId)
    expect(f.registry.getPhysicalHostReceipt(f.host.hostReceiptId)).toBeUndefined()
  })

  test('revoked Owner, rotated grant and changed manifest invalidate read-back', () => {
    const f = fixture()
    f.observe()
    f.registry.rememberObservedReceipt(f.host.hostReceiptId)
    f.revoke()
    expect(f.registry.getPhysicalHostReceipt(f.host.hostReceiptId)).toBeUndefined()
    const g = fixture()
    g.observe()
    g.registry.rememberObservedReceipt(g.host.hostReceiptId)
    g.rotate()
    expect(g.registry.getPhysicalHostReceipt(g.host.hostReceiptId)).toBeUndefined()
    const h = fixture()
    h.observe()
    h.registry.rememberObservedReceipt(h.host.hostReceiptId)
    h.changeManifest()
    expect(h.registry.getPhysicalHostReceipt(h.host.hostReceiptId)).toBeUndefined()
  })

  test('physical receipt bound to another attempt cannot be registered under current Main Owner', () => {
    const f = fixture()
    f.observe()
    const other = { ...f.host, run: { ...f.run, attemptId: 'different' } }
    f.observed.set(f.host.hostReceiptId, other)
    // A Main Owner registry returns the real pinned Run, not the candidate
    // receipt's requested Run. No synthetic echo of an attacker run is valid.
    expect(() => f.registry.rememberObservedReceipt(f.host.hostReceiptId))
      .toThrow('Owner')
    expect(f.registry.getPhysicalHostReceipt(f.host.hostReceiptId)).toBeUndefined()
    f.observe()
    f.registry.rememberObservedReceipt(f.host.hostReceiptId)
    expect(f.registry.getPhysicalHostReceipt(f.host.hostReceiptId)?.run.attemptId)
      .toBe('attempt-1')
  })

  test('source version mismatch and rebound physical ID are rejected', () => {
    const f = fixture()
    f.observed.set(f.host.hostReceiptId, {
      ...f.host, verified: { ...f.host.verified, source: {
        ...f.host.verified.source!, documentVersionId: 'not-in-run',
      } },
    })
    expect(() => f.registry.rememberObservedReceipt(f.host.hostReceiptId))
      .toThrow('manifest')
    f.observe()
    f.registry.rememberObservedReceipt(f.host.hostReceiptId)
    f.observed.set(f.host.hostReceiptId, {
      ...f.host, verified: { ...f.host.verified, extent: 'full-document' },
    })
    expect(() => f.registry.rememberObservedReceipt(f.host.hostReceiptId))
      .toThrow('rebound')
    expect(f.registry.getPhysicalHostReceipt(f.host.hostReceiptId)).toBeUndefined()
  })

  test('invalidateRun and close cannot resurrect a previously observed ID', () => {
    const f = fixture()
    f.observe()
    f.registry.rememberObservedReceipt(f.host.hostReceiptId)
    f.registry.invalidateRun(f.run)
    expect(f.registry.getPhysicalHostReceipt(f.host.hostReceiptId)).toBeUndefined()
    expect(() => f.registry.rememberObservedReceipt(f.host.hostReceiptId))
      .toThrow('Run invalidated')
    const g = fixture()
    g.observe()
    g.registry.rememberObservedReceipt(g.host.hostReceiptId)
    g.registry.close()
    expect(g.registry.getPhysicalHostReceipt(g.host.hostReceiptId)).toBeUndefined()
    expect(() => g.registry.rememberObservedReceipt(g.host.hostReceiptId))
      .toThrow('closed')
    const cold = fixture()
    expect(cold.registry.getPhysicalHostReceipt(g.host.hostReceiptId)).toBeUndefined()
  })
})

describe('C2-R06 Run-wide physical Host tombstone and late ingress regressions', () => {
  test('invalidating before first Host callback blocks a newly observed, never-registered physical ID', () => {
    const f = fixture()
    f.registry.invalidateRun(f.run)
    const neverSeen = {...structuredClone(f.host),
      hostReceiptId:'host-late-'+f.run.caseId}
    f.observed.set(neverSeen.hostReceiptId,neverSeen)
    expect(() => f.registry.rememberObservedReceipt(neverSeen.hostReceiptId))
      .toThrow('Run invalidated')
    expect(f.registry.getPhysicalHostReceipt(neverSeen.hostReceiptId)).toBeUndefined()
    // Repeated invalidate must be idempotent: no callback can restore this Run.
    f.registry.invalidateRun(f.run)
    expect(() => f.registry.rememberObservedReceipt(neverSeen.hostReceiptId))
      .toThrow('Run invalidated')
  })

  test('recycled Run identity remains barred across Owner generation and attempt mutations', () => {
    const f=fixture()
    const revivedRun:RunEvidenceIdentity={...structuredClone(f.run),
      attemptId:'attempt-new',ownerGeneration:f.run.ownerGeneration+1}
    const revived:C2MainHostWitness={...structuredClone(f.host),run:revivedRun,
      hostReceiptId:'host-rotated-'+f.run.caseId}
    const observed=new Map([[revived.hostReceiptId,revived]])
    const registry=new C2MainPhysicalHostReceiptRegistry({
      getObservedPhysicalReceipt:id=>observed.get(id),
      getCurrentOwner:run=>({
        run,active:true,ownerGeneration:revivedRun.ownerGeneration,
        inputManifestHash:revivedRun.inputManifestHash,
        permissionGrantId:revived.permissionGrantId,
      }),
    })
    registry.invalidateRun(f.run)
    expect(() => registry.rememberObservedReceipt(revived.hostReceiptId))
      .toThrow('Run invalidated')
    expect(registry.getPhysicalHostReceipt(revived.hostReceiptId)).toBeUndefined()
  })

  test('a distinct new Run ID under the same Case may proceed with an independent live Owner', () => {
    const f=fixture()
    const nextRun:RunEvidenceIdentity={...structuredClone(f.run),
      runId:'fresh-'+f.run.runId,attemptId:'fresh-attempt'}
    const newer:C2MainHostWitness={...structuredClone(f.host),
      hostReceiptId:'host-fresh-'+f.run.caseId,run:nextRun}
    const observed=new Map<string,C2MainHostWitness>([
      [f.host.hostReceiptId,structuredClone(f.host)],
      [newer.hostReceiptId,newer],
    ])
    const registry=new C2MainPhysicalHostReceiptRegistry({
      getObservedPhysicalReceipt:id=>observed.get(id),
      getCurrentOwner:run=>({
        run,active:true,ownerGeneration:run.ownerGeneration,
        inputManifestHash:run.inputManifestHash,
        permissionGrantId:newer.permissionGrantId,
      }),
    })
    registry.rememberObservedReceipt(f.host.hostReceiptId)
    registry.invalidateRun(f.run)
    expect(registry.getPhysicalHostReceipt(f.host.hostReceiptId)).toBeUndefined()
    expect(() => registry.rememberObservedReceipt(f.host.hostReceiptId))
      .toThrow('Run invalidated')
    registry.rememberObservedReceipt(newer.hostReceiptId)
    expect(registry.getPhysicalHostReceipt(newer.hostReceiptId)?.run.runId)
      .toBe(nextRun.runId)
  })

  test('tombstone capacity never evicts old Runs to permit late receipt resurrection', () => {
    const f=fixture()
    f.observe()
    f.registry.invalidateRun(f.run)
    for(let i=0;i<8191;i++) f.registry.invalidateRun({
      ...f.run,runId:'blocked-'+i,
    })
    expect(() => f.registry.invalidateRun({...f.run,runId:'capacity-overflow'}))
      .toThrow('capacity exhausted')
    expect(f.registry.getPhysicalHostReceipt(f.host.hostReceiptId)).toBeUndefined()
    expect(() => f.registry.rememberObservedReceipt(f.host.hostReceiptId))
      .toThrow('closed')
  })
})
