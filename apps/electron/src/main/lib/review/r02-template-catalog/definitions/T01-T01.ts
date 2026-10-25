import type { TemplateVersion } from '@profer/shared'

export const T01T01_TEMPLATE: TemplateVersion = {
  "templateId": "T01-T01",
  "version": 1,
  "schemaVersion": 2,
  "name": "课程调课、停课、补课与教学时间变更审核",
  "description": "本地研究模板 · 非校方正式模板。课程调课、停课、补课与教学时间变更审核：基于 R02 原件逐条核验事实、证据和办理情形；所列材料包含后续权威记录，不代表初次提交均须上传。所有正式决定与未确认校本政策必须人工判断。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；政策 PARTIAL、全部正式决定需可信人员人工确认；研究 SRC 不是案卷 SourceRef。",
  "objectType": "custom",
  "displayName": {
    "template": "T01-T01 · 课程调课、停课、补课与教学时间变更审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · string｜Case 案卷唯一键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F001 字段：string｜Case 案卷唯一键；I0；CASE 创建事件；案卷元数据 caseId；P1；系统未建案则不能串联审批与材料。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F001；原稿类型及阶段：F001；string｜Case 案卷唯一键；I0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F002",
      "label": "F002 · enum｜Case 当前阶段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F002 字段：enum｜Case 当前阶段；I0+；CASE 状态转移；案卷事件流；P1；状态未知则人工核当前阶段。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F002；原稿类型及阶段：F002；enum｜Case 当前阶段；I0+；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F003",
      "label": "F003 · enum A–H3｜Case 办理情形",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F003 字段：enum A–H3｜Case 办理情形；I1；DOC 申请 + SCHED 学段推导；M003 + M001；P1；未定情形则待分流，不自动用错政策。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F003；原稿类型及阶段：F003；enum A–H3｜Case 办理情形；I1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F004",
      "label": "F004 · string｜CourseOffering 学年学期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F004 字段：string｜CourseOffering 学年学期；I0；SCHED；M002 学期栏；P1；源失联，不能用当前自然日期猜学期。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F004；原稿类型及阶段：F004；string｜CourseOffering 学年学期；I0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F005",
      "label": "F005 · enum 本科/硕士/博士/其他待核｜CourseOffering 学段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F005 字段：enum 本科/硕士/博士/其他待核｜CourseOffering 学段；I0；SCHED 教学任务；M001 学段；P1；POLICY_UNCONFIRMED，不混用本科/研究生链。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F005；原稿类型及阶段：F005；enum 本科/硕士/博士/其他待核｜CourseOffering 学段；I0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F006",
      "label": "F006 · string｜CourseOffering 校区",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F006 字段：string｜CourseOffering 校区；I0；SCHED；M002 校区；P1；待核跨校区冲突，不推断交通时间。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F006；原稿类型及阶段：F006；string｜CourseOffering 校区；I0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F007",
      "label": "F007 · string｜CourseOffering 课程唯一 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F007 字段：string｜CourseOffering 课程唯一 ID；I0；SCHED；M001 课程编码；P1；无编码须人工精确映射，勿仅按课名。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F007；原稿类型及阶段：F007；string｜CourseOffering 课程唯一 ID；I0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F008",
      "label": "F008 · string｜TeachingClass 教学班唯一 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F008 字段：string｜TeachingClass 教学班唯一 ID；I0；SCHED；M001/M002 教学班号；P1；必须先唯一定位，重名不可合并。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F008；原稿类型及阶段：F008；string｜TeachingClass 教学班唯一 ID；I0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F009",
      "label": "F009 · string｜CourseOffering 开课归口单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F009 字段：string｜CourseOffering 开课归口单位；I0；SCHED/校方组织表；M001 课程归属；P1；归属争议交教务部门确认。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F009；原稿类型及阶段：F009；string｜CourseOffering 开课归口单位；I0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F010",
      "label": "F010 · string｜CourseOffering 教学任务/排课任务 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F010 字段：string｜CourseOffering 教学任务/排课任务 ID；I0；SCHED；M001 任务书号；P1；无任务关联不能仅据教职工证认定任课。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F010；原稿类型及阶段：F010；string｜CourseOffering 教学任务/排课任务 ID；I0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F011",
      "label": "F011 · opaque ID｜Actor 实名认证申请主体",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F011 字段：opaque ID｜Actor 实名认证申请主体；I0；AUTH；M001 认证关联而非证件复印件；P2；认证失败需人工核，不能信 Renderer 文本。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F011；原稿类型及阶段：F011；opaque ID｜Actor 实名认证申请主体；I0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F012",
      "label": "F012 · opaque ID｜Actor 该课主讲/任课主体",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F012 字段：opaque ID｜Actor 该课主讲/任课主体；I0；SCHED+AUTH；M001 任务任课关联；P2；不一致需 CONFLICT/关联 T01-T02。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F012；原稿类型及阶段：F012；opaque ID｜Actor 该课主讲/任课主体；I0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F013",
      "label": "F013 · tri-state｜Actor 申请人是否具备本次申报权",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F013 字段：tri-state｜Actor 申请人是否具备本次申报权；I0；AUTH+SCHED+授权决定；M001/M019；P2；未知则 NEEDS_HUMAN_DECISION。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F013；原稿类型及阶段：F013；tri-state｜Actor 申请人是否具备本次申报权；I0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F014",
      "label": "F014 · opaque ID/null｜Actor 代理经办人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F014 字段：opaque ID/null｜Actor 代理经办人；I1 条件；AUTH；M019 代理账号；P2；未代办为不适用；代办未认证不得认定有效。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F014；原稿类型及阶段：F014；opaque ID/null｜Actor 代理经办人；I1 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F015",
      "label": "F015 · ref/null｜Actor 代理授权凭据",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F015 字段：ref/null｜Actor 代理授权凭据；I1 条件；DEC/DOC 核验授权；M019 授权范围与期限；P2；无授权不让代理作有权动作。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F015；原稿类型及阶段：F015；ref/null｜Actor 代理授权凭据；I1 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F016",
      "label": "F016 · string｜OriginalSession 原课表源版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F016 字段：string｜OriginalSession 原课表源版本；I0；SCHED；M002 版本/有效时间；P1；源版本缺失则禁止旧结论复用。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F016；原稿类型及阶段：F016；string｜OriginalSession 原课表源版本；I0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F017",
      "label": "F017 · list[session ID]｜OriginalSession 被更改课节集合",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F017 字段：list[session ID]｜OriginalSession 被更改课节集合；I1；SCHED + 申请定位；M002/M003 课节行；P1；无法锚定课节为 NEEDS_MATERIAL 或源失联。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F017；原稿类型及阶段：F017；list[session ID]｜OriginalSession 被更改课节集合；I1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F018",
      "label": "F018 · interval/list｜OriginalSession 原周次、日期、节次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F018 字段：interval/list｜OriginalSession 原周次、日期、节次；I0/I1；SCHED；M002 课表行；P1；原时段与自述冲突则 CONFLICT。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F018；原稿类型及阶段：F018；interval/list｜OriginalSession 原周次、日期、节次；I0/I1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F019",
      "label": "F019 · string/null｜OriginalSession 原上课地点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F019 字段：string/null｜OriginalSession 原上课地点；I0/I1；SCHED；M002 地点栏；P1；未排实体教室须标场景，不臆填。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F019；原稿类型及阶段：F019；string/null｜OriginalSession 原上课地点；I0/I1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F020",
      "label": "F020 · enum 调课/停课/补课/时间变更/组合｜Case 子类型",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F020 字段：enum 调课/停课/补课/时间变更/组合｜Case 子类型；I1；DOC；M003 申请意图；P1；语义不明请申请人澄清。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F020；原稿类型及阶段：F020；enum 调课/停课/补课/时间变更/组合｜Case 子类型；I1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F021",
      "label": "F021 · interval/list/unknown｜ProposedSession 拟新时段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F021 字段：interval/list/unknown｜ProposedSession 拟新时段；I1 条件；DOC + 核查 SCHED；M005 每原课节对应计划；P1；未确定可保留未知，不能算无冲突。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F021；原稿类型及阶段：F021；interval/list/unknown｜ProposedSession 拟新时段；I1 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F022",
      "label": "F022 · string/null｜ProposedSession 拟地点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F022 字段：string/null｜ProposedSession 拟地点；I1 条件；DOC + 核查 SCHED；M005 地点；P1；未定或无需变地点则区分 UNKNOWN/不适用。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F022；原稿类型及阶段：F022；string/null｜ProposedSession 拟地点；I1 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F023",
      "label": "F023 · list[class ID]｜TeachingClass 受影响教学班集合",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F023 字段：list[class ID]｜TeachingClass 受影响教学班集合；I1；SCHED/课程关联；M001/M005 班级列表；P1/P2；群体不明则待核通知覆盖，不采无关学生名册。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F023；原稿类型及阶段：F023；list[class ID]｜TeachingClass 受影响教学班集合；I1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F024",
      "label": "F024 · enum/unknown｜Case 原因类别",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F024 字段：enum/unknown｜Case 原因类别；I1；DOC；M003 原因类型；P2；校方允许原因清单未取，不自动驳回。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F024；原稿类型及阶段：F024；enum/unknown｜Case 原因类别；I1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F025",
      "label": "F025 · text｜Case 最少必要的原因说明",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F025 字段：text｜Case 最少必要的原因说明；I1；DOC；M003 原因说明段；P2/P3；未陈述则请补说明；涉及病情避免过采。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F025；原稿类型及阶段：F025；text｜Case 最少必要的原因说明；I1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F026",
      "label": "F026 · datetime/null｜Case 紧急事发/无法行课时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F026 字段：datetime/null｜Case 紧急事发/无法行课时间；I1 紧急；DOC/可核事件；M014 事件时间；P2；非紧急不适用；事发时间不明人工核。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F026；原稿类型及阶段：F026；datetime/null｜Case 紧急事发/无法行课时间；I1 紧急；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F027",
      "label": "F027 · list[ref]｜Evidence 原因证明关联",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F027 字段：list[ref]｜Evidence 原因证明关联；I1 条件；DOC；M004 段落/证件必要页；P3 可含；仅触发才索取，模糊则 UNREADABLE。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F027；原稿类型及阶段：F027；list[ref]｜Evidence 原因证明关联；I1 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F028",
      "label": "F028 · decimal 学时｜ProposedSession 拟停/缺学时",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F028 字段：decimal 学时｜ProposedSession 拟停/缺学时；I1 停课；DOC+SCHED；M005/M006 对照；P1；不知则待核教学任务，不擅算零。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F028；原稿类型及阶段：F028；decimal 学时｜ProposedSession 拟停/缺学时；I1 停课；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F029",
      "label": "F029 · interval/list｜ProposedSession 拟补课时段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F029 字段：interval/list｜ProposedSession 拟补课时段；I1 补课；DOC；M005 补课行；P1；尚未确定记 UNKNOWN 并交人安排。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F029；原稿类型及阶段：F029；interval/list｜ProposedSession 拟补课时段；I1 补课；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F030",
      "label": "F030 · decimal 学时｜ProposedSession 拟补学时",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F030 字段：decimal 学时｜ProposedSession 拟补学时；I1 停/补课；DOC+SCHED；M005/M006；P1；学时差未知需人工比对，不造硬时限。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F030；原稿类型及阶段：F030；decimal 学时｜ProposedSession 拟补学时；I1 停/补课；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F031",
      "label": "F031 · decimal 学时｜CourseOffering 规定/计划总学时",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F031 字段：decimal 学时｜CourseOffering 规定/计划总学时；V1；SCHED/正式教学任务；M006 任务书/进度；P1；源失联，不以个人估算作权威。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F031；原稿类型及阶段：F031；decimal 学时｜CourseOffering 规定/计划总学时；V1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F032",
      "label": "F032 · decimal 学时｜CourseOffering 事后已实际授课学时",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F032 字段：decimal 学时｜CourseOffering 事后已实际授课学时；X1/Z1；ACT/可信教学记录；M017 行课明细；P1/P2；尚未实施则不适用，未能核实则待办。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F032；原稿类型及阶段：F032；decimal 学时｜CourseOffering 事后已实际授课学时；X1/Z1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F033",
      "label": "F033 · integer｜CourseOffering 当学期已停课次数",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F033 字段：integer｜CourseOffering 当学期已停课次数；V1 研究生停课/局部旧规；SCHED/有效历史；M029 课程停课台账；P1；无历史不判“未超限”；阈值仍待现行确认。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F033；原稿类型及阶段：F033；integer｜CourseOffering 当学期已停课次数；V1 研究生停课/局部旧规；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F034",
      "label": "F034 · duration｜CourseOffering 当学期累计停课时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F034 字段：duration｜CourseOffering 当学期累计停课时间；V1 研究生停课/局部旧规；SCHED/有效历史；M029 历史时段；P1；不完整记 SOURCE_UNAVAILABLE，禁硬拒。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F034；原稿类型及阶段：F034；duration｜CourseOffering 当学期累计停课时间；V1 研究生停课/局部旧规；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F035",
      "label": "F035 · list[冲突]｜ProposedSession 师/班/室/考务冲突",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F035 字段：list[冲突]｜ProposedSession 师/班/室/考务冲突；V1；SCHED 权威快照及人工复核；M007 冲突明细；P2 可含；只查到部分资源为 UNKNOWN，非无冲突。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F035；原稿类型及阶段：F035；list[冲突]｜ProposedSession 师/班/室/考务冲突；V1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F036",
      "label": "F036 · string｜ProposedSession 冲突查询源版本/时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F036 字段：string｜ProposedSession 冲突查询源版本/时间；V1；SCHED；M007 快照 ID；P1；版本缺失则冲突判断不可长期复用。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F036；原稿类型及阶段：F036；string｜ProposedSession 冲突查询源版本/时间；V1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F037",
      "label": "F037 · ref/null｜ReviewEvent 本科课程组协调记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F037 字段：ref/null｜ReviewEvent 本科课程组协调记录；V1 本科；DOC/DEC；M008 协调意见；P2；未形成时列待后续，不能伪造其已同意。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F037；原稿类型及阶段：F037；ref/null｜ReviewEvent 本科课程组协调记录；V1 本科；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F038",
      "label": "F038 · ref/null｜ReviewEvent 学院（系）审核动作",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F038 字段：ref/null｜ReviewEvent 学院（系）审核动作；D1；DEC；M009 事件/签署页；P2；审核尚未发生则不适用，疑签名人工核。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F038；原稿类型及阶段：F038；ref/null｜ReviewEvent 学院（系）审核动作；D1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F039",
      "label": "F039 · ref/null｜ReviewEvent 本科校级备案动作",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F039 字段：ref/null｜ReviewEvent 本科校级备案动作；D1 本科；DEC；M010 备案标识；P2；不用学院意见自动填“已备案”。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F039；原稿类型及阶段：F039；ref/null｜ReviewEvent 本科校级备案动作；D1 本科；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F040",
      "label": "F040 · ref/null｜ReviewEvent 研究生变更批准动作",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F040 字段：ref/null｜ReviewEvent 研究生变更批准动作；D1 研究生调整；DEC；M011 批准事件；P2；无研院批准不标通过，现行性待核。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F040；原稿类型及阶段：F040；ref/null｜ReviewEvent 研究生变更批准动作；D1 研究生调整；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F041",
      "label": "F041 · ref/null｜ReviewEvent 研究生停课同意备案",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F041 字段：ref/null｜ReviewEvent 研究生停课同意备案；D1 研究生停课；DEC；M012 同意/备案事件；P2；与 F040 不互换，缺时交有权人员。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F041；原稿类型及阶段：F041；ref/null｜ReviewEvent 研究生停课同意备案；D1 研究生停课；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F042",
      "label": "F042 · ref/tri-state｜Actor 签发人真实权限核验",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F042 字段：ref/tri-state｜Actor 签发人真实权限核验；D1；AUTH/DEC；M009–M012 署名+授权版本；P2；身份未知不认可决定，不能信 Renderer。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F042；原稿类型及阶段：F042；ref/tri-state｜Actor 签发人真实权限核验；D1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F043",
      "label": "F043 · datetime｜Case 申请提交/补办时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F043 字段：datetime｜Case 申请提交/补办时间；I1；CASE 可信接收日志/DEC；M003 接收时间；P1；缺不能比较“提前”，不自行造提交时点。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F043；原稿类型及阶段：F043；datetime｜Case 申请提交/补办时间；I1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F044",
      "label": "F044 · ref/null｜Case 学校统一调整通知",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F044 字段：ref/null｜Case 学校统一调整通知；I1 统一安排；POL/DEC；M013 文号、对象、时间；P0/P1；未取官方通知则不能适用统一调整分支。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F044；原稿类型及阶段：F044；ref/null｜Case 学校统一调整通知；I1 统一安排；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F045",
      "label": "F045 · structured｜Case 拟通知对象、渠道、时点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F045 字段：structured｜Case 拟通知对象、渠道、时点；I1/V1 条件；DOC/单位安排；M015 通知计划；P2；校本是否前置强制待证，缺时提示而非驳回。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F045；原稿类型及阶段：F045；structured｜Case 拟通知对象、渠道、时点；I1/V1 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F046",
      "label": "F046 · ref/null｜ReviewEvent 实际学生通知证据",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F046 字段：ref/null｜ReviewEvent 实际学生通知证据；X1；ACT；M016 发布日志/回执；P2；未发布不能先填已通知，遮蔽学生隐私。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F046；原稿类型及阶段：F046；ref/null｜ReviewEvent 实际学生通知证据；X1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F047",
      "label": "F047 · list[ref]｜ReviewEvent 补课/授课实施证据",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F047 字段：list[ref]｜ReviewEvent 补课/授课实施证据；X1/Z1；ACT；M017 教学日志；P2；尚未授课不适用，实绩与拟案须对照。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F047；原稿类型及阶段：F047；list[ref]｜ReviewEvent 补课/授课实施证据；X1/Z1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F048",
      "label": "F048 · string/null｜CourseOffering 新生效课表版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F048 字段：string/null｜CourseOffering 新生效课表版本；X1；SCHED；M018 修改后安排；P1；未更新/读不到不声称课表已生效。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F048；原稿类型及阶段：F048；string/null｜CourseOffering 新生效课表版本；X1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F049",
      "label": "F049 · list[version ref]｜Case 原件、申请、重提版本链",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F049 字段：list[version ref]｜Case 原件、申请、重提版本链；I1/C1；CASE+DOC；M030/M025 版本谱系；P1/P2；缺关联时旧结论不得复用。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F049；原稿类型及阶段：F049；list[version ref]｜Case 原件、申请、重提版本链；I1/C1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F050",
      "label": "F050 · enum+ref｜Case 撤回请求与受理状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F050 字段：enum+ref｜Case 撤回请求与受理状态；C1 撤回；DOC/DEC；M023/M024；P2；申请不等于接受，撤回规则待校本确认。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F050；原稿类型及阶段：F050；enum+ref｜Case 撤回请求与受理状态；C1 撤回；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F051",
      "label": "F051 · list[ref]｜Case 补件/改动及受影响字段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F051 字段：list[ref]｜Case 补件/改动及受影响字段；C1 补件；DOC+CASE；M025 差异记录；P2；替换材料后需定向失效重审。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F051；原稿类型及阶段：F051；list[ref]｜Case 补件/改动及受影响字段；C1 补件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F052",
      "label": "F052 · enum+ref｜Case 人工复核/异议请求及结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F052 字段：enum+ref｜Case 人工复核/异议请求及结果；C1 复核；DOC/DEC；M026/M027；P2；无校方复核决定只写待办理。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F052；原稿类型及阶段：F052；enum+ref｜Case 人工复核/异议请求及结果；C1 复核；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F053",
      "label": "F053 · ref/null｜Actor 外籍教师请假授权结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F053 字段：ref/null｜Actor 外籍教师请假授权结论；V1 外教请假触发；LINK/DEC；M020 授权事项/范围；P2/P3；无此情形不适用；不替代调课批准。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F053；原稿类型及阶段：F053；ref/null｜Actor 外籍教师请假授权结论；V1 外教请假触发；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F054",
      "label": "F054 · list[ref]｜Case 邻接模板权威结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F054 字段：list[ref]｜Case 邻接模板权威结论；V1 触发；LINK；M021/M031 结果版本与范围；P2；缺则转办，不自产 T01-T02/T06/G04 结论。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F054；原稿类型及阶段：F054；list[ref]｜Case 邻接模板权威结论；V1 触发；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F055",
      "label": "F055 · ref+effective interval｜Policy 当期适用政策版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F055 字段：ref+effective interval｜Policy 当期适用政策版本；V1；POL；M022 条款/发布日期；P0/P1；失联/现行不明用 POLICY_UNCONFIRMED。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F055；原稿类型及阶段：F055；ref+effective interval｜Policy 当期适用政策版本；V1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F056",
      "label": "F056 · list[hash, locator, sourceVersion]｜Evidence 证据归属与提取日志",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F056 字段：list[hash, locator, sourceVersion]｜Evidence 证据归属与提取日志；I0+；CASE+原件/可信查询；每个 M 页、行、记录键；P2/P3 随源；丢失来源位置则不允许高置信自动结论。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F056；原稿类型及阶段：F056；list[hash, locator, sourceVersion]｜Evidence 证据归属与提取日志；I0+；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F057",
      "label": "F057 · structured｜ProposedSession 拟课节的跨校区流动、教师日负荷、教学班周课次、特殊教室与思政晚/周末等运行影响（含统计区间和适用学期）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F057 字段：structured｜ProposedSession 拟课节的跨校区流动、教师日负荷、教学班周课次、特殊教室与思政晚/周末等运行影响（含统计区间和适用学期）；V1，确有新安排且资源系统可见；SCHED 教学任务、跨本研排课及 POL 的对应学期约束；M032 的资源原始行、统计版本；SRC-012；P1/P2；仅在 2025–2026 第二学期可引用该通知的初排原则；其他学期先查当期政策。快照不足为 SOURCE_UNAVAILABLE；是否允许例外交有权人，不自动否决。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F057；原稿类型及阶段：F057；structured｜ProposedSession 拟课节的跨校区流动、教师日负荷、教学班周课次、特殊教室与思政晚/周末等运行影响（含统计区间和适用学期）；V1，确有新安排且资源系统可见；不自行猜测阈值或校方数据接口。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 身份、任课关联、教学班和归口单位；校方认证与教务任务管理者；AUTH/SCHED 主数据",
      "purpose": "身份、任课关联、教学班和归口单位；校方认证与教务任务管理者；AUTH/SCHED 主数据；I0 当前必需事实；授权教务导出并人工核验；F004–F015、F023；SRC-001/002/005；对应学期、教学任务和工号；源失联=SOURCE_UNAVAILABLE，身份不符=CONFLICT；不默认索取证件照；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "身份、任课关联、教学班和归口单位；校方认证与教务任务管理者；AUTH/SCHED 主数据；I0 当前必需事实；授权教务导出并人工核验；F004–F015、F023；SRC-001/002/005"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "M002 · 原课表、原节次地点、有效版本；校方排课管理部门；SCHED 课表行",
      "purpose": "原课表、原节次地点、有效版本；校方排课管理部门；SCHED 课表行；I0 当前必需事实；有权部门盖章/可核验导出；F004/F006/F008/F016–F019；SRC-001/002；学期/教学班/原课节/版本四元绑定；缺失阻断冲突判断，截图不能单独确认现行；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "原课表、原节次地点、有效版本；校方排课管理部门；SCHED 课表行；I0 当前必需事实；有权部门盖章/可核验导出；F004/F006/F008/F016–F019；SRC-001/002"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "M003 · 申请意图、理由、目标课程/课节、申请人及时间；任课人/授权经办；结构化申请或校本正式表",
      "purpose": "申请意图、理由、目标课程/课节、申请人及时间；任课人/授权经办；结构化申请或校本正式表；I1 当前必需事实；当期学校正式申请记录；F003/F017/F020/F024–F025/F043；SRC-001/002；与本案和原课表版本关联；未提交可存草稿，不能假装校方受理；文字不可读=UNREADABLE；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "申请意图、理由、目标课程/课节、申请人及时间；任课人/授权经办；结构化申请或校本正式表；I1 当前必需事实；当期学校正式申请记录；F003/F017/F020/F024–F025/F043；SRC-001/002"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M004",
      "name": "M004 · 支持个人原因事实的必要证明；申请人或事实签发方；医疗事件时间证明、公务通知等，仅在本校规则/人工核查要求时用",
      "purpose": "支持个人原因事实的必要证明；申请人或事实签发方；医疗事件时间证明、公务通知等，仅在本校规则/人工核查要求时用；I1/V1 条件必需；有权机构的可核证摘要而非整本病历；F024–F027；SRC-001/002（仅“特殊原因”，具体证明类型未明）；原因与时段对应，P3 最小化；无校本强制规定不一概拒批，缺时待人工评估；不可读=UNREADABLE；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "支持个人原因事实的必要证明；申请人或事实签发方；医疗事件时间证明、公务通知等，仅在本校规则/人工核查要求时用；I1/V1 条件必需；有权机构的可核证摘要而非整本病历；F024–F027；SRC-001/002（仅“特殊原因”，具体证明类型未明）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M005",
      "name": "M005 · 逐节“原安排→新安排/停课/拟补课”及学时；申请人、课程组；变更计划/表中课节",
      "purpose": "逐节“原安排→新安排/停课/拟补课”及学时；申请人、课程组；变更计划/表中课节；I1 当前必需事实（纯停课可将新时段标 UNKNOWN）；授权系统申请子记录；F017/F020–F023/F028–F030；SRC-001/002；每条绑原课节 ID 和申请版本；不许新时段覆盖原课表；缺核心信息=NEEDS_MATERIAL；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "逐节“原安排→新安排/停课/拟补课”及学时；申请人、课程组；变更计划/表中课节；I1 当前必需事实（纯停课可将新时段标 UNKNOWN）；授权系统申请子记录；F017/F020–F023/F028–F030；SRC-001/002"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M006",
      "name": "M006 · 既定课程总学时/教学计划，用于补课对账；课程归口单位/教务；任务书、教学日历",
      "purpose": "既定课程总学时/教学计划，用于补课对账；课程归口单位/教务；任务书、教学日历；V1 停/补课 条件必需；可信任务系统可查无需上传；F028/F030–F032；研究生 SRC-002 第 17 条，本科关联 SRC-001；同教学任务、培养计划版本；无来源=SOURCE_UNAVAILABLE，不得凭旧课程目录估算；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "既定课程总学时/教学计划，用于补课对账；课程归口单位/教务；任务书、教学日历；V1 停/补课 条件必需；可信任务系统可查无需上传；F028/F030–F032；研究生 SRC-002 第 17 条，本科关联 SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M007",
      "name": "M007 · 教师、教学班、教室和考务冲突；课表管理员；带时间戳/范围的占用查询",
      "purpose": "教师、教学班、教室和考务冲突；课表管理员；带时间戳/范围的占用查询；V1 拟新时段 当前必需核查事实；有权限人工排课冲突核定 M028；F021–F023/F035–F036；SRC-001/002 与教学秩序目的，详细算法待校本；查询快照和资源范围随版本；数据缺项=SOURCE_UNAVAILABLE，查出矛盾=CONFLICT；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "教师、教学班、教室和考务冲突；课表管理员；带时间戳/范围的占用查询；V1 拟新时段 当前必需核查事实；有权限人工排课冲突核定 M028；F021–F023/F035–F036；SRC-001/002 与教学秩序目的，详细算法待校本"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M008",
      "name": "M008 · 本科课程组协调形成的可核记录；课程组/学院；协调意见/签办事件",
      "purpose": "本科课程组协调形成的可核记录；课程组/学院；协调意见/签办事件；V1/D1 后续形成；学校授权协同系统记录；F037；本科 SRC-001 第 24 条；绑定申请版本，未协调不伪造“同意”；如协调结果与计划不符=CONFLICT；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "本科课程组协调形成的可核记录；课程组/学院；协调意见/签办事件；V1/D1 后续形成；学校授权协同系统记录；F037；本科 SRC-001 第 24 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M009",
      "name": "M009 · 学院（系）审核事实；学院有权人员；签办事件或核验文书",
      "purpose": "学院（系）审核事实；学院有权人员；签办事件或核验文书；D1 后续形成；授权校方 OA/纸质签章，经原渠道校验；F038/F042；SRC-001/002；必须含真实机构、动作、时间、申请版本；缺不推断“已审核”，疑签发=NEEDS_HUMAN_DECISION；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "学院（系）审核事实；学院有权人员；签办事件或核验文书；D1 后续形成；授权校方 OA/纸质签章，经原渠道校验；F038/F042；SRC-001/002"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M010",
      "name": "M010 · 本科报学校备案完成事实；学校有权管理部门；正式备案回执/登记事件",
      "purpose": "本科报学校备案完成事实；学校有权管理部门；正式备案回执/登记事件；D1 本科 后续形成；经有权部门核实的备案台账；F039/F042；SRC-001；备案非审批，可与学院审核不同时间；缺不宣称备案，签章不可读由校方查证；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "本科报学校备案完成事实；学校有权管理部门；正式备案回执/登记事件；D1 本科 后续形成；经有权部门核实的备案台账；F039/F042；SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M011",
      "name": "M011 · 研究生时间/地点变更批准；研究生院（部）；批准记录/正式意见",
      "purpose": "研究生时间/地点变更批准；研究生院（部）；批准记录/正式意见；D1 研究生变更 后续形成；授权研究生教务审批系统或核证文书；F040/F042；SRC-002 第 18 条；匹配课程、时段、申请版本及真实批准人；缺只表示尚未证实批准；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "研究生时间/地点变更批准；研究生院（部）；批准记录/正式意见；D1 研究生变更 后续形成；授权研究生教务审批系统或核证文书；F040/F042；SRC-002 第 18 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M012",
      "name": "M012 · 研究生中途停课同意备案；研究生院（部）；同意备案记录",
      "purpose": "研究生中途停课同意备案；研究生院（部）；同意备案记录；D1 研究生停课 后续形成；授权研究生教务记录；F041/F042；SRC-002 第 17 条；与 M011 动作类型不同，不能互换；缺时人工确认手续状态；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "研究生中途停课同意备案；研究生院（部）；同意备案记录；D1 研究生停课 后续形成；授权研究生教务记录；F041/F042；SRC-002 第 17 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M013",
      "name": "M013 · 学校统一变更的上位授权；学校有权发文单位；校历修订/统一活动正式通知",
      "purpose": "学校统一变更的上位授权；学校有权发文单位；校历修订/统一活动正式通知；I1 F 情形 条件必需；可核校方通知文号、URL、签发记录；F044/F055；SRC-010 仅指向待取制度，具体通知需个案新增 SRC；校历年份、校区、涉及课程及生效区间；未见通知=SOURCE_UNAVAILABLE，不以教师传闻替代；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "学校统一变更的上位授权；学校有权发文单位；校历修订/统一活动正式通知；I1 F 情形 条件必需；可核校方通知文号、URL、签发记录；F044/F055；SRC-010 仅指向待取制度，具体通知需个案新增 SRC"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M014",
      "name": "M014 · 突发无法行课和报告链的事发事实；任课人/学院；时间证明、报告/值班记录",
      "purpose": "突发无法行课和报告链的事发事实；任课人/学院；时间证明、报告/值班记录；E1/E2 条件必需（已发生时）；可信单位事件记录；F026/F027/F043；SRC-003 仅旧学院例；严格保留事发与报告时间，补签不伪装事前；材料不足时交人工，涉及健康细节按 P3 保护；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "突发无法行课和报告链的事发事实；任课人/学院；时间证明、报告/值班记录；E1/E2 条件必需（已发生时）；可信单位事件记录；F026/F027/F043；SRC-003 仅旧学院例"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M015",
      "name": "M015 · 拟学生通知方案：对象、渠道、时间；任课人/教学单位；计划性记录",
      "purpose": "拟学生通知方案：对象、渠道、时间；任课人/教学单位；计划性记录；I1/V1 条件需核，校本是否必交待证；学院安排/系统通知草稿；F023/F045；SRC-001/002 关联教学秩序，明确通知义务正文待找；标注“拟”且非送达实绩；缺时提示待办，不自动形成校本拒批；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "拟学生通知方案：对象、渠道、时间；任课人/教学单位；计划性记录；I1/V1 条件需核，校本是否必交待证；学院安排/系统通知草稿；F023/F045；SRC-001/002 关联教学秩序，明确通知义务正文待找"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M016",
      "name": "M016 · 已向实际教学班发布通知/送达事实；教学单位/通知渠道；日志或签收",
      "purpose": "已向实际教学班发布通知/送达事实；教学单位/通知渠道；日志或签收；X1 后续形成；可核校方发送记录、必要时脱敏确认；F023/F046；SRC-003 旧院规特殊情形，普遍要求待证；教学班与原新时段一致；未发送不能提前填写；个人手机号/全员名单须脱敏；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "已向实际教学班发布通知/送达事实；教学单位/通知渠道；日志或签收；X1 后续形成；可核校方发送记录、必要时脱敏确认；F023/F046；SRC-003 旧院规特殊情形，普遍要求待证"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M017",
      "name": "M017 · 计划课节的实际行课/补课、学时对账；任课人/教学单位；行课日志",
      "purpose": "计划课节的实际行课/补课、学时对账；任课人/教学单位；行课日志；X1/Z1 后续形成；授权课程教学日志/听课记录；F032/F047；研究生 SRC-002 第 17 条；实际日期时段和教学班绑定；未上课不缺件，声称补课完成却无证据为待核；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "计划课节的实际行课/补课、学时对账；任课人/教学单位；行课日志；X1/Z1 后续形成；授权课程教学日志/听课记录；F032/F047；研究生 SRC-002 第 17 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M018",
      "name": "M018 · 最新有效课表是否落地；教务排课管理员；正式 SCHED 新版本",
      "purpose": "最新有效课表是否落地；教务排课管理员；正式 SCHED 新版本；X1 后续形成；经有权核验的新课表导出；F048；SRC-001/002；与原版、批准/备案对象可回溯；新时段与批准不符=CONFLICT；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "最新有效课表是否落地；教务排课管理员；正式 SCHED 新版本；X1 后续形成；经有权核验的新课表导出；F048；SRC-001/002"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M019",
      "name": "M019 · 代理申请和实际签办授权；有权人事/教务；授权目录或委托凭据",
      "purpose": "代理申请和实际签办授权；有权人事/教务；授权目录或委托凭据；I0/I1/D1 条件必需（非本人或代签）；可信身份平台岗位授权/有效委托；F013–F015/F042；SRC-005 仅经办角色线索；授权作用域和起止时点明确；未授权则不得代签，非代办时不适用；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "代理申请和实际签办授权；有权人事/教务；授权目录或委托凭据；I0/I1/D1 条件必需（非本人或代签）；可信身份平台岗位授权/有效委托；F013–F015/F042；SRC-005 仅经办角色线索"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M020",
      "name": "M020 · 外籍教师相关请假许可；学院/对外合作与交流处；独立请假决定",
      "purpose": "外籍教师相关请假许可；学院/对外合作与交流处；独立请假决定；V1 外教请假 条件必需；外事/学院权威结论引用，不重复提交全文；F053；SRC-006 第三部分；身份、请假日期、批准对象对应；缺不代表调课自动拒批，触发时交人工核；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "外籍教师相关请假许可；学院/对外合作与交流处；独立请假决定；V1 外教请假 条件必需；外事/学院权威结论引用，不重复提交全文；F053；SRC-006 第三部分"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M021",
      "name": "M021 · 调课同时涉及人员更换的独立结论；T01-T02 有权业务 Owner；决定引用",
      "purpose": "调课同时涉及人员更换的独立结论；T01-T02 有权业务 Owner；决定引用；V1/D1 条件必需；T01-T02 有效结果，不能本模板作出；F012/F054；SRC-001/002 皆禁止擅改/代课，路由以派单为准；与更换的人、课程、时间及源版本绑定；无结论转办，不以调课表代签；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "调课同时涉及人员更换的独立结论；T01-T02 有权业务 Owner；决定引用；V1/D1 条件必需；T01-T02 有效结果，不能本模板作出；F012/F054；SRC-001/002 皆禁止擅改/代课，路由以派单为准"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M022",
      "name": "M022 · 现行校本规则、条件、期限、授权版本；教务处/研究生院；POL 正文或正式通知",
      "purpose": "现行校本规则、条件、期限、授权版本；教务处/研究生院；POL 正文或正式通知；V1 当前必需政策核定；校方确认并冻结的规则版本；F055；SRC-001/002/010；2018/2016/2017 旧限额未经现行核实不能生效；来源无全文=POLICY_UNCONFIRMED；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "现行校本规则、条件、期限、授权版本；教务处/研究生院；POL 正文或正式通知；V1 当前必需政策核定；校方确认并冻结的规则版本；F055；SRC-001/002/010"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M023",
      "name": "M023 · 撤回申请事实；本人/合法代办；结构化请求",
      "purpose": "撤回申请事实；本人/合法代办；结构化请求；C1 撤回 条件必需；学校受理登记；F050；SRC-001/002 仅为原事项依据，撤回专门 SRC 待取得；指向被撤回的申请版本；未收到请求不产生撤回动作；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "撤回申请事实；本人/合法代办；结构化请求；C1 撤回 条件必需；学校受理登记；F050；SRC-001/002 仅为原事项依据，撤回专门 SRC 待取得"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M024",
      "name": "M024 · 撤回是否受理/生效的外部决定；校方有权部门；正式事件",
      "purpose": "撤回是否受理/生效的外部决定；校方有权部门；正式事件；C1 撤回 后续形成；可核校方状态/文书；F050；与 SRC-001/002 原事项相关，决定权限 SRC 待取得；不可由 M023 推断；缺则状态“撤回待确认”；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "撤回是否受理/生效的外部决定；校方有权部门；正式事件；C1 撤回 后续形成；可核校方状态/文书；F050；与 SRC-001/002 原事项相关，决定权限 SRC 待取得"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M025",
      "name": "M025 · 补件、更改课节或修改原因的增量包；申请人/经办；变更单与新版证据",
      "purpose": "补件、更改课节或修改原因的增量包；申请人/经办；变更单与新版证据；C1 补件/重提 条件必需；受理系统的版本差异；F049/F051/F056；关联原源 SRC-001/002；每个替换文件保存旧新哈希、目标 F；新时段使旧冲突/审批覆盖需重核；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "补件、更改课节或修改原因的增量包；申请人/经办；变更单与新版证据；C1 补件/重提 条件必需；受理系统的版本差异；F049/F051/F056；关联原源 SRC-001/002"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M026",
      "name": "M026 · 事实重查/学校异议或复核请求；请求者；书面/结构化陈述",
      "purpose": "事实重查/学校异议或复核请求；请求者；书面/结构化陈述；C1 异议 条件必需；有权受理系统；F052；SRC-001/002 仅为原事项依据，复核专门 SRC 待取得；绑定原结果和依据；可提出请求不等于已取得法定复核权；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "事实重查/学校异议或复核请求；请求者；书面/结构化陈述；C1 异议 条件必需；有权受理系统；F052；SRC-001/002 仅为原事项依据，复核专门 SRC 待取得"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M027",
      "name": "M027 · 有权机关正式复核结果；学校决定单位；签办事件",
      "purpose": "有权机关正式复核结果；学校决定单位；签办事件；C1 异议 后续形成；可核正式复核结论；F052/F042；与 SRC-001/002 原事项相关，复核权限 SRC 待取得；不能由 AI 生成、替代或撤销学校结论；未作决定则待办理；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "有权机关正式复核结果；学校决定单位；签办事件；C1 异议 后续形成；可核正式复核结论；F052/F042；与 SRC-001/002 原事项相关，复核权限 SRC 待取得"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M028",
      "name": "M028 · 资源冲突无法由系统覆盖时的人工核定；教务/研究生管理单位；手工复核意见",
      "purpose": "资源冲突无法由系统覆盖时的人工核定；教务/研究生管理单位；手工复核意见；V1 冲突触发 条件必需；授权管理员说明查询范围/冲突处理决定；F035/F036/F042；SRC-001/002 保障教学秩序；含审批人的真实权限、版本、对应资源；不能以不完整截图证明“无冲突”；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "资源冲突无法由系统覆盖时的人工核定；教务/研究生管理单位；手工复核意见；V1 冲突触发 条件必需；授权管理员说明查询范围/冲突处理决定；F035/F036/F042；SRC-001/002 保障教学秩序"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M029",
      "name": "M029 · 研究生停课累计次数与时长的历史事实；研究生教学运行单位；课程历史台账",
      "purpose": "研究生停课累计次数与时长的历史事实；研究生教学运行单位；课程历史台账；V1 研究生停课 条件必需；受权排课历史/正式记录；F033/F034；SRC-002 第 17 条，现行性待证；需学期、课程、主讲、统计口径；源不可达不能把 0 当真，硬阈值需校方重新确认；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "研究生停课累计次数与时长的历史事实；研究生教学运行单位；课程历史台账；V1 研究生停课 条件必需；受权排课历史/正式记录；F033/F034；SRC-002 第 17 条，现行性待证"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M030",
      "name": "M030 · 历次申请、原课表、决定及证据版本链；审核案卷/教务管理者；不可篡改历史索引",
      "purpose": "历次申请、原课表、决定及证据版本链；审核案卷/教务管理者；不可篡改历史索引；I0/C1 当前必需溯源事实；真实原案/历史系统记录；F001/F002/F049/F056；SRC-001/002 是业务依据，版本管理为技术要求；旧版只读留存；关联缺失则旧决定适用性未知，禁冒名沿用；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "历次申请、原课表、决定及证据版本链；审核案卷/教务管理者；不可篡改历史索引；I0/C1 当前必需溯源事实；真实原案/历史系统记录；F001/F002/F049/F056；SRC-001/002 是业务依据，版本管理为技术要求"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M031",
      "name": "M031 · 邻接领域的有效限制/审批结论；G03/G04、T01-T02/T01-T03/T01-T09、T05/T06、S02 等业务 Owner；带权威来源引用",
      "purpose": "邻接领域的有效限制/审批结论；G03/G04、T01-T02/T01-T03/T01-T09、T05/T06、S02 等业务 Owner；带权威来源引用；V1 跨界触发 条件必需；原业务正式决定及 sourceVersion；F054；SRC-011 已核目录但非可用服务；对象、版本、效力区间与签发权必须对齐；链接过期则原 Owner 重核，本模板不重做其决定；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "邻接领域的有效限制/审批结论；G03/G04、T01-T02/T01-T03/T01-T09、T05/T06、S02 等业务 Owner；带权威来源引用；V1 跨界触发 条件必需；原业务正式决定及 sourceVersion；F054；SRC-011 已核目录但非可用服务"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M032",
      "name": "M032 · 拟变更课节的教学运行影响快照；教务处、研究生课表管理及校区教学运行单位；教师日学时、教学班周课次、思政晚/周末、跨教学区流动及场地适配的最少汇总数据",
      "purpose": "拟变更课节的教学运行影响快照；教务处、研究生课表管理及校区教学运行单位；教师日学时、教学班周课次、思政晚/周末、跨教学区流动及场地适配的最少汇总数据；V1 拟安排触发 条件需核事实，非申请人必交表；可信 SCHED 或经办校核快照，关联 M002/M005/M007；F005/F006/F021–F023/F036/F057；SRC-012/015；必载学期、教学班、查询时刻、覆盖本研/考务系统与源版本；不足为 SOURCE_UNAVAILABLE。初排原则影响只提示有权人评估，非所有学期调课的自动硬阈值；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "拟变更课节的教学运行影响快照；教务处、研究生课表管理及校区教学运行单位；教师日学时、教学班周课次、思政晚/周末、跨教学区流动及场地适配的最少汇总数据；V1 拟安排触发 条件需核事实，非申请人必交表；可信 SCHED 或经办校核快照，关联 M002/M005/M007；F005/F006/F021–F023/F036/F057；SRC-012/015"
      ],
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "evidence-checks",
      "name": "R02 原稿规则逐条核验",
      "description": "依据原稿 T01-T01 §08 的全部独立 R 条目。触发未知不能当不适用；后续材料不视为起案缺件，SRC 仅为研究索引。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "R001 · 唯一课程教学任务，I0",
          "requirement": "R001 R001 唯一课程教学任务，I0；T=课程变更案；F=学校统一非逐课任务且有对应正式授权；U=学段或教学任务未知→S；SRC-001/002；F004–F010/F023；M001；A/B 的学期、课程 ID、教学班、归口单位及任务一一对应；重名课程不合并，跨本研分别建关联；一致 PF；不一致 C；权威源不可取 S；教务任务管理员。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R002",
          "title": "R002 · 实名任课与申报权，I0",
          "requirement": "R002 R002 实名任课与申报权，I0；T=教师个人或以教师名义申报；F=有效校级统一单位发起；U=谁有权申报不明→H；SRC-001/002/005；F011–F013；M001/M019；A 认证主体 ID 对教学任务及当期授权，不以姓名/Renderer/旧工牌代替；岗位描述不授批准权；一致 PF；身份矛盾 C；授权未证 H；身份及开课单位。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R003",
          "title": "R003 · 代理资格，I1",
          "requirement": "R003 R003 代理资格，I1；T=F014 存在代理；F=可信认定本人亲办；U=代理关系无法核实→H；SRC-001/002/005；F013–F015；M019；A/B 核委托对象、事项、学期、权限区间；不能以代理人签名代签校方决定；授权可证 PF；凭据模糊 U/缺必需文件 N；真实性未明 H；授权管理者。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "R004 · 有效原课表，I0",
          "requirement": "R004 R004 有效原课表，I0；T=逐节课程调整；F=已证实学校无对应原排课的独立事件；U=原安排是否存在未知→S；SRC-001/002；F016–F019；M002；A/B 比对课节 ID、原时段地点和原课表有效版本；过期截图 C 不能覆盖新课表；PF/C/S；课表管理员。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "R005 · 申请课节映射，I1",
          "requirement": "R005 R005 申请课节映射，I1；T=已发起申请；F=仅浏览/未提交草稿；U=申请收件状态不明→S；SRC-001/002；F001–F003/F017/F020/F043/F049；M003/M005/M030；每个原课节映射一个变更动作或明确 UNKNOWN 补课；校方收件时点独立于手填日期；A/C 与案卷版本相互核；断链 C，当前申请事实缺 N，不可读 U，一致 PF；申请人/受理经办。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R006",
          "title": "R006 · 事由及最小证明，I1/V1",
          "requirement": "R006 R006 事由及最小证明，I1/V1；T=申请主张特殊原因且当前政策/有权经办要求核证明；F=不触发附证且说明已具备；U=可接受原因/证据强制性未知→P/H；SRC-001/002；F024/F025/F027；M003/M004；对拟停课时间与必要事实区间；C/B 可供人评估，避免采整本病历；原因充分性属于裁量；事实匹配 PF；必需现件缺 N、原件不可读 U；是否足以准许 H；学院审核人。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "R007 · 突发事故事实与顺序，I1",
          "requirement": "R007 R007 突发事故事实与顺序，I1；T=声称紧急或事后补办；F=有证据为普通事前申请；U=是否紧急待事实认定→H；SRC-001/002/003；F026/F027/F043；M014/M003；C/B/A 比对发生、报告、提交的实际时间；SRC-003 只作旧院例，不承认全校补签权；时间可证 PF；证据不清 U/N；追认许可 P/H；学院/本学段校级部门。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "R008 · 新课节/补课方案可识别，I1",
          "requirement": "R008 R008 新课节/补课方案可识别，I1；T=拟改时间/地点或补课；F=有权确认纯停课且目前无需确定补课时段；U=是否须同时定时未知→P；SRC-001/002；F020–F022/F028–F030；M005；原→拟周次、节次、地点逐项比；允许纯停课的新时段为 UNKNOWN，不伪造冲突阴性；可比较 PF；当前应填而缺 N，尚可延期确定 H/P；申请人及排课经办。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "R009 · 受影响教学班覆盖，I1/V1",
          "requirement": "R009 R009 受影响教学班覆盖，I1/V1；T=涉及一个或多个真实教学班；F=非教学班的学校统一事项已权威确认；U=班级范围取不到→S；SRC-001/002；F008/F017/F023；M001/M005；A/B 对教学班、课程班联合与原课节逐条关联；不能从学生姓名表猜覆盖；一致 PF、遗漏 C、源失联 S；开课单位。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "R010 · 教师/班级/场地冲突，V1",
          "requirement": "R010 R010 教师/班级/场地冲突，V1；T=具体拟时段和地点存在可比较对象；F=经确认纯停课未有新安排；U=计划新时段未知→H/P（若当期已核必填才 N）；SRC-001/002/012；F006/F021–F023/F035；M005/M007/M028；A/B 区间重叠交叉比，同一师/班/室及考务，须跨本研数据源核覆盖；人工冲突处理须 A/B 权限凭据，交通换场时间未核阈值不硬判；无冲突 PF；发现占用 C；覆盖不足 S；管理员，例外 H。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "R011 · 冲突快照完整与时效，V1",
          "requirement": "R011 R011 冲突快照完整与时效，V1；T=已报告“无冲突”或冲突结论；F=未进入资源核验；U=快照覆盖范围未知→S；SRC-001/002/012；F035/F036/F016；M007/M028/M002/M032；核查询时点、学期、校区和本科/研究生/考试数据源；覆盖缺失不得声明无冲突；B 人工核定注明缺失资源；足量 PF；范围矛盾 C，无法取完整源 S；课表/考务管理员。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "R012 · 停课与补课学时账，V1/Z1",
          "requirement": "R012 R012 停课与补课学时账，V1/Z1；T=停/补导致时数变化；F=仅等学时换时间且权威课程计划吻合；U=规定学时来源未知→S；SRC-001/002；F028–F032；M005/M006/M017；A/B 课程计划总学时减已/拟实授学时；研究生 SRC-002 明述不得减总学时但现行效力 P；本科具体硬阈值待核；算术一致 PF（非政策许可）；差额 C，需裁量 H/P；教务/研究生管理。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R013",
          "title": "R013 · 研究生停课历史与次数，V1",
          "requirement": "R013 R013 研究生停课历史与次数，V1；T=研究生中途停课或已证实适用当期专项次数规则；F=非此情形；U=是否适用历史规则→P；SRC-002/003/004；F005/F033/F034；M029/M022；A/B 仅统计同学期同课程完整期间；不以 2018“2 次/3 周”、旧院“3 次”硬判 2026；事实完整 PF；台账缺 S；是否超限 P/H；研究生院/校方制定者。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R014",
          "title": "R014 · 本科课程组协调，V1/D1",
          "requirement": "R014 R014 本科课程组协调，V1/D1；T=本科常规变更且现行流程要求协调；F=权威统一通知明确豁免；U=个案豁免不明→P；SRC-001/010；F005/F037/F049；M008/M013；A/B 查课程组真实协调意见覆盖的申请版本；未到协调阶段不先要意见；匹配 PF；当前应有而尚待办理 H，不向申请人强制上传；课程组/学院。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "R015 · 学院（系）审核事件，D1",
          "requirement": "R015 R015 学院（系）审核事件，D1；T=本研常规学院审核环节；F=有效特例明确免该环节；U=统一调整免审与否未明→P；SRC-001/002；F038/F042/F049；M009；A/B 查院审动作类型、时间、目标版本；不能把教学秘书经办当院审；真实事件 PF；对象不符 C，无决定 H；学院有权审核人。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R016",
          "title": "R016 · 本科报学校备案，D1",
          "requirement": "R016 R016 本科报学校备案，D1；T=本科变更已到校级备案环节；F=研课或正式豁免；U=备案是否必经待校级通知→P；SRC-001/010；F005/F039/F042/F049；M010/M009；A/B 校方备案事件，独立于院审；备案不等于“审批许可”及课表生效；备案记录可证 PF；尚未办理 H，伪记录 C；本科校级备案岗位。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "R017 · 研究生时间/地点批准，D1",
          "requirement": "R017 R017 研究生时间/地点批准，D1；T=研究生时间/地点调整按当期有效条款须批准；F=本科或只有研究生停课的不同动作；U=现行批准路径未知→P；SRC-002/013/014；F005/F020/F040/F042/F049；M011/M022；A/B 核可验证研院批准事件与新时段、申请版匹配；若最新办法或授权无法取得，可核文书存在但不得确认 2018 这一路径仍为现行必经；文书事实可证 PF；现行链路 P；未作动作 H；冒学院意见 C；研究生院。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "R018 · 研究生中途停课同意备案，D1",
          "requirement": "R018 R018 研究生中途停课同意备案，D1；T=研究生中途停课且现行条款要求同意备案；F=本科或不涉及停课；U=条款已修订情况未知→P；SRC-002/013/014；F005/F020/F041/F042/F049；M012/M022；A/B 查研院“同意备案”动作本身，不能从普通时间变更批准推导；须单独确认 2026 仍使用此动作；已取得文书事实 PF；现行性 P；待办理 H；动作不符 C；研究生院。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "R019 · 签发者权限与决定对象，D1/C1",
          "requirement": "R019 R019 签发者权限与决定对象，D1/C1；T=出现院审/备案/批准/撤回或复核决定；F=无任何决定且仍在前期；U=授权目录失联→S/H；SRC-001/002/005；F038–F042/F049/F050/F052；M009–M012/M019/M024/M027；A/B 以可信身份、岗位授权起止、签办动作、课节及申请版本联核；上传印章图片不足；合法签办事实 PF；越权/版本不符 C/H，授权源失联 S；有权校方管理员。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R020",
          "title": "R020 · 学校统一变更通知，I1",
          "requirement": "R020 R020 学校统一变更通知，I1；T=选择 F 学校统一调整；F=可核个人常规申报；U=是否有正式集体通知未知→S；SRC-001/010；F003/F044/F055；M013/M022；A/B 对签发机关、学期、校区、受影响课节、有效期及豁免条款；SRC-010 仅制度线索；范围一致 PF，通知缺 S、口述替代 C、程序豁免 P；学校发文部门。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R021",
          "title": "R021 · 学院特别规定适用，V1",
          "requirement": "R021 R021 学院特别规定适用，V1；T=G1/G2 学院专项或声称旧院规定；F=不属这些单位；U=是否仍适用旧规→P；SRC-001/002/003/004；F005/F009/F033/F034/F055；M001/M022/M029；依层级、发布时间和校方废改记录定适用范围；仅能确认旧版条文存在；历史事实 PF，2026 硬阈值 P；学院教学办与校级制度主管。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "R022 · 外籍教师请假外部决定，V1",
          "requirement": "R022 R022 外籍教师请假外部决定，V1；T=G3 且该次另需请假许可；F=非外教/无外事请假事项；U=请假义务或效力未知→P/H；SRC-006；F012/F053；M020/M001；B/A 核请假主体、时段、学院及对外合作与交流处权限；外教请假≠调课许可；结论可证 PF；取不到 S，权限争议 H；外事归口部门。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "R023 · 任课人更换独立授权，V1",
          "requirement": "R023 R023 任课人更换独立授权，V1；T=同案改变任课/代课主体；F=任课人不变且任务可证；U=教师变化来源未知→S；SRC-001/002；F012/F020/F054；M001/M021；A/B 仅引用 T01-T02 的正式决定及有效版本，不由本案批准换人；关联有效 PF；无权威结论 S/H；T01-T02 业务 Owner。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "R024 · 邻接权威结论与 G50 去重，V1",
          "requirement": "R024 R024 邻接权威结论与 G50 去重，V1；T=触及人员更换、独立教室借用、安全、考务、课程建设或证据核验；F=可信证明不涉跨界授权；U=邻项权利/真实服务是否适用未知→P/H；SRC-001/002/011；F054/F056；M031/M021/M030；G50 技术目录已核，但全部 NOT_RUN，不能把候选名当已出结论；仅消费真实原 Owner 的 decisionId/checkId+target+sourceVersion+有效区间；引用有效 PF；无权威来源 S/P/H；邻接业务 Owner。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R025",
          "title": "R025 · 学生通知方案，I1/V1",
          "requirement": "R025 R025 学生通知方案，I1/V1；T=计划涉及受影响学生且有权流程要求事前规划；F=校方统一通知明确已全覆盖且无需另拟方案；U=方案是否为前置必交→P；SRC-001/002/003；F023/F045；M015/M005；C/A 区分“拟通知”与实际送达；校本普适强制形式未核实；有方案 PF；未知义务 P/H；开课单位，不作为起案自动拒绝。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R026",
          "title": "R026 · 已发生学生通知，X1",
          "requirement": "R026 R026 已发生学生通知，X1；T=进入需落实通知的实施阶段；F=尚在申请/审批前或有效校方通知已完全覆盖；U=渠道或送达标准未知→P；SRC-001/002/003/016；F023/F046；M016/M013；A/B/ACT 对比教学班覆盖、发送时刻、修改前后课节版与替代安排；SRC-016 只是具体公告实例，不能推定一般法定送达率；草稿非实绩；可核发布 PF；错班 C；源失联 S；有效通知期限 P；教学单位。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R027",
          "title": "R027 · 实际行课/补课，X1/Z1",
          "requirement": "R027 R027 实际行课/补课，X1/Z1；T=拟补课时间已到且主张已完成；F=授课尚未到期；U=是否已实施无法访问→S；SRC-002/001；F028–F032/F047；M017/M006/M005；ACT/A 比对课节、班级、实际学时、补课时段及受权记录；不能用原计划当实绩；准确 PF；课时矛盾 C、记录失联 S；教学单位/研院。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R028",
          "title": "R028 · 生效课表与批准对象一致，X1",
          "requirement": "R028 R028 生效课表与批准对象一致，X1；T=有人主张课表已经更改生效；F=仍处审批前未宣称生效；U=新课表查询不可达→S；SRC-001/002；F016/F021/F022/F039–F041/F048；M002/M010–M012/M018；SCHED A 核新旧版本、有效日、决定目标；即使有批准截图也不代替生效记录；匹配 PF，不符 C，查不到 S；课表管理员。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R029",
          "title": "R029 · 补件、替换和旧结论依赖，C1",
          "requirement": "R029 R029 补件、替换和旧结论依赖，C1；T=补件或计划/证明变更；F=同案无新版本且来源未变；U=差异谱系未知→S；SRC-001/002；F016–F023/F027/F049/F051/F056；M025/M030/M003/M005；CASE 按证据哈希、fieldId、课节 ID 精准失效；决定的覆盖范围重新核真实性，不自动承接；版本链闭合 PF；断链 C/S；案卷 Owner + 原有权审批部门。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R030",
          "title": "R030 · 撤回请求主体与对象，C1",
          "requirement": "R030 R030 撤回请求主体与对象，C1；T=收到撤回请求；F=无撤回且可信历史可证；U=请求是否由本人/授权代理提出→H；SRC-001/002（仅原事项，无撤回授权条款）；F011/F015/F049/F050；M023/M019/M030；A/B/C 核发起者、原申请版本、收件时间，已发生教学事实不抹除；请求权政策问题另由 R034；请求事实可证 PF；缺当前请求详情 N；身份冲突 C/H；原受理单位。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "R031 · 撤回受理与实际效力，C1",
          "requirement": "R031 R031 撤回受理与实际效力，C1；T=已提交 R030 所核撤回请求且校方已处理/待处理；F=无撤回请求；U=是否允许、何时生效未知→P/H；SRC-001/002（无专门撤回规定）；F049/F050/F042；M023/M024/M030；A/B 只认有权机关撤回受理/驳回事件、签发时间与作用申请版本；不能从 M023 推 M024；可核学校动作 PF；未作动作 H，政策依据未知 P，伪签 C；有权受理部门。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "R032 · 事实异议/正式复核请求，C1",
          "requirement": "R032 R032 事实异议/正式复核请求，C1；T=收到异议/复核请求；F=可信记录可证未提出；U=请求者资格或正式受理路径不明→P/H；SRC-001/002（未提供复核专门规定）；F011/F015/F049/F052；M026/M019/M030；先核请求对象是事实规则还是原决定，原证据与版本、申请主体；提出事实异议≠法定复核权；请求存在 PF；当前请求不可读 U/N；有权受理路径 P；事实审核经办/校方受理机构。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R033",
          "title": "R033 · 正式复核决定的真实性，C1",
          "requirement": "R033 R033 正式复核决定的真实性，C1；T=校方声称已对该次正式复核作出决定；F=仅提出请求、尚未决定；U=决定权限/签章未核→H/S；SRC-001/002（复核权限条款待取）；F042/F049/F052/F056；M026/M027/M030；A/B 核有权机关、复核动作、申请版本、原决定与生效时间，AI 不能签发/撤销原决定；有权动作 PF，主体/对象错 C、无可核权限 H/S；正式复核部门。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R034",
          "title": "R034 · 当前政策、时限和授权闸门，V1/D1/C1",
          "requirement": "R034 R034 当前政策、时限和授权闸门，V1/D1/C1；T=要依据规则判断可受理/可审批/撤回/复核/逾期/次数；F=仅陈述不依赖硬阈值的原始事实；U=版本/适用时间未明→P；SRC-001/002/003/004/010/012/013/014；F005/F009/F020/F043/F050/F052/F055；M022/M003/M023/M026；POL 核发文/修订、适用学段和时间、层级；尤其核实 2018 暂行办法与后续《研究生课程教学管理办法》关系，禁把旧限额和 2025 初排原则当 2026 全校临时调课阈值；仅政策有效匹配可证时 PF；否则 P；教务处/研究生院主管。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R035",
          "title": "R035 · 材料归属、可读性与链路，I0+",
          "requirement": "R035 R035 材料归属、可读性与链路，I0+；T=本次核验使用任一证据；F=规则确无证据依赖；U=提取段落或材料版本不明→U/S；SRC-001/002/011（技术追溯，不把 G50 当校规）；F001/F049/F056；M001/M030 及被核的对应 M；每个结论存材料 ID、原始哈希、页行/系统记录、目标课程课节、读取版本；OCR 置信不代替原件；一致 PF，无法读取 U，材料归属不符 C，来源失联 S；材料经办/审核者。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R036",
          "title": "R036 · 拟排课的运行负荷与跨校区影响，V1",
          "requirement": "R036 R036 拟排课的运行负荷与跨校区影响，V1；T=申请包含明确新时段，且针对该学期存在可核排课原则/跨教学区要求；F=只有纯停课且尚无补课安排，或该条款由有效通知证明不适用；U=学期政策或跨本研源覆盖不明→P/S；SRC-012/015；F004–F006/F021–F023/F036/F057；M002/M005/M032；A/B 查该教师拟日理论学时、教学班拟周课次、课程类型/夜间与周末、东/西教学区连续课节、特殊设备需求；仅 2025–2026 第二学期可直接对照 SRC-012 初排原则，其他学期需当期文件。发现影响是事实/风险提示，是否准变仍由校方裁量；影响计算可证 PF（附风险明细）；源不全 S；政策不明 P；实际排课影响有争议 H；教务/研院/校区课表管理员。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
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
      "name": "建案与事项/材料归属定位（不代表校方受理）",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "evidence-review",
      "workflowOwner": "local"
    },
    {
      "id": "evidence-review",
      "name": "原稿 R001 起各条独立事实核验与条件异常分流",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "intake",
      "nextStageId": "human-confirmation",
      "workflowOwner": "local"
    },
    {
      "id": "human-confirmation",
      "name": "现行政策、办理权限及正式决定仅交有权人员确认",
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
  "createdAt": "2026-10-24T00:00:00.000Z"
}

export const r02Metadata = {
  "templateId": "T01-T01",
  "name": "课程调课、停课、补课与教学时间变更审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T01-T01.md",
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/T01-T01.md",
  "sourceDocumentBytes": 135943,
  "sourceDocumentSha256": "26fc39750026d2e61fb4093c8460a5582a816fae6431a7eeb4ff7cc74d38e32d",
  "sourceHashBasis": "dispatch manifest SHA-256; exact original Git blob bytes plus one LF (LINE_ENDING_DRIFT_ONE_LF)",
  "reviewedDocumentSha256": "a35ad6ffeb9ab2d7a949fd09dc5e1201ea536cbcfb2c3bd75db07af6e6c32e32",
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
        "SRC-002"
      ],
      "fieldIds": [
        "F004",
        "F005",
        "F006",
        "F007",
        "F008",
        "F009",
        "F010",
        "F023"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R001 唯一课程教学任务，I0；T=课程变更案；F=学校统一非逐课任务且有对应正式授权；U=学段或教学任务未知→S；SRC-001/002；F004–F010/F023；M001；A/B 的学期、课程 ID、教学班、归口单位及任务一一对应；重名课程不合并，跨本研分别建关联；一致 PF；不一致 C；权威源不可取 S；教务任务管理员"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "fieldIds": [
        "F011",
        "F012",
        "F013"
      ],
      "materialSlotIds": [
        "M001",
        "M019"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R002 实名任课与申报权，I0；T=教师个人或以教师名义申报；F=有效校级统一单位发起；U=谁有权申报不明→H；SRC-001/002/005；F011–F013；M001/M019；A 认证主体 ID 对教学任务及当期授权，不以姓名/Renderer/旧工牌代替；岗位描述不授批准权；一致 PF；身份矛盾 C；授权未证 H；身份及开课单位"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "fieldIds": [
        "F013",
        "F014",
        "F015"
      ],
      "materialSlotIds": [
        "M019"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R003 代理资格，I1；T=F014 存在代理；F=可信认定本人亲办；U=代理关系无法核实→H；SRC-001/002/005；F013–F015；M019；A/B 核委托对象、事项、学期、权限区间；不能以代理人签名代签校方决定；授权可证 PF；凭据模糊 U/缺必需文件 N；真实性未明 H；授权管理者"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F016",
        "F017",
        "F018",
        "F019"
      ],
      "materialSlotIds": [
        "M002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R004 有效原课表，I0；T=逐节课程调整；F=已证实学校无对应原排课的独立事件；U=原安排是否存在未知→S；SRC-001/002；F016–F019；M002；A/B 比对课节 ID、原时段地点和原课表有效版本；过期截图 C 不能覆盖新课表；PF/C/S；课表管理员"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F001",
        "F002",
        "F003",
        "F017",
        "F020",
        "F043",
        "F049"
      ],
      "materialSlotIds": [
        "M003",
        "M005",
        "M030"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R005 申请课节映射，I1；T=已发起申请；F=仅浏览/未提交草稿；U=申请收件状态不明→S；SRC-001/002；F001–F003/F017/F020/F043/F049；M003/M005/M030；每个原课节映射一个变更动作或明确 UNKNOWN 补课；校方收件时点独立于手填日期；A/C 与案卷版本相互核；断链 C，当前申请事实缺 N，不可读 U，一致 PF；申请人/受理经办"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F024",
        "F025",
        "F027"
      ],
      "materialSlotIds": [
        "M003",
        "M004"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R006 事由及最小证明，I1/V1；T=申请主张特殊原因且当前政策/有权经办要求核证明；F=不触发附证且说明已具备；U=可接受原因/证据强制性未知→P/H；SRC-001/002；F024/F025/F027；M003/M004；对拟停课时间与必要事实区间；C/B 可供人评估，避免采整本病历；原因充分性属于裁量；事实匹配 PF；必需现件缺 N、原件不可读 U；是否足以准许 H；学院审核人"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "fieldIds": [
        "F026",
        "F027",
        "F043"
      ],
      "materialSlotIds": [
        "M003",
        "M014"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R007 突发事故事实与顺序，I1；T=声称紧急或事后补办；F=有证据为普通事前申请；U=是否紧急待事实认定→H；SRC-001/002/003；F026/F027/F043；M014/M003；C/B/A 比对发生、报告、提交的实际时间；SRC-003 只作旧院例，不承认全校补签权；时间可证 PF；证据不清 U/N；追认许可 P/H；学院/本学段校级部门"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F020",
        "F021",
        "F022",
        "F028",
        "F029",
        "F030"
      ],
      "materialSlotIds": [
        "M005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R008 新课节/补课方案可识别，I1；T=拟改时间/地点或补课；F=有权确认纯停课且目前无需确定补课时段；U=是否须同时定时未知→P；SRC-001/002；F020–F022/F028–F030；M005；原→拟周次、节次、地点逐项比；允许纯停课的新时段为 UNKNOWN，不伪造冲突阴性；可比较 PF；当前应填而缺 N，尚可延期确定 H/P；申请人及排课经办"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F008",
        "F017",
        "F023"
      ],
      "materialSlotIds": [
        "M001",
        "M005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R009 受影响教学班覆盖，I1/V1；T=涉及一个或多个真实教学班；F=非教学班的学校统一事项已权威确认；U=班级范围取不到→S；SRC-001/002；F008/F017/F023；M001/M005；A/B 对教学班、课程班联合与原课节逐条关联；不能从学生姓名表猜覆盖；一致 PF、遗漏 C、源失联 S；开课单位"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012"
      ],
      "fieldIds": [
        "F006",
        "F021",
        "F022",
        "F023",
        "F035"
      ],
      "materialSlotIds": [
        "M005",
        "M007",
        "M028"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R010 教师/班级/场地冲突，V1；T=具体拟时段和地点存在可比较对象；F=经确认纯停课未有新安排；U=计划新时段未知→H/P（若当期已核必填才 N）；SRC-001/002/012；F006/F021–F023/F035；M005/M007/M028；A/B 区间重叠交叉比，同一师/班/室及考务，须跨本研数据源核覆盖；人工冲突处理须 A/B 权限凭据，交通换场时间未核阈值不硬判；无冲突 PF；发现占用 C；覆盖不足 S；管理员，例外 H"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012"
      ],
      "fieldIds": [
        "F016",
        "F035",
        "F036"
      ],
      "materialSlotIds": [
        "M002",
        "M007",
        "M028",
        "M032"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R011 冲突快照完整与时效，V1；T=已报告“无冲突”或冲突结论；F=未进入资源核验；U=快照覆盖范围未知→S；SRC-001/002/012；F035/F036/F016；M007/M028/M002/M032；核查询时点、学期、校区和本科/研究生/考试数据源；覆盖缺失不得声明无冲突；B 人工核定注明缺失资源；足量 PF；范围矛盾 C，无法取完整源 S；课表/考务管理员"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F028",
        "F029",
        "F030",
        "F031",
        "F032"
      ],
      "materialSlotIds": [
        "M005",
        "M006",
        "M017"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R012 停课与补课学时账，V1/Z1；T=停/补导致时数变化；F=仅等学时换时间且权威课程计划吻合；U=规定学时来源未知→S；SRC-001/002；F028–F032；M005/M006/M017；A/B 课程计划总学时减已/拟实授学时；研究生 SRC-002 明述不得减总学时但现行效力 P；本科具体硬阈值待核；算术一致 PF（非政策许可）；差额 C，需裁量 H/P；教务/研究生管理"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "fieldIds": [
        "F005",
        "F033",
        "F034"
      ],
      "materialSlotIds": [
        "M022",
        "M029"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R013 研究生停课历史与次数，V1；T=研究生中途停课或已证实适用当期专项次数规则；F=非此情形；U=是否适用历史规则→P；SRC-002/003/004；F005/F033/F034；M029/M022；A/B 仅统计同学期同课程完整期间；不以 2018“2 次/3 周”、旧院“3 次”硬判 2026；事实完整 PF；台账缺 S；是否超限 P/H；研究生院/校方制定者"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F005",
        "F037",
        "F049"
      ],
      "materialSlotIds": [
        "M008",
        "M013"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R014 本科课程组协调，V1/D1；T=本科常规变更且现行流程要求协调；F=权威统一通知明确豁免；U=个案豁免不明→P；SRC-001/010；F005/F037/F049；M008/M013；A/B 查课程组真实协调意见覆盖的申请版本；未到协调阶段不先要意见；匹配 PF；当前应有而尚待办理 H，不向申请人强制上传；课程组/学院"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F038",
        "F042",
        "F049"
      ],
      "materialSlotIds": [
        "M009"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R015 学院（系）审核事件，D1；T=本研常规学院审核环节；F=有效特例明确免该环节；U=统一调整免审与否未明→P；SRC-001/002；F038/F042/F049；M009；A/B 查院审动作类型、时间、目标版本；不能把教学秘书经办当院审；真实事件 PF；对象不符 C，无决定 H；学院有权审核人"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F005",
        "F039",
        "F042",
        "F049"
      ],
      "materialSlotIds": [
        "M009",
        "M010"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R016 本科报学校备案，D1；T=本科变更已到校级备案环节；F=研课或正式豁免；U=备案是否必经待校级通知→P；SRC-001/010；F005/F039/F042/F049；M010/M009；A/B 校方备案事件，独立于院审；备案不等于“审批许可”及课表生效；备案记录可证 PF；尚未办理 H，伪记录 C；本科校级备案岗位"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-002",
        "SRC-013",
        "SRC-014"
      ],
      "fieldIds": [
        "F005",
        "F020",
        "F040",
        "F042",
        "F049"
      ],
      "materialSlotIds": [
        "M011",
        "M022"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R017 研究生时间/地点批准，D1；T=研究生时间/地点调整按当期有效条款须批准；F=本科或只有研究生停课的不同动作；U=现行批准路径未知→P；SRC-002/013/014；F005/F020/F040/F042/F049；M011/M022；A/B 核可验证研院批准事件与新时段、申请版匹配；若最新办法或授权无法取得，可核文书存在但不得确认 2018 这一路径仍为现行必经；文书事实可证 PF；现行链路 P；未作动作 H；冒学院意见 C；研究生院"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-002",
        "SRC-013",
        "SRC-014"
      ],
      "fieldIds": [
        "F005",
        "F020",
        "F041",
        "F042",
        "F049"
      ],
      "materialSlotIds": [
        "M012",
        "M022"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R018 研究生中途停课同意备案，D1；T=研究生中途停课且现行条款要求同意备案；F=本科或不涉及停课；U=条款已修订情况未知→P；SRC-002/013/014；F005/F020/F041/F042/F049；M012/M022；A/B 查研院“同意备案”动作本身，不能从普通时间变更批准推导；须单独确认 2026 仍使用此动作；已取得文书事实 PF；现行性 P；待办理 H；动作不符 C；研究生院"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "fieldIds": [
        "F038",
        "F039",
        "F040",
        "F041",
        "F042",
        "F049",
        "F050",
        "F052"
      ],
      "materialSlotIds": [
        "M009",
        "M010",
        "M011",
        "M012",
        "M019",
        "M024",
        "M027"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R019 签发者权限与决定对象，D1/C1；T=出现院审/备案/批准/撤回或复核决定；F=无任何决定且仍在前期；U=授权目录失联→S/H；SRC-001/002/005；F038–F042/F049/F050/F052；M009–M012/M019/M024/M027；A/B 以可信身份、岗位授权起止、签办动作、课节及申请版本联核；上传印章图片不足；合法签办事实 PF；越权/版本不符 C/H，授权源失联 S；有权校方管理员"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F003",
        "F044",
        "F055"
      ],
      "materialSlotIds": [
        "M013",
        "M022"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R020 学校统一变更通知，I1；T=选择 F 学校统一调整；F=可核个人常规申报；U=是否有正式集体通知未知→S；SRC-001/010；F003/F044/F055；M013/M022；A/B 对签发机关、学期、校区、受影响课节、有效期及豁免条款；SRC-010 仅制度线索；范围一致 PF，通知缺 S、口述替代 C、程序豁免 P；学校发文部门"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "fieldIds": [
        "F005",
        "F009",
        "F033",
        "F034",
        "F055"
      ],
      "materialSlotIds": [
        "M001",
        "M022",
        "M029"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R021 学院特别规定适用，V1；T=G1/G2 学院专项或声称旧院规定；F=不属这些单位；U=是否仍适用旧规→P；SRC-001/002/003/004；F005/F009/F033/F034/F055；M001/M022/M029；依层级、发布时间和校方废改记录定适用范围；仅能确认旧版条文存在；历史事实 PF，2026 硬阈值 P；学院教学办与校级制度主管"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-006"
      ],
      "fieldIds": [
        "F012",
        "F053"
      ],
      "materialSlotIds": [
        "M001",
        "M020"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R022 外籍教师请假外部决定，V1；T=G3 且该次另需请假许可；F=非外教/无外事请假事项；U=请假义务或效力未知→P/H；SRC-006；F012/F053；M020/M001；B/A 核请假主体、时段、学院及对外合作与交流处权限；外教请假≠调课许可；结论可证 PF；取不到 S，权限争议 H；外事归口部门"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F012",
        "F020",
        "F054"
      ],
      "materialSlotIds": [
        "M001",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R023 任课人更换独立授权，V1；T=同案改变任课/代课主体；F=任课人不变且任务可证；U=教师变化来源未知→S；SRC-001/002；F012/F020/F054；M001/M021；A/B 仅引用 T01-T02 的正式决定及有效版本，不由本案批准换人；关联有效 PF；无权威结论 S/H；T01-T02 业务 Owner"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-011"
      ],
      "fieldIds": [
        "F054",
        "F056"
      ],
      "materialSlotIds": [
        "M021",
        "M030",
        "M031"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R024 邻接权威结论与 G50 去重，V1；T=触及人员更换、独立教室借用、安全、考务、课程建设或证据核验；F=可信证明不涉跨界授权；U=邻项权利/真实服务是否适用未知→P/H；SRC-001/002/011；F054/F056；M031/M021/M030；G50 技术目录已核，但全部 NOT_RUN，不能把候选名当已出结论；仅消费真实原 Owner 的 decisionId/checkId+target+sourceVersion+有效区间；引用有效 PF；无权威来源 S/P/H；邻接业务 Owner"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "fieldIds": [
        "F023",
        "F045"
      ],
      "materialSlotIds": [
        "M005",
        "M015"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R025 学生通知方案，I1/V1；T=计划涉及受影响学生且有权流程要求事前规划；F=校方统一通知明确已全覆盖且无需另拟方案；U=方案是否为前置必交→P；SRC-001/002/003；F023/F045；M015/M005；C/A 区分“拟通知”与实际送达；校本普适强制形式未核实；有方案 PF；未知义务 P/H；开课单位，不作为起案自动拒绝"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-016"
      ],
      "fieldIds": [
        "F023",
        "F046"
      ],
      "materialSlotIds": [
        "M013",
        "M016"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R026 已发生学生通知，X1；T=进入需落实通知的实施阶段；F=尚在申请/审批前或有效校方通知已完全覆盖；U=渠道或送达标准未知→P；SRC-001/002/003/016；F023/F046；M016/M013；A/B/ACT 对比教学班覆盖、发送时刻、修改前后课节版与替代安排；SRC-016 只是具体公告实例，不能推定一般法定送达率；草稿非实绩；可核发布 PF；错班 C；源失联 S；有效通知期限 P；教学单位"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F028",
        "F029",
        "F030",
        "F031",
        "F032",
        "F047"
      ],
      "materialSlotIds": [
        "M005",
        "M006",
        "M017"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R027 实际行课/补课，X1/Z1；T=拟补课时间已到且主张已完成；F=授课尚未到期；U=是否已实施无法访问→S；SRC-002/001；F028–F032/F047；M017/M006/M005；ACT/A 比对课节、班级、实际学时、补课时段及受权记录；不能用原计划当实绩；准确 PF；课时矛盾 C、记录失联 S；教学单位/研院"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F016",
        "F021",
        "F022",
        "F039",
        "F040",
        "F041",
        "F048"
      ],
      "materialSlotIds": [
        "M002",
        "M010",
        "M011",
        "M012",
        "M018"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R028 生效课表与批准对象一致，X1；T=有人主张课表已经更改生效；F=仍处审批前未宣称生效；U=新课表查询不可达→S；SRC-001/002；F016/F021/F022/F039–F041/F048；M002/M010–M012/M018；SCHED A 核新旧版本、有效日、决定目标；即使有批准截图也不代替生效记录；匹配 PF，不符 C，查不到 S；课表管理员"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R029",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F016",
        "F017",
        "F018",
        "F019",
        "F020",
        "F021",
        "F022",
        "F023",
        "F027",
        "F049",
        "F051",
        "F056"
      ],
      "materialSlotIds": [
        "M003",
        "M005",
        "M025",
        "M030"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R029 补件、替换和旧结论依赖，C1；T=补件或计划/证明变更；F=同案无新版本且来源未变；U=差异谱系未知→S；SRC-001/002；F016–F023/F027/F049/F051/F056；M025/M030/M003/M005；CASE 按证据哈希、fieldId、课节 ID 精准失效；决定的覆盖范围重新核真实性，不自动承接；版本链闭合 PF；断链 C/S；案卷 Owner + 原有权审批部门"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R030",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F011",
        "F015",
        "F049",
        "F050"
      ],
      "materialSlotIds": [
        "M019",
        "M023",
        "M030"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R030 撤回请求主体与对象，C1；T=收到撤回请求；F=无撤回且可信历史可证；U=请求是否由本人/授权代理提出→H；SRC-001/002（仅原事项，无撤回授权条款）；F011/F015/F049/F050；M023/M019/M030；A/B/C 核发起者、原申请版本、收件时间，已发生教学事实不抹除；请求权政策问题另由 R034；请求事实可证 PF；缺当前请求详情 N；身份冲突 C/H；原受理单位"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R031",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F042",
        "F049",
        "F050"
      ],
      "materialSlotIds": [
        "M023",
        "M024",
        "M030"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R031 撤回受理与实际效力，C1；T=已提交 R030 所核撤回请求且校方已处理/待处理；F=无撤回请求；U=是否允许、何时生效未知→P/H；SRC-001/002（无专门撤回规定）；F049/F050/F042；M023/M024/M030；A/B 只认有权机关撤回受理/驳回事件、签发时间与作用申请版本；不能从 M023 推 M024；可核学校动作 PF；未作动作 H，政策依据未知 P，伪签 C；有权受理部门"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R032",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F011",
        "F015",
        "F049",
        "F052"
      ],
      "materialSlotIds": [
        "M019",
        "M026",
        "M030"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R032 事实异议/正式复核请求，C1；T=收到异议/复核请求；F=可信记录可证未提出；U=请求者资格或正式受理路径不明→P/H；SRC-001/002（未提供复核专门规定）；F011/F015/F049/F052；M026/M019/M030；先核请求对象是事实规则还是原决定，原证据与版本、申请主体；提出事实异议≠法定复核权；请求存在 PF；当前请求不可读 U/N；有权受理路径 P；事实审核经办/校方受理机构"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R033",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F042",
        "F049",
        "F052",
        "F056"
      ],
      "materialSlotIds": [
        "M026",
        "M027",
        "M030"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R033 正式复核决定的真实性，C1；T=校方声称已对该次正式复核作出决定；F=仅提出请求、尚未决定；U=决定权限/签章未核→H/S；SRC-001/002（复核权限条款待取）；F042/F049/F052/F056；M026/M027/M030；A/B 核有权机关、复核动作、申请版本、原决定与生效时间，AI 不能签发/撤销原决定；有权动作 PF，主体/对象错 C、无可核权限 H/S；正式复核部门"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R034",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-010",
        "SRC-012",
        "SRC-013",
        "SRC-014"
      ],
      "fieldIds": [
        "F005",
        "F009",
        "F020",
        "F043",
        "F050",
        "F052",
        "F055"
      ],
      "materialSlotIds": [
        "M003",
        "M022",
        "M023",
        "M026"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R034 当前政策、时限和授权闸门，V1/D1/C1；T=要依据规则判断可受理/可审批/撤回/复核/逾期/次数；F=仅陈述不依赖硬阈值的原始事实；U=版本/适用时间未明→P；SRC-001/002/003/004/010/012/013/014；F005/F009/F020/F043/F050/F052/F055；M022/M003/M023/M026；POL 核发文/修订、适用学段和时间、层级；尤其核实 2018 暂行办法与后续《研究生课程教学管理办法》关系，禁把旧限额和 2025 初排原则当 2026 全校临时调课阈值；仅政策有效匹配可证时 PF；否则 P；教务处/研究生院主管"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R035",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-011"
      ],
      "fieldIds": [
        "F001",
        "F049",
        "F056"
      ],
      "materialSlotIds": [
        "M001",
        "M030"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R035 材料归属、可读性与链路，I0+；T=本次核验使用任一证据；F=规则确无证据依赖；U=提取段落或材料版本不明→U/S；SRC-001/002/011（技术追溯，不把 G50 当校规）；F001/F049/F056；M001/M030 及被核的对应 M；每个结论存材料 ID、原始哈希、页行/系统记录、目标课程课节、读取版本；OCR 置信不代替原件；一致 PF，无法读取 U，材料归属不符 C，来源失联 S；材料经办/审核者"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R036",
      "sourceIds": [
        "SRC-012",
        "SRC-015"
      ],
      "fieldIds": [
        "F004",
        "F005",
        "F006",
        "F021",
        "F022",
        "F023",
        "F036",
        "F057"
      ],
      "materialSlotIds": [
        "M002",
        "M005",
        "M032"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R036 拟排课的运行负荷与跨校区影响，V1；T=申请包含明确新时段，且针对该学期存在可核排课原则/跨教学区要求；F=只有纯停课且尚无补课安排，或该条款由有效通知证明不适用；U=学期政策或跨本研源覆盖不明→P/S；SRC-012/015；F004–F006/F021–F023/F036/F057；M002/M005/M032；A/B 查该教师拟日理论学时、教学班拟周课次、课程类型/夜间与周末、东/西教学区连续课节、特殊设备需求；仅 2025–2026 第二学期可直接对照 SRC-012 初排原则，其他学期需当期文件。发现影响是事实/风险提示，是否准变仍由校方裁量；影响计算可证 PF（附风险明细）；源不全 S；政策不明 P；实际排课影响有争议 H；教务/研院/校区课表管理员"
    }
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "SRC-001；CDUT-VERIFIED；成都理工大学，《成都理工大学本科课程教学基本规范》（成理校教〔2022〕11 号）；https://mee.cdut.edu.cn/info/1117/1944.htm ；第 17、24、25 条，其中第 24 条关于课程时间、地点、任课人不得随意更改与调停课流程；制度发布日期 2022-06-04（见 SRC-008 所述校方制度表）；生效及废止日未见；2025 年再次要求落实、2026 年培训引用",
      "url": "https://mee.cdut.edu.cn/info/1117/1944.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-002",
      "title": "SRC-002；CDUT-VERIFIED；成都理工大学，《成都理工大学研究生课程建设及课程管理办法（暂行）》；https://cnae.cdut.edu.cn/info/1040/1425.htm ；第 12–14、17–18、26 条；网页 2018-01-09；第 26 条注明 2018-01 起施行，并废止两项旧研究生课程/成绩规定；本办法自身废止/修订未查得",
      "url": "https://cnae.cdut.edu.cn/info/1040/1425.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-003",
      "title": "SRC-003；CDUT-VERIFIED；成都理工大学马克思主义学院，《马克思主义学院教学管理制度》“第二部分 排课与调课制度”；https://marx.cdut.edu.cn/info/1053/1208.htm ；第二部分“调课制度”第 1–5 项；站点索引显示约 2017 年发布；精确发布/施行/废止日未核",
      "url": "https://marx.cdut.edu.cn/info/1053/1208.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-004",
      "title": "SRC-004；CDUT-VERIFIED；成都理工大学核技术与自动化工程学院，《研究生课程管理暂行规定》（核自院发〔2016〕1 号）；https://cnae.cdut.edu.cn/__local/9/D3/7B/24FDCF6720844E1DFA5A7461CF0_FDB521DF_158EE.pdf ；第 2 页“（三）教学秩序要求”第 2 项，第 3 页施行语句；2016-01-05 印发；自 2015–2016 学年第二学期试行；废止/替代未知",
      "url": "https://cnae.cdut.edu.cn/__local/9/D3/7B/24FDCF6720844E1DFA5A7461CF0_FDB521DF_158EE.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-005",
      "title": "SRC-005；CDUT-VERIFIED；成都理工大学环境与土木工程学院，《教务科》岗位职责；https://cece.cdut.edu.cn/info/1028/5496.htm ；“教学秘书岗位职责”第一项；网页 2020-09-10；职责页无制度生效/废止日",
      "url": "https://cece.cdut.edu.cn/info/1028/5496.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-006",
      "title": "SRC-006；CDUT-VERIFIED；成都理工大学对外合作与交流处，《成都理工大学外籍教师聘用管理实施细则》（成理外交〔2017〕16 号）；https://wfxy.cdut.edu.cn/info/1056/2343.htm ；第三部分“外教的教学管理”（三）第 2–3 项；2017-09-10 印发、自发布日起施行；网页转发 2024-09-02；废止/修订未知",
      "url": "https://wfxy.cdut.edu.cn/info/1056/2343.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-007",
      "title": "SRC-007；CDUT-VERIFIED；成都理工大学教务处，《关于做好本学期期末考试工作的通知》附件 PDF（原网页标题/年份待回查）；https://www.aao.cdut.edu.cn/__local/A/A9/09/0D8AFAFE17938B772AAD0DE0803_19FDF450_3E3B5.pdf ；PDF 第 2 页“四、其他要求”第 1 项；搜索结果标 2025-06-23；文件签发日期、废止日未完整确认",
      "url": "https://www.aao.cdut.edu.cn/__local/A/A9/09/0D8AFAFE17938B772AAD0DE0803_19FDF450_3E3B5.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-008",
      "title": "SRC-008；CDUT-VERIFIED；成都理工大学核资源勘查技术国家级实验教学示范中心，《阶段性总结报告（2018–2022 年）》；https://www.cdut.edu.cn/__local/C/2E/21/1F734F9C0026BD14BA241AB7F97_CBEF168F_F7793.pdf ；PDF 第 7 页（页面索引 P6）表 2-3 第 24 项；报告填报 2023-06-30；表载 SRC-001 发布 2022-06-04、文号 2022〔11〕；报告自身非有效期文件",
      "url": "https://www.cdut.edu.cn/__local/C/2E/21/1F734F9C0026BD14BA241AB7F97_CBEF168F_F7793.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-009",
      "title": "SRC-009；CDUT-VERIFIED；成都理工大学机电工程学院，《机电工程学院新进教师教学规范培训会顺利召开》；https://mee.cdut.edu.cn/info/1050/3438.htm ；全文关于 2026-01-07 培训引用《本科课程教学基本规范》；网页 2026-01-28；事件 2026-01-07，不是规范本身的生效日",
      "url": "https://mee.cdut.edu.cn/info/1050/3438.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-010",
      "title": "SRC-010；CURRENTITY-UNKNOWN；成都理工大学《教学安排与课程调度管理办法》全文待取；线索：https://shpg.cdut.edu.cn/__local/5/96/62/BAAB6819B693EE5588ECBC18F5B_BC01582D_FC225.pdf ；《成都理工大学 2021–2022 学年本科教学质量报告》PDF 第 8 页（页面索引 P7）提及此文件；独立制度的文号、发布时间、生效/废止日期均未取到",
      "url": "https://shpg.cdut.edu.cn/__local/5/96/62/BAAB6819B693EE5588ECBC18F5B_BC01582D_FC225.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-011",
      "title": "SRC-011；GENERAL-RESEARCH（技术目录已核）；GitHub Fuck-GH-Admin/cdut-studio-review-agent 固定 SHA 的 G50 catalog.json，不是校本政策；https://raw.githubusercontent.com/Fuck-GH-Admin/cdut-studio-review-agent/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json ；catalogId=D4-G01-G08-UNIFIED-R01；另读 d4-g03-build/g03-t01/workspace.json 的 definitions.templates[0]；固定技术 SHA 7b6cdc8...，目录内 technicalBaseSha=a7a6a11...；不具有校本效力",
      "url": "https://raw.githubusercontent.com/Fuck-GH-Admin/cdut-studio-review-agent/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-012",
      "title": "SRC-012；CDUT-VERIFIED；成都理工大学教务处，教通字〔2025〕45 号《关于做好2025-2026学年第二学期教学任务安排及课表编排的工作通知》；https://aao.cdut.edu.cn/__local/6/D0/6E/D73FB595B334A89DCC3AB9C55E8_B2D0E7C3_27504.pdf ；PDF 第 1 页“一、教学任务实施原则”第 1、2、5 项，第 2 页“二、课表编排原则”第 1–5 项；签发 2025-10-29；适用 2025–2026 学年第二学期本科初始任务/排课；不作为 2026 秋全校永久办法",
      "url": "https://aao.cdut.edu.cn/__local/6/D0/6E/D73FB595B334A89DCC3AB9C55E8_B2D0E7C3_27504.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-013",
      "title": "SRC-013；CDUT-VERIFIED；成都理工大学党委研究生工作部、研究生院《关于申报2021-2022学年春季学期研究生公共选修课的通知》；https://gra.cdut.edu.cn/__local/1/CA/91/7C1A10B30713251FB6EE9F0B27D_00D997B4_2C6ED.pdf ；PDF 第 2 页“二、课程管理”第 1 项；签发 2021-12-23；仅该学年公选课办理通知，非本案当前调停补课规范",
      "url": "https://gra.cdut.edu.cn/__local/1/CA/91/7C1A10B30713251FB6EE9F0B27D_00D997B4_2C6ED.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-014",
      "title": "SRC-014；CURRENTITY-UNKNOWN；成都理工大学研究生院公开年度资料（包含 2024 年工作的报告）；https://gra.cdut.edu.cn/__local/D/69/D5/7104C6BD7D9154AD3388B3A6B70_8DB688D1_F5567D.pdf ；搜索索引“2024年，根据《成都理工大学研究生课程教学管理办法》……”；报告所述 2024 年工作；正文有效制度、修订日期不明",
      "url": "https://gra.cdut.edu.cn/__local/D/69/D5/7104C6BD7D9154AD3388B3A6B70_8DB688D1_F5567D.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-015",
      "title": "SRC-015；CDUT-VERIFIED（官方网页索引）；成都理工大学宜宾校区《教务工作部部门职责》；https://yb.cdut.edu.cn/info/1091/4509.htm ；“负责日常教学活动组织和校区教学运行及课程管理”段落；网页 2026-04-10；岗位/授权可能变化，效力待校区主管确认",
      "url": "https://yb.cdut.edu.cn/info/1091/4509.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-016",
      "title": "SRC-016；CDUT-VERIFIED；成都理工大学研究生院《关于部分公共素养课调课及在线课程上课方式的通知》；https://gra.cdut.edu.cn/__local/9/89/8D/8CE82B6EF0A8399514A00897ACA_5A8A9AA1_2DC36.pdf ；PDF 第 1 页第“一”项与末句学生相互通知；文件版面无明确签发日期，具体适用学期需确认",
      "url": "https://gra.cdut.edu.cn/__local/9/89/8D/8CE82B6EF0A8399514A00897ACA_5A8A9AA1_2DC36.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = T01T01_TEMPLATE
