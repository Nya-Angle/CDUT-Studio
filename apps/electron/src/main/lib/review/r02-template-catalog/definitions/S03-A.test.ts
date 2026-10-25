import { describe, expect, test } from 'bun:test'
import { validateTemplate } from '../../template-store'
import { templateVersion as template1, r02Metadata as metadata1 } from './S03-T01'
import { templateVersion as template2, r02Metadata as metadata2 } from './S03-T02'
import { templateVersion as template3, r02Metadata as metadata3 } from './S03-T03'
import { templateVersion as template4, r02Metadata as metadata4 } from './S03-T04'
import { templateVersion as template5, r02Metadata as metadata5 } from './S03-T05'

const entries = [
  { template: template1, metadata: metadata1 },
  { template: template2, metadata: metadata2 },
  { template: template3, metadata: metadata3 },
  { template: template4, metadata: metadata4 },
  { template: template5, metadata: metadata5 }
]
const expected = {
  'S03-T01': { name: "综合素质测评及分项加扣分材料审核", fields: 32, materials: 18, criteria: 23, stages: 7, sha: 'aa31ced10d50c726dd2a8f3cdd4b2210b40eadd44a7ceb3e2a443e959aa9f571' },
  'S03-T02': { name: "国家奖学金（含研究生对应情形）申报审核", fields: 28, materials: 19, criteria: 25, stages: 7, sha: 'a7e54f29484ddca35dcd8625e991be91f167324a38acf273caede8c870fe9054' },
  'S03-T03': { name: "国家励志奖学金申报审核", fields: 44, materials: 24, criteria: 36, stages: 8, sha: '2a0975ee82cfbdfb892bad3057f0dc2bb54a9d2ca07a5b93f6ba3fd76f325944' },
  'S03-T04': { name: "校院及专项奖学金（含研究生学业奖学金）评审", fields: 51, materials: 34, criteria: 34, stages: 6, sha: 'a9950cfcb68265a527f6e6a18d569518083fda5f78e33500a4e61d27c06acd7f' },
  'S03-T05': { name: "学生先进个人、荣誉称号及评优资格审核", fields: 42, materials: 28, criteria: 38, stages: 8, sha: '6374543295c0ecd3d689235e196d667ca2d040889b6fea1fb778cf12083a7f83' }
} as const

describe('R02 S03-A template definitions', () => {
  test('IDs, official names, source metadata, and per-template counts are stable', () => {
    expect(entries.map(({ template }) => template.templateId)).toEqual(['S03-T01', 'S03-T02', 'S03-T03', 'S03-T04', 'S03-T05'])
    expect(new Set(entries.map(({ template }) => template.templateId)).size).toBe(entries.length)
    expect(new Set(entries.map(({ template }) => template.name)).size).toBe(entries.length)
    for (const { template, metadata } of entries) {
      const expectedEntry = expected[template.templateId as keyof typeof expected]
      expect(template.name).toBe(expectedEntry.name)
      expect(template.schemaVersion).toBe(2)
      expect(template.catalogKind).toBe('builtin')
      expect(template.status).toBe('draft')
      expect(template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(template.autoPassPolicy?.enabled).toBe(false)
      expect(template.policyVersionIds).toEqual([])
      expect(metadata.officialSchoolTemplate).toBe(false)
      expect(metadata.templateId).toBe(template.templateId)
      expect(metadata.name).toBe(template.name)
      expect(metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(metadata.sourceDocumentSha256).toBe(expectedEntry.sha)
      expect(metadata.sourceDocumentPath).toBe('docs/design/review-agent/business-templates/R02/' + template.templateId + '.md')
      expect(metadata.policyEvidenceStatus).toBe('PARTIAL')
      expect(template.fields).toHaveLength(expectedEntry.fields)
      expect(template.materialSlots).toHaveLength(expectedEntry.materials)
      expect(template.sections?.flatMap(section => section.criteria)).toHaveLength(expectedEntry.criteria)
      expect(template.stages).toHaveLength(expectedEntry.stages)
    }
  })
  test('preserves source-explicit requiredness without promoting conditional fields', () => {
    expect(template1.fields.find(field => field.key === 'f001')?.required).toBe(true)
    expect(template2.fields.find(field => field.key === 'f001')?.required).toBe(true)
    expect(template3.fields.find(field => field.key === 'f001')?.required).toBe(true)
    expect(template5.fields.find(field => field.key === 'f001')?.required).toBe(true)
    expect(template1.fields.find(field => field.key === 'f005')?.required).toBe(false)
  })
  test('validateTemplate reports no structural errors and all stages are reachable', () => {
    for (const { template } of entries) {
      const issues = validateTemplate(template)
      expect(issues.filter(issue => issue.level === 'error')).toEqual([])
      const stageById = new Map<string, (typeof template.stages)[number]>(template.stages.map(stage => [stage.id, stage] as const))
      const visited = new Set<string>()
      let next: string | undefined = template.stages[0]?.id
      while (next) {
        expect(visited.has(next)).toBe(false)
        visited.add(next)
        next = stageById.get(next)?.nextStageId
      }
      expect(visited.size).toBe(template.stages.length)
      expect(template.stages.every(stage => stage.workflowOwner === 'local')).toBe(true)
      expect(template.stages.every(stage => stage.executorRole === 'reviewer' || stage.executorRole === 'teacher')).toBe(true)
    }
  })
  test('all source field/material references and SRC mappings resolve', () => {
    for (const { template, metadata } of entries) {
      const criteria = template.sections?.flatMap(section => section.criteria) ?? []
      const criterionIds = new Set(criteria.map(criterion => criterion.id))
      expect(new Set(template.fields.map(field => field.key)).size).toBe(template.fields.length)
      expect(new Set(template.materialSlots.map(slot => slot.id)).size).toBe(template.materialSlots.length)
      expect(new Set(criteria.map(criterion => criterion.id)).size).toBe(criteria.length)
      expect(metadata.criteria).toHaveLength(criteria.length)
      for (const mapping of metadata.criteria) {
        expect(template.sections?.some(section => section.id === mapping.sectionId && section.criteria.some(c => c.id === mapping.criterionId))).toBe(true)
        expect(criterionIds.has(mapping.criterionId)).toBe(true)
        expect(mapping.sourceIds.length).toBeGreaterThan(0)
        expect(mapping.sourceIds.every(sourceId => metadata.sourceIds.includes(sourceId))).toBe(true)
        expect(mapping.fieldIds.every(fieldId => metadata.fieldIds.includes(fieldId))).toBe(true)
        expect(mapping.materialIds.every(materialId => metadata.materialIds.includes(materialId))).toBe(true)
        expect(['verified', 'partial', 'unconfirmed']).toContain(mapping.evidenceStatus)
        const criterion = criteria.find(c => c.id === mapping.criterionId)
        if (mapping.evidenceStatus === 'unconfirmed') expect(criterion?.execution).toBe('manual')
      }
    }
  })
  test('unknown policy cannot auto-pass or create a formal decision; deterministic execution is absent', () => {
    for (const { template, metadata } of entries) {
      expect(template.autoPassPolicy?.enabled).toBe(false)
      expect(template.policyVersionIds).toEqual([])
      expect(template.policyRefs).toBeUndefined()
      expect(template.sections?.flatMap(section => section.criteria).every(c => c.execution === 'semantic' || c.execution === 'manual')).toBe(true)
      expect(metadata.policyEvidenceStatus).toBe('PARTIAL')
      expect(template.outputs.some(output => output.kind === 'item-feedback' || output.kind === 'supplement-list')).toBe(true)
    }
  })
})
