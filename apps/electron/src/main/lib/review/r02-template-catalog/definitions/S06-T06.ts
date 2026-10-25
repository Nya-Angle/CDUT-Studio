/**
 * S06-T06｜课程实习、专业实习与毕业实习资格及成果认定
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
  "templateId": "S06-T06",
  "name": "课程实习、专业实习与毕业实习资格及成果认定",
  "sourcePath": "docs/design/review-agent/business-templates/R02/S06-T06.md",
  "sourceSha256": "700e59babed2064d29983ae1b11649030211cd993fafb5342acb4d5eacc5a9de",
  "officialSchoolTemplate": false,
  "policyEvidenceStatus": "UNCONFIRMED",
  "researchSourceStatus": "LIBRARY_FORMAL_RESEARCH_V1",
  "deduplicationBoundary": "学生+培养方案版本+课程实习任务实例+实际实习期；S06-T05 社会实践不等于专业课程实习，课程学分不重复认定。",
  "ruleBindings": [
    {
      "id": "R001",
      "fields": [
        "F002",
        "F003",
        "F045"
      ],
      "materials": [
        "M001"
      ],
      "researchSources": [
        "SRC-004",
        "SRC-009"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R002",
      "fields": [
        "F003",
        "F004"
      ],
      "materials": [
        "M001"
      ],
      "researchSources": [
        "SRC-002",
        "SRC-004"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R003",
      "fields": [
        "F004",
        "F005",
        "F006",
        "F009"
      ],
      "materials": [
        "M002"
      ],
      "researchSources": [
        "SRC-002",
        "SRC-003"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R004",
      "fields": [
        "F006",
        "F007",
        "F010"
      ],
      "materials": [
        "M002"
      ],
      "researchSources": [
        "SRC-001",
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R005",
      "fields": [
        "F011",
        "F036",
        "F043"
      ],
      "materials": [
        "M003"
      ],
      "researchSources": [
        "SRC-002",
        "SRC-006"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R006",
      "fields": [
        "F012",
        "F020"
      ],
      "materials": [
        "M004"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R007",
      "fields": [
        "F013",
        "F016",
        "F017",
        "F018"
      ],
      "materials": [
        "M004"
      ],
      "researchSources": [
        "SRC-001",
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R008",
      "fields": [
        "F015",
        "F016",
        "F018",
        "F022"
      ],
      "materials": [
        "M005"
      ],
      "researchSources": [
        "SRC-001",
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R009",
      "fields": [
        "F014"
      ],
      "materials": [
        "M006"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R010",
      "fields": [
        "F007",
        "F010",
        "F021",
        "F043"
      ],
      "materials": [
        "M005",
        "M007"
      ],
      "researchSources": [
        "SRC-001",
        "SRC-010"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R011",
      "fields": [
        "F015",
        "F018",
        "F021"
      ],
      "materials": [
        "M005",
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
        "F020",
        "F022",
        "F044"
      ],
      "materials": [
        "M008"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R013",
      "fields": [
        "F002",
        "F015",
        "F017",
        "F023"
      ],
      "materials": [
        "M009"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R014",
      "fields": [
        "F019",
        "F024"
      ],
      "materials": [
        "M010"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R015",
      "fields": [
        "F019",
        "F025",
        "F038"
      ],
      "materials": [
        "M011"
      ],
      "researchSources": [
        "SRC-001",
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R016",
      "fields": [
        "F017",
        "F026"
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
      "id": "R017",
      "fields": [
        "F016",
        "F019",
        "F038"
      ],
      "materials": [
        "M013"
      ],
      "researchSources": [
        "SRC-001",
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R018",
      "fields": [
        "F017",
        "F027"
      ],
      "materials": [
        "M014"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R019",
      "fields": [
        "F018",
        "F027",
        "F030"
      ],
      "materials": [
        "M014",
        "M017"
      ],
      "researchSources": [
        "SRC-001",
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R020",
      "fields": [
        "F027",
        "F028"
      ],
      "materials": [
        "M014",
        "M015"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R021",
      "fields": [
        "F011",
        "F029"
      ],
      "materials": [
        "M016"
      ],
      "researchSources": [
        "SRC-002",
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R022",
      "fields": [
        "F011",
        "F030"
      ],
      "materials": [
        "M017"
      ],
      "researchSources": [
        "SRC-002",
        "SRC-006"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R023",
      "fields": [
        "F015",
        "F017",
        "F031",
        "F033"
      ],
      "materials": [
        "M018"
      ],
      "researchSources": [
        "SRC-001",
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R024",
      "fields": [
        "F032",
        "F033",
        "F036"
      ],
      "materials": [
        "M003",
        "M019"
      ],
      "researchSources": [
        "SRC-001",
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R025",
      "fields": [
        "F011",
        "F034",
        "F036"
      ],
      "materials": [
        "M003",
        "M020"
      ],
      "researchSources": [
        "SRC-002",
        "SRC-003",
        "SRC-006"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R026",
      "fields": [
        "F014",
        "F034"
      ],
      "materials": [
        "M020"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R027",
      "fields": [
        "F006",
        "F035",
        "F044"
      ],
      "materials": [
        "M021",
        "M027"
      ],
      "researchSources": [
        "SRC-002",
        "SRC-004"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R028",
      "fields": [
        "F008",
        "F035",
        "F037"
      ],
      "materials": [
        "M021",
        "M022"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R029",
      "fields": [
        "F035",
        "F039",
        "F042"
      ],
      "materials": [
        "M023",
        "M027"
      ],
      "researchSources": [
        "SRC-004",
        "SRC-009"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R030",
      "fields": [
        "F008",
        "F040",
        "F044"
      ],
      "materials": [
        "M024"
      ],
      "researchSources": [
        "SRC-002",
        "SRC-009"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R031",
      "fields": [
        "F001",
        "F006",
        "F041",
        "F042"
      ],
      "materials": [
        "M025"
      ],
      "researchSources": [
        "SRC-001",
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R032",
      "fields": [
        "F045",
        "F046"
      ],
      "materials": [
        "M026"
      ],
      "researchSources": [
        "SRC-001",
        "SRC-009"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    }
  ]
} as const

export const template: ResearchTemplateVersion = {
  templateId: "S06-T06",
  version: 1,
  schemaVersion: 2,
  name: "课程实习、专业实习与毕业实习资格及成果认定",
  description: '本地研究模板／非校方正式模板。仅供材料分拣、事实核验、问题建议及人工复审；校本政策和决定权待确认。',
  catalogKind: 'reference',
  sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 正式研究稿 docs/design/review-agent/business-templates/R02/S06-T06.md；SHA-256 700e59babed2064d29983ae1b11649030211cd993fafb5342acb4d5eacc5a9de；本地研究模板、非校方正式模板；所有政策细则待确认。",
  objectType: "person",
  displayName: { template: "课程实习、专业实习与毕业实习资格及成果认定" },
  fields: [
    { key: "F001", label: "string，Case 全程", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，Case 全程；后端唯一 caseId，只读；S1/H" },
    { key: "F002", label: "string，Student 全程", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，Student 全程；校内身份服务 studentId，非 OCR 学号；S2/H" },
    { key: "F003", label: "enum，Student/路由", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "enum，Student/路由；本科/专科/研究生及在籍/休学等状态，带生效日；S2/H" },
    { key: "F004", label: "string，Student/准备", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，Student/准备；学院、专业、方向、年级的权威版本；S1/H" },
    { key: "F005", label: "string，Course/准备", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，Course/准备；培养方案/教学任务版本与适用入学年；S1/H" },
    { key: "F006", label: "string，InternshipUnit/准备", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，InternshipUnit/准备；校内实习课程/教学环节实例 ID，不是自由文本名称；S1/H" },
    { key: "F007", label: "enum，InternshipUnit/准备", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "enum，InternshipUnit/准备；认识/课程/专业/生产/综合/毕业/就业实习（对应本方案）；S1/H" },
    { key: "F008", label: "enum，Case 全程", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "enum，Case 全程；PREPARE/ACTIVE/ASSESS/RETAKE... 等服务端阶段；S1/H" },
    { key: "F009", label: "string，InternshipUnit/准备", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，InternshipUnit/准备；学年学期、批次或教学班；S1/H" },
    { key: "F010", label: "enum，Placement/申请", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "enum，Placement/申请；集中/分散、校内/校外；不得混同；S1/C" },
    { key: "F011", label: "string，Syllabus/准备", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，Syllabus/准备；审定实习大纲 ID/hash/生效版本；S1/H" },
    { key: "F012", label: "string，Plan/准备", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，Plan/准备；审定学期实习计划 ID/hash/审批版本；S1/H" },
    { key: "F013", label: "period，Plan/准备", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "period，Plan/准备；允许起止时间、周数/任务量按课程大纲；S1/H" },
    { key: "F014", label: "string，Staff/准备", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "string，Staff/准备；校内指导教师工号、授权角色与有效期；S1/H" },
    { key: "F015", label: "string，Placement/准备", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，Placement/准备；实习单位法定名称/可信统一社会信用代码或正规校内基地 ID；S1/C" },
    { key: "F016", label: "string，Placement/准备", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，Placement/准备；校外地点、具体岗位、接触风险的范围；S2/C" },
    { key: "F017", label: "period，Placement/准备", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "period，Placement/准备；实际安排起止时间与课程计划匹配；S1/C" },
    { key: "F018", label: "array，Placement/准备", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "array，Placement/准备；实际实习任务/培养目标/岗位要求；S1/C" },
    { key: "F019", label: "enum，Placement/准备", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "enum，Placement/准备；一般/高危/涉密/外出跨境风险分级，未知不能默认低风险；S3/H" },
    { key: "F020", label: "string，Approval/申请", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "string，Approval/申请；校方真实事前批准事件 ID/主体/时间/版本；S1/H，未签时为 L" },
    { key: "F021", label: "string，Distributed/申请", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，Distributed/申请；自选单位理由、适用例外和学生申请事实；S2/C" },
    { key: "F022", label: "enum，UnitReview/申请", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "enum，UnitReview/申请；学院对单位资质、岗位适配与安全条件的签发核验结论；S1/H" },
    { key: "F023", label: "string，Agreement/申请", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，Agreement/申请；学校-单位-学生三方实习协议 ID/签约状态/覆盖期间；S2/C" },
    { key: "F024", label: "enum，Training/开始前", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "enum，Training/开始前；学校与现场安全培训的完成/合格及时间，非自述；S3/H" },
    { key: "F025", label: "string，RiskApproval/开始前", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，RiskApproval/开始前；特种操作/危险活动 G04 批准引用及有效期；S3/C" },
    { key: "F026", label: "record，Insurance/开始前", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "record，Insurance/开始前；责任险、人身意外险覆盖记录及是否覆盖实习全过程；S2/H" },
    { key: "F027", label: "array，Process/实施", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "array，Process/实施；考勤、实际岗位、任务完成和学校联系记录；S2/L" },
    { key: "F028", label: "string，Leave/实施", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，Leave/实施；S04-T01 的正式请销假或补学决定引用；S2/C" },
    { key: "F029", label: "array，Diary/实施末", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "array，Diary/实施末；本人日记/笔记，日期序列、内容、版本；S2/L" },
    { key: "F030", label: "string，Report/验收", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，Report/验收；本人实习报告/成果 ID、课程目标对应、版本；S1/L" },
    { key: "F031", label: "record，UnitCertificate/验收", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "record，UnitCertificate/验收；实习单位证明含学生、任务、期间、签发者、签发渠道；S2/C" },
    { key: "F032", label: "record，UnitEvaluation/验收", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "record，UnitEvaluation/验收；企业/现场导师定性定量意见、签发者、日期；S2/C" },
    { key: "F033", label: "enum，Authenticity/验收", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "enum，Authenticity/验收；单位证据已核实/待核/冲突；不能凭公章图像自动“已核”；S2/H" },
    { key: "F034", label: "record，TutorReview/验收", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "record，TutorReview/验收；校内指导教师评阅、考核方式、评分依据和签发版本；S1/L" },
    { key: "F035", label: "record，Grade/成绩", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "record，Grade/成绩；校内成绩库实习成绩/课程 ID/签发时间/有效版本；S2/H，出分前 L" },
    { key: "F036", label: "string，Rubric/验收", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，Rubric/验收；有效大纲中成绩规则/权重/项目要求的可追踪版本；S1/H" },
    { key: "F037", label: "string，Retake/重做", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，Retake/重做；原不及格尝试及当期重实习安排决定；S2/C" },
    { key: "F038", label: "array，ExternalDecisions/全程", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "array，ExternalDecisions/全程；G03/G04/G05/G06/G07/S04/T01 独立决策与身份绑定；S1/C" },
    { key: "F039", label: "record，Objection/复核", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "record，Objection/复核；对哪个成绩/事实提出异议、理由、提交时点；S2/C" },
    { key: "F040", label: "record，Withdrawal/撤回", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "record，Withdrawal/撤回；请求人、撤回事由、目标状态、服务端受理记录；S2/C" },
    { key: "F041", label: "string，EvidenceVersion/全程", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，EvidenceVersion/全程；slotId+documentId+sha256+sourceVersion+uploadedAt；S1/H" },
    { key: "F042", label: "array，EventLog/全程", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "array，EventLog/全程；CAS 事件、操作人真实身份、时间、签名、决定版本；S2/H" },
    { key: "F043", label: "string，PolicyVersion/全程", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "string，PolicyVersion/全程；使用 SRC/审批大纲/学院办法的效力配置版本；S1/H" },
    { key: "F044", label: "enum，Decision/最终", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "enum，Decision/最终；学院批准/撤回、教师评定、教务成绩与复核的不同签发状态；S2/H" },
    { key: "F045", label: "record，Access/全程", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "record，Access/全程；校内权限令牌 scope、申请代理与材料访问授权；S3/H" },
    { key: "F046", label: "record，Confidentiality/全程", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "record，Confidentiality/全程；商业秘密/研究数据处理授权、最小披露与脱敏确认；S3/C" },
  ],
  materialSlots: [
    { id: "M001", name: "学生学籍/专业有效性；教务学籍记录 W，学生证 U 仅辅助", purpose: "学生学籍/专业有效性；教务学籍记录 W，学生证 U 仅辅助；P 全部；F002–F004; R001/R002；SRC-004；校内接口失联 SOURCE_UNAVAILABLE，不要求上传身份证代替签发学籍", requiredElements: ["学生学籍/专业有效性；教务学籍记录 W，学生证 U 仅辅助"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M002", name: "培养方案与课程任务实例；学院/教务 W", purpose: "培养方案与课程任务实例；学院/教务 W；P 全部；F005–F009; R003/R004；SRC-002/SRC-003；学校系统缺口先 H，未指定课程不判“实习不合格”", requiredElements: ["培养方案与课程任务实例；学院/教务 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M003", name: "经审定实习教学大纲、评分方法；学院 W 或签章文件 A", purpose: "经审定实习教学大纲、评分方法；学院 W 或签章文件 A；P 全部；F011/F036; R005/R025；SRC-002/SRC-006；记录版本与适用年级，未经审定 PDF 草稿 POLICY_UNCONFIRMED", requiredElements: ["经审定实习教学大纲、评分方法；学院 W 或签章文件 A"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M004", name: "已审定学期实习计划、起止/任务；学院 W", purpose: "已审定学期实习计划、起止/任务；学院 W；P 全部；F012/F013/F017/F018; R006/R007；SRC-002；无可信计划不可标获准开始", requiredElements: ["已审定学期实习计划、起止/任务；学院 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M005", name: "实习单位/基地审核信息；学院与单位 W，公开营业信息 U 仅辅助", purpose: "实习单位/基地审核信息；学院与单位 W，公开营业信息 U 仅辅助；P 外出、D 全部；F015/F016/F022; R008/R010；SRC-001/SRC-002；资质不可核 SOURCE_UNAVAILABLE 或人工，不根据截图自动合法化", requiredElements: ["实习单位/基地审核信息；学院与单位 W，公开营业信息 U 仅辅助"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M006", name: "校内指导教师任务分派；学院 W", purpose: "校内指导教师任务分派；学院 W；P 全部；F014; R009；SRC-002；学生不应被要求自己出具教师聘任审批", requiredElements: ["校内指导教师任务分派；学院 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M007", name: "分散实习申请与学生选择理由；学生 U/学校申请系统 W", purpose: "分散实习申请与学生选择理由；学生 U/学校申请系统 W；D 仅毕业/就业分散；F010/F021; R010/R011；SRC-001；集中无需；尚未申请时可补，非毕业例外不直接通过", requiredElements: ["分散实习申请与学生选择理由；学生 U/学校申请系统 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M008", name: "高校对分散实习的正式批准决定；学校 W", purpose: "高校对分散实习的正式批准决定；学校 W；D 完成后、启动前；F020/F022/F044; R012；SRC-001；待审核时不是缺学生材料，给有权人待办", requiredElements: ["高校对分散实习的正式批准决定；学校 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M009", name: "三方实习协议及各方同意/责任；学校和单位、学生 W/U+可信签署核验", purpose: "三方实习协议及各方同意/责任；学校和单位、学生 W/U+可信签署核验；P/D 校外实习启动前；F023; R013；SRC-001；签字未形成送相应签约角色；照片 OCR 不等于签署有效", requiredElements: ["三方实习协议及各方同意/责任；学校和单位、学生 W/U+可信签署核验"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M010", name: "实习安全教育与现场安全培训合格；学校/单位 W", purpose: "实习安全教育与现场安全培训合格；学校/单位 W；启动前；F019/F024; R014；SRC-001；培训未完成触发人工安全待办，不放行进场", requiredElements: ["实习安全教育与现场安全培训合格；学校/单位 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M011", name: "单位风险评估/防护及 G04 准入；学院/单位/G04 W", purpose: "单位风险评估/防护及 G04 准入；学院/单位/G04 W；P/D 高风险或专项操作；F019/F025; R015；SRC-001/SRC-002；危险等级未知先人工，不假定不适用", requiredElements: ["单位风险评估/防护及 G04 准入；学院/单位/G04 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M012", name: "保险责任及人身意外覆盖；学校/保险或单位 W", purpose: "保险责任及人身意外覆盖；学校/保险或单位 W；启动前；F026; R016；SRC-001；缺权威保险接口 SOURCE_UNAVAILABLE；保障责任由主管确认", requiredElements: ["保险责任及人身意外覆盖；学校/保险或单位 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M013", name: "出行/场地/跨境等外部决定；各 G W", purpose: "出行/场地/跨境等外部决定；各 G W；P/D 实际触发；F038; R017；SRC-001/SRC-002；外部门许可未生成单独待办，不能要求学生凭空补其审批章", requiredElements: ["出行/场地/跨境等外部决定；各 G W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M014", name: "实习考勤、任务执行/指导记录；指导教师及单位 W，学生 U 辅助", purpose: "实习考勤、任务执行/指导记录；指导教师及单位 W，学生 U 辅助；I 已开始；F027; R018/R019；SRC-002；过程记录冲突需单位/校内核对，非学生一方自证", requiredElements: ["实习考勤、任务执行/指导记录；指导教师及单位 W，学生 U 辅助"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M015", name: "校内请假、延期、补学决定；S04/T01 W", purpose: "校内请假、延期、补学决定；S04/T01 W；I 出现缺勤/变更；F028; R020；SRC-002；未请假留人工核事实；不得自动作纪律处分", requiredElements: ["校内请假、延期、补学决定；S04/T01 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M016", name: "本人实习日记/笔记；学生 U、导师收件 W", purpose: "本人实习日记/笔记；学生 U、导师收件 W；E 实习结束后；F029; R021；SRC-002/SRC-005；截止前 L，截止后缺件需补；真实“无日记”影响评分由教师确认", requiredElements: ["本人实习日记/笔记；学生 U、导师收件 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M017", name: "本人实习报告及实训成果；学生 U、导师收件 W", purpose: "本人实习报告及实训成果；学生 U、导师收件 W；E 实习结束后；F030; R022；SRC-002/SRC-006；个人技术秘密可交脱敏件，经导师核定；不可读保留原件版本", requiredElements: ["本人实习报告及实训成果；学生 U、导师收件 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M018", name: "实习单位在岗/期间证明；单位 W/U，校内统一实习则校内考勤 A", purpose: "实习单位在岗/期间证明；单位 W/U，校内统一实习则校内考勤 A；E 校外或大纲指定；F031/F033; R023；SRC-001/SRC-002；不假定所有集中校内实习也必须要“公司公章”", requiredElements: ["实习单位在岗/期间证明；单位 W/U，校内统一实习则校内考勤 A"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M019", name: "单位/企业导师评价；单位 W/U，若大纲明确才计分", purpose: "单位/企业导师评价；单位 W/U，若大纲明确才计分；E 条件；F032/F033; R024；SRC-001/SRC-002；单位缺评价≠默认零分；大纲未要求则 N/A", requiredElements: ["单位/企业导师评价；单位 W/U，若大纲明确才计分"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M020", name: "校内导师评阅/考核依据；指导教师 W", purpose: "校内导师评阅/考核依据；指导教师 W；E 全部；F034/F036; R025/R026；SRC-002；学生无权替老师补签；未评定 NEEDS_HUMAN_DECISION", requiredElements: ["校内导师评阅/考核依据；指导教师 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M021", name: "教务成绩登记/最终有效成绩；教务 W", purpose: "教务成绩登记/最终有效成绩；教务 W；E 成绩已签后；F035/F044; R027；SRC-002/SRC-004；成绩未出 L；不能用实习单位评价代替校内成绩", requiredElements: ["教务成绩登记/最终有效成绩；教务 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M022", name: "重实习资格/安排和新 attempt；教务/学院 W", purpose: "重实习资格/安排和新 attempt；教务/学院 W；X 不及格后；F037; R028；SRC-002；仅原成绩不足以自动准许一个新时间和班次", requiredElements: ["重实习资格/安排和新 attempt；教务/学院 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M023", name: "学生成绩异议/证据与正式复核结论；学生 U+S02/教务 W", purpose: "学生成绩异议/证据与正式复核结论；学生 U+S02/教务 W；X 复核；F039/F035/F042; R029；SRC-009/SRC-004；期限与办理层级未核时人工受理，不自动改分", requiredElements: ["学生成绩异议/证据与正式复核结论；学生 U+S02/教务 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M024", name: "撤回请求与有权受理事件；学生 U+学院 W", purpose: "撤回请求与有权受理事件；学生 U+学院 W；X 撤回；F040/F042; R030；SRC-002；事后正式成绩不可由撤回单删除", requiredElements: ["撤回请求与有权受理事件；学生 U+学院 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M025", name: "材料变更说明/新版本及签发验证；上传人/原签发人 W/U", purpose: "材料变更说明/新版本及签发验证；上传人/原签发人 W/U；X 补件或冲突；F041/F042; R031；SRC-001/SRC-002；旧版留证不可覆盖；不可读只标这一版不可读", requiredElements: ["材料变更说明/新版本及签发验证；上传人/原签发人 W/U"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M026", name: "权限与保密核查/材料访问授权；可信服务、权利人 W", purpose: "权限与保密核查/材料访问授权；可信服务、权利人 W；全程涉 S3；F045/F046; R032；SRC-001/SRC-009；无权访问敏感原件不得 OCR/外发，转授权审核", requiredElements: ["权限与保密核查/材料访问授权；可信服务、权利人 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M027", name: "官方成绩更正或复核后新记录；T01/S02/教务 W", purpose: "官方成绩更正或复核后新记录；T01/S02/教务 W；X 复核已签后；F035/F044; R027/R029；SRC-004/SRC-009；没有后端新版本仍保持原成绩，不能用学生异议文字替代", requiredElements: ["官方成绩更正或复核后新记录；T01/S02/教务 W"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
  ],
  sections: [{
    id: 'research-review', name: '逐条事实核验与人工复审', order: 0, required: true,
    description: '每个 R 编号是独立可追踪的审核要求；即使语义核验得到事实也不等于政策合规或正式校方决定。',
    criteria: [
      { id: "R001", title: "学生身份与当前申请人匹配", requirement: "学生身份与当前申请人匹配；P，所有；F002/F003/F045；M001；SRC-004/SRC-009；可信学籍 ID 与登录主体/合法代理相同 → PASS；他人材料或不合法代理 → CONFLICT，H:学院身份管理员；身份服务不可用 → SOURCE_UNAVAILABLE/W:身份服务；无权限→ H:权限管理员", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F002","F003","F045"], materialSlotIds: ["M001"], researchSourceIds: ["SRC-004","SRC-009"] } },
      { id: "R002", title: "学段与在读状态允许参加本教学任务", requirement: "学段与在读状态允许参加本教学任务；P，本/专及研究生条件；F003/F004；M001；SRC-002/SRC-004；有效在籍与课程身份一致 → PASS；休学/退学等与在读任务抵触 → CONFLICT/H:教务；状态未知 → SOURCE_UNAVAILABLE；研究生适用规则未取得 → POLICY_UNCONFIRMED/H:研究生院", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F004"], materialSlotIds: ["M001"], researchSourceIds: ["SRC-002","SRC-004"] } },
      { id: "R003", title: "该学生的培养方案包含此实习实例", requirement: "该学生的培养方案包含此实习实例；P，全部；F004–F006/F009；M002；SRC-002/SRC-003；培养方案版与任务实例/学年匹配 → PASS；错专业/错年级/另门实习 → CONFLICT/H:学院教学秘书；无权威课表 → SOURCE_UNAVAILABLE/W:教务；学生只上传课表截图不单独定 PASS", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F004","F005","F006","F009"], materialSlotIds: ["M002"], researchSourceIds: ["SRC-002","SRC-003"] } },
      { id: "R004", title: "课程实习类别与申请动作相符", requirement: "课程实习类别与申请动作相符；路由，全部；F006/F007/F010；M002；SRC-002/SRC-001；实习课程类型归属清楚且不属于纯工作合同 → PASS；纯暑期兼职、志愿活动冒名报学分 → NOT_APPLICABLE 并转 S07/S06-T05；专业解释歧义 → POLICY_UNCONFIRMED/H:专业负责人", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F006","F007","F010"], materialSlotIds: ["M002"], researchSourceIds: ["SRC-001","SRC-002"] } },
      { id: "R005", title: "具体课程有经审定大纲及成绩标准", requirement: "具体课程有经审定大纲及成绩标准；P，全部；F011/F036/F043；M003；SRC-002/SRC-006；大纲版含目标、项目、考核口径，且签发适用 → PASS；仅空白格式/网上借来大纲 → CONFLICT/H:学院；版本/生效学年未核 → POLICY_UNCONFIRMED/H:教务；无法调档 → SOURCE_UNAVAILABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F011","F036","F043"], materialSlotIds: ["M003"], researchSourceIds: ["SRC-002","SRC-006"] } },
      { id: "R006", title: "实习计划经学院按权限审定备案", requirement: "实习计划经学院按权限审定备案；P，全部；F012/F020；M004；SRC-002；服务端计划批准与教学任务绑定 → PASS；学生擅改日期/教师草稿冒充批准 → CONFLICT/H:学院；计划尚在审批 → NEEDS_HUMAN_DECISION/H:学院；档案接口断联→ SOURCE_UNAVAILABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F012","F020"], materialSlotIds: ["M004"], researchSourceIds: ["SRC-002"] } },
      { id: "R007", title: "实习时间、地点与任务符合有效计划", requirement: "实习时间、地点与任务符合有效计划；P/D/变更，全部；F013/F016–F018；M004；SRC-002/SRC-001；安排落在大纲/批准计划允许区间 → PASS；校外自找单位日期、岗位明显不合 → CONFLICT/H:专业负责人；需要调整计划却无正式修订 → NEEDS_HUMAN_DECISION/H:T01-T09/学院", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F013","F016","F017","F018"], materialSlotIds: ["M004"], researchSourceIds: ["SRC-001","SRC-002"] } },
      { id: "R008", title: "实习单位/基地经学院核查专业适配与资质", requirement: "实习单位/基地经学院核查专业适配与资质；P，校外及单位型；F015/F016/F018/F022；M005；SRC-001/SRC-002；学院可信核验单位并满足任务条件 → PASS；单位不存在/岗位明显不符 → CONFLICT/H:学院；无核验、只有营业执照照片 → NEEDS_HUMAN_DECISION/H:学院；权威查询断联→ SOURCE_UNAVAILABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F015","F016","F018","F022"], materialSlotIds: ["M005"], researchSourceIds: ["SRC-001","SRC-002"] } },
      { id: "R009", title: "校内指导教师已被分派且资格有效", requirement: "校内指导教师已被分派且资格有效；P，全部；F014；M006；SRC-002；教学任务与教师服务端授权一致 → PASS；无指导教师或伪造他人签名 → CONFLICT/H:学院；学院未派任务 → NEEDS_HUMAN_DECISION/H:学院，学生不补教师授权", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F014"], materialSlotIds: ["M006"], researchSourceIds: ["SRC-002"] } },
      { id: "R010", title: "分散实习情形符合 2026 适用范围", requirement: "分散实习情形符合 2026 适用范围；D，分散；F007/F010/F021/F043；M007/M005；SRC-001/SRC-010；毕业/就业实习分散且申请校方审核 → PASS_FACT（仅情形符合）；普通认识/课程实习未经有效例外自行分散 → POLICY_UNCONFIRMED/H:教务，禁止自动许可；课程类别或例外政策不明 → POLICY_UNCONFIRMED/H:教务；集中 → N/A", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F007","F010","F021","F043"], materialSlotIds: ["M005","M007"], researchSourceIds: ["SRC-001","SRC-010"] } },
      { id: "R011", title: "学生分散选择和岗位内容可核对", requirement: "学生分散选择和岗位内容可核对；D，获准申请者；F021/F015/F018；M007/M005；SRC-001；自选申请对象与单位核验信息一致 → PASS；自述实习单位与学院核查不符 → CONFLICT/H:学院；学生尚未提交申请 → NEEDS_MATERIAL/E:本人；单位内容待学院审核 → NEEDS_HUMAN_DECISION", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F015","F018","F021"], materialSlotIds: ["M005","M007"], researchSourceIds: ["SRC-001"] } },
      { id: "R012", title: "分散实习有高校批准才允许开始", requirement: "分散实习有高校批准才允许开始；D 结束/实习开始前；F020/F022/F044；M008；SRC-001；签发身份、范围、日期有效的校方事件 → PASS；未批准却声称“已经批准” → CONFLICT/H:学院；审批进行中 → NEEDS_HUMAN_DECISION/H:有权签发者；接口失联→ SOURCE_UNAVAILABLE，绝不默认批准", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F020","F022","F044"], materialSlotIds: ["M008"], researchSourceIds: ["SRC-001"] } },
      { id: "R013", title: "三方实习协议覆盖本次人、单位和期间", requirement: "三方实习协议覆盖本次人、单位和期间；P/D，涉及实习单位的在岗实习；F002/F015/F017/F023；M009；SRC-001；学校、单位、学生三方均有可信签署与期间匹配 → PASS；签的是就业劳动合同/只有公司单方盖章 → CONFLICT/H:学院；未发签约/有一方未签 → NEEDS_HUMAN_DECISION/H:相应签约方；纯校内无外部单位的协议适用由教务解释，暂 POLICY_UNCONFIRMED", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F002","F015","F017","F023"], materialSlotIds: ["M009"], researchSourceIds: ["SRC-001"] } },
      { id: "R014", title: "入场前所需安全培训已合格", requirement: "入场前所需安全培训已合格；P/D 入场前，高风险更严；F019/F024；M010；SRC-001；学校和实习现场适用安全教育、培训合格记录可核 → PASS；记录确认培训不合格仍要求进场 → CONFLICT/H:安全主管；培训未安排→ NEEDS_HUMAN_DECISION/H:学校/实习单位；外部记录断联→ SOURCE_UNAVAILABLE；禁止入场", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F019","F024"], materialSlotIds: ["M010"], researchSourceIds: ["SRC-001"] } },
      { id: "R015", title: "高风险/特种操作的准入决定有效", requirement: "高风险/特种操作的准入决定有效；P/D，条件风险；F019/F025/F038；M011；SRC-001/SRC-002；可信风险分级、必要防护及 G04 批准已生效 → PASS；高风险作业未经许可 → CONFLICT/H:安全主管，禁止执行；风险等级未知→ NEEDS_HUMAN_DECISION/H:学院安全；实际一般岗位且已核不触发 → N/A", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F019","F025","F038"], materialSlotIds: ["M011"], researchSourceIds: ["SRC-001","SRC-002"] } },
      { id: "R016", title: "实习保障覆盖本次全过程", requirement: "实习保障覆盖本次全过程；P/D 校外；F017/F026；M012；SRC-001；可核责任险与意外险覆盖期间/对象及校方保障处理 → PASS；明确无必要保障且拟开始 → NEEDS_HUMAN_DECISION/H:学院保障责任人；保单接口不可用→ SOURCE_UNAVAILABLE/W:保险管理；未确认不得认为有保险；不对学生臆定保费", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F017","F026"], materialSlotIds: ["M012"], researchSourceIds: ["SRC-001"] } },
      { id: "R017", title: "触发的外部出行/场地/安全决定与任务匹配", requirement: "触发的外部出行/场地/安全决定与任务匹配；P/D，按事项；F016/F019/F038；M013；SRC-001/SRC-002；G03/G04/G05 已签决定的对象/版本/有效期匹配 → PASS；已签决定撤销或适用其他团体 → CONFLICT/H:外项主管；独立申请仍在途→ NEEDS_HUMAN_DECISION/H:各 G；不触发→ N/A", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F016","F019","F038"], materialSlotIds: ["M013"], researchSourceIds: ["SRC-001","SRC-002"] } },
      { id: "R018", title: "实施期考勤与实际参加事实有依据", requirement: "实施期考勤与实际参加事实有依据；I/结束，全部；F027/F017；M014；SRC-002；受校内导师/单位可信记录支持的参与日程 → PASS；单位和学生考勤对同一天相反 → CONFLICT/H:导师与单位；尚在未来时段→ N/A；记录由单位持有但断联→ SOURCE_UNAVAILABLE；已过节点无学生补充日志→ NEEDS_MATERIAL", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F017","F027"], materialSlotIds: ["M014"], researchSourceIds: ["SRC-002"] } },
      { id: "R019", title: "已到期实习任务按大纲完成且可核", requirement: "已到期实习任务按大纲完成且可核；I/E，全部；F018/F027/F030；M014/M017；SRC-002/SRC-001；带证据的工作内容对应课程目标 → PASS_FACT（不是评分）；纯行政打工与要求专业操作不符 → CONFLICT/H:指导教师；大纲任务细则缺失→ POLICY_UNCONFIRMED/H:专业负责人；尚未结束→ N/A", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F018","F027","F030"], materialSlotIds: ["M014","M017"], researchSourceIds: ["SRC-001","SRC-002"] } },
      { id: "R020", title: "缺勤/中断具有对应校内请假及补学处理", requirement: "缺勤/中断具有对应校内请假及补学处理；I 出现缺勤才触发；F027/F028；M014/M015；SRC-002；缺勤时间与可信请假/补学决定一致 → PASS；学生上传聊天截图说“老师口头准假”与系统相反 → CONFLICT/H:S04/学院；请假未受理→ NEEDS_HUMAN_DECISION/H:学院/S04；无缺勤→ N/A；不自动处罚", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F027","F028"], materialSlotIds: ["M014","M015"], researchSourceIds: ["SRC-002"] } },
      { id: "R021", title: "到达成果截止时日记按要求提交", requirement: "到达成果截止时日记按要求提交；E，全部；F029/F011；M016；SRC-002/SRC-005；日记归本学生本次任务、日期可读、校内已收件 → PASS；日记明显属于别的课程或同学 → CONFLICT/H:导师；未到截止→ N/A；到期未有可用记录→ NEEDS_MATERIAL/E:学生；损坏→ UNREADABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F011","F029"], materialSlotIds: ["M016"], researchSourceIds: ["SRC-002","SRC-005"] } },
      { id: "R022", title: "到达成果截止时实习报告按大纲提交", requirement: "到达成果截止时实习报告按大纲提交；E，全部；F030/F011；M017；SRC-002/SRC-006；对应正确 attempt 的可读报告/合规脱敏替代 → PASS；拿毕业论文/就业协议充作报告或归属他人 → CONFLICT/H:导师；未到截止→ N/A；逾期缺件→ NEEDS_MATERIAL/E:学生；破损→ UNREADABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F011","F030"], materialSlotIds: ["M017"], researchSourceIds: ["SRC-002","SRC-006"] } },
      { id: "R023", title: "单位在岗证明可确证身份、期间与任务", requirement: "单位在岗证明可确证身份、期间与任务；E，校外且课程要求单位证据；F031/F033/F015/F017；M018；SRC-001/SRC-002；可信单位渠道确证在岗身份及日期 → PASS；证明日期/单位与批准记录矛盾 → CONFLICT/H:单位和学院；签章真实性未核→ NEEDS_HUMAN_DECISION/H:学院；未要求单位证据且校内记录足够 → N/A", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F015","F017","F031","F033"], materialSlotIds: ["M018"], researchSourceIds: ["SRC-001","SRC-002"] } },
      { id: "R024", title: "单位评价的证据归属及使用方式符合大纲", requirement: "单位评价的证据归属及使用方式符合大纲；E，要求单位评价的课程；F032/F033/F036；M019/M003；SRC-001/SRC-002；单位评价可信且确为该课程规定的评价要素 → PASS；实习单位给“100分”而大纲只允许导师考核，不能据此强行成绩通过 → CONFLICT/H:指导教师；评价未形成且截止未到→ N/A；已到且应由单位签发→ NEEDS_HUMAN_DECISION/H:单位；大纲未要求→ N/A", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F032","F033","F036"], materialSlotIds: ["M003","M019"], researchSourceIds: ["SRC-001","SRC-002"] } },
      { id: "R025", title: "校内评分标准与本课程大纲版本一致", requirement: "校内评分标准与本课程大纲版本一致；E，全部；F011/F034/F036；M003/M020；SRC-002/SRC-003/SRC-006；评阅使用本专业课程批准评分标准 → PASS；复制别院评分权重、凭公司评价改学分 → CONFLICT/H:导师/教务；本年具体大纲未核→ POLICY_UNCONFIRMED/H:专业负责人", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F011","F034","F036"], materialSlotIds: ["M003","M020"], researchSourceIds: ["SRC-002","SRC-003","SRC-006"] } },
      { id: "R026", title: "指导教师已真实形成实习评阅/考核", requirement: "指导教师已真实形成实习评阅/考核；E，全部；F014/F034；M020；SRC-002；可信教师签发的评价记录和考核版本可核 → PASS；假评语/伪造教师身份 → CONFLICT/H:教务；教师未评定→ NEEDS_HUMAN_DECISION/H:导师；不能因学生材料齐全自动给分", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F014","F034"], materialSlotIds: ["M020"], researchSourceIds: ["SRC-002"] } },
      { id: "R027", title: "官方成绩与本次课程/尝试/有效版本对应", requirement: "官方成绩与本次课程/尝试/有效版本对应；E，成绩已签后；F006/F035/F044；M021/M027；SRC-002/SRC-004；教务成绩版本绑定本次课程与学生 → PASS；后台成绩与导出单不符、或用原 attempt 覆盖重修 attempt → CONFLICT/H:教务；未出分→ N/A；成绩服务断联→ SOURCE_UNAVAILABLE；待更正→ NEEDS_HUMAN_DECISION/H:T01/S02/教务", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F006","F035","F044"], materialSlotIds: ["M021","M027"], researchSourceIds: ["SRC-002","SRC-004"] } },
      { id: "R028", title: "重实习仅在正式不及格及新安排后开始", requirement: "重实习仅在正式不及格及新安排后开始；X 重修；F035/F037/F008；M022/M021；SRC-002；原成绩不及格及下一次教学安排/批准均可信 → PASS（允许流转审批）；使用原通过成绩申请补修或自行安排私企补实习 → CONFLICT/H:学院；新学年安排、特殊例外未公布→ POLICY_UNCONFIRMED/H:教务；未启动重修→ N/A", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F008","F035","F037"], materialSlotIds: ["M021","M022"], researchSourceIds: ["SRC-002"] } },
      { id: "R029", title: "实习成绩异议有目标、资格及正式复核通道", requirement: "实习成绩异议有目标、资格及正式复核通道；X 复核；F039/F035/F042；M023/M027；SRC-004/SRC-009；申请关联正式成绩及可信受理事件 → PASS_FACT（受理事实）；非本人成绩、重复签发结果与现行有效版本冲突 → CONFLICT/H:S02/教务；时限/层级无当前文件→ POLICY_UNCONFIRMED/H:教务；正式复核结果尚未签发→ NEEDS_HUMAN_DECISION，绝不改分", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F035","F039","F042"], materialSlotIds: ["M023","M027"], researchSourceIds: ["SRC-004","SRC-009"] } },
      { id: "R030", title: "撤回请求与案例状态允许的处理相符", requirement: "撤回请求与案例状态允许的处理相符；X 撤回；F040/F008/F044；M024；SRC-002/SRC-009；有权受理撤回且目标仅是未决申请 → PASS_FACT（请求有效）；要求删除已签成绩/掩盖已实施记录 → NEEDS_HUMAN_DECISION/H:教务，不直接删除；受理权/撤回期限不明→ POLICY_UNCONFIRMED/H:学院；无撤回请求→ N/A", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F008","F040","F044"], materialSlotIds: ["M024"], researchSourceIds: ["SRC-002","SRC-009"] } },
      { id: "R031", title: "更新证据版本与目标对象一致且旧结论已作废", requirement: "更新证据版本与目标对象一致且旧结论已作废；补件/重审；F001/F006/F041/F042；M025；SRC-002/SRC-001；hash/sourceVersion/owner/attempt 匹配，受影响 check 重跑 → PASS；新件来自别的 attempt 或旧结论仍被沿用 → CONFLICT/H:系统管理员；上传完成但不可读→ UNREADABLE/E:提交人；原签发接口不可用→ SOURCE_UNAVAILABLE/W:签发源", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F001","F006","F041","F042"], materialSlotIds: ["M025"], researchSourceIds: ["SRC-001","SRC-002"] } },
      { id: "R032", title: "敏感材料访问与保密范围有有效授权", requirement: "敏感材料访问与保密范围有有效授权；全程 S3；F045/F046；M026；SRC-001/SRC-009；可信服务证明用途和主体合法且最小化处理 → PASS_FACT；未授权模型上传企业技术机密或别人成绩 → NEEDS_HUMAN_DECISION/H:数据管理员并停止处理；未取得授权→ NEEDS_HUMAN_DECISION；不涉及敏感原件→ N/A", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F045","F046"], materialSlotIds: ["M026"], researchSourceIds: ["SRC-001","SRC-009"] } },
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
  researchSource: { path: "docs/design/review-agent/business-templates/R02/S06-T06.md", sha256: "700e59babed2064d29983ae1b11649030211cd993fafb5342acb4d5eacc5a9de" },
  status: 'draft',
  createdAt: '2026-10-24T00:00:00.000Z',
}

export default template

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
