import { describe, expect, test } from 'bun:test'
import type { TemplateVersion } from '@profer/shared'
import { validateTemplate } from '../../template-store'
import { template as t05T01, r02Metadata as m05T01 } from './T05-T01'
import { template as t05T02, r02Metadata as m05T02 } from './T05-T02'
import { template as t05T03, r02Metadata as m05T03 } from './T05-T03'
import { template as t05T04, r02Metadata as m05T04 } from './T05-T04'

const entries = [
  { template: t05T01, metadata: m05T01, id: 'T05-T01', name: '本研人才培养方案制定、修订审核' },
  { template: t05T02, metadata: m05T02, id: 'T05-T02', name: '教学改革项目申报、过程检查与结题审核' },
  { template: t05T03, metadata: m05T03, id: 'T05-T03', name: '课程建设、精品课程与在线课程建设立项审核' },
  { template: t05T04, metadata: m05T04, id: 'T05-T04', name: '教材编写、出版与教材建设项目申报审核' },
] satisfies Array<{ template: TemplateVersion; metadata: { templateId: string; name: string; sourceDocumentPath: string; sourceDocumentSha256: string; officialSchoolTemplate: false; policyEvidenceStatus: string; criteria: readonly { sectionId: string; criterionId: string; srcIds: readonly string[]; evidenceStatus: string }[]; sources: readonly { id: string; status: string }[] }; id: string; name: string }>

describe('R02 T05-A native template definitions', () => {
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

  test('field, material-slot, section, criterion, and SRC metadata references are not dangling', () => {
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
      expect(Number(entry.metadata.criteria.length)).toBe(criteria.length)

      for (const { sectionId, criterion } of criteria) {
        for (const match of criterion.requirement.matchAll(/\bF\d{3}\b/g)) expect(fieldIds.has(match[0])).toBe(true)
        for (const match of criterion.requirement.matchAll(/\bM\d{3}\b/g)) expect(slotIds.has(match[0])).toBe(true)
        const mapping = entry.metadata.criteria.find(item => item.sectionId === sectionId && item.criterionId === criterion.id)
        expect(mapping).toBeDefined()
        expect(mapping!.srcIds.length).toBeGreaterThan(0)
        for (const srcId of mapping!.srcIds) expect(indexedSourceIds.has(srcId)).toBe(true)
        expect(['PARTIAL', 'UNCONFIRMED']).toContain(mapping!.evidenceStatus)
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
    }
  })
})
