import { describe, expect, test, beforeEach, afterEach } from 'bun:test'
import { mkdtempSync, writeFileSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'
import { cleanPreviewTmpDir, expandHomeDirectory, preparePdfPreview, resolveFilePath, resolveTargetPath } from './file-preview-service'

/**
 * resolveTargetPath 预检模式（skipGlobalSearch）浅层搜索行为测试。
 *
 * 背景：FilePathChip 批量预检用 preflight 标记跳过全工作区全局递归搜索（避免主进程卡顿），
 * 但在 basePaths 内做浅层递归（深度 3），把工作区/授权目录子目录中的文件识别为「已存在」，
 * 避免裸文件名引用几乎全部落到「待查找」。本测试覆盖该浅层搜索的命中与边界。
 */
describe('文件预览路径安全解析', () => {
  test('Given 当前用户 home 缩写 When 解析路径 Then 只展开当前用户目录', () => {
    expect(expandHomeDirectory('~')).toBe(homedir())
    expect(expandHomeDirectory('~/Documents/a.md')).toBe(join(homedir(), 'Documents', 'a.md'))
    expect(expandHomeDirectory('~other-user/a.md')).toBe('~other-user/a.md')
  })

  test('Given home 下存在文件 When 解析 ~ 路径 Then 返回展开后的文件路径', () => {
    const home = homedir()
    const target = join(home, '.cdutai-preview-test-do-not-create')
    expect(resolveTargetPath('~/.cdutai-preview-test-do-not-create')).toBe(target)
  })
})

describe('resolveTargetPath 预检浅层搜索（skipGlobalSearch）', () => {
  let tmpBase: string

  beforeEach(() => {
    tmpBase = mkdtempSync(join(tmpdir(), 'fpcs-'))
    // ws/src/foo.ts —— 深度 2，预检浅层（深度 3）应命中
    mkdirSync(join(tmpBase, 'ws', 'src'), { recursive: true })
    writeFileSync(join(tmpBase, 'ws', 'src', 'foo.ts'), 'x')
    // ws/deep/a/b/c/bar.ts —— 深度 5，超出预检浅层深度 3，不应命中
    mkdirSync(join(tmpBase, 'ws', 'deep', 'a', 'b', 'c'), { recursive: true })
    writeFileSync(join(tmpBase, 'ws', 'deep', 'a', 'b', 'c', 'bar.ts'), 'x')
  })

  afterEach(() => {
    rmSync(tmpBase, { recursive: true, force: true })
  })

  test('预检模式：base 子目录（深度 2）的裸文件名能解析到绝对路径', () => {
    const resolved = resolveFilePath('foo.ts', [join(tmpBase, 'ws')], { skipGlobalSearch: true })
    expect(resolved).toBe(join(tmpBase, 'ws', 'src', 'foo.ts'))
  })

  test('预检模式：不存在的文件返回 null（不误报存在）', () => {
    const resolved = resolveFilePath('nope.ts', [join(tmpBase, 'ws')], { skipGlobalSearch: true })
    expect(resolved).toBeNull()
  })

  test('预检模式：深度超过 3 的裸文件名不命中，返回 null（点击时走完整解析兜底）', () => {
    const resolved = resolveFilePath('bar.ts', [join(tmpBase, 'ws')], { skipGlobalSearch: true })
    expect(resolved).toBeNull()
  })
})

/**
 * 逐页截图的回归护栏。
 *
 * 背景：内联 PDF 查看器加载后会先把整份文档栅格化一遍。真实 26 页 / 572 KB PDF 实测
 * 单次全量栅格化约 34 秒，而审核材料登记与单页核验是「一次只要一页」，逐页串行会放大成
 * 几十倍等待（历史 REGISTER_MATERIAL_PATH_V2 30 秒无返回的根因）。
 * 因此 preparePdfPreview 支持只渲染指定页；此处锁定生成的查看器 HTML 确实只渲染目标页。
 */
describe('PDF 预览只栅格化被请求的页', () => {
  let pdfDir: string
  let pdfPath: string

  beforeEach(() => {
    pdfDir = mkdtempSync(join(tmpdir(), 'pdf-preview-'))
    pdfPath = join(pdfDir, 'material.pdf')
    // 只需存在且不超过体积上限；本用例校验的是生成的查看器 HTML，不真正解析 PDF。
    writeFileSync(pdfPath, '%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n')
    cleanPreviewTmpDir()
  })

  afterEach(() => {
    rmSync(pdfDir, { recursive: true, force: true })
  })

  /**
   * 取出本次生成的查看器 HTML。
   *
   * writeTempHtml 按内容哈希命名并复用同名文件，因此每次用例前先清空预览临时目录，
   * 保证调用后目录里恰好只有本次生成的那一份，断言不会命中历史残留。
   */
  const readViewerHtml = (tmpHtmlUrl: string): string => {
    expect(tmpHtmlUrl).toMatch(/^cdut-file:\/\/[0-9a-f-]+$/i)
    const previewDir = join(tmpdir(), 'profer-preview')
    const files = readdirSync(previewDir).filter((name) => name.startsWith('preview-') && name.endsWith('.html'))
    expect(files).toHaveLength(1)
    const html = readFileSync(join(previewDir, files[0]!), 'utf8')
    expect(html).toContain('agent-preview:pdf-ready')
    return html
  }

  test('Given 只请求第 7 页 When 生成查看器 Then 初始渲染只包含该页，不再整份渲染', async () => {
    const prepared = await preparePdfPreview(pdfPath, [pdfPath], { pages: [7] })
    expect(prepared).not.toBeNull()
    const html = readViewerHtml(prepared!.tmpHtmlUrl)

    expect(html).toContain('const initialPages = [7];')
    // 初始渲染走限定页分支：renderAll() 只允许出现在「未限定页」的 else 分支里
    const guardedStart = html.indexOf('if (initialPages.length > 0) {')
    expect(guardedStart).toBeGreaterThan(-1)
    const guardedBranch = html.slice(guardedStart, html.indexOf('} else {', guardedStart))
    expect(guardedBranch).toContain('await renderPages(initialPages.filter(')
    expect(guardedBranch).not.toContain('renderAll')
  })

  test('Given 未限定页 When 生成查看器 Then 仍整份渲染（人类预览与概览语义不变）', async () => {
    const prepared = await preparePdfPreview(pdfPath, [pdfPath])
    expect(prepared).not.toBeNull()
    const html = readViewerHtml(prepared!.tmpHtmlUrl)
    expect(html).toContain('const initialPages = [];')
    expect(html).toContain('await renderAll();')
  })

  test('Given 重复或非法页码 When 生成查看器 Then 去重且丢弃非正整数', async () => {
    const prepared = await preparePdfPreview(pdfPath, [pdfPath], { pages: [3, 3, 0, -1, 2.5, 5] })
    expect(prepared).not.toBeNull()
    expect(readViewerHtml(prepared!.tmpHtmlUrl)).toContain('const initialPages = [3,5];')
  })
})
