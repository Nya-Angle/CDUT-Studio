/**
 * C2/1 — immutable, CASE-LOCAL, C Main-owned Run evidence snapshot.
 *
 * This is a real durable Run history object, not an A/I technical ACK;
 * technical Check statuses are NOT formal policy verdicts, grades, decisions,
 * permission grants or externally acknowledged school results.
 *
 * review-v3-execution/1 proposal transport stays independent and frozen.
 */
import type { CanonicalPlan, PlanBinding, RunEvidenceIdentity, SourceIdentity } from './review-v3-c0'
import type { V3CheckStatus, V3TechnicalTerminal } from './review-v3-execution'

export const REVIEW_V3_RUN_SCHEMA = 'review-v3-run/1' as const

/** No implicit 'pass' state: only a human/policy-authorized decision can decide. */
export type V3RunEvidenceState = 'requires-human-review' | 'incomplete' | 'interrupted'

export interface V3RunBoundCheck {
  binding: PlanBinding
  /** null means that the Host never produced a verified event for this binding. */
  technicalStatus: V3CheckStatus | null
  eventId?: string
  hostReceiptId?: string
  sequence?: number
  /** This record alone is NEVER a formally accepted CheckResult. */
  decisionEligible: false
}

export interface V3RunReadEvidence {
  eventId: string
  hostReceiptId: string
  sequence: number
  source: SourceIdentity
  extent: 'block' | 'full-document'
}

export interface ReviewRunRecordV3 {
  schemaVersion: typeof REVIEW_V3_RUN_SCHEMA
  run: RunEvidenceIdentity
  /** Full immutable policy/target binding as verified by C at admission. */
  plan: CanonicalPlan
  /** Physical/business input digest frozen before the first Host side-effect. */
  inputDigest: string
  /** SHA-256 of the complete ordered, verified event chain at seal time. */
  eventChainDigest: string
  terminalEventId: string
  terminal: V3TechnicalTerminal
  /** Technical completion is never automatically a business approval. */
  state: V3RunEvidenceState
  boundChecks: V3RunBoundCheck[]
  readEvidence: V3RunReadEvidence[]
  coverage: {
    totalBindings: number
    observedBindings: number
    unobservedBindings: number
    blockedApplicability: number
  }
  sealedAt: string
  sealedByActorId: string
  /** No school, publication, Outbox or decision ACK has been issued. */
  formalDecisionId?: never
  schoolAckId?: never
}
