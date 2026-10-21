/**
 * CsLabToolsPanel — 实验室 Python 工具与运行时
 *
 * 仅展示真实扫描结果与执行结果；无工具、无 Python 或执行失败都如实标注。
 * 会话绑定是唯一注入路径，禁止全局 activeLabId。
 */

import * as React from 'react'
import { useAtom } from 'jotai'
import {
  Boxes,
  Check,
  FlaskConical,
  Loader2,
  Play,
  RefreshCw,
  Unlink,
  Wrench,
} from 'lucide-react'
import type { AgentSessionMeta, CsLabCustomTool, CsLabToolProfile } from '@profer/shared'
import { cn } from '@/lib/utils'
import {
  cslabCustomToolsAtom,
  cslabToolDepsProgressAtom,
  cslabToolRuntimeAtom,
} from '@/atoms/cslab-atoms'

interface CsLabToolsPanelProps {
  labId: string
  onToast: (kind: 'info' | 'success' | 'error', text: string) => void
  /** 从数据集动作栏进入时携带的数据表绝对路径。 */
  initialPath?: string | null
}

const ENGINE_LABEL: Record<string, string> = {
  ast: 'AST 静态分析',
  heuristic: '启发式解析',
  none: '未检测到工具',
}

const PROFILE_OPTIONS: Array<{ value: CsLabToolProfile; label: string }> = [
  { value: 'plot', label: '图表数字化（numpy/OpenCV/SciPy）' },
  { value: 'formula', label: '公式验算（SymPy）' },
  { value: 'instrument', label: '仪器增强（h5py/yadg）' },
]

function signature(tool: CsLabCustomTool): string {
  const params = tool.params
    .map((param) => `${param.name}${param.required ? '' : '?'}: ${param.annotation ?? param.jsonType}`)
    .join(', ')
  return `${tool.name}(${params})${tool.returns ? ` -> ${tool.returns}` : ''}`
}

/** 生成参数 JSON：先套用函数默认值，再把数据表路径注入最匹配的字符串参数。 */
function buildArgsText(tool: CsLabCustomTool, path?: string | null): string {
  const args: Record<string, unknown> = {}
  for (const param of tool.params) {
    if (param.defaultValue === undefined) continue
    const raw = param.defaultValue.trim()
    if (param.jsonType === 'number' || param.jsonType === 'integer') {
      const value = Number(raw)
      if (Number.isFinite(value)) args[param.name] = value
    } else if (param.jsonType === 'boolean') {
      args[param.name] = raw === 'True' || raw === 'true'
    } else if (raw.startsWith("'") || raw.startsWith('"')) {
      args[param.name] = raw.slice(1, -1)
    }
  }

  if (path) {
    const target = tool.params.find(
      (param) =>
        param.jsonType === 'string' && /path|file|data|input/i.test(param.name),
    )
    args[target?.name ?? 'path'] = path
  }
  return JSON.stringify(args, null, 2)
}

export function CsLabToolsPanel({
  labId,
  onToast,
  initialPath,
}: CsLabToolsPanelProps): React.ReactElement {
  const [scan, setScan] = useAtom(cslabCustomToolsAtom)
  const [runtime, setRuntime] = useAtom(cslabToolRuntimeAtom)
  const [progress] = useAtom(cslabToolDepsProgressAtom)

  const [busy, setBusy] = React.useState<'scan' | 'uv' | 'install' | 'run' | 'bind' | null>(null)
  const [profile, setProfile] = React.useState<CsLabToolProfile>('plot')
  const [selectedTool, setSelectedTool] = React.useState<string>('')
  const [argsText, setArgsText] = React.useState('{}')
  const [runResult, setRunResult] = React.useState<string | null>(null)
  const [sessions, setSessions] = React.useState<AgentSessionMeta[]>([])
  const [sessionId, setSessionId] = React.useState('')
  const [message, setMessage] = React.useState<string | null>(null)
  const seedAppliedRef = React.useRef('')

  React.useEffect(() => {
    if (!initialPath) {
      seedAppliedRef.current = ''
      return
    }
    const tool = scan?.tools.find((item) => item.name === selectedTool)
    if (!tool) return
    const key = `${initialPath}|${tool.name}`
    if (seedAppliedRef.current === key) return
    seedAppliedRef.current = key
    setArgsText(buildArgsText(tool, initialPath))
  }, [initialPath, scan, selectedTool])

  const refreshRuntime = React.useCallback(async (): Promise<void> => {
    try {
      setRuntime(await window.electronAPI.cslab.getToolRuntime(labId))
    } catch {
      setRuntime(null)
    }
  }, [labId, setRuntime])

  const refreshTools = React.useCallback(
    async (forceRefresh = false): Promise<void> => {
      setBusy('scan')
      try {
        const next = forceRefresh
          ? await window.electronAPI.cslab.refreshCustomTools(labId)
          : await window.electronAPI.cslab.listCustomTools(labId)
        setScan(next)
        setMessage(next.message)
        if (next.tools.length > 0) {
          setSelectedTool((current) => current || next.tools[0]!.name)
        }
        if (forceRefresh) onToast('success', next.message)
      } catch (error) {
        onToast('error', error instanceof Error ? error.message : '工具扫描失败')
      } finally {
        setBusy(null)
      }
    },
    [labId, onToast, setScan],
  )

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      await refreshTools(false)
      await refreshRuntime()
      try {
        const list = await window.electronAPI.listAgentSessions()
        if (!cancelled) {
          const recent = list.filter((session) => !session.archived).slice(0, 20)
          setSessions(recent)
          const bound = recent.find((session) => session.cslabLabId === labId)
          setSessionId(bound?.id ?? recent[0]?.id ?? '')
        }
      } catch {
        if (!cancelled) setSessions([])
      }
    })()

    const off = window.electronAPI.cslab.onToolsChanged((event) => {
      if (event.labId !== labId) return
      setScan(event.scan)
    })

    return () => {
      cancelled = true
      off()
    }
    // 仅随实验室切换重置。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labId])

  const ensureUv = async (): Promise<void> => {
    setBusy('uv')
    try {
      const result = await window.electronAPI.cslab.ensureUv(labId)
      onToast(result.ok ? 'success' : 'info', result.message)
      await refreshRuntime()
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : 'uv 探测失败')
    } finally {
      setBusy(null)
    }
  }

  const installDeps = async (): Promise<void> => {
    setBusy('install')
    try {
      const status = await window.electronAPI.cslab.installToolDeps({ labId, profile })
      setRuntime(status)
      onToast('success', `依赖已安装：${PROFILE_OPTIONS.find((item) => item.value === profile)?.label ?? profile}`)
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '依赖安装失败')
    } finally {
      setBusy(null)
    }
  }

  const runTool = async (): Promise<void> => {
    if (!selectedTool) return
    let args: Record<string, unknown>
    try {
      const parsed = JSON.parse(argsText || '{}') as unknown
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('参数必须是 JSON 对象')
      }
      args = parsed as Record<string, unknown>
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '参数 JSON 无效')
      return
    }
    setBusy('run')
    setRunResult(null)
    try {
      const result = await window.electronAPI.cslab.runCustomTool({
        labId,
        name: selectedTool,
        args,
      })
      setRunResult(
        result.ok
          ? JSON.stringify(result.result, null, 2)
          : `${result.error ?? '执行失败'}\n（${result.elapsedMs} ms）`,
      )
      onToast(result.ok ? 'success' : 'error', result.ok ? '工具执行完成' : '工具执行失败')
    } catch (error) {
      setRunResult(error instanceof Error ? error.message : '工具执行失败')
    } finally {
      setBusy(null)
    }
  }

  const bindSession = async (bind: boolean): Promise<void> => {
    if (!sessionId) {
      onToast('info', '请选择一个会话')
      return
    }
    setBusy('bind')
    try {
      const result = bind
        ? await window.electronAPI.cslab.bindSessionLab({ sessionId, labId })
        : await window.electronAPI.cslab.unbindSessionLab({ sessionId })
      setSessions((previous) =>
        previous.map((session) =>
          session.id === sessionId
            ? { ...session, cslabLabId: result.labId ?? undefined }
            : session,
        ),
      )
      onToast('success', result.message)
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '会话绑定失败')
    } finally {
      setBusy(null)
    }
  }

  const currentSession = sessions.find((session) => session.id === sessionId)
  const selectedToolMeta = scan?.tools.find((tool) => tool.name === selectedTool)

  return (
    <div className="space-y-4">
      {initialPath && (
        <section className="rounded-xl border border-cslab-accent/30 bg-cslab-accent/5 px-3 py-2">
          <p className="text-[10px] font-medium text-cslab-accent">已注入当前数据表路径</p>
          <p className="mt-0.5 truncate font-mono text-[10px] text-cslab-muted" title={initialPath}>
            {initialPath}
          </p>
        </section>
      )}
      <section className="rounded-xl border border-cslab-border bg-cslab-elevated/70 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-cslab-border px-2 py-0.5 text-[10px] text-cslab-muted">
            <Boxes size={10} /> {ENGINE_LABEL[scan?.engine ?? 'none'] ?? scan?.engine}
          </span>
          <span className="text-[10px] text-cslab-muted">{scan?.tools.length ?? 0} 个函数</span>
          <button
            type="button"
            disabled={busy === 'scan'}
            onClick={() => void refreshTools(true)}
            className="ml-auto inline-flex items-center gap-1 rounded-lg border border-cslab-border px-2 py-1 text-[10px] text-cslab-muted hover:text-cslab-text disabled:opacity-50"
          >
            <RefreshCw size={10} className={busy === 'scan' ? 'animate-spin' : undefined} /> 重新扫描
          </button>
        </div>
        {message && <p className="mt-2 text-[10px] leading-relaxed text-cslab-muted">{message}</p>}
        <p className="mt-1 text-[10px] leading-relaxed text-cslab-muted/80">
          放置路径：runtime/tools/*.py · 顶层函数（非 _ 开头）会被装配为 Agent 工具
        </p>
      </section>

      <section className="rounded-xl border border-cslab-border bg-cslab-elevated/70 p-3">
        <div className="flex items-center gap-2">
          <Wrench size={11} className="text-cslab-muted" />
          <span className="text-[10px] uppercase tracking-[0.14em] text-cslab-muted">运行时</span>
          <span className="ml-auto text-[10px] text-cslab-muted">
            {runtime?.venvPath ? '实验室 .venv' : runtime?.pythonPath ? '系统 Python' : '未检测到 Python'}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <select
            value={profile}
            onChange={(event) => setProfile(event.target.value as CsLabToolProfile)}
            className="min-w-0 flex-1 rounded-lg border border-cslab-border bg-cslab-bg px-2 py-1 text-[10px] text-cslab-text outline-none"
          >
            {PROFILE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={busy === 'install'}
            onClick={() => void installDeps()}
            className="rounded-lg bg-cslab-accent px-2 py-1 text-[10px] font-medium text-white hover:bg-cslab-accentHover disabled:opacity-50"
          >
            {busy === 'install' ? '安装中…' : '安装依赖'}
          </button>
          <button
            type="button"
            disabled={busy === 'uv'}
            onClick={() => void ensureUv()}
            className="rounded-lg border border-cslab-border px-2 py-1 text-[10px] text-cslab-muted hover:text-cslab-text disabled:opacity-50"
          >
            {busy === 'uv' ? '探测中…' : '确保 uv'}
          </button>
        </div>
        {progress && progress.labId === labId && (
          <p className="mt-1.5 truncate text-[10px] text-cslab-muted">
            {progress.stage} · {progress.message}
          </p>
        )}
        {runtime?.note && <p className="mt-1 text-[10px] leading-relaxed text-cslab-muted">{runtime.note}</p>}
      </section>

      <section className="space-y-1">
        {(scan?.tools ?? []).length === 0 ? (
          <div className="rounded-xl border border-dashed border-cslab-border px-4 py-6 text-center">
            <FlaskConical size={16} className="mx-auto text-cslab-muted/60" />
            <p className="mt-1.5 font-serif text-sm text-cslab-text">还没有可装配的科研工具</p>
            <p className="mt-1 text-[10px] leading-relaxed text-cslab-muted">
              在实验室目录 runtime/tools 放入 .py 文件，函数需带类型注解与 docstring。
            </p>
          </div>
        ) : (
          scan?.tools.map((tool) => (
            <button
              key={`${tool.moduleRelPath}:${tool.name}`}
              type="button"
              onClick={() => {
                setSelectedTool(tool.name)
                setArgsText(buildArgsText(tool, initialPath))
                setRunResult(null)
              }}
              className={cn(
                'w-full rounded-lg border px-2.5 py-2 text-left transition-colors',
                selectedTool === tool.name
                  ? 'border-cslab-accent/40 bg-cslab-surface'
                  : 'border-transparent hover:bg-cslab-surface/70',
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] text-cslab-text">{tool.name}</span>
                <span className="rounded-full border border-cslab-border px-1.5 text-[9px] uppercase text-cslab-muted">
                  {tool.source}
                </span>
                {tool.unsupportedReason && (
                  <span className="ml-auto text-[9px] text-[#B4553F]">{tool.unsupportedReason}</span>
                )}
              </div>
              <p className="mt-0.5 truncate font-mono text-[10px] text-cslab-muted">{signature(tool)}</p>
              <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-cslab-muted">
                {tool.description}
              </p>
            </button>
          ))
        )}
      </section>

      {selectedToolMeta && !selectedToolMeta.unsupportedReason && (
        <section className="rounded-xl border border-cslab-border bg-cslab-elevated/70 p-3">
          <div className="flex items-center gap-2">
            <Play size={11} className="text-cslab-muted" />
            <span className="text-[10px] uppercase tracking-[0.14em] text-cslab-muted">试运行</span>
            <span className="ml-auto font-mono text-[10px] text-cslab-muted">{selectedToolMeta.name}</span>
          </div>
          <textarea
            value={argsText}
            onChange={(event) => setArgsText(event.target.value)}
            rows={4}
            spellCheck={false}
            className="mt-2 w-full resize-none rounded-lg border border-cslab-border bg-cslab-bg px-2 py-1.5 font-mono text-[10px] leading-relaxed text-cslab-text outline-none focus:border-cslab-accent/50"
          />
          <div className="mt-1.5 flex justify-end">
            <button
              type="button"
              disabled={busy === 'run'}
              onClick={() => void runTool()}
              className="inline-flex items-center gap-1 rounded-lg bg-cslab-accent px-2.5 py-1 text-[10px] font-medium text-white hover:bg-cslab-accentHover disabled:opacity-50"
            >
              {busy === 'run' ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
              运行
            </button>
          </div>
          {runResult !== null && (
            <pre className="mt-2 max-h-56 overflow-auto rounded-lg bg-cslab-bg p-2 font-mono text-[10px] leading-relaxed text-cslab-text">
              {runResult}
            </pre>
          )}
        </section>
      )}

      <section className="rounded-xl border border-cslab-border bg-cslab-elevated/70 p-3">
        <div className="flex items-center gap-2">
          <Check size={11} className="text-cslab-muted" />
          <span className="text-[10px] uppercase tracking-[0.14em] text-cslab-muted">绑定到会话</span>
          <span className="ml-auto text-[9px] text-cslab-muted">重新发送消息后生效</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <select
            value={sessionId}
            onChange={(event) => setSessionId(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-cslab-border bg-cslab-bg px-2 py-1 text-[10px] text-cslab-text outline-none"
          >
            {sessions.length === 0 && <option value="">暂无可用会话</option>}
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.title}
                {session.cslabLabId === labId ? '（已绑定）' : ''}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={busy === 'bind' || !sessionId}
            onClick={() => void bindSession(true)}
            className="rounded-lg bg-cslab-accent px-2 py-1 text-[10px] font-medium text-white hover:bg-cslab-accentHover disabled:opacity-50"
          >
            绑定
          </button>
          <button
            type="button"
            disabled={busy === 'bind' || !sessionId || !currentSession?.cslabLabId}
            onClick={() => void bindSession(false)}
            className="inline-flex items-center gap-1 rounded-lg border border-cslab-border px-2 py-1 text-[10px] text-cslab-muted hover:text-cslab-text disabled:opacity-40"
          >
            <Unlink size={10} /> 解绑
          </button>
        </div>
        <p className="mt-1.5 text-[10px] leading-relaxed text-cslab-muted">
          仅绑定的会话会注入 cslab_* 工具；其他会话保持通用编程能力，互不串扰。
        </p>
      </section>
    </div>
  )
}
