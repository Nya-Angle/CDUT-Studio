/**
 * Dev-C C-MAIN-WIRE-R01: actual Electron Main author read and Plan upgrade
 * handlers, fail-closed until independent B1 vault and policy authorities are
 * explicitly installed by privileged Main composition.
 *
 * No renderer can install a source, mint a school issuer, grant a Case Owner,
 * choose the Actor, or change the author vault's candidate-held status.
 * The handler is registered in the real review-ipc.ts and is only reachable
 * through the main-frame-only Preload reviewAPI.
 */
import { randomUUID } from 'node:crypto'
import type { IpcMainInvokeEvent } from 'electron'
import { ipcMain } from 'electron'
import {
  REVIEW_IPC_CHANNELS, type Actor, type CanonicalPlan,
  type CaseAggregateV2,
} from '@profer/shared'
import { getMainWindow } from '../main-window-state'
import { assertC0ReviewMainSender } from './review-c0-authority'
import {
  CMainTrustedAuthorRevisionRead,
  type CMainB1AuthorRevision, type CMainB1CandidateDocument,
  type CMainAuthorReadIdentity,
} from './review-v3-main-author-revision-read'
import {
  upgradeCanonicalPlanV3,
  type CMainUpgradeRemovalAck,
} from './plan-binding-v3'
import {
  C2MainPublishedPlanProvenance,
  type C2MainPublishedPlanSource,
} from './review-v3-main-plan-provenance'
import { assertSafeReviewStorageId } from './review-storage-id'
import {
  CMainRemovalConsentGate, type CMainRemovalWitnessSource,
} from './review-v3-main-removal-consent'
import {
  createCMainElectronRemovalObserver,
} from './review-v3-main-native-removal-observer'
import {
  CMainB20TrustedCandidateRead,
  type CMainB20PinnedExpectation,
  type CMainB20ReadIdentity,
} from './review-v3-main-b20-trusted-candidate-read'

const refuse=(reason:string):never=>{throw new Error('C_MAIN_V3_IPC_'+reason)}
const safe=(v:unknown):v is string=>typeof v==='string'&&v.length>0&&v.length<=128
const own=(v:unknown,key:string)=>!!v&&typeof v==='object'&&Object.prototype.hasOwnProperty.call(v,key)

/** Provided ONLY by privileged Main's actual Owner/grant registry. */
export interface CMainV3Grant {
  readonly ownerId:string
  readonly generation:number
  /** Rotates on revoke, logout, new Owner or window generation. */
  readonly authorityEpoch:string
}

/**
 * Requires independently trusted, live sources. None are synthesized from
 * local-device reviewer identity, Renderer payload or B candidate documents.
 */
/** Candidate-held author reading needs an actual Main Owner grant and B1 vault,
 * but does NOT need a school policy publisher or Case write authorization. */
export interface CMainV3AuthorReadAuthorities<T extends CMainB1CandidateDocument=CMainB1CandidateDocument> {
  getAuthorGrant(templateId:string):CMainV3Grant|undefined
  canReadAuthor(principalId:string,templateId:string,grant:CMainV3Grant):boolean
  readLatestB1AuthorRevision(templateId:string):Promise<CMainB1AuthorRevision<T>|undefined>
    |CMainB1AuthorRevision<T>|undefined
}
/** Formal Case mutation is independently gated on a privileged publisher. */
export interface CMainV3PlanUpgradeAuthorities {
  getCaseGrant(caseId:string):CMainV3Grant|undefined
  canUpgradeCase(principalId:string,caseId:string,grant:CMainV3Grant):boolean
  readonly publishedPlanSource:C2MainPublishedPlanSource
  /** C/Main observed physical human confirmation; absent means deletion DENIED. */
  readonly removalConsentSource?:CMainRemovalWitnessSource
}
/** Backwards-compatible atomic Main installation for existing privileged callers.
 * Prefer independently installed reader/writer authorities for production. */
export interface CMainV3AuthorPlanAuthorities<T extends CMainB1CandidateDocument=CMainB1CandidateDocument>
  extends CMainV3AuthorReadAuthorities<T>, CMainV3PlanUpgradeAuthorities {}

/** Only C's privileged Main composition may install B20's real read dependencies.
 * This is NOT a school issuer or a second author vault/source registry.
 * The source must call B's exact pinned R20 facade after I's separate source import.
 */
export interface CMainV3B20ReadAuthorities {
  currentCandidate(principalId:string,templateId:string):
    {caseCandidateId:string;grant:CMainV3Grant}|undefined
  canReadCandidate(principalId:string,templateId:string,caseCandidateId:string,grant:CMainV3Grant):boolean
  currentPinnedAuthor(caseCandidateId:string,templateId:string):
    CMainB20PinnedExpectation|undefined
  readCurrentB20Bundle(
    expected:CMainB20PinnedExpectation,
    identity:CMainB20ReadIdentity,
    numeric:{senderId:number;frameId:number},
  ):Promise<unknown>|unknown
  /** Only privileged C Main physical archive session can implement this.
   * If omitted, user requests default-deny and cannot forge picker success. */
  repickNativeArchive?(
    expected:CMainB20PinnedExpectation,identity:CMainB20ReadIdentity,
    numeric:{senderId:number;frameId:number},archiveId:string,
  ):Promise<void>|void
}
type CMainB20Installation={source:CMainV3B20ReadAuthorities;token:string}
let b20ReadInstallation:CMainB20Installation|undefined
export function installCMainV3B20ReadAuthorities(next:CMainV3B20ReadAuthorities):()=>void {
  if(b20ReadInstallation)refuse('B20_READER_ALREADY_INSTALLED')
  if(!next||typeof next.currentCandidate!=='function'||
     typeof next.canReadCandidate!=='function'||
     typeof next.currentPinnedAuthor!=='function'||
     typeof next.readCurrentB20Bundle!=='function')refuse('B20_REAL_SOURCE_REQUIRED')
  const installed:CMainB20Installation={source:next,token:randomUUID()}
  b20ReadInstallation=installed
  return ()=>{if(b20ReadInstallation===installed)b20ReadInstallation=undefined}
}
type MainInstallation<T>={
  readonly source:T;readonly token:symbol
  readonly removalGate?:CMainRemovalConsentGate
}
let authorReadInstallation:MainInstallation<CMainV3AuthorReadAuthorities>|undefined
let planUpgradeInstallation:MainInstallation<CMainV3PlanUpgradeAuthorities>|undefined

function validateReader(next:CMainV3AuthorReadAuthorities):void {
  if(!next || typeof next.getAuthorGrant!=='function' ||
     typeof next.canReadAuthor!=='function' ||
     typeof next.readLatestB1AuthorRevision!=='function')
    refuse('AUTHOR_READER_SOURCE_REQUIRED')
}
function validateWriter(next:CMainV3PlanUpgradeAuthorities):void {
  if(!next || typeof next.getCaseGrant!=='function' ||
     typeof next.canUpgradeCase!=='function' ||
     !next.publishedPlanSource) refuse('INDEPENDENT_PUBLISHED_PLAN_AUTHORITY_REQUIRED')
  // This validates dependency shape, not school issuance. Only the real
  // published Plan provenance checker inside Case CAS can attest a policy.
  new C2MainPublishedPlanProvenance(next.publishedPlanSource)
}
function newInstallation<T>(source:T,removalGate?:CMainRemovalConsentGate):MainInstallation<T> {
  return {source,token:Symbol('main-v3-authority-installation'),removalGate}
}
/** No IPC or renderer route may install either authority. Uninstall/reinstall of
 * the SAME source object is still a new authority generation. */
export function installCMainV3AuthorReadAuthorities(
  next:CMainV3AuthorReadAuthorities,
):()=>void {
  if(authorReadInstallation) refuse('AUTHOR_READER_ALREADY_INSTALLED')
  validateReader(next)
  const installed=newInstallation(next)
  authorReadInstallation=installed
  return ()=>{if(authorReadInstallation===installed)authorReadInstallation=undefined}
}
export function installCMainV3PlanUpgradeAuthorities(
  next:CMainV3PlanUpgradeAuthorities,
):()=>void {
  if(planUpgradeInstallation) refuse('PLAN_WRITER_ALREADY_INSTALLED')
  validateWriter(next)
  const installed=newInstallation(next,new CMainRemovalConsentGate(next.removalConsentSource))
  planUpgradeInstallation=installed
  return ()=>{
    if(planUpgradeInstallation===installed)planUpgradeInstallation=undefined
    installed.removalGate?.close()
  }
}
/**
 * Native Main composition of physical human consent; only a caller already
 * holding the REAL published Plan source and C Principal/Owner grant may use it.
 * This does not synthesize a school issuer. A rejected installation closes
 * the observer and leaves all existing Main registration unchanged.
 */
export function installCMainV3NativePlanUpgradeAuthorities(
  source:Omit<CMainV3PlanUpgradeAuthorities,'removalConsentSource'>,
):()=>void {
  if(planUpgradeInstallation)refuse('PLAN_WRITER_ALREADY_INSTALLED')
  const observer=createCMainElectronRemovalObserver()
  try {
    const dispose=installCMainV3PlanUpgradeAuthorities({
      ...source,removalConsentSource:observer,
    })
    return ()=>{dispose();observer.close()}
  }catch(error){
    observer.close()
    throw error
  }
}
/** Legacy combined installer is atomic and cannot silently take over an
 * already installed independent reader or writer source. */
export function installCMainV3AuthorPlanAuthorities(
  next:CMainV3AuthorPlanAuthorities,
):()=>void {
  if(authorReadInstallation||planUpgradeInstallation)
    refuse('AUTHORITIES_ALREADY_INSTALLED')
  validateReader(next)
  validateWriter(next)
  const read=newInstallation<CMainV3AuthorReadAuthorities>(next)
  const write=newInstallation<CMainV3PlanUpgradeAuthorities>(
    next,new CMainRemovalConsentGate(next.removalConsentSource))
  authorReadInstallation=read
  planUpgradeInstallation=write
  return ()=>{
    if(authorReadInstallation===read)authorReadInstallation=undefined
    if(planUpgradeInstallation===write)planUpgradeInstallation=undefined
    write.removalGate?.close()
  }
}
function requireAuthorReader():MainInstallation<CMainV3AuthorReadAuthorities> {
  if(!authorReadInstallation)return refuse('INDEPENDENT_AUTHORITIES_NOT_INSTALLED')
  return authorReadInstallation
}
function requirePlanWriter():MainInstallation<CMainV3PlanUpgradeAuthorities> {
  if(!planUpgradeInstallation)return refuse('INDEPENDENT_AUTHORITIES_NOT_INSTALLED')
  return planUpgradeInstallation
}
function assertCurrentAuthorReader(installed:MainInstallation<CMainV3AuthorReadAuthorities>):void {
  if(authorReadInstallation!==installed)refuse('AUTHORITY_INSTALLATION_REVOKED')
}
function assertCurrentPlanWriter(installed:MainInstallation<CMainV3PlanUpgradeAuthorities>):void {
  if(planUpgradeInstallation!==installed)refuse('AUTHORITY_INSTALLATION_REVOKED')
}

/** Actual C0 verified live browser sender and stable per-frame identity. */
function liveFrame(event:IpcMainInvokeEvent):{
  principalId:string;sessionId:string;windowId:string;frameId:string;
} {
  assertC0ReviewMainSender(event)
  const main=getMainWindow()
  if(!main || main.isDestroyed()) return refuse('MAIN_WINDOW_CLOSED')
  const f=event.senderFrame
  if(!f || !Number.isSafeInteger(f.processId) || !Number.isSafeInteger(f.routingId)) {
    return refuse('PHYSICAL_FRAME_ID_MISSING')
  }
  return {
    principalId:'local-reviewer',
    sessionId:'local-main-webcontents:'+event.sender.id,
    windowId:'main-webcontents:'+main.webContents.id,
    frameId:f.processId+':'+f.routingId,
  }
}
function checkGrant(g:CMainV3Grant|undefined):CMainV3Grant {
  if(!g || !safe(g.ownerId) || !safe(g.authorityEpoch) ||
     !Number.isSafeInteger(g.generation) || g.generation<0) {
    return refuse('TRUSTED_GRANT_UNAVAILABLE')
  }
  return structuredClone(g)
}
function sameGrant(a:CMainV3Grant,b:CMainV3Grant):boolean {
  return a.ownerId===b.ownerId && a.generation===b.generation &&
    a.authorityEpoch===b.authorityEpoch
}
function liveAuthorIdentity(
  event:IpcMainInvokeEvent,templateId:string,
  installed:MainInstallation<CMainV3AuthorReadAuthorities>,
):CMainAuthorReadIdentity {
  assertCurrentAuthorReader(installed)
  const authority=installed.source
  const frame=liveFrame(event)
  const grant=checkGrant(authority.getAuthorGrant(templateId))
  return {
    ...frame,ownerId:grant.ownerId,ownerGeneration:grant.generation,
    authorityEpoch:grant.authorityEpoch,
  }
}
/** Only the real Electron handler, no anonymous caseId/path overload. */
export async function handleCMainAuthorLatestRead(
  event:IpcMainInvokeEvent,
  input:unknown,
) {
  liveFrame(event)
  if(!input || typeof input!=='object'||Array.isArray(input)) {
    return refuse('AUTHOR_REQUEST_INVALID')
  }
  if(own(input,'actor')||own(input,'principal')||own(input,'authorId')||
     own(input,'sourceIdentity')||own(input,'publication')) return refuse('RENDERER_CREDENTIAL_CLAIM')
  const data=input as Record<string,unknown>
  if(typeof data.templateId!=='string') return refuse('TEMPLATE_REQUIRED')
  const scope=data.templateId
  const expected=data.expectedRevision
  if(expected!==undefined&&(!Number.isSafeInteger(expected)||typeof expected!=='number')) {
    return refuse('EXPECTED_REVISION_INVALID')
  }
  const installed=requireAuthorReader()
  const authority=installed.source
  const port=new CMainTrustedAuthorRevisionRead({
    currentIdentity:()=>liveAuthorIdentity(event,scope,installed),
    canRead:(id,templateId)=>{
      const live=liveAuthorIdentity(event,templateId,installed)
      return id.principalId===live.principalId && id.sessionId===live.sessionId &&
        id.windowId===live.windowId&&id.frameId===live.frameId &&
        id.ownerId===live.ownerId&&id.ownerGeneration===live.ownerGeneration &&
        id.authorityEpoch===live.authorityEpoch &&
        authority.canReadAuthor(id.principalId,templateId,{
          ownerId:id.ownerId,generation:id.ownerGeneration,authorityEpoch:id.authorityEpoch,
        })
    },
    readLatestAuthorRevision:id=>authority.readLatestB1AuthorRevision(id),
  })
  return port.readLatestAuthorRevision(scope,expected as number|undefined)
}
/** Registered Electron Main handler. Renderer may request ONLY a template ID.
 * All candidate/Owner/frame/pin/archive identity is looked up independently.
 * Absent actual B20 and Main-native-picker wiring always rejects.
 */
export async function handleCMainB20CandidateRead(
  event:IpcMainInvokeEvent,input:unknown,
) {
  liveFrame(event)
  if(!input||typeof input!=='object'||Array.isArray(input)||
     Object.keys(input).length!==1||!own(input,'templateId'))
    return refuse('B20_RENDERER_CREDENTIAL_OR_SOURCE_CLAIM')
  const templateId=(input as {templateId:unknown}).templateId
  if(typeof templateId!=='string'||!/^[A-Za-z][A-Za-z0-9._-]{0,79}$/.test(templateId))
    return refuse('B20_TEMPLATE_ID_INVALID')
  const installed=b20ReadInstallation
  if(!installed)return refuse('B20_TRUSTED_SOURCE_NOT_INSTALLED')
  const source=installed.source
  const requireInstalled=()=>{
    if(b20ReadInstallation!==installed)refuse('B20_SOURCE_INSTALLATION_REVOKED')
  }
  const current=():CMainB20ReadIdentity|undefined=>{
    requireInstalled()
    const frame=liveFrame(event)
    const raw=source.currentCandidate(frame.principalId,templateId)
    if(!raw)return undefined
    assertSafeReviewStorageId(raw.caseCandidateId,'caseId')
    const grant=checkGrant(raw.grant)
    return {...frame,caseCandidateId:raw.caseCandidateId,
      ownerId:grant.ownerId,ownerGeneration:grant.generation,
      authorityEpoch:grant.authorityEpoch}
  }
  const reader=new CMainB20TrustedCandidateRead({
    currentIdentity:current,
    currentInstallationToken:()=>{requireInstalled();return installed.token},
    canRead:(identity,id)=>{
      requireInstalled()
      if(id!==templateId)return false
      const live=current()
      if(!live||JSON.stringify(live)!==JSON.stringify(identity))return false
      const grant=checkGrant(source.currentCandidate(live.principalId,id)?.grant)
      if(grant.ownerId!==identity.ownerId||grant.generation!==identity.ownerGeneration||
         grant.authorityEpoch!==identity.authorityEpoch)return false
      return source.canReadCandidate(live.principalId,id,identity.caseCandidateId,grant)
    },
    getPinnedExpectation:(identity,id)=>{
      requireInstalled()
      if(id!==templateId)return undefined
      return source.currentPinnedAuthor(identity.caseCandidateId,id)
    },
    readCurrentBundle:expected=>{
      requireInstalled()
      const physical=liveFrame(event)
      const frame=event.senderFrame
      const senderId=event.sender.id
      const frameId=frame?.routingId
      if(!frame||typeof senderId!=='number'||!Number.isSafeInteger(senderId)||senderId<0||
         typeof frameId!=='number'||!Number.isSafeInteger(frameId)||frameId<0 ||
         physical.frameId!==frame.processId+':'+frameId)
        return refuse('B20_NUMERIC_MAIN_FRAME_NOT_CURRENT')
      const identity=current()
      if(!identity)return refuse('B20_MAIN_CURRENT_SCOPE_LOST')
      return source.readCurrentB20Bundle(expected,identity,{senderId,frameId})
    },
  })
  return reader.read(templateId)
}
/**
 * Real Main native ZIP archive re-pick. Renderer may request only a template
 * plus an archive ID; selection/Owner/B Vault/source keys all come from Main.
 * No author/Case/Run/BusinessWriter mutation is performed.
 */
export async function handleCMainB20NativeArchiveRepick(
  event:IpcMainInvokeEvent,input:unknown,
) {
  const atStart=liveFrame(event)
  if(!input||typeof input!=='object'||Array.isArray(input)||
     Object.keys(input).length!==2||
     !own(input,'templateId')||!own(input,'archiveId'))
    return refuse('B20_REPICK_RENDERER_CREDENTIAL_OR_PATH_CLAIM')
  const data=input as {templateId:unknown;archiveId:unknown}
  if(typeof data.templateId!=='string'||
     !/^[A-Za-z][A-Za-z0-9._-]{0,79}$/.test(data.templateId)||
     typeof data.archiveId!=='string'||!/^[a-f0-9]{40}$/.test(data.archiveId))
    return refuse('B20_REPICK_TEMPLATE_OR_ARCHIVE_INVALID')
  const templateId=data.templateId, archiveId=data.archiveId
  const installed=b20ReadInstallation
  if(!installed)return refuse('B20_NATIVE_PICKER_NOT_INSTALLED')
  const src=installed.source
  const performRepick=src.repickNativeArchive
  if(typeof performRepick!=='function')return refuse('B20_NATIVE_PICKER_NOT_INSTALLED')
  const current=()=>{
    if(b20ReadInstallation!==installed)refuse('B20_SOURCE_INSTALLATION_REVOKED')
    const frame=liveFrame(event)
    if(JSON.stringify(atStart)!==JSON.stringify(frame))
      return refuse('B20_MAIN_PHYSICAL_FRAME_CHANGED')
    const registration=src.currentCandidate(frame.principalId,templateId)
    if(!registration)return refuse('B20_OWNER_CANDIDATE_NOT_CURRENT')
    const grant=checkGrant(registration.grant)
    if(!src.canReadCandidate(frame.principalId,templateId,
      registration.caseCandidateId,grant))
      return refuse('B20_REPICK_MAIN_ACL_REVOKED')
    const pin=src.currentPinnedAuthor(registration.caseCandidateId,templateId)
    if(!pin||pin.templateId!==templateId)
      return refuse('B20_CURRENT_AUTHOR_PIN_MISSING')
    return {
      id:{...frame,caseCandidateId:registration.caseCandidateId,
        ownerId:grant.ownerId,ownerGeneration:grant.generation,
        authorityEpoch:grant.authorityEpoch},
      pin:structuredClone(pin),
    }
  }
  const observed=current()
  const physical=event.senderFrame
  const numeric={senderId:event.sender.id,frameId:physical?.routingId}
  if(!physical||typeof numeric.senderId!=='number'||
     !Number.isSafeInteger(numeric.senderId)||numeric.senderId<0||
     typeof numeric.frameId!=='number'||!Number.isSafeInteger(numeric.frameId)||numeric.frameId<0)
    return refuse('B20_NATIVE_PICKER_NUMERIC_FRAME_MISSING')
  await performRepick(observed.pin,observed.id,
    {senderId:numeric.senderId,frameId:numeric.frameId},archiveId)
  if(JSON.stringify(current())!==JSON.stringify(observed))
    return refuse('B20_MAIN_REVOKED_DURING_NATIVE_PICK')
  return {
    schemaVersion:'review-v3-main-native-b20-repick/1',
    status:'picked-for-candidate-only',
    publicationAllowed:false,businessWriteAllowed:false,schoolPolicyVerified:false,
  } as const
}
export interface CMainV3UpgradeIntent {
  caseId:string
  requestId:string
  expectedRevision:number
  payload:{
    plan:CanonicalPlan
    previousFingerprint:string
    acknowledgement:string
    removalAck?:CMainUpgradeRemovalAck
  }
}
function assertCaseInput(input:unknown):CMainV3UpgradeIntent {
  if(!input||typeof input!=='object'||Array.isArray(input))return refuse('UPGRADE_INTENT_INVALID')
  for(const name of ['actor','principal','owner','publisher','sourceIdentity','schoolRole']) {
    if(own(input,name))return refuse('RENDERER_CREDENTIAL_CLAIM')
  }
  const c=input as Record<string,unknown>
  assertSafeReviewStorageId(c.caseId,'caseId')
  if(!safe(c.requestId)||!Number.isSafeInteger(c.expectedRevision)||Number(c.expectedRevision)<0||
     !c.payload||typeof c.payload!=='object'||Array.isArray(c.payload)) {
    return refuse('UPGRADE_CONTRACT_INVALID')
  }
  const payload=c.payload as Record<string,unknown>
  if(typeof payload.previousFingerprint!=='string'||typeof payload.acknowledgement!=='string'||
     !payload.plan||typeof payload.plan!=='object'||Array.isArray(payload.plan)||
     own(payload,'actor')||own(payload,'principal')||own(payload,'publication')) {
    return refuse('UPGRADE_PAYLOAD_INVALID')
  }
  return input as CMainV3UpgradeIntent
}
function actorOf(principal:string):Actor {
  return {actorId:principal,actorSource:'local',role:'reviewer'}
}
export async function handleCMainUpgradeCanonicalPlan(
  event:IpcMainInvokeEvent,input:unknown,
) {
  const atStart=liveFrame(event)
  const data=assertCaseInput(input)
  const installed=requirePlanWriter()
  const authority=installed.source
  const initial=checkGrant(authority.getCaseGrant(data.caseId))
  if(!authority.canUpgradeCase(atStart.principalId,data.caseId,initial))
    return refuse('CASE_UPGRADE_UNAUTHORIZED')
  const publisher=new C2MainPublishedPlanProvenance(authority.publishedPlanSource)
  const recheck=(aggregate:CaseAggregateV2):void=>{
    assertCurrentPlanWriter(installed)
    const now=liveFrame(event)
    const latest=checkGrant(authority.getCaseGrant(data.caseId))
    if(JSON.stringify(now)!==JSON.stringify(atStart)||
      !sameGrant(initial,latest)||
      aggregate.caseV2.id!==data.caseId||
      !authority.canUpgradeCase(now.principalId,data.caseId,latest)) {
      refuse('CASE_UPGRADE_REVOKED_AT_COMMIT')
    }
  }
  return upgradeCanonicalPlanV3(data.caseId,{
    requestId:data.requestId,expectedRevision:data.expectedRevision,
    actor:actorOf(atStart.principalId),payload:data.payload,
  },(plan,aggregate)=>{
    recheck(aggregate)
    publisher.assertPublishedPlanForCase(plan,aggregate)
    recheck(aggregate)
  },(aggregate,actor,ack,removed)=>{
    // C Case CAS is the ONLY point that may consume Main-observed consent.
    // The renderer-supplied acknowledgement is a proposed list, not consent.
    recheck(aggregate)
    if(actor.actorId!==atStart.principalId)refuse('ACTOR_CHANGED_AT_COMMIT')
    const now=liveFrame(event)
    const grant=checkGrant(authority.getCaseGrant(data.caseId))
    const removalGate=installed.removalGate
    if(!removalGate)throw new Error('C_MAIN_V3_IPC_HUMAN_REMOVAL_OBSERVER_NOT_INSTALLED')
    const observedCtx={
      caseId:data.caseId,requestId:data.requestId,
      currentCaseRevision:aggregate.caseV2.revision,
      identity:{...now,ownerId:grant.ownerId,ownerGeneration:grant.generation,
        authorityEpoch:grant.authorityEpoch},
      acknowledgement:ack,computedRemovedIdentities:removed,
      reason:data.payload.acknowledgement,
    }
    // Called INSIDE the serialized Case CAS with the REAL computed removals.
    // The Main-owned native OS dialog is independent of Renderer ACK.
    // No native confirmation or observed physical source => fail closed.
    authority.removalConsentSource?.observeAtCommit?.(observedCtx)
    recheck(aggregate)
    removalGate.consumeAtCommit(observedCtx)
    recheck(aggregate)
  })
}

/** Actual Main hook registered unconditionally; missing authorities deny. */
export function registerCMainV3AuthorPlanIpc():void {
  ipcMain.handle(REVIEW_IPC_CHANNELS.AUTHOR_READ_LATEST_V3,handleCMainAuthorLatestRead)
  ipcMain.handle(REVIEW_IPC_CHANNELS.B20_CANDIDATE_READ_V3,handleCMainB20CandidateRead)
  ipcMain.handle(REVIEW_IPC_CHANNELS.B20_NATIVE_REPICK_V3,handleCMainB20NativeArchiveRepick)
  ipcMain.handle(REVIEW_IPC_CHANNELS.UPGRADE_CANONICAL_PLAN_V3,handleCMainUpgradeCanonicalPlan)
}
