import { describe, expect, test } from 'bun:test'
import { validateTemplate } from '../../template-store'
import { S02T01, r02Metadata as meta01 } from './S02-T01'
import { S02T02, r02Metadata as meta02 } from './S02-T02'
import { S02T03, r02Metadata as meta03 } from './S02-T03'
import { S02T04, r02Metadata as meta04 } from './S02-T04'
import { S02T05, r02Metadata as meta05 } from './S02-T05'

const batches = [
  { template: S02T01, metadata: meta01, name: '缓考及考试时间例外安排申请审核', fields: 46, materials: 30, criteria: 31, policy: 'PARTIAL' },
  { template: S02T02, metadata: meta02, name: '免考与特殊考试条件资格审核', fields: 48, materials: 31, criteria: 54, policy: 'PARTIAL' },
  { template: S02T03, metadata: meta03, name: '课程免修、免听资格审核', fields: 24, materials: 16, criteria: 22, policy: 'PARTIAL' },
  { template: S02T04, metadata: meta04, name: '课程替代及学业修读方案个体调整审核', fields: 42, materials: 23, criteria: 36, policy: 'PARTIAL' },
  { template: S02T05, metadata: meta05, name: '校外、跨校及交换学习课程学分认定审核', fields: 35, materials: 18, criteria: 28, policy: 'UNCONFIRMED' },
] as const

const sectionIdsFor = (template: { sections?: Array<{ id: string }> }) =>
  new Set((template.sections ?? []).map((s) => s.id))

describe('R02 S02-A local research template definitions', () => {
  test('template IDs, official names, and expected component counts are stable and unique', () => {
    expect(new Set(batches.map((b) => b.template.templateId)).size).toBe(5)
    expect(new Set(batches.map((b) => b.template.name)).size).toBe(5)
    for (const b of batches) {
      expect(b.template.templateId).toMatch(/^S02-T0[1-5]$/)
      expect(b.template.name).toBe(b.name)
      expect(b.template.schemaVersion).toBe(2)
      expect(b.template.catalogKind).toBe('builtin')
      expect(b.template.status).toBe('draft')
      expect(b.template.fields).toHaveLength(b.fields)
      expect(b.template.materialSlots).toHaveLength(b.materials)
      expect(b.template.sections?.flatMap((s) => s.criteria)).toHaveLength(b.criteria)
    }
  })

  test('field, material-slot, section, and criterion identifiers/references have no dangling links', () => {
    for (const b of batches) {
      const { template } = b
      const fieldIds = new Set(template.fields.map((f) => f.key.toUpperCase()))
      const slotIds = new Set(template.materialSlots.map((m) => m.id.toUpperCase()))
      const sectionIds = sectionIdsFor(template)
      const criterionIds = (template.sections ?? []).flatMap((s) => s.criteria.map((c) => c.id))
      expect(new Set(template.fields.map((f) => f.key)).size).toBe(template.fields.length)
      expect(new Set(template.materialSlots.map((m) => m.id)).size).toBe(template.materialSlots.length)
      expect(sectionIds.size).toBe((template.sections ?? []).length)
      expect(new Set(criterionIds).size).toBe(criterionIds.length)
      for (const section of template.sections ?? []) {
        expect(section.criteria.length).toBeGreaterThan(0)
        for (const criterion of section.criteria) {
          expect(['semantic', 'manual']).toContain(criterion.execution)
          for (const id of criterion.requirement.match(/\bF\d{3}\b/g) ?? []) expect(fieldIds.has(id)).toBe(true)
          for (const id of criterion.requirement.match(/\bM\d{3}\b/g) ?? []) expect(slotIds.has(id.toUpperCase())).toBe(true)
        }
      }
      for (const stage of template.stages) {
        if (stage.nextStageId) expect(template.stages.some((s) => s.id === stage.nextStageId)).toBe(true)
        if (stage.returnToStageId) expect(template.stages.some((s) => s.id === stage.returnToStageId)).toBe(true)
        expect(stage.workflowOwner).toBe('local')
        expect(['reviewer', 'teacher']).toContain(stage.executorRole)
      }
      const reached = new Set<string>()
      let cursor: string | undefined = template.stages[0]?.id
      while (cursor && !reached.has(cursor)) {
        reached.add(cursor)
        cursor = template.stages.find((s) => s.id === cursor)?.nextStageId
      }
      expect(reached.size).toBe(template.stages.length)
      expect(sectionIds.size).toBeGreaterThan(0)
    }
  })

  test('source metadata maps every criterion to source IDs and an evidence status', () => {
    for (const b of batches) {
      const { template, metadata } = b
      expect(String(metadata.templateId)).toBe(String(template.templateId))
      expect(String(metadata.name)).toBe(String(template.name))
      expect(String(metadata.sourceDocumentPath)).toBe(`docs/design/review-agent/business-templates/R02/${template.templateId}.md`)
      expect(metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(metadata.officialSchoolTemplate).toBe(false)
      expect(metadata.policyEvidenceStatus).toBe(b.policy)
      const criteria = (template.sections ?? []).flatMap((s) => s.criteria)
      const knownSources = new Set(metadata.sources.map((source) => source.id))
      expect(metadata.criteria).toHaveLength(criteria.length)
      for (const criterion of criteria) {
        const row = metadata.criteria.find((m) => m.criterionId === criterion.id)
        expect(row).toBeDefined()
        expect(sectionIdsFor(template).has(row!.sectionId)).toBe(true)
        expect(['PARTIAL', 'UNCONFIRMED']).toContain(row!.evidenceStatus)
        for (const sourceId of row!.sourceIds) { expect(sourceId).toMatch(/^SRC-\d{3}$/); expect(knownSources.has(sourceId)).toBe(true) }
      }
    }
  })

  test('policy-uncertain templates cannot auto-pass or masquerade as policy-published versions', () => {
    for (const b of batches) {
      const { template, metadata } = b
      expect(template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(template.autoPassPolicy).toEqual({ enabled: false })
      expect(template.policyVersionIds).toEqual([])
      expect(template.policyRefs).toEqual([])
      expect(template.stages.every((s) => s.kind === 'manual-review')).toBe(true)
      expect(template.sections?.flatMap((s) => s.criteria).every((c) => c.execution !== 'deterministic')).toBe(true)
      expect(metadata.officialSchoolTemplate).toBe(false)
      expect(metadata.policyEvidenceStatus).not.toBe('VERIFIED')
      expect(template.status).toBe('draft')
    }
  })

  test('all generated definitions pass validateTemplate without errors', () => {
    for (const b of batches) {
      const errors = validateTemplate(b.template).filter((issue) => issue.level === 'error')
      expect(errors).toEqual([])
    }
  })
})
