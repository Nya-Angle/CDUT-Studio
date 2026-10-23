/**
 * B2 zip -> import-candidate Main adapter. It accepts only Main-verified
 * archive bytes and a Main-issued physical archive key. Renderer must NOT be
 * allowed to call this with fabricated owner/frame/physicalSourceKey.
 *
 * A ZIP is a collection of candidate files, NOT a ReviewBatchAttempt.
 */
import { createHash } from 'node:crypto'
import {
  ReviewB2StagingService, type B2MainContext, type B2MaterialCandidate, type B2ImportReceipt,
} from './review-intake-adapter-v3-b2'
import { decodeReviewB2Zip, type B2ZipLimits, type B2ZipDecodeResult } from './review-zip-intake-v3-b2'

const sha = (value: string): string => createHash('sha256').update(value, 'utf8').digest('hex')
export interface B2TrustedZipInput {
  /** Issued from a trusted Native picker/drop file handle, NOT a renderer path. */
  physicalArchiveKey: string
  /** Stable client retry key; same requestId different archive bytes MUST fail. */
  requestId: string
  bytes: Uint8Array
}
export interface B2ZipImportPreview {
  archiveSha256: string
  archivePhysicalKeyDigest: string
  extracted: B2ZipDecodeResult['receipts']
  candidates: B2MaterialCandidate[]
  receipts: B2ImportReceipt[]
  /** Separate from ReviewBatchAttempt; not an installed or approved Case. */
  importBatchKind: 'import'
  checkpoint: 'staging-only'
}
export function stageReviewB2TrustedZip(
  ctx: B2MainContext,
  staging: ReviewB2StagingService,
  archive: B2TrustedZipInput,
  limits?: B2ZipLimits,
): B2ZipImportPreview {
  staging.assertStillGranted(ctx)
  if (!archive || !archive.physicalArchiveKey?.trim() || !archive.requestId?.trim() ||
      archive.physicalArchiveKey.length > 256 || archive.requestId.length > 128) {
    throw new Error('B2_ZIP_TRUSTED_INPUT_INVALID')
  }
  const decoded = decodeReviewB2Zip(archive.bytes, limits)
  staging.claimArchiveRequest(ctx, archive.requestId, archive.physicalArchiveKey,
    decoded.archiveSha256)
  const archivePhysicalKeyDigest = sha(JSON.stringify([
    ctx.ownerId, ctx.ownerGeneration, ctx.caseCandidateId,
    archive.physicalArchiveKey, decoded.archiveSha256,
  ]))
  const candidates: B2MaterialCandidate[] = []
  const receipts: B2ImportReceipt[] = []
  for (const item of decoded.receipts) {
    staging.assertStillGranted(ctx)
    const accepted = decoded.accepted.find(file => file.index === item.index)
    const stableRequest = 'zip-' + sha(JSON.stringify([
      archive.requestId, item.index, item.entryName,
    ])).slice(0, 40)
    if (!accepted) {
      receipts.push({
        requestId: stableRequest, fileName: item.entryName,
        rawSha256: item.rawSha256 ?? '',
        status: item.status, reason: item.reason,
      })
      continue
    }
    try {
      // Namespaced physically by parent native handle, archive raw SHA and
      // entry path+index. Distinct archive versions never alias.
      const sourceKey = 'zip-' + sha(JSON.stringify([
        archivePhysicalKeyDigest, accepted.index, accepted.entryName,
      ]))
      const grant = staging.grant(ctx)
      const candidate = staging.stage(ctx, grant.token, {
        requestId: stableRequest,
        fileName: accepted.entryName.split('/').at(-1) ?? accepted.entryName,
        physicalSourceKey: sourceKey,
        bytes: accepted.bytes, role: 'unassigned', subjectId: null,
      })
      candidates.push(candidate)
      receipts.push({
        requestId: stableRequest, fileName: accepted.entryName,
        rawSha256: accepted.rawSha256, status: 'needs-user-confirmation',
        candidateId: candidate.candidateId,
        reason: 'File and Subject ownership must be confirmed; staging does not create a Case',
      })
    } catch (err) {
      if (!(err instanceof Error) || !/^B2_MATERIAL_INVALID$/.test(err.message)) throw err
      receipts.push({
        requestId: stableRequest, fileName: accepted.entryName,
        rawSha256: accepted.rawSha256, status: 'rejected', reason: err.message,
      })
    }
  }
  return {
    archiveSha256: decoded.archiveSha256, archivePhysicalKeyDigest,
    extracted: decoded.receipts, candidates, receipts,
    importBatchKind: 'import', checkpoint: 'staging-only',
  }
}
