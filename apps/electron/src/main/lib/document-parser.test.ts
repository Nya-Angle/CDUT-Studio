import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import JSZip from 'jszip'
import * as XLSX from 'xlsx'
import { extractDocxReviewContent, extractSpreadsheetReviewContent, extractTextFromFile, extractXlsxReviewContent, isSupportedDocumentExtension } from './document-parser'

// ===== 测试夹具：用 jszip 现造最小但合法的 OOXML 包 =====
// OOXML（docx/xlsx/pptx 及其宏/模板变体）本质都是带固定目录结构的 zip。
// officeparser 收到 Buffer 时按内容嗅探类型，因此我们造一份 docx 内容、
// 起一个 .docm/.dotx/.pptm 等扩展名，即可验证“扩展名变体也能解析”。

async function buildDocx(text: string, bodyXml?: string): Promise<Buffer> {
  const zip = new JSZip()
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`
    + `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>`
    + `<Default Extension="xml" ContentType="application/xml"/>`
    + `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>`
    + `<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>`
    + `</Types>`)
  zip.folder('_rels')!.file('.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`
    + `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>`
    + `</Relationships>`)
  zip.folder('word')!.file('document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">`
    + `<w:body>${bodyXml ?? `<w:p><w:r><w:t>${text}</w:t></w:r></w:p>`}</w:body></w:document>`)
  zip.folder('word')!.folder('_rels')!.file('document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`
    + `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`
    + `</Relationships>`)
  zip.folder('word')!.file('styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">`
    + `<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/></w:style>`
    + `<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/></w:style>`
    + `</w:styles>`)
  return zip.generateAsync({ type: 'nodebuffer' })
}

async function buildXlsx(text: string): Promise<Buffer> {
  const zip = new JSZip()
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`
    + `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>`
    + `<Default Extension="xml" ContentType="application/xml"/>`
    + `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>`
    + `<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
    + `<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>`
    + `</Types>`)
  zip.folder('_rels')!.file('.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`
    + `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>`
    + `</Relationships>`)
  const xl = zip.folder('xl')!
  xl.file('workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">`
    + `<sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets></workbook>`)
  xl.folder('_rels')!.file('workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`
    + `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>`
    + `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>`
    + `</Relationships>`)
  xl.file('sharedStrings.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="1" uniqueCount="1">`
    + `<si><t>${text}</t></si></sst>`)
  xl.folder('worksheets')!.file('sheet1.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">`
    + `<sheetData><row r="1"><c r="A1" t="s"><v>0</v></c></row>`
    + `<row r="3"><c r="B3" t="inlineStr"><is><t>00123</t></is></c></row></sheetData></worksheet>`)
  return zip.generateAsync({ type: 'nodebuffer' })
}

let dir: string

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), 'doc-parser-test-'))
})

afterAll(() => {
  rmSync(dir, { recursive: true, force: true })
})

describe('document-parser / 扩展名识别', () => {
  test('识别 WPS 和常见 Office 导出格式', () => {
    const supportedExtensions = [
      '.wps', '.wpt',
      '.xls',
      '.et', '.ett',
      '.dps', '.dpt',
      '.docm', '.dotx', '.dotm',
      '.xlsm', '.xltx', '.xltm',
      '.pptm', '.potx', '.potm', '.ppsx', '.ppsm',
      '.rtf', '.pdf',
    ]

    for (const ext of supportedExtensions) {
      expect(isSupportedDocumentExtension(ext)).toBe(true)
    }
  })

  test('扩展名判断不区分大小写', () => {
    expect(isSupportedDocumentExtension('.WPS')).toBe(true)
    expect(isSupportedDocumentExtension('.PDF')).toBe(true)
  })
})

describe('document-parser / 真实提取', () => {
  test('DOCX 审核解析保留标题、加粗和表格单元格', async () => {
    const path = join(dir, 'structured.docx')
    const body = '<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>Eligibility requirements</w:t></w:r></w:p>'
      + '<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Important rule</w:t></w:r><w:r><w:t> applies.</w:t></w:r></w:p>'
      + '<w:tbl><w:tr><w:tc><w:p><w:r><w:t>Applicant</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>Deadline</w:t></w:r></w:p></w:tc></w:tr></w:tbl>'
    writeFileSync(path, await buildDocx('', body))
    const parsed = await extractDocxReviewContent(path)
    expect(parsed.blocks.find((block) => block.kind === 'heading')?.text).toBe('Eligibility requirements')
    expect(parsed.blocks.find((block) => block.kind === 'paragraph')?.text).toContain('**Important rule**')
    expect(parsed.blocks.filter((block) => block.kind === 'table-cell').map((block) => block.text)).toEqual(['Applicant', 'Deadline'])
    expect(parsed.blocks.filter((block) => block.kind === 'table-cell').map((block) => block.table?.column)).toEqual([0, 1])
  })

  test('Word 内置 Title 段落样式解析为标题且不降级为带警告文档', async () => {
    const path = join(dir, 'built-in-title.docx')
    const body = '<w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr><w:r><w:t>合成申请书标题</w:t></w:r></w:p>'
    writeFileSync(path, await buildDocx('', body))
    const parsed = await extractDocxReviewContent(path)

    expect(parsed.blocks).toContainEqual({ kind: 'heading', text: '合成申请书标题' })
    expect(parsed.warnings).toEqual([])
  })

  test('XLSX 审核解析保留工作表、单元格坐标及前导零文本', async () => {
    const path = join(dir, 'review-structured.xlsx')
    writeFileSync(path, await buildXlsx('申报项目'))
    const parsed = extractXlsxReviewContent(path)
    expect(parsed.blocks).toEqual([
      { sheet: 'Sheet1', row: 1, column: 1, columnName: 'A', text: '申报项目' },
      { sheet: 'Sheet1', row: 3, column: 2, columnName: 'B', text: '00123' },
    ])
    expect(parsed.warnings).toEqual([])
  })

  test('旧版 XLS 审核解析保留工作表和单元格坐标', () => {
    const path = join(dir, 'review-legacy.xls')
    const workbook = XLSX.utils.book_new()
    const sheet = XLSX.utils.aoa_to_sheet([['项目', '学号'], ['志愿服务', '00123']])
    XLSX.utils.book_append_sheet(workbook, sheet, '综测分项')
    writeFileSync(path, XLSX.write(workbook, { type: 'buffer', bookType: 'biff8' }) as Buffer)
    const parsed = extractSpreadsheetReviewContent(path)
    expect(parsed.blocks).toContainEqual({ sheet: '综测分项', row: 2, column: 1, columnName: 'A', text: '志愿服务' })
    expect(parsed.blocks).toContainEqual({ sheet: '综测分项', row: 2, column: 2, columnName: 'B', text: '00123' })
  })

  // mammoth 优先路径：DOCX 宏/模板（.docm/.dotx）应被 mammoth 直接解析
  test('提取 DOCX 宏启用文档（.docm，mammoth 路径）', async () => {
    const path = join(dir, 'macro.docm')
    writeFileSync(path, await buildDocx('Hello macro document'))
    const text = await extractTextFromFile(path)
    expect(text).toContain('Hello macro document')
  })

  // officeparser buffer 路径：扩展名 .xlsm 不在 officeparser 白名单内，
  // 必须靠“传 Buffer → 按内容嗅探”才能正确路由解析。这是本次修复的核心。
  test('提取 Excel 宏启用文档（.xlsm，officeparser 内容嗅探路径）', async () => {
    const path = join(dir, 'macro.xlsm')
    writeFileSync(path, await buildXlsx('SpreadsheetCellValue'))
    const text = await extractTextFromFile(path)
    expect(text).toContain('SpreadsheetCellValue')
  })

  // PPT 模板变体同理走 buffer 内容嗅探（内容造的是 xlsx，仅验证扩展名不再卡白名单）
  test('提取 PowerPoint 放映文档（.ppsx，officeparser 内容嗅探路径）', async () => {
    const path = join(dir, 'slideshow.ppsx')
    writeFileSync(path, await buildDocx('Slideshow body text'))
    const text = await extractTextFromFile(path)
    expect(text).toContain('Slideshow body text')
  })

  // RTF 走内置 brace 感知解析器，不应泄漏字体表内容，应保留正文与换行
  test('提取 RTF 文档，跳过控制表只保留正文', async () => {
    const path = join(dir, 'doc.rtf')
    const rtf = String.raw`{\rtf1\ansi\deff0 {\fonttbl{\f0\fnil Arial;}}{\colortbl;\red0\green0\blue0;}`
      + String.raw`\f0\fs24 First paragraph\par Second paragraph\par}`
    writeFileSync(path, rtf, 'latin1')
    const text = await extractTextFromFile(path)
    expect(text).toContain('First paragraph')
    expect(text).toContain('Second paragraph')
    expect(text).not.toContain('Arial')
    expect(text).not.toContain('fonttbl')
    // \par 应转成换行，两段不应粘连
    expect(text).toMatch(/First paragraph\s*\n\s*Second paragraph/)
  })

  // RTF 的 \uN Unicode 转义应被还原（真实 RTF 用此编码非 ASCII 字符）
  test('解码 RTF 的 Unicode 转义', async () => {
    const path = join(dir, 'unicode.rtf')
    //  3 = 中, ▙1 = 文（后跟回退占位符 ?）
    const rtf = String.raw`{\rtf1\ansi\deff0\f0\fs24  3?▙1? text\par}`
    writeFileSync(path, rtf, 'latin1')
    const text = await extractTextFromFile(path)
    expect(text).toContain('中文')
    expect(text).toContain('text')
  })

  // 回归：真实 Word/WordPad RTF 几乎都含 {\*\generator ...}，曾因 \* 与
  // 已知 destination 叠加导致 skip 状态泄漏、吞掉全部正文。必须能正常提取。
  test('提取含 generator 控制组的真实 Word 风格 RTF', async () => {
    const path = join(dir, 'word.rtf')
    const rtf = String.raw`{\rtf1\ansi\ansicpg1252\deff0{\fonttbl{\f0\fnil Calibri;}}`
      + String.raw`{\*\generator Riched20 10.0.19041}\viewkind4\uc1\pard\f0\fs22 `
      + String.raw`First paragraph\par Second paragraph\par}`
    writeFileSync(path, rtf, 'latin1')
    const text = await extractTextFromFile(path)
    expect(text).toContain('First paragraph')
    expect(text).toContain('Second paragraph')
    expect(text).not.toContain('Riched20')
    expect(text).not.toContain('generator')
    expect(text).toMatch(/First paragraph\s*\n\s*Second paragraph/)
  })

  // 回归：多个可忽略 destination（含嵌套 \*）叠加，正文仍应完整保留、元数据不泄漏
  test('提取含 listtable/info 等多个忽略分组的 RTF', async () => {
    const path = join(dir, 'listtable.rtf')
    const rtf = String.raw`{\rtf1\ansi\deff0{\fonttbl{\f0 Arial;}}`
      + String.raw`{\*\listtable{\list\listtemplateid1{\listlevel\leveltext\'01;}}}`
      + String.raw`{\*\generator Msftedit 5.41}{\info{\author Bob}{\*\company Acme}}`
      + String.raw`\pard Body line one\par Body line two\par}`
    writeFileSync(path, rtf, 'latin1')
    const text = await extractTextFromFile(path)
    expect(text).toContain('Body line one')
    expect(text).toContain('Body line two')
    expect(text).not.toContain('Acme')
    expect(text).not.toContain('Bob')
    expect(text).not.toContain('listtemplateid')
  })
})
