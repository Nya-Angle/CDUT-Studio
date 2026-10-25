import { describe, expect, test } from 'bun:test'
import { validateTemplate } from '../../template-store'
import { templateVersion as S07T05, r02Metadata as S07T05Meta } from './S07-T05'
import { templateVersion as S07T06, r02Metadata as S07T06Meta } from './S07-T06'
import { templateVersion as S07T07, r02Metadata as S07T07Meta } from './S07-T07'
import { templateVersion as S07T08, r02Metadata as S07T08Meta } from './S07-T08'

const entries = [
  { template: S07T05, metadata: S07T05Meta, id: 'S07-T05', name: "毕业就业协议签约、解约与重新签约资格及程序审核", rawSha: '41d56364b89b8353552c4cfd2eee022a7e28580a937a7b6f766efd4bdfad7cea', docSha: 'c742a0df9f2354109a9e316a46eb421de92142272991125e5455ddc39e562952' },
  { template: S07T06, metadata: S07T06Meta, id: 'S07-T06', name: "就业去向登记、就业证明与相关变更材料审核", rawSha: '56a87abdd730022f5ff1b7a8494f446904d14f4f9f7bc6433d292caa93e1893f', docSha: '8ef8be7b15754c37d3aef2e4e739414e092a885269ae2932fcc8a738d563f9ff' },
  { template: S07T07, metadata: S07T07Meta, id: 'S07-T07', name: "基层就业学费补偿、国家助学贷款代偿资格审核", rawSha: '3160503e3bfd97fa8173497301349d2754d3d8515b03507ca4fd2e0fc5dad77f', docSha: 'fbbf14e9ad2334c400de1c1e346e8d48f015dc32104aaa4d00756f9b2f90a3b2' },
  { template: S07T08, metadata: S07T08Meta, id: 'S07-T08', name: "结业后达标申请换发毕业证资格审核", rawSha: '6abee9f18c47285b202a80c7d43c97007660db345f3349395b84cc85978c3795', docSha: '4a0f7ea71cfd4640d019a260b9e33206300afb4914f4605797c504bf40913e25' },
]

describe('R02 S07-B templates', () => {
  test('four formal IDs and names are correct and unique', () => {
    expect(entries.map(x => x.template.templateId)).toEqual(entries.map(x => x.id))
    expect(entries.map(x => x.template.name)).toEqual(entries.map(x => x.name))
    expect(new Set(entries.map(x => x.template.templateId)).size).toBe(4)
    expect(new Set(entries.map(x => x.template.name)).size).toBe(4)
  })

  test('each TemplateVersion passes the repository validator without errors', () => {
    for (const entry of entries) {
      const errors = validateTemplate(entry.template).filter(issue => issue.level === 'error')
      expect(errors).toEqual([])
    }
  })

  test('field, material-slot, criterion and source references are complete', () => {
    for (const { template, metadata } of entries) {
      const fieldIds = new Set(template.fields.map(field => field.key))
      const slotIds = new Set(template.materialSlots.map(slot => slot.id))
      const criteria = template.sections?.flatMap(section => section.criteria) ?? []
      expect(new Set(template.fields.map(field => field.key)).size).toBe(template.fields.length)
      expect(new Set(template.materialSlots.map(slot => slot.id)).size).toBe(template.materialSlots.length)
      expect(template.fields.every(field => Boolean(field.label.split('·')[1]?.trim()))).toBe(true)
      expect(template.materialSlots.every(slot => Boolean(slot.name.split('·')[1]?.trim()) && slot.purpose.trim().length > 0)).toBe(true)
      expect(new Set(criteria.map(criterion => criterion.id)).size).toBe(criteria.length)
      expect(metadata.criteria).toHaveLength(criteria.length)
      for (const criterion of criteria) {
        const mapped = metadata.criteria.find(item => item.criterionId === criterion.id)
        expect(mapped).toBeDefined()
        expect(mapped?.sectionId).toBe('rules')
        for (const match of criterion.requirement.matchAll(/\b(F\d{3})\b/g)) { const ref = match[1]; if (ref !== undefined) expect(fieldIds.has(ref)).toBe(true) }
        for (const match of criterion.requirement.matchAll(/\b(M\d{3})\b/g)) { const ref = match[1]; if (ref !== undefined) expect(slotIds.has(ref)).toBe(true) }
        for (const sourceId of mapped?.sourceIds ?? []) expect(metadata.sourceStatus[sourceId]).toBeDefined()
        expect(['semantic', 'manual']).toContain(criterion.execution)
      }
    }
  })

  test('stage graph is reachable, local-only, and has no dangling transitions', () => {
    for (const { template } of entries) {
      const stages = template.stages
      const ids = new Set(stages.map(stage => stage.id))
      expect(ids.size).toBe(stages.length)
      for (const stage of stages) {
        if (stage.nextStageId) expect(ids.has(stage.nextStageId)).toBe(true)
        if (stage.returnToStageId) expect(ids.has(stage.returnToStageId)).toBe(true)
        expect(stage.workflowOwner).toBe('local')
        expect(['reviewer', 'teacher']).toContain(stage.executorRole)
      }
      const reachable = new Set<string>()
      let current: string | undefined = stages[0]?.id
      while (current && !reachable.has(current)) {
        reachable.add(current)
        current = stages.find(stage => stage.id === current)?.nextStageId
      }
      expect(reachable.size).toBe(stages.length)
    }
  })

  test('nonofficial metadata, policy guards, and auto-pass are disabled', () => {
    for (const { template, metadata, rawSha, docSha } of entries) {
      expect(template.schemaVersion).toBe(2)
      expect(template.catalogKind).toBe('builtin')
      expect(template.status).toBe('draft')
      expect(template.policyVersionIds).toEqual([])
      expect(template.autoPassPolicy?.enabled).toBe(false)
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(metadata.officialSchoolTemplate).toBe(false)
      expect(metadata.sourceDocumentSha256).toMatch(/^[0-9a-f]{64}$/)
      expect(metadata.researchOriginalSha256).toMatch(/^[0-9a-f]{64}$/)
      expect(metadata.researchOriginalSha256).toBe(rawSha)
      expect(metadata.sourceDocumentSha256).toBe(docSha)
      expect(rawSha).not.toBe(docSha)
      expect(metadata.policyEvidenceStatus).toBe('PARTIAL')
      expect(template.outputs.every(output => output.kind !== 'approval')).toBe(true)
      const criteria = template.sections?.flatMap(section => section.criteria) ?? []
      expect(criteria.every(criterion => criterion.execution !== 'deterministic')).toBe(true)
      for (const criterion of criteria) {
        const evidence = metadata.criteria.find(item => item.criterionId === criterion.id)?.evidenceStatus
        if (evidence !== 'VERIFIED') expect(criterion.execution).toBe('manual')
      }
      expect(metadata.criteria.every(item => item.evidenceStatus === 'VERIFIED' || item.evidenceStatus === 'PARTIAL' || item.evidenceStatus === 'UNCONFIRMED' || item.evidenceStatus === 'HISTORICAL' || item.evidenceStatus === 'CROSS_SCHOOL_ONLY')).toBe(true)
    }
  })
})
