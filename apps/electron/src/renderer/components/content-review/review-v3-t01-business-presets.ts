/**
 * T01: executable local TemplateVersion authoring seeds and an honest
 * form/material trial. Uses the existing V2 template store and workflow contract.
 * No school authority, Case/Run writes or fabricated review verdicts.
 */
import { setT01NumberLimit } from './review-v3-t01-typed-criteria'
import type { FieldSpec, MaterialSlotSpec, TemplateCriterionSpec, TemplateSectionSpec, TemplateVersion, WorkflowStageSpec, ConditionAST } from '@profer/shared'

export type T01ScenarioId = 'student' | 'activity' | 'scholarship' | 'judging' | 'expense' | 'agreement' | 'laboratory'
export const T01_SCENARIOS: ReadonlyArray<{ id: T01ScenarioId; label: string; description: string }> = [
  { id: 'student', label: '学生综测', description: '申报事项与证明，分数由正式制度决定' },
  { id: 'activity', label: '活动材料审批', description: '活动申请、参与名单、预算、补件' },
  { id: 'scholarship', label: '奖学金资格与推荐', description: '资格、截止时间、推荐与人工决定' },
  { id: 'judging', label: '项目/比赛评委', description: '资格核对、独立量表与评审汇总' },
  { id: 'expense', label: '费用材料核对', description: '票据、金额、标准及财务复核' },
  { id: 'agreement', label: '文件/协议要求核对', description: '条款、附件、日期与人工复核' },
  { id: 'laboratory', label: '实验室使用申请', description: '组织、人数不超过20、时间与申请计划；无评分双级审核' },
]

const field = (key: string, label: string, kind: FieldSpec['kind'] = 'text', extra: Partial<FieldSpec> = {}): FieldSpec =>
  ({ key, label, kind, required: true, scope: 'case', visibility: 'public', ...extra })
const slot = (id: string, name: string, requiredElements: string[], extra: Partial<MaterialSlotSpec> = {}): MaterialSlotSpec =>
  ({ id, name, purpose: name, requiredElements, acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 1, maxCount: 10,
    allowReuseAcrossSubjects: false, requiredAt: 'submission', ...extra })
const criterion = (id: string, title: string, requirement: string, execution: TemplateCriterionSpec['execution'] = 'semantic'): TemplateCriterionSpec =>
  ({ id, title, requirement, execution, targetScope: 'case' })
const section = (id: string, name: string, checks: TemplateCriterionSpec[], order = 0): TemplateSectionSpec =>
  ({ id, name, order, required: true, criteria: checks })
const stage = (id: string, name: string, kind: WorkflowStageSpec['kind'], role: WorkflowStageSpec['executorRole'],
  nextStageId?: string, returnToStageId?: string): WorkflowStageSpec =>
  ({ id, name, kind, executorRole: role, ...(nextStageId ? { nextStageId } : {}), ...(returnToStageId ? { returnToStageId } : {}) })
const shared = {
  catalogKind: 'custom' as const,
  policyVersionIds: [],
  status: 'draft' as const,
  schemaVersion: 2 as const,
  sourceNote: '模拟配置示例；各项要求须由模板负责人依据真实制度确认，不能直接视为学校正式政策。',
}
function twoReview(): WorkflowStageSpec[] {
  return [stage('intake','形式自检','auto-check','system','first-review'),
    stage('first-review','初审','manual-review','reviewer','final-review','intake'),
    stage('final-review','终审','manual-review','teacher',undefined,'first-review')]
}
function stagesWithRating(): WorkflowStageSpec[] {
  return [stage('intake','材料资格检查','auto-check','system','rating'),
    stage('rating','评委独立评分','independent-rating','judge','summary'),
    stage('summary','评审汇总','summary','organizer','final'),
    stage('final','结果定稿','finalize','teacher')]
}
export function createT01Scenario(id: T01ScenarioId, templateId: string, createdAt: string): TemplateVersion {
  const sample = T01_SCENARIOS.find(item => item.id === id)
  if (!sample) throw new Error('T01_SCENARIO_UNKNOWN')
  const base: TemplateVersion = {
    ...shared, templateId, version: 1, createdAt, name: sample.label + '（模拟草稿）',
    description: sample.description, objectType: 'custom', displayName: { template: '{{title}}' },
    fields: [], materialSlots: [], sections: [], stages: twoReview(),
    outputs: [{ id:'feedback',kind:'item-feedback',audience:'reviewer' },{ id:'supplements',kind:'supplement-list',audience:'student' }],
  }
  switch (id) {
    case 'laboratory': return {
      ...base, name:'实验室使用申请（无评分示例）', objectType:'organization',
      description:'组织提出实验室借用申请；人数≤20；申请计划必交；初审、终审均由本地具名人员处理。',
      displayName:{ template:'{{organization}} · 实验室申请' },
      fields:[field('organization','申请组织'),field('contact','负责人'),field('peopleCount','参加人数','number',{min:1,unit:'人'}),
        field('useDate','使用日期','date'),field('timePeriod','使用时段'),field('purpose','用途说明')],
      materialSlots:[slot('plan','申请计划附件',['组织','人员','时间','用途'])],
      sections:[section('eligibility','借用条件',[
        setT01NumberLimit(criterion('count','人数上限','申请参加人数不得超过20；人数缺失时必须补充证明。','deterministic'), {
          schemaVersion: 1, kind: 'field-number-limit', fieldKey: 'peopleCount',
          fieldScope: 'case', operator: 'lte', threshold: 20, unit: '人',
        }),
        criterion('time','日期与时段','核对日期、时段及申请计划是否一致；场地可用性由管理人员确认。'),
        criterion('plan','申请计划','须提交包括使用目的、参加人员与安全安排的计划附件。')])],
      outputs:[{id:'approval',kind:'approval',audience:'teacher'},{id:'supplements',kind:'supplement-list',audience:'student'}],
    }
    case 'student': return {
      ...base, objectType:'person', displayName:{template:'{{studentName}} · 综测'},
      fields:[field('studentName','学生姓名'),field('studentId','学号'),field('academicYear','综测学年'),
        field('declaredScore','申报分数','number',{required:false,scope:'subject'})],
      materialSlots:[slot('form','申报汇总',['姓名','学号','事项']),slot('proof','事项证明',['时间','证明内容'])],
      sections:[section('eligibility','申报事实与周期',[
        criterion('year','适用学年','检查证明时间是否属于正式选定学年。'),
        criterion('evidence','证明归属','核对申报人与证明中的身份一致性。')])],
      outputs:[{id:'score',kind:'score-sheet',audience:'teacher'},{id:'feedback',kind:'item-feedback',audience:'student'}],
    }
    case 'activity': return {
      ...base, objectType:'organization', displayName:{template:'{{organization}} · {{activityName}}'},
      fields:[field('organization','主办组织'),field('activityName','活动名称'),field('leader','负责人'),
        field('activityDate','活动日期','date'),field('participants','参与人数','number',{min:1}),
        field('budget','申报预算','number',{min:0,unit:'元'})],
      materialSlots:[slot('request','活动申请',['组织','时间','地点']),slot('roster','参与名单',['人员'])],
      sections:[section('conditions','活动申请审核',[
        setT01NumberLimit(criterion('headcount','参与人数上限','虚构活动示例要求参与人数不得超过40；发布前需负责人核实。','deterministic'), {
          schemaVersion:1,kind:'field-number-limit',fieldKey:'participants',fieldScope:'case',operator:'lte',threshold:40,
        }),
        setT01NumberLimit(criterion('budget-limit','预算上限','虚构活动示例要求申报预算不得超过5000元；发布前需负责人核实。','deterministic'), {
          schemaVersion:1,kind:'field-number-limit',fieldKey:'budget',fieldScope:'case',operator:'lte',threshold:5000,unit:'元',
        }),
        criterion('scope','资格与资源','核对组织资格、场地时间冲突、预算和申报期限；缺少正式约束时人工确认。'),
        criterion('roster','参与人员','核对申请与参与名单人数及负责人。')])],
    }
    case 'scholarship': return {
      ...base,objectType:'person',displayName:{template:'{{studentName}} · 奖学金'},
      fields:[field('studentName','申请人'),field('studentId','学号'),field('grade','成绩或排名','number',{min:0}),
        field('category','申请类别'),field('deadline','申报日期','date')],
      materialSlots:[slot('form','奖学金申请',['申请类别','身份']),slot('transcript','成绩或排名证明',['成绩','排名'])],
      sections:[section('eligibility','资格与推荐',[
        setT01NumberLimit(criterion('minimum-grade','示例成绩门槛','虚构奖学金示例要求成绩不得低于80；需负责人核实且等待 T04 下限算子。','deterministic'), {
          schemaVersion:1,kind:'field-number-limit',fieldKey:'grade',fieldScope:'case',operator:'gte',threshold:80,
        }),
        criterion('threshold','申请资格','根据本批次确认的资格门槛和截止时间逐条核对。'),
        criterion('duplicate','重复申请与名额','对照本批次名额和申请记录；超额时交负责人决定。')])],
      outputs:[{id:'roster',kind:'roster',audience:'organizer'},{id:'feedback',kind:'item-feedback',audience:'student'}],
    }
    case 'judging': return {
      ...base,objectType:'project',displayName:{template:'{{projectName}}'},
      fields:[field('projectName','项目名称'),field('team','申报团队'),field('category','项目类型')],
      materialSlots:[slot('proposal','项目申请书',['项目目标','计划','成果']),slot('proof','项目支撑附件',['相关证明'])],
      sections:[section('eligibility','参评资格',[
        criterion('format','申请材料齐备','核对申请类别、截止时间和材料清单。'),
        criterion('conflict','评委回避','利益冲突由具名评委声明，未核查前不得汇总定稿。','manual')])],
      stages:stagesWithRating(),
      rubric:{dimensions:[{id:'innovation',name:'创新性',min:1,max:5,weight:1},
        {id:'feasibility',name:'可行性',min:1,max:5,weight:1}],
        totalPrecision:2,missingStrategy:'block',minEffectiveJudges:2,tieBreaker:'owner-decides'},
      outputs:[{id:'rating',kind:'rating-matrix',audience:'organizer'},{id:'feedback',kind:'item-feedback',audience:'student'}],
    }
    case 'expense': return {
      ...base,objectType:'transaction',displayName:{template:'{{claimant}} · 报销核对'},
      fields:[field('claimant','报销人'),field('projectCode','经费项目'),field('amount','申报金额','number',{min:0,unit:'元'}),
        field('expenseDate','费用发生日期','date')],
      materialSlots:[slot('invoice','票据',['抬头','日期','金额']),slot('request','报销申请单',['总金额','事项'])],
      sections:[section('verification','材料与金额核对',[
        setT01NumberLimit(criterion('amount-limit','单笔金额上限','虚构报销示例要求单笔金额不得超过1000元；需负责人确认。','deterministic'), {
          schemaVersion:1,kind:'field-number-limit',fieldKey:'amount',fieldScope:'case',operator:'lte',threshold:1000,unit:'元',
        }),
        criterion('invoice','票据可见信息','核对可见抬头、金额及日期，不代表外部发票真伪验真。'),
        criterion('limit','经费额度与标准','仅按本案确认的制度和预算核对可报限额，缺少依据时待人工确认。')])],
    }
    case 'agreement': return {
      ...base,objectType:'document',displayName:{template:'{{documentName}} · 文件核对'},
      fields:[field('documentName','文件标题'),field('owner','经办部门'),field('version','文件版本')],
      materialSlots:[slot('document','待检查文件',['主体','条款','附件']),slot('requirements','要求清单',['必须条款'])],
      sections:[section('clauses','条款与附件',[
        criterion('required','必要条款','按本案提供的要求清单核对条款是否存在，缺少依据时不得推定不合规。'),
        criterion('cross','跨文档一致性','核对当事方、金额、日期与附件引用的一致性。'),
        criterion('signature','签署要素','检查签字盖章是否可见；效力交有权人员审定。','manual')])],
    }
  }
}

export type T01TrialValue = string | number | boolean | null | undefined
export type T01TrialResult = {
  status: 'incomplete' | 'ready-for-human-review'
  issues: string[]
  coveredFields: number
  totalRequiredFields: number
  stages: string[]
  checksForReview: number
  note: string
}
function conditionValue(cond: ConditionAST | undefined, values: Record<string, T01TrialValue>): boolean | undefined {
  if (!cond) return true
  if ('all' in cond) { const r = cond.all.map(c=>conditionValue(c,values));return r.includes(false)?false:r.includes(undefined)?undefined:true }
  if ('any' in cond) { const r = cond.any.map(c=>conditionValue(c,values));return r.includes(true)?true:r.includes(undefined)?undefined:false }
  if ('not' in cond) { const r=conditionValue(cond.not,values);return r===undefined?undefined:!r }
  if ('fact' in cond) return undefined
  const current=values[cond.field]
  if (current===null || current===undefined || current==='') return undefined
  const expected=cond.value
  switch (cond.op) {
    case 'exists': return true
    case 'eq': return current===expected
    case 'neq': return current!==expected
    case 'gt': return typeof current==='number'&&typeof expected==='number' ? current>expected:undefined
    case 'gte': return typeof current==='number'&&typeof expected==='number' ? current>=expected:undefined
    case 'lt': return typeof current==='number'&&typeof expected==='number' ? current<expected:undefined
    case 'lte': return typeof current==='number'&&typeof expected==='number' ? current<=expected:undefined
    case 'in': return Array.isArray(expected)?expected.includes(current):undefined
  }
}
/** Create clearly simulated form values; no original document bytes are generated. */
export function exampleT01TrialInput(template:TemplateVersion):{
  values:Record<string,T01TrialValue>; materialCounts:Record<string,number>
} {
  const values:Record<string,T01TrialValue>={}
  const examples:Record<string,string>={
    organization:'示例学生组织',contact:'示例申请人',timePeriod:'14:00–16:00',purpose:'实验室安全培训',
    studentName:'示例学生',studentId:'S0001',academicYear:'2026',activityName:'示例活动',
    leader:'示例负责人',category:'示例类别',claimant:'示例报销人',projectCode:'DEMO',
    projectName:'示例项目',team:'示例团队',documentName:'示例文件',owner:'示例经办人',
    version:'v1',useDate:'2026-11-01',activityDate:'2026-11-01',expenseDate:'2026-11-01',
    deadline:'2026-11-01',
  }
  for(const field of template.fields.filter(f=>f.scope==='case')) {
    switch(field.kind) {
      case 'number':
        values[field.key]=Math.max(field.min??0,Math.min(field.max??10,10));break
      case 'date': values[field.key]='2026-11-01';break
      case 'boolean': values[field.key]=true;break
      case 'enum': values[field.key]=field.options?.[0]?.value;break
      case 'text': values[field.key]=examples[field.key]??'模拟信息';break
      default: values[field.key]=undefined
    }
  }
  return {values,materialCounts:Object.fromEntries(template.materialSlots.map(m=>[m.id,m.minCount]))}
}
/**
 * Dry-run author configuration only. Does not execute rules, parse files or
 * approve the application. Unknown conditions stay as pending.
 */
export function trialT01Template(
  template: TemplateVersion, values: Readonly<Record<string,T01TrialValue>>,
  materialCounts: Readonly<Record<string,number>>,
): T01TrialResult {
  const issues:string[]=[]
  let totalRequiredFields=0,coveredFields=0
  for (const f of template.fields.filter(field=>field.scope==='case')) {
    const cond=conditionValue(f.conditionRequired,values)
    const required=f.required || (f.conditionRequired!==undefined && cond===true)
    if (cond===undefined) issues.push(`字段「${f.label}」的必填条件待确认`)
    if (required) totalRequiredFields++
    const v=values[f.key]
    if (v===undefined || v===null || v==='') { if(required)issues.push(`缺少必填字段：${f.label}`);continue }
    if(required) coveredFields++
    if (f.kind==='number' && (typeof v!=='number'||!Number.isFinite(v)||
      (f.min!==undefined&&v<f.min)||(f.max!==undefined&&v>f.max))) issues.push(`字段「${f.label}」超出有效数值范围`)
    if (f.kind==='enum'&&!f.options?.some(opt=>opt.value===v)) issues.push(`字段「${f.label}」不属于有效选项`)
    if (f.kind==='date'&&(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))) issues.push(`字段「${f.label}」不是有效日期格式`)
    if (f.kind==='boolean'&&typeof v!=='boolean')issues.push(`字段「${f.label}」不是是/否值`)
  }
  for (const m of template.materialSlots) {
    const n=materialCounts[m.id]??0, cond=conditionValue(m.requiredWhen,values)
    if (cond===undefined) {issues.push(`材料「${m.name}」的适用条件待确认`);continue}
    if(cond===false)continue
    if(!Number.isInteger(n)||n<0||n>m.maxCount)issues.push(`材料「${m.name}」数量不合法或超过上限`)
    if(n<m.minCount)issues.push(`材料不足：${m.name}（至少${m.minCount}份）`)
  }
  const checkCount=(template.sections??[]).reduce((n,s)=>n+s.criteria.length,0)
  return { status:issues.length?'incomplete':'ready-for-human-review',issues,coveredFields,totalRequiredFields,
    stages:template.stages.map(s=>s.name),checksForReview:checkCount,
    note:'这只是字段、材料与流程的配置试跑；未执行制度规则、材料解析、评委评分或任何审批。' }
}
