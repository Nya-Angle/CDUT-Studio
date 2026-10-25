/**
 * 审核材料分类专用的本地 OCR 试算：复用已有 SystemTesseractOcrPort + 安全页面资产解析。
 * Main 从唯一的原生 Case 读取真实版本，只读取最多三个扫描页，不修改文档、解析版本或审核结果。
 */
import type { CaseAggregateV2, DocumentVersion, MaterialOcrClassification, TemplateVersion } from '@profer/shared'
import { realpathSync, statSync } from 'node:fs'
import { isAbsolute, join, relative, resolve } from 'node:path'
import { classifyMaterialLocally } from '@profer/shared'
import { readAggregate } from './case-store-v2'
import { getReviewCasesDir } from './case-store'
import { isNativeWorkspaceCaseV3 } from './native-workspace-case-v3'
import { getTemplate } from './template-store'
import { SystemTesseractOcrPort } from './system-tesseract-ocr-adapter'
import { recognizeDocumentImages, type OcrPageRecord } from './v2-executor-factory'

const IMAGE_EXTENSION = /\.(png|jpe?g|gif|webp|bmp|tiff?)$/i
const MAX_OCR_PAGES = 3
const MAX_OCR_IMAGE_BYTES = 12 * 1024 * 1024

/** 只挑当前有效材料的图像资产；若纯图片没生成图像块，仍可扫描已保存的真实原件。 */
export function selectedImageBlocks(document: DocumentVersion): DocumentVersion['blocks'] {
  const blocks = document.blocks.filter(block => block.kind === 'image' && block.imageAssetPath)
  if (blocks.length > 0) return blocks.slice(0, MAX_OCR_PAGES)
  if (!IMAGE_EXTENSION.test(document.fileName)) return []
  return [{ blockId: `ocr-intake-${document.versionId}`, kind: 'image', text: '', imageAssetPath: document.assetPath,
    location: { kind: 'file' } }]
}

/** OCR 的临时识别结果只进入本地分类器，不写回案卷；无可信文字则不造假。 */
export function classifyRecognizedPages(
  document: DocumentVersion, template: TemplateVersion | undefined, pages: readonly OcrPageRecord[],
): MaterialOcrClassification {
  const recognized = pages.filter(page => page.status === 'done').flatMap(page => page.blocks ?? [])
  const text = recognized.map(block => block.text).join(' ').trim()
  if (!text) return {
    status: 'failed', documentVersionId: document.versionId,
    message: pages.find(page => page.status !== 'done')?.reason ?? '本地 OCR 未识别出有效文字',
  }
  const classification = classifyMaterialLocally({
    document: { fileName: document.fileName, mimeType: document.mimeType, byteHash: document.byteHash,
      parseStatus: 'parsed', blocks: recognized.map(block => ({ text: block.text, kind: 'paragraph' })) },
    template,
  })
  return { status: 'recognized', documentVersionId: document.versionId,
    message: '本地 OCR 已识别文字，以下仍是待确认的分类建议',
    engine: pages.find(page => page.engine)?.engine ?? '本地 Tesseract',
    recognizedChars: text.length, classification }
}

export type MaterialOcrRead =
  | { status: 'recognized'; document: DocumentVersion; pages: OcrPageRecord[] }
  | { status: 'unavailable' | 'failed'; documentVersionId?: string; message: string }

/**
 * 只读识别当前有效材料的扫描页。Renderer 无法提供路径或文本；
 * Main 自行 realpath 核验案卷边界，失败时如实返回状态而不是编造内容。
 */
export async function readMaterialOcrPages(caseId: string, documentId: string): Promise<MaterialOcrRead> {
  const aggregate = readAggregate(caseId)
  if (!aggregate || !isNativeWorkspaceCaseV3(aggregate) || aggregate.caseV2.id !== caseId || aggregate.caseV2.stage === 'archived')
    return { status: 'failed', message: '当前仅支持对有效的原生案卷进行本地 OCR 分类' }
  const document = aggregate.caseV2.documents.find(item => item.active !== false && item.documentId === documentId)
  if (!document) return { status: 'failed', message: '待识别材料不存在或已失效' }
  const imageBlocks = selectedImageBlocks(document)
  if (imageBlocks.length === 0) return { status: 'failed', documentVersionId: document.versionId,
    message: '该材料没有可用扫描页；请检查是否已生成 PDF 图像资产' }
  const port = await SystemTesseractOcrPort.create()
  if (!port.available) return { status: 'unavailable', documentVersionId: document.versionId,
    message: port.unavailableReason ?? '当前设备未安装可用的本地 OCR 引擎' }

  // 最终 realpath 核验阻断符号链接越界；原始文件字节和路径均不交给 Renderer。
  const caseRoot = realpathSync(join(getReviewCasesDir(), caseId))
  const safeBlocks = imageBlocks.map(block => {
    const asset = block.imageAssetPath!
    const actual = realpathSync(isAbsolute(asset) ? resolve(asset) : resolve(caseRoot, asset))
    const within = relative(caseRoot, actual)
    const info = statSync(actual)
    if (!within || within === '..' || within.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) || isAbsolute(within) ||
        !info.isFile() || info.size === 0 || info.size > MAX_OCR_IMAGE_BYTES) {
      throw new Error('OCR 图像资产不在当前案卷安全范围内，或单张大于 12 MB')
    }
    return { ...block, imageAssetPath: actual }
  })
  // 传入只含一个文档、最多三个图片块的内存投影；底层仍复用已有 OCR 引擎与坐标契约。
  const limited: CaseAggregateV2 = { ...aggregate, caseV2: { ...aggregate.caseV2,
    documents: [{ ...document, blocks: safeBlocks }],
  } }
  const pages = await recognizeDocumentImages(limited, caseId, port, undefined, caseRoot)
  return { status: 'recognized', document, pages }
}

export async function classifyMaterialWithExistingOcr(caseId: string, documentId: string): Promise<MaterialOcrClassification> {
  const read = await readMaterialOcrPages(caseId, documentId)
  if (read.status !== 'recognized') return { status: read.status,
    ...(read.documentVersionId ? { documentVersionId: read.documentVersionId } : {}),
    message: read.message }
  const aggregate = readAggregate(caseId)
  return classifyRecognizedPages(read.document,
    aggregate ? getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion) : undefined, read.pages)
}
