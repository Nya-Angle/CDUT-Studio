import { describe, expect, it } from 'bun:test'
import type { Actor, CaseAggregateV2, BusinessDecision } from '@profer/shared'
import {
  prepareT05AppealSubmission, prepareT05AppealResolution, prepareT05AppealWithdrawal,
} from './review-v3-t05-appeal-actions'

const submitter: Actor = { actorId: 'student-1', actorSource: 'local', role: 'student' }
const reviewer: Actor = { actorId: 'reviewer-2', actorSource: 'local', role: 'reviewer' }
const original: BusinessDecision = {
  id: 'decision-1', actor: { actorId: 'reviewer-1', actorSource: 'local', role: 'reviewer' },
  scope: { kind: 'case', ids: [] }, stageId: 'final', result: 'reject',
  reason: '资料不符', basedOnRunId: 'run-1', basedOnRevision: 4,
  at: '2026-10-20T01:00:00Z', finality: 'final',
}
const aggregate = (): CaseAggregateV2 => ({
  caseV2: {
    id: 'case-1', stage: 'decided',
    documents: [{ versionId: 'document-2', active: true }],
    revision: 5,
  },
  decisions: [original], appeals: [],
} as unknown as CaseAggregateV2)

describe('T05 append-only appeal semantics', () => {
  it('keeps the original decision, binds a legitimate appeal and evidence version', () => {
    const current = aggregate()
    const appeal = prepareT05AppealSubmission(current, submitter, {
      againstDecisionId: 'decision-1', statement: '上传清晰材料', newEvidenceDocumentVersionIds: ['document-2'],
    }, { id: 'appeal-1', at: '2026-10-21T01:00:00Z' })
    expect(appeal.status).toBe('submitted')
    expect(appeal.againstDecisionId).toBe(original.id)
    expect(current.decisions).toHaveLength(1)
    expect(() => prepareT05AppealSubmission(current, submitter, {
      againstDecisionId: 'decision-1', statement: '新证据', newEvidenceDocumentVersionIds: ['absent'],
    }, { id: 'appeal-2', at: '2026-10-21T01:00:00Z' })).toThrow()
  })

  it('appends a linked amendment based on a verified fresh run', () => {
    const current = aggregate()
    current.appeals = [prepareT05AppealSubmission(current, submitter, {
      againstDecisionId: original.id, statement: '事实错误', newEvidenceDocumentVersionIds: [],
    }, { id: 'appeal-1', at: '2026-10-21T01:00:00Z' })]
    const outcome = prepareT05AppealResolution(current, reviewer, {
      appealId: 'appeal-1', resolution: 'amend-original', amendedResult: 'pass', reason: '复查原件',
    }, { decisionId: 'decision-2', reviewedAt: '2026-10-21T02:00:00Z', verifiedRunId: 'run-2' })
    expect(outcome.appeal.status).toBe('overturned')
    expect(outcome.amendment?.amendsDecisionId).toBe(original.id)
    expect(outcome.amendment?.basedOnRunId).toBe('run-2')
    expect(current.decisions).toEqual([original])
    expect(() => prepareT05AppealResolution(current, reviewer, {
      appealId: 'appeal-1', resolution: 'amend-original', amendedResult: 'pass', reason: 'ok',
    }, { decisionId: 'decision-2', reviewedAt: '2026-10-21T02:00:00Z' })).toThrow()
  })

  it('restricts withdrawal to the original appellant', () => {
    const current = aggregate()
    const appeal = prepareT05AppealSubmission(current, submitter, {
      againstDecisionId: 'decision-1', statement: '复核申请', newEvidenceDocumentVersionIds: [],
    }, { id: 'appeal-1', at: '2026-10-21T01:00:00Z' })
    expect(prepareT05AppealWithdrawal(appeal, submitter).status).toBe('withdrawn')
    expect(() => prepareT05AppealWithdrawal(appeal, reviewer)).toThrow()
  })
})
