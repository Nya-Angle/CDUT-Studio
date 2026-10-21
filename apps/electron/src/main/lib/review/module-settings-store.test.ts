import { afterAll, describe, expect, test } from 'bun:test'
import { existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { getReviewModuleSettings, saveReviewModuleSettings } from './module-settings-store'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `review-module-settings-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

describe('审核专区独立设置', () => {
  test('默认跟随全局 Agent，保存后只存渠道与模型 ID', () => {
    expect(getReviewModuleSettings()).toEqual({ agentModelSelection: null })
    const saved = saveReviewModuleSettings({ agentModelSelection: { channelId: 'channel-a', modelId: 'model-a' } })
    expect(saved).toEqual({ agentModelSelection: { channelId: 'channel-a', modelId: 'model-a' } })
    expect(getReviewModuleSettings()).toEqual(saved)
    expect(existsSync(join(CONFIG_DIR, 'review-module-settings.json'))).toBeTrue()
  })

  test('清除审核专属模型选择后恢复跟随全局 Agent', () => {
    saveReviewModuleSettings({ agentModelSelection: { channelId: 'channel-a', modelId: 'model-a' } })
    saveReviewModuleSettings({ agentModelSelection: null })
    expect(getReviewModuleSettings()).toEqual({ agentModelSelection: null })
  })
})
