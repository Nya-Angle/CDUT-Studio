import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { REVIEW_C0_SCHEMA_VERSION as v, assertC0CaseAuthorization, assertC0CanonicalPlan, assertC0SourceIdentity,
  assertC0RunEvidenceIdentity, assertC0ExecutionEvent, assertC0BatchBinding,
  assertC0ImportBatch, assertC0ReviewBatchAttempt, assertC0OutboxReceipt } from '@profer/shared'
const h = 'a'.repeat(64)
const entry = { schemaVersion: v, batchAttemptId: 'ba', caseId: 'c', entryRunId: 'r',
  inputHash: h, planFingerprint: h, templateVersion: '1', revision: 2,
  decisionId: 'd', decisionBasedOnRunId: 'r' }
describe('C0 schema runtime validation: no silent downgrade', () => {
  test('multi-target unknown is not pass; version and condition mandatory', () => {
    const plan = { schemaVersion: v, planId: 'p', fingerprint: h, templateId: 't',
      templateVersion: '1', moduleDigests: [h], bindings: ['x','y'].map((targetKey) => ({
        checkKey: 'c', targetKey, objectKey: 'o', subjectId: 's',
        applicability: 'unknown', sourceVersionIds: ['dv'], conditionFingerprint: h })) }
    expect(() => assertC0CanonicalPlan(plan)).not.toThrow()
    expect(plan.bindings.map(x => x.applicability)).toEqual(['unknown','unknown'])
    expect(() => assertC0CanonicalPlan({ ...plan, bindings: [{ ...plan.bindings[0], applicability: 'pass' }] })).toThrow()
    expect(() => assertC0CanonicalPlan({ ...plan, bindings: [{ ...plan.bindings[0], conditionFingerprint: '' }] })).toThrow()
    expect(() => assertC0CanonicalPlan({ ...plan, schemaVersion: 'review-c0/999' })).toThrow()
  })
  test('Source requires raw and version and locator', () => {
    const src = { schemaVersion: v, caseId: 'c', materialId: 'm', documentVersionId: 'dv',
      rawSha256: h, parseRevision: '1', blockId: 'b', location: { kind: 'file', locator: '/' } }
    expect(() => assertC0SourceIdentity(src)).not.toThrow()
    expect(() => assertC0SourceIdentity({ ...src, documentVersionId: '' })).toThrow()
    expect(() => assertC0SourceIdentity({ ...src, location: {} })).toThrow()
  })
  test('Run and execution proposal require identity and receipt shape', () => {
    const run = { schemaVersion: v, runId: 'r', caseId: 'c', caseRevision: 1,
      planFingerprint: h, templateVersion: '1', inputManifestHash: h, sourceVersionIds: ['dv'],
      checkKeys: ['c'], attemptId: 'at', ownerGeneration: 1 }
    expect(() => assertC0RunEvidenceIdentity(run)).not.toThrow()
    expect(() => assertC0RunEvidenceIdentity({ ...run, attemptId: '' })).toThrow()
    const evt = { schemaVersion: v, attemptId: 'at', generation: 1, sequence: 0,
      eventKind: 'read-receipt-proposal', toolReceipt: { receiptId: 'tr', permissionGrantId: 'pg' },
      manifestHash: h }
    expect(() => assertC0ExecutionEvent(evt)).not.toThrow()
    expect(() => assertC0ExecutionEvent({ ...evt, manifestHash: '' })).toThrow()
  })
  test('ImportBatch cannot be ReviewBatchAttempt; wrong or missing Run rejected', () => {
    const review = { schemaVersion: v, kind: 'review', batchAttemptId: 'ba', entries: [entry], status: 'queued' }
    const imported = { schemaVersion: v, kind: 'import', importBatchId: 'ib', materialIds: ['m'],
      inputManifestHash: h, status: 'staged' }
    expect(() => assertC0ReviewBatchAttempt(review)).not.toThrow()
    expect(() => assertC0ImportBatch(imported)).not.toThrow()
    expect(() => assertC0ReviewBatchAttempt(imported)).toThrow()
    expect(() => assertC0ImportBatch(review)).toThrow()
    expect(() => assertC0BatchBinding({ ...entry, entryRunId: '' })).toThrow()
    expect(() => assertC0BatchBinding({ ...entry, decisionBasedOnRunId: 'other' })).toThrow()
  })
  test('mock never proves external acknowledgement', () => {
    const r = { schemaVersion: v, intentId: 'i', idempotencyKey: 'k', at: '2026-10-19',
      trustTier: 'mock-accepted' }
    expect(() => assertC0OutboxReceipt(r)).not.toThrow()
    expect(() => assertC0OutboxReceipt({ ...r, trustTier: 'externally-acknowledged' })).toThrow()
    expect(() => assertC0OutboxReceipt({ ...r, trustTier: 'externally-acknowledged', externalReference: 'ack' })).not.toThrow()
  })
})

const fixtures = join(import.meta.dir, '../../../../docs/design/review-agent/acceptance/v3-dev-c0-r01/C0-SCHEMA-FIXTURES')
function fixture(file: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(fixtures, file), 'utf8')) as Record<string, unknown>
}
describe('C0 committed schema fixtures are executable test inputs', () => {
  test('Main-synthetic local reviewer fixture is not a school credential; role and scope checked again', () => {
    const f = fixture('local-reviewer.json')
    const command = {
      schemaVersion: v, caseId: 'c1', requestId: 'r1', expectedRevision: 0,
      payloadHash: 'a'.repeat(64), payload: { caseFieldValues: {} },
      principal: f.principal,
    }
    expect(() => assertC0CaseAuthorization(command as never, 'UPDATE_FIELDS_V2')).not.toThrow()
    expect(() => assertC0CaseAuthorization({ ...command, principal: {
      ...(f.principal as object), role: 'teacher',
    } } as never, 'UPDATE_FIELDS_V2')).toThrow('ROLE_FORBIDDEN')
    expect(() => assertC0CaseAuthorization({ ...command, caseId: 'another-case' } as never, 'UPDATE_FIELDS_V2'))
      .toThrow('CASE_SCOPE_FORBIDDEN')
    expect(() => assertC0CaseAuthorization({ ...command, principal: {
      ...(f.principal as object), source: 'school', role: 'teacher', assurance: 'local-device',
    } } as never, 'UPDATE_FIELDS_V2')).toThrow('BLOCKED_AUTH')
  })
  test('four-channel L1-02 actor spoof fixture is explicitly untrusted', () => {
    const f = fixture('school-spoof.json')
    expect(f.expected).toBe('ACTOR_UNTRUSTED')
    const actor = f.actor as Record<string, unknown>
    expect(actor.actorSource).toBe('school')
    expect(actor.role).toBe('teacher')
    const mapping = fixture('L1-02-old-red-to-C0-rejection.json')
    expect((mapping.channels as string[])).toHaveLength(4)
    expect(mapping.oldProbeType).toBe('Main-handler-harness')
    expect(mapping.liveElectronRendererAttackProven).toBe(false)
  })
  test('multi-target unknown and incompatible versions load from committed JSON', () => {
    const plan = fixture('multi-target-unknown.json')
    expect(() => assertC0CanonicalPlan(plan)).not.toThrow()
    expect((plan.bindings as Array<{ applicability: string }>).every(x => x.applicability === 'unknown')).toBe(true)
    const bad = fixture('wrong-schema-version.json')
    expect(() => assertC0CanonicalPlan({ ...plan, schemaVersion: bad.schemaVersion })).toThrow()
  })
  test('review attempt without a precise Run remains structurally invalid', () => {
    const bad = fixture('review-batch-missing-or-wrong-run.json')
    expect(() => assertC0ReviewBatchAttempt(bad)).toThrow('BATCH_ATTEMPT_MISMATCH')
  })
  test('all four external receipt tiers are fixture-driven; mock cannot claim external ack', () => {
    const f = fixture('outbox-tiers.json')
    const cases = f.cases as Array<{ expected: string; receipt: unknown }>
    expect(cases).toHaveLength(5)
    for (const item of cases) {
      if (item.expected === 'valid') expect(() => assertC0OutboxReceipt(item.receipt)).not.toThrow()
      else expect(() => assertC0OutboxReceipt(item.receipt)).toThrow('CONTRACT_INVALID')
    }
  })
})
