import { describe, expect, test } from 'bun:test'
import { parsePoscar } from './cslab-poscar'

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
