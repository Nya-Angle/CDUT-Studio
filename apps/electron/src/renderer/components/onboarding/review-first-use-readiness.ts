import type { Channel, ReviewModelGatewayStatus, ReviewModuleSettingsV2 } from '@profer/shared'
import { REVIEW_MODEL_PROVIDERS } from '@profer/shared'

export type ReviewModelSelection = ReviewModuleSettingsV2['agentModelSelection']

/** 选择器和 Main 使用同一份白名单，不把普通 Agent 渠道误列为审核出口。 */
export function eligibleReviewChannels(channels: readonly Channel[]): Channel[] {
  return channels.filter((channel) => channel.enabled === true
    && (REVIEW_MODEL_PROVIDERS as readonly string[]).includes(channel.provider)
    && channel.models.some((model) => model.enabled !== false))
}

export function isReviewSelectionAvailable(channels: readonly Channel[], selection: ReviewModelSelection): boolean {
  if (!selection) return true
  return eligibleReviewChannels(channels).some((channel) => channel.id === selection.channelId
    && channel.models.some((model) => model.id === selection.modelId && model.enabled !== false))
}

export function selectionKey(selection: ReviewModelSelection): string {
  return selection ? `${selection.channelId}\u0000${selection.modelId}` : ''
}

export type ReviewTextProbe =
  | { status: 'passed'; channelName: string; modelId: string; identityConfirmed: boolean }
  | { status: 'failed'; reason: string }

/** 只把真实返回、格式符合约定的结果认作文本/JSON 自检通过。 */
export function interpretReviewTextProbe(
  result: { raw: string; channelName: string; modelId: string },
  gateway: ReviewModelGatewayStatus,
): ReviewTextProbe {
  try {
    const payload: unknown = JSON.parse(result.raw.trim())
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)
      || (payload as Record<string, unknown>).ready !== 'CDUT_REVIEW_PROBE') {
      return { status: 'failed', reason: '模型已响应，但没有按约定返回 JSON 自检标记。' }
    }
  } catch {
    return { status: 'failed', reason: '模型已响应，但返回内容不是有效 JSON。' }
  }

  return {
    status: 'passed',
    channelName: result.channelName,
    modelId: result.modelId,
    // Main 回执若与当时锁定的模型出口不符，只能声称“请求成功”，不能宣称特定模型通过。
    identityConfirmed: gateway.available === true
      && gateway.channelName === result.channelName
      && Boolean(gateway.modelId)
      && gateway.modelId === result.modelId,
  }
}
