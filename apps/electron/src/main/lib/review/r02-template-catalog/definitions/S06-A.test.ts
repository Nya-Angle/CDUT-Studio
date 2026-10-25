import { describe, expect, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { validateTemplate } from '../../template-store'
import { template as t01, r02Metadata as m01 } from './S06-T01'
import { template as t02, r02Metadata as m02 } from './S06-T02'
import { template as t05, r02Metadata as m05 } from './S06-T05'

const cases = [
  { template: t01, metadata: m01, id: 'S06-T01', name: '大学生创新训练计划立项、中期、结项全过程审核', expectedCriteria: 28, expectedStages: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
  { template: t02, metadata: m02, id: 'S06-T02', name: '学科竞赛报名、校内推荐与参赛资格审核', expectedCriteria: 20, expectedStages: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
  { template: t05, metadata: m05, id: 'S06-T05', name: '学生社会实践立项、成果与实践时长认定审核', expectedCriteria: 26, expectedStages: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
] as const

describe('R02 S06-A native template definitions', () => {
  test('IDs and official research names are correct and unique', () => {
    expect(new Set(cases.map(item => item.template.templateId)).size).toBe(3)
    expect(new Set(cases.map(item => item.template.name)).size).toBe(3)
    for (const item of cases) {
      expect(item.template.templateId).toBe(item.id)
      expect(item.template.name).toBe(item.name)
      expect(item.metadata.templateId).toBe(item.id)
      expect(item.metadata.name).toBe(item.name)
    }
  })

  test('each template satisfies the shared TemplateVersion validator', () => {
    for (const item of cases) {
      const issues = validateTemplate(item.template)
      expect(issues.filter(issue => issue.level === 'error')).toEqual([])
    }
  })

  test('field, material, section, criterion, and stage references are stable and non-dangling', () => {
    for (const item of cases) {
      const template = item.template
      expect(new Set(template.fields.map(field => field.key)).size).toBe(template.fields.length)
      expect(new Set(template.materialSlots.map(slot => slot.id)).size).toBe(template.materialSlots.length)
      expect(new Set(template.sections?.map(section => section.id) ?? []).size).toBe(template.sections?.length ?? 0)
      const sectionIds = new Set(template.sections?.map(section => section.id) ?? [])
      const criteria = (template.sections ?? []).flatMap(section => section.criteria.map(criterion => ({ sectionId: section.id, ...criterion })))
      expect(criteria.length).toBe(item.expectedCriteria)
      expect(new Set(criteria.map(criterion => criterion.id)).size).toBe(criteria.length)
      for (const criterion of criteria) {
        for (const ref of criterion.requirement.match(/\b[FM]\d{3}\b/g) ?? []) {
          expect(ref.startsWith('F') ? template.fields.some(field => field.key === ref) : template.materialSlots.some(slot => slot.id === ref)).toBe(true)
        }
      }
      for (const field of template.fields) {
        if (field.sectionId) expect(sectionIds.has(field.sectionId)).toBe(true)
      }
      for (const slot of template.materialSlots) {
        if (slot.sectionId) expect(sectionIds.has(slot.sectionId)).toBe(true)
        expect(slot.minCount).toBeLessThanOrEqual(slot.maxCount)
      }
      const stageIds = new Set(template.stages.map(stage => stage.id))
      for (const stage of template.stages) {
        if (stage.nextStageId) expect(stageIds.has(stage.nextStageId)).toBe(true)
        if (stage.returnToStageId) expect(stageIds.has(stage.returnToStageId)).toBe(true)
      }
      const reachable = new Set<string>()
      let cursor: string | undefined = template.stages[0]?.id
      while (cursor && !reachable.has(cursor)) {
        reachable.add(cursor)
        cursor = template.stages.find(stage => stage.id === cursor)?.nextStageId
      }
      expect(reachable.size).toBe(template.stages.length)
      expect(template.stages.map(stage => stage.id)).toEqual([...item.expectedStages])
      expect(template.stages.every(stage => stage.kind === 'manual-review' && stage.workflowOwner === 'local')).toBe(true)
    }
  })

  test('metadata maps every criterion to research SRC IDs and an evidence state', () => {
    const repoRoot = resolve(import.meta.dir, '../../../../../../../../')
    for (const item of cases) {
      const reviewed = readFileSync(resolve(repoRoot, item.metadata.sourceDocumentPath))
      const original = readFileSync(resolve(repoRoot, item.metadata.sourceOriginalPath))
      expect(reviewed.equals(Buffer.concat([original, Buffer.from('\n')]))).toBe(true)
      expect(reviewed.byteLength).toBe(item.metadata.sourceDocumentBytes)
      expect(createHash('sha256').update(reviewed).digest('hex')).toBe(item.metadata.sourceDocumentSha256)
      const declaredSources = new Set(reviewed.toString('utf8').match(/\bSRC-\d{3}\b/g) ?? [])
      const criteria = (item.template.sections ?? []).flatMap(section => section.criteria.map(criterion => ({ sectionId: section.id, id: criterion.id })))
      expect(item.metadata.criteria.length).toBe(criteria.length)
      for (const criterion of criteria) {
        const mapped = item.metadata.criteria.find(entry => entry.criterionId === criterion.id && entry.sectionId === criterion.sectionId)
        expect(mapped).toBeDefined()
        expect(['VERIFIED', 'PARTIAL', 'UNCONFIRMED'].includes(mapped?.evidenceStatus ?? '')).toBe(true)
        expect(Array.isArray(mapped?.srcIds)).toBe(true)
        expect((mapped?.srcIds.length ?? 0) > 0).toBe(true)
        for (const srcId of mapped?.srcIds ?? []) {
          expect(srcId).toMatch(/^SRC-\d{3}$/)
          expect(declaredSources.has(srcId)).toBe(true)
        }
      }
    }
  })

  test('drafts are non-official, have no fake PolicyVersion, and cannot auto-pass', () => {
    for (const item of cases) {
      const template = item.template
      expect(template.schemaVersion).toBe(2)
      expect(template.catalogKind).toBe('builtin')
      expect(template.status).toBe('draft')
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(template.policyVersionIds).toEqual([])
      expect(template.policyRefs ?? []).toEqual([])
      expect(template.autoPassPolicy?.enabled).toBe(false)
      expect(item.metadata.officialSchoolTemplate).toBe(false)
      expect(item.metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(item.metadata.policyEvidenceStatus).toBe('PARTIAL')
      expect(template.sections?.flatMap(section => section.criteria).every(criterion => criterion.execution === 'semantic' || criterion.execution === 'manual')).toBe(true)
      const finalStage = template.stages.at(-1)
      expect(finalStage?.executorRole).toBe('teacher')
      expect(finalStage?.workflowOwner).toBe('local')
      expect(template.stages.every(stage => stage.workflowOwner === 'local')).toBe(true)
    }
  })
})
