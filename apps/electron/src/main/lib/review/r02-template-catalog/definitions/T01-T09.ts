import type { TemplateVersion } from "@profer/shared"

export const T01T09_TEMPLATE: TemplateVersion = {
  "templateId": "T01-T09",
  "version": 1,
  "schemaVersion": 2,
  "name": "实验教学、实习与实践教学安排变更审核",
  "description": "本地研究模板 · 非校方正式模板。实验教学、实习与实践教学安排变更审核的材料解析、事实核对和审阅建议用途；政策适用性、授权、期限和最终办理结果须由有权人员人工确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；政策证据状态为 PARTIAL，任何未确认规则均不得自动产生正式通过或拒绝。",
  "objectType": "custom",
  "displayName": {
    "template": "T01-T09 · 实验教学、实习与实践教学安排变更审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · 案卷 ID：UUID/字符串",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：案卷 ID：UUID/字符串；ReviewCase；P0 起；I：后端案卷键。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F001；案卷 ID：UUID/字符串；ReviewCase；P0 起。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F002",
      "label": "F002 · 当前办理情形：A–H 可多选",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：当前办理情形：A–H 可多选；ReviewCase；P1；I：路由候选+人工确认，M004。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F002；当前办理情形：A–H 可多选；ReviewCase；P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F003",
      "label": "F003 · 受影响学段/人员身份类别：枚举",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：受影响学段/人员身份类别：枚举；TeachingTask；P0/P1；T：教学任务/培养记录 M001/M003；U：M004 仅候选。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F003；受影响学段/人员身份类别：枚举；TeachingTask；P0/P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F004",
      "label": "F004 · 经办人真实身份、岗位、授权域：受信对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：经办人真实身份、岗位、授权域：受信对象；ActorAuthority；P1/P4/PX；A：后端权限核验记录；绝非 Renderer 字段。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F004；经办人真实身份、岗位、授权域：受信对象；ActorAuthority；P1/P4/PX。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F005",
      "label": "F005 · 代办授权范围与有效期：对象/日期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：代办授权范围与有效期：对象/日期；ActorAuthority；P1/PX 条件；D/A：真实授权回执，M023。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F005；代办授权范围与有效期：对象/日期；ActorAuthority；P1/PX 条件。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F006",
      "label": "F006 · 学期、校区、承办学院：结构字段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：学期、校区、承办学院：结构字段；TeachingTask；P0；T：M001/M003 中的原任务记录。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F006；学期、校区、承办学院：结构字段；TeachingTask；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F007",
      "label": "F007 · 课程/实践教学任务标识、班次：字符串",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：课程/实践教学任务标识、班次：字符串；TeachingTask；P0；T：M001/M003/M015。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F007；课程/实践教学任务标识、班次：字符串；TeachingTask；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F008",
      "label": "F008 · 教学任务责任人/原组织单位：角色引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：教学任务责任人/原组织单位：角色引用；TeachingTask；P0；T/A：M001/M003/M015 与任务归属。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F008；教学任务责任人/原组织单位：角色引用；TeachingTask；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F009",
      "label": "F009 · 原安排 ID、修订号、生效状态：版本对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：原安排 ID、修订号、生效状态：版本对象；OriginalPlan；P0；T/D：M001/M003/M015，原始记录位置。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F009；原安排 ID、修订号、生效状态：版本对象；OriginalPlan；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F010",
      "label": "F010 · 原时间段、时数/天数：日期区间+数量",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：原时间段、时数/天数：日期区间+数量；OriginalPlan；P0；T：M001/M003。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F010；原时间段、时数/天数：日期区间+数量；OriginalPlan；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F011",
      "label": "F011 · 原教室、实验室、基地、路线：地点结构",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：原教室、实验室、基地、路线：地点结构；OriginalPlan；P0；T：M001/M003。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F011；原教室、实验室、基地、路线：地点结构；OriginalPlan；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F012",
      "label": "F012 · 原实验项目、实习内容、教学方式：集合",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：原实验项目、实习内容、教学方式：集合；OriginalPlan；P0；T：M002/M003。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F012；原实验项目、实习内容、教学方式：集合；OriginalPlan；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F013",
      "label": "F013 · 原指导教师/实习队伍配置：人员引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：原指导教师/实习队伍配置：人员引用；OriginalPlan；P0；T/A：M003/M006/M009。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F013；原指导教师/实习队伍配置：人员引用；OriginalPlan；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F014",
      "label": "F014 · 适用大纲/培养方案标识、版本：版本对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：适用大纲/培养方案标识、版本：版本对象；TeachingTask；P0；T：M002。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F014；适用大纲/培养方案标识、版本：版本对象；TeachingTask；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F015",
      "label": "F015 · 原安排的审定/备案凭据、效力：决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：原安排的审定/备案凭据、效力：决定引用；OriginalPlan；P0；D/T：M003/M015，原决定记录。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F015；原安排的审定/备案凭据、效力：决定引用；OriginalPlan；P0。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F016",
      "label": "F016 · 拟改维度及字段差异集合：结构化 diff",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：拟改维度及字段差异集合：结构化 diff；ProposedDelta；P1；U：M004；I：与 F009–F015 机械比较。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F016；拟改维度及字段差异集合：结构化 diff；ProposedDelta；P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F017",
      "label": "F017 · 拟实施时间与拟学时/天数：区间+数量",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：拟实施时间与拟学时/天数：区间+数量；ProposedDelta；P1；U：M004/M007/M024。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F017；拟实施时间与拟学时/天数：区间+数量；ProposedDelta；P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F018",
      "label": "F018 · 拟教室/基地/路线：地点结构",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：拟教室/基地/路线：地点结构；ProposedDelta；P1；U：M004/M007/M008；X：M010/M012。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F018；拟教室/基地/路线：地点结构；ProposedDelta；P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F019",
      "label": "F019 · 拟实验项目/方法/设备/实习方式：集合",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：拟实验项目/方法/设备/实习方式：集合；ProposedDelta；P1；U：M004/M007/M008。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F019；拟实验项目/方法/设备/实习方式：集合；ProposedDelta；P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F020",
      "label": "F020 · 拟指导者、队伍与责任分工：人员引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：拟指导者、队伍与责任分工：人员引用；ProposedDelta；P1；U：M004/M009；A/T：受信人员归属。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F020；拟指导者、队伍与责任分工：人员引用；ProposedDelta；P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F021",
      "label": "F021 · 变更原因与事实说明：文本/枚举",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：变更原因与事实说明：文本/枚举；ProposedDelta；P1；U：M004/M005。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F021；变更原因与事实说明：文本/枚举；ProposedDelta；P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F022",
      "label": "F022 · 突发事件发生与处置时间：事件序列",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：突发事件发生与处置时间：事件序列；ProposedDelta；E 在 P1/P2；U/D：M020、M005 和真实处置回执。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F022；突发事件发生与处置时间：事件序列；ProposedDelta；E 在 P1/P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F023",
      "label": "F023 · 受影响学生/班组范围：人员集合+数量",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：受影响学生/班组范围：人员集合+数量；AffectedPopulation；P1/P2；T：M006 或权威班组名单；U：M004。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F023；受影响学生/班组范围：人员集合+数量；AffectedPopulation；P1/P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F024",
      "label": "F024 · 教学目标、课时变化、拟补足措施：差异/文本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：教学目标、课时变化、拟补足措施：差异/文本；ProposedDelta；P1/P2；T：M002；U：M004/M024。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F024；教学目标、课时变化、拟补足措施：差异/文本；ProposedDelta；P1/P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F025",
      "label": "F025 · 新场地/基地接纳容量与时段：资源事实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：新场地/基地接纳容量与时段：资源事实；ProposedDelta；条件 P2；X：M008/M010/M012。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F025；新场地/基地接纳容量与时段：资源事实；ProposedDelta；条件 P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F026",
      "label": "F026 · 拟设备、实验条件可用性：设备/时段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：拟设备、实验条件可用性：设备/时段；ProposedDelta；B 条件 P2；X：M008；实验室责任人验真。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F026；拟设备、实验条件可用性：设备/时段；ProposedDelta；B 条件 P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F027",
      "label": "F027 · 风险活动类型/是否涉及专项准入：枚举三值",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：风险活动类型/是否涉及专项准入：枚举三值；ExternalDecisionRef；条件 P2；U：M004；安全责任人/权威记录 M011。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F027；风险活动类型/是否涉及专项准入：枚举三值；ExternalDecisionRef；条件 P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F028",
      "label": "F028 · G04 安全/危险作业决定引用：签发元数据",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：G04 安全/危险作业决定引用：签发元数据；ExternalDecisionRef；条件 P2；X：M011 的真实安全主管决定。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F028；G04 安全/危险作业决定引用：签发元数据；ExternalDecisionRef；条件 P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F029",
      "label": "F029 · G03 场地/资源许可决定引用：签发元数据",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：G03 场地/资源许可决定引用：签发元数据；ExternalDecisionRef；条件 P2；X：M012 的场地/资产主管回执。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F029；G03 场地/资源许可决定引用：签发元数据；ExternalDecisionRef；条件 P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F030",
      "label": "F030 · 校外实习接收单位与确认版本：对象/回执",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：校外实习接收单位与确认版本：对象/回执；ExternalDecisionRef；C/D 条件 P2；X：M010 接收方原始确认。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F030；校外实习接收单位与确认版本：对象/回执；ExternalDecisionRef；C/D 条件 P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F031",
      "label": "F031 · 经费源、预算及费用增减：金额/币种",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：经费源、预算及费用增减：金额/币种；ProposedDelta；F 条件 P1/P2；U：M004/M013，财务源验真。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F031；经费源、预算及费用增减：金额/币种；ProposedDelta；F 条件 P1/P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F032",
      "label": "F032 · 财务事前审批与有效期：决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：财务事前审批与有效期：决定引用；ExternalDecisionRef；F 条件，财务流程形成时；X：M013 财务批准记录。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F032；财务事前审批与有效期：决定引用；ExternalDecisionRef；F 条件，财务流程形成时。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F033",
      "label": "F033 · 课程组、学院协调审核意见：记录/签发者",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：课程组、学院协调审核意见：记录/签发者；SchoolDecisionRef；P2/P4；D：M014 真实学院意见。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F033；课程组、学院协调审核意见：记录/签发者；SchoolDecisionRef；P2/P4。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F034",
      "label": "F034 · 学校教学批准/备案结果：决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：学校教学批准/备案结果：决定引用；SchoolDecisionRef；P4；D：M016 可验真原决定。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F034；学校教学批准/备案结果：决定引用；SchoolDecisionRef；P4。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F035",
      "label": "F035 · 师生/接收方通知及送达情况：事件集合",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：师生/接收方通知及送达情况：事件集合；ReviewCase；P5；T/D：M017 授权发送回执。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F035；师生/接收方通知及送达情况：事件集合；ReviewCase；P5。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F036",
      "label": "F036 · 实际教学执行及结项记录：事件集合",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：实际教学执行及结项记录：事件集合；ReviewCase；P5/P6；T/D：M018 实际记载。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F036；实际教学执行及结项记录：事件集合；ReviewCase；P5/P6。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F037",
      "label": "F037 · 撤回/复核请求及原案状态：结构对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：撤回/复核请求及原案状态：结构对象；ChangeOrReviewRequest；PX；A/D：M021 与原案历史。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F037；撤回/复核请求及原案状态：结构对象；ChangeOrReviewRequest；PX。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F038",
      "label": "F038 · 正式复核处理结论及效力：决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：正式复核处理结论及效力：决定引用；ChangeOrReviewRequest；PX 受理后；D：M022 受理机构真实回执。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F038；正式复核处理结论及效力：决定引用；ChangeOrReviewRequest；PX 受理后。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F039",
      "label": "F039 · 每份证据版本、散列、来源位置：元数据集合",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：每份证据版本、散列、来源位置：元数据集合；EvidenceVersion；全部阶段；I：原件接收日志、M001–M027 的实际来源。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F039；每份证据版本、散列、来源位置：元数据集合；EvidenceVersion；全部阶段。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F040",
      "label": "F040 · 冲突关系、待办责任、失效检查版本：结构集合",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：冲突关系、待办责任、失效检查版本：结构集合；ReviewCase；P2/P3/P4；I：比对 F009、F015、F023、F027–F039 及材料元数据。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F040；冲突关系、待办责任、失效检查版本：结构集合；ReviewCase；P2/P3/P4。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F041",
      "label": "F041 · 实验项目安全论证适用范围及原/拟项目版：{projectKey,location,changeAffectsHazards,assessmentVersion}",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：实验项目安全论证适用范围及原/拟项目版：{projectKey,location,changeAffectsHazards,assessmentVersion}；ExternalDecisionRef；实验项目 B/A/E 的 P2；X：本校实验室负责人/项目责任人确认及 M025，SRC-014 第7、10条。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F041；实验项目安全论证适用范围及原/拟项目版：{projectKey,location,changeAffectsHazards,assessmentVersion}；ExternalDecisionRef；实验项目 B/A/E 的 P2。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F042",
      "label": "F042 · 安全论证材料提交及所属教学科研单位处置：{submitRecord,authority,scope,status}",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：安全论证材料提交及所属教学科研单位处置：{submitRecord,authority,scope,status}；ExternalDecisionRef；实验项目 P2，项目改变时重新审适用范围；X/D：有权单位 M025；[SRC-014] 第10条。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F042；安全论证材料提交及所属教学科研单位处置：{submitRecord,authority,scope,status}；ExternalDecisionRef；实验项目 P2，项目改变时重新审适用范围。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F043",
      "label": "F043 · 实验人员安全培训与现场项目培训覆盖：人员集合+培训场次+有效对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：实验人员安全培训与现场项目培训覆盖：人员集合+培训场次+有效对象；ExternalDecisionRef；实际入室操作前 P2/P5；X：实验室与项目责任人 M026；[SRC-014] 第11、25条。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F043；实验人员安全培训与现场项目培训覆盖：人员集合+培训场次+有效对象；ExternalDecisionRef；实际入室操作前 P2/P5。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F044",
      "label": "F044 · 实验室暂停/隐患整改及恢复状态：状态序列+签发机关+时点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：实验室暂停/隐患整改及恢复状态：状态序列+签发机关+时点；ExternalDecisionRef；E/P2–P5，有暂停/事故时；X/D：技术安全工作领导小组办公室/专家组 M027；[SRC-014] 第29–33条。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F044；实验室暂停/隐患整改及恢复状态：状态序列+签发机关+时点；ExternalDecisionRef；E/P2–P5，有暂停/事故时。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 原实验/课程课表、教学任务与批次",
      "purpose": "原实验/课程课表、教学任务与批次；教务处/学院保管的权威排课记录；P0/P1 当（A/B/E 的课程分支）；经学校验真的教务任务导出/正式课表，不要求教师重复拍照上传；F003,F006–F011,F015；[SRC-001]；课程号+学期+班次+当前排课版；查旧版与生效状态。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "原实验/课程课表、教学任务与批次；教务处/学院保管的权威排课记录",
        "P0/P1 当（A/B/E 的课程分支）",
        "经学校验真的教务任务导出/正式课表，不要求教师重复拍照上传"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 教学大纲、实验项目/实习要求与学时目标",
      "purpose": "教学大纲、实验项目/实习要求与学时目标；教务/开课学院原始版本；P0/P1 当（A/B；C/D 若需论证教学目标则条）；有权学院存档的受信大纲版本或可验真培养记录；F012,F014,F019,F024；[SRC-001][SRC-002][SRC-010]；适用学段、专业、开课学期、批准版；不以最新版替换历史适用版。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "教学大纲、实验项目/实习要求与学时目标；教务/开课学院原始版本",
        "P0/P1 当（A/B；C/D 若需论证教学目标则条）",
        "有权学院存档的受信大纲版本或可验真培养记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 · 原已审定/备案实习计划及原组织安排",
      "purpose": "原已审定/备案实习计划及原组织安排；学院/教务处保管；P0/P1 当（C/D/E 实习分支）；学院/教务处可验真的计划存档和原决定链接；F003,F006–F013,F015；[SRC-002][SRC-012]；任务+学期+原审定/备案者+版本；2018 现行性 P。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "原已审定/备案实习计划及原组织安排；学院/教务处保管",
        "P0/P1 当（C/D/E 实习分支）",
        "学院/教务处可验真的计划存档和原决定链接"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 · 变更申请与“原→拟”差异表、理由和影响",
      "purpose": "变更申请与“原→拟”差异表、理由和影响；教师或授权学院经办提交；P1 当（A–G；H 引用原案即可）；真正校方表单/可信校务流程的等值字段；当前不得命名为校方官方统一变更表；F002,F016–F024,F031；[SRC-001][SRC-002][SRC-011]；经办人、所属任务、时间戳、每次提交新版本，旧申请存证。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "变更申请与“原→拟”差异表、理由和影响；教师或授权学院经办提交",
        "P1 当（A–G；H 引用原案即可）",
        "真正校方表单/可信校务流程的等值字段；当前不得命名为校方官方统一变更表"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 · 客观变更原因证明（气象停用、设备故障、基地通知等）",
      "purpose": "客观变更原因证明（气象停用、设备故障、基地通知等）；事实责任方；P1/P2 条（原因须佐证或冲突时）；可验真设备报修记录、单位通知/事发日志，不能只凭模型猜想；F021,F022；[SRC-001][SRC-002][SRC-004]；事发时间与关联课程/基地一致；第三方来源可信程度分别标注。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "客观变更原因证明（气象停用、设备故障、基地通知等）；事实责任方",
        "P1/P2 条（原因须佐证或冲突时）",
        "可验真设备报修记录、单位通知/事发日志，不能只凭模型猜想"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 · 受影响教学班/实习队人员与分组",
      "purpose": "受影响教学班/实习队人员与分组；学院/教务权威名册；P1/P2 条（D、跨班次等）；A 若可信课表已有范围则引用；权威教学班/选课/实习队记录，不重复索取身份证照片；F013,F023；[SRC-001][SRC-002]；只核任务+学期+成员稳定标识+取样版，限制个人数据。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "受影响教学班/实习队人员与分组；学院/教务权威名册",
        "P1/P2 条（D、跨班次等）；A 若可信课表已有范围则引用",
        "权威教学班/选课/实习队记录，不重复索取身份证照片"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M007",
      "name": "M007 · 拟实习时间/路线/接收单位/活动计划",
      "purpose": "拟实习时间/路线/接收单位/活动计划；实习指导教师/领队；P1 当（C/D；F 继承所属分支）；经学院认可的修订计划或校务系统修订结构，签批为后续；F017–F020,F023,F025；[SRC-002]；原计划 M003 与拟版分别保留，标受影响学生与日期。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "拟实习时间/路线/接收单位/活动计划；实习指导教师/领队",
        "P1 当（C/D；F 继承所属分支）",
        "经学院认可的修订计划或校务系统修订结构，签批为后续"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 · 拟实验项目/设备/场地资源与时段说明",
      "purpose": "拟实验项目/设备/场地资源与时段说明；实验课程组/实验室责任人；P1 当（B）；A 涉实验室调配时条；校内可验真实验排程/设备资源系统记录（如果存在）；F018,F019,F025,F026；[SRC-001][SRC-004][SRC-010]；对应课程、时段、资源编号、责任实验室；“有设备”≠准入。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "拟实验项目/设备/场地资源与时段说明；实验课程组/实验室责任人",
        "P1 当（B）；A 涉实验室调配时条",
        "校内可验真实验排程/设备资源系统记录（如果存在）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 · 指导教师、校外指导人、队伍分工与教学责任",
      "purpose": "指导教师、校外指导人、队伍分工与教学责任；学院/课程组；P1 当（D）；B/C/G 涉指导更换时条；可信教学任务/人员安排及 T01-T02/T06 已有有效决定；F013,F020；[SRC-001][SRC-002][SRC-009]；逐人真实身份、覆盖时段、任教/指导授权版本。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "指导教师、校外指导人、队伍分工与教学责任；学院/课程组",
        "P1 当（D）；B/C/G 涉指导更换时条",
        "可信教学任务/人员安排及 T01-T02/T06 已有有效决定"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 新接收基地/实习单位接受与容量确认",
      "purpose": "新接收基地/实习单位接受与容量确认；校外接收单位原件；P2 条（C 改单位、D 改接收方式）；可信签署或可回拨/函证的接收回执、既有有效基地承接协议（范围匹配时）；F018,F025,F030；[SRC-002][SRC-012]；单位实体、场所、人数、时间与拟版一致；不等于教学批准。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "新接收基地/实习单位接受与容量确认；校外接收单位原件",
        "P2 条（C 改单位、D 改接收方式）",
        "可信签署或可回拨/函证的接收回执、既有有效基地承接协议（范围匹配时）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 危险作业/野外/设备安全准入或止险处理",
      "purpose": "危险作业/野外/设备安全准入或止险处理；G04/有权安全单位；P2 条（确实风险触发，P1 不索未来批准）；具有同一活动、场地、时段与有效期的真实安全授权记录；F022,F027,F028；[SRC-004]；具体 G04 校本依据待取；必须验证发证权限、风险活动、有效期与状态，旧许可不可挪用。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "危险作业/野外/设备安全准入或止险处理；G04/有权安全单位",
        "P2 条（确实风险触发，P1 不索未来批准）",
        "具有同一活动、场地、时段与有效期的真实安全授权记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 场地、实验室资源/行政使用许可",
      "purpose": "场地、实验室资源/行政使用许可；G03 或有权场地主管；P2 条（发生独立场地行政授权事项）；适用该任务的新场地使用系统回执或原有效授权；F018,F025,F029；[SRC-004][SRC-013]；G03 精确政策待取；场地编号、使用对象、时段、发证权限匹配；建设批复不可代单次使用。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "场地、实验室资源/行政使用许可；G03 或有权场地主管",
        "P2 条（发生独立场地行政授权事项）",
        "适用该任务的新场地使用系统回执或原有效授权"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 · 实习经费变化及事前审批",
      "purpose": "实习经费变化及事前审批；教师/经费责任人申报、财务处决定；P1 仅申报金额事实可在 M004；支出前的 P2/财务阶段 条；可验真《实习经费事前审批表》或学校财务流程正式回执；F031,F032；[SRC-007]；费用批次/预算、经费归属、人员、用途、金额、决定版本分别核。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "实习经费变化及事前审批；教师/经费责任人申报、财务处决定",
        "P1 仅申报金额事实可在 M004；支出前的 P2/财务阶段 条",
        "可验真《实习经费事前审批表》或学校财务流程正式回执"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 课程组协调与学院教学审核意见",
      "purpose": "课程组协调与学院教学审核意见；真实课程组/学院有权签署；P2/P4 后（原课程教学可用已存在意见作引用）；可验真学校工作流意见/有权签章原件；F033；[SRC-001][SRC-005]；责任人所属学院/任期/事项范围+绑定拟方案版。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "课程组协调与学院教学审核意见；真实课程组/学院有权签署",
        "P2/P4 后（原课程教学可用已存在意见作引用）",
        "可验真学校工作流意见/有权签章原件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 原教学任务安排/计划生效的正式审批或备案索引",
      "purpose": "原教学任务安排/计划生效的正式审批或备案索引；教务/学院；P0 条（M001/M003 已含则不另取）；原计划文书上的可验真签发记录/教学源系统生效版本；F007–F009,F015；[SRC-001][SRC-002]；原始生效版本，只确认原安排，非批准拟变更。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "原教学任务安排/计划生效的正式审批或备案索引；教务/学院",
        "P0 条（M001/M003 已含则不另取）",
        "原计划文书上的可验真签发记录/教学源系统生效版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 本次教学安排调整的正式批准/备案结果",
      "purpose": "本次教学安排调整的正式批准/备案结果；学院/学校有权机构；P4 决定作出后，P1 严禁必填；有权后端登记且可验真的学校原始决定/备案回执；F034；[SRC-001][SRC-002][SRC-011]；绑定 M004 当前版本、事项范围、时间、签发人及有效状态；批准/备案不能混同。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "本次教学安排调整的正式批准/备案结果；学院/学校有权机构",
        "P4 决定作出后，P1 严禁必填",
        "有权后端登记且可验真的学校原始决定/备案回执"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 · 师生、基地通知及收讫/变更发布凭证",
      "purpose": "师生、基地通知及收讫/变更发布凭证；学院/课程教师；P5 执行发布后；可验真的排课平台通知回执、实际发送日志；F035；[SRC-001][SRC-002]；关联真实决定 M016、学生群体版本与通知对象。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "师生、基地通知及收讫/变更发布凭证；学院/课程教师",
        "P5 执行发布后",
        "可验真的排课平台通知回执、实际发送日志"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "M018 · 实践执行、实验教学记录、实习日志/总结与学生成绩归档",
      "purpose": "实践执行、实验教学记录、实习日志/总结与学生成绩归档；任课教师/学院；P5/P6 后；按学校权威记录真实形成的实验/实习执行数据；F036；[SRC-002][SRC-004]；与获准拟版核对，按活动期次和学生作归属。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "实践执行、实验教学记录、实习日志/总结与学生成绩归档；任课教师/学院",
        "P5/P6 后",
        "按学校权威记录真实形成的实验/实习执行数据"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "M019 · 实习费用报销/结算/票据",
      "purpose": "实习费用报销/结算/票据；财务及经费经办；P6 后（另属财务目的）；学校财务系统有效结算/报销结果；F031,F032,F036；[SRC-007]；批次/费用/行程/合同与事前审批对应。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "实习费用报销/结算/票据；财务及经费经办",
        "P6 后（另属财务目的）",
        "学校财务系统有效结算/报销结果"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "M020 · 紧急停用/撤离/设备故障事件原始记录",
      "purpose": "紧急停用/撤离/设备故障事件原始记录；现场人员和有关责任部门；E 的 P1 当（允许先口头止险再补原始书面证据的真实时间）；经核实的现场事故记录、官方预警、设备停用记录；F021,F022,F027；[SRC-001][SRC-004]；记录真实发生与补报时间，两者不可混填；保密按 L3。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "紧急停用/撤离/设备故障事件原始记录；现场人员和有关责任部门",
        "E 的 P1 当（允许先口头止险再补原始书面证据的真实时间）",
        "经核实的现场事故记录、官方预警、设备停用记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "M021 · 补件/撤回/重提/异议申请及权限核查",
      "purpose": "补件/撤回/重提/异议申请及权限核查；原案当事人/经办；P3/PX 发起时 当；A–G 正常申请 NA；审核案卷已有具名申请事件及有效学校申诉表（若取得）；F004,F005,F037；[SRC-001][SRC-002] 未规定救济细节；关联旧案 ID、申请/决定版本、时间、真实申请人。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "补件/撤回/重提/异议申请及权限核查；原案当事人/经办",
        "P3/PX 发起时 当；A–G 正常申请 NA",
        "审核案卷已有具名申请事件及有效学校申诉表（若取得）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "M022 · 正式复核/异议处理决定",
      "purpose": "正式复核/异议处理决定；校方真实受理机关；PX 真正处理完成后；可验真学校复核回执；当前不得假设有该线上服务；F038；[SRC-001][SRC-002]（仅事项背景，复核依据仍缺）；受理机关权限、原决定 ID、复核范围与结果版本。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "正式复核/异议处理决定；校方真实受理机关",
        "PX 真正处理完成后",
        "可验真学校复核回执；当前不得假设有该线上服务"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "M023 · 委托代办或学院经办授权",
      "purpose": "委托代办或学院经办授权；授权委托人、学校身份/人事部门；P1/PX 条（只在不是本人/职责范围内直接办理时）；后台权限服务可验证的校内正式委托记录；F004,F005；[SRC-005]（只证明部门存在，授权标准未获校本证实）；授权者与受托者真实身份、任务范围、生效和撤销状态。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "委托代办或学院经办授权；授权委托人、学校身份/人事部门",
        "P1/PX 条（只在不是本人/职责范围内直接办理时）",
        "后台权限服务可验证的校内正式委托记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "M024 · 教学时数/目标影响与补足方案",
      "purpose": "教学时数/目标影响与补足方案；任课教师/课程组；P1 条（课时、教学内容或目标受影响时）；M004 已含完整且可追踪的影响分析可直接复用；F017,F019,F024；[SRC-001][SRC-002]；与原大纲及拟时间逐项对应；是否认可由有权教学人员决定。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "教学时数/目标影响与补足方案；任课教师/课程组",
        "P1 条（课时、教学内容或目标受影响时）",
        "M004 已含完整且可追踪的影响分析可直接复用"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "M025 · 实验项目安全论证提交与处置记录",
      "purpose": "实验项目安全论证提交与处置记录；实验项目负责人（含教学任课教师）提交，所在教学科研单位持有；实验项目适用的 P2 条；新项目/设备/场所变更影响危险源时必须核新的覆盖关系，P1 不是已批准件必填；原项目已审论证如明确覆盖拟项目、地点、时间和危险源可供核真复用；是否要补审由安全 Owner 判；F027,F028,F041,F042；[SRC-014][SRC-016]；逐项目+场所+设备+危险源+版本+签署/提交对象核；安全技术意见≠教学调整批准。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "实验项目安全论证提交与处置记录；实验项目负责人（含教学任课教师）提交，所在教学科研单位持有",
        "实验项目适用的 P2 条；新项目/设备/场所变更影响危险源时必须核新的覆盖关系，P1 不是已批准件必填",
        "原项目已审论证如明确覆盖拟项目、地点、时间和危险源可供核真复用；是否要补审由安全 Owner 判"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "M026 · 人员安全教育和当次实验现场培训的受信记录",
      "purpose": "人员安全教育和当次实验现场培训的受信记录；实验室和项目负责人持有；P2/实际进入实验室前条，P5 可核执行，P1 不提前索取；本校可验真的安全准入/考核/现场培训日志，不索取整班身份证影印件；F023,F043；[SRC-014] 第11、24–25条；稳定人员键最小集合+实验项目/地点+培训时间版本；保留隐私分级。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "人员安全教育和当次实验现场培训的受信记录；实验室和项目负责人持有",
        "P2/实际进入实验室前条，P5 可核执行，P1 不提前索取",
        "本校可验真的安全准入/考核/现场培训日志，不索取整班身份证影印件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "M027 · 实验室隐患暂停、事故处置、整改和解除暂停的权威记录",
      "purpose": "实验室隐患暂停、事故处置、整改和解除暂停的权威记录；学校安全管理有权机构持有；E 的 P2/P5 条，仅在真实暂停/隐患/事故触发后；有权限且对象匹配的暂停、复查、恢复状态来源索引；不能用教学补课决定替代；F022,F027,F044；[SRC-014] 第29–33条；实验室实体、风险事项、暂停/解除时段、决定机关和后续追踪版本分开。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "实验室隐患暂停、事故处置、整改和解除暂停的权威记录；学校安全管理有权机构持有",
        "E 的 P2/P5 条，仅在真实暂停/隐患/事故触发后",
        "有权限且对象匹配的暂停、复查、恢复状态来源索引；不能用教学补课决定替代"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "evidence-checks",
      "name": "原稿审核规则逐项核验",
      "description": "依据 T01-T09 原稿规则表逐条生成稳定 criterion ID；SRC 是研究来源索引，不是案卷材料 SourceRef。所有未确认政策均需人工确认。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "R001 · P0：真实的已排定教学任务",
          "requirement": "R001 P0：真实的已排定教学任务；T=F007/F009 指向既有任务；F=明确为新开/停开/课程建设；U=任务号不明；[SRC-001][SRC-002]；F003,F007,F009；M001,M003,M015；T/D 原始任务+学期+生效版一致；不以文件名或自述充当计划；T 可核→PASSFACT；F→NOTAPPLICABLE 并转 T01-T03/T05；U 如权威源失联→SOURCEUNAVAILABLE，转学院教务核实",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "R002 · P0：本校、学段和学院适用性",
          "requirement": "R002 P0：本校、学段和学院适用性；T=成都理工大学当前对应本科任务；F=非本校/纯研究生个人培养事务；U=学段/校区不明；[SRC-001][SRC-002][SRC-009]；F003,F006,F014；M001,M002,M003；校方 T 主数据与计划版本；研究生一律另核规则，不套本科章条；T→PASSFACT；F→NOTAPPLICABLE 并路由 S08/适用机构；U→POLICYUNCONFIRMED 或源不可达 SOURCEUNAVAILABLE，学院/研究生院核权",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R003",
          "title": "R003 · P1/P4/PX：经办和签发人的可信身份/事项授权",
          "requirement": "R003 P1/P4/PX：经办和签发人的可信身份/事项授权；T=有人发起/签发；F=本阶段无人工签发行为；U=授权域未能查到；[SRC-001][SRC-002][SRC-005]；F004,F008,F033,F034；M004,M014,M016；A 身份+任职时间+学院+教学任务+操作类型；Renderer/OCR 姓名无权威性；身份权限匹配仅→PASSFACT；明确冒名→CONFLICT；无权代签→NEEDSHUMANDECISION；F 阶段无签发对象→NOTAPPLICABLE；权限策略不明→POLICYUNCONFIRMED，学校权限管理员办理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "R004 · P1/PX：代办委托真实性",
          "requirement": "R004 P1/PX：代办委托真实性；T=由受托人代办；F=本人以可验真实职权办理；U=申报身份不明；[SRC-005]（不证明可委托规则）；F004,F005；M023,M021；A/D 委托人/受托人真实身份、授权事项、起止期及撤销状态；校本能否代理另核；T 且可信委托→PASSFACT（仅委托事实）；无委托证据→NEEDSMATERIAL/POLICYUNCONFIRMED；F→NOTAPPLICABLE；U→NEEDSHUMANDECISION，学院授权管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "R005 · P0/P2：原安排版本与批准/备案效力",
          "requirement": "R005 P0/P2：原安排版本与批准/备案效力；T=已有原版本；F=原计划确无审批基准；U=多版本声称有效或源不可达；[SRC-001][SRC-002]（当期适用性单核）；F009,F010,F011,F015,F039；M001,M003,M015；T/D 追溯原始生效记录、签发人及当期方案；“后上传”不等于“后生效”；已废止的 [SRC-003] 仅可核历史案；有效基准→PASSFACT；明确不符→CONFLICT/转原计划管理员；不可取→SOURCEUNAVAILABLE；审批链本身未证→POLICYUNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "R006 · P0/P2：大纲与教学目标基准",
          "requirement": "R006 P0/P2：大纲与教学目标基准；T=涉及课程实验或实习目标；F=所办事项不含目标对照；U=适用大纲版本不明；[SRC-001][SRC-002][SRC-010]；F012,F014,F019,F024；M002,M003；T 原大纲学期/专业/版本与 M004 拟内容逐项目对照，不推定等效；版本目标可对照→PASSFACT（基准可核）；缺大纲→NEEDSMATERIAL/SOURCEUNAVAILABLE；变动是否允许→NEEDSHUMANDECISION，课程组/学院",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "R007 · P1：原拟变更差异确定性",
          "requirement": "R007 P1：原拟变更差异确定性；T=有具体拟改项；F=原拟完全相同、无变更；U=只写“调整一下”；[SRC-001][SRC-002]；F016–F021,F039；M004,M007,M008；U 逐字段作 original→proposal diff，绑定同一任务/时段/场地，保留原文定位；可重现差异→PASSFACT；完全无差异→NOTAPPLICABLE；当前描述缺→NEEDSMATERIAL，申请教师/经办人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "R008 · P1/P2：时间、学时/天数与教学补足事实",
          "requirement": "R008 P1/P2：时间、学时/天数与教学补足事实；T=时间或教学时数受影响；F=确实无相关变化；U=前后数据不清；[SRC-001][SRC-002][SRC-011]；F010,F017,F024；M001,M003,M004,M024；T 原时段和 U 拟时段/补足方案对照，时区/课程号一致；不设置学时容差/申请提前天数；差异事实可核→PASSFACT；时数矛盾→CONFLICT；补足方案缺→NEEDSMATERIAL；是否允许→NEEDSHUMANDECISION；F→NOTAPPLICABLE，学院教学组织",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "R009 · P1/P2：受影响教学班/实习队归属",
          "requirement": "R009 P1/P2：受影响教学班/实习队归属；T=变更影响具体学生队伍；F=经核确无学生范围变化但沿用原班；U=名单/身份不明；[SRC-001][SRC-002]；F013,F023,F035；M001,M003,M006；T 学籍/选课/实习队快照与拟分组按稳定键比较；L2 最小暴露；名单对应→PASSFACT；冲突→CONFLICT；可信名册源失联→SOURCEUNAVAILABLE；不变也须基准核实，非整条 NOTAPPLICABLE；学院教务",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "R010 · P2：实验室、设备与时段资源可用事实",
          "requirement": "R010 P2：实验室、设备与时段资源可用事实；T=实验项目/设备/地点/批次变动；F=仅不影响实验资源的安排；U=资源影响未知；[SRC-001][SRC-004][SRC-010]；F018,F025,F026；M001,M008；X/T 实验室设备实体、可用时段和拟日期对应，资源可用≠风险准入；资源事实一致→PASSFACT；场地冲突→CONFLICT；需验真→NEEDSHUMANDECISION；F→NOTAPPLICABLE；实验中心/场地负责人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "R011 · P2：实验替代项目的教学目标是否仍可实现",
          "requirement": "R011 P2：实验替代项目的教学目标是否仍可实现；T=项目/方法/教学目标被更换；F=未变更内容；U=变化性质未明；[SRC-001][SRC-010]；F012,F019,F024；M002,M008,M024；T 大纲与 U 具体替代过程逐要素比较，最终等效性属有权教学人员裁量；T05 改大纲另路由；比较事实完整仍→NEEDSHUMANDECISION（课程组/专业负责人）；F→NOTAPPLICABLE；依据缺→POLICYUNCONFIRMED；不可读→UNREADABLE",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "R012 · P1/P2：实习原计划与新行程的实质差异",
          "requirement": "R012 P1/P2：实习原计划与新行程的实质差异；T=实习地点/日期/路线/组织方式改变；F=无实习变动；U=计划来源未知；[SRC-002][SRC-012]；F010–F013,F017–F020,F023；M003,M007；T 原计划审定版与 U 新计划逐日/单位/队伍对比；2018 现行性另列；原拟事实可比→PASSFACT；冲突→CONFLICT；无原版→SOURCEUNAVAILABLE；是否准许重审→POLICYUNCONFIRMED，学院实践教学",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "R013 · P2：实习单位接纳事实与适用时间",
          "requirement": "R013 P2：实习单位接纳事实与适用时间；T=新基地/接收方式发生改变；F=基地及接收方式均未改变；U=是否需新接收证明不明；[SRC-002][SRC-012]；F018,F025,F030；M007,M010；X 接收单位真实主体、时间、人数/容量、接收范围和版本；不视为学校批准；可函证且匹配→PASSFACT；已拒收或对象不符→CONFLICT；暂未取得→NEEDSMATERIAL/人工函证；F→NOTAPPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "R014 · P1/P2：指导/领队身份及教学责任连续性",
          "requirement": "R014 P1/P2：指导/领队身份及教学责任连续性；T=指导人或队伍责任改变；F=人员责任未变；U=人员所属不明；[SRC-001][SRC-002][SRC-009]；F008,F013,F020；M003,M009；A/T 稳定教工键、在任时段与职责，复用 T01-T02/T06 本职有效人事/代课决定；不援引已废止 [SRC-003]；交接责任事实匹配→PASSFACT；人错位→CONFLICT；任教资格未决→NEEDSHUMANDECISION；F→NOTAPPLICABLE，学院/人事业务 Owner",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "R015 · P2：安全项目审核/危险专项分类",
          "requirement": "R015 P2：安全项目审核/危险专项分类；T=在实验室开展项目（普遍触发校本项目安全论证）或校外野外风险须专项核；F=可信安全主管确认非实验室项目且无其它专项许可触发；U=性质/风险未明；[SRC-014] 第7–11条、[SRC-016][SRC-017]；F019,F022,F027,F041；M004,M008,M020,M025；对照项目/地点/设备危险源及学校 A–D 分类；不能用“D级低风险”豁免 SRC-014 第10条项目提交要求；T→R016/R031，需安全 Owner 事实核定；F→NOTAPPLICABLE；U→POLICYUNCONFIRMED/NEEDSHUMANDECISION，不得模型低风险判免",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "R016 · P2：G04/安全机关决定有效性",
          "requirement": "R016 P2：G04/安全机关决定有效性；T=R015 触发且专项安全审核/准入适用；F=可信安全主管确认不存在该类别单独许可（不豁免项目论证 R031）；U=是否须另签许可未知；[SRC-014] 第9–11、15条及 [SRC-016]；F027,F028,F039,F042；M011,M025；X 原签发机构、项目/危险源、场地、人员、时间、方案版、有效状态；辐射专项许可证另按本职机关验；匹配只能→PASSFACT（安全结论引用有效）；不符→CONFLICT；尚未形成→NEEDSHUMANDECISION；F→NOTAPPLICABLE，G04/安全主管",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "R017 · P2：G03/场地授权对象匹配",
          "requirement": "R017 P2：G03/场地授权对象匹配；T=涉及独立场地使用/行政资源批准；F=普通校内排课且无独立行政许可；U=场地权限范围不明；[SRC-004][SRC-013]（G50 非校规）；F018,F025,F029；M008,M012；X 有权场地单位原回执，对象+时段+用途+实际可用性；建设批准≠教学使用；当前许可匹配→PASSFACT；不匹配→CONFLICT；待签发→NEEDSHUMANDECISION；F→NOTAPPLICABLE；G03/资产场地管理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "R018 · P1/P2：实习费用变化和财务事前审批",
          "requirement": "R018 P1/P2：实习费用变化和财务事前审批；T=教学变化引起费用支出/预算变更；F=无财务变动；U=经费来源不清；[SRC-007]；F031,F032；M004,M013；U 费用差异与 X 财务事前审批的用途/金额/人员/批次/日期匹配；财务批准≠教学批准；费用事实可核→PASSFACT，需支出未获审批→NEEDSHUMANDECISION；旧版不符→CONFLICT；F→NOTAPPLICABLE，财务经办/财务处",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "R019 · P1/P2：突发事件和报告先后",
          "requirement": "R019 P1/P2：突发事件和报告先后；T=紧急中断/止险；F=正常事前申请；U=事发时间/危险情形不明；[SRC-001][SRC-002][SRC-014] 第29–33条；F021,F022,F027,F044；M005,M020,M027；原事件与安全处置/学校报告时点区分，事故须依安全主管流程即时处理报告；不制造教学变更追认期限；事件事实可核→PASSFACT（仅事实）；是否追认→POLICYUNCONFIRMED/人工办理；时序矛盾→CONFLICT；F→NOTAPPLICABLE，安全主管及学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "R020 · P0–PX：提交材料可读性及证据定位",
          "requirement": "R020 P0–PX：提交材料可读性及证据定位；T=有供核验的 PDF/扫描件/照片；F=只用可验真结构化记录，无上传文件；U=提取内容部分/全部失败；[SRC-001][SRC-002]（业务背景，非 OCR 规范）；F016,F039；M004,M005,M008,M020；I 原文件散列+页/区域+解析置信度，不能靠低置信 OCR 判签章；其他 M 同样逐文件适用；清楚且可定位→PASSFACT（读取事实）；不可读→UNREADABLE、退申请人重传/人工阅件；F→NOTAPPLICABLE；若原源未接通→SOURCEUNAVAILABLE",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "R021 · P1/P2：跨文件人员/课程/时空事实一致性",
          "requirement": "R021 P1/P2：跨文件人员/课程/时空事实一致性；T=至少两份材料描述同一事实；F=同一事实只有单一权威源且无冲突候选；U=匹配键缺失；[SRC-001][SRC-002]；F007,F008,F017,F020,F023,F040；M001,M003,M004,M006,M007,M009；T/D 优先核任务稳定键、人员稳定键、期间及方案版；矛盾保留双方证据，不自动择一；一致→PASSFACT；实质冲突→CONFLICT、学院教务复核；F→NOTAPPLICABLE（仅交叉比对）；U→NEEDSMATERIAL/SOURCEUNAVAILABLE",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "R022 · P2/P3：改版后跨域结论是否仍绑定现案",
          "requirement": "R022 P2/P3：改版后跨域结论是否仍绑定现案；T=材料或原/拟方案版本变动；F=本次无相关版本变化；U=无法判定前后散列/生效版；[SRC-001][SRC-002][SRC-007]（仅各域业务背景）；F009,F016,F028–F034,F039,F040；M004,M007,M011,M012,M013,M016；I 版本依赖 DAG：原计划/拟方案/风险活动/费用批次→决定所签对象；逐 R 失效，不覆盖旧回执；绑定仍有效→PASSFACT；失配→CONFLICT+定向重审；F→NOTAPPLICABLE；U→NEEDSHUMANDECISION，相应原签发单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "R023 · P2/P4：课程组/学院意见来源和签发域",
          "requirement": "R023 P2/P4：课程组/学院意见来源和签发域；T=按适用流程到了课程组协调或学院审核阶段；F=P1 尚未发生，不运行；U=学院意见权限无从证实；[SRC-001][SRC-005][SRC-011][SRC-018]（职责≠授权）；F004,F033；M014；D 校内可验真经办/审核人、学院、时间、拟方案版本；本科一般调课由 SRC-001 第24条约束，实践专项链仍未核；真实意见的存在可核→PASSFACT；无权签署→CONFLICT/NEEDSHUMANDECISION；现行专项链不明→POLICYUNCONFIRMED，开课学院/教务处",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "R024 · P4：本次教学变更的正式决定真实性",
          "requirement": "R024 P4：本次教学变更的正式决定真实性；T=有正式决定/备案回执待验；F=P4 已到而决定未形成；U=仅截图/OCR“同意”或校方验源不可达；[SRC-001][SRC-002][SRC-011]；F004,F015,F034,F039；M014,M016；D 原权威决定+主体真实授权+事项+有效日期+拟方案指纹+撤销状态；绝不由系统生成校方签批；不援引已废止 SRC-003；有效签发存在→PASSFACT（仅“决定回执真实性”）；F→NEEDSHUMANDECISION；无现行审批规则→POLICYUNCONFIRMED；伪签→CONFLICT，学校教务/有权机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "R025 · P5：获准版本的通知到达事实",
          "requirement": "R025 P5：获准版本的通知到达事实；T=P4 已有真实有效决定且发布；F=尚未授权执行，不运行；U=通知范围/收讫不清；[SRC-001][SRC-002]；F023,F034,F035；M016,M017；T/D 决定对象与通知学生/基地名单、发布时点、版本一致；不能把通知当作批准；可核送达→PASSFACT；名单错位→CONFLICT；回执不明→NEEDSMATERIAL/人工确认；学院经办",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R026",
          "title": "R026 · P5/P6：执行事实与获准版本一致",
          "requirement": "R026 P5/P6：执行事实与获准版本一致；T=已获合法决定且开始/结束实施；F=尚未执行，不运行；U=实际时数/基地/队伍不明；[SRC-001][SRC-002][SRC-004]；F017–F020,F034,F036；M016,M018；T/D 执行记录按日期/单位/学时与正式方案比对；成绩是后续 S02 权威结果，不在本案改分；一致事实→PASSFACT；差异→CONFLICT/人工处置；记录缺→NEEDSMATERIAL（仅 P5/P6），学院教学管理",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R027",
          "title": "R027 · P6：实习财务结项与事前批次匹配",
          "requirement": "R027 P6：实习财务结项与事前批次匹配；T=已发生需报销的实习费用；F=无本案报销对象；U=结算或批次未产生；[SRC-007]；F031,F032,F036；M013,M019；X 财务报销时点、金额用途、事前审批与对应实习计划版；不同业务 Owner 决策；支出事实可对→PASSFACT；不一致→CONFLICT；未到 P6 不运行；F→NOTAPPLICABLE；财务处",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "R028 · P3/PX：补件、撤回、重提请求的身份与版本",
          "requirement": "R028 P3/PX：补件、撤回、重提请求的身份与版本；T=提出撤回/重提/补件；F=无该动作；U=申请人或原状态无法验证；[SRC-001][SRC-002]（无正式救济条款）；F001,F004,F005,F037,F039；M021,M023；A/I 请求人真实身份、原案/申请版、时间与被处理状态；受理范围/期限待校本确认；申请事实可核→PASSFACT，但是否准许撤回→POLICYUNCONFIRMED/人工处理；冒名→CONFLICT；F→NOTAPPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "R029 · PX：正式复核决定的权限与适用对象",
          "requirement": "R029 PX：正式复核决定的权限与适用对象；T=有可验真的复核结果；F=尚未作出，不运行；U=申请只附自述或截图；[SRC-001][SRC-002]（仅背景，缺复核现行规章）；F004,F037,F038,F039；M021,M022；D 原决定与复核决定 ID、受理单位真实权、时效及版本对应；不得 AI 更改历史决定；真正复核结果存在→PASSFACT（回执事实）；程序依据未核→POLICYUNCONFIRMED；无权机关→CONFLICT，学校正式受理机构",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "R030 · P0/P2：唯一授权对象与相邻业务去重",
          "requirement": "R030 P0/P2：唯一授权对象与相邻业务去重；T=同时触发 T01-T01/T02/T03、T05/T06、S02、G03/G04/财务；F=仅单项实践安排事实；U=主责未能判定；[SRC-001][SRC-004][SRC-007][SRC-009][SRC-013]；F002,F016,F019,F020,F027–F032；M002,M009,M011,M012,M013；根据“决定对象+签发权归属”映射引用其它 Owner 结论，不以 G50 候选作政策事实；引用须带版本与范围；能确定引用/路由→PASSFACT（边界事实）；无跨域→NOTAPPLICABLE；职责不明→POLICYUNCONFIRMED，模板维护人和校务主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "R031 · P2：实验项目安全论证是否提交至本职单位",
          "requirement": "R031 P2：实验项目安全论证是否提交至本职单位；T=拟在实验室开展项目，尤其更换设备/地点/风险源；F=可信证据确认事项不涉及实验室项目；U=原项目是否覆盖拟方案不明；[SRC-014] 第7、10条；F019,F026,F027,F041,F042；M008,M025；逐项目、场地、设备、危险源、拟方案版核提交单位和真实处置状态；不评定论证质量，旧项目论证须核覆盖；提交与覆盖事实可信→PASSFACT；旧版错位→CONFLICT；待审→NEEDSHUMANDECISION；F→NOTAPPLICABLE；G04/教学科研单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "R032 · P2/P5：拟进入实验室人员培训与当次现场培训",
          "requirement": "R032 P2/P5：拟进入实验室人员培训与当次现场培训；T=进入实验室开展实验操作之前；F=仅对不进入实验室人员；U=具体参与人员/项目未确定；[SRC-014] 第11、24–25条；F023,F043；M006,M026；对应人员稳定键、项目/场地、培训时间及真实记录；当前 P1 申请阶段不运行；前置培训事实匹配→PASSFACT；参与范围错位→CONFLICT；实际入室前未验证→NEEDSHUMANDECISION；未到阶段 DEFERRED；G04/实验室负责人",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R033",
          "title": "R033 · P2/P5：隐患暂停后恢复资格的权威状态",
          "requirement": "R033 P2/P5：隐患暂停后恢复资格的权威状态；T=实验室因隐患或事故暂停/中止；F=有权源确认没有暂停状态；U=暂停/恢复状态不可取得；[SRC-014] 第29–33条；F022,F027,F044；M020,M027；X/D 核真实暂停机关、实验室、危险源、暂停与恢复时间；教学补排批准不能解除安全暂停；状态及恢复权属匹配→PASSFACT（仅回执事实）；仍暂停→NEEDSHUMANDECISION 且禁止视为可执行；冲突→CONFLICT；未知源→SOURCEUNAVAILABLE；G04 安全主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R034",
          "title": "R034 · P2/P5：新旧安全结论和新教学安排的对象一致性",
          "requirement": "R034 P2/P5：新旧安全结论和新教学安排的对象一致性；T=变更含项目、实验室、设备、人员或风险源；F=可信比对确认安全对象完全不变；U=版本索引缺失；[SRC-014][SRC-017]；F016,F027,F028,F039,F041–F044；M004,M011,M025,M026,M027；I 变更差异决定依赖图→X 的有效版本、对象、准入/培训、暂停状态；只检查关联，不重做安全批准；匹配→PASSFACT；旧许可挪用→CONFLICT；权威无源→SOURCEUNAVAILABLE；需本职重审→NEEDSHUMANDECISION；F→NOTAPPLICABLE；G04/实验室与学院",
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
      "name": "原教学/实践任务与拟变更差异定位（P0–P1）",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "evidence-review",
      "workflowOwner": "local"
    },
    {
      "id": "evidence-review",
      "name": "教学目标、时间/队伍/资源及实验安全事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "intake",
      "nextStageId": "human-confirmation",
      "workflowOwner": "local"
    },
    {
      "id": "human-confirmation",
      "name": "校本签批权源、安全门禁与执行归档人工确认",
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
  "templateId": "T01-T09",
  "name": "实验教学、实习与实践教学安排变更审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T01-T09.md",
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/T01-T09.md",
  "sourceDocumentBytes": 132446,
  "sourceDocumentSha256": "8b394a3fdeb336d09c03b8e8a12a067955dc199db0a4e2be936c3a65f5cf30a1",
  "sourceHashBasis": "dispatch manifest SHA-256; verified against original UTF-8 bytes plus one final LF",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyStatusRaw": "PARTIALLY_VERIFIED；2018 年实习制度现行性、教学变更专门签批链及授权仍待核；2022 年课程规范已明文废止 2018 年教师规范；2023 年实验室技术安全规则已核",
  "policyEvidenceStatus": "PARTIAL",
  "criteria": [
    {
      "sectionId": "evidence-checks",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-011"
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
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-002",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-002",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-014",
        "SRC-016",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-014",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-004",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-001",
        "SRC-005",
        "SRC-011",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R029",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R030",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-007",
        "SRC-009",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R031",
      "sourceIds": [
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R032",
      "sourceIds": [
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R033",
      "sourceIds": [
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R034",
      "sourceIds": [
        "SRC-014",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "CDUT-VERIFIED；成都理工大学：《关于印发〈成都理工大学本科课程教学基本规范〉的通知》（成理校教〔2022〕11号）；官方学院汇编 PDF (https://cnae.cdut.edu.cn/local/B/CD/55/1347E45BA0243810CF9A9F4D250EAEE3C5577A641.pdf)；P18–26（印刷 15–23 页）；第七、十五、十七、十九、二十二至二十四条；通知 2022-06-04；生效/废止日原文需核末条、未检索到后续替代目录",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-002",
      "title": "CURRENTITY-UNKNOWN；成都理工大学：《本科学生实习管理办法》（成理校教〔2018〕20号）；官方学院汇编 PDF (https://cnae.cdut.edu.cn/local/B/CD/55/1347E45BA0243810CF9A9F4D250EAEE3C5577A641.pdf)；P69–75（印刷 66–72 页）；第一、三、四、七至十六、二十六至二十八条；2018-07-18 印发施行，同日替代 2006 旧规；2026 是否被新规替代待查",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-003",
      "title": "CURRENTITY-UNKNOWN（确证已废止的历史源）；成都理工大学：《教师本科教学工作规范》（成理校教〔2018〕10号）；官方学院汇编 PDF (https://cnae.cdut.edu.cn/local/B/CD/55/1347E45BA0243810CF9A9F4D250EAEE3C5577A641.pdf)；PDF P6–17；第十五条曾规定调课权限；2018-05-15 施行，按 SRC-001 第四十三条于 2022-06-04 被废止",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-004",
      "title": "CDUT-VERIFIED；成都理工大学：《本科教学实验室建设与管理办法》（成理校教〔2022〕9号）；官方学院汇编 PDF (https://cnae.cdut.edu.cn/local/B/CD/55/1347E45BA0243810CF9A9F4D250EAEE3C5577A641.pdf)；P76–82（印刷 73–79 页）；第五、十至十七、二十六至二十九条；2022-04-22 印发；生效/废止时间待查",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-005",
      "title": "CDUT-VERIFIED；成都理工大学教务处：《科室设置》；教务处官网 (https://aao.cdut.edu.cn/jgsz/kssz.htm)；“实践教学科”“教学事务中心”职能段；页面未明示发布时间/生效、废止；检索页最近抓取约 2 个月",
      "url": "https://aao.cdut.edu.cn/jgsz/kssz.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-006",
      "title": "CDUT-VERIFIED；成都理工大学环境与土木工程学院：《教务科》；学院官网 (https://cece.cdut.edu.cn/info/1028/5496.htm)；“教学秘书岗位职责”第 1、7 项，及教务科长职责；发布 2020-09-10；更新/失效未列",
      "url": "https://cece.cdut.edu.cn/info/1028/5496.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-007",
      "title": "CDUT-VERIFIED；成都理工大学财务处：《成都理工大学“只跑一次”财务事项清单》；财务处官方 PDF (https://jcc.cdut.edu.cn/local/8/A8/96/748E97CB5061A750C78C9A841EF9631E851E5400.pdf)；P0 发布页，P7 第 16 项“实习费”；2025-04；未列失效日",
      "url": "https://jcc.cdut.edu.cn/__local/8/A8/96/748E97CB5061A750C78C9A841EF_9631E851_E5400.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-008",
      "title": "CDUT-VERIFIED；成都理工大学：《2021—2022 学年本科教学质量报告》；校内 PDF (https://shpg.cdut.edu.cn/local/5/96/62/BAAB6819B693EE5588ECBC18F5BBC01582DFC225.pdf)；P17–18，“完善五类质量标准”；2021–2022 学年报告，网站索引发布时间约 2022 年末；不具规范生效日期",
      "url": "https://shpg.cdut.edu.cn/__local/5/96/62/BAAB6819B693EE5588ECBC18F5B_BC01582D_FC225.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-009",
      "title": "CURRENTITY-UNKNOWN；成都理工大学：《研究生培养环节管理办法（试行）》（成理校研〔2021〕12号）；校内 PDF (https://energy.cdut.edu.cn/local/B/66/CD/D11DA75E84C7FCDD25CBC557422EF1ADD3A555F8.pdf)；P0–1、P8–9；第二、二十九至三十二条；2021-06-09；适用后续修订/废止情况待查",
      "url": "https://energy.cdut.edu.cn/__local/B/66/CD/D11DA75E84C7FCDD25CBC557422_EF1ADD3A_555F8.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-010",
      "title": "CURRENTITY-UNKNOWN；成都理工大学：《实验教学工作规程》（原文尚未取得）；校内 2022 课程规范中的引用 (https://cnae.cdut.edu.cn/local/B/CD/55/1347E45BA0243810CF9A9F4D250EAEE3C5577A641.pdf)；P13 第三十六条引用；另 校内实验中心规章目录 (https://www.cdut.edu.cn/nret/gltz/glgzzd.htm)；历史 2006 年规程线索存在，确切最新文号/发布日期、完整条文/生效及废止均未知",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-011",
      "title": "CURRENTITY-UNKNOWN；成都理工大学：《教学安排与课程调度管理办法》（原文尚未取得）；校内质量报告引用 (https://shpg.cdut.edu.cn/local/5/96/62/BAAB6819B693EE5588ECBC18F5BBC01582DFC225.pdf)；P17–18 制度建设段提名；发布时间/文号、生效/废止、具体调课审批链待取原文",
      "url": "https://shpg.cdut.edu.cn/__local/5/96/62/BAAB6819B693EE5588ECBC18F5B_BC01582D_FC225.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-012",
      "title": "CURRENTITY-UNKNOWN；成都理工大学核技术与自动化工程学院：《教学实习管理办法》；该学院 2022 年 8 月汇编 (https://cnae.cdut.edu.cn/local/B/CD/55/1347E45BA0243810CF9A9F4D250EAEE3C5577A641.pdf)；P116–119（印刷 113–116 页）；第三、四、七部分；单件印发/生效/废止日期未载，2022-08 为汇编日期",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-013",
      "title": "GENERAL-RESEARCH；Fuck-GH-Admin/cdut-studio-review-agent，D4 G50 技术候选 catalog.json (https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json)；指定 SHA 7b6cdc843d26e926c0c63b8c51a451ff3925cfad；字段 templateCount=50、authoritativeSchoolTemplate=false、publica",
      "url": "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-014",
      "title": "CDUT-VERIFIED；成都理工大学：《实验室技术安全管理办法 (https://gz.cdut.edu.cn/local/7/87/9D/8AD8CCD1A99607DFA7C053FA5E95E88AC4AE9D3A.pdf)》（成理校发〔2023〕40号）；PDF P0–10，第七至十一、二十四至二十五、二十九至三十五条；2023-12-29 印发，2024-01-01 起执行，第35条明文废止成理校发〔2016〕25号；2026 年是否还有替代修订未取得更晚原文",
      "url": "https://gz.cdut.edu.cn/__local/7/87/9D/8AD8CCD1A99607DFA7C053FA5E9_5E88AC4A_E9D3A.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-015",
      "title": "GENERAL-RESEARCH（主管部门现行指导，不是校本流程）；教育部：《关于加强和规范普通本科高校实习管理工作的意见 (https://www.moe.gov.cn/srcsite/A08/s7056/201907/t20190724392130.html)》（教高函〔2019〕12号）；2019-07-12 发文，官网 2019-07-30 公开；实习组织、单位选择、质量、安全与权益相关段落；截至访问 2026-10-23 未发现替代该意见的明确公告",
      "url": "https://www.moe.gov.cn/srcsite/A08/s7056/201907/t20190724_392130.html",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-016",
      "title": "GENERAL-RESEARCH（主管部门规范）；教育部办公厅：《高等学校实验室安全规范 (https://www.moe.gov.cn/srcsite/A16/moe784/202302/t202302201045998.html)》（2023-02-08 印发）；2023-02-20 官网公布；安全责任体系、风险评估及人员准入章节；访问 2026-10-23",
      "url": "https://www.moe.gov.cn/srcsite/A16/moe_784/202302/t20230220_1045998.html",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-017",
      "title": "GENERAL-RESEARCH（主管部门规范）；教育部：《高等学校实验室安全分级分类管理办法（试行） (https://www.moe.gov.cn/srcsite/A16/s7062/202404/t202404191126415.html)》（2024 年）；2024-04-22 官网公布；分级分类/动态管理，访问 2026-10-23",
      "url": "https://www.moe.gov.cn/srcsite/A16/s7062/202404/t20240419_1126415.html",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-018",
      "title": "CDUT-VERIFIED（官网职责公开，非正式授权表）；成都理工大学宜宾校区：《教务工作部部门职责 (https://yb.cdut.edu.cn/info/1091/4509.htm)》；2026 年网页公开；“日常调课及课程重修”“配合专业学院开展实习、见习等实践教学工作”职责段；检索 2026-10-23，网页全文打开受限需校区再确权",
      "url": "https://yb.cdut.edu.cn/info/1091/4509.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = T01T09_TEMPLATE
