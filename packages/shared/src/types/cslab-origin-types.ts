/**
 * CSLab 出版绘图契约（Origin 级）
 *
 * 只定义绘图文档、期刊预设、峰拟合与导出参数；渲染逻辑在 utils 与渲染进程。
 */

export type CsLabJournalPresetId =
  | 'default'
  | 'nature'
  | 'science'
  | 'aps'
  | 'acs'
  | 'advanced-materials'

export type CsLabPlotAxisScale = 'linear' | 'log10' | 'log2' | 'reciprocal'

export type CsLabPlotTickDirection = 'in' | 'out' | 'inout'

export type CsLabPlotLineStyle = 'solid' | 'dash' | 'dot' | 'dashdot'

export type CsLabPlotMarker = 'none' | 'circle' | 'square' | 'triangle' | 'diamond'

export interface CsLabPlotAxisBreak {
  from: number
  to: number
  style?: 'wave' | 'slash'
}

export interface CsLabPlotAxisConfig {
  scale: CsLabPlotAxisScale
  reverse: boolean
  min?: number
  max?: number
  title: string
  unit?: string
  tickDirection: CsLabPlotTickDirection
  majorTick: number
  minorTick: number
  breaks: CsLabPlotAxisBreak[]
  showGrid: boolean
  showTopMirror: boolean
}

export interface CsLabPlotSeries {
  id: string
  name: string
  x: number[]
  y: number[]
  color: string
  lineWidth: number
  lineStyle: CsLabPlotLineStyle
  marker: CsLabPlotMarker
  /** 0 = 左 Y 轴，1 = 右 Y 轴。 */
  yAxis: 0 | 1
  visible: boolean
  alpha: number
  facet?: number
}

export interface CsLabPlotAnnotation {
  id: string
  kind: 'text' | 'arrow' | 'band' | 'line'
  x: number
  y: number
  /** 箭头/线段终点或文本内容。 */
  x2?: number
  y2?: number
  text?: string
  color?: string
  fontSize?: number
}

export interface CsLabPlotLayer {
  id: string
  name: string
  series: CsLabPlotSeries[]
  xAxis: CsLabPlotAxisConfig
  yAxes: [CsLabPlotAxisConfig, CsLabPlotAxisConfig]
  annotations: CsLabPlotAnnotation[]
  visible: boolean
  opacity: number
  /** 瀑布图堆叠偏移（与 y 同单位）。 */
  stackOffset?: number
}

export interface CsLabPlotFacets {
  rows: number
  cols: number
}

export interface CsLabPlotLegend {
  visible: boolean
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'outside-right'
  fontSize: number
}

export interface CsLabPlotDocument {
  id: string
  labId: string
  title: string
  presetId: CsLabJournalPresetId
  /** 物理尺寸（mm），由期刊预设单双栏决定。 */
  sizeMm: { width: number; height: number }
  facets?: CsLabPlotFacets
  layers: CsLabPlotLayer[]
  legend: CsLabPlotLegend
  createdAt: number
  updatedAt: number
}

export interface CsLabPlotPreset {
  id: CsLabJournalPresetId
  label: string
  singleColumnMm: number
  doubleColumnMm: number
  fontFamily: string
  baseFontPt: number
  axisLabelPt: number
  tickFontPt: number
  lineWidthPt: number
  marginMm: { top: number; right: number; bottom: number; left: number }
}

export type CsLabPeakProfileName = 'gaussian' | 'lorentzian' | 'pseudo_voigt'

export interface CsLabPeakSpec {
  center: number
  height?: number
  fwhm: number
  eta?: number
  /** 锁定该峰参数（不参与优化）。 */
  locked?: boolean
}

export type CsLabBaselineKind = 'none' | 'constant' | 'linear' | 'polynomial' | 'asls'

export interface CsLabFitRequest {
  x: number[]
  y: number[]
  peaks: CsLabPeakSpec[]
  model: CsLabPeakProfileName
  baseline: CsLabBaselineKind
  polynomialOrder?: number
  asls?: { lambda: number; p: number }
  maxIterations?: number
  tolerance?: number
}

export interface CsLabFittedPeak {
  center: number
  height: number
  fwhm: number
  eta: number
  area: number
  areaFraction: number
  locked: boolean
}

export interface CsLabFitResult {
  peaks: CsLabFittedPeak[]
  baseline: number[]
  fitted: number[]
  residual: number[]
  rSquared: number
  rmse: number
  iterations: number
  converged: boolean
  warnings: string[]
}

export interface CsLabSmoothRequest {
  x: number[]
  y: number[]
  kind: 'savgol' | 'moving-average' | 'fft-lowpass'
  window: number
  order?: number
  /** FFT 低通截止频率（0-1，相对 Nyquist）。 */
  cutoff?: number
}

export type CsLabPlotExportFormat = 'svg' | 'pdf' | 'png' | 'tiff'

export type CsLabPlotExportDpi = 300 | 600 | 1200

export interface CsLabPlotExportOptions {
  format: CsLabPlotExportFormat
  dpi: CsLabPlotExportDpi
  widthMm?: number
  heightMm?: number
  transparentBackground: boolean
  fileName?: string
  /** 渲染进程预渲染的 PNG dataURL（PNG/TIFF 导出时复用）。 */
  rasterDataUrl?: string
}

export interface CsLabPlotExportResult {
  path: string
  format: CsLabPlotExportFormat
  bytes: number
  dpi: number
  widthMm: number
  heightMm: number
}

export interface CsLabPlotSummary {
  id: string
  title: string
  updatedAt: number
  presetId: CsLabJournalPresetId
}

/** 画板更新发起方。 */
export type CsLabPlotUpdateSource = 'agent' | 'user'

/** 主进程 -> 渲染进程：画板更新事件。 */
export interface CsLabPlotUpdatedEvent {
  labId: string
  plot: CsLabPlotDocument
  /** 发起方；缺省视为 user（兼容旧事件）。 */
  source?: CsLabPlotUpdateSource
  /** Agent 写回时签发的撤销令牌；首次创建无历史时缺省。 */
  undoToken?: string
}

/** 绘图布局结果（mm 与 px 两套坐标）。 */
export interface CsLabPlotRect {
  x: number
  y: number
  width: number
  height: number
}

export interface CsLabPlotLayout {
  page: CsLabPlotRect
  plotArea: CsLabPlotRect
  facets: CsLabPlotRect[]
  legend: CsLabPlotRect
  marginsMm: { top: number; right: number; bottom: number; left: number }
}

export interface CsLabScientificToken {
  text: string
  script: 'normal' | 'sub' | 'sup' | 'italic'
}

export interface CsLabScientificText {
  tokens: CsLabScientificToken[]
  warnings: string[]
}
