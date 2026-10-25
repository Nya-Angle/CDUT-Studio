/**
 * Dev-C R10: actual C Main-to-B20 source adapter.
 *
 * This adapter calls the real B1 revision/frozen store, B2 staging/parser,
 * persistent ZIP Vault/InputLedger and B19 binding resolver. Nothing here
 * creates a school publisher, a Case/Plan/Run transaction or Renderer source.
 *
 * The Electron IPC handler supplies REAL sender.id/senderFrame.routingId; the
 * C Main host must separately install live owner/grant, current candidate
 * registration and a Main-only private physical ZIP key registry.
 *
 * It intentionally cannot install itself using the local-reviewer fallback:
 * a Main-held, current and independently authorized candidate source is
 * mandatory. A zero-entry source selector means UNKNOWN, never PASS.
 */
import {
  readB20CurrentCandidateBundle,
  type B20MainReadScope, type B20ReadAuthorExpectation,
  type B20CurrentMainReadAuthority, type B20ReadOnlySources,
} from './review-v3-b1-b2-main-read-bundle-v3-b'
import type { B19SourceSelection } from './review-v3-b1-b2-candidate-source-bridge'
import {CMainNativeArchiveRegistry} from './review-v3-main-native-archive-registry'
import {
  installCMainV3B20ReadAuthorities,
  type CMainV3B20ReadAuthorities, type CMainV3Grant,
} from './review-v3-main-author-plan-ipc'
import type {
  CMainB20ReadIdentity, CMainB20PinnedExpectation,
} from './review-v3-main-b20-trusted-candidate-read'

const reject=(reason:string):never=>{throw new Error('C_MAIN_B20_PHYSICAL_'+reason)}
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b)
const sha=/^[a-f0-9]{64}$/
const safe=(s:unknown):s is string=>typeof s==='string'&&s.length>0&&s.length<=256

/**
 * All callbacks below must be backed by trusted C Main current state, not
 * Renderer payload nor self-issued B fixtures. The B vault/staging must be
 * the SAME instances used when physical candidates were created.
 */
export interface CMainB20PhysicalSources {
  readonly bSources:B20ReadOnlySources
  currentCandidate(principalId:string,templateId:string):
    {caseCandidateId:string;grant:CMainV3Grant}|undefined
  canReadCandidate(principalId:string,templateId:string,
    caseCandidateId:string,grant:CMainV3Grant):boolean
  currentPinnedAuthor(caseCandidateId:string,templateId:string):
    CMainB20PinnedExpectation|undefined
  /** C Main-owned author/current source selector, not incoming IPC. */
  currentSelections(scope:Readonly<B20MainReadScope>,
    author:Readonly<B20ReadAuthorExpectation>):readonly B19SourceSelection[]|null
  /** One C-owned ephemeral OS-native capability registry, never a B vault. */
  readonly nativePicker:CMainNativeArchiveRegistry
  /**
   * Original opaque ZIP key minted at initial C Main physical import. Its
   * availability after cold restart must be NULL until newly reauthorized.
   * Never return this key through an IPC response.
   */
  currentMainIssuedOriginalKey(
    scope:Readonly<CMainB20ReadIdentity>,
    archiveId:string,bScope:Readonly<B20MainReadScope>,
  ):string|null
  /** Independent real Main Principal/frame/Owner current grant proof. */
  assertLiveCMainIdentity(identity:CMainB20ReadIdentity):void
}
/**
 * Epoch is a local monotonic number, NEVER parsed from C authorityEpoch.
 * A change to any C physical scope rotates B's numeric scope. A fresh Main
 * process starts with no privileges and must re-register all grants/pickers.
 */
export class CMainB20NumericEpoch {
  private generation=0
  private previous:string|undefined
  private closed=false
  create(id:CMainB20ReadIdentity,numeric:{senderId:number;frameId:number}):
    B20MainReadScope {
    if(this.closed)return reject('NUMERIC_EPOCH_CLOSED')
    if(!id||!safe(id.principalId)||!safe(id.sessionId)||
       !safe(id.windowId)||!safe(id.frameId)||!safe(id.ownerId)||
       !safe(id.authorityEpoch)||!safe(id.caseCandidateId)||
       !Number.isSafeInteger(id.ownerGeneration)||id.ownerGeneration<0||
       !Number.isSafeInteger(numeric?.senderId)||numeric.senderId<0||
       !Number.isSafeInteger(numeric?.frameId)||numeric.frameId<0)
      return reject('REAL_MAIN_NUMERIC_FRAME_AND_GRANT_REQUIRED')
    const identityKey=JSON.stringify([id.principalId,id.sessionId,
      id.windowId,id.frameId,id.caseCandidateId,id.ownerId,
      id.ownerGeneration,id.authorityEpoch,numeric.senderId,numeric.frameId])
    if(this.previous!==identityKey){
      if(this.generation>=Number.MAX_SAFE_INTEGER)return reject('EPOCH_EXHAUSTED')
      this.generation++
      this.previous=identityKey
    }
    return {
      senderId:numeric.senderId,frameId:numeric.frameId,
      principalId:id.principalId,sessionId:id.sessionId,
      ownerId:id.ownerId,ownerGeneration:id.ownerGeneration,
      caseCandidateId:id.caseCandidateId,authorityEpoch:this.generation,
    }
  }
  invalidate():void {this.previous=undefined}
  close():void {this.closed=true;this.invalidate()}
}
/**
 * Installs production B20 *source code* in the already-registered Electron
 * Main read IPC, conditional on REAL privileged Main sources. It is display
 * only and refuses to generate a school policy, Host or business receipt.
 */
export function installCMainV3PhysicalB20Sources(source:CMainB20PhysicalSources):
  ()=>void {
  if(!source||!source.bSources?.staging||!source.bSources.parser||
     !source.bSources.vault||!source.bSources.ledger||
     typeof source.currentCandidate!=='function'||
     typeof source.canReadCandidate!=='function'||
     typeof source.currentPinnedAuthor!=='function'||
     typeof source.currentSelections!=='function'||
     !(source.nativePicker instanceof CMainNativeArchiveRegistry)||
     typeof source.currentMainIssuedOriginalKey!=='function'||
     typeof source.assertLiveCMainIdentity!=='function')
    return reject('REAL_B1_B2_AND_C_MAIN_AUTHORITY_REQUIRED')
  const epochs=new CMainB20NumericEpoch()
  let closed=false
  const active=()=>{if(closed)reject('SOURCE_UNINSTALLED')}
  const validate=(id:CMainB20ReadIdentity,expected:CMainB20PinnedExpectation)=>{
    active()
    source.assertLiveCMainIdentity(id)
    const current=source.currentCandidate(id.principalId,expected.templateId)
    if(!current||current.caseCandidateId!==id.caseCandidateId||
       current.grant.ownerId!==id.ownerId||
       current.grant.generation!==id.ownerGeneration||
       current.grant.authorityEpoch!==id.authorityEpoch||
       !source.canReadCandidate(id.principalId,expected.templateId,
         id.caseCandidateId,current.grant))
      return reject('OWNER_OR_CANDIDATE_REVOKED')
    const pin=source.currentPinnedAuthor(id.caseCandidateId,expected.templateId)
    if(!pin||!same(pin,expected)||!sha.test(pin.revisionDigest)||
       !sha.test(pin.frozenFingerprint))return reject('FROZEN_PIN_REVOKED')
  }
  /** C native ZIP dialog may only target an archive already in C's trusted
   * CURRENT B19 selections; checked from B Vault original + sealed key digest.
   * This is a physical reauthorization only, never a Material/Plan writer. */
  const repick=(expected:CMainB20PinnedExpectation,
    id:CMainB20ReadIdentity,numeric:{senderId:number;frameId:number},
    archiveId:string):void=>{
    validate(id,expected)
    const scope=epochs.create(id,numeric)
    source.bSources.staging.assertStillGranted(scope)
    const selected=source.currentSelections(scope,expected)
    if(!Array.isArray(selected)||!selected.some(x=>x.archiveId===archiveId))
      return reject('ARCHIVE_NOT_IN_CURRENT_C_MAIN_SELECTIONS')
    const checkpoint=source.bSources.vault.inspect(scope,archiveId)
    const key=source.currentMainIssuedOriginalKey(id,archiveId,scope)
    if(!key||!safe(key))return reject('MAIN_ISSUED_ORIGINAL_KEY_NOT_AVAILABLE')
    source.nativePicker.pickForBVault({
      archiveId,archiveSha256:checkpoint.archiveSha256,
      archiveByteLength:checkpoint.byteLength,
    },key,checkpoint.physicalArchiveKeyDigest)
    validate(id,expected)
    if(!same(epochs.create(id,numeric),scope))
      return reject('MAIN_SCOPE_CHANGED_DURING_OS_PICKER')
  }
  const authority:CMainV3B20ReadAuthorities={
    currentCandidate:(principalId,templateId)=>{
      active()
      return source.currentCandidate(principalId,templateId)
    },
    canReadCandidate:(principal,id,candidate,grant)=>{
      active()
      return source.canReadCandidate(principal,id,candidate,grant)
    },
    currentPinnedAuthor:(candidate,id)=>{
      active()
      return source.currentPinnedAuthor(candidate,id)
    },
    repickNativeArchive:(expected,id,numeric,archiveId)=>{
      repick(expected,id,numeric,archiveId)
    },
    readCurrentB20Bundle:(expected,id,numeric)=>{
      validate(id,expected)
      const numericStart=epochs.create(id,numeric)
      const authority:B20CurrentMainReadAuthority={
        currentScope:()=>{
          validate(id,expected)
          const current=epochs.create(id,numeric)
          if(!same(current,numericStart))return reject('NUMERIC_SCOPE_ROTATED')
          return current
        },
        currentSelections:(bScope,author)=>{
          validate(id,expected)
          if(!same(bScope,numericStart)||!same(author,expected))
            return reject('FOREIGN_OWNER_OR_AUTHOR_SOURCE')
          const selections=source.currentSelections(bScope,author)
          if(!Array.isArray(selections))return reject('C_SOURCE_REGISTRY_NOT_INSTALLED')
          return structuredClone(selections)
        },
        nativeArchiveKey:(bScope,archiveId)=>{
          validate(id,expected)
          if(!same(bScope,numericStart))return reject('NATIVE_PICKER_SCOPE_DRIFT')
          const archive=source.bSources.vault.inspect(bScope,archiveId)
          return source.nativePicker.resolveNativeArchiveKey({
            archiveId,archiveSha256:archive.archiveSha256,
            archiveByteLength:archive.byteLength,
          })
        },
      }
      const result=readB20CurrentCandidateBundle(expected,{
        authority,sources:source.bSources,
      })
      validate(id,expected)
      if(!same(epochs.create(id,numeric),numericStart))
        return reject('MAIN_SCOPE_CHANGED_AFTER_PHYSICAL_READ')
      return result
    },
  }
  const uninstall=installCMainV3B20ReadAuthorities(authority)
  return ()=>{
    if(!closed){closed=true;epochs.close();uninstall()}
  }
}
