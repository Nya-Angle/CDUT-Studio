/**
 * MindMapBlock — 对话流 ```mindmap 代码块渲染器（Electron 桥接层）
 *
 * 底层实现已抽离为独立模块 `@profer/ui/mindmap-renderer`，客户端任意区域均可直接引用。
 */

import * as React from 'react'
import { useSetAtom } from 'jotai'
import { MindMapBlock as SharedMindMapBlock, type MindMapBlockProps } from '@profer/ui/mindmap-renderer'
import { globalOverlayCountAtom } from '@/atoms/overlay-atoms'

export function MindMapBlock(props: MindMapBlockProps): React.ReactElement | null {
  const setOverlayCount = useSetAtom(globalOverlayCountAtom)
  const handleOverlay = React.useCallback(
    (active: boolean) => {
      setOverlayCount((count) => (active ? count + 1 : Math.max(0, count - 1)))
    },
    [setOverlayCount],
  )
  return <SharedMindMapBlock {...props} onOverlayLifecycleChange={props.onOverlayLifecycleChange ?? handleOverlay} />
}
