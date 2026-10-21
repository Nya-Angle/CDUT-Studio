/**
 * Dev-A A4: durable technical dispatch fence before calling an SDK Provider.
 *
 * The callback's eventual receipt is not a business ACK. A process death or
 * unknown Provider outcome leaves an IN-FLIGHT intent, deliberately blocking
 * same-attempt redispatch until a separately authorized recovery decision.
 * This journal is neither ReviewRun nor C's transaction/outbox authority.
 */
import {createHash, randomUUID} from 'node:crypto'
import {
  assertC0RunEvidenceIdentity, C0ContractError,
  type RunEvidenceIdentity,
} from '@profer/shared'
import type {
  OwnerPersistence, V3ReviewOwnerAdapter, V3OwnerLease,
} from './review-pi-owner-adapter'
import type {V3ReviewToolCall} from './review-execution-event-adapter'

/** Scoped technical receipt chain. NEVER C2MainPhysicalHostReceipt. */
export interface V3ATechnicalDispatchWitness {
  readonly dispatchId:string
  readonly grantId:string
  readonly caseId:string|undefined
  readonly sessionId:string|undefined
  readonly state:'in-flight'|'settled'|'late-denied'
  readonly technicalReceiptId:string|undefined
}
interface SDKDispatchRecord {
  id: string
  grantId: string
  /** New claims pin Case and Owner session. Old records lack scope and are quarantined globally while unresolved. */
  caseId?: string
  sessionId?: string
  state: 'in-flight' | 'settled' | 'late-denied'
  /** Main-only SDK receipt; a technical observation, never a C Run ACK. */
  receiptId?: string
}
interface SDKDispatchChain {
  runHash: string
  records: SDKDispatchRecord[]
}
interface SDKDispatchDisk {
  version: 'v3-dev-a-sdk-dispatch/1'
  runs: Record<string, SDKDispatchChain>
}
const hash=(s:string)=>createHash('sha256').update(s).digest('hex')
const key=(run:RunEvidenceIdentity)=>
  JSON.stringify([run.runId,run.attemptId,run.ownerGeneration])
const reject=(s:string):never=>{throw new C0ContractError('RECOVERY_REQUIRED',s)}
const initial=():SDKDispatchDisk=>({version:'v3-dev-a-sdk-dispatch/1',runs:{}})
function decode(raw:string|null):SDKDispatchDisk {
  if(raw===null)return initial()
  let envelope:{payload:SDKDispatchDisk;sha256:string}
  try{envelope=JSON.parse(raw) as typeof envelope}
  catch{return reject('SDK dispatch journal JSON corrupt')}
  if(!envelope?.payload || envelope.payload.version!=='v3-dev-a-sdk-dispatch/1' ||
    !envelope.payload.runs || typeof envelope.payload.runs!=='object' ||
    Array.isArray(envelope.payload.runs) ||
    hash(JSON.stringify(envelope.payload))!==envelope.sha256) {
    return reject('SDK dispatch journal seal mismatch')
  }
  const globalSettledReceipts=new Set<string>()
  for(const [k,chain] of Object.entries(envelope.payload.runs)){
    if(!k || !chain || !/^[a-f0-9]{64}$/.test(chain.runHash) ||
      !Array.isArray(chain.records))return reject('SDK dispatch chain corrupt')
    const ids=new Set<string>()
    for(let i=0;i<chain.records.length;i++){
      const item=chain.records[i]
      if(!item || typeof item.id!=='string' || !item.id.trim() ||
        ids.has(item.id) || typeof item.grantId!=='string' || !item.grantId.trim() ||
        (item.caseId===undefined)!==(item.sessionId===undefined) ||
        (item.caseId!==undefined && (typeof item.caseId!=='string' || !item.caseId.trim())) ||
        (item.sessionId!==undefined && (typeof item.sessionId!=='string' || !item.sessionId.trim())) ||
        !['in-flight','settled','late-denied'].includes(item.state) ||
        (item.state==='settled' && !item.receiptId?.trim()) ||
        (item.state!=='settled' && item.receiptId!==undefined) ||
        (item.state==='in-flight' && i!==chain.records.length-1) ||
        // Old A4 code could redispatch after late-denied, then mark the newer
        // SDK call settled. This did not reconcile the earlier Provider work.
        // Never upgrade such a legacy journal to a clean Run implicitly.
        (item.state==='late-denied' && i!==chain.records.length-1)) {
        return reject('SDK dispatch ledger invalid/duplicated')
      }
      ids.add(item.id)
      if(item.state==='settled') {
        if(globalSettledReceipts.has(item.receiptId!)){
          return reject('SDK dispatch ledger reuses one receipt across physical calls')
        }
        globalSettledReceipts.add(item.receiptId!)
      }
    }
  }
  return envelope.payload
}
function pinned(lease:V3OwnerLease):RunEvidenceIdentity {
  if(!lease.runEvidence || !lease.planSnapshot ||
    lease.runEvidence.caseId!==lease.caseId ||
    lease.runEvidence.runId!==lease.runId ||
    lease.runEvidence.attemptId!==lease.attemptId ||
    lease.runEvidence.ownerGeneration!==lease.generation ||
    lease.runEvidence.inputManifestHash!==lease.manifestHash ||
    lease.runEvidence.planFingerprint!==lease.planFingerprint ||
    lease.planSnapshot.fingerprint!==lease.planFingerprint){
    throw new C0ContractError('RUN_IDENTITY_MISMATCH','SDK dispatch missing frozen Main Run')
  }
  assertC0RunEvidenceIdentity(lease.runEvidence)
  return lease.runEvidence
}
export class V3ASDKDispatchFence {
  private readonly disk:SDKDispatchDisk
  private revision:string|null
  constructor(private readonly store:OwnerPersistence,
    private readonly owners:V3ReviewOwnerAdapter){
    this.revision=store.read()
    this.disk=decode(this.revision)
  }
  private current():void{
    if(this.store.read()!==this.revision)reject('SDK dispatch ledger changed; re-open')
  }
  private entry(run:RunEvidenceIdentity):SDKDispatchChain|undefined{
    const old=this.disk.runs[key(run)]
    if(old && old.runHash!==hash(JSON.stringify(run))){
      throw new C0ContractError('RUN_IDENTITY_MISMATCH','SDK dispatch Run changed')
    }
    return old
  }
  private persist(next:SDKDispatchDisk):void{
    this.current()
    const bytes=JSON.stringify({payload:next,sha256:hash(JSON.stringify(next))})
    if(this.store.compareAndWrite)this.store.compareAndWrite(this.revision,bytes)
    else this.store.write(bytes)
    this.revision=bytes
    this.disk.runs=next.runs
  }
  /** Lock Owner authorization and durable intent in one synchronous boundary. */
  claim(call:V3ReviewToolCall):{dispatchId:string;run:RunEvidenceIdentity}{
    if(call.tool!=='review_submit_result'){
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN','SDK dispatch requires Main submit scope')
    }
    return this.owners.withAuthorizedEvent(
      call.sessionId,call.grantId,call.senderKey,call.principal,call.tool,
      undefined,lease=>{
        this.current()
        const run=pinned(lease)
        // Changing Run ID, attempt or Owner session never proves prior
        // Provider work on this Case has stopped. Deny overlapping attempts.
        // Legacy unresolved records lack Case attribution: quarantine globally.
        for(const [otherKey,previous] of Object.entries(this.disk.runs)){
          if(otherKey===key(run))continue
          const lastOther=previous.records.at(-1)
          if(lastOther && (lastOther.state==='in-flight' ||
              lastOther.state==='late-denied') &&
            (!lastOther.caseId || !lastOther.sessionId ||
              lastOther.caseId===lease.caseId ||
              lastOther.sessionId===lease.sessionId)){
            reject('Unresolved SDK Provider dispatch on prior Run/Case; recovery required')
          }
        }
        const chain=this.entry(run)
        const last=chain?.records.at(-1)
        if(last?.state==='in-flight'){
          reject('Unresolved SDK Provider dispatch: refusing automatic repeat')
        }
        // A returned SDK result that Main could not authenticate is NOT proof
        // the Provider performed no work. Pause/resume or signal cancellation
        // must not silently authorize a second physical dispatch for this Run.
        if(last?.state==='late-denied'){
          reject('Late-denied SDK dispatch requires explicit recovery before repeat')
        }
        const dispatchId=randomUUID()
        const updated:SDKDispatchChain={
          runHash:chain?.runHash??hash(JSON.stringify(run)),
          records:[...(chain?.records??[]),{
            id:dispatchId,grantId:lease.grantId,
            caseId:lease.caseId,sessionId:lease.sessionId,state:'in-flight',
          }],
        }
        this.persist({...this.disk,runs:{...this.disk.runs,[key(run)]:updated}})
        return {dispatchId,run:structuredClone(run)}
      },
    )
  }
  /**
   * Same SDK receipt re-delivered for ONE claim is handled by the turn ledger.
   * It is NOT valid for two distinct Provider invocations to share one receipt:
   * otherwise the second physical turn could be incorrectly counted as a retry.
   */
  assertUniqueReceipt(run:RunEvidenceIdentity,id:string,receiptId:string):void{
    assertC0RunEvidenceIdentity(run)
    this.current()
    if(!receiptId?.trim()) {
      throw new C0ContractError('CONTRACT_INVALID','SDK Host receipt missing')
    }
    const chain=this.entry(run)
    const last=chain?.records.at(-1)
    if(!last || last.id!==id || last.state!=='in-flight'){
      reject('SDK receipt has no current in-flight dispatch')
    }
    if(Object.entries(this.disk.runs).some(([chainKey,previousChain])=>
      previousChain.records.some(previous=>
        previous.state==='settled' && previous.receiptId===receiptId &&
          (chainKey!==key(run) || previous.id!==id)))){
      throw new C0ContractError('REQUEST_ID_COLLISION',
        'One SDK receipt cannot attest two different Provider dispatches')
    }
  }
  /** Only after matching SDK result AND durable turn or terminal proposal. */
  settle(call:V3ReviewToolCall,id:string,receiptId:string):void{
    if(!receiptId?.trim()){
      throw new C0ContractError('CONTRACT_INVALID','Cannot settle dispatch without Host receipt')
    }
    this.owners.withAuthorizedEvent(
      call.sessionId,call.grantId,call.senderKey,call.principal,
      'review_submit_result',undefined,lease=>{
        this.current()
        const run=pinned(lease)
        const chain=this.entry(run)
        const last=chain?.records.at(-1)
        if(!last || last.id!==id || last.grantId!==lease.grantId ||
          last.state!=='in-flight') {
          return reject('SDK dispatch settlement has no current claim')
        }
        this.assertUniqueReceipt(run,id,receiptId)
        const next:SDKDispatchChain={runHash:chain!.runHash,records:[
          ...chain!.records.slice(0,-1),
          {...last,state:'settled',receiptId},
        ]}
        this.persist({...this.disk,runs:{...this.disk.runs,[key(run)]:next}})
      },
    )
  }
  /**
   * SDK promise FINISHED, but grant rotated or Main cancellation was observed.
   * Main may record technical denial without reviving the dead grant. A crash
   * before SDK resolution leaves in-flight and C/operator recovery required.
   */
  lateDenied(run:RunEvidenceIdentity,id:string):void{
    assertC0RunEvidenceIdentity(run)
    this.current()
    const chain=this.entry(run)
    const last=chain?.records.at(-1)
    if(!last || last.id!==id || last.state!=='in-flight'){
      return reject('SDK denied outcome has no unresolved dispatch')
    }
    const next:SDKDispatchChain={runHash:chain!.runHash,records:[
      ...chain!.records.slice(0,-1),
      {...last,state:'late-denied'},
    ]}
    this.persist({...this.disk,runs:{...this.disk.runs,[key(run)]:next}})
  }
  /** Main-current Owner gates readback; no source of C physical Host truth. */
  technicalSnapshot(call:V3ReviewToolCall):readonly V3ATechnicalDispatchWitness[]{
    const lease=this.owners.assertAuthorized(call.sessionId,call.grantId,
      call.senderKey,call.principal,'review_submit_result')
    this.current()
    const run=pinned(lease)
    const records=this.entry(run)?.records??[]
    return records.map(r=>({
      dispatchId:r.id,grantId:r.grantId,caseId:r.caseId,
      sessionId:r.sessionId,state:r.state,
      technicalReceiptId:r.receiptId,
    }))
  }
  /** Both in-flight and late-denied still need recovery, never auto-retry. */
  unresolved(run:RunEvidenceIdentity):boolean{
    assertC0RunEvidenceIdentity(run)
    this.current()
    const state=this.entry(run)?.records.at(-1)?.state
    return state==='in-flight' || state==='late-denied'
  }
}
