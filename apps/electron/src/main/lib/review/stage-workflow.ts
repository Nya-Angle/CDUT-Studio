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

import type { Appeal, BusinessDecision, CaseAggregateV2, ReviewCommandResult, ReviewRunV2, SupplementRequest, TemplateVersion, WorkflowTask } from '@profer/shared'
import { reviewV3SlotAcceptsFile } from '@profer/shared'
import { randomUUID } from 'node:crypto'
import { CommandValidationError, submitCommand, type CommandSourceMeta } from './case-store-v2'
import { assertLegacyDecisionWritable } from './review-v3-legacy-decision-gate'
import { reviewV3MaterialIssuesForPhase, reviewV3SubmissionMaterialIssues } from './review-v3-submission-material-gate'
import type { Actor } from '@profer/shared'
import { assessMaterialSlotV2 } from '@profer/shared'

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

/** Native V3 stage decisions must reference an actual, current terminal Pi Run.
 * Legacy non-native cases retain their old migration behavior, but cannot be
 * used to promote a fabricated run@rev into an actual native V3 decision.
 */
function nativeStageDecisionRunId(aggregate: CaseAggregateV2): string | undefined {
  const { isNativeWorkspaceCaseV3 } = require('./native-workspace-case-v3') as typeof import('./native-workspace-case-v3')
  if (!isNativeWorkspaceCaseV3(aggregate)) return undefined
  const { listRunsV2 } = require('./run-store-v2') as typeof import('./run-store-v2')
  const { isWorkspaceRunStaleV2 } = require('./workspace-business-service-v2') as typeof import('./workspace-business-service-v2')
  const runs = listRunsV2(aggregate.caseV2.id)
  if (runs.some(run => run.status === 'queued' || run.status === 'running')) {
    throw new CommandValidationError('INVALID_TRANSITION', '当前审核仍在运行，请等待完成后再作出阶段决定')
  }
  const latest = runs.find(run =>
    run.id.startsWith('run-pi-') &&
    run.caseId === aggregate.caseV2.id &&
    run.templateId === aggregate.caseV2.templateId &&
    run.templateVersion === aggregate.caseV2.templateVersion &&
    (run.status === 'completed' || run.status === 'partially-completed') &&
    !isWorkspaceRunStaleV2(aggregate, run.id))
  if (!latest) {
    throw new CommandValidationError('STALE_INPUT', '当前案卷没有与现有材料匹配的真实已完成初审 Run；请先运行或更新审核')
  }
  return latest.id
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
    // Native V3 must go through T05, which verifies the real Run, input hash,
    // coverage and trusted stage authority. The legacy N3 writer below records
    // a synthetic run@rev reference; it may not decide a native V3 case.
    // assertLegacyDecisionWritable 同时覆盖 D2 技术预审、CanonicalPlan 与原生回执，
    // 本地单独补的 d2RuntimePlan 判断已被该统一栅栏覆盖。
    assertLegacyDecisionWritable(aggregate)
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
    // Resolve the Run inside the serialized Case transaction, before any
    // completeness or template-decision gates inspect it.
    const nativeRunId = nativeStageDecisionRunId(aggregate)
    // A completed-but-incomplete review may open a supplement request or
    // record a partial/manual response; it must not silently become an approval.
    // This gate concerns coverage/unknowns, not the human's discretion over
    // an evidenced non-compliant result.
    if(nativeRunId!==undefined&&
      ['stage-pass','item-pass'].includes(payload.action)){
      const {getRunV2}=require('./run-store-v2') as typeof import('./run-store-v2')
      const run=getRunV2(aggregate.caseV2.id,nativeRunId)
      const unresolved=run?.checks.filter(check=>
        ['awaiting-supplement','awaiting-confirmation','not-executed','execution-failed'].includes(check.status))??[]
      if(!run||run.coverage.pendingChecks>0||unresolved.length>0)
        throw new CommandValidationError('INVALID_TRANSITION',
          '本轮初审仍有未完成/待补/待确认检查；请先补件或由有权人员记录明确的部分决定，不得直接整案通过')
    }
    // Only approval-like decisions require the template's decision-stage
    // material slots. Returning for supplement must remain possible.
    if(nativeRunId!==undefined&&
      ['stage-pass','item-pass','item-partial-pass'].includes(payload.action)){
      const issues=reviewV3MaterialIssuesForPhase(aggregate,template,'decision')
      if(issues.length)throw new CommandValidationError('VALIDATION_FAILED',
        '当前模板终审材料未满足：'+issues.map(issue=>issue.message).join('；'))
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
          basedOnRunId: nativeRunId ?? `run@rev${aggregate.caseV2.revision}`,
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
            // 冻结请求时已存在的材料版本：旧版本不得冒充本次补件新增材料，且
            // satisfied/insufficient 必须先有提交方回复。历史无快照记录保持兼容，
            // 不反推伪数据（可选字段缺省时跳过上述两道限制）。
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

/** Group template-slot supplement findings from one completed initial-review Run.
 * Only explicit required-material-* checks become slot requests; other findings stay
 * in the review queue and are not silently converted into document requests.
 */
export interface InitialReviewSupplementSpec {
  slotId:string
  slotName:string
  checkIds:string[]
  requiredElements:string[]
  reason:string
}

export function buildInitialReviewSupplementSpecs(
  run:ReviewRunV2,template:TemplateVersion,
):InitialReviewSupplementSpec[] {
  const grouped=new Map<string,ReviewRunV2['checks']>()
  for(const check of run.checks){
    if(check.status!=='awaiting-supplement'||!check.ruleId.startsWith('required-material-'))continue
    const slotId=check.ruleId.slice('required-material-'.length)
    if(!slotId)throw new CommandValidationError('DEPENDENCY_UNRESOLVED','待补件检查没有材料槽位 ID')
    const current=grouped.get(slotId)??[]
    current.push(check)
    grouped.set(slotId,current)
  }
  const specs:InitialReviewSupplementSpec[]=[]
  for(const [slotId,checks] of grouped){
    const slot=template.materialSlots.find(item=>item.id===slotId)
    if(!slot||slot.minCount<1)
      throw new CommandValidationError('DEPENDENCY_UNRESOLVED','待补件检查引用了不存在或非必需的模板槽位：'+slotId)
    const details=[...new Set(checks.map(check=>check.reason.trim()).filter(Boolean))]
    specs.push({
      slotId,slotName:slot.name,
      checkIds:[...new Set(checks.map(check=>check.checkId))],
      requiredElements:[slot.name+'：至少补齐 '+slot.minCount+' 份有效材料'],
      reason:('初审 Run '+run.id+' 检出材料槽位待补件：'+slot.name+
        (details.length?'；'+details.join('；'):'')).slice(0,1200),
    })
  }
  return specs
}

/** Persist initial-review missing-material requests without changing the formal
 * workflow stage. A user can respond and a reviewer can verify through F12;
 * this remains separate from a formal return-for-supplement decision.
 */
export function openInitialReviewSupplementV3(
  caseId:string,
  command:{requestId:string;actor:Actor;expectedRevision:number;payload:{runId:string}},
  authorizeAtCommit?:()=>void,
):Promise<ReviewCommandResult<SupplementRequest[]>> {
  return submitCommand(caseId,{...command,type:'OpenInitialReviewSupplementV3'},(aggregate,payload)=>{
    authorizeAtCommit?.()
    if(command.actor.actorSource!=='local'||command.actor.role!=='reviewer')
      throw new CommandValidationError('INVALID_TRANSITION','只有本地审核员可为初审缺件创建补件请求')
    const {isNativeWorkspaceCaseV3}=require('./native-workspace-case-v3') as typeof import('./native-workspace-case-v3')
    if(!isNativeWorkspaceCaseV3(aggregate))
      throw new CommandValidationError('INVALID_TRANSITION','初审补件请求只适用于原生 V3 案卷')
    const currentRunId=nativeStageDecisionRunId(aggregate)
    if(currentRunId!==payload.runId)
      throw new CommandValidationError('STALE_INPUT','初审 Run 已过期或不是本案最新有效运行，请刷新后重新审核')
    const {getRunV2}=require('./run-store-v2') as typeof import('./run-store-v2')
    const run=getRunV2(caseId,payload.runId) as ReviewRunV2|undefined
    if(!run||run.caseId!==caseId||run.templateId!==aggregate.caseV2.templateId||
      run.templateVersion!==aggregate.caseV2.templateVersion||
      !['completed','partially-completed'].includes(run.status))
      throw new CommandValidationError('STALE_INPUT','找不到与当前案卷/模板匹配的已完成初审 Run')
    const {getTemplate}=require('./template-store') as typeof import('./template-store')
    const template=getTemplate(aggregate.caseV2.templateId,aggregate.caseV2.templateVersion) as TemplateVersion|undefined
    if(!template||template.status!=='published')
      throw new CommandValidationError('DEPENDENCY_UNRESOLVED','当前案卷没有可用的已发布模板')
    const specs=buildInitialReviewSupplementSpecs(run,template)
    if(!specs.length)
      throw new CommandValidationError('VALIDATION_FAILED','本轮没有可转成持久补件请求的模板材料槽位待补件项')
    return {
      summary:'为初审 Run '+run.id+' 创建/复用 '+specs.length+' 条材料补件请求',
      mutate:(draft)=>{
        authorizeAtCommit?.()
        const now=new Date().toISOString()
        const activeVersions=draft.caseV2.documents.filter(document=>document.active!==false)
          .map(document=>document.versionId)
        const results:SupplementRequest[]=[]
        for(const spec of specs){
          const existing=draft.supplements.find(request=>
            request.originRunId===run.id&&request.materialSlotId===spec.slotId&&
            ['open','responded','insufficient'].includes(request.status))
          if(existing){results.push(existing);continue}
          const request:SupplementRequest={
            id:'sup-'+randomUUID(),caseId,
            originFindingKeys:spec.checkIds,materialSlotId:spec.slotId,
            requiredElements:spec.requiredElements,reason:spec.reason,
            responsibleRole:'student',status:'open',responses:[],createdAt:now,
            documentVersionIdsAtRequest:activeVersions,originRunId:run.id,
          }
          draft.supplements=[...draft.supplements,request]
          results.push(request)
        }
        return results
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
    const suppliedIds = payload.documentVersionIds ?? []
    if (!Array.isArray(suppliedIds) || suppliedIds.some((id) => typeof id !== 'string' || !id)
      || new Set(suppliedIds).size !== suppliedIds.length) {
      throw new CommandValidationError('VALIDATION_FAILED', '补件材料版本列表无效或重复')
    }
    const activeDocuments = aggregate.caseV2.documents.filter((document) => document.active !== false)
    for (const versionId of suppliedIds) {
      const document = activeDocuments.find((item) => item.versionId === versionId)
      if (!document) throw new CommandValidationError('STALE_INPUT', `补件材料不存在、已归档或不属于当前案卷：${versionId}`)
      if (target.documentVersionIdsAtRequest?.includes(versionId)) {
        throw new CommandValidationError('STALE_INPUT', `补件必须引用请求创建后新增的材料版本：${versionId}`)
      }
      if (target.materialSlotId && document.materialSlotId !== target.materialSlotId) {
        throw new CommandValidationError('VALIDATION_FAILED', `补件材料尚未绑定指定材料槽：${target.materialSlotId}`)
      }
      if (target.originRunId) {
        if (!target.documentVersionIdsAtRequest) {
          throw new CommandValidationError('STALE_INPUT', '初审补件缺少创建时的原件版本快照')
        }
        const { getTemplate } = require('./template-store') as typeof import('./template-store')
        const slot = target.materialSlotId
          ? getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)?.materialSlots.find((item) => item.id === target.materialSlotId)
          : undefined
        if (target.materialSlotId && !slot) {
          throw new CommandValidationError('STALE_INPUT', '补件所对应的模板槽位已变化')
        }
        if (slot && (!reviewV3SlotAcceptsFile(slot, document.fileName) || document.parseStatus === 'failed')) {
          throw new CommandValidationError('VALIDATION_FAILED', '回件材料格式不符或解析失败，不能作为有效补件')
        }
      }
    }
    if (!payload.note.trim() && suppliedIds.length === 0) throw new CommandValidationError('VALIDATION_FAILED', '回复必须附说明或材料')
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
    // T05/Main-snapshotted supplement requests must be explicitly replied to
    // before a reviewer can record satisfied or insufficient. A request existing
    // on disk is never evidence that a user actually supplied a response.
    if (target.originStageId && target.documentVersionIdsAtRequest &&
      (payload.outcome === 'satisfied' || payload.outcome === 'insufficient') &&
      target.status !== 'responded') {
      throw new CommandValidationError('INVALID_TRANSITION', '可信阶段补件必须先由提交方回复，再由审核员判定满足或不足')
    }
    if (payload.outcome === 'cancelled' && !payload.reason.trim()) throw new CommandValidationError('VALIDATION_FAILED', '取消补件必须说明理由')
    if (target.originRunId && payload.outcome === 'satisfied') {
      if(target.status!=='responded')
        throw new CommandValidationError('INVALID_TRANSITION','初审补件必须先提交回复，再由审核员核验')
      if(target.materialSlotId){
        if(!target.documentVersionIdsAtRequest)
          throw new CommandValidationError('STALE_INPUT','该补件请求缺少原始材料快照，不能自动核验')
        const {getRunV2}=require('./run-store-v2') as typeof import('./run-store-v2')
        const originRun=getRunV2(caseId,target.originRunId) as ReviewRunV2|undefined
        if(!originRun||originRun.caseId!==caseId||
          originRun.templateId!==aggregate.caseV2.templateId||
          originRun.templateVersion!==aggregate.caseV2.templateVersion)
          throw new CommandValidationError('STALE_INPUT','补件来源 Run 与当前案卷模板不一致')
        const {getTemplate}=require('./template-store') as typeof import('./template-store')
        const template=getTemplate(aggregate.caseV2.templateId,aggregate.caseV2.templateVersion) as TemplateVersion|undefined
        const slot=template?.materialSlots.find(item=>item.id===target.materialSlotId)
        if(!slot)throw new CommandValidationError('STALE_INPUT','补件对应的材料槽位已不存在')
        const baseline=new Set(target.documentVersionIdsAtRequest)
        const repliedIds=new Set(target.responses.flatMap(response=>response.documentVersionIds))
        const activeSlotDocs=aggregate.caseV2.documents.filter(document=>
          document.active!==false&&document.materialSlotId===slot.id&&
          reviewV3SlotAcceptsFile(slot,document.fileName)&&document.parseStatus!=='failed')
        const hasNewRepliedDocument=activeSlotDocs.some(document=>
          !baseline.has(document.versionId)&&repliedIds.has(document.versionId))
        if(activeSlotDocs.length<slot.minCount||!hasNewRepliedDocument)
          throw new CommandValidationError('VALIDATION_FAILED',
            '当前有效材料尚未满足槽位「'+slot.name+'」的数量/回件关联要求，不能核验满足')
      }
    }
    if (payload.outcome === 'satisfied' && target.materialSlotId) {
      // Material-slot supplements are evidence claims, not merely comments.
      // The reviewer cannot close a still-missing slot as "satisfied"; cancellation
      // remains an explicit, reasoned waiver, and final-decision gates stay active.
      if (target.status !== 'responded') {
        throw new CommandValidationError('INVALID_TRANSITION', '材料槽补件必须先由提交方回复，不能直接核结为已满足')
      }
      const { getTemplate } = require('./template-store') as typeof import('./template-store')
      const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
      const slot = template?.materialSlots.find((candidate) => candidate.id === target.materialSlotId)
      if (!slot) {
        throw new CommandValidationError('STALE_INPUT', '当前模板已经不存在该补件材料槽，不能核结为已满足')
      }
      const assessment = assessMaterialSlotV2(aggregate, slot)
      if (assessment.status !== 'compliant') {
        throw new CommandValidationError('DEPENDENCY_UNRESOLVED',
          `材料槽补件仍未满足：${assessment.reason}；请补充或正确归类材料，再由审核员核结。`)
      }
    }
    return {
      summary: `补件判定：${payload.outcome}`,
      mutate: (draft) => {
        draft.supplements = draft.supplements.map((request) => (request.id === payload.supplementId ? { ...request, status: payload.outcome } : request))
        // 多请求门控：所有未满足请求结束才恢复（open/responded/insufficient 都阻断；cancelled=明确豁免）
        const stillOpen = draft.supplements.some((request) => request.status === 'open' || request.status === 'responded' || request.status === 'insufficient')
        // PR272 合同：最后一笔为 cancelled 且已无未结补件时恢复阶段；
        // 本地 RUN-18 的“A=satisfied、B=cancelled 卡死”场景已由 cancelled 分支覆盖。
        // insufficient 仍是未满足，不自动恢复（保留 PR272 的明确判定语义）。
        if ((payload.outcome === 'satisfied' || payload.outcome === 'cancelled') && !stillOpen && !target.originRunId) {
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
  const resolvedSupplement=result.ok
    ?result.aggregate.supplements.find(supplement=>supplement.id===command.payload.supplementId)
    :undefined
  if (result.ok && !resolvedSupplement?.originRunId &&
    (command.payload.outcome === 'satisfied' || command.payload.outcome === 'cancelled')
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
    // PR272 原生回执/CanonicalPlan/D2 统一栅栏，不允许旧 V2 申诉入口改写结论。
    assertLegacyDecisionWritable(aggregate)
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

/**
 * 提交阶段的材料门控（PR272）：只阻断模板显式 initialReviewPolicy='block'
 * 的缺件/适用性未知，以及任何槽位的 too-many。defer 普通缺件只记录待补，
 * 允许初审继续；终审/正式决定再由 reviewV3MaterialIssuesForPhase(...,'decision')
 * 复核全部必要材料。历史案卷同样按此模板政策处理，不再用未区分的全量 minCount 阻断。
 */
function submissionMaterialErrorsForCase(
  aggregate:CaseAggregateV2,template:TemplateVersion,
):string[]{
  // Only a template's explicit `block` policy can make missing evidence an
  // initial-review blocker. Ordinary/uncertain slots stay visible in the Run,
  // but do not prevent preliminary analysis or invent global material counts.
  return reviewV3SubmissionMaterialIssues(aggregate,template)
    .filter(issue=>issue.kind==='too-many'||
      template.materialSlots.some(slot=>slot.id===issue.slotId&&slot.initialReviewPolicy==='block'))
    .map(issue=>issue.kind==='missing'?'初审前必须具备关键材料：'+issue.message:
      issue.kind==='too-many'?'材料数量超过模板上限：'+issue.message:
        '初审前关键材料适用条件尚未确认：'+issue.message)
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
  if (!aggregate.caseV2.documents.some(document=>document.active!==false))
    throw new CommandValidationError('VALIDATION_FAILED','尚未登记任何当前有效材料，不能正式提交')
  // RUN-38（本地保留）：正式提交前补齐模板必填案卷字段/必需分项/事项字段。
  // 这里只校验输入完整性；材料是否齐备由下面 PR272 的模板 block 政策判断，
  // 不再用本地旧的 collectMissingSubmissionSlots 全量齐备门槛误挡“缺件先初审”。
  const { collectMissingIntakeInputs } = await import('./application-service')
  const missingIntake = collectMissingIntakeInputs(template, aggregate.caseV2)
  if (missingIntake.length > 0) {
    throw new CommandValidationError('VALIDATION_FAILED',
      `案卷尚未补齐必填输入：${missingIntake.join('；')}。请在案卷页补全后再提交审核`)
  }
  // Legacy imported cases preserve the historical application-document gate;
  // native V3 lets the selected template decide whether an application exists.
  const {isNativeWorkspaceCaseV3}=await import('./native-workspace-case-v3')
  if(!aggregate.d2RuntimePlan&&!isNativeWorkspaceCaseV3(aggregate)&&
      !aggregate.caseV2.documents.some(document=>document.active!==false&&document.role==='application'))
    throw new CommandValidationError('VALIDATION_FAILED','缺少明确的申报材料：请先按当前模板分类真实原件')
  const {resolveEffectiveRules}=await import('./effective-rules')
  const {templateRuleSpecializedRuleIds}=await import('./review-v3-main-template-run')
  const effectiveRules=resolveEffectiveRules(aggregate,template)
  if(!aggregate.d2RuntimePlan&&effectiveRules.length===0&&templateRuleSpecializedRuleIds(template).length===0)
    throw new CommandValidationError('DEPENDENCY_UNRESOLVED','当前模板和审核依据没有有效检查项，不能让 Pi 猜测审核标准')
  if(!aggregate.d2RuntimePlan&&effectiveRules.some(item=>item.rule.targetScope==='subject')&&
      !aggregate.caseV2.subjects.some(subject=>subject.status!=='ignored'&&subject.title.trim()))
    throw new CommandValidationError('DEPENDENCY_UNRESOLVED','当前模板要求逐事项审核，请先登记可识别的申报事项')
  // PR272：普通缺件不阻断正式提交（记录缺件并允许进入初审），只有模板显式
  // initialReviewPolicy='block' 的关键槽位、超出槽位上限或适用条件未知才阻断。
  const issues=submissionMaterialErrorsForCase(aggregate,template)
  if(issues.length)throw new CommandValidationError('VALIDATION_FAILED',issues.join('；'))
  const firstStage = template.stages[0]
  if (!firstStage) throw new CommandValidationError('VALIDATION_FAILED', '模板没有审核阶段')
  // 状态和首任务在同一个聚合事务内保存，避免两次写入间出现已提交却无任务。
  return submitCommand<Record<string, never>, WorkflowTask>(caseId, {
    requestId: `submit-${caseId}-${aggregate.caseV2.revision}`,
    actor: actor ?? { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
    expectedRevision: aggregate.caseV2.revision,
    type: 'SubmitCase',
    payload: {},
  }, current => {
    // Recheck against Main's transaction snapshot rather than only the earlier
    // renderer-visible revision, to avoid submitting a changed materials set.
    if(current.caseV2.templateId!==template.templateId||
        current.caseV2.templateVersion!==template.version)
      throw new CommandValidationError('STALE_INPUT','正式提交时模板版本已变化，请刷新后重新确认')
    const latestIssues=submissionMaterialErrorsForCase(current,template)
    if(latestIssues.length)throw new CommandValidationError('VALIDATION_FAILED',latestIssues.join('；'))
    const missingSlots=reviewV3SubmissionMaterialIssues(current,template)
      .filter(issue=>issue.kind==='missing'||issue.kind==='applicability-unknown')
      .map(issue=>issue.message)
    return {
    summary: recovering
      ? '恢复已提交案卷的首阶段任务'
      : missingSlots.length
        ? `案卷已提交进入初审；本轮可继续，待补材料/待确认项：${missingSlots.join('；')}`
        : '案卷已提交进入审核',
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
    }
  }, source)
}
