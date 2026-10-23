/**
 * 案卷原子与面板（审核命令的可操作入口）
 *
 * Jotai 状态：当前案卷聚合（按 caseId 缓存）+ 动作回调；组件只做展示与触发命令，
 * 不散落 IPC 调用（仓库四层约定）。U01 部分走通：seed 样例 → 创建案卷 → 改字段 → 重启保留。
 */

import { atom, useAtomValue, useStore, useSetAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Actor, CaseAggregateV2, FieldSpec, FieldValue, ReviewCommandResult, ReviewRunV2, TemplateVersion } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'
import { toast } from 'sonner'
import { RunResultPanel } from './RunResultPanel'
import { ObservationConfirmPanel } from './ObservationConfirmPanel'
import { ReviewAssignmentCard } from './ReviewAssignmentCard'
import { CaseTimelinePanel } from './CaseTimelinePanel'
import { ReviewV3T02CoverageSection } from './ReviewV3T02CoverageSection'
import { ReviewV3T03FactWorkbench } from './ReviewV3T03FactWorkbench'
import { ReviewV3TemplateRuleRun } from './ReviewV3TemplateRuleRun'
import { ReviewV3T05HumanWorkflow } from './ReviewV3T05HumanWorkflow'
import { ReviewV3T09OfflineSection } from './ReviewV3T09OfflineSection'
import { humanizeReviewError } from './review-error-text'
import { ReviewV3T05RunDecision } from './ReviewV3T05RunDecision'
import { MaterialDropZone } from './MaterialDropZone'
import { ReviewV3UnifiedRun } from './ReviewV3UnifiedRun'
import { ReviewV3T08ReportPanel } from './ReviewV3T08ReportPanel'

/** 当前案卷聚合 */
export const reviewV2AggregateAtom = atom<CaseAggregateV2 | null>(null)
export const reviewV2BusyAtom = atom(false)
export const reviewV2NoticeAtom = atom<string | null>(null)
/** 模板发布后通知 V2CasePanel 重载模板列表（面板常驻挂载，tab 切换不触发 effect） */
export const templatesRefreshAtom = atom(0)

const localActor: Actor = { actorId: 'local-user', actorSource: 'local', role: 'reviewer' }

interface CaseListEntry { caseId: string; title: string; stage: string; revision: number; templateId: string; templateVersion: number; updatedAt: string }
interface SubjectDraft { id: string; title: string; sectionId?: string; fieldValues: Record<string, string> }

function subjectId(sectionId = 'item'): string {
  return `item-${sectionId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function initialSubjectRows(template: TemplateVersion): SubjectDraft[] {
  const requiredSections = (template.sections ?? []).filter((section) => section.required)
  if (requiredSections.length > 0) {
    return requiredSections.map((section) => ({ id: subjectId(section.id), title: '', sectionId: section.id, fieldValues: {} }))
  }
  if ((template.sections ?? []).length > 0) return []
  return template.fields.some((field) => (field.scope ?? 'subject') === 'subject')
    ? [{ id: subjectId(), title: '', fieldValues: {} }]
    : []
}

function renderTemplateFieldInput(
  field: FieldSpec,
  value: string,
  onChange: (value: string) => void,
): JSX.Element {
  if (field.kind === 'boolean') {
    return <select className="flex-1 rounded border bg-background px-2 py-1 text-xs" value={value} onChange={(event) => onChange(event.target.value)}><option value="">请选择</option><option value="true">是</option><option value="false">否</option></select>
  }
  if (field.kind === 'enum' && field.options?.length) {
    return <select className="flex-1 rounded border bg-background px-2 py-1 text-xs" value={value} onChange={(event) => onChange(event.target.value)}><option value="">请选择</option>{field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
  }
  return <input className="flex-1 rounded border bg-background px-2 py-1 text-xs" type={field.kind === 'number' ? 'number' : field.kind === 'date' ? 'date' : 'text'} value={value} onChange={(event) => onChange(event.target.value)} />
}

function fieldValueToInput(value: FieldValue | undefined): string {
  if (!value) return ''
  switch (value.kind) {
    case 'multi': return value.value.join('，')
    case 'boolean': return value.value ? 'true' : 'false'
    case 'text':
    case 'date':
    case 'enum': return String(value.value ?? '')
    case 'number': return Number.isFinite(value.value) ? String(value.value) : ''
    default: return ''
  }
}

function rawValueForSpec(field: FieldSpec, text: string): unknown {
  if (field.kind === 'number') return Number(text)
  if (field.kind === 'boolean') return text === 'true'
  if (field.kind === 'multi') return text.split(/[,，;；]/).map((item) => item.trim()).filter(Boolean)
  return text
}

/**
 * 导入草稿补齐必需分项的唯一产品入口。
 *
 * T06 允许先入库后补录；这里让普通用户在当前案卷直接新增/编辑申报事项，
 * Main 用同一份已发布模板校验并在 V2 聚合里 CAS 落盘。补齐后同一案卷即可提交。
 */
function CaseSubjectEditor({ aggregate, template, onResult }: {
  aggregate: CaseAggregateV2
  template: TemplateVersion
  onResult: (result: ReviewCommandResult | undefined) => void
}): JSX.Element {
  const subjects = aggregate.caseV2.subjects
  const sections = template.sections ?? []
  const missingSections = sections.filter((section) => section.required && !subjects.some((subject) => subject.sectionId === section.id))
  const [drafts, setDrafts] = useState<Record<string, { title: string; fieldValues: Record<string, string> }>>({})
  const [newRows, setNewRows] = useState<Array<{ key: string; sectionId: string; title: string; fieldValues: Record<string, string> }>>([])
  const [busy, setBusy] = useState(false)
  const draftOf = (subjectId: string, subject: CaseAggregateV2['caseV2']['subjects'][number]) => drafts[subjectId] ?? {
    title: subject.title,
    fieldValues: Object.fromEntries(subjects.find((item) => item.id === subjectId)?.fields
      ? Object.entries(subject.fields).map(([key, value]) => [key, fieldValueToInput(value)])
      : []),
  }
  const specsFor = (sectionId?: string) => template.fields.filter((field) =>
    (field.scope ?? 'subject') === 'subject' && (!field.sectionId || field.sectionId === sectionId))
  async function save(subjectId: string | undefined, title: string, sectionId: string | undefined, values: Record<string, string>, specs: FieldSpec[]): Promise<void> {
    if (!title.trim() || busy) return
    setBusy(true)
    try {
      const fieldValues = Object.fromEntries(Object.entries(values)
        .filter(([key, value]) => value !== '' && value !== undefined && value !== null)
        .map(([key, value]) => {
          const spec = specs.find((item) => item.key === key)
          return [key, spec ? rawValueForSpec(spec, value) : value]
        }))
      const result = await window.reviewAPI.upsertCaseSubjectV2({
        caseId: aggregate.caseV2.id,
        command: {
          requestId: `subject-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          expectedRevision: aggregate.caseV2.revision,
          payload: { ...(subjectId ? { subjectId } : {}), title: title.trim(), ...(sectionId ? { sectionId } : {}), fieldValues },
        },
      }) as ReviewCommandResult | undefined
      if (result?.ok) {
        setNewRows((rows) => rows.filter((row) => row.title !== title || row.sectionId !== sectionId))
        setDrafts((current) => { const next = { ...current }; if (subjectId) delete next[subjectId]; return next })
      }
      onResult(result)
    } finally { setBusy(false) }
  }
  return <details className="rounded-md border border-amber-300/60 bg-amber-50/40 px-3 py-2 text-xs dark:bg-amber-950/20" open={missingSections.length > 0}>
    <summary className="cursor-pointer font-medium">申报事项与分项（补齐后即可提交）{missingSections.length > 0 ? ` · 还缺 ${missingSections.length} 个必需分项` : ''}</summary>
    <div className="mt-2 space-y-2">
      {missingSections.map((section) => {
        const specs = specsFor(section.id)
        const rowKey = `missing-${section.id}`
        return <div key={section.id} className="rounded bg-background p-2">
          <p className="font-medium text-amber-700 dark:text-amber-300">必需分项「{section.name}」还没有事项</p>
          <input className="mt-1 w-full rounded border px-2 py-1" placeholder="申报事项名称" value={newRows.find((row) => row.key === rowKey)?.title ?? ''}
            onChange={(event) => setNewRows((rows) => {
              const existing = rows.find((row) => row.key === rowKey)
              return existing
                ? rows.map((row) => row.key === rowKey ? { ...row, title: event.target.value } : row)
                : [...rows, { key: rowKey, sectionId: section.id, title: event.target.value, fieldValues: {} }]
            })} />
          {specs.map((field) => <label key={field.key} className="mt-1 flex items-center gap-2 text-[11px]">
            <span className="w-28 shrink-0">{field.label}{field.required ? ' *' : ''}</span>
            {renderTemplateFieldInput(field, newRows.find((row) => row.key === rowKey)?.fieldValues[field.key] ?? '',
              (value) => setNewRows((rows) => rows.map((row) => row.key === rowKey
                ? { ...row, fieldValues: { ...row.fieldValues, [field.key]: value } } : row)))}
          </label>)}
          <Button size="sm" variant="outline" className="mt-1" disabled={busy}
            onClick={() => {
              const row = newRows.find((item) => item.key === rowKey)
              void save(undefined, row?.title ?? '', section.id, row?.fieldValues ?? {}, specs)
            }}>补齐该分项</Button>
        </div>
      })}
      {subjects.map((subject) => {
        const draft = draftOf(subject.id, subject)
        const sectionName = sections.find((section) => section.id === subject.sectionId)?.name
        const specs = specsFor(subject.sectionId)
        return <div key={subject.id} className="rounded bg-background p-2">
          <p className="font-medium">{sectionName ? `${sectionName} · ` : ''}{subject.title}</p>
          <input className="mt-1 w-full rounded border px-2 py-1" value={draft.title}
            onChange={(event) => setDrafts((current) => ({ ...current, [subject.id]: { ...draft, title: event.target.value } }))} />
          {specs.map((field) => <label key={field.key} className="mt-1 flex items-center gap-2 text-[11px]">
            <span className="w-28 shrink-0">{field.label}{field.required ? ' *' : ''}</span>
            {renderTemplateFieldInput(field, draft.fieldValues[field.key] ?? '',
              (value) => setDrafts((current) => ({ ...current, [subject.id]: { ...draft, fieldValues: { ...draft.fieldValues, [field.key]: value } } })))}
          </label>)}
          <Button size="sm" variant="outline" className="mt-1" disabled={busy}
            onClick={() => void save(subject.id, draft.title, subject.sectionId, draft.fieldValues, specs)}>保存事项</Button>
        </div>
      })}
      {sections.length === 0 && <div className="rounded bg-background p-2">
        <p className="font-medium">新增申报事项</p>
        <input className="mt-1 w-full rounded border px-2 py-1" placeholder="申报事项名称"
          value={newRows.find((row) => row.key === 'free')?.title ?? ''}
          onChange={(event) => setNewRows((rows) => rows.some((row) => row.key === 'free')
            ? rows.map((row) => row.key === 'free' ? { ...row, title: event.target.value } : row)
            : [...rows, { key: 'free', sectionId: '', title: event.target.value, fieldValues: {} }])} />
        {specsFor(undefined).map((field) => <label key={field.key} className="mt-1 flex items-center gap-2 text-[11px]">
          <span className="w-28 shrink-0">{field.label}{field.required ? ' *' : ''}</span>
          {renderTemplateFieldInput(field, newRows.find((row) => row.key === 'free')?.fieldValues[field.key] ?? '',
            (value) => setNewRows((rows) => rows.map((row) => row.key === 'free'
              ? { ...row, fieldValues: { ...row.fieldValues, [field.key]: value } } : row)))}
        </label>)}
        <Button size="sm" variant="outline" className="mt-1" disabled={busy}
          onClick={() => {
            const row = newRows.find((item) => item.key === 'free')
            void save(undefined, row?.title ?? '', undefined, row?.fieldValues ?? {}, specsFor(undefined))
          }}>添加事项</Button>
      </div>}
    </div>
  </details>
}

/** 案卷面板：选择模板 → 创建案卷 → 登记材料 → 开始审核 */
export function V2CasePanel({ onCaseOpened }: { onCaseOpened?: (caseId: string) => void } = {}): JSX.Element {
  const store = useStore()
  const aggregate = useAtomValue(reviewV2AggregateAtom)
  const busy = useAtomValue(reviewV2BusyAtom)
  const setNotice = useSetAtom(reviewV2NoticeAtom)

  const [caseList, setCaseList] = useState<CaseListEntry[]>([])
  const [templates, setTemplates] = useState<TemplateVersion[]>([])
  const publishedTemplates = useMemo(() => {
    const latestByTemplate = new Map<string, TemplateVersion>()
    for (const template of [...templates].filter((item) => item.status === 'published').sort((a, b) => b.version - a.version)) {
      if (!latestByTemplate.has(template.templateId)) latestByTemplate.set(template.templateId, template)
    }
    return [...latestByTemplate.values()]
  }, [templates])
  const templatesRefresh = useAtomValue(templatesRefreshAtom)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateVersion | null>(null)
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [subjectRows, setSubjectRows] = useState<SubjectDraft[]>([])
  const [newTitle, setNewTitle] = useState('')


  const refreshList = useCallback(async (): Promise<void> => {
    try {
      setCaseList(await window.reviewAPI.listCasesV2())
    } catch (error) {
      console.error('[V2] 案卷列表加载失败', error)
    }
  }, [])
  useEffect(() => { void refreshList() }, [refreshList])

  const run = useCallback(async (action: () => Promise<void>): Promise<void> => {
    store.set(reviewV2BusyAtom, true)
    try {
      await action()
    } catch (error) {
      // 展示层翻译成可执行的一句话；未识别的错误保留原文，避免掩盖真实原因
      if (error instanceof Error) console.error('[审核] 操作失败原始错误:', error)
      const message = humanizeReviewError(error)
      setNotice(message)
      toast.error(`操作失败：${message}`)
    } finally {
      store.set(reviewV2BusyAtom, false)
    }
  }, [store, setNotice, toast])

  const applyResult = useCallback((result: ReviewCommandResult | undefined): void => {
    if (!result) return
    if (result.ok) {
      store.set(reviewV2AggregateAtom, result.aggregate)
      toast.success(`已保存：${result.receipt.summary}`)
    } else {
      // 冲突/校验错误如实呈现（不静默重试，07 §3.1）
      setNotice(`${result.code}: ${result.message}`)
      toast.error(`${result.code}：${result.message}`)
    }
  }, [store, setNotice, toast])

  // 快速连续打开 A、B 时，只允许最后一次显式选择落地；旧响应直接丢弃（UI-02）。
  const openCaseGeneration = useRef(0)
  const openCase = useCallback((caseId: string) => {
    const generation = ++openCaseGeneration.current
    return run(async () => {
      const loaded = await window.reviewAPI.openAggregateV2(caseId)
      if (generation !== openCaseGeneration.current) return
      if (!loaded || loaded.caseV2.id !== caseId) { toast.error(`案卷不存在: ${caseId}`); return }
      store.set(reviewV2AggregateAtom, loaded)
      onCaseOpened?.(caseId)
      toast.success(`已打开案卷：${loaded.caseV2.title}`)
    })
  }, [run, store, onCaseOpened])

  const loadTemplates = useCallback(async (): Promise<void> => {
    try {
      const all = await window.reviewAPI.listTemplateVersionsV2()
      setTemplates(all)
    } catch (error) {
      console.error('[V2] 模板列表加载失败', error)
    }
  }, [])
  useEffect(() => { void loadTemplates() }, [loadTemplates, templatesRefresh])

  const createFromTemplate = useCallback(() => run(async () => {
    if (!selectedTemplate) { toast.error('请先选择已发布模板'); return }
    if (!newTitle.trim()) { toast.error('请填写案卷标题'); return }
    const caseId = `case-${Date.now().toString(36)}`
    // 只提交用户真正填写的事项：模板没有事项级字段时列表里仍有一个空白行，
    // 直接提交会被「申报事项名称不能为空」拒绝，导致整类案例无法建案。
    const filledSubjectRows = subjectRows.filter((subject) => subject.title.trim()
      || Object.values(subject.fieldValues).some((value) => String(value ?? '').trim()))
    const subjects = filledSubjectRows.map((subject) => ({
      ...subject,
      type: 'item' as const,
      fieldValues: Object.fromEntries(Object.entries(subject.fieldValues).map(([key, value]) => {
        const spec = selectedTemplate.fields.find((field) => field.key === key)
        return [key, spec?.kind === 'number' && value !== '' ? Number(value) : spec?.kind === 'boolean' ? value === 'true' : value]
      })),
    }))
    await window.reviewAPI.createCaseV2({
      caseId,
      templateId: selectedTemplate.templateId,
      version: selectedTemplate.version,
      payload: {
        title: newTitle.trim(),
        fieldValues: Object.fromEntries(Object.entries(fieldValues).map(([key, value]) => {
          const spec = selectedTemplate.fields.find((field) => field.key === key)
          return [key, spec?.kind === 'number' && value !== '' ? Number(value) : spec?.kind === 'boolean' ? value === 'true' : value]
        })),
        subjects,
      },
      actor: localActor,
    })
    const aggregate = await window.reviewAPI.getAggregateV2(caseId)
    store.set(reviewV2AggregateAtom, aggregate ?? null)
    if (aggregate) onCaseOpened?.(caseId)
    await refreshList()
    setNewTitle(''); setFieldValues({}); setSubjectRows([])
    toast.success(`案卷已创建：${caseId}（${selectedTemplate.name}）`)
  }), [selectedTemplate, newTitle, fieldValues, subjectRows, run, store, refreshList, onCaseOpened])
  const seedAndCreate = useCallback(() => run(async () => {
    await window.reviewAPI.seedFixtureV2()
    const caseId = `v2-demo-${Date.now().toString(36)}`
    const result = await window.reviewAPI.createCaseV2({
      caseId,
      templateId: 'comprehensive-assessment-v2',
      version: 2,
      payload: {
        title: '示例审核任务（综合测评）',
        fieldValues: { studentName: '张三', studentId: '20260101', academicYear: '2025-2026', applicant: '张三' },
        subjects: [{ id: 's1', title: '省级竞赛一等奖', type: 'item', fieldValues: { category: 'competition', level: 'national-1', declaredScore: 8, activityDate: '2026-09-01', eventId: 'E1' } }],
      },
      actor: localActor,
    })
    const aggregate = await window.reviewAPI.getAggregateV2(caseId)
    store.set(reviewV2AggregateAtom, aggregate ?? null)
    if (aggregate) onCaseOpened?.(caseId)
    await refreshList()
    if (result) toast.success(`审核任务已创建：${caseId}`)
  }), [run, store, toast, refreshList, onCaseOpened])

  const current = aggregate

  // ===== T05 可信阶段端口（CR-T05-04）=====
  // 渲染层只声明角色；actor、Run 与规则准备度全部由 Main 重核。
  const [localStageRole, setLocalStageRole] = useState<'reviewer' | 'teacher'>('reviewer')
  const [stageCapability, setStageCapability] = useState<{
    mode: 'local-business'; actorLabel: string; actorRole: 'reviewer' | 'teacher'
    eligibleTaskIds: string[]; hasCurrentRun: boolean
  } | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    const caseId = current?.caseV2.id
    if (!caseId) { setStageCapability(undefined); return }
    void window.reviewAPI.getT05StageCapability({ caseId, claim: { role: localStageRole } })
      .then((value) => { if (!cancelled) setStageCapability(value) })
      // 技术预审与 CanonicalPlan 案卷按设计不可办理业务阶段：不展示能力，也不伪造
      .catch(() => { if (!cancelled) setStageCapability(undefined) })
    return () => { cancelled = true }
  }, [current?.caseV2.id, current?.caseV2.revision, localStageRole])

  const recordTrustedStageDecision = useCallback(async (input: {
    caseId: string; templateId: string; version: number; expectedRevision: number
    taskId: string; action: string; reason: string
    supplementRequiredElements?: string[]; supplementReason?: string
  }) => {
    try {
      const result = await window.reviewAPI.recordT05StageDecision({
        ...input,
        requestId: `t05-stage-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        claim: { role: localStageRole },
      })
      // 写入后重新读取案卷：回执与聚合都以唯一权威状态为准，不用前端拼接
      const refreshed = await window.reviewAPI.getAggregateV2(input.caseId)
      if (!refreshed) return undefined
      store.set(reviewV2AggregateAtom, refreshed)
      const receipt = refreshed.receiptLog.at(-1)
      if (!receipt) return undefined
      return { ok: true as const, receipt, aggregate: refreshed, entity: { ...result } }
    } catch (cause) {
      // 可信 Main 的拒绝原因原样回传，界面不得改写成「已完成」
      return {
        ok: false as const,
        code: 'INVALID_TRANSITION' as const,
        message: cause instanceof Error ? cause.message : String(cause),
      }
    }
  }, [localStageRole, store])


  const [slotId, setSlotId] = useState('')
  const [runNonce, setRunNonce] = useState(0)
  const [latestRun, setLatestRun] = useState<ReviewRunV2 | null>(null)
  const [latestRunStale, setLatestRunStale] = useState(true)
  useEffect(() => {
    const caseId = current?.caseV2.id
    if (!caseId) { setLatestRun(null); setLatestRunStale(true); return }
    let active = true
    void (async () => {
      const runs = await window.reviewAPI.listRunsV2(caseId)
      // 当前 Run 只从持久账本取得，不凭渲染端的运行按钮猜测状态。
      const newest = [...runs].sort((a,b) => b.startedAt.localeCompare(a.startedAt))[0] ?? null
      if (!active) return
      setLatestRun(newest)
      if (!newest || newest.status === 'running' || newest.status === 'queued') { setLatestRunStale(true); return }
      try {
        const stale = await window.reviewAPI.getWorkspaceRunValidityV2({caseId,runId:newest.id})
        if (active) setLatestRunStale(stale)
      } catch {
        if (active) setLatestRunStale(true)
      }
    })().catch(() => { if (active) {setLatestRun(null);setLatestRunStale(true)} })
    return () => { active = false }
  }, [current?.caseV2.id, current?.caseV2.revision, runNonce])
  const refreshCurrentRun = useCallback(async (): Promise<void> => {
    const caseId = current?.caseV2.id
    if (!caseId) return
    const fresh = await window.reviewAPI.getAggregateV2(caseId)
    if (fresh && fresh.caseV2.id === caseId) store.set(reviewV2AggregateAtom, fresh)
    setRunNonce((nonce) => nonce + 1)
  }, [current?.caseV2.id, store])
  const currentTemplate = templates.find((template) => template.templateId === current?.caseV2.templateId && template.version === current?.caseV2.templateVersion)
  // 模板只有一个材料槽时自动选中：普通用户不该先学会「选槽位」才能上传材料。
  // 案卷或模板版本变化时必须重算，不能把上一案的 slotId 带到新案（UI-12）。
  const slotScopeKey = current ? `${current.caseV2.id}@${current.caseV2.templateId}@${current.caseV2.templateVersion}` : ''
  const slotScopeRef = useRef(slotScopeKey)
  useEffect(() => {
    const slots = currentTemplate?.materialSlots ?? []
    if (slotScopeRef.current !== slotScopeKey) {
      slotScopeRef.current = slotScopeKey
      setSlotId(slots.length === 1 ? slots[0]!.id : '')
      return
    }
    if (slots.length === 1 && !slotId) setSlotId(slots[0]!.id)
    if (slots.length > 1 && slotId && !slots.some((slot) => slot.id === slotId)) setSlotId('')
  }, [slotScopeKey, currentTemplate?.materialSlots, slotId])

  const selectTemplate = (templateKey: string): void => {
    const [templateId, versionText] = templateKey.split('@')
    const version = Number(versionText)
    const template = templates.find((candidate) => candidate.templateId === templateId && candidate.version === version && candidate.status === 'published') ?? null
    setSelectedTemplate(template)
    setFieldValues({})
    setSubjectRows(template ? initialSubjectRows(template) : [])
  }

  const updateSubject = (id: string, update: (subject: SubjectDraft) => SubjectDraft): void => {
    setSubjectRows((subjects) => subjects.map((subject) => subject.id === id ? update(subject) : subject))
  }

  const submitCase = useCallback(() => run(async () => {
    if (!current) return
    const result = await window.reviewAPI.submitCaseV2(current.caseV2.id)
    if (result && !result.ok) { toast.error(result.message ?? '提交失败'); return }
    const loaded = await window.reviewAPI.openAggregateV2(current.caseV2.id)
    if (loaded) store.set(reviewV2AggregateAtom, loaded)
    await refreshList()
    toast.success('案卷已提交，进入审核')
  }), [current, run, store, refreshList])
  const updateTitle = useCallback(() => {
    if (!current) return
    return run(async () => {
      const result = await window.reviewAPI.updateFieldsV2({
        caseId: current.caseV2.id,
        command: {
          requestId: `upd-${Date.now().toString(36)}`,
          target: { kind: 'case', id: current.caseV2.id },
          expectedRevision: current.caseV2.revision,
          actor: localActor,
          type: 'UpdateFields',
          payload: { caseFieldValues: { studentName: `张三-${Math.floor(Math.random() * 90) + 10}` } },
        },
      })
      applyResult(result)
    })
  }, [current, run, applyResult])

  return (
    <div className="mx-3 mb-3 rounded-xl border bg-card p-3 shadow-sm">
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold">案卷办理</p>
      {current && <p className="mb-3 rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        当前案卷：<span className="font-medium text-foreground">{current.caseV2.title}</span>
        {' · '}{current.caseV2.documents.filter((item) => item.active !== false).length} 份原件
        {' · '}{current.caseV2.stage === 'decided' ? '已形成业务决定' : '当前阶段：' + current.caseV2.stage}
      </p>}
      <details open={!current} className="mb-3 rounded-md border border-border/60 px-3 py-2">
        <summary className="cursor-pointer text-xs font-medium">打开其他案卷 / 从已发布模板新建</summary>
        <div className="mt-3">
      <div className="mb-2 space-y-1.5 rounded-lg border-t pt-2">
        <p className="text-xs font-medium text-muted-foreground">从模板新建审核任务</p>
        <select className="w-full rounded-md border bg-background px-2 py-1 text-xs" value={selectedTemplate ? `${selectedTemplate.templateId}@${selectedTemplate.version}` : ''} onChange={(event) => selectTemplate(event.target.value)}>
          <option value="">选择已发布模板…</option>
          {publishedTemplates.map((template) => (
            <option key={`${template.templateId}@${template.version}`} value={`${template.templateId}@${template.version}`}>{template.name} v{template.version}</option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">当前有 {publishedTemplates.length} 套已发布模板可创建案卷；草稿和参考范本需先在模板库配置并发布。</p>
        {selectedTemplate && (
          <>
            <input className="w-full rounded-md border bg-background px-2 py-1 text-xs" placeholder="案卷标题" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} />
            {selectedTemplate.fields.filter((field) => (field.scope ?? 'subject') === 'case').map((field) => (
              <div key={field.key} className="flex items-center gap-1.5">
                <span className="w-28 shrink-0 truncate text-xs">{field.label}{field.required ? ' *' : ''}</span>
                {renderTemplateFieldInput(field, fieldValues[field.key] ?? '', (value) => setFieldValues({ ...fieldValues, [field.key]: value }))}
              </div>
            ))}
            {(selectedTemplate.sections ?? []).map((section) => {
              const rows = subjectRows.filter((subject) => subject.sectionId === section.id)
              const specs = selectedTemplate.fields.filter((field) => (field.scope ?? 'subject') === 'subject' && (!field.sectionId || field.sectionId === section.id))
              return (
                <div key={section.id} className="space-y-2 rounded-lg border bg-muted/20 p-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium">{section.order + 1}. {section.name}{section.required ? ' · 必需分项' : ''}</p>
                      {section.description && <p className="mt-0.5 text-xs text-muted-foreground">{section.description}</p>}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setSubjectRows((current) => [...current, { id: subjectId(section.id), title: '', sectionId: section.id, fieldValues: {} }])}>添加事项</Button>
                  </div>
                  {section.criteria.length > 0 && <details className="text-xs text-muted-foreground"><summary className="cursor-pointer">本分项审核标准（{section.criteria.length}）</summary><ol className="mt-1 list-decimal space-y-1 pl-5">{section.criteria.map((criterion) => <li key={criterion.id}><span className="font-medium">{criterion.title}</span>：{criterion.requirement}</li>)}</ol></details>}
                  {rows.length === 0 && <p className="rounded bg-background px-2 py-2 text-xs text-muted-foreground">此分项暂未添加申报事项{section.required ? '（创建案卷前需要添加）' : ''}。</p>}
                  {rows.map((subject) => (
                    <div key={subject.id} className="space-y-1.5 rounded-md bg-background p-2">
                      <div className="flex items-center gap-2">
                        <input className="flex-1 rounded border px-2 py-1 text-xs" placeholder="申报事项名称" value={subject.title} onChange={(event) => updateSubject(subject.id, (current) => ({ ...current, title: event.target.value }))} />
                        <Button size="sm" variant="ghost" onClick={() => setSubjectRows((current) => current.filter((item) => item.id !== subject.id))}>删除事项</Button>
                      </div>
                      {specs.map((field) => (
                        <div key={field.key} className="flex items-center gap-2">
                          <span className="w-28 shrink-0 truncate text-xs">{field.label}{field.required ? ' *' : ''}</span>
                          {renderTemplateFieldInput(field, subject.fieldValues[field.key] ?? '', (value) => updateSubject(subject.id, (current) => ({ ...current, fieldValues: { ...current.fieldValues, [field.key]: value } })))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )
            })}
            {(selectedTemplate.sections ?? []).length === 0 && selectedTemplate.fields.some((field) => (field.scope ?? 'subject') === 'subject') && (
              <div className="space-y-2 rounded-lg border bg-muted/20 p-2">
                <p className="text-xs font-medium">申报事项</p>
                {subjectRows.map((subject) => (
                  <div key={subject.id} className="space-y-1.5 rounded-md bg-background p-2">
                    <div className="flex items-center gap-2"><input className="flex-1 rounded border px-2 py-1 text-xs" placeholder="事项名称" value={subject.title} onChange={(event) => updateSubject(subject.id, (current) => ({ ...current, title: event.target.value }))} /><Button size="sm" variant="ghost" onClick={() => setSubjectRows((current) => current.filter((item) => item.id !== subject.id))}>删除</Button></div>
                    {selectedTemplate.fields.filter((field) => (field.scope ?? 'subject') === 'subject').map((field) => (
                      <div key={field.key} className="flex items-center gap-2">
                        <span className="w-28 shrink-0 text-xs">{field.label}{field.required ? ' *' : ''}</span>
                        {renderTemplateFieldInput(field, subject.fieldValues[field.key] ?? '', (value) => updateSubject(subject.id, (current) => ({ ...current, fieldValues: { ...current.fieldValues, [field.key]: value } })))}
                      </div>
                    ))}
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => setSubjectRows((current) => [...current, { id: subjectId(), title: '', fieldValues: {} }])}>添加事项</Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">保存后可在案卷材料区分别选择共用材料或分项材料槽；整份案卷只需启动一次审核。</p>
            <Button size="sm" disabled={!newTitle.trim() || store.get(reviewV2BusyAtom)} onClick={() => void createFromTemplate()}>创建一份案卷</Button>
          </>
        )}
      </div>
      {caseList.length > 0 && (
        <div className="mb-2 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">已保存案卷（重启可恢复）</p>
          {caseList.map((entry: CaseListEntry) => (
            <div key={entry.caseId} className="flex items-center justify-between gap-2 rounded-md border px-2 py-1">
              <span className="truncate text-xs">{entry.title} · {entry.stage}</span>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => void openCase(entry.caseId)}>打开</Button>
            </div>
          ))}
        </div>
      )}
        </div>
      </details>
      <div className="space-y-2">
        {!current && (
          <Button size="sm" disabled={store.get(reviewV2BusyAtom)} onClick={seedAndCreate}>
            载入示例并创建审核任务
          </Button>
        )}
        {current && (
          <div className="space-y-1.5 text-xs">
            {currentTemplate?.materialSlots.length && (
              <div className="flex items-center gap-1.5">
                <span className="shrink-0 text-muted-foreground">材料槽：</span>
                <select className="rounded border bg-background px-1 py-0.5" value={slotId} onChange={(event) => setSlotId(event.target.value)}>
                  <option value="">未指定</option>
                  {currentTemplate.materialSlots.map((slot) => {
                    const sectionName = currentTemplate.sections?.find((section) => section.id === slot.sectionId)?.name
                    return <option key={slot.id} value={slot.id}>{sectionName ? `${sectionName} · ` : ''}{slot.name}</option>
                  })}
                </select>
              </div>
            )}
            {current.caseV2.documents.length > 0 && (
              <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                {current.caseV2.documents.map((doc) => (
                  <li key={doc.versionId}>{doc.fileName} · {doc.versionId.slice(-8)}{doc.active === false ? '（旧版）' : ''}{doc.materialSlotId ? ` · ${currentTemplate?.materialSlots.find((slot) => slot.id === doc.materialSlotId)?.name ?? doc.materialSlotId}` : ''}</li>
                ))}
              </ul>
            )}
            <MaterialDropZone
              caseId={current.caseV2.id}
              slotId={slotId}
              hasSlots={!!currentTemplate?.materialSlots?.length}
              slotLabel={currentTemplate?.materialSlots.find((slot) => slot.id === slotId)?.name}
              onRegistered={() => run(async () => {
                const loaded = await window.reviewAPI.openAggregateV2(current.caseV2.id)
                if (loaded) store.set(reviewV2AggregateAtom, loaded)
                await refreshList()
              })}
            />
            <div className="flex flex-wrap gap-1.5">
              {(current.caseV2.stage === 'draft' || (current.caseV2.stage === 'submitted' && current.tasks.length === 0)) && (
                <Button size="sm" onClick={submitCase}>{current.caseV2.stage === 'draft' ? '提交案卷' : '恢复审核任务'}</Button>
              )}
            </div>
            <ReviewV3UnifiedRun
              caseId={current.caseV2.id}
              stage={current.caseV2.stage}
              documentCount={current.caseV2.documents.filter((document) => document.active !== false).length}
              technicalPlan={!!current.d2RuntimePlan}
              onUpdated={refreshCurrentRun}
            />
            {latestRun && <details className="rounded-md border border-border/60 px-3 py-2">
              <summary className="cursor-pointer text-xs font-semibold">查看与导出本案审核报告</summary>
              <ReviewV3T08ReportPanel aggregate={current} currentRun={latestRun} currentStale={latestRunStale} template={currentTemplate ?? null} />
            </details>}
            <ReviewV3T05HumanWorkflow
              aggregate={current}
              onResult={applyResult}
              stageCapability={stageCapability}
              recordTrustedStageDecision={recordTrustedStageDecision}
              submitAppeal={(input) => window.reviewAPI.submitLocalF13Appeal(input)}
              reviewAppeal={(input) => window.reviewAPI.reviewLocalF13Appeal(input)}
              withdrawAppeal={(input) => window.reviewAPI.withdrawLocalF13Appeal(input)}
            />
            <ReviewV3T05RunDecision aggregate={current} onResult={applyResult} />
            <RunResultPanel caseId={current.caseV2.id} refreshNonce={runNonce} />
            <ObservationConfirmPanel caseId={current.caseV2.id} aggregate={current} onResult={applyResult} refreshNonce={runNonce} />
            <details className="rounded-md border border-border/60 px-3 py-2 text-xs">
              <summary className="cursor-pointer font-medium">高级：仅执行模板规则（不启动 AI）</summary>
              <ReviewV3TemplateRuleRun caseId={current.caseV2.id} />
            </details>
            {/* T09 离线任务包：签发 / 预览 / 幂等导入 */}
            <ReviewV3T09OfflineSection />
            {/* T02 材料来源覆盖（只读暂存预览，不产生原件） */}
            <ReviewV3T02CoverageSection caseId={current.caseV2.id} />
            {/* T03 事实确认与证据多对多：与观察项面板同一案卷上下文 */}
            <ReviewV3T03FactWorkbench />
            <ReviewAssignmentCard caseId={current.caseV2.id} />
            <CaseTimelinePanel caseId={current.caseV2.id} refreshNonce={runNonce} />
            <p className="font-medium">{current.caseV2.title}</p>
            {current.caseV2.stage === 'draft' && currentTemplate && (
              <CaseSubjectEditor aggregate={current} template={currentTemplate} onResult={applyResult} />
            )}
            {current.caseV2.subjects.length > 0 && (
              <div className="rounded-md bg-muted/30 p-2">
                <p className="mb-1 font-medium">本案卷申报事项（{current.caseV2.subjects.length}）</p>
                <ul className="space-y-1">{current.caseV2.subjects.map((subject) => {
                  const sectionName = currentTemplate?.sections?.find((section) => section.id === subject.sectionId)?.name
                  return <li key={subject.id} className="flex justify-between gap-2"><span className="truncate">{sectionName ? `${sectionName} · ` : ''}{subject.title}</span><span className="shrink-0 text-muted-foreground">{subject.status}</span></li>
                })}</ul>
              </div>
            )}
            <p className="text-muted-foreground">
              阶段 {current.caseV2.stage} · 已记录操作 {current.receiptLog.length} 条
            </p>
            {(currentTemplate?.fields.some((field) => field.key === 'studentName') || Object.prototype.hasOwnProperty.call(current.caseV2.caseFields, 'studentName')) && (
            <div className="flex items-center gap-1.5">
              <input key={current.caseV2.id} id="v2-student-name" className="h-7 w-32 rounded-md border bg-background px-2 text-xs" placeholder="学生姓名" defaultValue={String((current.caseV2.caseFields.studentName as { value?: string })?.value ?? '')} />
              <Button size="sm" variant="outline" onClick={() => {
                const input = document.getElementById('v2-student-name') as HTMLInputElement | null
                if (!input?.value) return
                void run(async () => {
                  const result = await window.reviewAPI.updateFieldsV2({
                    caseId: current.caseV2.id,
                    command: {
                      requestId: `upd-${Date.now().toString(36)}`,
                      target: { kind: 'case', id: current.caseV2.id },
                      expectedRevision: current.caseV2.revision,
                      actor: localActor,
                      type: 'UpdateFields',
                      payload: { caseFieldValues: { studentName: input.value } },
                    },
                  })
                  applyResult(result)
                })
              }}>保存姓名</Button>
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
