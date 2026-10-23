/** F16 只读交付：冻结已投影报告的文件哈希，不处理回件或学校回执（归 F18）。 */
import { t08ReportWorkbookSheets, type T08Report, type T08WorkbookSheet } from './review-v3-t08-case-report'

export interface F16DeliveryFile {
  name: string
  bytes: Uint8Array
}

export interface F16DeliveryManifest {
  schema: 'review-v3-f16-delivery/1'
  kind: 'read-only-report'
  caseId: string
  runId: string
  audience: T08Report['audience']
  /** 受众是否由 Main 授予；未授权的内部受众不得被清单伪装成已授权交付 */
  audienceAuthorized: boolean
  archiveCycle: number
  inputHash: string
  template: string
  runStatus: string
  historical: boolean
  exportedAt: string
  files: Array<{ name: string; size: number; sha256: string }>
  notice: string
}

const encoder = new TextEncoder()

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
  let projection: { caseId: string; audience: string; audienceGranted?: boolean; archiveCycle?: { archiveCycle?: number }; historical: boolean; run: {
    id: string; inputHash: string; templateId: string; templateVersion: number; status: string
  } }
  try { projection = JSON.parse(report.json) as typeof projection }
  catch { throw new Error('交接包报告 JSON 无效') }
  if (!projection.run?.inputHash || !projection.run?.templateId ||
    projection.caseId !== report.caseId || projection.run.id !== report.runId ||
    projection.run.status !== report.status || projection.audience !== report.audience ||
    projection.historical !== report.stale) {
    throw new Error('交接包报告与所选 Run/受众/快照不一致')
  }
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
    schema: 'review-v3-f16-delivery/1',
    kind: 'read-only-report',
    caseId: report.caseId,
    runId: report.runId,
    audience: report.audience,
    audienceAuthorized: report.audienceGranted === true,
    archiveCycle: report.archiveCycle?.archiveCycle ?? 0,
    inputHash: projection.run.inputHash,
    template: projection.run.templateId + '@' + projection.run.templateVersion,
    runStatus: report.status,
    historical: report.stale,
    exportedAt,
    files: entries,
    notice: '本包只证明文件内容与清单哈希一致，不是数字签名、学校审批或离线业务回执。',
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
    report.stale ? '注意：本包为历史或过期运行，不代表案卷当前状态。' : '注意：本包仅基于所选审核运行。',
    'report.pdf 使用中文图片页，不支持文本搜索；report.html 可打开并打印成可搜索文字的 PDF。',
    'manifest.json 的 SHA-256 可验证每个导出文件的完整性，但不构成身份认证或数字签名。',
    '本包不包含原件本体，不构成业务审批/离线回复/外部系统已收件证明。',
  ].join('\n'))
  return archive.generateAsync({ type: 'uint8array', compression: 'DEFLATE', compressionOptions: { level: 5 } })
}
