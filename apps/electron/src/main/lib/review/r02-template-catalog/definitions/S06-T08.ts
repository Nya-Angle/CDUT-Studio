/**
 * S06-T08｜学生创业扶持资金、创业专项奖励申请审核
 * R02 研究稿映射，非成都理工大学正式模板；所有政策合规结论须人工核准。
 * SRC 为研究文献编号，不是 ReviewCase 的 SourceRef。
 */
import type { TemplateVersion, TemplateCriterionSpec, TemplateSectionSpec } from '@profer/shared'

interface ResearchCriterion extends TemplateCriterionSpec {
  /** 真实模板字段/材料槽绑定；供 V3 统一编译器转成 Check.target。 */
  researchBindings: { fieldKeys: string[]; materialSlotIds: string[]; researchSourceIds: string[] }
  policyEvidenceStatus: 'UNCONFIRMED'
}
interface ResearchSection extends TemplateSectionSpec { criteria: ResearchCriterion[] }
type ResearchTemplateVersion = Omit<TemplateVersion, 'sections'> & {
  officialSchoolTemplate: false
  policyEvidenceStatus: 'UNCONFIRMED'
  researchSource: { path: string; sha256: string }
  sections: ResearchSection[]
}

export const r02Metadata = {
  "templateId": "S06-T08",
  "name": "学生创业扶持资金、创业专项奖励申请审核",
  "sourcePath": "docs/design/review-agent/business-templates/R02/S06-T08.md",
  "sourceSha256": "00e86992d67f6f5620fca6eaa09499add10cb474d1691d8c0af56d020f145414",
  "officialSchoolTemplate": false,
  "policyEvidenceStatus": "UNCONFIRMED",
  "researchSourceStatus": "LIBRARY_FORMAL_RESEARCH_V1",
  "deduplicationBoundary": "资金计划+版本+批次+创业项目/实体+申请主体+已签奖励决定；T01 项目经费、T03/T04 奖项、T07 入驻或 G07 付款均不可重复计入本项资金资格。",
  "ruleBindings": [
    {
      "id": "R001",
      "fields": [
        "F002",
        "F003"
      ],
      "materials": [
        "M001"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R002",
      "fields": [
        "F002",
        "F010",
        "F030"
      ],
      "materials": [
        "M001",
        "M020"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R003",
      "fields": [
        "F003",
        "F004",
        "F005"
      ],
      "materials": [
        "M001",
        "M013"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R004",
      "fields": [
        "F006",
        "F029",
        "F032"
      ],
      "materials": [
        "M002",
        "M020"
      ],
      "researchSources": [
        "SRC-009"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R005",
      "fields": [
        "F003",
        "F007",
        "F022"
      ],
      "materials": [
        "M001",
        "M002"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R006",
      "fields": [
        "F008",
        "F011",
        "F029"
      ],
      "materials": [
        "M003",
        "M020"
      ],
      "researchSources": [
        "SRC-008"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R007",
      "fields": [
        "F009",
        "F014"
      ],
      "materials": [
        "M004"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R008",
      "fields": [
        "F010",
        "F012",
        "F014"
      ],
      "materials": [
        "M001",
        "M004",
        "M005"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R009",
      "fields": [
        "F003",
        "F012",
        "F022"
      ],
      "materials": [
        "M001",
        "M005"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R010",
      "fields": [
        "F010",
        "F012"
      ],
      "materials": [
        "M005"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R011",
      "fields": [
        "F013",
        "F030"
      ],
      "materials": [
        "M006"
      ],
      "researchSources": [
        "SRC-007"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R012",
      "fields": [
        "F011",
        "F012"
      ],
      "materials": [
        "M003",
        "M007"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R013",
      "fields": [
        "F003",
        "F015"
      ],
      "materials": [
        "M001",
        "M008"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R014",
      "fields": [
        "F016",
        "F017"
      ],
      "materials": [
        "M001",
        "M008"
      ],
      "researchSources": [
        "SRC-006"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R015",
      "fields": [
        "F009",
        "F021"
      ],
      "materials": [
        "M009"
      ],
      "researchSources": [
        "SRC-003"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R016",
      "fields": [
        "F009",
        "F018"
      ],
      "materials": [
        "M010"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R017",
      "fields": [
        "F018",
        "F019"
      ],
      "materials": [
        "M011"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R018",
      "fields": [
        "F012",
        "F020"
      ],
      "materials": [
        "M005",
        "M012"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R019",
      "fields": [
        "F004",
        "F005",
        "F029"
      ],
      "materials": [
        "M013"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R020",
      "fields": [
        "F003",
        "F023"
      ],
      "materials": [
        "M001",
        "M014"
      ],
      "researchSources": [
        "SRC-008"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R021",
      "fields": [
        "F017",
        "F025",
        "F026"
      ],
      "materials": [
        "M009",
        "M016",
        "M017"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R022",
      "fields": [
        "F017",
        "F026",
        "F027"
      ],
      "materials": [
        "M009",
        "M017",
        "M018"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R023",
      "fields": [
        "F003",
        "F024"
      ],
      "materials": [
        "M001",
        "M015"
      ],
      "researchSources": [
        "SRC-008"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R024",
      "fields": [
        "F025",
        "F029"
      ],
      "materials": [
        "M016",
        "M020"
      ],
      "researchSources": [
        "SRC-004"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R025",
      "fields": [
        "F025",
        "F031"
      ],
      "materials": [
        "M016"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R026",
      "fields": [
        "F025",
        "F027",
        "F029"
      ],
      "materials": [
        "M016",
        "M018"
      ],
      "researchSources": [
        "SRC-008"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R027",
      "fields": [
        "F005",
        "F008",
        "F028"
      ],
      "materials": [
        "M003",
        "M019"
      ],
      "researchSources": [
        "SRC-008"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R028",
      "fields": [
        "F003",
        "F025",
        "F028"
      ],
      "materials": [
        "M001",
        "M016",
        "M019"
      ],
      "researchSources": [
        "SRC-008"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R029",
      "fields": [
        "F001",
        "F009",
        "F029"
      ],
      "materials": [
        "M020"
      ],
      "researchSources": [
        "SRC-009"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R030",
      "fields": [
        "F009",
        "F030"
      ],
      "materials": [
        "M006",
        "M009",
        "M020"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    }
  ]
} as const

export const template: ResearchTemplateVersion = {
  templateId: "S06-T08",
  version: 1,
  schemaVersion: 2,
  name: "学生创业扶持资金、创业专项奖励申请审核",
  description: '本地研究模板／非校方正式模板。仅供材料分拣、事实核验、问题建议及人工复审；校本政策和决定权待确认。',
  catalogKind: 'reference',
  sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 正式研究稿 docs/design/review-agent/business-templates/R02/S06-T08.md；SHA-256 00e86992d67f6f5620fca6eaa09499add10cb474d1691d8c0af56d020f145414；本地研究模板、非校方正式模板；所有政策细则待确认。",
  objectType: "transaction",
  displayName: { template: "学生创业扶持资金、创业专项奖励申请审核" },
  fields: [
    { key: "F001", label: "case_id（UUID；全程）", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "case_id（UUID；全程）；服务端唯一案卷 S，永不由用户覆盖；L0/U" },
    { key: "F002", label: "scheme_id（字符串；申报）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "scheme_id（字符串；申报）；当前合法资助计划编号与资金性质，S/D；L0/P" },
    { key: "F003", label: "scheme_version（字符串；申报与重审）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "scheme_version（字符串；申报与重审）；含生效/废止/修订记录，S/D；L0/P" },
    { key: "F004", label: "cycle_id（字符串；申报）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "cycle_id（字符串；申报）；年度批次+申报窗口 S/D；L0/P" },
    { key: "F005", label: "stage（枚举；全程）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "stage（枚举；全程）；A–H 阶段/状态由事件记录 S；L0/U" },
    { key: "F006", label: "applicant_id（脱敏标识；全程）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "applicant_id（脱敏标识；全程）；学号/毕业证索引或官方身份映射 S；L2/Q/U" },
    { key: "F007", label: "cohort_status（枚举；申报）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "cohort_status（枚举；申报）；在读本科/研究生/离校毕业年限/其他，S 或可信官方证明；L1/Q/U" },
    { key: "F008", label: "applicant_authority（签发引用；申报）", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "applicant_authority（签发引用；申报）；团队负责人、本人、合法授权代理 D/S；L1/Q/H" },
    { key: "F009", label: "venture_id（ID；全程）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "venture_id（ID；全程）；同一创业项目/实体主键 S；不能按名称重复拆立项；L1/Q" },
    { key: "F010", label: "venture_kind（枚举；申报）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "venture_kind（枚举；申报）；未注册项目/已注册企业/个体户/网店等，A+S；L1/Q/P" },
    { key: "F011", label: "venture_owner_roles（结构化；申报）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "venture_owner_roles（结构化；申报）；负责人、控股/经营角色、团队名单 A+官方/既案 X；L2/Q/H" },
    { key: "F012", label: "registration_id_date_place（结构；条件申报）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "registration_id_date_place（结构；条件申报）；登记编号/日期/登记地；官方登记 S/D，未登记项目=N；L2/Q/U" },
    { key: "F013", label: "incubation_reference（签发引用；条件申报）", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "incubation_reference（签发引用；条件申报）；S06-T07 的入驻/孵化批准和有效期 X；非入驻计划=N；L1/Q/U" },
    { key: "F014", label: "venture_plan（文本+哈希；申报）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "venture_plan（文本+哈希；申报）；业务模式、市场、可行性、阶段目标；申请人 A；L2/Q" },
    { key: "F015", label: "amount_requested（币值；申报）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "amount_requested（币值；申报）；申请额及币种、分期计划 A；不等于核准额；L1/Q/P" },
    { key: "F016", label: "budget_use_plan（分类金额；申报）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "budget_use_plan（分类金额；申报）；用途、阶段、预算版本 A；支付合规由 G07；L2/Q/P" },
    { key: "F017", label: "milestones（数组；申报/实施）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "milestones（数组；申报/实施）；指标、目标、截止日、验收证据方案 A/签约 D；L2/Q/P" },
    { key: "F018", label: "prior_awards_subsidies（列表；申报）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "prior_awards_subsidies（列表；申报）；同主体/同项目/同计划历史受助与申请人声明，S/X/A；L2/Q/U/H" },
    { key: "F019", label: "first_venture_flag（三态；条件申报）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "first_venture_flag（三态；条件申报）；首次创业？须地方登记/经办核实 S/D；不可由否认声明判真；L2/U/H" },
    { key: "F020", label: "operation_proof_period（日期区间；条件申报）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "operation_proof_period（日期区间；条件申报）；正常经营证明和起止日 S/D/A；未形成=N；L2/Q/U" },
    { key: "F021", label: "achievement_reference（已签引用；条件申报）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "achievement_reference（已签引用；条件申报）；竞赛/成果证书或 S06-T03/04 已核结果 X/D；L1/Q/U" },
    { key: "F022", label: "identity_policy_match（三态；申报）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "identity_policy_match（三态；申报）；计划允许身份、属地、毕业年限等规则版本下结论；L1/P/U" },
    { key: "F023", label: "expert_review（多记录；评审阶段）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "expert_review（多记录；评审阶段）；专家独立评分、利益冲突声明、评分方案 D；申请时不产生；L2/N/H" },
    { key: "F024", label: "publicity_record（结构；有规定的公示阶段）", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "publicity_record（结构；有规定的公示阶段）；内容、开始/结束、异议与处理、签发者 D；期限需计划；L1/N/P" },
    { key: "F025", label: "fund_decision（结构；决定后）", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "fund_decision（结构；决定后）；同意/驳回/条件资助、核准额度、理由、签发主体和版本 D；L2/N/H" },
    { key: "F026", label: "report_actuals（结构；实施/结项）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "report_actuals（结构；实施/结项）；实际里程碑、验收证明、例外、变更说明 A+X/D；L2/N/Q" },
    { key: "F027", label: "change_request（结构；变更阶段）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "change_request（结构；变更阶段）；变更范围/理由/旧新版/相关人申请 A，审批 D 后有效；L2/N/Q" },
    { key: "F028", label: "withdraw_review_request（结构；撤回/复核）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "withdraw_review_request（结构；撤回/复核）；申请人、争点、原决定、时间与证据 A+S；L1/N/Q/H" },
    { key: "F029", label: "evidence_version_manifest（映射；每轮）", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "evidence_version_manifest（映射；每轮）；材料哈希、上传者、签发者、对象、时间、源版本 S；L1/U" },
    { key: "F030", label: "linked_decisions（引用；全程）", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "linked_decisions（引用；全程）；G03/04/05/06/07 和 S06-T01/03/07 等已签只读结果 X；L1/N/U" },
    { key: "F031", label: "external_authority_result（结构；政府决定后）", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "external_authority_result（结构；政府决定后）；官方文号/平台回执/属地经办机构/签发时间 D/S；L2/N/U" },
    { key: "F032", label: "rights_and_consent_scope（结构；每轮）", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "rights_and_consent_scope（结构；每轮）；合法个人信息处理依据、授权及敏感数据目的/期限 D/S；L2/P/H" },
  ],
  materialSlots: [
    { id: "M001", name: "当前计划公告、申请办法、资金性质、有效版本及批次；主管部门官网签发/授权档案", purpose: "当前计划公告、申请办法、资金性质、有效版本及批次；主管部门官网签发/授权档案；计划主管 S/D；申报前不可缺；无官方原件 POLICY_UNCONFIRMED，源失联 SOURCE_UNAVAILABLE；F002–F005,F022 / R001–R003,R005,R008,R009,R013,R014,R020,R023,R028 / SRC-005,006,008", requiredElements: ["当前计划公告、申请办法、资金性质、有效版本及批次；主管部门官网签发/授权档案"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M002", name: "本人学籍/毕业年限与身份；学籍系统、校方证明或合法身份接口（尽量不上传完整身份证）", purpose: "本人学籍/毕业年限与身份；学籍系统、校方证明或合法身份接口（尽量不上传完整身份证）；学校/官方服务端；申报；未取权威数据 U，申报人可请求核对；F006,F007,F032 / R004,R005 / SRC-005,009", requiredElements: ["本人学籍/毕业年限与身份；学籍系统、校方证明或合法身份接口（尽量不上传完整身份证）"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M003", name: "团队授权书、负责人记录；学校项目系统或经确认的成员授权", purpose: "团队授权书、负责人记录；学校项目系统或经确认的成员授权；团队及项目持有人；多人团队/代理申报时及撤回代理；F008,F011 / R006,R012,R027 / SRC-008,009", requiredElements: ["团队授权书、负责人记录；学校项目系统或经确认的成员授权"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M004", name: "计划书、创业项目摘要、场景与商业可行性（脱敏）", purpose: "计划书、创业项目摘要、场景与商业可行性（脱敏）；申请人；资金要求计划书才条件必需；不可读 UNREADABLE；F009,F010,F014 / R007,R008 / SRC-001,011", requiredElements: ["计划书、创业项目摘要、场景与商业可行性（脱敏）"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M005", name: "商事登记信息、成立日期和辖区；市场监管权威查询/登记文书", purpose: "商事登记信息、成立日期和辖区；市场监管权威查询/登记文书；登记主体；实体类、政府补贴触发时；未注册项目 N；F010,F012 / R008–R010,R018 / SRC-005,006", requiredElements: ["商事登记信息、成立日期和辖区；市场监管权威查询/登记文书"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M006", name: "孵化/在园状态：S06-T07 已签决定及期限或孵化机构官方记录", purpose: "孵化/在园状态：S06-T07 已签决定及期限或孵化机构官方记录；孵化主管；仅资助政策要求入驻/孵化时；F013,F030 / R011,R030 / SRC-007,010", requiredElements: ["孵化/在园状态：S06-T07 已签决定及期限或孵化机构官方记录"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M007", name: "创业负责人/股权经营角色：登记平台或团队经授权的归属材料", purpose: "创业负责人/股权经营角色：登记平台或团队经授权的归属材料；公司/团队；条件限定负责人时；个人股东明细需最小化；F011,F012 / R012 / SRC-005,009", requiredElements: ["创业负责人/股权经营角色：登记平台或团队经授权的归属材料"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M008", name: "申请金额、年度用途、阶段预算、计划规定格式或合法系统填报", purpose: "申请金额、年度用途、阶段预算、计划规定格式或合法系统填报；申请人；只有本资金类型要求用途预算时；申请金额非决定；F015,F016 / R013,R014 / SRC-001,006,011", requiredElements: ["申请金额、年度用途、阶段预算、计划规定格式或合法系统填报"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M009", name: "项目成果/里程碑/实际业绩：项目进度、权威验收或竞赛证书", purpose: "项目成果/里程碑/实际业绩：项目进度、权威验收或竞赛证书；项目/签发机关；按奖励条件申报或实施/结项；F017,F021,F026 / R015,R021,R022,R030 / SRC-002,003", requiredElements: ["项目成果/里程碑/实际业绩：项目进度、权威验收或竞赛证书"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M010", name: "已获/在申相似补助声明与主管共享名单核查回执", purpose: "已获/在申相似补助声明与主管共享名单核查回执；申请人+资金主管 S；有排重政策才适用；F018 / R016 / SRC-005,006", requiredElements: ["已获/在申相似补助声明与主管共享名单核查回执"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M011", name: "首次创业状态官方查询/核定与历史实体关系", purpose: "首次创业状态官方查询/核定与历史实体关系；人社/登记主管；2025 省补贴路线才触发；F019,F018 / R017 / SRC-005,006", requiredElements: ["首次创业状态官方查询/核定与历史实体关系"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M012", name: "正常运营区间佐证：经营事实、官方业务/税务核定或主管接受证明", purpose: "正常运营区间佐证：经营事实、官方业务/税务核定或主管接受证明；经营主体/经办机关；6、18 月政策路线，敏感流水先脱敏；F020,F012 / R018 / SRC-005,006", requiredElements: ["正常运营区间佐证：经营事实、官方业务/税务核定或主管接受证明"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M013", name: "申请受理回执/官方平台表单版本与截止时间", purpose: "申请受理回执/官方平台表单版本与截止时间；申报人/经办机关；提交后形成，草稿不强制；F004,F005,F029 / R003,R019 / SRC-005,006", requiredElements: ["申请受理回执/官方平台表单版本与截止时间"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M014", name: "评审意见、专家避嫌、评分/排序、申诉记录", purpose: "评审意见、专家避嫌、评分/排序、申诉记录；专家/主管 D；进入专家评审后才形成；F023 / R020 / SRC-008,011", requiredElements: ["评审意见、专家避嫌、评分/排序、申诉记录"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M015", name: "公示与异议处理回执（若计划规定）", purpose: "公示与异议处理回执（若计划规定）；公示主管 D；仅公示阶段，非全部项目强制 7 日；F024 / R023 / SRC-008,010", requiredElements: ["公示与异议处理回执（若计划规定）"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M016", name: "有权奖补决定/外部政府决定及文号、签发身份", purpose: "有权奖补决定/外部政府决定及文号、签发身份；授权校方或外部机关 D；决定阶段才形成；F025,F031,F030 / R021,R024–R026,R028 / SRC-004,005,008", requiredElements: ["有权奖补决定/外部政府决定及文号、签发身份"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M017", name: "阶段履约报告、绩效证明及异常说明；可信验收记录可替代", purpose: "阶段履约报告、绩效证明及异常说明；可信验收记录可替代；资助负责人/主管；实施/结项触发；F017,F026 / R021,R022 / SRC-001,011", requiredElements: ["阶段履约报告、绩效证明及异常说明；可信验收记录可替代"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M018", name: "变更申请、原决定及有权变更签发", purpose: "变更申请、原决定及有权变更签发；申请人+授权决策者；仅变更、变更后结项；F027,F025 / R022,R026 / SRC-008,009", requiredElements: ["变更申请、原决定及有权变更签发"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M019", name: "撤回/复核申请、理由、证据、原决定与送达记录", purpose: "撤回/复核申请、理由、证据、原决定与送达记录；申请人/经办机关；仅撤回/复核；F028,F025 / R027,R028 / SRC-008,009", requiredElements: ["撤回/复核申请、理由、证据、原决定与送达记录"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M020", name: "证据归属/上传版本/授权范围/其他模板已签引用清单", purpose: "证据归属/上传版本/授权范围/其他模板已签引用清单；服务端 S/X；每次证据重传、跨模板消费时；F001,F029,F030,F032 / R002,R004,R006,R024,R029,R030 / SRC-009", requiredElements: ["证据归属/上传版本/授权范围/其他模板已签引用清单"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
  ],
  sections: [{
    id: 'research-review', name: '逐条事实核验与人工复审', order: 0, required: true,
    description: '每个 R 编号是独立可追踪的审核要求；即使语义核验得到事实也不等于政策合规或正式校方决定。',
    criteria: [
      { id: "R001", title: "存在可适用且有有效版本的资金计划；申请前/全类型", requirement: "存在可适用且有有效版本的资金计划；申请前/全类型；F002,F003 ← M001；T 计划可定位；F 文号或版本冲突 CONFLICT；? POLICY_UNCONFIRMED；SRC-005,006,008；计划主管核政策", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F002","F003"], materialSlotIds: ["M001"], researchSourceIds: ["SRC-005"] } },
      { id: "R002", title: "资助类型为本案的独立创业资金/专项奖励，而非大创经费或财务报销；路由/全类型", requirement: "资助类型为本案的独立创业资金/专项奖励，而非大创经费或财务报销；路由/全类型；F002,F010,F030 ← M001,M020；T 本项；F NOT_APPLICABLE 并路由 S06-T01/G07；? POLICY_UNCONFIRMED；SRC-001,002,003；分案人员/申请人", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F002","F010","F030"], materialSlotIds: ["M001","M020"], researchSourceIds: ["SRC-001"] } },
      { id: "R003", title: "申请对应当前批次/截止窗口；提交/全类型", requirement: "申请对应当前批次/截止窗口；提交/全类型；F003,F004,F005 ← M001,M013；T 窗内；F 超期交有权人决定是否可受理 NEEDS_HUMAN_DECISION；? 计划无窗口 POLICY_UNCONFIRMED，平台无法核回执 SOURCE_UNAVAILABLE；SRC-005,006；受理机关", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F004","F005"], materialSlotIds: ["M001","M013"], researchSourceIds: ["SRC-005"] } },
      { id: "R004", title: "申报人身份与案卷一致；申报/各身份", requirement: "申报人身份与案卷一致；申报/各身份；F006,F029,F032 ← M002,M020；T 可信身份一致；F ID 不同 CONFLICT；? 人工上传不能替官方，SOURCE_UNAVAILABLE 或 NEEDS_MATERIAL；SRC-009；学籍/身份主管", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F006","F029","F032"], materialSlotIds: ["M002","M020"], researchSourceIds: ["SRC-009"] } },
      { id: "R005", title: "计划覆盖该学段/毕业年限与人群；申报/条件身份", requirement: "计划覆盖该学段/毕业年限与人群；申报/条件身份；F007,F022,F003 ← M001,M002；T 按本计划匹配；F 明确不符 NEEDS_HUMAN_DECISION；? POLICY_UNCONFIRMED；不得用旧在校生补贴规则代替 2025 新政；SRC-005,006,007；资金主管", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F007","F022"], materialSlotIds: ["M001","M002"], researchSourceIds: ["SRC-005"] } },
      { id: "R006", title: "申报人对创业团队/实体有提交授权；申报/代理或团队", requirement: "申报人对创业团队/实体有提交授权；申报/代理或团队；F008,F011,F029 ← M003,M020；T 已证；F 签发主体不符 CONFLICT；? NEEDS_MATERIAL 或 SOURCE_UNAVAILABLE；SRC-008,009；团队负责人/项目主管", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F008","F011","F029"], materialSlotIds: ["M003","M020"], researchSourceIds: ["SRC-008"] } },
      { id: "R007", title: "项目计划书与案卷同一项目；申报/要求计划书", requirement: "项目计划书与案卷同一项目；申报/要求计划书；F009,F014 ← M004；T 描述与主键吻合；F 多主体拼接或冒用 CONFLICT；? NEEDS_MATERIAL/UNREADABLE；SRC-001,011；申请人补正", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F009","F014"], materialSlotIds: ["M004"], researchSourceIds: ["SRC-001"] } },
      { id: "R008", title: "创业项目/实体类别被计划覆盖；申报/全类型", requirement: "创业项目/实体类别被计划覆盖；申报/全类型；F010,F012,F014 ← M004,M005,M001；T 类别匹配；F 类别不符 NEEDS_HUMAN_DECISION；? POLICY_UNCONFIRMED；SRC-005,006,007；计划主管", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F010","F012","F014"], materialSlotIds: ["M001","M004","M005"], researchSourceIds: ["SRC-005"] } },
      { id: "R009", title: "申报地/项目地符合当期方案辖区；申报/外部或限定属地", requirement: "申报地/项目地符合当期方案辖区；申报/外部或限定属地；F003,F012,F022 ← M001,M005；T 属地一致；F NEEDS_HUMAN_DECISION；? POLICY_UNCONFIRMED；SRC-005,006,012；属地经办机构", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F012","F022"], materialSlotIds: ["M001","M005"], researchSourceIds: ["SRC-005"] } },
      { id: "R010", title: "注册型资助有合法登记日期与状态；申报/注册实体", requirement: "注册型资助有合法登记日期与状态；申报/注册实体；F010,F012 ← M005；T 证照/登记接口一致；F CONFLICT；? NEEDS_MATERIAL/SOURCE_UNAVAILABLE；纯项目分支 N；SRC-005,006；登记主管/申请人", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F010","F012"], materialSlotIds: ["M005"], researchSourceIds: ["SRC-005"] } },
      { id: "R011", title: "计划要求的孵化/入驻资格已另行签发且有效；申报/条件孵化", requirement: "计划要求的孵化/入驻资格已另行签发且有效；申报/条件孵化；F013,F030 ← M006；T S06-T07 决定有效；F 过期/项目不符 CONFLICT；? SOURCE_UNAVAILABLE；非门槛 N；SRC-007,010；S06-T07 权威业务方", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F013","F030"], materialSlotIds: ["M006"], researchSourceIds: ["SRC-007"] } },
      { id: "R012", title: "负责人/实际经营者满足计划要求的关系；申报/限制创业角色", requirement: "负责人/实际经营者满足计划要求的关系；申报/限制创业角色；F011,F012 ← M003,M007；T 官方登记与申请一致；F CONFLICT；? 计划阈值未知 POLICY_UNCONFIRMED 或 NEEDS_MATERIAL；SRC-005,009；主管/申请人", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F011","F012"], materialSlotIds: ["M003","M007"], researchSourceIds: ["SRC-005"] } },
      { id: "R013", title: "申请金额在本方案适用限额内且计算口径一致；申报/金额型", requirement: "申请金额在本方案适用限额内且计算口径一致；申报/金额型；F015,F003 ← M001,M008；T 未超明示区间；F NEEDS_HUMAN_DECISION；? 金额上限未公开 POLICY_UNCONFIRMED；不得以 SRC-001 的历史资助额作个人限额；SRC-001,006,011；资金主管", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F015"], materialSlotIds: ["M001","M008"], researchSourceIds: ["SRC-001"] } },
      { id: "R014", title: "预算用途/阶段金额合于专项使用范围；申报/需预算型", requirement: "预算用途/阶段金额合于专项使用范围；申报/需预算型；F016,F017 ← M008,M001；T 符合计划用途分类；F NEEDS_HUMAN_DECISION；? POLICY_UNCONFIRMED/NEEDS_MATERIAL；不查票据/支付；SRC-006,011；资金主管，付款转 G07", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F016","F017"], materialSlotIds: ["M001","M008"], researchSourceIds: ["SRC-006"] } },
      { id: "R015", title: "奖项或成果事实真实且对应申请主体/时段；申报/专项奖励条件", requirement: "奖项或成果事实真实且对应申请主体/时段；申报/专项奖励条件；F021,F009 ← M009；T 已签成绩/权属引用有效；F 角色或项目冲突 CONFLICT；? NEEDS_MATERIAL/SOURCE_UNAVAILABLE；此规则不重新评 S06-T03/G06；SRC-003,008；奖项签发方/项目主管", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F009","F021"], materialSlotIds: ["M009"], researchSourceIds: ["SRC-003"] } },
      { id: "R016", title: "同项目/申请人没有触发当期明定的重复受助限制；申报/有排重条件", requirement: "同项目/申请人没有触发当期明定的重复受助限制；申报/有排重条件；F018,F009 ← M010；T 主管排重查询可证；F 发现重叠 CONFLICT 待人工认定；? 仅自述 SOURCE_UNAVAILABLE 或政策未核 POLICY_UNCONFIRMED；SRC-005,006；补助主管", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F009","F018"], materialSlotIds: ["M010"], researchSourceIds: ["SRC-005"] } },
      { id: "R017", title: "申请者满足“首次创业”事实；申报/2025 四川政府分段补贴等明定场景", requirement: "申请者满足“首次创业”事实；申报/2025 四川政府分段补贴等明定场景；F019,F018 ← M011；T 主管核定首次；F 非首次 NEEDS_HUMAN_DECISION；? SOURCE_UNAVAILABLE；学校自设方案未要求 N；SRC-005,006；人社经办", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F018","F019"], materialSlotIds: ["M011"], researchSourceIds: ["SRC-005"] } },
      { id: "R018", title: "企业运营区间达到本地当批次最低经营时间；申报/分段运营补贴", requirement: "企业运营区间达到本地当批次最低经营时间；申报/分段运营补贴；F020,F012 ← M005,M012；T 政策时间点与权威运营事实符合；F 尚未达 6/18 月 NEEDS_HUMAN_DECISION；? NEEDS_MATERIAL/SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED；未注册计划 N；SRC-005,006；人社经办", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F012","F020"], materialSlotIds: ["M005","M012"], researchSourceIds: ["SRC-005"] } },
      { id: "R019", title: "申报提交及回执确由有权受理平台接收；提交/所有需官方回执", requirement: "申报提交及回执确由有权受理平台接收；提交/所有需官方回执；F004,F005,F029 ← M013；T 服务器回执对应本案；F 回执日期/主体不符 CONFLICT；? 提交未发生 N、断连 SOURCE_UNAVAILABLE；SRC-005,006；受理机关", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F004","F005","F029"], materialSlotIds: ["M013"], researchSourceIds: ["SRC-005"] } },
      { id: "R020", title: "评审记录完成规定的程序、专家独立性要求；专家评审阶段/需评审计划", requirement: "评审记录完成规定的程序、专家独立性要求；专家评审阶段/需评审计划；F023,F003 ← M014,M001；T 评分规则与签发一致；F 评分版本/回避冲突 CONFLICT；? NEEDS_MATERIAL/POLICY_UNCONFIRMED；申请阶段 N；SRC-008,011；专家组织方", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F023"], materialSlotIds: ["M001","M014"], researchSourceIds: ["SRC-008"] } },
      { id: "R021", title: "实施期里程碑完成事实与资助决定目标一致；实施/分期型", requirement: "实施期里程碑完成事实与资助决定目标一致；实施/分期型；F017,F026,F025 ← M009,M017,M016；T 对照决定版已核；F 指标对不上 CONFLICT；? NEEDS_MATERIAL/UNREADABLE；未批准 N；SRC-001,011；计划绩效主管", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F017","F025","F026"], materialSlotIds: ["M009","M016","M017"], researchSourceIds: ["SRC-001"] } },
      { id: "R022", title: "结项验收证据与目标及批准变更版本一致；结项/有结项要求", requirement: "结项验收证据与目标及批准变更版本一致；结项/有结项要求；F017,F026,F027 ← M009,M017,M018；T 有权验收事实符合；F CONFLICT；? 缺后续材料 NEEDS_MATERIAL；无结项制度 N；SRC-001,011；结项主管", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F017","F026","F027"], materialSlotIds: ["M009","M017","M018"], researchSourceIds: ["SRC-001"] } },
      { id: "R023", title: "应进行的公示已按计划完成且异议处置有权签发；公示/需公示计划", requirement: "应进行的公示已按计划完成且异议处置有权签发；公示/需公示计划；F024,F003 ← M015,M001；T 计划公示及异议处理齐全；F 未依要求 NEEDS_HUMAN_DECISION；? POLICY_UNCONFIRMED/NEEDS_MATERIAL；无需公示 N；SRC-008,010；公示主管", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F024"], materialSlotIds: ["M001","M015"], researchSourceIds: ["SRC-008"] } },
      { id: "R024", title: "校内资金决定确为有权校方主体签发且版本/金额关联本案；决定及后续/校内专项", requirement: "校内资金决定确为有权校方主体签发且版本/金额关联本案；决定及后续/校内专项；F025,F029 ← M016,M020；T 真签发；F 假 actor/旧签章 CONFLICT；? SOURCE_UNAVAILABLE；未进入决定 N；OCR 识别印章不构成 T；SRC-004,008,009；学校授权签发方", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F025","F029"], materialSlotIds: ["M016","M020"], researchSourceIds: ["SRC-004"] } },
      { id: "R025", title: "外部补贴的最终决定确来自对应属地资金机关；决定及后续/外部方案", requirement: "外部补贴的最终决定确来自对应属地资金机关；决定及后续/外部方案；F031,F025 ← M016；T 外部系统签发可信；F 学校自称外部批准 CONFLICT；? SOURCE_UNAVAILABLE；未决定 N；SRC-005,006,012；外部机关", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F025","F031"], materialSlotIds: ["M016"], researchSourceIds: ["SRC-005"] } },
      { id: "R026", title: "资助项目金额/阶段/负责人变更有原决定及授权变更决定；变更/已决定计划", requirement: "资助项目金额/阶段/负责人变更有原决定及授权变更决定；变更/已决定计划；F027,F025,F029 ← M018,M016；T 按变更生效日升级版本；F 越权调整 CONFLICT；? NEEDS_MATERIAL/NEEDS_HUMAN_DECISION；无变更 N；SRC-008,009；原决定权限机关", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F025","F027","F029"], materialSlotIds: ["M016","M018"], researchSourceIds: ["SRC-008"] } },
      { id: "R027", title: "撤回请求确由申请人/合法代理发起且处于可受理阶段；撤回/有请求", requirement: "撤回请求确由申请人/合法代理发起且处于可受理阶段；撤回/有请求；F028,F008,F005 ← M019,M003；T 身份与时点可证；F 已签决定后不可自动销案 NEEDS_HUMAN_DECISION；? NEEDS_MATERIAL/POLICY_UNCONFIRMED；SRC-008,009；受理/签发方", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F005","F008","F028"], materialSlotIds: ["M003","M019"], researchSourceIds: ["SRC-008"] } },
      { id: "R028", title: "复核争点、被诉决定及受理机构符合当期制度；复核/有请求", requirement: "复核争点、被诉决定及受理机构符合当期制度；复核/有请求；F028,F025,F003 ← M019,M016,M001；T 受理条件核实；F 超期/错机关 NEEDS_HUMAN_DECISION 并转告正确渠道；? POLICY_UNCONFIRMED；SRC-008,009；专门复核机关", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F025","F028"], materialSlotIds: ["M001","M016","M019"], researchSourceIds: ["SRC-008"] } },
      { id: "R029", title: "证据均归属本项目/目标对象且依赖最新版本；任意证据更新/全类型", requirement: "证据均归属本项目/目标对象且依赖最新版本；任意证据更新/全类型；F001,F009,F029 ← M020；T 目标与哈希相符；F 跨人/旧版结论 CONFLICT 并撤销旧效力；? SOURCE_UNAVAILABLE；SRC-009；服务端案卷管理者", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F001","F009","F029"], materialSlotIds: ["M020"], researchSourceIds: ["SRC-009"] } },
      { id: "R030", title: "所引用 G50/S06 邻项决定是可信已签且尚有效记录；跨模板消费/条件场景", requirement: "所引用 G50/S06 邻项决定是可信已签且尚有效记录；跨模板消费/条件场景；F030,F009 ← M020,M006,M009；T 仅消费引用；F 状态/项目不符 CONFLICT；? SOURCE_UNAVAILABLE；无邻项依赖 N；SRC-002,003,009；相应模板有权签发人", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F009","F030"], materialSlotIds: ["M006","M009","M020"], researchSourceIds: ["SRC-002"] } },
    ],
  }],
  policyVersionIds: [],
  policyRefs: [],
  stages: [
    { id: 'intake', name: '材料识别与事实核验', kind: 'auto-check', executorRole: 'system', nextStageId: 'review' },
    { id: 'review', name: '证据冲突、缺件与政策适用人工复核', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'decision-review' },
    { id: 'decision-review', name: '人工确认和本地审阅建议', kind: 'manual-review', executorRole: 'teacher' },
  ],
  outputs: [
    { id: 'issues', kind: 'item-feedback', audience: 'reviewer' },
    { id: 'missing', kind: 'supplement-list', audience: 'student' },
  ],
  autoPassPolicy: { enabled: false },
  officialSchoolTemplate: false,
  policyEvidenceStatus: 'UNCONFIRMED',
  researchSource: { path: "docs/design/review-agent/business-templates/R02/S06-T08.md", sha256: "00e86992d67f6f5620fca6eaa09499add10cb474d1691d8c0af56d020f145414" },
  status: 'draft',
  createdAt: '2026-10-24T00:00:00.000Z',
}

export default template

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
