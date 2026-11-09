/**
 * KLineBlock / KLineRenderer — 股票 K 线与微观结构渲染器（Electron 桥接层）
 *
 * 底层引擎与 UI 组件已作为独立模块封装于 `@profer/ui/kline-renderer` 与 `@profer/shared`，
 * 此处自动注入 Electron 全局模态遮罩计数（`globalOverlayCountAtom`），避免全屏实验室终端被原生 WebContentsView 遮挡。
 */

import * as React from 'react'
import { useSetAtom } from 'jotai'
import {
  KLineBlock as SharedKLineBlock,
  KLineRenderer,
  KLineFullscreenModal as SharedKLineFullscreenModal,
  KLineMarketProvider,
  useKLineMarketFeed,
  type KLineBlockProps,
  type KLineRendererProps,
  type KLineFullscreenModalProps,
} from '@profer/ui/kline-renderer'
import { globalOverlayCountAtom } from '@/atoms/overlay-atoms'

export {
  KLineRenderer,
  KLineMarketProvider,
  useKLineMarketFeed,
  type KLineBlockProps,
  type KLineRendererProps,
  type KLineFullscreenModalProps,
}

export function KLineBlock(props: KLineBlockProps): React.ReactElement | null {
  const setOverlayCount = useSetAtom(globalOverlayCountAtom)
  const handleOverlay = React.useCallback(
    (active: boolean) => {
      setOverlayCount((count) => (active ? count + 1 : Math.max(0, count - 1)))
    },
    [setOverlayCount],
  )
  return (
    <SharedKLineBlock
      {...props}
      onOverlayLifecycleChange={props.onOverlayLifecycleChange ?? handleOverlay}
    />
  )
}

export function KLineFullscreenModal(props: KLineFullscreenModalProps): React.ReactElement | null {
  const setOverlayCount = useSetAtom(globalOverlayCountAtom)
  const handleOverlay = React.useCallback(
    (active: boolean) => {
      setOverlayCount((count) => (active ? count + 1 : Math.max(0, count - 1)))
    },
    [setOverlayCount],
  )
  return (
    <SharedKLineFullscreenModal
      {...props}
      onOverlayLifecycleChange={props.onOverlayLifecycleChange ?? handleOverlay}
    />
  )
}
