import { describe, expect, test } from 'bun:test'
import type { CsLabCrystalCell } from '../types/cslab'
import { simulatePxrd, atomicFormFactor } from './cslab-pxrd'
import { buildCrystalStructure } from './cslab-symmetry'
import { findSpaceGroupByHm } from './cslab-space-group-data'

const SILICON_CELL: CsLabCrystalCell = {
  a: 5.431,
  b: 5.431,
  c: 5.431,
  alpha: 90,
  beta: 90,
  gamma: 90,
  volume: 5.431 ** 3,
}

function siliconStructure() {
  return buildCrystalStructure({
    format: 'cif',
    cell: SILICON_CELL,
    spaceGroupHm: 'Fd-3m',
    spaceGroupNumber: findSpaceGroupByHm('Fd-3m')?.number,
    symmetryOperations: [],
    atoms: [{ label: 'Si1', element: 'Si', fractional: [0, 0, 0], occupancy: 1 }],
    warnings: [],
  })
}

describe('PXRD 模拟', () => {
  test('Given 硅金刚石结构 When Cu Kα 模拟 Then 前 6 条允许峰位与 NIST SRM 640 一致', () => {
    const pattern = simulatePxrd(siliconStructure(), {
      wavelengthAngstrom: 1.5406,
      minTwoTheta: 20,
      maxTwoTheta: 95,
      fwhmDeg: 0.05,
      maxIndex: 8,
    })
    const strong = pattern.peaks.filter((peak) => peak.relativeIntensity >= 1).slice(0, 6)
    const expected = [28.44, 47.30, 56.12, 69.13, 76.38, 88.03]
    expect(strong.length).toBeGreaterThanOrEqual(6)
    expected.forEach((angle, index) => {
      const actual = strong[index]!.twoTheta
      expect(Math.abs(actual - angle)).toBeLessThan(0.05)
    })
  })

  test('Given 未知元素 When 计算形状因子 Then 回退原子序数并标记', () => {
    const result = atomicFormFactor('Xx', 0.2)
    expect(result.missingCoefficients).toBe(true)
    expect(result.value).toBe(0)
  })

  test('Given 硅结构 When 生成谱线 Then 曲线点数与峰表非空', () => {
    const pattern = simulatePxrd(siliconStructure(), { minTwoTheta: 20, maxTwoTheta: 90 })
    expect(pattern.curve.x.length).toBeGreaterThan(100)
    expect(pattern.curve.x.length).toBe(pattern.curve.y.length)
    expect(pattern.peaks.length).toBeGreaterThan(0)
    expect(pattern.wavelengthAngstrom).toBeCloseTo(1.5406, 6)
  })
})
