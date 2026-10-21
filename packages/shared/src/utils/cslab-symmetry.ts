/**
 * CSLab 对称性引擎（纯函数）
 *
 * - 解析 CIF/生成元 xyz 对称操作；
 * - 对生成元做有限群闭包，支持全 230 空间群；
 * - 等价原子展开、位点对称性、系统消光判定。
 *
 * 红线：空间群无法判定时降级为 P1，并在 source 与 warnings 中如实标注。
 */

import type { CsLabCrystalCell } from '../types/cslab'
import type {
  CsLabCrystalAtom,
  CsLabCrystalStructure,
  CsLabSpaceGroupInfo,
  CsLabSpaceGroupSeed,
  CsLabStructureParseResult,
  CsLabSymmetryOperation,
} from '../types/cslab-vesta-types'
import { periodicDistance } from './cslab-crystal'
import {
  CSLAB_SPACE_GROUPS,
  findSpaceGroupByHm,
  findSpaceGroupByNumber,
} from './cslab-space-group-data'

export class CsLabSymmetryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CsLabSymmetryError'
  }
}

type Rotation = [number, number, number][]
type Translation = [number, number, number]

const IDENTITY_ROTATION: Rotation = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
]

function mod1(value: number): number {
  const result = value % 1
  return result < 0 ? result + 1 : result
}

function roundFraction(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000
}

function operationKey(rotation: Rotation, translation: Translation): string {
  const rot = rotation.flat().join(',')
  const trans = translation.map((value) => Math.round(mod1(value) * 12)).join(',')
  return `${rot}|${trans}`
}

function parseComponent(raw: string): { variable: number; coefficient: number; translation: number } {
  const text = raw.trim().toLowerCase().replace(/\s+/g, '')
  let variable = -1
  let coefficient = 0
  let translation = 0

  const normalized = text.replace(/-/g, '+-')
  const terms = normalized.split('+').filter((term) => term.length > 0)
  if (terms.length === 0) throw new CsLabSymmetryError(`非法对称操作分量: ${raw}`)

  for (const term of terms) {
    if (term === 'x' || term === 'y' || term === 'z') {
      variable = ['x', 'y', 'z'].indexOf(term)
      coefficient += 1
      continue
    }
    if (term === '-x' || term === '-y' || term === '-z') {
      variable = ['x', 'y', 'z'].indexOf(term.slice(1))
      coefficient -= 1
      continue
    }
    const variableMatch = /^([+-]?\d*)([xyz])$/.exec(term)
    if (variableMatch) {
      variable = ['x', 'y', 'z'].indexOf(variableMatch[2]!)
      const value = variableMatch[1] ?? ''
      coefficient += value === '' || value === '+' ? 1 : value === '-' ? -1 : Number.parseInt(value, 10)
      continue
    }
    if (/^[+-]?(\d+\/\d+|\d*\.?\d+)$/.test(term)) {
      const sign = term.startsWith('-') ? -1 : 1
      const body = term.replace(/^[+-]/, '')
      if (body.includes('/')) {
        const [numerator, denominator] = body.split('/').map(Number)
        if (!numerator || !denominator) throw new CsLabSymmetryError(`非法分数: ${raw}`)
        translation += (sign * numerator) / denominator
      } else {
        translation += sign * Number.parseFloat(body)
      }
      continue
    }
    throw new CsLabSymmetryError(`无法解析对称操作分量: ${raw}`)
  }

  return { variable, coefficient, translation }
}

/** 解析形如 `-x,y+1/2,-z+1/2` 的对称操作字符串。 */
export function parseSymmetryOperationXyz(xyz: string): CsLabSymmetryOperation | null {
  const cleaned = xyz.trim().replace(/^['"]|['"]$/g, '')
  const parts = cleaned.split(',')
  if (parts.length !== 3) return null

  const rotation: Rotation = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  const translation: Translation = [0, 0, 0]

  try {
    for (let row = 0; row < 3; row += 1) {
      const parsed = parseComponent(parts[row]!)
      if (parsed.variable < 0) {
        // 纯平移分量不合法
        return null
      }
      rotation[row]![parsed.variable] = parsed.coefficient
      translation[row] = mod1(parsed.translation)
    }
  } catch {
    return null
  }

  const determinant = determinant3(rotation)
  if (Math.abs(determinant) !== 1) return null

  return {
    id: operationKey(rotation, translation),
    xyz: cleaned,
    rotation,
    translation,
  }
}

function determinant3(matrix: Rotation): number {
  const [[a, b, c], [d, e, f], [g, h, i]] = matrix as [
    [number, number, number],
    [number, number, number],
    [number, number, number],
  ]
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
}

function multiplyMatrix(left: Rotation, right: Rotation): Rotation {
  const result: Rotation = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  for (let i = 0; i < 3; i += 1)
    for (let j = 0; j < 3; j += 1)
      for (let k = 0; k < 3; k += 1) result[i]![j]! += left[i]![k]! * right[k]![j]!
  return result
}

function inverseRotation(matrix: Rotation): Rotation {
  const determinant = determinant3(matrix)
  if (Math.abs(determinant) !== 1) throw new CsLabSymmetryError('旋转矩阵不可逆')
  const [[a, b, c], [d, e, f], [g, h, i]] = matrix as [
    [number, number, number],
    [number, number, number],
    [number, number, number],
  ]
  const inverse: Rotation = [
    [(e * i - f * h) / determinant, (c * h - b * i) / determinant, (b * f - c * e) / determinant],
    [(f * g - d * i) / determinant, (a * i - c * g) / determinant, (c * d - a * f) / determinant],
    [(d * h - e * g) / determinant, (b * g - a * h) / determinant, (a * e - b * d) / determinant],
  ]
  return inverse.map((row) => row.map((value) => Math.round(value))) as Rotation
}

/** 组合两个操作：先应用 right，再应用 left。 */
export function composeOperations(
  left: CsLabSymmetryOperation,
  right: CsLabSymmetryOperation,
): CsLabSymmetryOperation {
  const rotation = multiplyMatrix(left.rotation, right.rotation)
  const translation: Translation = [0, 0, 0]
  for (let i = 0; i < 3; i += 1) {
    let value = left.translation[i]!
    for (let j = 0; j < 3; j += 1) value += left.rotation[i]![j]! * right.translation[j]!
    translation[i] = mod1(value)
  }
  return {
    id: operationKey(rotation, translation),
    xyz: formatOperationXyz(rotation, translation),
    rotation,
    translation,
  }
}

function invertOperation(operation: CsLabSymmetryOperation): CsLabSymmetryOperation {
  const rotation = inverseRotation(operation.rotation)
  const translation: Translation = [0, 0, 0]
  for (let i = 0; i < 3; i += 1) {
    let value = 0
    for (let j = 0; j < 3; j += 1) value += rotation[i]![j]! * operation.translation[j]!
    translation[i] = mod1(-value)
  }
  return {
    id: operationKey(rotation, translation),
    xyz: formatOperationXyz(rotation, translation),
    rotation,
    translation,
  }
}

function fractionLabel(value: number): string {
  const twelfths = Math.round(mod1(value) * 12)
  const map: Record<number, string> = {
    0: '',
    1: '1/12',
    2: '1/6',
    3: '1/4',
    4: '1/3',
    5: '5/12',
    6: '1/2',
    7: '7/12',
    8: '2/3',
    9: '3/4',
    10: '5/6',
    11: '11/12',
  }
  return map[twelfths] ?? `${twelfths}/12`
}

function formatOperationXyz(rotation: Rotation, translation: Translation): string {
  const variables = ['x', 'y', 'z']
  return [0, 1, 2]
    .map((row) => {
      const parts: string[] = []
      for (let column = 0; column < 3; column += 1) {
        const coefficient = rotation[row]![column]!
        if (coefficient === 0) continue
        const sign = parts.length === 0 ? (coefficient < 0 ? '-' : '') : coefficient < 0 ? '-' : '+'
        parts.push(`${sign}${variables[column]}`)
      }
      const base = parts.join('') || '0'
      const fraction = fractionLabel(translation[row]!)
      if (!fraction) return base
      return base === '0' ? fraction : `${base}+${fraction}`
    })
    .join(',')
}

const operationCache = new Map<string, CsLabSymmetryOperation[]>()

/** 对生成元做有限群闭包；无生成元时返回仅含恒等操作。 */
export function generateSpaceGroupOperations(
  input: CsLabSpaceGroupSeed | readonly string[],
): CsLabSymmetryOperation[] {
  const isRaw = Array.isArray(input)
  const generators: readonly string[] = isRaw
    ? (input as readonly string[])
    : (input as CsLabSpaceGroupSeed).generators
  const cacheKey = isRaw
    ? `raw:${generators.join(';')}`
    : `seed:${(input as CsLabSpaceGroupSeed).number}`
  const cached = operationCache.get(cacheKey)
  if (cached) return cached

  const identity: CsLabSymmetryOperation = {
    id: operationKey(IDENTITY_ROTATION, [0, 0, 0]),
    xyz: 'x,y,z',
    rotation: IDENTITY_ROTATION,
    translation: [0, 0, 0],
  }

  const parsedGenerators: CsLabSymmetryOperation[] = []
  for (const xyz of generators) {
    const operation = parseSymmetryOperationXyz(xyz)
    if (!operation) throw new CsLabSymmetryError(`无法解析生成元: ${xyz}`)
    parsedGenerators.push(operation)
  }

  const seedSet = [identity, ...parsedGenerators, ...parsedGenerators.map(invertOperation)]
  const seen = new Map<string, CsLabSymmetryOperation>()
  const queue: CsLabSymmetryOperation[] = [identity]
  seen.set(identity.id, identity)

  while (queue.length > 0) {
    const current = queue.shift()!
    for (const generator of seedSet) {
      const next = composeOperations(generator, current)
      if (seen.has(next.id)) continue
      seen.set(next.id, next)
      queue.push(next)
      if (seen.size > 192) {
        throw new CsLabSymmetryError('对称操作闭包超过 192，生成元可能非法')
      }
    }
  }

  const operations = [...seen.values()]
  operationCache.set(cacheKey, operations)
  return operations
}

/** 判定空间群：CIF 显式操作 > CIF 编号 > CIF H-M > P1。 */
export function detectSpaceGroup(
  cifHm?: string,
  cifNumber?: number,
  cifOperations?: readonly string[],
): CsLabSpaceGroupInfo {
  const seedFromNumber = cifNumber !== undefined ? findSpaceGroupByNumber(cifNumber) : null
  const seedFromHm = cifHm ? findSpaceGroupByHm(cifHm) : null
  const seed = seedFromNumber ?? seedFromHm ?? null

  if (cifOperations && cifOperations.length > 0) {
    return {
      number: seed?.number ?? cifNumber,
      symbol: seed?.hm ?? cifHm ?? 'unknown',
      hallSymbol: undefined,
      crystalSystem: seed?.crystalSystem,
      centering: seed?.centering,
      source: 'cif',
    }
  }
  if (seed) {
    return {
      number: seed.number,
      symbol: seed.hm,
      crystalSystem: seed.crystalSystem,
      centering: seed.centering,
      source: 'table',
    }
  }
  const p1 = findSpaceGroupByNumber(1)!
  return {
    number: 1,
    symbol: p1.hm,
    crystalSystem: p1.crystalSystem,
    centering: p1.centering,
    source: 'assumed-p1',
  }
}

/** 从解析结果构建完整晶体结构（判定空间群并生成操作）。 */
export function buildCrystalStructure(
  parsed: CsLabStructureParseResult,
): CsLabCrystalStructure {
  const spaceGroup = detectSpaceGroup(
    parsed.spaceGroupHm,
    parsed.spaceGroupNumber,
    parsed.symmetryOperations,
  )
  const warnings = [...parsed.warnings]

  let operations: CsLabSymmetryOperation[]
  if (parsed.symmetryOperations.length > 0) {
    operations = generateSpaceGroupOperations(parsed.symmetryOperations)
  } else if (spaceGroup.number !== undefined) {
    const seed = findSpaceGroupByNumber(spaceGroup.number)
    operations = seed ? generateSpaceGroupOperations(seed) : generateSpaceGroupOperations(['x,y,z'])
  } else {
    operations = generateSpaceGroupOperations(['x,y,z'])
  }

  if (spaceGroup.source === 'assumed-p1') {
    warnings.push('未能识别空间群，已按 P1 处理；对称性相关结果可能不完整')
  }

  return {
    format: parsed.format ?? 'cif',
    cell: parsed.cell,
    spaceGroup,
    operations,
    atoms: parsed.atoms,
    warnings,
  }
}

export interface ExpandAtomsOptions {
  /** 等价原子去重容差（Å），默认 0.1。 */
  tolerance?: number
  /** 是否包含中心化平移（操作中已含，保留参数用于兼容与显式控制）。 */
  includeCentering?: boolean
}

/** 展开等价原子：对每个输入位点应用全部对称操作并按周期距离去重。 */
export function expandAtoms(
  structure: CsLabCrystalStructure,
  options: ExpandAtomsOptions = {},
): CsLabCrystalAtom[] {
  const tolerance = Math.max(1e-4, options.tolerance ?? 0.1)
  const expanded: CsLabCrystalAtom[] = []

  for (const atom of structure.atoms) {
    const sitePositions: [number, number, number][] = []
    for (const operation of structure.operations) {
      const position: [number, number, number] = [0, 0, 0]
      for (let row = 0; row < 3; row += 1) {
        let value = operation.translation[row]!
        for (let column = 0; column < 3; column += 1) {
          value += operation.rotation[row]![column]! * atom.fractional[column]!
        }
        position[row] = mod1(value)
      }
      const duplicate = sitePositions.some(
        (existing) => periodicDistance(structure.cell, existing, position) < tolerance,
      )
      if (!duplicate) sitePositions.push(position)
    }

    sitePositions.forEach((position, index) => {
      expanded.push({
        ...atom,
        label: sitePositions.length > 1 ? `${atom.label}_${index + 1}` : atom.label,
        fractional: position,
        multiplicity: sitePositions.length,
        wyckoff: atom.wyckoff,
      })
    })
  }

  return expanded
}

/** 位点对称性阶数：保持位点不变的对称操作数量。 */
export function siteSymmetryOrder(
  structure: CsLabCrystalStructure,
  fractional: readonly [number, number, number],
  tolerance = 0.1,
): number {
  let count = 0
  for (const operation of structure.operations) {
    const position: [number, number, number] = [0, 0, 0]
    for (let row = 0; row < 3; row += 1) {
      let value = operation.translation[row]!
      for (let column = 0; column < 3; column += 1) {
        value += operation.rotation[row]![column]! * fractional[column]!
      }
      position[row] = mod1(value)
    }
    if (periodicDistance(structure.cell, position, fractional) < tolerance) count += 1
  }
  return Math.max(1, count)
}

const CENTERING_RULES: Record<string, (h: number, k: number, l: number) => boolean> = {
  P: () => false,
  I: (h, k, l) => (h + k + l) % 2 !== 0,
  F: (h, k, l) => !((h % 2 === 0 && k % 2 === 0 && l % 2 === 0) || (h % 2 !== 0 && k % 2 !== 0 && l % 2 !== 0)),
  A: (_h, k, l) => (k + l) % 2 !== 0,
  B: (h, _k, l) => (h + l) % 2 !== 0,
  C: (h, k) => (h + k) % 2 !== 0,
  R: (h, k, l) => {
    const value = ((-h + k + l) % 3 + 3) % 3
    return value !== 0
  },
}

/** 中心化导致的系统消光；滑移/螺旋消光由结构因子自然给出。 */
export function systematicAbsence(
  h: number,
  k: number,
  l: number,
  spaceGroup: CsLabSpaceGroupInfo,
): { extinct: boolean; reason?: string } {
  const centering = spaceGroup.centering ?? 'P'
  const rule = CENTERING_RULES[centering]
  if (!rule) return { extinct: false }
  if (rule(h, k, l)) {
    return { extinct: true, reason: `${centering} 中心化系统消光` }
  }
  return { extinct: false }
}

/** 归一化晶胞参数（导出便于 UI 复用）。 */
export function cellSignature(cell: Pick<CsLabCrystalCell, 'a' | 'b' | 'c' | 'alpha' | 'beta' | 'gamma'>): string {
  return [cell.a, cell.b, cell.c, cell.alpha, cell.beta, cell.gamma]
    .map((value) => roundFraction(value))
    .join('|')
}

/** 数据结构：空间群种子列表（供 UI 展示与测试）。 */
export const CSLAB_SPACE_GROUP_SEEDS = CSLAB_SPACE_GROUPS
