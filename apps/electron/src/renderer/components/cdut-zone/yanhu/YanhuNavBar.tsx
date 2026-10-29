/**
 * YanhuNavBar —— 智联万站导航控制栏
 *
 * 组成：前进 / 后退 / 刷新 + 安全地址栏（可信绿锁标志 + 可输入） + 校内高频书签快捷胶囊。
 * 视觉：Tailwind 语义化双模配色，胶囊与阴影取代生硬边框。
 */

import * as React from 'react'
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookMarked,
  Lock,
  RotateCw,
  TriangleAlert,
  Unlock,
} from 'lucide-react'
import { YANHU_BOOKMARKS } from '@profer/shared'

interface YanhuNavBarProps {
  url: string
  canGoBack: boolean
  canGoForward: boolean
  loading: boolean
  /** 当前是否处于内置拦截页 */
  blocked: boolean
  /** 隐藏地址输入框与校内书签胶囊栏（保留多标签栏与导航按钮） */
  hideAddressBar?: boolean
  onBack: () => void
  onForward: () => void
  onReload: () => void
  onNavigate: (url: string) => void
}

/** 判定地址是否在校内可信域（用于地址栏锁标志；校内域显示可信绿锁，站外显示解锁图标） */
function isTrustedHost(rawUrl: string): boolean {
  try {
    const { hostname } = new URL(rawUrl)
    return hostname === 'cdut.edu.cn' || hostname.endsWith('.cdut.edu.cn')
  } catch {
    return false
  }
}

/** 书签连击防抖窗口：避免快速连点触发多个互相打断的导航请求（导致 ERR_ABORTED 抖动） */
const BOOKMARK_CLICK_DEBOUNCE_MS = 300

export function YanhuNavBar({
  url,
  canGoBack,
  canGoForward,
  loading,
  blocked,
  hideAddressBar = false,
  onBack,
  onForward,
  onReload,
  onNavigate,
}: YanhuNavBarProps): React.ReactElement {
  const [draft, setDraft] = React.useState(url)
  const [focused, setFocused] = React.useState(false)

  // 书签连击防抖：记录上次触发时间戳，窗口期内的重复点击直接忽略
  const lastBookmarkNavRef = React.useRef(0)

  // 仅在用户未聚焦编辑时同步外部 URL，避免打断输入
  React.useEffect(() => {
    if (!focused) setDraft(url)
  }, [url, focused])

  const trusted = isTrustedHost(url)

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    onNavigate(draft)
  }

  const handleBookmarkClick = (target: string): void => {
    const now = Date.now()
    if (now - lastBookmarkNavRef.current < BOOKMARK_CLICK_DEBOUNCE_MS) return
    lastBookmarkNavRef.current = now
    onNavigate(target)
  }

  return (
    <div className="relative flex shrink-0 items-center gap-2 border-b border-border/60 bg-card/60 px-3 py-1.5 backdrop-blur-sm titlebar-no-drag">
      <div className="flex shrink-0 items-center gap-0.5">
        <NavButton disabled={!canGoBack} onClick={onBack} title="后退">
          <ArrowLeft size={15} />
        </NavButton>
        <NavButton disabled={!canGoForward} onClick={onForward} title="前进">
          <ArrowRight size={15} />
        </NavButton>
        <NavButton onClick={onReload} title="刷新">
          <RotateCw size={15} className={loading ? 'animate-spin' : undefined} />
        </NavButton>
      </div>

      {hideAddressBar ? (
        <div className="flex-1" aria-hidden="true" />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
              {blocked ? (
                <TriangleAlert size={13} className="text-destructive" />
              ) : trusted ? (
                <Lock size={13} className="text-emerald-500" />
              ) : (
                <Unlock size={13} className="text-muted-foreground/60" />
              )}
            </span>
            <input
              type="text"
              value={draft}
              spellCheck={false}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="输入网址或域名（支持站外访问）"
              className="h-8 w-full rounded-lg border border-border/60 bg-background/70 pl-8 pr-3 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-background"
            />
          </form>

          <div className="flex shrink-0 items-center gap-1 overflow-x-auto">
            <span className="hidden items-center gap-1 text-[10px] font-medium text-muted-foreground/60 lg:flex">
              <BookMarked size={12} />
            </span>
            {YANHU_BOOKMARKS.map((bookmark) => (
              <button
                key={bookmark.id}
                type="button"
                onClick={() => handleBookmarkClick(bookmark.url)}
                className="shrink-0 rounded-full border border-border/50 bg-background/60 px-2.5 py-1 text-[11px] font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                title={bookmark.url}
              >
                {bookmark.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 实时底层诊断控制台快捷入口 */}
      <div className="flex shrink-0 items-center border-l border-border/40 pl-1.5">
        <button
          type="button"
          onClick={() => {
            void window.electronAPI?.yanhuExpress?.openDiagnosticConsole()
          }}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground cursor-pointer"
          title="打开研学浏览器底层诊断控制台（实时监控 CDP / DOM 蒸馏 / 因果边）"
        >
          <Activity size={12} className="text-primary" />
          <span className="inline">诊断控制台</span>
        </button>
      </div>

      {/* 加载进度指示：位于导航栏底边（DOM 层，不被原生页面视图遮挡） */}
      {loading ? (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/20">
          <div className="h-full w-full animate-pulse bg-primary" />
        </div>
      ) : null}
    </div>
  )
}

function NavButton({
  children,
  disabled,
  onClick,
  title,
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick: () => void
  title: string
}): React.ReactElement {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
    >
      {children}
    </button>
  )
}
