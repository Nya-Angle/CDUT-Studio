import { useEffect, useMemo, useState } from 'react'
import { Button } from '@profer/ui/primitives/button'
import type { T07Action, T07JudgeView, T07OrganizerView, T07Score, T07View } from '../../../main/lib/review/review-v3-t07-rating-workflow'

type Props = {
  /** Trusted Main must project the current actor's data before supplying this view. */
  view: T07View
  /** L/Main attaches actual actor, revision and idempotency key; caller refreshes view after commit. */
  onAction: (action: T07Action) => Promise<void>
  /** Accepts only opaque document references already authorized for this judge. */
  onOpenDocument?: (documentId: string) => void
}

function textOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
function scoreLabel(value: number | null): string {
  return value === null ? '待定' : value.toFixed(2)
}

export function ReviewV3T07JudgePanel({ view, onAction, onOpenDocument }: Props): JSX.Element {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const send = async (action: T07Action): Promise<void> => {
    setBusy(true); setError(''); setMessage('')
    try { await onAction(action); setMessage('已提交，评分及定稿状态以重新读取的案卷为准。') }
    catch (cause) { setError(textOf(cause)) }
    finally { setBusy(false) }
  }
  return (
    <section aria-label="独立评委评分" className="space-y-4 rounded-lg border bg-background p-4 text-sm">
      <header>
        <h2 className="text-base font-semibold">独立评委与评分</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {view.role === 'judge'
            ? '盲评视图只展示本人任务和已获授权的匿名资料；其他评委的分数、身份及名次在此不可见。'
            : '组织者可分配、处理回避与缺评、复核分歧并冻结本轮排名；正式写入由 Main 审核执行。'}
        </p>
      </header>
      {view.role === 'judge'
        ? <T07JudgeTasks view={view} busy={busy} onSubmit={send} onOpenDocument={onOpenDocument} />
        : <T07OrganizerDesk view={view} busy={busy} onSubmit={send} />}
      {error && <p role="alert" className="rounded-md border border-destructive/40 p-2 text-destructive">{error}</p>}
      {message && <p role="status" className="text-xs text-muted-foreground">{message}</p>}
    </section>
  )
}

function T07JudgeTasks({ view, busy, onSubmit, onOpenDocument }: {
  view: T07JudgeView; busy: boolean; onSubmit: (action: T07Action) => Promise<void>
  onOpenDocument?: (id: string) => void
}): JSX.Element {
  const [selected, setSelected] = useState<string>('')
  const active = view.tasks.find((task) => task.assignmentId === selected) ?? view.tasks[0]
  const [draft, setDraft] = useState<Record<string, { raw: string; na: boolean; comment: string }>>({})
  const [publicFeedback, setPublicFeedback] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [recuseReason, setRecuseReason] = useState('')
  useEffect(() => {
    setDraft({}); setPublicFeedback(''); setInternalNotes(''); setRecuseReason('')
  }, [active?.assignmentId, view.round])
  const dimensionRows = view.rubric.dimensions
  const isEditable = active?.status === 'assigned' && !view.finalized
  const canSubmit = Boolean(active && isEditable && dimensionRows.every((dimension) => {
    const entry = draft[dimension.id]
    if (!entry) return false
    if (entry.na) return (active?.naEligibleDimensionIds ?? []).includes(dimension.id)
    if (entry.raw.trim() === '') return false
    const number = Number(entry.raw)
    return Number.isFinite(number) && number >= dimension.min && number <= dimension.max
  }))
  const submit = (): Promise<void> => {
    if (!active || !canSubmit) return Promise.resolve()
    const scores: T07Score[] = dimensionRows.map((dimension) => {
      const entry = draft[dimension.id]!
      return { dimensionId: dimension.id, score: entry.na ? null : Number(entry.raw), na: entry.na, comment: entry.comment.trim() }
    })
    return onSubmit({ type: 'submit', assignmentId: active.assignmentId, scores, publicFeedback, internalNotes })
  }
  if (!view.tasks.length) return <p className="rounded-md bg-muted/40 p-3 text-muted-foreground">当前没有分配给你的评分任务。</p>
  return (
    <div className="space-y-4">
      <nav aria-label="本人评分任务" className="flex flex-wrap gap-2">
        {view.tasks.map((task) => (
          <Button key={task.assignmentId} type="button" size="sm" variant={task.assignmentId === active?.assignmentId ? 'default' : 'outline'}
            onClick={() => setSelected(task.assignmentId)}>{task.blindLabel} · {task.status === 'submitted' ? '已交' : task.status === 'recused' ? '回避' : task.status === 'missing' ? '缺评' : '待评'}</Button>
        ))}
      </nav>
      {active && (
        <>
          <div className="space-y-2 rounded-md border p-3">
            <p className="font-medium">{active.blindLabel} <span className="font-normal text-muted-foreground">第 {view.round} 轮</span></p>
            <p className="whitespace-pre-wrap text-sm">{active.summary || '暂无可公开的项目摘要'}</p>
            {active.documents.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">匿名材料（仅已获授权部分）</p>
                {active.documents.map((document) => (
                  <button key={document.id} type="button" disabled={!onOpenDocument} onClick={() => onOpenDocument?.(document.id)}
                    className="block text-left text-sm text-primary underline disabled:cursor-default disabled:text-muted-foreground disabled:no-underline">
                    {document.title}
                  </button>
                ))}
              </div>
            )}
          </div>
          {active.ownVote ? (
            <div className="space-y-2 rounded-md border p-3">
              <p className="font-medium">本人已提交评分（{active.ownVote.submittedAt}）</p>
              {active.ownVote.scores.map((row) => (
                <p key={row.dimensionId}>{dimensionRows.find((d) => d.id === row.dimensionId)?.name ?? row.dimensionId}：
                  {row.na ? ' N/A' : ' ' + row.score}
                </p>
              ))}
              <p className="whitespace-pre-wrap">公开评语：{active.ownVote.publicFeedback || '无'}</p>
              {!view.finalized && (
                <div className="space-y-2 border-t pt-3">
                  <p className="text-xs text-muted-foreground">提交后发现利益关联，仍可主动回避。原评分会从汇总撤销并保留审计记录。</p>
                  <input aria-label="提交后回避原因" value={recuseReason} disabled={busy}
                    onChange={(e) => setRecuseReason(e.target.value)} placeholder="请说明利益关联"
                    className="h-9 w-full rounded-md border bg-background px-2" />
                  <Button type="button" variant="outline" size="sm" disabled={busy || !recuseReason.trim()}
                    onClick={() => void onSubmit({ type: 'self-recuse', assignmentId: active.assignmentId, reason: recuseReason })}>撤销本人票并回避</Button>
                </div>
              )}
            </div>
          ) : active.status !== 'assigned' ? (
            <p className="text-muted-foreground">该任务已标记为{active.status === 'recused' ? '回避' : '缺评'}，无法直接提交。需要组织者重新分配。</p>
          ) : (
            <div className="space-y-3">
              {dimensionRows.map((dimension) => {
                const entry = draft[dimension.id] ?? { raw: '', na: false, comment: '' }
                const canNA = (active.naEligibleDimensionIds ?? []).includes(dimension.id)
                return (
                  <div key={dimension.id} className="space-y-2 rounded-md border p-3">
                    <label className="block">
                      <span className="font-medium">{dimension.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">权重 {dimension.weight} · {dimension.min}–{dimension.max} 分</span>
                      <input type="number" min={dimension.min} max={dimension.max} step="any" value={entry.raw} disabled={busy || entry.na}
                        onChange={(e) => setDraft((v) => ({ ...v, [dimension.id]: { ...entry, raw: e.target.value } }))}
                        placeholder="请填写人工评分" className="mt-2 block h-9 w-full rounded-md border bg-background px-2" />
                    </label>
                    {dimension.naWhen && (
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" checked={entry.na} disabled={busy || !canNA}
                          onChange={(e) => setDraft((v) => ({ ...v, [dimension.id]: { ...entry, na: e.target.checked } }))} />
                        本维度 N/A {canNA ? '（条件已由业务规则确认）' : '（适用条件尚未确认）'}
                      </label>
                    )}
                    <input value={entry.comment} disabled={busy} onChange={(e) => setDraft((v) => ({ ...v, [dimension.id]: { ...entry, comment: e.target.value } }))}
                      placeholder="本维度评语（可选）" className="h-9 w-full rounded-md border bg-background px-2" />
                  </div>
                )
              })}
              <label className="block space-y-1">
                <span>对外评语</span>
                <textarea value={publicFeedback} disabled={busy} onChange={(e) => setPublicFeedback(e.target.value)}
                  rows={2} className="w-full rounded-md border bg-background p-2" />
              </label>
              <label className="block space-y-1">
                <span>组织者内部备注（对申请人及其他评委隐藏）</span>
                <textarea value={internalNotes} disabled={busy} onChange={(e) => setInternalNotes(e.target.value)}
                  rows={2} className="w-full rounded-md border bg-background p-2" />
              </label>
              <Button type="button" disabled={busy || !canSubmit} onClick={() => void submit()}>提交本人独立评分</Button>
              <div className="space-y-2 border-t pt-3">
                <p className="text-xs text-muted-foreground">与项目存在利益关联、无法独立评审时，请先声明回避；回避不计为零分。</p>
                <input aria-label="本人回避原因" value={recuseReason} disabled={busy} onChange={(e) => setRecuseReason(e.target.value)}
                  placeholder="回避原因" className="h-9 w-full rounded-md border bg-background px-2" />
                <Button type="button" size="sm" variant="outline" disabled={busy || !recuseReason.trim()}
                  onClick={() => void onSubmit({ type: 'self-recuse', assignmentId: active.assignmentId, reason: recuseReason })}>声明本人回避</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function T07OrganizerDesk({ view, busy, onSubmit }: {
  view: T07OrganizerView; busy: boolean; onSubmit: (action: T07Action) => Promise<void>
}): JSX.Element {
  const { state, ranking } = view
  const round = state.rounds[state.rounds.length - 1]!
  const [caseId, setCaseId] = useState(state.cases[0]?.caseId ?? '')
  const [reviewerId, setReviewerId] = useState('')
  const [reasons, setReasons] = useState<Record<string, string>>({})
  const [reopenReason, setReopenReason] = useState('')
  const [confirmFinal, setConfirmFinal] = useState(false)
  const frozen = Boolean(round.finalized)
  const allReady = ranking.length > 0 && ranking.every((row) => row.blockers.length === 0 && row.selected !== null)
  const byCase = useMemo(() => new Map(state.cases.map((entry) => [entry.caseId, entry.blindLabel])), [state.cases])
  const ties = useMemo(() => {
    const grouped = new Map<string, typeof ranking>()
    for (const row of ranking) {
      if (row.total === null) continue
      const key = String(row.total)
      grouped.set(key, [...(grouped.get(key) ?? []), row])
    }
    return [...grouped.values()].filter((group) => group.length > 1)
  }, [ranking])
  const statusCount = useMemo(() => new Map(state.cases.map((entry) => {
    const assignments = round.assignments.filter((assignment) => assignment.caseId === entry.caseId)
    return [entry.caseId, {
      pending: assignments.filter((assignment) => assignment.status === 'assigned').length,
      recused: assignments.filter((assignment) => assignment.status === 'recused').length,
      missing: assignments.filter((assignment) => assignment.status === 'missing').length,
    }] as const
  })), [state.cases, round.assignments])
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span>批次 {state.batchId}</span>
        <span>第 {round.number} 轮</span>
        <span>最低有效人数 {state.rubric.minEffectiveJudges ?? 1}</span>
        <span>名额 {state.rubric.quota ?? '未限定'}</span>
        <span className={frozen ? 'font-semibold' : 'text-muted-foreground'}>{frozen ? '已冻结' : '未定稿'}</span>
      </div>
      {!frozen && (
        <div className="space-y-2 rounded-md border p-3">
          <h3 className="font-medium">分配评委 / 替补</h3>
          <div className="flex flex-wrap gap-2">
            <select aria-label="待评分案卷" value={caseId} disabled={busy} onChange={(e) => setCaseId(e.target.value)}
              className="h-9 min-w-36 rounded-md border bg-background px-2">
              {state.cases.map((entry) => <option key={entry.caseId} value={entry.caseId}>{entry.blindLabel}</option>)}
            </select>
            <input aria-label="评委 ID" value={reviewerId} onChange={(e) => setReviewerId(e.target.value)} disabled={busy}
              placeholder="评委 ID（本地实名索引）" className="h-9 flex-1 rounded-md border bg-background px-2" />
            <Button type="button" disabled={busy || !caseId || !reviewerId.trim()} onClick={() => void onSubmit({
              type: 'assign', caseId, reviewerId: reviewerId.trim(),
              assignmentId: 't07-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9),
            })}>分配</Button>
          </div>
          <p className="text-xs text-muted-foreground">替补需先处理原任务；已评分后发现利益冲突也可以回避，撤销票进入历史但不计入汇总。</p>
        </div>
      )}
      <div className="space-y-2 rounded-md border p-3">
        <h3 className="font-medium">指派状态与回避 / 缺评</h3>
        {round.assignments.length === 0 && <p className="text-muted-foreground">尚未分配评委</p>}
        {round.assignments.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center gap-2 border-b py-2 last:border-b-0">
            <span className="min-w-32">{byCase.get(a.caseId) ?? a.caseId} · {a.reviewerId}</span>
            <span className="text-muted-foreground">{a.status === 'recused' ? '回避' : a.status === 'submitted' ? '已提交' : a.status === 'missing' ? '缺评' : '待提交'}</span>
            {a.reason && <span className="text-xs text-muted-foreground">原因：{a.reason}</span>}
            {!frozen && (a.status === 'assigned' || a.status === 'submitted') && (
              <>
                <input aria-label={'处理原因 ' + a.id} value={reasons[a.id] ?? ''}
                  onChange={(e) => setReasons((v) => ({ ...v, [a.id]: e.target.value }))}
                  placeholder="原因" className="h-8 min-w-32 flex-1 rounded-md border bg-background px-2" />
                <Button type="button" size="sm" variant="outline" disabled={busy || !reasons[a.id]?.trim()}
                  onClick={() => void onSubmit({ type: 'recuse', assignmentId: a.id, reason: reasons[a.id]! })}>回避</Button>
                {a.status === 'assigned' && <Button type="button" size="sm" variant="outline" disabled={busy || !reasons[a.id]?.trim()}
                  onClick={() => void onSubmit({ type: 'mark-missing', assignmentId: a.id, reason: reasons[a.id]! })}>标缺评</Button>}
              </>
            )}
            {!frozen && a.status === 'submitted' && (
              <>
                <input aria-label={'退回改分原因 ' + a.id} value={reasons[a.id] ?? ''}
                  onChange={(e) => setReasons((v) => ({ ...v, [a.id]: e.target.value }))}
                  placeholder="重评原因" className="h-8 min-w-32 flex-1 rounded-md border bg-background px-2" />
                <Button type="button" size="sm" variant="outline" disabled={busy || !reasons[a.id]?.trim()}
                  onClick={() => void onSubmit({ type: 'request-revision', assignmentId: a.id, reason: reasons[a.id]! })}>退回改分</Button>
              </>
            )}
          </div>
        ))}
      </div>
      {(round.revisionHistory?.length ?? 0) > 0 && (
        <div className="space-y-1 rounded-md bg-muted/40 p-3 text-xs">
          <h3 className="font-medium">评分更正与撤销记录（{round.revisionHistory!.length}）</h3>
          {round.revisionHistory!.map((item, index) => (
            <p key={`${item.vote.assignmentId}-${item.at}-${index}`}>
              {byCase.get(item.vote.caseId) ?? item.vote.caseId} · {item.vote.reviewerId} ·
              {item.at} · {item.by}：{item.reason}
            </p>
          ))}
        </div>
      )}
      <div className="space-y-2 rounded-md border p-3">
        <h3 className="font-medium">评分汇总与名额</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead><tr className="border-b"><th className="p-2">匿名项目</th><th className="p-2">有效评委 / 缺口</th><th className="p-2">均分</th><th className="p-2">排名</th><th className="p-2">名额</th><th className="p-2">状态</th></tr></thead>
            <tbody>{ranking.map((row) => (
              <tr key={row.caseId} className="border-b align-top">
                <td className="p-2 font-medium">{row.blindLabel}</td><td className="p-2">
                  {row.effectiveJudges}/{state.rubric.minEffectiveJudges ?? 1}
                  <div className="text-muted-foreground">待评 {statusCount.get(row.caseId)?.pending ?? 0} · 回避 {statusCount.get(row.caseId)?.recused ?? 0} · 缺评 {statusCount.get(row.caseId)?.missing ?? 0}</div>
                  <details className="mt-1"><summary className="cursor-pointer text-primary">各维度分母</summary>
                    {row.dimensions.map((dimension) => <div key={dimension.dimensionId}>
                      {state.rubric.dimensions.find((item) => item.id === dimension.dimensionId)?.name ?? dimension.dimensionId}：
                      {scoreLabel(dimension.average)}（{dimension.voters} 票）
                    </div>)}
                  </details>
                </td>
                <td className="p-2">{scoreLabel(row.total)}{row.convertedTotal !== null && <div className="text-muted-foreground">折算 {row.convertedTotal.toFixed(2)}</div>}</td><td className="p-2">{row.rank ?? '—'}</td>
                <td className="p-2">{row.selected === null ? '待裁定' : row.selected ? '入选' : '未入选'}</td>
                <td className="p-2">
                  {row.blockers.length ? row.blockers.join('；') : '可定稿'}
                  {row.divergence !== null && <div className="text-muted-foreground">分歧 {row.divergence.toFixed(2)}</div>}
                  {!frozen && row.blockers.some((reason) => reason.includes('分歧')) && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      <input aria-label={'分歧复核原因 ' + row.caseId} value={reasons['div-' + row.caseId] ?? ''}
                        onChange={(e) => setReasons((v) => ({ ...v, ['div-' + row.caseId]: e.target.value }))}
                        placeholder="复核结论与理由" className="h-8 min-w-40 flex-1 rounded-md border bg-background px-2" />
                      <Button type="button" size="sm" variant="outline" disabled={busy || !reasons['div-' + row.caseId]?.trim()}
                        onClick={() => void onSubmit({ type: 'resolve-divergence', caseId: row.caseId, reason: reasons['div-' + row.caseId]! })}>记录复核</Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">N/A 不按 0 分；缺评不参与均分。分歧、最低人数和跨名额的同分需处理后才能冻结。</p>
      </div>
      {!frozen && state.rubric.tieBreaker === 'owner-decides' && ties.map((group) => (
        <T07TieResolver key={group.map((r) => r.caseId).join('|')} labels={byCase}
          group={group.map((r) => r.caseId)} total={group[0]!.total!} disabled={busy} onSubmit={onSubmit} />
      ))}
      {frozen && round.finalized
        ? <div className="space-y-2 rounded-md border p-3">
          <p className="font-medium">本轮已由 {round.finalized.by} 在 {round.finalized.at} 定稿</p>
          <p className="text-xs text-muted-foreground">本轮评分与排名不可修改。重开将进入下一轮，保留历史记录与原定稿快照。</p>
          <input value={reopenReason} onChange={(e) => setReopenReason(e.target.value)} placeholder="重开原因（必填）" className="h-9 w-full rounded-md border bg-background px-2" />
          <Button type="button" variant="outline" disabled={busy || !reopenReason.trim()} onClick={() => void onSubmit({ type: 'reopen', reason: reopenReason })}>授权重开下一轮</Button>
        </div>
        : <div className="space-y-2 rounded-md border p-3">
          <label className="flex gap-2 text-xs"><input type="checkbox" checked={confirmFinal} onChange={(e) => setConfirmFinal(e.target.checked)} disabled={busy || !allReady} />
            我已核实全部有效评委、分歧、同分与名额，确认冻结本轮排名。</label>
          <Button type="button" disabled={busy || !allReady || !confirmFinal} onClick={() => void onSubmit({ type: 'finalize' })}>冻结本轮排名</Button>
          {!allReady && <p className="text-xs text-muted-foreground">还有未满足的定稿条件，请按上方逐项处理。</p>}
        </div>}
    </div>
  )
}

function T07TieResolver({ group, labels, total, disabled, onSubmit }: {
  group: string[]; labels: Map<string, string>; total: number; disabled: boolean
  onSubmit: (action: T07Action) => Promise<void>
}): JSX.Element {
  const [order, setOrder] = useState(group)
  useEffect(() => { setOrder(group) }, [group.join('|')])
  const move = (index: number, shift: number): void => {
    const next = [...order]; const other = index + shift
    if (other < 0 || other >= order.length) return
    ;[next[index], next[other]] = [next[other]!, next[index]!]
    setOrder(next)
  }
  return (
    <div className="space-y-2 rounded-md border p-3">
      <p className="font-medium">组织者裁定同分顺序 · 总分 {total}</p>
      {order.map((caseId, i) => (
        <div key={caseId} className="flex items-center gap-2">
          <span className="flex-1">{i + 1}. {labels.get(caseId) ?? caseId}</span>
          <Button type="button" variant="outline" size="sm" disabled={disabled || i === 0} onClick={() => move(i, -1)}>上移</Button>
          <Button type="button" variant="outline" size="sm" disabled={disabled || i === order.length - 1} onClick={() => move(i, 1)}>下移</Button>
        </div>
      ))}
      <Button type="button" disabled={disabled} onClick={() => void onSubmit({ type: 'set-tie-order', caseIds: order })}>提交人工裁定顺序</Button>
    </div>
  )
}
