/**
 * @profer/ui/mindmap-renderer — 独立思维导图渲染引擎与通用组件
 *
 * 设计契约：
 *   - 与任何特定宿主区域（会话流 / AI 速课堂 / 独立面板）完全解耦；
 *   - 场景几何：双曲 Poincaré 扇区切分 + 气泡真实包围盒归一化 + 拖拽坐标覆盖；
 *   - 连线：径向弧线三次贝塞尔（气泡外接矩形边缘锚点，互不相交）；
 *   - 视口：以光标为锚点的仿射缩放（zoom/pan 原子合并状态）+ 背景拖拽平移 + 自适应居中；
 *   - 全屏大图：现代点阵毛玻璃视窗 + 悬浮胶囊工具条 + 鸟瞰小地图（支持红框拖拽双向平移）。
 */

import * as React from 'react'
import { Download, Eraser, Maximize2, Minus, Plus, RotateCcw, X } from 'lucide-react'
import {
  buildBezierPath,
  computeAnchorZoomPan,
  estimateMindMapNodeSize,
  flattenMindMap,
  layoutMindMap,
  parseMindMapText,
  type MindMapNode,
} from '@profer/shared'
import { Dialog, DialogContent, DialogTitle } from '../primitives/dialog.tsx'
import { cn } from '../lib/cn.ts'
import { Z_LAYER } from '../lib/z-layers.ts'

export const MINDMAP_ZOOM_MIN = 0.2
export const MINDMAP_ZOOM_MAX = 3

/** 画布四周留白（气泡尺寸已单独计入包围盒，此处仅作视觉呼吸区） */
const SCENE_PAD = 56

export interface MindMapPt {
  x: number
  y: number
}

/** 场景几何：归一化画布尺寸 + 节点坐标 + 圆盘中心（径向连线基准） */
export interface MindMapScene {
  positions: Map<string, MindMapPt>
  width: number
  height: number
  center: MindMapPt
}

/**
 * 宿主全屏遮罩生命周期回调上下文（例如 Electron WebContentsView 隐藏/恢复）。
 * 允许 `@profer/ui` 保持零宿主耦合，同时在 Electron 宿主中无缝联动 `useGlobalOverlay`。
 */
export const RendererOverlayLifecycleContext = React.createContext<((active: boolean) => void) | null>(null)

export function useRendererOverlayLifecycle(active: boolean, onOverlayLifecycleChange?: (active: boolean) => void): void {
  const ctxCallback = React.useContext(RendererOverlayLifecycleContext)
  const cb = onOverlayLifecycleChange ?? ctxCallback
  React.useEffect(() => {
    if (!active || !cb) return
    cb(true)
    return () => cb(false)
  }, [active, cb])
}

/** 节点半尺寸（布局估算口径，与气泡实际样式对齐） */
function halfSizeOf(label: string): { w: number; h: number } {
  const size = estimateMindMapNodeSize(label)
  return { w: size.width / 2, h: size.height / 2 }
}

/**
 * 构建场景几何：径向布局 → 归一化到左上角原点（含留白）→ 应用用户拖拽覆盖。
 */
export function buildMindMapScene(
  root: MindMapNode,
  overrides: Record<string, MindMapPt>,
  options: { diskRadius?: number; baseRadius?: number; scale?: number; pad?: number } = {},
): MindMapScene {
  const pad = options.pad ?? SCENE_PAD
  const layout = layoutMindMap(root, {
    centerX: 0,
    centerY: 0,
    diskRadius: options.diskRadius ?? 720,
    baseRadius: options.baseRadius ?? 150,
  })

  const nodes = flattenMindMap(root)
  const halfById = new Map<string, { w: number; h: number }>()
  for (const node of nodes) halfById.set(node.id, halfSizeOf(node.label))

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const [id, point] of layout) {
    const half = halfById.get(id) ?? { w: 48, h: 18 }
    minX = Math.min(minX, point.x - half.w)
    minY = Math.min(minY, point.y - half.h)
    maxX = Math.max(maxX, point.x + half.w)
    maxY = Math.max(maxY, point.y + half.h)
  }
  const offsetX = -minX + pad
  const offsetY = -minY + pad
  const width = Math.max(360, maxX - minX + pad * 2)
  const height = Math.max(280, maxY - minY + pad * 2)

  const positions = new Map<string, MindMapPt>()
  for (const [id, point] of layout) {
    const half = halfById.get(id) ?? { w: 48, h: 18 }
    const override = overrides[id]
    positions.set(
      id,
      override
        ? {
            x: Math.min(Math.max(override.x, half.w), Math.max(half.w, width - half.w)),
            y: Math.min(Math.max(override.y, half.h), Math.max(half.h, height - half.h)),
          }
        : { x: point.x + offsetX, y: point.y + offsetY },
    )
  }
  const rootPos = positions.get(root.id) ?? { x: offsetX, y: offsetY }
  return {
    positions,
    width,
    height,
    center: rootPos,
  }
}

export interface MindMapCanvasProps {
  root: MindMapNode
  scene: MindMapScene
  /** 是否可交互（拖拽气泡）。false 时整层 pointer-events:none 只读 */
  interactive: boolean
  onNodePointerDown?: (event: React.PointerEvent, nodeId: string) => void
}

interface BubbleHalf {
  w: number
  h: number
}

function edgeAnchor(center: MindMapPt, half: BubbleHalf, toward: MindMapPt): MindMapPt {
  const dx = toward.x - center.x
  const dy = toward.y - center.y
  const adx = Math.abs(dx)
  const ady = Math.abs(dy)
  if (adx < 0.5 && ady < 0.5) return center
  const tx = adx > 0.001 ? half.w / adx : Number.POSITIVE_INFINITY
  const ty = ady > 0.001 ? half.h / ady : Number.POSITIVE_INFINITY
  const t = Math.min(tx, ty)
  if (!Number.isFinite(t) || t <= 0) return center
  return { x: center.x + dx * t, y: center.y + dy * t }
}

function estimateNodeSize(text: string): BubbleHalf {
  const size = estimateMindMapNodeSize(text)
  return { w: size.width / 2, h: size.height / 2 }
}

/** 画布：连线层（SVG 径向弧线） + 气泡层（可拖拽或只读） */
export function MindMapCanvas({ root, scene, interactive, onNodePointerDown }: MindMapCanvasProps): React.ReactElement {
  const nodes = React.useMemo(() => flattenMindMap(root), [root])
  const labelById = React.useMemo(() => {
    const map = new Map<string, string>()
    for (const node of nodes) map.set(node.id, node.label)
    return map
  }, [nodes])
  const bubbleRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())
  const sizesRef = React.useRef<Map<string, BubbleHalf>>(new Map())
  const [sizes, setSizes] = React.useState<Map<string, BubbleHalf>>(() => new Map())

  React.useLayoutEffect(() => {
    const next = new Map<string, BubbleHalf>()
    let changed = false
    for (const node of nodes) {
      const el = bubbleRefs.current.get(node.id)
      if (!el) continue
      const w = el.offsetWidth
      const h = el.offsetHeight
      next.set(node.id, { w: w / 2, h: h / 2 })
      const prev = sizesRef.current.get(node.id)
      if (!prev || prev.w !== w / 2 || prev.h !== h / 2) changed = true
    }
    if (next.size !== sizesRef.current.size) changed = true
    if (changed) {
      sizesRef.current = next
      setSizes(next)
    }
  }, [nodes])

  const links = React.useMemo(() => {
    const out: Array<{ key: string; d: string }> = []
    const half = (id: string): BubbleHalf => sizes.get(id) ?? estimateNodeSize(labelById.get(id) ?? '')
    const walk = (node: MindMapNode): void => {
      const from = scene.positions.get(node.id)
      if (from) {
        for (const child of node.children ?? []) {
          const to = scene.positions.get(child.id)
          if (to) {
            const start = edgeAnchor(from, half(node.id), to)
            const end = edgeAnchor(to, half(child.id), from)
            out.push({
              key: `${node.id}->${child.id}`,
              d: buildBezierPath({ ...start, depth: 0, angle: 0 }, { ...end, depth: 1, angle: 0 }, scene.center),
            })
          }
        }
      }
      for (const child of node.children ?? []) walk(child)
    }
    walk(root)
    return out
  }, [root, scene, sizes, labelById])

  return (
    <div className="relative" style={{ width: scene.width, height: scene.height }}>
      <svg width={scene.width} height={scene.height} className="pointer-events-none absolute inset-0">
        {links.map((link) => (
          <path key={link.key} d={link.d} fill="none" stroke="currentColor" strokeWidth={1.5} className="text-primary/35" />
        ))}
      </svg>
      {nodes.map((node) => {
        const point = scene.positions.get(node.id)
        if (!point) return null
        const isRoot = node.id === root.id
        return (
          <div
            key={node.id}
            ref={(el) => {
              if (el) bubbleRefs.current.set(node.id, el)
              else bubbleRefs.current.delete(node.id)
            }}
            onPointerDown={interactive && onNodePointerDown ? (event) => onNodePointerDown(event, node.id) : undefined}
            className={cn(
              'absolute flex max-w-[160px] -translate-x-1/2 -translate-y-1/2 select-none items-center rounded-xl border px-2.5 py-1.5 text-left text-[11px] shadow-sm',
              isRoot ? 'border-primary/50 bg-primary/10 font-semibold text-primary' : 'border-border/70 bg-card text-foreground',
              interactive ? 'cursor-grab touch-none active:cursor-grabbing hover:shadow-md' : 'pointer-events-none',
            )}
            style={{ left: point.x, top: point.y }}
            title={node.notes || node.label}
          >
            <span className="whitespace-normal leading-snug">{node.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export interface ViewportApi {
  viewportRef: React.RefObject<HTMLDivElement>
  zoom: number
  pan: MindMapPt
  size: { w: number; h: number }
  ready: boolean
  setZoom: React.Dispatch<React.SetStateAction<number>>
  setPan: React.Dispatch<React.SetStateAction<MindMapPt>>
  zoomBy: (deltaFactor: number, anchorScreenPt?: { x: number; y: number }) => void
  fit: (padding?: number) => void
  onWheel: (event: React.WheelEvent) => void
  beginPan: (event: React.PointerEvent) => void
  movePan: (event: React.PointerEvent) => void
  endPan: () => void
}

export function useMindMapViewport(sceneWidth: number, sceneHeight: number, enabled = true): ViewportApi {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState({ w: 0, h: 0 })
  const [view, setView] = React.useState<{ zoom: number; pan: MindMapPt }>({ zoom: 1, pan: { x: 0, y: 0 } })
  const panRef = React.useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null)
  const fittedRef = React.useRef(false)

  const zoom = view.zoom
  const pan = view.pan

  const setZoom = React.useCallback((valueOrUpdater: React.SetStateAction<number>) => {
    setView((prev) => ({
      ...prev,
      zoom: typeof valueOrUpdater === 'function' ? valueOrUpdater(prev.zoom) : valueOrUpdater,
    }))
  }, [])

  const setPan = React.useCallback((valueOrUpdater: React.SetStateAction<MindMapPt>) => {
    setView((prev) => ({
      ...prev,
      pan: typeof valueOrUpdater === 'function' ? valueOrUpdater(prev.pan) : valueOrUpdater,
    }))
  }, [])

  React.useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    observer.observe(el)
    setSize({ w: el.clientWidth, h: el.clientHeight })
    return () => observer.disconnect()
  }, [])

  const fit = React.useCallback(
    (padding = 40): void => {
      const el = viewportRef.current
      const w = size.w > 0 ? size.w : el?.clientWidth ?? 0
      const h = size.h > 0 ? size.h : el?.clientHeight ?? 0
      if (w <= 0 || h <= 0 || sceneWidth <= 0 || sceneHeight <= 0) return
      const innerW = Math.max(1, w - padding * 2)
      const innerH = Math.max(1, h - padding * 2)
      const nextZoom = Math.min(MINDMAP_ZOOM_MAX, Math.max(MINDMAP_ZOOM_MIN, Math.min(innerW / sceneWidth, innerH / sceneHeight)))
      setView({
        zoom: nextZoom,
        pan: { x: (w - sceneWidth * nextZoom) / 2, y: (h - sceneHeight * nextZoom) / 2 },
      })
    },
    [size, sceneWidth, sceneHeight],
  )

  const zoomBy = React.useCallback(
    (deltaFactor: number, anchorScreenPt?: { x: number; y: number }): void => {
      if (!enabled) return
      const rect = viewportRef.current?.getBoundingClientRect()
      const w = rect?.width ?? size.w
      const h = rect?.height ?? size.h
      const anchor = anchorScreenPt ?? { x: w / 2, y: h / 2 }
      setView((prev) => {
        const rawNext = prev.zoom * deltaFactor
        const nextZoom = Math.min(MINDMAP_ZOOM_MAX, Math.max(MINDMAP_ZOOM_MIN, rawNext))
        return computeAnchorZoomPan(prev, anchor, nextZoom)
      })
    },
    [enabled, size.w, size.h],
  )

  React.useEffect(() => {
    fittedRef.current = false
  }, [sceneWidth, sceneHeight])

  React.useEffect(() => {
    if (size.w > 0 && size.h > 0 && !fittedRef.current) {
      fittedRef.current = true
      fit()
    }
  }, [size, fit])

  const onWheel = React.useCallback(
    (event: React.WheelEvent): void => {
      if (!enabled) return
      event.preventDefault()
      const rect = viewportRef.current?.getBoundingClientRect()
      const cx = rect ? event.clientX - rect.left : 0
      const cy = rect ? event.clientY - rect.top : 0
      const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12
      setView((prev) => {
        const rawNext = prev.zoom * factor
        const nextZoom = Math.min(MINDMAP_ZOOM_MAX, Math.max(MINDMAP_ZOOM_MIN, rawNext))
        return computeAnchorZoomPan(prev, { x: cx, y: cy }, nextZoom)
      })
    },
    [enabled],
  )

  const beginPan = React.useCallback(
    (event: React.PointerEvent): void => {
      if (!enabled) return
      panRef.current = { startX: event.clientX, startY: event.clientY, originX: view.pan.x, originY: view.pan.y }
    },
    [enabled, view.pan.x, view.pan.y],
  )

  const movePan = React.useCallback((event: React.PointerEvent): void => {
    const state = panRef.current
    if (!state) return
    setView((prev) => ({
      ...prev,
      pan: { x: state.originX + (event.clientX - state.startX), y: state.originY + (event.clientY - state.startY) },
    }))
  }, [])

  const endPan = React.useCallback((): void => {
    panRef.current = null
  }, [])

  return {
    viewportRef,
    zoom,
    pan,
    size,
    ready: size.w > 0 && size.h > 0,
    setZoom,
    setPan,
    zoomBy,
    fit,
    onWheel,
    beginPan,
    movePan,
    endPan,
  }
}

const PILL_BUTTON =
  'flex items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground'

export interface MindMapFullscreenModalProps {
  root: MindMapNode
  sceneWidth: number
  sceneHeight: number
  overrides: Record<string, MindMapPt>
  scene: MindMapScene
  onOverridesChange: (next: Record<string, MindMapPt>) => void
  onPersist: (next: Record<string, MindMapPt>) => void
  onNodeClick?: (node: MindMapNode) => void
  onResetOverrides?: () => void
  onExportOpml?: () => void
  onOverlayLifecycleChange?: (active: boolean) => void
  onClose: () => void
}

const MINI_W = 176
const MINI_H = 128

export function MindMapFullscreenModal({
  root,
  sceneWidth,
  sceneHeight,
  overrides,
  scene,
  onOverridesChange,
  onPersist,
  onNodeClick,
  onResetOverrides,
  onExportOpml,
  onOverlayLifecycleChange,
  onClose,
}: MindMapFullscreenModalProps): React.ReactElement {
  useRendererOverlayLifecycle(true, onOverlayLifecycleChange)
  const viewport = useMindMapViewport(sceneWidth, sceneHeight)
  const dragRef = React.useRef<{ id: string; startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(null)
  const miniDragRef = React.useRef(false)
  const nodes = React.useMemo(() => flattenMindMap(root), [root])

  const wheelCleanupRef = React.useRef<(() => void) | null>(null)
  const zoomAt = React.useCallback(
    (anchor: { x: number; y: number }, deltaFactor: number): void => {
      viewport.zoomBy(deltaFactor, anchor)
    },
    [viewport.zoomBy],
  )

  const setViewportNode = React.useCallback(
    (el: HTMLDivElement | null): void => {
      wheelCleanupRef.current?.()
      wheelCleanupRef.current = null
      ;(viewport.viewportRef as React.MutableRefObject<HTMLDivElement | null>).current = el
      if (!el) return
      const handler = (event: WheelEvent): void => {
        event.preventDefault()
        const rect = el.getBoundingClientRect()
        const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12
        zoomAt({ x: event.clientX - rect.left, y: event.clientY - rect.top }, factor)
      }
      el.addEventListener('wheel', handler, { passive: false })
      wheelCleanupRef.current = () => el.removeEventListener('wheel', handler)
    },
    [viewport.viewportRef, zoomAt],
  )

  const onBubblePointerDown = (event: React.PointerEvent, nodeId: string): void => {
    event.stopPropagation()
    const origin = scene.positions.get(nodeId) ?? { x: 0, y: 0 }
    dragRef.current = { id: nodeId, startX: event.clientX, startY: event.clientY, originX: origin.x, originY: origin.y, moved: false }
    ;(event.target as HTMLElement).setPointerCapture?.(event.pointerId)
  }

  const miniScale = Math.min(MINI_W / sceneWidth, MINI_H / sceneHeight)
  const miniOffsetX = (MINI_W - sceneWidth * miniScale) / 2
  const miniOffsetY = (MINI_H - sceneHeight * miniScale) / 2
  const panToMiniPoint = (event: React.PointerEvent): void => {
    const el = viewport.viewportRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const miniLeft = rect.width - (MINI_W + 20) + miniOffsetX
    const miniTop = rect.height - (MINI_H + 20) + miniOffsetY
    const sceneX = (event.clientX - rect.left - miniLeft) / miniScale
    const sceneY = (event.clientY - rect.top - miniTop) / miniScale
    viewport.setPan({
      x: rect.width / 2 - sceneX * viewport.zoom,
      y: rect.height / 2 - sceneY * viewport.zoom,
    })
  }

  const onPointerMove = (event: React.PointerEvent): void => {
    if (dragRef.current) {
      const drag = dragRef.current
      const dx = (event.clientX - drag.startX) / viewport.zoom
      const dy = (event.clientY - drag.startY) / viewport.zoom
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) drag.moved = true
      onOverridesChange({ ...overrides, [drag.id]: { x: Math.round(drag.originX + dx), y: Math.round(drag.originY + dy) } })
      return
    }
    if (miniDragRef.current) {
      panToMiniPoint(event)
      return
    }
    viewport.movePan(event)
  }

  const onPointerUp = (): void => {
    if (dragRef.current) {
      const drag = dragRef.current
      dragRef.current = null
      if (drag.moved) onPersist(overrides)
      else if (onNodeClick) onNodeClick(nodes.find((n) => n.id === drag.id) ?? root)
      return
    }
    miniDragRef.current = false
    viewport.endPan()
  }

  const viewW = viewport.size.w
  const viewH = viewport.size.h
  const viewRect = {
    x: miniOffsetX + (-viewport.pan.x / viewport.zoom) * miniScale,
    y: miniOffsetY + (-viewport.pan.y / viewport.zoom) * miniScale,
    w: (viewW / viewport.zoom) * miniScale,
    h: (viewH / viewport.zoom) * miniScale,
  }

  return (
    <Dialog open onOpenChange={(next) => { if (!next) onClose() }}>
      <DialogContent
        hideClose
        overlayClassName="bg-black/70 backdrop-blur-sm"
        className="grid h-[88vh] w-[90vw] max-w-none grid-rows-[minmax(0,1fr)] gap-0 overflow-hidden rounded-2xl border-border/60 bg-card/95 p-0 shadow-2xl backdrop-blur-xl"
      >
        <DialogTitle className="sr-only">思维导图大图：{root.label}</DialogTitle>

        <div
          ref={setViewportNode}
          className="relative min-h-0 flex-1 cursor-grab touch-none overflow-hidden overscroll-contain bg-content-area select-none active:cursor-grabbing"
          onWheel={(event) => {
            if (event.nativeEvent.defaultPrevented) return
            const rect = event.currentTarget.getBoundingClientRect()
            const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12
            zoomAt({ x: event.clientX - rect.left, y: event.clientY - rect.top }, factor)
          }}
          onPointerDown={viewport.beginPan}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 text-muted-foreground opacity-[0.25] dark:opacity-[0.18]"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div
            className="absolute left-0 top-0 origin-top-left text-foreground"
            style={{ transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom})` }}
          >
            <MindMapCanvas root={root} scene={scene} interactive onNodePointerDown={onBubblePointerDown} />
          </div>

          <div className="pointer-events-none absolute left-4 top-3 max-w-[40%]">
            <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full border border-border/50 bg-background/80 px-3 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur-sm">
              🗺️ <span className="truncate">{root.label}</span>
            </span>
          </div>

          <div className="absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-0.5 rounded-xl border border-border/50 bg-background/85 p-1 shadow-lg backdrop-blur-md">
            <button
              type="button"
              title="点击重置为 100%"
              onClick={() => viewport.zoomBy(1 / viewport.zoom)}
              className="min-w-[46px] rounded-lg px-1.5 py-1 text-center text-[11px] tabular-nums text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              {Math.round(viewport.zoom * 100)}%
            </button>
            <button type="button" className={PILL_BUTTON} title="缩小" onClick={() => viewport.zoomBy(1 / 1.15)}>
              <Minus size={15} />
            </button>
            <button type="button" className={PILL_BUTTON} title="放大" onClick={() => viewport.zoomBy(1.15)}>
              <Plus size={15} />
            </button>
            <button type="button" className={PILL_BUTTON} title="自适应居中" onClick={() => viewport.fit()}>
              <RotateCcw size={15} />
            </button>
            {onResetOverrides && (
              <button type="button" className={PILL_BUTTON} title="重置节点布局" onClick={onResetOverrides}>
                <Eraser size={15} />
              </button>
            )}
            {onExportOpml && (
              <button type="button" className={PILL_BUTTON} title="导出 OPML" onClick={onExportOpml}>
                <Download size={15} />
              </button>
            )}
            <button type="button" className={PILL_BUTTON} title="关闭（ESC）" onClick={onClose}>
              <X size={15} />
            </button>
          </div>

          <div
            className="absolute bottom-4 right-4 cursor-pointer rounded-lg border border-border/70 bg-card/85 p-1 shadow-md backdrop-blur-sm"
            style={{ width: MINI_W + 8, height: MINI_H + 8 }}
            onPointerDown={(event) => {
              event.stopPropagation()
              miniDragRef.current = true
              panToMiniPoint(event)
            }}
            onPointerUp={() => {
              miniDragRef.current = false
            }}
          >
            <svg width={MINI_W} height={MINI_H} className="pointer-events-none block">
              <g transform={`translate(${miniOffsetX} ${miniOffsetY}) scale(${miniScale})`}>
                {nodes.map((node) => {
                  const point = scene.positions.get(node.id)
                  if (!point) return null
                  return <circle key={node.id} cx={point.x} cy={point.y} r={7} className="fill-primary/60" />
                })}
              </g>
              <rect
                x={viewRect.x}
                y={viewRect.y}
                width={Math.max(4, viewRect.w)}
                height={Math.max(4, viewRect.h)}
                className="fill-primary/10 stroke-foreground/70"
                strokeWidth={1}
                rx={2}
              />
            </svg>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export interface MindMapRendererProps {
  /** 直接传入 MindMapNode 根节点（与 code 二选一） */
  root?: MindMapNode | null
  /** 传入 mindmap 缩进文本（与 root 二选一） */
  code?: string
  /** 初始拖拽坐标覆盖 */
  initialOverrides?: Record<string, MindMapPt>
  /** 拖拽持久化回调 */
  onPersistOverrides?: (next: Record<string, MindMapPt>) => void
  /** 点击节点回调（非拖拽时触发） */
  onNodeClick?: (node: MindMapNode) => void
  /** 导出 OPML 回调 */
  onExportOpml?: () => void
  /** 是否允许在内联画布直接拖拽节点（默认 true） */
  interactiveNodes?: boolean
  /** 容器类名 */
  className?: string
  /** 高度（用于嵌入式卡片） */
  height?: number | string
  /** 底部提示文案 */
  footerHint?: string
  /** 全屏遮罩生命周期通知 */
  onOverlayLifecycleChange?: (active: boolean) => void
}

/**
 * 独立可复用的思维导图渲染组件（可在客户端任意位置直接挂载调用）
 */
export function MindMapRenderer({
  root: rootProp,
  code,
  initialOverrides,
  onPersistOverrides,
  onNodeClick,
  onExportOpml,
  interactiveNodes = true,
  className,
  height = '100%',
  footerHint,
  onOverlayLifecycleChange,
}: MindMapRendererProps): React.ReactElement | null {
  const root = React.useMemo(() => {
    if (rootProp) return rootProp
    if (code) return parseMindMapText(code)
    return null
  }, [rootProp, code])

  const [overrides, setOverrides] = React.useState<Record<string, MindMapPt>>(() => initialOverrides ?? {})
  const [fullscreen, setFullscreen] = React.useState(false)

  React.useEffect(() => {
    if (initialOverrides) setOverrides(initialOverrides)
  }, [initialOverrides])

  const nodes = React.useMemo(() => (root ? flattenMindMap(root) : []), [root])
  const scene = React.useMemo(() => (root ? buildMindMapScene(root, overrides) : null), [root, overrides])
  const viewport = useMindMapViewport(scene?.width ?? 0, scene?.height ?? 0)
  const dragRef = React.useRef<{ id: string; startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(null)
  const overridesRef = React.useRef(overrides)
  overridesRef.current = overrides

  const persist = React.useCallback(
    (next: Record<string, MindMapPt>) => {
      onPersistOverrides?.(next)
    },
    [onPersistOverrides],
  )

  const resetLayout = React.useCallback(() => {
    setOverrides({})
    persist({})
  }, [persist])

  if (!root || !scene) return null

  const onBubblePointerDown = (event: React.PointerEvent, nodeId: string): void => {
    if (!interactiveNodes) return
    event.stopPropagation()
    const origin = scene.positions.get(nodeId) ?? { x: 0, y: 0 }
    dragRef.current = { id: nodeId, startX: event.clientX, startY: event.clientY, originX: origin.x, originY: origin.y, moved: false }
    ;(event.target as HTMLElement).setPointerCapture?.(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent): void => {
    if (dragRef.current) {
      const drag = dragRef.current
      const dx = (event.clientX - drag.startX) / viewport.zoom
      const dy = (event.clientY - drag.startY) / viewport.zoom
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) drag.moved = true
      setOverrides((prev) => ({ ...prev, [drag.id]: { x: Math.round(drag.originX + dx), y: Math.round(drag.originY + dy) } }))
      return
    }
    viewport.movePan(event)
  }

  const onPointerUp = (): void => {
    if (dragRef.current) {
      const drag = dragRef.current
      dragRef.current = null
      if (drag.moved) persist(overridesRef.current)
      else if (onNodeClick) {
        const target = nodes.find((n) => n.id === drag.id)
        if (target) onNodeClick(target)
      }
      return
    }
    viewport.endPan()
  }

  return (
    <div className={cn('relative flex min-h-0 flex-col', className)} style={{ height }}>
      <div className={`absolute right-3 top-3 ${Z_LAYER.toolbar} flex items-center gap-1 rounded-lg border border-border/60 bg-background/80 p-1 shadow-sm backdrop-blur-sm`}>
        <button type="button" title="缩小" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => viewport.zoomBy(1 / 1.15)}>
          <Minus size={13} />
        </button>
        <span className="w-10 text-center text-[10px] tabular-nums text-muted-foreground">{Math.round(viewport.zoom * 100)}%</span>
        <button type="button" title="放大" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => viewport.zoomBy(1.15)}>
          <Plus size={13} />
        </button>
        <button type="button" title="自适应复位" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => viewport.fit()}>
          <RotateCcw size={13} />
        </button>
        <button type="button" title="全屏大图" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setFullscreen(true)}>
          <Maximize2 size={13} />
        </button>
        <button type="button" title="还原自动布局" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={resetLayout}>
          <Eraser size={13} />
        </button>
        {onExportOpml && (
          <button type="button" title="导出 OPML" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={onExportOpml}>
            <Download size={13} />
          </button>
        )}
      </div>

      <div
        ref={viewport.viewportRef}
        className="relative min-h-0 flex-1 cursor-grab overflow-hidden active:cursor-grabbing"
        onWheel={viewport.onWheel}
        onPointerDown={viewport.beginPan}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom})` }}>
          <MindMapCanvas root={root} scene={scene} interactive={interactiveNodes} onNodePointerDown={onBubblePointerDown} />
        </div>
        {footerHint && (
          <span className="pointer-events-none absolute bottom-2 left-3 text-[10px] text-muted-foreground/70">
            {footerHint}
          </span>
        )}
      </div>

      {fullscreen && (
        <MindMapFullscreenModal
          root={root}
          scene={scene}
          sceneWidth={scene.width}
          sceneHeight={scene.height}
          overrides={overrides}
          onOverridesChange={setOverrides}
          onPersist={persist}
          onNodeClick={onNodeClick}
          onResetOverrides={resetLayout}
          onExportOpml={onExportOpml}
          onOverlayLifecycleChange={onOverlayLifecycleChange}
          onClose={() => setFullscreen(false)}
        />
      )}
    </div>
  )
}
