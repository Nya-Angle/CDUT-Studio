import { describe, expect, test } from 'bun:test'

// 纯逻辑模块不依赖 Electron：无需 mock 运行时。
import { pickChannelModelId, waitForRetry } from './review-model-identity'
import { isAbsolutePagePath } from './system-tesseract-ocr-adapter'

describe('MHI-01/02 模型身份单一口径', () => {
  const channel = {
    id: 'ch-1',
    models: [
      { id: 'model-A', enabled: true },
      { id: 'model-B', enabled: true },
    ],
  }

  test('显式选择 B 时请求与回执都解析为 B，而不是第一个启用模型 A', () => {
    expect(pickChannelModelId(channel, { channelId: 'ch-1', modelId: 'model-B' })).toBe('model-B')
  })

  test('选择指向已停用模型时不静默复用该模型，回落第一个启用模型', () => {
    expect(pickChannelModelId(channel, { channelId: 'ch-1', modelId: 'model-A' })).toBe('model-A')
    expect(pickChannelModelId({ id: 'ch-1', models: [{ id: 'model-A', enabled: false }, { id: 'model-B', enabled: true }] },
      { channelId: 'ch-1', modelId: 'model-A' })).toBe('model-B')
  })

  test('选择属于其他渠道时不串渠道套用', () => {
    expect(pickChannelModelId(channel, { channelId: 'ch-other', modelId: 'model-B' })).toBe('model-A')
  })
})

describe('MHI-10 退避等待可被超时/取消立即中断', () => {
  test('signal 已中止时立即拒绝，不等待退避时长', async () => {
    const controller = new AbortController()
    controller.abort()
    const startedAt = Date.now()
    await expect(waitForRetry(5_000, controller.signal)).rejects.toThrow('模型请求已取消')
    expect(Date.now() - startedAt).toBeLessThan(1_000)
  })

  test('退避中途 abort 立即结束等待', async () => {
    const controller = new AbortController()
    const startedAt = Date.now()
    const pending = waitForRetry(5_000, controller.signal)
    setTimeout(() => controller.abort(), 20)
    await expect(pending).rejects.toThrow('模型请求已取消')
    expect(Date.now() - startedAt).toBeLessThan(1_000)
  })
})

describe('MHI-07 跨平台 OCR 绝对路径', () => {
  test('接受 POSIX / Windows 盘符 / UNC 绝对路径', () => {
    expect(isAbsolutePagePath('/tmp/page.png')).toBe(true)
    expect(isAbsolutePagePath('C:\\cases\\page.png')).toBe(true)
    expect(isAbsolutePagePath('D:/cases/page.png')).toBe(true)
    expect(isAbsolutePagePath('\\\\server\\share\\page.png')).toBe(true)
  })

  test('拒绝相对路径与空值', () => {
    expect(isAbsolutePagePath('page.png')).toBe(false)
    expect(isAbsolutePagePath('./page.png')).toBe(false)
    expect(isAbsolutePagePath('')).toBe(false)
  })
})
