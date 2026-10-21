/**
 * CSLab Origin 绘图渲染模型
 *
 * 把绘图文档转换为像素坐标下的轴/曲线/图例模型，供 Canvas 交互与命中测试复用。
 */

import type {
  CsLabPlotAxisConfig,
  CsLabPlotDocument,
  CsLabPlotLayer,
  CsLabPlotPreset,
  CsLabPlotRect,
  CsLabPlotSeries,
} from '@profer/shared'
import { axisFraction, computePlotLayout } from '@profer/shared'

export interface CsLabPlotSeriesModel {
  layer: CsLabPlotLayer
  series: CsLabPlotSeries
  xBounds: { min: number; max: number }
  yBounds: { min: number; max: number }
  points: Array<{ x: number; y: number }>
}

export interface CsLabPlotRenderModel {
  layout: ReturnType<typeof computePlotLayout>
  scale: number
  widthPx: number
  heightPx: number
  plotRect: CsLabPlotRect
  series: CsLabPlotSeriesModel[]
}

export function dataBounds(
  axis: CsLabPlotAxisConfig,
  seriesList: readonly CsLabPlotSeries[],
  key: 'x' | 'y',
): { min: number; max: number } {
  if (axis.min !== undefined && axis.max !== undefined) return { min: axis.min, max: axis.max }
  let min = axis.min ?? Infinity
  let max = axis.max ?? -Infinity
  for (const series of seriesList) {
    const values = key === 'x' ? series.x : series.y
    for (const value of values) {
      if (!Number.isFinite(value)) continue
      if (axis.scale !== 'linear' && value <= 0 && key === 'y') continue
      if (value < min) min = value
      if (value > max) max = value
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { min: 0, max: 1 }
  if (max <= min) return { min, max: min + 1 }
  return { min, max }
}

export function buildPlotRenderModel(
  document: CsLabPlotDocument,
  preset: CsLabPlotPreset,
  widthPx: number,
  heightPx: number,
): CsLabPlotRenderModel {
  const layout = computePlotLayout(document, preset)
  const scale = Math.min(widthPx / document.sizeMm.width, heightPx / document.sizeMm.height)
  const plotRect = layout.facets[0] ?? layout.plotArea
  const series: CsLabPlotSeriesModel[] = []

  for (const layer of document.layers) {
    if (!layer.visible) continue
    const visible = layer.series.filter((item) => item.visible !== false)
    if (visible.length === 0) continue
    const xBounds = dataBounds(layer.xAxis, visible, 'x')
    const left = dataBounds(layer.yAxes[0]!, visible.filter((item) => item.yAxis === 0), 'y')
    const right = dataBounds(layer.yAxes[1]!, visible.filter((item) => item.yAxis === 1), 'y')
    for (const item of visible) {
      const yBounds = item.yAxis === 1 ? right : left
      const yAxis = item.yAxis === 1 ? layer.yAxes[1]! : layer.yAxes[0]!
      const points: Array<{ x: number; y: number }> = []
      const count = Math.min(item.x.length, item.y.length)
      for (let index = 0; index < count; index += 1) {
        const xFraction = axisFraction(layer.xAxis, item.x[index]!, xBounds.min, xBounds.max)
        const yFraction = axisFraction(yAxis, item.y[index]!, yBounds.min, yBounds.max)
        if (xFraction === null || yFraction === null) continue
        points.push({
          x: (plotRect.x + xFraction * plotRect.width) * scale,
          y: (plotRect.y + (1 - yFraction) * plotRect.height) * scale,
        })
      }
      series.push({ layer, series: item, xBounds, yBounds, points })
    }
  }

  return { layout, scale, widthPx, heightPx, plotRect, series }
}

/** 命中测试：返回最近的曲线点（20px 内）或 null。 */
export function hitTestPlot(
  model: CsLabPlotRenderModel,
  xPx: number,
  yPx: number,
): { series: CsLabPlotSeries; index: number } | null {
  let best: { series: CsLabPlotSeries; index: number; distance: number } | null = null
  for (const entry of model.series) {
    for (let index = 0; index < entry.points.length; index += 1) {
      const point = entry.points[index]!
      const distance = Math.hypot(point.x - xPx, point.y - yPx)
      if (distance <= 20 && (!best || distance < best.distance)) {
        best = { series: entry.series, index, distance }
      }
    }
  }
  return best ? { series: best.series, index: best.index } : null
}
