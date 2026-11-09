/**
 * @profer/ui/mindmap-renderer — 对话流与富文本 ```mindmap 专用卡片组件
 *
 * 契约：
 *   - 气泡内（对话卡片）：交互式画布 —— 滚轮缩放、拖拽平移、工具栏
 *     （放大 / 缩小 / 复位 / 复制源码 / 展开大图）；点击图面（非拖拽）直接展开全屏。
 *   - 展开大图：全屏 Radix Dialog 视窗 + 鸟瞰小地图 + 气泡自由拖拽调整布局。
 *   - 状态留存：拖拽坐标暂存于内存级 Map（按代码块指纹键控），客户端退出后自动释放。
 */

import * as React from 'react'
import { Check, Copy, Maximize2, Minus, Plus, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { parseMindMapText } from '@profer/shared'
import {
  MINDMAP_ZOOM_MAX,
  MINDMAP_ZOOM_MIN,
  MindMapCanvas,
  MindMapFullscreenModal,
  buildMindMapScene,
  useMindMapViewport,
  type MindMapPt,
} from './MindMapRenderer.tsx'

const BUBBLE_VIEWPORT_HEIGHT = 260

/** 内存级坐标留存：按代码块指纹键控，客户端退出后随进程自动清空 */
const memoryPositions = new Map<string, Record<string, MindMapPt>>()

/** 轻量指纹：与页面 DOM 无关，仅用于标识同一段代码块 */
function codeFingerprint(code: string): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < code.length; i++) {
    hash ^= code.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36)
}

export interface MindMapBlockProps {
  code: string
  isStreaming?: boolean
  onOverlayLifecycleChange?: (active: boolean) => void
}

export function MindMapBlock({ code, onOverlayLifecycleChange }: MindMapBlockProps): React.ReactElement | null {
  const root = React.useMemo(() => parseMindMapText(code), [code])
  const fingerprint = React.useMemo(() => codeFingerprint(code), [code])
  const [overrides, setOverrides] = React.useState<Record<string, MindMapPt>>(() => memoryPositions.get(codeFingerprint(code)) ?? {})
  const [open, setOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const scene = React.useMemo(() => (root ? buildMindMapScene(root, overrides) : null), [root, overrides])
  const viewport = useMindMapViewport(scene?.width ?? 0, scene?.height ?? 0)

  const persist = React.useCallback(
    (next: Record<string, MindMapPt>) => {
      memoryPositions.set(fingerprint, next)
    },
    [fingerprint],
  )

  const zoomByFactor = React.useCallback(
    (factor: number): void => {
      const rect = viewport.viewportRef.current?.getBoundingClientRect()
      const cx = rect ? rect.width / 2 : 0
      const cy = rect ? rect.height / 2 : 0
      viewport.setZoom((prevZoom) => Math.min(MINDMAP_ZOOM_MAX, Math.max(MINDMAP_ZOOM_MIN, prevZoom * factor)))
      viewport.setPan((prevPan) => {
        const prevZoom = viewport.zoom
        const nextZoom = Math.min(MINDMAP_ZOOM_MAX, Math.max(MINDMAP_ZOOM_MIN, prevZoom * factor))
        const k = nextZoom / prevZoom
        return { x: cx - k * (cx - prevPan.x), y: cy - k * (cy - prevPan.y) }
      })
    },
    [viewport],
  )

  const handleCopy = React.useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('复制失败')
    }
  }, [code])

  const pressRef = React.useRef<{ x: number; y: number; moved: boolean } | null>(null)
  const onViewportPointerDown = React.useCallback(
    (event: React.PointerEvent): void => {
      if (event.button !== 0) return
      pressRef.current = { x: event.clientX, y: event.clientY, moved: false }
      viewport.beginPan(event)
    },
    [viewport],
  )
  const onViewportPointerMove = React.useCallback(
    (event: React.PointerEvent): void => {
      const press = pressRef.current
      if (press && (Math.abs(event.clientX - press.x) > 3 || Math.abs(event.clientY - press.y) > 3)) {
        press.moved = true
      }
      viewport.movePan(event)
    },
    [viewport],
  )
  const onViewportPointerUp = React.useCallback((): void => {
    const press = pressRef.current
    pressRef.current = null
    viewport.endPan()
    if (press && !press.moved) setOpen(true)
  }, [viewport])

  if (!root || !scene) return null

  const iconButton =
    'flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground'

  return (
    <div className="my-2 overflow-hidden rounded-xl border border-border/60 bg-muted/20">
      <div className="flex items-center justify-between border-b border-border/50 px-2 py-1">
        <span className="inline-flex min-w-0 items-center gap-1.5 px-1 text-[11px] font-medium text-foreground">
          🗺️ 思维导图
          <span className="hidden text-[10px] font-normal text-muted-foreground sm:inline">（滚轮缩放 · 拖拽平移 · 点击放大）</span>
        </span>
        <div className="flex shrink-0 items-center gap-0.5">
          <span className="min-w-[38px] text-center text-[10px] tabular-nums text-muted-foreground">
            {Math.round(viewport.zoom * 100)}%
          </span>
          <button type="button" onClick={() => zoomByFactor(1 / 1.2)} className={iconButton} title="缩小" aria-label="缩小">
            <Minus size={13} />
          </button>
          <button type="button" onClick={() => zoomByFactor(1.2)} className={iconButton} title="放大" aria-label="放大">
            <Plus size={13} />
          </button>
          <button type="button" onClick={() => viewport.fit()} className={iconButton} title="复位视图" aria-label="复位视图">
            <RotateCcw size={13} />
          </button>
          <button type="button" onClick={() => void handleCopy()} className={iconButton} title="复制源码" aria-label="复制源码">
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="ml-0.5 flex items-center gap-1 rounded px-1.5 py-1 text-[10px] text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
            title="展开大图"
          >
            <Maximize2 size={12} />
            展开大图
          </button>
        </div>
      </div>

      <div
        ref={viewport.viewportRef}
        className="relative w-full cursor-grab touch-none select-none overflow-hidden bg-content-area/60 active:cursor-grabbing"
        style={{ height: BUBBLE_VIEWPORT_HEIGHT }}
        onWheel={viewport.onWheel}
        onPointerDown={onViewportPointerDown}
        onPointerMove={onViewportPointerMove}
        onPointerUp={onViewportPointerUp}
        onPointerLeave={onViewportPointerUp}
      >
        <div
          className="absolute left-0 top-0 origin-top-left text-foreground"
          style={{ transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom})` }}
        >
          <MindMapCanvas root={root} scene={scene} interactive={false} />
        </div>
      </div>

      {open && (
        <MindMapFullscreenModal
          root={root}
          scene={scene}
          sceneWidth={scene.width}
          sceneHeight={scene.height}
          overrides={overrides}
          onOverridesChange={setOverrides}
          onPersist={persist}
          onResetOverrides={() => {
            setOverrides({})
            persist({})
          }}
          onOverlayLifecycleChange={onOverlayLifecycleChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}
