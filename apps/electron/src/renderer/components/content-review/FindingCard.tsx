/**
 * FindingCard — 审核问题卡（右栏列表项）
 *
 * 展示一次审核发现的核心信息：严重度 + 问题类型 + 标题 + 详情 + 建议 + 来源标记。
 * 点击 → 父组件（RightPanel）写 reviewFocusAtom，触发左/中两栏滚动高亮（D8 联动）。
 * 左侧色条：红=冲突（必须处理）、黄=待处理（可人工确认）。
 */

import * as React from 'react'
import { Gavel } from 'lucide-react'
import type { FindingKind, ReviewFinding } from '@profer/shared'
import { cn } from '@/lib/utils'

/** 问题类型 → 中文标签 */
const KIND_LABELS: Record<FindingKind, string> = {
  'level-conflict': '等级冲突',
  'missing-evidence': '缺证明',
  'score-over-limit': '超上限',
  'mutual-exclusion': '互斥计分',
  'date-out-of-range': '日期越界',
  'unclear-evidence': '证明看不清',
  'info-incomplete': '信息不全',
  'rule-unmatched': '规则未覆盖',
}

/** 结果来源标签（AI / 模拟引擎 / 预置） */
const GENERATED_BY_LABELS: Record<ReviewFinding['generatedBy'], string> = {
  ai: 'AI 结论',
  'mock-engine': '模拟引擎',
  fixture: '预置',
}

interface FindingCardProps {
  finding: ReviewFinding
  /** 是否为当前选中卡（右栏高亮态） */
  selected: boolean
  onClick: () => void
}

export function FindingCard({ finding, selected, onClick }: FindingCardProps): React.ReactElement {
  const isRed = finding.severity === 'red'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'group flex w-full gap-3 rounded-xl border p-3 text-left transition-all',
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        selected
          ? 'border-transparent bg-card shadow-md ring-1 ring-primary/40'
          : 'border-border/60 bg-card shadow-sm hover:border-border hover:shadow-md',
      )}
    >
      {/* 左侧严重度色条 */}
      <span
        aria-hidden="true"
        className={cn('w-1 shrink-0 rounded-full', isRed ? 'bg-red-500' : 'bg-amber-400')}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* 严重度徽标 */}
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium',
              isRed
                ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
            )}
          >
            <Gavel size={11} />
            {isRed ? '冲突' : '待处理'}
          </span>
          {/* 问题类型 */}
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
            {KIND_LABELS[finding.kind]}
          </span>
          {/* 结果来源标记 */}
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
            {GENERATED_BY_LABELS[finding.generatedBy]}
          </span>
        </div>

        <p className="mt-1.5 text-sm font-medium leading-5 text-foreground">{finding.title}</p>

        {/* 详情：默认 3 行截断，选中后展开 */}
        <p className={cn('mt-1 text-xs leading-5 text-muted-foreground', selected ? 'line-clamp-none' : 'line-clamp-3')}>
          {finding.detail}
        </p>

        {/* 修改/补件建议 */}
        {finding.suggestionText && (
          <p className="mt-1.5 rounded-md bg-muted/50 px-2 py-1.5 text-xs leading-5 text-foreground/80">
            {finding.suggestionText}
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>建议 {finding.suggestedScore !== undefined ? `${finding.suggestedScore} 分` : '待确认'}</span>
          {finding.ruleItemIds.length > 0 && (
            <span>依据 {finding.ruleItemIds.length} 条规则</span>
          )}
        </div>
      </div>
    </button>
  )
}
