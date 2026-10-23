/**
 * T03 subject split/merge UI. Produces a complete immutable business proposal.
 * The optional onApply is supplied only by L's single trusted Case CAS writer.
 */
import * as React from 'react'
import type { CaseAggregateV2, ReviewRunV2, SourceRef } from '@profer/shared'
import {
  proposeT03SubjectMerge, proposeT03SubjectSplit, type T03RestructureProposal,
} from '../../../main/lib/review/review-v3-t03-subject-restructure'

type Part = 'a' | 'b'
export function ReviewV3T03RestructurePanel({
  aggregate, run, onApply,
}: {
  aggregate: CaseAggregateV2
  run: ReviewRunV2 | null
  onApply?: (proposal: T03RestructureProposal) => Promise<void>
}): React.ReactElement {
  const subjects = aggregate.caseV2.subjects.filter(item => item.status !== 'ignored')
  const [mode, setMode] = React.useState<'split' | 'merge'>('split')
  const [originId, setOriginId] = React.useState('')
  const [mergeIds, setMergeIds] = React.useState<string[]>([])
  const [titleA, setTitleA] = React.useState('')
  const [titleB, setTitleB] = React.useState('')
  const [mergedTitle, setMergedTitle] = React.useState('')
  const [fields, setFields] = React.useState<Record<string, Part>>({})
  const [links, setLinks] = React.useState<Record<string, Part>>({})
  const [docA, setDocA] = React.useState('')
  const [docB, setDocB] = React.useState('')
  const [preview, setPreview] = React.useState<T03RestructureProposal | null>(null)
  const [error, setError] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const origin = subjects.find(item => item.id === originId) ?? subjects[0]
  const originLinks = aggregate.evidenceLinks.filter(item =>
    item.subjectId === origin?.id && item.status !== 'rejected')
  const knownFields = origin
    ? [...new Set([...Object.keys(origin.fields),
        ...aggregate.observations.filter(item => item.subjectId === origin.id).map(item => item.fieldKey)])]
    : []
  const docs = aggregate.caseV2.documents.filter(doc => doc.active !== false)
  const reference = (id: string): SourceRef[] => {
    const doc = docs.find(item => item.versionId === id)
    return doc ? [{ caseId: aggregate.caseV2.id, documentVersionId: doc.versionId,
      parseRevision: doc.parseRevision, location: { kind: 'file' } }] : []
  }
  const reset = (): void => { setPreview(null); setError('') }
  const previewPlan = (): void => {
    reset()
    try {
      // Preview is deterministic until submission, when L issues its real CAS request.
      const operationId = 't03-restructure-' + crypto.randomUUID()
      if (mode === 'split') {
        if (!origin || !titleA.trim() || !titleB.trim()) throw new Error('选择原事项并填写两个新事项名称')
        const part = (which: Part) => ({
          id: operationId + '-' + which,
          title: which === 'a' ? titleA.trim() : titleB.trim(),
          fieldKeys: knownFields.filter(field => (fields[field] ?? 'a') === which),
          evidenceLinkIds: originLinks.filter(link => (links[link.id] ?? 'a') === which).map(link => link.id),
          sourceRefs: reference(which === 'a' ? docA : docB),
        })
        setPreview(proposeT03SubjectSplit(aggregate, run, {
          operationId, subjectId: origin.id, parts: [part('a'), part('b')],
        }))
      } else {
        if (!mergedTitle.trim()) throw new Error('填写合并后事项名称')
        setPreview(proposeT03SubjectMerge(aggregate, run, {
          operationId, subjectIds: mergeIds, newSubjectId: operationId + '-merged',
          title: mergedTitle.trim(),
        }))
      }
    } catch (err) { setError(err instanceof Error ? err.message : String(err)) }
  }
  const submit = async (): Promise<void> => {
    if (!preview || !onApply || preview.blockedReasons.length) return
    setBusy(true); setError('')
    try { await onApply(preview); setPreview(null) }
    catch (err) { setError(err instanceof Error ? err.message : String(err)) }
    finally { setBusy(false) }
  }
  return <section className="space-y-2 rounded border p-2 text-xs" aria-label="事项拆分合并">
    <h4 className="font-medium">事项拆分与合并</h4>
    <p className="text-muted-foreground">不会把同名主体自动视为同一人。新主体事实与证明先成为待确认候选；原始版本保留。</p>
    <div className="flex gap-3">
      <label><input type="radio" checked={mode === 'split'} onChange={() => { setMode('split');reset() }} /> 拆分事项</label>
      <label><input type="radio" checked={mode === 'merge'} onChange={() => { setMode('merge');reset() }} /> 合并重复事项</label>
    </div>
    {mode === 'split' ? <div className="space-y-2">
      <label className="block">原事项
        <select className="ml-1 rounded border bg-background p-1" value={origin?.id ?? ''}
          onChange={event => { setOriginId(event.target.value);reset() }}>
          {subjects.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-1">
        <label>新事项 A
          <input value={titleA} onChange={event => { setTitleA(event.target.value);reset() }}
            className="w-full rounded border bg-background p-1" />
        </label>
        <label>新事项 B
          <input value={titleB} onChange={event => { setTitleB(event.target.value);reset() }}
            className="w-full rounded border bg-background p-1" />
        </label>
      </div>
      <p className="font-medium">逐项指定事实归属（不能漏掉或复制到两个事项）</p>
      {knownFields.map(field => <label key={field} className="flex items-center justify-between gap-2">
        <span>{field}</span>
        <select value={fields[field] ?? 'a'} onChange={event => {
          setFields(old => ({ ...old, [field]: event.target.value as Part }));reset()
        }} className="rounded border bg-background p-1">
          <option value="a">事项 A</option><option value="b">事项 B</option>
        </select>
      </label>)}
      <p className="font-medium">逐条指定证明归属</p>
      {originLinks.map(link => <label key={link.id} className="flex items-center justify-between gap-2">
        <span>{link.supportsFact} · {link.documentVersionId}</span>
        <select value={links[link.id] ?? 'a'} onChange={event => {
          setLinks(old => ({ ...old, [link.id]: event.target.value as Part }));reset()
        }} className="rounded border bg-background p-1">
          <option value="a">事项 A</option><option value="b">事项 B</option>
        </select>
      </label>)}
      <p className="font-medium">明确原件来源（如已有被分配的事实或证明，可不重复选择）</p>
      {([['a',docA,setDocA],['b',docB,setDocB]] as const).map(([id,value,setValue]) =>
        <label key={id} className="block">事项 {id.toUpperCase()}
          <select value={value} onChange={event => { setValue(event.target.value);reset() }}
            className="ml-1 rounded border bg-background p-1">
            <option value="">由分配的事实/证明引用</option>
            {docs.map(doc => <option key={doc.versionId} value={doc.versionId}>{doc.fileName}</option>)}
          </select>
        </label>)}
    </div> : <div className="space-y-2">
      <p>选择需要合并的至少两个事项。字段冲突必须先人工解决，不会擅自取最大分或最新 AI 值。</p>
      {subjects.map(item => <label key={item.id} className="block">
        <input type="checkbox" checked={mergeIds.includes(item.id)}
          onChange={event => { setMergeIds(ids => event.target.checked ? [...ids,item.id] : ids.filter(id => id !== item.id));reset() }} />
        <span className="ml-1">{item.title}</span>
      </label>)}
      <label className="block">合并后事项名
        <input value={mergedTitle} onChange={event => { setMergedTitle(event.target.value);reset() }}
          className="ml-1 rounded border bg-background p-1" />
      </label>
    </div>}
    <button type="button" className="rounded border px-2 py-1" disabled={busy || subjects.length < 2}
      onClick={previewPlan}>预览拆并影响</button>
    {error && <p role="alert" className="text-red-600">{error}</p>}
    {preview && <div className="space-y-1 rounded bg-muted p-2">
      <p>原主体 {preview.retireSubjectIds.length} 个 → 新主体 {preview.proposedSubjects.length} 个</p>
      <p>事实候选 {preview.proposedObservations.length} 条 · 待确认关联 {preview.proposedEvidenceLinks.length} 条</p>
      <p>可能需要重审旧检查 {preview.impact.affectedCheckIds.length} 项；旧 Run 不被覆盖。</p>
      {preview.blockedReasons.map(item => <p key={item} className="text-red-600">{item}</p>)}
      {onApply
        ? <button type="button" disabled={busy || !!preview.blockedReasons.length}
            onClick={() => void submit()} className="rounded border px-2 py-1 disabled:opacity-50">通过案卷原子事务保存</button>
        : <p className="text-amber-600">此环境尚未接入 L 的单次 CAS 拆并写入；当前仅能预览，不能假装已保存。</p>}
    </div>}
  </section>
}
