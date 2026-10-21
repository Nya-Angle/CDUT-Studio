/**
 * Dev-C C-MAIN-B20-R01: Main-side trust boundary for Dev-B R20 current
 * candidate bundles. This owns AUTHORIZATION, not B1/B2/B19 data semantics.
 *
 * No import/cherry-pick of B source: B R20 is a separately signed source-only
 * dependency until its exact import graph gets its own C-approved replay.
 * There is NO registered IPC, Publisher, Case/Run writer or invented Owner.
 *
 * A future real Electron Main composition supplies all callbacks from the
 * physical authenticated mainFrame, active Owner and native-picker registry.
 * Renderer input may choose a template to view, never expected revision,
 * actor, source identity, archive key, grant or source registry.
 */
import type { CMainAuthorReadIdentity } from './review-v3-main-author-revision-read'

export interface CMainB20ReadIdentity extends CMainAuthorReadIdentity {
  readonly caseCandidateId: string
}

export interface CMainB20PinnedExpectation {
  readonly templateId: string
  readonly revision: number
  readonly revisionDigest: string
  readonly frozenFingerprint: string
}

/** Exact public projection of B R20's candidate-only bundle. */
export interface CMainB20CandidatePreview {
  readonly schemaVersion: 'review-v3-cmain-b20-candidate-preview/1'
  readonly templateId: string
  readonly caseCandidateId: string
  readonly ownerId: string
  readonly ownerGeneration: number
  readonly authorRevision: number
  readonly authorRevisionDigest: string
  readonly frozenFingerprint: string
  readonly candidateProvenance: unknown
  readonly state: 'candidate-held'
  readonly displayOnly: true
  readonly candidateOnly: true
  readonly publicationAllowed: false
  readonly businessWriteAllowed: false
  readonly schoolPolicyVerified: false
}

export interface CMainB20TrustedReadSources {
  /** Physical C Main sender/frame/Principal + current scoped Owner. */
  currentIdentity(): CMainB20ReadIdentity | undefined
  /** Active C Main installation token: rotates even after same-object reinstall. */
  currentInstallationToken(): string | undefined
  /** Independent C current-owner/Principal/Case/template read ACL. */
  canRead(identity: CMainB20ReadIdentity, templateId: string): boolean
  /** Exact revision + fingerprint from a C Main-authenticated pinned registry. */
  getPinnedExpectation(identity: CMainB20ReadIdentity, templateId: string):
    CMainB20PinnedExpectation | undefined
  /** Trusted Dev-B R20 source consumer; B Main deps remain private to caller. */
  readCurrentBundle(expected: CMainB20PinnedExpectation):
    Promise<unknown> | unknown
}

const deny = (reason: string): never => { throw new Error('C_MAIN_B20_' + reason) }
const digest = (s: unknown): s is string =>
  typeof s === 'string' && /^[a-f0-9]{64}$/.test(s)
const valid = (s: unknown): s is string =>
  typeof s === 'string' && s.trim().length > 0 && s.length <= 256
const templatePattern = /^[A-Za-z][A-Za-z0-9._-]{0,79}$/
const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b)

function identity(source: CMainB20TrustedReadSources): CMainB20ReadIdentity {
  const i = source.currentIdentity()
  if (!i || !valid(i.principalId) || !valid(i.sessionId) ||
      !valid(i.ownerId) || !valid(i.windowId) || !valid(i.frameId) ||
      !valid(i.authorityEpoch) || !valid(i.caseCandidateId) ||
      !Number.isSafeInteger(i.ownerGeneration) || i.ownerGeneration < 0) {
    return deny('MAIN_IDENTITY_NOT_INSTALLED')
  }
  return structuredClone(i)
}

function expectation(
  source: CMainB20TrustedReadSources, scope: CMainB20ReadIdentity,
  templateId: string,
): CMainB20PinnedExpectation {
  if (!source.canRead(scope, templateId)) return deny('MAIN_ACL_REVOKED')
  const expected = source.getPinnedExpectation(scope, templateId)
  if (!expected || expected.templateId !== templateId ||
      !Number.isSafeInteger(expected.revision) || expected.revision < 1 ||
      !digest(expected.revisionDigest) || !digest(expected.frozenFingerprint)) {
    return deny('PINNED_AUTHOR_SOURCE_MISSING')
  }
  return structuredClone(expected)
}

function installed(source: CMainB20TrustedReadSources): string {
  const token = source.currentInstallationToken()
  if (!valid(token)) return deny('MAIN_INSTALLATION_MISSING')
  return token
}

type CandidateBundle = Record<string, unknown>
function assertBundle(
  raw: unknown, expected: CMainB20PinnedExpectation,
  scope: CMainB20ReadIdentity,
): CandidateBundle {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw))
    return deny('B20_CURRENT_BUNDLE_INVALID')
  const b = raw as CandidateBundle
  if (b.schemaVersion !== 'review-v3-b20-main-read-bundle/1' ||
      b.candidateOnly !== true || b.publicationAllowed !== false ||
      b.businessWriteAllowed !== false || b.schoolPolicyVerified !== false ||
      b.authorityInstalledByB !== false || b.authorStatus !== 'candidate-held' ||
      b.templateId !== expected.templateId ||
      b.authorRevision !== expected.revision ||
      b.authorRevisionDigest !== expected.revisionDigest ||
      b.frozenFingerprint !== expected.frozenFingerprint ||
      b.ownerId !== scope.ownerId ||
      b.ownerGeneration !== scope.ownerGeneration ||
      b.caseCandidateId !== scope.caseCandidateId) {
    return deny('B20_BUNDLE_NOT_PINNED_TO_MAIN')
  }
  const frozen = b.frozenDescriptor
  if (!frozen || typeof frozen !== 'object' || Array.isArray(frozen) ||
      (frozen as {canonicalPlan?:{fingerprint?:unknown}}).canonicalPlan?.fingerprint !==
        expected.frozenFingerprint) {
    return deny('B20_FROZEN_DESCRIPTOR_MISMATCH')
  }
  const candidate = b.candidateProvenance
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate))
    return deny('B20_SOURCE_PROVENANCE_MISSING')
  const p = candidate as Record<string, unknown>
  if (p.schemaVersion !== 'review-v3-b1-b2-candidate-source/1' ||
      p.candidateOnly !== true || p.publicationAllowed !== false ||
      p.businessWriteAllowed !== false || p.schoolPolicyVerified !== false ||
      p.ownerId !== scope.ownerId ||
      p.ownerGeneration !== scope.ownerGeneration ||
      p.caseCandidateId !== scope.caseCandidateId ||
      p.planFingerprint !== expected.frozenFingerprint ||
      !Array.isArray(p.bindings) || !Array.isArray(p.invalidatedPriorEvidence) ||
      !digest(p.snapshotHash)) {
    return deny('B20_SOURCE_PROVENANCE_NOT_CURRENT')
  }
  return structuredClone(b)
}

/**
 * Build an inert Main-only reader from the signed B20 functional dependency.
 * An actual sender/Owner provider and an independently source-locked B20
 * readCurrentBundle must be explicitly installed by C privileged Main.
 */
export class CMainB20TrustedCandidateRead {
  constructor(private readonly source: CMainB20TrustedReadSources) {
    if (!source || typeof source.currentIdentity !== 'function' ||
        typeof source.currentInstallationToken !== 'function' ||
        typeof source.canRead !== 'function' ||
        typeof source.getPinnedExpectation !== 'function' ||
        typeof source.readCurrentBundle !== 'function') {
      deny('TRUSTED_MAIN_AND_B20_DEPENDENCIES_REQUIRED')
    }
  }

  async read(templateId: string): Promise<CMainB20CandidatePreview> {
    if (!templatePattern.test(templateId) || templateId === '.' || templateId === '..')
      return deny('TEMPLATE_SCOPE_INVALID')
    const token = installed(this.source)
    const atStart = identity(this.source)
    const pinned = expectation(this.source, atStart, templateId)

    const first = assertBundle(await this.source.readCurrentBundle(pinned), pinned, atStart)
    // The first B20 bundle can await a disk operation; re-attest before reuse.
    if (installed(this.source) !== token ||
        !same(identity(this.source), atStart) ||
        !same(expectation(this.source, atStart, templateId), pinned)) {
      return deny('MAIN_CONTEXT_REVOKED_AFTER_B20_READ')
    }
    // Re-read the actual candidate source and physical evidence after any
    // independent asynchronous hop: earlier memoized UI snapshots cannot win.
    const second = assertBundle(await this.source.readCurrentBundle(pinned), pinned, atStart)
    if (installed(this.source) !== token ||
        !same(identity(this.source), atStart) ||
        !same(expectation(this.source, atStart, templateId), pinned)) {
      return deny('MAIN_CONTEXT_REVOKED_AFTER_B20_READ')
    }
    if (!same(first, second)) return deny('B20_SOURCE_CHANGED_DURING_READ')
    return structuredClone({
      schemaVersion: 'review-v3-cmain-b20-candidate-preview/1',
      templateId, caseCandidateId: atStart.caseCandidateId,
      ownerId: atStart.ownerId, ownerGeneration: atStart.ownerGeneration,
      authorRevision: pinned.revision, authorRevisionDigest: pinned.revisionDigest,
      frozenFingerprint: pinned.frozenFingerprint,
      candidateProvenance: second.candidateProvenance,
      state: 'candidate-held', displayOnly: true, candidateOnly: true,
      publicationAllowed: false, businessWriteAllowed: false,
      schoolPolicyVerified: false,
    } satisfies CMainB20CandidatePreview)
  }
}
