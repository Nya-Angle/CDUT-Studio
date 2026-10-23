/**
 * 审核模型请求身份的纯逻辑（不依赖 Electron / 渠道存储 / 设置单例）。
 *
 * 目的：网关真实请求、T01 回执、状态展示必须共用同一口径解析 modelId 与超时等待，
 * 避免「请求 B、回执写 A」的身份错配（MHI-01/02），以及退避等待吞掉总超时（MHI-10）。
 */

/** 解析该渠道本次请求实际会提交的 modelId：显式选择优先，其次第一个启用模型。 */
export function pickChannelModelId(
  channel: { id: string; models?: Array<{ id: string; enabled?: boolean }> },
  selection: { channelId: string; modelId: string } | null | undefined,
): string | undefined {
  if (selection?.channelId === channel.id
    && channel.models?.some((model) => model.id === selection.modelId && model.enabled !== false)) {
    return selection.modelId
  }
  const enabled = channel.models?.find((model) => model.enabled !== false)
  return enabled?.id ?? channel.models?.[0]?.id
}

/** 可中断的退避等待：取消或超时都会立刻结束，不会等满 backoffMs（MHI-10）。 */
export function waitForRetry(backoffMs: number, signal: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error('模型请求已取消'))
      return
    }
    const onAbort = (): void => {
      clearTimeout(timer)
      reject(new Error('模型请求已取消'))
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, backoffMs)
    signal.addEventListener('abort', onAbort, { once: true })
  })
}
