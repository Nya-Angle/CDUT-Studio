/**
 * 思维导图通用画布与全屏视窗（Electron 渲染进程桥接层）
 *
 * 核心渲染与视口引擎已抽离至独立共享模块 `@profer/ui/mindmap-renderer`，
 * 此处注入 Electron 全局模态遮罩计数（`useGlobalOverlay`）并保持向后兼容导出。
 */

import * as React from 'react'
import { useSetAtom } from 'jotai'
import {
  MINDMAP_ZOOM_MIN,
  MINDMAP_ZOOM_MAX,
  buildMindMapScene,
  MindMapCanvas,
  useMindMapViewport,
  MindMapFullscreenModal as SharedMindMapFullscreenModal,
  MindMapRenderer as SharedMindMapRenderer,
  type MindMapPt,
  type MindMapScene,
  type MindMapCanvasProps,
  type ViewportApi,
  type MindMapFullscreenModalProps,
  type MindMapRendererProps,
} from '@profer/ui/mindmap-renderer'
import { globalOverlayCountAtom } from '@/atoms/overlay-atoms'

export {
  MINDMAP_ZOOM_MIN,
  MINDMAP_ZOOM_MAX,
  buildMindMapScene,
  MindMapCanvas,
  useMindMapViewport,
  type MindMapPt,
  type MindMapScene,
  type MindMapCanvasProps,
  type ViewportApi,
  type MindMapFullscreenModalProps,
  type MindMapRendererProps,
}

export function MindMapFullscreenModal(props: MindMapFullscreenModalProps): React.ReactElement {
  const setOverlayCount = useSetAtom(globalOverlayCountAtom)
  const handleOverlay = React.useCallback(
    (active: boolean) => {
      setOverlayCount((count) => (active ? count + 1 : Math.max(0, count - 1)))
    },
    [setOverlayCount],
  )
  return <SharedMindMapFullscreenModal {...props} onOverlayLifecycleChange={props.onOverlayLifecycleChange ?? handleOverlay} />
}

export function MindMapRenderer(props: MindMapRendererProps): React.ReactElement | null {
  const setOverlayCount = useSetAtom(globalOverlayCountAtom)
  const handleOverlay = React.useCallback(
    (active: boolean) => {
      setOverlayCount((count) => (active ? count + 1 : Math.max(0, count - 1)))
    },
    [setOverlayCount],
  )
  return <SharedMindMapRenderer {...props} onOverlayLifecycleChange={props.onOverlayLifecycleChange ?? handleOverlay} />
}
