import type { TemplateVersion } from '@profer/shared'

export const T01T03_TEMPLATE: TemplateVersion = {
  "templateId": "T01-T03",
  "version": 1,
  "schemaVersion": 2,
  "name": "课程新开、停开和开课资格申请审核",
  "description": "本地研究模板 · 非校方正式模板。课程新开、停开和开课资格申请审核：基于 R02 原件逐条核验事实、证据和办理情形；所列材料包含后续权威记录，不代表初次提交均须上传。所有正式决定与未确认校本政策必须人工判断。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；政策 PARTIAL、全部正式决定需可信人员人工确认；研究 SRC 不是案卷 SourceRef。",
  "objectType": "custom",
  "displayName": {
    "template": "T01-T03 · 课程新开、停开和开课资格申请审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · case_id: string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F001 字段：case_id: string；ApplicationCase；P0；校内本次案卷 ID/本系统安全生成的本地 ID；M001；内；源（不可伪装校方正式受理号）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F001；原稿类型及阶段：F001；case_id: string；ApplicationCase；P0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F002",
      "label": "F002 · action: enum（新增/删减/停班/再次开课等候选）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F002 字段：action: enum（新增/删减/停班/再次开课等候选）；ApplicationCase；P0；申+有权部门路由确认；M001；内；补/人。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F002；原稿类型及阶段：F002；action: enum（新增/删减/停班/再次开课等候选）；ApplicationCase；P0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F003",
      "label": "F003 · scenario: enum A–H/I1/I2/I3/J/unknown",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F003 字段：scenario: enum A–H/I1/I2/I3/J/unknown；ApplicationCase；P0/P1；根据课程/学段/触发事件判定，人工复核；M001/M029；内；人。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F003；原稿类型及阶段：F003；scenario: enum A–H/I1/I2/I3/J/unknown；ApplicationCase；P0/P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F004",
      "label": "F004 · education_level: enum（本科/硕/博/未知）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F004 字段：education_level: enum（本科/硕/博/未知）；CourseIdentity；P1；库/研；M003/M030/M031；内；源/人。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F004；原稿类型及阶段：F004；education_level: enum（本科/硕/博/未知）；CourseIdentity；P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F005",
      "label": "F005 · term_id: string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F005 字段：term_id: string；ApplicationCase；P0；申与教/研学期计划核；M001/M014；内；补/源。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F005；原稿类型及阶段：F005；term_id: string；ApplicationCase；P0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F006",
      "label": "F006 · applicant_actor_id: string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F006 字段：applicant_actor_id: string；Actor；P0；认；M002；敏；源/人。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F006；原稿类型及阶段：F006；applicant_actor_id: string；Actor；P0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F007",
      "label": "F007 · applicant_org_id: string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F007 字段：applicant_org_id: string；Actor/Organization；P0；认与单位岗位名册；M002；内；源/人。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F007；原稿类型及阶段：F007；applicant_org_id: string；Actor/Organization；P0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F008",
      "label": "F008 · delegation_ref: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F008 字段：delegation_ref: string?；Actor/Delegation；P0 条件；认+正式委托/授权记录；M002；敏；补/人（非代理不得强求）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F008；原稿类型及阶段：F008；delegation_ref: string?；Actor/Delegation；P0 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F009",
      "label": "F009 · course_id_or_provisional: string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F009 字段：course_id_or_provisional: string；CourseIdentity；P1；库；新课可待学校编正式码；M003/M008；内；源/人。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F009；原稿类型及阶段：F009；course_id_or_provisional: string；CourseIdentity；P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F010",
      "label": "F010 · course_title: string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F010 字段：course_title: string；CourseIdentity；P1；库与申交叉；M003/M008/M015；公；补/冲突人工。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F010；原稿类型及阶段：F010；course_title: string；CourseIdentity；P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F011",
      "label": "F011 · course_owner_org_id: string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F011 字段：course_owner_org_id: string；CourseIdentity；P1；库/学院正式归属；M003；内；源/人。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F011；原稿类型及阶段：F011；course_owner_org_id: string；CourseIdentity；P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F012",
      "label": "F012 · training_plan_id: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F012 字段：training_plan_id: string?；TrainingPlanRevision；P1 A/C，B 条件；库/方案原件；M004；内；源/人。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F012；原稿类型及阶段：F012；training_plan_id: string?；TrainingPlanRevision；P1 A/C，B 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F013",
      "label": "F013 · training_plan_revision: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F013 字段：training_plan_revision: string?；TrainingPlanRevision；P1 A/C；库/正式盖章方案；M004；内；源/人。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F013；原稿类型及阶段：F013；training_plan_revision: string?；TrainingPlanRevision；P1 A/C；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F014",
      "label": "F014 · affected_program_grade: array",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F014 字段：affected_program_grade: array；TrainingPlanRevision；P1 A/C；库/培养单位受影响年级/专业说明；M004/M005；内；补/源。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F014；原稿类型及阶段：F014；affected_program_grade: array；TrainingPlanRevision；P1 A/C；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F015",
      "label": "F015 · proposed_course_delta: object",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F015 字段：proposed_course_delta: object；TrainingPlanRevision；P0 A/C；培养单位申请（新增、删减、课程属性/开课学期等）；M005；内；补/人。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F015；原稿类型及阶段：F015；proposed_course_delta: object；TrainingPlanRevision；P0 A/C；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F016",
      "label": "F016 · course_goal_alignment: object",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F016 字段：course_goal_alignment: object；CourseProposal；P1/P2 A/B/C；新课程大纲/学院论证；M006/M007；内；补/人（内容裁量不可自动通过）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F016；原稿类型及阶段：F016；course_goal_alignment: object；CourseProposal；P1/P2 A/B/C；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F017",
      "label": "F017 · syllabus_revision_ref: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F017 字段：syllabus_revision_ref: string?；CourseProposal；P0 B/E/I 条件；申/正式课程文件与版本；M007/M016/M030/M031；内；补/人。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F017；原稿类型及阶段：F017；syllabus_revision_ref: string?；CourseProposal；P0 B/E/I 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F018",
      "label": "F018 · syllabus_five_elements: object?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F018 字段：syllabus_five_elements: object?；CourseProposal；P1 B；大纲目标、对应关系、内容、评价方式及标准；M007；内；补/人（真实性待学院）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F018；原稿类型及阶段：F018；syllabus_five_elements: object?；CourseProposal；P1 B；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F019",
      "label": "F019 · textbook_and_ideology_ref: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F019 字段：textbook_and_ideology_ref: string?；CourseProposal；P2 B/E 条件；学院论证/教材审查记录；M007/M009；内；待/人（非每案独立证明）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F019；原稿类型及阶段：F019；textbook_and_ideology_ref: string?；CourseProposal；P2 B/E 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F020",
      "label": "F020 · teaching_org_review_ref: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F020 字段：teaching_org_review_ref: string?；OrganizationalReview；P2 B；基层组织正式论证记录；M009；内；待/源。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F020；原稿类型及阶段：F020；teaching_org_review_ref: string?；OrganizationalReview；P2 B；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F021",
      "label": "F021 · college_review_ref: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F021 字段：college_review_ref: string?；OrganizationalReview；P2 B/G；开课学院的正式论证；M009；内；待/源。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F021；原稿类型及阶段：F021；college_review_ref: string?；OrganizationalReview；P2 B/G；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F022",
      "label": "F022 · academic_committee_ref: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F022 字段：academic_committee_ref: string?；OrganizationalReview；P3 A/B/C/G；学院学术分委员会正式决定；M010；内；待/源。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F022；原稿类型及阶段：F022；academic_committee_ref: string?；OrganizationalReview；P3 A/B/C/G；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F023",
      "label": "F023 · expert_report_ref: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F023 字段：expert_report_ref: string?；OrganizationalReview；P3 A/C/G；专家论证报告；M011；内；待/源。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F023；原稿类型及阶段：F023；expert_report_ref: string?；OrganizationalReview；P3 A/C/G；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F024",
      "label": "F024 · receiving_college_opinion_ref: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F024 字段：receiving_college_opinion_ref: string?；OrganizationalReview；P2 跨学院；受课学院的可核意见；M012；内；待/人。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F024；原稿类型及阶段：F024；receiving_college_opinion_ref: string?；OrganizationalReview；P2 跨学院；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F025",
      "label": "F025 · teaching_qualification_decision_ref: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F025 字段：teaching_qualification_decision_ref: string?；ExternalDecision；P1 B/E/G 条件；T06-T04 任课资格、T02-T15 高校教师资格或人事/学院有权源；M013；敏；源/人（不重复判资格）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F025；原稿类型及阶段：F025；teaching_qualification_decision_ref: string?；ExternalDecision；P1 B/E/G 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F026",
      "label": "F026 · teaching_class_id: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F026 字段：teaching_class_id: string?；TeachingClass；P1 D/F/H；教务系统正式教学班号；M014；内；源/人（未排课可为空）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F026；原稿类型及阶段：F026；teaching_class_id: string?；TeachingClass；P1 D/F/H；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F027",
      "label": "F027 · teaching_task_ref: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F027 字段：teaching_task_ref: string?；TeachingTask；P1/P3；教务系统排课/教学任务版本；M014；内；源/待。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F027；原稿类型及阶段：F027；teaching_task_ref: string?；TeachingTask；P1/P3；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F028",
      "label": "F028 · elective_category: enum A/B/C/unknown",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F028 字段：elective_category: enum A/B/C/unknown；CourseProposal；P0 E；当期公选课系统类别；M015/M029；内；补/人（仅本科公选）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F028；原稿类型及阶段：F028；elective_category: enum A/B/C/unknown；CourseProposal；P0 E；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F029",
      "label": "F029 · campus_id: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F029 字段：campus_id: string?；CourseProposal；P0 E；教务系统/学院归属；M015/M024；内；补/人（宜宾签批条件）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F029；原稿类型及阶段：F029；campus_id: string?；CourseProposal；P0 E；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F030",
      "label": "F030 · selection_headcount: integer?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F030 字段：selection_headcount: integer?；TeachingClass；P3 D；教务正选结束人数统计；M018；内；源（未到节点则待）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F030；原稿类型及阶段：F030；selection_headcount: integer?；TeachingClass；P3 D；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F031",
      "label": "F031 · selection_snapshot_at: datetime?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F031 字段：selection_snapshot_at: datetime?；TeachingClass；P3 D；教务正选截止后的不可变快照；M018；内；源/待。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F031；原稿类型及阶段：F031；selection_snapshot_at: datetime?；TeachingClass；P3 D；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F032",
      "label": "F032 · attendance_headcount: integer?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F032 字段：attendance_headcount: integer?；TeachingClass；P3 F；学院真实考勤/课堂记录；M019；内；源/待（不能用选课人数代替）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F032；原稿类型及阶段：F032；attendance_headcount: integer?；TeachingClass；P3 F；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F033",
      "label": "F033 · attendance_session_and_time: object?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F033 字段：attendance_session_and_time: object?；TeachingClass；P3 F；具体课次、时间及口径；M019；内；源/待。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F033；原稿类型及阶段：F033；attendance_session_and_time: object?；TeachingClass；P3 F；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F034",
      "label": "F034 · evaluation_trigger_refs: array?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F034 字段：evaluation_trigger_refs: array?；TeachingQualityCase；P1 G；评价/督导等权威来源；M020；敏；源/人（不得泄露评价者）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F034；原稿类型及阶段：F034；evaluation_trigger_refs: array?；TeachingQualityCase；P1 G；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F035",
      "label": "F035 · student_impact_and_alternatives: object?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F035 字段：student_impact_and_alternatives: object?；StudentImpactSummary；P1/P5 C/D/F/H；校内受影响人数、替代/补选安排摘要；M005/M021/M026；敏；源/人（默认聚合）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F035；原稿类型及阶段：F035；student_impact_and_alternatives: object?；StudentImpactSummary；P1/P5 C/D/F/H；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F036",
      "label": "F036 · authorized_decision_ref: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F036 字段：authorized_decision_ref: string?；DecisionRef；P4；教/研正式审批、备案或停开记录；M022/M023/M025/M032；内；待/源（不得由申请人自填）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F036；原稿类型及阶段：F036；authorized_decision_ref: string?；DecisionRef；P4；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F037",
      "label": "F037 · decision_kind: enum?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F037 字段：decision_kind: enum?；DecisionRef；P4；与 F036 同源，区分审批/备案/批次审核/停班；M022/M023/M025/M032；内；待/源。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F037；原稿类型及阶段：F037；decision_kind: enum?；DecisionRef；P4；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F038",
      "label": "F038 · decision_issuer_id: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F038 字段：decision_issuer_id: string?；DecisionRef；P4；官方签发单位与有权人/岗位；M022/M023/M025/M032；敏；待/源/人。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F038；原稿类型及阶段：F038；decision_issuer_id: string?；DecisionRef；P4；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F039",
      "label": "F039 · decision_at: datetime?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F039 字段：decision_at: datetime?；DecisionRef；P4；官方签发/备案时间；M022/M023/M025/M032；内；待/源。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F039；原稿类型及阶段：F039；decision_at: datetime?；DecisionRef；P4；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F040",
      "label": "F040 · notification_ref: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F040 字段：notification_ref: string?；Notification；P5；教务处/学院正式通知与教务系统状态；M026；内；待/源。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F040；原稿类型及阶段：F040；notification_ref: string?；Notification；P5；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F041",
      "label": "F041 · request_revision: string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F041 字段：request_revision: string；MaterialRevision；P0/P6；本案申请编号/修订序号；M001/M027；内；补/源。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F041；原稿类型及阶段：F041；request_revision: string；MaterialRevision；P0/P6；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F042",
      "label": "F042 · evidence_fingerprint: string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F042 字段：evidence_fingerprint: string；MaterialRevision；P1/P6；本地材料不可变散列、版本清单；M027；内；源/人（非校方签章）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F042；原稿类型及阶段：F042；evidence_fingerprint: string；MaterialRevision；P1/P6；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F043",
      "label": "F043 · withdrawal_or_recheck_ref: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F043 字段：withdrawal_or_recheck_ref: string?；ProceduralAction；P6；原渠道受理/撤回/复核通知；M028；敏；待/源/人。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F043；原稿类型及阶段：F043；withdrawal_or_recheck_ref: string?；ProceduralAction；P6；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F044",
      "label": "F044 · applicable_policy_revision: string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F044 字段：applicable_policy_revision: string?；PolicyApplicability；P1；SRC-001 和有权当期通知原文；M029；内；源/人（未确认则 POLICY_UNCONFIRMED）。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F044；原稿类型及阶段：F044；applicable_policy_revision: string?；PolicyApplicability；P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F045",
      "label": "F045 · excluded_general_elective_plan_listing: enum(true/false/unknown)",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F045 字段：excluded_general_elective_plan_listing: enum(true/false/unknown)；2026/27-1 本科 E；P1；特定 2021/2025 版培养方案通识选修条目命中状态；教务正式培养方案课程条目及公选申报名单按课程主键对位，M033/M015；SRC-002；内；SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED，不得同名判重或跨期使用。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F045；原稿类型及阶段：F045；excluded_general_elective_plan_listing: enum(true/false/unknown)；2026/27-1 本科 E；P1；特定 2021/2025 版培养方案通识选修条目命中状态；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F046",
      "label": "F046 · public_elective_batch_metrics: object?（学时、容量、教师本批门次、拟开班数）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F046 字段：public_elective_batch_metrics: object?（学时、容量、教师本批门次、拟开班数）；本科 E；P1/P2，仅当 2026/27-1 或另有对应有效通知；教务申请与官方汇总 M015/M016/M024，SRC-002；内；SOURCE_UNAVAILABLE/CONFLICT/NEEDS_HUMAN_DECISION；超限只能生成校方复核问题，不自动拒绝。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F046；原稿类型及阶段：F046；public_elective_batch_metrics: object?（学时、容量、教师本批门次、拟开班数）；本科 E；P1/P2，仅当 2026/27-1 或另有对应有效通知；不自行猜测阈值或校方数据接口。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 申请动作及当前案卷范围；培养单位/课程负责人提交的申请记录或安全生成的内部案卷登记",
      "purpose": "申请动作及当前案卷范围；培养单位/课程负责人提交的申请记录或安全生成的内部案卷登记；A/B/C/E/G 当 P0；H/J 条件；D/F 不要求申请书；可用校方正式线上申请单替纸件；F001–F005,F041 / SRC-001,002,003；对应课程/学期/申请版本；N/U；学校正式受理号不可自行编造；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "申请动作及当前案卷范围；培养单位/课程负责人提交的申请记录或安全生成的内部案卷登记；A/B/C/E/G 当 P0；H/J 条件；D/F 不要求申请书；可用校方正式线上申请单替纸件；F001–F005,F041 / SRC-001,002,003"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "M002 · 发起人及经办授权；校方账号/岗位任命/授权证明，由认证/人事及被代理单位保管",
      "purpose": "发起人及经办授权；校方账号/岗位任命/授权证明，由认证/人事及被代理单位保管；有人申请时 当 P0，代理场景 条；已认证组织岗位可替代身份证复印件，非代理无需委托书；F006–F008 / SRC-001,003；人、单位、角色、有效期及代理链；S/U/H，身份不一致报冲突；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "发起人及经办授权；校方账号/岗位任命/授权证明，由认证/人事及被代理单位保管；有人申请时 当 P0，代理场景 条；已认证组织岗位可替代身份证复印件，非代理无需委托书；F006–F008 / SRC-001,003"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "M003 · 校内课程身份及归属；教务课程库记录/所属学院确认",
      "purpose": "校内课程身份及归属；教务课程库记录/所属学院确认；已入库课程 当/条 P1；全新课程不得先强求正式课程码；正式课程库快照可代纸件证明；F004,F009–F011 / SRC-001；课程 ID/学院/学段/快照版本；S/U/H；同名课不自动等同；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "校内课程身份及归属；教务课程库记录/所属学院确认；已入库课程 当/条 P1；全新课程不得先强求正式课程码；正式课程库快照可代纸件证明；F004,F009–F011 / SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M004",
      "name": "M004 · 拟受影响的正式培养方案及课程表；培养单位或教务处保管的计划版本",
      "purpose": "拟受影响的正式培养方案及课程表；培养单位或教务处保管的计划版本；A/C 当 P1，B 涉及方案改变时 条；可信方案记录代上传；F012–F014 / SRC-001 第 6–8 条；专业年级、版本及生效届别；S/U/H，无适用版不得比较；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "拟受影响的正式培养方案及课程表；培养单位或教务处保管的计划版本；A/C 当 P1，B 涉及方案改变时 条；可信方案记录代上传；F012–F014 / SRC-001 第 6–8 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M005",
      "name": "M005 · 新增/删减/修改的提案及对已有学生的影响说明；培养单位申请文本/变更对照",
      "purpose": "新增/删减/修改的提案及对已有学生的影响说明；培养单位申请文本/变更对照；A/C 当 P0；具体独立影响报告未证实为法定表单，可合并在正式申请中；系统方案 diff 可作辅助；F014,F015,F035 / SRC-001 第 7、8 条；原方案→拟方案的可追溯差异；N/U/H（影响字段缺少时请人补充，非自动拒绝）；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "新增/删减/修改的提案及对已有学生的影响说明；培养单位申请文本/变更对照；A/C 当 P0；具体独立影响报告未证实为法定表单，可合并在正式申请中；系统方案 diff 可作辅助；F014,F015,F035 / SRC-001 第 7、8 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M006",
      "name": "M006 · 课程目标与培养目标、毕业要求支撑说明；课程负责人/培养单位大纲或学院论证",
      "purpose": "课程目标与培养目标、毕业要求支撑说明；课程负责人/培养单位大纲或学院论证；B 条 P1/P2；A 新增时 条；可直接引用大纲中相应部分而非再造独立申请书；F016,F018 / SRC-001 第 10、18 条；关联课程目标、大纲版、受影响方案版；N/U/H，内容充分性留院审；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "课程目标与培养目标、毕业要求支撑说明；课程负责人/培养单位大纲或学院论证；B 条 P1/P2；A 新增时 条；可直接引用大纲中相应部分而非再造独立申请书；F016,F018 / SRC-001 第 10、18 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M007",
      "name": "M007 · 新课程教学大纲及教材/教学目标信息；课程负责人提交的正式大纲",
      "purpose": "新课程教学大纲及教材/教学目标信息；课程负责人提交的正式大纲；B 当 P0；A/E/I 条件；公选可同一文件复用 M016，无须重复上传；F016–F019 / SRC-001 第 10、18 条、SRC-003；课程版、学时、目标、教材、附件页；N/U/H，缺要素提示不代审内容；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "新课程教学大纲及教材/教学目标信息；课程负责人提交的正式大纲；B 当 P0；A/E/I 条件；公选可同一文件复用 M016，无须重复上传；F016–F019 / SRC-001 第 10、18 条、SRC-003"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M008",
      "name": "M008 · 新开课程申请表；课程负责人填写，正式样张尚未检索到",
      "purpose": "新开课程申请表；课程负责人填写，正式样张尚未检索到；B 当 P0（名称见正式制度）；经学院认可的校方线上同义申请记录可替代，字段、签章格式需核；F002,F009,F010,F041 / SRC-001 第 18 条；课程/申请人/目标学期及签署版本；N/U/P，不得自创必填列；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "新开课程申请表；课程负责人填写，正式样张尚未检索到；B 当 P0（名称见正式制度）；经学院认可的校方线上同义申请记录可替代，字段、签章格式需核；F002,F009,F010,F041 / SRC-001 第 18 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M009",
      "name": "M009 · 基层教学组织通过论证及开课学院论证意见；学院/基层组织会议记录或审核流转记录",
      "purpose": "基层教学组织通过论证及开课学院论证意见；学院/基层组织会议记录或审核流转记录；B 后 P2；G 再次论证可复用相应院审记录；允许同一校方纪要覆盖两个职责但须分别可辨；F019–F021 / SRC-001 第 17、18、21 条；签发组织、会议时间、课程及大纲版；未到 WAIT，已到 S/U/H；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "基层教学组织通过论证及开课学院论证意见；学院/基层组织会议记录或审核流转记录；B 后 P2；G 再次论证可复用相应院审记录；允许同一校方纪要覆盖两个职责但须分别可辨；F019–F021 / SRC-001 第 17、18、21 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M010",
      "name": "M010 · 学院学术分委员会审核同意记录；学院正式会议决议",
      "purpose": "学院学术分委员会审核同意记录；学院正式会议决议；A/B/C/G 后 P3；可信学院审批记录代扫描件；F022 / SRC-001 第 7、18、21 条；决议 ID/签发单位/案卷与版本；未到 WAIT，到期 S/U/H；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "学院学术分委员会审核同意记录；学院正式会议决议；A/B/C/G 后 P3；可信学院审批记录代扫描件；F022 / SRC-001 第 7、18、21 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M011",
      "name": "M011 · 专家论证报告；培养单位/开课学院组织的专家论证材料",
      "purpose": "专家论证报告；培养单位/开课学院组织的专家论证材料；A/C/G 后 P3，提交教务审批时按 SRC-001 配套；B 不因名称相近而强制多交一份独立专家报告；F023 / SRC-001 第 7、21 条；专家、对象、报告时间、方案/课程版；未到 WAIT，到期 N/U/H；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "专家论证报告；培养单位/开课学院组织的专家论证材料；A/C/G 后 P3，提交教务审批时按 SRC-001 配套；B 不因名称相近而强制多交一份独立专家报告；F023 / SRC-001 第 7、21 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M012",
      "name": "M012 · 受课学院意见；跨学院开课由开课学院收集正式意见",
      "purpose": "受课学院意见；跨学院开课由开课学院收集正式意见；跨学院条 P2；可含于联合审定/会议纪要，不强制单独表格；F024 / SRC-001 第 11、17 条；受课学院、课程和版本；不适用则 NOT_APPLICABLE，适用时 N/U/H；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "受课学院意见；跨学院开课由开课学院收集正式意见；跨学院条 P2；可含于联合审定/会议纪要，不强制单独表格；F024 / SRC-001 第 11、17 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M013",
      "name": "M013 · 教师资格/任课资格的已有权威结论；人事、开课学院与 T06-T04/T02-T15 有权所有者持有",
      "purpose": "教师资格/任课资格的已有权威结论；人事、开课学院与 T06-T04/T02-T15 有权所有者持有；B/E/G 的具体资格前提 条 P1；复用有签发来源的任课决定，不能要求申请人无故重传学历证；F025 / SRC-001 第 17、19、21 条、SRC-004；对应教师与拟授课程/学期、有效状态；S/U/H，禁止 Agent 自评资格；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "教师资格/任课资格的已有权威结论；人事、开课学院与 T06-T04/T02-T15 有权所有者持有；B/E/G 的具体资格前提 条 P1；复用有签发来源的任课决定，不能要求申请人无故重传学历证；F025 / SRC-001 第 17、19、21 条、SRC-004"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M014",
      "name": "M014 · 教学任务、排课和教学班状态；教务处权威教务系统记录",
      "purpose": "教学任务、排课和教学班状态；教务处权威教务系统记录；D/F/H 当 P1/P3，其他涉及开课时条件；不存在正式班号时仅记拟设班；F005,F026,F027 / SRC-001 第 23、24 条、SRC-004；教学班 ID、课程、学期、冻结时间；S/U，不造假班号；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "教学任务、排课和教学班状态；教务处权威教务系统记录；D/F/H 当 P1/P3，其他涉及开课时条件；不存在正式班号时仅记拟设班；F005,F026,F027 / SRC-001 第 23、24 条、SRC-004"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M015",
      "name": "M015 · 本科公共选修课线上开课申请；任课教师申报、教务系统持有",
      "purpose": "本科公共选修课线上开课申请；任课教师申报、教务系统持有；仅适用当期公选批次 当 P0；系统导出申报详情可作合法替代，不强制补手填同义表；F002,F010,F028,F029 / SRC-002,003；课程类别、教师、开课学院、批次；N/U/P（2026/27-1 已截止）；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "本科公共选修课线上开课申请；任课教师申报、教务系统持有；仅适用当期公选批次 当 P0；系统导出申报详情可作合法替代，不强制补手填同义表；F002,F010,F028,F029 / SRC-002,003"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M016",
      "name": "M016 · 公选课通知要求的 PDF 大纲；教师提交、学院/系统保管",
      "purpose": "公选课通知要求的 PDF 大纲；教师提交、学院/系统保管；E 的适用批次 当 P0；可与 M007 同文件复用但只上传一次；F017,F018 / SRC-002,003；文件页、课程学时、上传版；N/U/P，非公选无需交；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "公选课通知要求的 PDF 大纲；教师提交、学院/系统保管；E 的适用批次 当 P0；可与 M007 同文件复用但只上传一次；F017,F018 / SRC-002,003"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M017",
      "name": "M017 · 公选课打印申报表及所属学院初审；教师打印、系主任/教学院长签核，学院保管",
      "purpose": "公选课打印申报表及所属学院初审；教师打印、系主任/教学院长签核，学院保管；E 后 P2，不可在首次点击申报时就要求已签齐；系统签核若校方认可可代纸件；F006,F007,F029 / SRC-002,003；签署单位/时间、申请批次与修订版；WAIT 后 N/U/H；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "公选课打印申报表及所属学院初审；教师打印、系主任/教学院长签核，学院保管；E 后 P2，不可在首次点击申报时就要求已签齐；系统签核若校方认可可代纸件；F006,F007,F029 / SRC-002,003"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M018",
      "name": "M018 · 正选结束后教学班人数快照；教务系统/教务处持有",
      "purpose": "正选结束后教学班人数快照；教务系统/教务处持有；D 正选结束后 P3；权威统计报告可代个人截图，其他情形不可用这份记录证明到课人数；F030,F031 / SRC-001 第 23 条、SRC-005 第 13 条；选课截止时点、班号、类别、统计口径；未到 WAIT，到期 S/U/P；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "正选结束后教学班人数快照；教务系统/教务处持有；D 正选结束后 P3；权威统计报告可代个人截图，其他情形不可用这份记录证明到课人数；F030,F031 / SRC-001 第 23 条、SRC-005 第 13 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M019",
      "name": "M019 · 开课后实际到课记录；课程管理单位/教师考勤原记录",
      "purpose": "开课后实际到课记录；课程管理单位/教师考勤原记录；F 到达规定课次后 P3；可用学校认可考勤系统/学院核实清单，不能以选课人数代替；F032,F033 / SRC-002,003；班号、课次、日期、到课统计口径；未到 WAIT，到期 S/U/H；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "开课后实际到课记录；课程管理单位/教师考勤原记录；F 到达规定课次后 P3；可用学校认可考勤系统/学院核实清单，不能以选课人数代替；F032,F033 / SRC-002,003"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M020",
      "name": "M020 · 课程教学评价或督导异议的真实触发记录；教育评价部门/学院持有",
      "purpose": "课程教学评价或督导异议的真实触发记录；教育评价部门/学院持有；G 当 P1（评价事件已产生）；权威评价摘要可替代含个资原件；F034 / SRC-001 第 21 条；课程/班号/评价周期/原签发源；S/U/H，泄露举报人信息禁止；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "课程教学评价或督导异议的真实触发记录；教育评价部门/学院持有；G 当 P1（评价事件已产生）；权威评价摘要可替代含个资原件；F034 / SRC-001 第 21 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M021",
      "name": "M021 · 课程停开/方案变更的受影响学生统计及替代安排草案；学院/教务部门持有",
      "purpose": "课程停开/方案变更的受影响学生统计及替代安排草案；学院/教务部门持有；C/D/F/H 条 P1–P3；仅最小聚合事实，替代方案须部门确认；不要学生自行重复证明；F035 / SRC-001 第 7、23、24 条、SRC-006；原教学班/方案版、影响范围及方案版；S/U/H，未知人数不等于零；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "课程停开/方案变更的受影响学生统计及替代安排草案；学院/教务部门持有；C/D/F/H 条 P1–P3；仅最小聚合事实，替代方案须部门确认；不要学生自行重复证明；F035 / SRC-001 第 7、23、24 条、SRC-006"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M022",
      "name": "M022 · 教务处对培养方案变更或再次开课的审批；教务处正式决定记录",
      "purpose": "教务处对培养方案变更或再次开课的审批；教务处正式决定记录；A/C/G 后 P4；公文/审批系统中真实结果替代纸件；F036–F039 / SRC-001 第 7、21 条；有权签发者、审批时间、课程/方案版；未到 WAIT，到期 S/U/H；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "教务处对培养方案变更或再次开课的审批；教务处正式决定记录；A/C/G 后 P4；公文/审批系统中真实结果替代纸件；F036–F039 / SRC-001 第 7、21 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M023",
      "name": "M023 · 本科新开课教务处备案完成凭据；教务处记录",
      "purpose": "本科新开课教务处备案完成凭据；教务处记录；B 后 P4；正式备案回执/教务系统确认均须核真；F036–F039 / SRC-001 第 18 条；备案与原学院批准版本一致；未到 WAIT，到期 S/U/H，不可拿 M022 冒充；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "本科新开课教务处备案完成凭据；教务处记录；B 后 P4；正式备案回执/教务系统确认均须核真；F036–F039 / SRC-001 第 18 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M024",
      "name": "M024 · 公选课学院汇总表签字盖章、校区附加双签；归属学院教务科保管",
      "purpose": "公选课学院汇总表签字盖章、校区附加双签；归属学院教务科保管；E 后 P2；宜宾校区双签条件必需（限适用批次），校方认可电子签核可代纸；F007,F029 / SRC-002,003；对应批次、课程清单、汇总签发单位；WAIT 后 N/U/P；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "公选课学院汇总表签字盖章、校区附加双签；归属学院教务科保管；E 后 P2；宜宾校区双签条件必需（限适用批次），校方认可电子签核可代纸；F007,F029 / SRC-002,003"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M025",
      "name": "M025 · 公选课校级审核或停班执行的正式记录；教务处/有权学校系统持有",
      "purpose": "公选课校级审核或停班执行的正式记录；教务处/有权学校系统持有；E/D/F/H 后 P4，但 H 例外批准机关未核；不以 OCR 申请表“同意”代替；F036–F039 / SRC-001,002,003,006；结果动作种类、班号、签发单位和时间；WAIT 后 S/U/H/P；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "公选课校级审核或停班执行的正式记录；教务处/有权学校系统持有；E/D/F/H 后 P4，但 H 例外批准机关未核；不以 OCR 申请表“同意”代替；F036–F039 / SRC-001,002,003,006"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M026",
      "name": "M026 · 开停课结果通知及学生补选/替代衔接；教务处/归口学院通知",
      "purpose": "开停课结果通知及学生补选/替代衔接；教务处/归口学院通知；C/D/F/H 后 P5；正式通知/学生系统变更记录可互核；F035,F040 / SRC-005,006；被通知对象、课程/学期、公告与执行时点；WAIT 后 S/U/H；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "开停课结果通知及学生补选/替代衔接；教务处/归口学院通知；C/D/F/H 后 P5；正式通知/学生系统变更记录可互核；F035,F040 / SRC-005,006"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M027",
      "name": "M027 · 本案申请与证据版本清单、替换映射；案件受理系统持有",
      "purpose": "本案申请与证据版本清单、替换映射；案件受理系统持有；任意情形 P1 起、P6 变更时必核；由审核案卷自身生成，不要求申请人提供技术 JSON；F041,F042 / 全部相关 SRC；原件 ID、哈希、版本、时戳、旧结论引用；S/H，被替换内容不能直接覆盖；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "本案申请与证据版本清单、替换映射；案件受理系统持有；任意情形 P1 起、P6 变更时必核；由审核案卷自身生成，不要求申请人提供技术 JSON；F041,F042 / 全部相关 SRC"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M028",
      "name": "M028 · 撤回/更正/复核请求及原渠道受理记录；原申请人或有权利害关系人及受理部门持有",
      "purpose": "撤回/更正/复核请求及原渠道受理记录；原申请人或有权利害关系人及受理部门持有；J/P6 条；申请人请求书只证明请求，不证明受理或复核权；要有真实受理引用；F043 / 当前暂无统一 SRC，依原 A–I3 的 SRC；关联原决定/案卷与代理权；N/U/H/P，超时限制未知；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "撤回/更正/复核请求及原渠道受理记录；原申请人或有权利害关系人及受理部门持有；J/P6 条；申请人请求书只证明请求，不证明受理或复核权；要有真实受理引用；F043 / 当前暂无统一 SRC，依原 A–I3 的 SRC"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M029",
      "name": "M029 · 适用政策版本及当期批次通知；教务处/研究生院官网或正式发文",
      "purpose": "适用政策版本及当期批次通知；教务处/研究生院官网或正式发文；所有情形 当 P1 的系统调查项；可信官方发布记录替代申请人上传；F003,F044 / SRC-001–SRC-009；学段、适用学期、发布日期、生效期、来源；S/P，缺政策不得硬判；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "适用政策版本及当期批次通知；教务处/研究生院官网或正式发文；所有情形 当 P1 的系统调查项；可信官方发布记录替代申请人上传；F003,F044 / SRC-001–SRC-009"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M030",
      "name": "M030 · 研究生公选课开课申请/教学大纲；研究生教师、学院保管（历史材料槽）",
      "purpose": "研究生公选课开课申请/教学大纲；研究生教师、学院保管（历史材料槽）；I1 条 P0，现行性未核，不列 2026 硬必需；如校方承认已提交的同义系统记录则复用；F004,F017,F018 / SRC-007；学年/学期、研究生课程编号、学院及版；P/U/H；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "研究生公选课开课申请/教学大纲；研究生教师、学院保管（历史材料槽）；I1 条 P0，现行性未核，不列 2026 硬必需；如校方承认已提交的同义系统记录则复用；F004,F017,F018 / SRC-007"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M031",
      "name": "M031 · 研究生国际化课程开课申请、课程大纲及相关来访前置文件；课程负责人/院系保管",
      "purpose": "研究生国际化课程开课申请、课程大纲及相关来访前置文件；课程负责人/院系保管；I2 条 P0/P2，以 2024 流程为线索；境外来访完整版及劳务合同为后续阶段，不预先收；F004,F017,F018,F025 / SRC-008；课程版、专家来访类型、学院初评、材料阶段；P/U/H，报销材料排除；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "研究生国际化课程开课申请、课程大纲及相关来访前置文件；课程负责人/院系保管；I2 条 P0/P2，以 2024 流程为线索；境外来访完整版及劳务合同为后续阶段，不预先收；F004,F017,F018,F025 / SRC-008"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M032",
      "name": "M032 · 研究生院课程评审/开课决定或再次审查结果；研究生院有权机关持有",
      "purpose": "研究生院课程评审/开课决定或再次审查结果；研究生院有权机关持有；I1/I2/I3 后 P4，J 涉研生复核时条件；决议来源、有效期与授权待核；F036–F039,F043 / SRC-007–SRC-010（010 仅制度线索）；研究生课程/培养方案/批次版本；WAIT 后 S/U/H/P；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "研究生院课程评审/开课决定或再次审查结果；研究生院有权机关持有；I1/I2/I3 后 P4，J 涉研生复核时条件；决议来源、有效期与授权待核；F036–F039,F043 / SRC-007–SRC-010（010 仅制度线索）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M033",
      "name": "M033 · 2021/2025 版培养方案通识选修课程身份与当期公选申报的官方对照快照；教务处课程库、培养方案 owner 持有，不是教师上传另一份方案",
      "purpose": "2021/2025 版培养方案通识选修课程身份与当期公选申报的官方对照快照；教务处课程库、培养方案 owner 持有，不是教师上传另一份方案；E 且应用 2026/27-1 条件 P1；权威方案库和正式名单可替代任何文件；其他学期要有当期明文才启用；F009–F013,F045 / SRC-002,SRC-001；课程官方主键、计划版本、计划类别、申报批次；来源断线 S，同名不同课 H/CONFLICT，绝不把旧目录直接用作新批次强制排除；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "2021/2025 版培养方案通识选修课程身份与当期公选申报的官方对照快照；教务处课程库、培养方案 owner 持有，不是教师上传另一份方案；E 且应用 2026/27-1 条件 P1；权威方案库和正式名单可替代任何文件；其他学期要有当期明文才启用；F009–F013,F045 / SRC-002,SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "evidence-checks",
      "name": "R02 原稿规则逐条核验",
      "description": "依据原稿 T01-T03 §08 的全部独立 R 条目。触发未知不能当不适用；后续材料不视为起案缺件，SRC 仅为研究索引。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "R001 · P1 政策适用与版本",
          "requirement": "R001 R001 P1 政策适用与版本；真=任意 A–J 已确定学段学期；假=非本事项；未知=层次/学期不明。SRC-001–010（SRC-010 仅间接警示）；F003,F004,F005,F044 / M029；校本正文/有效批次与学段、课程类型、目标学期匹配；区分印发有效制度与历史批次；SRC-005 现行性及阈值冲突、SRC-009/010 研究生新旧管理办法正文缺口单列；本次适用事实可核 PASS_FACT；未来批次/研生/冲突处 POLICY_UNCONFIRMED→教/研政策负责人；站点取不到 SOURCE_UNAVAILABLE→政策保管部门。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "R002 · P0/P1 申请事件及跨模板路由",
          "requirement": "R002 R002 P0/P1 申请事件及跨模板路由；真=A/B/C/E/G 或 H 有真实申请、J 有真实请求；D/F 若只有系统事件则核事件而不要求申请书；假=单节调课 T01-T01、纯 T06-T04/T05-T03/S02/G04；未知=动作词含糊。SRC-001,003,004,011（011 仅负向边界）；F001–F005,F041 / M001,M014；申请动作与课程/班次对象、主键、学期、申请修订匹配；D/F 读取官方事件而非造教师申请；A+B 和 C+D 不拆模板但保留独立动作；范围匹配 PASS_FACT；相邻目的 NOT_APPLICABLE 并路由；缺申请方本阶段必要记录 NEEDS_MATERIAL→申请方，动作含糊 NEEDS_HUMAN_DECISION→教/院。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "R003 · P0 申请人及代理权",
          "requirement": "R003 R003 P0 申请人及代理权；真=有人以申请人/代理身份操作 A/B/C/E/G/H/J；假=D/F 纯系统事件；未知=身份或委托链不明。SRC-001,003；F006–F008 / M002；服务端认证工号/组织岗位/代理授权有效期与提交时刻匹配；姓名/Renderer actorId 非可信凭据；当前任职不倒推历史权限；权威链一致 PASS_FACT；身份矛盾 CONFLICT→单位身份管理员；未可回源 SOURCE_UNAVAILABLE→认证/人事；代理资格争议 NEEDS_HUMAN_DECISION→单位负责人。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "R004 · P1 课程身份及归口",
          "requirement": "R004 R004 P1 课程身份及归口；真=有课程身份可核（A/C/D/E/F/G/H 或 B 已入库）；假=B 真实全新课程尚无正式码；未知=课程同名归属不明。SRC-001；F004,F009–F011 / M003,M008；课程库主键+开课学院+学段一致；B 可用暂存主键，不可凭同名课冒用代码；查版本快照；对位一致 PASS_FACT；跨单位/主键冲突 CONFLICT→教课程库管理人；库不可达 SOURCE_UNAVAILABLE→教；新课暂存不报缺件。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "R005 · P1 培养方案真实版本",
          "requirement": "R005 R005 P1 培养方案真实版本；真=A/C 或 B 同时修改培养方案；假=B 纯课程备案、D/F 仅班次停开；未知=是否影响培养方案。SRC-001 第 6–8 条；F012–F014 / M004；课程→专业、年级、培养方案 ID/生效版本与基准课程表对应，不能用最新方案覆盖旧届；一致 PASS_FACT；方案版矛盾 CONFLICT→培养单位/教；权威库不可取 SOURCE_UNAVAILABLE→教；是否影响旧届需人审。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R006",
          "title": "R006 · P0/P1 增删改提案差异",
          "requirement": "R006 R006 P0/P1 增删改提案差异；真=A/C；假=仅某学期 D 停班；未知=变更是课程永久身份还是班次。SRC-001 第 7、8 条；F014,F015,F035 / M005,M021；原方案→拟方案的条目、课程性质、开课学期与受影响届别 diff；影响说明可并入申请，不得自创必须独立报告；差异存在且可归属 PASS_FACT；拟变更缺必要申请内容 NEEDS_MATERIAL→培养单位；学生保障方案的足够性 NEEDS_HUMAN_DECISION→院/教。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "R007 · P0 本科新课申请原件",
          "requirement": "R007 R007 P0 本科新课申请原件；真=B；假=仅 A/C（无新开课动作）或 D/F；未知=是否“首次开课”。SRC-001 第 18 条；F002,F009,F010,F041 / M008；存在课程负责人“新开课程申请表”或校方认可的等价线上申请，申请课程/学期/修订号对应；正式表样字段未取得；申请存在且范围一致 PASS_FACT；未提交 NEEDS_MATERIAL→课程负责人；特定未验证栏目 POLICY_UNCONFIRMED→教表单管理者。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "R008 · P0–P2 大纲与课程目标对应",
          "requirement": "R008 R008 P0–P2 大纲与课程目标对应；真=B；A 新增课/E/I 要求大纲则条件真；假=D/F 仅人数事件；未知=当期大纲是否另需。SRC-001 第 10、18 条，SRC-003,007,008；F016–F019 / M006,M007,M016,M030,M031；大纲是否包含已证实所需目标、内容、学时/评价要素，课程 ID/归属/版本一致；支撑论证可定位同文页，教材意识形态实体评价由学院承担；E/I 仅在适用有效通知时核格式；结构事实 PASS_FACT；本阶段规定大纲缺 NEEDS_MATERIAL→课程负责人；已交坏页 UNREADABLE→上传方；学术充分性 NEEDS_HUMAN_DECISION→院。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "R009 · P2 基层论证、学院审核记录",
          "requirement": "R009 R009 P2 基层论证、学院审核记录；真=B 到达基层/学院审查，G 到达学院重新论证；假=无需此链 D；未知=学院组织动作未明确。SRC-001 第 17、18、21 条；F019–F021 / M009；基层与学院两个职责可同一记录但需分别识别主体、时间、所审大纲版，教材/意识形态论证不可 OCR 自作价值判断；两类记录真实 PASS_FACT，审议质量 NEEDS_HUMAN_DECISION→院；P0 WAIT_NOT_DUE；应形成而未可查 SOURCE_UNAVAILABLE→学院文书管理员。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "R010 · P3 学术分委员会审议",
          "requirement": "R010 R010 P3 学术分委员会审议；真=A/B/C/G 且已送委员会；假=D/F/E 仅独立批次审核；未知=是否已启动委员会。SRC-001 第 7、18、21 条；F022 / M010；正式决议的委员会、课程/方案/大纲版、日期、审核结果与授权核对；普通教师签字不替代委员会；可核记录 PASS_FACT（若否决则如实显示否决事实，不自动批准）；权源冲突 CONFLICT→院；真实性不明 NEEDS_HUMAN_DECISION→委员会秘书；P0–P2 WAIT_NOT_DUE。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "R011 · P3 专家论证报告",
          "requirement": "R011 R011 P3 专家论证报告；真=A/C/G 已到送专家环节；假=B 只循第 18 条无独立专家报告要求；未知=分支类型不明。SRC-001 第 7、21 条；F023 / M011；报告有对象、专家/单位、时间、所论证方案版；意见是否充分、异常专家资质由院核；已成可核 PASS_FACT；P0/P1 WAIT_NOT_DUE；应提交送审批仍缺 NEEDS_MATERIAL→培养单位/学院；内容裁量 NEEDS_HUMAN_DECISION→院/教。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "R012 · P2 跨学院受课意见",
          "requirement": "R012 R012 P2 跨学院受课意见；真=B 等跨学院开课；假=开课与受课学院相同；未知=课程归属或受课对象未明。SRC-001 第 11、17 条；F011,F014,F024 / M012；核受课学院正式意见及课程版；可纳入联合纪要，但必须能定位受课学院签发主体；不从普通课程名称推断跨院；真实意见 PASS_FACT；已到会商而未给 NEEDS_MATERIAL→开课学院；跨院事实不明 SOURCE_UNAVAILABLE→课程归口部门。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R013",
          "title": "R013 · P1 外部教师任课资格结论引用",
          "requirement": "R013 R013 P1 外部教师任课资格结论引用；真=有学校明定的教师资格前提或 G 涉教师能力提升；假=本次无个人资格事项；未知=前提规则/外部结论状态不明。SRC-001 第 17、19、21 条，SRC-004；F025 / M013；仅校方或 T06-T04/T02-T15 的正式结论，核同一工号、课程范围、适用期、签发者；不重审学历/资质，不拿项目获批代任课资格；可信结果可核 PASS_FACT（仅引用其原状态）；外部系统未联 SOURCE_UNAVAILABLE→T06-T04/人事 owner；资格争议 NEEDS_HUMAN_DECISION→原资格 owner。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R014",
          "title": "R014 · P1/P3 教学班/教学任务时点",
          "requirement": "R014 R014 P1/P3 教学班/教学任务时点；真=D/F/H 已有实际班次；B/E 进入排课时条件真；假=B 尚处创建课程阶段无班号；未知=开课/正选阶段不明。SRC-001 第 23、24 条，SRC-004；F005,F026,F027 / M014；教学班主键、学期、实际行课/正选/排课状态及快照一致；“停一节课”与“停整个班”分开；班次一致 PASS_FACT；错班号 CONFLICT→教；系统不能取 SOURCE_UNAVAILABLE→教运行科；未排班号不报缺件。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "R015 · P0 本科公选线上申报及 PDF",
          "requirement": "R015 R015 P0 本科公选线上申报及 PDF；真=E 且有效目标批次确实受理此类课程；假=非 E；未知=新批次规则失联。SRC-002,003；F010,F017,F028,F044 / M015,M016,M029；申报系统批次、类别 A/B/C、大纲 PDF 和教师/课程对位；2026/27-1 历史截至日不可套下一批；同一大纲复用 M007；当前有效批次事实可核 PASS_FACT；应申报未交 NEEDS_MATERIAL→教师；政策失效 POLICY_UNCONFIRMED→教；PDF 坏页 UNREADABLE→教师。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R016",
          "title": "R016 · P2 公选初审汇总与校区条件签署",
          "requirement": "R016 R016 P2 公选初审汇总与校区条件签署；真=E 到学院初审/汇总，适用批次且宜宾才核附加双签；假=非 E/非宜宾不核双签；未知=校区/批次未知。SRC-002,003；F006,F007,F029 / M017,M024；系主任与教学院长初审、学院汇总对应同一申报版；校区双签只在该批次规则真实生效时要求；可接受校方确认电子流转；权限及签核记录可核 PASS_FACT；P0 WAIT_NOT_DUE；需签尚缺 NEEDS_MATERIAL→学院初审岗位；批次不明 POLICY_UNCONFIRMED→教。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "R017 · P3 正选人数快照及停班触发",
          "requirement": "R017 R017 P3 正选人数快照及停班触发；真=D 且正选结束；假=非 D 或正选未结束（后者内部 WAIT_NOT_DUE）；未知=班号/类别/截止事件不明。SRC-001 第 23 条、SRC-005 第 13 条；F026,F028,F030,F031,F044 / M018,M029；仅比对正选结束人数、时间、课程类别和官方班号；15/20 等号文本冲突且 SRC-005 效力不明，整套停班阈值需教务确认后才可执行数值判别；人数快照真实性 PASS_FACT；停班条件 POLICY_UNCONFIRMED→教规则负责人；源失联 SOURCE_UNAVAILABLE→教选课部门；不代作停班决定。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "R018 · P3 已开课到课事实",
          "requirement": "R018 R018 P3 已开课到课事实；真=F 且适用批次约定的观察课次已到；假=非 F，课次未到 WAIT_NOT_DUE；未知=当期通知或课次口径不明。SRC-002,003，并核 SRC-001 第 24 条；F026,F032,F033,F044 / M019,M029；按课次、时点及教学班核实际到课，而非选课数；历史通知的“开课后 3 次后不足 20”不能用于新批次或专业课；正式行课后原则不停止需教务解释例外；考勤事实 PASS_FACT；是否停班 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→教；坏考勤 UNREADABLE→持有人。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "R019 · P1 课程评价触发真实性",
          "requirement": "R019 R019 P1 课程评价触发真实性；真=G 且真实评价异常；假=无课程质量触发；未知=原评价来源不可核。SRC-001 第 21 条；F034 / M020；校方评价事件 ID、课程/教学班/评价周期及通知范围，仅取脱敏摘要；教师个人改进转 R013/T06；触发可核 PASS_FACT；权威源失联 SOURCE_UNAVAILABLE→评价主管单位；课程质量争议 NEEDS_HUMAN_DECISION→学院，不披露评价人。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R020",
          "title": "R020 · P1–P5 学生受影响与安排",
          "requirement": "R020 R020 P1–P5 学生受影响与安排；真=C/D/F/H 已影响学生或有保障安排义务；A 新增可条件真；假=确无既有学生影响且有依据；未知=旧届/在选学生是否受影响。SRC-001 第 7、23、24 条，SRC-006；F014,F035,F040 / M005,M021,M026；核受影响专业/年级/教学班及聚合人数，拟替代/补选与实际通知分开，学生逐人成绩/课程替代转 S02，未知人数不能标 0；影响范围事实 PASS_FACT；替代方案权利裁量 NEEDS_HUMAN_DECISION→院/教/S02 owner；学生系统不可取 SOURCE_UNAVAILABLE→教。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R021",
          "title": "R021 · P4 培养方案/再开课校级审批引用",
          "requirement": "R021 R021 P4 培养方案/再开课校级审批引用；真=A/C/G 实际已到审批动作；假=B 纯新课备案/E 批次审核；未知=是否只收到学院意见。SRC-001 第 7、21 条；F012,F013,F036–F039 / M022；比对教务处审批决定 ID、结果（可同意/不同意/退回）、签发机关及方案/课程版/生效期；不得把学院决议当教务批准；仅文书元事实 PASS_FACT→记录决定原状态；P0–P3 WAIT_NOT_DUE；授权可疑 NEEDS_HUMAN_DECISION→教；权威记录失联 SOURCE_UNAVAILABLE→教。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "R022 · P4 新课备案完成引用",
          "requirement": "R022 R022 P4 新课备案完成引用；真=B 实际完成校级备案（即使叠 A 仍单独核）；假=无 B；未知=备案状态未能确认。SRC-001 第 18 条；F009,F036–F039 / M023；校方备案回执与学院同意版大纲、课程、开课学期对应；区分备案完成、已提交待备案和审批，不能拿 M022 替代；回执事实 PASS_FACT（不能表示审批同意）；未到 P4 WAIT_NOT_DUE；待办 NEEDS_HUMAN_DECISION→教备案岗位，源失联 SOURCE_UNAVAILABLE→教。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "R023 · P4 公选批次审核/停班操作引用",
          "requirement": "R023 R023 P4 公选批次审核/停班操作引用；真=E 已有批次审核、D/F 已产生正式停班动作，H 被有权机关确实纳入例外决定；假=纯 A/B/C/G；未知=H 是否存在此种授权。SRC-001,002,003,006；F026,F036–F039 / M025；校方动作 batch_review/class_stop 与班号、申报批次、签发/操作时点和角色对照；班次变更不能反写为“删培养方案”；已形成可核动作 PASS_FACT，未形成不等于同意；源失联 SOURCE_UNAVAILABLE→教；H 无权源 POLICY_UNCONFIRMED→教。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R024",
          "title": "R024 · P5 正式告知和实施引用",
          "requirement": "R024 R024 P5 正式告知和实施引用；真=C/D/F/H 已到要求通知的阶段，或其他情形有真实告知义务；假=尚未决定，内部 WAIT_NOT_DUE；未知=是否发生有效通知。SRC-005,006；F035,F040 / M026；学校通知与班次/方案、决定号、受影响群体与时间对位，实际补退选不在本 ID 代写；“草拟通知”不等于已发；已告知事实 PASS_FACT；通知权/处置 NEEDS_HUMAN_DECISION→教/院；记录源失联 SOURCE_UNAVAILABLE→教；不代修改学生记录。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R025",
          "title": "R025 · P0–P2 研究生类型/历史表单识别",
          "requirement": "R025 R025 P0–P2 研究生类型/历史表单识别；真=I1/I2/I3；假=本科 A–H；未知=研究生课程类型不明。SRC-007,008,009,010（010 只警示版本）；F004,F017,F018,F025,F044 / M030,M031,M029；区分普通、公选、国际化；旧 2018 暂行与 2021 校发制度存在潜在交替，须获 2021 全文及现行批准链；历史原件仅核“所提交材料所述事实”，不能据其强制现行表单、课时数、专家来访/报销材料；历史表单关联可核 PASS_FACT；所有现行办理门槛 POLICY_UNCONFIRMED→研；原页不可取 SOURCE_UNAVAILABLE→研。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R026",
          "title": "R026 · P4 研究生院正式结论引用",
          "requirement": "R026 R026 P4 研究生院正式结论引用；真=I1/I2/I3 且已有相关有效决定；假=本科；未知=现行签发机关或批次授权不明。SRC-007–009；F036–F039,F043 / M032；仅校方可回源的研究生院或经证实授权机关决定，核课程/学期/版本/动作与签发时点；2021/2018 线索不证实 2026 审批权限；已签发事实 PASS_FACT；授权不明 POLICY_UNCONFIRMED→研；已到但未决 NEEDS_HUMAN_DECISION→研，不以本科 M022 冒充。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R027",
          "title": "R027 · P1/P6 材料谱系与定向重审",
          "requirement": "R027 R027 P1/P6 材料谱系与定向重审；真=所有案首次固化或任一 M 被替换；假=无版本变化的重复查看（可复用缓存）；未知=旧源哈希/引用断链。SRC-001–009 依原业务；F001,F017,F022,F041,F042 / M027（及被替换的任意 M）；比较源 ID/哈希、签发人、适用对象、所依课程/方案/大纲版，生成 old→new 映射；按 11.3 依赖图仅使相关 R 旧事实结论失效，不撤销有权学校决定；谱系完整 PASS_FACT；无法对版 CONFLICT→案+原签发院/教；断链 SOURCE_UNAVAILABLE→案；需重新院审 NEEDS_HUMAN_DECISION→院。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R028",
          "title": "R028 · P6 撤回/重提/复核请求事实",
          "requirement": "R028 R028 P6 撤回/重提/复核请求事实；真=J 有真实申请或利害关系请求；假=无请求；未知=代理权/受理程序/期限不清。以原情形 SRC-001–009 为线索，无统一有效复核 SRC；F006–F008,F041–F043 / M028,M027,M002；请求人身份、原案/旧决定、请求类型/版本、真实受理/答复分别核；撤回请求不等于撤回生效，复核请求不自动撤销原批件，重提使用新修订；请求事实 PASS_FACT；资格/期限 POLICY_UNCONFIRMED→教/研；是否受理、撤回生效、复核结果 NEEDS_HUMAN_DECISION→原有权机关；不写自动同意。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "R029 · P1/P2 2026 秋本科公选准入附加事实",
          "requirement": "R029 R029 P1/P2 2026 秋本科公选准入附加事实；真=E 且目标学期 2026/27-1、官方通知 SRC-002 适用；假=非 E 或已证明不属该学期；未知=新一批次是否延续规定。SRC-002“一”“二”5–7、“三”；F005,F009–F011,F028,F044–F046 / M015,M016,M024,M029,M033；对官方课程主键核是否属于2021/2025 版培养方案列明的通识选修课；从学校申报/汇总核教师本批申报门次、学时、容量、拟开班数；该批次 1 门次、原则不超 32 学时、120 人、课程原则 1 班是单批次限制/原则，不可迁移或机械拒绝例外；排除清单需权威课程映射；可定位的课程版、申报数值事实 PASS_FACT；课程库失联 SOURCE_UNAVAILABLE→教；新批次延续未知 POLICY_UNCONFIRMED→教；超原则/确属排除类 NEEDS_HUMAN_DECISION、同名异码 CONFLICT→归属学院+教务审核岗位，不由模型自动“不予开课”。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
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
  "templateId": "T01-T03",
  "name": "课程新开、停开和开课资格申请审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T01-T03.md",
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/T01-T03.md",
  "sourceDocumentBytes": 129898,
  "sourceDocumentSha256": "e15185affe654f39e9acbd38ad65d17af7b2e48a206c3e8675087f6400f40976",
  "sourceHashBasis": "dispatch manifest SHA-256; exact original Git blob bytes plus one LF (LINE_ENDING_DRIFT_ONE_LF)",
  "reviewedDocumentSha256": "9aaa8649c19b3f9c6058f633e64f9b486ad294761853c40e85c0cc6d9c60c2cd",
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
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-010"
      ],
      "fieldIds": [
        "F003",
        "F004",
        "F005",
        "F029",
        "F044"
      ],
      "materialSlotIds": [
        "M029"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R001 P1 政策适用与版本；真=任意 A–J 已确定学段学期；假=非本事项；未知=层次/学期不明。SRC-001–010（SRC-010 仅间接警示）；F003,F004,F005,F044 / M029；校本正文/有效批次与学段、课程类型、目标学期匹配；区分印发有效制度与历史批次；SRC-005 现行性及阈值冲突、SRC-009/010 研究生新旧管理办法正文缺口单列；本次适用事实可核 PASS_FACT；未来批次/研生/冲突处 POLICY_UNCONFIRMED→教/研政策负责人；站点取不到 SOURCE_UNAVAILABLE→政策保管部门"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-011"
      ],
      "fieldIds": [
        "F001",
        "F002",
        "F003",
        "F004",
        "F005",
        "F014",
        "F041"
      ],
      "materialSlotIds": [
        "M001",
        "M014"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R002 P0/P1 申请事件及跨模板路由；真=A/B/C/E/G 或 H 有真实申请、J 有真实请求；D/F 若只有系统事件则核事件而不要求申请书；假=单节调课 T01-T01、纯 T06-T04/T05-T03/S02/G04；未知=动作词含糊。SRC-001,003,004,011（011 仅负向边界）；F001–F005,F041 / M001,M014；申请动作与课程/班次对象、主键、学期、申请修订匹配；D/F 读取官方事件而非造教师申请；A+B 和 C+D 不拆模板但保留独立动作；范围匹配 PASS_FACT；相邻目的 NOT_APPLICABLE 并路由；缺申请方本阶段必要记录 NEEDS_MATERIAL→申请方，动作含糊 NEEDS_HUMAN_DECISION→教/院"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-001",
        "SRC-003"
      ],
      "fieldIds": [
        "F006",
        "F007",
        "F008"
      ],
      "materialSlotIds": [
        "M002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R003 P0 申请人及代理权；真=有人以申请人/代理身份操作 A/B/C/E/G/H/J；假=D/F 纯系统事件；未知=身份或委托链不明。SRC-001,003；F006–F008 / M002；服务端认证工号/组织岗位/代理授权有效期与提交时刻匹配；姓名/Renderer actorId 非可信凭据；当前任职不倒推历史权限；权威链一致 PASS_FACT；身份矛盾 CONFLICT→单位身份管理员；未可回源 SOURCE_UNAVAILABLE→认证/人事；代理资格争议 NEEDS_HUMAN_DECISION→单位负责人"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F004",
        "F009",
        "F010",
        "F011"
      ],
      "materialSlotIds": [
        "M003",
        "M008"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R004 P1 课程身份及归口；真=有课程身份可核（A/C/D/E/F/G/H 或 B 已入库）；假=B 真实全新课程尚无正式码；未知=课程同名归属不明。SRC-001；F004,F009–F011 / M003,M008；课程库主键+开课学院+学段一致；B 可用暂存主键，不可凭同名课冒用代码；查版本快照；对位一致 PASS_FACT；跨单位/主键冲突 CONFLICT→教课程库管理人；库不可达 SOURCE_UNAVAILABLE→教；新课暂存不报缺件"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F012",
        "F013",
        "F014"
      ],
      "materialSlotIds": [
        "M004"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R005 P1 培养方案真实版本；真=A/C 或 B 同时修改培养方案；假=B 纯课程备案、D/F 仅班次停开；未知=是否影响培养方案。SRC-001 第 6–8 条；F012–F014 / M004；课程→专业、年级、培养方案 ID/生效版本与基准课程表对应，不能用最新方案覆盖旧届；一致 PASS_FACT；方案版矛盾 CONFLICT→培养单位/教；权威库不可取 SOURCE_UNAVAILABLE→教；是否影响旧届需人审"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F005",
        "F014",
        "F015",
        "F021",
        "F035"
      ],
      "materialSlotIds": [
        "M005",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R006 P0/P1 增删改提案差异；真=A/C；假=仅某学期 D 停班；未知=变更是课程永久身份还是班次。SRC-001 第 7、8 条；F014,F015,F035 / M005,M021；原方案→拟方案的条目、课程性质、开课学期与受影响届别 diff；影响说明可并入申请，不得自创必须独立报告；差异存在且可归属 PASS_FACT；拟变更缺必要申请内容 NEEDS_MATERIAL→培养单位；学生保障方案的足够性 NEEDS_HUMAN_DECISION→院/教"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F002",
        "F008",
        "F009",
        "F010",
        "F041"
      ],
      "materialSlotIds": [
        "M008"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R007 P0 本科新课申请原件；真=B；假=仅 A/C（无新开课动作）或 D/F；未知=是否“首次开课”。SRC-001 第 18 条；F002,F009,F010,F041 / M008；存在课程负责人“新开课程申请表”或校方认可的等价线上申请，申请课程/学期/修订号对应；正式表样字段未取得；申请存在且范围一致 PASS_FACT；未提交 NEEDS_MATERIAL→课程负责人；特定未验证栏目 POLICY_UNCONFIRMED→教表单管理者"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-007",
        "SRC-008"
      ],
      "fieldIds": [
        "F016",
        "F017",
        "F018",
        "F019"
      ],
      "materialSlotIds": [
        "M006",
        "M007",
        "M016",
        "M030",
        "M031"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R008 P0–P2 大纲与课程目标对应；真=B；A 新增课/E/I 要求大纲则条件真；假=D/F 仅人数事件；未知=当期大纲是否另需。SRC-001 第 10、18 条，SRC-003,007,008；F016–F019 / M006,M007,M016,M030,M031；大纲是否包含已证实所需目标、内容、学时/评价要素，课程 ID/归属/版本一致；支撑论证可定位同文页，教材意识形态实体评价由学院承担；E/I 仅在适用有效通知时核格式；结构事实 PASS_FACT；本阶段规定大纲缺 NEEDS_MATERIAL→课程负责人；已交坏页 UNREADABLE→上传方；学术充分性 NEEDS_HUMAN_DECISION→院"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F019",
        "F020",
        "F021"
      ],
      "materialSlotIds": [
        "M009"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R009 P2 基层论证、学院审核记录；真=B 到达基层/学院审查，G 到达学院重新论证；假=无需此链 D；未知=学院组织动作未明确。SRC-001 第 17、18、21 条；F019–F021 / M009；基层与学院两个职责可同一记录但需分别识别主体、时间、所审大纲版，教材/意识形态论证不可 OCR 自作价值判断；两类记录真实 PASS_FACT，审议质量 NEEDS_HUMAN_DECISION→院；P0 WAIT_NOT_DUE；应形成而未可查 SOURCE_UNAVAILABLE→学院文书管理员"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F010",
        "F022"
      ],
      "materialSlotIds": [
        "M010"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R010 P3 学术分委员会审议；真=A/B/C/G 且已送委员会；假=D/F/E 仅独立批次审核；未知=是否已启动委员会。SRC-001 第 7、18、21 条；F022 / M010；正式决议的委员会、课程/方案/大纲版、日期、审核结果与授权核对；普通教师签字不替代委员会；可核记录 PASS_FACT（若否决则如实显示否决事实，不自动批准）；权源冲突 CONFLICT→院；真实性不明 NEEDS_HUMAN_DECISION→委员会秘书；P0–P2 WAIT_NOT_DUE"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F011",
        "F023"
      ],
      "materialSlotIds": [
        "M011"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R011 P3 专家论证报告；真=A/C/G 已到送专家环节；假=B 只循第 18 条无独立专家报告要求；未知=分支类型不明。SRC-001 第 7、21 条；F023 / M011；报告有对象、专家/单位、时间、所论证方案版；意见是否充分、异常专家资质由院核；已成可核 PASS_FACT；P0/P1 WAIT_NOT_DUE；应提交送审批仍缺 NEEDS_MATERIAL→培养单位/学院；内容裁量 NEEDS_HUMAN_DECISION→院/教"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F011",
        "F012",
        "F014",
        "F024"
      ],
      "materialSlotIds": [
        "M012"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R012 P2 跨学院受课意见；真=B 等跨学院开课；假=开课与受课学院相同；未知=课程归属或受课对象未明。SRC-001 第 11、17 条；F011,F014,F024 / M012；核受课学院正式意见及课程版；可纳入联合纪要，但必须能定位受课学院签发主体；不从普通课程名称推断跨院；真实意见 PASS_FACT；已到会商而未给 NEEDS_MATERIAL→开课学院；跨院事实不明 SOURCE_UNAVAILABLE→课程归口部门"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-001",
        "SRC-004"
      ],
      "fieldIds": [
        "F013",
        "F025"
      ],
      "materialSlotIds": [
        "M013"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R013 P1 外部教师任课资格结论引用；真=有学校明定的教师资格前提或 G 涉教师能力提升；假=本次无个人资格事项；未知=前提规则/外部结论状态不明。SRC-001 第 17、19、21 条，SRC-004；F025 / M013；仅校方或 T06-T04/T02-T15 的正式结论，核同一工号、课程范围、适用期、签发者；不重审学历/资质，不拿项目获批代任课资格；可信结果可核 PASS_FACT（仅引用其原状态）；外部系统未联 SOURCE_UNAVAILABLE→T06-T04/人事 owner；资格争议 NEEDS_HUMAN_DECISION→原资格 owner"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-001",
        "SRC-004"
      ],
      "fieldIds": [
        "F005",
        "F014",
        "F026",
        "F027"
      ],
      "materialSlotIds": [
        "M014"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R014 P1/P3 教学班/教学任务时点；真=D/F/H 已有实际班次；B/E 进入排课时条件真；假=B 尚处创建课程阶段无班号；未知=开课/正选阶段不明。SRC-001 第 23、24 条，SRC-004；F005,F026,F027 / M014；教学班主键、学期、实际行课/正选/排课状态及快照一致；“停一节课”与“停整个班”分开；班次一致 PASS_FACT；错班号 CONFLICT→教；系统不能取 SOURCE_UNAVAILABLE→教运行科；未排班号不报缺件"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-002",
        "SRC-003"
      ],
      "fieldIds": [
        "F010",
        "F015",
        "F016",
        "F017",
        "F028",
        "F029",
        "F044"
      ],
      "materialSlotIds": [
        "M007",
        "M015",
        "M016",
        "M029"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R015 P0 本科公选线上申报及 PDF；真=E 且有效目标批次确实受理此类课程；假=非 E；未知=新批次规则失联。SRC-002,003；F010,F017,F028,F044 / M015,M016,M029；申报系统批次、类别 A/B/C、大纲 PDF 和教师/课程对位；2026/27-1 历史截至日不可套下一批；同一大纲复用 M007；当前有效批次事实可核 PASS_FACT；应申报未交 NEEDS_MATERIAL→教师；政策失效 POLICY_UNCONFIRMED→教；PDF 坏页 UNREADABLE→教师"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-002",
        "SRC-003"
      ],
      "fieldIds": [
        "F006",
        "F007",
        "F017",
        "F024",
        "F029"
      ],
      "materialSlotIds": [
        "M017",
        "M024"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R016 P2 公选初审汇总与校区条件签署；真=E 到学院初审/汇总，适用批次且宜宾才核附加双签；假=非 E/非宜宾不核双签；未知=校区/批次未知。SRC-002,003；F006,F007,F029 / M017,M024；系主任与教学院长初审、学院汇总对应同一申报版；校区双签只在该批次规则真实生效时要求；可接受校方确认电子流转；权限及签核记录可核 PASS_FACT；P0 WAIT_NOT_DUE；需签尚缺 NEEDS_MATERIAL→学院初审岗位；批次不明 POLICY_UNCONFIRMED→教"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-001",
        "SRC-005"
      ],
      "fieldIds": [
        "F018",
        "F026",
        "F028",
        "F029",
        "F030",
        "F031",
        "F044"
      ],
      "materialSlotIds": [
        "M018",
        "M029"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R017 P3 正选人数快照及停班触发；真=D 且正选结束；假=非 D 或正选未结束（后者内部 WAIT_NOT_DUE）；未知=班号/类别/截止事件不明。SRC-001 第 23 条、SRC-005 第 13 条；F026,F028,F030,F031,F044 / M018,M029；仅比对正选结束人数、时间、课程类别和官方班号；15/20 等号文本冲突且 SRC-005 效力不明，整套停班阈值需教务确认后才可执行数值判别；人数快照真实性 PASS_FACT；停班条件 POLICY_UNCONFIRMED→教规则负责人；源失联 SOURCE_UNAVAILABLE→教选课部门；不代作停班决定"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "fieldIds": [
        "F019",
        "F026",
        "F029",
        "F032",
        "F033",
        "F044"
      ],
      "materialSlotIds": [
        "M019",
        "M029"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R018 P3 已开课到课事实；真=F 且适用批次约定的观察课次已到；假=非 F，课次未到 WAIT_NOT_DUE；未知=当期通知或课次口径不明。SRC-002,003，并核 SRC-001 第 24 条；F026,F032,F033,F044 / M019,M029；按课次、时点及教学班核实际到课，而非选课数；历史通知的“开课后 3 次后不足 20”不能用于新批次或专业课；正式行课后原则不停止需教务解释例外；考勤事实 PASS_FACT；是否停班 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→教；坏考勤 UNREADABLE→持有人"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F020",
        "F034"
      ],
      "materialSlotIds": [
        "M020"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R019 P1 课程评价触发真实性；真=G 且真实评价异常；假=无课程质量触发；未知=原评价来源不可核。SRC-001 第 21 条；F034 / M020；校方评价事件 ID、课程/教学班/评价周期及通知范围，仅取脱敏摘要；教师个人改进转 R013/T06；触发可核 PASS_FACT；权威源失联 SOURCE_UNAVAILABLE→评价主管单位；课程质量争议 NEEDS_HUMAN_DECISION→学院，不披露评价人"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "fieldIds": [
        "F005",
        "F014",
        "F021",
        "F026",
        "F035",
        "F040"
      ],
      "materialSlotIds": [
        "M005",
        "M021",
        "M026"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R020 P1–P5 学生受影响与安排；真=C/D/F/H 已影响学生或有保障安排义务；A 新增可条件真；假=确无既有学生影响且有依据；未知=旧届/在选学生是否受影响。SRC-001 第 7、23、24 条，SRC-006；F014,F035,F040 / M005,M021,M026；核受影响专业/年级/教学班及聚合人数，拟替代/补选与实际通知分开，学生逐人成绩/课程替代转 S02，未知人数不能标 0；影响范围事实 PASS_FACT；替代方案权利裁量 NEEDS_HUMAN_DECISION→院/教/S02 owner；学生系统不可取 SOURCE_UNAVAILABLE→教"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F012",
        "F013",
        "F036",
        "F037",
        "F038",
        "F039"
      ],
      "materialSlotIds": [
        "M022"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R021 P4 培养方案/再开课校级审批引用；真=A/C/G 实际已到审批动作；假=B 纯新课备案/E 批次审核；未知=是否只收到学院意见。SRC-001 第 7、21 条；F012,F013,F036–F039 / M022；比对教务处审批决定 ID、结果（可同意/不同意/退回）、签发机关及方案/课程版/生效期；不得把学院决议当教务批准；仅文书元事实 PASS_FACT→记录决定原状态；P0–P3 WAIT_NOT_DUE；授权可疑 NEEDS_HUMAN_DECISION→教；权威记录失联 SOURCE_UNAVAILABLE→教"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F009",
        "F036",
        "F037",
        "F038",
        "F039"
      ],
      "materialSlotIds": [
        "M022",
        "M023"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R022 P4 新课备案完成引用；真=B 实际完成校级备案（即使叠 A 仍单独核）；假=无 B；未知=备案状态未能确认。SRC-001 第 18 条；F009,F036–F039 / M023；校方备案回执与学院同意版大纲、课程、开课学期对应；区分备案完成、已提交待备案和审批，不能拿 M022 替代；回执事实 PASS_FACT（不能表示审批同意）；未到 P4 WAIT_NOT_DUE；待办 NEEDS_HUMAN_DECISION→教备案岗位，源失联 SOURCE_UNAVAILABLE→教"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-006"
      ],
      "fieldIds": [
        "F026",
        "F036",
        "F037",
        "F038",
        "F039"
      ],
      "materialSlotIds": [
        "M025"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R023 P4 公选批次审核/停班操作引用；真=E 已有批次审核、D/F 已产生正式停班动作，H 被有权机关确实纳入例外决定；假=纯 A/B/C/G；未知=H 是否存在此种授权。SRC-001,002,003,006；F026,F036–F039 / M025；校方动作 batch_review/class_stop 与班号、申报批次、签发/操作时点和角色对照；班次变更不能反写为“删培养方案”；已形成可核动作 PASS_FACT，未形成不等于同意；源失联 SOURCE_UNAVAILABLE→教；H 无权源 POLICY_UNCONFIRMED→教"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-005",
        "SRC-006"
      ],
      "fieldIds": [
        "F026",
        "F035",
        "F040"
      ],
      "materialSlotIds": [
        "M026"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R024 P5 正式告知和实施引用；真=C/D/F/H 已到要求通知的阶段，或其他情形有真实告知义务；假=尚未决定，内部 WAIT_NOT_DUE；未知=是否发生有效通知。SRC-005,006；F035,F040 / M026；学校通知与班次/方案、决定号、受影响群体与时间对位，实际补退选不在本 ID 代写；“草拟通知”不等于已发；已告知事实 PASS_FACT；通知权/处置 NEEDS_HUMAN_DECISION→教/院；记录源失联 SOURCE_UNAVAILABLE→教；不代修改学生记录"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-010"
      ],
      "fieldIds": [
        "F004",
        "F017",
        "F018",
        "F025",
        "F029",
        "F030",
        "F031",
        "F044"
      ],
      "materialSlotIds": [
        "M029",
        "M030",
        "M031"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R025 P0–P2 研究生类型/历史表单识别；真=I1/I2/I3；假=本科 A–H；未知=研究生课程类型不明。SRC-007,008,009,010（010 只警示版本）；F004,F017,F018,F025,F044 / M030,M031,M029；区分普通、公选、国际化；旧 2018 暂行与 2021 校发制度存在潜在交替，须获 2021 全文及现行批准链；历史原件仅核“所提交材料所述事实”，不能据其强制现行表单、课时数、专家来访/报销材料；历史表单关联可核 PASS_FACT；所有现行办理门槛 POLICY_UNCONFIRMED→研；原页不可取 SOURCE_UNAVAILABLE→研"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-007",
        "SRC-008",
        "SRC-009"
      ],
      "fieldIds": [
        "F032",
        "F036",
        "F037",
        "F038",
        "F039",
        "F043"
      ],
      "materialSlotIds": [
        "M022",
        "M032"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R026 P4 研究生院正式结论引用；真=I1/I2/I3 且已有相关有效决定；假=本科；未知=现行签发机关或批次授权不明。SRC-007–009；F036–F039,F043 / M032；仅校方可回源的研究生院或经证实授权机关决定，核课程/学期/版本/动作与签发时点；2021/2018 线索不证实 2026 审批权限；已签发事实 PASS_FACT；授权不明 POLICY_UNCONFIRMED→研；已到但未决 NEEDS_HUMAN_DECISION→研，不以本科 M022 冒充"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009"
      ],
      "fieldIds": [
        "F001",
        "F017",
        "F022",
        "F027",
        "F041",
        "F042"
      ],
      "materialSlotIds": [
        "M027"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R027 P1/P6 材料谱系与定向重审；真=所有案首次固化或任一 M 被替换；假=无版本变化的重复查看（可复用缓存）；未知=旧源哈希/引用断链。SRC-001–009 依原业务；F001,F017,F022,F041,F042 / M027（及被替换的任意 M）；比较源 ID/哈希、签发人、适用对象、所依课程/方案/大纲版，生成 old→new 映射；按 11.3 依赖图仅使相关 R 旧事实结论失效，不撤销有权学校决定；谱系完整 PASS_FACT；无法对版 CONFLICT→案+原签发院/教；断链 SOURCE_UNAVAILABLE→案；需重新院审 NEEDS_HUMAN_DECISION→院"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009"
      ],
      "fieldIds": [
        "F006",
        "F007",
        "F008",
        "F041",
        "F042",
        "F043"
      ],
      "materialSlotIds": [
        "M002",
        "M027",
        "M028"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R028 P6 撤回/重提/复核请求事实；真=J 有真实申请或利害关系请求；假=无请求；未知=代理权/受理程序/期限不清。以原情形 SRC-001–009 为线索，无统一有效复核 SRC；F006–F008,F041–F043 / M028,M027,M002；请求人身份、原案/旧决定、请求类型/版本、真实受理/答复分别核；撤回请求不等于撤回生效，复核请求不自动撤销原批件，重提使用新修订；请求事实 PASS_FACT；资格/期限 POLICY_UNCONFIRMED→教/研；是否受理、撤回生效、复核结果 NEEDS_HUMAN_DECISION→原有权机关；不写自动同意"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R029",
      "sourceIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F005",
        "F009",
        "F010",
        "F011",
        "F028",
        "F044",
        "F045",
        "F046"
      ],
      "materialSlotIds": [
        "M015",
        "M016",
        "M024",
        "M029",
        "M033"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R029 P1/P2 2026 秋本科公选准入附加事实；真=E 且目标学期 2026/27-1、官方通知 SRC-002 适用；假=非 E 或已证明不属该学期；未知=新一批次是否延续规定。SRC-002“一”“二”5–7、“三”；F005,F009–F011,F028,F044–F046 / M015,M016,M024,M029,M033；对官方课程主键核是否属于2021/2025 版培养方案列明的通识选修课；从学校申报/汇总核教师本批申报门次、学时、容量、拟开班数；该批次 1 门次、原则不超 32 学时、120 人、课程原则 1 班是单批次限制/原则，不可迁移或机械拒绝例外；排除清单需权威课程映射；可定位的课程版、申报数值事实 PASS_FACT；课程库失联 SOURCE_UNAVAILABLE→教；新批次延续未知 POLICY_UNCONFIRMED→教；超原则/确属排除类 NEEDS_HUMAN_DECISION、同名异码 CONFLICT→归属学院+教务审核岗位，不由模型自动“不予开课”"
    }
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "SRC-001；CURRENTITY-UNKNOWN；成都理工大学：《关于印发〈成都理工大学本科课程教学基本规范〉的通知》，成理校教〔2022〕11号；校内原始文件汇编 PDF (https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf)；PDF 阅读器第 19–30 页（PDF 页索引 P18–P29），第 6–8、10–11、15、17–24、43 条；2022-06-04 发布并印发日起实施；第 43 条废止成理校教〔2018〕10号",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-002",
      "title": "SRC-002；CURRENTITY-UNKNOWN（原页回源受限）；成都理工大学教务处：《关于2026-2027学年第一学期公共选修课申报的通知》；教务处原文地址 (https://aao.cdut.edu.cn/info/1171/7023.htm)；“一、课程类型”“二、具体要求”1–8、“三、申报要求”1–2；网页日期 2026-04-28，落款 04-29；仅 2026/27-1，5 月 17 日 18:00 截止",
      "url": "https://aao.cdut.edu.cn/info/1171/7023.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-003",
      "title": "SRC-003；CDUT-VERIFIED（仅历史批次）；成都理工大学教务处：《关于2025-2026学年第二学期公共选修课申报的通知》；原文 (https://aao.cdut.edu.cn/info/1171/6867.htm)；“二、具体要求”1–8，“三、申报要求”1–2；2025-11-10 发布，2025-11-19 批次截止",
      "url": "https://aao.cdut.edu.cn/info/1171/6867.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-004",
      "title": "SRC-004；CDUT-VERIFIED；成都理工大学教务处：《关于做好2025-2026学年第二学期教学任务安排及课表编排的工作通知》，教通字〔2025〕45号；PDF (https://aao.cdut.edu.cn/__local/6/D0/6E/D73FB595B334A89DCC3AB9C55E8_B2D0E7C3_27504.pdf)；PDF 第 1–2 页，“一、教学任务实施原则”“二、课表编排原则”；2025-10-29 发布；适用 2025/26-2",
      "url": "https://aao.cdut.edu.cn/__local/6/D0/6E/D73FB595B334A89DCC3AB9C55E8_B2D0E7C3_27504.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-005",
      "title": "SRC-005；CURRENTITY-UNKNOWN；成都理工大学：《成都理工大学学生选课管理办法》；校内 PDF (https://www.aao.cdut.edu.cn/__local/0/FD/0F/3135F978A388AEEF10442AC1944_5B5A90BC_39C55.pdf?e=.pdf)；PDF 第 1–4 页，第 3、12–13、16–18 条及第 4 页学生补退选申请表；PDF 无可见文号/发布日期；印发日起实施",
      "url": "https://www.aao.cdut.edu.cn/__local/0/FD/0F/3135F978A388AEEF10442AC1944_5B5A90BC_39C55.pdf?e=.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-006",
      "title": "SRC-006；CDUT-VERIFIED；成都理工大学教务处：《关于2024-2025学年第一学期选课的通知》，教通字〔2024〕32号；PDF (https://aao.cdut.edu.cn/__local/E/BE/F1/EC76DBD3B507867475376F2102F_4146917D_24873.pdf)；PDF 第 1–2 页，“二、注意事项”第 5–8 项；2024-07-02；仅 2024/25-1 学期",
      "url": "https://aao.cdut.edu.cn/__local/E/BE/F1/EC76DBD3B507867475376F2102F_4146917D_24873.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-007",
      "title": "SRC-007；CDUT-VERIFIED（仅历史批次）；中共成都理工大学委员会研究生工作部、成都理工大学研究生院：《关于申报2021-2022学年春季学期研究生公共选修课的通知》；PDF (https://gra.cdut.edu.cn/__local/1/CA/91/7C1A10B30713251FB6EE9F0B27D_00D997B4_2C6ED.pdf)；PDF 第 1–2 页，“二、课程管理”“三、申报程序”；2021-12-23；仅 2021/22 春季",
      "url": "https://gra.cdut.edu.cn/__local/1/CA/91/7C1A10B30713251FB6EE9F0B27D_00D997B4_2C6ED.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-008",
      "title": "SRC-008；CURRENTITY-UNKNOWN；成都理工大学研究生院：《国际化课程开课及费用报销办理流程》；原文地址 (https://gra.cdut.edu.cn/info/1023/3727.htm)；正文“一、提交申请”“二、安排开课”；2024-03-19 发布；修订/终止未明",
      "url": "https://gra.cdut.edu.cn/info/1023/3727.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-009",
      "title": "SRC-009；CURRENTITY-UNKNOWN；成都理工大学（核技术与自动化工程学院转载）：《成都理工大学研究生课程建设及课程管理办法（暂行）》；原文地址 (https://cnae.cdut.edu.cn/info/1040/1425.htm)；搜索索引涉及第 7 条等；2018-01 实施（索引），原页直开不可审全文",
      "url": "https://cnae.cdut.edu.cn/info/1040/1425.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-010",
      "title": "SRC-010；CURRENTITY-UNKNOWN；成都理工大学：《成都理工大学来华留学生教育管理办法》成理校发〔2022〕26号，学校官方 PDF (https://dbxb.cdut.edu.cn/__local/6/F5/86/E91EEDCF144F4BC5CA934E95F28_8F010406_8B8F6.pdf)；正文研究生课程考核条引用《成都理工大学研究生课程教学管理办法》（成理校研〔2021〕11号）；2022 年成文；2021 制度正文未获得",
      "url": "https://dbxb.cdut.edu.cn/__local/6/F5/86/E91EEDCF144F4BC5CA934E95F28_8F010406_8B8F6.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-011",
      "title": "SRC-011；CURRENTITY-UNKNOWN（仅项目事项线索）；成都理工大学研究生院：《关于开展2026年研究生校企合作课程建设项目申报工作的通知》；官方页面 (https://gra.cdut.edu.cn/info/1011/5925.htm)；2026-07-03，课程建设项目申报材料、汇总、培养科接收和项目目标要求；限 2026 项目",
      "url": "https://gra.cdut.edu.cn/info/1011/5925.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = T01T03_TEMPLATE
