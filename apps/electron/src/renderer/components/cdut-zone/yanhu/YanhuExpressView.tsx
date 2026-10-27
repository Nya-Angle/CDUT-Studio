/**
 * YanhuExpressView —— 智联万站主容器
 *
 * 结构：YanhuTabStrip（多标签栏） + YanhuNavBar（导航栏） + 原生网页视口宿主。
 * 职责：
 *   - 挂载时初始化/恢复标签拓扑，订阅主进程广播；
 *   - 测量视口几何并通过 IPC 上报，驱动主进程原生 WebContentsView 精准对齐；
 *   - 主题变更时通知主进程同步底色与网页媒体特征；
 *   - 非网页协议被拦截时改渲染 YanhuBlockedPage、主框架加载失败时改渲染 YanhuErrorPage
 *     （两种情况均由主进程隐藏底层原生视图，避免其在卡片之下露出）。
 *
 * 设计红线：界面 100% 纯净，不含任何调试 UI；底层 CDP 能力由主进程静默承载。
 */

import * as React from 'react'
import { useAtom, useAtomValue } from 'jotai'
import {
  parseYanhuBlockedTarget,
  YANHU_DEFAULT_HOME_URL,
  type YanhuLoadingChangedEvent,
  type YanhuTabsState,
  type YanhuUrlChangedEvent,
} from '@profer/shared'
import { resolvedThemeAtom } from '@/atoms/theme'
import { isGlobalOverlayActiveAtom } from '@/atoms/overlay-atoms'
import { yanhuActiveTabAtom, yanhuLoadingAtom, yanhuTabsAtom } from '@/atoms/yanhu-express-atoms'
import { coachTourCurrentStepKeyAtom, coachTourOpenAtom } from '@/atoms/coach-tour-atoms'
import { YanhuTabStrip } from './YanhuTabStrip'
import { YanhuNavBar } from './YanhuNavBar'
import { YanhuBlockedPage } from './YanhuBlockedPage'
import { YanhuErrorPage } from './YanhuErrorPage'

/** renderer 实例标识：刷新后旧实例晚到的布局必须被主进程丢弃 */
const RENDERER_INSTANCE_ID =
  globalThis.crypto?.randomUUID?.() ?? `yanhu-renderer-${Date.now()}-${Math.random().toString(36).slice(2)}`

let sourceRevision = 0
let layoutRevision = 0

function nextSourceRevision(): number {
  sourceRevision += 1
  return sourceRevision
}

function nextLayoutRevision(): number {
  layoutRevision += 1
  return layoutRevision
}

const ZERO_BOUNDS = { x: 0, y: 0, width: 0, height: 0 }

export function YanhuExpressView(): React.ReactElement {
  const [tabsState, setTabsState] = useAtom(yanhuTabsAtom)
  const [loadingMap, setLoadingMap] = useAtom(yanhuLoadingAtom)
  const activeTab = useAtomValue(yanhuActiveTabAtom)
  const resolvedTheme = useAtomValue(resolvedThemeAtom)
  // 全局模态叠加态：任一全局阻断性模态打开时，原生 WebContentsView 必须让位（见 overlay-atoms）
  const overlayActive = useAtomValue(isGlobalOverlayActiveAtom)
  const tourOpen = useAtomValue(coachTourOpenAtom)
  const tourStepKey = useAtomValue(coachTourCurrentStepKeyAtom)
  const isTourYanhu = tourOpen && tourStepKey === 'yanhu'
  const overlayActiveRef = React.useRef(overlayActive)
  overlayActiveRef.current = overlayActive

  const rootRef = React.useRef<HTMLDivElement>(null)
  const pageRef = React.useRef<HTMLDivElement>(null)

  const api = window.electronAPI.yanhuExpress

  const blockedTarget = activeTab ? parseYanhuBlockedTarget(activeTab.url) : null
  const activeError = activeTab?.error ?? null
  const enabled = !blockedTarget && !activeError
  const enabledRef = React.useRef(enabled)
  enabledRef.current = enabled

  // ===== 初始化 / 恢复 + 广播订阅 =====
  React.useEffect(() => {
    if (!api) return
    let alive = true
    const unsubTabs = api.onTabsChanged((state: YanhuTabsState) => {
      if (alive) setTabsState(state)
    })
    const unsubLoading = api.onLoadingChanged((event: YanhuLoadingChangedEvent) => {
      if (!alive) return
      setLoadingMap((prev) => ({ ...prev, [event.tabId]: event.loading }))
    })
    const unsubUrl = api.onUrlChanged((event: YanhuUrlChangedEvent) => {
      if (!alive) return
      setTabsState((prev) => ({
        ...prev,
        tabs: prev.tabs.map((tab) =>
          tab.id === event.tabId
            ? {
                ...tab,
                url: event.url,
                title: event.title,
                canGoBack: event.canGoBack,
                canGoForward: event.canGoForward,
              }
            : tab,
        ),
      }))
    })

    void api
      .initOrRestore()
      .then((state) => {
        if (alive) setTabsState(state)
        return api.showView()
      })
      .then((state) => {
        if (alive && state) setTabsState(state)
      })
      .catch(() => {
        /* 初始化失败不阻塞界面 */
      })

    return () => {
      alive = false
      unsubTabs()
      unsubLoading()
      unsubUrl()
      void api.hideView().catch(() => {})
    }
  }, [api, setTabsState, setLoadingMap])

  // ===== 主题跟随（外壳由 Tailwind 语义类响应；底层视图/媒体特征由主进程同步） =====
  React.useEffect(() => {
    if (!api) return
    void api.syncTheme({ isDark: resolvedTheme === 'dark' }).catch(() => {})
  }, [api, resolvedTheme])

  // ===== 几何测量与上报 =====
  const publishRef = React.useRef<() => void>(() => {})
  React.useEffect(() => {
    const root = rootRef.current
    const page = pageRef.current
    if (!root || !page || !api) return
    const layoutSourceRevision = nextSourceRevision()
    let raf = 0
    let pollRaf = 0
    let pollUntil = 0
    let previousKey = ''

    const publish = (force: boolean): void => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const rootRect = root.getBoundingClientRect()
        const pageRect = page.getBoundingClientRect()
        const viewportBounds = {
          x: Math.round(rootRect.x),
          y: Math.round(rootRect.y),
          width: Math.max(0, Math.round(rootRect.width)),
          height: Math.max(0, Math.round(rootRect.height)),
        }
        const pageBounds = {
          x: Math.max(0, Math.round(pageRect.x - rootRect.x)),
          y: Math.max(0, Math.round(pageRect.y - rootRect.y)),
          width: Math.max(0, Math.round(pageRect.width)),
          height: Math.max(0, Math.round(pageRect.height)),
        }
        const visible =
          enabledRef.current &&
          !overlayActiveRef.current &&
          viewportBounds.width > 4 &&
          viewportBounds.height > 4 &&
          pageBounds.width > 4 &&
          pageBounds.height > 4
        // 同步桌宠「砚小龙」视口矩形：约束在实际网页内容区域内（避免遮挡顶栏标签与地址栏）
        const petViewport = {
          x: Math.round(pageRect.x),
          y: Math.round(pageRect.y),
          width: Math.max(0, Math.round(pageRect.width)),
          height: Math.max(0, Math.round(pageRect.height)),
        }
        // 仅在本窗口实际可见时上报桌宠视口：不可见时上报会被主进程视作「几何有效」，
        // 与隐藏指令冲突（桌宠显隐必须与客户端主窗口 / 浏览器视图状态保持一致）。
        if (visible) {
          void api.petSyncViewport(petViewport).catch(() => {})
        }
        const key = [
          visible,
          viewportBounds.x, viewportBounds.y, viewportBounds.width, viewportBounds.height,
          pageBounds.x, pageBounds.y, pageBounds.width, pageBounds.height,
        ].join('|')
        if (!force && key === previousKey) return
        previousKey = key
        void api
          .updateBounds({
            rendererInstanceId: RENDERER_INSTANCE_ID,
            layoutSourceRevision,
            revision: nextLayoutRevision(),
            visible,
            viewportBounds,
            pageBounds,
          })
          .catch(() => {})
      })
    }
    publishRef.current = () => publish(true)

    // 分栏拖动/侧栏切换可能只改变位置，短暂逐帧收敛几何
    const schedulePoll = (): void => {
      pollUntil = Math.max(pollUntil, performance.now() + 600)
      if (pollRaf) return
      const poll = (): void => {
        pollRaf = 0
        publish(true)
        if (performance.now() < pollUntil) pollRaf = requestAnimationFrame(poll)
      }
      pollRaf = requestAnimationFrame(poll)
    }
    const onChange = (): void => {
      publish(true)
      schedulePoll()
    }
    // 滚动只需单帧重算几何：不能让任意子容器滚动都触发 600ms 逐帧轮询风暴
    let scrollRaf = 0
    const onScroll = (): void => {
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0
        publish(true)
      })
    }

    const resizeObserver = new ResizeObserver(onChange)
    resizeObserver.observe(root)
    resizeObserver.observe(page)
    window.addEventListener('resize', onChange)
    window.addEventListener('scroll', onScroll, true)
    publish(true)
    schedulePoll()

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', onChange)
      window.removeEventListener('scroll', onScroll, true)
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      if (raf) cancelAnimationFrame(raf)
      if (pollRaf) cancelAnimationFrame(pollRaf)
      // 卸载时立即撤走原生视图，避免其残留在窗口坐标上
      void api
        .updateBounds({
          rendererInstanceId: RENDERER_INSTANCE_ID,
          layoutSourceRevision,
          revision: nextLayoutRevision(),
          visible: false,
          viewportBounds: ZERO_BOUNDS,
          pageBounds: ZERO_BOUNDS,
        })
        .catch(() => {})
    }
  }, [api])

  // 拦截态 / 故障态 / 激活标签 / 全局模态叠加态变化 → 重新校准可见性
  // （模态打开时原生视图立即隐去、关闭时立即原位恢复，均无重载、不丢页面状态）
  React.useEffect(() => {
    publishRef.current()
  }, [enabled, tabsState.activeTabId, overlayActive, isTourYanhu])

  // ===== 操作封装 =====
  const run = React.useCallback(
    (task: () => Promise<YanhuTabsState>): void => {
      if (!api) return
      void task()
        .then((state) => setTabsState(state))
        .catch(() => {})
    },
    [api, setTabsState],
  )

  const openExternal = React.useCallback(
    (url: string): void => {
      if (!api) return
      void api.openExternal(url).catch(() => {})
    },
    [api],
  )

  return (
    <div
      ref={rootRef}
      data-yanhu-native-host
      className="flex min-h-0 flex-1 flex-col overflow-hidden bg-content-area"
    >
      <YanhuTabStrip
        tabs={tabsState.tabs}
        activeTabId={tabsState.activeTabId}
        loadingMap={loadingMap}
        onActivate={(tabId) => run(() => api.activateTab({ tabId }))}
        onClose={(tabId) => run(() => api.closeTab({ tabId }))}
        onCreate={() => run(() => api.createTab({}))}
        onReorder={(orderedTabIds) => run(() => api.reorderTabs({ orderedTabIds }))}
        onOpenMenu={(tabId) => {
          void api.showTabMenu({ tabId }).catch(() => {})
        }}
      />

      <YanhuNavBar
        url={blockedTarget ?? activeTab?.url ?? ''}
        canGoBack={!!activeTab?.canGoBack}
        canGoForward={!!activeTab?.canGoForward}
        loading={!!(activeTab && (loadingMap[activeTab.id] || activeTab.loading))}
        blocked={!!blockedTarget}
        onBack={() => run(() => api.goBack())}
        onForward={() => run(() => api.goForward())}
        onReload={() => run(() => api.reload())}
        onNavigate={(url) => run(() => api.navigate({ url }))}
      />

      <div className="relative min-h-0 flex-1 flex overflow-hidden">
        {isTourYanhu && (
          <div
            aria-hidden="true"
            className="w-[390px] shrink-0 border-r border-border/40 bg-card/40 backdrop-blur-sm"
          />
        )}
        <div data-tour="yanhu-express-stage" className="relative min-h-0 flex-1">
        {/* 原生 WebContentsView 的占位宿主：主进程按本矩形精确摆放原生视图 */}
        <div ref={pageRef} className="absolute inset-0 bg-content-area" aria-label="智联万站页面" />
        {blockedTarget ? (
          <YanhuBlockedPage
            targetUrl={blockedTarget}
            onBack={() => run(() => api.goBack())}
            onGoHome={() => run(() => api.navigate({ url: YANHU_DEFAULT_HOME_URL }))}
            onOpenExternal={openExternal}
          />
        ) : activeError ? (
          <YanhuErrorPage
            error={activeError}
            onRetry={() => {
              if (activeTab) run(() => api.retryWithClean({ tabId: activeTab.id }))
            }}
            onOpenExternal={openExternal}
          />
        ) : null}
        </div>
      </div>
    </div>
  )
}
