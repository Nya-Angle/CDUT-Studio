/**
 * AiClassMindMapTab — AI 速课堂思维导图视图
 *
 * 双曲 Poincaré 投影布局 + 径向弧线贝塞尔气泡渲染（复用共享引擎 mindmap-canvas）：
 *   - 气泡允许自由拖拽，松手即把坐标落盘（SAVE_MINDMAP_COORDS）；
 *   - 点击气泡自动生成该主题的深度伴学 Prompt 写入系统剪贴板，并弹出 Sonner Toast；
 *   - 工具栏提供缩放、自适应复位、**全屏大图**与 OPML 2.0 导出；
 *   - 视口支持**滚轮以光标为锚点缩放** + 背景拖拽平移；全屏模态内附**鸟瞰小地图**。
 */

import * as React from 'react'
import { Download, Eraser, Loader2, Maximize2, Minus, Plus, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { buildNodeStudyPrompt, flattenMindMap, type MindMapData, type MindMapNode } from '@profer/shared'
import { Z_LAYER } from '@profer/ui'
import { useAtomValue } from 'jotai'
import { cn } from '@/lib/utils'
import { coachTourCurrentStepKeyAtom } from '@/atoms/coach-tour-atoms'
import { MindMapCanvas, MindMapFullscreenModal, buildMindMapScene, useMindMapViewport, type MindMapPt } from '@/components/ai-elements/mindmap-canvas'

interface AiClassMindMapTabProps {
  sessionId: string
  mindmapId: string
}

export function AiClassMindMapTab({ sessionId, mindmapId }: AiClassMindMapTabProps): React.ReactElement {
  const currentTourStepKey = useAtomValue(coachTourCurrentStepKeyAtom)
  const isTourMindmap = currentTourStepKey === 'ai-class-mindmap'
  const [mindmap, setMindmap] = React.useState<MindMapData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [overrides, setOverrides] = React.useState<Record<string, MindMapPt>>({})
  const [fullscreen, setFullscreen] = React.useState(false)

  const dragRef = React.useRef<{ id: string; startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(null)

  React.useEffect(() => {
    let alive = true
    if (!mindmapId) {
      setMindmap(null)
      setLoading(false)
      return
    }
    setLoading(true)
    window.electronAPI.study
      .getMindmap({ sessionId, mindmapId })
      .then((data) => {
        if (!alive) return
        setMindmap(data)
        const initial: Record<string, MindMapPt> = {}
        if (data) {
          for (const node of flattenMindMap(data.root)) {
            if (node.position) initial[node.id] = { x: node.position.x, y: node.position.y }
          }
        }
        setOverrides(initial)
      })
      .catch(() => setMindmap(null))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [sessionId, mindmapId])

  const nodes = React.useMemo(() => (mindmap ? flattenMindMap(mindmap.root) : []), [mindmap])
  const scene = React.useMemo(() => (mindmap ? buildMindMapScene(mindmap.root, overrides) : null), [mindmap, overrides])

  const viewport = useMindMapViewport(scene?.width ?? 0, scene?.height ?? 0)

  const persistCoords = React.useCallback(
    (next: Record<string, MindMapPt>): void => {
      if (!mindmap) return
      void window.electronAPI.study.saveMindmapCoords({ sessionId, mindmapId: mindmap.id, coords: next }).catch(() => {})
    },
    [mindmap, sessionId],
  )

  const copyStudyPrompt = React.useCallback(
    async (node: MindMapNode | null): Promise<void> => {
      if (!node) return
      const prompt = node.studyPrompt || buildNodeStudyPrompt(node, mindmap?.title)
      try {
        await navigator.clipboard.writeText(prompt)
        toast.success(`已复制「${node.label}」专项学习提示词，请在主对话框粘贴发送～`)
      } catch {
        toast.error('复制失败，请检查剪贴板权限')
      }
    },
    [mindmap?.title],
  )

  const onBubblePointerDown = (event: React.PointerEvent, nodeId: string): void => {
    event.stopPropagation()
    const origin = scene?.positions.get(nodeId) ?? { x: 0, y: 0 }
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

  const overridesRef = React.useRef(overrides)
  overridesRef.current = overrides

  const onPointerUp = (): void => {
    if (dragRef.current) {
      const drag = dragRef.current
      dragRef.current = null
      if (drag.moved) persistCoords(overridesRef.current)
      else void copyStudyPrompt(nodes.find((n) => n.id === drag.id) ?? null)
      return
    }
    viewport.endPan()
  }

  const exportOpml = (): void => {
    if (!mindmap) return
    void window.electronAPI.study
      .exportOpml({ sessionId, mindmapId: mindmap.id })
      .then((res) => {
        if (res.success) toast.success('已导出 OPML 2.0 文档')
        else if (!res.canceled) toast.error(res.error || '导出失败')
      })
      .catch(() => toast.error('导出失败'))
  }

  /** 还原为自动布局：丢弃用户拖拽覆盖，按当前布局重新落盘坐标 */
  const resetLayout = (): void => {
    if (!mindmap) return
    const base = buildMindMapScene(mindmap.root, {})
    const coords: Record<string, MindMapPt> = {}
    for (const node of flattenMindMap(mindmap.root)) {
      const point = base.positions.get(node.id)
      if (point) coords[node.id] = { x: point.x, y: point.y }
    }
    setOverrides(coords)
    persistCoords(coords)
    toast.success('已还原为自动布局')
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <Loader2 size={18} className="animate-spin" />
      </div>
    )
  }
  if (!mindmap || !scene) {
    return <div className="flex h-full items-center justify-center p-6 text-center text-[11px] text-muted-foreground">尚未生成思维导图，请回到学习主页创建。</div>
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {/* 工具栏 */}
      <div className={`absolute right-3 top-3 ${Z_LAYER.toolbar} flex items-center gap-1 rounded-lg border border-border/60 bg-background/80 p-1 shadow-sm backdrop-blur-sm`}>
        <button type="button" title="缩小" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => viewport.zoomBy(1 / 1.15)}>
          <Minus size={13} />
        </button>
        <span className="w-10 text-center text-[10px] text-muted-foreground">{Math.round(viewport.zoom * 100)}%</span>
        <button type="button" title="放大" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => viewport.zoomBy(1.15)}>
          <Plus size={13} />
        </button>
        <button type="button" title="自适应复位" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => viewport.fit()}>
          <RotateCcw size={13} />
        </button>
        <button
          type="button"
          title={isTourMindmap ? '引导步骤中暂不可用' : '全屏大图'}
          disabled={isTourMindmap}
          className={cn(
            'rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            isTourMindmap && 'cursor-not-allowed opacity-35 hover:bg-transparent hover:text-muted-foreground',
          )}
          onClick={() => setFullscreen(true)}
        >
          <Maximize2 size={13} />
        </button>
        <button type="button" title="还原自动布局" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={resetLayout}>
          <Eraser size={13} />
        </button>
        <button
          type="button"
          title={isTourMindmap ? '引导步骤中暂不可用' : '导出 OPML'}
          disabled={isTourMindmap}
          className={cn(
            'rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            isTourMindmap && 'cursor-not-allowed opacity-35 hover:bg-transparent hover:text-muted-foreground',
          )}
          onClick={exportOpml}
        >
          <Download size={13} />
        </button>
      </div>

      {/* 内联视口：滚轮缩放 + 背景平移 + 气泡拖拽/点击复制 */}
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
          <MindMapCanvas root={mindmap.root} scene={scene} interactive onNodePointerDown={onBubblePointerDown} />
        </div>
        <span className="pointer-events-none absolute bottom-2 left-3 text-[10px] text-muted-foreground/70">
          滚轮缩放 · 拖拽空白平移 · 拖拽气泡调整布局 · 点击气泡复制伴学提示词
        </span>
      </div>

      {fullscreen && (
        <MindMapFullscreenModal
          root={mindmap.root}
          scene={scene}
          sceneWidth={scene.width}
          sceneHeight={scene.height}
          overrides={overrides}
          onOverridesChange={setOverrides}
          onPersist={persistCoords}
          onNodeClick={(node) => void copyStudyPrompt(node)}
          onResetOverrides={resetLayout}
          onExportOpml={exportOpml}
          onClose={() => setFullscreen(false)}
        />
      )}
    </div>
  )
}
