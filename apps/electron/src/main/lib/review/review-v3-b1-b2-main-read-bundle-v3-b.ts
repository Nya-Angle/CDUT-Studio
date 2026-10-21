/**
 * Dev-B R20: current, durable B1 author + B2 original/parser/input-receipt
 * + B19 Check×target read-only composition for a future C-owned Main reader.
 *
 * IMPORTANT: Dependency injection is NOT Main authentication. The C-owned
 * consumer must supply real current Principal, frame, Owner/grant/epoch and
 * native-picker provenance and revalidate them around EVERY await/IPC hop.
 * This service NEVER makes a Renderer claim into a trusted source or issuer.
 */
import { readB1AuthorRevision, readB1FrozenCandidate } from './review-template-author-store-v3-b1'
import { verifyReviewB1Descriptor, type ImmutablePlanDescriptorB1 } from './review-template-plan-adapter-v3-b1'
import { type B2MainContext, ReviewB2StagingService } from './review-intake-adapter-v3-b2'
import { ReviewB2SourceVersionAdapter } from './review-source-version-adapter-v3-b2'
import { ReviewB2ArchiveVault } from './review-import-checkpoint-v3-b2'
import { ReviewB2InputLedger } from './review-import-ledger-v3-b2'
import {
  buildB19CandidateSourceBindings,
  type B19CandidateSnapshot, type B19SourceSelection, type B19TrustedArchiveScope,
} from './review-v3-b1-b2-candidate-source-bridge'

const refuse = (code: string): never => { throw new Error('B_R20_' + code) }
const sha = /^[a-f0-9]{64}$/
const validText = (x: unknown): x is string =>
  typeof x === 'string' && x.trim().length > 0

/**
 * Current values C Main MUST derive from its independent trusted runtime,
 * not any Renderer request body. B does not claim these fields are verified.
 * C must also independently check authority installation & epoch continuity.
 */
export interface B20MainReadScope extends B2MainContext {
  principalId: string
  sessionId: string
  authorityEpoch: number
}
export interface B20ReadAuthorExpectation {
  templateId: string
  revision: number
  /** JSON digest of the persisted author revision, NOT B1 descriptor authorDigest. */
  revisionDigest: string
  frozenFingerprint: string
}
export interface B20CurrentMainReadAuthority {
  /** Fail closed if C Main has not installed its genuine identity/Owner/frame authority. */
  currentScope(): B20MainReadScope | null
  /**
   * Current selections come from C Main's authenticated candidate registry;
   * no renderer-provided SourceIdentity, archive key or school issuer is accepted.
   * An EMPTY valid registry means all sources UNKNOWN, not automatic approval.
   */
  currentSelections(scope: Readonly<B20MainReadScope>, author: Readonly<B20ReadAuthorExpectation>):
    readonly B19SourceSelection[] | null
  /**
   * Resolve each physical archive from a still-authorized C Main native picker
   * record. Never return this private key in the facade output or to Renderer.
   */
  nativeArchiveKey(scope: Readonly<B20MainReadScope>, archiveId: string): string | null
}
export interface B20ReadOnlySources {
  staging: ReviewB2StagingService
  parser: ReviewB2SourceVersionAdapter
  vault: ReviewB2ArchiveVault
  ledger: ReviewB2InputLedger
}
export interface B20CurrentCandidateRead {
  schemaVersion: 'review-v3-b20-main-read-bundle/1'
  candidateOnly: true
  publicationAllowed: false
  businessWriteAllowed: false
  schoolPolicyVerified: false
  authorityInstalledByB: false
  caseCandidateId: string
  ownerId: string
  ownerGeneration: number
  templateId: string
  authorRevision: number
  authorRevisionDigest: string
  /** Confirmed persisted author source only. No unsaved editor buffer. */
  authorStatus: 'candidate-held'
  frozenFingerprint: string
  frozenAuthorDigest: string
  frozenDescriptor: ImmutablePlanDescriptorB1
  candidateProvenance: B19CandidateSnapshot
}
export interface B20ReadOnlyDependencies {
  authority?: B20CurrentMainReadAuthority
  sources?: B20ReadOnlySources
}
function verifiedScope(raw: B20MainReadScope | null | undefined): B20MainReadScope {
  if (!raw || !validText(raw.principalId) || !validText(raw.sessionId) ||
      !validText(raw.ownerId) || !validText(raw.caseCandidateId) ||
      !Number.isSafeInteger(raw.ownerGeneration) || raw.ownerGeneration < 0 ||
      !Number.isSafeInteger(raw.authorityEpoch) || raw.authorityEpoch < 0 ||
      !Number.isSafeInteger(raw.senderId) || raw.senderId < 0 ||
      !Number.isSafeInteger(raw.frameId) || raw.frameId < 0) {
    throw new Error('B_R20_MAIN_TRUST_DEPENDENCY_NOT_INSTALLED')
  }
  return structuredClone(raw)
}
function sameScope(a: B20MainReadScope, b: B20MainReadScope): boolean {
  return a.principalId === b.principalId && a.sessionId === b.sessionId &&
    a.ownerId === b.ownerId && a.ownerGeneration === b.ownerGeneration &&
    a.authorityEpoch === b.authorityEpoch && a.caseCandidateId === b.caseCandidateId &&
    a.senderId === b.senderId && a.frameId === b.frameId
}
function validateExpectation(expected: B20ReadAuthorExpectation): void {
  if (!expected || !validText(expected.templateId) ||
      !Number.isSafeInteger(expected.revision) || expected.revision < 1 ||
      !sha.test(expected.revisionDigest) || !sha.test(expected.frozenFingerprint)) {
    throw new Error('B_R20_FROZEN_EXPECTATION_REQUIRED')
  }
}
/**
 * A strictly synchronous B-owned capability consumer. No await occurs here.
 * The C-owned IPC adapter MUST verify its own Principal/Owner/frame identity
 * before AND after any awaits surrounding this call, including later delivery.
 *
 * Both B1 author reads independently validate the full append-only history.
 * The frozen artifact is read from the original B1 vault and verified against
 * the exact latest revision; no shadow vault or implicit freeze is created.
 */
export function readB20CurrentCandidateBundle(
  expected: B20ReadAuthorExpectation,
  dependencies: B20ReadOnlyDependencies,
  previous?: B19CandidateSnapshot,
): B20CurrentCandidateRead {
  validateExpectation(expected)
  const authority = dependencies?.authority
  const sources = dependencies?.sources
  if (!authority || typeof authority.currentScope !== 'function' ||
      typeof authority.currentSelections !== 'function' ||
      typeof authority.nativeArchiveKey !== 'function' ||
      !sources || !sources.staging || !sources.parser || !sources.vault || !sources.ledger) {
    throw new Error('B_R20_MAIN_TRUST_DEPENDENCY_NOT_INSTALLED')
  }
  const scope = verifiedScope(authority.currentScope())
  sources.staging.assertStillGranted(scope)
  const author = readB1AuthorRevision(expected.templateId)
  if (author === undefined) throw new Error('B_R20_CURRENT_AUTHOR_MISSING')
  if (author.templateId !== expected.templateId || author.document.templateId !== expected.templateId ||
      author.revision !== expected.revision || author.digest !== expected.revisionDigest) {
    throw new Error('B_R20_AUTHOR_REVISION_CONFLICT')
  }
  const frozen = readB1FrozenCandidate(expected.templateId, expected.frozenFingerprint)
  if (frozen === undefined) throw new Error('B_R20_FROZEN_CANDIDATE_MISSING')
  if (frozen.templateId !== expected.templateId || frozen.revision !== author.revision ||
      frozen.status !== 'candidate-held' ||
      frozen.descriptor.canonicalPlan.fingerprint !== expected.frozenFingerprint ||
      frozen.descriptor.publicationAllowed !== false ||
      frozen.authorDigest !== frozen.descriptor.authorDigest) {
    throw new Error('B_R20_FROZEN_AUTHOR_MISMATCH')
  }
  verifyReviewB1Descriptor(author.document, frozen.descriptor)
  // C's source selector registry is itself a REQUIRED, independently approved
  // dependency. Raw IPC body selections must never be passed into this facade.
  const selected = authority.currentSelections(scope, expected)
  if (!Array.isArray(selected)) throw new Error('B_R20_SOURCE_REGISTRY_NOT_INSTALLED')
  const selections = structuredClone(selected) as B19SourceSelection[]
  const archiveIds = new Set<string>()
  for (const choice of selections) {
    if (choice?.archiveId) archiveIds.add(choice.archiveId)
  }
  const nativeScopes: B19TrustedArchiveScope[] = []
  for (const archiveId of archiveIds) {
    const physicalArchiveKey = authority.nativeArchiveKey(scope, archiveId)
    if (typeof physicalArchiveKey !== 'string' || !physicalArchiveKey.trim()) {
      throw new Error('B_R20_NATIVE_PICKER_PROVENANCE_NOT_INSTALLED')
    }
    nativeScopes.push({archiveId,physicalArchiveKey})
  }
  const provenance = buildB19CandidateSourceBindings(
    scope, author.document, frozen.descriptor, selections,
    {staging:sources.staging,parser:sources.parser,vault:sources.vault,
      ledger:sources.ledger,trustedArchiveScopes:nativeScopes,previous},
  )
  // Revalidate after independent vault/ledger/parser reads: no old author
  // revision or revoked Owner may sneak into a combined "current" snapshot.
  const last = readB1AuthorRevision(expected.templateId)
  if (!last || last.revision !== author.revision || last.digest !== author.digest ||
      last.templateId !== author.templateId) {
    throw new Error('B_R20_AUTHOR_CHANGED_DURING_READ')
  }
  const lastFrozen = readB1FrozenCandidate(expected.templateId, expected.frozenFingerprint)
  if (!lastFrozen || lastFrozen.revision !== frozen.revision ||
      lastFrozen.authorDigest !== frozen.authorDigest ||
      lastFrozen.descriptor.canonicalPlan.fingerprint !== frozen.descriptor.canonicalPlan.fingerprint) {
    throw new Error('B_R20_FROZEN_CHANGED_DURING_READ')
  }
  const finalScope = verifiedScope(authority.currentScope())
  if (!sameScope(scope,finalScope)) refuse('MAIN_SCOPE_CHANGED_DURING_READ')
  sources.staging.assertStillGranted(finalScope)
  if (provenance.ownerId !== finalScope.ownerId ||
      provenance.ownerGeneration !== finalScope.ownerGeneration ||
      provenance.caseCandidateId !== finalScope.caseCandidateId ||
      provenance.planFingerprint !== expected.frozenFingerprint) {
    throw new Error('B_R20_PROVENANCE_SCOPE_CHANGED')
  }
  const result: B20CurrentCandidateRead = {
    schemaVersion:'review-v3-b20-main-read-bundle/1',
    candidateOnly:true,publicationAllowed:false,businessWriteAllowed:false,
    schoolPolicyVerified:false,authorityInstalledByB:false,
    caseCandidateId:scope.caseCandidateId,ownerId:scope.ownerId,
    ownerGeneration:scope.ownerGeneration,templateId:expected.templateId,
    authorRevision:author.revision,authorRevisionDigest:author.digest,
    authorStatus:'candidate-held',frozenFingerprint:expected.frozenFingerprint,
    frozenAuthorDigest:frozen.authorDigest,
    frozenDescriptor:structuredClone(frozen.descriptor),
    candidateProvenance:provenance,
  }
  // Does not include Principal, session, frame, physical key, unsaved document,
  // issuer, native Case or Business Receipt in the returned data.
  return structuredClone(result)
}
