/**
 * T08 reviewed AI suggestion: a real, explicitly confirmed field edit using
 * the already trusted Main UpdateFieldsV2 transaction.
 * No model-generated key, Actor or approval is ever executed.
 */
import * as React from 'react'
import type { CaseAggregateV2, ReviewRunV2, SourceRef, TemplateVersion } from '@profer/shared'
import { useReviewWorkspaceActions } from './use-review-workspace-actions'
import { resolveT08Source } from './review-v3-t08-case-report'
import {
  getT08FieldTargets, parseT08FieldDraft, showT08FieldValue,
} from './review-v3-t08-suggestion'
import { makeF17FieldPatch } from './review-v3-f17-patch'

interface Props {
  aggregate: CaseAggregateV2
  run: ReviewRunV2
  template: TemplateVersion | null
  opinion: ReviewRunV2['opinions'][number]
  stale: boolean
  onOpenSource?(source: SourceRef): Promise<void>
  onClose(): void
}

export function ReviewV3T08SuggestionReview({ aggregate, run, template, opinion, stale, onOpenSource, onClose }: Props): React.ReactElement {
  const actions = useReviewWorkspaceActions()
  const targets = React.useMemo(() => template?.status === 'published'
    ? getT08FieldTargets(aggregate, template) : [], [aggregate, template])
  const [mode, setMode] = React.useState<'field' | 'supplement'>('field')
  const [targetId, setTargetId] = React.useState('')
  const [requiredElements, setRequiredElements] = React.useState('')
  const [supplementReason, setSupplementReason] = React.useState('')
  const [draft, setDraft] = React.useState('')
  const [reviewNote, setReviewNote] = React.useState(opinion.suggestionText)
  const [confirmed, setConfirmed] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [notice, setNotice] = React.useState('')
  const target = targets.find((item) => item.id === targetId) ?? null
  const sources = opinion.sourceRefs.map((ref) => resolveT08Source(ref, aggregate))
  const located = sources.filter((ref) => ref.state === 'located').length

  React.useEffect(() => { setConfirmed(false) }, [mode, targetId, draft, requiredElements, supplementReason])

  const apply = async (): Promise<void> => {
    if (!confirmed || stale || busy || (mode === 'field' && !target)) return
    setBusy(true); setNotice('')
    try {
      const fresh = await window.reviewAPI.getAggregateV2(aggregate.caseV2.id)
      if (!fresh || fresh.caseV2.revision !== aggregate.caseV2.revision)
        throw new Error('案卷在审阅期间已经修改；请刷新案卷后重新核对修改前后的值')
      if (await window.reviewAPI.getWorkspaceRunValidityV2({ caseId: aggregate.caseV2.id, runId: run.id }))
        throw new Error('关联的审核 Run 已过期，不允许以旧建议修改当前案卷')
      if (mode === 'supplement') {
        const elements = [...new Set(requiredElements.split(/[,，、\n]+/).map(item => item.trim()).filter(Boolean))]
        if (!elements.length || !supplementReason.trim()) throw new Error('请明确补件要素和原因')
        await actions.openSupplement({ findingKey: opinion.id, requiredElements: elements, reason: supplementReason.trim() })
        setNotice('补件任务已经由 Main 业务事务记录；尚需申请人回复与审核员复核，不等于自动批准。')
        setConfirmed(false)
        setRequiredElements('')
        setSupplementReason('')
        return
      }
      if (!target) throw new Error('请先选择字段')
      const value = parseT08FieldDraft(target.field, draft)
      const update = makeF17FieldPatch(target, value)
      const response = await window.reviewAPI.updateFieldsV2({
        caseId: aggregate.caseV2.id,
        command: {
          requestId: 't08-reviewed-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9),
          target: { kind: 'case', id: aggregate.caseV2.id },
          type: 'UpdateFields',
          // Main must rebind the local actor. This is NOT school identity.
          actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
          expectedRevision: fresh.caseV2.revision,
          payload: update,
        },
      })
      if (!response?.ok) throw new Error(response?.message ?? '业务字段保存失败')
      await actions.refresh()
      if (aggregate.receiptLog[0]?.type === 'CreateNativeWorkspaceCaseV3') {
        setNotice('字段修改已保存。当前输入已变更，旧 Run 不再是当前结论；请从统一审核入口重新运行完整 Pi 检查。')
        setConfirmed(false)
        setDraft('')
        return
      }
      // 修改后不能继续展示旧 Run 当作最新结论；直接生成新的正式规则 Run。
      // Main 会按当前案卷和模板重新冻结输入，历史 Run 保留不改写。
      let reviewMessage = ''
      try {
        const nextRun = await window.reviewAPI.runTemplateRuleReview({ caseId: aggregate.caseV2.id })
        await actions.refresh()
        reviewMessage = `已重新检查 ${nextRun.checks.length} 项模板规则，旧 Run 保留；AI 语义意见仍需重新运行完整审核。`
      } catch (recheckError) {
        reviewMessage = `修改已保存，但自动重审未完成：${recheckError instanceof Error ? recheckError.message : String(recheckError)}。请在规则检查区重新审核。`
      }
      setNotice(`字段修改已保存。${reviewMessage}`)
      setConfirmed(false)
      setDraft('')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : String(error))
    } finally { setBusy(false) }
  }

  return <section aria-label="审核助手建议应用" className="mt-2 space-y-2 rounded border border-primary/40 bg-muted/20 p-3 text-xs">
    <header className="flex items-start justify-between">
      <strong>人工审阅 AI 建议 · {opinion.title}</strong>
      <button type="button" className="rounded border px-2 py-1" onClick={onClose}>关闭</button>
    </header>
    <label className="block space-y-1">AI 原建议（可审阅编辑的临时草案，不自动执行）
      <textarea className="w-full rounded border bg-background p-2" rows={3}
        value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} />
    </label>
    <button type="button" className="rounded border px-2 py-1" onClick={() => {
      void navigator.clipboard.writeText(reviewNote)
        .then(() => setNotice('草案已复制；修改仍需通过下方明确的人工确认操作。'))
        .catch((error) => setNotice('复制草案失败：' + String(error)))
    }}>复制临时草案</button>
    <p className="text-muted-foreground">关联 Run：{run.id}；当前案卷 revision {aggregate.caseV2.revision}。准确定位来源 {located}/{sources.length}，无法核对的来源不得视作证据。</p>
    {sources.map((source, index) => <div key={index} className="text-muted-foreground">
      <span>{source.label} · {source.state}</span>
      {onOpenSource && (source.state === 'located' || source.state === 'file-only') && <button
        type="button" className="ml-2 rounded border border-border px-2 py-1 text-foreground"
        onClick={() => void onOpenSource(source.ref)}>核对原件</button>}
    </div>)}
    {stale && <p className="text-amber-700">本次 Run 已过期；刷新并重新核查后才能应用。</p>}
    <div className="flex flex-wrap gap-2">
      <button type="button" className={'rounded border px-2 py-1 ' + (mode === 'field' ? 'bg-primary text-primary-foreground' : '')} onClick={() => setMode('field')}>审阅字段修改</button>
      <button type="button" className={'rounded border px-2 py-1 ' + (mode === 'supplement' ? 'bg-primary text-primary-foreground' : '')} onClick={() => setMode('supplement')}>审阅补件建议</button>
    </div>
    {mode === 'field' && (!targets.length ? <p>当前没有可供人工修改的已发布模板字段；必须先配置真实模板，不接受 AI 自造字段。</p> : <>
      <label className="block space-y-1">
        <span>选择实际修改目标（不自动猜测）</span>
        <select className="w-full rounded border bg-background p-2" value={targetId} onChange={(event) => { setTargetId(event.target.value); setDraft(''); setNotice('') }}>
          <option value="">请选择模板中的具体字段</option>
          {targets.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
      </label>
      {target && <div className="space-y-2">
        <p>旧值：<strong>{showT08FieldValue(target.before)}</strong></p>
        <label className="block space-y-1"><span>新值（由人工确认，不从模型自动填入）</span>
          {target.field.kind === 'boolean'
            ? <select className="w-full rounded border bg-background p-2" value={draft} onChange={(event) => setDraft(event.target.value)}>
                <option value="">请选择</option><option value="true">是</option><option value="false">否</option>
              </select>
            : target.field.kind === 'enum' && target.field.options?.length
              ? <select className="w-full rounded border bg-background p-2" value={draft} onChange={(event) => setDraft(event.target.value)}>
                  <option value="">请选择</option>
                  {target.field.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              : <input className="w-full rounded border bg-background p-2" value={draft} onChange={(event) => setDraft(event.target.value)}
                  placeholder={target.field.kind === 'number' ? '例如 18' : target.field.kind === 'date' ? 'YYYY-MM-DD' : '请输入核对后的实际值'} />
          }
        </label>
        <div className="rounded bg-background p-2">对比：{showT08FieldValue(target.before)} → <strong>{draft || '待填写'}</strong></div>
        <p className="text-muted-foreground">保存前由 Main 校验字段与权限；保存后会尝试用当前案卷版本重新运行规则检查，保留旧运行历史。</p>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
          <span>我已核对原件和模板，确认仅修改选定字段；这不是自动采纳模型意见。保存后将尝试重审，旧 Run 保留。</span>
        </label>
        <button type="button" className="rounded bg-primary px-3 py-2 text-primary-foreground disabled:opacity-50"
          disabled={stale || busy || !draft.trim() || !confirmed} onClick={() => void apply()}>
          {busy ? '正在保存…' : '人工确认并保存至案卷'}
        </button>
      </div>}
    </>)}
    {mode === 'supplement' && <div className="space-y-2">
      <label className="block space-y-1">需要补交的材料或要素（逗号或换行分隔）
        <textarea className="w-full rounded border bg-background p-2" value={requiredElements}
          onChange={event => setRequiredElements(event.target.value)} placeholder="例如：清晰扫描件、申请计划书" />
      </label>
      <label className="block space-y-1">人工核验后的补件原因
        <textarea className="w-full rounded border bg-background p-2" value={supplementReason}
          onChange={event => setSupplementReason(event.target.value)} placeholder="明确指出缺少的证据，不能只复制模型结论" />
      </label>
      <label className="flex items-start gap-2">
        <input type="checkbox" className="mt-1" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />
        <span>我已核对本次 Run 和材料，决定发起补件任务。该操作需要申请人回复，不等于最终审核决定。</span>
      </label>
      <button type="button" className="rounded bg-primary px-3 py-2 text-primary-foreground disabled:opacity-50"
        disabled={stale || busy || !confirmed || !requiredElements.trim() || !supplementReason.trim()}
        onClick={() => void apply()}>{busy ? '正在保存…' : '确认并创建补件任务'}</button>
    </div>}
    {notice && <p role="status">{notice}</p>}
  </section>
}
