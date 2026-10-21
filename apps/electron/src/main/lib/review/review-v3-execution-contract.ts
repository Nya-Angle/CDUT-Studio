/**
 * C-owned CR-A-001: versioned execution *proposal* boundary.
 *
 * This is intentionally NOT a ReviewRun writer or a Main IPC registration.
 * Only C's eventual trusted Main consumer may construct the host receipt and
 * run/permission context. Renderer/Pi event fields alone never prove authority.
 * C0/1 stays frozen; this transport revision is explicit and non-downgradable.
 */
import { createHash } from 'node:crypto'
import {
  assertC0CanonicalPlan, assertC0RunEvidenceIdentity, assertC0SourceIdentity,
  C0ContractError, REVIEW_V3_EXECUTION_SCHEMA,
  type CanonicalPlan, type RunEvidenceIdentity, type SourceIdentity,
  type V3ExecutionProposal, type V3CheckStatus, type V3TechnicalTerminal,
} from '@profer/shared'

export interface V3VerifiedHostReceipt {
  permissionGrantId: string
  kind: 'read' | 'check' | 'terminal'
  source?: SourceIdentity
  extent?: 'block' | 'full-document'
  check?: { checkKey: string; targetKey: string; objectKey: string; subjectId: string; status: V3CheckStatus }
  terminalStatus?: V3TechnicalTerminal
}

/**
 * This context is built by C's Main trust boundary from registered Host results,
 * current Case, current grant/epoch and *durably* recorded prior events.
 */
export interface V3TrustedConsumptionContext {
  run: RunEvidenceIdentity
  plan: CanonicalPlan
  permissionGrantId: string
  grantActive: boolean
  currentCaseRevision: number
  activeSourceVersionIds: readonly string[]
  verifiedHostReceipts: ReadonlyMap<string, V3VerifiedHostReceipt>
  nextSequence: number
  committedDigests: ReadonlyMap<number, string>
}

const bad = (code: 'CONTRACT_INVALID' | 'RUN_IDENTITY_MISMATCH' | 'SOURCE_STALE' | 'RECOVERY_REQUIRED',
  message: string): never => { throw new C0ContractError(code, message) }
/** Canonical JSON for stable SHA identity regardless of object key insertion order. */
const stable = (value: unknown): string => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null'
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']'
  const record = value as Record<string, unknown>
  return '{' + Object.keys(record).filter(key => record[key] !== undefined).sort()
    .map(key => JSON.stringify(key) + ':' + stable(record[key])).join(',') + '}'
}
const same = (a: unknown, b: unknown): boolean => stable(a) === stable(b)
const nonempty = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0
const digest = (value: unknown): string => createHash('sha256').update(stable(value)).digest('hex')
const tuple = (x: {checkKey:string;targetKey:string;objectKey:string;subjectId:string}) =>
  JSON.stringify([x.checkKey,x.targetKey,x.objectKey,x.subjectId])

/** Stable identity for this explicit schema revision, including physical proofs. */
export function executionProposalId(payload: Omit<V3ExecutionProposal, 'eventId'>): string {
  return digest(payload)
}

/**
 * Pure fail-closed precondition for a future C2 durable consumer.
 * 'replay' is returned only for an identical *already committed* event; C2 must
 * return the existing durable ACK, never issue a new receipt for this outcome.
 */
export function validateV3ExecutionProposal(
  event: V3ExecutionProposal, trusted: V3TrustedConsumptionContext,
): 'new' | 'replay' {
  if (!event || event.schemaVersion !== REVIEW_V3_EXECUTION_SCHEMA ||
    !nonempty(event.permissionGrantId) || !nonempty(event.hostReceiptId) ||
    !Number.isSafeInteger(event.sequence) || event.sequence < 1 ||
    !/^[a-f0-9]{64}$/.test(event.eventId)) bad('CONTRACT_INVALID', 'Execution proposal identity invalid')
  assertC0RunEvidenceIdentity(event.run)
  assertC0RunEvidenceIdentity(trusted.run)
  assertC0CanonicalPlan(trusted.plan)
  const run = event.run
  if (!same(run, trusted.run) || !trusted.grantActive ||
    run.caseRevision !== trusted.currentCaseRevision ||
    run.planFingerprint !== trusted.plan.fingerprint ||
    run.templateVersion !== trusted.plan.templateVersion ||
    run.ownerGeneration !== trusted.run.ownerGeneration ||
    event.permissionGrantId !== trusted.permissionGrantId) {
    bad('RUN_IDENTITY_MISMATCH', 'Current Main grant/Run/Plan/case revision mismatch')
  }
  if (run.sourceVersionIds.some(id => !trusted.activeSourceVersionIds.includes(id))) {
    bad('SOURCE_STALE', 'Run contains archived or unknown source version')
  }
  const { eventId: _ignore, ...payload } = event
  const actualDigest = executionProposalId(payload as Omit<V3ExecutionProposal, 'eventId'>)
  if (event.eventId !== actualDigest) bad('CONTRACT_INVALID', 'Proposal digest/body mismatch')
  const receipt = trusted.verifiedHostReceipts.get(event.hostReceiptId)
  if (!receipt || receipt.kind !== event.kind || receipt.permissionGrantId !== event.permissionGrantId) {
    throw new C0ContractError('CONTRACT_INVALID', 'No matching trusted Host receipt')
  }
  if (event.kind === 'read') {
    assertC0SourceIdentity(event.read.source)
    const src = event.read.source
    if (src.caseId !== run.caseId || !run.sourceVersionIds.includes(src.documentVersionId) ||
      !trusted.activeSourceVersionIds.includes(src.documentVersionId) ||
      !same(src, receipt.source) || event.read.extent !== receipt.extent) {
      bad('SOURCE_STALE', 'Read must identify current physical Host source and exact extent')
    }
  } else if (event.kind === 'check') {
    const matching = trusted.plan.bindings.filter(b => tuple(b) === tuple(event.check))
    if (matching.length !== 1 || !run.checkKeys.includes(event.check.checkKey) ||
      matching[0]?.sourceVersionIds.some(id => !run.sourceVersionIds.includes(id) ||
        !trusted.activeSourceVersionIds.includes(id)) ||
      !same(event.check, receipt.check) ||
      (event.check.status === 'accepted' && matching[0]?.applicability !== 'applicable') ||
      !['accepted', 'rejected', 'missing', 'unknown'].includes(event.check.status)) {
      bad('RUN_IDENTITY_MISMATCH', 'Check×target status is not a verified applicable Host result')
    }
  } else if (event.kind === 'terminal') {
    if (!['completed-technical','partial','cancelled','timed-out','needs-resume','failed']
      .includes(event.terminal.status) || event.terminal.status !== receipt.terminalStatus) {
      bad('CONTRACT_INVALID', 'Technical terminal not backed by Host receipt')
    }
  } else {
    bad('CONTRACT_INVALID', 'Unknown event kind')
  }
  if (!Number.isSafeInteger(trusted.nextSequence) || trusted.nextSequence < 1) {
    bad('RECOVERY_REQUIRED', 'Committed sequence cursor unavailable')
  }
  if (event.sequence < trusted.nextSequence) {
    if (trusted.committedDigests.get(event.sequence) === event.eventId) return 'replay'
    bad('RECOVERY_REQUIRED', 'Committed sequence replay changed or was not found')
  }
  if (event.sequence !== trusted.nextSequence) {
    bad('RECOVERY_REQUIRED', 'Execution sequence must be contiguous')
  }
  return 'new'
}
