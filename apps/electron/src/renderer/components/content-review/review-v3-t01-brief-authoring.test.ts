import {describe,expect,test} from 'bun:test'
import {validateTemplate} from '../../../main/lib/review/template-store'
import {draftT01FromBrief} from './review-v3-t01-brief-authoring'
import {trialT01Template} from './review-v3-t01-business-presets'
import { readT01NumberLimit, validateT01TypedCriteria } from './review-v3-t01-typed-criteria'

const make=(text:string)=>draftT01FromBrief(text,'brief-example','2026-10-21T00:00:00.000Z')
describe('T01 explicit-language authoring and honest uncertainty',()=>{
  test('A15: complete user brief yields a no-year organization draft with bounded headcount and two local reviews',()=>{
    const result=make([
      '模板名称：实验室预约申请',
      '审核对象：组织',
      '字段：组织名称、负责人、参加人数（1-20人）、使用日期、使用时段、用途',
      '必交材料：实验计划书',
      '流程：自动检查→初审→终审',
      '规则：人数不得超过20；计划书必须包含使用目的和安全安排',
      '不评分',
    ].join('\n'))
    const t=result.template
    expect(t.name).toBe('实验室预约申请')
    expect(t.objectType).toBe('organization')
    expect(t.status).toBe('draft')
    expect(t.policyVersionIds).toEqual([])
    expect(t.fields.some(x=>x.key==='academicYear')).toBe(false)
    expect(t.fields.find(x=>x.key==='peopleCount')).toMatchObject({kind:'number',min:1})
    expect(t.fields.find(x=>x.key==='peopleCount')?.max).toBeUndefined()
    const numeric = t.sections?.[0]?.criteria.find(c=>readT01NumberLimit(c))
    expect(readT01NumberLimit(numeric!)).toMatchObject({fieldKey:'peopleCount',operator:'lte',threshold:20})
    expect(validateT01TypedCriteria(t).join(' ')).toContain('负责人确认')
    expect(t.materialSlots).toHaveLength(1)
    expect(t.stages.map(x=>x.kind)).toEqual(['auto-check','manual-review','manual-review'])
    expect(t.rubric).toBeUndefined()
    expect(result.supportedBy).toBe('explicit-local-brief')
    expect(result.questions.join(' ')).toContain('制度')
    expect(validateTemplate(t).filter(x=>x.level==='error')).toEqual([])
    const fields={organization:'模拟协会',contact:'申请人',peopleCount:21,useDate:'2026-11-01',timePeriod:'上午',purpose:'实验'}
    expect(trialT01Template(t,fields,{'material-1':1}).status).toBe('ready-for-human-review')
  })
  test('correctly recognizes different declared labels at line starts',()=>{
    const result=make('业务名称：采购申请\n对象类型：交易\n申请字段：申报金额（0-500元）、经办人\n附件：询价表\n处理流程：初审→终审')
    expect(result.template.name).toBe('采购申请')
    expect(result.template.objectType).toBe('transaction')
    expect(result.template.fields[0]).toMatchObject({kind:'number',min:0,max:500})
    expect(result.template.materialSlots[0]?.name).toBe('询价表')
    expect(result.template.stages).toHaveLength(2)
  })
  test('extracts an ordinary Chinese paragraph without colon-labelled lines',()=>{
    const result=make('我想建立一个社团活动申请模板。申请人填写活动名称、负责人、参与人数和预算；必须提交活动计划书和参与名单；参与人数不能超过40，预算不得超过5000。先由审核员初审，然后老师终审。不评分。')
    expect(result.template.objectType).toBe('organization')
    expect(result.template.fields.map(x=>x.label)).toEqual(['活动名称','负责人','参与人数','预算'])
    expect(result.template.fields.find(x=>x.key==='peopleCount')?.max).toBeUndefined()
    expect(result.template.fields.find(x=>x.key==='budget')?.max).toBeUndefined()
    const rules = result.template.sections?.[0]?.criteria.map(c=>readT01NumberLimit(c)).filter(Boolean)
    expect(rules).toEqual([
      expect.objectContaining({fieldKey:'peopleCount',operator:'lte',threshold:40}),
      expect.objectContaining({fieldKey:'budget',operator:'lte',threshold:5000}),
    ])
    expect(result.template.materialSlots.map(x=>x.name)).toEqual(['活动计划书','参与名单'])
    expect(result.template.stages.map(x=>x.kind)).toEqual(['manual-review','manual-review'])
    expect(result.template.rubric).toBeUndefined()
    expect(validateTemplate(result.template).filter(x=>x.level==='error')).toEqual([])
  })
  test('does not turn an unknown subjective requirement into an executable policy rule',()=>{
    const result=make('模板名称：艺术作品审核\n审核对象：项目\n字段：项目名称\n材料：作品说明\n规则：作品具有创新性；符合主办方要求\n流程：初审→终审')
    expect(result.template.sections?.[0]?.criteria.map(x=>x.execution)).toEqual(['manual','manual'])
    expect(result.template.policyVersionIds).toEqual([])
    expect(result.questions.join(' ')).toContain('T04')
  })
  test('freeform brief lacking policy or object type remains editable draft with questions',()=>{
    const result=make('请帮我创建一个新的活动审查模板')
    expect(result.template.status).toBe('draft')
    expect(result.template.policyVersionIds).toEqual([])
    expect(result.questions.length).toBeGreaterThan(0)
  })
  test('repeated drafting does not mutate inherited seven business seeds',()=>{
    const a=make('模板名称：实验室申请\n字段：组织名称、参加人数\n规则：人数不超过10')
    const b=make('模板名称：实验室申请\n字段：组织名称、参加人数\n规则：人数不超过30')
    expect(readT01NumberLimit(a.template.sections![0]!.criteria[0]!)?.threshold).toBe(10)
    expect(readT01NumberLimit(b.template.sections![0]!.criteria[0]!)?.threshold).toBe(30)
    expect(a.template.templateId).toBe(b.template.templateId)
  })
  test('explicit lower bound remains a draft check but cannot claim T04 execution',()=>{
    const result=make('模板名称：入选资格\n字段：成员人数\n规则：人数不少于5\n流程：初审→终审')
    const rule=result.template.sections![0]!.criteria[0]!
    expect(readT01NumberLimit(rule)).toMatchObject({operator:'gte',threshold:5})
    expect(validateT01TypedCriteria(result.template).join(' ')).toContain('负责人确认')
    expect(result.questions.join(' ')).toContain('下限规则')
  })
  test('conditional wording such as 超过20需人工审核 is not silently inverted into a prohibition',()=>{
    const result=make('模板名称：活动申请\n字段：参与人数\n规则：参与人数超过20需二次审批\n流程：初审→终审')
    expect(result.template.sections?.[0]?.criteria.some(c=>readT01NumberLimit(c))).toBe(false)
    expect(result.template.sections?.[0]?.criteria[0]?.execution).toBe('manual')
  })
  test('empty and oversized input cannot be treated as a valid draft',()=>{
    expect(()=>make('')).toThrow('T01_BRIEF_REQUIRED_OR_TOO_LONG')
    expect(()=>make('x'.repeat(10001))).toThrow('T01_BRIEF_REQUIRED_OR_TOO_LONG')
  })
})
