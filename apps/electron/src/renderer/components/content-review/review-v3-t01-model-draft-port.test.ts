import {describe,expect,test} from 'bun:test'
import {draftT01FromBrief} from './review-v3-t01-brief-authoring'
import {draftT01ViaAuthorizedModel,makeT01ModelDraftPrompt,parseT01ModelDraftResponse} from './review-v3-t01-model-draft-port'

const brief='模板名称：实验室申请\n审核对象：组织\n字段：组织名称、参加人数（1-20人）\n材料：计划书\n流程：初审→终审'
describe('T01 authorized-model draft domain contract',()=>{
  test('system instructions prohibit invented policy authority',()=>{
    const p=makeT01ModelDraftPrompt(brief)
    expect(p.system).toContain('policyVersionIds=[]')
    expect(p.system).toContain('questions')
    expect(p.user).toContain('实验室申请')
  })
  test('an untrusted model may only return an editable draft, never published authority',async()=>{
    const seed=draftT01FromBrief(brief,'seed','2026-10-21T00:00:00Z').template
    const untrusted={...seed,status:'published',policyVersionIds:['fake'],policyRefs:[{id:'forged'}],publishedAt:'2026-10-21T00:00:00Z'}
    const text=JSON.stringify({template:untrusted,questions:['核实上限'],extracted:['草拟字段']})
    const result=await draftT01ViaAuthorizedModel(brief,'new-brief','2026-10-21T12:00:00Z',async()=>text)
    expect(result.template.templateId).toBe('new-brief')
    expect(result.template.status).toBe('draft')
    expect(result.template.policyVersionIds).toEqual([])
    expect(result.template.policyRefs).toBeUndefined()
    expect(result.template.publishedAt).toBeUndefined()
    expect(result.supportedBy).toBe('authorized-model-draft')
    expect(result.questions.join(' ')).toContain('核实')
  })
  test('invalid output does not silently degrade to fake completion',()=>{
    expect(()=>parseT01ModelDraftResponse('not json','x','2026-10-21')).toThrow('T01_MODEL_JSON_INVALID')
    expect(()=>parseT01ModelDraftResponse('{}','x','2026-10-21')).toThrow('T01_MODEL_TEMPLATE_REQUIRED')
  })
})
