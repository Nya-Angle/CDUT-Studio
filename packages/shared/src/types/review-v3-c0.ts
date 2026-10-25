/**
 * Review C0/1 contracts. Main owns business authority; A/B exchange immutable
 * plan, source and execution proposals only. None creates a second Case state.
 *
 * Writers/readers:
 * Principal: Main only / business service (transport: never from Renderer).
 * AuthorizedCaseCommand: Main only / Case service (transient; Receipt persists).
 * CanonicalPlan: Dev-B published immutable artifact / C binds, A reads.
 * SourceIdentity: Dev-B raw/parser identity / C selects current, A reads.
 * RunEvidenceIdentity: C persisted Run / A proposal reader.
 * ExecutionEvent: Dev-A authenticated owner / C validates before Run commit.
 * ImportBatch: B staging / C intake; ReviewBatchAttempt: C business writer.
 * BatchEntryBinding, OutboxReceipt: C business writer / workbench projection.
 * Every persisted implementation must bind schemaVersion exactly; legacy
 * adapters reject unknown versions instead of silently downgrading.
 */
export const REVIEW_C0_SCHEMA_VERSION = 'review-c0/1' as const

export type C0RejectionCode =
  | 'ACTOR_UNTRUSTED' | 'ROLE_FORBIDDEN' | 'SENDER_UNTRUSTED'
  | 'CASE_SCOPE_FORBIDDEN' | 'REVISION_CONFLICT' | 'REQUEST_ID_COLLISION'
  | 'SOURCE_STALE' | 'RUN_IDENTITY_MISMATCH' | 'BATCH_ATTEMPT_MISMATCH'
  | 'RECOVERY_REQUIRED' | 'SCHEMA_VERSION_UNSUPPORTED' | 'CONTRACT_INVALID'
  | 'BLOCKED_AUTH'

export type C0CaseAction =
  | 'CREATE_CASE_V2' | 'UPDATE_FIELDS_V2'
  | 'UPSERT_CASE_SUBJECT_V2'
  | 'CORRECT_OBSERVATION_V2' | 'SET_EVIDENCE_LINK_V2'

export interface Principal {
  principalId: string
  source: 'local' | 'school'
  role: 'reviewer' | 'teacher' | 'school-admin' | 'student' | 'system'
  sessionId: string
  assurance: 'local-device' | 'verified-school'
  scope: { caseIds: string[]; actions: string[]; institutionId?: string }
  /** Main-only evidence reference, NOT a renderer field or a bearer credential. */
  credentialReference?: string
}

export interface AuthorizedCaseCommand<T> {
  schemaVersion: typeof REVIEW_C0_SCHEMA_VERSION
  caseId: string
  requestId: string
  expectedRevision: number
  payloadHash: string
  payload: T
  /** Injected inside Main; never serialized as an IPC request. */
  principal: Principal
}

export type PlanApplicability = 'applicable' | 'not-applicable' | 'unknown'

export interface PlanBinding {
  checkKey: string
  targetKey: string
  objectKey: string
  subjectId: string
  applicability: PlanApplicability
  sourceVersionIds: string[]
  conditionFingerprint: string
}

export interface CanonicalPlan {
  schemaVersion: typeof REVIEW_C0_SCHEMA_VERSION
  planId: string
  fingerprint: string
  templateId: string
  templateVersion: string
  moduleDigests: string[]
  bindings: PlanBinding[]
}

export interface SourceIdentity {
  schemaVersion: typeof REVIEW_C0_SCHEMA_VERSION
  caseId: string
  materialId: string
  documentVersionId: string
  rawSha256: string
  parseRevision: string
  blockId: string
  location: { kind: 'pdf-rect' | 'sheet-cell' | 'paragraph' | 'text-range' | 'file'; locator: string }
}

export interface RunEvidenceIdentity {
  schemaVersion: typeof REVIEW_C0_SCHEMA_VERSION
  runId: string
  caseId: string
  caseRevision: number
  planFingerprint: string
  templateVersion: string
  inputManifestHash: string
  sourceVersionIds: string[]
  checkKeys: string[]
  attemptId: string
  ownerGeneration: number
}

export interface ExecutionEvent {
  schemaVersion: typeof REVIEW_C0_SCHEMA_VERSION
  attemptId: string
  generation: number
  sequence: number
  eventKind: 'read-receipt-proposal' | 'check-proposal' | 'stopped' | 'failed'
  toolReceipt: { receiptId: string; permissionGrantId: string; sourceVersionId?: string } | null
  manifestHash: string
}

export interface BatchEntryBinding {
  schemaVersion: typeof REVIEW_C0_SCHEMA_VERSION
  batchAttemptId: string
  caseId: string
  entryRunId: string
  inputHash: string
  planFingerprint: string
  templateVersion: string
  revision: number
  decisionId: string
  decisionBasedOnRunId: string
}

export interface ImportBatch {
  schemaVersion: typeof REVIEW_C0_SCHEMA_VERSION
  kind: 'import'
  importBatchId: string
  materialIds: string[]
  inputManifestHash: string
  status: 'staged' | 'applying' | 'applied' | 'failed'
}

export interface ReviewBatchAttempt {
  schemaVersion: typeof REVIEW_C0_SCHEMA_VERSION
  kind: 'review'
  batchAttemptId: string
  entries: BatchEntryBinding[]
  status: 'queued' | 'running' | 'blocked' | 'finalized'
}

export interface OutboxReceipt {
  schemaVersion: typeof REVIEW_C0_SCHEMA_VERSION
  intentId: string
  idempotencyKey: string
  trustTier: 'mock-accepted' | 'provider-accepted' | 'externally-acknowledged' | 'unknown'
  externalReference?: string
  at: string
}

export class C0ContractError extends Error {
  constructor(readonly code: C0RejectionCode, message: string) {
    super(`${code}: ${message}`)
    this.name = 'C0ContractError'
  }
}

const obj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
const str = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every(str)
const hash = (v: unknown): boolean => typeof v === 'string' && /^[a-f0-9]{64}$/i.test(v)
const nonnegative = (v: unknown): boolean => Number.isSafeInteger(v) && Number(v) >= 0
const schema = (v: unknown): v is Record<string, unknown> => obj(v) && v.schemaVersion === REVIEW_C0_SCHEMA_VERSION

export function assertC0CaseAuthorization<T>(command: AuthorizedCaseCommand<T>, action: C0CaseAction): void {
  if (!schema(command) || !str(command.caseId) || !str(command.requestId) ||
    !nonnegative(command.expectedRevision) || !hash(command.payloadHash) || command.payload === undefined) {
    throw new C0ContractError('CONTRACT_INVALID', 'Case command identity/revision/hash incomplete')
  }
  const p = command.principal
  if (!obj(p) || !str(p.principalId) || !str(p.sessionId) || !obj(p.scope) ||
    !strings(p.scope.caseIds) || !strings(p.scope.actions)) {
    throw new C0ContractError('ACTOR_UNTRUSTED', 'Main principal/scope is absent')
  }
  if (!p.scope.caseIds.includes(command.caseId) || !p.scope.actions.includes(action)) {
    throw new C0ContractError('CASE_SCOPE_FORBIDDEN', 'Case/action outside Main scope')
  }
  if (p.source === 'local' && p.assurance === 'local-device' && p.role === 'reviewer') return
  if (p.source === 'school' && p.assurance !== 'verified-school') {
    throw new C0ContractError('BLOCKED_AUTH', 'School provenance unavailable')
  }
  throw new C0ContractError('ROLE_FORBIDDEN', 'Action not authorized for principal')
}

export function assertC0CanonicalPlan(value: unknown): asserts value is CanonicalPlan {
  if (!schema(value) || !str(value.planId) || !str(value.fingerprint) ||
      !str(value.templateId) || !str(value.templateVersion) ||
      !strings(value.moduleDigests) || !Array.isArray(value.bindings) ||
      !value.bindings.every((b: unknown) => obj(b) && str(b.checkKey) &&
        str(b.targetKey) && str(b.objectKey) && str(b.subjectId) &&
        ['applicable', 'not-applicable', 'unknown'].includes(String(b.applicability)) &&
        strings(b.sourceVersionIds) && str(b.conditionFingerprint))) {
    throw new C0ContractError('CONTRACT_INVALID', 'CanonicalPlan incomplete; unknown must remain unknown')
  }
}

export function assertC0SourceIdentity(value: unknown): asserts value is SourceIdentity {
  if (!schema(value) || !str(value.caseId) || !str(value.materialId) ||
    !str(value.documentVersionId) || !hash(value.rawSha256) ||
    !str(value.parseRevision) || !str(value.blockId) ||
    !obj(value.location) || !str(value.location.locator) ||
    !['pdf-rect', 'sheet-cell', 'paragraph', 'text-range', 'file'].includes(String(value.location.kind))) {
    throw new C0ContractError('SOURCE_STALE', 'Physical source version/location missing')
  }
}

export function assertC0RunEvidenceIdentity(value: unknown): asserts value is RunEvidenceIdentity {
  if (!schema(value) || !str(value.runId) || !str(value.caseId) ||
    !nonnegative(value.caseRevision) || !str(value.planFingerprint) ||
    !str(value.templateVersion) || !hash(value.inputManifestHash) ||
    !strings(value.sourceVersionIds) || !strings(value.checkKeys) ||
    !str(value.attemptId) || !nonnegative(value.ownerGeneration)) {
    throw new C0ContractError('RUN_IDENTITY_MISMATCH', 'Run evidence identity incomplete')
  }
}

export function assertC0ExecutionEvent(value: unknown): asserts value is ExecutionEvent {
  if (!schema(value) || !str(value.attemptId) || !nonnegative(value.generation) ||
    !nonnegative(value.sequence) || !hash(value.manifestHash) ||
    !['read-receipt-proposal', 'check-proposal', 'stopped', 'failed'].includes(String(value.eventKind)) ||
    !(value.toolReceipt === null || (obj(value.toolReceipt) &&
      str(value.toolReceipt.receiptId) && str(value.toolReceipt.permissionGrantId)))) {
    throw new C0ContractError('CONTRACT_INVALID', 'Execution proposal has no verified receipt envelope')
  }
}

export function assertC0BatchBinding(value: unknown): asserts value is BatchEntryBinding {
  if (!schema(value) || !str(value.batchAttemptId) || !str(value.caseId) ||
    !str(value.entryRunId) || !hash(value.inputHash) || !str(value.planFingerprint) ||
    !str(value.templateVersion) || !nonnegative(value.revision) ||
    !str(value.decisionId) || value.decisionBasedOnRunId !== value.entryRunId) {
    throw new C0ContractError('BATCH_ATTEMPT_MISMATCH', 'Entry Run/Decision must exactly match')
  }
}
export function assertC0ImportBatch(value: unknown): asserts value is ImportBatch {
  if (!schema(value) || value.kind !== 'import' || !str(value.importBatchId) ||
    !strings(value.materialIds) || !hash(value.inputManifestHash) ||
    !['staged', 'applying', 'applied', 'failed'].includes(String(value.status))) {
    throw new C0ContractError('CONTRACT_INVALID', 'Not an ImportBatch')
  }
}
export function assertC0ReviewBatchAttempt(value: unknown): asserts value is ReviewBatchAttempt {
  if (!schema(value) || value.kind !== 'review' || !str(value.batchAttemptId) ||
    !Array.isArray(value.entries) || !value.entries.every((e: unknown) => {
      try { assertC0BatchBinding(e); return (e as BatchEntryBinding).batchAttemptId === value.batchAttemptId }
      catch { return false }
    }) || !['queued', 'running', 'blocked', 'finalized'].includes(String(value.status))) {
    throw new C0ContractError('BATCH_ATTEMPT_MISMATCH', 'Not a valid ReviewBatchAttempt')
  }
}
export function assertC0OutboxReceipt(value: unknown): asserts value is OutboxReceipt {
  if (!schema(value) || !str(value.intentId) || !str(value.idempotencyKey) ||
    !str(value.at) || !['mock-accepted', 'provider-accepted', 'externally-acknowledged', 'unknown'].includes(String(value.trustTier)) ||
    (value.trustTier === 'externally-acknowledged' && !str(value.externalReference))) {
    throw new C0ContractError('CONTRACT_INVALID', 'Outbox receipt trust tier invalid')
  }
}
