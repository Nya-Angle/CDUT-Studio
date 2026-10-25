import { describe, expect, it } from 'bun:test'
import { validateTemplate } from '../../template-store'
import { templateVersion as t06, r02Metadata as m06 } from './S01-T06'
import { templateVersion as t07, r02Metadata as m07 } from './S01-T07'
import { templateVersion as t08, r02Metadata as m08 } from './S01-T08'

const entries = [
  { template: t06, metadata: m06, id: 'S01-T06', name: '本人申请退学及学籍退出手续核验' },
  { template: t07, metadata: m07, id: 'S01-T07', name: '降级、留级和年级编入变更审核' },
  { template: t08, metadata: m08, id: 'S01-T08', name: '提前毕业、延期毕业与修业年限调整审核' },
]

describe('R02 S01-B native template definitions', () => {
  it('preserves each formal ID/name and uniqueness', () => {
    expect(entries.map(x => x.template.templateId)).toEqual(entries.map(x => x.id))
    expect(entries.map(x => x.template.name)).toEqual(entries.map(x => x.name))
    expect(new Set(entries.map(x => x.id)).size).toBe(3)
    expect(new Set(entries.map(x => x.name)).size).toBe(3)
  })

  it('passes validateTemplate and has no dangling IDs', () => {
    for (const { template } of entries) {
      expect(template.schemaVersion).toBe(2)
      expect(template.catalogKind).toBe('builtin')
      expect(template.status).toBe('draft')
      expect(validateTemplate(template).filter(issue => issue.level === 'error')).toEqual([])
      expect(new Set(template.fields.map(field => field.key)).size).toBe(template.fields.length)
      expect(new Set(template.materialSlots.map(slot => slot.id)).size).toBe(template.materialSlots.length)
      const sectionIds = new Set((template.sections ?? []).map(section => section.id))
      expect(sectionIds.size).toBe((template.sections ?? []).length)
      for (const section of template.sections ?? []) {
        expect(new Set(section.criteria.map(criterion => criterion.id)).size).toBe(section.criteria.length)
        for (const criterion of section.criteria) {
          expect(criterion.id.length).toBeGreaterThan(0)
          expect(criterion.requirement.length).toBeGreaterThan(0)
          expect(['semantic', 'manual']).toContain(criterion.execution)
          expect(criterion.execution).not.toBe('deterministic')
        }
      }
      const slotIds = new Set(template.materialSlots.map(slot => slot.id))
      for (const slot of template.materialSlots) {
        expect(slot.minCount).toBeLessThanOrEqual(slot.maxCount)
        if (slot.sectionId) expect(sectionIds.has(slot.sectionId)).toBe(true)
      }
      for (const field of template.fields) {
        if (field.sectionId) expect(sectionIds.has(field.sectionId)).toBe(true)
      }
      expect(slotIds.size).toBe(template.materialSlots.length)
    }
  })

  it('validates workflow transitions and reachability', () => {
    for (const { template } of entries) {
      const stages = template.stages
      const ids = new Set(stages.map(stage => stage.id))
      expect(ids.size).toBe(stages.length)
      for (const stage of stages) {
        if (stage.nextStageId) expect(ids.has(stage.nextStageId)).toBe(true)
        if (stage.returnToStageId) expect(ids.has(stage.returnToStageId)).toBe(true)
        expect(stage.workflowOwner).toBe('local')
      }
      let current: string | undefined = stages[0]?.id
      const seen = new Set<string>()
      while (current) {
        expect(seen.has(current)).toBe(false)
        seen.add(current)
        current = stages.find(stage => stage.id === current)?.nextStageId
      }
      expect(seen.size).toBe(stages.length)
    }
  })

  it('keeps complete source metadata separate from case SourceRef and maps every criterion', () => {
    for (const { template, metadata } of entries) {
      expect(String(metadata.templateId)).toBe(String(template.templateId))
      expect(String(metadata.name)).toBe(String(template.name))
      expect(String(metadata.sourceDocumentPath)).toBe(`docs/design/review-agent/business-templates/R02/${template.templateId}.md`)
      expect(metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(metadata.officialSchoolTemplate).toBe(false)
      expect(metadata.policyEvidenceStatus).toBe('PARTIAL')
      const criteria = (template.sections ?? []).flatMap(section => section.criteria.map(criterion => ({
        sectionId: section.id,
        criterionId: criterion.id,
      })))
      expect(Number(metadata.criteria.length)).toBe(criteria.length)
      for (const mapping of metadata.criteria) {
        expect(mapping.sourceRuleId).toMatch(/^R\d{3}$/)
        expect(Array.isArray(mapping.srcIds)).toBe(true)
        expect(['VERIFIED', 'PARTIAL', 'UNCONFIRMED']).toContain(mapping.evidenceStatus)
        const section = (template.sections ?? []).find(s => s.id === mapping.sectionId)
        expect(section).toBeDefined()
        expect(section!.criteria.some(c => c.id === mapping.criterionId)).toBe(true)
      }
    }
  })

  it('never enables auto-pass or invents a PolicyVersion for unconfirmed policy', () => {
    for (const { template, metadata } of entries) {
      expect(template.policyVersionIds).toEqual([])
      expect(template.autoPassPolicy?.enabled).toBe(false)
      expect(metadata.officialSchoolTemplate).toBe(false)
      for (const mapping of metadata.criteria) {
        if (mapping.evidenceStatus === 'UNCONFIRMED') {
          const criterion = template.sections?.find(s => s.id === mapping.sectionId)?.criteria.find(c => c.id === mapping.criterionId)
          expect(criterion?.execution).toBe('manual')
        }
      }
    }
  })
})
