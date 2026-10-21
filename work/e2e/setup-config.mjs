#!/usr/bin/env node
/**
 * E2E 配置根准备脚本。
 *
 * 审核专区要求「设置里的 agentChannelId/agentModelId」与
 * 「review-module-settings 的 agentModelSelection」都指向同一个可用渠道，
 * 否则 startBackgroundPiReviewV2 会报「审核渠道或模型未配置」。
 *
 * 本脚本把真实渠道配置复制到 E2E 配置根，并启用指定的测试渠道与模型。
 * 默认使用能力较弱、更适合压测系统边界的小模型（GLM-5.3-Flash / MiMo-V2.6-Flash）。
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const CONFIG_DIR = process.env.E2E_CONFIG_DIR ?? join(HERE, 'config')
const SOURCE_CHANNELS = process.env.E2E_SOURCE_CHANNELS ?? join(process.env.HOME, '.cdutai-dev', 'channels.json')
const CHANNEL_NAME = process.env.E2E_CHANNEL_NAME ?? 'AMD Radeon'
const MODEL_ID = process.env.E2E_MODEL_ID ?? 'GLM-5.3-Flash'

mkdirSync(CONFIG_DIR, { recursive: true })

if (!existsSync(SOURCE_CHANNELS)) {
  console.error(`[E2E] 找不到渠道配置：${SOURCE_CHANNELS}`)
  process.exit(2)
}

const channels = existsSync(SOURCE_CHANNELS)
  ? JSON.parse(readFileSync(SOURCE_CHANNELS, 'utf8'))
  : { version: 1, channels: [] }

// 允许通过环境变量注入一条独立测试渠道，避免污染用户真实配置。
if (process.env.E2E_CHANNEL_BASE_URL && process.env.E2E_CHANNEL_API_KEY) {
  const injected = {
    id: process.env.E2E_CHANNEL_ID ?? 'e2e-injected-channel',
    name: CHANNEL_NAME,
    provider: 'custom',
    baseUrl: process.env.E2E_CHANNEL_BASE_URL,
    agentBaseUrl: process.env.E2E_CHANNEL_BASE_URL,
    agentRuntimes: ['pi'],
    // 明文 key 由 token-crypto 的「旧明文回退」路径直接使用，无需 safeStorage。
    apiKey: process.env.E2E_CHANNEL_API_KEY,
    models: (process.env.E2E_CHANNEL_MODELS ?? MODEL_ID).split(',').map((id) => ({ id: id.trim(), name: id.trim(), enabled: true })),
    enabled: true,
  }
  const index = channels.channels.findIndex((c) => c.id === injected.id)
  if (index >= 0) channels.channels[index] = injected
  else channels.channels.push(injected)
}

const target = channels.channels.find((channel) => channel.name === CHANNEL_NAME)
if (!target) {
  console.error(`[E2E] 渠道「${CHANNEL_NAME}」不存在；可用：${channels.channels.map((c) => c.name).join('、')}`)
  process.exit(2)
}
if (!target.models.some((model) => model.id === MODEL_ID)) {
  console.error(`[E2E] 渠道「${CHANNEL_NAME}」没有模型 ${MODEL_ID}；可用：${target.models.map((m) => m.id).join('、')}`)
  process.exit(2)
}

// 只启用目标渠道与目标模型，避免其他出口抢占
for (const channel of channels.channels) {
  channel.enabled = channel.id === target.id
  if (channel.id === target.id) {
    for (const model of channel.models) model.enabled = model.id === MODEL_ID
  }
}
writeFileSync(join(CONFIG_DIR, 'channels.json'), JSON.stringify(channels, null, 2))

// 设置层：普通 Agent 与审核专区共用同一选择
const settingsPath = join(CONFIG_DIR, 'settings.json')
const settings = existsSync(settingsPath) ? JSON.parse(readFileSync(settingsPath, 'utf8')) : {}
settings.agentChannelId = target.id
settings.agentModelId = MODEL_ID
// 关掉首次引导，否则新配置根会停在欢迎页，审核专区无法导航
settings.onboardingCompleted = true
settings.introCompleted = true
writeFileSync(settingsPath, JSON.stringify(settings, null, 2))

writeFileSync(
  join(CONFIG_DIR, 'review-module-settings.json'),
  JSON.stringify({ agentModelSelection: { channelId: target.id, modelId: MODEL_ID } }, null, 2),
)

// 设备标识：渠道 API Key 是 proferv1: AES-GCM，密钥由 deviceId 经 PBKDF2 派生。
// 配置根换了但 deviceId 必须沿用，否则解不开原有 API Key。
const sourceDevice = join(dirname(SOURCE_CHANNELS), 'device.json')
const targetDevice = join(CONFIG_DIR, 'device.json')
if (existsSync(sourceDevice) && !existsSync(targetDevice)) {
  copyFileSync(sourceDevice, targetDevice)
}

console.log(`[E2E] 配置就绪：${target.name} / ${MODEL_ID}（${target.provider}）`)
