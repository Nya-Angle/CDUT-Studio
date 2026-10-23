/**
 * Renderer IPC is an untrusted boundary. The local desktop reviewer is an
 * application-scoped role, NEVER a school/teacher/agent authentication.
 *
 * Until school role credentials are verified by a main-process SchoolPort,
 * privileged school/teacher decisions cannot be claimed through renderer IPC.
 */
import type { Actor, CaseAggregateV2 } from '@profer/shared'
import type { IpcMainInvokeEvent } from 'electron'
import { assertMainWindowSender } from '../ipc-sender-guard'
import { getMainWindow } from '../main-window-state'
import {
  issueLocalPrincipal, assertNoRendererRoleEscalation,
  type ReviewPrincipal,
} from './review-principal-service'

export const LOCAL_REVIEWER_ACTOR: Actor = Object.freeze({
  actorId: 'local-reviewer',
  actorSource: 'local',
  role: 'reviewer',
})

/**
 * RUN-17：补件判定人由 Main 按补件来源任务派生。
 *
 * 本地 teacher 仅是“本机以教师阶段试办”的本地角色，不是学校认证；渲染层
 * 自填的 role/actorId 一律不参与派生。来源任务指定了 assigneeActorId 时沿用它，
 * 否则按角色使用固定的本地 actor。最终仍由 stage-workflow 校验任务归属。
 */
export function deriveLocalSupplementResolverActor(
  aggregate: CaseAggregateV2 | undefined,
  supplementId: string,
): Actor {
  const supplement = aggregate?.supplements.find((item) => item.id === supplementId)
  const originTask = supplement?.originTaskId
    ? aggregate?.tasks.find((item) => item.id === supplement.originTaskId)
    : undefined
  const role = originTask?.assigneeRole === 'teacher' ? 'teacher' as const : 'reviewer' as const
  return {
    actorId: originTask?.assigneeActorId ?? (role === 'teacher' ? 'local-teacher' : 'local-reviewer'),
    actorSource: 'local',
    role,
  }
}

export function bindLocalReviewerCommand<T extends Record<string, unknown>>(command: T): T {
  const claim = command?.actor as Actor | undefined
  if (!claim || claim.actorSource !== 'local' || claim.role !== 'reviewer') {
    throw new Error('本地审核 IPC 仅允许 reviewer 操作；教师、校方、系统或 Agent 权限必须经过可信服务授权')
  }
  // Ignore the renderer-supplied identity: it is not authenticated.
  return { ...command, actor: LOCAL_REVIEWER_ACTOR }
}

/**
 * 旧版 V2 写通道的统一收口（AUTH-06）。
 *
 * `bindLocalReviewerCommand` 只看入参，不看 IPC event，因此单独使用时
 * 只等于“拒绝非 reviewer claim”，不等于“来源可信”。凡是能写业务的
 * handler 都必须改用本函数：先校验主窗口 + 主帧，再由 Main 签发 Principal。
 *
 * 返回 `principal` 供业务事务写入时重核与审计；命令里的 actor 一律被覆盖。
 */
export interface VerifiedLocalCommand<T> {
  command: T
  principal: ReviewPrincipal
}

export function assertReviewMainSender(event: IpcMainInvokeEvent): void {
  try {
    assertMainWindowSender(event, getMainWindow)
  } catch {
    throw new Error('审核 IPC 仅允许主窗口调用（SENDER_UNTRUSTED）')
  }
  if (!event.senderFrame || event.senderFrame !== event.sender.mainFrame) {
    throw new Error('审核 IPC 仅允许主框架调用（子帧不具备业务权限）')
  }
}

export function bindVerifiedLocalReviewerCommand<T extends Record<string, unknown>>(
  event: IpcMainInvokeEvent,
  command: T,
  scope: { caseId?: string; action: string },
): VerifiedLocalCommand<T> {
  assertReviewMainSender(event)
  // Renderer 可以带 actor 占位，但不能借此升级角色；Main 只签发本地 reviewer。
  if (command?.actor !== undefined) assertNoRendererRoleEscalation(command.actor)
  const principal = issueLocalPrincipal({
    role: 'reviewer',
    caseIds: [scope.caseId ?? `local-scope:${scope.action}`],
    actions: [scope.action],
    sessionId: `local-main-webcontents:${event.sender.id}`,
  })
  return { command: { ...command, actor: LOCAL_REVIEWER_ACTOR }, principal }
}

/**
 * 本地独立副本/学生补件只标识 desktop-local submitter，
 * 不是学校登录身份。Renderer 自填 actorId 不得成为审计权威。
 */
export const LOCAL_SUBMITTER_ACTOR: Actor = Object.freeze({
  actorId: 'local-student',
  actorSource: 'local',
  role: 'student',
})

export function bindLocalSubmitterCommand<T extends Record<string, unknown>>(command: T): T {
  const claim = command?.actor as Actor | undefined
  if (!claim || claim.actorSource !== 'local' ||
      (claim.role !== 'student' && claim.role !== 'reviewer')) {
    throw new Error('本地补件应答 IPC 仅允许本地提交方或审核员，不接受校方/教师/Agent 身份声明')
  }
  // Legacy local reviewer-on-behalf-of-student is an explicit business path.
  // Its actor is still Main-bound; never trust a user-supplied actorId.
  return { ...command, actor: claim.role === 'student' ? LOCAL_SUBMITTER_ACTOR : LOCAL_REVIEWER_ACTOR }
}

/**
 * 代理办理标注（AUTH-10）：审核员代学生回复是本地兼容路径，
 * 但必须显式记录“没有校方委托授权”，不能被读成学生本人已确认。
 */
export const LOCAL_PROXY_AUTHORIZATION = 'LOCAL_OPERATOR_PROXY_NO_SCHOOL_DELEGATION' as const

export interface VerifiedSubmitterCommand<T> extends VerifiedLocalCommand<T> {
  proxy: {
    onBehalfOf: 'local-student'
    authorization: typeof LOCAL_PROXY_AUTHORIZATION
    /** 本地代录：不代表学生本人确认 */
    submitterConfirmedByStudent: false
  } | null
}

export function bindVerifiedSubmitterCommand<T extends Record<string, unknown>>(
  event: IpcMainInvokeEvent,
  command: T,
  scope: { caseId?: string; action: string },
): VerifiedSubmitterCommand<T> {
  assertReviewMainSender(event)
  const claim = command?.actor as Actor | undefined
  if (!claim || claim.actorSource !== 'local' ||
      (claim.role !== 'student' && claim.role !== 'reviewer')) {
    throw new Error('本地补件应答 IPC 仅允许本地提交方或审核员，不接受校方/教师/Agent 身份声明')
  }
  const onBehalf = claim.role === 'reviewer'
  const principal = issueLocalPrincipal({
    role: onBehalf ? 'reviewer' : 'student',
    caseIds: [scope.caseId ?? `local-scope:${scope.action}`],
    actions: [scope.action],
    sessionId: `local-main-webcontents:${event.sender.id}`,
  })
  return {
    command: { ...command, actor: onBehalf ? LOCAL_REVIEWER_ACTOR : LOCAL_SUBMITTER_ACTOR },
    principal,
    proxy: onBehalf
      ? { onBehalfOf: 'local-student', authorization: LOCAL_PROXY_AUTHORIZATION, submitterConfirmedByStudent: false }
      : null,
  }
}
