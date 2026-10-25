import { describe, expect, test } from 'bun:test'
import { validateTemplate } from '../../template-store'
import { templateVersion as t01, r02Metadata as m01 } from './S01-T01'
import { templateVersion as t02, r02Metadata as m02 } from './S01-T02'
import { templateVersion as t03, r02Metadata as m03 } from './S01-T03'
import { templateVersion as t05, r02Metadata as m05 } from './S01-T05'

function sourceRefsFromText(text: string): string[] {
  const out = new Set<string>()
  const re = /SRC-(\d{3})(?:\s*[-–—]\s*(?:SRC-)?(\d{3}))?((?:\s*\/\s*(?:SRC-)?\d{3})*)/g
  for (const match of text.matchAll(re)) {
    const first = Number(match[1]), last = match[2] ? Number(match[2]) : first
    for (let n = first; n <= last; n++) out.add(`SRC-${String(n).padStart(3, '0')}`)
    for (const suffix of (match[3] ?? '').matchAll(/\/\s*(?:SRC-)?(\d{3})/g)) out.add(`SRC-${suffix[1]}`)
  }
  return [...out]
}

const cases = [
  { template: t01, metadata: m01, id: 'S01-T01', name: '学生休学资格与材料审核' },
  { template: t02, metadata: m02, id: 'S01-T02', name: '学生复学及退役复学资格审核' },
  { template: t03, metadata: m03, id: 'S01-T03', name: '保留入学资格、保留学籍与应征入伍保留资格审核' },
  { template: t05, metadata: m05, id: 'S01-T05', name: '跨校转入、转出和转学申请审核' },
]
describe('R02 S01-A templates', () => {
  test('IDs and official names are correct and unique', () => {
    const ids = cases.map((item) => item.template.templateId), names = cases.map((item) => item.template.name)
    expect(ids).toEqual(cases.map((item) => item.id)); expect(names).toEqual(cases.map((item) => item.name))
    expect(new Set(ids).size).toBe(cases.length); expect(new Set(names).size).toBe(cases.length); expect(ids).not.toContain('S01-T04')
  })
  test('every template passes the shared validateTemplate validator', () => {
    for (const item of cases) expect(validateTemplate(item.template).filter((issue) => issue.level === 'error')).toEqual([])
  })
  test('field, material, section, criterion, and source references do not dangle', () => {
    for (const item of cases) {
      const template = item.template, metadata = item.metadata
      const fieldIds = new Set(template.fields.map((field) => field.key)), materialIds = new Set(template.materialSlots.map((slot) => slot.id))
      const sectionIds = new Set((template.sections ?? []).map((section) => section.id))
      const criteria = (template.sections ?? []).flatMap((section) => section.criteria.map((criterion) => ({ ...criterion, sectionId: section.id })))
      const sourceIds = new Set(metadata.sources.map((source) => source.srcId)), criterionIds = criteria.map((criterion) => criterion.id)
      expect(new Set(criterionIds).size).toBe(criteria.length); expect(new Set((template.sections ?? []).map((section) => section.id)).size).toBe((template.sections ?? []).length)
      for (const criterion of criteria) { for (const ref of criterion.requirement.matchAll(/\bF\d{3}\b/g)) expect(fieldIds.has(ref[0])).toBe(true); for (const ref of criterion.requirement.matchAll(/\bM\d{3}\b/g)) expect(materialIds.has(ref[0])).toBe(true) }
      expect(Number(metadata.criteria.length)).toBe(Number(criteria.length)); expect(new Set(metadata.criteria.map((x) => `${x.sectionId}:${x.criterionId}`)).size).toBe(criteria.length)
      for (const mapping of metadata.criteria) { expect(sectionIds.has(mapping.sectionId)).toBe(true); expect(criterionIds.includes(mapping.criterionId)).toBe(true); for (const sourceId of mapping.srcIds) expect(sourceIds.has(sourceId)).toBe(true); expect(['VERIFIED', 'PARTIAL', 'UNCONFIRMED']).toContain(mapping.evidenceStatus) }
      for (const criterion of criteria) { const mapping = metadata.criteria.find((entry) => entry.sectionId === criterion.sectionId && entry.criterionId === criterion.id); expect(JSON.stringify(mapping?.srcIds)).toBe(JSON.stringify(sourceRefsFromText(criterion.requirement))) }
    }
  })
  test('stage graph is unique, reachable, acyclic, and locally owned', () => {
    for (const item of cases) {
      const stages = item.template.stages, ids = stages.map((stage) => stage.id), byId = new Map(stages.map((stage) => [stage.id, stage] as const))
      expect(new Set(ids).size).toBe(ids.length)
      for (const stage of stages) { expect(stage.workflowOwner).toBe('local'); if (stage.nextStageId) expect(byId.has(stage.nextStageId)).toBe(true); if (stage.returnToStageId) expect(byId.has(stage.returnToStageId)).toBe(true) }
      const visited = new Set<string>(); let current: string | undefined = stages[0]?.id
      while (current) { expect(visited.has(current)).toBe(false); visited.add(current); current = byId.get(current)?.nextStageId }
      expect(visited.size).toBe(stages.length)
    }
  })
  test('source metadata is complete and official-school status stays false', () => {
    for (const item of cases) {
      const { template, metadata } = item
      expect(String(metadata.templateId)).toBe(String(template.templateId)); expect(String(metadata.name)).toBe(String(template.name)); expect(metadata.officialSchoolTemplate).toBe(false)
      expect(metadata.sourceDocumentPath).toContain(`${template.templateId}.md`); expect(metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(metadata.researchStatus).toBe('PARTIAL'); expect(metadata.policyEvidenceStatus).toBe('PARTIAL')
      expect(metadata.sources.length).toBeGreaterThan(0); expect(new Set(metadata.sources.map((source) => source.srcId)).size).toBe(metadata.sources.length)
      expect(Number(metadata.criteria.length)).toBe((template.sections ?? []).reduce<number>((sum, section) => sum + section.criteria.length, 0))
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true); expect(template.description).toContain('本地研究模板 · 非校方正式模板')
    }
  })
  test('policy uncertainty cannot become automatic formal approval', () => {
    for (const item of cases) {
      const template = item.template
      expect(template.status).toBe('draft'); expect(template.schemaVersion).toBe(2); expect(template.catalogKind).toBe('builtin')
      expect(template.policyVersionIds).toEqual([]); expect(template.autoPassPolicy).toEqual({ enabled: false }); expect(template.outputs.some((output) => output.kind === 'approval')).toBe(false)
      expect((template.sections ?? []).flatMap((section) => section.criteria).every((criterion) => criterion.execution !== 'deterministic')).toBe(true)
      expect(template.stages.every((stage) => stage.workflowOwner === 'local')).toBe(true); expect(template.stages.some((stage) => stage.executorRole === 'teacher' || stage.executorRole === 'reviewer')).toBe(true)
    }
  })
})
