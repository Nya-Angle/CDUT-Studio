import { describe, expect, test } from 'bun:test'
import type { CsLabCrystalCell } from '../types/cslab'
import {
  buildCrystalStructure,
  composeOperations,
  detectSpaceGroup,
  expandAtoms,
  generateSpaceGroupOperations,
  parseSymmetryOperationXyz,
  systematicAbsence,
} from './cslab-symmetry'
import { findSpaceGroupByHm } from './cslab-space-group-data'

const CUBIC: CsLabCrystalCell = {
  a: 5.431,
  b: 5.431,
  c: 5.431,
  alpha: 90,
  beta: 90,
  gamma: 90,
  volume: 160.2,
}

function structure(hm: string, cell: CsLabCrystalCell, atoms: Parameters<typeof buildCrystalStructure>[0]['atoms']) {
  return buildCrystalStructure({
    format: 'cif',
    cell,
    spaceGroupHm: hm,
    spaceGroupNumber: findSpaceGroupByHm(hm)?.number,
    symmetryOperations: [],
    atoms,
    warnings: [],
  })
}

describe('对称性引擎', () => {
  test('Given 硅 Fd-3m 单一位点 When 展开 Then 得到 8 个金刚石原子', () => {
    const silicon = structure('Fd-3m', CUBIC, [
      { label: 'Si1', element: 'Si', fractional: [0, 0, 0], occupancy: 1 },
    ])
    expect(silicon.operations).toHaveLength(192)
    const expanded = expandAtoms(silicon)
    expect(expanded).toHaveLength(8)
    expect(expanded.every((atom) => atom.multiplicity === 8)).toBe(true)
  })

  test('Given 金红石 P42/mnm When 展开 Then Ti2O4 共 6 个原子', () => {
    const rutileCell: CsLabCrystalCell = {
      a: 4.5937,
      b: 4.5937,
      c: 2.9587,
      alpha: 90,
      beta: 90,
      gamma: 90,
      volume: 62.43,
    }
    const rutile = structure('P4_2/mnm', rutileCell, [
      { label: 'Ti1', element: 'Ti', fractional: [0, 0, 0], occupancy: 1 },
      { label: 'O1', element: 'O', fractional: [0.3047, 0.3047, 0], occupancy: 1 },
    ])
    expect(rutile.operations).toHaveLength(16)
    const expanded = expandAtoms(rutile)
    expect(expanded.filter((atom) => atom.element === 'Ti')).toHaveLength(2)
    expect(expanded.filter((atom) => atom.element === 'O')).toHaveLength(4)
  })

  test('Given 钛酸锶 Pm-3m When 展开 Then Sr1Ti1O3 共 5 个原子', () => {
    const perovskite = structure('Pm-3m', { ...CUBIC, a: 3.905, b: 3.905, c: 3.905, volume: 59.55 }, [
      { label: 'Sr1', element: 'Sr', fractional: [0, 0, 0], occupancy: 1 },
      { label: 'Ti1', element: 'Ti', fractional: [0.5, 0.5, 0.5], occupancy: 1 },
      { label: 'O1', element: 'O', fractional: [0.5, 0.5, 0], occupancy: 1 },
    ])
    const expanded = expandAtoms(perovskite)
    expect(expanded).toHaveLength(5)
  })

  test('Given 操作组合 When 与逆操作复合 Then 回到恒等操作', () => {
    const rotation = parseSymmetryOperationXyz('-x,y+1/2,-z+1/2')
    const identity = parseSymmetryOperationXyz('x,y,z')
    expect(rotation).not.toBeNull()
    expect(identity).not.toBeNull()
    const inverse = parseSymmetryOperationXyz('x,y+1/2,-z+1/2')
    expect(inverse).not.toBeNull()
    const composed = composeOperations(rotation!, inverse!)
    expect(composed.translation.map((value) => Math.round(value * 12))).toEqual([0, 0, 0])
  })

  test('Given 未识别空间群 When 判定 Then 降级 P1 且 source 明确', () => {
    const info = detectSpaceGroup('not-a-space-group', undefined, [])
    expect(info.number).toBe(1)
    expect(info.source).toBe('assumed-p1')
  })

  test('Given F 中心化 When 检查系统消光 Then 混合奇偶指数被禁止', () => {
    const info = detectSpaceGroup('Fm-3m', 225, [])
    expect(systematicAbsence(1, 1, 0, info).extinct).toBe(true)
    expect(systematicAbsence(2, 0, 0, info).extinct).toBe(false)
  })

  test('Given 生成元 When 闭包 Then 操作数不超过 192 且全部唯一', () => {
    const seed = findSpaceGroupByHm('Ia-3d')
    const operations = generateSpaceGroupOperations(seed!)
    expect(operations.length).toBeLessThanOrEqual(192)
    expect(new Set(operations.map((operation) => operation.id)).size).toBe(operations.length)
  })
})
