/**
 * T01 受控模型起草端口（Local-L04 R02 桥接层）。
 *
 * 渲染层只准备 prompt 文本，**模型渠道与凭据全部留在 Main**：
 * - 由 Main 解析当前审核模型网关渠道（`resolveReviewGatewayChannel`）；
 * - 复用既有 `chatCompletion`，不新建第二套 Provider 调用；
 * - 返回原始文本，由 T01 自己的 `parseT01ModelDraftResponse` 做结构与安全校验。
 *
 * 绝不在这里把模型输出当成已确认模板：解析、拒绝与人工审阅都在 T01 侧。
 */
import { resolveReviewGatewayChannel, chatCompletion, resolveReviewGatewayModelId } from './review-model-gateway'

export interface T01ModelDraftResult {
  /** 模型原始输出；未做任何业务解释 */
  raw: string
  /** Main 实际使用的渠道与模型，供界面如实展示「调用了哪个模型」 */
  channelName: string
  modelId: string
}

export interface T01ModelDraftInput {
  system: string
  user: string
}

/** 模型输出上限：模板草稿应为结构化 JSON，超长基本可判定为跑偏。 */
const T01_MAX_OUTPUT_CHARS = 60_000
/** 单次起草超时：草稿不是长审核，超过即判定为模型/渠道异常。 */
const T01_DRAFT_TIMEOUT_MS = 120_000

export async function requestT01ModelDraft(input: T01ModelDraftInput): Promise<T01ModelDraftResult> {
  const system = input?.system?.trim()
  const user = input?.user?.trim()
  if (!system || !user) throw new Error('T01_MODEL_PROMPT_REQUIRED')

  const resolved = resolveReviewGatewayChannel()
  if (!resolved) throw new Error('T01_MODEL_GATEWAY_UNAVAILABLE')

  const raw = await chatCompletion(
    resolved.channel,
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    { timeoutMs: T01_DRAFT_TIMEOUT_MS },
  )

  if (!raw || !raw.trim()) throw new Error('T01_MODEL_EMPTY_RESPONSE')
  if (raw.length > T01_MAX_OUTPUT_CHARS) throw new Error('T01_MODEL_RESPONSE_TOO_LONG')

  return {
    raw,
    channelName: resolved.channel.name,
    modelId: resolveReviewGatewayModelId(resolved.channel),
  }
}
