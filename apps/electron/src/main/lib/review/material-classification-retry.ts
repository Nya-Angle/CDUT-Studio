/**
 * 自动分类短模型请求的有限瞬时重试（只服务分类兜底，不影响其它模型调用）。
 *
 * 语义：
 * - 最多再尝试 1 次（总计 2 次），间隔约 1 秒；不提高并发、不排队重放。
 * - 仅重试瞬时故障：网络错误、超时、HTTP 429 / 5xx。
 * - 不重试：其它 4xx、门禁拒绝、用户取消、无效 JSON（无效输出由解析层返回 unresolved）。
 * 日志不写文件名与正文。
 */

export const CLASSIFICATION_RETRY_DELAY_MS = 1_000

const NO_RETRY_PATTERNS: readonly RegExp[] = [
  /abort|cancel|已取消|用户取消/i,
  /REVIEW_PREUPLOAD|门禁|不在白名单|非白名单|不允许的审核模型|REVIEW_MODEL_PROVIDER_REJECTED/i,
  /JSON|无法解析|解析失败/i,
  /HTTP (400|401|403|404|405|409|413|415|422)\b/i,
]

const RETRY_PATTERNS: readonly RegExp[] = [
  /超时|timed?\s*out|timeout/i,
  /ETIMEDOUT|ECONNRESET|ECONNREFUSED|EAI_AGAIN|ENOTFOUND|EPIPE/i,
  /socket hang up|network|fetch failed|连接重置|网络/i,
  /HTTP (429|5\d{2})\b/i,
]

function errorMessage(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`
  return typeof error === 'string' ? error : ''
}

/** 纯判定：只有瞬时故障才允许再试一次。 */
export function isRetryableClassificationError(error: unknown): boolean {
  const message = errorMessage(error)
  if (!message) return false
  if (NO_RETRY_PATTERNS.some(pattern => pattern.test(message))) return false
  return RETRY_PATTERNS.some(pattern => pattern.test(message))
}

export interface ClassificationRetryOptions {
  delayMs?: number
  sleep?: (ms: number) => Promise<void>
  onRetry?: (error: unknown) => void
}

/** 至多重发一次；第二次仍失败则抛出，绝不循环。 */
export async function withSingleTransientRetry<T>(
  run: () => Promise<T>,
  options: ClassificationRetryOptions = {},
): Promise<T> {
  try {
    return await run()
  } catch (error) {
    if (!isRetryableClassificationError(error)) throw error
    const delay = options.delayMs ?? CLASSIFICATION_RETRY_DELAY_MS
    options.onRetry?.(error)
    await (options.sleep ?? ((ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))))(delay)
    return await run()
  }
}
