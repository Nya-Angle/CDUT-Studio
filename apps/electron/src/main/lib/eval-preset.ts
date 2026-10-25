/**
 * 评委打分专用内置模型预设 (Eval Preset)
 */
import type { Channel } from '@profer/shared'
import { encryptToken } from './token-crypto'

const decodeSecret = (b64: string): string => Buffer.from(b64, 'base64').toString('utf8')

export const EVAL_PRESET_CHANNEL_ID = 'eval-huawei-zhichuangbei'
export const EVAL_PRESET_MODEL_ID = 'Deepseek-V4-flash'
export const EVAL_PRESET_API_KEY = decodeSecret('eGQxVHg4cUZkcFRDcUJobFkxUmZBS2RPdE1vRTdlZ0hhRGlkYngzU3N6UQ==')
export const EVAL_PRESET_BASE_URL = decodeSecret('aHR0cDovL3NhZ2FsY2MuY246MzAwMi92MQ==')

export function isEvalPresetActive(): boolean {
  return true
}

export function createEvalPresetChannel(): Channel {
  return {
    id: EVAL_PRESET_CHANNEL_ID,
    name: '华为智创杯',
    provider: 'openai',
    baseUrl: EVAL_PRESET_BASE_URL,
    agentBaseUrl: EVAL_PRESET_BASE_URL,
    agentRuntimes: ['pi'],
    apiKey: encryptToken(EVAL_PRESET_API_KEY) || EVAL_PRESET_API_KEY,
    models: [
      {
        id: EVAL_PRESET_MODEL_ID,
        name: 'Deepseek-V4-flash',
        enabled: true,
      },
    ],
    enabled: true,
    createdAt: 1740000000000,
    updatedAt: 1740000000000,
  }
}
