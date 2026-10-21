import { describe, expect, test } from 'bun:test'
import {
  CSLAB_SPACE_GROUPS,
  findSpaceGroupByHm,
  findSpaceGroupByNumber,
} from './cslab-space-group-data'
import { generateSpaceGroupOperations } from './cslab-symmetry'

describe('空间群数据', () => {
  test('Given 内置数据 When 统计 Then 230 个空间群编号连续无重复', () => {
    expect(CSLAB_SPACE_GROUPS).toHaveLength(230)
    const numbers = CSLAB_SPACE_GROUPS.map((seed) => seed.number)
    expect(new Set(numbers).size).toBe(230)
    expect(Math.min(...numbers)).toBe(1)
    expect(Math.max(...numbers)).toBe(230)
  })

  test('Given 抽查空间群 When 闭包展开 Then 操作数等于一般位置多重度', () => {
    const expected: Record<number, number> = {
      1: 1,
      2: 2,
      14: 4,
      62: 8,
      136: 16,
      221: 48,
      225: 192,
      227: 192,
      229: 96,
      230: 96,
    }
    for (const [numberText, order] of Object.entries(expected)) {
      const seed = findSpaceGroupByNumber(Number(numberText))
      expect(seed).not.toBeNull()
      const operations = generateSpaceGroupOperations(seed!)
      expect(operations.length).toBe(order)
      expect(operations.length).toBe(seed!.order)
      const keys = new Set(operations.map((operation) => operation.id))
      expect(keys.size).toBe(operations.length)
    }
  })

  test('Given H-M 符号大小写与空格差异 When 查找 Then 命中同一空间群', () => {
    expect(findSpaceGroupByHm('P 21/c')?.number).toBe(14)
    expect(findSpaceGroupByHm('P2_1/c')?.number).toBe(14)
    expect(findSpaceGroupByHm('p21/c')?.number).toBe(14)
    expect(findSpaceGroupByHm('Fd-3m')?.number).toBe(227)
  })
})
