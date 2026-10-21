/**
 * AssistantDrawer — 审核助手对话抽屉（D9）
 *
 * 固定右侧抽屉（reviewAssistantOpenAtom 控制显隐，translate-x 过渡）。
 * - 头部：标题 + 关闭按钮 + 当前上下文（案卷名 + 选中的问题卡）
 * - 消息列表：按案卷隔离（reviewAssistantThreadsAtom[caseId]）；
 *   degraded 消息顶部显示"离线解答（未连接模型）"灰条，references 显示为小 badge
 * - 输入区：Textarea + 发送按钮（pending 时 spinner）
 * - 快捷提问 3 个（为什么这样判？/ 我要补哪张证明？/ 申报分值怎么改？）
 * - 快捷键 Ctrl+Shift+A（Mac: Cmd+Shift+A）由主视图监听，这里只管开关状态
 */

import * as React from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Send, X } from 'lucide-react'
import { Button } from '@profer/ui/primitives/button'
import { Spinner } from '@profer/ui/primitives/spinner'
import { Textarea } from '@profer/ui/primitives/textarea'
import type { CaseAggregateV2, ReviewAssistantMessage, SourceRef } from '@profer/shared'
import { FilePreviewDialog } from '@/components/file-browser/FilePreviewDialog'
import { ReviewV3T08ReportPanel } from './ReviewV3T08ReportPanel'
import { ReviewV3T08SuggestionReview } from './ReviewV3T08SuggestionReview'
import { resolveT08Source, type T08ResolvedSource } from './review-v3-t08-case-report'
import { buildF17AssistantContext, extractF17Citations, resolveF17Citation } from './review-v3-f17-grounding'
import {
  reviewAssistantOpenAtom,
  reviewAssistantPendingAtom,
  reviewAssistantThreadsAtom,
  reviewCaseAtom,
  selectedFindingAtom,
  selectedCaseIdAtom,
  reviewRunAtom,
  reviewFocusAtom,
  reviewWorkspaceAggregateAtom,
  reviewWorkspaceRunAtom,
  reviewWorkspaceRunStaleAtom,
  reviewWorkspaceTemplateAtom,
  reviewSourceFocusAtom,
  reviewActivePaneAtom,
} from '@/atoms/review-atoms'
import { cn } from '@/lib/utils'
import type { ReviewActions } from './use-review-actions'

/** 快捷提问（设计文档 §审核助手 的三个示例问题） */
const QUICK_PROMPTS = ['为什么这样判？', '我要补哪张证明？', '申报分值怎么改？'] as const

interface AssistantDrawerProps {
  actions: ReviewActions
}

export function AssistantDrawer({ actions }: AssistantDrawerProps): React.ReactElement {
  const open = useAtomValue(reviewAssistantOpenAtom)
  const pending = useAtomValue(reviewAssistantPendingAtom)
  const reviewCase = useAtomValue(reviewCaseAtom)
  const selectedFinding = useAtomValue(selectedFindingAtom)
  const threads = useAtomValue(reviewAssistantThreadsAtom)
  const setOpen = useSetAtom(reviewAssistantOpenAtom)
  const setThreads = useSetAtom(reviewAssistantThreadsAtom)
  const legacyRun = useAtomValue(reviewRunAtom)
  const setLegacyFocus = useSetAtom(reviewFocusAtom)
  const selectedCaseId = useAtomValue(selectedCaseIdAtom)
  const aggregate = useAtomValue(reviewWorkspaceAggregateAtom)
  const workspaceRun = useAtomValue(reviewWorkspaceRunAtom)
  const workspaceRunStale = useAtomValue(reviewWorkspaceRunStaleAtom)
  const workspaceTemplate = useAtomValue(reviewWorkspaceTemplateAtom)
  const setSourceFocus = useSetAtom(reviewSourceFocusAtom)
  const setActivePane = useSetAtom(reviewActivePaneAtom)
  const [tab, setTab] = React.useState<'chat' | 'sources' | 'reports'>('chat')
  const [inspected, setInspected] = React.useState<T08ResolvedSource | null>(null)
  const [preview, setPreview] = React.useState<{ path: string; fileName: string } | null>(null)
  const [sourceNotice, setSourceNotice] = React.useState('')
  const [draftOpinionId, setDraftOpinionId] = React.useState<string | null>(null)
  const [draft, setDraft] = React.useState('')
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const caseId = selectedCaseId ?? reviewCase?.id ?? ''
  const legacyCaseActive = reviewCase?.id === caseId
  const messages = threads[caseId] ?? []
  const currentRun = workspaceRun?.caseId === aggregate?.caseV2.id ? workspaceRun : null
  const opinions = currentRun?.opinions ?? []
  const draftOpinion = opinions.find((opinion) => opinion.id === draftOpinionId)
  React.useEffect(() => {
    setInspected(null)
    setPreview(null)
    setDraftOpinionId(null)
    setSourceNotice('')
  }, [caseId, currentRun?.id])

  const openSource = async (ref: SourceRef): Promise<void> => {
    if (!aggregate) return
    const resolved = resolveT08Source(ref, aggregate)
    setInspected(resolved)
    setSourceNotice('')
    if (!resolved.document || resolved.state === 'foreign-case' || resolved.state === 'parse-revision-mismatch') {
      setSourceNotice('无法核对本案的精确原件版本；不执行猜测跳转。')
      return
    }
    const purpose = resolved.document.role === 'rule' ? 'rule'
      : resolved.document.role === 'application' ? 'application' : 'evidence'
    setSourceFocus({ ref, purpose, nonce: Date.now() })
    setActivePane(purpose === 'rule' ? 'left' : 'center')
  }
  const openOriginal = async (): Promise<void> => {
    if (!aggregate || !inspected?.document) return
    try {
      const path = await window.reviewAPI.getWorkspaceDocumentPreviewPath({
        caseId: aggregate.caseV2.id, documentVersionId: inspected.document.versionId,
      })
      if (!path) { setSourceNotice('原件路径暂不可读取，可先核对下方的已解析文本。'); return }
      setPreview({ path, fileName: inspected.document.fileName })
    } catch (error) { setSourceNotice('打开原件失败：' + String(error)) }
  }
  const resolveReference = (id: string): SourceRef | undefined => {
    if (!currentRun || !aggregate) return undefined
    if (id.startsWith('[F17:')) return resolveF17Citation(id, aggregate, currentRun) ?? undefined
    const opinion = currentRun.opinions.find((item) => item.id === id || item.checkId === id)
    const check = currentRun.checks.find((item) => item.checkId === id)
    const refs = opinion?.sourceRefs ?? check?.sourceRefs ?? []
    return refs.find((ref) => resolveT08Source(ref, aggregate).state === 'located')
      ?? refs.find((ref) => resolveT08Source(ref, aggregate).state === 'file-only')
  }

  const canNavigateReference = (id: string): boolean => {
    if (resolveReference(id)) return true
    if (!legacyCaseActive) return false
    if (legacyRun?.findings.some((finding) => finding.id === id)) return true
    if (reviewCase?.items.some((item) => item.id === id)) return true
    if (reviewCase?.documents.some((doc) => doc.id === id && doc.blocks.length > 0)) return true
    return !!reviewCase?.rulePacks.some((pack) =>
      (pack.id === id || pack.outline.some((rule) => rule.id === id)) &&
      pack.outline.some((rule) => rule.anchors.length > 0))
  }
  const referenceLabel = (id: string): string => {
    if (!id.startsWith('[F17:') || !aggregate || !currentRun) return id
    const ref = resolveF17Citation(id, aggregate, currentRun)
    return ref ? resolveT08Source(ref, aggregate).label : '历史或无法核验的来源'
  }
  const navigateReference = (id: string): void => {
    const v3Source = resolveReference(id)
    if (v3Source) { void openSource(v3Source); return }
    if (!legacyCaseActive) return
    const finding = legacyRun?.findings.find((item) => item.id === id)
    if (finding) { actions.focusFinding(finding); setActivePane('center'); return }
    const item = reviewCase?.items.find((candidate) => candidate.id === id)
    if (item) {
      setLegacyFocus({ findingId: id, subjectAnchor: item.anchor, severity: 'yellow', nonce: Date.now() })
      setActivePane('center')
      return
    }
    const pack = reviewCase?.rulePacks.find((rulePack) => rulePack.id === id || rulePack.outline.some((rule) => rule.id === id))
    if (pack) {
      const anchors = pack.id === id ? pack.outline.flatMap((rule) => rule.anchors)
        : pack.outline.find((rule) => rule.id === id)?.anchors ?? []
      if (anchors.length > 0) { actions.locateRuleAnchor(anchors); setActivePane('left') }
      return
    }
    const doc = reviewCase?.documents.find((document) => document.id === id)
    if (doc?.blocks.length) {
      setLegacyFocus({
        findingId: id, subjectAnchor: { documentId: doc.id, precision: 'document' },
        severity: 'yellow', nonce: Date.now(),
      })
      setActivePane(doc.role === 'rule' ? 'left' : 'center')
    }
  }

  // 新消息到达 → 滚到底部
  React.useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length, pending])

  // 抽屉打开 → 聚焦输入框
  React.useEffect(() => {
    if (open) textareaRef.current?.focus()
  }, [open])

  /** 发送一条用户消息并请求助手回答 */
  const send = async (text: string): Promise<void> => {
    const content = text.trim()
    if (!content || pending || !caseId) return
    const userMessage: ReviewAssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    }
    const nextHistory = [...messages, userMessage]
    // 先乐观写入用户消息（线程按案卷隔离），再请求回答
    setThreads((previous) => ({ ...previous, [caseId]: nextHistory }))
    setDraft('')
    // Only the API request gets the source-grounded V3 run context; the visible user
    // message remains the question. The Main gateway still owns model dispatch.
    const modelHistory = aggregate && currentRun && !workspaceRunStale
      ? [...nextHistory.slice(0, -1), { ...userMessage, content: buildF17AssistantContext(aggregate, currentRun, content) }]
      : nextHistory
    await actions.assistantChat(modelHistory)
  }

  if (!open) return <div aria-hidden="true" className="hidden" />

  return (
    <aside
      role="dialog"
      aria-label="审核助手"
      className="absolute right-0 top-0 z-40 flex h-full w-[380px] flex-col border-l border-border/60 bg-card shadow-2xl transition-transform duration-200 translate-x-0"
    >
      {/* 头部 */}
      <header className="flex shrink-0 items-start justify-between gap-2 border-b border-border/60 px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">审核助手</h2>
          <p className="mt-0.5 truncate text-xs text-muted-foreground" title={aggregate?.caseV2.title ?? (legacyCaseActive ? reviewCase?.title : undefined)}>
            案卷：{aggregate?.caseV2.title ?? (legacyCaseActive ? reviewCase?.title : null) ?? '未载入'}
          </p>
          {selectedFinding && (
            <p className="mt-0.5 truncate text-xs text-blue-600 dark:text-blue-400" title={selectedFinding.title}>
              当前问题卡：{selectedFinding.title}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          aria-label="关闭审核助手"
          onClick={() => setOpen(false)}
        >
          <X size={15} />
        </Button>
      </header>

      <nav aria-label="助手功能" className="flex gap-1 border-b border-border/60 px-3 py-2 text-xs">
        {([['chat','案卷问答'],['sources','检查与来源'],['reports','报告导出']] as const).map(([id, label]) =>
          <button type="button" key={id} onClick={() => setTab(id)}
            className={cn('rounded px-2 py-1.5', tab === id ? 'bg-primary text-primary-foreground' : 'bg-muted/60 text-foreground')}>{label}</button>)}
      </nav>
      {/* 消息列表 */}
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto scrollbar-thin px-4 py-3">
        {tab === 'chat' && workspaceRunStale && currentRun && <p className="rounded bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
          本次审核 Run 已过期；助手不再把它的原件或结论当作当前上下文，请先重新审核。
        </p>}
        {tab === 'chat' && messages.length === 0 && (
          <p className="rounded-lg bg-muted/40 px-3 py-2 text-xs leading-5 text-muted-foreground">
            问答通过现有模型出口执行；当前 V3 Run 的检查与来源会作为只读上下文提供。无法核验的回答不代表审核决定，来源请以“检查与来源”页为准。
          </p>
        )}
        {tab === 'chat' && messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            extraReferences={currentRun && message.role === 'assistant'
              ? [
                  ...extractF17Citations(message.content),
                  ...[...currentRun.checks.map(x => x.checkId), ...opinions.map(x => x.id)]
                    .filter(id => message.content.split(/[^\p{L}\p{N}_.:-]+/gu).includes(id)).slice(0, 12),
                ] : []}
            onReference={navigateReference}
            canLocate={canNavigateReference}
            referenceLabel={referenceLabel}
          />
        ))}
        {tab === 'sources' && <>
          {!currentRun && <p className="rounded bg-muted p-3 text-xs text-muted-foreground">先打开并运行真实案卷，才能查看本次 Run 的检查来源。</p>}
          {currentRun && <div className="space-y-3">
            <p className="rounded bg-muted/50 p-2 text-xs">Run：{currentRun.id} · {currentRun.status} · {currentRun.coverage.pendingChecks} 项待处理
              {workspaceRunStale ? ' · 历史/过期输入，请勿作当前结论' : ''}</p>
            {currentRun.checks.map((check) => <article key={check.checkId} className="rounded border border-border p-2 text-xs">
              <p className="font-semibold">{check.checkId} · {check.status}</p>
              <p className="my-1 whitespace-pre-wrap">{check.reason}</p>
              {check.sourceRefs.map((ref, idx) => <SourceLink key={idx} refItem={ref} aggregate={aggregate} onOpen={openSource} />)}
            </article>)}
            {opinions.map((opinion) => <article key={opinion.id} className="rounded border border-border p-2 text-xs">
              <p className="font-semibold">{opinion.title} · {opinion.verification}</p>
              <p className="my-1 whitespace-pre-wrap">{opinion.detail}</p>
              <p className="mb-1 text-muted-foreground">AI 建议（并非已执行的修改）：{opinion.suggestionText}</p>
              {opinion.sourceRefs.map((ref, idx) => <SourceLink key={idx} refItem={ref} aggregate={aggregate} onOpen={openSource} />)}
              <button type="button" className="mt-2 rounded border border-border px-2 py-1" onClick={() => setDraftOpinionId(opinion.id)}>审阅修改草案</button>
            </article>)}
            {!currentRun.checks.length && !opinions.length && <p>该 Run 无检查/建议记录，不能制造问题卡。</p>}
          </div>}
          {draftOpinion && currentRun && aggregate && <ReviewV3T08SuggestionReview
            key={draftOpinion.id + ':' + currentRun.id}
            aggregate={aggregate}
            run={currentRun}
            template={workspaceTemplate}
            opinion={draftOpinion}
            stale={workspaceRunStale}
            onOpenSource={openSource}
            onClose={() => setDraftOpinionId(null)}
          />}
        </>}
        {tab === 'reports' && <ReviewV3T08ReportPanel aggregate={aggregate} currentRun={currentRun} currentStale={workspaceRunStale} template={workspaceTemplate} />}
        {tab === 'chat' && pending && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Spinner size="sm" />
            助手思考中…
          </div>
        )}
      </div>

      {inspected && <section className="max-h-[27vh] shrink-0 overflow-y-auto border-t border-primary/20 bg-muted/40 p-3 text-xs" aria-label="来源核对">
        <p className="font-semibold">定位来源：{inspected.label}</p>
        <p>核对状态：{inspected.state}{inspected.blockId ? ' · 文本块 '+inspected.blockId : ' · 不保证块级定位'}</p>
        {inspected.excerpt && <blockquote className="mt-1 max-h-28 overflow-auto whitespace-pre-wrap border-l-2 border-primary pl-2">{inspected.excerpt}</blockquote>}
        {sourceNotice && <p className="mt-1 text-muted-foreground">{sourceNotice}</p>}
        {inspected.document && <button type="button" className="mt-2 rounded border border-border px-2 py-1" onClick={() => void openOriginal()}>查看真实原件</button>}
        <button type="button" onClick={() => setInspected(null)} className="ml-2 rounded border px-2 py-1">返回</button>
      </section>}
      {preview && <FilePreviewDialog open filePath={preview.path} fileName={preview.fileName} onClose={() => setPreview(null)} />}
      {/* 快捷提问 */}
      {tab === 'chat' && <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-border/60 px-4 py-2">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={pending}
            onClick={() => void send(prompt)}
            className="rounded-md bg-muted px-2 py-1 text-xs text-foreground/80 transition-colors hover:bg-muted/70 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>}

      {/* 输入区 */}
      {tab === 'chat' && <div className="flex shrink-0 items-end gap-2 border-t border-border/60 px-4 py-3">
        <Textarea
          ref={textareaRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              void send(draft)
            }
          }}
          placeholder="向助手提问（Enter 发送，Shift+Enter 换行）"
          rows={2}
          className="min-h-[56px] resize-none text-sm"
        />
        <Button
          type="button"
          size="icon"
          className="size-9 shrink-0"
          aria-label="发送"
          disabled={pending || !draft.trim()}
          onClick={() => void send(draft)}
        >
          {pending ? <Spinner size="sm" /> : <Send size={15} />}
        </Button>
      </div>}
    </aside>
  )
}

/** 单条消息气泡（含 degraded 灰条与 references 徽标） */
function SourceLink({ refItem, aggregate, onOpen }: {
  refItem: SourceRef
  aggregate: CaseAggregateV2 | null
  onOpen(ref: SourceRef): Promise<void>
}): React.ReactElement {
  const located = aggregate ? resolveT08Source(refItem, aggregate) : null
  const possible = located?.state === 'located' || located?.state === 'file-only'
  return <button type="button" disabled={!possible} onClick={() => void onOpen(refItem)}
    title={possible ? '定位已知版本的原件' : '来源版本不存在或无法核对，禁止猜测跳转'}
    className="mr-1 mt-1 rounded bg-blue-500/10 px-2 py-1 text-left text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-blue-300">
    {located?.label ?? refItem.documentVersionId} {located?.state === 'file-only' ? '（仅文件）' : ''}
  </button>
}
function MessageBubble({ message, extraReferences, onReference, canLocate, referenceLabel }: {
  message: ReviewAssistantMessage
  extraReferences: string[]
  onReference(id: string): void
  canLocate(id: string): boolean
  referenceLabel(id: string): string
}): React.ReactElement {
  const isUser = message.role === 'user'
  return (
    <div className={cn('flex flex-col gap-1', isUser && 'items-end')}>
      {/* degraded：无模型渠道时的静态解答，顶部灰条明示 */}
      {message.degraded && !isUser && (
        <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          离线解答（未连接模型）
        </span>
      )}
      <div
        className={cn(
          'max-w-[92%] whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-sm leading-5',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted/60 text-foreground',
        )}
      >
        {message.content}
      </div>
      {/* 引用出处徽标 */}
      {((message.references?.length ?? 0) > 0 || extraReferences.length > 0) && (
        <div className="flex flex-wrap justify-end gap-1">
          {[...new Set([...(message.references ?? []), ...extraReferences])].map((reference) => (
            <button
              type="button"
              key={reference}
              disabled={!canLocate(reference)}
              onClick={() => onReference(reference)}
              title={canLocate(reference) ? '查看本次运行可定位的原件（不代表原文支持模型结论）' : '该引用不属于当前 Run 或没有可核对的原件落点'}
              className="rounded-md bg-blue-500/10 px-1.5 py-0.5 text-xs font-medium text-blue-600 disabled:opacity-50 dark:text-blue-400"
            >
              {referenceLabel(reference)}{!canLocate(reference) ? '（仅标识）' : ''}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
