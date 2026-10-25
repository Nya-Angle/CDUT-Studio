import { describe, expect, test } from 'bun:test'
import type { RubricSpec } from '@profer/shared'
import { applyT07Action, computeT07Ranking, projectT07View, type T07State } from './review-v3-t07-rating-workflow'

const rubric: RubricSpec = {
  dimensions: [
    { id: 'quality', name: '创新性', min: 1, max: 5, weight: 0.4 },
    { id: 'feasible', name: '可行性', min: 1, max: 5, weight: 0.6 },
  ],
  totalPrecision: 2, missingStrategy: 'block', minEffectiveJudges: 2,
  tieBreaker: 'shared-rank', scaleConversion: { fromMax: 5, toMax: 100 },
}
const organizer = { actor: { actorId: 'organizer-local', role: 'organizer' as const, actorSource: 'local' as const }, at: '2026-10-21T00:00:00Z' }
const judge = (id: string) => ({ actor: { actorId: id, role: 'judge' as const, actorSource: 'local' as const }, at: '2026-10-21T00:01:00Z' })
const base = (cases = ['c1']): T07State => ({
  batchId: 'batch-1', rubricVersion: 1, rubric, cases: cases.map((caseId) => ({ caseId, blindLabel: '匿名项目 ' + caseId })),
  rounds: [{ number: 1, assignments: [], votes: [], divergenceReasons: {}, tieOrders: {} }],
})
function assign(s: T07State, caseId: string, id: string) {
  return applyT07Action(s, { type: 'assign', caseId, reviewerId: id, assignmentId: caseId + '-' + id }, organizer)
}
function vote(s: T07State, caseId: string, id: string, a: number, b: number) {
  return applyT07Action(s, {
    type: 'submit', assignmentId: caseId + '-' + id, publicFeedback: '项目评价',
    scores: [{ dimensionId: 'quality', score: a, na: false }, { dimensionId: 'feasible', score: b, na: false }],
  }, judge(id))
}
describe('T07 independent judging A14 / D11', () => {
  test('two valid judges and one recusal => 4.10 / 5 => 82.00; no premature freeze', () => {
    let s = assign(assign(assign(base(), 'c1', 'j1'), 'c1', 'j2'), 'c1', 'j3')
    s = applyT07Action(s, { type: 'recuse', assignmentId: 'c1-j3', reason: '利益关联' }, organizer)
    s = vote(s, 'c1', 'j1', 4, 5)
    expect(computeT07Ranking(s)[0]!.blockers.length).toBeGreaterThan(0)
    expect(() => applyT07Action(s, { type: 'finalize' }, organizer)).toThrow()
    s = vote(s, 'c1', 'j2', 3, 4)
    const row = computeT07Ranking(s)[0]!
    expect(row.dimensions.map((d) => d.average)).toEqual([3.5, 4.5])
    expect(row.total).toBe(4.1)
    expect(row.convertedTotal).toBe(82)
    expect(row.effectiveJudges).toBe(2)
    expect(row.blockers).toHaveLength(0)
    s = applyT07Action(s, { type: 'finalize' }, organizer)
    expect(s.rounds[0]!.finalized?.ranking[0]!.total).toBe(4.1)
    expect(() => vote(s, 'c1', 'j2', 4, 4)).toThrow()
    s = applyT07Action(s, { type: 'reopen', reason: '申诉要求新一轮评审' }, organizer)
    expect(s.rounds).toHaveLength(2)
    expect(s.rounds[1]!.votes).toHaveLength(0)
    expect(s.rounds[1]!.reopenedFrom?.reason).toContain('申诉')
  })
  test('judge projection excludes other judges, roster, totals and organizer internal state', () => {
    let s = assign(assign(base(), 'c1', 'j1'), 'c1', 'j2')
    s = vote(s, 'c1', 'j1', 4, 5)
    const view = projectT07View(s, judge('j1').actor, [{
      caseId: 'c1', summary: '经 Main 过滤的匿名项目内容',
      documents: [{ id: 'doc1', title: '匿名文件' }],
    }])
    expect(view.role).toBe('judge')
    if (view.role !== 'judge') return
    expect(view.tasks).toHaveLength(1)
    expect(view.tasks[0]!.ownVote?.reviewerId).toBe('j1')
    expect(JSON.stringify(view)).not.toContain('j2')
    expect(JSON.stringify(view)).not.toContain('organizer-local')
    expect(JSON.stringify(view)).not.toContain('effectiveJudges')
    expect(() => applyT07Action(s, { type: 'submit', assignmentId: 'c1-j2', publicFeedback: '', scores: [] }, judge('j1'))).toThrow()
  })
  test('same-score shared rank crossing quota requires explicit policy, not arbitrary selection', () => {
    let s = base(['c1', 'c2'])
    s = { ...s, rubric: { ...rubric, quota: 1, minEffectiveJudges: 1 } }
    s = vote(assign(s, 'c1', 'j1'), 'c1', 'j1', 4, 4)
    s = vote(assign(s, 'c2', 'j2'), 'c2', 'j2', 4, 4)
    const rows = computeT07Ranking(s)
    expect(rows.map((x) => x.rank)).toEqual([1, 1])
    expect(rows.map((x) => x.selected)).toEqual([null, null])
    expect(() => applyT07Action(s, { type: 'finalize' }, organizer)).toThrow()
    s = { ...s, rubric: { ...s.rubric, tieBreaker: 'owner-decides' } }
    s = applyT07Action(s, { type: 'set-tie-order', caseIds: ['c2', 'c1'] }, organizer)
    expect(computeT07Ranking(s).map((x) => [x.caseId, x.selected])).toEqual([['c2', true], ['c1', false]])
  })
  test('missing assigned judge can be replaced without counting missing as zero', () => {
    let s = assign(assign(base(), 'c1', 'j1'), 'c1', 'j2')
    s = vote(s, 'c1', 'j1', 4, 5)
    s = applyT07Action(s, { type: 'mark-missing', assignmentId: 'c1-j2', reason: '到期未提交' }, organizer)
    expect(computeT07Ranking(s)[0]!.effectiveJudges).toBe(1)
    s = vote(assign(s, 'c1', 'j4'), 'c1', 'j4', 3, 4)
    expect(computeT07Ranking(s)[0]!.total).toBe(4.1)
    expect(computeT07Ranking(s)[0]!.blockers).toHaveLength(0)
  })
  test('提交后发现利益关联允许本人回避，旧票仅留审计历史并要求替补', () => {
    let s = assign(assign(base(), 'c1', 'j1'), 'c1', 'j2')
    s = vote(vote(s, 'c1', 'j1', 4, 5), 'c1', 'j2', 3, 4)
    expect(computeT07Ranking(s)[0]!.blockers).toEqual([])
    s = applyT07Action(s, { type: 'self-recuse', assignmentId: 'c1-j2', reason: '发现亲属关系' }, judge('j2'))
    expect(s.rounds[0]!.assignments.find((a) => a.id === 'c1-j2')!.status).toBe('recused')
    expect(s.rounds[0]!.votes).toHaveLength(1)
    expect(s.rounds[0]!.revisionHistory?.[0]!.vote.reviewerId).toBe('j2')
    expect(s.rounds[0]!.revisionHistory?.[0]!.reason).toContain('亲属关系')
    expect(computeT07Ranking(s)[0]!.effectiveJudges).toBe(1)
    expect(() => applyT07Action(s, { type: 'finalize' }, organizer)).toThrow()
    expect(() => applyT07Action(s, { type: 'submit', assignmentId: 'c1-j2', scores: [], publicFeedback: '' }, judge('j2'))).toThrow()
    s = vote(assign(s, 'c1', 'j3'), 'c1', 'j3', 4, 4)
    expect(computeT07Ranking(s)[0]!.effectiveJudges).toBe(2)
  })

  test('改分后撤销旧分歧处理与同分裁决，不允许旧裁定直接生效', () => {
    let s: T07State = { ...base(['c1', 'c2']), rubric: { ...rubric, minEffectiveJudges: 1, tieBreaker: 'owner-decides' as const, quota: 1 } }
    s = vote(assign(s, 'c1', 'j1'), 'c1', 'j1', 4, 4)
    s = vote(assign(s, 'c2', 'j2'), 'c2', 'j2', 4, 4)
    s = applyT07Action(s, { type: 'set-tie-order', caseIds: ['c1', 'c2'] }, organizer)
    s = applyT07Action(s, { type: 'resolve-divergence', caseId: 'c2', reason: '两票核对完毕' }, organizer)
    s = applyT07Action(s, { type: 'request-revision', assignmentId: 'c2-j2', reason: '录入有误' }, organizer)
    expect(s.rounds[0]!.tieOrders).toEqual({})
    expect(s.rounds[0]!.divergenceReasons).toEqual({})
    expect(() => applyT07Action(s, { type: 'set-tie-order', caseIds: ['c1', 'c2'] }, organizer)).toThrow('同分')
    s = vote(s, 'c2', 'j2', 5, 5)
    expect(computeT07Ranking(s).map((row) => row.caseId)).toEqual(['c2', 'c1'])
  })

  test('无法针对非同分或空批次强制定稿', () => {
    let s: T07State = { ...base(['c1', 'c2']), rubric: { ...rubric, minEffectiveJudges: 1, tieBreaker: 'owner-decides' as const } }
    s = vote(assign(s, 'c1', 'j1'), 'c1', 'j1', 3, 3)
    s = vote(assign(s, 'c2', 'j2'), 'c2', 'j2', 5, 5)
    expect(() => applyT07Action(s, { type: 'set-tie-order', caseIds: ['c1', 'c2'] }, organizer)).toThrow('同分')
    expect(() => applyT07Action(base([]), { type: 'finalize' }, organizer)).toThrow('没有案卷')
  })
})
