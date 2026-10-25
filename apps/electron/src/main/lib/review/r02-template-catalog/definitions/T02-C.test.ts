import { describe, expect, test } from 'bun:test'
import type { TemplateVersion } from '@profer/shared'
import { validateTemplate } from '../../template-store'
import { templateVersion as t10, r02Metadata as m10 } from './T02-T10'
import { templateVersion as t11, r02Metadata as m11 } from './T02-T11'
import { templateVersion as t12, r02Metadata as m12 } from './T02-T12'
import { templateVersion as t13, r02Metadata as m13 } from './T02-T13'

const expected: Array<[string, string]> = [
  ['T02-T10', '访学、研修、培训的人事安排与资格审核'],
  ['T02-T11', '教职工事假、病假等劳动人事请销假审核'],
  ['T02-T12', '离职、辞职、解聘与离岗手续审核'],
  ['T02-T13', '退休、延期退休及返聘资格审核'],
]

type R02Metadata = {
  templateId: string
  name: string
  officialSchoolTemplate: boolean
  sourceDocumentPath: string
  sourceDocumentBytes: number
  sourceDocumentSha256: string
  sourceIntegrityVerifiedAgainstManifest: boolean
  policyEvidenceStatus: string
  auxiliaryStageNotes?: ReadonlyArray<{ id: string; runtimeRepresentation: string; reason: string }>
  criteria: ReadonlyArray<{
    sectionId: string
    criterionId: string
    evidenceStatus: string
    srcIds: ReadonlyArray<string>
  }>
}

const entries: Array<{ template: TemplateVersion; metadata: R02Metadata }> = [
  { template: t10, metadata: m10 },
  { template: t11, metadata: m11 },
  { template: t12, metadata: m12 },
  { template: t13, metadata: m13 },
]

describe('R02 T02-C template definitions', () => {
  test('IDs and formal names are correct and unique', () => {
    const actual: Array<[string, string]> = entries.map(({ template }) => [template.templateId, template.name])
    expect(actual).toEqual(expected)
    expect(new Set(actual.map(([id]) => id)).size).toBe(4)
    expect(new Set(actual.map(([, name]) => name)).size).toBe(4)
  })

  test('source metadata is complete and matches the fixed manifest', () => {
    for (const { template, metadata } of entries) {
      expect(metadata.templateId).toBe(template.templateId)
      expect(metadata.name).toBe(template.name)
      expect(metadata.officialSchoolTemplate).toBe(false)
      expect(metadata.sourceDocumentPath).toContain(`/R02/${template.templateId}.md`)
      expect(metadata.sourceDocumentBytes).toBeGreaterThan(0)
      expect(metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(metadata.sourceIntegrityVerifiedAgainstManifest).toBe(true)
      expect(metadata.policyEvidenceStatus).toBe('PARTIAL')
      if (template.templateId === 'T02-T10') {
        expect(metadata.auxiliaryStageNotes?.some(note => note.id === 'LX' && note.runtimeRepresentation === 'metadata-only')).toBe(true)
      }
      expect(metadata.criteria.length).toBe(Number(template.sections?.flatMap(section => section.criteria).length))
      expect(metadata.criteria.every(item => item.sectionId === 'fact-review' && /^R\d{3}$/.test(item.criterionId))).toBe(true)
      expect(metadata.criteria.every(item => new Set<string>(['verified', 'partial', 'unconfirmed']).has(item.evidenceStatus))).toBe(true)
      expect(metadata.criteria.every(item => item.srcIds.every(srcId => /^SRC-\d{3}$/.test(srcId)))).toBe(true)
    }
  })

  test('fields, material slots and criteria have no duplicate or dangling references', () => {
    for (const { template } of entries) {
      const fieldKeys = template.fields.map(field => field.key)
      const slotIds = template.materialSlots.map(slot => slot.id)
      const sections = template.sections ?? []
      const sectionIds = new Set(sections.map(section => section.id))
      expect(new Set(fieldKeys).size).toBe(fieldKeys.length)
      expect(new Set(slotIds).size).toBe(slotIds.length)
      expect(new Set(sections.map(section => section.id)).size).toBe(sections.length)
      for (const field of template.fields) if (field.sectionId) expect(sectionIds.has(field.sectionId)).toBe(true)
      for (const slot of template.materialSlots) {
        if (slot.sectionId) expect(sectionIds.has(slot.sectionId)).toBe(true)
        expect(slot.minCount).toBeLessThanOrEqual(slot.maxCount)
      }
      const criteria = sections.flatMap(section => section.criteria)
      expect(new Set(criteria.map(criterion => criterion.id)).size).toBe(criteria.length)
      expect(criteria.every(criterion => ['semantic', 'manual'].includes(criterion.execution))).toBe(true)
      expect(criteria.every(criterion => !('dataCheck' in criterion))).toBe(true)
    }
  })

  test('stage graph is unique, reachable, linear and locally owned', () => {
    for (const { template } of entries) {
      const stages = template.stages
      const ids = stages.map(stage => stage.id)
      const byId = new Map(stages.map(stage => [stage.id, stage]))
      expect(stages.length).toBeGreaterThan(0)
      expect(new Set(ids).size).toBe(ids.length)
      let current: string | undefined = stages[0]?.id
      const visited = new Set<string>()
      while (current) {
        expect(visited.has(current)).toBe(false)
        visited.add(current)
        const stage = byId.get(current)
        expect(stage).toBeDefined()
        if (stage?.nextStageId) expect(byId.has(stage.nextStageId)).toBe(true)
        current = stage?.nextStageId
      }
      expect(visited.size).toBe(stages.length)
      expect(stages.at(-1)?.kind).toBe('handoff')
      expect(stages.every(stage => stage.workflowOwner === 'local')).toBe(true)
      expect(stages.every(stage => ['reviewer', 'teacher'].includes(stage.executorRole))).toBe(true)
      expect(stages.at(-1)?.executorRole).toBe('teacher')
    }
  })

  test('policy uncertainty cannot produce automatic formal approval', () => {
    for (const { template } of entries) {
      expect(template.schemaVersion).toBe(2)
      expect(template.catalogKind).toBe('builtin')
      expect(template.status).toBe('draft')
      expect(template.policyVersionIds).toEqual([])
      expect(template.autoPassPolicy?.enabled).toBe(false)
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(template.outputs.some(output => output.kind === 'approval')).toBe(false)
      expect(template.sections?.flatMap(section => section.criteria).every(criterion => criterion.execution !== 'deterministic')).toBe(true)
      expect(template.stages.every(stage => stage.workflowOwner === 'local')).toBe(true)
    }
  })

  test('all four definitions pass the existing structural validator', () => {
    for (const { template } of entries) {
      const issues = validateTemplate(template)
      expect(issues.filter(issue => issue.level === 'error')).toEqual([])
    }
  })
})
