/**
 * 指标计算器单元测试：验证 Hit@k / MRR / MAP@10 与官方口径一致。
 */

import { describe, expect, test } from 'bun:test'
import {
  computeAnswerCoverage,
  computeNullRefusalFlags,
  extractKeyUnits,
  isAnswerCovered,
  mean,
  median,
  normalizeText,
  scoreRetrieval,
} from './metrics'

describe('normalizeText', () => {
  test('剔除非字母数字字符并保留 CJK', () => {
    expect(normalizeText('Orbital Dynamics, Inc.')).toBe('orbitaldynamicsinc')
    expect(normalizeText('$1.4 billion')).toBe('14billion')
    expect(normalizeText('拉格朗日中值定理')).toBe('拉格朗日中值定理')
    expect(normalizeText('March 12, 2023')).toBe('march122023')
  })
})

describe('scoreRetrieval', () => {
  test('命中排名第 1 的金标文档 → 全指标满分', () => {
    const score = scoreRetrieval(['a', 'b', 'c'], ['a'])
    expect(score).toEqual({ hitAt4: 1, hitAt10: 1, mrr: 1, mapAt10: 1 })
  })

  test('命中排名第 2 → MRR = 1/2，Hit@4 = 1', () => {
    const score = scoreRetrieval(['x', 'a'], ['a'])
    expect(score.hitAt4).toBe(1)
    expect(score.hitAt10).toBe(1)
    expect(score.mrr).toBeCloseTo(0.5, 6)
    expect(score.mapAt10).toBeCloseTo(1 / 2, 6)
  })

  test('命中排名第 5 → Hit@4 = 0，Hit@10 = 1，MRR = 1/5', () => {
    const score = scoreRetrieval(['x1', 'x2', 'x3', 'x4', 'a'], ['a'])
    expect(score.hitAt4).toBe(0)
    expect(score.hitAt10).toBe(1)
    expect(score.mrr).toBeCloseTo(0.2, 6)
    expect(score.mapAt10).toBeCloseTo(1 / 5, 6)
  })

  test('两条金标命中排名 1 与 3 → MAP@10 = (1/1 + 2/3) / 2', () => {
    const score = scoreRetrieval(['a', 'x', 'b'], ['a', 'b'])
    expect(score.hitAt4).toBe(1)
    expect(score.hitAt10).toBe(1)
    expect(score.mrr).toBe(1)
    expect(score.mapAt10).toBeCloseTo((1 + 2 / 3) / 2, 6)
  })

  test('未命中任何金标 → 全为 0', () => {
    const score = scoreRetrieval(['x', 'y'], ['a'])
    expect(score).toEqual({ hitAt4: 0, hitAt10: 0, mrr: 0, mapAt10: 0 })
  })

  test('空金标集合 → 全为 0（防御性）', () => {
    expect(scoreRetrieval(['a'], [])).toEqual({ hitAt4: 0, hitAt10: 0, mrr: 0, mapAt10: 0 })
  })

  test('排名超出 Top-10 的金标不计入', () => {
    const ranked = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'a']
    const score = scoreRetrieval(ranked, ['a'])
    expect(score.hitAt10).toBe(0)
    expect(score.mrr).toBe(0)
  })
})

describe('isAnswerCovered', () => {
  test('答案文本被证据覆盖', () => {
    expect(isAnswerCovered('Orbital Dynamics', 'Orbital Dynamics reported revenue of $2.1 billion.')).toBe(true)
    expect(isAnswerCovered('$1.4 billion', 'Helios reported record revenue of $1.4 billion for 2023.')).toBe(true)
  })

  test('答案文本未被证据覆盖', () => {
    expect(isAnswerCovered('Terra Nova Institute', 'Northwind Energy opened a solar farm in Nevada.')).toBe(false)
  })
})

describe('mean', () => {
  test('空数组返回 0，常规求均值', () => {
    expect(mean([])).toBe(0)
    expect(mean([1, 2, 3])).toBe(2)
  })
})

describe('median', () => {
  test('奇数个取中位，偶数个取中间两数均值，空数组返回 0', () => {
    expect(median([])).toBe(0)
    expect(median([3, 1, 2])).toBe(2)
    expect(median([1, 2, 3, 4])).toBe(2.5)
  })
})

describe('computeNullRefusalFlags', () => {
  test('top-1 分为 0（无结果）判为正确拒答', () => {
    const flags = computeNullRefusalFlags([0], [0.5, 0.6, 0.7])
    expect(flags).toEqual([true])
  })

  test('top-1 分低于参考中位数判为正确拒答，高于则判为误召回', () => {
    // 参考中位数 = 2
    const flags = computeNullRefusalFlags([1, 3], [1, 2, 3])
    expect(flags).toEqual([true, false])
  })

  test('等于中位数视为误召回（严格小于才算拒答）', () => {
    const flags = computeNullRefusalFlags([2], [1, 2, 3])
    expect(flags).toEqual([false])
  })

  test('无参考集时中位数为 0，非零分均判为误召回', () => {
    const flags = computeNullRefusalFlags([0, 0.4], [])
    expect(flags).toEqual([true, false])
  })
})

describe('extractKeyUnits', () => {
  test('日期被归一为单个 YYYYMMDD 高权重单元', () => {
    const units = extractKeyUnits('March 12, 2023')
    expect(units).toHaveLength(1)
    expect(units[0]!.tokens).toEqual(['20230312'])
    expect(units[0]!.weight).toBe(3)
  })

  test('命名实体拆为多词元单元且权重更高', () => {
    const units = extractKeyUnits('Orbital Dynamics')
    const entity = units.find((unit) => unit.tokens.length === 2)
    expect(entity?.tokens).toHaveLength(2)
    expect(entity?.tokens.some((token) => token.startsWith('orbital'))).toBe(true)
    expect(entity?.tokens.some((token) => token.startsWith('dynamic'))).toBe(true)
    expect(entity?.weight).toBe(3)
  })

  test('数量级单位被展开为整数', () => {
    const units = extractKeyUnits('$1.4 billion')
    expect(units.some((unit) => unit.tokens.includes('1400000000'))).toBe(true)
  })
})

describe('computeAnswerCoverage', () => {
  test('整串可逐字匹配时，严格与加权口径同时命中', () => {
    const coverage = computeAnswerCoverage('Orbital Dynamics', 'Orbital Dynamics reported revenue of $2.1 billion.')
    expect(coverage.strict).toBe(true)
    expect(coverage.token).toBe(1)
  })

  test('答案信息散落在证据中：严格口径落空，加权口径仍判为覆盖', () => {
    const coverage = computeAnswerCoverage(
      'Orbital Dynamics 2023',
      'Orbital Dynamics reported revenue for its 2023 fiscal year.',
    )
    expect(coverage.strict).toBe(false)
    expect(coverage.token).toBe(1)
  })

  test('数量级写法不同（1.4 billion / 1,400,000,000）仍可匹配', () => {
    const coverage = computeAnswerCoverage('$1.4 billion', 'Helios reported revenue of 1,400,000,000 dollars in 2023.')
    expect(coverage.token).toBe(1)
  })

  test('答案关键实体完全缺失时，加权覆盖率显著低于 1', () => {
    const coverage = computeAnswerCoverage(
      'Terra Nova Institute',
      'Northwind Energy opened a solar farm in Nevada.',
    )
    expect(coverage.strict).toBe(false)
    expect(coverage.token).toBeLessThan(1)
  })

  test('日期答案与等价日期写法互相匹配', () => {
    const coverage = computeAnswerCoverage('September 4, 2023', 'The launch was delayed on 2023-09-04.')
    expect(coverage.token).toBe(1)
  })
})
