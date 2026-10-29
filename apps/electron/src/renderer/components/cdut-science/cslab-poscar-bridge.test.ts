/**
 * POSCAR → CIF → Mol* cifCore 渲染桥集成测试。
 *
 * 本用例放在 apps/electron 内，因为 molstar 是该包声明的依赖；
 * @profer/shared 本身保持零 Mol* 依赖。
 */

import { describe, expect, test } from 'bun:test'
import { poscarToCif } from '@profer/shared'
import { trajectoryFromCifCore } from 'molstar/lib/mol-model-formats/structure/cif-core'
import { ModelSymmetry } from 'molstar/lib/mol-model-formats/structure/property/symmetry'
import { CIF } from 'molstar/lib/mol-io/reader/cif'

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

async function parseWithMolstar(poscar: string) {
  const reader = await CIF.parse(poscarToCif(poscar)).run()
  if (reader.isError) throw new Error(reader.message)
  return trajectoryFromCifCore(reader.result.blocks[0]!).run()
}

describe('POSCAR 桥接 → Mol* cifCore', () => {
  test('Given Direct POSCAR When 转换并解析 Then 帧/原子/对称性正确', async () => {
    const trajectory = await parseWithMolstar(directPoscar())
    expect(trajectory.frameCount).toBe(1)

    const model = trajectory.representative
    expect(model.atomicHierarchy.atoms._rowCount).toBe(8)

    const symmetry = ModelSymmetry.Provider.get(model)
    expect(symmetry).toBeDefined()
    expect(symmetry!.spacegroup.name).toBe('P 1')
    expect(symmetry!.spacegroup.operators.length).toBe(1)
    expect(Array.from(symmetry!.spacegroup.cell.size)[0]!).toBeCloseTo(5.431, 3)
  })

  test('Given Cartesian POSCAR When 转换并解析 Then 原子数一致', async () => {
    const trajectory = await parseWithMolstar(cartesianPoscar())
    expect(trajectory.frameCount).toBe(1)
    expect(trajectory.representative.atomicHierarchy.atoms._rowCount).toBe(8)
  })
})
