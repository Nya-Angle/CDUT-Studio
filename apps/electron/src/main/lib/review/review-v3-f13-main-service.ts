/**
 * F13 本地申诉事务入口。
 *
 * Renderer 只能提交申诉内容和期望修订号；实际申诉人、复审人、ID、
 * 当前有效 Run 都由 Main 产生或核实。这里的 local 身份仅表示本机记录，
 * 不代表学校账号认证，也不允许改写原业务决定。
 */
import { randomUUID } from 'node:crypto'
import type { Actor, Appeal, BusinessDecision, ReviewCommandResult, ReviewRunV2 } from '@profer/shared'
import { CommandValidationError, readAggregate, submitCommand } from './case-store-v2'
import { LOCAL_SUBMITTER_ACTOR } from './review-ipc-actor-guard'
import { currentT05Run, deriveT05LocalActor, resolveT05BusinessMode } from './review-v3-t05-main-service'
import {
  planF13AppealReview, planF13AppealSubmission, planF13AppealWithdrawal,
} from './review-v3-f13-appeal-flow'
import { assertSafeReviewStorageId } from './review-storage-id'

interface F13CommandIdentity {
  caseId: string
  requestId: string
  expectedRevision: number
}

export interface F13SubmitAppealCommand extends F13CommandIdentity {
  againstDecisionId: string
  statement: string
  newEvidenceDocumentVersionIds: string[]
  /** 本机旧案卷尚无提交方绑定时，用户明确声明为本机申诉人。 */
  confirmLocalSubmitter?: boolean
}

export interface F13ReviewAppealCommand extends F13CommandIdentity {
  appealId: string
  resolution: 'maintain-original' | 'amend-original'
  reason: string
  amendedResult?: BusinessDecision['result']
}

export interface F13WithdrawAppealCommand extends F13CommandIdentity {
  appealId: string
}

function assertCommand(input: F13CommandIdentity): void {
  assertSafeReviewStorageId(input?.caseId, 'caseId')
  if (typeof input.requestId !== 'string' || !input.requestId.trim()
      || !Number.isSafeInteger(input.expectedRevision) || input.expectedRevision < 0) {
    throw new CommandValidationError('VALIDATION_FAILED', '申诉请求标识或案卷修订号非法')
  }
}

function requireLocalBusiness(aggregate: Parameters<typeof resolveT05BusinessMode>[0]): void {
  if (resolveT05BusinessMode(aggregate).mode !== 'local-business') {
    throw new CommandValidationError('INVALID_TRANSITION', '技术预审不能直接创建正式业务申诉')
  }
}

function sameActor(actor: Actor, other: Pick<Actor, 'actorId' | 'actorSource'>): boolean {
  return actor.actorId === other.actorId && actor.actorSource === other.actorSource
}

/** 为本地申诉自动指派与原决定人不同的 Main 本地复核角色。 */
function chooseLocalReviewer(decider: Actor): Actor {
  const teacher = deriveT05LocalActor({ role: 'teacher' })
  const reviewer = deriveT05LocalActor({ role: 'reviewer' })
  const candidate = !sameActor(teacher, decider) ? teacher : reviewer
  if (sameActor(candidate, decider)) {
    throw new CommandValidationError('INVALID_TRANSITION', '无法指派与原决定人不同的本地复核角色')
  }
  return candidate
}

export function submitLocalF13Appeal(input: F13SubmitAppealCommand): Promise<ReviewCommandResult<Appeal>> {
  assertCommand(input)
  if (!Array.isArray(input.newEvidenceDocumentVersionIds)
    || input.newEvidenceDocumentVersionIds.some((id) => typeof id !== 'string' || !id.trim())) {
    throw new CommandValidationError('VALIDATION_FAILED', '申诉引用的材料版本必须为有效标识列表')
  }
  return submitCommand(input.caseId, {
    requestId: input.requestId,
    expectedRevision: input.expectedRevision,
    actor: LOCAL_SUBMITTER_ACTOR,
    type: 'SubmitLocalAppealV3',
    payload: {
      againstDecisionId: input.againstDecisionId,
      statement: input.statement,
      newEvidenceDocumentVersionIds: input.newEvidenceDocumentVersionIds,
      confirmLocalSubmitter: input.confirmLocalSubmitter === true,
    },
  }, (aggregate, payload) => {
    requireLocalBusiness(aggregate)
    const bound = aggregate.caseV2.submitter
    if (bound && !sameActor(LOCAL_SUBMITTER_ACTOR, bound)) {
      throw new CommandValidationError('INVALID_TRANSITION', '案卷已经绑定其他提交人，不能以本机申诉人代替')
    }
    if (!bound && !payload.confirmLocalSubmitter) {
      throw new CommandValidationError('VALIDATION_FAILED', '首次本地申诉须确认本机申诉人身份')
    }
    const effectiveAggregate = bound ? aggregate : {
      ...aggregate,
      caseV2: {
        ...aggregate.caseV2,
        submitter: { actorId: LOCAL_SUBMITTER_ACTOR.actorId, actorSource: LOCAL_SUBMITTER_ACTOR.actorSource },
      },
    }
    const original = effectiveAggregate.decisions.find((decision) => decision.id === payload.againstDecisionId)
    if (!original) throw new CommandValidationError('NOT_FOUND', '被申诉的最终决定不存在')
    const at = new Date().toISOString()
    const plan = planF13AppealSubmission(effectiveAggregate, LOCAL_SUBMITTER_ACTOR, {
      againstDecisionId: payload.againstDecisionId,
      statement: payload.statement,
      newEvidenceDocumentVersionIds: payload.newEvidenceDocumentVersionIds,
    }, {
      reviewer: chooseLocalReviewer(original.actor),
      appealId: `appeal-${randomUUID()}`,
      taskId: `task-appeal-${randomUUID()}`,
      at,
    })
    return {
      summary: `提交本地申诉 ${plan.appeal.id}，待复核`,
      mutate: (draft) => {
        if (!bound) draft.caseV2.submitter = effectiveAggregate.caseV2.submitter
        draft.appeals = [...draft.appeals, plan.appeal]
        draft.tasks = [...draft.tasks, plan.reviewTask]
        draft.caseV2.stage = plan.caseStage
        return plan.appeal
      },
    }
  })
}


/**
 * RUN-24: a Run can only vouch for appeal evidence it actually froze. Matching
 * is exact versionId only: a stale Run that froze an older version of the same
 * document must not back the newly submitted version.
 */
export function runCoversAppealEvidence(
  run: Pick<ReviewRunV2, 'inputManifest'>,
  evidenceVersionIds: readonly string[],
): boolean {
  if (evidenceVersionIds.length === 0) return true
  const versions = new Set(run.inputManifest.documentVersions.map((entry) => entry.versionId))
  return evidenceVersionIds.every((id) => versions.has(id))
}

/** 独立复核必须从原子案卷中的真实指派核实本地身份。 */
export function reviewLocalF13Appeal(input: F13ReviewAppealCommand): Promise<ReviewCommandResult<Appeal>> {
  assertCommand(input)
  if (input.resolution !== 'maintain-original' && input.resolution !== 'amend-original') {
    throw new CommandValidationError('VALIDATION_FAILED', '独立复核结论只能维持或更正原决定')
  }
  const current = readAggregate(input.caseId)
  const currentAppeal = current?.appeals.find((candidate) => candidate.id === input.appealId)
  const currentAssignment = current?.tasks.find((candidate) => candidate.id === currentAppeal?.reviewTaskId)
  const trustedLocalActors = [deriveT05LocalActor({ role: 'teacher' }), deriveT05LocalActor({ role: 'reviewer' })]
  const reviewerActor = trustedLocalActors.find((actor) => actor.actorId === currentAssignment?.assigneeActorId
    && actor.role === currentAssignment?.assigneeRole)
  if (!reviewerActor) throw new CommandValidationError('INVALID_TRANSITION', '尚无有效的本机独立复核指派')
  return submitCommand(input.caseId, {
    requestId: input.requestId,
    expectedRevision: input.expectedRevision,
    actor: reviewerActor,
    type: 'ReviewLocalAppealV3',
    payload: {
      appealId: input.appealId,
      resolution: input.resolution,
      reason: input.reason,
      ...(input.amendedResult ? { amendedResult: input.amendedResult } : {}),
    },
  }, (aggregate, payload) => {
    requireLocalBusiness(aggregate)
    const appeal = aggregate.appeals.find((candidate) => candidate.id === payload.appealId)
    if (!appeal) throw new CommandValidationError('NOT_FOUND', '申诉不存在')
    const task = aggregate.tasks.find((candidate) => candidate.id === appeal.reviewTaskId)
    if (!task?.assigneeActorId) {
      throw new CommandValidationError('INVALID_TRANSITION', '申诉没有 Main 指派的本地复核人')
    }
    const reviewer = trustedLocalActors
      .find((actor) => actor.actorId === task.assigneeActorId && actor.role === task.assigneeRole)
    if (!reviewer || !sameActor(reviewer, reviewerActor)) {
      throw new CommandValidationError('INVALID_TRANSITION', '复核指派已变更，请刷新后重试')
    }
    const run = currentT05Run(aggregate)
    // RUN-24: a later startedAt alone is not proof that the new evidence was
    // reviewed. The verifying Run must have frozen those exact document
    // versions in its immutable input manifest (and therefore in its checks).
    // A T04/partial Run that never saw the new versions cannot back the review.
    const evidenceCovered = run
      ? runCoversAppealEvidence(run, appeal.newEvidenceDocumentVersionIds)
      : false
    const verifiedRunId = run
      && run.startedAt > appeal.createdAt
      && evidenceCovered
      ? run.id
      : undefined
    if (appeal.newEvidenceDocumentVersionIds.length > 0 && !verifiedRunId) {
      throw new CommandValidationError('INVALID_TRANSITION',
        '申诉新证据尚未由提交后启动的 Run 在冻结输入中核验，不能仅凭时间较新的 Run 复核')
    }
    const plan = planF13AppealReview(aggregate, reviewer, {
      appealId: payload.appealId,
      resolution: payload.resolution,
      reason: payload.reason,
      ...(payload.amendedResult ? { amendedResult: payload.amendedResult } : {}),
    }, {
      decisionId: `decision-appeal-${randomUUID()}`,
      reviewedAt: new Date().toISOString(),
      ...(verifiedRunId ? { verifiedRunId } : {}),
    })
    return {
      summary: plan.summary,
      mutate: (draft) => {
        draft.appeals = draft.appeals.map((current) => current.id === plan.appeal.id ? plan.appeal : current)
        draft.tasks = plan.tasks
        if (plan.amendment) draft.decisions = [...draft.decisions, plan.amendment]
        draft.caseV2.stage = plan.caseStage
        return plan.appeal
      },
    }
  })
}

export function withdrawLocalF13Appeal(input: F13WithdrawAppealCommand): Promise<ReviewCommandResult<Appeal>> {
  assertCommand(input)
  return submitCommand(input.caseId, {
    requestId: input.requestId,
    expectedRevision: input.expectedRevision,
    actor: LOCAL_SUBMITTER_ACTOR,
    type: 'WithdrawLocalAppealV3',
    payload: { appealId: input.appealId },
  }, (aggregate, payload) => {
    requireLocalBusiness(aggregate)
    const plan = planF13AppealWithdrawal(aggregate, LOCAL_SUBMITTER_ACTOR,
      payload.appealId, new Date().toISOString())
    return {
      summary: plan.summary,
      mutate: (draft) => {
        draft.appeals = draft.appeals.map((current) => current.id === plan.appeal.id ? plan.appeal : current)
        draft.tasks = plan.tasks
        draft.caseV2.stage = plan.caseStage
        return plan.appeal
      },
    }
  })
}
