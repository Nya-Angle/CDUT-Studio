/**
 * T02 owned read-only materials coverage UI. Caller supplies data from an
 * authenticated Main read, never Renderer paths or self-invented source IDs.
 * T10/L decides placement in the unified case workbench.
 */
import * as React from 'react'
import type {
  T02StagedSourcePreview, T02SourceBlockPreview,
} from '../../../main/lib/review/review-v3-t02-staged-source-preview'

const STATUS: Record<T02StagedSourcePreview['parseStatus'], string> = {
  parsed: '文本结构已解析',
  partial: '部分可读 · 待核验',
  failed: '解析失败 · 请查看原件',
}
function locationOf(block: T02SourceBlockPreview): string {
  if (block.table) return `${block.table.sheet ?? '工作表'} · 第 ${block.table.row} 行第 ${block.table.column} 列`
  return `来源块 ${block.sourceBlockKey.split(':').at(-1)} · 解析页 ${block.page}`
}
function SourceRow({ source }: { source: T02StagedSourcePreview }): React.ReactElement {
  const [visible, setVisible] = React.useState(30)
  return (
    <details className="rounded-lg border border-border/70 bg-card">
      <summary className="cursor-pointer px-3 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="min-w-0 break-all text-sm font-medium">{source.fileName}</span>
          <span className="text-xs text-muted-foreground">{STATUS[source.parseStatus]}</span>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{source.blockCount} 个来源块</span>
          <span>{source.sheets.length} 个已索引工作表</span>
          <span>{source.imageBlocksAwaitingInspection} 个图像待核验</span>
          <span>版本：{source.documentVersionId}</span>
        </div>
      </summary>
      <div className="border-t border-border/70 px-3 py-2">
        {source.parseError && (
          <p className="mb-2 text-xs text-muted-foreground" role="status">
            范围说明：{source.parseError}
          </p>
        )}
        <p className="mb-2 text-xs text-muted-foreground">
          原件 SHA-256：<code className="break-all">{source.rawSha256}</code>
          {' · '}此处为暂存预览，不代表已经形成正式审核来源或完成视觉核验。
        </p>
        {source.blocks.length === 0 ? (
          <p className="text-sm text-muted-foreground">无可自动读取的文本块；原件仍登记在清单中。</p>
        ) : (
          <ol className="space-y-1">
            {source.blocks.slice(0, visible).map((block) => (
              <li key={block.sourceBlockKey} className="rounded bg-muted/30 px-2 py-1.5">
                <div className="text-xs text-muted-foreground">
                  {locationOf(block)}
                  {block.requiresVisualInspection ? ' · 图片尚需视觉核验' : ''}
                </div>
                {block.text && <p className="mt-0.5 whitespace-pre-wrap break-words text-xs">{block.text}</p>}
              </li>
            ))}
          </ol>
        )}
        {visible < source.blocks.length && (
          <button
            type="button"
            className="mt-2 rounded border border-border px-2 py-1 text-xs hover:bg-muted"
            onClick={() => setVisible((count) => count + 50)}
          >
            再显示 {Math.min(50, source.blocks.length - visible)} 块（剩余 {source.blocks.length - visible}）
          </button>
        )}
      </div>
    </details>
  )
}

/** Every candidate is listed separately even when the display name repeats. */
export function ReviewV3T02MaterialCoveragePanel({
  sources,
}: { sources: readonly T02StagedSourcePreview[] }): React.ReactElement {
  const parsed = sources.filter((s) => s.parseStatus === 'parsed').length
  const partial = sources.filter((s) => s.parseStatus === 'partial').length
  const failed = sources.filter((s) => s.parseStatus === 'failed').length
  const imagePending = sources.reduce((sum, s) => sum + s.imageBlocksAwaitingInspection, 0)
  return (
    <section aria-label="材料来源与解析覆盖" className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <strong>材料来源 {sources.length} 份</strong>
        <span>结构已解析 {parsed}</span>
        <span>部分可读 {partial}</span>
        <span>解析失败 {failed}</span>
        <span>图片待核验 {imagePending}</span>
      </div>
      {sources.length === 0 ? (
        <p className="text-sm text-muted-foreground">暂无已登记的暂存原件。</p>
      ) : (
        <div className="space-y-2">
          {sources.map((source) => <SourceRow key={source.candidateId} source={source} />)}
        </div>
      )}
    </section>
  )
}
