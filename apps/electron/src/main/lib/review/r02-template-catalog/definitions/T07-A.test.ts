import { describe, expect, test } from 'bun:test'
import { validateTemplate } from '../../template-store'
import { templateVersion as t01, r02Metadata as m01 } from './T07-T01'
import { templateVersion as t02, r02Metadata as m02 } from './T07-T02'
import { templateVersion as t03, r02Metadata as m03 } from './T07-T03'
import { templateVersion as t04, r02Metadata as m04 } from './T07-T04'

const entries = [
  { template: t01, metadata: m01 },
  { template: t02, metadata: m02 },
  { template: t03, metadata: m03 },
  { template: t04, metadata: m04 },
] as const

/** 原研究稿用 SRC-001/005 等缩写时，两个来源都必须保留在元数据中。 */
function sourceIdsInRequirement(requirement: string): string[] {
  return [...new Set([...requirement.matchAll(/SRC-(\d{3}(?:[\/、,，]\d{3})*)/g)]
    .flatMap(match => (match[1] ?? '').split(/[\/、,，]/).filter(Boolean).map(part => `SRC-${part}`)))].sort()
}

describe('R02 T07-A local template definitions', () => {
  test('IDs and formal names are correct and unique', () => {
    expect(entries.map(x => x.template.templateId)).toEqual(['T07-T01', 'T07-T02', 'T07-T03', 'T07-T04'])
    expect(new Set(entries.map(x => x.template.templateId)).size).toBe(entries.length)
    expect(new Set(entries.map(x => x.template.name)).size).toBe(entries.length)
    for (const { template, metadata } of entries) {
      expect(String(metadata.templateId)).toBe(template.templateId)
      expect(String(metadata.name)).toBe(template.name)
      expect(template.schemaVersion).toBe(2)
      expect(template.catalogKind).toBe('builtin')
      expect(template.status).toBe('draft')
    }
  })

  test('fields, material slots, sections, and criterion metadata have no dangling references', () => {
    for (const { template, metadata } of entries) {
      const fieldKeys = template.fields.map(field => field.key)
      const slotIds = template.materialSlots.map(slot => slot.id)
      const sectionIds = template.sections?.map(section => section.id) ?? []
      expect(new Set(fieldKeys).size).toBe(fieldKeys.length)
      expect(new Set(slotIds).size).toBe(slotIds.length)
      expect(new Set(sectionIds).size).toBe(sectionIds.length)
      for (const field of template.fields) if (field.sectionId) expect(sectionIds).toContain(field.sectionId)
      for (const slot of template.materialSlots) {
        if (slot.sectionId) expect(sectionIds).toContain(slot.sectionId)
        expect(slot.minCount).toBeLessThanOrEqual(slot.maxCount)
      }
      const criteria = (template.sections ?? []).flatMap(section => section.criteria.map(criterion => ({ sectionId: section.id, criterion })))
      const criterionIds = criteria.map(x => x.criterion.id)
      expect(new Set(criterionIds).size).toBe(criterionIds.length)
      expect(Number(metadata.criteria.length)).toBe(criteria.length)
      for (const { sectionId, criterion } of criteria) {
        const meta = metadata.criteria.find(x => x.sectionId === sectionId && x.criterionId === criterion.id)
        expect(meta).toBeDefined()
        expect(Array.isArray(meta?.srcIds)).toBe(true)
        expect(meta?.srcIds.every(srcId => (metadata.sourceIds as readonly string[]).includes(srcId))).toBe(true)
        const mappedSrcIds: string[] = meta ? [...meta.srcIds] : []
        expect(mappedSrcIds.sort()).toEqual(sourceIdsInRequirement(criterion.requirement))
        expect(['semantic', 'manual']).toContain(criterion.execution)
        expect(criterion.execution).not.toBe('deterministic')
      }
      expect(Number(metadata.fieldIds.length)).toBe(fieldKeys.length)
      expect(Number(metadata.materialSlotIds.length)).toBe(slotIds.length)
    }
  })

  test('stage graphs are reachable, legal, and terminate at a local human gate', () => {
    for (const { template } of entries) {
      const stages = template.stages
      const stageIds = stages.map(stage => stage.id)
      expect(stages.length).toBeGreaterThan(0)
      expect(new Set(stageIds).size).toBe(stageIds.length)
      for (const stage of stages) {
        if (stage.nextStageId) expect(stageIds).toContain(stage.nextStageId)
        if (stage.returnToStageId) expect(stageIds).toContain(stage.returnToStageId)
        expect(stage.workflowOwner).toBe('local')
      }
      const byId = new Map(stages.map(stage => [stage.id, stage] as const))
      const reached = new Set<string>()
      let current: string | undefined = stages[0]?.id
      while (current) {
        expect(reached.has(current)).toBe(false)
        reached.add(current)
        current = byId.get(current)?.nextStageId
      }
      expect(reached.size).toBe(stages.length)
      expect(String(stages[stages.length - 1]?.kind)).toBe('finalize')
      expect(String(stages[stages.length - 1]?.executorRole)).toBe('teacher')
    }
  })

  test('source metadata is complete and non-official; no fake PolicyVersion or auto-pass', () => {
    for (const { template, metadata } of entries) {
      expect(metadata.officialSchoolTemplate).toBe(false)
      expect(metadata.sourceDocumentPath).toContain(`business-templates/R02/${template.templateId}.md`)
      expect(metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(metadata.sourceDocumentBytes).toBeGreaterThan(0)
      expect(metadata.sourceOriginalPath).toContain(`research-original/${template.templateId}.md`)
      expect(metadata.policyEvidenceStatus).toBe('PARTIAL')
      expect(template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(template.policyVersionIds).toEqual([])
      expect(template.autoPassPolicy?.enabled).toBe(false)
      expect(template.outputs.length).toBeGreaterThan(0)
      expect(template.outputs.every(output => output.kind === 'item-feedback' || output.kind === 'supplement-list')).toBe(true)
      for (const criterionMeta of metadata.criteria) {
        if (criterionMeta.evidenceStatus === 'UNCONFIRMED') {
          const criterion = template.sections?.find(section => section.id === criterionMeta.sectionId)?.criteria.find(c => c.id === criterionMeta.criterionId)
          expect(criterion?.execution).toBe('manual')
        }
      }
      const errors = validateTemplate(template).filter(issue => issue.level === 'error')
      expect(errors).toEqual([])
    }
  })
})
