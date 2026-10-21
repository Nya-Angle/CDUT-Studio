/**
 * CSLab Origin 绘图 Canvas 渲染器
 *
 * 在 CSS 像素坐标系绘制；由调用方负责 devicePixelRatio 变换。
 */

import type { CsLabPlotAxisConfig, CsLabPlotDocument, CsLabPlotPreset } from '@profer/shared'
import {
  axisFraction,
  formatMetric,
  niceTicks,
  parseScientificText,
} from '@profer/shared'
import type { CsLabPlotRenderModel } from './cslab-plot-render-model'

const PT_TO_PX = 96 / 72

function drawScientificText(
  ctx: CanvasRenderingContext2D,
  raw: string,
  x: number,
  y: number,
  sizePx: number,
  align: CanvasTextAlign,
  color: string,
): void {
  const parsed = parseScientificText(raw)
  ctx.save()
  ctx.font = `${sizePx}px Arial, Helvetica, sans-serif`
  ctx.fillStyle = color
  ctx.textBaseline = 'middle'
  const totalWidth = parsed.tokens.reduce(
    (sum, token) => sum + ctx.measureText(token.text).width * (token.script === 'normal' ? 1 : 0.72),
    0,
  )
  let cursor = align === 'center' ? x - totalWidth / 2 : align === 'right' ? x - totalWidth : x
  ctx.textAlign = 'left'
  for (const token of parsed.tokens) {
    const tokenSize = token.script === 'normal' ? sizePx : sizePx * 0.72
    ctx.font = `${tokenSize}px Arial, Helvetica, sans-serif`
    const offsetY = token.script === 'sub' ? sizePx * 0.28 : token.script === 'sup' ? -sizePx * 0.32 : 0
    ctx.fillText(token.text, cursor, y + offsetY)
    cursor += ctx.measureText(token.text).width
  }
  ctx.restore()
}

function axisTicks(axis: CsLabPlotAxisConfig, min: number, max: number): number[] {
  if (axis.scale === 'log10' || axis.scale === 'log2') {
    const base = axis.scale === 'log2' ? 2 : 10
    const low = Math.log(Math.max(1e-12, min)) / Math.log(base)
    const high = Math.log(Math.max(1e-12, max)) / Math.log(base)
    const ticks: number[] = []
    for (let exponent = Math.ceil(low); exponent <= Math.floor(high) && ticks.length < 8; exponent += 1) {
      ticks.push(base ** exponent)
    }
    return ticks
  }
  return niceTicks(min, max, axis.majorTick || 5)
}

function drawAxis(
  ctx: CanvasRenderingContext2D,
  axis: CsLabPlotAxisConfig,
  min: number,
  max: number,
  rect: { x: number; y: number; width: number; height: number },
  orientation: 'bottom' | 'left' | 'right',
  tickFontPx: number,
  color: string,
): void {
  const ticks = axisTicks(axis, min, max)
  ctx.save()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 0.6
  for (const value of ticks) {
    const fraction = axisFraction(axis, value, min, max)
    if (fraction === null) continue
    if (orientation === 'bottom') {
      const x = rect.x + fraction * rect.width
      const y = rect.y + rect.height
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y + (axis.tickDirection === 'out' ? 4 : -4))
      ctx.stroke()
      drawScientificText(ctx, formatMetric(value), x, y + 10, tickFontPx, 'center', color)
    } else {
      const y = rect.y + (1 - fraction) * rect.height
      const x = orientation === 'left' ? rect.x : rect.x + rect.width
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + (orientation === 'left' ? 4 : -4), y)
      ctx.stroke()
      drawScientificText(
        ctx,
        formatMetric(value),
        x + (orientation === 'left' ? -7 : 7),
        y,
        tickFontPx,
        orientation === 'left' ? 'right' : 'left',
        color,
      )
    }
  }
  ctx.restore()
}

export function drawPlotToCanvas(
  ctx: CanvasRenderingContext2D,
  model: CsLabPlotRenderModel,
  document: CsLabPlotDocument,
  preset: CsLabPlotPreset,
  dpr = 1,
  transparent = false,
): void {
  const scale = model.scale
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, model.widthPx, model.heightPx)
  if (!transparent) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, model.widthPx, model.heightPx)
  }

  const rect = {
    x: model.plotRect.x * scale,
    y: model.plotRect.y * scale,
    width: model.plotRect.width * scale,
    height: model.plotRect.height * scale,
  }
  const textColor = '#111111'
  const tickFontPx = preset.tickFontPt * PT_TO_PX
  const labelFontPx = preset.axisLabelPt * PT_TO_PX

  const baseLayer = document.layers.find((layer) => layer.visible) ?? document.layers[0]
  if (!baseLayer) return

  const entries = model.series
  const leftEntry = entries.find((entry) => entry.series.yAxis === 0)
  const rightEntry = entries.find((entry) => entry.series.yAxis === 1)
  const xBounds = leftEntry?.xBounds ?? rightEntry?.xBounds ?? { min: 0, max: 1 }
  const leftBounds = leftEntry?.yBounds ?? { min: 0, max: 1 }
  const rightBounds = rightEntry?.yBounds ?? { min: 0, max: 1 }

  ctx.save()
  ctx.strokeStyle = '#111111'
  ctx.lineWidth = 0.8
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
  ctx.restore()

  drawAxis(ctx, baseLayer.xAxis, xBounds.min, xBounds.max, rect, 'bottom', tickFontPx, textColor)
  drawAxis(ctx, baseLayer.yAxes[0]!, leftBounds.min, leftBounds.max, rect, 'left', tickFontPx, textColor)
  if (rightEntry) {
    drawAxis(ctx, baseLayer.yAxes[1]!, rightBounds.min, rightBounds.max, rect, 'right', tickFontPx, textColor)
  }

  ctx.save()
  ctx.beginPath()
  ctx.rect(rect.x, rect.y, rect.width, rect.height)
  ctx.clip()
  for (const entry of entries) {
    if (entry.points.length < 2) continue
    ctx.beginPath()
    ctx.strokeStyle = entry.series.color
    ctx.globalAlpha = entry.series.alpha
    ctx.lineWidth = Math.max(0.6, entry.series.lineWidth * PT_TO_PX)
    const dash = entry.series.lineStyle
    ctx.setLineDash(dash === 'dash' ? [6, 3] : dash === 'dot' ? [1.5, 3] : dash === 'dashdot' ? [6, 3, 1.5, 3] : [])
    entry.points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y)
      else ctx.lineTo(point.x, point.y)
    })
    ctx.stroke()
  }
  ctx.restore()

  // 图例
  if (document.legend.visible && entries.length > 0) {
    const seen = new Set<string>()
    let cursorY = rect.y + 8
    for (const entry of entries) {
      if (seen.has(entry.series.id)) continue
      seen.add(entry.series.id)
      ctx.save()
      ctx.strokeStyle = entry.series.color
      ctx.lineWidth = Math.max(0.6, entry.series.lineWidth * PT_TO_PX)
      ctx.beginPath()
      ctx.moveTo(rect.x + rect.width - 92, cursorY)
      ctx.lineTo(rect.x + rect.width - 78, cursorY)
      ctx.stroke()
      ctx.restore()
      drawScientificText(
        ctx,
        entry.series.name,
        rect.x + rect.width - 74,
        cursorY,
        document.legend.fontSize * PT_TO_PX,
        'left',
        textColor,
      )
      cursorY += document.legend.fontSize * PT_TO_PX * 1.8
    }
  }

  drawScientificText(
    ctx,
    baseLayer.xAxis.title
      ? `${baseLayer.xAxis.title}${baseLayer.xAxis.unit ? ` (${baseLayer.xAxis.unit})` : ''}`
      : '',
    rect.x + rect.width / 2,
    rect.y + rect.height + 26,
    labelFontPx,
    'center',
    textColor,
  )
  drawScientificText(
    ctx,
    baseLayer.yAxes[0]!.title
      ? `${baseLayer.yAxes[0]!.title}${baseLayer.yAxes[0]!.unit ? ` (${baseLayer.yAxes[0]!.unit})` : ''}`
      : '',
    rect.x - 36,
    rect.y + rect.height / 2,
    labelFontPx,
    'center',
    textColor,
  )
  if (baseLayer.yAxes[1]!.title) {
    drawScientificText(
      ctx,
      `${baseLayer.yAxes[1]!.title}${baseLayer.yAxes[1]!.unit ? ` (${baseLayer.yAxes[1]!.unit})` : ''}`,
      rect.x + rect.width + 38,
      rect.y + rect.height / 2,
      labelFontPx,
      'center',
      textColor,
    )
  }
  if (document.title.trim()) {
    drawScientificText(
      ctx,
      document.title,
      rect.x + rect.width / 2,
      Math.max(10, rect.y - 10),
      (preset.baseFontPt + 1) * PT_TO_PX,
      'center',
      textColor,
    )
  }
}

/** 像素坐标 -> 数据坐标（用于框选 ROI）。 */
export function pixelToData(
  model: CsLabPlotRenderModel,
  document: CsLabPlotDocument,
  xPx: number,
  yPx: number,
): { x: number; y: number } | null {
  const layer = document.layers.find((item) => item.visible) ?? document.layers[0]
  const entry = model.series[0]
  if (!layer || !entry) return null
  const rect = {
    x: model.plotRect.x * model.scale,
    y: model.plotRect.y * model.scale,
    width: model.plotRect.width * model.scale,
    height: model.plotRect.height * model.scale,
  }
  const xFraction = (xPx - rect.x) / rect.width
  const yFraction = 1 - (yPx - rect.y) / rect.height
  if (xFraction < 0 || xFraction > 1 || yFraction < 0 || yFraction > 1) return null
  const x =
    layer.xAxis.min !== undefined && layer.xAxis.max !== undefined
      ? layer.xAxis.min + xFraction * (layer.xAxis.max - layer.xAxis.min)
      : entry.xBounds.min + xFraction * (entry.xBounds.max - entry.xBounds.min)
  const y =
    entry.yBounds.min !== undefined && entry.yBounds.max !== undefined
      ? entry.yBounds.min + yFraction * (entry.yBounds.max - entry.yBounds.min)
      : entry.yBounds.min + yFraction * (entry.yBounds.max - entry.yBounds.min)
  return { x, y }
}
