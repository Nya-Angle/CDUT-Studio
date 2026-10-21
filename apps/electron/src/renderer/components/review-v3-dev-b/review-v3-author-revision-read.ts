/**
 * Dev-B consumer for a future C-owned, Main-authorized author revision reader.
 * No Main authority is derived here. This component validates an untrusted
 * transport shape only; the C Main read port must authenticate session/frame/
 * Owner, verify the actual on-disk full revision chain and return a fresh copy.
 */
import type { B1AuthorDocument } from '../../../main/lib/review/review-template-plan-adapter-v3-b1'
import { diffB1AuthorDocuments, type B1AuthorDiff } from './review-v3-author-diff'

export interface B1CandidateReadResponse {
  schemaVersion:'review-b1-author-read/1'
  templateId:string
  revision:number
  digest:string
  document:B1AuthorDocument
  candidateStatus:'candidate-held'
}
export interface B1CandidateReadPreview {
  remote:B1CandidateReadResponse
  currentRevision:number
  originalEpoch:number
  comparedWithCurrent:B1AuthorDiff
  /** No auto merge or writer-side permission implied. */
  publicationAllowed:false
  mayAutoSave:false
}
const deny=(reason:string):never=>{throw new Error('B1_AUTHOR_READ_'+reason)}
/**
 * An expected result of a C-owned trusted read must never be presented as
 * authoritative publication, and a same-revision contradictory document
 * must never be accepted as a valid newer revision.
 */
export function prepareB1CandidateReadPreview(
  response:unknown,
  local:{templateId:string;revision:number;epoch:number;draft:B1AuthorDocument;saved:B1AuthorDocument|null},
):B1CandidateReadPreview{
  if(!local||!/^[A-Za-z][A-Za-z0-9._-]{0,79}$/.test(local.templateId) ||
     !Number.isSafeInteger(local.revision)||local.revision<0||
     !Number.isSafeInteger(local.epoch)||local.epoch<0||
     !local.draft||local.draft.templateId!==local.templateId)
    deny('LOCAL_STATE_INVALID')
  if(!response || typeof response!=='object'||Array.isArray(response))
    deny('RESPONSE_INVALID')
  const data=response as Record<string,unknown>
  const revisionValue=data.revision
  const digestValue=data.digest
  if(data.schemaVersion!=='review-b1-author-read/1' ||
     data.templateId!==local.templateId ||
     data.candidateStatus!=='candidate-held' ||
     typeof digestValue!=='string'||!/^[a-f0-9]{64}$/.test(digestValue) ||
     typeof revisionValue!=='number'||!Number.isSafeInteger(revisionValue)||
     revisionValue<1)
    throw new Error('B1_AUTHOR_READ_RESPONSE_INVALID')
  if(revisionValue<local.revision)deny('OLDER_REVISION')
  const doc=data.document
  if(!doc||typeof doc!=='object'||Array.isArray(doc))deny('DOCUMENT_INVALID')
  const copy=structuredClone(doc) as B1AuthorDocument
  if(copy.schemaVersion!=='review-b1/1'||copy.status!=='candidate-held'||
     copy.templateId!==local.templateId||!Array.isArray(copy.sources)||
     !Array.isArray(copy.fields)||!Array.isArray(copy.targets)||
     !Array.isArray(copy.modules)||!Array.isArray(copy.stages)||
     !Array.isArray(copy.outputs))
    deny('DOCUMENT_INVALID')
  if(revisionValue===local.revision){
    if(!local.saved||JSON.stringify(local.saved)!==JSON.stringify(copy))
      deny('SAME_REVISION_DIVERGED')
    // Reading the current revision is still safe as a no-op compare, but
    // the UI must not present it as a newer document or apply it.
  }
  return {
    remote:{schemaVersion:'review-b1-author-read/1',
      templateId:local.templateId,revision:revisionValue,digest:digestValue,
      document:copy,candidateStatus:'candidate-held'},
    currentRevision:local.revision,originalEpoch:local.epoch,
    comparedWithCurrent:diffB1AuthorDocuments(local.draft,copy),
    publicationAllowed:false,mayAutoSave:false,
  }
}
export function assertB1CandidateReadAdoption(
  preview:B1CandidateReadPreview,
  current:{templateId:string;revision:number;epoch:number;busy:boolean;backupEpoch:number|null;hasUnsavedEdits:boolean},
):void{
  if(current.busy)deny('OPERATION_BUSY')
  if(!preview||preview.publicationAllowed!==false||preview.mayAutoSave!==false||
     current.templateId!==preview.remote.templateId||
     preview.originalEpoch!==current.epoch||
     preview.currentRevision!==current.revision)
    deny('PREVIEW_STALE')
  if(preview.remote.revision<=current.revision)deny('NOT_NEWER')
  if(current.hasUnsavedEdits && current.backupEpoch!==current.epoch)
    deny('BACKUP_REQUIRED')
}

/**
 * A DOM anchor click only requests a browser download. It is not proof of a
 * completed backup. Require the user to explicitly confirm the current exact
 * author epoch after checking the saved file before discarding dirty edits.
 */
export function assertB1CandidateBackupConfirmation(
 requested:{epoch:number;templateId:string}|null,
 current:{epoch:number;templateId:string;busy:boolean},
):void{
 if(!requested||current.busy||!current.templateId||
   requested.epoch!==current.epoch||requested.templateId!==current.templateId)
   throw new Error('B1_AUTHOR_READ_BACKUP_CONFIRMATION_STALE')
}
