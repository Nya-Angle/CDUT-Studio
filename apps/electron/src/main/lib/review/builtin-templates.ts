/**
 * 审核模板目录：两份项目内置模板 + 基于已下载开源项目整理的场景范本。
 * 参考项目只提供表单结构、证据分拣、补件和评审流程启发，不移植异校分数或规则。
 */

import type { FieldSpec, MaterialSlotSpec, TemplateCriterionSpec, TemplateSectionSpec, TemplateVersion, WorkflowStageSpec } from '@profer/shared'
import { initializeTemplateCatalog } from './template-catalog'
import { publishTemplate } from './template-store'

const CREATED_AT = '2026-10-07T00:00:00.000Z'

function field(key: string, label: string, kind: FieldSpec['kind'] = 'text', extra: Partial<FieldSpec> = {}): FieldSpec {
  return { key, label, kind, required: false, visibility: 'public', ...extra }
}

function requiredCaseField(key: string, label: string): FieldSpec {
  return field(key, label, 'text', { required: true, scope: 'case' })
}

function slot(
  id: string,
  name: string,
  purpose: string,
  requiredElements: string[],
  options: Partial<MaterialSlotSpec> = {},
): MaterialSlotSpec {
  return {
    id,
    name,
    purpose,
    requiredElements,
    acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text'],
    minCount: 1,
    maxCount: 20,
    requiredAt: 'submission',
    allowReuseAcrossSubjects: false,
    ...options,
  }
}

function criterion(id: string, title: string, requirement: string, options: Partial<TemplateCriterionSpec> = {}): TemplateCriterionSpec {
  return { id, title, requirement, execution: 'semantic', targetScope: 'subject', ...options }
}

function section(
  id: string,
  name: string,
  criteria: TemplateCriterionSpec[],
  options: Partial<TemplateSectionSpec> = {},
): TemplateSectionSpec {
  return { id, name, order: 0, required: true, criteria, ...options }
}

/** 综测有时只有一份汇总申报表、事项尚未逐条登记；分项规则仍应形成整案检查。 */
function groupSection(
  id: string,
  name: string,
  criteria: TemplateCriterionSpec[],
  options: Partial<TemplateSectionSpec> = {},
): TemplateSectionSpec {
  return section(id, name, criteria.map((item) => ({ ...item, targetScope: 'group' })), options)
}

function stages(finalRole: WorkflowStageSpec['executorRole'] = 'teacher'): WorkflowStageSpec[] {
  return [
    { id: 'intake', name: '材料登记与完整性检查', kind: 'auto-check', executorRole: 'system', nextStageId: 'first-review' },
    { id: 'first-review', name: '初审与补件', kind: 'manual-review', executorRole: 'reviewer', returnToStageId: 'intake', nextStageId: 'final-review' },
    { id: 'final-review', name: '复核与定稿', kind: 'manual-review', executorRole: finalRole },
  ]
}

function base(input: Omit<TemplateVersion, 'schemaVersion' | 'version' | 'status' | 'createdAt'> & Partial<Pick<TemplateVersion, 'version'>>): TemplateVersion {
  return {
    schemaVersion: 2,
    version: input.version ?? 1,
    status: 'draft',
    createdAt: CREATED_AT,
    ...input,
  }
}

/** 项目内置：学生综测各分项属于一份案卷、同一次审核。类别仅作通用起点。 */
const comprehensiveAssessment = base({
  templateId: 'comprehensive-assessment-v2',
  // v2 was published by early installs without sections/rules. Published template
  // versions are immutable, so the complete rules must ship as a new version.
  version: 3,
  name: '学生综合测评（分项案卷）',
  description: '把学业、竞赛荣誉、学生工作、志愿实践和身心发展放入同一学年案卷；每个分项可独立配置要求和材料。',
  catalogKind: 'builtin',
  sourceNote: '分项和材料核验项为通用示例；不含成都理工大学当年计分政策或分值标准。',
  objectType: 'person',
  domainPackId: 'comprehensive-assessment',
  displayName: { template: '{{studentName}} · {{academicYear}} 综合测评' },
  fields: [
    requiredCaseField('studentName', '学生姓名'),
    requiredCaseField('studentId', '学号'),
    requiredCaseField('academicYear', '综测学年'),
    field('college', '学院', 'text', { scope: 'case' }),
    field('major', '专业', 'text', { scope: 'case' }),
    field('className', '班级', 'text', { scope: 'case' }),
    field('itemName', '申报事项', 'text'),
    field('itemDate', '发生日期', 'date'),
    field('organization', '主办/认定单位'),
    field('level', '级别/等级'),
    field('studentRole', '个人/团队角色'),
    field('declaredScore', '申报分值', 'number'),
    field('declaredHours', '申报时长/次数', 'number'),
  ],
  sections: [
    groupSection('academic', '学业与专业发展', [
      criterion('identity', '学籍与学年', '核对成绩或学业材料对应学生、专业和本次综测学年；身份或周期不一致时标记待确认。'),
      criterion('result', '成绩与申报结果', '逐项对照正式成绩材料，检查课程、成绩、学分或专业发展结果是否能支持申报内容；不自行推算校级加分政策。'),
      criterion('duplicate', '重复申报', '检查同一成绩、课程或成果是否在其他申报事项重复计入；无法判断时转人工复核。', { targetScope: 'group' }),
    ]),
    groupSection('competition-honor', '竞赛、科研与荣誉', [
      criterion('award-identity', '获奖与成果归属', '核对证书中的姓名、团队、成果名称、级别、日期和颁发单位是否与申报事项对应。'),
      criterion('award-role', '个人/团队贡献', '团队成果需核对申报人的成员身份、角色及证明范围；材料未说明个人贡献时不得推定。'),
      criterion('award-duplicate', '同一成果去重', '检查同一竞赛/成果是否重复拆分申报，或个人奖与团队奖的依据是否相同；冲突转人工核实。', { targetScope: 'group' }),
    ]),
    groupSection('student-work', '学生工作与集体服务', [
      criterion('position', '任职与任期', '核对任职证明中的组织、职务、起止时间和申报学年；未覆盖本学年的材料需提示补充。'),
      criterion('service', '履职事实', '根据工作记录或活动材料核对实际职责和参与事实；仅有任命材料时，不推断工作时长或完成质量。'),
    ]),
    groupSection('practice-volunteer', '社会实践与志愿服务', [
      criterion('practice-period', '活动时间与组织', '核对活动名称、时间、主办/服务组织及申报人身份是否一致。'),
      criterion('practice-proof', '时长与参与证明', '逐项核对签到、服务记录或主办方证明支持的时长/次数；图片难以辨认或口径不明时转人工复核。'),
    ]),
    groupSection('health-development', '身心发展与文体活动', [
      criterion('activity-participation', '参与事实', '核对活动/赛事名称、日期、参与人或成绩记录是否能证明申报事项。'),
      criterion('result-proof', '成绩与证明范围', '区分参与证明、名次证明和等级证书；材料只能支持其中一类时不得扩大结论。'),
    ]),
  ].map((item, order) => ({ ...item, order })),
  materialSlots: [
    slot('application-form', '综测申报汇总表', '申报人和事项清单；允许多个分项共用', ['姓名', '学号', '学年', '申报事项'], { sectionId: undefined, allowReuseAcrossSubjects: true, maxCount: 5 }),
    slot('academic-record', '成绩与学业材料', '学业与专业发展分项', ['学生身份', '学年', '课程或成绩'], { sectionId: 'academic', acceptedKinds: ['pdf', 'image', 'office', 'sheet'], maxCount: 10 }),
    slot('award-proof', '竞赛/科研/荣誉证明', '核对成果归属、等级和团队角色', ['成果名称', '姓名或团队', '等级/日期'], { sectionId: 'competition-honor', acceptedKinds: ['pdf', 'image', 'office'], maxCount: 50 }),
    slot('position-proof', '任职与履职记录', '学生工作和集体服务分项', ['组织', '职务', '任期或履职记录'], { sectionId: 'student-work', acceptedKinds: ['pdf', 'image', 'office', 'text'], maxCount: 20 }),
    slot('practice-proof', '实践/志愿服务证明', '核对组织、日期、时长和参与人', ['服务组织', '服务日期', '姓名或时长'], { sectionId: 'practice-volunteer', acceptedKinds: ['pdf', 'image', 'office'], maxCount: 50 }),
    slot('activity-proof', '文体活动证明', '参与记录、成绩或赛事证书', ['活动/赛事名称', '参与人或成绩'], { sectionId: 'health-development', acceptedKinds: ['pdf', 'image', 'office'], maxCount: 30 }),
  ],
  policyVersionIds: [],
  stages: stages(),
  outputs: [
    { id: 'item-feedback', kind: 'item-feedback', audience: 'student' },
    { id: 'score-sheet', kind: 'score-sheet', audience: 'teacher' },
    { id: 'roster', kind: 'roster', audience: 'organizer' },
  ],
})

/** 项目内置：奖助学金资格、材料、排序/复核闭环；不预置门槛或名额。 */
const scholarship = base({
  templateId: 'scholarship-v2',
  version: 2,
  name: '学生奖助学金申报与评审',
  description: '适用于校级/院级奖学金及助学金的资格核对、材料审查、补件、推荐和定稿。具体门槛、名额和排序以当年通知为准。',
  catalogKind: 'builtin',
  sourceNote: '流程参考本地 scholarship-system 的阶段、补件和子项通过设计；资格标准及金额不从参考项目照搬。',
  objectType: 'person',
  displayName: { template: '{{studentName}} · {{awardCycle}} {{awardName}}' },
  fields: [
    requiredCaseField('studentName', '学生姓名'), requiredCaseField('studentId', '学号'),
    requiredCaseField('awardCycle', '评审学年/批次'), field('college', '学院', 'text', { scope: 'case' }),
    field('major', '专业'), field('grade', '年级'), field('awardName', '奖助项目'),
    field('gpa', '绩点/平均成绩', 'number'), field('rank', '专业/班级排名', 'number'),
    field('familyStatus', '资助资格信息'), field('declaredCategory', '申报类别'),
  ],
  sections: [
    section('eligibility', '基本资格与申报条件', [
      criterion('notice-conditions', '逐条核对当年通知', '根据本次案卷附带的正式通知，逐条核对学籍、年级、申报类型、限制条件和截止时间；未配置或未提供的条件标记待确认。'),
      criterion('eligibility-conflict', '资格冲突与重复申报', '核对材料中披露的在读状态、已获项目和重复申报情况；没有权威信息时不作否定推断。'),
    ]),
    section('academic-record', '学业成绩与排名', [
      criterion('record-match', '成绩材料一致性', '核对正式成绩单中的学生、统计周期、课程/绩点/排名，与申报表是否对应。'),
      criterion('ranking-rule', '门槛与排序规则', '仅按本年度已确认的正式规则检查成绩门槛和排序；未提供阈值或名额时只整理数据并交人工决定。', { execution: 'manual' }),
    ]),
    section('achievements', '荣誉、竞赛与综合表现', [
      criterion('achievement-support', '成果事实与归属', '核对荣誉/成果的获得者、级别、日期、颁发方以及是否落在本次认定周期。'),
      criterion('achievement-duplicate', '成果复用与重复计入', '检查同一成果是否被重复用作不同加分项；允许复用的范围需由本单位规则确定。', { targetScope: 'group' }),
    ]),
    section('supporting-needs', '困难资助资格（按需）', [
      criterion('need-documents', '申请资格材料', '检查通知要求的资格材料是否齐全、申请人信息是否一致；不从材料中额外推断家庭状况。'),
      criterion('privacy-review', '敏感材料人工确认', '对敏感信息、认定口径和资格结论只提示证据位置并转授权人员确认，不自动形成最终资格结论。', { execution: 'manual' }),
    ], { required: false }),
    section('recommendation', '推荐意见与集体复核', [
      criterion('recommendation-completeness', '推荐和意见完整性', '核对推荐意见、评审意见、回避声明和必要签章是否存在且对应本次批次。'),
      criterion('final-list', '公示/名额定稿', '核对最终名单、名额和排序是否与经授权的决议一致；最终批准由教师/主管部门完成。', { execution: 'manual', targetScope: 'group' }),
    ]),
  ].map((item, order) => ({ ...item, order })),
  materialSlots: [
    slot('notice', '当年评审通知与细则', '评审依据；必须使用本次正式版本', ['适用对象', '资格条件', '流程/截止时间'], { acceptedKinds: ['pdf', 'office', 'text'], maxCount: 5 }),
    slot('application', '奖助项目申请表', '申报信息与承诺', ['姓名', '学号', '申报项目', '签名/承诺'], { allowReuseAcrossSubjects: true, maxCount: 5 }),
    slot('transcript', '成绩单与排名证明', '学业资格和排序依据', ['学生身份', '统计周期', '成绩/排名'], { sectionId: 'academic-record', acceptedKinds: ['pdf', 'image', 'office', 'sheet'], maxCount: 10 }),
    slot('achievements', '荣誉与成果证明', '奖项、竞赛、成果归属', ['成果名称', '获奖人/团队', '日期/等级'], { sectionId: 'achievements', acceptedKinds: ['pdf', 'image', 'office'], maxCount: 40 }),
    slot('supporting-status', '资助资格材料（按需）', '敏感资格材料，限定授权人员核验', ['通知要求的资格信息'], { sectionId: 'supporting-needs', requiredAt: 'decision', acceptedKinds: ['pdf', 'image', 'office'], maxCount: 10 }),
    slot('recommendation', '推荐/评审/回避材料', '记录推荐、评审与回避意见', ['推荐意见', '评审意见或回避声明'], { sectionId: 'recommendation', acceptedKinds: ['pdf', 'image', 'office', 'text'], requiredAt: 'decision', maxCount: 10 }),
  ],
  policyVersionIds: [], stages: stages(),
  outputs: [{ id: 'approval', kind: 'approval', audience: 'teacher' }, { id: 'item-feedback', kind: 'item-feedback', audience: 'student' }, { id: 'roster', kind: 'roster', audience: 'organizer' }],
})

export const BUILTIN_TEMPLATES_V2: TemplateVersion[] = [comprehensiveAssessment, scholarship]

/** 从本地开源参考项目抽象出的场景范本：适配后方可作为本校正式模板。 */
export const REFERENCE_TEMPLATES_V2: TemplateVersion[] = [
  base({
    templateId: 'student-award-credit-v1', name: '学生竞赛与荣誉成果认定', catalogKind: 'reference',
    description: '批量核对竞赛、科研成果、集体奖项和个人荣誉；支持一个成果拆分到多个申报事项并防重复计入。',
    sourceNote: '参考 CQES4CS v1.1 的多级指标/角色结构，以及 ComprehensivePerformanceSimplifier 的图片分选、已使用、错误项和确认分选流程；不采纳其分值。',
    objectType: 'person', displayName: { template: '{{studentName}} · {{academicYear}} 成果认定' },
    fields: [requiredCaseField('studentName', '学生姓名'), requiredCaseField('studentId', '学号'), requiredCaseField('academicYear', '认定学年'), field('college', '学院', 'text', { scope: 'case' }), field('achievementName', '成果/赛事名称'), field('achievementType', '成果类别'), field('awardLevel', '级别/奖项'), field('awardDate', '获奖日期', 'date'), field('personRole', '个人/团队角色'), field('declaredPoints', '申报分值', 'number')],
    sections: [section('individual-award', '个人竞赛与荣誉', [criterion('award-person', '个人身份与等级', '核对证书中的个人姓名、奖项名称、颁发单位、等级和日期；奖项映射以本校当年标准为准。'), criterion('award-cycle', '认定周期', '核对日期是否属于本次认定学年；跨学年或日期缺失时转人工。')]), section('team-award', '集体奖项与团队成果', [criterion('team-proof', '团队归属', '核对集体名称、成员或指导/参与角色；未列明个人成员时不得推定个人获奖。'), criterion('team-split', '分项与成员拆分', '一个材料支持多个事项时逐一绑定，检查是否为同一成果的重复申报；成员分配口径由负责人确认。', { targetScope: 'group' })]), section('research-output', '科研、创新与作品成果', [criterion('output-ownership', '成果归属与状态', '核对作者/完成人、成果名称、完成时间和证明载体；预印本、受理中或未正式完成状态应如实区分。'), criterion('output-duplicate', '成果去重', '按正式规则检查同一成果在竞赛、论文、专利或项目等类别是否重复计算；本模板不自行判定互斥关系。', { targetScope: 'group', execution: 'manual' })])].map((item, order) => ({ ...item, order })),
    materialSlots: [slot('criteria', '当年认定指标与分值表', '判断类别、级别和计分口径', ['适用学年', '指标类别', '级别/分值'], { acceptedKinds: ['pdf', 'office', 'sheet', 'text'], maxCount: 5 }), slot('certificates', '证书与成果证明', '可多图逐项分选并绑定申报事项', ['成果名称', '个人/团队', '颁发单位/日期'], { sectionId: 'individual-award', acceptedKinds: ['pdf', 'image', 'office'], maxCount: 100, allowReuseAcrossSubjects: true }), slot('team-list', '团队成员/角色证明', '核对集体奖项中的个人贡献', ['团队名称', '成员姓名/角色'], { sectionId: 'team-award', acceptedKinds: ['pdf', 'image', 'office', 'sheet'], maxCount: 20 })],
    policyVersionIds: [], stages: stages(), outputs: [{ id: 'score-sheet', kind: 'score-sheet', audience: 'teacher' }, { id: 'item-feedback', kind: 'item-feedback', audience: 'student' }],
  }),
  base({
    templateId: 'student-activity-approval-v1', version: 2, name: '学生组织活动与社会实践审核', catalogKind: 'reference',
    description: '覆盖活动立项、过程材料、经费核对和结项归档；可将活动批次与多份证据放在同一案卷。',
    sourceNote: '参考 ComprehensivePerformanceSimplifier 的材料分选/错误项/补证交互，以及 scholarship-system 的补件和分阶段复核概念。',
    objectType: 'organization', displayName: { template: '{{organizationName}} · {{activityName}}' },
    fields: [requiredCaseField('organizationName', '组织名称'), requiredCaseField('activityName', '活动名称'), field('applicantName', '负责人'), field('startDate', '开始日期', 'date'), field('endDate', '结束日期', 'date'), field('location', '地点'), field('participants', '人数', 'number'), field('budget', '申请经费', 'number', { scope: 'case', unit: '元' }), field('actualCost', '实际支出', 'number', { scope: 'case', unit: '元' })],
    sections: [section('eligibility', '申请资格与活动信息', [criterion('org-eligibility', '组织和负责人', '核对申报组织、负责人、参与范围及授权信息；适用资格以本单位通知为准。'), criterion('activity-info', '时间地点与计划', '核对活动目标、时间、地点、参与人数和方案是否一致；时间冲突或信息缺失转人工。')]), section('safety', '实施计划与风险保障', [criterion('plan-feasibility', '计划完整性', '核对议程、人员分工、场地/设备安排和预案是否覆盖所申报活动。'), criterion('safety-plan', '风险与审批', '检查材料中是否包含所需安全、场地或校外审批；不代替安全主管人员审批。', { execution: 'manual' })]), section('funding', '预算与经费', [criterion('budget-items', '预算明细', '用程序逐行核对预算数量×单价、小计和申报总额；经费额度与可列支范围仍按正式财务制度人工判断。', { execution: 'deterministic', targetScope: 'case', dataCheck: { kind: 'sheet-sum-match', materialSlotId: 'budget', sheetName: '预算明细', firstDataRow: 6, labelColumn: 'A', valueColumn: 'D', stopLabels: ['申请表申报总额', '明细合计'], applicantFieldKey: 'budget', quantityColumn: 'B', unitPriceColumn: 'C' } }), criterion('budget-limit', '额度与来源', '只按案卷附带且已确认的经费限额核验；没有正式额度时列出金额并交人工决定。', { execution: 'manual' })]), section('closeout', '活动结项与成果', [criterion('actual-vs-plan', '实际执行对照', '核对总结、签到/参与记录、照片或成果材料与批准方案中的活动、时间和参与人数是否对应。'), criterion('supplement', '缺失材料与补件', '列出未提交或无法辨认的结项材料，按活动和材料槽逐项形成补件清单。')], { required: false })].map((item, order) => ({ ...item, order })),
    materialSlots: [slot('notice', '活动申报通知', '资格、额度和截止时间依据', ['申报范围', '要求', '截止时间'], { acceptedKinds: ['pdf', 'office', 'text'], maxCount: 5 }), slot('application', '活动申请书/策划书', '活动目标、计划和负责人', ['目标', '时间地点', '负责人', '流程'], { sectionId: 'eligibility', maxCount: 10 }), slot('safety', '安全与场地审批材料', '风险、场地和外出审批', ['安全预案', '场地/审批'], { sectionId: 'safety', acceptedKinds: ['pdf', 'image', 'office'], requiredAt: 'decision', maxCount: 10 }), slot('budget', '预算表与票据', '预算申请或结项核对', ['明细', '金额', '合计'], { sectionId: 'funding', acceptedKinds: ['pdf', 'image', 'office', 'sheet'], requiredAt: 'decision', maxCount: 30 }), slot('closeout', '总结、签到与活动记录', '结项核对和参与证明', ['实际日期', '参与人/人数', '活动记录'], { sectionId: 'closeout', acceptedKinds: ['pdf', 'image', 'office', 'sheet'], requiredAt: 'decision', maxCount: 50 })],
    policyVersionIds: [], stages: stages('organizer'), outputs: [{ id: 'approval', kind: 'approval', audience: 'teacher' }, { id: 'supplements', kind: 'supplement-list', audience: 'student' }],
  }),
  base({
    templateId: 'student-project-review-v1', name: '学生科研/创新创业项目评审', catalogKind: 'reference',
    description: '适用于项目申报、校内立项或阶段评审；支持资格、方案、团队、预算和成果预期分别审查。',
    sourceNote: '评审表结构参考本地 RDA TIGER 申请表、评委表和评分工作簿；示例领域不是 CDUT 项目指南，不含固定权重。',
    objectType: 'project', displayName: { template: '{{projectName}} · {{callName}}' },
    fields: [requiredCaseField('projectName', '项目名称'), requiredCaseField('callName', '申报批次/指南'), field('leadName', '负责人'), field('teamMembers', '团队成员'), field('college', '学院', 'text', { scope: 'case' }), field('projectTrack', '项目类型'), field('duration', '项目周期'), field('requestedBudget', '申请经费', 'number'), field('abstract', '项目摘要')],
    sections: [section('eligibility', '资格、回避与申报范围', [criterion('call-fit', '指南资格与申报范围', '根据正式项目指南逐条核对申报资格、项目范围、限制条件和截止时间；无指南或版本不明时不得判为符合。'), criterion('conflict', '评审回避', '核对评审人是否披露关联关系或利益冲突；回避确认由组织者完成。', { execution: 'manual', targetScope: 'case' })]), section('value', '问题价值与目标', [criterion('problem', '问题与目标', '核对申请书是否清楚说明问题、目标对象、预期变化和相关背景证据。'), criterion('alignment', '指南契合度', '结合本批次正式指南评价项目是否回应申报主题，不补造指南外优先级。')]), section('method', '方案与可行性', [criterion('method', '方法与工作计划', '核对研究/实施方法、里程碑、时间表和预期成果之间是否相互对应。'), criterion('team', '团队能力与分工', '核对成员经验、任务分工和项目资源是否能支持方案；缺乏证据时标记未知。')]), section('budget', '预算合理性', [criterion('budget-detail', '预算构成与计算', '检查项目预算的明细、合计、周期和活动计划之间是否一致。'), criterion('cost-policy', '可列支范围', '仅按申报指南或财务制度所列口径检查；未提供正式标准时交财务/项目负责人判断。', { execution: 'manual' })]), section('decision', '专家评价与结论', [criterion('reviewer-rubric', '独立评审意见', '记录评审人对价值、方案、团队和预算的意见，保留不同意见与依据，不由模型代替评委打最终分。', { execution: 'manual' }), criterion('panel-decision', '汇总与名额决定', '按已公布的评分、名额和决策程序汇总；权重、名额或平分规则未配置时暂停自动排序。', { execution: 'manual', targetScope: 'group' })])].map((item, order) => ({ ...item, order })),
    materialSlots: [slot('call', '项目指南/申报通知', '资格与评审依据', ['申报范围', '条件', '评审标准', '时间'], { acceptedKinds: ['pdf', 'office', 'text'], maxCount: 5 }), slot('proposal', '项目申请书/方案', '目标、方法、团队、计划和成果', ['摘要', '研究/实施方案', '成员分工', '预期成果'], { sectionId: 'value', maxCount: 10 }), slot('budget', '项目预算表', '明细与合计核对', ['预算科目', '金额', '合计'], { sectionId: 'budget', acceptedKinds: ['pdf', 'image', 'office', 'sheet'], maxCount: 10 }), slot('review-forms', '评审表与回避声明', '独立评审与利益冲突留痕', ['评审意见', '评分（如有）', '回避确认'], { sectionId: 'decision', requiredAt: 'decision', maxCount: 20 })],
    policyVersionIds: [], stages: [{ id: 'intake', name: '资格与完整性核对', kind: 'auto-check', executorRole: 'system', nextStageId: 'independent-review' }, { id: 'independent-review', name: '独立评审', kind: 'independent-rating', executorRole: 'judge', requiredApprovers: 2, nextStageId: 'panel' }, { id: 'panel', name: '汇总与定稿', kind: 'summary', executorRole: 'organizer' }],
    rubric: { dimensions: [{ id: 'value', name: '价值与契合度', min: 1, max: 5, weight: 1 }, { id: 'feasibility', name: '方案与可行性', min: 1, max: 5, weight: 1 }, { id: 'team', name: '团队与预算', min: 1, max: 5, weight: 1 }], totalPrecision: 2, missingStrategy: 'block', naStrategy: 'exclude-renormalize', minEffectiveJudges: 2, tieBreaker: 'owner-decides' },
    outputs: [{ id: 'ratings', kind: 'rating-matrix', audience: 'organizer' }, { id: 'feedback', kind: 'item-feedback', audience: 'student' }],
  }),
  base({
    templateId: 'teacher-research-grant-review-v1', name: '教师科研项目/基金申请评审', catalogKind: 'reference',
    description: '组织项目资格核对、同行评议、预算复核、回避记录和评审意见汇总。',
    sourceNote: '参考本地 RDA TIGER cascade grant application/evaluation forms 和 scores workbook 的申请人信息、研究计划、评审意见与分组汇总；不是校内基金政策。',
    objectType: 'project', displayName: { template: '{{projectName}} · {{fundingCall}}' },
    fields: [requiredCaseField('projectName', '项目名称'), requiredCaseField('fundingCall', '基金/项目批次'), field('applicant', '申请人'), field('department', '单位/学院', 'text', { scope: 'case' }), field('coApplicants', '合作成员'), field('duration', '项目周期'), field('requestedAmount', '申请金额', 'number'), field('abstract', '项目摘要')],
    sections: [section('eligibility', '申报资格与利益冲突', [criterion('eligibility', '资格与申报范围', '对照本批次正式指南核对申请人资格、主题范围、合作要求和限制；适用条件未提供时转人工。'), criterion('independence', '评审独立性', '记录评审人利益冲突声明及回避情况，不能由材料模型自行确认评审关系。', { execution: 'manual', targetScope: 'case' })]), section('scientific-merit', '学术价值与项目目标', [criterion('merit', '问题价值与创新', '评价申请书论证的研究问题、重要性、相关工作和预期贡献，结论须引用申请材料或评审依据。'), criterion('fit', '项目目标契合度', '按本批次正式指南核对目标与资助主题的契合情况，不用参考项目的主题替代本项目指南。')]), section('plan', '研究设计、团队与产出', [criterion('design', '研究设计与方法', '核对研究问题、方法、数据/对象、风险和里程碑之间是否完整且相互支持。'), criterion('team-and-output', '团队能力与预期成果', '对照成员分工和既往材料核对执行能力；区分计划产出和已完成产出。')]), section('budget', '预算与资源', [criterion('budget-consistency', '预算合计与计划对应', '检查预算明细、计算、周期和项目活动计划的一致性。'), criterion('budget-eligibility', '经费合规性', '只按正式指南/财务制度检查可列支范围；自动检查只能提示疑点，不认定票据或支出合规。', { execution: 'manual' })]), section('panel', '同行评议与评审结论', [criterion('review-report', '结构化专家意见', '分别记录优势、风险、需澄清问题和建议；保留原始评审人与依据，不自动覆盖评审者意见。', { execution: 'manual' }), criterion('funding-decision', '资助排序与决策', '按经批准的评分口径、名额和决议归纳排序；未配置时只汇总意见，不自动推荐资助。', { execution: 'manual', targetScope: 'group' })])].map((item, order) => ({ ...item, order })),
    materialSlots: [slot('call', '基金指南/申报通知', '资格、主题、预算及评价依据', ['申请资格', '评审标准', '预算规则', '时间'], { acceptedKinds: ['pdf', 'office', 'text'], maxCount: 5 }), slot('proposal', '项目申请書/研究计划', '申请书正文和方法', ['摘要', '研究问题', '方法', '成果计划'], { sectionId: 'scientific-merit', maxCount: 10 }), slot('budget', '预算与资源说明', '预算明细和计算', ['科目', '单价/数量', '合计'], { sectionId: 'budget', acceptedKinds: ['pdf', 'office', 'sheet'], maxCount: 10 }), slot('review', '评审表与回避记录', '同行评议、评分和利益冲突留痕', ['评审意见', '评审人/回避信息'], { sectionId: 'panel', requiredAt: 'decision', maxCount: 30 })],
    policyVersionIds: [], stages: [{ id: 'intake', name: '秘书资格审查', kind: 'auto-check', executorRole: 'system', nextStageId: 'expert-review' }, { id: 'expert-review', name: '专家独立评审', kind: 'independent-rating', executorRole: 'judge', requiredApprovers: 2, nextStageId: 'panel' }, { id: 'panel', name: '评审会汇总', kind: 'summary', executorRole: 'organizer', nextStageId: 'decision' }, { id: 'decision', name: '主管部门定稿', kind: 'finalize', executorRole: 'teacher' }],
    rubric: { dimensions: [{ id: 'merit', name: '研究价值与契合度', min: 1, max: 5, weight: 1 }, { id: 'design', name: '研究设计与可行性', min: 1, max: 5, weight: 1 }, { id: 'team', name: '团队与成果', min: 1, max: 5, weight: 1 }, { id: 'budget', name: '预算合理性', min: 1, max: 5, weight: 1 }], totalPrecision: 2, missingStrategy: 'block', minEffectiveJudges: 2, tieBreaker: 'owner-decides' },
    outputs: [{ id: 'ratings', kind: 'rating-matrix', audience: 'organizer' }, { id: 'feedback', kind: 'item-feedback', audience: 'reviewer' }],
  }),
  base({
    templateId: 'teacher-travel-grant-review-v1', name: '教师差旅/学术交流资助申请', catalogKind: 'reference',
    description: '核对会议/交流邀请、申请资格、行程和预算，支持评审意见、补件和资助决定分开记录。',
    sourceNote: '参考本地 RDA TIGER Travel Grant application form、evaluation forms 和 score workbook 的邀请、差旅计划、评审及预算字段；不移植其资助额度。',
    objectType: 'transaction', displayName: { template: '{{applicant}} · {{eventName}} 差旅申请' },
    fields: [requiredCaseField('applicant', '申请人'), requiredCaseField('eventName', '会议/交流名称'), field('department', '单位/学院', 'text', { scope: 'case' }), field('eventDate', '活动日期', 'date'), field('destination', '目的地'), field('purpose', '参会/交流目的'), field('requestedAmount', '申请金额', 'number'), field('outputs', '计划产出')],
    sections: [section('eligibility', '资格与活动相关性', [criterion('eligibility', '申请资格', '根据本批次正式资助通知核对申请人、活动类型和截止日期；没有通知时不认定资助资格。'), criterion('event-relevance', '活动与工作关联', '核对会议/交流主题、申请人的研究/教学工作和申报目的之间的关系。')]), section('invitation', '邀请、注册与行程', [criterion('event-proof', '会议/邀请真实性材料', '核对邀请函、录用/报告安排、会议日期和申请人身份；真实性需主办方或人工确认。'), criterion('travel-plan', '行程匹配', '核对出发地、目的地、日期与活动日程是否相符，缺少行程或日期时列为补件。')]), section('budget', '差旅预算', [criterion('calculation', '预算计算', '检查交通、住宿、注册等申请分项和合计计算一致性。'), criterion('policy', '标准和可报范围', '按本单位已确认的差旅制度/资助上限核对；不对酒店、票据或报销资格作未授权结论。', { execution: 'manual' })]), section('review', '资助评议与成果承诺', [criterion('review', '资助必要性与预期产出', '记录评审人对活动相关性、资助必要性、申请材料和预期产出的意见。'), criterion('decision', '额度与最终决定', '资助金额由有权审批者按当期额度和排序确定；模板不自动审批或发放经费。', { execution: 'manual' })])].map((item, order) => ({ ...item, order })),
    materialSlots: [slot('call', '差旅资助通知', '申请范围、额度和标准依据', ['资格', '标准', '截止时间'], { acceptedKinds: ['pdf', 'office', 'text'], maxCount: 5 }), slot('invitation', '邀请函/录用证明/会议议程', '核对活动与申请人身份', ['会议名称', '日期', '申请人/报告安排'], { sectionId: 'invitation', acceptedKinds: ['pdf', 'image', 'office'], maxCount: 10 }), slot('itinerary', '行程与预算明细', '核对时间、路线和费用计算', ['日期/路线', '交通住宿', '金额合计'], { sectionId: 'budget', acceptedKinds: ['pdf', 'image', 'office', 'sheet'], maxCount: 10 }), slot('report', '评审意见与成果承诺', '决策意见和后续成果材料', ['评审意见', '成果承诺'], { sectionId: 'review', requiredAt: 'decision', maxCount: 10 })],
    policyVersionIds: [], stages: stages('organizer'), outputs: [{ id: 'approval', kind: 'approval', audience: 'teacher' }, { id: 'feedback', kind: 'item-feedback', audience: 'reviewer' }],
  }),
  base({
    templateId: 'teacher-expense-check-v1', version: 2, name: '教师科研/活动经费报销材料预审', catalogKind: 'reference',
    description: '用于报销材料形式核对、票据与预算对应、缺件清单和人工财务复核；不作发票真伪或最终报销审批。',
    sourceNote: '参照本地 scholarship-system 的补件/部分通过流程和现有费用核对模板；字段是通用形式预审，不替代学校财务制度。',
    objectType: 'transaction', displayName: { template: '{{claimant}} · {{expenseBatch}} 报销预审' },
    fields: [requiredCaseField('claimant', '报销人'), requiredCaseField('expenseBatch', '项目/报销批次'), field('department', '单位/学院', 'text', { scope: 'case' }), field('projectCode', '经费项目号'), field('totalAmount', '申报总金额', 'number', { scope: 'case', unit: '元' }), field('expensePeriod', '费用期间'), field('purpose', '费用用途')],
    sections: [section('authorization', '经费来源与审批', [criterion('funding-source', '经费项目与用途', '核对项目号、负责人、费用用途和所附预算/审批信息是否对应。'), criterion('authorization', '事前审批材料', '检查制度要求的事前审批、出差/采购/活动批复是否存在；审批效力由财务或主管人员确认。', { execution: 'manual' })]), section('invoice', '票据和附件要素', [criterion('invoice-elements', '票据字段核对', '核对票据抬头、日期、金额、购买方等可见字段与报销信息是否一致；不判断电子票据真伪。'), criterion('attachment-link', '票据与事项对应', '检查合同、订单、验收、行程或活动记录与票据项目是否相互支持；缺少依据时形成补件项。')]), section('amount', '金额与预算一致性', [criterion('arithmetic', '金额计算', '用程序核对报销工作簿明细金额与申报总额；票据真伪、税务口径与可报范围仍交财务复核。', { execution: 'deterministic', targetScope: 'case', dataCheck: { kind: 'sheet-sum-match', materialSlotId: 'claim-form', sheetName: '报销明细', firstDataRow: 6, labelColumn: 'A', valueColumn: 'E', stopLabels: ['明细合计'], applicantFieldKey: 'totalAmount' } }), criterion('duplicate-invoice-number', '重复票据编号', '检查工作簿中是否存在重复票据编号；重复项应显示对应行号供财务核对。', { execution: 'deterministic', targetScope: 'case', dataCheck: { kind: 'sheet-unique-values', materialSlotId: 'claim-form', sheetName: '报销明细', firstDataRow: 6, labelColumn: 'A', valueColumn: 'A', stopLabels: ['明细合计'] } }), criterion('policy-limits', '标准与限额', '仅按案卷附带的正式财务制度/批准预算核对限额；制度缺失、年份不明或例外情形转财务人工复核。', { execution: 'manual' })]), section('decision', '财务复核与结论', [criterion('finance-review', '会计复核', '登记财务审核意见、补件要求和审批记录；模型只提供预审提示，不代替付款决定。', { execution: 'manual' })])].map((item, order) => ({ ...item, order })),
    materialSlots: [slot('expense-rule', '财务制度/项目预算批复', '可列支范围、限额和审批要求', ['制度版本/适用期间', '标准/额度'], { acceptedKinds: ['pdf', 'office', 'text'], maxCount: 10 }), slot('claim-form', '报销单/费用明细', '申报人、事项和金额清单', ['报销人', '用途', '金额合计'], { sectionId: 'authorization', acceptedKinds: ['pdf', 'image', 'office', 'sheet'], maxCount: 10 }), slot('invoices', '票据与合同/订单', '核对票面字段和交易材料', ['金额', '日期', '抬头/交易对象'], { sectionId: 'invoice', acceptedKinds: ['pdf', 'image', 'office'], maxCount: 100 }), slot('acceptance', '验收/行程/活动记录', '证明事项已发生及与项目对应', ['事项', '日期', '验收/参与记录'], { sectionId: 'invoice', requiredAt: 'decision', acceptedKinds: ['pdf', 'image', 'office', 'sheet'], maxCount: 30 }), slot('approval', '审批记录', '主管、项目负责人和财务意见', ['审批人', '审批意见'], { sectionId: 'decision', requiredAt: 'decision', maxCount: 10 })],
    policyVersionIds: [], stages: [{ id: 'intake', name: '材料登记与算术检查', kind: 'auto-check', executorRole: 'system', nextStageId: 'manager' }, { id: 'manager', name: '项目负责人/主管复核', kind: 'manual-review', executorRole: 'reviewer', returnToStageId: 'intake', nextStageId: 'finance' }, { id: 'finance', name: '财务人工审核', kind: 'manual-review', executorRole: 'teacher' }], outputs: [{ id: 'supplements', kind: 'supplement-list', audience: 'teacher' }, { id: 'approval', kind: 'approval', audience: 'organizer' }],
  }),
  base({
    templateId: 'teacher-annual-achievement-review-v1', name: '教师年度教学科研与服务材料核验', catalogKind: 'reference',
    description: '把教学、科研、社会服务等年度事项放入同一教师年度案卷，逐项核实成果归属、周期和证明。',
    sourceNote: '采用 CQES4CS 中可配置评价维度的设计概念，并以本地教师/奖助系统参考流程抽象年度材料核验；不含职称、绩效或工作量定量标准。',
    objectType: 'person', displayName: { template: '{{teacherName}} · {{reviewYear}} 年度材料核验' },
    fields: [requiredCaseField('teacherName', '教师姓名'), requiredCaseField('reviewYear', '考核年度'), field('employeeId', '教职工号', 'text', { scope: 'case' }), field('department', '学院/部门', 'text', { scope: 'case' }), field('itemName', '成果/工作事项'), field('itemDate', '完成日期', 'date'), field('contributorRole', '个人贡献/角色'), field('claimedAmount', '申报工作量/数量', 'number')],
    sections: [section('teaching', '教学与人才培养', [criterion('teaching-period', '教学工作周期', '核对课程、指导、教学建设等材料对应教师身份及考核年度。'), criterion('teaching-proof', '工作事实与数量', '逐项核对课程/学生/项目记录支持的工作数量，课时和绩效口径由本校制度确认。')]), section('research', '科研与学术成果', [criterion('research-ownership', '成果归属与状态', '核对作者、项目角色、成果状态、日期和单位署名；申请中、已受理和已完成状态分别记录。'), criterion('research-duplicate', '成果重复计入', '检查同一成果是否在同一考核周期重复申报；计分和互斥规则由本校制度提供。', { targetScope: 'group', execution: 'manual' })]), section('service', '社会服务与公共事务', [criterion('service-record', '服务事实与时间', '核对服务对象、组织、时间、角色和证明；服务效果评价需由负责人确认。'), criterion('service-recognition', '外部认定', '检查外部委托、采纳或奖励材料能否支持申报事项，不推断材料未载明的贡献。')], { required: false }), section('summary', '年度汇总与人工确认', [criterion('year-summary', '年度汇总一致性', '核对个人申报表、部门汇总和支撑材料中的年度事项是否一一对应。'), criterion('final-standard', '定量口径与审批', '工作量、绩效、职称等结论仅按经确认的本校制度和有权部门决定；缺少正式标准时不自动计分。', { execution: 'manual', targetScope: 'case' })])].map((item, order) => ({ ...item, order })),
    materialSlots: [slot('annual-notice', '年度考核/工作量制度', '工作分类、周期与计算规则', ['适用年度', '分类', '认定口径'], { acceptedKinds: ['pdf', 'office', 'text'], maxCount: 5 }), slot('teaching-record', '教学与人才培养材料', '课程、指导或教学项目证明', ['教师身份', '课程/项目', '年度'], { sectionId: 'teaching', acceptedKinds: ['pdf', 'image', 'office', 'sheet'], maxCount: 50 }), slot('research-record', '科研项目与成果材料', '项目、论文、专利及成果证明', ['作者/角色', '成果状态', '日期/单位'], { sectionId: 'research', acceptedKinds: ['pdf', 'image', 'office', 'sheet'], maxCount: 100 }), slot('service-record', '服务与公共事务材料', '外部服务、社会工作和奖励', ['服务对象', '角色', '时间'], { sectionId: 'service', requiredAt: 'decision', maxCount: 50 }), slot('annual-form', '年度个人申报/部门汇总表', '对齐个人申报与部门数据', ['姓名/教职工号', '年度', '事项汇总'], { sectionId: 'summary', acceptedKinds: ['pdf', 'office', 'sheet'], maxCount: 10 })],
    policyVersionIds: [], stages: stages('teacher'), outputs: [{ id: 'score-sheet', kind: 'score-sheet', audience: 'teacher' }, { id: 'item-feedback', kind: 'item-feedback', audience: 'reviewer' }],
  }),
  base({
    templateId: 'document-agreement-check-v1', name: '校内文件/协议完整性核对', catalogKind: 'reference',
    description: '检查通知、合同、合作协议或报送文件是否包含要求条款、附件、签章和跨文档一致信息。',
    sourceNote: '参考 scholarship-system 的文件请求/补件状态设计和现有协议核对模板；不提供法律意见，不复制受限项目源码。',
    objectType: 'document', displayName: { template: '{{documentTitle}} · {{documentCycle}}' },
    fields: [requiredCaseField('documentTitle', '文件标题'), requiredCaseField('documentCycle', '批次/有效期'), field('owner', '经办人'), field('counterparty', '相对方'), field('documentVersion', '版本号')],
    sections: [section('requirements', '文件要求与条款清单', [criterion('required-clauses', '必备要素', '逐项对照本案确认的要求清单，记录存在、缺失或无法判断的条款；不将模板示例视为法律强制条款。'), criterion('attachments', '附件与引用', '核对正文对附件的引用、附件名称和实际材料是否对应。')]), section('consistency', '主体、日期和金额一致性', [criterion('identity', '主体与签署信息', '核对文件各处组织名称、经办人、签署主体和日期之间的一致性。'), criterion('values', '金额/期限/编号一致性', '核对跨页、附件和申请表中的金额、期限、编号等数据；发现差异时定位到来源。')]), section('execution', '签章与人工复核', [criterion('signature', '签署/审批完整性', '检查签署页、盖章或审批记录是否存在、清晰并覆盖适用主体；签章效力必须人工确认。', { execution: 'manual' }), criterion('legal-review', '敏感条款人工审查', '对法律责任、数据保护、知识产权和争议解决等事项提示给授权法务审查，模型不输出法律合规结论。', { execution: 'manual' })])].map((item, order) => ({ ...item, order })),
    materialSlots: [slot('checklist', '文件要求/审批清单', '本案核对依据', ['必备条款', '附件要求', '审批条件'], { acceptedKinds: ['pdf', 'office', 'text'], maxCount: 10 }), slot('target-document', '待核对文件及附件', '协议、通知或报送材料', ['正文', '附件', '签署页'], { sectionId: 'requirements', acceptedKinds: ['pdf', 'image', 'office', 'text'], maxCount: 50 }), slot('approval-record', '审批/法务意见', '记录主管或授权人员意见', ['审批人', '意见/签署'], { sectionId: 'execution', requiredAt: 'decision', maxCount: 10 })],
    policyVersionIds: [], stages: [{ id: 'intake', name: '文件解析与形式核对', kind: 'auto-check', executorRole: 'system', nextStageId: 'owner-review' }, { id: 'owner-review', name: '经办部门复核', kind: 'manual-review', executorRole: 'reviewer', returnToStageId: 'intake', nextStageId: 'authorized-review' }, { id: 'authorized-review', name: '授权部门/法务复核', kind: 'manual-review', executorRole: 'teacher' }], outputs: [{ id: 'feedback', kind: 'item-feedback', audience: 'reviewer' }, { id: 'supplements', kind: 'supplement-list', audience: 'organizer' }],
  }),
]

export const ALL_DEFAULT_TEMPLATES_V2: TemplateVersion[] = [...BUILTIN_TEMPLATES_V2, ...REFERENCE_TEMPLATES_V2]

/** 旧版领域映射兼容档案：保留读取和历史案卷执行能力，但从新模板库中移出。 */
const LEGACY_COMPAT_TEMPLATES_V2: TemplateVersion[] = [
  ['activity-approval-v2', '活动材料审批', 'organization'],
  ['project-judging-v2', '项目/比赛评委', 'project'],
  ['expense-check-v2', '费用材料核对', 'transaction'],
  ['document-checklist-v2', '文件/协议要求核对', 'document'],
].map(([templateId, name, objectType]) => ({
  templateId: templateId!, version: 1, schemaVersion: 2, name: name!,
  objectType: objectType as TemplateVersion['objectType'], displayName: { template: '{{title}}' },
  fields: [], materialSlots: [], policyVersionIds: [],
  stages: [{ id: 'legacy-review', name: '历史模板审核', kind: 'manual-review', executorRole: 'reviewer' }],
  outputs: [{ id: 'approval', kind: 'approval', audience: 'teacher' }],
  status: 'draft', createdAt: CREATED_AT, catalogKind: 'reference',
  description: '仅供历史案卷兼容；新建案卷请使用已整理的新版模板。',
  sourceNote: '历史兼容模板，不参与新模板库目录。',
}))

/** 幂等播种模板并初始化目录；不覆盖已有草稿或发布版本。 */
export function ensureBuiltinTemplateDrafts(store: {
  getTemplate(id: string, version?: number): TemplateVersion | undefined
  saveDraft(template: TemplateVersion): TemplateVersion
}): void {
  for (const template of [...ALL_DEFAULT_TEMPLATES_V2, ...LEGACY_COMPAT_TEMPLATES_V2]) {
    if (!store.getTemplate(template.templateId, template.version)) store.saveDraft(template)

    // This version repairs the previously published but rule-empty built-in. Its
    // checks are generic evidence checks and carry no school policy or score table.
    if (template.templateId === 'comprehensive-assessment-v2' && template.version === 3) {
      const current = store.getTemplate(template.templateId, template.version)
      if (current?.status === 'draft' && current.catalogKind === 'builtin') {
        publishTemplate(current.templateId, current.version)
      }
    }

    // Repair the originally seeded grant template without replacing user-edited content.
    // Older drafts exposed a final-decision stage but ended the chain at the panel stage.
    if (template.templateId === 'teacher-research-grant-review-v1') {
      const current = store.getTemplate(template.templateId)
      if (current?.status === 'draft' && current.catalogKind === 'reference' && current.sourceNote === template.sourceNote) {
        const expectedIds = template.stages.map((stage) => stage.id)
        const panel = current.stages.find((stage) => stage.id === 'panel')
        const hasDecision = current.stages.some((stage) => stage.id === 'decision')
        const sameStageSet = expectedIds.length === current.stages.length && expectedIds.every((id) => current.stages.some((stage) => stage.id === id))
        if (panel && !panel.nextStageId && hasDecision && sameStageSet) {
          store.saveDraft({
            ...current,
            version: current.version + 1,
            stages: current.stages.map((stage) => stage.id === 'panel' ? { ...stage, nextStageId: 'decision' } : stage),
          })
        }
      }
    }
  }
  initializeTemplateCatalog(
    ALL_DEFAULT_TEMPLATES_V2.map((template) => template.templateId),
    LEGACY_COMPAT_TEMPLATES_V2.map((template) => template.templateId),
  )
}
