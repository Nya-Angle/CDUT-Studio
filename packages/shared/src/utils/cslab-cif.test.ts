import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { parseCif } from './cslab-cif'

const RUTILE_PATH = new URL('../../../../demo-data/cdut-science-rutile/rutile-tio2.cif', import.meta.url)

describe('CIF 解析', () => {
  test('Given 金红石演示 CIF When 解析 Then 晶胞与 6 个原子正确', () => {
    const text = readFileSync(RUTILE_PATH, 'utf8')
    const document = parseCif(text)
    expect(document.cell.a).toBeCloseTo(4.5937, 6)
    expect(document.cell.b).toBeCloseTo(4.5937, 6)
    expect(document.cell.c).toBeCloseTo(2.9587, 6)
    expect(document.cell.volume).toBeCloseTo(62.43, 1)
    expect(document.spaceGroupHm?.replace(/\s+/g, '')).toBe('P1')
    expect(document.spaceGroupNumber).toBe(1)
    expect(document.symmetryOperations).toEqual(['x, y, z'])
    expect(document.spaceGroupNumber).toBe(1)
    expect(document.atoms).toHaveLength(6)
    expect(document.atoms.filter((atom) => atom.element === 'Ti')).toHaveLength(2)
    expect(document.atoms.filter((atom) => atom.element === 'O')).toHaveLength(4)
    const oxygen = document.atoms.find((atom) => atom.label === 'O1')
    expect(oxygen?.fractional[0]).toBeCloseTo(0.3047, 6)
    expect(oxygen?.uIso).toBeCloseTo(0.01, 6)
    expect(oxygen?.bIso).toBeCloseTo(8 * Math.PI ** 2 * 0.01, 6)
  })

  test('Given 带不确定度的数值 When 解析 Then 去除括号误差', () => {
    const text = [
      'data_test',
      '_cell_length_a 4.5937(3)',
      '_cell_length_b 4.5937(3)',
      '_cell_length_c 2.9587(2)',
      '_cell_angle_alpha 90.',
      '_cell_angle_beta 90.',
      '_cell_angle_gamma 90.',
    ].join('\n')
    const document = parseCif(text)
    expect(document.cell.a).toBeCloseTo(4.5937, 6)
    expect(document.cell.c).toBeCloseTo(2.9587, 6)
    expect(document.warnings.some((warning) => warning.includes('空间群'))).toBe(true)
  })

  test('Given 缺少晶胞 When 解析 Then 抛出中文错误', () => {
    expect(() => parseCif('data_broken\n_chemical_name_mineral test')).toThrow('CIF 缺少完整的晶胞参数')
  })
})
