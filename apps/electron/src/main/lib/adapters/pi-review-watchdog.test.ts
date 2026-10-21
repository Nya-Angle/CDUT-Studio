import { describe, expect, test } from 'bun:test'
import {
  DEFAULT_PI_REVIEW_FIRST_BYTE_TIMEOUT_MS,
  applyWatchdogTerminalReason,
  isWatchdogReasonRetryable,
  DEFAULT_PI_REVIEW_TURN_STALL_TIMEOUT_MS,
  createPiReviewWatchdog,
  evaluatePiReviewWatchdog,
  resolvePiReviewWatchdogTimeouts,
} from './pi-review-watchdog'

const TIMEOUTS = { firstByteTimeoutMs: 240_000, turnStallTimeoutMs: 1_200_000 }
const LABEL = '渠道：测试渠道，模型：测试模型'

describe('Pi 审核看门狗 · 阈值解析', () => {
  test('默认阈值来自导出常量', () => {
    // 显式传空 env：不读取宿主进程环境，保证断言稳定。
    const resolved = resolvePiReviewWatchdogTimeouts({ env: {} })
    expect(resolved.firstByteTimeoutMs).toBe(DEFAULT_PI_REVIEW_FIRST_BYTE_TIMEOUT_MS)
    expect(resolved.turnStallTimeoutMs).toBe(DEFAULT_PI_REVIEW_TURN_STALL_TIMEOUT_MS)
  })

  test('不传 env 时读取进程环境（E2E / 现场排障可用环境变量调阈值）', () => {
    const key = 'PROFER_PI_REVIEW_FIRST_BYTE_TIMEOUT_MS'
    const previous = process.env[key]
    process.env[key] = '45000'
    try {
      expect(resolvePiReviewWatchdogTimeouts().firstByteTimeoutMs).toBe(45_000)
    } finally {
      if (previous === undefined) delete process.env[key]
      else process.env[key] = previous
    }
  })

  test('首字节预算自动早于传输层空闲超时触发', () => {
    // 传输层 300s 空闲超时：看门狗必须更早触发，否则错误原因会被 fetch failed 抢走。
    const resolved = resolvePiReviewWatchdogTimeouts({ transportIdleTimeoutMs: 300_000 })
    expect(resolved.firstByteTimeoutMs).toBe(285_000)
    expect(resolved.firstByteTimeoutMs).toBeLessThan(300_000)
  })

  test('传输层禁用（0）时回退默认值；传输层过小时保底 30s', () => {
    expect(resolvePiReviewWatchdogTimeouts({ transportIdleTimeoutMs: 0 }).firstByteTimeoutMs)
      .toBe(DEFAULT_PI_REVIEW_FIRST_BYTE_TIMEOUT_MS)
    expect(resolvePiReviewWatchdogTimeouts({ transportIdleTimeoutMs: 10_000 }).firstByteTimeoutMs)
      .toBe(30_000)
  })

  test('环境变量可覆盖，非法值被忽略', () => {
    const resolved = resolvePiReviewWatchdogTimeouts({
      env: {
        PROFER_PI_REVIEW_FIRST_BYTE_TIMEOUT_MS: '600000',
        PROFER_PI_REVIEW_TURN_STALL_TIMEOUT_MS: '1800000',
      },
    })
    expect(resolved.firstByteTimeoutMs).toBe(600_000)
    expect(resolved.turnStallTimeoutMs).toBe(1_800_000)

    const fallback = resolvePiReviewWatchdogTimeouts({
      env: { PROFER_PI_REVIEW_FIRST_BYTE_TIMEOUT_MS: 'abc', PROFER_PI_REVIEW_TURN_STALL_TIMEOUT_MS: '-1' },
    })
    expect(fallback.firstByteTimeoutMs).toBe(DEFAULT_PI_REVIEW_FIRST_BYTE_TIMEOUT_MS)
    expect(fallback.turnStallTimeoutMs).toBe(DEFAULT_PI_REVIEW_TURN_STALL_TIMEOUT_MS)
  })
})

describe('Pi 审核看门狗 · 首字节超时', () => {
  test('请求发出后一直没有任何数据 → 判定 first_byte 并给出可诊断中文原因', () => {
    const watchdog = createPiReviewWatchdog({ label: LABEL, timeouts: TIMEOUTS })
    watchdog.startRequest(1_000)

    // 阈值内：不应触发
    expect(watchdog.evaluate(1_000 + TIMEOUTS.firstByteTimeoutMs - 1)).toBeUndefined()

    const reason = watchdog.evaluate(1_000 + TIMEOUTS.firstByteTimeoutMs)
    expect(reason).toBeDefined()
    expect(reason).toContain('无任何数据返回')
    expect(reason).toContain(LABEL)
    // 命中后不再变化，避免被后续判定覆盖成别的文案
    expect(watchdog.evaluate(1_000 + TIMEOUTS.turnStallTimeoutMs)).toBeUndefined()
    expect(watchdog.firedReason()).toBe(reason)
  })

  test('慢但持续有数据 → 不误杀（真实 GLM 渠道首字节 90s～290s 仍可完成）', () => {
    const watchdog = createPiReviewWatchdog({ label: LABEL, timeouts: TIMEOUTS })
    watchdog.startRequest(0)
    // 290 秒后才拿到响应头
    watchdog.markFirstByte(290_000)
    expect(watchdog.evaluate(290_000)).toBeUndefined()
    // 之后每 60 秒有一次流式增量
    for (let at = 350_000; at <= 1_150_000; at += 60_000) {
      watchdog.touch(at)
      expect(watchdog.evaluate(at)).toBeUndefined()
    }
    expect(watchdog.firedReason()).toBeUndefined()
  })

  test('已触发后新的请求（含原生重试）必须立刻被拒止', () => {
    const watchdog = createPiReviewWatchdog({ label: LABEL, timeouts: TIMEOUTS })
    watchdog.startRequest(0)
    expect(watchdog.evaluate(TIMEOUTS.firstByteTimeoutMs)).toBeDefined()
    expect(watchdog.startRequest(TIMEOUTS.firstByteTimeoutMs + 1)).toBe(true)
  })
})

describe('Pi 审核看门狗 · 响应头不算首字节', () => {
  test('只收到响应头（noteActivity）不能解除首字节超时', () => {
    // 兼容网关会先回响应头再长时间不吐 token；若响应头算首字节，
    // 请求级看门狗会被提前满足，轮次重新退化成无限 running。
    const watchdog = createPiReviewWatchdog({ label: LABEL, timeouts: TIMEOUTS })
    watchdog.startRequest(0)
    watchdog.noteActivity(500)
    watchdog.noteActivity(1_000)
    expect(watchdog.state.requestFirstByteSeen).toBe(false)
    const reason = watchdog.evaluate(TIMEOUTS.firstByteTimeoutMs)
    expect(reason).toBeDefined()
    expect(reason).toContain('无任何数据返回')
  })

  test('真正的内容增量（touch）才解除首字节超时', () => {
    const watchdog = createPiReviewWatchdog({ label: LABEL, timeouts: TIMEOUTS })
    watchdog.startRequest(0)
    watchdog.noteActivity(500)
    watchdog.touch(80_000)
    expect(watchdog.state.requestFirstByteSeen).toBe(true)
    expect(watchdog.evaluate(TIMEOUTS.firstByteTimeoutMs)).toBeUndefined()
  })
})

describe('Pi 审核看门狗 · 整轮无进展', () => {
  test('工具结果之后长时间无任何事件 → 判定 stalled', () => {
    const watchdog = createPiReviewWatchdog({ label: LABEL, timeouts: TIMEOUTS })
    watchdog.startRequest(0)
    watchdog.markFirstByte(2_000)
    watchdog.endRequest()
    watchdog.touch(5_000)

    expect(watchdog.evaluate(5_000 + TIMEOUTS.turnStallTimeoutMs - 1)).toBeUndefined()
    const reason = watchdog.evaluate(5_000 + TIMEOUTS.turnStallTimeoutMs)
    expect(reason).toBeDefined()
    expect(reason).toContain('无进展')
    expect(reason).toContain(LABEL)
  })

  test('多轮工具循环持续有进展时整轮看门狗不触发', () => {
    const watchdog = createPiReviewWatchdog({ label: LABEL, timeouts: TIMEOUTS })
    // 模拟 8 轮「请求 → 响应 → 工具结果」，总时长超过整轮阈值但每轮都有进展
    let at = 0
    for (let round = 0; round < 8; round += 1) {
      watchdog.startRequest(at)
      watchdog.markFirstByte(at + 90_000)
      watchdog.touch(at + 120_000)
      watchdog.endRequest()
      at += 300_000
      watchdog.touch(at)
      expect(watchdog.evaluate(at)).toBeUndefined()
    }
    expect(watchdog.firedReason()).toBeUndefined()
  })

  test('请求在途且首字节已到达但长时间无增量 → 仍判定 stalled', () => {
    const watchdog = createPiReviewWatchdog({ label: LABEL, timeouts: TIMEOUTS })
    watchdog.startRequest(0)
    watchdog.markFirstByte(1_000)
    const reason = watchdog.evaluate(1_000 + TIMEOUTS.turnStallTimeoutMs)
    expect(reason).toBeDefined()
    expect(reason).toContain('无进展')
  })
})

describe('Pi 审核看门狗 · 纯判定函数', () => {
  test('空闲态（无在途请求）同样按整轮阈值判定', () => {
    const decision = evaluatePiReviewWatchdog(
      { requestFirstByteSeen: false, lastProgressAt: 0 },
      TIMEOUTS.turnStallTimeoutMs,
      TIMEOUTS,
      LABEL,
    )
    expect(decision.kind).toBe('stalled')
  })

  test('阈值内返回 none', () => {
    const decision = evaluatePiReviewWatchdog(
      { requestFirstByteSeen: false, lastProgressAt: 0, requestStartedAt: 0 },
      TIMEOUTS.firstByteTimeoutMs - 1,
      TIMEOUTS,
      LABEL,
    )
    expect(decision.kind).toBe('none')
  })
})

describe('Pi 审核看门狗 · 终态原因', () => {
  test('把看门狗原因写进 result，subtype 变为 error_during_execution', () => {
    const result = applyWatchdogTerminalReason(
      { type: 'result', subtype: 'success', terminal_reason: 'completed', session_id: 's1' } as Record<string, unknown>,
      '模型请求 240 秒无任何数据返回（渠道：测试渠道，模型：测试模型），已中止本轮审核。',
    ) as { subtype?: string; terminal_reason?: string; errors?: string[]; session_id?: string }
    expect(result.subtype).toBe('error_during_execution')
    expect(result.terminal_reason).toBe('review_watchdog_timeout')
    expect(result.errors?.[0]).toContain('无任何数据返回')
    // 其他字段必须原样保留，避免破坏既有 result 结构
    expect(result.session_id).toBe('s1')
  })

  test('传输层 abort 文案不会覆盖看门狗原因', () => {
    const result = applyWatchdogTerminalReason(
      { type: 'result', subtype: 'error_during_execution', errors: ['Request was aborted'] } as Record<string, unknown>,
      '审核轮次 20 分钟无进展，已中止本轮审核。',
    ) as { errors?: string[] }
    expect(result.errors).toEqual(['审核轮次 20 分钟无进展，已中止本轮审核。'])
  })
})

describe('Pi 审核看门狗 · 原因不得被编排层当成可重试错误', () => {
  test('默认阈值下的两种原因都不命中可重试文案特征', () => {
    const firstByte = createPiReviewWatchdog({ label: LABEL, timeouts: TIMEOUTS })
    firstByte.startRequest(0)
    const firstByteReason = firstByte.evaluate(TIMEOUTS.firstByteTimeoutMs)!

    const stalled = createPiReviewWatchdog({ label: LABEL, timeouts: TIMEOUTS })
    stalled.startRequest(0)
    stalled.markFirstByte(1_000)
    stalled.endRequest()
    stalled.touch(2_000)
    const stalledReason = stalled.evaluate(2_000 + TIMEOUTS.turnStallTimeoutMs)!

    expect(isWatchdogReasonRetryable(firstByteReason)).toBe(false)
    expect(isWatchdogReasonRetryable(stalledReason)).toBe(false)
    // 时长按分钟表述，避免出现形如 500 的三位数被当成 5xx
    expect(firstByteReason).toContain('4 分钟')
    expect(firstByteReason).not.toContain('秒')
    expect(stalledReason).toContain('20 分钟')
  })

  test('自检本身能识别中文瞬时文案与裸 5xx', () => {
    expect(isWatchdogReasonRetryable('服务繁忙，请稍后重试')).toBe(true)
    expect(isWatchdogReasonRetryable('网关返回 502')).toBe(true)
    expect(isWatchdogReasonRetryable('overloaded')).toBe(true)
  })
})
