/**
 * Dev-C C-BCR002-A — Main-only author revision read with re-entrant trust.
 *
 * This is a read-only adapter to Dev-B B1's real append-only author vault.
 * Main injects its authoritative latest-revision reader and fresh Principal,
 * Owner and senderFrame validity observers. No Renderer identity, authorId,
 * policy publication, IPC or automatic conflict merge is accepted here.
 *
 * A returned snapshot is DISPLAY ONLY, not a durable save/freeze permission;
 * every future mutation must repeat authorization inside its own CAS lock.
 */
import { createHash } from 'node:crypto'

export interface CMainAuthorReadIdentity {
  readonly principalId: string
  readonly sessionId: string
  readonly ownerId: string
  readonly ownerGeneration: number
  readonly windowId: string
  readonly frameId: string
  /** Rotated on window/grant/session/owner revocation; supplied by real Main. */
  readonly authorityEpoch: string
}

export interface CMainB1AuthorRevision<TDocument = unknown> {
  readonly schemaVersion: 'review-b1-draft/1'
  readonly templateId: string
  readonly revision: number
  readonly authorId: string
  readonly savedAt: string
  readonly document: TDocument
  readonly digest: string
  readonly parentDigest?: string
}
export interface CMainB1CandidateDocument {
  readonly schemaVersion: 'review-b1/1'
  readonly templateId: string
  readonly status: 'candidate-held'
}
export interface CMainAuthorReadDependencies<TDocument extends CMainB1CandidateDocument> {
  /** Obtained from Main's real Principal/Owner/senderFrame, never a payload. */
  currentIdentity(): CMainAuthorReadIdentity | undefined
  /** Independent Main authorizer; recomputed before and after disk/await. */
  canRead(identity:CMainAuthorReadIdentity,templateId:string): boolean
  /** Main-privileged B1 readB1AuthorRevision(templateId) full-chain verifier. */
  readLatestAuthorRevision(templateId:string): Promise<CMainB1AuthorRevision<TDocument>|undefined>
    | CMainB1AuthorRevision<TDocument>|undefined
}

export interface CMainAuthorReadResult<TDocument extends CMainB1CandidateDocument> {
  readonly schemaVersion:'review-v3-author-current-read/1'
  readonly templateId:string
  readonly revision:number
  readonly sourceDigest:string
  readonly document:TDocument
  readonly state:'candidate-held'
  /** Current display token; not a publication/privileged write capability. */
  readonly displayOnly:true
}

const nameRe=/^[A-Za-z][A-Za-z0-9._-]{0,79}$/
const shaRe=/^[a-f0-9]{64}$/
const deny=(code:string):never=>{throw new Error('C_MAIN_AUTHOR_READ_'+code)}
const valid=(v:unknown):v is string=>typeof v==='string'&&v.length>0
function assertIdentity(i:CMainAuthorReadIdentity|undefined):CMainAuthorReadIdentity {
  if(!i || !valid(i.principalId) || !valid(i.sessionId) ||
     !valid(i.ownerId) || !valid(i.windowId) || !valid(i.frameId) ||
     !valid(i.authorityEpoch) || !Number.isSafeInteger(i.ownerGeneration) ||
     i.ownerGeneration<0) return deny('IDENTITY_UNTRUSTED')
  return structuredClone(i)
}
function sameIdentity(a:CMainAuthorReadIdentity,b:CMainAuthorReadIdentity):boolean {
  return a.principalId===b.principalId&&a.sessionId===b.sessionId&&
    a.ownerId===b.ownerId&&a.ownerGeneration===b.ownerGeneration&&
    a.windowId===b.windowId&&a.frameId===b.frameId&&
    a.authorityEpoch===b.authorityEpoch
}
function verified<T extends CMainB1CandidateDocument>(
  record:CMainB1AuthorRevision<T>|undefined,templateId:string,
):CMainB1AuthorRevision<T> {
  if(!record || record.schemaVersion!=='review-b1-draft/1' ||
    record.templateId!==templateId || record.document?.schemaVersion!=='review-b1/1' ||
    record.document.templateId!==templateId || record.document.status!=='candidate-held' ||
    !Number.isSafeInteger(record.revision) || record.revision<1 ||
    !valid(record.authorId) || !valid(record.savedAt) || !shaRe.test(record.digest)) {
    return deny('LATEST_REVISION_MISSING_OR_INVALID')
  }
  const bytes=JSON.stringify(record.document)
  if(bytes.length>2*1024*1024 ||
    createHash('sha256').update(bytes,'utf8').digest('hex')!==record.digest) {
    return deny('AUTHOR_SOURCE_DIGEST_CHANGED')
  }
  return structuredClone(record)
}

/** Requires fresh Main frame/Owner/Principal proof at BOTH read boundaries. */
export class CMainTrustedAuthorRevisionRead<T extends CMainB1CandidateDocument> {
  constructor(private readonly deps:CMainAuthorReadDependencies<T>) {
    if(!deps || typeof deps.currentIdentity!=='function' ||
      typeof deps.canRead!=='function' ||
      typeof deps.readLatestAuthorRevision!=='function') {
      deny('PRIVILEGED_DEPENDENCIES_REQUIRED')
    }
  }

  private current(templateId:string):CMainAuthorReadIdentity {
    const current=assertIdentity(this.deps.currentIdentity())
    if(!this.deps.canRead(current,templateId)) return deny('NOT_AUTHORIZED')
    return current
  }

  async readLatestAuthorRevision(
    templateId:string,
    expectedRevision?:number,
  ):Promise<CMainAuthorReadResult<T>> {
    if(!nameRe.test(templateId) || templateId==='.' || templateId==='..') {
      return deny('TEMPLATE_SCOPE_INVALID')
    }
    if(expectedRevision!==undefined &&
      (!Number.isSafeInteger(expectedRevision)||expectedRevision<0)) {
      return deny('EXPECTED_REVISION_INVALID')
    }
    // Main establishes the actor and live senderFrame. Request has NO actor.
    const atStart=this.current(templateId)
    const first=verified(await this.deps.readLatestAuthorRevision(templateId),templateId)
    const afterFirst=this.current(templateId)
    if(!sameIdentity(atStart,afterFirst)) return deny('MAIN_CONTEXT_REVOKED')
    // A candidate may change during an async author diff/read operation.
    // Require a second latest B1 full-history read, not just cached DTO.
    const latest=verified(await this.deps.readLatestAuthorRevision(templateId),templateId)
    const atEnd=this.current(templateId)
    if(!sameIdentity(atStart,atEnd)) return deny('MAIN_CONTEXT_REVOKED')
    if(first.revision!==latest.revision || first.digest!==latest.digest ||
       JSON.stringify(first.document)!==JSON.stringify(latest.document)) {
      return deny('AUTHOR_REVISION_CONFLICT_REOPEN_REQUIRED')
    }
    if(expectedRevision!==undefined&&latest.revision!==expectedRevision) {
      return deny('AUTHOR_REVISION_CONFLICT_REOPEN_REQUIRED')
    }
    return {
      schemaVersion:'review-v3-author-current-read/1',
      templateId, revision:latest.revision, sourceDigest:latest.digest,
      document:structuredClone(latest.document),state:'candidate-held',
      displayOnly:true,
    }
  }
}
