/** MHI-01/03：run 组消费的唯一模型解析口径（不另写解析器）。 */
import { describe, expect, test } from 'bun:test'
import { pickChannelModelId } from './review-model-identity'

const channel = {
  id: 'ch-1',
  models: [
    { id: 'model-a', enabled: true },
    { id: 'model-b', enabled: true },
    { id: 'model-off', enabled: false },
  ],
}

describe('MHI-01 显式选择优先', () => {
  test('显式选 B 时必须返回 B，而不是第一个启用模型 A', () => {
    expect(pickChannelModelId(channel, { channelId: 'ch-1', modelId: 'model-b' })).toBe('model-b')
  })

  test('显式选择指向已停用模型时不静默改选，回落到首个启用模型（调用方据此判定不一致）', () => {
    expect(pickChannelModelId(channel, { channelId: 'ch-1', modelId: 'model-off' })).toBe('model-a')
  })

  test('选择属于其他渠道时不被采纳', () => {
    expect(pickChannelModelId(channel, { channelId: 'ch-2', modelId: 'model-b' })).toBe('model-a')
  })

  test('未显式选择时与网关同序：首个启用模型', () => {
    expect(pickChannelModelId(channel, null)).toBe('model-a')
    expect(pickChannelModelId(channel, undefined)).toBe('model-a')
  })

  test('空模型清单返回 undefined，由调用方如实报错而不是冒充可用', () => {
    expect(pickChannelModelId({ id: 'ch-empty', models: [] }, { channelId: 'ch-empty', modelId: 'x' })).toBeUndefined()
  })
})
