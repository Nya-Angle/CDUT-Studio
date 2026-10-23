import { useMemo, useState } from 'react'
import { Button } from '@profer/ui/primitives/button'
import { parseBatchManifest } from './review-v3-t06-batch-intake'
import { suggestT06PhysicalManifest } from './review-v3-t06-physical-manifest'
import {
  previewT06PhysicalImport, planT06PhysicalImport,
  type T06PhysicalSelection, type T06GroupChoice, type T06PhysicalCommitRequest, type T06CommitReceipt,
} from './review-v3-t06-physical-intake'
import {
  suggestT06ApplicantFromFolder, suggestT06GroupTemplate,
  t06RequiredCaseFields, t06RequiredSubmissionSlots,
  type T06PublishedTemplateOption,
} from './review-v3-t06-template-route'

/** To be bound by L to the native picker + trusted Main case/material/batch writer. */
export interface T06PhysicalMainApi {
  pickT06PhysicalSource(input: { sourceKind: 'folder' | 'zip' }): Promise<T06PhysicalSelection | null>
  commitT06PhysicalImport(input: T06PhysicalCommitRequest): Promise<T06CommitReceipt>
}

export function ReviewV3T06PhysicalImport({
  api, templateId, templateVersion, batchName, existingCases, templates, onCommitted,
}: {
  api?: T06PhysicalMainApi
  templateId?: string
  templateVersion?: number
  batchName: string
  existingCases: Array<{ caseId: string; title: string; templateId: string; templateVersion: number }>
  templates: T06PublishedTemplateOption[]
  onCommitted: (receipt: T06CommitReceipt) => void
}): JSX.Element {
  const [source, setSource] = useState<T06PhysicalSelection | null>(null)
  const [stripRoot, setStripRoot] = useState(false)
  const [rootAssignments, setRootAssignments] = useState<Record<string, string>>({})
  const [decisions, setDecisions] = useState<Record<string, T06GroupChoice>>({})
  const [requestId, setRequestId] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [manifestNote, setManifestNote] = useState('')
  const [receipt, setReceipt] = useState<T06CommitReceipt | null>(null)
  const [runNotice, setRunNotice] = useState('')
  const preview = useMemo(() => source ? previewT06PhysicalImport(source, {
    stripCommonRoot: stripRoot, rootFileGroups: rootAssignments,
  }) : null, [source, stripRoot, rootAssignments])
  const proposed = useMemo(() => Object.fromEntries((preview?.groups ?? []).map(group => [
    group.groupId, suggestT06GroupTemplate(group, templates),
  ])) as Record<string, T06PublishedTemplateOption | undefined>, [preview, templates])
  const selected = useMemo(() => Object.fromEntries((preview?.groups ?? []).map(group => [
    group.groupId, decisions[group.groupId] ?? (() => {
      // 只有目录名与持久化 caseId 完全一致才可自动绑定已有案卷。
      const existing = existingCases.find(item => item.caseId === group.name &&
        templates.some(template => template.templateId === item.templateId && template.version === item.templateVersion))
      if (existing) return { action: 'existing' as const, caseId: existing.caseId,
        templateId: existing.templateId, templateVersion: existing.templateVersion }
      return {
        action: 'create' as const, title: group.name,
        applicant: suggestT06ApplicantFromFolder(group.name) ?? '',
        ...(proposed[group.groupId] ? {
          templateId: proposed[group.groupId]!.templateId,
          templateVersion: proposed[group.groupId]!.version,
        } : templateId && templateVersion ? { templateId, templateVersion } : {}),
      }
    })(),
  ])) as Record<string, T06GroupChoice>, [preview, decisions, proposed, templateId, templateVersion, existingCases, templates])
  const plan = useMemo(() => preview && planT06PhysicalImport(preview, selected, {
    requestId, templateId, templateVersion, batchName,
    knownCaseIds: existingCases.map(x => x.caseId),
    knownCases: existingCases,
  }), [preview, selected, requestId, templateId, templateVersion, batchName, existingCases])

  async function pick(kind: 'folder' | 'zip'): Promise<void> {
    if (!api) return
    setPending(true); setError('')
    try {
      const next = await api.pickT06PhysicalSource({ sourceKind: kind })
      if (next) {
        setSource(next); setRequestId(crypto.randomUUID()); setReceipt(null)
        setDecisions({}); setRootAssignments({}); setStripRoot(kind === 'folder'); setManifestNote(''); setRunNotice('')
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)) }
    finally { setPending(false) }
  }
  async function importManifest(file: File | undefined): Promise<void> {
    if (!file || !preview || receipt) return
    try {
      const parsed = parseBatchManifest(await file.text(), file.name)
      if (parsed.errors.length) { setManifestNote(parsed.errors.join('；')); return }
      const match = suggestT06PhysicalManifest(preview, parsed.rows, existingCases.map(x => x.caseId))
      setDecisions(old => {
        const updated = { ...old }
        for (const [groupId, suggestion] of Object.entries(match.suggestions)) {
          if (suggestion.action === 'exclude') { updated[groupId] = suggestion; continue }
          const active = selected[groupId]
          const existingTemplate = suggestion.action === 'existing'
            ? existingCases.find(item => item.caseId === suggestion.caseId) : undefined
          updated[groupId] = {
            ...suggestion,
            templateId: existingTemplate?.templateId ?? (active?.action !== 'exclude' ? active?.templateId : undefined),
            templateVersion: existingTemplate?.templateVersion ?? (active?.action !== 'exclude' ? active?.templateVersion : undefined),
          }
        }
        return updated
      })
      setManifestNote('匹配建议 ' + Object.keys(match.suggestions).length + ' 组；未匹配 ' +
        match.unmatched.length + ' 组；重复编号 ' + match.ambiguous.length + ' 组。请在下面核对后提交。')
    } catch (cause) { setManifestNote(cause instanceof Error ? cause.message : String(cause)) }
  }
  function choose(groupId: string, value: T06GroupChoice): void {
    setDecisions(old => ({ ...old, [groupId]: value })); setReceipt(null)
  }
  async function commit(): Promise<void> {
    if (!api || !plan?.request || pending) return
    setPending(true); setError('')
    try {
      const result = await api.commitT06PhysicalImport(plan.request)
      setReceipt(result); onCommitted(result)
    } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)) }
    finally { setPending(false) }
  }
  async function executeCreatedBatches(): Promise<void> {
    const ids = receipt?.batches?.map(batch => batch.batchId) ?? (receipt?.batchId ? [receipt.batchId] : [])
    if (!ids.length || pending) return
    setPending(true); setRunNotice('')
    try {
      const results = await Promise.allSettled(ids.map(batchId => window.reviewAPI.runBatchV2(batchId)))
      const failures = results.flatMap((result, i) => result.status === 'rejected'
        ? [`${ids[i]}：${result.reason instanceof Error ? result.reason.message : String(result.reason)}`] : [])
      setRunNotice(`已执行 ${results.length - failures.length} / ${results.length} 个模板批次。${failures.length ? `失败：${failures.join('；')}` : '请到批次工作台查看逐案结果。'}`)
    } finally { setPending(false) }
  }
  function assignmentOf(choice: T06GroupChoice, entryId: string) {
    if (choice.action === 'exclude') return { entryId, role: 'evidence' as const }
    return choice.entryAssignments?.find(item => item.entryId === entryId) ?? { entryId, role: 'evidence' as const }
  }
  function updateAssignment(choice: T06GroupChoice, entryId: string, patch: { role?: string; materialSlotId?: string }): T06GroupChoice {
    if (choice.action === 'exclude') return choice
    const current = assignmentOf(choice, entryId)
    const next = { ...current, ...patch, entryId }
    if (!next.materialSlotId) delete (next as { materialSlotId?: string }).materialSlotId
    const rest = (choice.entryAssignments ?? []).filter(item => item.entryId !== entryId)
    return { ...choice, entryAssignments: [...rest, next] } as T06GroupChoice
  }
  function updateCaseField(choice: T06GroupChoice, key: string, value: string): T06GroupChoice {
    if (choice.action !== 'create') return choice
    return { ...choice, fieldValues: { ...(choice.fieldValues ?? {}), [key]: value } } as T06GroupChoice
  }
  return <section className="space-y-2 rounded-md border border-border bg-muted/20 p-3">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <p className="text-xs font-semibold">真实文件夹 / ZIP 分案入库</p>
        <p className="text-[11px] text-muted-foreground">直接选文件夹或 ZIP，按子目录分案；明确文件夹模板名称/编号将自动匹配，未知业务要人工确认。目录名为已有案卷编号时自动绑定。不同业务拆为各自可执行批次。</p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" type="button" variant="outline" disabled={!api || pending} onClick={() => void pick('folder')}>选择文件夹</Button>
        <Button size="sm" type="button" variant="outline" disabled={!api || pending} onClick={() => void pick('zip')}>选择 ZIP</Button>
      </div>
    </div>
    {!api && <p role="status" className="text-xs text-amber-700 dark:text-amber-300">
      待本地 Main 接通物理来源选择与持久化事务；当前按钮不会以清单绑定冒充原件入库。
    </p>}
    {preview && <>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={stripRoot} disabled={!!receipt} onChange={e => {
          setStripRoot(e.target.checked); setDecisions({}); setReceipt(null)
        }} />忽略全部原件共有的顶层目录
      </label>
      <label className="block text-[11px] text-muted-foreground">可选：导入 CSV/TSV 清单，根据唯一相同的申请编号/案卷编号预填写案卷身份（仅为建议，仍需人工确认）。
        <input type="file" disabled={!!receipt || pending} accept=".csv,.tsv" className="mt-1 block text-xs"
          onChange={e => { void importManifest(e.target.files?.[0]); e.currentTarget.value = '' }} />
      </label>
      {manifestNote && <p className="text-[11px] text-muted-foreground">{manifestNote}</p>}
      <p className="text-xs">{preview.source.entries.length} 份原件 · {preview.groups.length} 组 · 未归属 {preview.unassignedCount}</p>
      {preview.errors.map((e, i) => <p key={i} role="alert" className="text-xs text-destructive">{e}</p>)}
      {preview.source.warnings?.map((e, i) => <p key={'skip-' + i} role="status" className="text-xs text-amber-700 dark:text-amber-300">未导入原件：{e}</p>)}
      {!!preview.source.excluded?.length && <details className="text-[11px] text-muted-foreground">
        <summary>逐文件未入库清单（{preview.source.excluded.length}）</summary>
        <ul className="mt-1 max-h-32 overflow-y-auto">
          {preview.source.excluded.map((item, i) => <li key={i}>{item.relativePath}：{item.reason}</li>)}
        </ul>
      </details>}
      <div className="max-h-72 space-y-2 overflow-y-auto">
        {preview.groups.map(group => {
          const choice: T06GroupChoice = selected[group.groupId] ?? { action: 'create', title: group.name, applicant: '' }
          // 'exclude' 分支没有模板字段，统一用收窄后的读取，避免直接访问联合类型成员
          const choiceTemplateId = choice.action === 'exclude' ? undefined : choice.templateId
          const choiceTemplateVersion = choice.action === 'exclude' ? undefined : choice.templateVersion
          const caseTemplate = templates.find(t => t.templateId === choiceTemplateId && t.version === choiceTemplateVersion)
          const requiredFields = t06RequiredCaseFields(caseTemplate)
          const requiredSlots = t06RequiredSubmissionSlots(caseTemplate)
          const mappedSlots = new Set((choice.action === 'exclude' ? [] : choice.entryAssignments ?? [])
            .map(item => item.materialSlotId).filter((value): value is string => !!value))
          const missingRequiredSlots = requiredSlots.filter(slot => !mappedSlots.has(slot.id))
          const suggestion = proposed[group.groupId]
          return <div className="space-y-2 rounded border bg-background p-2" key={group.groupId}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium">{group.name} · {group.entries.length} 个文件</span>
              <select className="rounded border bg-background p-1 text-xs" value={choice.action} disabled={!!receipt}
                aria-label={group.name + ' 分案方式'} onChange={e => {
                  const action = e.target.value
                  choose(group.groupId, action === 'exclude' ? { action: 'exclude' } :
                    action === 'existing' ? { action: 'existing', caseId: '', templateId: choiceTemplateId, templateVersion: choiceTemplateVersion } :
                    { action: 'create', title: group.name, applicant: '', templateId: choiceTemplateId, templateVersion: choiceTemplateVersion })
                }}>
                <option value="create">新建案卷</option><option value="existing">绑定已有案卷</option><option value="exclude">排除</option>
              </select>
            </div>
            {choice.action !== 'exclude' && <label className="block text-[11px]">本案业务模板
              <select className="mt-1 w-full rounded border bg-background p-1.5 text-xs" aria-label={group.name + ' 业务模板'}
                value={caseTemplate ? `${caseTemplate.templateId}@${caseTemplate.version}` : ''}
                disabled={!!receipt} onChange={event => {
                  const key = event.target.value
                  const next = templates.find(item => `${item.templateId}@${item.version}` === key)
                  choose(group.groupId, { ...choice, templateId: next?.templateId, templateVersion: next?.version } as T06GroupChoice)
                }}>
                <option value="">未确定——请核对材料后选择</option>
                {templates.map(item => <option key={`${item.templateId}@${item.version}`}
                  value={`${item.templateId}@${item.version}`}>{item.name} · v{item.version}</option>)}
              </select>
              {suggestion && <span className="text-muted-foreground">文件名建议：{suggestion.name}（仅预匹配，请核对）</span>}
            </label>}
            {group.unassigned && <label className="block text-[11px] text-amber-700 dark:text-amber-300">
              根目录文件必须明确归属，填写案卷组：
              <input value={rootAssignments[group.entries[0]?.entryId ?? ''] ?? ''} disabled={!!receipt} className="mt-1 w-full rounded border bg-background p-1"
                onChange={e => setRootAssignments(old => ({ ...old, [group.entries[0]?.entryId ?? '']: e.target.value }))}/>
            </label>}
            {choice.action === 'create' && <div className="grid gap-2 sm:grid-cols-2">
              <input className="rounded border bg-background p-1.5 text-xs" aria-label={group.name + ' 标题'}
                value={choice.title} disabled={!!receipt} placeholder="案卷标题" onChange={e => choose(group.groupId, { ...choice, title: e.target.value })}/>
              <input className="rounded border bg-background p-1.5 text-xs" aria-label={group.name + ' 申请人'}
                value={choice.applicant} disabled={!!receipt} placeholder="申请人/组织（必须确认）" onChange={e => choose(group.groupId, { ...choice, applicant: e.target.value })}/>
            </div>}
            {choice.action === 'create' && requiredFields.length > 0 && <div className="space-y-1">
              <p className="text-[11px] font-medium">模板必填案卷字段（可先入库，提交审核前必须补齐）</p>
              {requiredFields.map(field => <label key={field.key} className="block text-[11px]">{field.label}
                {field.kind === 'enum' && field.options?.length
                  ? <select className="mt-1 w-full rounded border bg-background p-1" value={String(choice.fieldValues?.[field.key] ?? '')}
                      onChange={event => choose(group.groupId, updateCaseField(choice, field.key, event.target.value))}>
                      <option value="">未填写</option>
                      {field.options.map(option => <option key={option.value} value={option.value}>{option.label ?? option.value}</option>)}
                    </select>
                  : <input className="mt-1 w-full rounded border bg-background p-1"
                      type={field.kind === 'number' ? 'number' : field.kind === 'date' ? 'date' : 'text'}
                      value={String(choice.fieldValues?.[field.key] ?? '')}
                      onChange={event => choose(group.groupId, updateCaseField(choice, field.key, event.target.value))} />}
              </label>)}
            </div>}
            {choice.action !== 'exclude' && (caseTemplate?.materialSlots?.length ?? 0) > 0 && <div className="space-y-1">
              <p className="text-[11px] font-medium">原件归属（申请书/必交材料请选择角色与材料槽）</p>
              {missingRequiredSlots.length > 0 && <p className="text-[11px] text-amber-700 dark:text-amber-300">
                必交槽尚未绑定：{missingRequiredSlots.map(slot => slot.name).join('、')}；这批案卷可以保存，但提交审核会被明确阻断。
              </p>}
              <div className="max-h-40 space-y-1 overflow-y-auto">
                {group.entries.map(entry => {
                  const assignment = assignmentOf(choice, entry.entryId)
                  return <div className="flex flex-wrap items-center gap-1 text-[11px]" key={entry.entryId}>
                    <span className="min-w-0 flex-1 truncate" title={entry.relativePath}>{entry.relativePath}</span>
                    <select aria-label={entry.relativePath + ' 材料角色'} className="rounded border bg-background p-0.5"
                      value={assignment.role ?? 'evidence'} disabled={!!receipt}
                      onChange={event => choose(group.groupId, updateAssignment(choice, entry.entryId, { role: event.target.value }))}>
                      <option value="application">申请书</option>
                      <option value="evidence">证明材料</option>
                      <option value="rule">规则材料</option>
                      <option value="attachment">附件</option>
                    </select>
                    <select aria-label={entry.relativePath + ' 材料槽'} className="rounded border bg-background p-0.5"
                      value={assignment.materialSlotId ?? ''} disabled={!!receipt}
                      onChange={event => choose(group.groupId, updateAssignment(choice, entry.entryId, { materialSlotId: event.target.value || undefined }))}>
                      <option value="">不绑定材料槽</option>
                      {(caseTemplate?.materialSlots ?? []).map(slot => <option key={slot.id} value={slot.id}>{slot.name}</option>)}
                    </select>
                  </div>
                })}
              </div>
            </div>}
            {choice.action === 'existing' && <select className="w-full rounded border bg-background p-1.5 text-xs"
              value={choice.caseId} disabled={!!receipt} onChange={e => choose(group.groupId, { ...choice, caseId: e.target.value })}>
              <option value="">选择本模板版本的已有案卷</option>
              {existingCases.filter(item => item.templateId === choice.templateId && item.templateVersion === choice.templateVersion)
                .map(x => <option value={x.caseId} key={x.caseId}>{x.title} · {x.caseId}</option>)}
            </select>}
            <p className="truncate text-[11px] text-muted-foreground" title={group.entries.map(e => e.relativePath).join('\n')}>
              {group.entries.slice(0, 3).map(e => e.relativePath).join('；')}{group.entries.length > 3 ? '…' : ''}
            </p>
          </div>
        })}
      </div>
      {plan?.errors.map((e, i) => <p className="text-[11px] text-amber-700 dark:text-amber-300" key={i}>{e}</p>)}
      <Button type="button" size="sm" disabled={!api || !plan?.request || pending || !!receipt}
        onClick={() => void commit()}>{pending ? '处理真实原件中…' : '确认分案并创建审核批次'}</Button>
    </>}
    {receipt && <div role="status" className="space-y-1 text-xs">
      <p>完成 {receipt.cases.filter(x => x.status === 'done').length} 案；
        失败 {receipt.cases.filter(x => x.status === 'failed').length} 案。</p>
      {!!receipt.inventory?.excluded.length && <p className="text-muted-foreground">
        本次来源另有 {receipt.inventory.excluded.length} 个条目未入库（可在上方“逐文件未入库清单”核对）。
      </p>}
      {(receipt.batches?.length ?? 0) > 0
        ? receipt.batches!.map(batch => <p key={batch.batchId}>已创建 {batch.caseIds.length} 案批次：{batch.batchId}（{templates.find(item => item.templateId === batch.templateId && item.version === batch.templateVersion)?.name ?? batch.templateId}）</p>)
        : receipt.batchId ? <p>已创建批次：{receipt.batchId}</p> : <p>批次未创建：{receipt.batchError ?? '没有完整导入的案卷'}</p>}
      {!!(receipt.batchId || receipt.batches?.length) && <Button type="button" size="sm" disabled={pending}
        onClick={() => void executeCreatedBatches()}>{pending ? '正在执行审核…' : '开始审核全部已导入案卷'}</Button>}
      {runNotice && <p>{runNotice}</p>}
      {receipt.cases.some(x => x.status === 'failed') && <p className="text-amber-700 dark:text-amber-300">部分案卷可能已写入材料；请查看现存案卷再重新选取原件，避免把同一批次当作全新导入。</p>}
      {receipt.cases.filter(x => x.status === 'failed').map(x => <p key={x.groupId} className="text-destructive">
        {x.groupId}：{x.error}（已登记 {x.documents.length} 份，后续可恢复）</p>)}
      {receipt.cases.filter(x => x.warnings?.length).map(x => <div key={'warn-' + x.groupId} className="rounded border border-amber-300/60 bg-amber-50/40 p-2 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
        <p className="font-medium">案卷 {x.caseId ?? x.groupId} 已入库，但提交审核前还需补齐：</p>
        <ul className="mt-1 list-disc pl-4">{x.warnings!.map((warning, index) => <li key={index}>{warning}</li>)}</ul>
        <p className="mt-1 text-muted-foreground">到“案卷办理”打开该案卷，在“申报事项与分项”和案卷字段中补齐后再提交；材料不会丢失，也不会重复建案。</p>
      </div>)}
    </div>}
    {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
  </section>
}
