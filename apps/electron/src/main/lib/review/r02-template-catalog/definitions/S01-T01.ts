import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "S01-T01",
  "version": 1,
  "schemaVersion": 2,
  "name": "学生休学资格与材料审核",
  "description": "本地研究模板 · 非校方正式模板。用于“学生休学资格与材料审核”的事实、材料和来源核验；未确认政策条件一律进入本地人工复核，不产生校方正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 非成都理工大学校方正式模板；源文档 docs/design/review-agent/business-templates/R02/S01-T01.md；SHA-256 8d36d9e209c343a9eba09b4a1d24fc8e74b3329cb906893d8ef8723e773651f6；研究/政策证据状态 PARTIAL。校方现行规则、特殊身份适用及签批权限未完全确认；不得生成校方正式批准/拒绝，不连接学校远端回写。",
  "objectType": "person",
  "displayName": {
    "template": "S01-T01 · 学生休学资格与材料审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · caseId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F001。原始定义：`caseId:string` / LeaveApplication | current；Main/Case 服务生成 | 案卷受控元数据；M002/M023 关联 | 内 | 系统未建案阻断核验，不由上传文件生成权威案号。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F001；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F002",
      "label": "F002 · applicationRev",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F002。原始定义：`applicationRev:int+hash` / LeaveApplication | current；受控版本日志 | 案卷事件与 M002、M021、M023 版本 | 内 | 缺版本则暂停替换/重审；不能覆盖旧申请。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F002；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F003",
      "label": "F003 · studentKey",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F003。原始定义：`studentKey:string` / StudentEnrollment | current；校学籍身份主键/受控查询 | M001 主键、M002 自报学号比对 | 敏 | 先核学校记录；失联 `SOURCE_UNAVAILABLE`，多主体 `CONFLICT`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F003；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F004",
      "label": "F004 · studentName",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F004。原始定义：`studentName:string` / StudentEnrollment | current；校方学籍权威姓名 | M001 与 M002 姓名位 | 个 | 自报不一致 `CONFLICT`，交 G01，不在本案纠正。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F004；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F005",
      "label": "F005 · enrollmentStatus",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F005。原始定义：`enrollmentStatus:enum` / StudentEnrollment | current；权威学籍状态与版本 | M001 当前注册/休学/退学字段 | 敏 | 源缺 `SOURCE_UNAVAILABLE`；非在籍/已生效休学先人工分流。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F005；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F006",
      "label": "F006 · level",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F006。原始定义：`level:enum{UG,MA,PhD,other}` / StudentEnrollment | current；校方培养层次 | M001 学段字段 | 个 | 不明则 `POLICY_UNCONFIRMED`，不可默认本科。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F006；本地研究字段，不代表校方正式表单或已接通数据接口。",
      "options": [
        {
          "value": "UG",
          "label": "UG"
        },
        {
          "value": "MA",
          "label": "MA"
        },
        {
          "value": "PhD",
          "label": "PhD"
        },
        {
          "value": "other",
          "label": "other"
        }
      ]
    },
    {
      "key": "F007",
      "label": "F007 · studyMode",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F007。原始定义：`studyMode:enum` / StudentEnrollment | current；招生/学籍权威培养形式 | M001 全/非全、学历与否字段 | 个 | 证据冲突人工核，勿将非全研究生排除 [SRC-002]。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F007；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F008",
      "label": "F008 · internationalCategory",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F008。原始定义：`internationalCategory:enum` / StudentEnrollment | current；校方来华留学/港澳台等身份记录 | M001 与 M014 项目登记 | 敏 | 不明走 I/X 未决，不凭国籍截图直接选条例。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F008；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F009",
      "label": "F009 · programId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F009。原始定义：`programId:string?` / StudentEnrollment | conditional；校方中外合作/联合项目名录 | M001/M014 项目、培养协议的权威引用 | 个 | 特殊项目缺项先 `POLICY_UNCONFIRMED`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F009；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F010",
      "label": "F010 · collegeId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F010。原始定义：`collegeId:string` / StudentEnrollment | current；校方所属学院/培养单位 | M001 学生归属字段 | 个 | 缺学院先查系统，非学生自行选择签批机构。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F010；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F011",
      "label": "F011 · actorRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F011。原始定义：`actorRef:string+role` / LeaveApplication | current；Host/Main 可信认证会话 | M002 提交留痕/M007 发起留痕 | 敏 | 未认证不得接受代签；Renderer 传入角色一律不可信。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F011；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F012",
      "label": "F012 · delegationScope",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F012。原始定义：`delegationScope:object?` / LeaveApplication | conditional；授权核实后的代理范围 | M015 双方身份与学校审核结论 | 敏 | 代理时未核权限 `POLICY_UNCONFIRMED`，不能推定家长可撤回。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F012；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F013",
      "label": "F013 · requestedAction",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F013。原始定义：`requestedAction:enum` / LeaveApplication | current；本人申请或学校有权发起记录 | M002 申请类型/M007 意见类型 | 内 | 休学与保留学籍混写则 `CONFLICT` 并转路由。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F013；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F014",
      "label": "F014 · triggerOrigin",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F014。原始定义：`triggerOrigin:enum` / LeaveApplication | current；本人/校方受控提交事件 | M002 或 M007 的来源与提交人 | 内 | 学校强制触发未见正式记录，则仅保留学生叙述。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F014；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F015",
      "label": "F015 · reasonKind",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F015。原始定义：`reasonKind:enum+multi` / GroundClaim | current；本人/学校声明，待证 | M002 事由项；M003、M004、M006–M010 | 敏 | 无原因要求补写；不将“家庭原因”等映射为自动准入。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F015；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F016",
      "label": "F016 · reasonNarrative",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F016。原始定义：`reasonNarrative:string?` / GroundClaim | current；学生说明/校方启动报告 | M002 说明栏或 M003 附记、M007 | 敏 | 解释不足标 `NEEDS_MATERIAL`；可与表内说明合并。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F016；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F017",
      "label": "F017 · submittedAt",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F017。原始定义：`submittedAt:datetime` / LeaveApplication | current；受控接收时戳 | M002 受理流水/提交事件 | 内 | 时间不可验证先核受理记录，不凭文件创建日期判断截止。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F017；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F018",
      "label": "F018 · termId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F018。原始定义：`termId:string` / StudyPeriod | current；校历/学籍部门 | M013 学期标识、M006 请假归属 | 内 | 源不可用标 `SOURCE_UNAVAILABLE`，避免跨学期叠加。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F018；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F019",
      "label": "F019 · termStart",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F019。原始定义：`termStart:date` / StudyPeriod | conditional；校方当期校历与受理口径 | M013 开学日/本科及 I1 受理起算依据 | 内 | 影响两周窗口时源缺则不作自动逾期否决。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F019；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F020",
      "label": "F020 · requestedStart",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F020。原始定义：`requestedStart:date` / LeaveApplication | current；申请主张 | M002 拟休学开始日期 | 个 | 缺则补件；不得自动写成审批生效日。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F020；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F021",
      "label": "F021 · requestedEnd",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F021。原始定义：`requestedEnd:date` / LeaveApplication | current；申请主张 | M002 拟休学结束日期 | 个 | 缺则补件；到期日需等待 L4 决定确认。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F021；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F022",
      "label": "F022 · requestedDuration",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F022。原始定义：`requestedDuration:duration` / LeaveApplication | current；由 F020–021 计算并人工核口径 | M002 申请拟期、M013 校历 | 个 | 日期矛盾 `CONFLICT`；计“学年/自然年”口径待政策核。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F022；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F023",
      "label": "F023 · priorLeaveCount",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F023。原始定义：`priorLeaveCount:int` / LeaveHistory | conditional；校方历史休学批准记录 | M011 历次已生效决定与学籍事件 | 敏 | 无接口先找归口核实，绝不拿学生自填次数作阈值。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F023；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F024",
      "label": "F024 · priorApprovedDuration",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F024。原始定义：`priorApprovedDuration:duration` / LeaveHistory | conditional；校方历史决定 | M011 起止与累计口径 | 敏 | 若记录不全 `SOURCE_UNAVAILABLE`，不能推断零次。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F024；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F025",
      "label": "F025 · maxStudyPeriod",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F025。原始定义：`maxStudyPeriod:date/duration` / StudyPeriod | conditional；校方学籍期限记录 | M012 批准修业年限与例外决定 | 敏 | 空缺不判超期，创业延长需专门正式授权。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F025；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F026",
      "label": "F026 · approvedAbsenceTotal",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F026。原始定义：`approvedAbsenceTotal:duration` / GroundClaim | conditional；学校已批准请假台账 | M006 本学期逐条请假及批准状态 | 敏 | 拒绝自行累加未批准缺课；来源失联转人工。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F026；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F027",
      "label": "F027 · medicalRestDuration",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F027。原始定义：`medicalRestDuration:duration?` / GroundClaim | conditional；实际医疗证明所载需要休养时间 | M004 诊断/建议休息栏 | 敏 | 无诊断或模糊 `NEEDS_MATERIAL/UNREADABLE`，专业判断交人。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F027；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F028",
      "label": "F028 · medicalIssuer",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F028。原始定义：`medicalIssuer:string+grade?` / GroundClaim | conditional；校医院/二级甲等及以上医院原件核验 | M004 机构章、M005 发证核验回复 | 敏 | 等级/真实性未验则待专业/人工作业，不推测医院级别。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F028；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F029",
      "label": "F029 · medicalIssuedAt",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F029。原始定义：`medicalIssuedAt:date` / GroundClaim | conditional；医疗证明 | M004 签发日期、M005 回执 | 敏 | 日期缺或矛盾先核证；现行有效期并无统一校本天数可套。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F029；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F030",
      "label": "F030 · projectReasonDetail",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F030。原始定义：`projectReasonDetail:object?` / GroundClaim | conditional；申请人说明 + 适用单位证明 | M008 创业/M009 出国学习等当前证据 | 敏 | 证明样式待校方确认；缺时列待核而不虚构营业执照必交。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F030；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F031",
      "label": "F031 · schoolGroundFinding",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F031。原始定义：`schoolGroundFinding:string?` / GroundClaim | conditional；学校有权部门明确提出 | M007 启动材料、M024 人工核验意见 | 敏 | “特殊原因/秩序风险”仅经权威认定，模型不能据传闻填充。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F031；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F032",
      "label": "F032 · policyEdition",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F032。原始定义：`policyEdition:string+status` / ReviewVerification | current；有来源版本和适用范围的政策登记 | M014 专项政策、M016 统一政策索引 | 内 | 不能确认适用现行版本即 `POLICY_UNCONFIRMED`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F032；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F033",
      "label": "F033 · evidenceManifest",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F033。原始定义：`evidenceManifest:ref[]` / EvidenceVersion | current；案卷附件仓/可信数据读取日志 | 全部 M001–M024 的所有权、哈希、版本、时间 | 敏 | 缺归属与版本则不允许复用、重审、绑定他案。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F033；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F034",
      "label": "F034 · evidenceConflict",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F034。原始定义：`evidenceConflict:ref[]` / ReviewVerification | conditional；已观察事实差异与源版本 | M023 对比详情、M024 核验日志 | 敏 | 不可私自“选最新图”解决；逐项形成 `CONFLICT`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F034；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F035",
      "label": "F035 · sourceCheckState",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F035。原始定义：`sourceCheckState:enum+timestamp` / ReviewVerification | current；受控读取/人工核验结果 | M005/M024 校验路径及断连日志 | 内 | 读取失败 `SOURCE_UNAVAILABLE`，上传不可读 `UNREADABLE`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F035；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F036",
      "label": "F036 · authorizingActor",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F036。原始定义：`authorizingActor:ref?` / LeaveDecision | later；学校有效授权与岗位后台认证 | M017 决定签批、M024 事实意见不可替代 | 敏 | L1–L3 必须空；无认证签批不显示正式批准。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F036；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F037",
      "label": "F037 · leaveDecisionId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F037。原始定义：`leaveDecisionId:string?` / LeaveDecision | later；正式批准/不批准决定登记 | M017 文号/编号与原决定原件 | 敏 | 无真实决定不得生成 `approved=true`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F037；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F038",
      "label": "F038 · decisionEffectiveAt",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F038。原始定义：`decisionEffectiveAt:datetime?` / LeaveDecision | later；决定本身的有效日期与学校签发留痕 | M017 日期及核验事件 | 内 | 不能用申请日/退宿日代填。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F038；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F039",
      "label": "F039 · enrollmentMutation",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F039。原始定义：`enrollmentMutation:ref?` / EnrollmentChange | later；校学籍权威系统事件 | M018 变更前后状态、事件版本 | 敏 | 无变更时不改 F005；决定与状态不一致先核对。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F039；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F040",
      "label": "F040 · downstreamReceipts",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F040。原始定义：`downstreamReceipts:ref[]` / DownstreamReceipt | later；财务、宿舍、资助服务各自办理回执 | M019/M020 执行事件 | 敏 | L1 不报缺件；批准后失联产生独立转办待办。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F040；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F041",
      "label": "F041 · withdrawOrAmendRequest",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F041。原始定义：`withdrawOrAmendRequest:ref?` / WithdrawalOrReviewRequest | conditional；已认证本人或有权代理/学校事件 | M021 请求、关联旧 F002 申请版本 | 敏 | 仅记录请求，是否受理或撤销须另查归口程序。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F041；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F042",
      "label": "F042 · reviewAppealRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F042。原始定义：`reviewAppealRef:ref?` / WithdrawalOrReviewRequest | later；有权机关收件/决定登记 | M022 申诉书与原 F037 决定 | 敏 | 无原决定不能冒充正式申诉；时限/主管机关待核。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F042；本地研究字段，不代表校方正式表单或已接通数据接口。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 本人学籍身份/可用身份",
      "purpose": "在籍学籍快照、学段、培养形式、国别/项目、学院；**L0 当前必需（权威事实，非学生上传）**",
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
      "maxCount": 50,
      "requiredElements": [
        "在籍学籍快照、学段、培养形式、国别/项目、学院；**L0 当前必需（权威事实，非学生上传）**"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 休学申请意思表示",
      "purpose": "现用休学表/书面受理申请、理由与拟期；**本人主动申请 L1 当前必需**；校方启动 P3/P4/R2 时不是必须先有学生签署的申请",
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
      "maxCount": 50,
      "requiredElements": [
        "现用休学表/书面受理申请、理由与拟期；**本人主动申请 L1 当前必需**；校方启动 P3/P4/R2 时不是必须先有学生签署的申请"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 · 事由附加说明",
      "purpose": "补充叙述、具体起因及可核情节；**条件必需**（M002 不能表达事实或需要额外说明时）",
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
      "maxCount": 50,
      "requiredElements": [
        "补充叙述、具体起因及可核情节；**条件必需**（M002 不能表达事实或需要额外说明时）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 · 医疗原因、建议停课休养时长",
      "purpose": "医疗诊断/建议证明，具体范围依校本条例；**条件必需**（因病伤申请需医学佐证，特别是调用 >6 周强制触发时；一般因病申请最终材料形态待核）",
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
      "maxCount": 50,
      "requiredElements": [
        "医疗诊断/建议证明，具体范围依校本条例；**条件必需**（因病伤申请需医学佐证，特别是调用 >6 周强制触发时；一般因病申请最终材料形态待核）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 · 医疗出具来源验真",
      "purpose": "医院发证核验回复/线下核对留痕；**条件必需**（证据来源存疑或有权部门规定验证时；常规何时强制未知）",
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
      "maxCount": 50,
      "requiredElements": [
        "医院发证核验回复/线下核对留痕；**条件必需**（证据来源存疑或有权部门规定验证时；常规何时强制未知）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 · 本学期已批准请假及累计",
      "purpose": "每次请假批准、起止、状态和校历归属；**条件必需**（P3/R2 以及 I1 的累计请假触发）",
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
      "maxCount": 50,
      "requiredElements": [
        "每次请假批准、起止、状态和校历归属；**条件必需**（P3/R2 以及 I1 的累计请假触发）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "M007 · 学校启动必须休学核办的正式事实",
      "purpose": "校方受控发起意见、教学秩序/特殊原因核办事实；**条件必需**（校方启动的 P3/P4/R2）",
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
      "maxCount": 50,
      "requiredElements": [
        "校方受控发起意见、教学秩序/特殊原因核办事实；**条件必需**（校方启动的 P3/P4/R2）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 · 自主创业事由",
      "purpose": "创业计划、参与/经营事实等**形态待校方规定**；**条件必需**（P2/R1/R3 以创业为理由）",
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
      "maxCount": 50,
      "requiredElements": [
        "创业计划、参与/经营事实等**形态待校方规定**；**条件必需**（P2/R1/R3 以创业为理由）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 · 出国出境或国外学习事由",
      "purpose": "邀请、录取、派出/交流项目说明等**形态待校方确认**；**条件必需**（P2/R1 涉出境学习）",
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
      "maxCount": 50,
      "requiredElements": [
        "邀请、录取、派出/交流项目说明等**形态待校方确认**；**条件必需**（P2/R1 涉出境学习）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 家庭、经济或其他具体事由",
      "purpose": "必要说明和校方按个案认可的证据（**未核定统一清单**）；**条件必需**（以特殊非医疗理由申请且 M003 不足）",
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
      "maxCount": 50,
      "requiredElements": [
        "必要说明和校方按个案认可的证据（**未核定统一清单**）；**条件必需**（以特殊非医疗理由申请且 M003 不足）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 既往休学与复学、已批准期间",
      "purpose": "历次真实决定、变更事件与期间；**条件必需**（再次申请、可能达年限/次数上限，亦用于一般申请的历史校方核对）",
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
      "maxCount": 50,
      "requiredElements": [
        "历次真实决定、变更事件与期间；**条件必需**（再次申请、可能达年限/次数上限，亦用于一般申请的历史校方核对）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 最长修业期限/特例批准",
      "purpose": "已有期限及变更的可验记录；**条件必需**（期限校核、R3/续期/临界年限）",
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
      "maxCount": 50,
      "requiredElements": [
        "已有期限及变更的可验记录；**条件必需**（期限校核、R3/续期/临界年限）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 · 学期开学日与请假时段口径",
      "purpose": "当期校历、开学通知及所适用注册学期；**条件必需**（P2/I1 开学两周、P3/R2 请假归属）",
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
      "maxCount": 50,
      "requiredElements": [
        "当期校历、开学通知及所适用注册学期；**条件必需**（P2/I1 开学两周、P3/R2 请假归属）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 特殊身份和项目适用政策",
      "purpose": "中外合作办学、来华留学、港澳台等适用声明和现行制度原件；**条件必需**（I1/I2/X1 以及其他确有特殊学籍身份者）",
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
      "maxCount": 50,
      "requiredElements": [
        "中外合作办学、来华留学、港澳台等适用声明和现行制度原件；**条件必需**（I1/I2/X1 以及其他确有特殊学籍身份者）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 代理资格与委托范围",
      "purpose": "经学校认可的委托/监护或校方代发起依据；**条件必需**（X2 真有代理时）",
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
      "maxCount": 50,
      "requiredElements": [
        "经学校认可的委托/监护或校方代发起依据；**条件必需**（X2 真有代理时）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 本案适用政策与时效来源",
      "purpose": "SRC 引用、正式文件版本与“当前适用”人工确认；**L0 当前必需（机构持有，不由学生上传）**",
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
      "maxCount": 50,
      "requiredElements": [
        "SRC 引用、正式文件版本与“当前适用”人工确认；**L0 当前必需（机构持有，不由学生上传）**"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 · 真实批准/不批准休学决定",
      "purpose": "受控审批结果、正式文书及可验签批；**L4 后续才产生**",
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
      "maxCount": 50,
      "requiredElements": [
        "受控审批结果、正式文书及可验签批；**L4 后续才产生**"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "M018 · 真实学籍状态变更",
      "purpose": "已批准后的状态更新与校内留痕；**L5 后续才产生**",
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
      "maxCount": 50,
      "requiredElements": [
        "已批准后的状态更新与校内留痕；**L5 后续才产生**"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "M019 · 休学后退宿/离校办理",
      "purpose": "退宿、离校后续回执；**L5 后续才产生**",
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
      "maxCount": 50,
      "requiredElements": [
        "退宿、离校后续回执；**L5 后续才产生**"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "M020 · 休学后财务/资助调整",
      "purpose": "已生效休学后财务或助学金处理记录；**L5 后续才产生**",
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
      "maxCount": 50,
      "requiredElements": [
        "已生效休学后财务或助学金处理记录；**L5 后续才产生**"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "M021 · 改期、补充或撤回请求",
      "purpose": "有认证的请求、原申请及拟变更内容；**条件必需**（X2 触发后）",
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
      "maxCount": 50,
      "requiredElements": [
        "有认证的请求、原申请及拟变更内容；**条件必需**（X2 触发后）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "M022 · 复核/申诉请求和原决定",
      "purpose": "申诉书、原决定 ID、送达时点及受理/处理意见；**L4/L6 后续才产生**",
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
      "maxCount": 50,
      "requiredElements": [
        "申诉书、原决定 ID、送达时点及受理/处理意见；**L4/L6 后续才产生**"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "M023 · 补件和材料替换版本链",
      "purpose": "旧/新材料哈希、关联规则、补件要求与提交结果；**条件必需**（实际补件/变更发生后）",
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
      "maxCount": 50,
      "requiredElements": [
        "旧/新材料哈希、关联规则、补件要求与提交结果；**条件必需**（实际补件/变更发生后）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "M024 · 有权人员事实核验及行政裁量意见",
      "purpose": "医疗验真、特殊原因、版本与冲突核查留痕；**条件必需**（L2/L3 出现高影响争议，或有权流程要求时）",
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
      "maxCount": 50,
      "requiredElements": [
        "医疗验真、特殊原因、版本与冲突核查留痕；**条件必需**（L2/L3 出现高影响争议，或有权流程要求时）"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules-01",
      "name": "8.2 L0–L1：身份、事项、申请及初始时点",
      "description": "对应源 Markdown 的 08 规则分组；分项内所有结论仅为本地研究预审。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "可信操作身份 L0/L1，任一进入/提交案件的真实 Actor",
          "requirement": "原稿规则编号/标题：**R001 可信操作身份** L0/L1，任一进入/提交案件的真实 Actor；触发/适用：T：受控会话真实且有此案操作权限；F：Actor 被校方确证不匹配；U：认证或授权查不到；来源、字段及材料关联：SRC-004 §25（授权边界）、SRC-002 §23；F001/F003/F011/F012；M002/M007/M015；核验要求：Host/Main 校验会话主体、动作、组织、学段和有效时间；不采信 Renderer `role/approverId`。代理权限未有校本细则时不得判断其可代撤回；结果与下一步：T=`PASS_FACT`（仅认证事实）；F=`CONFLICT`；U=认证源不可用 `SOURCE_UNAVAILABLE` / 代理范围未核 `POLICY_UNCONFIRMED`；下一人：身份/学籍管理、对应经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "在籍及同一主体 L0，S01 休学路由",
          "requirement": "原稿规则编号/标题：**R002 在籍及同一主体** L0，S01 休学路由；触发/适用：T：学校权威学籍存在且可按适用规定受理休学事实预审；F：明示尚未注册、已退学或属不在本 ID 的身份；U：权威记录未取得；来源、字段及材料关联：SRC-001 §2/4–6、SRC-002 §2/5–6、SRC-004 §10/25；F003/F005/F006/F007；M001；核验要求：只从 A 级学籍快照判断；F 的明确排除走 X5，不自动改学籍状态；在校注册但当前处“休学中”须改走 R030 的续休/历史核对；结果与下一步：T=`PASS_FACT`；F=`NOT_APPLICABLE`（本事项路由）；U=`SOURCE_UNAVAILABLE`；下一人：学籍归口/路由经办",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "证据人与学籍主体匹配 L0–L2，有申请/医学/其他个人附件",
          "requirement": "原稿规则编号/标题：**R003 证据人与学籍主体匹配** L0–L2，有申请/医学/其他个人附件；触发/适用：T：F003 主键、姓名及可核附件持有人一致；F：经权威核证为他人或双主体；U：同名无唯一键、照片不可读；来源、字段及材料关联：SRC-001 §57、SRC-002 §42、SRC-011（仅 G01 技术对照）；F003/F004/F033/F034；M001/M002/M004/M015；核验要求：A 级学籍主键优先于 C 级表上姓名；更名必须引用真实校方 G01 权威结论，不能本 ID 写改名；M004 健康材料只核必要身份字段；结果与下一步：T=`PASS_FACT`；F=`CONFLICT`；U=附件糊 `UNREADABLE` / 主数据断连 `SOURCE_UNAVAILABLE`；下一人：学籍经办/G01 身份更正归口",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "学段、培养形式与特殊类别分流 L0，全部初次/再次申请",
          "requirement": "原稿规则编号/标题：**R004 学段、培养形式与特殊类别分流** L0，全部初次/再次申请；触发/适用：T：本科、硕/博、全/非全、来华及项目身份有受控记录且分支明确；F：明确不是此类学历休学主体；U：多重身份优先级不明；来源、字段及材料关联：SRC-001 §2、SRC-002 §2、SRC-003 §3/71、SRC-014/015（仅目录）；F006–F010；M001/M014；核验要求：校学籍/招生主数据 A；国际生+研究生/中外项目先停 I2/X1，而非按常识选普通本科规则；港澳台侨的参照关系须校方确认；结果与下一步：T=`PASS_FACT`（身份事实）；F=`NOT_APPLICABLE`（转路由）；U=`POLICY_UNCONFIRMED` 或 A 级源失联 `SOURCE_UNAVAILABLE`；下一人：研究生院/教务/国际归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "现行政策与权限依据 L0–L4，所有涉及校本时限、资格或审批的检查",
          "requirement": "原稿规则编号/标题：**R005 现行政策与权限依据** L0–L4，所有涉及校本时限、资格或审批的检查；触发/适用：T：已由校方主管核对本案学段的有效条文、修订链和授权范围；F：现持条文明确已废止/不适用；U：存在新版本线索或无现行确认；来源、字段及材料关联：SRC-001/002/003/004/008/012/013/014/015；F008/F009/F032/F035；M014/M016；核验要求：校方原文+生效/废止和实际适用双轴，`SRC-013` 已废止；SRC-015 是 2026 目录**未读全文**；不因同名/公布日期较新就猜具体规则；结果与下一步：T=`PASS_FACT`（仅政策适用事实）；F/U=`POLICY_UNCONFIRMED`，明文冲突另记 `CONFLICT`；下一人：制度主管部门，**阻断 R010–R020 未确认阈值硬判**",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "休学与邻接事项路由 L0，申请动作明确",
          "requirement": "原稿规则编号/标题：**R006 休学与邻接事项路由** L0，申请动作明确；触发/适用：T：事项为本 ID 休学而非保留学籍/保留入学资格/复学/退学；F：有权记录证明属于别的决定对象；U：旧混用表未勾清类型；来源、字段及材料关联：SRC-001 §5–6/38–40、SRC-002 §21/25/28、SRC-004 §25/27、SRC-005；F005/F013/F014；M001/M002/M009/M014；核验要求：校本决定类型优先于表名；入伍与跨校联合培养按适用制度“保留学籍”路线；缺邻接 R02 精确 ID 时人工路由，不另造模板；结果与下一步：T=`PASS_FACT`；F=`NOT_APPLICABLE`；U=`NEEDS_MATERIAL`（申请意向不清）/`POLICY_UNCONFIRMED`（项目分类不明）；下一人：学籍路由经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "申请/学校启动依据 L1，已确认路由",
          "requirement": "原稿规则编号/标题：**R007 申请/学校启动依据** L1，已确认路由；触发/适用：T：本人申请有可核当前版本和受理事实，或校方要求休学有真实启动依据；F：被确认系非本人伪签/非授权发起；U：缺提交证据/形式未核；来源、字段及材料关联：SRC-001 §38/41、SRC-002 §21–23、SRC-005/006/007（表单现行性未知）；F001/F002/F011/F013/F014/F017；M002/M007/M015；核验要求：M002 只对本人主动申请当前必需；P3/P4/R2 校方正式发起可先有 M007。签字、线上入口、代办程序依当期校本确认；结果与下一步：T=`PASS_FACT`；F=`CONFLICT`；U=本应提交但没有 `NEEDS_MATERIAL` / 表单现行性未知 `POLICY_UNCONFIRMED`；下一人：学生或校方发起者/受理处",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "事由主张与证明匹配 L1/L2，主动申请或有校方事由",
          "requirement": "原稿规则编号/标题：**R008 事由主张与证明匹配** L1/L2，主动申请或有校方事由；触发/适用：T：已记录具体事由并能定位相应当前证据；F：申请类型与主证明实际事项矛盾；U：理由未陈述或所需形态不明；来源、字段及材料关联：SRC-001 §38/41、SRC-002 §21/22、SRC-003 §35/38、SRC-005；F015/F016/F030/F031；M002/M003/M004/M006/M008/M009/M010/M007；核验要求：按医疗/已批准请假/创业/出境/其他事由分别映射；**“可提交事由”不等于“充分获准”**。M003 可由 M002 理由栏替代；家庭证明形式未知不强制特定文件；结果与下一步：T=`PASS_FACT`（已对位事实）；F=`CONFLICT`；U=叙述缺 `NEEDS_MATERIAL` / 适用类型未知 `POLICY_UNCONFIRMED`；下一人：本人、学院经办、必要时有权裁量者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "拟休学时间自洽 L1/L2，主动申请已提供拟起止",
          "requirement": "原稿规则编号/标题：**R009 拟休学时间自洽** L1/L2，主动申请已提供拟起止；触发/适用：T：起止可读、起不晚于止且时长计算有确定口径；F：起止颠倒/相互矛盾；U：日期缺失或无法读取；来源、字段及材料关联：SRC-001 §38、SRC-002 §23、SRC-003 §35；F020/F021/F022；M002/M013；核验要求：C 级申请日期可核内部算术但不是批准日期；自然年/学年边界计算口径须相应现行政策确认；申请修改必须绑定 F002 新版本；结果与下一步：T=`PASS_FACT`（日期关系）；F=`CONFLICT`；U=空 `NEEDS_MATERIAL`、字迹糊 `UNREADABLE`、期限口径未知 `POLICY_UNCONFIRMED`；下一人：申请学生/受理经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "非病因受理时点 L1–L3，P2 或已确认适用该条的 I1，且 F015 非病因",
          "requirement": "原稿规则编号/标题：**R010 非病因受理时点** L1–L3，P2 或已确认适用该条的 I1，且 F015 非病因；触发/适用：T：可信接收日在适用开学两周窗口内；F：可信接收日在窗口外；U：接收时戳/当期开学通知/现行口径未知；来源、字段及材料关联：SRC-001 §38、SRC-003 §35；F006/F008/F015/F017/F018/F019/F032；M002/M013/M016；核验要求：比较校方接收时间与本学期正式开学日，校历版本与适用学段必须冻结；**本科因病 P1、研究生 R1 不套此窗口**；临界顺延与迟交例外须人工；结果与下一步：T=`PASS_FACT`（时点事实）；F=`NEEDS_HUMAN_DECISION`（不得自动拒绝）；U=校历源失联 `SOURCE_UNAVAILABLE` / 时效未知 `POLICY_UNCONFIRMED`；下一人：本科/国际学籍归口",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-02",
      "name": "8.3 L2–L3：专业证明、数量比较与行政裁量",
      "description": "对应源 Markdown 的 08 规则分组；分项内所有结论仅为本地研究预审。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "R011",
          "title": "医学签发主体与可读性 L2，申请用医疗证明支持病伤/强制触发",
          "requirement": "原稿规则编号/标题：**R011 医学签发主体与可读性** L2，申请用医疗证明支持病伤/强制触发；触发/适用：T：对应患者、日期、出具单位、建议休养内容可核，且强制触发所需校医院/二甲及以上医院资格可验证；F：确认为无相应资格或错人；U：无法读/无法核机构；来源、字段及材料关联：SRC-001 §41、SRC-002 §22、SRC-003 §38；F003/F027/F028/F029/F035；M001/M004/M005；核验要求：B 级医院证明与受控核验留痕；不同用途有不同证明要求，不能把强制触发的医院门槛**直接扩展成普通短病假休学的已核定材料要求**；结果与下一步：T=`PASS_FACT`（证据属性）；F=`CONFLICT`/`NEEDS_HUMAN_DECISION`；U=文件糊 `UNREADABLE`、机构无法核 `SOURCE_UNAVAILABLE`；下一人：学院学籍经办/医学专业核验者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "病伤停课休养超过六周 L2/L3，P1/R2/I1 已确认医疗强制触发政策",
          "requirement": "原稿规则编号/标题：**R012 病伤停课休养超过六周** L2/L3，P1/R2/I1 已确认医疗强制触发政策；触发/适用：T：被核医疗文件明确建议停课治疗/休养**>6 周**；F：≤6 周；U：未写建议时长/含混、适用版本未确认；来源、字段及材料关联：SRC-001 §41、SRC-002 §22、SRC-003 §38；F006/F027/F028/F029/F032；M004/M005/M016；核验要求：先通过 R011，再按有权解释的周/天口径比较**严格 >**；“少于/等于”仅不触发该项**必须休学**，仍可能自愿申请；医学判断、真实性由人；结果与下一步：T=`PASS_FACT`（触发证据已支持）；F=`NOT_APPLICABLE`（该强制触发未达到）；U=缺医学材料 `NEEDS_MATERIAL`、时长不可读 `UNREADABLE`、口径未知 `POLICY_UNCONFIRMED`；下一人：学籍归口/医务核验/有权决定者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "本学期已批准请假累计超过六周 L2，P3/R2 或经确认 I1 的请假触发",
          "requirement": "原稿规则编号/标题：**R013 本学期已批准请假累计超过六周** L2，P3/R2 或经确认 I1 的请假触发；触发/适用：T：权威本学期批准请假累计**>6 周**；F：≤6 周；U：学期/批准台账/重叠计算口径不可得；来源、字段及材料关联：SRC-001 §21/41、SRC-002 §13/22、SRC-003 §38；F018/F026/F032/F035；M006/M013/M016；核验要求：A 级请假批准而非缺课/病历时长；逐条核已批准、区间去重、同学期归属；**恰好六周为 F**，不自动触发，更不自动批准；结果与下一步：T=`PASS_FACT`（需进入学校休学核办）；F=`NOT_APPLICABLE`（仅此强制触发未达）；U=台账源不可得 `SOURCE_UNAVAILABLE`、时间冲突 `CONFLICT`、统计口径未知 `POLICY_UNCONFIRMED`；下一人：辅导员/培养单位/学籍归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "本科/来华本科休学拟期及累计 L2，P1/P2/I1 或 X3 已明确适用相应本科规则",
          "requirement": "原稿规则编号/标题：**R014 本科/来华本科休学拟期及累计** L2，P1/P2/I1 或 X3 已明确适用相应本科规则；触发/适用：T：经 A/B 级历史决定核实拟期和累计在**当前有效**适用规则的本科界限内；F：超出“单次 1 年、累计 2 年”等可核界限；U：历史决定/学年计算或政策版本未知；来源、字段及材料关联：SRC-001 §38、SRC-003 §35；F020–F024/F032；M002/M011/M012/M016；核验要求：先合并已批准历史、核本次**拟**起止，不把待审批申请算作已生效；特殊项目不得默认套此范围；“一年”的起止包含方式若不明不得硬拒绝；结果与下一步：T=`PASS_FACT`（期限算术事实）；F=`NEEDS_HUMAN_DECISION`（超限由有权机关处理）；U=历史源失联 `SOURCE_UNAVAILABLE` / 政策口径未核 `POLICY_UNCONFIRMED`；下一人：本科或国际学籍归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "研究生休学次数与累计 L2，R1/R2/R3/X3 且研究生政策适用确认",
          "requirement": "原稿规则编号/标题：**R015 研究生休学次数与累计** L2，R1/R2/R3/X3 且研究生政策适用确认；触发/适用：T：由校方历史决定核实次数与累计，位于“一般不超过两次/两年”范围；F：可证超一般范围；U：历史遗漏、批准起止口径不明；来源、字段及材料关联：SRC-002 §23–24；F023/F024/F032；M011/M016；核验要求：A 级真实决定计次/去重；“一般”容许个案例外，不能把 F 解释为绝对无资格；自主创业事由事实走 R017、延长年限权限及已批特例另走 R016；结果与下一步：T=`PASS_FACT`（一般界限内事实）；F=`NEEDS_HUMAN_DECISION`；U=台账缺 `SOURCE_UNAVAILABLE`/适用未知 `POLICY_UNCONFIRMED`；下一人：党委研究生工作部、研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "最长修业年限与已批准例外 L2，拟期可能影响修业期或有历史延长",
          "requirement": "原稿规则编号/标题：**R016 最长修业年限与已批准例外** L2，拟期可能影响修业期或有历史延长；触发/适用：T：校方有效培养期限与已批准例外能证明拟期与当前学籍期限关系；F：拟期跨过可信上限且无现成特例；U：最长修业期或已有延长决定不可核；来源、字段及材料关联：SRC-001 §8/38、SRC-002 §19–24；F020–F025/F032；M011/M012/M016；核验要求：A 级批准年限、时点优先于自写期限；这只是分析风险，不替代延长修业年限的独立授权。研究生创业延长仅在真实批准后计入；结果与下一步：T=`PASS_FACT`（期限关系事实）；F=`NEEDS_HUMAN_DECISION`（需另有权程序）；U=`SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED`；下一人：教务或研究生学籍主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "创业事由证据与本人的对应 L2/L3，P2/R1/R3 中创业主张",
          "requirement": "原稿规则编号/标题：**R017 创业事由证据与本人的对应** L2/L3，P2/R1/R3 中创业主张；触发/适用：T：创业项目相关事实与本人身份、申请拟期一致；F：材料确属他人项目或明确无本案对应关系；U：创业证据形式或核验来源未知；来源、字段及材料关联：SRC-001 §38、SRC-002 §21/24；F003/F015/F020–F022/F030；M002/M008/M024；核验要求：只判断创业事由证据的归属与可核性；研究生**创业期限特例及 +2 年上限**不在此 R 自动通过，须 R016 核已批准期限和有权机关作裁量；营业执照非已核普遍必交；结果与下一步：T=`PASS_FACT`（创业参与事实）；F=`CONFLICT`；U=凭证缺 `NEEDS_MATERIAL` /形式与裁量未知 `POLICY_UNCONFIRMED`；下一人：申请人、研究生或本科归口经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "出国学习与保留学籍冲突 L2，P2/R1/I 等以境外项目为事由",
          "requirement": "原稿规则编号/标题：**R018 出国学习与保留学籍冲突** L2，P2/R1/I 等以境外项目为事由；触发/适用：T：有真实对应本人的出国/学习事实且校方确认应以休学处理；F：确认为入伍或学校组织跨校联合培养等保留学籍决定对象；U：项目性质/现行政策不明；来源、字段及材料关联：SRC-001 §38–39、SRC-002 §21/25、SRC-004 §27、SRC-005；F009/F013/F015/F030/F032；M002/M009/M014/M016；核验要求：学校项目/招生归口的受控名录高于邀请函表述；“去国外”不是自动休学；只在本 ID 检查路由，不对外方项目作校内批准；结果与下一步：T=`PASS_FACT`（事由及路由事实）；F=`NOT_APPLICABLE`（转保留学籍）；U=`POLICY_UNCONFIRMED`、证明不全 `NEEDS_MATERIAL`；下一人：学籍/国际项目经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "其他特殊原因与证据裁量 L2/L3，P2/P4/R1/R2/I 等主张家庭/经济/其他事项",
          "requirement": "原稿规则编号/标题：**R019 其他特殊原因与证据裁量** L2/L3，P2/P4/R1/R2/I 等主张家庭/经济/其他事项；触发/适用：T：可识别本人陈述和与事由相关的核验线索；F：客观身份/事实明显冲突；U：必要事由材料缺失、学校所需证明形式未明确；来源、字段及材料关联：SRC-001 §38/41、SRC-002 §21/22、SRC-003 §35/38；F015/F016/F031/F032；M003/M007/M010/M024；核验要求：**只核事由证据关联，不审准许资格**；家庭收入阈值、亲属病历范围、特殊原因清单未查得；归口人员对是否认可作独立人工决定，不成为该 R 第二个结果码；结果与下一步：T=`PASS_FACT`（事由证据相关）；F=`CONFLICT`；U=已确认必要材料缺 `NEEDS_MATERIAL` /校本形式未知 `POLICY_UNCONFIRMED`；下一人：学生补充/学院归口及正式有权人员另开裁量待办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "教学秩序影响的正式学校认定 L2/L3，仅 R2 或有明确相同条款的特定分支",
          "requirement": "原稿规则编号/标题：**R020 教学秩序影响的正式学校认定** L2/L3，仅 R2 或有明确相同条款的特定分支；触发/适用：T：校方有权人员已就本案提出可核的风险事实与程序意见；F：材料确证为他人、无权主体意见；U：仅有传闻、非授权判断或无明文操作准则；来源、字段及材料关联：SRC-002 §22；F011/F014/F031/F035；M007/M024；核验要求：A/B 级有权学校事实意见，禁止模型用课堂缺席/心理标签推断“影响秩序”，不得将休学理由转写为纪律处分；是否必须休学仍由有权者决定（单独人工待办，不是 R020 第二结果）；结果与下一步：T=`PASS_FACT`（校方意见存在事实）；F=`CONFLICT`；U=程序依据未知 `POLICY_UNCONFIRMED` /须有权专业判断 `NEEDS_HUMAN_DECISION`；下一人：研究生院学籍归口",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-03",
      "name": "8.4 L2–L6：证据一致性、版本、撤回、真实决定及后续",
      "description": "对应源 Markdown 的 08 规则分组；分项内所有结论仅为本地研究预审。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "R021",
          "title": "材料归属与跨源一致性 L2/L3，有两份以上重要证据",
          "requirement": "原稿规则编号/标题：**R021 材料归属与跨源一致性** L2/L3，有两份以上重要证据；触发/适用：T：学生主键、事由、时段、原件签发人、版本之间无未解矛盾；F：权威学籍/请假与附件对立、同名异号、文件属于另案；U：来源之一未读到；来源、字段及材料关联：SRC-001 §57、SRC-002 §42、SRC-011（G01 技术边界）；F003/F004/F015/F018/F026/F027/F033/F034；M001/M002/M004/M006/M011/M023；核验要求：A 的身份/请假/历史记录优于 C 的截图/自述；不把医疗“建议休养”当请假“已批准”；所有冲突具体定位双方 M 版本/页/字段；结果与下一步：T=`PASS_FACT`；F=`CONFLICT`；U=权威源缺 `SOURCE_UNAVAILABLE` 或文档糊 `UNREADABLE`；下一人：对应主数据归口/学生补证",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "文件可读与权威来源可取得 L1–L3，每个应已存在的当前材料槽",
          "requirement": "原稿规则编号/标题：**R022 文件可读与权威来源可取得** L1–L3，每个应已存在的当前材料槽；触发/适用：T：该槽相应字段可核且签发来源能够验证；F：明确缺应由本人提供的材料；U：已上传但不可读、应从学校取的权威源断连；来源、字段及材料关联：SRC-005–007（表单线索）、SRC-004 §25、SRC-009/010（后续性）；F032/F033/F035；M001–M016/M023/M024；核验要求：**材料侧**逐槽、逐版本、逐字段检查；不把系统断连要求学生截图，也不将 `M017–M020/M022` 在 L1 算“缺”。`M005/M024` 按触发而非普遍必填；结果与下一步：T=`PASS_FACT`（该槽可核）；F=`NEEDS_MATERIAL`；U=附件 `UNREADABLE`、源断 `SOURCE_UNAVAILABLE`、表单版本未知 `POLICY_UNCONFIRMED`；下一人：上传人或对应权威持有者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "补件替换后的定向失效重审 L2/L3，已有被替换证据或申请修订",
          "requirement": "原稿规则编号/标题：**R023 补件替换后的定向失效重审** L2/L3，已有被替换证据或申请修订；触发/适用：T：旧/新版本与依赖 R 链完整，旧 R 的结论已失效、仅相关 R 用新证据重算；F：旧 PASS_FACT 仍指旧材料或错绑他案；U：哈希/版本链不可得；来源、字段及材料关联：SRC-004 §25（证据真实要求）；F001/F002/F027–F029/F033/F034/F035；M004/M021/M023/M024；核验要求：见 11.3 依赖矩阵；受控事件 `materialVersion+applicationRev`，不可原位覆写；已作出的真实决定不由模型重算自动撤销；结果与下一步：T=`PASS_FACT`（版本与定向重审流程事实）；F=`CONFLICT`；U=`SOURCE_UNAVAILABLE`；下一人：案卷证据维护者/受影响规则经办",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "撤回/改期请求效力边界 L1–L4，有当事人或代理提出撤回、修改、重提",
          "requirement": "原稿规则编号/标题：**R024 撤回/改期请求效力边界** L1–L4，有当事人或代理提出撤回、修改、重提；触发/适用：T：请求人、对象申请版本、时间、当前适用程序与学校真实处理结果均已核对；F：冒名、错案或试图用 L1 撤回抹掉 L4 生效决定；U：代理权限/学校撤回期限和方式或实际处理未核；来源、字段及材料关联：SRC-004 §25、SRC-005（历史办理），校本撤回原文未核；F001/F002/F011/F012/F020/F021/F041；M002/M015/M021/M023；核验要求：F041 可以先记录**收到撤回请求的事实**，但该事件≠R024 已通过，更不等于撤回生效；须有权机关/受控流程确证处理结果后才更新待办；重提新申请不继承旧材料结论；结果与下一步：T=`PASS_FACT`（请求与学校处理事实完整可核）；F=`CONFLICT`；U=校本程序未知 `POLICY_UNCONFIRMED` /学校处理未作 `NEEDS_HUMAN_DECISION` /来源失联 `SOURCE_UNAVAILABLE`；下一人：本人、受理经办、授权确认机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "休学决定签批人及权限 L4，已进入正式学校决定环节",
          "requirement": "原稿规则编号/标题：**R025 休学决定签批人及权限** L4，已进入正式学校决定环节；触发/适用：T：签批 Actor 的学校岗位、事项类型、学段、组织与签批当时授权可核；F：伪造角色或签批者无此事项权；U：本科/国际生批准链或岗位授权未知；来源、字段及材料关联：SRC-002 §23、SRC-004 §25、SRC-001/003（签批细节待核）；F005–F011/F032/F036；M001/M014/M016/M017/M024；核验要求：由 Host/Main 后端或学校正式流程核权，不信前端字段；研究生机关已见条文，但**具体人员岗位分工**仍需校方证明；事实初审 M024 不等于终审 M017；结果与下一步：T=`PASS_FACT`（权限核验），仍须 R026；F=`CONFLICT`；U=`POLICY_UNCONFIRMED`/源失联 `SOURCE_UNAVAILABLE`；下一人：校方审批权限管理员/有权主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "真实休学决定存在及可核 L4，声称已经学校批准/不批准",
          "requirement": "原稿规则编号/标题：**R026 真实休学决定存在及可核** L4，声称已经学校批准/不批准；触发/适用：T：存在可验校方决定 ID、结果、签发时间、有效范围，且 R025 已通过权限核验；F：经校方核证不存在或与上传“通过”不符；U：文书不可读/正式决定源不可达；来源、字段及材料关联：SRC-002 §23、SRC-004 §25；F036/F037/F038/F035；M017/M024；核验要求：A 类决定记录优先于扫描盖章或导师意见；只报告 `authorityDecisionRef` 的存在、结果和真实来源，不输出 AI `approved`，也不由此 R 创建学校决定；结果与下一步：T=`PASS_FACT`（**决定确有其事**，不是模型作决定）；F=`CONFLICT`；U=`SOURCE_UNAVAILABLE/UNREADABLE/NEEDS_HUMAN_DECISION`；下一人：真实校方决定登记机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "决定后学籍状态变更 L5，R026 已核有生效决定",
          "requirement": "原稿规则编号/标题：**R027 决定后学籍状态变更** L5，**R026 已核有生效决定**；触发/适用：T：学校权威学籍事件与真实决定同人、同案、时效一致；F：状态仍不符或引用另一决定；U：状态源不可用；来源、字段及材料关联：SRC-001 §57、SRC-002 §42、SRC-004 §25；F003/F005/F037–F039；M001/M017/M018；核验要求：学籍事件必须由学校权威持有者实施，且有版本、旧态/新态；未到 L5 的 `M018` 不是缺件；决定生效与状态变更可能存在办理时差，先核而非回滚决定；结果与下一步：T=`PASS_FACT`（执行事实）；F=`CONFLICT`/后续待办；U=`SOURCE_UNAVAILABLE`；下一人：教务/研究生学籍维护者",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "资助、退宿及财务后续 L5，相关服务确由学校依法要求且已有生效休学决定",
          "requirement": "原稿规则编号/标题：**R028 资助、退宿及财务后续** L5，相关服务确由学校依法要求且已有生效休学决定；触发/适用：T：对应下游机关的处理回执已可核并正确引用决定；F：已到办理节点却未办或记载与学籍决定冲突；U：适用资助资格/时点或来源未知；来源、字段及材料关联：SRC-009 §9、SRC-010 清单项 29；F037/F038/F040；M017/M019/M020；核验要求：每个服务有独立负责人、资金项目、有效月和回执；不以“未停助学金”作为 L1 休学资格瑕疵；不同项目不能一律套研究生国家助学金规则；结果与下一步：T=`PASS_FACT`（后续服务事实）；F=下游待办 `NEEDS_HUMAN_DECISION`/证据冲突 `CONFLICT`；U=`SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED`；下一人：财务/资助/宿舍持有者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "决定后申诉/复核的有权路由 L6，已有真实被争议处理决定且有人提出复核/申诉",
          "requirement": "原稿规则编号/标题：**R029 决定后申诉/复核的有权路由** L6，已有真实被争议处理决定且有人提出复核/申诉；触发/适用：T：原决定、申请人、异议对象、**适用申诉程序**与校方受理记录均可核；F：错案、无被争议决定却声称已进入正式申诉；U：当前申诉办法版本、期间、机关权限或正式受理未核；来源、字段及材料关联：SRC-001 §59、SRC-002 §44、SRC-003 §70、SRC-004 §59–64；F011/F012/F037/F038/F042/F032；M015/M017/M022/M016；核验要求：R026 可独立核实原决定，F042/M022 可先记录申诉请求；这两件事**都不能提前使 R029=T**。区分 L2 材料复核与 L6 申诉；2022 校本申诉办法正文尚缺，不外推期限；结果与下一步：T=`PASS_FACT`（仅程序与受理事实可核，非实体复核成功）；F=`CONFLICT`；U=制度未核 `POLICY_UNCONFIRMED` /待正式受理 `NEEDS_HUMAN_DECISION` /受理系统失联 `SOURCE_UNAVAILABLE`；下一人：正式学校申诉处理机构",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "历次学籍决定复用与续休路由 L0/L2/L6，既往休学、复学、保留学籍或延期记录出现",
          "requirement": "原稿规则编号/标题：**R030 历次学籍决定复用与续休路由** L0/L2/L6，既往休学、复学、保留学籍或延期记录出现；触发/适用：T：只引用与本案主体、时段、决定类型一致的可验历史决定；F：把复学/请假/保留学籍/延长年限的审批结果当作本次休学决定；U：原决定未归档或 R02 相邻 ID 未核；来源、字段及材料关联：SRC-001 §38–40、SRC-002 §23–28、SRC-003 §35–39、SRC-011（G50 技术边界）；F003/F005/F013/F023–F025/F033/F037；M001/M011/M012/M014/M017；核验要求：G01 只供学籍姓名更正权威结果；其他 S/T 只复用真正生效的决定/记录及版本。不把已有 `run@rev`、观测或 AI 结论冒作真实 `ReviewRun/Decision`；继续休学程序待归口确认；结果与下一步：T=`PASS_FACT`（复用事实）；F=`CONFLICT`/`NOT_APPLICABLE`（转邻接）；U=`SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED`；下一人：学籍归口/相邻事项有权机关",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "l0",
      "name": "本地研究预审 · L0 路由识别",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "l1",
      "workflowOwner": "local"
    },
    {
      "id": "l1",
      "name": "本地研究预审 · L1 申请成案",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l2",
      "workflowOwner": "local"
    },
    {
      "id": "l2",
      "name": "本地研究预审 · L2 事实与材料核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l3",
      "workflowOwner": "local"
    },
    {
      "id": "l3",
      "name": "本地研究预审 · L3 补件/冲突/人工判断",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l4",
      "workflowOwner": "local"
    },
    {
      "id": "l4",
      "name": "本地人工复核（不签发校方决定）· L4 有权决定",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "l5",
      "workflowOwner": "local"
    },
    {
      "id": "l5",
      "name": "本地人工复核（不签发校方决定）· L5 决定生效后",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "l6",
      "workflowOwner": "local"
    },
    {
      "id": "l6",
      "name": "本地研究预审 · L6 到期或争议",
      "kind": "handoff",
      "executorRole": "reviewer",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "review-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "human-follow-up",
      "kind": "supplement-list",
      "audience": "reviewer"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T03:18:00+08:00"
}

export const r02Metadata = {
  "templateId": "S01-T01",
  "name": "学生休学资格与材料审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S01-T01.md",
  "researchOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/S01-T01.md",
  "sourceDocumentSha256": "689ba6e80be730556f9dcf8dfb3661bbec6077b24ed70dc492fc088243b1ec76",
  "officialSchoolTemplate": false,
  "researchStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "sourceSnapshotDate": "2026-10-23",
  "sourceIntegrity": "manifest SHA-256 for source blob plus one terminal LF, per dispatch integrity note",
  "sources": [
    {
      "srcId": "SRC-001",
      "title": "2019-12-31 印发，2020-01-01 施行；§2、§5–9、§20–21、§38–42、§44–45、§57、§59–62；PDF 1–7、12–14、18 页（PDF 查看器索引存在封面差异）。§60 明确废止成理校教〔2017〕17 号 — 普通全日制本科，相关特殊项目“参照”；**已核对 PDF 原文**；2023 校信息公开仍展示，2026 是否有新修订待教务处确认。访问 2026-10-22",
      "url": "https://dbxb.cdut.edu.cn/__local/7/B6/E5/006AC04D88A214D1AD8B1F5E540_16B4A5B7_C543C.pdf",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-002",
      "title": "2021-06-16 印发，2021-09-01 施行；§2、§13、§19–29、§30–35、§42–46；§45 明确废止 2019 研字 32 号；网页 2023-04-12 公开 — 本校按国家招生政策录取的全日制/非全日制研究生；**校方可检索正文已逐段核对**（当前页面直连曾返回 412，搜索索引提供全文）；现行性待归口确认。访问 2026-10-22",
      "url": "https://dbxb.cdut.edu.cn/xxgkwz/info/1032/2549.htm",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-003",
      "title": "2022-08-31 印发，2022-09-01 试行；§3、§14、§35–39、§66–72；PDF 2、5–6、13–15、22–24 页 — 来华留学本研，在 §3、§71 对非学历/港澳台侨有参照规定；**已核对原文**。国际研究生重叠适用和现行性待确认。访问 2026-10-22",
      "url": "https://dbxb.cdut.edu.cn/__local/6/F5/86/E91EEDCF144F4BC5CA934E95F28_8F010406_8B8F6.pdf",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-004",
      "title": "2017-02-04 公布，2017-09-01 施行；§2、§10–11、§25–30、§34、§59–64；旧 21 号被明文废止 — 上位部门规章，普通高等学历教育本研；**原文内容已核对**，不是具体校内材料清单或授权链。访问 2026-10-22",
      "url": "https://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201702/t20170216_296385.html",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-005",
      "title": "网页标 2018-09-13；“承办单位：学院办公室”“填写申请表—提供证明—到学院办公室办理”，针对入伍/跨校交流另列通知书和项目表；无明确终止时间 — 当时校内公开办理路径；**索引文字已核对，但直连 412，现行性未知**，绝不将 2018 手续自动作为 2026 唯一流程。访问 2026-10-22",
      "url": "https://aao.cdut.edu.cn/info/1185/2200.htm",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-006",
      "title": "目录登记 2019-07-05；附件条目；完整表格字段、签批栏、版本未取得；未见废止信息 — 证明历史公开表单名称；**仅核对目录，未读取表单原件**，不能定稿材料字段。访问 2026-10-22",
      "url": "https://cmcc.cdut.edu.cn/index/zlxz.htm",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-007",
      "title": "目录显示 2025-07-03；附件具体名称及实际内容未核对 — 研究生校内较新的表单线索；**仅核对目录**，具体休学申请表及签批链仍未知。访问 2026-10-22",
      "url": "https://cnae.cdut.edu.cn/yjsjy/xaizai.htm",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-008",
      "title": "2023-04-12 同时列成理校教〔2019〕18 号和成理校研〔2021〕13 号；目录条目 — **目录已核对**；只能证明当时公开，不保证截至 2026 无修订。访问 2026-10-22",
      "url": "https://dbxb.cdut.edu.cn/xxgkwz/gksx/xjglbf.htm",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-009",
      "title": "2024-07-07 印发并实施；§6–9、§11–12；PDF 3–5 页；第 9 条涉及已办结休学后的下一月停发、复学后次月恢复及异动确认 — 研究生**休学后资助后续**，不是休学先决条件；**原文已核对**，现行性另待确认。访问 2026-10-22",
      "url": "https://cnae.cdut.edu.cn/40haochengdouligongdaxueyanjiushengguojiazhuxuejinguanlibanfa.pdf",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-010",
      "title": "表中序号 29、PDF 14 页附近：学籍异动财务线下办理，休学项提及退宿后休学通知单及证明复印件；确切发布日未读到 — 校内后续财务办理线索；**对应行已核对**，不得当作休学初次申请材料。访问 2026-10-22",
      "url": "https://jcc.cdut.edu.cn/__local/8/A8/96/748E97CB5061A750C78C9A841EF_9631E851_E5400.pdf",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-011",
      "title": "JSON `catalogId=D4-G01-G08-UNIFIED-R01`、`templateCount=50`、`authoritativeSchoolTemplate=false`、`publicationAllowed=false`、`g01-student-identity-correction`；文件未含校方规范生效时间 — 仅 G50 技术对照，不可替代政策；**指定 SHA 文件已读取核对**。访问 2026-10-22",
      "url": "https://raw.githubusercontent.com/Fuck-GH-Admin/cdut-studio-review-agent/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-012",
      "title": "页面条目显示 2025-03-10；原正文或附件未从目录取得 — 2025 仍有同名制度上架的线索；**只核对目录，具体年份/版本未确认**。访问 2026-10-22",
      "url": "https://cc.cdut.edu.cn/xsgz/gzzd.htm",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-013",
      "title": "2017-09-06 印发，2017-09-01 试行；末章 §58–60；**已由 SRC-001 §60 明确于 2020-01-01 废止** — 仅用于排查过时转载和版本冲突；**历史原文/废止关系已核对**，绝不能作为当前规则。访问 2026-10-22",
      "url": "https://cmp.cdut.edu.cn/__local/5/8C/5D/CB1295C548BB5C63428A98CF31B_B118AFC5_7A92E.pdf",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-014",
      "title": "主页列题名；专门规定正文、施行和修订/废止时间本轮未取得 — 中外合作办学学生可能独立适用；**仅制度存在性和文件线索**，禁止套用普通本科详细阈值。访问 2026-10-22",
      "url": "https://aao.cdut.edu.cn/",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-015",
      "title": "**2026-06-08** 目录刊载；正文标注“详情见附件”，附件原文、实际印发/施行/废止条款及是否覆盖所有合作项目未取得 — 这是**晚于 SRC-014 的重大版本线索**；目录可核而附件未读，不得据目录推断具体休学次数、期限或签批权限；必须暂停 X1 自动阈值。访问 2026-10-22",
      "url": "https://cie.cdut.edu.cn/jyjx/zwhzbxgl/glzd.htm",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules-01",
      "criterionId": "R001",
      "srcIds": [
        "SRC-004",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-014",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-008",
        "SRC-012",
        "SRC-013",
        "SRC-014",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R015",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R018",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R020",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R022",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-004",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R023",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R024",
      "srcIds": [
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R025",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R026",
      "srcIds": [
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R027",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R028",
      "srcIds": [
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R029",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ],
  "exceptionRouteNotes": [
    "| **X1** 中外合作办学、联合项目、港澳台侨等特殊身份的在籍学生 | L0–L3：项目身份与政策版本分流，暂不出自动资格结论 | 2026-06 校院目录已列同名新版中外合作办学办法，但**正文未取得**；不同项目、培养身份、适用效力全部待核 | 只收基本申请，不套普通本科期限；外校/外方文件不能替代校本授权。可能对已适用项目政策产生覆盖关系 | SRC-001、003、014、015 |",
    "| **X2** 学生本人、声称代理人、学校经办者（跨各学段） | L1–L3：授权核验、补件、变更或撤回请求；L4 之前的异议 | 校本文件未明确代理凭证形态、撤回截止或再申请等待期；当前请求可登记但不赋予实体许可 | `M015/M021/M023` 仅按实际触发使用；经办者不能代替有权签批者；已有 L4 决定时转复核而非撤销原决定 | SRC-004、005；细则待核 |",
    "| **X3** 曾休学、已复学或当前休学中再次提出的学生 | L0–L3：续休/重新申请/改期、期限与历史决定核对 | 本科累计≤2 年；研究生一般≤2 次、累计一般≤2 年；来华本科特别规定；是否受理“续休”名称/手续未确认 | `M011` 历史批准、`M012` 修业期限快照先核；当前休学中另办复学或续休的权威路径待确定，不自动新建连续批准 | SRC-001、002、003 |",
    "| **X4** 已获正式休学决定的在籍学生（各适用学段） | L4–L6：已批准后的学籍变更、退宿、财务/奖助学金衔接；后续复学/争议 | 生效时点由真实决定与权威学籍事件定；财务清单提到决定和退宿的**后置**证明；不属于 L1 的截止 | `M017–M020` 只在阶段到达时产生；若争议则引用原决定 `M022`；复学/退学另路由 | SRC-001、002、009、010 |",
    "| **X5** 未取得学籍新生、非学历交流者、入伍保留学籍事项或已退学者 | L0：资格/事项类型分流，**排除本休学申请模板的实质判断** | 取得学籍前不得强行运行在籍休学规则；入伍/交流依法可能“保留学籍”而非“休学” | 不要求误路由对象提供休学整套材料；转相邻 S/T 或归口人工确认；不能改写已退学状态 | SRC-001、002、003、004、005 |",
    "1. **先 L0 学籍与项目身份，再按 P/R/I/X 分支；多重身份不靠国籍、学院名称单字段推断。** 来华留学研究生与中外合作办学者落入 I2/X1 政策确认通道；已有明确特殊条例时不以普通本科学制兜底。[SRC-002、003、014、015]"
  ],
  "publicationGuard": "Integration Owner must register this research template as candidate-held (for example via saveAuthoringCandidateDraft); the R02_RESEARCH_TEMPLATE_NONOFFICIAL sourceNote prefix is not recognized by template-store.isCandidateDraft in the current shared code."
} as const
