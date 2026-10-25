import { describe, expect, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { validateTemplate } from '../../template-store'
import type { TemplateVersion } from '@profer/shared'
import { r02Metadata as metadata14, templateVersion as template14 } from './T02-T14'
import { r02Metadata as metadata15, templateVersion as template15 } from './T02-T15'
import { r02Metadata as metadata16, templateVersion as template16 } from './T02-T16'
import { r02Metadata as metadata17, templateVersion as template17 } from './T02-T17'
type Metadata = { templateId: string; name: string; sourceDocumentPath: string; sourceDocumentSha256: string; originalSourceDocumentPath: string; originalSourceSha256: string; officialSchoolTemplate: boolean; policyEvidenceStatus: string; sources: ReadonlyArray<{id:string}>; criteria: ReadonlyArray<{sectionId:string;criterionId:string;sourceIds:ReadonlyArray<string>;evidenceStatus:string}> }
const entries: Array<{template:TemplateVersion;metadata:Metadata}> = [
 {template:template14,metadata:metadata14},{template:template15,metadata:metadata15},{template:template16,metadata:metadata16},{template:template17,metadata:metadata17}
]
describe('R02 T02-D template definitions',()=>{
 test('keeps IDs/names unique, references complete, stages reachable, and auto-pass disabled',()=>{
  expect(new Set(entries.map(x=>x.template.templateId)).size).toBe(4)
  expect(new Set(entries.map(x=>x.template.name)).size).toBe(4)
  for(const {template,metadata} of entries){
   expect(template.templateId).toBe(metadata.templateId);expect(template.name).toBe(metadata.name);expect(template.schemaVersion).toBe(2);expect(template.catalogKind).toBe('builtin');expect(template.status).toBe('draft');expect(template.policyVersionIds).toEqual([]);expect(template.autoPassPolicy?.enabled).toBe(false)
   expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true);expect(template.description).toContain('本地研究模板 · 非校方正式模板');expect(metadata.officialSchoolTemplate).toBe(false);expect(metadata.policyEvidenceStatus).toBe('PARTIAL');expect(metadata.sourceDocumentPath).toContain('/R02/'+template.templateId+'.md');expect(metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/);expect(metadata.originalSourceDocumentPath).toContain('/research-original/'+template.templateId+'.md');expect(metadata.originalSourceSha256).toMatch(/^[a-f0-9]{64}$/);expect(metadata.sources.length).toBeGreaterThan(0)
   const reviewedSha = createHash('sha256').update(readFileSync(metadata.sourceDocumentPath)).digest('hex')
   expect(reviewedSha).toBe(metadata.sourceDocumentSha256)
   const fields=new Set(template.fields.map(x=>x.key)),slots=new Set(template.materialSlots.map(x=>x.id)),criteria=template.sections?.flatMap(x=>x.criteria)??[]
   expect(new Set(template.fields.map(x=>x.key)).size).toBe(template.fields.length);expect(new Set(template.materialSlots.map(x=>x.id)).size).toBe(template.materialSlots.length);expect(new Set(criteria.map(x=>x.id)).size).toBe(criteria.length);expect(metadata.criteria.length).toBe(criteria.length)
   for(const c of criteria){expect(['semantic','manual']).toContain(c.execution);for(const ref of c.requirement.match(/\b[FM]\d{3}\b/g)??[])expect(ref.startsWith('F')?fields.has(ref):slots.has(ref)).toBe(true);const m=metadata.criteria.find(x=>x.criterionId===c.id);if(!m)throw new Error('Missing criterion metadata for '+c.id);expect(m.sectionId).toBe('rules');expect(['VERIFIED','PARTIAL','UNCONFIRMED']).toContain(m.evidenceStatus);for(const sid of m.sourceIds)expect(metadata.sources.some(x=>x.id===sid)).toBe(true)}
   const stageIds=new Set(template.stages.map(x=>x.id));expect(stageIds.size).toBe(template.stages.length);for(const s of template.stages){if(s.nextStageId)expect(stageIds.has(s.nextStageId)).toBe(true);if(s.returnToStageId)expect(stageIds.has(s.returnToStageId)).toBe(true);expect(s.workflowOwner).toBe('local')}
   const reached=new Set<string>();let stageId:string|undefined=template.stages[0]?.id;while(stageId){expect(reached.has(stageId)).toBe(false);reached.add(stageId);stageId=template.stages.find(x=>x.id===stageId)?.nextStageId}expect(reached.size).toBe(template.stages.length)
   expect(validateTemplate(template).filter(x=>x.level==='error')).toEqual([]);if(metadata.policyEvidenceStatus!=='VERIFIED'){expect(template.autoPassPolicy?.enabled).toBe(false);expect(template.policyVersionIds).toEqual([]);expect(criteria.every(x=>!String(x.execution).includes('deterministic'))).toBe(true)}
  }
 })
})
