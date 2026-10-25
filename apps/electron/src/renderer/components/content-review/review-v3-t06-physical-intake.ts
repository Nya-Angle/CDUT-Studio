/** T06 physical batch split. Main owns picker, original bytes, Case/Document/Batch commits. */
export type T06SourceKind = 'folder' | 'zip'
export interface T06PhysicalEntry {
  entryId: string // opaque Main-issued token, NEVER a local absolute path
  relativePath: string
  byteLength: number
}
export interface T06PhysicalExcludedEntry { relativePath: string; reason: string }
export interface T06PhysicalSelection {
  selectionId: string
  previewFingerprint: string
  sourceKind: T06SourceKind
  entries: T06PhysicalEntry[]
  warnings?: string[] // Main-owned inventory skips/rejects, never silent successes
  /** 逐文件未入库审计清单（跳过/拒绝/截断），由 Main 生成，不是渲染层猜测。 */
  excluded?: T06PhysicalExcludedEntry[]
}
export interface T06PhysicalGroup {
  groupId: string
  name: string
  entries: T06PhysicalEntry[]
  unassigned: boolean
}
export interface T06PhysicalPreview {
  source: T06PhysicalSelection
  groups: T06PhysicalGroup[]
  errors: string[]
  unassignedCount: number
}
export interface T06GroupOptions {
  stripCommonRoot?: boolean
  rootFileGroups?: Readonly<Record<string, string>>
}
function partsOf(path: string): string[] | null {
  if (!path || path.startsWith('/') || path.startsWith('\\') || /^[a-z]:/i.test(path)) return null
  const parts = path.replace(/\\/g, '/').split('/')
  if (parts.some(x => !x || x === '.' || x === '..' || /[\u0000-\u001f\u007f]/.test(x))) return null
  return parts
}
/** One first-level folder = one candidate case. Root-level files require explicit grouping. */
export function previewT06PhysicalImport(source: T06PhysicalSelection, options: T06GroupOptions = {}): T06PhysicalPreview {
  const errors: string[] = []
  if (!source.selectionId?.trim() || !source.previewFingerprint?.trim() ||
      !['folder', 'zip'].includes(source.sourceKind)) {
    return { source, groups: [], errors: ['缺少 Main 验证的物理来源'], unassignedCount: 0 }
  }
  const files: Array<{ entry: T06PhysicalEntry; parts: string[] }> = []
  const paths = new Set<string>(), tokens = new Set<string>()
  for (const entry of source.entries) {
    const parts = partsOf(entry.relativePath)
    if (!entry.entryId || tokens.has(entry.entryId) || !parts ||
        !Number.isSafeInteger(entry.byteLength) || entry.byteLength < 0) {
      errors.push('来源记录无效或重复：' + (entry.relativePath || entry.entryId || '未知')); continue
    }
    tokens.add(entry.entryId)
    const key = parts.join('/').normalize('NFC').toLocaleLowerCase()
    if (paths.has(key)) { errors.push('重复文件路径：' + entry.relativePath); continue }
    paths.add(key)
    files.push({ entry, parts })
  }
  const roots = new Set(files.map(x => x.parts[0]))
  const strip = !!options.stripCommonRoot && roots.size === 1 && files.every(x => x.parts.length >= 2)
  if (options.stripCommonRoot && !strip && files.length) errors.push('无法剥离共有顶层目录')
  const groups = new Map<string, T06PhysicalGroup>()
  let unassignedCount = 0
  for (const file of files) {
    const parts = strip ? file.parts.slice(1) : file.parts
    const rootFile = parts.length === 1
    const explicit = options.rootFileGroups?.[file.entry.entryId]?.trim()
    const unassigned = rootFile && !explicit
    const name = unassigned ? '未归属：' + parts[0]! : (rootFile ? explicit! : parts[0]!)
    const groupId = unassigned ? 'unassigned:' + file.entry.entryId : 'group:' + name
    if (unassigned) unassignedCount++
    const group: T06PhysicalGroup = groups.get(groupId) ?? { groupId, name, entries: [], unassigned }
    group.entries.push(file.entry)
    groups.set(groupId, group)
  }
  return { source, groups: [...groups.values()], errors, unassignedCount }
}
export type T06MaterialRole = 'application' | 'evidence' | 'rule' | 'attachment'
export interface T06EntryAssignment { entryId: string; role?: T06MaterialRole; materialSlotId?: string }
export interface T06CommitSubject {
  id?: string; title: string
  type?: 'item' | 'clause' | 'project' | 'budget-line' | 'custom'
  sectionId?: string; fieldValues?: Record<string, unknown>
}
export type T06GroupChoice =
  | { action: 'create'; title: string; applicant: string; templateId?: string; templateVersion?: number
      fieldValues?: Record<string, unknown>; subjects?: T06CommitSubject[]; entryAssignments?: T06EntryAssignment[] }
  | { action: 'existing'; caseId: string; templateId?: string; templateVersion?: number
      entryAssignments?: T06EntryAssignment[] }
  | { action: 'exclude' }
export interface T06CommitGroup {
  groupId: string
  entryIds: string[]
  action: 'create' | 'existing'
  title?: string
  applicant?: string
  caseId?: string
  templateId?: string
  templateVersion?: number
  fieldValues?: Record<string, unknown>
  subjects?: T06CommitSubject[]
  entryAssignments?: T06EntryAssignment[]
}
export interface T06PhysicalCommitRequest {
  requestId: string
  selectionId: string
  previewFingerprint: string
  templateId?: string
  templateVersion?: number
  batchName: string
  groups: T06CommitGroup[]
}
/** Only explicit grouping, applicant and template-compatible binding may be committed. */
export function planT06PhysicalImport(
  preview: T06PhysicalPreview,
  decisions: Readonly<Record<string, T06GroupChoice>>,
  input: {
    requestId: string; templateId?: string; templateVersion?: number; batchName: string; knownCaseIds: readonly string[]
    knownCases?: ReadonlyArray<{ caseId: string; templateId: string; templateVersion: number }>
  },
): { request?: T06PhysicalCommitRequest; errors: string[] } {
  const errors = [...preview.errors], groups: T06CommitGroup[] = []
  if (!input.requestId?.trim() || !input.batchName?.trim()) errors.push('批次名称或请求号无效')
  if (!preview.groups.length) errors.push('没有可导入的材料')
  const known = new Set(input.knownCaseIds), assigned = new Set<string>()
  for (const group of preview.groups) {
    const decision = decisions[group.groupId]
    if (!decision) { errors.push('尚未确认：' + group.name); continue }
    if (decision.action === 'exclude') continue
    if (group.unassigned) { errors.push('根目录文件尚未指定案卷组：' + group.name); continue }
    const templateId = decision.templateId ?? input.templateId
    const templateVersion = decision.templateVersion ?? input.templateVersion
    if (!templateId?.trim() || !Number.isSafeInteger(templateVersion) || !templateVersion || templateVersion < 1) {
      errors.push('尚未为案卷确认业务模板：' + group.name); continue
    }
    if (decision.action === 'create') {
      // 申请人只是模板可选的案卷字段之一；缺它不应阻断“先入库后补录”。
      if (!decision.title.trim()) { errors.push('新案卷缺标题：' + group.name); continue }
      groups.push({ groupId: group.groupId, entryIds: group.entries.map(e => e.entryId),
        action: 'create', title: decision.title.trim(), applicant: decision.applicant.trim(), templateId, templateVersion,
        ...(decision.fieldValues ? { fieldValues: decision.fieldValues } : {}),
        ...(decision.subjects ? { subjects: decision.subjects } : {}),
        ...(decision.entryAssignments ? { entryAssignments: decision.entryAssignments } : {}) })
    } else {
      if (!known.has(decision.caseId) || assigned.has(decision.caseId)) {
        errors.push('案卷不存在、模板版本不一致或重复绑定：' + group.name); continue
      }
      const existing = input.knownCases?.find(item => item.caseId === decision.caseId)
      if (existing && (existing.templateId !== templateId || existing.templateVersion !== templateVersion)) {
        errors.push('已有关联案卷的模板与当前组不一致：' + group.name); continue
      }
      assigned.add(decision.caseId)
      groups.push({ groupId: group.groupId, entryIds: group.entries.map(e => e.entryId),
        action: 'existing', caseId: decision.caseId, templateId, templateVersion,
        ...(decision.entryAssignments ? { entryAssignments: decision.entryAssignments } : {}) })
    }
  }
  if (!groups.length) errors.push('没有确认纳入的案卷')
  return errors.length ? { errors } : { errors: [], request: {
    requestId: input.requestId, selectionId: preview.source.selectionId,
    previewFingerprint: preview.source.previewFingerprint, templateId: input.templateId,
    templateVersion: input.templateVersion, batchName: input.batchName.trim(), groups,
  } }
}
export interface T06ItemReceipt {
  entryId: string; documentVersionId: string
  role?: T06MaterialRole; materialSlotId?: string
}
export interface T06CaseReceipt {
  groupId: string
  caseId?: string
  documents: T06ItemReceipt[]
  status: 'done' | 'failed'
  error?: string
  warnings?: string[]
}
export interface T06CommitReceipt {
  requestId: string
  cases: T06CaseReceipt[]
  batchId?: string
  batches?: Array<{ batchId: string; templateId: string; templateVersion: number; caseIds: string[] }>
  batchError?: string
  inventory?: { accepted: number; excluded: T06PhysicalExcludedEntry[]; warnings: string[] }
}
/** Main implements these through its existing trusted case/material/batch writer. */
export interface T06PhysicalWriterPorts {
  createCase(input: { requestId: string; title: string; applicant: string; templateId: string; templateVersion: number }): Promise<string>
  importEntry(input: { requestId: string; selectionId: string; previewFingerprint: string; entryId: string; caseId: string }): Promise<T06ItemReceipt>
  createBatch(input: { requestId: string; name: string; templateId: string; templateVersion: number; caseIds: string[] }): Promise<string>
}
/** Independently failing groups remain recoverable; only fully imported cases enter batch. */
export async function executeT06PhysicalImport(request: T06PhysicalCommitRequest, ports: T06PhysicalWriterPorts): Promise<T06CommitReceipt> {
  const cases: T06CaseReceipt[] = []
  const succeededByTemplate = new Map<string, { templateId: string; templateVersion: number; caseIds: string[] }>()
  for (const group of request.groups) {
    let caseId = group.caseId
    const documents: T06ItemReceipt[] = []
    try {
      const templateId = group.templateId ?? request.templateId
      const templateVersion = group.templateVersion ?? request.templateVersion
      if (!templateId || !templateVersion) throw new Error('案卷没有可用的模板版本')
      if (group.action === 'create') caseId = await ports.createCase({
        requestId: request.requestId + ':' + group.groupId + ':create',
        templateId, templateVersion,
        title: group.title!, applicant: group.applicant!,
      })
      if (!caseId) throw new Error('案卷不存在')
      for (const entryId of group.entryIds) {
        documents.push(await ports.importEntry({
          requestId: request.requestId + ':' + group.groupId + ':' + entryId,
          selectionId: request.selectionId, previewFingerprint: request.previewFingerprint, entryId, caseId,
        }))
      }
      cases.push({ groupId: group.groupId, caseId, documents, status: 'done' })
      const key = `${templateId}@${templateVersion}`
      const entry = succeededByTemplate.get(key) ?? { templateId, templateVersion, caseIds: [] }
      entry.caseIds.push(caseId)
      succeededByTemplate.set(key, entry)
    } catch (cause) {
      cases.push({ groupId: group.groupId, caseId, documents, status: 'failed',
        error: cause instanceof Error ? cause.message : String(cause) })
    }
  }
  if (!succeededByTemplate.size) return { requestId: request.requestId, cases }
  const batches: NonNullable<T06CommitReceipt['batches']> = []
  const errors: string[] = []
  for (const [key, group] of succeededByTemplate) {
    try {
      const batchId = await ports.createBatch({ requestId: request.requestId + ':batch:' + key,
        name: succeededByTemplate.size === 1 ? request.batchName : request.batchName + ' · ' + key,
        ...group })
      batches.push({ batchId, ...group })
    } catch (cause) { errors.push(key + '：' + (cause instanceof Error ? cause.message : String(cause))) }
  }
  return { requestId: request.requestId, cases, ...(batches[0] ? { batchId: batches[0].batchId, batches } : {}),
    ...(errors.length ? { batchError: errors.join('；') } : {}) }
}
