/**
 * Main 内存态 Pi 审核运行进度投影（安全 progress projection）。
 *
 * 隐私边界：Agent 内部事件只在 Main 内被推断成阶段枚举，绝不向 Renderer
 * 转发 AgentStreamEvent、自由文本、思考文本、原始工具参数或文档正文。
 * 文件名只能由 Main 从案卷聚合的活跃 documentVersionId 映射核准后附带，
 * 不透传 SDK 原始 arguments。
 *
 * 生命周期：每案卷至多一个当前 Pi review run 的进度对象，随 run 注册；
 * 新 run 注册即覆盖旧对象，终态/停止/失败在读取投影或显式清理时移除。
 * 进度仅是投影，不参与 run/status/authorization 生命周期。
 */
import type {
  AgentStreamPayload,
  ReviewBackgroundPiRunState,
  ReviewPiRunProgress,
  ReviewPiRunProgressPhase,
  SDKMessage,
} from '@profer/shared'
import { agentEventBus } from '../agent-service'
import { getCaseV2Aggregate } from './application-service'
import { getPiReviewBindingForSession } from './pi-case-review-service'

/** 可识别为「读取/核验材料」阶段的受控审核工具（白名单）。 */
const READ_PHASE_TOOL_NAMES = new Set([
  'review_read_documents',
  'review_inspect_original',
  'review_inspect_document_image',
])

interface PiReviewProgressEntry {
  caseId: string
  sessionId: string
  runId: string
  phase: ReviewPiRunProgressPhase
  fileName?: string
  updatedAt: number
}

/** 每案卷至多一个当前 Pi review run 的进度对象。 */
const entries = new Map<string, PiReviewProgressEntry>()

let unsubscribe: (() => void) | undefined

/** 注册（或以新 run 覆盖）本案卷的进度对象；初始阶段为 preparing。 */
export function registerPiReviewRunProgress(input: { caseId: string; sessionId: string; runId: string }): void {
  if (!unsubscribe) unsubscribe = agentEventBus.on(handleAgentEvent)
  entries.set(input.caseId, {
    caseId: input.caseId,
    sessionId: input.sessionId,
    runId: input.runId,
    phase: 'preparing',
    updatedAt: Date.now(),
  })
}

/** 清理进度对象；指定 runId 时不误删新 run 的对象。 */
export function clearPiReviewRunProgress(caseId: string, runId?: string): void {
  const entry = entries.get(caseId)
  if (!entry) return
  if (runId !== undefined && entry.runId !== runId) return
  entries.delete(caseId)
}

/**
 * 读取时把内存进度投影挂到业务状态：仅当其当前 Run 与 progress.runId
 * 一致且仍在运行才附带；停止、失败、完成或新 Run 时清理/忽略旧对象。
 */
export function attachPiReviewRunProgress(state: ReviewBackgroundPiRunState): ReviewBackgroundPiRunState {
  const entry = entries.get(state.caseId)
  if (!entry) return state
  if (entry.runId !== state.runId || state.runStatus !== 'running') {
    entries.delete(state.caseId)
    return state
  }
  const progress: ReviewPiRunProgress = {
    runId: entry.runId,
    phase: entry.phase,
    ...(entry.fileName ? { fileName: entry.fileName } : {}),
    updatedAt: entry.updatedAt,
  }
  return { ...state, progress }
}

/** 事件总线入口：先按当前绑定的 sessionId 过滤，再做白名单阶段推断。 */
function handleAgentEvent(sessionId: string, payload: AgentStreamPayload): void {
  if (payload.kind !== 'sdk_message') return
  const entry = [...entries.values()].find((item) => item.sessionId === sessionId)
  if (!entry) return
  const hint = phaseHintFromSdkMessage(payload.message)
  if (!hint) return
  const fileName = hint.versionIds.length > 0 ? approvedFileName(entry.caseId, hint.versionIds) : undefined
  // Pi 流式预览帧高频重复同一提示；无变化不落笔，也不必读盘校验绑定。
  if (entry.phase === hint.phase && entry.fileName === fileName) return
  // 迟到事件保护：会话当前绑定必须仍指向本 run，才允许覆盖进度对象。
  const binding = getPiReviewBindingForSession(sessionId)
  if (!binding || binding.caseId !== entry.caseId || binding.runId !== entry.runId) return
  entry.phase = hint.phase
  entry.fileName = fileName
  entry.updatedAt = Date.now()
}

interface PhaseHint {
  phase: ReviewPiRunProgressPhase
  /** 白名单工具输入中的材料版本 ID，仅用于事后向聚合映射核准文件名。 */
  versionIds: string[]
}

/**
 * 仅从白名单工具/块类型推断阶段：
 * - review_submit_result → submitting-results；
 * - 读取/核验材料工具 → reading-material；
 * - thinking 块 → analyzing；text 块 → outputting-results；
 * 其余形状不确定的一律回退通用 analyzing，不猜测细节，不保留内容。
 */
function phaseHintFromSdkMessage(message: SDKMessage): PhaseHint | undefined {
  const raw = message as { type?: unknown; error?: unknown; message?: { content?: unknown } }
  if (raw?.type === 'user') {
    const content = raw.message?.content
    return Array.isArray(content) && content.some((block) => (block as { type?: unknown })?.type === 'tool_result')
      ? { phase: 'analyzing', versionIds: [] }
      : undefined
  }
  if (raw?.type !== 'assistant') return undefined
  // 传输层错误合成消息不是工作阶段信号，保持上一阶段不变。
  if (raw.error) return undefined
  const content = raw.message?.content
  if (!Array.isArray(content)) return { phase: 'analyzing', versionIds: [] }
  let hint: PhaseHint | undefined
  for (const block of content) {
    const item = block as { type?: unknown; name?: unknown; input?: unknown }
    if (item?.type === 'thinking') {
      hint = { phase: 'analyzing', versionIds: [] }
    } else if (item?.type === 'text') {
      hint = { phase: 'outputting-results', versionIds: [] }
    } else if (item?.type === 'tool_use' && typeof item.name === 'string') {
      if (item.name === 'review_submit_result') {
        hint = { phase: 'submitting-results', versionIds: [] }
      } else if (READ_PHASE_TOOL_NAMES.has(item.name)) {
        hint = { phase: 'reading-material', versionIds: readVersionIds(item.name, item.input) }
      } else {
        hint = { phase: 'analyzing', versionIds: [] }
      }
    } else {
      hint = { phase: 'analyzing', versionIds: [] }
    }
  }
  return hint ?? { phase: 'analyzing', versionIds: [] }
}

/** 从白名单工具输入中提取材料版本 ID；形状不符时返回空（不猜测）。 */
function readVersionIds(toolName: string, input: unknown): string[] {
  const args = (input ?? {}) as { documentVersionId?: unknown; documents?: unknown }
  if (toolName === 'review_read_documents') {
    if (!Array.isArray(args.documents)) return []
    return args.documents
      .map((item) => (item as { documentVersionId?: unknown } | null)?.documentVersionId)
      .filter((id): id is string => typeof id === 'string' && id.length > 0)
  }
  return typeof args.documentVersionId === 'string' && args.documentVersionId.length > 0
    ? [args.documentVersionId]
    : []
}

/**
 * 文件名必须由 Main 从案卷聚合的活跃 documentVersionId 映射核准：
 * 任一版本 ID 无法严格匹配当前聚合的活跃材料时一律不传文件名；
 * 并读多份材料时也只报通用阶段，避免单一 fileName 误导。
 */
function approvedFileName(caseId: string, versionIds: string[]): string | undefined {
  if (versionIds.length !== 1) return undefined
  const aggregate = getCaseV2Aggregate(caseId)
  if (!aggregate) return undefined
  const names = new Set<string>()
  for (const versionId of versionIds) {
    const document = aggregate.caseV2.documents.find((item) => item.versionId === versionId && item.active !== false)
    if (!document) return undefined
    names.add(document.fileName)
  }
  return names.size === 1 ? [...names][0] : undefined
}
