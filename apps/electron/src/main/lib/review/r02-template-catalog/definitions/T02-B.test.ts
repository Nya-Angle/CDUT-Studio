import { describe, expect, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { validateTemplate } from '../../template-store'
import { templateVersion as T02T05, r02Metadata as T02T05Metadata } from './T02-T05'
import { templateVersion as T02T06, r02Metadata as T02T06Metadata } from './T02-T06'
import { templateVersion as T02T07, r02Metadata as T02T07Metadata } from './T02-T07'
import { templateVersion as T02T09, r02Metadata as T02T09Metadata } from './T02-T09'

const batch = [
  { template: T02T05, metadata: T02T05Metadata },
  { template: T02T06, metadata: T02T06Metadata },
  { template: T02T07, metadata: T02T07Metadata },
  { template: T02T09, metadata: T02T09Metadata },
]

function referencedIds(text: string, prefix: 'F' | 'M'): Set<string> {
  const found = new Set<string>()
  const expression = new RegExp(`\\b${prefix}-?(\\d{3})\\b`, 'g')
  for (const match of text.matchAll(expression)) found.add(`${prefix}${match[1]}`)
  return found
}

function referencedSourceIds(text: string): Set<string> {
  const found = new Set<string>()
  const expression = /\bSRC-(\d{3}(?:(?:[\/／,，、]\s*)\d{3})*(?:[–-]\s*\d{3})?)/g
  for (const match of text.matchAll(expression)) {
    const sourceGroup = match[1] ?? ''
    for (const raw of sourceGroup.split(/[\/／,，、]/)) {
      const part = raw.trim()
      const range = part.match(/^(\d{3})[–-]\s*(\d{3})$/)
      if (range) {
        for (let value = Number(range[1]); value <= Number(range[2]) && value <= 999; value += 1) {
          found.add('SRC-' + String(value).padStart(3, '0'))
        }
      } else if (/^\d{3}$/.test(part)) {
        found.add('SRC-' + part)
      }
    }
  }
  return found
}

describe('R02 T02-B runtime template definitions', () => {
  test('IDs and formal names are correct and unique', () => {
    expect(batch.map(({ template }) => template.templateId)).toEqual(['T02-T05', 'T02-T06', 'T02-T07', 'T02-T09'])
    expect(new Set(batch.map(({ template }) => template.templateId)).size).toBe(4)
    expect(new Set(batch.map(({ template }) => template.name)).size).toBe(4)
    for (const { template, metadata } of batch) {
      expect(template.name).toBe(metadata.name)
      expect(template.templateId).toBe(metadata.templateId)
      expect(metadata.officialSchoolTemplate).toBe(false)
    }
  })

  test('source metadata and every criterion source reference are complete', () => {
    for (const { template, metadata } of batch) {
      expect(metadata.sourceDocumentPath).toContain(`/${template.templateId}.md`)
      expect(metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      const sourcePath = resolve(import.meta.dir, '../../../../../../../../', metadata.sourceDocumentPath)
      const sourceSha256 = createHash('sha256').update(readFileSync(sourcePath)).digest('hex')
      expect(sourceSha256).toBe(metadata.sourceDocumentSha256)
      expect(template.sections?.reduce<number>((n, section) => n + section.criteria.length, 0) ?? 0).toBe(metadata.criteria.length)
      const sectionIds = new Set((template.sections ?? []).map(section => section.id))
      const criteria = new Set((template.sections ?? []).flatMap(section => section.criteria.map(criterion => `${section.id}:${criterion.id}`)))
      const fieldIds = new Set<string>(metadata.fieldIds.map(item => item.sourceId))
      const materialIds = new Set<string>(metadata.materialSlotIds.map(item => item.sourceId))
      const sourceIds = new Set<string>(metadata.sourceIndexIds)
      for (const item of metadata.criteria) {
        expect(sectionIds.has(item.sectionId)).toBe(true)
        expect(criteria.has(`${item.sectionId}:${item.criterionId}`)).toBe(true)
        expect(Array.isArray(item.srcIds)).toBe(true)
        expect(['PARTIAL', 'UNCONFIRMED', 'VERIFIED']).toContain(item.evidenceStatus)
        for (const srcId of item.srcIds) expect(sourceIds.has(srcId)).toBe(true)
        const mappedCriterion = (template.sections ?? []).flatMap(section => section.criteria.map(criterion => ({ section, criterion }))).find(entry => entry.section.id === item.sectionId && entry.criterion.id === item.criterionId)?.criterion
        const sourceRuleText = (mappedCriterion?.requirement ?? '').split("\n\n安全门禁")[0] ?? ''
        const expectedSourceIds = referencedSourceIds(sourceRuleText)
        for (const srcId of expectedSourceIds) expect(new Set<string>(item.srcIds).has(srcId)).toBe(true)
        expect(new Set<string>(item.srcIds).size).toBe(expectedSourceIds.size)
      }
      for (const section of template.sections ?? []) {
        for (const criterion of section.criteria) {
          for (const fieldId of referencedIds(criterion.requirement, 'F')) expect(fieldIds.has(fieldId)).toBe(true)
          for (const materialId of referencedIds(criterion.requirement, 'M')) expect(materialIds.has(materialId)).toBe(true)
        }
      }
      expect(template.fields.length).toBe(metadata.fieldIds.length)
      expect(template.materialSlots.length).toBe(metadata.materialSlotIds.length)
      expect(new Set(metadata.fieldIds.map(item => item.sourceId)).size).toBe(metadata.fieldIds.length)
      expect(new Set(metadata.materialSlotIds.map(item => item.sourceId)).size).toBe(metadata.materialSlotIds.length)
      for (const item of metadata.fieldIds) expect(template.fields.find(field => field.key === item.fieldKey)?.label).toBe(item.label)
      for (const item of metadata.materialSlotIds) expect(template.materialSlots.find(slot => slot.id === item.slotId)?.name).toBe(item.name)
    }
  })

  test('display names do not read adjacent evidence/source columns', () => {
    expect(T02T05.fields.find(field => field.key === 'f007')?.label).toBe('考核年度')
    expect(T02T05.fields.find(field => field.key === 'f009')?.label).toBe('各阶段办理时间窗')
    expect(T02T05.materialSlots.find(slot => slot.id === 'm012')?.name).toBe('已形成且可引用的师德结论/状态')
    expect(T02T05.materialSlots.find(slot => slot.id === 'm017')?.name).toBe('师德年度有效结论及最终签发者')
    expect(T02T07.fields.find(field => field.key === 'f010')?.label).toBe('成果发生/获批/完成时点')
    expect(T02T09.fields.find(field => field.key === 'f033')?.label).toBe('本事项适用校本政策/版本')
  })

  test('no dangling structured references, duplicate IDs, or illegal stage edges', () => {
    for (const { template, metadata } of batch) {
      const fieldKeys = new Set(template.fields.map(field => field.key))
      const fieldIds = new Set(metadata.fieldIds.map(field => field.sourceId))
      const slotIds = new Set(template.materialSlots.map(slot => slot.id))
      const sourceSlotIds = new Set(metadata.materialSlotIds.map(slot => slot.sourceId))
      const sectionIds = new Set((template.sections ?? []).map(section => section.id))
      expect(fieldKeys.size).toBe(template.fields.length)
      expect(fieldIds.size).toBe(metadata.fieldIds.length)
      expect(slotIds.size).toBe(template.materialSlots.length)
      expect(sourceSlotIds.size).toBe(metadata.materialSlotIds.length)
      for (const field of template.fields) if (field.sectionId) expect(sectionIds.has(field.sectionId)).toBe(true)
      for (const slot of template.materialSlots) if (slot.sectionId) expect(sectionIds.has(slot.sectionId)).toBe(true)
      for (const field of template.fields) if (field.kind === 'enum') expect(field.options?.length).toBeGreaterThan(0)
      for (const section of template.sections ?? []) {
        expect(new Set(section.criteria.map(criterion => criterion.id)).size).toBe(section.criteria.length)
        for (const criterion of section.criteria) {
          expect(['semantic', 'manual']).toContain(criterion.execution)
          expect(criterion.requirement.length).toBeGreaterThan(20)
        }
      }
      const stageIds = new Set(template.stages.map(stage => stage.id))
      expect(stageIds.size).toBe(template.stages.length)
      for (const stage of template.stages) {
        if (stage.nextStageId) expect(stageIds.has(stage.nextStageId)).toBe(true)
        if (stage.returnToStageId) expect(stageIds.has(stage.returnToStageId)).toBe(true)
      }
      const reachable = new Set<string>()
      let next: string | undefined = template.stages[0]?.id
      while (next && !reachable.has(next)) {
        reachable.add(next)
        next = template.stages.find(stage => stage.id === next)?.nextStageId
      }
      expect(reachable.size).toBe(template.stages.length)
      expect(template.stages.at(-1)?.kind).toBe('finalize')
      expect(template.stages.at(-1)?.nextStageId).toBeUndefined()
      expect(validateTemplate(template).filter(issue => issue.level === 'error')).toEqual([])
    }
  })

  test('all templates remain nonofficial drafts with no automatic pass or fabricated policy versions', () => {
    for (const { template, metadata } of batch) {
      expect(template.schemaVersion).toBe(2)
      expect(template.catalogKind).toBe('builtin')
      expect(template.status).toBe('draft')
      expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true)
      expect(template.description).toContain('本地研究模板 · 非校方正式模板')
      expect(template.autoPassPolicy).toEqual({ enabled: false })
      expect(template.policyVersionIds).toEqual([])
      expect(template.stages.every(stage => stage.workflowOwner === 'local')).toBe(true)
      expect(template.stages.at(-1)?.executorRole).toBe('teacher')
      expect(template.outputs.some(output => output.kind === 'approval')).toBe(false)
      expect(template.autoPassPolicy?.enabled).toBe(false)
      expect(template.status).toBe('draft')
    }
  })
})
