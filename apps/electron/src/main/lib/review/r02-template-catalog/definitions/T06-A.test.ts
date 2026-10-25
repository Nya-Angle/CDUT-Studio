import { describe, expect, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { validateTemplate } from '../../template-store'
import { templateVersion as t01, r02Metadata as m01 } from './T06-T01'
import { templateVersion as t02, r02Metadata as m02 } from './T06-T02'
import { templateVersion as t03, r02Metadata as m03 } from './T06-T03'
import { templateVersion as t04, r02Metadata as m04 } from './T06-T04'
import { templateVersion as t05, r02Metadata as m05 } from './T06-T05'

const batch = [
  { template: t01, metadata: m01 },
  { template: t02, metadata: m02 },
  { template: t03, metadata: m03 },
  { template: t04, metadata: m04 },
  { template: t05, metadata: m05 },
] as const

describe('R02 T06-A template definitions', () => {
  test('all five IDs and formal names are stable and unique', () => {
    expect(batch.map(x => x.template.templateId)).toEqual(['T06-T01', 'T06-T02', 'T06-T03', 'T06-T04', 'T06-T05'])
    expect(new Set(batch.map(x => x.template.templateId)).size).toBe(5)
    expect(new Set(batch.map(x => x.template.name)).size).toBe(5)
    for (const item of batch) {
      expect(item.template.templateId).toBe(item.metadata.templateId)
      expect(item.template.name).toBe(item.metadata.name)
    }
  })

  test('each definition passes the repository TemplateVersion validator', () => {
    for (const { template } of batch) {
      const errors = validateTemplate(template).filter(issue => issue.level === 'error')
      expect(errors).toEqual([])
    }
  })

  test('field, material, criterion and source metadata references are complete', () => {
    for (const { template, metadata } of batch) {
      const fieldKeys = new Set(template.fields.map(field => field.key))
      const slotIds = new Set(template.materialSlots.map(slot => slot.id))
      const sections = new Map((template.sections ?? []).map(section => [section.id, section]))
      const criteria = (template.sections ?? []).flatMap(section => section.criteria.map(criterion => ({ section, criterion })))
      const criterionIds = criteria.map(x => x.criterion.id)
      const sourceIds = new Set<string>(metadata.sources.map(source => source.id))
      expect(fieldKeys.size).toBe(template.fields.length)
      expect(slotIds.size).toBe(template.materialSlots.length)
      expect(new Set((template.sections ?? []).map(section => section.id)).size).toBe((template.sections ?? []).length)
      expect(new Set(criterionIds).size).toBe(criterionIds.length)
      expect(Number(metadata.criteria.length)).toBe(Number(criteria.length))
      for (const binding of metadata.criteria) {
        expect(sections.has(binding.sectionId)).toBe(true)
        expect(criterionIds).toContain(binding.criterionId)
        for (const id of binding.fieldIds) expect(fieldKeys.has(id)).toBe(true)
        for (const id of binding.materialSlotIds) expect(slotIds.has(id)).toBe(true)
        for (const id of binding.srcIds) expect(sourceIds.has(id)).toBe(true)
        expect(['VERIFIED', 'PARTIAL', 'UNCONFIRMED']).toContain(binding.evidenceStatus)
      }
      expect(metadata.sourceDocumentPath).toContain('/research-original/')
      expect(metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(metadata.sources.length).toBeGreaterThan(0)
    }
  })

  test('source metadata hashes the exact Git blob bytes, not the one-LF manifest variant', () => {
    const repoRoot = new URL('../../../../../../../../', import.meta.url)
    for (const { metadata } of batch) {
      const bytes = readFileSync(new URL(metadata.sourceDocumentPath, repoRoot))
      expect(bytes.byteLength).toBe(metadata.sourceDocumentBytes)
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(metadata.sourceDocumentSha256)
    }
  })

  test('unknown policy evidence never becomes an automatic formal decision', () => {
    for (const { template, metadata } of batch) {
      expect(template.status).toBe('draft')
      expect(template.policyVersionIds).toEqual([])
      expect(template.autoPassPolicy?.enabled).toBe(false)
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(metadata.officialSchoolTemplate).toBe(false)
      expect(metadata.policyEvidenceStatus).toBe('PARTIAL')
      expect(template.sections?.flatMap(section => section.criteria).every(criterion => criterion.execution !== 'deterministic')).toBe(true)
      expect(template.outputs.some(output => String(output.kind) === 'approval')).toBe(false)
      expect(template.stages.every(stage => stage.workflowOwner === 'local')).toBe(true)
      const finalStage = template.stages.at(-1)!
      expect(['reviewer', 'teacher']).toContain(finalStage.executorRole)
      expect(finalStage.kind).toBe('handoff')
    }
  })

  test('stage graphs are acyclic, fully reachable, and use local handoff roles', () => {
    for (const { template } of batch) {
      const stages = template.stages
      const byId = new Map(stages.map(stage => [stage.id, stage]))
      expect(new Set(stages.map(stage => stage.id)).size).toBe(stages.length)
      for (const stage of stages) {
        if (stage.nextStageId) expect(byId.has(stage.nextStageId)).toBe(true)
        expect(stage.returnToStageId).toBeUndefined()
      }
      const seen = new Set<string>()
      let current: (typeof stages)[number] | undefined = stages[0]
      while (current) {
        expect(seen.has(current.id)).toBe(false)
        seen.add(current.id)
        current = current.nextStageId ? byId.get(current.nextStageId) : undefined
      }
      expect(seen.size).toBe(stages.length)
    }
  })
})
