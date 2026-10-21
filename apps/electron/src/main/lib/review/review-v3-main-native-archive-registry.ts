/**
 * C-MAIN-PICKER-R01: native physical ZIP re-selection for B20 candidate reads.
 * This is a Main-scoped, process-local PHYSICAL FILE capability, never a
 * second B2 ZIP ArchiveVault/InputLedger or a candidate SourceIdentity.
 *
 * The independently authorized B2 ArchiveVault owns archive IDs and current
 * content semantics; this registry only proves an OS user actually selected
 * the same still-existing regular file, bound to an authenticated Main scope.
 * No Renderer-supplied path/key/actor is accepted or returned to Renderer.
 * A cold Main process has ZERO reusable picker grants.
 */
import {randomUUID,createHash} from 'node:crypto'
import {constants,openSync,closeSync,fstatSync,lstatSync,readFileSync,realpathSync} from 'node:fs'
import type {Stats} from 'node:fs'
import {dialog} from 'electron'
import {getMainWindow} from '../main-window-state'

export interface CMainPhysicalArchiveScope {
  readonly principalId:string
  readonly sessionId:string
  readonly windowId:string
  readonly frameId:string
  readonly ownerId:string
  readonly ownerGeneration:number
  readonly authorityEpoch:string
  readonly caseCandidateId:string
}
export interface CMainNativeArchiveExpectation {
  /** B Vault-verified archive ID, never a Renderer-selected string. */
  readonly archiveId:string
  /** B Vault-verified SHA256 of current physically persisted ZIP. */
  readonly archiveSha256:string
  readonly archiveByteLength:number
}
export interface CMainNativeArchiveAuthorities {
  currentScope():CMainPhysicalArchiveScope|undefined
  /** Independent C permission + B Vault read-only validity, repeated on each lookup. */
  assertCurrentArchive(scope:CMainPhysicalArchiveScope,expected:CMainNativeArchiveExpectation):void
  /** OS-owned picker; injected only by privileged Main composition. */
  pickZipPath():string|undefined
}
interface PhysicalRecord {
  readonly scope:CMainPhysicalArchiveScope
  readonly expected:CMainNativeArchiveExpectation
  readonly path:string
  readonly dev:number
  readonly ino:number
  readonly nativeKey:string
}
const MAX_BYTES=100*1024*1024
const MAX_RECORDS=128
const sha=/^[a-f0-9]{64}$/
const safe=(v:unknown):v is string=>
  typeof v==='string'&&v.length>0&&v.length<=256&&v.trim()===v
const refuse=(reason:string):never=>{throw new Error('C_MAIN_NATIVE_ARCHIVE_'+reason)}
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b)
const idOf=(s:CMainPhysicalArchiveScope,x:CMainNativeArchiveExpectation)=>
  JSON.stringify([s.caseCandidateId,s.ownerId,s.ownerGeneration,x.archiveId])
function validateScope(s:CMainPhysicalArchiveScope|undefined):CMainPhysicalArchiveScope {
  if(!s||![s.principalId,s.sessionId,s.windowId,s.frameId,
        s.ownerId,s.authorityEpoch,s.caseCandidateId].every(safe)||
     !Number.isSafeInteger(s.ownerGeneration)||s.ownerGeneration<0)
    return refuse('AUTHENTICATED_MAIN_SCOPE_REQUIRED')
  return structuredClone(s)
}
function validateArchive(e:CMainNativeArchiveExpectation):CMainNativeArchiveExpectation {
  if(!e||!safe(e.archiveId)||!sha.test(e.archiveSha256)||
     !Number.isSafeInteger(e.archiveByteLength)||e.archiveByteLength<1||
     e.archiveByteLength>MAX_BYTES)refuse('VAULT_EXACT_ORIGINAL_REQUIRED')
  return structuredClone(e)
}
function physicalRead(filePath:string):{bytesSha:string;size:number;dev:number;ino:number;path:string} {
  if(typeof filePath!=='string'||!filePath||filePath.includes('\0'))
    refuse('OS_PATH_INVALID')
  // Only a trusted native chooser can supply filePath, never IPC. Even then
  // reject symbolic links, non-files, hard links and source swaps mid-read.
  let fd:number|undefined
  try {
    const before=lstatSync(filePath)
    if(!before.isFile()||before.isSymbolicLink()||before.nlink!==1||
       before.size<1||before.size>MAX_BYTES)refuse('REGULAR_UNLINKED_ZIP_REQUIRED')
    fd=openSync(filePath,constants.O_RDONLY | (constants.O_NOFOLLOW??0))
    const opened=fstatSync(fd)
    if(!opened.isFile()||opened.nlink!==1||opened.dev!==before.dev||
       opened.ino!==before.ino||opened.size!==before.size)refuse('ORIGINAL_REPLACED')
    const bytes=readFileSync(fd)
    const after=fstatSync(fd)
    const pathAfter=lstatSync(filePath)
    if(after.dev!==opened.dev||after.ino!==opened.ino||
       after.size!==opened.size||bytes.length!==opened.size||
       pathAfter.dev!==opened.dev||pathAfter.ino!==opened.ino||
       pathAfter.size!==opened.size||pathAfter.nlink!==1||
       pathAfter.isSymbolicLink())refuse('ORIGINAL_CHANGED_DURING_READ')
    const real=realpathSync(filePath)
    return {bytesSha:createHash('sha256').update(bytes).digest('hex'),
      size:bytes.length,dev:opened.dev,ino:opened.ino,path:real}
  }catch(e){
    if(e instanceof Error&&e.message.startsWith('C_MAIN_NATIVE_ARCHIVE_'))throw e
    return refuse('OS_ORIGINAL_UNAVAILABLE')
  }finally{if(fd!==undefined)closeSync(fd)}
}

/** Scoped native ZIP witness. Can only be installed in trusted Main runtime. */
export class CMainNativeArchiveRegistry {
  private closed=false
  private readonly entries=new Map<string,PhysicalRecord>()
  constructor(private readonly source:CMainNativeArchiveAuthorities) {
    if(!source||typeof source.currentScope!=='function'||
       typeof source.assertCurrentArchive!=='function'||
       typeof source.pickZipPath!=='function')refuse('INDEPENDENT_MAIN_AND_B_VAULT_REQUIRED')
  }
  /**
   * Bind an independently Main-held B2 Vault physical key to a fresh actual
   * OS ZIP selection. Never derive this key from filename, archiveId or IPC.
   * B Vault's sealed checkpoint must supply its physicalArchiveKeyDigest.
   * Previous pick() is only a new transient key and cannot claim B's bytes.
   */
  pickForBVault(expectedValue:CMainNativeArchiveExpectation,
    previouslyMainIssuedKey:string, checkpointKeyDigest:string):void {
    if(!safe(previouslyMainIssuedKey)||
       !sha.test(checkpointKeyDigest)||
       createHash('sha256').update(previouslyMainIssuedKey).digest('hex')!==checkpointKeyDigest)
      return refuse('B_VAULT_PHYSICAL_ORIGIN_KEY_INVALID')
    this.pickPhysical(expectedValue,previouslyMainIssuedKey)
  }
  /** Generic new Main physical witness, NOT a B Vault confirmation. */
  pick(expectedValue:CMainNativeArchiveExpectation):void {
    this.pickPhysical(expectedValue,randomUUID())
  }
  /** The OS picker is the only physical path authority. */
  private pickPhysical(expectedValue:CMainNativeArchiveExpectation,
    nativeKey:string):void {
    if(this.closed)refuse('REGISTRY_CLOSED')
    const expected=validateArchive(expectedValue)
    const initial=validateScope(this.source.currentScope())
    this.source.assertCurrentArchive(initial,expected)
    const picked=this.source.pickZipPath()
    if(!picked)return refuse('USER_DID_NOT_SELECT_ORIGINAL')
    const disk=physicalRead(picked)
    if(disk.bytesSha!==expected.archiveSha256||
       disk.size!==expected.archiveByteLength)refuse('PICKED_DIFFERENT_PHYSICAL_ORIGINAL')
    const now=validateScope(this.source.currentScope())
    if(!same(initial,now))refuse('MAIN_OWNER_OR_FRAME_CHANGED_AFTER_PICK')
    this.source.assertCurrentArchive(now,expected)
    if(this.entries.size>=MAX_RECORDS)refuse('PICKER_CAPACITY_CLOSED')
    const index=idOf(initial,expected)
    // Same archiveId cannot be repointed by a new click while a privileged
    // reader might hold an earlier private archive key. Revoke first.
    if(this.entries.has(index))refuse('ARCHIVE_ALREADY_REGISTERED')
    this.entries.set(index,{scope:initial,expected,path:disk.path,
      dev:disk.dev,ino:disk.ino,nativeKey})
  }
  /** Main-only internal key; B ZIP Vault must verify digest in its own ledger. */
  resolveNativeArchiveKey(expectedValue:CMainNativeArchiveExpectation):string {
    if(this.closed)refuse('REGISTRY_CLOSED')
    const expected=validateArchive(expectedValue)
    const current=validateScope(this.source.currentScope())
    this.source.assertCurrentArchive(current,expected)
    const record=this.entries.get(idOf(current,expected))
    if(!record||!same(record.scope,current)||!same(record.expected,expected))
      return refuse('CURRENT_NATIVE_REPICK_REQUIRED')
    const disk=physicalRead(record.path)
    if(disk.dev!==record.dev||disk.ino!==record.ino||
       disk.path!==record.path||disk.bytesSha!==expected.archiveSha256||
       disk.size!==expected.archiveByteLength)refuse('PHYSICAL_ORIGINAL_REPLACED')
    const after=validateScope(this.source.currentScope())
    if(!same(after,current))refuse('MAIN_OWNER_OR_FRAME_CHANGED_AFTER_READ')
    this.source.assertCurrentArchive(after,expected)
    return record.nativeKey
  }
  revoke():void {this.entries.clear()}
  close():void {this.closed=true;this.revoke()}
}
/** Actual OS window and picker, never a Renderer path or helper IPC. */
export function createCMainElectronNativeArchiveChooser():()=>string|undefined {
  return ()=>{
    const main=getMainWindow()
    if(!main||main.isDestroyed()||main.webContents.isDestroyed())return undefined
    const selected=dialog.showOpenDialogSync(main,{
      title:'重新选择审核 ZIP 原件（需要重新核验来源）',
      properties:['openFile'],
      filters:[{name:'ZIP 原件',extensions:['zip']}],
    })
    return selected?.length===1?selected[0]:undefined
  }
}
