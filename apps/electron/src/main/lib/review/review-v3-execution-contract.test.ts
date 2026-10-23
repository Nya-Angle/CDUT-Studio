import { describe, expect, test } from 'bun:test'
import {
  REVIEW_C0_SCHEMA_VERSION, REVIEW_V3_EXECUTION_SCHEMA,
  type CanonicalPlan, type RunEvidenceIdentity, type SourceIdentity, type V3ExecutionProposal,
} from '@profer/shared'
import {
  executionProposalId, validateV3ExecutionProposal,
  type V3TrustedConsumptionContext, type V3VerifiedHostReceipt,
} from './review-v3-execution-contract'

const hash = 'a'.repeat(64)
const source: SourceIdentity = {
  schemaVersion: REVIEW_C0_SCHEMA_VERSION, caseId: 'case-1', materialId: 'mat-1',
  documentVersionId: 'doc-v1', rawSha256: hash, parseRevision: 'parse-v1',
  blockId: 'block-1', location: { kind: 'paragraph', locator: 'p1' },
}
const run: RunEvidenceIdentity = {
  schemaVersion: REVIEW_C0_SCHEMA_VERSION, runId: 'run-1', caseId: 'case-1',
  caseRevision: 2, planFingerprint: 'plan-hash', templateVersion: 'v1',
  inputManifestHash: hash, sourceVersionIds: ['doc-v1'], checkKeys: ['R01'],
  attemptId: 'attempt-1', ownerGeneration: 3,
}
const plan: CanonicalPlan = {
  schemaVersion: REVIEW_C0_SCHEMA_VERSION, planId: 'plan-1', fingerprint: 'plan-hash',
  templateId: 'template', templateVersion: 'v1', moduleDigests: [hash], bindings: [{
    checkKey: 'R01', targetKey: 'target-1', objectKey: 'object-1', subjectId: 'subject-1',
    applicability: 'applicable', sourceVersionIds: ['doc-v1'], conditionFingerprint: hash,
  }],
}
function ctx(receipt: V3VerifiedHostReceipt): V3TrustedConsumptionContext {
  return {
    run, plan, permissionGrantId: 'grant-1', grantActive: true, currentCaseRevision: 2,
    activeSourceVersionIds: ['doc-v1'], verifiedHostReceipts: new Map([['receipt-1', receipt]]),
    nextSequence: 1, committedDigests: new Map(),
  }
}
const check = {
  checkKey: 'R01', targetKey: 'target-1', objectKey: 'object-1', subjectId: 'subject-1',
  status: 'accepted' as const,
}
function checkEvent(input: Extract<V3ExecutionProposal, {kind:'check'}>['check'] = check): V3ExecutionProposal {
  const payload = {
    schemaVersion: REVIEW_V3_EXECUTION_SCHEMA, run, sequence: 1, permissionGrantId: 'grant-1',
    kind: 'check' as const, hostReceiptId: 'receipt-1', check: input,
  }
  return { ...payload, eventId: executionProposalId(payload) }
}
const checkReceipt: V3VerifiedHostReceipt = {
  kind: 'check', permissionGrantId: 'grant-1', check,
}
const readReceipt: V3VerifiedHostReceipt = {
  kind: 'read', permissionGrantId: 'grant-1', source, extent: 'block',
}
function readEvent(extent: 'block' | 'full-document' = 'block'): V3ExecutionProposal {
  const payload = {
    schemaVersion: REVIEW_V3_EXECUTION_SCHEMA, run, sequence: 1, permissionGrantId: 'grant-1',
    kind: 'read' as const, hostReceiptId: 'receipt-1', read: { source, extent },
  }
  return { ...payload, eventId: executionProposalId(payload) }
}
describe('C-owned CR-A-001 execution proposal envelope (no Run writer)', () => {
  test('matching Host result + trusted run admits new event, identical persisted replay only', () => {
    const event = checkEvent()
    expect(validateV3ExecutionProposal(event, ctx(checkReceipt))).toBe('new')
    const t = ctx(checkReceipt)
    t.committedDigests = new Map([[1, event.eventId]])
    t.nextSequence = 2
    expect(validateV3ExecutionProposal(event, t)).toBe('replay')
  })
  test('same sequence with changed body or absent committed digest fails closed', () => {
    const original = checkEvent()
    const t = ctx(checkReceipt)
    t.nextSequence = 2
    t.committedDigests = new Map([[1, original.eventId]])
    const changed = checkEvent({ ...check, status: 'rejected' })
    expect(() => validateV3ExecutionProposal(changed, t)).toThrow()
    t.committedDigests = new Map()
    expect(() => validateV3ExecutionProposal(original, t)).toThrow()
  })
  test('read must preserve physical source identity and Host-attested extent', () => {
    expect(validateV3ExecutionProposal(readEvent(), ctx(readReceipt))).toBe('new')
    expect(() => validateV3ExecutionProposal(readEvent('full-document'), ctx(readReceipt))).toThrow()
    const t = ctx(readReceipt)
    t.activeSourceVersionIds = []
    expect(() => validateV3ExecutionProposal(readEvent(), t)).toThrow()
    const spoof = readEvent() as Extract<V3ExecutionProposal, {kind:'read'}>
    spoof.read = { ...spoof.read, source: { ...source, rawSha256: 'b'.repeat(64) } }
    spoof.eventId = executionProposalId((({ eventId: _id, ...rest }) => rest)(spoof))
    expect(() => validateV3ExecutionProposal(spoof, ctx(readReceipt))).toThrow()
  })
  test('unknown applicability is not an accepted Check', () => {
    const t = ctx(checkReceipt)
    t.plan = { ...plan, bindings: plan.bindings.map(b => ({ ...b, applicability: 'unknown' as const })) }
    expect(() => validateV3ExecutionProposal(checkEvent(), t)).toThrow()
  })
  test('Main grant/Case revision, event body and sequence are strict', () => {
    const t = ctx(checkReceipt)
    t.grantActive = false
    expect(() => validateV3ExecutionProposal(checkEvent(), t)).toThrow()
    t.grantActive = true
    t.currentCaseRevision = 3
    expect(() => validateV3ExecutionProposal(checkEvent(), t)).toThrow()
    t.currentCaseRevision = 2
    const fake = checkEvent()
    fake.eventId = 'b'.repeat(64)
    expect(() => validateV3ExecutionProposal(fake, t)).toThrow()
    const later = { ...checkEvent(), sequence: 2 }
    later.eventId = executionProposalId((({eventId: _id,...rest})=>rest)(later))
    expect(() => validateV3ExecutionProposal(later, t)).toThrow()
  })
  test('C0 proposal cannot masquerade as new formally verifiable transport', () => {
    expect(() => validateV3ExecutionProposal({
      schemaVersion: REVIEW_C0_SCHEMA_VERSION, attemptId: run.attemptId, generation: 3,
      sequence: 1, eventKind: 'check-proposal', toolReceipt: null, manifestHash: hash,
    } as unknown as V3ExecutionProposal, ctx(checkReceipt))).toThrow()
  })
  test('Host terminal is only a technical status, still no business Run/Decision', () => {
    const payload = {
      schemaVersion: REVIEW_V3_EXECUTION_SCHEMA, run, sequence: 1, permissionGrantId: 'grant-1',
      kind: 'terminal' as const, hostReceiptId: 'receipt-1',
      terminal: { status: 'completed-technical' as const },
    }
    const event = { ...payload, eventId: executionProposalId(payload) }
    const t = ctx({ kind: 'terminal', permissionGrantId: 'grant-1', terminalStatus: 'completed-technical' })
    expect(validateV3ExecutionProposal(event, t)).toBe('new')
    t.verifiedHostReceipts = new Map([['receipt-1', { kind: 'terminal', permissionGrantId: 'grant-1',
      terminalStatus: 'failed' }]])
    expect(() => validateV3ExecutionProposal(event, t)).toThrow()
  })
})
