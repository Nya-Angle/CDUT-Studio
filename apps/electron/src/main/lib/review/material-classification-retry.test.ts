/**
 * 自动分类短请求重试：只重试瞬时错误，且最多一次。
 * 只测判定与重试循环次数；不把 30 秒真实超时或网关实现镜像进测试。
 */
import { describe, expect, test } from 'bun:test'
import {
  CLASSIFICATION_RETRY_DELAY_MS,
  isRetryableClassificationError,
  withSingleTransientRetry,
} from './material-classification-retry'

describe('瞬时错误判定', () => {
  test.each([
    'Error: 模型请求失败: HTTP 429 too many requests',
    'Error: 模型请求失败: HTTP 500 internal',
    'Error: 模型请求失败: HTTP 503 unavailable',
    'Error: 模型请求失败: HTTP 504 gateway timeout',
    'Error: 模型请求超时（超过 30 秒未响应）',
    'Error: fetch failed',
    'Error: read ECONNRESET',
    'Error: socket hang up',
  ])('可重试：%s', (message) => {
    expect(isRetryableClassificationError(new Error(message.replace(/^Error: /, '')))).toBe(true)
  })

  test.each([
    '模型请求失败: HTTP 400 bad request',
    '模型请求失败: HTTP 401 unauthorized',
    '模型请求失败: HTTP 403 forbidden',
    '模型请求失败: HTTP 422 unprocessable',
    'REVIEW_PREUPLOAD_DENIED: 未获授权',
    'REVIEW_MODEL_PROVIDER_REJECTED: 不在白名单',
    '模型请求已取消',
    '用户取消',
    '模型没有返回可验证的 JSON 候选',
  ])('不重试：%s', (message) => {
    expect(isRetryableClassificationError(new Error(message))).toBe(false)
  })
})

describe('至多重发一次', () => {
  const sleep = async () => {}

  test('瞬时失败后重试一次并返回第二次结果', async () => {
    let calls = 0
    const result = await withSingleTransientRetry(async () => {
      calls += 1
      if (calls === 1) throw new Error('模型请求超时（超过 30 秒未响应）')
      return 'ok'
    }, { sleep })
    expect(result).toBe('ok')
    expect(calls).toBe(2)
    expect(CLASSIFICATION_RETRY_DELAY_MS).toBe(1_000)
  })

  test('第二次仍失败只调用两次，不无限循环', async () => {
    let calls = 0
    await expect(withSingleTransientRetry(async () => {
      calls += 1
      throw new Error('模型请求失败: HTTP 503 unavailable')
    }, { sleep })).rejects.toThrow('503')
    expect(calls).toBe(2)
  })

  test('不可重试错误不产生额外请求', async () => {
    let calls = 0
    await expect(withSingleTransientRetry(async () => {
      calls += 1
      throw new Error('模型请求失败: HTTP 400 bad request')
    }, { sleep })).rejects.toThrow('400')
    expect(calls).toBe(1)
  })

  test('取消不重试且不等待退避', async () => {
    let calls = 0
    let slept = 0
    await expect(withSingleTransientRetry(async () => {
      calls += 1
      throw new Error('模型请求已取消')
    }, { sleep: async (ms) => { slept += ms } })).rejects.toThrow('取消')
    expect(calls).toBe(1)
    expect(slept).toBe(0)
  })
})
