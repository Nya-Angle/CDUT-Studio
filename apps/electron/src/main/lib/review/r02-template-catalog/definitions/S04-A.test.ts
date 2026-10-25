import { describe, expect, test } from 'bun:test'
import { validateTemplate } from '../../template-store'
import { templateVersion as S04T01, r02Metadata as S04T01Meta } from './S04-T01'
import { templateVersion as S04T02, r02Metadata as S04T02Meta } from './S04-T02'
import { templateVersion as S04T03, r02Metadata as S04T03Meta } from './S04-T03'
import { templateVersion as S04T04, r02Metadata as S04T04Meta } from './S04-T04'

const definitions = [
  { template: S04T01, metadata: S04T01Meta, expectedId: 'S04-T01', expectedName: '学生请假、长短期病假、续假、销假与返校核验', expectedRules: 38 },
  { template: S04T02, metadata: S04T02Meta, expectedId: 'S04-T02', expectedName: '校外住宿与安全责任申请审核', expectedRules: 35 },
  { template: S04T03, metadata: S04T03Meta, expectedId: 'S04-T03', expectedName: '宿舍调整、调换及特殊住宿安排审核', expectedRules: 18 },
  { template: S04T04, metadata: S04T04Meta, expectedId: 'S04-T04', expectedName: '假期留宿与临时住宿申请审核', expectedRules: 25 }
]

describe('R02 S04-A template definitions', () => {
  test('IDs, formal names, metadata and source snapshots are complete and unique', () => {
    expect(new Set(definitions.map(item => item.template.templateId)).size).toBe(4)
    expect(new Set(definitions.map(item => item.template.name)).size).toBe(4)
    for (const item of definitions) {
      expect(item.template.templateId).toBe(item.expectedId)
      expect(item.template.name).toBe(item.expectedName)
      expect(item.template.schemaVersion).toBe(2)
      expect(item.template.catalogKind).toBe('builtin')
      expect(item.template.status).toBe('draft')
      expect(item.template.policyVersionIds).toEqual([])
      expect(item.template.autoPassPolicy?.enabled).toBe(false)
      expect(item.template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(item.template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(item.metadata.templateId).toBe(item.expectedId)
      expect(item.metadata.name).toBe(item.expectedName)
      expect(item.metadata.officialSchoolTemplate).toBe(false)
      expect(item.metadata.sourceDocumentPath).toContain('business-templates/R02/' + item.expectedId + '.md')
      expect(item.metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(item.metadata.sourceDocumentBytes).toBeGreaterThan(0)
      expect(item.metadata.policyEvidenceStatus).toBe('PARTIAL')
      expect(item.metadata.sources.length).toBeGreaterThan(0)
      expect(item.metadata.criteria.length).toBe(item.expectedRules)
      expect(item.template.sections?.flatMap(section => section.criteria).length).toBe(item.expectedRules)
    }
  })
  test('fields, material slots, criteria, SRC IDs and stage graph have no dangling references', () => {
    for (const item of definitions) {
      const fieldKeys = new Set(item.template.fields.map(field => field.key))
      const slotIds = new Set(item.template.materialSlots.map(slot => slot.id))
      const sourceIds = new Set(item.metadata.sources.map(source => source.id))
      const sectionIds = new Set((item.template.sections ?? []).map(section => section.id))
      const criteria = (item.template.sections ?? []).flatMap(section => section.criteria.map(criterion => ({ section, criterion })))
      const stageIds = new Set(item.template.stages.map(stage => stage.id))
      expect(fieldKeys.size).toBe(item.template.fields.length)
      for (const field of item.template.fields) if (field.kind === 'enum') expect(field.options?.length).toBeGreaterThan(0)
      expect(slotIds.size).toBe(item.template.materialSlots.length)
      expect(stageIds.size).toBe(item.template.stages.length)
      for (const slot of item.template.materialSlots) for (const element of slot.requiredElements) if (/^F\d{3}$/.test(element)) expect(fieldKeys.has(element)).toBe(true)
      for (const { criterion } of criteria) {
        for (const match of criterion.requirement.matchAll(/F\d{3}/g)) expect(fieldKeys.has(match[0])).toBe(true)
        expect(criterion.execution === 'semantic' || criterion.execution === 'manual').toBe(true)
      }
      expect(item.metadata.criteria.length).toBe(criteria.length)
      for (const mapping of item.metadata.criteria) {
        expect(sectionIds.has(mapping.sectionId)).toBe(true)
        expect(criteria.some(entry => entry.section.id === mapping.sectionId && entry.criterion.id === mapping.criterionId)).toBe(true)
        expect(mapping.sourceIds.length).toBeGreaterThan(0)
        for (const sourceId of mapping.sourceIds) expect(sourceIds.has(sourceId)).toBe(true)
        expect(['VERIFIED', 'PARTIAL', 'UNCONFIRMED']).toContain(mapping.evidenceStatus)
      }
      for (const stage of item.template.stages) { expect(stage.workflowOwner).toBe('local'); if (stage.nextStageId) expect(stageIds.has(stage.nextStageId)).toBe(true) }
      const reachable = new Set<string>()
      let next: string | undefined = item.template.stages[0]?.id
      while (next && !reachable.has(next)) { reachable.add(next); next = item.template.stages.find(stage => stage.id === next)?.nextStageId }
      expect(reachable.size).toBe(item.template.stages.length)
      expect(item.template.stages[item.template.stages.length - 1]?.kind).toBe('handoff')
      expect(item.template.stages[item.template.stages.length - 1]?.executorRole).toBe('teacher')
    }
  })
  test('validateTemplate has no errors and unconfirmed policy cannot auto-pass', () => {
    for (const item of definitions) {
      const validation = validateTemplate(item.template)
      expect(validation.filter(issue => issue.level === 'error')).toEqual([])
      expect(item.template.autoPassPolicy?.enabled).toBe(false)
      expect(item.template.policyVersionIds).toEqual([])
      expect(item.template.status).toBe('draft')
      expect(item.template.outputs.some(output => output.kind === 'approval')).toBe(false)
      expect(item.metadata.criteria.every(criterion => criterion.evidenceStatus !== 'UNCONFIRMED' || criterion.execution === 'manual')).toBe(true)
    }
  })
})
