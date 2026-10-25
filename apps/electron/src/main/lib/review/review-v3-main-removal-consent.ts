/**
 * Dev-C C-MAIN-REMOVAL-R01 — Main-only, one-use, human-observed deletion consent.
 *
 * This module NEVER creates approval from a Renderer "confirm" flag or from
 * UpgradeCanonicalPlan payload.removalAck. Only a privileged Main observer of
 * an actual human confirmation may provide CMainObservedRemovalConsent.
 *
 * No UI observer has yet been installed in production. Without one, every
 * removal of a Check remains fail-closed, even if the Renderer supplies an
 * exactly matching acknowledgement list.
 */
import type { CMainUpgradeRemovalAck } from './plan-binding-v3'

export interface CMainRemovalPhysicalIdentity {
  readonly principalId: string
  readonly sessionId: string
  readonly windowId: string
  readonly frameId: string
  readonly ownerId: string
  readonly ownerGeneration: number
  readonly authorityEpoch: string
}
export interface CMainRemovalObservedConsent extends CMainRemovalPhysicalIdentity {
  readonly schemaVersion: 'review-v3-main-human-removal-consent/1'
  /** Unique for an actual Main-observed human confirmation, never a UI ID. */
  readonly approvalId: string
  readonly caseId: string
  readonly requestId: string
  readonly expectedRevision: number
  readonly previousFingerprint: string
  readonly nextFingerprint: string
  readonly acknowledgedRemovedIdentities: readonly string[]
  readonly reason: string
  readonly observedAtMs: number
}
export interface CMainRemovalWitnessSource {
  /** Optional trusted native confirmation hook, invoked ONLY inside Case CAS.
   * Production may implement it via Electron's synchronous modal dialog.
   * No Renderer event/payload is allowed to implement this interface. */
  observeAtCommit?(ctx: CMainRemovalCommitContext): void
  /** Must read privileged Main's real human-observation ledger, never IPC. */
  getObservedMainHumanConsent(caseId: string, requestId: string):
    CMainRemovalObservedConsent | undefined
}
export interface CMainRemovalCommitContext {
  readonly caseId: string
  readonly requestId: string
  readonly currentCaseRevision: number
  readonly identity: CMainRemovalPhysicalIdentity
  readonly acknowledgement: CMainUpgradeRemovalAck
  readonly computedRemovedIdentities: readonly string[]
  readonly reason: string
}

const MAX_AGE_MS = 5 * 60 * 1000
const LIMIT = 4096
const sha = (s: unknown): s is string =>
  typeof s === 'string' && /^[a-f0-9]{64}$/.test(s)
const safe = (s: unknown): s is string =>
  typeof s === 'string' && s.length > 0 && s.length <= 256 && s.trim() === s
const denied = (why: string): never => {throw new Error('C_MAIN_REMOVAL_CONSENT_' + why)}
const isSame = (a: readonly string[], b: readonly string[]): boolean =>
  a.length === b.length && a.every((x, i) => x === b[i])

/**
 * Persist one-use tombstones across uninstall/reinstall of the SAME privileged
 * Main observer object inside a process. Revocation must not resurrect human
 * click IDs merely because a new C Main installation wrapper was created.
 * This does NOT claim crash-durable approval state: a cold Main must not
 * rehydrate previously used physical human confirmations.
 */
const seenPerPhysicalObserver = new WeakMap<CMainRemovalWitnessSource, Set<string>>()

/** Keep this instance for the lifetime of one actual Main authority installation. */
export class CMainRemovalConsentGate {
  private readonly consumedIds: Set<string>
  private closed = false
  constructor(private readonly source: CMainRemovalWitnessSource | undefined) {
    if (source && typeof source.getObservedMainHumanConsent !== 'function')
      denied('PHYSICAL_HUMAN_OBSERVER_INVALID')
    const seen = source && seenPerPhysicalObserver.get(source)
    this.consumedIds = seen || new Set<string>()
    if (source && !seen) seenPerPhysicalObserver.set(source, this.consumedIds)
  }

  /** Called synchronously from the authoritative Case CAS removal callback. */
  consumeAtCommit(ctx: CMainRemovalCommitContext): void {
    if (this.closed) denied('GATE_CLOSED')
    const observer = this.source
    if (!observer) throw new Error('C_MAIN_REMOVAL_CONSENT_MAIN_OBSERVER_NOT_INSTALLED')
    const consent = observer.getObservedMainHumanConsent(ctx.caseId, ctx.requestId)
    if (!consent) throw new Error('C_MAIN_REMOVAL_CONSENT_PHYSICAL_HUMAN_CONFIRMATION_MISSING')
    if (!safe(consent.approvalId) || this.consumedIds.has(consent.approvalId)) {
      denied('APPROVAL_ALREADY_USED_OR_INVALID')
    }
    const identity = ctx.identity
    if (consent.schemaVersion !== 'review-v3-main-human-removal-consent/1' ||
        !safe(consent.caseId) || !safe(consent.requestId) ||
        consent.caseId !== ctx.caseId || consent.requestId !== ctx.requestId ||
        !Number.isSafeInteger(consent.expectedRevision) ||
        consent.expectedRevision !== ctx.currentCaseRevision ||
        !safe(consent.principalId) || !safe(consent.sessionId) ||
        !safe(consent.windowId) || !safe(consent.frameId) ||
        !safe(consent.ownerId) || !safe(consent.authorityEpoch) ||
        !Number.isSafeInteger(consent.ownerGeneration) ||
        consent.ownerGeneration < 0 ||
        consent.principalId !== identity.principalId ||
        consent.sessionId !== identity.sessionId ||
        consent.windowId !== identity.windowId ||
        consent.frameId !== identity.frameId ||
        consent.ownerId !== identity.ownerId ||
        consent.ownerGeneration !== identity.ownerGeneration ||
        consent.authorityEpoch !== identity.authorityEpoch) {
      denied('MAIN_PRINCIPAL_OWNER_FRAME_OR_REVISION_CHANGED')
    }
    const ack = ctx.acknowledgement
    if (!sha(ack.previousFingerprint) || !sha(ack.nextFingerprint) ||
        consent.previousFingerprint !== ack.previousFingerprint ||
        consent.nextFingerprint !== ack.nextFingerprint ||
        !Array.isArray(consent.acknowledgedRemovedIdentities) ||
        !isSame(consent.acknowledgedRemovedIdentities, ctx.computedRemovedIdentities) ||
        !isSame(ack.acknowledgedRemovedIdentities, ctx.computedRemovedIdentities) ||
        !safe(ctx.reason) || consent.reason !== ctx.reason) {
      denied('HUMAN_DID_NOT_CONFIRM_EXACT_DELETED_OBLIGATIONS')
    }
    const now = Date.now()
    if (!Number.isSafeInteger(consent.observedAtMs) ||
        consent.observedAtMs > now ||
        now - consent.observedAtMs > MAX_AGE_MS) {
      denied('HUMAN_CONFIRMATION_EXPIRED_OR_INVALID')
    }
    if (this.consumedIds.size >= LIMIT) {
      this.close()
      denied('CAPACITY_EXHAUSTED_CLOSED')
    }
    // Consume before returning into the CAS callback. On any subsequent I/O
    // failure this approval is lost: the user MUST confirm again, never replay.
    this.consumedIds.add(consent.approvalId)
  }

  close(): void {
    this.closed = true
    // Do NOT clear tombstones. A newly installed gate with the same Main
    // physical observer must still reject already consumed IDs.
  }
}
