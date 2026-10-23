/**
 * Dev-B R19: candidate-only Check x target provenance from actual B2 original
 * bytes, parser registry and (when ZIP-derived) fs-validated per-entry ledger.
 *
 * NOT a C SourceLedger, ApplyMaterial, UpgradePlan, Publisher, or Run writer.
 * The native archive key and B2MainContext must be supplied by trusted Main,
 * never accepted directly from Renderer IPC or model-provided text.
 */
import { createHash } from 'node:crypto'
import {
  compileReviewB1Plan, verifyReviewB1Descriptor,
  type B1AuthorDocument, type ImmutablePlanDescriptorB1,
} from './review-template-plan-adapter-v3-b1'
import {
  ReviewB2StagingService, type B2MainContext, type B2MaterialCandidate,
} from './review-intake-adapter-v3-b2'
import {
  ReviewB2SourceVersionAdapter, type B2CandidateReadExtent,
} from './review-source-version-adapter-v3-b2'
import { ReviewB2ArchiveVault } from './review-import-checkpoint-v3-b2'
import { ReviewB2InputLedger, type B2InputRole } from './review-import-ledger-v3-b2'
import { proposeB2MaterialCandidates } from './review-import-handoff-v3-b2'

const sha = (s: string): string => createHash('sha256').update(s).digest('hex')
const deny = (reason: string): never => { throw new Error('B_R19_' + reason) }
const bindingId = (checkKey: string, targetKey: string, objectKey: string,
  subjectId: string): string => JSON.stringify([checkKey, targetKey, objectKey, subjectId])
const sourceId = (binding: string, source: string): string => JSON.stringify([binding, source])

export interface B19SourceSelection {
  checkKey: string
  targetKey: string
  sourceId: string
  /** These are selectors only. No caller-supplied SourceIdentity is accepted. */
  candidateId: string
  parseRevision: string
  blockId: string
  requiredRole: B2InputRole
  /** A ZIP source must refer to an entry with an accepted /2 ledger receipt. */
  archiveId?: string
  entryIndex?: number
}
export interface B19TrustedArchiveScope {
  archiveId: string
  /** Main native picker key: must match the checkpoint's physical-key digest. */
  physicalArchiveKey: string
}
export interface B19Evidence {
  sourceId: string
  declaredDocumentVersionId: string
  state: 'linked-candidate' | 'unknown' | 'stale' | 'needs-human-confirmation'
  reason: string
  candidateId: string | null
  documentVersionId: string | null
  materialId: string | null
  rawSha256: string | null
  parseRevision: string | null
  blockId: string | null
  readExtent: B2CandidateReadExtent | null
  archiveId: string | null
  entryIndex: number | null
  ledgerHash: string | null
  receiptHash: string | null
  proposalHash: string | null
  role: B2InputRole | null
  subjectId: string | null
}
export interface B19CheckBinding {
  bindingIdentity: string
  checkKey: string
  targetKey: string
  objectKey: string
  subjectId: string
  applicability: 'applicable' | 'not-applicable' | 'unknown'
  state: B19Evidence['state']
  sources: B19Evidence[]
}
export interface B19InvalidatedEvidence {
  bindingIdentity: string
  sourceId: string
  oldDocumentVersionId: string | null
  oldParseRevision: string | null
  oldBlockId: string | null
  reason: 'source-version-changed' | 'parser-revision-changed' |
    'source-unavailable' | 'binding-removed-or-changed'
}
export interface B19CandidateSnapshot {
  schemaVersion: 'review-v3-b1-b2-candidate-source/1'
  candidateOnly: true
  publicationAllowed: false
  businessWriteAllowed: false
  schoolPolicyVerified: false
  caseCandidateId: string
  ownerId: string
  ownerGeneration: number
  planFingerprint: string
  authorDigest: string
  bindings: B19CheckBinding[]
  invalidatedPriorEvidence: B19InvalidatedEvidence[]
  /** Audit checksum, NOT a signature or a source of authority. */
  snapshotHash: string
}
export interface B19CandidateEnvironment {
  staging: ReviewB2StagingService
  parser: ReviewB2SourceVersionAdapter
  vault?: ReviewB2ArchiveVault
  ledger?: ReviewB2InputLedger
  /** Each key must come from the active trusted Main native picker, never UI. */
  trustedArchiveScopes?: B19TrustedArchiveScope[]
  /** Previous snapshot is audit-only; never establishes current validity. */
  previous?: B19CandidateSnapshot
}

const evidenceKey = (entry: B19SourceSelection): string =>
  JSON.stringify([entry.checkKey, entry.targetKey, entry.sourceId])

const auditHash = (snapshot: Omit<B19CandidateSnapshot,'snapshotHash'>): string =>
  sha(JSON.stringify(snapshot))
const empty = (source: string, version: string): B19Evidence => ({
  sourceId: source, declaredDocumentVersionId: version,
  state: 'unknown', reason: 'NO_SOURCE_SELECTION', candidateId: null,
  documentVersionId: null, materialId: null, rawSha256: null,
  parseRevision: null, blockId: null, readExtent: null,
  archiveId: null, entryIndex: null, ledgerHash: null, receiptHash: null,
  proposalHash: null, role: null, subjectId: null,
})
const sourceIdentity = (proof: B19Evidence): string =>
  JSON.stringify([proof.documentVersionId, proof.materialId, proof.rawSha256,
    proof.parseRevision, proof.blockId, proof.archiveId, proof.entryIndex,
    proof.ledgerHash, proof.receiptHash, proof.proposalHash])

/** Conservative source identity proof: no filename/text based aliasing. */
function resolveSource(
  ctx: B2MainContext, targetSubject: string, declaredVersion: string,
  selection: B19SourceSelection, environment: B19CandidateEnvironment,
): B19Evidence {
  const result = empty(selection.sourceId, declaredVersion)
  const candidate = environment.staging.getCandidate(ctx, selection.candidateId)
  result.candidateId = candidate.candidateId
  result.documentVersionId = candidate.documentVersionId
  result.materialId = candidate.materialId
  result.rawSha256 = candidate.rawSha256
  result.parseRevision = selection.parseRevision
  result.blockId = selection.blockId
  result.archiveId = selection.archiveId ?? null
  result.entryIndex = selection.entryIndex ?? null
  // B1 author document version is a claim: never silently rewrite the frozen Plan.
  if (candidate.documentVersionId !== declaredVersion) {
    result.state = 'stale'; result.reason = 'DECLARED_SOURCE_VERSION_CHANGED'
    return result
  }
  let acceptedRole: B2InputRole | null = null
  let confirmedSubject: string | null = null
  if (selection.archiveId !== undefined || selection.entryIndex !== undefined) {
    if (!selection.archiveId || !Number.isSafeInteger(selection.entryIndex) ||
        (selection.entryIndex ?? -1) < 0) deny('ZIP_SELECTOR_INCOMPLETE')
    const vault = environment.vault, ledger = environment.ledger
    const archiveId = selection.archiveId
    if (vault === undefined || ledger === undefined || typeof archiveId !== 'string') {
      throw new Error('B_R19_ZIP_LEDGER_REQUIRED')
    }
    const scope = environment.trustedArchiveScopes?.find(x => x.archiveId === archiveId)
    if (!scope) {
      result.state = 'needs-human-confirmation'
      result.reason = 'NATIVE_ARCHIVE_REAUTH_REQUIRED'
      return result
    }
    const archive = vault.inspect(ctx, archiveId)
    if (archive.ownerId !== ctx.ownerId ||
        archive.caseCandidateId !== ctx.caseCandidateId ||
        sha(scope.physicalArchiveKey) !== archive.physicalArchiveKeyDigest)
      deny('NATIVE_ARCHIVE_KEY_MISMATCH')
    const archivePhysicalKeyDigest = sha(JSON.stringify([
      ctx.ownerId, ctx.ownerGeneration, ctx.caseCandidateId,
      scope.physicalArchiveKey, archive.archiveSha256,
    ]))
    const original = archive.fileReceipts.find(x => x.index === selection.entryIndex)
    if (!original || original.status !== 'accepted') {
      result.state = 'needs-human-confirmation'
      result.reason = 'ARCHIVE_ENTRY_NOT_ACCEPTED'
      return result
    }
    const expectedPhysical = 'zip-' + sha(JSON.stringify([
      archivePhysicalKeyDigest, original.index, original.entryName,
    ]))
    const expectedRequest = 'zip-' + sha(JSON.stringify([
      archive.requestId, original.index, original.entryName,
    ])).slice(0,40)
    if (candidate.physicalSourceKey !== expectedPhysical ||
        candidate.requestId !== expectedRequest ||
        candidate.fileName !== original.entryName.split('/').at(-1) ||
        candidate.rawSha256 !== original.rawSha256) deny('ZIP_STAGED_ENTRY_IDENTITY_MISMATCH')
    const proposals = proposeB2MaterialCandidates(ctx,vault,
      environment.staging,ledger,archiveId)
    const proposal = proposals.find(x => x.entryIndex === selection.entryIndex)
    if (!proposal) {
      result.state = 'needs-human-confirmation'
      result.reason = 'INPUT_LEDGER_NOT_ACCEPTED'
      return result
    }
    if (proposal.rawSha256 !== candidate.rawSha256 ||
        proposal.archiveSha256 !== archive.archiveSha256 ||
        proposal.caseCandidateId !== ctx.caseCandidateId ||
        proposal.ownerId !== ctx.ownerId ||
        proposal.entryName !== original.entryName) deny('LEDGER_SOURCE_IDENTITY_MISMATCH')
    // A recovered archive can retain old receipts: those are historical
    // evidence, not new-generation authority to bind a live applicant.
    const latestLedger = ledger.snapshot(ctx,archiveId)
    const confirmed = latestLedger.mutations.find(m =>
      m.receiptHash === proposal.confirmingReceiptHash)
    if (!confirmed || confirmed.ownerGeneration !== ctx.ownerGeneration) {
      result.state = 'needs-human-confirmation'
      result.reason = 'HISTORIC_INPUT_RECEIPT_REAUTH_REQUIRED'
      return result
    }
    result.ledgerHash = proposal.sourceLedgerHash
    result.receiptHash = proposal.confirmingReceiptHash
    result.proposalHash = proposal.proposalHash
    acceptedRole = proposal.role
    confirmedSubject = proposal.subjectId
  } else {
    // A direct staging role is still only a Main-picked candidate claim,
    // not a durable per-entry confirmed Subject/role receipt.
    if (candidate.role !== 'unassigned') acceptedRole = candidate.role
    confirmedSubject = candidate.subjectId
  }
  result.role = acceptedRole
  result.subjectId = confirmedSubject
  if (acceptedRole !== selection.requiredRole || confirmedSubject !== targetSubject) {
    result.state = 'needs-human-confirmation'
    result.reason = 'SUBJECT_OR_ROLE_MISMATCH'
    return result
  }
  // This call checks registry + physical bytes again; stale parser block or
  // replayed parseRevision can NEVER be treated as current evidence.
  let extent: B2CandidateReadExtent
  try {
    extent = environment.parser.candidateReadExtent(ctx,candidate.candidateId,
      selection.parseRevision,selection.blockId,'single-parser-block')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN'
    if (!/^B2_SOURCE_(STALE|BLOCK_UNVERIFIED|READ_EXTENT_NOT_PROVEN)$/.test(message))
      throw error
    result.state = message.endsWith('READ_EXTENT_NOT_PROVEN')
      ? 'needs-human-confirmation' : 'stale'
    result.reason = message
    return result
  }
  if (extent.source.caseId !== ctx.caseCandidateId ||
      extent.source.materialId !== candidate.materialId ||
      extent.source.documentVersionId !== candidate.documentVersionId ||
      extent.source.rawSha256 !== candidate.rawSha256 ||
      extent.source.parseRevision !== selection.parseRevision ||
      extent.source.blockId !== selection.blockId) deny('PARSER_SOURCE_IDENTITY_MISMATCH')
  result.readExtent = extent
  result.state = result.receiptHash ? 'linked-candidate' : 'needs-human-confirmation'
  result.reason = result.receiptHash ? 'B2_PARSER_AND_ACCEPTED_INPUT_RECEIPT_LINKED'
    : 'DIRECT_STAGE_AWAITING_TRUSTED_SUBJECT_RECEIPT'
  return result
}

/**
 * Construct a complete Check x target provenance snapshot from CURRENT Main
 * B2 capabilities. No acceptance semantics, no mutation, no policy upgrade.
 * Missing source selections do not erase an obligation.
 */
export function buildB19CandidateSourceBindings(
  ctx: B2MainContext,
  author: B1AuthorDocument,
  frozen: ImmutablePlanDescriptorB1,
  selections: readonly B19SourceSelection[],
  environment: B19CandidateEnvironment,
): B19CandidateSnapshot {
  environment.staging.assertStillGranted(ctx)
  verifyReviewB1Descriptor(author,frozen)
  // Also ensure the active compiler still agrees with the frozen candidate.
  const compiled = compileReviewB1Plan(author)
  if (compiled.canonicalPlan.fingerprint !== frozen.canonicalPlan.fingerprint)
    deny('PLAN_CHANGED')
  if (!Array.isArray(selections)) deny('INVALID_SELECTIONS')
  const selected = new Map<string,B19SourceSelection>()
  const validKeys = new Set(frozen.bindingDetails.flatMap(binding =>
    binding.sourceIds.map(source => JSON.stringify([binding.checkKey,binding.targetKey,source]))))
  for (const entry of selections) {
    if (!entry || !validKeys.has(evidenceKey(entry)) ||
        !['application','supporting'].includes(entry.requiredRole) ||
        !entry.candidateId || !entry.parseRevision || !entry.blockId ||
        selected.has(evidenceKey(entry))) deny('SELECTION_INVALID_OR_DUPLICATE')
    selected.set(evidenceKey(entry),entry)
  }
  const declared = new Map(frozen.sourceLedger.map(x=>[x.sourceId,x]))
  const bindings: B19CheckBinding[] = frozen.bindingDetails.map(binding => {
    const identity = bindingId(binding.checkKey,binding.targetKey,
      binding.objectKey,binding.subjectId)
    const sources = binding.sourceIds.map(id => {
      const version = declared.get(id)!.documentVersionId
      const selection = selected.get(JSON.stringify([binding.checkKey,binding.targetKey,id]))
      return selection
        ? resolveSource(ctx,binding.subjectId,version,selection,environment)
        : empty(id,version)
    })
    const state = sources.some(x => x.state === 'stale') ? 'stale'
      : sources.some(x => x.state === 'needs-human-confirmation') ? 'needs-human-confirmation'
      : sources.some(x => x.state === 'unknown') || binding.applicability === 'unknown'
        ? 'unknown' : 'linked-candidate'
    return {
      bindingIdentity:identity,checkKey:binding.checkKey,targetKey:binding.targetKey,
      objectKey:binding.objectKey,subjectId:binding.subjectId,
      applicability:binding.applicability,state,sources,
    }
  })
  const invalidated: B19InvalidatedEvidence[] = []
  const previous = environment.previous
  if (previous) {
    const {snapshotHash,...plain} = previous
    if (previous.schemaVersion !== 'review-v3-b1-b2-candidate-source/1' ||
        !previous.candidateOnly || previous.publicationAllowed !== false ||
        previous.businessWriteAllowed !== false || previous.schoolPolicyVerified !== false ||
        previous.caseCandidateId !== ctx.caseCandidateId ||
        previous.ownerId !== ctx.ownerId ||
        !Number.isSafeInteger(previous.ownerGeneration) ||
        auditHash(plain) !== snapshotHash) deny('PRIOR_SNAPSHOT_UNTRUSTED')
    const current = new Map<string,B19Evidence>()
    for (const binding of bindings) for (const proof of binding.sources)
      current.set(sourceId(binding.bindingIdentity,proof.sourceId),proof)
    for (const oldBinding of previous.bindings) {
      for (const old of oldBinding.sources) {
        if (old.state !== 'linked-candidate') continue
        const latest = current.get(sourceId(oldBinding.bindingIdentity,old.sourceId))
        const reason: B19InvalidatedEvidence['reason'] =
          !latest ? 'binding-removed-or-changed'
          : latest.state !== 'linked-candidate' ? 'source-unavailable'
          : latest.documentVersionId !== old.documentVersionId ||
            latest.materialId !== old.materialId || latest.rawSha256 !== old.rawSha256 ||
            latest.archiveId !== old.archiveId || latest.entryIndex !== old.entryIndex
            ? 'source-version-changed'
          : sourceIdentity(latest) !== sourceIdentity(old)
            ? 'parser-revision-changed' : null as never
        if (reason) invalidated.push({
          bindingIdentity:oldBinding.bindingIdentity,sourceId:old.sourceId,
          oldDocumentVersionId:old.documentVersionId,oldParseRevision:old.parseRevision,
          oldBlockId:old.blockId,reason,
        })
      }
    }
  }
  environment.staging.assertStillGranted(ctx)
  const plain: Omit<B19CandidateSnapshot,'snapshotHash'> = {
    schemaVersion:'review-v3-b1-b2-candidate-source/1',candidateOnly:true,
    publicationAllowed:false,businessWriteAllowed:false,schoolPolicyVerified:false,
    caseCandidateId:ctx.caseCandidateId,ownerId:ctx.ownerId,
    ownerGeneration:ctx.ownerGeneration,
    planFingerprint:frozen.canonicalPlan.fingerprint,authorDigest:frozen.authorDigest,
    bindings,invalidatedPriorEvidence:invalidated,
  }
  return structuredClone({...plain,snapshotHash:auditHash(plain)})
}
