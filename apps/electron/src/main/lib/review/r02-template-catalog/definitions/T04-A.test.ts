import { expect, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { validateTemplate } from '../../template-store'
import { templateVersion as t1, r02Metadata as m1 } from './T04-T01'
import { templateVersion as t2, r02Metadata as m2 } from './T04-T02'
import { templateVersion as t3, r02Metadata as m3 } from './T04-T03'
import { templateVersion as t4, r02Metadata as m4 } from './T04-T04'
import { templateVersion as t5, r02Metadata as m5 } from './T04-T05'
const entries=[{template:t1,metadata:m1},{template:t2,metadata:m2},{template:t3,metadata:m3},{template:t4,metadata:m4},{template:t5,metadata:m5}]
const expected=[["T04-T01","部门采购需求、采购立项与组织采购权责审核"],["T04-T02","招采方式、询比价与供应商选择程序审核"],["T04-T03","采购合同订立、变更与采购合规性审核"],["T04-T04","设备物资接收验收与国有资产入账审核"],["T04-T05","国有资产调拨、借用与保管责任变更审核"]]

test('T04-A IDs/names unique',()=>{expect(entries.map(x=>[x.template.templateId,x.template.name])).toEqual(expected);expect(new Set(entries.map(x=>x.template.templateId)).size).toBe(5);expect(new Set(entries.map(x=>x.template.name)).size).toBe(5)})
test('T04-A TemplateVersion validation and safe defaults',()=>{for(const{template}of entries){expect(validateTemplate(template).filter(x=>x.level==='error')).toEqual([]);expect(template.schemaVersion).toBe(2);expect(template.catalogKind).toBe('builtin');expect(template.status).toBe('draft');expect(template.policyVersionIds).toEqual([]);expect(template.autoPassPolicy?.enabled).toBe(false);expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true);expect(template.description).toContain('本地研究模板 · 非校方正式模板');expect(template.stages.every(x=>x.workflowOwner==='local'&&x.kind==='manual-review')).toBe(true);expect(template.sections?.flatMap(s=>s.criteria).every(x=>x.execution!=='deterministic')).toBe(true)}})
test('T04-A field/material/criterion/source/stage references complete',()=>{for(const{template,metadata}of entries){const fields=new Set(template.fields.map(x=>x.key)),slots=new Set(template.materialSlots.map(x=>x.id)),sections=template.sections??[],sectionIds=new Set(sections.map(x=>x.id)),criteria=sections.flatMap(section=>section.criteria.map(criterion=>({section,criterion}))),sourceIds=new Set(metadata.sources.map(x=>x.id));expect(fields.size).toBe(template.fields.length);expect(slots.size).toBe(template.materialSlots.length);expect(sectionIds.size).toBe(sections.length);expect(new Set(criteria.map(x=>x.criterion.id)).size).toBe(criteria.length);expect(criteria.length).toBe(metadata.criteria.length);expect(metadata.sources.length).toBeGreaterThan(0);expect(metadata.sourceDocumentSha256).toMatch(/^[0-9a-f]{64}$/);expect(metadata.originalSourceSha256).toMatch(/^[0-9a-f]{64}$/);expect(metadata.officialSchoolTemplate).toBe(false);for(const c of metadata.criteria){expect(sectionIds.has(c.sectionId)).toBe(true);expect(criteria.some(x=>x.criterion.id===c.criterionId&&x.section.id===c.sectionId)).toBe(true);expect(['VERIFIED','PARTIAL','UNCONFIRMED']).toContain(c.evidenceStatus);for(const src of c.sourceIds)expect(sourceIds.has(src)).toBe(true);if(c.evidenceStatus==='UNCONFIRMED')expect(criteria.find(x=>x.criterion.id===c.criterionId)?.criterion.execution).toBe('manual')}for(const stage of template.stages){if(stage.nextStageId)expect(template.stages.some(x=>x.id===stage.nextStageId)).toBe(true);if(stage.returnToStageId)expect(template.stages.some(x=>x.id===stage.returnToStageId)).toBe(true)}const reached=new Set<string>();let current:string|undefined=template.stages[0]?.id;while(current){expect(reached.has(current)).toBe(false);reached.add(current);current=template.stages.find(x=>x.id===current)?.nextStageId}expect(reached.size).toBe(template.stages.length)}})
test('T04-A unconfirmed policy never auto-passes',()=>{for(const{template,metadata}of entries){expect(template.autoPassPolicy?.enabled).toBe(false);expect(template.policyVersionIds).toEqual([]);for(const c of metadata.criteria)if(c.evidenceStatus==='UNCONFIRMED')expect(template.sections?.flatMap(s=>s.criteria).find(x=>x.id===c.criterionId)?.execution).toBe('manual')}})

const counts = [
  { fields: 35, slots: 25, criteria: 31, sources: 22, stages: 6 },
  { fields: 49, slots: 26, criteria: 27, sources: 31, stages: 7 },
  { fields: 51, slots: 30, criteria: 41, sources: 26, stages: 8 },
  { fields: 44, slots: 26, criteria: 28, sources: 11, stages: 7 },
  { fields: 40, slots: 22, criteria: 27, sources: 14, stages: 6 },
] as const

const hash = (input: Uint8Array) => createHash('sha256').update(input).digest('hex')

test('T04-A source bytes, authoritative manifest, and reviewed MD remain traceable', () => {
  const manifestPath = resolve('docs/design/review-agent/business-templates/R02/dispatch/00_模板清单_128.tsv')
  const lines = readFileSync(manifestPath, 'utf8').trimEnd().split('\n')
  const rows = new Map<string, { bytes: number; sha256: string }>()
  for (const line of lines.slice(1)) {
    const columns = line.split('\t')
    const templateId = columns[0]
    if (!templateId) continue
    rows.set(templateId, { bytes: Number(columns[7]), sha256: columns[8] ?? '' })
  }

  for (const { template, metadata } of entries) {
    const row = rows.get(template.templateId)
    expect(row).toBeDefined()
    const original = readFileSync(resolve(metadata.originalSourcePath))
    const reviewed = readFileSync(resolve(metadata.sourceDocumentPath))
    // The authoritative dispatch README records a one-LF difference for all 128 blobs.
    const manifestBytes = Buffer.concat([original, Buffer.from('\n')])
    expect(manifestBytes.length).toBe(row!.bytes)
    expect(hash(manifestBytes)).toBe(row!.sha256)
    expect(String(metadata.originalSourceSha256)).toBe(row!.sha256)
    expect(String(metadata.sourceDocumentSha256)).toBe(hash(reviewed))
    // T04-T03 uses `key=value` metadata rather than YAML front matter.
    const reviewedText = reviewed.toString('utf8')
    expect(reviewedText.includes(`template_id: ${template.templateId}`) ||
      reviewedText.includes(`template_id=${template.templateId}`)).toBe(true)
    expect(reviewedText.includes(`name: ${template.name}`) ||
      reviewedText.includes(`name=${template.name}`)).toBe(true)
    expect(metadata.originalGitBlobSha).toMatch(/^[0-9a-f]{40}$/)
    expect(metadata.sourceIntegrityNote).toContain('LINE_ENDING_DRIFT_ONE_LF')
  }
})

test('T04-A research tables have full runtime cardinality and nonempty source mappings', () => {
  for (const [index, { template, metadata }] of entries.entries()) {
    const expected = counts[index]
    if (!expected) throw new Error('Missing expected inventory entry at index ' + index)
    const criteria = template.sections?.flatMap(section => section.criteria) ?? []
    expect(template.fields.length).toBe(expected.fields)
    expect(template.materialSlots.length).toBe(expected.slots)
    expect(criteria.length).toBe(expected.criteria)
    expect(metadata.criteria.length).toBe(expected.criteria)
    expect(metadata.sources.length).toBe(expected.sources)
    expect(template.stages.length).toBe(expected.stages)
    expect(String(metadata.templateId)).toBe(String(template.templateId))
    expect(String(metadata.name)).toBe(String(template.name))
    expect(metadata.policyEvidenceStatus).toBe('PARTIAL')
    expect(metadata.criteria.every(c => c.sourceIds.length > 0)).toBe(true)
    expect(metadata.sources.every(s => /^SRC-\d{3}$/.test(s.id))).toBe(true)
    expect(new Set(metadata.sources.map(s => s.id)).size).toBe(metadata.sources.length)
    expect(metadata.criteria.every(c => /^R\d{3}$/.test(c.criterionId))).toBe(true)
    expect(criteria.every(c => c.execution === 'semantic' || c.execution === 'manual')).toBe(true)
    expect(template.stages.every(s => s.workflowOwner === 'local' &&
      (s.executorRole === 'reviewer' || s.executorRole === 'teacher'))).toBe(true)
    expect(template.outputs.every(o => o.audience === 'reviewer' || o.audience === 'teacher')).toBe(true)
    expect(template.policyRefs ?? []).toEqual([])
  }
})
