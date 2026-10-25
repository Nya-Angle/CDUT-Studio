/**
 * Dev-B B2: Main-only ephemeral capability staging. It does not install material
 * into CurrentCase or persist an ImportBatch. Main must authorize the issuing
 * sender/frame/owner and owns the resulting bytes; Renderer may not issue grants.
 * C0 adapter integration and durable checkpoint are pending Dev-C approval.
 */
import { createHash, randomBytes } from 'node:crypto'
import { assertReviewPreuploadAllowed } from './review-preupload-gate'
import {
  REVIEW_C0_SCHEMA_VERSION, assertC0ImportBatch,
  type ImportBatch,
} from '@profer/shared'

const sha256 = (v: Uint8Array | string): string => createHash('sha256').update(v).digest('hex')
const safe = (s: string): boolean => typeof s === 'string' && s.length > 0 && s.length <= 256 && !s.includes('\u0000')
/** Display filename is not a path capability; later consumers must never join arbitrary paths. */
const safeDisplayName = (s: string): boolean => {
  if (!safe(s) || s.includes('/') || s.includes(String.fromCharCode(92)) ||
      s === '.' || s === '..' || s.endsWith('.') || s.endsWith(' ')) return false
  if ([...s].some((ch) => ch.charCodeAt(0) < 32 || ch.charCodeAt(0) === 127 ||
      '<>:"|?*'.includes(ch))) return false
  const device = s.split('.')[0]?.toUpperCase()
  return !['CON','PRN','AUX','NUL',...Array.from({length:9},(_,i)=>'COM'+(i+1)),
    ...Array.from({length:9},(_,i)=>'LPT'+(i+1))].includes(device ?? '')
}
const failed = (reason: string): never => { throw new Error('B2_' + reason) }
const MAX_FILE_BYTES = 50 * 1024 * 1024

/** Must be derived by Dev-C's real Main window/frame authentication, not IPC body. */
export interface B2MainContext {
  senderId: number
  frameId: number
  ownerId: string
  ownerGeneration: number
  caseCandidateId: string
}
export interface B2IntakeGrant {
  readonly token: string
  readonly ownerId: string
  readonly caseCandidateId: string
  readonly expiresAt: number
}
interface LiveGrant extends B2IntakeGrant {
  senderId: number
  frameId: number
  ownerGeneration: number
  consumed: boolean
}
export interface B2MaterialCandidate {
  candidateId: string
  caseCandidateId: string
  materialId: string
  documentVersionId: string
  rawSha256: string
  byteLength: number
  fileName: string
  /** Only created from Main picker/drop records, never from Renderer text. */
  physicalSourceKey: string
  role: 'application' | 'supporting' | 'unassigned'
  subjectId: string | null
  ownerId: string
  ownerGeneration: number
  requestId: string
  status: 'accepted'
}
export interface B2ImportReceipt {
  requestId: string
  fileName: string
  rawSha256: string
  status: 'accepted' | 'skipped' | 'rejected' | 'needs-user-confirmation'
  candidateId?: string
  reason?: string
}
interface Stored {
  material: B2MaterialCandidate
  bytes: Buffer
}

/** No filesystem activity and no shared BusinessCase writes. */
export class ReviewB2StagingService {
  private grants = new Map<string, LiveGrant>()
  private materials = new Map<string, Stored>()
  private requests = new Map<string, { fingerprint: string; candidateId: string }>()
  private archiveRequests = new Map<string, string>()
  private revokedOwners = new Set<string>()
  constructor(private readonly now: () => number = Date.now) {}

  private ownerKey(ctx: B2MainContext): string {
    return ctx.ownerId + '::' + ctx.ownerGeneration
  }
  private requireContext(ctx: B2MainContext): void {
    if (!ctx || !Number.isSafeInteger(ctx.senderId) || ctx.senderId < 0 ||
        !Number.isSafeInteger(ctx.frameId) || ctx.frameId < 0 ||
        !safe(ctx.ownerId) || !safe(ctx.caseCandidateId) ||
        !Number.isSafeInteger(ctx.ownerGeneration) || ctx.ownerGeneration < 0 ||
        this.revokedOwners.has(this.ownerKey(ctx))) failed('OWNER_INVALID_OR_REVOKED')
  }
  grant(ctx: B2MainContext, ttlMs = 20_000): B2IntakeGrant {
    this.requireContext(ctx)
    if (!Number.isSafeInteger(ttlMs) || ttlMs < 1 || ttlMs > 60_000) failed('INVALID_TTL')
    const token = randomBytes(32).toString('hex')
    const record: LiveGrant = {
      token, senderId: ctx.senderId, frameId: ctx.frameId,
      ownerId: ctx.ownerId, ownerGeneration: ctx.ownerGeneration,
      caseCandidateId: ctx.caseCandidateId, consumed: false,
      expiresAt: this.now() + ttlMs,
    }
    this.grants.set(token, record)
    return { token, ownerId: ctx.ownerId, caseCandidateId: ctx.caseCandidateId, expiresAt: record.expiresAt }
  }
  /** Called synchronously on stop/close/revoke; async operations recheck before commit. */
  revoke(ctx: B2MainContext): void {
    if (!ctx || !safe(ctx.ownerId) || !Number.isSafeInteger(ctx.ownerGeneration)) failed('OWNER_INVALID_OR_REVOKED')
    this.revokedOwners.add(this.ownerKey(ctx))
    for (const grant of this.grants.values()) {
      if (grant.ownerId === ctx.ownerId && grant.ownerGeneration === ctx.ownerGeneration) grant.consumed = true
    }
  }
  assertStillGranted(ctx: B2MainContext): void { this.requireContext(ctx) }
  /**
   * Entire-archive idempotency guard; avoids a changed ZIP retry silently
   * mixing files from two different snapshots under one requestId. Main owns
   * and validates physicalArchiveKey; the caller cannot self-issue identity.
   */
  claimArchiveRequest(ctx: B2MainContext, requestId: string, physicalArchiveKey: string,
    archiveSha256: string): void {
    this.requireContext(ctx)
    if (!safe(requestId) || !safe(physicalArchiveKey) || !/^[a-f0-9]{64}$/.test(archiveSha256)) {
      failed('ARCHIVE_REQUEST_INVALID')
    }
    const key = JSON.stringify([ctx.ownerId, ctx.ownerGeneration, ctx.caseCandidateId, requestId])
    const identity = sha256(JSON.stringify([physicalArchiveKey, archiveSha256]))
    const previous = this.archiveRequests.get(key)
    if (previous && previous !== identity) failed('REQUEST_ID_COLLISION')
    if (!previous) this.archiveRequests.set(key, identity)
  }
  /** Untrusted bytes are defensively copied; no path is opened on Renderer instruction. */
  stage(
    ctx: B2MainContext,
    token: string,
    input: { requestId: string; fileName: string; physicalSourceKey: string;
      bytes: Uint8Array; role: B2MaterialCandidate['role']; subjectId?: string | null },
  ): B2MaterialCandidate {
    assertReviewPreuploadAllowed('persist')
    this.requireContext(ctx)
    const grant = this.grants.get(token)
    if (!grant || grant.consumed || grant.expiresAt <= this.now()) throw new Error('B2_TOKEN_INVALID_OR_CONSUMED')
    if (grant.senderId !== ctx.senderId || grant.frameId !== ctx.frameId ||
        grant.ownerId !== ctx.ownerId || grant.ownerGeneration !== ctx.ownerGeneration ||
        grant.caseCandidateId !== ctx.caseCandidateId) failed('TOKEN_SCOPE_MISMATCH')
    // Consume before any bytes copy or persistence; double-click and re-entrancy fail closed.
    grant.consumed = true
    if (!safe(input.requestId) || !safeDisplayName(input.fileName) || !safe(input.physicalSourceKey) ||
        !['application','supporting','unassigned'].includes(input.role) ||
        (input.subjectId != null && !safe(input.subjectId)) ||
        !(input.bytes instanceof Uint8Array) ||
        input.bytes.byteLength < 1 || input.bytes.byteLength > MAX_FILE_BYTES) failed('MATERIAL_INVALID')
    const bytes = Buffer.from(input.bytes)
    const rawSha256 = sha256(bytes)
    const fingerprint = sha256(JSON.stringify({
      ownerId: ctx.ownerId, caseCandidateId: ctx.caseCandidateId,
      physicalSourceKey: input.physicalSourceKey, rawSha256, fileName: input.fileName,
      subjectId: input.subjectId ?? null, role: input.role,
    }))
    const requestKey = JSON.stringify([ctx.ownerId,ctx.ownerGeneration,ctx.caseCandidateId,input.requestId])
    const prior = this.requests.get(requestKey)
    if (prior) {
      if (prior.fingerprint !== fingerprint) failed('REQUEST_ID_COLLISION')
      return structuredClone(this.materials.get(prior.candidateId)!.material)
    }
    const documentVersionId = 'docv-' + sha256(JSON.stringify({
      ownerId: ctx.ownerId, caseCandidateId: ctx.caseCandidateId,
      physicalSourceKey: input.physicalSourceKey, rawSha256,
    })).slice(0, 32)
    const candidateId = 'intake-' + randomBytes(16).toString('hex')
    const material: B2MaterialCandidate = {
      candidateId, caseCandidateId: ctx.caseCandidateId,
      materialId: 'mat-' + randomBytes(16).toString('hex'),
      documentVersionId, rawSha256, byteLength: bytes.length,
      fileName: input.fileName, physicalSourceKey: input.physicalSourceKey,
      ownerId: ctx.ownerId, ownerGeneration: ctx.ownerGeneration,
      role: input.role, subjectId: input.subjectId ?? null,
      requestId: input.requestId, status: 'accepted',
    }
    this.materials.set(candidateId, { material, bytes })
    this.requests.set(requestKey, { candidateId, fingerprint })
    return structuredClone(material)
  }
  /** Return authoritative Main-staged identity, never trust caller-provided candidate fields. */
  getCandidate(ctx: B2MainContext, candidateId: string): B2MaterialCandidate {
    this.requireContext(ctx)
    const stored = this.materials.get(candidateId)?.material
    if (!stored || stored.ownerId !== ctx.ownerId ||
        stored.caseCandidateId !== ctx.caseCandidateId ||
        stored.ownerGeneration !== ctx.ownerGeneration) {
      throw new Error('B2_MATERIAL_SCOPE_MISMATCH')
    }
    return structuredClone(stored)
  }
  /**
   * Read-only inventory of ALL currently staged candidates for exactly this
   * Owner generation, Case and sender/frame scope. Route callers cannot hide
   * a second application by supplying a subset of the Renderer manifest.
   * Inventory is candidate-only and never installs a native Case material.
   */
  listScopedCandidateIds(ctx: B2MainContext): string[] {
    this.requireContext(ctx)
    const ids: string[] = []
    for (const record of this.materials.values()) {
      if (record.material.ownerId === ctx.ownerId &&
          record.material.ownerGeneration === ctx.ownerGeneration &&
          record.material.caseCandidateId === ctx.caseCandidateId) ids.push(record.material.candidateId)
    }
    return ids.sort()
  }
  /** Material bytes can only be fetched by same live owner; reading returns a copy. */
  read(ctx: B2MainContext, candidateId: string): Buffer {
    assertReviewPreuploadAllowed('read')
    this.requireContext(ctx)
    const stored = this.materials.get(candidateId)
    if (!stored || stored.material.ownerId !== ctx.ownerId ||
        stored.material.caseCandidateId !== ctx.caseCandidateId ||
        stored.material.ownerGeneration !== ctx.ownerGeneration) throw new Error('B2_MATERIAL_SCOPE_MISMATCH')
    return Buffer.from(stored.bytes)
  }
  /** Staged manifest is not a ReviewBatchAttempt and is not proof of application. */
  previewImportBatch(ctx: B2MainContext, candidateIds: string[]): ImportBatch {
    this.requireContext(ctx)
    if (new Set(candidateIds).size !== candidateIds.length) failed('DUPLICATE_CANDIDATE')
    const records = candidateIds.map((candidateId) => {
      const record = this.materials.get(candidateId)?.material
      if (!record || record.ownerId !== ctx.ownerId ||
          record.ownerGeneration !== ctx.ownerGeneration ||
          record.caseCandidateId !== ctx.caseCandidateId) throw new Error('B2_MATERIAL_SCOPE_MISMATCH')
      return record
    })
    const result: ImportBatch = {
      schemaVersion: REVIEW_C0_SCHEMA_VERSION, kind: 'import',
      importBatchId: 'import-' + randomBytes(16).toString('hex'),
      materialIds: records.map((x) => x.materialId),
      inputManifestHash: sha256(JSON.stringify(records.map((x) => ({
        materialId: x.materialId, source: x.documentVersionId, rawSha256: x.rawSha256,
      })))),
      status: 'staged',
    }
    assertC0ImportBatch(result)
    return result
  }
  // SourceIdentity MUST be minted by a parser-verified block registry, not an arbitrary caller locator.
}
