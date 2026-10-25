import { describe, expect, test } from 'bun:test'
import { validateTemplate } from '../../template-store'
import { template as t05, r02Metadata as m05 } from './S04-T05'
import { template as t06, r02Metadata as m06 } from './S04-T06'
import { template as t07, r02Metadata as m07 } from './S04-T07'
import type { TemplateVersion } from '@profer/shared'

const entries: Array<{ template: TemplateVersion; metadata: typeof m05 | typeof m06 | typeof m07 }> = [
  { template: t05, metadata: m05 },
  { template: t06, metadata: m06 },
  { template: t07, metadata: m07 },
]

describe('R02 S04-B template definitions', () => {
  test('template IDs and official names are correct and unique', () => {
    expect(entries.map(x => x.template.templateId)).toEqual(['S04-T05','S04-T06','S04-T07'])
    expect(new Set(entries.map(x => x.template.templateId)).size).toBe(entries.length)
    expect(new Set(entries.map(x => x.template.name)).size).toBe(entries.length)
    expect(t05.sections?.flatMap(s => s.criteria)).toHaveLength(34)
    expect(t06.sections?.flatMap(s => s.criteria)).toHaveLength(22)
    expect(t07.sections?.flatMap(s => s.criteria)).toHaveLength(25)
    for (const { template, metadata } of entries) {
      expect(template.templateId).toBe(metadata.templateId)
      expect(template.name).toBe(metadata.name)
    }
  })

  test('fields, slots, sections and criteria are unique and all typed definitions validate', () => {
    for (const { template, metadata } of entries) {
      expect(new Set(template.fields.map(x => x.key)).size).toBe(template.fields.length)
      expect(template.fields.every(field => field.displayHint?.includes('原稿字段合同'))).toBe(true)
      expect(template.fields.filter(field => field.kind === 'enum').every(field => (field.options?.length ?? 0) > 0)).toBe(true)
      expect(new Set(template.materialSlots.map(x => x.id)).size).toBe(template.materialSlots.length)
      expect(new Set((template.sections ?? []).map(x => x.id)).size).toBe((template.sections ?? []).length)
      const criteria = (template.sections ?? []).flatMap(section => section.criteria.map(criterion => ({ section, criterion })))
      expect(criteria.length).toBeGreaterThan(0)
      expect(new Set(criteria.map(x => x.criterion.id)).size).toBe(criteria.length)
      const fieldKeys = new Set(template.fields.map(x => x.key))
      const slotIds = new Set(template.materialSlots.map(x => x.id))
      for (const field of template.fields) {
        if (field.sectionId) expect((template.sections ?? []).some(x => x.id === field.sectionId)).toBe(true)
      }
      for (const slot of template.materialSlots) {
        if (slot.sectionId) expect((template.sections ?? []).some(x => x.id === slot.sectionId)).toBe(true)
        expect(slot.minCount).toBeLessThanOrEqual(slot.maxCount)
      }
      for (const { criterion } of criteria) {
        if (criterion.dataCheck) expect(slotIds.has(criterion.dataCheck.materialSlotId)).toBe(true)
      }
      expect(fieldKeys.size).toBe(template.fields.length)
      expect(validateTemplate(template).filter(issue => issue.level === 'error')).toEqual([])
      expect(criteria.length).toBe(metadata.criteria.length)
      for (const item of metadata.criteria) {
        expect((template.sections ?? []).some(section => section.id === item.sectionId && section.criteria.some(c => c.id === item.criterionId))).toBe(true)
        expect(item.srcIds.every(id => /^SRC-\d{3}$/.test(id))).toBe(true)
        expect(['VERIFIED','PARTIAL','UNCONFIRMED']).toContain(item.evidenceStatus)
      }
    }
  })

  test('stage graph is reachable and acyclic along nextStageId edges', () => {
    for (const { template } of entries) {
      const stages = template.stages
      const byId = new Map(stages.map(stage => [stage.id, stage]))
      expect(byId.size).toBe(stages.length)
      expect(stages.length).toBeGreaterThan(0)
      const visited = new Set<string>()
      let cursor: string | undefined = stages[0]?.id
      while (cursor) {
        expect(visited.has(cursor)).toBe(false)
        visited.add(cursor)
        cursor = byId.get(cursor)?.nextStageId
        if (cursor) expect(byId.has(cursor)).toBe(true)
      }
      expect(visited.size).toBe(stages.length)
      expect(stages.every(stage => stage.workflowOwner === 'local')).toBe(true)
      expect(stages[stages.length - 1]?.executorRole).toBe('teacher')
    }
  })

  test('source metadata is complete and no policy uncertainty can auto-pass', () => {
    for (const { template, metadata } of entries) {
      expect(metadata.sourceDocumentPath).toContain(template.templateId + '.md')
      expect(metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(metadata.officialSchoolTemplate).toBe(false)
      expect(template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(template.schemaVersion).toBe(2)
      expect(template.catalogKind).toBe('builtin')
      expect(template.status).toBe('draft')
      expect(template.policyVersionIds).toEqual([])
      expect(template.autoPassPolicy).toEqual({ enabled: false })
      expect(template.outputs.every(output => output.kind !== 'approval')).toBe(true)
      expect((template.sections ?? []).flatMap(section => section.criteria).every(c => c.execution !== 'deterministic')).toBe(true)
      expect(metadata.policyEvidenceStatus).toBe('PARTIAL')
      expect(metadata.resultCodes.map(item => item.code).join(',')).toBe('PASS_FACT,NOT_APPLICABLE,NEEDS_MATERIAL,CONFLICT,UNREADABLE,SOURCE_UNAVAILABLE,POLICY_UNCONFIRMED,NEEDS_HUMAN_DECISION')
      expect(metadata.resultCodes.every(item => item.meaning.length > 0 && item.nextAction.length > 0)).toBe(true)
    }
  })
})
