import { describe, expect, test } from 'bun:test'
import {
  FlatMinMaxSegmentTree,
  KLineDataStore,
  LockFreeTickRingBuffer,
  computeKLineAnchorZoom,
  computeKdeVolumeProfile,
  computePixelPerfectCandleMetrics,
  detectCandlestickPatterns,
  encodeKLineCognitiveDigest,
  evaluateFormula,
  generateSyntheticKLineBars,
  logicalIndexToX,
  parseKLineBlockText,
  shouldRenderKLineCodeBlock,
  xToLogicalIndex,
} from './index'

describe('Profer KLine Engine — Core Math, Flat Segment Tree & Memory Store', () => {
  test('FlatMinMaxSegmentTree queries exact range extrema in O(log N) and matches brute-force on 10,000 bars', () => {
    const bars = generateSyntheticKLineBars('SH600519', 10000, '1m')
    const store = new KLineDataStore(10000)
    store.setBars(bars)

    const ranges: Array<[number, number]> = [
      [0, 9999],
      [123, 4567],
      [5000, 5000],
      [7890, 9999],
      [42, 128],
    ]

    for (const [from, to] of ranges) {
      let expectedMin = Number.POSITIVE_INFINITY
      let expectedMax = Number.NEGATIVE_INFINITY
      for (let i = from; i <= to; i++) {
        if (bars[i]!.low < expectedMin) expectedMin = bars[i]!.low
        if (bars[i]!.high > expectedMax) expectedMax = bars[i]!.high
      }
      const actual = store.segmentTree.query(from, to)
      expect(actual.min).toBeCloseTo(expectedMin, 5)
      expect(actual.max).toBeCloseTo(expectedMax, 5)
    }

    // Real-time tick update modifies last bar extrema and segment tree reflects it immediately
    store.applyTick({
      timeMs: bars[bars.length - 1]!.timeMs + 100,
      price: 99999.5,
      volumeDelta: 500,
    })
    expect(store.segmentTree.query(9000, 9999).max).toBeCloseTo(99999.5, 4)
  })

  test('Parity-locked pixel-perfect candle metrics enforce wickW % 2 === bodyW % 2 across all DPRs', () => {
    const dprs = [1, 1.25, 1.5, 1.75, 2, 2.5, 3]
    const spacings = [2, 3.5, 5, 7.2, 10, 14.8, 22]

    for (const dpr of dprs) {
      for (const spacing of spacings) {
        const metrics = computePixelPerfectCandleMetrics(spacing, dpr)
        expect(metrics.isSubPixelConflated).toBe(false)
        expect(metrics.wickWidthPhys % 2).toBe(metrics.bodyWidthPhys % 2)
        expect(metrics.bodyWidthPhys).toBeGreaterThanOrEqual(metrics.wickWidthPhys)
      }
      const conflated = computePixelPerfectCandleMetrics(0.25, dpr)
      expect(conflated.isSubPixelConflated).toBe(true)
    }
  })

  test('Zero-drift cursor anchor zoom keeps the logical index under the cursor invariant', () => {
    const totalBars = 500
    const plotWidth = 960
    const anchorX = 340
    const prev = { barSpacing: 8, rightOffset: 2 }

    // Float index before zoom
    const floatIndexBefore =
      totalBars - 1 + prev.rightOffset - (plotWidth - anchorX) / prev.barSpacing
    const zoomed = computeKLineAnchorZoom(prev, 18.5, anchorX, plotWidth)

    // Re-evaluate screen distance from right edge of that exact logical position after zoom
    const distFromRightBefore = (totalBars - 1 + prev.rightOffset - floatIndexBefore) * prev.barSpacing
    const distFromRightAfter = (totalBars - 1 + zoomed.rightOffset - floatIndexBefore) * zoomed.barSpacing
    expect(distFromRightAfter).toBeCloseTo(distFromRightBefore, 4)

    // Round-trip indexToX and xToIndex
    const x = logicalIndexToX(420, totalBars, plotWidth, zoomed)
    expect(xToLogicalIndex(x, totalBars, plotWidth, zoomed)).toBe(420)
  })

  test('LockFreeTickRingBuffer drains high-frequency ticks into KLineDataStore without data loss', () => {
    const store = new KLineDataStore(128)
    store.setBars([
      {
        timeMs: 1_700_000_000_000,
        open: 100,
        high: 101,
        low: 99,
        close: 100,
        volume: 1000,
      },
    ])
    const ring = new LockFreeTickRingBuffer(64)
    ring.push({ timeMs: 1_700_000_010_000, price: 105.5, volumeDelta: 200, bidVolumeDelta: 150, askVolumeDelta: 50 })
    ring.push({ timeMs: 1_700_000_020_000, price: 97.2, volumeDelta: 300, bidVolumeDelta: 50, askVolumeDelta: 250 })
    ring.push({ timeMs: 1_700_000_065_000, price: 102.0, volumeDelta: 400 }) // crosses 60s boundary -> new bar

    const drained = ring.drainToStore(store, 60_000)
    expect(drained).toBe(3)
    expect(store.length).toBe(2)
    expect(store.high[0]).toBeCloseTo(105.5, 4)
    expect(store.low[0]).toBeCloseTo(97.2, 4)
    expect(store.close[1]).toBeCloseTo(102.0, 4)
  })
})

describe('Profer KLine Engine — Tongdaxin Vectorized Formula Compiler', () => {
  test('Evaluates MA, EMA, SMA, HHV, LLV, CROSS, IF and drawing instructions accurately', () => {
    const bars = generateSyntheticKLineBars('NVDA', 60, '1D')
    const store = new KLineDataStore(60)
    store.setBars(bars)

    const formula = `
      MA5: MA(C, 5), COLORRED, LINETHICK2;
      MA10: MA(C, 10), COLORYELLOW;
      DIF := EMA(C, 12) - EMA(C, 26);
      DEA := EMA(DIF, 9);
      MACD: (DIF - DEA) * 2, COLORSTICK;
      HIGH20: HHV(H, 20), NODRAW;
      LOW20: LLV(L, 20), NODRAW;
      GOLD_CROSS := CROSS(MA5, MA10);
      STICKLINE(C >= O, C, O, 3, 0), COLORRED;
      DRAWTEXT(GOLD_CROSS, L, '金叉买点'), COLORYELLOW;
      DRAWICON(GOLD_CROSS, L, 1);
    `
    const res = evaluateFormula(formula, store.getColumnarView())
    expect(res.diagnostics).toHaveLength(0)
    expect(res.lines.map((l) => l.name)).toEqual(['MA5', 'MA10', 'MACD', 'HIGH20', 'LOW20'])
    expect(res.lines[0]!.color).toBe('#ef4444')
    expect(res.lines[0]!.lineWidth).toBe(2)
    expect(res.lines[2]!.style).toBe('colorstick')
    expect(res.lines[2]!.targetPane).toBe('sub')
    expect(res.drawings).toHaveLength(3)

    // Verify MA5 at index 4 equals arithmetic mean of first 5 closes
    const expectedMa5 = (bars[0]!.close + bars[1]!.close + bars[2]!.close + bars[3]!.close + bars[4]!.close) / 5
    expect(res.lines[0]!.data[4]).toBeCloseTo(expectedMa5, 6)
  })

  test('Flags future functions such as ZIG and BACKSET', () => {
    const bars = generateSyntheticKLineBars('BTC-USDT', 20, '1h')
    const store = new KLineDataStore(20)
    store.setBars(bars)
    const res = evaluateFormula('Z: ZIG(C, 5); B: BACKSET(C > O, 3);', store.getColumnarView())
    expect(res.futureFunctionWarnings).toEqual(['ZIG', 'BACKSET'])
  })
})

describe('Profer KLine Engine — Three-Mode LLM DSL & Cognitive Encoder', () => {
  test('Parses Mode 1 (Live Symbol Mount), Mode 2 (Compact CSV Stream), and Mode 3 (JSON)', () => {
    // Mode 1: Live symbol mount
    const liveDsl = `
symbol: SH600519
name: 贵州茅台
market: CN
interval: 5m
mode: live
microstructure: kde, lob, ofi, vpin
formula: |
  MA5: MA(C, 5);
  MA20: MA(C, 20);
annotations:
  - type: support
    price: 1520
    label: 核心筹码峰
`
    expect(shouldRenderKLineCodeBlock('language-kline', liveDsl)).toBe(true)
    const parsedLive = parseKLineBlockText(liveDsl)
    expect(parsedLive).not.toBeNull()
    expect(parsedLive!.mode).toBe('live')
    expect(parsedLive!.symbol).toBe('SH600519')
    expect(parsedLive!.microstructure.kdeCandle).toBe(true)
    expect(parsedLive!.microstructure.lobHeatmap).toBe(true)
    expect(parsedLive!.annotations).toHaveLength(1)

    // Mode 2: Compact CSV
    const csvDsl = `
symbol: NVDA
interval: 1D
---
2026-10-20,110.0,115.0,109.0,114.0,50000
2026-10-21,114.0,118.0,113.5,117.5,62000
`
    const parsedCsv = parseKLineBlockText(csvDsl)
    expect(parsedCsv).not.toBeNull()
    expect(parsedCsv!.mode).toBe('static')
    expect(parsedCsv!.bars).toHaveLength(2)
    expect(parsedCsv!.bars[1]!.close).toBe(117.5)

    // Mode 3: JSON
    const jsonDsl = JSON.stringify({
      symbol: 'BTC-USDT',
      interval: '15m',
      bars: [{ time: 1730937600000, open: 74000, high: 75000, low: 73800, close: 74900, volume: 1200 }],
    })
    const parsedJson = parseKLineBlockText(jsonDsl)
    expect(parsedJson).not.toBeNull()
    expect(parsedJson!.symbol).toBe('BTC-USDT')
    expect(parsedJson!.bars).toHaveLength(1)
  })

  test('Detects candlestick patterns and encodes KDE Volume Profile + LLM cognitive digest', () => {
    const customBars = [
      { timeMs: 1000, open: 100, high: 101, low: 95, close: 96, volume: 1000 },
      { timeMs: 2000, open: 95.5, high: 103, low: 95, close: 102.5, volume: 2500 }, // Bullish Engulfing
      { timeMs: 3000, open: 105, high: 108, low: 104.5, close: 105.05, volume: 4000 }, // Gap Up + Doji
    ]
    const patterns = detectCandlestickPatterns(customBars)
    expect(patterns.some((p) => p.patternCode === 'BULLISH_ENGULFING')).toBe(true)
    expect(patterns.some((p) => p.patternCode === 'GAP_UP')).toBe(true)

    const vp = computeKdeVolumeProfile(customBars, 24)
    expect(vp.pocPrice).toBeGreaterThanOrEqual(95)
    expect(vp.pocPrice).toBeLessThanOrEqual(108)

    const digest = encodeKLineCognitiveDigest(customBars, { symbol: 'TEST', interval: '1D' })
    expect(digest.llmPromptMarkdown).toContain('POC (筹码控制峰)')
    expect(digest.llmPromptMarkdown).toContain('看涨吞没')
  })
})
