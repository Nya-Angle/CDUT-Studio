/** Main-owned T08/F16 report snapshot, immutable archive, and native export service. */
import { createHash, randomUUID } from 'node:crypto'
import { existsSync, linkSync, mkdirSync, readdirSync, readFileSync, realpathSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve, sep, isAbsolute } from 'node:path'
import type {
  T08Audience, T08LocalSaveRecord, T08Report, T08ReportArchiveSummary,
  T08ReportExportFormat, T08ReportExportReceipt, T08ReportProjection, T08ReportSnapshot,
} from '@profer/shared'
import { makeT08CaseReport, t08ReportWorkbookSheets } from '@profer/shared'
import { getConfigDir } from '../config-paths'
import { getCaseV2Aggregate } from './application-service'
import { assertSafeReviewStorageId } from './review-storage-id'
import { LOCAL_REVIEWER_ACTOR } from './review-ipc-actor-guard'
import { reconcilePiReviewRunsWithReadReceipts } from './pi-case-review-service'
import { listRunsV2 } from './run-store-v2'
import { getTemplate } from './template-store'
import { isWorkspaceRunStaleV2 } from './workspace-business-service-v2'

const REPORT_SNAPSHOT_SCHEMA = 'review-v3-t08-report-snapshot/1' as const
const REPORT_RENDER_VERSION = 't08-report-renderer/2' as const
const AUDIENCES = new Set<T08Audience>(['student', 'reviewer', 'organizer'])
const FORMATS = new Set<T08ReportExportFormat>(['md', 'json', 'html', 'xlsx', 'pdf', 'bundle'])
const EXTENSION: Record<T08ReportExportFormat, string> = {
  md: 'md', json: 'json', html: 'html', xlsx: 'xlsx', pdf: 'pdf', bundle: 'zip',
}

export interface T08ReportServiceDependencies {
  rootDir?: string
  now?: () => string
  chooseDestination?: (defaultName: string, format: T08ReportExportFormat) => Promise<string | undefined>
  renderPdf?: (html: string) => Promise<Uint8Array>
  createdBy?: T08ReportSnapshot['createdBy']
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize)
  if (value && typeof value === 'object') {
    const object = value as Record<string, unknown>
    return Object.fromEntries(Object.keys(object).sort().map((key) => [key, canonicalize(object[key])]))
  }
  return value
}

function canonicalJson(value: unknown): string { return JSON.stringify(canonicalize(value)) }
function sha256(value: string | Uint8Array): string { return createHash('sha256').update(value).digest('hex') }

export function calculateT08ProjectionHash(value: Pick<T08ReportProjection,
  'caseId' | 'caseTitle' | 'caseRevision' | 'runId' | 'audience' | 'inputHash' |
  'templateId' | 'templateVersion' | 'templateDigest' | 'decisionIds' | 'decisionDigest' |
  'historical' | 'reportKind' | 'renderVersion' | 'report'>): string {
  return sha256(canonicalJson({
    caseId: value.caseId, caseTitle: value.caseTitle, caseRevision: value.caseRevision,
    runId: value.runId, audience: value.audience, inputHash: value.inputHash,
    templateId: value.templateId, templateVersion: value.templateVersion,
    templateDigest: value.templateDigest, decisionIds: value.decisionIds,
    decisionDigest: value.decisionDigest, historical: value.historical,
    // 可选字段：旧版归档缺失时 JSON.stringify 省略，保留原有哈希校验语义。
    reportKind: value.reportKind,
    renderVersion: value.renderVersion, report: value.report,
  }))
}

function assertAudience(value: unknown): asserts value is T08Audience {
  if (typeof value !== 'string' || !AUDIENCES.has(value as T08Audience)) throw new Error('报告受众无效')
}
function assertFormat(value: unknown): asserts value is T08ReportExportFormat {
  if (typeof value !== 'string' || !FORMATS.has(value as T08ReportExportFormat)) throw new Error('报告导出格式无效')
}
function validateReportInput(input: { caseId: string; runId: string; audience: T08Audience }): void {
  assertSafeReviewStorageId(input?.caseId, 'caseId')
  assertSafeReviewStorageId(input?.runId, 'runId')
  assertAudience(input?.audience)
}

export function getT08ReportPreviewV3(input: {
  caseId: string; runId: string; audience: T08Audience
}): T08ReportProjection {
  validateReportInput(input)
  const aggregate = getCaseV2Aggregate(input.caseId)
  if (!aggregate) throw new Error('案卷聚合不存在：' + input.caseId)
  const runs = reconcilePiReviewRunsWithReadReceipts(input.caseId, listRunsV2(input.caseId))
  const run = runs.find((item) => item.id === input.runId)
  if (!run || run.caseId !== input.caseId) throw new Error('所选运行不存在或不属于当前案卷')
  const template = getTemplate(run.templateId, run.templateVersion) ?? null
  const stale = isWorkspaceRunStaleV2(aggregate, run.id)
  const selectedRunHistorical = stale || runs[0]?.id !== run.id
  const report = makeT08CaseReport({ aggregate, run, template, audience: input.audience, stale: selectedRunHistorical })
  const historical = report.stale
  const decisions = historical ? [] : aggregate.decisions.filter((item) => item.basedOnRunId === run.id).sort((a, b) => a.at.localeCompare(b.at))
  const projectionBase = {
    schema: 'review-v3-t08-report-projection/1' as const,
    caseId: input.caseId,
    caseTitle: historical ? '历史案卷（原始标题快照不可用）' : aggregate.caseV2.title,
    caseRevision: aggregate.caseV2.revision ?? 0,
    runId: run.id,
    audience: input.audience,
    inputHash: run.inputManifest.hash,
    templateId: run.templateId,
    templateVersion: run.templateVersion,
    templateDigest: template ? sha256(canonicalJson(template)) : null,
    decisionIds: decisions.map((item) => item.id),
    decisionDigest: sha256(canonicalJson(decisions)),
    historical,
    reportKind: report.kind,
    renderVersion: REPORT_RENDER_VERSION,
    report,
  }
  return { ...projectionBase, projectionHash: calculateT08ProjectionHash(projectionBase) }
}

export function makeT08ReportSnapshot(
  projection: T08ReportProjection,
  options: { reportId?: string; createdAt?: string; createdBy?: T08ReportSnapshot['createdBy'] } = {},
): T08ReportSnapshot {
  if (projection.projectionHash !== calculateT08ProjectionHash(projection)) throw new Error('报告预览指纹无效')
  const snapshotBase: Omit<T08ReportSnapshot, 'snapshotHash'> = {
    ...projection,
    schema: REPORT_SNAPSHOT_SCHEMA,
    reportId: options.reportId ?? 'report-' + randomUUID(),
    createdAt: options.createdAt ?? new Date().toISOString(),
    createdBy: options.createdBy ?? { actorId: LOCAL_REVIEWER_ACTOR.actorId, actorSource: 'local', role: 'reviewer' },
  }
  return { ...snapshotBase, snapshotHash: sha256(canonicalJson(snapshotBase)) }
}

export function verifyT08ReportSnapshot(snapshot: T08ReportSnapshot): boolean {
  if (!snapshot || snapshot.schema !== REPORT_SNAPSHOT_SCHEMA || !snapshot.reportId ||
    !snapshot.caseId || !snapshot.runId || !snapshot.snapshotHash || !snapshot.projectionHash ||
    !snapshot.report || snapshot.report.caseId !== snapshot.caseId ||
    snapshot.report.runId !== snapshot.runId || snapshot.report.audience !== snapshot.audience ||
    snapshot.report.stale !== snapshot.historical ||
    (snapshot.reportKind !== undefined && snapshot.report.kind !== snapshot.reportKind)) return false
  let reportData: { caseId?: string; audience?: string; historical?: boolean; reportKind?: string; run?: { id?: string; inputHash?: string; status?: string; templateId?: string; templateVersion?: number } }
  try { reportData = JSON.parse(snapshot.report.json) as typeof reportData } catch { return false }
  if (reportData.caseId !== snapshot.caseId || reportData.audience !== snapshot.audience ||
    reportData.historical !== snapshot.historical || reportData.run?.id !== snapshot.runId ||
    reportData.run?.inputHash !== snapshot.inputHash || reportData.run?.status !== snapshot.report.status ||
    reportData.run?.templateId !== snapshot.templateId || reportData.run?.templateVersion !== snapshot.templateVersion ||
    (snapshot.reportKind !== undefined && reportData.reportKind !== snapshot.reportKind)) return false
  if (snapshot.projectionHash !== calculateT08ProjectionHash(snapshot)) return false
  const { snapshotHash, ...snapshotBase } = snapshot
  return snapshotHash === sha256(canonicalJson(snapshotBase))
}

function reportRoot(rootDir: string, caseId: string): string {
  assertSafeReviewStorageId(caseId, 'caseId')
  return join(rootDir, 'review-cases', caseId, 'reports-v3')
}
function reportArchivePath(rootDir: string, caseId: string, reportId: string): string {
  assertSafeReviewStorageId(reportId, 'reportId')
  return join(reportRoot(rootDir, caseId), reportId)
}

function writeAtomicNewFile(path: string, content: string | Uint8Array): void {
  const temporary = path + '.' + randomUUID() + '.tmp'
  try {
    writeFileSync(temporary, content, { flag: 'wx', mode: 0o600 })
    // Create-if-absent atomically; rename() could overwrite an existing snapshot.
    linkSync(temporary, path)
    unlinkSync(temporary)
  } catch (error) {
    if (existsSync(temporary)) unlinkSync(temporary)
    throw error
  }
}

export function persistT08ReportSnapshot(snapshot: T08ReportSnapshot, rootDir = getConfigDir()): string {
  if (!verifyT08ReportSnapshot(snapshot)) throw new Error('报告快照完整性验证失败，拒绝归档')
  const root = reportRoot(rootDir, snapshot.caseId)
  mkdirSync(root, { recursive: true, mode: 0o700 })
  const directory = reportArchivePath(rootDir, snapshot.caseId, snapshot.reportId)
  mkdirSync(directory, { recursive: false, mode: 0o700 })
  writeAtomicNewFile(join(directory, 'snapshot.json'), JSON.stringify(snapshot, null, 2) + '\n')
  writeAtomicNewFile(join(directory, 'report.md'), snapshot.report.markdown)
  writeAtomicNewFile(join(directory, 'report.json'), snapshot.report.json)
  return directory
}

export function getT08ReportArchiveV3(
  input: { caseId: string; reportId: string },
  rootDir = getConfigDir(),
): T08ReportSnapshot {
  assertSafeReviewStorageId(input?.caseId, 'caseId')
  assertSafeReviewStorageId(input?.reportId, 'reportId')
  const path = join(reportArchivePath(rootDir, input.caseId, input.reportId), 'snapshot.json')
  if (!existsSync(path)) throw new Error('报告档案不存在：' + input.reportId)
  let snapshot: T08ReportSnapshot
  try { snapshot = JSON.parse(readFileSync(path, 'utf-8')) as T08ReportSnapshot }
  catch { throw new Error('报告档案损坏或无法解析：' + input.reportId) }
  if (snapshot.caseId !== input.caseId || snapshot.reportId !== input.reportId || !verifyT08ReportSnapshot(snapshot)) {
    throw new Error('报告档案完整性校验失败：' + input.reportId)
  }
  const directory = reportArchivePath(rootDir, input.caseId, input.reportId)
  if (!existsSync(join(directory, 'report.md')) || !existsSync(join(directory, 'report.json')) ||
    readFileSync(join(directory, 'report.md'), 'utf-8') !== snapshot.report.markdown ||
    readFileSync(join(directory, 'report.json'), 'utf-8') !== snapshot.report.json) {
    throw new Error('报告档案基线文件与不可变快照不一致：' + input.reportId)
  }
  return snapshot
}

/** 原始快照永不修改；每次本机保存结果以独立文件追加。 */
function persistT08LocalSaveRecord(
  snapshot: T08ReportSnapshot,
  record: Omit<T08LocalSaveRecord, 'id' | 'reportId' | 'snapshotHash' | 'recordHash'>,
  rootDir: string,
): T08LocalSaveRecord {
  const base = {
    ...record, id: 'save-' + randomUUID(), reportId: snapshot.reportId, snapshotHash: snapshot.snapshotHash,
  }
  const result = { ...base, recordHash: sha256(canonicalJson(base)) }
  const directory = join(reportArchivePath(rootDir, snapshot.caseId, snapshot.reportId), 'local-save-records')
  mkdirSync(directory, { recursive: true, mode: 0o700 })
  writeAtomicNewFile(join(directory, result.id + '.json'), JSON.stringify(result, null, 2) + '\n')
  return result
}

export function listT08LocalSaveRecordsV3(snapshot: T08ReportSnapshot, rootDir = getConfigDir()): T08LocalSaveRecord[] {
  const directory = join(reportArchivePath(rootDir, snapshot.caseId, snapshot.reportId), 'local-save-records')
  if (!existsSync(directory)) return []
  return readdirSync(directory, { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => {
      const value = JSON.parse(readFileSync(join(directory, entry.name), 'utf8')) as T08LocalSaveRecord
      if (!value || value.id + '.json' !== entry.name || value.reportId !== snapshot.reportId ||
        value.snapshotHash !== snapshot.snapshotHash || !FORMATS.has(value.format) ||
        !['saved', 'cancelled', 'failed'].includes(value.status)) {
        throw new Error('本地保存记录与报告档案不匹配：' + entry.name)
      }
      const { recordHash, ...base } = value
      if (!recordHash || recordHash !== sha256(canonicalJson(base))) {
        throw new Error('本地保存记录完整性校验失败：' + entry.name)
      }
      return value
    }).sort((a, b) => a.at.localeCompare(b.at))
}

/** 更正关系只从案卷当前的追加式决定记录派生，不回写签发时的旧报告。 */
export function findT08ReportAmendments(
  decisionIds: readonly string[],
  decisions: readonly { id: string; amendsDecisionId?: string }[],
): string[] {
  const relatedIds = new Set(decisionIds)
  const result: string[] = []
  // 连续更正 d1→d2→d3 时显示完整后续链，旧快照仍保持不变。
  for (let changed = true; changed;) {
    changed = false
    for (const item of decisions) {
      if (!item.amendsDecisionId || !relatedIds.has(item.amendsDecisionId) || relatedIds.has(item.id)) continue
      relatedIds.add(item.id)
      result.push(item.id)
      changed = true
    }
  }
  return result
}

export function listT08ReportArchivesV3(caseId: string, rootDir?: string): T08ReportArchiveSummary[] {
  const actualRoot = rootDir ?? getConfigDir()
  const root = reportRoot(actualRoot, caseId)
  if (!existsSync(root)) return []
  // 注入隔离根目录的测试/诊断不应意外访问真实用户配置目录。
  const aggregate = rootDir === undefined ? getCaseV2Aggregate(caseId) : null
  const currentRunId = aggregate ? listRunsV2(caseId)[0]?.id : undefined
  return readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => {
    const archivePath = join(root, entry.name)
    try {
      const snapshot = getT08ReportArchiveV3({ caseId, reportId: entry.name }, actualRoot)
      const files = readdirSync(archivePath).filter((name) => name !== 'snapshot.json').sort()
      const hasBaseFiles = files.includes('report.md') && files.includes('report.json')
      let localSaveRecords: T08LocalSaveRecord[] = []
      let localSaveError: string | undefined
      try { localSaveRecords = listT08LocalSaveRecordsV3(snapshot, actualRoot) }
      catch (error) { localSaveError = error instanceof Error ? error.message : String(error) }
      return {
        reportId: snapshot.reportId, caseId: snapshot.caseId, caseTitle: snapshot.caseTitle,
        runId: snapshot.runId, audience: snapshot.audience, inputHash: snapshot.inputHash,
        templateId: snapshot.templateId, templateVersion: snapshot.templateVersion,
        historical: snapshot.historical, reportKind: snapshot.reportKind, createdAt: snapshot.createdAt,
        amendedByDecisionIds: findT08ReportAmendments(snapshot.decisionIds, aggregate?.decisions ?? []),
        noLongerCurrent: !!currentRunId && currentRunId !== snapshot.runId,
        localSaveRecords, ...(localSaveError ? { localSaveError } : {}),
        snapshotHash: snapshot.snapshotHash, archivePath, files,
        valid: hasBaseFiles, ...(!hasBaseFiles ? { error: '报告档案缺少 MD/JSON 基线文件' } : {}),
      }
    } catch (error) {
      return {
        reportId: entry.name, caseId, caseTitle: '无法读取的报告档案', runId: 'unknown',
        audience: 'reviewer' as const, inputHash: '', templateId: 'unknown', templateVersion: 0,
        historical: true, createdAt: '', snapshotHash: '', archivePath,
        files: existsSync(archivePath) ? readdirSync(archivePath).filter((name) => name !== 'snapshot.json').sort() : [],
        valid: false, error: error instanceof Error ? error.message : String(error),
      }
    }
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

export function renderT08ReportHtml(report: T08Report): string {
  return '<!doctype html><html lang="zh"><head><meta charset="utf-8">' +
    '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\';">' +
    '<title>' + escapeHtml('审核报告 · ' + report.caseId + ' · ' + report.runId) + '</title>' +
    '<style>@page{size:A4;margin:18mm}body{font:14px/1.65 system-ui,"Noto Sans CJK SC",sans-serif;margin:0;white-space:pre-wrap;overflow-wrap:anywhere;color:#111}pre{font:inherit;white-space:pre-wrap;overflow-wrap:anywhere;margin:0}@media print{body{margin:0}}</style>' +
    '</head><body><pre>' + escapeHtml(report.markdown) + '</pre></body></html>'
}

function safeSheetValue(value: string): string {
  return /^[\s\u0000-\u001f]*[=+@-]/u.test(value) ? "'" + value : value
}

async function encodeT08Workbook(report: T08Report): Promise<Uint8Array> {
  const XLSX = await import('xlsx')
  const book = XLSX.utils.book_new()
  for (const sheet of t08ReportWorkbookSheets(report)) {
    const rows = sheet.rows.map((row) => row.map(safeSheetValue))
    const worksheet = XLSX.utils.aoa_to_sheet(rows)
    worksheet['!cols'] = rows[0]?.map((_, index) => ({ wch: index === 0 ? 24 : 48 }))
    XLSX.utils.book_append_sheet(book, worksheet, sheet.name)
  }
  return new Uint8Array(XLSX.write(book, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer)
}

function manifestFor(snapshot: T08ReportSnapshot, files: Array<{ name: string; bytes: Uint8Array }>) {
  return {
    schema: 'review-v3-f16-delivery/2',
    kind: 'read-only-report',
    reportId: snapshot.reportId,
    snapshotHash: snapshot.snapshotHash,
    caseId: snapshot.caseId,
    runId: snapshot.runId,
    audience: snapshot.audience,
    inputHash: snapshot.inputHash,
    template: snapshot.templateId + '@' + snapshot.templateVersion,
    runStatus: snapshot.report.status,
    historical: snapshot.historical,
    createdAt: snapshot.createdAt,
    files: files.map((file) => ({ name: file.name, size: file.bytes.byteLength, sha256: sha256(file.bytes) })),
    notice: '本包的 SHA-256 只校验文件与清单内容一致，不是数字签名、身份认证、学校审批或外部收件回执。',
  }
}

async function encodeT08Bundle(snapshot: T08ReportSnapshot, renderPdf: (html: string) => Promise<Uint8Array>): Promise<Uint8Array> {
  const report = snapshot.report
  const files = [
    { name: 'report.md', bytes: new TextEncoder().encode(report.markdown) },
    { name: 'report.json', bytes: new TextEncoder().encode(report.json) },
    { name: 'report.html', bytes: new TextEncoder().encode(renderT08ReportHtml(report)) },
    { name: 'report.xlsx', bytes: await encodeT08Workbook(report) },
    { name: 'report.pdf', bytes: await renderPdf(renderT08ReportHtml(report)) },
  ]
  const JSZip = (await import('jszip')).default
  const archive = new JSZip()
  for (const file of files) archive.file(file.name, file.bytes)
  archive.file('manifest.json', JSON.stringify(manifestFor(snapshot, files), null, 2))
  archive.file('README.txt', [
    'CDUT Studio V3 · F16 只读报告交付包',
    '报告档案：' + snapshot.reportId,
    '案卷：' + snapshot.caseId,
    '运行：' + snapshot.runId,
    '受众：' + snapshot.audience,
    snapshot.historical ? '此报告基于历史或过期运行，不代表案卷当前状态。' : '此报告绑定生成时的输入与决定版本。',
    'PDF 为可检索文字，HTML 使用内嵌样式且不加载远端资源。',
    'manifest.json 中的 SHA-256 用于完整性校验，不是数字签名或发送者认证。',
    '本包不包含原件本体，不构成学校审批、离线回复或外部系统已收件证明。',
  ].join('\n'))
  return new Uint8Array(await archive.generateAsync({ type: 'uint8array', compression: 'DEFLATE', compressionOptions: { level: 5 } }))
}

export async function encodeT08ReportFormat(
  report: T08Report,
  format: T08ReportExportFormat,
  renderPdf: (html: string) => Promise<Uint8Array>,
  snapshot?: T08ReportSnapshot,
): Promise<Uint8Array> {
  assertFormat(format)
  if (format === 'md') return new TextEncoder().encode(report.markdown)
  if (format === 'json') return new TextEncoder().encode(report.json)
  if (format === 'html') return new TextEncoder().encode(renderT08ReportHtml(report))
  if (format === 'xlsx') return encodeT08Workbook(report)
  if (format === 'pdf') return renderPdf(renderT08ReportHtml(report))
  if (!snapshot) throw new Error('生成 F16 交接包必须绑定已归档 ReportSnapshot')
  if (snapshot.report.caseId !== report.caseId || snapshot.report.runId !== report.runId ||
    snapshot.report.audience !== report.audience || snapshot.report.markdown !== report.markdown ||
    snapshot.report.json !== report.json || !verifyT08ReportSnapshot(snapshot)) {
    throw new Error('F16 交接包输入与已归档 ReportSnapshot 不一致')
  }
  return encodeT08Bundle(snapshot, renderPdf)
}

async function renderPdfWithBrowserWindow(html: string): Promise<Uint8Array> {
  const { BrowserWindow } = require('electron') as typeof import('electron')
  const window = new BrowserWindow({
    show: false, width: 900, height: 1200,
    webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false },
  })
  try {
    await window.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html))
    return new Uint8Array(await window.webContents.printToPDF({
      pageSize: 'A4', printBackground: true, preferCSSPageSize: true,
    }))
  } finally {
    if (!window.isDestroyed()) window.destroy()
  }
}

async function chooseDestination(defaultName: string, format: T08ReportExportFormat): Promise<string | undefined> {
  const { dialog } = require('electron') as typeof import('electron')
  const { getMainWindow } = require('../main-window-state') as typeof import('../main-window-state')
  const window = getMainWindow()
  const options = {
    title: '导出审核报告',
    defaultPath: defaultName,
    filters: [{ name: format === 'bundle' ? 'ZIP 交接包' : format.toUpperCase() + ' 报告', extensions: [EXTENSION[format]] }],
  }
  const result = window ? await dialog.showSaveDialog(window, options) : await dialog.showSaveDialog(options)
  return result.canceled ? undefined : result.filePath
}

function safeFilename(value: string): string {
  const cleaned = value.replace(/[^\p{L}\p{N}._-]+/gu, '_').replace(/^\.+/, '').slice(0, 100)
  return cleaned || 'review-report'
}

function isWithinDir(base: string, target: string): boolean {
  const rel = relative(base, target)
  return rel === '' || (rel !== '..' && !rel.startsWith('..' + sep) && !isAbsolute(rel))
}

/** Save-as may replace a user export, never any case data or a different report snapshot. */
export function assertT08ExportDestination(rootDir: string, destinationPath: string): void {
  if (typeof destinationPath !== 'string' || !destinationPath.trim()) throw new Error('导出目标路径不能为空')
  const protectedRoot = resolve(rootDir, 'review-cases')
  const target = resolve(destinationPath)
  const canonicalProtected = existsSync(protectedRoot) ? realpathSync(protectedRoot) : protectedRoot
  const canonicalTarget = existsSync(target)
    ? realpathSync(target)
    : join(realpathSync(dirname(target)), basename(target))
  if (isWithinDir(protectedRoot, target) || isWithinDir(canonicalProtected, canonicalTarget)) {
    throw new Error('导出目标不能覆盖案卷数据或不可变报告档案')
  }
}

function writeExportedFile(path: string, bytes: Uint8Array): void {
  const temporary = path + '.' + randomUUID() + '.tmp'
  try {
    writeFileSync(temporary, bytes, { flag: 'wx', mode: 0o600 })
    // A failed external copy must not truncate a previous successfully saved report.
    renameSync(temporary, path)
  } catch (error) {
    if (existsSync(temporary)) unlinkSync(temporary)
    throw error
  }
}

export async function exportT08ReportV3(
  input: { caseId: string; runId: string; audience: T08Audience; format: T08ReportExportFormat; expectedProjectionHash: string },
  dependencies: T08ReportServiceDependencies = {},
): Promise<T08ReportExportReceipt> {
  assertFormat(input?.format)
  const projection = getT08ReportPreviewV3(input)
  if (projection.projectionHash !== input.expectedProjectionHash) {
    throw new Error('报告预览已过期：案卷、输入、模板或决定发生变化，请刷新后重新导出')
  }
  return exportT08ReportProjectionV3(projection, input.format, dependencies)
}

export async function exportT08ReportProjectionV3(
  projection: T08ReportProjection,
  format: T08ReportExportFormat,
  dependencies: T08ReportServiceDependencies = {},
): Promise<T08ReportExportReceipt> {
  assertFormat(format)
  if (projection.projectionHash !== calculateT08ProjectionHash(projection)) throw new Error('报告预览指纹无效')
  const snapshotOptions = {
    ...(dependencies.now ? { createdAt: dependencies.now() } : {}),
    ...(dependencies.createdBy ? { createdBy: dependencies.createdBy } : {}),
  }
  const snapshot = makeT08ReportSnapshot(projection, snapshotOptions)
  const rootDir = dependencies.rootDir ?? getConfigDir()
  const archivePath = persistT08ReportSnapshot(snapshot, rootDir)
  return saveT08ReportLocally(snapshot, format, archivePath, rootDir, dependencies, true)
}

/** 统一新导出/历史重导出的本机保存及事实回执，不冒充收件或正式签发。 */
async function saveT08ReportLocally(
  snapshot: T08ReportSnapshot, format: T08ReportExportFormat,
  archivePath: string, rootDir: string, dependencies: T08ReportServiceDependencies,
  createArchiveDelivery: boolean,
): Promise<T08ReportExportReceipt> {
  const now = dependencies.now ?? (() => new Date().toISOString())
  const baseReceipt = {
    reportId: snapshot.reportId, snapshotHash: snapshot.snapshotHash, caseId: snapshot.caseId,
    runId: snapshot.runId, audience: snapshot.audience, format, archivePath,
  }
  let fileHash: string | undefined
  let savedPath: string | undefined
  try {
    const bytes = await encodeT08ReportFormat(snapshot.report, format, dependencies.renderPdf ?? renderPdfWithBrowserWindow, snapshot)
    fileHash = sha256(bytes)
    const archiveFilePath = createArchiveDelivery ? join(archivePath, 'delivery.' + EXTENSION[format]) : undefined
    if (archiveFilePath) writeAtomicNewFile(archiveFilePath, bytes)
    const destination = await (dependencies.chooseDestination ?? chooseDestination)(
      safeFilename(snapshot.caseId + '-' + snapshot.runId + '-' + snapshot.audience) + '.' + EXTENSION[format], format,
    )
    if (!destination) {
      persistT08LocalSaveRecord(snapshot, { format, status: 'cancelled', at: now(), fileHash }, rootDir)
      return { ...baseReceipt, status: 'cancelled', ...(archiveFilePath ? { archiveFilePath } : {}) }
    }
    assertT08ExportDestination(rootDir, destination)
    writeExportedFile(destination, bytes)
    savedPath = destination
    const savedAt = now()
    persistT08LocalSaveRecord(snapshot, { format, status: 'saved', at: savedAt, fileHash, filePath: destination }, rootDir)
    return { ...baseReceipt, status: 'saved', ...(archiveFilePath ? { archiveFilePath } : {}), filePath: destination, savedAt }
  } catch (error) {
    // 已实际保存但记录失败时不能再写“保存失败”，错误消息须明确告知文件可能已在目标位置。
    if (savedPath) throw new Error('报告已保存至 ' + savedPath + '，但本地保存回执记录失败：' + String(error))
    try {
      persistT08LocalSaveRecord(snapshot, {
        format, status: 'failed', at: now(), ...(fileHash ? { fileHash } : {}),
        error: error instanceof Error ? error.message : String(error),
      }, rootDir)
    } catch { /* 原始失败原因优先返回，归档记录不可用将在后续审计中发现。 */ }
    throw error
  }
}


/** Agent-assigned report creation: persist a Main-projected snapshot without opening a native save dialog. */
export function archiveT08ReportV3(
  input: { caseId: string; runId: string; audience: T08Audience },
  dependencies: T08ReportServiceDependencies = {},
): { reportId: string; snapshotHash: string; caseId: string; runId: string; audience: T08Audience; archivePath: string; filePath: string; jsonPath: string } {
  const projection = getT08ReportPreviewV3(input)
  const snapshotOptions = {
    ...(dependencies.now ? { createdAt: dependencies.now() } : {}),
    ...(dependencies.createdBy ? { createdBy: dependencies.createdBy } : {}),
  }
  const snapshot = makeT08ReportSnapshot(projection, snapshotOptions)
  const archivePath = persistT08ReportSnapshot(snapshot, dependencies.rootDir ?? getConfigDir())
  return {
    reportId: snapshot.reportId, snapshotHash: snapshot.snapshotHash,
    caseId: snapshot.caseId, runId: snapshot.runId, audience: snapshot.audience,
    archivePath, filePath: join(archivePath, 'report.md'), jsonPath: join(archivePath, 'report.json'),
  }
}

export async function exportT08ReportArchiveV3(
  input: { caseId: string; reportId: string; format: T08ReportExportFormat },
  dependencies: T08ReportServiceDependencies = {},
): Promise<T08ReportExportReceipt> {
  assertFormat(input?.format)
  const rootDir = dependencies.rootDir ?? getConfigDir()
  const snapshot = getT08ReportArchiveV3(input, rootDir)
  const archivePath = reportArchivePath(rootDir, input.caseId, input.reportId)
  return saveT08ReportLocally(snapshot, input.format, archivePath, rootDir, dependencies, false)
}
