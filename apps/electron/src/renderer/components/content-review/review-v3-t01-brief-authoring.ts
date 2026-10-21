/**
 * T01: transparent natural-language brief -> editable TemplateVersion draft.
 *
 * This offline pass extracts only explicit fields/materials/stages/limits. It does
 * NOT invoke a model, infer binding policy authority, or generate a RuleSpec/Run.
 * Unresolved meaning is surfaced as questions for the template owner.
 */
import type { FieldSpec, MaterialSlotSpec, TemplateCriterionSpec, TemplateVersion, WorkflowStageSpec } from '@profer/shared'
import { createT01Scenario, type T01ScenarioId } from './review-v3-t01-business-presets'
import { setT01NumberLimit } from './review-v3-t01-typed-criteria'

export interface T01BriefDraft {
  template: TemplateVersion
  extracted: string[]
  questions: string[]
  supportedBy: 'explicit-local-brief' | 'authorized-model-draft'
}

const scenarios: Array<[RegExp, T01ScenarioId]> = [
  [/实验室|实验场地|实验空间/, 'laboratory'],
  [/综测|综合测评/, 'student'],
  [/奖学金|助学金/, 'scholarship'],
  [/评委|竞赛评审|项目评分/, 'judging'],
  [/报销|经费报账|票据核对/, 'expense'],
  [/协议|合同审查|条款审查/, 'agreement'],
  [/活动申请|活动审批|场地活动|社团活动|活动安排/, 'activity'],
]
const objects: Array<[RegExp, TemplateVersion['objectType']]> = [
  [/组织|社团|协会/, 'organization'], [/项目|作品|团队/, 'project'],
  [/交易|报销|费用/, 'transaction'], [/合同|协议|文件/, 'document'],
  [/学生|个人|申请人/, 'person'],
]
const fieldKeys: Array<[RegExp, string]> = [
  [/组织名称|申请组织|社团名称/, 'organization'],
  [/负责人|联系人/, 'contact'],
  [/参加人数|参与人数|申请人数|人数/, 'peopleCount'],
  [/日期|使用日期|活动时间/, 'useDate'],
  [/时段|时间段/, 'timePeriod'],
  [/用途|使用目的/, 'purpose'],
  [/预算|费用上限/, 'budget'],
  [/申请金额|报销金额|总金额|金额/, 'amount'],
  [/项目名称/, 'projectName'],
  [/活动名称/, 'activityName'],
  [/学生姓名|姓名/, 'studentName'],
  [/学号/, 'studentId'],
]
const clean = (value: string): string => value.trim().replace(/^[\s"'“”‘’]+|[\s"'“”‘’。]+$/g, '')
const unique = (s: string[]): string[] => [...new Set(s)]
const pick = (text: string, label: string): string | undefined => {
  const line = text.split(/\r?\n/).find(s => new RegExp('^\\s*(?:' + label + ')\\s*[:：]').test(s))
  return line?.replace(new RegExp('^\\s*(?:' + label + ')\\s*[:：]\\s*'), '').trim()
}
const tokens = (text: string): string[] => text
  .replace(/和(?=(?:预算|参与名单|成员名单|名单|材料|证明|附件|负责人|联系人|参加人数|参与人数|使用日期|使用时段|用途|金额|活动名称|组织名称))/g, '、')
  .split(/[、，,；;]+/).map(clean).filter(Boolean)
function sourceKey(label: string, used: Set<string>): string {
  const known = fieldKeys.find(([re]) => re.test(label))?.[1]
  const base = known ?? 'field'
  let key = base, count = 1
  while (used.has(key)) key = base + '-' + ++count
  used.add(key)
  return key
}
function numericKind(label: string): FieldSpec['kind'] {
  return /日期|年月日/.test(label) ? 'date' :
    /人数|数量|金额|预算|费用|名额|得分|排名|分数|额度/.test(label) ? 'number' :
    /是否|有无/.test(label) ? 'boolean' : 'text'
}
function explicitField(raw: string, used: Set<string>): FieldSpec {
  const label = clean(raw.replace(/（[^）]*）|\([^)]*\)/g, ''))
  const range = raw.match(/[（(]\s*(\d+(?:\.\d+)?)\s*[-~至到]\s*(\d+(?:\.\d+)?)\s*(?:人|元|份)?\s*[）)]/)
  const key = sourceKey(label, used)
  const kind = range ? 'number' : numericKind(label)
  return {
    key, label, kind, required: !/选填|可选|非必填/.test(raw),
    visibility: 'public', scope: 'case',
    ...(range ? { min: Number(range[1]), max: Number(range[2]) } : {}),
  }
}
function toSlot(raw: string, index: number): MaterialSlotSpec {
  const required = !/可选|非必交|无需/.test(raw)
  const name = clean(raw.replace(/[(（][^）)]*[）)]/g, ''))
  return {
    id: 'material-' + (index + 1), name, purpose: '由提交者上传并核对：' + name,
    requiredElements: [], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text'],
    minCount: required ? 1 : 0, maxCount: 20,
    requiredAt: 'submission', allowReuseAcrossSubjects: false,
  }
}
function stageKind(label: string): Pick<WorkflowStageSpec, 'kind' | 'executorRole'> {
  if (/自动|机器|智能/.test(label)) return { kind: 'auto-check', executorRole: 'system' }
  if (/评分|评委/.test(label)) return { kind: 'independent-rating', executorRole: 'judge' }
  if (/补件/.test(label)) return { kind: 'supplement-wait', executorRole: 'student' }
  if (/汇总/.test(label)) return { kind: 'summary', executorRole: 'organizer' }
  if (/归档|定稿/.test(label)) return { kind: 'finalize', executorRole: 'teacher' }
  if (/终审/.test(label)) return { kind: 'manual-review', executorRole: 'teacher' }
  return { kind: 'manual-review', executorRole: 'reviewer' }
}
function stagePlan(raw: string): WorkflowStageSpec[] {
  const labels = raw.split(/\s*(?:→|->|➡|=>|、|,|，|再由|然后)\s*/).map(clean).filter(Boolean)
  return labels.map((name, i) => ({
    id: 'stage-' + (i + 1), name, ...stageKind(name),
    ...(i + 1 < labels.length ? { nextStageId: 'stage-' + (i + 2) } : {}),
    ...(i > 0 ? { returnToStageId: 'stage-' + i } : {}),
    workflowOwner: 'local',
  }))
}
// 只有明确的禁止/最低门槛才生成数值规则；「人数超过20需加审」不是「人数不得超过20」。
const wordLimit = /(参加人数|参与人数|申请人数|人数|预算|申报金额|金额|名额|费用)((?:不得|不能|不可|不应|不)(?:超过|高于|大于)|(?:最多|至多|不多于)|(?:至少|不少于|不低于|不得少于|不能少于))\s*(\d+(?:\.\d+)?)/g
const labeledRequirement = /(?:规则|审核要求|检查要求|标准)\s*[:：]\s*([^\n]+)/

/** Only explicit statements become editable draft data. No fabricated policy refs. */
export function draftT01FromBrief(raw: string, templateId: string, createdAt: string): T01BriefDraft {
  const text = raw.trim()
  if (!text || text.length > 10000) throw Error('T01_BRIEF_REQUIRED_OR_TOO_LONG')
  const scenario = scenarios.find(([re]) => re.test(text))?.[1]
  const seed = scenario ? createT01Scenario(scenario, templateId, createdAt) : createT01Scenario('laboratory', templateId, createdAt)
  const title = pick(text, '模板名称|业务名称|审核名称') ??
    text.match(/(?:创建|设计|建立|起草)(?:一个|一套|一份)?(.{2,22}?)(?:的)?(?:审核|申请|核对)模板/)?.[1]
  const description = (title ? clean(title) : clean(text.slice(0, 35))) || '待命名业务'
  const explicitObject = pick(text, '审核对象|对象类型|对象')
  const objectType = explicitObject
    ? (objects.find(([re]) => re.test(explicitObject))?.[1] ?? 'custom')
    : (scenario ? seed.objectType : 'custom')
  const fieldsLine = pick(text, '字段|填写字段|申请字段|需要填写') ??
    text.match(/(?:申请人|负责人|用户|提交者)?(?:需要|应|须)?(?:填写|填报)(?:以下)?(?:字段|信息)?[：:\s]*([^。；\n]+)/)?.[1]
  const used = new Set<string>()
  const suppliedFields = fieldsLine ? tokens(fieldsLine).map(s => explicitField(s, used)) : []
  const materialsLine = pick(text, '材料|必交材料|上传材料|附件') ??
    text.match(/(?:必须|需要|应当|须)(?:提交|上传|提供)(?:以下)?(?:的)?(?:材料|附件|文件)?[：:\s]*([^。；\n]+)/)?.[1]
  const suppliedSlots = materialsLine ? tokens(materialsLine).map(toSlot) : []
  const proseStages=text.match(/(?:先由|先)([^。；\n]+?)(?:再由|然后)([^。；\n]+)/)
  const flowLine = pick(text, '流程|审核流程|处理流程') ??
    (proseStages ? proseStages[1] + '→' + proseStages[2] : undefined)
  const suppliedStages = flowLine ? stagePlan(flowLine) : []
  const extracted: string[] = [], questions: string[] = []
  if (title) extracted.push('模板名称：' + description)
  else questions.push('请确认模板名称（目前使用需求描述作为临时名称）。')
  if (explicitObject) extracted.push('审核对象：' + objectType)
  else if (!scenario) questions.push('请指定审核对象是个人、组织、项目、交易、文件还是自定义。')
  if (fieldsLine) extracted.push('字段：' + suppliedFields.map(f => f.label).join('、'))
  else if (!scenario) questions.push('请列出申请人需要填写的字段。')
  if (materialsLine) extracted.push('材料：' + suppliedSlots.map(m => m.name).join('、'))
  else if (!scenario) questions.push('请列出必交材料；不需要材料时请明确注明。')
  if (flowLine) extracted.push('流程：' + suppliedStages.map(x => x.name).join(' → '))
  else if (!scenario) questions.push('请描述自动检查、初审、终审等节点及处理角色。')

  const baseFields = suppliedFields.length ? suppliedFields : scenario ? seed.fields : [{
    key: 'applicantName', label: '申请主体', kind: 'text', required: true,
    visibility: 'public', scope: 'case',
  } satisfies FieldSpec]
  const fields = baseFields.map(f => ({ ...f }))
  const limits = [...text.matchAll(new RegExp(wordLimit.source, 'g'))]
  const numberCriteria: TemplateCriterionSpec[] = []
  const seenLimits = new Set<string>()
  for (const match of limits) {
    const phrase = match[0]!, threshold = Number(match[3])
    const label = match[1]
    const f = fields.find(x => label && (x.label.includes(label) || x.key === fieldKeys.find(([re]) => re.test(label))?.[1]))
    if (!f || !Number.isFinite(threshold)) { questions.push('数值限制「' + phrase + '」未匹配明确字段，请在编辑器确认。');continue }
    f.kind = 'number'
    // 审核门槛不能冒充输入表单的 max，否则超标案卷甚至无法填写，T04 也得不到一条 Check。
    const operator = /至少|不少于|不低于|少于/.test(match[2]!) ? 'gte' : 'lte'
    if (operator === 'lte') delete f.max
    else delete f.min
    const key = `${f.key}:${operator}:${threshold}`
    if (seenLimits.has(key)) continue
    seenLimits.add(key)
    numberCriteria.push(setT01NumberLimit({
      id: `brief-numeric-${numberCriteria.length + 1}`, title: `${f.label}${operator === 'lte' ? '上限' : '下限'}`,
      requirement: phrase, execution: 'deterministic', targetScope: 'case',
    }, {
      schemaVersion: 1, kind: 'field-number-limit', fieldKey: f.key, fieldScope: 'case',
      operator, threshold, ...(f.unit ? { unit: f.unit } : {}),
    }))
    extracted.push(`待确认的审核门槛：${f.label} ${operator === 'lte' ? '≤' : '≥'} ${threshold}（尚未发布）`)
  }
  const requirements = text.match(labeledRequirement)?.[1]
  const remainingRequirements = requirements ? tokens(requirements).filter(item =>
    !numberCriteria.some(criterion => item === criterion.requirement)) : []
  const criteria: TemplateCriterionSpec[] = [...numberCriteria, ...remainingRequirements.map((x, index) => ({
    id: 'brief-rule-' + (index + 1), title: x.slice(0, 24), requirement: x,
    execution: 'manual' as const, targetScope: 'case' as const,
  }))]
  if (criteria.length) extracted.push('草拟要求：' + criteria.length + ' 条，待确认执行类型及依据')
  if (/不评分|无需评分|无评分/.test(text)) extracted.push('评分：无评分')
  else if (/评分|量表|分数/.test(text) && !scenario) questions.push('存在评分要求，请确认评分维度、权重、缺评和最终决定规则。')
  questions.push('请确认制度/负责人要求的正式来源、适用版本及优先级；草稿不得自动成为正式政策。')
  if (numberCriteria.length) questions.push('已提取结构化数值规则；请在编辑器核对字段与阈值，并由真实负责人重新确认。下限规则需等待 T04 算子接线。')
  if (remainingRequirements.length) questions.push('其余规则文字仍是待确认的人工检查要求；确定性计算须由 T04 编译后才可进入真实 Run。')
  const sections = criteria.length ? [{
    id:'brief-review', name:'需求草拟检查', order:0, required:true, criteria,
  }] : scenario ? seed.sections : []
  const template: TemplateVersion = {
    ...seed, templateId, version:1, name:description, description:text.slice(0, 300),
    sourceNote:'根据负责人自然语言需求提取的未确认草稿；不构成正式制度或自动审核结论。',
    objectType, displayName:{template:'{{' + fields[0]!.key + '}}'},
    fields, materialSlots: suppliedSlots.length ? suppliedSlots : scenario ? seed.materialSlots : [],
    sections,
    stages: suppliedStages.length ? suppliedStages : scenario ? seed.stages : [
      {id:'stage-1',name:'人工初审',kind:'manual-review',executorRole:'reviewer',workflowOwner:'local'},
    ],
    rubric: /不评分|无需评分|无评分/.test(text) ? undefined : scenario ? seed.rubric : undefined,
    policyVersionIds:[], policyRefs:undefined, status:'draft', catalogKind:'custom', publishedAt:undefined,
    createdAt,
  }
  return {template,extracted:unique(extracted),questions:unique(questions),supportedBy:'explicit-local-brief'}
}
