import { describe, expect, test } from 'bun:test'
import type { TemplateVersion } from '@profer/shared'
import { validateTemplate } from '../../template-store'
import { template as s03T06, r02Metadata as m03T06 } from './S03-T06'
import { template as s03T07, r02Metadata as m03T07 } from './S03-T07'
import { template as s03T08, r02Metadata as m03T08 } from './S03-T08'
import { template as s03T09, r02Metadata as m03T09 } from './S03-T09'

const entries = [
  { template: s03T06, metadata: m03T06, id: 'S03-T06', name: '家庭经济困难学生资格认定审核' },
  { template: s03T07, metadata: m03T07, id: 'S03-T07', name: '国家助学金和基于困难身份的助学资助审核' },
  { template: s03T08, metadata: m03T08, id: 'S03-T08', name: '国家助学贷款申请校内资格与材料核验' },
  { template: s03T09, metadata: m03T09, id: 'S03-T09', name: '勤工助学岗位申请资格审核' },
] satisfies Array<{
  template: TemplateVersion
  metadata: {
    templateId: string; name: string; sourceDocumentPath: string; sourceDocumentSha256: string
    officialSchoolTemplate: false; policyEvidenceStatus: string
    criteria: readonly { sectionId: string; criterionId: string; srcIds: readonly string[]; fieldIds: readonly string[]; materialSlotIds: readonly string[]; evidenceStatus: string }[]
    sources: readonly { id: string; status: string }[]
  }
  id: string; name: string
}>

describe('R02 S03-B native template definitions', () => {
  test('preserves the four unique formal IDs and names', () => {
    expect(entries.map(entry => entry.template.templateId)).toEqual(entries.map(entry => entry.id))
    expect(entries.map(entry => entry.template.name)).toEqual(entries.map(entry => entry.name))
    expect(new Set(entries.map(entry => entry.template.templateId)).size).toBe(4)
    expect(new Set(entries.map(entry => entry.template.name)).size).toBe(4)
    expect(new Set(entries.map(entry => entry.metadata.templateId)).size).toBe(4)
  })

  test('all definitions pass the repository TemplateVersion validator', () => {
    for (const entry of entries) {
      expect(validateTemplate(entry.template).filter(issue => issue.level === 'error')).toEqual([])
    }
  })

  test('field, material-slot, criterion, and SRC metadata references are not dangling', () => {
    for (const entry of entries) {
      const template = entry.template
      const fieldIds = new Set(template.fields.map(field => field.key))
      const slotIds = new Set(template.materialSlots.map(slot => slot.id))
      const sections = template.sections ?? []
      const sectionIds = new Set(sections.map(section => section.id))
      expect(fieldIds.size).toBe(template.fields.length)
      expect(slotIds.size).toBe(template.materialSlots.length)
      expect(sectionIds.size).toBe(sections.length)
      const criteria = sections.flatMap(section => section.criteria.map(criterion => ({ sectionId: section.id, criterion })))
      const criterionKeys = criteria.map(item => `${item.sectionId}/${item.criterion.id}`)
      expect(new Set(criterionKeys).size).toBe(criterionKeys.length)
      const indexedSourceIds = new Set(entry.metadata.sources.map(source => source.id))
      expect(criteria.length).toBe(entry.metadata.criteria.length)

      for (const { sectionId, criterion } of criteria) {
        for (const match of criterion.requirement.matchAll(/\bF\d{3}\b/g)) expect(fieldIds.has(match[0])).toBe(true)
        for (const match of criterion.requirement.matchAll(/\bM\d{3}\b/g)) expect(slotIds.has(match[0])).toBe(true)
        const mapping = entry.metadata.criteria.find(item => item.sectionId === sectionId && item.criterionId === criterion.id)
        expect(mapping).toBeDefined()
        for (const srcId of mapping!.srcIds) expect(indexedSourceIds.has(srcId)).toBe(true)
        for (const fieldId of mapping!.fieldIds) expect(fieldIds.has(fieldId)).toBe(true)
        for (const slotId of mapping!.materialSlotIds) expect(slotIds.has(slotId)).toBe(true)
        expect(['PARTIAL', 'UNCONFIRMED']).toContain(mapping!.evidenceStatus)
        if (mapping!.evidenceStatus === 'UNCONFIRMED') expect(criterion.execution).toBe('manual')
        if (Number(mapping!.srcIds.length) === 0) expect(mapping!.evidenceStatus).toBe('UNCONFIRMED')
      }
    }
  })

  test('workflow next-stage graph is reachable and all transition references are valid', () => {
    for (const entry of entries) {
      const stages = entry.template.stages
      const ids = new Set(stages.map(stage => stage.id))
      expect(ids.size).toBe(stages.length)
      expect(stages.length).toBeGreaterThan(0)
      for (const stage of stages) {
        if (stage.nextStageId) expect(ids.has(stage.nextStageId)).toBe(true)
        if (stage.returnToStageId) expect(ids.has(stage.returnToStageId)).toBe(true)
        expect(stage.workflowOwner).toBe('local')
      }
      const reachable = new Set<string>()
      let current: TemplateVersion['stages'][number] | undefined = stages[0]
      while (current) {
        expect(reachable.has(current.id)).toBe(false)
        reachable.add(current.id)
        current = current.nextStageId ? stages.find(stage => stage.id === current!.nextStageId) : undefined
      }
      expect(reachable.size).toBe(stages.length)
      expect(['reviewer', 'teacher']).toContain(stages[stages.length - 1]!.executorRole)
      expect(stages[stages.length - 1]!.executorRole).toBe('teacher')
    }
  })

  test('policy uncertainty cannot become automatic formal approval or rejection', () => {
    for (const entry of entries) {
      const template = entry.template
      expect(template.schemaVersion).toBe(2)
      expect(template.catalogKind).toBe('builtin')
      expect(template.status).toBe('draft')
      expect(template.policyVersionIds).toEqual([])
      expect(template.policyRefs ?? []).toEqual([])
      expect(template.autoPassPolicy?.enabled).toBe(false)
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(template.description?.includes('本地研究模板 · 非校方正式模板')).toBe(true)
      expect(entry.metadata.officialSchoolTemplate).toBe(false)
      expect(entry.metadata.sourceDocumentPath.endsWith(`${entry.id}.md`)).toBe(true)
      expect(entry.metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(entry.metadata.policyEvidenceStatus).toBe('PARTIAL')
      expect(template.sections?.flatMap(section => section.criteria).every(criterion => criterion.execution !== 'deterministic')).toBe(true)
      expect(template.sections?.flatMap(section => section.criteria).every(criterion => ['semantic','manual'].includes(criterion.execution))).toBe(true)
    }
  })
})
