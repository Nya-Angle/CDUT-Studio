/**
 * Review V3 execution proposal transport (CR-A-001, Dev-C-owned versioned DTO).
 *
 * This is a proposal envelope, NOT a formal ReviewRun, permission token,
 * accepted business Check, or durable ACK. A emits only from Host-attested
 * results; C Main exclusively validates current authority and persists Runs.
 * Existing frozen review-c0/1 remains unchanged.
 */
import type { RunEvidenceIdentity, SourceIdentity } from './review-v3-c0'

export const REVIEW_V3_EXECUTION_SCHEMA = 'review-v3-execution/1' as const

export type V3CheckStatus = 'accepted' | 'rejected' | 'missing' | 'unknown'
export type V3TechnicalTerminal =
  | 'completed-technical' | 'partial' | 'cancelled'
  | 'timed-out' | 'needs-resume' | 'failed'

export type V3ExecutionProposal =
  | { schemaVersion: typeof REVIEW_V3_EXECUTION_SCHEMA; eventId: string; run: RunEvidenceIdentity;
      sequence: number; permissionGrantId: string; kind: 'read'; hostReceiptId: string;
      read: { source: SourceIdentity; extent: 'block' | 'full-document' } }
  | { schemaVersion: typeof REVIEW_V3_EXECUTION_SCHEMA; eventId: string; run: RunEvidenceIdentity;
      sequence: number; permissionGrantId: string; kind: 'check'; hostReceiptId: string;
      check: { checkKey: string; targetKey: string; objectKey: string; subjectId: string; status: V3CheckStatus } }
  | { schemaVersion: typeof REVIEW_V3_EXECUTION_SCHEMA; eventId: string; run: RunEvidenceIdentity;
      sequence: number; permissionGrantId: string; kind: 'terminal'; hostReceiptId: string;
      terminal: { status: V3TechnicalTerminal; reason?: string } }
