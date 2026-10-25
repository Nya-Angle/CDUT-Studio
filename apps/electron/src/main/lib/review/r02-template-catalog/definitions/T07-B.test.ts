import { describe, expect, test } from 'bun:test'
import { validateTemplate } from '../../template-store'
import { templateVersion as T05, r02Metadata as M05 } from './T07-T05'
import { templateVersion as T06, r02Metadata as M06 } from './T07-T06'
import { templateVersion as T08, r02Metadata as M08 } from './T07-T08'

const definitions = [
  { template: T05, metadata: M05, id: 'T07-T05', name: '单位官方新媒体账号开设、变更及注销审核', rules: 23, fields: 29, slots: 17 },
  { template: T06, metadata: M06, id: 'T07-T06', name: '非科研专属官方公告、新闻及宣传发布审核', rules: 30, fields: 42, slots: 24 },
  { template: T08, metadata: M08, id: 'T07-T08', name: '教职工代表大会代表提案征集、立案及办理反馈审核', rules: 34, fields: 42, slots: 27 },
] as const

describe('R02 T07-B template definitions', () => {
  test('template IDs and formal names are unique and stable', () => {
    expect(new Set(definitions.map((item) => item.id)).size).toBe(3)
    expect(new Set(definitions.map((item) => item.name)).size).toBe(3)
    for (const item of definitions) {
      expect(item.template.templateId).toBe(item.id)
      expect(item.template.name).toBe(item.name)
      expect(item.template.schemaVersion).toBe(2)
      expect(item.template.version).toBe(1)
      expect(item.template.catalogKind).toBe('builtin')
      expect(item.template.status).toBe('draft')
    }
  })

  for (const item of definitions) {
    test(item.id + ' validates structure, references, metadata and workflow', () => {
      const template = item.template
      const metadata = item.metadata
      const fields = new Set(template.fields.map((field) => field.key))
      const slots = new Set(template.materialSlots.map((slot) => slot.id))
      const criteria = template.sections?.flatMap((section) => section.criteria) ?? []
      const criterionIds = criteria.map((criterion) => criterion.id)
      const sources = new Set(metadata.sources.map((source) => source.sourceId))
      const metadataKeys = new Set(metadata.criteria.map((criterion) => criterion.sectionId + ':' + criterion.criterionId))

      expect(template.fields).toHaveLength(item.fields)
      expect(template.materialSlots).toHaveLength(item.slots)
      expect(criteria).toHaveLength(item.rules)
      expect(new Set(fields).size).toBe(template.fields.length)
      expect(new Set(slots).size).toBe(template.materialSlots.length)
      expect(new Set(criterionIds).size).toBe(criteria.length)
      expect(metadata.templateId).toBe(item.id)
      expect(metadata.name).toBe(item.name)
      expect(metadata.sourceDocumentPath).toBe('docs/design/review-agent/business-templates/R02/' + item.id + '.md')
      expect(metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(metadata.officialSchoolTemplate).toBe(false)
      expect(metadata.policyEvidenceStatus).toBe('PARTIAL')
      expect(metadata.criteria).toHaveLength(criteria.length)
      expect(new Set(metadataKeys).size).toBe(criteria.length)
      expect(metadata.criteria.every((criterion) => criterion.sectionId === 'rule-checks')).toBe(true)
      expect(metadata.criteria.every((criterion) => criterionIds.includes(criterion.criterionId))).toBe(true)
      expect(metadata.criteria.every((criterion) => ['VERIFIED', 'PARTIAL', 'UNCONFIRMED'].includes(criterion.evidenceStatus))).toBe(true)
      expect(metadata.criteria.every((criterion) => criterion.sourceIds.length > 0)).toBe(true)
      expect(metadata.criteria.every((criterion) => criterion.sourceIds.every((sourceId) => sources.has(sourceId)))).toBe(true)

      const requirementText = criteria.map((criterion) => criterion.requirement).join(' ')
      const fieldRefs = [...new Set(requirementText.match(/\bF\d{3}\b/g) ?? [])]
      const slotRefs = [...new Set(requirementText.match(/\bM\d{3}\b/g) ?? [])]
      expect(fieldRefs.every((fieldId) => fields.has(fieldId))).toBe(true)
      expect(slotRefs.every((slotId) => slots.has(slotId))).toBe(true)

      const stageIds = new Set(template.stages.map((stage) => stage.id))
      expect(template.stages.length).toBeGreaterThan(0)
      expect(new Set(template.stages.map((stage) => stage.id)).size).toBe(template.stages.length)
      expect(template.stages.every((stage) => stage.workflowOwner === 'local')).toBe(true)
      expect(template.stages.every((stage) => !stage.nextStageId || stageIds.has(stage.nextStageId))).toBe(true)
      expect(template.stages.every((stage) => !stage.returnToStageId || stageIds.has(stage.returnToStageId))).toBe(true)
      expect(['reviewer', 'teacher']).toContain(template.stages[template.stages.length - 1]?.executorRole ?? '')
      expect(template.stages[template.stages.length - 1]?.kind).toBe('finalize')
      const reachable = new Set<string>()
      let current = template.stages[0]?.id
      while (current) {
        expect(reachable.has(current)).toBe(false)
        reachable.add(current)
        current = template.stages.find((stage) => stage.id === current)?.nextStageId
      }
      expect(reachable.size).toBe(template.stages.length)

      expect(template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(template.policyVersionIds).toEqual([])
      expect(template.autoPassPolicy?.enabled).toBe(false)
      expect(template.outputs.length).toBeGreaterThan(0)
      expect(criteria.every((criterion) => criterion.execution === 'semantic' || criterion.execution === 'manual')).toBe(true)
      expect(validateTemplate(template).filter((issue) => issue.level === 'error')).toEqual([])
    })
  }

  test('unconfirmed school policy cannot become automatic formal approval', () => {
    for (const item of definitions) {
      expect(item.metadata.policyEvidenceStatus).not.toBe('VERIFIED')
      expect(item.template.policyVersionIds).toEqual([])
      expect(item.template.autoPassPolicy?.enabled).toBe(false)
      expect(item.template.stages.some((stage) => stage.kind === 'manual-review' && (stage.executorRole === 'reviewer' || stage.executorRole === 'teacher'))).toBe(true)
      expect((item.template.sections ?? []).flatMap((section) => section.criteria).every((criterion) => criterion.execution !== 'deterministic')).toBe(true)
    }
  })
})
