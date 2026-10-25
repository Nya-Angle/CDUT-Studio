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
  templateId: "S08-T04", version: 1, schemaVersion: 2, name: "研究生中期考核与培养进展审核",
  description: "本地研究模板 · 非校方正式模板。研究生中期考核与培养进展审核；仅供本地材料核验、证据覆盖检查和人工审阅建议，不构成学校正式审批。政策证据状态：PARTIAL。",
  catalogKind: 'builtin', sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 非校方正式模板；研究原件 docs/design/review-agent/business-templates/R02/research-original/S08-T04.md（原件文件 SHA-256=0c16b9bf4cbf3c8e38c896d22c4bc64ecb5a3e8921c38665810e4679526ce9e1）；审阅后来源文档 docs/design/review-agent/business-templates/R02/S08-T04.md（SHA-256=df0265569e6213739b24a35496410566faadd822a89a26f43972b38f5f9af275）；政策证据 PARTIAL，禁止将模板 criterion 视为 PolicyVersion 或学校授权。", objectType: 'person', displayName: { template: "研究生中期考核与培养进展审核" },
  fields:     [
    {
      "key": "F001",
      "label": "student_id",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F001；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F002",
      "label": "enrollment_status",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F002；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F003",
      "label": "degree_track",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F003；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F004",
      "label": "college_program",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F004；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F005",
      "label": "entry_term_current_term",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F005；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F006",
      "label": "advisor_id_effective",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F006；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F007",
      "label": "plan_id_version",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F007；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F008",
      "label": "proposal_decision_date",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F008；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F009",
      "label": "proposal_changed",
      "kind": "boolean",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F009；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F010",
      "label": "scheduled_midterm_date",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F010；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F011",
      "label": "exception_route",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F011；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F012",
      "label": "exception_approval",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F012；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F013",
      "label": "activity_practice_progress",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F013；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F014",
      "label": "coursework_summary",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F014；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F015",
      "label": "low_grade_cohort_basis",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F015；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F016",
      "label": "research_outputs",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F016；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F017",
      "label": "thesis_progress_report（document ref；准备）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F017；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F018",
      "label": "midterm_form（document ref；准备）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F018；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F019",
      "label": "advisor_review（signed ref；导师审）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F019；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F020",
      "label": "committee_record（signed ref；评审）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F020；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F021",
      "label": "assessment_grade",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F021；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F022",
      "label": "published_at",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F022；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F023",
      "label": "rectification_ref（document ref；后续）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F023；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F024",
      "label": "previous_attempt",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F024；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F025",
      "label": "appeal_event",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F025；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F026",
      "label": "appeal_decision（signed ref；复议）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F026；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F027",
      "label": "evidence_revision",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F027；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F028",
      "label": "downstream_ref",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F028；字段语义来自研究模板字段字典。"
    }
  ],
  materialSlots:     [
    {
      "id": "M001",
      "name": "学籍/培养身份快照；研究生院[A]权威记录",
      "purpose": "M001；学籍/培养身份快照；研究生院[A]权威记录；立案；F001–F005；R001–R003；SRC-001/002",
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
        "原文证明目的：学籍/培养身份快照；研究生院[A]权威记录",
        "关联字段：F001、F002、F003、F004、F005",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M001；学籍/培养身份快照；研究生院[A]权威记录；立案；F001–F005；R001–R003；SRC-001/002"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "有效导师和培养计划；系统[A]批准版/部门认证纸本",
      "purpose": "M002；有效导师和培养计划；系统[A]批准版/部门认证纸本；资格；F006–F007；R004–R005；SRC-001/008",
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
        "原文证明目的：有效导师和培养计划；系统[A]批准版/部门认证纸本",
        "关联字段：F006、F007",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M002；有效导师和培养计划；系统[A]批准版/部门认证纸本；资格；F006–F007；R004–R005；SRC-001/008"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "已通过的开题及变更记录；学院[A]原始结果/正式系统",
      "purpose": "M003；已通过的开题及变更记录；学院[A]原始结果/正式系统；资格；F008–F009；R006–R008；SRC-001",
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
        "原文证明目的：已通过的开题及变更记录；学院[A]原始结果/正式系统",
        "关联字段：F008、F009",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M003；已通过的开题及变更记录；学院[A]原始结果/正式系统；资格；F008–F009；R006–R008；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "当期中期安排；学院[A]通知、正式排期记录",
      "purpose": "M004；当期中期安排；学院[A]通知、正式排期记录；排期；F010；R009；SRC-001/006",
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
        "原文证明目的：当期中期安排；学院[A]通知、正式排期记录",
        "关联字段：F010",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M004；当期中期安排；学院[A]通知、正式排期记录；排期；F010；R009；SRC-001/006"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "当期中期考核表；学生[C]提交、部门认可格式",
      "purpose": "M005；当期中期考核表；学生[C]提交、部门认可格式；准备；F018；R010；SRC-001",
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
        "原文证明目的：当期中期考核表；学生[C]提交、部门认可格式",
        "关联字段：F018",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M005；当期中期考核表；学生[C]提交、部门认可格式；准备；F018；R010；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "课程及重修成绩；教务[A]成绩单/认证摘录",
      "purpose": "M006；课程及重修成绩；教务[A]成绩单/认证摘录；准备/评审；F014；R011–R012；SRC-001",
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
        "原文证明目的：课程及重修成绩；教务[A]成绩单/认证摘录",
        "关联字段：F014",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M006；课程及重修成绩；教务[A]成绩单/认证摘录；准备/评审；F014；R011–R012；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "同考群体分位统计；教务[A]最小化统计证明",
      "purpose": "M007；同考群体分位统计；教务[A]最小化统计证明；评审；F015；R013；SRC-001",
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
        "原文证明目的：同考群体分位统计；教务[A]最小化统计证明",
        "关联字段：F015",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M007；同考群体分位统计；教务[A]最小化统计证明；评审；F015；R013；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "活动/实践成绩及完成情况；学院/实践单位[A/B]",
      "purpose": "M008；活动/实践成绩及完成情况；学院/实践单位[A/B]；准备；F013；R014；SRC-001",
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
        "原文证明目的：活动/实践成绩及完成情况；学院/实践单位[A/B]",
        "关联字段：F013",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M008；活动/实践成绩及完成情况；学院/实践单位[A/B]；准备；F013；R014；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "论文进展报告及科研计划比对；学生[C]、导师评阅",
      "purpose": "M009；论文进展报告及科研计划比对；学生[C]、导师评阅；准备；F017；R015；SRC-001",
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
        "原文证明目的：论文进展报告及科研计划比对；学生[C]、导师评阅",
        "关联字段：F017",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M009；论文进展报告及科研计划比对；学生[C]、导师评阅；准备；F017；R015；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "论文/录用函/获奖等发生过的成果凭据；期刊/机构[B]",
      "purpose": "M010；论文/录用函/获奖等发生过的成果凭据；期刊/机构[B]；条件性准备；F016；R016；SRC-001/003",
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
        "原文证明目的：论文/录用函/获奖等发生过的成果凭据；期刊/机构[B]",
        "关联字段：F016",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M010；论文/录用函/获奖等发生过的成果凭据；期刊/机构[B]；条件性准备；F016；R016；SRC-001/003"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "导师书面综合评价/签名考核表；导师[A]",
      "purpose": "M011；导师书面综合评价/签名考核表；导师[A]；导师审后；F019；R017；SRC-001",
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
        "原文证明目的：导师书面综合评价/签名考核表；导师[A]",
        "关联字段：F019",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M011；导师书面综合评价/签名考核表；导师[A]；导师审后；F019；R017；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "评审专家/会议记录/等级意见；学院[A]",
      "purpose": "M012；评审专家/会议记录/等级意见；学院[A]；评审后；F020–F021；R018–R019；SRC-001",
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
        "原文证明目的：评审专家/会议记录/等级意见；学院[A]",
        "关联字段：F020、F021",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M012；评审专家/会议记录/等级意见；学院[A]；评审后；F020–F021；R018–R019；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "正式结果公布/送达及考核结果归档；学院[A]",
      "purpose": "M013；正式结果公布/送达及考核结果归档；学院[A]；发布后；F021–F022；R020；SRC-001",
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
        "原文证明目的：正式结果公布/送达及考核结果归档；学院[A]",
        "关联字段：F021、F022",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M013；正式结果公布/送达及考核结果归档；学院[A]；发布后；F021–F022；R020；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "国境外远程书面申请及导师/学院同意；学生[C]+部门[A]",
      "purpose": "M014；国境外远程书面申请及导师/学院同意；学生[C]+部门[A]；例外触发；F011–F012；R021；SRC-001",
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
        "原文证明目的：国境外远程书面申请及导师/学院同意；学生[C]+部门[A]",
        "关联字段：F011、F012",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M014；国境外远程书面申请及导师/学院同意；学生[C]+部门[A]；例外触发；F011–F012；R021；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "提前毕业申请、导师同意、学院审核、研院备案；各签发方[A]",
      "purpose": "M015；提前毕业申请、导师同意、学院审核、研院备案；各签发方[A]；例外触发；F012；R022；SRC-001",
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
        "原文证明目的：提前毕业申请、导师同意、学院审核、研院备案；各签发方[A]",
        "关联字段：F012",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M015；提前毕业申请、导师同意、学院审核、研院备案；各签发方[A]；例外触发；F012；R022；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "良好以上后修改计划及导师确认；学生[C]+导师[A]",
      "purpose": "M016；良好以上后修改计划及导师确认；学生[C]+导师[A]；等级后；F023；R023；SRC-001",
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
        "原文证明目的：良好以上后修改计划及导师确认；学生[C]+导师[A]",
        "关联字段：F023",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M016；良好以上后修改计划及导师确认；学生[C]+导师[A]；等级后；F023；R023；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "合格后整改报告及导师确认；学生[C]+导师[A]",
      "purpose": "M017；合格后整改报告及导师确认；学生[C]+导师[A]；等级后；F023；R024；SRC-001",
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
        "原文证明目的：合格后整改报告及导师确认；学生[C]+导师[A]",
        "关联字段：F023",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M017；合格后整改报告及导师确认；学生[C]+导师[A]；等级后；F023；R024；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "首次不合格正式结果、重考安排及第二次记录；学院[A]",
      "purpose": "M018；首次不合格正式结果、重考安排及第二次记录；学院[A]；重考；F024；R025–R026；SRC-001",
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
        "原文证明目的：首次不合格正式结果、重考安排及第二次记录；学院[A]",
        "关联字段：F024",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M018；首次不合格正式结果、重考安排及第二次记录；学院[A]；重考；F024；R025–R026；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "首级复议申请、送达证据、培养单位处理；学生[C]+学院[A]",
      "purpose": "M019；首级复议申请、送达证据、培养单位处理；学生[C]+学院[A]；复议；F025–F026；R027–R028；SRC-001",
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
        "原文证明目的：首级复议申请、送达证据、培养单位处理；学生[C]+学院[A]",
        "关联字段：F025、F026",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M019；首级复议申请、送达证据、培养单位处理；学生[C]+学院[A]；复议；F025–F026；R027–R028；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "二级书面复议与研究生院专家处理；学生[C]+研院[A]",
      "purpose": "M020；二级书面复议与研究生院专家处理；学生[C]+研院[A]；二级复议；F025–F026；R029；SRC-001",
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
        "原文证明目的：二级书面复议与研究生院专家处理；学生[C]+研院[A]",
        "关联字段：F025、F026",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M020；二级书面复议与研究生院专家处理；学生[C]+研院[A]；二级复议；F025–F026；R029；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "撤回/补件/更正事件及版本关联；事件服务[A]",
      "purpose": "M021；撤回/补件/更正事件及版本关联；事件服务[A]；全程；F027；R030；SRC-001（操作细则待核）",
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
        "原文证明目的：撤回/补件/更正事件及版本关联；事件服务[A]",
        "关联字段：F027",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M021；撤回/补件/更正事件及版本关联；事件服务[A]；全程；F027；R030；SRC-001（操作细则待核）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "学籍分流或后续学位独立业务决定；有权单位[A]",
      "purpose": "M022；学籍分流或后续学位独立业务决定；有权单位[A]；仅下游衔接；F028；R031；SRC-002/004",
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
        "原文证明目的：学籍分流或后续学位独立业务决定；有权单位[A]",
        "关联字段：F028",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M022；学籍分流或后续学位独立业务决定；有权单位[A]；仅下游衔接；F028；R031；SRC-002/004"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  sections:   [
    {
      "id": "review-rules",
      "name": "审核规则",
      "order": 0,
      "required": false,
      "criteria": [
        {
          "id": "R001",
          "title": "立案总触发；无研究生对象 F/U",
          "requirement": "R001；立案总触发；无研究生对象 F/U；F001,M001；学号与在籍系统同人；SRC-001/002；PASS/CONFLICT/SOURCE_UNAVAILABLE→研究生院身份管理员",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "已识别在籍研究生",
          "requirement": "R002；已识别在籍研究生；F002,M001；核状态与当期可参加资格；SRC-001/002；PASS 或 POLICY_UNCONFIRMED（休学/特殊学籍细则）→学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "立案有学段",
          "requirement": "R003；立案有学段；F003–F005,M001；硕/博/直博及学期与方案一致；SRC-001 第41条；PASS/CONFLICT→学院",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "进入导师审",
          "requirement": "R004；进入导师审；F006,M002；导师生效记录与签发人一致；SRC-001 第44条；PASS/CONFLICT→导师管理业务",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "进入材料准备",
          "requirement": "R005；进入材料准备；F007,M002；计划为当期有效版；SRC-001 第42条；PASS/NEEDS_MATERIAL→培养单位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "常规中期",
          "requirement": "R006；常规中期；F008,M003；开题已有效通过；SRC-001 第34、40–41条；PASS/CONFLICT→S08-T03",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "常规且无有效例外",
          "requirement": "R007；常规且无有效例外；F003,F008,F010,M003–M004；硕≥半年、博≥一年（日期计算及周年边界由学院核）；SRC-001 第41、50条；PASS/NEEDS_HUMAN_DECISION→学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "开题方向发生重大变更",
          "requirement": "R008；开题方向发生重大变更；F009,M003；是否已有重开题有效结论；SRC-001 第38条；PASS/NEEDS_HUMAN_DECISION→S08-T03",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "已排期",
          "requirement": "R009；已排期；F003,F005,F010,M001,M004；非直博第六/直博第七学期节点及学院日程，逾期不自动退学；SRC-001 第41条；PASS/POLICY_UNCONFIRMED→学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "学生提交阶段",
          "requirement": "R010；学生提交阶段；F018,M005；考核表归属、版次、必填事实及签署；SRC-001 第43条；PASS/NEEDS_MATERIAL→学生",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "检查课程执行",
          "requirement": "R011；检查课程执行；F007,F014,M002,M006；按生效计划比对课程/学分/未完成项；SRC-001 第42条；PASS/CONFLICT→教务/学院",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "硕士评审且有课程重修",
          "requirement": "R012；硕士评审且有课程重修；F003,F014,M006；计考试重修课程数是否≥2；SRC-001 第47条；PASS_FACT（仅事实）/NEEDS_HUMAN_DECISION（等级上限）→评审小组",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "硕士评审且可取统一考试群体数据",
          "requirement": "R013；硕士评审且可取统一考试群体数据；F003,F015,M006–M007；核≥3门必修在同考群体末5%，须包含作为选修课参加考试者；SRC-001 第47条；PASS_FACT（仅统计）/SOURCE_UNAVAILABLE，等级由小组决定→教务/小组",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "准备环节",
          "requirement": "R014；准备环节；F007,F013,M002,M008；实践/学术活动完成与计划比对，未到期不能报缺；SRC-001 第42条；PASS/NEEDS_MATERIAL→培养单位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "准备环节",
          "requirement": "R015；准备环节；F008,F017,M003,M009；论文题目、研究内容、进度相符性列证据差异；SRC-001 第42–43条；PASS_FACT（仅文本一致）/NEEDS_HUMAN_DECISION（科研质量）→导师/小组",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "申报了论文/获奖/成果",
          "requirement": "R016；申报了论文/获奖/成果；F016,M010；逐件核机构、日期、作者和本人关联；无成果时 F→不适用；SRC-001 第43条；PASS/CONFLICT；权属争议→G06",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "导师意见形成阶段",
          "requirement": "R017；导师意见形成阶段；F006,F019,M002,M011；签发导师是否有效、评价和建议是否存在；SRC-001 第44条；PASS/NEEDS_MATERIAL→导师",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "评审完成阶段",
          "requirement": "R018；评审完成阶段；F020,M012；小组记录与学院组织批次相符；具体成员细则未取；SRC-001 第45条；PASS/POLICY_UNCONFIRMED→学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "等级已正式签发",
          "requirement": "R019；等级已正式签发；F021,M012；四档允许值和签发主体核验；SRC-001 第47条；PASS/CONFLICT，主观等级不自动生成→小组",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "已发布等级",
          "requirement": "R020；已发布等级；F021–F022,M013；发布版与评审签发版一致并锁定发布日；SRC-001 第49条；PASS/SOURCE_UNAVAILABLE→学院",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "F011=国境外远程",
          "requirement": "R021；F011=国境外远程；F011–F012,M014；本人书面申请+导师/学院同意后方使用远程/通讯；SRC-001 第46条；PASS/NEEDS_HUMAN_DECISION→学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "F011=提前毕业间隔例外",
          "requirement": "R022；F011=提前毕业间隔例外；F012,M015；本人申请、导师同意、学院审核、研院备案全链；SRC-001 第50条；PASS（链条完整）/POLICY_UNCONFIRMED（放宽幅度）→学院/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "已发布等级良好/优秀",
          "requirement": "R023；已发布等级良好/优秀；F021,F023,M013,M016；下一步计划修改+导师确认；SRC-001 第48条；PASS/NEEDS_MATERIAL→导师",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "已发布等级合格",
          "requirement": "R024；已发布等级合格；F021,F023,M013,M017；整改报告依专家意见、导师确认；SRC-001 第48条；PASS/NEEDS_MATERIAL→导师",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "首次中期不合格、拟重考",
          "requirement": "R025；首次中期不合格、拟重考；F021,F024,M013,M018；两次考试间隔≥3个月；SRC-001 第48条；PASS/CONFLICT→学院",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "第二次结果已签发",
          "requirement": "R026；第二次结果已签发；F024,F021,M018；两个真实 attempt/等级；两次不合格只产生分流转办；SRC-001 第48条；PASS/NEEDS_HUMAN_DECISION→有权学籍单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "首级复议已提交",
          "requirement": "R027；首级复议已提交；F022,F025,M013,M019；发布日起15日窗口，发布日未知不得判逾期；SRC-001 第49条；PASS/CONFLICT/POLICY_UNCONFIRMED→培养单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "培养单位复议已处理",
          "requirement": "R028；培养单位复议已处理；F025–F026,M019；核受理与处理签发、送达；SRC-001 第49条；PASS/NEEDS_HUMAN_DECISION→培养单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "二级复议提出",
          "requirement": "R029；二级复议提出；F025–F026,M019–M020；有首级决定且书面申请，二级时限无校本明文；SRC-001 第49条；PASS/POLICY_UNCONFIRMED→研究生院专家组织",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "补件/撤回/更正事件发生",
          "requirement": "R030；补件/撤回/更正事件发生；F027,M021；权限、版本、事件时序、受影响字段与旧证据保留；SRC-001（流程细节待核）；PASS/NEEDS_HUMAN_DECISION→受理单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "两次未过或下游申请引用中期结果",
          "requirement": "R031；两次未过或下游申请引用中期结果；F021,F024,F028,M018,M022；引用真实中期签发结果，不生成学籍/学位批准；SRC-001 第40、48条；SRC-002/004；PASS/NEEDS_HUMAN_DECISION→分流/答辩有权单位",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  policyVersionIds: [], stages:     [
    {
      "id": "registered",
      "name": "REGISTERED：立案与身份基线",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "eligibility-check"
    },
    {
      "id": "eligibility-check",
      "name": "ELIGIBILITY_CHECK：培养资格与开题事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "student-materials"
    },
    {
      "id": "student-materials",
      "name": "STUDENT_MATERIALS：中期材料准备",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "advisor-review"
    },
    {
      "id": "advisor-review",
      "name": "ADVISOR_REVIEW：导师意见核验",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "nextStageId": "committee-review"
    },
    {
      "id": "committee-review",
      "name": "COMMITTEE_REVIEW：学院组织与等级事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "result-published"
    },
    {
      "id": "result-published",
      "name": "RESULT_PUBLISHED：已发布结果核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "follow-up"
    },
    {
      "id": "follow-up",
      "name": "PLAN_CONFIRM / RECTIFICATION / REEXAM / RECONSIDERATION：条件分流待人工处理",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "archived"
    },
    {
      "id": "archived",
      "name": "ARCHIVED：归档事实核验",
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
  templateId: "S08-T04", name: "研究生中期考核与培养进展审核", sourceDocumentPath: "docs/design/review-agent/business-templates/R02/S08-T04.md", sourceDocumentSha256: "df0265569e6213739b24a35496410566faadd822a89a26f43972b38f5f9af275",
  originalSourceDocumentPath: "docs/design/review-agent/business-templates/R02/research-original/S08-T04.md", originalSourceSha256: "0c16b9bf4cbf3c8e38c896d22c4bc64ecb5a3e8921c38665810e4679526ce9e1", manifestSha256: "0c16b9bf4cbf3c8e38c896d22c4bc64ecb5a3e8921c38665810e4679526ce9e1", manifestHashCheck: true,
  officialSchoolTemplate: false, researchDate: '2026-10-24', policyEvidenceStatus: 'PARTIAL',
  sourceEvidence:   [
    {
      srcId: "SRC-001",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-001 | 成都理工大学，成理校研〔2021〕12号《研究生培养环节管理办法（试行）》 https://energy.cdut.edu.cn/__local/B/66/CD/D11DA75E84C7FCDD25CBC557422_EF1ADD3A_555F8.pdf | 2021-06-09；PDF 18页；第33–38、40–53条；全体研究生；自印发试行 | CDUT-VERIFI"
    },
    {
      srcId: "SRC-002",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-002 | 成都理工大学，成理校研〔2021〕13号《研究生学籍管理办法》 https://dbxb.cdut.edu.cn/xxgkwz/info/1032/2549.htm | 2021文件，2023公开；原稿线索第2、8、30、45条；全日制/非全日制 | CURRENTITY-UNKNOWN；本次网页 412，保留旧稿线索，不能作为本轮已核的分流签批权限 |"
    },
    {
      srcId: "SRC-003",
      evidenceStatus: "VERIFIED",
      title: "| SRC-003 | 成都理工大学，成理校研〔2025〕17号工程类博士学位论文与申请学位实践成果细则 https://cnae.cdut.edu.cn/__local/7/DF/6D/BD6CDE5F1009E83D74AFDBDBF64_7BC2F78A_BFB2C.pdf | 2025-06-24；PDF 16页；第2–3及中期/后续成果相关部分；工程类专业博士 | CDUT-VERIFI"
    },
    {
      srcId: "SRC-004",
      evidenceStatus: "VERIFIED",
      title: "| SRC-004 | 研究生院等，成理研〔2026〕1号《2026年博士、硕士研究生毕业答辩和学位申请工作安排》 https://gra.cdut.edu.cn/__local/9/BC/89/D76B59272CC862FACEE252AAA16_C6BD07A3_4A2BD.pdf | 2026-01-06；PDF 3页；第1页资格、第2页预审送审、第3页答辩学位；2026学位批次 | CD"
    },
    {
      srcId: "SRC-005",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-005 | 环境与土木工程学院《081800地质资源与地质工程》介绍 https://cece.cdut.edu.cn/info/1110/5257.htm | 原稿记录2026-03-24，培养环节办法后续援引；对应学位点 | CURRENTITY-UNKNOWN；本次 412，旧稿的2026援引不能当全面现行确认 |"
    },
    {
      srcId: "SRC-006",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-006 | 能源学院研究生公告索引 https://energy.cdut.edu.cn/yjsjyy/tzgg.htm | 原稿记有2026-06-19博士开题与中期通知；只涉学院批次 | CURRENTITY-UNKNOWN；本次 412且单篇未得，不能推全校时间 |"
    },
    {
      srcId: "SRC-007",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-007 | 研究生院2016年中期考核通知 https://gra.cdut.edu.cn/__local/6/EE/82/DA43E17867B2C9152F33FD7DE5E_96902443_21703.pdf?e=.pdf | 2016历史批次；旧稿引第1–3页；与2021等级冲突 | CURRENTITY-UNKNOWN（历史对照），绝不使用“基本合格”、首次不合格即退学等旧"
    },
    {
      srcId: "SRC-008",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-008 | 学校《研究生培养计划表》静态表单 https://gra.cdut.edu.cn/__local/9/BC/D8/69F93B0F84BF88991B5055532D6_549DAACF_2072F.pdf?e=.pdf | 旧稿引第1–4页；表单无明确版次 | CURRENTITY-UNKNOWN；仅作字段线索，不据此设现行学分阈值 |"
    }
  ],
  criteria:   [
    {
      "sectionId": "review-rules",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R018",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R026",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R027",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R028",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R029",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
}
