/**
 * 智联万站标签拓扑持久化单元测试（对应规格书 7.1.2）
 *
 * 覆盖：JSON 拓扑读写、损坏修复兜底（损坏时恢复默认首页）、原子写入安全性。
 */

import { afterEach, describe, expect, test } from 'bun:test'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { YanhuTabItem } from '@profer/shared'
import {
  YanhuTabsStore,
  createDefaultTabsState,
  createYanhuTab,
  normalizeStoredTabsState,
} from './yanhu-tabs-store'
import { WQXT_HOME_URL, YANHU_HOME_URL, isYanhuSsoAppUrl, stripOneTimeTicket } from './yanhu-constants'

describe('票据型 SSO 应用页的恢复语义（空白空壳根因防护）', () => {
  test('stripOneTimeTicket 剔除一次性 ticket，保留其它参数与 hash 路由', () => {
    const raw = 'https://xgfw.cdut.edu.cn/xsfw/sys/xsqjapp/*default/index.do?ticket=ST-53581-abc#/wdqj'
    const cleaned = stripOneTimeTicket(raw)
    expect(cleaned).not.toContain('ticket=')
    expect(cleaned).toContain('#/wdqj')
  })

  test('stripOneTimeTicket 保留非票据查询参数（如瑞数动态签名）', () => {
    const raw = 'https://xgfw.cdut.edu.cn/a/index.do?2eQVT8s1TNC1=1791535519157#/wdqj'
    expect(stripOneTimeTicket(raw)).toBe(raw)
  })

  test('stripOneTimeTicket 对非法/空 URL 安全回退原值', () => {
    expect(stripOneTimeTicket('')).toBe('')
    expect(stripOneTimeTicket('not a url')).toBe('not a url')
  })

  test('isYanhuSsoAppUrl 识别需要票据入口的校内应用页', () => {
    expect(isYanhuSsoAppUrl('https://xgfw.cdut.edu.cn/xsfw/sys/xsqjapp/*default/index.do#/wdqj')).toBe(true)
    expect(isYanhuSsoAppUrl('https://jw.cdut.edu.cn/jsxsd/framework/xsMainV.htmlx')).toBe(true)
    // 站内入口页本身不属于票据型应用页，恢复时应原样加载
    expect(isYanhuSsoAppUrl(YANHU_HOME_URL)).toBe(false)
    expect(isYanhuSsoAppUrl('https://www.baidu.com')).toBe(false)
  })
})

const tempRoots: string[] = []

function makeStorePath(): string {
  const root = mkdtempSync(join(tmpdir(), 'profer-yanhu-tabs-'))
  tempRoots.push(root)
  return join(root, 'nested', 'tabs.json')
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const dir = tempRoots.pop()
    if (dir) rmSync(dir, { recursive: true, force: true })
  }
})

describe('YanhuTabsStore 读写', () => {
  test('文件缺失时返回默认办事大厅首页', () => {
    const store = new YanhuTabsStore(makeStorePath())
    const state = store.load()
    expect(state.tabs).toHaveLength(1)
    expect(state.tabs[0]?.url).toBe(YANHU_HOME_URL)
    expect(state.tabs[0]?.id).toBe(state.activeTabId)
  })

  test('写入后可原样读回标签顺序与激活项（自动创建父目录）', () => {
    const filePath = makeStorePath()
    const store = new YanhuTabsStore(filePath)
    const tab1 = createYanhuTab('https://jw.cdut.edu.cn/jsxsd', '教务管理系统')
    const tab2 = createYanhuTab('https://library.cdut.edu.cn', '图书馆')
    tab2.isDormant = true
    store.save({ tabs: [tab1, tab2], activeTabId: tab2.id })

    expect(existsSync(filePath)).toBe(true)
    const loaded = store.load()
    expect(loaded.tabs.map((t) => t.url)).toEqual([tab1.url, tab2.url])
    expect(loaded.activeTabId).toBe(tab2.id)
    expect(loaded.tabs[1]?.isDormant).toBe(true)
  })

  test('落盘结构包含版本号与更新时间戳', () => {
    const filePath = makeStorePath()
    const store = new YanhuTabsStore(filePath)
    store.save(createDefaultTabsState())
    const raw = JSON.parse(readFileSync(filePath, 'utf-8')) as Record<string, unknown>
    expect(raw.version).toBe(1)
    expect(typeof raw.updatedAt).toBe('number')
    expect(Array.isArray(raw.tabs)).toBe(true)
  })
})

describe('AI 问渠学堂独立拓扑（自定义默认/保底入口）', () => {
  test('文件缺失时返回在线课程中心首页与专属标题', () => {
    const store = new YanhuTabsStore(makeStorePath(), WQXT_HOME_URL, 'AI 问渠学堂')
    const state = store.load()
    expect(state.tabs).toHaveLength(1)
    expect(state.tabs[0]?.url).toBe(WQXT_HOME_URL)
    expect(state.tabs[0]?.title).toBe('AI 问渠学堂')
    expect(state.activeTabId).toBe(state.tabs[0]?.id ?? '')
  })

  test('损坏兜底也落回在线课程中心，而非办事大厅', () => {
    const filePath = makeStorePath()
    const store = new YanhuTabsStore(filePath, WQXT_HOME_URL, 'AI 问渠学堂')
    store.save(createDefaultTabsState(WQXT_HOME_URL, 'AI 问渠学堂'))
    writeFileSync(filePath, '{ 这不是合法 JSON', 'utf-8')
    const loaded = store.load()
    expect(loaded.tabs).toHaveLength(1)
    expect(loaded.tabs[0]?.url).toBe(WQXT_HOME_URL)
  })

  test('与智联万站各自落盘、互不串写', () => {
    const expressStore = new YanhuTabsStore(makeStorePath())
    const wqxtStore = new YanhuTabsStore(makeStorePath(), WQXT_HOME_URL, 'AI 问渠学堂')
    const expressTab = createYanhuTab(YANHU_HOME_URL, '办事大厅')
    const wqxtTab = createYanhuTab(WQXT_HOME_URL, 'AI 问渠学堂')
    expressStore.save({ tabs: [expressTab], activeTabId: expressTab.id })
    wqxtStore.save({ tabs: [wqxtTab], activeTabId: wqxtTab.id })

    expect(expressStore.load().tabs.map((tab) => tab.url)).toEqual([YANHU_HOME_URL])
    expect(wqxtStore.load().tabs.map((tab) => tab.url)).toEqual([WQXT_HOME_URL])
  })
})

describe('损坏兜底与归一化', () => {
  test('主文件为非法 JSON 时回退默认首页', () => {
    const filePath = makeStorePath()
    const store = new YanhuTabsStore(filePath)
    store.save(createDefaultTabsState())
    writeFileSync(filePath, '{ 这不是合法 JSON', 'utf-8')
    const loaded = store.load()
    expect(loaded.tabs).toHaveLength(1)
    expect(loaded.tabs[0]?.url).toBe(YANHU_HOME_URL)
  })

  test('normalizeStoredTabsState：tabs 非数组回退默认', () => {
    expect(normalizeStoredTabsState({ tabs: 'oops' }).tabs).toHaveLength(1)
    expect(normalizeStoredTabsState(null).tabs).toHaveLength(1)
  })

  test('normalizeStoredTabsState：丢弃非法标签并修正失效 activeTabId', () => {
    const valid: YanhuTabItem = createYanhuTab('https://jw.cdut.edu.cn', '教务')
    const state = normalizeStoredTabsState({
      version: 1,
      activeTabId: '不存在的标签',
      tabs: [valid, { id: '', url: '' }, { id: 'x' }, null],
    })
    expect(state.tabs).toHaveLength(1)
    expect(state.tabs[0]?.id).toBe(valid.id)
    // 失效的激活项回退到首个有效标签
    expect(state.activeTabId).toBe(valid.id)
  })

  test('normalizeStoredTabsState：补齐缺失字段并复位运行时态', () => {
    const state = normalizeStoredTabsState({
      tabs: [{ id: 'tab-a', url: 'https://bsdt.cdut.edu.cn' }],
      activeTabId: 'tab-a',
    })
    const tab = state.tabs[0]
    expect(tab?.title).toBe('新标签页')
    expect(tab?.zoomFactor).toBe(1)
    expect(tab?.loading).toBe(false)
    expect(tab?.canGoBack).toBe(false)
    expect(tab?.canGoForward).toBe(false)
  })
})
