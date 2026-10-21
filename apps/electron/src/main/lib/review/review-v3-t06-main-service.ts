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
import { closeSync, lstatSync, openSync, readFileSync, readSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join, relative, sep } from 'node:path'
import { BrowserWindow, dialog } from 'electron'
import type { Actor } from '@profer/shared'
import { CommandValidationError, readAggregate } from './case-store-v2'
import { createCaseFromTemplate } from './application-service'
import { getTemplate } from './template-store'
import { createBatchV2 } from './batch-store'
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

export interface T06PhysicalSelection {
  selectionId: string
  previewFingerprint: string
  sourceKind: T06SourceKind
  entries: T06PhysicalEntry[]
  warnings?: string[]
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

export interface T06ItemReceipt { entryId: string; documentVersionId: string }
export interface T06CaseReceipt {
  groupId: string
  caseId?: string
  documents: T06ItemReceipt[]
  status: 'done' | 'failed'
  error?: string
}
export interface T06CommitReceipt {
  requestId: string
  cases: T06CaseReceipt[]
  batchId?: string
  /** 混合业务会按已发布模板拆为多个真实批次，而不是伪造跨模板锁。 */
  batches?: Array<{ batchId: string; templateId: string; templateVersion: number; caseIds: string[] }>
  batchError?: string
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
function walkDirectory(root: string): Array<{ absolutePath: string; relativePath: string; byteLength: number }> {
  const results: Array<{ absolutePath: string; relativePath: string; byteLength: number }> = []
  const visit = (current: string): void => {
    if (results.length >= MAX_ENTRIES) return
    for (const name of readdirSync(current)) {
      if (name.startsWith('.')) continue
      const full = join(current, name)
      const stats = lstatSync(full)
      if (stats.isSymbolicLink()) continue
      if (stats.isDirectory()) { visit(full); continue }
      if (!stats.isFile() || stats.size > MAX_ENTRY_BYTES) continue
      results.push({ absolutePath: full, relativePath: relative(root, full).split(sep).join('/'), byteLength: stats.size })
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
  const entries: StoredEntry[] = []
  let zipBytes: Uint8Array | undefined

  if (sourceKind === 'folder') {
    const listed = walkDirectory(target)
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
      if (receipt.status === 'rejected') warnings.push(`${receipt.entryName}：${receipt.reason ?? '被拒绝'}`)
    }
    for (const accepted of decoded.accepted) {
      if (entries.length >= MAX_ENTRIES) { warnings.push(`ZIP 条目超过 ${MAX_ENTRIES} 条，已截断`); break }
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
    fingerprint: fingerprintOf(entries), sourceKind, entries, warnings, createdAt: Date.now(),
    ...(zipBytes ? { zipBytes } : {}),
  }
  selections.set(selection.selectionId, selection)
  return {
    selectionId: selection.selectionId,
    previewFingerprint: selection.fingerprint,
    sourceKind,
    entries: entries.map((entry): T06PhysicalEntry => ({
      entryId: entry.entryId, relativePath: entry.relativePath, byteLength: entry.byteLength,
    })),
    ...(warnings.length > 0 ? { warnings } : {}),
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
async function registerEntry(selection: StoredSelection, entry: StoredEntry, caseId: string): Promise<string> {
  const identity = `${selection.selectionId}\u0000${caseId}\u0000${entry.entryId}`
  const cached = registered.get(identity)
  if (cached) return cached
  const bytes = bytesOf(selection, entry)
  const tempPath = join(tmpdir(), `t06-${sha256(identity).slice(0, 24)}-${basename(entry.relativePath) || 'entry.bin'}`)
  writeFileSync(tempPath, bytes)
  try {
    const aggregate = readAggregate(caseId)
    if (!aggregate) throw new CommandValidationError('NOT_FOUND', '案卷不存在')
    // 案卷类型决定写入通道：原生 V3 案卷走原生登记，模板创建的 V2 案卷走 V2 材料服务
    const versionId = isNativeWorkspaceCaseV3(aggregate)
      ? await (async () => {
        const document = await registerNativeWorkspaceMaterialV3(caseId, tempPath, 'evidence', MAIN_ACTOR)
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
          payload: { sourcePath: tempPath, role: 'evidence' } as never,
        })
        if (!written.ok) throw new CommandValidationError(written.code, written.message)
        if (!written.entity) throw new CommandValidationError('INVALID_TRANSITION', '原件已登记但未返回版本记录')
        return written.entity.versionId
      })()
    registered.set(identity, versionId)
    return versionId
  } finally {
    try { unlinkSync(tempPath) } catch { /* 无法清理时不掩盖原有写入失败 */ }
  }
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

  const selection = selections.get(request.selectionId)
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
      if (group.action === 'create') {
        caseId = `case-${sha256(request.requestId + '\u0000' + group.groupId).slice(0, 24)}`
        const created = await createCaseFromTemplate(templateId!, templateVersion!, {
          title: group.title?.trim() || group.groupId,
          fieldValues: { applicant: group.applicant ?? '' },
          subjects: [],
        } as never, MAIN_ACTOR, caseId)
        if (!created.ok) throw new CommandValidationError(created.code, created.message)
      } else if (!caseId) {
        throw new CommandValidationError('VALIDATION_FAILED', '绑定既有案卷缺少 caseId')
      }
      if (group.action === 'existing') {
        const existing = readAggregate(caseId!)
        if (!existing || existing.caseV2.templateId !== templateId || existing.caseV2.templateVersion !== templateVersion) {
          throw new CommandValidationError('VALIDATION_FAILED', '已有案卷的模板版本与本组选择不一致')
        }
      }
      const documents: Array<{ entryId: string; documentVersionId: string }> = []
      const failures: string[] = []
      for (const entryId of group.entryIds) {
        const entry = byEntry.get(entryId)
        if (!entry) { failures.push(`${entryId}：不在本次来源中`); continue }
        try {
          documents.push({ entryId, documentVersionId: await registerEntry(selection, entry, caseId!) })
        } catch (cause) {
          failures.push(`${entry.relativePath}：${cause instanceof Error ? cause.message : String(cause)}`)
        }
      }
      if (failures.length > 0) {
        // 部分失败：案卷与已入库原件保留，但不作为批次成功成员
        cases.push({ groupId: group.groupId, caseId, documents, status: 'failed', error: failures.join('；') })
      } else {
        cases.push({ groupId: group.groupId, caseId, documents, status: 'done' })
        const key = `${templateId!}@${templateVersion!}`
        const item = succeededByTemplate.get(key) ?? { templateId: templateId!, templateVersion: templateVersion!, caseIds: [] }
        item.caseIds.push(caseId!)
        succeededByTemplate.set(key, item)
      }
    } catch (cause) {
      cases.push({
        groupId: group.groupId, ...(caseId ? { caseId } : {}), documents: [], status: 'failed',
        error: cause instanceof Error ? cause.message : String(cause),
      })
    }
  }

  const batches: NonNullable<T06CommitReceipt['batches']> = []
  const batchErrors: string[] = []
  for (const [templateKey, group] of succeededByTemplate) {
    try {
      const template = getTemplate(group.templateId, group.templateVersion)
      if (!template || template.status !== 'published') throw new Error('模板在入库后被撤销发布')
      const batchId = `batch-${sha256(request.requestId + '\u0000' + templateKey).slice(0, 20)}`
      createBatchV2({
        id: batchId, name: succeededByTemplate.size > 1 ? `${request.batchName} · ${template.name}` : request.batchName,
        templateId: group.templateId, templateVersion: group.templateVersion,
        // 政策版本锁沿用模板声明的政策版本，不在此处臆造版本号
        policyVersionLock: (template.policyVersionIds ?? []).map((policyVersionId) => ({
          policyVersionId, version: 1,
        })),
        caseIds: group.caseIds, createdAt: new Date().toISOString(),
      })
      batches.push({ batchId, ...group })
    } catch (cause) {
      batchErrors.push(`${templateKey}：${cause instanceof Error ? cause.message : String(cause)}`)
    }
  }

  const receipt: T06CommitReceipt = {
    requestId: request.requestId, cases,
    ...(batches[0] ? { batchId: batches[0].batchId, batches } : {}),
    ...(batchErrors.length || !batches.length ? { batchError: batchErrors.join('；') || '没有全部原件入库成功的案卷，未创建批次' } : {}),
  }
  receipts.set(request.requestId, receipt)
  receiptRequests.set(request.requestId, requestFingerprint)
  // 已落库／失败回执都固定后释放解压缓存；来源压缩字节仍可用于重新选择分案。
  selection.zipDecodedCache = undefined
  return receipt
}
