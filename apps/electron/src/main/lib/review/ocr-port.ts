/**
 * OCR 与原件预览端口（M2，设计 03 §8 结构化解析端口）
 *
 * 端口模式：M2 定义契约 + Null 实现（如实声明不可用），真实引擎（打包 OCR）在 M5 接入。
 * 端口失败必须显式（available=false + 原因），调用方把对应材料记为 unread/待处理，不冒充已读。
 */

/** OCR 字块（N2c 升级：矩形+置信度+原图变换，07 §6.4） */
export interface OcrBlock {
  text: string
  /** OCR 坐标 → 原图坐标（保存处理前尺寸与 EXIF 方向后变换） */
  rect: { x: number; y: number; w: number; h: number }
  confidence: number
}

export interface OcrRequest {
  documentVersionId: string
  pageAssetPath: string
  language: string
  signal?: AbortSignal
  timeoutMs?: number
}

export interface OcrResult {
  engine: string
  engineVersion: string
  blocks: OcrBlock[]
  /** 原图尺寸（矩形变换依据） */
  imageWidth: number
  imageHeight: number
}

/** OCR 端口（N2c 合同升级：块级矩形输出；Tesseract.js 适配随 N7 打包接入） */
export interface OcrPort {
  readonly available: boolean
  readonly unavailableReason?: string
  recognize(request: OcrRequest): Promise<OcrResult>
}

/** 空实现：如实声明不可用（材料进覆盖账本 unread，不冒充已读） */
export class NullOcrPort implements OcrPort {
  readonly available = false
  readonly unavailableReason = 'OCR 引擎未接入（N7 打包阶段提供 Tesseract.js 适配）'
  async recognize(_request: OcrRequest): Promise<OcrResult> {
    throw new Error(`OCR 不可用: ${this.unavailableReason}`)
  }
}

/** 原件预览描述符（A03：预览不等于解析；各自独立状态） */
export interface PreviewDescriptor {
  documentVersionId: string
  assetPath: string
  mime: string
  /** 图片可直接预览；PDF/Office 预览需页面渲染器（M5），如实标注 */
  preview: 'image' | 'needs-renderer'
  sizeBytes: number
}

export function describePreview(documentVersionId: string, assetPath: string, mime: string, sizeBytes: number): PreviewDescriptor {
  const isImage = mime.startsWith('image/')
  return {
    documentVersionId,
    assetPath,
    mime,
    preview: isImage ? 'image' : 'needs-renderer',
    sizeBytes,
  }
}
