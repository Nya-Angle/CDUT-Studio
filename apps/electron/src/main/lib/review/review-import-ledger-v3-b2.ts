/**
 * V3 Dev-B: durable per-entry ImportBatch INPUT receipts, not a second CaseStore.
 *
 * The immutable archive bytes/central entries are independently verified by
 * ReviewB2ArchiveVault. An accepted receipt means ONLY "input candidate
 * confirmed for a later trusted ApplyMaterial command"; it does not mark a
 * CurrentCase Material/ReviewRun/Decision as applied.
 *
 * The only source of Main identity and review authorization is the embedding
 * Main process. Never expose these methods as a generic Renderer IPC.
 */
import { createHash, randomBytes } from 'node:crypto'
import {
  closeSync, existsSync, fsyncSync, lstatSync, mkdirSync, openSync,
  readFileSync, readdirSync, renameSync, rmSync, writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import { getConfigDir } from '../config-paths'
import { type B2MainContext, ReviewB2StagingService } from './review-intake-adapter-v3-b2'
import { type B2ArchiveCheckpoint, ReviewB2ArchiveVault } from './review-import-checkpoint-v3-b2'

const hash = (data: string): string => createHash('sha256').update(data).digest('hex')
const archiveIdFormat = /^[a-f0-9]{40}$/
const shaFormat = /^[a-f0-9]{64}$/
const localId = /^[a-zA-Z0-9._:-]{1,128}$/
const fail = (name: string): never => { throw new Error('B2_LEDGER_' + name) }
export type B2InputFileStatus =
  | 'pending' | 'needs-user-confirmation' | 'accepted' | 'skipped' | 'rejected'
export type B2InputRole = 'application' | 'supporting'
export interface B2InputFile {
  index: number
  entryName: string
  rawSha256: string | null
  compressedSha256: string
  status: B2InputFileStatus
  reason: string | null
  role: B2InputRole | null
  subjectId: string | null
  /** Not a CurrentCase material ID. */
  candidateVersionKey: string | null
}
export interface B2InputDecision {
  entryIndex: number
  status: 'accepted' | 'skipped' | 'rejected'
  role?: B2InputRole
  subjectId?: string
  /** Must exactly match actual raw entry bytes, not just document filename. */
  rawSha256?: string
  reason?: string
}
export interface B2InputMutation {
  requestId: string
  payloadHash: string
  revision: number
  receiptHash: string
  previousHash: string
  decidedBy: string
  ownerGeneration: number
  entryIndex: number
  status: B2InputDecision['status']
  /** /2 receipt pins the exact accepted file binding, not only its status. */
  confirmedRole?: B2InputRole | null
  confirmedSubjectId?: string | null
  confirmedRawSha256?: string | null
  /** For a terminal refusal, the exact user reason is part of the receipt. */
  decisionReason?: string | null
}
export interface B2InputBatchLedger {
  schemaVersion: 'review-v3-b2-input-ledger/1' | 'review-v3-b2-input-ledger/2'
  kind: 'import'
  archiveId: string
  archiveSha256: string
  sourceManifestHash: string
  ownerId: string
  caseCandidateId: string
  /** Versioned author input state; never becomes a ReviewBatchAttempt. */
  revision: number
  files: B2InputFile[]
  mutations: B2InputMutation[]
  ledgerHash: string
}
export interface B2InputAuthority {
  principalId: string
  /** Main derives this from the current principal and file/Subject scope. */
  authorize: (
    context: B2MainContext, principalId: string, decision: B2InputDecision,
  ) => boolean
}
const digestLedger = (ledger: Omit<B2InputBatchLedger, 'ledgerHash'>): string =>
  hash(JSON.stringify(ledger))
const keyForSource = (archive: B2ArchiveCheckpoint, index: number, rawSha256: string): string =>
  'candidate-version-' + hash(JSON.stringify([archive.archiveSha256,archive.archiveId,index,rawSha256])).slice(0,40)

export class ReviewB2InputLedger {
  constructor(
    private readonly archiveVault: ReviewB2ArchiveVault,
    private readonly staging: ReviewB2StagingService,
    private readonly baseDirectory = join(getConfigDir(),'review-v3-b2-input-ledgers'),
  ) {}

  private folder(ctx: B2MainContext, archiveId: string): string {
    this.staging.assertStillGranted(ctx)
    if (!archiveIdFormat.test(archiveId)) fail('ARCHIVE_ID_INVALID')
    if (existsSync(this.baseDirectory) && !lstatSync(this.baseDirectory).isDirectory()) fail('ROOT_UNSAFE')
    const dir = join(this.baseDirectory,archiveId)
    if (existsSync(dir) && !lstatSync(dir).isDirectory()) fail('DIR_UNSAFE')
    return dir
  }
  private checkedArchive(ctx: B2MainContext, archiveId: string): B2ArchiveCheckpoint {
    return this.archiveVault.inspect(ctx, archiveId) // validates bytes+archive manifest+owner
  }
  private verify(source:B2ArchiveCheckpoint, record:B2InputBatchLedger, ctx:B2MainContext): void {
    if (!['review-v3-b2-input-ledger/1','review-v3-b2-input-ledger/2'].includes(record.schemaVersion) || record.kind!=='import' ||
        record.archiveId!==source.archiveId || record.archiveSha256!==source.archiveSha256 ||
        record.sourceManifestHash!==source.manifestSha256 ||
        record.ownerId!==ctx.ownerId || record.caseCandidateId!==ctx.caseCandidateId ||
        !Number.isSafeInteger(record.revision) || record.revision < 0 ||
        !Array.isArray(record.files) || !Array.isArray(record.mutations) ||
        record.files.length!==source.fileReceipts.length || record.revision!==record.mutations.length) {
      fail('CORRUPT')
    }
    const originals = new Map(source.fileReceipts.map(file=>[file.index,file]))
    const seen=new Set<number>()
    for(const item of record.files){
      const original=originals.get(item.index)
      if(!original) throw new Error('B2_LEDGER_CORRUPT')
      if(seen.has(item.index) || item.entryName!==original.entryName ||
         item.compressedSha256!==original.compressedSha256 ||
         !['pending','needs-user-confirmation','accepted','skipped','rejected'].includes(item.status) ||
         ![null,'application','supporting'].includes(item.role) ||
         (item.subjectId!==null && !localId.test(item.subjectId)) ||
         (item.candidateVersionKey!==null && !item.candidateVersionKey.startsWith('candidate-version-'))) {
        fail('CORRUPT')
      }
      if (original.status!=='accepted' && (
          item.status!==original.status || item.rawSha256!==null ||
          item.role!==null || item.subjectId!==null || item.candidateVersionKey!==null)) fail('CORRUPT')
      if (original.status==='accepted' && (
        item.rawSha256!==original.rawSha256 ||
        (item.status==='accepted' && (
          !item.role || !item.subjectId ||
          item.candidateVersionKey!==keyForSource(source,item.index,item.rawSha256!))) ||
        (item.status!=='accepted' && (item.role!==null || item.subjectId!==null ||
          item.candidateVersionKey!==null)))) fail('CORRUPT')
      seen.add(item.index)
    }
    let prev='GENESIS'
    const requestIds=new Set<string>()
    const terminalByEntry=new Map<number,B2InputMutation>()
    for(let i=0;i<record.mutations.length;i++){
      const action=record.mutations[i]!
      if(!localId.test(action.requestId) || requestIds.has(action.requestId) ||
         !shaFormat.test(action.payloadHash) || !shaFormat.test(action.receiptHash) ||
         action.revision!==i+1 || action.previousHash!==prev ||
         !localId.test(action.decidedBy) || !Number.isSafeInteger(action.ownerGeneration) ||
         action.ownerGeneration<0 || !seen.has(action.entryIndex) ||
         !['accepted','skipped','rejected'].includes(action.status) ||
         originals.get(action.entryIndex)?.status!=='accepted' ||
         terminalByEntry.has(action.entryIndex)) fail('CORRUPT')
      terminalByEntry.set(action.entryIndex,action)
      // /2 sealed fields make the accepted Subject/role/raw bytes independently
      // replayable. /1 is deliberately read-only: its old checksum did not
      // preserve this original binding in each receipt.
      if(record.schemaVersion==='review-v3-b2-input-ledger/2') {
        if(!('confirmedRole' in action) || !('confirmedSubjectId' in action) ||
           !('confirmedRawSha256' in action) || !('decisionReason' in action)) fail('CORRUPT')
        const item=record.files.find(file=>file.index===action.entryIndex)
        if(action.status==='accepted') {
          if(!item || item.status!=='accepted' ||
             action.confirmedRole!==item.role ||
             action.confirmedSubjectId!==item.subjectId ||
             action.confirmedRawSha256!==item.rawSha256 ||
             !['application','supporting'].includes(action.confirmedRole as string) ||
             !localId.test(action.confirmedSubjectId ?? '') ||
             !shaFormat.test(action.confirmedRawSha256 ?? '') ||
             action.decisionReason!==null) fail('CORRUPT')
        } else if(action.confirmedRole!==null ||
                  action.confirmedSubjectId!==null ||
                  action.confirmedRawSha256!==null ||
                  typeof action.decisionReason!=='string' ||
                  !action.decisionReason.trim() ||
                  item?.reason!==action.decisionReason) fail('CORRUPT')
      }
      // append-only receipt chain; wrong in-place edits cannot pass checksum
      const {receiptHash,...unsigned}=action
      if(hash(JSON.stringify(unsigned))!==receiptHash) fail('CORRUPT')
      requestIds.add(action.requestId)
      prev=receiptHash
    }
    // A digest alone cannot establish that the file snapshot is the replayed
    // outcome of the append-only receipt chain. Check terminal transitions.
    for(const item of record.files) {
      const original=originals.get(item.index)!
      const final=terminalByEntry.get(item.index)
      if(original.status!=='accepted') {
        if(final || item.reason!==(original.reason??null)) fail('CORRUPT')
        continue
      }
      if(!final) {
        if(item.status!=='needs-user-confirmation' ||
           item.reason!==(original.reason??null)) fail('CORRUPT')
      } else if(item.status!==final.status ||
                (final.status==='accepted' &&
                  item.reason!=='input-only, not applied to CurrentCase') ||
                (final.status!=='accepted' && !item.reason?.trim())) {
        fail('CORRUPT')
      }
    }
    const {ledgerHash,...plain}=record
    if(record.ledgerHash!==digestLedger(plain)) fail('CORRUPT')
  }
  private read(ctx:B2MainContext, source:B2ArchiveCheckpoint): B2InputBatchLedger | undefined {
    const dir=this.folder(ctx,source.archiveId)
    // A killed writer can leave a temporary ledger beside the old or new
    // ledger.json. Never infer that the transaction completed just because
    // another process subsequently removed the stale input.lock.
    if(existsSync(dir) && readdirSync(dir).some(name=>
      /^ledger-[a-f0-9]{20}\.tmp$/.test(name))) fail('RECOVERY_REQUIRED')
    const file=join(dir,'ledger.json')
    if(!existsSync(file)) return undefined
    if(!lstatSync(file).isFile() || lstatSync(file).nlink!==1) fail('FILE_UNSAFE')
    let parsed:B2InputBatchLedger
    try { parsed=JSON.parse(readFileSync(file,'utf8')) as B2InputBatchLedger }
    catch { fail('CORRUPT') }
    this.verify(source,parsed!,ctx)
    return parsed!
  }
  private write(ctx:B2MainContext, record:B2InputBatchLedger):void {
    const dir=this.folder(ctx,record.archiveId)
    mkdirSync(dir,{recursive:true,mode:0o700})
    const temp=join(dir,'ledger-'+randomBytes(10).toString('hex')+'.tmp')
    try {
      writeFileSync(temp,JSON.stringify(record,null,2)+'\n',{flag:'wx',mode:0o600})
      const fd=openSync(temp,'r')
      try {fsyncSync(fd)} finally {closeSync(fd)}
      renameSync(temp,join(dir,'ledger.json'))
      const dirfd=openSync(dir,'r')
      try {fsyncSync(dirfd)} finally {closeSync(dirfd)}
    } finally {
      if(existsSync(temp))rmSync(temp,{force:true})
    }
  }
  private initial(source:B2ArchiveCheckpoint,ctx:B2MainContext):B2InputBatchLedger {
    const plain:Omit<B2InputBatchLedger,'ledgerHash'>={
      schemaVersion:'review-v3-b2-input-ledger/2',kind:'import',
      archiveId:source.archiveId,archiveSha256:source.archiveSha256,
      sourceManifestHash:source.manifestSha256,
      ownerId:ctx.ownerId,caseCandidateId:ctx.caseCandidateId,revision:0,
      files:source.fileReceipts.map(item=>({
        index:item.index,entryName:item.entryName,
        rawSha256:item.status==='accepted' ? item.rawSha256??null:null,
        compressedSha256:item.compressedSha256,
        status:item.status==='accepted'?'needs-user-confirmation':item.status,
        reason:item.reason??null,role:null,subjectId:null,candidateVersionKey:null,
      })),
      mutations:[],
    }
    return {...plain,ledgerHash:digestLedger(plain)}
  }
  /**
   * Never mark validated archive receipt as an installed Case material.
   * At first creation, source identity is verified before any disk write.
   */
  getOrCreate(ctx:B2MainContext,archiveId:string):B2InputBatchLedger {
    const source=this.checkedArchive(ctx,archiveId)
    const dir=this.folder(ctx,archiveId)
    mkdirSync(dir,{recursive:true,mode:0o700})
    const lock=join(dir,'input.lock')
    let fd:number
    try {fd=openSync(lock,'wx',0o600)} catch { fail('LOCKED') }
    try {
      const existing=this.read(ctx,source)
      if(existing)return structuredClone(existing)
      const fresh=this.initial(source,ctx)
      this.write(ctx,fresh)
      return structuredClone(fresh)
    } finally {closeSync(fd!);rmSync(lock,{force:true})}
  }
  /**
   * CAS, per-file, retry safe. The same requestId & exact body returns prior
   * receipt even after restart; a changed payload under that ID is rejected.
   * No current business material, case validity or external batch is mutated.
   */
  decide(
    ctx:B2MainContext,archiveId:string,expectedRevision:number,
    requestId:string,decision:B2InputDecision,authority:B2InputAuthority,
  ):{ledger:B2InputBatchLedger;receipt:B2InputMutation} {
    this.staging.assertStillGranted(ctx)
    if(!localId.test(requestId) || !Number.isSafeInteger(expectedRevision) || expectedRevision<0 ||
       !authority?.principalId || !localId.test(authority.principalId) ||
       typeof authority.authorize!=='function' || !Number.isSafeInteger(decision?.entryIndex) ||
       !['accepted','skipped','rejected'].includes(decision.status)) fail('DECISION_INVALID')
    if(decision.status==='accepted' && (!decision.role ||
       !['application','supporting'].includes(decision.role) ||
       !decision.subjectId || !localId.test(decision.subjectId) ||
       !decision.rawSha256 || !shaFormat.test(decision.rawSha256))) fail('CONFIRMATION_INCOMPLETE')
    if(!authority.authorize(ctx,authority.principalId,decision)) fail('AUTH_UNAVAILABLE')
    const source=this.checkedArchive(ctx,archiveId)
    const dir=this.folder(ctx,archiveId)
    const lock=join(dir,'input.lock')
    let fd:number
    try {fd=openSync(lock,'wx',0o600)} catch { fail('LOCKED') }
    try{
      const current=this.read(ctx,source)
      if(!current) throw new Error('B2_LEDGER_NOT_STARTED')
      if(current.schemaVersion!=='review-v3-b2-input-ledger/2')fail('LEGACY_SCHEMA_UNPINNED')
      const payloadHash=hash(JSON.stringify({archiveId,decision,principalId:authority.principalId}))
      const earlier=current!.mutations.find(m=>m.requestId===requestId)
      if(earlier){
        if(earlier.payloadHash!==payloadHash)fail('REQUEST_COLLISION')
        return {ledger:structuredClone(current!),receipt:structuredClone(earlier)}
      }
      if(current!.revision!==expectedRevision)fail('REVISION_CONFLICT')
      const item=current!.files.find(file=>file.index===decision.entryIndex)
      const original=source.fileReceipts.find(file=>file.index===decision.entryIndex)
      if(!item || !original || original.status!=='accepted' ||
         item.status!=='needs-user-confirmation') {
        throw new Error('B2_LEDGER_ENTRY_NOT_CONFIRMABLE')
      }
      if(decision.status==='accepted' && original.rawSha256!==decision.rawSha256)fail('SOURCE_MISMATCH')
      if(decision.status!=='accepted' && (!decision.reason?.trim() ||
         decision.role!==undefined || decision.subjectId!==undefined))fail('REJECTION_REASON_REQUIRED')
      const files=current!.files.map(file=>file.index!==decision.entryIndex?file:{
        ...file,status:decision.status,
        reason:decision.status==='accepted'?'input-only, not applied to CurrentCase':decision.reason!,
        role:decision.status==='accepted'?decision.role!:null,
        subjectId:decision.status==='accepted'?decision.subjectId!:null,
        candidateVersionKey:decision.status==='accepted'?
          keyForSource(source,decision.entryIndex,original.rawSha256!):null,
      })
      const unsigned={
        requestId,payloadHash,revision:current!.revision+1,
        previousHash:current!.mutations.at(-1)?.receiptHash??'GENESIS',
        decidedBy:authority.principalId,ownerGeneration:ctx.ownerGeneration,
        entryIndex:decision.entryIndex,status:decision.status,
        confirmedRole:decision.status==='accepted'?decision.role!:null,
        confirmedSubjectId:decision.status==='accepted'?decision.subjectId!:null,
        confirmedRawSha256:decision.status==='accepted'?decision.rawSha256!:null,
        decisionReason:decision.status==='accepted'?null:decision.reason!,
      }
      const receipt:B2InputMutation={...unsigned,receiptHash:hash(JSON.stringify(unsigned))}
      const {ledgerHash: _unused,...previous}=current!
      const plain:Omit<B2InputBatchLedger,'ledgerHash'>={
        ...previous,revision:current!.revision+1,files,
        mutations:[...current!.mutations,receipt],
      }
      const next:B2InputBatchLedger={...plain,ledgerHash:digestLedger(plain)}
      this.staging.assertStillGranted(ctx)
      this.write(ctx,next)
      return {ledger:structuredClone(next),receipt:structuredClone(receipt)}
    } finally {closeSync(fd!);rmSync(lock,{force:true})}
  }
  /** Snapshot participates in the same cross-PID input.lock as decisions. */
  snapshot(ctx:B2MainContext,archiveId:string):B2InputBatchLedger {
    const dir=this.folder(ctx,archiveId)
    if(!existsSync(dir))fail('NOT_STARTED')
    const lock=join(dir,'input.lock')
    let fd:number
    try {fd=openSync(lock,'wx',0o600)} catch {fail('LOCKED')}
    try {
      const source=this.checkedArchive(ctx,archiveId)
      const record=this.read(ctx,source)
      if(!record)fail('NOT_STARTED')
      this.staging.assertStillGranted(ctx)
      return structuredClone(record!)
    } finally {closeSync(fd!);rmSync(lock,{force:true})}
  }
}
