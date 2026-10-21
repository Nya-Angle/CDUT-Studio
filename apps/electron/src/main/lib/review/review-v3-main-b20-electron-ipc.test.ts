/**
 * C-MAIN-B20-WIRE-R02: the REAL registered Electron handler and Preload
 * contract, exercised with isolated trusted-authority test fixtures.
 * B20 R20/B19/B2 source bytes are NOT yet imported into C; this proves
 * Main identity boundary only, never a physically installed source or Gate E.
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { REVIEW_IPC_CHANNELS } from '@profer/shared'
import { setMainWindow } from '../main-window-state'
import { registerReviewIpc } from './review-ipc'
import {
  installCMainV3B20ReadAuthorities,
  type CMainV3B20ReadAuthorities,
} from './review-v3-main-author-plan-ipc'

const handlers=(globalThis.__proferElectronTestHooks as typeof globalThis.__proferElectronTestHooks & {
  ipcMainHandlers:Map<string,(...args:unknown[])=>unknown>
}).ipcMainHandlers
const frame={processId:777,routingId:3}
const sender={id:91,mainFrame:frame,isDestroyed:()=>false}
const main={isDestroyed:()=>false,webContents:sender}
const event={sender,senderFrame:frame}
const invoke=(payload:unknown,ev:unknown=event)=>{
  const handler=handlers.get(REVIEW_IPC_CHANNELS.B20_CANDIDATE_READ_V3)
  if(!handler)throw Error('C B20 Main handler not registered')
  return Promise.resolve(handler(ev,payload))
}
const pinned={
  templateId:'template51',revision:3,
  revisionDigest:'a'.repeat(64),frozenFingerprint:'b'.repeat(64),
}
function fixture(){
  let epoch=7,enabled=true,allowed=true,reads=0
  let pin={...pinned},snapshot='c'.repeat(64),afterRead=(_:number)=>{}
  const candidate=()=>({
    schemaVersion:'review-v3-b20-main-read-bundle/1',
    candidateOnly:true,publicationAllowed:false,
    businessWriteAllowed:false,schoolPolicyVerified:false,
    authorityInstalledByB:false,authorStatus:'candidate-held',
    templateId:pin.templateId,authorRevision:pin.revision,
    authorRevisionDigest:pin.revisionDigest,frozenFingerprint:pin.frozenFingerprint,
    ownerId:'owner51',ownerGeneration:epoch,caseCandidateId:'case51',
    frozenDescriptor:{canonicalPlan:{fingerprint:pin.frozenFingerprint}},
    candidateProvenance:{
      schemaVersion:'review-v3-b1-b2-candidate-source/1',
      candidateOnly:true,publicationAllowed:false,
      businessWriteAllowed:false,schoolPolicyVerified:false,
      ownerId:'owner51',ownerGeneration:epoch,caseCandidateId:'case51',
      planFingerprint:pin.frozenFingerprint,
      bindings:[{state:'unknown',subjectId:'subject51',sources:[]}],
      invalidatedPriorEvidence:[],snapshotHash:snapshot,
    },
    nativePhysicalArchiveKey:'MUST_NOT_ESCAPE',schoolIssuer:'MUST_NOT_ESCAPE',
  })
  const authority:CMainV3B20ReadAuthorities={
    currentCandidate:(principal,id)=>enabled&&principal==='local-reviewer'&&id==='template51'
      ? {caseCandidateId:'case51',grant:{
          ownerId:'owner51',generation:epoch,authorityEpoch:'main-'+epoch,
        }} :undefined,
    canReadCandidate:(principal,id,caseId,grant)=>allowed&&enabled&&
      principal==='local-reviewer'&&id==='template51'&&caseId==='case51'&&
      grant.ownerId==='owner51'&&grant.generation===epoch,
    currentPinnedAuthor:(caseId,id)=>caseId==='case51'&&id==='template51'?{...pin}:undefined,
    readCurrentB20Bundle:async()=>{
      reads++
      const result=candidate()
      afterRead(reads)
      return result
    },
  }
  return {authority,reads:()=>reads,rotate:()=>{epoch++},
    revoke:()=>{allowed=false},expire:()=>{enabled=false},
    drift:()=>{snapshot='d'.repeat(64)},
    changePin:()=>{pin={...pinned,revision:4}},
    onRead:(f:(n:number)=>void)=>{afterRead=f}}
}
describe('C-MAIN-B20-WIRE-R02 Electron registered read only',()=>{
  test('Main registration exists; no physical trusted source is default-deny',async()=>{
    handlers.clear()
    setMainWindow(main as never)
    registerReviewIpc()
    expect(handlers.has(REVIEW_IPC_CHANNELS.B20_CANDIDATE_READ_V3)).toBe(true)
    await expect(invoke({templateId:'template51'})).rejects.toThrow('B20_TRUSTED_SOURCE_NOT_INSTALLED')
  })
  test('renderer cannot provide principal, caseCandidate, archive key or author pin',async()=>{
    for(const extra of [
      {principalId:'school'}, {caseCandidateId:'other-case'},
      {nativePhysicalArchiveKey:'fake'}, {revision:3},
      {sourceIdentity:{}}, {actor:{role:'school'}},
    ]){
      await expect(invoke({templateId:'template51',...extra}))
        .rejects.toThrow('B20_RENDERER_CREDENTIAL_OR_SOURCE_CLAIM')
    }
    await expect(invoke({templateId:'../bad'})).rejects.toThrow('B20_TEMPLATE_ID_INVALID')
  })
  test('separate trusted Main owner gate supplies candidate-only display, never physical key/issuer',async()=>{
    const f=fixture(),dispose=installCMainV3B20ReadAuthorities(f.authority)
    try{
      const result=await invoke({templateId:'template51'}) as Record<string,unknown>
      expect(result).toMatchObject({
        templateId:'template51',caseCandidateId:'case51',
        state:'candidate-held',displayOnly:true,schoolPolicyVerified:false,
        businessWriteAllowed:false,publicationAllowed:false,
      })
      expect(f.reads()).toBe(2)
      expect(result).not.toHaveProperty('nativePhysicalArchiveKey')
      expect(result).not.toHaveProperty('schoolIssuer')
    }finally{dispose()}
  })
  test('senderFrame substitution, missing current Owner, revoked read and generation rotation deny',async()=>{
    const f=fixture(),dispose=installCMainV3B20ReadAuthorities(f.authority)
    try{
      await expect(invoke({templateId:'template51'},
        {sender,senderFrame:{...frame}})).rejects.toThrow('SENDER_UNTRUSTED')
      f.revoke()
      await expect(invoke({templateId:'template51'})).rejects.toThrow('MAIN_ACL_REVOKED')
    }finally{dispose()}
    const g=fixture(),off=installCMainV3B20ReadAuthorities(g.authority)
    try{
      g.onRead(n=>{if(n===1)g.rotate()})
      await expect(invoke({templateId:'template51'})).rejects
        .toThrow(/MAIN_CONTEXT_REVOKED_AFTER_B20_READ|B20_BUNDLE_NOT_PINNED_TO_MAIN/)
    }finally{off()}
    const h=fixture(),end=installCMainV3B20ReadAuthorities(h.authority)
    try{
      h.expire()
      await expect(invoke({templateId:'template51'})).rejects.toThrow('MAIN_IDENTITY_NOT_INSTALLED')
    }finally{end()}
  })
  test('B20 source change, author pin drift and source uninstall during awaited read deny',async()=>{
    const a=fixture(),endA=installCMainV3B20ReadAuthorities(a.authority)
    try{
      a.onRead(n=>{if(n===1)a.drift()})
      await expect(invoke({templateId:'template51'})).rejects.toThrow('B20_SOURCE_CHANGED_DURING_READ')
    }finally{endA()}
    const b=fixture(),endB=installCMainV3B20ReadAuthorities(b.authority)
    try{
      b.onRead(n=>{if(n===1)b.changePin()})
      await expect(invoke({templateId:'template51'})).rejects
        .toThrow('MAIN_CONTEXT_REVOKED_AFTER_B20_READ')
    }finally{endB()}
    const c=fixture(),endC=installCMainV3B20ReadAuthorities(c.authority)
    try{
      c.onRead(n=>{if(n===1)endC()})
      await expect(invoke({templateId:'template51'})).rejects
        .toThrow('B20_SOURCE_INSTALLATION_REVOKED')
    }finally{endC()}
  })
  test('two different installed sources cannot coexist, and prior source is not authoritative after uninstall',async()=>{
    const a=fixture(),end=installCMainV3B20ReadAuthorities(a.authority)
    try{
      expect(()=>installCMainV3B20ReadAuthorities(fixture().authority))
        .toThrow('B20_READER_ALREADY_INSTALLED')
    }finally{end()}
    await expect(invoke({templateId:'template51'})).rejects.toThrow('B20_TRUSTED_SOURCE_NOT_INSTALLED')
  })
})
afterAll(()=>{setMainWindow(null)})
