/**
 * 公式 SymPy 验算与可选 OCR 的 TS 包装层
 *
 * 评审加固 11.5：verify 与 ocr 完全隔离；
 * OCR 失败只返回 ok:false，不影响用户手工输入 LaTeX 的验算链路。
 */

import { promises as fs } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type {
  CsLabFormulaOcrResult,
  CsLabFormulaVerifyInput,
  CsLabFormulaVerifyResult,
  CsLabSelectionOcrResult,
} from '@profer/shared'
import { assertLabId } from './cslab-paths'
import {
  defaultCsLabPythonRunner,
  type CsLabPythonRunner,
} from './cslab-python-runtime'

const MAX_IMAGE_BYTES = 24 * 1024 * 1024

function parseDataUrl(dataUrl: string): { buffer: Buffer; extension: string } {
  const match = /^data:image\/(png|jpeg|jpg);base64,([A-Za-z0-9+/=\s]+)$/.exec(dataUrl.trim())
  if (!match) throw new Error('框选图像格式无效（仅支持 PNG/JPEG dataURL）')
  const extension = match[1] === 'jpeg' ? 'jpg' : match[1]!
  const buffer = Buffer.from(match[2]!.replace(/\s/g, ''), 'base64')
  if (buffer.length === 0) throw new Error('框选图像为空')
  if (buffer.length > MAX_IMAGE_BYTES) throw new Error('框选图像超过 24MB，请缩小框选范围')
  return { buffer, extension }
}

interface RawVerifyPayload {
  ok?: boolean
  engine?: string
  message?: string
  equivalent?: boolean
  residual?: string | null
  dimensions?: unknown
  singularities?: unknown
  limitNotes?: unknown
  preprocess?: { appliedFixes?: unknown }
  elapsedMs?: number
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

export async function verifyFormula(
  input: CsLabFormulaVerifyInput,
  runner: CsLabPythonRunner = defaultCsLabPythonRunner,
): Promise<CsLabFormulaVerifyResult> {
  const labId = assertLabId(input.labId)
  const lhs = typeof input.latexLhs === 'string' ? input.latexLhs.trim() : ''
  const rhs = typeof input.latexRhs === 'string' ? input.latexRhs.trim() : ''
  if (!lhs || !rhs) {
    return { ok: false, engine: 'sympy', message: '请提供等式左右两侧的 LaTeX' }
  }

  try {
    const stdout = await runner.runPython(
      labId,
      'cslab-formula-verifier.py',
      [
        '--mode',
        'verify',
        '--lhs',
        lhs,
        '--rhs',
        rhs,
        '--symbols',
        JSON.stringify(input.symbolDimensions ?? {}),
      ],
      { timeoutMs: 120_000, profile: 'formula' },
    )
    const payload = JSON.parse(stdout.trim()) as RawVerifyPayload
    return {
      ok: payload.ok === true,
      engine: payload.engine ?? 'sympy',
      message: payload.message,
      equivalent: typeof payload.equivalent === 'boolean' ? payload.equivalent : undefined,
      residual: payload.residual == null ? undefined : String(payload.residual),
      dimensions:
        payload.dimensions && typeof payload.dimensions === 'object'
          ? (payload.dimensions as CsLabFormulaVerifyResult['dimensions'])
          : undefined,
      singularities: toStringArray(payload.singularities),
      limitNotes: toStringArray(payload.limitNotes),
      preprocess: {
        appliedFixes: toStringArray(payload.preprocess?.appliedFixes),
      },
      elapsedMs: Number(payload.elapsedMs ?? 0) || undefined,
    }
  } catch (error) {
    return {
      ok: false,
      engine: 'sympy',
      message: error instanceof Error ? error.message : '公式验算失败',
    }
  }
}

interface RawOcrPayload {
  ok?: boolean
  latex?: string
  engine?: string
  message?: string
}

export async function ocrFormula(
  labIdInput: string,
  imageDataUrl: string,
  runner: CsLabPythonRunner = defaultCsLabPythonRunner,
): Promise<CsLabFormulaOcrResult> {
  const labId = assertLabId(labIdInput)
  const image = parseDataUrl(imageDataUrl)
  const tempDir = await fs.mkdtemp(join(tmpdir(), 'cslab-formula-'))
  const imagePath = join(tempDir, `formula-${randomUUID().slice(0, 8)}.${image.extension}`)

  try {
    await fs.writeFile(imagePath, image.buffer)
    const stdout = await runner.runPython(
      labId,
      'cslab-formula-verifier.py',
      ['--mode', 'ocr', '--image', imagePath],
      // OCR 首次可能加载模型，给予更宽裕的超时。
      { timeoutMs: 180_000, profile: 'formula-ocr' },
    )
    const payload = JSON.parse(stdout.trim()) as RawOcrPayload
    return {
      ok: payload.ok === true,
      latex: payload.latex,
      engine: payload.engine ?? 'pix2text',
      message: payload.message,
    }
  } catch (error) {
    return {
      ok: false,
      engine: 'pix2text',
      message: error instanceof Error ? error.message : '公式识别失败',
    }
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => undefined)
  }
}

interface RawOcrTextPayload {
  ok?: boolean
  engine?: string
  text?: string
  message?: string
}

/**
 * 选区纯文本 OCR（学术翻译前置）：Pix2Text 整页逐行识别。
 * missingDependency=true 表示 Pix2Text 未安装（engine=pix2text-missing），
 * 面板应展示一键安装引导而非视为识别失败。
 */
export async function ocrSelectionText(
  labIdInput: string,
  imageDataUrl: string,
  runner: CsLabPythonRunner = defaultCsLabPythonRunner,
): Promise<CsLabSelectionOcrResult> {
  const labId = assertLabId(labIdInput)
  const image = parseDataUrl(imageDataUrl)
  const tempDir = await fs.mkdtemp(join(tmpdir(), 'cslab-ocr-text-'))
  const imagePath = join(tempDir, `selection-${randomUUID().slice(0, 8)}.${image.extension}`)

  try {
    await fs.writeFile(imagePath, image.buffer)
    const stdout = await runner.runPython(
      labId,
      'cslab-formula-verifier.py',
      ['--mode', 'ocr-text', '--image', imagePath],
      { timeoutMs: 180_000, profile: 'formula-ocr' },
    )
    const payload = JSON.parse(stdout.trim()) as RawOcrTextPayload
    const missingDependency = payload.engine === 'pix2text-missing'
    return {
      ok: payload.ok === true,
      text: payload.text,
      missingDependency: missingDependency || undefined,
      message: payload.message,
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : '文本识别失败',
    }
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => undefined)
  }
}

// ===== PDF 区域 OCR（--mode ocr-pdf）：文本字块与公式 LaTeX 识别 =====

/** PDF 区域 OCR 字块（rect 为相对裁剪图的像素坐标） */
export interface CsLabPdfOcrBlock {
  text: string
  rect: { x: number; y: number; w: number; h: number }
  confidence: number
}

export interface CsLabPdfOcrTextResult {
  ok: boolean
  blocks: CsLabPdfOcrBlock[]
  imageWidth: number
  imageHeight: number
  missingDependency?: boolean
  message?: string
}

/** PDF 区域 OCR 输入：1-based 页码 + 归一化 bbox [x0, y0, x1, y1] */
interface CsLabPdfOcrInput {
  pdfPath: string
  page: number
  bbox: [number, number, number, number]
}

interface RawPdfOcrTextPayload {
  ok?: boolean
  engine?: string
  blocks?: unknown
  imageWidth?: unknown
  imageHeight?: unknown
  message?: string
}

interface RawPdfOcrFormulaPayload {
  ok?: boolean
  engine?: string
  latex?: string
  message?: string
}

function toFiniteNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

/** 组装 --mode ocr-pdf 的公共参数（页码 + 归一化 bbox + 识别类型） */
function buildPdfOcrArgs(kind: 'text' | 'formula', input: CsLabPdfOcrInput): string[] {
  return [
    '--mode',
    'ocr-pdf',
    '--pdf',
    input.pdfPath,
    '--page',
    String(input.page),
    '--bbox',
    input.bbox.join(','),
    '--kind',
    kind,
  ]
}

/**
 * 对 PDF 指定页的归一化区域做整页/区域文本 OCR。
 * 失败只返回 ok:false 并带回 message，绝不抛出（解析主流程不得被识别失败拖垮）。
 */
export async function ocrPdfRegionText(
  labIdInput: string,
  input: CsLabPdfOcrInput,
  runner: CsLabPythonRunner = defaultCsLabPythonRunner,
): Promise<CsLabPdfOcrTextResult> {
  try {
    const labId = assertLabId(labIdInput)
    const stdout = await runner.runPython(
      labId,
      'cslab-formula-verifier.py',
      buildPdfOcrArgs('text', input),
      // OCR 首次可能加载模型，给予更宽裕的超时。
      { timeoutMs: 180_000, profile: 'formula-ocr' },
    )
    const payload = JSON.parse(stdout.trim()) as RawPdfOcrTextPayload
    const blocks = Array.isArray(payload.blocks)
      ? payload.blocks.flatMap((item): CsLabPdfOcrBlock[] => {
          const block = item as Partial<CsLabPdfOcrBlock> | null
          if (!block || typeof block.text !== 'string' || !block.rect) return []
          const rect = block.rect
          return [
            {
              text: block.text,
              rect: {
                x: toFiniteNumber(rect.x),
                y: toFiniteNumber(rect.y),
                w: toFiniteNumber(rect.w),
                h: toFiniteNumber(rect.h),
              },
              confidence: toFiniteNumber(block.confidence),
            },
          ]
        })
      : []
    return {
      ok: payload.ok === true,
      blocks,
      imageWidth: toFiniteNumber(payload.imageWidth),
      imageHeight: toFiniteNumber(payload.imageHeight),
      missingDependency: payload.engine === 'pix2text-missing' || undefined,
      message: payload.message,
    }
  } catch (error) {
    return {
      ok: false,
      blocks: [],
      imageWidth: 0,
      imageHeight: 0,
      message: error instanceof Error ? error.message : '文本识别失败',
    }
  }
}

/** 对 PDF 指定页的归一化区域做公式识别，返回端到端 LaTeX */
export async function ocrPdfFormula(
  labIdInput: string,
  input: CsLabPdfOcrInput,
  runner: CsLabPythonRunner = defaultCsLabPythonRunner,
): Promise<{ ok: boolean; latex?: string; missingDependency?: boolean; message?: string }> {
  try {
    const labId = assertLabId(labIdInput)
    const stdout = await runner.runPython(
      labId,
      'cslab-formula-verifier.py',
      buildPdfOcrArgs('formula', input),
      // 公式识别首次同样可能加载模型，给予更宽裕的超时。
      { timeoutMs: 180_000, profile: 'formula-ocr' },
    )
    const payload = JSON.parse(stdout.trim()) as RawPdfOcrFormulaPayload
    return {
      ok: payload.ok === true,
      latex: payload.latex,
      missingDependency: payload.engine === 'pix2text-missing' || undefined,
      message: payload.message,
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : '公式识别失败',
    }
  }
}
