import { afterAll, describe, expect, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { mkdirSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  REVIEW_C0_SCHEMA_VERSION, type Actor, type CanonicalPlan,
  type ReviewCaseV2, type RunEvidenceIdentity,
} from '@profer/shared'
import { bindCanonicalPlanV3 } from './plan-binding-v3'
import { createAggregate, readAggregate, writeAggregate } from './case-store-v2'
import {
  C2MainPublishedPlanProvenance, type C2MainPublishedPlanRecord,
} from './review-v3-main-plan-provenance'

const root = join(import.meta.dir, '../../../../../../work/tmp', `c2-published-source-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root
afterAll(() => rmSync(root, { recursive: true, force: true }))
const actor: Actor = { actorId: 'C2-Main-local-verified-actor', actorSource: 'local', role: 'reviewer' }
const original = Buffer.from('C2 registered original material physical bytes')
const physicalSha = createHash('sha256').update(original).digest('hex')
let serial = 0

async function fixture() {
  const id = 'c2-plan-source-' + ++serial
  const disk = join(root, 'review-cases', id, 'source-docs', 'v1', 'original.txt')
  mkdirSync(join(root, 'review-cases', id, 'source-docs', 'v1'), {recursive: true})
  writeFileSync(disk, original)
  const plan: CanonicalPlan = {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION,
    planId: 'published-plan-' + id, fingerprint: 'a'.repeat(64),
    templateId: 'template-1', templateVersion: '1', moduleDigests: ['c'.repeat(64)],
    bindings: [{
      checkKey: 'check-1', targetKey: 'subject:s1', objectKey: 'proof',
      subjectId: 's1', applicability: 'applicable',
      sourceVersionIds: ['v1'], conditionFingerprint: 'd'.repeat(64),
    }],
  }
  const now = '2026-10-20T00:00:00Z'
  const caseRecord: ReviewCaseV2 = {
    id, title: 'Physical Plan origin test', templateId: 'template-1',
    templateVersion: 1, objectType: 'document', caseFields: {},
    stage: 'reviewing', revision: 0, createdAt: now, updatedAt: now,
    subjects: [{
      id: 's1', type: 'item', title: 'Subject', fields: {},
      sourceRefs: [], correction: 'user-confirmed', status: 'identified',
    }],
    documents: [{
      documentId: 'doc-1', versionId: 'v1', contentHash: physicalSha,
      byteHash: physicalSha, role: 'application', fileName: 'original.txt',
      mimeType: 'text/plain', sizeBytes: original.length,
      assetPath: 'source-docs/v1/original.txt', parseRevision: 1,
      parseStatus: 'parsed', blocks: [], usage: 'registered', active: true,
    }],
  }
  await createAggregate(id, caseRecord)
  const publicationRoot = join(root, 'C-owned-publisher-attested-fixtures', id)
  mkdirSync(publicationRoot, {recursive: true})
  const artifactPath = join(publicationRoot, plan.fingerprint + '.json')
  const physicalArtifact = () => Buffer.from(JSON.stringify({
    schemaVersion: 'review-v3-published-plan-artifact/1',
    publicationId: 'publication-1', canonicalPlan: plan,
  }))
  writeFileSync(artifactPath, physicalArtifact())
  let record: C2MainPublishedPlanRecord | undefined = {
    schemaVersion: 'review-v3-plan-publication/1',
    publicationId: 'publication-1',
    issuerAuthorityId: 'policy-issuer-1',
    publishedSourceCommit: 'b'.repeat(40),
    status: 'published',
    fingerprint: plan.fingerprint,
    artifactSha256: createHash('sha256').update(physicalArtifact()).digest('hex'),
  }
  let validPublisher = true
  const port = new C2MainPublishedPlanProvenance({
    artifactRoot: publicationRoot,
    getCurrentPublication: () => record ? structuredClone(record) : undefined,
    assertAuthorizedPublication: () => {
      if (!validPublisher) throw Error('INDEPENDENT_PUBLICATION_AUTHORITY_DENIED')
    },
  })
  const run: RunEvidenceIdentity = {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION, caseId: id, runId: 'run-'+id,
    attemptId: 'attempt-1', caseRevision: 1,
    planFingerprint: plan.fingerprint, templateVersion: '1',
    inputManifestHash: 'e'.repeat(64), ownerGeneration: 1,
    sourceVersionIds: ['v1'], checkKeys: ['check-1'],
  }
  return {
    id, plan, port, run, disk, artifactPath, physicalArtifact,
    bind: () => bindCanonicalPlanV3(id, {
      requestId: 'bind-'+id, expectedRevision: 0, actor, payload: plan,
    }, (p, agg) => port.assertPublishedPlanForCase(p, agg)),
    putBound: () => {
      const a=readAggregate(id)!
      a.canonicalPlan=structuredClone(plan)
      writeAggregate(a)
    },
    revoke: () => { if (record) record = {...record,status:'revoked'} },
    hold: () => { if (record) record = {...record,status:'candidate-held'} },
    missing: () => { record = undefined },
    untrust: () => { validPublisher = false },
    replacePinnedArtifact: (bytes: Buffer) => {
      writeFileSync(artifactPath, bytes)
      if (record) record = {
        ...record, artifactSha256: createHash('sha256').update(bytes).digest('hex'),
      }
    },
  }
}

describe('C2-R05 physical published Plan and Case source provenance — Main only', () => {
  test('verified physical publication + Case original bind once through real CAS/Receipt; Run rechecks', async () => {
    const f=await fixture()
    const result=await f.bind()
    expect(result.ok).toBe(true)
    expect(readAggregate(f.id)?.canonicalPlan?.fingerprint).toBe(f.plan.fingerprint)
    expect(readAggregate(f.id)?.receiptLog).toHaveLength(1)
    f.port.assertPublishedPlan(readAggregate(f.id)!,f.run)
    expect(readAggregate(f.id)?.decisions).toEqual([])
  })

  test('candidate-held or revoked author artifact never becomes a published Plan', async () => {
    const a=await fixture()
    a.hold()
    expect((await a.bind()).ok).toBe(false)
    expect(readAggregate(a.id)?.receiptLog).toHaveLength(0)
    const b=await fixture()
    b.revoke()
    expect((await b.bind()).ok).toBe(false)
    const c=await fixture()
    c.missing()
    expect((await c.bind()).ok).toBe(false)
  })

  test('even re-pinning the raw digest cannot publish a B1 frozen candidate-held descriptor', async () => {
    const f=await fixture()
    const candidate=Buffer.from(JSON.stringify({
      schemaVersion: 'review-b1-frozen/1', status: 'candidate-held',
      descriptor: {descriptorVersion:'review-b1/1',publicationAllowed:false,canonicalPlan:f.plan},
    }))
    f.replacePinnedArtifact(candidate)
    expect((await f.bind()).ok).toBe(false)
    expect(readAggregate(f.id)?.canonicalPlan).toBeUndefined()
    expect(readAggregate(f.id)?.receiptLog).toHaveLength(0)
  })

  test('trusted publisher must independently authenticate issuer, not rely on DTO status', async () => {
    const f=await fixture()
    f.untrust()
    expect((await f.bind()).ok).toBe(false)
    expect(readAggregate(f.id)?.canonicalPlan).toBeUndefined()
  })

  test('physical artifact mutation, missing source and symlink cannot pass Plan bind', async () => {
    const f=await fixture()
    writeFileSync(f.artifactPath, 'changed artifact bytes')
    expect((await f.bind()).ok).toBe(false)
    const g=await fixture()
    unlinkSync(g.artifactPath)
    expect((await g.bind()).ok).toBe(false)
    const h=await fixture()
    unlinkSync(h.artifactPath)
    const elsewhere=join(root,'synthetic-external-published.json')
    writeFileSync(elsewhere, h.physicalArtifact())
    symlinkSync(elsewhere,h.artifactPath)
    expect((await h.bind()).ok).toBe(false)
  })

  test('C1 source bind re-hashes actual physical Case original under same CAS snapshot', async () => {
    const f=await fixture()
    writeFileSync(f.disk, 'TAMPERED CURRENT ORIGINAL')
    expect((await f.bind()).ok).toBe(false)
    expect(readAggregate(f.id)?.caseV2.revision).toBe(0)
    expect(readAggregate(f.id)?.canonicalPlan).toBeUndefined()
    expect(readAggregate(f.id)?.receiptLog).toHaveLength(0)
  })

  test('publisher status revoked after binding, changed original and wrong check scope block Run', async () => {
    const f=await fixture()
    expect((await f.bind()).ok).toBe(true)
    f.revoke()
    expect(() => f.port.assertPublishedPlan(readAggregate(f.id)!,f.run)).toThrow()
    const g=await fixture()
    expect((await g.bind()).ok).toBe(true)
    writeFileSync(g.disk,'NO LONGER THE FROZEN ORIGINAL')
    expect(() => g.port.assertPublishedPlan(readAggregate(g.id)!,g.run)).toThrow()
    const h=await fixture()
    expect((await h.bind()).ok).toBe(true)
    expect(() => h.port.assertPublishedPlan(readAggregate(h.id)!,{
      ...h.run,checkKeys:['not-in-published-plan'],
    })).toThrow('manifest')
  })

  test('requires authenticated independent source and pinned root, never creates publication itself', () => {
    expect(() => new C2MainPublishedPlanProvenance({} as never)).toThrow()
    expect(() => new C2MainPublishedPlanProvenance({
      artifactRoot: 'relative-untrusted-root',getCurrentPublication:()=>undefined,
      assertAuthorizedPublication:()=>{},
    })).toThrow('absolute')
  })
})
