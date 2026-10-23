/**
 * 阶段任务推进与业务闭环（N3，docs/design/review-agent/07 §7.1 + 06 §5.2；R07）
 *
 * 修正误判 6（旧 business-workflow 阶段映射过简）：
 * - 初审通过 ≠ decided：推进下一阶段任务；只有最终阶段才形成最终决定
 * - 最终驳回 → decided（不自动待补件）；退回补件才开补件请求；退回前级 → 新任务轮次（原意见保留）
 * - 撤回 → archived
 * - 补件：多个未结束请求全部结束才恢复阶段；"已回复"≠"已满足"
 * - 申诉：resolution 明确 maintain-original/amend-original/withdrawn；更正=追加关联决定（不改写原判）
 * - 最终决定投影：按 finality/范围计算，不取时间最后一条
 *
 * 全部变更走 case-store-v2 命令事务（幂等回执、revision 事务统一 +1）。
 */

import type { Appeal, BusinessDecision, CaseAggregateV2, ReviewCommandResult, SupplementRequest, TemplateVersion, WorkflowTask } from '@profer/shared'
import { randomUUID } from 'node:crypto'
import { CommandValidationError, submitCommand, type CommandSourceMeta } from './case-store-v2'
import type { Actor } from '@profer/shared'

const newWorkflowTaskId = (): string => `task-${randomUUID()}`

// ===== 任务创建（提交案卷时按模板首阶段建任务） =====

export async function ensureInitialTask(caseId: string, template: TemplateVersion, actor: Actor): Promise<ReviewCommandResult<WorkflowTask>> {
  const firstStage = template.stages[0]
  if (!firstStage) throw new CommandValidationError('VALIDATION_FAILED', '模板没有阶段')
  return submitCommand<Record<string, never>, WorkflowTask>(caseId, { requestId: `task-init-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, actor, expectedRevision: 0, type: 'EnsureInitialTask', payload: {} }, (aggregate) => {
    if (aggregate.tasks.length > 0) throw new CommandValidationError('INVALID_TRANSITION', '任务已初始化')
    return {
      summary: `创建初审任务（${firstStage.name}）`,
      mutate: (draft) => {
        const created: WorkflowTask = { id: newWorkflowTaskId(), caseId: draft.caseV2.id, stageId: firstStage.id, round: 1, assigneeRole: firstStage.executorRole, status: 'open', inputRevision: draft.caseV2.revision, createdAt: new Date().toISOString() }
        draft.tasks = [...draft.tasks, created]
        return created
      },
    }
  })
}

// ===== 阶段决定（06 §5.2 动作表） =====

// ===== 决定类命令的 Agent 代批门控（08 设计 §2.1；C1：默认禁止） =====

/**
 * 断言决定类命令的操作者合法性。
 * - 人工来源（local/mock/school）：放行（业务角色门控由各命令原有校验负责）。
 * - Agent 来源：C1 一律拒绝（AGENT_DECISION_DISABLED）；C2 将在此接入代批开关，
 *   开关读取放在事务校验内（排队期间关闭开关也生效）。
 * 覆盖范围：RecordStageDecision 全部改变决定的动作 + ResolveSupplement；
 * RespondSupplement 是提交者侧动作，不受此门控（由指派与归属校验约束）。
 */
function assertAgentDecisionAllowed(command: { actor: Actor; type: string }): void {
  if (command.actor.actorSource !== 'agent') return
  // C2：代批开关——事务校验内读取（settings 内存缓存与 updateSettings 同步更新，排队期间关闭立即生效）
  const { getSettings } = require('../settings-service') as typeof import('../settings-service')
  if (getSettings().reviewAgentAutoApproval === true) return
  throw new CommandValidationError('AGENT_DECISION_DISABLED', 'AI 代批未开启：此类决定需要人工做出（可在审核专区高级设置中开启并确认风险）')
}



export type StageDecisionAction = 'stage-pass' | 'item-pass' | 'item-partial-pass' | 'return-for-supplement' | 'return-to-previous-stage' | 'final-reject' | 'withdraw'

export interface StageDecisionPayload {
  action: StageDecisionAction
  taskId: string
  reason: string
  /** 终审分值（仅终审阶段） */
  finalScores?: BusinessDecision['finalScores']
  /** 退回补件所需要素 */
  supplementRequiredElements?: string[]
  supplementReason?: string
}

const isFinalStage = (aggregate: CaseAggregateV2, stageId: string, template: TemplateVersion): boolean => {
  const stage = template.stages.find((candidate) => candidate.id === stageId)
  return stage?.nextStageId === undefined
}

/** 记录阶段决定（命令事务；动作→状态映射按 06 §5.2 表） */
export function recordStageDecision(
  caseId: string,
  command: { requestId: string; actor: Actor; expectedRevision: number; payload: StageDecisionPayload },
  template: TemplateVersion,
): Promise<ReviewCommandResult<{ decision: BusinessDecision; task?: WorkflowTask; supplement?: SupplementRequest }>> {
  return submitCommand<StageDecisionPayload, { decision: BusinessDecision; task?: WorkflowTask; supplement?: SupplementRequest }>(caseId, { ...command, type: 'RecordStageDecision' }, (aggregate, payload) => {
    // Agent 代批门控：在事务校验内、任何业务变更前检查（排队期间关闭也生效）
    assertAgentDecisionAllowed({ actor: command.actor, type: 'RecordStageDecision' })
    if (aggregate.d2RuntimePlan) throw new CommandValidationError('AGENT_DECISION_DISABLED', 'D2 技术预审案卷无权进入正式阶段决定')
    const task = aggregate.tasks.find((candidate) => candidate.id === payload.taskId && candidate.status === 'open')
    if (!task) throw new CommandValidationError('INVALID_TRANSITION', '当前阶段没有开放任务（或已处理）')
    if (aggregate.caseV2.templateId !== template.templateId || aggregate.caseV2.templateVersion !== template.version
      || template.status !== 'published') {
      throw new CommandValidationError('INVALID_TRANSITION', '案卷与审核模板版本不一致或模板未发布')
    }
    const currentStage = template.stages.find((stage) => stage.id === task.stageId)
    if (!currentStage || currentStage.executorRole !== task.assigneeRole
      || command.actor.role !== task.assigneeRole
      || (task.assigneeActorId && task.assigneeActorId !== command.actor.actorId)) {
      throw new CommandValidationError('INVALID_TRANSITION', '操作者无权处理当前审核阶段任务')
    }
    if (command.actor.actorSource === 'agent' && task.assigneeRole !== 'reviewer') {
      throw new CommandValidationError('AGENT_DECISION_DISABLED', 'Agent 不得代替教师或校方执行阶段决定')
    }
    // 未知/缺失动作必须拒绝：否则会记一条 result=pass 却不动阶段，产生自相矛盾的案卷
    const allowedActions: ReadonlyArray<StageDecisionAction> = ['stage-pass', 'item-pass', 'item-partial-pass',
      'return-for-supplement', 'return-to-previous-stage', 'final-reject', 'withdraw']
    if (!allowedActions.includes(payload?.action)) {
      throw new CommandValidationError('VALIDATION_FAILED', `未知的阶段决定动作：${String(payload?.action)}`)
    }
    if (typeof payload.reason !== 'string' || !payload.reason.trim()) throw new CommandValidationError('VALIDATION_FAILED', '决定必须附理由')
    if (!aggregate.decisions.every((decision) => decision.taskId !== task.id)) throw new CommandValidationError('INVALID_TRANSITION', '该任务已有决定')

    const now = new Date().toISOString()
    const finality: BusinessDecision['finality'] = payload.action === 'final-reject' || (payload.action === 'stage-pass' && isFinalStage(aggregate, task.stageId, template)) ? 'final' : 'stage'
    return {
      summary: `阶段决定：${payload.action}（${task.stageId}）`,
      mutate: (draft): { decision: BusinessDecision; task?: WorkflowTask; supplement?: SupplementRequest } => {
        let decision: BusinessDecision | undefined
        let nextTask: WorkflowTask | undefined
        let supplement: SupplementRequest | undefined

        // 关闭当前任务
        draft.tasks = draft.tasks.map((candidate) => (candidate.id === task.id ? { ...candidate, status: 'completed', completedAt: now } : candidate))
        const result: BusinessDecision['result'] = payload.action === 'final-reject' ? 'reject' : payload.action === 'withdraw' ? 'withdraw' : payload.action === 'return-for-supplement' || payload.action === 'return-to-previous-stage' ? 'return' : payload.action === 'item-partial-pass' ? 'partial-pass' : 'pass'
        decision = {
          id: `dec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          actor: command.actor,
          scope: { kind: 'case', ids: [] },
          stageId: task.stageId,
          result,
          finalScores: payload.finalScores,
          reason: payload.reason.trim(),
          basedOnRunId: `run@rev${aggregate.caseV2.revision}`,
          basedOnRevision: aggregate.caseV2.revision,
          at: now,
          finality,
          taskId: task.id,
          round: task.round,
        }
        draft.decisions = [...draft.decisions, decision!]

        switch (payload.action) {
          case 'stage-pass': {
            const stage = template.stages.find((candidate) => candidate.id === task.stageId)
            if (stage?.nextStageId) {
              // 初审通过 → 下一阶段任务（不是 decided）
              const nextStage = template.stages.find((candidate) => candidate.id === stage.nextStageId)
              nextTask = { id: newWorkflowTaskId(), caseId: draft.caseV2.id, stageId: stage.nextStageId, round: task.round, assigneeRole: nextStage?.executorRole ?? 'teacher', status: 'open', prerequisiteTaskId: task.id, inputRevision: draft.caseV2.revision, createdAt: now }
              draft.tasks = [...draft.tasks, nextTask!]
              draft.caseV2.stage = 'reviewing'
            } else {
              draft.caseV2.stage = 'decided'
            }
            break
          }
          case 'item-pass':
          case 'item-partial-pass':
            // 事项级决定：案卷是否结束由模板要求计算；保持当前阶段开放（其他事项继续）
            draft.tasks = draft.tasks.map((candidate) => (candidate.id === task.id ? { ...candidate, status: 'open', completedAt: undefined } : candidate))
            break
          case 'return-for-supplement': {
            if (!payload.supplementRequiredElements?.length || !payload.supplementReason?.trim()) throw new CommandValidationError('VALIDATION_FAILED', '退回补件必须指定要素与原因')
            supplement = { id: `sup-${Date.now()}`, caseId: draft.caseV2.id, originFindingKeys: [], materialSlotId: undefined, requiredElements: payload.supplementRequiredElements, reason: payload.supplementReason, responsibleRole: 'student', status: 'open', responses: [], createdAt: now, documentVersionIdsAtRequest: draft.caseV2.documents.map((document) => document.versionId), originTaskId: task.id, originStageId: task.stageId }
            draft.supplements = [...draft.supplements, supplement!]
            draft.caseV2.stage = 'awaiting-supplement'
            // 补件回流：创建同阶段新轮次任务（等待补件核验后开放处理）
            break
          }
          case 'return-to-previous-stage': {
            const stage = template.stages.find((candidate) => candidate.id === task.stageId)
            const returnTo = stage?.returnToStageId
            if (!returnTo) throw new CommandValidationError('INVALID_TRANSITION', '该阶段没有退回目标')
            const previousStage = template.stages.find((candidate) => candidate.id === returnTo)
            nextTask = { id: newWorkflowTaskId(), caseId: draft.caseV2.id, stageId: returnTo, round: task.round + 1, assigneeRole: previousStage?.executorRole ?? 'reviewer', status: 'open', prerequisiteTaskId: task.id, inputRevision: draft.caseV2.revision, createdAt: now }
            draft.tasks = [...draft.tasks, nextTask!]
            draft.caseV2.stage = 'reviewing'
            break
          }
          case 'final-reject':
            // 最终驳回 → decided（不自动待补件，修正误判 6）
            draft.caseV2.stage = 'decided'
            break
          case 'withdraw':
            draft.caseV2.stage = 'archived'
            break
        }
        if (!decision) throw new CommandValidationError('VALIDATION_FAILED', '决定未生成')
        return { decision, task: nextTask, supplement }
      },
    }
  })
}

// ===== 补件核验（多请求门控） =====

/** 补件回复（G04：学生/提交方对单个请求提交说明与材料版本；open→responded） */
export function respondSupplementV2(caseId: string, command: { requestId: string; actor: Actor; expectedRevision: number; payload: { supplementId: string; note: string; documentVersionIds?: string[] } }): Promise<ReviewCommandResult<SupplementRequest>> {
  return submitCommand<{ supplementId: string; note: string; documentVersionIds?: string[] }, SupplementRequest>(caseId, { ...command, type: 'RespondSupplement' }, (aggregate, payload) => {
    const target = aggregate.supplements.find((request) => request.id === payload.supplementId)
    if (!target) throw new CommandValidationError('NOT_FOUND', `补件请求不存在: ${payload.supplementId}`)
    if (target.status !== 'open' && target.status !== 'responded' && target.status !== 'insufficient') throw new CommandValidationError('INVALID_TRANSITION', `补件已关闭（${target.status}）`)
    // 角色校验（05 §2 补件责任方）：仅 student/submitter 可回复
    if (target.responsibleRole === 'student' && command.actor.role !== 'student' && command.actor.role !== 'reviewer') throw new CommandValidationError('INVALID_TRANSITION', '该补件由学生负责，其他角色不能代回复')
    if (!payload.note.trim() && !(payload.documentVersionIds?.length)) throw new CommandValidationError('VALIDATION_FAILED', '回复必须附说明或材料')
    // RUN-19：补件回复的 documentVersionIds 必须由 Main 核验归属与时效，不能靠 UI 过滤。
    const suppliedVersions = payload.documentVersionIds ?? []
    if (suppliedVersions.length > 0) {
      if (new Set(suppliedVersions).size !== suppliedVersions.length) {
        throw new CommandValidationError('VALIDATION_FAILED', '补件材料版本 ID 不能重复')
      }
      const activeVersionIds = new Set(
        aggregate.caseV2.documents.filter((document) => document.active !== false).map((document) => document.versionId),
      )
      const foreign = suppliedVersions.filter((versionId) => !activeVersionIds.has(versionId))
      if (foreign.length > 0) {
        throw new CommandValidationError('VALIDATION_FAILED', `补件材料不属于本案当前有效原件：${foreign.join('、')}`)
      }
      const atRequest = new Set(target.documentVersionIdsAtRequest ?? [])
      const reused = suppliedVersions.filter((versionId) => atRequest.has(versionId))
      if (reused.length > 0) {
        throw new CommandValidationError('VALIDATION_FAILED', `补件材料必须是本次补件请求后新登记的原件，不能复用请求前已有版本：${reused.join('、')}`)
      }
    }
    return {
      summary: `补件回复：${target.id}`,
      mutate: (draft) => {
        draft.supplements = draft.supplements.map((request) => (request.id === payload.supplementId
          ? { ...request, status: 'responded', responses: [...request.responses, { id: `resp-${Date.now()}`, documentVersionIds: payload.documentVersionIds ?? [], note: payload.note.trim(), at: new Date().toISOString(), actor: command.actor.actorId }] }
          : request))
      },
      entity: undefined,
    }
  })
}

/** 补件判定：satisfied → 全部未结束请求结束才恢复，并按原阶段回流任务（G05：修正"补件后没有任务"） */
export async function resolveSupplementV2(caseId: string, command: { requestId: string; actor: Actor; expectedRevision: number; payload: { supplementId: string; outcome: 'satisfied' | 'insufficient' | 'cancelled'; reason: string } }): Promise<ReviewCommandResult<SupplementRequest>> {
  const result = await submitCommand<{ supplementId: string; outcome: 'satisfied' | 'insufficient' | 'cancelled'; reason: string }, SupplementRequest>(caseId, { ...command, type: 'ResolveSupplement' }, (aggregate, payload) => {
    // Agent 代批门控：判定满足/不足属于审核决定（08 设计 §2.1）
    assertAgentDecisionAllowed({ actor: command.actor, type: 'ResolveSupplement' })
    const target = aggregate.supplements.find((request) => request.id === payload.supplementId)
    if (!target) throw new CommandValidationError('NOT_FOUND', `补件请求不存在: ${payload.supplementId}`)
    const originTask = target.originTaskId ? aggregate.tasks.find((task) => task.id === target.originTaskId) : undefined
    const requiredRole = originTask?.assigneeRole ?? 'reviewer'
    if (command.actor.role !== requiredRole
      || (originTask?.assigneeActorId && originTask.assigneeActorId !== command.actor.actorId)) {
      throw new CommandValidationError('INVALID_TRANSITION', '无权判定其他审核角色负责的补件')
    }
    // 判定结果必须是三值之一：非法值会让 status 被写成 undefined，
    // 等于把补件记录静默变成「无状态」，既关不掉也门控不住。
    if (payload.outcome !== 'satisfied' && payload.outcome !== 'insufficient' && payload.outcome !== 'cancelled') {
      throw new CommandValidationError('VALIDATION_FAILED',
        `补件判定结果无效：${String(payload.outcome)}（只允许 satisfied / insufficient / cancelled）`)
    }
    if (target.status !== 'open' && target.status !== 'responded') throw new CommandValidationError('INVALID_TRANSITION', `补件已关闭（${target.status}）`)
    if (payload.outcome === 'cancelled' && !payload.reason.trim()) throw new CommandValidationError('VALIDATION_FAILED', '取消补件必须说明理由')
    return {
      summary: `补件判定：${payload.outcome}`,
      mutate: (draft) => {
        draft.supplements = draft.supplements.map((request) => (request.id === payload.supplementId ? { ...request, status: payload.outcome } : request))
        // 多请求门控：所有未满足请求结束才恢复（open/responded/insufficient 都阻断；cancelled=明确豁免）
        const stillOpen = draft.supplements.some((request) => request.status === 'open' || request.status === 'responded' || request.status === 'insufficient')
        // RUN-18: the last closure may be `cancelled` (or `insufficient` resolved later).
        // The stage must resume whenever no unsettled supplement remains, not only
        // when the final verdict happens to be `satisfied`; otherwise A=satisfied,
        // B=cancelled leaves the case stuck in awaiting-supplement.
        if (!stillOpen) {
          draft.caseV2.stage = 'reviewing'
          // G05 任务回流：按退回来源阶段重建开放任务（同轮次续审补交材料）
          const originStageId = target.originStageId
          if (originStageId && !draft.tasks.some((task) => task.stageId === originStageId && task.status === 'open')) {
            const originTask = target.originTaskId ? draft.tasks.find((task) => task.id === target.originTaskId) : undefined
            draft.tasks = [...draft.tasks, { id: newWorkflowTaskId(), caseId: draft.caseV2.id, stageId: originStageId, round: originTask?.round ?? 1, assigneeRole: originTask?.assigneeRole ?? 'reviewer', status: 'open', prerequisiteTaskId: target.originTaskId, inputRevision: draft.caseV2.revision, createdAt: new Date().toISOString() }]
          }
        }
      },
      entity: payload.outcome === 'satisfied' ? { ...target, status: 'satisfied' } : { ...target, status: payload.outcome },
    }
  })
  if (result.ok
    && result.aggregate.caseV2.stage === 'reviewing'
    && result.aggregate.supplements.every((supplement) =>
      !['open', 'responded', 'insufficient'].includes(supplement.status))) {
    // Centralize the review-loop transition here. It must also apply when
    // a local review tool calls the service directly instead of the IPC route.
    const { requeueCaseAfterSupplement } = require('./batch-store') as typeof import('./batch-store')
    requeueCaseAfterSupplement(caseId)
  }
  return result
}

// ===== 申诉 resolution（06 §5.4） =====

export function resolveAppealV2(caseId: string, command: { requestId: string; actor: Actor; expectedRevision: number; payload: { appealId: string; resolution: Appeal['resolution'] & ('maintain-original' | 'amend-original' | 'withdrawn'); reason: string; amendedResult?: BusinessDecision['result'] } }): Promise<ReviewCommandResult<Appeal>> {
  return submitCommand<{ appealId: string; resolution: string; reason: string; amendedResult?: BusinessDecision['result'] }, Appeal>(caseId, { ...command, type: 'ResolveAppeal' } as never, (aggregate, payload) => {
    if (aggregate.d2RuntimePlan) throw new CommandValidationError('AGENT_DECISION_DISABLED', 'D2 技术预审不支持冒充正式申诉改判')
    const appeal = aggregate.appeals.find((candidate) => candidate.id === payload.appealId)
    if (!appeal) throw new CommandValidationError('NOT_FOUND', `申诉不存在: ${payload.appealId}`)
    if (command.actor.role !== 'teacher') {
      throw new CommandValidationError('INVALID_TRANSITION', '申诉更正必须由经过授权的复核教师完成')
    }
    if (appeal.status === 'upheld' || appeal.status === 'overturned' || appeal.status === 'withdrawn') throw new CommandValidationError('INVALID_TRANSITION', '申诉已关闭')
    if (!payload.reason.trim()) throw new CommandValidationError('VALIDATION_FAILED', '复核必须附结论理由')
    let amended: BusinessDecision | undefined
    return {
      summary: `申诉复核：${payload.resolution}`,
      mutate: (draft) => {
        const appealIndex = draft.appeals.findIndex((candidate) => candidate.id === payload.appealId)
        const original = draft.appeals[appealIndex]!
        draft.appeals[appealIndex] = { ...original, resolution: payload.resolution as Appeal['resolution'], status: payload.resolution === 'withdrawn' ? 'withdrawn' : 'in-review', reviewDecisionId: payload.resolution === 'amend-original' ? `dec-${Date.now()}` : original.reviewDecisionId }
        if (payload.resolution === 'amend-original') {
          // 更正 = 追加关联决定（不改写原判，07 §7.1）
          const originalDecision = draft.decisions.find((decision) => decision.id === original.againstDecisionId)
          if (!originalDecision) throw new CommandValidationError('NOT_FOUND', '原决定不存在')
          amended = { ...originalDecision, id: draft.appeals[appealIndex]!.reviewDecisionId!, actor: command.actor, amendsDecisionId: originalDecision.id, result: payload.amendedResult ?? 'pass', reason: `申诉更正：${payload.reason}`, at: new Date().toISOString(), finality: 'final' }
          draft.decisions = [...draft.decisions, amended!]
        }
        if (payload.resolution === 'withdrawn') {
          draft.appeals[appealIndex] = { ...draft.appeals[appealIndex]!, status: 'withdrawn' }
        }
        // 复查 §5.3-5：resolution 明确后申诉闭环——维持/更正/撤回都终结申诉状态并闭锁案卷阶段
        if (payload.resolution === 'maintain-original') {
          draft.appeals[appealIndex] = { ...draft.appeals[appealIndex]!, status: 'upheld' }
        }
        if (payload.resolution === 'amend-original') {
          draft.appeals[appealIndex] = { ...draft.appeals[appealIndex]!, status: 'overturned' }
        }
        if (payload.resolution !== 'withdrawn') {
          // 维持/更正 = 复核结论已定：关闭开放任务并进入 decided（无其他开放任务时）
          const hasOpen = draft.tasks.some((task) => task.status === 'open' && task.id !== draft.tasks.find((candidate) => candidate.stageId === 'final' && candidate.status === 'open')?.id)
          draft.tasks = draft.tasks.map((task) => (task.status === 'open' ? { ...task, status: 'completed' as const, completedAt: new Date().toISOString() } : task))
          void hasOpen
          draft.caseV2.stage = 'decided'
        }
      },
      entity: aggregate.appeals.find((candidate) => candidate.id === payload.appealId),
    }
  })
}

// ===== 最终决定投影（07 §7.1：不取时间最后一条） =====

/**
 * 最终决定：优先 finality='final' 的最新一条；否则最新 stage 决定（标注未终审）。
 * 被更正（amendsDecisionId 指向）的决定不再是有效结论。
 */
export function resolveFinalDecisionProjection(decisions: BusinessDecision[]): { decision: BusinessDecision | null; isFinal: boolean; supersededIds: string[] } {
  const supersededIds = decisions.filter((decision) => decision.amendsDecisionId).map((decision) => decision.amendsDecisionId!)
  const effective = decisions.filter((decision) => !supersededIds.includes(decision.id))
  const final = [...effective].filter((decision) => decision.finality === 'final').sort((a, b) => a.at.localeCompare(b.at)).at(-1)
  if (final) return { decision: final, isFinal: true, supersededIds }
  const latestStage = [...effective].sort((a, b) => a.at.localeCompare(b.at)).at(-1) ?? null
  return { decision: latestStage, isFinal: false, supersededIds }
}

// ===== 提交案卷（G01：draft → submitted + 首阶段任务） =====

export async function submitCaseV2(caseId: string, actor?: Actor, source?: CommandSourceMeta): Promise<ReviewCommandResult<WorkflowTask>> {
  const { getTemplate } = await import('./template-store')
  const aggregate = (await import('./case-store-v2')).readAggregate(caseId)
  if (!aggregate) throw new CommandValidationError('NOT_FOUND', `案卷聚合不存在: ${caseId}`)
  // 重试已成功的提交，返回原回执；不重复生成任务或增加 revision。
  if (aggregate.caseV2.stage === 'submitted' && aggregate.tasks.length > 0) {
    const receipt = aggregate.receiptLog.findLast(entry => entry.type === 'SubmitCase')
    if (receipt) return { ok: true, receipt, aggregate, entity: aggregate.tasks[0] }
  }
  const recovering = aggregate.caseV2.stage === 'submitted' && aggregate.tasks.length === 0
  if (aggregate.caseV2.stage !== 'draft' && !recovering) throw new CommandValidationError('INVALID_TRANSITION', `当前阶段 ${aggregate.caseV2.stage} 不可提交`)
  const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
  if (!template) throw new CommandValidationError('DEPENDENCY_UNRESOLVED', '模板不存在或已删除')
  if (aggregate.caseV2.documents.length === 0) throw new CommandValidationError('VALIDATION_FAILED', '尚未登记任何材料，不能提交')
  // RUN-38：批量入库允许先建案后补录，但“材料已入库”不等于“可提交审核”。
  // 必填案卷字段/必需分项/事项必填字段与建案校验共用同一模板定义，缺一项都明确阻断。
  const { collectMissingIntakeInputs } = await import('./application-service')
  const missingIntake = collectMissingIntakeInputs(template, aggregate.caseV2)
  if (missingIntake.length > 0) {
    throw new CommandValidationError('VALIDATION_FAILED',
      `案卷尚未补齐必填输入：${missingIntake.join('；')}。请在案卷页补全后再提交审核`)
  }
  // 必需材料槽门控（复查 §5.9：不能只判非空——按模板 minCount 逐槽核对 active 材料）
  const { collectMissingSubmissionSlots } = await import('./application-service')
  const missingSlots = collectMissingSubmissionSlots(template, aggregate.caseV2.documents)
  if (missingSlots.length > 0) throw new CommandValidationError('VALIDATION_FAILED', `缺少必需材料：${missingSlots.join('；')}`)
  const firstStage = template.stages[0]
  if (!firstStage) throw new CommandValidationError('VALIDATION_FAILED', '模板没有审核阶段')
  // 状态和首任务在同一个聚合事务内保存，避免两次写入间出现已提交却无任务。
  return submitCommand<Record<string, never>, WorkflowTask>(caseId, {
    requestId: `submit-${caseId}-${aggregate.caseV2.revision}`,
    actor: actor ?? { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
    expectedRevision: aggregate.caseV2.revision,
    type: 'SubmitCase',
    payload: {},
  }, current => ({
    summary: recovering ? '恢复已提交案卷的首阶段任务' : '案卷已提交进入审核',
    mutate: (draft) => {
      const task: WorkflowTask = {
        id: `task-submit-${caseId}-${current.caseV2.revision}`,
        caseId,
        stageId: firstStage.id,
        round: 1,
        assigneeRole: firstStage.executorRole,
        status: 'open',
        inputRevision: current.caseV2.revision,
        createdAt: new Date().toISOString(),
      }
      draft.caseV2.stage = 'submitted'
      draft.tasks = [...draft.tasks, task]
      return task
    },
  }), source)
}
