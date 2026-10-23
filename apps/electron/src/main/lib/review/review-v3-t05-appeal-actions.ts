/**
 * T05 independent business semantics for a future trusted Main command adapter.
 *
 * The helpers do not mutate an aggregate, save a new Case, mint an Actor,
 * or grant approval authority. Main supplies a verified Actor, generated IDs,
 * current revision and (for amendments) a validated new Run.
 *
 * This fills the product-domain half of the missing SubmitAppeal V3 contract,
 * while the trusted IPC and atomic append remain Local-L's responsibility.
 */
import type { Actor, Appeal, BusinessDecision, CaseAggregateV2 } from '@profer/shared'

export interface T05SubmitAppealInput {
  againstDecisionId: string
  statement: string
  newEvidenceDocumentVersionIds: string[]
}

export interface T05ReviewAppealInput {
  appealId: string
  resolution: 'maintain-original' | 'amend-original'
  reason: string
  /** Mandatory when resolution=amend-original. Never default to pass. */
  amendedResult?: BusinessDecision['result']
}

export interface T05ReviewAppealPlan {
  appeal: Appeal
  /** Add to aggregate.decisions; do not overwrite original decision. */
  amendment?: BusinessDecision
}

/** The effective business decisions after applying explicit supersession chains. */
export function effectiveT05Decisions(decisions: readonly BusinessDecision[]): BusinessDecision[] {
  const superseded = new Set(decisions.flatMap((decision) =>
    decision.amendsDecisionId ? [decision.amendsDecisionId] : []))
  return decisions.filter((decision) => !superseded.has(decision.id))
}

/**
 * Local submission / student-side workflow.
 * Actual ownership/identity must be bound and authenticated by trusted Main.
 */
export function prepareT05AppealSubmission(
  aggregate: CaseAggregateV2,
  actor: Actor,
  input: T05SubmitAppealInput,
  context: { id: string; at: string },
): Appeal {
  if (actor.role !== 'student') throw new Error('仅提交方可以创建学生申诉')
  if (aggregate.caseV2.stage !== 'decided') throw new Error('案卷尚未形成可申诉的最终决定')
  const original = effectiveT05Decisions(aggregate.decisions).find((decision) =>
    decision.id === input.againstDecisionId && decision.finality === 'final')
  if (!original) throw new Error('被申诉的决定不存在、已被更正或不是有效最终决定')
  if (!input.statement.trim()) throw new Error('必须说明申诉理由')
  if (aggregate.appeals.some((appeal) => appeal.againstDecisionId === original.id
      && ['submitted', 'in-review'].includes(appeal.status))) {
    throw new Error('针对同一决定已有待处理的申诉')
  }
  const activeIds = new Set(aggregate.caseV2.documents.filter((document) => document.active !== false)
    .map((document) => document.versionId))
  const evidence = [...new Set(input.newEvidenceDocumentVersionIds)]
  if (evidence.some((id) => !activeIds.has(id))) throw new Error('申诉不能引用不存在或已失效的材料版本')
  return {
    id: context.id,
    caseId: aggregate.caseV2.id,
    againstDecisionId: original.id,
    appellant: { actorId: actor.actorId, actorSource: actor.actorSource },
    statement: input.statement.trim(),
    newEvidenceDocumentVersionIds: evidence,
    status: 'submitted',
    createdAt: context.at,
  }
}

/**
 * Independent reviewer resolution. A real local reviewer may do this only if
 * their Main-bound identity differs from the initial decision maker. School
 * approval semantics are intentionally NOT inferred from a local role.
 */
export function prepareT05AppealResolution(
  aggregate: CaseAggregateV2,
  reviewer: Actor,
  input: T05ReviewAppealInput,
  context: { decisionId: string; reviewedAt: string; verifiedRunId?: string },
): T05ReviewAppealPlan {
  const appeal = aggregate.appeals.find((candidate) => candidate.id === input.appealId)
  if (!appeal) throw new Error('申诉不存在')
  if (appeal.status !== 'submitted' && appeal.status !== 'in-review') throw new Error('申诉已结案')
  if (reviewer.role !== 'teacher' && reviewer.role !== 'reviewer') throw new Error('当前角色不能复审')
  const original = aggregate.decisions.find((decision) => decision.id === appeal.againstDecisionId)
  if (!original) throw new Error('原业务决定不存在')
  if (!effectiveT05Decisions(aggregate.decisions).some((decision) => decision.id === original.id)) {
    throw new Error('原决定已被更正，应重新选择有效决定')
  }
  if (original.actor.actorId === reviewer.actorId
      && original.actor.actorSource === reviewer.actorSource) {
    throw new Error('复审人不能与原决定人为同一主体')
  }
  if (!input.reason.trim()) throw new Error('复审结论必须说明理由')
  if (input.resolution === 'amend-original' && !input.amendedResult) {
    throw new Error('更正原决定必须明确新的业务结论')
  }
  if (input.resolution === 'amend-original' && !context.verifiedRunId) {
    throw new Error('更正决定必须提供已核验的最新 ReviewRun')
  }
  const updated: Appeal = {
    ...appeal,
    status: input.resolution === 'maintain-original' ? 'upheld' : 'overturned',
    resolution: input.resolution,
    ...(input.resolution === 'amend-original' ? { reviewDecisionId: context.decisionId } : {}),
  }
  if (input.resolution === 'maintain-original') return { appeal: updated }
  const amendment: BusinessDecision = {
    ...original,
    id: context.decisionId,
    actor: reviewer,
    result: input.amendedResult!,
    reason: input.reason.trim(),
    at: context.reviewedAt,
    basedOnRunId: context.verifiedRunId!,
    basedOnRevision: aggregate.caseV2.revision,
    finality: 'final',
    amendsDecisionId: original.id,
  }
  return { appeal: updated, amendment }
}

/** Student may withdraw a pending appeal without erasing original decisions. */
export function prepareT05AppealWithdrawal(appeal: Appeal, actor: Actor): Appeal {
  if (appeal.status !== 'submitted' && appeal.status !== 'in-review') throw new Error('申诉已结案')
  if (appeal.appellant.actorId !== actor.actorId || appeal.appellant.actorSource !== actor.actorSource) {
    throw new Error('只有原申诉人可以撤回')
  }
  return { ...appeal, status: 'withdrawn', resolution: 'withdrawn' }
}
