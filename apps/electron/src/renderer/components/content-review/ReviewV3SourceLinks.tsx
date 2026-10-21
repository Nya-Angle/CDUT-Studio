import * as React from 'react'
import type { CaseAggregateV2, SourceRef } from '@profer/shared'
import { resolveT08Source } from './review-v3-t08-case-report'
import { reviewSourcePurpose, reviewSourceStatusLabel, uniqueReviewSourceRefs } from './review-v3-source-navigation'

interface ReviewV3SourceLinksProps {
  aggregate: CaseAggregateV2
  refs: readonly SourceRef[]
  onNavigate(ref: SourceRef): void
}

/** 展示每一处可核查引用，不再按依据/申报/证明各取第一项。 */
export function ReviewV3SourceLinks({ aggregate, refs, onNavigate }: ReviewV3SourceLinksProps): React.ReactElement | null {
  const sources = uniqueReviewSourceRefs(refs)
  if (sources.length === 0) return null
  return (
    <div className="mt-2 space-y-1.5" aria-label="逐处核查来源">
      <p className="text-xs font-medium text-muted-foreground">引用出处 · {sources.length} 处</p>
      <div className="flex flex-wrap gap-1.5">
        {sources.map((ref, index) => {
          const resolved = resolveT08Source(ref, aggregate)
          const purpose = reviewSourcePurpose(ref, aggregate)
          const kind = purpose === 'rule' ? '依据' : purpose === 'application' ? '申报' : '证明'
          const label = `${kind} ${index + 1} · ${resolved.label}`
          return purpose ? (
            <button
              key={`${ref.documentVersionId}:${ref.parseRevision}:${JSON.stringify(ref.location)}`}
              type="button"
              onClick={() => onNavigate(ref)}
              title={`${resolved.label} · ${reviewSourceStatusLabel(resolved.state)}`}
              className="max-w-full rounded-md border border-primary/25 bg-background px-2 py-1.5 text-left text-xs font-medium text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="block max-w-64 truncate">{label}</span>
              {resolved.state !== 'located' && <span className="block text-[10px] font-normal text-amber-700 dark:text-amber-300">{reviewSourceStatusLabel(resolved.state)}</span>}
            </button>
          ) : (
            <span key={`${ref.documentVersionId}:${ref.parseRevision}:${index}`} title={resolved.label} className="max-w-full rounded-md border border-amber-500/30 bg-amber-500/5 px-2 py-1.5 text-xs text-amber-700 dark:text-amber-300">
              {label} · {reviewSourceStatusLabel(resolved.state)}
            </span>
          )
        })}
      </div>
    </div>
  )
}
