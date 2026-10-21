/**
 * Pi 审核轮次看门狗（P0-C：失败可追踪）
 *
 * 背景：真实小模型渠道（自部署 vLLM）首字节延迟极不稳定（实测 90s～>300s）。
 * 审核轮次一旦发出请求，产品侧此前没有任何「无进展」判据：run 会长期停在
 * `running`/`accepted`，界面无法区分「模型很慢」与「链路已经挂死」。
 *
 * 本模块只负责判定，不直接改业务状态：
 * 1. 请求级首字节看门狗：一次模型请求在 N 秒内**没有收到任何数据**（既无响应头，
 *    也无任何流式增量），判定该请求已无望，给出可诊断原因；
 * 2. 整轮级无进展看门狗：从本轮开始，若 M 分钟内既没有新的模型输出，也没有新的
 *    工具结果/生命周期事件，判定整轮停滞。
 *
 * 判定结果由 Pi 适配器转成带中文原因的终态失败，绝不允许 run 无限 running。
 * 阈值可用环境变量覆盖，默认值刻意高于实测最差延迟，避免误杀真实的慢审核。
 */

/** 请求级首字节超时默认值：低于 Pi 传输层 300s 空闲超时，保证错误原因由我们给出。 */
export const DEFAULT_PI_REVIEW_FIRST_BYTE_TIMEOUT_MS = 240_000
/** 整轮无进展超时默认值：20 分钟内连一次流式增量都没有，判定停滞。 */
export const DEFAULT_PI_REVIEW_TURN_STALL_TIMEOUT_MS = 1_200_000
/** 首字节预算与传输层空闲超时之间必须留出的余量。 */
const FIRST_BYTE_SAFETY_MARGIN_MS = 15_000
/** 最小可用首字节预算，避免传输层配置过小导致看门狗一启动就触发。 */
const MIN_FIRST_BYTE_TIMEOUT_MS = 30_000

export interface PiReviewWatchdogTimeouts {
  firstByteTimeoutMs: number
  turnStallTimeoutMs: number
}

/** 读取正整数环境变量；非法值忽略，不阻断运行。 */
function readPositiveIntEnv(env: Record<string, string | undefined>, key: string): number | undefined {
  const raw = env[key]
  if (raw == null || raw.trim() === '') return undefined
  const value = Number(raw.trim())
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : undefined
}

/**
 * 解析看门狗阈值。
 * `transportIdleTimeoutMs` 是 Pi 传输层自身的空闲超时（0 表示已禁用）：
 * 首字节预算必须比它更早触发，否则错误信息会被传输层的「fetch failed」抢走。
 */
export function resolvePiReviewWatchdogTimeouts(options: {
  env?: Record<string, string | undefined>
  transportIdleTimeoutMs?: number
} = {}): PiReviewWatchdogTimeouts {
  // 默认读取进程环境：E2E 与现场排障都通过环境变量调整阈值。
  // 测试显式传 env，避免受宿主环境影响。
  const env = options.env ?? process.env
  const transport = options.transportIdleTimeoutMs
  const transportBudget = typeof transport === 'number' && transport > 0
    ? Math.max(MIN_FIRST_BYTE_TIMEOUT_MS, transport - FIRST_BYTE_SAFETY_MARGIN_MS)
    : undefined
  const firstByte = readPositiveIntEnv(env, 'PROFER_PI_REVIEW_FIRST_BYTE_TIMEOUT_MS')
    ?? transportBudget
    ?? DEFAULT_PI_REVIEW_FIRST_BYTE_TIMEOUT_MS
  const turnStall = readPositiveIntEnv(env, 'PROFER_PI_REVIEW_TURN_STALL_TIMEOUT_MS')
    ?? DEFAULT_PI_REVIEW_TURN_STALL_TIMEOUT_MS
  return { firstByteTimeoutMs: firstByte, turnStallTimeoutMs: turnStall }
}

export interface PiReviewWatchdogState {
  /** 当前在途模型请求的开始时间；无在途请求时为 undefined。 */
  requestStartedAt?: number
  /** 当前在途请求是否已收到首个数据（响应头或流式增量）。 */
  requestFirstByteSeen: boolean
  /** 最近一次任何进展（模型输出、工具事件、轮次切换）的时间戳。 */
  lastProgressAt: number
  /** 已触发的失败原因；一旦设置不再变化。 */
  firedReason?: string
}

export type PiReviewWatchdogDecision =
  | { kind: 'none' }
  | { kind: 'first_byte'; reason: string; elapsedMs: number }
  | { kind: 'stalled'; reason: string; elapsedMs: number }

export function createPiReviewWatchdogState(now: number): PiReviewWatchdogState {
  return { requestFirstByteSeen: false, lastProgressAt: now }
}

/**
 * 时长文案。
 *
 * 必须避开编排层「可重试错误」的识别特征，否则看门狗失败会被自动重试，
 * 轮次重新挂起（等于没修）：
 * - 不使用「请稍后重试」等中文瞬时文案；
 * - 2 分钟以上按分钟表述，避免出现形如 `500` 的三位数被当成 5xx 状态码。
 */
function formatDuration(ms: number): string {
  if (ms >= 120_000) return `${Math.max(1, Math.round(ms / 60_000))} 分钟`
  return `${Math.max(1, Math.round(ms / 1_000))} 秒`
}

/** 纯函数判定：便于用假时钟覆盖「超时」与「慢但不误杀」两类场景。 */
export function evaluatePiReviewWatchdog(
  state: PiReviewWatchdogState,
  now: number,
  timeouts: PiReviewWatchdogTimeouts,
  label: string,
): PiReviewWatchdogDecision {
  if (state.firedReason) return { kind: 'none' }
  if (state.requestStartedAt != null && !state.requestFirstByteSeen) {
    const elapsed = now - state.requestStartedAt
    if (elapsed >= timeouts.firstByteTimeoutMs) {
      return {
        kind: 'first_byte',
        elapsedMs: elapsed,
        reason: `模型请求 ${formatDuration(elapsed)}无任何数据返回（${label}），本轮审核已中止。请检查该渠道连通性，或更换响应更快的模型后重新发起审核。`,
      }
    }
  }
  const idle = now - state.lastProgressAt
  if (idle >= timeouts.turnStallTimeoutMs) {
    return {
      kind: 'stalled',
      elapsedMs: idle,
      reason: `审核轮次 ${formatDuration(idle)}无进展（既无新的模型输出也无工具结果，${label}），本轮审核已中止。已完成的检查与材料读取记录仍保留，可重新发起审核或转人工核验。`,
    }
  }
  return { kind: 'none' }
}

export interface PiReviewWatchdog {
  readonly state: PiReviewWatchdogState
  /** 一次模型请求开始：开始计首字节。已触发过则返回 true，调用方应立刻中止该请求。 */
  startRequest(now?: number): boolean
  /** 收到首个数据（响应头或任意流式增量）。 */
  markFirstByte(now?: number): void
  /** 记录一次进展；在途请求同时视为已开始返回数据。 */
  touch(now?: number): void
  /**
   * 只刷新进展时间，不影响「首字节」判定。
   * 请求组装（onPayload）发生在真正发出 HTTP 之前，不能算首字节。
   */
  noteActivity(now?: number): void
  /** 请求结束（成功、失败或中止）。 */
  endRequest(): void
  /** 周期判定；命中时写入 firedReason 并返回原因。 */
  evaluate(now?: number): string | undefined
  /** 已触发的原因（若有）。 */
  firedReason(): string | undefined
}

/**
 * 运行时包装：所有时间点都可注入，便于测试与对齐真实事件顺序。
 * 本对象不持有计时器，计时器由适配器负责（便于在会话清理时统一 dispose）。
 */
export function createPiReviewWatchdog(options: {
  label: string
  timeouts: PiReviewWatchdogTimeouts
  now?: () => number
  logger?: (message: string) => void
}): PiReviewWatchdog {
  const clock = options.now ?? (() => Date.now())
  const state = createPiReviewWatchdogState(clock())
  return {
    state,
    startRequest(now = clock()) {
      if (state.firedReason) return true
      state.requestStartedAt = now
      state.requestFirstByteSeen = false
      state.lastProgressAt = now
      return false
    },
    markFirstByte(now = clock()) {
      state.requestFirstByteSeen = true
      state.lastProgressAt = now
    },
    touch(now = clock()) {
      state.lastProgressAt = now
      if (state.requestStartedAt != null) state.requestFirstByteSeen = true
    },
    noteActivity(now = clock()) {
      state.lastProgressAt = now
    },
    endRequest() {
      state.requestStartedAt = undefined
      state.requestFirstByteSeen = false
    },
    evaluate(now = clock()) {
      if (state.firedReason) return undefined
      const decision = evaluatePiReviewWatchdog(state, now, options.timeouts, options.label)
      if (decision.kind === 'none') return undefined
      state.firedReason = decision.reason
      options.logger?.(`[Pi 审核看门狗] ${decision.reason}`)
      return decision.reason
    },
    firedReason() {
      return state.firedReason
    },
  }
}

/**
 * 把看门狗原因写进本轮终态 result。
 *
 * 看门狗中止请求后，传输层只会留下 `Request was aborted` 之类文案；
 * 若原样上报，产品侧看到的失败原因无法诊断。这里统一覆盖成带渠道/模型的中文原因，
 * 并把 subtype 置为 error_during_execution，保证上层落到 failed 而不是 completed。
 */
export function applyWatchdogTerminalReason<T extends Record<string, unknown>>(
  result: T,
  reason: string,
): T {
  return {
    ...result,
    subtype: 'error_during_execution',
    terminal_reason: 'review_watchdog_timeout',
    errors: [reason],
  }
}

/**
 * 自检：看门狗原因不得命中编排层「可重试错误」的文案特征。
 *
 * 一旦命中，看门狗失败会被自动重试，轮次重新挂起，等于没修。
 * 中文瞬时文案特征见 agent-retry-utils / error-patterns：
 * 服务繁忙、请求量较大、暂时无法及时响应、请稍后重试、请稍后再试，
 * 以及形如 `502` / `529` 的裸 5xx 三位数。
 */
export function isWatchdogReasonRetryable(reason: string): boolean {
  if (/服务繁忙|请求量较大|暂时无法及时响应|请稍后重试|请稍后再试/.test(reason)) return true
  if (/\b5\d{2}\b/.test(reason)) return true
  if (/\b502\b|\b529\b|overloaded|service\s+unavailable|request could not be completed/i.test(reason)) return true
  return false
}

/**
 * 把看门狗原因写进失败的 assistant 消息。
 *
 * 为什么必须做：看门狗中止请求后，Pi 会先产生一条 stopReason='error' 的 assistant
 * 消息（文案是传输层的 `terminated` / `The operation was aborted`）。编排层会把它
 * 当成「瞬时网络错误」自动重试，轮次于是重新挂起——看门狗等于没生效。
 * 这里把文案换成中文可诊断原因，同时保证它不命中可重试特征。
 */
export function applyWatchdogToAssistantError(
  message: Record<string, unknown>,
  reason: string,
): Record<string, unknown> {
  const error = message.error
  const nextError = error && typeof error === 'object'
    ? { ...(error as Record<string, unknown>), message: reason, errorType: 'review_watchdog_timeout' }
    : { message: reason, errorType: 'review_watchdog_timeout' }
  return { ...message, error: nextError }
}
