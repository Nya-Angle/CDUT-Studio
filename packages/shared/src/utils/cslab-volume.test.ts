import { describe, expect, test } from 'bun:test'
import type { CsLabVolumeGrid } from '../types/cslab-vesta-types'
import { extractIsosurfaceCpu } from './cslab-isosurface'
import { parseCube, sampleGrid } from './cslab-volume'

function sphereGrid(size = 24): CsLabVolumeGrid {
  const step = 1 / size
  const values = new Float32Array(size * size * size)
  let offset = 0
  for (let k = 0; k < size; k += 1) {
    for (let j = 0; j < size; j += 1) {
      for (let i = 0; i < size; i += 1) {
        const x = i * step
        const y = j * step
        const z = k * step
        const distance = Math.hypot(x - 0.5, y - 0.5, z - 0.5)
        values[offset] = 0.35 - distance
        offset += 1
      }
    }
  }
  return {
    format: 'cube',
    dimensions: [size, size, size],
    origin: [0, 0, 0],
    voxelVectors: [
      [step, 0, 0],
      [0, step, 0],
      [0, 0, step],
    ],
    values,
    min: -0.5,
    max: 0.35,
    atomCount: 0,
    warnings: [],
  }
}

describe('体数据与等值面', () => {
  test('Given 小型 Cube 文件 When 解析 Then 网格尺寸与数值正确', () => {
    const text = [
      'cube comment 1',
      'cube comment 2',
      '1 0 0 0',
      '2 1 0 0',
      '2 0 1 0',
      '2 0 0 1',
      '6 0 0 0 0',
      '1 2 3 4 5 6 7 8',
    ].join('\n')
    const grid = parseCube(text)
    expect(grid.dimensions).toEqual([2, 2, 2])
    expect(grid.atomCount).toBe(1)
    expect(Array.from(grid.values)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(grid.min).toBe(1)
    expect(grid.max).toBe(8)
  })

  test('Given 球体标量场 When 提取零等值面 Then 顶点位于球面附近', () => {
    const grid = sphereGrid()
    const mesh = extractIsosurfaceCpu(grid, 0)
    expect(mesh.triangleCount).toBeGreaterThan(100)
    expect(mesh.positions.length).toBe(mesh.normals.length)
    let checked = 0
    for (let index = 0; index < mesh.positions.length; index += 3) {
      const x = mesh.positions[index]!
      const y = mesh.positions[index + 1]!
      const z = mesh.positions[index + 2]!
      const distance = Math.hypot(x - 0.5, y - 0.5, z - 0.5)
      expect(Math.abs(distance - 0.35)).toBeLessThan(1 / 24 + 1e-6)
      const nx = mesh.normals[index]!
      const ny = mesh.normals[index + 1]!
      const nz = mesh.normals[index + 2]!
      expect(Math.hypot(nx, ny, nz)).toBeGreaterThan(0.9)
      checked += 1
      if (checked >= 40) break
    }
  })

  test('Given 网格 When 三线性采样 Then 端点返回原始体素值', () => {
    const grid = sphereGrid(8)
    const value = sampleGrid(grid, 0, 0, 0)
    expect(value).toBeCloseTo(grid.values[0]!, 6)
  })
})
