import type { TemplateVersion, TemplateCriterionSpec } from '@profer/shared'

/**
 * R02 T08-T06: local research definition only.
 * Nothing here can authorize a school decision, issue a postdoctoral certificate,
 * update the national/Sichuan postdoc systems or create a PolicyVersion.
 */
type ResearchRule = {
  id: string
  title: string
  stage: string
  execution: 'semantic' | 'manual'
  fields: readonly string[]
  materials: readonly string[]
  sources: readonly string[]
  check: string
}

const fieldDefinitions: ReadonlyArray<readonly [string, string, 'case' | 'subject']> = [
  ['F001', '本地案卷 ID 与版本', 'case'],
  ['F002', '主情形 A—J 与辅助动作', 'case'],
  ['F003', '申请人受控身份标识', 'case'],
  ['F004', '博士学位证明状态', 'case'],
  ['F005', '进站身份与特殊类别', 'case'],
  ['F006', '设站单位及流动站类型', 'case'],
  ['F007', '岗位公告批次及类别', 'case'],
  ['F008', '招收资格例外理由', 'case'],
  ['F009', '原单位同意及关系状态', 'case'],
  ['F010', '合作导师信息及资格', 'case'],
  ['F011', '联合培养双方协议', 'case'],
  ['F012', '进站合同或协议有效期', 'case'],
  ['F013', '国家博士后系统进站回执', 'case'],
  ['F014', '实际进站办理日期', 'case'],
  ['F015', '科研课题计划和版本', 'case'],
  ['F016', '开题起止日期', 'case'],
  ['F017', '开题专家意见状态', 'case'],
  ['F018', '科研进展与成果索引', 'case'],
  ['F019', '中期考核日期及批次', 'case'],
  ['F020', '中期书面考核结论', 'case'],
  ['F021', '年度考核单位和年度', 'case'],
  ['F022', '年度考核结果及归档', 'case'],
  ['F023', '在站变更申请类别', 'case'],
  ['F024', '变更前计划/导师/协议版本', 'case'],
  ['F025', '拟变更内容和期限', 'case'],
  ['F026', '设站单位变更批准记录', 'case'],
  ['F027', '省级变更备案回执', 'case'],
  ['F028', '出站申请及拟离站日期', 'case'],
  ['F029', '博士后研究报告及格式核查', 'case'],
  ['F030', '合作导师出站意见', 'case'],
  ['F031', '出站专家组书面评定', 'case'],
  ['F032', '设站单位出站决定及签发', 'case'],
  ['F033', '出站或退站受信办理回执', 'case'],
  ['F034', '退站事由及告知程序', 'case'],
  ['F035', '材料缺失/冲突/可读状态', 'case'],
  ['F036', '补件撤回复核动作历史', 'case'],
  ['F037', '证书档案与转递后置回执', 'case'],
  ['F038', '适用政策版本及审批权核验', 'case'],
]

type MaterialStage = 'submission' | 'decision'
const materialDefinitions: ReadonlyArray<readonly [string, string, string, MaterialStage]> = [
  ['M001', '本次事项申请或变更/考核表', '明确主情形和申请范围；候选材料，不是统一校方表单', 'submission'],
  ['M002', '申请人受控身份核验回执', '最小必要身份一致性；不得默认收集完整身份证件', 'decision'],
  ['M003', '博士学位及毕业证明', '学位授予状态、真实证书或进站特殊时点说明', 'decision'],
  ['M004', '年龄及特殊身份例外证明', '仅适用相关条件的进站人群；例外须人工确认', 'decision'],
  ['M005', '原单位同意或身份关系证明', '在职、定向等特殊类别须审查原单位授权', 'decision'],
  ['M006', '设站及独立招收资格证据', '核验流动站/工作站/基地与实际招收资格', 'decision'],
  ['M007', '当期招收岗位公告及附件', '不同年度批次不互相替代', 'decision'],
  ['M008', '合作导师资格及同意记录', '核导师身份、资格及本人参与意愿', 'decision'],
  ['M009', '联合培养协议及双方导师', '联招单位/导师分工、双方真实签署', 'decision'],
  ['M010', '博士后合同/协议及期限', '明确科研目标、在站时间、成果权利与职责', 'decision'],
  ['M011', '国家系统进站备案回执', '后置受信结果，不得在首次进站申请时强制要求', 'decision'],
  ['M012', '科研项目计划书与版本', '进站、开题、中期、出站的同一计划变更链', 'decision'],
  ['M013', '开题与专家书面评价', '核开始/完成时点和学术把关', 'decision'],
  ['M014', '阶段科研进展与报告摘要', '研究计划执行事实，不等于考核结论', 'decision'],
  ['M015', '科研成果目录与原始证明', '最小必要的真实性、归属和研究时间索引', 'decision'],
  ['M016', '中期考核表及专家书面结果', '不得以模型评价代替专家正式评价', 'decision'],
  ['M017', '年度考核表与单位正式结果', '年度考核与中期考核应为不同权源', 'decision'],
  ['M018', '原单位年度考核意见', '针对在职、定向等身份，按适用规定核证', 'decision'],
  ['M019', '项目/导师/身份/期限变更申请', '列出变更理由、原记录与拟生效版本', 'submission'],
  ['M020', '设站单位变更同意及权限证据', '人工核实真实签署授权；申请不能代替批准', 'decision'],
  ['M021', '省级在站变更备案回执', '仅可后置核验；不能自动提交系统', 'decision'],
  ['M022', '出站申请及任务完成清单', '核原计划与任务、申请时间', 'submission'],
  ['M023', '博士后研究报告与规范核查', '涉密全文不得默认进入一般联网模型', 'decision'],
  ['M024', '导师及专家出站书面评价', '导师意见、专家等级、设站批准须分开', 'decision'],
  ['M025', '正式出站决定与网上办结回执', '后置办理结果，不是出站申请时的必备材料', 'decision'],
  ['M026', '退站事由受限原始证据', '高敏感，仅在具备权限时最小化访问', 'decision'],
  ['M027', '退站告知与决定/系统记录', '有权设站单位形成的结果才可引用', 'decision'],
  ['M028', '补件、不可读附件及版本索引', '针对某个缺口/错误精确回指原件', 'submission'],
  ['M029', '撤回、申诉、复核申请与处理回执', '请求与获准后的效力严格分开', 'submission'],
  ['M030', '证书/档案与关系转递回执', '仅在办结后核查，不倒推资格或出站批准', 'decision'],
]

const researchRules: ResearchRule[] = [
  { id: 'R001', title: '身份与主情形路由', stage: 'intake', execution: 'semantic', fields: ['F002','F003'], materials: ['M001','M002'], sources: ['SRC-001','SRC-002'], check: '确认同一博士后、当前主阶段和申请批次；混卷或路由不明转人工。' },
  { id: 'R002', title: '学位真实性', stage: 'intake', execution: 'semantic', fields: ['F004'], materials: ['M003'], sources: ['SRC-002'], check: '核学位授予状态及特殊时间情形；扫描件本身不能证明真伪。' },
  { id: 'R003', title: '招收年龄与例外', stage: 'intake', execution: 'manual', fields: ['F005','F008'], materials: ['M003','M004'], sources: ['SRC-002'], check: '核四川 2025 办法第5—7条的适用前提；不得自动据数字拒绝。' },
  { id: 'R004', title: '设站与联合招收资格', stage: 'intake', execution: 'manual', fields: ['F006'], materials: ['M006','M009'], sources: ['SRC-001','SRC-002'], check: '核流动站/工作站/基地类型及独招/联合资格原件。' },
  { id: 'R005', title: '当期岗位条件', stage: 'intake', execution: 'manual', fields: ['F007'], materials: ['M007'], sources: ['SRC-003','SRC-011'], check: '岗位公告仅对当批有效；不能继承历史门槛。' },
  { id: 'R006', title: '特殊身份与原单位同意', stage: 'intake', execution: 'manual', fields: ['F005','F009'], materials: ['M004','M005'], sources: ['SRC-002'], check: '区分在职/定向/外籍条件与原单位同意、豁免。' },
  { id: 'R007', title: '导师资格与联合协议', stage: 'intake', execution: 'semantic', fields: ['F010','F011'], materials: ['M008','M009'], sources: ['SRC-002'], check: '核导师身份、资格、双方协议；正式聘任需授权人工。' },
  { id: 'R008', title: '进站协议与科研任务', stage: 'intake', execution: 'semantic', fields: ['F012'], materials: ['M010','M012'], sources: ['SRC-002'], check: '核合同双方、目标、在站时间与课题一致，不判断合同生效。' },
  { id: 'R009', title: '实际进站备案', stage: 'opening', execution: 'manual', fields: ['F013','F014'], materials: ['M011'], sources: ['SRC-002','SRC-008','SRC-013'], check: '须真实网上办公系统受信回执，申请日期不是进站日期。' },
  { id: 'R010', title: '开题时间', stage: 'opening', execution: 'semantic', fields: ['F014','F016'], materials: ['M011','M012','M013'], sources: ['SRC-002'], check: '结合实际进站日期审查第15条时序，冲突人工。' },
  { id: 'R011', title: '开题计划与导师意见', stage: 'opening', execution: 'semantic', fields: ['F015','F017'], materials: ['M012','M013'], sources: ['SRC-002'], check: '核可行性和研究任务材料一致性，不作学术通过判定。' },
  { id: 'R012', title: '开题专家书面把关', stage: 'opening', execution: 'manual', fields: ['F017','F038'], materials: ['M013'], sources: ['SRC-002','SRC-012'], check: '专家组真实结论及校内权限均需人工确认。' },
  { id: 'R013', title: '中期考核时点', stage: 'midterm', execution: 'semantic', fields: ['F014','F019'], materials: ['M011','M016'], sources: ['SRC-002'], check: '按实际进站日期、年度并考情形核对，保留例外。' },
  { id: 'R014', title: '中期科研计划对照', stage: 'midterm', execution: 'semantic', fields: ['F015','F018'], materials: ['M012','M014','M015','M016'], sources: ['SRC-002'], check: '成果与计划的事实对照不能直接形成考核等级。' },
  { id: 'R015', title: '中期专家书面考核', stage: 'midterm', execution: 'manual', fields: ['F020'], materials: ['M016'], sources: ['SRC-002','SRC-012'], check: '须真实专家意见与签发，模型不得生成合格/不合格决定。' },
  { id: 'R016', title: '年度考核组织者', stage: 'annual', execution: 'manual', fields: ['F005','F021'], materials: ['M017','M018'], sources: ['SRC-002'], check: '区分普通与在职/定向等由谁考核。' },
  { id: 'R017', title: '年度考核记录独立性', stage: 'annual', execution: 'semantic', fields: ['F019','F022'], materials: ['M016','M017','M018'], sources: ['SRC-002'], check: '中期与年度可结合但决定结果、权源不能冒名互换。' },
  { id: 'R018', title: '待遇调整证据边界', stage: 'annual', execution: 'manual', fields: ['F020','F022','F038'], materials: ['M016','M017'], sources: ['SRC-002'], check: '只引用真实考核结论，不直接计算薪酬或调整工资。' },
  { id: 'R019', title: '变更对象和旧版本', stage: 'change', execution: 'semantic', fields: ['F023','F024'], materials: ['M010','M012','M019'], sources: ['SRC-002'], check: '区分导师、课题、进站身份、期限及变更前后版本。' },
  { id: 'R020', title: '延期和累计在站时长', stage: 'change', execution: 'manual', fields: ['F014','F025'], materials: ['M010','M019'], sources: ['SRC-002'], check: '依据第14、25条及真实合同、适用身份判断；不自动否决。' },
  { id: 'R021', title: '设站单位真实同意', stage: 'change', execution: 'manual', fields: ['F026'], materials: ['M020'], sources: ['SRC-002','SRC-012'], check: '申请≠批准；确认真实受信签发者和权限。' },
  { id: 'R022', title: '变更省级备案', stage: 'change', execution: 'manual', fields: ['F027'], materials: ['M021'], sources: ['SRC-002','SRC-013'], check: '核变更后备案回执、办理日期，未回执为未知。' },
  { id: 'R023', title: '工作期满与任务完成', stage: 'exit', execution: 'semantic', fields: ['F015','F028'], materials: ['M012','M022'], sources: ['SRC-002'], check: '期满、任务完成是两项事实，不能反推出站获准。' },
  { id: 'R024', title: '博士后研究报告', stage: 'exit', execution: 'semantic', fields: ['F029'], materials: ['M023'], sources: ['SRC-002'], check: '检查存在性、版本和格式核查状态，学术与涉密部分人工。' },
  { id: 'R025', title: '合作导师出站同意', stage: 'exit', execution: 'semantic', fields: ['F030'], materials: ['M024'], sources: ['SRC-002'], check: '核导师对正确计划版本的意见，不代替专家/设站决定。' },
  { id: 'R026', title: '专家组出站评价', stage: 'exit', execution: 'manual', fields: ['F031'], materials: ['M024'], sources: ['SRC-002'], check: '等级以有权专家组书面记录为准，绝不由 AI 打分生成。' },
  { id: 'R027', title: '设站单位出站决定', stage: 'exit', execution: 'manual', fields: ['F032','F038'], materials: ['M024','M025'], sources: ['SRC-001','SRC-002','SRC-012'], check: '校内批准人与权限未核；本地角色不等同于有权签发。' },
  { id: 'R028', title: '网上出站办结与证书', stage: 'exit', execution: 'manual', fields: ['F033','F037'], materials: ['M025','M030'], sources: ['SRC-002','SRC-008'], check: '系统受信结果单独核，报告通过不意味着证书已生成。' },
  { id: 'R029', title: '退站事由及证据', stage: 'withdrawal', execution: 'manual', fields: ['F034'], materials: ['M026','M027'], sources: ['SRC-002'], check: '核第27条的具体条件及事实；不得自动作出退站决定。' },
  { id: 'R030', title: '不合格考核与退站分离', stage: 'withdrawal', execution: 'manual', fields: ['F020','F031','F034'], materials: ['M016','M024','M027'], sources: ['SRC-002'], check: '评价、退站决定、合同解除各为不同法律/管理事件。' },
  { id: 'R031', title: '退站告知与权限', stage: 'withdrawal', execution: 'manual', fields: ['F034','F038'], materials: ['M027'], sources: ['SRC-002','SRC-012'], check: '核本人书面告知/公告和真正有权单位签发。' },
  { id: 'R032', title: '补件与证据冲突', stage: 'appeal', execution: 'semantic', fields: ['F035'], materials: ['M028'], sources: ['SRC-012'], check: '逐项记录缺失、不可读、矛盾和过期；未知不得当 false。' },
  { id: 'R033', title: '撤回申诉与复核版本', stage: 'appeal', execution: 'manual', fields: ['F036'], materials: ['M029'], sources: ['SRC-012'], check: '请求≠获准撤回；新材料须新 Plan/Run，旧结果保留。' },
  { id: 'R034', title: '后置证书和档案回执', stage: 'archive', execution: 'manual', fields: ['F037'], materials: ['M030'], sources: ['SRC-002','SRC-010'], check: '仅核对真实归档/转递，不写入外部系统。' },
  { id: 'R035', title: '政策适用与签发授权', stage: 'governance', execution: 'manual', fields: ['F038'], materials: ['M006','M020','M024'], sources: ['SRC-005','SRC-011','SRC-012'], check: '未确认校本版本和具体权限就保持 POLICY_UNCONFIRMED。' },
  { id: 'R036', title: '敏感材料最小化与来源追溯', stage: 'governance', execution: 'manual', fields: ['F001','F035'], materials: ['M002','M026','M028'], sources: ['SRC-009','SRC-010'], check: '涉密材料不进入普通联网模型；保留真实材料版本/访问授权。' },
]

const sectionDefinitions = [
  ['intake', '进站身份、招收和岗位预审'],
  ['opening', '进站备案与开题'],
  ['midterm', '中期科研考核'],
  ['annual', '年度考核和待遇边界'],
  ['change', '在站项目、导师、身份及期限变更'],
  ['exit', '正常出站与系统办结'],
  ['withdrawal', '退站事由与程序'],
  ['appeal', '补件、撤回和异议复核'],
  ['archive', '证书、档案与后置事项'],
  ['governance', '政策签发权限与信息安全'],
] as const

const sectionIds = new Set<string>(sectionDefinitions.map(([id]) => id))
const fieldIds = new Set(fieldDefinitions.map(([id]) => id))
const materialIds = new Set(materialDefinitions.map(([id]) => id))
const sourceIds = Array.from({ length: 13 }, (_, i) => `SRC-${String(i + 1).padStart(3, '0')}`)
const sourceIdSet = new Set(sourceIds)

// Fail early on accidental mistakes when changing this owned definition.
for (const rule of researchRules) {
  if (!sectionIds.has(rule.stage) || rule.fields.some((id) => !fieldIds.has(id))
    || rule.materials.some((id) => !materialIds.has(id))
    || rule.sources.some((id) => !sourceIdSet.has(id))) {
    throw new Error(`T08-T06 references an undefined research binding: ${rule.id}`)
  }
}

const criterionOf = (rule: ResearchRule): TemplateCriterionSpec => ({
  id: rule.id,
  title: rule.title,
  requirement: `研究检查 ${rule.id}（${rule.execution}）：${rule.check} 输入字段 ${rule.fields.join('、')}；证据材料 ${rule.materials.join('、')}。未确认政策/学校权限必须人工复核；这里的 ${rule.sources.join('、')} 仅是研究来源 ID，不是 PolicyVersion 或案卷 SourceRef。`,
  execution: rule.execution,
  targetScope: 'case',
})

export const templateVersion: TemplateVersion = {
  templateId: 'T08-T06',
  version: 1,
  schemaVersion: 2,
  name: '博士后进站、在站考核和出站资格材料审核',
  description: '进站、开题、在站中期与年度考核、变更延期、退站及出站材料预核。本地研究模板 · 非校方正式模板。部分规则待确认；仅形成事实/补件/人工待办，不产生正式学校决定。',
  catalogKind: 'builtin',
  sourceNote: 'R02_RESEARCH_TEMPLATE_NONOFFICIAL: T08-T06 2026-10-24 rebuilt from primary sources; previous study file not recovered. SRC are research citations, never PolicyVersion IDs or case SourceRefs. All decisions, system receipts and school signing authority require trusted external verification.',
  objectType: 'person',
  displayName: { template: '博士后进站、在站考核和出站资格材料审核（本地研究案卷）' },
  fields: fieldDefinitions.map(([key, name, scope]) => ({
    key, label: `${name}（${key}）`, kind: 'text', required: false,
    scope, visibility: key === 'F003' || key === 'F034' ? 'internal' : 'public',
    extractionHint: `研究字段 ${key}：${name}。区分申请陈述、原始证明、导师或专家意见、校方决定、系统受信回执；缺失/不一致/不可读不能默认为符合。学校实际表单和收集权限待确认。`,
  })),
  materialSlots: materialDefinitions.map(([id, name, purpose, requiredAt]) => ({
    id, name: `${name}（${id}）`, purpose,
    acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text'],
    minCount: 0, maxCount: 30, requiredAt,
    requiredElements: ['本次人员与阶段是否匹配', '出具单位/签发日期或系统回执状态', '版本、材料可读性和事实来源'],
    allowReuseAcrossSubjects: false,
  })),
  sections: sectionDefinitions.map(([id, name], order) => ({
    id, name, order, required: true,
    description: '本地研究检查；无校本现行授权时只作事实与建议，不得自动批准、拒绝或考核定级。',
    criteria: researchRules.filter((rule) => rule.stage === id).map(criterionOf),
  })),
  policyVersionIds: [],
  policyRefs: [],
  stages: [
    { id: 'precheck', name: '材料分选和事实预审', kind: 'auto-check', executorRole: 'system', workflowOwner: 'local', nextStageId: 'research-review' },
    { id: 'research-review', name: '研究与考核材料人工核实', kind: 'manual-review', executorRole: 'reviewer', workflowOwner: 'local', nextStageId: 'authority-review' },
    { id: 'authority-review', name: '政策现行性及授权人工复核', kind: 'manual-review', executorRole: 'teacher', workflowOwner: 'local', nextStageId: 'handoff' },
    { id: 'handoff', name: '待真实有权机构决定/归档', kind: 'handoff', executorRole: 'reviewer', workflowOwner: 'local' },
  ],
  outputs: [
    { id: 'fact-findings', kind: 'item-feedback', audience: 'reviewer' },
    { id: 'precise-supplements', kind: 'supplement-list', audience: 'reviewer' },
    { id: 'human-review', kind: 'item-feedback', audience: 'teacher' },
  ],
  autoPassPolicy: { enabled: false },
  status: 'draft',
  createdAt: '2026-10-24T00:00:00.000Z',
}

export const r02Metadata = {
  templateId: templateVersion.templateId,
  name: templateVersion.name,
  sourceDocumentPath: 'docs/design/review-agent/business-templates/R02/T08-T06.md',
  researchSourcePath: null,
  sourceDocumentSha256: '516e46368d5f4d8380ba81f330264dc7062e6e674018a4961401e63e6feda222',
  sourceDocumentBytes: 36598,
  sourceIntegrityStatus: 'REBUILT_NOT_RECOVERED' as const,
  sourceIntegrityNote: 'No verified existing canonical/source Markdown or Library file. New 00–14 research document; SHA-256 represents actual reviewed current bytes, not a fabricated historical manifest.',
  officialSchoolTemplate: false as const,
  researchStatus: 'RESEARCH_REBUILD_AWAITING_SCHOOL_AUTHORITY',
  researchEvidenceStatus: 'PARTIAL' as const,
  policyEvidenceStatus: 'PARTIAL' as const,
  sourceRecordCount: sourceIds.length,
  sourceIds,
  fieldCount: templateVersion.fields.length,
  materialSlotCount: templateVersion.materialSlots.length,
  criterionCount: researchRules.length,
  criteria: researchRules.map(({ id, stage, fields, materials, sources, execution }) => ({
    sectionId: stage,
    criterionId: id,
    fields: [...fields],
    materialSlots: [...materials],
    sourceIds: [...sources],
    execution,
    evidenceStatus: sources.some((source) => ['SRC-005', 'SRC-011', 'SRC-012', 'SRC-013'].includes(source))
      ? 'UNCONFIRMED' as const : 'PARTIAL' as const,
    policyDecisionRequiresHuman: true as const,
  })),
}

export const template = templateVersion
