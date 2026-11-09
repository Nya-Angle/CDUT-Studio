/**
 * Profer KLine Engine — 双视图列式/行式内存池、常驻平坦线段树与像素级坐标数学
 *
 * 核心能力：
 * 1. FlatMinMaxSegmentTree：基于 2^k 完全二叉平坦数组的区间极值查询树，
 *    将视口自适应 Y 轴缩放与像素列 OHLC 合并（Conflation）从 O(N) 降至 O(log N)（亚微秒级）。
 * 2. KLineDataStore：同时维护 CPU 向量化公式所需的 Float64Array SoA 列式存储，
 *    以及 WebGPU SSBO 所需的 32-Byte std430 对齐 Float32Array AoS 镜像缓冲。
 * 3. LockFreeTickRingBuffer：基于 SharedArrayBuffer / ArrayBuffer 的无锁流式 Tick 环形队列。
 * 4. 像素级对齐数学（Parity-Locked Bitmap Alignment）与光标锚定零漂移缩放闭式解。
 */

import type { KLineBar, KLineColumnarArrays, KLinePriceScaleMode, KLineTickDelta } from './types'

/**
 * 常驻平坦线段树（Flat Min-Max Segment Tree）
 *
 * 内存全部驻留于两块连续的 Float64Array 中，无任何对象指针分配与 GC 压力。
 * 支持 O(log N) 的单点实时 Tick 极值更新与任意闭区间 [from, to] 极值查询。
 */
export class FlatMinMaxSegmentTree {
  private capacity: number
  private minTree: Float64Array
  private maxTree: Float64Array
  private count = 0

  constructor(initialCapacity = 1024) {
    this.capacity = 1 << Math.ceil(Math.log2(Math.max(4, initialCapacity)))
    this.minTree = new Float64Array(this.capacity * 2).fill(Number.POSITIVE_INFINITY)
    this.maxTree = new Float64Array(this.capacity * 2).fill(Number.NEGATIVE_INFINITY)
  }

  public get length(): number {
    return this.count
  }

  private ensureCapacity(required: number): void {
    if (required <= this.capacity) return
    let nextCap = this.capacity
    while (nextCap < required) nextCap <<= 1
    const nextMin = new Float64Array(nextCap * 2).fill(Number.POSITIVE_INFINITY)
    const nextMax = new Float64Array(nextCap * 2).fill(Number.NEGATIVE_INFINITY)
    for (let i = 0; i < this.count; i++) {
      nextMin[nextCap + i] = this.minTree[this.capacity + i]!
      nextMax[nextCap + i] = this.maxTree[this.capacity + i]!
    }
    this.capacity = nextCap
    this.minTree = nextMin
    this.maxTree = nextMax
    this.rebuildInternalNodes()
  }

  private rebuildInternalNodes(): void {
    for (let pos = this.capacity - 1; pos >= 1; pos--) {
      const left = pos << 1
      const right = left | 1
      const lMin = this.minTree[left]!
      const rMin = this.minTree[right]!
      const lMax = this.maxTree[left]!
      const rMax = this.maxTree[right]!
      this.minTree[pos] = lMin < rMin ? lMin : rMin
      this.maxTree[pos] = lMax > rMax ? lMax : rMax
    }
  }

  /** 批量构建整棵线段树，时间复杂度严格 O(N) */
  public buildFromArrays(lows: ArrayLike<number>, highs: ArrayLike<number>, count: number): void {
    this.ensureCapacity(Math.max(4, count))
    this.count = count
    this.minTree.fill(Number.POSITIVE_INFINITY)
    this.maxTree.fill(Number.NEGATIVE_INFINITY)
    for (let i = 0; i < count; i++) {
      const l = lows[i]!
      const h = highs[i]!
      if (Number.isFinite(l) && Number.isFinite(h)) {
        this.minTree[this.capacity + i] = l
        this.maxTree[this.capacity + i] = h
      }
    }
    this.rebuildInternalNodes()
  }

  /** O(log N) 单点更新（实时 Tick 更新最后一根或追加新一根 K 线时调用） */
  public update(index: number, low: number, high: number): void {
    if (index < 0) return
    if (index >= this.capacity) {
      this.ensureCapacity(index + 1)
    }
    if (index + 1 > this.count) {
      this.count = index + 1
    }
    let pos = index + this.capacity
    this.minTree[pos] = low
    this.maxTree[pos] = high
    for (pos >>= 1; pos >= 1; pos >>= 1) {
      const left = pos << 1
      const right = left | 1
      const lMin = this.minTree[left]!
      const rMin = this.minTree[right]!
      const lMax = this.maxTree[left]!
      const rMax = this.maxTree[right]!
      this.minTree[pos] = lMin < rMin ? lMin : rMin
      this.maxTree[pos] = lMax > rMax ? lMax : rMax
    }
  }

  /** O(log N) 闭区间 [from, to] 极值查询 */
  public query(from: number, to: number): { min: number; max: number } {
    if (this.count === 0) return { min: 0, max: 1 }
    const clampedFrom = Math.max(0, Math.min(this.count - 1, Math.floor(from)))
    const clampedTo = Math.max(clampedFrom, Math.min(this.count - 1, Math.ceil(to)))

    let l = clampedFrom + this.capacity
    let r = clampedTo + this.capacity
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY

    while (l <= r) {
      if ((l & 1) === 1) {
        const vMin = this.minTree[l]!
        const vMax = this.maxTree[l]!
        if (vMin < min) min = vMin
        if (vMax > max) max = vMax
        l++
      }
      if ((r & 1) === 0) {
        const vMin = this.minTree[r]!
        const vMax = this.maxTree[r]!
        if (vMin < min) min = vMin
        if (vMax > max) max = vMax
        r--
      }
      l >>= 1
      r >>= 1
    }

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      return { min: 0, max: 1 }
    }
    return { min, max }
  }
}

/**
 * 将 JS 64 位双精度浮点数拆分为 Knuth-Dekker 双单精度对 (hi: f32, lo: f32)，
 * 供 WebGPU 顶点着色器执行 ds_float 运算，消除 10^9 倍极端缩放下的单精度浮点抖动。
 */
export function splitDoubleToFloat32Pair(value: number): [number, number] {
  const f32 = Math.fround(value)
  const err = Math.fround(value - f32)
  return [f32, err]
}

/**
 * 双视图列式/行式内存池（KLineDataStore）
 *
 * - SoA (Float64Array)：直接喂给通达信向量化公式引擎；
 * - AoS (Float32Array, stride = 8 floats = 32 bytes)：直接通过 queue.writeBuffer 零拷贝刷入 WebGPU SSBO；
 * - 内置常驻平坦线段树与 BVC 订单流毒性 (VPIN) 滚动累加桶。
 */
export class KLineDataStore {
  private capacity: number
  private count = 0

  public timeMs: Float64Array
  public open: Float64Array
  public high: Float64Array
  public low: Float64Array
  public close: Float64Array
  public volume: Float64Array
  public amount: Float64Array
  public ofi: Float32Array
  public vpin: Float32Array
  public iceberg: Float32Array
  public timeLabels: string[] = []

  /**
   * 32-Byte Aligned AoS GPU Instance Buffer (每个实例 8 个 f32):
   * [0]: index_hi, [1]: index_lo, [2]: open, [3]: close,
   * [4]: high,     [5]: low,      [6]: volume, [7]: ofi
   */
  public gpuInstanceBuffer: Float32Array

  /** 常驻平坦线段树 */
  public readonly segmentTree: FlatMinMaxSegmentTree

  constructor(initialCapacity = 2048) {
    this.capacity = Math.max(64, 1 << Math.ceil(Math.log2(Math.max(64, initialCapacity))))
    this.timeMs = new Float64Array(this.capacity)
    this.open = new Float64Array(this.capacity)
    this.high = new Float64Array(this.capacity)
    this.low = new Float64Array(this.capacity)
    this.close = new Float64Array(this.capacity)
    this.volume = new Float64Array(this.capacity)
    this.amount = new Float64Array(this.capacity)
    this.ofi = new Float32Array(this.capacity)
    this.vpin = new Float32Array(this.capacity)
    this.iceberg = new Float32Array(this.capacity)
    this.gpuInstanceBuffer = new Float32Array(this.capacity * 8)
    this.segmentTree = new FlatMinMaxSegmentTree(this.capacity)
  }

  public get length(): number {
    return this.count
  }

  private ensureCapacity(required: number): void {
    if (required <= this.capacity) return
    let nextCap = this.capacity
    while (nextCap < required) nextCap <<= 1

    const growF64 = (src: Float64Array): Float64Array => {
      const dst = new Float64Array(nextCap)
      dst.set(src.subarray(0, this.count))
      return dst
    }
    const growF32 = (src: Float32Array, mult = 1): Float32Array => {
      const dst = new Float32Array(nextCap * mult)
      dst.set(src.subarray(0, this.count * mult))
      return dst
    }

    this.timeMs = growF64(this.timeMs)
    this.open = growF64(this.open)
    this.high = growF64(this.high)
    this.low = growF64(this.low)
    this.close = growF64(this.close)
    this.volume = growF64(this.volume)
    this.amount = growF64(this.amount)
    this.ofi = growF32(this.ofi)
    this.vpin = growF32(this.vpin)
    this.iceberg = growF32(this.iceberg)
    this.gpuInstanceBuffer = growF32(this.gpuInstanceBuffer, 8)
    this.capacity = nextCap
  }

  private writeGpuSlot(index: number): void {
    const base = index * 8
    const [idxHi, idxLo] = splitDoubleToFloat32Pair(index)
    this.gpuInstanceBuffer[base] = idxHi
    this.gpuInstanceBuffer[base + 1] = idxLo
    this.gpuInstanceBuffer[base + 2] = this.open[index]!
    this.gpuInstanceBuffer[base + 3] = this.close[index]!
    this.gpuInstanceBuffer[base + 4] = this.high[index]!
    this.gpuInstanceBuffer[base + 5] = this.low[index]!
    this.gpuInstanceBuffer[base + 6] = this.volume[index]!
    this.gpuInstanceBuffer[base + 7] = this.ofi[index]!
  }

  /**
   * 批量载入并校验归一化 OHLCV 数据：
   * 严格执行 high >= max(open, close), low <= min(open, close), volume >= 0，
   * 若未提供 OFI/VPIN，则通过 BVC（Bulk Volume Classification）大宗交易量分类规则自动推算微观结构基线。
   */
  public setBars(bars: readonly KLineBar[]): void {
    const n = bars.length
    this.ensureCapacity(Math.max(64, n))
    this.count = n
    this.timeLabels = new Array<string>(n)

    let rollingImbalanceSum = 0
    let rollingVolSum = 0
    const vpinWindow = 12

    for (let i = 0; i < n; i++) {
      const b = bars[i]!
      const o = Number.isFinite(b.open) ? b.open : 0
      const c = Number.isFinite(b.close) ? b.close : o
      const rawH = Number.isFinite(b.high) ? b.high : Math.max(o, c)
      const rawL = Number.isFinite(b.low) ? b.low : Math.min(o, c)
      const h = Math.max(rawH, o, c)
      const l = Math.min(rawL, o, c)
      const v = Math.max(0, Number.isFinite(b.volume) ? b.volume : 0)

      this.timeMs[i] = Number.isFinite(b.timeMs) ? b.timeMs : i * 60_000
      this.timeLabels[i] = b.timeLabel ?? formatKLineTimestamp(this.timeMs[i]!)
      this.open[i] = o
      this.high[i] = h
      this.low[i] = l
      this.close[i] = c
      this.volume[i] = v
      this.amount[i] = Number.isFinite(b.amount) ? b.amount! : ((o + h + l + c) / 4) * v

      // BVC (Bulk Volume Classification) 估算主动买卖失衡与 VPIN
      const range = Math.max(1e-9, h - l)
      const buyRatio = Math.min(1, Math.max(0, (c - l) / range))
      const estOfi = (2 * buyRatio - 1) * v
      this.ofi[i] = b.ofi !== undefined && Number.isFinite(b.ofi) ? b.ofi : estOfi

      const absImb = Math.abs(this.ofi[i]!)
      rollingImbalanceSum += absImb
      rollingVolSum += v
      if (i >= vpinWindow) {
        rollingImbalanceSum -= Math.abs(this.ofi[i - vpinWindow]!)
        rollingVolSum -= this.volume[i - vpinWindow]!
      }
      const computedVpin = rollingVolSum > 1e-6 ? Math.min(1, Math.max(0, rollingImbalanceSum / rollingVolSum)) : 0.2
      this.vpin[i] = b.vpin !== undefined && Number.isFinite(b.vpin) ? b.vpin : computedVpin
      this.iceberg[i] = b.icebergVolume ?? 0

      this.writeGpuSlot(i)
    }

    this.segmentTree.buildFromArrays(this.low, this.high, n)
  }

  /**
   * 实时增量应用单笔 Tick 更新（O(log N) 线段树维护 + O(1) 尾部槽位覆写）：
   * - 若 tick 属于当前最后一根 K 线周期：仅原位更新最后一根 Bar 的 high/low/close/volume/ofi/vpin；
   * - 若 tick 跨入新周期（periodMs > 0 且超出当前周期）：自动开辟新 Bar，返回 `{ appended: true }`。
   */
  public applyTick(tick: KLineTickDelta, periodMs = 60_000): { appended: boolean; barIndex: number } {
    if (this.count === 0) {
      this.setBars([
        {
          timeMs: Math.floor(tick.timeMs / periodMs) * periodMs,
          open: tick.price,
          high: tick.price,
          low: tick.price,
          close: tick.price,
          volume: Math.max(0, tick.volumeDelta),
        },
      ])
      return { appended: true, barIndex: 0 }
    }

    const lastIdx = this.count - 1
    const lastTimeMs = this.timeMs[lastIdx]!
    const bucketTimeMs = periodMs > 0 ? Math.floor(tick.timeMs / periodMs) * periodMs : lastTimeMs

    if (bucketTimeMs > lastTimeMs) {
      // 开启新 K 线
      const nextIdx = this.count
      this.ensureCapacity(nextIdx + 1)
      this.count = nextIdx + 1
      this.timeMs[nextIdx] = bucketTimeMs
      this.timeLabels[nextIdx] = formatKLineTimestamp(bucketTimeMs)
      this.open[nextIdx] = tick.price
      this.high[nextIdx] = tick.price
      this.low[nextIdx] = tick.price
      this.close[nextIdx] = tick.price
      this.volume[nextIdx] = Math.max(0, tick.volumeDelta)
      this.amount[nextIdx] = tick.price * Math.max(0, tick.volumeDelta)
      const ofiDelta = (tick.bidVolumeDelta ?? 0) - (tick.askVolumeDelta ?? 0)
      this.ofi[nextIdx] = ofiDelta
      this.vpin[nextIdx] = this.vpin[lastIdx]!
      this.iceberg[nextIdx] = tick.icebergDetected ? tick.volumeDelta : 0
      this.writeGpuSlot(nextIdx)
      this.segmentTree.update(nextIdx, tick.price, tick.price)
      return { appended: true, barIndex: nextIdx }
    }

    // 原位更新最后一根 K 线
    const newHigh = Math.max(this.high[lastIdx]!, tick.price)
    const newLow = Math.min(this.low[lastIdx]!, tick.price)
    const newVol = this.volume[lastIdx]! + Math.max(0, tick.volumeDelta)
    this.high[lastIdx] = newHigh
    this.low[lastIdx] = newLow
    this.close[lastIdx] = tick.price
    this.volume[lastIdx] = newVol
    this.amount[lastIdx] = this.amount[lastIdx]! + tick.price * Math.max(0, tick.volumeDelta)

    const ofiDelta =
      tick.bidVolumeDelta !== undefined || tick.askVolumeDelta !== undefined
        ? (tick.bidVolumeDelta ?? 0) - (tick.askVolumeDelta ?? 0)
        : (tick.price >= this.open[lastIdx]! ? 1 : -1) * tick.volumeDelta * 0.5
    this.ofi[lastIdx] = this.ofi[lastIdx]! + ofiDelta
    const range = Math.max(1e-9, newHigh - newLow)
    const instantToxicity = Math.min(1, Math.abs(this.close[lastIdx]! - this.open[lastIdx]!) / range)
    this.vpin[lastIdx] = this.vpin[lastIdx]! * 0.92 + instantToxicity * 0.08
    if (tick.icebergDetected) {
      this.iceberg[lastIdx] = this.iceberg[lastIdx]! + tick.volumeDelta
    }

    this.writeGpuSlot(lastIdx)
    this.segmentTree.update(lastIdx, newLow, newHigh)
    return { appended: false, barIndex: lastIdx }
  }

  /** 追加或覆盖最后一根完整 K 线 */
  public upsertBar(bar: KLineBar): { appended: boolean; barIndex: number } {
    if (this.count === 0) {
      this.setBars([bar])
      return { appended: true, barIndex: 0 }
    }
    const lastIdx = this.count - 1
    const isSameBar = Math.abs(this.timeMs[lastIdx]! - bar.timeMs) < 500
    const targetIdx = isSameBar ? lastIdx : this.count
    if (!isSameBar) {
      this.ensureCapacity(targetIdx + 1)
      this.count = targetIdx + 1
    }
    const o = bar.open
    const c = bar.close
    const h = Math.max(bar.high, o, c)
    const l = Math.min(bar.low, o, c)
    const v = Math.max(0, bar.volume)
    this.timeMs[targetIdx] = bar.timeMs
    this.timeLabels[targetIdx] = bar.timeLabel ?? formatKLineTimestamp(bar.timeMs)
    this.open[targetIdx] = o
    this.high[targetIdx] = h
    this.low[targetIdx] = l
    this.close[targetIdx] = c
    this.volume[targetIdx] = v
    this.amount[targetIdx] = bar.amount ?? ((o + h + l + c) / 4) * v
    this.ofi[targetIdx] = bar.ofi ?? ((c - o) / Math.max(1e-9, h - l)) * v
    this.vpin[targetIdx] = bar.vpin ?? (targetIdx > 0 ? this.vpin[targetIdx - 1]! : 0.25)
    this.iceberg[targetIdx] = bar.icebergVolume ?? 0
    this.writeGpuSlot(targetIdx)
    this.segmentTree.update(targetIdx, l, h)
    return { appended: !isSameBar, barIndex: targetIdx }
  }

  /** 获取只读列式视图（零拷贝 Subarray） */
  public getColumnarView(): KLineColumnarArrays {
    const n = this.count
    return {
      length: n,
      timeMs: this.timeMs.subarray(0, n),
      open: this.open.subarray(0, n),
      high: this.high.subarray(0, n),
      low: this.low.subarray(0, n),
      close: this.close.subarray(0, n),
      volume: this.volume.subarray(0, n),
      amount: this.amount.subarray(0, n),
      ofi: this.ofi.subarray(0, n),
      vpin: this.vpin.subarray(0, n),
    }
  }

  /** 读取单根 K 线对象 */
  public getBar(index: number): KLineBar | null {
    if (index < 0 || index >= this.count) return null
    return {
      timeMs: this.timeMs[index]!,
      timeLabel: this.timeLabels[index],
      open: this.open[index]!,
      high: this.high[index]!,
      low: this.low[index]!,
      close: this.close[index]!,
      volume: this.volume[index]!,
      amount: this.amount[index]!,
      ofi: this.ofi[index]!,
      vpin: this.vpin[index]!,
      icebergVolume: this.iceberg[index]!,
    }
  }

  /** 导出全部 K 线数组（供序列化或认知编码器使用） */
  public toBars(): KLineBar[] {
    const out: KLineBar[] = new Array(this.count)
    for (let i = 0; i < this.count; i++) {
      out[i] = this.getBar(i)!
    }
    return out
  }
}

/**
 * 无锁环形 Tick 缓冲区（Lock-Free SPSC Ring Buffer）
 *
 * 支持基于 SharedArrayBuffer（Worker / IPC 线程直接写入，渲染线程每帧批量排空）
 * 或降级为普通 ArrayBuffer，彻底消除高频行情下的对象分配与 JSON.parse 开销。
 */
export class LockFreeTickRingBuffer {
  private readonly capacity: number
  private readonly header: Int32Array // [0]: writeCursor, [1]: readCursor
  private readonly data: Float64Array // 每槽位 5 个 f64: [timeMs, price, volumeDelta, bidDelta, askDelta]

  constructor(capacityPowerOfTwo = 4096, existingBuffer?: SharedArrayBuffer | ArrayBuffer) {
    this.capacity = 1 << Math.ceil(Math.log2(Math.max(64, capacityPowerOfTwo)))
    const byteLength = 8 + this.capacity * 5 * 8
    const buf = existingBuffer && existingBuffer.byteLength >= byteLength ? existingBuffer : new ArrayBuffer(byteLength)
    this.header = new Int32Array(buf, 0, 2)
    this.data = new Float64Array(buf, 8, this.capacity * 5)
  }

  /** 生产者写入单笔 Tick（零分配） */
  public push(tick: KLineTickDelta): boolean {
    const write = this.header[0]!
    const read = this.header[1]!
    if (write - read >= this.capacity) {
      // 环形缓冲满时自动推进读游标丢弃最老的过期 Tick，保证最新行情永不阻塞
      this.header[1] = write - this.capacity + 1
    }
    const slot = (write & (this.capacity - 1)) * 5
    this.data[slot] = tick.timeMs
    this.data[slot + 1] = tick.price
    this.data[slot + 2] = tick.volumeDelta
    this.data[slot + 3] = tick.bidVolumeDelta ?? 0
    this.data[slot + 4] = tick.askVolumeDelta ?? 0
    this.header[0] = write + 1
    return true
  }

  /** 消费者在 requestAnimationFrame 中一次性排空全部待处理 Tick 并灌入 KLineDataStore */
  public drainToStore(store: KLineDataStore, periodMs = 60_000): number {
    const write = this.header[0]!
    let read = this.header[1]!
    let processed = 0
    while (read < write) {
      const slot = (read & (this.capacity - 1)) * 5
      store.applyTick(
        {
          timeMs: this.data[slot]!,
          price: this.data[slot + 1]!,
          volumeDelta: this.data[slot + 2]!,
          bidVolumeDelta: this.data[slot + 3]!,
          askVolumeDelta: this.data[slot + 4]!,
        },
        periodMs,
      )
      read++
      processed++
    }
    this.header[1] = read
    return processed
  }
}

// ===== 像素级对齐（Pixel-Perfect）与时间/价格轴坐标纯函数 =====

export interface KLineViewportState {
  /** 每根 K 线占据的 CSS 像素宽度（缩放自由度） */
  barSpacing: number
  /** 最后一根 K 线距离绘图区右边缘的偏移柱数（平移自由度） */
  rightOffset: number
}

export const KLINE_MIN_BAR_SPACING = 0.15
export const KLINE_MAX_BAR_SPACING = 64

/** 逻辑索引 i -> 绘图区内相对 X 坐标（CSS 像素，位于该柱中心） */
export function logicalIndexToX(
  index: number,
  totalBars: number,
  plotWidth: number,
  viewport: KLineViewportState,
): number {
  const lastIndex = Math.max(0, totalBars - 1)
  return plotWidth - (lastIndex + viewport.rightOffset - index) * viewport.barSpacing - viewport.barSpacing * 0.5
}

/** 绘图区内相对 X 坐标（CSS 像素）-> 最近的整数逻辑索引 */
export function xToLogicalIndex(
  x: number,
  totalBars: number,
  plotWidth: number,
  viewport: KLineViewportState,
): number {
  const lastIndex = Math.max(0, totalBars - 1)
  const raw = lastIndex + viewport.rightOffset - (plotWidth - x - viewport.barSpacing * 0.5) / viewport.barSpacing
  return Math.round(raw)
}

/** 计算当前视口内的可见逻辑索引闭区间 [from, to]（裁剪 Culling） */
export function computeVisibleLogicalRange(
  totalBars: number,
  plotWidth: number,
  viewport: KLineViewportState,
): { from: number; to: number; floatFrom: number; floatTo: number } {
  if (totalBars <= 0 || plotWidth <= 0) {
    return { from: 0, to: 0, floatFrom: 0, floatTo: 0 }
  }
  const lastIndex = totalBars - 1
  const barsInView = plotWidth / Math.max(1e-6, viewport.barSpacing)
  const floatTo = lastIndex + viewport.rightOffset
  const floatFrom = floatTo - barsInView
  const from = Math.max(0, Math.floor(floatFrom) - 1)
  const to = Math.min(lastIndex, Math.ceil(floatTo) + 1)
  return { from, to, floatFrom, floatTo }
}

/**
 * 以鼠标位置 anchorX 为锚点的无漂移缩放（Zero-Drift Anchor Zoom）：
 * 缩放前后令鼠标正下方的浮点逻辑索引严格保持不变，反解出新的 rightOffset。
 */
export function computeKLineAnchorZoom(
  prev: KLineViewportState,
  nextBarSpacing: number,
  anchorX: number,
  plotWidth: number,
): KLineViewportState {
  const clampedSpacing = Math.min(KLINE_MAX_BAR_SPACING, Math.max(KLINE_MIN_BAR_SPACING, nextBarSpacing))
  if (Math.abs(clampedSpacing - prev.barSpacing) < 1e-9 || plotWidth <= 0) {
    return prev
  }
  const distFromRight = plotWidth - anchorX
  const nextRightOffset =
    prev.rightOffset + distFromRight * (1 / clampedSpacing - 1 / prev.barSpacing)
  return {
    barSpacing: clampedSpacing,
    rightOffset: nextRightOffset,
  }
}

/**
 * 位图坐标空间奇偶同调法则（Parity-Locked Wick & Body Metrics）：
 * 确保在任意 devicePixelRatio 下，影线宽度 wickW 与实体宽度 bodyW 奇偶性绝对一致，
 * 使 (bodyW - wickW) / 2 永远为整数物理像素，彻底根除影线偏心与亚像素发虚。
 */
export function computePixelPerfectCandleMetrics(
  barSpacingCss: number,
  dpr: number,
): {
  /** 是否进入亚像素 LOD 合并模式（单像素列包含多根 K 线） */
  isSubPixelConflated: boolean
  /** 物理像素下的实体宽度（整数） */
  bodyWidthPhys: number
  /** 物理像素下的影线宽度（整数，且与 bodyWidthPhys 奇偶性相同） */
  wickWidthPhys: number
} {
  const safeDpr = Math.max(1, dpr)
  const spacingPhys = barSpacingCss * safeDpr
  if (spacingPhys < 1.2) {
    return {
      isSubPixelConflated: true,
      bodyWidthPhys: 1,
      wickWidthPhys: 1,
    }
  }
  const rawBody = Math.max(1, Math.floor(spacingPhys * 0.74))
  const rawWick = Math.max(1, Math.floor(safeDpr))
  const wickWidthPhys = rawWick % 2 === rawBody % 2 ? rawWick : rawWick + 1
  const bodyWidthPhys = spacingPhys < 2.4 ? wickWidthPhys : Math.max(wickWidthPhys, rawBody)
  return {
    isSubPixelConflated: false,
    bodyWidthPhys,
    wickWidthPhys,
  }
}

/** 价格 -> Y 坐标映射（支持线性、对数、百分比三种坐标轴） */
export function priceToY(
  price: number,
  minPrice: number,
  maxPrice: number,
  plotTop: number,
  plotHeight: number,
  mode: KLinePriceScaleMode = 'linear',
): number {
  if (plotHeight <= 0 || maxPrice <= minPrice) return plotTop + plotHeight * 0.5
  if (mode === 'logarithmic' && price > 0 && minPrice > 0 && maxPrice > 0) {
    const logMin = Math.log(minPrice)
    const logMax = Math.log(maxPrice)
    const logP = Math.log(price)
    return plotTop + ((logMax - logP) / Math.max(1e-9, logMax - logMin)) * plotHeight
  }
  return plotTop + ((maxPrice - price) / (maxPrice - minPrice)) * plotHeight
}

/** Y 坐标 -> 价格反查 */
export function yToPrice(
  y: number,
  minPrice: number,
  maxPrice: number,
  plotTop: number,
  plotHeight: number,
  mode: KLinePriceScaleMode = 'linear',
): number {
  if (plotHeight <= 0 || maxPrice <= minPrice) return minPrice
  const ratio = Math.min(1, Math.max(0, (y - plotTop) / plotHeight))
  if (mode === 'logarithmic' && minPrice > 0 && maxPrice > 0) {
    const logMin = Math.log(minPrice)
    const logMax = Math.log(maxPrice)
    return Math.exp(logMax - ratio * (logMax - logMin))
  }
  return maxPrice - ratio * (maxPrice - minPrice)
}

/** 生成符合人类阅读习惯的“漂亮价格刻度”（1, 2, 2.5, 5 倍数步长） */
export function computeNicePriceTicks(minPrice: number, maxPrice: number, targetCount = 5): number[] {
  const range = maxPrice - minPrice
  if (!Number.isFinite(range) || range <= 0 || targetCount <= 0) return [minPrice]
  const roughStep = range / targetCount
  const mag = Math.pow(10, Math.floor(Math.log10(roughStep)))
  const residual = roughStep / mag
  let niceMult = 1
  if (residual > 5) niceMult = 10
  else if (residual > 2.5) niceMult = 5
  else if (residual > 2) niceMult = 2.5
  else if (residual > 1) niceMult = 2
  const step = niceMult * mag

  const first = Math.ceil(minPrice / step) * step
  const ticks: number[] = []
  for (let v = first; v <= maxPrice + step * 1e-6 && ticks.length < targetCount * 2 + 2; v += step) {
    ticks.push(Number(v.toPrecision(10)))
  }
  return ticks
}

/** 格式化毫秒时间戳为紧凑金融时间字符串 */
export function formatKLineTimestamp(timeMs: number): string {
  if (!Number.isFinite(timeMs) || timeMs <= 0) return ''
  // 若小于 10^9，视为纯序号
  if (timeMs < 1_000_000_000) return `#${Math.round(timeMs)}`
  const d = new Date(timeMs)
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mi = String(d.getUTCMinutes()).padStart(2, '0')
  if (hh === '00' && mi === '00') {
    return `${yyyy}-${mm}-${dd}`
  }
  return `${mm}-${dd} ${hh}:${mi}`
}
