import * as React from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { ArrowLeft, ExternalLink, FileSearch } from 'lucide-react'
import type { SourceLocation } from '@profer/shared'
import { FilePreviewDialog } from '@/components/file-browser/FilePreviewDialog'
import { reviewActivePaneAtom, reviewSourceFocusAtom, reviewWorkspaceAggregateAtom } from '@/atoms/review-atoms'
import { cn } from '@/lib/utils'
import { resolveT08Source } from './review-v3-t08-case-report'
import { reviewSourceStatusLabel, type ReviewSourcePurpose } from './review-v3-source-navigation'

function locationText(location?: SourceLocation): string {
  if (!location) return '位置未提供'
  switch (location.kind) {
    case 'pdf-rect': return `第 ${location.page} 页 · 区域坐标`
    case 'sheet-cell': return `${location.sheet}!${location.column}${location.row}`
    case 'paragraph': return `第 ${location.index + 1} 段`
    case 'text-range': return `字符 ${location.start}–${location.end}`
    case 'file': return '仅文件级'
  }
}

/**
 * F10：直接以 V2 DocumentVersion 的原文块定位，避免将新版本的引用猜到旧 V1 块。
 * 不写入任何案卷/Run；无法确认的来源只允许打开原件人工核对。
 */
export function ReviewV3SourceNavigator({ purpose }: { purpose: ReviewSourcePurpose }): React.ReactElement | null {
  const focus = useAtomValue(reviewSourceFocusAtom)
  const aggregate = useAtomValue(reviewWorkspaceAggregateAtom)
  const setActivePane = useSetAtom(reviewActivePaneAtom)
  const setSourceFocus = useSetAtom(reviewSourceFocusAtom)
  const targetRef = React.useRef<HTMLDivElement>(null)
  const blockRefs = React.useRef(new Map<string, HTMLDivElement>())
  const [preview, setPreview] = React.useState<{ path: string; fileName: string } | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState('')
  const [searchIndex, setSearchIndex] = React.useState(0)
  const active = !!focus && !!aggregate && focus.purpose === purpose && focus.ref.caseId === aggregate.caseV2.id
  const resolved = active ? resolveT08Source(focus.ref, aggregate) : null
  const document = resolved?.document
  const selectedBlockId = resolved?.state === 'located' ? resolved.blockId : undefined
  const searchMatches = React.useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    if (!needle || !document) return []
    return document.blocks.filter((block) => `${block.text} ${block.imageAlt ?? ''}`.toLocaleLowerCase().includes(needle)).map((block) => block.blockId)
  }, [document, query])
  const searchBlockId = searchMatches[searchIndex % searchMatches.length]

  React.useEffect(() => {
    if (!active) return
    // 先让窄屏栏挂载，再将目标块带入可视范围；同一引用重复点击也会重定位。
    const frame = requestAnimationFrame(() => {
      const target = selectedBlockId ? blockRefs.current.get(selectedBlockId) : null
      ;(target ?? targetRef.current)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    return () => cancelAnimationFrame(frame)
  }, [active, focus?.nonce, selectedBlockId])

  React.useEffect(() => { setError(null); setPreview(null) }, [focus?.nonce, aggregate?.caseV2.id])
  React.useEffect(() => { setQuery(''); setSearchIndex(0) }, [focus?.nonce, aggregate?.caseV2.id])
  React.useEffect(() => {
    if (!active || !searchBlockId) return
    const frame = requestAnimationFrame(() => blockRefs.current.get(searchBlockId)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
    return () => cancelAnimationFrame(frame)
  }, [active, searchBlockId])

  if (!active || !focus || !aggregate || !resolved) return null

  const openOriginal = async (): Promise<void> => {
    if (!document) return
    setError(null)
    try {
      const path = await window.reviewAPI.getWorkspaceDocumentPreviewPath({
        caseId: aggregate.caseV2.id,
        documentVersionId: document.versionId,
      })
      if (!path) throw new Error('案卷原件不可读取')
      setPreview({ path, fileName: document.fileName })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    }
  }

  const backToCheck = (): void => {
    const originKey = focus.originPendingActionKey
    setSourceFocus(null)
    setActivePane('right')
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!originKey) return
      const target = documentQueryPending(originKey)
      const section = target?.closest('details')
      if (section) section.open = true
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      target?.focus({ preventScroll: true })
    }))
  }

  return (
    <section ref={targetRef} aria-label="当前引用原件定位" className="mx-3 mt-3 shrink-0 rounded-xl border border-primary/35 bg-primary/[0.035] p-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 text-sm font-semibold"><FileSearch size={15} className="shrink-0 text-primary" /><span>来源定位</span></div>
        <button type="button" onClick={backToCheck} className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-muted"><ArrowLeft size={12} />返回原检查</button>
      </div>
      <p className="mt-2 break-all text-xs font-medium">{resolved.label}</p>
      <p className={cn('mt-1 text-xs', resolved.state === 'located' ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300')}>
        {reviewSourceStatusLabel(resolved.state)}
      </p>
      {document && <p className="mt-1 text-xs text-muted-foreground">原件版本：{document.versionId} · 解析版本：{document.parseRevision}</p>}
      {resolved.state !== 'located' && <p className="mt-1 text-xs leading-5 text-muted-foreground">不会将不匹配的坐标指向其他材料或段落。请打开原件核实；文件级定位不表示已验证引用内容。</p>}
      {document && <button type="button" onClick={() => void openOriginal()} className="mt-2 inline-flex items-center gap-1 rounded-md border border-primary/30 bg-background px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/5"><ExternalLink size={12} />打开原始文件</button>}
      {error && <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>}

      {document && document.blocks.length > 0 && (
        <>
        <div className="mt-3 flex items-center gap-2">
          <input
            value={query}
            onChange={(event) => { setQuery(event.target.value); setSearchIndex(0) }}
            onKeyDown={(event) => { if (event.key === 'Enter' && searchMatches.length) { event.preventDefault(); setSearchIndex((value) => (value + 1) % searchMatches.length) } }}
            aria-label="搜索当前原件解析文本"
            placeholder="搜索当前原件…"
            className="min-w-0 flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {query.trim() && <span role="status" className="shrink-0 text-xs text-muted-foreground">{searchMatches.length ? `${searchIndex % searchMatches.length + 1}/${searchMatches.length}` : '无匹配'}</span>}
          <button type="button" disabled={searchMatches.length === 0} onClick={() => setSearchIndex((value) => (value + 1) % searchMatches.length)} className="shrink-0 rounded-md border bg-background px-2 py-1.5 text-xs disabled:opacity-40">下一个</button>
        </div>
        <div className="mt-3 max-h-[46vh] space-y-1 overflow-y-auto rounded-lg border border-border/50 bg-background/80 p-2 scrollbar-thin" aria-label={`${document.fileName} 解析原文`}>
          {document.blocks.map((block) => (
            <div
              key={block.blockId}
              ref={(element) => { if (element) blockRefs.current.set(block.blockId, element); else blockRefs.current.delete(block.blockId) }}
              data-review-v2-source-block-id={block.blockId}
              className={cn('rounded-md px-2.5 py-2 text-xs leading-5', block.blockId === selectedBlockId ? 'bg-amber-500/15 ring-2 ring-amber-500/70' : block.blockId === searchBlockId ? 'bg-blue-500/15 ring-2 ring-blue-500/60' : 'hover:bg-muted/50')}
            >
              <div className="mb-0.5 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                <span>{locationText(block.location)}</span>
                {block.format && <span>{block.format === 'ocr-text' ? 'OCR 文字' : block.format === 'vision-text' ? '视觉识别' : block.format}</span>}
                {block.blockId === selectedBlockId && <span className="font-semibold text-amber-700 dark:text-amber-300">当前引用</span>}
              </div>
              <p className="whitespace-pre-wrap break-words">{block.text || block.imageAlt || (block.kind === 'image' ? '图片块：请打开原件核对图像' : '空文本块')}</p>
            </div>
          ))}
        </div>
        </>
      )}
      {preview && <FilePreviewDialog open filePath={preview.path} fileName={preview.fileName} onClose={() => setPreview(null)} />}
    </section>
  )
}

function documentQueryPending(key: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-review-pending-key="${CSS.escape(key)}"]`)
}
