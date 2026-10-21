/**
 * XYZ 结构段解析（纯函数）
 *
 * XYZ 不携带晶胞信息。为支持三维显示，使用原子笛卡尔包围盒 + 5 Å 留白
 * 构造正交晶胞，并明确写入 warning；该近似不得用于 PXRD 或空间群判定。
 */

import type { CsLabCrystalCell } from '../types/cslab'
import type { CsLabCrystalAtom, CsLabStructureParseResult } from '../types/cslab-vesta-types'
import { normalizeElement } from './cslab-cif'
import { cartesianToFractional, cellVolume } from './cslab-crystal'

export class CsLabXyzParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CsLabXyzParseError'
  }
}

export function parseXyz(text: string): CsLabStructureParseResult {
  const lines = text.split(/\r?\n/).map((line) => line.trim())
  const count = Number.parseInt(lines[0] ?? '', 10)
  if (!Number.isFinite(count) || count <= 0) throw new CsLabXyzParseError('XYZ 原子数量非法')

  const warnings: string[] = []
  const rawAtoms: Array<{ element: string; cartesian: [number, number, number] }> = []
  for (let i = 0; i < count; i += 1) {
    const line = lines[2 + i] ?? ''
    const tokens = line.split(/\s+/).filter(Boolean)
    if (tokens.length < 4) throw new CsLabXyzParseError(`XYZ 第 ${3 + i} 行坐标不完整`)
    const element = normalizeElement(tokens[0]!)
    const x = Number.parseFloat(tokens[1]!)
    const y = Number.parseFloat(tokens[2]!)
    const z = Number.parseFloat(tokens[3]!)
    if (![x, y, z].every(Number.isFinite)) {
      throw new CsLabXyzParseError(`XYZ 第 ${3 + i} 行坐标非法`)
    }
    rawAtoms.push({ element, cartesian: [x, y, z] })
  }

  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (const atom of rawAtoms) {
    for (let axis = 0; axis < 3; axis += 1) {
      min[axis] = Math.min(min[axis]!, atom.cartesian[axis]!)
      max[axis] = Math.max(max[axis]!, atom.cartesian[axis]!)
    }
  }

  const padding = 5
  const lengths = [0, 1, 2].map((axis) => Math.max(1, max[axis]! - min[axis]! + padding * 2))
  const cell: CsLabCrystalCell = {
    a: lengths[0]!,
    b: lengths[1]!,
    c: lengths[2]!,
    alpha: 90,
    beta: 90,
    gamma: 90,
    volume: 0,
    spaceGroup: 'P1',
  }
  cell.volume = cellVolume(cell)

  const atoms: CsLabCrystalAtom[] = rawAtoms.map((atom, index) => {
    const shifted: [number, number, number] = [
      atom.cartesian[0] - min[0]! + padding,
      atom.cartesian[1] - min[1]! + padding,
      atom.cartesian[2] - min[2]! + padding,
    ]
    const fractional = cartesianToFractional(cell, shifted)
    if (!fractional) throw new CsLabXyzParseError('XYZ 坐标转换失败')
    return {
      label: `${atom.element}${index + 1}`,
      element: atom.element,
      fractional,
      cartesian: atom.cartesian,
      occupancy: 1,
    }
  })

  warnings.push('XYZ 不含晶胞信息，已使用包围盒正交晶胞近似；不可用于 PXRD 或空间群判定')

  return {
    format: 'xyz',
    cell,
    spaceGroupNumber: 1,
    spaceGroupHm: 'P1',
    symmetryOperations: [],
    atoms,
    warnings,
  }
}
