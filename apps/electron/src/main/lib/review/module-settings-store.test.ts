import { afterAll, describe, expect, test } from 'bun:test'
import { existsSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReviewModuleSettingsV2 } from '@profer/shared'
import { getReviewModuleSettings, saveReviewModuleSettings } from './module-settings-store'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `review-module-settings-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
const SETTINGS_FILE = join(CONFIG_DIR, 'review-module-settings.json')
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

describe('审核专区独立设置', () => {
  test('默认跟随全局 Agent，高级选项默认关闭；保存后只存渠道与模型 ID', () => {
    expect(getReviewModuleSettings()).toEqual({ agentModelSelection: null, showAdvancedOptions: false })
    const saved = saveReviewModuleSettings({ agentModelSelection: { channelId: 'channel-a', modelId: 'model-a' } })
    expect(saved).toEqual({ agentModelSelection: { channelId: 'channel-a', modelId: 'model-a' }, showAdvancedOptions: false })
    expect(getReviewModuleSettings()).toEqual(saved)
    expect(existsSync(SETTINGS_FILE)).toBeTrue()
  })

  test('清除审核专属模型选择后恢复跟随全局 Agent，高级开关保持原值', () => {
    saveReviewModuleSettings({ agentModelSelection: { channelId: 'channel-a', modelId: 'model-a' }, showAdvancedOptions: true })
    saveReviewModuleSettings({ agentModelSelection: null })
    expect(getReviewModuleSettings()).toEqual({ agentModelSelection: null, showAdvancedOptions: true })
  })

  test('旧配置文件没有 showAdvancedOptions 时默认 false，不因缺失字段丢模型', () => {
    writeFileSync(SETTINGS_FILE, JSON.stringify({ agentModelSelection: { channelId: 'legacy', modelId: 'legacy-model' } }), 'utf8')
    expect(getReviewModuleSettings()).toEqual({
      agentModelSelection: { channelId: 'legacy', modelId: 'legacy-model' }, showAdvancedOptions: false,
    })
  })

  test('保存审核模型选择时保留高级开关', () => {
    saveReviewModuleSettings({ agentModelSelection: { channelId: 'channel-b', modelId: 'model-b' }, showAdvancedOptions: true })
    const saved = saveReviewModuleSettings({ agentModelSelection: { channelId: 'channel-c', modelId: 'model-c' } })
    expect(saved.showAdvancedOptions).toBeTrue()
    expect(saved.agentModelSelection).toEqual({ channelId: 'channel-c', modelId: 'model-c' })
    expect(getReviewModuleSettings()).toEqual(saved)
  })

  test('只保存高级开关时保留已选审核模型', () => {
    saveReviewModuleSettings({ agentModelSelection: { channelId: 'channel-d', modelId: 'model-d' }, showAdvancedOptions: false })
    const saved = saveReviewModuleSettings({ showAdvancedOptions: true } as unknown as ReviewModuleSettingsV2)
    expect(saved.agentModelSelection).toEqual({ channelId: 'channel-d', modelId: 'model-d' })
    expect(saved.showAdvancedOptions).toBeTrue()
    expect(getReviewModuleSettings()).toEqual(saved)
  })

  test('非布尔高级开关在读取时按关闭处理，不污染模型选择', () => {
    writeFileSync(SETTINGS_FILE, JSON.stringify({
      agentModelSelection: { channelId: 'channel-e', modelId: 'model-e' }, showAdvancedOptions: 'yes',
    }), 'utf8')
    expect(getReviewModuleSettings()).toEqual({
      agentModelSelection: { channelId: 'channel-e', modelId: 'model-e' }, showAdvancedOptions: false,
    })
  })
})
