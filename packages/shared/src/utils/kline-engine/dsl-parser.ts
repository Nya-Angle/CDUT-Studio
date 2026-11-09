/**
 * Profer KLine Engine — 大模型 ```kline 三态混合 DSL 解析器与代码块识别器
 *
 * 支持三种同构输入模式，兼顾最低 Token 开销、流式逐行增量生长与容错能力：
 * 1. 模式一（Live 实时股票代码挂载模式）：
 *    仅包含 symbol / market / interval / mode: live / formula / annotations 头部声明，
 *    无需内联历史 K 线，由客户端 KLineDataFeedProvider 实时拉取并订阅高频 Tick 流。
 * 2. 模式二（Compact CSV/Pipe 流式内联模式）：
 *    头部为 YAML-lite 键值指令，`---` 分隔符（或直接以日期/时间戳行起始）后为紧凑列式数据：
 *    `time,open,high,low,close,volume[,ofi,vpin]`。
 *    大模型流式生成时每输出一个换行符，即可立即增量解析出一根新 K 线上屏！
 * 3. 模式三（JSON 结构化容错模式）：
 *    支持 `{ symbol, interval, bars: [...] }` 或直接 `[ { time, open, high, low, close, volume } ]`。
 */

import type {
  KLineAnnotation,
  KLineBar,
  KLineColorScheme,
  KLineDSLSpec,
  KLineMicrostructureConfig,
  KLinePriceScaleMode,
  KLineSubPaneKind,
} from './types'

const KLINE_LANGUAGE_CLASS_PATTERN = /(?:^|\s)language-(?:kline|kline-live|candlestick|ohlc|stock-kline|stock-chart|stock)(?:\s|$)/i
const GENERIC_LANGUAGE_CLASS_PATTERN = /(?:^|\s)language-(\S+)/i

/** 判断代码块语言标识是否为 K 线专用语言 */
export function isKLineLanguage(language: string): boolean {
  return /^(?:kline|kline-live|candlestick|ohlc|stock-kline|stock-chart|stock)$/i.test(language.trim())
}

/**
 * 判定 Markdown 代码块是否应交由 KLineBlock 独立渲染器模块渲染。
 *
 * 命中规则：
 * 1. 显式标注 `language-kline` / `language-candlestick` / `language-ohlc` / `language-stock`；
 * 2. 未标注其他冲突语言（或标注了 yaml/text）且首行/前几行显式包含 `kline` 关键字或 `symbol:` + (`interval:` / `mode: live` / `ohlcv:`)。
 */
export function shouldRenderKLineCodeBlock(className: string | undefined, code: string): boolean {
  if (className && KLINE_LANGUAGE_CLASS_PATTERN.test(className)) return true
  if (className && GENERIC_LANGUAGE_CLASS_PATTERN.test(className)) return false

  const trimmed = code.trimStart()
  if (!trimmed) return false
  const headLines = trimmed.split(/\r?\n/, 6).map((l) => l.trim())
  if (/^kline\b/i.test(headLines[0] ?? '')) return true
  const hasSymbol = headLines.some((l) => /^symbol\s*:/i.test(l))
  const hasKLineMeta = headLines.some((l) => /^(?:interval|timeframe|mode|formula|subpane|bars)\s*:/i.test(l))
  return hasSymbol && hasKLineMeta
}

function parseTimestamp(raw: unknown, fallbackIndex: number): { timeMs: number; timeLabel?: string } {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    // 自动区分秒级时间戳（10位）与毫秒级时间戳（13位）
    const timeMs = raw > 1e9 && raw < 1e11 ? raw * 1000 : raw
    return { timeMs }
  }
  if (typeof raw === 'string') {
    const clean = raw.trim().replace(/^["']|["']$/g, '')
    if (/^\d{10,13}$/.test(clean)) {
      const n = Number(clean)
      return { timeMs: clean.length === 10 ? n * 1000 : n }
    }
    const parsed = Date.parse(clean.includes('T') ? clean : clean.replace(' ', 'T') + (clean.includes('Z') ? '' : 'Z'))
    if (Number.isFinite(parsed)) {
      return { timeMs: parsed, timeLabel: clean }
    }
    return { timeMs: 1730937600000 + fallbackIndex * 60_000, timeLabel: clean }
  }
  return { timeMs: 1730937600000 + fallbackIndex * 60_000 }
}

function normalizeBarObject(raw: unknown, index: number): KLineBar | null {
  if (!raw || typeof raw !== 'object') return null
  if (Array.isArray(raw)) {
    // 兼容数组点格式: [time, open, high, low, close, volume]
    if (raw.length < 5) return null
    const { timeMs, timeLabel } = parseTimestamp(raw[0], index)
    const open = Number(raw[1])
    const high = Number(raw[2])
    const low = Number(raw[3])
    const close = Number(raw[4])
    const volume = raw.length >= 6 ? Number(raw[5]) : 0
    if (![open, high, low, close].every(Number.isFinite)) return null
    return {
      timeMs,
      timeLabel,
      open,
      high: Math.max(high, open, close),
      low: Math.min(low, open, close),
      close,
      volume: Number.isFinite(volume) && volume >= 0 ? volume : 0,
    }
  }

  const obj = raw as Record<string, unknown>
  const timeVal = obj.timeMs ?? obj.time ?? obj.timestamp ?? obj.date ?? obj.t
  const { timeMs, timeLabel } = parseTimestamp(timeVal, index)
  const open = Number(obj.open ?? obj.o)
  const high = Number(obj.high ?? obj.h)
  const low = Number(obj.low ?? obj.l)
  const close = Number(obj.close ?? obj.c)
  const volume = Number(obj.volume ?? obj.vol ?? obj.v ?? 0)
  if (![open, high, low, close].every(Number.isFinite)) return null

  return {
    timeMs,
    timeLabel: typeof obj.timeLabel === 'string' ? obj.timeLabel : timeLabel,
    open,
    high: Math.max(high, open, close),
    low: Math.min(low, open, close),
    close,
    volume: Number.isFinite(volume) && volume >= 0 ? volume : 0,
    ofi: typeof obj.ofi === 'number' ? obj.ofi : undefined,
    vpin: typeof obj.vpin === 'number' ? obj.vpin : undefined,
    icebergVolume: typeof obj.icebergVolume === 'number' ? obj.icebergVolume : undefined,
  }
}

function parseSubPanes(raw: string | string[] | undefined): KLineSubPaneKind[] {
  if (!raw) return ['VOL', 'MACD']
  const list = Array.isArray(raw) ? raw : raw.split(/[,;\s]+/)
  const out: KLineSubPaneKind[] = []
  for (const item of list) {
    const upper = String(item).trim().toUpperCase()
    if (upper === 'NONE' || upper === 'OFF') return []
    if (upper === 'VOL' || upper === 'VOLUME') out.push('VOL')
    else if (upper === 'MACD') out.push('MACD')
    else if (upper === 'KDJ') out.push('KDJ')
    else if (upper === 'RSI') out.push('RSI')
    else if (upper === 'VPIN' || upper === 'TOXICITY') out.push('VPIN')
  }
  return out.length > 0 ? out : ['VOL']
}

function parseMicrostructureFlags(raw: unknown): KLineMicrostructureConfig {
  if (!raw) return {}
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>
    return {
      kdeCandle: Boolean(obj.kdeCandle ?? obj.kde),
      lobHeatmap: Boolean(obj.lobHeatmap ?? obj.lob),
      ofiColoring: Boolean(obj.ofiColoring ?? obj.ofi),
      vpinRibbon: Boolean(obj.vpinRibbon ?? obj.vpin),
      icebergGlyphs: Boolean(obj.icebergGlyphs ?? obj.iceberg),
    }
  }
  const text = String(raw).toLowerCase()
  return {
    kdeCandle: text.includes('kde') || text.includes('violin') || text.includes('all'),
    lobHeatmap: text.includes('lob') || text.includes('heatmap') || text.includes('depth') || text.includes('all'),
    ofiColoring: text.includes('ofi') || text.includes('oklab') || text.includes('all'),
    vpinRibbon: text.includes('vpin') || text.includes('toxicity') || text.includes('all'),
    icebergGlyphs: text.includes('iceberg') || text.includes('all'),
  }
}

function parseCompactBarLine(line: string, index: number): KLineBar | null {
  const trimmed = line.trim().replace(/^-\s*/, '')
  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) return null
  // 跳过表头行 `time,open,high,low,close,volume`
  if (/^(?:time|date|timestamp)\b/i.test(trimmed)) return null

  const parts = trimmed.includes('|')
    ? trimmed.split('|').map((s) => s.trim())
    : trimmed.includes(',')
      ? trimmed.split(',').map((s) => s.trim())
      : trimmed.split(/\s+/)

  if (parts.length < 5) return null
  const { timeMs, timeLabel } = parseTimestamp(parts[0], index)
  const open = Number(parts[1])
  const high = Number(parts[2])
  const low = Number(parts[3])
  const close = Number(parts[4])
  const volume = parts.length >= 6 ? Number(parts[5]) : 1000
  const ofi = parts.length >= 7 ? Number(parts[6]) : undefined
  const vpin = parts.length >= 8 ? Number(parts[7]) : undefined

  if (![open, high, low, close].every(Number.isFinite)) return null

  return {
    timeMs,
    timeLabel,
    open,
    high: Math.max(high, open, close),
    low: Math.min(low, open, close),
    close,
    volume: Number.isFinite(volume) && volume >= 0 ? volume : 0,
    ofi: Number.isFinite(ofi) ? ofi : undefined,
    vpin: Number.isFinite(vpin) ? vpin : undefined,
  }
}

function parseAnnotationItem(raw: unknown): KLineAnnotation | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  const rawType = String(obj.type ?? (obj.side ? 'signal' : 'tag')).toLowerCase()
  const type: KLineAnnotation['type'] =
    rawType === 'hline' || rawType === 'support' || rawType === 'resistance'
      ? 'hline'
      : rawType === 'trendline'
        ? 'trendline'
        : rawType === 'zone'
          ? 'zone'
          : rawType === 'signal' || obj.side
            ? 'signal'
            : 'tag'

  const defaultColor =
    rawType === 'support' || obj.side === 'buy'
      ? '#ef4444'
      : rawType === 'resistance' || obj.side === 'sell'
        ? '#10b981'
        : undefined

  return {
    type,
    index: typeof obj.index === 'number' ? obj.index : undefined,
    time: typeof obj.time === 'string' || typeof obj.time === 'number' ? obj.time : undefined,
    price: typeof obj.price === 'number' ? obj.price : undefined,
    toIndex: typeof obj.toIndex === 'number' ? obj.toIndex : undefined,
    toPrice: typeof obj.toPrice === 'number' ? obj.toPrice : undefined,
    side: obj.side === 'buy' || obj.side === 'sell' ? obj.side : undefined,
    label: typeof obj.label === 'string' ? obj.label : typeof obj.text === 'string' ? obj.text : undefined,
    color: typeof obj.color === 'string' ? obj.color : defaultColor,
  }
}

const DEFAULT_FORMULA = 'MA5: MA(C, 5); MA10: MA(C, 10); MA20: MA(C, 20);'

/**
 * 解析对话流或任意调用方传入的 ```kline 源码为规范化的 KLineDSLSpec。
 *
 * 具备极强的流式半截容错能力：
 * 当大模型正在流式输出 Compact CSV 或 Live 声明但尚未闭合 ``` 围栏时，
 * 也能立即返回已完成的 Bar 列表与元数据，实现流式实时生长渲染。
 */
export function parseKLineBlockText(rawText: string): KLineDSLSpec | null {
  if (!rawText) return null
  let source = rawText.replace(/\r\n?/g, '\n').trim()
  const fenceMatch = source.match(/^```[a-zA-Z-]*\n([\s\S]*?)(?:\n?```)?$/)
  if (fenceMatch && fenceMatch[1] !== undefined) {
    source = fenceMatch[1].trim()
  }
  if (!source) return null

  // ===== 路径 1：JSON 结构化形态 =====
  if (source.startsWith('{') || source.startsWith('[')) {
    try {
      const parsed = JSON.parse(source) as unknown
      if (Array.isArray(parsed)) {
        const bars = parsed.map((item, idx) => normalizeBarObject(item, idx)).filter((b): b is KLineBar => b !== null)
        if (bars.length === 0) return null
        return {
          mode: 'static',
          symbol: 'CUSTOM',
          interval: '1D',
          colorScheme: 'cn-red-up',
          priceScaleMode: 'linear',
          formula: DEFAULT_FORMULA,
          subPanes: ['VOL', 'MACD'],
          microstructure: {},
          annotations: [],
          bars,
        }
      }
      if (parsed && typeof parsed === 'object') {
        const obj = parsed as Record<string, unknown>
        const rawBars = Array.isArray(obj.bars) ? obj.bars : Array.isArray(obj.data) ? obj.data : []
        const bars = rawBars.map((item, idx) => normalizeBarObject(item, idx)).filter((b): b is KLineBar => b !== null)
        const symbol = typeof obj.symbol === 'string' && obj.symbol.trim() ? obj.symbol.trim().toUpperCase() : 'UNKNOWN'
        const isLive = obj.mode === 'live' || (bars.length === 0 && symbol !== 'UNKNOWN')
        if (!isLive && bars.length === 0) return null

        const rawAnn = Array.isArray(obj.annotations) ? obj.annotations : []
        return {
          mode: isLive ? 'live' : 'static',
          symbol,
          name: typeof obj.name === 'string' ? obj.name : typeof obj.title === 'string' ? obj.title : undefined,
          market: typeof obj.market === 'string' ? obj.market : undefined,
          interval: typeof obj.interval === 'string' ? obj.interval : '1D',
          colorScheme: obj.theme === 'intl-green-up' || obj.colorScheme === 'intl-green-up' ? 'intl-green-up' : 'cn-red-up',
          priceScaleMode:
            obj.scale === 'logarithmic' || obj.priceScaleMode === 'logarithmic'
              ? 'logarithmic'
              : obj.scale === 'percentage'
                ? 'percentage'
                : 'linear',
          formula: typeof obj.formula === 'string' ? obj.formula : typeof obj.indicators === 'string' ? obj.indicators : DEFAULT_FORMULA,
          subPanes: parseSubPanes(obj.subPanes as string | string[] | undefined),
          microstructure: parseMicrostructureFlags(obj.microstructure),
          annotations: rawAnn.map(parseAnnotationItem).filter((a): a is KLineAnnotation => a !== null),
          bars,
        }
      }
    } catch {
      // JSON 在流式生成期间可能尚未闭合，不直接抛弃，尝试走下方逐行容错提取
    }
  }

  // ===== 路径 2：YAML-Lite 头部指令 + Compact CSV/Pipe 混合 DSL =====
  const lines = source.split('\n')
  let symbol = ''
  let name: string | undefined
  let market: string | undefined
  let interval = '1D'
  let mode: 'live' | 'static' | undefined
  let colorScheme: KLineColorScheme = 'cn-red-up'
  let priceScaleMode: KLinePriceScaleMode = 'linear'
  const formulaLines: string[] = []
  let subPanes: KLineSubPaneKind[] = ['VOL', 'MACD']
  let microstructure: KLineMicrostructureConfig = {}
  const annotations: KLineAnnotation[] = []
  const bars: KLineBar[] = []

  let inFormulaBlock = false
  let inAnnotationsBlock = false
  let inDataSection = false
  let pendingAnnotation: Record<string, unknown> | null = null

  const flushPendingAnnotation = () => {
    if (pendingAnnotation) {
      const parsedAnn = parseAnnotationItem(pendingAnnotation)
      if (parsedAnn) annotations.push(parsedAnn)
      pendingAnnotation = null
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]!
    const trimmed = rawLine.trim()
    if (!trimmed) continue

    if (i === 0 && /^kline\b/i.test(trimmed) && !trimmed.includes(':')) {
      continue
    }

    if (trimmed === '---' || /^bars\s*:\s*\|?$/i.test(trimmed) || /^data\s*:\s*\|?$/i.test(trimmed)) {
      flushPendingAnnotation()
      inFormulaBlock = false
      inAnnotationsBlock = false
      inDataSection = true
      continue
    }

    if (!inDataSection) {
      // 检查是否直接遇到了紧凑数据行（以日期或时间戳打头且带逗号/竖线）
      const maybeBar = parseCompactBarLine(trimmed, bars.length)
      if (maybeBar && (/^\d{4}[-/]\d{1,2}/.test(trimmed) || /^\d{10,13}[,|]/.test(trimmed))) {
        flushPendingAnnotation()
        inFormulaBlock = false
        inAnnotationsBlock = false
        inDataSection = true
        bars.push(maybeBar)
        continue
      }

      // 处理缩进的 formula 多行块
      if (inFormulaBlock) {
        if (
          (/^[ \t]+/.test(rawLine) || /^[A-Za-z0-9_]+\s*:?=/.test(trimmed)) &&
          !/^(?:symbol|name|market|interval|mode|theme|scale|subpane|subpanes|microstructure|annotations|bars|data)\s*:/i.test(trimmed)
        ) {
          formulaLines.push(trimmed)
          continue
        }
        inFormulaBlock = false
      }

      // 处理缩进的 annotations 块
      if (inAnnotationsBlock && (/^[ \t]+/.test(rawLine) || trimmed.startsWith('-'))) {
        if (trimmed.startsWith('-')) {
          flushPendingAnnotation()
          const itemBody = trimmed.slice(1).trim()
          if (itemBody.startsWith('{') && itemBody.endsWith('}')) {
            try {
              const jsonLike = itemBody.replace(/([a-zA-Z_]\w*)\s*:/g, '"$1":').replace(/'/g, '"')
              const parsed = JSON.parse(jsonLike)
              const ann = parseAnnotationItem(parsed)
              if (ann) annotations.push(ann)
            } catch {
              // 忽略格式未闭合的单行标注
            }
          } else {
            pendingAnnotation = {}
            const kv = itemBody.match(/^([a-zA-Z_]\w*)\s*:\s*(.+)$/)
            if (kv) {
              const k = kv[1]!
              const v = kv[2]!.trim().replace(/^["']|["']$/g, '')
              pendingAnnotation[k] = /^-?\d+(?:\.\d+)?$/.test(v) ? Number(v) : v
            }
          }
          continue
        } else if (pendingAnnotation) {
          const kv = trimmed.match(/^([a-zA-Z_]\w*)\s*:\s*(.+)$/)
          if (kv) {
            const k = kv[1]!
            const v = kv[2]!.trim().replace(/^["']|["']$/g, '')
            pendingAnnotation[k] = /^-?\d+(?:\.\d+)?$/.test(v) ? Number(v) : v
            continue
          }
        }
        flushPendingAnnotation()
        inAnnotationsBlock = false
      }

      const kvMatch = trimmed.match(/^([a-zA-Z_][\w-]*)\s*:\s*(.*)$/)
      if (kvMatch) {
        const key = kvMatch[1]!.toLowerCase()
        const val = kvMatch[2]!.trim().replace(/^["']|["']$/g, '')
        switch (key) {
          case 'symbol':
          case 'ticker':
          case 'code':
            symbol = val.toUpperCase()
            break
          case 'name':
          case 'title':
            name = val
            break
          case 'market':
          case 'exchange':
            market = val.toUpperCase()
            break
          case 'interval':
          case 'timeframe':
          case 'period':
            interval = val
            break
          case 'mode':
            mode = val.toLowerCase() === 'live' || val.toLowerCase() === 'realtime' ? 'live' : 'static'
            break
          case 'theme':
          case 'colorscheme':
            colorScheme = val.toLowerCase().includes('green-up') || val.toLowerCase() === 'intl' ? 'intl-green-up' : 'cn-red-up'
            break
          case 'scale':
          case 'pricescale':
            priceScaleMode =
              val.toLowerCase().startsWith('log')
                ? 'logarithmic'
                : val.toLowerCase().startsWith('pct') || val.toLowerCase().startsWith('percent')
                  ? 'percentage'
                  : 'linear'
            break
          case 'subpane':
          case 'subpanes':
            subPanes = parseSubPanes(val)
            break
          case 'microstructure':
          case 'lab':
            microstructure = parseMicrostructureFlags(val)
            break
          case 'formula':
          case 'indicators':
          case 'indicator':
            if (val === '|' || val === '>' || val === '') {
              inFormulaBlock = true
            } else {
              formulaLines.push(val)
            }
            break
          case 'annotations':
            inAnnotationsBlock = true
            break
        }
        continue
      }
    }

    // 尝试将当前行作为 K 线数据行解析
    const bar = parseCompactBarLine(trimmed, bars.length)
    if (bar) {
      bars.push(bar)
    }
  }

  flushPendingAnnotation()

  const resolvedMode: 'live' | 'static' =
    mode ?? (bars.length === 0 && symbol.length > 0 ? 'live' : 'static')

  if (resolvedMode === 'static' && bars.length === 0) {
    return null
  }

  return {
    mode: resolvedMode,
    symbol: symbol || 'INDEX',
    name,
    market,
    interval,
    colorScheme,
    priceScaleMode,
    formula: formulaLines.length > 0 ? formulaLines.join('\n') : DEFAULT_FORMULA,
    subPanes,
    microstructure,
    annotations,
    bars,
  }
}
