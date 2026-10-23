/**
 * T05 可信阶段事务（Local-L04 桥接层，CR-T05-04 + ARCH-CLOSURE-R01 D2/D3）。
 *
 * 边界：
 * - **只读投影** `readT05StageCapability`：Main 从真实任务指派、可信业务模式与
 *   有效 Run 推导能力，渲染层只展示，不构成授权。
 * - **写入** `recordT05StageDecision`：Main 重核身份/角色/模板版本/expectedRevision/
 *   真实任务/当前 Run/动作适格性，再调用 T05 的纯领域函数
 *   `planT05LocalStageAction` + `applyT05LocalStageProposal` 生成追加式状态，
 *   最后由 `submitCommand` 在**唯一 CaseAggregate 事务**中原子写入。
 *
 * 不做的事：
 * - 不自造 `run@rev` 伪 Run ID；
 * - 不接受渲染层声称的 actor.role / runId / isRunCurrent / businessMode；
 * - 不把「Run 已完成」当成「业务检查全部通过」；
 * - 不把业务 `non-compliant` 当成 `execution-failed`；
 * - 不冒充学校审批：D2/B1 技术预审永远不能形成正式业务决定。
 */
import type { Actor, CaseAggregateV2, ReviewRunV2, TemplateVersion } from '@profer/shared'
import { CommandValidationError, readAggregate, submitCommand } from './case-store-v2'
import { getTemplate } from './template-store'
import { listRunsV2 } from './run-store-v2'
import { isWorkspaceRunStaleV2 } from './workspace-business-service-v2'
import {
  assessStagePassWithT03, isCurrentBusinessRun, resolveCurrentBusinessRun,
  type RunAuthorityDecision,
} from './review-runtime-contract'
import {
  applyT05LocalStageProposal, planT05LocalStageAction,
  type T05LocalStageAction, type T05StageProposal, type T05VerifiedRun,
} from './review-v3-t05-local-stage-plan'

/** 本地可信身份：本机只有审核员与本地模拟教师两个具名角色。 */
export type T05LocalRole = 'reviewer' | 'teacher'

/**
 * 本地模拟角色。
 *
 * **不是学校身份认证**：`local-teacher` 只代表「本机以教师阶段权限试办」，
 * 不产生任何校方授权效力；正式学校审批必须由真实 school principal 派生。
 */
const LOCAL_ACTORS: Record<T05LocalRole, Actor> = {
  reviewer: { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' },
  teacher: { actorId: 'local-teacher', actorSource: 'local', role: 'teacher' },
}

/** Main 侧会话声明：渲染层只能请求角色，不能自带 actor。 */
export interface T05RoleClaim { role?: string }

/** 派生可信 actor。非法角色降级为本地审核员，绝不按自称提权。 */
export function deriveT05LocalActor(claim: T05RoleClaim | undefined): Actor {
  if (claim?.role === 'teacher') return LOCAL_ACTORS.teacher
  return LOCAL_ACTORS.reviewer
}

// ===== D2：可信业务模式解析 =====

/** 审核用途：技术预审只能执行检查，不能形成正式业务决定。 */
export type T05BusinessMode = 'local-business' | 'technical-pre-review'

/**
 * Main 侧「本地业务发布确认」记录。
 *
 * 计划（CanonicalPlan）本身只是执行合同，不是审批许可证（R01 §3）。
 * 本地业务资格必须来自 Main 可复核的来源：已发布模板 + 明确确认记录，
 * 绝不能因为「案卷里有 canonicalPlan」就自动获得。
 */
export interface T05LocalBusinessConfirmation {
  caseId: string
  planFingerprint: string
  templateId: string
  templateVersion: number
  /** 确认来源：本地业务发布（本机审核员），或学校授权（本机无此能力） */
  confirmedBy: 'local-organizer' | 'school-authorized'
  confirmedAt: string
  reason: string
}

/** 进程内确认登记（Phase 2 由 Plan 安装事务写入；重启后按需重建）。 */
const localBusinessConfirmations = new Map<string, T05LocalBusinessConfirmation>()

/** 登记一次本地业务发布确认（只应由 Main 的 Plan 安装事务调用）。 */
export function registerT05LocalBusinessConfirmation(record: T05LocalBusinessConfirmation): void {
  if (record.confirmedBy !== 'local-organizer') {
    throw new CommandValidationError('INVALID_TRANSITION', '学校授权模式不在本地能力范围内')
  }
  if (!record.planFingerprint) {
    throw new CommandValidationError('VALIDATION_FAILED', '确认记录缺少计划指纹')
  }
  localBusinessConfirmations.set(record.caseId, record)
}

/** 读取某案卷已登记的本地业务确认。 */
export function readT05LocalBusinessConfirmation(caseId: string): T05LocalBusinessConfirmation | undefined {
  return localBusinessConfirmations.get(caseId)
}

/** 测试用：清除登记。生产代码不应调用。 */
export function clearT05LocalBusinessConfirmations(): void {
  localBusinessConfirmations.clear()
}

/**
 * 解析可信业务模式（R01 D2）。
 *
 * 判定顺序（全部 fail closed）：
 * 1. 有 `d2RuntimePlan` → 技术预审（无论模式字段怎么写，都不具备业务决定权）；
 * 2. 有 `canonicalPlan` → 只有存在 Main 侧本地业务确认且指纹/模板版本相符才是
 *    local-business，否则按技术预审处理（覆盖 A15 S2 之前的历史/候选计划）；
 * 3. 无任何计划 → 模板绑定的本地业务案卷，local-business（A15 S1 现状）。
 */
export function resolveT05BusinessMode(aggregate: CaseAggregateV2): {
  mode: T05BusinessMode
  reason: string
} {
  if (aggregate.d2RuntimePlan) {
    return { mode: 'technical-pre-review', reason: 'D2 技术预审案卷不具备正式业务决定权' }
  }
  if (aggregate.canonicalPlan) {
    const confirmation = localBusinessConfirmations.get(aggregate.caseV2.id)
    if (!confirmation) {
      return { mode: 'technical-pre-review', reason: '计划尚未经 Main 确认本地业务发布' }
    }
    if (confirmation.planFingerprint !== aggregate.canonicalPlan.fingerprint) {
      return { mode: 'technical-pre-review', reason: '计划指纹与本地业务确认不一致' }
    }
    if (confirmation.templateId !== aggregate.caseV2.templateId
      || confirmation.templateVersion !== aggregate.caseV2.templateVersion) {
      return { mode: 'technical-pre-review', reason: '业务确认与案卷模板版本不一致' }
    }
    return { mode: 'local-business', reason: '已发布模板 + Main 本地业务确认' }
  }
  return { mode: 'local-business', reason: '模板绑定的本地业务案卷' }
}

/** 兼容旧调用点：是否可办理本地业务阶段。 */
export function isLocalBusinessCase(aggregate: CaseAggregateV2): boolean {
  return resolveT05BusinessMode(aggregate).mode === 'local-business'
}

// ===== D3：Run 有效性 =====

/**
 * 取当前有效 Run（R01 D3 §4.1）。
 *
 * 复用既有权威判定 `isWorkspaceRunStaleV2`（按 `inputManifest.hash`、
 * `documentVersions` 顺序回退、以及补件回复后失效来计算），不再自造
 * 「当前 Run」的竞争判断。此前这里误读 `inputManifest.documents`
 * （真实字段是 `documentVersions`），导致选择结果不可信。
 */
export function currentT05Run(aggregate: CaseAggregateV2): ReviewRunV2 | undefined {
  return readT05RunAuthority(aggregate).run
}

/**
 * 当前业务 Run 的权威判定（RUN-02/04/07/09/14/22）。
 *
 * 只从**最新业务 attempt** 开始选择：最新一次失败/执行中/取消的 Run 会明确
 * 阻断，绝不回退到更早的成功 Run；`run-tpl-*`（模板阶段证据）与显式诊断
 * Run 不得冒充当前审核。判定逻辑集中在 review-runtime-contract，此处仅提供
 * Main 可信的 freshness 函数，不复制第二套账本。
 */
export function readT05RunAuthority(aggregate: CaseAggregateV2): RunAuthorityDecision {
  return resolveCurrentBusinessRun({
    aggregate,
    runs: listRunsV2(aggregate.caseV2.id),
    stale: (run) => isWorkspaceRunStaleV2(aggregate, run.id),
  })
}

/** 诊断运行隔离：模板规则/高级诊断结果只能作为证据展示。 */
export function isT05DiagnosticRun(run: Pick<ReviewRunV2, 'id'>): boolean {
  return !isCurrentBusinessRun(run)
}

/** Run 是否因原件/补件变化而失效（供界面如实展示）。 */
export function isT05RunStale(aggregate: CaseAggregateV2, runId: string): boolean {
  return isWorkspaceRunStaleV2(aggregate, runId)
}

// ===== D3：按动作适格判定 =====

export type T05StageAction = T05LocalStageAction

export interface T05ActionEligibility {
  /** 阶段通过是否具备业务条件（仅此项决定 stage-pass） */
  readiness: 'ready' | 'blocked'
  blockers: string[]
  /** 每个动作是否被允许 */
  allowed: Record<T05StageAction, boolean>
  /** 某动作被拒时的真实原因 */
  reasons: Record<T05StageAction, string[]>
  /** 非合规项（业务结论，不是执行失败） */
  nonCompliant: string[]
  /** 计划覆盖信息：真实 Check 与计划项的关系 */
  coverage: { planned: number | null; produced: number; missing: string[] }
}

const T05_RESOLVING_DISPOSITIONS = new Set([
  'human-confirmed-compliant', 'false-positive', 'waived', 'confirmed-issue',
])

/**
 * 按动作判定适格性（R01 D3 §4.2）。
 *
 * 分开回答：
 * - 能否 `stage-pass`：Run 有效、覆盖完整、无待确认/待补件/执行失败/未执行、
 *   **且没有未解释的非合规项**；
 * - 能否 `final-reject`：Run 真实有效即可（这是拒绝，不是通过）；
 * - 能否 `return-for-supplement`：无有效 Run 也可（缺件本就该补件）；
 * - 能否 `return-to-previous-stage`：Run 真实有效即可。
 *
 * `execution-failed`/`not-executed` 不算不合规，但也不许通过。
 */
export function t05ActionEligibility(
  aggregate: CaseAggregateV2, run: ReviewRunV2 | undefined,
): T05ActionEligibility {
  const blockers: string[] = []
  const nonCompliant: string[] = []
  const coverage: T05ActionEligibility['coverage'] = { planned: null, produced: 0, missing: [] }

  const unresolvedSupplements = (aggregate.supplements ?? []).filter((item) =>
    item.status === 'open' || item.status === 'responded' || item.status === 'insufficient')

  if (!run) {
    const noRun = ['没有与当前原件一致的有效审核运行']
    return {
      readiness: 'blocked',
      blockers: noRun,
      allowed: {
        'stage-pass': false, 'final-reject': false,
        'return-for-supplement': true, 'return-to-previous-stage': false,
      },
      reasons: {
        'stage-pass': noRun, 'final-reject': noRun,
        'return-for-supplement': [], 'return-to-previous-stage': noRun,
      },
      nonCompliant, coverage,
    }
  }

  const checks = run.checks ?? []
  coverage.produced = checks.length
  // 无真实计划或无有效检查不能因「没有待办」而被视为允许阶段通过。
  const required = run.coverage?.plannedChecks
  if (!Number.isSafeInteger(required) || !required || required < 1 || checks.length < required) {
    blockers.push('本次运行缺少有效检查计划或结果覆盖不足')
  }
  // Run 本身已经冻结原件使用账本；未完成的原件不等同于通过。
  const unread = (run.coverage?.documents ?? []).filter((item) => item.status !== 'read')
  if (unread.length) blockers.push(`${unread.length} 份原件缺少完整读取或人工核对回执`)

  // 计划覆盖：Run 记录了有效规则集合时，逐项核对是否都产出了 Check
  const plannedRuleIds = run.inputManifest?.effectiveRuleIds ?? []
  if (plannedRuleIds.length > 0) {
    coverage.planned = plannedRuleIds.length
    const produced = new Set(checks.map((check) => check.ruleId))
    coverage.missing = plannedRuleIds.filter((ruleId) => !produced.has(ruleId))
    if (coverage.missing.length > 0) {
      blockers.push(`计划覆盖不足：${coverage.missing.length} 条规则没有检查结果`)
    }
  }

  // 处置必须绑定当前 Run（换输入后旧处置自然失效）
  const disposed = new Map(
    (aggregate.dispositions ?? [])
      .filter((item) => !item.runId || item.runId === run.id)
      .map((item) => [item.findingKey, item]),
  )
  const dispositionOf = (check: { checkId: string; ruleId?: string }) =>
    disposed.get(check.checkId) ?? (check.ruleId ? disposed.get(check.ruleId) : undefined)

  const pending = checks.filter((check) => {
    if (check.status !== 'awaiting-confirmation' && check.status !== 'awaiting-supplement') return false
    const disposition = dispositionOf(check)
    return !disposition || !T05_RESOLVING_DISPOSITIONS.has(disposition.disposition)
  })
  if (pending.length > 0) blockers.push(`${pending.length} 项检查仍待确认或待补件`)

  const failed = checks.filter((check) => check.status === 'execution-failed')
  if (failed.length > 0) blockers.push(`${failed.length} 项检查执行失败`)

  const notExecuted = checks.filter((check) => check.status === 'not-executed')
  if (notExecuted.length > 0) blockers.push(`${notExecuted.length} 项检查未执行`)

  if (unresolvedSupplements.length > 0) blockers.push(`${unresolvedSupplements.length} 个补件请求尚未结束`)

  // 业务不合规：独立于执行失败；默认不允许无依据 stage-pass
  for (const check of checks) {
    if (check.status !== 'non-compliant') continue
    const disposition = dispositionOf(check)
    const explained = disposition
      && (disposition.disposition === 'waived' || disposition.disposition === 'human-confirmed-compliant')
    nonCompliant.push(check.checkId)
    // 面向用户：给出检查的具体理由，而不是内部 checkId（用户看不懂 t04:[...]）
    if (!explained) {
      const human = (check.reason ?? '').trim()
      blockers.push(`存在未解释的非合规项：${human || '有检查明确不符合要求'}`)
    }
  }

  const ready = blockers.length === 0
  const runUsable = !isWorkspaceRunStaleV2(aggregate, run.id) && Boolean(run.inputManifest?.hash)
  const runReasons = runUsable ? [] : ['审核运行已与当前原件不一致（需重新运行）']
  // RUN-05：partially-completed 只能办理拒绝/退回，不能通过阶段。
  const completed = run.status === 'completed'
  const passReasons = completed ? (ready ? [] : blockers) : ['必须完整结束本次运行后才能通过阶段']

  return {
    readiness: ready ? 'ready' : 'blocked',
    blockers,
    allowed: {
      'stage-pass': ready && runUsable && completed,
      'final-reject': runUsable,
      'return-for-supplement': true,
      'return-to-previous-stage': runUsable,
    },
    reasons: {
      'stage-pass': passReasons,
      'final-reject': runReasons,
      'return-for-supplement': [],
      'return-to-previous-stage': runReasons,
    },
    nonCompliant, coverage,
  }
}

/** 兼容旧名字：只回答「能否阶段通过」。 */
export function t05DecisionReadiness(
  aggregate: CaseAggregateV2, run: ReviewRunV2 | undefined,
): { readiness: 'ready' | 'blocked'; blockers: string[] } {
  const eligibility = t05ActionEligibility(aggregate, run)
  return { readiness: eligibility.readiness, blockers: eligibility.blockers }
}

// ===== 只读能力投影 =====

export interface T05StageCapability {
  mode: T05BusinessMode
  actorLabel: string
  actorRole: T05LocalRole
  eligibleTaskIds: string[]
  hasCurrentRun: boolean
  /** 当前权威业务 Run；旧 Run 只读，渲染层不得借此写处置/认定。 */
  currentRunId?: string
  currentRunReason?: string
  /** 该角色当前可执行的阶段动作（由 Main 判定，渲染层只展示） */
  allowedActions: T05StageAction[]
  /** 阶段动作被阻断时的真实原因 */
  blockers: string[]
}

export function readT05StageCapability(caseId: string, claim?: T05RoleClaim): T05StageCapability {
  const aggregate = readAggregate(caseId)
  if (!aggregate) throw new CommandValidationError('NOT_FOUND', '案卷不存在')
  const { mode } = resolveT05BusinessMode(aggregate)
  const actor = deriveT05LocalActor(claim)
  const eligible = (aggregate.tasks ?? [])
    .filter((task) => task.status === 'open' && task.assigneeRole === actor.role
      && (!task.assigneeActorId || task.assigneeActorId === actor.actorId))
    .map((task) => task.id)
  const authority = readT05RunAuthority(aggregate)
  const run = authority.run
  const eligibility = t05ActionEligibility(aggregate, run)
  const t03 = run
    ? assessStagePassWithT03({ aggregate, run, stale: isWorkspaceRunStaleV2(aggregate, run.id) })
    : undefined
  const allowedActions = mode === 'local-business'
    ? (Object.keys(eligibility.allowed) as T05StageAction[]).filter((action) =>
      action === 'stage-pass' ? eligibility.allowed[action] && Boolean(t03?.allowed) : eligibility.allowed[action])
    : []
  return {
    mode,
    actorLabel: actor.role === 'teacher' ? '本地终审教师（模拟，非学校授权）' : '本地审核员',
    actorRole: actor.role as T05LocalRole,
    eligibleTaskIds: eligible,
    hasCurrentRun: Boolean(run),
    ...(run ? { currentRunId: run.id } : {}),
    currentRunReason: authority.reason,
    allowedActions,
    blockers: mode === 'local-business'
      ? [...eligibility.blockers, ...(run && t03 && !t03.allowed
        ? t03.blockers.filter((item) => !eligibility.blockers.includes(item)) : [])]
      : ['技术预审案卷不具备正式业务决定权'],
  }
}

// ===== 写入 =====

export interface T05StageCommandInput {
  caseId: string
  templateId: string
  version: number
  expectedRevision: number
  taskId: string
  action: T05LocalStageAction
  reason: string
  supplementRequiredElements?: string[]
  supplementReason?: string
  requestId: string
  claim?: T05RoleClaim
}

export function recordT05StageDecision(input: T05StageCommandInput):
Promise<{ ok: true; revision: number; proposal: T05StageProposal; decisionId?: string; nextTaskId?: string; supplementId?: string }> {
  const actor = deriveT05LocalActor(input.claim)
  return submitCommand<
    T05StageCommandInput,
    { proposal: T05StageProposal; decisionId?: string; nextTaskId?: string; supplementId?: string }
  >(input.caseId, {
    requestId: input.requestId,
    actor,
    expectedRevision: input.expectedRevision,
    type: 'RecordTrustedStageDecision',
    payload: input,
  }, (aggregate, payload) => {
    const mode = resolveT05BusinessMode(aggregate)
    if (mode.mode !== 'local-business') {
      throw new CommandValidationError('INVALID_TRANSITION', `该案卷不可办理正式业务阶段：${mode.reason}`)
    }
    if (aggregate.caseV2.templateId !== payload.templateId || aggregate.caseV2.templateVersion !== payload.version) {
      throw new CommandValidationError('INVALID_TRANSITION', '案卷与模板版本不一致')
    }
    const template: TemplateVersion | undefined = getTemplate(payload.templateId, payload.version)
    if (!template || template.status !== 'published') {
      throw new CommandValidationError('DEPENDENCY_UNRESOLVED', '模板不存在或未发布')
    }
    const run = currentT05Run(aggregate)
    const eligibility = t05ActionEligibility(aggregate, run)
    if (!eligibility.allowed[payload.action]) {
      throw new CommandValidationError('INVALID_TRANSITION',
        eligibility.reasons[payload.action].join('；') || '当前状态不允许该动作')
    }
    // RUN-05：T03 严门禁接入真实写路径（completed、原件版本、冻结计划指纹、
    // CheckId × target 完整绑定），不再只依赖条数/ruleId 的宽校验。
    if (payload.action === 'stage-pass') {
      const t03 = assessStagePassWithT03({
        aggregate, run, stale: run ? isWorkspaceRunStaleV2(aggregate, run.id) : true,
      })
      if (!t03.allowed) {
        throw new CommandValidationError('INVALID_TRANSITION',
          t03.blockers.join('；') || '本次运行未通过 T03 阶段门禁')
      }
    }
    const verifiedRun: T05VerifiedRun | undefined = run
      ? {
        id: run.id,
        caseId: aggregate.caseV2.id,
        status: run.status === 'completed' ? 'completed' : 'partially-completed',
        current: true,
        decisionReadiness: eligibility.readiness,
      }
      : undefined

    // 纯领域判断：全部在 T05 既有函数内，不在此处重写规则
    const proposal = planT05LocalStageAction({
      aggregate,
      template,
      actor,
      businessMode: mode.mode,
      taskId: payload.taskId,
      action: payload.action,
      reason: payload.reason,
      ...(payload.supplementRequiredElements ? { requiredElements: payload.supplementRequiredElements } : {}),
      ...(payload.supplementReason ? { supplementReason: payload.supplementReason } : {}),
      ...(verifiedRun ? { verifiedRun } : {}),
    })

    const at = new Date().toISOString()
    const ids = {
      decisionId: `dec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nextTaskId: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      supplementId: `sup-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at,
    }
    const mutation = applyT05LocalStageProposal(aggregate, proposal, actor, ids)

    return {
      summary: `可信阶段决定：${proposal.action}（${proposal.decisionFinality ?? 'stage'}）`,
      mutate: (draft) => {
        draft.caseV2.stage = mutation.caseStage
        draft.tasks = mutation.tasks
        draft.decisions = mutation.decisions
        draft.supplements = mutation.supplements
        return {
          proposal,
          ...(mutation.addedDecision ? { decisionId: mutation.addedDecision.id } : {}),
          ...(mutation.addedTask ? { nextTaskId: mutation.addedTask.id } : {}),
          ...(mutation.addedSupplement ? { supplementId: mutation.addedSupplement.id } : {}),
        }
      },
    }
  }).then((result) => {
    if (!result.ok) throw new CommandValidationError(result.code, result.message)
    const entity = result.entity
    if (!entity) throw new CommandValidationError('INVALID_TRANSITION', '阶段决定已写入但未返回提案，请重新读取案卷')
    return {
      ok: true as const,
      revision: result.aggregate.caseV2.revision,
      proposal: entity.proposal,
      ...(entity.decisionId ? { decisionId: entity.decisionId } : {}),
      ...(entity.nextTaskId ? { nextTaskId: entity.nextTaskId } : {}),
      ...(entity.supplementId ? { supplementId: entity.supplementId } : {}),
    }
  })
}

/** 供 Main 内部消费者：当前案卷的开放任务与角色。 */
export function readT05TaskSummary(caseId: string): Array<{ id: string; stageId: string; role: string; status: string }> {
  const aggregate = readAggregate(caseId)
  if (!aggregate) return []
  return (aggregate.tasks ?? []).map((task) => ({
    id: task.id, stageId: task.stageId, role: task.assigneeRole, status: task.status,
  }))
}

export type { T05LocalStageAction, T05StageProposal }
