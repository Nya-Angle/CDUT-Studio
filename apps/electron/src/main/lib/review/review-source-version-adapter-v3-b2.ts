/**
 * Dev-B B2 parser-verified SourceIdentity adapter. Parses staged ORIGINAL BYTES
 * using existing production document-service (DOCX/XLSX/PDF/image/text).
 * The per-instance block registry—not a Renderer/model-provided ID or coordinate—
 * alone mints C0 SourceIdentity. No CurrentCase, Run or ReviewBatch writes.
 */
import { createHash, randomBytes } from 'node:crypto'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { extname, join } from 'node:path'
import { assertC0SourceIdentity, REVIEW_C0_SCHEMA_VERSION, type SourceIdentity } from '@profer/shared'
import { parseFileIntoSourceDocument } from './document-service'
import {
  ReviewB2StagingService, type B2MainContext, type B2MaterialCandidate,
} from './review-intake-adapter-v3-b2'

const sha256 = (bytes: Uint8Array | string): string => createHash('sha256').update(bytes).digest('hex')
const PARSER_ID = 'review-v3-b2-production-document-service/1'
const allowed = new Set(['.docx', '.xlsx', '.xls', '.pdf', '.png', '.jpg', '.jpeg', '.webp',
  '.gif', '.bmp', '.txt', '.md', '.csv', '.pptx'])
export type B2Precision = 'pdf-rect' | 'sheet-cell' | 'paragraph' | 'document-block' | 'file' | 'approximate'
export type B2ParseStatus = 'parsed' | 'partial' | 'failed'
export interface B2ParsedBlock {
  blockId: string
  text: string
  kind: string
  precision: B2Precision
  location: SourceIdentity['location']
  uncertainty?: string
}
export interface B2ParsedMaterial {
  candidateId: string
  caseCandidateId: string
  materialId: string
  documentVersionId: string
  rawSha256: string
  parseRevision: string
  parserId: typeof PARSER_ID
  status: B2ParseStatus
  error?: string
  blocks: B2ParsedBlock[]
  /** This is a candidate-only verified parser receipt, not a Pi ReadReceipt. */
  inputFingerprint: string
}
/**
 * Candidate-only read-extent evidence. The parser registry can prove a
 * single block, not the entire document or the school's source policy.
 */
export interface B2CandidateReadExtent {
  schemaVersion:'review-v3-b2-candidate-read-extent/1'
  candidateOnly:true
  fullDocumentProven:false
  authorizationGranted:false
  readScope:'single-parser-block'|'file-metadata'
  parseStatus:Exclude<B2ParseStatus,'failed'>
  blockPrecision:B2Precision
  blockKind:string
  textSha256:string|null
  source:SourceIdentity
}
/**
 * Technical lifecycle comparison of two LIVE parser-registered candidate
 * versions. Never updates Case, Run, SourceLedger or institution policy.
 */
export interface B2CandidateVersionTransition {
  schemaVersion:'review-v3-b2-candidate-version-transition/1'
  previousDocumentVersionId:string
  currentDocumentVersionId:string
  previousParseRevision:string
  currentParseRevision:string
  previousRawSha256:string
  currentRawSha256:string
  previousBlockIds:string[]
  currentBlockIds:string[]
  invalidatedOldBlockIds:string[]
  retainedOldBlockIds:string[]
  staleOldEvidenceMustNotBeReused:boolean
  status:'same-active-version'|'changed-source-version'
  candidateOnly:true
  businessWriteAllowed:false
  schoolPolicyVerified:false
}
interface Stored {
  key: string
  ownerId: string
  ownerGeneration: number
  caseCandidateId: string
  parsed: B2ParsedMaterial
}

const hasRect = (b: { page?: number; bbox?: readonly number[] }): boolean =>
  Number.isSafeInteger(b.page) && (b.page ?? 0) > 0 &&
  Array.isArray(b.bbox) && b.bbox.length === 4 &&
  b.bbox.every((value) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1) &&
  b.bbox[0]! <= b.bbox[2]! && b.bbox[1]! <= b.bbox[3]!

/** Geometry accepted from production document-service, never from Renderer. */
export interface B2ParserBlockLocationInput {
  id: string
  kind: string
  page?: number
  bbox?: readonly number[]
  readingOrder?: number
  table?: { row?: number; column?: number; sheet?: string }
}
export interface B2LocatedBlock {
  precision: B2Precision
  location: SourceIdentity['location']
  uncertainty?: string
}

/**
 * C0 has no dedicated DOCX block/table locator kind. Its paragraph location
 * is a transport envelope ONLY; the JSON locator explicitly identifies a
 * Mammoth document-service block ordinal, not an OOXML paragraph or page.
 * Parser fallback and unsupported coordinates must never become exact refs.
 */
export function locateB2ParserBlock(
  ext: string, block: B2ParserBlockLocationInput, parserBlockIndex: number,
  parseError?: string,
): B2LocatedBlock {
  if (!Number.isSafeInteger(parserBlockIndex) || parserBlockIndex < 0 ||
      !block || typeof block.id !== 'string' || !block.id ||
      typeof block.kind !== 'string') throw new Error('B2_SOURCE_BLOCK_LOCATOR_INVALID')
  if (ext === '.pdf' && hasRect(block)) {
    return { precision: 'pdf-rect', location: {
      kind: 'pdf-rect', locator: JSON.stringify({
        page: block.page, rect: block.bbox, readingOrder: block.readingOrder ?? null,
      }),
    }}
  }
  if (['.xlsx', '.xls'].includes(ext) &&
      typeof block.table?.sheet === 'string' && block.table.sheet.trim() &&
      Number.isSafeInteger(block.table.row) && block.table.row! >= 1 &&
      Number.isSafeInteger(block.table.column) && block.table.column! >= 1) {
    return { precision: 'sheet-cell', location: {
      kind: 'sheet-cell', locator: JSON.stringify({
        sheet: block.table.sheet, row: block.table.row, column: block.table.column,
      }),
    }}
  }
  if (ext === '.docx' && block.kind !== 'image' &&
      !parseError?.includes('DOCX 结构解析失败')) {
    const table = block.table
    if (block.kind === 'table-cell' &&
        (!Number.isSafeInteger(table?.row) || table!.row! < 0 ||
         !Number.isSafeInteger(table?.column) || table!.column! < 0)) {
      return {
        precision: 'approximate',
        location: { kind: 'file', locator: JSON.stringify({ originalBlockId: block.id }) },
        uncertainty: 'DOCX table cell has no verified parser row/column',
      }
    }
    return {
      precision: 'document-block',
      location: { kind: 'paragraph', locator: JSON.stringify({
        locatorKind: block.kind === 'table-cell' ? 'docx-table-cell' : 'docx-parser-block',
        parserBlockIndex, originalBlockId: block.id,
        ...(block.kind === 'table-cell' ? {
          table: { row: table!.row, column: table!.column },
        } : {}),
      }) },
      uncertainty: 'DOCX parser block order; original OOXML paragraph/page position not verified',
    }
  }
  if (['.txt', '.md', '.csv'].includes(ext)) {
    return { precision: 'paragraph', location: {
      kind: 'paragraph', locator: JSON.stringify({
        blockIndex: parserBlockIndex, originalBlockId: block.id,
      }),
    }}
  }
  return {
    precision: block.kind === 'image' ? 'file' : 'approximate',
    location: { kind: 'file', locator: JSON.stringify({ originalBlockId: block.id }) },
    uncertainty: block.kind === 'image'
      ? 'Image or embedded image requires independent visual inspection; not OCR full-read'
      : 'Parser did not prove page/cell geometry; file-level location only',
  }
}

/** All proof-relevant parser geometry must participate in the parse revision. */
export function fingerprintB2ParserGeometry(
  inputFingerprint: string, parseStatus: B2ParseStatus,
  blocks: ReadonlyArray<B2ParserBlockLocationInput & { text: string }>,
  parseError?: string,
): string {
  return 'parse-' + sha256(JSON.stringify([
    inputFingerprint, parseStatus, parseError ?? null,
    blocks.map(b => [b.id, b.kind, b.text, b.table, b.bbox, b.page, b.readingOrder]),
  ])).slice(0, 32)
}

export class ReviewB2SourceVersionAdapter {
  private parsed = new Map<string, Stored>()
  constructor(private readonly staging: ReviewB2StagingService) {}

  private identityKey(ctx: B2MainContext, candidateId: string): string {
    return JSON.stringify([ctx.ownerId, ctx.ownerGeneration, ctx.caseCandidateId, candidateId])
  }
  /** Real input bytes are obtained from the owner-bound staging capability, not a provided path. */
  async parse(ctx: B2MainContext, candidate: B2MaterialCandidate): Promise<B2ParsedMaterial> {
    this.staging.assertStillGranted(ctx)
    if (candidate.ownerId !== ctx.ownerId ||
        candidate.ownerGeneration !== ctx.ownerGeneration ||
        candidate.caseCandidateId !== ctx.caseCandidateId ||
        candidate.status !== 'accepted') throw new Error('B2_SOURCE_SCOPE_MISMATCH')
    const trusted = this.staging.getCandidate(ctx, candidate.candidateId)
    if (JSON.stringify(trusted) !== JSON.stringify(candidate)) {
      throw new Error('B2_SOURCE_CANDIDATE_TAMPERED')
    }
    const bytes = this.staging.read(ctx, trusted.candidateId)
    const hash = sha256(bytes)
    if (hash !== candidate.rawSha256 || bytes.byteLength !== candidate.byteLength) {
      throw new Error('B2_SOURCE_BYTES_MISMATCH')
    }
    const ext = extname(candidate.fileName).toLowerCase()
    if (!allowed.has(ext)) throw new Error('B2_SOURCE_FORMAT_UNSUPPORTED')
    const versionKey = this.identityKey(ctx, candidate.candidateId)
    const inputFingerprint = sha256(JSON.stringify([
      PARSER_ID, candidate.caseCandidateId, candidate.documentVersionId,
      candidate.physicalSourceKey, hash, ext,
    ]))
    const existing = this.parsed.get(versionKey)
    if (existing) {
      if (existing.parsed.inputFingerprint !== inputFingerprint) throw new Error('B2_SOURCE_CACHE_IDENTITY_MISMATCH')
      return structuredClone(existing.parsed)
    }

    // Filename cannot escape staging directory. The parser receives original bytes
    // in an isolated temp file with a random basename and approved extension.
    const directory = await mkdtemp(join(tmpdir(), 'review-b2-parser-'))
    const filePath = join(directory, randomBytes(10).toString('hex') + ext)
    try {
      await writeFile(filePath, bytes, { flag: 'wx', mode: 0o600 })
      this.staging.assertStillGranted(ctx) // reject revoke during the write await
      const source = await parseFileIntoSourceDocument(
        filePath, candidate.fileName,
        candidate.role === 'application' ? 'application' : 'evidence',
      )
      // Recheck after parser's async Office/PDF/OCR/fallback activities.
      this.staging.assertStillGranted(ctx)
      if (sha256(bytes) !== candidate.rawSha256) throw new Error('B2_SOURCE_BYTES_MISMATCH')
      if (!['parsed', 'partial', 'failed'].includes(source.parseStatus)) {
        throw new Error('B2_SOURCE_PARSER_STATUS_INVALID')
      }
      const parsedRevision = fingerprintB2ParserGeometry(
        inputFingerprint, source.parseStatus, source.blocks, source.parseError,
      )
      const blocks: B2ParsedBlock[] = []
      const seen = new Set<string>()
      for (let index = 0; index < source.blocks.length; index += 1) {
        const block = source.blocks[index]!
        if (source.parseStatus === 'failed') throw new Error('B2_SOURCE_FAILED_HAS_BLOCKS')
        // Original document-service emits slug-based block IDs. Namespace by the
        // physical version + parseRevision to eliminate same-stem cross-doc alias.
        const blockId = 'src-' + sha256(JSON.stringify([
          candidate.documentVersionId, parsedRevision, block.id, index,
        ])).slice(0, 40)
        if (seen.has(blockId)) throw new Error('B2_SOURCE_BLOCK_COLLISION')
        seen.add(blockId)
        const { precision, location, uncertainty } =
          locateB2ParserBlock(ext, block, index, source.parseError)
        blocks.push({
          blockId, text: block.text, kind: block.kind, precision, location,
          ...(uncertainty ? { uncertainty } : {}),
        })
      }
      // Even a parser-reported 'parsed' with image blocks is not full text/visual inspection.
      const hasUninspectedImage = blocks.some((block) => block.kind === 'image')
      const status: B2ParseStatus = source.parseStatus === 'failed' ? 'failed'
        : source.parseStatus === 'partial' || hasUninspectedImage ? 'partial' : 'parsed'
      const parsed: B2ParsedMaterial = {
        candidateId: candidate.candidateId, caseCandidateId: candidate.caseCandidateId,
        materialId: candidate.materialId, documentVersionId: candidate.documentVersionId,
        rawSha256: hash, parseRevision: parsedRevision, parserId: PARSER_ID,
        status, blocks, inputFingerprint,
        ...(source.parseError || hasUninspectedImage ? {
          error: [source.parseError, hasUninspectedImage
            ? 'Contains image blocks not fully inspected' : undefined].filter(Boolean).join('; '),
        } : {}),
      }
      this.staging.assertStillGranted(ctx)
      this.parsed.set(versionKey, {
        key: versionKey, ownerId: ctx.ownerId,
        ownerGeneration: ctx.ownerGeneration, caseCandidateId: ctx.caseCandidateId,
        parsed,
      })
      return structuredClone(parsed)
    } finally {
      await rm(directory, { recursive: true, force: true })
    }
  }
  /**
   * Only the parser's own registered source and a verified geometric/text
   * precision may be used for a single-block read proposal. Approximate OCR
   * fallback, embedded image, and file-only proofs are metadata ONLY; callers
   * cannot silently treat them as fully read text.
   */
  candidateReadExtent(
    ctx:B2MainContext,candidateId:string,parseRevision:string,blockId:string,
    scope:'single-parser-block'|'file-metadata',
  ):B2CandidateReadExtent {
    this.staging.assertStillGranted(ctx)
    if(scope!=='single-parser-block' && scope!=='file-metadata')
      throw new Error('B2_SOURCE_READ_SCOPE_INVALID')
    const source=this.sourceForBlock(ctx,candidateId,parseRevision,blockId)
    const stored=this.parsed.get(this.identityKey(ctx,candidateId))
    const block=stored?.parsed.blocks.find(x=>x.blockId===blockId)
    if(!stored || !block || stored.parsed.status==='failed')
      throw new Error('B2_SOURCE_STALE')
    const isExact=block.precision==='pdf-rect'||block.precision==='sheet-cell'||
      block.precision==='paragraph'||block.precision==='document-block'
    if(scope==='single-parser-block' &&
       (!isExact||block.kind==='image'||!block.text.trim()))
      throw new Error('B2_SOURCE_READ_EXTENT_NOT_PROVEN')
    return {
      schemaVersion:'review-v3-b2-candidate-read-extent/1',
      candidateOnly:true,fullDocumentProven:false,authorizationGranted:false,
      readScope:scope,parseStatus:stored.parsed.status,
      blockPrecision:block.precision,blockKind:block.kind,
      textSha256:scope==='single-parser-block'?sha256(block.text):null,
      source,
    }
  }
  /**
   * Compare two live Main-staged, parser-verified candidate versions.
   * A replacement physical identity (even byte-identical) invalidates every
   * previous candidate block; there is no heuristic block-by-text migration.
   * After a restart the old parser registry is absent: fail closed rather
   * than pretending an old block is still a live SourceIdentity.
   */
  compareCandidateSourceVersions(
    ctx:B2MainContext,previousCandidateId:string,currentCandidateId:string,
  ):B2CandidateVersionTransition {
    this.staging.assertStillGranted(ctx)
    const lookup=(candidateId:string):B2ParsedMaterial=>{
      const entry=this.parsed.get(this.identityKey(ctx,candidateId))
      if(!entry||entry.parsed.status==='failed')
        throw new Error('B2_SOURCE_TRANSITION_UNVERIFIED')
      const current=this.staging.getCandidate(ctx,candidateId)
      if(current.documentVersionId!==entry.parsed.documentVersionId ||
         current.materialId!==entry.parsed.materialId ||
         current.rawSha256!==entry.parsed.rawSha256 ||
         current.caseCandidateId!==entry.parsed.caseCandidateId ||
         current.ownerId!==ctx.ownerId ||
         current.ownerGeneration!==ctx.ownerGeneration)
        throw new Error('B2_SOURCE_TRANSITION_IDENTITY_CHANGED')
      const bytes=this.staging.read(ctx,candidateId)
      if(bytes.length!==current.byteLength || sha256(bytes)!==current.rawSha256)
        throw new Error('B2_SOURCE_TRANSITION_ORIGINAL_CHANGED')
      return entry.parsed
    }
    const old=lookup(previousCandidateId),next=lookup(currentCandidateId)
    const same=previousCandidateId===currentCandidateId &&
      old.documentVersionId===next.documentVersionId &&
      old.rawSha256===next.rawSha256 &&
      old.parseRevision===next.parseRevision &&
      old.inputFingerprint===next.inputFingerprint
    const priorIds=old.blocks.map(block=>block.blockId)
    return {
      schemaVersion:'review-v3-b2-candidate-version-transition/1',
      previousDocumentVersionId:old.documentVersionId,
      currentDocumentVersionId:next.documentVersionId,
      previousParseRevision:old.parseRevision,
      currentParseRevision:next.parseRevision,
      previousRawSha256:old.rawSha256,currentRawSha256:next.rawSha256,
      previousBlockIds:priorIds,
      currentBlockIds:next.blocks.map(block=>block.blockId),
      invalidatedOldBlockIds:same?[]:priorIds,
      retainedOldBlockIds:same?priorIds:[],
      staleOldEvidenceMustNotBeReused:!same,
      status:same?'same-active-version':'changed-source-version',
      candidateOnly:true,businessWriteAllowed:false,schoolPolicyVerified:false,
    }
  }
  /** Only a block issued by this parser's registry can mint an exact C0 SourceIdentity. */
  sourceForBlock(ctx: B2MainContext, candidateId: string, parseRevision: string, blockId: string): SourceIdentity {
    this.staging.assertStillGranted(ctx)
    const record = this.parsed.get(this.identityKey(ctx, candidateId))
    if (!record || record.ownerId !== ctx.ownerId ||
        record.ownerGeneration !== ctx.ownerGeneration ||
        record.caseCandidateId !== ctx.caseCandidateId ||
        record.parsed.parseRevision !== parseRevision ||
        record.parsed.status === 'failed') throw new Error('B2_SOURCE_STALE')
    const block = record.parsed.blocks.find((candidate) => candidate.blockId === blockId)
    if (!block) throw new Error('B2_SOURCE_BLOCK_UNVERIFIED')
    // Re-validate the physical bytes at evidence mint time; a parser registry
    // cache is not an authority over a future replacement/revocation of the
    // Main-held material. Only the active scoped staging capability is trusted.
    const current = this.staging.getCandidate(ctx,candidateId)
    if(current.documentVersionId!==record.parsed.documentVersionId ||
       current.materialId!==record.parsed.materialId ||
       current.rawSha256!==record.parsed.rawSha256 ||
       current.caseCandidateId!==record.parsed.caseCandidateId ||
       current.ownerId!==ctx.ownerId || current.ownerGeneration!==ctx.ownerGeneration)
      throw new Error('B2_SOURCE_PHYSICAL_REVISION_MISMATCH')
    const original = this.staging.read(ctx,candidateId)
    if(sha256(original)!==record.parsed.rawSha256 ||
       original.byteLength!==current.byteLength)
      throw new Error('B2_SOURCE_PHYSICAL_BYTES_MISMATCH')
    const result: SourceIdentity = {
      schemaVersion: REVIEW_C0_SCHEMA_VERSION,
      caseId: record.parsed.caseCandidateId, materialId: record.parsed.materialId,
      documentVersionId: record.parsed.documentVersionId, rawSha256: record.parsed.rawSha256,
      parseRevision, blockId, location: structuredClone(block.location),
    }
    assertC0SourceIdentity(result)
    return result
  }
}
