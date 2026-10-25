import type { TemplateVersion } from '@profer/shared'

export const T01T02_TEMPLATE: TemplateVersion = {
  "templateId": "T01-T02",
  "version": 1,
  "schemaVersion": 2,
  "name": "临时代课、教师替换与教学任务人员调整审核",
  "description": "本地研究模板 · 非校方正式模板。临时代课、教师替换与教学任务人员调整审核：基于 R02 原件逐条核验事实、证据和办理情形；所列材料包含后续权威记录，不代表初次提交均须上传。所有正式决定与未确认校本政策必须人工判断。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；政策 PARTIAL、全部正式决定需可信人员人工确认；研究 SRC 不是案卷 SourceRef。",
  "objectType": "custom",
  "displayName": {
    "template": "T01-T02 · 临时代课、教师替换与教学任务人员调整审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · caseId／UUID或受控案卷号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F001 字段：caseId／UUID或受控案卷号；Application；S0；案卷服务端创建（产品设计）；案卷元数据；P1；无案卷禁止绑定到他案，重建定位。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F001；原稿类型及阶段：F001；caseId／UUID或受控案卷号；Application；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F002",
      "label": "F002 · academicTerm／学年学期码",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F002 字段：academicTerm／学年学期码；TeachingAssignment；S0；校教务/研究生教学任务权威表 [SRC-002][SRC-004]；M001.学期；P1；源不可用待校方核对，不推算。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F002；原稿类型及阶段：F002；academicTerm／学年学期码；TeachingAssignment；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F003",
      "label": "F003 · courseId／课程唯一号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F003 字段：courseId／课程唯一号；TeachingAssignment；S0；开课任务权威表 [SRC-001][SRC-002]；M001.课程号；P1；未定位不可作同案匹配。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F003；原稿类型及阶段：F003；courseId／课程唯一号；TeachingAssignment；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F004",
      "label": "F004 · teachingSectionId／教学班或教学安排标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F004 字段：teachingSectionId／教学班或教学安排标识；TeachingAssignment；S0；同上；M001.教学班；P1；缺失待教务核验；不靠课程名合并。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F004；原稿类型及阶段：F004；teachingSectionId／教学班或教学安排标识；TeachingAssignment；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F005",
      "label": "F005 · assignmentId／原教学任务号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F005 字段：assignmentId／原教学任务号；TeachingAssignment；S0；学校任务单/核验记录 [SRC-002]；M001.任务号；P1；关联不明列 CONFLICT/待定位。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F005；原稿类型及阶段：F005；assignmentId／原教学任务号；TeachingAssignment；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F006",
      "label": "F006 · assignmentSourceVersion／版本标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F006 字段：assignmentSourceVersion／版本标识；TeachingAssignment；S0；原任务服务器快照/签章文件；M001.版本+获取时刻；P1；来源无版本则标“未可验证”，人审。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F006；原稿类型及阶段：F006；assignmentSourceVersion／版本标识；TeachingAssignment；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F007",
      "label": "F007 · courseOwningOrgId／开课归口单位 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F007 字段：courseOwningOrgId／开课归口单位 ID；TeachingAssignment；S0；校组织关系＋课程归口 [SRC-001]；M001.开课单位；P1；跨院不明则停止自动分派。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F007；原稿类型及阶段：F007；courseOwningOrgId／开课归口单位 ID；TeachingAssignment；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F008",
      "label": "F008 · studyTrack／本科/研究生/留学生等枚举",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F008 字段：studyTrack／本科/研究生/留学生等枚举；TeachingAssignment；S0；权威教学任务类别 [SRC-001][SRC-005]；M001.任务类别；P1；不明则 POLICY_UNCONFIRMED，不得默认本科。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F008；原稿类型及阶段：F008；studyTrack／本科/研究生/留学生等枚举；TeachingAssignment；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F009",
      "label": "F009 · originalTeacherUid／校内唯一人员标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F009 字段：originalTeacherUid／校内唯一人员标识；AssignmentPersonLine；S0；身份目录＋原教学任务；M001.原教师标识；M006；P2；同名不能合并；待身份核定。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F009；原稿类型及阶段：F009；originalTeacherUid／校内唯一人员标识；AssignmentPersonLine；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F010",
      "label": "F010 · originalTeachingRole／主讲/助课/合授/实践指导",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F010 字段：originalTeachingRole／主讲/助课/合授/实践指导；AssignmentPersonLine；S0；原任务角色 [SRC-001]；M001.原角色；P1；角色不明待课程负责人核验。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F010；原稿类型及阶段：F010；originalTeachingRole／主讲/助课/合授/实践指导；AssignmentPersonLine；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F011",
      "label": "F011 · originalAllocatedHours／非负学时数",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F011 字段：originalAllocatedHours／非负学时数；AssignmentPersonLine；S0；原任务分配 [SRC-002]；M001.原学时份额；P1；无权威数不得执行份额校验。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F011；原稿类型及阶段：F011；originalAllocatedHours／非负学时数；AssignmentPersonLine；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F012",
      "label": "F012 · incomingTeacherUid／唯一人员标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F012 字段：incomingTeacherUid／唯一人员标识；AssignmentPersonLine；S1；可信身份匹配 [SRC-001]；M002.拟人、M006.实名映射；P2；不能凭姓名自动判定同人。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F012；原稿类型及阶段：F012；incomingTeacherUid／唯一人员标识；AssignmentPersonLine；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F013",
      "label": "F013 · proposedTeachingRole／任课角色枚举",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F013 字段：proposedTeachingRole／任课角色枚举；AssignmentPersonLine；S1；申请人陈述，课程任务人员确认后升可信；M002.角色、M009；P1；待补/待确认，不自动认定资格。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F013；原稿类型及阶段：F013；proposedTeachingRole／任课角色枚举；AssignmentPersonLine；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F014",
      "label": "F014 · personnelChangeType／C01–C04 基型枚举",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F014 字段：personnelChangeType／C01–C04 基型枚举；Application；S0；申请事实＋原任务差异；M002.变更类型；P1；不能分类时人工分诊，不新增模板。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F014；原稿类型及阶段：F014；personnelChangeType／C01–C04 基型枚举；Application；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F015",
      "label": "F015 · affectedLessonSpan／日期、周次、节次列表",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F015 字段：affectedLessonSpan／日期、周次、节次列表；LessonImpact；S0；申请清单与原排课表 [SRC-001]；M003.受影响课次；P1；课次空缺需补范围；不强定提前天数。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F015；原稿类型及阶段：F015；affectedLessonSpan／日期、周次、节次列表；LessonImpact；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F016",
      "label": "F016 · changedHours／拟转移学时量",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F016 字段：changedHours／拟转移学时量；LessonImpact；S1；申请＋原分配对账 [SRC-002]；M003.涉及学时；P1；C04 必须可核；其他情形按适用标未知。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F016；原稿类型及阶段：F016；changedHours／拟转移学时量；LessonImpact；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F017",
      "label": "F017 · proposedAllocation／人员→学时映射",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F017 字段：proposedAllocation／人员→学时映射；AssignmentPersonLine；S1；申请计划；决定后以任务新版本为准；M003.拟分配；M014；P1；多教师缺份额则待补，不推定均分。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F017；原稿类型及阶段：F017；proposedAllocation／人员→学时映射；AssignmentPersonLine；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F018",
      "label": "F018 · scheduleChangeFlag／真/假/未知",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F018 字段：scheduleChangeFlag／真/假/未知；LessonImpact；S0；新旧时间地点差异 [SRC-001]；M003.时间地点对照；P1；未知请求澄清；纯时间变更路由 T01-T01。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F018；原稿类型及阶段：F018；scheduleChangeFlag／真/假/未知；LessonImpact；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F019",
      "label": "F019 · statedReason／说明文本与受控分类",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F019 字段：statedReason／说明文本与受控分类；Application；S0；申请陈述 [SRC-001][SRC-011]；M002.申请原因；P2/P3；未说明需补；敏感原件尽量只作受理结论。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F019；原稿类型及阶段：F019；statedReason／说明文本与受控分类；Application；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F020",
      "label": "F020 · eventOrPlannedTime／时间范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F020 字段：eventOrPlannedTime／时间范围；LessonImpact；S0/S1；申请、受控课表、紧急事件记录；M003；C02 用 M021；P1/P2；区分预计与实际，缺失待补，不自动认迟报。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F020；原稿类型及阶段：F020；eventOrPlannedTime／时间范围；LessonImpact；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F021",
      "label": "F021 · authenticatedInitiatorUid／登录主体ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F021 字段：authenticatedInitiatorUid／登录主体ID；AuthorityTrace；S0；服务端 SSO 与不可更改操作日志；受理事件；M005 若代理；P2；未认证不可正式代提交。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F021；原稿类型及阶段：F021；authenticatedInitiatorUid／登录主体ID；AuthorityTrace；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F022",
      "label": "F022 · initiatorCapacity／本人/单位经办/代理",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F022 字段：initiatorCapacity／本人/单位经办/代理；AuthorityTrace；S0；组织角色与授权关系；登录岗位；M005；P2；校本申请权未知→人审，非自动授权。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F022；原稿类型及阶段：F022；initiatorCapacity／本人/单位经办/代理；AuthorityTrace；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F023",
      "label": "F023 · delegationRef／授权记录ID及有效期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F023 字段：delegationRef／授权记录ID及有效期；AuthorityTrace；S0（代理条件）；授权方可信签发/单位任职关系；M005.签发记录；P2；非代理 NOT_APPLICABLE；代理无权→不受理其动作。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F023；原稿类型及阶段：F023；delegationRef／授权记录ID及有效期；AuthorityTrace；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F024",
      "label": "F024 · originalTeacherStatementRef／意见ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F024 字段：originalTeacherStatementRef／意见ID；AuthorityTrace；S2（条件）；原教师可信确认；M010；P2；校规是否必需未知；不得 S0 硬索取。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F024；原稿类型及阶段：F024；originalTeacherStatementRef／意见ID；AuthorityTrace；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F025",
      "label": "F025 · incomingTeacherStatementRef／意见ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F025 字段：incomingTeacherStatementRef／意见ID；AuthorityTrace；S2（条件）；拟教师可信确认；M009；P2；未要求签署则不触发缺件。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F025；原稿类型及阶段：F025；incomingTeacherStatementRef／意见ID；AuthorityTrace；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F026",
      "label": "F026 · teachingEligibilityDecisionRef／T06权威结论ID、版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F026 字段：teachingEligibilityDecisionRef／T06权威结论ID、版本；AuthorityTrace；S1（任课资格适用）；T06-T04/校资格管理方 [SRC-001][SRC-002]；M007.有效结论；P2；无可信源 SOURCE_UNAVAILABLE；不自签。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F026；原稿类型及阶段：F026；teachingEligibilityDecisionRef／T06权威结论ID、版本；AuthorityTrace；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F027",
      "label": "F027 · employmentAuthorizationRef／聘任/任职有效期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F027 字段：employmentAuthorizationRef／聘任/任职有效期；AuthorityTrace；S1（条件）；校人事/有权任职部门 [SRC-002]；M008；P2；条件未确定→POLICY_UNCONFIRMED。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F027；原稿类型及阶段：F027；employmentAuthorizationRef／聘任/任职有效期；AuthorityTrace；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F028",
      "label": "F028 · timetableClashAssessment／冲突事实/未知",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F028 字段：timetableClashAssessment／冲突事实/未知；LessonImpact；S1/S2（有排课可查）；学校权威课表当前版本；M001+M003；M014（后）；P1；系统不通 SOURCE_UNAVAILABLE，不判非法。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F028；原稿类型及阶段：F028；timetableClashAssessment／冲突事实/未知；LessonImpact；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F029",
      "label": "F029 · coordinationRef／课程组协调记录ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F029 字段：coordinationRef／课程组协调记录ID；AuthorityTrace；S2；有权限课程组角色签发 [SRC-001]；M011；P1/P2；未到协调阶段不缺；换人必需性待定。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F029；原稿类型及阶段：F029；coordinationRef／课程组协调记录ID；AuthorityTrace；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F030",
      "label": "F030 · collegeReviewRef／院级审核ID与意见",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F030 字段：collegeReviewRef／院级审核ID与意见；AuthorityTrace；S3；开课学院有权人及组织签署；M012；P2；不凭图片章认权；适用/权限待配置。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F030；原稿类型及阶段：F030；collegeReviewRef／院级审核ID与意见；AuthorityTrace；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F031",
      "label": "F031 · schoolDecisionOrFilingRef／决定或备案类型+ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F031 字段：schoolDecisionOrFilingRef／决定或备案类型+ID；AuthorityTrace；S3；校/院权威审批或备案日志；M013；P2；无校方动作记录不能输出“获批”。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F031；原稿类型及阶段：F031；schoolDecisionOrFilingRef／决定或备案类型+ID；AuthorityTrace；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F032",
      "label": "F032 · effectiveFrom／真实决定生效时刻",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F032 字段：effectiveFrom／真实决定生效时刻；AuthorityTrace；S3/S4；有权决定原文、任务生效版本；M013+M014；P1；不用申请预计时间冒充实际生效。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F032；原稿类型及阶段：F032；effectiveFrom／真实决定生效时刻；AuthorityTrace；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F033",
      "label": "F033 · studentNotificationRef／告知记录ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F033 字段：studentNotificationRef／告知记录ID；LessonImpact；S4（适用时）；教学单位可核发的通知凭据；M015；P1；制度必需性未证；不反向阻断 S0。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F033；原稿类型及阶段：F033；studentNotificationRef／告知记录ID；LessonImpact；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F034",
      "label": "F034 · actualDelivererUid／实际授课者ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F034 字段：actualDelivererUid／实际授课者ID；LessonImpact；S4/C02事后；有权的授课/考勤/日志记录；M016；应急 M021；P2；已授课但人不清→CONFLICT并人核。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F034；原稿类型及阶段：F034；actualDelivererUid／实际授课者ID；LessonImpact；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F035",
      "label": "F035 · actualDeliveredHours／实际课时数",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F035 字段：actualDeliveredHours／实际课时数；LessonImpact；S4；校方教学记录 [SRC-003]；M016.完成课时；P1；事前 NOT_APPLICABLE，事后源不可用人核。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F035；原稿类型及阶段：F035；actualDeliveredHours／实际课时数；LessonImpact；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F036",
      "label": "F036 · workloadLedgerRef／计量台账ID+版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F036 字段：workloadLedgerRef／计量台账ID+版本；TeachingAssignment；S4；学院/校工作量记录岗位 [SRC-003]；M016.工作量栏；P2；无台账不推算薪酬/绩效结论。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F036；原稿类型及阶段：F036；workloadLedgerRef／计量台账ID+版本；TeachingAssignment；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F037",
      "label": "F037 · priorCaseDecisionRef／先前决定ID+效力",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F037 字段：priorCaseDecisionRef／先前决定ID+效力；Application；S5/C07；先前学校案卷或审批系统；M017；P1/P2；来源不可查挂起，不允许篡改。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F037；原稿类型及阶段：F037；priorCaseDecisionRef／先前决定ID+效力；Application；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F038",
      "label": "F038 · followUpAction／补件/撤回/复核/续期/再换",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F038 字段：followUpAction／补件/撤回/复核/续期/再换；Application；S5/C07；新动作请求与受理事件；M018.请求类型；P1；未确认发起权/节点→人工受理判断。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F038；原稿类型及阶段：F038；followUpAction／补件/撤回/复核/续期/再换；Application；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F039",
      "label": "F039 · applicationRevision／申请版本及被替换版本ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F039 字段：applicationRevision／申请版本及被替换版本ID；Application；每次新提交；服务端版本事件日志；申请历史；M018；P1；不覆盖旧版，版本链断裂则 CONFLICT。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F039；原稿类型及阶段：F039；applicationRevision／申请版本及被替换版本ID；Application；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F040",
      "label": "F040 · policyApplicabilitySnapshot／学段+政策/学院/日期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F040 字段：policyApplicabilitySnapshot／学段+政策/学院/日期；AuthorityTrace；S0 与 S3 再核；已核校本制度 SRC 和有权校方配置；SRC-001/002/011 等版本索引；P0/P1；时效或适用不明→POLICY_UNCONFIRMED。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F040；原稿类型及阶段：F040；policyApplicabilitySnapshot／学段+政策/学院/日期；AuthorityTrace；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F041",
      "label": "F041 · decisionActorAuthorityRef／任职/授权/动作ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F041 字段：decisionActorAuthorityRef／任职/授权/动作ID；AuthorityTrace；S3/S5；服务端有权角色和审批日志；M012/M013/M018.签发元数据；P2；前端 Actor 无效；不得创建正式决定。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F041；原稿类型及阶段：F041；decisionActorAuthorityRef／任职/授权/动作ID；AuthorityTrace；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F042",
      "label": "F042 · decisionResultTime／动作类型、结果、时间戳",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F042 字段：decisionResultTime／动作类型、结果、时间戳；AuthorityTrace；S3/S5；权威决定服务日志；M013，复核另用 M018；P2；无签发不得生成拟制结论。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F042；原稿类型及阶段：F042；decisionResultTime／动作类型、结果、时间戳；AuthorityTrace；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F043",
      "label": "F043 · scheduleDecisionRef／T01-T01决定标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F043 字段：scheduleDecisionRef／T01-T01决定标识；LessonImpact；S1/S3（伴随时间地点调整）；T01-T01 有权签发结论；M019；P1；仅有人事变更则 NOT_APPLICABLE；未获决定不可冒认。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F043；原稿类型及阶段：F043；scheduleDecisionRef／T01-T01决定标识；LessonImpact；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F044",
      "label": "F044 · evidenceLineage／材料哈希、源版本及归属映射",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F044 字段：evidenceLineage／材料哈希、源版本及归属映射；EvidenceLink；S0 及后续每次变动；上传服务/权威记录元数据（设计）；所有 M 的来源、页码、时间戳；P1/P2；无谱系时不复用旧结论，定位人工复核。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F044；原稿类型及阶段：F044；evidenceLineage／材料哈希、源版本及归属映射；EvidenceLink；不自行猜测阈值或校方数据接口。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 证明既存教学任务、原授课人及原学时；教务/培养单位持有",
      "purpose": "证明既存教学任务、原授课人及原学时；教务/培养单位持有；原教学任务单、课程与教学班权威快照、已归档带凭据表；S0 当前必需的事实；校教务/研教系统可核记录优先；不可用则开课单位盖验任务摘录，不任意取教师截图；F002–F011、F028；[SRC-001][SRC-002][SRC-004]；记录任务号、来源版本、读取时间、学段；无原任务暂停定位；影印不可读标页码，不靠课程名推断；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "证明既存教学任务、原授课人及原学时；教务/培养单位持有；原教学任务单、课程与教学班权威快照、已归档带凭据表；S0 当前必需的事实"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "M002 · 说明拟变更何人、何事及原因；申请/被授权方持有",
      "purpose": "说明拟变更何人、何事及原因；申请/被授权方持有；申请说明或经校方确认适用的变更表；学院调课表仅特定线索；S0 当前必需的事实；学校实际受理系统内受认证申请事件可替代纸表；不默认为 SRC-011 表；F012–F014、F019、F021–F022；[SRC-001][SRC-011]；案卷/申请版本、提交者及申请与受托身份；缺说明才补，敏感理由去细节；扫描不清定页重取；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "说明拟变更何人、何事及原因；申请/被授权方持有；申请说明或经校方确认适用的变更表；学院调课表仅特定线索；S0 当前必需的事实"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "M003 · 确定受影响课次、拟替换人员/学时及时间副作用；申请人/课程组",
      "purpose": "确定受影响课次、拟替换人员/学时及时间副作用；申请人/课程组；课次/周次清单、原拟任务差异、多人学时分摊表；S0 当前必需的事实；权威系统中填报的结构化变更范围可替代附件；F015–F018、F020、F028；[SRC-001][SRC-002]；锚定同 M001 任务版本与学期；缺课次/份额按情形补；无法读学时或日期不作算术判断；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "确定受影响课次、拟替换人员/学时及时间副作用；申请人/课程组；课次/周次清单、原拟任务差异、多人学时分摊表；S0 当前必需的事实"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M004",
      "name": "M004 · 证明提出变更的客观原因；申请人或有权单位",
      "purpose": "证明提出变更的客观原因；申请人或有权单位；事由佐证、经单位核实的必要结论（不要求诊疗隐私原件）；S1 条件必需（适用事由、必交强度待校规确认）；有权单位出具原因成立/不成立结论优于多余病历；无法据公开规章统一规定证据种类；F019–F020；[SRC-001][SRC-007]；只归属本案事由发生时段；无佐证仅提示人工确认，隐私 P3 不复制；不可读补相关片段；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "证明提出变更的客观原因；申请人或有权单位；事由佐证、经单位核实的必要结论（不要求诊疗隐私原件）；S1 条件必需（适用事由、必交强度待校规确认）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M005",
      "name": "M005 · 证明代提交/代签权；授权人和受理单位",
      "purpose": "证明代提交/代签权；授权人和受理单位；授权委托、岗位代办授权、可信组织代理配置；S0 代理时条件必需；可验证的校内角色代办授权记录，无须重复上传委托扫描件；F021–F023；SRC=未取得 校内真实授权规范；[SRC-003] 仅岗位线索；记录主体、受托人、事项范围、有效期；无法验权不能执行代理动作，非代理 NOT_APPLICABLE；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "证明代提交/代签权；授权人和受理单位；授权委托、岗位代办授权、可信组织代理配置；S0 代理时条件必需"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M006",
      "name": "M006 · 证原/拟教师不是同名误配；校身份/人事单位",
      "purpose": "证原/拟教师不是同名误配；校身份/人事单位；实名身份目录、在岗人员唯一标识核验结果；S0/S1 当前必需的身份事实；直接可信身份目录匹配，无须要求身份证件影印；仅必要标识；F009、F012、F021；[SRC-001][SRC-002]；记录人员标识、核验时刻/目录版；名称冲突待人工核查；不可读人像不是自动身份失败；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "证原/拟教师不是同名误配；校身份/人事单位；实名身份目录、在岗人员唯一标识核验结果；S0/S1 当前必需的身份事实"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M007",
      "name": "M007 · 证明拟人员有适用课程/岗位任课资格；资格权威单位",
      "purpose": "证明拟人员有适用课程/岗位任课资格；资格权威单位；T06-T04 已生效资格结论/学院正式认定记录；S1 条件必需（拟人承担须具备相应资格的岗位）；有权资格系统有效结论与版本引用，不要求证书重传；F012–F013、F026；[SRC-001][SRC-002]；资格主体、授课角色/范围、效力时点；源离线 SOURCE_UNAVAILABLE，不得 T01-T02 自授资格；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "证明拟人员有适用课程/岗位任课资格；资格权威单位；T06-T04 已生效资格结论/学院正式认定记录；S1 条件必需（拟人承担须具备相应资格的岗位）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M008",
      "name": "M008 · 核学校聘任/任职及有效期；人事/授权岗位",
      "purpose": "核学校聘任/任职及有效期；人事/授权岗位；人事聘用、岗位权限与适用范围正式结论；S1 条件必需（本科主讲及适用岗位）；校人事权威结果优先于劳动合同全件；不能仅凭自填职称；F027；[SRC-001][SRC-002]；拟教师、学期、岗位有效期；期限未核做人审；隐私 P2；不可读取可信单位摘要；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "核学校聘任/任职及有效期；人事/授权岗位；人事聘用、岗位权限与适用范围正式结论；S1 条件必需（本科主讲及适用岗位）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M009",
      "name": "M009 · 记录拟替代教师是否接受拟任务；本人/任课组织",
      "purpose": "记录拟替代教师是否接受拟任务；本人/任课组织；经认证的接任意见/协调确认；S2 条件必需（是否必须签待当期校规）；可信审批节点“确认”记录；不接受申请人代填“已同意”；F012–F013、F025；[SRC-001][SRC-011]；拟教师 UID、任务版、签时；未到 S2 不缺件；署名无法验真则待核；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "记录拟替代教师是否接受拟任务；本人/任课组织；经认证的接任意见/协调确认；S2 条件必需（是否必须签待当期校规）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M010",
      "name": "M010 · 记录原任课教师交接意见；本人/课程组织",
      "purpose": "记录原任课教师交接意见；本人/课程组织；原任课教师确认/原岗说明；S2 条件必需（紧急失联可能不适用，待政策）；校内带身份的协调节点，不能以课程组独立代签；F009、F024；[SRC-001][SRC-011]；原教师 UID 与课次；紧急未能取得时人审，不自动驳回；不清晰单列补证；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "记录原任课教师交接意见；本人/课程组织；原任课教师确认/原岗说明；S2 条件必需（紧急失联可能不适用，待政策）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M011",
      "name": "M011 · 记录课程组协调教学责任；课程组/开课单位",
      "purpose": "记录课程组协调教学责任；课程组/开课单位；课程组协调记录、授课安排确认；S2 后续产生（本事项是否强制待定）；可核实的课程组业务审批事件代替纸面签字；F017、F029；[SRC-001][SRC-011]；课程号、组别、签名人任期、任务版；尚未形成不列 S0 缺件；权源不明 NEEDS_HUMAN_DECISION；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "记录课程组协调教学责任；课程组/开课单位；课程组协调记录、授课安排确认；S2 后续产生（本事项是否强制待定）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M012",
      "name": "M012 · 证明学院有权岗位审核意见；开课学院",
      "purpose": "证明学院有权岗位审核意见；开课学院；院系审核意见/审批节点及附件；S3 后续产生（人员替换具体层级未知）；学院受控审批日志；仅对其权限内事项有效；F007、F030、F041；[SRC-001][SRC-011]；学院 ID、签者/岗位时效、变更申请版；无记录不可自动宣称审核通过；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "证明学院有权岗位审核意见；开课学院；院系审核意见/审批节点及附件；S3 后续产生（人员替换具体层级未知）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M013",
      "name": "M013 · 保存正式许可或备案的真实动作；校/院有权部门",
      "purpose": "保存正式许可或备案的真实动作；校/院有权部门；有权决定书、带类型的批准/备案回执；S3 后续产生（何种动作/是否需要待确认）；正式学校审批/备案原生记录，不强制再上传扫描件；F031–F032、F041–F042；[SRC-001]（仅调停课流程）；明确 APPROVAL vs FILING，对象范围/决定版/签者；无决定不得生成，截图不可替代认证；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "保存正式许可或备案的真实动作；校/院有权部门；有权决定书、带类型的批准/备案回执；S3 后续产生（何种动作/是否需要待确认）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M014",
      "name": "M014 · 证明决定已落实到新任务与排课；教务/培养单位",
      "purpose": "证明决定已落实到新任务与排课；教务/培养单位；新版教学任务、授课名单、课表、差异凭证；S4 后续产生；权威任务版本对照可替代人工新表；F005–F006、F017、F028、F032；[SRC-002][SRC-004]；指向 M001 基线和 M013 生效版；错版则 CONFLICT；来源断连不推定未执行；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "证明决定已落实到新任务与排课；教务/培养单位；新版教学任务、授课名单、课表、差异凭证；S4 后续产生"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M015",
      "name": "M015 · 证明学生或受影响课程方已获告知；教学单位",
      "purpose": "证明学生或受影响课程方已获告知；教学单位；校内通知送达记录/公示；S4 条件后置（有无必告知规定待核）；可信教学平台通知日志及责任方确认；F033；[SRC-001]（一般教学组织义务）；绑定课次/班级、通知时间；预审不索取；制度不明不作必交硬条件；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "证明学生或受影响课程方已获告知；教学单位；校内通知送达记录/公示；S4 条件后置（有无必告知规定待核）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M016",
      "name": "M016 · 核实际授课与学时记账；授课、教务、工作量单位",
      "purpose": "核实际授课与学时记账；授课、教务、工作量单位；实际授课记录、考勤/教学日志与工作量台账；S4 后续产生（C02 事后可部分已有）；校内实际授课/工作量权威汇总与版本引用；F034–F036；[SRC-002][SRC-003]；教师、课次、计量周期和台账版分别标明；无记录不可推定薪酬责任；数字模糊补清；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "核实际授课与学时记账；授课、教务、工作量单位；实际授课记录、考勤/教学日志与工作量台账；S4 后续产生（C02 事后可部分已有）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M017",
      "name": "M017 · 保留原申请/决定便于撤回、复核或再换；原办理机关",
      "purpose": "保留原申请/决定便于撤回、复核或再换；原办理机关；历史案卷、审批决定、权限及送达凭据；S5/C07 当前必需的前案事实；可信案卷引用优先，勿强迫上传学校已有文件；F037、F039；SRC=未取得 撤回复核专项制度；只读原案 ID、决定 ID、有效状态/版；找不到则暂停复核事实判定，不伪造原决定；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "保留原申请/决定便于撤回、复核或再换；原办理机关；历史案卷、审批决定、权限及送达凭据；S5/C07 当前必需的前案事实"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M018",
      "name": "M018 · 明确后续诉求和新增证据；当事人/受理单位",
      "purpose": "明确后续诉求和新增证据；当事人/受理单位；补件说明、撤回/续期/复核申请及受理事件；S5/C07 当前必需的新请求；可信案卷新事件代替纸件；原申请文件不覆盖；F038–F039、F041–F042；SRC=未取得 受理时效/权限专项制度；记录发起人身份、对应原决定、修订版；缺诉求待补；“已提交”≠“撤回成功”；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "明确后续诉求和新增证据；当事人/受理单位；补件说明、撤回/续期/复核申请及受理事件；S5/C07 当前必需的新请求"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M019",
      "name": "M019 · 处理人员变更同时调时间地点；T01-T01 业务权威单位",
      "purpose": "处理人员变更同时调时间地点；T01-T01 业务权威单位；T01-T01 审核/决定记录（非本模板内再审批）；S1/S3 条件必需（F018 为真且校本要求独立决定）；T01-T01 有效结论直接引用，不能用换人申请替代；F018、F043；[SRC-001]；关联同任务及课次、独立决定版；未批准不由 T01-T02 代批；纯调时间直接路由；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "处理人员变更同时调时间地点；T01-T01 业务权威单位；T01-T01 审核/决定记录（非本模板内再审批）；S1/S3 条件必需（F018 为真且校本要求独立决定）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M020",
      "name": "M020 · 核长期主讲交接考核/成绩职责；课程负责人和相关管理岗",
      "purpose": "核长期主讲交接考核/成绩职责；课程负责人和相关管理岗；交接清单/后续执行确认，仅教学责任，不包含成绩复核决定；S4 条件后置（C03 有考核交接时）；授课组织经认证的交接事件；F010、F013、F034、F044；[SRC-001]；交接课次、考核任务与接任人；若尚未开展考核不索取结果；学生成绩归 S02；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "核长期主讲交接考核/成绩职责；课程负责人和相关管理岗；交接清单/后续执行确认，仅教学责任，不包含成绩复核决定；S4 条件后置（C03 有考核交接时）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M021",
      "name": "M021 · 核紧急事故事实、通知和时序；课程组/当事人",
      "purpose": "核紧急事故事实、通知和时序；课程组/当事人；应急情况说明、联系记录、实际代课时间线；C02 发生后 S1 当前条件必需；有权教学值班/开课单位的当时日志摘要，不强迫提交私密通信全文；F019–F020、F034；[SRC-007]（仅旧院规线索）；记录事件时间而非伪写提前申请；不明补时序；有实际授课却无手续交人审，不判追认合法；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "核紧急事故事实、通知和时序；课程组/当事人；应急情况说明、联系记录、实际代课时间线；C02 发生后 S1 当前条件必需"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M022",
      "name": "M022 · 核外聘/兼职/外籍/实践岗位适用权限；任职/资格管理单位",
      "purpose": "核外聘/兼职/外籍/实践岗位适用权限；任职/资格管理单位；对应任职/工作许可、岗位培训/安全资质等有权结论；C08 S1 条件必需（具体适用政策未取得）；T06、人事或 G04 合格权威结论引用；不要求申请人交整本护照/人事卷；F012、F026–F027、F040；[SRC-001][SRC-005]；按身份/角色/学期和效力版匹配，敏感 P2/P3；适用细则未知交人审而非直接不通过；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "核外聘/兼职/外籍/实践岗位适用权限；任职/资格管理单位；对应任职/工作许可、岗位培训/安全资质等有权结论；C08 S1 条件必需（具体适用政策未取得）"
      ],
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "evidence-checks",
      "name": "R02 原稿规则逐条核验",
      "description": "依据原稿 T01-T02 §08 的全部独立 R 条目。触发未知不能当不适用；后续材料不视为起案缺件，SRC 仅为研究索引。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "R001 · 事项唯一边界",
          "requirement": "R001 R001 事项唯一边界；S0；T=拟变化为授课人员或其责任/份额；F=仅时间地点改变；U=声明与旧任务不清；[SRC-001][SRC-002]；F009/F012/F014/F017/F018；M001/M002/M003；E0 原任务对 E2 变更陈述，以 UID、角色、份额差异比较；不能因“换教室”标题认定换人；本研均需确认目的；T 相符 PASS_FACT→开课单位；F NOT_APPLICABLE→T01-T01；U NEEDS_MATERIAL/CONFLICT→申请人澄清。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R002",
          "title": "R002 · 原教学任务定位",
          "requirement": "R002 R002 原教学任务定位；S0；T=新办人员调整；F=纯后置执行检查沿用已冻结锚点；U=任务种类/学段未定；[SRC-001][SRC-002][SRC-004]；F001/F002/F003/F004/F005/F006/F007/F008；M001；E0 学年学期＋课程号＋教学班＋任务号定位；E1 院系核验摘录可人工兜底；禁止用课程名/同名教师跨班复用，当前任务取得时点入谱系；唯一匹配 PASS_FACT；错案 CONFLICT；权威源缺 SOURCE_UNAVAILABLE→教务/研究生教务核定。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R003",
          "title": "R003 · 原任务版本有效性",
          "requirement": "R003 R003 原任务版本有效性；S0/S1/S3 再核；T=有任务比对或修改；F=仅不触及任务的历史阅览；U=版本先后不明；[SRC-002]；F005/F006/F039/F044；M001/M014（S4 后才有）；E0 当前任务版本、来源时间与申请冻结基线比较；不能以旧截图替代新任务；新版本不当然推定旧正式决定失效；对齐 PASS_FACT；错版 CONFLICT；版本无法查询 SOURCE_UNAVAILABLE→任务管理岗确认并触发 R025。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "R004 · 发起人及代理真实性",
          "requirement": "R004 R004 发起人及代理真实性；S0/S5；T=有人发起、代办、撤回或复核；F=非用户发起的后台只读事实检查；U=岗位/委托范围不明；[SRC-001][SRC-003]（仅组织线索；专项申请权 SRC=未取得）；F021–F023/F038；M002/M005/M018（S5）；服务端登录主体与组织角色、代理授权的事项/期限比对；Renderer 身份、上传签名不等于受控 actor；具体谁可申请属于校本权限未知；身份/代理可验 PASS_FACT 仅说明授权事实；不符 CONFLICT；角色适用不明 POLICY_UNCONFIRMED→开课单位/学校授权管理员。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "R005 · 原任课人及责任映射",
          "requirement": "R005 R005 原任课人及责任映射；S0；T=从原教师转移责任；F=原任务尚未发生人员责任且为误路由；U=原任务多行责任不清；[SRC-001][SRC-002]；F005/F009–F011；M001/M006；E0 原任务人员唯一 ID、角色、原分配；同名不并案，助课不能默认为主讲；原任务版须与 R003 一致；一致 PASS_FACT；冲突 CONFLICT；无 UID 或原始行 NEEDS_MATERIAL/SOURCE_UNAVAILABLE→教务核验。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R006",
          "title": "R006 · 拟任课人身份唯一性",
          "requirement": "R006 R006 拟任课人身份唯一性；S1；T=拟替换/新增另一位授课人；F=仅原有合授者内部调分且无新增人；U=申请只写姓名或人事目录未匹配；[SRC-001][SRC-002]；F012/F013/F021/F044；M002/M006；E0 人员 ID 对 E2 姓名陈述，不采身份证影印替代目录；多名同名、本人/受托提交须分开；核拟任时间身份；UID 唯一相符 PASS_FACT；多 UID/错人 CONFLICT；目录失联 SOURCE_UNAVAILABLE→身份/人事岗位。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "R007 · 影响课次与时点",
          "requirement": "R007 R007 影响课次与时点；S0/S1；T=短期、长期或份额调整；F=仅 C07 已有决定查阅；U=课次/起止周、发生前后不明；[SRC-001][SRC-002]；F015/F016/F020；M001/M003（C02 另 M021）；E0 原教学安排与 E2 范围逐课次比对；分别记录计划/实际，未取得校规的申请提前日数不比较；与其他班不能混用；课次清晰 PASS_FACT；跨班矛盾 CONFLICT；范围缺 NEEDS_MATERIAL→申请人/教学秘书。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "R008 · 多人分摊/学时守恒",
          "requirement": "R008 R008 多人分摊/学时守恒；S1/S4；T=C04 合授份额、人员增减或需重计工作量；F=单课次无份额重分；U=原课时口径不明；[SRC-002]（仅 2025–26 学年第二学期）、[SRC-003]；F011/F016/F017/F035/F036；M001/M003，S4 才用 M016；比较同课同班同口径“原总学时—拟各人分配和—重复课次”，E0 原任务优先；仅报告算术差异，不设未经核实的准许误差或处罚；对齐 PASS_FACT；不守恒 CONFLICT；不同计量周期 NEEDS_HUMAN_DECISION→教务/工作量管理员。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "R009 · 同时改课表及邻接决定",
          "requirement": "R009 R009 同时改课表及邻接决定；S1/S3；T=F018 为真且确有人员变更；F=时间地点未变或仅时间调整误投；U=新旧课表差异不明；[SRC-001] 第24条仅调停课；F018/F028/F043；M001/M003/M019；E0 时间地点源差分，需 T01-T01 结论时按任务/课次/生效版只读引用；它不能替代人员调整决定，排课冲突只是事实提示；引用匹配 PASS_FACT；错课/错版 CONFLICT；源断连 SOURCE_UNAVAILABLE；权限差异→T01-T01 Owner/开课单位。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "R010 · 申请理由及佐证充分性",
          "requirement": "R010 R010 申请理由及佐证充分性；S1；T=人员替换申请称有特定事由；F=纯历史版本查询；U=必须提交何类证明无现行校规；[SRC-001][SRC-011]（院级现行性未知）、[SRC-007]（旧院规不作硬条件）；F019/F020；M002/M004；E2 陈述与可核时间线/E1 有权单位事由结论比较；不要求诊断隐私，不用模型评定疾病严重程度；校本必交证据种类待核；陈述事实清晰 PASS_FACT；互斥 CONFLICT；材料空 NEEDS_MATERIAL；是否构成例外 NEEDS_HUMAN_DECISION→开课学院。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "R011 · 任课资格权威结论",
          "requirement": "R011 R011 任课资格权威结论；S1；T=拟人拟担任需独立资格的主讲/指导角色；F=既有角色纯归档且无需新资格决定；U=学段/具体任课条件未定；[SRC-001][SRC-002]（本科）；[SRC-005][SRC-008]（研究生规则未取得/历史）；F012/F013/F026/F040；M006/M007；只读 T06-T04 或有权学院的资格决定 ID、对象、课程/角色、效期、版本；E2 证书照片不能代发资格；不能把历史研究生阈值套现行；有效匹配 PASS_FACT（仅资格事实）；结论不适用 CONFLICT；源断连 SOURCE_UNAVAILABLE；资格审批→T06/授权岗位。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "R012 · 聘任及特殊任职/安全引用",
          "requirement": "R012 R012 聘任及特殊任职/安全引用；S1；T=本科主讲聘任要求或 C08 外聘/兼职/外籍/实践岗位触发；F=不涉及额外岗位条件；U=哪类特别许可必需尚未获规章；[SRC-001][SRC-002][SRC-005]（外籍及实践细则未证）；F012/F013/F027/F040；M008/M022；E0 人事/任职权限的人员 ID、岗位、时间与授课身份匹配；实验/实践安全只引用 G04，有效结论需按范围校验；不复制完整人事或出入境敏感原件；权威身份记录相符 PASS_FACT；岗位不符 CONFLICT；特别条件未定 POLICY_UNCONFIRMED→人事/资格/G04 权威岗位。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R013",
          "title": "R013 · 学段、学院和政策时效",
          "requirement": "R013 R013 学段、学院和政策时效；S0/S3；T=每次发起或需正式权力判断；F=仅保存不作判定的历史材料；U=现行政策版本/适用范围不明；[SRC-001][SRC-002][SRC-004][SRC-005][SRC-008][SRC-011]；F002/F007/F008/F040；M001/M002；先核 E0 学段/学院/学期，再选择相应 SRC；SRC-002 不得套 2026–27 学期，SRC-011 不得跨学院，SRC-008 不得冒充 2021 后研规；有效性由校方确认；路由事实相符 PASS_FACT；政策版本缺 POLICY_UNCONFIRMED→本科教务/研究生院政策 Owner。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "R014 · 开课归口与跨单位关系",
          "requirement": "R014 R014 开课归口与跨单位关系；S0/S2；T=C06 跨院/公共课或开课归口与人员单位不同；F=同单位且无额外会签；U=课程归属变更未核；[SRC-001][SRC-003][SRC-004][SRC-011]（学院岗位线索，不证明会签权）；F007/F021/F022/F041；M001/M005（代理）、M011（S2）；E0 课程归口和受控单位关系比对；按实际组织权限分派，跨院双签数量无现行规范不得自设；未到 S2 不查 M011；归口明确 PASS_FACT；互斥 CONFLICT；签发权未知 POLICY_UNCONFIRMED→开课学院/教务/研究生院。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "R015 · 当事教师意见的真实归属",
          "requirement": "R015 R015 当事教师意见的真实归属；S2；T=校本流程确需原/拟任教师签认且节点已到；F=无需该签认或 S2 尚未到；U=签认是否法定必需未知；[SRC-001][SRC-011]（仅组织线索）；F009/F012/F024/F025；M009/M010；核 E0 认证签认或 E1 可验原件的签者 UID、时间及任务版；紧急失联 C02 不强制预先补签；不把课程组“同意”代替教师本人意见；相符 PASS_FACT；伪签/错人 CONFLICT；政策未知 POLICY_UNCONFIRMED→课程组/开课学院。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R016",
          "title": "R016 · 课程组协调记录",
          "requirement": "R016 R016 课程组协调记录；S2；T=真实流程要求课程组协调且进入该节点；F=校本流程豁免或尚未到 S2；U=人员变更是否适用第24条链未知；[SRC-001] 第24条只确定调停课；[SRC-011] 院级线索；F029/F041；M011；课程组有权代表、任务版、受影响课次及协调结论核对；E0 流程记录优先；不倒逼 S0 必交后置协调意见；可核 PASS_FACT；错对象 CONFLICT；是否必经未知 POLICY_UNCONFIRMED→课程组/学院教学负责人。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "R017 · 学院审核意见与权限",
          "requirement": "R017 R017 学院审核意见与权限；S3；T=校本人员变更链确含学院审核且已进节点；F=尚未到 S3 或该链不含学院审核；U=具体院级签署层级/是否会签未知；[SRC-001] 第24条与 [SRC-011] 仅有限适用；F007/F030/F041；M012；E0 审核日志对签发时任期、开课单位、任务版；E2 截图章无法独立证明有权审核；不把 M011 当作 M012；有效审核记录存在 PASS_FACT；错签/错案 CONFLICT；授权不明 NEEDS_HUMAN_DECISION→学院授权管理员。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "R018 · 正式决定与备案语义",
          "requirement": "R018 R018 正式决定与备案语义；S3/S5；T=需要核已作出的正式批准/备案/复核动作；F=事实预审尚未进入决策节点；U=人员变更的决定权及动作类型未证；[SRC-001]（调停课备案，不可直接外推）；F031/F032/F041/F042；M013，复核还参 M017/M018；E0 校方原生签发 ID、动作 APPROVAL/FILING/REVIEW、岗位授权、时间、适用任务版，E1 可核原件辅助；备案≠批准，“审批通过”截图不是权威记录；不凭 AI 生成决定；仅“决定记录真实/动作明确”可 PASS_FACT；权限不符 CONFLICT；未有有权决定 NEEDS_HUMAN_DECISION→校方正式决定岗位。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "R019 · 生效后任务/课表版本",
          "requirement": "R019 R019 生效后任务/课表版本；S4；T=有权决定已发生且到了实际实施节点；F=仅 S0–S3 事前审核；U=执行时点/决定效力不明；[SRC-002][SRC-003][SRC-004]（任务/岗位线索）；F005/F006/F017/F032/F044；M001/M013/M014；E0 新旧教学任务/授课人/课次差分，确认变更指向有效决定对象和生效时间；若无 M013 并不凭执行记录倒推出批准；研究生时效独立确认；对应 PASS_FACT（执行事实）；新旧版矛盾 CONFLICT；数据未同步 SOURCE_UNAVAILABLE→任务管理员。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R020",
          "title": "R020 · 受影响课程告知记录",
          "requirement": "R020 R020 受影响课程告知记录；S4；T=实际教学变化需学生/相关方知悉且校本条件成立；F=未到执行期或无适用告知要求；U=需送达的具体条件未知；[SRC-001]（一般教学实施职责，非专门送达条款）；F015/F033；M003/M015；E0 教学平台/学院通知的班级、课次、时间与执行版本；不可从“学生知道了”推定合法签发，不设未经确认的通知提前小时数；事实吻合 PASS_FACT；错班 CONFLICT；制度未知 POLICY_UNCONFIRMED→开课单位；事前不缺 M015。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R021",
          "title": "R021 · 实际授课与工作量记录",
          "requirement": "R021 R021 实际授课与工作量记录；S4 或 C02 已发生后；T=存在已经实际实施的代课或结算争议；F=未来尚未授课；U=实际课次/台账周期无法定；[SRC-002]（仅对应学期）、[SRC-003]；F034–F036；M003/M016/M021（C02）；比较 E0 实际授课人员、课次、小时与 E0 台账同口径字段；记录差异不自动认定工作量违法或生成薪酬；若台账未形成则分开看实课与结算；一致 PASS_FACT；超出申请范围 CONFLICT；台账未到期 NOT_APPLICABLE（台账子目标）；权威源断连 SOURCE_UNAVAILABLE→教务/工作量岗。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "R022 · 主讲更换的考核职责交接",
          "requirement": "R022 R022 主讲更换的考核职责交接；S4；T=C03 且已进入对应课程考核/批改交接；F=短时无考核责任转移或未来考核未发生；U=原新教师实际职责不明；[SRC-001] 第19/20条任课责任；F010/F013/F034/F044；M001/M014/M020；E0 课程教学任务与 E1 经授权交接清单比对题目、阅卷/成绩管理责任归属；学生成绩异议、成绩改动独立交 S02，不由本规则决定；交接事实清楚 PASS_FACT；任务与交接冲突 CONFLICT；未到阶段 NOT_APPLICABLE→课程负责人/考务岗位。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "R023 · 紧急顶替事实与补报时序",
          "requirement": "R023 R023 紧急顶替事实与补报时序；C02 的 S1/S4；T=已经发生临时实际换人；F=普通事前 C01；U=发生/通知/申请时刻不明；[SRC-001] 第24条仅调停课；[SRC-006] 事故制度转引；[SRC-007] 旧院级例外不作阈值；F019/F020/F034；M002/M021/M016（有则引用）；对 E0 值班/实课记录和 E2 时序说明列出事件点，不设“几小时内追认”硬阈值；紧急情况是否准许、是否事故由学校人员裁量；时间线一致 PASS_FACT；时序相抵 CONFLICT；追认与处罚 NEEDS_HUMAN_DECISION→开课学院/有权教学管理机关。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R024",
          "title": "R024 · 前案、撤回、重提和复核关系",
          "requirement": "R024 R024 前案、撤回、重提和复核关系；S5；T=补件/撤回/续期/再替换/复核；F=首次无前案；U=原决定或申请效力未知；[SRC-001] 仅校方教学管理一般背景；SRC=未取得 撤回/复核专项流程；F021/F022/F037–F039/F041/F042；M017/M018（新申请更换方案按需 M002/M003）；E0 原案/有权决定 ID、对象、效力、申请版本与新事件匹配；新提出的撤回≠撤销已生效决定；受理时限、提出资格、复核机关均待校本确认；关系可核 PASS_FACT（仅事件）；错案 CONFLICT；受理权/效力 NEEDS_HUMAN_DECISION→原决定/复核机关。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "R025 · 材料版控与旧结论失效范围",
          "requirement": "R025 R025 材料版控与旧结论失效范围；每次初审/补件/修订；T=新快照或某 M 版本替换；F=同版只读回看；U=来源/被替换版无谱系；[SRC-001][SRC-002] 支撑业务锚点，重审算法为设计约束；F005/F006/F039/F044；M001/M002/M003/M006/M013/M017/M018 及发生改动的任何 M；比较 sourceVersion、hash、归属和变更字段，按 §11 依赖表使受影响 R 旧观察失效；保留历史记录，不撤销学校原决定；E3 OCR 变化不能直接改 E0；版控一致 PASS_FACT；归属冲突 CONFLICT；版次缺 NEEDS_HUMAN_DECISION→案卷 Owner/证据经办人。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
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
  "templateId": "T01-T02",
  "name": "临时代课、教师替换与教学任务人员调整审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T01-T02.md",
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/T01-T02.md",
  "sourceDocumentBytes": 115666,
  "sourceDocumentSha256": "317734875022329b885e6dd9ac403db23279d47867923db42e7791cfbfd49e96",
  "sourceHashBasis": "dispatch manifest SHA-256; exact original Git blob bytes plus one LF (LINE_ENDING_DRIFT_ONE_LF)",
  "reviewedDocumentSha256": "ea9034f4c41d5726006cbfc942e4831655b5d918f492613e8f8605e666c71529",
  "officialSchoolTemplate": false,
  "researchStatus": "ROUND3_DRAFT",
  "policyStatusRaw": "PARTIALLY_VERIFIED_REQUIRES_CURRENT_POLICY_CONFIRMATION",
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
        "F009",
        "F012",
        "F014",
        "F017",
        "F018"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R001 事项唯一边界；S0；T=拟变化为授课人员或其责任/份额；F=仅时间地点改变；U=声明与旧任务不清；[SRC-001][SRC-002]；F009/F012/F014/F017/F018；M001/M002/M003；E0 原任务对 E2 变更陈述，以 UID、角色、份额差异比较；不能因“换教室”标题认定换人；本研均需确认目的；T 相符 PASS_FACT→开课单位；F NOT_APPLICABLE→T01-T01；U NEEDS_MATERIAL/CONFLICT→申请人澄清"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "fieldIds": [
        "F001",
        "F002",
        "F003",
        "F004",
        "F005",
        "F006",
        "F007",
        "F008"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R002 原教学任务定位；S0；T=新办人员调整；F=纯后置执行检查沿用已冻结锚点；U=任务种类/学段未定；[SRC-001][SRC-002][SRC-004]；F001/F002/F003/F004/F005/F006/F007/F008；M001；E0 学年学期＋课程号＋教学班＋任务号定位；E1 院系核验摘录可人工兜底；禁止用课程名/同名教师跨班复用，当前任务取得时点入谱系；唯一匹配 PASS_FACT；错案 CONFLICT；权威源缺 SOURCE_UNAVAILABLE→教务/研究生教务核定"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F005",
        "F006",
        "F039",
        "F044"
      ],
      "materialSlotIds": [
        "M001",
        "M014"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R003 原任务版本有效性；S0/S1/S3 再核；T=有任务比对或修改；F=仅不触及任务的历史阅览；U=版本先后不明；[SRC-002]；F005/F006/F039/F044；M001/M014（S4 后才有）；E0 当前任务版本、来源时间与申请冻结基线比较；不能以旧截图替代新任务；新版本不当然推定旧正式决定失效；对齐 PASS_FACT；错版 CONFLICT；版本无法查询 SOURCE_UNAVAILABLE→任务管理岗确认并触发 R025"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001",
        "SRC-003"
      ],
      "fieldIds": [
        "F021",
        "F022",
        "F023",
        "F038"
      ],
      "materialSlotIds": [
        "M002",
        "M005",
        "M018"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R004 发起人及代理真实性；S0/S5；T=有人发起、代办、撤回或复核；F=非用户发起的后台只读事实检查；U=岗位/委托范围不明；[SRC-001][SRC-003]（仅组织线索；专项申请权 SRC=未取得）；F021–F023/F038；M002/M005/M018（S5）；服务端登录主体与组织角色、代理授权的事项/期限比对；Renderer 身份、上传签名不等于受控 actor；具体谁可申请属于校本权限未知；身份/代理可验 PASS_FACT 仅说明授权事实；不符 CONFLICT；角色适用不明 POLICY_UNCONFIRMED→开课单位/学校授权管理员"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F005",
        "F009",
        "F010",
        "F011"
      ],
      "materialSlotIds": [
        "M001",
        "M006"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R005 原任课人及责任映射；S0；T=从原教师转移责任；F=原任务尚未发生人员责任且为误路由；U=原任务多行责任不清；[SRC-001][SRC-002]；F005/F009–F011；M001/M006；E0 原任务人员唯一 ID、角色、原分配；同名不并案，助课不能默认为主讲；原任务版须与 R003 一致；一致 PASS_FACT；冲突 CONFLICT；无 UID 或原始行 NEEDS_MATERIAL/SOURCE_UNAVAILABLE→教务核验"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F012",
        "F013",
        "F021",
        "F044"
      ],
      "materialSlotIds": [
        "M002",
        "M006"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R006 拟任课人身份唯一性；S1；T=拟替换/新增另一位授课人；F=仅原有合授者内部调分且无新增人；U=申请只写姓名或人事目录未匹配；[SRC-001][SRC-002]；F012/F013/F021/F044；M002/M006；E0 人员 ID 对 E2 姓名陈述，不采身份证影印替代目录；多名同名、本人/受托提交须分开；核拟任时间身份；UID 唯一相符 PASS_FACT；多 UID/错人 CONFLICT；目录失联 SOURCE_UNAVAILABLE→身份/人事岗位"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F015",
        "F016",
        "F020"
      ],
      "materialSlotIds": [
        "M001",
        "M003",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R007 影响课次与时点；S0/S1；T=短期、长期或份额调整；F=仅 C07 已有决定查阅；U=课次/起止周、发生前后不明；[SRC-001][SRC-002]；F015/F016/F020；M001/M003（C02 另 M021）；E0 原教学安排与 E2 范围逐课次比对；分别记录计划/实际，未取得校规的申请提前日数不比较；与其他班不能混用；课次清晰 PASS_FACT；跨班矛盾 CONFLICT；范围缺 NEEDS_MATERIAL→申请人/教学秘书"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-002",
        "SRC-003"
      ],
      "fieldIds": [
        "F011",
        "F016",
        "F017",
        "F035",
        "F036"
      ],
      "materialSlotIds": [
        "M001",
        "M003",
        "M016"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R008 多人分摊/学时守恒；S1/S4；T=C04 合授份额、人员增减或需重计工作量；F=单课次无份额重分；U=原课时口径不明；[SRC-002]（仅 2025–26 学年第二学期）、[SRC-003]；F011/F016/F017/F035/F036；M001/M003，S4 才用 M016；比较同课同班同口径“原总学时—拟各人分配和—重复课次”，E0 原任务优先；仅报告算术差异，不设未经核实的准许误差或处罚；对齐 PASS_FACT；不守恒 CONFLICT；不同计量周期 NEEDS_HUMAN_DECISION→教务/工作量管理员"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F018",
        "F028",
        "F043"
      ],
      "materialSlotIds": [
        "M001",
        "M003",
        "M019"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R009 同时改课表及邻接决定；S1/S3；T=F018 为真且确有人员变更；F=时间地点未变或仅时间调整误投；U=新旧课表差异不明；[SRC-001] 第24条仅调停课；F018/F028/F043；M001/M003/M019；E0 时间地点源差分，需 T01-T01 结论时按任务/课次/生效版只读引用；它不能替代人员调整决定，排课冲突只是事实提示；引用匹配 PASS_FACT；错课/错版 CONFLICT；源断连 SOURCE_UNAVAILABLE；权限差异→T01-T01 Owner/开课单位"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-001",
        "SRC-007",
        "SRC-011"
      ],
      "fieldIds": [
        "F019",
        "F020"
      ],
      "materialSlotIds": [
        "M002",
        "M004"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R010 申请理由及佐证充分性；S1；T=人员替换申请称有特定事由；F=纯历史版本查询；U=必须提交何类证明无现行校规；[SRC-001][SRC-011]（院级现行性未知）、[SRC-007]（旧院规不作硬条件）；F019/F020；M002/M004；E2 陈述与可核时间线/E1 有权单位事由结论比较；不要求诊断隐私，不用模型评定疾病严重程度；校本必交证据种类待核；陈述事实清晰 PASS_FACT；互斥 CONFLICT；材料空 NEEDS_MATERIAL；是否构成例外 NEEDS_HUMAN_DECISION→开课学院"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005",
        "SRC-008"
      ],
      "fieldIds": [
        "F012",
        "F013",
        "F026",
        "F040"
      ],
      "materialSlotIds": [
        "M006",
        "M007"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R011 任课资格权威结论；S1；T=拟人拟担任需独立资格的主讲/指导角色；F=既有角色纯归档且无需新资格决定；U=学段/具体任课条件未定；[SRC-001][SRC-002]（本科）；[SRC-005][SRC-008]（研究生规则未取得/历史）；F012/F013/F026/F040；M006/M007；只读 T06-T04 或有权学院的资格决定 ID、对象、课程/角色、效期、版本；E2 证书照片不能代发资格；不能把历史研究生阈值套现行；有效匹配 PASS_FACT（仅资格事实）；结论不适用 CONFLICT；源断连 SOURCE_UNAVAILABLE；资格审批→T06/授权岗位"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "fieldIds": [
        "F012",
        "F013",
        "F027",
        "F040"
      ],
      "materialSlotIds": [
        "M008",
        "M022"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R012 聘任及特殊任职/安全引用；S1；T=本科主讲聘任要求或 C08 外聘/兼职/外籍/实践岗位触发；F=不涉及额外岗位条件；U=哪类特别许可必需尚未获规章；[SRC-001][SRC-002][SRC-005]（外籍及实践细则未证）；F012/F013/F027/F040；M008/M022；E0 人事/任职权限的人员 ID、岗位、时间与授课身份匹配；实验/实践安全只引用 G04，有效结论需按范围校验；不复制完整人事或出入境敏感原件；权威身份记录相符 PASS_FACT；岗位不符 CONFLICT；特别条件未定 POLICY_UNCONFIRMED→人事/资格/G04 权威岗位"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-008",
        "SRC-011"
      ],
      "fieldIds": [
        "F002",
        "F007",
        "F008",
        "F040"
      ],
      "materialSlotIds": [
        "M001",
        "M002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R013 学段、学院和政策时效；S0/S3；T=每次发起或需正式权力判断；F=仅保存不作判定的历史材料；U=现行政策版本/适用范围不明；[SRC-001][SRC-002][SRC-004][SRC-005][SRC-008][SRC-011]；F002/F007/F008/F040；M001/M002；先核 E0 学段/学院/学期，再选择相应 SRC；SRC-002 不得套 2026–27 学期，SRC-011 不得跨学院，SRC-008 不得冒充 2021 后研规；有效性由校方确认；路由事实相符 PASS_FACT；政策版本缺 POLICY_UNCONFIRMED→本科教务/研究生院政策 Owner"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-011"
      ],
      "fieldIds": [
        "F007",
        "F021",
        "F022",
        "F041"
      ],
      "materialSlotIds": [
        "M001",
        "M005",
        "M011"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R014 开课归口与跨单位关系；S0/S2；T=C06 跨院/公共课或开课归口与人员单位不同；F=同单位且无额外会签；U=课程归属变更未核；[SRC-001][SRC-003][SRC-004][SRC-011]（学院岗位线索，不证明会签权）；F007/F021/F022/F041；M001/M005（代理）、M011（S2）；E0 课程归口和受控单位关系比对；按实际组织权限分派，跨院双签数量无现行规范不得自设；未到 S2 不查 M011；归口明确 PASS_FACT；互斥 CONFLICT；签发权未知 POLICY_UNCONFIRMED→开课学院/教务/研究生院"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-001",
        "SRC-011"
      ],
      "fieldIds": [
        "F009",
        "F012",
        "F024",
        "F025"
      ],
      "materialSlotIds": [
        "M009",
        "M010"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R015 当事教师意见的真实归属；S2；T=校本流程确需原/拟任教师签认且节点已到；F=无需该签认或 S2 尚未到；U=签认是否法定必需未知；[SRC-001][SRC-011]（仅组织线索）；F009/F012/F024/F025；M009/M010；核 E0 认证签认或 E1 可验原件的签者 UID、时间及任务版；紧急失联 C02 不强制预先补签；不把课程组“同意”代替教师本人意见；相符 PASS_FACT；伪签/错人 CONFLICT；政策未知 POLICY_UNCONFIRMED→课程组/开课学院"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-001",
        "SRC-011"
      ],
      "fieldIds": [
        "F029",
        "F041"
      ],
      "materialSlotIds": [
        "M011"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R016 课程组协调记录；S2；T=真实流程要求课程组协调且进入该节点；F=校本流程豁免或尚未到 S2；U=人员变更是否适用第24条链未知；[SRC-001] 第24条只确定调停课；[SRC-011] 院级线索；F029/F041；M011；课程组有权代表、任务版、受影响课次及协调结论核对；E0 流程记录优先；不倒逼 S0 必交后置协调意见；可核 PASS_FACT；错对象 CONFLICT；是否必经未知 POLICY_UNCONFIRMED→课程组/学院教学负责人"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-001",
        "SRC-011"
      ],
      "fieldIds": [
        "F007",
        "F030",
        "F041"
      ],
      "materialSlotIds": [
        "M011",
        "M012"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R017 学院审核意见与权限；S3；T=校本人员变更链确含学院审核且已进节点；F=尚未到 S3 或该链不含学院审核；U=具体院级签署层级/是否会签未知；[SRC-001] 第24条与 [SRC-011] 仅有限适用；F007/F030/F041；M012；E0 审核日志对签发时任期、开课单位、任务版；E2 截图章无法独立证明有权审核；不把 M011 当作 M012；有效审核记录存在 PASS_FACT；错签/错案 CONFLICT；授权不明 NEEDS_HUMAN_DECISION→学院授权管理员"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F031",
        "F032",
        "F041",
        "F042"
      ],
      "materialSlotIds": [
        "M013",
        "M017",
        "M018"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R018 正式决定与备案语义；S3/S5；T=需要核已作出的正式批准/备案/复核动作；F=事实预审尚未进入决策节点；U=人员变更的决定权及动作类型未证；[SRC-001]（调停课备案，不可直接外推）；F031/F032/F041/F042；M013，复核还参 M017/M018；E0 校方原生签发 ID、动作 APPROVAL/FILING/REVIEW、岗位授权、时间、适用任务版，E1 可核原件辅助；备案≠批准，“审批通过”截图不是权威记录；不凭 AI 生成决定；仅“决定记录真实/动作明确”可 PASS_FACT；权限不符 CONFLICT；未有有权决定 NEEDS_HUMAN_DECISION→校方正式决定岗位"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "fieldIds": [
        "F005",
        "F006",
        "F017",
        "F032",
        "F044"
      ],
      "materialSlotIds": [
        "M001",
        "M013",
        "M014"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R019 生效后任务/课表版本；S4；T=有权决定已发生且到了实际实施节点；F=仅 S0–S3 事前审核；U=执行时点/决定效力不明；[SRC-002][SRC-003][SRC-004]（任务/岗位线索）；F005/F006/F017/F032/F044；M001/M013/M014；E0 新旧教学任务/授课人/课次差分，确认变更指向有效决定对象和生效时间；若无 M013 并不凭执行记录倒推出批准；研究生时效独立确认；对应 PASS_FACT（执行事实）；新旧版矛盾 CONFLICT；数据未同步 SOURCE_UNAVAILABLE→任务管理员"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F015",
        "F033"
      ],
      "materialSlotIds": [
        "M003",
        "M015"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R020 受影响课程告知记录；S4；T=实际教学变化需学生/相关方知悉且校本条件成立；F=未到执行期或无适用告知要求；U=需送达的具体条件未知；[SRC-001]（一般教学实施职责，非专门送达条款）；F015/F033；M003/M015；E0 教学平台/学院通知的班级、课次、时间与执行版本；不可从“学生知道了”推定合法签发，不设未经确认的通知提前小时数；事实吻合 PASS_FACT；错班 CONFLICT；制度未知 POLICY_UNCONFIRMED→开课单位；事前不缺 M015"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-002",
        "SRC-003"
      ],
      "fieldIds": [
        "F034",
        "F035",
        "F036"
      ],
      "materialSlotIds": [
        "M003",
        "M016",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R021 实际授课与工作量记录；S4 或 C02 已发生后；T=存在已经实际实施的代课或结算争议；F=未来尚未授课；U=实际课次/台账周期无法定；[SRC-002]（仅对应学期）、[SRC-003]；F034–F036；M003/M016/M021（C02）；比较 E0 实际授课人员、课次、小时与 E0 台账同口径字段；记录差异不自动认定工作量违法或生成薪酬；若台账未形成则分开看实课与结算；一致 PASS_FACT；超出申请范围 CONFLICT；台账未到期 NOT_APPLICABLE（台账子目标）；权威源断连 SOURCE_UNAVAILABLE→教务/工作量岗"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F010",
        "F013",
        "F034",
        "F044"
      ],
      "materialSlotIds": [
        "M001",
        "M014",
        "M020"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R022 主讲更换的考核职责交接；S4；T=C03 且已进入对应课程考核/批改交接；F=短时无考核责任转移或未来考核未发生；U=原新教师实际职责不明；[SRC-001] 第19/20条任课责任；F010/F013/F034/F044；M001/M014/M020；E0 课程教学任务与 E1 经授权交接清单比对题目、阅卷/成绩管理责任归属；学生成绩异议、成绩改动独立交 S02，不由本规则决定；交接事实清楚 PASS_FACT；任务与交接冲突 CONFLICT；未到阶段 NOT_APPLICABLE→课程负责人/考务岗位"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-001",
        "SRC-006",
        "SRC-007"
      ],
      "fieldIds": [
        "F019",
        "F020",
        "F034"
      ],
      "materialSlotIds": [
        "M002",
        "M016",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R023 紧急顶替事实与补报时序；C02 的 S1/S4；T=已经发生临时实际换人；F=普通事前 C01；U=发生/通知/申请时刻不明；[SRC-001] 第24条仅调停课；[SRC-006] 事故制度转引；[SRC-007] 旧院级例外不作阈值；F019/F020/F034；M002/M021/M016（有则引用）；对 E0 值班/实课记录和 E2 时序说明列出事件点，不设“几小时内追认”硬阈值；紧急情况是否准许、是否事故由学校人员裁量；时间线一致 PASS_FACT；时序相抵 CONFLICT；追认与处罚 NEEDS_HUMAN_DECISION→开课学院/有权教学管理机关"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F021",
        "F022",
        "F037",
        "F038",
        "F039",
        "F041",
        "F042"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M017",
        "M018"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R024 前案、撤回、重提和复核关系；S5；T=补件/撤回/续期/再替换/复核；F=首次无前案；U=原决定或申请效力未知；[SRC-001] 仅校方教学管理一般背景；SRC=未取得 撤回/复核专项流程；F021/F022/F037–F039/F041/F042；M017/M018（新申请更换方案按需 M002/M003）；E0 原案/有权决定 ID、对象、效力、申请版本与新事件匹配；新提出的撤回≠撤销已生效决定；受理时限、提出资格、复核机关均待校本确认；关系可核 PASS_FACT（仅事件）；错案 CONFLICT；受理权/效力 NEEDS_HUMAN_DECISION→原决定/复核机关"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F005",
        "F006",
        "F039",
        "F044"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M003",
        "M006",
        "M013",
        "M017",
        "M018"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R025 材料版控与旧结论失效范围；每次初审/补件/修订；T=新快照或某 M 版本替换；F=同版只读回看；U=来源/被替换版无谱系；[SRC-001][SRC-002] 支撑业务锚点，重审算法为设计约束；F005/F006/F039/F044；M001/M002/M003/M006/M013/M017/M018 及发生改动的任何 M；比较 sourceVersion、hash、归属和变更字段，按 §11 依赖表使受影响 R 旧观察失效；保留历史记录，不撤销学校原决定；E3 OCR 变化不能直接改 E0；版控一致 PASS_FACT；归属冲突 CONFLICT；版次缺 NEEDS_HUMAN_DECISION→案卷 Owner/证据经办人"
    }
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "SRC-001；CDUT-VERIFIED｜成都理工大学《成都理工大学本科课程教学基本规范》（成理校教〔2022〕11号）；学校盖发制度 PDF（系校本规章汇编第 18–29 PDF 页） (https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf)；第 15、17、19、20、24、26、43、44 条；重点 PDF 页 22–25、29；2022-06-04 印发，第四十三条规定印发之日起施行，同时废止 2018 年《教师本科教学工作规范》；未查得后续废止文件",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-002",
      "title": "SRC-002；CDUT-VERIFIED｜成都理工大学教务处《关于做好2025-2026学年第二学期教学任务安排及课表编排的工作通知》（教通字〔2025〕45号）；原通知 PDF (https://aao.cdut.edu.cn/__local/6/D0/6E/D73FB595B334A89DCC3AB9C55E8_B2D0E7C3_27504.pdf)；第 1 页“教学任务实施原则”第 1–5 项；第 2 页课表原则；2025-10-29；仅 2025—2026 学年第二学期任务周期；无单列生效/废止条款",
      "url": "https://aao.cdut.edu.cn/__local/6/D0/6E/D73FB595B334A89DCC3AB9C55E8_B2D0E7C3_27504.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-003",
      "title": "SRC-003；CDUT-VERIFIED｜成都理工大学环境与土木工程学院《教务科》（岗位职责）；学院岗位说明 (https://cece.cdut.edu.cn/info/1028/5496.htm)；“教务科长岗位职责”第 4 项，“教学秘书岗位职责”第 1、3 项；2020-09-10；未给施行、废止时间",
      "url": "https://cece.cdut.edu.cn/info/1028/5496.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-004",
      "title": "SRC-004；CDUT-VERIFIED｜成都理工大学环境与土木工程学院《研究生管理科》（岗位职责）；学院岗位说明 (https://cece.cdut.edu.cn/info/1028/9592.htm)；“研究生教学管理岗位职责”第 1–4 项；2026-03-05；未给施行、废止时间",
      "url": "https://cece.cdut.edu.cn/info/1028/9592.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-005",
      "title": "SRC-005；CDUT-VERIFIED｜成都理工大学《关于印发〈成都理工大学来华留学生管理规定（试行）〉的通知》（成理校发〔2022〕26号）；官方 PDF (https://dbxb.cdut.edu.cn/__local/6/F5/86/E91EEDCF144F4BC5CA934E95F28_8F010406_8B8F6.pdf)；第 27 条，PDF 第 11 页（零基第 10 页）；2022-08-31 印发；施行/废止时间本轮尚未核定",
      "url": "https://dbxb.cdut.edu.cn/__local/6/F5/86/E91EEDCF144F4BC5CA934E95F28_8F010406_8B8F6.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-006",
      "title": "SRC-006；CDUT-VERIFIED｜成都理工大学教务处《关于2024-2025学年第二学期期末课程考试工作的通知》（教通字〔2025〕25号，见原件文字）；官方 PDF (https://www.aao.cdut.edu.cn/__local/A/A9/09/0D8AFAFE17938B772AAD0DE0803_19FDF450_3E3B5.pdf)；“其他要求”第 1 项，PDF 第 2 页；2025-06-23；2024—2025 学年第二学期考试周期",
      "url": "https://www.aao.cdut.edu.cn/__local/A/A9/09/0D8AFAFE17938B772AAD0DE0803_19FDF450_3E3B5.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-007",
      "title": "SRC-007；CURRENTITY-UNKNOWN｜成都理工大学马克思主义学院《马克思主义学院教学管理制度》；学院网页 (https://marx.cdut.edu.cn/info/1053/1208.htm)；检索可见“授课资格准入、课表管理、紧急替代/补办手续”段；网页检索显示约 2017 年发布；原文发布日期、施行/废止与当前修订尚待直接核查",
      "url": "https://marx.cdut.edu.cn/info/1053/1208.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-008",
      "title": "SRC-008；CURRENTITY-UNKNOWN｜成都理工大学《研究生课程建设及课程管理办法（暂行）》；学院转载网页 (https://cnae.cdut.edu.cn/info/1040/1425.htm)；第 11–14、26 条搜索摘录；摘录显示 2018 年 1 月起实施；是否被后续 2021 年课程教学管理办法整体/部分替代待查",
      "url": "https://cnae.cdut.edu.cn/info/1040/1425.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-009",
      "title": "SRC-009；CURRENTITY-UNKNOWN｜成都理工大学机电工程学院《机电工程学院新进教师教学规范培训会顺利召开》；学院网页 (https://mee.cdut.edu.cn/info/1050/3438.htm)；2026 年培训叙述检索摘录；网页显示 2026 年 1 月相关培训，施行/废止不适用",
      "url": "https://mee.cdut.edu.cn/info/1050/3438.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-010",
      "title": "SRC-010；CURRENTITY-UNKNOWN｜成都理工大学教务处《关于做好本科线上教学日常工作安排的通知》；教务处网页 (https://aao.cdut.edu.cn/info/1171/4372.htm)；“工作安排”第 1、2、4 项搜索摘录；2021-11-10；疫情线上教学特殊周期，未查持续效力",
      "url": "https://aao.cdut.edu.cn/info/1171/4372.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-011",
      "title": "SRC-011；CDUT-VERIFIED｜成都理工大学核技术与自动化工程学院《核技术与自动化工程学院教师教学工作管理办法》；学院发布的《本科教学管理文件汇编》原始 PDF (https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf)；第二部分学院文件，PDF 第 104–106 页，重点第 11 条（“更换教师”与《教师调课申请表》）；收录于学院 2022 年 8 月汇编；独立文件制定/施行日、修订/废止日未标定；不能据汇编日期推定现行效力",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = T01T02_TEMPLATE
