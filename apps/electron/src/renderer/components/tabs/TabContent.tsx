/**
 * TabContent — 标签内容渲染器
 *
 * 根据标签类型渲染参数化的 AgentView。
 * 直接传递 sessionId/conversationId prop，无需桥接全局 atoms。
 */

import * as React from 'react'
import { useAtomValue } from 'jotai'
import { tabsAtom } from '@/atoms/tab-atoms'
import { markdownTocOpenAtom } from '@/atoms/markdown-toc'
import { AgentView } from '@/components/agent'
import { LazyViewFallback } from '@/components/app-shell/LazyViewFallback'
import { TabErrorBoundary } from './TabErrorBoundary'

const BrowserTabContent = React.lazy(() =>
  import('@/components/browser/BrowserTabContent').then((m) => ({ default: m.BrowserTabContent })),
)
const MarkdownRichEditor = React.lazy(() =>
  import('@/components/diff/MarkdownRichEditor').then((m) => ({ default: m.MarkdownRichEditor })),
)
const MarkdownToc = React.lazy(() =>
  import('@/components/diff/MarkdownToc').then((m) => ({ default: m.MarkdownToc })),
)
const ScratchPadView = React.lazy(() =>
  import('@/components/scratch-pad/ScratchPadView').then((m) => ({ default: m.ScratchPadView })),
)

export interface TabContentProps {
  tabId: string
}

export function TabContent({ tabId }: TabContentProps): React.ReactElement {
  const tabs = useAtomValue(tabsAtom)
  const tab = tabs.find((t) => t.id === tabId)

  // [FLASH-DEBUG] 监控 tab 查找失败（说明 tabId 指向了不存在的标签）
  React.useEffect(() => {
    if (!tab) {
      console.warn(`[FLASH-DEBUG] TabContent: tab not found for tabId="${tabId}"`, { tabIds: tabs.map(t => t.id) })
    }
  }, [tab, tabId, tabs])

  if (!tab) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        标签页不存在
      </div>
    )
  }

  if (tab.type === 'scratch') {
    return (
      <React.Suspense fallback={<LazyViewFallback />}>
        <ScratchPadView />
      </React.Suspense>
    )
  }

  if (tab.type === 'tutorial') {
    return <TutorialTabContent />
  }

  if (tab.type === 'browser') {
    return (
      <TabErrorBoundary key={tab.id} sessionId={tab.sessionId}>
        <React.Suspense fallback={<LazyViewFallback />}>
          <BrowserTabContent tabId={tab.id} sessionId={tab.sessionId} browserTabId={tab.browserTabId ?? ''} />
        </React.Suspense>
      </TabErrorBoundary>
    )
  }

  return (
    <TabErrorBoundary key={tab.sessionId} sessionId={tab.sessionId}>
      <AgentView sessionId={tab.sessionId} />
    </TabErrorBoundary>
  )
}

function TutorialTabContent(): React.ReactElement {
  const [content, setContent] = React.useState('')
  const [loadState, setLoadState] = React.useState<'loading' | 'ready' | 'error'>('loading')
  const tocOpen = useAtomValue(markdownTocOpenAtom)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    window.electronAPI.getTutorialContent()
      .then((result) => {
        if (result === null) {
          setLoadState('error')
          return
        }
        setContent(result)
        setLoadState('ready')
      })
      .catch((error) => {
        console.error(error)
        setLoadState('error')
      })
  }, [])

  if (loadState === 'loading') {
    return <div className="flex h-full items-center justify-center text-xs text-muted-foreground">加载中...</div>
  }

  if (loadState === 'error') {
    return <div className="flex h-full items-center justify-center text-xs text-muted-foreground">教程加载失败</div>
  }

  return (
    <div className="relative flex h-full min-h-0 overflow-hidden">
      <React.Suspense fallback={null}>
        <MarkdownToc containerRef={scrollRef as React.RefObject<HTMLElement>} contentKey={content.slice(0, 100)} enabled={tocOpen} />
      </React.Suspense>
      <div ref={scrollRef} className="flex-1 min-w-0 overflow-y-auto p-8">
        <React.Suspense fallback={<LazyViewFallback />}>
          <MarkdownRichEditor
            value={content}
            editing={false}
            onChange={() => {}}
            onSave={() => {}}
            onCancel={() => {}}
          />
        </React.Suspense>
      </div>
    </div>
  )
}
