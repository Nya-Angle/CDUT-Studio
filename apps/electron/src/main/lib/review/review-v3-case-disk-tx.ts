/**
 * Dev-C C-Tx-R01: cross-process SINGLE-CASE disk transaction fence.
 *
 * Native mkdir(O_EXCL) is the filesystem-linearized lock point. Every native
 * Case write must hold this exact case lock; an in-memory Promise queue is
 * insufficient across independent Electron Main processes.
 *
 * Crashed owners leave a lock on purpose. NEVER steal by an expired time
 * lease alone (suspended owners and PID reuse would corrupt CAS). Recovery
 * requires independent offline C/host maintenance authorization and positive
 * same-machine dead-PID proof; no Renderer/IPC interface is installed here.
 */
import { AsyncLocalStorage } from 'node:async_hooks'
import { randomUUID } from 'node:crypto'
import {
  closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync,
  renameSync, rmdirSync, unlinkSync, writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import { getConfigDir } from '../config-paths'
import { assertSafeReviewStorageId } from './review-storage-id'

const context = new AsyncLocalStorage<Map<string, string>>()
const maxWaitMs = 30_000
type Owner = { schemaVersion: 'review-v3-case-disk-lock/1'; token: string; pid: number; acquiredAt: string }
const refuse = (why: string): never => { throw new Error('C_TX_RECOVERY_REQUIRED: ' + why) }
const paths = (caseId: string) => {
  assertSafeReviewStorageId(caseId, 'caseId')
  const root = join(getConfigDir(), 'review-cases', caseId)
  return { root, lock: join(root, '.state.v2.tx.lock'), state: join(root, 'state.v2.json') }
}
const ownerPath = (lock: string) => join(lock, 'owner.json')
const isExists = (error: unknown) =>
  !!error && typeof error === 'object' && 'code' in error &&
  (error as {code?:string}).code === 'EEXIST'

function readOwner(lock: string): Owner | undefined {
  try {
    const value = JSON.parse(readFileSync(ownerPath(lock), 'utf8')) as Owner
    return value?.schemaVersion === 'review-v3-case-disk-lock/1' &&
      typeof value.token === 'string' && value.token.length > 0 &&
      Number.isSafeInteger(value.pid) && value.pid > 0
      ? value : undefined
  } catch { return undefined }
}
function assertOwned(lock: string, token: string): void {
  if (readOwner(lock)?.token !== token) refuse('disk lock lost or replaced')
}
function holdOne(caseId: string): { lock:string; token:string } {
  const { root, lock } = paths(caseId)
  mkdirSync(root, {recursive:true,mode:0o700})
  mkdirSync(lock, {mode:0o700})
  const token=randomUUID()
  const owner:Owner={
    schemaVersion:'review-v3-case-disk-lock/1',token,pid:process.pid,
    acquiredAt:new Date().toISOString(),
  }
  try {
    const fd=openSync(ownerPath(lock),'wx',0o600)
    try { writeFileSync(fd,JSON.stringify(owner)+'\n'); fsyncSync(fd) }
    finally { closeSync(fd) }
  } catch (e) {
    // Do not leave an orphan lock from a failed owner metadata write.
    try { unlinkSync(ownerPath(lock)) } catch { /* no file */ }
    try { rmdirSync(lock) } catch { /* conservative */ }
    throw e
  }
  return {lock,token}
}
function releaseOne(lock:string,token:string):void {
  assertOwned(lock,token)
  unlinkSync(ownerPath(lock))
  rmdirSync(lock)
}
function sleep(ms:number):Promise<void> {return new Promise(resolve=>setTimeout(resolve,ms))}

/** Run one native Case transaction under OS-visible exclusive ownership. */
export async function withC2CaseDiskTransaction<T>(caseId:string, work:()=>Promise<T>):Promise<T> {
  assertSafeReviewStorageId(caseId,'caseId')
  const existing=context.getStore()
  const root=paths(caseId)
  if (existing?.has(root.lock)) {
    assertOwned(root.lock,existing.get(root.lock)!)
    return work()
  }
  let held:ReturnType<typeof holdOne>|undefined
  const end=Date.now()+maxWaitMs
  while (!held) {
    try { held=holdOne(caseId) }
    catch (e) {
      if (!isExists(e)) throw e
      if(Date.now()>=end) refuse('busy or abandoned case lock; no automatic stale lock stealing')
      await sleep(10)
    }
  }
  const store=new Map(existing)
  store.set(held.lock,held.token)
  try { return await context.run(store,work) }
  finally { releaseOne(held.lock,held.token) }
}

/** Internal direct write path (fixtures/migrations): obtain the SAME OS lock. */
export function withC2CaseDiskWriteSync<T>(caseId:string, write:()=>T):T {
  const root=paths(caseId)
  const token=context.getStore()?.get(root.lock)
  if (token) { assertOwned(root.lock,token);return write() }
  let held:ReturnType<typeof holdOne>
  try { held=holdOne(caseId) }
  catch(e) { if(isExists(e)) return refuse('unleased direct writer blocked by another PID'); throw e }
  try { return context.run(new Map([[held.lock,held.token]]),write) }
  finally { releaseOne(held.lock,held.token) }
}

/** Persist file bytes, then atomically rename and sync parent directory on POSIX.
 * Returns only after the source file descriptor has been fsynced. If directory
 * durability fails after rename the caller MUST re-read receipt before retrying.
 */
export function writeC2CaseStateDurably(caseId:string,text:string):void {
  const {root,state,lock}=paths(caseId)
  const token=context.getStore()?.get(lock)
  if(!token) return refuse('durable state write without C-Tx owner')
  assertOwned(lock,token)
  const tmp=state+'.'+randomUUID()+'.tmp'
  let created=false
  try {
    const fd=openSync(tmp,'wx',0o600)
    created=true
    try{writeFileSync(fd,text);fsyncSync(fd)}
    finally{closeSync(fd)}
    assertOwned(lock,token)
    renameSync(tmp,state)
    if(process.platform!=='win32') {
      const dirfd=openSync(root,'r')
      try{fsyncSync(dirfd)}finally{closeSync(dirfd)}
    }
  } catch(e) {
    if(created && existsSync(tmp))try{unlinkSync(tmp)}catch{/* preserve evidence */}
    throw e
  }
}

/** Audit only. Caller must not treat PID liveness as authority to steal lock. */
export function inspectC2CaseDiskLock(caseId:string): {locked:boolean; owner?:Readonly<Owner>} {
  const {lock}=paths(caseId)
  return {locked:existsSync(lock),owner:readOwner(lock)}
}

/**
 * Explicit offline recovery — NOT an IPC channel. A caller with independently
 * authenticated maintenance authority must approve the EXACT dead owner.
 * No heartbeat/age expiry permits stealing a live or paused process's lock.
 *
 * If the PID has been recycled, is alive, or cannot be inspected, recovery
 * refuses. A truncated/missing owner record also refuses; manual filesystem
 * forensic recovery is then needed. The recoverer's own mkdir lock prevents
 * two maintenance processes from both altering the same orphan fence.
 */
export function recoverC2AbandonedCaseDiskLock(
  caseId:string,
  authorize:(owner:Readonly<Owner>)=>void,
):void {
  if(typeof authorize!=='function') refuse('independent maintenance authorization required')
  const {lock}=paths(caseId)
  const recovery=lock+'.recovery'
  if(!existsSync(lock)) refuse('no orphan Case lock to recover')
  try {mkdirSync(recovery,{mode:0o700})}
  catch {return refuse('another recovery process is active')}
  try {
    const owner=readOwner(lock)
    if(!owner) return refuse('missing or invalid lock owner; inspect offline before changing')
    authorize(structuredClone(owner))
    // PID 0 can address current process group: the contract excludes it.
    let dead=false
    try {process.kill(owner.pid,0)}
    catch(e) {
      if(typeof e==='object' && e!==null && 'code' in e &&
          (e as {code?:string}).code==='ESRCH') dead=true
    }
    if(!dead) refuse('owner PID is alive, recycled, or not provably dead')
    if(readOwner(lock)?.token!==owner.token) refuse('owner changed during recovery')
    unlinkSync(ownerPath(lock))
    rmdirSync(lock)
  } finally {
    rmdirSync(recovery)
  }
}
