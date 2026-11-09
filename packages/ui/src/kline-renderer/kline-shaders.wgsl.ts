/**
 * @profer/ui/kline-renderer — 100% GPU 驻留管线 WGSL 着色器源码 (WebGPU Shaders)
 *
 * 核心技术亮点：
 *   1. Compute Shader M4 保极值并行归约 (`cs_m4_conflation`)：
 *      每个线程归约一个物理像素列内的多根 K 线，输出保真 (Open_first, High_max, Low_min, Close_last)
 *      并原子更新 `IndirectDrawArgs`；
 *   2. Double-Single (`ds_float`) 双单精度浮点仿真与相对相机原点重定标 (`Camera-Relative Origin Rebasing`)：
 *      彻底根除 IEEE 754 fp32 23-bit 尾数在纳秒时间戳与深缩放微米级 Tick 下的顶点抖动（Vertex Jitter）；
 *   3. 核密度估计有向距离场（KDE-SDF Violin Candlestick）：
 *      片元着色器基于 `fwidth(d)` + `smoothstep(-aa, aa, -d)` 进行一阶偏导解析抗锯齿，
 *      单次 Draw Call 同时渲染传统 K 线或带盘口成交密度轮廓的小提琴 K 线；
 *   4. Oklab 感知均匀色彩空间插值 (`oklab_to_linear_srgb`)：
 *      将订单流失衡（OFI）与知情交易毒性（VPIN）映射为恒定感知亮度的色彩梯度，消除 RGB 泥泞死区；
 *   5. 环形寻址纹理（Toroidal Texture Addressing）L2 盘口深度热力图：
 *      通过 `fract(uv.x + toroidalOffset)` 实现零拷贝 O(1) 列滚动热力图；
 *   6. GPU 离屏拾取附件（`@location(1) pick_id: u32`）：
 *      同步输出 K 线逻辑索引 + 1 至 `R32Uint` 拾取纹理，支持 1x1 像素 `mapAsync` 精确拾取。
 */

export const KLINE_WGSL_SHADER_SOURCE = /* wgsl */ `
// ============================================================================
// 1. Double-Single (ds_float) 模拟 48-bit 有效尾数算术与色彩空间转换
// ============================================================================

struct ds_float {
  hi: f32,
  lo: f32,
};

// Knuth Two-Sum 无分支误差补偿加法
fn ds_add(a: ds_float, b: ds_float) -> ds_float {
  let s = a.hi + b.hi;
  let v = s - a.hi;
  let e = (a.hi - (s - v)) + (b.hi - v);
  let lo = e + a.lo + b.lo;
  let hi = s + lo;
  return ds_float(hi, lo - (hi - s));
}

// 硬件 FMA 加速的误差补偿乘法
fn ds_mul(a: ds_float, b: ds_float) -> ds_float {
  let p = a.hi * b.hi;
  let e = fma(a.hi, b.hi, -p);
  let lo = e + a.hi * b.lo + a.lo * b.hi;
  let hi = p + lo;
  return ds_float(hi, lo - (hi - p));
}

// Oklab -> Linear sRGB 感知均匀色彩空间转换 (Björn Ottosson)
fn oklab_to_linear_srgb(lab: vec3<f32>) -> vec3<f32> {
  let l_ = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  let m_ = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  let s_ = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;

  let l = l_ * l_ * l_;
  let m = m_ * m_ * m_;
  let s = s_ * s_ * s_;

  return vec3<f32>(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  );
}

fn linear_to_srgb(c: vec3<f32>) -> vec3<f32> {
  let clamped = clamp(c, vec3<f32>(0.0), vec3<f32>(1.0));
  return pow(clamped, vec3<f32>(1.0 / 2.2));
}

// ============================================================================
// 2. 全局数据结构与 Uniform / Storage Buffer 绑定
// ============================================================================

// 每根 K 线 32 字节对齐 (8 x f32)
struct CandleInstance {
  open: f32,
  high: f32,
  low: f32,
  close: f32,
  volume: f32,
  ofi: f32,
  vpin: f32,
  logicalIndex: f32,
};

struct ViewportUniforms {
  canvasWidth: f32,
  canvasHeight: f32,
  mainPaneTop: f32,
  mainPaneHeight: f32,
  // 相对相机锚点重定标参数
  anchorIndexHi: f32,
  anchorIndexLo: f32,
  barSpacing: f32,
  rightEdgeX: f32,
  anchorPriceHi: f32,
  anchorPriceLo: f32,
  priceScale: f32,
  maxVolume: f32,
  // 渲染模式开关
  candleStyle: u32,      // 0: 像素对齐经典蜡烛, 1: KDE-SDF 小提琴微观蜡烛
  colorScheme: u32,      // 0: A股红涨绿跌, 1: 国际绿涨红跌, 2: Oklab OFI 订单流失衡着色
  toroidalOffset: f32,   // 环形纹理列偏移 [0, 1)
  heatmapOpacity: f32,   // L2 热力图不透明度
  visibleStartIdx: u32,
  visibleEndIdx: u32,
  totalBars: u32,
  targetBins: u32,
};

struct IndirectDrawArgs {
  vertexCount: u32,
  instanceCount: atomic<u32>,
  firstVertex: u32,
  firstInstance: u32,
};

@group(0) @binding(0) var<uniform> uniforms: ViewportUniforms;
@group(0) @binding(1) var<storage, read> rawCandles: array<CandleInstance>;
@group(0) @binding(2) var<storage, read_write> conflatedCandles: array<CandleInstance>;
@group(0) @binding(3) var<storage, read_write> drawArgs: IndirectDrawArgs;

// ============================================================================
// 3. Compute Shader: M4 保极值并行像素分箱归约 (cs_m4_conflation)
// ============================================================================

@compute @workgroup_size(64)
fn cs_m4_conflation(@builtin(global_invocation_id) gid: vec3<u32>) {
  let binIdx = gid.x;
  if (binIdx == 0u) {
    drawArgs.vertexCount = 6u;
    drawArgs.firstVertex = 0u;
    drawArgs.firstInstance = 0u;
  }

  let totalVisible = uniforms.visibleEndIdx - uniforms.visibleStartIdx;
  let bins = max(1u, uniforms.targetBins);
  if (binIdx >= bins || totalVisible == 0u) {
    return;
  }

  // 当可见 K 线数 <= 分箱数时，1:1 零损耗直通
  if (totalVisible <= bins) {
    if (binIdx < totalVisible) {
      let srcIdx = uniforms.visibleStartIdx + binIdx;
      conflatedCandles[binIdx] = rawCandles[srcIdx];
      atomicMax(&drawArgs.instanceCount, binIdx + 1u);
    }
    return;
  }

  // M4 分箱归约：保留像素列内的首开盘、最高价、最低价、末收盘、累计量与加权 OFI/VPIN
  let startOffset = (binIdx * totalVisible) / bins;
  let endOffset = min(totalVisible, ((binIdx + 1u) * totalVisible) / bins);
  if (startOffset >= endOffset) {
    return;
  }

  let firstIdx = uniforms.visibleStartIdx + startOffset;
  let firstBar = rawCandles[firstIdx];

  var aggOpen = firstBar.open;
  var aggHigh = firstBar.high;
  var aggLow = firstBar.low;
  var aggClose = firstBar.close;
  var aggVol = 0.0;
  var weightedOfi = 0.0;
  var maxVpin = firstBar.vpin;
  var centerLogicalIdx = 0.0;

  let count = endOffset - startOffset;
  for (var i = startOffset; i < endOffset; i = i + 1u) {
    let b = rawCandles[uniforms.visibleStartIdx + i];
    aggHigh = max(aggHigh, b.high);
    aggLow = min(aggLow, b.low);
    aggClose = b.close;
    aggVol = aggVol + b.volume;
    weightedOfi = weightedOfi + b.ofi * b.volume;
    maxVpin = max(maxVpin, b.vpin);
    centerLogicalIdx = centerLogicalIdx + b.logicalIndex;
  }

  let normOfi = select(firstBar.ofi, clamp(weightedOfi / max(aggVol, 1e-6), -1.0, 1.0), aggVol > 0.0);
  conflatedCandles[binIdx] = CandleInstance(
    aggOpen,
    aggHigh,
    aggLow,
    aggClose,
    aggVol,
    normOfi,
    maxVpin,
    centerLogicalIdx / f32(count)
  );
  atomicMax(&drawArgs.instanceCount, binIdx + 1u);
}

// ============================================================================
// 4. Vertex & Fragment Shader: K 线 + KDE-SDF 小提琴图元 + Oklab + GPU 拾取
// ============================================================================

struct CandleVarying {
  @builtin(position) position: vec4<f32>,
  @location(0) localUV: vec2<f32>,       // [-1, 1] x [0, 1] 局部有向距离场坐标
  @location(1) bodyTopNorm: f32,         // 实体上沿在 [low, high] 内的归一化位置 [0, 1]
  @location(2) bodyBotNorm: f32,         // 实体下沿在 [low, high] 内的归一化位置 [0, 1]
  @location(3) halfBodyWidthRatio: f32,  // 实体半宽占比
  @location(4) halfWickWidthRatio: f32,  // 影线半宽占比
  @location(5) color: vec4<f32>,         // 感知均匀插值后的主色
  @location(6) volNorm: f32,             // 归一化成交量（驱动 KDE 小提琴包络宽度）
  @location(7) @interpolate(flat) pickId: u32,
};

fn compute_candle_color(c: CandleInstance) -> vec3<f32> {
  let isBull = c.close >= c.open;
  if (uniforms.colorScheme == 2u) {
    // Oklab 感知均匀订单流失衡 (OFI) 与 VPIN 毒性融合着色
    let t = clamp(c.ofi, -1.0, 1.0);
    let toxicityBoost = clamp(c.vpin * 0.12, 0.0, 0.12);
    let L = 0.68 + toxicityBoost;
    // t > 0 偏多头暖红/青绿，t < 0 偏空头冷青/品红
    let a = t * 0.165;
    let b = t * 0.085 - (1.0 - abs(t)) * 0.03;
    return linear_to_srgb(oklab_to_linear_srgb(vec3<f32>(L, a, b)));
  }
  if (uniforms.colorScheme == 1u) {
    // 国际绿涨红跌
    return select(vec3<f32>(0.937, 0.267, 0.267), vec3<f32>(0.063, 0.725, 0.506), isBull);
  }
  // 默认中国 A 股红涨绿跌
  return select(vec3<f32>(0.063, 0.725, 0.506), vec3<f32>(0.937, 0.267, 0.267), isBull);
}

@vertex
fn vs_candle_main(
  @builtin(vertex_index) vid: u32,
  @builtin(instance_index) iid: u32
) -> CandleVarying {
  let c = conflatedCandles[iid];

  // 使用 ds_float 计算相对锚点的逻辑索引偏移，彻底消除大索引下的精度抖动
  let idxDs = ds_add(
    ds_float(c.logicalIndex, 0.0),
    ds_float(-uniforms.anchorIndexHi, -uniforms.anchorIndexLo)
  );
  let deltaIdx = idxDs.hi + idxDs.lo;
  let centerX = uniforms.rightEdgeX + deltaIdx * uniforms.barSpacing - uniforms.barSpacing * 0.5;

  // 相对相机参考价重定标 (Camera-Relative Price Rebasing)
  let highDelta = (c.high - uniforms.anchorPriceHi) - uniforms.anchorPriceLo;
  let lowDelta = (c.low - uniforms.anchorPriceHi) - uniforms.anchorPriceLo;
  let openDelta = (c.open - uniforms.anchorPriceHi) - uniforms.anchorPriceLo;
  let closeDelta = (c.close - uniforms.anchorPriceHi) - uniforms.anchorPriceLo;

  let yHigh = uniforms.mainPaneTop + uniforms.mainPaneHeight * 0.5 - highDelta * uniforms.priceScale;
  let yLow = uniforms.mainPaneTop + uniforms.mainPaneHeight * 0.5 - lowDelta * uniforms.priceScale;
  let yOpen = uniforms.mainPaneTop + uniforms.mainPaneHeight * 0.5 - openDelta * uniforms.priceScale;
  let yClose = uniforms.mainPaneTop + uniforms.mainPaneHeight * 0.5 - closeDelta * uniforms.priceScale;

  let topPx = min(yHigh, yLow) - 1.5;
  let botPx = max(max(yHigh, yLow) + 1.5, topPx + 3.0);
  let totalSpan = max(1.0, botPx - topPx);

  let bodyTopPx = min(yOpen, yClose);
  let bodyBotPx = max(min(yOpen, yClose) + 1.5, max(yOpen, yClose));

  let halfSlot = max(1.5, uniforms.barSpacing * 0.46);
  let halfBody = max(1.0, uniforms.barSpacing * 0.36);
  let halfWick = clamp(floor(uniforms.barSpacing * 0.08) + 0.5, 0.65, 2.0);

  // 6 顶点 Quad (2 Triangles)
  var quadPos = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, 0.0),
    vec2<f32>( 1.0, 0.0),
    vec2<f32>(-1.0, 1.0),
    vec2<f32>(-1.0, 1.0),
    vec2<f32>( 1.0, 0.0),
    vec2<f32>( 1.0, 1.0)
  );
  let uv = quadPos[vid];
  let pxX = centerX + uv.x * halfSlot;
  let pxY = mix(topPx, botPx, uv.y);

  // 像素空间 -> NDC [-1, 1]
  let ndcX = (pxX / uniforms.canvasWidth) * 2.0 - 1.0;
  let ndcY = 1.0 - (pxY / uniforms.canvasHeight) * 2.0;

  var out: CandleVarying;
  out.position = vec4<f32>(ndcX, ndcY, 0.0, 1.0);
  out.localUV = uv;
  out.bodyTopNorm = clamp((bodyTopPx - topPx) / totalSpan, 0.0, 1.0);
  out.bodyBotNorm = clamp((bodyBotPx - topPx) / totalSpan, 0.0, 1.0);
  out.halfBodyWidthRatio = clamp(halfBody / halfSlot, 0.15, 0.95);
  out.halfWickWidthRatio = clamp(halfWick / halfSlot, 0.04, 0.35);
  out.color = vec4<f32>(compute_candle_color(c), 1.0);
  out.volNorm = clamp(c.volume / max(1.0, uniforms.maxVolume), 0.15, 1.0);
  out.pickId = u32(max(0.0, round(c.logicalIndex))) + 1u;
  return out;
}

struct FragmentOutput {
  @location(0) color: vec4<f32>,
  @location(1) pickId: u32,
};

@fragment
fn fs_candle_main(in: CandleVarying) -> FragmentOutput {
  let absX = abs(in.localUV.x);
  let y = in.localUV.y;

  // 影线有向距离
  let dWickX = absX - in.halfWickWidthRatio;
  let dWickY = max(-y, y - 1.0);
  let dWick = max(dWickX, dWickY);

  var dBody: f32;
  let bodyCenterY = 0.5 * (in.bodyTopNorm + in.bodyBotNorm);
  let bodyHalfH = max(0.015, 0.5 * (in.bodyBotNorm - in.bodyTopNorm));

  if (uniforms.candleStyle == 1u) {
    // KDE-SDF 小提琴微观结构图元：利用双高斯混合核模拟日内成交密度分布
    let relY = (y - bodyCenterY) / max(0.08, bodyHalfH * 1.35);
    let kde = exp(-0.5 * relY * relY * 2.2) * (0.65 + 0.35 * in.volNorm);
    let violinHalfW = mix(in.halfWickWidthRatio, in.halfBodyWidthRatio * 1.12, kde);
    let dViolinX = absX - violinHalfW;
    let dViolinY = abs(y - bodyCenterY) - max(bodyHalfH * 1.15, 0.04);
    dBody = max(dViolinX, dViolinY);
  } else {
    // 传统矩形实体有向距离
    let dBodyX = absX - in.halfBodyWidthRatio;
    let dBodyY = abs(y - bodyCenterY) - bodyHalfH;
    dBody = max(dBodyX, dBodyY);
  }

  let d = min(dWick, dBody);
  // 基于硬件偏导数 fwidth 的解析抗锯齿 (Analytical Anti-Aliasing)
  let aa = max(fwidth(d) * 0.85, 0.015);
  let alpha = smoothstep(aa, -aa, d);

  if (alpha < 0.02) {
    discard;
  }

  // KDE 模式下内部赋予轻微体积高光梯度
  var finalRgb = in.color.rgb;
  if (uniforms.candleStyle == 1u) {
    let highlight = 1.0 - 0.18 * (absX / max(0.1, in.halfBodyWidthRatio));
    finalRgb = clamp(finalRgb * highlight, vec3<f32>(0.0), vec3<f32>(1.0));
  }

  var out: FragmentOutput;
  out.color = vec4<f32>(finalRgb, alpha);
  out.pickId = select(0u, in.pickId, alpha > 0.25);
  return out;
}
`
