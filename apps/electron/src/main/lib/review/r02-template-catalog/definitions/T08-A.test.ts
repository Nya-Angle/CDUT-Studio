import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'bun:test'
import { validateTemplate } from '../../template-store'
import { template as template1, r02Metadata as metadata1 } from './T08-T01'
import { template as template2, r02Metadata as metadata2 } from './T08-T02'
import { template as template3, r02Metadata as metadata3 } from './T08-T03'
import { template as template4, r02Metadata as metadata4 } from './T08-T04'
import { template as template5, r02Metadata as metadata5 } from './T08-T05'

const definitions = [
  { template: template1, metadata: metadata1 },
  { template: template2, metadata: metadata2 },
  { template: template3, metadata: metadata3 },
  { template: template4, metadata: metadata4 },
  { template: template5, metadata: metadata5 },
]

describe('T08-A R02 template definitions', () => {
  it('preserves unique official IDs and names', () => {
    expect(new Set(definitions.map(({ template }) => template.templateId)).size).toBe(5)
    expect(definitions.map(({ template }) => [template.templateId, template.name])).toEqual([
      ["T08-T01", "科研助理、项目聘用人员招聘岗位立项审核"],
      ["T08-T02", "科研助理、项目编外人员录用与聘用合同核验"],
      ["T08-T03", "项目聘用人员续聘、期限、岗位和薪酬调整审核"],
      ["T08-T04", "项目用工解除、离岗与责任交接审核"],
      ["T08-T05", "团队实验室管理员、岗位负责人及组织授权人变更审核"],
    ])
  })

  it('passes validateTemplate without structural errors', () => {
    for (const { template } of definitions) {
      const errors = validateTemplate(template).filter((issue) => issue.level === 'error')
      expect({ templateId: template.templateId, errors }).toEqual({ templateId: template.templateId, errors: [] })
    }
  })

  it('has no dangling or duplicate field, slot, section, criterion, or stage IDs', () => {
    for (const { template } of definitions) {
      expect(new Set(template.fields.map((field) => field.key)).size).toBe(template.fields.length)
      expect(new Set(template.materialSlots.map((slot) => slot.id)).size).toBe(template.materialSlots.length)
      const sectionIds = new Set((template.sections ?? []).map((section) => section.id))
      expect(sectionIds.size).toBe((template.sections ?? []).length)
      const criteria = (template.sections ?? []).flatMap((section) => section.criteria.map((criterion) => ({ ...criterion, sectionId: section.id })))
      expect(new Set(criteria.map((criterion) => criterion.id)).size).toBe(criteria.length)
      for (const field of template.fields) if (field.sectionId) expect(sectionIds.has(field.sectionId)).toBe(true)
      for (const slot of template.materialSlots) if (slot.sectionId) expect(sectionIds.has(slot.sectionId)).toBe(true)
      const stageIds = new Set(template.stages.map((stage) => stage.id))
      expect(stageIds.size).toBe(template.stages.length)
      for (const stage of template.stages) {
        if (stage.nextStageId) expect(stageIds.has(stage.nextStageId)).toBe(true)
        if (stage.returnToStageId) expect(stageIds.has(stage.returnToStageId)).toBe(true)
      }
    }
  })

  it('has a finite reachable stage graph and local reviewer/teacher terminal', () => {
    for (const { template } of definitions) {
      const byId = new Map(template.stages.map((stage) => [stage.id, stage] as const))
      const seen = new Set<string>()
      let currentId: string | undefined = template.stages[0]?.id
      while (currentId) {
        expect(seen.has(currentId)).toBe(false)
        seen.add(currentId)
        const current = byId.get(currentId)
        expect(current).toBeDefined()
        currentId = current?.nextStageId
      }
      expect(seen.size).toBe(template.stages.length)
      const terminal = template.stages[template.stages.length - 1]
      expect(terminal?.kind === 'finalize' || terminal?.kind === 'handoff').toBe(true)
      expect(terminal?.executorRole === 'reviewer' || terminal?.executorRole === 'teacher').toBe(true)
      expect(template.stages.every((stage) => stage.workflowOwner === 'local')).toBe(true)
    }
  })

  it('has nonofficial metadata and byte-level source SHA-256 matching the reviewed Markdown', async () => {
    for (const { template, metadata } of definitions) {
      expect(template.status).toBe('draft')
      expect(template.catalogKind).toBe('builtin')
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(template.description ?? '').toContain('本地研究模板 · 非校方正式模板')
      expect(template.policyVersionIds).toEqual([])
      expect(template.autoPassPolicy?.enabled).toBe(false)
      expect(metadata.officialSchoolTemplate).toBe(false)
      expect(metadata.policyEvidenceStatus).toBe('PARTIAL')
      expect(metadata.researchEvidenceStatus).toBe('PARTIAL')
      expect(metadata.researchStatus).toBeTruthy()
      expect(['MATCH', 'LINE_ENDING_DRIFT_ONE_LF', 'REVIEWED_PATCH_APPLIED']).toContain(metadata.sourceIntegrityStatus)
      expect(metadata.manifestExpectedSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(metadata.manifestExpectedBytes).toBeGreaterThan(0)
      expect(metadata.sourceRecordCount).toBe(metadata.sourceIds.length)
      expect(metadata.fieldCount).toBe(template.fields.length)
      expect(metadata.materialSlotCount).toBe(template.materialSlots.length)
      expect(metadata.criterionCount).toBe(metadata.criteria.length)
      expect(metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(metadata.manifestExpectedSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(metadata.sourceIds.length).toBeGreaterThan(0)
      expect(metadata.researchEvidenceStatus ?? 'PARTIAL').toBe('PARTIAL')
      expect(metadata.sourceDocumentPath.endsWith(`/${template.templateId}.md`)).toBe(true)
      const bytes = await readFile(metadata.sourceDocumentPath)
      expect(bytes.length).toBe(metadata.sourceDocumentBytes)
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(metadata.sourceDocumentSha256)
    }
  })

  it('maps every criterion to defined research source IDs without policy-version or deterministic-rule fabrication', () => {
    for (const { template, metadata } of definitions) {
      const criteria = (template.sections ?? []).flatMap((section) => section.criteria.map((criterion) => ({ sectionId: section.id, criterionId: criterion.id, execution: criterion.execution })))
      expect(criteria.length).toBe(metadata.criteria.length)
      const sourceIds = new Set(metadata.sourceIds)
      const fieldCodes = new Set(template.fields.map((field) => field.extractionHint?.match(/\bF\d{3}\b/)?.[0] ?? field.label.match(/\bF\d{3}\b/)?.[0]).filter((id): id is string => Boolean(id)))
      const materialCodes = new Set(template.materialSlots.map((slot) => slot.name.match(/\bM\d{3}\b/)?.[0] ?? slot.id.toUpperCase()))
      for (const section of template.sections ?? []) for (const criterion of section.criteria) {
        for (const fieldId of criterion.requirement.match(/\bF\d{3}\b/g) ?? []) expect(fieldCodes.has(fieldId)).toBe(true)
        for (const materialId of criterion.requirement.match(/\bM\d{3}\b/g) ?? []) expect(materialCodes.has(materialId)).toBe(true)
      }
      for (const criterion of criteria) {
        const meta = metadata.criteria.find((item) => item.sectionId === criterion.sectionId && item.criterionId === criterion.criterionId)
        expect(meta).toBeDefined()
        expect(meta?.evidenceStatus).toMatch(/^(VERIFIED|PARTIAL|UNCONFIRMED)$/)
        expect(meta?.sourceIds.every((id) => /^SRC-\d{3}$/.test(id) && sourceIds.has(id))).toBe(true)
        expect(['semantic', 'manual']).toContain(criterion.execution)
        expect(criterion.execution).not.toBe('deterministic')
      }
      expect(template.policyVersionIds).toEqual([])
    }
  })
})
