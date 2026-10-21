/**
 * T02: optional, real OCR enrichment of physical raster originals, PPTX pictures
 * and PDF page rasters. Produces source-anchored OCR hypotheses, never a
 * human-confirmed verdict or a new Case/Run write.
 *
 * This is a Main-side domain adapter: paths come from a trusted source loader.
 * No OCR executable/resources -> partial coverage and an explicit warning.
 */
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { copyFile, mkdir, mkdtemp, readdir, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, extname, join, posix } from 'node:path'
import type { ReviewDocumentBlock, SourceDocument } from '@profer/shared'
import type { OcrPort, OcrResult } from './ocr-port'
import { parseFileIntoSourceDocument } from './document-service'

export interface T02OcrInput {
  /** Main-verified original path; never accept arbitrary Renderer paths. */
  filePath: string
  fileName: string
  role: SourceDocument['role']
  assetRelativePath?: string
  assetDirectory?: string
  ocr: OcrPort
  /** Explicitly skip PDF page rendering; by default, visual OCR checks ALL pages
   * up to maxPdfPages, including mixed text/scanned PDFs. */
  inspectPdfPages?: boolean
  /** Explicit work bound for long PDFs; remaining pages are reported partial. */
  maxPdfPages?: number
}

export interface T02OcrOutcome {
  source: SourceDocument
  ocrBlocks: number
  inspectedImages: number
  imagesAwaitingInspection: number
  warnings: string[]
  engine: string | null
}

function execute(command: string, args: string[], timeoutMs = 120_000): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    let err = ''
    let done = false
    const settle = (fn: () => void): void => {
      if (done) return
      done = true
      clearTimeout(timeout)
      fn()
    }
    const timeout = setTimeout(() => {
      child.kill('SIGTERM')
      settle(() => reject(new Error(command + ' 超时')))
    }, timeoutMs)
    child.stdout.on('data', chunk => { out += String(chunk) })
    child.stderr.on('data', chunk => { err += String(chunk) })
    child.on('error', e => settle(() => reject(new Error(command + ' 不可用: ' + e.message))))
    child.on('close', code => settle(() => code === 0
      ? resolve(out)
      : reject(new Error(command + ' 失败: ' + err.slice(0, 220)))))
  })
}

/** Uses Poppler if present. The error is returned as coverage, not discarded. */
async function rasterizePdfPages(
  filePath: string,
  maxPages: number,
): Promise<{ pages: Array<{ page: number; path: string }>; totalPages: number | null; temporaryRoot: string }> {
  const root = await mkdtemp(join(tmpdir(), 'review-t02-pdf-pages-'))
  try {
    let totalPages: number | null = null
    try {
      const info = await execute('pdfinfo', [filePath], 15_000)
      const count = Number(info.match(/^Pages:\s*(\d+)/m)?.[1])
      if (Number.isInteger(count) && count > 0) totalPages = count
    } catch {
      // Rasterization may still work without pdfinfo; report unknown coverage.
    }
    const prefix = join(root, 'page')
    await execute('pdftoppm', ['-f', '1', '-l', String(maxPages), '-scale-to', '1800', '-png', filePath, prefix])
    const entries = await readdir(root)
    const pages = entries.flatMap(name => {
      const m = /^page-(\d+)\.png$/.exec(name)
      return m ? [{ page: Number(m[1]), path: join(root, name) }] : []
    }).sort((a, b) => a.page - b.page)
    return { pages, totalPages, temporaryRoot: root }
  } catch (e) {
    await rm(root, { recursive: true, force: true })
    throw e
  }
}

/** OCR pixel rectangles can locate a block on a *whole-page raster*.
 * PPTX embedded pictures have an image-space rectangle, not slide coordinates;
 * preserve their image link without pretending to know a slide-page bbox.
 */
function ocrBlocksForImage(
  image: ReviewDocumentBlock, result: OcrResult, wholePageImage: boolean,
): ReviewDocumentBlock[] {
  const clamp = (n: number): number => Math.max(0, Math.min(1, n))
  const canLocate = wholePageImage && result.imageWidth > 0 && result.imageHeight > 0
  return result.blocks.filter(b => b.text.trim()).map((b, i) => ({
    id: image.id + '-ocr-' + String(i + 1).padStart(3, '0'),
    kind: 'paragraph' as const,
    page: image.page,
    text: b.text.trim(),
    confidence: b.confidence,
    readingOrder: i,
    ...(image.imageAssetPath ? { imageAssetPath: image.imageAssetPath } : {}),
    ...(canLocate ? { bbox: [
      clamp(b.rect.x / result.imageWidth),
      clamp(b.rect.y / result.imageHeight),
      clamp((b.rect.x + b.rect.w) / result.imageWidth),
      clamp((b.rect.y + b.rect.h) / result.imageHeight),
    ] as NonNullable<ReviewDocumentBlock['bbox']> } : {}),
  }))
}

async function readImage(
  source: SourceDocument, image: ReviewDocumentBlock,
  physicalPath: string, ocr: OcrPort, wholePageImage: boolean,
): Promise<{ blocks: ReviewDocumentBlock[]; engine: string }> {
  const result = await ocr.recognize({
    documentVersionId: source.id,
    pageAssetPath: physicalPath,
    language: 'chi_sim+eng',
    timeoutMs: 60_000,
  })
  return { blocks: ocrBlocksForImage(image, result, wholePageImage), engine: result.engine }
}

/**
 * Run OCR on actual persisted images only. Existing plain-text parse is reused.
 * A recognized word becomes a new OCR block tied to its source image page;
 * source.parseStatus intentionally stays partial until a reviewer verifies it.
 */
export async function parseT02VisualMaterialWithOcr(input: T02OcrInput): Promise<T02OcrOutcome> {
  const source = await parseFileIntoSourceDocument(
    input.filePath, input.fileName, input.role,
    input.assetRelativePath, input.assetDirectory,
  )
  const warnings: string[] = []
  const ext = extname(input.fileName).toLowerCase()
  const shouldRasterize = ext === '.pdf' && input.inspectPdfPages !== false
  let engine: string | null = null
  let inspectedImages = 0
  let imagesAwaitingInspection = 0
  const newOcrBlocks: ReviewDocumentBlock[] = []
  const images = [...source.blocks.filter(b => b.kind === 'image')]
  let temporaryRoot: string | null = null

  try {
    if (shouldRasterize) {
      if (!input.assetDirectory || !input.assetRelativePath) {
        warnings.push('扫描 PDF 视觉提取需要真实案卷原件目录；未登记临时页为正式来源')
      } else {
        try {
          const maxPages = Math.min(100, Math.max(1, Math.floor(input.maxPdfPages ?? 24)))
          const raster = await rasterizePdfPages(input.filePath, maxPages)
          temporaryRoot = raster.temporaryRoot
          if (raster.totalPages === null) warnings.push('PDF 总页数未知，需核对页数覆盖')
          else if (raster.totalPages > raster.pages.length) {
            warnings.push('PDF 共 ' + raster.totalPages + ' 页，本轮仅渲染 ' + raster.pages.length + ' 页，余页待处理')
            // The omitted pages are real, uninspected sources. Count them as
            // pending rather than showing a misleading 0 awaiting inspection.
            imagesAwaitingInspection += raster.totalPages - raster.pages.length
          }
          if (raster.pages.length === 0) warnings.push('PDF 未生成可识别页面')
          for (const item of raster.pages) {
            const bytes = await readFile(item.path)
            const digest = createHash('sha256').update(bytes).digest('hex')
            const filename = 't02-pdf-page-' + item.page + '-' + digest.slice(0, 12) + '.png'
            await mkdir(input.assetDirectory, { recursive: true })
            await copyFile(item.path, join(input.assetDirectory, filename))
            const relative = posix.join(posix.dirname(input.assetRelativePath.replace(/\\/g, '/')), filename)
            const block: ReviewDocumentBlock = {
              id: 'blk-t02-' + source.id + '-pdf-page-' + item.page + '-' + digest.slice(0, 8),
              kind: 'image', text: '', page: item.page,
              imageAssetPath: relative,
              imageAlt: 'PDF 第 ' + item.page + ' 页真实渲染，尚需视觉核验',
            }
            images.push(block)
            source.blocks.push(block)
          }
        } catch (error) {
          warnings.push('PDF 页面渲染不可用：' + (error instanceof Error ? error.message : String(error)))
        }
      }
    }

    const knownPaths = new Map<string, string>()
    if (input.assetDirectory && input.assetRelativePath) {
      const relativeDir = posix.dirname(input.assetRelativePath.replace(/\\/g, '/'))
      for (const image of images) {
        if (!image.imageAssetPath) continue
        const normalized = image.imageAssetPath.replace(/\\/g, '/')
        if (posix.dirname(normalized) === relativeDir) {
          knownPaths.set(image.id, join(input.assetDirectory, basename(normalized)))
        }
      }
    }
    if (ext.match(/^\.(png|jpg|jpeg|gif|bmp|webp)$/)) {
      for (const image of images) knownPaths.set(image.id, input.filePath)
    }

    for (const image of images) {
      const physical = knownPaths.get(image.id)
      if (!physical || !input.ocr.available) {
        imagesAwaitingInspection++
        continue
      }
      try {
        // A stand-alone image or a full rendered PDF page has the same pixel
        // canvas as its source page. An Office-embedded image does not.
        const fullPageImage = /^\.(png|jpg|jpeg|gif|bmp|webp)$/.test(ext) ||
          (ext === '.pdf' && image.id.startsWith('blk-t02-' + source.id + '-pdf-page-'))
        const extracted = await readImage(source, image, physical, input.ocr, fullPageImage)
        if (extracted.blocks.length > 0) {
          newOcrBlocks.push(...extracted.blocks)
          inspectedImages++
          engine = extracted.engine
        } else {
          imagesAwaitingInspection++
          warnings.push('第 ' + image.page + ' 页 OCR 无可靠文字，需视觉核验')
        }
      } catch (error) {
        imagesAwaitingInspection++
        warnings.push('第 ' + image.page + ' 页 OCR 未完成：' +
          (error instanceof Error ? error.message : String(error)))
      }
    }
    if (!input.ocr.available && images.length) {
      warnings.push('OCR 引擎不可用：' + (input.ocr.unavailableReason ?? '未安装'))
    }
    if (newOcrBlocks.length > 0) source.blocks.push(...newOcrBlocks)
    if (images.length > 0 || warnings.length > 0) {
      // OCR is not automatic approval. Retain the existing parseError and
      // explicitly describe provenance and what was not fully inspected.
      source.parseStatus = 'partial'
      source.parseError = [
        source.parseError,
        newOcrBlocks.length ? 'OCR 已生成 ' + newOcrBlocks.length + ' 个待人工确认的原件文字块' : '',
        ...warnings,
      ].filter(Boolean).join('；')
    }
    return {
      source, ocrBlocks: newOcrBlocks.length, inspectedImages,
      imagesAwaitingInspection, warnings, engine,
    }
  } finally {
    if (temporaryRoot) await rm(temporaryRoot, { recursive: true, force: true })
  }
}
