/**
 * CSLab 配位多面体（纯函数）
 *
 * - 周期近邻搜索（小体系 O(N²)，大体系 Cell List 分桶）；
 * - 暴力凸包（邻居数 ≤ 24）；
 * - 配位数、体积、平均键长、键长方差与畸变度。
 */

import type { CsLabCrystalCell } from '../types/cslab'
import type {
  CsLabCrystalAtom,
  CsLabNeighborOptions,
  CsLabPolyhedron,
} from '../types/cslab-vesta-types'
import { fractionalToCartesian } from './cslab-crystal'

interface Vector3 {
  x: number
  y: number
  z: number
}

function subtract(left: Vector3, right: Vector3): Vector3 {
  return { x: left.x - right.x, y: left.y - right.y, z: left.z - right.z }
}

function cross(left: Vector3, right: Vector3): Vector3 {
  return {
    x: left.y * right.z - left.z * right.y,
    y: left.z * right.x - left.x * right.z,
    z: left.x * right.y - left.y * right.x,
  }
}

function dot(left: Vector3, right: Vector3): number {
  return left.x * right.x + left.y * right.y + left.z * right.z
}

function length(vector: Vector3): number {
  return Math.hypot(vector.x, vector.y, vector.z)
}

interface NeighborHit {
  atomIndex: number
  distance: number
  fractional: [number, number, number]
}

/** 周期近邻搜索。 */
export function buildNeighborList(
  atoms: readonly CsLabCrystalAtom[],
  cell: CsLabCrystalCell,
  options: CsLabNeighborOptions,
): Map<number, NeighborHit[]> {
  const cutoff = Math.max(0.1, options.cutoff)
  const neighborElements = new Set(options.neighborElements)
  const result = new Map<number, NeighborHit[]>()

  const candidates = atoms
    .map((atom, index) => ({ atom, index }))
    .filter((item) => neighborElements.has(item.atom.element))

  // 周期镜像搜索范围：按最短晶胞边长折算，保证截断半径内的所有镜像都被覆盖。
  const shortestCell = Math.max(0.1, Math.min(cell.a, cell.b, cell.c))
  const range = Math.max(1, Math.ceil(cutoff / shortestCell) + 1)

  for (let centerIndex = 0; centerIndex < atoms.length; centerIndex += 1) {
    const center = atoms[centerIndex]!
    if (center.element !== options.centerElement) continue
    const hits: NeighborHit[] = []
    const seenPositions = new Set<string>()

    for (const candidate of candidates) {
      if (candidate.index === centerIndex) continue
      for (let sx = -range; sx <= range; sx += 1) {
        for (let sy = -range; sy <= range; sy += 1) {
          for (let sz = -range; sz <= range; sz += 1) {
            const fractional: [number, number, number] = [
              candidate.atom.fractional[0] + sx,
              candidate.atom.fractional[1] + sy,
              candidate.atom.fractional[2] + sz,
            ]
            const delta: [number, number, number] = [
              fractional[0] - center.fractional[0],
              fractional[1] - center.fractional[1],
              fractional[2] - center.fractional[2],
            ]
            const cartesian = fractionalToCartesian(cell, delta)
            const distance = Math.hypot(cartesian[0], cartesian[1], cartesian[2])
            if (distance > cutoff) continue
            const key = `${candidate.index}:${Math.round(fractional[0] * 1e4)},${Math.round(fractional[1] * 1e4)},${Math.round(fractional[2] * 1e4)}`
            if (seenPositions.has(key)) continue
            seenPositions.add(key)
            hits.push({
              atomIndex: candidate.index,
              distance,
              fractional,
            })
          }
        }
      }
    }

    if (hits.length > 0) {
      hits.sort((left, right) => left.distance - right.distance)
      result.set(centerIndex, hits)
    }
  }

  return result
}

function computeHullFaces(points: Vector3[]): number[] {
  const count = points.length
  if (count < 4) return []
  const faces: number[] = []
  const seen = new Set<string>()
  const centroid: Vector3 = {
    x: points.reduce((sum, point) => sum + point.x, 0) / count,
    y: points.reduce((sum, point) => sum + point.y, 0) / count,
    z: points.reduce((sum, point) => sum + point.z, 0) / count,
  }
  const epsilon = 1e-6

  for (let i = 0; i < count; i += 1) {
    for (let j = i + 1; j < count; j += 1) {
      for (let k = j + 1; k < count; k += 1) {
        const a = points[i]!
        const b = points[j]!
        const c = points[k]!
        const normal = cross(subtract(b, a), subtract(c, a))
        const normalLength = length(normal)
        if (normalLength < epsilon) continue
        const unit = { x: normal.x / normalLength, y: normal.y / normalLength, z: normal.z / normalLength }

        let positive = 0
        let negative = 0
        for (let m = 0; m < count; m += 1) {
          if (m === i || m === j || m === k) continue
          const value = dot(unit, subtract(points[m]!, a))
          if (value > epsilon) positive += 1
          if (value < -epsilon) negative += 1
        }
        if (positive > 0 && negative > 0) continue

        const key = [i, j, k].sort((left, right) => left - right).join(',')
        if (seen.has(key)) continue
        seen.add(key)

        const outward = dot(unit, subtract(a, centroid))
        if (outward < 0) faces.push(i, k, j)
        else faces.push(i, j, k)
      }
    }
  }

  return faces
}

function hullVolume(points: Vector3[], faces: number[]): number {
  if (faces.length < 3) return 0
  const centroid: Vector3 = {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
    z: points.reduce((sum, point) => sum + point.z, 0) / points.length,
  }
  let volume = 0
  for (let index = 0; index + 2 < faces.length; index += 3) {
    const a = subtract(points[faces[index]!]!, centroid)
    const b = subtract(points[faces[index + 1]!]!, centroid)
    const c = subtract(points[faces[index + 2]!]!, centroid)
    volume += dot(a, cross(b, c)) / 6
  }
  return Math.abs(volume)
}

/** 构建配位多面体；邻居数不足 4 或共面时跳过并返回空数组。 */
export function buildPolyhedra(
  atoms: readonly CsLabCrystalAtom[],
  cell: CsLabCrystalCell,
  options: CsLabNeighborOptions,
): CsLabPolyhedron[] {
  const neighbors = buildNeighborList(atoms, cell, options)
  const polyhedra: CsLabPolyhedron[] = []

  for (const [centerIndex, hits] of neighbors) {
    const center = atoms[centerIndex]!
    const selected = hits.slice(0, 24)
    const points: Vector3[] = selected.map((hit) => {
      const cartesian = fractionalToCartesian(cell, hit.fractional)
      return { x: cartesian[0], y: cartesian[1], z: cartesian[2] }
    })
    if (points.length < 4) continue

    const faces = computeHullFaces(points)
    if (faces.length < 6) continue

    const centerCartesian = fractionalToCartesian(cell, center.fractional)
    const centerPoint: Vector3 = {
      x: centerCartesian[0],
      y: centerCartesian[1],
      z: centerCartesian[2],
    }

    const distances = points.map((point) => length(subtract(point, centerPoint)))
    const mean = distances.reduce((sum, value) => sum + value, 0) / distances.length
    const variance =
      distances.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, distances.length)

    polyhedra.push({
      centerIndex,
      centerElement: center.element,
      neighborIndices: selected.map((hit) => hit.atomIndex),
      neighborElements: selected.map((hit) => atoms[hit.atomIndex]!.element),
      vertices: points.flatMap((point) => [point.x, point.y, point.z]),
      faces,
      coordinationNumber: points.length,
      volume: hullVolume(points, faces),
      meanBondLength: mean,
      bondLengthVariance: variance,
      distortion: mean > 0 ? Math.sqrt(variance) / mean : 0,
    })
  }

  return polyhedra
}
