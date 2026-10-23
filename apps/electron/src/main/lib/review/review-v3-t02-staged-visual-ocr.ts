/**
 * T02 read-only, physically scoped OCR for a B2 candidate.
 * It extends staged preview; it neither installs a DocumentVersion nor
 * executes an official Case/Run. Main must still derive B2MainContext.
 */
import { createHash } from 'node:crypto'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { extname, join } from 'node:path'
import type { ReviewDocumentBlock } from '@profer/shared'
import type { OcrPort } from './ocr-port'
import {
  ReviewB2StagingService, type B2MainContext,
} from './review-intake-adapter-v3-b2'
import { parseT02VisualMaterialWithOcr } from './review-v3-t02-visual-ocr'

export interface T02StagedVisualText {
  sourceBlockKey: string
  text: string
  page: number
  confidence: number | null
  /** Present only when OCR covers a whole image/page; PPTX placements remain unknown. */
  bbox?: ReviewDocumentBlock['bbox']
}

export interface T02StagedVisualOcrPreview {
  schemaVersion: 'review-v3-t02-staged-visual-ocr/1'
  checkpoint: 'staging-only'
  candidateOnly: true
  candidateId: string
  documentVersionId: string
  rawSha256: string
  ocrEngine: string | null
  ocrText: T02StagedVisualText[]
  inspectedImages: number
  imagesAwaitingInspection: number
  warnings: string[]
}

/** caller supplies a capability, NEVER a filesystem path or synthetic actor. */
export async function previewT02StagedVisualOcr(
  ctx: B2MainContext,
  staging: ReviewB2StagingService,
  candidateId: string,
  ocr: OcrPort,
  options: { maxPdfPages?: number; inspectPdfPages?: boolean } = {},
): Promise<T02StagedVisualOcrPreview> {
  staging.assertStillGranted(ctx)
  const source = staging.getCandidate(ctx, candidateId)
  const bytes = staging.read(ctx, candidateId)
  if (bytes.byteLength !== source.byteLength ||
    createHash('sha256').update(bytes).digest('hex') !== source.rawSha256) {
    throw new Error('T02_STAGED_BYTES_CHANGED')
  }
  const root = await mkdtemp(join(tmpdir(), 'review-t02-ocr-preview-'))
  try {
    const filePath = join(root, 'source' + extname(source.fileName).toLowerCase())
    await writeFile(filePath, bytes)
    const outcome = await parseT02VisualMaterialWithOcr({
      filePath, fileName: source.fileName,
      role: source.role === 'application' ? 'application' : 'evidence',
      assetDirectory: root,
      assetRelativePath: 'source-docs/source' + extname(source.fileName).toLowerCase(),
      ocr, ...options,
    })
    staging.assertStillGranted(ctx)
    const ocrText = outcome.source.blocks.filter(b => b.id.includes('-ocr-') && Boolean(b.text)).map((block, index) => ({
      sourceBlockKey: source.documentVersionId + ':ocr:' + block.page + ':' + (index + 1),
      text: block.text,
      page: block.page,
      confidence: block.confidence ?? null,
      ...(block.bbox ? { bbox: block.bbox } : {}),
    }))
    return {
      schemaVersion: 'review-v3-t02-staged-visual-ocr/1',
      checkpoint: 'staging-only',
      candidateOnly: true,
      candidateId: source.candidateId,
      documentVersionId: source.documentVersionId,
      rawSha256: source.rawSha256,
      ocrEngine: outcome.engine,
      ocrText,
      inspectedImages: outcome.inspectedImages,
      imagesAwaitingInspection: outcome.imagesAwaitingInspection,
      warnings: outcome.warnings,
    }
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}
