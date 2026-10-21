/**
 * C11 local-candidate authoring actually installed in Electron Main.
 * A live MAIN FRAME is the local user; no Renderer actor, teacher or issuer.
 * B1's own atomic CAS/append-only vault protects revisions and candidate freeze.
 */
import { randomUUID } from 'node:crypto'
import { ipcMain, type IpcMainInvokeEvent } from 'electron'
import { REVIEW_IPC_CHANNELS } from '@profer/shared'
import { getMainWindow } from '../main-window-state'
import { assertC0ReviewMainSender } from './review-c0-authority'
import { installCMainV3AuthorReadAuthorities } from './review-v3-main-author-plan-ipc'
import {
  readB1AuthorRevision, saveB1AuthorRevision, freezeB1Candidate,
} from './review-template-author-store-v3-b1'
import {
  compileReviewB1Plan, type B1AuthorDocument,
} from './review-template-plan-adapter-v3-b1'

const templatePattern = /^[A-Za-z][A-Za-z0-9._-]{0,79}$/
const deny = (reason:string):never => { throw new Error('C11_LOCAL_AUTHOR_'+reason) }
function currentLocal(event:IpcMainInvokeEvent):void {
  assertC0ReviewMainSender(event)
  const main = getMainWindow()
  if(!main || main.isDestroyed() || main.webContents.id!==event.sender.id)
    deny('MAIN_SESSION_UNAVAILABLE')
}
function localDocument(input:unknown):B1AuthorDocument {
  if(!input || typeof input!=='object' || Array.isArray(input) ||
     !('document' in input))deny('DOCUMENT_MISSING')
  const doc=(input as {document:unknown}).document
  if(!doc || typeof doc!=='object' || Array.isArray(doc) ||
     (doc as B1AuthorDocument).schemaVersion!=='review-b1/1' ||
     (doc as B1AuthorDocument).status!=='candidate-held' ||
     !templatePattern.test((doc as B1AuthorDocument).templateId))
    deny('CANDIDATE_DOCUMENT_INVALID')
  return structuredClone(doc as B1AuthorDocument)
}
function revision(input:unknown):number {
  const n=(input as {expectedRevision?:unknown})?.expectedRevision
  if(typeof n!=='number'||!Number.isSafeInteger(n)||n<0)
    deny('EXPECTED_REVISION_INVALID')
  return n as number
}

export function installC11LocalAuthorWorkbench():void {
  // Process-local grant epoch; cold PID, new Electron process or closed Main
  // cannot inherit an old Renderer request's frame identity.
  const epoch=randomUUID()
  const localGrant={ownerId:'local-reviewer',generation:0,authorityEpoch:epoch}
  installCMainV3AuthorReadAuthorities({
    getAuthorGrant:templateId=>
      templatePattern.test(templateId) ? localGrant : undefined,
    canReadAuthor:(principalId,templateId,grant)=>
      principalId==='local-reviewer' && templatePattern.test(templateId) &&
      grant.ownerId===localGrant.ownerId &&
      grant.generation===localGrant.generation &&
      grant.authorityEpoch===epoch &&
      Boolean(getMainWindow() && !getMainWindow()!.isDestroyed()),
    readLatestB1AuthorRevision:templateId=>readB1AuthorRevision(templateId),
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.AUTHOR_SAVE_LOCAL_V3,
    (event: IpcMainInvokeEvent,input:unknown)=>{
      currentLocal(event)
      const doc=localDocument(input)
      const n=revision(input)
      const saved=saveB1AuthorRevision(doc,n,'local-reviewer')
      currentLocal(event)
      return {revision:saved.revision}
    })
  ipcMain.handle(REVIEW_IPC_CHANNELS.AUTHOR_PREVIEW_LOCAL_V3,
    (event: IpcMainInvokeEvent,input:unknown)=>{
      currentLocal(event)
      const result=compileReviewB1Plan(localDocument(input))
      currentLocal(event)
      return result
    })
  ipcMain.handle(REVIEW_IPC_CHANNELS.AUTHOR_FREEZE_LOCAL_V3,
    (event: IpcMainInvokeEvent,input:unknown)=>{
      currentLocal(event)
      const doc=localDocument(input)
      const n=revision(input)
      const saved=readB1AuthorRevision(doc.templateId)
      if(!saved || saved.revision!==n ||
         JSON.stringify(saved.document)!==JSON.stringify(doc))
        deny('UNSAVED_OR_STALE_AUTHOR_REVISION')
      const frozen=freezeB1Candidate(doc.templateId,n)
      currentLocal(event)
      return {fingerprint:frozen.descriptor.canonicalPlan.fingerprint}
    })
}
