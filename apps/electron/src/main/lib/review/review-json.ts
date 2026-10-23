/** 与审核网关共享的宽容 JSON 提取器，独立于网络/渠道配置模块。 */
export function extractJson(text: string): unknown | undefined {
  if (typeof text !== 'string' || text.trim().length === 0) return undefined
  const trimmed = text.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    // 尝试剥离 Markdown 围栏。
  }
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenceMatch?.[1]) {
    try {
      return JSON.parse(fenceMatch[1].trim())
    } catch {
      // 尝试提取首尾花括号。
    }
  }
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1))
    } catch {
      return undefined
    }
  }
  return undefined
}
