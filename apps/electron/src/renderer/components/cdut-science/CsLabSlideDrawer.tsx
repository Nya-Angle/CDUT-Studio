/**
 * CsLabSlideDrawer — 智能上下文滑出抽屉
 *
 * 普通模式默认 380px、宽屏模式默认 520px；左边缘支持拖拽调宽与双击复位，
 * 两种模式的宽度独立持久化。收起时宽度归零，内容宽度固定，避免收起过程被挤压。
 */

import * as React from 'react'
import { useAtom } from 'jotai'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { cslabDrawerNormalWidthAtom, cslabDrawerWideWidthAtom } from '@/atoms/cslab-atoms'

interface CsLabSlideDrawerProps {
  open: boolean
  title: string
  subtitle?: string
  wide?: boolean
  onClose: () => void
  children: React.ReactNode
  dataTour?: string
}

/** 抽屉宽度预设：普通 / 宽屏分别独立记忆。 */
const DRAWER_WIDTH = {
  normal: { default: 380, min: 320, max: 700 },
  wide: { default: 520, min: 440, max: 900 },
} as const

/** 视口 80% 硬性上限，避免挤压中央多分屏舞台。 */
const VIEWPORT_MAX_RATIO = 0.8

function clampDrawerWidth(width: number, wide: boolean): number {
  const preset = wide ? DRAWER_WIDTH.wide : DRAWER_WIDTH.normal
  // 无 DOM 的纯函数环境（单测/SSR）兜底 1200px，避免读取 window 报错。
  const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
  const viewportCap = Math.floor(winWidth * VIEWPORT_MAX_RATIO)
  // 先取「模式上限」与「视口上限」的较小值；小窗口下仍保证不小于模式下限。
  const upper = Math.max(preset.min, Math.min(preset.max, viewportCap))
  return Math.min(upper, Math.max(preset.min, width))
}

export function CsLabSlideDrawer({
  open,
  title,
  subtitle,
  wide = false,
  onClose,
  children,
  dataTour,
}: CsLabSlideDrawerProps): React.ReactElement {
  const [normalWidth, setNormalWidth] = useAtom(cslabDrawerNormalWidthAtom)
  const [wideWidth, setWideWidth] = useAtom(cslabDrawerWideWidthAtom)
  const storedWidth = wide ? wideWidth : normalWidth
  const setStoredWidth = wide ? setWideWidth : setNormalWidth
  // 仅在渲染期 Clamp，不回写原子，避免小窗口临时收窄永久覆盖用户偏好。
  const width = clampDrawerWidth(storedWidth, wide)
  const preset = wide ? DRAWER_WIDTH.wide : DRAWER_WIDTH.normal
  const [isResizing, setIsResizing] = React.useState(false)
  const cleanupRef = React.useRef<(() => void) | null>(null)
  // 窗口尺寸变化时强制重算视口 Clamp，避免大窗口偏好宽度在小窗口溢出 80%。
  const [, setViewportTick] = React.useState(0)

  React.useEffect(() => {
    const handleViewportResize = (): void => setViewportTick((tick) => tick + 1)
    window.addEventListener('resize', handleViewportResize)
    return () => window.removeEventListener('resize', handleViewportResize)
  }, [])

  // 拖拽期间组件若被卸载（切换实验室 / 关闭视图），兜底释放全局监听与未执行的 rAF。
  React.useEffect(() => {
    return () => {
      cleanupRef.current?.()
      cleanupRef.current = null
    }
  }, [])

  const handleResizeMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      event.preventDefault()
      event.stopPropagation()

      const startX = event.clientX
      const startWidth = width
      let latestX = startX
      let rafId = 0

      // 抽屉贴附右侧：鼠标左移（clientX 变小）意味着抽屉变宽。
      const apply = (): void => {
        setStoredWidth(clampDrawerWidth(startWidth + (startX - latestX), wide))
      }

      const onMouseMove = (moveEvent: MouseEvent): void => {
        latestX = moveEvent.clientX
        if (rafId) return
        rafId = requestAnimationFrame(() => {
          rafId = 0
          apply()
        })
      }

      const cleanup = (): void => {
        if (rafId) {
          cancelAnimationFrame(rafId)
          rafId = 0
        }
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      const onMouseUp = (): void => {
        cleanup()
        cleanupRef.current = null
        apply()
        setIsResizing(false)
      }

      cleanupRef.current = cleanup
      setIsResizing(true)
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [setStoredWidth, width, wide],
  )

  const handleResetWidth = React.useCallback((): void => {
    setStoredWidth(preset.default)
  }, [preset.default, setStoredWidth])

  return (
    <>
      <div
        aria-hidden={!open}
        data-tour={dataTour}
        className={cn(
          'relative flex h-full shrink-0 overflow-hidden border-l bg-cslab-bg',
          isResizing ? 'transition-none' : 'transition-[width] duration-[250ms] ease-out',
          open ? 'border-cslab-border' : 'border-transparent pointer-events-none',
        )}
        // 始终以内联数值驱动外壳宽度，保证 0 ↔ N 之间的过渡连贯。
        style={{ width: open ? width : 0 }}
      >
        <div className="flex h-full shrink-0 flex-col overflow-hidden" style={{ width }}>
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-cslab-border px-4 py-3">
            <div className="min-w-0">
              <h2 className="truncate font-serif text-[15px] font-medium text-cslab-text">{title}</h2>
              {subtitle && (
                <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.14em] text-cslab-muted">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="收起抽屉"
              className="shrink-0 rounded-lg p-1.5 text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
            >
              <X size={14} />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
        </div>

        {open && (
          // 8px 热区贴附内部左沿，避免负边距被 overflow-hidden 裁剪。
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="调整抽屉宽度（双击恢复默认）"
            title="拖拽调整宽度，双击恢复默认"
            onMouseDown={handleResizeMouseDown}
            onDoubleClick={handleResetWidth}
            className="group absolute inset-y-0 left-0 z-20 flex w-2.5 cursor-col-resize items-center justify-center"
          >
            <span className="h-8 w-px bg-cslab-border transition-colors group-hover:bg-cslab-accent" />
          </div>
        )}
      </div>

      {isResizing && (
        <div className="fixed inset-0 z-50 cursor-col-resize select-none" aria-hidden="true" />
      )}
    </>
  )
}
