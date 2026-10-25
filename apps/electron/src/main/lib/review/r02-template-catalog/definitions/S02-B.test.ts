import { describe, expect, test } from 'bun:test'
import { validateTemplate } from '../../template-store'
import { templateVersion as t06, r02Metadata as m06 } from './S02-T06'
import { templateVersion as t07, r02Metadata as m07 } from './S02-T07'
import { templateVersion as t08, r02Metadata as m08 } from './S02-T08'
import { templateVersion as t09, r02Metadata as m09 } from './S02-T09'
import { templateVersion as t10, r02Metadata as m10 } from './S02-T10'
const entries=[
 {template:t06,metadata:m06,name:"学生发起的成绩复核、复核后异议及复议申请审核",fields:36,slots:25,criteria:39,stages:9},
 {template:t07,metadata:m07,name:"逾期补选、退课资格审核",fields:37,slots:22,criteria:30,stages:8},
 {template:t08,metadata:m08,name:"重修、补修资格及教学班调整审核",fields:42,slots:29,criteria:40,stages:9},
 {template:t09,metadata:m09,name:"辅修、双学位、微专业修读资格审核",fields:47,slots:30,criteria:43,stages:10},
 {template:t10,metadata:m10,name:"学生体质健康测试免测、缓测与补测资格审核",fields:45,slots:22,criteria:27,stages:8},
] as const
const resultCodes=['pass-fact','not-applicable','needs-material','conflict','unreadable','source-unavailable','policy-unconfirmed','needs-human-decision']
describe('R02 S02-B native template definitions',()=>{
 test('IDs and names are unique',()=>{expect(entries.map(x=>x.template.templateId)).toEqual(['S02-T06','S02-T07','S02-T08','S02-T09','S02-T10']);expect(new Set(entries.map(x=>x.template.templateId)).size).toBe(5);expect(new Set(entries.map(x=>x.template.name)).size).toBe(5);for(const e of entries)expect(e.template.name).toBe(e.name)})
 for(const e of entries)test(`${e.template.templateId} has safe V3 structure mapped from source`,()=>{
  const t=e.template,m=e.metadata
  expect(t.schemaVersion).toBe(2);expect(t.catalogKind).toBe('builtin');expect(t.status).toBe('draft');expect(t.policyVersionIds).toEqual([]);expect(t.policyRefs??[]).toEqual([]);expect(t.autoPassPolicy?.enabled).toBe(false)
  expect(t.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true);expect(t.description).toContain('本地研究模板 · 非校方正式模板');expect(m.officialSchoolTemplate).toBe(false);expect(m.policyEvidenceStatus).toBe('PARTIAL')
  expect(m.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/);expect(m.sourceOriginalSha256).toMatch(/^[a-f0-9]{64}$/)
  expect(t.fields).toHaveLength(e.fields);expect(t.materialSlots).toHaveLength(e.slots);const cs=(t.sections??[]).flatMap(s=>s.criteria);expect(cs).toHaveLength(e.criteria);expect(m.criteria).toHaveLength(cs.length);expect(t.stages).toHaveLength(e.stages)
  expect(new Set(t.fields.map(f=>f.key)).size).toBe(t.fields.length);expect(new Set(t.materialSlots.map(s=>s.id)).size).toBe(t.materialSlots.length);expect(new Set(cs.map(c=>c.id)).size).toBe(cs.length);expect(new Set(t.stages.map(s=>s.id)).size).toBe(t.stages.length);expect(new Set(t.outputs.map(o=>o.id)).size).toBe(t.outputs.length)
  expect(cs.every(c=>c.execution!=='deterministic')).toBe(true);expect(cs.every(c=>['semantic','manual'].includes(c.execution))).toBe(true);expect(t.materialSlots.every(s=>s.minCount===0)).toBe(true);expect(t.stages.every(s=>s.workflowOwner==='local')).toBe(true);expect(t.stages.every(s=>['reviewer','teacher'].includes(s.executorRole))).toBe(true);expect(t.outputs.some(o=>o.kind==='approval'||o.kind==='roster')).toBe(false);expect(t.outputs.every(o=>['approval','item-feedback','supplement-list','score-sheet','roster','rating-matrix'].includes(o.kind))).toBe(true);expect(validateTemplate(t).filter(i=>i.level==='error')).toEqual([])
  expect(t.stages[t.stages.length-1]?.kind).toBe('handoff');expect(t.stages.every(s=>!s.nextStageId||t.stages.some(x=>x.id===s.nextStageId))).toBe(true);expect(t.stages.every(s=>!s.returnToStageId||t.stages.some(x=>x.id===s.returnToStageId))).toBe(true)
  for(const code of resultCodes)expect(t.outputs.some(o=>o.id===code)).toBe(true)
  const src=new Set(m.sources.map(s=>s.id));for(const c of m.criteria){expect(cs.some(x=>x.id===c.criterionId&&c.sectionId==='research-criteria')).toBe(true);for(const id of c.sourceIds)expect(src.has(id)).toBe(true)}
 })
 test('unconfirmed policy cannot create automatic formal decisions',()=>{for(const e of entries){expect(e.metadata.policyEvidenceStatus).toBe('PARTIAL');expect(e.template.policyVersionIds).toEqual([]);expect(e.template.autoPassPolicy?.enabled).toBe(false);expect(e.template.stages.some(s=>s.kind==='auto-check')).toBe(false);expect((e.template.sections??[]).flatMap(s=>s.criteria).every(c=>c.execution!=='deterministic')).toBe(true);expect(e.template.outputs.some(o=>o.kind==='approval')).toBe(false)}})
})
