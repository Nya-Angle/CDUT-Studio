/** 案卷后台入口：复用会话管理、Pi 执行器、受理 ACK 和 V2 账本。 */
import { randomUUID } from 'node:crypto'
import type { WebContents } from 'electron'
import type { ReviewBackgroundPiRunState, ReviewBackgroundPiStartRequest } from '@profer/shared'
import { getChannelById } from '../channel-manager'
import { getSettings } from '../settings-service'
import { createReviewOwnedAgentSession, listAgentSessions, updateAgentSessionMeta } from '../agent-session-manager'
import { isAgentSessionActive, runAgent, stopAgentAndWait } from '../agent-service'
import { getCaseV2Aggregate } from './application-service'
import { getReviewModuleSettings } from './module-settings-store'
import { getBackgroundPiReviewState } from './review-background-state'
import { admitPreparedPiReviewTurn } from './review-pi-admission'
import { finishPiReviewRunV2, getPiReviewBindingForSession, preparePiReviewRunV2 } from './pi-case-review-service'
import { listAssignments, revokeAssignment } from './review-agent-assignment'
import { listRunsV2 } from './run-store-v2'
import { assertSafeReviewStorageId } from './review-storage-id'
import { isWorkspaceRunStaleV2 } from './workspace-business-service-v2'
import { getCase } from './case-store'

/** 仅保护准备/停止的短临界区，持久运行记录仍以 V2 为准。 */
const busyCases = new Set<string>()

export async function startBackgroundPiReview(input: ReviewBackgroundPiStartRequest, webContents: WebContents): Promise<ReviewBackgroundPiRunState> {
  assertSafeReviewStorageId(input?.caseId, 'caseId')
  if (input.mode !== undefined && input.mode !== 'update' && input.mode !== 'restart') throw new Error('审核启动模式非法')
  if (!webContents || webContents.isDestroyed()) throw new Error('审核窗口已关闭，无法受理本次启动')
  if (busyCases.has(input.caseId)) throw new Error('该案卷正在启动或停止，请稍后再试')
  busyCases.add(input.caseId)
  try {
    const aggregate = getCaseV2Aggregate(input.caseId)
    if (!aggregate) throw new Error('案卷不存在或尚未初始化')
    const selection = getReviewModuleSettings().agentModelSelection
    const defaults = getSettings()
    const channelId = selection?.channelId ?? defaults.agentChannelId
    const modelId = selection?.modelId ?? defaults.agentModelId
    const channel = channelId ? getChannelById(channelId) : undefined
    if (!channel || channel.enabled !== true || !modelId
      || !channel.models.some((model) => model.id === modelId && model.enabled !== false)) {
      throw new Error('审核渠道或模型未配置、已停用或已删除，请在审核设置中选择有效模型')
    }
    const sessions = listAgentSessions(true).filter((session) => session.owner?.kind === 'review-case'
      && session.owner.caseId === input.caseId)
    if (sessions.some((session) => isAgentSessionActive(session.id))
      || listRunsV2(input.caseId).some((run) => run.status === 'running' || run.status === 'queued')) {
      throw new Error('该案卷已有审核正在进行，请等待结束或先停止本轮')
    }
    const reusable = input.mode !== 'restart' ? sessions.find((session) => !session.archived
      && (session.presetReference?.presetId ?? session.presetId) === 'review-operator'
      && session.agentRuntime === 'pi' && session.channelId === channel.id && session.modelId === modelId) : undefined
    // 使用默认会话沙箱，不继承当前聊天工作区；旧普通审核会话不迁移。
    const session = reusable ?? createReviewOwnedAgentSession({ caseId: input.caseId,
      title: `审核：${getCase(input.caseId)?.title ?? input.caseId}`, channelId: channel.id, modelId })
    // 同案可能在 Pi 审核之后又执行 T04 模板规则 Run。不能让另一种运行
    // 占据列表首位，就错误放弃原 Pi 的有效续交检查点。
    const previous = listRunsV2(input.caseId).find((run) => run.id.startsWith('run-pi-'))
    const resumeRunId = reusable && previous?.status === 'partially-completed'
      && previous.checks.some((check) => check.status === 'execution-failed')
      && !isWorkspaceRunStaleV2(aggregate, previous.id)
      && listAssignments().some((assignment) => assignment.caseId === input.caseId
        && assignment.sessionId === session.id && assignment.activeRunId === previous.id)
      ? previous.id : undefined
    const turnId = randomUUID()
    const prepared = preparePiReviewRunV2({ caseId: input.caseId, sessionId: session.id, turnId,
      ...(resumeRunId ? { resumeRunId } : {}), inheritReadReceipts: input.mode !== 'restart' })
    const binding = { caseId: input.caseId, sessionId: session.id, runId: prepared.runId, assignmentId: prepared.assignmentId }
    try {
      updateAgentSessionMeta(session.id, { attachedDirectories: [prepared.caseDirectory] })
      await admitPreparedPiReviewTurn({ sessionId: session.id, userMessage: prepared.userMessage,
        channelId: channel.id, modelId, agentRuntime: 'pi', triggeredBy: 'user', uuid: turnId,
      }, binding, (agentInput, onRunOwned) => runAgent(agentInput, webContents, undefined, onRunOwned))
    } catch (error) {
      const current = getPiReviewBindingForSession(session.id)
      if (current?.runId === binding.runId && current.assignmentId === binding.assignmentId) {
        finishPiReviewRunV2(binding, { status: 'failed', error: error instanceof Error ? error.message : String(error) })
        revokeAssignment(binding.assignmentId)
      }
      throw error
    }
    return getBackgroundPiReviewState(input.caseId)
  } finally {
    busyCases.delete(input.caseId)
  }
}

/** runId 必须仍属于本案当前内部会话，不能用旧请求停止其他运行。 */
export async function stopBackgroundPiReview(input: { caseId: string; runId: string }): Promise<ReviewBackgroundPiRunState> {
  assertSafeReviewStorageId(input?.caseId, 'caseId')
  assertSafeReviewStorageId(input?.runId, 'runId')
  if (busyCases.has(input.caseId)) throw new Error('该案卷正在启动或停止，请稍后再试')
  const session = listAgentSessions(true).find((item) => item.owner?.kind === 'review-case'
    && item.owner.caseId === input.caseId && getPiReviewBindingForSession(item.id)?.runId === input.runId)
  const binding = session ? getPiReviewBindingForSession(session.id) : undefined
  if (!session || !binding) throw new Error('本次审核已结束或运行已变化，请刷新案卷后再试')
  busyCases.add(input.caseId)
  try {
    // 调用前无异步空窗，现有执行器先停止并等待真实执行权释放。
    await stopAgentAndWait(session.id)
    const current = getPiReviewBindingForSession(session.id)
    if (current?.runId === binding.runId && current.assignmentId === binding.assignmentId) finishPiReviewRunV2(binding, { status: 'stopped' })
    revokeAssignment(binding.assignmentId)
    return getBackgroundPiReviewState(input.caseId)
  } finally {
    busyCases.delete(input.caseId)
  }
}
