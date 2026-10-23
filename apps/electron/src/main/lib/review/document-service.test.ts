/**
 * 文档解析与切块（document-service）测试
 *
 * 被测：slugifyFileName / parseTextIntoBlocks / parseFileIntoSourceDocument。
 * 全部为纯函数（仅读文件），不依赖 Electron，可直接在 bun test 下运行。
 *
 * 覆盖点：
 * - slugifyFileName：中文保留、特殊符号转 '-'、空串防御
 * - parseTextIntoBlocks：同输入两次调用块 ID 序列完全一致（三栏联动锚点稳定性）
 * - markdown 行分类（# / - / 普通行）、CSV 首行 heading + 其余 table-cell
 * - parseFileIntoSourceDocument：SVG → 单个 image 块 + imageAlt 含 <text> 内容
 * - 文本类文件（.csv）经文件入口 → parseStatus 'parsed' + 行分类不变
 * - 带文本层的 PDF → 'parsed' + 块数量 > 0（手写最小合法 PDF，无外部依赖）
 * - 无文本层的 PDF（空内容流，扫描件典型情形）→ 'partial' + parseError 含「扫描件」
 * - 图片（PNG）→ 单个 image 块 + imageAssetPath + 'partial'（待 Vision 识别）
 * - 未知二进制 → 'failed' + parseError 非空（沿用既有行为）
 *
 * 临时文件统一写在仓库 work/tmp/ 下（不用系统临时目录），afterAll 清理本次创建的目录。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReviewDocumentBlock, SourceDocument } from '@profer/shared'
import { parseCsvIntoCellBlocks, parseFileIntoSourceDocument, parseTextIntoBlocks, slugifyFileName } from './document-service'

/** 测试用临时目录根：仓库 work/tmp/（严禁落到系统 /tmp） */
const workTmpRoot = join(import.meta.dir, '../../../../../../work/tmp')
mkdirSync(workTmpRoot, { recursive: true })
/** 本次测试独占的子目录（parseFileIntoSourceDocument 需要真实文件路径） */
const testRoot = mkdtempSync(join(workTmpRoot, 'review-doc-'))

// 只清理本次创建的目录，不动 work/tmp 下其他既有产物
afterAll(() => {
  rmSync(testRoot, { recursive: true, force: true })
})

describe('slugifyFileName', () => {
  test('Given 中文文件名 When slug 化 Then 保留中文与数字、去掉扩展名', () => {
    expect(slugifyFileName('2026年度综测材料.md')).toBe('2026年度综测材料')
    expect(slugifyFileName('报告.pdf')).toBe('报告')
  })

  test('Given 含特殊符号的文件名 When slug 化 Then 非字母数字中文统一转连字符并折叠', () => {
    expect(slugifyFileName('a b/c')).toBe('a-b-c')
    // 连续符号折叠成一个 '-'，首尾 '-' 被裁掉
    expect(slugifyFileName('---abc---')).toBe('abc')
  })

  test('Given 空串或无有效字符的文件名 When slug 化 Then 返回防御值 doc', () => {
    expect(slugifyFileName('')).toBe('doc')
    expect(slugifyFileName('...')).toBe('doc')
    expect(slugifyFileName('---')).toBe('doc')
  })
})

describe('parseTextIntoBlocks', () => {
  test('Given 同一份 markdown 输入 When 连续切块两次 Then 两次块 ID 序列完全一致（锚点稳定）', () => {
    const text = '# 甲\n\n- 乙\n正文段落'
    const first = parseTextIntoBlocks('报告.md', text)
    const second = parseTextIntoBlocks('报告.md', text)

    expect(first.length).toBe(3)
    expect(second.length).toBe(3)
    expect(second.map((block: ReviewDocumentBlock) => block.id)).toEqual(
      first.map((block: ReviewDocumentBlock) => block.id),
    )
    // ID 形如 blk-{slug}-{三位序号}
    expect(first[0]!.id).toBe('blk-报告-001')
    expect(first[2]!.id).toBe('blk-报告-003')
  })

  test('Given markdown 行 When 按行切块 Then # 为 heading、- 为 list-item、普通行为 paragraph', () => {
    const blocks = parseTextIntoBlocks('报告.md', '# 甲\n\n- 乙\n正文段落')

    expect(blocks.map((block: ReviewDocumentBlock) => block.kind)).toEqual([
      'heading',
      'list-item',
      'paragraph',
    ])
    // 原始行文本原样保留（不做二次渲染），空行被跳过
    expect(blocks.map((block: ReviewDocumentBlock) => block.text)).toEqual([
      '# 甲',
      '- 乙',
      '正文段落',
    ])
    expect(blocks.every((block: ReviewDocumentBlock) => block.page === 1)).toBe(true)
  })

  test('Given CSV 文件名 When 按行切块 Then 首行为 heading、其余行为 table-cell 且保留原行文本', () => {
    const text = '姓名,分值\n张三,4\n李四,3'
    const blocks = parseTextIntoBlocks('申报表.csv', text)

    expect(blocks.map((block: ReviewDocumentBlock) => block.kind)).toEqual([
      'heading',
      'table-cell',
      'table-cell',
    ])
    // table-cell 保留整行文本（不做逗号拆分），便于原文检索/高亮
    expect(blocks[1]!.text).toBe('张三,4')
    expect(blocks.map((block: ReviewDocumentBlock) => block.id)).toEqual([
      'blk-申报表-001',
      'blk-申报表-002',
      'blk-申报表-003',
    ])
  })
})

describe('parseFileIntoSourceDocument', () => {
  test('Given 含 <text> 的 SVG 文件 When 解析 Then 产出单个 image 块且 imageAlt 含文本内容', async () => {
    const filePath = join(testRoot, '证书.svg')
    writeFileSync(
      filePath,
      '<svg xmlns="http://www.w3.org/2000/svg"><text>姓名 张三</text><text>等级 二等奖</text></svg>',
      'utf-8',
    )

    const document: SourceDocument = await parseFileIntoSourceDocument(filePath, '证书.svg', 'evidence')

    expect(document.parseStatus).toBe('parsed')
    expect(document.mimeType).toBe('image/svg+xml')
    expect(document.blocks).toHaveLength(1)
    const block = document.blocks[0]!
    expect(block.kind).toBe('image')
    // imageAlt 承载 <text> 抽取出的内容（多段用中文分号连接）
    expect(block.imageAlt ?? '').toContain('姓名 张三')
    expect(block.imageAlt ?? '').toContain('等级 二等奖')
    // 真实文件大小（>0），不是占位 0
    expect(document.sizeBytes).toBeGreaterThan(0)
  })

  test('Given 损坏的 .pdf 文件 When 解析 Then parseStatus 为 failed 且 parseError 非空', async () => {
    const filePath = join(testRoot, '规定.pdf')
    writeFileSync(filePath, '%PDF-1.4 假内容', 'utf-8')

    const document: SourceDocument = await parseFileIntoSourceDocument(filePath, '规定.pdf', 'rule')

    expect(document.parseStatus).toBe('failed')
    expect(typeof document.parseError).toBe('string')
    expect((document.parseError ?? '').length).toBeGreaterThan(0)
    // 解析失败没有可读文本块；错误原因与原件路径另行保留。
    expect(document.blocks).toHaveLength(0)
  })
})

// ===== 追加：格式墙拆除（PDF / Office 入口、图片 Vision 路径、未知二进制不回归） =====

/** PDF 首 token 之后的解析较慢，给足超时（首次还会加载 pdfjs-dist） */
const PDF_PARSE_TIMEOUT_MS = 30_000

/**
 * 手写最小合法 PDF 字节流。
 *
 * 仓库内没有 pdfkit/pdf-lib 等生成库，手写最稳妥：Catalog → Pages → Page
 * （/Contents 内容流）→ Font，xref 偏移按实际字节数计算。
 * content 传空串即「无文本层的空页面」——扫描件 PDF 的极端情形。
 */
function buildPdfWithContent(content: string): Buffer {
  const objects: string[] = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []
  objects.forEach((body, index) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'))
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`
  })
  const xrefOffset = Buffer.byteLength(pdf, 'latin1')
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`
  return Buffer.from(pdf, 'latin1')
}

/** 1x1 RGBA PNG（真实可解码字节流，非伪造扩展名） */
const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==',
  'base64',
)

describe('parseFileIntoSourceDocument / 文本类文件入口（行为不回归）', () => {
  test('Given CSV 文件 When 经文件入口解析 Then 首行 heading、其余 table-cell 且状态 parsed', async () => {
    const filePath = join(testRoot, '申报表.csv')
    writeFileSync(filePath, '姓名,分值\n张三,4\n李四,3', 'utf-8')

    const document: SourceDocument = await parseFileIntoSourceDocument(filePath, '申报表.csv', 'application')

    expect(document.parseStatus).toBe('parsed')
    expect(document.mimeType).toBe('text/csv')
    expect(document.blocks.map((block: ReviewDocumentBlock) => block.kind)).toEqual([
      'heading', 'heading', 'table-cell', 'table-cell', 'table-cell', 'table-cell',
    ])
    expect(document.blocks[2]?.table).toEqual({ sheet: 'CSV', row: 2, column: 1 })
    expect(document.blocks[3]?.table).toEqual({ sheet: 'CSV', row: 2, column: 2 })
  })

  test('Given HTML 申报材料 When 导入 Then 提取可读正文和实体字符并忽略脚本', async () => {
    const filePath = join(testRoot, '申报说明.html')
    writeFileSync(filePath, '<html><head><title>不应进入正文</title></head><body><h1>申报说明</h1><p>获奖等级：省级二等奖 &amp; 个人项目</p><script>secret()</script></body></html>', 'utf-8')

    const document = await parseFileIntoSourceDocument(filePath, '申报说明.html', 'application')

    expect(document.parseStatus).toBe('parsed')
    expect(document.mimeType).toBe('text/html')
    expect(document.blocks.map((block) => block.text).join('\n')).toContain('获奖等级：省级二等奖 & 个人项目')
    expect(document.blocks.map((block) => block.text).join('\n')).not.toContain('secret')
    expect(document.blocks.map((block) => block.text).join('\n')).not.toContain('不应进入正文')
  })

  test('Given multipart EML 邮件 When 导入 Then 提取邮件头和纯文本正文', async () => {
    const filePath = join(testRoot, '补充说明.eml')
    writeFileSync(filePath, [
      'From: reviewer@example.edu',
      'To: student@example.edu',
      'Subject: =?UTF-8?B?6KGl5YWF5paH5Lu2?=',
      'MIME-Version: 1.0',
      'Content-Type: multipart/alternative; boundary="part-1"',
      '',
      '--part-1',
      'Content-Type: text/plain; charset="utf-8"',
      'Content-Transfer-Encoding: quoted-printable',
      '',
      '=E8=AF=B7=E8=A1=A5=E4=BA=A4=E5=AE=8C=E6=95=B4=E8=AF=81=E4=B9=A6=E3=80=82',
      '--part-1',
      'Content-Type: text/html; charset="utf-8"',
      '',
      '<p>备用 HTML 正文</p>',
      '--part-1--',
      '',
    ].join('\r\n'), 'utf-8')

    const document = await parseFileIntoSourceDocument(filePath, '补充说明.eml', 'evidence')
    const extracted = document.blocks.map((block) => block.text).join('\n')

    expect(document.parseStatus).toBe('parsed')
    expect(document.mimeType).toBe('message/rfc822')
    expect(extracted).toContain('From: reviewer@example.edu')
    expect(extracted).toContain('Subject: 补充文件')
    expect(extracted).toContain('请补交完整证书。')
    expect(extracted).not.toContain('备用 HTML 正文')
  })
})

describe('T02 / imported original version and CSV source precision', () => {
  test('quoted newlines, doubled quotes and numeric-looking IDs remain in their actual CSV cells', async () => {
    const content = '学号,项目,备注\r\n0000123,"成果\r\n二等奖","他说""已获奖"""\r\n0000124,普通,完整'
    const blocks = parseCsvIntoCellBlocks('成绩.csv', content)
    expect(blocks).toHaveLength(9)
    expect(blocks.find((b) => b.table?.row === 2 && b.table.column === 1)?.text).toBe('0000123')
    expect(blocks.find((b) => b.table?.row === 2 && b.table.column === 2)?.text).toBe('成果\r\n二等奖')
    expect(blocks.find((b) => b.table?.row === 2 && b.table.column === 3)?.text).toBe('他说"已获奖"')
    expect(blocks.find((b) => b.table?.row === 3 && b.table.column === 1)?.text).toBe('0000124')
  })

  test('two physical originals with identical names must not share document or source block identity', async () => {
    const firstPath = join(testRoot, '同名原件-A.txt')
    const secondPath = join(testRoot, '同名原件-B.txt')
    writeFileSync(firstPath, '第一份独立原件')
    writeFileSync(secondPath, '第二份独立原件')
    const [first, second] = await Promise.all([
      parseFileIntoSourceDocument(firstPath, '证书.txt', 'evidence'),
      parseFileIntoSourceDocument(secondPath, '证书.txt', 'evidence'),
    ])
    expect(first.id).not.toBe(second.id)
    expect(first.blocks[0]?.id).not.toBe(second.blocks[0]?.id)
    expect(first.blocks[0]?.text).toContain('第一份')
    expect(second.blocks[0]?.text).toContain('第二份')
  })

  test('an empty CSV cannot claim it was fully parsed', async () => {
    const path = join(testRoot, '空白表.csv')
    writeFileSync(path, '\r\n\r\n')
    const parsed = await parseFileIntoSourceDocument(path, '空白表.csv', 'evidence')
    expect(parsed.parseStatus).toBe('partial')
    expect(parsed.blocks).toHaveLength(0)
    expect(parsed.parseError).toContain('可用单元格')
  })
})

describe('parseFileIntoSourceDocument / PDF 文本层', () => {
  test('Given 含文本层的 PDF When 解析 Then parseStatus 为 parsed 且块数量大于 0', async () => {
    const filePath = join(testRoot, '综测细则.pdf')
    writeFileSync(filePath, buildPdfWithContent('BT /F1 24 Tf 72 700 Td (Hello Review 123) Tj ET'))

    const document: SourceDocument = await parseFileIntoSourceDocument(filePath, '综测细则.pdf', 'rule')

    expect(document.parseStatus).toBe('parsed')
    expect(document.mimeType).toBe('application/pdf')
    // 块数量 > 0 且文本真的来自 PDF（不是占位块）
    expect(document.blocks.length).toBeGreaterThan(0)
    expect(document.blocks.some((block: ReviewDocumentBlock) => block.text.includes('Hello'))).toBe(true)
    expect(document.sizeBytes).toBeGreaterThan(0)
  }, PDF_PARSE_TIMEOUT_MS)

  test('Given 无文本层的 PDF（空内容流，扫描件典型情形）When 解析 Then partial 且 parseError 提示扫描件需人工复核', async () => {
    const filePath = join(testRoot, '扫描件证明.pdf')
    writeFileSync(filePath, buildPdfWithContent(''))

    const document: SourceDocument = await parseFileIntoSourceDocument(filePath, '扫描件证明.pdf', 'evidence')

    // 绝不假装解析成功：状态降级为 partial，并给出中文原因
    expect(document.parseStatus).toBe('partial')
    expect(document.parseError ?? '').toContain('扫描件')
    expect(document.parseError ?? '').toContain('OCR')
    // 没有提取到文本就没有块，不塞占位块冒充内容
    expect(document.blocks).toHaveLength(0)
  }, PDF_PARSE_TIMEOUT_MS)
})

describe('parseFileIntoSourceDocument / 图片与未知二进制', () => {
  test('Given PNG 图片 When 解析 Then 单个 image 块 + 案卷内相对路径 + partial 待 Vision 识别', async () => {
    const filePath = join(testRoot, '获奖证书.png')
    writeFileSync(filePath, ONE_PIXEL_PNG)
    const assetRelativePath = 'source-docs/doc-123-获奖证书.png'

    const document: SourceDocument = await parseFileIntoSourceDocument(
      filePath,
      '获奖证书.png',
      'evidence',
      assetRelativePath,
    )

    expect(document.parseStatus).toBe('partial')
    expect(document.mimeType).toBe('image/png')
    expect(document.blocks).toHaveLength(1)
    const block = document.blocks[0]!
    expect(block.kind).toBe('image')
    expect(block.text).toBe('')
    // imageAssetPath 是原件在案卷目录内的相对路径，供后续 Vision 送模型
    expect(block.imageAssetPath).toBe(assetRelativePath)
    expect(document.parseError ?? '').toContain('视觉模型')
  })

  test('Given JPG 图片 When 导入 Then 保留视觉材料块而不是报成不支持格式', async () => {
    const filePath = join(testRoot, '证明.jpg')
    writeFileSync(filePath, Buffer.from([0xff, 0xd8, 0xff, 0xd9]))

    const document = await parseFileIntoSourceDocument(filePath, '证明.jpg', 'evidence', 'source-docs/doc-jpg.jpg')

    expect(document.parseStatus).toBe('partial')
    expect(document.mimeType).toBe('image/jpeg')
    expect(document.blocks[0]).toMatchObject({ kind: 'image', imageAssetPath: 'source-docs/doc-jpg.jpg' })
    expect(document.parseError ?? '').toContain('视觉模型')
  })

  test('F04 损坏的 PNG 与伪装扩展名不得伪造视觉来源块', async () => {
    const truncated = join(testRoot, '损坏原件.png')
    const disguised = join(testRoot, '伪装图片.png')
    writeFileSync(truncated, ONE_PIXEL_PNG.subarray(0, 25))
    writeFileSync(disguised, '%PDF-1.4 fake')
    for (const path of [truncated, disguised]) {
      const result = await parseFileIntoSourceDocument(path, '原件.png', 'evidence', 'source-docs/原件.png')
      expect(result.parseStatus).toBe('failed')
      expect(result.blocks).toHaveLength(0)
      expect(result.parseError).toContain('图片文件损坏')
    }
  })

  test('F04 已删除的图片登记时明确失败，而不是报告已收录', async () => {
    const missing = join(testRoot, '不存在的证明.jpg')
    const result = await parseFileIntoSourceDocument(missing, '不存在的证明.jpg', 'evidence')
    expect(result.parseStatus).toBe('failed')
    expect(result.blocks).toHaveLength(0)
    expect(result.parseError).toContain('图片原件不可读取')
  })

  test('Given 未知二进制文件 When 解析 Then parseStatus 为 failed 且不伪造可读块', async () => {
    const filePath = join(testRoot, '原始数据.bin')
    writeFileSync(filePath, Buffer.from([0x00, 0x01, 0x02, 0xfe, 0xff]))

    const document: SourceDocument = await parseFileIntoSourceDocument(filePath, '原始数据.bin', 'evidence')

    expect(document.parseStatus).toBe('failed')
    expect((document.parseError ?? '').length).toBeGreaterThan(0)
    expect(document.blocks).toHaveLength(0)
  })
})
