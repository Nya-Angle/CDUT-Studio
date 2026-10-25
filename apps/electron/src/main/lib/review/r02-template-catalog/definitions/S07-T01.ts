import type { FieldSpec, MaterialSlotSpec, TemplateCriterionSpec, TemplateSectionSpec, TemplateVersion, WorkflowStageSpec } from '@profer/shared'

type EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
type R02Criterion = {
  sectionId: string
  criterionId: string
  title: string
  requirement: string
  execution: TemplateCriterionSpec['execution']
  srcIds: string[]
  evidenceStatus: EvidenceStatus
}

const fields: FieldSpec[] = [
  {
    "key": "studentName",
    "label": "学生姓名",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case"
  },
  {
    "key": "studentId",
    "label": "权威学籍键/学号",
    "kind": "text",
    "required": true,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "graduationCohort",
    "label": "毕业审查届次",
    "kind": "text",
    "required": true,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "degreeLevel",
    "label": "学段（本科/硕士/博士/其他）",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "campus",
    "label": "校区",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "college",
    "label": "学院/培养单位",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "major",
    "label": "专业/方向",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "admissionYear",
    "label": "入学年份",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "studentStatus",
    "label": "权威学籍状态",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "studyPlanVersion",
    "label": "适用培养方案版本",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "earnedCredits",
    "label": "已生效学分事实摘要",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "requiredCredits",
    "label": "适用方案要求摘要",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "priorDecisionRef",
    "label": "既有毕业/结业决定引用",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "exceptionOrAppeal",
    "label": "例外/异议/复核请求摘要",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  }
]
const materialSlots: MaterialSlotSpec[] = [
  {
    "id": "authoritative-student-record",
    "name": "权威学籍与身份记录",
    "purpose": "绑定同一学生、学段、校区、学院和生效状态",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "requiredElements": [
      "权威学籍键",
      "学段",
      "状态"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "current-cohort-notice",
    "name": "当届毕业资格审查通知",
    "purpose": "确认批次、截止与适用范围；无法取得全文时只作待确认",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "requiredElements": [
      "发文主体",
      "届次/适用范围",
      "版本/日期"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "approved-study-plan",
    "name": "批准培养方案与修订记录",
    "purpose": "匹配专业、学段、入学届次与正式修订版",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "requiredElements": [
      "方案名称/版本",
      "适用届次",
      "课程/培养环节"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "official-transcript",
    "name": "权威成绩与学分记录",
    "purpose": "只读引用已生效成绩，不以截图覆盖源记录",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "requiredElements": [
      "学生主键",
      "课程/学分",
      "生效版本"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "course-credit-decisions",
    "name": "免修/替代/重修/跨校学分决定",
    "purpose": "仅适用时引用有权部门已生效决定",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "requiredElements": [
      "原课/目标课",
      "决定主体",
      "生效时间"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "practice-and-capstone-records",
    "name": "实践/实习/毕业设计等记录",
    "purpose": "仅核已到形成阶段且方案确实要求的记录",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 30,
    "requiredElements": [
      "环节标识",
      "结果/日期",
      "权威来源"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "prior-official-decisions",
    "name": "既有毕业/结业及复核决定",
    "purpose": "仅在历史决定、结业或异议情形读取",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "requiredElements": [
      "决定编号",
      "主体",
      "签发/生效时间"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  }
]
const criteria: R02Criterion[] = [
  {
    "sectionId": "identity-scope",
    "criterionId": "authoritative-identity",
    "title": "权威身份与学段匹配",
    "requirement": "以校方受控学籍主键、学段和当前状态为主；姓名、OCR、学生自填仅作线索。冲突或源失联转人工，不在本模板改写学籍。",
    "execution": "semantic",
    "srcIds": [
      "SRC-001",
      "SRC-008"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "identity-scope",
    "criterionId": "cohort-campus-routing",
    "title": "届次、校区与批次适用",
    "requirement": "按当前适用的本科/研究生、校区、入学批次和毕业批次通知核范围；2026通知/附件无法核实则保持政策待确认，不沿用2025日期。",
    "execution": "manual",
    "srcIds": [
      "SRC-002",
      "SRC-003",
      "SRC-011"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "identity-scope",
    "criterionId": "study-plan-version",
    "title": "培养方案适用版本",
    "requirement": "仅使用对应专业、学段、入学年级和批准修订版的培养方案；同名专业不代表同版本。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-010",
      "SRC-015"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "academic-evidence",
    "criterionId": "official-transcript-credits",
    "title": "权威成绩与学分事实",
    "requirement": "对照权威成绩记录与已生效学分；本模板可列差异，不自行决定毕业/结业资格或写回成绩。",
    "execution": "semantic",
    "srcIds": [
      "SRC-001",
      "SRC-007"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "academic-evidence",
    "criterionId": "course-substitution",
    "title": "课程替代、免修与重修效力",
    "requirement": "课程替代、免修、跨校学分、重修只引用S02/有权部门已生效认定；上传材料不等于批准。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-007"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "academic-evidence",
    "criterionId": "practice-thesis-requirements",
    "title": "实践与毕业环节的时序",
    "requirement": "仅核已到形成阶段且适用培养方案要求的实习、实践、毕业设计/论文事实；未来材料不得当作当前缺件。",
    "execution": "semantic",
    "srcIds": [
      "SRC-001",
      "SRC-003"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "academic-evidence",
    "criterionId": "fitness-exemption",
    "title": "体测与合法免测记录",
    "requirement": "仅在适用校规/方案和当前学生身份已确认时核对体测或正式免测记录；不收健康详情，不自动否决。",
    "execution": "manual",
    "srcIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "academic-evidence",
    "criterionId": "study-duration-exceptions",
    "title": "修业年限与特殊情形",
    "requirement": "学习年限、休复学和延长修业以权威学籍决定及现行规则为准；阈值、例外不明转人工。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-010",
      "SRC-012"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "decision-boundary",
    "criterionId": "graduate-predegree-status",
    "title": "研究生培养前置事实",
    "requirement": "研究生培养环节/论文前资格只引用研究生院或培养单位已形成记录；不替代论文答辩或学位决定。",
    "execution": "manual",
    "srcIds": [
      "SRC-003",
      "SRC-010",
      "SRC-012"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "decision-boundary",
    "criterionId": "prior-official-decision",
    "title": "既有正式毕业/结业决定",
    "requirement": "核对原决定编号、主体和生效时间；没有权威来源只报来源不可用/冲突，不以事实检查代替正式决定。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-008"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "decision-boundary",
    "criterionId": "post-completion-replacement-route",
    "title": "结业后换发路由",
    "requirement": "已正式结业后补达标换发毕业证的资格审查/批准归S07-T08；本模板只提供毕业/结业与课程事实快照，不形成换发结论。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-008"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "decision-boundary",
    "criterionId": "appeal-withdrawal",
    "title": "撤回、异议与复核",
    "requirement": "仅记录请求、对象版本和证据；是否受理、期限及复核结果由有权校方人员按现行程序决定。",
    "execution": "manual",
    "srcIds": [
      "SRC-008",
      "SRC-016"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "evidence-security",
    "criterionId": "source-version-conflict",
    "title": "来源版本与冲突",
    "requirement": "保留原件、版本、来源和时间；新证据仅使相关事实检查待重审，不覆盖已签发正式决定。",
    "execution": "semantic",
    "srcIds": [
      "SRC-001",
      "SRC-008"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "evidence-security",
    "criterionId": "privacy-minimization",
    "title": "最小必要个人信息",
    "requirement": "最小化展示学号、成绩、处分/健康材料，限制访问；不输出不必要敏感详情。",
    "execution": "manual",
    "srcIds": [
      "SRC-008",
      "SRC-016"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "evidence-security",
    "criterionId": "complete-fact-summary",
    "title": "事实摘要完整性",
    "requirement": "结果仅为事实预审建议；汇总列出未评项和政策缺口，禁止从PASS_FACT生成正式毕业/结业决定。",
    "execution": "manual",
    "srcIds": [
      "SRC-002",
      "SRC-003",
      "SRC-008"
    ],
    "evidenceStatus": "PARTIAL"
  }
]
const sectionDefinitions: Array<Pick<TemplateSectionSpec, 'id' | 'name' | 'order' | 'required'>> = [
  {
    "id": "identity-scope",
    "name": "身份、批次与方案适用性",
    "order": 0,
    "required": true
  },
  {
    "id": "academic-evidence",
    "name": "学业与培养事实",
    "order": 1,
    "required": true
  },
  {
    "id": "decision-boundary",
    "name": "决定链与邻接路由",
    "order": 2,
    "required": true
  },
  {
    "id": "evidence-security",
    "name": "证据版本、隐私与汇总",
    "order": 3,
    "required": true
  }
]
const sources: Array<{ srcId: string; url: string; evidenceStatus: EvidenceStatus; note: string }> = [
  {
    "srcId": "SRC-001",
    "url": "https://dbxb.cdut.edu.cn/__local/7/B6/E5/006AC04D88A214D1AD8B1F5E540_16B4A5B7_C543C.pdf",
    "evidenceStatus": "PARTIAL",
    "note": "成理校教〔2019〕18号本科生学籍办法；当前修订/适用版需再核"
  },
  {
    "srcId": "SRC-002",
    "url": "https://aao.cdut.edu.cn/__local/1/51/2F/3AB8246C20E2DE116D38A24555F_41374FA6_6EC93.pdf",
    "evidenceStatus": "PARTIAL",
    "note": "2026单次延后资格审查通知，仅个案/批次佐证，不等于全校通用规则"
  },
  {
    "srcId": "SRC-003",
    "url": "https://gra.cdut.edu.cn/__local/9/BC/89/D76B59272CC862FACEE252AAA16_C6BD07A3_4A2BD.pdf",
    "evidenceStatus": "PARTIAL",
    "note": "2026研究生毕业答辩与学位申请安排，非完整学籍办法"
  },
  {
    "srcId": "SRC-007",
    "url": "https://aao.cdut.edu.cn/jgsz/kssz.htm",
    "evidenceStatus": "PARTIAL",
    "note": "教务处公开科室职能，不直接证明个体签批授权"
  },
  {
    "srcId": "SRC-008",
    "url": "https://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201702/t20170216_296385.html",
    "evidenceStatus": "VERIFIED",
    "note": "教育部令第41号，上位一般规定，不代替校本细则"
  },
  {
    "srcId": "SRC-010",
    "url": "https://gra.cdut.edu.cn/info/1011/5345.htm",
    "evidenceStatus": "UNCONFIRMED",
    "note": "官方通知间接引用成理校研〔2024〕29号，完整制度正文未取得"
  },
  {
    "srcId": "SRC-011",
    "url": "https://aao.cdut.edu.cn/__local/1/51/2F/3AB8246C20E2DE116D38A24555F_41374FA6_6EC93.pdf",
    "evidenceStatus": "UNCONFIRMED",
    "note": "2026届本科毕业审查通知正文未取得；仅单次延后审查文件间接引用"
  },
  {
    "srcId": "SRC-012",
    "url": "https://dbxb.cdut.edu.cn/__local/6/F5/86/E91EEDCF144F4BC5CA934E95F28_8F010406_8B8F6.pdf",
    "evidenceStatus": "PARTIAL",
    "note": "来华留学生专门规则可读，后出台规则竞合/适用仍待解释"
  },
  {
    "srcId": "SRC-014",
    "url": "https://aao.cdut.edu.cn/info/1183/2900.htm",
    "evidenceStatus": "PARTIAL",
    "note": "提前毕业表单页面只证表单存在，不证2026字段/期限"
  },
  {
    "srcId": "SRC-015",
    "url": "https://gra.cdut.edu.cn/xzzq.htm",
    "evidenceStatus": "PARTIAL",
    "note": "研究生培养计划表目录，不证内部字段或现行版"
  },
  {
    "srcId": "SRC-016",
    "url": "https://dbxb.cdut.edu.cn/__local/6/CA/AE/792887D38D428A566BA2CA803D8_0118ABB5_764DA.pdf",
    "evidenceStatus": "PARTIAL",
    "note": "留学生处分程序只作救济边界，不扩张成毕业申诉期限"
  }
]

const sections: TemplateSectionSpec[] = sectionDefinitions.map((section) => ({
  ...section,
  criteria: criteria
    .filter((item) => item.sectionId === section.id)
    .map((item) => ({
      id: item.criterionId,
      title: item.title,
      requirement: item.requirement,
      execution: item.execution,
      targetScope: 'subject',
    })),
}))

const stages: WorkflowStageSpec[] = [
  { id: 'intake', name: '材料登记与来源清点', kind: 'auto-check', executorRole: 'system', nextStageId: 'fact-review', workflowOwner: 'local' },
  { id: 'fact-review', name: '事实核对与补件建议', kind: 'manual-review', executorRole: 'reviewer', returnToStageId: 'intake', nextStageId: 'human-review', workflowOwner: 'local' },
  { id: 'human-review', name: '人工复核与待确认事项整理', kind: 'manual-review', executorRole: 'teacher', workflowOwner: 'local' },
]

export const S07_T01: TemplateVersion = {
  templateId: 'S07-T01',
  version: 1,
  schemaVersion: 2,
  status: 'draft',
  createdAt: '2026-10-24T00:00:00.000Z',
  name: "学生毕业资格、培养方案达成及结业状态核验",
  description: "本地研究模板 · 非校方正式模板。核对毕业/结业相关权威事实、培养方案版本与证据一致性；不生成毕业、结业、学位或换发的正式决定。",
  catalogKind: 'builtin',
  sourceNote: 'R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非成都理工大学校方正式模板；SRC 为研究来源索引，不是案卷材料 SourceRef。政策不确定项只产生审阅建议并进入人工复核。',
  objectType: 'person',
  displayName: { template: '{{studentName}} · S07-T01 事实核验' },
  fields,
  materialSlots,
  sections,
  policyVersionIds: [],
  stages,
  outputs: [
    { id: 'fact-review-summary', kind: 'item-feedback', audience: 'reviewer' },
    { id: 'supplement-checklist', kind: 'supplement-list', audience: 'reviewer' },
  ],
  autoPassPolicy: { enabled: false },
}

export const r02Metadata = {
  templateId: 'S07-T01',
  name: "学生毕业资格、培养方案达成及结业状态核验",
  sourceDocumentPath: 'docs/design/review-agent/business-templates/R02/S07-T01.md',
  sourceDocumentSha256: 'cf41b7dffdcc4a9464dde3017f88b82835c8d96e455bbd87aa2e6fc121c4d9fd',
  officialSchoolTemplate: false,
  researchAsOf: '2026-10-24',
  researchStatus: 'RESEARCH_HANDOFF_READY',
  policyEvidenceStatus: 'PARTIAL' as const,
  sources,
  criteria: criteria.map(({ sectionId, criterionId, srcIds, evidenceStatus }) => ({
    sectionId,
    criterionId,
    srcIds: [...srcIds],
    evidenceStatus,
  })),
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = S07_T01
