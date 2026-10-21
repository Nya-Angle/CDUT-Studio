/**
 * Renderer IPC is an untrusted boundary. The local desktop reviewer is an
 * application-scoped role, NEVER a school/teacher/agent authentication.
 *
 * Until school role credentials are verified by a main-process SchoolPort,
 * privileged school/teacher decisions cannot be claimed through renderer IPC.
 */
import type { Actor } from '@profer/shared'

export const LOCAL_REVIEWER_ACTOR: Actor = Object.freeze({
  actorId: 'local-reviewer',
  actorSource: 'local',
  role: 'reviewer',
})

export function bindLocalReviewerCommand<T extends Record<string, unknown>>(command: T): T {
  const claim = command?.actor as Actor | undefined
  if (!claim || claim.actorSource !== 'local' || claim.role !== 'reviewer') {
    throw new Error('本地审核 IPC 仅允许 reviewer 操作；教师、校方、系统或 Agent 权限必须经过可信服务授权')
  }
  // Ignore the renderer-supplied identity: it is not authenticated.
  return { ...command, actor: LOCAL_REVIEWER_ACTOR }
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
