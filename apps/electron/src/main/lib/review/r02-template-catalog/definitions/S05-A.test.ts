import { describe, expect, test } from 'bun:test'
import { validateTemplate } from '../../template-store'
import { templateVersion as t01, r02Metadata as m01 } from './S05-T01'
import { templateVersion as t04, r02Metadata as m04 } from './S05-T04'
import { templateVersion as t05, r02Metadata as m05 } from './S05-T05'

const fixtures = [
  { template: t01, metadata: m01, id: 'S05-T01', name: '第二课堂成绩单与活动学分认定审核' },
  { template: t04, metadata: m04, id: 'S05-T04', name: '学生社团成立、注册、变更、换届与注销审核' },
  { template: t05, metadata: m05, id: 'S05-T05', name: '学生社团活动立项与组织责任审核' },
]

describe('S05-A R02 native template definitions', () => {
  test('IDs and names are exact and unique', () => {
    expect(fixtures.map(x => x.template.templateId)).toEqual(['S05-T01', 'S05-T04', 'S05-T05'])
    expect(fixtures.map(x => x.template.name)).toEqual(fixtures.map(x => x.name))
    expect(new Set(fixtures.map(x => x.template.templateId)).size).toBe(fixtures.length)
    expect(new Set(fixtures.map(x => x.template.name)).size).toBe(fixtures.length)
  })

  test('all definitions pass validateTemplate without errors', () => {
    for (const fixture of fixtures) {
      const errors = validateTemplate(fixture.template).filter(issue => issue.level === 'error')
      expect(errors, fixture.template.templateId).toEqual([])
    }
  })

  test('field, material, section, criterion and source references resolve', () => {
    for (const { template, metadata } of fixtures) {
      const fieldKeys = template.fields.map(field => field.key)
      const slotIds = template.materialSlots.map(slot => slot.id)
      const sections = template.sections ?? []
      const sectionIds = sections.map(section => section.id)
      const criteria = sections.flatMap(section => section.criteria.map(criterion => ({ ...criterion, sectionId: section.id })))
      expect(new Set(fieldKeys).size).toBe(fieldKeys.length)
      expect(new Set(slotIds).size).toBe(slotIds.length)
      expect(new Set(sectionIds).size).toBe(sectionIds.length)
      expect(new Set(criteria.map(c => c.id)).size).toBe(criteria.length)
      expect(metadata.fieldIds.length === template.fields.length).toBe(true)
      expect(metadata.materialSlotIds.length === template.materialSlots.length).toBe(true)
      for (const fieldId of metadata.fieldIds) expect(fieldKeys).toContain(fieldId.toLowerCase())
      for (const materialId of metadata.materialSlotIds) expect(slotIds).toContain(materialId.toLowerCase())
      expect(metadata.criteria.length === criteria.length).toBe(true)
      const srcIds = new Set(metadata.sources.map(source => source.id))
      for (const mapping of metadata.criteria) {
        expect(sectionIds).toContain(mapping.sectionId)
        expect(criteria.some(c => c.sectionId === mapping.sectionId && c.id === mapping.criterionId)).toBe(true)
        for (const fieldId of mapping.fieldIds) expect(metadata.fieldIds).toContain(fieldId)
        for (const materialId of mapping.materialSlotIds) expect(metadata.materialSlotIds).toContain(materialId)
        for (const srcId of mapping.srcIds) expect(srcIds.has(srcId)).toBe(true)
      }
    }
  })

  test('stage graphs are reachable, acyclic and locally owned', () => {
    for (const { template } of fixtures) {
      const stages = template.stages
      const byId = new Map(stages.map(stage => [stage.id, stage]))
      expect(new Set(stages.map(stage => stage.id)).size).toBe(stages.length)
      expect(stages.length).toBeGreaterThan(0)
      for (const stage of stages) {
        expect(stage.workflowOwner).toBe('local')
        expect(['reviewer', 'teacher']).toContain(stage.executorRole)
        if (stage.nextStageId) expect(byId.has(stage.nextStageId)).toBe(true)
        if (stage.returnToStageId) expect(byId.has(stage.returnToStageId)).toBe(true)
      }
      const visited = new Set<string>()
      let current: string | undefined = stages[0]?.id
      while (current) {
        expect(visited.has(current)).toBe(false)
        visited.add(current)
        current = byId.get(current)?.nextStageId
      }
      expect(visited.size).toBe(stages.length)
      expect(stages[stages.length - 1]?.kind).toBe('handoff')
    }
  })

  test('nonofficial source metadata and all formal-decision automation remain disabled', () => {
    for (const { template, metadata } of fixtures) {
      expect(template.schemaVersion).toBe(2)
      expect(template.catalogKind).toBe('builtin')
      expect(template.status).toBe('draft')
      expect(template.policyVersionIds).toEqual([])
      expect(template.autoPassPolicy).toEqual({ enabled: false })
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(metadata.officialSchoolTemplate).toBe(false)
      expect(metadata.sourceDocSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(metadata.originalResearchSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(template.outputs.some(output => output.kind === 'approval')).toBe(false)
      expect(template.outputs.some(output => output.kind === 'item-feedback')).toBe(true)
      expect(template.outputs.some(output => output.kind === 'supplement-list')).toBe(true)
      expect(template.stages.some(stage => stage.kind === 'auto-check')).toBe(false)
      const criterionById = new Map((template.sections ?? []).flatMap(section => section.criteria.map(c => [c.id, c] as const)))
      for (const mapping of metadata.criteria) {
        if (mapping.evidenceStatus === 'UNCONFIRMED' || mapping.evidenceStatus === 'PARTIAL') {
          expect(criterionById.get(mapping.criterionId)?.execution).toBe('manual')
        }
      }
      if (metadata.policyEvidenceStatus === 'UNCONFIRMED' || metadata.policyEvidenceStatus === 'PARTIAL') {
        expect(template.status).toBe('draft')
        expect(template.policyVersionIds).toEqual([])
        expect(template.autoPassPolicy?.enabled).toBe(false)
      }
    }
  })
})
