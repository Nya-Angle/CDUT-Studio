/**
 * F12 补件工作区：跨请求清单、申请方回件、审核员核验和再审核提示。
 * 仅调用既有 V2 补件命令；任何真正的状态写入仍由 Main / CAS 负责。
 */
import { useMemo, useState } from 'react'
import type { CaseAggregateV2, ReviewCommandResult, SupplementRequest } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'
import { buildF12SupplementCycle, getF12ReplyDocumentCandidates } from './review-v3-f12-supplement-cycle'

interface Props {
  aggregate: CaseAggregateV2
  onResult: (result: ReviewCommandResult | undefined) => void
}

type Outcome = 'satisfied' | 'insufficient' | 'cancelled'
const submitter = { actorId: 'local-student', actorSource: 'local' as const, role: 'student' as const }
const reviewer = { actorId: 'local-user', actorSource: 'local' as const, role: 'reviewer' as const }
const statusName: Record<SupplementRequest['status'], string> = {
  open: '等待提交方', responded: '等待审核员核验', insufficient: '核验不足，待再次回复',
  satisfied: '已核验满足', cancelled: '已说明取消',
}
const commandId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

function SupplementReplyCard({ aggregate, request, onResult }: Props & { request: SupplementRequest }): JSX.Element {
  const [note, setNote] = useState('')
  const [chosenDocuments, setChosenDocuments] = useState<string[]>([])
  const [resolutionReason, setResolutionReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const caseId = aggregate.caseV2.id
  const { documents, verifiedAsAddedAfterRequest } = getF12ReplyDocumentCandidates(request, aggregate.caseV2.documents)
  const canRespond = ['open', 'responded', 'insufficient'].includes(request.status)
  const canVerify = request.status === 'responded'
  const canCancel = request.status === 'open' || request.status === 'responded'

  const submit = async (operation: () => Promise<ReviewCommandResult | undefined>): Promise<void> => {
    setBusy(true)
    setError('')
    try {
      const result = await operation()
      if (!result) {
        setError('补件服务未返回保存回执，请刷新案卷核查状态')
        return
      }
      if (!result.ok) {
        setError(`${result.code}：${result.message}`)
      } else {
        setNote('')
        setChosenDocuments([])
        setResolutionReason('')
      }
      onResult(result)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setBusy(false)
    }
  }

  const resolve = (outcome: Outcome): void => {
    void submit(() => window.reviewAPI.resolveSupplementV2({
      caseId,
      command: {
        requestId: commandId('f12-verify'),
        target: { kind: 'case', id: caseId },
        expectedRevision: aggregate.caseV2.revision,
        actor: reviewer,
        type: 'ResolveSupplement',
        payload: { supplementId: request.id, outcome, reason: resolutionReason.trim() },
      },
    }))
  }

  return (
    <article className="space-y-2 rounded-md border bg-background p-3" aria-label={`补件请求 ${request.id}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">{statusName[request.status]}</p>
        <code className="text-muted-foreground">{request.id}</code>
      </div>
      <p>补件原因：{request.reason}</p>
      <ul className="list-disc pl-5">
        {request.requiredElements.map((item, index) => <li key={`${request.id}-${index}`}>{item}</li>)}
      </ul>
      {request.deadline && <p className="text-muted-foreground">要求期限：{request.deadline}</p>}
      {request.originFindingKeys.length > 0 && <p className="text-muted-foreground">关联检查：{request.originFindingKeys.join('、')}</p>}
      {request.responses.length > 0 && (
        <div className="space-y-1 rounded bg-muted/40 p-2">
          <p className="font-medium">回件历史（{request.responses.length} 次，保留全部版本）</p>
          {request.responses.map((response) => (
            <div key={response.id} className="border-t border-border/50 pt-1 first:border-t-0">
              <p>{new Date(response.at).toLocaleString()} · {response.actor}：{response.note || '附材料'}</p>
              <p className="text-muted-foreground">材料版本：{response.documentVersionIds.length
                ? response.documentVersionIds.map((id) => aggregate.caseV2.documents.find((doc) => doc.versionId === id)?.fileName ?? id).join('、')
                : '未关联材料'}</p>
            </div>
          ))}
        </div>
      )}

      {canRespond && (
        <div className="space-y-2 border-t pt-2">
          <p className="font-medium">提交方回复此请求</p>
          <textarea className="w-full rounded border bg-background p-2" rows={2}
            placeholder="说明补充了什么，或解释无法提供材料的原因" value={note}
            onChange={(event) => setNote(event.target.value)} />
          <div className="flex flex-wrap gap-2">
            {documents.map((document) => (
              <label key={document.versionId} className="inline-flex items-center gap-1">
                <input type="checkbox" disabled={busy} checked={chosenDocuments.includes(document.versionId)}
                  onChange={(event) => setChosenDocuments((previous) => event.target.checked
                    ? [...previous, document.versionId] : previous.filter((id) => id !== document.versionId))} />
                {document.fileName}
              </label>
            ))}
          </div>
          {!verifiedAsAddedAfterRequest && <p className="text-amber-700 dark:text-amber-300">
            该历史补件没有申请时的材料版本快照。这里列出当前有效材料，不能确认哪些属于新补交原件；请人工核对后再关联。
          </p>}
          {documents.length === 0 && <p className="text-muted-foreground">暂无可选的新版本。请先在上方材料区登记新原件，或提交解释说明。</p>}
          <Button size="sm" variant="outline" disabled={busy || (!note.trim() && chosenDocuments.length === 0)}
            onClick={() => void submit(() => window.reviewAPI.respondSupplementV2({
              caseId,
              command: {
                requestId: commandId('f12-respond'),
                target: { kind: 'case', id: caseId },
                expectedRevision: aggregate.caseV2.revision,
                actor: submitter,
                type: 'RespondSupplement',
                payload: { supplementId: request.id, note: note.trim(), documentVersionIds: chosenDocuments },
              },
            }))}>提交此请求的回复</Button>
          <p className="text-muted-foreground">提交回复不等于通过核验；一份材料可按需关联多条请求，但每条请求必须单独留下回执。</p>
        </div>
      )}
      {(canVerify || canCancel) && (
        <div className="space-y-2 border-t pt-2">
          <p className="font-medium">审核员核验</p>
          <textarea className="w-full rounded border bg-background p-2" rows={2}
            placeholder="记录接受、补正不足或取消请求的具体理由" value={resolutionReason}
            onChange={(event) => setResolutionReason(event.target.value)} />
          <div className="flex flex-wrap gap-2">
            {canVerify && <>
              <Button size="sm" variant="outline" disabled={busy || !resolutionReason.trim()} onClick={() => resolve('satisfied')}>核验满足</Button>
              <Button size="sm" variant="outline" disabled={busy || !resolutionReason.trim()} onClick={() => resolve('insufficient')}>仍然不足</Button>
            </>}
            {canCancel && <Button size="sm" variant="outline" disabled={busy || !resolutionReason.trim()} onClick={() => resolve('cancelled')}>说明理由并取消</Button>}
          </div>
        </div>
      )}
      {error && <p role="alert" className="text-destructive">{error}</p>}
    </article>
  )
}

export function ReviewV3F12SupplementCycle({ aggregate, onResult }: Props): JSX.Element {
  const cycle = useMemo(() => buildF12SupplementCycle(aggregate), [aggregate])
  return (
    <section className="space-y-3" aria-label="补件周期">
      <h4 className="font-medium">合并补件清单 · {cycle.unresolved.length} 条未结请求</h4>
      {cycle.requests.length === 0 ? <p className="text-muted-foreground">目前没有补件请求。</p> : <>
        <div className="rounded-md bg-muted/40 p-3">
          <p>等待提交方 {cycle.awaitingReply.length} 条 · 待人工核验 {cycle.awaitingVerification.length} 条 · 要素合计 {cycle.checklist.length} 项</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {cycle.checklist.map((item) => (
              <li key={item.title}>
                <span className={item.unresolvedRequestIds.length === 0 ? 'text-muted-foreground line-through' : ''}>{item.title}</span>
                <span className="ml-2 text-muted-foreground">{item.unresolvedRequestIds.length
                  ? `未结 ${item.unresolvedRequestIds.length}/${item.requestIds.length} 条来源请求`
                  : '全部核结'}</span>
              </li>
            ))}
          </ul>
          {cycle.readyForReview && <p className="mt-2 font-medium text-emerald-700 dark:text-emerald-300">
            全部补件请求已核结。请使用下方“开始审核”或“按模板规则检查”基于当前材料重新执行，确认新 Run 后再办理人工阶段；补件核结本身不是审核通过。
          </p>}
          {cycle.stageStillAwaitingSupplement && <p className="mt-2 text-amber-700 dark:text-amber-300">
            所有补件请求已结束，但案卷业务阶段仍是“等待补件”。请刷新案卷并核查 Main 的阶段回流；这里不会擅自解锁审批或声称可以继续审核。
          </p>}
          {cycle.unresolved.length > 0 && <p className="mt-2 text-muted-foreground">必须完成全部未结请求的回复与人工核验，才能恢复后续审核。</p>}
        </div>
        {cycle.requests.map((request) => <SupplementReplyCard key={`${aggregate.caseV2.id}:${request.id}`} aggregate={aggregate} request={request} onResult={onResult} />)}
      </>}
    </section>
  )
}
