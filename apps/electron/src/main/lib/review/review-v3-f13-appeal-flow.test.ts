import { describe, expect, it } from 'bun:test'
import type { Actor, Appeal, BusinessDecision, CaseAggregateV2 } from '@profer/shared'
import {
  planF13AppealReview, planF13AppealSubmission, planF13AppealWithdrawal,
} from './review-v3-f13-appeal-flow'

const student: Actor = { actorId: 'student-1', actorSource: 'local', role: 'student' }
const originalReviewer: Actor = { actorId: 'reviewer-1', actorSource: 'local', role: 'reviewer' }
const independent: Actor = { actorId: 'reviewer-2', actorSource: 'local', role: 'reviewer' }
const finalDecision: BusinessDecision = {
  id: 'decision-1', actor: originalReviewer, scope: { kind: 'case', ids: [] }, stageId: 'final',
  result: 'reject', reason: '材料不足', basedOnRunId: 'run-1', basedOnRevision: 3,
  at: '2026-10-20T01:00:00Z', finality: 'final',
}

function decidedCase(): CaseAggregateV2 {
  return {
    caseV2: {
      id: 'case-1', stage: 'decided', templateId: 'template-1', templateVersion: 1,
      submitter: { actorId: student.actorId, actorSource: student.actorSource },
      documents: [{ versionId: 'doc-1', fileName: '证明.pdf', active: true }], revision: 4,
    },
    decisions: [finalDecision], appeals: [], tasks: [],
  } as unknown as CaseAggregateV2
}

function submittedCase(evidence: string[] = []): CaseAggregateV2 {
  const aggregate = decidedCase()
  const proposal = planF13AppealSubmission(aggregate, student, {
    againstDecisionId: finalDecision.id, statement: '申请复核', newEvidenceDocumentVersionIds: evidence,
  }, { appealId: 'appeal-1', taskId: 'appeal-task-1', reviewer: independent, at: '2026-10-21T01:00:00Z' })
  aggregate.appeals = [proposal.appeal]
  aggregate.tasks = [proposal.reviewTask]
  aggregate.caseV2.stage = proposal.caseStage
  return aggregate
}

describe('F13 独立申诉业务提案', () => {
  it('申诉提交同时规划独立任务与复审阶段，原决定保持不变', () => {
    const aggregate = decidedCase()
    const planned = planF13AppealSubmission(aggregate, student, {
      againstDecisionId: finalDecision.id, statement: '  附上证明，申请复核  ', newEvidenceDocumentVersionIds: ['doc-1'],
    }, { appealId: 'appeal-1', taskId: 'task-1', reviewer: independent, at: '2026-10-21T01:00:00Z' })
    expect(planned.appeal.statement).toBe('附上证明，申请复核')
    expect(planned.appeal.reviewTaskId).toBe(planned.reviewTask.id)
    expect(planned.reviewTask.assigneeActorId).toBe(independent.actorId)
    expect(planned.reviewTask.assigneeRole).toBe('reviewer')
    expect(planned.caseStage).toBe('awaiting-review')
    expect(aggregate.decisions).toEqual([finalDecision])
  })

  it('不允许身份未绑定、原决定人或伪造学校角色承办申诉', () => {
    const agg = decidedCase()
    const input = { againstDecisionId: finalDecision.id, statement: '异议', newEvidenceDocumentVersionIds: [] }
    const assignment = { appealId: 'appeal-1', taskId: 'task-1', reviewer: independent, at: '2026-10-21T01:00:00Z' }
    expect(() => planF13AppealSubmission(agg, { ...student, actorId: 'other' }, input, assignment)).toThrow('提交人')
    expect(() => planF13AppealSubmission(agg, student, input, { ...assignment, reviewer: originalReviewer })).toThrow('原决定人')
    expect(() => planF13AppealSubmission(agg, student, input, {
      ...assignment, reviewer: { ...independent, actorSource: 'agent' },
    })).toThrow('Main 核实')
    delete agg.caseV2.submitter
    expect(() => planF13AppealSubmission(agg, student, input, assignment)).toThrow('身份未绑定')
  })

  it('维持原判会关闭复审任务但不生成第二个业务决定', () => {
    const agg = submittedCase()
    const plan = planF13AppealReview(agg, independent, {
      appealId: 'appeal-1', resolution: 'maintain-original', reason: '核验事实与原决定相符',
    }, { decisionId: 'unused', reviewedAt: '2026-10-21T03:00:00Z' })
    expect(plan.appeal.resolution).toBe('maintain-original')
    expect(plan.appeal.status).toBe('upheld')
    expect(plan.amendment).toBeUndefined()
    expect(plan.tasks[0]?.status).toBe('completed')
    expect(plan.caseStage).toBe('decided')
    expect(plan.summary).toContain('核验事实')
  })

  it('新证据必须核验；改判追加独立人的新决定并保留原决定', () => {
    const agg = submittedCase(['doc-1'])
    const input = { appealId: 'appeal-1', resolution: 'amend-original' as const, reason: '证明核对通过', amendedResult: 'pass' as const }
    const context = { decisionId: 'decision-2', reviewedAt: '2026-10-21T03:00:00Z' }
    expect(() => planF13AppealReview(agg, independent, input, context)).toThrow('新证据')
    expect(() => planF13AppealReview(agg, originalReviewer, input, { ...context, verifiedRunId: 'run-2' })).toThrow('未指派')
    const result = planF13AppealReview(agg, independent, input, { ...context, verifiedRunId: 'run-2' })
    expect(result.amendment?.amendsDecisionId).toBe(finalDecision.id)
    expect(result.amendment?.basedOnRunId).toBe('run-2')
    expect(result.appeal.reviewDecisionId).toBe('decision-2')
    expect(agg.decisions).toEqual([finalDecision])
  })

  it('撤回只能由原申诉人进行，保留原决定和复审任务历史', () => {
    const agg = submittedCase()
    expect(() => planF13AppealWithdrawal(agg, { ...student, actorId: 'other' }, 'appeal-1', '2026-10-21T03:00:00Z')).toThrow()
    const plan = planF13AppealWithdrawal(agg, student, 'appeal-1', '2026-10-21T03:00:00Z')
    expect(plan.appeal.status).toBe('withdrawn')
    expect(plan.tasks[0]?.status).toBe('cancelled')
    expect(plan.caseStage).toBe('decided')
    expect(agg.appeals[0]?.status).toBe('submitted')
    expect(agg.decisions).toEqual([finalDecision])
  })

  it('被取消的任务或已经关闭的申诉不能重复复审', () => {
    const agg = submittedCase()
    agg.tasks[0]!.status = 'cancelled'
    expect(() => planF13AppealReview(agg, independent, {
      appealId: 'appeal-1', resolution: 'maintain-original', reason: '再次处理',
    }, { decisionId: 'decision-2', reviewedAt: '2026-10-21T03:00:00Z' })).toThrow('有效的独立复审任务')
    agg.tasks[0]!.status = 'open'
    agg.appeals[0] = { ...agg.appeals[0]!, status: 'withdrawn', resolution: 'withdrawn' } as Appeal
    expect(() => planF13AppealReview(agg, independent, {
      appealId: 'appeal-1', resolution: 'maintain-original', reason: '再次处理',
    }, { decisionId: 'decision-2', reviewedAt: '2026-10-21T03:00:00Z' })).toThrow('已结案')
  })
})
