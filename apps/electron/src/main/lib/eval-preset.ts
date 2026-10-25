/**
 * 官方 DeepSeek 内置模型预设 (Eval Preset)
 */
import type { Channel } from '@profer/shared'
import { encryptToken } from './token-crypto'

export const EVAL_PRESET_CHANNEL_ID = 'eval-deepseek-official'
export const EVAL_PRESET_MODEL_ID = 'deepseek-flash'
export const EVAL_PRESET_API_KEY = 'sk-f564d080d5aa48ca8fb011ac0346eabe'
export const EVAL_PRESET_BASE_URL = 'https://api.deepseek.com'
export const EVAL_PRESET_AGENT_BASE_URL = 'https://api.deepseek.com/anthropic'

export function isEvalPresetActive(): boolean {
  return true
}

export function createEvalPresetChannel(): Channel {
  return {
    id: EVAL_PRESET_CHANNEL_ID,
    name: 'DeepSeek 官方',
    provider: 'deepseek',
    baseUrl: EVAL_PRESET_BASE_URL,
    agentBaseUrl: EVAL_PRESET_AGENT_BASE_URL,
    agentRuntimes: ['pi'],
    apiKey: encryptToken(EVAL_PRESET_API_KEY) || EVAL_PRESET_API_KEY,
    models: [
      {
        id: EVAL_PRESET_MODEL_ID,
        name: 'DeepSeek V4.1 Flash',
        enabled: true,
      },
    ],
    enabled: true,
    createdAt: 1740000000000,
    updatedAt: 1740000000000,
  }
}
