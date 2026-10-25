import type { TemplateVersion } from "@profer/shared"

export const T01T08_TEMPLATE: TemplateVersion = {
  "templateId": "T01-T08",
  "version": 1,
  "schemaVersion": 2,
  "name": "教师发起的课程成绩更正材料审核",
  "description": "本地研究模板 · 非校方正式模板。教师发起的课程成绩更正材料审核的材料解析、事实核对和审阅建议用途；政策适用性、授权、期限和最终办理结果须由有权人员人工确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；政策证据状态为 PARTIAL，任何未确认规则均不得自动产生正式通过或拒绝。",
  "objectType": "custom",
  "displayName": {
    "template": "T01-T08 · 教师发起的课程成绩更正材料审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · id；Case 案件号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：id；Case 案件号；P0 起；C：本案唯一生成，非校方许可号。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F001；id；Case 案件号；P0 起。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F002",
      "label": "F002 · enum；Case 阶段 P0–P5/PX",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：enum；Case 阶段 P0–P5/PX；全程；C：案件事件推导，需区分学校真实办理状态。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F002；enum；Case 阶段 P0–P5/PX；全程。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F003",
      "label": "F003 · enum；Target 学段/培养类型",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：enum；Target 学段/培养类型；P0；S：学籍与课程归口；D 辅助。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F003；enum；Target 学段/培养类型；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F004",
      "label": "F004 · id/string；Course 开课单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：id/string；Course 开课单位；P0–P1；S：学期课程任务；D 辅助。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F004；id/string；Course 开课单位；P0–P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F005",
      "label": "F005 · id；Course 课程代码",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：id；Course 课程代码；P0–P1；S：正式课程任务与成绩库。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F005；id；Course 课程代码；P0–P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F006",
      "label": "F006 · string；Course 课程名称",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：string；Course 课程名称；P0；S；D 辅助。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F006；string；Course 课程名称；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F007",
      "label": "F007 · string；Course 学年学期/考核批次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：string；Course 学年学期/考核批次；P0–P1；S：课程与成绩正式记录。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F007；string；Course 学年学期/考核批次；P0–P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F008",
      "label": "F008 · id；Course 教学班/课程班标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：id；Course 教学班/课程班标识；P0–P1；S：授课任务及成绩簿。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F008；id；Course 教学班/课程班标识；P0–P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F009",
      "label": "F009 · id；GradeRecord 权威成绩记录键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：id；GradeRecord 权威成绩记录键；P0–P1；S：正式成绩库或档案映射。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F009；id；GradeRecord 权威成绩记录键；P0–P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F010",
      "label": "F010 · id+string；Target 学号与可核姓名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：id+string；Target 学号与可核姓名；P0–P1；S：学籍/成绩源；D 辅助。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F010；id+string；Target 学号与可核姓名；P0–P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F011",
      "label": "F011 · id；TeacherAssignment 申请教师工号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：id；TeacherAssignment 申请教师工号；P0；S：认证身份/人事任课名册。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F011；id；TeacherAssignment 申请教师工号；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F012",
      "label": "F012 · string；TeacherAssignment 教师姓名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：string；TeacherAssignment 教师姓名；P0；S：任职名册；D 辅助。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F012；string；TeacherAssignment 教师姓名；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F013",
      "label": "F013 · ref；TeacherAssignment 当期任课/评分职责",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ref；TeacherAssignment 当期任课/评分职责；P0–P2；S：教学任务/课程组及院系核验。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F013；ref；TeacherAssignment 当期任课/评分职责；P0–P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F014",
      "label": "F014 · ref；TeacherAssignment 代理/委托权限",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ref；TeacherAssignment 代理/委托权限；条件 P0–P2；A/S：现行代理授权或院系认证。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F014；ref；TeacherAssignment 代理/委托权限；条件 P0–P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F015",
      "label": "F015 · enum；GradeRecord 草稿/正式/已执行等状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：enum；GradeRecord 草稿/正式/已执行等状态；P0；S：学校成绩源。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F015；enum；GradeRecord 草稿/正式/已执行等状态；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F016",
      "label": "F016 · decimal/enum；GradeRecord 原正式成绩",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：decimal/enum；GradeRecord 原正式成绩；P0–P1；S：冻结旧值。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F016；decimal/enum；GradeRecord 原正式成绩；P0–P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F017",
      "label": "F017 · decimal/enum；Target 拟更正成绩",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：decimal/enum；Target 拟更正成绩；P0–P1；D：教师具体请求，后续由 A 决定是否采用。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F017；decimal/enum；Target 拟更正成绩；P0–P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F018",
      "label": "F018 · enum/set；Target 受影响分项",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：enum/set；Target 受影响分项；P1；D＋原考核记录；S 交叉核验。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F018；enum/set；Target 受影响分项；P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F019",
      "label": "F019 · enum；Case 错误主张类型",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：enum；Case 错误主张类型；P0；D：错登/错加/漏评等主张；非事实裁定。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F019；enum；Case 错误主张类型；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F020",
      "label": "F020 · string；Case 事实发现经过和理由",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：string；Case 事实发现经过和理由；P0；D：教师陈述。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F020；string；Case 事实发现经过和理由；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F021",
      "label": "F021 · ref；GradeRecord 原正式提交版本及采集时点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ref；GradeRecord 原正式提交版本及采集时点；P1 前必须锚定；S：版本化快照/档案审查记录。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F021；ref；GradeRecord 原正式提交版本及采集时点；P1 前必须锚定。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F022",
      "label": "F022 · ref；AssessmentEvidence 当期教学大纲/评分方案版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ref；AssessmentEvidence 当期教学大纲/评分方案版本；条件 P1–P2；S：学院备案课纲；D 为线索。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F022；ref；AssessmentEvidence 当期教学大纲/评分方案版本；条件 P1–P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F023",
      "label": "F023 · ref/set；AssessmentEvidence 原始答卷/作品等定位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ref/set；AssessmentEvidence 原始答卷/作品等定位；条件 P1–P2；S：院系原件；D 上传扫描件需与原件对照。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F023；ref/set；AssessmentEvidence 原始答卷/作品等定位；条件 P1–P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F024",
      "label": "F024 · record；AssessmentEvidence 分项评分/平时记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：record；AssessmentEvidence 分项评分/平时记录；条件 P1–P2；S：原始登记及过程材料。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F024；record；AssessmentEvidence 分项评分/平时记录；条件 P1–P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F025",
      "label": "F025 · record；Target 可复算差异与计算过程",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：record；Target 可复算差异与计算过程；条件 P1–P2；C：据原始 F016/F022–F024 复算；人工确认。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F025；record；Target 可复算差异与计算过程；条件 P1–P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F026",
      "label": "F026 · set；AssessmentEvidence 材料与字段位置索引",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：set；AssessmentEvidence 材料与字段位置索引；P1 起；C：带来源及页行的证据映射。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F026；set；AssessmentEvidence 材料与字段位置索引；P1 起。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F027",
      "label": "F027 · record；AssessmentEvidence 材料版本/哈希/取证时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：record；AssessmentEvidence 材料版本/哈希/取证时间；P1 起、每次变更；C：上传与校方提供记录的可核追踪。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F027；record；AssessmentEvidence 材料版本/哈希/取证时间；P1 起、每次变更。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F028",
      "label": "F028 · ref；PriorDecisionRef 学生成绩复核结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ref；PriorDecisionRef 学生成绩复核结论；条件 P1–P2；A：S02-T06 或校方成绩复核权威结果。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F028；ref；PriorDecisionRef 学生成绩复核结论；条件 P1–P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F029",
      "label": "F029 · ref；PriorDecisionRef 违纪、考核资格等权威决定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ref；PriorDecisionRef 违纪、考核资格等权威决定；条件 P1–P2；A：相邻有权机关签发。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F029；ref；PriorDecisionRef 违纪、考核资格等权威决定；条件 P1–P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F030",
      "label": "F030 · record；Decision 院系复核意见",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：record；Decision 院系复核意见；P3 才产生；A：有权开课单位。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F030；record；Decision 院系复核意见；P3 才产生。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F031",
      "label": "F031 · ref；Decision 院系复核人角色和签署真实性",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ref；Decision 院系复核人角色和签署真实性；P3 才产生；S/A：岗位授权与签署记录。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F031；ref；Decision 院系复核人角色和签署真实性；P3 才产生。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F032",
      "label": "F032 · record；Decision 正式更正批准/不准及作用目标",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：record；Decision 正式更正批准/不准及作用目标；P4 才产生；A：适用学段有权决定机关。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F032；record；Decision 正式更正批准/不准及作用目标；P4 才产生。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F033",
      "label": "F033 · ref；Decision 决定机关/人员授权、签发时点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ref；Decision 决定机关/人员授权、签发时点；P4；S/A：权威认证的签发及授权。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F033；ref；Decision 决定机关/人员授权、签发时点；P4。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F034",
      "label": "F034 · record；ExecutionAudit 成绩回写操作与时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：record；ExecutionAudit 成绩回写操作与时间；P5 才产生；S：获授权系统不可变审计。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F034；record；ExecutionAudit 成绩回写操作与时间；P5 才产生。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F035",
      "label": "F035 · ref；GradeRecord 执行后权威成绩版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ref；GradeRecord 执行后权威成绩版本；P5 或历史交叉核验；S：成绩系统/档案。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F035；ref；GradeRecord 执行后权威成绩版本；P5 或历史交叉核验。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F036",
      "label": "F036 · record；Event 补件/更换证据及依赖变化",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：record；Event 补件/更换证据及依赖变化；PX；C：案件版本事件，附授权动作引用。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F036；record；Event 补件/更换证据及依赖变化；PX。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F037",
      "label": "F037 · record；Event 撤回申请、提出人及主张生效点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：record；Event 撤回申请、提出人及主张生效点；条件 PX；D：申请人提出；S/A 核真实性与处置。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F037；record；Event 撤回申请、提出人及主张生效点；条件 PX。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F038",
      "label": "F038 · ref；Event 异议/复核申请与权威结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ref；Event 异议/复核申请与权威结果；条件 PX；A：主管部门复核程序。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F038；ref；Event 异议/复核申请与权威结果；条件 PX。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F039",
      "label": "F039 · ref；PolicyScope 当前适用政策/校本配置版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ref；PolicyScope 当前适用政策/校本配置版本；P0–P4；P：教务处/研究生院现行受控原文。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F039；ref；PolicyScope 当前适用政策/校本配置版本；P0–P4。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F040",
      "label": "F040 · datetime/record；PolicyScope 申请/补件/撤回/复核时限依据",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：datetime/record；PolicyScope 申请/补件/撤回/复核时限依据；各触发点条件需用；P＋A：现行办事通知或主管确认。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F040；datetime/record；PolicyScope 申请/补件/撤回/复核时限依据；各触发点条件需用。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 核申请者本人及对应学期授课/评分责任",
      "purpose": "核申请者本人及对应学期授课/评分责任；人事、教务/研究生培养单位；学校认证身份与任课任务清单/核验回执；P0–P2 当（权威取）；代理另看 M010；学院出具并可核真真实性的教学任务证明；非教师自行声明；F003/F004/F007/F008/F011–F014；SRC-001/002/004。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "核申请者本人及对应学期授课/评分责任；人事、教务/研究生培养单位",
        "学校认证身份与任课任务清单/核验回执",
        "P0–P2 当（权威取）；代理另看 M010"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 锚定已正式提交的原成绩/状态",
      "purpose": "锚定已正式提交的原成绩/状态；教务或研究生成绩系统、归档单位；带记录键、学期、学生、提交状态、旧值/版本的受控快照；P0–P2 当（权威取）；官方签发的成绩登记/档案摘录或主管核验回执；普通截图只作线索；F003–F010/F015/F016/F021/F035；SRC-001/002/006。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "锚定已正式提交的原成绩/状态；教务或研究生成绩系统、归档单位",
        "带记录键、学期、学生、提交状态、旧值/版本的受控快照",
        "P0–P2 当（权威取）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "M003 · 证明谁要求更正、何成绩和为何更正",
      "purpose": "证明谁要求更正、何成绩和为何更正；教师/合法代理；教师申请说明及拟值；2017 本科曾用“补录（更正）登记表”；P0–P1 当；现行校方正式电子申请/经确认的书面说明；研究生表格正文待核；F001/F011/F012/F017–F020；SRC-001/002/004。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "证明谁要求更正、何成绩和为何更正；教师/合法代理",
        "教师申请说明及拟值；2017 本科曾用“补录（更正）登记表”",
        "P0–P1 当"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M004",
      "name": "M004 · 证明原评定和登分依据",
      "purpose": "证明原评定和登分依据；开课单位档案/任课教师；原始学生成绩登记表（含分项、总评）、批阅/登记流水；P1–P2 条：错录、错加、总评/分项争议；本科历史文本明确原登记表；受控电子成绩登记及原件核验记录，不能只靠重新制作的新表；F005–F010/F016/F018/F021/F024；SRC-001/002。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "证明原评定和登分依据；开课单位档案/任课教师",
        "原始学生成绩登记表（含分项、总评）、批阅/登记流水",
        "P1–P2 条：错录、错加、总评/分项争议；本科历史文本明确原登记表"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M005",
      "name": "M005 · 证明实际作答/提交及批阅得分",
      "purpose": "证明实际作答/提交及批阅得分；任课教师/阅卷组/院系档案；试卷、答题卡、课程论文、实验报告、作品或可信数字原件；P1–P2 条：漏评/误判、答卷分项争议；不对所有课程强制纸卷；课程当时认可的电子作品、平台原始导出、监控下核验原件等（需校方认定）；F010/F018/F023/F025/F026；SRC-001/002。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "证明实际作答/提交及批阅得分；任课教师/阅卷组/院系档案",
        "试卷、答题卡、课程论文、实验报告、作品或可信数字原件",
        "P1–P2 条：漏评/误判、答卷分项争议；不对所有课程强制纸卷"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 · 证明该班该学期应适用的评定标准",
      "purpose": "证明该班该学期应适用的评定标准；开课单位/课程组；经备案课纲、课程说明、评分细则、参考答案、总评构成；P1–P2 条：涉及评分标准、总评构成、评分计算；学院可核的当期电子大纲/正式命题评分标准；F005–F008/F018/F022/F025/F039；SRC-001/002/009。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "证明该班该学期应适用的评定标准；开课单位/课程组",
        "经备案课纲、课程说明、评分细则、参考答案、总评构成",
        "P1–P2 条：涉及评分标准、总评构成、评分计算"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "M007 · 证明过程性分项与当时记载",
      "purpose": "证明过程性分项与当时记载；课程组/任课教师/学校平台；考勤、作业、测验、实验及平时成绩记录；P1–P2 条：过程成绩或权重影响，非所有更正必交；可核原始平台导出及其时间日志、学院归档原表；F010/F018/F024/F025；SRC-001/002。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "证明过程性分项与当时记载；课程组/任课教师/学校平台",
        "考勤、作业、测验、实验及平时成绩记录",
        "P1–P2 条：过程成绩或权重影响，非所有更正必交"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 · 展示原值与拟值差额的推导",
      "purpose": "展示原值与拟值差额的推导；教师，或预审工具生成经人工核对；差异对照/复算说明（不作为独立权威原件）；P1–P2 条：统分、权重、转换或错加能计算时；能直接重现步骤的受控系统计算记录；F016–F018/F021–F025；SRC-001/002。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "展示原值与拟值差额的推导；教师，或预审工具生成经人工核对",
        "差异对照/复算说明（不作为独立权威原件）",
        "P1–P2 条：统分、权重、转换或错加能计算时"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M009",
      "name": "M009 · 引用学生复核的既有结论",
      "purpose": "引用学生复核的既有结论；S02-T06 有权承办单位；学生复核受理/事实复核结果/正式结论 ID；P1–P3 条：仅已经发生学生复核时；权威决定服务或校方签发书面复核结果；F028/F038；SRC-002/005。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "引用学生复核的既有结论；S02-T06 有权承办单位",
        "学生复核受理/事实复核结果/正式结论 ID",
        "P1–P3 条：仅已经发生学生复核时"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 核对代理/代课/签字人员授权",
      "purpose": "核对代理/代课/签字人员授权；人事/开课单位/主管机构；真实教学任务调整、委托书或岗位授权回执；P0–P4 条：申请人与已核授课/审批人员不一致时；人事/教务可信授权名册、机构正式电子授权；F011–F014/F031/F033；SRC-001/002。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "核对代理/代课/签字人员授权；人事/开课单位/主管机构",
        "真实教学任务调整、委托书或岗位授权回执",
        "P0–P4 条：申请人与已核授课/审批人员不一致时"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 引用涉及违纪、作弊、无考核资格、课程方案等前置有权决定",
      "purpose": "引用涉及违纪、作弊、无考核资格、课程方案等前置有权决定；相邻业务机关；已签发且能核效力的权威决定引用；P1–P4 条：相关前置事实被触发；主管部门电子决定或带核验渠道的官方文件；F029/F039；SRC-001/002/006。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "引用涉及违纪、作弊、无考核资格、课程方案等前置有权决定；相邻业务机关",
        "已签发且能核效力的权威决定引用",
        "P1–P4 条：相关前置事实被触发"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 证明院系完成真实复核及意见",
      "purpose": "证明院系完成真实复核及意见；开课学院/系部有权者；院系复核记录、核原件说明、签审意见；P3 后（进入 P3 才可要求已生成者）；经校方确认的电子审批流/数字签章，不是扫描图自行验真；F030/F031；SRC-001/002/004。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "证明院系完成真实复核及意见；开课学院/系部有权者",
        "院系复核记录、核原件说明、签审意见",
        "P3 后（进入 P3 才可要求已生成者）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 · 证明有权机关批准或不批准及具体处置",
      "purpose": "证明有权机关批准或不批准及具体处置；教务处历史授权/研究生适用机关待核；正式更正决定及认证的签发记录；P4 后（必须由主管部门形成）；有权系统正式审批决定记录和可核验签章；F032/F033/F039；SRC-002/004/006。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "证明有权机关批准或不批准及具体处置；教务处历史授权/研究生适用机关待核",
        "正式更正决定及认证的签发记录",
        "P4 后（必须由主管部门形成）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 证明真正获授权修改和操作责任",
      "purpose": "证明真正获授权修改和操作责任；教务/研究生系统管理者；系统事务审计、执行结果前后值；P5 后（只在更正实施后）；学校授权系统可核的审计导出/正式回执；F034/F035；SRC-001/006。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "证明真正获授权修改和操作责任；教务/研究生系统管理者",
        "系统事务审计、执行结果前后值",
        "P5 后（只在更正实施后）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 核实转档、历史成绩与完成归档",
      "purpose": "核实转档、历史成绩与完成归档；档案馆/教学单位；校方归档条目、历史成绩快照或存档凭证；P1 条：毕业/归档历史案；P5 后：执行归档；有效电子档案索引/档案机构核验回执；F009/F021/F035；SRC-001/006/010。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "核实转档、历史成绩与完成归档；档案馆/教学单位",
        "校方归档条目、历史成绩快照或存档凭证",
        "P1 条：毕业/归档历史案；P5 后：执行归档"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 表达申请人撤回/补件/替换材料及版本事件",
      "purpose": "表达申请人撤回/补件/替换材料及版本事件；原申请人/受理单位；撤回意愿、补件清单、替换说明及处理回执；PX 条：有撤回或换版请求时；不预交；经认证办事记录/具有可核签署的纸质声明；F001/F027/F036/F037；SRC-001/006 仅作成绩资料真实性的一般参照，不证明校本撤回政策。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "表达申请人撤回/补件/替换材料及版本事件；原申请人/受理单位",
        "撤回意愿、补件清单、替换说明及处理回执",
        "PX 条：有撤回或换版请求时；不预交"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 · 引用对已有决定的异议/复核处理",
      "purpose": "引用对已有决定的异议/复核处理；主管复核/申诉机关；异议申请、受理回执、后续正式复核结果；PX 条/后：前者提出时有，结论仅随后生成；主管机关有来源的电子/纸质决定；F028/F032/F038；SRC-005/006。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 9007199254740991,
      "requiredElements": [
        "引用对已有决定的异议/复核处理；主管复核/申诉机关",
        "异议申请、受理回执、后续正式复核结果",
        "PX 条/后：前者提出时有，结论仅随后生成"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "M018 · 证明批量影响范围不遗漏、不错绑",
      "purpose": "证明批量影响范围不遗漏、不错绑；教师/开课单位；多学生成绩差异对照与各自证据映射；P1–P3 条：多人同批；校方可核的成绩批次导出、逐人申请明细；F008–F010/F016–F027；SRC-001/002。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "证明批量影响范围不遗漏、不错绑；教师/开课单位",
        "多学生成绩差异对照与各自证据映射",
        "P1–P3 条：多人同批"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M019",
      "name": "M019 · 证明适用政策、签审角色与截止规则",
      "purpose": "证明适用政策、签审角色与截止规则；教务处/研究生院；带发布时间/适用范围/效力的现行校本文件和当期通知；全阶段 条（权威取）：要评价政策门槛时；学校正式公告、受控规章原文或主管部门书面答复；F039/F040；SRC-001/002/003/004/008/009。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "证明适用政策、签审角色与截止规则；教务处/研究生院",
        "带发布时间/适用范围/效力的现行校本文件和当期通知",
        "全阶段 条（权威取）：要评价政策门槛时"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "evidence-checks",
      "name": "原稿审核规则逐项核验",
      "description": "依据 T01-T08 原稿规则表逐条生成稳定 criterion ID；SRC 是研究来源索引，不是案卷材料 SourceRef。所有未确认政策均需人工确认。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "R001 · P0",
          "requirement": "R001 P0｜已提交课程成绩路由；真＝请求更改已正式提交课程成绩；假＝草稿编辑、招生考试或纯首次录入→NA 并路由；未知＝不能确认记录状态；SRC-001/002/006；F003/F005/F007/F009/F015/F021；M002；比较学校权威成绩状态/提交版本、学段和考试性质；不能依据申请标题“更正”认定；正式提交状态以申请目标旧版本时点为准；记录源暂不可达→SU；身份/业务归口争议→HD；下步：相应学段成绩归口",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R002",
          "title": "R002 · P0–P1",
          "requirement": "R002 P0–P1｜真实申请人身份；真＝认证会话与教师名册一致；假＝确认无该主体且无代理声明→HD 交核；未知＝身份链缺/失联；SRC-001/002；F011/F012/F026；M001/M003；认证 ID 比工号、当时在职记录，保留上传姓名作线索；不能据 Renderer actor 或签名图验人；离岗、跨校授课例外转 R004；来源失联→SU；可读不符→C/HD；下步：教务/人事或培养单位身份核验岗",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "R003 · P0–P2",
          "requirement": "R003 P0–P2｜当学期任课/评分职责；真＝职责覆盖目标课程、教学班、学期和考核分项；假＝确认不覆盖则交代理 R004/人工；未知＝任务分配资料不足；SRC-001/002；F004/F007/F008/F013；M001；比当时授课任务与归口名册，不用当前学期、同名教师替代；团队阅卷、代课另查作用范围；缺权威名册→SU；可读不符→C/HD；下步：开课单位核任课任务",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "R004 · 条件 P0–P4",
          "requirement": "R004 条件 P0–P4｜代理、离岗与代签授权；真＝申请或签发主体不同于已核责任人；假＝本人在权限内办理→NA；未知＝实质代理关系未明；SRC-001/002/004；F011–F014/F031/F033；M001/M010；查权威授权人、受托人、课程、对象、动作、授权有效期；教师代理不等于部门批准权；现行代理机制未证；只有委托图片→HD；无现行许可规则→PC；来源失联→SU；下步：开课单位及主管授权人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "R005 · P0–P2",
          "requirement": "R005 P0–P2｜一名学生的一条成绩记录归属；真＝学号、课程代码、学期、班级、记录键均同目标；假＝明确属于另一个学生/课程→C 并不合并；未知＝索引缺；SRC-001/006；F005–F010/F026；M002/M004/M005；同名/重修/跨班必须按稳定键匹配；表格逐行、作品逐页到目标；若旧纸档无 ID 由保管人建有根据的映射；自填缺关键定位→NM；官方键失联→SU；冲突→C；下步：成绩档案管理人",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R006",
          "title": "R006 · P0–P1",
          "requirement": "R006 P0–P1｜申请的具体性；真＝申请人描述目标、拟值、受影响分项、发现理由；假＝经确认该对象无改分请求→NA；未知＝陈述缺项或无法读取；SRC-001/002/004；F017–F020/F026；M003；逐学生比较拟值与原因的存在性和一致指向，只能 PASSFACT“申请内容明确”，不能 PASSFACT“拟值正确”；历史表单非现行硬格式；文本缺失→NM；附件读不清→U；拟值前后互斥→C；下步：申请教师补明细",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "R007 · P0–P2",
          "requirement": "R007 P0–P2｜原正式成绩版本与旧值；真＝官方源有已提交状态、旧值、版本、时间；假＝经权威确定原目标记录不存在→R001 路由，不创造旧值；未知＝可用快照不完整；SRC-001/006；F009/F015/F016/F021/F027；M002/M015；优先当期成绩系统权威快照，历史案核受控档案；比对采集时点与事件版本，教师截图仅线索；不可用申请拟值倒填原值；旧版本不可取得→SU；自填冲突→C；无版本→HD；下步：成绩库/档案保管人",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "R008 · 条件 P1–P2",
          "requirement": "R008 条件 P1–P2｜原始成绩登记与录入差异；真＝主张原登记、分项或总评与系统旧值不一致；假＝不涉登分/原登记争点→NA；未知＝原表归属/来源未定；SRC-001/002；F016/F018/F024/F026/F027；M002/M004；比当时归档登记的具体行、原签/原电子版本和 F016，注明 2017 对原登记表的历史要求；自制“新版原表”不能替档案原件；原始材料责任人持有却未提供→NM；学校归档源失联→SU；行不符→C；下步：开课单位档案核验",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "R009 · 条件 P1–P2",
          "requirement": "R009 条件 P1–P2｜具体答卷/作品评分依据；真＝主张漏判、错判或作品关联错误；假＝仅可由原登记和成绩源证实的纯抄录→NA；未知＝错误性质不清；SRC-001/002；F010/F018/F023/F026/F027；M005/M006；逐题/逐作品核目标、原批注与当期标准；电子作品可作为待学校认可的原始媒介，不强求纸卷；主观重新评分需专业复评；作品应有而缺→NM/SU 判保管者；扫描不清→U；评分争议→HD；下步：阅卷组/院系",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "R010 · 条件 P1–P2",
          "requirement": "R010 条件 P1–P2｜课程评分方案与生效版本；真＝拟改值取决于评分标准、考核方式、权重或舍入；假＝独立录入错字且评分不争议→NA；未知＝实际评定方案未定；SRC-001/002/009；F005/F007/F018/F022/F039；M006/M011/M019；以该班当期备案大纲及已生效的 T01-T06 权威决定为准；SRC-009 仅确认 2024 当期不得随意改权重；跨校规则、事后改表不能反向生效；当期版本失联→SU；哪版有效未知→PC/HD；自填权重冲突→C；下步：开课学院教学管理岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "R011 · 条件 P1–P2",
          "requirement": "R011 条件 P1–P2｜过程性分项的原始事实；真＝涉及出勤、作业、实验、平时分数或其计算；假＝未涉及过程记录→NA；未知＝课程是否有该构成待核；SRC-001/002；F018/F022/F024/F026；M007/M006；按活动时间、学生、分项核平台原始记录/院系归档；不凭新造汇总表覆盖日志；专业评分不由 AI 重给；教师应交材料缺→NM；档案平台不可用→SU；两源冲突→C；下步：课程组/平台保管人",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "R012 · 条件 P1–P2",
          "requirement": "R012 条件 P1–P2｜可复现加总、录入或权重差异；真＝属于可按已核原值和公式计算的错误；假＝主观评分争议无法直接复算→NA，并转 HD；未知＝数值精度或标准不明确；SRC-001/002/006；F016–F018/F021–F025；M004/M006/M007/M008；在冻结分项、有效公式、评分制和舍入规则上独立复算旧值/拟值；计算表 M008 非原始权威证据；AI 可 PASSFACT“算术差异复现”，不能批准拟值；关键分项缺→NM/SU；小数 OCR 模糊→U；公式不一致→C；评分裁量→HD；下步：原阅卷/开课单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "R013 · 条件 P1–P3",
          "requirement": "R013 条件 P1–P3｜学生复核前置结果引用；真＝有权学生复核事项确曾形成记录/决定；假＝未发生学生复核→NA；未知＝教师只转述或结果效力未明；SRC-002/005；F010/F028/F038；M009；只核上游 S02-T06 结论 ID、学生课程、签发时点、版本、效力；学生申请尚在途≠结论；不重新决定学生复核；上游源失联→SU；口头/聊天截图→HD；上游结论矛盾→C；下步：学生成绩复核原机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R014",
          "title": "R014 · 条件 P1–P4",
          "requirement": "R014 条件 P1–P4｜违纪/资格等先决决定效力；真＝涉考试违纪、成绩无效、资格或已批考核方案；假＝无前置争点→NA；未知＝成绩状态异常但决定不明；SRC-002/006；F015/F029/F039；M011；引用有权机关生效决定和其作用对象，不重审、撤销或用教师理由覆盖；只能核引用是否一致，不能改处分；正式决定不可取→SU；与更正理由冲突→C/HD；适用范围未明→HD；下步：原决定机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "R015 · 条件 P1–P3",
          "requirement": "R015 条件 P1–P3｜多人目标与批次证据映射；真＝一申请含多学生/多个成绩目标；假＝单目标→NA；未知＝名单不完整；SRC-001/002/006；F008–F010/F016–F018/F026/F027；M002/M018；每人分别建 GradeChangeTarget 与独立原版、拟值、材料页行；能逐人核验不等于学校允许一次批量批准；映射漏行→NM；同名错绑→C；批量授权未知→PC；下步：开课单位＋学段主管",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R016",
          "title": "R016 · 条件 P1–P5",
          "requirement": "R016 条件 P1–P5｜毕业后/转档历史记录；真＝目标成绩属于已毕业/转历史档；假＝当期未归档→NA；未知＝记录归档状态未明；SRC-001/006/010；F009/F021/F035；M002/M015；比原学籍成绩、历史档案、已出成绩证明所依据的版本；2019 校本办法第57–58条可确认当时档案/出证归口，但不能据此作毕业后更正受理和改档批准。版本差异及证书影响转有权机关；档案不可取→SU；两版不合→C；毕业后受理权限未知→PC/HD；下步：档案保管人＋主管部门",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "R017 · P0–P4",
          "requirement": "R017 P0–P4｜学段政策现行性与跨校误用；真＝核实当前流程、角色或期限需援引政策；假＝只作无政策阈值的文件提取→NA；未知＝政策版本/适用人群不定；SRC-001/002/003/004/007/008/009；F003/F039/F040；M019；文件发布机构、文号、适用学段、时期、废止/替代信息四维核对；SRC-009 仅支持 2024 继续使用 2022 规范，SRC-003/008 说明研究生可能换版；外校文件不作为本校硬门禁；校本正文无→PC；官网失联→SU；同事项新旧冲突→HD；下步：教务处/研究生院制度管理人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "R018 · P1–P4",
          "requirement": "R018 P1–P4｜证据来源、目标及版本可追踪性；真＝引用的材料承担某目标的成绩事实/评审事实；假＝与本目标无关材料→NA；未知＝不能定位哪份哪个版本；SRC-001/006；F001/F009/F010/F021/F026/F027；M003/M004/M005/M007/M018；每项断言存 M-id@version + page/row/question + source + acquiredAt，核来源先后、持有人、学生与哈希；如 V3 已提供经过验证的通用读文件结果可复用，但 G50 不是此通用工具的运行证明，本规则只判证据是否属于该目标；元数据缺→NM/HD；版本冲突→C；文件不可读→U；下步：证据保管人/案件承办人",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "R019 · P3",
          "requirement": "R019 P3｜院系事实审查意见与所据证据；真＝现行流程要求且 P3 已实际进入审查；假＝P0–P2 尚未到签审节点→NA；未知＝院系意见在途或环节未确认；SRC-001/002/004；F002/F026/F030；M012；对审查者已查证的学生、旧值、拟值、证据版本和意见逐项核；2017 本科流程属历史，研究生签审表尚未读；已到期应形成而缺→NM/PC 视现行要求；意见矛盾→C；下步：开课单位审查人",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R020",
          "title": "R020 · P3",
          "requirement": "R020 P3｜院系审查签署权限；真＝院系审查记录已签发；假＝尚未签发→NA，不提前催 P0 材料；未知＝签名真伪/授权时点未明；SRC-001/002/004；F014/F030/F031；M010/M012/M019；独立验机关、岗位、有效区间、目标范围与签署渠道；2017 院长/系主任只作历史参照；扫描印章不能 PASSFACT 权限；授权查不到→PC/HD；电子核验源断→SU；签署对象不符→C；下步：开课单位及授权管理员",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R021",
          "title": "R021 · P4",
          "requirement": "R021 P4｜有无正式更正决定及决定内容；真＝主管机关确有可追溯决定；假＝P0–P3 未决定→NA；未知＝声称批准但不见可信记录；SRC-001/002/004/006；F009/F016/F017/F021/F032；M002/M013；核批准/不准、具体每目标旧值/新值、所依据原版、签发时间、效力；拟值不同于批准值不得用最新申请覆盖决定；决定真实不代表符合当前权限，另看 R022；正式源不可达→SU；纯扫描章→HD；决定对象/值冲突→C；下步：学段有权决定机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "R022 · P4",
          "requirement": "R022 P4｜正式决定机关和授权真实性；真＝已经声称正式批准/驳回；假＝没有正式决定→NA，阻断进入 P5；未知＝当前学段有权岗位不明；SRC-002/004/007/008；F003/F031–F033/F039；M010/M013/M019；校验现行制度、授权生效期、签发渠道、对象和审批范围；历史“教务处批准”不自动证明 2026 岗位；研究生部门明确待核；现行文件未知→PC；授权无法验真→HD/SU；越权或跨学段→C；下步：教务处/研究生院授权负责人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "R023 · 条件 P5",
          "requirement": "R023 条件 P5｜回写操作的权限与决定约束；真＝进入已批准后的受控更正执行；假＝仍在申请/审批→NA；未知＝批准是否生效或操作者来源不明；SRC-001/002/006；F009/F021/F032–F034；M002/M013/M014；执行前比正式决定授权对象、旧版和待写入值，执行后核获授权系统操作者；操作人与决定者可分离，但具体岗位组合待校方确认；未取得可验证决定→HD/PC，禁止执行；操作者源断→SU；下步：系统受控执行岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "R024 · 条件 P5",
          "requirement": "R024 条件 P5｜回写与归档后的版本一致；真＝已收到正式执行或归档完成声明；假＝尚未执行→NA；未知＝无权威审计；SRC-001/006；F009/F016/F021/F032/F034/F035；M002/M013/M014/M015；比决定准许值、事务日志前后值、正式成绩新 revision 与档案索引；保留旧版，不能改写历史日志；毕业档案同步范围人工核；日志/新版取不到→SU；回写与决定不同→C；归档权限未明→HD；下步：成绩系统管理员/档案部门",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R025",
          "title": "R025 · PX",
          "requirement": "R025 PX｜材料补件替换的影响域；真＝某 M、原 F 或政策版本被替换/新增；假＝未有变化→NA；未知＝无法识别旧新配对；SRC-001/006；F001/F021/F026/F027/F036；M016＋具体被替换 M；比旧新 sourceVersion、目标引用、哈希和字段依赖，只使依赖旧版的事实结果 stale；已签发校方决定保留、提出复核提醒而非自动作废；版本无映射→HD；新材料缺→NM；冲突→C；下步：案卷承办人＋必要时原审批机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R026",
          "title": "R026 · 条件 PX",
          "requirement": "R026 条件 PX｜撤回意愿与有效处置；真＝已认证申请人提出撤回；假＝没有撤回→NA；未知＝身份、阶段或撤回权不明；SRC-001/002/006（均不提供现行撤回细则）；F001/F002/F021/F037/F039/F040；M003/M013/M016/M019；核撤回者本人、案卷及目标、声明时间与原决定状态；“提出撤回”≠“校方同意撤回”；P4/P5 后不静默恢复旧成绩；仅截图声明→HD；现行撤回节点/权限未核→PC；下步：原受理机构/有权撤回处置人",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R027",
          "title": "R027 · 条件 PX",
          "requirement": "R027 条件 PX｜对已决定事项的异议/复核；真＝已提出并能定位争议对象；假＝未提出异议→NA；未知＝申请或前置决定效力不明；SRC-005/006（仅路由线索和一般记录义务）；F028/F032/F038/F039/F040；M009/M013/M017/M019；分清学生复核、教师更正后的申诉及行政性质不同，核原决定 ID/版本、争点、申请时点和复核机关；尚未产生的复核结论不判缺件；决定源失联→SU；时限/管辖→PC；争点超出本事项→HD；下步：有权复核/申诉机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R028",
          "title": "R028 · 条件 P0–PX",
          "requirement": "R028 条件 P0–PX｜时限与例外判断；真＝有人据申报/补件/撤回/异议日期主张超期；假＝该案无时限争议→NA；未知＝当前校本时限未证；SRC-001/002/004/009；F002/F003/F039/F040；M019；必须先有现行校方正式规则、起算点、节假日算法、批次及例外审批权才比较时间；SRC-001 的成绩初录“两周”不等于教师更正申请期限；无现行依据→PC，不得超期拒绝；政策有例外争议→HD；下步：学段归口制度岗",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R029",
          "title": "R029 · 全阶段",
          "requirement": "R029 全阶段｜未来阶段材料的可达性；真＝进入 P3/P4/P5 或 PX 且相应事件实际已发生；假＝尚在更早阶段→NA；未知＝阶段由非可信前端声称；SRC-001/002/006；F001/F002/F030–F038；M012/M013/M014/M016/M017；校验案卷事件和真实签发/执行时点，P0 不要求 M012–M014，复核结论没出不要求 M017 后半；事件发生但缺记录按实际持有人分 NM/SU；阶段不可信→HD；尚未产生→NA；已签称无权威源→SU；下步：当前真实办理角色",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "R030 · 条件 P1–P5",
          "requirement": "R030 条件 P1–P5｜并行申请、决定和成绩记录竞态；真＝同一目标有第二申请/已更改版本/相冲突决定；假＝固定旧版未变且无并行影响→NA（无竞态）；未知＝无法查并行或最新官方版；SRC-001/006；F001/F009/F010/F021/F027/F032/F034/F035；M002/M013/M014；对目标稳定键与 expectedRevision 进行只读核对；若版本推进，旧事实先重审并请主管明确先后效力；批次里每人独立判，不能 last-write-wins；两决定不同→C；权威版本暂不可取→SU；下步：成绩归口及原决定机关",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "intake",
      "name": "已正式提交成绩与更正目标定位（P0–P1）",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "evidence-review",
      "workflowOwner": "local"
    },
    {
      "id": "evidence-review",
      "name": "原成绩、原始评分证据、版本及更正差异核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "intake",
      "nextStageId": "human-confirmation",
      "workflowOwner": "local"
    },
    {
      "id": "human-confirmation",
      "name": "更正程序、签发权限和执行结果人工确认",
      "kind": "handoff",
      "executorRole": "teacher",
      "returnToStageId": "evidence-review",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "review-summary",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "missing-evidence",
      "kind": "supplement-list",
      "audience": "reviewer"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-23T19:00:00.000Z"
}

export const r02Metadata = {
  "templateId": "T01-T08",
  "name": "教师发起的课程成绩更正材料审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T01-T08.md",
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/T01-T08.md",
  "sourceDocumentBytes": 135729,
  "sourceDocumentSha256": "4aaffb40ca2b8fe7e5452e9b71609338dfdc178e2beb31ef220b5e2e6c5fdb51",
  "sourceHashBasis": "dispatch manifest SHA-256; verified against original UTF-8 bytes plus one final LF",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyStatusRaw": "PARTIALLY_VERIFIED",
  "policyEvidenceStatus": "PARTIAL",
  "criteria": [
    {
      "sectionId": "evidence-checks",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-002",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-001",
        "SRC-006",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-007",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-002",
        "SRC-004",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R029",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R030",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "CURRENTITY-UNKNOWN（原文真实性已核）；成都理工大学《本科课程教学基本规范》；校本制度合集 PDF (https://cnae.cdut.edu.cn/local/B/CD/55/1347E45BA0243810CF9A9F4D250EAEE3C5577A641.pdf)，PDF 页 19–29（印刷页约 15–25）；第 15、17、20、30、33–36、43–44 条；另见机电工程学院全文页 (https://mee.cdut.edu.cn/info/1117/1944.htm)；2022-06-04 印发并自印发日起实施；明示废止 2018 年《教师本科教学工作规范》，未明示废止 2017 课程考核管理规定。2024 通知仍援引本规范，但2026 当前完整版本未获归口确认",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-002",
      "title": "CURRENTITY-UNKNOWN；成都理工大学《课程考核管理规定》，成理校教〔2017〕28 号；校本制度合集 PDF (https://cnae.cdut.edu.cn/local/B/CD/55/1347E45BA0243810CF9A9F4D250EAEE3C5577A641.pdf)，PDF 页 58–67（印刷页约 55–64）；尤其第 24–29、31、34–35 条，页 64–67；2017-12-05 发布施行，第 34 条废止 2012 版；本轮未获 2026 现行性确认",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-003",
      "title": "CURRENTITY-UNKNOWN；成都理工大学《研究生课程建设及课程管理办法（暂行）》；核技术与自动化工程学院发布的校本办法 (https://cnae.cdut.edu.cn/info/1040/1425.htm)，第 1、19–26 条；页面 2018-01-09；第 26 条称 2018 年 1 月起实施，废止更旧的研究生课程管理规定及研究生学业成绩考核及管理办法。后续出现新的《研究生课程教学管理办法》引用〔SRC-008〕，旧办法不能视为现行",
      "url": "https://cnae.cdut.edu.cn/info/1040/1425.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-004",
      "title": "CURRENTITY-UNKNOWN；成都理工大学研究生院《成都理工大学研究生课程成绩更正申请表》；研究生院检索结果第 34 页 (https://gra.cdut.edu.cn/search.jsp?currentnum=34&newskeycode2=&searchScope=0&wbtreeid=1001)；相邻官方表格页 (https://gra.cdut.edu.cn/info/1023/2440.htm)的“上一篇”也指向此标题；表单本身的直链/附件尚未读取；检索索引显示 2022-02-20；相邻页时间 2021-09-22，原表真实发布日期须直页核对；生效/废止未知",
      "url": "https://gra.cdut.edu.cn/search.jsp?currentnum=34&newskeycode2=&searchScope=0&wbtreeid=1001",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-005",
      "title": "CURRENTITY-UNKNOWN；成都理工大学教务处《[成绩]成都理工大学本专科学生成绩复核申请表》；教务处表单页面 (https://aao.cdut.edu.cn/info/1183/1489.htm)；另见环境与土木工程学院转列 (https://cece.cdut.edu.cn/info/1093/7134.htm)；教务处结果页约 2018 年，确切发布日期/是否替换待原页；生效/废止未知",
      "url": "https://aao.cdut.edu.cn/info/1183/1489.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-006",
      "title": "GENERAL-RESEARCH；中华人民共和国教育部《普通高等学校学生管理规定》（教育部令第 41 号）；教育部规章原文 (https://www.moe.gov.cn/srcsite/A02/s5911/moe621/201702/t20170216296385.html)，第 13、18 条，及部令 PDF (https://www.moe.gov.cn/jybxxgk/xxgk/zhengce/guizhang/202112/P020211208551013106022.pdf)；2017-02-04 发布；2017-09-01 起施行，废止教育部令第 21 号；本轮未发现被整体替代版本",
      "url": "https://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201702/t20170216_296385.html",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-007",
      "title": "CURRENTITY-UNKNOWN；成都理工大学教务处《科室设置》；教务处科室设置 (https://aao.cdut.edu.cn/jgsz/kssz.htm)，检索摘要“负责各类考试组织与安排、学生成绩管理”等；需原网页具体科室全文；页面现行更新时间未确认；生效/废止不适用",
      "url": "https://aao.cdut.edu.cn/jgsz/kssz.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-008",
      "title": "CDUT-VERIFIED；成都理工大学研究生院《成都理工大学 2025 年招收硕博连读研究生的通知》；研究生院官方通知 PDF (https://gra.cdut.edu.cn/local/D/88/ED/D3929F36A0ABB7D5E8DAF2365D0D319D5B93C0CA.pdf)，第 2 页申请条件处提及《成都理工大学研究生课程教学管理办法》；2025 年招生年度；通知本身为当期文件，不能赋予其援引制度长期现行性",
      "url": "https://gra.cdut.edu.cn/__local/D/88/ED/D3929F36A0ABB7D5E8DAF2365D0_D319D5B9_3C0CA.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-009",
      "title": "CDUT-VERIFIED；成都理工大学教务处《教通字〔2024〕73号》期末考试安排及要求通知（公开 PDF 未显示完整标题）；教务处通知 PDF (https://aao.cdut.edu.cn/local/5/E1/70/0CFBF107E3B3BA9D5305E2EA8D324DEBD074BF2C.pdf)，PDF 第 1 页“考试要求”第 1 项、第 2 页“其他要求”第 1 项、第 3 页落款；教务处 2024-12-25 印发，针对 2024–2025 学年第一学期期末考试；该次工作通知为阶段性文件，后续效力不外推",
      "url": "https://aao.cdut.edu.cn/__local/5/E1/70/0CFBF107E3B3BA9D5305E2EA8D3_24DEBD07_4BF2C.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-010",
      "title": "CURRENTITY-UNKNOWN（原文真实性已核）；成都理工大学《全日制普通本科学生学籍管理办法》成理校教〔2019〕18 号；学校公开制度 PDF (https://dbxb.cdut.edu.cn/local/7/B6/E5/006AC04D88A214D1AD8B1F5E54016B4A5B7C543C.pdf)；同见 SRC-001 所列制度合集 PDF 页 36–58 的第 57–58 条；2019-12-31 印发，条文载自 2020-01-01 执行、废止 2017 本科学籍办法；未证 2026 最新在用文本",
      "url": "https://dbxb.cdut.edu.cn/__local/7/B6/E5/006AC04D88A214D1AD8B1F5E540_16B4A5B7_C543C.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-011",
      "title": "GENERAL-RESEARCH；项目内部 R02 主目录、拆并审计及不可变研究合同；本次实读文件库整合包 CDUT-ST-R02-Partial-Integration-20261023-FINAL.zip 内 00R02原始范围与规范/ST-CANDIDATE-MASTER-CATALOG-R02.md（S02、T01、T05、T06 章）、ST-CATALOG-AUDIT-R02.md（S02-03、T01-04/05、T05/T06 行）和 RESEARCH-TO-BUSINESS-MD-PROMPTS-R02.md（B1、第四轮）；项目 R02 范围，整合快照 2026-10-23；不是成都理工大学规章、无行政生效日期",
      "url": "",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-012",
      "title": "GENERAL-RESEARCH；项目仓库 D4 50 套候选业务技术目录及 workspace；固定 SHA 的 catalog.json (https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json)，catalogId、templateCount、domainCounts、publicationAllowed、authoritativeSchoolTemplate、integrationStatus；同 SHA 的 50 个 work",
      "url": "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = T01T08_TEMPLATE
