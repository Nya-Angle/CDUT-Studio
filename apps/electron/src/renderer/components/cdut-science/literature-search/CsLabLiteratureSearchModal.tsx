/**
 * CsLabLiteratureSearchModal — 学术文献检索页面级大弹窗
 *
 * 社论极简大画幅：fixed inset-0 毛玻璃遮罩 + 羊皮纸暖白大卡片（92vw × 88vh），
 * 左列检索结果、右列即时预览（社论式左右分栏），外显高阶元数据，一键入库闭环。
 *
 * Editorial Minimalism：bg-cslab-bg 纸面、hairline 边框、shadow-subtle 微弱阴影、
 * 赤陶橙动作键，杜绝纯黑/纯白与高饱和数码冷色。
 */

import * as React from 'react'
import { Loader2, Search, X } from 'lucide-react'
import { useAtomValue } from 'jotai'
import type {
  CsLabAcademicPaperMetadata,
  CsLabAcademicSearchFilters,
  CsLabAcademicSourceStat,
} from '@profer/shared'
import { cn } from '@/lib/utils'
import { agentChannelIdAtom, agentModelIdAtom } from '@/atoms/agent-atoms'
import { CsLabLiteratureFilterBar } from './CsLabLiteratureFilterBar'
import {
  CsLabLiteratureSearchCard,
  formatPaperCitation,
  type CsLabIngestState,
} from './CsLabLiteratureSearchCard'
import { CsLabLiteraturePreviewPane } from './CsLabLiteraturePreviewPane'

interface IngestEntry {
  state: CsLabIngestState
  message?: string
  uri?: string
}

export interface CsLabLiteratureSearchModalProps {
  labId: string
  /** 划词反向检索：携带选中文本打开并自动发起检索。 */
  initialQuery?: string
  /** 激活窗格是否已打开文稿（决定「插入当前文稿引用」是否可用）。 */
  canInsertCitation?: boolean
  onClose: () => void
  /** 入库成功后刷新工作台资产。 */
  onIngested?: () => void
  /** 投射至当前分屏画布（文献 URI）。 */
  onCastToPane?: (uri: string) => void
  /** 把格式化引用插入当前文稿光标处。 */
  onInsertCitation?: (citation: string) => void
}

export function CsLabLiteratureSearchModal({
  labId,
  initialQuery,
  canInsertCitation,
  onClose,
  onIngested,
  onCastToPane,
  onInsertCitation,
}: CsLabLiteratureSearchModalProps): React.ReactElement {
  const channelId = useAtomValue(agentChannelIdAtom)
  const modelId = useAtomValue(agentModelIdAtom)

  const [query, setQuery] = React.useState('')
  const [filters, setFilters] = React.useState<CsLabAcademicSearchFilters>({})
  const [papers, setPapers] = React.useState<CsLabAcademicPaperMetadata[]>([])
  const [sourceStats, setSourceStats] = React.useState<CsLabAcademicSourceStat[]>([])
  const [selected, setSelected] = React.useState<CsLabAcademicPaperMetadata | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [status, setStatus] = React.useState<string | null>(null)
  const [ingestMap, setIngestMap] = React.useState<Record<string, IngestEntry>>({})

  const runSearch = React.useCallback(
    async (overrideQuery?: string): Promise<void> => {
      const trimmed = (overrideQuery ?? query).trim()
      if (!trimmed) {
        setStatus('请输入检索关键词或科学问题')
        return
      }
      setLoading(true)
      setStatus(null)
      try {
        const result = await window.electronAPI.cslab.academicSearch({
          query: trimmed,
          topK: 20,
          filters,
          channelId: channelId ?? undefined,
          modelId: modelId ?? undefined,
        })
        setPapers(result.papers)
        setSourceStats(result.sourceStats)
        setSelected(result.papers[0] ?? null)
        setStatus(result.message ?? (result.papers.length === 0 ? '未检索到匹配文献' : null))
      } catch (error) {
        setStatus(error instanceof Error ? error.message : '检索失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    },
    [query, filters, channelId, modelId],
  )

  const runSearchRef = React.useRef(runSearch)
  runSearchRef.current = runSearch

  // 划词反向检索：携带选中文本自动发起一次检索。
  React.useEffect(() => {
    const text = initialQuery?.trim()
    if (!text) return
    setQuery(text)
    void runSearchRef.current(text)
  }, [initialQuery])

  const handleIngest = React.useCallback(
    async (paper: CsLabAcademicPaperMetadata): Promise<void> => {
      const current = ingestMap[paper.id]
      if (current?.state === 'ingesting' || current?.state === 'ingested') return
      setIngestMap((previous) => ({
        ...previous,
        [paper.id]: { state: 'ingesting' },
      }))
      try {
        const result = await window.electronAPI.cslab.academicIngestPaper({ labId, paper })
        setIngestMap((previous) => ({
          ...previous,
          [paper.id]: {
            state: result.ok ? 'ingested' : 'failed',
            message: result.message,
            uri: result.uri,
          },
        }))
        if (result.ok) onIngested?.()
      } catch (error) {
        setIngestMap((previous) => ({
          ...previous,
          [paper.id]: {
            state: 'failed',
            message: error instanceof Error ? error.message : '入库失败',
          },
        }))
      }
    },
    [ingestMap, labId, onIngested],
  )

  const handleCopyCitation = React.useCallback((paper: CsLabAcademicPaperMetadata): void => {
    void navigator.clipboard
      .writeText(formatPaperCitation(paper))
      .then(() => setStatus('引用格式已复制到剪贴板'))
      .catch(() => setStatus('复制失败，请手动选择引用文本'))
  }, [])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const selectedIngest = selected ? ingestMap[selected.id] : undefined

  return (
    <div
      data-tour="cslab-literature-search-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-cslab-text/20 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex h-[88vh] w-[92vw] max-w-6xl flex-col overflow-hidden rounded-2xl border border-cslab-border bg-cslab-bg shadow-subtle"
        onClick={(event) => event.stopPropagation()}
      >
        {/* 页眉：标题 + 检索框 */}
        <div className="flex items-center gap-3 px-6 pb-3 pt-4">
          <div className="min-w-0">
            <h1 className="font-serif text-[15px] font-medium text-cslab-text">学术文献检索</h1>
            <p className="text-[9px] uppercase tracking-[0.18em] text-cslab-muted">
              Cross-Source Federation · OpenAlex / Semantic Scholar / arXiv / Crossref
            </p>
          </div>
          <div className="relative ml-auto flex min-w-0 flex-1 items-center">
            <Search size={13} className="absolute left-2.5 text-cslab-muted" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void runSearch()
              }}
              placeholder="输入科学问题、方法名或关键词，例如：锂电池 热失控 机理模型"
              className="w-full rounded-lg border border-cslab-border bg-cslab-surface py-2 pl-8 pr-24 text-xs text-cslab-text placeholder:text-cslab-muted focus:outline-none focus:ring-1 focus:ring-cslab-accent/40"
            />
            <button
              type="button"
              onClick={() => void runSearch()}
              disabled={loading}
              className="absolute right-1.5 inline-flex items-center gap-1 rounded-lg bg-cslab-accent px-3 py-1.5 text-[11px] text-cslab-bg transition-colors hover:bg-cslab-accentHover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 size={11} className="animate-spin" /> : <Search size={11} />}
              检索
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex shrink-0 items-center justify-center rounded-lg p-1.5 text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
            title="关闭（Esc）"
          >
            <X size={14} />
          </button>
        </div>

        <CsLabLiteratureFilterBar filters={filters} onChange={setFilters} />

        {/* 主体：左结果 / 右预览 */}
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
          <div className="min-h-0 overflow-y-auto border-r border-cslab-border/70 px-4 py-3">
            {loading && papers.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-cslab-muted">
                <Loader2 size={16} className="animate-spin" />
                <p className="text-xs">正在聚合多源学术图谱…</p>
              </div>
            )}
            {!loading && papers.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-8 text-center">
                <p className="text-xs leading-relaxed text-cslab-muted">
                  {status ?? '输入检索词后，这里将呈现跨源去重后的主卡片：出版信息、TL;DR、方法关键词与 OA 直链。'}
                </p>
              </div>
            )}
            <div className="space-y-2.5">
              {papers.map((paper) => (
                <CsLabLiteratureSearchCard
                  key={paper.id}
                  paper={paper}
                  selected={selected?.id === paper.id}
                  onSelect={() => setSelected(paper)}
                  onIngest={() => void handleIngest(paper)}
                  onCopyCitation={() => handleCopyCitation(paper)}
                  ingestState={ingestMap[paper.id]?.state ?? 'idle'}
                />
              ))}
            </div>
          </div>

          <div className="min-h-0 bg-cslab-bg">
            {selected ? (
              <CsLabLiteraturePreviewPane
                paper={selected}
                ingestState={selectedIngest?.state ?? 'idle'}
                ingestMessage={selectedIngest?.message}
                ingestedUri={selectedIngest?.uri}
                onIngest={() => void handleIngest(selected)}
                onCopyCitation={() => handleCopyCitation(selected)}
                canInsertCitation={!!canInsertCitation}
                onInsertCitation={
                  onInsertCitation ? () => onInsertCitation(formatPaperCitation(selected)) : undefined
                }
                onCastToPane={onCastToPane}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-8 text-center">
                <p className="text-xs leading-relaxed text-cslab-muted">
                  点击左侧任一文献卡片，此处将即时展开速览 / PDF / 结构三栏预览。
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 页脚：来源统计（可解释性） */}
        <div className="flex items-center gap-3 border-t border-cslab-border/70 px-6 py-1.5">
          <span className="text-[9px] uppercase tracking-[0.18em] text-cslab-muted">来源统计</span>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-0.5">
            {sourceStats.length === 0 ? (
              <span className="text-[10px] text-cslab-muted">尚未检索</span>
            ) : (
              sourceStats.map((stat) => (
                <span
                  key={stat.source}
                  className={cn('text-[10px]', stat.error ? 'text-cslab-muted line-through' : 'text-cslab-muted')}
                  title={stat.error}
                >
                  {stat.source}：{stat.error ? '不可用' : `${stat.hits} 条 / ${stat.elapsedMs}ms`}
                </span>
              ))
            )}
          </div>
          {status && <span className="shrink-0 text-[10px] text-cslab-accent">{status}</span>}
        </div>
      </div>
    </div>
  )
}
