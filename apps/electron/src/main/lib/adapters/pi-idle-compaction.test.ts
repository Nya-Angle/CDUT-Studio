import { describe, expect, test } from 'bun:test'
import type { AgentMessage } from '@earendil-works/pi-agent-core'
import { autoCompactWhenIdle, estimatePiContextTokens } from './pi-agent-adapter'

function assistant(totalTokens: number, stopReason = 'stop', input = 0): AgentMessage {
  return {
    role: 'assistant', stopReason,
    usage: { totalTokens, input, output: 0, cacheRead: 0, cacheWrite: 0 },
  } as AgentMessage
}

function fixture(totalTokens: number, idle = true) {
  const actions: string[] = []
  const session = {
    isIdle: idle,
    agent: { state: { messages: [assistant(totalTokens)] } },
    async waitForIdle() { actions.push('idle'); this.isIdle = true },
    async compact(instructions?: string) { actions.push(instructions ?? 'compact') },
  }
  return { actions, session: session as unknown as Parameters<typeof autoCompactWhenIdle>[0]['session'] }
}

describe('上游空闲压缩与审核会话策略整合', () => {
  test('Given 最近回复已中止或 usage 为零 When 估算上下文 Then 回溯有效回复并支持分项 usage', () => {
    expect(estimatePiContextTokens([assistant(0, 'stop', 720), assistant(900, 'aborted'), assistant(0)])).toBe(720)
    expect(estimatePiContextTokens([assistant(900, 'error'), assistant(0)])).toBeUndefined()
  })

  test('Given 审核上下文超过 70% When 会话仍在执行 Then 先等待空闲并保留审核压缩指令', async () => {
    const { session, actions } = fixture(701, false)
    await autoCompactWhenIdle({ session, contextWindow: 1000, reserveTokens: 300, customInstructions: '保留审核账本与证据' })
    expect(actions).toEqual(['idle', '保留审核账本与证据'])
  })

  test('Given 尚未超过阈值 When 任务已结束 Then 不额外压缩；普通会话继续使用自身阈值', async () => {
    const { session, actions } = fixture(700)
    await autoCompactWhenIdle({ session, contextWindow: 1000, reserveTokens: 300 })
    await autoCompactWhenIdle({ session, contextWindow: 1000, reserveTokens: 200 })
    expect(actions).toEqual([])
    session.agent.state.messages = [assistant(801)]
    await autoCompactWhenIdle({ session, contextWindow: 1000, reserveTokens: 200 })
    expect(actions).toEqual(['compact'])
  })

  test('Given 压缩服务失败 When 已完成任务执行收尾 Then 不把任务改为失败', async () => {
    const { session } = fixture(900)
    session.compact = async () => { throw new Error('合成压缩失败') }
    await expect(autoCompactWhenIdle({ session, contextWindow: 1000, reserveTokens: 300 })).resolves.toBeUndefined()
  })
})
