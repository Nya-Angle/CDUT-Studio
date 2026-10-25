import { expect, test } from 'bun:test'
import { validateTemplate } from '../../template-store'
import { templateVersion as S08T01, r02Metadata as S08T01Meta } from './S08-T01'
import { templateVersion as S08T03, r02Metadata as S08T03Meta } from './S08-T03'
import { templateVersion as S08T04, r02Metadata as S08T04Meta } from './S08-T04'
import { templateVersion as S08T05, r02Metadata as S08T05Meta } from './S08-T05'
import { templateVersion as S08T06, r02Metadata as S08T06Meta } from './S08-T06'

const batch = [
  { template: S08T01, metadata: S08T01Meta },
  { template: S08T03, metadata: S08T03Meta },
  { template: S08T04, metadata: S08T04Meta },
  { template: S08T05, metadata: S08T05Meta },
  { template: S08T06, metadata: S08T06Meta },
]
function expandRefs(text: string, prefix: 'F' | 'M'): Set<string> {
  const refs = new Set<string>()
  const range = new RegExp('\\b' + prefix + '(\\d{3})\\s*[–—-]\\s*' + prefix + '(\\d{3})\\b', 'g')
  for (const m of text.matchAll(range)) { const a=Number(m[1]), b=Number(m[2]); if (b>=a && b-a<300) for(let n=a;n<=b;n++) refs.add(prefix+String(n).padStart(3,'0')) }
  const single = new RegExp('\\b' + prefix + '\\d{3}\\b', 'g')
  for (const m of text.matchAll(single)) refs.add(m[0])
  return refs
}
function criteriaOf(template: typeof batch[number]['template']) { return (template.sections ?? []).flatMap(s=>s.criteria.map(c=>({...c,sectionId:s.id}))) }
test('IDs and formal names are correct and unique',()=>{expect(batch).toHaveLength(5);expect(new Set(batch.map(x=>x.template.templateId)).size).toBe(5);for(const x of batch){expect(x.template.name).toBe(x.metadata.name);expect(x.template.templateId).toBe(x.metadata.templateId);expect(x.template.schemaVersion).toBe(2)}})
test('all definitions pass validateTemplate without errors',()=>{for(const {template} of batch){const errors=validateTemplate(template).filter(x=>x.level==='error');expect(errors,template.templateId+': '+errors.map(x=>x.message).join('; ')).toEqual([])}})
test('field, material and criterion references have no dangling F/M IDs',()=>{for(const {template} of batch){const fs=new Set(template.fields.map(x=>x.key)),ms=new Set(template.materialSlots.map(x=>x.id));expect(fs.size).toBe(template.fields.length);expect(ms.size).toBe(template.materialSlots.length);for(const slot of template.materialSlots){expect(slot.acceptedKinds.length).toBeGreaterThan(0);if(slot.acceptedKinds.includes('zip'))expect(/zip|\\.zip/i.test(slot.purpose)).toBe(true)}const texts=[...(template.sections??[]).flatMap(s=>s.criteria.map(c=>c.requirement)),...template.materialSlots.flatMap(m=>[m.name,m.purpose,...m.requiredElements])];for(const t of texts){for(const id of expandRefs(t,'F'))expect(fs.has(id),template.templateId+' dangling field '+id).toBe(true);for(const id of expandRefs(t,'M'))expect(ms.has(id),template.templateId+' dangling material '+id).toBe(true)}const cs=criteriaOf(template);expect(new Set(cs.map(c=>c.id)).size).toBe(cs.length);for(const s of template.sections??[])expect(new Set(s.criteria.map(c=>c.id)).size).toBe(s.criteria.length)}})
test('every criterion maps to SRC evidence metadata',()=>{for(const {template,metadata} of batch){const cs=criteriaOf(template);expect(metadata.criteria).toHaveLength(cs.length);const keys=new Set(metadata.criteria.map(c=>c.sectionId+'/'+c.criterionId));expect(keys.size).toBe(metadata.criteria.length);for(const c of cs){const m=metadata.criteria.find(x=>x.sectionId===c.sectionId&&x.criterionId===c.id);expect(m).toBeDefined();expect(['VERIFIED','PARTIAL','UNCONFIRMED']).toContain(m!.evidenceStatus);expect(m!.srcIds.length).toBeGreaterThan(0);expect(m!.srcIds.every(x=>/^SRC-\d{3}$/.test(x))).toBe(true)}}})
const expectedStageIds: Record<string, string[]> = {
  'S08-T01': ['p0','p1','p2','p3','p4','p5','p6'],
  'S08-T03': ['p0','p1','p2','p3','p4','p5','p6','p7','p8','p9','p10'],
  'S08-T04': ['registered','eligibility-check','student-materials','advisor-review','committee-review','result-published','follow-up','archived'],
  'S08-T05': ['l0','l1','l2','l3','l4','l5'],
  'S08-T06': ['phase-1','phase-2','phase-3','phase-4','phase-5','phase-6','phase-7','phase-8'],
}
test('stage graphs are reachable, unique, acyclic and local', () => {
  for (const { template } of batch) {
    const ss = template.stages
    const ids = ss.map((stage) => stage.id)
    const byId = new Map(ss.map((stage) => [stage.id, stage]))
    const expectedIds = expectedStageIds[template.templateId]
    const first = ss[0]
    const last = ss.at(-1)
    if (!expectedIds) throw new Error('Missing expected stage inventory for ' + template.templateId)
    if (!first || !last) throw new Error('Template has no start/final stage: ' + template.templateId)
    expect(ids.length).toBeGreaterThan(1)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toEqual(expectedIds)
    for (const stage of ss) {
      if (stage.nextStageId) expect(byId.has(stage.nextStageId)).toBe(true)
      if (stage.returnToStageId) expect(byId.has(stage.returnToStageId)).toBe(true)
      expect(stage.workflowOwner).toBe('local')
      expect(['reviewer', 'teacher']).toContain(stage.executorRole)
      expect(stage.kind).not.toBe('auto-check')
    }
    const seen = new Set<string>()
    let current: string | undefined = first.id
    while (current) {
      expect(seen.has(current), template.templateId + ' cycle at ' + current).toBe(false)
      seen.add(current)
      current = byId.get(current)?.nextStageId
    }
    expect(seen.size).toBe(ss.length)
    expect(last.kind).toBe('handoff')
  }
})
test('enum fields always declare explicit options before using enum kind',()=>{for(const {template} of batch){for(const field of template.fields){if(field.kind==='enum')expect(field.options?.length).toBeGreaterThan(0)}}})
test('non-official and uncertain policies cannot auto-pass or impersonate PolicyVersion',()=>{for(const {template,metadata} of batch){expect(template.description).toContain('本地研究模板 · 非校方正式模板');expect(template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBe(true);expect(metadata.officialSchoolTemplate).toBe(false);expect(metadata.policyEvidenceStatus).toBe('PARTIAL');expect(metadata.sourceDocumentPath).toContain('/R02/'+template.templateId+'.md');expect(metadata.sourceDocumentSha256).toMatch(/^[0-9a-f]{64}$/);expect(metadata.originalSourceSha256).toBe(metadata.manifestSha256);expect(metadata.manifestHashCheck).toBe(true);expect(template.policyVersionIds).toEqual([]);expect(template.autoPassPolicy?.enabled).toBe(false);expect(template.status).toBe('draft');expect((template.sections??[]).flatMap(s=>s.criteria).every(c=>c.execution!=='deterministic')).toBe(true);expect(template.outputs.some(o=>o.kind==='approval')).toBe(false)}})
