/**
 * Dev-A transient deterministic coverage projection for direct/hidden/Graph/
 * batch execution paths. It cannot commit ReviewRun, Check or business pass.
 * Host-accepted receipts are inputs, never Pi text asserting "completed".
 */
import {
  assertC0CanonicalPlan, assertC0RunEvidenceIdentity,
  C0ContractError, type CanonicalPlan, type RunEvidenceIdentity,
} from '@profer/shared'

export type A3CheckStatus = 'accepted' | 'rejected' | 'missing' | 'unknown'
export type A3TechnicalState =
  | 'technically-complete' | 'partial' | 'needs-resume'
  | 'cancelled' | 'timed-out' | 'failed'
export interface A3CheckObservation {
  checkKey: string
  targetKey: string
  objectKey: string
  subjectId: string
  status: A3CheckStatus
  /** Only Host receipt, never freeform model acknowledgement. */
  hostReceiptId?: string
}
export interface A3TechnicalSnapshot {
  readonly state: A3TechnicalState
  readonly accepted: readonly string[]
  readonly rejected: readonly string[]
  readonly missing: readonly string[]
  readonly unknown: readonly string[]
  readonly totalRequired: number
  readonly usedTurns: number
  readonly maxTurns: number
}
const tuple = (v: Pick<A3CheckObservation, 'checkKey' | 'targetKey' | 'objectKey' | 'subjectId'>) =>
  JSON.stringify([v.checkKey, v.targetKey, v.objectKey, v.subjectId])

export class V3ExecutionCompletenessAdapter {
  private readonly expected = new Map<string, 'applicable' | 'unknown'>()
  private readonly observed = new Map<string, A3CheckStatus>()
  private usedTurns = 0
  private failure: 'cancelled' | 'timed-out' | 'failed' | null = null

  constructor(plan: CanonicalPlan, run: RunEvidenceIdentity,
    readonly maxTurns = 24) {
    assertC0CanonicalPlan(plan)
    assertC0RunEvidenceIdentity(run)
    if (!Number.isSafeInteger(maxTurns) || maxTurns < 1 ||
        plan.fingerprint !== run.planFingerprint ||
        !run.checkKeys.every(key => plan.bindings.some(b => b.checkKey === key)) ||
        !plan.bindings.every(b => run.checkKeys.includes(b.checkKey) &&
          b.sourceVersionIds.every(v => run.sourceVersionIds.includes(v)))) {
      throw new C0ContractError('RUN_IDENTITY_MISMATCH', 'Frozen plan and Run coverage differ')
    }
    for (const b of plan.bindings) {
      if (b.applicability === 'not-applicable') continue
      const id = tuple(b)
      if (this.expected.has(id)) {
        throw new C0ContractError('CONTRACT_INVALID', 'Duplicate Check target in frozen Plan')
      }
      this.expected.set(id, b.applicability)
    }
    if (this.expected.size === 0) {
      throw new C0ContractError('CONTRACT_INVALID', 'No eligible checks; cannot claim complete')
    }
  }

  /** Called only from the active Host/Run adapter, not direct model output. */
  recordHostOutcome(observation: A3CheckObservation): void {
    if (this.failure) throw new C0ContractError('RUN_IDENTITY_MISMATCH', 'Attempt has stopped')
    const key = tuple(observation)
    const applicability = this.expected.get(key)
    if (!applicability) {
      throw new C0ContractError('RUN_IDENTITY_MISMATCH', 'Unknown check target')
    }
    if (observation.status === 'accepted' &&
        (applicability === 'unknown' || !observation.hostReceiptId)) {
      throw new C0ContractError('CONTRACT_INVALID', 'Unknown or unreceipted check cannot be accepted')
    }
    // An already accepted check cannot be downgraded by late/refused output.
    if (this.observed.get(key) === 'accepted' && observation.status !== 'accepted') {
      return
    }
    this.observed.set(key, observation.status)
  }
  recordTurn(): void {
    if (this.failure) throw new C0ContractError('RUN_IDENTITY_MISMATCH', 'Stopped attempt')
    this.usedTurns += 1
  }
  markFailure(status: 'cancelled' | 'timed-out' | 'failed'): void {
    this.failure = status
  }
  snapshot(): A3TechnicalSnapshot {
    const accepted: string[] = []
    const rejected: string[] = []
    const missing: string[] = []
    const unknown: string[] = []
    for (const [key, applicability] of this.expected) {
      const status = this.observed.get(key) ??
        (applicability === 'unknown' ? 'unknown' : 'missing')
      switch (status) {
        case 'accepted': accepted.push(key); break
        case 'rejected': rejected.push(key); break
        case 'unknown': unknown.push(key); break
        case 'missing': missing.push(key); break
      }
    }
    const covered = accepted.length === this.expected.size
    const state: A3TechnicalState =
      this.failure ?? (covered ? 'technically-complete' :
        this.usedTurns >= this.maxTurns ? 'needs-resume' : 'partial')
    return {
      state, accepted, rejected, missing, unknown,
      totalRequired: this.expected.size,
      usedTurns: this.usedTurns, maxTurns: this.maxTurns,
    }
  }
}

/** Independent arithmetic diagnostic; never asks the model to infer difference. */
export function arithmeticDifference(expected: number, observed: number): number {
  if (!Number.isFinite(expected) || !Number.isFinite(observed)) {
    throw new C0ContractError('CONTRACT_INVALID', 'Nonfinite arithmetic input')
  }
  return Math.round((expected - observed) * 100) / 100
}
