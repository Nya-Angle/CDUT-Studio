import { describe, expect, test } from 'bun:test'
import { parseCif } from './cslab-cif'
import { parsePoscar, poscarToCif } from './cslab-poscar'

const LATTICE = '5.431 0.0 0.0\n0.0 5.431 0.0\n0.0 0.0 5.431'
const FRACTIONAL = [
  [0, 0, 0],
  [0.5, 0.5, 0],
  [0.5, 0, 0.5],
  [0, 0.5, 0.5],
  [0.25, 0.25, 0.25],
  [0.75, 0.75, 0.25],
  [0.75, 0.25, 0.75],
  [0.25, 0.75, 0.75],
]

function directPoscar(): string {
  return [
    'Silicon diamond',
    '1.0',
    LATTICE,
    'Si',
    '8',
    'Direct',
    ...FRACTIONAL.map((row) => row.join(' ')),
  ].join('\n')
}

function cartesianPoscar(): string {
  return [
    'Silicon diamond',
    '1.0',
    LATTICE,
    'Si',
    '8',
    'Cartesian',
    ...FRACTIONAL.map((row) => row.map((value) => (value * 5.431).toFixed(8)).join(' ')),
  ].join('\n')
}

describe('POSCAR 解析', () => {
  test('Given Direct 硅 When 解析 Then 晶胞与 8 个原子正确', () => {
    const result = parsePoscar(directPoscar())
    expect(result.cell.a).toBeCloseTo(5.431, 6)
    expect(result.cell.alpha).toBeCloseTo(90, 6)
    expect(result.atoms).toHaveLength(8)
    expect(result.atoms.every((atom) => atom.element === 'Si')).toBe(true)
    expect(result.warnings).toHaveLength(0)
  })

  test('Given Direct 与 Cartesian 同一结构 When 对比分数坐标 Then 一致', () => {
    const direct = parsePoscar(directPoscar())
    const cartesian = parsePoscar(cartesianPoscar())
    expect(cartesian.atoms).toHaveLength(direct.atoms.length)
    direct.atoms.forEach((atom, index) => {
      const other = cartesian.atoms[index]!
      for (let axis = 0; axis < 3; axis += 1) {
        expect(other.fractional[axis]).toBeCloseTo(atom.fractional[axis]!, 6)
      }
    })
  })

  test('Given VASP4 无元素行 When 解析 Then 元素未知并给出 warning', () => {
    const text = ['VASP4', '1.0', LATTICE, '2', 'Direct', '0 0 0', '0.5 0.5 0.5'].join('\n')
    const result = parsePoscar(text)
    expect(result.atoms).toHaveLength(2)
    expect(result.warnings.some((warning) => warning.includes('VASP 4'))).toBe(true)
  })
})

describe('POSCAR → CIF 桥接', () => {
  test('Given Direct POSCAR When 转换 Then 晶胞与 8 个 Si 位点写入 CIF', () => {
    const cif = poscarToCif(directPoscar())
    expect(cif).toContain('_cell_length_a 5.431000')
    expect(cif).toContain('_space_group_IT_number 1')
    expect(cif).toContain('_symmetry_Int_Tables_number 1')
    expect(cif).toContain("_space_group_name_H-M_alt 'P 1'")
    expect(cif).toContain("_chemical_formula_sum 'Si8'")
    expect(cif.match(/\nSi\d+ Si /g)).toHaveLength(8)
    expect(cif).toContain('Si5 Si 0.25000000 0.25000000 0.25000000 1.0 0.0100')
  })

  test('Given Cartesian POSCAR When 转换 Then 与 Direct 分数坐标一致', () => {
    const direct = parseCif(poscarToCif(directPoscar()))
    const cartesian = parseCif(poscarToCif(cartesianPoscar()))
    expect(cartesian.atoms).toHaveLength(direct.atoms.length)
    direct.atoms.forEach((atom, index) => {
      const other = cartesian.atoms[index]!
      for (let axis = 0; axis < 3; axis += 1) {
        expect(other.fractional[axis]).toBeCloseTo(atom.fractional[axis]!, 6)
      }
    })
  })

  test('Given 转换后的 CIF When parseCif 回读 Then 晶胞与对称性完整', () => {
    const document = parseCif(poscarToCif(directPoscar()))
    expect(document.cell.a).toBeCloseTo(5.431, 6)
    expect(document.atoms).toHaveLength(8)
    expect(document.spaceGroupNumber).toBe(1)
    expect(document.spaceGroupHm?.replace(/\s+/g, '')).toBe('P1')
    expect(document.symmetryOperations).toEqual(['x, y, z'])
  })

  test('Given VASP4 无元素行 When 转换 Then 使用 X 占位且保留原子数', () => {
    const text = ['VASP4', '1.0', LATTICE, '2', 'Direct', '0 0 0', '0.5 0.5 0.5'].join('\n')
    const document = parseCif(poscarToCif(text))
    expect(document.atoms).toHaveLength(2)
    expect(document.atoms.every((atom) => atom.element === 'X')).toBe(true)
  })

  test('Given 大写元素行 When 转换 Then 元素符号归一为 Si', () => {
    const text = ['Silicon', '1.0', LATTICE, 'SI', '8', 'Direct', ...FRACTIONAL.map((row) => row.join(' '))].join('\n')
    const cif = poscarToCif(text)
    expect(cif).toContain('SI1 Si ')
    expect(cif).toContain("_chemical_formula_sum 'Si8'")
  })
})
