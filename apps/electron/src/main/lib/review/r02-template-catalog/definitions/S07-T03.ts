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
    "label": "离校批次/届次",
    "kind": "text",
    "required": true,
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
    "key": "taskId",
    "label": "权威任务标识",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "taskName",
    "label": "任务名称",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "ownerDepartment",
    "label": "责任部门/业务Owner",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "rawTaskStatus",
    "label": "部门原始状态",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "sourceVersion",
    "label": "源记录版本/同步时间",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "exceptionOrAppeal",
    "label": "豁免/补件/异议/更正请求",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  }
]
const materialSlots: MaterialSlotSpec[] = [
  {
    "id": "current-exit-task-list",
    "name": "当届个人离校任务清单",
    "purpose": "须来自当前批次权威系统/清单；不从历史部门名单补造任务",
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
      "批次",
      "任务及责任部门"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "authoritative-identity-record",
    "name": "权威学籍与身份记录",
    "purpose": "确认同一学生、学段、校区和届次",
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
      "学籍键",
      "学段/校区",
      "状态"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "department-status-records",
    "name": "各责任部门原始状态记录",
    "purpose": "每项任务分别保留原始状态、时间和版本",
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
      "任务标识",
      "原始状态",
      "来源/版本"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "housing-checkout-records",
    "name": "住宿/退宿记录",
    "purpose": "仅当前任务清单确认适用时核验",
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
      "床位/适用性",
      "交验结果",
      "有权经办"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "library-finance-records",
    "name": "图书馆/财务部门状态",
    "purpose": "借阅、赔偿、财务对账分别核验，不互相代替",
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
      "部门原始记录",
      "账务/借阅对象",
      "核验时点"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "exception-and-reconciliation-records",
    "name": "补件/更正/复核/汇总记录",
    "purpose": "仅在异常或后续阶段形成时读取",
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
      "原事项",
      "受理主体",
      "新旧版本"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  }
]
const criteria: R02Criterion[] = [
  {
    "sectionId": "identity-batch",
    "criterionId": "identity-and-cohort",
    "title": "身份、校区与届次",
    "requirement": "核同一学生主键、学段/校区/学院和本次离校批次；姓名和截图不能单独建正式案卷。",
    "execution": "semantic",
    "srcIds": [
      "SRC-001",
      "SRC-005"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "identity-batch",
    "criterionId": "current-personal-task-list",
    "title": "当前个人任务清单",
    "requirement": "只依据当前届次、校区、学段的权威任务清单和适用通知；无法取得全校2026清单时不从2020部门名单或2025通知补成硬规则。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-003",
      "SRC-004",
      "SRC-011",
      "SRC-012"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "department-facts",
    "criterionId": "department-status-source-version",
    "title": "部门原始状态与源版本",
    "requirement": "每项任务保留责任部门原始状态、发生/同步时间、源版本和权威签核；截图不替代部门决定。",
    "execution": "semantic",
    "srcIds": [
      "SRC-002",
      "SRC-006",
      "SRC-007",
      "SRC-009"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "department-facts",
    "criterionId": "housing-conditionality",
    "title": "住宿与退宿条件",
    "requirement": "住宿/退宿仅在当前任务清单或权威记录确认适用时核；床位不存在、无宿舍或例外未确认不自动阻断。",
    "execution": "manual",
    "srcIds": [
      "SRC-002",
      "SRC-003",
      "SRC-004",
      "SRC-011"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "department-facts",
    "criterionId": "library-loan-vs-thesis",
    "title": "借阅、赔偿与论文交存分离",
    "requirement": "借阅、遗失赔偿与图书馆论文交存是不同事实；论文仅在答辩后且当前清单要求时核，不将未来材料前置。",
    "execution": "semantic",
    "srcIds": [
      "SRC-007",
      "SRC-008"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "department-facts",
    "criterionId": "financial-authority",
    "title": "财务结清与对账来源",
    "requirement": "财务只引用财务处已入账/对账/冲正记录；会议新闻不能生成个人欠款阈值或自动决定放行。",
    "execution": "manual",
    "srcIds": [
      "SRC-009"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "exception-routing",
    "criterionId": "neighbor-decision-reuse",
    "title": "相邻业务只读引用",
    "requirement": "就业档案、组织关系、毕业授位等只引用S07-T01/T02/S07-T04等业务的有效结论；不重复审批，不默认所有事项必须结清。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-003",
      "SRC-005",
      "SRC-014"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "exception-routing",
    "criterionId": "exception-withdrawal-review",
    "title": "补件、代理、撤回与异议",
    "requirement": "对补件、代理、撤回、异议、豁免和人工更正，核本人身份、原部门受理和权限；具体权限/期限未知时转人工。",
    "execution": "manual",
    "srcIds": [
      "SRC-002",
      "SRC-003",
      "SRC-013"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "exception-routing",
    "criterionId": "aggregate-not-formal-release",
    "title": "总状态不可由局部PASS拼装",
    "requirement": "汇总部门事项状态时保留未产生、未完成、源失联、冲突、政策未知的区别；不得把若干局部PASS拼成学校总放行。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-003",
      "SRC-005"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "privacy-version",
    "criterionId": "privacy-and-api-boundary",
    "title": "最小化数据与接口边界",
    "requirement": "最小化处理学号、财务与住宿信息；保留来源版本/采集时点；不假设已接通学校数字离校API。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-014",
      "SRC-015"
    ],
    "evidenceStatus": "PARTIAL"
  }
]
const sectionDefinitions: Array<Pick<TemplateSectionSpec, 'id' | 'name' | 'order' | 'required'>> = [
  {
    "id": "identity-batch",
    "name": "身份、批次与任务清单",
    "order": 0,
    "required": true
  },
  {
    "id": "department-facts",
    "name": "部门事实与条件分支",
    "order": 1,
    "required": true
  },
  {
    "id": "exception-routing",
    "name": "例外、邻接业务与汇总",
    "order": 2,
    "required": true
  },
  {
    "id": "privacy-version",
    "name": "隐私、版本与安全边界",
    "order": 3,
    "required": true
  }
]
const sources: Array<{ srcId: string; url: string; evidenceStatus: EvidenceStatus; note: string }> = [
  {
    "srcId": "SRC-001",
    "url": "https://www.cdut.edu.cn/xs.htm",
    "evidenceStatus": "PARTIAL",
    "note": "官网学生服务入口证明服务存在，不证明本地应用获准调用API"
  },
  {
    "srcId": "SRC-002",
    "url": "https://clhq.cdut.edu.cn/info/1037/2344.htm",
    "evidenceStatus": "PARTIAL",
    "note": "2023楼寓中心服务指南，持续适用范围待主管部门确认"
  },
  {
    "srcId": "SRC-003",
    "url": "https://mee.cdut.edu.cn/info/1049/3682.htm",
    "evidenceStatus": "PARTIAL",
    "note": "机电学院2026届通知，仅限该学院/届次"
  },
  {
    "srcId": "SRC-004",
    "url": "https://mee.cdut.edu.cn/__local/F/EC/E7/1F834FDC582E51D6C795830EA14_662CE925_1B28D.pdf",
    "evidenceStatus": "PARTIAL",
    "note": "机电学院2026离校日程，不能推为全校法定期限"
  },
  {
    "srcId": "SRC-005",
    "url": "https://gra.cdut.edu.cn/__local/9/BC/89/D76B59272CC862FACEE252AAA16_C6BD07A3_4A2BD.pdf",
    "evidenceStatus": "PARTIAL",
    "note": "2026研究生工作通知的离校阶段，非全校部门清单"
  },
  {
    "srcId": "SRC-006",
    "url": "https://wxc.cdut.edu.cn/info/1010/1156.htm",
    "evidenceStatus": "PARTIAL",
    "note": "2020数字离校系统历史简讯，不证明当前API/权限"
  },
  {
    "srcId": "SRC-007",
    "url": "https://lib.cdut.edu.cn/fw.htm",
    "evidenceStatus": "PARTIAL",
    "note": "图书馆服务页面，借阅、赔偿和论文提交应分开核"
  },
  {
    "srcId": "SRC-008",
    "url": "https://lib.cdut.edu.cn/info/1022/4818.htm",
    "evidenceStatus": "PARTIAL",
    "note": "2026毕业研究生论文提交通知，是否属于离校必办需看当前清单"
  },
  {
    "srcId": "SRC-009",
    "url": "https://jcc.cdut.edu.cn/info/1014/2571.htm",
    "evidenceStatus": "PARTIAL",
    "note": "2025财务清欠新闻证明业务存在，不提供个人金额/自动阈值"
  },
  {
    "srcId": "SRC-011",
    "url": "https://yb.cdut.edu.cn/tzgg/zhsw1.htm",
    "evidenceStatus": "UNCONFIRMED",
    "note": "宜宾2026退宿通知全文未取得，仅目录片段"
  },
  {
    "srcId": "SRC-012",
    "url": "https://yb.cdut.edu.cn/tzgg/zhsw1.htm",
    "evidenceStatus": "UNCONFIRMED",
    "note": "宜宾电费退款通知全文未取得；退款不等于欠费结清"
  },
  {
    "srcId": "SRC-013",
    "url": "https://gr.uestc.edu.cn/tongzhi/122/14663",
    "evidenceStatus": "PARTIAL",
    "note": "电子科技大学2026指南仅作外校研究，不移植为CDUT规则"
  },
  {
    "srcId": "SRC-014",
    "url": "https://raw.githubusercontent.com/Fuck-GH-Admin/cdut-studio-review-agent/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json",
    "evidenceStatus": "PARTIAL",
    "note": "G50固定SHA技术目录，不是校方政策或已接线能力"
  },
  {
    "srcId": "SRC-015",
    "url": "https://wxc.cdut.edu.cn/fuwuxs.pdf",
    "evidenceStatus": "PARTIAL",
    "note": "2021学生服务指南仅证历史在线入口，不证明当前系统接口"
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

export const S07_T03: TemplateVersion = {
  templateId: 'S07-T03',
  version: 1,
  schemaVersion: 2,
  status: 'draft',
  createdAt: '2026-10-24T00:00:00.000Z',
  name: "学生离校手续及部门结清记录核验",
  description: "本地研究模板 · 非校方正式模板。核对适用离校批次的权威个人任务清单、部门原始状态与证据版本；不设独立离校许可，也不推定所有部门事项都是通用阻断条件。",
  catalogKind: 'builtin',
  sourceNote: 'R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非成都理工大学校方正式模板；SRC 为研究来源索引，不是案卷材料 SourceRef。政策不确定项只产生审阅建议并进入人工复核。',
  objectType: 'person',
  displayName: { template: '{{studentName}} · S07-T03 事实核验' },
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
  templateId: 'S07-T03',
  name: "学生离校手续及部门结清记录核验",
  sourceDocumentPath: 'docs/design/review-agent/business-templates/R02/S07-T03.md',
  sourceDocumentSha256: '3dc29829f0d509cd2e7ae1b058b9bd5b79926b643dd1c5b24831820e9e042c4b',
  officialSchoolTemplate: false,
  researchAsOf: '2026-10-24',
  researchStatus: 'ROUND3_DRAFT',
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
export const templateVersion = S07_T03
