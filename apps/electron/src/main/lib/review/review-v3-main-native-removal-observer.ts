/**
 * C-MAIN-HUMAN-R02: a real privileged Electron Main native modal for deleting
 * canonical Plan obligations. It is never an IPC or Renderer confirmation.
 *
 * A synchronous modal is intentionally invoked from the existing serialized
 * Case CAS callback, AFTER issuer/actor/Owner revalidation and AFTER Main has
 * recomputed the exact Check×target×object×subject×versions removed list.
 * Cancel, window loss, too much text or unparseable identity always DENY.
 * A successful modal still requires the separate one-use CMainRemovalConsentGate.
 *
 * The caller must explicitly install this as removalConsentSource alongside
 * its *independently authorized* school publisher; no fake issuer is created.
 */
import { randomUUID } from 'node:crypto'
import { dialog } from 'electron'
import { getMainWindow } from '../main-window-state'
import {
  type CMainRemovalCommitContext, type CMainRemovalObservedConsent,
  type CMainRemovalWitnessSource,
} from './review-v3-main-removal-consent'

export interface CMainNativeRemovalPrompt {
  readonly title: string
  readonly message: string
  readonly detail: string
  readonly buttonCancel: string
  readonly buttonConfirm: string
}
export type CMainNativeRemovalDecision = (prompt: CMainNativeRemovalPrompt) => boolean

const LIMIT = 4096
const MAX_DETAIL = 16000
const refuse=(reason:string):never=>{throw new Error('C_MAIN_NATIVE_REMOVAL_'+reason)}
const safe=(v:unknown):v is string=>
  typeof v==='string'&&v.length>0&&v.length<=256&&v.trim()===v
const sha=(v:unknown):v is string=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v)
const key=(caseId:string,requestId:string)=>JSON.stringify([caseId,requestId])

/**
 * Main-owner local human-observation ledger; NOT durable across PID changes.
 * The authoritative CAS Receipt / one-use consent ID is persisted separately,
 * and a cold process must require a fresh human confirmation.
 */
export class CMainNativeRemovalObserver implements CMainRemovalWitnessSource {
  private readonly seen=new Set<string>()
  private readonly approvals=new Map<string,CMainRemovalObservedConsent>()
  private closed=false
  private observing=false
  constructor(private readonly physicalConfirm:CMainNativeRemovalDecision) {
    if(typeof physicalConfirm!=='function')refuse('NATIVE_DIALOG_MISSING')
  }
  observeAtCommit(ctx:CMainRemovalCommitContext):void {
    if(this.closed||this.observing)refuse('CLOSED_OR_REENTRANT')
    const id=ctx?.identity
    if(!ctx||!id||!safe(ctx.caseId)||!safe(ctx.requestId)||
      !Number.isSafeInteger(ctx.currentCaseRevision)||ctx.currentCaseRevision<0||
      !safe(id.principalId)||!safe(id.sessionId)||!safe(id.windowId)||
      !safe(id.frameId)||!safe(id.ownerId)||!safe(id.authorityEpoch)||
      !Number.isSafeInteger(id.ownerGeneration)||id.ownerGeneration<0||
      !safe(ctx.reason)||!sha(ctx.acknowledgement?.previousFingerprint)||
      !sha(ctx.acknowledgement?.nextFingerprint)||
      !Array.isArray(ctx.computedRemovedIdentities)||
      ctx.computedRemovedIdentities.length===0||
      !Array.isArray(ctx.acknowledgement.acknowledgedRemovedIdentities)||
      ctx.acknowledgement.acknowledgedRemovedIdentities.length!==
        ctx.computedRemovedIdentities.length||
      ctx.computedRemovedIdentities.some((s,i)=>
        typeof s!=='string'||s!==ctx.acknowledgement.acknowledgedRemovedIdentities[i])) {
      refuse('COMPLETE_CURRENT_CAS_OBLIGATION_REQUIRED')
    }
    const k=key(ctx.caseId,ctx.requestId)
    if(this.seen.has(k)||this.seen.size>=LIMIT)refuse('REQUEST_REUSED_OR_CAPACITY')
    // Mark BEFORE showing the OS modal. A failed attempt never turns into an
    // automatic second approval; the caller must issue a new request ID.
    this.seen.add(k)
    const pretty:string[]=[]
    for(const s of ctx.computedRemovedIdentities) {
      let parsed:unknown
      try { parsed=JSON.parse(s) }catch { refuse('OBLIGATION_ID_INVALID') }
      if(!Array.isArray(parsed)||parsed.length!==5||
         !parsed.slice(0,4).every(v=>typeof v==='string')||
         !Array.isArray(parsed[4])||
         !parsed[4].every(v=>typeof v==='string'))refuse('OBLIGATION_ID_INVALID')
      pretty.push(s)
    }
    const detail=[
      '案卷 ID：'+ctx.caseId,
      '操作者：'+id.principalId+' / Owner '+id.ownerId,
      '当前修订：'+ctx.currentCaseRevision,
      '原 Plan SHA256：'+ctx.acknowledgement.previousFingerprint,
      '新 Plan SHA256：'+ctx.acknowledgement.nextFingerprint,
      '删除的完整 Check × target × object × subject × sourceVersionSet：',
      ...pretty.map((v,i)=>(i+1)+'. '+v),
      '确认理由：'+ctx.reason,
      '此操作将更新案卷正式 Plan。旧版 Plan 仍保存在历史记录。',
    ].join('\n')
    if(detail.length>MAX_DETAIL)refuse('FULL_OBLIGATION_LIST_TOO_LARGE_TO_SHOW')
    let granted=false
    this.observing=true
    try {
      granted=this.physicalConfirm({
        title:'审核义务删除确认',
        message:'即将删除 '+pretty.length+' 项完整审核义务。请逐项检查下方差异。',
        detail,buttonCancel:'取消（不修改）',buttonConfirm:'确认删除这些义务',
      })===true
    } finally {
      this.observing=false
    }
    if(!granted)refuse('HUMAN_CANCELLED')
    const entry:CMainRemovalObservedConsent={
      schemaVersion:'review-v3-main-human-removal-consent/1',
      approvalId:randomUUID(),
      caseId:ctx.caseId,requestId:ctx.requestId,
      expectedRevision:ctx.currentCaseRevision,
      principalId:id.principalId,sessionId:id.sessionId,
      windowId:id.windowId,frameId:id.frameId,
      ownerId:id.ownerId,ownerGeneration:id.ownerGeneration,
      authorityEpoch:id.authorityEpoch,
      previousFingerprint:ctx.acknowledgement.previousFingerprint,
      nextFingerprint:ctx.acknowledgement.nextFingerprint,
      acknowledgedRemovedIdentities:[...ctx.computedRemovedIdentities],
      reason:ctx.reason,observedAtMs:Date.now(),
    }
    this.approvals.set(k,entry)
  }
  getObservedMainHumanConsent(caseId:string,requestId:string):
    CMainRemovalObservedConsent|undefined {
    if(this.closed)return undefined
    const e=this.approvals.get(key(caseId,requestId))
    return e&&structuredClone(e)
  }
  close():void {
    this.closed=true
    this.approvals.clear()
    // Keep seen keys until object dies; re-installing this exact source will
    // never resurrect a previously shown native approval or cancelled request.
  }
}

/** Actual OS-native Electron Main observer. NO Renderer or IPC registration. */
export function createCMainElectronRemovalObserver():CMainNativeRemovalObserver {
  return new CMainNativeRemovalObserver(prompt=>{
    const win=getMainWindow()
    if(!win||win.isDestroyed()||win.webContents.isDestroyed())return false
    const result=dialog.showMessageBoxSync(win,{
      type:'warning',
      title:prompt.title,
      message:prompt.message,
      detail:prompt.detail,
      buttons:[prompt.buttonCancel,prompt.buttonConfirm],
      defaultId:0,
      cancelId:0,
      noLink:true,
    })
    return result===1
  })
}
