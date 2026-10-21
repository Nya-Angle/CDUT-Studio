/**
 * CDUT Science 科学助理独立窗口
 *
 * 与主窗口共享同一份 preload 与 Pi Agent 内核；本组件只负责：
 * 1. 水合当前实验室绑定的研讨会话列表；
 * 2. 复用 AgentView 渲染对话；
 * 3. 接收主窗口上下文并预填输入框（不自动发送）；
 * 4. 提供科学快捷动作。
 */

import * as React from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Atom, Download, Loader2, MessageSquarePlus, Paperclip, Sigma, Sparkles } from 'lucide-react'
import type { AgentSessionMeta, CsLabAgentContext } from '@profer/shared'
import { detectIsMac, detectIsWindows } from '@profer/ui'
import { cn } from '@/lib/utils'
import { agentComposerInjectionAtom, agentSessionsAtom } from '@/atoms/agent-atoms'
import { activeTabIdAtom } from '@/atoms/tab-atoms'
import { AgentView } from '@/components/agent/AgentView'
import { WindowControls } from '@/components/WindowControls'

interface ScienceAgentWindowViewProps {
  labId: string
  windowId: string
  focusSessionId?: string
}

/** 科学快捷动作：只预填提示词，发送仍由用户确认。 */
const QUICK_ACTIONS: Array<{ label: string; icon: typeof Sigma; prompt: string }> = [
  {
    label: '拟合当前选区',
    icon: Sigma,
    prompt: '请对当前绘图在最近一次框选区间内执行多峰解叠拟合，并用 cslab_render_plot 把拟合曲线追加到画板。',
  },
  {
    label: '计算理论 PXRD',
    icon: Atom,
    prompt: '请读取当前挂接的晶体结构资产，模拟理论 PXRD，并给出前 10 条主峰的 (hkl)、d 值与 2θ。',
  },
  {
    label: '分析晶体结构',
    icon: Sparkles,
    prompt: '请分析当前挂接的晶体结构，输出空间群、晶胞参数、化学式与 Wyckoff 占位列表。',
  },
  {
    label: '导出高清图',
    icon: Download,
    prompt: '请把当前绘图导出为 600 dpi 的 PNG 出版图，并返回文件路径与物理尺寸。',
  },
]

/** 合并会话列表：新数据覆盖旧字段，避免丢失既有会话。 */
function mergeSessionLists(previous: AgentSessionMeta[], incoming: AgentSessionMeta[]): AgentSessionMeta[] {
  const map = new Map(previous.map((session) => [session.id, session]))
  for (const session of incoming) {
    map.set(session.id, { ...map.get(session.id), ...session })
  }
  return Array.from(map.values())
}

export function ScienceAgentWindowView({
  labId,
  windowId,
  focusSessionId,
}: ScienceAgentWindowViewProps): React.ReactElement {
  const isMac = React.useMemo(() => detectIsMac(), [])
  const isWindows = React.useMemo(() => detectIsWindows(), [])
  const setAgentSessions = useSetAtom(agentSessionsAtom)
  const setComposerInjection = useSetAtom(agentComposerInjectionAtom)
  const setActiveTabId = useSetAtom(activeTabIdAtom)
  const sessionsInStore = useAtomValue(agentSessionsAtom)

  const [labName, setLabName] = React.useState('')
  const [sessions, setSessions] = React.useState<AgentSessionMeta[]>([])
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(null)
  const [context, setContext] = React.useState<CsLabAgentContext | null>(null)
  const [ready, setReady] = React.useState(false)
  const [creating, setCreating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const bootstrappedRef = React.useRef(false)
  const activeSessionIdRef = React.useRef<string | null>(null)
  activeSessionIdRef.current = activeSessionId

  const injectPrompt = React.useCallback(
    (sessionId: string, text: string): void => {
      setComposerInjection({ sessionId, text, nonce: Date.now() })
    },
    [setComposerInjection],
  )

  /** 创建会话并完成实验室绑定；绑定成功前不允许激活，避免工具未注入。 */
  const createBoundSession = React.useCallback(
    async (title: string): Promise<AgentSessionMeta> => {
      const created = await window.electronAPI.createAgentSession(title)
      await window.electronAPI.cslab.bindSessionLab({ sessionId: created.id, labId })
      return { ...created, cslabLabId: labId }
    },
    [labId],
  )

  const activateSession = React.useCallback(
    (sessionId: string): void => {
      setActiveSessionId(sessionId)
      // AgentView 用 activeTabId === sessionId 判定是否接管回车发送等快捷键。
      setActiveTabId(sessionId)
    },
    [setActiveTabId],
  )

  // 初始化：实验室信息 + 已绑定会话 + 初始上下文
  React.useEffect(() => {
    if (bootstrappedRef.current) return
    bootstrappedRef.current = true

    void (async () => {
      if (!labId) {
        setError('缺少实验室标识，无法打开科学助理')
        return
      }
      try {
        const snapshot = await window.electronAPI.cslab.getLabSnapshot(labId)
        setLabName(snapshot?.lab.name ?? '实验室')

        const list = await window.electronAPI.listAgentSessions()
        let bound = list
          .filter((session) => !session.archived && session.cslabLabId === labId)
          .sort((left, right) => right.updatedAt - left.updatedAt)

        // 开箱即用：实验室内没有任何研讨会话时自动建立第一个并完成绑定。
        if (bound.length === 0) {
          bound = [await createBoundSession('研讨会话 1')]
        }

        setSessions(bound)
        setAgentSessions((previous) => mergeSessionLists(previous, bound))

        const preferred = focusSessionId && bound.some((session) => session.id === focusSessionId)
          ? focusSessionId
          : bound[0]!.id
        activateSession(preferred)
        setReady(true)

        const initialContext = await window.electronAPI.cslab.getAgentWindowContext(windowId)
        if (initialContext) {
          setContext(initialContext)
          injectPrompt(preferred, initialContext.prompt)
        }
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : '初始化科学助理失败')
      }
    })()
  }, [activateSession, createBoundSession, focusSessionId, injectPrompt, labId, setAgentSessions, windowId])

  // 主窗口后续投递的上下文
  React.useEffect(() => {
    const off = window.electronAPI.cslab.onAgentContext((incoming) => {
      if (incoming.labId !== labId) return
      setContext(incoming)
      const target = activeSessionIdRef.current
      if (target) injectPrompt(target, incoming.prompt)
    })
    return off
  }, [injectPrompt, labId])

  const handleCreateSession = React.useCallback(async (): Promise<void> => {
    if (creating) return
    setCreating(true)
    try {
      const created = await createBoundSession(`研讨会话 ${sessions.length + 1}`)
      setSessions((previous) => [created, ...previous])
      setAgentSessions((previous) => mergeSessionLists(previous, [created]))
      activateSession(created.id)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '新建研讨会话失败')
    } finally {
      setCreating(false)
    }
  }, [activateSession, createBoundSession, creating, sessions.length, setAgentSessions])

  // 会话标题由 Agent 自动生成后会回写全局 atom；优先以 atom 为准，保持侧栏标题实时。
  const sessionList = React.useMemo(() => {
    const bound = sessionsInStore.filter((session) => !session.archived && session.cslabLabId === labId)
    const source = bound.length > 0 ? bound : sessions
    return [...source].sort((left, right) => right.updatedAt - left.updatedAt)
  }, [labId, sessions, sessionsInStore])

  const activeSession = sessionList.find((session) => session.id === activeSessionId)
  const attachedLabel = context?.plotTitle ?? context?.assetUri ?? null

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-background text-foreground">
      <header
        className="relative flex h-11 shrink-0 items-center gap-2 border-b bg-card/80 px-3"
        style={{ paddingLeft: isMac ? 84 : 12 }}
      >
        <div className="titlebar-drag-region absolute inset-y-0 left-0 right-0" aria-hidden="true" />
        <div className="titlebar-no-drag relative flex min-w-0 items-center gap-2">
          <span className="inline-flex size-5 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Sparkles className="size-3" />
          </span>
          <span className="truncate text-xs font-medium">{labName || '科学助理'}</span>
          {activeSession && (
            <span className="truncate text-[10px] text-muted-foreground">· {activeSession.title}</span>
          )}
        </div>
        <div className="titlebar-no-drag relative ml-auto flex items-center">
          {isWindows && <WindowControls variant="inline" />}
        </div>
      </header>

      <div className="titlebar-no-drag flex flex-wrap items-center gap-1.5 border-b bg-muted/20 px-3 py-1.5">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              type="button"
              disabled={!activeSessionId}
              onClick={() => {
                if (!activeSessionId) return
                injectPrompt(activeSessionId, action.prompt)
              }}
              className="inline-flex items-center gap-1 rounded-full border bg-card px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              <Icon className="size-3" />
              {action.label}
            </button>
          )
        })}
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[188px] shrink-0 flex-col border-r bg-muted/20">
          <div className="flex items-center justify-between px-2.5 py-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <span>研讨会话</span>
            <span>{sessionList.length}</span>
          </div>
          <button
            type="button"
            onClick={() => void handleCreateSession()}
            disabled={creating || !ready}
            className="mx-2 mb-1.5 inline-flex items-center justify-center gap-1 rounded-lg border border-dashed px-2 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-card hover:text-foreground disabled:opacity-50"
          >
            {creating ? <Loader2 className="size-3 animate-spin" /> : <MessageSquarePlus className="size-3" />}
            新建会话
          </button>
          <div className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-2">
            {sessionList.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => activateSession(session.id)}
                className={cn(
                  'mb-1 flex w-full items-start gap-1.5 rounded-lg px-2 py-1.5 text-left text-[11px] transition-colors',
                  session.id === activeSessionId
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-card/70 hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'mt-1 size-1.5 shrink-0 rounded-full',
                    session.id === activeSessionId ? 'bg-primary' : 'bg-border',
                  )}
                />
                <span className="min-w-0 flex-1 truncate">{session.title}</span>
              </button>
            ))}
          </div>
          {attachedLabel && (
            <div className="flex items-start gap-1 border-t px-2.5 py-2 text-[10px] leading-relaxed text-muted-foreground">
              <Paperclip className="mt-0.5 size-3 shrink-0" />
              <div className="min-w-0">
                <div className="truncate">当前挂接：{attachedLabel}</div>
                {context?.roi && (
                  <div className="mt-0.5">
                    ROI {context.roi.xMin.toFixed(2)} – {context.roi.xMax.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>

        <main className="relative flex min-w-0 flex-1 flex-col">
          {error && (
            <div className="m-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}
          {!ready && !error && (
            <div className="flex h-full items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              正在准备科学助理…
            </div>
          )}
          {ready && activeSessionId && <AgentView sessionId={activeSessionId} />}
        </main>
      </div>
    </div>
  )
}
