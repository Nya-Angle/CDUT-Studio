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
  templateId: "S08-T03", version: 1, schemaVersion: 2, name: "硕博研究生学位论文开题资格和报告审核",
  description: "本地研究模板 · 非校方正式模板。硕博研究生学位论文开题资格和报告审核；仅供本地材料核验、证据覆盖检查和人工审阅建议，不构成学校正式审批。政策证据状态：PARTIAL。",
  catalogKind: 'builtin', sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 非校方正式模板；研究原件 docs/design/review-agent/business-templates/R02/research-original/S08-T03.md（原件文件 SHA-256=c0adc04b868793000b1ab0e996ca4a1b29fe1059a11c5d4e0500bf131c1db284）；审阅后来源文档 docs/design/review-agent/business-templates/R02/S08-T03.md（SHA-256=c0adc04b868793000b1ab0e996ca4a1b29fe1059a11c5d4e0500bf131c1db284）；政策证据 PARTIAL，禁止将模板 criterion 视为 PolicyVersion 或学校授权。", objectType: 'person', displayName: { template: "硕博研究生学位论文开题资格和报告审核" },
  fields:     [
    {
      "key": "F001",
      "label": "学号／Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F001；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F002",
      "label": "法定姓名／Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F002；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F003",
      "label": "学籍/在读资格／Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F003；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F004",
      "label": "硕士/博士层次／Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F004；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F005",
      "label": "普通博士/直博/硕博连读路径／Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F005；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F006",
      "label": "学术/专业及工程博士论文路径／Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F006；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F007",
      "label": "学科、学院、培养单位／Student",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F007；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F008",
      "label": "date+int 入学日期、当前有效学期／Student",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F008；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F009",
      "label": "培养计划 ID、有效版次／TrainingPlan",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F009；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F010",
      "label": "课程应修/已修学分及完成结论／TrainingPlan",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F010；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F011",
      "label": "enum+date? 中期考核既有状态／TrainingPlan",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F011；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F012",
      "label": "string+validity 当前导师 ID/指导关系／Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F012；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F013",
      "label": "首次/失败重试/重大改题等申请理由／Application",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F013；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F014",
      "label": "申请提交/受理时间／Application",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F014；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F015",
      "label": "本次论文题目／ReportRevision",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F015；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F016",
      "label": "报告版本、内容指纹、形成时间／ReportRevision",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F016；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F017",
      "label": "报告正文计字、必要栏目/引用覆盖线索／ReportRevision",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F017；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F018",
      "label": "event 导师审阅同意及所绑定版本／Application",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F018；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F019",
      "label": "适用校本政策、学科细则/有效期／TrainingPlan",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F019；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F020",
      "label": "会议批次/计划时间地点／PanelEvent",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F020；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F021",
      "label": "评审成员身份/职称或导师资格／PanelEvent",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F021；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F022",
      "label": "组长、秘书及导师回避关系／PanelEvent",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F022；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F023",
      "label": "datetime+uri 开题公告日期、可公开事项／PanelEvent",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F023；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F024",
      "label": "实际会议日期、参加/汇报时长、方式／PanelEvent",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F024；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F025",
      "label": "enum+text 小组意见、等级/通过状态／OfficialOutcome",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F025；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F026",
      "label": "评议签署、组别、报告绑定版本／OfficialOutcome",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F026；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F027",
      "label": "enum+datetime 教务系统录入等级、时间／OfficialOutcome",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F027；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F028",
      "label": "秘书移交、学院归档凭证／OfficialOutcome",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F028；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F029",
      "label": "通过后修订报告与导师确认／ReportRevision",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F029；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F030",
      "label": "前次开题 attempt、日期及有效等级／Application",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F030；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F031",
      "label": "重大改题的申请、导师/学院审批状态／Application",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F031；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F032",
      "label": "date+reference 工程博士企业实践进入时间/情况／TrainingPlan",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F032；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F033",
      "label": "enum+token? 涉密开题的安全转介/许可状态／Application",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F033；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F034",
      "label": "提前毕业放宽备案链及适用范围／Application",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F034；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F035",
      "label": "结果正式公布时间及版本／OfficialOutcome",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F035；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F036",
      "label": "第一次复议申请、提交/受理时间／ReviewRequest",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F036；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F037",
      "label": "学院第一次复议正式处理结论／ReviewRequest",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F037；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F038",
      "label": "向研究生院第二次书面复议申请／ReviewRequest",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F038；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F039",
      "label": "研究生院复议专家审核及决定／ReviewRequest",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F039；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F040",
      "label": "撤回申请与有权受理状态／Application",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F040；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F041",
      "label": "所有签发者可信身份/角色/授权时点／AuditReference",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F041；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F042",
      "label": "材料原始定位、hash、版本、来源可用性／AuditReference",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F042；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F043",
      "label": "array<ref> G50/S/T 等上游真实结论引用／AuditReference",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F043；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F044",
      "label": "enum+ref 本案当前阶段、attempt、材料/结论状态／Application",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F044；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    }
  ],
  materialSlots:     [
    {
      "id": "M001",
      "name": "确认学生在读身份、培养层次、学科及学期；研究生院/学籍管理者",
      "purpose": "M001 确认学生在读身份、培养层次、学科及学期；研究生院/学籍管理者；学籍权威记录/授权核验摘录，不是自行编写的在读证明；姓名、学号、在读层次等；当前必需 P0；可信校方查询优先，系统不通时可由学院经办核实盖章证明，不强制本人重复上传；F001–F008；SRC-001；以学籍生效时点/学生键为版次；缺源 SOURCE_UNAVAILABLE，姓名冲突 CONFLICT，扫描不可读 UNREADABLE",
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
        "原文证明目的：确认学生在读身份、培养层次、学科及学期；研究生院/学籍管理者",
        "关联字段：F001、F008",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M001 确认学生在读身份、培养层次、学科及学期；研究生院/学籍管理者；学籍权威记录/授权核验摘录，不是自行编写的在读证明；姓名、学号、在读层次等；当前必需 P0；可信校方查询优先，系统不通时可由学院经办核实盖章证明，不强制本人重复上传；F001–F008；SRC-001；以学籍生效时点/学生键为版次；缺源 SOURCE_UNAVAILABLE，姓名冲突 CONFLICT，扫描不可读 UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "核培养计划和课程学分、既有中期状态；研究生院教务/学院",
      "purpose": "M002 核培养计划和课程学分、既有中期状态；研究生院教务/学院；已批准的个人培养计划及学分成绩/课程认定记录，系统 planId/version；当前必需 P0/P1；校方可信系统/学校签发导出任选，院系个案确认；F009–F011；SRC-001/007；学号+培养方案批准版次；数据暂缺记来源不可用，互斥课程记录 CONFLICT，不拿学生自述当通过",
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
        "原文证明目的：核培养计划和课程学分、既有中期状态；研究生院教务/学院",
        "关联字段：F009、F011",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M002 核培养计划和课程学分、既有中期状态；研究生院教务/学院；已批准的个人培养计划及学分成绩/课程认定记录，系统 planId/version；当前必需 P0/P1；校方可信系统/学校签发导出任选，院系个案确认；F009–F011；SRC-001/007；学号+培养方案批准版次；数据暂缺记来源不可用，互斥课程记录 CONFLICT，不拿学生自述当通过"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "核本次有效导师及指导关系；导师管理/学院",
      "purpose": "M003 核本次有效导师及指导关系；导师管理/学院；学校导师匹配、有效任职及关系记录；当前必需 P0；正式导师变更决定的有效引用可替代旧名册；F012/F022；SRC-001；按有效期和学校导师 ID；缺 SOURCE_UNAVAILABLE，签字人与现导师不一致 CONFLICT",
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
        "原文证明目的：核本次有效导师及指导关系；导师管理/学院",
        "关联字段：F012、F022",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M003 核本次有效导师及指导关系；导师管理/学院；学校导师匹配、有效任职及关系记录；当前必需 P0；正式导师变更决定的有效引用可替代旧名册；F012/F022；SRC-001；按有效期和学校导师 ID；缺 SOURCE_UNAVAILABLE，签字人与现导师不一致 CONFLICT"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "本人本次开题申请意愿和用途；本人提交、学院接收",
      "purpose": "M004 本人本次开题申请意愿和用途；本人提交、学院接收；申请事实事件/签收记录，现用纸质或电子表式待学校核；当前必需 P1；可信本人校内账号提交或经真实身份核验的纸质申请，代办条件未知；F013/F014/F015/F040；SRC-001 第三十六条；每申请/attempt 独立；缺 NEEDS_MATERIAL，不可读 UNREADABLE，无法确认本人身份待人工",
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
        "原文证明目的：本人本次开题申请意愿和用途；本人提交、学院接收",
        "关联字段：F013、F014、F015、F040",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M004 本人本次开题申请意愿和用途；本人提交、学院接收；申请事实事件/签收记录，现用纸质或电子表式待学校核；当前必需 P1；可信本人校内账号提交或经真实身份核验的纸质申请，代办条件未知；F013/F014/F015/F040；SRC-001 第三十六条；每申请/attempt 独立；缺 NEEDS_MATERIAL，不可读 UNREADABLE，无法确认本人身份待人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "报告内容、题目、版本、字数候选；本人/导师",
      "purpose": "M005 报告内容、题目、版本、字数候选；本人/导师；书面《学位论文开题报告》正文原件/受控数字版；2021 .doc 结构未读全；当前必需 P2（导师审阅前）；依学院批准形式可用纸质或电子正文，不得用答辩 PPT 当然代替书面报告；F015–F017；SRC-001/006；attempt + reportHash + revision；缺 NEEDS_MATERIAL，抽取失败 UNREADABLE，计字争议 NEEDS_HUMAN_DECISION",
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
        "原文证明目的：报告内容、题目、版本、字数候选；本人/导师",
        "关联字段：F015、F017",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M005 报告内容、题目、版本、字数候选；本人/导师；书面《学位论文开题报告》正文原件/受控数字版；2021 .doc 结构未读全；当前必需 P2（导师审阅前）；依学院批准形式可用纸质或电子正文，不得用答辩 PPT 当然代替书面报告；F015–F017；SRC-001/006；attempt + reportHash + revision；缺 NEEDS_MATERIAL，抽取失败 UNREADABLE，计字争议 NEEDS_HUMAN_DECISION"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "证明导师对该版报告审阅同意；真实导师/学院",
      "purpose": "M006 证明导师对该版报告审阅同意；真实导师/学院；校内导师签核记录或校方核验的纸质签名同意区；当前必需 P2 完成时；导师未签前“待导师审阅”，不是申请初始缺件；纸质替代必须验真；F012/F016/F018/F041；SRC-001 第三十五、三十六条；绑定报告 hash 和导师任职有效日；缺 NEEDS_MATERIAL，假签/变更导师 CONFLICT",
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
        "原文证明目的：证明导师对该版报告审阅同意；真实导师/学院",
        "关联字段：F012、F016、F018、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M006 证明导师对该版报告审阅同意；真实导师/学院；校内导师签核记录或校方核验的纸质签名同意区；当前必需 P2 完成时；导师未签前“待导师审阅”，不是申请初始缺件；纸质替代必须验真；F012/F016/F018/F041；SRC-001 第三十五、三十六条；绑定报告 hash 和导师任职有效日；缺 NEEDS_MATERIAL，假签/变更导师 CONFLICT"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "适用学校规则、学院已备案细则及培养方案；研究生院/培养单位",
      "purpose": "M007 适用学校规则、学院已备案细则及培养方案；研究生院/培养单位；成理校研原文、学科培养方案、院系实施细则与版本生效链（policyId+cohort+degreeType+unit+effectiveFrom/To+sourceUri+verifiedBy）；当前必需的配置 P0（不是学生材料）；以正式原文/经有权确认配置作为合法替代；F006/F007/F009/F019；SRC-001/002/007/011/012；学科+入学级+适用日期的 profile；2026 改版实际生效范围未证、细则缺失或互斥版本 →POLICY_UNCONFIRMED/CONFLICT，不得借外校数值填空",
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
        "原文证明目的：适用学校规则、学院已备案细则及培养方案；研究生院/培养单位",
        "关联字段：F006、F007、F009、F019",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M007 适用学校规则、学院已备案细则及培养方案；研究生院/培养单位；成理校研原文、学科培养方案、院系实施细则与版本生效链（policyId+cohort+degreeType+unit+effectiveFrom/To+sourceUri+verifiedBy）；当前必需的配置 P0（不是学生材料）；以正式原文/经有权确认配置作为合法替代；F006/F007/F009/F019；SRC-001/002/007/011/012；学科+入学级+适用日期的 profile；2026 改版实际生效范围未证、细则缺失或互斥版本 →POLICY_UNCONFIRMED/CONFLICT，不得借外校数值填空"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "确认开题会批次、成员及分工；培养单位",
      "purpose": "M008 确认开题会批次、成员及分工；培养单位；排会通知、学院组织审批/专家名册/秘书任命；后续才产生 P3；授权学院内部会议安排可替代公开页，不能用学生拟邀名单认定组建；F020–F022；SRC-001/005；会议/改排版本；缺 NEEDS_MATERIAL，公告与名册冲突 CONFLICT",
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
        "原文证明目的：确认开题会批次、成员及分工；培养单位",
        "关联字段：F020、F022",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M008 确认开题会批次、成员及分工；培养单位；排会通知、学院组织审批/专家名册/秘书任命；后续才产生 P3；授权学院内部会议安排可替代公开页，不能用学生拟邀名单认定组建；F020–F022；SRC-001/005；会议/改排版本；缺 NEEDS_MATERIAL，公告与名册冲突 CONFLICT"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "证明委员职称/博硕导师资格及行业身份；学院/师资、人事权威源",
      "purpose": "M009 证明委员职称/博硕导师资格及行业身份；学院/师资、人事权威源；有效导师/职称/行业专家身份记录及确认事件；后续才产生 P3 且按专业/跨学科条件核；学校师资、行业聘任单位可信回函可替代单独证书；F021/F022/F041；SRC-001 第三十六条；与实际参会人员/有效时间绑定；缺 SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION，不凭头衔 OCR 定论",
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
        "原文证明目的：证明委员职称/博硕导师资格及行业身份；学院/师资、人事权威源",
        "关联字段：F021、F022、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M009 证明委员职称/博硕导师资格及行业身份；学院/师资、人事权威源；有效导师/职称/行业专家身份记录及确认事件；后续才产生 P3 且按专业/跨学科条件核；学校师资、行业聘任单位可信回函可替代单独证书；F021/F022/F041；SRC-001 第三十六条；与实际参会人员/有效时间绑定；缺 SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION，不凭头衔 OCR 定论"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "确认应公开开题的会前公告；学院",
      "purpose": "M010 确认应公开开题的会前公告；学院；学院官方网页、归档截图附官网 URL 和发布日志；后续才产生 P3；官网源不可读可用学院存档公告及发布证明；涉密不适用普通公开槽；F020/F023；SRC-001/005/010；以发布时间及更正公告版本归属；缺 NEEDS_MATERIAL，源失联 SOURCE_UNAVAILABLE",
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
        "原文证明目的：确认应公开开题的会前公告；学院",
        "关联字段：F020、F023",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M010 确认应公开开题的会前公告；学院；学院官方网页、归档截图附官网 URL 和发布日志；后续才产生 P3；官网源不可读可用学院存档公告及发布证明；涉密不适用普通公开槽；F020/F023；SRC-001/005/010；以发布时间及更正公告版本归属；缺 NEEDS_MATERIAL，源失联 SOURCE_UNAVAILABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "确认实际会议及学生汇报、答辩事实；会议秘书/学院",
      "purpose": "M011 确认实际会议及学生汇报、答辩事实；会议秘书/学院；会议记录、签到与实际开始/结束时间或经学院确认的现场记录；后续才产生 P4；经授权秘书签署纪要可代设备时钟，不可用计划日程代替实际；F020/F024；SRC-001 第三十六条；eventId + heldAt；缺 NEEDS_MATERIAL，影像无法读 UNREADABLE，学术情况由人判断",
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
        "原文证明目的：确认实际会议及学生汇报、答辩事实；会议秘书/学院",
        "关联字段：F020、F024",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M011 确认实际会议及学生汇报、答辩事实；会议秘书/学院；会议记录、签到与实际开始/结束时间或经学院确认的现场记录；后续才产生 P4；经授权秘书签署纪要可代设备时钟，不可用计划日程代替实际；F020/F024；SRC-001 第三十六条；eventId + heldAt；缺 NEEDS_MATERIAL，影像无法读 UNREADABLE，学术情况由人判断"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "证明评审组集体意见、等级与签署；评审组/秘书",
      "purpose": "M012 证明评审组集体意见、等级与签署；评审组/秘书；完整的纸质开题报告评议页/有权数字签署记录，校方核验；后续才产生 P5；学校正式原件与授权教务记录相互核对，单方手写截图不是合法替代；F025/F026/F030/F041；SRC-001 第三十六至三十八条；attemptId + panel + reportHash；缺 NEEDS_MATERIAL，模糊 UNREADABLE，意见与等级异同 CONFLICT",
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
        "原文证明目的：证明评审组集体意见、等级与签署；评审组/秘书",
        "关联字段：F025、F026、F030、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M012 证明评审组集体意见、等级与签署；评审组/秘书；完整的纸质开题报告评议页/有权数字签署记录，校方核验；后续才产生 P5；学校正式原件与授权教务记录相互核对，单方手写截图不是合法替代；F025/F026/F030/F041；SRC-001 第三十六至三十八条；attemptId + panel + reportHash；缺 NEEDS_MATERIAL，模糊 UNREADABLE，意见与等级异同 CONFLICT"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "证明秘书移交、学院录入与归档；秘书/学院",
      "purpose": "M013 证明秘书移交、学院录入与归档；秘书/学院；一周内移交凭证、两周内教务系统等级记录及原件索引；后续才产生 P6；可信教务导出及学院档案索引可代再次让学生提交纸质件；F027/F028；SRC-001 第三十六条；指向 M012 同次开题；缺 SOURCE_UNAVAILABLE 或 NEEDS_MATERIAL，不一致 CONFLICT",
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
        "原文证明目的：证明秘书移交、学院录入与归档；秘书/学院",
        "关联字段：F027、F028",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M013 证明秘书移交、学院录入与归档；秘书/学院；一周内移交凭证、两周内教务系统等级记录及原件索引；后续才产生 P6；可信教务导出及学院档案索引可代再次让学生提交纸质件；F027/F028；SRC-001 第三十六条；指向 M012 同次开题；缺 SOURCE_UNAVAILABLE 或 NEEDS_MATERIAL，不一致 CONFLICT"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "证明通过后按意见修改并获导师确认；本人/导师",
      "purpose": "M014 证明通过后按意见修改并获导师确认；本人/导师；报告修订版、导师真实复核事件；条件必需 P7：仅已通过者；导师校方审批日志可代纸上单独意见；F016/F029；SRC-001 第三十七条；M012 结论后新报告版；缺 NEEDS_MATERIAL，不可读 UNREADABLE；不改原等级",
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
        "原文证明目的：证明通过后按意见修改并获导师确认；本人/导师",
        "关联字段：F016、F029",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M014 证明通过后按意见修改并获导师确认；本人/导师；报告修订版、导师真实复核事件；条件必需 P7：仅已通过者；导师校方审批日志可代纸上单独意见；F016/F029；SRC-001 第三十七条；M012 结论后新报告版；缺 NEEDS_MATERIAL，不可读 UNREADABLE；不改原等级"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "保留前次开题的正式历史记录；学院",
      "purpose": "M015 保留前次开题的正式历史记录；学院；前次报告/评议等级/举行日期/归档标识；条件必需 P8：不合格重试或改题重开；权威教务与受控档案索引可互证；F013/F030/F025；SRC-001 第三十七、三十八条；旧 attemptId 只读；缺 SOURCE_UNAVAILABLE，历史等级矛盾 CONFLICT，禁止旧 Run 冒名",
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
        "原文证明目的：保留前次开题的正式历史记录；学院",
        "关联字段：F013、F030、F025",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M015 保留前次开题的正式历史记录；学院；前次报告/评议等级/举行日期/归档标识；条件必需 P8：不合格重试或改题重开；权威教务与受控档案索引可互证；F013/F030/F025；SRC-001 第三十七、三十八条；旧 attemptId 只读；缺 SOURCE_UNAVAILABLE，历史等级矛盾 CONFLICT，禁止旧 Run 冒名"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "证明重大题目/方向变更已获同意、审批；本人/导师/学院",
      "purpose": "M016 证明重大题目/方向变更已获同意、审批；本人/导师/学院；《成都理工大学研究生学位论文题目变更申请表》及导师/培养单位审批，具体表本体待核；条件必需 P8：重大变更且重开前；仅学校确认的审批事件可合法替代扫描表；F015/F031/F041；SRC-001 第三十八条；批准的旧/新题目与生效时间版本；缺 NEEDS_MATERIAL，重大程度 NEEDS_HUMAN_DECISION",
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
        "原文证明目的：证明重大题目/方向变更已获同意、审批；本人/导师/学院",
        "关联字段：F015、F031、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M016 证明重大题目/方向变更已获同意、审批；本人/导师/学院；《成都理工大学研究生学位论文题目变更申请表》及导师/培养单位审批，具体表本体待核；条件必需 P8：重大变更且重开前；仅学校确认的审批事件可合法替代扫描表；F015/F031/F041；SRC-001 第三十八条；批准的旧/新题目与生效时间版本；缺 NEEDS_MATERIAL，重大程度 NEEDS_HUMAN_DECISION"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "工程类博士企业实践起点与所选论文方式；培养单位/企业实践管理者",
      "purpose": "M017 工程类博士企业实践起点与所选论文方式；培养单位/企业实践管理者；专项培养方案、进入企业实践的学校/企业互认证明；条件必需 S05 中实际涉及企业实践时；学校实践台账可替代本人上传合同；F006/F032；SRC-002 第三部分（一）；绑定工程博士类别与入企日期；无确证 SOURCE_UNAVAILABLE，例外 POLICY_UNCONFIRMED/H",
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
        "原文证明目的：工程类博士企业实践起点与所选论文方式；培养单位/企业实践管理者",
        "关联字段：F006、F032",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M017 工程类博士企业实践起点与所选论文方式；培养单位/企业实践管理者；专项培养方案、进入企业实践的学校/企业互认证明；条件必需 S05 中实际涉及企业实践时；学校实践台账可替代本人上传合同；F006/F032；SRC-002 第三部分（一）；绑定工程博士类别与入企日期；无确证 SOURCE_UNAVAILABLE，例外 POLICY_UNCONFIRMED/H"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "涉密路径的允许公开的状态引用；学校保密有权部门",
      "purpose": "M018 涉密路径的允许公开的状态引用；学校保密有权部门；不含论文、密级详情、专家名单、项目资料的许可/转介 token（若学校授权）；条件必需 P2S 且只有取得明确系统接入许可才读取；默认无普通系统材料替代，线下涉密办理；F033/F041；SRC-003 第五、十四至十八条；只保留可公开的审批状态版本，绝不留密文 hash；缺或不获授权直接安全转介，不标普通 NEEDS_MATERIAL",
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
        "原文证明目的：涉密路径的允许公开的状态引用；学校保密有权部门",
        "关联字段：F033、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-003",
        "原文槽位定义：M018 涉密路径的允许公开的状态引用；学校保密有权部门；不含论文、密级详情、专家名单、项目资料的许可/转介 token（若学校授权）；条件必需 P2S 且只有取得明确系统接入许可才读取；默认无普通系统材料替代，线下涉密办理；F033/F041；SRC-003 第五、十四至十八条；只保留可公开的审批状态版本，绝不留密文 hash；缺或不获授权直接安全转介，不标普通 NEEDS_MATERIAL"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "证明提前毕业时间例外确获备案；本人/导师/学院/研究生院",
      "purpose": "M019 证明提前毕业时间例外确获备案；本人/导师/学院/研究生院；申请、导师同意、学院审核、研究生院备案的有权链；条件必需：实际请求放宽间隔时，不属于普通开题启动必交；官方备案记录优先；F034/F041；SRC-001 第五十条；绑定具体例外和有效日期；缺 NEEDS_MATERIAL，无备案保持普通间隔",
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
        "原文证明目的：证明提前毕业时间例外确获备案；本人/导师/学院/研究生院",
        "关联字段：F034、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M019 证明提前毕业时间例外确获备案；本人/导师/学院/研究生院；申请、导师同意、学院审核、研究生院备案的有权链；条件必需：实际请求放宽间隔时，不属于普通开题启动必交；官方备案记录优先；F034/F041；SRC-001 第五十条；绑定具体例外和有效日期；缺 NEEDS_MATERIAL，无备案保持普通间隔"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "证明开题结果正式公布时间及版本；学院",
      "purpose": "M020 证明开题结果正式公布时间及版本；学院；授权公布/送达记录及官方有效结果指针；后续才产生 P6；复议 P9 时当前必需；学院可核验签收/公开时间记录；F035/F025；SRC-001 第四十九条；公布事件而非会议日；缺 SOURCE_UNAVAILABLE，冲突 CONFLICT",
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
        "原文证明目的：证明开题结果正式公布时间及版本；学院",
        "关联字段：F035、F025",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M020 证明开题结果正式公布时间及版本；学院；授权公布/送达记录及官方有效结果指针；后续才产生 P6；复议 P9 时当前必需；学院可核验签收/公开时间记录；F035/F025；SRC-001 第四十九条；公布事件而非会议日；缺 SOURCE_UNAVAILABLE，冲突 CONFLICT"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "证明研究生第一次复议的申请和受理；学生/培养单位",
      "purpose": "M021 证明研究生第一次复议的申请和受理；学生/培养单位；复议书、本人真实提交凭证与学院受理日志；条件必需 S12/P9；可信校方申请事件可代纸质受理件（形式待核）；F036/F035；SRC-001 第四十九条；申请时间和接收组织版本；缺 NEEDS_MATERIAL，超期争议交人判",
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
        "原文证明目的：证明研究生第一次复议的申请和受理；学生/培养单位",
        "关联字段：F036、F035",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M021 证明研究生第一次复议的申请和受理；学生/培养单位；复议书、本人真实提交凭证与学院受理日志；条件必需 S12/P9；可信校方申请事件可代纸质受理件（形式待核）；F036/F035；SRC-001 第四十九条；申请时间和接收组织版本；缺 NEEDS_MATERIAL，超期争议交人判"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "证明学院第一次复议的处理；培养单位",
      "purpose": "M022 证明学院第一次复议的处理；培养单位；复核调查记录与正式复议处理决定、发布/送达事件；后续才产生 S12 受理后；S13 时必需；只认培养单位有权记录；F037/F041；SRC-001 第四十九条；关联 M021；缺 SOURCE_UNAVAILABLE/NEEDS_MATERIAL，不擅改开题纸质结论",
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
        "原文证明目的：证明学院第一次复议的处理；培养单位",
        "关联字段：F037、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M022 证明学院第一次复议的处理；培养单位；复核调查记录与正式复议处理决定、发布/送达事件；后续才产生 S12 受理后；S13 时必需；只认培养单位有权记录；F037/F041；SRC-001 第四十九条；关联 M021；缺 SOURCE_UNAVAILABLE/NEEDS_MATERIAL，不擅改开题纸质结论"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "证明二次书面复议申请与研究生院结论；本人、研究生院",
      "purpose": "M023 证明二次书面复议申请与研究生院结论；本人、研究生院；同一槽分 requestVersion 与 decisionVersion，各自签收/组织专家与正式决定；条件必需 S13 申请部分；二次结论后续才产生；校方真实书面签收/决定为合法证据；F038/F039/F041；SRC-001 第四十九条；分成两个不可互代事件版；未作决定标“待处理”，非缺件；时限未知 POLICY_UNCONFIRMED",
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
        "原文证明目的：证明二次书面复议申请与研究生院结论；本人、研究生院",
        "关联字段：F038、F039、F041",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M023 证明二次书面复议申请与研究生院结论；本人、研究生院；同一槽分 requestVersion 与 decisionVersion，各自签收/组织专家与正式决定；条件必需 S13 申请部分；二次结论后续才产生；校方真实书面签收/决定为合法证据；F038/F039/F041；SRC-001 第四十九条；分成两个不可互代事件版；未作决定标“待处理”，非缺件；时限未知 POLICY_UNCONFIRMED"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "申请撤回/报告重交等调整；本人、学院",
      "purpose": "M024 申请撤回/报告重交等调整；本人、学院；本人撤回请求与培养单位有权受理/处理记录；条件必需 S14 实际发生时；书面或受控系统方式以学院确认；F040/F016/F014；SRC-001 未给一般撤回条款；撤回申请和批准分版本；政策未核 POLICY_UNCONFIRMED，不得删除已作出结论",
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
        "原文证明目的：申请撤回/报告重交等调整；本人、学院",
        "关联字段：F040、F016、F014",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M024 申请撤回/报告重交等调整；本人、学院；本人撤回请求与培养单位有权受理/处理记录；条件必需 S14 实际发生时；书面或受控系统方式以学院确认；F040/F016/F014；SRC-001 未给一般撤回条款；撤回申请和批准分版本；政策未核 POLICY_UNCONFIRMED，不得删除已作出结论"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "引用其他 S/T/G50 对应目的的校方真实权威结论；各独立业务 Owner",
      "purpose": "M025 引用其他 S/T/G50 对应目的的校方真实权威结论；各独立业务 Owner；decisionId + issuerOrg + systemOfRecord + ownerPurpose + version + validAt + sourceRecordPointer + signatureVerificationRef，与目录候选 templateId 分字段；条件必需：确需复用导师关系/资格、转段、课程认定等前置决定时；不能拿 G50 候选 workspace/manifest 作为结论；无上游决定则仅保留空依赖并交原 Owner；F005/F043；R02 主目录/范围审查、G50 固定目录及 SRC-001 提示的前置环节（目录非政策 SRC）；以学生键/角色/生效区间/来源版本校验。学校系统未授权或失联 SOURCE_UNAVAILABLE；旧版、越权或错 Owner CONFLICT；若只是具体签发 Owner 未知则 POLICY_UNCONFIRMED，不得自造 decisionId",
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
        "原文证明目的：引用其他 S/T/G50 对应目的的校方真实权威结论；各独立业务 Owner",
        "关联字段：F005、F043",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M025 引用其他 S/T/G50 对应目的的校方真实权威结论；各独立业务 Owner；decisionId + issuerOrg + systemOfRecord + ownerPurpose + version + validAt + sourceRecordPointer + signatureVerificationRef，与目录候选 templateId 分字段；条件必需：确需复用导师关系/资格、转段、课程认定等前置决定时；不能拿 G50 候选 workspace/manifest 作为结论；无上游决定则仅保留空依赖并交原 Owner；F005/F043；R02 主目录/范围审查、G50 固定目录及 SRC-001 提示的前置环节（目录非政策 SRC）；以学生键/角色/生效区间/来源版本校验。学校系统未授权或失联 SOURCE_UNAVAILABLE；旧版、越权或错 Owner CONFLICT；若只是具体签发 Owner 未知则 POLICY_UNCONFIRMED，不得自造 decisionId"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "全流程审计索引、真实动作身份与状态事件；可信主进程/权限门禁",
      "purpose": "M026 全流程审计索引、真实动作身份与状态事件；可信主进程/权限门禁；记录签发者、受理时点、证明 hash/来源校验、事件和重试链；当前必需的内生成记录、全阶段持续追加；无用户上传替代；F014/F016/F026/F039/F041/F042/F044；SRC-001/003 角色原则；Append-only 事件；不可解析 UNREADABLE/CONFLICT 时停止宣告可信结论；禁止 Renderer 写 actor",
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
        "原文证明目的：全流程审计索引、真实动作身份与状态事件；可信主进程/权限门禁",
        "关联字段：F014、F016、F026、F039、F041、F042、F044",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M026 全流程审计索引、真实动作身份与状态事件；可信主进程/权限门禁；记录签发者、受理时点、证明 hash/来源校验、事件和重试链；当前必需的内生成记录、全阶段持续追加；无用户上传替代；F014/F016/F026/F039/F041/F042/F044；SRC-001/003 角色原则；Append-only 事件；不可解析 UNREADABLE/CONFLICT 时停止宣告可信结论；禁止 Renderer 写 actor"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  sections:   [
    {
      "id": "rules-8-2",
      "name": "08.2 范围、准入及报告 R001–R011",
      "order": 0,
      "required": false,
      "criteria": [
        {
          "id": "R001",
          "title": "P0 论文开题对象；T=校方指明学位论文开题，F=明确为本科或工程博士实践成果可行性论证，U=同等学力等路由不明",
          "requirement": "R001 P0 论文开题对象；T=校方指明学位论文开题，F=明确为本科或工程博士实践成果可行性论证，U=同等学力等路由不明；SRC-001 33条、SRC-002 二/四、SRC-008 仅线索；F004/F006/F007/F019；M001/M007；以 A/B 的学籍/学位形式及本校政策版本核对象；外校同名项目不作同类推定；T 匹配仅 PASS_FACT“范围事实”；F NOT_APPLICABLE 转业务归口；U POLICY_UNCONFIRMED →学院/目录 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "P0 本人有效身份；T=尝试关联开题申请，F=无申请只浏览公用政策，U=学号/学籍未知",
          "requirement": "R002 P0 本人有效身份；T=尝试关联开题申请，F=无申请只浏览公用政策，U=学号/学籍未知；SRC-001 33/36条；F001/F002/F003/F007；M001；校方学号、当前有效姓名及学籍有效时间同人 A/B 比对；重名不得合并，学生 PDF 自填 C 不升权；一致 PASS_FACT；不一致 CONFLICT →学院学籍 Owner；源不可达 SOURCE_UNAVAILABLE →原数据持有人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "P0 培养路径/适用细则；T=身份源可区分硕博、直博、专硕，F=研究生之外已排除，U=转段/学院版次未知",
          "requirement": "R003 P0 培养路径/适用细则；T=身份源可区分硕博、直博、专硕，F=研究生之外已排除，U=转段/学院版次未知；SRC-001 34/51条、SRC-002、SRC-007、SRC-011、SRC-012（2026 线索非通用新阈值）；F004/F005/F006/F007/F009/F019/F043；M001/M002/M007/M025（条件）；A/B 的培养层次、S08-T10 转段有效版、学科/入学级选对应规则。2026 方案修订与 2021 办法持续援引并行存在，须从有权学院取得该生具体有效版，不得以公告年份自动切换；确认 PASS_FACT；转段冲突 CONFLICT →教务/转段 Owner；政策版不明 POLICY_UNCONFIRMED →学院/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "P1 培养计划课程学分完成；T=已进入准入核，F=范围外，U=有效计划未知",
          "requirement": "R004 P1 培养计划课程学分完成；T=已进入准入核，F=范围外，U=有效计划未知；SRC-001 34（一）条；F009/F010/F043；M002/M007/M025（课程替代判定条件）；对校方批准 planId/version 的应修与有效学分、已生效替代结论比 A/B；不能用学生截图汇总补推替代；达成 PASS_FACT；未达 NOT_MET→NEEDS_HUMAN_DECISION →学院培养教务；无源 SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "P1 开题时序及中期前置；T=有效学期/考核记录可辨，F=对象排除，U=休复学或有效学期算法未定",
          "requirement": "R005 P1 开题时序及中期前置；T=有效学期/考核记录可辨，F=对象排除，U=休复学或有效学期算法未定；SRC-001 34条；F004/F005/F008/F011/F019；M001/M002/M007；A/B 核开题应先于中期、硕士/非直博第四学期及直博第五学期节点；超期/休学特殊性和后续分流权不得自动处置；按期 PASS_FACT；已超或倒序 NOT_MET→NEEDS_HUMAN_DECISION →学院；算法缺 POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "P1 本人开题申请及真实受理；T=本人本次发起，F=无申请，U=代办权限/受理渠道不明",
          "requirement": "R006 P1 本人开题申请及真实受理；T=本人本次发起，F=无申请，U=代办权限/受理渠道不明；SRC-001 36（一）条；F001/F013/F014/F041/F044；M004/M026；本人可信账号事件或经学院验真的原件 A/B，与本 attempt 绑定；文件 mtime 不作受理时间，代理声明不授权；有效申请事实 PASS_FACT；缺 NEEDS_MATERIAL →本人；代办合法性 POLICY_UNCONFIRMED →学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "P2 报告题名、版本、归属；T=到 P2 需提交报告，F=尚在 P1，U=提交/身份归属无法对齐",
          "requirement": "R007 P2 报告题名、版本、归属；T=到 P2 需提交报告，F=尚在 P1，U=提交/身份归属无法对齐；SRC-001 35/36（四）条、SRC-006 表本体待核；F001/F002/F015/F016/F042；M001/M005/M026；C 原件由 A/B 身份索引回查，attempt+reportHash+version 比对；改题仅标异同，不仅据题名字符串认定重大；同版一致 PASS_FACT；已到期却无稿 NEEDS_MATERIAL →本人；学号错配 CONFLICT →学院；无法读 UNREADABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "P2 书面报告最低字数；T=已进入当版论文报告导师审阅核验，F=尚未进入 P2，U=学籍层次或该稿是否为当前开题报告不明",
          "requirement": "R008 P2 书面报告最低字数；T=已进入当版论文报告导师审阅核验，F=尚未进入 P2，U=学籍层次或该稿是否为当前开题报告不明；SRC-001 35条、SRC-006 待核；F004/F016/F017/F019；M005/M007；按 A/B 学段来源比硕士 5000、博士 10000 字书面报告；字数算法及 OCR 误差另由学院校准，系统测数只候选 D；只有 OCR 不可读而阶段已明确时，trigger=T、factComparison=UNKNOWN、结果 UNREADABLE；无争议满足 PASS_FACT；缺稿 NEEDS_MATERIAL →本人；低于阈值 NOT_MET→NEEDS_HUMAN_DECISION →导师；不能读 UNREADABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "P2 报告必要内容构成；T=已进入本阶段书面报告核验，F=P1 尚未要求，U=版式/院系附加栏未知",
          "requirement": "R009 P2 报告必要内容构成；T=已进入本阶段书面报告核验，F=P1 尚未要求，U=版式/院系附加栏未知；SRC-001 35（一）至（六）条；F015/F017/F019；M005/M007；检研究现状参考文献、选题意义、目标、方案可行性、创新点、进度等有无文本线索；AI 不判研究质量，学科专用栏不可凭空要求；字段可定位 PASS_FACT（仅完整性候选）；无稿 NEEDS_MATERIAL，缺栏目 NOT_MET→NEEDS_HUMAN_DECISION →本人/导师；政策缺 POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "P2 导师真实同意与报告版绑定；T=报告进入排会前导师审阅，F=仍在草稿 P1，U=导师/同意签名授权无法验证",
          "requirement": "R010 P2 导师真实同意与报告版绑定；T=报告进入排会前导师审阅，F=仍在草稿 P1，U=导师/同意签名授权无法验证；SRC-001 35/36（一）（四）条；F012/F016/F018/F041；M003/M005/M006/M026；有效指导关系 A + 该版报告同意 A/B + 签发者授权日期；纸签须验真，Renderer 自填 actor 为 D；真实同意 PASS_FACT；缺审批 NEEDS_MATERIAL（待导师动作）→导师；伪造/错导师 CONFLICT →导师关系 Owner",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "P3/P4 纸质报告正式送审评议组；T=学院已排会/报告提交组员，F=P1/P2 尚未排会，U=学院具体文书交接格式不明",
          "requirement": "R011 P3/P4 纸质报告正式送审评议组；T=学院已排会/报告提交组员，F=P1/P2 尚未排会，U=学院具体文书交接格式不明；SRC-001 36（四）条、SRC-006 待核；F016/F018/F020/F042；M005/M006/M008；核已有导师同意的报告在会时交小组成员审阅的 A/B 移交事实；2021 表格式未读，不能假设签栏；交接有据 PASS_FACT；缺当期交接 NEEDS_MATERIAL →学院秘书；签栏版本 POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-8-3",
      "name": "08.3 会务、评议、记录 R012–R022",
      "order": 1,
      "required": false,
      "criteria": [
        {
          "id": "R012",
          "title": "P3 有权培养单位排会；T=已建立正式会议，F=P1/P2 无会，U=排会版本未知",
          "requirement": "R012 P3 有权培养单位排会；T=已建立正式会议，F=P1/P2 无会，U=排会版本未知；SRC-001 36（一）条、SRC-005 个案事实；F007/F020/F041；M001/M008/M026；学校有权单位 A/B 组织会议、关联 student/attempt；公告或自拟专家邀请函不足以证明组织权限；有效排会 PASS_FACT；版本互斥 CONFLICT →学院组织者；无学校排会记录 SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "P3/P4 评审组人数与任职资格；T=名册/实际出席形成，F=P2 尚未组会，U=委员身份无法验真",
          "requirement": "R013 P3/P4 评审组人数与任职资格；T=名册/实际出席形成，F=P2 尚未组会，U=委员身份无法验真；SRC-001 36（二）条；F004/F021/F024/F041；M008/M009/M011（会后参会条件）；博士 3–5 名博士生导师或高级职称专家、硕士 3–5 名研究生导师；A/B 查同会有效任职/实际参会，不能按 OCR 头衔推断；满足事实 PASS_FACT；人数/资格不符 NOT_MET→NEEDS_HUMAN_DECISION →学院；名单冲突 CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "P3/P4 组长、秘书及导师不任组长；T=学院完成组内任命，F=尚未排会，U=指导关系/任命未回源",
          "requirement": "R014 P3/P4 组长、秘书及导师不任组长；T=学院完成组内任命，F=尚未排会，U=指导关系/任命未回源；SRC-001 36（二）条；F012/F021/F022/F041；M003/M008/M009；校方导师关系与会议任命 A/B 核组长 1、秘书 1、本人导师不担任组长；校外职务取相关权威身份源；符合 PASS_FACT；回避违反 NOT_MET→NEEDS_HUMAN_DECISION →学院；身份冲突 CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "P3/P4 专业/跨学科额外委员；T=专业学位或学院确认跨学科，F=均非该类，U=跨学科或行业资质未知",
          "requirement": "R015 P3/P4 专业/跨学科额外委员；T=专业学位或学院确认跨学科，F=均非该类，U=跨学科或行业资质未知；SRC-001 36（二）条、SRC-002 专项范围；F006/F007/F021/F019；M007/M008/M009；专业学位有相关行业高级职称专家，跨学科有相关学科研究生导师；A/B 职称、行业与学科有效匹配；符合 PASS_FACT；不符合 NOT_MET→NEEDS_HUMAN_DECISION →学院；F NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "P3 普通开题会前公告；T=非涉密且排会，F=尚无排会/已转涉密专用流程，U=是否可公开不明",
          "requirement": "R016 P3 普通开题会前公告；T=非涉密且排会，F=尚无排会/已转涉密专用流程，U=是否可公开不明；SRC-001 36（五）、39条、SRC-005 个案；F020/F023/F033（仅安全允许时）；M008/M010/M018（涉密仅安全状态）；A/B 记录核官网发布在会前至少一周且信息包含报告人/题目/时间地点；改排后取有权更正版本，公网搜索截图 D 不单独验真；符合 PASS_FACT；不合规 NOT_MET→NEEDS_HUMAN_DECISION →学院；公开权限 U→保密机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "P4 学生口头阐述时长和方式；T=会议真实举行，F=仅 P3 已排会，U=真实时长不可得",
          "requirement": "R017 P4 学生口头阐述时长和方式；T=会议真实举行，F=仅 P3 已排会，U=真实时长不可得；SRC-001 36（三）条；F004/F024；M001/M011；A/B 现场纪要核 PPT 汇报与答辩，硕士不少于 20 分钟、博士不少于 40 分钟；计划日程非实际时长；满足 PASS_FACT；不足 NOT_MET→NEEDS_HUMAN_DECISION →学院/秘书；无实况源 SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "P4 实际到会与同次会身份；T=已举行 P4，F=只完成排会，U=实际会议是否改排未知",
          "requirement": "R018 P4 实际到会与同次会身份；T=已举行 P4，F=只完成排会，U=实际会议是否改排未知；SRC-001 36（一）（三）（六）条；F020/F021/F024/F042；M008/M010/M011/M026；A/B 将计划会、改排公告、现场签到/成员、学生口头报告关联同一 eventId；实际与公告异同须学院释明；一致 PASS_FACT；同会错配 CONFLICT →学院；实录不可读 UNREADABLE →秘书",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "P5 评审组真实集体决定存在性；T=会已结束且有评议事件，F=会议前或未召开，U=有无评议无法核",
          "requirement": "R019 P5 评审组真实集体决定存在性；T=会已结束且有评议事件，F=会议前或未召开，U=有无评议无法核；SRC-001 36（六）、37/38条；F024/F025/F026/F041；M011/M012/M026；评议小组集体意见及纸质报告的签核原件 A/B，绑 attemptId+reportHash+panelEvent；OCR/AI 只摘录，绝不形成等级；核到既有记录的存在才 PASS_FACT；缺原件 NEEDS_MATERIAL →学院/秘书，冒签 CONFLICT →学校权限 Owner；学术质量裁量本身不属于 R019 的判定目标",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "P5 结论等级及再次开题语义；T=正式评议记录存在，F=尚在会前，U=历史 attempt 或改题原因未知",
          "requirement": "R020 P5 结论等级及再次开题语义；T=正式评议记录存在，F=尚在会前，U=历史 attempt 或改题原因未知；SRC-001 37/38条；F013/F025/F026/F030；M004/M012/M015（再次）；首次/不合格重试用优秀/良好/合格/不合格，重大改题重开仅通过/未通过；A/B 校验来源等级与对应 attempt，绝不重评分；合法映射 PASS_FACT（等级引用）；不支持/前后冲突 CONFLICT →学院；评议等级本身依原专家决定",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "P6 会后移交、录入、归档；T=评议后到实际移交/录入时点，F=开题尚未举行，U=学校系统和原件指针缺失",
          "requirement": "R021 P6 会后移交、录入、归档；T=评议后到实际移交/录入时点，F=开题尚未举行，U=学校系统和原件指针缺失；SRC-001 36（六）（七）条；F025/F027/F028/F041/F042；M012/M013/M026；秘书会后一周移交、学院两周内录入并存档 A/B；比较等级和同一 attempt，录入晚≠先前决定作废；一致且按期 PASS_FACT；逾期 NOT_MET→NEEDS_HUMAN_DECISION →学院；纸数冲突 CONFLICT，源失联 SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "P7 通过后修改与导师确认；T=正式结果“通过”，F=未通过/未评议，U=等级冲突未解",
          "requirement": "R022 P7 通过后修改与导师确认；T=正式结果“通过”，F=未通过/未评议，U=等级冲突未解；SRC-001 37（一）条；F016/F025/F029/F041；M012/M014/M026；后续修改稿和导师真实确认 A/B 绑定评议意见及新报告版；不把会后稿 v2 改写评议前 v1；完成 PASS_FACT；未完成 NEEDS_MATERIAL →本人/导师；旧结论保持不变",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-8-4",
      "name": "08.4 重试、例外、复议及跨系统 R023–R036",
      "order": 2,
      "required": false,
      "criteria": [
        {
          "id": "R023",
          "title": "P8 不合格重试及间隔；T=前次正式“不合格”且本人重申，F=首次或只要求复议，U=前次等级/会期未知",
          "requirement": "R023 P8 不合格重试及间隔；T=前次正式“不合格”且本人重申，F=首次或只要求复议，U=前次等级/会期未知；SRC-001 37（二）条；F013/F014/F030/F044；M004/M015/M026；A/B 保留旧评议并创建新 attempt；两次实际开题日期至少相隔三个月；尚未排新会只显示计划核查而不认定已违规；满足 PASS_FACT；实际不足 NOT_MET→NEEDS_HUMAN_DECISION →学院；旧源失联 SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "P8 长期未通过的风险转介；T=前次均未通过且接近/达到学籍时间边界，F=已官方通过或非此分支，U=入学有效期/休复学算法未知",
          "requirement": "R024 P8 长期未通过的风险转介；T=前次均未通过且接近/达到学籍时间边界，F=已官方通过或非此分支，U=入学有效期/休复学算法未知；SRC-001 37（二）条；F003/F004/F008/F030/F044；M001/M015；原文硕士自入学 4 年、博士 5 年内未通过时涉及分流处理；本模板只标可信日期事实，分流权限、例外和学籍效力另由学校认定；未触及 PASS_FACT；触及 NOT_MET→NEEDS_HUMAN_DECISION →培养单位及学籍 Owner，绝不自动分流/退学",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "P8 重大改题审批与重开；T=有权人确认研究方向/主要内容发生重大改变，F=无重大变更，U=只是题名不同或重大性未定",
          "requirement": "R025 P8 重大改题审批与重开；T=有权人确认研究方向/主要内容发生重大改变，F=无重大变更，U=只是题名不同或重大性未定；SRC-001 38条；F015/F030/F031/F041/F044；M005/M015/M016/M026；本人申请、导师同意、培养单位审批后新 attempt 重开；需要已签发的题目变更申请，不以 AI 文本相似度判重大；审批齐全 PASS_FACT；未经审批 NOT_MET→NEEDS_HUMAN_DECISION →导师/学院；重大性 U→学院认定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "P1/P2 工程类专业博士论文专项；T=工程博士且走论文路径，F=其他学位或实践成果路线，U=所选形式/企业实践是否适用不明",
          "requirement": "R026 P1/P2 工程类专业博士论文专项；T=工程博士且走论文路径，F=其他学位或实践成果路线，U=所选形式/企业实践是否适用不明；SRC-002 二/三（一）条、SRC-001 34/35条；F006/F017/F019/F032；M005/M007/M017（已入企时）；A/B 学位形式、来源于工程实践选题等材料事实；进入企业实践一年内开题为“一般”要求，例外由学校裁量，不硬作拒绝；适用事实 PASS_FACT；实践期限/学术实质 NEEDS_HUMAN_DECISION →工程博士培养单位；形式 F NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "P2S 涉密前置与安全门禁；T=已标/疑似涉密，F=可信确认非涉密，U=定密/接入授权状态不明",
          "requirement": "R027 P2S 涉密前置与安全门禁；T=已标/疑似涉密，F=可信确认非涉密，U=定密/接入授权状态不明；SRC-001 39条、SRC-003 5/14–18条；F033/F041/F044；M018（获许可才存在）、M026（仅无密审计）；涉密开题前三个月提出定密申请；普通系统不检查密文，无明确接入许可只保留无密转介事件，不写普通材料 hash 或级别；T/U NEEDS_HUMAN_DECISION 安全转校保密主管；F 仅非涉密路径 NOT_APPLICABLE；绝不普通 NEEDS_MATERIAL",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "P10 提前毕业时间间隔例外；T=实际请求放宽，F=未请求，U=备案范围/当前适用学籍未知",
          "requirement": "R028 P10 提前毕业时间间隔例外；T=实际请求放宽，F=未请求，U=备案范围/当前适用学籍未知；SRC-001 50条；F003/F034/F041；M001/M019/M026；有效本人申请、导师同意、学院审核、研究生院备案 A/B 四段链；本科或后续授位资格不归本模板决定；已备案事实 PASS_FACT；未备案 NOT_MET→NEEDS_HUMAN_DECISION →研究生院；F NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "P6/P9 开题成绩正式发布时间；T=正式结果已进入公布/被用于申诉，F=尚无专家结果，U=是否已发布/何时未知",
          "requirement": "R029 P6/P9 开题成绩正式发布时间；T=正式结果已进入公布/被用于申诉，F=尚无专家结果，U=是否已发布/何时未知；SRC-001 49条、36/37条；F025/F035/F042；M012/M020；A/B 核真实公布/送达事件，区分开题举行日、教务录入日；权限/版本必须与该 attempt 结论相符；公布可核 PASS_FACT；尚待学校公布为 NEEDS_HUMAN_DECISION/学院待办、权威记录失联 SOURCE_UNAVAILABLE →学院；不得按会议日估算期限",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "P9 首次复议申请期限；T=本人确已针对开题结果提出首次复议，F=没有复议请求，U=申请是否为该案该结果的首次复议不明",
          "requirement": "R030 P9 首次复议申请期限；T=本人确已针对开题结果提出首次复议，F=没有复议请求，U=申请是否为该案该结果的首次复议不明；SRC-001 49条；F001/F025/F035/F036；M001/M020/M021；trigger 为 T 后，若发布时间或签收时点未知是证据 UNKNOWN，不能把 T 又记 U；从经证实的发布日比较十五日，争议计算/例外由学院决定；期限事实 PASS_FACT 或 NOT_MET→NEEDS_HUMAN_DECISION →学院；公布/签收来源失联 SOURCE_UNAVAILABLE，不能机器拒收",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "P9 培养单位首次复议决定；T=学院已受理复议，F=未申请/尚待受理，U=学院是否正式签发决定未知",
          "requirement": "R031 P9 培养单位首次复议决定；T=学院已受理复议，F=未申请/尚待受理，U=学院是否正式签发决定未知；SRC-001 49条；F036/F037/F041；M021/M022/M026；培养单位的真实复核处理和有权签发 A/B，不可用当事人申述或 AI 理由代替；决定可引用但不覆写旧小组原件；决定确实存在 PASS_FACT（存在事实）；尚在审理留 NEEDS_HUMAN_DECISION/待办 →学院；签署冲突 CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "P9 研究生院第二次书面复议；T=不服学院复议决定且确已书面再申请，F=无此请求，U=第二次申请的归属/是否提交尚不明",
          "requirement": "R032 P9 研究生院第二次书面复议；T=不服学院复议决定且确已书面再申请，F=无此请求，U=第二次申请的归属/是否提交尚不明；SRC-001 49条；F037/F038/F039/F041；M022/M023/M026；书面申请版本与日后研究生院组织专家评判和正式决定版分开；触发为 T 后，二次期限政策仍未知，应单列 POLICY_UNCONFIRMED 待办，不能将其当触发 U，也不能自动限期驳回；申请已收 PASS_FACT（不等于二次获准）；决定待出 NEEDS_HUMAN_DECISION →研究生院；期限 POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R033",
          "title": "P1–P9 撤回、更正与重新申请；T=本人提出撤回/更正，F=未提出，U=何阶段允许撤回及处理效力无校本原文",
          "requirement": "R033 P1–P9 撤回、更正与重新申请；T=本人提出撤回/更正，F=未提出，U=何阶段允许撤回及处理效力无校本原文；SRC-001 36/37/49条仅供原状态参照，未给一般撤回规则；F013/F014/F016/F040/F044；M004/M024/M026；先留请求/收到/学院有权处理各版本事件；既有 M012 永存；重提另建申请或 attempt 的具体条件待学院核；一律 POLICY_UNCONFIRMED 或 NEEDS_HUMAN_DECISION →学院；无学校撤回规则不能自动生效",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R034",
          "title": "P0–P9 跨 G50/S/T 权威结论引用；T=本案确需前置已决定事实，F=无此依赖，U=实际签发系统/来源效力未知",
          "requirement": "R034 P0–P9 跨 G50/S/T 权威结论引用；T=本案确需前置已决定事实，F=无此依赖，U=实际签发系统/来源效力未知；SRC-001 34/36条、SRC-002 业务背景；F005/F009/F012/F043；M002/M003/M025；目录已核出 S08-T01/T02/T10、T06-T01、G50 g06-t01/t02/t03/t04/t09 等候选目的；只消费相应学校系统/签发主体经核 decisionId/version/validAt，而非目录 JSON/测试 workspace。无成果或 IP 前置需要时不触发 G06；权威引用有效 PASS_FACT；实际 issuer 不明确 POLICY_UNCONFIRMED →业务系统/目录 Owner；源失联 SOURCE_UNAVAILABLE →原 Owner；错决定目的 CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R035",
          "title": "P0–P10 证据链与身份门禁；T=任意材料或有权动作发生，F=无本案动作，U=原件签名与系统身份不可核",
          "requirement": "R035 P0–P10 证据链与身份门禁；T=任意材料或有权动作发生，F=无本案动作，U=原件签名与系统身份不可核；SRC-001 36/49条、SRC-003 安全边界；F001/F014/F016/F026/F041/F042/F044；M001/M005/M012/M026；比 caseId/studentKey/attempt/sourceVersion/effectiveAt 和 A/B 真实签发者；不可用 Renderer 的 actor、旧 run@rev、纯 OCR 替代权威记录；敏感情况先安全隔离；完整出处 PASS_FACT（可追溯性）；冒签/跨案 CONFLICT →学校权限 Owner；介质损坏 UNREADABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R036",
          "title": "P10 开题结论对下游的只读引用；T=下游提出已形成开题结果/间隔引用，F=尚未进入下游或没有结果，U=官方成绩、时间或重大改题类别未知",
          "requirement": "R036 P10 开题结论对下游的只读引用；T=下游提出已形成开题结果/间隔引用，F=尚未进入下游或没有结果，U=官方成绩、时间或重大改题类别未知；SRC-001 34（二）/38条、SRC-004（下游）；F025/F027/F030/F034/F035/F043；M012/M013/M015（重开）、M019（例外）、M020/M025（条件）；只有 A/B 真实已通过开题与日期/版本才引用；首次硕士至少一年、博士至少两年；重大改题重开硕士半年、博士一年；早毕业按 M019 备案例外。仅为下游核查，不替代答辩资格决定；可信引用 PASS_FACT；结果矛盾 CONFLICT →学院；不满足间隔 NOT_MET→NEEDS_HUMAN_DECISION →下游答辩 Owner",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  policyVersionIds: [], stages:     [
    {
      "id": "p0",
      "name": "范围识别",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p1"
    },
    {
      "id": "p1",
      "name": "资格准备",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p2"
    },
    {
      "id": "p2",
      "name": "报告与导师审阅",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "nextStageId": "p3"
    },
    {
      "id": "p3",
      "name": "排会与公告",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p4"
    },
    {
      "id": "p4",
      "name": "汇报与答辩",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p5"
    },
    {
      "id": "p5",
      "name": "专家评议",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p6"
    },
    {
      "id": "p6",
      "name": "移交、录入、归档、公布",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p7"
    },
    {
      "id": "p7",
      "name": "通过后修改",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p8"
    },
    {
      "id": "p8",
      "name": "新尝试/重大改题",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p9"
    },
    {
      "id": "p9",
      "name": "复议",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p10"
    },
    {
      "id": "p10",
      "name": "供下游引用",
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
  templateId: "S08-T03", name: "硕博研究生学位论文开题资格和报告审核", sourceDocumentPath: "docs/design/review-agent/business-templates/R02/S08-T03.md", sourceDocumentSha256: "c0adc04b868793000b1ab0e996ca4a1b29fe1059a11c5d4e0500bf131c1db284",
  originalSourceDocumentPath: "docs/design/review-agent/business-templates/R02/research-original/S08-T03.md", originalSourceSha256: "c0adc04b868793000b1ab0e996ca4a1b29fe1059a11c5d4e0500bf131c1db284", manifestSha256: "c0adc04b868793000b1ab0e996ca4a1b29fe1059a11c5d4e0500bf131c1db284", manifestHashCheck: true,
  officialSchoolTemplate: false, researchDate: '2026-10-24', policyEvidenceStatus: 'PARTIAL',
  sourceEvidence:   [
    {
      srcId: "SRC-001",
      evidenceStatus: "VERIFIED",
      title: "| SRC-001 CDUT-VERIFIED | 成都理工大学：《关于印发〈成都理工大学研究生培养环节管理办法（试行）〉的通知》，成理校研〔2021〕12 号。[官方 PDF](https://energy.cdut.edu.cn/__local/B/66/CD/D11DA75E84C7FCDD25CBC557422_EF1ADD3A_555F8.pdf) | 18 页；印发页及第六章第三十三至"
    },
    {
      srcId: "SRC-002",
      evidenceStatus: "VERIFIED",
      title: "| SRC-002 CDUT-VERIFIED | 成都理工大学：《关于印发〈成都理工大学工程类博士专业学位研究生学位论文与申请学位实践成果实施细则（试行）〉的通知》，成理校研〔2025〕17 号。[官方 PDF](https://cnae.cdut.edu.cn/__local/7/DF/6D/BD6CDE5F1009E83D74AFDBDBF64_7BC2F78A_BFB2C.pdf) | 1"
    },
    {
      srcId: "SRC-003",
      evidenceStatus: "VERIFIED",
      title: "| SRC-003 CDUT-VERIFIED | 成都理工大学：《关于印发〈成都理工大学涉密研究生和涉密学位论文管理办法（试行）〉的通知》，成理校研〔2024〕22 号。[官方 PDF](https://cnae.cdut.edu.cn/__local/6/00/E3/65182F44988453DBC26FEB60E83_8824077E_36E1D.pdf) | 14 页；第 2–3 条、第"
    },
    {
      srcId: "SRC-004",
      evidenceStatus: "VERIFIED",
      title: "| SRC-004 CDUT-VERIFIED | 党委研究生工作部、研究生院、卓越工程师学院：《关于2026年博士、硕士研究生毕业答辩和学位申请工作安排的通知》，成理研〔2026〕1 号。[官方 PDF](https://gra.cdut.edu.cn/__local/9/BC/89/D76B59272CC862FACEE252AAA16_C6BD07A3_4A2BD.pdf) | 3 页；第一"
    },
    {
      srcId: "SRC-005",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-005 CURRENTITY-UNKNOWN | 成都理工大学管理科学学院：《2027届工程管理、项目管理领域硕士研究生学位论文开题答辩工作安排》。[学院原文页](https://cim.cdut.edu.cn/info/1098/6210.htm) | 搜索索引标发布 2026-07-09，已见题名与公告摘要，但 2026-10-23 原文直连未得到完整可核正文（412）；无规范性生"
    },
    {
      srcId: "SRC-006",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-006 CURRENTITY-UNKNOWN | 成都理工大学研究生院：《博（硕）士研究生学位论文开题报告（2021版）》。[官方表单下载页](https://gra.cdut.edu.cn/info/1082/4065.htm) | 页面发布 2021-09-22，附件名为同名 .doc；表内字段和签章位置未取得附件本体；未见修订/废止日期 | 学校确有报告表入口；但当前是否仍用 2"
    },
    {
      srcId: "SRC-007",
      evidenceStatus: "VERIFIED",
      title: "| SRC-007 CDUT-VERIFIED | 成都理工大学核技术与自动化工程学院刊载：《成都理工大学研究生培养方案（学术学位研究生）》仪器科学与技术学科样本。[官方 PDF](https://cnae.cdut.edu.cn/__local/F/73/82/6CF66222EA802289ADB2C96F58E_BE93C41D_4D18D.pdf) | PDF 共 9 页，学位论文第六部分"
    },
    {
      srcId: "SRC-008",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-008 CURRENTITY-UNKNOWN | 成都理工大学继续教育学院：《成都理工大学2026年同等学力人员申请硕士学位招生简章》。[学院原文页](https://jjy.cdut.edu.cn/info/1117/2332.htm) | 页面标为 2026 年招生，检索正文谈及专门的论文开题与通过后一年内完成论文答辩；原附件未获取，准确发布日期、效力及培养方案对照待核 | 非普通"
    },
    {
      srcId: "SRC-009",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-009 CURRENTITY-UNKNOWN | 成都理工大学档案馆：《成都理工大学研究生学位档案材料归档办法》。[官方正文](https://dag.cdut.edu.cn/info/1051/1164.htm) | 发布 2018-06-22；正文归档范围、管理职责及流程，规定发布之日施行；未核验 2026 年是否修订/废止 | 用于区分授位、答辩后的档案与开题材料；不用于开题当期"
    },
    {
      srcId: "SRC-010",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-010 CURRENTITY-UNKNOWN | 成都理工大学能源学院：《通知公告》栏目（2026 多条“博士学位论文开题答辩”等）。[学院栏目页](https://energy.cdut.edu.cn/yjsjyy/tzgg.htm)；[2025-06-06 一份可直接读取的开题及中期汇报公告](https://energy.cdut.edu.cn/info/1370/4833.ht"
    },
    {
      srcId: "SRC-011",
      evidenceStatus: "VERIFIED",
      title: "| SRC-011 CDUT-VERIFIED | 成都理工大学研究生院、党委研究生工作部、卓越工程师学院：《关于开展2026年研究生校企合作课程建设项目申报工作的通知》。[官方原文页](https://gra.cdut.edu.cn/info/1011/5925.htm) | 发布 2026-07-03；第一部分“课程基础要求”明确提及“2026版专业学位研究生人才培养方案内课程”，开篇说明修订"
    },
    {
      srcId: "SRC-012",
      evidenceStatus: "VERIFIED",
      title: "| SRC-012 CDUT-VERIFIED | 成都理工大学环境与土木工程学院：《081800地质资源与地质工程》学位点介绍。[学院官方原文页](https://cece.cdut.edu.cn/info/1110/5257.htm) | 页面 2026-03-24 14:48；第四部分“人才培养”明确称严格执行《成都理工大学研究生培养环节管理办法（试行）》；介绍文非该生专用学科实施细则 | "
    }
  ],
  criteria:   [
    {
      "sectionId": "rules-8-2",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R018",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-3",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R026",
      "srcIds": [
        "SRC-002",
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R027",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R028",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R029",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R032",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R033",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R034",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R035",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-4",
      "criterionId": "R036",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    }
  ]
}
