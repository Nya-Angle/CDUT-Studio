/**
 * 图表逆向数字化 TS 包装层
 *
 * 职责：校验渲染进程传入的 dataURL、落临时文件、调用 Python 脚本、归一化 JSON。
 * 红线：Python 不可用或失败时返回 ok:false 与原因，绝不生成伪造曲线。
 */

import { promises as fs } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type {
  CsLabDigitizedSeries,
  CsLabPlotDigitizeInput,
  CsLabPlotDigitizeResult,
  CsLabTickReadInput,
  CsLabTickReadResult,
} from '@profer/shared'
import { assertLabId } from './cslab-paths'
import { decodeImageDataUrl } from './cslab-image-data'
import {
  defaultCsLabPythonRunner,
  type CsLabPythonRunner,
} from './cslab-python-runtime'

interface RawDigitizePayload {
  ok?: boolean
  message?: string
  width?: number
  height?: number
  rotationDeg?: number
  axisFit?: {
    x?: { scale?: string; r2?: number }
    y?: { scale?: string; r2?: number }
  }
  series?: Array<{
    label?: string
    points?: Array<[number, number]>
    pixels?: Array<[number, number]>
  }>
}

function parseDataUrl(dataUrl: string): { buffer: Buffer; extension: string } {
  const decoded = decodeImageDataUrl(dataUrl)
  if (decoded.extension === 'svg') {
    throw new Error('SVG 需先栅格化为 PNG/WebP，当前不支持直接数字化')
  }
  return { buffer: decoded.buffer, extension: decoded.extension }
}

function normalizeSeries(raw: RawDigitizePayload['series']): CsLabDigitizedSeries[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item, index) => {
      const points = Array.isArray(item.points)
        ? item.points
            .filter(
              (point): point is [number, number] =>
                Array.isArray(point) &&
                point.length >= 2 &&
                Number.isFinite(Number(point[0])) &&
                Number.isFinite(Number(point[1])),
            )
            .map((point) => [Number(point[0]), Number(point[1])] as [number, number])
        : []
      const pixels = Array.isArray(item.pixels)
        ? item.pixels
            .filter(
              (point): point is [number, number] =>
                Array.isArray(point) &&
                point.length >= 2 &&
                Number.isFinite(Number(point[0])) &&
                Number.isFinite(Number(point[1])),
            )
            .map((point) => [Number(point[0]), Number(point[1])] as [number, number])
        : []
      return {
        label: item.label ?? `series-${index + 1}`,
        points,
        pixels,
      }
    })
    .filter((item) => item.points.length >= 2)
}

function normalizeScale(value: string | undefined): 'linear' | 'log' {
  return value === 'log' ? 'log' : 'linear'
}

export async function digitizePlot(
  input: CsLabPlotDigitizeInput,
  runner: CsLabPythonRunner = defaultCsLabPythonRunner,
): Promise<CsLabPlotDigitizeResult> {
  const labId = assertLabId(input.labId)
  const image = parseDataUrl(input.imageDataUrl)

  if (!input.calibration?.x?.ticks || !input.calibration?.y?.ticks) {
    throw new Error('缺少坐标轴标定刻度')
  }
  if (input.calibration.x.ticks.length < 2 || input.calibration.y.ticks.length < 2) {
    throw new Error('X/Y 轴各至少需要 2 个标定刻度')
  }

  const tempDir = await fs.mkdtemp(join(tmpdir(), 'cslab-plot-'))
  const imagePath = join(tempDir, `crop-${randomUUID().slice(0, 8)}.${image.extension}`)
  try {
    await fs.writeFile(imagePath, image.buffer)
    const args = [
      '--input',
      imagePath,
      '--calibration',
      JSON.stringify(input.calibration),
      '--mode',
      input.mode,
      '--tolerance',
      String(Math.max(8, Math.min(60, input.tolerance ?? 28))),
    ]
    if (input.color) args.push('--color', input.color)
    if (input.colors && input.colors.length > 0) {
      const validColors = input.colors
        .map((color) => color.trim())
        .filter((color) => /^#[0-9a-fA-F]{6}$/.test(color))
      if (validColors.length > 0) args.push('--colors', validColors.join(','))
    }
    if (input.seriesCount && input.seriesCount > 0) {
      args.push('--series-count', String(Math.max(2, Math.min(4, Math.floor(input.seriesCount)))))
    }

    const stdout = await runner.runPython(labId, 'cslab-plot-digitizer.py', args, {
      timeoutMs: 120_000,
      profile: 'plot',
    })
    const payload = JSON.parse(stdout.trim()) as RawDigitizePayload
    const series = normalizeSeries(payload.series)

    if (!payload.ok || series.length === 0) {
      return {
        ok: false,
        message: payload.message ?? '未能从框选区域提取到有效曲线',
        width: Number(payload.width ?? 0),
        height: Number(payload.height ?? 0),
        series: [],
      }
    }

    return {
      ok: true,
      width: Number(payload.width ?? 0),
      height: Number(payload.height ?? 0),
      rotationDeg: Number(payload.rotationDeg ?? 0),
      axisFit: {
        x: {
          scale: normalizeScale(payload.axisFit?.x?.scale),
          r2: Number(payload.axisFit?.x?.r2 ?? 0),
        },
        y: {
          scale: normalizeScale(payload.axisFit?.y?.scale),
          r2: Number(payload.axisFit?.y?.r2 ?? 0),
        },
      },
      series,
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : '图表数字化失败',
      width: 0,
      height: 0,
      series: [],
    }
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => undefined)
  }
}

// ===== 刻度数值自动读取（--mode read-tick，零依赖 cv2 模板匹配） =====

interface RawTickReadPayload {
  ok?: boolean
  value?: number | null
  confidence?: number
  missing?: string[]
  message?: string
}

/**
 * 读取刻度点外侧标注区域的数值（灰度 → Otsu 二值化 → 连通域切字 → 归一化模板匹配）。
 *
 * 红线（R4 低置信度防御）：置信度低于阈值时 value 恒为 null，由用户手填，绝不猜；
 * Python 不可用或失败时 ok:false 与原因，绝不伪造刻度值。
 */
export async function readTickValue(
  input: CsLabTickReadInput,
  runner: CsLabPythonRunner = defaultCsLabPythonRunner,
): Promise<CsLabTickReadResult> {
  const labId = assertLabId(input.labId)
  const image = parseDataUrl(input.imageDataUrl)
  const rect = input.rect
  if (
    !rect
    || !Number.isFinite(rect.x)
    || !Number.isFinite(rect.y)
    || !Number.isFinite(rect.w)
    || !Number.isFinite(rect.h)
    || rect.w <= 0
    || rect.h <= 0
  ) {
    return { ok: false, value: null, confidence: 0, message: '刻度识别区域无效' }
  }

  const tempDir = await fs.mkdtemp(join(tmpdir(), 'cslab-tick-'))
  const imagePath = join(tempDir, `tick-${randomUUID().slice(0, 8)}.${image.extension}`)
  try {
    await fs.writeFile(imagePath, image.buffer)
    const rectText = [
      Math.round(rect.x),
      Math.round(rect.y),
      Math.round(rect.w),
      Math.round(rect.h),
    ].join(',')
    const stdout = await runner.runPython(
      labId,
      'cslab-plot-digitizer.py',
      ['--mode', 'read-tick', '--input', imagePath, '--rect', rectText],
      { timeoutMs: 60_000 },
    )
    const payload = JSON.parse(stdout.trim()) as RawTickReadPayload
    const missingDependency = Array.isArray(payload.missing) && payload.missing.length > 0
    const confidence = Number.isFinite(Number(payload.confidence))
      ? Math.max(0, Math.min(1, Number(payload.confidence)))
      : 0
    const value = typeof payload.value === 'number' && Number.isFinite(payload.value)
      ? payload.value
      : null
    return {
      ok: payload.ok === true,
      // 低置信度防御：Python 侧已置 null，此处再兜底一次，绝不猜。
      value: payload.ok === true ? value : null,
      confidence,
      missingDependency: missingDependency || undefined,
      message: payload.message,
    }
  } catch (error) {
    return {
      ok: false,
      value: null,
      confidence: 0,
      message: error instanceof Error ? error.message : '刻度识别失败',
    }
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => undefined)
  }
}
