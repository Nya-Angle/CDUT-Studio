/**
 * CSLab 晶体学数学与旁注排程测试
 */

import { describe, expect, test } from 'bun:test'
import {
  assignReflections,
  buildMillerPlane,
  calculateMarginaliaLayout,
  buildConnectorPath,
  cellCenter,
  cellVolume,
  dSpacing,
  enumerateReflections,
  parseCifLattice,
  reciprocalNormal,
  twoThetaFromD,
} from '@profer/shared'

const RUTILE_CIF = `
data_TiO2_rutile
_cell_length_a    4.5937(3)
_cell_length_b    4.5937(3)
_cell_length_c    2.9587(2)
_cell_angle_alpha 90.0
_cell_angle_beta  90.0
_cell_angle_gamma 90.0
_symmetry_space_group_name_H-M   'P 42/m n m'
`

function close(actual: number, expected: number, tolerance: number): boolean {
  return Math.abs(actual - expected) <= tolerance
}

describe('CIF 晶胞解析', () => {
  test('剥离不确定度、解析空间群并计算体积', () => {
    const cell = parseCifLattice(RUTILE_CIF)
    expect(cell).not.toBeNull()
    expect(cell!.a).toBeCloseTo(4.5937, 4)
    expect(cell!.b).toBeCloseTo(4.5937, 4)
    expect(cell!.c).toBeCloseTo(2.9587, 4)
    expect(cell!.alpha).toBe(90)
    expect(cell!.spaceGroup).toBe('P 42/m n m')
    expect(close(cell!.volume, 4.5937 * 4.5937 * 2.9587, 1e-2)).toBe(true)
  })

  test('缺失字段 / PDB 文本返回 null', () => {
    expect(parseCifLattice('data_x\n_cell_length_a 4.0\n')).toBeNull()
    expect(parseCifLattice('ATOM      1  N   ALA A   1      11.104   6.134  -6.504')).toBeNull()
    expect(parseCifLattice('')).toBeNull()
  })

  test('三斜体积与晶胞中心', () => {
    const triclinic = { a: 5, b: 6, c: 7, alpha: 80, beta: 85, gamma: 75 }
    const volume = cellVolume(triclinic)
    expect(volume).toBeGreaterThan(150)
    expect(volume).toBeLessThan(230)
    const center = cellCenter(triclinic)
    expect(center.every((value) => Number.isFinite(value))).toBe(true)
  })
})

describe('晶面间距与 2θ', () => {
  const cell = parseCifLattice(RUTILE_CIF)!

  test('rutile (110) 的 d 与 2θ（Cu Kα）', () => {
    const d = dSpacing(cell, 1, 1, 0)
    expect(d).toBeCloseTo(4.5937 / Math.SQRT2, 3)
    const theta = twoThetaFromD(d, 1.5406)
    expect(close(theta, 27.44, 0.08)).toBe(true)
  })

  test('2θ 反查晶面并返回误差最小的 (110)', () => {
    const matches = assignReflections(27.44, cell, { maxIndex: 6, toleranceDeg: 0.35 })
    expect(matches.length).toBeGreaterThan(0)
    expect(matches[0]!.h).toBe(1)
    expect(matches[0]!.k).toBe(1)
    expect(matches[0]!.l).toBe(0)
    expect(matches[0]!.delta).toBeLessThan(0.35)
  })

  test('容差外无匹配（诚实返回空数组）', () => {
    const matches = assignReflections(20, cell, { maxIndex: 6, toleranceDeg: 0.05 })
    expect(matches).toEqual([])
  })
})

describe('晶面枚举（Bragg 截断）', () => {
  const cell = parseCifLattice(RUTILE_CIF)!

  test('按 2θ 区间返回升序晶面并命中 rutile (110)', () => {
    const list = enumerateReflections(cell, {
      maxIndex: 12,
      minTwoTheta: 20,
      maxTwoTheta: 60,
      limit: 40,
    })
    expect(list.length).toBeGreaterThan(0)
    expect(list.length).toBeLessThanOrEqual(40)
    expect(list.every((item) => item.twoTheta >= 20 && item.twoTheta <= 60)).toBe(true)
    for (let index = 1; index < list.length; index += 1) {
      expect(list[index]!.twoTheta).toBeGreaterThanOrEqual(list[index - 1]!.twoTheta)
    }
    const rutile110 = list.find((item) => item.h === 1 && item.k === 1 && item.l === 0)
    expect(rutile110).toBeTruthy()
    expect(close(rutile110!.twoTheta, 27.44, 0.1)).toBe(true)
  })

  test('正反晶面族去重且不返回 (000)', () => {
    const list = enumerateReflections(cell, { maxIndex: 12, limit: 500 })
    expect(list.some((item) => item.h === 0 && item.k === 0 && item.l === 0)).toBe(false)
    const keys = list.map((item) => {
      const sign =
        item.h > 0 || (item.h === 0 && (item.k > 0 || (item.k === 0 && item.l > 0))) ? 1 : -1
      return `${item.h * sign},${item.k * sign},${item.l * sign}`
    })
    expect(new Set(keys).size).toBe(keys.length)
  })
})

describe('倒易点阵法向量', () => {
  const cell = parseCifLattice(RUTILE_CIF)!

  test('四方晶系 (110) 法向量为归一化 [1,1,0]', () => {
    const normal = reciprocalNormal(cell, 1, 1, 0)
    expect(normal).not.toBeNull()
    expect(close(normal![0], Math.SQRT1_2, 1e-6)).toBe(true)
    expect(close(normal![1], Math.SQRT1_2, 1e-6)).toBe(true)
    expect(close(normal![2], 0, 1e-6)).toBe(true)
    expect(close(Math.hypot(...normal!), 1, 1e-9)).toBe(true)
  })

  test('buildMillerPlane 组合 d / 法向量 / 2θ', () => {
    const plane = buildMillerPlane(cell, 1, 1, 0, 1.5406)
    expect(plane).not.toBeNull()
    expect(plane!.h).toBe(1)
    expect(plane!.d).toBeCloseTo(4.5937 / Math.SQRT2, 3)
    expect(plane!.twoTheta).toBeDefined()
  })
})

describe('旁注一维重力松弛', () => {
  test('重叠卡片依次下推并给出引线补偿', () => {
    const layout = calculateMarginaliaLayout([
      { id: 'a', targetTop: 100, cardHeight: 80 },
      { id: 'b', targetTop: 120, cardHeight: 80 },
      { id: 'c', targetTop: 400, cardHeight: 80 },
    ])
    expect(layout.map((item) => item.id)).toEqual(['a', 'b', 'c'])
    expect(layout[0]!.actualTop).toBe(100)
    expect(layout[0]!.connectorOffset).toBe(0)
    expect(layout[1]!.actualTop).toBe(196)
    expect(layout[1]!.connectorOffset).toBe(-76)
    // 第三张与第二张不重叠（196 + 80 + 16 = 292 < 400）。
    expect(layout[2]!.actualTop).toBe(400)
    expect(layout[2]!.connectorOffset).toBe(0)
  })

  test('乱序输入仍按锚点排序；非法值被过滤', () => {
    const layout = calculateMarginaliaLayout([
      { id: 'late', targetTop: 300, cardHeight: 40 },
      { id: 'early', targetTop: 50, cardHeight: 40 },
      { id: 'bad', targetTop: Number.NaN, cardHeight: 40 },
    ])
    expect(layout.map((item) => item.id)).toEqual(['early', 'late'])
    expect(layout[0]!.actualTop).toBe(50)
  })

  test('三次贝塞尔引线路径格式稳定', () => {
    const path = buildConnectorPath(10, 20, 110, 80)
    expect(path.startsWith('M 10 20 C')).toBe(true)
    expect(path).toContain('60 20')
    expect(path).toContain('110 80')
  })
})
