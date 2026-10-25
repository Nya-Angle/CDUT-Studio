/**
 * S06-T07｜学生创业项目孵化、入驻与团队资格审核
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
  "templateId": "S06-T07",
  "name": "学生创业项目孵化、入驻与团队资格审核",
  "sourcePath": "docs/design/review-agent/business-templates/R02/S06-T07.md",
  "sourceSha256": "161896173fb560c3cd14d6444fbf41ef075dcb7692ba25541d971a16d72d604b",
  "officialSchoolTemplate": false,
  "policyEvidenceStatus": "UNCONFIRMED",
  "researchSourceStatus": "LIBRARY_FORMAL_RESEARCH_V1",
  "deduplicationBoundary": "入驻载体+项目/企业+团队+批次/合同期；只认定入驻资格，不把 T08 资金或 G03 场地许可视为自动获批。",
  "ruleBindings": [
    {
      "id": "R001",
      "fields": [
        "F003",
        "F004",
        "F005"
      ],
      "materials": [
        "M001",
        "M033"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R002",
      "fields": [
        "F004",
        "F006"
      ],
      "materials": [
        "M001",
        "M033"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R003",
      "fields": [
        "F007",
        "F008",
        "F009"
      ],
      "materials": [
        "M002"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R004",
      "fields": [
        "F006",
        "F008",
        "F009",
        "F010"
      ],
      "materials": [
        "M002",
        "M033"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R005",
      "fields": [
        "F012",
        "F013",
        "F014"
      ],
      "materials": [
        "M003",
        "M032"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R006",
      "fields": [
        "F013",
        "F014"
      ],
      "materials": [
        "M003"
      ],
      "researchSources": [
        "SRC-009"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R007",
      "fields": [
        "F001",
        "F002",
        "F003",
        "F004",
        "F015"
      ],
      "materials": [
        "M001"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R008",
      "fields": [
        "F015",
        "F016",
        "F017",
        "F024"
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
      "id": "R009",
      "fields": [
        "F017",
        "F019"
      ],
      "materials": [
        "M006",
        "M007"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R010",
      "fields": [
        "F017",
        "F018"
      ],
      "materials": [
        "M006"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R011",
      "fields": [
        "F019",
        "F020",
        "F022"
      ],
      "materials": [
        "M007"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R012",
      "fields": [
        "F007",
        "F014",
        "F021"
      ],
      "materials": [
        "M007",
        "M008"
      ],
      "researchSources": [
        "SRC-008"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R013",
      "fields": [
        "F024"
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
      "id": "R014",
      "fields": [
        "F025"
      ],
      "materials": [
        "M005"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R015",
      "fields": [
        "F023"
      ],
      "materials": [
        "M009",
        "M010"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R016",
      "fields": [
        "F016",
        "F017",
        "F024"
      ],
      "materials": [
        "M004",
        "M010"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R017",
      "fields": [
        "F011",
        "F026"
      ],
      "materials": [
        "M011"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R018",
      "fields": [
        "F027"
      ],
      "materials": [
        "M012"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R019",
      "fields": [
        "F025",
        "F028"
      ],
      "materials": [
        "M005",
        "M013"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R020",
      "fields": [
        "F029"
      ],
      "materials": [
        "M014"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R021",
      "fields": [
        "F029",
        "F043"
      ],
      "materials": [
        "M015"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R022",
      "fields": [
        "F030"
      ],
      "materials": [
        "M016"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R023",
      "fields": [
        "F030",
        "F031",
        "F032"
      ],
      "materials": [
        "M017",
        "M018"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R024",
      "fields": [
        "F035"
      ],
      "materials": [
        "M019"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R025",
      "fields": [
        "F032",
        "F034"
      ],
      "materials": [
        "M020",
        "M021"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R026",
      "fields": [
        "F033"
      ],
      "materials": [
        "M020"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R027",
      "fields": [
        "F025",
        "F028"
      ],
      "materials": [
        "M005",
        "M022"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R028",
      "fields": [
        "F029",
        "F030",
        "F032"
      ],
      "materials": [
        "M017",
        "M022"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R029",
      "fields": [
        "F003",
        "F040"
      ],
      "materials": [
        "M001",
        "M023"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R030",
      "fields": [
        "F016",
        "F040"
      ],
      "materials": [
        "M023",
        "M024"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R031",
      "fields": [
        "F041"
      ],
      "materials": [
        "M025"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R032",
      "fields": [
        "F042"
      ],
      "materials": [
        "M026"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R033",
      "fields": [
        "F031",
        "F032",
        "F042"
      ],
      "materials": [
        "M017",
        "M026"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R034",
      "fields": [
        "F039",
        "F042"
      ],
      "materials": [
        "M027",
        "M028"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R035",
      "fields": [
        "F032",
        "F042"
      ],
      "materials": [
        "M029"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R036",
      "fields": [
        "F005",
        "F006",
        "F037"
      ],
      "materials": [
        "M030"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R037",
      "fields": [
        "F030",
        "F037",
        "F043"
      ],
      "materials": [
        "M031"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R038",
      "fields": [
        "F013",
        "F014",
        "F021"
      ],
      "materials": [
        "M003",
        "M032"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R039",
      "fields": [
        "F004",
        "F044"
      ],
      "materials": [
        "M033"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R040",
      "fields": [
        "F001",
        "F002",
        "F038",
        "F044"
      ],
      "materials": [
        "M034"
      ],
      "researchSources": [
        "SRC-009"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    }
  ]
} as const

export const template: ResearchTemplateVersion = {
  templateId: "S06-T07",
  version: 1,
  schemaVersion: 2,
  name: "学生创业项目孵化、入驻与团队资格审核",
  description: '本地研究模板／非校方正式模板。仅供材料分拣、事实核验、问题建议及人工复审；校本政策和决定权待确认。',
  catalogKind: 'reference',
  sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 正式研究稿 docs/design/review-agent/business-templates/R02/S06-T07.md；SHA-256 161896173fb560c3cd14d6444fbf41ef075dcb7692ba25541d971a16d72d604b；本地研究模板、非校方正式模板；所有政策细则待确认。",
  objectType: "project",
  displayName: { template: "学生创业项目孵化、入驻与团队资格审核" },
  fields: [
    { key: "F001", label: "id；案/全程", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "id；案/全程；incubation_case_id；后端生成、不可覆盖；P0；S" },
    { key: "F002", label: "id；项目/全程", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "id；项目/全程；稳定 project_id；后端项目主数据/去重登记；P1；S" },
    { key: "F003", label: "enum；项目/申报", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "enum；项目/申报；CLUB_STUDENT / PARK_ENTERPRISE；申报选择+当期承办确认；P0；S/H" },
    { key: "F004", label: "ref；批次/申报", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；批次/申报；program_id, cohort_id, policy_version, policy_effective_at, policy_verified；有权发布源；P1；S/H" },
    { key: "F005", label: "enum；案件/全部", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "enum；案件/全部；C01–C08 对应 application_stage，服务端状态机；P0；S" },
    { key: "F006", label: "ts；事件/全部", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ts；事件/全部；申请/决定/合同事件可信时间戳；后端审计；P1；S" },
    { key: "F007", label: "ref；申请人/申报", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；申请人/申报；person_id, verified_identity_level；校身份服务或有权核验；P2；S" },
    { key: "F008", label: "enum；申请人/申报", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "enum；申请人/申报；在校本科/专科/硕士/博士、毕业生、法定代表人、代理人；身份主数据；P2；C" },
    { key: "F009", label: "ref；申请人/申报/续驻", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；申请人/申报/续驻；学籍是否有效、学校、学段、身份断言有效期；学籍主数据；P2；C" },
    { key: "F010", label: "date；申请人/申报", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "date；申请人/申报；真实毕业日期/毕业届别；学籍/毕业权威来源；P2；C" },
    { key: "F011", label: "id；学院/俱乐部申报", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "id；学院/俱乐部申报；负责人归属学院、交件学院；校内组织主数据；P1；C" },
    { key: "F012", label: "id；团队/全程", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "id；团队/全程；team_id，关联项目，不与企业 ID 混同；P1；S" },
    { key: "F013", label: "list；团队/申报/变更", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "list；团队/申报/变更；成员 person_ref, role, join_at, leave_at, consent_event；本人和管理方留痕；P2；C" },
    { key: "F014", label: "ref；团队/全程", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "ref；团队/全程；当期负责人、变更生效版本、代表权限证明；P2；S/H" },
    { key: "F015", label: "str；项目/申报", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "str；项目/申报；项目名称与标准化别名，申请表/主数据；P1；S" },
    { key: "F016", label: "str；项目/申报", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "str；项目/申报；产品/服务及行业、预期活动性质，商业计划；P1；C" },
    { key: "F017", label: "enum；项目/申报", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "enum；项目/申报；PROTOTYPE_OPERATING、REGISTERED_ENTITY、UNKNOWN 等；材料+人工核；P1；C" },
    { key: "F018", label: "ref；项目/申报/进展", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；项目/申报/进展；未注册团队实际运行可核事实（订单/试用/服务/原型等），申请人证据；P1/P2；C" },
    { key: "F019", label: "enum；实体/申报/变更", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "enum；实体/申报/变更；UNREGISTERED / REGISTERED / DEREGISTERED / UNKNOWN，官方登记核验；P1；C" },
    { key: "F020", label: "str；实体/注册分支", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "str；实体/注册分支；统一社会信用代码；官方登记/证照；P1；C" },
    { key: "F021", label: "ref；实体/注册分支", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "ref；实体/注册分支；法定代表人/负责人/授权代理关联，官方登记+合法授权；P2；C" },
    { key: "F022", label: "date；实体/注册分支", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "date；实体/注册分支；注册成立日期、登记状态版本；官方登记；P1；C" },
    { key: "F023", label: "ref；项目/申报", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；项目/申报；技术/成果/知识产权来源及使用许可/争议状态；权利文件或 G06 已签断言；P1；C/H" },
    { key: "F024", label: "ref；项目/申报/变更", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；项目/申报/变更；商业/可行性计划材料版本，申请人提交；P1；C" },
    { key: "F025", label: "ref；项目/申报/续驻", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；项目/申报/续驻；答辩 PPT/评审展示材料版本，申请人提交；P1；C" },
    { key: "F026", label: "ref；审查/学院阶段", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "ref；审查/学院阶段；学院初审、推荐名单及签发者/时间，学院可信记录；P2；C" },
    { key: "F027", label: "ref；审查/中心阶段", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；审查/中心阶段；中心资格复审决定、具体资格结论，中心可信记录；P1；C" },
    { key: "F028", label: "ref；评议/现场阶段", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "ref；评议/现场阶段；专家名单权限、项目评议、问答、意见版本，管理方归档；P1；C/H" },
    { key: "F029", label: "ref；公示/终审前", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；公示/终审前；公示 ID、起止、范围、结果和异议处理状态，发布方可信记录；P2；C/H" },
    { key: "F030", label: "ref；终审/正式决定", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "ref；终审/正式决定；最终决定 ID、对象、理由、签发者、签章/时点/效期，后端可信决定；P1；C/H" },
    { key: "F031", label: "list；合同/签约阶段", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "list；合同/签约阶段；孵化协议、承诺、安全责任/物业文件的 ID、签约主体与生效日；P1/P2；C/H" },
    { key: "F032", label: "date/list；在孵/续驻", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "date/list；在孵/续驻；有效入孵起止、合同续期/变更历史，管理方签约记录；P1；C" },
    { key: "F033", label: "ref；在孵/续驻", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；在孵/续驻；进展报告、实施指标、运营事实及所属期，团队+管理方核验；P1；C" },
    { key: "F034", label: "ref；续驻", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；续驻；续驻请求与当前在孵 ID、计划期限，申请/管理方记录；P1；C" },
    { key: "F035", label: "ref；空间依赖", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；空间依赖；G03 场地许可/资源使用结果 ID、对象/效期；仅消费已签结果；P1；C" },
    { key: "F036", label: "ref；资金依赖", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；资金依赖；S06-T08/G07 批准/支付结果引用；只读、不能授予资金；P1；D" },
    { key: "F037", label: "ref；撤回/复核", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；撤回/复核；请求人、原决定、争点、受理、复核决定，后端事件；P2；C/H" },
    { key: "F038", label: "list；版本/全部", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "list；版本/全部；material_slot, evidence_id, hash, source_version, target_object_id；证据库；P1；S" },
    { key: "F039", label: "ref；风险/实施/退出", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；风险/实施/退出；违规、闲置、安全等现场核实事实与送达证明；管理方原件；P1/P2；C/H" },
    { key: "F040", label: "ref；入园/科技园", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；入园/科技园；用途/面积需求、可行性分析及运营计划；申请方；P1；C" },
    { key: "F041", label: "ref；科技园评议", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "ref；科技园评议；专家论证/必要考察的组织者、内容和时间，园区可信记录；P1；C/H" },
    { key: "F042", label: "ref；科技园决定", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "ref；科技园决定；园区批准/毕业/整改/退出决定签发主体和 ID，可信管理方；P1；C/H" },
    { key: "F043", label: "ref；异议/争点", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "ref；异议/争点；公示异议 ID、事实、处理决定和权限，公示管理服务；P2；C/H" },
    { key: "F044", label: "ref；审计/全部", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "ref；审计/全部；后端 Actor、权限、来源 snapshot、规则执行/结果版本、撤销链；P1；S" },
  ],
  materialSlots: [
    { id: "M001", name: "正式入孵申请表/可信线上申请事件；A", purpose: "正式入孵申请表/可信线上申请事件；A；C01/C02/C05 申报；F001–F006,F015；R001/R002/R007；SRC-001/002；批次表单未知先 POLICY_UNCONFIRMED；申请事件版本固定", requiredElements: ["正式入孵申请表/可信线上申请事件；A"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M002", name: "负责人身份、学生/毕业身份校验；优先 U 的脱敏断言；纸件仅授权兜底", purpose: "负责人身份、学生/毕业身份校验；优先 U 的脱敏断言；纸件仅授权兜底；申报/续驻身份重核；F007–F010；R003/R004；SRC-001/009；非本人、失效需人工核；不因没有身份证扫描件而否定可信学籍断言", requiredElements: ["负责人身份、学生/毕业身份校验；优先 U 的脱敏断言；纸件仅授权兜底"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M003", name: "团队名单、职务与本人确认/代表授权；A/U", purpose: "团队名单、职务与本人确认/代表授权；A/U；申报与变更；F012–F014；R005/R006；SRC-001/009；成员冲突指向本人及版本；不做无条件全员签名硬门槛", requiredElements: ["团队名单、职务与本人确认/代表授权；A/U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M004", name: "商业计划/项目计划书；A", purpose: "商业计划/项目计划书；A；俱乐部初申；F015–F017,F024；R008/R013；SRC-001；缺在有效批次为必需时补件；解析失败不可读", requiredElements: ["商业计划/项目计划书；A"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M005", name: "路演/项目介绍 PPT；A", purpose: "路演/项目介绍 PPT；A；初申及续驻现场评议前；F025；R014/R019/R027；SRC-001；不在草稿阶段把未来路演记录当缺件", requiredElements: ["路演/项目介绍 PPT；A"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M006", name: "未注册项目真实运作证据，可为原型/试用记录/合法交易片段；A、必要时 U", purpose: "未注册项目真实运作证据，可为原型/试用记录/合法交易片段；A、必要时 U；俱乐部初创申报；F017–F019；R009/R010；SRC-001；未注册有合法替代；不强制营业执照", requiredElements: ["未注册项目真实运作证据，可为原型/试用记录/合法交易片段；A、必要时 U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M007", name: "营业执照/官方电子证照及登记查询快照；R", purpose: "营业执照/官方电子证照及登记查询快照；R；注册实体分支；F019–F022；R009/R011/R012；SRC-001/008；以登记权威核实；企业截图单独不足以 PASS_FACT", requiredElements: ["营业执照/官方电子证照及登记查询快照；R"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M008", name: "公司负责人/代理人授权文件；R/A", purpose: "公司负责人/代理人授权文件；R/A；注册公司非本人代办时；F021；R012；SRC-008；无授权则要求合法证明/人工认定，不允许代签", requiredElements: ["公司负责人/代理人授权文件；R/A"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M009", name: "涉及已有成果时的成果来源、许可/权属证明或 G06 已签结论；A/G", purpose: "涉及已有成果时的成果来源、许可/权属证明或 G06 已签结论；A/G；有 IP 声称或争议时；F023；R015；SRC-002/003；不是所有创业项目必交专利证书；争议人工分流 G06", requiredElements: ["涉及已有成果时的成果来源、许可/权属证明或 G06 已签结论；A/G"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M010", name: "奖项/大创/试用其他佐证；A/G", purpose: "奖项/大创/试用其他佐证；A/G；申请人声称优先/优势事实时；F017,F023；R015/R016；SRC-001/012；只有声称才审；优先条款不是排他硬门槛", requiredElements: ["奖项/大创/试用其他佐证；A/G"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M011", name: "学院初审与推荐汇总/可信签名；U", purpose: "学院初审与推荐汇总/可信签名；U；俱乐部学院初审完成后；F026；R017；SRC-001；申请初交时 N/A，转送学院后缺才待办", requiredElements: ["学院初审与推荐汇总/可信签名；U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M012", name: "中心资格复审及审查记录；U", purpose: "中心资格复审及审查记录；U；中心复审后；F027；R018；SRC-001；初交不要求；无服务端签发不能以截图替代", requiredElements: ["中心资格复审及审查记录；U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M013", name: "专家现场评议、问答记录；U", purpose: "专家现场评议、问答记录；U；俱乐部专家评议后；F028；R019；SRC-001；是否评分及阈值依当期批次，不能编造", requiredElements: ["专家现场评议、问答记录；U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M014", name: "拟名单公示证据、时段/结果；U", purpose: "拟名单公示证据、时段/结果；U；终审前已进入公示阶段；F029；R020；SRC-001；公示前 N/A；时间/异议状态不明人工确认", requiredElements: ["拟名单公示证据、时段/结果；U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M015", name: "公示异议与调查处理意见；U", purpose: "公示异议与调查处理意见；U；有异议时；F043；R021；SRC-001；无异议则 N/A；有异议未处理不得输出无异议事实", requiredElements: ["公示异议与调查处理意见；U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M016", name: "有权最终入孵决定/名单版本；U", purpose: "有权最终入孵决定/名单版本；U；终审结束后；F030；R022；SRC-001；未到终审阶段 N/A；必须签发身份核实", requiredElements: ["有权最终入孵决定/名单版本；U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M017", name: "孵化/入园协议及签署页/生效信息；U/合同方", purpose: "孵化/入园协议及签署页/生效信息；U/合同方；入驻获批后签约；F031,F032；R023/R033；SRC-001/002/004；申请阶段不得预报缺；合同正文未知需人工核", requiredElements: ["孵化/入园协议及签署页/生效信息；U/合同方"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M018", name: "俱乐部入驻承诺、安全责任、物业规则签收/协议；U/合同方", purpose: "俱乐部入驻承诺、安全责任、物业规则签收/协议；U/合同方；俱乐部确定入驻后；F031；R023；SRC-001；2017 附件列名可核但内容未核，禁止套用旧条款", requiredElements: ["俱乐部入驻承诺、安全责任、物业规则签收/协议；U/合同方"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M019", name: "G03 场地使用许可/对应资源标识的已签决定引用；G", purpose: "G03 场地使用许可/对应资源标识的已签决定引用；G；开始实际占用或申请 G03 后；F035；R024；SRC-002；S06-T07 不审批场地，缺 G03 时只转待办，不反推入驻资格失败", requiredElements: ["G03 场地使用许可/对应资源标识的已签决定引用；G"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M020", name: "在孵进展报告、所属期间与核验；A/U", purpose: "在孵进展报告、所属期间与核验；A/U；C03/C04 实施考核、续驻；F033；R025/R026；SRC-001/002；首次申请 N/A；当期考核周期/格式待配置", requiredElements: ["在孵进展报告、所属期间与核验；A/U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M021", name: "续驻申请及有效既有入驻记录；A/U", purpose: "续驻申请及有效既有入驻记录；A/U；C03 续驻；F032,F034；R025；SRC-001；不凭旧纸件续驻；历史决定/合同绑定原 entry_run_id", requiredElements: ["续驻申请及有效既有入驻记录；A/U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M022", name: "续驻现场评议/答辩与公示/终审决定；U", purpose: "续驻现场评议/答辩与公示/终审决定；U；续驻评议至终审；F028–F030；R027/R028；SRC-001；未来意见按阶段生成；2017 PPT 权重不预置", requiredElements: ["续驻现场评议/答辩与公示/终审决定；U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M023", name: "科技园可行性分析（含指标、预算、进度）；A", purpose: "科技园可行性分析（含指标、预算、进度）；A；C05 科技园申请；F040；R029/R030；SRC-002/003；仅园区分支必核；旧提纲须现行复验", requiredElements: ["科技园可行性分析（含指标、预算、进度）；A"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M024", name: "科技园运营计划、项目/人员构成、拟用面积用途；A", purpose: "科技园运营计划、项目/人员构成、拟用面积用途；A；C05 科技园申请；F040；R030；SRC-002/003；只是需求字段，不是 G03 场地批准", requiredElements: ["科技园运营计划、项目/人员构成、拟用面积用途；A"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M025", name: "科技园专家论证/实地考察意见；U", purpose: "科技园专家论证/实地考察意见；U；园区评议后；F041；R031；SRC-002；申请初交 N/A，权威签发版本不可前端模拟", requiredElements: ["科技园专家论证/实地考察意见；U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M026", name: "科技园公司批准决定/有权授权凭证；U", purpose: "科技园公司批准决定/有权授权凭证；U；园区批准阶段；F042；R032；SRC-002；专家同意不等于公司批准", requiredElements: ["科技园公司批准决定/有权授权凭证；U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M027", name: "园区整改约谈纪要、通知及送达；U", purpose: "园区整改约谈纪要、通知及送达；U；C07 触发客观问题后；F039,F042；R034；SRC-002；只限科技园路径/当期适用，不能直接自动清退", requiredElements: ["园区整改约谈纪要、通知及送达；U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M028", name: "整改执行、复查、说明及申辩材料；A/U", purpose: "整改执行、复查、说明及申辩材料；A/U；C07 约谈后；F039；R034；SRC-002；阶段未触发 N/A；反证冲突转人工", requiredElements: ["整改执行、复查、说明及申辩材料；A/U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M029", name: "孵化毕业/育成、协议终止或退出决定；U", purpose: "孵化毕业/育成、协议终止或退出决定；U；C06/C07 收尾；F032,F042；R035；SRC-002；历史金额/年限只作历史提示，当前仍人工认定", requiredElements: ["孵化毕业/育成、协议终止或退出决定；U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M030", name: "申请撤回/终审后请求变更，身份/授权证明；A/U", purpose: "申请撤回/终审后请求变更，身份/授权证明；A/U；C08；F037；R036；SRC-001/002；决定前撤回与决定后撤销严格分开", requiredElements: ["申请撤回/终审后请求变更，身份/授权证明；A/U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M031", name: "复核/异议申请及新证据、受理/结论；A/U", purpose: "复核/异议申请及新证据、受理/结论；A/U；C08、有具体争点；F037,F043；R037；SRC-001/002；申诉路径及期限待当期确认，不能伪造复核结果", requiredElements: ["复核/异议申请及新证据、受理/结论；A/U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M032", name: "团队成员/法人/项目重大变更申报及授权；A/U/R", purpose: "团队成员/法人/项目重大变更申报及授权；A/U/R；C04；F013,F014,F021；R005/R038；SRC-001/008；保留旧版，必要时触发新状态审核，不覆盖原终审", requiredElements: ["团队成员/法人/项目重大变更申报及授权；A/U/R"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M033", name: "政策版本、批次公告、授权矩阵的有权发布快照；U", purpose: "政策版本、批次公告、授权矩阵的有权发布快照；U；全阶段制度校验；F004,F044；R001/R002/R039；SRC-001/002；当前缺口：无法取到则 POLICY_UNCONFIRMED，不是材料申请人缺件", requiredElements: ["政策版本、批次公告、授权矩阵的有权发布快照；U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M034", name: "证据清单/哈希/可信事件封套；系统生成", purpose: "证据清单/哈希/可信事件封套；系统生成；全阶段；F038,F044；R040；SRC-009；缺不可作为审结；包含对象与版本绑定", requiredElements: ["证据清单/哈希/可信事件封套；系统生成"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
  ],
  sections: [{
    id: 'research-review', name: '逐条事实核验与人工复审', order: 0, required: true,
    description: '每个 R 编号是独立可追踪的审核要求；即使语义核验得到事实也不等于政策合规或正式校方决定。',
    criteria: [
      { id: "R001", title: "全程；创建/阶段转移，F003,F004,F005", requirement: "全程；创建/阶段转移，F003,F004,F005；SRC-001/002，M001/M033：program_id 与分支、签发单位匹配且现行政策版本由有权机关确认→真；路由到错载体→CONFLICT；政策版本未确认→POLICY_UNCONFIRMED；案件管理员修路由；业务主管核现行制度", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F004","F005"], materialSlotIds: ["M001","M033"], researchSourceIds: ["SRC-001"] } },
      { id: "R002", title: "申报/续驻；F004,F006", requirement: "申报/续驻；F004,F006；SRC-001/002，M001/M033：批次可申请时间覆盖可信提交时间→真；已关闭/不属于该批次→人工确认下一批/资格，不直接自动拒绝；无当期公告→POLICY_UNCONFIRMED；批次承办人", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F004","F006"], materialSlotIds: ["M001","M033"], researchSourceIds: ["SRC-001"] } },
      { id: "R003", title: "俱乐部初申/续驻；F007–F009", requirement: "俱乐部初申/续驻；F007–F009；SRC-001/009，M002：可信校身份断言与申请人一致→真；明确不一致→CONFLICT；学籍服务不可用→SOURCE_UNAVAILABLE；必要件无法读→UNREADABLE；学籍主数据核验者/学院", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F007","F008","F009"], materialSlotIds: ["M002"], researchSourceIds: ["SRC-001"] } },
      { id: "R004", title: "俱乐部初申；在校/毕业分支，F008–F010,F006", requirement: "俱乐部初申；在校/毕业分支，F008–F010,F006；SRC-001，M002/M033：按该批次已确认的允许身份和毕业时间窗比较→真；超范围→资格人工审；只有 2017“毕业 5 年内”而无当期规则→POLICY_UNCONFIRMED；业务主管；不可把 2017 五年直接用于 2026", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F006","F008","F009","F010"], materialSlotIds: ["M002","M033"], researchSourceIds: ["SRC-001"] } },
      { id: "R005", title: "申报/成员变更；F012–F014", requirement: "申报/成员变更；F012–F014；SRC-001/009，M003/M032：团队、负责人、签约代表在有效版本上对应→真；存在两个互斥负责人或签名归属不同→CONFLICT；授权缺且本阶段要求→NEEDS_MATERIAL；负责人/成员及学院/运营方", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F012","F013","F014"], materialSlotIds: ["M003","M032"], researchSourceIds: ["SRC-001"] } },
      { id: "R006", title: "被列成员/使用个人信息；F013,F014", requirement: "被列成员/使用个人信息；F013,F014；SRC-009，M003：成员关系经本人或授权管理记录可追溯，个人信息有合法处理基础→真；冒名或不同意而继续声明其参与→CONFLICT/NEEDS_HUMAN_DECISION；来源不可验证→SOURCE_UNAVAILABLE；成员本人、隐私/管理人员", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F013","F014"], materialSlotIds: ["M003"], researchSourceIds: ["SRC-009"] } },
      { id: "R007", title: "创建或再次申请；F001,F002,F003,F004,F015", requirement: "创建或再次申请；F001,F002,F003,F004,F015；SRC-001/002，M001：同一 project_id+program_id+cohort_id 无互斥有效申请/决定→真；重复终审/双重入孵权利冲突→CONFLICT；主数据不可取→SOURCE_UNAVAILABLE；案件管理员，必要时业务主管", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F001","F002","F003","F004","F015"], materialSlotIds: ["M001"], researchSourceIds: ["SRC-001"] } },
      { id: "R008", title: "俱乐部初申；F015–F017,F024", requirement: "俱乐部初申；F015–F017,F024；SRC-001，M004：表中项目与计划书所述项目身份/版本一致→真；名称、负责人或核心标的相互矛盾→CONFLICT；缺本阶段计划→NEEDS_MATERIAL；申请人/学院", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F015","F016","F017","F024"], materialSlotIds: ["M004"], researchSourceIds: ["SRC-001"] } },
      { id: "R009", title: "俱乐部初申；F017,F019", requirement: "俱乐部初申；F017,F019；SRC-001，M006/M007：团队自报“未注册但实际运行”或“已注册”与外部材料证据一致→真；登记数据与声明冲突→CONFLICT；实体状态无可信来源→SOURCE_UNAVAILABLE；申请人/工商核验服务", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F017","F019"], materialSlotIds: ["M006","M007"], researchSourceIds: ["SRC-001"] } },
      { id: "R010", title: "仅 CLUB_STUDENT+UNREGISTERED 初申；F017,F018", requirement: "仅 CLUB_STUDENT+UNREGISTERED 初申；F017,F018；SRC-001，M006：可复核的原型/服务/运行记录属于当前项目→真；证明其实并未运行→事实争点转专家；上传少必要运行证据→NEEDS_MATERIAL；申请人补证、专家判断实质性", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F017","F018"], materialSlotIds: ["M006"], researchSourceIds: ["SRC-001"] } },
      { id: "R011", title: "注册分支；F019,F020,F022", requirement: "注册分支；F019,F020,F022；SRC-001/008，M007：官方登记存在、代码和设立时间与申请一致→真；代码对应另一主体/状态矛盾→CONFLICT；登记系统暂不可用→SOURCE_UNAVAILABLE；登记数据服务/注册实体负责人", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F019","F020","F022"], materialSlotIds: ["M007"], researchSourceIds: ["SRC-001"] } },
      { id: "R012", title: "注册分支或代理发起；F007,F014,F021", requirement: "注册分支或代理发起；F007,F014,F021；SRC-008，M007/M008：官方法定代表人或有效授权与操作人匹配→真；不匹配→CONFLICT；可补授权缺失→NEEDS_MATERIAL；法人/授权管理方", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F007","F014","F021"], materialSlotIds: ["M007","M008"], researchSourceIds: ["SRC-008"] } },
      { id: "R013", title: "俱乐部初申；F024", requirement: "俱乐部初申；F024；SRC-001，M004：当前必需的商业计划版本存在且结构可读→真；计划内容前后冲突→CONFLICT；缺/坏分 NEEDS_MATERIAL/UNREADABLE；申请人；商业价值不由该规则判断", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F024"], materialSlotIds: ["M004"], researchSourceIds: ["SRC-001"] } },
      { id: "R014", title: "进入俱乐部初申专家评议或续驻评议；F025", requirement: "进入俱乐部初申专家评议或续驻评议；F025；SRC-001，M005：该次路演项目 PPT 版本与项目相符、可展示→真；错项目→CONFLICT；缺/坏分缺件/不可读；申报初交且未到评议时 N/A；申请人/评议秘书", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F025"], materialSlotIds: ["M005"], researchSourceIds: ["SRC-001"] } },
      { id: "R015", title: "声称拥有知识产权、竞赛获奖或成果优势；F023", requirement: "声称拥有知识产权、竞赛获奖或成果优势；F023；SRC-001/002/003/012，M009/M010：权利/获奖断言可追溯相关有权机构或 G06/S06-T03 签发事实→真；权属争执→NEEDS_HUMAN_DECISION；无任何此类声称→N/A；G06/赛事实体核验者/专家；不做入孵必要硬条件", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F023"], materialSlotIds: ["M009","M010"], researchSourceIds: ["SRC-001"] } },
      { id: "R016", title: "孵化项目内容评价；F016,F017,F024", requirement: "孵化项目内容评价；F016,F017,F024；SRC-001/002/007，M004/M010：项目计划可读且专家存在对创新、价值、可行性独立评议的事项→仅事实真；市场前景是否优秀必须 NEEDS_HUMAN_DECISION；无已确认打分规则→POLICY_UNCONFIRMED；专家评议；模型不能给商业价值终分", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F016","F017","F024"], materialSlotIds: ["M004","M010"], researchSourceIds: ["SRC-001"] } },
      { id: "R017", title: "俱乐部学院审查完成后；F011,F026", requirement: "俱乐部学院审查完成后；F011,F026；SRC-001，M011：有权学院推荐记录对应本项目/版本→真；出现否认/签发不符→CONFLICT；申请初交阶段 N/A，进入中心复审仍无推荐则 SOURCE_UNAVAILABLE/按当期补正；学院承办/中心", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F011","F026"], materialSlotIds: ["M011"], researchSourceIds: ["SRC-001"] } },
      { id: "R018", title: "俱乐部中心复审后；F027", requirement: "俱乐部中心复审后；F027；SRC-001，M012：中心真实资格复审记录与项目/申请一致→真；前端伪造签章→CONFLICT；尚未进该阶段 N/A；签发来源不可用→SOURCE_UNAVAILABLE；中心有权复审者", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F027"], materialSlotIds: ["M012"], researchSourceIds: ["SRC-001"] } },
      { id: "R019", title: "俱乐部专家评议后；F025,F028", requirement: "俱乐部专家评议后；F025,F028；SRC-001，M005/M013：确有对该版本项目举行评议并归档意见→真；对象错误/评议未发生却声称已完成→CONFLICT；缺可信专家记录→SOURCE_UNAVAILABLE，质量结论留人工；专家组织者/业务主管", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F025","F028"], materialSlotIds: ["M005","M013"], researchSourceIds: ["SRC-001"] } },
      { id: "R020", title: "俱乐部拟入驻公示后；F029", requirement: "俱乐部拟入驻公示后；F029；SRC-001，M014：公示主体、对象、起止及发布来源可核→真；名单/时间矛盾→CONFLICT；未进入公示 N/A；期限参数未知→POLICY_UNCONFIRMED；公示承办人", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F029"], materialSlotIds: ["M014"], researchSourceIds: ["SRC-001"] } },
      { id: "R021", title: "有公示异议；F029,F043", requirement: "有公示异议；F029,F043；SRC-001，M015：存在异议时已由有权机构作出记录化处理并标注影响→真；异议未了却标无异议→CONFLICT；对异议真伪裁决→NEEDS_HUMAN_DECISION；无异议 N/A；受理/调查/终审机关", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F029","F043"], materialSlotIds: ["M015"], researchSourceIds: ["SRC-001"] } },
      { id: "R022", title: "俱乐部终审后；F030", requirement: "俱乐部终审后；F030；SRC-001，M016：学校当期有权终审者签决定、范围/项目/版本一致→真；仅有专家同意或名单截图→不成立、CONFLICT；签发角色现行性未知→POLICY_UNCONFIRMED；有权终审者/权限管理员", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F030"], materialSlotIds: ["M016"], researchSourceIds: ["SRC-001"] } },
      { id: "R023", title: "俱乐部已终审且入驻获准，签约阶段；F030–F032", requirement: "俱乐部已终审且入驻获准，签约阶段；F030–F032；SRC-001/004/005，M017/M018：要求的合同/承诺/安全/物业文本在终审之后由真实主体签收并生效→真；主体/期限错配→CONFLICT；合同文本/授权未核→POLICY_UNCONFIRMED；申请阶段 N/A；合同承办/法务/授权签署人", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F030","F031","F032"], materialSlotIds: ["M017","M018"], researchSourceIds: ["SRC-001"] } },
      { id: "R024", title: "即将实际占用空间；F035", requirement: "即将实际占用空间；F035；SRC-001/002，M019：已有 G03 有效许可且空间/期限/使用人匹配→真；无许可→待 G03 办理、不能作入孵资格否定；G03 服务不可用→SOURCE_UNAVAILABLE；G03 许可人；物理入驻执行者", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F035"], materialSlotIds: ["M019"], researchSourceIds: ["SRC-001"] } },
      { id: "R025", title: "C03 续驻申请；F032,F034", requirement: "C03 续驻申请；F032,F034；SRC-001，M020/M021：既有有效入驻 ID、续驻申请归属及当前运行项目一致→真；原协议/团队冲突→CONFLICT；无原决定数据→SOURCE_UNAVAILABLE；时限未核→POLICY_UNCONFIRMED；运营方/申请负责人", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F032","F034"], materialSlotIds: ["M020","M021"], researchSourceIds: ["SRC-001"] } },
      { id: "R026", title: "C03/C04 在孵进展；F033", requirement: "C03/C04 在孵进展；F033；SRC-001/002，M020：报告属于该项目和报告期，实施事实与可核附件一致→真；报告与现场记录冲突→CONFLICT；是否“合格”由当期标准与人判 NEEDS_HUMAN_DECISION；运营方/专家，缺件申请人", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F033"], materialSlotIds: ["M020"], researchSourceIds: ["SRC-001"] } },
      { id: "R027", title: "俱乐部续驻答辩后；F025,F028", requirement: "俱乐部续驻答辩后；F025,F028；SRC-001，M005/M022：有针对续驻事件的评议记录、申请及进展版本→真；把首入驻评议复用成续驻意见→CONFLICT；2017 PPT 20/50/30 权重仅历史，现行未核→POLICY_UNCONFIRMED；中心评议组织者", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F025","F028"], materialSlotIds: ["M005","M022"], researchSourceIds: ["SRC-001"] } },
      { id: "R028", title: "俱乐部续驻终审后；F029,F030,F032", requirement: "俱乐部续驻终审后；F029,F030,F032；SRC-001，M022/M017：续驻公示/有权终审/续签各独立事件存在并对象一致→事实真；把原入驻合同当新续签→CONFLICT；未进入终审阶段 N/A；有权续驻决定与合同管理人", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F029","F030","F032"], materialSlotIds: ["M017","M022"], researchSourceIds: ["SRC-001"] } },
      { id: "R029", title: "科技园初次企业入园；F003,F040", requirement: "科技园初次企业入园；F003,F040；SRC-002，M001/M023：园区申请指向有效入园支路、可行性报告可读→真；材料不对应项目→CONFLICT；当期主体规则不明→POLICY_UNCONFIRMED；科技园受理/申请人", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F040"], materialSlotIds: ["M001","M023"], researchSourceIds: ["SRC-002"] } },
      { id: "R030", title: "科技园受理评议前；F016,F040", requirement: "科技园受理评议前；F016,F040；SRC-002/003，M023/M024：运营计划明确业务、面积需求、使用功能、实施方案→真；用途与计划矛盾→CONFLICT；未提交当期确认必需件→NEEDS_MATERIAL；用途是否准入交专家；科技园受理/专家；面积许可 G03", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F016","F040"], materialSlotIds: ["M023","M024"], researchSourceIds: ["SRC-002"] } },
      { id: "R031", title: "科技园论证阶段结束；F041", requirement: "科技园论证阶段结束；F041；SRC-002，M025：科技园公司组织专家论证/必要考察的可信记录→真；仅提交自写“专家已认可”→CONFLICT；尚未到论证阶段 N/A；科技园公司/专家秘书", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F041"], materialSlotIds: ["M025"], researchSourceIds: ["SRC-002"] } },
      { id: "R032", title: "科技园批准阶段；F042", requirement: "科技园批准阶段；F042；SRC-002，M026：园区当期有权机构对该实体/项目出具批准决定→真；专家意见替代批准→CONFLICT；现行授权未知→POLICY_UNCONFIRMED；科技园有权批准人", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F042"], materialSlotIds: ["M026"], researchSourceIds: ["SRC-002"] } },
      { id: "R033", title: "科技园获批后签约；F031,F032,F042", requirement: "科技园获批后签约；F031,F032,F042；SRC-002/004/005，M017/M026：入园合同签约主体、决定及生效/期限匹配→真；只是“拟入园”没有合同不能称已入驻；合同条款未取得→POLICY_UNCONFIRMED；园区合同管理人/法务", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F031","F032","F042"], materialSlotIds: ["M017","M026"], researchSourceIds: ["SRC-002"] } },
      { id: "R034", title: "科技园历史清退风险触发或俱乐部另有现行规则；F039,F042", requirement: "科技园历史清退风险触发或俱乐部另有现行规则；F039,F042；SRC-002，M027/M028：客观问题、约谈送达、整改/复查链均绑定该企业与期限→仅这些事实真；事实冲突 CONFLICT；是否清退必须 NEEDS_HUMAN_DECISION；适用条款未核 POLICY_UNCONFIRMED；科技园有权机关、申辩/复核受理人", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F039","F042"], materialSlotIds: ["M027","M028"], researchSourceIds: ["SRC-002"] } },
      { id: "R035", title: "科技园毕业/育成/退出阶段；F032,F042", requirement: "科技园毕业/育成/退出阶段；F032,F042；SRC-002，M029：毕业/退出结论有权签发，依据与项目/合同匹配→真；只有满足历史指标没有签决→不成立；历史 3 年/收入 200 万等不能自动触发→POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；科技园有权决定人", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F032","F042"], materialSlotIds: ["M029"], researchSourceIds: ["SRC-002"] } },
      { id: "R036", title: "C08 撤回；F005,F006,F037", requirement: "C08 撤回；F005,F006,F037；SRC-001/002，M030：请求人身份与申请一致且尚未终审→可记录“撤回申请”事实；已终审则改派变更/撤销决定流程；伪造请求→CONFLICT；案件管理员/原决定机构", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F005","F006","F037"], materialSlotIds: ["M030"], researchSourceIds: ["SRC-001"] } },
      { id: "R037", title: "C08 复核/申诉；F030,F037,F043", requirement: "C08 复核/申诉；F030,F037,F043；SRC-001/002/009，M031：异议指向准确决定 ID、争点和新证据版本→收件事实真；期限/复核权或程序未知→POLICY_UNCONFIRMED；应否推翻原决定→NEEDS_HUMAN_DECISION；独立有权复核人，不得同模型自动复判替代", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F030","F037","F043"], materialSlotIds: ["M031"], researchSourceIds: ["SRC-001"] } },
      { id: "R038", title: "C04 重大变更；F013,F014,F021", requirement: "C04 重大变更；F013,F014,F021；SRC-001/008，M003/M032：成员/负责人/法人变更时间与授权、登记变更一致→真；仍用旧版代表签新合同→CONFLICT；是否须重议/备案→POLICY_UNCONFIRMED；新旧负责人/中心或园区/工商", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F013","F014","F021"], materialSlotIds: ["M003","M032"], researchSourceIds: ["SRC-001"] } },
      { id: "R039", title: "全程任何制度性门槛调用；F004,F044", requirement: "全程任何制度性门槛调用；F004,F044；SRC-001/002/005，M033：有权机构提供有效期内现行批次/规则及授权关系→真；版本冲突→CONFLICT；只有 2017 历史通知→POLICY_UNCONFIRMED，不得输出制度资格通过；政策管理员及校方权责人", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F004","F044"], materialSlotIds: ["M033"], researchSourceIds: ["SRC-001"] } },
      { id: "R040", title: "全程证据/结果提交；F001,F002,F038,F044", requirement: "全程证据/结果提交；F001,F002,F038,F044；SRC-009，M034：evidence_hash+version+target_project/team/entity+source_type 完整且未被撤销→真；串案/被替换/伪签发→CONFLICT；无法读字节→UNREADABLE；事件源不可用→SOURCE_UNAVAILABLE；V3 Main 可信执行者/证据维护者", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F001","F002","F038","F044"], materialSlotIds: ["M034"], researchSourceIds: ["SRC-009"] } },
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
  researchSource: { path: "docs/design/review-agent/business-templates/R02/S06-T07.md", sha256: "161896173fb560c3cd14d6444fbf41ef075dcb7692ba25541d971a16d72d604b" },
  status: 'draft',
  createdAt: '2026-10-24T00:00:00.000Z',
}

export default template

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
