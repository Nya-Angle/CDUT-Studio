import * as React from 'react'
import { useAtomValue } from 'jotai'
import { toast } from 'sonner'
import { ChevronDown, ChevronUp, LoaderCircle, Plus, Trash2, Upload } from 'lucide-react'
import type { ReviewImportProgressEvent, SourceDocument } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'
import { ConfirmDialog } from '@profer/ui/primitives/confirm-dialog'
import { reviewCaseAtom } from '@/atoms/review-atoms'
import type { ReviewActions } from './use-review-actions'

const ROLE_NAMES: Record<SourceDocument['role'], string> = {
  rule: '审核依据',
  application: '申报材料',
  evidence: '证明材料',
}

function createImportRequestId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `review-import-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function importProgressLabel(progress: ReviewImportProgressEvent | null, fallback: string): string {
  if (!progress) return fallback
  const batch = progress.fileIndex && progress.fileCount ? `${progress.fileIndex}/${progress.fileCount} · ` : ''
  if (progress.phase === 'selecting') return '等待选择文件…'
  if (progress.phase === 'scanning-pdf' || progress.phase === 'rendering-pdf') return `${batch}检查 PDF ${progress.page ?? 0}/${progress.totalPages ?? 0} 页`
  if (progress.phase === 'extracting-text') return `${batch}正在解析：${progress.fileName ?? ''}`
  if (progress.phase === 'file-failed') return `${batch}导入失败：${progress.fileName ?? '文件'}`
  if (progress.phase === 'file-complete') return `${batch}已导入：${progress.fileName ?? '文件'}`
  return `${batch}${progress.message ?? fallback}`
}

function subscribeToImportProgress(callback: (event: ReviewImportProgressEvent) => void): (() => void) | undefined {
  // dev 下 renderer 可能先于 preload 热更新；旧 bridge 不提供进度订阅时仍允许正常上传。
  const subscribe = window.reviewAPI?.onImportProgress
  return typeof subscribe === 'function' ? subscribe(callback) : undefined
}

export function ReviewMaterialLaneActions({
  role,
  documentIds,
  actions,
  onAddManual,
}: {
  role: SourceDocument['role']
  documentIds: string[]
  actions: ReviewActions
  onAddManual?: () => void
}): React.ReactElement {
  const reviewCase = useAtomValue(reviewCaseAtom)
  const [importing, setImporting] = React.useState(false)
  const [progress, setProgress] = React.useState<ReviewImportProgressEvent | null>(null)
  const activeRequestId = React.useRef<string | null>(null)
  const [clearOpen, setClearOpen] = React.useState(false)
  const [clearing, setClearing] = React.useState(false)
  const name = ROLE_NAMES[role]

  React.useEffect(() => subscribeToImportProgress((event) => {
    if (event.requestId === activeRequestId.current) setProgress(event)
  }), [])

  const importOne = async (): Promise<void> => {
    if (!reviewCase || importing) return
    const requestId = createImportRequestId()
    activeRequestId.current = requestId
    setProgress({ requestId, caseId: reviewCase.id, role, phase: 'selecting', message: '等待选择文件' })
    setImporting(true)
    try {
      const result = await actions.importDocument(role, requestId)
      if (result?.documents.length) toast.success(`已添加 ${result.documents.length} 份${name}`)
      if (result?.failures.length) toast.error(`${result.failures.length} 份文件导入失败：${result.failures.slice(0, 3).map((failure) => failure.fileName).join('、')}`)
    } catch (error) {
      toast.error(`${name}导入失败：${error instanceof Error ? error.message : String(error)}`)
    } finally {
      activeRequestId.current = null
      setProgress(null)
      setImporting(false)
    }
  }

  const clearLane = async (): Promise<void> => {
    setClearing(true)
    try {
      if (await actions.clearDocuments(role)) {
        toast.success(`已从当前审核中清空${name}`)
        setClearOpen(false)
      } else {
        toast.error(`清空${name}失败，请查看页面提示`)
      }
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {role === 'rule' && onAddManual ? (
        <>
          <Button type="button" size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs" disabled={!reviewCase || importing} title={reviewCase ? '手写一条审核依据' : '请先新建审核任务'} onClick={onAddManual}>
            <Plus size={12} />添加依据
          </Button>
          <Button type="button" size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs" disabled={!reviewCase || importing} title={importing ? importProgressLabel(progress, '等待选择…') : reviewCase ? '从本地选择依据文件' : '请先新建审核任务'} onClick={() => void importOne()}>
          {importing ? <LoaderCircle size={12} className="animate-spin" /> : <Plus size={12} />}
            {importing ? <span className="min-w-0 max-w-40 truncate">{importProgressLabel(progress, '等待选择…')}</span> : '上传依据'}
          </Button>
        </>
      ) : (
        <Button
          id={role === 'evidence' ? 'review-evidence-upload-button' : undefined}
          type="button"
          size="sm"
          variant="outline"
          className="h-7 gap-1 px-2 text-xs"
          disabled={!reviewCase || importing}
          title={importing ? importProgressLabel(progress, '正在导入…') : reviewCase ? `只添加到${name}` : '请先新建审核任务'}
          onClick={() => void importOne()}
        >
          {importing ? <LoaderCircle size={12} className="animate-spin" /> : <Plus size={12} />}
          {importing ? <span className="min-w-0 max-w-40 truncate">{importProgressLabel(progress, '等待选择…')}</span> : `添加${name}`}
        </Button>
      )}
      {documentIds.length > 0 && (
        <>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 px-1.5 text-xs text-muted-foreground hover:text-destructive"
            disabled={clearing}
            onClick={() => setClearOpen(true)}
          >
            清空
          </Button>
          <ConfirmDialog
            open={clearOpen}
            onOpenChange={setClearOpen}
            title={`清空${name}`}
            description={`确认从当前审核中移除全部 ${documentIds.length} 份${name}？关联内容会同步撤下，案卷原文件和历史记录会保留。`}
            confirmLabel="清空材料"
            loadingLabel="正在清空…"
            loading={clearing}
            onConfirm={() => void clearLane()}
          />
        </>
      )}
    </div>
  )
}

/** 中栏申报材料与证明材料的统一拖放导入框。 */
export function ReviewMaterialDropZone({
  role,
  hasDocuments,
  actions,
}: {
  role: 'application' | 'evidence'
  hasDocuments: boolean
  actions: ReviewActions
}): React.ReactElement {
  const reviewCase = useAtomValue(reviewCaseAtom)
  const [dragging, setDragging] = React.useState(false)
  const [importing, setImporting] = React.useState(false)
  const [progress, setProgress] = React.useState<ReviewImportProgressEvent | null>(null)
  const activeRequestId = React.useRef<string | null>(null)
  const dragCounter = React.useRef(0)
  const label = role === 'application' ? '申报材料' : '证明材料'

  React.useEffect(() => subscribeToImportProgress((event) => {
    if (event.requestId === activeRequestId.current) setProgress(event)
  }), [])

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
    event.preventDefault()
    event.stopPropagation()
    setDragging(false)
    dragCounter.current = 0
    if (!reviewCase || importing) return
    const files = Array.from(event.dataTransfer.files ?? [])
    if (files.length === 0) return

    const paths: string[] = []
    for (const file of files) {
      try {
        const path = window.electronAPI.getPathForFile(file)
        if (path) paths.push(path)
      } catch { /* 无法读取本地路径的文件会在下方汇总提示 */ }
    }
    if (paths.length === 0) {
      toast.error('无法读取拖入文件的本地路径，请点击右上角按钮选择文件')
      return
    }

    setImporting(true)
    const requestId = createImportRequestId()
    activeRequestId.current = requestId
    setProgress({ requestId, caseId: reviewCase.id, role, phase: 'extracting-text', fileName: paths[0], message: `正在导入 ${paths.length} 份${label}` })
    let imported = 0
    try {
      for (const path of paths) {
        if (await actions.importDocumentFromPath(role, path, requestId)) imported += 1
      }
      if (imported > 0) toast.success(`已添加 ${imported} 份${label}`)
      if (imported < paths.length) toast.error(`${paths.length - imported} 份文件未能导入，请查看页面提示`)
    } finally {
      activeRequestId.current = null
      setProgress(null)
      setImporting(false)
    }
  }

  return (
    <div
      role="region"
      aria-label={`拖入${label}文件`}
      onDragEnter={(event) => { event.preventDefault(); event.stopPropagation(); dragCounter.current += 1; setDragging(true) }}
      onDragOver={(event) => { event.preventDefault(); event.stopPropagation() }}
      onDragLeave={(event) => { event.preventDefault(); event.stopPropagation(); dragCounter.current = Math.max(0, dragCounter.current - 1); if (dragCounter.current === 0) setDragging(false) }}
      onDrop={(event) => void handleDrop(event)}
      className={[
        'flex shrink-0 items-center justify-center gap-2 rounded-lg border border-dashed px-3 text-center transition-colors',
        hasDocuments ? 'min-h-12 py-2' : 'min-h-16 py-3',
        dragging ? 'border-primary bg-primary/5 text-primary' : 'border-border/70 text-muted-foreground',
        importing ? 'opacity-70' : '',
      ].join(' ')}
    >
      {importing ? <LoaderCircle size={15} className="shrink-0 animate-spin" /> : <Upload size={15} className="shrink-0" />}
      <div className="min-w-0">
        <p className="text-xs font-medium">{importing ? importProgressLabel(progress, `正在导入${label}…`) : dragging ? `松手添加为${label}` : `将文件拖到这里添加${label}`}</p>
        {!dragging && !importing && <p className="mt-0.5 text-xs">支持一次拖入多个文件</p>}
      </div>
    </div>
  )
}

export function RemoveReviewDocumentButton({
  document,
  actions,
}: {
  document: Pick<SourceDocument, 'id' | 'fileName'>
  actions: ReviewActions
}): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  const [removing, setRemoving] = React.useState(false)

  const remove = async (): Promise<void> => {
    setRemoving(true)
    try {
      if (await actions.removeDocument(document.id)) {
        toast.success(`已移除：${document.fileName}`)
        setOpen(false)
      } else {
        toast.error('移除材料失败，请查看页面提示')
      }
    } finally {
      setRemoving(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
        aria-label={`删除材料 ${document.fileName}`}
        title={`移除 ${document.fileName}`}
        onClick={() => setOpen(true)}
      >
        <Trash2 size={13} />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="移除这份材料？"
        description={`确认将「${document.fileName}」从当前审核中移除？关联内容会同步撤下，案卷原文件和历史记录会保留。`}
        confirmLabel="移除材料"
        loadingLabel="正在移除…"
        loading={removing}
        onConfirm={() => void remove()}
      />
    </>
  )
}

export function MoveReviewDocumentButtons({
  role,
  documentIds,
  documentId,
  actions,
}: {
  role: SourceDocument['role']
  documentIds: string[]
  documentId: string
  actions: ReviewActions
}): React.ReactElement {
  const [busy, setBusy] = React.useState(false)
  const index = documentIds.indexOf(documentId)
  const move = async (direction: -1 | 1): Promise<void> => {
    const targetIndex = index + direction
    if (busy || index < 0 || targetIndex < 0 || targetIndex >= documentIds.length) return
    const next = [...documentIds]
    ;[next[index], next[targetIndex]] = [next[targetIndex]!, next[index]!]
    setBusy(true)
    try {
      if (await actions.reorderDocuments(role, next)) toast.success('材料顺序已更新')
      else toast.error('调整材料顺序失败，请查看页面提示')
    } finally {
      setBusy(false)
    }
  }

  return (
    <span className="flex shrink-0 items-center">
      <Button type="button" variant="ghost" size="icon-sm" className="size-6" aria-label="材料上移" title="上移" disabled={busy || index <= 0} onClick={() => void move(-1)}>
        <ChevronUp size={13} />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" className="size-6" aria-label="材料下移" title="下移" disabled={busy || index < 0 || index >= documentIds.length - 1} onClick={() => void move(1)}>
        <ChevronDown size={13} />
      </Button>
    </span>
  )
}
