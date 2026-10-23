/**
 * Dev-B R23: B1 saved/frozen author + MULTIPLE durable ZIP originals + B2 /2
 * input receipt history, read-only recovery preflight. Never restages bytes,
 * replays authority, creates a SourceIdentity or applies a Case/Run/Plan.
 * An accepted HISTORIC receipt is never a current-generation grant.
 *
 * C Main supplies genuine current Principal/Window/frame/Owner and archive
 * registry; this dependency injection is NOT an IPC authentication layer.
 */
import { createHash } from 'node:crypto'
import { readB1AuthorRevision, readB1FrozenCandidate } from './review-template-author-store-v3-b1'
import { verifyReviewB1Descriptor } from './review-template-plan-adapter-v3-b1'
import { ReviewB2StagingService } from './review-intake-adapter-v3-b2'
import { ReviewB2ArchiveVault, type B2ArchiveCheckpoint } from './review-import-checkpoint-v3-b2'
import { ReviewB2InputLedger, type B2InputBatchLedger } from './review-import-ledger-v3-b2'
import {
  type B20MainReadScope, type B20ReadAuthorExpectation,
} from './review-v3-b1-b2-main-read-bundle-v3-b'

const sha=/^[a-f0-9]{64}$/
const archiveId=/^[a-f0-9]{40}$/
const error=(code:string):never=>{throw new Error('B_R23_'+code)}
const digest=(value:unknown):string=>createHash('sha256').update(JSON.stringify(value)).digest('hex')
const sameScope=(a:B20MainReadScope,b:B20MainReadScope):boolean=>
  a.principalId===b.principalId&&a.sessionId===b.sessionId &&
  a.authorityEpoch===b.authorityEpoch &&
  a.senderId===b.senderId&&a.frameId===b.frameId &&
  a.ownerId===b.ownerId&&a.ownerGeneration===b.ownerGeneration&&
  a.caseCandidateId===b.caseCandidateId
export interface B23MainRecoveryAuthority {
  currentScope():B20MainReadScope | null
  /** C Main authenticates its registry; NEVER accept Renderer archive IDs. */
  currentArchiveIds(scope:Readonly<B20MainReadScope>,template:Readonly<B20ReadAuthorExpectation>):readonly string[] | null
}
export interface B23RecoveryDependencies {
  authority?:B23MainRecoveryAuthority
  staging?:ReviewB2StagingService
  vault?:ReviewB2ArchiveVault
  ledger?:ReviewB2InputLedger
}
export type B23HistoricalEntryState =
  'historic-accepted-needs-new-source-confirmation' |
  'previously-skipped'|'previously-rejected'|'not-yet-confirmed'
export interface B23RecoveryEntry {
  entryIndex:number
  entryName:string
  originalStatus:'accepted'|'skipped'|'rejected'
  historicInputState:B23HistoricalEntryState
  /** Original identity only. Never a new verified parser SourceIdentity. */
  rawSha256:string|null
  historicalRole:'application'|'supporting'|null
  historicalSubjectId:string|null
  historicalReceiptHash:string|null
  historicalReceiptOwnerGeneration:number|null
  currentSourceIdentityVerified:false
  sourceReuseAllowed:false
}
export interface B23RecoveryArchive {
  archiveId:string
  originalArchiveSha256:string
  checkpointManifestSha256:string
  historicalLedgerHash:string
  historicalLedgerRevision:number
  stagedOwnerGeneration:number
  /** Recovery must be performed with a FRESH Main-issued Owner generation. */
  freshOwnerGenerationRequired:boolean
  requiresTrustedNativeRepick:true
  requiresCurrentParserAndSourceReceipt:true
  entries:B23RecoveryEntry[]
}
export interface B23RecoveryPreflight {
  schemaVersion:'review-v3-b23-recovery-preflight/1'
  candidateOnly:true
  publicationAllowed:false
  businessWriteAllowed:false
  schoolPolicyVerified:false
  currentSourceIdentityVerified:false
  authorityInstalledByB:false
  caseCandidateId:string
  ownerId:string
  ownerGeneration:number
  templateId:string
  currentAuthorRevision:number
  currentAuthorDigest:string
  frozenFingerprint:string
  frozenAuthorDigest:string
  state:'no-registered-archives'|'recovery-and-human-confirmation-required'
  archives:B23RecoveryArchive[]
  snapshotHash:string
}
function scopeFromMain(authority:B23MainRecoveryAuthority):B20MainReadScope {
  const raw=authority.currentScope()
  if(!raw || !raw.principalId?.trim() || !raw.sessionId?.trim() ||
      !raw.ownerId?.trim() || !raw.caseCandidateId?.trim() ||
      !Number.isSafeInteger(raw.authorityEpoch) || raw.authorityEpoch<0 ||
      !Number.isSafeInteger(raw.ownerGeneration) || raw.ownerGeneration<0 ||
      !Number.isSafeInteger(raw.senderId) || raw.senderId<0 ||
      !Number.isSafeInteger(raw.frameId) || raw.frameId<0) {
    throw new Error('B_R23_MAIN_TRUST_DEPENDENCY_NOT_INSTALLED')
  }
  return structuredClone(raw)
}
function verifyArchiveAndLedger(
  checkpoint:B2ArchiveCheckpoint, record:B2InputBatchLedger, ctx:B20MainReadScope,
):B23RecoveryArchive {
  if(checkpoint.schemaVersion!=='review-b2-archive/2'||!checkpoint.decodeLimits)
    error('UNPINNED_ARCHIVE_DECODE_PROFILE')
  if(record.schemaVersion!=='review-v3-b2-input-ledger/2')
    error('HISTORIC_LEDGER_SUBJECT_ROLE_UNVERIFIABLE')
  if(checkpoint.archiveId!==record.archiveId ||
     checkpoint.archiveSha256!==record.archiveSha256 ||
     checkpoint.manifestSha256!==record.sourceManifestHash ||
     checkpoint.ownerId!==ctx.ownerId || checkpoint.caseCandidateId!==ctx.caseCandidateId ||
     record.ownerId!==ctx.ownerId || record.caseCandidateId!==ctx.caseCandidateId)
    error('ARCHIVE_LEDGER_SCOPE_MISMATCH')
  const receiptByEntry=new Map(record.mutations.map(m=>[m.entryIndex,m]))
  const entries:B23RecoveryEntry[]=checkpoint.fileReceipts.map(original=>{
    const file=record.files.find(f=>f.index===original.index)
    if(!file)throw new Error('B_R23_ORIGINAL_ENTRY_IDENTITY_MISMATCH')
    if(file.entryName!==original.entryName ||
       file.compressedSha256!==original.compressedSha256 ||
       (original.status==='accepted' && file.rawSha256!==original.rawSha256))
      throw new Error('B_R23_ORIGINAL_ENTRY_IDENTITY_MISMATCH')
    const historicalReceipt=receiptByEntry.get(original.index)??null
    const accepted=file.status==='accepted'
    if(accepted && (!historicalReceipt||historicalReceipt.status!=='accepted' ||
       historicalReceipt.confirmedRawSha256!==original.rawSha256 ||
       historicalReceipt.confirmedRole!==file.role ||
       historicalReceipt.confirmedSubjectId!==file.subjectId))
      error('HISTORIC_RECEIPT_BINDING_MISMATCH')
    const historicInputState:B23HistoricalEntryState=
      file.status==='accepted'?'historic-accepted-needs-new-source-confirmation'
        : file.status==='skipped'?'previously-skipped'
        : file.status==='rejected'?'previously-rejected':'not-yet-confirmed'
    return {
      entryIndex:original.index,entryName:original.entryName,
      originalStatus:original.status, historicInputState,
      rawSha256:original.status==='accepted'?original.rawSha256??null:null,
      historicalRole:accepted?file.role:null,
      historicalSubjectId:accepted?file.subjectId:null,
      historicalReceiptHash:accepted?historicalReceipt!.receiptHash:null,
      historicalReceiptOwnerGeneration:accepted?historicalReceipt!.ownerGeneration:null,
      currentSourceIdentityVerified:false,sourceReuseAllowed:false,
    }
  })
  return {
    archiveId:checkpoint.archiveId,originalArchiveSha256:checkpoint.archiveSha256,
    checkpointManifestSha256:checkpoint.manifestSha256,
    historicalLedgerHash:record.ledgerHash,historicalLedgerRevision:record.revision,
    stagedOwnerGeneration:checkpoint.stagedOwnerGeneration,
    freshOwnerGenerationRequired:ctx.ownerGeneration<=checkpoint.stagedOwnerGeneration,
    requiresTrustedNativeRepick:true,requiresCurrentParserAndSourceReceipt:true,entries,
  }
}
/**
 * Synchronous fail-closed candidate-only manifest. Validates all registered
 * ZIPs and full B1 chain twice; no partial output if ANY original or ledger
 * failed. A second read of every input ledger prevents presenting a snapshot
 * where some earlier file was confirmed/rejected halfway through this read.
 */
export function readB23RecoveryPreflight(
  expected:B20ReadAuthorExpectation,
  deps:B23RecoveryDependencies,
):B23RecoveryPreflight {
  const authority=deps?.authority,vault=deps?.vault,ledger=deps?.ledger,staging=deps?.staging
  if(!authority||typeof authority.currentScope!=='function'||
     typeof authority.currentArchiveIds!=='function'||!vault||!ledger||!staging)
    throw new Error('B_R23_MAIN_TRUST_DEPENDENCY_NOT_INSTALLED')
  if(!expected||!expected.templateId?.trim()||
     !Number.isSafeInteger(expected.revision)||expected.revision<1||
     !sha.test(expected.revisionDigest)||!sha.test(expected.frozenFingerprint))
    error('AUTHOR_EXPECTATION_INVALID')
  const ctx=scopeFromMain(authority)
  staging.assertStillGranted(ctx)
  const author=readB1AuthorRevision(expected.templateId)
  if(!author)throw new Error('B_R23_AUTHOR_REVISION_CONFLICT')
  if(author.revision!==expected.revision||
     author.digest!==expected.revisionDigest||author.document.templateId!==expected.templateId)
    throw new Error('B_R23_AUTHOR_REVISION_CONFLICT')
  const frozen=readB1FrozenCandidate(expected.templateId,expected.frozenFingerprint)
  if(!frozen)throw new Error('B_R23_FROZEN_CANDIDATE_CONFLICT')
  if(frozen.revision!==author.revision ||
      frozen.status!=='candidate-held' ||
      frozen.authorDigest!==frozen.descriptor.authorDigest ||
      frozen.descriptor.canonicalPlan.fingerprint!==expected.frozenFingerprint ||
      frozen.descriptor.publicationAllowed!==false)
    error('FROZEN_CANDIDATE_CONFLICT')
  verifyReviewB1Descriptor(author.document,frozen.descriptor)
  const registered=authority.currentArchiveIds(ctx,expected)
  if(registered === null || !Array.isArray(registered))throw new Error('B_R23_ARCHIVE_REGISTRY_NOT_INSTALLED')
  if(registered.length>32||registered.length!==new Set(registered).size||
     registered.some(x=>typeof x!=='string'||!archiveId.test(x)))
    error('ARCHIVE_REGISTRY_INVALID')
  const ids=[...registered].sort()
  const archives:B23RecoveryArchive[]=ids.map(id=>{
    // Both methods independently re-open archived ORIGINAL ZIP bytes and /2
    // ledger under active B2 Owner guard; never trust a UI checksum.
    const original=vault.inspect(ctx,id)
    const history=ledger.snapshot(ctx,id)
    return verifyArchiveAndLedger(original,history,ctx)
  })
  for(const item of archives){
    const original=vault.inspect(ctx,item.archiveId)
    const history=ledger.snapshot(ctx,item.archiveId)
    if(original.archiveSha256!==item.originalArchiveSha256||
       original.manifestSha256!==item.checkpointManifestSha256 ||
       original.stagedOwnerGeneration!==item.stagedOwnerGeneration||
       history.ledgerHash!==item.historicalLedgerHash||
       history.revision!==item.historicalLedgerRevision)
      error('SOURCE_CHANGED_DURING_PREFLIGHT')
  }
  const latest=readB1AuthorRevision(expected.templateId)
  const latestFrozen=readB1FrozenCandidate(expected.templateId,expected.frozenFingerprint)
  if(!latest||latest.revision!==author.revision||latest.digest!==author.digest||
     !latestFrozen||latestFrozen.revision!==frozen.revision||
     latestFrozen.authorDigest!==frozen.authorDigest ||
     latestFrozen.descriptor.canonicalPlan.fingerprint!==expected.frozenFingerprint)
    error('AUTHOR_CHANGED_DURING_PREFLIGHT')
  const finalScope=scopeFromMain(authority)
  if(!sameScope(ctx,finalScope))error('MAIN_SCOPE_CHANGED_DURING_PREFLIGHT')
  staging.assertStillGranted(finalScope)
  const again=authority.currentArchiveIds(finalScope,expected)
  if(!Array.isArray(again)||again.length!==ids.length||
     [...again].sort().some((id,i)=>id!==ids[i]))
    error('ARCHIVE_REGISTRY_CHANGED_DURING_PREFLIGHT')
  const unsigned:Omit<B23RecoveryPreflight,'snapshotHash'>={
    schemaVersion:'review-v3-b23-recovery-preflight/1',
    candidateOnly:true,publicationAllowed:false,businessWriteAllowed:false,
    schoolPolicyVerified:false,currentSourceIdentityVerified:false,
    authorityInstalledByB:false,
    caseCandidateId:ctx.caseCandidateId,ownerId:ctx.ownerId,
    ownerGeneration:ctx.ownerGeneration,templateId:expected.templateId,
    currentAuthorRevision:author.revision,currentAuthorDigest:author.digest,
    frozenFingerprint:expected.frozenFingerprint,frozenAuthorDigest:frozen.authorDigest,
    state:archives.length?'recovery-and-human-confirmation-required':'no-registered-archives',
    archives,
  }
  // Unkeyed digest for diff/audit convenience only; NOT a Main trusted receipt.
  return structuredClone({...unsigned,snapshotHash:digest(unsigned)})
}
