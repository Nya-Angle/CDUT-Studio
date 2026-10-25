/** 案卷后台入口：复用会话管理、Pi 执行器、受理 ACK 和 V2 账本。 */
import { randomUUID } from 'node:crypto'
import type { WebContents } from 'electron'
import type { ReviewBackgroundPiRunState, ReviewBackgroundPiStartRequest } from '@profer/shared'
import { getChannelById } from '../channel-manager'
import { createReviewOwnedAgentSession, listAgentSessions, updateAgentSessionMeta } from '../agent-session-manager'
import { isAgentSessionActive, runAgent, stopAgentAndWait } from '../agent-service'
import { getCaseV2Aggregate } from './application-service'
import { getEffectiveReviewModelSelection } from './module-settings-store'
import { pickChannelModelId } from './review-model-identity'
import { getBackgroundPiReviewState } from './review-background-state'
import { admitPreparedPiReviewTurn } from './review-pi-admission'
import { interruptedResumeGate } from './review-runtime-contract'
import { finishPiReviewRunV2, getPiReviewBindingForSession, preparePiReviewRunV2 } from './pi-case-review-service'
import { clearPiReviewRunProgress, registerPiReviewRunProgress } from './review-pi-progress'
import { listAssignments, revokeAssignment } from './review-agent-assignment'
import {
  isResumableInterruptedRunV2, listRunsV2, reopenInterruptedRunForResume,
} from './run-store-v2'
import { assertSafeReviewStorageId } from './review-storage-id'
import { isWorkspaceRunStaleV2 } from './workspace-business-service-v2'
import { getCase } from './case-store'
import { assertReviewPreuploadAllowed } from './review-preupload-gate'

/** 仅保护准备/停止的短临界区，持久运行记录仍以 V2 为准。 */
const busyCases = new Set<string>()

export async function startBackgroundPiReview(input: ReviewBackgroundPiStartRequest, webContents: WebContents): Promise<ReviewBackgroundPiRunState> {
  assertSafeReviewStorageId(input?.caseId, 'caseId')
  assertReviewPreuploadAllowed('read', { caseId: input.caseId })
  if (input.mode !== undefined && input.mode !== 'update' && input.mode !== 'restart') throw new Error('审核启动模式非法')
  if (input.resumeInterrupted !== undefined && typeof input.resumeInterrupted !== 'boolean') throw new Error('审核续交确认参数非法')
  if (!webContents || webContents.isDestroyed()) throw new Error('审核窗口已关闭，无法受理本次启动')
  if (busyCases.has(input.caseId)) throw new Error('该案卷正在启动或停止，请稍后再试')
  busyCases.add(input.caseId)
  try {
    let aggregate = getCaseV2Aggregate(input.caseId)
    if (!aggregate) throw new Error('案卷不存在或尚未初始化')
    // MHI-03：bridge 与网关使用同一解析顺序（审核模块显式选择 → 应用全局渠道/模型）。
    const { selection, explicit } = getEffectiveReviewModelSelection()
    const channel = selection?.channelId ? getChannelById(selection.channelId) : undefined
    const modelId = channel && channel.enabled === true
      ? pickChannelModelId(channel, selection) : undefined
    if (!channel || channel.enabled !== true || !modelId) {
      throw new Error('审核渠道或模型未配置、已停用或已删除，请在审核设置中选择有效模型')
    }
    if (explicit && selection && selection.channelId === channel.id && selection.modelId !== modelId) {
      throw new Error('审核所选模型已停用或被删除，请在审核设置中重新选择后再运行')
    }
    // 读授权不能替代模型外发授权：进入通用 Pi 执行器后输入会直接发往渠道，
    // 因此必须在创建内部会话/runAgent 之前，用 Main 解析出的精确目标单独过 model 门。
    assertReviewPreuploadAllowed('model', { caseId: input.caseId,
      modelDestination: `${channel.provider}:${channel.baseUrl ?? ''}` })
    const sessions = listAgentSessions(true).filter((session) => session.owner?.kind === 'review-case'
      && session.owner.caseId === input.caseId)
    if (sessions.some((session) => isAgentSessionActive(session.id))
      || listRunsV2(input.caseId).some((run) => run.status === 'running' || run.status === 'queued')) {
      throw new Error('该案卷已有审核正在进行，请等待结束或先停止本轮')
    }
    // Older V1 PDFs may have been migrated with no page-image blocks. Restore
    // only those immutable-source derivatives before freezing this Run input.
    const { rehydrateLegacyPdfImageBlocks } = require('./case-import') as typeof import('./case-import')
    await rehydrateLegacyPdfImageBlocks(input.caseId)
    aggregate = getCaseV2Aggregate(input.caseId) ?? aggregate
    const reusable = input.mode !== 'restart' ? sessions.find((session) => !session.archived
      && (session.presetReference?.presetId ?? session.presetId) === 'review-operator'
      && session.agentRuntime === 'pi' && session.channelId === channel.id && session.modelId === modelId) : undefined
    // 使用默认会话沙箱，不继承当前聊天工作区；旧普通审核会话不迁移。
    const session = reusable ?? createReviewOwnedAgentSession({ caseId: input.caseId,
      title: `审核：${getCase(input.caseId)?.title ?? input.caseId}`, channelId: channel.id, modelId })
    // 同案可能在 Pi 审核之后又执行 T04 模板规则 Run。不能让另一种运行
    // 占据列表首位，就错误放弃原 Pi 的有效续交检查点。
    const previous = listRunsV2(input.caseId).find((run) => run.id.startsWith('run-pi-'))
    // RUN-43：普通 partially-completed 运行仍按同一 RunId 续交；冷启动中断
    // 的运行只有在用户显式确认后才由 Main 恢复为 partially-completed 并解除
    // 启动拒止（绝不新建第二个 run-pi ID 冒充同一轮，也不自动重放未知请求）。
    const interruptedResumable = !!previous && isResumableInterruptedRunV2(previous)
    // RUN-43：未知 effect 必须失败关闭。自动续跑会开新回合重放中断前未确认的
    // 模型请求，因此只有用户显式确认后才允许按原 RunId 续交；显式续交也会
    // 在运行诊断里记录“新回合”，不冒充原来的 Provider 请求已恢复。
    const resumeGate = interruptedResumeGate({
      interruptedResumable, resumeInterrupted: input.resumeInterrupted, mode: input.mode,
    })
    if (!resumeGate.allowed) throw new Error(resumeGate.message)
    const resumeEligible = !!reusable && !!previous
      && (previous.status === 'partially-completed' || (interruptedResumable && input.resumeInterrupted === true))
      // 未完成工作的判定同时覆盖 PR272 的语义占位（semantic + not-executed）与
      // 本地历史占位（execution-failed）：两者都代表本轮 Pi 仍有未执行检查，
      // 不是最终结论；只有全部检查已有结论时才不再按原 RunId 续交。
      && (previous.checks.some((check) => check.status === 'execution-failed'
          || (check.executedBy === 'semantic' && check.status === 'not-executed'))
        || previous.checks.length < (previous.coverage?.plannedChecks ?? Number.MAX_SAFE_INTEGER)
        || previous.checkpoints.length > 0)
      && !isWorkspaceRunStaleV2(aggregate, previous.id)
      && listAssignments().some((assignment) => assignment.caseId === input.caseId
        && assignment.sessionId === session.id && assignment.activeRunId === previous.id)
    const resumeRunId = resumeEligible && previous
      ? (interruptedResumable
        ? reopenInterruptedRunForResume(input.caseId, previous.id, { confirmedByUser: true })?.id
        : previous.id)
      : undefined
    const turnId = randomUUID()
    const prepared = preparePiReviewRunV2({ caseId: input.caseId, sessionId: session.id, turnId,
      ...(resumeRunId ? { resumeRunId } : {}), inheritReadReceipts: input.mode !== 'restart' })
    const binding = { caseId: input.caseId, sessionId: session.id, runId: prepared.runId, assignmentId: prepared.assignmentId }
    registerPiReviewRunProgress(binding)
    try {
      updateAgentSessionMeta(session.id, { attachedDirectories: [prepared.caseDirectory] })
      await admitPreparedPiReviewTurn({ sessionId: session.id, userMessage: prepared.userMessage,
        channelId: channel.id, modelId, agentRuntime: 'pi', triggeredBy: 'user', uuid: turnId,
      }, binding, (agentInput, onRunOwned) => runAgent(agentInput, webContents, undefined, onRunOwned))
    } catch (error) {
      clearPiReviewRunProgress(binding.caseId, binding.runId)
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
    clearPiReviewRunProgress(binding.caseId, binding.runId)
    const current = getPiReviewBindingForSession(session.id)
    if (current?.runId === binding.runId && current.assignmentId === binding.assignmentId) finishPiReviewRunV2(binding, { status: 'stopped' })
    revokeAssignment(binding.assignmentId)
    return getBackgroundPiReviewState(input.caseId)
  } finally {
    busyCases.delete(input.caseId)
  }
}
