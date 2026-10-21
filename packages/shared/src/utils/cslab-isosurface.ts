/**
 * CSLab 等值面提取（CPU，Marching Tetrahedra）
 *
 * 每个体素拆成 6 个四面体，仅 16 种拓扑，避免手写 256 项 Marching Cubes
 * 三角表带来的差错风险；输出为带法线的三角网格。
 */

import type { CsLabIsoMesh, CsLabVolumeGrid } from '../types/cslab-vesta-types'
import { sampleGrid } from './cslab-volume'

const MAX_VERTICES = 5_000_000

type Vec3 = [number, number, number]

const CUBE_CORNERS: Vec3[] = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 1],
]

const TETRAHEDRA: Array<[number, number, number, number]> = [
  [0, 5, 1, 6],
  [0, 1, 2, 6],
  [0, 2, 3, 6],
  [0, 3, 7, 6],
  [0, 7, 4, 6],
  [0, 4, 5, 6],
]

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

function normalize(vector: Vec3): Vec3 {
  const length = Math.hypot(vector[0], vector[1], vector[2])
  if (!(length > 1e-12)) return [0, 0, 0]
  return [vector[0] / length, vector[1] / length, vector[2] / length]
}

function add(left: Vec3, right: Vec3): Vec3 {
  return [left[0] + right[0], left[1] + right[1], left[2] + right[2]]
}

function scale(vector: Vec3, factor: number): Vec3 {
  return [vector[0] * factor, vector[1] * factor, vector[2] * factor]
}

function positionAt(grid: CsLabVolumeGrid, i: number, j: number, k: number): Vec3 {
  const a = grid.voxelVectors[0]
  const b = grid.voxelVectors[1]
  const c = grid.voxelVectors[2]
  return [
    grid.origin[0] + a[0]! * i + b[0]! * j + c[0]! * k,
    grid.origin[1] + a[1]! * i + b[1]! * j + c[1]! * k,
    grid.origin[2] + a[2]! * i + b[2]! * j + c[2]! * k,
  ]
}

interface GradientBasis {
  aStar: Vec3
  bStar: Vec3
  cStar: Vec3
}

function gradientBasis(grid: CsLabVolumeGrid): GradientBasis | null {
  const a = grid.voxelVectors[0] as Vec3
  const b = grid.voxelVectors[1] as Vec3
  const c = grid.voxelVectors[2] as Vec3
  const volume = dot(a, cross(b, c))
  if (!(Math.abs(volume) > 1e-12)) return null
  return {
    aStar: scale(cross(b, c), 1 / volume),
    bStar: scale(cross(c, a), 1 / volume),
    cStar: scale(cross(a, b), 1 / volume),
  }
}

function gradientAt(
  grid: CsLabVolumeGrid,
  basis: GradientBasis | null,
  i: number,
  j: number,
  k: number,
): Vec3 {
  const [nx, ny, nz] = grid.dimensions
  const at = (x: number, y: number, z: number): number =>
    grid.values[Math.max(0, Math.min(nx - 1, x)) + nx * (Math.max(0, Math.min(ny - 1, y)) + ny * Math.max(0, Math.min(nz - 1, z)))]!
  const gx = (at(i + 1, j, k) - at(i - 1, j, k)) / 2
  const gy = (at(i, j + 1, k) - at(i, j - 1, k)) / 2
  const gz = (at(i, j, k + 1) - at(i, j, k - 1)) / 2
  if (!basis) return [gx, gy, gz]
  const gradient: Vec3 = [
    basis.aStar[0] * gx + basis.bStar[0] * gy + basis.cStar[0] * gz,
    basis.aStar[1] * gx + basis.bStar[1] * gy + basis.cStar[1] * gz,
    basis.aStar[2] * gx + basis.bStar[2] * gy + basis.cStar[2] * gz,
  ]
  return normalize(gradient)
}

interface MeshBuilderState {
  positions: number[]
  normals: number[]
  indices: number[]
  vertexMap: Map<string, number>
}

function vertexKey(point: Vec3): string {
  return `${Math.round(point[0] * 100000)},${Math.round(point[1] * 100000)},${Math.round(point[2] * 100000)}`
}

function interpolate(
  grid: CsLabVolumeGrid,
  basis: GradientBasis | null,
  start: Vec3,
  end: Vec3,
  startValue: number,
  endValue: number,
  isovalue: number,
  startIndex: [number, number, number],
  endIndex: [number, number, number],
): { point: Vec3; normal: Vec3 } {
  const denominator = endValue - startValue
  const t = Math.abs(denominator) > 1e-12 ? (isovalue - startValue) / denominator : 0.5
  const point: Vec3 = [
    start[0] + (end[0] - start[0]) * t,
    start[1] + (end[1] - start[1]) * t,
    start[2] + (end[2] - start[2]) * t,
  ]
  const [nx, ny, nz] = grid.dimensions
  const i = Math.max(0, Math.min(nx - 1, Math.round(startIndex[0] + (endIndex[0] - startIndex[0]) * t)))
  const j = Math.max(0, Math.min(ny - 1, Math.round(startIndex[1] + (endIndex[1] - startIndex[1]) * t)))
  const k = Math.max(0, Math.min(nz - 1, Math.round(startIndex[2] + (endIndex[2] - startIndex[2]) * t)))
  return { point, normal: gradientAt(grid, basis, i, j, k) }
}

function addVertex(
  state: MeshBuilderState,
  point: Vec3,
  normal: Vec3,
): number {
  const key = vertexKey(point)
  const existing = state.vertexMap.get(key)
  if (existing !== undefined) return existing
  if (state.positions.length / 3 >= MAX_VERTICES) {
    throw new Error('等值面顶点数超过 500 万，请降低体数据分辨率或调整阈值')
  }
  const index = state.positions.length / 3
  state.positions.push(point[0], point[1], point[2])
  state.normals.push(normal[0], normal[1], normal[2])
  state.vertexMap.set(key, index)
  return index
}

/** CPU Marching Tetrahedra 等值面提取。 */
export function extractIsosurfaceCpu(
  grid: CsLabVolumeGrid,
  isovalue: number,
  phase: 'positive' | 'negative' = isovalue >= 0 ? 'positive' : 'negative',
): CsLabIsoMesh {
  const [nx, ny, nz] = grid.dimensions
  if (nx < 2 || ny < 2 || nz < 2) {
    return {
      positions: new Float32Array(0),
      normals: new Float32Array(0),
      indices: new Uint32Array(0),
      triangleCount: 0,
      isovalue,
      phase,
    }
  }

  const basis = gradientBasis(grid)
  const state: MeshBuilderState = {
    positions: [],
    normals: [],
    indices: [],
    vertexMap: new Map(),
  }

  const valueAt = (i: number, j: number, k: number): number =>
    grid.values[i + nx * (j + ny * k)]!

  for (let k = 0; k < nz - 1; k += 1) {
    for (let j = 0; j < ny - 1; j += 1) {
      for (let i = 0; i < nx - 1; i += 1) {
        const cornerPositions = CUBE_CORNERS.map((corner) =>
          positionAt(grid, i + corner[0], j + corner[1], k + corner[2]),
        )
        const cornerValues = CUBE_CORNERS.map((corner) =>
          valueAt(i + corner[0], j + corner[1], k + corner[2]),
        )
        const cornerIndices = CUBE_CORNERS.map(
          (corner) => [i + corner[0], j + corner[1], k + corner[2]] as [number, number, number],
        )

        for (const tetrahedron of TETRAHEDRA) {
          const points = tetrahedron.map((corner) => cornerPositions[corner]!)
          const values = tetrahedron.map((corner) => cornerValues[corner]!)
          const indices = tetrahedron.map((corner) => cornerIndices[corner]!)
          const inside = values.map((value) => value >= isovalue)
          const insideCount = inside.filter(Boolean).length
          if (insideCount === 0 || insideCount === 4) continue

          const insideIndices = [0, 1, 2, 3].filter((index) => inside[index])
          const outsideIndices = [0, 1, 2, 3].filter((index) => !inside[index])

          const edgeVertex = (insideIndex: number, outsideIndex: number): number => {
            const interpolated = interpolate(
              grid,
              basis,
              points[insideIndex]!,
              points[outsideIndex]!,
              values[insideIndex]!,
              values[outsideIndex]!,
              isovalue,
              indices[insideIndex]!,
              indices[outsideIndex]!,
            )
            return addVertex(state, interpolated.point, interpolated.normal)
          }

          if (insideCount === 1 || insideCount === 3) {
            const single = insideCount === 1 ? insideIndices[0]! : outsideIndices[0]!
            const others = [0, 1, 2, 3].filter((index) => index !== single)
            const a = edgeVertex(single, others[0]!)
            const b = edgeVertex(single, others[1]!)
            const c = edgeVertex(single, others[2]!)
            if (insideCount === 1) state.indices.push(a, b, c)
            else state.indices.push(a, c, b)
            continue
          }

          // 2-2 情况：四边形拆两个三角形
          const i0 = insideIndices[0]!
          const i1 = insideIndices[1]!
          const o0 = outsideIndices[0]!
          const o1 = outsideIndices[1]!
          const a = edgeVertex(i0, o0)
          const b = edgeVertex(i0, o1)
          const c = edgeVertex(i1, o1)
          const d = edgeVertex(i1, o0)
          state.indices.push(a, b, c)
          state.indices.push(a, c, d)
        }
      }
    }
  }

  return {
    positions: new Float32Array(state.positions),
    normals: new Float32Array(state.normals),
    indices: new Uint32Array(state.indices),
    triangleCount: state.indices.length / 3,
    isovalue,
    phase,
  }
}

/** 兼容导出：在不支持 WebGPU 的环境中也可复用三线性采样。 */
export function sampleVolume(grid: CsLabVolumeGrid, x: number, y: number, z: number): number {
  return sampleGrid(grid, x, y, z)
}
