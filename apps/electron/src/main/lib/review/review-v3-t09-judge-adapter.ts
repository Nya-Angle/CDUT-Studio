/**
 * F18：T09 评委离线回件 ↔ T07 评分轮次适配。
 *
 * 不维护第二份评分状态：只读取 T07 持久轮次，评分提交委托现有 T07 Main CAS。
 * 包里的 reviewerId 仅为独立副本的身份声明；导入必须经本机组织者显式确认，
 * 不能据此模拟学校认证或校方审批。
 */
import type { CaseAggregateV2, JudgeAssignment } from '@profer/shared'
import { currentT07Round, type T07Action } from './review-v3-t07-rating-workflow'
import { readT07State } from './review-v3-t07-state-store'
import {
  importT09Reply, previewT09Reply, readT09File, type T09Preview, type T09ReplyPackage,
  type T09State, type T09TaskPackage, type T09Receipt,
} from './review-v3-t09-offline-codec'
import { issueT09JudgeFromCase } from './review-v3-t09-offline-issuer'
import { readT09Receipt, readT09TaskPackage, saveT09Receipt, saveT09TaskPackage } from './review-v3-t09-main-service'

type RatingSubmit = Extract<T07Action, { type: 'submit' }>

export interface T09JudgeImportDeps {
  /** 由 Main 使用现有 T07 action/CAS writer 注入；不得直接写 votes 数组。 */
  submitRating: (input: {
    batchId: string
    reviewerId: string
    expectedRevision: number
    action: RatingSubmit
  }) => Promise<{ revision: number }>
  /** 可信 Main 的本地确认动作；不能把包内角色当作授权依据。 */
  confirmLocalOrganizer: () => boolean
}

export interface T09JudgeIssueResult {
  packageId: string
  actionId: string
  json: string
  batchId: string
  round: number
}

function getJudging(batchId: string) {
  const persisted = readT07State(batchId)
  if (!persisted) throw new Error('T09_JUDGE_BATCH_NOT_FOUND')
  return persisted
}

/** 使用实际 T07 批次分配签发匿名评分包，不公开姓名或其他评委的评分。 */
export function issueT09JudgePackage(input: {
  aggregate: CaseAggregateV2
  batchId: string
  assignmentId: string
}): T09JudgeIssueResult {
  const { state, revision } = getJudging(input.batchId)
  const round = currentT07Round(state)
  if (round.finalized) throw new Error('已冻结的评分轮次不能签发新任务')
  if (!state.cases.some((entry) => entry.caseId === input.aggregate.caseV2.id)) throw new Error('案卷不属于该评审批次')
  const assigned = round.assignments.find((entry) => entry.id === input.assignmentId && entry.caseId === input.aggregate.caseV2.id)
  if (!assigned || assigned.status !== 'assigned' || assigned.rubricVersion !== state.rubricVersion) {
    throw new Error('没有可签发的当前评分分配')
  }
  const legacyAssignment: JudgeAssignment = { ...assigned, recused: false, status: 'assigned' }
  const task = issueT09JudgeFromCase(input.aggregate, legacyAssignment, state.rubric, [], [], {
    batchId: input.batchId, round: round.number, revision,
  })
  saveT09TaskPackage(input.aggregate.caseV2.id, task)
  return { packageId: task.packageId, actionId: task.actionId,
    json: JSON.stringify(task, null, 2), batchId: input.batchId, round: round.number }
}

function loadJudgeReply(caseId: string, packageJson: string): { reply: T09ReplyPackage; task: T09TaskPackage; batchId: string } {
  const parsed = readT09File(packageJson)
  if (parsed.type !== 'reply' || parsed.reply.kind !== 'judge-rating-reply') throw new Error('T09_NOT_A_JUDGE_REPLY')
  if (parsed.caseId !== caseId) throw new Error('T09_CASE_MISMATCH')
  const task = readT09TaskPackage(caseId, parsed.requestPackageId)
  if (!task || task.task.kind !== 'judge-rating-reply' || !task.task.batchId ||
    !Number.isInteger(task.task.round) || !Number.isInteger(task.task.caseRevision)) {
    throw new Error('T09_JUDGE_TASK_NOT_FOUND_OR_UNBOUND')
  }
  return { reply: parsed, task, batchId: task.task.batchId }
}

function judgeState(aggregate: CaseAggregateV2, task: T09TaskPackage, batchId: string): {
  state: T09State; additionalConflicts: string[]
} {
  const persisted = getJudging(batchId)
  const round = currentT07Round(persisted.state)
  const assignments: T09State['assignments'] = {}
  for (const assigned of round.assignments) {
    if (assigned.caseId !== aggregate.caseV2.id) continue
    assignments[assigned.id] = {
      reviewerId: assigned.reviewerId, rubricVersion: assigned.rubricVersion,
      status: assigned.status === 'recused' ? 'missing' : assigned.status,
      recused: assigned.status === 'recused',
    }
  }
  const additionalConflicts: string[] = []
  if (task.task.kind === 'judge-rating-reply') {
    if (task.task.round !== round.number) additionalConflicts.push(`评分轮次已变化：任务第 ${task.task.round} 轮，当前第 ${round.number} 轮`)
    if (task.task.caseRevision !== aggregate.caseV2.revision) additionalConflicts.push(`案卷版本已变化：任务 ${task.task.caseRevision}，当前 ${aggregate.caseV2.revision}`)
    if (!persisted.state.cases.some((entry) => entry.caseId === aggregate.caseV2.id)) additionalConflicts.push('案卷已不属于该批次')
    if (persisted.state.rubricVersion !== task.task.rubricVersion) additionalConflicts.push('评分量表版本已变化')
  }
  if (round.finalized) additionalConflicts.push('本轮评分已冻结，不能再导入回件')
  return {
    state: {
      caseId: aggregate.caseV2.id, revision: persisted.revision,
      lock: { templateId: aggregate.caseV2.templateId, templateVersion: aggregate.caseV2.templateVersion, policyVersionIds: [] },
      supplements: {}, assignments,
    }, additionalConflicts,
  }
}

function checkedPreview(aggregate: CaseAggregateV2, reply: T09ReplyPackage, task: T09TaskPackage, batchId: string): T09Preview {
  const { state, additionalConflicts } = judgeState(aggregate, task, batchId)
  const preview = previewT09Reply(reply, task, state)
  if (!additionalConflicts.length || preview.status === 'rejected') return preview
  return { ...preview, status: 'conflict', details: [...preview.details, ...additionalConflicts] }
}

/** 预览不更改评分状态；冲突会展示批次、轮次、量表和案卷版本差异。 */
export function previewT09JudgePackage(input: {
  aggregate: CaseAggregateV2; packageJson: string
}): { preview: T09Preview; batchId: string } {
  const { reply, task, batchId } = loadJudgeReply(input.aggregate.caseV2.id, input.packageJson)
  return { preview: checkedPreview(input.aggregate, reply, task, batchId), batchId }
}

/** 仅在可信 Main 完成组织者确认后，将独立评委回件送进现有 T07 写入。 */
export async function importT09JudgePackage(input: {
  aggregate: CaseAggregateV2
  packageJson: string
  deps: T09JudgeImportDeps
}): Promise<{ status: 'accepted' | 'duplicate'; receipt: T09Receipt } | { status: 'conflict' | 'rejected'; preview: T09Preview }> {
  const { reply, task, batchId } = loadJudgeReply(input.aggregate.caseV2.id, input.packageJson)
  const stored = readT09Receipt(reply.caseId, reply.actionId)
  if (stored && (stored.hash !== reply.hash || stored.caseId !== reply.caseId)) {
    return { status: 'rejected', preview: {
      status: 'rejected', caseId: reply.caseId, actionId: reply.actionId,
      baseRevision: reply.baseRevision, currentRevision: getJudging(batchId).revision,
      details: ['相同 actionId 已有不同载荷的持久回执，拒绝覆盖'],
    } }
  }
  if (stored?.status === 'accepted' && stored.hash === reply.hash && stored.caseId === reply.caseId) {
    return { status: 'duplicate', receipt: stored }
  }
  // Crash recovery: T07 CAS may have succeeded before receipts.json was written.
  // A matching vote is recoverable ONLY if Main durably tagged that precise actionId
  // in the same T07 transaction. Identical scores alone are never proof of import.
  const persisted = getJudging(batchId)
  const round = currentT07Round(persisted.state)
  const existingVote = round.votes.find((vote) => vote.offlineActionId === reply.actionId)
  if (existingVote) {
    const integrity = checkedPreview(input.aggregate, reply, task, batchId)
    const expected = reply.reply
    const matches = expected.kind === 'judge-rating-reply' &&
      task.task.kind === 'judge-rating-reply' &&
      existingVote.assignmentId === expected.assignmentId &&
      existingVote.caseId === reply.caseId &&
      existingVote.reviewerId === task.recipient.actorId &&
      existingVote.round === task.task.round &&
      JSON.stringify(existingVote.scores) === JSON.stringify(expected.scores) &&
      existingVote.publicFeedback === expected.publicFeedback.trim() &&
      (existingVote.internalNotes ?? '') === (expected.internalNotes?.trim() ?? '')
    if (integrity.status === 'rejected' || !matches) {
      return { status: 'rejected', preview: {
        ...integrity, status: 'rejected',
        details: ['评分动作 ID 已被持久记录，但载荷或签发任务不匹配；拒绝重新导入'],
      } }
    }
    const recovered: T09Receipt = {
      actionId: reply.actionId, hash: reply.hash, caseId: reply.caseId,
      status: 'accepted', newRevision: persisted.revision,
    }
    saveT09Receipt(reply.caseId, recovered)
    return { status: 'duplicate', receipt: recovered }
  }
  const preview = checkedPreview(input.aggregate, reply, task, batchId)
  if (preview.status !== 'ready') return { status: preview.status, preview }
  // Authorize only a new, validated mutation. Duplicate receipts and CAS
  // crash recovery never require a second confirmation or score write.
  if (!input.deps.confirmLocalOrganizer()) throw new Error('T09_LOCAL_ORGANIZER_CONFIRMATION_REQUIRED')
  const { state } = judgeState(input.aggregate, task, batchId)
  const outcome = await importT09Reply(reply, task, state,
    async (actionId) => readT09Receipt(reply.caseId, actionId),
    async (item, expectedRevision) => {
      if (item.reply.kind !== 'judge-rating-reply' || task.task.kind !== 'judge-rating-reply') {
        throw new Error('T09_NOT_A_JUDGE_REPLY')
      }
      try {
        const committed = await input.deps.submitRating({
          batchId, reviewerId: task.recipient.actorId, expectedRevision,
          action: {
            type: 'submit', assignmentId: task.task.assignmentId,
            offlineActionId: item.actionId,
            scores: item.reply.scores, publicFeedback: item.reply.publicFeedback,
            ...(item.reply.internalNotes ? { internalNotes: item.reply.internalNotes } : {}),
          },
        })
        return { actionId: item.actionId, hash: item.hash, caseId: item.caseId,
          status: 'accepted', newRevision: committed.revision }
      } catch (error) {
        return { actionId: item.actionId, hash: item.hash, caseId: item.caseId,
          status: 'rejected', message: error instanceof Error ? error.message : String(error) }
      }
    },
  )
  if (outcome.status === 'accepted' || outcome.status === 'duplicate') saveT09Receipt(reply.caseId, outcome.receipt)
  return outcome
}
