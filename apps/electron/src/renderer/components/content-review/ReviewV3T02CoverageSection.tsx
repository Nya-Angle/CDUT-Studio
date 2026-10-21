/**
 * T02 材料覆盖区容器（Local-L04 桥接）。
 *
 * 只读：从 Main 取当前案卷的暂存来源预览，交给 T02 的展示组件。
 * 预览是 staging-only，不产生 DocumentVersion，也不改变案卷。
 */
import * as React from 'react'
import type { DocumentVersion, ReviewRunV2 } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'
import { ReviewV3T02MaterialCoveragePanel } from './ReviewV3T02MaterialCoveragePanel'

interface StagedInventory {
  total: number
  parsed: number
  partial: number
  failed: number
  imagesAwaitingInspection: number
  sources: Parameters<typeof ReviewV3T02MaterialCoveragePanel>[0]['sources']
}

export function ReviewV3T02CoverageSection({ caseId }: { caseId: string }): JSX.Element {
  const [inventory, setInventory] = React.useState<StagedInventory | null>(null)
  const [documents, setDocuments] = React.useState<DocumentVersion[] | null>(null)
  const [latestRun, setLatestRun] = React.useState<ReviewRunV2 | null>(null)
  const [error, setError] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const readRequest = React.useRef(0)

  const load = React.useCallback(async (): Promise<void> => {
    if (!caseId) return
    const request = ++readRequest.current
    setBusy(true); setError('')
    try {
      // 正式原件和暂存预览分别查询；任何一方失败都不能隐藏另一方。
      const [staging, aggregate, runs] = await Promise.allSettled([
        window.reviewAPI.getT02StagedInventory(caseId),
        window.reviewAPI.getAggregateV2(caseId),
        window.reviewAPI.listRunsV2(caseId),
      ])
      if (request !== readRequest.current) return
      setInventory(staging.status === 'fulfilled' ? staging.value as unknown as StagedInventory : null)
      setDocuments(aggregate.status === 'fulfilled' ? aggregate.value?.caseV2.documents ?? [] : null)
      setLatestRun(runs.status === 'fulfilled' ? runs.value[0] ?? null : null)
      const problems = [
        staging.status === 'rejected' ? '暂存预览读取失败' : '',
        aggregate.status === 'rejected' ? '正式原件账本读取失败' : '',
        runs.status === 'rejected' ? '审核运行覆盖记录读取失败' : '',
      ].filter(Boolean)
      setError(problems.join('；'))
    } finally {
      if (request === readRequest.current) setBusy(false)
    }
  }, [caseId])

  React.useEffect(() => {
    setInventory(null); setDocuments(null); setLatestRun(null)
    void load()
    return () => { readRequest.current++ }
  }, [load])

  const currentDocuments = documents?.filter(document => document.active !== false) ?? []
  const runCoverage = new Map((latestRun?.coverage.documents ?? []).map(item => [item.documentVersionId, item]))
  const runVersions = new Set(latestRun?.inputManifest.documentVersions.map(item => item.versionId) ?? [])
  const parseStatusLabel: Record<DocumentVersion['parseStatus'], string> = {
    pending: '尚未解析', parsed: '解析完成', partial: '部分可读，需检查遗漏', failed: '解析失败，需人工核验',
  }

  return (
    <section aria-label="材料来源与解析覆盖" className="space-y-2">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" disabled={busy || !caseId} onClick={() => void load()}>
          {busy ? '正在核对材料…' : '刷新材料覆盖'}
        </Button>
        <span className="text-xs text-muted-foreground">正式原件、解析状态、运行读取记录分别列出</span>
      </div>
      {error && (
        <p className="rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {error}
        </p>
      )}
      {documents && (
        <div className="space-y-2 rounded-lg border border-border/60 p-3 text-xs" aria-label="正式案卷原件覆盖账本">
          <strong>正式案卷原件：当前 {currentDocuments.length} 份，历史版本 {(documents.length - currentDocuments.length)} 份</strong>
          {currentDocuments.length === 0 && <p className="text-amber-700">本案尚未登记正式原件，不能把暂存预览当作已审核材料。</p>}
          {currentDocuments.map(document => {
            const covered = runVersions.has(document.versionId) ? runCoverage.get(document.versionId) : undefined
            const needsAttention = document.parseStatus !== 'parsed' ||
              (!document.manualReadReceipt && document.usage !== 'read' && covered?.status !== 'read')
            return <div key={document.versionId} className="space-y-1 rounded bg-muted/30 px-2 py-2">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="min-w-0 break-all font-medium">{document.fileName}</span>
                <span className={needsAttention ? 'text-amber-700' : 'text-emerald-700'}>
                  {parseStatusLabel[document.parseStatus]}
                </span>
              </div>
              <p className="text-muted-foreground">{document.role} · 版本 {document.versionId} · 来源块 {document.blocks.length} · 审核读取：{document.manualReadReceipt ? '已由人工核验' : covered?.status ?? document.usage}</p>
              {document.parseError && <p className="text-amber-700">解析范围说明：{document.parseError}</p>}
              {needsAttention && <p className="text-amber-700">请核对原件和遗漏部分；尚不能依据这份材料宣称完整审核。</p>}
            </div>
          })}
          {latestRun && <p className="text-muted-foreground">运行覆盖账本：{latestRun.id}（历史运行仍保留，修改原件后请重新审核）</p>}
        </div>
      )}
      {inventory && inventory.sources.length > 0 && (
        <div className="space-y-1"><p className="text-xs text-muted-foreground">下方为尚未正式登记的暂存来源预览，不计入当前正式审核结果。</p><ReviewV3T02MaterialCoveragePanel sources={inventory.sources} /></div>
      )}
      {inventory && inventory.sources.length === 0 && !documents && (
        <p className="text-xs text-muted-foreground">当前案卷还没有可预览的来源。</p>
      )}
    </section>
  )
}
