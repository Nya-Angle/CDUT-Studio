/** F16 只读交付：冻结已投影报告的文件哈希，不处理回件或学校回执（归 F18）。 */
import { t08ReportWorkbookSheets, type T08Report, type T08WorkbookSheet } from './review-v3-t08-case-report'

export interface F16DeliveryFile {
  name: string
  bytes: Uint8Array
}

/** 报告投影能证明的受众；它没有携带 Main 授权凭据，unknown 不等于未授权，更不能当作学校授权。 */
export type F16AudienceAuthorization = 'granted' | 'unknown'

export interface F16DeliveryManifest {
  /** 本地只读适配器独立 schema，刻意不与 Main 的 review-v3-f16-delivery/2 同名。 */
  schema: 'review-v3-f16-local-delivery/2'
  kind: 'read-only-report'
  caseId: string
  runId: string
  audience: T08Report['audience']
  /** schema /2 报告没有 Main 授权证据，只能记录 unknown；Renderer 自报角色不构成授权。 */
  audienceAuthorization: F16AudienceAuthorization
  /** 仅旧 /1 报告显式携带合法归档代次时保留；未知时省略，绝不以 0 冒充第一代归档。 */
  archiveCycle?: number
  /** schema /2 的报告性质；旧 /1 报告未记录时省略。 */
  reportKind?: NonNullable<T08Report['kind']>
  inputHash: string
  template: string
  runStatus: string
  historical: boolean
  exportedAt: string
  files: Array<{ name: string; size: number; sha256: string }>
  notice: string
}

const encoder = new TextEncoder()
const REPORT_SCHEMA_V1 = 'review-v3-t08-report/1'
const REPORT_SCHEMA_V2 = 'review-v3-t08-report/2'
const REPORT_KINDS = new Set<NonNullable<T08Report['kind']>>([
  'preliminary', 'supplement-needed', 'decided', 'historical',
])

/** 报告 JSON 的只读投影；只读取报告 schema 真正提供的字段。 */
interface F16ReportProjection {
  schema?: string
  caseId: string
  audience: string
  historical: boolean
  reportKind?: string
  /** 旧 /1 合同字段；/2 不读取，避免把未知归档状态误当成 0。 */
  archiveCycle?: { archiveCycle?: number }
  run: {
    id: string
    inputHash: string
    templateId: string
    templateVersion: number
    status: string
  }
}

function f16ReportKind(value: string): NonNullable<T08Report['kind']> | null {
  return REPORT_KINDS.has(value as NonNullable<T08Report['kind']>)
    ? value as NonNullable<T08Report['kind']>
    : null
}

export function f16TextBytes(content: string): Uint8Array {
  return encoder.encode(content)
}

export function f16SafeSpreadsheetSheet(sheet: T08WorkbookSheet): T08WorkbookSheet {
  // 即使未来换用 CSV 等输出器，也不要把原件文本以公式解释。
  return {
    name: sheet.name,
    rows: sheet.rows.map((row) => row.map((value) => /^[\s\u0000-\u001f]*[=+@-]/u.test(value) ? "'" + value : value)),
  }
}

export async function encodeF16ReportWorkbook(report: T08Report): Promise<Uint8Array> {
  const XLSX = await import('xlsx')
  const book = XLSX.utils.book_new()
  for (const projected of t08ReportWorkbookSheets(report)) {
    const sheet = f16SafeSpreadsheetSheet(projected)
    const worksheet = XLSX.utils.aoa_to_sheet(sheet.rows)
    worksheet['!cols'] = sheet.rows[0]?.map((_, index) => ({ wch: index === 0 ? 24 : 48 }))
    XLSX.utils.book_append_sheet(book, worksheet, sheet.name)
  }
  return new Uint8Array(XLSX.write(book, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer)
}

export async function makeF16DeliveryManifest(
  report: T08Report,
  files: F16DeliveryFile[],
  exportedAt = new Date().toISOString(),
): Promise<F16DeliveryManifest> {
  if (!files.length) throw new Error('交接包没有可导出的报告文件')
  // 元数据来自报告内不可变的所选 Run 投影，防止清单与文件各讲一个版本。
  let projection: F16ReportProjection
  try { projection = JSON.parse(report.json) as F16ReportProjection }
  catch { throw new Error('交接包报告 JSON 无效') }
  const sourceSchema = projection.schema
  if (sourceSchema !== REPORT_SCHEMA_V1 && sourceSchema !== REPORT_SCHEMA_V2) {
    throw new Error('交接包报告 schema 不受支持')
  }
  if (!projection.run?.inputHash || !projection.run?.templateId ||
    typeof projection.run.templateVersion !== 'number' ||
    projection.caseId !== report.caseId || projection.run.id !== report.runId ||
    projection.run.status !== report.status || projection.audience !== report.audience ||
    projection.historical !== report.stale) {
    throw new Error('交接包报告与所选 Run/受众/快照不一致')
  }
  const projectionKind = projection.reportKind === undefined ? undefined : f16ReportKind(projection.reportKind)
  if (projectionKind === null) throw new Error('交接包报告性质无效')
  if (report.kind !== undefined && projectionKind !== undefined && report.kind !== projectionKind) {
    throw new Error('交接包报告性质与投影不一致')
  }
  const reportKind = report.kind ?? projectionKind
  // 只有旧 /1 合同明确记录过的归档代次才能读取；/2 没有该证据，保持省略（unknown）。
  const archiveCycle = sourceSchema === REPORT_SCHEMA_V1 &&
    typeof projection.archiveCycle?.archiveCycle === 'number' &&
    Number.isInteger(projection.archiveCycle.archiveCycle) &&
    projection.archiveCycle.archiveCycle >= 0
    ? projection.archiveCycle.archiveCycle
    : undefined
  const seen = new Set<string>()
  const entries: F16DeliveryManifest['files'] = []
  for (const file of files) {
    if (!/^[a-z0-9][a-z0-9._-]*$/i.test(file.name) || seen.has(file.name.toLowerCase()) ||
      ['manifest.json', 'readme.txt'].includes(file.name.toLowerCase())) {
      throw new Error('交接包文件名非法或重复：' + file.name)
    }
    seen.add(file.name.toLowerCase())
    const digest = await crypto.subtle.digest('SHA-256', Uint8Array.from(file.bytes))
    entries.push({ name: file.name, size: file.bytes.byteLength,
      sha256: [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('') })
  }
  return {
    // 本地 schema 只证明所选报告/Run/受众与文件哈希一致，不冒充 Main 签发清单或快照绑定。
    schema: 'review-v3-f16-local-delivery/2',
    kind: 'read-only-report',
    caseId: report.caseId,
    runId: report.runId,
    audience: report.audience,
    // 受众是报告投影的结果，不是 Main 授权回执；没有可信证据时不能写成已授权。
    audienceAuthorization: 'unknown',
    ...(archiveCycle === undefined ? {} : { archiveCycle }),
    ...(reportKind === undefined ? {} : { reportKind }),
    inputHash: projection.run.inputHash,
    template: projection.run.templateId + '@' + projection.run.templateVersion,
    runStatus: report.status,
    historical: report.stale,
    exportedAt,
    files: entries,
    notice: '本包只证明所选报告/Run/受众与文件哈希一致，不是数字签名、学校审批或离线业务回执；受众授权不由报告投影或本清单授予，归档代次缺失即未知。',
  }
}

/** 所有报告文件和校验清单一次生成；不打包原件，也没有 F18 回件写入动作。 */
export async function encodeF16ReportBundle(report: T08Report, files: F16DeliveryFile[]): Promise<Uint8Array> {
  // 压缩包中的主报告必须与签发投影逐字节一致，不能换成另一受众或历史 Run 的正文。
  for (const [name, body] of [['report.md', report.markdown], ['report.json', report.json]] as const) {
    const file = files.find((entry) => entry.name === name)
    const expected = f16TextBytes(body)
    if (!file || file.bytes.length !== expected.length || file.bytes.some((value, index) => value !== expected[index])) {
      throw new Error('交接包 ' + name + ' 与所选报告投影不一致')
    }
  }
  const [{ default: JSZip }, manifest] = await Promise.all([
    import('jszip'), makeF16DeliveryManifest(report, files),
  ])
  const archive = new JSZip()
  for (const file of files) archive.file(file.name, file.bytes)
  archive.file('manifest.json', JSON.stringify(manifest, null, 2))
  archive.file('README.txt', [
    'CDUT Studio V3 · F16 只读审核报告交接包',
    '案卷：' + report.caseId,
    '运行：' + report.runId,
    '受众：' + report.audience,
    '本地清单 schema：review-v3-f16-local-delivery/2（不是 Main 签发清单，不绑定 reportId/snapshotHash）。',
    report.stale ? '注意：本包为历史或过期运行，不代表案卷当前状态。' : '注意：本包仅基于所选审核运行。',
    'report.pdf 使用中文图片页，不支持文本搜索；report.html 可打开并打印成可搜索文字的 PDF。',
    'manifest.json 的 SHA-256 可验证每个导出文件的完整性，但不构成身份认证、受众授权或数字签名。',
    '清单中的受众只是报告投影结果，不能据此声称 Main 已授权或学校已审批。',
    '本包不包含原件本体，不构成业务审批/离线回复/外部系统已收件证明。',
  ].join('\n'))
  return archive.generateAsync({ type: 'uint8array', compression: 'DEFLATE', compressionOptions: { level: 5 } })
}
