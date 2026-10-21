/**
 * T06 -> T02 bridge: turn a *Main-owned* B2 ZIP staging receipt into candidate
 * file groups without copying raw bytes or inventing a second archive decoder.
 * L must retain the staging scope and verify the same physical archive, owner
 * and sealed selection when importing candidateId into a real DocumentVersion.
 */
import type { B2ZipImportPreview } from './review-zip-staging-v3-b2'
import type { T06PhysicalSelection } from '../../../renderer/components/content-review/review-v3-t06-physical-intake'

export interface T06StagedZipSelection {
  source: T06PhysicalSelection
  skipped: Array<{ relativePath: string; reason: string }>
}

export function buildT06SelectionFromB2Staging(staged: B2ZipImportPreview): T06StagedZipSelection {
  const entries: T06PhysicalSelection['entries'] = []
  const skipped: T06StagedZipSelection['skipped'] = []
  for (let i = 0; i < staged.extracted.length; i++) {
    const extracted = staged.extracted[i]!
    const receipt = staged.receipts[i]
    if (extracted.status === 'accepted' && receipt?.candidateId && receipt.status === 'needs-user-confirmation') {
      const candidate = staged.candidates.find(x => x.candidateId === receipt.candidateId)
      if (candidate && candidate.rawSha256 === extracted.rawSha256) {
        entries.push({ entryId: candidate.candidateId, relativePath: extracted.entryName,
          byteLength: candidate.byteLength })
        continue
      }
    }
    skipped.push({ relativePath: extracted.entryName,
      reason: receipt?.reason ?? extracted.reason ?? '未取得可登记原件' })
  }
  return {
    source: {
      selectionId: staged.archivePhysicalKeyDigest,
      previewFingerprint: staged.archiveSha256,
      sourceKind: 'zip',
      entries,
      warnings: skipped.map(x => x.relativePath + '：' + x.reason),
    },
    skipped,
  }
}
