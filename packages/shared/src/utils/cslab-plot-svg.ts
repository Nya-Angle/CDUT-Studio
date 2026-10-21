/**
 * CSLab 出版绘图 SVG 生成器（纯函数，主进程与渲染进程共用）
 *
 * 文字全部输出为 <text>/<tspan>，不嵌入位图，保证期刊矢量导出可编辑。
 */

import type {
  CsLabPlotAxisConfig,
  CsLabPlotDocument,
  CsLabPlotLayer,
  CsLabPlotPreset,
  CsLabPlotRect,
  CsLabPlotSeries,
  CsLabScientificToken,
} from '../types/cslab-origin-types'
import {
  axisFraction,
  computePlotLayout,
  formatMetric,
  niceTicks,
  parseScientificText,
  scaleValue,
} from './cslab-plot-doc'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function tspanFor(token: CsLabScientificToken): string {
  const escaped = escapeXml(token.text)
  if (token.script === 'sub') {
    return `<tspan baseline-shift="sub" font-size="72%">${escaped}</tspan>`
  }
  if (token.script === 'sup') {
    return `<tspan baseline-shift="super" font-size="72%">${escaped}</tspan>`
  }
  if (token.script === 'italic') return `<tspan font-style="italic">${escaped}</tspan>`
  return escaped
}

function scientificText(
  raw: string,
  x: number,
  y: number,
  options: {
    fontSize: number
    fill: string
    fontFamily: string
    anchor?: 'start' | 'middle' | 'end'
    rotate?: number
    fontWeight?: number
  },
): string {
  const parsed = parseScientificText(raw)
  const body = parsed.tokens.map(tspanFor).join('')
  const transform = options.rotate ? ` transform="rotate(${options.rotate} ${x} ${y})"` : ''
  return `<text x="${x.toFixed(3)}" y="${y.toFixed(3)}" font-family="${escapeXml(options.fontFamily)}" font-size="${options.fontSize}" fill="${options.fill}" text-anchor="${options.anchor ?? 'start'}" font-weight="${options.fontWeight ?? 400}"${transform}>${body}</text>`
}

function visibleSeries(layer: CsLabPlotLayer): CsLabPlotSeries[] {
  return layer.series.filter((series) => series.visible !== false)
}

function dataBounds(
  axis: CsLabPlotAxisConfig,
  seriesList: readonly CsLabPlotSeries[],
  key: 'x' | 'y',
): { min: number; max: number } {
  if (axis.min !== undefined && axis.max !== undefined) {
    return { min: axis.min, max: axis.max }
  }
  let min = axis.min ?? Infinity
  let max = axis.max ?? -Infinity
  for (const series of seriesList) {
    const values = key === 'x' ? series.x : series.y
    for (const value of values) {
      if (!Number.isFinite(value)) continue
      if (key === 'x') {
        if (value < min) min = value
        if (value > max) max = value
      } else if (axis.scale === 'linear' || value > 0) {
        if (value < min) min = value
        if (value > max) max = value
      }
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    min = 0
    max = 1
  }
  if (max <= min) max = min + 1
  return { min, max }
}

function axisTicks(axis: CsLabPlotAxisConfig, min: number, max: number): number[] {
  if (axis.scale === 'log10' || axis.scale === 'log2') {
    const base = axis.scale === 'log2' ? 2 : 10
    const low = Math.log(Math.max(1e-12, min)) / Math.log(base)
    const high = Math.log(Math.max(1e-12, max)) / Math.log(base)
    const start = Math.ceil(low)
    const end = Math.floor(high)
    const ticks: number[] = []
    for (let exponent = start; exponent <= end && ticks.length < 10; exponent += 1) {
      ticks.push(base ** exponent)
    }
    return ticks
  }
  return niceTicks(min, max, axis.majorTick)
}

function drawAxisLine(rect: CsLabPlotRect, stroke: string, width: number): string {
  return `<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" fill="none" stroke="${stroke}" stroke-width="${width}"/>`
}

function drawTicks(
  rect: CsLabPlotRect,
  axis: CsLabPlotAxisConfig,
  min: number,
  max: number,
  orientation: 'bottom' | 'left' | 'top' | 'right',
  preset: CsLabPlotPreset,
  stroke: string,
  textFill: string,
): string {
  const ticks = axisTicks(axis, min, max)
  const parts: string[] = []
  const tickLength = 1.1
  const direction = axis.tickDirection
  const inside = direction === 'in' || direction === 'inout'
  const outside = direction === 'out' || direction === 'inout'

  for (const value of ticks) {
    const fraction = axisFraction(axis, value, min, max)
    if (fraction === null) continue
    if (orientation === 'bottom' || orientation === 'top') {
      const x = rect.x + fraction * rect.width
      const y = orientation === 'bottom' ? rect.y + rect.height : rect.y
      if (inside) parts.push(`<line x1="${x}" y1="${y}" x2="${x}" y2="${y + (orientation === 'bottom' ? -tickLength : tickLength)}" stroke="${stroke}" stroke-width="0.4"/>`)
      if (outside) parts.push(`<line x1="${x}" y1="${y}" x2="${x}" y2="${y + (orientation === 'bottom' ? tickLength : -tickLength)}" stroke="${stroke}" stroke-width="0.4"/>`)
      const labelY = orientation === 'bottom' ? y + 3.2 : y - 2.2
      parts.push(
        scientificText(formatMetric(value), x, labelY, {
          fontSize: preset.tickFontPt,
          fill: textFill,
          fontFamily: preset.fontFamily,
          anchor: 'middle',
        }),
      )
    } else {
      const y = rect.y + (1 - fraction) * rect.height
      const x = orientation === 'left' ? rect.x : rect.x + rect.width
      if (inside) parts.push(`<line x1="${x}" y1="${y}" x2="${x + (orientation === 'left' ? tickLength : -tickLength)}" y2="${y}" stroke="${stroke}" stroke-width="0.4"/>`)
      if (outside) parts.push(`<line x1="${x}" y1="${y}" x2="${x + (orientation === 'left' ? -tickLength : tickLength)}" y2="${y}" stroke="${stroke}" stroke-width="0.4"/>`)
      parts.push(
        scientificText(formatMetric(value), x + (orientation === 'left' ? -2 : 2), y + 1, {
          fontSize: preset.tickFontPt,
          fill: textFill,
          fontFamily: preset.fontFamily,
          anchor: orientation === 'left' ? 'end' : 'start',
        }),
      )
    }
  }

  return parts.join('')
}

function seriesPath(
  series: CsLabPlotSeries,
  rect: CsLabPlotRect,
  xAxis: CsLabPlotAxisConfig,
  xBounds: { min: number; max: number },
  yAxis: CsLabPlotAxisConfig,
  yBounds: { min: number; max: number },
): string {
  const points: string[] = []
  const count = Math.min(series.x.length, series.y.length)
  for (let i = 0; i < count; i += 1) {
    const xFraction = axisFraction(xAxis, series.x[i]!, xBounds.min, xBounds.max)
    const yFraction = axisFraction(yAxis, series.y[i]!, yBounds.min, yBounds.max)
    if (xFraction === null || yFraction === null) continue
    const x = rect.x + xFraction * rect.width
    const y = rect.y + (1 - yFraction) * rect.height
    points.push(`${points.length === 0 ? 'M' : 'L'}${x.toFixed(3)},${y.toFixed(3)}`)
  }
  return points.join(' ')
}

function dashArray(style: CsLabPlotSeries['lineStyle']): string {
  if (style === 'dash') return ' stroke-dasharray="3 1.5"'
  if (style === 'dot') return ' stroke-dasharray="0.8 1.8"'
  if (style === 'dashdot') return ' stroke-dasharray="3 1.5 0.8 1.5"'
  return ''
}

function markerSvg(series: CsLabPlotSeries, x: number, y: number): string {
  const size = 0.8
  switch (series.marker) {
    case 'circle':
      return `<circle cx="${x}" cy="${y}" r="${size}" fill="${series.color}" stroke="none"/>`
    case 'square':
      return `<rect x="${x - size}" y="${y - size}" width="${size * 2}" height="${size * 2}" fill="${series.color}" stroke="none"/>`
    case 'triangle':
      return `<polygon points="${x},${y - size} ${x + size},${y + size} ${x - size},${y + size}" fill="${series.color}" stroke="none"/>`
    case 'diamond':
      return `<polygon points="${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}" fill="${series.color}" stroke="none"/>`
    default:
      return ''
  }
}

function drawSeries(
  series: CsLabPlotSeries,
  rect: CsLabPlotRect,
  layer: CsLabPlotLayer,
  preset: CsLabPlotPreset,
  xBounds: { min: number; max: number },
  yBounds: { min: number; max: number },
): string {
  const yAxis = layer.yAxes[series.yAxis] ?? layer.yAxes[0]!
  const path = seriesPath(series, rect, layer.xAxis, xBounds, yAxis, yBounds)
  if (!path) return ''

  const strokeWidth = Math.max(0.15, series.lineWidth)
  const parts: string[] = [
    `<path d="${path}" fill="none" stroke="${series.color}" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round" opacity="${series.alpha}"${dashArray(series.lineStyle)}/>`,
  ]

  if (series.marker !== 'none') {
    const count = Math.min(series.x.length, series.y.length)
    const stride = Math.max(1, Math.floor(count / 120))
    for (let i = 0; i < count; i += stride) {
      const xFraction = axisFraction(layer.xAxis, series.x[i]!, xBounds.min, xBounds.max)
      const yFraction = axisFraction(yAxis, series.y[i]!, yBounds.min, yBounds.max)
      if (xFraction === null || yFraction === null) continue
      parts.push(
        markerSvg(
          series,
          rect.x + xFraction * rect.width,
          rect.y + (1 - yFraction) * rect.height,
        ),
      )
    }
  }

  void preset
  return parts.join('')
}

function drawLegend(
  document: CsLabPlotDocument,
  layout: ReturnType<typeof computePlotLayout>,
  preset: CsLabPlotPreset,
): string {
  if (!document.legend.visible) return ''
  const rect = layout.legend
  const parts: string[] = [
    `<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" fill="none" stroke="none"/>`,
  ]
  let cursor = rect.y + 2.4
  for (const layer of document.layers) {
    if (!layer.visible) continue
    for (const series of visibleSeries(layer)) {
      if (cursor > rect.y + rect.height - 1) break
      parts.push(
        `<line x1="${rect.x + 1}" y1="${cursor}" x2="${rect.x + 6}" y2="${cursor}" stroke="${series.color}" stroke-width="${series.lineWidth}"${dashArray(series.lineStyle)}/>`,
      )
      parts.push(
        scientificText(series.name, rect.x + 7.5, cursor + 1, {
          fontSize: document.legend.fontSize,
          fill: '#222222',
          fontFamily: preset.fontFamily,
          anchor: 'start',
        }),
      )
      cursor += Math.max(3, document.legend.fontSize * 0.75)
    }
  }
  return parts.join('')
}

function drawAnnotations(layer: CsLabPlotLayer, rect: CsLabPlotRect, preset: CsLabPlotPreset): string {
  const parts: string[] = []
  for (const annotation of layer.annotations ?? []) {
    const xFraction = axisFraction(layer.xAxis, annotation.x, layer.xAxis.min ?? annotation.x, layer.xAxis.max ?? annotation.x + 1)
    void xFraction
    const x = rect.x + ((annotation.x - (layer.xAxis.min ?? annotation.x)) / Math.max(1e-9, (layer.xAxis.max ?? annotation.x + 1) - (layer.xAxis.min ?? annotation.x))) * rect.width
    const y = rect.y + rect.height - ((annotation.y - (layer.yAxes[0]!.min ?? annotation.y)) / Math.max(1e-9, (layer.yAxes[0]!.max ?? annotation.y + 1) - (layer.yAxes[0]!.min ?? annotation.y))) * rect.height
    if (annotation.kind === 'text' && annotation.text) {
      parts.push(
        scientificText(annotation.text, x, y, {
          fontSize: annotation.fontSize ?? preset.baseFontPt,
          fill: annotation.color ?? '#222222',
          fontFamily: preset.fontFamily,
        }),
      )
    }
    if ((annotation.kind === 'line' || annotation.kind === 'arrow') && annotation.x2 !== undefined && annotation.y2 !== undefined) {
      const x2 = rect.x + ((annotation.x2 - (layer.xAxis.min ?? annotation.x2)) / Math.max(1e-9, (layer.xAxis.max ?? annotation.x2 + 1) - (layer.xAxis.min ?? annotation.x2))) * rect.width
      const y2 = rect.y + rect.height - ((annotation.y2 - (layer.yAxes[0]!.min ?? annotation.y2)) / Math.max(1e-9, (layer.yAxes[0]!.max ?? annotation.y2 + 1) - (layer.yAxes[0]!.min ?? annotation.y2))) * rect.height
      parts.push(
        `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${annotation.color ?? '#222222'}" stroke-width="0.6" marker-end="${annotation.kind === 'arrow' ? 'url(#cslab-arrow)' : ''}"/>`,
      )
    }
  }
  return parts.join('')
}

function axisTitle(
  raw: string,
  x: number,
  y: number,
  preset: CsLabPlotPreset,
  rotate?: number,
): string {
  if (!raw.trim()) return ''
  return scientificText(raw, x, y, {
    fontSize: preset.axisLabelPt,
    fill: '#111111',
    fontFamily: preset.fontFamily,
    anchor: 'middle',
    rotate,
    fontWeight: 500,
  })
}

/** 生成出版物矢量 SVG。 */
export function renderPlotSvg(
  document: CsLabPlotDocument,
  preset: CsLabPlotPreset,
): string {
  const layout = computePlotLayout(document, preset)
  const plot = layout.plotArea
  const stroke = '#111111'
  const parts: string[] = []

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${document.sizeMm.width}mm" height="${document.sizeMm.height}mm" viewBox="0 0 ${document.sizeMm.width} ${document.sizeMm.height}">`,
  )
  parts.push('<defs><marker id="cslab-arrow" viewBox="0 0 5 5" refX="4.5" refY="2.5" markerWidth="3" markerHeight="3" orient="auto"><path d="M0,0 L5,2.5 L0,5 z" fill="#222222"/></marker></defs>')

  for (const [layerIndex, layer] of document.layers.entries()) {
    if (!layer.visible) continue
    const seriesList = visibleSeries(layer)
    if (seriesList.length === 0) continue

    const xBounds = dataBounds(layer.xAxis, seriesList, 'x')
    const yBoundsLeft = dataBounds(layer.yAxes[0]!, seriesList.filter((series) => series.yAxis === 0), 'y')
    const yBoundsRight = dataBounds(layer.yAxes[1]!, seriesList.filter((series) => series.yAxis === 1), 'y')

    const facets = new Map<number, CsLabPlotSeries[]>()
    for (const series of seriesList) {
      const facet = Math.max(0, series.facet ?? 0)
      const bucket = facets.get(facet) ?? []
      bucket.push(series)
      facets.set(facet, bucket)
    }

    parts.push(`<g opacity="${layer.opacity}">`)
    for (const [facetIndex, facetSeries] of facets) {
      const rect = layout.facets[facetIndex] ?? layout.facets[0] ?? plot
      parts.push(drawAxisLine(rect, stroke, 0.5))
      parts.push(drawTicks(rect, layer.xAxis, xBounds.min, xBounds.max, 'bottom', preset, stroke, '#111111'))
      parts.push(drawTicks(rect, layer.yAxes[0]!, yBoundsLeft.min, yBoundsLeft.max, 'left', preset, stroke, '#111111'))
      if (layer.yAxes[1]!.title || layer.yAxes[1]!.min !== undefined) {
        parts.push(drawTicks(rect, layer.yAxes[1]!, yBoundsRight.min, yBoundsRight.max, 'right', preset, stroke, '#111111'))
      }
      if (layer.xAxis.showTopMirror) {
        parts.push(drawTicks(rect, layer.xAxis, xBounds.min, xBounds.max, 'top', preset, stroke, '#111111'))
      }

      const clipId = `cslab-clip-${layerIndex}-${facetIndex}`
      parts.push(`<clipPath id="${clipId}"><rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}"/></clipPath>`)
      parts.push(`<g clip-path="url(#${clipId})">`)
      for (const series of facetSeries) {
        const yBounds = series.yAxis === 1 ? yBoundsRight : yBoundsLeft
        parts.push(drawSeries(series, rect, layer, preset, xBounds, yBounds))
      }
      parts.push('</g>')
      parts.push(drawAnnotations(layer, rect, preset))
    }
    parts.push('</g>')
  }

  parts.push(
    axisTitle(
      document.layers[0]?.xAxis.title
        ? `${document.layers[0].xAxis.title}${document.layers[0].xAxis.unit ? ` (${document.layers[0].xAxis.unit})` : ''}`
        : '',
      plot.x + plot.width / 2,
      plot.y + plot.height + 7,
      preset,
    ),
  )
  parts.push(
    axisTitle(
      document.layers[0]?.yAxes[0]?.title
        ? `${document.layers[0].yAxes[0].title}${document.layers[0].yAxes[0].unit ? ` (${document.layers[0].yAxes[0].unit})` : ''}`
        : '',
      plot.x - 8,
      plot.y + plot.height / 2,
      preset,
      -90,
    ),
  )
  if (document.layers[0]?.yAxes[1]?.title) {
    parts.push(
      axisTitle(
        `${document.layers[0].yAxes[1].title}${document.layers[0].yAxes[1].unit ? ` (${document.layers[0].yAxes[1].unit})` : ''}`,
        plot.x + plot.width + 8,
        plot.y + plot.height / 2,
        preset,
        90,
      ),
    )
  }

  if (document.title.trim()) {
    parts.push(
      scientificText(document.title, plot.x + plot.width / 2, Math.max(4, plot.y - 1.5), {
        fontSize: preset.baseFontPt + 1,
        fill: '#111111',
        fontFamily: preset.fontFamily,
        anchor: 'middle',
        fontWeight: 600,
      }),
    )
  }

  parts.push(drawLegend(document, layout, preset))
  parts.push('</svg>')
  return parts.join('')
}

/** SVG 转 dataURL（避免依赖 Node Buffer / 浏览器 btoa）。 */
export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/** 导出辅助：将轴范围转为可读字符串。 */
export function describeAxisRange(axis: CsLabPlotAxisConfig): string {
  const min = axis.min !== undefined ? formatMetric(axis.min) : 'auto'
  const max = axis.max !== undefined ? formatMetric(axis.max) : 'auto'
  const scale = axis.scale === 'linear' ? '' : ` ${axis.scale}`
  return `${min} … ${max}${scale}`
}

/** 供测试复用：判断文档是否包含可编辑文字。 */
export function hasEditableText(svg: string): boolean {
  return /<text[\s>]/.test(svg)
}

/** 供测试复用：确保 SVG 未嵌入位图。 */
export function hasEmbeddedImage(svg: string): boolean {
  return /<image[\s>]/.test(svg)
}

/** 临时导出，便于后续扩展刻度计算。 */
export function __axisTickValues(axis: CsLabPlotAxisConfig, min: number, max: number): number[] {
  return axisTicks(axis, min, max)
}

/** 临时导出，便于 UI 复用坐标映射。 */
export function __scaleValue(value: number, axis: CsLabPlotAxisConfig): number | null {
  return scaleValue(value, axis.scale)
}
