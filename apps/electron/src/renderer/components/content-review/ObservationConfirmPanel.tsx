/**
 * AI 抽取人工确认面板（阶段 B：correctObservation 命令接 UI）
 *
 * 展示最近完成运行的 extract 产物观察（真实模型抽取，含引用与置信度）；
 * 未确认条目可"确认无误"（原值落 confirmed=true 的 user 记录）或"更正"
 * （填新值+理由，原值进 supersedes 链——A05/U02）。
 */
import { useCallback, useEffect, useState } from 'react'
import type { Actor, ReviewCommandResult } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'
import { toast } from 'sonner'

interface ObservationRow {
  subjectId: string
  fieldKey: string
  value: unknown
  sourceRefs?: Array<{ documentVersionId: string; quote?: string }>
  extractedBy?: string
  confirmed?: boolean
  confidence?: number
}

export function ObservationConfirmPanel({ caseId, aggregate, onResult, refreshNonce }: { caseId: string; aggregate: { caseV2: { revision: number } }; onResult: (result: ReviewCommandResult | undefined) => void; refreshNonce: number }): JSX.Element {
  const [rows, setRows] = useState<ObservationRow[]>([])
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [editReason, setEditReason] = useState('')

  const load = useCallback(async (): Promise<void> => {
    try {
      const list = await window.reviewAPI.getRunObservationsV2(caseId)
      setRows((list ?? []) as unknown as ObservationRow[])
    } catch (error) {
      console.error('[V2] 观察加载失败', error)
    }
  }, [caseId])

  useEffect(() => { void load() }, [load, refreshNonce])

  const localActor: Actor = { actorId: 'local-user', actorSource: 'local', role: 'reviewer' }

  /** 确认无误：原值再落一条 extractedBy=user + confirmed=true（保留确认历史） */
  const confirmRow = useCallback(async (row: ObservationRow): Promise<void> => {
    const result = await window.reviewAPI.correctObservationV2({
      caseId,
      command: {
        requestId: `obs-confirm-${Date.now().toString(36)}`,
        target: { kind: 'case' as const, id: caseId },
        expectedRevision: aggregate.caseV2.revision,
        actor: localActor,
        type: 'CorrectObservation',
        payload: { subjectId: row.subjectId, fieldKey: row.fieldKey, value: row.value, sourceRefs: row.sourceRefs ?? [], reason: '人工核对无误' },
      },
    })
    onResult(result)
    if (result?.ok) toast.success(`已确认：${row.fieldKey}`)
    await load()
  }, [caseId, aggregate, onResult, load])

  /** 更正：新值+理由（理由必填，A05 铁律） */
  const amendRow = useCallback(async (row: ObservationRow): Promise<void> => {
    if (!editReason.trim()) { toast.error('更正必须附理由'); return }
    const result = await window.reviewAPI.correctObservationV2({
      caseId,
      command: {
        requestId: `obs-amend-${Date.now().toString(36)}`,
        target: { kind: 'case' as const, id: caseId },
        expectedRevision: aggregate.caseV2.revision,
        actor: localActor,
        type: 'CorrectObservation',
        payload: { subjectId: row.subjectId, fieldKey: row.fieldKey, value: editValue, sourceRefs: row.sourceRefs ?? [], reason: editReason.trim() },
      },
    })
    onResult(result)
    if (result?.ok) { toast.success(`已更正：${row.fieldKey}`); setEditingKey(null); setEditValue(''); setEditReason('') }
    await load()
  }, [caseId, aggregate, onResult, load, editValue, editReason])

  if (rows.length === 0) {
    return <div className="rounded-lg border-t pt-3 text-sm text-muted-foreground">尚无 AI 抽取条目（完成一次自动审核后此处可人工确认/更正）</div>
  }

  return (
    <div className="space-y-2 rounded-lg border-t pt-3">
      <p className="text-sm font-semibold">AI 抽取条目（{rows.length}）· 人工确认</p>
      {rows.map((row, index) => {
        const key = `${row.subjectId}.${row.fieldKey}`
        const valueText = typeof row.value === 'object' && row.value !== null ? JSON.stringify((row.value as { value?: unknown }).value ?? row.value) : String(row.value)
        return (
          <div key={index} className="rounded bg-muted/40 px-2.5 py-2 text-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="font-medium">{row.fieldKey}</span>
                <span className="mx-1">=</span>
                <span>{valueText}</span>
                {row.sourceRefs?.[0]?.quote && <span className="ml-1 text-muted-foreground">（{row.sourceRefs[0]!.quote}）</span>}
                {row.confidence !== undefined && <span className="ml-1 text-muted-foreground">置信 {Math.round(row.confidence * 100)}%</span>}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {row.confirmed ? (
                  <span className="text-emerald-600">已确认</span>
                ) : (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => void confirmRow(row)}>确认无误</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setEditingKey(editingKey === key ? null : key); setEditValue(valueText); setEditReason('') }}>更正</Button>
                  </>
                )}
              </div>
            </div>
            {editingKey === key && (
              <div className="mt-1.5 flex items-center gap-1">
                <input className="w-40 rounded border px-2 py-1 text-sm" value={editValue} onChange={(event) => setEditValue(event.target.value)} placeholder="更正后的值" />
                <input className="flex-1 rounded border px-2 py-1 text-sm" value={editReason} onChange={(event) => setEditReason(event.target.value)} placeholder="更正理由（必填）" />
                <Button size="sm" onClick={() => void amendRow(row)}>提交更正</Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
