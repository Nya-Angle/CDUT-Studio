/**
 * Standalone Lab-Grade Financial K-Line & Microstructure Renderer
 *
 * Architecture:
 * 1. Dual-Engine Adaptive Pipeline:
 *    - Tier-2 WebGPU 100% GPU-Resident Pipeline (WGSL Compute M4 Conflation,
 *      Emulated Double-Single ds_float, KDE-SDF Violin Candlesticks,
 *      Toroidal L2 LOB Heatmap, Oklab OFI Coloring, r32uint GPU Picking)
 *    - Tier-1 3-Layer Parity-Locked Canvas 2D Fallback (Bitmap Cache Layer 0 +
 *      Incremental Live Layer 1 + Zero-Reflow HUD Layer 2)
 * 2. SoA Columnar Data Store + Segment Tree O(log N) Y-axis Auto-Scaling
 * 3. Pine/TDX Vectorized Formula VM (MA/EMA/MACD/KDJ/RSI/BOLL/ATR/OFI/VPIN)
 * 4. Dual-Way AI Cognitive Encoder (OHLCV + Microstructure -> Semantic Digest)
 * 5. Live Network Ticker Bus Subscription (`kline-live` / `symbol` mount)
 */

import * as React from 'react'
import {
  Activity,
  Cpu,
  Flame,
  Layers,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Eye,
  Code2,
} from 'lucide-react'
import {
  KLineDataStore,
  computeKLineAnchorZoom,
  computeVisibleLogicalRange,
  detectCandlestickPatterns,
  encodeKLineCognitiveDigest,
  evaluateFormula,
  FastPrng,
  generateL2DepthColumn,
  generateSyntheticKLineBars,
  intervalToPeriodMs,
  parseKLineBlockText,
  xToLogicalIndex,
  type DetectedCandlestickPattern,
  type FormulaEvaluationResult,
  type KLineBar,
  type KLineCognitiveDigest,
  type KLineColorScheme,
  type KLineDSLSpec,
  type KLineEngineMode,
  type KLinePriceScaleMode,
  type KLineSubPaneKind,
  type KLineViewportState,
} from '@profer/shared'
import { cn } from '../lib/cn.ts'
import { useKLineMarketFeed } from './KLineMarketContext.tsx'
import { WebGPUKLinePipeline } from './webgpu-kline-pipeline.ts'
import {
  computeKLinePaneLayout,
  paintBackgroundLayer,
  paintSeriesLayer,
  paintInteractionLayer,
  type KLinePaintContext,
  type KLineUserDrawing,
} from './canvas2d-kline-painter.ts'

export const BUILTIN_INDICATOR_FORMULAS = {
  MA: {
    label: 'MA 均线簇',
    formula: 'MA5:MA(C,5);\nMA10:MA(C,10);\nMA20:MA(C,20);\nMA60:MA(C,60);',
  },
  EMA: {
    label: 'EMA 指数均线',
    formula: 'EMA12:EMA(C,12);\nEMA26:EMA(C,26);\nEMA50:EMA(C,50);',
  },
  BOLL: {
    label: 'BOLL 布林带',
    formula: 'MID:MA(C,20);\nUPPER:MID+2*STD(C,20);\nLOWER:MID-2*STD(C,20);',
  },
  MACD: {
    label: 'MACD',
    formula: 'DIF:EMA(C,12)-EMA(C,26);\nDEA:EMA(DIF,9);\nMACD:(DIF-DEA)*2,COLORSTICK;',
  },
  KDJ: {
    label: 'KDJ',
    formula: 'RSV:(C-LLV(L,9))/(HHV(H,9)-LLV(L,9))*100;\nK:SMA(RSV,3,1);\nD:SMA(K,3,1);\nJ:3*K-2*D;',
  },
  RSI: {
    label: 'RSI',
    formula: 'RSI6:RSI(C,6);\nRSI12:RSI(C,12);\nRSI24:RSI(C,24);',
  },
} as const

export interface KLineRendererProps {
  /** Raw DSL text (JSON / YAML / CSV) or structured spec */
  code?: string
  spec?: Partial<KLineDSLSpec>
  /** Direct symbol mount for standalone client panels */
  symbol?: string
  /** Interval override */
  interval?: string
  /** Fixed height in CSS pixels */
  height?: number
  /** Compact mode for inline chat embeds vs full workstation mode */
  compact?: boolean
  /** Initial rendering backend preference */
  preferredBackend?: KLineEngineMode
  /** Callback when AI cognitive digest updates */
  onCognitiveDigestChange?: (digest: KLineCognitiveDigest) => void
  /** Additional CSS class */
  className?: string
}

const SUBPANE_OPTIONS: { id: KLineSubPaneKind; label: string }[] = [
  { id: 'VOL', label: 'VOL' },
  { id: 'MACD', label: 'MACD' },
  { id: 'KDJ', label: 'KDJ' },
  { id: 'RSI', label: 'RSI' },
  { id: 'VPIN', label: 'VPIN毒性' },
]

const MAIN_OVERLAY_OPTIONS: { id: 'MA' | 'EMA' | 'BOLL' | 'NONE' | 'CUSTOM'; label: string }[] = [
  { id: 'MA', label: 'MA' },
  { id: 'EMA', label: 'EMA' },
  { id: 'BOLL', label: 'BOLL' },
  { id: 'NONE', label: '无均线' },
]

export function KLineRenderer({
  code,
  spec: propSpec,
  symbol: propSymbol,
  interval: propInterval,
  height = 460,
  compact = false,
  preferredBackend = 'auto',
  onCognitiveDigestChange,
  className,
}: KLineRendererProps): React.ReactElement {
  const marketFeed = useKLineMarketFeed()

  // Parse DSL or merge with explicit props
  const resolvedSpec = React.useMemo<KLineDSLSpec>(() => {
    const parsed: Partial<KLineDSLSpec> = code ? (parseKLineBlockText(code) ?? {}) : {}
    const mergedSymbol = propSymbol || propSpec?.symbol || parsed.symbol || '600519.SH'
    const mergedInterval = propInterval || propSpec?.interval || parsed.interval || '1m'
    const mergedMode: 'live' | 'static' =
      propSpec?.mode ||
      parsed.mode ||
      (propSymbol && (!parsed.bars || parsed.bars.length === 0) ? 'live' : 'static')

    return {
      mode: mergedMode,
      symbol: mergedSymbol,
      name: propSpec?.name || parsed.name || mergedSymbol,
      market: propSpec?.market || parsed.market,
      interval: mergedInterval,
      colorScheme: propSpec?.colorScheme || parsed.colorScheme || 'cn-red-up',
      priceScaleMode: propSpec?.priceScaleMode || parsed.priceScaleMode || 'linear',
      formula: propSpec?.formula ?? parsed.formula ?? BUILTIN_INDICATOR_FORMULAS.MA.formula,
      subPanes: propSpec?.subPanes || parsed.subPanes || ['VOL', 'MACD'],
      microstructure: {
        kdeCandle: propSpec?.microstructure?.kdeCandle ?? parsed.microstructure?.kdeCandle ?? false,
        lobHeatmap: propSpec?.microstructure?.lobHeatmap ?? parsed.microstructure?.lobHeatmap ?? false,
        ofiColoring: propSpec?.microstructure?.ofiColoring ?? parsed.microstructure?.ofiColoring ?? false,
        vpinRibbon: propSpec?.microstructure?.vpinRibbon ?? parsed.microstructure?.vpinRibbon ?? true,
        icebergGlyphs: propSpec?.microstructure?.icebergGlyphs ?? parsed.microstructure?.icebergGlyphs ?? true,
      },
      annotations: propSpec?.annotations || parsed.annotations || [],
      bars: propSpec?.bars && propSpec.bars.length > 0 ? propSpec.bars : (parsed.bars ?? []),
    }
  }, [code, propSpec, propSymbol, propInterval])

  // Interactive UI controls state
  const [activeInterval, setActiveInterval] = React.useState<string>(resolvedSpec.interval)
  const [colorScheme, setColorScheme] = React.useState<KLineColorScheme>(resolvedSpec.colorScheme)
  const [priceScaleMode, setPriceScaleMode] = React.useState<KLinePriceScaleMode>(resolvedSpec.priceScaleMode)
  const [mainOverlayKey, setMainOverlayKey] = React.useState<'MA' | 'EMA' | 'BOLL' | 'NONE' | 'CUSTOM'>('MA')
  const [customFormula, setCustomFormula] = React.useState<string>(resolvedSpec.formula)
  const [showFormulaEditor, setShowFormulaEditor] = React.useState<boolean>(false)
  const [subPaneKind, setSubPaneKind] = React.useState<KLineSubPaneKind>(
    resolvedSpec.subPanes.find((p) => p !== 'VOL') ?? 'MACD'
  )
  const [enableKdeViolin, setEnableKdeViolin] = React.useState<boolean>(
    Boolean(resolvedSpec.microstructure.kdeCandle)
  )
  const [enableLobHeatmap, setEnableLobHeatmap] = React.useState<boolean>(
    Boolean(resolvedSpec.microstructure.lobHeatmap)
  )
  const [enableOfiColoring, setEnableOfiColoring] = React.useState<boolean>(
    Boolean(resolvedSpec.microstructure.ofiColoring)
  )
  const [showVolumeProfile, setShowVolumeProfile] = React.useState<boolean>(true)
  const [showFormulaWarnings, setShowFormulaWarnings] = React.useState<string[]>([])
  const [showFormulaDiagnostics, setShowFormulaDiagnostics] = React.useState<string[]>([])
  const [showAiDigestPanel, setShowAiDigestPanel] = React.useState<boolean>(false)
  const [isLiveStreaming, setIsLiveStreaming] = React.useState<boolean>(resolvedSpec.mode === 'live')
  const [activeBackend, setActiveBackend] = React.useState<'webgpu' | 'canvas2d'>('canvas2d')
  const [webgpuAvailable, setWebgpuAvailable] = React.useState<boolean>(false)
  const [fpsMetrics, setFpsMetrics] = React.useState<{ fps: number; frameTimeMs: number; tickCount: number }>({
    fps: 60,
    frameTimeMs: 0.4,
    tickCount: 0,
  })
  const [cognitiveDigest, setCognitiveDigest] = React.useState<KLineCognitiveDigest | null>(null)
  const [hoveredInfo, setHoveredInfo] = React.useState<{
    timeLabel: string
    open: number
    high: number
    low: number
    close: number
    volume: number
    changePct: number
    ofi: number
    vpin: number
  } | null>(null)

  // Sync when resolvedSpec changes significantly
  React.useEffect(() => {
    setActiveInterval(resolvedSpec.interval)
    setColorScheme(resolvedSpec.colorScheme)
    setPriceScaleMode(resolvedSpec.priceScaleMode)
    if (resolvedSpec.formula) {
      setCustomFormula(resolvedSpec.formula)
    }
    setIsLiveStreaming(resolvedSpec.mode === 'live')
  }, [
    resolvedSpec.symbol,
    resolvedSpec.interval,
    resolvedSpec.colorScheme,
    resolvedSpec.priceScaleMode,
    resolvedSpec.formula,
    resolvedSpec.mode,
  ])

  // Columnar Data Store + Viewport Ref (mutated in rAF without React re-renders)
  const storeRef = React.useRef<KLineDataStore>(new KLineDataStore(16384))
  const viewportRef = React.useRef<KLineViewportState>({
    rightOffset: 3,
    barSpacing: 10,
  })
  const l2ColumnsRef = React.useRef<Float32Array[]>([])
  const userDrawingsRef = React.useRef<KLineUserDrawing[]>([])

  // Cached Indicator Evaluations & Patterns
  const mainFormulaResultRef = React.useRef<FormulaEvaluationResult | null>(null)
  const subFormulaResultRef = React.useRef<FormulaEvaluationResult | null>(null)
  const patternsRef = React.useRef<DetectedCandlestickPattern[]>([])

  // DOM & 3-Layer Canvas Refs + WebGPU Canvas Ref
  const plotContainerRef = React.useRef<HTMLDivElement | null>(null)
  const bgCanvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const seriesCanvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const webgpuCanvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const hudCanvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const webgpuPipelineRef = React.useRef<WebGPUKLinePipeline | null>(null)

  // Interaction State Refs
  const pointerRef = React.useRef<{
    isDragging: boolean
    lastX: number
    cursorX: number | null
    cursorY: number | null
    hoveredBarIndex: number | null
  }>({
    isDragging: false,
    lastX: 0,
    cursorX: null,
    cursorY: null,
    hoveredBarIndex: null,
  })

  // Dirty flags for zero-overhead rAF loop
  const dirtyFlagsRef = React.useRef<{
    bgDirty: boolean
    seriesDirty: boolean
    hudDirty: boolean
    tickCount: number
    frameCounter: number
    lastFpsCalcTime: number
  }>({
    bgDirty: true,
    seriesDirty: true,
    hudDirty: true,
    tickCount: 0,
    frameCounter: 0,
    lastFpsCalcTime: performance.now(),
  })

  // Recompute indicator formulas & patterns on current store
  const recomputeAnalytics = React.useCallback(() => {
    const store = storeRef.current
    if (store.length === 0) return

    const view = store.getColumnarView()

    // 1. Main pane formula
    let activeMainFormula = ''
    if (mainOverlayKey === 'MA') activeMainFormula = BUILTIN_INDICATOR_FORMULAS.MA.formula
    else if (mainOverlayKey === 'EMA') activeMainFormula = BUILTIN_INDICATOR_FORMULAS.EMA.formula
    else if (mainOverlayKey === 'BOLL') activeMainFormula = BUILTIN_INDICATOR_FORMULAS.BOLL.formula
    else if (mainOverlayKey === 'CUSTOM') activeMainFormula = customFormula.trim()

    if (activeMainFormula) {
      const res = evaluateFormula(activeMainFormula, view)
      mainFormulaResultRef.current = res
      setShowFormulaWarnings(res.futureFunctionWarnings)
      setShowFormulaDiagnostics(res.diagnostics)
    } else {
      mainFormulaResultRef.current = null
      setShowFormulaWarnings([])
      setShowFormulaDiagnostics([])
    }

    // 2. Sub-pane formula
    if (subPaneKind === 'MACD') {
      subFormulaResultRef.current = evaluateFormula(BUILTIN_INDICATOR_FORMULAS.MACD.formula, view)
    } else if (subPaneKind === 'KDJ') {
      subFormulaResultRef.current = evaluateFormula(BUILTIN_INDICATOR_FORMULAS.KDJ.formula, view)
    } else if (subPaneKind === 'RSI') {
      subFormulaResultRef.current = evaluateFormula(BUILTIN_INDICATOR_FORMULAS.RSI.formula, view)
    } else {
      subFormulaResultRef.current = null
    }

    // 3. Price action patterns
    const barsSnapshot = store.toBars()
    patternsRef.current = detectCandlestickPatterns(barsSnapshot)

    // 4. Cognitive Digest
    const digest = encodeKLineCognitiveDigest(barsSnapshot, {
      symbol: resolvedSpec.symbol,
      name: resolvedSpec.name,
      interval: activeInterval,
    })
    setCognitiveDigest(digest)
    onCognitiveDigestChange?.(digest)
  }, [
    mainOverlayKey,
    customFormula,
    subPaneKind,
    resolvedSpec.symbol,
    resolvedSpec.name,
    activeInterval,
    onCognitiveDigestChange,
  ])

  // Initialize / Load Bars into Columnar Store
  React.useEffect(() => {
    let cancelled = false
    const store = storeRef.current

    async function initData() {
      let initialBars: KLineBar[] = []
      if (resolvedSpec.bars && resolvedSpec.bars.length > 0) {
        initialBars = resolvedSpec.bars
      } else {
        try {
          const res = await marketFeed.fetchHistory({
            symbol: resolvedSpec.symbol,
            interval: activeInterval,
            limit: 240,
          })
          initialBars = res.bars
        } catch {
          initialBars = generateSyntheticKLineBars(resolvedSpec.symbol, 240, activeInterval)
        }
      }

      if (cancelled) return
      store.setBars(initialBars)

      // Seed initial L2 depth columns
      const rng = new FastPrng(initialBars.length + 101)
      const lastIdx = Math.max(0, store.length - 1)
      const lastClose = store.close[lastIdx] ?? 100
      const minP = lastClose * 0.96
      const maxP = lastClose * 1.04
      const seededCols: Float32Array[] = []
      for (let i = 0; i < 64; i++) {
        seededCols.push(generateL2DepthColumn(lastClose, minP, maxP, rng, 64))
      }
      l2ColumnsRef.current = seededCols

      viewportRef.current.rightOffset = 3
      recomputeAnalytics()

      if (webgpuPipelineRef.current) {
        webgpuPipelineRef.current.syncStoreToGpu(store)
      }

      dirtyFlagsRef.current.bgDirty = true
      dirtyFlagsRef.current.seriesDirty = true
      dirtyFlagsRef.current.hudDirty = true
    }

    initData()
    return () => {
      cancelled = true
    }
  }, [resolvedSpec.symbol, resolvedSpec.bars, activeInterval, marketFeed, recomputeAnalytics])

  // Recompute analytics when user toggles indicators/formulas
  React.useEffect(() => {
    recomputeAnalytics()
    dirtyFlagsRef.current.bgDirty = true
    dirtyFlagsRef.current.seriesDirty = true
    dirtyFlagsRef.current.hudDirty = true
  }, [
    recomputeAnalytics,
    colorScheme,
    priceScaleMode,
    enableKdeViolin,
    enableLobHeatmap,
    enableOfiColoring,
    showVolumeProfile,
  ])

  // Subscribe to Live Market Feed when `isLiveStreaming` is active
  React.useEffect(() => {
    if (!isLiveStreaming) return

    const periodMs = intervalToPeriodMs(activeInterval)
    let tickCounter = 0

    const unsubscribe = marketFeed.subscribeLive(
      {
        symbol: resolvedSpec.symbol,
        interval: activeInterval,
      },
      (event) => {
        const store = storeRef.current
        if (store.length === 0) return

        if (event.type === 'tick') {
          store.applyTick(event.tick, periodMs)
        } else if (event.type === 'bar') {
          store.upsertBar(event.bar)
        } else if (event.type === 'l2_column') {
          const cols = l2ColumnsRef.current
          if (cols.length >= 96) cols.shift()
          cols.push(event.column)
        }

        tickCounter++
        dirtyFlagsRef.current.tickCount++

        if (webgpuPipelineRef.current) {
          webgpuPipelineRef.current.syncStoreToGpu(store)
        }

        // Recompute indicators every 6 ticks to keep CPU near zero while keeping formulas live
        if (tickCounter % 6 === 0) {
          recomputeAnalytics()
        }

        dirtyFlagsRef.current.bgDirty = true
        dirtyFlagsRef.current.seriesDirty = true
        dirtyFlagsRef.current.hudDirty = true
      }
    )

    return () => {
      unsubscribe()
    }
  }, [isLiveStreaming, resolvedSpec.symbol, activeInterval, marketFeed, recomputeAnalytics])

  // Initialize WebGPU Pipeline if supported and requested
  React.useEffect(() => {
    let mounted = true
    const gpuCanvas = webgpuCanvasRef.current
    if (!gpuCanvas || preferredBackend === 'canvas2d') {
      setActiveBackend('canvas2d')
      return
    }

    const pipeline = new WebGPUKLinePipeline()
    pipeline.initialize(gpuCanvas).then((ok: boolean) => {
      if (!mounted) {
        pipeline.dispose()
        return
      }
      setWebgpuAvailable(ok)
      if (ok && (preferredBackend === 'webgpu' || preferredBackend === 'auto')) {
        webgpuPipelineRef.current = pipeline
        pipeline.syncStoreToGpu(storeRef.current)
        setActiveBackend('webgpu')
        dirtyFlagsRef.current.bgDirty = true
        dirtyFlagsRef.current.seriesDirty = true
        dirtyFlagsRef.current.hudDirty = true
      } else {
        pipeline.dispose()
        setActiveBackend('canvas2d')
      }
    })

    return () => {
      mounted = false
      pipeline.dispose()
      webgpuPipelineRef.current = null
    }
  }, [preferredBackend])

  // Main Parity-Locked Render Loop (ResizeObserver + requestAnimationFrame)
  React.useEffect(() => {
    const container = plotContainerRef.current
    const bgCanvas = bgCanvasRef.current
    const seriesCanvas = seriesCanvasRef.current
    const hudCanvas = hudCanvasRef.current
    const gpuCanvas = webgpuCanvasRef.current
    if (!container || !bgCanvas || !seriesCanvas || !hudCanvas || !gpuCanvas) return

    let rafId = 0
    let cssWidth = container.clientWidth || 720
    let cssHeight = container.clientHeight || 380
    let dpr = Math.max(1, window.devicePixelRatio || 1)

    const syncCanvasDimensions = () => {
      dpr = Math.max(1, window.devicePixelRatio || 1)
      cssWidth = Math.max(240, container.clientWidth)
      cssHeight = Math.max(200, container.clientHeight)
      const physW = Math.max(1, Math.round(cssWidth * dpr))
      const physH = Math.max(1, Math.round(cssHeight * dpr))

      for (const c of [bgCanvas, seriesCanvas, hudCanvas, gpuCanvas]) {
        if (c.width !== physW || c.height !== physH) {
          c.width = physW
          c.height = physH
        }
      }
      dirtyFlagsRef.current.bgDirty = true
      dirtyFlagsRef.current.seriesDirty = true
      dirtyFlagsRef.current.hudDirty = true
    }

    syncCanvasDimensions()

    const ro = new ResizeObserver(() => {
      syncCanvasDimensions()
    })
    ro.observe(container)

    const hasSubPane = subPaneKind !== 'VOL' && subPaneKind !== 'VPIN'

    const renderTick = (now: number) => {
      const flags = dirtyFlagsRef.current
      flags.frameCounter++
      if (now - flags.lastFpsCalcTime >= 1000) {
        const elapsed = now - flags.lastFpsCalcTime
        const currentFps = Math.min(120, Math.round((flags.frameCounter * 1000) / elapsed))
        setFpsMetrics((prev) => ({
          fps: currentFps,
          frameTimeMs: prev.frameTimeMs,
          tickCount: flags.tickCount,
        }))
        flags.frameCounter = 0
        flags.lastFpsCalcTime = now
      }

      const store = storeRef.current
      if (store.length > 0 && (flags.bgDirty || flags.seriesDirty || flags.hudDirty)) {
        const t0 = performance.now()
        const layout = computeKLinePaneLayout(cssWidth, cssHeight, dpr, hasSubPane)
        const plotWidthCss = layout.plotRightPx / dpr
        const vp = viewportRef.current

        const visRange = computeVisibleLogicalRange(store.length, plotWidthCss, vp)
        const startIdx = visRange.from
        const endIdx = visRange.to

        const minMax = store.segmentTree.query(startIdx, endIdx)
        let minP = minMax.min
        let maxP = minMax.max

        // Expand Y-axis bounds slightly if main formula lines exceed candle highs/lows
        if (mainFormulaResultRef.current) {
          for (const line of mainFormulaResultRef.current.lines) {
            if (line.nodraw) continue
            for (let i = startIdx; i <= endIdx; i++) {
              const v = line.data[i]
              if (v !== undefined && Number.isFinite(v) && v > 0) {
                if (v < minP) minP = v
                if (v > maxP) maxP = v
              }
            }
          }
        }

        const span = Math.max(1e-4, maxP - minP)
        const minPrice = minP - span * 0.08
        const maxPrice = maxP + span * 0.1

        let maxVolume = 1
        for (let i = startIdx; i <= endIdx; i++) {
          const v = store.volume[i] ?? 0
          if (v > maxVolume) maxVolume = v
        }

        const pState = pointerRef.current
        let hoveredBarIdx: number | null = store.length - 1
        if (pState.cursorX !== null && pState.cursorX <= plotWidthCss) {
          const rawIdx = xToLogicalIndex(pState.cursorX, store.length, plotWidthCss, vp)
          hoveredBarIdx = Math.max(0, Math.min(store.length - 1, rawIdx))
        }
        pState.hoveredBarIndex = hoveredBarIdx

        const paintCtx: KLinePaintContext = {
          store,
          viewport: vp,
          layout,
          minPrice,
          maxPrice,
          maxVolume,
          visibleStartIdx: startIdx,
          visibleEndIdx: endIdx,
          priceScaleMode,
          colorScheme,
          kdeCandle: enableKdeViolin,
          ofiColoring: enableOfiColoring,
          showVolumeProfile,
          showOrderBookHeatmap: enableLobHeatmap,
          showVpin: subPaneKind === 'VPIN',
          l2Columns: l2ColumnsRef.current,
          mainFormulaResult: mainFormulaResultRef.current,
          subFormulaResult: subFormulaResultRef.current,
          annotations: resolvedSpec.annotations,
          drawings: userDrawingsRef.current,
          activeDrawingDraft: null,
          patterns: patternsRef.current,
          cursorCss:
            pState.cursorX !== null && pState.cursorY !== null
              ? { x: pState.cursorX, y: pState.cursorY }
              : null,
          hoveredBarIdx,
          symbol: resolvedSpec.symbol,
          symbolName: resolvedSpec.name,
          interval: activeInterval,
          engineLabel:
            activeBackend === 'webgpu'
              ? 'WebGPU WGSL (ds_float + SDF + Oklab)'
              : 'Canvas2D 3-Layer Parity',
          skipMainCandles: activeBackend === 'webgpu' && Boolean(webgpuPipelineRef.current),
        }

        // Layer 0: Background Grid, Axes, L2 Heatmap, Volume Profile POC
        if (flags.bgDirty) {
          const bgCtx = bgCanvas.getContext('2d')
          if (bgCtx) {
            paintBackgroundLayer(bgCtx, paintCtx)
          }
          flags.bgDirty = false
        }

        // Layer 1: Series (Candles, Volume, VPIN, Formulas, Sub-Pane) + WebGPU Pass
        if (flags.seriesDirty) {
          const seriesCtx = seriesCanvas.getContext('2d')
          if (seriesCtx) {
            paintSeriesLayer(seriesCtx, paintCtx)
          }

          const gpuPipeline = webgpuPipelineRef.current
          if (activeBackend === 'webgpu' && gpuPipeline) {
            gpuPipeline.renderFrame(store, {
              canvasWidth: layout.widthPx,
              canvasHeight: layout.heightPx,
              mainPaneTop: layout.mainTopPx,
              mainPaneHeight: layout.mainHeightPx,
              rightOffsetIdx: vp.rightOffset,
              barSpacing: vp.barSpacing * dpr,
              rightEdgeX: layout.plotRightPx,
              minPrice,
              maxPrice,
              maxVolume,
              kdeCandle: enableKdeViolin,
              colorScheme,
              ofiColoring: enableOfiColoring,
              visibleStartIdx: startIdx,
              visibleEndIdx: endIdx,
              toroidalOffset: (flags.tickCount % 64) / 64,
              heatmapOpacity: enableLobHeatmap ? 0.35 : 0,
            })
          }

          flags.seriesDirty = false
        }

        // Layer 2: HUD, Crosshair, Live Price Line, Semantic Annotations
        if (flags.hudDirty) {
          const hudCtx = hudCanvas.getContext('2d')
          if (hudCtx) {
            paintInteractionLayer(hudCtx, paintCtx)
          }

          if (hoveredBarIdx !== null && hoveredBarIdx >= 0 && hoveredBarIdx < store.length) {
            const idx = hoveredBarIdx
            const curClose = store.close[idx] ?? 0
            const prevClose = idx > 0 ? (store.close[idx - 1] ?? curClose) : (store.open[idx] ?? curClose)
            const changePct = prevClose !== 0 ? ((curClose - prevClose) / prevClose) * 100 : 0
            setHoveredInfo({
              timeLabel: store.timeLabels[idx] || `#${idx}`,
              open: store.open[idx] ?? 0,
              high: store.high[idx] ?? 0,
              low: store.low[idx] ?? 0,
              close: curClose,
              volume: store.volume[idx] ?? 0,
              changePct,
              ofi: store.ofi[idx] ?? 0,
              vpin: store.vpin[idx] ?? 0,
            })
          }

          flags.hudDirty = false
        }

        const dt = performance.now() - t0
        setFpsMetrics((prev) => ({
          ...prev,
          frameTimeMs: Number(dt.toFixed(2)),
          tickCount: flags.tickCount,
        }))
      }

      rafId = requestAnimationFrame(renderTick)
    }

    rafId = requestAnimationFrame(renderTick)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [
    activeBackend,
    colorScheme,
    priceScaleMode,
    enableKdeViolin,
    enableLobHeatmap,
    enableOfiColoring,
    showVolumeProfile,
    subPaneKind,
    resolvedSpec.annotations,
    resolvedSpec.symbol,
    resolvedSpec.name,
    activeInterval,
  ])

  // Mouse Wheel Focal-Point Anchor Zoom
  const handleWheel = React.useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const container = plotContainerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const cursorX = Math.max(0, e.clientX - rect.left)
    const plotWidthCss = Math.max(80, rect.width - 68)
    const vp = viewportRef.current

    const zoomFactor = e.deltaY < 0 ? 1.14 : 0.88
    const nextZoom = computeKLineAnchorZoom(vp, vp.barSpacing * zoomFactor, cursorX, plotWidthCss)
    vp.barSpacing = nextZoom.barSpacing
    vp.rightOffset = nextZoom.rightOffset

    dirtyFlagsRef.current.bgDirty = true
    dirtyFlagsRef.current.seriesDirty = true
    dirtyFlagsRef.current.hudDirty = true
  }, [])

  // Pointer Panning & Crosshair Tracking
  const handlePointerDown = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    pointerRef.current.isDragging = true
    pointerRef.current.lastX = e.clientX
  }, [])

  const handlePointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const pState = pointerRef.current

    pState.cursorX = x
    pState.cursorY = y

    if (pState.isDragging) {
      const dx = e.clientX - pState.lastX
      pState.lastX = e.clientX
      const vp = viewportRef.current
      vp.rightOffset -= dx / vp.barSpacing
      dirtyFlagsRef.current.bgDirty = true
      dirtyFlagsRef.current.seriesDirty = true
    }

    dirtyFlagsRef.current.hudDirty = true
  }, [])

  const handlePointerUp = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerRef.current.isDragging) {
      pointerRef.current.isDragging = false
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // Ignore if not captured
      }
    }
  }, [])

  const handlePointerLeave = React.useCallback(() => {
    pointerRef.current.isDragging = false
    pointerRef.current.cursorX = null
    pointerRef.current.cursorY = null
    dirtyFlagsRef.current.hudDirty = true
  }, [])

  const handleResetViewport = React.useCallback(() => {
    viewportRef.current.barSpacing = 10
    viewportRef.current.rightOffset = 3
    dirtyFlagsRef.current.bgDirty = true
    dirtyFlagsRef.current.seriesDirty = true
    dirtyFlagsRef.current.hudDirty = true
  }, [])

  return (
    <div
      className={cn(
        'flex flex-col w-full rounded-xl overflow-hidden border border-slate-800/80 bg-[#090d16] text-slate-200 select-none shadow-lg',
        className
      )}
    >
      {/* Top Quant Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 py-1.5 border-b border-slate-800/80 bg-[#0d1320]/90 text-[11px]">
        {/* Left: Symbol, Interval & Overlay Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-mono font-semibold text-slate-100">{resolvedSpec.symbol}</span>
            {resolvedSpec.name && resolvedSpec.name !== resolvedSpec.symbol && (
              <span className="text-slate-400 truncate max-w-[100px]">{resolvedSpec.name}</span>
            )}
          </div>

          {/* Interval Pills */}
          <div className="flex items-center rounded-md bg-slate-900/90 p-0.5 border border-slate-800/70">
            {['1m', '5m', '15m', '1h', '1d'].map((intv) => (
              <button
                key={intv}
                type="button"
                onClick={() => setActiveInterval(intv)}
                className={cn(
                  'px-1.5 py-0.5 rounded font-mono text-[10px] transition-colors',
                  activeInterval === intv
                    ? 'bg-sky-500/20 text-sky-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {intv}
              </button>
            ))}
          </div>

          {/* Main Overlay Indicator Selector */}
          <div className="flex items-center rounded-md bg-slate-900/90 p-0.5 border border-slate-800/70">
            {MAIN_OVERLAY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setMainOverlayKey(opt.id)
                  if (opt.id === 'MA') setCustomFormula(BUILTIN_INDICATOR_FORMULAS.MA.formula)
                  else if (opt.id === 'EMA') setCustomFormula(BUILTIN_INDICATOR_FORMULAS.EMA.formula)
                  else if (opt.id === 'BOLL') setCustomFormula(BUILTIN_INDICATOR_FORMULAS.BOLL.formula)
                }}
                className={cn(
                  'px-1.5 py-0.5 rounded font-mono text-[10px] transition-colors',
                  mainOverlayKey === opt.id
                    ? 'bg-indigo-500/25 text-indigo-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sub-pane Indicator Selector */}
          <div className="flex items-center rounded-md bg-slate-900/90 p-0.5 border border-slate-800/70">
            {SUBPANE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSubPaneKind(opt.id)}
                className={cn(
                  'px-1.5 py-0.5 rounded font-mono text-[10px] transition-colors',
                  subPaneKind === opt.id
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Microstructure Toggles, Backend Switch & Live Stream Toggle */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Microstructure Toggles */}
          {!compact && (
            <div className="flex items-center gap-1 rounded-md bg-slate-900/90 p-0.5 border border-slate-800/70">
              <button
                type="button"
                onClick={() => setEnableKdeViolin((v) => !v)}
                title="KDE-SDF 核密度小提琴K线 (成交量筹码分布形态)"
                className={cn(
                  'flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-colors',
                  enableKdeViolin
                    ? 'bg-purple-500/25 text-purple-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                <Layers className="w-3 h-3" />
                <span>KDE小提琴</span>
              </button>

              <button
                type="button"
                onClick={() => setEnableOfiColoring((v) => !v)}
                title="Oklab 感知均匀色彩空间 OFI 订单流不平衡着色"
                className={cn(
                  'flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-colors',
                  enableOfiColoring
                    ? 'bg-teal-500/25 text-teal-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                <Flame className="w-3 h-3" />
                <span>OFI着色</span>
              </button>

              <button
                type="button"
                onClick={() => setEnableLobHeatmap((v) => !v)}
                title="环形纹理缓冲区 (Toroidal L2 Order Book Heatmap)"
                className={cn(
                  'flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-colors',
                  enableLobHeatmap
                    ? 'bg-blue-500/25 text-blue-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                <Activity className="w-3 h-3" />
                <span>L2热力簿</span>
              </button>

              <button
                type="button"
                onClick={() => setShowVolumeProfile((v) => !v)}
                title="KDE 筹码峰分布横截面 (POC / VAH / VAL)"
                className={cn(
                  'flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-colors',
                  showVolumeProfile
                    ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                <Eye className="w-3 h-3" />
                <span>筹码峰</span>
              </button>
            </div>
          )}

          {/* Scale Mode & Color Scheme */}
          <div className="flex items-center gap-1 rounded-md bg-slate-900/90 p-0.5 border border-slate-800/70">
            <button
              type="button"
              onClick={() =>
                setPriceScaleMode((m) =>
                  m === 'linear' ? 'logarithmic' : m === 'logarithmic' ? 'percentage' : 'linear'
                )
              }
              title="切换纵轴坐标模式 (线性 / 对数 / 百分比)"
              className="px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-300 hover:bg-slate-800"
            >
              {priceScaleMode === 'linear' ? 'LIN' : priceScaleMode === 'logarithmic' ? 'LOG' : 'PCT%'}
            </button>

            <button
              type="button"
              onClick={() =>
                setColorScheme((c) => (c === 'cn-red-up' ? 'intl-green-up' : 'cn-red-up'))
              }
              title="切换红涨绿跌 (A股) / 绿涨红跌 (国际)"
              className="px-1.5 py-0.5 rounded text-[10px] text-slate-300 hover:bg-slate-800"
            >
              {colorScheme === 'cn-red-up' ? '红涨' : '绿涨'}
            </button>
          </div>

          {/* Formula Editor & AI Cognitive Digest Toggle */}
          <button
            type="button"
            onClick={() => setShowFormulaEditor((v) => !v)}
            title="打开通达信 / Pine 向量化公式编译器"
            className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] transition-colors',
              showFormulaEditor
                ? 'border-sky-500/50 bg-sky-500/20 text-sky-300'
                : 'border-slate-800 bg-slate-900/90 text-slate-400 hover:text-slate-200'
            )}
          >
            <Code2 className="w-3 h-3" />
            <span>公式</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAiDigestPanel((v) => !v)}
            title="查看 AI 认知编码器输出的 K 线结构化语义摘要"
            className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] transition-colors',
              showAiDigestPanel
                ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
                : 'border-slate-800 bg-slate-900/90 text-slate-400 hover:text-slate-200'
            )}
          >
            <Sparkles className="w-3 h-3" />
            <span>AI认知流</span>
          </button>

          {/* Live Tick Stream Toggle */}
          <button
            type="button"
            onClick={() => setIsLiveStreaming((v) => !v)}
            title="开启/暂停低延迟实时网络 Tick 推流"
            className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-md border font-mono text-[10px] transition-colors',
              isLiveStreaming
                ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                : 'border-slate-800 bg-slate-900/90 text-slate-400 hover:text-slate-200'
            )}
          >
            {isLiveStreaming ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isLiveStreaming ? 'LIVE' : 'STATIC'}</span>
          </button>

          {/* Backend Toggle (WebGPU / Canvas2D) */}
          {webgpuAvailable && (
            <button
              type="button"
              onClick={() => {
                setActiveBackend((b) => (b === 'webgpu' ? 'canvas2d' : 'webgpu'))
                dirtyFlagsRef.current.bgDirty = true
                dirtyFlagsRef.current.seriesDirty = true
                dirtyFlagsRef.current.hudDirty = true
              }}
              title="切换 WebGPU 全驻留管线 / Canvas2D 三层锁步管线"
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded-md border font-mono text-[10px] transition-colors',
                activeBackend === 'webgpu'
                  ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-300'
                  : 'border-slate-800 bg-slate-900/90 text-slate-400'
              )}
            >
              <Cpu className="w-3 h-3" />
              <span>{activeBackend === 'webgpu' ? 'WebGPU' : '2D'}</span>
            </button>
          )}

          {/* Reset Zoom */}
          <button
            type="button"
            onClick={handleResetViewport}
            title="重置视口缩放"
            className="p-1 rounded-md border border-slate-800 bg-slate-900/90 text-slate-400 hover:text-slate-200"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Zero-Reflow OHLCV + Microstructure Inspection Header */}
      {hoveredInfo && (
        <div className="flex flex-wrap items-center gap-3 px-3 py-1 border-b border-slate-800/60 bg-[#080c14] font-mono text-[10px] text-slate-300">
          <span className="text-slate-400">{hoveredInfo.timeLabel}</span>
          <span>
            O: <strong className="text-slate-100">{hoveredInfo.open.toFixed(2)}</strong>
          </span>
          <span>
            H: <strong className="text-slate-100">{hoveredInfo.high.toFixed(2)}</strong>
          </span>
          <span>
            L: <strong className="text-slate-100">{hoveredInfo.low.toFixed(2)}</strong>
          </span>
          <span>
            C: <strong className="text-slate-100">{hoveredInfo.close.toFixed(2)}</strong>
          </span>
          <span
            className={
              hoveredInfo.changePct >= 0
                ? colorScheme === 'cn-red-up'
                  ? 'text-rose-400 font-semibold'
                  : 'text-emerald-400 font-semibold'
                : colorScheme === 'cn-red-up'
                  ? 'text-emerald-400 font-semibold'
                  : 'text-rose-400 font-semibold'
            }
          >
            {hoveredInfo.changePct >= 0 ? '+' : ''}
            {hoveredInfo.changePct.toFixed(2)}%
          </span>
          <span className="text-slate-400">VOL: {Math.round(hoveredInfo.volume).toLocaleString()}</span>
          <span className="text-teal-300">OFI: {hoveredInfo.ofi.toFixed(1)}</span>
          <span className="text-amber-300">VPIN: {(hoveredInfo.vpin * 100).toFixed(1)}%</span>
        </div>
      )}

      {/* Optional Pine/TDX Vectorized Formula Editor Drawer */}
      {showFormulaEditor && (
        <div className="flex flex-col gap-1.5 px-3 py-2 border-b border-slate-800/80 bg-[#0b101b] text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-300">
              通达信 / Pine 向量化公式引擎 (支持 MA / EMA / SMA / HHV / LLV / STD / REF / CROSS / RSI / COLORSTICK)
            </span>
            {showFormulaWarnings.length > 0 && (
              <span className="text-[11px] text-amber-400 font-mono">
                ⚠️ 未来函数告警: {showFormulaWarnings.join(', ')}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <textarea
              value={customFormula}
              onChange={(e) => {
                setCustomFormula(e.target.value)
                setMainOverlayKey('CUSTOM')
              }}
              rows={2}
              spellCheck={false}
              className="flex-1 rounded-md bg-slate-950/90 border border-slate-800 px-2.5 py-1.5 font-mono text-[11px] text-emerald-300 focus:outline-none focus:border-sky-500/60"
              placeholder="例如: MA5:MA(C,5); MA20:MA(C,20); DRAWICON(CROSS(MA5,MA20),L,1);"
            />
          </div>
          {showFormulaDiagnostics.length > 0 && (
            <div className="text-[11px] text-rose-400 font-mono">{showFormulaDiagnostics.join(' | ')}</div>
          )}
        </div>
      )}

      {/* Optional AI Cognitive Digest Drawer */}
      {showAiDigestPanel && cognitiveDigest && (
        <div className="px-3 py-2 border-b border-slate-800/80 bg-[#0c1220] text-[11px] text-slate-300 max-h-40 overflow-y-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              大模型双工认知编码摘要 (Cognitive Price-Action & Microstructure Digest)
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              POC: {cognitiveDigest.volumeProfile.pocPrice.toFixed(2)} | VAH:{' '}
              {cognitiveDigest.volumeProfile.valueAreaHigh.toFixed(2)} | VAL:{' '}
              {cognitiveDigest.volumeProfile.valueAreaLow.toFixed(2)}
            </span>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-[10px] text-slate-300 leading-relaxed bg-slate-950/70 p-2 rounded border border-slate-800/80">
            {cognitiveDigest.llmPromptMarkdown}
          </pre>
        </div>
      )}

      {/* Multi-Layer Parity-Locked Canvas Stage */}
      <div
        ref={plotContainerRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        style={{ height: `${height}px` }}
        className="relative w-full overflow-hidden cursor-crosshair touch-none"
      >
        {/* Layer 0: Background Grid, Axes, L2 Toroidal Heatmap & KDE Volume Profile */}
        <canvas
          ref={bgCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Layer 1: Data Series Layer (Candles, Volume, Formulas, Sub-Pane) */}
        <canvas
          ref={seriesCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Tier-2 WebGPU Hardware Pipeline Overlay (Main Plot GPU-Resident Candles & KDE-SDF Violins) */}
        <canvas
          ref={webgpuCanvasRef}
          className={cn(
            'absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-150',
            activeBackend === 'webgpu' ? 'opacity-95' : 'opacity-0'
          )}
        />

        {/* Layer 2: Zero-Reflow HUD, Crosshair, Annotations & Interactive Drawings */}
        <canvas
          ref={hudCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>

      {/* Bottom Telemetry Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 border-t border-slate-800/80 bg-[#080b12] font-mono text-[10px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span
              className={cn(
                'inline-block w-1.5 h-1.5 rounded-full',
                isLiveStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              )}
            />
            {isLiveStreaming ? '实时低延迟行情流已挂载' : '静态快照模式'}
          </span>
          <span>样本数: {storeRef.current.length} Bars</span>
          {cognitiveDigest && (
            <span className="text-slate-300 hidden sm:inline">
              趋势: {cognitiveDigest.trendStructure} | VPIN毒性:{' '}
              {(cognitiveDigest.microstructureSummary.latestVpin * 100).toFixed(1)}%
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span>
            帧耗时: <strong className="text-emerald-400">{fpsMetrics.frameTimeMs}ms</strong>
          </span>
          <span>
            FPS: <strong className="text-sky-400">{fpsMetrics.fps}</strong>
          </span>
          {isLiveStreaming && <span>Ticks: {fpsMetrics.tickCount}</span>}
        </div>
      </div>
    </div>
  )
}
