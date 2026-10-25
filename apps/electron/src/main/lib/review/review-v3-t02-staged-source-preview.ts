/**
 * T02 read-only parsing of a B2 Main-owned physical source candidate.
 * This is NOT a persisted DocumentVersion or a trusted final SourceIdentity.
 * C/L can expose this through an existing authenticated Main read port; it
 * must never accept a Renderer-supplied filesystem path or issue a Case.
 */
import { createHash } from 'node:crypto'
import type { ReviewDocumentBlock } from '@profer/shared'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { extname, join } from 'node:path'
import {
  ReviewB2StagingService, type B2MainContext,
} from './review-intake-adapter-v3-b2'
import { parseFileIntoSourceDocument } from './document-service'
import { assertReviewPreuploadAllowed } from './review-preupload-gate'

export interface T02SourceBlockPreview {
  /** Unique within the B2 document version; stable across repeat previews. */
  sourceBlockKey: string
  kind: ReviewDocumentBlock['kind']
  text: string
  page: number
  table?: { row: number; column: number; sheet?: string }
  /** Image evidence remains unverified, even if a layout engine found its box. */
  requiresVisualInspection: boolean
}

export interface T02StagedSourcePreview {
  schemaVersion: 'review-v3-t02-staged-source-preview/1'
  checkpoint: 'staging-only'
  candidateOnly: true
  candidateId: string
  documentVersionId: string
  fileName: string
  rawSha256: string
  byteLength: number
  parseStatus: 'parsed' | 'partial' | 'failed'
  parseError: string | null
  blockCount: number
  /** Known extracted page numbers, not an assertion about total page count. */
  indexedPages: number[]
  sheets: string[]
  imageBlocksAwaitingInspection: number
  blocks: T02SourceBlockPreview[]
}

/**
 * Read the actual staging bytes and parse with the already shipped PDF/Office/
 * text/image pipeline. A generated temporary path is used only because the
 * existing parsers are path-based, and is removed before the result is returned.
 * Raw images/Office media are not falsely claimed as opened by an inspector.
 */
export async function previewT02StagedSource(
  ctx: B2MainContext,
  staging: ReviewB2StagingService,
  candidateId: string,
): Promise<T02StagedSourcePreview> {
  assertReviewPreuploadAllowed('parse')
  assertReviewPreuploadAllowed('persist')
  staging.assertStillGranted(ctx)
  const source = staging.getCandidate(ctx, candidateId)
  const bytes = staging.read(ctx, candidateId)
  if (bytes.byteLength !== source.byteLength ||
      createHash('sha256').update(bytes).digest('hex') !== source.rawSha256) {
    throw new Error('T02_STAGED_BYTES_CHANGED')
  }
  const temporaryRoot = await mkdtemp(join(tmpdir(), 'review-v3-t02-preview-'))
  try {
    const filePath = join(temporaryRoot, 'source' + extname(source.fileName).toLowerCase())
    await writeFile(filePath, bytes)
    // Unassigned is a staging relationship, not a new official evidence role.
    const parseRole = source.role === 'application' ? 'application' : 'evidence'
    const parsed = await parseFileIntoSourceDocument(filePath, source.fileName, parseRole)
    staging.assertStillGranted(ctx)
    // The caller sees no paths into the temporary directory and no persistent
    // document ID minted by this diagnostic parser.
    const blocks: T02SourceBlockPreview[] = parsed.blocks.map((block, index) => ({
      sourceBlockKey: `${source.documentVersionId}:block:${index + 1}`,
      kind: block.kind,
      text: block.text,
      page: block.page,
      ...(block.table ? { table: block.table } : {}),
      requiresVisualInspection: block.kind === 'image',
    }))
    return {
      schemaVersion: 'review-v3-t02-staged-source-preview/1',
      checkpoint: 'staging-only',
      candidateOnly: true,
      candidateId: source.candidateId,
      documentVersionId: source.documentVersionId,
      fileName: source.fileName,
      rawSha256: source.rawSha256,
      byteLength: source.byteLength,
      parseStatus: parsed.parseStatus,
      parseError: parsed.parseError ?? null,
      blockCount: blocks.length,
      indexedPages: [...new Set(blocks.map((b) => b.page))].sort((a, b) => a - b),
      sheets: [...new Set(blocks.flatMap((b) => b.table?.sheet ? [b.table.sheet] : []))],
      imageBlocksAwaitingInspection: blocks.filter((b) => b.requiresVisualInspection).length,
      blocks,
    }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true })
  }
}

/**
 * Main-scoped complete staged inventory: lists every ZIP entry and image, not
 * a renderer-selected subset. A partial/failed item remains visible.
 */
export async function previewT02StagedInventory(
  ctx: B2MainContext,
  staging: ReviewB2StagingService,
): Promise<{
  schemaVersion: 'review-v3-t02-staged-inventory/1'
  candidateOnly: true
  checkpoint: 'staging-only'
  total: number
  parsed: number
  partial: number
  failed: number
  imagesAwaitingInspection: number
  sources: T02StagedSourcePreview[]
}> {
  const ids = staging.listScopedCandidateIds(ctx)
  const sources: T02StagedSourcePreview[] = []
  for (const id of ids) sources.push(await previewT02StagedSource(ctx, staging, id))
  staging.assertStillGranted(ctx)
  return {
    schemaVersion: 'review-v3-t02-staged-inventory/1',
    candidateOnly: true, checkpoint: 'staging-only',
    total: sources.length,
    parsed: sources.filter((s) => s.parseStatus === 'parsed').length,
    partial: sources.filter((s) => s.parseStatus === 'partial').length,
    failed: sources.filter((s) => s.parseStatus === 'failed').length,
    imagesAwaitingInspection: sources.reduce((n, s) => n + s.imageBlocksAwaitingInspection, 0),
    sources,
  }
}
