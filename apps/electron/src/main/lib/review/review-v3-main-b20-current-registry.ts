/**
 * C-R10 privileged Main current B20 candidate registry.
 * Single ephemeral SOURCE SELECTION cache, NOT a second Case, SourceLedger,
 * B1 author store, B2 archive Vault, Run, School policy, or publisher.
 *
 * C's Main host must supply an independently authenticated live Owner/frame
 * and original physical ZIP capability, never Renderer input. No default
 * local Principal is minted here. Cold PID starts with no registered sources.
 */
import {
  readB1AuthorRevision, readB1FrozenCandidate,
} from './review-template-author-store-v3-b1'
import {
  verifyReviewB1Descriptor,
} from './review-template-plan-adapter-v3-b1'
import {
  ReviewB2StagingService,type B2MainContext,
} from './review-intake-adapter-v3-b2'
import {ReviewB2SourceVersionAdapter} from './review-source-version-adapter-v3-b2'
import {ReviewB2ArchiveVault} from './review-import-checkpoint-v3-b2'
import {ReviewB2InputLedger} from './review-import-ledger-v3-b2'
import type {
  B20MainReadScope, B20ReadOnlySources,B20ReadAuthorExpectation,
} from './review-v3-b1-b2-main-read-bundle-v3-b'
import type {B19SourceSelection} from './review-v3-b1-b2-candidate-source-bridge'
import type {
  CMainB20ReadIdentity,CMainB20PinnedExpectation,
} from './review-v3-main-b20-trusted-candidate-read'
import type {CMainV3Grant} from './review-v3-main-author-plan-ipc'
import {
  CMainNativeArchiveRegistry,createCMainElectronNativeArchiveChooser,
  type CMainPhysicalArchiveScope,
} from './review-v3-main-native-archive-registry'
import {
  installCMainV3PhysicalB20Sources,
  type CMainB20PhysicalSources,
} from './review-v3-main-b20-physical-composition'

const reject=(x:string):never=>{throw new Error('C_MAIN_B20_CURRENT_'+x)}
const idOK=(x:unknown):x is string=>typeof x==='string'&&
  /^[A-Za-z][A-Za-z0-9._-]{0,79}$/.test(x)
const caseOK=(x:unknown):x is string=>typeof x==='string'&&
  /^[A-Za-z0-9._:-]{1,128}$/.test(x)
const digest=/^[a-f0-9]{64}$/
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b)
/** The physical frame and authenticated owner have ordered-independent fields.
 * JSON object key insertion order is not an identity property. */
const sameIdentity=(a:CMainB20ReadIdentity,b:CMainPhysicalArchiveScope):boolean=>
  a.principalId===b.principalId&&a.sessionId===b.sessionId&&
  a.windowId===b.windowId&&a.frameId===b.frameId&&
  a.caseCandidateId===b.caseCandidateId&&a.ownerId===b.ownerId&&
  a.ownerGeneration===b.ownerGeneration&&a.authorityEpoch===b.authorityEpoch

export interface CMainB20PhysicalHost {
  /**
   * Current physical Main scope+Owner selected for EXACT template.
   * This is an authenticated Main fact, not a B or Renderer claim.
   * Absent means no current candidate or permission.
   */
  current(templateId:string):{
    identity:CMainB20ReadIdentity
    grant:CMainV3Grant
    numeric:{senderId:number;frameId:number}
  }|undefined
  /** Independent real Main permission check; re-run on every operation. */
  mayRead(identity:CMainB20ReadIdentity,templateId:string):boolean
  /** Actual currently selected Main frame/candidate for native OS picker. */
  currentNativeScope():CMainPhysicalArchiveScope|undefined
  /** Opaque original ZIP key issued at initial native Main import, NOT IPC. */
  mainIssuedPhysicalKey(id:CMainB20ReadIdentity,archiveId:string):string|null
  /** OS picker injectable for real native Electron and isolated disk tests. */
  nativePickZipPath?:()=>string|undefined
}
export interface CMainB20Registration {
  templateId:string
  caseCandidateId:string
  expected:CMainB20PinnedExpectation
  selections:readonly B19SourceSelection[]
}
interface Registered {
  readonly identity:CMainB20ReadIdentity
  readonly grant:CMainV3Grant
  readonly expected:CMainB20PinnedExpectation
  readonly selections:readonly B19SourceSelection[]
}
export class CMainB20CurrentRegistry implements CMainB20PhysicalSources {
  readonly bSources:B20ReadOnlySources
  readonly nativePicker:CMainNativeArchiveRegistry
  private readonly registered=new Map<string,Registered>()
  private closed=false
  private installed?:()=>void
  constructor(private readonly host:CMainB20PhysicalHost,
    sources?:B20ReadOnlySources){
    if(!host||typeof host.current!=='function'||
       typeof host.mayRead!=='function'||typeof host.currentNativeScope!=='function'||
       typeof host.mainIssuedPhysicalKey!=='function')
      reject('PHYSICAL_MAIN_OWNER_AND_PICKER_AUTH_REQUIRED')
    if(sources){
      this.bSources=sources
    }else{
      const staging=new ReviewB2StagingService()
      const vault=new ReviewB2ArchiveVault(staging)
      this.bSources={
        staging,parser:new ReviewB2SourceVersionAdapter(staging),
        vault,ledger:new ReviewB2InputLedger(vault,staging),
      }
    }
    this.nativePicker=new CMainNativeArchiveRegistry({
      currentScope:()=>this.host.currentNativeScope(),
      assertCurrentArchive:(scope,expected)=>{
        if(this.closed)reject('REGISTRY_CLOSED')
        const current=this.assertCurrent(scope.caseCandidateId)
        if(!current||!sameIdentity(current.identity,scope))
          return reject('PHYSICAL_MAIN_ARCHIVE_SCOPE_REVOKED')
        const numeric=this.host.current(current.expected.templateId)?.numeric
        if(!numeric)return reject('NUMERIC_MAIN_SCOPE_ABSENT')
        const bctx:B2MainContext={
          senderId:numeric.senderId,frameId:numeric.frameId,
          ownerId:scope.ownerId,ownerGeneration:scope.ownerGeneration,
          caseCandidateId:scope.caseCandidateId,
        }
        const checkpoint=this.bSources.vault.inspect(bctx,expected.archiveId)
        if(checkpoint.archiveSha256!==expected.archiveSha256||
           checkpoint.byteLength!==expected.archiveByteLength)
          reject('B_VAULT_ORIGINAL_CHANGED')
      },
      pickZipPath:host.nativePickZipPath??createCMainElectronNativeArchiveChooser(),
    })
  }
  private requireOpen():void {if(this.closed)reject('REGISTRY_CLOSED')}
  private currentRegistration(templateId:string):Registered|undefined {
    this.requireOpen()
    const registered=this.registered.get(templateId)
    if(!registered)return undefined
    const now=this.host.current(templateId)
    if(!now||!sameIdentity(now.identity,registered.identity)||
       !same(now.grant,registered.grant)||
       !this.host.mayRead(now.identity,templateId))return undefined
    return registered
  }
  private assertCurrent(caseCandidateId:string):Registered|undefined {
    this.requireOpen()
    for(const [templateId,item] of this.registered){
      if(item.identity.caseCandidateId===caseCandidateId)
        return this.currentRegistration(templateId)
    }
    return undefined
  }
  /**
   * Called only by privileged Main after B2 actual physical staging and
   * B1 saved/frozen author generation. Never expose as arbitrary IPC.
   */
  registerFromTrustedMain(input:CMainB20Registration):void {
    this.requireOpen()
    if(!idOK(input?.templateId)||!caseOK(input.caseCandidateId)||
       !input.expected||input.expected.templateId!==input.templateId||
       !Number.isSafeInteger(input.expected.revision)||input.expected.revision<1||
       !digest.test(input.expected.revisionDigest)||
       !digest.test(input.expected.frozenFingerprint)||
       !Array.isArray(input.selections)||
       input.selections.length>4096)
      reject('CURRENT_CANDIDATE_REGISTRATION_INVALID')
    if(this.registered.has(input.templateId))
      reject('REGISTRATION_EXISTS_REVOKE_FIRST')
    const actual=this.host.current(input.templateId)
    if(!actual||actual.identity.caseCandidateId!==input.caseCandidateId||
       actual.grant.ownerId!==actual.identity.ownerId||
       actual.grant.generation!==actual.identity.ownerGeneration||
       actual.grant.authorityEpoch!==actual.identity.authorityEpoch||
       !this.host.mayRead(actual.identity,input.templateId))
      return reject('CURRENT_MAIN_GRANT_NOT_INSTALLED')
    const latest=readB1AuthorRevision(input.templateId)
    const frozen=readB1FrozenCandidate(input.templateId,input.expected.frozenFingerprint)
    if(!latest||!frozen||latest.revision!==input.expected.revision||
       latest.digest!==input.expected.revisionDigest||
       frozen.revision!==latest.revision||
       frozen.descriptor.canonicalPlan.fingerprint!==input.expected.frozenFingerprint||
       frozen.status!=='candidate-held')
      return reject('REAL_B1_FROZEN_CURRENT_SOURCE_REQUIRED')
    verifyReviewB1Descriptor(latest.document,frozen.descriptor)
    const bctx:B2MainContext={
      senderId:actual.numeric.senderId,frameId:actual.numeric.frameId,
      caseCandidateId:input.caseCandidateId,ownerId:actual.grant.ownerId,
      ownerGeneration:actual.grant.generation,
    }
    this.bSources.staging.assertStillGranted(bctx)
    const expectedBindings=new Set(frozen.descriptor.bindingDetails.flatMap(b=>
      b.sourceIds.map(sourceId=>JSON.stringify([b.checkKey,b.targetKey,sourceId]))))
    const used=new Set<string>()
    for(const choice of input.selections){
      if(!choice || typeof choice.checkKey!=='string'||
         typeof choice.targetKey!=='string'||typeof choice.sourceId!=='string'||
         typeof choice.candidateId!=='string'||typeof choice.parseRevision!=='string'||
         typeof choice.blockId!=='string'||
         !['application','supporting'].includes(choice.requiredRole))
        reject('B19_SELECTION_INCOMPLETE')
      const k=JSON.stringify([choice.checkKey,choice.targetKey,choice.sourceId])
      if(!expectedBindings.has(k)||used.has(k))
        reject('B19_SELECTION_NOT_IN_FROZEN_AUTHOR')
      used.add(k)
      this.bSources.staging.getCandidate(bctx,choice.candidateId)
      if(choice.archiveId!==undefined)
        this.bSources.vault.inspect(bctx,choice.archiveId)
    }
    const fresh=this.host.current(input.templateId)
    if(!fresh||!sameIdentity(fresh.identity,actual.identity)||
       !same(fresh.grant,actual.grant)||!same(fresh.numeric,actual.numeric)||
       !this.host.mayRead(actual.identity,input.templateId))
      return reject('MAIN_SCOPE_CHANGED_DURING_REGISTRATION')
    this.registered.set(input.templateId,{
      identity:structuredClone(actual.identity),
      grant:structuredClone(actual.grant),
      expected:structuredClone(input.expected),
      selections:structuredClone(input.selections),
    })
  }
  currentCandidate(principalId:string,templateId:string):
    {caseCandidateId:string;grant:CMainV3Grant}|undefined {
    const current=this.currentRegistration(templateId)
    if(!current||current.identity.principalId!==principalId)return undefined
    return {caseCandidateId:current.identity.caseCandidateId,
      grant:structuredClone(current.grant)}
  }
  canReadCandidate(principalId:string,templateId:string,
    caseCandidateId:string,grant:CMainV3Grant):boolean {
    const current=this.currentRegistration(templateId)
    return !!current&&current.identity.principalId===principalId&&
      current.identity.caseCandidateId===caseCandidateId&&
      same(current.grant,grant)
  }
  currentPinnedAuthor(caseCandidateId:string,templateId:string):
    CMainB20PinnedExpectation|undefined {
    const current=this.currentRegistration(templateId)
    if(!current||current.identity.caseCandidateId!==caseCandidateId)return undefined
    return structuredClone(current.expected)
  }
  currentSelections(scope:Readonly<B20MainReadScope>,
    author:Readonly<B20ReadAuthorExpectation>):readonly B19SourceSelection[]|null {
    this.requireOpen()
    const current=this.currentRegistration(author.templateId)
    if(!current||current.identity.ownerId!==scope.ownerId||
       current.identity.ownerGeneration!==scope.ownerGeneration||
       current.identity.caseCandidateId!==scope.caseCandidateId||
       current.identity.principalId!==scope.principalId||
       current.identity.sessionId!==scope.sessionId||
       !same(current.expected,author))return null
    return structuredClone(current.selections)
  }
  currentMainIssuedOriginalKey(id:Readonly<CMainB20ReadIdentity>,
    archiveId:string,bScope:Readonly<B20MainReadScope>):string|null {
    this.requireOpen()
    const registration=this.assertCurrent(id.caseCandidateId)
    if(!registration||!sameIdentity(registration.identity,id)||
       registration.identity.ownerId!==bScope.ownerId||
       registration.identity.ownerGeneration!==bScope.ownerGeneration)
      return null
    const key=this.host.mainIssuedPhysicalKey(registration.identity,archiveId)
    return typeof key==='string'&&key.length>0&&key.length<=256?key:null
  }
  assertLiveCMainIdentity(identity:CMainB20ReadIdentity):void {
    const current=this.assertCurrent(identity.caseCandidateId)
    if(!current||!sameIdentity(current.identity,identity))
      reject('C_MAIN_PRINCIPAL_FRAME_OR_OWNER_REVOKED')
  }
  install():()=>void {
    this.requireOpen()
    if(this.installed)reject('ALREADY_INSTALLED')
    const dispose=installCMainV3PhysicalB20Sources(this)
    this.installed=dispose
    return ()=>{
      if(this.installed===dispose){this.installed=undefined;dispose()}
    }
  }
  revoke(templateId:string):void {
    this.requireOpen()
    this.registered.delete(templateId)
    this.nativePicker.revoke()
  }
  close():void {
    if(this.closed)return
    this.installed?.()
    this.installed=undefined
    this.registered.clear()
    this.nativePicker.close()
    this.closed=true
  }
}
