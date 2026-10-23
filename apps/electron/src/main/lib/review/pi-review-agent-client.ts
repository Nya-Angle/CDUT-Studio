/** 将审核图的语义请求交给项目的 Pi Agent 运行时，不单独实现模型 HTTP 协议。 */
import { randomUUID } from 'node:crypto'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Channel, SDKMessage } from '@profer/shared'
import type { PiAgentQueryOptions } from '../adapters/pi-agent-adapter'
import type { ReviewModelClient } from './pi-review-executor'
import { buildPiReviewToolDefinitions } from './pi-review-executor'

type ReviewPiQuery = (input: PiAgentQueryOptions) => AsyncIterable<SDKMessage>
type ReviewPiAbort = (sessionId: string) => void
type ReviewPiSdk = typeof import('@earendil-works/pi-coding-agent')

export interface PiReviewModelClientOptions {
  channel: Channel
  apiKey: string
  model: string
  baseUrl?: string
  timeoutMs?: number
  cwd: string
  piAgentDir: string
  query: ReviewPiQuery
  abort?: ReviewPiAbort
  loadSdk?: () => Promise<ReviewPiSdk>
}

function textFromMessage(message: SDKMessage): string | undefined {
  if (message.type !== 'assistant') return undefined
  const assistant = message as Extract<SDKMessage, { type: 'assistant' }>
  if (assistant.error?.message) throw new Error(`Pi 审核 Agent 返回错误：${assistant.error.message}`)
  const parts = assistant.message.content
    .filter((item): item is Extract<(typeof assistant.message.content)[number], { type: 'text' }> => item.type === 'text' && typeof (item as { text?: unknown }).text === 'string')
    .map((item) => item.text)
  return parts.join('\n').trim() || undefined
}

function isVisionCompatibilityFailure(error: unknown): boolean {
  if (!(error instanceof Error) || error.name === 'AbortError') return false
  return /image|vision|multimodal|图片|多模态|HTTP (400|413|415|422|500|502|503|504)|\b(400|413|415|422|500|502|503|504)\b|internal server error|upstream service temporarily unavailable|审核 Agent 超时|\btimeout\b|fetch failed|network error/i.test(error.message)
}

function imageFailureReason(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  if (/image.*(not supported|unsupported)|vision.*(not supported|unsupported)|does not support.*image|不支持.*图片|不支持.*图像|多模态.*不支持/i.test(message)) return `渠道明确拒绝本次图像输入：${message}`
  return `本次带图请求失败（${message}）；已转文本路径，图像内容未核验`
}

function hasStructuredJson(text: string): boolean {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start < 0 || end <= start) return false
  try {
    return typeof JSON.parse(text.slice(start, end + 1)) === 'object'
  } catch {
    return false
  }
}

const REVIEW_TOOL_RESULT_FALLBACK = JSON.stringify({
  opinion: '审核工具已执行，但 Pi 未返回最终摘要。已接受的事实和检查以系统记录为准；未接受或缺少证据的项目需人工核对。',
  checks: [],
  observations: [],
})
const REVIEW_TIMEOUT_FALLBACK = JSON.stringify({
  opinion: '模型请求超时或上游服务失败；本轮未得到可核验的模型结论。缺失事实和语义检查均保持人工确认或补件，不作推定。',
  checks: [],
  observations: [],
})

function isRecoverableReviewServiceFailure(error: unknown): boolean {
  if (!(error instanceof Error) || error.name === 'AbortError') return false
  return /Pi 审核 Agent 超时|\btimeout\b|internal server error|upstream service temporarily unavailable|HTTP (500|502|503|504)|\b(500|502|503|504)\b|fetch failed|network error/i.test(error.message)
}

/** 每个审核语义调用使用独立的临时 Pi transcript；执行结束后即删除，避免在会话列表里制造幽灵会话。 */
export function createPiReviewModelClient(options: PiReviewModelClientOptions): ReviewModelClient {
  const protocol = options.channel.provider === 'ollama' ? 'ollama-chat' : 'openai-chat'
  const configuredModel = options.channel.models.find((item) => item.id.toLowerCase() === options.model.toLowerCase())

  const runPi = async (request: Parameters<ReviewModelClient['complete']>[0], images: string[], deadlineAt: number): Promise<string> => {
    if (request.signal?.aborted) throw new Error('审核已取消')
    const sdk = await (options.loadSdk ?? (() => import('@earendil-works/pi-coding-agent')))()
    let completedReviewToolAttempt = false
    const completedReviewToolKeys = new Set<string>()
    const customTools = buildPiReviewToolDefinitions(sdk, request.tools ?? [], request.onToolCall, (name, outcome) => {
      if (!request.terminateAfterTools?.includes(name)) return
      if (!outcome.ok) return
      const data = outcome.data as { toolKey?: unknown; toolKeys?: unknown[]; results?: Array<{ ok?: boolean; data?: { toolKey?: unknown; toolKeys?: unknown[] } }> } | undefined
      const items = Array.isArray(data?.results) ? data.results : [outcome]
      const accepted = items.filter((item) => 'ok' in item && item.ok === true)
      if (accepted.length > 0) completedReviewToolAttempt = true
      for (const item of accepted) {
        const itemData = 'data' in item && item.data && typeof item.data === 'object'
          ? item.data as { toolKey?: unknown; toolKeys?: unknown[] }
          : undefined
        const key = itemData?.toolKey
        if (typeof key === 'string') completedReviewToolKeys.add(key)
        const keys = itemData?.toolKeys
        if (Array.isArray(keys)) for (const nestedKey of keys) if (typeof nestedKey === 'string') completedReviewToolKeys.add(nestedKey)
      }
      const requiredKeys = request.requiredToolKeys
      if (requiredKeys?.length) return requiredKeys.every((key) => completedReviewToolKeys.has(key))
      return items.length > 0 && accepted.length === items.length
    }, request.terminateAfterTools)
    const sessionId = `review-${randomUUID()}`
    const sessionDir = mkdtempSync(join(tmpdir(), 'cdut-pi-review-'))
    let timedOut = false
    const stop = (): void => options.abort?.(sessionId)
    const onRuntimeRegistered = (): void => { if (request.signal?.aborted || timedOut) stop() }
    let rejectInterruption: ((reason: Error) => void) | undefined
    const interrupted = new Promise<never>((_resolve, reject) => { rejectInterruption = reject })
    const remainingMs = Math.max(0, deadlineAt - Date.now())
    const timeout = setTimeout(() => {
      timedOut = true
      stop()
      rejectInterruption?.(new Error(`Pi 审核 Agent 超时（${options.timeoutMs ?? 150_000} ms）`))
    }, remainingMs)
    const onAbort = (): void => {
      stop()
      const error = new Error('审核已取消')
      error.name = 'AbortError'
      rejectInterruption?.(error)
    }
    request.signal?.addEventListener('abort', onAbort, { once: true })

    try {
      const response = await Promise.race([ (async (): Promise<string> => {
        let latestResponse = ''
        for await (const message of options.query({
        sessionId,
        agentRuntime: 'pi',
        prompt: request.prompt,
        model: options.model,
        cwd: options.cwd,
        apiKey: options.apiKey,
        baseUrl: options.baseUrl,
        provider: options.channel.provider,
        channelId: options.channel.id,
        channelName: options.channel.name,
        ...(configuredModel?.context1m !== undefined && { context1m: configuredModel.context1m }),
        ...(configuredModel?.contextWindow !== undefined && { contextWindow: configuredModel.contextWindow }),
        ...(configuredModel?.maxTokens !== undefined && { maxTokens: configuredModel.maxTokens }),
        permissionMode: 'bypassPermissions',
        systemPrompt: request.system,
        piAgentDir: options.piAgentDir,
        piSessionDir: sessionDir,
        toolProfile: 'review',
        customTools,
        images,
        maxTurns: 24,
        thinkingLevel: 'off',
        onRuntimeRegistered,
        })) {
          if (request.signal?.aborted) throw new Error('审核已取消')
          if (timedOut) throw new Error(`Pi 审核 Agent 超时（${options.timeoutMs ?? 150_000} ms）`)
          const assistantText = textFromMessage(message)
          if (assistantText) latestResponse = assistantText
          if (message.type === 'result' && message.subtype !== 'success') {
            const details = 'errors' in message && Array.isArray(message.errors) ? message.errors.join('；') : message.subtype
            throw new Error(`Pi 审核 Agent 未完成：${details}`)
          }
        }
        return latestResponse
      })(), interrupted ])
      if (!response && completedReviewToolAttempt) return REVIEW_TOOL_RESULT_FALLBACK
      if (!response) throw new Error('Pi 审核 Agent 没有返回可用的结构化结果')
      if (completedReviewToolAttempt && !hasStructuredJson(response)) return REVIEW_TOOL_RESULT_FALLBACK
      return response
    } catch (error) {
      if (completedReviewToolAttempt && !request.signal?.aborted && !(error instanceof Error && error.name === 'AbortError')) {
        return REVIEW_TOOL_RESULT_FALLBACK
      }
      if (images.length === 0 && (request.terminateAfterTools?.length ?? 0) > 0 && !request.signal?.aborted && isRecoverableReviewServiceFailure(error)) {
        return REVIEW_TIMEOUT_FALLBACK
      }
      throw error
    } finally {
      request.signal?.removeEventListener('abort', onAbort)
      clearTimeout(timeout)
      rmSync(sessionDir, { recursive: true, force: true })
    }
  }

  return {
    protocol,
    runtime: 'pi',
    async complete(request) {
      const images = request.images ?? []
      const deadlineAt = Date.now() + (options.timeoutMs ?? 150_000)
      try {
        return { content: await runPi(request, images, deadlineAt), imagesDropped: false }
      } catch (error) {
        if (request.retryWithoutImages === false) throw error
        if (images.length === 0 || !isVisionCompatibilityFailure(error)) throw error
        const reason = imageFailureReason(error)
        const retryPrompt = `${request.prompt}\n\n【图像请求降级】${reason}。未被 OCR 精确读取或其他材料支持的图像事实一律待人工核对，不得根据缺失内容推定。`
        return { content: await runPi({ ...request, prompt: retryPrompt }, [], deadlineAt), imagesDropped: true, imageFailureReason: reason }
      }
    },
  }
}
