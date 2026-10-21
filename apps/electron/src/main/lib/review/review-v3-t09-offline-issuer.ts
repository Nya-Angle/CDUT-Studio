/**
 * T09 issuer adapters. Reuse V2/V3 aggregate as read-only authority; do not
 * create a separate CaseStore or let a file issue a business decision.
 */
import { createHash } from 'node:crypto'
import type { CaseAggregateV2, JudgeAssignment, RubricSpec } from '@profer/shared'
import { projectForRole } from './offline-roundtrip'
import { issueT09Task, type T09Asset, type T09Lock, type T09TaskPackage } from './review-v3-t09-offline-codec'

function lockOf(aggregate: CaseAggregateV2, policyVersionIds: string[]): T09Lock {
  return {
    templateId: aggregate.caseV2.templateId,
    templateVersion: aggregate.caseV2.templateVersion,
    policyVersionIds,
  }
}

/** Real supplement from the current CaseAggregate; only the target request is exported. */
export function issueT09StudentFromCase(
  aggregate: CaseAggregateV2,
  recipientId: string,
  supplementId: string,
  fieldVisibility: Record<string, 'public' | 'internal'>,
  policyVersionIds: string[] = [],
): T09TaskPackage {
  const request = aggregate.supplements.find(s => s.id === supplementId)
  if (!request || !['open', 'insufficient'].includes(request.status)) throw new Error('补件请求不处于可回复状态')
  if (request.responsibleRole !== 'student') throw new Error('不是学生应答的补件任务')
  const projection = projectForRole(aggregate, 'student', fieldVisibility, recipientId)
  return issueT09Task({
    caseId: aggregate.caseV2.id, revision: aggregate.caseV2.revision,
    lock: lockOf(aggregate, policyVersionIds),
    task: { kind: 'student-reply', supplementId, reason: request.reason, requiredElements: request.requiredElements, deadline: request.deadline },
    recipient: { role: 'student', actorId: recipientId, actorSource: 'local' },
    publicContext: { title: projection.title, fields: projection.fields },
  })
}

/**
 * Judge pack: zero raw applicant fields or original files by default.
 * T07 may pass independently reviewed redacted assets; if they cannot be
 * anonymized, do not include them. The assignment is the only rating target.
 */
export function issueT09JudgeFromCase(
  aggregate: CaseAggregateV2,
  assignment: JudgeAssignment,
  rubric: RubricSpec,
  policyVersionIds: string[] = [],
  reviewedAnonymousAssets: T09Asset[] = [],
  scoringBinding?: { batchId: string; round: number; revision: number },
): T09TaskPackage {
  if (assignment.caseId !== aggregate.caseV2.id || assignment.recused || assignment.status !== 'assigned') throw new Error('没有有效的可评分分配')
  if (!assignment.reviewerId) throw new Error('评委未指定')
  // Case identity is bound in the private package contract; presentation is anonymous.
  const anonymousLabel = '匿名案卷#' + createHash('sha256').update(assignment.id + '|' + aggregate.caseV2.id).digest('hex').slice(0,10)
  return issueT09Task({
    caseId: aggregate.caseV2.id, revision: scoringBinding?.revision ?? aggregate.caseV2.revision,
    lock: lockOf(aggregate, policyVersionIds),
    task: {
      kind: 'judge-rating-reply', assignmentId: assignment.id, rubricVersion: assignment.rubricVersion,
      ...(scoringBinding ? { batchId: scoringBinding.batchId, round: scoringBinding.round, caseRevision: aggregate.caseV2.revision } : {}),
      dimensions: rubric.dimensions.map(d => ({ id: d.id, title: d.name, min: d.min, max: d.max, allowNA: !!d.naWhen })),
    },
    recipient: { role: 'judge', actorId: assignment.reviewerId, actorSource: 'local' },
    publicContext: { title: anonymousLabel, fields: {} },
    assets: reviewedAnonymousAssets,
  })
}
