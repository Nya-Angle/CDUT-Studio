/** 审核模板库与编辑器：案卷字段、材料槽、综测分项、审核标准与流程均可在界面配置。 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { FieldSpec, MaterialSlotSpec, RubricSpec, TemplateCriterionSpec, TemplateSectionSpec, TemplateVersion, WorkflowStageSpec } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'
import { toast } from 'sonner'
import { useAtomValue, useSetAtom } from 'jotai'
import { templatesRefreshAtom, reviewV2BusyAtom } from './V2CasePanel'
import { useStore } from 'jotai'
import { reviewWorkspaceSectionAtom } from '@/atoms/review-atoms'
import { T01_SCENARIOS, createT01Scenario, type T01ScenarioId } from './review-v3-t01-business-presets'
import { ReviewV3T01TrialPanel } from './ReviewV3T01TrialPanel'
import { ReviewV3T01AuthoringLaunchpad } from './ReviewV3T01AuthoringLaunchpad'
import { ReviewV3T01ConditionEditor } from './ReviewV3T01ConditionEditor'
import { ReviewV3T01NumberRuleEditor } from './ReviewV3T01NumberRuleEditor'
import { readT01NumberLimit, reconcileT01OwnerConfirmations, validateT01TypedCriteria, type T01CriterionWithConstraint } from './review-v3-t01-typed-criteria'
import { exportT01Template, importT01Template } from './review-v3-t01-template-portability'
import { copyT01TemplateConfiguration, forkT01TemplateVersion } from './review-v3-t01-versioning'

type EditableFieldKind = 'text' | 'number' | 'date' | 'boolean' | 'enum'
type TemplateLibraryFilter = 'all' | 'published' | 'reference' | 'drafts'
const FIELD_KINDS: Array<{ value: EditableFieldKind; label: string }> = [
  { value: 'text', label: '文本' }, { value: 'number', label: '数字' }, { value: 'date', label: '日期' },
  { value: 'boolean', label: '是/否' }, { value: 'enum', label: '单选' },
]
const STAGE_KINDS: Array<{ value: WorkflowStageSpec['kind']; label: string }> = [
  { value: 'auto-check', label: '自动核对' }, { value: 'manual-review', label: '人工审核' },
  { value: 'independent-rating', label: '独立评分' }, { value: 'supplement-wait', label: '等待补件' },
  { value: 'summary', label: '汇总' }, { value: 'finalize', label: '定稿' }, { value: 'handoff', label: '交接' },
]
const ROLE_OPTIONS: Array<{ value: WorkflowStageSpec['executorRole']; label: string }> = [
  { value: 'system', label: '系统/Agent' }, { value: 'reviewer', label: '审核员' }, { value: 'teacher', label: '教师' },
  { value: 'judge', label: '评委' }, { value: 'organizer', label: '负责人' },
]
const MATERIAL_KINDS: Array<{ value: MaterialSlotSpec['acceptedKinds'][number]; label: string }> = [
  { value: 'pdf', label: 'PDF' }, { value: 'image', label: '图片' }, { value: 'office', label: 'Word/演示' },
  { value: 'sheet', label: '表格' }, { value: 'text', label: '文本' },
]
const OUTPUT_KINDS: Array<{ value: TemplateVersion['outputs'][number]['kind']; label: string }> = [
  { value: 'approval', label: '审批结果' }, { value: 'item-feedback', label: '事项反馈' },
  { value: 'supplement-list', label: '补件清单' }, { value: 'score-sheet', label: '评分表' },
  { value: 'roster', label: '汇总名单' }, { value: 'rating-matrix', label: '评审评分矩阵' },
]
const OUTPUT_AUDIENCES: Array<{ value: TemplateVersion['outputs'][number]['audience']; label: string }> = [
  { value: 'student', label: '学生/申请人' }, { value: 'reviewer', label: '审核员' },
  { value: 'teacher', label: '教师' }, { value: 'judge', label: '评委' },
  { value: 'organizer', label: '组织者' }, { value: 'template-owner', label: '模板负责人' },
]

function generatedId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function newStage(name: string, kind: WorkflowStageSpec['kind'], role: WorkflowStageSpec['executorRole']): WorkflowStageSpec {
  return { id: generatedId('stage'), name, kind, executorRole: role }
}

function newTemplate(kind: 'blank' | 'comprehensive'): TemplateVersion {
  const isComprehensive = kind === 'comprehensive'
  const sections: TemplateSectionSpec[] = isComprehensive
    ? ['综测分项一', '综测分项二', '综测分项三'].map((name, index) => ({
      id: `section-${index + 1}`, name, description: '请按本单位、本年度实际综测要求修改分项名称和审核标准。', order: index, required: true, criteria: [],
    }))
    : []
  const fields: FieldSpec[] = isComprehensive
    ? [
      { key: 'studentName', label: '学生姓名', kind: 'text', required: true, visibility: 'public', scope: 'case' },
      { key: 'studentId', label: '学号', kind: 'text', required: true, visibility: 'public', scope: 'case' },
      { key: 'academicYear', label: '综测学年', kind: 'text', required: true, visibility: 'public', scope: 'case' },
      { key: 'category', label: '申报类别', kind: 'text', required: false, visibility: 'public', scope: 'subject' },
      { key: 'level', label: '申报等级', kind: 'text', required: false, visibility: 'public', scope: 'subject' },
      { key: 'declaredScore', label: '申报分数', kind: 'number', required: false, visibility: 'public', scope: 'subject' },
    ]
    : [{ key: 'applicantName', label: '申请人', kind: 'text', required: true, visibility: 'public', scope: 'case' }]
  const slots: MaterialSlotSpec[] = isComprehensive
    ? [
      { id: 'application-form', name: '综测申报汇总表', purpose: '读取本次综测申报信息', requiredElements: ['姓名', '学号', '申报事项'], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text'], minCount: 1, maxCount: 10, requiredAt: 'submission', allowReuseAcrossSubjects: true },
      ...sections.map((section) => ({ id: `${section.id}-proof`, name: `${section.name}证明材料`, purpose: `核对${section.name}的申报事项`, requiredElements: ['申报事项', '证明内容'], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text'] as MaterialSlotSpec['acceptedKinds'], minCount: 1, maxCount: 20, requiredAt: 'submission' as const, allowReuseAcrossSubjects: false, sectionId: section.id })),
    ]
    : [{ id: 'main-document', name: '主要材料', purpose: '本次申请依据材料', requiredElements: [], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text'], minCount: 1, maxCount: 10, requiredAt: 'submission', allowReuseAcrossSubjects: false }]
  const stages = [
    newStage('材料与标准核对', 'auto-check', 'system'),
    newStage('初审', 'manual-review', 'reviewer'),
    newStage('终审', 'manual-review', 'teacher'),
  ]
  return {
    templateId: `review-${generatedId(isComprehensive ? 'comprehensive' : 'template')}`,
    version: 1, schemaVersion: 2, name: isComprehensive ? '学生综合测评（待配置）' : '新审核模板',
    description: isComprehensive ? '新建的综测结构草稿，请填写本校当年审核标准后发布。' : '请根据实际业务添加审核分项、材料和流程。',
    catalogKind: 'custom',
    objectType: 'person', displayName: { template: isComprehensive ? '{{studentName}}' : '{{applicantName}}' },
    fields, materialSlots: slots, ...(sections.length > 0 ? { sections } : {}),
    policyVersionIds: [], stages, outputs: [{ id: 'approval', kind: 'approval', audience: 'teacher' }],
    status: 'draft', createdAt: new Date().toISOString(),
  }
}

function reordered<T>(items: T[], index: number, offset: -1 | 1): T[] {
  const target = index + offset
  if (target < 0 || target >= items.length) return items
  const next = [...items]
  ;[next[index], next[target]] = [next[target]!, next[index]!]
  return next
}

function normalizeOrder(sections: TemplateSectionSpec[]): TemplateSectionSpec[] {
  return sections.map((section, order) => ({ ...section, order }))
}

function validateEditor(template: TemplateVersion, forPublish = false): string[] {
  const issues: string[] = []
  if (!template.name.trim()) issues.push('请填写模板名称')
  for (const [label, values] of [['关键词',template.keywords],['别名',template.aliases]] as const) {
    if (values && (values.length > 100 || values.some(value =>
      typeof value !== 'string' || !value.trim() || value.length > 100))) {
      issues.push('模板' + label + '需为非空短词，每类最多100项且每项不超过100字符')
    }
    if (values && values.every(value=>typeof value==='string'&&Boolean(value.trim())) &&
        new Set(values.map(value=>value.trim().normalize('NFKC').toLocaleLowerCase())).size !== values.length) {
      issues.push('模板' + label + '不能重复')
    }
  }
  const keys = template.fields.map((field) => field.key.trim())
  if (keys.some((key) => !key)) issues.push('字段编号不能为空')
  if (new Set(keys).size !== keys.length) issues.push('字段编号不能重复')
  if (template.sections?.some((section) => !section.id.trim() || !section.name.trim())) issues.push('每个分项都需要编号和名称')
  if (template.sections?.some((section) => section.required && section.criteria.length === 0)) issues.push('每个必需分项至少需要一条审核标准')
  if (template.sections?.some((section) => section.criteria.some((criterion) => !criterion.title.trim() || !criterion.requirement.trim()))) issues.push('审核标准的名称和具体要求不能为空')
  if (template.materialSlots.some((slot) => !slot.id.trim() || !slot.name.trim())) issues.push('材料槽编号和名称不能为空')
  if (template.stages.length === 0) issues.push('至少保留一个审核流程节点')
  if (forPublish) issues.push(...validateT01TypedCriteria(template))
  return issues
}

function linkedStages(stages: WorkflowStageSpec[]): WorkflowStageSpec[] {
  return stages.map((stage, index) => ({ ...stage, nextStageId: stages[index + 1]?.id }))
}

export function TemplateWizardPanel(): JSX.Element {
  const bumpTemplatesRefresh = useSetAtom(templatesRefreshAtom)
  const setWorkspaceSection = useSetAtom(reviewWorkspaceSectionAtom)
  const refreshSignal = useAtomValue(templatesRefreshAtom)
  const store = useStore()
  const [templates, setTemplates] = useState<TemplateVersion[]>([])
  const [templateVersions, setTemplateVersions] = useState<TemplateVersion[]>([])
  const [archivedTemplates, setArchivedTemplates] = useState<TemplateVersion[]>([])
  const [editing, setEditing] = useState<TemplateVersion | null>(null)
  const [message, setMessage] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [libraryFilter, setLibraryFilter] = useState<TemplateLibraryFilter>('all')
  const [scenarioChoice,setScenarioChoice]=useState<T01ScenarioId>('laboratory')
  const importPicker=useRef<HTMLInputElement|null>(null)

  const refreshTemplates = useCallback(async (): Promise<void> => {
    try {
      const [latest, versions, archived] = await Promise.all([
        window.reviewAPI.listTemplatesV2(),
        window.reviewAPI.listTemplateVersionsV2(),
        window.reviewAPI.listArchivedTemplatesV2(),
      ])
      setTemplates(latest)
      setTemplateVersions(versions)
      setArchivedTemplates(archived)
    }
    catch (error) { toast.error(`模板列表加载失败：${error instanceof Error ? error.message : String(error)}`) }
  }, [])
  useEffect(() => { void refreshTemplates() }, [refreshTemplates, refreshSignal])

  const startNew = (kind: 'blank' | 'comprehensive'): void => {
    setEditing(newTemplate(kind))
    setMessage([])
  }

  const startScenario = (): void => {
    const next=createT01Scenario(scenarioChoice,generatedId('t01-scenario'),new Date().toISOString())
    setEditing(next)
    setMessage([])
  }

  const importConfiguration = async (file:File):Promise<void> => {
    try {
      if(file.size>2_000_000)throw Error('配置文件超过2MB')
      const template=importT01Template(await file.text(),generatedId('t01-import'),new Date().toISOString())
      setEditing(template)
      setMessage([])
      toast.success('已导入可编辑草稿，确认依据后保存/发布')
    } catch(error) {toast.error('导入失败：'+(error instanceof Error?error.message:String(error)))}
  }
  const exportConfiguration = ():void => {
    if(!editing)return
    const blob=new Blob([exportT01Template(editing)],{type:'application/json;charset=utf-8'})
    const url=URL.createObjectURL(blob)
    const a=document.createElement('a')
    a.href=url
    a.download=editing.templateId+'.template.json'
    a.click()
    setTimeout(()=>URL.revokeObjectURL(url),1000)
  }

  const openTemplate = (template: TemplateVersion): void => {
    const nextVersion = Math.max(0, ...templateVersions.filter((candidate) => candidate.templateId === template.templateId).map((candidate) => candidate.version)) + 1
    setEditing(template.status === 'draft' ? template : forkT01TemplateVersion(template, nextVersion, new Date().toISOString()))
    setMessage([])
  }

  const copyReferenceTemplate = async (template: TemplateVersion): Promise<void> => {
    const copy = copyT01TemplateConfiguration(template, generatedId('custom-review'), new Date().toISOString())
    setLoading(true)
    store.set(reviewV2BusyAtom, true)
    try {
      const saved = await window.reviewAPI.saveTemplateDraftV2(copy)
      setEditing(saved)
      await refreshTemplates()
      bumpTemplatesRefresh(Date.now())
      setMessage([])
      toast.success(`已复制「${template.name}」，请按实际制度配置后发布`)
    } catch (error) {
      toast.error(`复制范本失败：${error instanceof Error ? error.message : String(error)}`)
    } finally {
      store.set(reviewV2BusyAtom, false)
      setLoading(false)
    }
  }

  const updateTemplate = (update: (current: TemplateVersion) => TemplateVersion): void => {
    setEditing((current) => current ? reconcileT01OwnerConfirmations(current, update(current)) : current)
    setMessage([])
  }

  const updateCriterion = (sectionIndex: number, criterionIndex: number, update: (criterion: TemplateCriterionSpec) => TemplateCriterionSpec): void => {
    updateTemplate((current) => ({ ...current, sections: (current.sections ?? []).map((section, i) => i === sectionIndex ? { ...section, criteria: section.criteria.map((criterion, j) => j === criterionIndex ? update(criterion) : criterion) } : section) }))
  }

  const saveDraft = async (): Promise<TemplateVersion | null> => {
    if (!editing) return null
    const problems = validateEditor(editing)
    if (problems.some((problem) => problem !== '每个必需分项至少需要一条审核标准')) {
      setMessage(problems)
      return null
    }
    setLoading(true)
    store.set(reviewV2BusyAtom, true)
    try {
      const saved = await window.reviewAPI.saveTemplateDraftV2({ ...editing, stages: linkedStages(editing.stages) })
      setEditing(saved)
      await refreshTemplates()
      bumpTemplatesRefresh(Date.now())
      toast.success(`草稿已保存：${saved.name} v${saved.version}`)
      return saved
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setMessage([errorMessage])
      toast.error(`保存失败：${errorMessage}`)
      return null
    } finally {
      store.set(reviewV2BusyAtom, false)
      setLoading(false)
    }
  }

  const publish = async (): Promise<void> => {
    if (!editing) return
    const problems = validateEditor(editing, true)
    if (problems.length > 0) { setMessage(problems); return }
    setLoading(true)
    store.set(reviewV2BusyAtom, true)
    try {
      await window.reviewAPI.saveTemplateDraftV2({ ...editing, stages: linkedStages(editing.stages) })
      const published = await window.reviewAPI.publishTemplateV2(editing.templateId, editing.version)
      setEditing(null)
      setMessage([])
      await refreshTemplates()
      bumpTemplatesRefresh(Date.now())
      toast.success(`模板已发布：${published.name} v${published.version}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setMessage([errorMessage])
      toast.error(`发布失败：${errorMessage}`)
    } finally {
      store.set(reviewV2BusyAtom, false)
      setLoading(false)
    }
  }

  const moveSection = (index: number, offset: -1 | 1): void => updateTemplate((current) => ({ ...current, sections: normalizeOrder(reordered(current.sections ?? [], index, offset)) }))
  const moveField = (index: number, offset: -1 | 1): void => updateTemplate((current) => ({ ...current, fields: reordered(current.fields, index, offset) }))
  const moveMaterialSlot = (index: number, offset: -1 | 1): void => updateTemplate((current) => ({ ...current, materialSlots: reordered(current.materialSlots, index, offset) }))

  const moveTemplate = async (index: number, offset: -1 | 1): Promise<void> => {
    const next = reordered(templates, index, offset)
    try { setTemplates(await window.reviewAPI.reorderTemplatesV2(next.map((template) => template.templateId))) }
    catch (error) { toast.error(`模板排序失败：${error instanceof Error ? error.message : String(error)}`) }
  }

  const publishedById = new Map<string, TemplateVersion>()
  for (const version of templateVersions) {
    if (version.status !== 'published') continue
    const current = publishedById.get(version.templateId)
    if (!current || current.version < version.version) publishedById.set(version.templateId, version)
  }
  const libraryCounts = {
    all: templates.length,
    published: publishedById.size,
    reference: templates.filter((template) => template.catalogKind === 'reference' && template.status === 'draft').length,
    drafts: templates.filter((template) => template.status === 'draft' && template.catalogKind !== 'reference').length,
  }
  const visibleTemplates = templates.flatMap((template) => {
    if (libraryFilter === 'published') {
      const published = publishedById.get(template.templateId)
      return published ? [published] : []
    }
    if (libraryFilter === 'reference') return template.catalogKind === 'reference' ? [template] : []
    if (libraryFilter === 'drafts') return template.status === 'draft' && template.catalogKind !== 'reference' ? [template] : []
    return [template]
  })

  const removeTemplate = async (template: TemplateVersion): Promise<void> => {
    const confirmed = window.confirm(`删除「${template.name}」？\n模板会从模板库隐藏，历史案卷仍可读取原版本，之后可以恢复。`)
    if (!confirmed) return
    try {
      await window.reviewAPI.removeTemplateFromLibraryV2(template.templateId)
      if (editing?.templateId === template.templateId) setEditing(null)
      await refreshTemplates()
      bumpTemplatesRefresh(Date.now())
      toast.success(`已删除模板：${template.name}`)
    } catch (error) { toast.error(`删除失败：${error instanceof Error ? error.message : String(error)}`) }
  }

  const restoreTemplate = async (template: TemplateVersion): Promise<void> => {
    try {
      await window.reviewAPI.restoreTemplateToLibraryV2(template.templateId)
      await refreshTemplates()
      bumpTemplatesRefresh(Date.now())
      toast.success(`已恢复模板：${template.name}`)
    } catch (error) { toast.error(`恢复失败：${error instanceof Error ? error.message : String(error)}`) }
  }

  return (
    <div className="mx-3 mb-4 space-y-3">
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">审核模板</h2>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">模板只有发布后才会出现在辅助审核的“本案审核模板”中。参考范本先复制并按本单位制度确认，再发布为可载入模板。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => startNew('blank')}>新建空白模板</Button>
            <label className="flex items-center gap-1 text-xs">
              <span>从模拟业务起草</span>
              <select aria-label="选择模拟业务" className="rounded border bg-background px-2 py-1.5 text-xs" value={scenarioChoice} onChange={event=>setScenarioChoice(event.target.value as T01ScenarioId)}>
                {T01_SCENARIOS.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
            <Button size="sm" variant="outline" onClick={startScenario}>创建可编辑示例草稿</Button>
            <input ref={importPicker} type="file" accept=".json,application/json" className="hidden" aria-label="导入模板配置文件"
              onChange={event=>{const file=event.target.files?.[0];if(file)void importConfiguration(file);event.target.value=''}} />
            <Button size="sm" variant="ghost" onClick={()=>importPicker.current?.click()}>导入模板配置</Button>
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-primary/15 bg-primary/[0.035] px-3 py-2 text-xs leading-5 text-muted-foreground">
          新增的七种模拟场景（含实验室无评分双级审核）只生成可编辑草稿，不自动认定学校制度，也不自行安装到原生 V3 Case。当前有 <span className="font-medium text-foreground">{libraryCounts.published} 套可载入</span>、
          <span className="font-medium text-foreground">{libraryCounts.reference + libraryCounts.drafts} 套待配置</span>。
          草稿不会直接进入审核，避免未确认的示例标准被当成本校正式规则。
        </div>
        <ReviewV3T01AuthoringLaunchpad
          onDraft={(draft) => { setEditing(draft); setMessage([]) }}
          // 真实模型端口：渠道与凭据在 Main，界面拿到的是模型原始文本与实际模型标识
          modelDraftInvoke={async (prompt) => {
            const result = await window.reviewAPI.requestT01ModelDraft(prompt)
            return result.raw
          }}
        />
        <div className="mt-3 flex flex-wrap gap-1" role="tablist" aria-label="模板库分类">
          {([
            ['all', `全部模板（${libraryCounts.all}）`],
            ['published', `可载入（${libraryCounts.published}）`],
            ['reference', `参考范本（${libraryCounts.reference}）`],
            ['drafts', `内置/自建草稿（${libraryCounts.drafts}）`],
          ] as Array<[TemplateLibraryFilter, string]>).map(([filter, label]) => (
            <Button key={filter} size="sm" variant={libraryFilter === filter ? 'secondary' : 'ghost'} role="tab" aria-selected={libraryFilter === filter} onClick={() => setLibraryFilter(filter)}>{label}</Button>
          ))}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTemplates.map((template, index) => (
            <div key={template.templateId} className="rounded-lg bg-muted/40 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{template.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{libraryFilter === 'published' ? '已发布' : '最新'} v{template.version} · {template.sections?.length ?? 0} 个分项 · {template.fields.length} 个字段</p>
                </div>
                <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-xs">{template.status === 'published' ? '已发布 · 可载入' : template.status === 'deprecated' ? '已停用' : '草稿 · 待配置'}</span>
              </div>
              {template.description && <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{template.description}</p>}
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="rounded-full bg-background px-2 py-0.5 text-xs">{template.catalogKind === 'builtin' ? '内置' : template.catalogKind === 'reference' ? '参考范本' : '自建'}</span>
                <div className="flex flex-wrap justify-end gap-1">
                  {libraryFilter === 'all' && <>
                    <Button size="sm" variant="ghost" aria-label="模板上移" disabled={index === 0} onClick={() => void moveTemplate(index, -1)}>↑</Button>
                    <Button size="sm" variant="ghost" aria-label="模板下移" disabled={index === visibleTemplates.length - 1} onClick={() => void moveTemplate(index, 1)}>↓</Button>
                  </>}
                  {template.status === 'published'
                    ? <Button size="sm" variant="outline" onClick={() => setWorkspaceSection('case-v2')}>去新建审核项目</Button>
                    : template.catalogKind === 'reference'
                      ? <Button size="sm" variant="outline" disabled={loading} onClick={() => void copyReferenceTemplate(template)}>复制并配置</Button>
                      : <Button size="sm" variant="outline" onClick={() => openTemplate(template)}>{template.status === 'draft' ? '继续配置' : '基于此版本修改'}</Button>}
                  {template.status === 'published' && <Button size="sm" variant="ghost" onClick={() => openTemplate(template)}>修改</Button>}
                  <Button size="sm" variant="ghost" onClick={() => void removeTemplate(template)}>删除</Button>
                </div>
              </div>
              {template.status !== 'published' && <p className="mt-2 text-xs leading-4 text-muted-foreground">配置本单位、本年度规则并发布后，才可载入辅助审核。</p>}
              {template.sourceNote && <details className="mt-2 text-xs text-muted-foreground"><summary className="cursor-pointer">参考来源</summary><p className="mt-1">{template.sourceNote}</p></details>}
              {templateVersions.filter(version => version.templateId === template.templateId).length > 1 && (
                <details className="mt-2 text-xs text-muted-foreground">
                  <summary className="cursor-pointer">版本历史（发布版可追溯）</summary>
                  <div className="mt-2 space-y-1">
                    {templateVersions.filter(version => version.templateId === template.templateId)
                      .sort((a, b) => b.version - a.version).map(version => (
                        <div key={version.version} className="flex items-center justify-between gap-2 rounded bg-background p-1.5">
                          <span>v{version.version} · {version.status === 'published' ? '已发布且不可覆盖' : version.status === 'draft' ? '草稿' : '已停用'}</span>
                          <Button size="sm" variant="ghost" onClick={() => openTemplate(version)}>
                            {version.status === 'draft' ? '继续编辑' : '从此版派生'}
                          </Button>
                        </div>
                      ))}
                  </div>
                </details>
              )}
            </div>
          ))}
          {visibleTemplates.length === 0 && <p className="text-sm text-muted-foreground">此分类下暂无模板。</p>}
        </div>
        {archivedTemplates.length > 0 && (
          <details className="mt-3 rounded-lg bg-muted/30 p-3">
            <summary className="cursor-pointer text-sm font-medium">已删除模板（{archivedTemplates.length}，历史案卷仍可读取）</summary>
            <div className="mt-2 space-y-2">
              {archivedTemplates.map((template) => <div key={template.templateId} className="flex items-center justify-between gap-3 rounded-md bg-background p-2 text-sm"><span>{template.name} · v{template.version}</span><Button size="sm" variant="outline" onClick={() => void restoreTemplate(template)}>恢复</Button></div>)}
            </div>
          </details>
        )}
      </div>

      {editing && (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">{editing.status === 'draft' ? '编辑草稿' : '已发布模板'}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{editing.templateId} · v{editing.version}{editing.status !== 'draft' ? ' · 正在编辑新草稿' : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={exportConfiguration}>导出配置</Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>关闭</Button>
            </div>
          </div>

          {editing.sections?.some((section) => section.name.startsWith('综测分项')) && (
            <p className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">分项名称只是可编辑起点。请依据本校、本年度实际制度填写审核标准；模板不会替你编造综测政策。</p>
          )}

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="text-xs">模板名称
              <input className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm" value={editing.name} onChange={(event) => updateTemplate((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label className="text-xs">审核对象
              <select className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm" value={editing.objectType} onChange={(event) => updateTemplate((current) => ({ ...current, objectType: event.target.value as TemplateVersion['objectType'] }))}>
                <option value="person">个人</option><option value="organization">组织</option><option value="project">项目</option><option value="document">文件</option><option value="transaction">交易</option><option value="custom">自定义</option>
              </select>
            </label>
            <label className="text-xs md:col-span-2">案卷展示名模板
              <input className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm" value={editing.displayName.template}
                onChange={event=>updateTemplate(current=>({...current,displayName:{template:event.target.value}}))} placeholder="{{organization}} · {{activityName}}" />
            </label>
            <label className="text-xs md:col-span-2">模板用途说明
              <textarea className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm" rows={2} value={editing.description ?? ''} onChange={(event) => updateTemplate((current) => ({ ...current, description: event.target.value }))} placeholder="说明适用对象、流程范围和需要负责人确认的规则边界" />
            </label>
            <label className="text-xs md:col-span-2">业务关键词（每行一个，也可用逗号分隔）
              <textarea className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm" rows={2}
                value={(editing.keywords ?? []).join('\n')}
                onChange={event=>updateTemplate(current=>({...current,keywords:[...new Set(event.target.value.split(/[\n,，、;]/).map(value=>value.trim()).filter(Boolean))]}))}
                placeholder="例如：学籍更正、身份信息修改、信息纠错" />
            </label>
            <label className="text-xs md:col-span-2">业务别名 / 常见简称（每行一个，也可用逗号分隔）
              <textarea className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm" rows={2}
                value={(editing.aliases ?? []).join('\n')}
                onChange={event=>updateTemplate(current=>({...current,aliases:[...new Set(event.target.value.split(/[\n,，、;]/).map(value=>value.trim()).filter(Boolean))]}))}
                placeholder="例如：软著、部门邮箱、校卡" />
            </label>
          </div>
          {editing.sourceNote && <p className="mt-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">参考来源与边界：{editing.sourceNote}</p>}
          {editing.catalogKind === 'custom' && editing.sourceNote && <p className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">这是从参考范本复制的草稿。发布前请用本单位、本年度正式依据核对或改写每条审核标准；范本内容不能直接视为校内政策。</p>}

          <details open className="mt-4 rounded-lg bg-muted/30 p-3">
            <summary className="cursor-pointer text-sm font-medium">案卷与申报字段（{editing.fields.length}）</summary>
            <p className="mb-2 mt-2 text-xs text-muted-foreground">案卷字段每份案卷填写一次；申报字段随每个分项事项填写。</p>
            <div className="space-y-2">
              {editing.fields.map((field, index) => (
                <div key={`${field.key}-${index}`} className="grid gap-2 rounded-md bg-background p-2 sm:grid-cols-[1fr_1fr_110px_125px_auto] sm:items-center">
                  <input aria-label="字段编号" className="min-w-0 rounded border px-2 py-1 text-xs" placeholder="字段编号，如 studentId" value={field.key} onChange={(event) => updateTemplate((current) => ({ ...current, fields: current.fields.map((item, i) => i === index ? { ...item, key: event.target.value.trim() } : item) }))} />
                  <input aria-label="字段名称" className="min-w-0 rounded border px-2 py-1 text-xs" placeholder="显示名称" value={field.label} onChange={(event) => updateTemplate((current) => ({ ...current, fields: current.fields.map((item, i) => i === index ? { ...item, label: event.target.value } : item) }))} />
                  <select aria-label="字段类型" className="rounded border bg-background px-2 py-1 text-xs" value={field.kind} onChange={(event) => updateTemplate((current) => ({ ...current, fields: current.fields.map((item, i) => i === index ? { ...item, kind: event.target.value as FieldSpec['kind'], options: event.target.value === 'enum' ? item.options ?? [] : undefined } : item) }))}>
                    {FIELD_KINDS.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}
                  </select>
                  <select aria-label="字段归属" className="rounded border bg-background px-2 py-1 text-xs" value={`${field.scope ?? 'subject'}:${field.sectionId ?? ''}`} onChange={(event) => {
                    const [scope, sectionId] = event.target.value.split(':')
                    updateTemplate((current) => ({ ...current, fields: current.fields.map((item, i) => i === index ? { ...item, scope: scope as FieldSpec['scope'], sectionId: sectionId || undefined } : item) }))
                  }}>
                    <option value="case:">整份案卷</option>
                    <option value="subject:">所有分项事项</option>
                    {(editing.sections ?? []).map((section) => <option key={section.id} value={`subject:${section.id}`}>{section.name}事项</option>)}
                  </select>
                  <div className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-1 whitespace-nowrap text-xs"><input type="checkbox" checked={field.required} onChange={(event) => updateTemplate((current) => ({ ...current, fields: current.fields.map((item, i) => i === index ? { ...item, required: event.target.checked } : item) }))} />必填</label>
                    <Button size="sm" variant="ghost" aria-label="字段上移" disabled={index === 0} onClick={() => moveField(index, -1)}>↑</Button>
                    <Button size="sm" variant="ghost" aria-label="字段下移" disabled={index === editing.fields.length - 1} onClick={() => moveField(index, 1)}>↓</Button>
                    <Button size="sm" variant="ghost" onClick={() => updateTemplate((current) => ({ ...current, fields: current.fields.filter((_, i) => i !== index) }))}>删除</Button>
                  </div>
                  {field.kind === 'enum' && <input className="sm:col-span-5 rounded border px-2 py-1 text-xs" placeholder="选项，以中文逗号分隔" value={(field.options ?? []).map((option) => option.label).join('，')} onChange={(event) => {
                    const options = event.target.value.split(/[，,]/).map((label) => label.trim()).filter(Boolean).map((label) => ({ value: label, label }))
                    updateTemplate((current) => ({ ...current, fields: current.fields.map((item, i) => i === index ? { ...item, options } : item) }))
                  }} />}
                  {field.kind === 'number' && <div className="grid gap-2 sm:col-span-5 sm:grid-cols-3">
                    <input className="rounded border px-2 py-1 text-xs" placeholder="单位，如 分/小时/元" value={field.unit ?? ''} onChange={(event) => updateTemplate((current) => ({ ...current, fields: current.fields.map((item, i) => i === index ? { ...item, unit: event.target.value || undefined } : item) }))} />
                    <input type="number" className="rounded border px-2 py-1 text-xs" placeholder="最小值（可选）" value={field.min ?? ''} onChange={(event) => updateTemplate((current) => ({ ...current, fields: current.fields.map((item, i) => i === index ? { ...item, min: event.target.value === '' ? undefined : Number(event.target.value) } : item) }))} />
                    <input type="number" className="rounded border px-2 py-1 text-xs" placeholder="最大值（可选）" value={field.max ?? ''} onChange={(event) => updateTemplate((current) => ({ ...current, fields: current.fields.map((item, i) => i === index ? { ...item, max: event.target.value === '' ? undefined : Number(event.target.value) } : item) }))} />
                  </div>}
                  <div className="sm:col-span-5 rounded border border-border/60 p-2">
                    <ReviewV3T01ConditionEditor label="条件必填" value={field.conditionRequired}
                      fields={editing.fields.filter(candidate=>candidate.key!==field.key&&candidate.scope==='case')}
                      onChange={condition=>updateTemplate(current=>({...current,fields:current.fields.map((item,i)=>i===index?{...item,required:condition?false:item.required,conditionRequired:condition}:item)}))}/>
                  </div>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => updateTemplate((current) => ({ ...current, fields: [...current.fields, { key: `field${current.fields.length + 1}`, label: '', kind: 'text', required: false, visibility: 'public', scope: current.sections?.length ? 'subject' : 'case' }] }))}>添加字段</Button>
          </details>

          <details open className="mt-3 rounded-lg bg-muted/30 p-3">
            <summary className="cursor-pointer text-sm font-medium">审核分项与标准（{editing.sections?.length ?? 0}）</summary>
            <p className="mb-2 mt-2 text-xs text-muted-foreground">分项和标准都可调整顺序。每条标准会形成独立检查，所有检查在同一案卷运行中执行。</p>
            <div className="space-y-2">
              {(editing.sections ?? []).map((section, sectionIndex) => (
                <details key={section.id} open className="rounded-lg border bg-background p-3">
                  <summary className="cursor-pointer text-sm font-medium">{section.order + 1}. {section.name || '未命名分项'} · {section.criteria.length} 条标准</summary>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    <label className="text-xs">分项名称
                      <input className="mt-1 w-full rounded border px-2 py-1.5 text-sm" value={section.name} onChange={(event) => updateTemplate((current) => ({ ...current, sections: (current.sections ?? []).map((item, i) => i === sectionIndex ? { ...item, name: event.target.value } : item) }))} />
                    </label>
                    <label className="text-xs">分项说明
                      <input className="mt-1 w-full rounded border px-2 py-1.5 text-sm" placeholder="这类事项如何归入本分项" value={section.description ?? ''} onChange={(event) => updateTemplate((current) => ({ ...current, sections: (current.sections ?? []).map((item, i) => i === sectionIndex ? { ...item, description: event.target.value } : item) }))} />
                    </label>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <label className="flex items-center gap-1"><input type="checkbox" checked={section.required} onChange={(event) => updateTemplate((current) => ({ ...current, sections: (current.sections ?? []).map((item, i) => i === sectionIndex ? { ...item, required: event.target.checked } : item) }))} />每份案卷都必须包含此分项</label>
                    <Button size="sm" variant="outline" disabled={sectionIndex === 0} onClick={() => moveSection(sectionIndex, -1)}>上移</Button>
                    <Button size="sm" variant="outline" disabled={sectionIndex === (editing.sections?.length ?? 1) - 1} onClick={() => moveSection(sectionIndex, 1)}>下移</Button>
                    <Button size="sm" variant="ghost" onClick={() => updateTemplate((current) => {
                      const sections = normalizeOrder((current.sections ?? []).filter((_, i) => i !== sectionIndex))
                      return { ...current, sections, fields: current.fields.filter((field) => field.sectionId !== section.id), materialSlots: current.materialSlots.filter((slot) => slot.sectionId !== section.id) }
                    })}>删除分项</Button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {section.criteria.map((criterion, criterionIndex) => (
                      <div key={criterion.id} className="rounded-md bg-muted/30 p-2">
                        <div className="grid gap-2 md:grid-cols-[1fr_150px_150px_auto]">
                          <input aria-label="标准名称" className="rounded border bg-background px-2 py-1 text-xs" placeholder="标准名称，如等级核对" value={criterion.title} onChange={(event) => updateTemplate((current) => ({ ...current, sections: (current.sections ?? []).map((item, i) => i === sectionIndex ? { ...item, criteria: item.criteria.map((entry, j) => j === criterionIndex ? { ...entry, title: event.target.value } : entry) } : item) }))} />
                          <select aria-label="执行方式" className="rounded border bg-background px-2 py-1 text-xs" value={criterion.execution} onChange={(event) => {
                            const execution = event.target.value as TemplateCriterionSpec['execution']
                            updateCriterion(sectionIndex, criterionIndex, (entry) => {
                               if (execution === 'deterministic') return { ...entry, execution, ...(readT01NumberLimit(entry) ? { dataCheck: undefined } : { dataCheck: entry.dataCheck ?? { kind: 'sheet-sum-match', materialSlotId: editing.materialSlots[0]?.id ?? '', firstDataRow: 2, labelColumn: 'A', valueColumn: 'B', stopLabels: ['合计'] } }) }
                               const { deterministicConstraint: _old, ...rest } = entry as T01CriterionWithConstraint
                               return { ...rest, execution, dataCheck: undefined }
                             })
                          }}>
                            <option value="semantic">Agent 核对</option><option value="manual">人工确认</option><option value="deterministic">程序计算</option>
                          </select>
                          <select aria-label="检查范围" className="rounded border bg-background px-2 py-1 text-xs" value={criterion.targetScope} onChange={(event) => updateTemplate((current) => ({ ...current, sections: (current.sections ?? []).map((item, i) => i === sectionIndex ? { ...item, criteria: item.criteria.map((entry, j) => j === criterionIndex ? { ...entry, targetScope: event.target.value as TemplateCriterionSpec['targetScope'] } : entry) } : item) }))}>
                            <option value="subject">逐条申报事项</option><option value="group">本分项汇总</option><option value="case">本分项整体</option>
                          </select>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" disabled={criterionIndex === 0} onClick={() => updateTemplate((current) => ({ ...current, sections: (current.sections ?? []).map((item, i) => i === sectionIndex ? { ...item, criteria: reordered(item.criteria, criterionIndex, -1) } : item) }))}>↑</Button>
                            <Button size="sm" variant="ghost" disabled={criterionIndex === section.criteria.length - 1} onClick={() => updateTemplate((current) => ({ ...current, sections: (current.sections ?? []).map((item, i) => i === sectionIndex ? { ...item, criteria: reordered(item.criteria, criterionIndex, 1) } : item) }))}>↓</Button>
                            <Button size="sm" variant="ghost" onClick={() => updateTemplate((current) => ({ ...current, sections: (current.sections ?? []).map((item, i) => i === sectionIndex ? { ...item, criteria: item.criteria.filter((_, j) => j !== criterionIndex) } : item) }))}>删除</Button>
                          </div>
                        </div>
                        <textarea className="mt-2 w-full rounded border bg-background px-2 py-1.5 text-xs" rows={2} placeholder="写清审核要求与判定边界；按本单位、本年度正式依据填写。" value={criterion.requirement} onChange={(event) => updateTemplate((current) => ({ ...current, sections: (current.sections ?? []).map((item, i) => i === sectionIndex ? { ...item, criteria: item.criteria.map((entry, j) => j === criterionIndex ? { ...entry, requirement: event.target.value } : entry) } : item) }))} />
                        {criterion.execution === 'deterministic' && (
                          <div className="mt-2">
                            <ReviewV3T01NumberRuleEditor criterion={criterion} fields={editing.fields}
                              onChange={next => updateCriterion(sectionIndex, criterionIndex, () => next)}/>
                            {readT01NumberLimit(criterion) && (
                              <button type="button" className="mt-2 rounded border px-2 py-1 text-xs"
                                onClick={() => updateCriterion(sectionIndex, criterionIndex, entry => {
                                  const { deterministicConstraint: _old, ...rest } = entry as T01CriterionWithConstraint
                                  return { ...rest, dataCheck: {
                                    kind: 'sheet-sum-match', materialSlotId: editing.materialSlots[0]?.id ?? '',
                                    firstDataRow: 2, labelColumn: 'A', valueColumn: 'B', stopLabels: ['合计'],
                                  } }
                                })}>改回工作簿核对</button>
                            )}
                          </div>
                        )}
                        {criterion.execution === 'deterministic' && criterion.dataCheck && (
                          <div className="mt-2 grid gap-2 rounded border bg-background p-2 text-xs md:grid-cols-3">
                            <label>表格检查
                              <select className="mt-1 w-full rounded border px-2 py-1.5" value={criterion.dataCheck.kind} onChange={(event) => updateCriterion(sectionIndex, criterionIndex, (entry) => ({ ...entry, dataCheck: { ...entry.dataCheck!, kind: event.target.value as NonNullable<TemplateCriterionSpec['dataCheck']>['kind'] } }))}>
                                <option value="sheet-sum-match">明细合计与申报值核对</option><option value="sheet-unique-values">编号重复检查</option>
                              </select>
                            </label>
                            <label>材料槽
                              <select className="mt-1 w-full rounded border px-2 py-1.5" value={criterion.dataCheck.materialSlotId} onChange={(event) => updateCriterion(sectionIndex, criterionIndex, (entry) => ({ ...entry, dataCheck: { ...entry.dataCheck!, materialSlotId: event.target.value } }))}>
                                {(editing.materialSlots ?? []).map((slot) => <option key={slot.id} value={slot.id}>{slot.name}（{slot.id}）</option>)}
                              </select>
                            </label>
                            <label>工作表名称（空白取首张）<input className="mt-1 w-full rounded border px-2 py-1.5" value={criterion.dataCheck.sheetName ?? ''} onChange={(event) => updateCriterion(sectionIndex, criterionIndex, (entry) => ({ ...entry, dataCheck: { ...entry.dataCheck!, sheetName: event.target.value || undefined } }))} /></label>
                            <label>明细起始行<input type="number" min={1} className="mt-1 w-full rounded border px-2 py-1.5" value={criterion.dataCheck.firstDataRow} onChange={(event) => updateCriterion(sectionIndex, criterionIndex, (entry) => ({ ...entry, dataCheck: { ...entry.dataCheck!, firstDataRow: Number(event.target.value) } }))} /></label>
                            <label>编号/金额列<input className="mt-1 w-full rounded border px-2 py-1.5" value={criterion.dataCheck.valueColumn} placeholder="A" onChange={(event) => updateCriterion(sectionIndex, criterionIndex, (entry) => ({ ...entry, dataCheck: { ...entry.dataCheck!, valueColumn: event.target.value.toUpperCase() } }))} /></label>
                            <label>标签列（用于排除合计行）<input className="mt-1 w-full rounded border px-2 py-1.5" value={criterion.dataCheck.labelColumn ?? ''} placeholder="A" onChange={(event) => updateCriterion(sectionIndex, criterionIndex, (entry) => ({ ...entry, dataCheck: { ...entry.dataCheck!, labelColumn: event.target.value.toUpperCase() || undefined } }))} /></label>
                            <label className="md:col-span-2">停止标签（逗号分隔）<input className="mt-1 w-full rounded border px-2 py-1.5" value={(criterion.dataCheck.stopLabels ?? []).join(', ')} placeholder="合计, 明细合计" onChange={(event) => updateCriterion(sectionIndex, criterionIndex, (entry) => ({ ...entry, dataCheck: { ...entry.dataCheck!, stopLabels: event.target.value.split(/[，,]/).map((value) => value.trim()).filter(Boolean) } }))} /></label>
                            {criterion.dataCheck.kind === 'sheet-sum-match' && <>
                              <label>案卷级申报金额字段<select className="mt-1 w-full rounded border px-2 py-1.5" value={criterion.dataCheck.applicantFieldKey ?? ''} onChange={(event) => updateCriterion(sectionIndex, criterionIndex, (entry) => ({ ...entry, dataCheck: { ...entry.dataCheck!, applicantFieldKey: event.target.value || undefined } }))}><option value="">选择数字字段</option>{editing.fields.filter((field) => field.kind === 'number' && field.scope === 'case').map((field) => <option key={field.key} value={field.key}>{field.label}（{field.key}）</option>)}</select></label>
                              <label>数量列（可选）<input className="mt-1 w-full rounded border px-2 py-1.5" value={criterion.dataCheck.quantityColumn ?? ''} placeholder="B" onChange={(event) => updateCriterion(sectionIndex, criterionIndex, (entry) => ({ ...entry, dataCheck: { ...entry.dataCheck!, quantityColumn: event.target.value.toUpperCase() || undefined } }))} /></label>
                              <label>单价列（可选）<input className="mt-1 w-full rounded border px-2 py-1.5" value={criterion.dataCheck.unitPriceColumn ?? ''} placeholder="C" onChange={(event) => updateCriterion(sectionIndex, criterionIndex, (entry) => ({ ...entry, dataCheck: { ...entry.dataCheck!, unitPriceColumn: event.target.value.toUpperCase() || undefined } }))} /></label>
                            </>}
                            <p className="text-muted-foreground md:col-span-3">表格明细按单元格位置读取；合计行通过停止标签排除。没有识别到的值会要求确认，不会按 0 计算。</p>
                          </div>
                        )}
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => updateTemplate((current) => ({ ...current, sections: (current.sections ?? []).map((item, i) => i === sectionIndex ? { ...item, criteria: [...item.criteria, { id: generatedId('criterion'), title: '', requirement: '', execution: 'semantic', targetScope: 'subject' }] } : item) }))}>添加审核标准</Button>
                  </div>
                </details>
              ))}
            </div>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => updateTemplate((current) => {
              const id = generatedId('section')
              return { ...current, sections: [...(current.sections ?? []), { id, name: `新分项 ${(current.sections?.length ?? 0) + 1}`, description: '', order: current.sections?.length ?? 0, required: false, criteria: [] }] }
            })}>添加审核分项</Button>
          </details>

          <details className="mt-3 rounded-lg bg-muted/30 p-3">
            <summary className="cursor-pointer text-sm font-medium">材料槽（{editing.materialSlots.length}）</summary>
            <p className="mb-2 mt-2 text-xs text-muted-foreground">案卷可登记共享材料，也可把证明材料归到某个分项，上传后仍属于同一案卷。</p>
            <div className="space-y-2">
              {editing.materialSlots.map((slot, index) => (
                <div key={slot.id} className="grid gap-2 rounded-md bg-background p-2 md:grid-cols-[1fr_1fr_1fr_170px_auto]">
                  <input aria-label="材料编号" className="rounded border px-2 py-1 text-xs" placeholder="材料编号" value={slot.id} onChange={(event) => updateTemplate((current) => ({ ...current, materialSlots: current.materialSlots.map((item, i) => i === index ? { ...item, id: event.target.value.trim() } : item) }))} />
                  <input aria-label="材料名称" className="rounded border px-2 py-1 text-xs" placeholder="材料名称" value={slot.name} onChange={(event) => updateTemplate((current) => ({ ...current, materialSlots: current.materialSlots.map((item, i) => i === index ? { ...item, name: event.target.value } : item) }))} />
                  <input aria-label="材料用途" className="rounded border px-2 py-1 text-xs" placeholder="审核用途" value={slot.purpose} onChange={(event) => updateTemplate((current) => ({ ...current, materialSlots: current.materialSlots.map((item, i) => i === index ? { ...item, purpose: event.target.value } : item) }))} />
                  <select aria-label="材料所属分项" className="rounded border bg-background px-2 py-1 text-xs" value={slot.sectionId ?? ''} onChange={(event) => updateTemplate((current) => ({ ...current, materialSlots: current.materialSlots.map((item, i) => i === index ? { ...item, sectionId: event.target.value || undefined } : item) }))}>
                    <option value="">整份案卷共用</option>{(editing.sections ?? []).map((section) => <option key={section.id} value={section.id}>{section.name}</option>)}
                  </select>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" aria-label="材料槽上移" disabled={index === 0} onClick={() => moveMaterialSlot(index, -1)}>↑</Button>
                    <Button size="sm" variant="ghost" aria-label="材料槽下移" disabled={index === editing.materialSlots.length - 1} onClick={() => moveMaterialSlot(index, 1)}>↓</Button>
                    <Button size="sm" variant="ghost" onClick={() => updateTemplate((current) => ({ ...current, materialSlots: current.materialSlots.filter((_, i) => i !== index) }))}>删除</Button>
                  </div>
                  <input className="md:col-span-5 rounded border px-2 py-1 text-xs" placeholder="材料中需要核对的要素，以中文逗号分隔" value={slot.requiredElements.join('，')} onChange={(event) => updateTemplate((current) => ({ ...current, materialSlots: current.materialSlots.map((item, i) => i === index ? { ...item, requiredElements: event.target.value.split(/[，,]/).map((part) => part.trim()).filter(Boolean) } : item) }))} />
                  <div className="flex flex-wrap gap-x-3 gap-y-1 md:col-span-5">
                    {MATERIAL_KINDS.map((kind) => <label key={kind.value} className="flex items-center gap-1 text-xs"><input type="checkbox" checked={slot.acceptedKinds.includes(kind.value)} onChange={(event) => updateTemplate((current) => ({ ...current, materialSlots: current.materialSlots.map((item, i) => i === index ? { ...item, acceptedKinds: event.target.checked ? [...new Set([...item.acceptedKinds, kind.value])] : item.acceptedKinds.filter((value) => value !== kind.value) } : item) }))} />{kind.label}</label>)}
                  </div>
                  <div className="grid gap-2 md:col-span-5 md:grid-cols-4">
                    <label className="text-xs text-muted-foreground">最少份数（0 表示可选）<input type="number" min={0} className="mt-1 w-full rounded border bg-background px-2 py-1 text-xs text-foreground" value={slot.minCount} onChange={(event) => updateTemplate((current) => ({ ...current, materialSlots: current.materialSlots.map((item, i) => i === index ? { ...item, minCount: Math.max(0, Number(event.target.value) || 0) } : item) }))} /></label>
                    <label className="text-xs text-muted-foreground">最多份数<input type="number" min={1} className="mt-1 w-full rounded border bg-background px-2 py-1 text-xs text-foreground" value={slot.maxCount} onChange={(event) => updateTemplate((current) => ({ ...current, materialSlots: current.materialSlots.map((item, i) => i === index ? { ...item, maxCount: Math.max(1, Number(event.target.value) || 1) } : item) }))} /></label>
                    <label className="text-xs text-muted-foreground">要求提交时间<select className="mt-1 w-full rounded border bg-background px-2 py-1 text-xs text-foreground" value={slot.requiredAt ?? 'submission'} onChange={(event) => updateTemplate((current) => ({ ...current, materialSlots: current.materialSlots.map((item, i) => i === index ? { ...item, requiredAt: event.target.value as MaterialSlotSpec['requiredAt'] } : item) }))}><option value="submission">提交时</option><option value="decision">定稿前</option></select></label>
                    <label className="mt-4 flex items-center gap-1 text-xs"><input type="checkbox" checked={slot.allowReuseAcrossSubjects} onChange={(event) => updateTemplate((current) => ({ ...current, materialSlots: current.materialSlots.map((item, i) => i === index ? { ...item, allowReuseAcrossSubjects: event.target.checked } : item) }))} />允许事项共用</label>
                  </div>
                  <div className="md:col-span-5 rounded border border-border/60 p-2">
                    <ReviewV3T01ConditionEditor label="条件要求材料" value={slot.requiredWhen}
                      fields={editing.fields.filter(candidate=>candidate.scope==='case')}
                      onChange={condition=>updateTemplate(current=>({...current,materialSlots:current.materialSlots.map((item,i)=>i===index?{...item,requiredWhen:condition}:item)}))}/>
                  </div>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => updateTemplate((current) => ({ ...current, materialSlots: [...current.materialSlots, { id: generatedId('material'), name: '新材料', purpose: '', requiredElements: [], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text'], minCount: 1, maxCount: 10, requiredAt: 'submission', allowReuseAcrossSubjects: false }] }))}>添加材料槽</Button>
          </details>

          <details className="mt-3 rounded-lg bg-muted/30 p-3">
            <summary className="cursor-pointer text-sm font-medium">评分量表（可选）</summary>
            <label className="mt-2 flex items-center gap-2 text-xs"><input type="checkbox" checked={Boolean(editing.rubric)} onChange={(event) => updateTemplate((current) => ({
              ...current,
              rubric: event.target.checked
                ? current.rubric ?? { dimensions: [{ id: generatedId('dimension'), name: '评审维度', min: 1, max: 5, weight: 1 }], totalPrecision: 2, missingStrategy: 'block', naStrategy: 'exclude-renormalize', minEffectiveJudges: 2 }
                : undefined,
            }))} />启用多评委评分</label>
            {editing.rubric && <>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <label className="text-xs">缺评处理<select className="mt-1 w-full rounded border bg-background px-2 py-1.5" value={editing.rubric.missingStrategy} onChange={(event) => updateTemplate((current) => ({ ...current, rubric: current.rubric ? { ...current.rubric, missingStrategy: event.target.value as RubricSpec['missingStrategy'] } : undefined }))}><option value="block">缺少评分时阻止汇总</option><option value="exclude">排除缺评维度后汇总</option></select></label>
                <label className="text-xs">最低有效评委数<input type="number" min={1} className="mt-1 w-full rounded border bg-background px-2 py-1.5" value={editing.rubric.minEffectiveJudges ?? 1} onChange={(event) => updateTemplate((current) => ({ ...current, rubric: current.rubric ? { ...current.rubric, minEffectiveJudges: Math.max(1, Number(event.target.value) || 1) } : undefined }))} /></label>
              </div>
              <div className="mt-2 space-y-2">
                {editing.rubric.dimensions.map((dimension, index) => <div key={dimension.id} className="grid gap-2 rounded-md bg-background p-2 sm:grid-cols-[1fr_1fr_90px_90px_90px_auto]">
                  <input className="rounded border px-2 py-1 text-xs" aria-label="评分维度编号" value={dimension.id} onChange={(event) => updateTemplate((current) => ({ ...current, rubric: current.rubric ? { ...current.rubric, dimensions: current.rubric.dimensions.map((item, i) => i === index ? { ...item, id: event.target.value.trim() } : item) } : undefined }))} />
                  <input className="rounded border px-2 py-1 text-xs" aria-label="评分维度名称" value={dimension.name} onChange={(event) => updateTemplate((current) => ({ ...current, rubric: current.rubric ? { ...current.rubric, dimensions: current.rubric.dimensions.map((item, i) => i === index ? { ...item, name: event.target.value } : item) } : undefined }))} />
                  <input type="number" aria-label="最低分" className="rounded border px-2 py-1 text-xs" value={dimension.min} onChange={(event) => updateTemplate((current) => ({ ...current, rubric: current.rubric ? { ...current.rubric, dimensions: current.rubric.dimensions.map((item, i) => i === index ? { ...item, min: Number(event.target.value) } : item) } : undefined }))} />
                  <input type="number" aria-label="最高分" className="rounded border px-2 py-1 text-xs" value={dimension.max} onChange={(event) => updateTemplate((current) => ({ ...current, rubric: current.rubric ? { ...current.rubric, dimensions: current.rubric.dimensions.map((item, i) => i === index ? { ...item, max: Number(event.target.value) } : item) } : undefined }))} />
                  <input type="number" min={0} step="0.1" aria-label="评分权重" className="rounded border px-2 py-1 text-xs" value={dimension.weight} onChange={(event) => updateTemplate((current) => ({ ...current, rubric: current.rubric ? { ...current.rubric, dimensions: current.rubric.dimensions.map((item, i) => i === index ? { ...item, weight: Number(event.target.value) } : item) } : undefined }))} />
                  <Button size="sm" variant="ghost" disabled={(editing.rubric?.dimensions.length ?? 0) <= 1} onClick={() => updateTemplate((current) => ({ ...current, rubric: current.rubric ? { ...current.rubric, dimensions: current.rubric.dimensions.filter((_, i) => i !== index) } : undefined }))}>删除</Button>
                </div>)}
              </div>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => updateTemplate((current) => ({ ...current, rubric: current.rubric ? { ...current.rubric, dimensions: [...current.rubric.dimensions, { id: generatedId('dimension'), name: '', min: 1, max: 5, weight: 1 }] } : undefined }))}>添加评分维度</Button>
            </>}
          </details>

          <details className="mt-3 rounded-lg bg-muted/30 p-3">
            <summary className="cursor-pointer text-sm font-medium">审核输出（{editing.outputs.length}）</summary>
            <p className="mb-2 mt-2 text-xs text-muted-foreground">配置本模板生成的结果类型及可见对象。</p>
            <div className="space-y-2">
              {editing.outputs.map((output, index) => <div key={`${output.id}-${index}`} className="grid gap-2 rounded-md bg-background p-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <input className="rounded border px-2 py-1 text-xs" aria-label="输出编号" value={output.id} onChange={(event) => updateTemplate((current) => ({ ...current, outputs: current.outputs.map((item, i) => i === index ? { ...item, id: event.target.value.trim() } : item) }))} />
                <select className="rounded border bg-background px-2 py-1 text-xs" aria-label="输出类型" value={output.kind} onChange={(event) => updateTemplate((current) => ({ ...current, outputs: current.outputs.map((item, i) => i === index ? { ...item, kind: event.target.value as TemplateVersion['outputs'][number]['kind'] } : item) }))}>{OUTPUT_KINDS.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}</select>
                <select className="rounded border bg-background px-2 py-1 text-xs" aria-label="输出对象" value={output.audience} onChange={(event) => updateTemplate((current) => ({ ...current, outputs: current.outputs.map((item, i) => i === index ? { ...item, audience: event.target.value as TemplateVersion['outputs'][number]['audience'] } : item) }))}>{OUTPUT_AUDIENCES.map((audience) => <option key={audience.value} value={audience.value}>{audience.label}</option>)}</select>
                <Button size="sm" variant="ghost" disabled={editing.outputs.length <= 1} onClick={() => updateTemplate((current) => ({ ...current, outputs: current.outputs.filter((_, i) => i !== index) }))}>删除</Button>
              </div>)}
            </div>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => updateTemplate((current) => ({ ...current, outputs: [...current.outputs, { id: generatedId('output'), kind: 'item-feedback', audience: 'reviewer' }] }))}>添加审核输出</Button>
          </details>

          <details className="mt-3 rounded-lg bg-muted/30 p-3">
            <summary className="cursor-pointer text-sm font-medium">审核流程（{editing.stages.length} 个节点）</summary>
            <p className="mb-2 mt-2 text-xs text-muted-foreground">节点顺序就是流转顺序，保存时会把每个节点连接到下一个节点。</p>
            <div className="space-y-2">
              {editing.stages.map((stage, index) => (
                <div key={stage.id} className="grid gap-2 rounded-md bg-background p-2 md:grid-cols-[1fr_140px_130px_170px_auto]">
                  <input aria-label="流程节点名称" className="rounded border px-2 py-1 text-xs" value={stage.name} onChange={(event) => updateTemplate((current) => ({ ...current, stages: current.stages.map((item, i) => i === index ? { ...item, name: event.target.value } : item) }))} />
                  <select aria-label="流程节点类型" className="rounded border bg-background px-2 py-1 text-xs" value={stage.kind} onChange={(event) => updateTemplate((current) => ({ ...current, stages: current.stages.map((item, i) => i === index ? { ...item, kind: event.target.value as WorkflowStageSpec['kind'] } : item) }))}>{STAGE_KINDS.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}</select>
                  <select aria-label="流程执行人" className="rounded border bg-background px-2 py-1 text-xs" value={stage.executorRole} onChange={(event) => updateTemplate((current) => ({ ...current, stages: current.stages.map((item, i) => i === index ? { ...item, executorRole: event.target.value as WorkflowStageSpec['executorRole'] } : item) }))}>{ROLE_OPTIONS.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}</select>
                  <select aria-label="退回节点" className="rounded border bg-background px-2 py-1 text-xs" value={stage.returnToStageId ?? ''} onChange={(event) => updateTemplate((current) => ({ ...current, stages: current.stages.map((item, i) => i === index ? { ...item, returnToStageId: event.target.value || undefined } : item) }))}>
                    <option value="">不指定退回</option>{editing.stages.filter((target) => target.id !== stage.id).map((target) => <option key={target.id} value={target.id}>退回：{target.name}</option>)}
                  </select>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" disabled={index === 0} onClick={() => updateTemplate((current) => ({ ...current, stages: reordered(current.stages, index, -1) }))}>↑</Button>
                    <Button size="sm" variant="ghost" disabled={index === editing.stages.length - 1} onClick={() => updateTemplate((current) => ({ ...current, stages: reordered(current.stages, index, 1) }))}>↓</Button>
                    <Button size="sm" variant="ghost" disabled={editing.stages.length <= 1} onClick={() => updateTemplate((current) => ({ ...current, stages: current.stages.filter((_, i) => i !== index) }))}>删除</Button>
                  </div>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => updateTemplate((current) => ({ ...current, stages: [...current.stages, newStage(`审核节点 ${current.stages.length + 1}`, 'manual-review', 'reviewer')] }))}>添加流程节点</Button>
          </details>

          <ReviewV3T01TrialPanel key={editing.templateId + ':' + editing.version} template={editing} />
          {message.length > 0 && <ul className="mt-3 list-disc rounded-lg bg-red-500/10 px-8 py-2 text-xs text-red-700 dark:text-red-300">{message.map((item, index) => <li key={index}>{item}</li>)}</ul>}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">草稿可继续修改；发布后版本不可覆盖，后续修改会创建新版本。</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={loading || editing.status !== 'draft'} onClick={() => void saveDraft()}>保存草稿</Button>
              <Button size="sm" disabled={loading || editing.status !== 'draft'} onClick={() => void publish()}>{loading ? '处理中…' : '校验并发布'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
