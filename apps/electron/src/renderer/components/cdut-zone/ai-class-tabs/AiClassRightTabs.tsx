/**
 * AiClassRightTabs — AI 速课堂右栏 Chrome 风格动态多 Tab 引擎
 *
 * 右栏不再是固定容器，而是完全具备浏览器标签页能力的动态多 Tab 引擎：
 *   - 固定首页（Home，恒居首位、不可关闭）+ 动态标签（导图 / 预览 / 抽认卡 / 测验）；
 *   - 支持拖拽重排、右键菜单（复制 / 关闭 / 关闭其它 / 关闭右侧）、新建；
 *   - 标签拓扑按课堂落盘（~/.cdutai/study-sessions/{sessionId}/tabs.json）。
 *
 * 首页三大功能入口（脑图 / 抽认卡 / 测验）点击后唤起参数配置弹窗，
 * 提交生成请求后自动新建对应标签并切至该 Tab 显示流式骨架与结果。
 */

import * as React from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  BrainCircuit,
  FileText,
  Home,
  Layers,
  ListChecks,
  Loader2,
  Plus,
  X,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  AI_CLASS_HOME_TAB_ID,
  type AiClassRightTabItem,
  type StudyArtifactKind,
  type StudyArtifactSummary,
  type StudyGenerateArtifactInput,
} from '@profer/shared'
import { cn } from '@/lib/utils'
import { Z_LAYER } from '@profer/ui'
import {
  useAiClassActiveTabId,
  useAiClassArtifacts,
  useAiClassGenerating,
  useAiClassTabs,
} from '@/atoms/study-atoms'
import {
  agentChannelIdAtom,
  agentModelIdAtom,
  agentSessionChannelMapAtom,
  agentSessionModelMapAtom,
  agentSessionsAtom,
} from '@/atoms/agent-atoms'
import { previewFileMapAtom } from '@/atoms/preview-atoms'
import { SidebarFilePreview } from '@/components/diff/SidebarFilePreview'
import { AiClassMindMapTab } from './AiClassMindMapTab'
import { AiClassFlashcardTab } from './AiClassFlashcardTab'
import { AiClassQuizTab } from './AiClassQuizTab'
import { AiClassArtifactFormModal } from './AiClassArtifactFormModal'

const TAB_ICON: Record<string, LucideIcon> = {
  home: Home,
  mindmap: BrainCircuit,
  preview: FileText,
  flashcard: Layers,
  quiz: ListChecks,
}

interface AiClassRightTabsProps {
  sessionId: string
}

/** 生成标签 id */
function genTabId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

/** 依据学习工件类型构造对应的右栏动态标签 */
function buildArtifactTab(kind: StudyArtifactKind, id: string, title: string): AiClassRightTabItem {
  if (kind === 'mindmap') {
    return { id: genTabId('tab-mindmap'), type: 'mindmap', title: title || '思维导图', closable: true, data: { mindmapId: id } }
  }
  if (kind === 'flashcard') {
    return { id: genTabId('tab-cards'), type: 'flashcard', title: title || '抽认卡', closable: true, data: { flashcardDeckId: id } }
  }
  return { id: genTabId('tab-quiz'), type: 'quiz', title: title || '测验', closable: true, data: { quizSessionId: id } }
}

/** 读取动态标签所引用的学习工件 id（非工件标签返回空串） */
function tabArtifactId(tab: AiClassRightTabItem): string {
  if (tab.type === 'mindmap') return String(tab.data.mindmapId ?? '')
  if (tab.type === 'flashcard') return String(tab.data.flashcardDeckId ?? '')
  if (tab.type === 'quiz') return String(tab.data.quizSessionId ?? '')
  return ''
}

export function AiClassRightTabs({ sessionId }: AiClassRightTabsProps): React.ReactElement {
  // ===== 按 sessionId 隔离的状态（会话间互不串扰）=====
  const [tabs, setTabs] = useAiClassTabs(sessionId)
  const [activeTabId, setActiveTabId] = useAiClassActiveTabId(sessionId)
  const [generating, setGenerating] = useAiClassGenerating(sessionId)
  const [artifacts, setArtifacts] = useAiClassArtifacts(sessionId)
  const previewFileMap = useAtomValue(previewFileMapAtom)
  const setPreviewFileMap = useSetAtom(previewFileMapAtom)
  const previewFile = previewFileMap.get(sessionId) ?? null

  // 渠道继承：会话绑定渠道 / 模型优先，缺省回退全局默认（主进程再兜底 settings）
  const sessionChannelMap = useAtomValue(agentSessionChannelMapAtom)
  const sessionModelMap = useAtomValue(agentSessionModelMapAtom)
  const globalChannelId = useAtomValue(agentChannelIdAtom)
  const globalModelId = useAtomValue(agentModelIdAtom)
  const agentSessions = useAtomValue(agentSessionsAtom)

  // 右键菜单：记录目标标签与光标锚点（fixed 定位，随点击位置出现）
  const [menuState, setMenuState] = React.useState<{ tabId: string; x: number; y: number } | null>(null)
  const [formKind, setFormKind] = React.useState<'mindmap' | 'flashcard' | 'quiz' | null>(null)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const dragIndexRef = React.useRef<number | null>(null)
  const loadedRef = React.useRef(false)

  // 卸载时清理右键菜单与全局遮罩残留
  React.useEffect(() => {
    return () => setMenuState(null)
  }, [])

  // 当前激活的速课堂会话（后台完成回调据此判断是切标签还是仅 Toast 提醒）
  const activeSessionIdRef = React.useRef(sessionId)
  activeSessionIdRef.current = sessionId

  // 生成序号与取消令牌：令牌为「会话#序号」，跨会话/跨次数互不影响
  const generationSeqRef = React.useRef(new Map<string, number>())
  const cancelledGenRef = React.useRef(new Set<string>())

  // ===== 加载 / 保存多 Tab 拓扑（按课堂）=====
  React.useEffect(() => {
    loadedRef.current = false
    setIsLoaded(false)
    let alive = true
    window.electronAPI.study
      .getTabs(sessionId)
      .then((state) => {
        if (!alive) return
        setTabs(state.tabs)
        setActiveTabId(state.activeTabId)
        loadedRef.current = true
        setIsLoaded(true)
      })
      .catch(() => {
        loadedRef.current = true
        setIsLoaded(true)
      })
    return () => {
      alive = false
    }
  }, [sessionId, setTabs, setActiveTabId])

  React.useEffect(() => {
    if (!loadedRef.current) return
    void window.electronAPI.study.saveTabs({ sessionId, tabs, activeTabId }).catch(() => {})
  }, [sessionId, tabs, activeTabId])

  // ===== 已生成成果总览（本会话内落盘，进入课堂即加载并常驻展示）=====
  const refreshArtifacts = React.useCallback((): void => {
    void window.electronAPI.study
      .listArtifacts(sessionId)
      .then((list) => setArtifacts(list))
      .catch(() => {})
  }, [sessionId, setArtifacts])

  React.useEffect(() => {
    refreshArtifacts()
  }, [refreshArtifacts])

  const tabsRef = React.useRef(tabs)
  tabsRef.current = tabs
  const activeIdRef = React.useRef(activeTabId)
  activeIdRef.current = activeTabId

  // 左栏点击课件 → 自动新建 / 聚焦预览标签
  React.useEffect(() => {
    if (!isLoaded || !previewFile) return
    const existing = tabsRef.current.find((tab) => tab.type === 'preview' && tab.data.filePath === previewFile.filePath)
    if (existing) {
      if (activeIdRef.current !== existing.id) setActiveTabId(existing.id)
      return
    }
    const tab: AiClassRightTabItem = {
      id: genTabId('tab-preview'),
      type: 'preview',
      title: previewFile.filePath.split(/[\\/]/).pop() || '资料预览',
      closable: true,
      data: { filePath: previewFile.filePath },
    }
    setTabs([...tabsRef.current, tab])
    setActiveTabId(tab.id)
  }, [isLoaded, previewFile?.filePath, setTabs, setActiveTabId])

  // 预览关闭同步：SidebarFilePreview 内关闭预览（previewFileMap 置空）后，
  // 移除对应预览标签并回退有效标签，杜绝「空预览死标签」
  const lastPreviewPathRef = React.useRef<string | null>(null)
  React.useEffect(() => {
    lastPreviewPathRef.current = null
  }, [sessionId])
  React.useEffect(() => {
    if (!isLoaded) return
    const currentPath = previewFile?.filePath ?? null
    const previousPath = lastPreviewPathRef.current
    lastPreviewPathRef.current = currentPath
    if (!previousPath || currentPath) return
    const next = tabsRef.current.filter((tab) => !(tab.type === 'preview' && tab.data.filePath === previousPath))
    if (next.length === tabsRef.current.length) return
    setTabs(next)
    if (!next.some((tab) => tab.id === activeIdRef.current)) {
      setActiveTabId(next[next.length - 1]?.id ?? AI_CLASS_HOME_TAB_ID)
    }
  }, [isLoaded, previewFile?.filePath, setTabs, setActiveTabId])

  // 激活标签有效性守卫：持久化拓扑损坏或激活标签被移除时回退，避免激活空标签
  React.useEffect(() => {
    if (!isLoaded || tabs.length === 0) return
    if (!tabs.some((tab) => tab.id === activeTabId)) {
      setActiveTabId(tabs[0]?.id ?? AI_CLASS_HOME_TAB_ID)
    }
  }, [isLoaded, tabs, activeTabId, setActiveTabId])

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0]

  // ===== 标签操作（基于渲染期快照计算，避免在 Jotai updater 内产生副作用）=====

  /** 关闭预览类标签时同步清空会话的 previewFileMap，防止孤儿预览状态残留 */
  const clearPreviewStateForRemovedTabs = React.useCallback(
    (removed: AiClassRightTabItem[]): void => {
      const removedPreviewPaths = new Set(
        removed.filter((tab) => tab.type === 'preview').map((tab) => String(tab.data.filePath ?? '')),
      )
      if (removedPreviewPaths.size === 0) return
      setPreviewFileMap((prev) => {
        const current = prev.get(sessionId)
        if (!current || !removedPreviewPaths.has(current.filePath)) return prev
        const next = new Map(prev)
        next.set(sessionId, null)
        return next
      })
    },
    [sessionId, setPreviewFileMap],
  )

  const closeTab = (tabId: string): void => {
    const target = tabsRef.current.find((tab) => tab.id === tabId)
    if (!target || !target.closable) return
    const next = tabsRef.current.filter((tab) => tab.id !== tabId)
    setTabs(next)
    clearPreviewStateForRemovedTabs([target])
    if (activeIdRef.current === tabId) setActiveTabId(next[next.length - 1]?.id ?? AI_CLASS_HOME_TAB_ID)
    setMenuState(null)
  }

  const closeOthers = (tabId: string): void => {
    const removed = tabsRef.current.filter((tab) => tab.closable && tab.id !== tabId && tab.type !== 'home')
    const next = tabsRef.current.filter((tab) => !tab.closable || tab.id === tabId || tab.type === 'home')
    setTabs(next)
    clearPreviewStateForRemovedTabs(removed)
    setActiveTabId(tabId)
    setMenuState(null)
  }

  const closeRight = (tabId: string): void => {
    const index = tabsRef.current.findIndex((tab) => tab.id === tabId)
    if (index < 0) return
    const removed = tabsRef.current.filter((tab, i) => i > index && tab.closable)
    const next = tabsRef.current.filter((tab, i) => i <= index || !tab.closable)
    setTabs(next)
    clearPreviewStateForRemovedTabs(removed)
    if (!next.some((tab) => tab.id === activeIdRef.current)) {
      setActiveTabId(tabId)
    }
    setMenuState(null)
  }

  /**
   * 点击切换标签：预览类标签必须实时联动更新 previewFileMap，
   * 否则预览内容将永远停留在初次打开的文件上（切换 Tab 内容纹丝不动的根因）。
   */
  const handleTabClick = (tab: AiClassRightTabItem): void => {
    setActiveTabId(tab.id)
    const targetPath = tab.data.filePath
    if (tab.type === 'preview' && typeof targetPath === 'string' && targetPath) {
      setPreviewFileMap((prev) => {
        const current = prev.get(sessionId)
        if (current?.filePath === targetPath) return prev
        const next = new Map(prev)
        next.set(sessionId, { filePath: targetPath, previewOnly: true, readOnly: true })
        return next
      })
    }
  }

  const duplicateTab = (tabId: string): void => {
    const index = tabsRef.current.findIndex((tab) => tab.id === tabId)
    const target = tabsRef.current[index]
    if (!target) return
    const clone: AiClassRightTabItem = {
      ...target,
      id: genTabId('tab-dup'),
      title: `${target.title} · 副本`,
      data: { ...target.data },
    }
    const next = [...tabsRef.current]
    next.splice(index + 1, 0, clone)
    setTabs(next)
    setActiveTabId(clone.id)
    setMenuState(null)
  }

  const reorder = (from: number, to: number): void => {
    if (from === to) return
    const next = [...tabsRef.current]
    const [moved] = next.splice(from, 1)
    if (!moved) return
    next.splice(to, 0, moved)
    // 首位固定 Home：若 Home 被挪动则复位至首位
    const homeIndex = next.findIndex((tab) => tab.type === 'home')
    if (homeIndex > 0) {
      const [home] = next.splice(homeIndex, 1)
      if (home) next.unshift(home)
    }
    setTabs(next)
  }

  // ===== 生成学习工件（会话绑定 + 后台完成提醒） =====
  const handleGenerate = React.useCallback(
    async (input: StudyGenerateArtifactInput): Promise<void> => {
      // 递增本会话的生成序号：取消令牌按「会话#序号」生效，跨会话/跨次数互不影响
      const genId = (generationSeqRef.current.get(sessionId) ?? 0) + 1
      generationSeqRef.current.set(sessionId, genId)
      const genToken = `${sessionId}#${genId}`
      const isCancelled = (): boolean => cancelledGenRef.current.has(genToken)

      setGenerating(input.kind)
      setFormKind(null)
      try {
        const result = await window.electronAPI.study.generateArtifact({
          ...input,
          sessionId,
          channelId: sessionChannelMap.get(sessionId) ?? globalChannelId ?? undefined,
          modelId: sessionModelMap.get(sessionId) ?? globalModelId ?? undefined,
        })
        const tab =
          result.kind === 'mindmap'
            ? buildArtifactTab('mindmap', result.mindmap.id, result.mindmap.title || '思维导图')
            : result.kind === 'flashcard'
              ? buildArtifactTab('flashcard', result.deck.id, result.deck.title || '抽认卡')
              : buildArtifactTab('quiz', result.quiz.id, result.quiz.title || '测验')
        // 先归档至本会话的隔离缓存（后台完成也不丢成果），再按当前停留会话决定展示方式
        setTabs((prev) => [...prev, tab])
        refreshArtifacts()
        if (isCancelled()) return
        if (activeSessionIdRef.current === sessionId) {
          setActiveTabId(tab.id)
          toast.success('生成完成，已在新标签中打开')
        } else {
          // 用户已切换到其他会话：仅全局 Toast 提醒，不打断当前会话
          const title = agentSessions.find((session) => session.id === sessionId)?.title || '当前课堂'
          toast.success(`《${title}》的${KIND_META[input.kind].label}已生成完成`)
        }
      } catch (error) {
        if (!isCancelled()) {
          toast.error(error instanceof Error ? error.message : '生成失败，请重试')
        }
      } finally {
        cancelledGenRef.current.delete(genToken)
        // 仅当仍是本会话最新一次生成时才解除加载锁，避免误清新发起的生成状态
        if (generationSeqRef.current.get(sessionId) === genId) setGenerating(null)
      }
    },
    [sessionId, setGenerating, setTabs, setActiveTabId, refreshArtifacts, sessionChannelMap, sessionModelMap, globalChannelId, globalModelId, agentSessions],
  )

  /** 手动取消当前会话的生成：立即解除加载锁；后台请求完成后仅静默归档，不再提示 */
  const cancelGeneration = React.useCallback((): void => {
    const genId = generationSeqRef.current.get(sessionId)
    if (genId != null) cancelledGenRef.current.add(`${sessionId}#${genId}`)
    setGenerating(null)
  }, [sessionId, setGenerating])

  /** 从「已生成成果」列表打开（复用已存在标签，否则新建） */
  const openArtifact = React.useCallback(
    (summary: StudyArtifactSummary): void => {
      const existing = tabsRef.current.find((tab) => tab.type === summary.kind && tabArtifactId(tab) === summary.id)
      if (existing) {
        setActiveTabId(existing.id)
        return
      }
      const tab = buildArtifactTab(summary.kind, summary.id, summary.title)
      setTabs((prev) => [...prev, tab])
      setActiveTabId(tab.id)
    },
    [setActiveTabId, setTabs],
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* ===== Chrome 风格标签栏 ===== */}
      <div className="flex shrink-0 items-center gap-0.5 border-b border-border/60 bg-muted/30 px-1.5 py-1">
        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {tabs.map((tab, index) => {
            const Icon = TAB_ICON[tab.type] ?? FileText
            const isActive = tab.id === activeTab?.id
            return (
              <div
                key={tab.id}
                draggable={tab.closable}
                onDragStart={() => {
                  dragIndexRef.current = index
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  const from = dragIndexRef.current
                  if (from !== null) reorder(from, index)
                  dragIndexRef.current = null
                }}
                onContextMenu={(event) => {
                  event.preventDefault()
                  if (!tab.closable) return
                  // 菜单锚定光标位置（fixed 坐标系），并夹取到视口内避免溢出被裁切
                  const MENU_W = 144
                  const MENU_H = 136
                  setMenuState({
                    tabId: tab.id,
                    x: Math.max(8, Math.min(event.clientX, window.innerWidth - MENU_W - 8)),
                    y: Math.max(8, Math.min(event.clientY, window.innerHeight - MENU_H - 8)),
                  })
                }}
                // 中键直接关闭标签（浏览器惯例），并阻止中键自动滚动
                onMouseDown={(event) => {
                  if (event.button === 1 && tab.closable) {
                    event.preventDefault()
                    closeTab(tab.id)
                  }
                }}
                onClick={() => handleTabClick(tab)}
                data-tour-tab={tab.type}
                className={cn(
                  'group/tab flex max-w-[170px] shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-[11px] transition-colors',
                  isActive
                    ? 'bg-background font-medium text-foreground shadow-sm ring-1 ring-border/60'
                    : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                )}
                title={tab.title}
              >
                <Icon size={12} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate">{tab.title}</span>
                {tab.closable && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      closeTab(tab.id)
                    }}
                    className="shrink-0 rounded p-0.5 text-muted-foreground/60 opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover/tab:opacity-100"
                    title="关闭标签页"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => setActiveTabId(AI_CLASS_HOME_TAB_ID)}
          title="回到学习主页"
          className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* ===== 标签右键菜单（锚定光标，fixed 定位） ===== */}
      {menuState && (
        <>
          <div
            className={`fixed inset-0 ${Z_LAYER.drawer}`}
            onClick={() => setMenuState(null)}
            onContextMenu={(e) => { e.preventDefault(); setMenuState(null) }}
          />
          <div
            className={`fixed ${Z_LAYER.menu} w-36 overflow-hidden rounded-lg border border-border/70 bg-popover py-1 text-[11px] shadow-lg`}
            style={{ left: menuState.x, top: menuState.y }}
            role="menu"
          >
            <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-muted" onClick={() => duplicateTab(menuState.tabId)}>
              复制标签页
            </button>
            <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-muted" onClick={() => closeTab(menuState.tabId)}>
              关闭标签页
            </button>
            <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-muted" onClick={() => closeOthers(menuState.tabId)}>
              关闭其它标签页
            </button>
            <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-muted" onClick={() => closeRight(menuState.tabId)}>
              关闭右侧标签页
            </button>
          </div>
        </>
      )}

      {/* ===== 标签内容承载区 ===== */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {activeTab?.type === 'home' && (
          <AiClassHomeView
            generating={generating}
            artifacts={artifacts}
            onPick={setFormKind}
            onOpenArtifact={openArtifact}
            onCancel={cancelGeneration}
          />
        )}
        {activeTab?.type === 'preview' && (
          <div className="flex h-full min-h-0 flex-col">
            {/* 动态唯一 key：文件路径变化时强制重挂载，确保重新加载文件流 */}
            <SidebarFilePreview key={previewFile?.filePath || 'empty'} sessionId={sessionId} />
          </div>
        )}
        {activeTab?.type === 'mindmap' && (
          <div data-tour="ai-class-mindmap-view" className="h-full">
            <AiClassMindMapTab sessionId={sessionId} mindmapId={String(activeTab.data.mindmapId ?? '')} />
          </div>
        )}
        {activeTab?.type === 'flashcard' && (
          <div data-tour="ai-class-flashcard-view" className="h-full">
            <AiClassFlashcardTab sessionId={sessionId} deckId={String(activeTab.data.flashcardDeckId ?? '')} />
          </div>
        )}
        {activeTab?.type === 'quiz' && (
          <div data-tour="ai-class-quiz-view" className="h-full">
            <AiClassQuizTab sessionId={sessionId} quizId={String(activeTab.data.quizSessionId ?? '')} />
          </div>
        )}
      </div>

      {/* ===== 生成参数弹窗 ===== */}
      {formKind && (
        <AiClassArtifactFormModal
          kind={formKind}
          onCancel={() => setFormKind(null)}
          onConfirm={(input) => void handleGenerate(input)}
        />
      )}
    </div>
  )
}

/** 已生成成果的展示元信息（图标 / 名称 / 计量单位） */
const KIND_META: Record<StudyArtifactKind, { label: string; unit: string; icon: LucideIcon }> = {
  mindmap: { label: '思维导图', unit: '节点', icon: BrainCircuit },
  flashcard: { label: '抽认卡', unit: '张', icon: Layers },
  quiz: { label: '自测练习', unit: '题', icon: ListChecks },
}

/** 首页：三大功能快捷入口卡片 + 生成中骨架（可手动取消）+ 已生成成果常驻列表 */
function AiClassHomeView({
  generating,
  artifacts,
  onPick,
  onOpenArtifact,
  onCancel,
}: {
  generating: 'mindmap' | 'flashcard' | 'quiz' | null
  artifacts: StudyArtifactSummary[]
  onPick: (kind: 'mindmap' | 'flashcard' | 'quiz') => void
  onOpenArtifact: (summary: StudyArtifactSummary) => void
  onCancel: () => void
}): React.ReactElement {
  const cards: Array<{ kind: 'mindmap' | 'flashcard' | 'quiz'; icon: React.ReactNode; title: string; desc: string }> = [
    { kind: 'mindmap', icon: <BrainCircuit size={20} />, title: '思维导图', desc: '双曲投影知识脑图，支持拖拽与 OPML 导出' },
    { kind: 'flashcard', icon: <Layers size={20} />, title: '抽认卡', desc: '原子命题卡片，FSRS-7 记忆调度智能复习' },
    { kind: 'quiz', icon: <ListChecks size={20} />, title: '自测练习', desc: '无重叠干扰项命题，实时判错溯源与能力评估' },
  ]
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto p-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
          学习主页
        </span>
        <p className="text-[11px] text-muted-foreground">选择一种认知训练方式，一键生成专属学习成果。</p>
      </div>
      {generating && (
        <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-[11px] text-primary">
          <Loader2 size={13} className="shrink-0 animate-spin" />
          <span className="min-w-0 flex-1 text-center">
            正在生成{generating === 'mindmap' ? '思维导图' : generating === 'flashcard' ? '抽认卡' : '自测练习'}…
          </span>
          <button
            type="button"
            onClick={onCancel}
            title="取消本次生成，立即解除等待"
            className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            取消
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-2.5">
        {cards.map((card) => (
          <button
            key={card.kind}
            type="button"
            disabled={!!generating}
            onClick={() => onPick(card.kind)}
            className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-3 text-left transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm disabled:opacity-50"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              {card.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-foreground">{card.title}</span>
              <span className="block text-[10px] leading-relaxed text-muted-foreground">{card.desc}</span>
            </span>
          </button>
        ))}
      </div>

      {/* 已生成成果：本会话内落盘常驻，点击即可重新打开对应标签 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center rounded-full bg-muted/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            已生成成果
          </span>
          <span className="text-[10px] text-muted-foreground/70">{artifacts.length}</span>
        </div>
        {artifacts.length === 0 ? (
          <p className="rounded-lg bg-muted/40 px-2 py-2 text-center text-[11px] text-muted-foreground">
            本课堂尚未生成成果，点击上方卡片即可创建。
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {artifacts.map((item) => {
              const meta = KIND_META[item.kind]
              const Icon = meta.icon
              return (
                <button
                  key={`${item.kind}:${item.id}`}
                  type="button"
                  disabled={!!generating}
                  onClick={() => onOpenArtifact(item)}
                  title={item.title}
                  className="group flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-2.5 py-2 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon size={14} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-medium text-foreground">{item.title}</span>
                    <span className="block text-[10px] text-muted-foreground">
                      {meta.label} · {item.itemCount} {meta.unit}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
