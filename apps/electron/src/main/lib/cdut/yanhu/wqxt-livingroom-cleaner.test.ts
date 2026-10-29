/**
 * AI 问渠学堂课堂教学页净化模块单元测试
 *
 * 覆盖：水印请求判定、宿主常量一致性、目标选择器完备性、注入脚本关键约束
 * （零外部特权依赖 / 防死循环 / 升级器内嵌 / 新播放器无弹幕）。
 */

import { describe, expect, test } from 'bun:test'
import { WQXT_CLASSROOM_HOSTNAME } from '@profer/shared'
import {
  WQXT_CLEANER_HOSTNAME,
  WQXT_LIVINGROOM_HIDE_SELECTORS,
  buildWqxtLivingRoomCleanerScript,
  isWqxtWatermarkRequestUrl,
} from './wqxt-livingroom-cleaner'

describe('isWqxtWatermarkRequestUrl', () => {
  test('命中问渠课堂的平铺水印请求', () => {
    expect(
      isWqxtWatermarkRequestUrl(
        'https://classroom.wqxt.cdut.edu.cn/pptnote/v1/get/course/watermark?type=tile&opacity=70',
      ),
    ).toBe(true)
  })

  test('其他域名、其他路径与非法输入不命中', () => {
    expect(isWqxtWatermarkRequestUrl('https://bsdt.cdut.edu.cn/pptnote/v1/get/course/watermark')).toBe(false)
    expect(isWqxtWatermarkRequestUrl('https://classroom.wqxt.cdut.edu.cn/pptnote/v1/get/course/other')).toBe(false)
    expect(isWqxtWatermarkRequestUrl('')).toBe(false)
    expect(isWqxtWatermarkRequestUrl('not a url')).toBe(false)
  })
})

describe('净化常量', () => {
  test('宿主常量与 @profer/shared 保持一致', () => {
    expect(WQXT_CLEANER_HOSTNAME).toBe(WQXT_CLASSROOM_HOSTNAME)
  })

  test('7 类目标选择器完整覆盖 header / 左侧目录 / 页脚 / 其他课程 / 猜你喜欢 / 水印 / 问题反馈', () => {
    expect(WQXT_LIVINGROOM_HIDE_SELECTORS).toHaveLength(7)
    for (const selector of WQXT_LIVINGROOM_HIDE_SELECTORS) expect(selector.length).toBeGreaterThan(0)
    expect(WQXT_LIVINGROOM_HIDE_SELECTORS[0]).toContain('header-wrapper-cdlg')
    expect(WQXT_LIVINGROOM_HIDE_SELECTORS[1]).toContain('relative-info-left')
    expect(WQXT_LIVINGROOM_HIDE_SELECTORS[2]).toContain('custom-footer')
    expect(WQXT_LIVINGROOM_HIDE_SELECTORS[3]).toContain('another-course-wrapper')
    expect(WQXT_LIVINGROOM_HIDE_SELECTORS[4]).toContain('p.list_title[data-v-623bb81c]')
    expect(WQXT_LIVINGROOM_HIDE_SELECTORS[4]).toContain('p.list_title:has(+ div.items-wrapper)')
    expect(WQXT_LIVINGROOM_HIDE_SELECTORS[4]).toContain('items-wrapper[data-v-623bb81c]')
    expect(WQXT_LIVINGROOM_HIDE_SELECTORS[5]).toContain('cmc-base.cmc-expand')
    expect(WQXT_LIVINGROOM_HIDE_SELECTORS[5]).toContain('/pptnote/v1/get/course/watermark')
    expect(WQXT_LIVINGROOM_HIDE_SELECTORS[6]).toContain('div.feedback-wrapper')
    expect(WQXT_LIVINGROOM_HIDE_SELECTORS[6]).toContain('div.feedback-wrapper[data-v-7689e353]')
    expect(WQXT_LIVINGROOM_HIDE_SELECTORS[6]).toContain('div.feedback-wrapper[title="问题反馈"]')
  })
})

describe('buildWqxtLivingRoomCleanerScript', () => {
  const script = buildWqxtLivingRoomCleanerScript()

  test('包含样式节点 ID、MutationObserver、物理移除与路由钩子', () => {
    expect(script).toContain('__profer-wqxt-livingroom-css')
    expect(script).toContain('MutationObserver')
    expect(script).toContain('remove()')
    expect(script).toContain('course_id')
    expect(script).toContain('pushState')
    expect(script).toContain('replaceState')
  })

  test('幂等守卫与幂等样式写入（防 Observer 自触发死循环）', () => {
    expect(script).toContain('__proferWqxtCleaner')
    expect(script).toContain('if (document.getElementById(CSS_ID)) return;')
  })

  test('含「猜你喜欢」标题的文本兜底物理移除', () => {
    expect(script).toContain('猜你喜欢')
    expect(script).toContain("hasAttribute('data-v-623bb81c')")
    expect(script).toContain('pruneGuessTitles')
  })

  test('内嵌升级器：浅色顶栏品牌文案、官方图标与 Nya Player', () => {
    expect(script).toContain('__proferWqxtUpgrader')
    expect(script).toContain('__profer-wqxt-edu-header')
    expect(script).toContain('__profer-nya-player')
    expect(script).toContain('CDUT Studio')
    expect(script).toContain('AI 问渠学堂')
    expect(script).toContain('Powered by 雫窝中央实验室 · 2026')
    expect(script).toContain('data:image/png;base64,')
    expect(script).toContain('Nya Player')
  })

  test('隐藏站点自带的旧弹幕容器与其它同级残留（允许出现 danmu-container）', () => {
    expect(script).toContain('.main_resize_con > :not(#cmcPlayer_container):not(#__profer-nya-player)')
    expect(script).toContain('danmu-container')
  })

  test('MutationObserver 监听文本节点变化（字幕 cue 更新即时刷新）', () => {
    expect(script).toContain('characterData: true')
  })

  test('新播放器不得包含任何弹幕元素与逻辑', () => {
    for (const banned of [
      '#danmu-layer',
      '#danmu-input',
      '#danmu-toggle-btn',
      'danmu-input-box',
      'sendDanmu',
      'KeyD',
      'Stats for Nerds',
    ]) {
      expect(script).not.toContain(banned)
    }
  })

  test('脚本保持零外部特权依赖，不引用 Node/Electron 特权', () => {
    expect(script).not.toContain('@profer/shared')
    expect(script).not.toContain('require(')
    expect(script).not.toContain('electron')
  })

  test('注入脚本可被解析执行（无语法错误）', () => {
    expect(() => new Function(script)).not.toThrow()
  })
})
