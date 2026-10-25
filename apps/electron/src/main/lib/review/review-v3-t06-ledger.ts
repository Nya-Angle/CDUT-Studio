/**
 * T06 物理入库持久账本（RUN-45 / BATCH-07 / ASSET-18）。
 *
 * 进程内 Map 只能保证“同一进程内幂等”。真实用户会在提交中断、Electron
 * 崩溃或重启后重试，需要 Main 有一份原子落盘的：
 * - 来源选择记录（原件相对路径 + SHA-256，ZIP 只记原包路径）；
 * - requestId 级提交账本（请求指纹、逐组状态、已登记 versionId、批次结果）。
 *
 * 账本只保存本地路径与哈希，不保存 ZIP 原字节、凭据或模型回执；
 * 续跑前必须重新核对来源字节，不把“磁盘上还在”当作“内容未变”。
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { getConfigDir } from '../config-paths'

const SAFE_ID = /^[A-Za-z0-9_-]{1,160}$/
const SELECTION_RETENTION_MS = 30 * 24 * 60 * 60 * 1000
const REQUEST_RETENTION_MS = 30 * 24 * 60 * 60 * 1000
export const T06_REQUEST_STALE_MS = 30 * 60 * 1000

export interface T06LedgerEntryRecord {
  entryId: string
  relativePath: string
  byteLength: number
  contentSha256: string
  /** 文件夹来源：Main-only 绝对路径 */
  absolutePath?: string
  /** ZIP 来源：包内条目名 */
  zipEntryName?: string
}

export interface T06StoredSelectionRecord {
  schemaVersion: 1
  selectionId: string
  fingerprint: string
  sourceKind: 'folder' | 'zip'
  /** ZIP 来源：原始压缩包路径，续跑时重新读取并核对条目哈希 */
  zipPath?: string
  entries: T06LedgerEntryRecord[]
  warnings: string[]
  excluded: Array<{ relativePath: string; reason: string }>
  createdAt: number
}

export interface T06RequestDocumentRecord {
  entryId: string
  documentVersionId: string
  role?: string
  materialSlotId?: string
}

export interface T06RequestGroupRecord {
  groupId: string
  status: 'pending' | 'running' | 'done' | 'failed'
  caseId?: string
  documents: T06RequestDocumentRecord[]
  warnings?: string[]
  error?: string
}

export interface T06RequestBatchRecord {
  batchId: string
  templateId: string
  templateVersion: number
  caseIds: string[]
}

export interface T06RequestLedgerRecord {
  schemaVersion: 1
  requestId: string
  requestFingerprint: string
  selectionId: string
  previewFingerprint: string
  ownerPid: number
  status: 'running' | 'completed'
  startedAt: string
  updatedAt: string
  groups: T06RequestGroupRecord[]
  batches?: T06RequestBatchRecord[]
  batchError?: string
  /** 完成后的完整回执；重启重放直接返回同一份，不重新执行。 */
  receipt?: unknown
}

function rootDir(kind: 'selections' | 'requests'): string {
  const dir = join(getConfigDir(), 'review-t06-intake', kind)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}

function pathOf(kind: 'selections' | 'requests', id: string): string {
  if (!SAFE_ID.test(id)) throw new Error(`T06 账本 ID 非法: ${id}`)
  return join(rootDir(kind), `${id}.json`)
}

function writeAtomic(filePath: string, data: unknown): void {
  const tmp = `${filePath}.${process.pid}.${Math.random().toString(36).slice(2, 8)}.tmp`
  writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8')
  renameSync(tmp, filePath)
}

function pruneOld(kind: 'selections' | 'requests', retentionMs: number): void {
  const dir = rootDir(kind)
  const cutoff = Date.now() - retentionMs
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.json')) continue
    const filePath = join(dir, name)
    try {
      if (statSync(filePath).mtimeMs >= cutoff) continue
      unlinkSync(filePath)
    } catch { /* 清理失败不阻断业务，下次再试 */ }
  }
}

export function saveT06SelectionRecord(record: T06StoredSelectionRecord): void {
  pruneOld('selections', SELECTION_RETENTION_MS)
  writeAtomic(pathOf('selections', record.selectionId), record)
}

export function readT06SelectionRecord(selectionId: string): T06StoredSelectionRecord | undefined {
  if (!SAFE_ID.test(selectionId)) return undefined
  const filePath = pathOf('selections', selectionId)
  if (!existsSync(filePath)) return undefined
  try {
    const record = JSON.parse(readFileSync(filePath, 'utf-8')) as T06StoredSelectionRecord
    if (record?.schemaVersion !== 1 || record.selectionId !== selectionId
      || !Array.isArray(record.entries) || typeof record.fingerprint !== 'string') return undefined
    return record
  } catch {
    return undefined
  }
}

export function readT06RequestLedger(requestId: string): T06RequestLedgerRecord | undefined {
  if (!SAFE_ID.test(requestId)) return undefined
  const filePath = pathOf('requests', requestId)
  if (!existsSync(filePath)) return undefined
  try {
    const record = JSON.parse(readFileSync(filePath, 'utf-8')) as T06RequestLedgerRecord
    if (record?.schemaVersion !== 1 || record.requestId !== requestId || !Array.isArray(record.groups)) return undefined
    return record
  } catch {
    return undefined
  }
}

export function saveT06RequestLedger(record: T06RequestLedgerRecord): void {
  pruneOld('requests', REQUEST_RETENTION_MS)
  writeAtomic(pathOf('requests', record.requestId), { ...record, updatedAt: new Date().toISOString() })
}

export function isProcessAlive(pid: number): boolean {
  if (!Number.isSafeInteger(pid) || pid <= 0) return false
  if (pid === process.pid) return true
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return (error as NodeJS.ErrnoException)?.code === 'EPERM'
  }
}

/** 账本是否仍被另一个存活进程持有；超龄账本允许按恢复流程接管。 */
export function isRequestLedgerBusy(record: T06RequestLedgerRecord, now = Date.now()): boolean {
  if (record.status !== 'running') return false
  if (record.ownerPid === process.pid) return false
  if (!isProcessAlive(record.ownerPid)) return false
  const updated = Date.parse(record.updatedAt)
  if (!Number.isFinite(updated) || now - updated > T06_REQUEST_STALE_MS) return false
  return true
}
