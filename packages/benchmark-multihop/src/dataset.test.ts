/**
 * 内置样例自洽性测试：确保 50 题四大题型齐备、证据标题均可命中语料。
 */

import { describe, expect, test } from 'bun:test'
import { EMBEDDED_SAMPLE, validateEmbeddedSample } from './dataset'
import { normalizeText } from './metrics'

describe('内置离线样例', () => {
  test('自洽性校验无误', () => {
    expect(validateEmbeddedSample()).toEqual([])
  })

  test('语料与题量符合设计', () => {
    expect(EMBEDDED_SAMPLE.corpus.length).toBe(18)
    expect(EMBEDDED_SAMPLE.queries.length).toBe(50)
  })

  test('四大题型齐备', () => {
    const counts = new Map<string, number>()
    for (const query of EMBEDDED_SAMPLE.queries) {
      counts.set(query.question_type, (counts.get(query.question_type) ?? 0) + 1)
    }
    expect(counts.get('inference')).toBeGreaterThan(0)
    expect(counts.get('comparison')).toBeGreaterThan(0)
    expect(counts.get('temporal')).toBeGreaterThan(0)
    expect(counts.get('null')).toBeGreaterThan(0)
  })

  test('每条证据标题都能回溯到语料 key', () => {
    const titleIndex = new Map(EMBEDDED_SAMPLE.corpus.map((doc) => [normalizeText(doc.title), doc.key]))
    for (const query of EMBEDDED_SAMPLE.queries) {
      for (const evidence of query.evidence_list) {
        expect(titleIndex.has(normalizeText(evidence.title))).toBe(true)
      }
    }
  })

  test('null query 无证据，其余题型至少两条证据', () => {
    for (const query of EMBEDDED_SAMPLE.queries) {
      if (query.question_type === 'null') expect(query.evidence_list.length).toBe(0)
      else expect(query.evidence_list.length).toBeGreaterThanOrEqual(2)
    }
  })
})
