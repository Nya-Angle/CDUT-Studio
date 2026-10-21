import { describe, expect, test } from 'bun:test'
import type { Channel } from '@profer/shared'
import {
  eligibleReviewChannels, interpretReviewTextProbe, isReviewSelectionAvailable, selectionKey,
} from './review-first-use-readiness'

const channel = (id: string, enabled = true): Channel => ({
  id, name: id, provider: 'openai', baseUrl: 'https://example.invalid/v1', apiKey: '',
  enabled, models: [{ id: 'm1', name: '模型一', enabled: true }, { id: 'm2', name: '模型二', enabled: false }],
  createdAt: 1, updatedAt: 1,
})

describe('F01 首次审核准备与模型自检', () => {
  test('Given 全局渠道存在 When 选择审核模型 Then 仅展示兼容且启用的配置', () => {
    const disabled = channel('disabled', false)
    const agentOnly = { ...channel('agent-only'), provider: 'anthropic' as const }
    expect(eligibleReviewChannels([channel('valid'), disabled, agentOnly]).map((item) => item.id)).toEqual(['valid'])
    expect(isReviewSelectionAvailable([channel('valid')], { channelId: 'valid', modelId: 'm2' })).toBe(false)
    expect(isReviewSelectionAvailable([channel('valid')], { channelId: 'valid', modelId: 'm1' })).toBe(true)
    expect(selectionKey({ channelId: 'a', modelId: 'bc' })).not.toBe(selectionKey({ channelId: 'ab', modelId: 'c' }))
  })

  test('Given 模型回传严格 JSON When 自检 Then 记录真实请求且不猜测视觉或工具能力', () => {
    expect(interpretReviewTextProbe(
      { raw: '{"ready":"CDUT_REVIEW_PROBE"}', channelName: '已选渠道', modelId: 'm1' },
      { available: true, protocol: 'openai-compatible', channelName: '已选渠道', modelId: 'm1' },
    )).toEqual({ status: 'passed', channelName: '已选渠道', modelId: 'm1', identityConfirmed: true })
  })

  test('Given 回执型号不一致或 JSON 错误 When 自检 Then 不伪称型号或结构能力已验证', () => {
    expect(interpretReviewTextProbe(
      { raw: '{"ready":"CDUT_REVIEW_PROBE"}', channelName: '已选渠道', modelId: 'other' },
      { available: true, protocol: 'openai-compatible', channelName: '已选渠道', modelId: 'm1' },
    )).toMatchObject({ status: 'passed', identityConfirmed: false })
    expect(interpretReviewTextProbe(
      { raw: 'ok', channelName: '已选渠道', modelId: 'm1' },
      { available: true, protocol: 'openai-compatible', channelName: '已选渠道', modelId: 'm1' },
    )).toMatchObject({ status: 'failed' })
  })
})
