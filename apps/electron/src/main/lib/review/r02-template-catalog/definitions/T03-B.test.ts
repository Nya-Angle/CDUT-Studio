import { describe, expect, test } from 'bun:test'
import type { TemplateVersion } from '@profer/shared'
import { validateTemplate } from '../../template-store'
import { templateVersion as T03T06, r02Metadata as M03T06 } from './T03-T06'
import { templateVersion as T03T07, r02Metadata as M03T07 } from './T03-T07'
import { templateVersion as T03T09, r02Metadata as M03T09 } from './T03-T09'
import { templateVersion as T03T10, r02Metadata as M03T10 } from './T03-T10'

const entries: Array<{ template: TemplateVersion; metadata: typeof M03T06 }> = [
  { template: T03T06, metadata: M03T06 },
  { template: T03T07, metadata: M03T07 },
  { template: T03T09, metadata: M03T09 },
  { template: T03T10, metadata: M03T10 },
]

describe('T03-B R02 native template definitions', () => {
  test('IDs and formal names are exact and unique', () => {
    expect(entries.map(x => x.template.templateId)).toEqual(['T03-T06', 'T03-T07', 'T03-T09', 'T03-T10'])
    expect(entries.map(x => x.template.name)).toEqual([
      '科研项目年度进度与中期检查审核',
      '科研项目结题、验收与科研绩效材料审核',
      '涉密科研项目的立项保密责任与定密程序审核',
      '科研项目合同成果交付与履约目标核验',
    ])
    expect(new Set(entries.map(x => x.template.templateId)).size).toBe(entries.length)
    expect(new Set(entries.map(x => x.template.name)).size).toBe(entries.length)
  })

  test('all runtime definitions pass the existing TemplateVersion validator', () => {
    for (const { template } of entries) {
      const errors = validateTemplate(template).filter(issue => issue.level === 'error')
      expect(errors).toEqual([])
    }
  })

  test('field, material-slot, section, criterion and stage references are not dangling', () => {
    for (const { template, metadata } of entries) {
      const fieldKeys = template.fields.map(field => field.key)
      const slotIds = template.materialSlots.map(slot => slot.id)
      const sectionIds = template.sections?.map(section => section.id) ?? []
      const criterionIds = (template.sections ?? []).flatMap(section => section.criteria.map(criterion => criterion.id))
      expect(new Set(fieldKeys).size).toBe(fieldKeys.length)
      expect(new Set(slotIds).size).toBe(slotIds.length)
      expect(new Set(sectionIds).size).toBe(sectionIds.length)
      expect(new Set(criterionIds).size).toBe(criterionIds.length)
      const stageIds = new Set(template.stages.map(stage => stage.id))
      for (const stage of template.stages) {
        if (stage.nextStageId) expect(stageIds.has(stage.nextStageId)).toBeTrue()
        if (stage.returnToStageId) expect(stageIds.has(stage.returnToStageId)).toBeTrue()
      }
      let current = template.stages[0]?.id
      const visited = new Set<string>()
      while (current) {
        expect(visited.has(current)).toBeFalse()
        visited.add(current)
        current = template.stages.find(stage => stage.id === current)?.nextStageId
      }
      expect(visited.size).toBe(template.stages.length)
      const criterionKeys = new Set(criterionIds.map(id => id))
      expect(metadata.criteria.length).toBe(criterionIds.length)
      for (const item of metadata.criteria) {
        expect(sectionIds.includes(item.sectionId)).toBeTrue()
        expect(criterionKeys.has(item.criterionId)).toBeTrue()
        expect(['VERIFIED', 'PARTIAL', 'UNCONFIRMED']).toContain(item.evidenceStatus)
        expect(Array.isArray(item.srcIds)).toBeTrue()
        for (const srcId of item.srcIds) expect(srcId).toMatch(/^SRC-\d{3}$/)
      }
    }
  })

  test('metadata is complete, nonofficial and does not invent policy versions', () => {
    for (const { template, metadata } of entries) {
      expect(metadata.templateId).toBe(template.templateId)
      expect(metadata.name).toBe(template.name)
      expect(metadata.officialSchoolTemplate).toBeFalse()
      expect(metadata.sourceDocumentPath.endsWith(`/${template.templateId}.md`)).toBeTrue()
      expect(metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(metadata.sourceDocumentBytes).toBeGreaterThan(0)
      expect(metadata.policyEvidenceStatus).toBe('PARTIAL')
      expect(template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBeTrue()
      expect(template.status).toBe('draft')
      expect(template.schemaVersion).toBe(2)
      expect(template.catalogKind).toBe('builtin')
      expect(template.policyVersionIds).toEqual([])
      expect(template.autoPassPolicy?.enabled).toBeFalse()
      expect(template.stages.every(stage => stage.workflowOwner === 'local')).toBeTrue()
      expect(template.stages[template.stages.length - 1]?.executorRole).toBe('teacher')
      expect((template.sections ?? []).flatMap(section => section.criteria).every(criterion => criterion.execution !== 'deterministic')).toBeTrue()
    }
  })

  test('underspecified enums and tri-state fields are not guessed', () => {
    for (const { template } of entries) {
      for (const field of template.fields) {
        if (field.kind === 'enum') expect((field.options ?? []).length).toBeGreaterThan(0)
      }
    }
  })

  test('T03-T09 is metadata-only and keeps all rules manual', () => {
    expect(T03T09.fields.map(field => field.key)).toEqual(['f001', 'f002'])
    expect(T03T09.materialSlots.map(slot => slot.id)).toEqual(['m001'])
    expect(T03T09.materialSlots.every(slot => slot.acceptedKinds.every(kind => kind === 'text'))).toBeTrue()
    expect((T03T09.sections ?? []).flatMap(section => section.criteria).every(criterion => criterion.execution === 'manual')).toBeTrue()
    expect(T03T09.stages[1]?.enterWhen).toBeDefined()
    expect(M03T09.requiresPreUploadSecurityGate).toBeTrue()
    expect(M03T09.secureIntakeEnforcedByTemplateVersion).toBeFalse()
  })
})
