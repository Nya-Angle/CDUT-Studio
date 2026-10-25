import type { TemplateVersion } from '@profer/shared'
import { validateTemplate } from '../../template-store'

export interface R02CriterionEvidenceMetadata { sectionId: string; criterionId: string; srcIds: string[]; evidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED' }
export interface R02Metadata {
  templateId: string; name: string; sourceDocumentPath: string; sourceDocumentSha256: string
  originalSourceDocumentPath: string; originalSourceSha256: string; manifestSha256: string; manifestHashCheck: boolean
  officialSchoolTemplate: false; researchDate: string; policyEvidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
  sourceEvidence: Array<{ srcId: string; evidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'; title: string }>
  criteria: R02CriterionEvidenceMetadata[]
}

export const templateVersion: TemplateVersion = {
  templateId: "S08-T05", version: 1, schemaVersion: 2, name: "研究生科研成果、学术活动及学位申请成果要求认定",
  description: "本地研究模板 · 非校方正式模板。研究生科研成果、学术活动及学位申请成果要求认定；仅供本地材料核验、证据覆盖检查和人工审阅建议，不构成学校正式审批。政策证据状态：PARTIAL。",
  catalogKind: 'builtin', sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 非校方正式模板；研究原件 docs/design/review-agent/business-templates/R02/research-original/S08-T05.md（原件文件 SHA-256=c2a5db6e7432516042fb5d4af75716e861f864febfd27da85e9c36fc957daef6）；审阅后来源文档 docs/design/review-agent/business-templates/R02/S08-T05.md（SHA-256=c2a5db6e7432516042fb5d4af75716e861f864febfd27da85e9c36fc957daef6）；政策证据 PARTIAL，禁止将模板 criterion 视为 PolicyVersion 或学校授权。", objectType: 'person', displayName: { template: "研究生科研成果、学术活动及学位申请成果要求认定" },
  fields:     [
    {
      "key": "F001",
      "label": "caseId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F001；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F002",
      "label": "studentId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F002；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F003",
      "label": "legalName",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F003；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F004",
      "label": "enrollmentState",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F004；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F005",
      "label": "degreeLevel",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F005；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F006",
      "label": "degreeCategory",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F006；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F007",
      "label": "studyMode",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F007；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F008",
      "label": "entryCohort",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F008；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F009",
      "label": "collegeId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F009；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F010",
      "label": "degreePointCode",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F010；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F011",
      "label": "trainingPlanVersion",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F011；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F012",
      "label": "mentorAssignment",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F012；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F013",
      "label": "policyIdVersion",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F013；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F014",
      "label": "policyScopeEffective",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F014；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F015",
      "label": "activityId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F015；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F016",
      "label": "activityKind",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F016；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F017",
      "label": "activityTitle",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F017；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F018",
      "label": "activityDateRange",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F018；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F019",
      "label": "organizer",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F019；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F020",
      "label": "participationFact",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F020；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F021",
      "label": "presentationNature",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F021；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F022",
      "label": "activityRecordFiledAt",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "displayHint": "原始字段编号 F022；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F023",
      "label": "mentorActivityGrade",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F023；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F024",
      "label": "activityCreditState",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F024；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F025",
      "label": "achievementId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F025；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F026",
      "label": "achievementType",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F026；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F027",
      "label": "achievementTitle",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F027；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F028",
      "label": "creatorsAndOrder:array",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F028；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F029",
      "label": "affiliations:array",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F029；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F030",
      "label": "degreeResearchRelevance",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F030；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F031",
      "label": "lifecycleState",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F031；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F032",
      "label": "lifecycleDates",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F032；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F033",
      "label": "externalIdentifier:array",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F033；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F034",
      "label": "journalOrTierVersion",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F034；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F035",
      "label": "officialVerification",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F035；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F036",
      "label": "authorityDecision",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F036；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F037",
      "label": "requestEvent",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F037；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F038",
      "label": "evidenceLocator",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F038；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F039",
      "label": "externalDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F039；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F040",
      "label": "conflictCode:enum[]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F040；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F041",
      "label": "evidenceVersion",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F041；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F042",
      "label": "reviewValidity",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F042；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F043",
      "label": "exceptionApprovalRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F043；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F044",
      "label": "appealOutcomeRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F044；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F045",
      "label": "degreeApplicationPeriod",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F045；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F046",
      "label": "publicationPostIssueStatus（正式更正/撤稿/勘误、发布主体、时间与查询快照）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "displayHint": "原始字段编号 F046；字段语义来自研究模板字段字典。"
    }
  ],
  materialSlots:     [
    {
      "id": "M001",
      "name": "学籍、学位点、培养方式、入学批次",
      "purpose": "M001 学籍、学位点、培养方式、入学批次；学校学籍/学位与研究生系统只读截面；C+A，L0；有权教务部门签发的学籍证明或历史档案摘录；不以学生截图替代权威身份；F002—F010/F038/F041；SRC-003/004/005/007；按 studentId 和截面日期；缺官→U，读损→索权威摘录；姓名冲突→存疑",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：学籍、学位点、培养方式、入学批次",
        "关联字段：F002、F003、F004、F005、F006、F007、F008、F009、F010、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-003",
        "原文槽位定义：M001 学籍、学位点、培养方式、入学批次；学校学籍/学位与研究生系统只读截面；C+A，L0；有权教务部门签发的学籍证明或历史档案摘录；不以学生截图替代权威身份；F002—F010/F038/F041；SRC-003/004/005/007；按 studentId 和截面日期；缺官→U，读损→索权威摘录；姓名冲突→存疑"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "当前培养方案及学位点成果/活动要求",
      "purpose": "M002 当前培养方案及学位点成果/活动要求；学校/学院批准的方案原件、附件、生效/年级范围；C+A，L0/L3；学校有权部门确认版本的书面解释；网上未签“修订稿”非有效替代；F011/F013/F014/F038/F041；SRC-002—005/008—013；按学位点/年级/批准日期保存；缺官→P；读损→U，版本冲突→存疑",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：当前培养方案及学位点成果/活动要求",
        "关联字段：F011、F013、F014、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M002 当前培养方案及学位点成果/活动要求；学校/学院批准的方案原件、附件、生效/年级范围；C+A，L0/L3；学校有权部门确认版本的书面解释；网上未签“修订稿”非有效替代；F011/F013/F014/F038/F041；SRC-002—005/008—013；按学位点/年级/批准日期保存；缺官→P；读损→U，版本冲突→存疑"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "有效导师分派和授权",
      "purpose": "M003 有效导师分派和授权；学校导师关系主数据/导师变更审批结论；T+A，需导师评定或确认时；有权培养单位出具带有效期的分派证明；F012/F038/F041；SRC-002/003；studentId、导师 ID、起止日期；缺官→U；本人填导师名无效",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：有效导师分派和授权",
        "关联字段：F012、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M003 有效导师分派和授权；学校导师关系主数据/导师变更审批结论；T+A，需导师评定或确认时；有权培养单位出具带有效期的分派证明；F012/F038/F041；SRC-002/003；studentId、导师 ID、起止日期；缺官→U；本人填导师名无效"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "本次核验请求、用途与申请人陈述",
      "purpose": "M004 本次核验请求、用途与申请人陈述；申请人/经授权经办者提交的结构化声明或校内业务申请记录；C，L0 或单项 L1/L2/L5；学校系统合法记录可代纸质申请；委托授权需校方确认；F001/F025/F037/F038/F041；SRC-002/007；绑申请人、用途、各项 ID 与提交时点；缺人→M；代理权限不明→H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：本次核验请求、用途与申请人陈述",
        "关联字段：F001、F025、F037、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M004 本次核验请求、用途与申请人陈述；申请人/经授权经办者提交的结构化声明或校内业务申请记录；C，L0 或单项 L1/L2/L5；学校系统合法记录可代纸质申请；委托授权需校方确认；F001/F025/F037/F038/F041；SRC-002/007；绑申请人、用途、各项 ID 与提交时点；缺人→M；代理权限不明→H"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "校内学术讲座/报告考勤",
      "purpose": "M005 校内学术讲座/报告考勤；学校/学院/实验室组织方的签到/电子考勤记录；T+A，活动举行后 L1；经组织单位核对的正式参与证明；不能仅凭活动海报；F015—F020/F038/F041；SRC-002；按活动 ID/组织人/日期；缺官→U；与自报冲突→存疑",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：校内学术讲座/报告考勤",
        "关联字段：F015、F016、F017、F018、F019、F020、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M005 校内学术讲座/报告考勤；学校/学院/实验室组织方的签到/电子考勤记录；T+A，活动举行后 L1；经组织单位核对的正式参与证明；不能仅凭活动海报；F015—F020/F038/F041；SRC-002；按活动 ID/组织人/日期；缺官→U；与自报冲突→存疑"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "校外会议参与与口头报告",
      "purpose": "M006 校外会议参与与口头报告；学生取得会议手册/议程、邀请、注册或会务回证；T，校外活动完成后 L1；可验证的主办方报告名单/证明；单纯缴费回执≠实际参加或主讲；F015—F021/F038/F041；SRC-002；活动 ID、本人报告角色；缺人→M；主办失联→U，矛盾→存疑",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：校外会议参与与口头报告",
        "关联字段：F015、F016、F017、F018、F019、F020、F021、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M006 校外会议参与与口头报告；学生取得会议手册/议程、邀请、注册或会务回证；T，校外活动完成后 L1；可验证的主办方报告名单/证明；单纯缴费回执≠实际参加或主讲；F015—F021/F038/F041；SRC-002；活动 ID、本人报告角色；缺人→M；主办失联→U，矛盾→存疑"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "公开学术报告及组织考核",
      "purpose": "M007 公开学术报告及组织考核；培养单位公开报告记录、安排、点评/质量记录；T+A，举办后 L1/L3；学校组织方可靠存档；课程作业报告不可替代公开报告；F016—F021/F038/F041；SRC-002；绑学生主讲人与活动，不把听课记为公开报告；缺官→U",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：公开学术报告及组织考核",
        "关联字段：F016、F017、F018、F019、F020、F021、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M007 公开学术报告及组织考核；培养单位公开报告记录、安排、点评/质量记录；T+A，举办后 L1/L3；学校组织方可靠存档；课程作业报告不可替代公开报告；F016—F021/F038/F041；SRC-002；绑学生主讲人与活动，不把听课记为公开报告；缺官→U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "学术活动登记卡/交流记录",
      "purpose": "M008 学术活动登记卡/交流记录；学生提交、导师审查、学院归档的登记记录；2021 版表格索引存在；T，实际活动后 L1；若学校确认系统直接登记可免纸件；SRC-015 表内字段待读；F015—F022/F038/F041；SRC-002/015；各场次版本与归档日期；缺人→M，表单不可读→读损，校内已有记录则 A",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：学术活动登记卡/交流记录",
        "关联字段：F015、F016、F017、F018、F019、F020、F021、F022、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-015、SRC-002",
        "原文槽位定义：M008 学术活动登记卡/交流记录；学生提交、导师审查、学院归档的登记记录；2021 版表格索引存在；T，实际活动后 L1；若学校确认系统直接登记可免纸件；SRC-015 表内字段待读；F015—F022/F038/F041；SRC-002/015；各场次版本与归档日期；缺人→M，表单不可读→读损，校内已有记录则 A"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "导师活动等级及环节学分",
      "purpose": "M009 导师活动等级及环节学分；导师有权评分、学院培养环节等级/学分归档；L+A，L3/L4 才产生；已归档的权威评分记录，可代重复电子签章扫描件；F012/F023/F024/F036/F038；SRC-002；绑导师授权日期、评语与学生；结果未作出→未生；伪签→存疑",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：导师活动等级及环节学分",
        "关联字段：F012、F023、F024、F036、F038",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M009 导师活动等级及环节学分；导师有权评分、学院培养环节等级/学分归档；L+A，L3/L4 才产生；已归档的权威评分记录，可代重复电子签章扫描件；F012/F023/F024/F036/F038；SRC-002；绑导师授权日期、评语与学生；结果未作出→未生；伪签→存疑"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "正式学术论文载体与出版元数据",
      "purpose": "M010 正式学术论文载体与出版元数据；期刊/出版社官网、正式论文首页、数据库可核条目；T，申报论文 L2；正式取得核查 L3；学校认可的正式数据库回证；预印本/录用信不能自动替代正式发表；F025—F033/F035/F038/F041；SRC-003—005/008—010；DOI/版本/作者和单位各自留痕；缺人→M，官方失联→U，读损→读损",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：正式学术论文载体与出版元数据",
        "关联字段：F025、F026、F027、F028、F029、F030、F031、F032、F033、F035、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-003",
        "原文槽位定义：M010 正式学术论文载体与出版元数据；期刊/出版社官网、正式论文首页、数据库可核条目；T，申报论文 L2；正式取得核查 L3；学校认可的正式数据库回证；预印本/录用信不能自动替代正式发表；F025—F033/F035/F038/F041；SRC-003—005/008—010；DOI/版本/作者和单位各自留痕；缺人→M，官方失联→U，读损→读损"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "论文投稿/录用/待刊状态证据",
      "purpose": "M011 论文投稿/录用/待刊状态证据；期刊编辑部录用函、系统通知、投稿回执；T，仅处于该状态的 L2；编辑部可核状态记录；不等于已发表，不能当正式取得成果；F025/F031/F032/F035/F038/F041；SRC-004/005；SRC-002 第 43 条只限中期；邮件来源、录用日期和论文 ID；缺人→M；真假不明→H；后续正式发表另走 M010",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：论文投稿/录用/待刊状态证据",
        "关联字段：F025、F031、F032、F035、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-004、SRC-002",
        "原文槽位定义：M011 论文投稿/录用/待刊状态证据；期刊编辑部录用函、系统通知、投稿回执；T，仅处于该状态的 L2；编辑部可核状态记录；不等于已发表，不能当正式取得成果；F025/F031/F032/F035/F038/F041；SRC-004/005；SRC-002 第 43 条只限中期；邮件来源、录用日期和论文 ID；缺人→M；真假不明→H；后续正式发表另走 M010"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "学校认可的期刊分区/成果等级口径",
      "purpose": "M012 学校认可的期刊分区/成果等级口径；学校/学位点认可的分类表、索引状态与适用版本；T+A，政策要求等级核查时 L3；经学校确认且带时间版本的可信检索回证；商业截图不作唯一依据；F013/F014/F034/F035/F038；SRC-004/005/008—010；记录认定时点/录用时点差异；缺官→U/P，等级冲突→存疑",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：学校认可的期刊分区/成果等级口径",
        "关联字段：F013、F014、F034、F035、F038",
        "研究来源索引（非案卷 SourceRef）：SRC-004",
        "原文槽位定义：M012 学校认可的期刊分区/成果等级口径；学校/学位点认可的分类表、索引状态与适用版本；T+A，政策要求等级核查时 L3；经学校确认且带时间版本的可信检索回证；商业截图不作唯一依据；F013/F014/F034/F035/F038；SRC-004/005/008—010；记录认定时点/录用时点差异；缺官→U/P，等级冲突→存疑"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "成果与学位论文/研究方向关联",
      "purpose": "M013 成果与学位论文/研究方向关联；申请人说明、导师意见、课题/培养计划关联依据；T，适用政策要求相关性时 L3；院系已认可的关联说明记录；仅题目相似不证明实质相关；F011/F027/F030/F036/F038；SRC-003—005；绑当前学位点及开题版本；缺人→M，学术相关性裁量→H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：成果与学位论文/研究方向关联",
        "关联字段：F011、F027、F030、F036、F038",
        "研究来源索引（非案卷 SourceRef）：SRC-003",
        "原文槽位定义：M013 成果与学位论文/研究方向关联；申请人说明、导师意见、课题/培养计划关联依据；T，适用政策要求相关性时 L3；院系已认可的关联说明记录；仅题目相似不证明实质相关；F011/F027/F030/F036/F038；SRC-003—005；绑当前学位点及开题版本；缺人→M，学术相关性裁量→H"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "专著/教材正式出版及本人贡献",
      "purpose": "M014 专著/教材正式出版及本人贡献；正式出版物版权页、ISBN、目录、署名与参与章节证明；T，申报著作时 L2/L3；出版社核验回证/学校认可档案；书稿或出版合同≠已出版；F025—F033/F035/F038/F041；SRC-004/005/008/009；按 ISBN 及作者贡献；缺人→M，无法核贡献→H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：专著/教材正式出版及本人贡献",
        "关联字段：F025、F026、F027、F028、F029、F030、F031、F032、F033、F035、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-004",
        "原文槽位定义：M014 专著/教材正式出版及本人贡献；正式出版物版权页、ISBN、目录、署名与参与章节证明；T，申报著作时 L2/L3；出版社核验回证/学校认可档案；书稿或出版合同≠已出版；F025—F033/F035/F038/F041；SRC-004/005/008/009；按 ISBN 及作者贡献；缺人→M，无法核贡献→H"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "科研获奖事实及完成人排序",
      "purpose": "M015 科研获奖事实及完成人排序；颁奖单位正式证书、公示、获奖名单/名次；T，申报奖励时 L2/L3；颁奖机关权威公示与可核名单；新闻稿不能独立确认本人名次；F025—F033/F035/F038/F041；SRC-004/005/008/009；证书编号/颁奖日期/团队名次；缺人→M，机关失联→U",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：科研获奖事实及完成人排序",
        "关联字段：F025、F026、F027、F028、F029、F030、F031、F032、F033、F035、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-004",
        "原文槽位定义：M015 科研获奖事实及完成人排序；颁奖单位正式证书、公示、获奖名单/名次；T，申报奖励时 L2/L3；颁奖机关权威公示与可核名单；新闻稿不能独立确认本人名次；F025—F033/F035/F038/F041；SRC-004/005/008/009；证书编号/颁奖日期/团队名次；缺人→M，机关失联→U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "专利申请、授权及发明人/权利人",
      "purpose": "M016 专利申请、授权及发明人/权利人；国家知识产权局权威登记与授权公告、授权证书；T，申报专利时 L2/L3；官方授权登记电子摘录可代证书；仅申请受理文件不能证明授权；F025—F033/F035/F038/F041；SRC-004/005/008/009；专利号/法律状态/署名及单位；缺官→U，权属争议→G06",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：专利申请、授权及发明人/权利人",
        "关联字段：F025、F026、F027、F028、F029、F030、F031、F032、F033、F035、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-004",
        "原文槽位定义：M016 专利申请、授权及发明人/权利人；国家知识产权局权威登记与授权公告、授权证书；T，申报专利时 L2/L3；官方授权登记电子摘录可代证书；仅申请受理文件不能证明授权；F025—F033/F035/F038/F041；SRC-004/005/008/009；专利号/法律状态/署名及单位；缺官→U，权属争议→G06"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "科研项目立项、级别与本人角色",
      "purpose": "M017 科研项目立项、级别与本人角色；主管机构立项文件、项目合同与批准成员名单；T，申报项目时 L2/L3；资助主管部门可验证登记/学校项目管理系统（若可用）；F025—F033/F035/F038/F041；SRC-004/005/009；项目号、批准日期、贡献排序；缺人→M，成员冲突→存疑",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：科研项目立项、级别与本人角色",
        "关联字段：F025、F026、F027、F028、F029、F030、F031、F032、F033、F035、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-004",
        "原文槽位定义：M017 科研项目立项、级别与本人角色；主管机构立项文件、项目合同与批准成员名单；T，申报项目时 L2/L3；资助主管部门可验证登记/学校项目管理系统（若可用）；F025—F033/F035/F038/F041；SRC-004/005/009；项目号、批准日期、贡献排序；缺人→M，成员冲突→存疑"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "项目到账/转化金额或验收事实",
      "purpose": "M018 项目到账/转化金额或验收事实；财务官方到账/转化凭证、验收机关正式记录；T，仅政策条款要求时 L3；学校财务/技术转移有权出具的金额或结项证明，必要时限制展示；F026/F031/F032/F035/F038/F041；SRC-005/009；项目号及流水/验收版本；缺官→U，保密 P3；立项不得顶替到账",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：项目到账/转化金额或验收事实",
        "关联字段：F026、F031、F032、F035、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-005",
        "原文槽位定义：M018 项目到账/转化金额或验收事实；财务官方到账/转化凭证、验收机关正式记录；T，仅政策条款要求时 L3；学校财务/技术转移有权出具的金额或结项证明，必要时限制展示；F026/F031/F032/F035/F038/F041；SRC-005/009；项目号及流水/验收版本；缺官→U，保密 P3；立项不得顶替到账"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "学科竞赛获奖与个人团队名次",
      "purpose": "M019 学科竞赛获奖与个人团队名次；赛事组织机构正式证书、公示、获奖名单；T，学位点认可竞赛成果时 L2/L3；可核赛事官方公布记录；成绩单不能自动替代奖项和名次；F025—F033/F035/F038/F041；SRC-004/005/008/009；赛事届次/作品 ID/学生排序；缺人→M，级别是否认可→P/H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：学科竞赛获奖与个人团队名次",
        "关联字段：F025、F026、F027、F028、F029、F030、F031、F032、F033、F035、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-004",
        "原文槽位定义：M019 学科竞赛获奖与个人团队名次；赛事组织机构正式证书、公示、获奖名单；T，学位点认可竞赛成果时 L2/L3；可核赛事官方公布记录；成绩单不能自动替代奖项和名次；F025—F033/F035/F038/F041；SRC-004/005/008/009；赛事届次/作品 ID/学生排序；缺人→M，级别是否认可→P/H"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "标准/规范正式发布与参编",
      "purpose": "M020 标准/规范正式发布与参编；发布机构标准号、公告、正文前言/参编名单；T，申报标准成果时 L2/L3；正式标准出版平台或权威发布部门回证；F025—F033/F035/F038/F041；SRC-004/005/009；标准号、版本、实施/发布日期；征求意见稿非正式发布",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：标准/规范正式发布与参编",
        "关联字段：F025、F026、F027、F028、F029、F030、F031、F032、F033、F035、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-004",
        "原文槽位定义：M020 标准/规范正式发布与参编；发布机构标准号、公告、正文前言/参编名单；T，申报标准成果时 L2/L3；正式标准出版平台或权威发布部门回证；F025—F033/F035/F038/F041；SRC-004/005/009；标准号、版本、实施/发布日期；征求意见稿非正式发布"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "工程报告/咨询建议采纳或成果转化",
      "purpose": "M021 工程报告/咨询建议采纳或成果转化；委托方正式采纳函、鉴定/验收、可核应用证明；T，仅适用文件认可此类成果时 L2/L3；有权委托单位/主管部门的正式回证，敏感技术内容可脱敏；F025—F033/F035/F038/F041；SRC-005/009；报告版本、采纳日期、贡献和保密范围；缺人→M，真实性 H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：工程报告/咨询建议采纳或成果转化",
        "关联字段：F025、F026、F027、F028、F029、F030、F031、F032、F033、F035、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-005",
        "原文槽位定义：M021 工程报告/咨询建议采纳或成果转化；委托方正式采纳函、鉴定/验收、可核应用证明；T，仅适用文件认可此类成果时 L2/L3；有权委托单位/主管部门的正式回证，敏感技术内容可脱敏；F025—F033/F035/F038/F041；SRC-005/009；报告版本、采纳日期、贡献和保密范围；缺人→M，真实性 H"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "G06 权属/科研诚信争议的权威结论",
      "purpose": "M022 G06 权属/科研诚信争议的权威结论；G06/学校有权调查组织出具的正式生效文书；T+A，仅已有权属争议结论时 L2/L3/L5；受限权限下的决定摘要及指针；未作决定不可要求申请人“补结果”；F028/F029/F039/F040/F038/F041；SRC-004—006（边界参考）；仅限有权人员，记录案件及生效状态；未生→H，泄露风险 P3",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：G06 权属/科研诚信争议的权威结论",
        "关联字段：F028、F029、F039、F040、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-004",
        "原文槽位定义：M022 G06 权属/科研诚信争议的权威结论；G06/学校有权调查组织出具的正式生效文书；T+A，仅已有权属争议结论时 L2/L3/L5；受限权限下的决定摘要及指针；未作决定不可要求申请人“补结果”；F028/F029/F039/F040/F038/F041；SRC-004—006（边界参考）；仅限有权人员，记录案件及生效状态；未生→H，泄露风险 P3"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "学院/学位点的正式成果认定意见",
      "purpose": "M023 学院/学位点的正式成果认定意见；学院/分委会经授权审议记录、意见、盖章或可信电子流程；L+A，L3 审查后；学校有权系统签发记录可代纸质件；禁止用户自传“审批截图”取得权限；F036/F043/F038/F041；SRC-003/007/011；主体/日期/授权范围绑定；尚未作出→未生，伪签→存疑",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：学院/学位点的正式成果认定意见",
        "关联字段：F036、F043、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-003",
        "原文槽位定义：M023 学院/学位点的正式成果认定意见；学院/分委会经授权审议记录、意见、盖章或可信电子流程；L+A，L3 审查后；学校有权系统签发记录可代纸质件；禁止用户自传“审批截图”取得权限；F036/F043/F038/F041；SRC-003/007/011；主体/日期/授权范围绑定；尚未作出→未生，伪签→存疑"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "研究生学位申请及后续资格审查状态",
      "purpose": "M024 研究生学位申请及后续资格审查状态；学校学位与研究生系统申请、预审/送审/毕业资格结论；L+A，L4 后续流程；官方系统状态或经主管部门正式签发的记录；F036/F045/F038/F041；SRC-007/011；批次、决定机关；在 L0—L3 不得索取；缺官→U",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：研究生学位申请及后续资格审查状态",
        "关联字段：F036、F045、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-007",
        "原文槽位定义：M024 研究生学位申请及后续资格审查状态；学校学位与研究生系统申请、预审/送审/毕业资格结论；L+A，L4 后续流程；官方系统状态或经主管部门正式签发的记录；F036/F045/F038/F041；SRC-007/011；批次、决定机关；在 L0—L3 不得索取；缺官→U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "学位分委员会/校学位委员会决定与签章",
      "purpose": "M025 学位分委员会/校学位委员会决定与签章；校院学位工作有权决议、公报/签章记录；L+A，L4 以后甚至授位后；校方正式决议原件可作为下游引用；不用于前置 T05 材料必需条件；F036/F045/F038/F041；SRC-007/014；有权会议、日期、票决记录；未生→N/A；不可写作 T05 自己批准",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：学位分委员会/校学位委员会决定与签章",
        "关联字段：F036、F045、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-007",
        "原文槽位定义：M025 学位分委员会/校学位委员会决定与签章；校院学位工作有权决议、公报/签章记录；L+A，L4 以后甚至授位后；校方正式决议原件可作为下游引用；不用于前置 T05 材料必需条件；F036/F045/F038/F041；SRC-007/014；有权会议、日期、票决记录；未生→N/A；不可写作 T05 自己批准"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "培养环节复议或成果学术复核请求",
      "purpose": "M026 培养环节复议或成果学术复核请求；学生正式异议书、提交时间、指向的旧记录与补充证据；T，L5 本人提出时当前必需；校方认可的在线申请记录可代纸件；无需初始提交尚不存在的复议结论；F002/F037/F040/F044/F038/F041；SRC-002 第 49 条 / SRC-001 第 40 条；绑定旧考核结果或成果认定版本；缺人→M，逾期/管辖 H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：培养环节复议或成果学术复核请求",
        "关联字段：F002、F037、F040、F044、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-002、SRC-001",
        "原文槽位定义：M026 培养环节复议或成果学术复核请求；学生正式异议书、提交时间、指向的旧记录与补充证据；T，L5 本人提出时当前必需；校方认可的在线申请记录可代纸件；无需初始提交尚不存在的复议结论；F002/F037/F040/F044/F038/F041；SRC-002 第 49 条 / SRC-001 第 40 条；绑定旧考核结果或成果认定版本；缺人→M，逾期/管辖 H"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "培养单位/研究生院/学位机关复议结果",
      "purpose": "M027 培养单位/研究生院/学位机关复议结果；有权机关受理和复议/复核结果文书、专家审查结论；L+A，正式复议完成后；学校权威记录与生效版本；不得由申请人预造；F036/F044/F038/F041；SRC-002 第 49 条 / SRC-001 第 40—41 条；绑定提出日期、决定层级/效力；初始未生→N/A；签发争议→H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：培养单位/研究生院/学位机关复议结果",
        "关联字段：F036、F044、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-002、SRC-001",
        "原文槽位定义：M027 培养单位/研究生院/学位机关复议结果；有权机关受理和复议/复核结果文书、专家审查结论；L+A，正式复议完成后；学校权威记录与生效版本；不得由申请人预造；F036/F044/F038/F041；SRC-002 第 49 条 / SRC-001 第 40—41 条；绑定提出日期、决定层级/效力；初始未生→N/A；签发争议→H"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "历史/过渡制度或特批解释",
      "purpose": "M028 历史/过渡制度或特批解释；学校学位办/培养单位确认的历史适用文、过渡说明；T+A，C05/C06 或规则冲突时 L0/L3；正式学校批文及授权解释；不以传闻/未批草案替代；F008/F013/F014/F043/F038/F041；SRC-003—005/010—012；版本生效与适用人群；缺官→P；矛盾→H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：历史/过渡制度或特批解释",
        "关联字段：F008、F013、F014、F043、F038、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-003",
        "原文槽位定义：M028 历史/过渡制度或特批解释；学校学位办/培养单位确认的历史适用文、过渡说明；T+A，C05/C06 或规则冲突时 L0/L3；正式学校批文及授权解释；不以传闻/未批草案替代；F008/F013/F014/F043/F038/F041；SRC-003—005/010—012；版本生效与适用人群；缺官→P；矛盾→H"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "工程博士实践成果申学位的后续鉴定材料",
      "purpose": "M029 工程博士实践成果申学位的后续鉴定材料；实践成果方案、展示/鉴定、答辩等下游有权流程；L+A，仅选实践成果途径的 C04 后续阶段；按 SRC-006 的正式流程处理；本模板仅引用已形成结论；F026/F030/F036/F045/F038；SRC-006/007；实践成果 ID 和方案版本；L2 不要求；不能将展示等同七类成果达标",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：工程博士实践成果申学位的后续鉴定材料",
        "关联字段：F026、F030、F036、F045、F038",
        "研究来源索引（非案卷 SourceRef）：SRC-006",
        "原文槽位定义：M029 工程博士实践成果申学位的后续鉴定材料；实践成果方案、展示/鉴定、答辩等下游有权流程；L+A，仅选实践成果途径的 C04 后续阶段；按 SRC-006 的正式流程处理；本模板仅引用已形成结论；F026/F030/F036/F045/F038；SRC-006/007；实践成果 ID 和方案版本；L2 不要求；不能将展示等同七类成果达标"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M030",
      "name": "旧材料替换、补件或撤回申请与变更说明",
      "purpose": "M030 旧材料替换、补件或撤回申请与变更说明；原申请人/有权经办记录、旧版引用和新材料关系；T，L5 发生替换/补件/撤回时；可信系统变更事件记录可代附加说明；撤回请求不等于撤回获准；F025/F037—F042；SRC-001/002（异议）；流程权限待核；旧新版 hash、作用范围、提出人和受理结果；缺人→M，冲突保留历史",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：旧材料替换、补件或撤回申请与变更说明",
        "关联字段：F037、F038、F039、F040、F041、F042、F025",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M030 旧材料替换、补件或撤回申请与变更说明；原申请人/有权经办记录、旧版引用和新材料关系；T，L5 发生替换/补件/撤回时；可信系统变更事件记录可代附加说明；撤回请求不等于撤回获准；F025/F037—F042；SRC-001/002（异议）；流程权限待核；旧新版 hash、作用范围、提出人和受理结果；缺人→M，冲突保留历史"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M031",
      "name": "论文发表后更正、撤稿/撤回、勘误与状态回证",
      "purpose": "M031 论文发表后更正、撤稿/撤回、勘误与状态回证；出版社正式公告、Crossmark/DOI 后续更新及学校认可检索源；T+A，论文有状态变更线索的 L2—L5；定期再核为配置项；原发行页和出版社官方通知优先；第三方撤稿数据库仅线索，绝不把“无检索结果”当未撤稿保证；F025/F027/F031—F035/F038/F041/F046；SRC-004/005/017；绑定 DOI+成果 ID+发布机构+查询时刻与声明版本；源失联→U，冲突→存疑；只失效该成果依赖的结果",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：论文发表后更正、撤稿/撤回、勘误与状态回证",
        "关联字段：F031、F032、F033、F034、F035、F025、F027、F038、F041、F046",
        "研究来源索引（非案卷 SourceRef）：SRC-004",
        "原文槽位定义：M031 论文发表后更正、撤稿/撤回、勘误与状态回证；出版社正式公告、Crossmark/DOI 后续更新及学校认可检索源；T+A，论文有状态变更线索的 L2—L5；定期再核为配置项；原发行页和出版社官方通知优先；第三方撤稿数据库仅线索，绝不把“无检索结果”当未撤稿保证；F025/F027/F031—F035/F038/F041/F046；SRC-004/005/017；绑定 DOI+成果 ID+发布机构+查询时刻与声明版本；源失联→U，冲突→存疑；只失效该成果依赖的结果"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  sections:   [
    {
      "id": "rules-8-2",
      "name": "08.2 入口、身份与政策规则",
      "order": 0,
      "required": false,
      "criteria": [
        {
          "id": "R001",
          "title": "真实申请人绑定",
          "requirement": "R001 真实申请人绑定；L0/L5；T=已创建本人案/代办案；F=无案；U=用户身份会话未核；SRC-007；F001—F003/F037/F038/F041；M001/M004；A 学籍号和服务端登录主体一一对应，保存历史姓名；姓名相似仅 D 候选；+PASS_FACT；−CONFLICT；?官方源失联SOURCE_UNAVAILABLE；身份管理员核对，不授权前端 actor",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "学段与培养身份事实",
          "requirement": "R002 学段与培养身份事实；L0/L3；T=有研究生身份核验；F=仅游客浏览；U=学籍/历史状态未取；SRC-003—005/007；F004—F011；M001/M002；A 学籍截面比对硕/博、学术/专业、全非全、年级、学院和学位点；跨学段保留旧新时点；+PASS_FACT；−CONFLICT；?SOURCE_UNAVAILABLE；学院学籍经办复核，不从表单改档",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "校本制度适用版本",
          "requirement": "R003 校本制度适用版本；L0/L3/L4；T=需要引用成果/活动门槛；F=纯保存不作达标判断；U=年级/学位点/实施日期未知；SRC-002—005/008—013；F005—F014/F043；M001/M002/M028；A 对照制度批准机关、文号、生效对象、是否修订；同名文件的新上传不自然覆盖旧生；2025 新细则 SRC-011 正文未读；+仅“版本可定位”PASS_FACT；−/ ?→POLICY_UNCONFIRMED；院系/学位办锁定政策，不作 AI 阈值裁断",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "申请/代理操作授权",
          "requirement": "R004 申请/代理操作授权；L0/L5；T=提交/撤回/复议等动作；F=只读查阅；U=代办授权未验；SRC-001/002/007（程序背景）；F001/F002/F037/F041；M001/M004/M026/M030；A 服务端会话+本人或校本授权代理；具体代签授权制度未获证实；提交时间和接收时间分开；+PASS_FACT（仅请求归属）；−NEEDS_HUMAN_DECISION；?SOURCE_UNAVAILABLE；学校身份/业务受理人确认，不因点击推定受理成功",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "原件可读、归属及不可变版本",
          "requirement": "R005 原件可读、归属及不可变版本；L0—L5；T=实际附证据；F=本阶段无该材料要求；U=附件关联对象未能识别；SRC-002/004/005/007（原件需求）；F002/F015/F025/F038/F040/F041；M004/M005—M030（仅被触发槽）；来源定位到具体页/栏/行、关联唯一学生+事项+版本 hash；扫描 OCR 不构成真实确认；保密文件最小显示；+PASS_FACT（仅可读归属）；文件损坏UNREADABLE；归属相斥CONFLICT；缺人件NEEDS_MATERIAL；学生补件或证据管理员核对",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "导师身份和评分签发权",
          "requirement": "R006 导师身份和评分签发权；L1/L3；T=需要导师鉴定或确认；F=当前仅客观自报；U=分派/变更生效时点不明；SRC-002/003；F012/F023/F036/F038/F041；M003/M009/M023（签认存在后）；A 校方导师分派生效日期及真实学校签名；已调离导师的后签名不得默认为有效；分派变更只读 S08-T01，教师导师资格只读 T06-T01；+PASS_FACT（权限事实）；−NEEDS_HUMAN_DECISION；?SOURCE_UNAVAILABLE；学院确认；Renderer teacher=true 无效",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-8-3",
      "name": "08.3 学术活动事实规则",
      "order": 1,
      "required": false,
      "criteria": [
        {
          "id": "R007",
          "title": "活动类型及发生事实",
          "requirement": "R007 活动类型及发生事实；L1；T=已举办的讲座/会议/报告；F=尚未举办；U=主办方/日期不明；SRC-002 第 24—27 条；F015—F019/F038/F041；M005/M006/M007/M008（按类型）；以 A 校内公告或 B 校外主办方日程核主办、会期、活动类别；同名活动不能自动并案；+PASS_FACT；−CONFLICT；?外部主办失联SOURCE_UNAVAILABLE；组织者/学院核对",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "校内签到出勤",
          "requirement": "R008 校内签到出勤；L1；T=校内需统计实际出勤；F=校外活动；U=是否由校内承办不明；SRC-002 第 27 条；F015/F018—F020/F038/F041；M005/M008；A 组织者考勤按具体场次和学生 ID 比对，海报/报名表只能证明招募；+PASS_FACT；−自报与考勤相斥CONFLICT；?SOURCE_UNAVAILABLE；活动组织者/学院出具或纠错",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "校外参会和口头报告",
          "requirement": "R009 校外参会和口头报告；L1；T=校外会议/口头发言申报；F=校内讲座；U=会议级别/演讲角色不清；SRC-002 第 26—28 条；F015—F021/F038/F041；M006/M008；B 议程、手册与主办方回证核本人实际参加及 oral presentation；付费/受邀≠参加或发言；+仅事实PASS_FACT；−CONFLICT / 明确无报告时NEEDS_HUMAN_DECISION；?NEEDS_MATERIAL 或官方失联SOURCE_UNAVAILABLE；导师/学院确认",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "公开学术报告而非课程报告",
          "requirement": "R010 公开学术报告而非课程报告；L1/L3；T=申报公开主讲；F=纯听报告；U=报告组织性质未知；SRC-002 第 26—27 条；F016/F017/F020/F021/F038；M007/M008；A 培养单位组织、公告与质量记录；课程教学汇报不能替代公开学术报告；是否另有特批只能人工解释；+PASS_FACT（已公开报告事实）；−NEEDS_HUMAN_DECISION（明确课程报告）；?NEEDS_MATERIAL/SOURCE_UNAVAILABLE；学院培养环节负责人",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "两周内活动记录提交",
          "requirement": "R011 两周内活动记录提交；L1；T=活动已结束并报送；F=活动未来发生；U=结束日或有效提交日无法确定；SRC-002 第 28、51—52 条；F018/F022/F038/F041；M006/M008（按活动）；A 学校接收日志/登记卡比对活动结束到提交时间是否在 2 周内；2021 试行条款现行性须核；逾期补正有无例外未证；+及时性事实PASS_FACT；−逾期事实NEEDS_HUMAN_DECISION（不得自动“不合格”）；?SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED；培养单位判断",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "学术学位活动数量及类别汇总",
          "requirement": "R012 学术学位活动数量及类别汇总；L3；T=学术型硕/博准备环节总评；F=专业学位点另设规则或尚在登记；U=学位类别/现行规则未定；SRC-002 第 24—27 条、SRC-013（学科示例）；F005/F006/F011/F013—F024；M002/M005—M009；基于已核逐场记录计数：2021 学术学位博士 ≥20 讲座、≥1 国际会议、≥2 次国际/全国会议口头报告；学硕 ≥10 学术报告、≥1 公开主讲。先经 R003 判现行适用、学院补充要求；重复场次去重；+仅计数PASS_FACT；−数量未达/分类争议NEEDS_HUMAN_DECISION；?政策POLICY_UNCONFIRMED、考勤缺SOURCE_UNAVAILABLE；导师/培养单位考核，不自动结学分",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R013",
          "title": "导师活动考核及学分归档",
          "requirement": "R013 导师活动考核及学分归档；L3/L4；T=已到培养环节考核节点；F=活动还在形成；U=考核节点/导师权限不明；SRC-002 第 27—28 条；F012/F023/F024/F036/F038/F041；M003/M008/M009；A 导师实际等级优秀/良好/合格/不合格、学院学分存档；系统只能引用正式等级，不能由活动数代评分；专业硕士自设方案待核；+“已归档等级”PASS_FACT；−无有效签发NEEDS_HUMAN_DECISION；?后续未形成NOT_APPLICABLE 或官方失联SOURCE_UNAVAILABLE；导师和学院负责",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    },
    {
      "id": "rules-8-4",
      "name": "08.4 科研成果身份、取得状态与分类证据规则",
      "order": 2,
      "required": false,
      "criteria": [
        {
          "id": "R014",
          "title": "博士批次与培养方式分支",
          "requirement": "R014 博士批次与培养方式分支；L0/L3；T=学博/工程专博需用博士成果规定；F=硕士；U=2022 前后年级、直博阶段或全非全不明；SRC-003—006/013；F004—F014；M001/M002/M028（过渡时）；A 入学年级和正式培养类别：2022 两专项只写 2022 级及以后，工程类个别通道看全/非全；2025 实践成果申请是另一个后续对象；+分流事实PASS_FACT；−错用文件POLICY_UNCONFIRMED；?SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED；学院学位点确认过渡",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "可计入的成果类型",
          "requirement": "R015 可计入的成果类型；L2/L3；T=申报一项成果计入对应学位点要求；F=仅个人科研成果收藏；U=该点正式清单版本不明；SRC-003—005/008—010；F010/F013/F014/F025/F026/F038；M002/M010/M014—M021（按类型）；将成果客观载体种类与本学生绑定的正式清单比对；七类/八类仅对应其适用文，不变成全校清单；+类别匹配PASS_FACT；−类别不在有效清单NEEDS_HUMAN_DECISION；?POLICY_UNCONFIRMED；院系学位点说明是否可计入",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R016",
          "title": "本人署名与完成者顺序",
          "requirement": "R016 本人署名与完成者顺序；L2/L3；T=成果载体列作者/完成人；F=无成果；U=姓名同形、别名或署名页不全；SRC-003—005/008—010；F002/F003/F025/F028/F033/F038/F041；M001/M010/M014—M021（实际载体）；A 学籍加 B 正式载体，逐人次序与贡献栏、历史姓名；不得凭模糊拼写识别，争权属转 R032；+署名事实PASS_FACT；−身份不符/两版矛盾CONFLICT；?NEEDS_MATERIAL/NEEDS_HUMAN_DECISION；学院核对，权属转 G06",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "署名单位与排名",
          "requirement": "R017 署名单位与排名；L2/L3；T=适用条款检查第一/依托单位；F=相应成果不要求；U=多单位或历史变更不清；SRC-003—005/008/009；F025/F028/F029/F038/F041；M010/M014—M021（对应）；B 正式署名页、批准/登记页核成都理工大学出现次序；不同成果类型、作者组合不能以单一“第一单位”硬判；+客观一致PASS_FACT；−不匹配NEEDS_HUMAN_DECISION；?NEEDS_MATERIAL/POLICY_UNCONFIRMED；学位点判断是否构成达标",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "成果唯一性与避免重复计数",
          "requirement": "R018 成果唯一性与避免重复计数；L2/L3；T=同案多件或跨用途复用；F=单项无重复；U=论文改题/同一 DOI 多版无法确认；SRC-003—005/010（特定点重复计用口径）；F025/F027/F033/F038/F041；M010/M011/M014—M021（实际）；同一 DOI/专利号/标准号/项目号和正式版本合并为一项事实；跨人“仅一人计用”只在适用文件确有批准规则时执行，不扩张 SRC-010；+无重复PASS_FACT；−同项重复NEEDS_HUMAN_DECISION；?CONFLICT；学院确定计用资格，系统只防本案重复",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "论文生命周期真值",
          "requirement": "R019 论文生命周期真值；L2/L3；T=论文成果或论文状态变更；F=非论文；U=发表载体、状态真伪未知；SRC-003—005/008—010；F025/F027/F031—F035/F038/F041；M010/M011；逐事件记录投稿、录用、online、正式发表和数据库收录日期，以 B 出版商/索引状态复核；录用函独立 PASS_FACT 不推出“正式取得”；+某状态事实PASS_FACT；−自报已发表但仅录用CONFLICT/NEEDS_HUMAN_DECISION；?SOURCE_UNAVAILABLE 或 NEEDS_MATERIAL；学院核状态",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R020",
          "title": "期刊分级和适用时点",
          "requirement": "R020 期刊分级和适用时点；L3；T=适用成果通道要求刊物等级；F=不需刊物等级；U=学校认可的时间版次缺失；SRC-004/005/008—010/016；F013/F014/F032/F034/F035/F038；M002/M010/M012；区分论文被接收日期、检索数据库条目与分区表年度；2026 年文献中心停止更新分区表（SRC-016），若接收年份无同年正式新表，须取得学校认可的历史版沿用/替代解释，不得伪造 2026 中科院分区；+仅认可版本中的客观等级事实PASS_FACT；−等级与批准标准不符NEEDS_HUMAN_DECISION；?POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE；学位点核等级及过渡",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R021",
          "title": "专著正式出版与贡献",
          "requirement": "R021 专著正式出版与贡献；L2/L3；T=专著/著作类别申报；F=非著作；U=有书稿却无发行信息；SRC-004/005/008/009；F025—F033/F035/F038/F041；M014；B 出版社 ISBN、版权页、章贡献；书稿/合同与正式出版区分，贡献满足哪条由学校认定；+出版/署名事实PASS_FACT；−未出版不记正式取得NEEDS_HUMAN_DECISION；?NEEDS_MATERIAL/SOURCE_UNAVAILABLE；院系核实",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "科研奖励等级及名次",
          "requirement": "R022 科研奖励等级及名次；L2/L3；T=获奖类别申报；F=非奖励；U=颁奖机关、正式名单不全；SRC-004/005/008/009；F025—F033/F035/F038/F041；M015；B 颁奖机构公告/证书与名单比对届次、类别、完成人排序；媒体报道不是获奖认定；+证书事实PASS_FACT；−排名相斥CONFLICT；?NEEDS_MATERIAL/SOURCE_UNAVAILABLE；学位点核政策等级",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "专利授权与法律状态",
          "requirement": "R023 专利授权与法律状态；L2/L3；T=申报专利；F=非专利；U=官方登记不可得；SRC-004/005/008/009；F025—F033/F035/F038/F041；M016；B 知识产权部门申请号、授权公告、发明人和权利人分别核；受理≠授权；权属有争议另 R032；+对应阶段事实PASS_FACT；−自报授权而仅受理NEEDS_HUMAN_DECISION；?SOURCE_UNAVAILABLE；院系/权属机构分别处理",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R024",
          "title": "项目级别及本人参与",
          "requirement": "R024 项目级别及本人参与；L2/L3；T=科研项目作为成果通道；F=非项目；U=成员表/项目号缺失；SRC-004/005/009；F025—F033/F035/F038/F041；M017；B 正式立项和团队名单核承担角色、阶段/项目类别；立项不替代结项及经费到账；+立项与角色事实PASS_FACT；−角色相斥CONFLICT；?SOURCE_UNAVAILABLE/NEEDS_MATERIAL；学院科研经办核实",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R025",
          "title": "资金到账、转化和验收",
          "requirement": "R025 资金到账、转化和验收；L3；T=适用通道明确要求经费/转化/验收；F=不涉及这些条件；U=对应批准要求或金额口径不明；SRC-005/009；F013/F014/F025/F026/F031/F032/F035/F038/F041；M002/M017/M018；A 学校财务到账或 B 正式验收/转化回证；资金金额、时间与项目 ID 相连，商业合同或立项不能替代到账；+到账/验收事实PASS_FACT；−未发生NEEDS_HUMAN_DECISION；?SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED；财务/学院核验",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R026",
          "title": "赛事奖项与个人排序",
          "requirement": "R026 赛事奖项与个人排序；L2/L3；T=学位点允许竞赛成果；F=未列或非竞赛；U=授权级别/举办主体待判；SRC-004/005/008/009；F013/F014/F025—F033/F035/F038/F041；M002/M019；B 赛事官方届次与获奖名单核学生团队排序；未获校本认可的赛事只能做事实；+奖项事实PASS_FACT；−名单不符CONFLICT；?NEEDS_MATERIAL/POLICY_UNCONFIRMED；学位点确认",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R027",
          "title": "标准正式发布与参编",
          "requirement": "R027 标准正式发布与参编；L2/L3；T=申报标准/规范；F=非标准；U=标准实施版本/参编名录未核；SRC-004/005/009；F025—F033/F035/F038/F041；M020；B 官方标准编号、发布版前言/参编名单；征求意见稿≠正式发布，发布日期/实施日分别保存；+发布/参编事实PASS_FACT；−仅征求稿NEEDS_HUMAN_DECISION；?SOURCE_UNAVAILABLE/NEEDS_MATERIAL；学院核验",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R028",
          "title": "工程报告/成果采纳事实",
          "requirement": "R028 工程报告/成果采纳事实；L2/L3；T=适用点允许报告/采纳、转化成果；F=不涉及；U=项目保密/有权采纳主体不明；SRC-005/009；F025—F033/F035/F038/F041；M021；B 委托方正式采纳函、鉴定或有权验收文件，核版本和本人贡献；展示/答辩另由 SRC-006 的后续程序办；+采纳事实PASS_FACT；−无权函件NEEDS_HUMAN_DECISION；?SOURCE_UNAVAILABLE/NEEDS_MATERIAL；学院/保密授权人",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R029",
          "title": "成果与学位论文/方向实质相关性",
          "requirement": "R029 成果与学位论文/方向实质相关性；L3；T=对应规则要求相关性；F=不要求；U=开题/课题变更历史不清；SRC-003—005；F011/F013/F014/F027/F030/F036/F038；M002/M013，相邻 T03 权威记录只读；题目关键词只能给线索，实质学术相关性由导师/学位点确认；变更开题不能由本模板批准；+“有关材料已核”PASS_FACT，相关性最终NEEDS_HUMAN_DECISION；−仍交人；?NEEDS_MATERIAL；导师/学位点签认",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R030",
          "title": "成果正式取得与申请时点",
          "requirement": "R030 成果正式取得与申请时点；L3/L4；T=学位申请成果须正式取得；F=仅 L2 过程登记；U=申请批次或“正式取得”定义未核；SRC-004/005/007；F031/F032/F035/F045/F038/F041；M010/M014—M021 及 M024（仅 L4 已形成）；B 出版/授权/颁奖时间与 A 正式提交申请时点逐项比较；录用日不得覆盖发表日；online 是否等效留校本人工解释；+时间顺序事实PASS_FACT；−申请时未取得NEEDS_HUMAN_DECISION；?POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE；学院学位办确认",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R031",
          "title": "学位点成果要求整体达标",
          "requirement": "R031 学位点成果要求整体达标；L3/L4；T=已正式申请成果条件认定；F=仍在滚动登记；U=政策版本/例外授权不明；SRC-003—005/008—011；F005—F014/F023/F024/F025—F036/F043；M001/M002/M009（活动已评分时）/M010—M023（各实际成果与后续意见）；以 R014—R030 已确认的单项事实和有权批准的学位点政策汇总；各通道是否允许累计/替代、破格一律按院系现行批准文件；这是待人工判断对象；+仅“事实清单已汇总”PASS_FACT，达标决定始终 NEEDS_HUMAN_DECISION；−/ ?政策未知POLICY_UNCONFIRMED，缺已产生材料才NEEDS_MATERIAL；有权学院/分委会签 M023",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    },
    {
      "id": "rules-8-5",
      "name": "08.5 权属、权威决定及后续状态规则",
      "order": 3,
      "required": false,
      "criteria": [
        {
          "id": "R032",
          "title": "权属/署名争议路由",
          "requirement": "R032 权属/署名争议路由；L2/L3/L5；T=作者资格、权属、重复计用或科研诚信有争议；F=仅普通公开署名事实；U=争议调查状态不明；SRC-003—006（边界）；F025/F028/F029/F039/F040/F041；M010/M016/M022（有结论后）；有争议标 CONFLICT、引用 G06 有权决定 ID/签发日期/效力，没有正式决定也不能要求当事人自行造一份；调查内容 P3；+仅“G06 权威引用有效”PASS_FACT；争议未决NEEDS_HUMAN_DECISION；?SOURCE_UNAVAILABLE；路由 G06，T05 挂起争议项",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R033",
          "title": "导师/学院正式意见可信性",
          "requirement": "R033 导师/学院正式意见可信性；L3/L5；T=已有活动评分或学院成果意见；F=申请尚未审；U=签章主体、角色和管辖未知；SRC-002/003/007/011（程序权限待核）；F012/F023/F024/F036/F038/F041/F043；M003/M009/M023；可信服务端账号、授权时间、签发内容与证据版本一致；只有上传盖章图片或 Renderer teacher 字段不够；+“正式意见确存在且有效”PASS_FACT；−疑似伪签CONFLICT；?SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；学校授权管理员核验，不代签",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R034",
          "title": "下游学位决定只读引用",
          "requirement": "R034 下游学位决定只读引用；L4；T=申请进入学位资格/授位办理；F=L0—L3 尚未进入；U=正式批次/决定未取；SRC-001/007/014；F036/F039/F045/F038/F041；M023/M024/M025/M029（有形成才可用）；A 仅引用下游学校决定及其状态，核签发机关、会议/公报；论文送审、答辩、授位结论属于其他授权程序；+只读引用PASS_FACT；−签章不匹配CONFLICT；?SOURCE_UNAVAILABLE，未生NOT_APPLICABLE；学位办接续，不由 T05 作授位",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R035",
          "title": "材料版本变更后的定向失效",
          "requirement": "R035 材料版本变更后的定向失效；L2—L5；T=已绑定证据的附件/事实或政策换版本；F=无变化；U=旧版 hash/依赖不清；SRC-002/003/007/017（档案及来源背景）；F025/F036—F042/F046；M010—M031（仅实际关联槽）；比对 F041 hash、字段差异和 dependsOn 规则索引；仅失效引用旧版的 R，M023/M027 等正式决定保持原状但发“需有权重核”待办；+变更影响识别PASS_FACT；−错误覆盖CONFLICT；?NEEDS_HUMAN_DECISION；业务 Owner/原审批机关，禁止自动改签",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R036",
          "title": "撤回、重提与跨批次关联",
          "requirement": "R036 撤回、重提与跨批次关联；L5；T=申请人发撤回/重提/继续申请请求；F=无此请求；U=授权代理或旧决定状态未知；SRC-001/007（程序背景、撤回细则未证）；F001/F002/F036/F037/F041/F042/F045；M004/M024/M030（按实际阶段）；验明本人/有权代理，保留原提交及受理信息，发起撤回请求并关联重提的新案/批次；是否可撤回、何时生效、撤回后复活须校方决定；+请求已登记PASS_FACT，撤回生效仍 NEEDS_HUMAN_DECISION；?POLICY_UNCONFIRMED / 身份SOURCE_UNAVAILABLE；学校当前案受理人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R037",
          "title": "培养考核复议、成果学术复核、授位复核分流",
          "requirement": "R037 培养考核复议、成果学术复核、授位复核分流；L5；T=已收到针对正式结果的异议；F=普通补件；U=异议的决定类型/公布日期不明；SRC-002 第 49 条 / SRC-001 第 40—41 条；F002/F023/F036/F037/F044/F045；M009/M023/M025/M026；培养考核 2021 试行办法：结果公布后 15 日内向培养单位、其后可向研究生院书面复议；成果学术评价→学位法第 40 条；不受理/不授/撤销学位→第 41 条，两法条均为自受理相应复核申请起 30 日内作决定，不是学生申请期限；+路由/日期事实PASS_FACT；−逾期或管辖争议NEEDS_HUMAN_DECISION；?POLICY_UNCONFIRMED（校本现行/表单）或NEEDS_MATERIAL；培养单位/研究生院/学位办相应受理机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R038",
          "title": "复议处理结果及原决定效力",
          "requirement": "R038 复议处理结果及原决定效力；L5；T=有权机关已作复议/学术复核结果；F=仅提出申请尚未决定；U=文书签发或生效日期未知；SRC-001/002/011；F036/F037/F039/F041/F044；M026/M027；A 受理机关、专家记录、正式结论和原结果版本相连；学生上传“通过截图”不是正式复议决定；原决定变更仅按有权生效文书记录；+正式复核结果事实PASS_FACT；−来源相斥CONFLICT；?SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；有权复核机关签发，T05 只读引用",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R039",
          "title": "论文正式更正、撤稿与后续有效状态",
          "requirement": "R039 论文正式更正、撤稿与后续有效状态；L2/L3/L5；T=已申报论文且出现撤稿、更正、撤回、撤销接受等可靠线索，或 L3 有学校正式配置的定期再核；F=非出版成果/无此触发；U=出版社后续状态不明；SRC-004/005/017；F025/F027/F031—F035/F038/F041/F046；M010/M031（已出现时）；比对 DOI、出版社更正/撤稿声明、修改后的作者和出版时间，保留旧著录与新事件及官方查询快照。Crossref 可以发现更新但不保证穷尽，不能凭“未发现”判无撤稿；撤稿或更正后是否仍可计入依校本规则及学术判断；+只认“后续状态回证确实存在/最新查验时点”PASS_FACT；−原申报与出版社相斥CONFLICT；?SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；出版商/院系核对；R019/R020/R030/R031 受影响重审，不动其他成果",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    }
  ],
  policyVersionIds: [], stages:     [
    {
      "id": "l0",
      "name": "身份与政策分流",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "l1"
    },
    {
      "id": "l1",
      "name": "学术活动滚动登记",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "l2"
    },
    {
      "id": "l2",
      "name": "科研成果逐件录入",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "l3"
    },
    {
      "id": "l3",
      "name": "培养环节与成果审核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "l4"
    },
    {
      "id": "l4",
      "name": "申请资格衔接",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "l5"
    },
    {
      "id": "l5",
      "name": "后续更新/异议",
      "kind": "handoff",
      "executorRole": "reviewer",
      "workflowOwner": "local"
    }
  ],
  outputs: [{ id: 'review-feedback', kind: 'item-feedback', audience: 'reviewer' }, { id: 'supplement-suggestions', kind: 'supplement-list', audience: 'student' }],
  autoPassPolicy: { enabled: false }, status: 'draft', createdAt: '2026-10-24T00:00:00.000Z'
}
export const templateValidationIssues = validateTemplate(templateVersion)
export const r02Metadata: R02Metadata = {
  templateId: "S08-T05", name: "研究生科研成果、学术活动及学位申请成果要求认定", sourceDocumentPath: "docs/design/review-agent/business-templates/R02/S08-T05.md", sourceDocumentSha256: "c2a5db6e7432516042fb5d4af75716e861f864febfd27da85e9c36fc957daef6",
  originalSourceDocumentPath: "docs/design/review-agent/business-templates/R02/research-original/S08-T05.md", originalSourceSha256: "c2a5db6e7432516042fb5d4af75716e861f864febfd27da85e9c36fc957daef6", manifestSha256: "c2a5db6e7432516042fb5d4af75716e861f864febfd27da85e9c36fc957daef6", manifestHashCheck: true,
  officialSchoolTemplate: false, researchDate: '2026-10-24', policyEvidenceStatus: 'PARTIAL',
  sourceEvidence:   [
    {
      srcId: "SRC-001",
      evidenceStatus: "PARTIAL",
      title: "SRC-001｜GENERAL-RESEARCH｜中华人民共和国学位法"
    },
    {
      srcId: "SRC-002",
      evidenceStatus: "UNCONFIRMED",
      title: "SRC-002｜CURRENTITY-UNKNOWN｜成理校研〔2021〕12 号《成都理工大学研究生培养环节管理办法（试行）》"
    },
    {
      srcId: "SRC-003",
      evidenceStatus: "UNCONFIRMED",
      title: "SRC-003｜CURRENTITY-UNKNOWN｜成理校研〔2021〕10 号《成都理工大学关于研究生申请学位学术成果基本要求的规定》"
    },
    {
      srcId: "SRC-004",
      evidenceStatus: "UNCONFIRMED",
      title: "SRC-004｜CURRENTITY-UNKNOWN｜成理校研〔2022〕160 号《成都理工大学学术型博士研究生申请学位取得学术成果要求的规定》"
    },
    {
      srcId: "SRC-005",
      evidenceStatus: "UNCONFIRMED",
      title: "SRC-005｜CURRENTITY-UNKNOWN｜成理校研〔2022〕161 号《成都理工大学工程类博士专业学位研究生申请学位取得学术成果要求的规定》"
    },
    {
      srcId: "SRC-006",
      evidenceStatus: "UNCONFIRMED",
      title: "SRC-006｜CURRENTITY-UNKNOWN｜成理校研〔2025〕17 号《成都理工大学工程类博士专业学位研究生学位论文与申请学位实践成果实施细则（试行）》"
    },
    {
      srcId: "SRC-007",
      evidenceStatus: "VERIFIED",
      title: "SRC-007｜CDUT-VERIFIED｜成理研〔2026〕1 号《关于2026年博士、硕士研究生毕业答辩和学位申请工作安排的通知》"
    },
    {
      srcId: "SRC-008",
      evidenceStatus: "UNCONFIRMED",
      title: "SRC-008｜CURRENTITY-UNKNOWN｜核技术与自动化工程学院《学术型硕士研究生学位学术成果要求》"
    },
    {
      srcId: "SRC-009",
      evidenceStatus: "UNCONFIRMED",
      title: "SRC-009｜CURRENTITY-UNKNOWN｜核技术与自动化工程学院《专业型硕士研究生学位学术成果标准》"
    },
    {
      srcId: "SRC-010",
      evidenceStatus: "UNCONFIRMED",
      title: "SRC-010｜CURRENTITY-UNKNOWN｜《成都理工大学电子信息类别硕士研究生学位学术成果标准》"
    },
    {
      srcId: "SRC-011",
      evidenceStatus: "UNCONFIRMED",
      title: "SRC-011｜CURRENTITY-UNKNOWN｜2025 年新《成都理工大学硕士、博士学位授予工作实施细则》线索"
    },
    {
      srcId: "SRC-012",
      evidenceStatus: "UNCONFIRMED",
      title: "SRC-012｜CURRENTITY-UNKNOWN｜成理校研〔2021〕26 号《成都理工大学硕士、博士学位授予工作实施细则（修订）》"
    },
    {
      srcId: "SRC-013",
      evidenceStatus: "UNCONFIRMED",
      title: "SRC-013｜CURRENTITY-UNKNOWN｜《智能计算与信息处理学科培养方案》"
    },
    {
      srcId: "SRC-014",
      evidenceStatus: "VERIFIED",
      title: "SRC-014｜CDUT-VERIFIED｜成都理工大学第六届学位评定委员会第十号公告"
    },
    {
      srcId: "SRC-015",
      evidenceStatus: "UNCONFIRMED",
      title: "SRC-015｜CURRENTITY-UNKNOWN｜《博（硕）士研究生学术交流活动记录表（2021版）》研究生院下载页"
    },
    {
      srcId: "SRC-016",
      evidenceStatus: "PARTIAL",
      title: "SRC-016｜GENERAL-RESEARCH｜中国科学院文献情报中心 2026 年停止更新发布期刊分区表的声明"
    },
    {
      srcId: "SRC-017",
      evidenceStatus: "PARTIAL",
      title: "SRC-017｜GENERAL-RESEARCH｜Crossref REST API 官方元数据说明"
    },
    {
      srcId: "SRC-018",
      evidenceStatus: "PARTIAL",
      title: "SRC-018｜GENERAL-RESEARCH｜国家知识产权局专利检索及审查信息官方入口"
    },
    {
      srcId: "SRC-019",
      evidenceStatus: "PARTIAL",
      title: "SRC-019｜GENERAL-RESEARCH｜国家标准化管理委员会“国家标准公开”办事指南"
    }
  ],
  criteria:   [
    {
      "sectionId": "rules-8-2",
      "criterionId": "R001",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R002",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R003",
      "srcIds": [
        "SRC-002",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R005",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R006",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R007",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R008",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R009",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R010",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R011",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R012",
      "srcIds": [
        "SRC-002",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R013",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R014",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R015",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R016",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R017",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R018",
      "srcIds": [
        "SRC-003",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R019",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R020",
      "srcIds": [
        "SRC-004",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R021",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R022",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R023",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R024",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R025",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R026",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R027",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R028",
      "srcIds": [
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R029",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R030",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R031",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-5",
      "criterionId": "R032",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-5",
      "criterionId": "R033",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-5",
      "criterionId": "R034",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-5",
      "criterionId": "R035",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-5",
      "criterionId": "R036",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-5",
      "criterionId": "R037",
      "srcIds": [
        "SRC-002",
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-5",
      "criterionId": "R038",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-5",
      "criterionId": "R039",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
}
