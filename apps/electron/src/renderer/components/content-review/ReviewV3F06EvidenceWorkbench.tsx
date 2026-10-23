/**
 * F06 独立证明核对视图。待工作台 Owner 挂载；所有修改通过既有 SetEvidenceLinkV2 CAS。
 * 不将 AI 提取候选、同名主体或相同字节的文件直接视为已确认事实。
 */
import * as React from 'react'
import { useAtomValue } from 'jotai'
import type { Actor, SourceRef } from '@profer/shared'
import { reviewWorkspaceAggregateAtom, reviewWorkspaceExtractedObservationsAtom } from '@/atoms/review-atoms'
import { useReviewWorkspaceActions } from './use-review-workspace-actions'
import {
  describeF06Location, previewF06Assignment, projectF06Evidence,
  type F06ExtractedFact,
} from '../../../main/lib/review/review-v3-f06-evidence'

const localReviewer: Actor = { actorId: 'local-user', actorSource: 'local', role: 'reviewer' }

/** 只接受真实已登记的 SourceRef，不把字符串/文件名猜作页码或原文定位。 */
function extractedFacts(raw: readonly Record<string, unknown>[]): F06ExtractedFact[] {
  return raw.flatMap(item => {
    if (typeof item.subjectId !== 'string' || typeof item.fieldKey !== 'string') return []
    const sourceRefs: SourceRef[] = Array.isArray(item.sourceRefs) ? item.sourceRefs.flatMap(source => {
      if (!source || typeof source !== 'object') return []
      const ref = source as Partial<SourceRef>
      if (typeof ref.caseId !== 'string' || typeof ref.documentVersionId !== 'string' ||
        typeof ref.parseRevision !== 'number' || !ref.location || typeof ref.location.kind !== 'string') return []
      return [ref as SourceRef]
    }) : []
    return [{ subjectId: item.subjectId, fieldKey: item.fieldKey, sourceRefs }]
  })
}

export function ReviewV3F06EvidenceWorkbench(): React.ReactElement {
  const aggregate = useAtomValue(reviewWorkspaceAggregateAtom)
  const extracted = useAtomValue(reviewWorkspaceExtractedObservationsAtom)
  const actions = useReviewWorkspaceActions()
  const [versionId, setVersionId] = React.useState('')
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([])
  const [supportsFact, setSupportsFact] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [message, setMessage] = React.useState('')

  const candidates = React.useMemo(() => extractedFacts(extracted), [extracted])
  const groups = React.useMemo(() => aggregate ? projectF06Evidence(aggregate, candidates) : [], [aggregate, candidates])
  const group = groups.find(item => item.document.versionId === versionId) ?? groups[0]
  const preview = aggregate && group ? previewF06Assignment(aggregate, {
    documentVersionId: group.document.versionId, subjectIds: selectedSubjects, supportsFact,
  }) : null

  const perform = async (operation: () => Promise<void>, success: string): Promise<void> => {
    setBusy(true)
    setMessage('')
    try { await operation(); setMessage(success) }
    catch (error) { setMessage(error instanceof Error ? error.message : String(error)) }
    finally { setBusy(false) }
  }

  if (!aggregate) return <p className="text-sm text-muted-foreground">打开案卷后可核对证明归属。</p>
  const subjects = aggregate.caseV2.subjects
  const titles = new Map(subjects.map(subject => [subject.id, subject.title]))
  const duplicateTitles = new Set(subjects.filter(subject =>
    subjects.some(other => other.id !== subject.id && other.title.trim() === subject.title.trim()))
    .map(subject => subject.id))
  const currentConfirmed = groups.reduce((count, item) => count + item.currentConfirmedCount, 0)

  const submitAssignment = async (): Promise<void> => {
    if (!group) return
    // 以 Main 中最新 revision 再预检一次，避免打开面板后原件换版或事项删除。
    const current = await window.reviewAPI.getAggregateV2(aggregate.caseV2.id)
    if (!current) throw new Error('案卷已不存在')
    const checked = previewF06Assignment(current, {
      documentVersionId: group.document.versionId, subjectIds: selectedSubjects, supportsFact,
    })
    if (checked.errors.length) throw new Error(checked.errors.join('；'))
    if (!checked.subjectIdsToCreate.length) throw new Error('所选关联已存在，无需重复提交')
    const result = await window.reviewAPI.setEvidenceLinkV2({
      caseId: current.caseV2.id,
      command: {
        requestId: `f06-evidence-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        target: { kind: 'case', id: current.caseV2.id },
        expectedRevision: current.caseV2.revision,
        actor: localReviewer,
        type: 'SetEvidenceLink',
        payload: {
          documentVersionId: checked.documentVersionId,
          subjectIds: checked.subjectIdsToCreate,
          supportsFact: checked.supportsFact,
          linkedBy: 'user',
        },
      },
    })
    if (!result?.ok) throw new Error(result?.message ?? '证明绑定失败')
    await actions.refresh()
    setSelectedSubjects([])
    setSupportsFact('')
  }

  return <section aria-label="F06 证明归属与复用核对" className="space-y-3 rounded-xl bg-muted/20 p-3 text-sm">
    <header className="space-y-1">
      <h3 className="font-semibold">证明归属与复用核对</h3>
      <p className="text-xs text-muted-foreground">全部证明版本 {groups.length} · 当前已确认关联 {currentConfirmed} · 未归属证明 {groups.filter(item => item.unassigned && item.document.active !== false).length}</p>
      <p className="text-xs text-muted-foreground">一证可支持多个人/事项，多证可支持同一事实；计分去重由业务规则决定。同名学生和文件名不会自动成为身份依据。</p>
    </header>
    {message && <p role="status" className="rounded-md bg-background p-2 text-xs">{message}</p>}
    <label className="block space-y-1 text-xs">选择原件版本
      <select className="w-full rounded-md bg-background p-2" value={group?.document.versionId ?? ''}
        onChange={event => { setVersionId(event.target.value); setSelectedSubjects([]); setSupportsFact(''); setMessage('') }}>
        {groups.map(item => <option key={item.document.versionId} value={item.document.versionId}>
          {item.document.fileName} · {item.document.versionId}{item.document.active === false ? '（旧版）' : ''}
        </option>)}
      </select>
    </label>
    {!group ? <p className="text-xs text-muted-foreground">本案尚无登记的证明文件。</p> : <div className="space-y-3">
      <div className="space-y-1 rounded-lg bg-background p-3 text-xs">
        <p>原件版本：<code>{group.document.versionId}</code> · 解析版本 {group.document.parseRevision} · {group.document.parseStatus}</p>
        {group.document.active === false && <p className="text-red-600">此为退役版本，仅能查看历史，不可新增当前关联。</p>}
        {!!group.sameContentVersionIds.length && <p className="text-amber-700 dark:text-amber-400">
          同内容原件版本：{group.sameContentVersionIds.join('、')}。只是内容哈希相同，不代表重复事项或应重复计分。
        </p>}
        {!!group.ambiguousSubjectIds.length && <p className="text-amber-700 dark:text-amber-400">
          归属需要逐人确认：{group.ambiguousSubjectIds.map(id => `${titles.get(id) ?? id}（${id}）`).join('、')}
        </p>}
        {group.unassigned && <p>此原件还没有当前有效关联或可定位的提取候选，请核对并选择主体。</p>}
      </div>
      <div className="space-y-2">
        <h4 className="text-xs font-medium">已有关联及候选</h4>
        {group.links.map(({ link, validity }) => <div key={link.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-background p-2 text-xs">
          <div className="min-w-0 break-words">
            <p>{titles.get(link.subjectId) ?? link.subjectId}（{link.subjectId}） · {link.supportsFact}</p>
            <p className="text-muted-foreground">{link.status} · {validity === 'current' ? '当前版本' : '非当前有效来源'} · {describeF06Location(link.blockRef)}</p>
          </div>
          {link.status === 'candidate' && validity === 'current' && <button type="button" disabled={busy}
            className="rounded-md bg-primary px-2 py-1 text-primary-foreground disabled:opacity-50"
            onClick={() => void perform(() => actions.transitionEvidenceLink({
              id: link.id, documentVersionId: link.documentVersionId, subjectId: link.subjectId,
              supportsFact: link.supportsFact, status: 'confirmed',
            }), '已人工确认该主体的候选关联')}>确认此人</button>}
          {link.status !== 'rejected' && <button type="button" disabled={busy}
            className="rounded-md border px-2 py-1 disabled:opacity-50"
            onClick={() => void perform(() => actions.transitionEvidenceLink({
              id: link.id, documentVersionId: link.documentVersionId, subjectId: link.subjectId,
              supportsFact: link.supportsFact, status: 'rejected',
            }), '关联已拒绝并保留历史')}>拒绝关联</button>}
        </div>)}
        {group.suggestions.map(suggestion => <button type="button"
          key={suggestion.subjectId + ':' + suggestion.supportsFact}
          disabled={busy || group.document.active === false}
          className="block w-full rounded-lg border border-amber-500/40 bg-amber-500/5 p-2 text-left text-xs disabled:opacity-50"
          onClick={() => { setSelectedSubjects([suggestion.subjectId]); setSupportsFact(suggestion.supportsFact) }}>
          提取候选 · {titles.get(suggestion.subjectId) ?? suggestion.subjectId}（{suggestion.subjectId}） · {suggestion.supportsFact}
          <span className="block text-muted-foreground">{describeF06Location(suggestion.sourceRef)} · 点击填入下方，仍需人工核对后提交</span>
        </button>)}
      </div>
      <div className="space-y-2 rounded-lg bg-background p-3 text-xs">
        <h4 className="font-medium">人工绑定：一个事实可对应多个明确选中的主体</h4>
        <p className="text-muted-foreground">保存原件版本与主体/事实关系，并记录人工选择的定位范围。</p>
        <div className="grid gap-1 sm:grid-cols-2">
          {subjects.map(subject => <label key={subject.id} className="flex items-start gap-2 rounded p-1">
            <input type="checkbox" className="mt-0.5" checked={selectedSubjects.includes(subject.id)}
              disabled={busy || group.document.active === false}
              onChange={event => setSelectedSubjects(previous => event.target.checked
                ? [...previous, subject.id] : previous.filter(id => id !== subject.id))} />
            <span>{subject.title} <span className="text-muted-foreground">（{subject.id}）</span>
              {duplicateTitles.has(subject.id) && <span className="ml-1 text-amber-700 dark:text-amber-400">同名，核对 ID</span>}</span>
          </label>)}
        </div>
        <label className="block space-y-1">支持的事实或字段
          <input className="w-full rounded-md border bg-background p-2" value={supportsFact}
            placeholder="例如：参加同一项活动" onChange={event => setSupportsFact(event.target.value)} />
        </label>
        {!!preview?.existing.length && <p className="text-muted-foreground">已存在 {preview.existing.length} 条相同关联，不再重复创建。</p>}
        {!!preview?.errors.length && selectedSubjects.length > 0 && <p className="text-amber-700 dark:text-amber-400">{preview.errors.join('；')}</p>}
        <button type="button" className="rounded-md bg-primary px-3 py-2 text-primary-foreground disabled:opacity-50"
          disabled={busy || !!preview?.errors.length || !preview?.subjectIdsToCreate.length}
          onClick={() => void perform(submitAssignment, '已通过同一案卷事务保存所选关联，旧 Run 需重新核对')}>
          人工核对并绑定 {preview?.subjectIdsToCreate.length ?? 0} 个主体
        </button>
      </div>
    </div>}
  </section>
}
