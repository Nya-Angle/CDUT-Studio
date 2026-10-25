/**
 * T07 boundary to legacy independent judging and T09's current judge-rating reply.
 * Translation only: it does not read/write CaseStore or import offline packages.
 * L/Main checks assignment, actor and case revision before applying the action.
 */
import type { JudgeAssignment, JudgeRating, RatingEntryV2, RubricSpec } from '@profer/shared'
import type { T07Action, T07Assignment, T07Round, T07Score, T07Vote } from './review-v3-t07-rating-workflow'

/** Existing M4 assignments can be used without creating a competing roster. */
export function fromLegacyJudgeAssignments(assignments: JudgeAssignment[]): T07Assignment[] {
  return assignments.map((a) => ({
    id: a.id, caseId: a.caseId, reviewerId: a.reviewerId,
    rubricVersion: a.rubricVersion,
    status: a.recused ? 'recused' : a.status,
    reason: a.recuseReason,
  }))
}
export function toLegacyJudgeRating(vote: T07Vote, rubricVersion: number): JudgeRating {
  return {
    assignmentId: vote.assignmentId, reviewerId: vote.reviewerId, caseId: vote.caseId,
    rubricVersion,
    scores: vote.scores.map((s) => ({ ...s })),
    publicFeedback: vote.publicFeedback, internalNotes: vote.internalNotes,
    submittedAt: vote.submittedAt,
  }
}
/**
 * Old CastRating entries have stage + judge + round but no assignmentId.
 * Import only entries that match an actual T07 assignment in this case/round.
 * Existing raw ratings are left untouched; caller decides whether to reconcile.
 */
export function fromLegacyCastRatings(
  records: RatingEntryV2[], round: T07Round, rubric: RubricSpec, stageId: string,
): T07Vote[] {
  return records
    .filter((record) => record.stageId === stageId && record.round === round.number)
    .flatMap((record) => {
      const assignment = round.assignments.find((a) => a.caseId === record.caseId && a.reviewerId === record.actor)
      if (!assignment || assignment.status === 'recused') return []
      const scores: T07Score[] = rubric.dimensions.map((d) => {
        const raw = record.scores[d.id]
        return { dimensionId: d.id, score: raw === undefined || raw === 'N/A' ? null : raw, na: raw === 'N/A' }
      })
      return [{
        assignmentId: assignment.id, caseId: record.caseId,
        reviewerId: record.actor, round: record.round, scores,
        publicFeedback: '', submittedAt: record.at,
      }]
    })
}

/** Exact reply keys consumed by the existing T09 offline-roundtrip judge-rating path. */
export type T07OfflineReply = { stageId: string; round: number; scores: Record<string, number | 'N/A'> }
export function toT09JudgeRatingReply(vote: T07Vote, stageId: string): T07OfflineReply {
  return {
    stageId, round: vote.round,
    scores: Object.fromEntries(vote.scores.map((s) => [s.dimensionId, s.na ? 'N/A' : s.score as number])),
  }
}
/** The returned action is ONLY a proposal. Never trust a package-supplied reviewerId or role. */
export function fromT09JudgeRatingReply(
  reply: T07OfflineReply, round: T07Round, caseId: string, reviewerId: string,
  rubric: RubricSpec, publicFeedback = '', internalNotes?: string,
): Extract<T07Action, { type: 'submit' }> {
  if (round.number !== reply.round) throw new Error('评分包来自旧轮次，请核对差异后重发')
  const eligible = round.assignments.find((a) => a.caseId === caseId && a.reviewerId === reviewerId && a.status === 'assigned')
  if (!eligible) throw new Error('评分包没有与当前轮次匹配的有效分配')
  return {
    type: 'submit', assignmentId: eligible.id,
    scores: rubric.dimensions.map((dimension) => {
      const value = reply.scores[dimension.id]
      return { dimensionId: dimension.id, na: value === 'N/A',
        score: value === undefined || value === 'N/A' ? null : value }
    }),
    publicFeedback, internalNotes,
  }
}
