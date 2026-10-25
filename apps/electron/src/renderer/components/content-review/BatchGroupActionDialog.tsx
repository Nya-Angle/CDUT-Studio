/** Local-human group action dialog: preview -> explicit confirmation -> per-case result. */
import { useEffect, useMemo, useState } from 'react'
import type { BatchGroupAction, BatchGroupApplyResult, BatchGroupPreview, BatchIssueGroup } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@profer/ui/primitives/dialog'

const ACTION_LABELS: Record<BatchGroupAction, string> = {
  'confirm-issue': '确认问题属实',
  'false-positive': '认定为误报',
  'human-confirmed-compliant': '人工确认符合',
  escalate: '升级人工处理',
  'request-supplement': '发起补件请求',
  'final-return': '正式退回补件',
  'final-pass': '人工正式通过（严格审批门槛）',
}

export function BatchGroupActionDialog({
  group, batchId, onClose, onApplied, titleOf,
}: {
  group: BatchIssueGroup
  batchId: string
  onClose: () => void
  onApplied: () => Promise<void>
  titleOf: (caseId: string) => string
}): JSX.Element {
  const [action, setAction] = useState<BatchGroupAction>('confirm-issue')
  const [reason, setReason] = useState('')
  const [required, setRequired] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>(() => [...group.caseIds])
  const [preview, setPreview] = useState<BatchGroupPreview | null>(null)
  const [result, setResult] = useState<BatchGroupApplyResult | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const needsElements = action === 'request-supplement' || action === 'final-return'
  const requiredElements = useMemo(() => required.split(/\r?\n/u).map((x) => x.trim()).filter(Boolean), [required])

  useEffect(() => { setPreview(null); setConfirmed(false); setError(null) }, [action, reason, required, selectedIds])

  const payload = () => ({
    batchId, groupKey: group.key, caseIds: selectedIds, action,
    reason: reason.trim(), ...(needsElements ? { requiredElements } : {}),
  })
  const previewNow = async (): Promise<void> => {
    setBusy(true)
    setError(null)
    try {
      const value = await window.reviewAPI.previewBatchGroupV2(payload())
      setPreview(value)
      setConfirmed(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally { setBusy(false) }
  }
  const apply = async (): Promise<void> => {
    if (!preview || !confirmed || busy || !preview.eligibleCount) return
    setBusy(true)
    setError(null)
    try {
      const applied = await window.reviewAPI.applyBatchGroupV2({
        ...payload(), previewHash: preview.previewHash,
        operationId: `grp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`,
        confirmed: true,
      })
      setResult(applied)
      await onApplied()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally { setBusy(false) }
  }
  return (
    <Dialog open onOpenChange={(open) => { if (!open && !busy) onClose() }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>同类问题集中处置</DialogTitle>
          <DialogDescription>{group.reason} · {group.caseIds.length} 个关联案卷。仅本地审核员明确确认后执行，不能代替校方授权。</DialogDescription>
        </DialogHeader>
        {result ? (
          <div className="space-y-3 text-sm">
            <p className="font-medium">实际操作结果：成功 {result.applied}，排除 {result.excluded}，版本冲突 {result.conflicts}，失败 {result.failed}</p>
            <div className="max-h-60 space-y-1 overflow-y-auto rounded-md border p-2">
              {result.results.map((row) => (
                <p key={row.caseId} className="text-xs"><span className="font-medium">{titleOf(row.caseId)} · {row.status}</span> — {row.message}</p>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">结果逐案写入 V2 审计日志。冲突/失败未冒充成功；请刷新材料与运行后另行处理。</p>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <label className="block space-y-1">
              <span className="font-medium">处理动作</span>
              <select className="h-9 w-full rounded-md border bg-background px-2" value={action} onChange={(e) => setAction(e.target.value as BatchGroupAction)} disabled={busy}>
                {(Object.keys(ACTION_LABELS) as BatchGroupAction[]).map((key) => <option key={key} value={key}>{ACTION_LABELS[key]}</option>)}
              </select>
            </label>
            <label className="block space-y-1">
              <span className="font-medium">人工核实理由（必填）</span>
              <textarea rows={2} className="w-full resize-y rounded-md border bg-background p-2" value={reason} disabled={busy}
                onChange={(e) => setReason(e.target.value)} placeholder="说明已经核对的材料与适用政策，不要只写‘同意’" />
            </label>
            {needsElements && (
              <label className="block space-y-1">
                <span className="font-medium">要求补交的要素（每行一项）</span>
                <textarea rows={2} className="w-full resize-y rounded-md border bg-background p-2" value={required} disabled={busy}
                  onChange={(e) => setRequired(e.target.value)} placeholder="例如：包含获奖等级的证明" />
              </label>
            )}
            <div className="rounded-md border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">选择处理范围</span>
                <span className="text-xs text-muted-foreground">已选 {selectedIds.length}/{group.caseIds.length} 案</span>
              </div>
              <div className="max-h-32 space-y-2 overflow-y-auto">
                {group.caseIds.map((caseId) => (
                  <label key={caseId} className="flex items-center gap-2 text-xs">
                    <input type="checkbox" disabled={busy} checked={selectedIds.includes(caseId)}
                      onChange={(e) => setSelectedIds((ids) => e.target.checked ? [...ids, caseId] : ids.filter((id) => id !== caseId))} />
                    <span>{titleOf(caseId)}</span>
                  </label>
                ))}
              </div>
            </div>
            {preview && (
              <div className="space-y-2 rounded-md border bg-muted/40 p-3">
                <p className="font-medium">提交前校验：可处理 {preview.eligibleCount}/{preview.rows.length} 案</p>
                <div className="max-h-36 space-y-1 overflow-y-auto">
                  {preview.rows.map((row) => (
                    <p key={row.caseId} className="text-xs">
                      <span className={row.eligible ? 'text-foreground' : 'text-amber-700'}>{row.eligible ? '可处理' : '排除'}</span>
                      {' · '}{titleOf(row.caseId)} — {row.reason}
                    </p>
                  ))}
                </div>
                {preview.eligibleCount > 0 && (
                  <label className="flex items-start gap-2 text-xs">
                    <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} disabled={busy} />
                    <span>我已核实证据、权限和案卷处理范围，确认对上述可处理案卷逐案执行“{ACTION_LABELS[action]}”。</span>
                  </label>
                )}
              </div>
            )}
          </div>
        )}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={busy}>{result ? '关闭' : '取消'}</Button>
          {!result && (
            <>
              <Button type="button" variant="outline" disabled={busy || !selectedIds.length || !reason.trim() || (needsElements && !requiredElements.length)}
                onClick={() => void previewNow()}>{busy ? '处理中…' : '预览逐案校验'}</Button>
              <Button type="button" disabled={busy || !confirmed || !preview?.eligibleCount} onClick={() => void apply()}>
                确认并逐案执行
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
