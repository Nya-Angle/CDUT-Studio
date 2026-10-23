/**
 * T07 评分精确性与轮次闭环回归（JDG-05/06/08/13）。
 * 这些用例直接回放审计报告中的数值与动作，防止退回浮点 toFixed 或可绕过门禁。
 */
import { describe, expect, test } from 'bun:test'
import type { RubricSpec } from '@profer/shared'
import {
  applyT07Action, computeT07Ranking, currentT07Round,
  type T07Action, type T07Context, type T07State,
} from './review-v3-t07-rating-workflow'

const rubric: RubricSpec = {
  dimensions: [{ id: 'd1', name: '综合', min: 0, max: 5, weight: 1 }],
  totalPrecision: 2,
  missingStrategy: 'exclude',
  minEffectiveJudges: 1,
  tieBreaker: 'by-dimension',
  quota: 1,
}

const organizer: T07Context = { actor: { actorId: 'org-1', role: 'organizer', actorSource: 'local' }, at: '2026-10-23T04:00:00Z' }
const judge = (id: string): T07Context => ({ actor: { actorId: id, role: 'judge', actorSource: 'local' }, at: '2026-10-23T04:00:00Z' })

function base(caseIds: string[], override: Partial<RubricSpec> = {}): T07State {
  return {
    batchId: 'b1', rubricVersion: 1, rubric: { ...rubric, ...override },
    cases: caseIds.map((caseId, i) => ({ caseId, blindLabel: `匿名项目 ${i + 1}` })),
    rounds: [{ number: 1, assignments: [], votes: [], divergenceReasons: {}, tieOrders: {} }],
  }
}

function assign(state: T07State, caseId: string, reviewerId: string): T07State {
  return applyT07Action(state, { type: 'assign', caseId, reviewerId, assignmentId: `${caseId}-${reviewerId}` }, organizer)
}
function submit(state: T07State, caseId: string, reviewerId: string, score: number): T07State {
  return applyT07Action(state, {
    type: 'submit', assignmentId: `${caseId}-${reviewerId}`,
    scores: [{ dimensionId: 'd1', score, na: false }], publicFeedback: '',
  }, judge(reviewerId))
}

describe('JDG-05 评分精确性', () => {
  test('单维 2.675、精度 2 与 F08 一致为 2.68，而不是浮点 2.67', () => {
    let s = base(['c1'])
    s = assign(s, 'c1', 'j1')
    s = submit(s, 'c1', 'j1', 2.675)
    expect(computeT07Ranking(s)[0]!.total).toBe(2.68)
  })

  test('多评委均值的定点 half-up 与维度均分一致', () => {
    let s = base(['c1'])
    s = assign(s, 'c1', 'j1'); s = assign(s, 'c1', 'j2')
    s = submit(s, 'c1', 'j1', 2.675); s = submit(s, 'c1', 'j2', 2.675)
    const row = computeT07Ranking(s)[0]!
    expect(row.total).toBe(2.68)
    expect(row.dimensions[0]!.average).toBe(2.68)
  })
})

describe('JDG-06 按维度同分可闭环', () => {
  test('组织者可指定同分维度，随后按该维度打破同分并冻结', () => {
    const twoDims: RubricSpec = {
      ...rubric,
      dimensions: [
        { id: 'd1', name: '学业', min: 0, max: 5, weight: 1 },
        { id: 'd2', name: '实践', min: 0, max: 5, weight: 1 },
      ],
    }
    let s: T07State = { ...base(['c1', 'c2']), rubric: twoDims }
    s = assign(s, 'c1', 'j1'); s = assign(s, 'c2', 'j2')
    const score = (a: number, b: number) => [
      { dimensionId: 'd1', score: a, na: false },
      { dimensionId: 'd2', score: b, na: false },
    ]
    s = applyT07Action(s, { type: 'submit', assignmentId: 'c1-j1', scores: score(3, 1), publicFeedback: '' }, judge('j1'))
    s = applyT07Action(s, { type: 'submit', assignmentId: 'c2-j2', scores: score(1, 3), publicFeedback: '' }, judge('j2'))
    // 总分相同且未指定维度时阻断
    expect(computeT07Ranking(s).every((r) => r.total === 2)).toBe(true)
    expect(computeT07Ranking(s).some((r) => r.blockers.length > 0)).toBe(true)
    s = applyT07Action(s, { type: 'set-tie-dimension', dimensionId: 'd1' }, organizer)
    const ranking = computeT07Ranking(s)
    expect(ranking.find((r) => r.caseId === 'c1')!.rank).toBe(1)
    expect(ranking.find((r) => r.caseId === 'c1')!.selected).toBe(true)
    expect(ranking.find((r) => r.caseId === 'c2')!.selected).toBe(false)
    const frozen = applyT07Action(s, { type: 'finalize' }, organizer)
    expect(currentT07Round(frozen).finalized).toBeDefined()
  })

  test('指定不属于量表的维度或非按维度策略时拒绝', () => {
    const s = base(['c1', 'c2'])
    expect(() => applyT07Action(s, { type: 'set-tie-dimension', dimensionId: 'nope' }, organizer)).toThrow()
    expect(() => applyT07Action({ ...s, rubric: { ...s.rubric, tieBreaker: 'shared-rank' } },
      { type: 'set-tie-dimension', dimensionId: 'd1' }, organizer)).toThrow()
  })
})

describe('JDG-08 负名额不得冻结空名单', () => {
  test('quota=-1 时产生阻断项，finalize 抛错', () => {
    let s = base(['c1', 'c2'], { quota: -1 })
    s = assign(s, 'c1', 'j1'); s = assign(s, 'c2', 'j2')
    s = submit(s, 'c1', 'j1', 4); s = submit(s, 'c2', 'j2', 3)
    const rows = computeT07Ranking(s)
    expect(rows.every((r) => r.selected !== true)).toBe(true)
    expect(rows.some((r) => r.blockers.some((b) => b.includes('名额')))).toBe(true)
    expect(() => applyT07Action(s, { type: 'finalize' }, organizer)).toThrow()
  })
})

describe('JDG-13 不可覆写动作账本', () => {
  test('每个动作追加带时间与主体的账本，冻结后仍保留', () => {
    let s = base(['c1'])
    s = assign(s, 'c1', 'j1')
    s = submit(s, 'c1', 'j1', 4)
    s = applyT07Action(s, { type: 'finalize' }, organizer)
    const log = s.actionLog ?? []
    expect(log.map((e) => e.actionType)).toEqual(['assign', 'submit', 'finalize'])
    expect(log[1]!.actorId).toBe('j1')
    expect(log[2]!.at).toBeTruthy()
    expect(new Set(log.map((e) => e.actionId)).size).toBe(log.length)
    expect(log.every((e) => /^[0-9a-f]{16}$/.test(e.stateDigest))).toBe(true)
  })

  test('同一离线 actionId 重复入账被拒绝', () => {
    let s = base(['c1', 'c2'])
    s = assign(s, 'c1', 'j1'); s = assign(s, 'c2', 'j1')
    const submitAction = (assignmentId: string): T07Action => ({
      type: 'submit', assignmentId, scores: [{ dimensionId: 'd1', score: 4, na: false }],
      publicFeedback: '', offlineActionId: 'offline-1',
    })
    s = applyT07Action(s, submitAction('c1-j1'), judge('j1'))
    expect(() => applyT07Action(s, submitAction('c2-j1'), judge('j1'))).toThrow(/T07_ACTION_REPLAY/)
  })
})
