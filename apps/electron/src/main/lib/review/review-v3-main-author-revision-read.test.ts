import { createHash } from 'node:crypto'
import { describe, expect, test } from 'bun:test'
import {
  CMainTrustedAuthorRevisionRead,
  type CMainAuthorReadIdentity, type CMainB1AuthorRevision,
  type CMainB1CandidateDocument,
} from './review-v3-main-author-revision-read'

interface Draft extends CMainB1CandidateDocument { fields:string[]; sources:unknown[] }
const digest=(x:unknown)=>createHash('sha256').update(JSON.stringify(x),'utf8').digest('hex')
const document=(field='f1'):Draft=>({
  schemaVersion:'review-b1/1',templateId:'author-template-51',
  status:'candidate-held',fields:[field],sources:[],
})
const id:CMainAuthorReadIdentity={
  principalId:'main-principal',sessionId:'main-session',ownerId:'main-owner',
  ownerGeneration:7,windowId:'trusted-window',frameId:'verified-sender-frame',
  authorityEpoch:'epoch-1',
}
function fixture() {
  let identity:CMainAuthorReadIdentity|undefined={...id}
  let allowed=true
  let currentDoc=document()
  let revision=1
  let observe=0
  let nextRead:()=>void=()=>{}
  const latest=async ():Promise<CMainB1AuthorRevision<Draft>>=>{
    ++observe
    const doc=structuredClone(currentDoc)
    const atRevision=revision
    nextRead()
    return {
      schemaVersion:'review-b1-draft/1',templateId:'author-template-51',
      revision:atRevision,authorId:'not-a-trusted-Main-Principal',
      savedAt:'2026-10-20T00:00:00Z',document:doc,digest:digest(doc),
    }
  }
  const port=new CMainTrustedAuthorRevisionRead<Draft>({
    currentIdentity:()=>identity&&structuredClone(identity),
    canRead:(current,templateId)=>allowed&&current.principalId==='main-principal'&&
      current.frameId==='verified-sender-frame'&&templateId==='author-template-51',
    readLatestAuthorRevision:latest,
  })
  return {
    port,observations:()=>observe,
    rotate:()=>{identity={...id,ownerGeneration:8}},
    closeFrame:()=>{identity=undefined},
    revoke:()=>{allowed=false},
    makeEdit:()=>{currentDoc=document('f2');revision++},
    onRead:(callback:()=>void)=>{nextRead=callback},
  }
}
describe('C B-CR-002-A Main trusted B1 author read (non-IPC)',()=>{
  test('reads only the real latest source with fresh Main auth and display-only candidate status',async()=>{
    const f=fixture()
    const result=await f.port.readLatestAuthorRevision('author-template-51',1)
    expect(result).toEqual({
      schemaVersion:'review-v3-author-current-read/1',
      templateId:'author-template-51',revision:1,
      sourceDigest:digest(document()),document:document(),
      state:'candidate-held',displayOnly:true,
    })
    expect(f.observations()).toBe(2)
    result.document.fields.push('client-only')
    const again=await f.port.readLatestAuthorRevision('author-template-51',1)
    expect(again.document.fields).toEqual(['f1'])
  })
  test('a different template, unauthorized Main actor or missing physical senderFrame refuses',async()=>{
    const f=fixture()
    await expect(f.port.readLatestAuthorRevision('../traversal')).rejects.toThrow('TEMPLATE_SCOPE_INVALID')
    await expect(f.port.readLatestAuthorRevision('other-template')).rejects.toThrow('NOT_AUTHORIZED')
    f.revoke()
    await expect(f.port.readLatestAuthorRevision('author-template-51')).rejects.toThrow('NOT_AUTHORIZED')
    const g=fixture()
    g.closeFrame()
    await expect(g.port.readLatestAuthorRevision('author-template-51')).rejects.toThrow('IDENTITY_UNTRUSTED')
  })
  test('owner generation rotates after awaited B read, preventing late stale frame result',async()=>{
    const f=fixture()
    f.onRead(()=>f.rotate())
    await expect(f.port.readLatestAuthorRevision('author-template-51')).rejects.toThrow('MAIN_CONTEXT_REVOKED')
    expect(f.observations()).toBe(1)
  })
  test('Main owner/frame lost after second read denies returned snapshot',async()=>{
    const f=fixture()
    let calls=0
    f.onRead(()=>{if(++calls===2)f.closeFrame()})
    await expect(f.port.readLatestAuthorRevision('author-template-51')).rejects.toThrow('IDENTITY_UNTRUSTED')
  })
  test('author revision changes during async double latest read, require explicit conflict reopen',async()=>{
    const f=fixture()
    let calls=0
    f.onRead(()=>{if(++calls===1)f.makeEdit()})
    await expect(f.port.readLatestAuthorRevision('author-template-51')).rejects.toThrow('AUTHOR_REVISION_CONFLICT_REOPEN_REQUIRED')
    const g=fixture()
    await expect(g.port.readLatestAuthorRevision('author-template-51',5)).rejects.toThrow('AUTHOR_REVISION_CONFLICT_REOPEN_REQUIRED')
    await expect(g.port.readLatestAuthorRevision('author-template-51',-1)).rejects.toThrow('EXPECTED_REVISION_INVALID')
  })
  test('author recordedBy is never used as Main Principal or publication authority',async()=>{
    const f=fixture()
    const result=await f.port.readLatestAuthorRevision('author-template-51')
    expect(result.document.status).toBe('candidate-held')
    expect(result).not.toHaveProperty('principalId')
    expect(result).not.toHaveProperty('publicationAllowed')
  })
  test('rejects missing privileged Main observer/authorizer and inconsistent B1 digest',async()=>{
    expect(()=>new CMainTrustedAuthorRevisionRead({} as never)).toThrow('PRIVILEGED_DEPENDENCIES_REQUIRED')
    const doc=document()
    const f=new CMainTrustedAuthorRevisionRead<Draft>({
      currentIdentity:()=>id,canRead:()=>true,
      readLatestAuthorRevision:()=>({
        schemaVersion:'review-b1-draft/1',templateId:'author-template-51',
        revision:1,authorId:'author',savedAt:'today',
        document:doc,digest:'0'.repeat(64),
      }),
    })
    await expect(f.readLatestAuthorRevision('author-template-51')).rejects.toThrow('AUTHOR_SOURCE_DIGEST_CHANGED')
  })
})
