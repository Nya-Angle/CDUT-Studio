import { describe, expect, test } from 'bun:test'
import type { RuleSpec, TemplateVersion } from '@profer/shared'
import { evaluateT04Plan } from './review-v3-t04-rules-scoring'
import {
  compilePublishedTemplateReviewPlan,
  type T04PublishedConstraint, type T04PublishedTarget,
} from './review-v3-t04-published-plan'

const template = (patch: Partial<TemplateVersion> = {}): TemplateVersion => ({
  templateId: 'lab-local', version: 1, schemaVersion: 2, name: '虚构实验室申请',
  objectType: 'organization', displayName: {template:'{{organization}}'},
  fields: [
    {key:'peopleCount',label:'参与人数',kind:'number',scope:'case',required:true,max:20,unit:'人',visibility:'public'},
  ],
  materialSlots: [
    {id:'plan',name:'使用计划书',purpose:'活动计划',acceptedKinds:['office'],
      minCount:1,maxCount:1,requiredAt:'submission',requiredElements:['时间'],allowReuseAcrossSubjects:false},
  ],
  sections: [], policyVersionIds:[], stages:[
    {id:'initial',name:'初审',kind:'manual-review',executorRole:'reviewer',nextStageId:'final'},
    {id:'final',name:'终审',kind:'manual-review',executorRole:'teacher'},
  ], outputs:[], status:'published',createdAt:'2026-10-21T00:00:00Z',publishedAt:'2026-10-21T00:10:00Z',
  ...patch,
})
const peopleRule = (patch: Partial<RuleSpec> = {}): RuleSpec => ({
  id:'section-eligibility-count',policyVersionId:'template:lab-local@1',
  title:'人数不超过20',when:{all:[]},requirement:'人数应不超过20',
  targetScope:'case',execution:'deterministic',onFail:'manual-review',
  onUnknown:'needs-confirmation',sourceRefIds:[],priority:1,
  confirmation:'confirmed',confirmedBy:'local-owner',...patch,
})
const clause = (patch: Partial<T04PublishedConstraint> = {}): T04PublishedConstraint => ({
  templateId:'lab-local',templateVersion:1,ruleId:'section-eligibility-count',
  policyVersionId:'template:lab-local@1',
  confirmedBy:'local-owner',confirmedAt:'2026-10-21T00:00:00Z',
  constraint:{kind:'field-maximum',fieldKey:'peopleCount',maximum:'20',unit:'人'},
  ...patch,
})
const target = (count:number|null, versions=['document-version-1'], confirmed=true): T04PublishedTarget => ({
  scope:'case',targetKey:'case:lab-1',objectKey:'case:lab-1',subjectId:'lab-1',
  fields:{peopleCount:{value:count,confirmed,unit:'人'}},
  sourceVersionIds:[...versions],materialSlots:{plan:{documentVersionIds:[...versions],confirmed:true}},
})
function compile(targets: T04PublishedTarget[], opts: {
  constraints?: T04PublishedConstraint[]; rules?: RuleSpec[]; template?: TemplateVersion
} = {}) {
  return compilePublishedTemplateReviewPlan({
    template:opts.template ?? template(),effectiveRules:opts.rules ?? [peopleRule()],
    constraints:opts.constraints ?? [clause()],targets,phase:'submission',
  })
}
function statuses(result: ReturnType<typeof compile>) {
  return Object.fromEntries(evaluateT04Plan(result.plan,result.checks).map(p=>[p.ruleId,p.outcome.status]))
}

describe('T04 R01 published template -> explicit typed rule -> immutable Plan',()=>{
  test('18 compliant, 21 non-compliant; no hard-coded laboratory-specific branch',()=>{
    const pass=compile([target(18)])
    const fail=compile([target(21)])
    expect(statuses(pass)).toEqual({
      'section-eligibility-count':'compliant',
      'required-material-plan':'compliant',
    })
    expect(statuses(fail)['section-eligibility-count']).toBe('non-compliant')
    expect(pass.plan.templateVersion).toBe('1')
    expect(pass.plan.bindings).toHaveLength(2)
    expect(pass.bindings).toHaveLength(pass.plan.bindings.length)
    expect(new Set(pass.plan.bindings.map(b=>b.checkKey)).size).toBe(2)
    expect(pass.plan.fingerprint).not.toBe(fail.plan.fingerprint)
    expect(compile([target(18)]).plan).toEqual(pass.plan)
  })
  test('unknown numeric field stays awaiting-confirmation, not zero',()=>{
    expect(statuses(compile([target(null,['document-version-1'],false)]))['section-eligibility-count'])
      .toBe('awaiting-confirmation')
  })
  test('Main-confirmed empty slot requires supplement, unconfirmed slot stays pending',()=>{
    const missing=target(12,[])
    expect(statuses(compile([missing]))['required-material-plan']).toBe('awaiting-supplement')
    const unknown=target(12,[])
    unknown.materialSlots.plan = {documentVersionIds:[],confirmed:false}
    expect(statuses(compile([unknown]))['required-material-plan']).toBe('awaiting-confirmation')
    expect(compile([missing]).plan.bindings.every(b=>b.sourceVersionIds.length===0)).toBe(true)
  })
  test('FieldSpec.max alone never authors a deterministic policy Check',()=>{
    const result=compile([target(18)],{constraints:[]})
    expect(statuses(result)['section-eligibility-count']).toBe('awaiting-confirmation')
    expect(statuses(result)['required-material-plan']).toBe('compliant')
  })
  test('only explicit confirmed deterministic rules get typed operators',()=>{
    expect(()=>compile([target(18)],{rules:[peopleRule({execution:'manual'})]})).toThrow(
      'T04_PUBLISHED_PLAN_INVALID')
    expect(()=>compile([target(18)],{rules:[peopleRule({confirmation:'unconfirmed'})]})).toThrow(
      'T04_PUBLISHED_PLAN_INVALID')
    expect(()=>compile([target(18)],{constraints:[clause({templateVersion:2})]})).toThrow(
      'T04_PUBLISHED_PLAN_INVALID')
    expect(()=>compile([target(18)],{template:template({status:'draft'})})).toThrow(
      'T04_PUBLISHED_PLAN_INVALID')
  })
  test('rejects unverified material ID, mismatched typed field and duplicate rules',()=>{
    const forged=target(12)
    forged.materialSlots.plan = {documentVersionIds:['not-current'],confirmed:true}
    expect(()=>compile([forged])).toThrow('Material version not in target')
    expect(()=>compile([target(12)],{constraints:[clause({constraint:{
      kind:'field-maximum',fieldKey:'nonexistent',maximum:'20',
    }})]})).toThrow('T04_PUBLISHED_PLAN_INVALID')
    expect(()=>compile([target(12)],{rules:[peopleRule(),peopleRule()]})).toThrow(
      'T04_PUBLISHED_PLAN_INVALID')
  })
  test('unit-specific maximum without confirmed matching unit stays pending',()=>{
    const uncertain=target(18)
    delete uncertain.fields.peopleCount?.unit
    expect(statuses(compile([uncertain]))['section-eligibility-count']).toBe('awaiting-confirmation')
    const mismatched=target(18)
    mismatched.fields.peopleCount!.unit = '元'
    expect(statuses(compile([mismatched]))['section-eligibility-count']).toBe('awaiting-confirmation')
  })
  test('conflicting versions of the same policy limit are not silently both accepted',()=>{
    const second=peopleRule({id:'school-count',policyVersionId:'school-policy@2'})
    const a=clause({claimKey:'lab-attendance'})
    const b=clause({ruleId:'school-count',policyVersionId:'school-policy@2',claimKey:'lab-attendance',
      constraint:{kind:'field-maximum',fieldKey:'peopleCount',maximum:'19',unit:'人'}})
    const compiled=compile([target(20)],{rules:[peopleRule(),second],constraints:[a,b]})
    const proposals=evaluateT04Plan(compiled.plan,compiled.checks)
    expect(proposals.filter(p=>p.ruleId==='section-eligibility-count' || p.ruleId==='school-count')
      .every(p=>p.outcome.status==='awaiting-confirmation')).toBe(true)
  })
  test('plan and binding digest change if rule/owner constraint/source change',()=>{
    const first=compile([target(18)])
    expect(compile([target(18,['document-version-2'])]).plan.fingerprint).not.toBe(first.plan.fingerprint)
    expect(compile([target(18)],{constraints:[clause({constraint:{
      kind:'field-maximum',fieldKey:'peopleCount',maximum:'19',unit:'人',
    }})]}).plan.fingerprint).not.toBe(first.plan.fingerprint)
    expect(compile([target(18)],{rules:[peopleRule({requirement:'新的确认规则'})]})
      .bindingLedgerHash).not.toBe(first.bindingLedgerHash)
  })
  test('decision-only required slot is not-applicable at submission, must recompile at decision',()=>{
    const t=template({materialSlots:template().materialSlots.map(s=>({...s,requiredAt:'decision'}))})
    expect(statuses(compile([target(18,[])],{template:t}))['required-material-plan']).toBe('not-applicable')
    const decision=compilePublishedTemplateReviewPlan({
      template:t,effectiveRules:[peopleRule()],constraints:[clause()],targets:[target(18,[])],phase:'decision',
    })
    expect(statuses(decision)['required-material-plan']).toBe('awaiting-supplement')
  })
})
