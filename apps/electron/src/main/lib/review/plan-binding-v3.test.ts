import { afterAll, describe, expect, test } from 'bun:test'
import { join } from 'node:path'
import { rmSync } from 'node:fs'
import type { Actor, CanonicalPlan, ReviewCaseV2 } from '@profer/shared'
import { createAggregate, readAggregate, writeAggregate } from './case-store-v2'
import { bindCanonicalPlanV3, upgradeCanonicalPlanV3 } from './plan-binding-v3'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `review-v3-plan-c1-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))
const actor: Actor = { actorId: 'local-test', actorSource: 'local', role: 'reviewer' }
const verifiedFixtureOnly = (_plan: CanonicalPlan): void => {
  // A real Main→Dev-B artifact provenance verifier is a separate integration gate.
}

async function seed(id: string) {
  const caseV2 = {
    id, title: 'Existing Case', templateId: 'template-1', templateVersion: 2,
    objectType: 'generic-object', stage: 'reviewing', caseFields: {},
    subjects: [{ id: 's1', type: 'item', title: 'Sub', fields: {},
      sourceRefs: [], correction: 'user-confirmed', status: 'identified' }],
    documents: [{ documentId: 'd1', versionId: 'doc-v1', contentHash: 'a'.repeat(64), byteHash: 'a'.repeat(64),
      role: 'evidence', fileName: 'source.txt', mimeType: 'text/plain', sizeBytes: 1, assetPath: 'source.txt',
      parseRevision: 1, parseStatus: 'parsed', blocks: [], usage: 'read', active: true }],
    revision: 0, createdAt: '2026-10-01T00:00:00Z', updatedAt: '2026-10-01T00:00:00Z',
  } as unknown as ReviewCaseV2
  await createAggregate(id, caseV2)
}
function plan(n: number): CanonicalPlan {
  return { schemaVersion: 'review-c0/1', planId: `plan-${n}`, fingerprint: `${n}`.repeat(64),
    templateId: 'template-1', templateVersion: '2', moduleDigests: ['published-fixture-only'],
    bindings: [{ checkKey: 'check-a', targetKey: 'subject:s1', objectKey: 'object-1',
      subjectId: 's1', applicability: 'unknown', sourceVersionIds: ['doc-v1'],
      conditionFingerprint: `condition-${n}` }] }
}

describe('Dev-C C1 immutable Plan binding', () => {
  test('same request replays; mismatched payload and late bind reject without duplicate Receipt', async () => {
    const id = 'plan-bind-replay-c1'
    await seed(id)
    const first = await bindCanonicalPlanV3(id, {
      requestId: 'bind-1', actor, expectedRevision: 0, payload: plan(1),
    }, verifiedFixtureOnly)
    expect(first.ok).toBe(true)
    const repeated = await bindCanonicalPlanV3(id, {
      requestId: 'bind-1', actor, expectedRevision: 0, payload: plan(1),
    }, verifiedFixtureOnly)
    expect(repeated.ok).toBe(true)
    const collision = await bindCanonicalPlanV3(id, {
      requestId: 'bind-1', actor, expectedRevision: 1, payload: plan(2),
    }, verifiedFixtureOnly)
    expect(collision.ok).toBe(false)
    if (!collision.ok) expect(collision.code).toBe('REQUEST_ID_COLLISION')
    const unsafe = await bindCanonicalPlanV3(id, {
      requestId: 'bind-2', actor, expectedRevision: 1, payload: plan(2),
    }, verifiedFixtureOnly)
    expect(unsafe.ok).toBe(false)
    if (!unsafe.ok) expect(unsafe.code).toBe('INVALID_TRANSITION')
    expect(readAggregate(id)?.caseV2.revision).toBe(1)
    expect(readAggregate(id)?.receiptLog).toHaveLength(1)
    expect(readAggregate(id)?.canonicalPlan?.bindings[0]?.applicability).toBe('unknown')
  })

  test('requires current material, unique Check×target and trusted verifier', async () => {
    const id = 'plan-invalid-c1'
    await seed(id)
    const stale = plan(1)
    stale.bindings[0]!.sourceVersionIds = ['archived']
    const denied = await bindCanonicalPlanV3(id, {
      requestId: 'bad-source', actor, expectedRevision: 0, payload: stale,
    }, verifiedFixtureOnly)
    expect(denied.ok).toBe(false)
    if (!denied.ok) expect(denied.code).toBe('STALE_INPUT')
    const duplicate = plan(1)
    duplicate.bindings.push({ ...duplicate.bindings[0]! })
    const repeated = await bindCanonicalPlanV3(id, {
      requestId: 'duplicate-check', actor, expectedRevision: 0, payload: duplicate,
    }, verifiedFixtureOnly)
    expect(repeated.ok).toBe(false)
    const blocked = await bindCanonicalPlanV3(id, {
      requestId: 'not-trusted', actor, expectedRevision: 0, payload: plan(1),
    }, () => { throw new Error('No verified Dev-B publication') })
    expect(blocked.ok).toBe(false)
    expect(readAggregate(id)?.caseV2.revision).toBe(0)
  })

  test('upgrade needs prior fingerprint+ACK, preserves old immutable Plan and Receipt history', async () => {
    const id = 'plan-upgrade-c1'
    await seed(id)
    const first = await bindCanonicalPlanV3(id, {
      requestId: 'first', actor, expectedRevision: 0, payload: plan(1),
    }, verifiedFixtureOnly)
    expect(first.ok).toBe(true)
    const missingAck = await upgradeCanonicalPlanV3(id, {
      requestId: 'upgrade-bad', actor, expectedRevision: 1,
      payload: { plan: plan(2), previousFingerprint: plan(1).fingerprint, acknowledgement: '' },
    }, verifiedFixtureOnly)
    expect(missingAck.ok).toBe(false)
    const wrongPrevious = await upgradeCanonicalPlanV3(id, {
      requestId: 'upgrade-wrong', actor, expectedRevision: 1,
      payload: { plan: plan(2), previousFingerprint: 'wrong', acknowledgement: 'Reviewed' },
    }, verifiedFixtureOnly)
    expect(wrongPrevious.ok).toBe(false)
    const valid = await upgradeCanonicalPlanV3(id, {
      requestId: 'upgrade-ack', actor, expectedRevision: 1,
      payload: { plan: plan(2), previousFingerprint: plan(1).fingerprint, acknowledgement: 'Human reviewed changed obligations' },
    }, verifiedFixtureOnly)
    expect(valid.ok).toBe(true)
    const after = readAggregate(id)!
    expect(after.canonicalPlan?.fingerprint).toBe(plan(2).fingerprint)
    expect(after.canonicalPlanHistory?.[0]?.fingerprint).toBe(plan(1).fingerprint)
    expect(after.receiptLog).toHaveLength(2)
    expect(after.caseV2.revision).toBe(2)
  })
  test('unpublished native drafts and stale/uncovered source selection cannot silently install a Plan', async () => {
    const draftId = 'plan-native-unadopted-draft'
    await seed(draftId)
    const unresolved = readAggregate(draftId)!
    unresolved.caseV2.nativeWorkspaceDraft = {
      manualRules: [{ id: 'draft-rule', title: 'Author note', requirement: 'Human confirmation required' }],
    }
    writeAggregate(unresolved)
    const rejectedRule = await bindCanonicalPlanV3(draftId, {
      requestId: 'draft-bind', actor, expectedRevision: 0, payload: plan(1),
    }, verifiedFixtureOnly)
    expect(rejectedRule.ok).toBe(false)
    if (!rejectedRule.ok) expect(rejectedRule.code).toBe('DEPENDENCY_UNRESOLVED')
    expect(readAggregate(draftId)?.canonicalPlan).toBeUndefined()

    const scopeId = 'plan-native-version-pinned-scope'
    await seed(scopeId)
    const scoped = readAggregate(scopeId)!
    scoped.caseV2.nativeWorkspaceDraft = {
      manualRules: [], subjectDocumentVersionIds: ['stale-version'],
    }
    writeAggregate(scoped)
    const stale = await bindCanonicalPlanV3(scopeId, {
      requestId: 'stale-bind', actor, expectedRevision: 0, payload: plan(1),
    }, verifiedFixtureOnly)
    expect(stale.ok).toBe(false)
    if (!stale.ok) expect(stale.code).toBe('STALE_INPUT')

    scoped.caseV2.nativeWorkspaceDraft.subjectDocumentVersionIds = ['doc-v1']
    writeAggregate(scoped)
    const noCoverage = plan(2)
    noCoverage.bindings[0]!.sourceVersionIds = []
    const omitted = await bindCanonicalPlanV3(scopeId, {
      requestId: 'omitted-bind', actor, expectedRevision: 0, payload: noCoverage,
    }, verifiedFixtureOnly)
    expect(omitted.ok).toBe(false)
    if (!omitted.ok) expect(omitted.code).toBe('DEPENDENCY_UNRESOLVED')

    const accepted = await bindCanonicalPlanV3(scopeId, {
      requestId: 'fully-covered', actor, expectedRevision: 0, payload: plan(3),
    }, verifiedFixtureOnly)
    expect(accepted.ok).toBe(true)
    expect(readAggregate(scopeId)?.caseV2.revision).toBe(1)
  })

})
