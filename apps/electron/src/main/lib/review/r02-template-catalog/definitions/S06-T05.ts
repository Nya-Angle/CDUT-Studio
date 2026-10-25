import type { TemplateVersion } from '@profer/shared'

export type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'

export interface R02CriterionMetadata {
  sectionId: string
  criterionId: string
  srcIds: string[]
  evidenceStatus: R02EvidenceStatus
  sourceRuleTitle: string
}

export interface R02Metadata {
  templateId: string
  name: string
  sourceDocumentPath: string
  sourceOriginalPath: string
  sourceDocumentBytes: number
  sourceDocumentSha256: string
  officialSchoolTemplate: false
  researchEvidenceStatus: R02EvidenceStatus
  policyEvidenceStatus: R02EvidenceStatus
  auditedAt: string
  criteria: R02CriterionMetadata[]
}

export const template: TemplateVersion = {
  "templateId": "S06-T05",
  "version": 1,
  "schemaVersion": 2,
  "name": "学生社会实践立项、成果与实践时长认定审核",
  "description": "本地研究模板 · 非校方正式模板。用于整理事实、证据版本、问题与待人工复核事项；不代替成都理工大学或赛事/实践主管机关作出正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板为本地研究模板，非校方正式模板；当前政策证据状态为 PARTIAL，未经有权部门确认不得作为正式审批依据。",
  "objectType": "project",
  "displayName": {
    "template": "{{F017}} · {{F001}}"
  },
  "fields": [
    {
      "key": "F001",
      "label": "活动批次唯一键/年度与季节",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F001：string；Batch；活动批次唯一键/年度与季节；原始阶段/缺失语义：A–G；来源与证据位置：P/O [SRC-001/004/007]；M001 通知标识。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F002",
      "label": "政策原件版本/签发文号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F002：string；Batch；政策原件版本/签发文号；原始阶段/缺失语义：A–G；来源与证据位置：P/O [SRC-001/002]；M001 首页及完整文件。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F003",
      "label": "稳定项目/个人活动键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F003：string；Case；稳定项目/个人活动键；原始阶段/缺失语义：A–G；来源与证据位置：H+O/S [SRC-001]；案卷登记与 M004/M007。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F004",
      "label": "当前阶段 A–G",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F004：enum；Case；当前阶段 A–G；原始阶段/缺失语义：A–G；来源与证据位置：H；受理和决定事件，不来自 Renderer 声称。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F005",
      "label": "团队/个人、寒暑假/专项子类型",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F005：enum；Case；团队/个人、寒暑假/专项子类型；原始阶段/缺失语义：A–G；来源与证据位置：S+P [SRC-001/004/005]；M004/M007 申请类别。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F006",
      "label": "申请学生校内唯一身份键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F006：string；Person；申请学生校内唯一身份键；原始阶段/缺失语义：A–G；来源与证据位置：U 或经核证 O [SRC-001]；M002 学籍对应。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F007",
      "label": "申请学生姓名/别名原文",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F007：string；Person；申请学生姓名/别名原文；原始阶段/缺失语义：A–G；来源与证据位置：U+S [SRC-001]；M002 对 M004/M007 姓名栏。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F008",
      "label": "学段、全日制/在籍状态、有效日期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F008：struct；Person；学段、全日制/在籍状态、有效日期；原始阶段/缺失语义：A/F；来源与证据位置：U/O+P [SRC-001/006]；M002 学籍记录。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F009",
      "label": "归属学院/校区及有效期间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F009：string；Person；归属学院/校区及有效期间；原始阶段/缺失语义：A–G；来源与证据位置：U/O [SRC-001]；M002 与 M010。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F010",
      "label": "实际提交人可信 Actor 与代理关系",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F010：struct；Submission；实际提交人可信 Actor 与代理关系；原始阶段/缺失语义：A/B/G；来源与证据位置：H、M003 [SRC-001]；操作日志及代办依据。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F011",
      "label": "代理授权范围/有效期/撤销",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F011：struct；Submission；代理授权范围/有效期/撤销；原始阶段/缺失语义：A/B/G；来源与证据位置：O/S 待核 [SRC-001]；M003 授权原件。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F012",
      "label": "团队名称及同名辨识键",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F012：string；Team；团队名称及同名辨识键；原始阶段/缺失语义：A–E；来源与证据位置：S+O [SRC-001]；M004/M005。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F013",
      "label": "团队负责人校内身份键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F013：string；Team；团队负责人校内身份键；原始阶段/缺失语义：A–E；来源与证据位置：U/S+O [SRC-001]；M004/M005。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F014",
      "label": "队员身份键与有效期间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F014：list；TeamMembership；队员身份键与有效期间；原始阶段/缺失语义：A–F；来源与证据位置：U+S/O [SRC-001]；M005 对 M015/M016。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F015",
      "label": "队内任务、个人参与/贡献声明",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F015：list；TeamMembership；队内任务、个人参与/贡献声明；原始阶段/缺失语义：A–F；来源与证据位置：S/X [SRC-001/005]；M005、M015、M032。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F016",
      "label": "指导教师及在职/任职核验",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F016：list；Team；指导教师及在职/任职核验；原始阶段/缺失语义：A–E；来源与证据位置：U/O [SRC-001]；M006 及 M004。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F017",
      "label": "项目标题、主题",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F017：string；PracticeCase；项目标题、主题；原始阶段/缺失语义：A–G；来源与证据位置：S+O [SRC-001]；M004/M009。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F018",
      "label": "实践类型/专项赛道",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F018：enum/string；Case；实践类型/专项赛道；原始阶段/缺失语义：A–G；来源与证据位置：P+S/O [SRC-001]；M001/M004/M007/M014。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F019",
      "label": "申请/立项级别（校/院/国家专项等）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F019：enum；Case；申请/立项级别（校/院/国家专项等）；原始阶段/缺失语义：A–E；来源与证据位置：O/P [SRC-001]；M004、M011。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F020",
      "label": "活动目标、内容与拟交成果",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F020：text；Case；活动目标、内容与拟交成果；原始阶段/缺失语义：A–E；来源与证据位置：S [SRC-001]；M009 计划及 M004。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F021",
      "label": "计划开始/结束日期",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F021：daterange；Case；计划开始/结束日期；原始阶段/缺失语义：A–D；来源与证据位置：S [SRC-001]；M009。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F022",
      "label": "计划地点及实践点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F022：list；Case；计划地点及实践点；原始阶段/缺失语义：A–D；来源与证据位置：S [SRC-001]；M009。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F023",
      "label": "外部平台报名/专项录用号",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F023：struct；ExternalProgram；外部平台报名/专项录用号；原始阶段/缺失语义：A–D；来源与证据位置：X/S [SRC-001]；M008/M014。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F024",
      "label": "学院接收时间与批次回执",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F024：datetime/ref；Submission；学院接收时间与批次回执；原始阶段/缺失语义：B–G；来源与证据位置：O/H [SRC-001]；M010 或 M023。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F025",
      "label": "学院审核/排序/推荐及签发者",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F025：struct；AuthorityDecision；学院审核/排序/推荐及签发者；原始阶段/缺失语义：B–G；来源与证据位置：O [SRC-001/004]；M010。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F026",
      "label": "校级立项/答辩/备案结果",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F026：struct；AuthorityDecision；校级立项/答辩/备案结果；原始阶段/缺失语义：C–G；来源与证据位置：O [SRC-001]；M011。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F027",
      "label": "校外安全/承诺与 G04/G05 权威决定链接",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F027：ref；Case；校外安全/承诺与 G04/G05 权威决定链接；原始阶段/缺失语义：B–E；来源与证据位置：O [SRC-001]；M012/M013。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F028",
      "label": "项目实际开展日期",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F028：list<daterange>；PracticeEvent；项目实际开展日期；原始阶段/缺失语义：D–F；来源与证据位置：X/S/O [SRC-001]；M015–M017。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F029",
      "label": "实际活动地点/实践单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F029：list；PracticeEvent；实际活动地点/实践单位；原始阶段/缺失语义：D–F；来源与证据位置：X/S/O [SRC-001]；M015/M017。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F030",
      "label": "逐成员原始参与时段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F030：list<timeInterval>；PracticeEvent；逐成员原始参与时段；原始阶段/缺失语义：D–F；来源与证据位置：X/S/O [SRC-001]；M015/M016/M017。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F031",
      "label": "实践日志活动项及记录者",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F031：list；PracticeEvent；实践日志活动项及记录者；原始阶段/缺失语义：D–E；来源与证据位置：S/X [SRC-001/002]；M015 原文页/日期。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F032",
      "label": "实践单位名称与签发/确认来源",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F032：struct；PracticeEvent；实践单位名称与签发/确认来源；原始阶段/缺失语义：D–F；来源与证据位置：X/O [SRC-001]；M017/M014。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F033",
      "label": "计划、成员、地点变更及生效时点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F033：ref+version；Case；计划、成员、地点变更及生效时点；原始阶段/缺失语义：B–G；来源与证据位置：H+O/S [SRC-001]；M026 和旧版 M009/M005。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F034",
      "label": "成果唯一键/类型",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F034：struct；OutcomeArtifact；成果唯一键/类型；原始阶段/缺失语义：D–G；来源与证据位置：S/O [SRC-001/005]；M019–M022/M032。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F035",
      "label": "成果文件版次及提交链",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F035：ref+hash；OutcomeArtifact；成果文件版次及提交链；原始阶段/缺失语义：E–G；来源与证据位置：H+S/O [SRC-001]；M019–M022。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F036",
      "label": "个人作者/贡献者的声称与核验",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F036：list；OutcomeArtifact；个人作者/贡献者的声称与核验；原始阶段/缺失语义：E–G；来源与证据位置：S/X/O [SRC-001/005]；M032、M005、M019。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F037",
      "label": "照片/视频时间、人物、地点、来源",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F037：struct；OutcomeArtifact；照片/视频时间、人物、地点、来源；原始阶段/缺失语义：D–G；来源与证据位置：S/X [SRC-001/005]；M018/M021 元数据。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F038",
      "label": "结项材料报送日期/版本",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F038：datetime；Submission；结项材料报送日期/版本；原始阶段/缺失语义：E–G；来源与证据位置：O/H [SRC-001]；M023 回执。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F039",
      "label": "学院收件、检查验收事实",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F039：enum+ref；AuthorityDecision；学院收件、检查验收事实；原始阶段/缺失语义：E–G；来源与证据位置：O [SRC-001/005]；M023。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F040",
      "label": "正式结项/验收结论及有效版本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F040：struct；AuthorityDecision；正式结项/验收结论及有效版本；原始阶段/缺失语义：E–G；来源与证据位置：O [SRC-001]；M023。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F041",
      "label": "申请认定的天/小时等数量",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F041：decimal+unit；DurationClaim；申请认定的天/小时等数量；原始阶段/缺失语义：F/G；来源与证据位置：S [SRC-001/006]；M024。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F042",
      "label": "可证原始时间片与出处",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F042：list<timeInterval>；DurationClaim；可证原始时间片与出处；原始阶段/缺失语义：F/G；来源与证据位置：X/O/S [SRC-001]；M015–M017/M024。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F043",
      "label": "同人重叠项目/志愿记录冲突",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F043：list<ref>；DurationClaim；同人重叠项目/志愿记录冲突；原始阶段/缺失语义：F/G；来源与证据位置：H+O [SRC-001/006]；M025/M031 及关联案卷。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F044",
      "label": "校方正式时长核定值、签发方与单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F044：struct；AuthorityDecision；校方正式时长核定值、签发方与单位；原始阶段/缺失语义：F/G；来源与证据位置：O，校本权限尚未证 [SRC-006]；M025。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F045",
      "label": "评优申报、院级推荐/校级公示或决定",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F045：struct；AuthorityDecision；评优申报、院级推荐/校级公示或决定；原始阶段/缺失语义：G；来源与证据位置：O [SRC-003/004/005]；M027/M028。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F046",
      "label": "补件/撤回/异议/复核请求人、范围、日期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F046：struct；ChangeOrReview；补件/撤回/异议/复核请求人、范围、日期；原始阶段/缺失语义：B–G；来源与证据位置：H+S/O [SRC-003/004]；M026/M029。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F047",
      "label": "处理结果及生效/撤销关联",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F047：struct；ChangeOrReview；处理结果及生效/撤销关联；原始阶段/缺失语义：B–G；来源与证据位置：O [SRC-003/004]；M030。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F048",
      "label": "邻接 G50/S/T 权威结论引用及有效版本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F048：list<ref>；Case；邻接 G50/S/T 权威结论引用及有效版本；原始阶段/缺失语义：B–G；来源与证据位置：O/H [SRC-009]；M013/M031。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 活动批次/政策、期限与模板依据",
      "purpose": "活动批次/政策、期限与模板依据；校团委等归口机关；正式通知原件/公告；当/权，全部阶段引用",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "活动批次/政策、期限与模板依据",
        "校团委等归口机关",
        "正式通知原件/公告",
        "当/权"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 学生在籍、学段、归属学院核验",
      "purpose": "学生在籍、学段、归属学院核验；学籍部门；学籍主数据/有效证明；当/权，申请及个人时长",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "学生在籍、学段、归属学院核验",
        "学籍部门",
        "学籍主数据/有效证明",
        "当/权"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 · 代理办理权",
      "purpose": "代理办理权；本人及授权核验方；有效委托/系统代理权限记录；条，非本人提交/撤回",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "代理办理权",
        "本人及授权核验方",
        "有效委托/系统代理权限记录",
        "条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 · 团队项目立项申请",
      "purpose": "团队项目立项申请；团队负责人/学院团委；2025 附件2 类项目申报表；当，团队 A",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "团队项目立项申请",
        "团队负责人/学院团委",
        "2025 附件2 类项目申报表",
        "当"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 · 团队名单、成员职责与学院汇总",
      "purpose": "团队名单、成员职责与学院汇总；队长/学院团委；2025 附件3 类团队信息汇总；当，团队 A/B",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "团队名单、成员职责与学院汇总",
        "队长/学院团委",
        "2025 附件3 类团队信息汇总",
        "当"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 · 指导教师与在职身份",
      "purpose": "指导教师与在职身份；学校人事/学院；导师任职核验；条，团队规定需导师",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "指导教师与在职身份",
        "学校人事/学院",
        "导师任职核验",
        "条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "M007 · 个人实践申报或报名统计",
      "purpose": "个人实践申报或报名统计；学生/学院；2025 附件4 类型表；当，个人 A",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "个人实践申报或报名统计",
        "学生/学院",
        "2025 附件4 类型表",
        "当"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 · 外部计划注册/报名",
      "purpose": "外部计划注册/报名；学生或外部平台；报名记录；条，返家乡/逐梦扬帆/专项",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "外部计划注册/报名",
        "学生或外部平台",
        "报名记录",
        "条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 · 实践计划与地点时间目标",
      "purpose": "实践计划与地点时间目标；负责人/学生；计划书/申报表计划部分；当，团队项目 A；个人活动按批次定",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "实践计划与地点时间目标",
        "负责人/学生",
        "计划书/申报表计划部分",
        "当"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 学院接收、初审排序、推荐",
      "purpose": "学院接收、初审排序、推荐；学院团委；盖章汇总/签发回执；后，B；已送校级的案卷为当前前置",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "学院接收、初审排序、推荐",
        "学院团委",
        "盖章汇总/签发回执",
        "后"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 校级立项/备案/答辩结果",
      "purpose": "校级立项/备案/答辩结果；校团委；名单、通知、决定；后，C；校级已审批案卷为当前前置",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "校级立项/备案/答辩结果",
        "校团委",
        "名单、通知、决定",
        "后"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 2025 项目协议/承诺与本人签字",
      "purpose": "2025 项目协议/承诺与本人签字；参加者/学院；当批附件7；条，2025 暑期 A/B 或后续批次明示才必需",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "2025 项目协议/承诺与本人签字",
        "参加者/学院",
        "当批附件7",
        "条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 · 安全教育、保险与出行前置",
      "purpose": "安全教育、保险与出行前置；G04/G05/学院有权者；独立决定/保单记录；条，实际出行且对应 G 要求",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "安全教育、保险与出行前置",
        "G04/G05/学院有权者",
        "独立决定/保单记录",
        "条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 外部专项/岗位录取与实施任务",
      "purpose": "外部专项/岗位录取与实施任务；外部活动主办方/用人单位；录取/岗位记录；条，专项/岗位 D 前",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "外部专项/岗位录取与实施任务",
        "外部活动主办方/用人单位",
        "录取/岗位记录",
        "条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 实际过程日志/每日活动记录",
      "purpose": "实际过程日志/每日活动记录；学生/团队/带队教师；2025 附件8 类日志；后，D→E；2025 校级团队 E 当",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "实际过程日志/每日活动记录",
        "学生/团队/带队教师",
        "2025 附件8 类日志",
        "后"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 个人签到/在场/岗位履职",
      "purpose": "个人签到/在场/岗位履职；实践单位/平台/本人；可信签到、工作记录；后，D→F；声称个人时段时当",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "个人签到/在场/岗位履职",
        "实践单位/平台/本人",
        "可信签到、工作记录",
        "后"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 · 实践单位参加证明",
      "purpose": "实践单位参加证明；实践单位/学院；2025 附件9 类实践证明；后，实施结束→E/F",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "实践单位参加证明",
        "实践单位/学院",
        "2025 附件9 类实践证明",
        "后"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "M018 · 影像事实与人员/地点",
      "purpose": "影像事实与人员/地点；团队或个人；照片原始文件；后，D/E；2025 校级团队 E 当",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "影像事实与人员/地点",
        "团队或个人",
        "照片原始文件",
        "后"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "M019 · 实践报告、调研成果与数据",
      "purpose": "实践报告、调研成果与数据；作者/团队；报告/问卷/论文；后，E；2025 校级团队 E 当",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "实践报告、调研成果与数据",
        "作者/团队",
        "报告/问卷/论文",
        "后"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "M020 · 个人实践感想与报告",
      "purpose": "个人实践感想与报告；学生；个人报告；后，个人 E；2025 暑期个人 E 当",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "个人实践感想与报告",
        "学生",
        "个人报告",
        "后"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "M021 · 团队实施总结视频",
      "purpose": "团队实施总结视频；团队；视频及来源信息；后，2025 校级团队 E 当；其余按通知",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "团队实施总结视频",
        "团队",
        "视频及来源信息",
        "后"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "M022 · 宣传报道链接/外部媒体佐证",
      "purpose": "宣传报道链接/外部媒体佐证；团队/媒体；URL及转载链；后，E/评优按当批",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "宣传报道链接/外部媒体佐证",
        "团队/媒体",
        "URL及转载链",
        "后"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "M023 · 结项收件、学院检查验收及正式结论",
      "purpose": "结项收件、学院检查验收及正式结论；学院/校团委；签发记录；后，E；只有需确认结项时当/权",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "结项收件、学院检查验收及正式结论",
        "学院/校团委",
        "签发记录",
        "后"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "M024 · 个人实践时长认定申请",
      "purpose": "个人实践时长认定申请；学生；所报时间段、单位和量值；条，存在 F 入口且个人申请",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "个人实践时长认定申请",
        "学生",
        "所报时间段、单位和量值",
        "条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "M025 · 正式实践时长核定与重复记录查询",
      "purpose": "正式实践时长核定与重复记录查询；有权部门；认证决定/登记；后，F 完成；下游引用时当/权",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "正式实践时长核定与重复记录查询",
        "有权部门",
        "认证决定/登记",
        "后"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "M026 · 计划/队员/地点变更、补正及提交新版本",
      "purpose": "计划/队员/地点变更、补正及提交新版本；学生、团队、学院；变更请求+关联决定；条，B–G 发生修改",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "计划/队员/地点变更、补正及提交新版本",
        "学生、团队、学院",
        "变更请求+关联决定",
        "条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "M027 · 实践评优申请及个人/团队参评材料",
      "purpose": "实践评优申请及个人/团队参评材料；学生/学院；推荐申报表；条，G 申请评优",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "实践评优申请及个人/团队参评材料",
        "学生/学院",
        "推荐申报表",
        "条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "M028 · 院级拟推荐/校级评优公示与最终结果",
      "purpose": "院级拟推荐/校级评优公示与最终结果；学院/校团委；公示/决定；后，G；引用结果时当/权",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "院级拟推荐/校级评优公示与最终结果",
        "学院/校团委",
        "公示/决定",
        "后"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "M029 · 补件、撤回、异议/复核申请",
      "purpose": "补件、撤回、异议/复核申请；申请人或授权人；请求与提交回执；条，出现 B–G 请求时",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "补件、撤回、异议/复核申请",
        "申请人或授权人",
        "请求与提交回执",
        "条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M030",
      "name": "M030 · 对撤回/申诉/复核的正式处理决定",
      "purpose": "对撤回/申诉/复核的正式处理决定；有权复核者；处理书及关联；后，请求处理后才出现",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "对撤回/申诉/复核的正式处理决定",
        "有权复核者",
        "处理书及关联",
        "后"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M031",
      "name": "M031 · G50/S/T 邻接决定证据",
      "purpose": "G50/S/T 邻接决定证据；相关 Owner；只读有权决定；条，关联安全、学分、志愿时长、竞赛等奖励",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "G50/S/T 邻接决定证据",
        "相关 Owner",
        "只读有权决定",
        "条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M032",
      "name": "M032 · 成果个人贡献证据",
      "purpose": "成果个人贡献证据；个人、团队、见证单位；署名清单/原始贡献记录；条，声称个人成果归属",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "成果个人贡献证据",
        "个人、团队、见证单位",
        "署名清单/原始贡献记录",
        "条"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "practice-lifecycle-facts",
      "name": "逐事实规则（R001–R026）",
      "description": "来自原始模板第08节规则分组。每条规则对应原始 R ID；SRC 仅为研究来源索引，不是案卷 SourceRef。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "批次与有效政策；A–G",
          "requirement": "原文第08节规则 R001。T=案卷需据某批通知判断；F=纯历史归档不作当前资格判断；U=无法定位批次或通知效力；[SRC-001/002/004/005/007]；F001/F002/F004；M001；核发文机关、标题、适用学段、批次、日期及修订/废止；P/O，文号重号不并文；对应历史批次可核→PF；跨期旧通知/现行阈值未证→PC；公告原件失联→SU；同文号异标题且影响效力→CF；转校团委政策管理员。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "学生身份与适用学段；A/F及引用",
          "requirement": "原文第08节规则 R002。T=有本人申请或个人时长归属；F=仅核非学生指导教师资格；U=申请人/学段用途未确定；[SRC-001/006]；F006–F009；M002；按学校稳定身份键、学籍有效日核与申请版本及成员名单一致；U/O 优先，S 待核；2025全日制限制仅当年；一致且当批适用→PF；身份键对立→CF；有效学籍记录暂不可取→SU；未证 2026 特殊学段→PC；转学籍核验员/学院团委。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R003",
          "title": "提交人/代理权限；A/B/G及请求",
          "requirement": "原文第08节规则 R003。T=代办、撤回、提交决定或影响他人权益的操作；F=本人完成普通提交且身份可信；U=当前操作主体认证或代理范围不明；[SRC-001/003/004]（正式代理细则未证）；F010/F011；M003/M029；核 Host/Main 可信 Actor、授权对象/范围/起止及撤销状态；H/O，个人签名照片仅 S；真实授权且权限范围吻合→PF（仅提交资格）；冒名/范围冲突→CF；证据欠缺且本阶段确需→NM；有权代理制度或审批作用域未核→PC/HD；转受理人员/身份授权管理员。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "项目/个人案卷、类别与归属；A–G",
          "requirement": "原文第08节规则 R004。T=新申报或将来源材料关联案卷；F=仅查与本案无关的外部公示；U=项目与个人活动无法归类；[SRC-001/004/005]；F003/F005/F017/F018；M004/M007；逐批区分团队申报、个人“返家乡”、专项、寒暑假，核稳定案卷键与标题；P+H+S/O；类型及键一致→PF；当前申报表确属必需而缺→NM；同名不同案且键冲突→CF；分类政策未知→PC；转申请人/学院团委。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R005",
          "title": "团队、队长、成员及逐人期间；A–F",
          "requirement": "原文第08节规则 R005。T=团队申报或声称成员参加；F=个人独立实践且无团队；U=无法确定团队/成员关联；[SRC-001/005]；F012–F015；M004/M005/M015/M032；对照名单、负责人身份、加入/退出期间与现场证据；U/O 身份，S/X 过程；2025批次团队限制另核；真实对应的成员关系→PF；跨人或版本对立→CF；当批要求名单而缺→NM；贡献/到场仅由团队名推断→HD；转队长、学院核验员、涉及本人。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "R006",
          "title": "指导教师及实际指导身份；A/D/G",
          "requirement": "原文第08节规则 R006。T=当批团队要求指导人或申报优秀指导教师；F=个人实践不要求导师；U=导师条件或教职工身份无法确定；[SRC-001/003/005]；F016/F012；M006/M004/M027；2025暑期核本校在职及每队1–2人，其他年份条件另查；U/O，学生自报 S；该批导师资格事实可核→PF；名单冲突→CF；教师主数据失联→SU；其他批次人数标准未知→PC；指导获奖资格另交校团委评审者 HD。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R007",
          "title": "申报计划和预计活动范围；A/B",
          "requirement": "原文第08节规则 R007。T=对应项目批次要求计划；F=只核已完成项目且当前不复审申报计划；U=个体报名是否需单独计划未知；[SRC-001/002]；F020–F022；M004/M009；查目标、预计地点/日期、计划版次及当批表单；P+S，与实到分离；当前应有计划存在且一致→PF；确需而缺→NM；提交多版不清或计划互斥→CF；字段表未取得/必要性未证→PC；转学生/学院受理员。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "学院收件时点与回执；B/E",
          "requirement": "原文第08节规则 R008。T=声称已经正式报送或需核历史截止；F=申请草拟未正式提交；U=校方受理入口/时钟未知；[SRC-001/004/005]；F024/F038；M010/M023；使用学院实际收件回执时间而非本地文件生成日，比该批原文截止；O/H+P；已收且时点可核→PF（不等于合规批准）；回执与上传时点矛盾→CF；有入口但原记录失联→SU；逾期可否补报未证→PC/HD；转学院收件人。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "学院审核、排序、拟推荐；B/C/G",
          "requirement": "原文第08节规则 R009。T=引用学院推荐作为前置；F=个人路线无需学院排序且政策明示；U=该阶段学院作用未证；[SRC-001/004/005]；F025/F009；M010；核学院有权签发者、项目名单、日期、批次、排序/“拟推荐”原文；O 优先，S 截图辅助；学院真实推荐事实→PF；推荐对象不符→CF；需原记录而机关失联→SU；未签发/角色权不明→HD；转学院团委有权者。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "校级立项/答辩/备案结果；C及下游",
          "requirement": "原文第08节规则 R010。T=引用校级“获准立项”或需核答辩结果；F=没有校级环节的个人/院级路线；U=是否应有校级决定未证；[SRC-001]；F019/F026；M011/M004/M010；核正式名单/决定、签发组织、日期、项目键；对比“申请级别”与“批准级别”；O，2025答辩安排不适用2026；有权原文对应→PF（确认存在批准记录，非本模板批准）；申请自报与正式决定不同→CF；源失联→SU；结果尚未做出→HD；转校团委授权人员。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "外部专项/岗位报名与真实录取；A–D",
          "requirement": "原文第08节规则 R011。T=选择外部平台/专项/岗位；F=不涉及外部组织；U=未明是否通过外部双选；[SRC-001]；F023/F032/F018；M008/M014；分别核报名、录用/分配与实际报到，平台原始号/实践点/有效期；X/O，报名截图仅 S；能证实对应报名或录用的特定事实→PF；仅报名却声称已录用→CF/HD；该阶段必需报名而缺→NM；平台失联→SU；转本人/外部实践点/学院。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "活动承诺与出行安全前置引用；B–D",
          "requirement": "原文第08节规则 R012。T=本批明确要协议，或触发 G04/G05 安全前置；F=无需校外出行且未触发协议；U=何种前置批准或签发范围未证；[SRC-001/002/009]；F027/F048；M012/M013/M031；按人/队/期间核协议，安全决定只读引用 G Owner 的真实状态；P+O，签名照片 S；承诺材料事实/权威批准引用可核→PF；当批明示缺承诺→NM；安全决定失效/互斥→CF/HD；G 来源失联→SU；门槛不明→PC；转学院安全负责人/G04/G05 Owner。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "实际活动日期、地点及日志事件；D/E",
          "requirement": "原文第08节规则 R013。T=声称活动已开始或结项需过程证据；F=尚在申报阶段、无已发生活动主张；U=日期记录归属不明；[SRC-001/005]；F028/F029/F031/F003；M015/M009；比较逐日原始日志与计划及变更有效日，不将“计划日”当“实际日”；S/X；时间地点事件一致可追溯→PF；日志与实践单位原记录冲突→CF；当批实际要求日志而缺→NM；存在扫描但页不可辨→UR；转实际记录人/学院检查员。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "个人逐时段参与而非团队均分；D/F",
          "requirement": "原文第08节规则 R014。T=对具体成员声称实际参与/申请个人时长；F=仅讨论项目级活动且不声称个人出勤；U=成员在有效期间是否参加未知；[SRC-001/006]；F014/F015/F030/F042；M015/M016/M017；交叉比对个人签到起止、团队记录与成员有效期；X/O 证其原始范围，S 不足以单独证全程；可核个人原始时段→PF；同人时段冲突→CF；证据不足→NM/HD（按当批认可要求）；文件不可读→UR；转本人/实践点/时长有权核验人。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "R015",
          "title": "实践单位证明与签发真实性；D–F",
          "requirement": "原文第08节规则 R015。T=引用单位证明证实参加事实；F=未要求且另有可核原始出勤；U=单位证明是否必需或来源身份不清；[SRC-001/002/007]；F032/F028–F030；M017/M014；核签发主体、盖章来源、日期、人员、项目与活动点；X/O，截图 S；可核证其明确声称事项→PF；人与时段/单位相抵→CF；应交缺失→NM；扫不清→UR；原单位失联→SU；转实践点/学院核验人。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "计划/人员/成果变更链与生效；B–G",
          "requirement": "原文第08节规则 R016。T=任一与既有版不同的修订或替换；F=无变更且当前版本相同；U=替换来源与授权时点不明；[SRC-001/003]（程序授权未证）；F033/F014/F020–F022/F035；M026/M005/M009；核 supersedes、原件哈希、接收时点、变更请求及有权批复；H+S/O；新旧差异和请求可核→PF（仅证“已提出/收件”）；冲突版→CF；是否许可变更→PC/HD；受影响规则重算，原正式决定不自动撤销；转学院/原签发机关。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "报告、研究成果与报送版次；E",
          "requirement": "原文第08节规则 R017。T=进入结项/总结且该情形要求报告；F=申报/实施前、尚未进入总结；U=是否适用校级团队或个人报告清单不明；[SRC-001/005]；F034/F035/F038；M019/M020/M023；核报告/调研成果与项目键、作者声明、格式、版次及批次受理时间；P+S/O；应交报告可核且可读→PF；应交未交→NM；正文不可读→UR；版本/作者矛盾→CF；现行篇幅阈值未知→PC；转提交者/学院验收人。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R018",
          "title": "日志、照片、视频、报道辅助证据；D/E/G",
          "requirement": "原文第08节规则 R018。T=当批结项/评优确有对应附件要求或提交者以其证某事实；F=尚未到形成期且不适用；U=是否必交具体数量/格式未知；[SRC-001/002/005]；F031/F037/F034/F035；M015/M018/M021/M022；逐媒体核来源、人物、时间/地点、有效 URL、可读性，按所适用批次匹配种类而非旧附件号；P+S/X/O；对实际所呈事实可核→PF；有当前明确义务而缺→NM；文件打不开→UR；媒体原页失联→SU；与日志时空冲突→CF；当期数量不明→PC；转提交者/学院检查员。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "成果与个人贡献归属；E/G",
          "requirement": "原文第08节规则 R019。T=申请按人认定署名/个人贡献；F=仅项目成果存在性核验；U=贡献主体与证据关系未知；[SRC-001/005/009]；F015/F034/F036；M032/M005/M019；核成果 ID、作者原文、贡献记录及成员期间；S06 只证材料记载，不作 G06 确权；S/X/O；声明/署名记录事实可核→PF；作者版本矛盾→CF；要求确权但未有权决定→HD；贡献证据不够→NM/HD；转贡献当事人/学院，权属转 G06。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R020",
          "title": "结项收件、学院检查与正式验收区别；E/G",
          "requirement": "原文第08节规则 R020。T=引用完成/验收结果；F=尚未到结项阶段；U=该批终局签发权限与流程未证；[SRC-001/005]；F039/F040/F038；M023/M019/M020；分开核“已收件”“已检查”“有权结项决定”，签发者、效力、版本；O/H+P；某一现存阶段事实可核→PF；报告齐但没有签发结果→HD；有权原记录失联→SU；同案结论版本冲突→CF；转学院/校团委当批 Owner。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "个人申报时间量值与原始时间片；F",
          "requirement": "原文第08节规则 R021。T=明确提出个人实践时间认证；F=只验实施不申请时长；U=校内是否有独立 F 办理入口不明；[SRC-001/006]；F041/F042/F030；M024/M015/M016/M017；对齐同一人的原始起止、休息/重叠与申报“天/小时”等原单位；S+X/O；可复核原始声称→PF；申报与佐证冲突→CF；当前申报材料缺→NM（入口已证前提）；换算算法/单位未证→PC；转本人/有权时长机关。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "跨活动时间重叠及邻接决定有效性；F/G",
          "requirement": "原文第08节规则 R022。T=涉同人多活动、志愿服务或需要 G/S/T 前置；F=没有邻接依赖且不要求排重；U=邻接账本或 G50 键未可用；[SRC-006/009]；F043/F048/F027；M031/M025/M013/M016；以身份键+真实时间片比较重叠，查邻接 Owner decisionId+version+revocation，只读不回写；O/H+X；无实际重叠且权威引用可核→PF；存在交叉→CF（仅提示，非自动违规）；来源不可取→SU；重复计入政策未证→PC/HD；转 S05-T02/S05-T01/G Owner 及学院。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "正式社会实践时长认定值；F/G",
          "requirement": "原文第08节规则 R023。T=有正式核定或下游需要引用；F=只在采集原始时间尚未申请认定；U=签发部门/量纲/权限未证；[SRC-006/009]；F044/F041/F042；M025/M024；核签发机关、单位、核定值、有效日、撤销与原始事实关联；O 唯一承载正式决定；可核“某有权机关作出何核定”→PF，绝非本模板核定；没有既有决定→HD；正式权限/折算口径未证→PC；签发源失联→SU；转社会实践时长归口机关。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "评优申报、院级拟推荐与校级结果；G",
          "requirement": "原文第08节规则 R024。T=进入正式评优或引用实践荣誉；F=只结项不参与评优；U=对应批次评优清单/程序未证；[SRC-003/004/005]；F045/F034/F036；M027/M028/M019/M020；核申报对象、学院拟推荐、校方公示、异议与最终生效版，分校院层次；O+P，宣传稿 S 不能代决定；各自确实存在的申报/推荐/公示事实→PF；对象或层级错→CF；校级最终结果未签/异议未结→HD；原页失联→SU；现行评优条件不明→PC；转学院/校团委评审负责人。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "补件、撤回/终止请求的真实性；B–G",
          "requirement": "原文第08节规则 R025。T=提出更正、补件、撤回或终止；F=没有请求且流程正常；U=是否具备有效提交人/请求类别不清；[SRC-003/004]（正式撤回仅结构线索）；F046/F010/F011/F033；M029/M026/M003；核本人/代理、请求目标、范围、受理回执、日期；H+S/O；已提交真实请求→PF；冒名/跨人范围→CF；请求原件缺→NM；学校准撤回/时效规则未证→PC/HD；转原受理机关，不自动撤销旧批准。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "异议/复核及对请求的有权处理结论；G或结果后",
          "requirement": "原文第08节规则 R026。T=收到异议/复核或引用处理结果；F=没有被质疑决定/从未提出请求；U=救济类别/窗口或终局权限未核；[SRC-003/004/006]；F047/F046/F040/F044/F045；M029/M030/M023/M025/M028；核受影响决定版、受理窗口、处理者授权、书面处理/更正关联及效力；P+O/H；能核已受理、已答复等分阶段事实→PF；请求待处理→HD；处理正文失联→SU；错案错人→CF；正式渠道/期限未知→PC；转原有权机关及其上级指定复核者。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "A",
      "name": "申报准备",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "B"
    },
    {
      "id": "B",
      "name": "学院受理与初审状态核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "C"
    },
    {
      "id": "C",
      "name": "校级立项/备案状态核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "D",
      "skippableReason": "仅适用于当批确有校级立项/备案路径的事项；不能因缺校级记录推断活动不存在。"
    },
    {
      "id": "D",
      "name": "实施/过程更新",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "E"
    },
    {
      "id": "E",
      "name": "总结和结项材料核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "F"
    },
    {
      "id": "F",
      "name": "实践时长认定申请核验/转交",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "G",
      "skippableReason": "仅在当事人申请实践时长/学分等认定时进入；本阶段不自动计算或签发。"
    },
    {
      "id": "G",
      "name": "评优/引用/复核转交",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "skippableReason": "仅在评优、引用、异议/复核触发时办理；评优不得替代结项或时长认定。"
    }
  ],
  "outputs": [
    {
      "id": "raw-practice-fact-record",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "current-stage-supplement-list",
      "kind": "supplement-list",
      "audience": "student"
    },
    {
      "id": "duration-or-review-decision-referral",
      "kind": "item-feedback",
      "audience": "teacher"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}
export const templateVersion: TemplateVersion = template

export const r02Metadata: R02Metadata = {
  "templateId": "S06-T05",
  "name": "学生社会实践立项、成果与实践时长认定审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S06-T05.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/S06-T05.md",
  "sourceDocumentBytes": 147352,
  "sourceDocumentSha256": "020bcec8fac19dce14672c243301283fe71f32ee7f84860b41bfad89603a51af",
  "officialSchoolTemplate": false,
  "researchEvidenceStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "auditedAt": "2026-10-24",
  "criteria": [
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "批次与有效政策；A–G"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "学生身份与适用学段；A/F及引用"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "提交人/代理权限；A/B/G及请求"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "项目/个人案卷、类别与归属；A–G"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "团队、队长、成员及逐人期间；A–F"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "指导教师及实际指导身份；A/D/G"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "申报计划和预计活动范围；A/B"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "学院收件时点与回执；B/E"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "学院审核、排序、拟推荐；B/C/G"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "校级立项/答辩/备案结果；C及下游"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "外部专项/岗位报名与真实录取；A–D"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "活动承诺与出行安全前置引用；B–D"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "实际活动日期、地点及日志事件；D/E"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "个人逐时段参与而非团队均分；D/F"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "实践单位证明与签发真实性；D–F"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "计划/人员/成果变更链与生效；B–G"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "报告、研究成果与报送版次；E"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R018",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "日志、照片、视频、报道辅助证据；D/E/G"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "成果与个人贡献归属；E/G"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "结项收件、学院检查与正式验收区别；E/G"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "个人申报时间量值与原始时间片；F"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R022",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "跨活动时间重叠及邻接决定有效性；F/G"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R023",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "正式社会实践时长认定值；F/G"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R024",
      "srcIds": [
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "评优申报、院级拟推荐与校级结果；G"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R025",
      "srcIds": [
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "补件、撤回/终止请求的真实性；B–G"
    },
    {
      "sectionId": "practice-lifecycle-facts",
      "criterionId": "R026",
      "srcIds": [
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "异议/复核及对请求的有权处理结论；G或结果后"
    }
  ]
}
