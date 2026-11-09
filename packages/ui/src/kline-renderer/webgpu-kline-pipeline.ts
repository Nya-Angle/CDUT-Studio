/**
 * @profer/ui/kline-renderer — Tier-2 100% GPU 驻留 WebGPU 渲染管线控制器
 *
 * 完整实现：
 *   1. `navigator.gpu` 硬件探测与设备初始化；
 *   2. Raw SoA/AoS 32-byte 实例缓冲区上传（支持全量与尾部增量 `writeBuffer`）；
 *   3. Compute Pass 执行 `cs_m4_conflation` 并行像素分箱归约并写入 `IndirectDrawArgs`；
 *   4. Render Pass 绑定双颜色附件（`@location(0)` 主交换链纹理 + `@location(1)` `r32uint` 拾取纹理），
 *      通过 `drawIndirect` 零 CPU 回读完成单次 Draw Call 渲染；
 *   5. 异步非阻塞 `pickBarAtPixel(x, y)`：拷贝 1x1 `r32uint` 纹素到 `MAP_READ` Staging Buffer 并 `mapAsync`。
 */

import { splitDoubleToFloat32Pair, type KLineDataStore } from '@profer/shared'
import { KLINE_WGSL_SHADER_SOURCE } from './kline-shaders.wgsl.ts'

// 轻量级 WebGPU 结构化类型声明（避免强依赖外部 @webgpu/types 包即可通过严格 TypeScript 编译）
interface GpuBufferLike {
  destroy(): void
  mapAsync(mode: number, offset?: number, size?: number): Promise<void>
  getMappedRange(offset?: number, size?: number): ArrayBuffer
  unmap(): void
}

interface GpuTextureLike {
  createView(): unknown
  destroy(): void
}

interface GpuCommandEncoderLike {
  beginComputePass(): {
    setPipeline(pipeline: unknown): void
    setBindGroup(index: number, bindGroup: unknown): void
    dispatchWorkgroups(x: number, y?: number, z?: number): void
    end(): void
  }
  beginRenderPass(descriptor: unknown): {
    setPipeline(pipeline: unknown): void
    setBindGroup(index: number, bindGroup: unknown): void
    drawIndirect(indirectBuffer: GpuBufferLike, indirectOffset: number): void
    end(): void
  }
  copyBufferToBuffer(
    src: GpuBufferLike,
    srcOffset: number,
    dst: GpuBufferLike,
    dstOffset: number,
    size: number,
  ): void
  copyTextureToBuffer(
    source: { texture: GpuTextureLike; origin: { x: number; y: number; z: number } },
    destination: { buffer: GpuBufferLike; bytesPerRow: number },
    copySize: { width: number; height: number; depthOrArrayLayers: number },
  ): void
  finish(): unknown
}

interface GpuDeviceLike {
  createShaderModule(descriptor: { code: string }): unknown
  createBuffer(descriptor: { size: number; usage: number; mappedAtCreation?: boolean }): GpuBufferLike
  createTexture(descriptor: {
    size: { width: number; height: number; depthOrArrayLayers?: number }
    format: string
    usage: number
  }): GpuTextureLike
  createBindGroupLayout(descriptor: unknown): unknown
  createPipelineLayout(descriptor: unknown): unknown
  createComputePipeline(descriptor: unknown): unknown
  createRenderPipeline(descriptor: unknown): unknown
  createBindGroup(descriptor: unknown): unknown
  createCommandEncoder(): GpuCommandEncoderLike
  queue: {
    writeBuffer(buffer: GpuBufferLike, bufferOffset: number, data: BufferSource, dataOffset?: number, size?: number): void
    submit(commandBuffers: unknown[]): void
  }
  destroy(): void
}

interface GpuCanvasContextLike {
  configure(config: { device: GpuDeviceLike; format: string; alphaMode?: string }): void
  getCurrentTexture(): GpuTextureLike
}

const GPU_BUFFER_USAGE = {
  MAP_READ: 0x0001,
  COPY_SRC: 0x0004,
  COPY_DST: 0x0008,
  INDEX: 0x0010,
  VERTEX: 0x0020,
  UNIFORM: 0x0040,
  STORAGE: 0x0080,
  INDIRECT: 0x0100,
} as const

const GPU_TEXTURE_USAGE = {
  COPY_SRC: 0x01,
  RENDER_ATTACHMENT: 0x10,
} as const

const GPU_SHADER_STAGE = {
  VERTEX: 0x1,
  FRAGMENT: 0x2,
  COMPUTE: 0x4,
} as const

const GPU_MAP_MODE_READ = 0x0001

export interface WebGPUViewportRenderParams {
  canvasWidth: number
  canvasHeight: number
  mainPaneTop: number
  mainPaneHeight: number
  rightOffsetIdx: number
  barSpacing: number
  rightEdgeX: number
  minPrice: number
  maxPrice: number
  maxVolume: number
  kdeCandle: boolean
  colorScheme: 'cn-red-up' | 'intl-green-up'
  ofiColoring: boolean
  visibleStartIdx: number
  visibleEndIdx: number
  toroidalOffset?: number
  heatmapOpacity?: number
}

/** 检测当前宿主浏览器 / Electron Chromium 是否支持 WebGPU */
export function isWebGPUSupported(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator && Boolean((navigator as unknown as { gpu?: unknown }).gpu)
}

export class WebGPUKLinePipeline {
  private device: GpuDeviceLike | null = null
  private context: GpuCanvasContextLike | null = null
  private format = 'bgra8unorm'

  private uniformBuffer: GpuBufferLike | null = null
  private rawCandleBuffer: GpuBufferLike | null = null
  private conflatedCandleBuffer: GpuBufferLike | null = null
  private indirectBuffer: GpuBufferLike | null = null
  private indirectResetBuffer: GpuBufferLike | null = null
  private pickStagingBuffer: GpuBufferLike | null = null
  private pickTexture: GpuTextureLike | null = null
  private pickTextureWidth = 0
  private pickTextureHeight = 0

  private bindGroupLayout: unknown = null
  private computePipeline: unknown = null
  private renderPipeline: unknown = null
  private bindGroup: unknown = null

  private allocatedCandleCapacity = 0
  private isPickMapping = false
  private disposed = false

  async initialize(canvas: HTMLCanvasElement): Promise<boolean> {
    if (!isWebGPUSupported()) return false
    try {
      const gpu = (navigator as unknown as {
        gpu: {
          requestAdapter(opts?: { powerPreference?: string }): Promise<{ requestDevice(): Promise<GpuDeviceLike> } | null>
          getPreferredCanvasFormat(): string
        }
      }).gpu

      const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' })
      if (!adapter || this.disposed) return false

      const device = await adapter.requestDevice()
      if (this.disposed) {
        device.destroy()
        return false
      }

      const ctx = canvas.getContext('webgpu') as unknown as GpuCanvasContextLike | null
      if (!ctx) return false

      this.device = device
      this.context = ctx
      this.format = gpu.getPreferredCanvasFormat()
      ctx.configure({
        device,
        format: this.format,
        alphaMode: 'premultiplied',
      })

      this.setupPipelines()
      this.ensureCandleCapacity(16384)
      return true
    } catch {
      return false
    }
  }

  private setupPipelines(): void {
    const device = this.device
    if (!device) return

    const shaderModule = device.createShaderModule({ code: KLINE_WGSL_SHADER_SOURCE })

    this.uniformBuffer = device.createBuffer({
      size: 96,
      usage: GPU_BUFFER_USAGE.UNIFORM | GPU_BUFFER_USAGE.COPY_DST,
    })

    this.indirectBuffer = device.createBuffer({
      size: 16,
      usage: GPU_BUFFER_USAGE.STORAGE | GPU_BUFFER_USAGE.INDIRECT | GPU_BUFFER_USAGE.COPY_DST,
    })

    this.indirectResetBuffer = device.createBuffer({
      size: 16,
      usage: GPU_BUFFER_USAGE.COPY_SRC | GPU_BUFFER_USAGE.COPY_DST,
    })
    device.queue.writeBuffer(this.indirectResetBuffer, 0, new Uint32Array([6, 0, 0, 0]))

    this.pickStagingBuffer = device.createBuffer({
      size: 256,
      usage: GPU_BUFFER_USAGE.MAP_READ | GPU_BUFFER_USAGE.COPY_DST,
    })

    const visibilityAll = GPU_SHADER_STAGE.COMPUTE | GPU_SHADER_STAGE.VERTEX | GPU_SHADER_STAGE.FRAGMENT

    this.bindGroupLayout = device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: visibilityAll, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPU_SHADER_STAGE.COMPUTE | GPU_SHADER_STAGE.VERTEX, buffer: { type: 'read-only-storage' } },
        { binding: 2, visibility: GPU_SHADER_STAGE.COMPUTE | GPU_SHADER_STAGE.VERTEX, buffer: { type: 'storage' } },
        { binding: 3, visibility: GPU_SHADER_STAGE.COMPUTE, buffer: { type: 'storage' } },
      ],
    })

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [this.bindGroupLayout],
    })

    this.computePipeline = device.createComputePipeline({
      layout: pipelineLayout,
      compute: {
        module: shaderModule,
        entryPoint: 'cs_m4_conflation',
      },
    })

    this.renderPipeline = device.createRenderPipeline({
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_candle_main',
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fs_candle_main',
        targets: [
          {
            format: this.format,
            blend: {
              color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
              alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
            },
          },
          {
            format: 'r32uint',
          },
        ],
      },
      primitive: {
        topology: 'triangle-list',
      },
    })
  }

  private ensureCandleCapacity(requiredBars: number): void {
    const device = this.device
    if (!device || requiredBars <= this.allocatedCandleCapacity) return

    let nextCap = Math.max(4096, this.allocatedCandleCapacity || 4096)
    while (nextCap < requiredBars) nextCap *= 2

    this.rawCandleBuffer?.destroy()
    this.conflatedCandleBuffer?.destroy()

    const byteSize = nextCap * 32 // 8 x f32 = 32 bytes per bar
    this.rawCandleBuffer = device.createBuffer({
      size: byteSize,
      usage: GPU_BUFFER_USAGE.STORAGE | GPU_BUFFER_USAGE.COPY_DST,
    })
    this.conflatedCandleBuffer = device.createBuffer({
      size: byteSize,
      usage: GPU_BUFFER_USAGE.STORAGE | GPU_BUFFER_USAGE.VERTEX | GPU_BUFFER_USAGE.COPY_DST,
    })

    this.allocatedCandleCapacity = nextCap
    this.bindGroup = device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer } },
        { binding: 1, resource: { buffer: this.rawCandleBuffer } },
        { binding: 2, resource: { buffer: this.conflatedCandleBuffer } },
        { binding: 3, resource: { buffer: this.indirectBuffer } },
      ],
    })
  }

  private ensurePickTexture(width: number, height: number): void {
    const device = this.device
    if (!device) return
    const w = Math.max(1, Math.floor(width))
    const h = Math.max(1, Math.floor(height))
    if (this.pickTexture && this.pickTextureWidth === w && this.pickTextureHeight === h) return

    this.pickTexture?.destroy()
    this.pickTexture = device.createTexture({
      size: { width: w, height: h, depthOrArrayLayers: 1 },
      format: 'r32uint',
      usage: GPU_TEXTURE_USAGE.RENDER_ATTACHMENT | GPU_TEXTURE_USAGE.COPY_SRC,
    })
    this.pickTextureWidth = w
    this.pickTextureHeight = h
  }

  /** 将 KLineDataStore 的 32-byte 对齐 GPU 缓冲区同步至显存 */
  syncStoreToGpu(store: KLineDataStore): void {
    const device = this.device
    if (!device || store.length === 0) return

    this.ensureCandleCapacity(store.length)
    if (!this.rawCandleBuffer) return

    // 将 store 中的数据按着色器 CandleInstance 布局写入显存:
    // [open, high, low, close, volume, ofi, vpin, logicalIndex]
    const n = store.length
    const packed = new Float32Array(n * 8)
    for (let i = 0; i < n; i++) {
      const base = i * 8
      packed[base] = store.open[i]!
      packed[base + 1] = store.high[i]!
      packed[base + 2] = store.low[i]!
      packed[base + 3] = store.close[i]!
      packed[base + 4] = store.volume[i]!
      const maxVol = Math.max(1, store.volume[i]!)
      packed[base + 5] = Math.max(-1, Math.min(1, store.ofi[i]! / maxVol))
      packed[base + 6] = store.vpin[i]!
      packed[base + 7] = i
    }

    device.queue.writeBuffer(
      this.rawCandleBuffer,
      0,
      packed.buffer,
      packed.byteOffset,
      packed.byteLength,
    )
  }

  /** 执行 Compute M4 归约与 Indirect Render Pass */
  renderFrame(store: KLineDataStore, params: WebGPUViewportRenderParams): boolean {
    const device = this.device
    const context = this.context
    if (
      !device ||
      !context ||
      !this.uniformBuffer ||
      !this.indirectBuffer ||
      !this.indirectResetBuffer ||
      !this.computePipeline ||
      !this.renderPipeline ||
      !this.bindGroup ||
      store.length === 0
    ) {
      return false
    }

    this.ensurePickTexture(params.canvasWidth, params.canvasHeight)
    if (!this.pickTexture) return false

    const startIdx = Math.max(0, Math.min(store.length - 1, Math.floor(params.visibleStartIdx)))
    const endIdx = Math.max(startIdx + 1, Math.min(store.length, Math.ceil(params.visibleEndIdx) + 1))
    const totalVisible = Math.max(1, endIdx - startIdx)
    const maxPixelColumns = Math.max(64, Math.floor(params.rightEdgeX / 2))
    const targetBins = Math.min(totalVisible, maxPixelColumns)

    const anchorIndex = store.length - 1 + params.rightOffsetIdx
    const [anchorIndexHi, anchorIndexLo] = splitDoubleToFloat32Pair(anchorIndex)
    const midPrice = 0.5 * (params.minPrice + params.maxPrice)
    const [anchorPriceHi, anchorPriceLo] = splitDoubleToFloat32Pair(midPrice)
    const priceSpan = Math.max(1e-6, params.maxPrice - params.minPrice)
    const priceScale = params.mainPaneHeight / priceSpan

    const uniformData = new ArrayBuffer(80)
    const f32 = new Float32Array(uniformData)
    const u32 = new Uint32Array(uniformData)

    f32[0] = params.canvasWidth
    f32[1] = params.canvasHeight
    f32[2] = params.mainPaneTop
    f32[3] = params.mainPaneHeight
    f32[4] = anchorIndexHi
    f32[5] = anchorIndexLo
    f32[6] = params.barSpacing
    f32[7] = params.rightEdgeX
    f32[8] = anchorPriceHi
    f32[9] = anchorPriceLo
    f32[10] = priceScale
    f32[11] = Math.max(1, params.maxVolume)
    u32[12] = params.kdeCandle ? 1 : 0
    u32[13] = params.ofiColoring
      ? 2
      : params.colorScheme === 'intl-green-up'
        ? 1
        : 0
    f32[14] = params.toroidalOffset ?? 0
    f32[15] = params.heatmapOpacity ?? 0
    u32[16] = startIdx
    u32[17] = endIdx
    u32[18] = store.length
    u32[19] = targetBins

    device.queue.writeBuffer(this.uniformBuffer, 0, uniformData)

    const encoder = device.createCommandEncoder()
    encoder.copyBufferToBuffer(this.indirectResetBuffer, 0, this.indirectBuffer, 0, 16)

    // Pass 1: Compute Shader M4 Conflation
    const computePass = encoder.beginComputePass()
    computePass.setPipeline(this.computePipeline)
    computePass.setBindGroup(0, this.bindGroup)
    computePass.dispatchWorkgroups(Math.max(1, Math.ceil(targetBins / 64)))
    computePass.end()

    // Pass 2: Indirect Render Pass (Color + R32Uint Pick ID)
    const colorView = context.getCurrentTexture().createView()
    const pickView = this.pickTexture.createView()

    const renderPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: colorView,
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
        {
          view: pickView,
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    })
    renderPass.setPipeline(this.renderPipeline)
    renderPass.setBindGroup(0, this.bindGroup)
    renderPass.drawIndirect(this.indirectBuffer, 0)
    renderPass.end()

    device.queue.submit([encoder.finish()])
    return true
  }

  /**
   * 异步非阻塞 1x1 像素 GPU 拾取（零主线程阻塞）
   * @returns 命中的 K 线逻辑索引（未命中时返回 null）
   */
  async pickBarAtPixel(bitmapX: number, bitmapY: number): Promise<number | null> {
    const device = this.device
    const pickTexture = this.pickTexture
    const staging = this.pickStagingBuffer
    if (!device || !pickTexture || !staging || this.isPickMapping) return null

    const x = Math.max(0, Math.min(this.pickTextureWidth - 1, Math.floor(bitmapX)))
    const y = Math.max(0, Math.min(this.pickTextureHeight - 1, Math.floor(bitmapY)))

    this.isPickMapping = true
    try {
      const encoder = device.createCommandEncoder()
      encoder.copyTextureToBuffer(
        { texture: pickTexture, origin: { x, y, z: 0 } },
        { buffer: staging, bytesPerRow: 256 },
        { width: 1, height: 1, depthOrArrayLayers: 1 },
      )
      device.queue.submit([encoder.finish()])

      await staging.mapAsync(GPU_MAP_MODE_READ, 0, 4)
      const mapped = new Uint32Array(staging.getMappedRange(0, 4))
      const rawId = mapped[0] ?? 0
      staging.unmap()
      return rawId > 0 ? rawId - 1 : null
    } catch {
      return null
    } finally {
      this.isPickMapping = false
    }
  }

  dispose(): void {
    this.disposed = true
    this.uniformBuffer?.destroy()
    this.rawCandleBuffer?.destroy()
    this.conflatedCandleBuffer?.destroy()
    this.indirectBuffer?.destroy()
    this.indirectResetBuffer?.destroy()
    this.pickStagingBuffer?.destroy()
    this.pickTexture?.destroy()
    this.device?.destroy()
    this.device = null
    this.context = null
  }
}
