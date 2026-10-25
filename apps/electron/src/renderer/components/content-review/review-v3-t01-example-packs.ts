/**
 * T01: six fictional, real-byte UTF-8 acceptance material packs.
 * These are files to upload to a genuine Case/Run, not fabricated Run results.
 */
import type { TemplateVersion } from '@profer/shared'
import { createT01Scenario, trialT01Template, exampleT01TrialInput, type T01ScenarioId, type T01TrialValue } from './review-v3-t01-business-presets'
import { exportT01Template } from './review-v3-t01-template-portability'

export type T01StandardScenario = Exclude<T01ScenarioId, 'laboratory'>
export type T01SampleCase = {
  id: 'conforming' | 'violating' | 'missing'
  fields: Record<string,T01TrialValue>
  documents: Array<{slotId:string;filename:string;content:string}>
  expected: {
    form: 'ready-for-human-review' | 'incomplete'
    policy: 'eligible-for-review' | 'rule-violation-to-review' | 'missing-evidence'
    explanation:string
  }
}
export type T01ExamplePack = {
  id:T01StandardScenario
  template:TemplateVersion
  policyText:string
  cases:T01SampleCase[]
  disclaimer:string
}
const requirements:Record<T01StandardScenario,{policy:string[];good:Record<string,T01TrialValue>;bad:Record<string,T01TrialValue>;reason:string;proof:string;badProof?:string}>={
  student:{
    policy:['本示例只接受 2026 学年的综合测评申报。','汇总表与身份/事项证明均为必交。','申报分值需由制度版本和审核人最终核定，不在样例中硬编码。'],
    good:{studentName:'模拟学生甲',studentId:'T0001',academicYear:'2026'},
    bad:{academicYear:'2025'},reason:'申报年度不符合虚构样例的 2026 年要求。',
    proof:'证明姓名：模拟学生甲\n证明学年：2026\n活动等级：待人工核验',
  },
  activity:{
    policy:['本示例活动不得超过 40 人，预算不得超过 5000 元。','须提交活动申请单、参与名单；时间与场地由审核员确认。'],
    good:{organization:'模拟学生协会',activityName:'模拟科普活动',leader:'负责人甲',participants:25,budget:2000},
    bad:{participants:52,budget:6000},reason:'人数超过 40、预算超过 5000 的虚构门槛。',
    proof:'参与人数：25\n地点：模拟 A101\n负责人：负责人甲',
    badProof:'参与人数：52\n地点：模拟 A101\n负责人：负责人甲',
  },
  scholarship:{
    policy:['虚构奖学金成绩门槛为 80，提交成绩证明与申请表。','名额、截止时间与重复申请须人工确认。'],
    good:{studentName:'模拟学生乙',studentId:'T1002',grade:86,category:'模拟奖项',deadline:'2026-11-01'},
    bad:{grade:65},reason:'成绩 65 未达到虚构示例门槛 80。',
    proof:'申请人：模拟学生乙\n成绩：86\n模拟排名：10',
    badProof:'申请人：模拟学生乙\n成绩：65\n模拟排名：35',
  },
  judging:{
    policy:['提交项目书和成果证明。','至少两名无回避冲突的评委独立评分才能汇总。','缺评与同分需要实际业务流程处理。'],
    good:{projectName:'模拟环保材料项目',team:'模拟研发团队',category:'创新项目'},
    bad:{category:'未确认类型'},reason:'申报类别与项目支撑材料不一致，需有权人员确认。',
    proof:'项目目标：材料研发\n项目计划：三阶段测试\n成果：实验演示',
    badProof:'成果证明：模拟演示\n申报类别：其他（与原申请不一致）',
  },
  expense:{
    policy:['本示例单笔报销上限 1000 元。','原始票据和报销单必交，金额日期应一致。','不提供票据外部真伪核验。'],
    good:{claimant:'模拟申请人',projectCode:'DEMO-01',amount:450,expenseDate:'2026-11-01'},
    bad:{amount:1600},reason:'金额 1600 元超过虚构示例的 1000 元上限。',
    proof:'票据金额：450 元\n票据日期：2026-11-01\n票据抬头：模拟工作组',
    badProof:'票据金额：1600 元\n票据日期：2026-11-01\n票据抬头：模拟工作组',
  },
  agreement:{
    policy:['协议必须包含双方主体、有效期、保密条款。','要求清单应明确必备内容和附件。','外观签章与法律有效性须分开检查。'],
    good:{documentName:'模拟研发合作协议',owner:'模拟部门',version:'v1'},
    bad:{documentName:'缺保密条款的模拟协议',version:'v2'},reason:'缺少保密条款，按虚构制度待修改。',
    proof:'条款一：双方主体\n条款二：有效期限\n条款三：保密义务',
    badProof:'条款一：双方主体\n条款二：有效期限',
  },
}
const serialize=(data:Record<string,T01TrialValue>):string=>Object.entries(data).map(([k,v])=>'- '+k+': '+String(v??'未填')).join('\n')
/** Real text bytes in each uploadable document; deliberate fixture names. */
export function createT01ExamplePack(id:T01StandardScenario):T01ExamplePack {
  const config=requirements[id]
  const template=createT01Scenario(id,'t01-example-'+id,'2026-10-21T00:00:00.000Z')
  const base=exampleT01TrialInput(template).values
  const good={...base,...config.good}
  const bad={...good,...config.bad}
  const [first,second]=template.materialSlots
  if(!first||!second)throw Error('T01_EXAMPLE_TWO_REQUIRED_SLOTS')
  const documents=(values:Record<string,T01TrialValue>,key:string,violating:boolean)=>{
    const application='# 模拟'+id+'申请\n\n'+serialize(values)+'\n\n该文件是模拟原件，并非审核结论。\n'
    const evidence='# 模拟证明材料\n\n'+(violating?(config.badProof??config.proof):config.proof)+'\n\n真实签章/票据未核验。\n'
    return [
      {slotId:first.id,filename:key+'-application.md',content:application},
      {slotId:second.id,filename:key+'-evidence.md',content:evidence},
    ]
  }
  const cases:T01SampleCase[]=[
    {id:'conforming',fields:good,documents:documents(good,'conforming',false),
      expected:{form:'ready-for-human-review',policy:'eligible-for-review',explanation:'形式材料齐全，仍须真实规则与人工复核。'}},
    {id:'violating',fields:bad,documents:documents(bad,'violating',true),
      expected:{form:'ready-for-human-review',policy:'rule-violation-to-review',explanation:config.reason}},
    {id:'missing',fields:good,documents:documents(good,'missing',false).slice(0,1),
      expected:{form:'incomplete',policy:'missing-evidence',explanation:'缺少材料槽：'+second.name}},
  ]
  return {id,template,policyText:'# '+template.name+'：虚构样例政策\n\n'+
    '仅供审核软件测试，不代表任何组织或学校正式要求。\n\n'+
    config.policy.map((x,i)=>String(i+1)+'. '+x).join('\n')+'\n',
    cases,disclaimer:'虚构示例：所有制度、身份及原件均为模拟。不得将预期结果作为实际审核、评分或批准；须由 T02/T04/T05/T07 的真实 Case/Run 流程核验。'}
}
export function checkT01ExampleForm(pack:T01ExamplePack,sample:T01SampleCase):ReturnType<typeof trialT01Template>{
  const counts=Object.fromEntries(pack.template.materialSlots.map(slot=>[
    slot.id,sample.documents.filter(doc=>doc.slotId===slot.id).length,
  ]))
  return trialT01Template(pack.template,sample.fields,counts)
}
export const T01_STANDARD_EXAMPLES:readonly T01StandardScenario[]=['student','activity','scholarship','judging','expense','agreement']
/** Returns files for ZIP export. The case files are individually importable text originals. */
export function exampleT01PackFiles(id:T01StandardScenario):Array<{path:string;content:string}> {
  const p=createT01ExamplePack(id)
  const files=[
    {path:'README.md',content:'# '+p.template.name+'\n\n'+p.disclaimer+
      '\n\n1. 导入 template-draft.json 并确认政策后发布。2. 每个 cases 子目录代表一个独立案卷；按槽 ID 登记文本原件。3. 从真正的 Electron 审核链对照 expectations.json；此文件没有冒充 Run。\n'},
    {path:'template-draft.json',content:exportT01Template(p.template)},
    {path:'SIMULATED-POLICY.md',content:p.policyText},
    {path:'expectations.json',content:JSON.stringify(p.cases.map(c=>({
      id:c.id,fields:c.fields,expected:c.expected,
      documents:c.documents.map(d=>({slotId:d.slotId,path:'cases/'+c.id+'/'+d.filename})),
    })),null,2)},
  ]
  for(const c of p.cases)for(const d of c.documents)files.push({path:'cases/'+c.id+'/'+d.filename,content:d.content})
  return files
}
