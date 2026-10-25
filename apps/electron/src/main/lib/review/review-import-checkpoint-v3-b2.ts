/**
 * B2 durable ORIGINAL ZIP checkpoint, separate from CurrentCase, Run and Batch.
 * A persisted archive is NEVER a trusted installed MaterialVersion: after restart
 * a newly authenticated Main owner must re-stage with a new token/generation.
 *
 * Contract to Dev-C: caller must supply an authenticated B2MainContext and
 * trusted Native-picker physicalArchiveKey. This vault has no public IPC.
 */
import { createHash, randomBytes } from 'node:crypto'
import {
  closeSync, existsSync, fsyncSync, lstatSync, mkdirSync, openSync, readFileSync,
  readdirSync, renameSync, rmSync, statSync, writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import { getConfigDir } from '../config-paths'
import { type B2MainContext, ReviewB2StagingService } from './review-intake-adapter-v3-b2'
import { stageReviewB2TrustedZip, type B2TrustedZipInput, type B2ZipImportPreview } from './review-zip-staging-v3-b2'
import { decodeReviewB2Zip, type B2ZipLimits, type B2ZipFileReceipt } from './review-zip-intake-v3-b2'
import { assertReviewPreuploadAllowed } from './review-preupload-gate'

const sha256 = (bytes: Uint8Array | string): string => createHash('sha256').update(bytes).digest('hex')
const code = (s: string): never => { throw new Error('B2_ARCHIVE_' + s) }
const idPattern = /^[A-Za-z0-9._:-]{1,128}$/
const MAX_ARCHIVE_STORAGE_BYTES = 1024 * 1024 * 1024
/** Canonical effective ZIP policy; object property order/default spellings cannot bypass retry identity. */
const decodeProfile = (limits: B2ZipLimits = {}): string => JSON.stringify([
  limits.maxArchiveBytes ?? 256 * 1024 * 1024,
  limits.maxEntryBytes ?? 50 * 1024 * 1024,
  limits.maxTotalBytes ?? 200 * 1024 * 1024,
  limits.maxEntries ?? 1000,
  limits.maxCompressionRatio ?? 100,
])
export interface B2ArchiveCheckpoint {
  schemaVersion: 'review-b2-archive/1' | 'review-b2-archive/2'
  archiveId: string
  caseCandidateId: string
  ownerId: string
  /** Original generation for audit, NOT reusable as a token after restart. */
  stagedOwnerGeneration: number
  requestId: string
  physicalArchiveKeyDigest: string
  archiveSha256: string
  byteLength: number
  fileReceipts: B2ZipFileReceipt[]
  /** /2 stores exact bounded decompression policy for replay; legacy /1 has no policy lock. */
  decodeLimits?: B2ZipLimits
  checkpointState: 'bytes-durable-needs-confirmation'
  manifestSha256: string
}
export interface B2RestageIntent {
  checkpoint: B2ArchiveCheckpoint
  /** New Main authentication MUST reissue tokens; no stale candidate IDs. */
  /** Recovered bytes without a Main-issued physicalSourceKey; caller must reauthorize. */
  restage: Pick<B2TrustedZipInput, 'requestId' | 'bytes'>
  status: 'needs-main-revalidation'
}
const sealedDigest = (record: Omit<B2ArchiveCheckpoint, 'manifestSha256'>): string =>
  sha256(JSON.stringify(record))
export class ReviewB2ArchiveVault {
  constructor(private readonly staging: ReviewB2StagingService,
    private readonly baseDirectory = join(getConfigDir(), 'review-v3-b2-intake-archives')) {}
  private id(ctx: B2MainContext, input: Pick<B2TrustedZipInput, 'requestId' | 'physicalArchiveKey'>): string {
    if (!idPattern.test(input.requestId) || !input.physicalArchiveKey?.trim() ||
        input.physicalArchiveKey.length > 256) code('IDENTITY_INVALID')
    return sha256(JSON.stringify([ctx.ownerId,ctx.caseCandidateId,input.requestId,input.physicalArchiveKey])).slice(0,40)
  }
  private directory(archiveId: string): string {
    if (!/^[a-f0-9]{40}$/.test(archiveId)) code('ID_INVALID')
    return join(this.baseDirectory,archiveId)
  }
  private safeArchiveDirectory(archiveId: string): string {
    const dir = this.directory(archiveId)
    if (existsSync(this.baseDirectory) && !lstatSync(this.baseDirectory).isDirectory()) {
      code('UNSAFE_ROOT')
    }
    if (existsSync(dir) && !lstatSync(dir).isDirectory()) code('UNSAFE_ARCHIVE_DIRECTORY')
    return dir
  }
  private assertRegularFile(path: string): void {
    const stat=lstatSync(path)
    if (!stat.isFile() || stat.nlink !== 1) code('UNSAFE_ARCHIVE_FILE')
  }
  private usedBytes(): number {
    if (!existsSync(this.baseDirectory)) return 0
    if (!lstatSync(this.baseDirectory).isDirectory()) code('UNSAFE_ROOT')
    let count=0
    for (const record of readdirSync(this.baseDirectory,{withFileTypes:true})) {
      if (!/^[a-f0-9]{40}$/.test(record.name) || !record.isDirectory()) continue
      const archive=join(this.baseDirectory,record.name,'archive.zip')
      if (!existsSync(archive)) continue
      this.assertRegularFile(archive)
      count+=statSync(archive).size
      if (count>MAX_ARCHIVE_STORAGE_BYTES) code('CAPACITY_EXCEEDED')
    }
    return count
  }
  /**
   * Cross-PID global quota serialization. Exclusive create is atomic on the
   * local filesystem; an orphaned lock is a fail-closed recovery condition,
   * never deleted automatically. In-flight staging stays non-authoritative.
   */
  private withCapacityLock<T>(ctx:B2MainContext, work:()=>T):T {
    this.staging.assertStillGranted(ctx)
    if (existsSync(this.baseDirectory) && !lstatSync(this.baseDirectory).isDirectory()) {
      code('UNSAFE_ROOT')
    }
    mkdirSync(this.baseDirectory,{recursive:true,mode:0o700})
    if (!lstatSync(this.baseDirectory).isDirectory()) code('UNSAFE_ROOT')
    const lock=join(this.baseDirectory,'capacity.lock')
    let fd:number
    try { fd=openSync(lock,'wx',0o600) }
    catch (error) {
      if((error as NodeJS.ErrnoException).code==='EEXIST') code('CAPACITY_LOCKED')
      code('CAPACITY_LOCK_UNAVAILABLE')
    }
    try {
      this.staging.assertStillGranted(ctx)
      return work()
    } finally {
      closeSync(fd!)
      rmSync(lock,{force:true})
    }
  }
  private ensureOwner(ctx:B2MainContext, checkpoint:B2ArchiveCheckpoint):void {
    this.staging.assertStillGranted(ctx)
    if (checkpoint.ownerId!==ctx.ownerId || checkpoint.caseCandidateId!==ctx.caseCandidateId) {
      code('OWNER_SCOPE_MISMATCH')
    }
  }
  private readVerified(ctx: B2MainContext, archiveId: string): {checkpoint:B2ArchiveCheckpoint; bytes:Buffer} {
    assertReviewPreuploadAllowed('restore')
    this.staging.assertStillGranted(ctx)
    const dir=this.safeArchiveDirectory(archiveId)
    let checkpoint:B2ArchiveCheckpoint, bytes:Buffer
    try {
      this.assertRegularFile(join(dir,'checkpoint.json'))
      this.assertRegularFile(join(dir,'archive.zip'))
      checkpoint=JSON.parse(readFileSync(join(dir,'checkpoint.json'),'utf8')) as B2ArchiveCheckpoint
      bytes=readFileSync(join(dir,'archive.zip'))
    } catch { code('RECOVERY_REQUIRED') }
    this.ensureOwner(ctx, checkpoint!)
    const {manifestSha256,...plain}=checkpoint!
    if (!['review-b2-archive/1','review-b2-archive/2'].includes(checkpoint!.schemaVersion) ||
        (checkpoint!.schemaVersion==='review-b2-archive/2' &&
          (!checkpoint!.decodeLimits || typeof checkpoint!.decodeLimits!=='object' ||
           Array.isArray(checkpoint!.decodeLimits))) ||
        (checkpoint!.schemaVersion==='review-b2-archive/1' &&
          checkpoint!.decodeLimits!==undefined) ||
        checkpoint!.archiveId!==archiveId ||
        checkpoint!.checkpointState!=='bytes-durable-needs-confirmation' ||
        checkpoint!.byteLength!==bytes!.length ||
        sha256(bytes!)!==checkpoint!.archiveSha256 ||
        sealedDigest(plain)!==manifestSha256 ||
        !Number.isSafeInteger(checkpoint!.stagedOwnerGeneration) ||
        checkpoint!.stagedOwnerGeneration < 0 ||
        !/^[a-f0-9]{64}$/.test(checkpoint!.physicalArchiveKeyDigest) ||
        !idPattern.test(checkpoint!.requestId) ||
        !Array.isArray(checkpoint!.fileReceipts)) code('CHECKPOINT_INTEGRITY')

    // This checks real child bytes/CRC/headers, not only an unkeyed manifest hash.
    // The source may originally have been decoded with stricter BOMB limits:
    // keep that earlier rejection, never retroactively promote it to accepted.
    let real: ReturnType<typeof decodeReviewB2Zip>
    try {
      real=decodeReviewB2Zip(bytes!,
        checkpoint!.schemaVersion==='review-b2-archive/2' ? checkpoint!.decodeLimits : undefined)
    }
    catch { code('CHECKPOINT_INTEGRITY') }
    if (real!.receipts.length!==checkpoint!.fileReceipts.length ||
        real!.archiveSha256!==checkpoint!.archiveSha256) code('CHECKPOINT_INTEGRITY')
    for(let i=0;i<real!.receipts.length;i++){
      const actual=real!.receipts[i]!
      const claimed=checkpoint!.fileReceipts[i]!
      if(!claimed || claimed.index!==actual.index ||
         claimed.entryName!==actual.entryName ||
         claimed.compressedSha256!==actual.compressedSha256) code('CHECKPOINT_INTEGRITY')
      const stricterSizeReject=claimed.status==='rejected' &&
        claimed.reason==='BOMB_OR_SIZE_LIMIT' && actual.status==='accepted'
      if (stricterSizeReject && checkpoint!.schemaVersion==='review-b2-archive/1') {
        // Older /1 did not store its original limit profile. Preserve a prior
        // conservative rejection but never infer that bytes were accepted.
        if(claimed.rawSha256!==undefined) code('CHECKPOINT_INTEGRITY')
      } else if(claimed.status!==actual.status ||
        (claimed.rawSha256??null)!==(actual.rawSha256??null) ||
        (claimed.reason??null)!==(actual.reason??null)) code('CHECKPOINT_INTEGRITY')
    }
    return {checkpoint:structuredClone(checkpoint!),bytes:Buffer.from(bytes!)}
  }
  /**
   * Central ZIP verification is done BEFORE writing. Store original bytes + hash
   * in isolated directory. Manifest commit happens last after fsynced archive;
   * a partial disk commit is RECOVERY_REQUIRED (never silently accepted).
   */
  saveAndStage(ctx:B2MainContext, input:B2TrustedZipInput, limits?:B2ZipLimits):
    { checkpoint:B2ArchiveCheckpoint; preview:B2ZipImportPreview } {
    assertReviewPreuploadAllowed('persist')
    assertReviewPreuploadAllowed('zip')
    this.staging.assertStillGranted(ctx)
    // Hold one root lease from quota check through committed checkpoint rename:
    // independent ZIP archives cannot both observe the same remaining budget.
    return this.withCapacityLock(ctx,()=>{
    const archiveId=this.id(ctx,input)
    const archiveHash=sha256(input.bytes)
    const dir=this.safeArchiveDirectory(archiveId)
    let checkpoint:B2ArchiveCheckpoint
    if (existsSync(join(dir,'checkpoint.json'))) {
      const old=this.readVerified(ctx,archiveId)
      if (old.checkpoint.archiveSha256!==archiveHash) code('REQUEST_ID_COLLISION')
      if(old.checkpoint.schemaVersion!=='review-b2-archive/2' ||
         !old.checkpoint.decodeLimits) code('LEGACY_PROFILE_UNPINNED')
      if(decodeProfile(old.checkpoint.decodeLimits)!==decodeProfile(limits))
        code('DECODE_PROFILE_CONFLICT')
      checkpoint=old.checkpoint
    } else {
      const decoded=decodeReviewB2Zip(input.bytes,limits)
      if (this.usedBytes()+input.bytes.byteLength>MAX_ARCHIVE_STORAGE_BYTES) code('CAPACITY_EXCEEDED')
      mkdirSync(dir,{recursive:true,mode:0o700})
      this.safeArchiveDirectory(archiveId)
      const lock=join(dir,'write.lock')
      let fd:number
      try { fd=openSync(lock,'wx',0o600) } catch { code('CHECKPOINT_LOCKED') }
      try {
        if (existsSync(join(dir,'archive.zip')) || existsSync(join(dir,'checkpoint.json'))) code('RECOVERY_REQUIRED')
        const plain:Omit<B2ArchiveCheckpoint,'manifestSha256'>={
          schemaVersion:'review-b2-archive/2',archiveId,
          caseCandidateId:ctx.caseCandidateId,ownerId:ctx.ownerId,
          stagedOwnerGeneration:ctx.ownerGeneration,
          requestId:input.requestId,physicalArchiveKeyDigest:sha256(input.physicalArchiveKey),
          archiveSha256:decoded.archiveSha256,byteLength:input.bytes.byteLength,
          fileReceipts:decoded.receipts,decodeLimits:structuredClone(limits??{}),
          checkpointState:'bytes-durable-needs-confirmation',
        }
        checkpoint={...plain,manifestSha256:sealedDigest(plain)}
        const zipTmp=join(dir,'archive-'+randomBytes(8).toString('hex')+'.tmp')
        const manifestTmp=join(dir,'checkpoint-'+randomBytes(8).toString('hex')+'.tmp')
        try {
          writeFileSync(zipTmp,input.bytes,{flag:'wx',mode:0o600})
          const archiveFd=openSync(zipTmp,'r')
          try {fsyncSync(archiveFd)} finally {closeSync(archiveFd)}
          renameSync(zipTmp,join(dir,'archive.zip'))
          writeFileSync(manifestTmp,JSON.stringify(checkpoint,null,2)+'\n',{flag:'wx',mode:0o600})
          const metaFd=openSync(manifestTmp,'r')
          try {fsyncSync(metaFd)} finally {closeSync(metaFd)}
          renameSync(manifestTmp,join(dir,'checkpoint.json'))
        } finally {
          if (existsSync(zipTmp)) rmSync(zipTmp,{force:true})
          if (existsSync(manifestTmp)) rmSync(manifestTmp,{force:true})
        }
      } finally {
        closeSync(fd!)
        rmSync(lock,{force:true})
      }
    }
    this.staging.assertStillGranted(ctx)
    return {checkpoint:structuredClone(checkpoint!),preview:stageReviewB2TrustedZip(ctx,this.staging,input,limits)}
    })
  }
  /** New live owner is required on recovery; returns only restaging bytes, never old grants. */
  prepareRestage(ctx:B2MainContext,archiveId:string):B2RestageIntent {
    const {checkpoint,bytes}=this.readVerified(ctx,archiveId)
    if (!Number.isSafeInteger(ctx.ownerGeneration) || ctx.ownerGeneration<checkpoint.stagedOwnerGeneration) {
      code('OWNER_GENERATION_STALE')
    }
    return {
      checkpoint,
      restage: {
        requestId:checkpoint.requestId,
        bytes,
      },
      status:'needs-main-revalidation',
    }
  }
  /**
   * Restart recovery handshake. Only a newly authenticated Main owner may
   * supply independently re-picked ORIGINAL archive bytes + physical key.
   * Merely holding the recovered checkpoint bytes is NOT reauthorization.
   * The ZIP decode policy and historic per-entry receipts are locked, and
   * newly minted candidate IDs are NEVER old MaterialVersion / business ACK.
   */
  recoverAfterMainPicker(
    ctx:B2MainContext,archiveId:string,reselected:B2TrustedZipInput,
  ): {checkpoint:B2ArchiveCheckpoint; preview:B2ZipImportPreview;
      status:'candidate-restaged-awaiting-owner-assignment';
      businessWriteAllowed:false; priorReceiptsPreserved:true} {
    this.staging.assertStillGranted(ctx)
    const {checkpoint,bytes}=this.readVerified(ctx,archiveId)
    if(ctx.ownerGeneration<=checkpoint.stagedOwnerGeneration)
      code('REVALIDATION_REQUIRES_FRESH_OWNER_GENERATION')
    if(checkpoint.schemaVersion!=='review-b2-archive/2'||!checkpoint.decodeLimits)
      code('LEGACY_PROFILE_UNPINNED')
    if(!reselected || typeof reselected.requestId!=='string' ||
       reselected.requestId!==checkpoint.requestId ||
       typeof reselected.physicalArchiveKey!=='string' ||
       !reselected.physicalArchiveKey.trim() ||
       reselected.physicalArchiveKey.length>256 ||
       !(reselected.bytes instanceof Uint8Array) ||
       reselected.bytes.byteLength!==checkpoint.byteLength ||
       sha256(reselected.bytes)!==checkpoint.archiveSha256 ||
       !Buffer.from(reselected.bytes).equals(bytes))
      code('RESELECTED_ORIGINAL_MISMATCH')
    // Re-decoding under the historical profile cannot change the prior
    // accepted/rejected entries, even if the environment's default differs.
    const profile=structuredClone(checkpoint.decodeLimits)
    const decoded=decodeReviewB2Zip(reselected.bytes,profile)
    if(decoded.receipts.length!==checkpoint.fileReceipts.length ||
       decoded.receipts.some((item,i)=>{
         const old=checkpoint.fileReceipts[i]
         return !old || old.index!==item.index || old.entryName!==item.entryName ||
           old.status!==item.status || (old.reason??null)!==(item.reason??null) ||
           (old.rawSha256??null)!==(item.rawSha256??null) ||
           old.compressedSha256!==item.compressedSha256
       }))code('RECOVERY_RECEIPT_DRIFT')
    this.staging.assertStillGranted(ctx)
    const preview=stageReviewB2TrustedZip(ctx,this.staging,reselected,profile)
    this.staging.assertStillGranted(ctx)
    return {
      checkpoint:structuredClone(checkpoint),preview,
      status:'candidate-restaged-awaiting-owner-assignment',
      businessWriteAllowed:false,priorReceiptsPreserved:true,
    }
  }
  /** Read-only integrity probe for UI checkpoint listing (never formal Material status). */
  inspect(ctx:B2MainContext,archiveId:string):B2ArchiveCheckpoint {
    return this.readVerified(ctx,archiveId).checkpoint
  }
}
