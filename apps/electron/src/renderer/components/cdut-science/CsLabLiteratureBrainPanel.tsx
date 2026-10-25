/**
 * CsLabLiteratureBrainPanel — 跨文献分层 GraphRAG 检索
 *
 * 复用 Leiden 分层社区；结果点击后跳转到对应 PDF 页码。
 */

import * as React from 'react'
import { Loader2, Network, Search } from 'lucide-react'
import type { CsLabLiteratureSearchResult } from '@profer/shared'

interface CsLabLiteratureBrainPanelProps {
  labId: string
  onOpenLiterature: (uri: string, page: number) => void
  initialQuery?: string
}

const TEXT_LAYER_HINT = '文献缺少文本层（扫描版 PDF），请导入带 OCR/文本层的 PDF 后再建索引。'

/** 判断后端消息是否属于「扫描版 PDF 无文本层」而非真实异常。 */
function isTextLayerMessage(message?: string): boolean {
  return !!message && (message.includes('扫描版') || message.includes('未能从文献中提取文本'))
}

export function CsLabLiteratureBrainPanel({
  labId,
  onOpenLiterature,
  initialQuery,
}: CsLabLiteratureBrainPanelProps): React.ReactElement {
  const [query, setQuery] = React.useState(initialQuery ?? '')
  const [result, setResult] = React.useState<CsLabLiteratureSearchResult | null>(null)
  const [indexInfo, setIndexInfo] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState<'build' | 'search' | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [hint, setHint] = React.useState<string | null>(null)

  const build = async (force: boolean): Promise<void> => {
    setBusy('build')
    setError(null)
    setHint(null)
    try {
      const payload = await window.electronAPI.cslab.buildLiteratureIndex({ labId, force })
      setIndexInfo(payload.message ?? null)
      if (!payload.ok) {
        if (isTextLayerMessage(payload.message)) setHint(TEXT_LAYER_HINT)
        else setError(payload.message ?? '索引构建失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '索引构建失败')
    } finally {
      setBusy(null)
    }
  }

  const search = React.useCallback(
    async (customQuery?: string): Promise<void> => {
      const q = (customQuery ?? query).trim()
      if (!q) return
      setBusy('search')
      setError(null)
      setHint(null)
      try {
        const payload = await window.electronAPI.cslab.searchLiterature({
          labId,
          query: q,
          topK: 8,
        })
        setResult(payload)
        if (!payload.ok) {
          if (isTextLayerMessage(payload.message)) setHint(TEXT_LAYER_HINT)
          else setError(payload.message ?? '检索失败')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '检索失败')
      } finally {
        setBusy(null)
      }
    },
    [labId, query],
  )

  React.useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setQuery(initialQuery)
      void search(initialQuery)
    }
  }, [initialQuery, search])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl border border-cslab-border bg-cslab-elevated px-2.5 py-1.5">
        <Search size={12} className="shrink-0 text-cslab-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void search()
          }}
          placeholder="跨文献检索，例如：界面阻抗"
          className="w-full bg-transparent text-[11px] text-cslab-text outline-none placeholder:text-cslab-muted/60"
        />
        <button
          type="button"
          disabled={busy !== null || !query.trim()}
          onClick={() => void search()}
          className="shrink-0 rounded-md bg-cslab-accent px-2 py-1 text-[10px] text-white transition-colors hover:bg-cslab-accentHover disabled:opacity-50"
        >
          {busy === 'search' ? <Loader2 size={10} className="animate-spin" /> : '检索'}
        </button>
      </div>

      {busy === 'search' && (
        <p className="text-[10px] leading-relaxed text-cslab-muted">
          检索中（首次需构建索引，请稍候）
        </p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void build(false)}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-cslab-border px-2 py-1.5 text-[10px] text-cslab-text transition-colors hover:bg-cslab-surface disabled:opacity-50"
        >
          {busy === 'build' ? <Loader2 size={10} className="animate-spin" /> : <Network size={10} />}
          建立索引
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void build(true)}
          className="rounded-lg border border-dashed border-cslab-border px-2 py-1.5 text-[10px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text disabled:opacity-50"
        >
          重建
        </button>
      </div>

      {indexInfo && (
        <p className="rounded-lg border border-cslab-border bg-cslab-surface px-3 py-2 text-[10px] leading-relaxed text-cslab-text">
          {indexInfo}
        </p>
      )}

      {result?.ok && result.hits.length === 0 && (
        <p className="text-[11px] text-cslab-muted">没有匹配的文献切块。</p>
      )}

      {result?.hits.map((hit) => (
        <button
          key={hit.chunkId}
          type="button"
          onClick={() => onOpenLiterature(hit.literatureUri, hit.page)}
          className="block w-full rounded-xl border border-cslab-border bg-cslab-bg p-3 text-left transition-colors hover:bg-cslab-surface"
        >
          <div className="flex items-baseline justify-between gap-2">
            <p className="min-w-0 flex-1 truncate font-serif text-[12px] text-cslab-text">
              {hit.title}
            </p>
            <span className="shrink-0 text-[9px] tabular-nums text-cslab-muted">p{hit.page}</span>
          </div>
          <p className="mt-1 line-clamp-4 text-[10px] leading-relaxed text-cslab-muted">
            {hit.excerpt}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-[9px] text-cslab-muted/80">
            <span className="rounded-full bg-cslab-surface px-1.5 py-0.5">{hit.communityTitle}</span>
            <span className="tabular-nums">score {hit.score.toFixed(2)}</span>
          </div>
        </button>
      ))}

      {hint && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] leading-relaxed text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
          {hint}
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[10px] leading-relaxed text-red-600">
          {error}
        </p>
      )}

      <p className="text-[10px] leading-relaxed text-cslab-muted">
        索引基于 PDF 真实字符流切块，再用 Leiden 分层社区聚类；扫描版 PDF 若无文本层会如实返回空结果。
      </p>
    </div>
  )
}
