/**
 * CsLabRunTimeline — 实验规程与批次时间轴
 *
 * 能力：Protocol 模板（步骤/参数定义）、Run 批次（参数实填、成败现象、数据关联）。
 * 视觉：Editorial Minimalism（羊皮纸底、赤陶强调、发丝边框、无重阴影）。
 */

import * as React from 'react'
import { useAtom } from 'jotai'
import {
  CalendarDays,
  Check,
  ChevronDown,
  FlaskConical,
  Link2,
  Loader2,
  Plus,
  X,
} from 'lucide-react'
import type {
  CsLabAssetSummary,
  CsLabProtocol,
  CsLabProtocolParamDef,
  CsLabProtocolStep,
  CsLabRun,
  CsLabRunParam,
  CsLabRunStatus,
} from '@profer/shared'
import { cn } from '@/lib/utils'
import { cslabProtocolsAtom, cslabRunsAtom } from '@/atoms/cslab-atoms'

interface CsLabRunTimelineProps {
  labId: string
  assets: CsLabAssetSummary[]
  /** 从数据集动作栏进入时预选的资产 URI。 */
  seedAssetUri?: string | null
  onOpenAsset: (uri: string) => void
  onToast: (kind: 'info' | 'success' | 'error', text: string) => void
}

const STATUS_META: Record<CsLabRunStatus, { label: string; dot: string; text: string }> = {
  planned: { label: '计划', dot: 'bg-cslab-muted/50', text: 'text-cslab-muted' },
  running: { label: '进行中', dot: 'bg-cslab-accent', text: 'text-cslab-accent' },
  succeeded: { label: '成功', dot: 'bg-[#6E8B6A]', text: 'text-[#5C7358]' },
  failed: { label: '失败', dot: 'bg-[#B4553F]', text: 'text-[#B4553F]' },
  aborted: { label: '中止', dot: 'bg-cslab-muted/60', text: 'text-cslab-muted' },
}

function parseSteps(text: string): CsLabProtocolStep[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 50)
    .map((line, index) => {
      const [title, detail] = line.split('|').map((part) => part.trim())
      return {
        id: `step-${index + 1}`,
        title: title || `步骤 ${index + 1}`,
        detail: detail || undefined,
      }
    })
}

function parseParamDefs(text: string): CsLabProtocolParamDef[] {
  const result: CsLabProtocolParamDef[] = []
  const seen = new Set<string>()
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const [key, label, unit, defaultValue] = trimmed.split('|').map((part) => part.trim())
    if (!key || seen.has(key)) continue
    seen.add(key)
    result.push({
      key,
      label: label || key,
      unit: unit || undefined,
      defaultValue: defaultValue || undefined,
    })
  }
  return result.slice(0, 50)
}

function parseRunParams(text: string, protocol?: CsLabProtocol): CsLabRunParam[] {
  const defs = new Map((protocol?.parameters ?? []).map((param) => [param.key, param]))
  const result: CsLabRunParam[] = []
  const seen = new Set<string>()
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const separator = trimmed.includes('=') ? '=' : ':'
    const index = trimmed.indexOf(separator)
    const key = (index >= 0 ? trimmed.slice(0, index) : trimmed).trim()
    const value = index >= 0 ? trimmed.slice(index + 1).trim() : ''
    if (!key || seen.has(key)) continue
    seen.add(key)
    const def = defs.get(key)
    result.push({ key, label: def?.label ?? key, value, unit: def?.unit })
  }
  return result.slice(0, 50)
}

function formatTime(timestamp?: number): string {
  if (!timestamp) return '—'
  try {
    return new Date(timestamp).toLocaleString('zh-CN', {
      hour12: false,
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

function dayKey(timestamp: number): string {
  try {
    return new Date(timestamp).toLocaleDateString('zh-CN', { hour12: false })
  } catch {
    return '未知日期'
  }
}

export function CsLabRunTimeline({
  labId,
  assets,
  seedAssetUri,
  onOpenAsset,
  onToast,
}: CsLabRunTimelineProps): React.ReactElement {
  const [protocols, setProtocols] = useAtom(cslabProtocolsAtom)
  const [runs, setRuns] = useAtom(cslabRunsAtom)
  const [loading, setLoading] = React.useState(true)
  const [busy, setBusy] = React.useState(false)
  const [filterProtocol, setFilterProtocol] = React.useState<string>('all')

  const [protocolFormOpen, setProtocolFormOpen] = React.useState(false)
  const [protocolTitle, setProtocolTitle] = React.useState('')
  const [protocolMethod, setProtocolMethod] = React.useState('')
  const [protocolSteps, setProtocolSteps] = React.useState('')
  const [protocolParams, setProtocolParams] = React.useState('')

  const [runFormOpen, setRunFormOpen] = React.useState(false)
  const [runTitle, setRunTitle] = React.useState('')
  const [runOperator, setRunOperator] = React.useState('')
  const [runProtocolUri, setRunProtocolUri] = React.useState('')
  const [runParams, setRunParams] = React.useState('')

  const [editingRunId, setEditingRunId] = React.useState<string | null>(null)
  const [editStatus, setEditStatus] = React.useState<CsLabRunStatus>('succeeded')
  const [editOutcome, setEditOutcome] = React.useState('')
  const [editObservations, setEditObservations] = React.useState('')
  const [linkRunId, setLinkRunId] = React.useState<string | null>(null)
  const [linkAssetUri, setLinkAssetUri] = React.useState('')
  const [linkRelation, setLinkRelation] = React.useState<'consumes' | 'produces'>('consumes')

  const refresh = React.useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const [nextProtocols, nextRuns] = await Promise.all([
        window.electronAPI.cslab.listProtocols(labId),
        window.electronAPI.cslab.listRuns({ labId }),
      ])
      setProtocols(nextProtocols)
      setRuns(nextRuns)
      if (!runProtocolUri && nextProtocols[0]) setRunProtocolUri(nextProtocols[0].uri)
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '实验记录载入失败')
    } finally {
      setLoading(false)
    }
  }, [labId, onToast, runProtocolUri, setProtocols, setRuns])

  React.useEffect(() => {
    void refresh()
    // 只在切换实验室时重新载入。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labId])

  // 从数据集动作栏进入时，预选资产并展开第一个批次的关联面板（不自动提交）。
  React.useEffect(() => {
    if (!seedAssetUri) return
    setLinkAssetUri(seedAssetUri)
    setLinkRunId((current) => current ?? runs[0]?.uri ?? null)
  }, [seedAssetUri, runs])

  const selectedProtocol = protocols.find((protocol) => protocol.uri === runProtocolUri) ?? null
  const filteredRuns =
    filterProtocol === 'all' ? runs : runs.filter((run) => run.protocolUri === filterProtocol)
  // 时间轴只渲染最近 200 批，避免多年实验记录一次性撑爆抽屉。
  const displayRuns = React.useMemo(() => filteredRuns.slice(0, 200), [filteredRuns])

  const grouped = React.useMemo(() => {
    const map = new Map<string, CsLabRun[]>()
    for (const run of displayRuns) {
      const key = dayKey(run.createdAt)
      const list = map.get(key) ?? []
      list.push(run)
      map.set(key, list)
    }
    return [...map.entries()]
  }, [displayRuns])

  const linkableAssets = React.useMemo(
    () => assets.filter((asset) => ['raw', 'table', 'fig', 'mol'].includes(asset.layerType)),
    [assets],
  )

  const submitProtocol = async (): Promise<void> => {
    if (!protocolTitle.trim()) {
      onToast('error', '请填写规程标题')
      return
    }
    setBusy(true)
    try {
      await window.electronAPI.cslab.createProtocol({
        labId,
        title: protocolTitle.trim(),
        method: protocolMethod.trim(),
        steps: parseSteps(protocolSteps),
        parameters: parseParamDefs(protocolParams),
      })
      setProtocolTitle('')
      setProtocolMethod('')
      setProtocolSteps('')
      setProtocolParams('')
      setProtocolFormOpen(false)
      await refresh()
      onToast('success', '规程模板已创建')
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '规程创建失败')
    } finally {
      setBusy(false)
    }
  }

  const submitRun = async (): Promise<void> => {
    setBusy(true)
    try {
      const protocol = protocols.find((item) => item.uri === runProtocolUri)
      await window.electronAPI.cslab.createRun({
        labId,
        protocolUri: runProtocolUri || undefined,
        title: runTitle.trim() || `${protocol?.title ?? '未命名实验'} · 新批次`,
        operator: runOperator.trim() || undefined,
        parameters: parseRunParams(runParams, protocol),
      })
      setRunTitle('')
      setRunOperator('')
      setRunParams('')
      setRunFormOpen(false)
      await refresh()
      onToast('success', '实验批次已开始记录')
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '批次创建失败')
    } finally {
      setBusy(false)
    }
  }

  const startEditRun = (run: CsLabRun): void => {
    setEditingRunId(run.uri)
    setEditStatus(run.status === 'running' ? 'succeeded' : run.status)
    setEditOutcome(run.outcome ?? '')
    setEditObservations(run.observations ?? '')
    setLinkRunId(null)
  }

  const submitRunUpdate = async (run: CsLabRun): Promise<void> => {
    setBusy(true)
    try {
      const updated = await window.electronAPI.cslab.updateRun({
        labId,
        uri: run.uri,
        status: editStatus,
        outcome: editOutcome,
        observations: editObservations,
      })
      setRuns((previous) => previous.map((item) => (item.uri === updated.uri ? updated : item)))
      setEditingRunId(null)
      onToast('success', '批次结果已保存')
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '批次保存失败')
    } finally {
      setBusy(false)
    }
  }

  const submitLink = async (run: CsLabRun): Promise<void> => {
    if (!linkAssetUri) {
      onToast('error', '请选择要关联的资产')
      return
    }
    setBusy(true)
    try {
      const updated = await window.electronAPI.cslab.linkRunAsset({
        labId,
        runUri: run.uri,
        assetUri: linkAssetUri,
        relation: linkRelation,
      })
      setRuns((previous) => previous.map((item) => (item.uri === updated.uri ? updated : item)))
      setLinkRunId(null)
      setLinkAssetUri('')
      onToast('success', '资产已关联到批次')
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '关联失败')
    } finally {
      setBusy(false)
    }
  }

  const unlink = async (run: CsLabRun, assetUri: string): Promise<void> => {
    setBusy(true)
    try {
      const updated = await window.electronAPI.cslab.unlinkRunAsset({
        labId,
        runUri: run.uri,
        assetUri,
        relation: run.linkedAssets.find((link) => link.uri === assetUri)?.relation ?? 'consumes',
      })
      setRuns((previous) => previous.map((item) => (item.uri === updated.uri ? updated : item)))
    } catch (error) {
      onToast('error', error instanceof Error ? error.message : '解除关联失败')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <select
            value={filterProtocol}
            onChange={(event) => setFilterProtocol(event.target.value)}
            className="appearance-none rounded-lg border border-cslab-border bg-cslab-elevated py-1.5 pl-2.5 pr-7 text-[11px] text-cslab-text outline-none focus:border-cslab-accent/50"
            aria-label="筛选规程"
          >
            <option value="all">全部规程（{runs.length} 批）</option>
            {protocols.map((protocol) => (
              <option key={protocol.uri} value={protocol.uri}>
                {protocol.title} · v{protocol.version}
              </option>
            ))}
          </select>
          <ChevronDown size={11} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-cslab-muted" />
        </div>
        <button
          type="button"
          onClick={() => setProtocolFormOpen((open) => !open)}
          className="inline-flex items-center gap-1 rounded-lg border border-cslab-border px-2 py-1.5 text-[11px] text-cslab-muted hover:bg-cslab-surface hover:text-cslab-text"
        >
          <Plus size={11} /> 新建规程
        </button>
        <button
          type="button"
          onClick={() => setRunFormOpen((open) => !open)}
          className="ml-auto inline-flex items-center gap-1 rounded-lg bg-cslab-accent px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-cslab-accentHover"
        >
          <FlaskConical size={11} /> 记录批次
        </button>
      </div>

      {protocolFormOpen && (
        <section className="space-y-2 rounded-xl border border-cslab-border bg-cslab-surface/60 p-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-cslab-muted">新建规程模板</p>
          <input
            value={protocolTitle}
            onChange={(event) => setProtocolTitle(event.target.value)}
            placeholder="规程标题（必填）"
            className="w-full rounded-lg border border-cslab-border bg-cslab-elevated px-2.5 py-1.5 text-xs text-cslab-text outline-none focus:border-cslab-accent/50"
          />
          <input
            value={protocolMethod}
            onChange={(event) => setProtocolMethod(event.target.value)}
            placeholder="测试方法（可选）"
            className="w-full rounded-lg border border-cslab-border bg-cslab-elevated px-2.5 py-1.5 text-xs text-cslab-text outline-none focus:border-cslab-accent/50"
          />
          <textarea
            value={protocolSteps}
            onChange={(event) => setProtocolSteps(event.target.value)}
            rows={3}
            placeholder={'步骤（每行一条：标题 | 细节）\n装配电池 | 手套箱内完成'}
            className="w-full resize-none rounded-lg border border-cslab-border bg-cslab-elevated px-2.5 py-1.5 text-xs leading-relaxed text-cslab-text outline-none focus:border-cslab-accent/50"
          />
          <textarea
            value={protocolParams}
            onChange={(event) => setProtocolParams(event.target.value)}
            rows={3}
            placeholder={'参数定义（每行一条：key | 标签 | 单位 | 默认值）\ncurrent | 电流 | mA | 0.5'}
            className="w-full resize-none rounded-lg border border-cslab-border bg-cslab-elevated px-2.5 py-1.5 text-xs leading-relaxed text-cslab-text outline-none focus:border-cslab-accent/50"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setProtocolFormOpen(false)}
              className="rounded-lg px-2.5 py-1 text-[11px] text-cslab-muted hover:bg-cslab-elevated"
            >
              取消
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void submitProtocol()}
              className="inline-flex items-center gap-1 rounded-lg bg-cslab-accent px-2.5 py-1 text-[11px] font-medium text-white hover:bg-cslab-accentHover disabled:opacity-50"
            >
              {busy ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
              保存规程
            </button>
          </div>
        </section>
      )}

      {runFormOpen && (
        <section className="space-y-2 rounded-xl border border-cslab-border bg-cslab-surface/60 p-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-cslab-muted">记录新批次</p>
          <select
            value={runProtocolUri}
            onChange={(event) => setRunProtocolUri(event.target.value)}
            className="w-full rounded-lg border border-cslab-border bg-cslab-elevated px-2.5 py-1.5 text-xs text-cslab-text outline-none focus:border-cslab-accent/50"
          >
            <option value="">不关联规程</option>
            {protocols.map((protocol) => (
              <option key={protocol.uri} value={protocol.uri}>
                {protocol.title} · v{protocol.version}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={runTitle}
              onChange={(event) => setRunTitle(event.target.value)}
              placeholder="批次标题（可选）"
              className="rounded-lg border border-cslab-border bg-cslab-elevated px-2.5 py-1.5 text-xs text-cslab-text outline-none focus:border-cslab-accent/50"
            />
            <input
              value={runOperator}
              onChange={(event) => setRunOperator(event.target.value)}
              placeholder="操作人"
              className="rounded-lg border border-cslab-border bg-cslab-elevated px-2.5 py-1.5 text-xs text-cslab-text outline-none focus:border-cslab-accent/50"
            />
          </div>
          <textarea
            value={runParams}
            onChange={(event) => setRunParams(event.target.value)}
            rows={3}
            placeholder={'参数实填（每行 key=value；留空则使用规程默认值）\ncurrent=0.5'}
            className="w-full resize-none rounded-lg border border-cslab-border bg-cslab-elevated px-2.5 py-1.5 text-xs leading-relaxed text-cslab-text outline-none focus:border-cslab-accent/50"
          />
          {selectedProtocol && selectedProtocol.parameters.length > 0 && (
            <p className="text-[10px] leading-relaxed text-cslab-muted">
              规程默认参数：{selectedProtocol.parameters.map((param) => `${param.key}${param.unit ? `(${param.unit})` : ''}`).join('、')}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRunFormOpen(false)}
              className="rounded-lg px-2.5 py-1 text-[11px] text-cslab-muted hover:bg-cslab-elevated"
            >
              取消
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void submitRun()}
              className="inline-flex items-center gap-1 rounded-lg bg-cslab-accent px-2.5 py-1 text-[11px] font-medium text-white hover:bg-cslab-accentHover disabled:opacity-50"
            >
              {busy ? <Loader2 size={11} className="animate-spin" /> : <PlayIcon />}
              开始批次
            </button>
          </div>
        </section>
      )}

      {selectedProtocol && (
        <section className="rounded-xl border border-cslab-border bg-cslab-elevated/70 p-3">
          <div className="flex items-baseline justify-between">
            <h3 className="font-serif text-sm text-cslab-text">{selectedProtocol.title}</h3>
            <span className="text-[10px] uppercase tracking-wide text-cslab-muted">v{selectedProtocol.version}</span>
          </div>
          {selectedProtocol.method && (
            <p className="mt-1 text-[11px] leading-relaxed text-cslab-muted">{selectedProtocol.method}</p>
          )}
          {selectedProtocol.steps.length > 0 && (
            <ol className="mt-2 space-y-1">
              {selectedProtocol.steps.map((step, index) => (
                <li key={step.id} className="text-[11px] leading-relaxed text-cslab-text">
                  <span className="mr-1.5 tabular-nums text-cslab-muted">{index + 1}.</span>
                  {step.title}
                  {step.detail && <span className="text-cslab-muted"> — {step.detail}</span>}
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-[11px] text-cslab-muted">
          <Loader2 size={12} className="animate-spin" /> 正在载入实验记录…
        </div>
      ) : filteredRuns.length === 0 ? (
        <div className="rounded-xl border border-dashed border-cslab-border px-4 py-8 text-center">
          <CalendarDays size={18} className="mx-auto text-cslab-muted/60" />
          <p className="mt-2 font-serif text-sm text-cslab-text">还没有实验批次</p>
          <p className="mt-1 text-[11px] leading-relaxed text-cslab-muted">
            先建立规程模板，再记录真实批次；数据表与图表可直接关联到批次。
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {grouped.map(([day, dayRuns]) => (
            <section key={day}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.18em] text-cslab-muted">{day}</span>
                <span className="h-px flex-1 bg-cslab-border" />
                <span className="text-[10px] tabular-nums text-cslab-muted/70">{dayRuns.length} 批</span>
              </div>
              <ul className="relative space-y-2 before:absolute before:bottom-2 before:left-[3px] before:top-2 before:w-px before:bg-cslab-border before:content-['']">
                {dayRuns.map((run) => {
                  const status = STATUS_META[run.status]
                  const editing = editingRunId === run.uri
                  return (
                    <li key={run.uri} className="relative pl-4">
                      <span className={cn('absolute left-0 top-2 size-1.5 rounded-full', status.dot)} />
                      <div className="rounded-xl border border-cslab-border bg-cslab-elevated/80 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-baseline gap-x-2">
                              <span className="font-mono text-[10px] text-cslab-muted">{run.batchNo}</span>
                              <span className={cn('text-[10px]', status.text)}>{status.label}</span>
                            </div>
                            <h4 className="mt-0.5 truncate font-serif text-sm text-cslab-text">{run.title}</h4>
                            <p className="mt-0.5 text-[10px] text-cslab-muted">
                              {run.protocolTitle ?? '未关联规程'}
                              {run.operator ? ` · ${run.operator}` : ''}
                              {run.startedAt ? ` · ${formatTime(run.startedAt)}` : ''}
                            </p>
                          </div>
                          {run.status === 'running' && !editing && (
                            <button
                              type="button"
                              onClick={() => startEditRun(run)}
                              className="shrink-0 rounded-lg border border-cslab-border px-2 py-1 text-[10px] text-cslab-muted hover:border-cslab-accent/40 hover:text-cslab-accent"
                            >
                              结束批次
                            </button>
                          )}
                        </div>

                        {run.parameters.length > 0 && (
                          <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                            {run.parameters.map((param) => (
                              <div key={param.key} className="flex items-baseline justify-between gap-2 border-b border-cslab-border/50 pb-0.5">
                                <dt className="truncate text-[10px] text-cslab-muted">{param.label}</dt>
                                <dd className="shrink-0 text-[11px] tabular-nums text-cslab-text">
                                  {param.value || '—'}
                                  {param.unit && <span className="ml-0.5 text-[10px] text-cslab-muted">{param.unit}</span>}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        )}

                        {run.observations && (
                          <p
                            title={run.observations}
                            className="mt-2 line-clamp-3 whitespace-pre-wrap text-[11px] leading-relaxed text-cslab-muted"
                          >
                            {run.observations}
                          </p>
                        )}
                        {run.outcome && (
                          <p className="mt-1 text-[11px] leading-relaxed text-cslab-text">
                            <span className="text-cslab-muted">结果：</span>
                            {run.outcome}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {run.linkedAssets.map((link) => (
                            <span
                              key={`${link.uri}-${link.relation}`}
                              className="inline-flex items-center gap-1 rounded-full border border-cslab-border px-2 py-0.5 text-[10px] text-cslab-muted"
                            >
                              <button
                                type="button"
                                onClick={() => onOpenAsset(link.uri)}
                                className="hover:text-cslab-accent"
                                title={link.uri}
                              >
                                {link.title}
                              </button>
                              <span className="text-cslab-border">{link.relation === 'consumes' ? '消耗' : '产出'}</span>
                              <button
                                type="button"
                                onClick={() => void unlink(run, link.uri)}
                                className="text-cslab-muted/60 hover:text-[#B4553F]"
                                aria-label="解除关联"
                              >
                                <X size={9} />
                              </button>
                            </span>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setLinkRunId((current) => (current === run.uri ? null : run.uri))
                              setEditingRunId(null)
                            }}
                            className="inline-flex items-center gap-1 rounded-full border border-dashed border-cslab-border px-2 py-0.5 text-[10px] text-cslab-muted hover:border-cslab-accent/40 hover:text-cslab-accent"
                          >
                            <Link2 size={9} /> 关联数据
                          </button>
                        </div>

                        {linkRunId === run.uri && (
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-lg bg-cslab-bg/70 p-2">
                            <select
                              value={linkAssetUri}
                              onChange={(event) => setLinkAssetUri(event.target.value)}
                              className="min-w-0 flex-1 rounded-md border border-cslab-border bg-cslab-elevated px-2 py-1 text-[10px] text-cslab-text outline-none"
                            >
                              <option value="">选择数据表 / 图表 / 原始数据</option>
                              {linkableAssets.map((asset) => (
                                <option key={asset.uri} value={asset.uri}>
                                  {asset.title}
                                </option>
                              ))}
                            </select>
                            <select
                              value={linkRelation}
                              onChange={(event) => setLinkRelation(event.target.value as 'consumes' | 'produces')}
                              className="rounded-md border border-cslab-border bg-cslab-elevated px-2 py-1 text-[10px] text-cslab-text outline-none"
                            >
                              <option value="consumes">消耗</option>
                              <option value="produces">产出</option>
                            </select>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void submitLink(run)}
                              className="rounded-md bg-cslab-accent px-2 py-1 text-[10px] font-medium text-white hover:bg-cslab-accentHover disabled:opacity-50"
                            >
                              添加
                            </button>
                          </div>
                        )}

                        {editing && (
                          <div className="mt-2 space-y-1.5 rounded-lg bg-cslab-bg/70 p-2">
                            <div className="flex gap-1.5">
                              {(['succeeded', 'failed', 'aborted'] as CsLabRunStatus[]).map((statusOption) => (
                                <button
                                  key={statusOption}
                                  type="button"
                                  onClick={() => setEditStatus(statusOption)}
                                  className={cn(
                                    'rounded-full border px-2 py-0.5 text-[10px] transition-colors',
                                    editStatus === statusOption
                                      ? 'border-cslab-accent/50 bg-cslab-accent/10 text-cslab-accent'
                                      : 'border-cslab-border text-cslab-muted',
                                  )}
                                >
                                  {STATUS_META[statusOption].label}
                                </button>
                              ))}
                            </div>
                            <input
                              value={editOutcome}
                              onChange={(event) => setEditOutcome(event.target.value)}
                              placeholder="结果摘要（例如：首圈库伦效率 91.2%）"
                              className="w-full rounded-md border border-cslab-border bg-cslab-elevated px-2 py-1 text-[11px] text-cslab-text outline-none focus:border-cslab-accent/50"
                            />
                            <textarea
                              value={editObservations}
                              onChange={(event) => setEditObservations(event.target.value)}
                              rows={3}
                              placeholder="观察现象、异常与判断…"
                              className="w-full resize-none rounded-md border border-cslab-border bg-cslab-elevated px-2 py-1 text-[11px] leading-relaxed text-cslab-text outline-none focus:border-cslab-accent/50"
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingRunId(null)}
                                className="rounded-md px-2 py-1 text-[10px] text-cslab-muted hover:bg-cslab-elevated"
                              >
                                取消
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => void submitRunUpdate(run)}
                                className="inline-flex items-center gap-1 rounded-md bg-cslab-accent px-2 py-1 text-[10px] font-medium text-white hover:bg-cslab-accentHover disabled:opacity-50"
                              >
                                {busy ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                                保存结果
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
          {filteredRuns.length > displayRuns.length && (
            <p className="text-center text-[10px] text-cslab-muted">
              仅显示最近 {displayRuns.length} 批，共 {filteredRuns.length} 批
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function PlayIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
      <path d="M3 2.2 9.4 6 3 9.8V2.2Z" fill="currentColor" />
    </svg>
  )
}
