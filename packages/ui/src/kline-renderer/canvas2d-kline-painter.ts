/**
 * @profer/ui/kline-renderer — Tier-1 像素级对齐三层 Canvas 2D 渲染管线
 *
 * 核心工程特性：
 *   1. 三层离屏解耦架构（Background Layer 0 / Data Series Layer 1 / Crosshair & Overlay Layer 2）+
 *      `InvalidateLevel` 位掩码脏标记（None=0, Cursor=1, Light=2, Full=3）；
 *   2. 物理位图空间（Bitmap Pixel Space）整数对齐与奇偶同锁（Parity-Locked Geometry）：
 *      强制 `wickWidthPhys % 2 === bodyWidthPhys % 2`，彻底消灭 1px 影线在偶数宽度柱体上的 0.5px 亚像素发虚；
 *   3. 颜色分桶批量提交（Color-Bucketed Batch Submission）：
 *      同色阳线、阴线、影线合并为单次 `fill()` / `stroke()`，将数千根 K 线的 Draw Calls 压降至个位数；
 *   4. 亚像素 M4 保极值归约（Sub-Pixel M4 Conflation）：
 *      当 `isSubPixelConflated` 时，直接调用 `store.segmentTree.query(b0, b1)` 进行 $O(\log N)$ 像素分箱；
 *   5. 微观结构增强：支持 KDE 成交量分布横截面（POC/VAH/VAL）、L2 盘口深度热力图、Oklab OFI 感知着色、
 *      小提琴 KDE 蜡烛图以及通达信公式指令（`STICKLINE` / `DRAWTEXT` / `DRAWICON`）同屏绘制。
 */

import {
  computeKdeVolumeProfile,
  computeNicePriceTicks,
  computePixelPerfectCandleMetrics,
  formatKLineTimestamp,
  logicalIndexToX,
  priceToY,
  xToLogicalIndex,
  yToPrice,
  type DetectedCandlestickPattern,
  type FormulaEvaluationResult,
  type KLineAnnotation,
  type KLineColorScheme,
  type KLineDataStore,
  type KLinePriceScaleMode,
  type KLineViewportState,
} from '@profer/shared'

export const enum InvalidateLevel {
  None = 0,
  /** 仅重绘 Layer 2（十字光标、悬浮胶囊、正在拖拽的画线） */
  Cursor = 1,
  /** 重绘 Layer 1 + Layer 2（最新 Tick 跳动，且未突破当前价格极值） */
  Light = 2,
  /** 全量重绘 Layer 0 + Layer 1 + Layer 2（平移、缩放、窗口尺寸变化、极值突破） */
  Full = 3,
}

/** 用户交互式画线对象（严格锚定于逻辑索引与价格空间） */
export interface KLineUserDrawing {
  id: string
  type: 'trendline' | 'hline' | 'fib' | 'ray'
  p1: { logicalIndex: number; price: number }
  p2?: { logicalIndex: number; price: number }
  color: string
  label?: string
}

export interface KLinePaneLayout {
  widthCss: number
  heightCss: number
  dpr: number
  widthPx: number
  heightPx: number
  priceAxisWidthPx: number
  timeAxisHeightPx: number
  plotLeftPx: number
  plotRightPx: number
  plotWidthPx: number
  mainTopPx: number
  mainBottomPx: number
  mainHeightPx: number
  volTopPx: number
  volBottomPx: number
  volHeightPx: number
  subTopPx: number
  subBottomPx: number
  subHeightPx: number
  hasSubPane: boolean
}

export interface KLinePaintContext {
  store: KLineDataStore
  viewport: KLineViewportState
  layout: KLinePaneLayout
  minPrice: number
  maxPrice: number
  maxVolume: number
  visibleStartIdx: number
  visibleEndIdx: number
  priceScaleMode: KLinePriceScaleMode
  colorScheme: KLineColorScheme
  kdeCandle: boolean
  ofiColoring: boolean
  showVolumeProfile: boolean
  showOrderBookHeatmap: boolean
  showVpin: boolean
  l2Columns: Float32Array[]
  mainFormulaResult: FormulaEvaluationResult | null
  subFormulaResult: FormulaEvaluationResult | null
  annotations: KLineAnnotation[]
  drawings: KLineUserDrawing[]
  activeDrawingDraft: KLineUserDrawing | null
  patterns: DetectedCandlestickPattern[]
  cursorCss: { x: number; y: number } | null
  hoveredBarIdx: number | null
  symbol: string
  symbolName?: string
  interval: string
  engineLabel: string
  /** 当 WebGPU 硬件层已负责绘制主图 K 线时设为 true，Canvas Layer 1 仅绘制均线与副图 */
  skipMainCandles?: boolean
}

/** 计算主图、成交量/VPIN 副图、MACD/指标副图的精确物理像素布局 */
export function computeKLinePaneLayout(
  widthCss: number,
  heightCss: number,
  dpr: number,
  hasSubPane: boolean,
): KLinePaneLayout {
  const safeDpr = Math.max(1, dpr || 1)
  const widthPx = Math.max(100, Math.round(widthCss * safeDpr))
  const heightPx = Math.max(100, Math.round(heightCss * safeDpr))
  const priceAxisWidthPx = Math.round(68 * safeDpr)
  const timeAxisHeightPx = Math.round(22 * safeDpr)

  const plotLeftPx = 0
  const plotRightPx = Math.max(40, widthPx - priceAxisWidthPx)
  const plotWidthPx = plotRightPx - plotLeftPx
  const totalPlotHeightPx = Math.max(60, heightPx - timeAxisHeightPx)

  const mainRatio = hasSubPane ? 0.62 : 0.76
  const volRatio = hasSubPane ? 0.18 : 0.24

  const mainTopPx = Math.round(8 * safeDpr)
  const mainBottomPx = Math.round(totalPlotHeightPx * mainRatio)
  const mainHeightPx = Math.max(30, mainBottomPx - mainTopPx)

  const volTopPx = mainBottomPx + Math.round(4 * safeDpr)
  const volBottomPx = hasSubPane
    ? Math.round(totalPlotHeightPx * (mainRatio + volRatio))
    : totalPlotHeightPx
  const volHeightPx = Math.max(20, volBottomPx - volTopPx)

  const subTopPx = hasSubPane ? volBottomPx + Math.round(4 * safeDpr) : volBottomPx
  const subBottomPx = totalPlotHeightPx
  const subHeightPx = hasSubPane ? Math.max(20, subBottomPx - subTopPx) : 0

  return {
    widthCss,
    heightCss,
    dpr: safeDpr,
    widthPx,
    heightPx,
    priceAxisWidthPx,
    timeAxisHeightPx,
    plotLeftPx,
    plotRightPx,
    plotWidthPx,
    mainTopPx,
    mainBottomPx,
    mainHeightPx,
    volTopPx,
    volBottomPx,
    volHeightPx,
    subTopPx,
    subBottomPx,
    subHeightPx,
    hasSubPane,
  }
}

/** Oklab 感知均匀色彩空间转 CSS RGB 字符串（用于 OFI 订单流失衡与 VPIN 毒性着色） */
export function oklabOfiToCssColor(normOfi: number, vpin: number): string {
  const t = Math.max(-1, Math.min(1, normOfi))
  const L = 0.68 + Math.max(0, Math.min(0.14, vpin * 0.14))
  const a = t * 0.165
  const b = t * 0.085 - (1 - Math.abs(t)) * 0.03

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  const rLin = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s

  const toSrgb = (v: number): number =>
    Math.round(Math.pow(Math.max(0, Math.min(1, v)), 1 / 2.2) * 255)
  return `rgb(${toSrgb(rLin)}, ${toSrgb(gLin)}, ${toSrgb(bLin)})`
}

function formatPrice(price: number): string {
  if (!Number.isFinite(price)) return '--'
  const abs = Math.abs(price)
  if (abs >= 10) return price.toFixed(2)
  return price.toFixed(3)
}

/** 计算单根柱体的物理像素坐标与奇偶同锁尺寸 */
function computeBarBitmapBox(
  centerCssX: number,
  barSpacingCss: number,
  dpr: number,
): {
  wickLeft: number
  wickWidth: number
  bodyLeft: number
  bodyWidth: number
} {
  const m = computePixelPerfectCandleMetrics(barSpacingCss, dpr)
  const centerPx = Math.round(centerCssX * dpr)
  const bodyWidth = m.bodyWidthPhys
  const wickWidth = m.wickWidthPhys
  const bodyLeft = centerPx - Math.floor(bodyWidth / 2)
  const wickLeft = bodyLeft + Math.floor((bodyWidth - wickWidth) / 2)
  return { wickLeft, wickWidth, bodyLeft, bodyWidth }
}

/**
 * Layer 0: 绘制静态背景网格、坐标轴刻度、水印、L2 盘口深度热力图与 KDE 筹码分布横截面 (POC/VAH/VAL)
 */
export function paintBackgroundLayer(
  ctx: CanvasRenderingContext2D,
  state: KLinePaintContext,
): void {
  const { layout, store, viewport, minPrice, maxPrice, visibleStartIdx, visibleEndIdx, priceScaleMode } = state
  const { dpr, widthPx, heightPx, plotRightPx, mainTopPx, mainBottomPx, mainHeightPx, volTopPx, volBottomPx, subTopPx, subBottomPx, hasSubPane } = layout
  const plotWidthCss = plotRightPx / dpr

  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, widthPx, heightPx)

  // 1. L2 盘口深度环形热力图底层 (Toroidal Order Book Heatmap)
  if (state.showOrderBookHeatmap && state.l2Columns.length > 0 && store.length > 0) {
    const cols = state.l2Columns
    const startIdx = Math.max(0, visibleStartIdx)
    const endIdx = Math.min(store.length - 1, visibleEndIdx)

    for (let i = startIdx; i <= endIdx; i++) {
      const col = cols[(i - startIdx) % cols.length]
      if (!col || col.length === 0) continue
      const xCenter = logicalIndexToX(i, store.length, plotWidthCss, viewport) * dpr
      const colW = Math.max(2, Math.ceil(viewport.barSpacing * dpr))
      const xLeft = Math.round(xCenter - colW * 0.5)
      if (xLeft + colW < 0 || xLeft > plotRightPx) continue

      const bins = col.length
      const bandHeight = Math.max(2, Math.ceil(mainHeightPx / bins))
      for (let b = 0; b < bins; b++) {
        const intensity = col[b]!
        if (intensity < 0.08) continue
        const py = mainBottomPx - ((b + 0.5) / bins) * mainHeightPx
        const isBid = b < bins * 0.5
        const alpha = Math.min(0.36, intensity * 0.34).toFixed(3)
        ctx.fillStyle = isBid
          ? `rgba(16, 185, 129, ${alpha})`
          : `rgba(244, 63, 94, ${alpha})`
        ctx.fillRect(xLeft, Math.round(py - bandHeight * 0.5), colW, bandHeight)
      }
    }
  }

  // 2. 水印 (Symbol + Interval + Engine Badge)
  ctx.save()
  ctx.font = `600 ${Math.round(22 * dpr)}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.fillStyle = 'rgba(148, 163, 184, 0.07)'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(
    `${state.symbol}${state.symbolName ? ` · ${state.symbolName}` : ''} (${state.interval})`,
    Math.round(18 * dpr),
    Math.round(mainTopPx + 14 * dpr),
  )
  ctx.font = `500 ${Math.round(11 * dpr)}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.fillText(
    `ENGINE: ${state.engineLabel}`,
    Math.round(18 * dpr),
    Math.round(mainTopPx + 42 * dpr),
  )
  ctx.restore()

  // 3. 水平价格网格线与右侧价格刻度
  const priceTicks = computeNicePriceTicks(minPrice, maxPrice, 6)
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)'
  ctx.lineWidth = 1
  ctx.font = `${Math.round(10 * dpr)}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.fillStyle = 'rgba(148, 163, 184, 0.78)'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'

  ctx.beginPath()
  for (const tickPrice of priceTicks) {
    const y = Math.floor(priceToY(tickPrice, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode)) + 0.5
    if (y < mainTopPx + 6 * dpr || y > mainBottomPx - 6 * dpr) continue
    ctx.moveTo(0, y)
    ctx.lineTo(plotRightPx, y)
    ctx.fillText(formatPrice(tickPrice), plotRightPx + Math.round(6 * dpr), y)
  }
  ctx.stroke()

  // 4. 垂直时间网格线与底部时间轴标签
  if (store.length > 0) {
    const stepBars = Math.max(1, Math.round((96 * dpr) / Math.max(1, viewport.barSpacing * dpr)))
    ctx.beginPath()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const timeY = heightPx - layout.timeAxisHeightPx * 0.5

    for (let i = visibleStartIdx; i <= visibleEndIdx; i += stepBars) {
      if (i < 0 || i >= store.length) continue
      const x = Math.floor(logicalIndexToX(i, store.length, plotWidthCss, viewport) * dpr) + 0.5
      if (x < 24 * dpr || x > plotRightPx - 24 * dpr) continue
      ctx.moveTo(x, mainTopPx)
      ctx.lineTo(x, hasSubPane ? subBottomPx : volBottomPx)
      const label = store.timeLabels[i] || formatKLineTimestamp(store.timeMs[i]!)
      if (label) {
        ctx.fillText(label, x, timeY)
      }
    }
    ctx.stroke()
  }

  // 5. 窗格分割线与右轴边框
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)'
  ctx.beginPath()
  const rightAxisX = Math.floor(plotRightPx) + 0.5
  ctx.moveTo(rightAxisX, 0)
  ctx.lineTo(rightAxisX, heightPx)

  const mainSepY = Math.floor(mainBottomPx) + 0.5
  ctx.moveTo(0, mainSepY)
  ctx.lineTo(widthPx, mainSepY)

  const volSepY = Math.floor(volBottomPx) + 0.5
  ctx.moveTo(0, volSepY)
  ctx.lineTo(widthPx, volSepY)

  if (hasSubPane) {
    const subSepY = Math.floor(subBottomPx) + 0.5
    ctx.moveTo(0, subSepY)
    ctx.lineTo(widthPx, subSepY)
  }
  ctx.stroke()

  // 副图左上角标签
  ctx.font = `600 ${Math.round(9.5 * dpr)}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.fillStyle = 'rgba(148, 163, 184, 0.65)'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(
    state.showVpin ? 'VOL / VPIN TOXICITY (BVC)' : 'VOLUME',
    Math.round(8 * dpr),
    volTopPx + Math.round(3 * dpr),
  )
  if (hasSubPane) {
    ctx.fillText(
      'MACD (12, 26, 9) / FORMULA',
      Math.round(8 * dpr),
      subTopPx + Math.round(3 * dpr),
    )
  }

  // 6. KDE Volume Profile 筹码峰分布横截面 (POC / VAH / VAL)
  if (state.showVolumeProfile && store.length > 2) {
    const visibleBars = store.toBars().slice(Math.max(0, visibleStartIdx), Math.min(store.length, visibleEndIdx + 1))
    const vp = computeKdeVolumeProfile(visibleBars, 36)
    const maxProfileWidthPx = Math.round(plotRightPx * 0.22)
    const binsCount = vp.densities.length
    const binHeightPx = Math.max(2, Math.ceil(mainHeightPx / Math.max(1, binsCount)) - 1)
    const span = Math.max(1e-6, vp.maxPrice - vp.minPrice)

    for (let bIdx = 0; bIdx < binsCount; bIdx++) {
      const binPrice = vp.minPrice + ((bIdx + 0.5) / binsCount) * span
      const density = vp.densities[bIdx]!
      const y = priceToY(binPrice, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode)
      if (y < mainTopPx || y > mainBottomPx) continue
      const barW = Math.round(density * maxProfileWidthPx)
      if (barW <= 0) continue

      const isValueArea = binPrice >= vp.valueAreaLow && binPrice <= vp.valueAreaHigh
      ctx.fillStyle = isValueArea
        ? 'rgba(56, 189, 248, 0.18)'
        : 'rgba(148, 163, 184, 0.09)'
      ctx.fillRect(
        plotRightPx - barW,
        Math.round(y - binHeightPx * 0.5),
        barW,
        binHeightPx,
      )
    }

    // 绘制 POC (Point of Control) 筹码峰值线
    const pocY = Math.floor(priceToY(vp.pocPrice, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode)) + 0.5
    if (pocY >= mainTopPx && pocY <= mainBottomPx) {
      ctx.save()
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.72)'
      ctx.lineWidth = Math.max(1, Math.round(1.2 * dpr))
      ctx.setLineDash([Math.round(4 * dpr), Math.round(3 * dpr)])
      ctx.beginPath()
      ctx.moveTo(plotRightPx - maxProfileWidthPx * 1.15, pocY)
      ctx.lineTo(plotRightPx, pocY)
      ctx.stroke()

      ctx.fillStyle = 'rgba(245, 158, 11, 0.92)'
      ctx.font = `600 ${Math.round(9 * dpr)}px ui-monospace, SFMono-Regular, Menlo, monospace`
      ctx.textAlign = 'right'
      ctx.textBaseline = 'bottom'
      ctx.fillText(`POC ${formatPrice(vp.pocPrice)}`, plotRightPx - Math.round(4 * dpr), pocY - Math.round(2 * dpr))
      ctx.restore()
    }
  }

  ctx.restore()
}

/**
 * Layer 1: 绘制物理位图空间奇偶同锁 K 线、颜色分桶批处理、KDE 小提琴轮廓、通达信公式与副图
 */
export function paintSeriesLayer(
  ctx: CanvasRenderingContext2D,
  state: KLinePaintContext,
): void {
  const {
    layout,
    store,
    viewport,
    minPrice,
    maxPrice,
    maxVolume,
    visibleStartIdx,
    visibleEndIdx,
    priceScaleMode,
    colorScheme,
    kdeCandle,
    ofiColoring,
  } = state
  const {
    dpr,
    widthPx,
    heightPx,
    plotRightPx,
    mainTopPx,
    mainHeightPx,
    volBottomPx,
    volHeightPx,
    subTopPx,
    subHeightPx,
    hasSubPane,
  } = layout
  const plotWidthCss = plotRightPx / dpr

  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, widthPx, heightPx)

  if (store.length === 0) {
    ctx.restore()
    return
  }

  const startIdx = Math.max(0, visibleStartIdx)
  const endIdx = Math.min(store.length - 1, visibleEndIdx)

  const bullColor = colorScheme === 'intl-green-up' ? '#10b981' : '#ef4444'
  const bearColor = colorScheme === 'intl-green-up' ? '#ef4444' : '#10b981'
  const bullVolColor = colorScheme === 'intl-green-up' ? 'rgba(16, 185, 129, 0.55)' : 'rgba(239, 68, 68, 0.55)'
  const bearVolColor = colorScheme === 'intl-green-up' ? 'rgba(239, 68, 68, 0.55)' : 'rgba(16, 185, 129, 0.55)'

  const bullWickPath = new Path2D()
  const bearWickPath = new Path2D()
  const bullBodyPath = new Path2D()
  const bearBodyPath = new Path2D()
  const bullVolPath = new Path2D()
  const bearVolPath = new Path2D()

  const candleMetrics = computePixelPerfectCandleMetrics(viewport.barSpacing, dpr)

  if (candleMetrics.isSubPixelConflated && !state.skipMainCandles) {
    // 亚像素 M4 线段树极值分箱渲染
    const pixelColumns = Math.max(1, Math.floor(layout.plotWidthPx))
    const totalBarsInView = endIdx - startIdx + 1
    for (let col = 0; col < pixelColumns; col++) {
      const b0 = startIdx + Math.floor((col * totalBarsInView) / pixelColumns)
      const b1 = Math.min(endIdx, startIdx + Math.floor(((col + 1) * totalBarsInView) / pixelColumns))
      if (b0 > b1) continue
      const extrema = store.segmentTree.query(b0, b1)
      const openVal = store.open[b0]!
      const closeVal = store.close[b1]!
      const isBull = closeVal >= openVal

      const xPx = Math.round(logicalIndexToX((b0 + b1) * 0.5, store.length, plotWidthCss, viewport) * dpr)
      if (xPx < 0 || xPx >= plotRightPx) continue

      const yHigh = Math.round(priceToY(extrema.max, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode))
      const yLow = Math.round(priceToY(extrema.min, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode))
      const targetPath = isBull ? bullBodyPath : bearBodyPath
      targetPath.rect(xPx, yHigh, 1, Math.max(1, yLow - yHigh))

      const volVal = store.volume[b1]!
      const volY = Math.round(volBottomPx - (volVal / Math.max(1, maxVolume)) * (volHeightPx - 6 * dpr))
      const targetVol = isBull ? bullVolPath : bearVolPath
      targetVol.rect(xPx, volY, 1, Math.max(1, volBottomPx - volY))
    }
  } else {
    // 物理位图空间奇偶同锁 (Parity-Locked: wickWidth % 2 === bodyWidth % 2)
    for (let i = startIdx; i <= endIdx; i++) {
      const centerCssX = logicalIndexToX(i, store.length, plotWidthCss, viewport)
      const box = computeBarBitmapBox(centerCssX, viewport.barSpacing, dpr)
      if (box.bodyLeft + box.bodyWidth < 0 || box.bodyLeft > plotRightPx) continue

      const open = store.open[i]!
      const high = store.high[i]!
      const low = store.low[i]!
      const close = store.close[i]!
      const volume = store.volume[i]!
      const isBull = close >= open

      // 成交量柱
      const volH = Math.max(1, Math.round((volume / Math.max(1, maxVolume)) * (volHeightPx - 8 * dpr)))
      const volTopY = volBottomPx - volH
      if (isBull) {
        bullVolPath.rect(box.bodyLeft, volTopY, box.bodyWidth, volH)
      } else {
        bearVolPath.rect(box.bodyLeft, volTopY, box.bodyWidth, volH)
      }

      if (state.skipMainCandles) continue

      const yHigh = Math.round(priceToY(high, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode))
      const yLow = Math.round(priceToY(low, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode))
      const yOpen = Math.round(priceToY(open, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode))
      const yClose = Math.round(priceToY(close, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode))
      const bodyTop = Math.min(yOpen, yClose)
      const bodyHeight = Math.max(1, Math.abs(yClose - yOpen))

      const normOfi = volume > 0 ? Math.max(-1, Math.min(1, store.ofi[i]! / volume)) : 0

      if (kdeCandle && box.bodyWidth >= 5) {
        // KDE 小提琴盘口密度轮廓蜡烛
        const fillStyle = ofiColoring
          ? oklabOfiToCssColor(normOfi, store.vpin[i]!)
          : isBull
            ? bullColor
            : bearColor
        ctx.fillStyle = fillStyle
        ctx.fillRect(box.wickLeft, yHigh, box.wickWidth, Math.max(1, yLow - yHigh))

        const cx = box.wickLeft + box.wickWidth * 0.5
        const midY = bodyTop + bodyHeight * 0.5
        const halfW = box.bodyWidth * (0.52 + 0.25 * Math.min(1, volume / Math.max(1, maxVolume)))
        ctx.beginPath()
        ctx.moveTo(cx, yHigh)
        ctx.bezierCurveTo(cx + halfW, midY - bodyHeight * 0.45, cx + halfW, midY + bodyHeight * 0.45, cx, yLow)
        ctx.bezierCurveTo(cx - halfW, midY + bodyHeight * 0.45, cx - halfW, midY - bodyHeight * 0.45, cx, yHigh)
        ctx.fill()
        continue
      }

      if (ofiColoring) {
        ctx.fillStyle = oklabOfiToCssColor(normOfi, store.vpin[i]!)
        ctx.fillRect(box.wickLeft, yHigh, box.wickWidth, Math.max(1, yLow - yHigh))
        ctx.fillRect(box.bodyLeft, bodyTop, box.bodyWidth, bodyHeight)
        continue
      }

      const wickTarget = isBull ? bullWickPath : bearWickPath
      const bodyTarget = isBull ? bullBodyPath : bearBodyPath

      wickTarget.rect(box.wickLeft, yHigh, box.wickWidth, Math.max(1, yLow - yHigh))
      bodyTarget.rect(box.bodyLeft, bodyTop, box.bodyWidth, bodyHeight)
    }
  }

  // 批量提交阳线与阴线（极低 Draw Calls）
  if (!state.skipMainCandles && !ofiColoring) {
    ctx.fillStyle = bullColor
    ctx.fill(bullWickPath)
    ctx.fill(bullBodyPath)

    ctx.fillStyle = bearColor
    ctx.fill(bearWickPath)
    ctx.fill(bearBodyPath)
  }

  // 批量提交成交量柱
  ctx.fillStyle = bullVolColor
  ctx.fill(bullVolPath)
  ctx.fillStyle = bearVolColor
  ctx.fill(bearVolPath)

  // 2. VPIN 知情交易毒性曲线（叠加于成交量副图）
  if (state.showVpin && store.length > 1) {
    ctx.save()
    ctx.beginPath()
    let started = false
    for (let i = startIdx; i <= endIdx; i++) {
      const x = logicalIndexToX(i, store.length, plotWidthCss, viewport) * dpr
      if (x < 0 || x > plotRightPx) continue
      const vpin = Math.max(0, Math.min(1, store.vpin[i]!))
      const y = volBottomPx - vpin * (volHeightPx - 6 * dpr)
      if (!started) {
        ctx.moveTo(x, y)
        started = true
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = Math.max(1.2, 1.5 * dpr)
    ctx.stroke()

    const alertY = Math.floor(volBottomPx - 0.7 * (volHeightPx - 6 * dpr)) + 0.5
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.55)'
    ctx.lineWidth = 1
    ctx.setLineDash([Math.round(3 * dpr), Math.round(3 * dpr)])
    ctx.beginPath()
    ctx.moveTo(0, alertY)
    ctx.lineTo(plotRightPx, alertY)
    ctx.stroke()
    ctx.restore()
  }

  // 3. 主图通达信公式与均线叠加层 (Curves + STICKLINE + DRAWTEXT + DRAWICON)
  if (state.mainFormulaResult) {
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, mainTopPx, plotRightPx, mainHeightPx)
    ctx.clip()

    for (const line of state.mainFormulaResult.lines) {
      if (line.nodraw) continue
      ctx.beginPath()
      let started = false
      for (let i = startIdx; i <= endIdx; i++) {
        const val = line.data[i]!
        if (!Number.isFinite(val)) {
          started = false
          continue
        }
        const x = logicalIndexToX(i, store.length, plotWidthCss, viewport) * dpr
        const y = priceToY(val, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode)
        if (!started) {
          ctx.moveTo(x, y)
          started = true
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.strokeStyle = line.color ?? '#f59e0b'
      ctx.lineWidth = Math.max(1, (line.lineWidth || 1.5) * dpr)
      ctx.stroke()
    }

    // 绘图指令: stickline / drawtext / drawicon
    ctx.font = `600 ${Math.round(10 * dpr)}px system-ui, sans-serif`
    ctx.textAlign = 'center'

    for (const d of state.mainFormulaResult.drawings) {
      if (d.kind === 'stickline') {
        ctx.fillStyle = d.color ?? '#eab308'
        for (let i = startIdx; i <= endIdx; i++) {
          if (!d.cond[i]) continue
          const p1 = d.price1[i]!
          const p2 = d.price2[i]!
          if (!Number.isFinite(p1) || !Number.isFinite(p2)) continue
          const centerCssX = logicalIndexToX(i, store.length, plotWidthCss, viewport)
          const box = computeBarBitmapBox(centerCssX, viewport.barSpacing, dpr)
          const y1 = Math.round(priceToY(p1, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode))
          const y2 = Math.round(priceToY(p2, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode))
          ctx.fillRect(box.bodyLeft, Math.min(y1, y2), box.bodyWidth, Math.max(1, Math.abs(y2 - y1)))
        }
      } else if (d.kind === 'drawtext') {
        ctx.fillStyle = d.color ?? '#f59e0b'
        for (let i = startIdx; i <= endIdx; i++) {
          if (!d.cond[i]) continue
          const p = d.price[i]!
          if (!Number.isFinite(p)) continue
          const x = logicalIndexToX(i, store.length, plotWidthCss, viewport) * dpr
          const y = priceToY(p, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode)
          ctx.fillText(d.text, x, y - Math.round(6 * dpr))
        }
      } else if (d.kind === 'drawicon') {
        for (let i = startIdx; i <= endIdx; i++) {
          if (!d.cond[i]) continue
          const p = d.price[i]!
          if (!Number.isFinite(p)) continue
          const x = logicalIndexToX(i, store.length, plotWidthCss, viewport) * dpr
          const y = priceToY(p, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode)
          ctx.fillStyle = d.iconType === 1 ? '#10b981' : '#f43f5e'
          ctx.fillText(d.iconType === 1 ? '▲' : '▼', x, y)
        }
      }
    }

    ctx.restore()
  }

  // 4. 副图指标渲染 (MACD / 自定义通达信副图公式)
  if (hasSubPane && state.subFormulaResult && state.subFormulaResult.lines.length > 0) {
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, subTopPx, plotRightPx, subHeightPx)
    ctx.clip()

    let subMin = Infinity
    let subMax = -Infinity
    for (const line of state.subFormulaResult.lines) {
      if (line.nodraw) continue
      for (let i = startIdx; i <= endIdx; i++) {
        const v = line.data[i]!
        if (Number.isFinite(v)) {
          if (v < subMin) subMin = v
          if (v > subMax) subMax = v
        }
      }
    }
    if (!Number.isFinite(subMin) || !Number.isFinite(subMax) || subMin === subMax) {
      subMin = -1
      subMax = 1
    } else {
      const pad = (subMax - subMin) * 0.12
      subMin -= pad
      subMax += pad
    }

    if (subMin < 0 && subMax > 0) {
      const zeroY = Math.floor(priceToY(0, subMin, subMax, subTopPx, subHeightPx)) + 0.5
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, zeroY)
      ctx.lineTo(plotRightPx, zeroY)
      ctx.stroke()
    }

    for (const line of state.subFormulaResult.lines) {
      if (line.nodraw) continue
      const isHistogram = line.name.toUpperCase() === 'MACD' || line.style === 'colorstick'
      if (isHistogram) {
        const zeroY = Math.round(priceToY(0, subMin, subMax, subTopPx, subHeightPx))
        for (let i = startIdx; i <= endIdx; i++) {
          const val = line.data[i]!
          if (!Number.isFinite(val)) continue
          const centerCssX = logicalIndexToX(i, store.length, plotWidthCss, viewport)
          const box = computeBarBitmapBox(centerCssX, viewport.barSpacing, dpr)
          const y = Math.round(priceToY(val, subMin, subMax, subTopPx, subHeightPx))
          ctx.fillStyle = val >= 0 ? bullColor : bearColor
          ctx.fillRect(
            box.wickLeft,
            Math.min(zeroY, y),
            Math.max(1, Math.round(box.bodyWidth * 0.65)),
            Math.max(1, Math.abs(y - zeroY)),
          )
        }
      } else {
        ctx.beginPath()
        let started = false
        for (let i = startIdx; i <= endIdx; i++) {
          const val = line.data[i]!
          if (!Number.isFinite(val)) {
            started = false
            continue
          }
          const x = logicalIndexToX(i, store.length, plotWidthCss, viewport) * dpr
          const y = priceToY(val, subMin, subMax, subTopPx, subHeightPx)
          if (!started) {
            ctx.moveTo(x, y)
            started = true
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.strokeStyle = line.color ?? '#38bdf8'
        ctx.lineWidth = Math.max(1, 1.3 * dpr)
        ctx.stroke()
      }
    }

    ctx.restore()
  }

  ctx.restore()
}

/**
 * Layer 2: 绘制高频十字准星、坐标胶囊、最新价跳动线、大模型语义标注与用户交互画线
 */
export function paintInteractionLayer(
  ctx: CanvasRenderingContext2D,
  state: KLinePaintContext,
): void {
  const { layout, store, viewport, minPrice, maxPrice, visibleStartIdx, visibleEndIdx, priceScaleMode } = state
  const { dpr, widthPx, heightPx, plotRightPx, mainTopPx, mainBottomPx, mainHeightPx, volBottomPx, subBottomPx, hasSubPane } = layout
  const plotWidthCss = plotRightPx / dpr

  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, widthPx, heightPx)

  if (store.length === 0) {
    ctx.restore()
    return
  }

  // 1. 最新收盘价水平虚线与右轴实时价格胶囊
  const lastIdx = store.length - 1
  const lastClose = store.close[lastIdx]!
  const lastOpen = store.open[lastIdx]!
  const lastY = Math.floor(priceToY(lastClose, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode)) + 0.5
  const isLastBull = lastClose >= lastOpen
  const liveColor =
    state.colorScheme === 'intl-green-up'
      ? isLastBull
        ? '#10b981'
        : '#ef4444'
      : isLastBull
        ? '#ef4444'
        : '#10b981'

  if (lastY >= mainTopPx && lastY <= mainBottomPx) {
    ctx.save()
    ctx.strokeStyle = liveColor
    ctx.lineWidth = 1
    ctx.setLineDash([Math.round(3 * dpr), Math.round(3 * dpr)])
    ctx.beginPath()
    ctx.moveTo(0, lastY)
    ctx.lineTo(plotRightPx, lastY)
    ctx.stroke()

    const pillH = Math.round(16 * dpr)
    ctx.fillStyle = liveColor
    ctx.fillRect(plotRightPx + 1, Math.round(lastY - pillH * 0.5), widthPx - plotRightPx - 2, pillH)
    ctx.fillStyle = '#ffffff'
    ctx.font = `600 ${Math.round(10 * dpr)}px ui-monospace, SFMono-Regular, Menlo, monospace`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(formatPrice(lastClose), plotRightPx + Math.round(5 * dpr), lastY)
    ctx.restore()
  }

  // 2. 渲染大模型语义标注 (Annotations: signal / tag / hline / trendline / zone)
  for (const ann of state.annotations) {
    if (ann.type === 'hline' && ann.price !== undefined) {
      const y = Math.floor(priceToY(ann.price, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode)) + 0.5
      if (y < mainTopPx || y > mainBottomPx) continue
      ctx.save()
      ctx.strokeStyle = ann.color ?? '#38bdf8'
      ctx.lineWidth = Math.max(1, Math.round(1.2 * dpr))
      ctx.setLineDash([Math.round(5 * dpr), Math.round(3 * dpr)])
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(plotRightPx, y)
      ctx.stroke()
      if (ann.label) {
        ctx.fillStyle = ann.color ?? '#38bdf8'
        ctx.font = `600 ${Math.round(10 * dpr)}px system-ui, sans-serif`
        ctx.textAlign = 'left'
        ctx.textBaseline = 'bottom'
        ctx.fillText(ann.label, Math.round(8 * dpr), y - Math.round(3 * dpr))
      }
      ctx.restore()
      continue
    }

    if ((ann.type === 'signal' || ann.type === 'tag') && ann.index !== undefined) {
      const resolvedIdx = ann.index < 0 ? Math.max(0, store.length + ann.index) : ann.index
      const idx = Math.max(0, Math.min(store.length - 1, resolvedIdx))
      if (idx < visibleStartIdx - 2 || idx > visibleEndIdx + 2) continue
      const x = logicalIndexToX(idx, store.length, plotWidthCss, viewport) * dpr
      const isBuy = ann.side !== 'sell'
      const anchorPrice = ann.price ?? (isBuy ? store.low[idx]! : store.high[idx]!)
      const y = priceToY(anchorPrice, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode)
      const badgeColor = ann.color ?? (isBuy ? '#10b981' : '#f43f5e')
      const offsetY = isBuy ? Math.round(16 * dpr) : -Math.round(16 * dpr)

      ctx.save()
      ctx.fillStyle = badgeColor
      ctx.strokeStyle = badgeColor
      ctx.lineWidth = Math.max(1, Math.round(1.2 * dpr))
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y + offsetY * 0.65)
      ctx.stroke()

      const label = ann.label || (isBuy ? 'BUY' : 'SELL')
      ctx.font = `600 ${Math.round(9.5 * dpr)}px system-ui, sans-serif`
      const textW = ctx.measureText(label).width
      const padX = Math.round(5 * dpr)
      const boxW = textW + padX * 2
      const boxH = Math.round(15 * dpr)
      const boxX = Math.round(x - boxW * 0.5)
      const boxY = Math.round(y + offsetY - boxH * 0.5)

      ctx.fillStyle = badgeColor
      ctx.beginPath()
      ctx.roundRect(boxX, boxY, boxW, boxH, Math.round(4 * dpr))
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, x, boxY + boxH * 0.5)
      ctx.restore()
    }
  }

  // 3. 渲染用户交互画线 (Trendline / HLine / Fib Retracement) —— 严格锚定于 (logicalIndex, price)
  const allDrawings = state.activeDrawingDraft
    ? [...state.drawings, state.activeDrawingDraft]
    : state.drawings

  for (const d of allDrawings) {
    ctx.save()
    ctx.strokeStyle = d.color || '#38bdf8'
    ctx.fillStyle = d.color || '#38bdf8'
    ctx.lineWidth = Math.max(1.2, 1.5 * dpr)

    const x1 = logicalIndexToX(d.p1.logicalIndex, store.length, plotWidthCss, viewport) * dpr
    const y1 = priceToY(d.p1.price, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode)

    if (d.type === 'hline') {
      const yLine = Math.floor(y1) + 0.5
      ctx.beginPath()
      ctx.moveTo(0, yLine)
      ctx.lineTo(plotRightPx, yLine)
      ctx.stroke()
      ctx.font = `600 ${Math.round(9.5 * dpr)}px ui-monospace, SFMono-Regular, Menlo, monospace`
      ctx.fillText(`HLINE ${formatPrice(d.p1.price)}`, Math.round(12 * dpr), yLine - Math.round(4 * dpr))
      ctx.restore()
      continue
    }

    if (d.p2) {
      const x2 = logicalIndexToX(d.p2.logicalIndex, store.length, plotWidthCss, viewport) * dpr
      const y2 = priceToY(d.p2.price, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode)

      if (d.type === 'trendline' || d.type === 'ray') {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(x1, y1, Math.round(3 * dpr), 0, Math.PI * 2)
        ctx.arc(x2, y2, Math.round(3 * dpr), 0, Math.PI * 2)
        ctx.fill()
      } else if (d.type === 'fib') {
        const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
        const leftX = Math.min(x1, x2)
        const rightX = Math.max(x1, x2, leftX + 60 * dpr)
        ctx.font = `500 ${Math.round(9 * dpr)}px ui-monospace, SFMono-Regular, Menlo, monospace`
        for (const lv of levels) {
          const priceLv = d.p1.price + (d.p2.price - d.p1.price) * lv
          const yLv = Math.floor(priceToY(priceLv, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode)) + 0.5
          ctx.beginPath()
          ctx.moveTo(leftX, yLv)
          ctx.lineTo(rightX, yLv)
          ctx.stroke()
          ctx.fillText(`${(lv * 100).toFixed(1)}% (${formatPrice(priceLv)})`, leftX + Math.round(4 * dpr), yLv - Math.round(3 * dpr))
        }
      }
    }
    ctx.restore()
  }

  // 4. 十字准星与轴胶囊 (Crosshair & Axis Pills)
  if (state.cursorCss) {
    const cxPx = Math.floor(state.cursorCss.x * dpr) + 0.5
    const cyPx = Math.floor(state.cursorCss.y * dpr) + 0.5
    const maxBottomPx = hasSubPane ? subBottomPx : volBottomPx

    if (cxPx >= 0 && cxPx <= plotRightPx && cyPx >= mainTopPx && cyPx <= maxBottomPx) {
      const snappedIdx = Math.max(
        0,
        Math.min(store.length - 1, xToLogicalIndex(state.cursorCss.x, store.length, plotWidthCss, viewport)),
      )
      const snappedX = Math.floor(logicalIndexToX(snappedIdx, store.length, plotWidthCss, viewport) * dpr) + 0.5

      ctx.save()
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.65)'
      ctx.lineWidth = 1
      ctx.setLineDash([Math.round(4 * dpr), Math.round(4 * dpr)])
      ctx.beginPath()
      ctx.moveTo(snappedX, mainTopPx)
      ctx.lineTo(snappedX, maxBottomPx)
      ctx.moveTo(0, cyPx)
      ctx.lineTo(plotRightPx, cyPx)
      ctx.stroke()

      if (cyPx <= mainBottomPx) {
        const hoverPrice = yToPrice(cyPx, minPrice, maxPrice, mainTopPx, mainHeightPx, priceScaleMode)
        const pillH = Math.round(16 * dpr)
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(plotRightPx + 1, Math.round(cyPx - pillH * 0.5), widthPx - plotRightPx - 2, pillH)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'
        ctx.setLineDash([])
        ctx.strokeRect(plotRightPx + 1, Math.round(cyPx - pillH * 0.5), widthPx - plotRightPx - 2, pillH)
        ctx.fillStyle = '#f8fafc'
        ctx.font = `600 ${Math.round(10 * dpr)}px ui-monospace, SFMono-Regular, Menlo, monospace`
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText(formatPrice(hoverPrice), plotRightPx + Math.round(5 * dpr), cyPx)
      }

      const timeStr = store.timeLabels[snappedIdx] || formatKLineTimestamp(store.timeMs[snappedIdx]!) || `#${snappedIdx}`
      ctx.font = `600 ${Math.round(10 * dpr)}px ui-monospace, SFMono-Regular, Menlo, monospace`
      const tw = ctx.measureText(timeStr).width + Math.round(14 * dpr)
      const th = layout.timeAxisHeightPx - Math.round(2 * dpr)
      const tx = Math.max(2, Math.min(plotRightPx - tw, Math.round(snappedX - tw * 0.5)))
      const ty = heightPx - layout.timeAxisHeightPx + 1

      ctx.fillStyle = '#1e293b'
      ctx.fillRect(tx, ty, tw, th)
      ctx.fillStyle = '#f8fafc'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(timeStr, tx + tw * 0.5, ty + th * 0.5)
      ctx.restore()
    }
  }

  ctx.restore()
}
