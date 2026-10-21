/**
 * CIF 解析器（纯函数，主进程 / 渲染进程 / Worker 共用）
 *
 * 支持：
 * - 引号字符串、分号多行文本、`#` 注释、`loop_`、`data_`；
 * - 晶胞参数、空间群 H-M/编号/Hall、显式对称操作；
 * - `_atom_site_*` 原子位点（分数/笛卡尔坐标、占据率、温度因子、Wyckoff）。
 *
 * 红线：只解析文件中真实存在的信息，不猜测缺失原子、不伪造空间群。
 */

import type { CsLabCrystalCell } from '../types/cslab'
import type { CsLabCifDocument, CsLabCrystalAtom } from '../types/cslab-vesta-types'
import { cartesianToFractional, parseCifLattice } from './cslab-crystal'

interface CifLoop {
  tags: string[]
  rows: string[][]
}

interface CifBlock {
  tags: Map<string, string>
  loops: CifLoop[]
}

export class CsLabCifParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CsLabCifParseError'
  }
}

const RESERVED_PREFIXES = ['data_', 'save_', 'stop_', 'global_']

/** CIF 词法分析：保留分号文本块与引号字符串的完整性。 */
export function tokenizeCif(text: string): string[] {
  const tokens: string[] = []
  let index = 0
  const length = text.length

  while (index < length) {
    const char = text[index]!

    if (char === ' ' || char === '\t' || char === '\r' || char === '\n') {
      index += 1
      continue
    }

    if (char === '#') {
      while (index < length && text[index] !== '\n') index += 1
      continue
    }

    if (char === ';' && (index === 0 || text[index - 1] === '\n')) {
      index += 1
      const start = index
      let end = index
      while (index < length) {
        if (text[index] === '\n' && text[index + 1] === ';') {
          end = index
          index += 2
          // 跳过行尾
          while (index < length && text[index] !== '\n') index += 1
          break
        }
        index += 1
      }
      if (end === start && index >= length) end = length
      tokens.push(text.slice(start, end))
      continue
    }

    if (char === "'" || char === '"') {
      const quote = char
      index += 1
      const start = index
      while (index < length && text[index] !== quote) index += 1
      tokens.push(text.slice(start, index))
      index += 1
      continue
    }

    const start = index
    while (
      index < length &&
      text[index] !== ' ' &&
      text[index] !== '\t' &&
      text[index] !== '\r' &&
      text[index] !== '\n'
    ) {
      index += 1
    }
    tokens.push(text.slice(start, index))
  }

  return tokens
}

function isTag(token: string): boolean {
  return token.startsWith('_')
}

function isReserved(token: string): boolean {
  const lower = token.toLowerCase()
  return RESERVED_PREFIXES.some((prefix) => lower.startsWith(prefix))
}

function parseBlock(tokens: string[]): CifBlock {
  const block: CifBlock = { tags: new Map(), loops: [] }
  let index = 0

  while (index < tokens.length) {
    const token = tokens[index]!
    if (isReserved(token)) {
      index += 1
      continue
    }

    if (token.toLowerCase() === 'loop_') {
      index += 1
      const tags: string[] = []
      while (index < tokens.length && isTag(tokens[index]!)) {
        tags.push(tokens[index]!.toLowerCase())
        index += 1
      }
      if (tags.length === 0) continue

      const values: string[] = []
      while (index < tokens.length) {
        const next = tokens[index]!
        if (isReserved(next) || next.toLowerCase() === 'loop_' || isTag(next)) break
        values.push(next)
        index += 1
      }

      const columns = tags.length
      const rows: string[][] = []
      for (let offset = 0; offset + columns <= values.length; offset += columns) {
        rows.push(values.slice(offset, offset + columns))
      }
      if (rows.length > 0) block.loops.push({ tags, rows })
      continue
    }

    if (isTag(token)) {
      const value = tokens[index + 1]
      if (value !== undefined) {
        block.tags.set(token.toLowerCase(), value)
        index += 2
      } else {
        index += 1
      }
      continue
    }

    index += 1
  }

  return block
}

function parseNumber(raw: string | undefined): number | null {
  if (!raw) return null
  const cleaned = raw
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/\(\d+\)\s*$/, '')
  const value = Number.parseFloat(cleaned)
  return Number.isFinite(value) ? value : null
}

function pickTag(tags: Map<string, string>, names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = tags.get(name)
    if (value !== undefined && value.trim().length > 0) return value.trim()
  }
  return undefined
}

/** 从 atom_site label 或 type_symbol 中提取元素符号。 */
export function normalizeElement(raw: string): string {
  const match = /^([A-Za-z]{1,2})/.exec(raw.trim())
  if (!match?.[1]) return raw.trim()
  const letters = match[1]
  return letters.charAt(0).toUpperCase() + letters.slice(1).toLowerCase()
}

function columnIndex(tags: string[], names: readonly string[]): number {
  for (const name of names) {
    const index = tags.indexOf(name)
    if (index >= 0) return index
  }
  return -1
}

function buildCell(block: CifBlock, text: string): CsLabCrystalCell {
  const parsed = parseCifLattice(text)
  if (parsed) return parsed

  // 兜底：直接读取标签，避免因缺少空间群导致整体失败。
  const a = parseNumber(block.tags.get('_cell_length_a'))
  const b = parseNumber(block.tags.get('_cell_length_b'))
  const c = parseNumber(block.tags.get('_cell_length_c'))
  const alpha = parseNumber(block.tags.get('_cell_angle_alpha'))
  const beta = parseNumber(block.tags.get('_cell_angle_beta'))
  const gamma = parseNumber(block.tags.get('_cell_angle_gamma'))
  if (!a || !b || !c || !alpha || !beta || !gamma) {
    throw new CsLabCifParseError('CIF 缺少完整的晶胞参数（a/b/c/α/β/γ）')
  }
  const volume =
    a *
    b *
    c *
    Math.sqrt(
      1 -
        Math.cos((alpha * Math.PI) / 180) ** 2 -
        Math.cos((beta * Math.PI) / 180) ** 2 -
        Math.cos((gamma * Math.PI) / 180) ** 2 +
        2 *
          Math.cos((alpha * Math.PI) / 180) *
          Math.cos((beta * Math.PI) / 180) *
          Math.cos((gamma * Math.PI) / 180),
    )
  return { a, b, c, alpha, beta, gamma, volume }
}

function parseAtoms(block: CifBlock, cell: CsLabCrystalCell, warnings: string[]): CsLabCrystalAtom[] {
  const loop = block.loops.find(
    (item) =>
      item.tags.includes('_atom_site_fract_x') || item.tags.includes('_atom_site_cartn_x'),
  )
  if (!loop) return []

  const labelIndex = columnIndex(loop.tags, ['_atom_site_label'])
  const symbolIndex = columnIndex(loop.tags, ['_atom_site_type_symbol'])
  const fractX = columnIndex(loop.tags, ['_atom_site_fract_x'])
  const fractY = columnIndex(loop.tags, ['_atom_site_fract_y'])
  const fractZ = columnIndex(loop.tags, ['_atom_site_fract_z'])
  const cartX = columnIndex(loop.tags, ['_atom_site_cartn_x'])
  const cartY = columnIndex(loop.tags, ['_atom_site_cartn_y'])
  const cartZ = columnIndex(loop.tags, ['_atom_site_cartn_z'])
  const occupancyIndex = columnIndex(loop.tags, ['_atom_site_occupancy'])
  const uIsoIndex = columnIndex(loop.tags, ['_atom_site_u_iso_or_equiv'])
  const bIsoIndex = columnIndex(loop.tags, ['_atom_site_b_iso_or_equiv'])
  const wyckoffIndex = columnIndex(loop.tags, ['_atom_site_wyckoff_symbol'])
  const multiplicityIndex = columnIndex(loop.tags, ['_atom_site_symmetry_multiplicity'])
  const siteSymmetryIndex = columnIndex(loop.tags, [
    '_atom_site_site_symmetry_order',
    '_atom_site_site_symmetry',
  ])

  const atoms: CsLabCrystalAtom[] = []

  for (const row of loop.rows) {
    const label = (labelIndex >= 0 ? row[labelIndex] : undefined) ?? `atom-${atoms.length + 1}`
    const symbolRaw = (symbolIndex >= 0 ? row[symbolIndex] : undefined) ?? label
    const element = normalizeElement(symbolRaw)

    let fractional: [number, number, number] | null = null
    if (fractX >= 0 && fractY >= 0 && fractZ >= 0) {
      const x = parseNumber(row[fractX])
      const y = parseNumber(row[fractY])
      const z = parseNumber(row[fractZ])
      if (x !== null && y !== null && z !== null) fractional = [x, y, z]
    }

    if (!fractional && cartX >= 0 && cartY >= 0 && cartZ >= 0) {
      const x = parseNumber(row[cartX])
      const y = parseNumber(row[cartY])
      const z = parseNumber(row[cartZ])
      if (x !== null && y !== null && z !== null) {
        const converted = cartesianToFractional(cell, [x, y, z])
        if (converted) fractional = converted
      }
    }

    if (!fractional) {
      warnings.push(`原子 ${label} 缺少可用坐标，已跳过`)
      continue
    }

    const occupancy = occupancyIndex >= 0 ? parseNumber(row[occupancyIndex]) ?? 1 : 1
    const uIso = uIsoIndex >= 0 ? parseNumber(row[uIsoIndex]) ?? undefined : undefined
    const bIsoValue = bIsoIndex >= 0 ? parseNumber(row[bIsoIndex]) ?? undefined : undefined
    const bIso = bIsoValue ?? (uIso !== undefined ? 8 * Math.PI ** 2 * uIso : undefined)

    atoms.push({
      label,
      element,
      fractional,
      occupancy: Number.isFinite(occupancy) ? occupancy : 1,
      uIso,
      bIso,
      wyckoff: wyckoffIndex >= 0 ? row[wyckoffIndex] : undefined,
      multiplicity: multiplicityIndex >= 0 ? parseNumber(row[multiplicityIndex]) ?? undefined : undefined,
      siteSymmetry: siteSymmetryIndex >= 0 ? row[siteSymmetryIndex] : undefined,
    })
  }

  return atoms
}

function parseSymmetryOperations(block: CifBlock): string[] {
  const loop = block.loops.find(
    (item) =>
      item.tags.includes('_symmetry_equiv_pos_as_xyz') ||
      item.tags.includes('_space_group_symop_operation_xyz'),
  )
  if (!loop) return []
  const index = columnIndex(loop.tags, [
    '_symmetry_equiv_pos_as_xyz',
    '_space_group_symop_operation_xyz',
  ])
  if (index < 0) return []
  return loop.rows
    .map((row) => row[index]?.trim() ?? '')
    .filter((value) => value.length > 0)
}

/** 解析 CIF 文本；晶胞缺失时抛出 CsLabCifParseError。 */
export function parseCif(text: string): CsLabCifDocument {
  if (!text.trim()) throw new CsLabCifParseError('CIF 内容为空')
  const tokens = tokenizeCif(text)
  const block = parseBlock(tokens)
  const warnings: string[] = []
  const cell = buildCell(block, text)

  const spaceGroupHm = pickTag(block.tags, [
    '_symmetry_space_group_name_h-m',
    '_space_group_name_h-m_alt',
    '_space_group_name_h-m',
  ])
  const numberRaw = pickTag(block.tags, [
    '_symmetry_int_tables_number',
    '_space_group_it_number',
  ])
  const spaceGroupNumber = parseNumber(numberRaw) ?? undefined
  const hallSymbol = pickTag(block.tags, [
    '_symmetry_space_group_name_hall',
    '_space_group_name_hall',
  ])

  const symmetryOperations = parseSymmetryOperations(block)
  if (symmetryOperations.length === 0 && !spaceGroupHm && spaceGroupNumber === undefined) {
    warnings.push('CIF 未提供空间群信息，将按 P1 处理')
  }

  const atoms = parseAtoms(block, cell, warnings)
  if (atoms.length === 0) warnings.push('CIF 未解析到原子位点')
  if (atoms.some((atom) => atom.occupancy !== 1)) {
    warnings.push('部分原子占据率不为 1，PXRD 强度将按占据率加权')
  }

  return {
    cell,
    spaceGroupHm,
    spaceGroupNumber,
    hallSymbol,
    symmetryOperations,
    atoms,
    warnings,
  }
}
