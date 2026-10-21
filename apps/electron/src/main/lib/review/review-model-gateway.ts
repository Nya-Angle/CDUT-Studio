/**
 * 统一模型网关（内容审核专区唯一模型出口）
 *
 * 安全合规核心：白名单强制 —— 只允许 REVIEW_MODEL_PROVIDERS 里的三种 provider：
 * - OpenAI 兼容线：openai / custom → `${baseUrl}/chat/completions` + Bearer
 *   （openai-responses 已移出白名单：网关只实现 chat completions 一条线，决策 #27）
 * - 本地私有线：ollama → `${baseUrl}/api/chat`（原生协议，apiKey 非空才带 Bearer）
 *
 * 其他厂商协议（anthropic/google/...）在网关入口被显式拒绝，
 * 错误文案直接使用 shared 的 REVIEW_MODEL_PROVIDER_REJECTED_NOTICE（可解释的安全叙事）。
 */

import type { Channel, ReviewContentPart, ReviewModelGatewayStatus } from '@profer/shared'
import { REVIEW_MODEL_PROVIDERS, REVIEW_MODEL_PROVIDER_REJECTED_NOTICE } from '@profer/shared'
import { decryptApiKey, listChannels } from '../channel-manager'
import { getFetchFn } from '../proxy-fetch'
import { getEffectiveProxyUrl } from '../proxy-settings-service'
import { resolveOpenAIChatCompletionsUrl } from '@profer/core'
import { getReviewModuleSettings } from './module-settings-store'
import { extractJson } from './review-json'
export { extractJson } from './review-json'

/**
 * 单次请求默认超时（60 秒）。
 *
 * 适用于大纲提取、条目识别、助手问答等中小 prompt 操作——失败要快，便于降级。
 * 审核运行（长依据 + 全部条目）由调用方显式放宽（见 REVIEW_RUN_TIMEOUT_MS）。
 */
const REQUEST_TIMEOUT_MS = 60_000

/**
 * 审核运行专用超时（150 秒）。
 *
 * 推理型模型（如 mimo 系列）在"21 块依据 + 全部条目 + 领域类型表"这类长上下文上
 * 需要超过 60 秒思考；真机实测综测案卷稳定触及 60 秒上限而降级，
 * 用 150 秒换取真实 AI 结论（UI 侧有进行中状态，用户可等待）。
 */
export const REVIEW_RUN_TIMEOUT_MS = 150_000

/** 非 2xx 响应体截断长度（避免把整页 HTML 塞进错误信息） */
const ERROR_BODY_MAX = 500

/**
 * 一条聊天消息。
 *
 * content 为字符串 = 纯文本；为内容部件数组 = 多模态（图片随文本一起送模型，D13）。
 */
export interface ReviewChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | ReviewContentPart[]
}

/** 把 V2 检查用的图像 data URL 转为审核网关的多模态消息内容。 */
export function reviewPromptWithImages(prompt: string, images: string[] = []): string | ReviewContentPart[] {
  return images.length === 0
    ? prompt
    : [{ type: 'text', text: prompt }, ...images.map((url) => ({ type: 'image_url' as const, image_url: { url } }))]
}

/** chatCompletion 可选参数 */
export interface ReviewChatOptions {
  /** 采样温度 */
  temperature?: number
  /** 最大生成 token 数 */
  maxTokens?: number
  /** 单次请求超时（缺省 60 秒；长上下文审核运行传 REVIEW_RUN_TIMEOUT_MS） */
  timeoutMs?: number
  /** 外部取消信号（08 设计：run 级取消穿透到网络请求；超时仍走内部 timer） */
  signal?: AbortSignal
  /** false 时视觉请求失败直接返回错误，不额外发起一轮丢图文本请求。 */
  retryWithoutImages?: boolean
}

/** 调用结果（含降级标记，供调用方在结论/报告里如实标注） */
export interface ReviewChatResult {
  /** 模型回复文本 */
  text: string
  /** 是否因模型不支持多模态而剔除图片后重试成功 */
  imagesDropped: boolean
  /** 服务端返回的 token 用量；用于记录按需视觉能力的真实成本。 */
  usage?: { inputTokens?: number; outputTokens?: number; cacheReadInputTokens?: number }
}

interface ReviewChatCompletionResponse {
  text: string
  usage?: ReviewChatResult['usage']
}

/** 是否有图片部件 */
function hasImageParts(messages: ReviewChatMessage[]): boolean {
  return messages.some(
    (message) => Array.isArray(message.content) && message.content.some((part) => part.type === 'image_url'),
  )
}

/** 剔除全部图片部件，仅保留文本（不支持多模态的模型重试用） */
function stripImageParts(messages: ReviewChatMessage[]): ReviewChatMessage[] {
  return messages.map((message) => {
    if (!Array.isArray(message.content)) return message
    const text = message.content
      .map((part) => (part.type === 'text' ? part.text : ''))
      .filter((chunk) => chunk.length > 0)
      .join('\n')
    return { role: message.role, content: text }
  })
}

/**
 * 判断失败是否可能由"模型不支持图片"引起（用于去图重试）。
 *
 * 只在图片存在时才有意义：HTTP 4xx/5xx 或错误文案含图片/多模态关键词即认为值得重试一次。
 */
function isMultimodalLikelyFailure(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  if (error.name === 'AbortError') return false
  if (/HTTP (400|413|415|422|500)/.test(error.message)) return true
  return /image|vision|multimodal|图片|多模态/i.test(error.message)
}

/** 把内容部件数组拆成"纯文本 + base64 图片列表"（本地私有线 ollama 的 images 字段形状） */
function splitParts(content: ReviewContentPart[]): { text: string; images: string[] } {
  const texts: string[] = []
  const images: string[] = []
  for (const part of content) {
    if (part.type === 'text') {
      texts.push(part.text)
      continue
    }
    // ollama 的 images 只接受裸 base64（不带 data URL 前缀）
    const comma = part.image_url.url.indexOf(',')
    const isDataUrl = part.image_url.url.startsWith('data:')
    images.push(isDataUrl && comma >= 0 ? part.image_url.url.slice(comma + 1) : part.image_url.url)
  }
  return { text: texts.join('\n'), images }
}

/**
 * 按出口协议转换消息形状。
 *
 * - OpenAI 兼容线：内容部件原样透传（协议本就支持 content 数组）
 * - 本地私有线（ollama /api/chat）：content 为纯文本，图片走 message.images
 */
function toProviderMessages(messages: ReviewChatMessage[], isOllama: boolean): Record<string, unknown>[] {
  if (!isOllama) return messages as unknown as Record<string, unknown>[]
  return messages.map((message) => {
    if (!Array.isArray(message.content)) return { role: message.role, content: message.content }
    const { text, images } = splitParts(message.content)
    return images.length > 0
      ? { role: message.role, content: text, images }
      : { role: message.role, content: text }
  })
}

/** 白名单判断：provider 是否为审核专区允许的出口 */
function isAllowedProvider(provider: Channel['provider']): boolean {
  return (REVIEW_MODEL_PROVIDERS as readonly string[]).includes(provider)
}

/** 去掉 baseUrl 末尾斜杠（拼接 /chat/completions、/api/chat 前统一处理） */
function trimTrailingSlash(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, '')
}

/**
 * 取白名单内的第一个可用渠道。
 *
 * 可用 = provider 在白名单内，且（models 数组非空 或 ollama——本地模型允许未登记模型清单）。
 */
function findFirstAllowedChannel(): Channel | undefined {
  const channels = listChannels()
  const configuredSelection = getReviewModuleSettings().agentModelSelection
  if (configuredSelection) {
    const selectedChannel = channels.find((channel) => channel.id === configuredSelection.channelId)
    if (!selectedChannel || !isUsableReviewChannel(selectedChannel)
      || !selectedChannel.models?.some((model) => model.id === configuredSelection.modelId && model.enabled !== false)) {
      return undefined
    }
    return selectedChannel
  }
  return channels.find(isUsableReviewChannel)
}

function isUsableReviewChannel(channel: Channel): boolean {
    if (!isAllowedProvider(channel.provider)) return false
    // 与 chat-service 一致：用户停用的渠道对审核专区同样停用（不外发任何案卷数据）
    if (channel.enabled !== true) return false
    if (channel.provider === 'ollama') return true
    return Array.isArray(channel.models) && channel.models.length > 0
}

/** 取渠道要提交给模型的 ID：优先取已启用模型；demo 不做模型选择 UI */
function firstModelId(channel: Channel): string | undefined {
  const selection = getReviewModuleSettings().agentModelSelection
  if (selection?.channelId === channel.id
    && channel.models?.some((model) => model.id === selection.modelId && model.enabled !== false)) {
    return selection.modelId
  }
  const enabled = channel.models?.find((model) => model.enabled !== false)
  return enabled?.id ?? channel.models?.[0]?.id
}

/**
 * 网关自检：当前有没有可用的模型出口。
 *
 * 供 UI 顶栏展示与 ai-service 决定真实/降级路径。
 */
export function getReviewModelGatewayStatus(): ReviewModelGatewayStatus {
  const channel = findFirstAllowedChannel()
  if (!channel) {
    const hasExplicitSelection = getReviewModuleSettings().agentModelSelection !== null
    return {
      available: false,
      protocol: 'none',
      reason: hasExplicitSelection
        ? '审核专属渠道或模型已不可用，请打开审核设置重新选择'
        : '未配置 OpenAI 兼容渠道或本地模型渠道（内容审核专区仅支持这些出口）',
    }
  }

  const modelId = firstModelId(channel)
  const isOllama = channel.provider === 'ollama'

  // ollama 渠道允许空模型清单（本机 /api/tags 动态发现），此时把 modelId 留空由调用方兜底
  if (!isOllama && !modelId) {
    return {
      available: false,
      protocol: 'none',
      reason: `渠道「${channel.name}」没有可用模型，请先在渠道设置里添加模型`,
    }
  }

  return {
    available: true,
    protocol: isOllama ? 'local-private' : 'openai-compatible',
    channelName: channel.name,
    ...(modelId ? { modelId } : {}),
  }
}

/**
 * 解析实际使用的渠道与明文 API Key。
 *
 * 网关不可用 / 渠道已不存在 → undefined（调用方据此降级，不抛错）。
 * ollama 空 key 规范为 ''（网关侧按需带哨兵/省略头）。
 */
export function resolveReviewGatewayChannel(): { channel: Channel; apiKey: string } | undefined {
  const status = getReviewModelGatewayStatus()
  if (!status.available) return undefined

  const channel = findFirstAllowedChannel()
  if (!channel) return undefined

  try {
    const apiKey = channel.provider === 'ollama' ? (decryptApiKey(channel.id) || '') : decryptApiKey(channel.id)
    return { channel, apiKey }
  } catch (error) {
    console.warn(`[审核专区] 解密渠道 API Key 失败: ${channel.name}`, error)
    return undefined
  }
}

/**
 * 统一聊天补全调用（同步等待，非流式）。
 *
 * @throws provider 不在白名单 → REVIEW_MODEL_PROVIDER_REJECTED_NOTICE
 * @throws 非 2xx → `模型请求失败: HTTP {status} {body 截断 500 字}`
 * @throws 网络错误 → 中文包装后上抛
 */
export async function chatCompletion(
  channel: Channel,
  messages: ReviewChatMessage[],
  options?: ReviewChatOptions,
): Promise<string> {
  return (await chatCompletionWithMeta(channel, messages, options)).text
}

/**
 * 同 chatCompletion，但额外返回降级信息（图片是否被剔除）。
 *
 * 图片存在时先按多模态请求；若失败疑似"模型不支持图片"，自动去图重试一次，
 * 成功则在结果里标 imagesDropped=true，调用方应据此在结论与报告中如实标注。
 */
export async function chatCompletionWithMeta(
  channel: Channel,
  messages: ReviewChatMessage[],
  options?: ReviewChatOptions,
): Promise<ReviewChatResult> {
  const withImages = hasImageParts(messages)
  try {
    const response = await performChatCompletion(channel, messages, options)
    return { ...response, imagesDropped: false }
  } catch (error) {
    if (!withImages || options?.retryWithoutImages === false || !isMultimodalLikelyFailure(error)) throw error
    console.warn(
      `[审核专区] 多模态请求失败，剔除图片后重试: ${error instanceof Error ? error.message : String(error)}`,
    )
    const response = await performChatCompletion(channel, stripImageParts(messages), options)
    return { ...response, imagesDropped: true }
  }
}

/** 实际发起一次模型请求（不含多模态降级逻辑） */
async function performChatCompletion(
  channel: Channel,
  messages: ReviewChatMessage[],
  options?: ReviewChatOptions,
): Promise<ReviewChatCompletionResponse> {
  // 白名单强制：任何调用路径都先过这道闸
  if (!isAllowedProvider(channel.provider)) {
    console.warn(`[审核专区] 已拒绝非白名单出口: ${channel.provider}（渠道 ${channel.name}）`)
    throw new Error(REVIEW_MODEL_PROVIDER_REJECTED_NOTICE)
  }

  const modelId = firstModelId(channel)
  if (!modelId) {
    throw new Error(`渠道「${channel.name}」没有可用模型，无法发起审核调用`)
  }

  const isOllama = channel.provider === 'ollama'
  const url = isOllama
    ? // 本地私有线：归一化根地址（渠道可能存了带 /v1 的地址）
      `${trimTrailingSlash(channel.baseUrl).replace(/\/v1$/, '')}/api/chat`
    : // OpenAI 兼容线：复用 core 的 URL 解析；custom 端点原样返回的语义与设置页预览（自动拼 /chat/completions）不一致，这里兜底补齐
      (() => {
        const resolved = resolveOpenAIChatCompletionsUrl(channel.baseUrl, channel.provider)
        return resolved.endsWith('/chat/completions') ? resolved : `${resolved.replace(/\/$/, '')}/chat/completions`
      })()

  let apiKey = ''
  if (!isOllama) {
    apiKey = decryptApiKey(channel.id)
  } else {
    // ollama 允许空 key（本地免鉴权），加密串解出来为空就保持空
    try {
      apiKey = decryptApiKey(channel.id) || ''
    } catch {
      apiKey = ''
    }
  }

  // 两条协议的 messages 形状不同：本地私有线把图片拆到 message.images，OpenAI 线透传内容部件
  const providerMessages = toProviderMessages(messages, isOllama)

  // 请求体：两条线都带 model/messages/stream:false；OpenAI 线额外带 temperature/max_tokens
  const body: Record<string, unknown> = isOllama
    ? { model: modelId, messages: providerMessages, stream: false }
    : {
        model: modelId,
        messages: providerMessages,
        temperature: options?.temperature ?? 0.2,
        ...(options?.maxTokens !== undefined ? { max_tokens: options.maxTokens } : {}),
        stream: false,
      }

  const headers: Record<string, string> = { 'content-type': 'application/json' }
  if (isOllama) {
    // 本地私有线：apiKey 非空时才带 Bearer（网关可能配了反代鉴权）
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`
  } else {
    headers.Authorization = `Bearer ${apiKey}`
  }

  // 代理：与 Chat/Agent 一致，尊重用户的系统/手动代理配置
  const proxyUrl = await getEffectiveProxyUrl()
  const fetchFn = getFetchFn(proxyUrl)

  const timeoutMs = options?.timeoutMs ?? REQUEST_TIMEOUT_MS
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  // 外部取消信号（run 级取消）穿透：触发即中止请求与退避等待
  const externalSignal = options?.signal
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort()
    else externalSignal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  try {
    // 429 限流重试：免费渠道并发池紧张（服务端提示 retry later），最多 3 次指数退避
    const MAX_RETRIES = 3
    for (let attempt = 0; ; attempt += 1) {
      if (externalSignal?.aborted) throw new Error('模型请求已取消')
      const response = await fetchFn(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      if (response.status === 429 && attempt < MAX_RETRIES) {
        const backoffMs = 8000 * (attempt + 1)
        console.warn(`[审核专区] 模型限流（429），${backoffMs / 1000}s 后第 ${attempt + 1} 次重试`)
        await new Promise<void>((resolve, reject) => {
          const backoffTimer = setTimeout(resolve, backoffMs)
          // 退避期间外部取消立即中止等待
          externalSignal?.addEventListener('abort', () => { clearTimeout(backoffTimer); reject(new Error('模型请求已取消')) }, { once: true })
        })
        continue
      }

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        const truncated = text.length > ERROR_BODY_MAX ? `${text.slice(0, ERROR_BODY_MAX)}…` : text
        throw new Error(`模型请求失败: HTTP ${response.status} ${truncated}`)
      }

      const data = (await response.json()) as unknown
      const usage = usageFromResponse(data)
      return { text: extractChatContent(data, isOllama), ...(usage ? { usage } : {}) }
    }
  } catch (error) {
    if (error instanceof Error && error.message === '模型请求已取消') throw error
    if (error instanceof Error && error.name === 'AbortError') {
      // 外部取消与内部超时共用 AbortController：按信号来源区分语义
      if (externalSignal?.aborted) throw new Error('模型请求已取消')
      throw new Error(`模型请求超时（超过 ${timeoutMs / 1000} 秒未响应）`)
    }
    if (error instanceof Error && error.message.startsWith('模型请求失败')) throw error
    // 网络层错误（DNS/连接被拒/证书等）包装成中文再上抛，不吞原始 cause
    console.error(`[审核专区] 模型请求失败: ${url}`, error)
    throw new Error(`模型请求失败（网络错误）: ${error instanceof Error ? error.message : String(error)}`)
  } finally {
    clearTimeout(timer)
  }
}

function usageFromResponse(value: unknown): ReviewChatResult['usage'] | undefined {
  if (!value || typeof value !== 'object' || !('usage' in value)) return undefined
  const usage = (value as { usage?: unknown }).usage
  if (!usage || typeof usage !== 'object') return undefined
  const record = usage as Record<string, unknown>
  const promptDetails = record.prompt_tokens_details && typeof record.prompt_tokens_details === 'object'
    ? record.prompt_tokens_details as Record<string, unknown>
    : record.input_tokens_details && typeof record.input_tokens_details === 'object'
      ? record.input_tokens_details as Record<string, unknown>
      : undefined
  const inputTokens = Number(record.prompt_tokens ?? record.input_tokens)
  const outputTokens = Number(record.completion_tokens ?? record.output_tokens)
  const cacheReadInputTokens = Number(record.prompt_cache_hit_tokens ?? promptDetails?.cached_tokens)
  const result = {
    ...(Number.isFinite(inputTokens) ? { inputTokens } : {}),
    ...(Number.isFinite(outputTokens) ? { outputTokens } : {}),
    ...(Number.isFinite(cacheReadInputTokens) ? { cacheReadInputTokens } : {}),
  }
  return Object.keys(result).length ? result : undefined
}

/** 从响应 JSON 中提取文本内容（两条协议形状不同） */
function extractChatContent(data: unknown, isOllama: boolean): string {
  if (!data || typeof data !== 'object') {
    throw new Error('模型响应格式异常：返回内容不是 JSON 对象')
  }

  const record = data as Record<string, unknown>

  if (isOllama) {
    // Ollama 原生：{ message: { content: "..." } }
    const message = record.message as { content?: unknown } | undefined
    const content = message?.content
    if (typeof content !== 'string') {
      throw new Error('模型响应格式异常：缺少 message.content（Ollama 协议）')
    }
    return content
  }

  // OpenAI 兼容：{ choices: [{ message: { content } }] }
  const choices = record.choices as Array<{ message?: { content?: unknown } }> | undefined
  const content = choices?.[0]?.message?.content
  if (typeof content !== 'string') {
    throw new Error('模型响应格式异常：缺少 choices[0].message.content（OpenAI 协议）')
  }
  return content
}

/**
 * 从模型输出中提取 JSON。
 *
 * 顺序：整体 JSON.parse → 剥 ```json 围栏 → 第一个 `{` 到最后一个 `}`。
 * 任何一步失败返回 undefined（调用方据此降级或重试，不伪造结果）。
 */
