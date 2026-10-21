/**
 * CSLab 体数据解析（纯函数）
 *
 * 支持 Gaussian Cube、VASP CHGCAR / LOCPOT，输出统一的三维规则网格。
 *
 * 限制：
 * - 单文件文本上限由调用方控制；
 * - 体素总数上限 64M，超过直接报错；
 * - 任一方向超过 256 时三线性降采样并写入 warning。
 */

import type { CsLabCrystalCell } from '../types/cslab'
import type {
  CsLabDownsampledGrid,
  CsLabVolumeFormat,
  CsLabVolumeGrid,
} from '../types/cslab-vesta-types'
import { cellBasis } from './cslab-crystal'
import { parsePoscar } from './cslab-poscar'

export class CsLabVolumeParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CsLabVolumeParseError'
  }
}

const MAX_VOXELS = 64_000_000
const MAX_DIMENSION = 256

function isNumericToken(token: string): boolean {
  return Number.isFinite(Number.parseFloat(token))
}

function parseHeaderLine(line: string): number[] {
  return line.trim().split(/\s+/).filter(Boolean).map(Number)
}

/** 从文本中顺序读取 count 个浮点数到一个 Float32Array。 */
function readNumbers(text: string, start: number, count: number): { values: Float32Array; end: number } {
  const values = new Float32Array(count)
  let index = start
  let produced = 0
  const length = text.length

  while (produced < count && index < length) {
    const char = text[index]!
    if (char === ' ' || char === '\t' || char === '\r' || char === '\n' || char === ',') {
      index += 1
      continue
    }
    // 跳过非数值文本（例如 CHGCAR 的增补占据段只会在读取完成后出现）
    const startNumber = index
    if (text[index] === '+' || text[index] === '-') index += 1
    let hasDigit = false
    while (index < length && text[index]! >= '0' && text[index]! <= '9') {
      index += 1
      hasDigit = true
    }
    if (text[index] === '.') {
      index += 1
      while (index < length && text[index]! >= '0' && text[index]! <= '9') {
        index += 1
        hasDigit = true
      }
    }
    if (!hasDigit) {
      index = startNumber + 1
      continue
    }
    if (text[index] === 'e' || text[index] === 'E') {
      index += 1
      if (text[index] === '+' || text[index] === '-') index += 1
      while (index < length && text[index]! >= '0' && text[index]! <= '9') index += 1
    }
    const value = Number.parseFloat(text.slice(startNumber, index))
    if (Number.isFinite(value)) {
      values[produced] = value
      produced += 1
    }
  }

  if (produced < count) throw new CsLabVolumeParseError(`体数据数值不足：期望 ${count}，实际 ${produced}`)
  return { values, end: index }
}

function gridStats(values: Float32Array): { min: number; max: number } {
  let min = Infinity
  let max = -Infinity
  for (let i = 0; i < values.length; i += 1) {
    const value = values[i]!
    if (value < min) min = value
    if (value > max) max = value
  }
  return { min: Number.isFinite(min) ? min : 0, max: Number.isFinite(max) ? max : 0 }
}

/** 解析 Gaussian Cube 文件（多数据集时只取第一个并 warning）。 */
export function parseCube(text: string): CsLabVolumeGrid {
  const lines = text.split(/\r?\n/)
  if (lines.length < 8) throw new CsLabVolumeParseError('Cube 文件行数不足')

  const header = parseHeaderLine(lines[2] ?? '')
  if (header.length < 4) throw new CsLabVolumeParseError('Cube 第三行应为原子数、原点坐标')
  const atomCountRaw = header[0]!
  const atomCount = Math.abs(atomCountRaw)
  const origin: [number, number, number] = [header[1]!, header[2]!, header[3]!]
  const warnings: string[] = []
  if (atomCountRaw < 0) warnings.push('Cube 文件包含多个数据集，仅解析第一个数据集')

  const dimensions: [number, number, number] = [0, 0, 0]
  const voxelVectors: [number[], number[], number[]] = [[], [], []]
  for (let axis = 0; axis < 3; axis += 1) {
    const values = parseHeaderLine(lines[3 + axis] ?? '')
    if (values.length < 4) throw new CsLabVolumeParseError('Cube 网格定义行不完整')
    dimensions[axis] = Math.abs(Math.round(values[0]!))
    voxelVectors[axis] = [values[1]!, values[2]!, values[3]!]
  }

  const total = dimensions[0] * dimensions[1] * dimensions[2]
  if (total <= 0) throw new CsLabVolumeParseError('Cube 网格尺寸非法')
  if (total > MAX_VOXELS) throw new CsLabVolumeParseError(`体素总数 ${total} 超过 64M 上限`)

  let cursor = 0
  let consumed = 0
  while (cursor < lines.length && consumed < 6 + atomCount) {
    if ((lines[cursor] ?? '').trim().length > 0) consumed += 1
    cursor += 1
  }
  const dataText = lines.slice(cursor).join('\n')
  const { values } = readNumbers(dataText, 0, total)
  const stats = gridStats(values)

  return {
    format: 'cube',
    dimensions,
    origin,
    voxelVectors,
    values,
    min: stats.min,
    max: stats.max,
    atomCount,
    warnings,
  }
}

/** 定位 VASP 结构头部之后的第一行（坐标块结束处）。 */
function findVaspDataStart(lines: string[]): number {
  const line5Tokens = (lines[5] ?? '').trim().split(/\s+/).filter(Boolean)
  const hasElementLine = line5Tokens.length > 0 && line5Tokens.some((token) => !isNumericToken(token))
  let cursor = hasElementLine ? 7 : 6
  const countTokens = (lines[hasElementLine ? 6 : 5] ?? '').trim().split(/\s+/).filter(Boolean)
  const totalAtoms = countTokens.reduce((sum, token) => sum + (Number.parseInt(token, 10) || 0), 0)
  if (/^s/i.test((lines[cursor] ?? '').trim())) cursor += 1
  cursor += 1 // 坐标模式行
  return cursor + totalAtoms
}

function parseVaspGrid(text: string, format: CsLabVolumeFormat): CsLabVolumeGrid {
  const parsed = parsePoscar(text)
  const lines = text.split(/\r?\n/)
  let cursor = findVaspDataStart(lines)
  while (cursor < lines.length && (lines[cursor] ?? '').trim().length === 0) cursor += 1

  const gridLine = parseHeaderLine(lines[cursor] ?? '')
  if (gridLine.length < 3) throw new CsLabVolumeParseError('未找到 VASP 网格尺寸行')
  const dimensions: [number, number, number] = [
    Math.abs(Math.round(gridLine[0]!)),
    Math.abs(Math.round(gridLine[1]!)),
    Math.abs(Math.round(gridLine[2]!)),
  ]
  const total = dimensions[0] * dimensions[1] * dimensions[2]
  if (total <= 0) throw new CsLabVolumeParseError('VASP 体数据网格尺寸非法')
  if (total > MAX_VOXELS) throw new CsLabVolumeParseError(`体素总数 ${total} 超过 64M 上限`)

  cursor += 1
  const dataText = lines.slice(cursor).join('\n')
  const { values } = readNumbers(dataText, 0, total)
  const stats = gridStats(values)

  const basis = cellBasis(parsed.cell)
  const voxelVectors: [number[], number[], number[]] = [
    [basis.ax[0] / dimensions[0], basis.ax[1] / dimensions[0], basis.ax[2] / dimensions[0]],
    [basis.bx[0] / dimensions[1], basis.bx[1] / dimensions[1], basis.bx[2] / dimensions[1]],
    [basis.cx[0] / dimensions[2], basis.cx[1] / dimensions[2], basis.cx[2] / dimensions[2]],
  ]

  return {
    format,
    dimensions,
    origin: [0, 0, 0],
    voxelVectors,
    values,
    min: stats.min,
    max: stats.max,
    atomCount: parsed.atoms.length,
    warnings: [
      ...parsed.warnings,
      'CHGCAR/LOCPOT 的 PAW 增补占据段已忽略，仅解析第一组规则网格数值',
    ],
  }
}

export function parseChgcar(text: string): CsLabVolumeGrid {
  return parseVaspGrid(text, 'chgcar')
}

export function parseLocpot(text: string): CsLabVolumeGrid {
  return parseVaspGrid(text, 'locpot')
}

/** 三线性采样（分数坐标 0-1，周期边界）。 */
export function sampleGrid(grid: CsLabVolumeGrid, u: number, v: number, w: number): number {
  const [nx, ny, nz] = grid.dimensions
  const clamp = (value: number): number => {
    const wrapped = value - Math.floor(value)
    return wrapped < 0 ? wrapped + 1 : wrapped
  }
  const x = clamp(u) * nx
  const y = clamp(v) * ny
  const z = clamp(w) * nz
  const x0 = Math.floor(x) % nx
  const y0 = Math.floor(y) % ny
  const z0 = Math.floor(z) % nz
  const x1 = (x0 + 1) % nx
  const y1 = (y0 + 1) % ny
  const z1 = (z0 + 1) % nz
  const fx = x - Math.floor(x)
  const fy = y - Math.floor(y)
  const fz = z - Math.floor(z)
  const at = (i: number, j: number, k: number): number => grid.values[i + nx * (j + ny * k)]!
  const c000 = at(x0, y0, z0)
  const c100 = at(x1, y0, z0)
  const c010 = at(x0, y1, z0)
  const c110 = at(x1, y1, z0)
  const c001 = at(x0, y0, z1)
  const c101 = at(x1, y0, z1)
  const c011 = at(x0, y1, z1)
  const c111 = at(x1, y1, z1)
  const c00 = c000 * (1 - fx) + c100 * fx
  const c10 = c010 * (1 - fx) + c110 * fx
  const c01 = c001 * (1 - fx) + c101 * fx
  const c11 = c011 * (1 - fx) + c111 * fx
  const c0 = c00 * (1 - fy) + c10 * fy
  const c1 = c01 * (1 - fy) + c11 * fy
  return c0 * (1 - fz) + c1 * fz
}

/** 三线性降采样到指定最大边长。 */
export function downsampleGrid(grid: CsLabVolumeGrid, maxDimension = MAX_DIMENSION): CsLabDownsampledGrid {
  const largest = Math.max(...grid.dimensions)
  if (largest <= maxDimension) return { grid, downsampled: false }

  const scale = maxDimension / largest
  const dimensions: [number, number, number] = [
    Math.max(2, Math.floor(grid.dimensions[0] * scale)),
    Math.max(2, Math.floor(grid.dimensions[1] * scale)),
    Math.max(2, Math.floor(grid.dimensions[2] * scale)),
  ]
  const values = new Float32Array(dimensions[0] * dimensions[1] * dimensions[2])
  let offset = 0
  for (let k = 0; k < dimensions[2]; k += 1) {
    for (let j = 0; j < dimensions[1]; j += 1) {
      for (let i = 0; i < dimensions[0]; i += 1) {
        values[offset] = sampleGrid(
          grid,
          i / dimensions[0],
          j / dimensions[1],
          k / dimensions[2],
        )
        offset += 1
      }
    }
  }
  const stats = gridStats(values)
  return {
    grid: {
      ...grid,
      dimensions,
      values,
      min: stats.min,
      max: stats.max,
      warnings: [...grid.warnings, `体数据已从 ${grid.dimensions.join('×')} 降采样到 ${dimensions.join('×')}`],
    },
    downsampled: true,
  }
}

/** 二维剖面（供 UI 预览）。 */
export function gridSlice(
  grid: CsLabVolumeGrid,
  axis: 0 | 1 | 2,
  index: number,
): { width: number; height: number; values: Float32Array } {
  const [nx, ny, nz] = grid.dimensions
  const clamped = Math.max(0, Math.min((axis === 0 ? nx : axis === 1 ? ny : nz) - 1, Math.round(index)))
  if (axis === 0) {
    const values = new Float32Array(ny * nz)
    let offset = 0
    for (let k = 0; k < nz; k += 1) {
      for (let j = 0; j < ny; j += 1) {
        values[offset] = grid.values[clamped + nx * (j + ny * k)]!
        offset += 1
      }
    }
    return { width: ny, height: nz, values }
  }
  if (axis === 1) {
    const values = new Float32Array(nx * nz)
    let offset = 0
    for (let k = 0; k < nz; k += 1) {
      for (let i = 0; i < nx; i += 1) {
        values[offset] = grid.values[i + nx * (clamped + ny * k)]!
        offset += 1
      }
    }
    return { width: nx, height: nz, values }
  }
  const values = new Float32Array(nx * ny)
  let offset = 0
  for (let j = 0; j < ny; j += 1) {
    for (let i = 0; i < nx; i += 1) {
      values[offset] = grid.values[i + nx * (j + ny * clamped)]!
      offset += 1
    }
  }
  return { width: nx, height: ny, values }
}
