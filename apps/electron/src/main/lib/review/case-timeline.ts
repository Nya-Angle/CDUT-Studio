/**
 * 案卷时间线（08 设计 §2.3：由已持久命令回执 + 运行事件构建）
 *
 * - 操作者可辨：local/mock/school → 「人工|模拟|校方」，agent → 「AI Agent」，缺省 → 「旧版记录，操作者未记录」
 * - 不猜身份：旧记录没有 actor 就如实标注，不冒认人工
 * - C1 基本形态：倒序列表（时间/动作/操作者徽标/关联对象/理由）；C3 再做筛选与跳转
 */
import type { CaseAggregateV2 } from '@profer/shared'

export type TimelineSource =
  | 'receipt' | 'run' | 't07-rating' | 'batch-snapshot' | 'batch-outbox' | 't09-offline' | 'report-handoff'

export interface TimelineEntry {
  at: string
  /** 动作名（中文摘要） */
  action: string
  /** 操作者徽标：human | agent | mock | school | unknown */
  operatorKind: 'human' | 'agent' | 'mock' | 'school' | 'system' | 'unknown'
  /** 显示名（人工操作者 ID / Agent 会话短码） */
  operatorLabel: string
  /** 关联对象（决定结果/运行 ID/材料名等） */
  detail: string
  /** 事件来源存储；缺省视为旧记录（receipt/run 由本模块直接构建） */
  source?: TimelineSource
  /** 事件归属的运行；跨模块事件若不能证明归属则留空，不猜 */
  runId?: string
}

/**
 * 跨模块只读事件源（RUN-32）。各模块仍拥有自己的账本，本模块只做统一投影；
 * 未提供的模块不会伪造条目，由 summarizeTimelineSources 明确报告缺口。
 */
export interface TimelineExternalEntry {
  id: string
  at: string
  status: string
  detail?: string
  runId?: string
  actor?: { actorSource?: string; actorId?: string }
}

export interface TimelineExtraSources {
  t07RatingRounds?: TimelineExternalEntry[]
  batchSnapshots?: TimelineExternalEntry[]
  batchOutbox?: TimelineExternalEntry[]
  offlineReceipts?: TimelineExternalEntry[]
  reportHandoffs?: TimelineExternalEntry[]
}

const EXTERNAL_LABELS: Array<{ key: keyof TimelineExtraSources; source: TimelineSource; action: string }> = [
  { key: 't07RatingRounds', source: 't07-rating', action: '评分轮次' },
  { key: 'batchSnapshots', source: 'batch-snapshot', action: '批次快照' },
  { key: 'batchOutbox', source: 'batch-outbox', action: '批次外发' },
  { key: 'offlineReceipts', source: 't09-offline', action: '离线回件回执' },
  { key: 'reportHandoffs', source: 'report-handoff', action: '报告交接' },
]

function operatorOf(actorSource?: string, actorId?: string): { operatorKind: TimelineEntry['operatorKind']; operatorLabel: string } {
  switch (actorSource) {
    case 'system':
      return { operatorKind: 'system', operatorLabel: actorId ?? '系统' }
    case 'agent':
      // 保留完整 sessionId 于 actorId；显示只取短码
      return { operatorKind: 'agent', operatorLabel: `AI Agent（${(actorId ?? '').replace(/^agent-/, '').slice(0, 8)}）` }
    case 'mock':
      return { operatorKind: 'mock', operatorLabel: actorId ?? '模拟' }
    case 'school':
      return { operatorKind: 'school', operatorLabel: actorId ?? '校方' }
    case 'local':
      return { operatorKind: 'human', operatorLabel: actorId ?? '人工' }
    default:
      return { operatorKind: 'unknown', operatorLabel: '旧版记录，操作者未记录' }
  }
}

/** 构建案卷时间线（回执 + 运行 + 决定；倒序；filterOperator 可选过滤操作者类别） */
export function buildCaseTimeline(
  aggregate: CaseAggregateV2,
  runs?: Array<{ id: string; status: string; startedAt: string; initiatedBy?: { actorSource: string; actorId: string } }>,
  filterOperator?: TimelineEntry['operatorKind'],
  extra?: TimelineExtraSources,
): TimelineEntry[] {
  const entries: TimelineEntry[] = []
  const seen = new Set<string>()

  for (const receipt of aggregate.receiptLog) {
    const { operatorKind, operatorLabel } = operatorOf(receipt.actor?.actorSource, receipt.actor?.actorId)
    entries.push({ at: receipt.at, action: receipt.summary || receipt.type, operatorKind, operatorLabel, detail: `revision ${receipt.revision}`, source: 'receipt' })
  }

  for (const run of runs ?? []) {
    const { operatorKind, operatorLabel } = operatorOf(run.initiatedBy?.actorSource, run.initiatedBy?.actorId)
    entries.push({ at: run.startedAt, action: `发起审核运行 ${run.id}`, operatorKind, operatorLabel, detail: `状态 ${run.status}`, source: 'run', runId: run.id })
  }

  for (const { key, source, action } of EXTERNAL_LABELS) {
    for (const item of extra?.[key] ?? []) {
      // 去重键含来源与模块内 id，避免同一外部回执被两个模块重复投影成两条事实。
      const dedupe = `${source}:${item.id}`
      if (seen.has(dedupe)) continue
      seen.add(dedupe)
      const { operatorKind, operatorLabel } = operatorOf(item.actor?.actorSource, item.actor?.actorId)
      entries.push({
        at: item.at,
        action: `${action} ${item.id}`,
        operatorKind,
        operatorLabel,
        detail: `${item.status}${item.detail ? `；${item.detail}` : ''}`,
        source,
        ...(item.runId ? { runId: item.runId } : {}),
      })
    }
  }

  const sorted = entries.sort((a, b) => b.at.localeCompare(a.at) || (a.source ?? '').localeCompare(b.source ?? '') || a.action.localeCompare(b.action))
  return filterOperator ? sorted.filter((entry) => entry.operatorKind === filterOperator) : sorted
}

/** 时间线覆盖摘要：明确哪些外部存储本次没有提供事件，不把“另有专页”当作已汇总。 */
export function summarizeTimelineSources(extra?: TimelineExtraSources): Array<{ source: TimelineSource; provided: boolean; count: number }> {
  const base: Array<{ source: TimelineSource; provided: boolean; count: number }> = [
    { source: 'receipt', provided: true, count: 0 },
    { source: 'run', provided: true, count: 0 },
  ]
  for (const { key, source } of EXTERNAL_LABELS) {
    const count = extra?.[key]?.length ?? 0
    base.push({ source, provided: count > 0, count })
  }
  return base
}
