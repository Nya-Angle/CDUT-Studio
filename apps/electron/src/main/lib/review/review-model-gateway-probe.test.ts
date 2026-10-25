import { afterEach, describe, expect, mock, test } from 'bun:test'
import type { Channel } from '@profer/shared'

const fetchCalls: Array<{ url: string; body: string }> = []

mock.module('../channel-manager', () => ({
  decryptApiKey: () => 'test-key',
  listChannels: () => [],
}))
mock.module('../proxy-settings-service', () => ({ getEffectiveProxyUrl: async () => undefined }))
mock.module('../proxy-fetch', () => ({
  getFetchFn: () => async (url: string, init: RequestInit) => {
    fetchCalls.push({ url, body: String(init.body ?? '') })
    return new Response(JSON.stringify({ choices: [{ message: { content: '{"ready":"CDUT_REVIEW_PROBE"}' } }] }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  },
}))

const { chatCompletion, chatCompletionSyntheticProbe } = await import('./review-model-gateway')

const channel: Channel = {
  id: 'probe-test', name: 'Probe test', provider: 'openai', baseUrl: 'https://example.invalid/v1', apiKey: '',
  models: [{ id: 'mimo-v2.6-flash', name: 'mimo-v2.6-flash', enabled: true }], enabled: true,
  createdAt: 1, updatedAt: 1,
}

afterEach(() => { fetchCalls.length = 0 })

describe('审核模型固定自检探针', () => {
  test('固定探针不受材料授权源状态阻断，且只发送 Main 端固定的无材料内容', async () => {
    const response = await chatCompletionSyntheticProbe(channel)

    expect(response).toBe('{"ready":"CDUT_REVIEW_PROBE"}')
    expect(fetchCalls).toHaveLength(1)
    expect(fetchCalls[0]?.url).toBe('https://example.invalid/v1/chat/completions')
    const body = JSON.parse(fetchCalls[0]!.body) as { model: string; messages: Array<{ content: string }> }
    expect(body.model).toBe('mimo-v2.6-flash')
    expect(body.messages.map((message) => message.content).join('\n')).toContain('CDUT_REVIEW_PROBE')
    expect(body.messages.map((message) => message.content).join('\n')).not.toContain('用户材料')
  })

  test('普通模型调用在授权状态未知时发出提示后继续，材料授权提示由界面承担', async () => {
    const response = await chatCompletion(channel, [{ role: 'user', content: 'SYNTHETIC_TEST_ONLY' }])
    expect(response).toBe('{"ready":"CDUT_REVIEW_PROBE"}')
    expect(fetchCalls).toHaveLength(1)
  })
})
