/**
 * C1-R09: human-authored, physically grounded native Subject dialog.
 * Reads the current C-owned aggregate; all writes go through ReviewActions /
 * Main CAS. No Renderer JSON can mint SourceIdentity or teacher authority.
 */
import * as React from 'react'
import { toast } from 'sonner'
import type { CaseAggregateV2, DocumentVersion } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@profer/ui/primitives/dialog'
import { Input } from '@profer/ui/primitives/input'
import { Label } from '@profer/ui/primitives/label'
import type { ReviewActions } from './use-review-actions'

type NativeSource = Pick<DocumentVersion, 'documentId' | 'versionId' | 'fileName' | 'parseStatus' | 'blocks'>
type LoadState = 'loading' | 'ready' | 'unavailable'

interface NativeManualItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Captured when opening the dialog. A case switch cannot redirect a write. */
  caseId: string | null
  actions: ReviewActions
}

export function nativeManualSourcesFromAggregate(aggregate: CaseAggregateV2 | undefined, caseId: string): {
  sources: NativeSource[]
  reason: string | null
} {
  if (!aggregate || aggregate.caseV2?.id !== caseId ||
      aggregate.receiptLog?.[0]?.type !== 'CreateNativeWorkspaceCaseV3') {
    return { sources: [], reason: '当前案卷不是原生 V3 工作台案卷，不能通过此入口创建人工事项。' }
  }
  if (aggregate.caseV2.stage !== 'draft' || aggregate.canonicalPlan || aggregate.d2RuntimePlan) {
    return { sources: [], reason: '案卷已进入正式审核阶段或已绑定计划；只能在未冻结的草稿中建立人工事项。' }
  }
  if (!Array.isArray(aggregate.caseV2.documents)) {
    return { sources: [], reason: '案卷材料账不可读；请核验原生案卷数据。' }
  }
  const sources = aggregate.caseV2.documents.filter(doc =>
    doc && doc.role === 'application' && doc.active !== false &&
    typeof doc.versionId === 'string' && !!doc.versionId &&
    typeof doc.documentId === 'string' && !!doc.documentId &&
    typeof doc.fileName === 'string' &&
    Array.isArray(doc.blocks) &&
    Number.isSafeInteger(doc.parseRevision) && doc.parseRevision >= 0,
  ).map(doc => ({
    documentId: doc.documentId, versionId: doc.versionId,
    fileName: doc.fileName, parseStatus: doc.parseStatus, blocks: doc.blocks,
  }))
  return { sources, reason: sources.length ? null : '尚无有效的待审申报材料。请先在材料栏通过系统文件选择器导入原件。' }
}

export function NativeManualItemDialog({
  open, onOpenChange, caseId, actions,
}: NativeManualItemDialogProps): React.ReactElement {
  const [loadState, setLoadState] = React.useState<LoadState>('loading')
  const [reason, setReason] = React.useState<string | null>(null)
  const [sources, setSources] = React.useState<NativeSource[]>([])
  const [selectedVersion, setSelectedVersion] = React.useState('')
  const [blockId, setBlockId] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [score, setScore] = React.useState('')
  const [level, setLevel] = React.useState('')
  const [activityDate, setActivityDate] = React.useState('')
  const [organizer, setOrganizer] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  // When Main commits but the reply is lost, retry unchanged intent using
  // the same requestId so the original durable receipt is replayed.
  const retryIntent = React.useRef<{ signature: string; requestId: string } | null>(null)

  React.useEffect(() => {
    if (!open || !caseId) return
    let active = true
    setLoadState('loading')
    setReason(null)
    setSources([])
    setSelectedVersion('')
    setBlockId('')
    setTitle('')
    setCategory('')
    setScore('')
    setLevel('')
    setActivityDate('')
    setOrganizer('')
    retryIntent.current = null
    void window.reviewAPI.getAggregateV2(caseId).then(aggregate => {
      if (!active) return
      const selection = nativeManualSourcesFromAggregate(aggregate, caseId)
      setSources(selection.sources)
      setReason(selection.reason)
      setSelectedVersion(selection.sources[0]?.versionId ?? '')
      setLoadState(selection.sources.length ? 'ready' : 'unavailable')
    }).catch(error => {
      if (!active) return
      setLoadState('unavailable')
      setReason(`读取案卷材料失败：${error instanceof Error ? error.message : String(error)}`)
    })
    return () => { active = false }
  }, [open, caseId])

  const selectedSource = sources.find(source => source.versionId === selectedVersion)
  const selectableBlocks = (selectedSource?.blocks ?? []).filter(block =>
    block && typeof block.blockId === 'string' && !!block.blockId &&
    typeof block.text === 'string',
  )
  const numericScore = score.trim() ? Number(score) : NaN
  const canSubmit = !!caseId && loadState === 'ready' && !submitting &&
    !!selectedSource && title.trim().length > 0 && title.length <= 160 &&
    category.trim().length > 0 && category.length <= 80 &&
    Number.isFinite(numericScore) && numericScore >= 0 && numericScore <= 1_000_000 &&
    level.length <= 100 && activityDate.length <= 80 && organizer.length <= 200

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!canSubmit || !caseId || !selectedSource) return
    const intent = {
      documentVersionId: selectedSource.versionId,
      ...(blockId ? { sourceBlockId: blockId } : {}),
      title: title.trim(), category: category.trim(), declaredScore: numericScore,
      ...(level.trim() ? { level: level.trim() } : {}),
      ...(activityDate.trim() ? { activityDate: activityDate.trim() } : {}),
      ...(organizer.trim() ? { organizer: organizer.trim() } : {}),
    }
    const signature = JSON.stringify([caseId, intent])
    if (retryIntent.current?.signature !== signature) {
      retryIntent.current = {
        signature, requestId: `ui-native-item-${globalThis.crypto.randomUUID()}`,
      }
    }
    setSubmitting(true)
    try {
      const ok = await actions.createNativeReviewItem(intent, caseId, retryIntent.current.requestId)
      if (ok) {
        retryIntent.current = null
        toast.success('人工申报事项已登记', {
          description: '事项保留真实材料版本与来源位置；分数是人工申报值，不代表已审核认定。',
        })
        onOpenChange(false)
      } else {
        toast.error('登记失败：案卷或材料可能已改变，请核查审核错误提示并重新打开。')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={value => { if (!submitting) onOpenChange(value) }}>
      <DialogContent className="max-h-[88vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>人工登记申报事项</DialogTitle>
          <DialogDescription>
            只能选用本案已登记的真实申报材料。此处填写的是待审核的人工声明，
            不代表 AI 已核验、校方已认可分数或审核已经完成。
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={event => void handleSubmit(event)}>
          {loadState === 'loading'
            ? <p role="status" className="text-sm text-muted-foreground">正在读取原生案卷与材料版本…</p>
            : null}
          {reason && <p role="status" className="rounded-md border border-border p-3 text-sm text-muted-foreground">{reason}</p>}
          <div className="space-y-1.5">
            <Label htmlFor="native-manual-source">申报材料（本案有效版本）</Label>
            <select id="native-manual-source" value={selectedVersion}
              disabled={loadState !== 'ready' || submitting}
              onChange={event => { setSelectedVersion(event.target.value); setBlockId('') }}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
              {sources.length === 0 && <option value="">请先导入申报材料</option>}
              {sources.map(source => (
                <option key={source.versionId} value={source.versionId}>
                  {source.fileName} · 版本 {source.versionId.slice(0, 10)} · {source.parseStatus}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="native-manual-block">原件中的位置（可选）</Label>
            <select id="native-manual-block" value={blockId}
              disabled={!selectedSource || submitting}
              onChange={event => setBlockId(event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="">整份原件（文件级来源，不虚构段落定位）</option>
              {selectableBlocks.map(block => (
                <option key={block.blockId} value={block.blockId}>
                  {block.text.trim().slice(0, 90) || `解析块 ${block.blockId.slice(0, 12)}`}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              解析块必须来自该原件版本；提交时 Main 会重新核验，失效时拒绝写入。
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="native-manual-title">事项名称</Label>
            <Input id="native-manual-title" value={title} maxLength={160}
              onChange={event => setTitle(event.target.value)}
              placeholder="如：学科竞赛获奖（待核验）" disabled={submitting}/>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="native-manual-category">申报类别</Label>
              <Input id="native-manual-category" value={category} maxLength={80}
                onChange={event => setCategory(event.target.value)}
                placeholder="如：智育" disabled={submitting}/>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="native-manual-score">人工申报分值（未认定）</Label>
              <Input id="native-manual-score" type="number" min={0} max={1000000}
                step="any" value={score} onChange={event => setScore(event.target.value)}
                placeholder="如：2.5" disabled={submitting}/>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="native-manual-level">等级（可选）</Label>
              <Input id="native-manual-level" value={level} maxLength={100}
                onChange={event => setLevel(event.target.value)} disabled={submitting}/>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="native-manual-date">活动日期（可选）</Label>
              <Input id="native-manual-date" value={activityDate} maxLength={80}
                onChange={event => setActivityDate(event.target.value)}
                placeholder="如：2026-09-01" disabled={submitting}/>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="native-manual-organizer">主办或颁发单位（可选）</Label>
            <Input id="native-manual-organizer" value={organizer} maxLength={200}
              onChange={event => setOrganizer(event.target.value)} disabled={submitting}/>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="ghost" disabled={submitting} onClick={() => onOpenChange(false)}>取消</Button>
            <Button type="submit" disabled={!canSubmit}>
              {submitting ? '登记中…' : '登记为待审事项'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
