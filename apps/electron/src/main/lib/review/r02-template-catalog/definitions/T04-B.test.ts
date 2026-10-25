import { describe, expect, it } from 'bun:test'
import { validateTemplate } from '../../template-store'
import { template as T0406, r02Metadata as M0406 } from './T04-T06'
import { template as T0407, r02Metadata as M0407 } from './T04-T07'
import { template as T0408, r02Metadata as M0408 } from './T04-T08'
import { template as T0409, r02Metadata as M0409 } from './T04-T09'

const cases = [
  { template: T0406, metadata: M0406, counts: { fields: 50, materials: 30, criteria: 37, sources: 11, stages: 7, sourceStages: 7, outputs: 5, sourceBranches: 0 }, optionalBranchIds: [], sha256: 'c63c203f32ea4219d6fcda862ef4502941e984e96f325c4c2a79ded560d433ae' },
  { template: T0407, metadata: M0407, counts: { fields: 41, materials: 16, criteria: 24, sources: 14, stages: 6, sourceStages: 7, outputs: 5, sourceBranches: 0 }, optionalBranchIds: ['G'], sha256: 'dd765f9831855988624812ffd04f0c2df83072afdf2e8289f184b629c236428e' },
  { template: T0408, metadata: M0408, counts: { fields: 44, materials: 20, criteria: 28, sources: 13, stages: 6, sourceStages: 6, outputs: 5, sourceBranches: 6 }, optionalBranchIds: [], sha256: 'a991eae590d4dfe2ceba8691b426b5470a5712ab6b8e09ff73b922f4c98b23a3' },
  { template: T0409, metadata: M0409, counts: { fields: 40, materials: 25, criteria: 36, sources: 17, stages: 7, sourceStages: 8, outputs: 5, sourceBranches: 0 }, optionalBranchIds: ['P7'], sha256: '87b125596d024b127376e5fda8de84127ff5e0073a5b75972e7f1b015912db25' },
]

function referencedIds(text: string, prefix: 'F' | 'M' | 'SRC'): Set<string> {
  const result = new Set<string>()
  const explicit = prefix === 'SRC' ? /\bSRC-(\d{3})\b/g : new RegExp('\\b' + prefix + '(\\d{3})\\b', 'g')
  for (const match of text.matchAll(explicit)) result.add(prefix === 'SRC' ? 'SRC-' + match[1] : prefix + match[1])

  if (prefix === 'SRC') {
    for (const match of text.matchAll(/\bSRC-(\d{3})(?:\/(\d{3}))+/g)) {
      for (const part of match[0].split('/')) result.add(part.startsWith('SRC-') ? part : 'SRC-' + part)
    }
  }

  const range = prefix === 'SRC'
    ? /\bSRC-(\d{3})\s*[–—-]\s*(?:SRC-)?(\d{3})\b/g
    : new RegExp('\\b' + prefix + '(\\d{3})\\s*[–—-]\\s*(?:' + prefix + ')?(\\d{3})\\b', 'g')
  for (const match of text.matchAll(range)) {
    const first = Number(match[1]), last = Number(match[2])
    for (let n = Math.min(first, last); n <= Math.max(first, last); n++) {
      result.add((prefix === 'SRC' ? 'SRC-' : prefix) + String(n).padStart(3, '0'))
    }
  }
  return result
}

describe('T04-B R02 template definitions', () => {
  it('keeps the four official IDs and names unique', () => {
    expect(new Set(cases.map((item) => item.template.templateId)).size).toBe(4)
    expect(new Set(cases.map((item) => item.template.name)).size).toBe(4)
    for (const item of cases) {
      expect(item.template.templateId).toBe(item.metadata.templateId)
      expect(item.template.name).toBe(item.metadata.name)
      expect(item.metadata.officialSchoolTemplate).toBe(false)
      expect(String(item.metadata.sourceDocumentSha256)).toBe(String(item.sha256))
      expect(item.template.schemaVersion).toBe(2)
      expect(item.template.status).toBe('draft')
      expect(item.template.catalogKind).toBe('builtin')
      expect(item.template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(item.template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
    }
  })

  it('preserves source-derived counts and has no dangling F/M/SRC references', () => {
    for (const item of cases) {
      const criteria = (item.template.sections ?? []).flatMap((section) => section.criteria)
      expect(item.template.fields).toHaveLength(item.counts.fields)
      expect(item.template.materialSlots).toHaveLength(item.counts.materials)
      expect(criteria).toHaveLength(item.counts.criteria)
      expect(item.metadata.sources).toHaveLength(item.counts.sources)
      expect(item.template.stages).toHaveLength(item.counts.stages)
      expect(item.metadata.sourceStages).toHaveLength(item.counts.sourceStages)
      expect(item.template.outputs).toHaveLength(item.counts.outputs)
      expect(item.metadata.outputContract).toHaveLength(item.template.outputs.length)
      expect(item.metadata.resultCodes).toHaveLength(8)
      expect(Number('sourceBranches' in item.metadata ? item.metadata.sourceBranches.length : 0)).toBe(Number(item.counts.sourceBranches))
      const actualOptionalBranchIds: string[] = item.metadata.sourceStages
        .filter((stage) => 'optionalBranch' in stage && stage.optionalBranch)
        .map((stage) => String(stage.id))
      const expectedOptionalBranchIds: string[] = [...item.optionalBranchIds]
      expect(actualOptionalBranchIds).toEqual(expectedOptionalBranchIds)
      expect(item.template.stages.every((stage) => item.metadata.sourceStages.some((sourceStage) => sourceStage.id === stage.id))).toBe(true)
      expect(new Set(item.template.fields.map((field) => field.key)).size).toBe(item.template.fields.length)
      expect(new Set(item.template.materialSlots.map((slot) => slot.id)).size).toBe(item.template.materialSlots.length)
      expect(new Set(criteria.map((criterion) => criterion.id)).size).toBe(criteria.length)
      expect(item.metadata.fields).toHaveLength(item.template.fields.length)
      expect(item.metadata.materials).toHaveLength(item.template.materialSlots.length)
      expect(item.metadata.criteria).toHaveLength(criteria.length)

      const fieldIds = new Set<string>(item.metadata.fields.map((field) => String(field.fieldId)))
      const slotIds = new Set<string>(item.template.materialSlots.map((slot) => String(slot.id)))
      const sourceIds = new Set<string>(item.metadata.sources.map((source) => String(source.srcId)))
      for (const criterion of criteria) {
        const mapping = item.metadata.criteria.find((entry) => entry.criterionId === criterion.id)
        expect(mapping).toBeDefined()
        for (const ref of referencedIds(criterion.requirement, 'F')) expect(fieldIds.has(ref)).toBe(true)
        for (const ref of referencedIds(criterion.requirement, 'M')) expect(slotIds.has(ref)).toBe(true)
        for (const ref of referencedIds(criterion.requirement, 'SRC')) expect(sourceIds.has(ref)).toBe(true)
        for (const ref of mapping?.srcIds ?? []) expect(sourceIds.has(ref)).toBe(true)
        expect(['VERIFIED', 'PARTIAL', 'UNCONFIRMED'].includes(String(mapping?.evidenceStatus))).toBe(true)
      }
    }
  })

  it('passes template-store structural validation and uses only reachable stage references', () => {
    for (const item of cases) {
      const template = item.template
      const errors = validateTemplate(template).filter((issue) => issue.level === 'error')
      expect(errors).toEqual([])
      const stageIds = new Set(template.stages.map((stage) => stage.id))
      for (const stage of template.stages) {
        if (stage.nextStageId) expect(stageIds.has(stage.nextStageId)).toBe(true)
        if (stage.returnToStageId) expect(stageIds.has(stage.returnToStageId)).toBe(true)
        expect(stage.workflowOwner).toBe('local')
      }
      for (const start of template.stages) {
        const visited = new Set<string>()
        let currentId: string | undefined = start.id
        while (currentId) {
          expect(visited.has(currentId)).toBe(false)
          visited.add(currentId)
          const current = template.stages.find((stage) => stage.id === currentId)
          expect(current).toBeDefined()
          currentId = current?.nextStageId
        }
      }
    }
  })

  it('cannot auto-pass or create fake school policy versions', () => {
    for (const item of cases) {
      expect(item.template.autoPassPolicy).toEqual({ enabled: false })
      expect(item.template.policyVersionIds).toEqual([])
      const criteria = (item.template.sections ?? []).flatMap((section) => section.criteria)
      expect(criteria.every((criterion) => criterion.execution === 'semantic' || criterion.execution === 'manual')).toBe(true)
      expect(['reviewer', 'teacher'].includes(String(item.template.stages[item.template.stages.length - 1]?.executorRole))).toBe(true)
      expect(item.template.outputs.every((output) => output.kind !== 'approval')).toBe(true)
      expect(item.metadata.policyEvidenceStatus).toBe('PARTIAL')
      expect(String(item.metadata.stageModelNote).length).toBeGreaterThan(0)
    }
  })
})
