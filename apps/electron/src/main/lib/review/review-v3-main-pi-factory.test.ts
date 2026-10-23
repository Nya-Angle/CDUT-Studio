import { afterAll, describe, expect, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  REVIEW_C0_SCHEMA_VERSION, type CanonicalPlan, type ReviewCaseV2,
  type RunEvidenceIdentity,
} from '@profer/shared'
import { createAggregate, readAggregate, writeAggregate } from './case-store-v2'
import {
  C2MainPiAgentSessionFactory, type C2MainPiCreatedSession,
} from './review-v3-main-pi-factory'

const root = join(import.meta.dir, '../../../../../../work/tmp', `v3-c2-pi-factory-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root
afterAll(() => rmSync(root, { recursive: true, force: true }))
const original = Buffer.from('Real original disk bytes for isolated C2 Main Pi factory')
const byteHash = createHash('sha256').update(original).digest('hex')
let serial = 0

async function fixture() {
  const id = `c2-pi-factory-case-${++serial}`
  const file = join(root, 'review-cases', id, 'source-docs', 'v1', 'original.txt')
  mkdirSync(join(root, 'review-cases', id, 'source-docs', 'v1'), { recursive: true })
  writeFileSync(file, original)
  const run: RunEvidenceIdentity = {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION,
    caseId: id, runId: 'run-' + id, attemptId: 'attempt-1',
    caseRevision: 1, planFingerprint: 'a'.repeat(64),
    templateVersion: '1', inputManifestHash: 'b'.repeat(64),
    ownerGeneration: 3, sourceVersionIds: ['v1'], checkKeys: ['check-1'],
  }
  const plan: CanonicalPlan = {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION,
    planId: 'published-1', templateId: 'template-1',
    templateVersion: '1', fingerprint: run.planFingerprint,
    moduleDigests: ['c'.repeat(64)],
    bindings: [{
      checkKey: 'check-1', targetKey: 'subject:s1',
      objectKey: 'proof', subjectId: 's1', applicability: 'applicable',
      sourceVersionIds: ['v1'], conditionFingerprint: 'd'.repeat(64),
    }],
  }
  const now = '2026-10-20T00:00:00Z'
  const state: ReviewCaseV2 = {
    id, title: 'Main-only isolated Pi case', templateId: 'template-1',
    templateVersion: 1, objectType: 'document', caseFields: {},
    subjects: [], stage: 'reviewing', revision: 0,
    createdAt: now, updatedAt: now,
    documents: [{
      documentId: 'doc-1', versionId: 'v1', contentHash: byteHash,
      byteHash, role: 'application', fileName: 'original.txt',
      mimeType: 'text/plain', sizeBytes: original.length,
      assetPath: 'source-docs/v1/original.txt', parseRevision: 1,
      parseStatus: 'parsed', blocks: [], usage: 'registered', active: true,
    }],
  }
  await createAggregate(id, state)
  const aggregate = readAggregate(id)!
  aggregate.canonicalPlan = plan
  aggregate.v3TechnicalExecution = {
    run, admittedAtRevision: 1, frozenInputDigest: 'e'.repeat(64), events: [],
  }
  writeAggregate(aggregate)
  let active = true
  let grant = 'physical-grant-3'
  let published = true
  let createCount = 0
  let disposeCount = 0
  let build: (() => Promise<C2MainPiCreatedSession>) | undefined
  const newSession = (): C2MainPiCreatedSession => ({
    session: {
      agent: {
        streamFunction: () => { throw new Error('Pi must not stream in factory') },
        state: { isStreaming: false },
      },
      prompt: async () => { throw new Error('Pi prompt must not be called by factory') },
      subscribe: () => () => {},
      dispose: () => { disposeCount++ },
    } as unknown as C2MainPiCreatedSession['session'],
    prompt: 'Frozen Main prompt from verified Case and Plan',
  })
  const factory = new C2MainPiAgentSessionFactory({
    trustedOrigin: 'https://provider.example.test',
    assertPublishedPlan: (_, identity) => {
      if (!published || identity.planFingerprint !== plan.fingerprint) {
        throw new Error('C2_PUBLISHED_PLAN_REQUIRED')
      }
    },
    getCurrentOwner: () => active ? {
      run, permissionGrantId: grant, active, ownerGeneration: 3,
      inputManifestHash: run.inputManifestHash,
    } : undefined,
    createFreshSession: async () => {
      createCount++
      return build ? build() : newSession()
    },
  })
  const request = {
    run, dispatchId: 'physical-dispatch-' + id, mode: 'direct' as const,
  }
  return {
    id, file, request, factory, newSession,
    revoke: () => { active = false },
    rotateGrant: () => { grant = 'new-rotated-grant' },
    candidateHeld: () => { published = false },
    setBuild: (fn: () => Promise<C2MainPiCreatedSession>) => { build = fn },
    get createCount() { return createCount },
    get disposeCount() { return disposeCount },
  }
}

describe('C2-R03 isolated, inert Main Pi session factory', () => {
  test('requires trusted constructor dependencies and pinned HTTPS origin', () => {
    expect(() => new C2MainPiAgentSessionFactory({} as never)).toThrow()
    expect(() => new C2MainPiAgentSessionFactory({
      trustedOrigin: 'http://provider.example.test',
      assertPublishedPlan: () => {},
      getCurrentOwner: () => undefined,
      createFreshSession: async () => { throw Error('unused') },
    })).toThrow('HTTPS')
  })

  test('constructs one fresh Pi shape after real Case disk source and Owner checks, without prompting', async () => {
    const f = await fixture()
    const result = await f.factory.create(f.request)
    expect(result.trustedOrigin).toBe('https://provider.example.test')
    expect(result.prompt).toContain('Frozen Main prompt')
    expect(f.createCount).toBe(1)
    expect(f.disposeCount).toBe(0)
    await expect(f.factory.create(f.request)).rejects.toThrow('reused')
    expect(f.createCount).toBe(1)
    result.session.dispose()
  })

  test('trusted long prompt remains intact rather than being constrained like an identifier', async () => {
    const f = await fixture()
    const fullPrompt = 'Approved Main source material '.repeat(300)
    f.setBuild(async () => ({ ...f.newSession(), prompt: fullPrompt }))
    const spec = await f.factory.create(f.request)
    expect(spec.prompt).toBe(fullPrompt)
    spec.session.dispose()
  })

  test('candidate-held, missing current owner and pre-aborted construction never open SDK', async () => {
    const f = await fixture()
    f.candidateHeld()
    await expect(f.factory.create(f.request)).rejects.toThrow('PUBLISHED')
    expect(f.createCount).toBe(0)
    const g = await fixture()
    g.revoke()
    await expect(g.factory.create(g.request)).rejects.toThrow('Owner')
    expect(g.createCount).toBe(0)
    const h = await fixture()
    const signal = AbortSignal.abort()
    await expect(h.factory.create({ ...h.request, signal })).rejects.toThrow()
    expect(h.createCount).toBe(0)
  })

  test('Owner grant rotated during asynchronous build: dispose and refuse', async () => {
    const f = await fixture()
    f.setBuild(async () => {
      f.rotateGrant()
      return f.newSession()
    })
    await expect(f.factory.create(f.request)).rejects.toThrow()
    expect(f.disposeCount).toBeGreaterThanOrEqual(1)
  })

  test('physical original changed during asynchronous session creation: reject and dispose', async () => {
    const f = await fixture()
    f.setBuild(async () => {
      writeFileSync(f.file, 'TAMPERED')
      return f.newSession()
    })
    await expect(f.factory.create(f.request)).rejects.toThrow()
    expect(f.disposeCount).toBe(1)
  })

  test('already-streaming Pi session fails closed and is disposed', async () => {
    const f = await fixture()
    f.setBuild(async () => {
      const spec = f.newSession()
      ;(spec.session.agent.state as { isStreaming: boolean }).isStreaming = true
      return spec
    })
    await expect(f.factory.create(f.request)).rejects.toThrow('inert')
    expect(f.disposeCount).toBe(1)
  })
})
