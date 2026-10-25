import { useState } from 'react'
import { reviewBusinessError } from './batch-ui-feedback'
import type { BatchAutomationMode, BatchStateV2 } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@profer/ui/primitives/dialog'

export function BatchAutomationDialog({
  batch, onClose, onSaved,
}: {
  batch: BatchStateV2
  onClose: () => void
  onSaved: () => Promise<void>
}): JSX.Element {
  const [mode, setMode] = useState<BatchAutomationMode>(batch.automation?.mode ?? 'assist')
  const [confirmed, setConfirmed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const apply = async () => {
    setBusy(true)
    setError(null)
    try {
      await window.reviewAPI.batchActionV2({
        action: 'configure-automation', batchId: batch.batch.id,
        mode, confirmed: mode === 'assist' || confirmed,
      })
      await onSaved()
      onClose()
    } catch (cause) {
      setError(reviewBusinessError(cause))
    } finally { setBusy(false) }
  }
  return (
    <Dialog open onOpenChange={(open) => { if (!open && !busy) onClose() }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>批次自动化策略</DialogTitle>
          <DialogDescription>默认辅助模式；每个批次必须单独授权。更改策略会增加授权修订号，之前的自动处理权限随即失效。</DialogDescription>
        </DialogHeader>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">处理级别</span>
          <select value={mode} onChange={(e) => { setMode(e.target.value as BatchAutomationMode); setConfirmed(false) }}
            className="h-9 w-full rounded-md border bg-background px-2" disabled={busy}>
            <option value="assist">辅助模式 · 仅生成建议</option>
            <option value="auto-return">自动补件 · 仅已确认、可补正的规则</option>
            <option value="auto-approve">高自动化 · 符合严格门槛时自动通过及补件</option>
          </select>
        </label>
        <p className="text-xs text-muted-foreground">
          自动通过还要求全局 AI 代批授权开启、模板显式允许自动通过、政策已确认、全部检查完成、无未确认事实/材料/审批阶段。含评分、名额和需要人工判断的案卷不会自动通过。
          本机自动化记录为 system 来源，不代表学校外部审批系统已授权。
        </p>
        {mode !== 'assist' && (
          <label className="flex items-start gap-2 rounded-md border p-3 text-xs">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} disabled={busy} />
            <span>我作为本地审核员明确授权此批次按上述策略自动执行符合条件的单案事务，并了解异常项目会保留给人工审核。</span>
          </label>
        )}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" type="button" disabled={busy} onClick={onClose}>取消</Button>
          <Button type="button" disabled={busy || (mode !== 'assist' && !confirmed)} onClick={() => void apply()}>
            {busy ? '正在保存…' : mode === 'assist' ? '切换为辅助模式' : '确认启用策略'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
