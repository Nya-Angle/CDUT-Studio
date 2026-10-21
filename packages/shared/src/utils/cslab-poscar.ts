/**
 * POSCAR / CONTCAR 解析器（纯函数）
 *
 * 兼容 VASP 5（元素行）与 VASP 4（无元素行）、Direct/Cartesian、
 * Selective dynamics 与负缩放因子（目标体积）。
 */

import type { CsLabCrystalCell } from '../types/cslab'
import type { CsLabCrystalAtom, CsLabStructureParseResult } from '../types/cslab-vesta-types'
import { cartesianToFractional, cellVolume } from './cslab-crystal'

export class CsLabPoscarParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CsLabPoscarParseError'
  }
}

function assertVector(values: number[], label: string): [number, number, number] {
  if (values.length < 3 || values.some((value) => !Number.isFinite(value))) {
    throw new CsLabPoscarParseError(`POSCAR ${label} 解析失败`)
  }
  return [values[0]!, values[1]!, values[2]!]
}

function lengthOf(vector: [number, number, number]): number {
  return Math.hypot(vector[0], vector[1], vector[2])
}

function angleBetween(left: [number, number, number], right: [number, number, number]): number {
  const denominator = lengthOf(left) * lengthOf(right)
  if (denominator < 1e-12) return 0
  const cosine = (left[0] * right[0] + left[1] * right[1] + left[2] * right[2]) / denominator
  return (Math.acos(Math.max(-1, Math.min(1, cosine))) * 180) / Math.PI
}

function determinant(a: [number, number, number], b: [number, number, number], c: [number, number, number]): number {
  return (
    a[0] * (b[1] * c[2] - b[2] * c[1]) -
    a[1] * (b[0] * c[2] - b[2] * c[0]) +
    a[2] * (b[0] * c[1] - b[1] * c[0])
  )
}

function isNumericToken(token: string): boolean {
  return Number.isFinite(Number.parseFloat(token))
}

/** 解析 POSCAR 文本；缺少基本结构时抛出 CsLabPoscarParseError。 */
export function parsePoscar(text: string): CsLabStructureParseResult {
  const lines = text.split(/\r?\n/)
  if (lines.length < 8) throw new CsLabPoscarParseError('POSCAR 行数不足')

  const scale = Number.parseFloat((lines[1] ?? '').trim())
  if (!Number.isFinite(scale) || scale === 0) throw new CsLabPoscarParseError('POSCAR 缩放因子非法')

  const rawA = assertVector(
    (lines[2] ?? '').trim().split(/\s+/).map(Number),
    '晶格矢量 a',
  )
  const rawB = assertVector(
    (lines[3] ?? '').trim().split(/\s+/).map(Number),
    '晶格矢量 b',
  )
  const rawC = assertVector(
    (lines[4] ?? '').trim().split(/\s+/).map(Number),
    '晶格矢量 c',
  )

  const rawVolume = Math.abs(determinant(rawA, rawB, rawC))
  if (rawVolume < 1e-12) throw new CsLabPoscarParseError('POSCAR 晶格体积为零')

  const effectiveScale = scale < 0 ? Math.cbrt(Math.abs(scale) / rawVolume) : scale
  const a = rawA.map((value) => value * effectiveScale) as [number, number, number]
  const b = rawB.map((value) => value * effectiveScale) as [number, number, number]
  const c = rawC.map((value) => value * effectiveScale) as [number, number, number]

  const cell: CsLabCrystalCell = {
    a: lengthOf(a),
    b: lengthOf(b),
    c: lengthOf(c),
    alpha: angleBetween(b, c),
    beta: angleBetween(a, c),
    gamma: angleBetween(a, b),
    volume: 0,
    spaceGroup: 'P1',
  }
  cell.volume = cellVolume(cell)

  const warnings: string[] = []
  const line5 = (lines[5] ?? '').trim()
  const line5Tokens = line5.split(/\s+/).filter(Boolean)
  const hasElementLine = line5Tokens.length > 0 && line5Tokens.some((token) => !isNumericToken(token))

  let elements: string[] = []
  let counts: number[] = []
  let cursor = 6

  if (hasElementLine) {
    elements = line5Tokens
    const countTokens = (lines[6] ?? '').trim().split(/\s+/).filter(Boolean)
    counts = countTokens.map((token) => Number.parseInt(token, 10))
    cursor = 7
  } else {
    counts = line5Tokens.map((token) => Number.parseInt(token, 10))
    warnings.push('POSCAR 为 VASP 4 格式，缺少元素行；元素符号未知，PXRD 结构因子不可用')
    cursor = 6
  }

  if (counts.some((count) => !Number.isFinite(count) || count < 0)) {
    throw new CsLabPoscarParseError('POSCAR 原子数量解析失败')
  }
  const totalAtoms = counts.reduce((sum, count) => sum + count, 0)
  if (totalAtoms <= 0) throw new CsLabPoscarParseError('POSCAR 原子数量为零')

  // 跳过可能存在的 Selective dynamics 行
  let selective = false
  const modeLine = (lines[cursor] ?? '').trim()
  if (/^s/i.test(modeLine)) {
    selective = true
    cursor += 1
  }

  const coordinateMode = (lines[cursor] ?? '').trim()
  if (!/^[dc]/i.test(coordinateMode)) {
    throw new CsLabPoscarParseError('POSCAR 缺少 Direct/Cartesian 坐标模式行')
  }
  const direct = /^d/i.test(coordinateMode)
  cursor += 1

  const atoms: CsLabCrystalAtom[] = []
  let atomIndex = 0
  for (let species = 0; species < counts.length; species += 1) {
    const count = counts[species] ?? 0
    const element = elements[species] ?? `X${species + 1}`
    for (let i = 0; i < count; i += 1) {
      const line = (lines[cursor] ?? '').trim()
      if (!line) {
        throw new CsLabPoscarParseError(`POSCAR 第 ${cursor + 1} 行缺少原子坐标`)
      }
      const tokens = line.split(/\s+/)
      const coords = tokens.slice(0, 3).map(Number)
      const cartesian = assertVector(coords, `原子 ${atomIndex + 1} 坐标`)
      let fractional: [number, number, number]

      if (direct) {
        fractional = cartesian
      } else {
        const scaled: [number, number, number] = [
          cartesian[0] * effectiveScale,
          cartesian[1] * effectiveScale,
          cartesian[2] * effectiveScale,
        ]
        const converted = cartesianToFractional(cell, scaled)
        if (!converted) throw new CsLabPoscarParseError('POSCAR 笛卡尔坐标转换失败')
        fractional = converted
      }

      atoms.push({
        label: `${element}${atomIndex + 1}`,
        element,
        fractional,
        occupancy: 1,
      })
      atomIndex += 1
      cursor += 1
    }
  }

  if (selective) warnings.push('POSCAR 含 Selective dynamics 标记，已忽略固定标志')
  if (elements.length > 0 && elements.length !== counts.length) {
    warnings.push('POSCAR 元素行与原子数量行长度不一致，已按较短者对齐')
  }

  return {
    format: 'poscar',
    cell,
    spaceGroupNumber: 1,
    spaceGroupHm: 'P1',
    symmetryOperations: [],
    atoms,
    warnings,
  }
}
