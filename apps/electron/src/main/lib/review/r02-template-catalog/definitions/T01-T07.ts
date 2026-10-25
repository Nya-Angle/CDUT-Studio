import type { TemplateVersion } from "@profer/shared"

export const T01T07_TEMPLATE: TemplateVersion = {
  "templateId": "T01-T07",
  "version": 1,
  "schemaVersion": 2,
  "name": "教师成绩录入延期申请审核",
  "description": "本地研究模板 · 非校方正式模板。教师成绩录入延期申请审核的材料解析、事实核对和审阅建议用途；政策适用性、授权、期限和最终办理结果须由有权人员人工确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；政策证据状态为 PARTIAL，任何未确认规则均不得自动产生正式通过或拒绝。",
  "objectType": "custom",
  "displayName": {
    "template": "T01-T07 · 教师成绩录入延期申请审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · 案卷唯一标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：ID；RequestCase；A1 必；本地案卷服务端生成。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F001 案卷唯一标识；ID；RequestCase；A1 必。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F002",
      "label": "F002 · 申请主体人员 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：ID；ActorBinding；A1 必；服务端校方认证/人员主数据。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F002 申请主体人员 ID；ID；ActorBinding；A1 必。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F003",
      "label": "F003 · 人员任职机构/角色",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：结构；ActorBinding；A1–A2 必；校方人员组织/岗位授权记录。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F003 人员任职机构/角色；结构；ActorBinding；A1–A2 必。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F004",
      "label": "F004 · 申请联络方式",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：文本；RequestCase；A1 条件；当事人输入或有权限的校方联系目录。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F004 申请联络方式；文本；RequestCase；A1 条件。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F005",
      "label": "F005 · 代理人及授权范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：结构/时间区间；ActorBinding；A1 代理必；认证代理主体及校方有效委托/授权。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F005 代理人及授权范围；结构/时间区间；ActorBinding；A1 代理必。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F006",
      "label": "F006 · 学段/办学类型",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：枚举待映射；TeachingAssignment；A1–A2 必；校方课程学段/教务主数据。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F006 学段/办学类型；枚举待映射；TeachingAssignment；A1–A2 必。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F007",
      "label": "F007 · 校区、开课单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：结构；TeachingAssignment；A1–A2 必；校方组织和课程归口记录。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F007 校区、开课单位；结构；TeachingAssignment；A1–A2 必。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F008",
      "label": "F008 · 学年学期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：标准化字符串；TeachingAssignment；A1–A2 必；当期教学任务/考务登记。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F008 学年学期；标准化字符串；TeachingAssignment；A1–A2 必。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F009",
      "label": "F009 · 课程唯一键及名称",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ID+文本；TeachingAssignment；A1–A2 必；当期课程目录与任务台账。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F009 课程唯一键及名称；ID+文本；TeachingAssignment；A1–A2 必。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F010",
      "label": "F010 · 教学班 ID 集合",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ID 集合；TeachingAssignment；A1–A2 必；当期教学任务/成绩批次记录。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F010 教学班 ID 集合；ID 集合；TeachingAssignment；A1–A2 必。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F011",
      "label": "F011 · 成绩录入责任人 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ID/责任区间；TeachingAssignment；A2 必；教务任务责任人/受托名单。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F011 成绩录入责任人 ID；ID/责任区间；TeachingAssignment；A2 必。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F012",
      "label": "F012 · 考核批次、类别",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：枚举待映射；GradeBatch；A2 必；考务/成绩系统的考核批次。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F012 考核批次、类别；枚举待映射；GradeBatch；A2 必。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F013",
      "label": "F013 · 该批次考核实际结束时刻",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：日期时刻；GradeBatch；A2 必；校方考务记录/经核实的实施记录。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F013 该批次考核实际结束时刻；日期时刻；GradeBatch；A2 必。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F014",
      "label": "F014 · 两周原则参考时点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：派生日期；DeadlineBasis；A2 条件；仅用 F013+适用的 SRC-001 条款计算。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F014 两周原则参考时点；派生日期；DeadlineBasis；A2 条件。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F015",
      "label": "F015 · 当期通知明确的录入截止",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：日期时刻/边界语义；DeadlineBasis；A2 必核；当期教务处正式通知/有效附件。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F015 当期通知明确的录入截止；日期时刻/边界语义；DeadlineBasis；A2 必核。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F016",
      "label": "F016 · 系统实际开放/关闭窗口",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：时间区间；GradeBatch；A2 必核；有权教务系统设置/管理人回执。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F016 系统实际开放/关闭窗口；时间区间；GradeBatch；A2 必核。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F017",
      "label": "F017 · 成绩录入提交/发布状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：按班次/批次枚举；GradeBatch；A2 必；成绩系统权威状态及日志。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F017 成绩录入提交/发布状态；按班次/批次枚举；GradeBatch；A2 必。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F018",
      "label": "F018 · 正式提交/发布时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：日期时刻或未发生；GradeBatch；A2 条件；成绩系统审计日志/有权核验。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F018 正式提交/发布时间；日期时刻或未发生；GradeBatch；A2 条件。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F019",
      "label": "F019 · 请求影响的目标范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：班次/记录数量/最小受控键集合；GradeBatch；A1–A2 必；M001 主张与 M006 权威范围交叉。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F019 请求影响的目标范围；班次/记录数量/最小受控键集合；GradeBatch；A1–A2 必。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F020",
      "label": "F020 · 希望延长至的时点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：日期时刻；DelayClaim；A1 申请主张；申请人经认证的陈述。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F020 希望延长至的时点；日期时刻；DelayClaim；A1 申请主张。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F021",
      "label": "F021 · 延迟原因叙述",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：受控短文本；DelayClaim；A1 申请主张；申请人自述，仅属主张。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F021 延迟原因叙述；受控短文本；DelayClaim；A1 申请主张。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F022",
      "label": "F022 · 事件发生与影响时段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：时间区间；DelayClaim；A2 条件；M001/M007 自述，M009/M010 校方核对。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F022 事件发生与影响时段；时间区间；DelayClaim；A2 条件。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F023",
      "label": "F023 · 理由佐证引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：证据 ID 集合；EvidenceRef；A2–A3 条件；提交的合法佐证或校方工单。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F023 理由佐证引用；证据 ID 集合；EvidenceRef；A2–A3 条件。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F024",
      "label": "F024 · 申请提交时刻及渠道",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：时间戳/渠道；RequestCase；A1 必；真实接收系统/经办登记。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F024 申请提交时刻及渠道；时间戳/渠道；RequestCase；A1 必。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F025",
      "label": "F025 · 既有申请/决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：外部案卷键/状态；RequestCase；A2/A6 条件；真实案卷及生效决定登记。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F025 既有申请/决定引用；外部案卷键/状态；RequestCase；A2/A6 条件。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F026",
      "label": "F026 · 适用政策依据和版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：SRC 集合/时效；DeadlineBasis；A2–A4 必核；学校正式制度/当期通知及校方现行性确认。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F026 适用政策依据和版本；SRC 集合/时效；DeadlineBasis；A2–A4 必核。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F027",
      "label": "F027 · 事实冲突/问题集",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：结构化差异列表；RequestCase；A2–A3 派生；各 F 与相关 M 的版本化对照。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F027 事实冲突/问题集；结构化差异列表；RequestCase；A2–A3 派生。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F028",
      "label": "F028 · 学校决定/签发人及作用范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：决定对象；SchoolDecision；A4 后续产生；真正授权决策岗位/签发系统。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F028 学校决定/签发人及作用范围；决定对象；SchoolDecision；A4 后续产生。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F029",
      "label": "F029 · 决定生效/终止/送达时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：时间区间；SchoolDecision；A4–A5 后续；决定文件/学校效力规则。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F029 决定生效/终止/送达时间；时间区间；SchoolDecision；A4–A5 后续。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F030",
      "label": "F030 · 系统执行动作及回执",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：事件/操作者；ExecutionAndReview；A5 后续；获授权成绩系统操作日志。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F030 系统执行动作及回执；事件/操作者；ExecutionAndReview；A5 后续。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F031",
      "label": "F031 · 撤回/续期/复核事件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：事件流；ExecutionAndReview；A3/A6 后续；经认证请求及真实办理结果。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F031 撤回/续期/复核事件；事件流；ExecutionAndReview；A3/A6 后续。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F032",
      "label": "F032 · 证据版本与目标归属",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：文件摘要/源版本/指针；EvidenceRef；A1–A6 必留；每份 M 的入库版本与可信引用元数据。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F032 证据版本与目标归属；文件摘要/源版本/指针；EvidenceRef；A1–A6 必留。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F033",
      "label": "F033 · 决策人的实际授权验证结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：授权来源/时效/作用范围；SchoolDecision；A4 必核；校方组织岗位及授权决议，服务端验证。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F033 决策人的实际授权验证结果；授权来源/时效/作用范围；SchoolDecision；A4 必核。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F034",
      "label": "F034 · 下游学业业务时敏节点及最小影响范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：(sourceBusiness, deadline, affectedCount, scopeKey, authority, version)；GradeBatch/RequestCase；A2–A4，B13 条件；毕业/推免/资助等实际业务 Owner 具名可验证回执。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F034 下游学业业务时敏节点及最小影响范围；(sourceBusiness, deadline, affectedCount, scopeKey, authority, version)；GradeBatch/RequestCase；A2–A4，B13 条件。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F035",
      "label": "F035 · 敏感信息处理依据与授权范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：(purpose, legalBasis, category, accessRoles, retentionRule, transferScope, version)；EvidenceRef；A1–A6，处理 P2/P3 明细前；学校信息管理/法务/数据控制者核定的真实策略与服务端授权。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F035 敏感信息处理依据与授权范围；(purpose, legalBasis, category, accessRoles, retentionRule, transferScope, version)；EvidenceRef；A1–A6，处理 P2/P3 明细前。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 延期请求、理由及目标范围",
      "purpose": "申请人；结构化陈述/经办记录，非已证实校方表单；A0–A1 当前必需；经真实受理人员登记的本人申请陈述；若无正式渠道仅为草稿；F004/F008–F010/F019–F021/F024；SRC-001 仅证明成绩提交责任；案卷 ID、本人确认版本、每个字段输入位置与时间。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "申请人；结构化陈述/经办记录，非已证实校方表单",
        "A0–A1 当前必需",
        "经真实受理人员登记的本人申请陈述；若无正式渠道仅为草稿"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 身份、在岗归属及真实主体",
      "purpose": "校方身份认证、人员/岗位授权系统的核验记录；A1–A2 当前必核，非教师上传；学校有权人员具名核验记录；不得仅用工牌/教师证图片；F002/F003；SRC-001 第 15、19 条仅职责线索；人员唯一键、认证会话/核验回执、来源版本。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "校方身份认证、人员/岗位授权系统的核验记录",
        "A1–A2 当前必核，非教师上传",
        "学校有权人员具名核验记录；不得仅用工牌/教师证图片"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 · 当期课程、任课责任与教学班",
      "purpose": "学校教学任务台账、开课学院经核的任务记录；A1–A2 当前必核，非默认上传；学院有权教务人员按原台账出具的盖章/可追溯确认，不接受个人截图当权威；F006–F011；SRC-001 第 17、19、20、34 条；SRC-004 仅属地职责；学期+课程+班次+责任人，发布版本与台账行号。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "学校教学任务台账、开课学院经核的任务记录",
        "A1–A2 当前必核，非默认上传",
        "学院有权教务人员按原台账出具的盖章/可追溯确认，不接受个人截图当权威"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M004",
      "name": "M004 · 考核性质、批次和实际结束时刻",
      "purpose": "考务安排、课程考核实施记录/开课学院核验；A2 当前必核；授权考务员对已发生考核的具名核验；调考须另有生效变更；F008/F012–F014；SRC-001 第 29、34 条；对应班次/批次的原表行与实际考核时间。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "考务安排、课程考核实施记录/开课学院核验",
        "A2 当前必核",
        "授权考务员对已发生考核的具名核验；调考须另有生效变更"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 · 当期录入截止与政策适用",
      "purpose": "校方正式制度、教务处当期通知及现行性答复；A2–A4 当前必核，非申请人上传；学校有效发文系统原文或主管部门提供的具名正式核实；F014–F016/F026；SRC-001、SRC-002（仅其历史批次）、SRC-003（仅所属学院）；文件号、发布/实施日期、适用学期/学段、具体条项或 PDF 页。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "校方正式制度、教务处当期通知及现行性答复",
        "A2–A4 当前必核，非申请人上传",
        "学校有效发文系统原文或主管部门提供的具名正式核实"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 · 原始成绩录入状态、窗口及日志",
      "purpose": "成绩系统真实状态/审计日志、获授权成绩管理岗位；A2 当前必核；有权系统管理员按相同记录键出具核验回执；个人截图只作线索；F010/F012/F016–F019；SRC-001 第 34、35 条；系统记录键、状态时间、来源版本、对应班次及批次。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "成绩系统真实状态/审计日志、获授权成绩管理岗位",
        "A2 当前必核",
        "有权系统管理员按相同记录键出具核验回执；个人截图只作线索"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M007",
      "name": "M007 · 具体延期原因的客观支持",
      "purpose": "申请人/实际事实发生单位；按理由最小化的证明；A2–A3 条件必需，校本必交政策待定；校方已掌握的相关请假/任务/事件结果引用；只核必要时间和影响结论；F021–F023；SRC-001 仅时限，延期可采原因 SRC 待核；每份证明持有人、发生日期、页/区间与证明对象。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "申请人/实际事实发生单位；按理由最小化的证明",
        "A2–A3 条件必需，校本必交政策待定",
        "校方已掌握的相关请假/任务/事件结果引用；只核必要时间和影响结论"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 · 代理申请/办理权",
      "purpose": "被代理人和学校授权部门；有效委托、系统代理权限；A1–A2 仅 B04 条件必需；校方正式系统的受托权限关系及审计日志；F002/F005/F011；SRC-001 第 19、20 条只证明课程责任，代理制度待核；代理双方唯一 ID、课程/班次/行为范围、生效撤销时点。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "被代理人和学校授权部门；有效委托、系统代理权限",
        "A1–A2 仅 B04 条件必需",
        "校方正式系统的受托权限关系及审计日志"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 · 系统故障及影响区间",
      "purpose": "信息化/成绩系统运维；工单、停机公告、告警回执；A2–A3 仅 B07 条件必需；经核实的故障监控/当值管理人确认；聊天截图仅作检索线索；F016/F022/F023；G04 或校方运维权威事实，延期政策 SRC 待核；工单号、服务、影响账号/时间、原始日志版本。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "信息化/成绩系统运维；工单、停机公告、告警回执",
        "A2–A3 仅 B07 条件必需",
        "经核实的故障监控/当值管理人确认；聊天截图仅作检索线索"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 已批准的考试日期或教学安排变更",
      "purpose": "考务/开课单位；经正式批准的调考、调整通知；A2–A3 仅有实际变更时条件必需；有权部门当期系统变更记录，不使用个人新日历；F012–F015/F022；SRC-001 第 29、34 条，T01-T01 权威结果；原/新日期、批准记录、所影响班次与版本。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "考务/开课单位；经正式批准的调考、调整通知",
        "A2–A3 仅有实际变更时条件必需",
        "有权部门当期系统变更记录，不使用个人新日历"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 既有延期/相关处理结果",
      "purpose": "原办理业务的有权记录部门；A2/A6 存在既往案件时条件必需；带来源、签发人、版本和生效状态的正式决定引用；F025/F027/F031；本事项延期决定 SRC 待核；源案卷 ID、决定编号、状态/撤销信息及引用时刻。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "原办理业务的有权记录部门",
        "A2/A6 存在既往案件时条件必需",
        "带来源、签发人、版本和生效状态的正式决定引用"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 本案学校正式人工决定",
      "purpose": "经政策确定的真实延期审批机关（当前未知）；A4 后续才产生；具名授权的校方电子/纸质决定及验真回执，不以 AI 文书代替；F028/F029/F033；M017 对应的授权 SRC 待核；决策人、签发和生效时点、具体班次/批次/期限。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "经政策确定的真实延期审批机关（当前未知）",
        "A4 后续才产生",
        "具名授权的校方电子/纸质决定及验真回执，不以 AI 文书代替"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 · 成绩系统执行/开窗回执",
      "purpose": "有权成绩系统执行人或系统操作日志；A5 后续才产生；权威系统操作回执及审计记录；F030/F032；SRC-001 第 34、35 条只说明成绩制度；决定 ID、执行动作、账号、班次、时间及版本。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "有权成绩系统执行人或系统操作日志",
        "A5 后续才产生",
        "权威系统操作回执及审计记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 撤回、续期或更改申请意向",
      "purpose": "原申请人/代理人；经认证的后续陈述；A3/A6 有事件才产生；校方承办人员具名登记的本人意向；不等同已被学校批准；F020/F024/F031/F032；撤回/续期规则 SRC 待核；事件号、原申请版本、请求人、提交时点。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "原申请人/代理人；经认证的后续陈述",
        "A3/A6 有事件才产生",
        "校方承办人员具名登记的本人意向；不等同已被学校批准"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 复核申请及复核结论",
      "purpose": "提出异议者与真实有权复核部门；A6 有争议才产生；校方正式复核办理记录及结论；不能借用 S02 的学生复核期限；F025/F028/F031；教师延期复核制度 SRC 待核；原决定 ID、受理人、复核范围/时间、结论版本。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "提出异议者与真实有权复核部门",
        "A6 有争议才产生",
        "校方正式复核办理记录及结论；不能借用 S02 的学生复核期限"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 已发布成绩补录/更正的权威结论",
      "purpose": "T01-T08 所对应的有权业务管理方；B06 分流后才产生或引用；原改分/补录案卷的可验证结论与版本；F017/F018/F025；SRC-001 第 35 条；SRC-006 仅历史线索；源模板、源决定、影响学生范围（受控键）及有效状态。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "T01-T08 所对应的有权业务管理方",
        "B06 分流后才产生或引用",
        "原改分/补录案卷的可验证结论与版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 · 延期事项授权与审批规则",
      "purpose": "教务处/学校正式制度发布与授权机关；A4 决定前必核，非教师上传；当前有效的业务办法、授权清单或书面确认；学校应提供；F026/F028/F029/F033；SRC-001 第 15 条不等于延期授权，专项 SRC 待核；文号、有效时段、签发机关、决定岗位及适用范围。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "教务处/学校正式制度发布与授权机关",
        "A4 决定前必核，非教师上传",
        "当前有效的业务办法、授权清单或书面确认；学校应提供"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "M018 · 权威信息更正/冲突消解记录",
      "purpose": "原始台账/教务系统/通知实际所有者；A3 只有冲突时条件必需；由同一有权源的修订记录或正式勘误，而不是申请人改图；F003/F008–F018/F026/F027/F032；关联被更正的 SRC；新旧源记录键、修订人、版本、撤销/替换关系。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "原始台账/教务系统/通知实际所有者",
        "A3 只有冲突时条件必需",
        "由同一有权源的修订记录或正式勘误，而不是申请人改图"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "M019 · 下游学业关键节点与实际影响证据",
      "purpose": "毕业/推免/学籍/资助等下游业务数据 Owner；正式节点通知和最小受影响范围回执；A2–A4 仅 B13 条件触发；经有权经办人核查的节点/影响数量回执；只存源业务 ID、版本、计数和时间；F019/F034；SRC-014（成绩记载原则）；R023；目标班次、下游业务、节点及源版本；避免学生名单外泄。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "毕业/推免/学籍/资助等下游业务数据 Owner；正式节点通知和最小受影响范围回执",
        "A2–A4 仅 B13 条件触发",
        "经有权经办人核查的节点/影响数量回执；只存源业务 ID、版本、计数和时间"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M020",
      "name": "M020 · 个人信息处理目的、合法依据和授权范围",
      "purpose": "学校个人信息处理责任部门/授权管理者；策略、委托及访问范围记录；A1–A6 在处理健康或不必要明细前必核；学校已批准的最小化/去标识处理方案，必要时只取事件持续时间而不取诊断；F023/F032/F035；SRC-013；R024；策略版本、目的、数据类别、受权人员和数据保留规则。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
        "学校个人信息处理责任部门/授权管理者；策略、委托及访问范围记录",
        "A1–A6 在处理健康或不必要明细前必核",
        "学校已批准的最小化/去标识处理方案，必要时只取事件持续时间而不取诊断"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "evidence-checks",
      "name": "原稿审核规则逐项核验",
      "description": "依据 T01-T07 原稿规则表逐条生成稳定 criterion ID；SRC 是研究来源索引，不是案卷材料 SourceRef。所有未确认政策均需人工确认。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "R001 · 请求内容和目标是否可定位",
          "requirement": "R001 请求内容和目标是否可定位；A0–A1。T：本人陈述含目标学期/课程/班次、理由、目标时点；F：当前必要陈述确实缺项；U：已交载体无法解析；SRC-001 第 34 条仅说明成绩提交事项；F001/F004/F008–F010/F019–F021/F024；M001；只核申请人陈述完整，与当期任务真伪分开；联络方式 F004 非无条件必填；M001 保留本人确认版本；T PASSFACT；F NEEDSMATERIAL →申请人；U UNREADABLE →材料处理岗。无正式入口仅草稿，不冒充学校受理",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R002",
          "title": "R002 · 可信申请人身份",
          "requirement": "R002 可信申请人身份；A1–A2。T：服务端真实主体同 M002；F：唯一 ID 不同；U：身份源无法取；SRC-001 第 19、30 条仅任课背景；F002/F003；M002；用人员 ID、有效会话、来源时点校验；同名 OCR、Renderer actor 不作认证；特殊代理交 R004；T PASSFACT；F CONFLICT →身份管理岗；U SOURCEUNAVAILABLE →认证/人事数据岗",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R003",
          "title": "R003 · 教学任务及归属",
          "requirement": "R003 教学任务及归属；A1–A2。T：本期课程/班次的实际责任人与申请人或被代理人匹配；F：权威台账归属冲突；U：当期台账不可得；SRC-001 第 17、19、20、34 条，SRC-011 仅该期教学任务字段；F003/F006–F011；M003；以学期+课程 ID+班次+任务版次联结，不因上学期任课而继承；多人授课需核成绩责任人，不只课程组头衔。历史学期的 SRC-011 只能支持主讲/学时字段，不证明全部成绩录入权限；T PASSFACT；F CONFLICT →开课单位/教学任务持有人；U SOURCEUNAVAILABLE →教务任务岗",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "R004 · 代理/课程组代办真实性",
          "requirement": "R004 代理/课程组代办真实性；A1–A2；仅填报人≠核定成绩责任人触发。T：M008 的受托人、操作、任务、时段均覆盖；F：授权被撤销/范围不符；U：无可验证授权制度或记录；SRC-001 第 19、20 条只支持职责，代理专项 SRC 缺失；F002/F005/F011；M002/M003/M008；本人办理本行 NOTAPPLICABLE；书面签名图片不能替代实际授权，委托办理≠批准权；T PASSFACT →受理事实岗；F CONFLICT →授权岗位；U POLICYUNCONFIRMED 或 SOURCEUNAVAILABLE →校方授权/数据岗",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "R005 · 考核批次及实际结束时点",
          "requirement": "R005 考核批次及实际结束时点；A2。T：当期 M004 可证明 F012/F013；F：同键两个权威日期不符；U：考务记录缺失/不可读；SRC-001 第 29、34 条；F008/F010/F012/F013；M003/M004；先分清常规期末、补缓考、实践环节；实际已发生考试用发生记录，调考正式效力另由 R015 校验；T PASSFACT；F CONFLICT →考务所有者；U SOURCEUNAVAILABLE/UNREADABLE →考务岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "R006 · 校本规则的学段、时段和组织适用性",
          "requirement": "R006 校本规则的学段、时段和组织适用性；A2–A4。T：F026 指向当前可适用的制度和通知；F：发现来自他校/其他学段/旧批次却被当现行；U：现行性及专项授权无法核定；SRC-001/002/003/004/006/008/010/012（各有限定）；F006–F008/F015/F026；M005/M017（授权在 A4 才必核）；逐比发布机关、学段、校区、学期、废止/替代和条款；SRC-010 第 8 条仅博士综合考核，不是普通研究生成绩录入；SRC-012 正文未复验不得提供硬时限；T PASSFACT（仅适用依据的身份与范围）；F CONFLICT →政策归口；U POLICYUNCONFIRMED →教务处/研究生归口",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "R007 · 本科两周原则的参考推导",
          "requirement": "R007 本科两周原则的参考推导；A2；仅 SRC-001 所辖本科课程且 F013 已证实。T：按有权解释可追溯地得到 F014 参考值；F：计算值/适用域不符；U：起算含义或当前版本不确定；SRC-001 第 34 条，SRC-003 仅特定学院；F006/F013/F014/F026；M004/M005；原则两周不等于系统窗口、延期许可或不可争辩的精确最后秒数；研究生/无适用规则时 NOTAPPLICABLE，时间算式细节待校方解释；T PASSFACT；F CONFLICT →教务解释岗；U POLICYUNCONFIRMED →校本规则解释岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "R008 · 特定学期通知的成绩上传截止",
          "requirement": "R008 特定学期通知的成绩上传截止；A2。T：M005 的 F015 与目标学期、批次精确匹配；F：跨期套用 SRC-002/008 或录入排除边界错误；U：当期通知未取得/有两个冲突版本；SRC-001 第 34 条、SRC-002、SRC-008；F008/F012/F015/F026；M004/M005；SRC-002 限 2024—2025-2，SRC-008 限 2025—2026-1；对“X 日前”保留原句和是否含当日的核定，绝不拼接历史通知当本学期规则；T PASSFACT；F CONFLICT →教务通知岗；U POLICYUNCONFIRMED 或 SOURCEUNAVAILABLE →教务处",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "R009 · 成绩系统实际开放窗口",
          "requirement": "R009 成绩系统实际开放窗口；A2。T：F016 有源系统版本/时间区间；F：记录与声称的窗口冲突；U：API/后台不可访问；SRC-001 第 34、35 条仅成绩制度；F016/F026/F032；M005/M006；业务截止 F015 与技术开放 F016 分存，真实开放≠学校已授延期许可；只让有权系统管理员签发窗口事实；T PASSFACT；F CONFLICT →成绩系统岗；U SOURCEUNAVAILABLE →运维/教务管理员",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "R010 · 正式提交/发布状态",
          "requirement": "R010 正式提交/发布状态；A2–A3。T：逐班 F017/F018 有权威状态、事件时点；F：申请声称“未提交”而权威日志为“已提交/已发布”；U：状态不可取或冲突；SRC-001 第 34、35 条，SRC-006 仅历史补改分线索；F010/F012/F017/F018；M006；状态来源必须绑定具体班次、批次、日志版本；“暂存”与“提交”的真实字段待校方映射；已提交是 R021 分流事实，不等于拒绝改分资格；T PASSFACT；F CONFLICT（陈述不一致）并触发 R021 →成绩管理岗；U SOURCEUNAVAILABLE/CONFLICT →成绩状态持有人",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "R011 · 多班次请求的目标集合完整性",
          "requirement": "R011 多班次请求的目标集合完整性；A1–A3；请求多班或仅部分学生未录入时触发。T：F019 子集均属 F010/M003/M006；F：跨班/跨期或已提交部分混为一体；U：某班状态缺失；SRC-001 第 20、34、35 条；F008–F012/F017/F019；M001/M003/M006；按 (课程,班,考核批次) 分项，不因某班 PASSFACT 传播另一班；单班完整匹配时同样可记录，通过其他规则继续核；T PASSFACT；F CONFLICT →开课单位核范围；U SOURCEUNAVAILABLE →成绩系统岗",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "R012 · 申请时点与请求时点的事实比较",
          "requirement": "R012 申请时点与请求时点的事实比较；A2。T：F024、F020 可与有效 F015/F016 比较并标“提前/已过期/未知”；F：申请人时点与真实接收戳冲突；U：缺当期截止或真实接收证明；SRC-001 第 34 条；SRC-002/008 仅对应历史学期；F015/F016/F020/F024；M001/M005/M006；比较只形成时间先后事实；超期是否可受理/追认、最长延长多久均无专项 SRC，不输出自动拒绝；T PASSFACT（时间分类）→人工核受理资格；F CONFLICT →接收记录持有人；U POLICYUNCONFIRMED/SOURCEUNAVAILABLE →教务处",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "R013 · 申请原因与客观佐证的对应性",
          "requirement": "R013 申请原因与客观佐证的对应性；A2–A3。T：叙述 F021 与合法可取 M007 时间/对象一致；F：可读证据与所述事件不符；U：理由证据尚无必交政策或已交不可读；SRC-001 第 34 条不规定允许延期的原因；F021–F023；M001/M007；没有合法必交依据时不能只因缺 M007 判缺件；健康隐私只取必要时间和影响结论；“证实发生”≠“事由足以批准”；T PASSFACT（原因相关事实）；F CONFLICT →申请人/事实原持有人；U POLICYUNCONFIRMED/UNREADABLE →教务政策岗/材料岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "R014 · 系统故障时段与受影响范围",
          "requirement": "R014 系统故障时段与受影响范围；A2–A3；仅 B07 主张故障。T：M009 可信工单时段覆盖目标账号/服务；F：权威工单否认相应受影响范围；U：日志无法取得；SRC-001 只规定常规提交义务；故障顺延专项 SRC 缺失；F016/F022/F023；M006/M009；G04/校运维提供故障事实；教师截图为线索，工单只证“故障”，不产生自动顺延许可；T PASSFACT；F CONFLICT →运维来源所有者；U SOURCEUNAVAILABLE →运维岗；放行决定交人工作出",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "R015 · 考核日期正式变更",
          "requirement": "R015 考核日期正式变更；A2–A3；仅主张考试改期/调课引起迟交时。T：M010 为有权单位已生效变更，更新本批次 F013；F：个人通知与审批记录不符；U：生效记录/审批者不可核；SRC-001 第 29、34 条；F012–F015/F022；M004/M005/M010；只读取 T01-T01 或真实考务决定的效力和范围，不得在本模板重新决定调考；T PASSFACT →考务更新时点；F CONFLICT →原决定所有者；U SOURCEUNAVAILABLE/POLICYUNCONFIRMED →教务处",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R016",
          "title": "R016 · 既有处理与案卷引用",
          "requirement": "R016 既有处理与案卷引用；A2/A6；有重复申请、旧延时请求或已存在原决定时。T：M011 真正指向同对象/版本/有效状态；F：旧决定无效、作用班次不符；U：原记录未能核验；SRC-001 仅一般时限，既有延期事项授权 SRC 待核；F025/F031/F032；M011；不将上次/其他班批准继承至新期限；S02/T01-T08 的决定只取其本领域效力，不变为延期许可；T PASSFACT（引用真实性）；F CONFLICT →原案卷持有人；U SOURCEUNAVAILABLE →记录管理岗",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "R017 · 本事项终审岗位的正式授权",
          "requirement": "R017 本事项终审岗位的正式授权；A4 决定前。T：M017 当前有效、明确具体职位/人员及事项范围，F033 可由服务端验证；F：申请签发人越权/授权撤销；U：尚无可核的专门延期制度；SRC-001 第 15、17 条只能证一般职责；F003/F026/F028/F033；M002/M017；授权须涵盖成绩延期而非仅“教学管理”，校区委托不得靠部门名称推断；不存在批准规则不生成批准按钮/命令；T PASSFACT（授权核验）→真实有权岗位；F CONFLICT →校方权限机关；U POLICYUNCONFIRMED →教务处核政策，申请保持待人工",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "R018 · 正式人工作出决定及生效真实性",
          "requirement": "R018 正式人工作出决定及生效真实性；A4，且 R017 有可靠授权才可能核决定。T：M012 真签发人与范围、内容、决定时间/生效规则吻合；F：伪章/越权/超范围或与原档相冲突；U：未作出决定或决定记录不可靠；SRC-001 第 34、35 条只提供成绩工作背景，延期有效决定 SRC 待核；F019/F020/F026/F028/F029/F033；M012/M017；M012 仅 A4 后生成；哪怕 R001–R017 都 PASSFACT，仍不得机器生成学校决定；缺真实决定与缺权限分开记录；T PASSFACT（只核已存在的决定真实性）→有权执行岗；F CONFLICT →校方决定保管岗；U NEEDSHUMANDECISION/POLICYUNCONFIRMED →授权机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "R019 · 学校决定后的系统执行事实",
          "requirement": "R019 学校决定后的系统执行事实；A5；仅有可验证的 M012 决定且按权限进入执行才触发。T：M013 中被授权人、时点、目标班次、动作和 M012 一致；F：执行超范围或日志否认开窗；U：待执行或日志失联；SRC-001 第 34、35 条仅成绩工作背景；F028–F030/F032/F033；M012/M013；决定生效≠系统已开窗，开窗≠某学生成绩已上传；自动执行权限不从本研究模板推导；T PASSFACT（执行事实）→成绩系统管理岗归档；F CONFLICT →审计/运维岗；U NEEDSHUMANDECISION/SOURCEUNAVAILABLE →有权执行岗",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R020",
          "title": "R020 · 撤回、续期、重提与复核事件",
          "requirement": "R020 撤回、续期、重提与复核事件；A3/A6；有新事件才触发。T：M014/M015 证明真实主体提出意向及原案引用；F：主体不符、旧许可被扩大或与原决定冲突；U：事件可认而其正式效力/路径无政策；SRC-001 不规定教师延期撤回/复核；F002/F020/F024/F025/F029/F031/F032；M002/M011/M014/M015；无事件时 NOTAPPLICABLE；已批准后撤回不自动撤销 M012，重提/复核不继承旧时限，原决定只能由权威机构依法变更；T PASSFACT（事件发生），效力另待人工；F CONFLICT →原受理单位；U POLICYUNCONFIRMED/NEEDSHUMANDECISION →权限机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "R021 · 与已提交成绩改分及相邻案卷分流",
          "requirement": "R021 与已提交成绩改分及相邻案卷分流；A2–A3；F017 显示已提交/已发布，或诉求要求改成绩值时触发。T：可信状态支持明确路由；F：申请陈述与真实状态或预期动作冲突；U：状态不可核；SRC-001 第 35 条；SRC-006 历史流程仅提示 T01-T08；F017–F019/F025；M006（分流前）；M016（分流后可选引用）；已正式提交但尚未发布且拟更改分值，同样按 T01-T08；学生复核归 S02-T06；任课资格 T06-T04、考核方案 T01-T06、调考 T01-T01、安全/解析 G50/G04 只引用各自权威结果；不能把尚不存在的 M016 作为分流前必交；T PASSFACT（已识别应路由）→相邻模板负责岗；F CONFLICT →成绩状态/申请人核差异；U SOURCEUNAVAILABLE →成绩系统岗；未触发 NOTAPPLICABLE",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "R022 · 材料可读、归属、来源与版本链",
          "requirement": "R022 材料可读、归属、来源与版本链；A1–A6；对当前阶段实际使用的每份 M 执行。T：材料可读、目标键与源版本一致，引用有效；F：同级权威数据互斥或已被正式撤销/替换；U：文件损坏/权威源失联；SRC-001/002/008 仅支撑所引用业务文本；F001/F010/F012/F023/F026/F027/F032；M001–M020（仅各自可达阶段，冲突改正用 M018）；记录源 ID/页行/时间/归属/摘要及 supersedes；G50 原有真伪和解析结果仅引用，不自行复判签章；替换使依赖结论失效并定向重审，详见 11.3；T PASSFACT（证据版本核验）；F CONFLICT →源所有者；U UNREADABLE/SOURCEUNAVAILABLE →材料处理/源系统岗",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "R023 · 下游成绩使用的真实时效影响",
          "requirement": "R023 下游成绩使用的真实时效影响；A2–A4，仅 B13。T：M019 与本批次 F019、F034 对齐，证实存在特定下游业务节点；F：下游节点/目标不匹配；U：源业务不可查；SRC-014 第 18 条（成绩真实完整背景），SRC-001 第 34 条（及时上传）；F008–F012/F019/F034；M003/M006/M019；仅核下游业务、节点时间及影响班次/人数；是否为了毕业/推免优先放行属于本案有权人及下游有权人共同判断，不可按人数设自动许可/否决；T PASSFACT →成绩管理与下游业务 Owner；F CONFLICT →下游源 Owner；U SOURCEUNAVAILABLE →同上；无节点 NOTAPPLICABLE",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R024",
          "title": "R024 · 个人信息处理的真实授权和最小范围",
          "requirement": "R024 个人信息处理的真实授权和最小范围；A1–A6，拟读取/转交健康证明或学生明细时。T：M020 可验证目的/依据/范围且材料已最小化；F：当前读者或数据范围与授权不符；U：处理依据尚未确定；SRC-013 第 6、13、19、21、28–30、51 条；F023/F032/F035；M007/M020（实际涉及敏感数据时）；只核有权处理前提，不从政策文字推断“所有成绩天然属法定敏感”；无学校授权时采用去标识数量/时段，暂停原件入模和外部流转；T PASSFACT →数据控制者；F CONFLICT →权限/安全 Owner；U POLICYUNCONFIRMED/SOURCEUNAVAILABLE →数据治理岗；不涉及个人明细 NOTAPPLICABLE",
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
      "name": "延期申请与目标成绩/教学任务定位（A0–A1）",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "evidence-review",
      "workflowOwner": "local"
    },
    {
      "id": "evidence-review",
      "name": "身份、当前成绩状态、截止日期证据与例外事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "intake",
      "nextStageId": "human-confirmation",
      "workflowOwner": "local"
    },
    {
      "id": "human-confirmation",
      "name": "当前校规、延期权限和正式决定人工确认",
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
  "templateId": "T01-T07",
  "name": "教师成绩录入延期申请审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T01-T07.md",
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/T01-T07.md",
  "sourceDocumentBytes": 135921,
  "sourceDocumentSha256": "661431f9fd434dd8ce35c1ccc080f67cd7b38fdefcd45fc2807e58db9b8435f6",
  "sourceHashBasis": "dispatch manifest SHA-256; verified against original UTF-8 bytes plus one final LF",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyStatusRaw": "PARTIALLY_VERIFIED：本科成绩评定及提交时限有校本依据；独立延期受理事项、例外条件、延期审批权及现行操作表单尚未证实",
  "policyEvidenceStatus": "PARTIAL",
  "criteria": [
    {
      "sectionId": "evidence-checks",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-001",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-006",
        "SRC-008",
        "SRC-010",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-001",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "CDUT-VERIFIED；成都理工大学（校长办公室印发），《关于印发〈成都理工大学本科课程教学基本规范〉的通知》，成理校教〔2022〕11号及所附规范；校内政策汇编 PDF (https://cnae.cdut.edu.cn/local/B/CD/55/1347E45BA0243810CF9A9F4D250EAEE3C5577A641.pdf)，PDF 第 19–30 页（内页 15–26）；重点第 15、17、19、20、30、34、35、43、44 条，特别是 PDF 第 28–29 页（内页 24–25）；2022-06-04 印发；第 43 条规定自印发之日起实施，明文废止 2018 年本科教师教学工作规范；本文件后续是否另修订待核",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-002",
      "title": "CDUT-VERIFIED；成都理工大学教务处，《关于做好2024—2025学年第二学期期末课程考试安排及监巡考工作的通知》/教通字〔2025〕25号（以 PDF 号文为准）；教务处通知 PDF (https://www.aao.cdut.edu.cn/local/A/A9/09/0D8AFAFE17938B772AAD0DE080319FDF4503E3B5.pdf)，第 2–3 页，尤其第四部分第 1、4 项；2025-06-23；限 2024—2025-2 当期；载明考试于 2025-07-12 前结束、成绩于 2025-07-26 前（不包括 26 日）全部上传；不作以后学期普适节点",
      "url": "https://www.aao.cdut.edu.cn/__local/A/A9/09/0D8AFAFE17938B772AAD0DE0803_19FDF450_3E3B5.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-003",
      "title": "CDUT-VERIFIED；成都理工大学传播科学与艺术学院，《传播科学与艺术学院考务工作规范（试行）》；学院官网正文 (https://ccsa.cdut.edu.cn/info/1034/1892.htm)，成绩管理第（三）项及考试材料上交要求；网页 2023-02-22；试行，未见终止日期，当前适用性及是否有后续学院修订待核",
      "url": "https://ccsa.cdut.edu.cn/info/1034/1892.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-004",
      "title": "CDUT-VERIFIED；成都理工大学宜宾校区，《教务工作部部门职责》；宜宾校区官网 (https://yb.cdut.edu.cn/info/1091/4509.htm)，第一项“本科教学运行与教学事务管理”等；2026-04-10；岗位职责持续时间未说明",
      "url": "https://yb.cdut.edu.cn/info/1091/4509.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-005",
      "title": "CDUT-VERIFIED；成都理工大学机电工程学院，《机电工程学院新进教师教学规范培训会顺利召开》；学院官网 (https://mee.cdut.edu.cn/info/1050/3438.htm)，关于新教师培训及成绩提交；2026-01-28（记载 2026-01-07 活动）；新闻性质，无规范生效条款",
      "url": "https://mee.cdut.edu.cn/info/1050/3438.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-006",
      "title": "CURRENTITY-UNKNOWN；成都理工大学，《成都理工大学课程考核管理规定》，成理校教〔2017〕28号；校内政策汇编 PDF (https://cnae.cdut.edu.cn/local/B/CD/55/1347E45BA0243810CF9A9F4D250EAEE3C5577A641.pdf)，PDF 第 59–68 页（内页 55–64），第 11、28、29、34、35 条；2017-12-05；第 34 条自发布之日起实施并废止 2012 版。截至 2026 的完整现行性未核实，2022 规范仍提到补录/更正程序",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-007",
      "title": "CDUT-VERIFIED；成都理工大学档案馆（校史馆），《关于做好2026年归档工作的通知》；档案馆官网 (https://dag.cdut.edu.cn/info/1076/2086.htm)，第二部分第 2 项；2026 年通知（网站检索显示 2026 年发布，具体网页日期待复核）；2026 年归档时段",
      "url": "https://dag.cdut.edu.cn/info/1076/2086.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-008",
      "title": "CDUT-VERIFIED；成都理工大学教务处，教通字〔2025〕59号《关于做好2025—2026学年第一学期期末课程考试安排及相关工作的通知》（描述性检索标题，精确标题待与发文登记核对）；教务处原件 PDF (https://aao.cdut.edu.cn/local/F/02/A6/0340BCDBCC4E8B384C66750E7B30949CB5E42625.pdf)，第 3 页第四部分第 4–5 项、末尾落款；2025-12-25；仅 2025—2026-1 学期。课程考试应于 2026-01-23 前结束，成绩于 2026-02-07 前上传；随后列 2026-03-04/05 补缓考时段；未核后续替代或例外授权",
      "url": "https://aao.cdut.edu.cn/__local/F/02/A6/0340BCDBCC4E8B384C66750E7B3_0949CB5E_42625.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-009",
      "title": "CURRENTITY-UNKNOWN；成都理工大学教务处，《科室设置》“教学事务中心”；教务处官方科室页 (https://aao.cdut.edu.cn/jgsz/kssz.htm)，教学运行、考试/成绩、教务系统职责段；页面公开日期/岗位授权生效日不明；2026-10-23 原页 HTTP 412，公开检索缓存仍显示相关职责",
      "url": "https://aao.cdut.edu.cn/jgsz/kssz.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-010",
      "title": "CDUT-VERIFIED；成都理工大学，成理校研〔2021〕12号《研究生培养环节管理办法（试行）》；原始 PDF (https://energy.cdut.edu.cn/local/B/66/CD/D11DA75E84C7FCDD25CBC557422EF1ADD3A555F8.pdf)，PDF 第 2 页第 2 条、第 4 页第 8 条；2021-06-09 印发，后续现行性待核；2026-10-23 原始 PDF 可读",
      "url": "https://energy.cdut.edu.cn/__local/B/66/CD/D11DA75E84C7FCDD25CBC557422_EF1ADD3A_555F8.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-011",
      "title": "CDUT-VERIFIED；成都理工大学教务处，教通字〔2025〕45号《2025—2026学年第二学期教学任务安排及课表编排的工作通知》；原始 PDF (https://aao.cdut.edu.cn/local/6/D0/6E/D73FB595B334A89DCC3AB9C55E8B2D0E7C327504.pdf)，PDF 第 1–2 页“教学任务实施原则”第 1、2、5 项；2025-10-29，仅该学期任务安排；2026-10-23 原始 PDF 可读",
      "url": "https://aao.cdut.edu.cn/__local/6/D0/6E/D73FB595B334A89DCC3AB9C55E8_B2D0E7C3_27504.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-012",
      "title": "CURRENTITY-UNKNOWN；成都理工大学《研究生课程建设及课程管理办法（暂行）》；学院官方转载页 (https://cnae.cdut.edu.cn/info/1040/1425.htm)，第 17、26 条为公开检索线索；2026-10-23 直开 HTTP 412；检索记录提示 2018 年 1 月起施行、旧规废止，但正文与后续修订未重新核全",
      "url": "https://cnae.cdut.edu.cn/info/1040/1425.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-013",
      "title": "GENERAL-RESEARCH（国家法律原文已核；不是校本延期制度）；全国人大常委会《中华人民共和国个人信息保护法》；中央网信办转载法律全文 (https://www.cac.gov.cn/2021-08/20/c1631050028355286.htm)，第 6、13、19、21、28–30、51 条；2021-08-20 通过，自 2021-11-01 实施；2026-10-23 正文可读",
      "url": "https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-014",
      "title": "GENERAL-RESEARCH（教育部规章，不是校本延期许可）；教育部令第 41 号《普通高等学校学生管理规定》；教育部发布页 (https://www.moe.gov.cn/srcsite/A02/s5911/moe621/201702/t20170216296385.html)，第 18 条；2026-10-23 搜索索引核得内容，直开页/PDF 出现跳转限制；2017-02-04 公布，2017-09-01 起施行；现行修订由教育部核定",
      "url": "https://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201702/t20170216_296385.html",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = T01T07_TEMPLATE
