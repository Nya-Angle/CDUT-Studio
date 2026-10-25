/**
 * T03 workspace surface. Reuse existing CAS-backed workspace actions and atoms.
 * T10 / Local-L only needs to mount this component in the unified workspace.
 */
import * as React from 'react'
import { useAtomValue } from 'jotai'
import type { CaseAggregateV2, FieldValue, SourceRef } from '@profer/shared'
import { reviewWorkspaceAggregateAtom, reviewWorkspaceExtractedObservationsAtom, reviewWorkspaceRunAtom } from '@/atoms/review-atoms'
import { useReviewWorkspaceActions } from './use-review-workspace-actions'
import { ReviewV3T03RestructurePanel } from './ReviewV3T03RestructurePanel'
import type { T03RestructureProposal } from '../../../main/lib/review/review-v3-t03-subject-restructure'
import { parseT03Correction, planT03Recheck, projectT03Evidence, projectT03Facts, type T03ExtractedFact } from '../../../main/lib/review/review-v3-t03-fact-workflow'

function asValue(value: unknown): FieldValue {
  if (value && typeof value === 'object' && 'kind' in value) return value as FieldValue
  if (typeof value === 'number') return { kind: 'number', value }
  if (typeof value === 'boolean') return { kind: 'boolean', value }
  return { kind: 'text', value: value == null ? '' : String(value) }
}
function show(value: FieldValue): string {
  if (value.kind === 'attachment') return value.documentVersionId
  if (value.kind === 'multi') return value.value.join('、')
  if (value.kind === 'object' || value.kind === 'rows') return JSON.stringify(value.value)
  return String(value.value)
}
/** Preserve canonical refs only; a quote without location is not a fabricated SourceRef. */
function readRef(raw: unknown, aggregate: CaseAggregateV2): SourceRef | null {
  if (!raw || typeof raw !== 'object') return null
  const ref = raw as Partial<SourceRef>
  if (typeof ref.documentVersionId !== 'string') return null
  const doc = aggregate.caseV2.documents.find(d => d.versionId === ref.documentVersionId)
  if (!doc || doc.active === false) return null
  // 不把跨案卷、旧解析版本的模型引用悄悄转换成当前原件。
  if ((ref.caseId !== undefined && ref.caseId !== aggregate.caseV2.id) ||
      (ref.parseRevision !== undefined && ref.parseRevision !== doc.parseRevision)) return null
  // 只有真实未提供定位时才使用文档级定位。
  return {
    caseId: aggregate.caseV2.id, documentVersionId: doc.versionId,
    parseRevision: doc.parseRevision, location: ref.location ?? { kind: 'file' },
    ...(typeof ref.quote === 'string' ? { quote: ref.quote } : {}),
  }
}
export function ReviewV3T03FactWorkbench({ onRestructure }: { onRestructure?: (proposal: T03RestructureProposal) => Promise<void> } = {}): React.ReactElement {
  const aggregate = useAtomValue(reviewWorkspaceAggregateAtom)
  const extracted = useAtomValue(reviewWorkspaceExtractedObservationsAtom)
  const run = useAtomValue(reviewWorkspaceRunAtom)
  const actions = useReviewWorkspaceActions()
  const [factKey, setFactKey] = React.useState('')
  const [docId, setDocId] = React.useState('')
  const [subjectId, setSubjectId] = React.useState('')
  const [factText, setFactText] = React.useState('')
  const [corrected, setCorrected] = React.useState('')
  const [reason, setReason] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const candidates = React.useMemo<T03ExtractedFact[]>(() => {
    if (!aggregate || !Array.isArray(extracted)) return []
    return extracted.flatMap(raw => {
      if (!raw || typeof raw !== 'object') return []
      const item = raw as Record<string, unknown>
      if (typeof item.subjectId !== 'string' || typeof item.fieldKey !== 'string') return []
      const refs = Array.isArray(item.sourceRefs)
        ? item.sourceRefs.map(ref => readRef(ref, aggregate)).filter((ref): ref is SourceRef => !!ref)
        : []
      return [{ subjectId: item.subjectId, fieldKey: item.fieldKey, value: asValue(item.value),
        sourceRefs: refs, confidence: typeof item.confidence === 'number' ? item.confidence : undefined }]
    })
  }, [aggregate, extracted])
  const facts = React.useMemo(() => aggregate ? projectT03Facts(aggregate, candidates) : [], [aggregate, candidates])
  const evidence = React.useMemo(() => aggregate ? projectT03Evidence(aggregate, candidates) : [], [aggregate, candidates])
  const fact = facts.find(item => item.key === factKey) ?? facts[0] ?? null
  const doc = evidence.find(item => item.documentVersionId === docId) ?? evidence[0] ?? null
  const lastCandidate = fact?.candidates[fact.candidates.length - 1] ?? null
  const impact = React.useMemo(() => aggregate && fact
    ? planT03Recheck(aggregate, run, { subjectIds: [fact.subjectId], fieldKeys: [fact.fieldKey] })
    : null, [aggregate, run, fact])
  /** 修改证据或事实后启动一份新的、与当前案卷版本绑定的规则 Run。 */
  const perform = async (task: () => Promise<void>, success: string): Promise<void> => {
    setBusy(true); setMessage('')
    try {
      await task()
      if (aggregate?.receiptLog[0]?.type === 'CreateNativeWorkspaceCaseV3') {
        await actions.refresh()
        setMessage(`${success}；原 Run 随输入修订失效。请从统一审核入口执行完整 Pi 重审，不能以单独的模板规则 Run 代替新结论。`)
        return
      }
      try {
        // aggregate 可能已被刷新清空，取不到案卷时跳过重查而不是抛错
        const caseIdForRecheck = aggregate?.caseV2.id
        const nextRun = caseIdForRecheck
          ? await window.reviewAPI.runTemplateRuleReview({ caseId: caseIdForRecheck })
          : { checks: [] }
        await actions.refresh()
        setMessage(`${success}；已重新检查 ${nextRun.checks.length} 项模板规则，旧 Run 保留。涉及 AI 语义判断的事项仍需重新运行完整审核。`)
      } catch (recheckError) {
        await actions.refresh()
        setMessage(`${success}；修改已保存，但规则重审未完成：${recheckError instanceof Error ? recheckError.message : String(recheckError)}。可在规则检查区再次执行。`)
      }
    }
    catch (error) { setMessage(error instanceof Error ? error.message : String(error)) }
    finally { setBusy(false) }
  }
  if (!aggregate) return <p className="text-sm text-muted-foreground">打开案卷后可核对事实与证明。</p>
  const titles = new Map(aggregate.caseV2.subjects.map(item => [item.id, item.title]))
  const confirm = (value: FieldValue, why: string, refs?: SourceRef[]): void => {
    if (!fact) return
    const sourceRefs = refs ?? fact.current?.sourceRefs ?? lastCandidate?.sourceRefs ?? []
    if (!sourceRefs.length) { setMessage('缺少可核对的原件引用，请先补齐来源'); return }
    void perform(() => actions.confirmObservation({
      subjectId: fact.subjectId, fieldKey: fact.fieldKey, value, sourceRefs,
    }, value, why), '事实已更新')
  }
  return <section className="space-y-3 rounded-lg border p-3 text-sm" aria-label="事实与证明核对">
    <header>
      <h3 className="font-semibold">事实与证明核对</h3>
      <p className="text-xs text-muted-foreground">候选不自动成为有效事实；人工确认保留历史；同一证明允许支持多个事项但不等于重复计分。</p>
      <p className="text-xs">待核对 {facts.filter(item => item.needsReview).length}/{facts.length} · 候选关联 {aggregate.evidenceLinks.filter(item => item.status === 'candidate').length}</p>
    </header>
    {message && <p role="status" className="text-xs">{message}</p>}
    <div className="grid gap-3 md:grid-cols-2">
      <div className="space-y-2">
        <h4 className="font-medium">事实候选 / 人工确认</h4>
        <div className="max-h-52 space-y-1 overflow-y-auto">
          {facts.map(item => <button key={item.key} type="button" onClick={() => {
            setFactKey(item.key); setCorrected(''); setReason(''); setMessage('')
          }} className={'block w-full rounded border px-2 py-1 text-left text-xs ' +
            (fact?.key === item.key ? 'border-primary bg-muted' : '')}>
            <span>{item.subjectTitle} · {item.fieldKey}</span>
            <span className="ml-2 text-muted-foreground">{item.current ? show(item.current.value) : '未确认'}</span>
            {item.needsReview && <span className="ml-1 text-amber-600">待处理</span>}
          </button>)}
          {!facts.length && <p className="text-xs text-muted-foreground">暂无抽取事实；需要先登记事项并运行提取。</p>}
        </div>
        {fact && <div className="space-y-2 rounded border p-2 text-xs">
          <p className="font-medium">{fact.subjectTitle} · {fact.fieldKey}</p>
          <p>已确认值：{fact.current ? show(fact.current.value) : '暂无'}</p>
          {fact.reasons.map(reason => <p key={reason} className="text-amber-600">{reason}</p>)}
          {fact.candidates.map((candidate, index) => <div key={candidate.id ?? index} className="flex items-center justify-between gap-1 rounded bg-muted p-1">
            <span className="break-all">候选：{show(candidate.value)}</span>
            <button type="button" className="rounded border px-2 py-1 disabled:opacity-50"
              disabled={busy || !titles.has(fact.subjectId)}
              onClick={() => confirm(candidate.value, '人工核对原件，确认候选事实', candidate.sourceRefs)}>确认</button>
          </div>)}
          <label className="block">更正数值或文字
            <input value={corrected} onChange={event => setCorrected(event.target.value)}
              className="mt-1 w-full rounded border bg-background px-2 py-1" placeholder="0 是有效数值" />
          </label>
          <label className="block">更正理由（必填）
            <input value={reason} onChange={event => setReason(event.target.value)}
              className="mt-1 w-full rounded border bg-background px-2 py-1" />
          </label>
          <button type="button" disabled={busy || !reason.trim() || !titles.has(fact.subjectId)}
            className="rounded border px-2 py-1 disabled:opacity-50" onClick={() => {
              try { confirm(parseT03Correction(corrected, fact.current?.value ?? lastCandidate?.value ??
                { kind: 'text', value: '' }), reason.trim()) }
              catch (error) { setMessage(error instanceof Error ? error.message : String(error)) }
            }}>保存人工更正</button>
          <details><summary>完整观察历史（{fact.history.length}）</summary>
            <ol>{fact.history.map(item => <li key={item.id}>{item.createdAt} · {show(item.value)} · {item.extractedBy} · {item.confirmed ? '曾确认' : '候选/已失效'}</li>)}</ol>
          </details>
          {impact && <p className="rounded bg-muted p-2">
            更正后建议重审：{impact.fullReviewRequired ? '首次或全量审核' :
            String(impact.affectedCheckIds.length) + ' 个旧检查，' + String(impact.affectedRuleIds.length) + ' 条规则'}。
            旧 Run 不会被覆盖。
          </p>}
        </div>}
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">证明归属 / 多对多绑定</h4>
        <select value={doc?.documentVersionId ?? ''} onChange={event => setDocId(event.target.value)}
          className="w-full rounded border bg-background p-1">
          {evidence.map(item => <option key={item.documentVersionId} value={item.documentVersionId}>{item.fileName}{item.active ? '' : '（旧版本）'}</option>)}
        </select>
        {doc ? <div className="space-y-2 rounded border p-2 text-xs">
          {!doc.active && <p className="text-red-600">原件已退役，不能作为新的当前证据。</p>}
          {!!doc.ambiguousSubjectIds.length && <p className="text-amber-600">
            跨主体候选：{doc.ambiguousSubjectIds.map(id => titles.get(id) ?? id).join('、')}，不得自动认定归属。
          </p>}
          {doc.links.map(link => <div key={link.id} className="flex items-center justify-between gap-1 rounded bg-muted/50 p-1">
            <span>{titles.get(link.subjectId) ?? link.subjectId} · {link.supportsFact} · {link.status}</span>
            {link.status !== 'rejected' && <div className="flex shrink-0 gap-1">
              {link.status === 'candidate' && <button type="button" disabled={busy || !doc.active}
                className="rounded border px-1 disabled:opacity-50"
                onClick={() => void perform(() => actions.transitionEvidenceLink({ id: link.id, documentVersionId: link.documentVersionId,
                  subjectId: link.subjectId, supportsFact: link.supportsFact, status: 'confirmed' }),
                  '证明归属已确认')}>确认</button>}
              <button type="button" disabled={busy} className="rounded border px-1 disabled:opacity-50"
                onClick={() => void perform(() => actions.transitionEvidenceLink({ id: link.id, documentVersionId: link.documentVersionId,
                  subjectId: link.subjectId, supportsFact: link.supportsFact, status: 'rejected' }),
                  '已拒绝关联，历史保留')}>拒绝</button>
            </div>}
          </div>)}
          {doc.suggestions.map(item => <div key={item.subjectId + ':' + item.supportsFact}
            className="flex items-center justify-between gap-1 rounded border border-amber-500/30 bg-amber-500/5 p-1">
            <span>抽取候选 · {titles.get(item.subjectId) ?? item.subjectId} · {item.supportsFact}（未绑定）</span>
            <button type="button" disabled={busy || !doc.active}
              className="rounded border px-1 disabled:opacity-50"
              onClick={() => void perform(() => actions.transitionEvidenceLink({
                documentVersionId: item.documentVersionId, subjectId: item.subjectId,
                supportsFact: item.supportsFact, status: 'confirmed',
              }), '已由审核员核对并绑定候选来源')}>核对并绑定</button>
          </div>)}
          <label className="block">手动绑定事项
            <select value={subjectId} onChange={event => setSubjectId(event.target.value)}
              className="mt-1 w-full rounded border bg-background p-1">
              <option value="">选择事项</option>
              {aggregate.caseV2.subjects.map(subject => <option key={subject.id} value={subject.id}>{subject.title}</option>)}
            </select>
          </label>
          <label className="block">支持的事实
            <input value={factText} onChange={event => setFactText(event.target.value)}
              className="mt-1 w-full rounded border bg-background px-2 py-1" placeholder="事实字段或陈述" />
          </label>
          <button type="button" disabled={busy || !doc.active || !subjectId || !factText.trim()}
            className="rounded border px-2 py-1 disabled:opacity-50"
            onClick={() => void perform(() => actions.transitionEvidenceLink({
              documentVersionId: doc.documentVersionId, subjectId, supportsFact: factText.trim(), status: 'confirmed',
            }), '人工关联已保存')}>添加关联</button>
        </div> : <p className="text-xs text-muted-foreground">案卷尚无证明文档。</p>}
      </div>
    </div>
    <ReviewV3T03RestructurePanel aggregate={aggregate} run={run} onApply={onRestructure} />
  </section>
}
