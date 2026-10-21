/**
 * 统一模型网关（review-model-gateway）测试
 *
 * 被测：白名单强制（chatCompletion 对白名单外 provider 必须 throw）、
 * extractJson（剥 ```json 围栏 + 取最外层 {}）、getReviewModelGatewayStatus（无渠道 available:false）。
 *
 * 环境说明：bunfig.toml 的 [test].preload 已全局 mock electron（含 safeStorage），
 * 因此 review-model-gateway → channel-manager → token-crypto → electron 的模块链
 * 可正常加载（已实测）；本文件用隔离的 PROFER_CONFIG_DIR 保证不触碰真实用户配置。
 *
 * 覆盖点：
 * - REVIEW_MODEL_PROVIDERS 白名单常量：openai/deepseek/custom/ollama 在内，anthropic/google/openai-responses 不在（openai-responses 按决策 #27 移出）
 * - REVIEW_MODEL_PROVIDER_REJECTED_NOTICE 文案与 chatCompletion 实际 throw 完全一致
 * - 白名单外 provider（anthropic/google）在任何网络调用前即 throw
 * - extractJson：纯 JSON / ```json 围栏（含无语言标记围栏）/ 解说文字包裹的最外层 {} → 解析成功；非 JSON / 空串 → undefined
 * - 无渠道（空配置目录）时 getReviewModelGatewayStatus 返回 available:false
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import type { Channel, ProviderType } from '@profer/shared'
import { REVIEW_MODEL_PROVIDERS, REVIEW_MODEL_PROVIDER_REJECTED_NOTICE } from '@profer/shared'
import { extractJson, getReviewModelGatewayStatus, chatCompletion } from './review-model-gateway'

// ===== 隔离配置根（必须在任何调用渠道配置读取前生效）=====
// getConfigDir() / getChannelsPath() 运行时才读 env，故此赋值先于全部 test() 即可。
// 配置根由本文件位置上溯到仓库根再拼 work/tmp（与 document-service.test 同款，避免写死本机绝对路径）。
const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `profer-test-gateway-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR

afterAll(() => {
  // 测试配置目录整体清理，不在 work/tmp 留残留
  rmSync(CONFIG_DIR, { recursive: true, force: true })
})

/** 构造一个最小渠道对象（只填网关白名单判断会读到的字段） */
function buildChannel(provider: ProviderType): Channel {
  return {
    id: 'ch-test',
    name: '测试渠道',
    provider,
    baseUrl: 'https://api.example.com/v1',
    apiKey: 'test-key',
    models: [{ id: 'test-model', name: '测试模型', enabled: true }],
    enabled: true,
    createdAt: 1,
    updatedAt: 1,
  }
}

describe('模型出口白名单（REVIEW_MODEL_PROVIDERS）', () => {
  test('Given 白名单常量 When 检查内容 Then 四种允许出口在内、anthropic/google/openai-responses 不在', () => {
    // 允许：OpenAI/DeepSeek 兼容线 + 本地私有线（openai-responses 已移出：网关只实现 chat completions 一条线）
    expect(REVIEW_MODEL_PROVIDERS).toContain('openai')
    expect(REVIEW_MODEL_PROVIDERS).toContain('deepseek')
    expect(REVIEW_MODEL_PROVIDERS).toContain('custom')
    expect(REVIEW_MODEL_PROVIDERS).toContain('ollama')
    // 拒绝：其他厂商协议与未实现的协议线
    expect(REVIEW_MODEL_PROVIDERS).not.toContain('anthropic')
    expect(REVIEW_MODEL_PROVIDERS).not.toContain('google')
    expect(REVIEW_MODEL_PROVIDERS).not.toContain('openai-responses')
    // 白名单恰好四种（防误加）
    expect(REVIEW_MODEL_PROVIDERS).toHaveLength(4)
  })

  test('Given 白名单外 provider When 调用 chatCompletion Then throw 精确等于 REVIEW_MODEL_PROVIDER_REJECTED_NOTICE（且不发网络请求）', async () => {
    // 关键时序：白名单闸门在解密/发请求之前，故即使渠道 ID 不在配置文件里，
    // 也必须先 throw 白名单错误（而不是"渠道不存在"）——用 anthropic 验证。
    await expect(chatCompletion(buildChannel('anthropic'), [{ role: 'user', content: 'hi' }])).rejects.toThrow(
      REVIEW_MODEL_PROVIDER_REJECTED_NOTICE,
    )
    // 文案本身是可解释的中文安全叙事（非空且含关键信息）
    expect(REVIEW_MODEL_PROVIDER_REJECTED_NOTICE).toContain('白名单')
    expect(REVIEW_MODEL_PROVIDER_REJECTED_NOTICE).toContain('内容审核专区')
  })

  test('Given 白名单外的 google 出口 When 调用 chatCompletion Then 同样被拒绝', async () => {
    await expect(chatCompletion(buildChannel('google'), [{ role: 'user', content: 'hi' }])).rejects.toThrow(
      REVIEW_MODEL_PROVIDER_REJECTED_NOTICE,
    )
  })
})

describe('extractJson（模型输出取 JSON）', () => {
  test('Given 纯 JSON 或 ```json 围栏包裹 When 提取 Then 剥围栏返回对象', () => {
    // 1. 整体即合法 JSON
    expect(extractJson('{"a":{"b":2}}')).toEqual({ a: { b: 2 } })
    // 2. ```json ... ``` 围栏
    expect(extractJson('```json\n{"a":1}\n```')).toEqual({ a: 1 })
    // 无语言标记的 ``` 围栏同样识别
    expect(extractJson('```\n{"a":1}\n```')).toEqual({ a: 1 })
    // 数组形态（围栏内）
    expect(extractJson('```json\n[{"a":1}]\n```')).toEqual([{ a: 1 }])
  })

  test('Given JSON 前后有解说文字 When 提取 Then 取最外层 {} 内容', () => {
    expect(extractJson('前言 {"a":1} 后语')).toEqual({ a: 1 })
    // 嵌套对象取最外层大括号
    expect(extractJson('说明 {"outer":{"inner":2}} 结束')).toEqual({ outer: { inner: 2 } })
  })

  test('Given 非 JSON 或空串 When 提取 Then 返回 undefined（不伪造结果）', () => {
    expect(extractJson('不是 JSON')).toBeUndefined()
    expect(extractJson('   ')).toBeUndefined()
    // 花括号不配对（模型输出残缺）
    expect(extractJson('```json\n{"a":1\n```')).toBeUndefined()
  })
})

describe('getReviewModelGatewayStatus（无渠道自检）', () => {
  test('Given 空配置目录（无任何渠道） When 自检 Then available 为 false 且带中文 reason', () => {
    const status = getReviewModelGatewayStatus()

    expect(status.available).toBe(false)
    expect(status.protocol).toBe('none')
    expect(typeof status.reason).toBe('string')
    expect(status.reason!.length).toBeGreaterThan(0)
    // 明确告知只支持两种出口（与白名单叙事一致）
    expect(status.reason).toContain('OpenAI 兼容渠道')
    expect(status.reason).toContain('本地模型渠道')
    // 无可用出口时不暴露渠道名/模型
    expect(status.channelName).toBeUndefined()
    expect(status.modelId).toBeUndefined()
  })
})
