/** 审核专区独立偏好；仅持久化渠道/模型 ID，不复制或保存任何凭证。 */
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReviewModuleSettingsV2 } from '@profer/shared'
import { getConfigDir } from '../config-paths'

const DEFAULT_SETTINGS: ReviewModuleSettingsV2 = { agentModelSelection: null }

function settingsPath(): string {
  return join(getConfigDir(), 'review-module-settings.json')
}

export function getReviewModuleSettings(): ReviewModuleSettingsV2 {
  const path = settingsPath()
  if (!existsSync(path)) return DEFAULT_SETTINGS
  try {
    const value = JSON.parse(readFileSync(path, 'utf8')) as Partial<ReviewModuleSettingsV2>
    const selection = value.agentModelSelection
    if (selection === null || selection === undefined) return DEFAULT_SETTINGS
    if (typeof selection.channelId !== 'string' || !selection.channelId || typeof selection.modelId !== 'string' || !selection.modelId) {
      return DEFAULT_SETTINGS
    }
    return { agentModelSelection: { channelId: selection.channelId, modelId: selection.modelId } }
  } catch (error) {
    console.warn('[审核设置] 设置文件无法读取，使用全局 Agent 默认模型:', error)
    return DEFAULT_SETTINGS
  }
}

export function saveReviewModuleSettings(settings: ReviewModuleSettingsV2): ReviewModuleSettingsV2 {
  const path = settingsPath()
  const tempPath = `${path}.tmp`
  writeFileSync(tempPath, JSON.stringify(settings, null, 2), 'utf8')
  renameSync(tempPath, path)
  return settings
}
