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
    "label": "毕业/转递届次",
    "kind": "text",
    "required": true,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "degreeLevel",
    "label": "学段",
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
    "key": "destinationType",
    "label": "转递类型/去向",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "receivingOrganization",
    "label": "实际收档机构",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "receivingDepartment",
    "label": "收档部门/联系人单位",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "receivingAddress",
    "label": "收档地址快照",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "postalCode",
    "label": "邮编",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "recipientContact",
    "label": "收件联系人",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "recipientPhone",
    "label": "收件联系电话",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "authorityEvidenceRef",
    "label": "机构接收权限依据引用",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "transferAttemptId",
    "label": "本次转递尝试ID",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "dispatchStatus",
    "label": "交寄/物流原始状态",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "intakeStatus",
    "label": "接收方入库原始状态",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "sourceVersion",
    "label": "通知/地址/材料版本",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "changeOrReturnRequest",
    "label": "改址/退回/复核请求",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  }
]
const materialSlots: MaterialSlotSpec[] = [
  {
    "id": "current-transfer-notice",
    "name": "当届档案转递通知与附件",
    "purpose": "核当前批次/学段/校区的政策与材料清单",
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
      "发文主体/文号",
      "适用届次",
      "时间/程序"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "identity-and-cohort-record",
    "name": "权威身份、学籍与届次记录",
    "purpose": "以权威学籍主键绑定转递对象",
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
      "学段/校区",
      "届次/状态"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "destination-authority-proof",
    "name": "收档机构权限/接收函/调档函",
    "purpose": "核实际档案保管机构而非只看就业单位名称",
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
      "机构全称",
      "档案类别/接收资格",
      "签发来源"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "recipient-address-proof",
    "name": "地址、部门、联系人和邮编",
    "purpose": "对照机构官方资料与同版转递信息；联系方式本身不证明授权",
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
      "详细地址",
      "收件部门",
      "邮编/联系人"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "exported-transfer-snapshot",
    "name": "学校审核/导出时冻结的转递快照",
    "purpose": "只有实际生成的权威快照才可作为导出事实",
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
      "导出记录",
      "版本/时间",
      "地址指纹"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "dispatch-and-delivery-records",
    "name": "校内交接与EMS运单/轨迹",
    "purpose": "区分打印、揽收、路由与妥投",
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
      "运单号",
      "揽收/轨迹",
      "签收属性"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "recipient-intake-confirmation",
    "name": "接收机构正式到档/入库回执",
    "purpose": "正式入库须由接收机构权威记录确认，妥投不等于入库",
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
      "接收方来源",
      "入库状态",
      "核验时间"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "change-return-review-records",
    "name": "改址、撤回、退档与重新转递记录",
    "purpose": "每次变化新建尝试/版本，不覆盖旧物流事实",
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
      "原尝试ID",
      "新旧地址版本",
      "有权处理记录"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  }
]
const criteria: R02Criterion[] = [
  {
    "sectionId": "identity-policy",
    "criterionId": "identity-and-graduation-status",
    "title": "身份、学段与毕业状态引用",
    "requirement": "以权威学籍主键、学段、校区和毕业/结业事实绑定本案；毕业资格、学士授位或研究生授位只引用相邻业务已生效结论。",
    "execution": "semantic",
    "srcIds": [
      "SRC-001",
      "SRC-003",
      "SRC-014"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "identity-policy",
    "criterionId": "current-transfer-policy",
    "title": "当届转递通知与时间窗",
    "requirement": "按当届、校区、学段核对现行通知及附件；2026全文未取得时保持政策未知，绝不把2025年6月25日/7月8日或默认回生源地当作2026规则。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-003",
      "SRC-005",
      "SRC-015"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "destination-verification",
    "criterionId": "destination-type-and-custodian",
    "title": "实际收档方与去向类型",
    "requirement": "区分就业单位、上级主管、托管机构、公共就业人才服务机构和真实档案保管方；只按权威材料确认对应关系。",
    "execution": "semantic",
    "srcIds": [
      "SRC-001",
      "SRC-008",
      "SRC-009",
      "SRC-010"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "destination-verification",
    "criterionId": "recipient-authority",
    "title": "机构收档权限与授权",
    "requirement": "收档机构的档案管理资格须由官方名录、机构正式文件或有权人工核验；私人电话、OCR、印章图片或前端角色不能自动证明授权。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-010"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "destination-verification",
    "criterionId": "address-recipient-consistency",
    "title": "地址、部门、联系人同版一致",
    "requirement": "比较机构名称、部门、详细地址、邮编、联系人与同版收件信息；地址完整不等于机构有权收档。",
    "execution": "semantic",
    "srcIds": [
      "SRC-001",
      "SRC-008"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "destination-verification",
    "criterionId": "adjacent-decision-reuse",
    "title": "相邻业务结论只读复用",
    "requirement": "毕业/结业归S07-T01，本科授位归S07-T02，离校结清归S07-T03且仅在现行转档通知确有要求时引用；不重审资格，也不增设全部门结清前置。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-003",
      "SRC-012"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "dispatch-lifecycle",
    "criterionId": "frozen-address-and-export-version",
    "title": "导出快照与地址版本冻结",
    "requirement": "只有真实导出记录和同版地址快照才能证明已导出；改址/补正使受影响检查待重审，不覆盖历史版本。",
    "execution": "semantic",
    "srcIds": [
      "SRC-001",
      "SRC-003"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "dispatch-lifecycle",
    "criterionId": "lawful-transfer-channel",
    "title": "合法转递渠道与报到证边界",
    "requirement": "按国家转递规范核对学校实际转递渠道；不得要求毕业生个人自带档案，也不得把就业报到证当作档案转递必需材料。",
    "execution": "manual",
    "srcIds": [
      "SRC-008",
      "SRC-009"
    ],
    "evidenceStatus": "VERIFIED"
  },
  {
    "sectionId": "dispatch-lifecycle",
    "criterionId": "delivery-is-not-intake",
    "title": "物流妥投与正式入库分离",
    "requirement": "EMS打印、揽收、物流妥投、门卫代收和接收机构正式入库是不同事实；只有接收方权威记录才能证明入库。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-008",
      "SRC-010"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "exceptions-boundary",
    "criterionId": "change-return-and-appeal",
    "title": "寄出后改址、退档与复核",
    "requirement": "核当前实物位置、原转递尝试和有权处理记录；撤回/重寄权限及期限未核时交人工，不回滚既有物流事实。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-005",
      "SRC-010"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "exceptions-boundary",
    "criterionId": "missing-neighbor-catalog",
    "title": "跨模板与目录缺口",
    "requirement": "只引用已确认的相邻业务结果；R02完整总账未取得时不宣称全量去重。S07-T09是缺失项，不得创建替代模板。",
    "execution": "manual",
    "srcIds": [
      "SRC-011",
      "SRC-012"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "exceptions-boundary",
    "criterionId": "privacy-minimization",
    "title": "个人信息与档案安全",
    "requirement": "仅处理转递必要的定位/授权证据，限制完整身份证件、电话与整档内容的展示；未知保留/访问策略由授权人员确认。",
    "execution": "manual",
    "srcIds": [
      "SRC-008",
      "SRC-010"
    ],
    "evidenceStatus": "PARTIAL"
  }
]
const sectionDefinitions: Array<Pick<TemplateSectionSpec, 'id' | 'name' | 'order' | 'required'>> = [
  {
    "id": "identity-policy",
    "name": "身份、届次与政策适用",
    "order": 0,
    "required": true
  },
  {
    "id": "destination-verification",
    "name": "去向与收档机构核验",
    "order": 1,
    "required": true
  },
  {
    "id": "dispatch-lifecycle",
    "name": "冻结、交寄、妥投与入库",
    "order": 2,
    "required": true
  },
  {
    "id": "exceptions-boundary",
    "name": "异常、邻接路由与隐私",
    "order": 3,
    "required": true
  }
]
const sources: Array<{ srcId: string; url: string; evidenceStatus: EvidenceStatus; note: string }> = [
  {
    "srcId": "SRC-001",
    "url": "https://dag.cdut.edu.cn/info/1076/1980.htm",
    "evidenceStatus": "PARTIAL",
    "note": "2025届校本转递通知正文可读；仅适用2025，2026通知全文未取得"
  },
  {
    "srcId": "SRC-003",
    "url": "https://dag.cdut.edu.cn/info/1076/2086.htm",
    "evidenceStatus": "PARTIAL",
    "note": "2026归档工作通知，不等于2026届转递数据审核专门通知"
  },
  {
    "srcId": "SRC-004",
    "url": "https://yb.cdut.edu.cn/info/1041/3573.htm",
    "evidenceStatus": "PARTIAL",
    "note": "宜宾2024校区流程，不能转作2026岗位授权"
  },
  {
    "srcId": "SRC-005",
    "url": "https://dag.cdut.edu.cn/index.htm",
    "evidenceStatus": "UNCONFIRMED",
    "note": "档案馆官网仅见2026通知入口/摘要，直开或附件受HTTP 412限制"
  },
  {
    "srcId": "SRC-008",
    "url": "https://www.mohrss.gov.cn/wap/zc/zcwj/202306/t20230616_501616.html",
    "evidenceStatus": "VERIFIED",
    "note": "人社厅发〔2023〕20号，2023-06-13；国家档案转递接收通用规范"
  },
  {
    "srcId": "SRC-009",
    "url": "https://www.moe.gov.cn/jyb_xxgk/moe_1777/moe_1779/202310/t20231020_1086568.html",
    "evidenceStatus": "VERIFIED",
    "note": "人社部发〔2023〕26号；2023起报到证不再是档案转递必需材料"
  },
  {
    "srcId": "SRC-010",
    "url": "https://chrm.mohrss.gov.cn/announcement/中共中央组织部-人力资源社会保障部等五部门关于-2/",
    "evidenceStatus": "PARTIAL",
    "note": "流动人员档案规定只适用于其规定范围，不覆盖所有档案类别"
  },
  {
    "srcId": "SRC-011",
    "url": "https://raw.githubusercontent.com/Fuck-GH-Admin/cdut-studio-review-agent/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json",
    "evidenceStatus": "PARTIAL",
    "note": "G50固定SHA技术目录，不是校本政策"
  },
  {
    "srcId": "SRC-012",
    "url": "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/tree/feat/v3-r02-template-library/docs/design/review-agent/business-templates/R02/dispatch",
    "evidenceStatus": "UNCONFIRMED",
    "note": "项目总账/审计源未完整取得；不得声称完成116项全量去重"
  },
  {
    "srcId": "SRC-014",
    "url": "https://gra.cdut.edu.cn/info/1007/5867.htm",
    "evidenceStatus": "PARTIAL",
    "note": "2026研究生学籍/图像校对通知，不是档案转递批准"
  },
  {
    "srcId": "SRC-015",
    "url": "https://www.mohrss.gov.cn/xxgk2020/fdzdgknr/zcfg/gfxwj/jy/202606/t20260624_578865.html",
    "evidenceStatus": "PARTIAL",
    "note": "2026国家专项行动背景；不规定CDUT当届期限/默认去向"
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

export const S07_T04: TemplateVersion = {
  templateId: 'S07-T04',
  version: 1,
  schemaVersion: 2,
  status: 'draft',
  createdAt: '2026-10-24T00:00:00.000Z',
  name: "毕业生档案转递及收件人身份核验",
  description: "本地研究模板 · 非校方正式模板。核验毕业生档案转递中的身份、当前去向、收档机构权限、地址快照和物流/入库事实；不批准就业去向或生成学校转递决定。",
  catalogKind: 'builtin',
  sourceNote: 'R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非成都理工大学校方正式模板；SRC 为研究来源索引，不是案卷材料 SourceRef。政策不确定项只产生审阅建议并进入人工复核。',
  objectType: 'person',
  displayName: { template: '{{studentName}} · S07-T04 事实核验' },
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
  templateId: 'S07-T04',
  name: "毕业生档案转递及收件人身份核验",
  sourceDocumentPath: 'docs/design/review-agent/business-templates/R02/S07-T04.md',
  sourceDocumentSha256: '0d7f3127a64ff75b8c0ba242eff78ecacf23bae09d41764251d2462e0e827065',
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
export const templateVersion = S07_T04
