/**
 * CSLab WebGPU 等值面提取
 *
 * 优先使用 WGSL Compute Shader；设备不可用或执行失败时返回 null，
 * 由调用方自动回退到 Worker CPU Marching Tetrahedra。
 *
 * 说明：为避免引入 @webgpu/types 依赖，这里对 WebGPU 对象使用局部 any。
 */

import type { CsLabIsoMesh, CsLabVolumeGrid } from '@profer/shared'
import { downsampleGrid } from '@profer/shared'
import isosurfaceWgsl from './isosurface.wgsl?raw'

const MAX_DIMENSION = 256
const MAX_VERTICES = 2_000_000

type Vec3 = [number, number, number]

function cross(left: Vec3, right: Vec3): Vec3 {
  return [
    left[1] * right[2] - left[2] * right[1],
    left[2] * right[0] - left[0] * right[2],
    left[0] * right[1] - left[1] * right[0],
  ]
}

function dot(left: Vec3, right: Vec3): number {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2]
}

function reciprocalBasis(grid: CsLabVolumeGrid): { a: Vec3; b: Vec3; c: Vec3 } | null {
  const a = grid.voxelVectors[0] as Vec3
  const b = grid.voxelVectors[1] as Vec3
  const c = grid.voxelVectors[2] as Vec3
  const volume = dot(a, cross(b, c))
  if (!(Math.abs(volume) > 1e-12)) return null
  return {
    a: cross(b, c).map((value) => value / volume) as Vec3,
    b: cross(c, a).map((value) => value / volume) as Vec3,
    c: cross(a, b).map((value) => value / volume) as Vec3,
  }
}

function buildParams(grid: CsLabVolumeGrid, isovalue: number): Float32Array {
  const buffer = new Float32Array(36)
  const dims = new Uint32Array(buffer.buffer, 0, 4)
  dims[0] = grid.dimensions[0]
  dims[1] = grid.dimensions[1]
  dims[2] = grid.dimensions[2]
  buffer[4] = isovalue
  buffer[8] = grid.origin[0]
  buffer[9] = grid.origin[1]
  buffer[10] = grid.origin[2]
  buffer[12] = grid.voxelVectors[0][0] ?? 0
  buffer[13] = grid.voxelVectors[0][1] ?? 0
  buffer[14] = grid.voxelVectors[0][2] ?? 0
  buffer[16] = grid.voxelVectors[1][0] ?? 0
  buffer[17] = grid.voxelVectors[1][1] ?? 0
  buffer[18] = grid.voxelVectors[1][2] ?? 0
  buffer[20] = grid.voxelVectors[2][0] ?? 0
  buffer[21] = grid.voxelVectors[2][1] ?? 0
  buffer[22] = grid.voxelVectors[2][2] ?? 0
  const reciprocal = reciprocalBasis(grid)
  if (reciprocal) {
    buffer[24] = reciprocal.a[0]
    buffer[25] = reciprocal.a[1]
    buffer[26] = reciprocal.a[2]
    buffer[28] = reciprocal.b[0]
    buffer[29] = reciprocal.b[1]
    buffer[30] = reciprocal.b[2]
    buffer[32] = reciprocal.c[0]
    buffer[33] = reciprocal.c[1]
    buffer[34] = reciprocal.c[2]
  }
  return buffer
}

let devicePromise: Promise<any | null> | null = null

async function getDevice(): Promise<any | null> {
  if (typeof navigator === 'undefined' || !('gpu' in navigator)) return null
  if (!devicePromise) {
    devicePromise = (async () => {
      try {
        const adapter = await (navigator as unknown as { gpu: any }).gpu.requestAdapter()
        if (!adapter) return null
        return await adapter.requestDevice()
      } catch {
        return null
      }
    })()
  }
  return devicePromise
}

export async function isWebGpuAvailable(): Promise<boolean> {
  return (await getDevice()) !== null
}

/** 使用 WebGPU 提取等值面；任何失败返回 null。 */
export async function extractIsosurfaceWebGpu(
  grid: CsLabVolumeGrid,
  isovalue: number,
): Promise<CsLabIsoMesh | null> {
  const device = await getDevice()
  if (!device) return null

  const prepared = downsampleGrid(grid, MAX_DIMENSION).grid
  const [nx, ny, nz] = prepared.dimensions
  if (nx < 2 || ny < 2 || nz < 2) return null

  const cells = (nx - 1) * (ny - 1) * (nz - 1)
  // 每个四面体最多 2 个三角形，6 个四面体 → 单个体素最多 36 个顶点
  const vertexCapacity = Math.max(3, Math.min(MAX_VERTICES, cells * 12))
  const buffers: any[] = []

  try {
    const volumeBuffer = device.createBuffer({
      size: prepared.values.byteLength,
      usage: (globalThis as any).GPUBufferUsage?.STORAGE | (globalThis as any).GPUBufferUsage?.COPY_DST,
    })
    buffers.push(volumeBuffer)
    device.queue.writeBuffer(volumeBuffer, 0, prepared.values)

    const params = buildParams(prepared, isovalue)
    const paramsBuffer = device.createBuffer({
      size: params.byteLength,
      usage: (globalThis as any).GPUBufferUsage?.UNIFORM | (globalThis as any).GPUBufferUsage?.COPY_DST,
    })
    buffers.push(paramsBuffer)
    device.queue.writeBuffer(paramsBuffer, 0, params)

    const verticesBuffer = device.createBuffer({
      size: vertexCapacity * 6 * 4,
      usage: (globalThis as any).GPUBufferUsage?.STORAGE | (globalThis as any).GPUBufferUsage?.COPY_SRC,
    })
    buffers.push(verticesBuffer)

    const counterBuffer = device.createBuffer({
      size: 8,
      usage:
        (globalThis as any).GPUBufferUsage?.STORAGE |
        (globalThis as any).GPUBufferUsage?.COPY_SRC |
        (globalThis as any).GPUBufferUsage?.COPY_DST,
    })
    buffers.push(counterBuffer)
    device.queue.writeBuffer(counterBuffer, 0, new Uint32Array([0, 0]))

    const counterStaging = device.createBuffer({
      size: 8,
      usage: (globalThis as any).GPUBufferUsage?.MAP_READ | (globalThis as any).GPUBufferUsage?.COPY_DST,
    })
    buffers.push(counterStaging)

    const module = device.createShaderModule({ code: isosurfaceWgsl })
    const pipeline = device.createComputePipeline({
      layout: 'auto',
      compute: { module, entryPoint: 'main' },
    })
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: volumeBuffer } },
        { binding: 1, resource: { buffer: paramsBuffer } },
        { binding: 2, resource: { buffer: verticesBuffer } },
        { binding: 3, resource: { buffer: counterBuffer } },
      ],
    })

    const encoder = device.createCommandEncoder()
    const pass = encoder.beginComputePass()
    pass.setPipeline(pipeline)
    pass.setBindGroup(0, bindGroup)
    pass.dispatchWorkgroups(Math.ceil(cells / 64))
    pass.end()
    encoder.copyBufferToBuffer(counterBuffer, 0, counterStaging, 0, 8)
    device.queue.submit([encoder.finish()])

    await counterStaging.mapAsync((globalThis as any).GPUMapMode?.READ)
    const counter = new Uint32Array(counterStaging.getMappedRange().slice(0))
    counterStaging.unmap()
    const vertexCount = Math.min(vertexCapacity, counter[0] ?? 0)
    if (vertexCount < 3) {
      return {
        positions: new Float32Array(0),
        normals: new Float32Array(0),
        indices: new Uint32Array(0),
        triangleCount: 0,
        isovalue,
        phase: isovalue >= 0 ? 'positive' : 'negative',
      }
    }

    const byteLength = vertexCount * 6 * 4
    const vertexStaging = device.createBuffer({
      size: byteLength,
      usage: (globalThis as any).GPUBufferUsage?.MAP_READ | (globalThis as any).GPUBufferUsage?.COPY_DST,
    })
    buffers.push(vertexStaging)
    const copyEncoder = device.createCommandEncoder()
    copyEncoder.copyBufferToBuffer(verticesBuffer, 0, vertexStaging, 0, byteLength)
    device.queue.submit([copyEncoder.finish()])

    await vertexStaging.mapAsync((globalThis as any).GPUMapMode?.READ)
    const interleaved = new Float32Array(vertexStaging.getMappedRange().slice(0))
    vertexStaging.unmap()

    const positions = new Float32Array(vertexCount * 3)
    const normals = new Float32Array(vertexCount * 3)
    for (let index = 0; index < vertexCount; index += 1) {
      const source = index * 6
      positions[index * 3] = interleaved[source] ?? 0
      positions[index * 3 + 1] = interleaved[source + 1] ?? 0
      positions[index * 3 + 2] = interleaved[source + 2] ?? 0
      normals[index * 3] = interleaved[source + 3] ?? 0
      normals[index * 3 + 1] = interleaved[source + 4] ?? 0
      normals[index * 3 + 2] = interleaved[source + 5] ?? 0
    }
    const indices = new Uint32Array(vertexCount)
    for (let index = 0; index < vertexCount; index += 1) indices[index] = index

    return {
      positions,
      normals,
      indices,
      triangleCount: Math.floor(vertexCount / 3),
      isovalue,
      phase: isovalue >= 0 ? 'positive' : 'negative',
    }
  } catch {
    return null
  } finally {
    for (const buffer of buffers) {
      try {
        buffer.destroy()
      } catch {
        // 忽略释放失败
      }
    }
  }
}
