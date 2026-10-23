/**
 * T06 物理入库 Main 端口（Local-L04 R02 桥接层）。
 *
 * 只做两件事，全部由 Main 拥有：
 * 1. `pickT06PhysicalSource`：真实 OS 选择器（目录或 ZIP），枚举原件并把
 *    **不透明 entryId** 交给渲染层——渲染层永远拿不到本地绝对路径。
 * 2. `commitT06PhysicalImport`：核对 selectionId 与来源指纹，用既有
 *    Case/DocumentVersion/Batch writer 建案、逐原件入库、生成批次回执。
 *
 * 可靠性要求：
 * - 每个原件单独入库；**原件未全部成功的案卷不得成为批次成功成员**，
 *   但已建案卷与已入库原件一律保留，部分失败回执照实返回；
 * - 同一 requestId 幂等，重复提交返回既有回执；
 * - 绝不把「文件躺在磁盘上」当作已入库。
 */
import { createHash, randomUUID } from 'node:crypto'
import { closeSync, existsSync, lstatSync, openSync, readFileSync, readSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join, relative, sep } from 'node:path'
import { BrowserWindow, dialog } from 'electron'
import type { Actor, TemplateVersion } from '@profer/shared'
import { CommandValidationError, readAggregate } from './case-store-v2'
import { collectMissingIntakeInputs, createCaseFromTemplate } from './application-service'
import { getTemplate } from './template-store'
import { createBatchV2Validated, readBatchStateV2, resolvePolicyVersionLock } from './batch-store'
import {
  isRequestLedgerBusy, readT06RequestLedger, readT06SelectionRecord, saveT06RequestLedger, saveT06SelectionRecord,
  type T06RequestGroupRecord, type T06RequestLedgerRecord, type T06StoredSelectionRecord,
} from './review-v3-t06-ledger'
import { isNativeWorkspaceCaseV3, registerNativeWorkspaceMaterialV3 } from './native-workspace-case-v3'
import { registerMaterial } from './material-service'
import { decodeReviewB2Zip } from './review-zip-intake-v3-b2'
/**
 * 与渲染层 `review-v3-t06-physical-intake` 的结构契约一一对应。
 *
 * Main 不能 import 渲染层模块（架构边界），因此在此本地声明；
 * 两侧字段不一致时会在 IPC 调用处被类型检查发现。
 */
export type T06SourceKind = 'folder' | 'zip'

export interface T06PhysicalEntry {
  /** Main 颁发的不透明条目令牌，绝不是本地绝对路径 */
  entryId: string
  relativePath: string
  byteLength: number
}

export interface T06PhysicalExcludedEntry {
  relativePath: string
  reason: string
}
export interface T06PhysicalSelection {
  selectionId: string
  previewFingerprint: string
  sourceKind: T06SourceKind
  entries: T06PhysicalEntry[]
  warnings?: string[]
  /** 逐文件未入库清单：跳过/拒绝/截断的条目与原因，供用户审计，不是静默成功。 */
  excluded?: T06PhysicalExcludedEntry[]
}

export type T06MaterialRole = 'application' | 'evidence' | 'rule' | 'attachment'

/** 逐原件的业务身份：角色与模板材料槽。未显式给出时保持旧的 evidence/无槽语义。 */
export interface T06EntryAssignment {
  entryId: string
  role?: T06MaterialRole
  materialSlotId?: string
}

/** 批量分案时的申报事项输入；id 缺省由 Main 按序号生成（内部稳定 ID）。 */
export interface T06CommitSubject {
  id?: string
  title: string
  type?: 'item' | 'clause' | 'project' | 'budget-line' | 'custom'
  sectionId?: string
  fieldValues?: Record<string, unknown>
}

export interface T06CommitGroup {
  groupId: string
  entryIds: string[]
  action: 'create' | 'existing'
  title?: string
  applicant?: string
  caseId?: string
  /** 每个案卷可独立选择已发布模板；未传时兼容旧单模板批次。 */
  templateId?: string
  templateVersion?: number
  /** 案卷级字段输入（key 必须在模板 case 作用域内）。 */
  fieldValues?: Record<string, unknown>
  /** 申报事项/分项输入；缺省时不伪造事项，由提交门禁要求补齐。 */
  subjects?: T06CommitSubject[]
  /** 逐条原件的角色/槽位映射；未列出者按 evidence、无槽登记。 */
  entryAssignments?: T06EntryAssignment[]
}

export interface T06PhysicalCommitRequest {
  requestId: string
  selectionId: string
  previewFingerprint: string
  /** 旧版整批固定模板；新式按组设置 templateId/templateVersion 时可不传。 */
  templateId?: string
  templateVersion?: number
  batchName: string
  groups: T06CommitGroup[]
}

export interface T06ItemReceipt {
  entryId: string
  documentVersionId: string
  role?: T06MaterialRole
  materialSlotId?: string
}
export interface T06CaseReceipt {
  groupId: string
  caseId?: string
  documents: T06ItemReceipt[]
  status: 'done' | 'failed'
  error?: string
  /** 已入库但尚未满足提交条件的事项（必填字段/必需分项/必交槽）；不阻断材料保留。 */
  warnings?: string[]
}
export interface T06CommitReceipt {
  requestId: string
  cases: T06CaseReceipt[]
  batchId?: string
  /** 混合业务会按已发布模板拆为多个真实批次，而不是伪造跨模板锁。 */
  batches?: Array<{ batchId: string; templateId: string; templateVersion: number; caseIds: string[] }>
  batchError?: string
  /** 本次来源的逐文件入库审计（接受/跳过/拒绝），随回执一并返回。 */
  inventory?: { accepted: number; excluded: T06PhysicalExcludedEntry[]; warnings: string[] }
}

const MAIN_ACTOR: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }

/** 单个条目最多 512MB、单次选择最多 2000 条，防止误选整盘。 */
const MAX_ENTRY_BYTES = 512 * 1024 * 1024
const MAX_ENTRIES = 2000

interface StoredEntry {
  entryId: string
  relativePath: string
  byteLength: number
  contentSha256: string
  /** Main-only：绝对字节来源（目录文件路径或 ZIP 内条目） */
  absolutePath?: string
  zipEntryName?: string
}

interface StoredSelection {
  selectionId: string
  fingerprint: string
  sourceKind: T06SourceKind
  /** ZIP 原始压缩包路径（恢复时重新读取并核对条目哈希） */
  zipPath?: string
  excluded: T06PhysicalExcludedEntry[]
  /** ZIP 只读取一次并常驻内存，避免提交时重读磁盘导致与预览不一致 */
  zipBytes?: Uint8Array
  /** 同一提交中的 ZIP 只解压一次；大量文件不能逐条重复解压整个 ZIP。 */
  zipDecodedCache?: Map<string, Uint8Array>
  entries: StoredEntry[]
  warnings: string[]
  createdAt: number
}


const selections = new Map<string, StoredSelection>()
/** requestId → 回执（幂等） */
const receipts = new Map<string, T06CommitReceipt>()
const receiptRequests = new Map<string, string>()
/** (来源选择、目标案卷、原件令牌) → 实际登记的版本。不能跨案卷复用。 */
const registered = new Map<string, string>()
/** 本进程正在执行的 T06 requestId；跨进程由持久账本 ownerPid 兜底。 */
const activeRequests = new Set<string>()

/**
 * 仅供故障注入测试：模拟 Electron 进程重启——清空进程内缓存，保留磁盘账本。
 * 生产代码不得调用；恢复能力必须依赖磁盘，而不是这个钩子。
 */
export function __resetT06ProcessCachesForTest(): void {
  selections.clear()
  receipts.clear()
  receiptRequests.clear()
  registered.clear()
  activeRequests.clear()
}

const sha256 = (value: Uint8Array | string): string =>
  createHash('sha256').update(value).digest('hex')

function fingerprintOf(entries: Array<{ relativePath: string; byteLength: number; contentSha256: string }>): string {
  const canonical = entries
    .map((entry) => `${entry.relativePath}\u0000${entry.byteLength}\u0000${entry.contentSha256}`)
    .sort()
    .join('\u0001')
  return sha256(canonical)
}

/** 64 KiB 分块读取，避免文件选择预览时把超大原件完整装入内存。 */
function hashFile(path: string): string {
  const hash = createHash('sha256')
  const fd = openSync(path, 'r')
  try {
    const chunk = Buffer.allocUnsafe(64 * 1024)
    let count: number
    while ((count = readSync(fd, chunk, 0, chunk.length, null)) > 0) hash.update(chunk.subarray(0, count))
    return hash.digest('hex')
  } finally { closeSync(fd) }
}

/** 递归枚举目录下的原件；跳过隐藏文件与符号链接，避免越界。 */
function walkDirectory(
  root: string,
  excluded: T06PhysicalExcludedEntry[],
): Array<{ absolutePath: string; relativePath: string; byteLength: number }> {
  const results: Array<{ absolutePath: string; relativePath: string; byteLength: number }> = []
  const visit = (current: string): void => {
    for (const name of readdirSync(current)) {
      const full = join(current, name)
      const shown = relative(root, full).split(sep).join('/')
      if (results.length >= MAX_ENTRIES) {
        excluded.push({ relativePath: shown, reason: `超过单次 ${MAX_ENTRIES} 条上限，未纳入本次预览` })
        continue
      }
      if (name.startsWith('.')) { excluded.push({ relativePath: shown, reason: '隐藏文件/目录，默认跳过' }); continue }
      const stats = lstatSync(full)
      if (stats.isSymbolicLink()) { excluded.push({ relativePath: shown, reason: '符号链接，避免越界，默认跳过' }); continue }
      if (stats.isDirectory()) { visit(full); continue }
      if (!stats.isFile()) { excluded.push({ relativePath: shown, reason: '不是普通文件' }); continue }
      if (stats.size > MAX_ENTRY_BYTES) { excluded.push({ relativePath: shown, reason: `超过单文件 ${Math.round(MAX_ENTRY_BYTES / 1024 / 1024)}MB 上限` }); continue }
      results.push({ absolutePath: full, relativePath: shown, byteLength: stats.size })
    }
  }
  visit(root)
  return results
}

/**
 * 枚举一个已确定的本地来源并登记为本次选择。
 *
 * 与弹窗分离：弹窗只负责拿到路径，这里负责枚举、指纹与令牌。
 * 这样测试可以针对真实目录/ZIP 验证行为，而不必伪造 OS 弹窗。
 */
export function buildT06SelectionFromPath(target: string, sourceKind: T06SourceKind): T06PhysicalSelection {
  if (sourceKind !== 'folder' && sourceKind !== 'zip') throw new CommandValidationError('VALIDATION_FAILED', '来源类型非法')

  const warnings: string[] = []
  const excluded: T06PhysicalExcludedEntry[] = []
  const entries: StoredEntry[] = []
  let zipBytes: Uint8Array | undefined

  if (sourceKind === 'folder') {
    const listed = walkDirectory(target, excluded)
    if (listed.length >= MAX_ENTRIES) warnings.push(`来源条目超过 ${MAX_ENTRIES} 条，仅处理前 ${MAX_ENTRIES} 条`)
    for (const item of listed) {
      const contentSha256 = hashFile(item.absolutePath)
      entries.push({ entryId: `e-${sha256(item.relativePath + '\u0000' + contentSha256).slice(0, 24)}`, ...item, contentSha256 })
    }
  } else {
    const raw = readFileSync(target)
    zipBytes = new Uint8Array(raw.buffer, raw.byteOffset, raw.byteLength)
    const decoded = decodeReviewB2Zip(zipBytes)
    for (const receipt of decoded.receipts) {
      if (receipt.status === 'rejected') {
        warnings.push(`${receipt.entryName}：${receipt.reason ?? '被拒绝'}`)
        excluded.push({ relativePath: receipt.entryName, reason: receipt.reason ?? 'ZIP 解包拒绝' })
      }
    }
    for (const accepted of decoded.accepted) {
      if (entries.length >= MAX_ENTRIES) {
        warnings.push(`ZIP 条目超过 ${MAX_ENTRIES} 条，已截断`)
        excluded.push({ relativePath: accepted.entryName, reason: `超过单次 ${MAX_ENTRIES} 条上限，未纳入本次预览` })
        continue
      }
      const relativePath = accepted.entryName.split('/').filter(Boolean).join('/')
      const contentSha256 = sha256(accepted.bytes)
      entries.push({
        entryId: `e-${sha256(relativePath + '\u0000' + contentSha256).slice(0, 24)}`,
        relativePath, zipEntryName: accepted.entryName, byteLength: accepted.bytes.byteLength, contentSha256,
      })
    }
  }

  if (entries.length === 0) {
    throw new CommandValidationError('VALIDATION_FAILED', '选中的来源里没有可入库的原件')
  }
  const selection: StoredSelection = {
    selectionId: `sel-${randomUUID()}`,
    fingerprint: fingerprintOf(entries), sourceKind, entries, warnings, excluded, createdAt: Date.now(),
    ...(sourceKind === 'zip' ? { zipPath: target } : {}),
    ...(zipBytes ? { zipBytes } : {}),
  }
  selections.set(selection.selectionId, selection)
  // RUN-45/BATCH-07：预览选择也落盘，重启后仍可按原 selectionId 恢复；
  // 恢复时必须重新核对每个原件的 SHA-256，源被改动就明确拒绝。
  saveT06SelectionRecord({
    schemaVersion: 1, selectionId: selection.selectionId, fingerprint: selection.fingerprint,
    sourceKind, ...(selection.zipPath ? { zipPath: selection.zipPath } : {}),
    entries: entries.map((entry) => ({
      entryId: entry.entryId, relativePath: entry.relativePath, byteLength: entry.byteLength,
      contentSha256: entry.contentSha256,
      ...(entry.absolutePath ? { absolutePath: entry.absolutePath } : {}),
      ...(entry.zipEntryName ? { zipEntryName: entry.zipEntryName } : {}),
    })),
    warnings, excluded, createdAt: selection.createdAt,
  })
  return {
    selectionId: selection.selectionId,
    previewFingerprint: selection.fingerprint,
    sourceKind,
    entries: entries.map((entry): T06PhysicalEntry => ({
      entryId: entry.entryId, relativePath: entry.relativePath, byteLength: entry.byteLength,
    })),
    ...(warnings.length > 0 ? { warnings } : {}),
    ...(excluded.length > 0 ? { excluded } : {}),
  }
}

/** 真实 OS 选择器。必须由 Main 弹窗，渲染层不能自称路径。 */
export async function pickT06PhysicalSource(sourceKind: T06SourceKind): Promise<T06PhysicalSelection | null> {
  if (sourceKind !== 'folder' && sourceKind !== 'zip') throw new CommandValidationError('VALIDATION_FAILED', '来源类型非法')
  const window = BrowserWindow.getAllWindows().find((candidate) => !candidate.isDestroyed())
  if (!window) throw new CommandValidationError('INVALID_TRANSITION', '没有可用窗口，无法打开选择器')
  const picked = await dialog.showOpenDialog(window, sourceKind === 'folder'
    ? { title: '选择要入库的文件夹', properties: ['openDirectory'] }
    : { title: '选择要入库的 ZIP', properties: ['openFile'], filters: [{ name: 'ZIP', extensions: ['zip'] }] })
  if (picked.canceled || picked.filePaths.length === 0) return null
  return buildT06SelectionFromPath(picked.filePaths[0]!, sourceKind)
}

/**
 * 按 selectionId 取得来源：优先进程内缓存，其次持久账本。
 * 持久账本恢复必须重新读取原件/ZIP 并核对内容哈希；不能把旧路径直接当有效来源。
 */
function loadSelection(selectionId: string): StoredSelection | undefined {
  const cached = selections.get(selectionId)
  if (cached) return cached
  const record = readT06SelectionRecord(selectionId)
  if (!record) return undefined
  let zipBytes: Uint8Array | undefined
  if (record.sourceKind === 'zip') {
    if (!record.zipPath || !existsSync(record.zipPath)) {
      throw new CommandValidationError('NOT_FOUND', '原 ZIP 来源已不存在，请重新选择来源')
    }
    const raw = readFileSync(record.zipPath)
    zipBytes = new Uint8Array(raw.buffer, raw.byteOffset, raw.byteLength)
    const decoded = decodeReviewB2Zip(zipBytes)
    const byName = new Map(decoded.accepted.map((item) => [item.entryName, item.bytes]))
    for (const entry of record.entries) {
      if (!entry.zipEntryName) throw new CommandValidationError('VALIDATION_FAILED', `ZIP 账本缺少条目名：${entry.relativePath}`)
      const bytes = byName.get(entry.zipEntryName)
      if (!bytes || bytes.byteLength !== entry.byteLength || sha256(bytes) !== entry.contentSha256) {
        throw new CommandValidationError('VALIDATION_FAILED', `ZIP 来源在预览后已变化，请重新选择来源：${entry.relativePath}`)
      }
    }
  } else {
    for (const entry of record.entries) {
      if (!entry.absolutePath || !existsSync(entry.absolutePath)) {
        throw new CommandValidationError('NOT_FOUND', `源文件已不存在，请重新选择来源：${entry.relativePath}`)
      }
      if (hashFile(entry.absolutePath) !== entry.contentSha256) {
        throw new CommandValidationError('VALIDATION_FAILED', `源文件在预览后已变化，请重新选择来源：${entry.relativePath}`)
      }
    }
  }
  const restored: StoredSelection = {
    selectionId: record.selectionId, fingerprint: record.fingerprint, sourceKind: record.sourceKind,
    ...(record.zipPath ? { zipPath: record.zipPath } : {}),
    excluded: record.excluded ?? [],
    ...(zipBytes ? { zipBytes } : {}),
    entries: record.entries.map((entry) => ({
      entryId: entry.entryId, relativePath: entry.relativePath, byteLength: entry.byteLength,
      contentSha256: entry.contentSha256,
      ...(entry.absolutePath ? { absolutePath: entry.absolutePath } : {}),
      ...(entry.zipEntryName ? { zipEntryName: entry.zipEntryName } : {}),
    })),
    warnings: record.warnings ?? [], createdAt: record.createdAt,
  }
  if (fingerprintOf(restored.entries) !== record.fingerprint) {
    throw new CommandValidationError('VALIDATION_FAILED', '来源账本指纹不一致，请重新选择来源')
  }
  selections.set(selectionId, restored)
  return restored
}

function bytesOf(selection: StoredSelection, entry: StoredEntry): Uint8Array {
  let bytes: Uint8Array
  if (entry.absolutePath) {
    const raw = readFileSync(entry.absolutePath)
    bytes = new Uint8Array(raw.buffer, raw.byteOffset, raw.byteLength)
  } else {
    if (!selection.zipBytes || !entry.zipEntryName) throw new CommandValidationError('NOT_FOUND', 'ZIP 来源已失效，请重新选择')
    if (!selection.zipDecodedCache) {
      const decoded = decodeReviewB2Zip(selection.zipBytes)
      selection.zipDecodedCache = new Map(decoded.accepted.map(item => [item.entryName, item.bytes]))
    }
    const found = selection.zipDecodedCache.get(entry.zipEntryName)
    if (!found) throw new CommandValidationError('NOT_FOUND', `ZIP 条目已不可读：${entry.zipEntryName}`)
    bytes = found
  }
  if (bytes.byteLength !== entry.byteLength || sha256(bytes) !== entry.contentSha256) {
    throw new CommandValidationError('VALIDATION_FAILED', `预览后原件内容已变化，请重新选择来源：${entry.relativePath}`)
  }
  return bytes
}

/** 把单个条目落成真实 DocumentVersion（走既有原生材料登记）。 */
async function registerEntry(
  selection: StoredSelection,
  entry: StoredEntry,
  caseId: string,
  assignment: { role: T06MaterialRole; materialSlotId?: string },
): Promise<T06ItemReceipt> {
  const identity = `${selection.selectionId}\u0000${caseId}\u0000${entry.entryId}\u0000${assignment.role}\u0000${assignment.materialSlotId ?? ''}`
  const cached = registered.get(identity)
  if (cached) {
    return { entryId: entry.entryId, documentVersionId: cached, role: assignment.role,
      ...(assignment.materialSlotId ? { materialSlotId: assignment.materialSlotId } : {}) }
  }
  const bytes = bytesOf(selection, entry)
  const displayName = basename(entry.relativePath) || 'entry.bin'
  const aggregate = readAggregate(caseId)
  if (!aggregate) throw new CommandValidationError('NOT_FOUND', '案卷不存在')
  // 重启/重试恢复：同一案卷内同名、同内容、同角色与槽位的有效版本就是本条目
  // 上次已登记的结果，必须复用，不能因为进程内缓存丢失再复制一份原件。
  const existing = aggregate.caseV2.documents.find((document) => document.active !== false
    && document.fileName === displayName
    && document.role === assignment.role
    && document.materialSlotId === assignment.materialSlotId
    && (document.byteHash ?? document.contentHash) === entry.contentSha256)
  if (existing) {
    registered.set(identity, existing.versionId)
    return { entryId: entry.entryId, documentVersionId: existing.versionId, role: assignment.role,
      ...(assignment.materialSlotId ? { materialSlotId: assignment.materialSlotId } : {}) }
  }
  const tempPath = join(tmpdir(), `t06-${sha256(identity).slice(0, 24)}-${displayName}`)
  writeFileSync(tempPath, bytes)
  try {
    // 案卷类型决定写入通道：原生 V3 案卷走原生登记，模板创建的 V2 案卷走 V2 材料服务
    // 原生兼容投影不展示 attachment 角色，附件仍走同一 C-owned V2 材料事务，
    // 不为了投影去改写用户选择的业务角色。
    const nativeRole: 'application' | 'evidence' | 'rule' =
      assignment.role === 'attachment' ? 'evidence' : assignment.role
    const versionId = isNativeWorkspaceCaseV3(aggregate) && assignment.role !== 'attachment'
      ? await (async () => {
        const document = await registerNativeWorkspaceMaterialV3(
          caseId, tempPath, nativeRole, MAIN_ACTOR, undefined, assignment.materialSlotId,
          { fileName: displayName },
        )
        const after = readAggregate(caseId)
        const found = after?.caseV2.documents.find((item) => item.documentId === document.id && item.active !== false)
        if (!found) throw new CommandValidationError('INVALID_TRANSITION', '原件已登记但找不到版本记录')
        return found.versionId
      })()
      : await (async () => {
        const written = await registerMaterial(caseId, {
          requestId: `t06-register-${sha256(identity).slice(0, 28)}`,
          actor: MAIN_ACTOR,
          expectedRevision: aggregate.caseV2.revision,
          payload: {
            sourcePath: tempPath,
            role: assignment.role,
            ...(assignment.materialSlotId ? { materialSlotId: assignment.materialSlotId } : {}),
            fileName: displayName,
          } as never,
        })
        if (!written.ok) throw new CommandValidationError(written.code, written.message)
        if (!written.entity) throw new CommandValidationError('INVALID_TRANSITION', '原件已登记但未返回版本记录')
        return written.entity.versionId
      })()
    registered.set(identity, versionId)
    return { entryId: entry.entryId, documentVersionId: versionId, role: assignment.role,
      ...(assignment.materialSlotId ? { materialSlotId: assignment.materialSlotId } : {}) }
  } finally {
    try { unlinkSync(tempPath) } catch { /* 无法清理时不掩盖原有写入失败 */ }
  }
}

/** 组内逐条原件的业务身份；未声明时保持 evidence / 无槽。 */
function resolveEntryAssignments(
  group: T06CommitGroup,
  template: { materialSlots: Array<{ id: string }> },
): Map<string, { role: T06MaterialRole; materialSlotId?: string }> {
  const allowedRoles: T06MaterialRole[] = ['application', 'evidence', 'rule', 'attachment']
  const result = new Map<string, { role: T06MaterialRole; materialSlotId?: string }>()
  for (const assignment of group.entryAssignments ?? []) {
    if (!assignment || typeof assignment.entryId !== 'string' || !group.entryIds.includes(assignment.entryId)) {
      throw new CommandValidationError('VALIDATION_FAILED', `材料归属引用了本组之外的原件：${assignment?.entryId ?? '(空)'}`)
    }
    if (result.has(assignment.entryId)) throw new CommandValidationError('VALIDATION_FAILED', `同一原件重复声明归属：${assignment.entryId}`)
    const role = assignment.role ?? 'evidence'
    if (!allowedRoles.includes(role)) throw new CommandValidationError('VALIDATION_FAILED', `材料角色不合法：${role}`)
    if (assignment.materialSlotId && !template.materialSlots.some((slot) => slot.id === assignment.materialSlotId)) {
      throw new CommandValidationError('VALIDATION_FAILED', `材料槽不在所选模板中：${assignment.materialSlotId}`)
    }
    result.set(assignment.entryId, { role, ...(assignment.materialSlotId ? { materialSlotId: assignment.materialSlotId } : {}) })
  }
  return result
}

/** 入库后仍未满足的提交条件：只作为可操作 warning 返回，不伪造“已就绪”。 */
function intakeWarnings(caseId: string, template: TemplateVersion): string[] {
  const aggregate = readAggregate(caseId)
  if (!aggregate) return []
  const warnings: string[] = []
  for (const slot of template.materialSlots) {
    if ((slot.requiredAt ?? 'submission') !== 'submission' || slot.minCount <= 0 || slot.requiredWhen) continue
    const active = aggregate.caseV2.documents.filter((document) => document.materialSlotId === slot.id && document.active !== false).length
    if (active < slot.minCount) warnings.push(`必交材料槽「${slot.name}」未满足（需 ${slot.minCount}，现有 ${active}）；请在案卷页补绑定`)
  }
  const missing = collectMissingIntakeInputs(template, aggregate.caseV2)
  if (missing.length > 0) warnings.push(`提交审核前需补齐：${missing.join('；')}`)
  return warnings
}

/**
 * 提交物理入库。
 *
 * 幂等：同一 requestId 直接返回既有回执。
 * 部分失败：失败的组返回 `status:'failed'` 且保留已建案卷；只有全部条目成功的
 * 案卷才进入批次。
 */
export async function commitT06PhysicalImport(request: T06PhysicalCommitRequest): Promise<T06CommitReceipt> {
  if (!request?.requestId?.trim()) throw new CommandValidationError('VALIDATION_FAILED', '缺少请求号')
  if (!request.batchName?.trim() || !Array.isArray(request.groups) || !request.groups.length) {
    throw new CommandValidationError('VALIDATION_FAILED', '批次名称无效或没有确认案卷')
  }
  const requestFingerprint = sha256(JSON.stringify(request))
  const cached = receipts.get(request.requestId)
  if (cached) {
    if (receiptRequests.get(request.requestId) !== requestFingerprint) {
      throw new CommandValidationError('VALIDATION_FAILED', '相同请求号包含不同的分案内容，请重新选择来源')
    }
    return cached
  }

  // RUN-45/BATCH-15：先看持久账本与执行中请求，避免并发的相同 requestId 穿透缓存检查。
  const priorLedger = readT06RequestLedger(request.requestId)
  if (priorLedger) {
    if (priorLedger.requestFingerprint !== requestFingerprint) {
      throw new CommandValidationError('VALIDATION_FAILED', '相同请求号包含不同的分案内容，请重新选择来源')
    }
    if (priorLedger.status === 'completed' && priorLedger.receipt) {
      const stored = priorLedger.receipt as T06CommitReceipt
      receipts.set(request.requestId, stored)
      receiptRequests.set(request.requestId, requestFingerprint)
      return stored
    }
    if (isRequestLedgerBusy(priorLedger)) {
      throw new CommandValidationError('INVALID_TRANSITION',
        '相同请求号正在其他进程处理中；请等待其完成或核对账本后再恢复，不能并行重做')
    }
  }
  if (activeRequests.has(request.requestId)) {
    throw new CommandValidationError('INVALID_TRANSITION', '相同请求号正在本进程处理中，请勿重复提交')
  }

  const selection = loadSelection(request.selectionId)
  if (!selection) throw new CommandValidationError('NOT_FOUND', '来源选择已失效，请重新选择')
  if (selection.fingerprint !== request.previewFingerprint) {
    throw new CommandValidationError('VALIDATION_FAILED', '来源内容在预览后发生变化，请重新预览')
  }
  const byEntry = new Map(selection.entries.map((entry) => [entry.entryId, entry]))
  const assigned = new Set<string>()
  const groupIds = new Set<string>()
  for (const group of request.groups) {
    if (!group || !group.groupId?.trim() || groupIds.has(group.groupId) ||
        !['create', 'existing'].includes(group.action) || !Array.isArray(group.entryIds) || !group.entryIds.length) {
      throw new CommandValidationError('VALIDATION_FAILED', '存在重复、空材料或非法的案卷组')
    }
    groupIds.add(group.groupId)
    for (const entryId of group.entryIds) {
      // 未知条目交给下面的分组处理：记为该组部分失败并保留案卷，而不是整批回滚
      if (!byEntry.has(entryId)) continue
      if (assigned.has(entryId)) throw new CommandValidationError('VALIDATION_FAILED', '同一原件不能分配给不同案卷：' + entryId)
      assigned.add(entryId)
    }
  }

  activeRequests.add(request.requestId)
  const ledger: T06RequestLedgerRecord = priorLedger ?? {
    schemaVersion: 1, requestId: request.requestId, requestFingerprint,
    selectionId: request.selectionId, previewFingerprint: request.previewFingerprint,
    ownerPid: process.pid, status: 'running',
    startedAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    groups: request.groups.map((group): T06RequestGroupRecord => ({ groupId: group.groupId, status: 'pending', documents: [] })),
  }
  ledger.ownerPid = process.pid
  ledger.status = 'running'
  ledger.selectionId = request.selectionId
  ledger.previewFingerprint = request.previewFingerprint
  ledger.groups = request.groups.map((group) => {
    const prior = ledger.groups.find((item) => item.groupId === group.groupId)
    return prior ?? { groupId: group.groupId, status: 'pending', documents: [] }
  })
  saveT06RequestLedger(ledger)
  try {
  const cases: T06CaseReceipt[] = []
  const succeededByTemplate = new Map<string, { templateId: string; templateVersion: number; caseIds: string[] }>()
  for (const group of request.groups as T06CommitGroup[]) {
    let caseId = group.caseId
    try {
      const templateId = group.templateId ?? request.templateId
      const templateVersion = group.templateVersion ?? request.templateVersion
      const template = templateId && templateVersion ? getTemplate(templateId, templateVersion) : undefined
      if (!template || template.status !== 'published') {
        throw new CommandValidationError('DEPENDENCY_UNRESOLVED', `案卷“${group.groupId}”尚未匹配可用的已发布模板`)
      }
      const assignments = resolveEntryAssignments(group, template)
      if (group.action === 'create') {
        caseId = `case-${sha256(request.requestId + '\u0000' + group.groupId).slice(0, 24)}`
        // 模板适配：只提交模板真实声明的 case 字段；applicant 不是全局字段，
        // 旧实现无条件塞 applicant 会让没有该字段的模板整组失败（RUN-38）。
        const caseFieldKeys = new Set(template.fields.filter((field) => (field.scope ?? 'subject') === 'case').map((field) => field.key))
        const fieldValues: Record<string, unknown> = {}
        if (group.applicant?.trim() && caseFieldKeys.has('applicant')) fieldValues.applicant = group.applicant.trim()
        for (const [key, value] of Object.entries(group.fieldValues ?? {})) {
          if (value !== undefined) fieldValues[key] = value
        }
        const subjects = (group.subjects ?? []).map((subject, index) => ({
          id: subject.id?.trim() || `subject-${index + 1}`,
          title: subject.title,
          type: subject.type ?? 'item',
          ...(subject.sectionId ? { sectionId: subject.sectionId } : {}),
          fieldValues: subject.fieldValues ?? {},
        }))
        const existingAggregate = readAggregate(caseId)
        if (existingAggregate) {
          // 重启/重试恢复：确定性 caseId 已建案时视为本请求已完成建案，继续补登记。
          if (existingAggregate.caseV2.templateId !== templateId || existingAggregate.caseV2.templateVersion !== templateVersion) {
            throw new CommandValidationError('INVALID_TRANSITION', '该请求号已存在不同模板的案卷，请更换请求号或核对来源')
          }
        } else {
          const created = await createCaseFromTemplate(templateId!, templateVersion!, {
            title: group.title?.trim() || group.groupId,
            fieldValues,
            subjects,
          }, MAIN_ACTOR, caseId, { allowIncompleteIntake: true })
          if (!created.ok) throw new CommandValidationError(created.code, created.message)
        }
      } else if (!caseId) {
        throw new CommandValidationError('VALIDATION_FAILED', '绑定既有案卷缺少 caseId')
      }
      if (group.action === 'existing') {
        const existing = readAggregate(caseId!)
        if (!existing || existing.caseV2.templateId !== templateId || existing.caseV2.templateVersion !== templateVersion) {
          throw new CommandValidationError('VALIDATION_FAILED', '已有案卷的模板版本与本组选择不一致')
        }
      }
      const documents: T06ItemReceipt[] = []
      const failures: string[] = []
      for (const entryId of group.entryIds) {
        const entry = byEntry.get(entryId)
        if (!entry) { failures.push(`${entryId}：不在本次来源中`); continue }
        const assignment = assignments.get(entryId) ?? { role: 'evidence' as const }
        try {
          documents.push(await registerEntry(selection, entry, caseId!, assignment))
        } catch (cause) {
          failures.push(`${entry.relativePath}：${cause instanceof Error ? cause.message : String(cause)}`)
        }
      }
      const warnings = intakeWarnings(caseId!, template)
      if (failures.length > 0) {
        // 部分失败：案卷与已入库原件保留，但不作为批次成功成员
        cases.push({ groupId: group.groupId, caseId, documents,
          ...(warnings.length ? { warnings } : {}), status: 'failed', error: failures.join('；') })
      } else {
        cases.push({ groupId: group.groupId, caseId, documents,
          ...(warnings.length ? { warnings } : {}), status: 'done' })
        const key = `${templateId!}@${templateVersion!}`
        const item = succeededByTemplate.get(key) ?? { templateId: templateId!, templateVersion: templateVersion!, caseIds: [] }
        item.caseIds.push(caseId!)
        succeededByTemplate.set(key, item)
      }
    } catch (cause) {
      // 建案前失败（模板/字段/来源校验）不得在回执里声称存在一个 caseId；
      // 只有聚合确实落盘时才是“已建案但部分失败”，可恢复语义才成立。
      const persistedCaseId = caseId && readAggregate(caseId) ? caseId : undefined
      cases.push({
        groupId: group.groupId, ...(persistedCaseId ? { caseId: persistedCaseId } : {}), documents: [], status: 'failed',
        error: cause instanceof Error ? cause.message : String(cause),
      })
    }
    const recorded = cases[cases.length - 1]
    if (recorded) {
      const target = ledger.groups.find((item) => item.groupId === recorded.groupId)
      if (target) {
        target.status = recorded.status === 'done' ? 'done' : 'failed'
        if (recorded.caseId) target.caseId = recorded.caseId
        target.documents = recorded.documents.map((document) => ({ ...document }))
        if (recorded.warnings?.length) target.warnings = recorded.warnings
        else delete target.warnings
        if (recorded.error) target.error = recorded.error
        else delete target.error
      }
      saveT06RequestLedger(ledger)
    }
  }

  const batches: NonNullable<T06CommitReceipt['batches']> = []
  const batchErrors: string[] = []
  for (const [templateKey, group] of succeededByTemplate) {
    try {
      const template = getTemplate(group.templateId, group.templateVersion)
      if (!template || template.status !== 'published') throw new Error('模板在入库后被撤销发布')
      const batchId = `batch-${sha256(request.requestId + '\u0000' + templateKey).slice(0, 20)}`
      const existingBatch = readBatchStateV2(batchId)
      if (existingBatch) {
        // 重启续跑：同一请求的确定性 batchId 已存在时核对身份后复用，不重复建批。
        if (existingBatch.batch.templateId !== group.templateId
          || existingBatch.batch.templateVersion !== group.templateVersion
          || existingBatch.batch.caseIds.length !== group.caseIds.length
          || group.caseIds.some((caseId) => !existingBatch.batch.caseIds.includes(caseId))) {
          throw new Error(`已存在同名批次但成员/模板不一致: ${batchId}`)
        }
      } else {
        createBatchV2Validated({
          id: batchId, name: succeededByTemplate.size > 1 ? `${request.batchName} · ${template.name}` : request.batchName,
          templateId: group.templateId, templateVersion: group.templateVersion,
          // BATCH-06：政策锁必须来自发布模板的权威已解析引用；缺版本或引用冲突时拒绝创建，不臆造 v1。
          policyVersionLock: resolvePolicyVersionLock(template),
          caseIds: group.caseIds, createdAt: new Date().toISOString(),
        })
      }
      batches.push({ batchId, ...group })
    } catch (cause) {
      batchErrors.push(`${templateKey}：${cause instanceof Error ? cause.message : String(cause)}`)
    }
  }

  const receipt: T06CommitReceipt = {
    requestId: request.requestId, cases,
    ...(batches[0] ? { batchId: batches[0].batchId, batches } : {}),
    ...(batchErrors.length || !batches.length ? { batchError: batchErrors.join('；') || '没有全部原件入库成功的案卷，未创建批次' } : {}),
    inventory: { accepted: selection.entries.length, excluded: selection.excluded, warnings: selection.warnings },
  }
  ledger.status = 'completed'
  ledger.batches = batches
  if (receipt.batchError) ledger.batchError = receipt.batchError
  ledger.receipt = receipt
  saveT06RequestLedger(ledger)
  receipts.set(request.requestId, receipt)
  receiptRequests.set(request.requestId, requestFingerprint)
  // 已落库／失败回执都固定后释放解压缓存；来源压缩字节仍可用于重新选择分案。
  selection.zipDecodedCache = undefined
  return receipt
  } finally {
    activeRequests.delete(request.requestId)
  }
}
