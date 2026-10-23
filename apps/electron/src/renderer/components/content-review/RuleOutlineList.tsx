/** AI 生成/人工调整后的审核规则摘要，按类别折叠并支持定位原文。 */

import * as React from 'react'
import { Check, ChevronDown, Pencil, Sparkles, X } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@profer/ui/primitives/collapsible'
import type { RuleOutlineCategory, RuleOutlineItem } from '@profer/shared'
import { cn } from '@/lib/utils'

const GENERATED_BY_LABELS: Record<RuleOutlineItem['generatedBy'], string> = {
  ai: 'AI 提取',
  fixture: '预置',
  manual: '手工',
}

interface RuleOutlineListProps {
  outline: RuleOutlineItem[]
  onLocate: (anchors: RuleOutlineItem['anchors']) => void
  onUpdate?: (input: { id: string; title: string; summary: string }) => Promise<boolean>
}

export function RuleOutlineList({ outline, onLocate, onUpdate }: RuleOutlineListProps): React.ReactElement {
  const groups = React.useMemo(() => {
    const map = new Map<RuleOutlineCategory, RuleOutlineItem[]>()
    for (const item of outline) {
      const list = map.get(item.category)
      if (list) list.push(item)
      else map.set(item.category, [item])
    }
    return Array.from(map.entries())
  }, [outline])

  if (outline.length === 0) return <p className="px-1 py-3 text-xs text-muted-foreground">尚未生成规则摘要；开始审核时会从已载入的依据中准备。</p>

  return (
    <div className="space-y-3">
      {groups.map(([category, items]) => <OutlineGroup key={category} category={category} items={items} onLocate={onLocate} onUpdate={onUpdate} />)}
    </div>
  )
}

function OutlineGroup({ category, items, onLocate, onUpdate }: {
  category: RuleOutlineCategory
  items: RuleOutlineItem[]
  onLocate: RuleOutlineListProps['onLocate']
  onUpdate?: RuleOutlineListProps['onUpdate']
}): React.ReactElement {
  const [open, setOpen] = React.useState(true)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border border-border/60 bg-card shadow-sm">
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-foreground/[0.03] focus:outline-none focus-visible:ring-1 focus-visible:ring-ring" aria-expanded={open}>
        <ChevronDown size={14} className={cn('shrink-0 text-muted-foreground transition-transform', open ? 'rotate-0' : '-rotate-90')} />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{category}</span>
        <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-xs tabular-nums text-muted-foreground">{items.length}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border/50">
        <div className="space-y-1 p-2">
          {items.map((item) => <OutlineItem key={item.id} item={item} onLocate={onLocate} onUpdate={onUpdate} />)}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function OutlineItem({ item, onLocate, onUpdate }: {
  item: RuleOutlineItem
  onLocate: RuleOutlineListProps['onLocate']
  onUpdate?: RuleOutlineListProps['onUpdate']
}): React.ReactElement {
  const [editing, setEditing] = React.useState(false)
  const [title, setTitle] = React.useState(item.title)
  const [summary, setSummary] = React.useState(item.summary)

  React.useEffect(() => {
    if (editing) return
    setTitle(item.title)
    setSummary(item.summary)
  }, [editing, item.title, item.summary])

  const save = async (): Promise<void> => {
    if (!title.trim() || !onUpdate) return
    if (await onUpdate({ id: item.id, title: title.trim(), summary: summary.trim() })) setEditing(false)
  }

  if (editing) {
    return (
      <div className="space-y-1.5 rounded-md border border-primary/30 bg-background p-2">
        <input aria-label="规则名称" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} className="w-full rounded border border-input bg-background px-2 py-1.5 text-xs font-medium" />
        <textarea aria-label="规则摘要" value={summary} onChange={(event) => setSummary(event.target.value)} maxLength={8000} rows={3} className="w-full resize-y rounded border border-input bg-background px-2 py-1.5 text-xs leading-5" />
        <div className="flex justify-end gap-1">
          <button type="button" aria-label="取消编辑规则" title="取消" onClick={() => setEditing(false)} className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted"><X size={14} /></button>
          <button type="button" aria-label="保存规则摘要" title="保存" disabled={!title.trim()} onClick={() => void save()} className="flex size-7 items-center justify-center rounded bg-primary text-primary-foreground disabled:opacity-50"><Check size={14} /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-1 rounded-md px-1 transition-colors hover:bg-blue-500/5">
      <button type="button" onClick={() => onLocate(item.anchors)} title="定位到规则原文" className="flex min-w-0 flex-1 flex-col gap-1 py-1.5 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-ring">
        <span className="flex items-center gap-1.5">
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{item.title}</span>
          <span className={cn('shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium', item.generatedBy === 'ai' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : item.generatedBy === 'fixture' ? 'bg-muted text-muted-foreground' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400')}>
            {item.generatedBy === 'ai' && <Sparkles size={10} className="mr-0.5 inline" />}{GENERATED_BY_LABELS[item.generatedBy]}
          </span>
        </span>
        <span className="line-clamp-2 text-xs leading-5 text-muted-foreground">{item.summary}</span>
      </button>
      {onUpdate && <button type="button" aria-label="编辑规则摘要" title="手动调整规则摘要" onClick={() => setEditing(true)} className="mt-1 flex size-7 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil size={13} /></button>}
    </div>
  )
}
