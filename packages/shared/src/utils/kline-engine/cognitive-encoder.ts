/**
 * Profer KLine Engine — K 线形态规则识别器与大模型认知编码器 (KLine Cognitive Encoder)
 *
 * 解决痛点：
 * 大语言模型（LLM）直接阅读数千个原始 OHLCV 浮点数时会出现严重的“数字失明”，
 * 难以准确捕捉关键波峰波谷、筹码堆积峰（POC）、经典蜡烛形态（十字星、锤头、吞没、晨星）
 * 以及订单流毒性（VPIN）异动。
 *
 * 本模块遵循参考资料一「把形态语法做成独立于绘图层的 rules 模块」与参考资料二「KDE 筹码密度 + VPIN/OFI」，
 * 自动将盘面状态蒸馏为高信息密度的结构化摘要与伴学/投研解盘 Prompt。
 */

import { formatKLineTimestamp } from './columnar-store'
import type {
  DetectedCandlestickPattern,
  KLineBar,
  KLineCognitiveDigest,
} from './types'

/**
 * 扫描 K 线序列并提取经典几何形态（十字星、锤头线、射击之星、看涨/看跌吞没、早晨/黄昏之星、跳空缺口、天量高潮）
 */
export function detectCandlestickPatterns(bars: readonly KLineBar[]): DetectedCandlestickPattern[] {
  const n = bars.length
  if (n === 0) return []
  const patterns: DetectedCandlestickPattern[] = []

  // 计算平均实体与平均成交量用于自适应波动率阈值
  let sumRange = 0
  let sumVol = 0
  for (let i = 0; i < n; i++) {
    sumRange += Math.max(1e-9, bars[i]!.high - bars[i]!.low)
    sumVol += bars[i]!.volume
  }
  const avgRange = sumRange / n
  const avgVol = sumVol / n

  for (let i = 0; i < n; i++) {
    const b = bars[i]!
    const range = Math.max(1e-9, b.high - b.low)
    const body = Math.abs(b.close - b.open)
    const upperWick = b.high - Math.max(b.open, b.close)
    const lowerWick = Math.min(b.open, b.close) - b.low
    const bodyRatio = body / range

    // 1. 十字星 (Doji)
    if (bodyRatio <= 0.08 && range >= avgRange * 0.4) {
      patterns.push({
        index: i,
        timeMs: b.timeMs,
        patternCode: 'DOJI',
        name: '十字星 (Doji)',
        direction: 'neutral',
        price: b.close,
        confidence: 0.85,
        description: `第 #${i} 根 K 线开收盘高度收敛（实体占比 ${(bodyRatio * 100).toFixed(1)}%），多空分歧加剧`,
      })
    }

    // 2. 锤头线 (Hammer) — 下影线 >= 2 倍实体，上影线极短
    if (lowerWick >= body * 2.0 && lowerWick >= range * 0.58 && upperWick <= range * 0.18 && range >= avgRange * 0.5) {
      patterns.push({
        index: i,
        timeMs: b.timeMs,
        patternCode: 'HAMMER',
        name: '锤头探底线 (Hammer)',
        direction: 'bullish',
        price: b.low,
        confidence: 0.88,
        description: `第 #${i} 根 K 线在 ${b.low.toFixed(2)} 处拉出长下影承接盘（下影占比 ${(lowerWick / range * 100).toFixed(0)}%）`,
      })
    }

    // 3. 射击之星 (Shooting Star) — 上影线 >= 2 倍实体，下影线极短
    if (upperWick >= body * 2.0 && upperWick >= range * 0.58 && lowerWick <= range * 0.18 && range >= avgRange * 0.5) {
      patterns.push({
        index: i,
        timeMs: b.timeMs,
        patternCode: 'SHOOTING_STAR',
        name: '射击之星 (Shooting Star)',
        direction: 'bearish',
        price: b.high,
        confidence: 0.86,
        description: `第 #${i} 根 K 线冲高至 ${b.high.toFixed(2)} 后遭强抛压回落`,
      })
    }

    if (i >= 1) {
      const prev = bars[i - 1]!
      const prevBody = Math.abs(prev.close - prev.open)

      // 4. 看涨吞没 (Bullish Engulfing)
      if (
        prev.close < prev.open &&
        b.close > b.open &&
        b.close >= prev.open &&
        b.open <= prev.close &&
        body > prevBody * 1.08 &&
        prevBody > avgRange * 0.25
      ) {
        patterns.push({
          index: i,
          timeMs: b.timeMs,
          patternCode: 'BULLISH_ENGULFING',
          name: '看涨吞没 (Bullish Engulfing)',
          direction: 'bullish',
          price: b.close,
          confidence: 0.92,
          description: `第 #${i} 根阳线实体完全吞没前一根阴线，多头强力反包`,
        })
      }

      // 5. 看跌吞没 (Bearish Engulfing)
      if (
        prev.close > prev.open &&
        b.close < b.open &&
        b.open >= prev.close &&
        b.close <= prev.open &&
        body > prevBody * 1.08 &&
        prevBody > avgRange * 0.25
      ) {
        patterns.push({
          index: i,
          timeMs: b.timeMs,
          patternCode: 'BEARISH_ENGULFING',
          name: '看跌吞没 (Bearish Engulfing)',
          direction: 'bearish',
          price: b.close,
          confidence: 0.92,
          description: `第 #${i} 根阴线实体完全吞没前一根阳线，空头反扑压制`,
        })
      }

      // 6. 向上跳空缺口 (Gap Up)
      if (b.low > prev.high + avgRange * 0.08) {
        patterns.push({
          index: i,
          timeMs: b.timeMs,
          patternCode: 'GAP_UP',
          name: '向上跳空缺口 (Gap Up)',
          direction: 'bullish',
          price: b.low,
          confidence: 0.95,
          description: `第 #${i} 根 K 线形成 [${prev.high.toFixed(2)} ~ ${b.low.toFixed(2)}] 向上突破缺口`,
        })
      }

      // 7. 向下跳空缺口 (Gap Down)
      if (b.high < prev.low - avgRange * 0.08) {
        patterns.push({
          index: i,
          timeMs: b.timeMs,
          patternCode: 'GAP_DOWN',
          name: '向下跳空缺口 (Gap Down)',
          direction: 'bearish',
          price: b.high,
          confidence: 0.95,
          description: `第 #${i} 根 K 线形成 [${b.high.toFixed(2)} ~ ${prev.low.toFixed(2)}] 向下跳空缺口`,
        })
      }
    }

    // 8. 天量异常放大 (Volume Climax)
    if (avgVol > 0 && b.volume >= avgVol * 2.6) {
      patterns.push({
        index: i,
        timeMs: b.timeMs,
        patternCode: 'VOLUME_CLIMAX',
        name: '天量异动 (Volume Climax)',
        direction: b.close >= b.open ? 'bullish' : 'bearish',
        price: b.close,
        confidence: 0.89,
        description: `第 #${i} 根 K 线成交量达均值 ${(b.volume / avgVol).toFixed(1)} 倍，主力资金剧烈换手`,
      })
    }
  }

  return patterns
}

/**
 * 基于高斯核密度估计 (Gaussian KDE) 计算价格域上的筹码分布 (Volume Profile)：
 * 返回每个价格分箱的归一化密度数组、POC（筹码控制点价格）及 70% 价值区间 [VAL, VAH]。
 */
export function computeKdeVolumeProfile(
  bars: readonly KLineBar[],
  binsCount = 48,
): {
  densities: Float32Array
  minPrice: number
  maxPrice: number
  pocPrice: number
  valueAreaLow: number
  valueAreaHigh: number
} {
  const n = bars.length
  const densities = new Float32Array(Math.max(8, binsCount))
  if (n === 0) {
    return { densities, minPrice: 0, maxPrice: 1, pocPrice: 0, valueAreaLow: 0, valueAreaHigh: 0 }
  }

  let minP = Number.POSITIVE_INFINITY
  let maxP = Number.NEGATIVE_INFINITY
  for (let i = 0; i < n; i++) {
    if (bars[i]!.low < minP) minP = bars[i]!.low
    if (bars[i]!.high > maxP) maxP = bars[i]!.high
  }
  const span = Math.max(1e-6, maxP - minP)
  const bandwidth = span / Math.max(8, Math.sqrt(binsCount) * 1.8)
  const inv2SigmaSq = 1 / (2 * bandwidth * bandwidth)

  for (let bIdx = 0; bIdx < densities.length; bIdx++) {
    const p = minP + ((bIdx + 0.5) / densities.length) * span
    let acc = 0
    for (let i = 0; i < n; i++) {
      const bar = bars[i]!
      const vwap = (bar.open + bar.high + bar.low + bar.close) * 0.25
      const diff = p - vwap
      const weight = Math.exp(-(diff * diff) * inv2SigmaSq)
      acc += Math.max(1, bar.volume) * weight
    }
    densities[bIdx] = acc
  }

  let maxDensity = 0
  let pocBin = 0
  let totalDensity = 0
  for (let bIdx = 0; bIdx < densities.length; bIdx++) {
    const d = densities[bIdx]!
    totalDensity += d
    if (d > maxDensity) {
      maxDensity = d
      pocBin = bIdx
    }
  }

  if (maxDensity > 0) {
    for (let bIdx = 0; bIdx < densities.length; bIdx++) {
      densities[bIdx] = densities[bIdx]! / maxDensity
    }
  }

  // 从 POC 向两侧扩展直至覆盖 70% 的成交量密度（Value Area 70%）
  let lowBin = pocBin
  let highBin = pocBin
  let covered = maxDensity
  const targetCover = (totalDensity / Math.max(1e-9, maxDensity)) * 0.7
  while (covered < targetCover && (lowBin > 0 || highBin < densities.length - 1)) {
    const leftVal = lowBin > 0 ? densities[lowBin - 1]! : -1
    const rightVal = highBin < densities.length - 1 ? densities[highBin + 1]! : -1
    if (leftVal >= rightVal && lowBin > 0) {
      lowBin--
      covered += densities[lowBin]!
    } else if (highBin < densities.length - 1) {
      highBin++
      covered += densities[highBin]!
    } else {
      break
    }
  }

  const binToPrice = (idx: number) => minP + ((idx + 0.5) / densities.length) * span
  return {
    densities,
    minPrice: minP,
    maxPrice: maxP,
    pocPrice: binToPrice(pocBin),
    valueAreaLow: binToPrice(lowBin),
    valueAreaHigh: binToPrice(highBin),
  }
}

/**
 * 构建大模型 K 线认知摘要（KLine Cognitive Encoder）
 */
export function encodeKLineCognitiveDigest(
  bars: readonly KLineBar[],
  options: { symbol?: string; name?: string; interval?: string } = {},
): KLineCognitiveDigest {
  const symbol = options.symbol ?? 'INDEX'
  const interval = options.interval ?? '1D'
  const n = bars.length
  if (n === 0) {
    return {
      symbol,
      name: options.name,
      interval,
      barCount: 0,
      latestClose: 0,
      periodChangePercent: 0,
      highPoint: { index: 0, price: 0, timeLabel: '' },
      lowPoint: { index: 0, price: 0, timeLabel: '' },
      atr14: 0,
      volumeProfile: { pocPrice: 0, valueAreaHigh: 0, valueAreaLow: 0 },
      trendStructure: '无数据',
      patterns: [],
      microstructureSummary: { meanOfi: 0, latestVpin: 0, toxicityLevel: 'low', icebergDetectedCount: 0 },
      llmPromptMarkdown: '',
    }
  }

  const first = bars[0]!
  const last = bars[n - 1]!
  const periodChangePercent = ((last.close - first.open) / Math.max(1e-9, first.open)) * 100

  let highIdx = 0
  let lowIdx = 0
  let trSum = 0
  let ofiSum = 0
  let icebergCount = 0

  for (let i = 0; i < n; i++) {
    const b = bars[i]!
    if (b.high > bars[highIdx]!.high) highIdx = i
    if (b.low < bars[lowIdx]!.low) lowIdx = i
    const prevClose = i > 0 ? bars[i - 1]!.close : b.open
    const tr = Math.max(b.high - b.low, Math.abs(b.high - prevClose), Math.abs(b.low - prevClose))
    if (i >= Math.max(0, n - 14)) trSum += tr
    ofiSum += b.ofi ?? 0
    if ((b.icebergVolume ?? 0) > 0) icebergCount++
  }

  const atr14 = trSum / Math.min(14, n)
  const vp = computeKdeVolumeProfile(bars, 40)
  const allPatterns = detectCandlestickPatterns(bars)
  const recentPatterns = allPatterns.slice(-6)

  // 计算简单均线结构 (MA5, MA10, MA20)
  const tailMean = (k: number) => {
    const cnt = Math.min(k, n)
    let s = 0
    for (let i = n - cnt; i < n; i++) s += bars[i]!.close
    return s / cnt
  }
  const ma5 = tailMean(5)
  const ma10 = tailMean(10)
  const ma20 = tailMean(20)

  const trendStructure =
    ma5 > ma10 && ma10 > ma20
      ? `多头排列（MA5=${ma5.toFixed(2)} > MA10=${ma10.toFixed(2)} > MA20=${ma20.toFixed(2)}）`
      : ma5 < ma10 && ma10 < ma20
        ? `空头排列（MA5=${ma5.toFixed(2)} < MA10=${ma10.toFixed(2)} < MA20=${ma20.toFixed(2)}）`
        : `震荡收敛交织（MA5=${ma5.toFixed(2)}, MA10=${ma10.toFixed(2)}, MA20=${ma20.toFixed(2)}）`

  const latestVpin = last.vpin ?? 0.25
  const toxicityLevel: KLineCognitiveDigest['microstructureSummary']['toxicityLevel'] =
    latestVpin >= 0.75 ? 'critical' : latestVpin >= 0.55 ? 'elevated' : latestVpin >= 0.35 ? 'moderate' : 'low'

  const tailBars = bars.slice(-10)
  const tailCsv = tailBars
    .map(
      (b) =>
        `${b.timeLabel ?? formatKLineTimestamp(b.timeMs)},${b.open.toFixed(2)},${b.high.toFixed(2)},${b.low.toFixed(2)},${b.close.toFixed(2)},${Math.round(b.volume)}`,
    )
    .join('\n')

  const patternLines =
    recentPatterns.length > 0
      ? recentPatterns.map((p) => `- [${p.direction.toUpperCase()}] ${p.name}: ${p.description}`).join('\n')
      : '- 近期未触发极端反转蜡烛形态'

  const llmPromptMarkdown = [
    `请基于以下由 **Profer KLine Cognitive Encoder** 提炼的高精度盘面结构化特征，对 **${symbol}${options.name ? ` (${options.name})` : ''} [${interval}]** 进行专业级量化与微观结构解盘，并在回复中使用 \`\`\`kline 代码块输出带关键支撑阻力标注与指标公式的图示：`,
    '',
    '### 1. 宏观趋势与极值拓扑',
    `- 样本量：${n} 根 K 线 | 最新收盘价：**${last.close.toFixed(2)}** | 区间涨跌幅：**${periodChangePercent >= 0 ? '+' : ''}${periodChangePercent.toFixed(2)}%**`,
    `- 区间最高极值：${bars[highIdx]!.high.toFixed(2)} (逻辑索引 #${highIdx}, ${bars[highIdx]!.timeLabel ?? formatKLineTimestamp(bars[highIdx]!.timeMs)})`,
    `- 区间最低极值：${bars[lowIdx]!.low.toFixed(2)} (逻辑索引 #${lowIdx}, ${bars[lowIdx]!.timeLabel ?? formatKLineTimestamp(bars[lowIdx]!.timeMs)})`,
    `- 均线多空排列：${trendStructure} | ATR(14) 真实波幅：${atr14.toFixed(2)}`,
    '',
    '### 2. KDE 筹码密度分布 (Volume Profile) 与微观结构毒性',
    `- **POC (筹码控制峰)**：${vp.pocPrice.toFixed(2)} | **70% 价值区 [VAL, VAH]**：[${vp.valueAreaLow.toFixed(2)}, ${vp.valueAreaHigh.toFixed(2)}]`,
    `- **VPIN (订单流毒性)**：${latestVpin.toFixed(3)} (${toxicityLevel.toUpperCase()}) | **平均 OFI 净失衡**：${(ofiSum / n).toFixed(1)}`,
    '',
    '### 3. 规则层识别出的关键 K 线形态',
    patternLines,
    '',
    '### 4. 最近 10 根 K 线紧凑序列 (time,open,high,low,close,volume)',
    '```csv',
    tailCsv,
    '```',
  ].join('\n')

  return {
    symbol,
    name: options.name,
    interval,
    barCount: n,
    latestClose: last.close,
    periodChangePercent,
    highPoint: {
      index: highIdx,
      price: bars[highIdx]!.high,
      timeLabel: bars[highIdx]!.timeLabel ?? formatKLineTimestamp(bars[highIdx]!.timeMs),
    },
    lowPoint: {
      index: lowIdx,
      price: bars[lowIdx]!.low,
      timeLabel: bars[lowIdx]!.timeLabel ?? formatKLineTimestamp(bars[lowIdx]!.timeMs),
    },
    atr14,
    volumeProfile: {
      pocPrice: vp.pocPrice,
      valueAreaHigh: vp.valueAreaHigh,
      valueAreaLow: vp.valueAreaLow,
    },
    trendStructure,
    patterns: recentPatterns,
    microstructureSummary: {
      meanOfi: ofiSum / n,
      latestVpin,
      toxicityLevel,
      icebergDetectedCount: icebergCount,
    },
    llmPromptMarkdown,
  }
}
