/**
 * CSLab 渲染进程侧出版图导出
 */

import type {
  CsLabPlotDocument,
  CsLabPlotExportOptions,
  CsLabPlotExportResult,
} from '@profer/shared'
import { JOURNAL_PRESETS } from '@profer/shared'
import { drawPlotToCanvas } from './canvas-plot-renderer'
import { buildPlotRenderModel } from './cslab-plot-render-model'

function pixelSize(document: CsLabPlotDocument, dpi: number): { width: number; height: number } {
  return {
    width: Math.max(1, Math.round((document.sizeMm.width / 25.4) * dpi)),
    height: Math.max(1, Math.round((document.sizeMm.height / 25.4) * dpi)),
  }
}

/** 生成高分辨率 PNG dataURL（用于 PNG/TIFF 导出）。 */
export async function rasterizePlot(
  document: CsLabPlotDocument,
  dpi: number,
  transparent: boolean,
): Promise<string> {
  const { width, height } = pixelSize(document, dpi)
  const canvas = window.document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('无法创建绘图画布')
  if (transparent) {
    context.clearRect(0, 0, width, height)
  }
  const preset = JOURNAL_PRESETS[document.presetId] ?? JOURNAL_PRESETS.default
  const model = buildPlotRenderModel(document, preset, width, height)
  drawPlotToCanvas(context, model, document, preset, 1, transparent)
  return canvas.toDataURL('image/png')
}

/** 调用主进程导出图表。 */
export async function exportPlot(
  labId: string,
  document: CsLabPlotDocument,
  options: CsLabPlotExportOptions,
): Promise<CsLabPlotExportResult> {
  let rasterDataUrl: string | undefined
  if (options.format === 'png' || options.format === 'tiff') {
    rasterDataUrl = await rasterizePlot(document, options.dpi, options.transparentBackground)
  }
  return window.electronAPI.cslab.exportFigure({
    labId,
    plot: document,
    options: { ...options, rasterDataUrl },
  })
}
