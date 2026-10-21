import { describe, expect, test } from 'bun:test'
import type { AgentSendInput } from '@profer/shared'
import { createAgentRunOutcomeReporter } from './agent-run-outcome'

type Outcome = Parameters<NonNullable<AgentSendInput['onRunOutcome']>>[0]

function fixture() {
  const outcomes: Outcome[] = []
  return { outcomes, reporter: createAgentRunOutcomeReporter(outcome => outcomes.push(outcome)) }
}

describe('Agent typed run outcome', () => {
  test('成功只在 finally 回传一次，后台 idle completion 不算终态', () => {
    const { outcomes, reporter } = fixture()
    reporter.onComplete({ backgroundTasksPending: true, resultSubtype: 'success' })
    expect(outcomes).toEqual([])
    reporter.onComplete({ resultSubtype: 'success' })
    expect(outcomes).toEqual([])
    reporter.finish()
    reporter.finish()
    expect(outcomes).toEqual([{ status: 'completed' }])
  })

  test('onError 后即使收到 success，也不能降级为 completed', () => {
    const { outcomes, reporter } = fixture()
    reporter.onError('preflight failed')
    reporter.onComplete({ resultSubtype: 'success' })
    reporter.finish()
    expect(outcomes).toEqual([{ status: 'failed', error: 'preflight failed' }])
  })

  test('异常、result subtype、resultErrors、endReason 均不能成为成功', () => {
    for (const options of [
      { resultSubtype: 'error_during_execution', resultErrors: ['provider failed'] },
      { resultSubtype: 'error_max_turns' },
      { resultSubtype: 'error_max_budget_usd' },
      { resultSubtype: 'max_tokens' },
      { resultSubtype: 'success', resultErrors: ['provider failed'] },
      { endReason: 'error' as const },
    ]) {
      const { outcomes, reporter } = fixture()
      reporter.onComplete(options)
      reporter.finish()
      expect(outcomes[0]?.status).toBe('failed')
      expect(outcomes[0]?.error).toBeTruthy()
    }
    const { outcomes, reporter } = fixture()
    reporter.onError('setup exception')
    reporter.finish()
    expect(outcomes).toEqual([{ status: 'failed', error: 'setup exception' }])
  })

  test('停止优先于早先的错误和迟到的异常', () => {
    const { outcomes, reporter } = fixture()
    reporter.onError('earlier failure')
    reporter.onComplete({ stoppedByUser: true, resultSubtype: 'error_during_execution' })
    reporter.onError('abort exception')
    reporter.finish()
    expect(outcomes).toEqual([{ status: 'stopped' }])
  })

  test('busy 拒绝不能回传任何 owner 终态', () => {
    const { outcomes, reporter } = fixture()
    reporter.rejectBeforeStart()
    reporter.finish()
    expect(outcomes).toEqual([])
  })

  test('无终态或只收到 background idle 不伪报成功', () => {
    const { outcomes, reporter } = fixture()
    reporter.onComplete({ backgroundTasksPending: true })
    reporter.finish()
    expect(outcomes[0]?.status).toBe('failed')
  })

  test('终态失败必须把真实原因（resultErrors）带给 owner，而不是只给「执行出错」标签', () => {
    // 复现真实缺陷：编排层只置 endReason=error、不传 resultErrors 时，
    // owner 拿到的 error 只有 endReasonLabel（「执行出错」），真实原因丢失，
    // 后台审核运行记录就变成不可诊断的「执行出错」。
    const watchdogReason = '模型请求 95 秒无任何数据返回（渠道：AMD Radeon，模型：GLM-5.3-Flash），本轮审核已中止。'

    const withoutErrors = fixture()
    withoutErrors.reporter.onComplete({
      resultSubtype: 'error_during_execution',
      endReason: 'error',
      endReasonLabel: '执行出错',
    })
    withoutErrors.reporter.finish()
    expect(withoutErrors.outcomes[0]).toEqual({ status: 'failed', error: '执行出错' })

    const withErrors = fixture()
    withErrors.reporter.onComplete({
      resultSubtype: 'error_during_execution',
      resultErrors: [watchdogReason],
      endReason: 'error',
      endReasonLabel: '执行出错',
    })
    withErrors.reporter.finish()
    expect(withErrors.outcomes[0]).toEqual({ status: 'failed', error: watchdogReason })
  })

  test('调用方 callback 抛错不能改变运行结果或重复回传', () => {
    let calls = 0
    const reporter = createAgentRunOutcomeReporter(() => { calls++; throw new Error('consumer error') })
    reporter.onComplete({ resultSubtype: 'success' })
    expect(() => reporter.finish()).not.toThrow()
    reporter.finish()
    expect(calls).toBe(1)
  })
})
