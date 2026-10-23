import { afterAll, describe, expect, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  REVIEW_C0_SCHEMA_VERSION, REVIEW_V3_EXECUTION_SCHEMA,
  type Actor, type CanonicalPlan, type ReviewCaseV2,
  type RunEvidenceIdentity, type SourceIdentity, type V3ExecutionProposal,
} from '@profer/shared'
import { createAggregate, readAggregate, writeAggregate } from './case-store-v2'
import { executionProposalId } from './review-v3-execution-contract'
import type { C2MainHostWitness, C2MainOwnerWitness } from './review-v3-main-trust-port'
import type { C2MainPiCreatedSession } from './review-v3-main-pi-factory'
import {
  C2MainTrustedExecutionAssembly, type C2MainTrustedAssemblyAuthority,
} from './review-v3-main-trusted-assembly'

const root = join(import.meta.dir, '../../../../../../work/tmp', `v3-c2-main-assembly-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root
afterAll(() => rmSync(root, { recursive: true, force: true }))
const actor: Actor = { actorId: 'c2-test-main-user', actorSource: 'local', role: 'reviewer' }
const physical = Buffer.from('physical source bytes for C2 Main R04 integrated authority')
const hash = createHash('sha256').update(physical).digest('hex')
let serial = 0

async function fixture() {
  const id = 'c2-assembly-' + ++serial
  const file = join(root, 'review-cases', id, 'source-docs', 'v1', 'original.txt')
  mkdirSync(join(root, 'review-cases', id, 'source-docs', 'v1'), { recursive: true })
  writeFileSync(file, physical)
  const run: RunEvidenceIdentity = {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION, caseId: id, runId: 'run-' + id,
    attemptId: 'attempt-1', caseRevision: 1,
    planFingerprint: 'a'.repeat(64), templateVersion: '1',
    inputManifestHash: 'b'.repeat(64), ownerGeneration: 3,
    sourceVersionIds: ['v1'], checkKeys: ['check-1'],
  }
  const plan: CanonicalPlan = {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION,
    planId: 'published-plan-test', fingerprint: run.planFingerprint,
    templateId: 'template-1', templateVersion: '1',
    moduleDigests: ['c'.repeat(64)],
    bindings: [{
      checkKey: 'check-1', targetKey: 'subject:s1', objectKey: 'proof',
      subjectId: 's1', applicability: 'applicable',
      sourceVersionIds: ['v1'], conditionFingerprint: 'd'.repeat(64),
    }],
  }
  const now = '2026-10-20T00:00:00Z'
  const state: ReviewCaseV2 = {
    id, title: 'Single Main authority test', templateId: 'template-1',
    templateVersion: 1, objectType: 'document', caseFields: {},
    subjects: [{
      id: 's1', type: 'item', title: 'One subject', fields: {},
      sourceRefs: [], correction: 'user-confirmed', status: 'identified',
    }],
    stage: 'reviewing', revision: 0, createdAt: now, updatedAt: now,
    documents: [{
      documentId: 'doc-1', versionId: 'v1', contentHash: hash, byteHash: hash,
      role: 'application', fileName: 'original.txt',
      mimeType: 'text/plain', sizeBytes: physical.length,
      assetPath: 'source-docs/v1/original.txt', parseRevision: 1,
      parseStatus: 'parsed', blocks: [{
        blockId: 'block-1', text: 'physical source bytes', kind: 'text',
        location: { kind: 'paragraph', index: 0 },
      }],
      usage: 'registered', active: true,
    }],
  }
  await createAggregate(id, state)
  const agg = readAggregate(id)!
  agg.canonicalPlan = plan
  writeAggregate(agg)
  let grant = 'physical-grant-3'
  let active = true
  let published = true
  let disposeCount = 0
  let createCount = 0
  let build: (() => Promise<C2MainPiCreatedSession>) | undefined
  const observed = new Map<string, C2MainHostWitness>()
  const source: SourceIdentity = {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION, caseId: id,
    materialId: 'doc-1', documentVersionId: 'v1',
    rawSha256: hash, parseRevision: 'p1', blockId: 'block-1',
    location: { kind: 'paragraph', locator: 'p1' },
  }
  const readBody = {
    schemaVersion: REVIEW_V3_EXECUTION_SCHEMA, run, sequence: 1,
    permissionGrantId: 'physical-grant-3', hostReceiptId: 'physical-read-' + id,
    kind: 'read' as const, read: { source, extent: 'block' as const },
  }
  const event: V3ExecutionProposal = { ...readBody, eventId: executionProposalId(readBody) }
  const freshSession = (): C2MainPiCreatedSession => ({
    session: {
      agent: {
        state: { isStreaming: false },
        streamFunction: () => { throw Error('no Pi stream permitted by assembly') },
      },
      prompt: async () => { throw Error('factory does not prompt') },
      subscribe: () => () => {},
      dispose: () => { disposeCount++ },
    } as unknown as C2MainPiCreatedSession['session'],
    prompt: 'Main-authorized immutable Plan and physical original',
  })
  const authority: C2MainTrustedAssemblyAuthority = {
    trustedOrigin: 'https://provider.example.test',
    assertPublishedPlan: (_agg, current) => {
      if (!published || current.planFingerprint !== plan.fingerprint) {
        throw Error('UNPUBLISHED_CANDIDATE_DENIED')
      }
    },
    getCurrentOwner: _current => active ? ({
      run, active, permissionGrantId: grant, ownerGeneration: 3,
      inputManifestHash: run.inputManifestHash,
    } satisfies C2MainOwnerWitness) : undefined,
    getObservedPhysicalReceipt: receiptId => observed.get(receiptId),
    createFreshSession: async () => {
      createCount++
      return build ? build() : freshSession()
    },
  }
  const assembly = new C2MainTrustedExecutionAssembly(authority)
  const request = { run, dispatchId: 'dispatch-' + id, mode: 'direct' as const }
  return {
    id, file, run, event, observed, assembly, request,
    observe: () => observed.set(event.hostReceiptId, {
      run, permissionGrantId: 'physical-grant-3',
      hostReceiptId: event.hostReceiptId,
      verified: {
        kind: 'read', permissionGrantId: 'physical-grant-3',
        source, extent: 'block',
      },
    }),
    revoke: () => { active = false },
    rotate: () => { grant = 'other-grant' },
    holdCandidate: () => { published = false },
    setBuild: (fn: () => Promise<C2MainPiCreatedSession>) => { build = fn },
    freshSession,
    get disposeCount() { return disposeCount },
    get createCount() { return createCount },
    admit: () => assembly.admit(id, {
      requestId: 'admit-' + id, expectedRevision: 0, actor, payload: run,
    }),
    record: () => assembly.record(id, {
      requestId: event.eventId, expectedRevision: 1, actor, payload: event,
    }),
  }
}

describe('C2-R04 single Main-local Plan/Owner/Host/Pi assembly', () => {
  test('independent Host observer, admitted disk original and Pi share one authority', async () => {
    const f = await fixture()
    expect((await f.admit()).ok).toBe(true)
    const pi = await f.assembly.createPi(f.request)
    expect(pi.trustedOrigin).toBe('https://provider.example.test')
    expect(f.createCount).toBe(1)
    expect((await f.record()).ok).toBe(false) // proposal alone cannot self-certify
    expect(() => f.assembly.rememberObservedHostReceipt(f.event.hostReceiptId))
      .toThrow('independently')
    f.observe()
    f.assembly.rememberObservedHostReceipt(f.event.hostReceiptId)
    expect((await f.record()).ok).toBe(true)
    expect(readAggregate(f.id)?.v3TechnicalExecution?.events).toHaveLength(1)
    expect(readAggregate(f.id)?.decisions).toEqual([])
    pi.session.dispose()
  })

  test('published Plan, revoked Owner or physical bytes cannot be bypassed by assembly', async () => {
    const f = await fixture()
    f.holdCandidate()
    expect((await f.admit()).ok).toBe(false)
    expect(f.createCount).toBe(0)
    const g = await fixture()
    expect((await g.admit()).ok).toBe(true)
    g.observe()
    g.assembly.rememberObservedHostReceipt(g.event.hostReceiptId)
    g.rotate()
    expect((await g.record()).ok).toBe(false)
    const h = await fixture()
    expect((await h.admit()).ok).toBe(true)
    writeFileSync(h.file, 'physical bytes altered after admission')
    await expect(h.assembly.createPi(h.request)).rejects.toThrow()
    expect(h.createCount).toBe(0)
  })

  test('explicit Run invalidation tombstones Host receipt; cold assembly cannot rehydrate', async () => {
    const f = await fixture()
    expect((await f.admit()).ok).toBe(true)
    f.observe()
    f.assembly.rememberObservedHostReceipt(f.event.hostReceiptId)
    f.assembly.invalidateRun(f.run)
    expect((await f.record()).ok).toBe(false)
    expect(() => f.assembly.rememberObservedHostReceipt(f.event.hostReceiptId))
      .toThrow('Run invalidated')
    f.assembly.close()
    f.assembly.close()
    expect(() => f.assembly.rememberObservedHostReceipt(f.event.hostReceiptId))
      .toThrow('disposed')
    expect(() => f.assembly.admit(f.id, {
      requestId: 'another', expectedRevision: 0, actor, payload: f.run,
    })).toThrow('disposed')
    expect(readAggregate(f.id)?.decisions).toEqual([])
  })

  test('process close during async Pi factory await disposes fresh session and denies use', async () => {
    const f = await fixture()
    expect((await f.admit()).ok).toBe(true)
    f.setBuild(async () => {
      f.assembly.close()
      return f.freshSession()
    })
    await expect(f.assembly.createPi(f.request)).rejects.toThrow()
    expect(f.disposeCount).toBe(1)
    expect(f.createCount).toBe(1)
    expect(() => f.assembly.createPi(f.request)).toThrow('disposed')
    expect(f.createCount).toBe(1)
  })

  test('missing privileged authority is rejected before installing any port', () => {
    expect(() => new C2MainTrustedExecutionAssembly({} as never)).toThrow()
  })
})
