/**
 * 智联万站标签拓扑持久化（YanhuTabsStore）
 *
 * 职责：把标签顺序 / URL / 标题 / 激活项落盘到 `~/.cdutai/yanhu-express/tabs.json`，
 * 并在读取时对损坏或半损坏的数据做兜底修复（重建为默认办事大厅首页）。
 *
 * 设计约束（遵循 AGENTS.md）：本地存储优先配置文件，使用原子写入（safe-file），
 * 绝不引入本地数据库。
 */

import { existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import type { YanhuTabItem, YanhuTabsState } from '@profer/shared'
import {
  WQXT_HOME_URL,
  YANHU_HOME_URL,
  YANHU_TABS_STORE_VERSION,
  getWqxtTabsPath,
  getYanhuTabsPath,
} from './yanhu-constants'
import { readJsonFileSafe, writeJsonFileAtomic } from '../../safe-file'

/** 落盘结构契约（与规格书 4.3.1 一致） */
export interface StoredYanhuTabs {
  version: number
  activeTabId: string
  updatedAt: number
  tabs: YanhuTabItem[]
}

let tabIdSequence = 0

/** 生成稳定可读的标签 ID（时间戳 + 单调序号，杜绝同毫秒碰撞） */
export function createYanhuTabId(): string {
  tabIdSequence += 1
  return `yanhu-tab-${Date.now()}-${tabIdSequence}`
}

/**
 * 创建单个标签元数据（默认非休眠、缩放 1.0）。
 */
export function createYanhuTab(url: string = YANHU_HOME_URL, title = '新标签页'): YanhuTabItem {
  const now = Date.now()
  return {
    id: createYanhuTabId(),
    title,
    url,
    favicon: '',
    createdAt: now,
    lastActiveAt: now,
    zoomFactor: 1,
    isDormant: false,
    loading: false,
    canGoBack: false,
    canGoForward: false,
  }
}

/** 默认拓扑：单个指定首页标签并激活（默认办事大厅） */
export function createDefaultTabsState(
  defaultUrl: string = YANHU_HOME_URL,
  defaultTitle = '办事大厅',
): YanhuTabsState {
  const tab = createYanhuTab(defaultUrl, defaultTitle)
  return { tabs: [tab], activeTabId: tab.id }
}

/** 校验单条标签元数据是否可信（缺 id / url 一律丢弃） */
function isValidStoredTab(value: unknown): value is YanhuTabItem {
  if (!value || typeof value !== 'object') return false
  const tab = value as Partial<YanhuTabItem>
  return (
    typeof tab.id === 'string' &&
    tab.id.length > 0 &&
    typeof tab.url === 'string' &&
    tab.url.length > 0
  )
}

/** 归一化单条标签，补齐缺失字段并强制类型收敛 */
function normalizeStoredTab(tab: YanhuTabItem): YanhuTabItem {
  const now = Date.now()
  return {
    id: tab.id,
    title: typeof tab.title === 'string' && tab.title ? tab.title : '新标签页',
    url: tab.url,
    favicon: typeof tab.favicon === 'string' ? tab.favicon : '',
    createdAt: typeof tab.createdAt === 'number' ? tab.createdAt : now,
    lastActiveAt: typeof tab.lastActiveAt === 'number' ? tab.lastActiveAt : now,
    zoomFactor:
      typeof tab.zoomFactor === 'number' && tab.zoomFactor > 0 ? tab.zoomFactor : 1,
    isDormant: !!tab.isDormant,
    loading: false,
    canGoBack: false,
    canGoForward: false,
  }
}

/**
 * 把任意外部 JSON 归一化为可信的标签拓扑状态。
 *
 * 任意一层损坏（非对象 / tabs 非数组 / 全部标签非法）都回退到默认首页，
 * 且确保 activeTabId 一定指向存在的标签。
 */
export function normalizeStoredTabsState(
  raw: unknown,
  defaultUrl: string = YANHU_HOME_URL,
  defaultTitle = '办事大厅',
): YanhuTabsState {
  if (!raw || typeof raw !== 'object') return createDefaultTabsState(defaultUrl, defaultTitle)
  const candidate = raw as Partial<StoredYanhuTabs>
  if (!Array.isArray(candidate.tabs)) return createDefaultTabsState(defaultUrl, defaultTitle)

  const tabs = candidate.tabs.filter(isValidStoredTab).map(normalizeStoredTab)
  if (tabs.length === 0) return createDefaultTabsState(defaultUrl, defaultTitle)

  const firstTab = tabs[0]
  const fallbackActiveId = firstTab ? firstTab.id : ''
  const activeTabId =
    typeof candidate.activeTabId === 'string' && tabs.some((t) => t.id === candidate.activeTabId)
      ? candidate.activeTabId
      : fallbackActiveId

  return { tabs, activeTabId }
}

/**
 * 智联万站标签拓扑持久化服务。
 *
 * 默认写入 `~/.cdutai/yanhu-express/tabs.json`；测试可注入自定义路径。
 */
export class YanhuTabsStore {
  private readonly filePath: string
  /** 缺省/损坏时的兜底首页地址 */
  private readonly homeUrl: string
  /** 缺省/损坏时的兜底首页标题 */
  private readonly homeTitle: string

  constructor(
    filePath: string = getYanhuTabsPath(),
    homeUrl: string = YANHU_HOME_URL,
    homeTitle = '办事大厅',
  ) {
    this.filePath = filePath
    this.homeUrl = homeUrl
    this.homeTitle = homeTitle
  }

  /** 读取并归一化落盘拓扑；文件缺失或损坏时返回默认首页拓扑 */
  public load(): YanhuTabsState {
    try {
      if (!existsSync(this.filePath)) return createDefaultTabsState(this.homeUrl, this.homeTitle)
      const raw = readJsonFileSafe<StoredYanhuTabs>(this.filePath)
      return normalizeStoredTabsState(raw, this.homeUrl, this.homeTitle)
    } catch (err) {
      console.warn('[智联万站] 读取标签拓扑失败，回退默认首页:', err)
      return createDefaultTabsState(this.homeUrl, this.homeTitle)
    }
  }

  /** 原子写入标签拓扑（自动创建父目录并保留 .bak 备份） */
  public save(state: YanhuTabsState): void {
    try {
      const dir = dirname(this.filePath)
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

      // 落盘时剥离纯运行时态（loading / canGoBack / canGoForward），保持文件精简且语义稳定
      const tabs: YanhuTabItem[] = state.tabs.map((tab) => ({
        id: tab.id,
        title: tab.title,
        url: tab.url,
        favicon: tab.favicon ?? '',
        createdAt: tab.createdAt,
        lastActiveAt: tab.lastActiveAt,
        zoomFactor: tab.zoomFactor,
        isDormant: tab.isDormant,
      }))

      const payload: StoredYanhuTabs = {
        version: YANHU_TABS_STORE_VERSION,
        activeTabId: state.activeTabId,
        updatedAt: Date.now(),
        tabs,
      }
      writeJsonFileAtomic(this.filePath, payload)
    } catch (err) {
      console.error('[智联万站] 写入标签拓扑失败:', err)
    }
  }
}

/** 全局单例（默认路径） */
export const yanhuTabsStore = new YanhuTabsStore()

/** AI 问渠学堂专属拓扑存储实例（独立落盘文件，默认/保底为在线课程中心） */
export const wqxtTabsStore = new YanhuTabsStore(getWqxtTabsPath(), WQXT_HOME_URL, 'AI 问渠学堂')
