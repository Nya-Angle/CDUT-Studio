import { describe, expect, it } from 'bun:test'
import { validateTemplate } from '../../template-store'
import { templateVersion as t01, r02Metadata as m01 } from './T03-T01'
import { templateVersion as t02, r02Metadata as m02 } from './T03-T02'
import { templateVersion as t03, r02Metadata as m03 } from './T03-T03'
import { templateVersion as t04, r02Metadata as m04 } from './T03-T04'
import { templateVersion as t05, r02Metadata as m05 } from './T03-T05'

const batch = [
  { template: t01, metadata: m01, expectedId: 'T03-T01', expectedName: '纵向科研项目申报、负责人资格和推荐审核' },
  { template: t02, metadata: m02, expectedId: 'T03-T02', expectedName: '纵向科研项目立项任务书与责任承担审核' },
  { template: t03, metadata: m03, expectedId: 'T03-T03', expectedName: '横向科研合同立项与研究合同内容审核' },
  { template: t04, metadata: m04, expectedId: 'T03-T04', expectedName: '科研项目预算调整申请与变更权限审核' },
  { template: t05, metadata: m05, expectedId: 'T03-T05', expectedName: '科研项目研究内容、成员、负责人及期限变更审核' },
]

describe('R02 T03-A template definitions', () => {
  it('preserves the five fixed template IDs and official names', () => {
    expect(batch.map((entry) => entry.template.templateId)).toEqual(batch.map((entry) => entry.expectedId))
    expect(batch.map((entry) => entry.template.name)).toEqual(batch.map((entry) => entry.expectedName))
    expect(new Set(batch.map((entry) => entry.template.templateId)).size).toBe(5)
    expect(new Set(batch.map((entry) => entry.template.name)).size).toBe(5)
  })

  for (const { template, metadata, expectedId, expectedName } of batch) {
    it(`${expectedId} has a valid, conservative draft definition`, () => {
      expect(template.schemaVersion).toBe(2)
      expect(template.name).toBe(expectedName)
      expect(template.catalogKind).toBe('builtin')
      expect(template.status).toBe('draft')
      expect(template.policyVersionIds).toEqual([])
      expect(template.policyRefs ?? []).toEqual([])
      expect(template.autoPassPolicy?.enabled).toBe(false)
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(template.stages.length).toBeGreaterThan(0)
      expect(template.stages.every((stage) => stage.workflowOwner === 'local')).toBe(true)
      expect(template.stages.every((stage) => stage.executorRole === 'reviewer' || stage.executorRole === 'teacher')).toBe(true)
      expect(template.sections?.length).toBeGreaterThan(0)
      expect(validateTemplate(template).filter((issue) => issue.level === 'error')).toEqual([])

      const fields = new Set(template.fields.map((field) => field.key))
      expect(fields.size).toBe(template.fields.length)
      const slots = new Set(template.materialSlots.map((slot) => slot.id))
      expect(slots.size).toBe(template.materialSlots.length)
      expect(template.fields.every((field) => !field.sectionId || template.sections?.some((section) => section.id === field.sectionId))).toBe(true)
      expect(template.materialSlots.every((slot) => !slot.sectionId || template.sections?.some((section) => section.id === slot.sectionId))).toBe(true)

      const stages = new Map(template.stages.map((stage) => [stage.id, stage]))
      expect(stages.size).toBe(template.stages.length)
      for (const stage of template.stages) {
        expect(!stage.nextStageId || stages.has(stage.nextStageId)).toBe(true)
        expect(!stage.returnToStageId || stages.has(stage.returnToStageId)).toBe(true)
      }
      const reached = new Set<string>()
      let cursor: string | undefined = template.stages[0]?.id
      while (cursor) {
        expect(reached.has(cursor)).toBe(false)
        reached.add(cursor)
        cursor = stages.get(cursor)?.nextStageId
      }
      expect(reached.size).toBe(template.stages.length)

      const criteria = template.sections?.flatMap((section) => section.criteria) ?? []
      expect(criteria.length).toBeGreaterThan(0)
      expect(criteria.every((criterion) => criterion.execution === 'semantic' || criterion.execution === 'manual')).toBe(true)
      expect(new Set(criteria.map((criterion) => criterion.id)).size).toBe(criteria.length)
      expect(String(metadata.templateId)).toBe(expectedId)
      expect(String(metadata.name)).toBe(template.name)
      expect(metadata.officialSchoolTemplate).toBe(false)
      expect(metadata.policyEvidenceStatus).toBe('PARTIAL')
      expect(metadata.sourceDocumentPath).toContain(`/R02/${expectedId}.md`)
      expect(metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(Number(metadata.criteria.length)).toBe(criteria.length)
      for (const criterion of criteria) {
        const evidence = metadata.criteria.find((entry) => entry.criterionId === criterion.id)
        expect(evidence).toBeDefined()
        expect(evidence?.sectionId).toBe('review-rules')
        expect(evidence?.srcIds.every((srcId) => /^SRC-\d{3}$/.test(srcId))).toBe(true)
        expect(['VERIFIED', 'PARTIAL', 'UNCONFIRMED']).toContain(String(evidence?.evidenceStatus))
      }
    })
  }
})
