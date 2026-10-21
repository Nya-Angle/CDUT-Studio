/**
 * CSLab 出版绘图数学（纯函数）
 *
 * - 期刊预设与绘图布局；
 * - 线性/对数/倒数刻度、反向轴、轴打断；
 * - 科学文本子集解析（上下标、希腊字母、常用符号）。
 */

import type {
  CsLabJournalPresetId,
  CsLabPlotAxisConfig,
  CsLabPlotAxisScale,
  CsLabPlotDocument,
  CsLabPlotLayout,
  CsLabPlotPreset,
  CsLabPlotRect,
  CsLabScientificText,
  CsLabScientificToken,
} from '../types/cslab-origin-types'

export const JOURNAL_PRESETS: Readonly<Record<CsLabJournalPresetId, CsLabPlotPreset>> = {
  default: {
    id: 'default',
    label: '通用',
    singleColumnMm: 90,
    doubleColumnMm: 180,
    fontFamily: 'Arial, Helvetica, sans-serif',
    baseFontPt: 8,
    axisLabelPt: 8,
    tickFontPt: 7,
    lineWidthPt: 0.6,
    marginMm: { top: 6, right: 6, bottom: 10, left: 12 },
  },
  nature: {
    id: 'nature',
    label: 'Nature',
    singleColumnMm: 89,
    doubleColumnMm: 183,
    fontFamily: 'Arial, Helvetica, sans-serif',
    baseFontPt: 7,
    axisLabelPt: 7,
    tickFontPt: 6,
    lineWidthPt: 0.5,
    marginMm: { top: 5, right: 5, bottom: 9, left: 11 },
  },
  science: {
    id: 'science',
    label: 'Science',
    singleColumnMm: 55,
    doubleColumnMm: 121,
    fontFamily: 'Arial, Helvetica, sans-serif',
    baseFontPt: 7,
    axisLabelPt: 7,
    tickFontPt: 6,
    lineWidthPt: 0.5,
    marginMm: { top: 5, right: 5, bottom: 9, left: 11 },
  },
  aps: {
    id: 'aps',
    label: 'APS / PRB',
    singleColumnMm: 86,
    doubleColumnMm: 178,
    fontFamily: 'Times New Roman, Times, serif',
    baseFontPt: 8,
    axisLabelPt: 8,
    tickFontPt: 7,
    lineWidthPt: 0.6,
    marginMm: { top: 6, right: 6, bottom: 10, left: 12 },
  },
  acs: {
    id: 'acs',
    label: 'ACS / JACS',
    singleColumnMm: 82.5,
    doubleColumnMm: 178,
    fontFamily: 'Arial, Helvetica, sans-serif',
    baseFontPt: 8,
    axisLabelPt: 8,
    tickFontPt: 7,
    lineWidthPt: 0.6,
    marginMm: { top: 6, right: 6, bottom: 10, left: 12 },
  },
  'advanced-materials': {
    id: 'advanced-materials',
    label: 'Advanced Materials',
    singleColumnMm: 88,
    doubleColumnMm: 180,
    fontFamily: 'Arial, Helvetica, sans-serif',
    baseFontPt: 8,
    axisLabelPt: 8,
    tickFontPt: 7,
    lineWidthPt: 0.6,
    marginMm: { top: 6, right: 6, bottom: 10, left: 12 },
  },
}

export function defaultAxisConfig(title = '', unit?: string): CsLabPlotAxisConfig {
  return {
    scale: 'linear',
    reverse: false,
    title,
    unit,
    tickDirection: 'in',
    majorTick: 5,
    minorTick: 2,
    breaks: [],
    showGrid: false,
    showTopMirror: false,
  }
}

export interface CreatePlotDocumentInput {
  id: string
  labId: string
  title: string
  presetId?: CsLabJournalPresetId
  widthMm?: number
  heightMm?: number
}

export function createPlotDocument(input: CreatePlotDocumentInput): CsLabPlotDocument {
  const presetId = input.presetId ?? 'nature'
  const preset = JOURNAL_PRESETS[presetId]
  const width = input.widthMm ?? preset.singleColumnMm
  const now = Date.now()
  return {
    id: input.id,
    labId: input.labId,
    title: input.title,
    presetId,
    sizeMm: { width, height: input.heightMm ?? Math.round(width * 0.75 * 10) / 10 },
    layers: [
      {
        id: 'layer-1',
        name: '图层 1',
        series: [],
        xAxis: defaultAxisConfig('2θ', 'deg'),
        yAxes: [defaultAxisConfig('强度', 'a.u.'), defaultAxisConfig('')],
        annotations: [],
        visible: true,
        opacity: 1,
      },
    ],
    legend: {
      visible: true,
      position: 'top-right',
      fontSize: preset.tickFontPt,
    },
    createdAt: now,
    updatedAt: now,
  }
}

function clampNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

/** 归一化绘图文档：补默认值、剔除非法数值。 */
export function normalizePlotDocument(
  document: CsLabPlotDocument,
  presetId?: CsLabJournalPresetId,
): CsLabPlotDocument {
  const effectivePreset = presetId ?? document.presetId ?? 'default'
  const preset = JOURNAL_PRESETS[effectivePreset] ?? JOURNAL_PRESETS.default
  const width = clampNumber(document.sizeMm?.width, preset.singleColumnMm)
  const height = clampNumber(document.sizeMm?.height, Math.round(width * 0.75 * 10) / 10)

  const layers = (document.layers ?? []).map((layer, layerIndex) => ({
    ...layer,
    id: layer.id || `layer-${layerIndex + 1}`,
    name: layer.name || `图层 ${layerIndex + 1}`,
    opacity: Math.max(0, Math.min(1, clampNumber(layer.opacity, 1))),
    visible: layer.visible !== false,
    series: (layer.series ?? []).map((series, seriesIndex) => ({
      ...series,
      id: series.id || `series-${layerIndex + 1}-${seriesIndex + 1}`,
      x: (series.x ?? []).filter((value) => Number.isFinite(value)),
      y: (series.y ?? []).filter((value) => Number.isFinite(value)),
      lineWidth: Math.max(0.1, clampNumber(series.lineWidth, preset.lineWidthPt)),
      alpha: Math.max(0, Math.min(1, clampNumber(series.alpha, 1))),
      visible: series.visible !== false,
      yAxis: (series.yAxis === 1 ? 1 : 0) as 0 | 1,
    })),
    xAxis: { ...defaultAxisConfig(), ...layer.xAxis, breaks: layer.xAxis?.breaks ?? [] },
    yAxes: [
      { ...defaultAxisConfig(), ...layer.yAxes?.[0], breaks: layer.yAxes?.[0]?.breaks ?? [] },
      { ...defaultAxisConfig(), ...layer.yAxes?.[1], breaks: layer.yAxes?.[1]?.breaks ?? [] },
    ] as [CsLabPlotAxisConfig, CsLabPlotAxisConfig],
    annotations: layer.annotations ?? [],
  }))

  return {
    ...document,
    presetId: effectivePreset,
    sizeMm: { width: Math.max(20, width), height: Math.max(20, height) },
    layers:
      layers.length > 0
        ? layers
        : createPlotDocument({
            id: document.id,
            labId: document.labId,
            title: document.title,
            presetId: effectivePreset,
          }).layers,
    legend: {
      visible: document.legend?.visible !== false,
      position: document.legend?.position ?? 'top-right',
      fontSize: clampNumber(document.legend?.fontSize, preset.tickFontPt),
    },
    updatedAt: Date.now(),
  }
}

/** 1/2/5 × 10^n 的“漂亮”刻度。 */
export function niceTicks(min: number, max: number, target = 5): number[] {
  if (!(Number.isFinite(min) && Number.isFinite(max)) || max <= min) return []
  const span = max - min
  const rough = span / Math.max(1, target)
  const power = Math.floor(Math.log10(rough))
  const base = 10 ** power
  const normalized = rough / base
  const step = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * base
  const start = Math.ceil(min / step) * step
  const ticks: number[] = []
  for (let value = start; value <= max + step * 1e-9; value += step) {
    ticks.push(Math.abs(value) < step * 1e-9 ? 0 : value)
  }
  return ticks
}

export function scaleValue(value: number, scale: CsLabPlotAxisScale): number | null {
  if (!Number.isFinite(value)) return null
  switch (scale) {
    case 'linear':
      return value
    case 'log10':
      return value > 0 ? Math.log10(value) : null
    case 'log2':
      return value > 0 ? Math.log2(value) : null
    case 'reciprocal':
      return value !== 0 ? 1 / value : null
    default:
      return null
  }
}

export function scaleInverse(value: number, scale: CsLabPlotAxisScale): number | null {
  if (!Number.isFinite(value)) return null
  switch (scale) {
    case 'linear':
      return value
    case 'log10':
      return 10 ** value
    case 'log2':
      return 2 ** value
    case 'reciprocal':
      return value !== 0 ? 1 / value : null
    default:
      return null
  }
}

/** 轴打断后的可见区间（数据坐标，按升序）。 */
export function detectAxisBreakSegments(axis: CsLabPlotAxisConfig): Array<{ from: number; to: number }> {
  const min = axis.min
  const max = axis.max
  if (min === undefined || max === undefined) return []
  const breaks = (axis.breaks ?? [])
    .filter((item) => Number.isFinite(item.from) && Number.isFinite(item.to) && item.to > item.from)
    .sort((left, right) => left.from - right.from)
  const segments: Array<{ from: number; to: number }> = []
  let cursor = Math.min(min, max)
  const upper = Math.max(min, max)
  for (const item of breaks) {
    if (item.to <= cursor) continue
    if (item.from >= upper) break
    if (item.from > cursor) segments.push({ from: cursor, to: item.from })
    cursor = Math.max(cursor, item.to)
  }
  if (cursor < upper) segments.push({ from: cursor, to: upper })
  return segments
}

/** 数据值映射到 0-1 的轴位置（考虑对数、反向与轴打断）。 */
export function axisFraction(
  axis: CsLabPlotAxisConfig,
  value: number,
  dataMin: number,
  dataMax: number,
): number | null {
  const scaled = scaleValue(value, axis.scale)
  const scaledMin = scaleValue(dataMin, axis.scale)
  const scaledMax = scaleValue(dataMax, axis.scale)
  if (scaled === null || scaledMin === null || scaledMax === null) return null

  const low = Math.min(scaledMin, scaledMax)
  const high = Math.max(scaledMin, scaledMax)
  if (!(high > low)) return null

  const breaks = (axis.breaks ?? [])
    .map((item) => {
      const from = scaleValue(item.from, axis.scale)
      const to = scaleValue(item.to, axis.scale)
      return from !== null && to !== null ? { from: Math.min(from, to), to: Math.max(from, to) } : null
    })
    .filter((item): item is { from: number; to: number } => Boolean(item))
    .filter((item) => item.to > low && item.from < high)
    .sort((left, right) => left.from - right.from)

  if (breaks.some((item) => scaled >= item.from && scaled <= item.to)) return null

  let skipped = 0
  let adjusted = scaled - low
  for (const item of breaks) {
    skipped += item.to - item.from
    if (scaled > item.to) adjusted -= item.to - item.from
  }
  const visible = high - low - skipped
  if (!(visible > 0)) return null
  const fraction = Math.max(0, Math.min(1, adjusted / visible))
  return axis.reverse ? 1 - fraction : fraction
}

export function formatMetric(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return '—'
  const absolute = Math.abs(value)
  if (absolute !== 0 && (absolute >= 1e5 || absolute < 1e-3)) return value.toExponential(digits)
  return value.toFixed(digits).replace(/\.?0+$/, '')
}

function rect(x: number, y: number, width: number, height: number): CsLabPlotRect {
  return { x, y, width, height }
}

/** 计算页面、绘图区、分面与图例布局（单位 mm）。 */
export function computePlotLayout(
  document: CsLabPlotDocument,
  preset: CsLabPlotPreset,
): CsLabPlotLayout {
  const width = document.sizeMm.width
  const height = document.sizeMm.height
  const margins = {
    top: preset.marginMm.top,
    right: preset.marginMm.right + (document.legend.visible && document.legend.position === 'outside-right' ? 22 : 0),
    bottom: preset.marginMm.bottom,
    left: preset.marginMm.left,
  }
  const plotArea = rect(
    margins.left,
    margins.top,
    Math.max(5, width - margins.left - margins.right),
    Math.max(5, height - margins.top - margins.bottom),
  )

  const rows = Math.max(1, Math.round(document.facets?.rows ?? 1))
  const cols = Math.max(1, Math.round(document.facets?.cols ?? 1))
  const gap = 3
  const facetWidth = (plotArea.width - gap * (cols - 1)) / cols
  const facetHeight = (plotArea.height - gap * (rows - 1)) / rows
  const facets: CsLabPlotRect[] = []
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < cols; column += 1) {
      facets.push(
        rect(
          plotArea.x + column * (facetWidth + gap),
          plotArea.y + row * (facetHeight + gap),
          facetWidth,
          facetHeight,
        ),
      )
    }
  }

  const legendWidth = Math.min(40, plotArea.width * 0.42)
  const legendHeight = Math.min(18, plotArea.height * 0.25)
  let legend: CsLabPlotRect
  switch (document.legend.position) {
    case 'top-left':
      legend = rect(plotArea.x + 2, plotArea.y + 2, legendWidth, legendHeight)
      break
    case 'bottom-right':
      legend = rect(plotArea.x + plotArea.width - legendWidth - 2, plotArea.y + plotArea.height - legendHeight - 2, legendWidth, legendHeight)
      break
    case 'bottom-left':
      legend = rect(plotArea.x + 2, plotArea.y + plotArea.height - legendHeight - 2, legendWidth, legendHeight)
      break
    case 'outside-right':
      legend = rect(width - margins.right + 2, plotArea.y, 18, plotArea.height)
      break
    case 'top-right':
    default:
      legend = rect(plotArea.x + plotArea.width - legendWidth - 2, plotArea.y + 2, legendWidth, legendHeight)
      break
  }

  return {
    page: rect(0, 0, width, height),
    plotArea,
    facets,
    legend,
    marginsMm: margins,
  }
}

const LATEX_SYMBOLS: Record<string, string> = {
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  epsilon: 'ε',
  zeta: 'ζ',
  eta: 'η',
  theta: 'θ',
  iota: 'ι',
  kappa: 'κ',
  lambda: 'λ',
  mu: 'μ',
  nu: 'ν',
  xi: 'ξ',
  pi: 'π',
  rho: 'ρ',
  sigma: 'σ',
  tau: 'τ',
  upsilon: 'υ',
  phi: 'φ',
  chi: 'χ',
  psi: 'ψ',
  omega: 'ω',
  Gamma: 'Γ',
  Delta: 'Δ',
  Theta: 'Θ',
  Lambda: 'Λ',
  Xi: 'Ξ',
  Pi: 'Π',
  Sigma: 'Σ',
  Phi: 'Φ',
  Psi: 'Ψ',
  Omega: 'Ω',
  pm: '±',
  mp: '∓',
  times: '×',
  div: '÷',
  cdot: '·',
  circ: '°',
  degree: '°',
  AA: 'Å',
  angstrom: 'Å',
  infty: '∞',
  sum: 'Σ',
  prod: 'Π',
  int: '∫',
  sqrt: '√',
  approx: '≈',
  le: '≤',
  ge: '≥',
  neq: '≠',
  rightarrow: '→',
  leftarrow: '←',
  leftrightarrow: '↔',
  partial: '∂',
  nabla: '∇',
}

function readGroup(text: string, start: number): { value: string; next: number } {
  if (start >= text.length) return { value: '', next: start }
  if (text[start] === '{') {
    let depth = 1
    let index = start + 1
    let value = ''
    while (index < text.length) {
      const char = text[index]!
      if (char === '{') depth += 1
      if (char === '}') {
        depth -= 1
        if (depth === 0) break
      }
      value += char
      index += 1
    }
    return { value, next: Math.min(text.length, index + 1) }
  }
  return { value: text[start]!, next: start + 1 }
}

function readCommand(text: string, start: number): { name: string; next: number } {
  let index = start + 1
  let name = ''
  while (index < text.length && /[A-Za-z]/.test(text[index]!)) {
    name += text[index]!
    index += 1
  }
  return { name, next: index }
}

/** 解析科学文本子集；不支持的宏保留原文并给出 warning。 */
export function parseScientificText(raw: string): CsLabScientificText {
  const warnings: string[] = []
  const tokens: CsLabScientificToken[] = []
  let text = raw ?? ''
  if (text.startsWith('$') && text.endsWith('$') && text.length >= 2) {
    text = text.slice(1, -1)
  }

  let index = 0
  let buffer = ''
  const flush = (): void => {
    if (buffer.length > 0) {
      tokens.push({ text: buffer, script: 'normal' })
      buffer = ''
    }
  }

  while (index < text.length) {
    const char = text[index]!

    if (char === '\\') {
      const command = readCommand(text, index)
      const name = command.name
      if (name === 'text' || name === 'mathrm' || name === 'mathbf') {
        const group = readGroup(text, command.next)
        buffer += group.value
        index = group.next
        continue
      }
      const symbol = LATEX_SYMBOLS[name]
      if (symbol !== undefined) {
        buffer += symbol
        index = command.next
        continue
      }
      warnings.push(`不支持的 LaTeX 宏: \\${name || '?'}`)
      buffer += `\\${name}`
      index = command.next
      continue
    }

    if (char === '_' || char === '^') {
      flush()
      const group = readGroup(text, index + 1)
      const script = char === '_' ? 'sub' : 'sup'
      // 组内仍按普通文本处理（不再嵌套上下标）
      tokens.push({ text: group.value, script })
      index = group.next
      continue
    }

    if (char === '{' || char === '}') {
      index += 1
      continue
    }

    buffer += char
    index += 1
  }

  flush()
  if (tokens.length === 0) tokens.push({ text: raw ?? '', script: 'normal' })
  return { tokens, warnings }
}
