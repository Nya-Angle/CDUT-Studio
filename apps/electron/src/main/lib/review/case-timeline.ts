/**
 * 案卷时间线（08 设计 §2.3：由已持久命令回执 + 运行事件构建）
 *
 * - 操作者可辨：local/mock/school → 「人工|模拟|校方」，agent → 「AI Agent」，缺省 → 「旧版记录，操作者未记录」
 * - 不猜身份：旧记录没有 actor 就如实标注，不冒认人工
 * - C1 基本形态：倒序列表（时间/动作/操作者徽标/关联对象/理由）；C3 再做筛选与跳转
 */
import type { CaseAggregateV2 } from '@profer/shared'

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
}

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
): TimelineEntry[] {
  const entries: TimelineEntry[] = []

  for (const receipt of aggregate.receiptLog) {
    const { operatorKind, operatorLabel } = operatorOf(receipt.actor?.actorSource, receipt.actor?.actorId)
    entries.push({ at: receipt.at, action: receipt.summary || receipt.type, operatorKind, operatorLabel, detail: `revision ${receipt.revision}` })
  }

  for (const run of runs ?? []) {
    const { operatorKind, operatorLabel } = operatorOf(run.initiatedBy?.actorSource, run.initiatedBy?.actorId)
    entries.push({ at: run.startedAt, action: `发起审核运行 ${run.id}`, operatorKind, operatorLabel, detail: `状态 ${run.status}` })
  }

  const sorted = entries.sort((a, b) => b.at.localeCompare(a.at))
  return filterOperator ? sorted.filter((entry) => entry.operatorKind === filterOperator) : sorted
}
