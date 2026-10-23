/**
 * 模板仓库（M1，设计 03 §7/§11）
 *
 * 存储：{configDir}/review-templates/{templateId}/versions/{version}.json
 * - draft 可改；publish 生成不可变版本（publishedAfterWrite 校验）
 * - validate：悬空字段/材料槽引用、流程循环、评分范围与缺失策略（02 §5.6 发布检查）
 * - 全部纯 Node（bun test 直跑），不引入本地数据库
 */

import { closeSync, existsSync, mkdirSync, openSync, readdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { hostname } from 'node:os'
import { join } from 'node:path'
import { countAuthoredCriteria, validateT01TypedCriteria, type TemplateVersion } from '@profer/shared'
import { validatePolicyRef } from './policy-store'
import { getConfigDir } from '../config-paths'
import { archiveTemplateInCatalog, isTemplateArchived, listArchivedTemplateIds, orderTemplateIds, reorderTemplateCatalog, restoreTemplateInCatalog } from './template-catalog'

export const TEMPLATE_SCHEMA_VERSION = 2
const SAFE_TEMPLATE_ID = /^[\p{L}\p{N}_-]{1,120}$/u

/** 模板 ID 允许中文等 Unicode 字母/数字，但不允许路径分隔符或点号。 */
export function isSafeTemplateId(value: unknown): value is string {
  return typeof value === 'string' && SAFE_TEMPLATE_ID.test(value)
}

function templatesRoot(): string {
  const dir = join(getConfigDir(), 'review-templates')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}

function versionPath(templateId: string, version: number): string {
  return join(templatesRoot(), templateId, 'versions', `${version}.json`)
}

function writeAtomic(filePath: string, data: unknown): void {
  const tmp = `${filePath}.tmp`
  writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8')
  renameSync(tmp, filePath)
}


/**
 * 发布资格存储由模板服务维护，独立于可自由修改的 TemplateVersion.sourceNote。
 *
 * regular-draft：现有本地自建/内置模板发布流程的兼容资格，不表示已核实校规；
 * candidate-held：D0.5/D1 候选永不通过普通草稿编辑操作解锁。
 *
 * 旧历史版本没有资格记录时拒绝首次发布，需通过 saveDraft() 重新登记；
 * 发布前在同一版本锁内读取资格，避免编辑与发布并发交错。
 */
type PublicationClass = 'regular-draft' | 'candidate-held'
interface PublicationControl {
  schemaVersion: 1
  templateId: string
  version: number
  classification: PublicationClass
}
function controlDir(templateId: string): string {
  return join(getConfigDir(), 'review-template-controls', templateId)
}
function controlPath(templateId: string, version: number): string {
  return join(controlDir(templateId), version + '.json')
}
function readPublicationControl(templateId: string, version: number): PublicationControl | undefined {
  const path = controlPath(templateId, version)
  if (!existsSync(path)) return undefined
  let candidate: PublicationControl
  try { candidate = JSON.parse(readFileSync(path, 'utf8')) as PublicationControl }
  catch { throw new Error('模板发布资格登记损坏，拒绝发布') }
  if (candidate.schemaVersion !== 1 || candidate.templateId !== templateId || candidate.version !== version ||
      !['regular-draft', 'candidate-held'].includes(candidate.classification)) {
    throw new Error('模板发布资格登记不合法，拒绝发布')
  }
  return candidate
}
function isCandidateDraft(template: TemplateVersion): boolean {
  return template.sourceNote?.startsWith('D0.5_DEMO_ONLY:') === true ||
    template.sourceNote?.startsWith('D1_AUTHORING_CANDIDATE:') === true ||
    ((template.sections ?? []).some((section) =>
      section.id === 'semantic-tasks' && section.criteria.some((criterion) => criterion.id.startsWith('demo-'))))
}
function registerPublicationControl(template: TemplateVersion, forceCandidate: boolean): PublicationControl {
  const existing = readPublicationControl(template.templateId, template.version)
  const classification: PublicationClass = forceCandidate || existing?.classification === 'candidate-held' || isCandidateDraft(template)
    ? 'candidate-held' : 'regular-draft'
  const next: PublicationControl = {
    schemaVersion: 1, templateId: template.templateId, version: template.version, classification,
  }
  const dir = controlDir(template.templateId)
  mkdirSync(dir, { recursive: true })
  // 同一版本锁内更新资格。已进入 candidate-held 时不能被普通 saveDraft 降级。
  writeAtomic(controlPath(template.templateId, template.version), next)
  return next
}
interface VersionLockRecord {
  schemaVersion: 1
  token: string
  pid: number
  hostname: string
  acquiredAt: string
  operation: string
}

/** 单次保存/发布是短事务；超过该时限的锁按“崩溃遗留”隔离并留证据。 */
const VERSION_LOCK_STALE_MS = 30 * 60 * 1000
/** 旧版本没有写入锁内容，只能按 mtime 判定：短命进程正常持锁不会超过该值。 */
const LEGACY_LOCK_STALE_MS = 10 * 60 * 1000

function processAlive(pid: number): boolean {
  if (!Number.isSafeInteger(pid) || pid <= 0) return false
  if (pid === process.pid) return true
  try { process.kill(pid, 0); return true }
  catch (error) { return (error as NodeJS.ErrnoException)?.code === 'EPERM' }
}

function readVersionLock(lockPath: string): { record?: VersionLockRecord; ageMs: number } {
  const stats = statSync(lockPath)
  try { return { record: JSON.parse(readFileSync(lockPath, 'utf8')) as VersionLockRecord, ageMs: Date.now() - stats.mtimeMs } }
  catch { return { ageMs: Date.now() - stats.mtimeMs } }
}

/**
 * TAR-17：版本锁不再“EExist 即永久阻塞”。
 * - 同主机且 pid 已消失 → 立即视为遗留；
 * - 任意锁超过 30 分钟（旧空锁 10 分钟）→ 视为遗留；
 * - 隔离为 `.lock.stale-<ts>-<pid>` 保留证据，不静默删除；
 * - 释放时核对 token，绝不删除后来者新建的锁。
 */
function acquireVersionLock(lockPath: string, operation: string): { fd: number; token: string } {
  try {
    const fd = openSync(lockPath, 'wx')
    const token = randomUUID()
    const record: VersionLockRecord = {
      schemaVersion: 1, token, pid: process.pid, hostname: hostname(),
      acquiredAt: new Date().toISOString(), operation,
    }
    writeFileSync(fd, JSON.stringify(record))
    return { fd, token }
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code !== 'EEXIST') throw error
    let observed: { record?: VersionLockRecord; ageMs: number }
    try { observed = readVersionLock(lockPath) }
    catch (statError) {
      if ((statError as NodeJS.ErrnoException)?.code === 'ENOENT') return acquireVersionLock(lockPath, operation)
      throw error
    }
    const { record, ageMs } = observed
    const sameHost = record?.hostname === hostname()
    const limit = record ? VERSION_LOCK_STALE_MS : LEGACY_LOCK_STALE_MS
    const stale = sameHost && record ? (!processAlive(record.pid) || ageMs > limit) : ageMs > limit
    if (!stale) {
      throw new Error(
        `模板版本正在被其他进程保存/发布（pid ${record?.pid ?? '未知'}，已持有 ${Math.round(ageMs / 1000)}s）。`
        + `如确认该进程已崩溃，可在锁超过 ${Math.round(limit / 60000)} 分钟后重试；不要手工删除仍在运行的锁`,
      )
    }
    const quarantine = `${lockPath}.stale-${Date.now()}-${process.pid}`
    try {
      renameSync(lockPath, quarantine)
      console.warn(`[审核模板] 已隔离崩溃遗留版本锁: ${quarantine}`)
    } catch (renameError) {
      if ((renameError as NodeJS.ErrnoException)?.code === 'ENOENT') return acquireVersionLock(lockPath, operation)
      throw renameError
    }
    return acquireVersionLock(lockPath, operation)
  }
}

function releaseVersionLock(lockPath: string, token: string): void {
  try {
    const record = JSON.parse(readFileSync(lockPath, 'utf8')) as VersionLockRecord
    if (record?.token === token) unlinkSync(lockPath)
  } catch { /* 已被隔离或替换：不能删除别人的锁 */ }
}

function withTemplateVersionLock<T>(templateId: string, version: number, operation: () => T): T {
  if (!isSafeTemplateId(templateId) || !Number.isSafeInteger(version) || version < 1) throw new Error('模板 ID/版本不合法')
  const dir = controlDir(templateId)
  mkdirSync(dir, { recursive: true })
  const lock = join(dir, version + '.lock')
  const { fd, token } = acquireVersionLock(lock, 'template-version')
  try { return operation() }
  finally { closeSync(fd); releaseVersionLock(lock, token) }
}

/**
 * 停用元数据与版本正文分离：历史 `templateId@version` 的内容哈希永久不可变，
 * 停用只改变「是否可继续新建/选用」这一外部状态，不重写已发布 JSON。
 */
interface RetirementRecord {
  schemaVersion: 1
  templateId: string
  version: number
  retiredAt: string
  reason?: string
}
function retirementPath(templateId: string, version: number): string {
  return join(controlDir(templateId), version + '.retired.json')
}
export function readRetirement(templateId: string, version: number): RetirementRecord | undefined {
  if (!isSafeTemplateId(templateId) || !Number.isSafeInteger(version) || version < 1) return undefined
  const path = retirementPath(templateId, version)
  if (!existsSync(path)) return undefined
  try {
    const record = JSON.parse(readFileSync(path, 'utf8')) as RetirementRecord
    if (record.schemaVersion !== 1 || record.templateId !== templateId || record.version !== version) return undefined
    return record
  } catch { return undefined }
}
export function isTemplateVersionRetired(templateId: string, version: number): boolean {
  return readRetirement(templateId, version) !== undefined
}

/** 读取磁盘上的版本正文（不做停用投影）；停用状态只存在于独立 sidecar。 */
function readTemplateBody(templateId: string, version?: number): TemplateVersion | undefined {
  if (!isSafeTemplateId(templateId)) return undefined
  const dir = join(templatesRoot(), templateId, 'versions')
  if (!existsSync(dir)) return undefined
  const versions = readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => Number(name.replace('.json', '')))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => b - a)
  const target = version ?? versions[0]
  if (target === undefined || !existsSync(versionPath(templateId, target))) return undefined
  try {
    const template = JSON.parse(readFileSync(versionPath(templateId, target), 'utf-8')) as TemplateVersion
    // v1 内置综测模板在 requiredAt 引入前已被本地用户保存；迁移仅补足
    // 该内置模板证书槽的生命周期语义，其余旧模板仍按 submission 兼容默认值处理。
    if (templateId === 'comprehensive-assessment-v2') {
      return {
        ...template,
        materialSlots: template.materialSlots.map((slot) => slot.requiredAt !== undefined ? slot : {
          ...slot,
          requiredAt: slot.id === 'certificates' ? 'decision' : 'submission',
        }),
      }
    }
    return template
  } catch (error) {
    console.warn(`[审核模板] 模板解析失败: ${templateId}@${target}`, error)
    return undefined
  }
}

/**
 * 读取模板；version 缺省取最大已存版本。
 * 停用只投影状态，绝不改写版本正文：`templateId@version` 内容哈希保持不可变，
 * 而所有真实读取方（模板库、路由目录、T07 批次新鲜度）都能看到 deprecated。
 */
export function getTemplate(templateId: string, version?: number): TemplateVersion | undefined {
  const body = readTemplateBody(templateId, version)
  if (!body) return undefined
  if (body.status === 'published' && isTemplateVersionRetired(body.templateId, body.version)) {
    return { ...body, status: 'deprecated' }
  }
  return body
}

/** 列出全部模板（每个取最新版本） */
export function listTemplates(): TemplateVersion[] {
  const root = templatesRoot()
  if (!existsSync(root)) return []
  const out: TemplateVersion[] = []
  for (const entry of readdirSync(root)) {
    if (isTemplateArchived(entry)) continue
    const latest = getTemplate(entry)
    if (latest) out.push(latest)
  }
  const orderedIds = orderTemplateIds(out.map((template) => template.templateId))
  const rank = new Map(orderedIds.map((id, index) => [id, index]))
  return out.sort((a, b) => (rank.get(a.templateId) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.templateId) ?? Number.MAX_SAFE_INTEGER))
}

/** 列出模板的全部版本，供版本历史、已发布版本选择和草稿编辑使用。 */
export function listTemplateVersions(): TemplateVersion[] {
  const root = templatesRoot()
  if (!existsSync(root)) return []
  const out: TemplateVersion[] = []
  for (const templateId of readdirSync(root)) {
    if (isTemplateArchived(templateId)) continue
    const dir = join(root, templateId, 'versions')
    if (!existsSync(dir)) continue
    const versions = readdirSync(dir)
      .filter((name) => name.endsWith('.json'))
      .map((name) => Number(name.replace('.json', '')))
      .filter((version) => Number.isFinite(version))
      .sort((a, b) => b - a)
    for (const version of versions) {
      const template = getTemplate(templateId, version)
      if (template) out.push(template)
    }
  }
  const orderedIds = orderTemplateIds([...new Set(out.map((template) => template.templateId))])
  const rank = new Map(orderedIds.map((id, index) => [id, index]))
  return out.sort((a, b) => (rank.get(a.templateId) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.templateId) ?? Number.MAX_SAFE_INTEGER) || b.version - a.version)
}

/** 已移出模板库的模板只用于恢复操作；历史案卷仍可通过 getTemplate 读取固定版本。 */
export function listArchivedTemplates(): TemplateVersion[] {
  return listArchivedTemplateIds().flatMap((templateId) => {
    const template = getTemplate(templateId)
    return template ? [template] : []
  })
}

/** 保存用户排序；模板内容版本与展示顺序分开存储。 */
export function reorderTemplates(templateIds: string[]): TemplateVersion[] {
  const available = listTemplates()
  const availableIds = new Set(available.map((template) => template.templateId))
  if (templateIds.length !== available.length || templateIds.some((id) => !availableIds.has(id))) {
    throw new Error('模板顺序与当前模板库不一致，请刷新后重试')
  }
  reorderTemplateCatalog(templateIds)
  return listTemplates()
}

/** 从模板库移除模板；发布版本和已引用案卷历史保留。 */
export function removeTemplateFromLibrary(templateId: string): void {
  if (!getTemplate(templateId)) throw new Error(`模板不存在: ${templateId}`)
  archiveTemplateInCatalog(templateId)
}

export function restoreTemplateToLibrary(templateId: string): TemplateVersion {
  const template = getTemplate(templateId)
  if (!template) throw new Error(`模板不存在: ${templateId}`)
  restoreTemplateInCatalog(templateId)
  return template
}

/** 保存草稿（status 强制 draft；version 不可与已有 published 冲突） */
function saveDraftControlled(template: TemplateVersion, forceCandidate: boolean): TemplateVersion {
  if (template.status !== 'draft') throw new Error('saveDraft 只接受草稿状态模板')
  return withTemplateVersionLock(template.templateId, template.version, () => {
    const existing = readTemplateBody(template.templateId, template.version)
    if (existing && existing.status === 'published') {
      throw new Error(`版本 ${template.version} 已发布不可覆盖；请提升版本号`)
    }
    // 停用只写元数据，正文仍是 published；旧案卷引用必须继续读到完全相同的内容。
    if (isTemplateVersionRetired(template.templateId, template.version)) {
      throw new Error(`版本 ${template.version} 已停用，历史内容不可覆写；请提升版本号`)
    }
    // 先登记（如需则永久封存）服务端资格，再写可编辑的草稿正文。
    // 写入中途失败只可能导致旧草稿被拒绝发布，不会意外放行候选。
    registerPublicationControl(template, forceCandidate)
    const filePath = versionPath(template.templateId, template.version)
    mkdirSync(join(templatesRoot(), template.templateId, 'versions'), { recursive: true })
    writeAtomic(filePath, template)
    return template
  })
}
/**
 * D2 读取候选身份必须来自服务层控制记录，不能把可编辑 sourceNote 当成发布/运行资格。
 * 资格记录缺失、版本错误或损坏即拒止；不创建新资格、不更改模板。
 */
export function isAuthoringCandidateDraft(templateId: string, version: number): boolean {
  if (!isSafeTemplateId(templateId) || !Number.isSafeInteger(version) || version < 1) return false
  const control = readPublicationControl(templateId, version)
  return control?.classification === 'candidate-held' && getTemplate(templateId, version)?.status === 'draft'
}

/** 通用本地草稿编辑不具备把既有 candidate-held 转成可发布模板的权限。 */
export function saveDraft(template: TemplateVersion): TemplateVersion {
  return saveDraftControlled(template, false)
}
/**
 * D1 作者态专用入口：由内部编译/存储服务强制登记不可发布资格。
 * 不依据用户可编辑的 sourceNote，也不提供任何候选解锁接口。
 */
export function saveAuthoringCandidateDraft(template: TemplateVersion): TemplateVersion {
  return saveDraftControlled(template, true)
}

export interface TemplateValidationIssue {
  level: 'error' | 'warning'
  message: string
}

/**
 * 模板验证（02 §5.6 发布检查）：
 * - 无悬空字段/材料槽/政策引用；无流程循环；评分有范围与缺失策略
 * - 发布要求 error 清零；warning 允许带发布
 */
export function validateTemplate(template: TemplateVersion): TemplateValidationIssue[] {
  const issues: TemplateValidationIssue[] = []
  const fieldKeys = new Set(template.fields.map((field) => field.key))
  const slotIds = new Set(template.materialSlots.map((slot) => slot.id))
  const sections = template.sections ?? []
  const sectionIds = new Set(sections.map((section) => section.id))
  const orderedSectionValues = new Set<number>()

  if (new Set(template.fields.map((field) => field.key)).size !== template.fields.length) issues.push({ level: 'error', message: '字段编号重复' })
  if (new Set(template.materialSlots.map((slot) => slot.id)).size !== template.materialSlots.length) issues.push({ level: 'error', message: '材料槽编号重复' })

  if (new Set(sections.map((section) => section.id)).size !== sections.length) {
    issues.push({ level: 'error', message: '审核分项 ID 重复' })
  }
  // TAR-14：最终规则身份是 `section-<sectionId>-<criterionId>`，必须整体唯一，
  // 否则 (a-b, c) 与 (a, b-c) 这类拼接会在运行期撞成同一 origin。
  const compositeRuleIds = new Set<string>()
  for (const section of sections) {
    for (const criterion of Array.isArray(section.criteria) ? section.criteria : []) {
      const ruleId = `section-${section.id}-${criterion.id}`
      if (compositeRuleIds.has(ruleId)) {
        issues.push({ level: 'error', message: `规则 ID 冲突：分项「${section.name}」的要求「${criterion.id}」与其他分项拼接后同为 ${ruleId}` })
      }
      compositeRuleIds.add(ruleId)
    }
  }
  for (const section of sections) {
    if (!section.id.trim() || !section.name.trim()) issues.push({ level: 'error', message: '每个审核分项都必须有 ID 和名称' })
    if (!Number.isInteger(section.order) || section.order < 0 || orderedSectionValues.has(section.order)) {
      issues.push({ level: 'error', message: `分项「${section.name || section.id}」的顺序无效或重复` })
    }
    orderedSectionValues.add(section.order)
    const criteria = Array.isArray(section.criteria) ? section.criteria : []
    if (section.required && criteria.length === 0) {
      issues.push({ level: 'error', message: `必需分项「${section.name}」至少需要一条审核要求` })
    }
    const criterionIds = new Set<string>()
    for (const criterion of criteria) {
      if (!criterion.id.trim() || !criterion.title.trim() || !criterion.requirement.trim()) {
        issues.push({ level: 'error', message: `分项「${section.name}」中的审核要求缺少编号、名称或内容` })
      }
      if (criterionIds.has(criterion.id)) issues.push({ level: 'error', message: `分项「${section.name}」存在重复要求编号 ${criterion.id}` })
      criterionIds.add(criterion.id)
      if (criterion.dataCheck) {
        const check = criterion.dataCheck
        const validColumn = (value: string | undefined): boolean => !!value && /^[A-Z]{1,3}$/i.test(value)
        if (criterion.execution !== 'deterministic') issues.push({ level: 'error', message: `审核要求「${criterion.title}」配置了确定性数据检查，执行方式必须是确定性` })
        if (!slotIds.has(check.materialSlotId)) issues.push({ level: 'error', message: `审核要求「${criterion.title}」引用了不存在的工作簿材料槽 ${check.materialSlotId}` })
        if (!Number.isInteger(check.firstDataRow) || check.firstDataRow < 1) issues.push({ level: 'error', message: `审核要求「${criterion.title}」的数据起始行必须是正整数` })
        if (!validColumn(check.valueColumn) || (check.labelColumn !== undefined && !validColumn(check.labelColumn))) issues.push({ level: 'error', message: `审核要求「${criterion.title}」的列编号无效，请使用 A、B、AA 等列名` })
        if ((check.stopLabels?.length ?? 0) > 0 && !check.labelColumn) issues.push({ level: 'error', message: `审核要求「${criterion.title}」配置了停止标签，但没有指定标签列` })
        if (check.kind === 'sheet-sum-match') {
          const applicantField = template.fields.find((field) => field.key === check.applicantFieldKey)
          if (!applicantField || applicantField.kind !== 'number' || applicantField.scope !== 'case') issues.push({ level: 'error', message: `审核要求「${criterion.title}」必须绑定一个案卷级数字字段作为申报值` })
          if ((check.quantityColumn && !validColumn(check.quantityColumn)) || (check.unitPriceColumn && !validColumn(check.unitPriceColumn))) issues.push({ level: 'error', message: `审核要求「${criterion.title}」的数量/单价列编号无效` })
          if (!!check.quantityColumn !== !!check.unitPriceColumn) issues.push({ level: 'error', message: `审核要求「${criterion.title}」的数量列和单价列必须同时填写` })
        }
      }
    }
  }
  for (const field of template.fields) {
    if (field.sectionId && !sectionIds.has(field.sectionId)) issues.push({ level: 'error', message: `字段 ${field.key} 指向不存在的审核分项 ${field.sectionId}` })
    if (field.sectionId && (field.scope ?? 'subject') !== 'subject') issues.push({ level: 'error', message: `分项字段 ${field.key} 必须是事项字段` })
  }
  for (const slot of template.materialSlots) {
    if (slot.sectionId && !sectionIds.has(slot.sectionId)) issues.push({ level: 'error', message: `材料槽 ${slot.id} 指向不存在的审核分项 ${slot.sectionId}` })
  }

  // 字段合法性：条件必填引用的字段必须存在
  for (const field of template.fields) {
    if (field.kind === 'number' && field.min !== undefined && field.max !== undefined && field.min > field.max) {
      issues.push({ level: 'error', message: `字段 ${field.key} 的 min 大于 max` })
    }
  }
  // 条件树引用的字段（field op）必须可解析
  const condFields = (ast: unknown): string[] => {
    if (!ast || typeof ast !== 'object') return []
    const node = ast as Record<string, unknown>
    if (Array.isArray(node.all)) return node.all.flatMap(condFields)
    if (Array.isArray(node.any)) return node.any.flatMap(condFields)
    if (node.not) return condFields(node.not)
    if (typeof node.field === 'string') return [node.field]
    return []
  }
  for (const field of template.fields) {
    for (const ref of condFields(field.conditionRequired)) {
      if (!fieldKeys.has(ref)) issues.push({ level: 'error', message: `字段 ${field.key} 的条件必填引用了不存在的字段 ${ref}` })
    }
  }
  // 材料槽：requiredWhen 引用存在；min<=max
  for (const slot of template.materialSlots) {
    for (const ref of condFields(slot.requiredWhen)) {
      if (!fieldKeys.has(ref)) issues.push({ level: 'error', message: `材料槽 ${slot.id} 的条件引用了不存在的字段 ${ref}` })
    }
    if (slot.minCount > slot.maxCount) issues.push({ level: 'error', message: `材料槽 ${slot.id} 的 minCount 大于 maxCount` })
  }
  // 政策引用存在性由仓库层核对（getPolicyVersion），模板侧仅检查非空数组声明
  const authoredCriteria = countAuthoredCriteria(template)
  // 旧模板可能只引用 policyVersionIds，由政策版本提供规则；发布门禁不把这条历史路径判死。
  const hasPolicyBacking = (template.policyRefs?.length ?? 0) + template.policyVersionIds.length > 0
  if (template.policyVersionIds.length === 0 && template.stages.some((stage) => stage.kind === 'auto-check') && authoredCriteria === 0) {
    issues.push({ level: 'warning', message: '模板声明了自动检查阶段但没有引用任何政策版本' })
  }
  // TAR-13：发布必须区分“业务规则模板”和“仅材料/人工模板”。
  // 自动检查阶段没有 authored criteria 时不一定为空转——运行时仍可消费案卷级
  // AI/人工确认规则；因此这里不阻断发布，但必须如实警告并派生执行范围。
  if (authoredCriteria === 0 && !hasPolicyBacking && !sections.some((section) => (section.criteria ?? []).some((criterion) => criterion.dataCheck))) {
    issues.push({ level: 'warning', message: template.stages.some((stage) => stage.kind === 'auto-check')
      ? '模板没有任何内置审核标准：自动检查阶段只能消费运行时确认的案卷规则；发布后标记为仅材料/人工模板'
      : '模板没有任何审核标准：发布后只能核对材料与人工办理，将被标记为仅材料/人工模板' })
  }
  // N1b：精确政策引用校验（存在+已发布+hash 一致；缺失即 error 阻止发布）
  for (const ref of template.policyRefs ?? []) {
    const check = validatePolicyRef(ref)
    if (!check.ok) issues.push({ level: 'error', message: check.reason ?? '政策引用校验失败' })
  }
  // 流程：无循环（阶段序列中同一阶段不得出现两次）、终态必须是 finalize 或 handoff 之外的确定性结尾
  const stageIds = template.stages.map((stage) => stage.id)
  if (new Set(stageIds).size !== stageIds.length) issues.push({ level: 'error', message: '流程存在重复阶段 ID（循环/重复定义）' })
  if (template.stages.length === 0) issues.push({ level: 'error', message: '流程为空' })
  const stagesById = new Map(template.stages.map((stage) => [stage.id, stage]))
  for (const stage of template.stages) {
    if (stage.nextStageId && !stagesById.has(stage.nextStageId)) {
      issues.push({ level: 'error', message: `流程阶段 ${stage.name} 指向不存在的下一阶段 ${stage.nextStageId}` })
    }
    if (stage.returnToStageId && !stagesById.has(stage.returnToStageId)) {
      issues.push({ level: 'error', message: `流程阶段 ${stage.name} 指向不存在的退回阶段 ${stage.returnToStageId}` })
    }
  }
  if (template.stages[0] && stageIds.length === new Set(stageIds).size) {
    const reachable = new Set<string>()
    let stageId: string | undefined = template.stages[0].id
    while (stageId) {
      if (reachable.has(stageId)) {
        issues.push({ level: 'error', message: `流程从阶段 ${stagesById.get(stageId)?.name ?? stageId} 开始形成循环，无法结束` })
        break
      }
      reachable.add(stageId)
      stageId = stagesById.get(stageId)?.nextStageId
    }
    for (const stage of template.stages) {
      if (!reachable.has(stage.id)) issues.push({ level: 'error', message: `流程阶段 ${stage.name} 无法从首阶段到达` })
    }
  }
  // 评分：有量表则必须有精度与缺失策略，且权重合法
  if (template.rubric) {
    const weightSum = template.rubric.dimensions.reduce((sum, dimension) => sum + dimension.weight, 0)
    if (template.rubric.dimensions.some((dimension) => dimension.min >= dimension.max)) {
      issues.push({ level: 'error', message: '量表存在 min>=max 的维度' })
    }
    if (weightSum <= 0) issues.push({ level: 'error', message: '量表维度权重之和必须为正' })
    if (template.rubric.missingStrategy !== 'block' && template.rubric.missingStrategy !== 'exclude') {
      issues.push({ level: 'error', message: '量表缺少缺评策略' })
    }
  }
  // 输出可见性引用的角色必须合法（字段级检查交给类型层）
  if (template.outputs.length === 0) issues.push({ level: 'warning', message: '未配置任何输出，发布后只能查看原始数据' })
  return issues
}

/** 发布：draft → published 不可变；error 清零才允许（02 §5.6） */
export function publishTemplate(templateId: string, version: number): TemplateVersion {
  return withTemplateVersionLock(templateId, version, () => {
    const template = readTemplateBody(templateId, version)
    if (!template) throw new Error(`模板不存在: ${templateId}@${version}`)
    // 已停用版本只允许历史读取，不得借发布操作复活或改写正文。
    if (isTemplateVersionRetired(templateId, version)) {
      throw new Error(`版本 ${version} 已停用，不可重新发布；请提升版本号`)
    }
    if (template.status === 'published') return template
    // 在实际发布事务中核验服务端资格；可修改的 sourceNote 不是授权凭据。
    const control = readPublicationControl(templateId, version)
    if (!control || control.classification !== 'regular-draft' || isCandidateDraft(template)) {
      // 兼容既有调用者的错误提示，发布决定始终只由服务端资格及校验作出。
      if (template.sourceNote?.startsWith('D0.5_DEMO_ONLY:')) throw new Error('D0.5 演示草稿不得发布为正式审核模板')
      if (template.sourceNote?.startsWith('D1_AUTHORING_CANDIDATE:')) throw new Error('D1 作者态候选尚未经过制度治理，不得正式发布')
      throw new Error('模板发布资格未获允许：候选/演示草稿或未登记版本不得正式发布')
    }
    const issues = validateTemplate(template)
    const errors = issues.filter((issue) => issue.level === 'error')
    if (errors.length > 0) {
      throw new Error(`模板未通过发布检查：${errors.map((issue) => issue.message).join('；')}`)
    }
    // TAR-08：Renderer 的编辑器校验不是可信门禁；发布事务必须重跑同一份 T01 校验。
    const typedErrors = validateT01TypedCriteria(template)
    if (typedErrors.length > 0) {
      throw new Error(`模板未通过 T01 类型规则发布检查：${typedErrors.join('；')}`)
    }
    const hasPolicy = (template.policyRefs?.length ?? 0) + template.policyVersionIds.length > 0
    const executionScope = countAuthoredCriteria(template) === 0 && !hasPolicy ? 'material-manual-only' as const : 'rules' as const
    const published: TemplateVersion = {
      ...template, status: 'published', executionScope, publishedAt: new Date().toISOString(),
    }
    writeAtomic(versionPath(templateId, version), published)
    console.log(`[审核模板] 已发布: ${templateId}@${version}`)
    return published
  })
}

/**
 * 停用（仅已发布版本可停用；保留历史可读）。
 * 只写独立停用元数据，绝不重写版本正文，保证 `templateId@version` 内容哈希不变。
 */
export function deprecateTemplate(templateId: string, version: number, reason?: string): TemplateVersion {
  return withTemplateVersionLock(templateId, version, () => {
    const template = readTemplateBody(templateId, version)
    if (!template) throw new Error(`模板不存在: ${templateId}@${version}`)
    if (template.status !== 'published') throw new Error('只有已发布版本可停用')
    if (isTemplateVersionRetired(templateId, version)) return { ...template, status: 'deprecated' as const }
    const record: RetirementRecord = {
      schemaVersion: 1, templateId, version, retiredAt: new Date().toISOString(),
      ...(reason?.trim() ? { reason: reason.trim() } : {}),
    }
    mkdirSync(controlDir(templateId), { recursive: true })
    writeAtomic(retirementPath(templateId, version), record)
    console.log(`[审核模板] 已停用: ${templateId}@${version}`)
    return { ...template, status: 'deprecated' as const }
  })
}
