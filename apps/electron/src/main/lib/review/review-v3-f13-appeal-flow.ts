/**
 * F13 申诉领域提案：由可信 Main 提供真实操作者、复审指派、ID 与时间。
 *
 * 本模块只计算下一状态，不读取磁盘、不签发角色、不写 CaseAggregate。
 * Main 必须在同一次 submitCommand/CAS 中追加 Appeal、WorkflowTask、
 * BusinessDecision，并更新案卷阶段；前端能力展示不能代替命令校验。
 */
import type {
  Actor, Appeal, BusinessDecision, CaseAggregateV2, CaseStage, WorkflowTask,
} from '@profer/shared'
import {
  prepareT05AppealResolution, prepareT05AppealSubmission, prepareT05AppealWithdrawal,
  type T05ReviewAppealInput, type T05SubmitAppealInput,
} from './review-v3-t05-appeal-actions'

export interface F13AppealAssignment {
  /** Main 核实的独立复审人；不能从 Renderer 的角色字段推导。 */
  reviewer: Actor
  appealId: string
  taskId: string
  at: string
}

export interface F13AppealSubmissionPlan {
  appeal: Appeal
  reviewTask: WorkflowTask
  caseStage: CaseStage
}

export interface F13AppealClosurePlan {
  appeal: Appeal
  tasks: WorkflowTask[]
  caseStage: CaseStage
  amendment?: BusinessDecision
  /** 写入事务 Receipt 的复核摘要；不伪造新增业务决定。 */
  summary: string
}

function sameActor(left: Pick<Actor, 'actorId' | 'actorSource'>,
  right: Pick<Actor, 'actorId' | 'actorSource'>): boolean {
  return left.actorId === right.actorId && left.actorSource === right.actorSource
}

function assertTrustedHuman(actor: Actor): void {
  if (!actor.actorId.trim() || !['local', 'school'].includes(actor.actorSource)) {
    throw new Error('申诉业务必须由 Main 核实的具名本地/学校主体办理')
  }
}

function assertSubmitter(aggregate: CaseAggregateV2, actor: Actor): void {
  assertTrustedHuman(actor)
  if (actor.role !== 'student') throw new Error('只有提交方可以申诉或撤回申诉')
  if (!aggregate.caseV2.submitter || !sameActor(aggregate.caseV2.submitter, actor)) {
    throw new Error('案卷提交人身份未绑定或与当前操作者不符')
  }
}

function assertReviewAssignee(aggregate: CaseAggregateV2, appeal: Appeal, actor: Actor): WorkflowTask {
  assertTrustedHuman(actor)
  if (actor.role !== 'reviewer' && actor.role !== 'teacher') throw new Error('当前角色不能独立复审')
  const task = aggregate.tasks.find((item) => item.id === appeal.reviewTaskId)
  if (!task || !['open', 'in-progress', 'submitted'].includes(task.status) || task.stageId !== 'appeal-review') {
    throw new Error('当前申诉没有有效的独立复审任务')
  }
  if (task.assigneeActorId !== actor.actorId || task.assigneeRole !== actor.role) {
    throw new Error('复审任务未指派给当前操作者')
  }
  if (sameActor(appeal.appellant, actor)) throw new Error('申请人不能审理自己的申诉')
  return task
}

function afterClosingAppeal(aggregate: CaseAggregateV2, appealId: string, tasks: WorkflowTask[]): CaseStage {
  const otherPending = aggregate.appeals.some((item) => item.id !== appealId
    && (item.status === 'submitted' || item.status === 'in-review'))
  return otherPending || tasks.some((task) => task.status === 'open') ? 'awaiting-review' : 'decided'
}

/** 提交申诉与创建独立任务必须作为一次事务写入。 */
export function planF13AppealSubmission(
  aggregate: CaseAggregateV2,
  appellant: Actor,
  input: T05SubmitAppealInput,
  assignment: F13AppealAssignment,
): F13AppealSubmissionPlan {
  assertSubmitter(aggregate, appellant)
  assertTrustedHuman(assignment.reviewer)
  if (!['reviewer', 'teacher'].includes(assignment.reviewer.role)) {
    throw new Error('独立复审人必须是审核员或教师')
  }
  if (sameActor(assignment.reviewer, appellant)) throw new Error('申请人不能担任复审人')
  if (!assignment.appealId.trim() || !assignment.taskId.trim() || !assignment.at.trim()) {
    throw new Error('申诉标识、任务标识和时间必须由 Main 提供')
  }
  if (aggregate.appeals.some((item) => item.id === assignment.appealId)
    || aggregate.tasks.some((task) => task.id === assignment.taskId)) {
    throw new Error('申诉或复审任务标识已存在')
  }

  const appeal = prepareT05AppealSubmission(aggregate, appellant, input,
    { id: assignment.appealId, at: assignment.at })
  const original = aggregate.decisions.find((decision) => decision.id === appeal.againstDecisionId)!
  if (sameActor(original.actor, assignment.reviewer)) throw new Error('原决定人不能担任独立复审人')

  const round = Math.max(0, ...aggregate.tasks.filter((task) => task.stageId === 'appeal-review')
    .map((task) => task.round)) + 1
  const reviewTask: WorkflowTask = {
    id: assignment.taskId,
    caseId: aggregate.caseV2.id,
    stageId: 'appeal-review',
    round,
    assigneeRole: assignment.reviewer.role,
    assigneeActorId: assignment.reviewer.actorId,
    status: 'open',
    inputRevision: aggregate.caseV2.revision,
    createdAt: assignment.at,
  }
  return { appeal: { ...appeal, reviewTaskId: reviewTask.id }, reviewTask, caseStage: 'awaiting-review' }
}

/**
 * 独立复审：先核实任务指派，再复用 T05 的决定更正规则。
 * 新证据尚未经新 Run 核验时，不能直接声称维持原决定。
 */
export function planF13AppealReview(
  aggregate: CaseAggregateV2,
  reviewer: Actor,
  input: T05ReviewAppealInput,
  context: { decisionId: string; reviewedAt: string; verifiedRunId?: string },
): F13AppealClosurePlan {
  const appeal = aggregate.appeals.find((item) => item.id === input.appealId)
  if (!appeal) throw new Error('申诉不存在')
  const task = assertReviewAssignee(aggregate, appeal, reviewer)
  if (appeal.newEvidenceDocumentVersionIds.length > 0 && !context.verifiedRunId) {
    throw new Error('申诉提出新证据，必须先完成当前材料的核验运行')
  }
  const proposal = prepareT05AppealResolution(aggregate, reviewer, input, context)
  const tasks = aggregate.tasks.map((candidate) => candidate.id === task.id
    ? { ...candidate, status: 'completed' as const, completedAt: context.reviewedAt }
    : candidate)
  return {
    appeal: proposal.appeal,
    tasks,
    caseStage: afterClosingAppeal(aggregate, appeal.id, tasks),
    ...(proposal.amendment ? { amendment: proposal.amendment } : {}),
    summary: `申诉 ${appeal.id}：${input.resolution === 'maintain-original' ? '维持原决定' : '追加更正决定'}；复审人 ${reviewer.actorId}；理由：${input.reason.trim()}`,
  }
}

/** 原申诉人可以撤回未处理完的申诉，原业务决定不删除。 */
export function planF13AppealWithdrawal(
  aggregate: CaseAggregateV2,
  appellant: Actor,
  appealId: string,
  at: string,
): F13AppealClosurePlan {
  assertSubmitter(aggregate, appellant)
  const appeal = aggregate.appeals.find((item) => item.id === appealId)
  if (!appeal) throw new Error('申诉不存在')
  const withdrawn = prepareT05AppealWithdrawal(appeal, appellant)
  const task = aggregate.tasks.find((item) => item.id === appeal.reviewTaskId)
  if (!task || !['open', 'in-progress', 'submitted'].includes(task.status) || task.stageId !== 'appeal-review') {
    throw new Error('申诉没有可关闭的复审任务')
  }
  const tasks = aggregate.tasks.map((item) => item.id === task.id
    ? { ...item, status: 'cancelled' as const, completedAt: at }
    : item)
  return {
    appeal: withdrawn,
    tasks,
    caseStage: afterClosingAppeal(aggregate, appeal.id, tasks),
    summary: `原申请人 ${appellant.actorId} 撤回申诉 ${appeal.id}，原业务决定保留`,
  }
}
