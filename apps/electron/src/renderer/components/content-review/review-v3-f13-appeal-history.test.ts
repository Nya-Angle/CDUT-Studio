import { describe, expect, it } from 'bun:test'
import type { CaseAggregateV2 } from '@profer/shared'
import { buildF13AppealHistory } from './review-v3-f13-appeal-history'

function fixture(): CaseAggregateV2 {
  return {
    caseV2: { documents: [{ versionId: 'doc-1', fileName: '新证据.pdf', active: false }] },
    decisions: [{ id: 'd1', result: 'reject', finality: 'final' },
      { id: 'd2', result: 'pass', amendsDecisionId: 'd1', finality: 'final', actor: { actorId: 'reviewer-2' } }],
    tasks: [{ id: 'task-1', stageId: 'appeal-review', status: 'completed' }],
    appeals: [{ id: 'appeal-1', againstDecisionId: 'd1', statement: '异议', status: 'overturned',
      resolution: 'amend-original', reviewDecisionId: 'd2', reviewTaskId: 'task-1',
      newEvidenceDocumentVersionIds: ['doc-1'], createdAt: '2026-10-21T01:00:00Z' }],
  } as unknown as CaseAggregateV2
}

describe('F13 申诉历史读模型', () => {
  it('能追溯原决定、更正决定、复审任务与失效证据版本', () => {
    const [entry] = buildF13AppealHistory(fixture())
    expect(entry?.original?.id).toBe('d1')
    expect(entry?.amendment?.id).toBe('d2')
    expect(entry?.originalSuperseded).toBe(true)
    expect(entry?.reviewTask?.id).toBe('task-1')
    expect(entry?.outcomeLabel).toContain('已追加更正')
    expect(entry?.warnings).toContain('部分证据已被后续材料版本取代')
  })

  it('旧 overturned/upheld 缺明确 resolution 或更正决定时不能自动认定结论', () => {
    const agg = fixture()
    agg.appeals[0] = { ...agg.appeals[0]!, resolution: undefined, reviewDecisionId: undefined }
    const [legacy] = buildF13AppealHistory(agg)
    expect(legacy?.outcomeLabel).toContain('人工核对')
    expect(legacy?.warnings.some((warning) => warning.includes('upheld/overturned'))).toBe(true)
  })

  it('待处理申诉只显示未结论，不会虚构原决定已被更改', () => {
    const agg = fixture()
    agg.decisions = [agg.decisions[0]!]
    agg.appeals[0] = { ...agg.appeals[0]!, status: 'submitted', resolution: undefined, reviewDecisionId: undefined }
    const [pending] = buildF13AppealHistory(agg)
    expect(pending?.outcomeLabel).toBe('尚无最终复审结论')
    expect(pending?.originalSuperseded).toBe(false)
  })
})
