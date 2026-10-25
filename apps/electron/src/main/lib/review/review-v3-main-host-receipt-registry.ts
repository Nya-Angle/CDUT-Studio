/**
 * Dev-C C2-R03 — process-local, fail-closed PHYSICAL Host witness registry.
 *
 * It accepts receipt IDs only when an independent privileged Host observer can
 * return the actual observed result. A proposal, model text, A technical ACK,
 * or an untrusted DTO can never populate the registry by itself.
 *
 * There is deliberately NO disk rehydration. A Main restart loses this live
 * proof and sealing must stop until an explicit cross-PID recovery Gate E.
 */
import {
  assertC0RunEvidenceIdentity, assertC0SourceIdentity, C0ContractError,
  type RunEvidenceIdentity,
} from '@profer/shared'
import type {
  C2MainHostWitness, C2MainOwnerWitness,
} from './review-v3-main-trust-port'
/** Durable fence check belongs to C's privileged execution assembly, not A's
 * process-local technical registry test fixtures. The Case CAS guards still
 * independently validate a persisted fence at every Run mutation. */
export interface C2HostDurableFenceReader {
  isRunFenced(run:RunEvidenceIdentity):boolean
}

export interface C2MainPhysicalHostSource {
  /** An independently instrumented A Host/SDK Main observer, NOT proposal JSON. */
  getObservedPhysicalReceipt(receiptId: string): C2MainHostWitness | undefined
  /** Live, current-process A Owner; a prior persisted lease never authorizes. */
  getCurrentOwner(run: RunEvidenceIdentity): C2MainOwnerWitness | undefined
}

const canonical = (value: unknown): string => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null'
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']'
  const obj = value as Record<string, unknown>
  return '{' + Object.keys(obj).filter(k => obj[k] !== undefined).sort()
    .map(k => JSON.stringify(k) + ':' + canonical(obj[k])).join(',') + '}'
}
const equal = (a: unknown, b: unknown): boolean => canonical(a) === canonical(b)
const validId = (id: unknown): id is string =>
  typeof id === 'string' && id.trim().length > 0 && id.length <= 512
/** A Run ID is never reusable within one Case, including after Owner rotation.
 * Do not use Owner generation/attempt as a tombstone namespace: stale Host
 * receipts could otherwise re-enter through a different generation/attempt. */
const runTombstoneKey = (run: RunEvidenceIdentity): string =>
  JSON.stringify([run.caseId,run.runId])
const refuse = (reason: string): never => {
  throw new C0ContractError('RECOVERY_REQUIRED', reason)
}
function live(
  observer: C2MainPhysicalHostSource, evidence: C2MainHostWitness,
): void {
  assertC0RunEvidenceIdentity(evidence.run)
  if (!validId(evidence.hostReceiptId) || !validId(evidence.permissionGrantId) ||
      evidence.verified.permissionGrantId !== evidence.permissionGrantId ||
      !['read','check','terminal'].includes(evidence.verified.kind)) {
    refuse('Host physical receipt identity or grant missing')
  }
  if (evidence.verified.kind === 'read') {
    if (!evidence.verified.source ||
        !['block','full-document'].includes(evidence.verified.extent ?? '')) {
      refuse('Host read has no physical source identity or extent')
    }
    assertC0SourceIdentity(evidence.verified.source)
    if (evidence.verified.source.caseId !== evidence.run.caseId ||
        !evidence.run.sourceVersionIds.includes(evidence.verified.source.documentVersionId)) {
      refuse('Host physical read is not in this Run original manifest')
    }
  } else if (evidence.verified.kind === 'check') {
    const check = evidence.verified.check
    if (!check || !evidence.run.checkKeys.includes(check.checkKey)) {
      refuse('Host check is not in the frozen Run check manifest')
    }
  } else if (!evidence.verified.terminalStatus) {
    refuse('Host terminal status missing')
  }
  const owner = observer.getCurrentOwner(evidence.run)
  if (!owner || !owner.active || !equal(owner.run, evidence.run) ||
      owner.ownerGeneration !== evidence.run.ownerGeneration ||
      owner.inputManifestHash !== evidence.run.inputManifestHash ||
      owner.permissionGrantId !== evidence.permissionGrantId) {
    refuse('Physical Host witness belongs to revoked/rotated/non-current Owner')
  }
}

export class C2MainPhysicalHostReceiptRegistry {
  private readonly receipts = new Map<string, C2MainHostWitness>()
  private readonly seenIds = new Set<string>()
  /** Run-wide deny fence, including IDs that had not arrived at invalidate(). */
  private readonly invalidatedRuns = new Set<string>()
  private closed = false

  constructor(
    private readonly observer: C2MainPhysicalHostSource,
    private readonly durable?: C2HostDurableFenceReader,
  ) {
    if (!observer || typeof observer.getObservedPhysicalReceipt !== 'function' ||
        typeof observer.getCurrentOwner !== 'function') {
      throw new C0ContractError('ACTOR_UNTRUSTED', 'Independent Main Host observer required')
    }
  }

  /** Call synchronously after a real privileged Host callback has recorded ID. */
  rememberObservedReceipt(receiptId: string): void {
    if (this.closed || !validId(receiptId)) refuse('Main Host registry closed or invalid ID')
    const observed = this.observer.getObservedPhysicalReceipt(receiptId)
    if (!observed || observed.hostReceiptId !== receiptId) {
      return refuse('No independently observed physical Host result for this ID')
    }
    if (this.invalidatedRuns.has(runTombstoneKey(observed.run)) ||
        this.durable?.isRunFenced(observed.run))
      return refuse('Run invalidated: late or unknown physical Host receipt denied')
    live(this.observer, observed)
    const previous = this.receipts.get(receiptId)
    if (previous) {
      if (!equal(previous, observed)) refuse('Host receipt ID rebound to different evidence')
      return // Exact same physical callback may arrive twice, never append twice.
    }
    if (this.seenIds.has(receiptId) || this.receipts.size >= 8192) {
      refuse('Recycled physical Host identity or registry capacity exhausted')
    }
    this.seenIds.add(receiptId)
    this.receipts.set(receiptId, structuredClone(observed))
  }

  /** Structural C2MainTrustedInputs lookup; C2 independently validates event. */
  getPhysicalHostReceipt(receiptId: string): C2MainHostWitness | undefined {
    if (this.closed || !validId(receiptId)) return undefined
    const recorded = this.receipts.get(receiptId)
    if (!recorded) return undefined // No "recover from event" fallback.
    if (this.invalidatedRuns.has(runTombstoneKey(recorded.run))) return undefined
    try { if (this.durable?.isRunFenced(recorded.run)) return undefined }
    catch { return undefined }
    const latest = this.observer.getObservedPhysicalReceipt(receiptId)
    if (!latest || !equal(latest, recorded)) return undefined
    try { live(this.observer, latest) }
    catch { return undefined }
    return structuredClone(recorded)
  }

  /**
   * Permanent per-registry Run-wide fence, even for unknown/late Host IDs.
   * Revoking a Run must never be reverted by reactivating an Owner or by
   * delivering a fresh physical ID after the invalidation.
   *
   * This is in-process only. The persistent C Case/Run recovery gate must
   * separately deny old Runs after a crash; no automatic rehydration here.
   */
  invalidateRun(run: RunEvidenceIdentity): void {
    assertC0RunEvidenceIdentity(run)
    if (this.closed) refuse('Host registry closed during Run invalidation')
    const key=runTombstoneKey(run)
    if (!this.invalidatedRuns.has(key) && this.invalidatedRuns.size >= 8192) {
      // Never evict old fences to make room. Whole registry becomes unusable.
      this.close()
      refuse('Run invalidation capacity exhausted: registry sealed')
    }
    this.invalidatedRuns.add(key)
    for (const [id, receipt] of this.receipts) {
      if (runTombstoneKey(receipt.run) === key) this.receipts.delete(id)
    }
  }

  /** Process shutdown/disposal: never resurrect this registry on restart. */
  close(): void {
    this.closed = true
    this.receipts.clear()
  }
}
