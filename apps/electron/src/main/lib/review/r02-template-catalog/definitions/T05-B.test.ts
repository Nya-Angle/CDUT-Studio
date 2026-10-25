import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import type { TemplateVersion } from '@profer/shared'
import { validateTemplate } from '../../template-store'
import { templateVersion as t05t05, r02Metadata as m05t05 } from './T05-T05'
import { templateVersion as t05t06, r02Metadata as m05t06 } from './T05-T06'
import { templateVersion as t05t07, r02Metadata as m05t07 } from './T05-T07'
import { templateVersion as t05t08, r02Metadata as m05t08 } from './T05-T08'

const templates: TemplateVersion[] = [t05t05, t05t06, t05t07, t05t08]
const metadata = [m05t05, m05t06, m05t07, m05t08]
const expected = [
  { id: 'T05-T05', name: '教学成果奖与教学改革成果申报审核', fields: 43, materials: 26, criteria: 38 },
  { id: 'T05-T06', name: '专业、学科建设及评估申报材料审核', fields: 47, materials: 36, criteria: 43 },
  { id: 'T05-T07', name: '实验课程及教学实践基地建设审核', fields: 39, materials: 28, criteria: 36 },
  { id: 'T05-T08', name: '教师教学工作量核算、异议和复核审核', fields: 41, materials: 20, criteria: 25 },
]

function referencedIds(text: string, prefix: 'F' | 'M'): string[] {
  const found = new Set<string>()
  const re = new RegExp(prefix + '(\\d{3})(?:\\s*[–-]\\s*' + prefix + '?(\\d{3}))?', 'g')
  let match: RegExpExecArray | null
  while ((match = re.exec(text))) {
    const start = Number(match[1])
    found.add(prefix + String(start).padStart(3, '0'))
    if (match[2]) {
      const end = Number(match[2])
      for (let n = Math.min(start, end); n <= Math.max(start, end); n++) found.add(prefix + String(n).padStart(3, '0'))
    }
    const tail = text.slice(re.lastIndex, re.lastIndex + 35)
    const slash = tail.match(/^\s*(?:(?:\([^)]*\)|（[^）]*）)\s*)?((?:\/(?:F|M)?\d{1,3})+)/)
    const slashRefs = slash?.[1]
    if (slashRefs) {
      for (const part of slashRefs.matchAll(/\/(?:F|M)?(\d{1,3})/g)) {
        const value = part[1]
        if (value) found.add(prefix + String(Number(value)).padStart(3, '0'))
      }
    }
  }
  return [...found]
}

describe('R02 T05-B runtime definitions', () => {
  test('template identities and inventory counts are stable and unique', () => {
    expect(templates.map(t => [t.templateId, t.name])).toEqual(expected.map(e => [e.id, e.name]))
    expect(new Set(templates.map(t => t.templateId)).size).toBe(4)
    expect(new Set(templates.map(t => t.name)).size).toBe(4)
    for (const [index, template] of templates.entries()) {
      const spec = expected[index]
      if (!spec) throw new Error('Missing expected inventory entry at index ' + index)
      expect(template.fields).toHaveLength(spec.fields)
      expect(template.materialSlots).toHaveLength(spec.materials)
      expect(template.sections?.flatMap(section => section.criteria)).toHaveLength(spec.criteria)
    }
  })

  test('each template passes the repository structural validator', () => {
    for (const template of templates) {
      const errors = validateTemplate(template).filter(issue => issue.level === 'error')
      expect(errors).toEqual([])
    }
  })

  test('metadata source hashes match committed reviewed Markdown copies', () => {
    for (const item of metadata) {
      const sourcePath = join(import.meta.dir, '../../../../../../../../', item.sourceDocumentPath)
      const actual = createHash('sha256').update(readFileSync(sourcePath)).digest('hex')
      expect(actual).toBe(item.sourceDocumentSha256)
      expect(item.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(item.sourceOriginalBlobSha1).toBeDefined()
      expect(String(item.sourceOriginalBlobSha1)).toMatch(/^[a-f0-9]{40}$/)
      expect(item.officialSchoolTemplate).toBe(false)
      expect(item.policyEvidenceStatus).toBe('PARTIAL')
      expect(item.researchEvidenceStatus).toBe('PARTIAL')
    }
  })

  test('no dangling field/material/source/criterion references or invalid stage links', () => {
    for (const [index, template] of templates.entries()) {
      const meta = metadata[index]
      if (!meta) throw new Error('Missing metadata entry at index ' + index)
      const sections = template.sections ?? []
      const sectionIds = new Set(sections.map(section => section.id))
      const criteria = sections.flatMap(section => section.criteria)
      const fieldIds = new Set(template.fields.map(field => field.key))
      const materialIds = new Set(template.materialSlots.map(slot => slot.id))
      const sourceIds = new Set<string>(meta.sourceIds as readonly string[])
      const stageIds = new Set(template.stages.map(stage => stage.id))
      for (const criterion of criteria) {
        for (const id of referencedIds(criterion.requirement, 'F')) expect(fieldIds.has(id)).toBe(true)
        for (const id of referencedIds(criterion.requirement, 'M')) expect(materialIds.has(id)).toBe(true)
      }
      for (const item of meta.criteria) {
        expect(sectionIds.has(item.sectionId)).toBe(true)
        const section = sections.find(candidate => candidate.id === item.sectionId)
        expect(section?.criteria.some(criterion => criterion.id === item.criterionId)).toBe(true)
        for (const id of item.sourceIds as readonly string[]) expect(sourceIds.has(id)).toBe(true)
        expect(['VERIFIED', 'PARTIAL', 'UNCONFIRMED']).toContain(item.evidenceStatus)
      }
      expect(meta.criteria).toHaveLength(criteria.length)
      for (const stage of template.stages) {
        if (stage.nextStageId) expect(stageIds.has(stage.nextStageId)).toBe(true)
        if (stage.returnToStageId) expect(stageIds.has(stage.returnToStageId)).toBe(true)
        expect(stage.workflowOwner).toBe('local')
      }
      const finalStage = template.stages[template.stages.length - 1]
      if (!finalStage) throw new Error('Template has no final stage: ' + template.templateId)
      expect(finalStage.kind).toBe('finalize')
      expect(['reviewer', 'teacher']).toContain(finalStage.executorRole)
    }
  })

  test('unknown policy evidence cannot become automatic formal pass or rejection', () => {
    for (const [index, template] of templates.entries()) {
      const meta = metadata[index]
      if (!meta) throw new Error('Missing metadata entry at index ' + index)
      expect(template.schemaVersion).toBe(2)
      expect(template.catalogKind).toBe('builtin')
      expect(template.status).toBe('draft')
      expect(template.policyVersionIds).toEqual([])
      expect(template.autoPassPolicy).toEqual({ enabled: false })
      expect(template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      const byId = new Map((template.sections ?? []).flatMap(section => section.criteria.map(criterion => [section.id + '/' + criterion.id, criterion] as const)))
      for (const item of meta.criteria) {
        const criterion = byId.get(item.sectionId + '/' + item.criterionId)
        if (!criterion) throw new Error('Metadata points to a missing criterion: ' + item.sectionId + '/' + item.criterionId)
        expect(['semantic', 'manual']).toContain(criterion.execution)
        if (item.evidenceStatus === 'UNCONFIRMED') expect(criterion.execution).toBe('manual')
      }
    }
  })
})
