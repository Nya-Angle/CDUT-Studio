/**
 * T05: local-business stage action proposal for the existing CaseAggregateV2.
 *
 * This is a pure domain function: it does not write a Case, mint an Actor,
 * inspect a renderer-supplied role, or select a Run from arbitrary user text.
 * Main must supply the authenticated LOCAL actor, frozen published template,
 * and current/verified Run information inside its authoritative transaction.
 */
import type { Actor, BusinessDecision, CaseAggregateV2, ReviewCaseV2, SupplementRequest, TemplateVersion, WorkflowTask } from '@profer/shared'

export type T05LocalStageAction =
  | 'stage-pass'
  | 'return-for-supplement'
  | 'return-to-previous-stage'
  | 'final-reject'

export interface T05VerifiedRun {
  id: string
  caseId: string
  status: 'completed' | 'partially-completed'
  /** Main confirmed input hash, policy/material revisions and source versions. */
  current: boolean
  /** Main evaluated all required checks, human dispositions and exemptions. */
  decisionReadiness: 'ready' | 'blocked'
}

export interface T05StagePlanningInput {
  aggregate: CaseAggregateV2
  template: TemplateVersion
  /** Derived by trusted Main from the active local/mock/school identity. */
  actor: Actor
  /** Main must explicitly distinguish a local business case from technical-only. */
  businessMode: 'local-business' | 'technical-pre-review'
  taskId: string
  action: T05LocalStageAction
  reason: string
  requiredElements?: string[]
  supplementReason?: string
  verifiedRun?: T05VerifiedRun
}

export interface T05StageProposal {
  taskId: string
  stageId: string
  action: T05LocalStageAction
  reason: string
  /**
   * No invented run@rev placeholder. Only Main's verified real ReviewRun id.
   * Returning for supplement before a first Run is valid but creates a request,
   * NOT a BusinessDecision.
   */
  basedOnRunId?: string
  basedOnRevision: number
  decisionFinality?: 'stage' | 'final'
  nextStageId?: string
  nextAssigneeRole?: Actor['role']
  returnToStageId?: string
  supplement?: { requiredElements: string[]; publicReason: string }
}

const unresolved = new Set(['open', 'responded', 'insufficient'])

export function planT05LocalStageAction(input: T05StagePlanningInput): T05StageProposal {
  const { aggregate, template, actor, businessMode, action } = input
  if (businessMode !== 'local-business' || aggregate.d2RuntimePlan) {
    throw Error('T05_TECHNICAL_PREVIEW_NOT_BUSINESS_DECISION')
  }
  if (!['local', 'mock', 'school'].includes(actor.actorSource)) {
    throw Error('T05_TRUSTED_HUMAN_ACTOR_REQUIRED')
  }
  if (aggregate.caseV2.templateId !== template.templateId ||
      aggregate.caseV2.templateVersion !== template.version ||
      template.status !== 'published') {
    throw Error('T05_PUBLISHED_TEMPLATE_REVISION_REQUIRED')
  }
  if (!['submitted', 'reviewing', 'awaiting-review'].includes(aggregate.caseV2.stage)) {
    throw Error('T05_CASE_NOT_IN_REVIEW')
  }
  const task = aggregate.tasks.find(t => t.id === input.taskId && t.status === 'open')
  if (!task) throw Error('T05_OPEN_TASK_REQUIRED')
  const stage = template.stages.find(s => s.id === task.stageId)
  if (!stage || stage.executorRole !== task.assigneeRole || actor.role !== task.assigneeRole ||
      (task.assigneeActorId && task.assigneeActorId !== actor.actorId)) {
    throw Error('T05_ACTOR_NOT_ASSIGNED_TO_STAGE')
  }
  if (aggregate.supplements.some(s => unresolved.has(s.status))) {
    throw Error('T05_UNRESOLVED_SUPPLEMENTS')
  }
  if (!input.reason.trim()) throw Error('T05_DECISION_REASON_REQUIRED')
  if (aggregate.decisions.some(d => d.taskId === task.id)) throw Error('T05_TASK_ALREADY_DECIDED')

  const proposal: T05StageProposal = {
    taskId: task.id, stageId: task.stageId, action, reason: input.reason.trim(),
    basedOnRevision: aggregate.caseV2.revision,
  }

  if (action === 'return-for-supplement') {
    const requiredElements = [...new Set((input.requiredElements ?? []).map(s => s.trim()).filter(Boolean))]
    if (!requiredElements.length || !input.supplementReason?.trim()) {
      throw Error('T05_SUPPLEMENT_REQUIREMENTS_REQUIRED')
    }
    // Do not invent a BusinessDecision / Run if required material is not yet present.
    return { ...proposal, supplement: { requiredElements, publicReason: input.supplementReason.trim() } }
  }

  if (!input.verifiedRun || !input.verifiedRun.current ||
      input.verifiedRun.caseId !== aggregate.caseV2.id ||
      !['completed', 'partially-completed'].includes(input.verifiedRun.status)) {
    throw Error('T05_CURRENT_REAL_RUN_REQUIRED')
  }
  proposal.basedOnRunId = input.verifiedRun.id

  if (action === 'stage-pass' && input.verifiedRun.decisionReadiness !== 'ready') {
    throw Error('T05_REQUIRED_CHECKS_NOT_RESOLVED')
  }

  if (action === 'stage-pass') {
    if (stage.nextStageId) {
      const next = template.stages.find(candidate => candidate.id === stage.nextStageId)
      if (!next) throw Error('T05_NEXT_STAGE_NOT_FOUND')
      proposal.decisionFinality = 'stage'
      proposal.nextStageId = next.id
      proposal.nextAssigneeRole = next.executorRole
    } else {
      proposal.decisionFinality = 'final'
    }
  } else if (action === 'return-to-previous-stage') {
    if (!stage.returnToStageId) throw Error('T05_PREVIOUS_STAGE_NOT_CONFIGURED')
    const previous = template.stages.find(candidate => candidate.id === stage.returnToStageId)
    if (!previous) throw Error('T05_PREVIOUS_STAGE_NOT_FOUND')
    proposal.decisionFinality = 'stage'
    proposal.returnToStageId = previous.id
    proposal.nextAssigneeRole = previous.executorRole
  } else if (action === 'final-reject') {
    proposal.decisionFinality = 'final'
  }
  return proposal
}

/** Reopen a stage only when all live supplement requests are resolved.
 * "responded" is not "satisfied"; the operator must record an explicit decision.
 */
export function planT05SupplementReentry(
  aggregate: CaseAggregateV2,
  supplementId: string,
  outcome: 'satisfied' | 'insufficient' | 'cancelled',
): { canResume: boolean; restoreStageId?: string; restoreRole?: Actor['role'] } {
  const target = aggregate.supplements.find(s => s.id === supplementId)
  if (!target || !['open', 'responded', 'insufficient'].includes(target.status)) {
    throw Error('T05_SUPPLEMENT_NOT_ACTIONABLE')
  }
  if (outcome === 'satisfied' && target.status !== 'responded') {
    throw Error('T05_REPLY_REQUIRED_BEFORE_SATISFIED')
  }
  if (outcome === 'insufficient' && target.status !== 'responded') {
    throw Error('T05_REPLY_REQUIRED_BEFORE_INSUFFICIENT')
  }
  const canResume = outcome !== 'insufficient' &&
    !aggregate.supplements.some(s => s.id !== supplementId && unresolved.has(s.status))
  if (!canResume) return { canResume: false }
  const origin = target.originTaskId ? aggregate.tasks.find(t => t.id === target.originTaskId) : undefined
  return {
    canResume: true,
    ...(target.originStageId ? { restoreStageId: target.originStageId } : {}),
    ...(origin ? { restoreRole: origin.assigneeRole } : {}),
  }
}

/**
 * Materialize the prepared stage action as a pure, append-only state change.
 * Main supplies IDs/time and persists the result atomically in the existing
 * CaseAggregate transaction; this helper deliberately performs NO IO.
 *
 * For a missing document, there is no ReviewRun yet, so a supplement request
 * is recorded without inventing a fake BusinessDecision.
 */
export interface T05StageMutationContext {
  decisionId: string
  nextTaskId: string
  supplementId: string
  at: string
}

export interface T05StageMutation {
  caseStage: ReviewCaseV2['stage']
  tasks: WorkflowTask[]
  decisions: BusinessDecision[]
  supplements: SupplementRequest[]
  addedTask?: WorkflowTask
  addedDecision?: BusinessDecision
  addedSupplement?: SupplementRequest
}

export function applyT05LocalStageProposal(
  aggregate: CaseAggregateV2,
  proposal: T05StageProposal,
  actor: Actor,
  ids: T05StageMutationContext,
): T05StageMutation {
  if (aggregate.caseV2.revision !== proposal.basedOnRevision) {
    throw Error('T05_STAGE_REVISION_CHANGED')
  }
  const task = aggregate.tasks.find(t => t.id === proposal.taskId && t.status === 'open')
  if (!task || task.stageId !== proposal.stageId || task.assigneeRole !== actor.role ||
      (task.assigneeActorId && task.assigneeActorId !== actor.actorId)) {
    throw Error('T05_STAGE_TASK_CHANGED')
  }
  const closedTasks = aggregate.tasks.map(t => t.id === task.id
    ? { ...t, status: 'completed' as const, completedAt: ids.at } : t)
  const next: T05StageMutation = {
    caseStage: aggregate.caseV2.stage,
    tasks: closedTasks, decisions: [...aggregate.decisions],
    supplements: [...aggregate.supplements],
  }

  if (proposal.action === 'return-for-supplement') {
    if (!proposal.supplement) throw Error('T05_SUPPLEMENT_PROPOSAL_REQUIRED')
    const newSupplement: SupplementRequest = {
      id: ids.supplementId,
      caseId: aggregate.caseV2.id,
      originFindingKeys: [],
      requiredElements: proposal.supplement.requiredElements,
      reason: proposal.supplement.publicReason,
      responsibleRole: 'student',
      status: 'open', responses: [],
      createdAt: ids.at,
      // Freeze every existing version when the T05 request is created. An old
      // document cannot be submitted as a new attachment to satisfy this request.
      documentVersionIdsAtRequest: (aggregate.caseV2.documents ?? []).map(doc => doc.versionId),
      originTaskId: task.id,
      originStageId: task.stageId,
    }
    next.supplements.push(newSupplement)
    next.addedSupplement = newSupplement
    next.caseStage = 'awaiting-supplement'
    return next
  }

  if (!proposal.basedOnRunId || !proposal.decisionFinality) throw Error('T05_REAL_RUN_DECISION_REQUIRED')
  const newDecision: BusinessDecision = {
    id: ids.decisionId,
    actor,
    scope: { kind: 'case', ids: [] },
    stageId: task.stageId,
    result: proposal.action === 'final-reject' ? 'reject' :
      proposal.action === 'return-to-previous-stage' ? 'return' : 'pass',
    reason: proposal.reason,
    basedOnRunId: proposal.basedOnRunId,
    basedOnRevision: aggregate.caseV2.revision,
    at: ids.at,
    finality: proposal.decisionFinality,
    taskId: task.id,
    round: task.round,
  }
  next.decisions.push(newDecision)
  next.addedDecision = newDecision

  const stageId = proposal.nextStageId ?? proposal.returnToStageId
  if (stageId && proposal.nextAssigneeRole) {
    const newTask: WorkflowTask = {
      id: ids.nextTaskId,
      caseId: aggregate.caseV2.id,
      stageId,
      round: task.round + (proposal.returnToStageId ? 1 : 0),
      assigneeRole: proposal.nextAssigneeRole,
      status: 'open',
      prerequisiteTaskId: task.id,
      inputRevision: aggregate.caseV2.revision,
      createdAt: ids.at,
    }
    next.tasks.push(newTask)
    next.addedTask = newTask
    next.caseStage = 'reviewing'
  } else {
    next.caseStage = 'decided'
  }
  return next
}
