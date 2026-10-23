/**
 * 案卷时间线面板（C1 基本形态：倒序条目 + 操作者徽标）
 *
 * - 徽标：人工（蓝）/ AI Agent（紫）/ 模拟（灰）/ 校方（绿）/ 旧版记录未记录（灰斜体）
 * - runNonce 变化即刷新（Agent 写后 applyResult→+1 触发；IPC 薄）
 */
import { useCallback, useEffect, useState } from 'react'

interface TimelineRow {
  at: string
  action: string
  operatorKind: 'human' | 'agent' | 'mock' | 'school' | 'system' | 'unknown'
  operatorLabel: string
  detail: string
}

const BADGE_STYLE: Record<TimelineRow['operatorKind'], string> = {
  human: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  agent: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  mock: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
  school: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  system: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  unknown: 'bg-zinc-100 text-zinc-500 italic dark:bg-zinc-800 dark:text-zinc-400',
}

const BADGE_TEXT: Record<TimelineRow['operatorKind'], string> = {
  human: '人工',
  agent: 'AI Agent',
  mock: '模拟',
  school: '校方',
  system: '系统',
  unknown: '未记录',
}

const FILTERS: Array<{ key: TimelineRow['operatorKind'] | 'all'; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'agent', label: 'AI Agent' },
  { key: 'human', label: '人工' },
]

export function CaseTimelinePanel({ caseId, refreshNonce }: { caseId: string; refreshNonce: number }): JSX.Element {
  const [rows, setRows] = useState<TimelineRow[]>([])
  const [filter, setFilter] = useState<TimelineRow['operatorKind'] | 'all'>('all')

  const load = useCallback(async (): Promise<void> => {
    try {
      const list = await window.reviewAPI.getCaseTimelineV2({ caseId, filterOperator: filter === 'all' ? undefined : filter })
      setRows((list ?? []) as unknown as TimelineRow[])
    } catch (error) {
      console.error('[V2] 时间线加载失败', error)
    }
  }, [caseId, filter])

  useEffect(() => { void load() }, [load, refreshNonce])

  if (rows.length === 0) {
    return <div className="rounded-lg border-t pt-3 text-sm text-muted-foreground">尚无时间线记录</div>
  }

  return (
    <div className="space-y-1.5 rounded-lg border-t pt-3">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold">案卷时间线（{rows.length}）</p>
        {FILTERS.map((item) => (
          <button key={item.key} type="button" className={`rounded px-1.5 py-0.5 text-xs ${filter === item.key ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setFilter(item.key)}>
            {item.label}
          </button>
        ))}
      </div>
      {rows.slice(0, 30).map((row, index) => (
        <div key={index} className="flex items-start gap-2.5 rounded px-2 py-1.5 text-sm hover:bg-muted/40">
          <span className="shrink-0 font-mono text-muted-foreground">{row.at.slice(5, 19)}</span>
          <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${BADGE_STYLE[row.operatorKind]}`}>{BADGE_TEXT[row.operatorKind]}</span>
          <span className="min-w-0 flex-1 truncate" title={`${row.action} · ${row.operatorLabel} · ${row.detail}`}>{row.action}</span>
        </div>
      ))}
      {rows.length > 30 && <p className="px-2 text-xs text-muted-foreground">仅显示最近 30 条（共 {rows.length}）</p>}
    </div>
  )
}
