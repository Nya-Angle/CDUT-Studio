/**
 * T09 离线任务包入口（Local-L04 桥接的 UI 层）。
 *
 * 只做三件事，全部经 Main：
 * - 对某个未关闭的补件签发学生应答包（Main 用真实案卷生成并落盘）；
 * - 下载可离线填写的单文件 HTML 表单；
 * - 选择离线回件文件 → Main 预览校验 → 导入（附件先登记原件，再答复补件）。
 *
 * 身份说明：包内 recipient 是**声明**，不是登录身份，也不会因此获得校方权限。
 */
import * as React from 'react'
import { useAtomValue } from 'jotai'
import { toast } from 'sonner'
import { Button } from '@profer/ui/primitives/button'
import type { CaseAggregateV2 } from '@profer/shared'
import { reviewV2AggregateAtom } from './V2CasePanel'
import { buildT09OfflineFormHtml } from './review-v3-t09-offline-form'

type PreviewLike = { status: 'ready' | 'conflict' | 'rejected'; details: string[] }
type JudgeChoice = { batchId: string; assignmentId: string; reviewerId: string; round: number }

function downloadOfflineFile(content: string, name: string, mime: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: mime }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
}

export function ReviewV3T09OfflineSection(): JSX.Element {
  const aggregate = useAtomValue(reviewV2AggregateAtom) as CaseAggregateV2 | null
  const [supplementId, setSupplementId] = React.useState('')
  const [recipientId, setRecipientId] = React.useState('local-student')
  const [judgeBatchId, setJudgeBatchId] = React.useState('')
  const [judgeAssignmentId, setJudgeAssignmentId] = React.useState('')
  const [judgeChoices, setJudgeChoices] = React.useState<JudgeChoice[]>([])
  const [loadingJudgeChoices, setLoadingJudgeChoices] = React.useState(false)
  const lookupGeneration = React.useRef(0)
  const [issued, setIssued] = React.useState<{ packageId: string; json: string } | null>(null)
  const [replyJson, setReplyJson] = React.useState('')
  const [preview, setPreview] = React.useState<PreviewLike | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [message, setMessage] = React.useState('')

  const openSupplements = React.useMemo(
    () => (aggregate?.supplements ?? []).filter((item) => item.status === 'open' || item.status === 'insufficient'),
    [aggregate],
  )

  React.useEffect(() => {
    if (!supplementId && openSupplements[0]) setSupplementId(openSupplements[0].id)
  }, [openSupplements, supplementId])

  const caseId = aggregate?.caseV2.id

  // OFF-16：切案必须清空上一案签发的包、回件文本与预览，避免把前案任务
  // 下载/导入到新案 UI（导入仍会被 Main 的 caseId 校验拒绝，但不应误导交付）。
  React.useEffect(() => {
    lookupGeneration.current += 1
    setJudgeChoices([])
    setJudgeBatchId('')
    setJudgeAssignmentId('')
    setIssued(null)
    setReplyJson('')
    setPreview(null)
    setMessage('')
    setSupplementId('')
  }, [caseId])

  const loadJudgeChoices = React.useCallback(async (): Promise<void> => {
    if (!caseId) return
    const current = ++lookupGeneration.current
    setLoadingJudgeChoices(true); setMessage('')
    try {
      const raw = await window.reviewAPI.listBatchesV2()
      const batches = (raw as Array<{ id?: string; batch?: { id: string; caseIds?: string[] } }>)
        .map((entry) => entry.batch)
        .filter((item): item is { id: string; caseIds?: string[] } =>
          Boolean(item?.id) && (item?.caseIds ?? []).includes(caseId))
      const found = await Promise.all(batches.map(async (item): Promise<JudgeChoice[]> => {
        try {
          const result = await window.reviewAPI.getT07View({ batchId: item.id, claim: { role: 'organizer' } })
          if (result.view.role !== 'organizer') return []
          const round = result.view.state.rounds.at(-1)
          if (!round || round.finalized) return []
          return round.assignments.filter((row) => row.caseId === caseId && row.status === 'assigned')
            .map((row) => ({ batchId: item.id, assignmentId: row.id, reviewerId: row.reviewerId, round: round.number }))
        } catch { return [] } // No published scoring round for this batch.
      }))
      if (lookupGeneration.current !== current) return
      const choices = found.flat()
      setJudgeChoices(choices)
      setJudgeBatchId(choices[0]?.batchId ?? '')
      setJudgeAssignmentId(choices[0]?.assignmentId ?? '')
    } catch (error) {
      if (lookupGeneration.current === current) setMessage(error instanceof Error ? error.message : String(error))
    } finally {
      if (lookupGeneration.current === current) setLoadingJudgeChoices(false)
    }
  }, [caseId])

  const issue = React.useCallback(async (): Promise<void> => {
    if (!caseId || !supplementId) return
    setBusy(true); setMessage('')
    try {
      const result = await window.reviewAPI.issueT09StudentPackage({ caseId, supplementId, recipientId })
      setIssued({ packageId: result.packageId, json: result.json })
      toast.success('已签发离线应答包')
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : String(cause))
    } finally { setBusy(false) }
  }, [caseId, supplementId, recipientId])

  const issueJudge = React.useCallback(async (): Promise<void> => {
    if (!caseId || !judgeBatchId.trim() || !judgeAssignmentId.trim()) return
    setBusy(true); setMessage('')
    try {
      const result = await window.reviewAPI.issueT09JudgePackage({
        caseId, batchId: judgeBatchId.trim(), assignmentId: judgeAssignmentId.trim(),
      })
      setIssued({ packageId: result.packageId, json: result.json })
      toast.success(`已签发第 ${result.round} 轮匿名评委任务包`)
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : String(cause))
    } finally { setBusy(false) }
  }, [caseId, judgeBatchId, judgeAssignmentId])

  const doPreview = React.useCallback(async (): Promise<void> => {
    if (!caseId || !replyJson.trim()) return
    setBusy(true); setMessage(''); setPreview(null)
    try {
      const result = await window.reviewAPI.previewT09Package({ caseId, packageJson: replyJson.trim() })
      setPreview(result.preview as PreviewLike)
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : String(cause))
    } finally { setBusy(false) }
  }, [caseId, replyJson])

  const readReplyFile = React.useCallback(async (file: File | undefined): Promise<void> => {
    if (!file) return
    setMessage(''); setPreview(null)
    try {
      if (!/\.(?:cdutreply|json)$/i.test(file.name)) throw new Error('请选择离线填写页保存的回件文件')
      if (file.size > 80 * 1024 * 1024) throw new Error('回件文件超过 80MB，请检查附件大小')
      const content = await file.text()
      const parsed: unknown = JSON.parse(content)
      if (!parsed || typeof parsed !== 'object' || (parsed as { type?: string }).type !== 'reply') {
        throw new Error('这不是离线回件，请选择填写页保存的回件文件')
      }
      setReplyJson(content)
      setMessage(`已选择回件：${file.name}。请先点“预览校验”，确认无误后导入。`)
    } catch (error) {
      setReplyJson('')
      setMessage(error instanceof Error ? error.message : String(error))
    }
  }, [])

  const doImport = React.useCallback(async (): Promise<void> => {
    if (!caseId || !replyJson.trim()) return
    setBusy(true); setMessage('')
    try {
      const result = await window.reviewAPI.importT09Package({ caseId, packageJson: replyJson.trim() })
      if ('receipt' in result) {
        toast.success(result.status === 'duplicate' ? '该回件此前已导入（幂等）' : '离线回件已导入')
        setMessage(`回执：${result.receipt.status}，actionId ${result.receipt.actionId}`)
        setPreview(null)
      } else {
        setPreview(result.preview as PreviewLike)
        setMessage('回件未通过校验，未写入任何业务状态')
      }
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : String(cause))
    } finally { setBusy(false) }
  }, [caseId, replyJson])

  return (
    <section aria-label="离线任务包" className="space-y-2 rounded-lg border border-border/60 p-3 text-xs">
      <h4 className="font-medium">离线任务包（T09）</h4>
      <p className="text-muted-foreground">签发任务后下载离线填写页，交给学生或评委；收到回件文件后选择文件、预览并导入。</p>

      <div className="flex flex-wrap items-center gap-2">
        <select
          className="h-7 rounded-md border bg-background px-2"
          aria-label="选择补件请求"
          value={supplementId}
          onChange={(event) => setSupplementId(event.target.value)}
        >
          <option value="">选择未关闭的补件…</option>
          {openSupplements.map((item) => (
            <option key={item.id} value={item.id}>{item.id}（{item.status}）</option>
          ))}
        </select>
        <input
          className="h-7 w-36 rounded-md border bg-background px-2"
          aria-label="回件人标识"
          value={recipientId}
          onChange={(event) => setRecipientId(event.target.value)}
          placeholder="回件人标识"
        />
        <Button size="sm" disabled={busy || !caseId || !supplementId} onClick={() => void issue()}>签发离线包</Button>
        {openSupplements.length === 0 && <span className="text-muted-foreground">当前没有未关闭的补件</span>}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t pt-2">
        <Button size="sm" variant="outline" disabled={busy || loadingJudgeChoices || !caseId}
          onClick={() => void loadJudgeChoices()}>{loadingJudgeChoices ? '正在读取评分分配…' : '读取本案评分任务'}</Button>
        <select className="h-7 min-w-44 rounded-md border bg-background px-2"
          aria-label="选择独立评委评分分配"
          value={judgeChoices.some((row) => row.batchId === judgeBatchId && row.assignmentId === judgeAssignmentId)
            ? judgeBatchId + '::' + judgeAssignmentId : ''}
          onChange={(event) => {
            const row = judgeChoices.find((choice) => choice.batchId + '::' + choice.assignmentId === event.target.value)
            setJudgeBatchId(row?.batchId ?? '')
            setJudgeAssignmentId(row?.assignmentId ?? '')
          }}>
          <option value="">选择本案未完成的评分分配…</option>
          {judgeChoices.map((row) => <option key={row.batchId + ':' + row.assignmentId}
            value={row.batchId + '::' + row.assignmentId}>
            {row.batchId} · 第{row.round}轮 · {row.reviewerId}
          </option>)}
        </select>
        <Button size="sm" variant="outline" disabled={busy || !caseId || !judgeBatchId || !judgeAssignmentId}
          onClick={() => void issueJudge()}>签发匿名评委评分包</Button>
      </div>
      {judgeChoices.length === 0 && <p className="text-muted-foreground">请先在评分工作台创建评分轮次和本案评委分配，再点击“读取本案评分任务”。</p>}
      <p className="text-muted-foreground">评分任务从 Main 已持久化的真实批次与当前轮次读取；评委回件导入时由 Main 弹窗确认，所有票据按现有 T07 修订号写入。</p>

      {issued && (
        <div className="space-y-1">
          <p className="text-muted-foreground">包 ID：{issued.packageId}</p>
          <Button size="sm" onClick={() => {
            try {
              downloadOfflineFile(buildT09OfflineFormHtml(issued.json), `cdut-review-task-${issued.packageId}.html`, 'text/html;charset=utf-8')
              toast.success('已请求下载离线填写页')
            } catch (error) { setMessage(error instanceof Error ? error.message : String(error)) }
          }}>下载离线填写页</Button>
          <p className="text-muted-foreground">对方用浏览器打开 HTML 文件填写后，点击“保存回件文件”。填写页无需安装软件、无需联网。</p>
        </div>
      )}

      <div className="space-y-1">
        <label className="block space-y-1 font-medium">导入离线回件文件
          <input type="file" accept=".cdutreply,.json,application/json" className="block w-full text-xs font-normal"
            disabled={busy} onChange={(event) => { void readReplyFile(event.currentTarget.files?.[0]); event.currentTarget.value = '' }}/>
        </label>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={busy || !replyJson.trim()} onClick={() => void doPreview()}>预览校验</Button>
          <Button size="sm" disabled={busy || !replyJson.trim()} onClick={() => void doImport()}>导入回件</Button>
        </div>
      </div>

      {preview && (
        <div className={`rounded-md px-3 py-2 ${preview.status === 'ready' ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>
          <p className="font-medium">校验结果：{preview.status}</p>
          <ul className="mt-1 list-inside list-disc">
            {preview.details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
        </div>
      )}
      {message && <p className="rounded-md bg-muted/50 px-3 py-2">{message}</p>}
    </section>
  )
}
