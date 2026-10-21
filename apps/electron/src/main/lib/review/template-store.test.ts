/**
 * M1 模板仓库单测（对应 K14/D12：第七种业务只靠配置创建）
 * 隔离：PROFER_CONFIG_DIR 指向唯一临时目录。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { ALL_DEFAULT_TEMPLATES_V2, BUILTIN_TEMPLATES_V2, ensureBuiltinTemplateDrafts } from './builtin-templates'
import { deprecateTemplate, getTemplate, isSafeTemplateId, listArchivedTemplates, listTemplateVersions, listTemplates, publishTemplate, removeTemplateFromLibrary, reorderTemplates, restoreTemplateToLibrary, saveDraft, validateTemplate } from './template-store'
import { resolveEffectiveRules } from './effective-rules'
import { emptyAggregate } from './case-store-v2'
import { combineCoverage } from './coverage-ledger'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `profer-test-template-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

describe('审核模板目录（M1）', () => {
  test('模板 ID 支持中文名称并拒绝路径穿越字符', () => {
    expect(isSafeTemplateId('wizard-学生综合素质测评-muuq80nv')).toBeTrue()
    expect(isSafeTemplateId('../outside')).toBeFalse()
    expect(isSafeTemplateId('has.dot')).toBeFalse()
  })

  test('旧版本地综测模板读取时补齐申报表/证明材料生命周期默认值', () => {
    const legacy = {
      ...BUILTIN_TEMPLATES_V2[0]!,
      version: 1,
      materialSlots: [
        ...BUILTIN_TEMPLATES_V2[0]!.materialSlots.map(({ requiredAt: _requiredAt, ...slot }) => slot),
        { ...BUILTIN_TEMPLATES_V2[0]!.materialSlots[0]!, id: 'certificates', requiredAt: undefined },
      ],
    }
    saveDraft(legacy)
    const loaded = getTemplate('comprehensive-assessment-v2', 1)!
    expect(loaded.materialSlots.find((slot) => slot.id === 'application-form')?.requiredAt).toBe('submission')
    expect(loaded.materialSlots.find((slot) => slot.id === 'certificates')?.requiredAt).toBe('decision')
  })

  test('内置模板与开源参考范本都能通过结构校验', () => {
    expect(BUILTIN_TEMPLATES_V2).toHaveLength(2)
    expect(BUILTIN_TEMPLATES_V2.every((template) => template.catalogKind === 'builtin')).toBeTrue()
    expect(ALL_DEFAULT_TEMPLATES_V2.filter((template) => template.catalogKind === 'reference')).toHaveLength(8)
    const activity = ALL_DEFAULT_TEMPLATES_V2.find((template) => template.templateId === 'student-activity-approval-v1')!
    const expense = ALL_DEFAULT_TEMPLATES_V2.find((template) => template.templateId === 'teacher-expense-check-v1')!
    expect(activity.version).toBe(2)
    expect(expense.version).toBe(2)
    expect(activity.sections?.flatMap((section) => section.criteria).some((criterion) => criterion.dataCheck?.kind === 'sheet-sum-match')).toBeTrue()
    expect(expense.sections?.flatMap((section) => section.criteria).some((criterion) => criterion.dataCheck?.kind === 'sheet-unique-values')).toBeTrue()
    for (const template of ALL_DEFAULT_TEMPLATES_V2) {
      const errors = validateTemplate(template).filter((issue) => issue.level === 'error')
      expect(errors).toEqual([])
    }
  })

  test('新版综测模板即使尚未预登记事项也会生成整案分项检查', () => {
    ensureBuiltinTemplateDrafts({ getTemplate, saveDraft })
    const template = getTemplate('comprehensive-assessment-v2', 3)!
    const aggregate = emptyAggregate({
      id: 'comprehensive-empty-subjects', templateId: template.templateId, templateVersion: template.version,
      title: '空事项测试', objectType: 'person', caseFields: {}, subjects: [], documents: [], stage: 'submitted',
      revision: 0, createdAt: '', updatedAt: '',
    })
    const rules = resolveEffectiveRules(aggregate, template).map((item) => item.rule)
    const coverage = combineCoverage([], rules, [], [], {}, Object.fromEntries((template.sections ?? []).map((section) => [section.id, []])))
    expect(template.status).toBe('published')
    expect(rules.length).toBeGreaterThan(0)
    expect(rules.every((rule) => rule.targetScope === 'group')).toBeTrue()
    expect(coverage.plannedChecks).toBeGreaterThan(0)
  })

  test('必需审核分项没有标准时不能发布模板', () => {
    const template = {
      ...BUILTIN_TEMPLATES_V2[0]!,
      templateId: 'required-section-without-criteria',
      sections: [{ id: 'study', name: '学业表现', order: 0, required: true, criteria: [] }],
    }
    saveDraft(template)
    expect(validateTemplate(template).some((issue) => issue.level === 'error' && issue.message.includes('至少需要一条审核要求'))).toBeTrue()
    expect(() => publishTemplate(template.templateId, template.version)).toThrow('至少需要一条审核要求')
  })

  test('新草稿版本存在时仍可读取并使用之前的已发布版本', () => {
    const templateId = 'template-version-history-test'
    const draft = { ...BUILTIN_TEMPLATES_V2[0]!, templateId, version: 1, name: '模板版本历史测试', status: 'draft' as const }
    saveDraft(draft)
    publishTemplate(templateId, 1)
    saveDraft({ ...draft, version: 2, name: '模板版本历史测试新草稿', status: 'draft' })

    expect(listTemplates().find((template) => template.templateId === templateId)?.status).toBe('draft')
    expect(listTemplateVersions().filter((template) => template.templateId === templateId).sort((a, b) => b.version - a.version).map((template) => [template.version, template.status])).toEqual([[2, 'draft'], [1, 'published']])
  })

  test('Given 内置草稿 When ensureBuiltinTemplateDrafts Then 幂等落盘且可发布', () => {
    mkdirSync(join(CONFIG_DIR, 'review-templates'), { recursive: true })
    writeFileSync(join(CONFIG_DIR, 'review-templates', 'catalog.json'), JSON.stringify({ schemaVersion: 1, order: ['template-version-history-test'], archived: [] }))
    ensureBuiltinTemplateDrafts({ getTemplate, saveDraft })
    ensureBuiltinTemplateDrafts({ getTemplate, saveDraft }) // 第二次不覆盖
    expect(listTemplates().length).toBeGreaterThanOrEqual(6)
    expect(listTemplates().some((template) => template.templateId === 'activity-approval-v2')).toBeFalse()
    expect(listArchivedTemplates().some((template) => template.templateId === 'activity-approval-v2')).toBeTrue()
    expect(listTemplates()[0]?.templateId).toBe('template-version-history-test')
    const published = publishTemplate('comprehensive-assessment-v2', BUILTIN_TEMPLATES_V2[0]!.version)
    expect(published.status).toBe('published')
    expect(published.publishedAt).toBeString()
    // 已发布不可覆盖（saveDraft 拒绝非草稿 / 版本冲突双保险）
    expect(() => saveDraft(published)).toThrow()
  })

  test('模板库支持排序、移出与恢复；历史版本仍可读取', () => {
    const original = listTemplates().map((template) => template.templateId)
    expect(ALL_DEFAULT_TEMPLATES_V2.every((template) => original.includes(template.templateId))).toBeTrue()
    const reordered = reorderTemplates([...original].reverse())
    expect(reordered.map((template) => template.templateId)).toEqual([...original].reverse())

    const target = reordered[0]!
    removeTemplateFromLibrary(target.templateId)
    expect(listTemplates().some((template) => template.templateId === target.templateId)).toBeFalse()
    expect(getTemplate(target.templateId, target.version)?.name).toBe(target.name)
    expect(listArchivedTemplates().some((template) => template.templateId === target.templateId)).toBeTrue()
    restoreTemplateToLibrary(target.templateId)
    expect(listTemplates().some((template) => template.templateId === target.templateId)).toBeTrue()
  })

  test('Given 已发布版本 When 停用 Then 状态 deprecated 且历史可读', () => {
    publishTemplate('document-checklist-v2', 1)
    const deprecated = deprecateTemplate('document-checklist-v2', 1)
    expect(deprecated.status).toBe('deprecated')
    expect(getTemplate('document-checklist-v2', 1)?.status).toBe('deprecated')
  })
})

describe('发布检查（02 §5.6）', () => {
  test('Given 悬空条件引用 When validate Then error 指出缺失字段', () => {
    const template = BUILTIN_TEMPLATES_V2[1]!
    const broken = {
      ...template,
      fields: [...template.fields, { key: 'extra', label: 'x', kind: 'text' as const, required: false, visibility: 'public' as const, conditionRequired: { field: 'ghost-field', op: 'exists' as const } }],
    }
    const issues = validateTemplate(broken)
    expect(issues.some((issue) => issue.message.includes('ghost-field'))).toBeTrue()
  })

  test('Given 流程重复阶段 When validate Then 报循环/重复', () => {
    const template = BUILTIN_TEMPLATES_V2[0]!
    const issues = validateTemplate({ ...template, stages: [...template.stages, template.stages[0]!] })
    expect(issues.some((issue) => issue.message.includes('重复阶段'))).toBeTrue()
  })

  test('Given 阶段链遗漏终审 When validate Then 阻止发布且内置基金模板链路闭合', () => {
    const source = ALL_DEFAULT_TEMPLATES_V2.find((template) => template.templateId === 'teacher-research-grant-review-v1')!
    const disconnected = { ...source, stages: source.stages.map((stage) => stage.id === 'panel' ? { ...stage, nextStageId: undefined } : stage) }
    expect(validateTemplate(disconnected).some((issue) => issue.level === 'error' && issue.message.includes('主管部门定稿'))).toBeTrue()
    expect(validateTemplate(source).filter((issue) => issue.level === 'error')).toEqual([])
  })

  test('Given 下一阶段连成循环 When validate Then 阻止无法终止的流程发布', () => {
    const source = ALL_DEFAULT_TEMPLATES_V2.find((template) => template.templateId === 'teacher-research-grant-review-v1')!
    const cyclic = { ...source, stages: source.stages.map((stage) => stage.id === 'decision' ? { ...stage, nextStageId: 'expert-review' } : stage) }
    expect(validateTemplate(cyclic).some((issue) => issue.level === 'error' && issue.message.includes('流程从阶段'))).toBeTrue()
  })

  test('Given 旧版内置基金草稿 When 启动初始化 Then 保留旧版本并新增闭环草稿', () => {
    const source = ALL_DEFAULT_TEMPLATES_V2.find((template) => template.templateId === 'teacher-research-grant-review-v1')!
    const stale = { ...source, stages: source.stages.map((stage) => stage.id === 'panel' ? { ...stage, nextStageId: undefined } : stage) }
    saveDraft(stale)

    ensureBuiltinTemplateDrafts({ getTemplate, saveDraft })

    expect(getTemplate(stale.templateId, 1)?.stages.find((stage) => stage.id === 'panel')?.nextStageId).toBeUndefined()
    const repaired = getTemplate(stale.templateId)!
    expect(repaired.version).toBe(2)
    expect(repaired.stages.find((stage) => stage.id === 'panel')?.nextStageId).toBe('decision')
    expect(validateTemplate(repaired).filter((issue) => issue.level === 'error')).toEqual([])
  })

  test('Given 非法量表 When validate Then 报权重/范围错误', () => {
    const template = ALL_DEFAULT_TEMPLATES_V2.find((candidate) => candidate.rubric)!
    const issues = validateTemplate({ ...template, rubric: { ...template.rubric!, dimensions: [{ id: 'd', name: 'd', min: 5, max: 1, weight: 0 }] } })
    expect(issues.some((issue) => issue.message.includes('min>=max'))).toBeTrue()
  })
})

describe('第七种业务只靠配置创建（D12/K14）', () => {
  test('Given 实验室使用申请配置 When validate+publish Then 通过且无学年/申报分字段', () => {
    const lab: Parameters<typeof saveDraft>[0] = {
      templateId: 'lab-usage-v2', version: 1, schemaVersion: 2, name: '实验室使用申请',
      objectType: 'organization', displayName: { template: '{{orgName}}' },
      fields: [
        { key: 'orgName', label: '申请组织', kind: 'text', required: true, visibility: 'public' },
        { key: 'headcount', label: '人数', kind: 'number', required: true, visibility: 'public', min: 1, max: 50 },
        { key: 'usage', label: '用途', kind: 'text', required: true, visibility: 'public' },
        { key: 'slotStart', label: '使用时段', kind: 'date', required: true, visibility: 'public' },
      ],
      materialSlots: [{ id: 'plan', name: '使用计划书', purpose: '用途与安全', requiredElements: ['安全'], acceptedKinds: ['pdf', 'office'], minCount: 1, maxCount: 3, allowReuseAcrossSubjects: false }],
      policyVersionIds: ['policy-lab-usage'],
      stages: [
        { id: 'auto-check', name: '自动核对', kind: 'auto-check', executorRole: 'system', nextStageId: 'first-review' },
        { id: 'first-review', name: '初审', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'final-review' },
        { id: 'final-review', name: '终审', kind: 'manual-review', executorRole: 'teacher' },
      ],
      outputs: [{ id: 'approval', kind: 'approval', audience: 'teacher' }],
      status: 'draft', createdAt: new Date().toISOString(),
    }
    expect(validateTemplate(lab).filter((issue) => issue.level === 'error')).toEqual([])
    saveDraft(lab)
    const published = publishTemplate('lab-usage-v2', 1)
    expect(published.status).toBe('published')
    // 无评分量表、无学年/申报分占位字段
    expect(published.rubric).toBeUndefined()
    expect(published.fields.some((field) => field.key === 'academicYear' || field.key === 'declaredScore')).toBeFalse()
  })
})
