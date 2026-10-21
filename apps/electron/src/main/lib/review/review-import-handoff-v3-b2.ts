/**
 * Dev-B -> Dev-C proposal-only adapter: immutable material INPUT identities.
 * Explicitly not ApplyMaterial, not SourceIdentity and not a CurrentCase write.
 * The C Main consumer must independently revalidate owner, current case revision,
 * original bytes/parser block, source registry, Subject and principal/policy ACL.
 */
import { createHash } from 'node:crypto'
import { type B2MainContext, ReviewB2StagingService } from './review-intake-adapter-v3-b2'
import { ReviewB2ArchiveVault } from './review-import-checkpoint-v3-b2'
import { ReviewB2InputLedger, type B2InputRole } from './review-import-ledger-v3-b2'

const hash = (x:string):string => createHash('sha256').update(x).digest('hex')
export interface B2ApplyMaterialCandidate {
  candidateKind: 'input-only-unapplied'
  archiveId: string
  archiveSha256: string
  entryIndex: number
  entryName: string
  rawSha256: string
  proposedVersionKey: string
  caseCandidateId: string
  ownerId: string
  subjectId: string
  role: B2InputRole
  inputRevision: number
  sourceLedgerHash: string
  confirmingReceiptHash: string
  /** Stable digest of untrusted proposal envelope; not a C authority receipt. */
  proposalHash: string
}
export function proposeB2MaterialCandidates(
  ctx:B2MainContext,
  vault:ReviewB2ArchiveVault,
  staging:ReviewB2StagingService,
  ledger:ReviewB2InputLedger,
  archiveId:string,
): B2ApplyMaterialCandidate[] {
  staging.assertStillGranted(ctx)
  const archive=vault.inspect(ctx,archiveId)
  const current=ledger.snapshot(ctx,archiveId)
  if(current.archiveSha256!==archive.archiveSha256 ||
     current.sourceManifestHash!==archive.manifestSha256) {
    throw new Error('B2_HANDOFF_SOURCE_MISMATCH')
  }
  // Legacy /1 receipt hashes do not seal the confirmed Subject/role.
  // Those inputs require an explicit Main-owned re-confirmation, not a
  // candidate that appears fully verified merely because its ledger SHA fits.
  if(current.schemaVersion!=='review-v3-b2-input-ledger/2')
    throw new Error('B2_HANDOFF_LEGACY_BINDING_UNVERIFIABLE')
  const result:B2ApplyMaterialCandidate[]=[]
  for(const file of current.files) {
    if(file.status!=='accepted')continue
    const source=archive.fileReceipts.find(x=>x.index===file.index)
    if(!source || source.status!=='accepted' || source.rawSha256!==file.rawSha256 ||
       !file.rawSha256 || !file.candidateVersionKey || !file.role || !file.subjectId) {
      throw new Error('B2_HANDOFF_UNVERIFIED_ENTRY')
    }
    const receipt=current.mutations.findLast(x=>x.entryIndex===file.index && x.status==='accepted')
    if(!receipt || receipt.revision>current.revision ||
       receipt.confirmedRole!==file.role ||
       receipt.confirmedSubjectId!==file.subjectId ||
       receipt.confirmedRawSha256!==file.rawSha256)
      throw new Error('B2_HANDOFF_RECEIPT_NOT_FOUND')
    const payload={
      candidateKind:'input-only-unapplied' as const,
      archiveId,archiveSha256:archive.archiveSha256,
      entryIndex:file.index,entryName:file.entryName,rawSha256:file.rawSha256,
      proposedVersionKey:file.candidateVersionKey,
      caseCandidateId:ctx.caseCandidateId,ownerId:ctx.ownerId,
      subjectId:file.subjectId,role:file.role,
      inputRevision:current.revision,sourceLedgerHash:current.ledgerHash,
      confirmingReceiptHash:receipt.receiptHash,
    }
    result.push({...payload,proposalHash:hash(JSON.stringify(payload))})
  }
  staging.assertStillGranted(ctx)
  return structuredClone(result)
}
