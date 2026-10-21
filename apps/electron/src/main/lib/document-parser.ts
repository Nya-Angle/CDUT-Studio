/**
 * 文档解析服务
 *
 * 负责从各类办公文档中提取纯文本内容。
 * 支持的格式：
 * - PDF：使用 @profer/core 下一代非自回归高精解析引擎（分栏感知/表格重构/公式/TrapDoc 防御）
 * - DOC/WPS：使用 word-extractor 提取文本（旧版 Word/WPS Writer）
 * - DOCX/XLSX/PPTX/ODP/ODS/ODT 及宏/模板变体：使用 @profer/core Office 引擎提取文本；审核 DOCX/XLSX 另保留结构化定位提取
 * - RTF：使用内置的 brace 感知解析器提取文本
 * - TXT/MD/CSV/JSON/XML/HTML/JS/TS/PY 等：直接 UTF-8 读取
 */

import { readFileSync } from 'node:fs'
import { basename, extname, posix as pathPosix } from 'node:path'
import { load } from 'cheerio'
import AdmZip from 'adm-zip'
import { DOMParser } from '@xmldom/xmldom'
import * as XLSX from 'xlsx'
import { resolveAttachmentPath } from './config-paths'

// ===== 文件类型分类 =====

/** Office 引擎支持的格式 */
const OFFICE_EXTENSIONS = new Set([
  '.docx', '.xlsx', '.pptx',
  '.odt', '.odp', '.ods',
  '.docm', '.dotx', '.dotm',
  '.xlsm', '.xltx', '.xltm',
  '.pptm', '.potx', '.potm', '.ppsx', '.ppsm',
])

/** 旧版 Word/WPS Writer 格式 */
const LEGACY_WORD_EXTENSIONS = new Set([
  '.doc', '.dot', '.wps', '.wpt',
])

/** Legacy Excel binary workbook; routed through the already bundled, hardened SheetJS-compatible reader. */
const LEGACY_EXCEL_EXTENSIONS = new Set(['.xls'])

/** WPS 原生表格/演示格式：尽量交给 Office 解析器尝试 */
const WPS_OFFICE_EXTENSIONS = new Set([
  '.et', '.ett', '.dps', '.dpt',
])

/** RTF 文档 */
const RICH_TEXT_EXTENSIONS = new Set([
  '.rtf',
])

/** 纯文本格式（直接 UTF-8 读取） */
const TEXT_EXTENSIONS = new Set([
  '.txt', '.md', '.csv', '.json', '.xml', '.html',
  '.js', '.ts', '.py', '.yaml', '.yml', '.toml',
  '.log', '.ini', '.cfg', '.conf', '.sh', '.bat',
  '.css', '.scss', '.less', '.sql', '.graphql',
  '.env', '.gitignore', '.dockerfile',
])

/** 所有支持文档解析的扩展名（不含图片） */
const SUPPORTED_DOCUMENT_EXTENSIONS = new Set([
  '.pdf',
  ...OFFICE_EXTENSIONS,
  ...LEGACY_WORD_EXTENSIONS,
  ...LEGACY_EXCEL_EXTENSIONS,
  ...WPS_OFFICE_EXTENSIONS,
  ...RICH_TEXT_EXTENSIONS,
  ...TEXT_EXTENSIONS,
])

/**
 * 判断文件扩展名是否支持文本提取
 *
 * @param ext 文件扩展名（含点号，如 '.pdf'）
 */
export function isSupportedDocumentExtension(ext: string): boolean {
  return SUPPORTED_DOCUMENT_EXTENSIONS.has(ext.toLowerCase())
}

/**
 * 根据 MIME 类型判断是否为可解析文档（非图片附件）
 *
 * 排除图片类型，其余尝试按扩展名判断。
 */
export function isDocumentAttachment(mediaType: string): boolean {
  return !mediaType.startsWith('image/')
}

/**
 * 从文件中提取纯文本内容
 *
 * 根据文件扩展名选择合适的解析器：
 * - .pdf → @profer/core 下一代高精解析引擎（唯一路径）
 * - .doc/.dot/.wps/.wpt → word-extractor
 * - .docx/.xlsx/.pptx/.odt/.odp/.ods 等 → @profer/core Office 引擎
 * - .txt/.md/... → 直接 UTF-8 读取
 *
 * @param filePath 文件的完整路径
 * @returns 提取的纯文本内容
 * @throws 不支持的格式或解析失败时抛出错误
 */
export async function extractTextFromFile(filePath: string): Promise<string> {
  const ext = extname(filePath).toLowerCase()

  // PDF 文件
  if (ext === '.pdf') {
    return extractPdf(filePath)
  }

  // 旧版 Word/WPS Writer 文件
  if (LEGACY_WORD_EXTENSIONS.has(ext)) {
    return extractLegacyWord(filePath)
  }

  if (LEGACY_EXCEL_EXTENSIONS.has(ext)) {
    return extractSpreadsheetReviewContent(filePath).blocks
      .map((cell) => `[${cell.sheet}!${cell.columnName}${cell.row}] ${cell.text}`)
      .join('\n')
  }

  // Office 和 OpenDocument 格式
  if (OFFICE_EXTENSIONS.has(ext)) {
    return extractOffice(filePath)
  }

  // WPS 原生表格/演示格式
  if (WPS_OFFICE_EXTENSIONS.has(ext)) {
    return extractWpsOffice(filePath)
  }

  // 富文本格式（RTF 不是 OOXML，单独解析）
  if (RICH_TEXT_EXTENSIONS.has(ext)) {
    return extractRichText(filePath)
  }

  // 纯文本格式
  if (TEXT_EXTENSIONS.has(ext)) {
    return readFileSync(filePath, 'utf-8')
  }

  // 未知格式：尝试当作文本读取
  console.warn(`[文档解析] 未知格式 ${ext}，尝试作为文本读取: ${filePath}`)
  return readFileSync(filePath, 'utf-8')
}

/**
 * 提取 PDF 文本
 *
 * 唯一路径：@profer/core 的下一代非自回归高精解析引擎（分栏感知、表格重构、
 * 行间公式、TrapDoc 幽灵字符防御），产出高保真学术 Markdown。
 * 引擎异常向上抛出，由调用方如实标记解析失败；无文本层（扫描件）返回空串。
 */
async function extractPdf(filePath: string): Promise<string> {
  const buffer = readFileSync(filePath)
  const { parsePdfDocument } = await import('@profer/core/pdf-engine')
  const layoutAst = await parsePdfDocument(buffer, { fileName: basename(filePath) })
  console.log(
    `[文档解析] PDF 高精解析完成: ${layoutAst.pageCount} 页, `
    + `${layoutAst.readingOrderedBlocks.length} 块, 拦截幽灵字符 ${layoutAst.metrics.trapDocFilteredCount}`,
  )
  return layoutAst.markdown
}

/**
 * 提取旧版 Word/WPS Writer 文本
 */
async function extractLegacyWord(filePath: string): Promise<string> {
  const WordExtractor = (await import('word-extractor')).default
  const extractor = new WordExtractor()
  const extracted = await extractor.extract(filePath)
  const text = extracted.getBody()
  console.log(`[文档解析] 旧版 Word/WPS 提取完成: ${text.length} 字符`)
  return text
}

/**
 * 提取 Office/OpenDocument 文本（DOCX, XLSX, PPTX, ODT, ODP, ODS 及宏/模板变体）
 *
 * 统一使用 `@profer/core/office-engine` 双平面流式重排引擎按 ZIP 包内容自动嗅探并解析，
 * 零外部 mammoth/officeparser 依赖，支持全部宏启用（.docm/.xlsm/.pptm）、模板（.dotx/.xltx/.potx）与放映（.ppsx/.ppsm）变体。
 */
async function extractOffice(filePath: string): Promise<string> {
  const buffer = readFileSync(filePath)
  const {
    OoxmlZipReader,
    parseOfficeBuffer,
    findElements,
    getTextContent,
  } = await import('@profer/core/office-engine')

  if (!OoxmlZipReader.isZipBuffer(buffer)) {
    return extractLegacyWord(filePath)
  }

  const zip = new OoxmlZipReader(buffer)
  // 兼容 OpenDocument (.odt / .odp / .ods)
  if (zip.has('content.xml') && !zip.has('word/document.xml') && !zip.has('xl/workbook.xml') && !zip.has('ppt/presentation.xml')) {
    const contentRoot = zip.readXml('content.xml')
    const paragraphs = contentRoot
      ? findElements(contentRoot, 'p')
          .map((p) => getTextContent(p).trim())
          .filter(Boolean)
      : []
    const text = paragraphs.join('\n\n')
    console.log(`[文档解析] OpenDocument 提取完成: ${text.length} 字符`)
    return text
  }

  const ext = extname(filePath).toLowerCase()
  const result = parseOfficeBuffer(buffer, ext, {
    fileName: basename(filePath),
    includeAnchors: false,
  })
  console.log(
    `[文档解析] Office 双平面引擎解析完成 (${result.format}): ${result.ast.pageCount} 页/表, ${result.cleanMarkdown.length} 字符`,
  )
  return result.cleanMarkdown
}

/**
 * 提取 WPS 原生表格/演示文本
 */
async function extractWpsOffice(filePath: string): Promise<string> {
  try {
    return await extractOffice(filePath)
  } catch (error) {
    const ext = extname(filePath).toLowerCase()
    console.warn(`[文档解析] WPS 原生格式提取失败: ${filePath}`, error)
    throw new Error(`暂不支持解析 ${ext} 原生格式，请在 WPS 中另存为 DOCX/XLSX/PPTX 或 PDF 后重试`)
  }
}

/**
 * 提取 RTF 富文本
 *
 * RTF 不是 OOXML zip，officeparser/mammoth 都无法解析。这里用一个轻量的
 * brace 感知解析器：跳过字体表/颜色表/样式表等控制性分组，仅保留正文，
 * 并把 \par \line \tab 等转成对应的空白字符。无需引入额外依赖。
 */
async function extractRichText(filePath: string): Promise<string> {
  const raw = readFileSync(filePath, 'latin1')
  const text = parseRtf(raw)
  if (!text.trim()) {
    throw new Error('RTF 文档解析后内容为空，请在编辑器中另存为 DOCX 或 PDF 后重试')
  }
  console.log(`[文档解析] RTF 提取完成: ${text.length} 字符`)
  return text
}

/** 这些控制性分组（destination）只含元数据，不属于正文，整段跳过 */
const RTF_SKIP_DESTINATIONS = new Set([
  'fonttbl', 'colortbl', 'stylesheet', 'info', 'pict', 'object',
  'themedata', 'colorschememapping', 'latentstyles', 'datastore',
  'generator', 'listtable', 'listoverridetable', 'rsidtbl',
  'mmathPr', 'wgrffmtfilter', 'xmlnstbl', 'fldinst',
])

/**
 * 把 RTF 源串解析为纯文本。
 *
 * 逐字符扫描，用 depth 跟踪分组层级；遇到 \*\<dest> 或已知的控制性
 * destination 时记录其所在层级，跳过该层级内的所有内容直到分组闭合。
 */
function parseRtf(rtf: string): string {
  let out = ''
  let depth = 0
  // 当前 skip 分组的起始 brace 层级；-1 表示未处于 skip 状态。
  // 用单一值而非计数栈：一旦进入 skip，就忽略其内部所有重复的 skip 标记
  // （例如 `{\*\generator ...}` 中 `\*` 与已知 destination `\generator` 会
  // 各想标记一次），直到引发 skip 的那个分组闭合才解除——从根上避免“多次
  // 标记、单次解除”导致的 skip 状态泄漏（会吞掉其后全部正文）。
  let skipDepth = -1
  // \ucN 指定每个 \uN 之后需要跳过的回退字符数，默认 1。
  let uc = 1
  let i = 0

  const isSkipping = () => skipDepth >= 0

  // 跳过 \uN 之后的 uc 个回退 token（一个 \'xx、一个转义字符或一个普通字符各算一个）
  const skipUnicodeFallback = () => {
    if (rtf[i] === ' ') i++ // 控制字与回退字符间的分隔空格
    let remaining = uc
    while (remaining > 0 && i < rtf.length) {
      if (rtf[i] === '{' || rtf[i] === '}') break // 不吞分组定界符
      if (rtf[i] === '\\' && rtf[i + 1] === '\'') i += 4 // \'xx
      else if (rtf[i] === '\\' && (rtf[i + 1] === '{' || rtf[i + 1] === '}' || rtf[i + 1] === '\\')) i += 2
      else i += 1
      remaining--
    }
  }

  while (i < rtf.length) {
    const ch = rtf[i]

    if (ch === '{') {
      depth++
      i++
      continue
    }

    if (ch === '}') {
      depth--
      // 退出引发 skip 的分组层级时解除 skip
      if (isSkipping() && depth < skipDepth) skipDepth = -1
      i++
      continue
    }

    if (ch === '\\') {
      const next = rtf[i + 1]

      // 转义字符 \{ \} \\
      if (next === '{' || next === '}' || next === '\\') {
        if (!isSkipping()) out += next
        i += 2
        continue
      }

      // \* 标记当前分组为可忽略的 destination（仅在尚未 skip 时记录层级）
      if (next === '*') {
        if (!isSkipping()) skipDepth = depth
        i += 2
        continue
      }

      // \uN 或 \uN- ：Unicode 字符（后跟 uc 个回退字符）
      const uMatch = /^\\u(-?\d+)/.exec(rtf.slice(i))
      if (uMatch) {
        if (!isSkipping()) {
          let code = parseInt(uMatch[1]!, 10)
          if (code < 0) code += 65536
          out += String.fromCharCode(code)
        }
        i += uMatch[0].length
        skipUnicodeFallback()
        continue
      }

      // \'xx ：单字节十六进制字符
      const hexMatch = /^\\'([0-9a-fA-F]{2})/.exec(rtf.slice(i))
      if (hexMatch) {
        if (!isSkipping()) out += String.fromCharCode(parseInt(hexMatch[1]!, 16))
        i += hexMatch[0].length
        continue
      }

      // 普通控制字：\word 后可跟可选数字参数，再跟可选的一个空格分隔符
      const wordMatch = /^\\([a-zA-Z]+)(-?\d+)? ?/.exec(rtf.slice(i))
      if (wordMatch) {
        const word = wordMatch[1]!
        if (word === 'uc') {
          // 即便处于 skip 状态也要跟踪 uc，确保退出 skip 后回退跳过仍准确
          const n = parseInt(wordMatch[2] ?? '1', 10)
          if (!Number.isNaN(n) && n >= 0) uc = n
        } else if (RTF_SKIP_DESTINATIONS.has(word)) {
          if (!isSkipping()) skipDepth = depth
        } else if (!isSkipping()) {
          if (word === 'par' || word === 'pard' || word === 'line' || word === 'sect' || word === 'page') {
            out += '\n'
          } else if (word === 'tab' || word === 'cell') {
            out += '\t'
          } else if (word === 'row' || word === 'trowd') {
            out += '\n'
          }
        }
        i += wordMatch[0].length
        continue
      }

      // 落单的反斜杠
      i++
      continue
    }

    // 普通字符
    if (!isSkipping()) {
      if (ch === '\n' || ch === '\r') {
        // RTF 源里的裸换行无意义，忽略
      } else {
        out += ch
      }
    }
    i++
  }

  return out
    .replace(/[ \t]*\n[ \t]*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

interface MammothModule {
  extractRawText(input: { path?: string, buffer?: Buffer }): Promise<{ value: string }>
  convertToHtml(input: { path?: string, buffer?: Buffer }, options?: { styleMap?: string[]; convertImage?: unknown }): Promise<{ value: string; messages: Array<{ message: string }> }>
  images: {
    imgElement(handler: (image: { contentType: string; readAsBuffer(): Promise<Buffer> }) => Promise<{ src: string }>): unknown
  }
}

export interface DocxReviewImage {
  contentType: string
  data: Buffer
  alt?: string
}

export interface DocxReviewBlock {
  kind: 'heading' | 'paragraph' | 'list-item' | 'table-cell' | 'image'
  text: string
  table?: { row: number; column: number }
  imageIndex?: number
  imageAlt?: string
}

export interface DocxReviewContent {
  blocks: DocxReviewBlock[]
  images: DocxReviewImage[]
  warnings: string[]
}

export interface XlsxReviewBlock {
  sheet: string
  row: number
  column: number
  columnName: string
  text: string
}

export interface XlsxReviewContent {
  blocks: XlsxReviewBlock[]
  warnings: string[]
}

const MAX_REVIEW_XLSX_SHEETS = 8
const MAX_REVIEW_XLSX_ROWS_PER_SHEET = 100
const MAX_REVIEW_XLSX_COLUMNS = 40

/**
 * @xmldom/xmldom 0.9 的 Document/Element 类型不实现 DOM lib 的 EventTarget 成员
 * （addEventListener 等），但本文件只用 childNodes/nodeType/getAttribute 这类
 * 两者共有的结构。这里做一次显式类型桥接，避免 0.9 类型与 DOM lib 冲突。
 */
function asXmlNode(value: unknown): Node {
  return value as Node
}

function xlsxElements(root: Node, localName: string): Element[] {
  const result: Element[] = []
  const visit = (node: Node): void => {
    for (let index = 0; index < (node.childNodes?.length ?? 0); index += 1) {
      const child = node.childNodes.item(index)
      if (!child) continue
      if (child.nodeType === 1) {
        const element = child as Element
        if (element.localName === localName || element.nodeName.split(':').at(-1) === localName) result.push(element)
      }
      visit(child)
    }
  }
  visit(root)
  return result
}

function xlsxDirectElements(root: Element, localName: string): Element[] {
  const result: Element[] = []
  for (let index = 0; index < (root.childNodes?.length ?? 0); index += 1) {
    const child = root.childNodes.item(index)
    if (child?.nodeType !== 1) continue
    const element = child as Element
    if (element.localName === localName || element.nodeName.split(':').at(-1) === localName) result.push(element)
  }
  return result
}

function xlsxZipText(zip: AdmZip, entryPath: string): string | undefined {
  return zip.getEntry(entryPath)?.getData().toString('utf8')
}

function xlsxRelationshipPath(baseDir: string, target: string): string | undefined {
  const source = target.replace(/\\/g, '/')
  const segments = source.startsWith('/') ? [] : baseDir.split('/').filter(Boolean)
  for (const segment of source.split('/').filter(Boolean)) {
    if (segment === '.') continue
    if (segment === '..') {
      if (segments.length === 0) return undefined
      segments.pop()
    } else {
      segments.push(segment)
    }
  }
  return pathPosix.normalize(segments.join('/'))
}

function xlsxRelationships(zip: AdmZip): Map<string, string> {
  const xml = xlsxZipText(zip, 'xl/_rels/workbook.xml.rels')
  if (!xml) return new Map()
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  const relationships = new Map<string, string>()
  for (const node of xlsxElements(asXmlNode(doc), 'Relationship')) {
    const id = node.getAttribute('Id')
    const target = node.getAttribute('Target')
    const resolved = target ? xlsxRelationshipPath('xl', target) : undefined
    if (id && resolved) relationships.set(id, resolved)
  }
  return relationships
}

function xlsxColumnIndex(cellReference: string): number | undefined {
  const letters = /^([A-Za-z]+)/.exec(cellReference)?.[1]?.toUpperCase()
  if (!letters) return undefined
  let value = 0
  for (const char of letters) value = value * 26 + char.charCodeAt(0) - 64
  return value - 1
}

function xlsxColumnName(index: number): string {
  let value = index + 1
  let name = ''
  while (value > 0) {
    const remainder = (value - 1) % 26
    name = String.fromCharCode(65 + remainder) + name
    value = Math.floor((value - 1) / 26)
  }
  return name
}

/**
 * Read spreadsheet values as located cells instead of one flattened officeparser string.
 * Limits match the built-in Office preview so the reviewer and preview describe the same scope.
 */
export function extractXlsxReviewContent(filePath: string): XlsxReviewContent {
  const zip = new AdmZip(filePath)
  const workbookXml = xlsxZipText(zip, 'xl/workbook.xml')
  if (!workbookXml) throw new Error('XLSX 结构无效：缺少 xl/workbook.xml')
  const workbook = new DOMParser().parseFromString(workbookXml, 'application/xml')
  const relationships = xlsxRelationships(zip)
  const sharedStringsXml = xlsxZipText(zip, 'xl/sharedStrings.xml')
  const sharedStrings = sharedStringsXml
    ? xlsxElements(asXmlNode(new DOMParser().parseFromString(sharedStringsXml, 'application/xml')), 'si')
      .map((item) => xlsxElements(item, 't').map((text) => text.textContent ?? '').join(''))
    : []
  const sheetNodes = xlsxElements(asXmlNode(workbook), 'sheet')
  const blocks: XlsxReviewBlock[] = []
  const warnings: string[] = []
  if (sheetNodes.length > MAX_REVIEW_XLSX_SHEETS) warnings.push(`仅解析前 ${MAX_REVIEW_XLSX_SHEETS} 个工作表，其余工作表需人工核对`)

  for (const [sheetIndex, sheetNode] of sheetNodes.slice(0, MAX_REVIEW_XLSX_SHEETS).entries()) {
    const sheetName = sheetNode.getAttribute('name') || `Sheet${sheetIndex + 1}`
    const relationshipId = sheetNode.getAttribute('r:id') || sheetNode.getAttribute('id')
    const sheetPath = relationshipId ? relationships.get(relationshipId) : undefined
    const sheetXml = sheetPath ? xlsxZipText(zip, sheetPath) : undefined
    if (!sheetXml) {
      warnings.push(`工作表「${sheetName}」未能读取，需人工核对`)
      continue
    }
    const sheetDoc = new DOMParser().parseFromString(sheetXml, 'application/xml')
    const rows = xlsxElements(asXmlNode(sheetDoc), 'row')
    if (rows.length > MAX_REVIEW_XLSX_ROWS_PER_SHEET) warnings.push(`工作表「${sheetName}」仅解析前 ${MAX_REVIEW_XLSX_ROWS_PER_SHEET} 行`)
    for (const [rowIndex, rowNode] of rows.slice(0, MAX_REVIEW_XLSX_ROWS_PER_SHEET).entries()) {
      const fallbackRow = Number(rowNode.getAttribute('r')) || rowIndex + 1
      for (const cell of xlsxDirectElements(rowNode, 'c')) {
        const cellReference = cell.getAttribute('r') || ''
        const columnIndex = xlsxColumnIndex(cellReference)
        if (columnIndex === undefined) continue
        if (columnIndex >= MAX_REVIEW_XLSX_COLUMNS) {
          warnings.push(`工作表「${sheetName}」仅解析前 ${MAX_REVIEW_XLSX_COLUMNS} 列`)
          continue
        }
        const valueNode = xlsxElements(cell, 'v')[0]
        const formulaNode = xlsxElements(cell, 'f')[0]
        const type = cell.getAttribute('t')
        let text = ''
        if (type === 'inlineStr') {
          text = xlsxElements(cell, 't').map((node) => node.textContent ?? '').join('')
        } else if (valueNode) {
          const value = valueNode.textContent ?? ''
          if (type === 's') {
            const sharedIndex = Number(value)
            text = Number.isInteger(sharedIndex) ? sharedStrings[sharedIndex] ?? '' : ''
          } else if (type === 'b') text = value === '1' ? 'TRUE' : 'FALSE'
          else text = value
        } else if (formulaNode) {
          warnings.push(`工作表「${sheetName}」含未计算公式单元格；公式值无法可靠读取`)
        }
        if (!text.trim()) continue
        blocks.push({
          sheet: sheetName,
          row: Number(cellReference.match(/\d+$/)?.[0]) || fallbackRow,
          column: columnIndex + 1,
          columnName: xlsxColumnName(columnIndex),
          text,
        })
      }
    }
  }
  return { blocks, warnings: [...new Set(warnings)] }
}

/** Legacy BIFF .xls workbooks need a binary reader; preserve the same cell-level review locations. */
export function extractXlsReviewContent(filePath: string): XlsxReviewContent {
  const workbook = XLSX.read(readFileSync(filePath), { type: 'buffer', cellText: true, cellFormula: true })
  const blocks: XlsxReviewBlock[] = []
  const warnings: string[] = []
  if (workbook.SheetNames.length > MAX_REVIEW_XLSX_SHEETS) warnings.push(`仅解析前 ${MAX_REVIEW_XLSX_SHEETS} 个工作表，其余工作表需人工核对`)
  for (const [sheetIndex, sheetName] of workbook.SheetNames.slice(0, MAX_REVIEW_XLSX_SHEETS).entries()) {
    const sheet = workbook.Sheets[sheetName]
    const range = sheet?.['!ref']
    if (!sheet || !range) continue
    const bounds = XLSX.utils.decode_range(range)
    if (bounds.e.r - bounds.s.r + 1 > MAX_REVIEW_XLSX_ROWS_PER_SHEET) warnings.push(`工作表「${sheetName}」仅解析前 ${MAX_REVIEW_XLSX_ROWS_PER_SHEET} 行`)
    if (bounds.e.c - bounds.s.c + 1 > MAX_REVIEW_XLSX_COLUMNS) warnings.push(`工作表「${sheetName}」仅解析前 ${MAX_REVIEW_XLSX_COLUMNS} 列`)
    const lastRow = Math.min(bounds.e.r, bounds.s.r + MAX_REVIEW_XLSX_ROWS_PER_SHEET - 1)
    const lastColumn = Math.min(bounds.e.c, bounds.s.c + MAX_REVIEW_XLSX_COLUMNS - 1)
    for (let row = bounds.s.r; row <= lastRow; row += 1) {
      for (let column = bounds.s.c; column <= lastColumn; column += 1) {
        const cell = sheet[XLSX.utils.encode_cell({ r: row, c: column })]
        if (!cell) continue
        const text = typeof cell.w === 'string' ? cell.w : cell.v === undefined || cell.v === null ? '' : String(cell.v)
        if (!text.trim()) {
          if (cell.f) warnings.push(`工作表「${sheetName}」含未计算公式单元格；公式值无法可靠读取`)
          continue
        }
        blocks.push({ sheet: sheetName || `Sheet${sheetIndex + 1}`, row: row + 1, column: column + 1, columnName: xlsxColumnName(column), text })
      }
    }
  }
  return { blocks, warnings: [...new Set(warnings)] }
}

/** Shared entry for modern OOXML and legacy BIFF Excel documents. */
export function extractSpreadsheetReviewContent(filePath: string): XlsxReviewContent {
  return extname(filePath).toLowerCase() === '.xls' ? extractXlsReviewContent(filePath) : extractXlsxReviewContent(filePath)
}

/** Preserve emphasis markers from rich-text runs so bolded requirement clauses remain distinguishable. */
function formattedDocxText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const value = node as { type?: string; data?: string; tagName?: string; name?: string; children?: unknown[] }
  if (value.type === 'text') return value.data ?? ''
  const tag = (value.tagName ?? value.name ?? '').toLowerCase()
  if (tag === 'img') return ''
  if (tag === 'br') return '\n'
  const content = (value.children ?? []).map(formattedDocxText).join('')
  if (!content) return ''
  if (['strong', 'b'].includes(tag)) return `**${content}**`
  if (['em', 'i'].includes(tag)) return `*${content}*`
  if (tag === 'u') return `__${content}__`
  if (tag === 's' || tag === 'del') return `~~${content}~~`
  if (tag === 'code') return `\`${content}\``
  if (tag === 'sup') return `^${content}^`
  if (tag === 'sub') return `~${content}~`
  return content
}

/**
 * DOCX 审核解析保留标题、列表、表格行列和嵌入图片；普通 extractRawText 会把这些结构全部压平。
 * 只收常见安全位图，限制图片数量/总大小，避免把巨型媒体塞入案卷。
 */
export async function extractDocxReviewContent(filePath: string): Promise<DocxReviewContent> {
  const mammoth = await import('mammoth') as unknown as MammothModule
  const images: DocxReviewImage[] = []
  const warnings: string[] = []
  let totalImageBytes = 0
  const allowedImageTypes = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
  const result = await mammoth.convertToHtml({ path: filePath }, {
    styleMap: ["p[style-name='Title'] => h1:fresh"],
    convertImage: mammoth.images.imgElement(async (image) => {
      if (!allowedImageTypes.has(image.contentType) || images.length >= 24) {
        warnings.push('部分嵌入图片格式不支持或数量超过 24 张，未纳入视觉审核')
        return { src: 'review-omitted:image' }
      }
      const data = await image.readAsBuffer()
      if (data.byteLength > 8 * 1024 * 1024 || totalImageBytes + data.byteLength > 24 * 1024 * 1024) {
        warnings.push('部分嵌入图片超过审核存储限制（单张 8 MB / 合计 24 MB），未纳入视觉审核')
        return { src: 'review-omitted:image' }
      }
      const imageIndex = images.length
      images.push({ contentType: image.contentType, data })
      totalImageBytes += data.byteLength
      return { src: `review-embedded:${imageIndex}` }
    }),
  })
  warnings.push(...result.messages.map(({ message }) => message))

  const $ = load(result.value)
  const blocks: DocxReviewBlock[] = []
  const addImages = (root: ReturnType<typeof $>): void => {
    root.find('img').add(root.filter('img')).each((_index, image) => {
      const src = $(image).attr('src') ?? ''
      const match = /^review-embedded:(\d+)$/.exec(src)
      const alt = $(image).attr('alt')?.trim()
      if (match) blocks.push({ kind: 'image', text: '', imageIndex: Number(match[1]), ...(alt ? { imageAlt: alt } : {}) })
      else blocks.push({ kind: 'image', text: '', imageAlt: alt || 'DOCX 中的图片未能安全提取；需查看原件人工核对' })
    })
  }
  let tableRow = 0
  for (const node of $('body').children().toArray()) {
    const element = $(node)
    const tag = node.tagName?.toLowerCase() ?? ''
    if (/^h[1-6]$/.test(tag)) {
      const text = formattedDocxText(node).trim()
      if (text) blocks.push({ kind: 'heading', text })
      addImages(element)
    } else if (tag === 'p' || tag === 'blockquote' || tag === 'pre') {
      const text = formattedDocxText(node).trim()
      if (text) blocks.push({ kind: 'paragraph', text })
      addImages(element)
    } else if (tag === 'ul' || tag === 'ol') {
      element.children('li').each((_index, item) => {
        const itemElement = $(item)
        const text = formattedDocxText(item).trim()
        if (text) blocks.push({ kind: 'list-item', text })
        addImages(itemElement)
      })
    } else if (tag === 'table') {
      element.find('tr').each((_rowIndex, row) => {
        const currentRow = tableRow++
        $(row).children('th, td').each((column, cell) => {
          const cellElement = $(cell)
          const text = formattedDocxText(cell).trim()
          if (text) blocks.push({ kind: 'table-cell', text, table: { row: currentRow, column } })
          addImages(cellElement)
        })
      })
    } else {
      const text = formattedDocxText(node).trim()
      if (text) blocks.push({ kind: 'paragraph', text })
      addImages(element)
    }
  }
  return { blocks, images, warnings: [...new Set(warnings)] }
}

/**
 * 从附件相对路径提取文本（IPC 层使用）
 *
 * 将附件的 localPath（如 {conversationId}/{uuid}.ext）
 * 解析为完整路径后提取文本。
 *
 * @param localPath 附件相对路径
 * @returns 提取的纯文本内容
 */
export async function extractTextFromAttachment(localPath: string): Promise<string> {
  const fullPath = resolveAttachmentPath(localPath)
  return extractTextFromFile(fullPath)
}

