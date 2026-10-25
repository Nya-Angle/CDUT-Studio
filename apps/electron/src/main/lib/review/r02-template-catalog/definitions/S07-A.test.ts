import { describe, expect, test } from 'bun:test'
import type { TemplateVersion } from '@profer/shared'
import { validateTemplate } from '../../template-store'
import { S07_T01, r02Metadata as meta01 } from './S07-T01'
import { S07_T02, r02Metadata as meta02 } from './S07-T02'
import { S07_T03, r02Metadata as meta03 } from './S07-T03'
import { S07_T04, r02Metadata as meta04 } from './S07-T04'

const entries: Array<{ template: TemplateVersion; metadata: typeof meta01 | typeof meta02 | typeof meta03 | typeof meta04 }> = [
  { template: S07_T01, metadata: meta01 },
  { template: S07_T02, metadata: meta02 },
  { template: S07_T03, metadata: meta03 },
  { template: S07_T04, metadata: meta04 },
]

describe('R02 S07-A template definitions', () => {
  test('IDs and official names are fixed and unique', () => {
    expect(entries.map(({ template }) => template.templateId)).toEqual(['S07-T01', 'S07-T02', 'S07-T03', 'S07-T04'])
    expect(entries.map(({ template }) => template.name)).toEqual([
      '学生毕业资格、培养方案达成及结业状态核验',
      '本科生学士学位授予资格与申请材料审核',
      '学生离校手续及部门结清记录核验',
      '毕业生档案转递及收件人身份核验',
    ])
    expect(new Set(entries.map(({ template }) => template.templateId)).size).toBe(4)
    expect(new Set(entries.map(({ template }) => template.name)).size).toBe(4)
  })

  test('each definition passes validateTemplate without errors', () => {
    for (const { template } of entries) {
      const errors = validateTemplate(template).filter((issue) => issue.level === 'error')
      expect(errors, template.templateId).toEqual([])
    }
  })

  test('field, slot, section and criterion references are unique and non-dangling', () => {
    for (const { template, metadata } of entries) {
      const fields = new Set(template.fields.map((item) => item.key))
      const slots = new Set(template.materialSlots.map((item) => item.id))
      const sections = new Set((template.sections ?? []).map((item) => item.id))
      expect(fields.size).toBe(template.fields.length)
      expect(slots.size).toBe(template.materialSlots.length)
      expect(sections.size).toBe((template.sections ?? []).length)
      for (const item of template.fields) if (item.sectionId) expect(sections.has(item.sectionId)).toBe(true)
      for (const item of template.materialSlots) if (item.sectionId) expect(sections.has(item.sectionId)).toBe(true)

      const allCriteria = (template.sections ?? []).flatMap((section) => section.criteria.map((item) => ({ sectionId: section.id, criterion: item })))
      const criterionIds = allCriteria.map(({ criterion }) => criterion.id)
      expect(new Set(criterionIds).size).toBe(criterionIds.length)
      expect(metadata.criteria.length).toBe(allCriteria.length)
      const sourceIds = new Set(metadata.sources.map((item) => item.srcId))
      for (const { sectionId, criterion } of allCriteria) {
        const mapping = metadata.criteria.find((item) => item.sectionId === sectionId && item.criterionId === criterion.id)
        expect(mapping).toBeDefined()
        expect(mapping!.srcIds.length).toBeGreaterThan(0)
        expect(mapping!.srcIds.every((id) => sourceIds.has(id))).toBe(true)
        expect(['semantic', 'manual']).toContain(criterion.execution)
      }
    }
  })

  test('stage graph is reachable and every final stage is local human review', () => {
    for (const { template } of entries) {
      const byId = new Map(template.stages.map((stage) => [stage.id, stage]))
      expect(new Set(template.stages.map((stage) => stage.id)).size).toBe(template.stages.length)
      for (const stage of template.stages) {
        if (stage.nextStageId) expect(byId.has(stage.nextStageId)).toBe(true)
        if (stage.returnToStageId) expect(byId.has(stage.returnToStageId)).toBe(true)
      }
      const visited = new Set<string>()
      let current = template.stages[0]?.id
      while (current) {
        expect(visited.has(current)).toBe(false)
        visited.add(current)
        current = byId.get(current)?.nextStageId
      }
      expect(visited.size).toBe(template.stages.length)
      const finalStage = template.stages.at(-1)
      expect(finalStage?.executorRole === 'reviewer' || finalStage?.executorRole === 'teacher').toBe(true)
      expect(finalStage?.workflowOwner).toBe('local')
    }
  })

  test('source metadata is complete and templates remain non-official draft-only', () => {
    const expectedHashes = [
      'cf41b7dffdcc4a9464dde3017f88b82835c8d96e455bbd87aa2e6fc121c4d9fd',
      // S07-T02 已补充 F/M/R 对照附录；旧哈希保存在 source-hash-differences 台账。
      'fb5e13f2580a34bebc46bcd9fbdb37e560c163966dcf14fe106df8d4c2c484ff',
      '3dc29829f0d509cd2e7ae1b058b9bd5b79926b643dd1c5b24831820e9e042c4b',
      '0d7f3127a64ff75b8c0ba242eff78ecacf23bae09d41764251d2462e0e827065',
    ]
    for (const [index, { template, metadata }] of entries.entries()) {
      expect(String(metadata.templateId)).toBe(template.templateId)
      expect(String(metadata.name)).toBe(template.name)
      expect(metadata.sourceDocumentPath).toContain(`/${template.templateId}.md`)
      expect(String(metadata.sourceDocumentSha256)).toBe(String(expectedHashes[index]))
      expect(metadata.officialSchoolTemplate).toBe(false)
      expect(metadata.policyEvidenceStatus).not.toBe('VERIFIED')
      expect(metadata.criteria.every((item) => item.srcIds.length > 0)).toBe(true)
      expect(template.schemaVersion).toBe(2)
      expect(template.catalogKind).toBe('builtin')
      expect(template.status).toBe('draft')
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(template.autoPassPolicy?.enabled).toBe(false)
      expect(template.policyVersionIds).toEqual([])
      expect(template.policyRefs).toBeUndefined()
      expect(template.outputs.some((output) => output.kind === 'approval')).toBe(false)
    }
  })
})
