/**
 * Profer KLine Engine — 核心类型与接口契约
 *
 * 本模块无任何 DOM / Electron 依赖，可在主进程、Worker、渲染进程与测试环境中零开销共用。
 */

/** 单根标准 OHLCV + 微观结构 K 线数据（内部统一使用毫秒时间戳与具名字段） */
export interface KLineBar {
  /** 周期起始 UTC 时间戳（毫秒），若为纯逻辑序列也可为递增序号毫秒值 */
  timeMs: number
  /** 人类可读时间标签（如 "2026-11-07 09:35" 或 "2026-11-07"） */
  timeLabel?: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  amount?: number
  /** 订单流净不平衡 (Order Flow Imbalance: ΔV_bid - ΔV_ask) */
  ofi?: number
  /** 成交量同步知情交易概率 / 订单流毒性 (VPIN ∈ [0, 1]) */
  vpin?: number
  /** 冰山订单被动吸收量探测值（>0 表示该 K 线价格区间探测到隐藏冰山单） */
  icebergVolume?: number
}

/** 列式存储结构（Structure of Arrays，最大化 CPU SIMD 与向量化公式缓存命中率） */
export interface KLineColumnarArrays {
  readonly length: number
  readonly timeMs: Float64Array
  readonly open: Float64Array
  readonly high: Float64Array
  readonly low: Float64Array
  readonly close: Float64Array
  readonly volume: Float64Array
  readonly amount: Float64Array
  readonly ofi: Float32Array
  readonly vpin: Float32Array
}

/** 价格坐标轴模式 */
export type KLinePriceScaleMode = 'linear' | 'logarithmic' | 'percentage'

/** 涨跌配色主题（A股红涨绿跌 vs 国际绿涨红跌） */
export type KLineColorScheme = 'cn-red-up' | 'intl-green-up'

/** 渲染后端模式 */
export type KLineEngineMode = 'auto' | 'canvas2d' | 'webgpu'

/** 副图类型标识 */
export type KLineSubPaneKind = 'VOL' | 'MACD' | 'KDJ' | 'RSI' | 'VPIN' | 'CUSTOM'

/** 市场微观结构实验室图层开关 */
export interface KLineMicrostructureConfig {
  /** 开启 KDE + 程序化 SDF 小提琴/筹码分布混合蜡烛图 */
  kdeCandle?: boolean
  /** 开启环面纹理寻址 (Toroidal Texture) L2 订单簿深度热力图 */
  lobHeatmap?: boolean
  /** 开启 Oklab 感知均匀色彩空间 OFI（订单流不平衡）蜡烛染色 */
  ofiColoring?: boolean
  /** 开启底部 VPIN（订单流毒性）监控色带与高毒预警 */
  vpinRibbon?: boolean
  /** 开启冰山订单（Iceberg Order）与撤单异常脉冲标记 */
  icebergGlyphs?: boolean
}

/** 语义标注与画线覆盖物（严格按逻辑索引或时间戳 + 价格锚定，绝不存屏幕像素坐标） */
export interface KLineAnnotation {
  id?: string
  /**
   * 标注类型：
   * - 'signal': 买卖点或异动信号箭头
   * - 'tag': 文本胶囊标签
   * - 'hline': 水平支撑/阻力价格线
   * - 'trendline': 两点锚定趋势线 (index, price) -> (toIndex, toPrice)
   * - 'zone': 筹码密集区或箱体价格带 [price, toPrice]
   */
  type: 'signal' | 'tag' | 'hline' | 'trendline' | 'zone'
  /** 逻辑索引（支持负数，如 -1 表示最后一根 K 线） */
  index?: number
  /** 可选时间字符串或毫秒时间戳（若未给 index，引擎自动按时间二分匹配最近逻辑索引） */
  time?: string | number
  /** 锚定价格（若省略则自动取该 Bar 的 high 或 low） */
  price?: number
  /** 趋势线终点逻辑索引 */
  toIndex?: number
  /** 趋势线终点价格或区间上沿价格 */
  toPrice?: number
  /** 买卖方向（用于 signal 染色） */
  side?: 'buy' | 'sell' | 'neutral'
  /** 显示文本 */
  label?: string
  /** 自定义颜色 */
  color?: string
}

/** 通达信公式输出的单条曲线或序列 */
export interface FormulaLineOutput {
  name: string
  data: Float64Array
  color?: string
  lineWidth?: number
  style?: 'solid' | 'dashed' | 'circledot' | 'pointdot' | 'colorstick' | 'volstick'
  nodraw?: boolean
  /** 建议挂载位置：主图叠加或副图 */
  targetPane?: 'main' | 'sub'
}

/** 通达信公式输出的绘图指令（STICKLINE / DRAWTEXT / DRAWICON） */
export type FormulaDrawingInstruction =
  | {
      kind: 'stickline'
      cond: Float64Array
      price1: Float64Array
      price2: Float64Array
      width: number
      empty: boolean
      color?: string
    }
  | {
      kind: 'drawtext'
      cond: Float64Array
      price: Float64Array
      text: string
      color?: string
    }
  | {
      kind: 'drawicon'
      cond: Float64Array
      price: Float64Array
      iconType: number
    }

/** 公式编译与求值总结果 */
export interface FormulaEvaluationResult {
  lines: FormulaLineOutput[]
  drawings: FormulaDrawingInstruction[]
  /** 未来函数告警列表（如 ZIG / BACKSET / REFX） */
  futureFunctionWarnings: string[]
  /** 编译或运行期非致命诊断信息 */
  diagnostics: string[]
}

/** ```kline 代码块解析后的统一规范化描述（支持 static 与 live 两种生命周期） */
export interface KLineDSLSpec {
  /** 解析出的运行模式：'live' 为实时股票代码挂载，'static' 为内联数据渲染 */
  mode: 'live' | 'static'
  /** 股票或资产代码（如 "SH600519", "NVDA", "BTC-USDT"） */
  symbol: string
  /** 标的名称（如 "贵州茅台", "NVIDIA Corp."） */
  name?: string
  /** 市场标识（如 "CN", "US", "HK", "CRYPTO"） */
  market?: string
  /** 周期（如 "1s", "1m", "5m", "15m", "1h", "1D", "1W"） */
  interval: string
  /** 涨跌配色主题 */
  colorScheme: KLineColorScheme
  /** 价格坐标轴模式 */
  priceScaleMode: KLinePriceScaleMode
  /** 通达信/麦语言指标公式源码（默认内置 MA5/MA10/MA20） */
  formula: string
  /** 启用的副图列表 */
  subPanes: KLineSubPaneKind[]
  /** 微观结构图层配置 */
  microstructure: KLineMicrostructureConfig
  /** AI 或用户声明的语义标注列表 */
  annotations: KLineAnnotation[]
  /** 内联解析出的 K 线数据（live 模式下可为空或作为初始种子数据） */
  bars: KLineBar[]
}

/** K 线经典形态识别结果（规则层，严格与绘图层解耦） */
export interface DetectedCandlestickPattern {
  index: number
  timeMs: number
  patternCode:
    | 'DOJI'
    | 'HAMMER'
    | 'SHOOTING_STAR'
    | 'BULLISH_ENGULFING'
    | 'BEARISH_ENGULFING'
    | 'MORNING_STAR'
    | 'EVENING_STAR'
    | 'GAP_UP'
    | 'GAP_DOWN'
    | 'VOLUME_CLIMAX'
  name: string
  direction: 'bullish' | 'bearish' | 'neutral'
  price: number
  confidence: number
  description: string
}

/** 大模型认知编码器输出的高信息密度盘面结构化摘要 */
export interface KLineCognitiveDigest {
  symbol: string
  name?: string
  interval: string
  barCount: number
  latestClose: number
  periodChangePercent: number
  highPoint: { index: number; price: number; timeLabel: string }
  lowPoint: { index: number; price: number; timeLabel: string }
  atr14: number
  /** 基于高斯核密度估计 (KDE Volume Profile) 计算的筹码控制点价格与 70% 价值区间 */
  volumeProfile: {
    pocPrice: number
    valueAreaHigh: number
    valueAreaLow: number
  }
  /** 均线与趋势多空结构简述 */
  trendStructure: string
  /** 自动识别出的关键 K 线形态与缺口 */
  patterns: DetectedCandlestickPattern[]
  /** 微观结构订单流毒性与失衡状态 */
  microstructureSummary: {
    meanOfi: number
    latestVpin: number
    toxicityLevel: 'low' | 'moderate' | 'elevated' | 'critical'
    icebergDetectedCount: number
  }
  /** 可直接投喂给大模型的 Markdown 认知提示词 */
  llmPromptMarkdown: string
}

// ===== 实时股票代码挂载与零拷贝行情流契约 =====

export interface KLineLiveSubscriptionRequest {
  symbol: string
  name?: string
  market?: string
  interval: string
  /** 可选：启用 SharedArrayBuffer 零拷贝环形缓冲区直通 */
  sharedRingBuffer?: SharedArrayBuffer
}

export interface KLineTickDelta {
  timeMs: number
  price: number
  volumeDelta: number
  bidVolumeDelta?: number
  askVolumeDelta?: number
  /** L2 订单簿单列归一化深度快照（长度通常为 64，供环面纹理 Toroidal Texture 直接写入单列） */
  l2DepthColumn?: Float32Array
  /** 是否探测到冰山单被动吸收 */
  icebergDetected?: boolean
}

export type KLineFeedConnectionStatus = 'idle' | 'connecting' | 'live' | 'simulated' | 'reconnecting' | 'error'

export interface IKLineDataFeedAdapter {
  /** 拉取初始历史或向前翻页历史 K 线 */
  fetchHistory(
    req: KLineLiveSubscriptionRequest & { toTimeMs?: number; limit?: number },
  ): Promise<{
    bars: KLineBar[]
    hasMoreHistory: boolean
    sourceLabel: string
  }>
  /** 订阅低延迟实时流 */
  subscribeLive(
    req: KLineLiveSubscriptionRequest,
    onEvent: (
      event:
        | { type: 'tick'; tick: KLineTickDelta }
        | { type: 'bar'; bar: KLineBar }
        | { type: 'l2_column'; column: Float32Array },
    ) => void,
    onStatusChange?: (status: KLineFeedConnectionStatus, latencyMs?: number) => void,
  ): () => void
}
