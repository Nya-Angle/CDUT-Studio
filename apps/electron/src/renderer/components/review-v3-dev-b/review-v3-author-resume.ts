/**
 * Dev-B R22 candidate author resume guard. Both reads MUST come from the
 * existing independently authorized C Main reader. No browser source gets
 * Principal, Owner, on-disk history authority, or school-policy publisher.
 */
import type { B1AuthorDocument } from '../../../main/lib/review/review-template-plan-adapter-v3-b1'
import {
  prepareB1CandidateReadPreview,
  type B1CandidateReadPreview, type B1CandidateReadResponse,
} from './review-v3-author-revision-read'

const fail = (reason:string):never=>{throw new Error('B1_RESUME_'+reason)}

/**
 * The *only* revision-0 form eligible to load a saved candidate without an
 * exported backup is the byte-for-byte unedited blank author skeleton with
 * just its lookup templateId set. Names, sources, Checks, trial material or
 * any other current business declaration require explicit backup confirmation.
 * No arbitrary "empty-looking" author document is eligible.
 */
export function isB1PristineReopenLookup(
  draft:B1AuthorDocument, revision:number,
  saved:B1AuthorDocument|null, blank:B1AuthorDocument,
):boolean {
  if(revision!==0 || saved!==null ||
    !draft || !blank || draft.schemaVersion!=='review-b1/1' ||
    draft.status!=='candidate-held' ||
    !/^[A-Za-z][A-Za-z0-9._-]{0,79}$/.test(draft.templateId) ||
    blank.templateId!=='' || blank.status!=='candidate-held') return false
  const expected=structuredClone(blank)
  expected.templateId=draft.templateId
  return JSON.stringify(expected)===JSON.stringify(draft)
}

/**
 * A displayed candidate snapshot is only a preview. Before accepting it,
 * C Main must reread its actual current author chain and return again.
 * This requires SAME revision, digest and complete author document as the
 * displayed preview; any ABA/rewritten snapshot fails closed.
 */
export function assertB1ResumeReadStillCurrent(
  staged:B1CandidateReadPreview,
  currentResponse:unknown,
  local:{templateId:string;revision:number;epoch:number;draft:B1AuthorDocument;saved:B1AuthorDocument|null},
):B1CandidateReadResponse {
  if (!staged || staged.originalEpoch!==local.epoch ||
      staged.currentRevision!==local.revision ||
      staged.remote.templateId!==local.templateId ||
      staged.publicationAllowed!==false || staged.mayAutoSave!==false)
    fail('STAGED_CONTEXT_CHANGED')
  const refreshed=prepareB1CandidateReadPreview(currentResponse,local)
  const old=staged.remote,latest=refreshed.remote
  if(latest.revision!==old.revision || latest.digest!==old.digest ||
     JSON.stringify(latest.document)!==JSON.stringify(old.document) ||
     latest.candidateStatus!=='candidate-held') fail('CHANGED_DURING_CONFIRMATION')
  if(latest.revision<=local.revision)fail('NOT_NEWER')
  return structuredClone(latest)
}
