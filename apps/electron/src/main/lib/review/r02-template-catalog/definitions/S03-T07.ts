/**
 * R02 S03-T07 本地研究模板定义。
 * 来源：docs/design/review-agent/business-templates/R02/S03-T07.md
 * SHA-256：fba9761918ecba7b3666e7037575caf0be5eb8ddc0f4a89c201d14b42620322f
 * 非校方正式模板；未确认政策只可形成建议并进入人工复核。
 */
import type { TemplateVersion } from '@profer/shared'

export const template: TemplateVersion = {
  "templateId": "S03-T07",
  "version": 1,
  "schemaVersion": 2,
  "name": "国家助学金和基于困难身份的助学资助审核",
  "description": "国家助学金和基于困难身份的助学资助审核。本地研究模板 · 非校方正式模板。仅用于事实核验、证据对应和人工复核；不代行学校签批，不自动产生正式批准或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非成都理工大学校方正式模板；原件 S03-T07 的字段、材料槽、规则及阶段转换为 V3 TemplateVersion；政策证据状态 PARTIAL，未确认条件只生成审阅建议/待确认事项，最终决定须由本地 reviewer/teacher 人工处理。",
  "objectType": "person",
  "displayName": {
    "template": "国家助学金和基于困难身份的助学资助审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "studentName:string 姓名 · StudentSubject / L1—L7 · 学籍实名档案权威；学生填写仅声明",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F001；studentName:string 姓名 · StudentSubject / L1—L7 · 学籍实名档案权威；学生填写仅声明 · M002/M003；SRC-001 第 5 条 · P2 · 对照失败 CONFLICT；权威失联 S?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F002",
      "label": "studentNo:string 学号 · StudentSubject / L1—L7 · 学籍系统；禁止凭照片提取视为权威",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F002；studentNo:string 学号 · StudentSubject / L1—L7 · 学籍系统；禁止凭照片提取视为权威 · M002/M003；SRC-001 · P2 · 学号不明 S?；与申报不一致 CONFLICT。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F003",
      "label": "studentRecordRef:ref 权威学生键/机构 · StudentSubject / L1—L7 · 学籍主管部门签发及版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F003；studentRecordRef:ref 权威学生键/机构 · StudentSubject / L1—L7 · 学籍主管部门签发及版本 · M002；SRC-001 第 5、9 条 · P2 · S?，不得用前端自报 actor 代替。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F004",
      "label": "nationality:enum 国籍 · StudentSubject / L1/L3 · 学籍或身份权威记录；个人声称非终局",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F004；nationality:enum 国籍 · StudentSubject / L1/L3 · 学籍或身份权威记录；个人声称非终局 · M002，必要时 M003；SRC-001 第 2、5 条 · P2 · 研究生条件待核 S?/H?；本科学段以本期政策确认。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F005",
      "label": "academicStage:enum 本专科/硕士/博士等 · StudentSubject / L1/L7 · 学籍培养阶段记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F005；academicStage:enum 本专科/硕士/博士等 · StudentSubject / L1/L7 · 学籍培养阶段记录 · M002/M014；SRC-001 第 8 条 · P2 · S?；硕博矛盾 CONFLICT。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F006",
      "label": "collegeUnit:ref 学院/校区/培养单位 · StudentSubject / L1—L5 · 学籍组织关系；当前学院可信同步",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F006；collegeUnit:ref 学院/校区/培养单位 · StudentSubject / L1—L5 · 学籍组织关系；当前学院可信同步 · M002；SRC-002—003 · P1 · S?，不得凭文件抬头跨学院套用细则。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F007",
      "label": "fullTime:boolean? 是否全日制 · StudentSubject / L1/L3 · 权威学籍培养方式",
      "kind": "boolean",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F007；fullTime:boolean? 是否全日制 · StudentSubject / L1/L3 · 权威学籍培养方式 · M002；SRC-001 第 2、5 条 · P2 · 未知 S?，不能把未读到当否。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F008",
      "label": "enrollmentStatus:enum 在籍/注册/保留/休退毕 · StudentSubject / L1/L7 · 学籍主管部门正式状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F008；enrollmentStatus:enum 在籍/注册/保留/休退毕 · StudentSubject / L1/L7 · 学籍主管部门正式状态 · M002/M013；SRC-001 第 5、9 条 · P2 · S?；事件冲突 CONFLICT。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F009",
      "label": "basicStudyEnd:date? 基本修业年限终点 · StudentSubject / L1/L7 · 研究生学籍/培养计划权威；本科不泛化",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F009；basicStudyEnd:date? 基本修业年限终点 · StudentSubject / L1/L7 · 研究生学籍/培养计划权威；本科不泛化 · M002；SRC-001 第 5、9 条 · P2 · 研究生 S?；本科 NA。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F010",
      "label": "admissionAndTraining:object 招生计划/培养方式 · StudentSubject / L1 · 研究生招生/学籍主管部门",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F010；admissionAndTraining:object 招生计划/培养方式 · StudentSubject / L1 · 研究生招生/学籍主管部门 · M002；SRC-001 第 2、5 条、SRC-017—018 第 6 条 · P2 · 研究生 S?；学院额外条件需 H?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F011",
      "label": "degreeStageEffectiveAt:date? 硕博身份生效日 · StudentSubject / L1/L7 · 学籍注册系统，课程阶段权威",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F011；degreeStageEffectiveAt:date? 硕博身份生效日 · StudentSubject / L1/L7 · 学籍注册系统，课程阶段权威 · M014；SRC-001 第 8 条 · P2 · 非硕博转换 NA；未知 S?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F012",
      "label": "statusEventType:enum? 休复学/退学/毕业等 · StudentSubject / L7 · 学籍决定签发主体",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F012；statusEventType:enum? 休复学/退学/毕业等 · StudentSubject / L7 · 学籍决定签发主体 · M013；SRC-001 第 9 条 · P2 · 无事件 NA；有矛盾 CONFLICT。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F013",
      "label": "statusEventCompletedAt:date? 学籍手续办结日 · StudentSubject / L7 · 学籍办理完结记录，不是学生报称申请日",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F013；statusEventCompletedAt:date? 学籍手续办结日 · StudentSubject / L7 · 学籍办理完结记录，不是学生报称申请日 · M013；SRC-001 第 9 条 · P2 · 事件成立但缺办结日 S?/H?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F014",
      "label": "veteranStatus:enum? 退役士兵身份 · StudentSubject / L1 · 有权退役身份/资助核验机构；禁止 OCR 自动授予",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F014；veteranStatus:enum? 退役士兵身份 · StudentSubject / L1 · 有权退役身份/资助核验机构；禁止 OCR 自动授予 · M007；SRC-005 一（三）、SRC-019 · P3 · 普通学生 NA；该支路缺证明 S?/H?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F015",
      "label": "veteranRecordVersion:ref? 身份核验版本 · StudentSubject / L1/L7 · 原签发机构/权威核验记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F015；veteranRecordVersion:ref? 身份核验版本 · StudentSubject / L1/L7 · 原签发机构/权威核验记录 · M007；SRC-005、019 · P3 · 退役支路 S?，过期或冲突人工核定。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F016",
      "label": "aidProject:enum 本次资助项目 · AidBatch / L0/L2 · 当前校方政策/项目管理员",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F016；aidProject:enum 本次资助项目 · AidBatch / L0/L2 · 当前校方政策/项目管理员 · M001/M030；SRC-007、014 · P1 · 未发布项目 P?；独立目的移交目录。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F017",
      "label": "aidYearTerm:string 参评学年/学期 · AidBatch / L0—L7 · 校方批次通知（非上传人随意填写）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F017；aidYearTerm:string 参评学年/学期 · AidBatch / L0—L7 · 校方批次通知（非上传人随意填写） · M001；SRC-002—003、009—011 · P1 · P?，禁止跨年度借条件。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F018",
      "label": "batchRef:ref 真实批次/校院归属 · AidBatch / L0—L7 · 校方当期批次编号/公告",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F018；batchRef:ref 真实批次/校院归属 · AidBatch / L0—L7 · 校方当期批次编号/公告 · M001；SRC-009—011 · P1 · P?，不能自造批次 ID 充当权威。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F019",
      "label": "policySnapshot:ref 当前政策版本/有效期 · AidBatch / L0—L7 · 学校/学院有权发布的正式原文",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F019；policySnapshot:ref 当前政策版本/有效期 · AidBatch / L0—L7 · 学校/学院有权发布的正式原文 · M001/M030；SRC-001、005、007—011 · P0 · 2026 本科缺原文 P?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F020",
      "label": "applicationDeadline:datetime? 截止时间 · AidBatch / L0/L2 · 现行校院公告",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F020；applicationDeadline:datetime? 截止时间 · AidBatch / L0/L2 · 现行校院公告 · M001；SRC-009—011 仅历史 · P0 · P?；不自动宣布逾期。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F021",
      "label": "quotaTierSnapshot:object? 名额与档次版本 · AidBatch / L0/L3—L5 · 资助管理中心正式批次分配/学校配置",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F021；quotaTierSnapshot:object? 名额与档次版本 · AidBatch / L0/L3—L5 · 资助管理中心正式批次分配/学校配置 · M001/M019；SRC-004 仅历史、SRC-005 上位范围 · P1 · P?，不从家庭困难等级推定金额。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F022",
      "label": "hardshipRecognitionRef:ref? 困难认定 ID · PriorRecognition / L1 · 家庭经济困难认定有权机构",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F022；hardshipRecognitionRef:ref? 困难认定 ID · PriorRecognition / L1 · 家庭经济困难认定有权机构 · M004；SRC-008、013 · P3 · 研究生普通国助 NA；本科缺先转前置认定。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F023",
      "label": "hardshipGrade:enum? 正式困难档次 · PriorRecognition / L1/L3 · 认定部门最新生效结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F023；hardshipGrade:enum? 正式困难档次 · PriorRecognition / L1/L3 · 认定部门最新生效结论 · M004；SRC-008、019 · P3 · 无权威记录 S?；不能凭申请自评分档。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F024",
      "label": "hardshipValidYear:string? 认定适用年度 · PriorRecognition / L1/L7 · 认定部门带版本的结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F024；hardshipValidYear:string? 认定适用年度 · PriorRecognition / L1/L7 · 认定部门带版本的结果 · M004/M027；SRC-008、013 · P3 · 不覆盖本期 P?/H?，不自动续期。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F025",
      "label": "hardshipState:enum? 待认定/有效/撤销/调整 · PriorRecognition / L1/L7 · 认定程序最终状态，非预审意见",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F025；hardshipState:enum? 待认定/有效/撤销/调整 · PriorRecognition / L1/L7 · 认定程序最终状态，非预审意见 · M004/M027；SRC-008 · P3 · 前置事项未完 H?，不认定为资助未通过。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F026",
      "label": "noFixedWageRef:ref? 无固定工资认定 ID · PriorRecognition / L1 · 培养单位初审、学校当期制度要求的最终认定组织",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F026；noFixedWageRef:ref? 无固定工资认定 ID · PriorRecognition / L1 · 培养单位初审、学校当期制度要求的最终认定组织 · M008；SRC-001 第 6 条、SRC-012、017—018 · P3 · 本科 NA；研究生 S?/先办理认定。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F027",
      "label": "noFixedWageStatus:enum? 最终认定结果 · PriorRecognition / L1/L7 · 对应学年有权校级/培养单位正式认定记录（层级待本期核）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F027；noFixedWageStatus:enum? 最终认定结果 · PriorRecognition / L1/L7 · 对应学年有权校级/培养单位正式认定记录（层级待本期核） · M008；SRC-001 第 6、9 条、SRC-012、017—018 · P3 · 未正式认定 H?；学生承诺/学院拟公示不等于已认定。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F028",
      "label": "noFixedWageValidPeriod:object? 有效期间/版本 · PriorRecognition / L1/L7 · 认定部门年度及动态记录",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F028；noFixedWageValidPeriod:object? 有效期间/版本 · PriorRecognition / L1/L7 · 认定部门年度及动态记录 · M008；SRC-017 第 7—10 条、SRC-018 第 7、10 条 · P3 · 期间不明 S?，不默认跨年有效。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F029",
      "label": "employmentChange:enum? 开始/解除劳动关系等 · PriorRecognition / L7 · 学生报告线索＋培养单位核实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F029；employmentChange:enum? 开始/解除劳动关系等 · PriorRecognition / L7 · 学生报告线索＋培养单位核实 · M012/M010；SRC-001 第 9 条 · P3 · 无变更 NA；仅报告未核 H?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F030",
      "label": "wageChangeEffectiveMonth:month? 实际领薪起止月 · PriorRecognition / L7 · 由培养单位核实的工资事实与权威支撑",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F030；wageChangeEffectiveMonth:month? 实际领薪起止月 · PriorRecognition / L7 · 由培养单位核实的工资事实与权威支撑 · M012/M010；SRC-001 第 9 条 · P3 · 有事件但时点未知 H?，不得自行停复发。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F031",
      "label": "applicationRef:ref? 本次申报记录 · AidApplication / L2—L5 · 学生正式申报系统/学院受理记录；退役支路可无",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F031；applicationRef:ref? 本次申报记录 · AidApplication / L2—L5 · 学生正式申报系统/学院受理记录；退役支路可无 · M006/M011；SRC-003、010、019 · P2 · 普通申报缺 M?；退役例外 NA/P?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F032",
      "label": "submittedAt:datetime? 正式提交时间 · AidApplication / L2 · 受理系统生成时间戳，非图片文件时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F032；submittedAt:datetime? 正式提交时间 · AidApplication / L2 · 受理系统生成时间戳，非图片文件时间 · M006/M011；SRC-010 · P2 · 已提交无法读取 S?；未开放支路 P?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F033",
      "label": "applicantAttestation:object? 本人陈述与承诺 · AidApplication / L2 · 本人签署/正式申请；只属声明证据",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F033；applicantAttestation:object? 本人陈述与承诺 · AidApplication / L2 · 本人签署/正式申请；只属声明证据 · M006/M009/M011；SRC-017 第 8 条、SRC-018 第 9 条 · P3 · 该支路需提交时 M?；与权威冲突 CONFLICT。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F034",
      "label": "collegeReview:ref? 学院评议意见/时间 · ReviewAndDecision / L3 · 有权学院评审组签署，学生和模型只读",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F034；collegeReview:ref? 学院评议意见/时间 · ReviewAndDecision / L3 · 有权学院评审组签署，学生和模型只读 · M015；SRC-002—003、009—011 · P2 · L2 LATER；L3 后缺 H?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F035",
      "label": "collegeRecommendation:ref? 推荐名单/版本 · ReviewAndDecision / L4 · 学院有权审核及报送",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F035；collegeRecommendation:ref? 推荐名单/版本 · ReviewAndDecision / L4 · 学院有权审核及报送 · M016；SRC-002、011 · P2 · L2—L3 LATER，不等于校批准。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F036",
      "label": "noticeWindow:object? 公示起止与范围 · ReviewAndDecision / L4 · 学院/学校正式公示记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F036；noticeWindow:object? 公示起止与范围 · ReviewAndDecision / L4 · 学院/学校正式公示记录 · M017；SRC-002—003、011、017—018 · P1 · L2—L3 LATER，期限冲突 P?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F037",
      "label": "objectionHandling:ref? 异议/答复状态 · ReviewAndDecision / L4—L5 · 公示受理单位可信记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F037；objectionHandling:ref? 异议/答复状态 · ReviewAndDecision / L4—L5 · 公示受理单位可信记录 · M018；SRC-003、017—018 · P3 · 无异议 NA；有异议未答 H?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F038",
      "label": "schoolDecision:ref? 正式校级决定/结论 · ReviewAndDecision / L5 · 校方有权审批主体，Main 可信鉴权",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F038；schoolDecision:ref? 正式校级决定/结论 · ReviewAndDecision / L5 · 校方有权审批主体，Main 可信鉴权 · M019；SRC-002—003、007 待核 · P2 · L0—L4 LATER；L5 缺 H?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F039",
      "label": "provinceFiling:ref? 省级备案 · ReviewAndDecision / L5—L6 · 备案主管系统，不能用提交截图代替成功备案",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F039；provinceFiling:ref? 省级备案 · ReviewAndDecision / L5—L6 · 备案主管系统，不能用提交截图代替成功备案 · M020；SRC-001 第 7 条 · P2 · L0—L4 LATER；要求存在与否按项目政策。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F040",
      "label": "paymentPeriod:object? 本次应发期间/月 · Disbursement / L6—L7 · 资助中心按校决定及异动周期编制",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F040；paymentPeriod:object? 本次应发期间/月 · Disbursement / L6—L7 · 资助中心按校决定及异动周期编制 · M019/M021；SRC-001 第 6、9 条 · P2 · L0—L5 LATER；跨月冲突人工核。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F041",
      "label": "paymentProcessing:enum? 支付指令/平台校验 · Disbursement / L6 · 财务/一卡通系统回执",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F041；paymentProcessing:enum? 支付指令/平台校验 · Disbursement / L6 · 财务/一卡通系统回执 · M021/M022；SRC-001 第 7 条、SRC-004 · P3 · LATER；执行中不得当到账。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F042",
      "label": "bankCredited:enum? 银行到账/失败 · Disbursement / L6 · 银行/财务对账回执",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F042；bankCredited:enum? 银行到账/失败 · Disbursement / L6 · 银行/财务对账回执 · M023；SRC-004 第三部分 · P3 · LATER；平台成功但回执缺 S?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F043",
      "label": "paymentMismatch:object? 失败原因/修复版本 · Disbursement / L6—L7 · 财务失败记录与修正反馈",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F043；paymentMismatch:object? 失败原因/修复版本 · Disbursement / L6—L7 · 财务失败记录与修正反馈 · M024；SRC-004 第三部分 · P3 · 无差错 NA；未知 S?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F044",
      "label": "evidenceProvenance:object 来源签发者、版本、校验时间 · EvidenceLineage / 全阶段 · 原记录出处+可信验证服务；不得由 Renderer 自报",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F044；evidenceProvenance:object 来源签发者、版本、校验时间 · EvidenceLineage / 全阶段 · 原记录出处+可信验证服务；不得由 Renderer 自报 · M001—M031；SRC-001、006、020—022 · P2/P3 · 缺溯源 S?/CONFLICT。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F045",
      "label": "subjectBinding:enum 材料姓名/学号/申请所属匹配 · EvidenceLineage / L1—L7 · 系统交叉核验；高风险冲突由人工",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F045；subjectBinding:enum 材料姓名/学号/申请所属匹配 · EvidenceLineage / L1—L7 · 系统交叉核验；高风险冲突由人工 · M002/M003/M006/M029；SRC-001 · P2 · 信息不一致 CONFLICT，无法读取 UNREADABLE。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F046",
      "label": "supersessionChain:object? 新旧材料/结论失效链 · EvidenceLineage / L2—L7 · Case/Run 受控版本管理，非用户删除旧证据",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F046；supersessionChain:object? 新旧材料/结论失效链 · EvidenceLineage / L2—L7 · Case/Run 受控版本管理，非用户删除旧证据 · M029；技术边界 SRC-006 · P2/P3 · 未换版 NA；来源版本缺 S?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F047",
      "label": "withdrawRequest:ref? 撤回请求而非撤回生效决定 · ProceduralRequest / L2—L7 · 申请人请求＋有权受理机构回执",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F047；withdrawRequest:ref? 撤回请求而非撤回生效决定 · ProceduralRequest / L2—L7 · 申请人请求＋有权受理机构回执 · M025；撤回校本依据待核 · P2 · 无请求 NA；有请求无决定 H?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F048",
      "label": "reconsiderationRequest:ref? 异议/复核申请 · ProceduralRequest / L4—L7 · 申请人本人请求＋有权受理记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F048；reconsiderationRequest:ref? 异议/复核申请 · ProceduralRequest / L4—L7 · 申请人本人请求＋有权受理记录 · M018/M026；SRC-002—003、017—018 · P3 · 无请求 NA；有请求无答复 H?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F049",
      "label": "officialConductReview:object? 政策要求的思想品德、校纪诚信及正式处分/学术不端记录的有权核查状态 · StudentSubject / L1—L5 · 学校有权学生管理/纪检或学术调查结论；价值判断保留人工，不由 OCR/模型推定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F049；officialConductReview:object? 政策要求的思想品德、校纪诚信及正式处分/学术不端记录的有权核查状态 · StudentSubject / L1—L5 · 学校有权学生管理/纪检或学术调查结论；价值判断保留人工，不由 OCR/模型推定 · M031；SRC-001 第 5 条，本科依据 SRC-007 未取 · P3 · 无可授权核查渠道 S?/H?；不得把缺记录当“无违规”，不得模型推断政治态度。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F050",
      "label": "approvedAidTierAmount:object? 经有权学校决定的受助档次/金额 · ReviewAndDecision / L5—L7 · 校方正式决定及当期政策原文，绝非困难等级映射",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F050；approvedAidTierAmount:object? 经有权学校决定的受助档次/金额 · ReviewAndDecision / L5—L7 · 校方正式决定及当期政策原文，绝非困难等级映射 · M019/M001；SRC-001 第 4、6 条、SRC-005，SRC-007 待核 · P2 · L0—L4 LATER；校本档次未知 P?，拟推荐不得填“已批准金额”。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F051",
      "label": "payeeSocialCardBinding:enum? 收款人、本人社保卡账户的一致性核验结果 · Disbursement / L6 · 资助中心、财务及权威一卡通/银行渠道的脱敏匹配状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F051；payeeSocialCardBinding:enum? 收款人、本人社保卡账户的一致性核验结果 · Disbursement / L6 · 资助中心、财务及权威一卡通/银行渠道的脱敏匹配状态 · M021/M022/M023；SRC-001 第 7 条、SRC-004 · P3 · L0—L5 LATER；不一致 CONFLICT，平台失联 S?。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "当期项目、资格、名额/档次、截止日；学校资助中心/学院 AR 公告及附件",
      "purpose": "原研究材料槽 M001：当期项目、资格、名额/档次、截止日；学校资助中心/学院 AR 公告及附件；当前必需 L0；学校正式审批的配置快照可替代纸公告，但须保留原文、有效期；无 2026 通知不得套 2025；F016—F021；SRC-005、007、009—011、019；学年+学院+公告号/版本，校本优先于旧学院示例；上位约束同时保留；无有效原文 POLICY_UNCONFIRMED；网页打不开 SOURCE_UNAVAILABLE；附件模糊 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "当期项目、资格、名额/档次、截止日；学校资助中心/学院 AR 公告及附件",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "学生实名、学号、学段、在籍、全日制、基本年限；学籍主管部门 AR/REF",
      "purpose": "原研究材料槽 M002：学生实名、学号、学段、在籍、全日制、基本年限；学籍主管部门 AR/REF；当前必需 L1；授权学籍系统记录优先，不能无理由强制重传学籍证明；F001—F013；SRC-001 第 2、5、8、9 条；当前学籍版本+有效日+学校签发方，映射 F003；无接口 SOURCE_UNAVAILABLE 并请求人工核验；姓名冲突 CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "学生实名、学号、学段、在籍、全日制、基本年限；学籍主管部门 AR/REF",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "身份姓名/号码疑义的佐证；学生持有身份证明或校方身份更正决定 FILE/AR",
      "purpose": "原研究材料槽 M003：身份姓名/号码疑义的佐证；学生持有身份证明或校方身份更正决定 FILE/AR；条件必需，仅 M002 与申请不一致/权威身份缺失时；校方已生效身份更正记录为优先替代；F001—F004、F045；SRC-001、006（边界）；遮蔽无关身份证号，核姓名、学号、签发与有效期；不将扫描件自动升权；申请人无法取得说明原因转人工；图像模糊 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "身份姓名/号码疑义的佐证；学生持有身份证明或校方身份更正决定 FILE/AR",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "有效家庭经济困难认定及档次；学校有权认定机构 AR/REF",
      "purpose": "原研究材料槽 M004：有效家庭经济困难认定及档次；学校有权认定机构 AR/REF；当前必需 A01/A03 的 L1；有权认定系统记录替代学生上传；A04 仅当该档次相关政策确实要求，研究生普通国助 NA；F022—F025；SRC-008、013、019；对人、学年、结论状态、批准版次；不能用曾经申请表替代认定结果；未办理移交认定流程 NEEDS_HUMAN_DECISION；源失联 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "有效家庭经济困难认定及档次；学校有权认定机构 AR/REF",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "困难认定申报/动态调整申请及家庭事实支撑；学生向困难认定业务提交 FORM/FILE",
      "purpose": "原研究材料槽 M005：困难认定申报/动态调整申请及家庭事实支撑；学生向困难认定业务提交 FORM/FILE；条件必需于前置认定业务，不作为已获得国家助学金的凭据；2026 申请表真实字段仍待取得；F022—F025（仅前置申请状态）；SRC-008、013；归属认定申请而非助学金批次，历史家庭支撑需时间效力；S03-T07 不追加乡镇盖章等旧义务；申请不完整交认定部门",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "困难认定申报/动态调整申请及家庭事实支撑；学生向困难认定业务提交 FORM/FILE",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "普通本专科国家助学金本批次正式申请；学生/省资助系统 FORM/EVT",
      "purpose": "原研究材料槽 M006：普通本专科国家助学金本批次正式申请；学生/省资助系统 FORM/EVT；当前必需 A01 的 L2（以当期文件核定）；系统有效受理记录或导出表可用；退役士兵可能豁免，不能全员强制；F016—F020、F031—F033；SRC-009—011、019；本人+学年+学校/学院+批次+正式受理时间，电子回执比截图可信；未提交 NEEDS_MATERIAL 仅在确认必须申报后；系统失联 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "普通本专科国家助学金本批次正式申请；学生/省资助系统 FORM/EVT",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "正式退役士兵身份及在校覆盖情况；有关权威部门/学生资助中心 AR/REF",
      "purpose": "原研究材料槽 M007：正式退役士兵身份及在校覆盖情况；有关权威部门/学生资助中心 AR/REF；条件必需 A04；已核实退役身份的正式学校台账可替代证件重复上传，非正式照片不能授权；F014—F015；SRC-005、019；身份证明版本+学籍对应人+本期有效范围，军人其他信息最小可见；SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；身份冲突需部门核验",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "正式退役士兵身份及在校覆盖情况；有关权威部门/学生资助中心 AR/REF",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "研究生无固定工资收入已完成的有权认定结果；培养单位初审、按当期校级流程核准的研究生工作部门/学校 AR/REF",
      "purpose": "原研究材料槽 M008：研究生无固定工资收入已完成的有权认定结果；培养单位初审、按当期校级流程核准的研究生工作部门/学校 AR/REF；当前必需 A05/A07/A09/A13 的 L1；带最终状态的权威名册/记录优先，学院拟推荐或承诺不可代替；不要求重传已在可信校方记录里的申请；F026—F028；SRC-001 第 6 条、SRC-012、017—018；本人+学年/调整期+学院+最终签发机构/状态/版本+生效日；校级核准细节需现行原文；正式认定未完 NEEDS_HUMAN_DECISION，可信结果源失联 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "研究生无固定工资收入已完成的有权认定结果；培养单位初审、按当期校级流程核准的研究生工作部门/学校 AR/REF",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "无固定工资收入认定申请或承诺；研究生本人在前置事项填写 FORM",
      "purpose": "原研究材料槽 M009：无固定工资收入认定申请或承诺；研究生本人在前置事项填写 FORM；条件必需 A06 的前置认定；材料化工学院用《认定申请表》，核工程学院可用承诺书，按所在学院当期表单选择；F026—F028、F033；SRC-017 第 8、13 条、SRC-018 第 9、15 条；本人签名/学院表版/学年；申请承诺不是认定批准；无材料按该学院程序补正；不能拒绝合法说明书替代",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "无固定工资收入认定申请或承诺；研究生本人在前置事项填写 FORM",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "研究生就业/劳动关系/社保公积金等专项支撑；学生或相应机构 FILE/AR",
      "purpose": "原研究材料槽 M010：研究生就业/劳动关系/社保公积金等专项支撑；学生或相应机构 FILE/AR；条件必需，只在前置认定部门具体要求或 F029 变化时；已有权威证明优先，不要求所有研究生统一上传所有证明；F010、F027、F029—F030；SRC-017 第 6、13 条、SRC-018 第 8—9 条；对人、就业时段、签发方；各学院材料选择不同，不能互换为一条全校硬规；无法开具时按 SRC-017/018 的学院说明+承诺支路，待人工核",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "研究生就业/劳动关系/社保公积金等专项支撑；学生或相应机构 FILE/AR",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "研究生国家助学金批次申请或纳入名单确认；学生/学院 FORM/EVT",
      "purpose": "原研究材料槽 M011：研究生国家助学金批次申请或纳入名单确认；学生/学院 FORM/EVT；条件必需 A05/A07 的 L2；是否独立本人申请由当期学校/学院要求决定，不假设所有周期有同一表；F031—F033；SRC-002—003、017—018；本人+批次+学院，申报与前置无工资认定材料不同；未见当期正式申报要求则 POLICY_UNCONFIRMED，不自行补造审批表",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "研究生国家助学金批次申请或纳入名单确认；学生/学院 FORM/EVT",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "固定工资开始、终止或解除劳动关系的事实/申请；学生、用人单位、培养单位 FILE/EVT",
      "purpose": "原研究材料槽 M012：固定工资开始、终止或解除劳动关系的事实/申请；学生、用人单位、培养单位 FILE/EVT；条件必需 A08/A09；学生陈述及就业文件是线索，培养单位正式审核后才改变发放状态；F029—F030；SRC-001 第 9 条；事件发生月、实际领取工资月及相应证明版本分开；工资起止不明 NEEDS_HUMAN_DECISION；证据冲突 CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "固定工资开始、终止或解除劳动关系的事实/申请；学生、用人单位、培养单位 FILE/EVT",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "休复学、保留学籍、退学、毕业等已办结决定；学籍部门 AR/REF",
      "purpose": "原研究材料槽 M013：休复学、保留学籍、退学、毕业等已办结决定；学籍部门 AR/REF；条件必需 A10/A11；A03 的 L7 若发生本科正式学籍异动亦需引用；有权学籍系统办结记录替代学生纸证明。研究生月度计算只按 SRC-001，本科仍核本期规则；F008、F012—F013；SRC-001 第 9 条（研究生）、SRC-023（2026 春工作报告线索）；手续办理完结日为关键，不用申请日/口述日推算；未办结是待发生，不是已发生；原件失联 SOURCE_UNAVAILABLE；本科停发月份 POLICY_UNCONFIRMED",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "休复学、保留学籍、退学、毕业等已办结决定；学籍部门 AR/REF",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "硕博连读注册博士、直博课程阶段正式记载；研究生院/学籍部门 AR/REF",
      "purpose": "原研究材料槽 M014：硕博连读注册博士、直博课程阶段正式记载；研究生院/学籍部门 AR/REF；条件必需 A12；可用可信学籍注册/培养阶段记录，学生口述导师同意不可替代；F005、F011；SRC-001 第 8 条；注册/课程层次生效日、阶段、学籍版次；阶段矛盾 CONFLICT；未知转研究生管理部门",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "硕博连读注册博士、直博课程阶段正式记载；研究生院/学籍部门 AR/REF",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "班级/学院评议审核意见及签到记录；有权评议/审核组 AR/EVT",
      "purpose": "原研究材料槽 M015：班级/学院评议审核意见及签到记录；有权评议/审核组 AR/EVT；后续才产生 L3；学院电子审签可代纸件，但须验真实角色、权限和记录；F034、F044；SRC-002—003、009—011、017—018；学院/专业/批次、签发者、表单及会议记录版本；困难认定评议不可冒作资助评审；L2 无须交；L3 未形成交办理组，学生不可代签",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "班级/学院评议审核意见及签到记录；有权评议/审核组 AR/EVT",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "拟推荐学生名册与学院正式上报记录；学院 AR/EVT",
      "purpose": "原研究材料槽 M016：拟推荐学生名册与学院正式上报记录；学院 AR/EVT；后续才产生 L4；有权上报系统记录可替代拍照名单；F035、F045；SRC-002、011；本批次+学院+名册版本+公示前后修订链；L2 不缺；名单与申请冲突 CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "拟推荐学生名册与学院正式上报记录；学院 AR/EVT",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "学院/学校公示及公示期、隐私处理证据；公示单位 AR/EVT",
      "purpose": "原研究材料槽 M017：学院/学校公示及公示期、隐私处理证据；公示单位 AR/EVT；后续才产生 L4；官网公示/受理记录具有出处才可引用；F036；SRC-002—003、011、017—018；发布机关、时间窗、范围、撤回/更正记录；不复制含困难细节的公开名单；未到公示阶段 LATER；链接失效 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "学院/学校公示及公示期、隐私处理证据；公示单位 AR/EVT",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "公示期异议与回复/复议流转；学生、学院及校级受理者 FORM/EVT",
      "purpose": "原研究材料槽 M018：公示期异议与回复/复议流转；学生、学院及校级受理者 FORM/EVT；条件必需仅发生异议，初次申报绝非必交；需区分困难/无工资认定异议与助学金评审异议；F037、F048；SRC-002—003、009—011、017—018；申诉对象、层级、递交/受理/答复时间、原结论版本；尚无异议 NA；已申诉未处理 NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "公示期异议与回复/复议流转；学生、学院及校级受理者 FORM/EVT",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "学校有权机构的正式审查决定、停复发批准；学校审批主体 AR/EVT",
      "purpose": "原研究材料槽 M019：学校有权机构的正式审查决定、停复发批准；学校审批主体 AR/EVT；后续才产生 L5 或 L7 人工变更；仅可信后台有权主体签发；F021、F038、F040；SRC-001 第 7、9 条、SRC-002—003；决定号、签发者、角色权限、批次、所依据的完整材料版次；申请初始不缺；尚待审批 NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "学校有权机构的正式审查决定、停复发批准；学校审批主体 AR/EVT",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "省教育部门/审批平台备案完成回执；备案系统 AR/EVT",
      "purpose": "原研究材料槽 M020：省教育部门/审批平台备案完成回执；备案系统 AR/EVT；后续才产生 L5—L6；研究生 SRC-001 第 7 条要求备案后发放；其他项目是否必需依当期政策；F039；SRC-001 第 7 条；备案批次、接受回执、时间和名单版本；截图不等成功备案；未到阶段 LATER，失联 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "省教育部门/审批平台备案完成回执；备案系统 AR/EVT",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "资助中心/财务发放清单与指令；学校财务 AR/EVT",
      "purpose": "原研究材料槽 M021：资助中心/财务发放清单与指令；学校财务 AR/EVT；后续才产生 L6；按正式决定和月份生成；F040—F041；SRC-001 第 6—7、9 条、SRC-004；收款主体匹配、批准版本、实际应发月份，不暴露卡号全文；无批准时不能下发；财务未执行 LATER",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "资助中心/财务发放清单与指令；学校财务 AR/EVT",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "社会保障卡“一卡通”平台校验回执；平台/财务 EVT",
      "purpose": "原研究材料槽 M022：社会保障卡“一卡通”平台校验回执；平台/财务 EVT；后续才产生 L6；仅证明平台校验/流程状态，不证明银行已到账；F041；SRC-001 第 7 条、SRC-004；回执批次、校验时间、状态与原指令一一对应；未回执 SOURCE_UNAVAILABLE；失效卡提示纠正",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "社会保障卡“一卡通”平台校验回执；平台/财务 EVT",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "银行实际到账/退回记录；银行/财务对账 EVT",
      "purpose": "原研究材料槽 M023：银行实际到账/退回记录；银行/财务对账 EVT；后续才产生 L6；须区分执行中、成功、失败/退回；F042；SRC-004 第三部分；收款人的脱敏账户键、月份、银行流水/回执版本；不可用“平台成功”替代；未知 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "银行实际到账/退回记录；银行/财务对账 EVT",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "发放失败、社保卡更正及重发处理；学生更正后财务核验 EVT/FILE",
      "purpose": "原研究材料槽 M024：发放失败、社保卡更正及重发处理；学生更正后财务核验 EVT/FILE；条件必需 L6仅确有失败；更正姓名卡状态不能篡改已批准的身份结论；F043；SRC-004 第三部分；原失败批次+错误码+更正记录+重发回执链；银行错误不重做资格决定；不可读 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "发放失败、社保卡更正及重发处理；学生更正后财务核验 EVT/FILE",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "学生撤回申请/声明及受理回执；申请人/受理单位 FORM/EVT",
      "purpose": "原研究材料槽 M025：学生撤回申请/声明及受理回执；申请人/受理单位 FORM/EVT；条件必需 A15仅提出撤回；校本撤回许可与生效环节未知，不能以“提交请求”替代“准予撤回”；F047；校本 SRC 尚缺；请求目标决定/申请版次、主体、时间、受理者；无正式回执 NEEDS_HUMAN_DECISION，不自行销案",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "学生撤回申请/声明及受理回执；申请人/受理单位 FORM/EVT",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "学生对助学金结论的复核/异议申请；学生/受理学校部门 FORM/EVT",
      "purpose": "原研究材料槽 M026：学生对助学金结论的复核/异议申请；学生/受理学校部门 FORM/EVT；条件必需 A15，按公示/正式结论的合法渠道；认定事项复议应回归原认定机构；F037、F048；SRC-002—003、009—011；指明原结论 ID、公示阶段、申诉时间、签名、受理记录；无异议 NA；无法定位原决定 CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "学生对助学金结论的复核/异议申请；学生/受理学校部门 FORM/EVT",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "新学年困难身份更新/动态认定正式结果；认定机构 AR/REF",
      "purpose": "原研究材料槽 M027：新学年困难身份更新/动态认定正式结果；认定机构 AR/REF；条件必需 A03/A13；有效原认定且本年规则允许沿用时不强迫额外上传；F022—F025；SRC-008、013；新版指向上版，覆盖起止年份，原版保留；有变更但尚无结论 NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "新学年困难身份更新/动态认定正式结果；认定机构 AR/REF",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "同学年已有其他奖助/互斥项目的正式结果；各对应有权部门 AR/REF",
      "purpose": "原研究材料槽 M028：同学年已有其他奖助/互斥项目的正式结果；各对应有权部门 AR/REF；条件必需仅当现行批次明确有并领、择一或排斥规则；不因同校其他申请存在就自动冲突；F016—F021、F038；SRC-005、007、010；项目类型、批准日期、学年、有效状态，不混用拟推荐记录；缺规则 POLICY_UNCONFIRMED；源失联 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "同学年已有其他奖助/互斥项目的正式结果；各对应有权部门 AR/REF",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "源材料版本、替换、哈希、关联 Run 与失效链；审查系统 EVT",
      "purpose": "原研究材料槽 M029：源材料版本、替换、哈希、关联 Run 与失效链；审查系统 EVT；条件必需于补件/替换/复用和重审；不是学生对外提交的行政材料；F044—F046；SRC-006（仅技术边界）；精确到 materialId@version、主体、批次、源版与受影响检查项，旧文件可追溯；无法确定哪个版本 CONFLICT；旧结论不得再作为当前证据",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "源材料版本、替换、哈希、关联 Run 与失效链；审查系统 EVT",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M030",
      "name": "困难身份衍生专项项目的独立授权政策/审批目的；项目归口有权机构 AR",
      "purpose": "原研究材料槽 M030：困难身份衍生专项项目的独立授权政策/审批目的；项目归口有权机构 AR；条件必需 A16；当前未得到可确认与国家助学金共用决定目的的校本原文，故 A16 保持待定；F016—F021、F038；SRC-014 仅线索；项目主管单位+授权范围+决策主体+学年；必须与国助批次区分；无正式政策 POLICY_UNCONFIRMED；独立目的需 CATALOG-CHANGE-REQUEST",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "困难身份衍生专项项目的独立授权政策/审批目的；项目归口有权机构 AR",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M031",
      "name": "政策限定的学校正式校纪/学术诚信等资格事实核查结论；学校有权学生管理、学术诚信管理机构 AR/REF",
      "purpose": "原研究材料槽 M031：政策限定的学校正式校纪/学术诚信等资格事实核查结论；学校有权学生管理、学术诚信管理机构 AR/REF；条件必需，仅在国助本期规则确有相关要件且获合法核验权时调用；只需已完成的有权决定/校方状态证明，不要求学生提交涉隐私纪律卷宗；纯思想政治品德评价留学校人工；F049；SRC-001 第 5 条，SRC-007 本科待原文；匹配学生、校纪/学术事件的正式状态、生效期与签发机构；同名不直接匹配；源失联 SOURCE_UNAVAILABLE，规则不清 POLICY_UNCONFIRMED，无法自动评价 NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredElements": [
        "政策限定的学校正式校纪/学术诚信等资格事实核查结论；学校有权学生管理、学术诚信管理机构 AR/REF",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "evidence-review",
      "name": "研究级事实核验与政策待确认",
      "description": "对应原件第 08 节逐条规则；SRC 为研究来源索引，不是案卷材料 SourceRef。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "现行项目/批次政策存在",
          "requirement": "【研究级核验标准；非校方正式规则】R001 R001 L0：现行项目/批次政策存在 | 真＝选择了 S03-T07 国助批次；假＝其他独立目的；未知＝项目编码/学年不明 | F016—F021；M001；SRC-001、005、007、009—011、019。逐条对发布者、适用人群、学年、版本、发布日期/有效期、截止日期，不从 2025 继承 2026 参数 | 真且可信版本齐→PASS_FACT；跨项目→NOT_APPLICABLE 并路由；2026 原文未取→POLICY_UNCONFIRMED 交资助中心；文件链接/官网不可访问→SOURCE_UNAVAILABLE；版本相互矛盾→CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "唯一学生身份及材料主体匹配",
          "requirement": "【研究级核验标准；非校方正式规则】R002 R002 L1/L2：唯一学生身份及材料主体匹配 | 真＝已有学生或正式申请；假＝非学生/别的事项；未知＝同名不同号 | F001—F003、F045；M002、M003、M006/M011；SRC-001 第 5 条、SRC-020。权威学籍学生键与申请人、学号、学院、有效更名版本一致，不凭 OCR 模糊匹配 | 全部匹配→PASS_FACT；不同权威主体→CONFLICT，学籍部门核；图像糊→UNREADABLE，学生补清晰版；学籍源断→SOURCE_UNAVAILABLE；前端 actor 无效，Main/Host 鉴权",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R003",
          "title": "学段/学院归属路由",
          "requirement": "【研究级核验标准；非校方正式规则】R003 R003 L1：学段/学院归属路由 | 真＝本专科/研究生之一；假＝不属于本事项人群；未知＝学段转换中 | F005—F006、F011；M002/M014；SRC-001 第 8 条、SRC-020。取正式学籍有效日与学院，学院细则不得用于外院 | 可信分支→PASS_FACT；跨学段错套→CONFLICT；学籍未生效或转换中→NEEDS_HUMAN_DECISION，学籍/研究生院；完全无源→SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "研究生国籍要件",
          "requirement": "【研究级核验标准；非校方正式规则】R004 R004 L1：研究生国籍要件 | 真＝研究生国家助学金；假＝本科转对应本期政策；未知＝学段/国籍来源不明 | F004—F005；M002/M003；SRC-001 第 2、5 条；校方身份档案优于学生声明，核申报期间 | 满足且权威→PASS_FACT；不满足/证明矛盾→NEEDS_HUMAN_DECISION/CONFLICT 交研究生院；本科无已核硬规→POLICY_UNCONFIRMED 而非偷用研究生条款",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "研究生全日制/招生计划与培养方式",
          "requirement": "【研究级核验标准；非校方正式规则】R005 R005 L1：研究生全日制/招生计划与培养方式 | 真＝研究生申请本项目；假＝本科；未知＝培养身份不明 | F007、F010；M002、条件 M010；SRC-001 第 2、5 条。核全国招生计划、全日制与当前培养性质，不将学院历史“非定向/调档”条件升为 2026 全校硬门槛 | 一致→PASS_FACT；非全日制或正式计划不符→NEEDS_HUMAN_DECISION 由研究生院作资格意见；权威断→SOURCE_UNAVAILABLE；旧学院条件→POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R006",
          "title": "有效学籍/在籍状态",
          "requirement": "【研究级核验标准；非校方正式规则】R006 R006 L1：有效学籍/在籍状态 | 真＝有本批次学籍资格核验；假＝事项本就不需要该学段记录；未知＝休/退/保留状态待办 | F008—F009；M002/M013；SRC-001 第 5、9 条、SRC-004。按正式状态及办结时间核所审月份 | 在籍符合对应政策→PASS_FACT；暂不在籍等状态交对应 L7 规则＋NEEDS_HUMAN_DECISION；来源断→SOURCE_UNAVAILABLE，学籍管理部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "正式校纪/诚信资格事实",
          "requirement": "【研究级核验标准；非校方正式规则】R007 R007 L1—L5：正式校纪/诚信资格事实 | 真＝当前政策含相关资格要件且学校授权核验；假＝本期明确无此核验；未知＝本科条款或权威访问权限不明 | F049；M031；SRC-001 第 5 条、SRC-007 待全文。仅对正式处分、学术不端已认定状态及期间比较；模型不评价政治态度、品格或未认定举报 | 正式确认无阻碍且权威→PASS_FACT（仅记录）；存在有权负面结论→NEEDS_HUMAN_DECISION 交评审主管；本科政策不明→POLICY_UNCONFIRMED，无权限→SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "本科困难身份正式生效",
          "requirement": "【研究级核验标准；非校方正式规则】R008 R008 L1：本科困难身份正式生效 | 真＝普通本科困难型申报 A01/A03；假＝研究生正常国助；未知＝退役特别情形 | F022—F025；M004、条件 M027；SRC-008、013、019。只消费 S03-T06 有权认定的 ID、状态、学年、版次；本人 M005 不是终局 | 有效且覆盖本期→PASS_FACT（仅前置）；待认定→NEEDS_HUMAN_DECISION 路由 S03-T06；源断→SOURCE_UNAVAILABLE；学校 2026 等级适用规则未知→POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "前置困难认定申请不冒用批准",
          "requirement": "【研究级核验标准；非校方正式规则】R009 R009 L1：前置困难认定申请不冒用批准 | 真＝仅持 M005 申请/家庭支撑；假＝已有 M004 正式记录；未知＝二者版本不清 | F022、F025；M004/M005；SRC-008、013、SRC-020。对正式“已认定”状态与纸件申请区分，人工审材料不得代签等级 | 只有申请→NEEDS_HUMAN_DECISION/交 S03-T06；已有结论→NOT_APPLICABLE（本误用规则）；无法验证签发者→SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "困难等级与助学金档次分离",
          "requirement": "【研究级核验标准；非校方正式规则】R010 R010 L3/L5：困难等级与助学金档次分离 | 真＝存在困难档次并拟定受助档次；假＝尚未进入定档或研究生普通支路；未知＝本期档次表不存在 | F021、F023、F038、F050；M001/M004/M019；SRC-005、007、014、019。只比较学校本期正式批准的档次和政策允许的范围；SRC-014 的 2025 年标准与 SRC-004 的 2024 月发放均为历史证据，不由困难等级或旧金额推定本期金额 | L5 正式同源一致→PASS_FACT（批准记录存在这一事实）；L3 不生成金额→NOT_APPLICABLE；当前档次依据缺→POLICY_UNCONFIRMED，资助中心/校审定主体",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "退役士兵有权身份",
          "requirement": "【研究级核验标准；非校方正式规则】R011 R011 L1：退役士兵有权身份 | 真＝声明退役士兵特别覆盖；假＝普通本科支路；未知＝证明无法与学生绑定 | F014—F015、F001—F003；M007/M002；SRC-005、019。核权威军人退役状态及全日制在校期间，不能凭照片/OCR 批准退役资格 | 身份真且覆盖期匹配→PASS_FACT；不符合→NEEDS_HUMAN_DECISION；主体冲突→CONFLICT；查证渠道失联→SOURCE_UNAVAILABLE，退役身份核验主体",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "退役士兵省系统申报例外",
          "requirement": "【研究级核验标准；非校方正式规则】R012 R012 L2：退役士兵省系统申报例外 | 真＝已证实退役且当前学校政策明确例外；假＝普通本科需个人申报；未知＝只有 2025 学院通知 | F014、F016—F020、F031；M001/M006/M007；SRC-005、010、019。2025 特例只能提示，不自动赋予 2026 免申报 | 当期证实豁免→PASS_FACT（无 M006 不是缺件）；普通按 R013；2026 未知→POLICY_UNCONFIRMED，资助中心",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R013",
          "title": "本科本批次本人申请被正式受理",
          "requirement": "【研究级核验标准；非校方正式规则】R013 R013 L2：本科本批次本人申请被正式受理 | 真＝普通本科政策要求本人申报；假＝本期正式豁免支路；未知＝无 2026 通知 | F031—F033、F017—F020；M006/M001；SRC-009—011、019（2025）。核校方/省系统真实提交回执、学号、批次、截止日；截图不等受理 | 正式受理→PASS_FACT；已证明确需提交但无材料→NEEDS_MATERIAL 学生补申；来源不可访问→SOURCE_UNAVAILABLE；截止日期政策未知→POLICY_UNCONFIRMED，不自行宣告逾期",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "研究生无固定工资收入最终认定",
          "requirement": "【研究级核验标准；非校方正式规则】R014 R014 L1：研究生无固定工资收入最终认定 | 真＝研究生国家助学金；假＝本科学段；未知＝培养单位仅有拟认定 | F026—F028、F006；M008、条件 M009；SRC-001 第 6、9 条、SRC-012、017—018。核学院、学年、最后认定机构与“正式有效”状态；班级评议/学院拟公示不等于校级最终认定 | 正式有效→PASS_FACT；缺前置结论→NEEDS_HUMAN_DECISION 交无工资认定；权威名册断→SOURCE_UNAVAILABLE；2026 确权层级未知→POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "研究生国助新增申请/名单确认",
          "requirement": "【研究级核验标准；非校方正式规则】R015 R015 L2：研究生国助新增申请/名单确认 | 真＝该学年正式要求申请或春季新增；假＝当期按已核名单直接延续且未要求申报；未知＝本期流程缺 | F031—F033；M011/M008/M001；SRC-002—003。查本人/学院受理记录与本批次，不能把 M009 无工资承诺当国助申报 | 正式受理/纳入名单证实→PASS_FACT；明确要求而无材料→NEEDS_MATERIAL；仅见 2025 公示而 2026 路径未知→POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "无工资认定的证明替代合法性",
          "requirement": "【研究级核验标准；非校方正式规则】R016 R016 L1：无工资认定的证明替代合法性 | 真＝申请新的前置无工资认定；假＝已有正式 M008；未知＝所在学院政策不明 | F026—F028、F033；M009/M010/M008；SRC-017 第 8、13 条、SRC-018 第 9、15 条。按申请时所在学院决定用承诺、证明或情况说明，绝不把全套社保证明普遍设成必需 | 学院当前接受的替代路径→PASS_FACT（只证提交材料合规，非认定成功）；外院无依据→POLICY_UNCONFIRMED，由该学院认定组决定",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "开始领固定工资停发的事实基础",
          "requirement": "【研究级核验标准；非校方正式规则】R017 R017 L7：开始领固定工资停发的事实基础 | 真＝研究生出现实际领取固定工资；假＝无此事件；未知＝只有社保/合同线索 | F029—F030、F040；M012/条件 M010、M008；SRC-001 第 9 条。以实际领薪当月及培养单位核验为先，不凭社保登记直接推薪资 | 事实核实→PASS_FACT（停发依据事实）；工资时点冲突→CONFLICT；未确认→NEEDS_HUMAN_DECISION 交培养单位/资助中心，下游决定/指令仍需 R029/R031",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "不领工资后恢复发放的前提",
          "requirement": "【研究级核验标准；非校方正式规则】R018 R018 L7：不领工资后恢复发放的前提 | 真＝研究生申请恢复且不再实际领固定工资；假＝无申请/没有变化；未知＝只有解约合同 | F027—F030、F038、F040；M012/M008、后续 M019；SRC-001 第 9 条。核本人申请、培养单位审核同意及停止领薪月份，分开解除合同日与薪资终止月 | 审核已有效→PASS_FACT（前提事实）；未获培养单位同意→NEEDS_HUMAN_DECISION，不得自动补发；月份冲突→CONFLICT",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "休学/保留学籍及复学停复发月份",
          "requirement": "【研究级核验标准；非校方正式规则】R019 R019 L7：休学/保留学籍及复学停复发月份 | 真＝研究生有正式办结的休复学/保留状态；假＝没有此学籍变动；未知＝仅交申请未办结 | F008、F012—F013、F040；M013/M002、后续 M019；SRC-001 第 9 条。按手续办结次月暂停，复学次月恢复，休学月段不补发 | 日期核准→PASS_FACT（仅时段建议）；未办结→NEEDS_HUMAN_DECISION；日期冲突→CONFLICT；资助中心决定并留旧月份记录",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R020",
          "title": "研究生退学/提前毕业停发",
          "requirement": "【研究级核验标准；非校方正式规则】R020 R020 L7：研究生退学/提前毕业停发 | 真＝研究生退学或提前毕业手续正式办结；假＝继续在籍；未知＝申请但未生效 | F008、F012—F013、F040；M013/M002；SRC-001 第 9 条。停发节点为办结次月；书面申请日期不能代替办结 | 事件+日期可信→PASS_FACT（停发事实）；仅申请→NEEDS_HUMAN_DECISION，学籍部门/资助中心；材料或系统冲突→CONFLICT",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R021",
          "title": "研究生基本修业年限上限",
          "requirement": "【研究级核验标准；非校方正式规则】R021 R021 L1/L7：研究生基本修业年限上限 | 真＝研究生进入拟发月份；假＝本科；未知＝修业终点不明 | F008—F010、F040；M002、条件 M013；SRC-001 第 5、9 条。比学籍的基本修业年限与当月，延期年限不自动加回受助月份 | 基本年限内→PASS_FACT；超基本年限→NEEDS_HUMAN_DECISION 由研究生院核最终资格/停发；终点数据失联→SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "直博/硕博连读对应发放身份",
          "requirement": "【研究级核验标准；非校方正式规则】R022 R022 L1/L7：直博/硕博连读对应发放身份 | 真＝培养层次已实际变化或有直博分阶段；假＝普通硕士/博士无转换；未知＝拟转博 | F005、F011、F050；M002/M014、后续 M019；SRC-001 第 8 条。直博及特殊本硕博看当年课程层次，硕博连读看正式注册博士日期，不凭导师意见 | 有学籍确认的阶段→PASS_FACT；拟转段尚未注册→NEEDS_HUMAN_DECISION；身份版本矛盾→CONFLICT；具体款项经学校决定",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "跨年续评或前置认定动态变更",
          "requirement": "【研究级核验标准；非校方正式规则】R023 R023 L0/L1：跨年续评或前置认定动态变更 | 真＝进入新学年/认定变化；假＝相同有效期间内事实未变；未知＝旧认定到期不详 | F017—F019、F022—F028、F044—F046；M001/M027/M004/M008；SRC-008、013、017—018、023。SRC-023 可支持 2026 春季开展动态调整工作，不能据此给所有学生自动刷新困难等级或规定本科停发具体月份；对新版正式有效学年与本次批次保留旧结论历史 | 续期已正式确认→PASS_FACT（前置有效）；无本期认定→NEEDS_HUMAN_DECISION 归前置认定；2026—2027 续评规则未知→POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "他类奖助的兼容/互斥",
          "requirement": "【研究级核验标准；非校方正式规则】R024 R024 L3：他类奖助的兼容/互斥 | 真＝本期政策明确需要校验并领奖助/排他；假＝无互斥条款；未知＝本期未获取 | F016—F021、F038；M028/M001；SRC-005、007、010。仅取相邻 S03-T02/T03/T04 等已有效决定并核同学年，不把申请中的“拟获奖”当正式获奖 | 规则可核且记录匹配→PASS_FACT；旧规则/并领关系未知→POLICY_UNCONFIRMED；源失联→SOURCE_UNAVAILABLE；由资助中心人工定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "学院有权评议/审查记录",
          "requirement": "【研究级核验标准；非校方正式规则】R025 R025 L3：学院有权评议/审查记录 | 真＝案卷已进入学院审核；假＝尚处 L1/L2；未知＝角色真身不明 | F034、F044；M015；SRC-002—003、009—011，SRC-017—018 仅前置认定评议。检查学院、批次、审核组签发与版本 | 真实有效→PASS_FACT（意见存在）；尚未到 L3→NOT_APPLICABLE；伪造角色/权限→CONFLICT，由学院核；已到 L3 未审→NEEDS_HUMAN_DECISION",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "学院拟推荐不等于学校批准",
          "requirement": "【研究级核验标准；非校方正式规则】R026 R026 L4：学院拟推荐不等于学校批准 | 真＝存在 M016 推荐版本；假＝尚未公示；未知＝名单失联 | F035、F045；M016/M015；SRC-002、011。核正式上报与同批次人员，不转写 F038 | 真实推荐→PASS_FACT（只证推荐）；未到 L4→NOT_APPLICABLE；版本冲突→CONFLICT；学校有权决定仍由 R029",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "公示及公示范围的事实记录",
          "requirement": "【研究级核验标准；非校方正式规则】R027 R027 L4：公示及公示范围的事实记录 | 真＝学院/学校已公示；假＝未进公示；未知＝官网打不开 | F036；M017；SRC-002—003、011、017—018。核有权发布、开始/结束时点、被更正版本，不把前置认定公示天数当国助公示硬值 | 已发布记录可信→PASS_FACT（不证明公示期合法完成）；公示要求/期限缺校本原文→POLICY_UNCONFIRMED，学院/校级主管；链接失联→SOURCE_UNAVAILABLE",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R028",
          "title": "异议、申诉、复核对象与处理状态",
          "requirement": "【研究级核验标准；非校方正式规则】R028 R028 L4/L7：异议、申诉、复核对象与处理状态 | 真＝对本助学金推荐/决定提出异议；假＝无人申诉；未知＝是否为对困难或工资认定的异议 | F037、F048、F038；M018/M026/M017；SRC-002—003、009—011、017—018。判清原 decisionId、所属事项及受理期限（当期可证时） | 本模板受理线索→NEEDS_HUMAN_DECISION，移交原有权评审/受理者；前置认定异议→NOT_APPLICABLE 路由 S03-T06/无工资认定；时限未知→POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R029",
          "title": "学校正式资助决定的效力核对",
          "requirement": "【研究级核验标准；非校方正式规则】R029 R029 L5：学校正式资助决定的效力核对 | 真＝已经到校级审定/查询既有决定；假＝只有申请/推荐；未知＝签发人或批次无法验真 | F038、F050；M019/M016、M001；SRC-001 第 6—7 条、SRC-002—003，SRC-007 待原文。比较批次、主体、决策机关、完整材料版本、正式有效状态；Main/Host 实名鉴权 | 有权既有决定记录可信→PASS_FACT（仅“存在有效学校决定”事实）；未形成→NEEDS_HUMAN_DECISION；伪签发→CONFLICT；2026 校级权限未知→POLICY_UNCONFIRMED。该 R 自身不批准",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "省级备案有效回执",
          "requirement": "【研究级核验标准；非校方正式规则】R030 R030 L5/L6：省级备案有效回执 | 真＝当前项目政策要求备案且已进入该阶段；假＝批次不要求/尚未进 L5；未知＝本科 2026 要求未核 | F039；M020/M019；SRC-001 第 7 条。只认正式省级完成回执，截图/发起请求不等于完成 | 有效回执→PASS_FACT；未到阶段→NOT_APPLICABLE；必须备案而尚未完成→NEEDS_HUMAN_DECISION/学校备案岗；源断→SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "按正式决定及异动核应发月份",
          "requirement": "【研究级核验标准；非校方正式规则】R031 R031 L6：按正式决定及异动核应发月份 | 真＝有 M019 正式决定且进入财务阶段；假＝尚无批准；未知＝月段冲突 | F040、F029—F030、F008—F013、F050；M019/M021/M012/M013；SRC-001 第 6、9 条、SRC-004。依据政策月段、正式异动时间核 候选应发区间；不跨年度套旧金额 | 事实可对齐→PASS_FACT（供财务复核）；有重叠冲突/欠核→CONFLICT/NEEDS_HUMAN_DECISION，资助中心与财务；无批准不得生成支付",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R032",
          "title": "社会保障卡收款主体绑定",
          "requirement": "【研究级核验标准；非校方正式规则】R032 R032 L6：社会保障卡收款主体绑定 | 真＝研究生/学校本期要求本人社保卡支付；假＝该项目明确不同途径；未知＝本科本期路径未知 | F051、F001—F003；M021/M022/M023；SRC-001 第 7 条、SRC-004。收款主体脱敏标识应对齐批准人员/学生键，不在日志储存完整卡号 | 匹配→PASS_FACT；不一致→CONFLICT，资助中心/财务核；平台断→SOURCE_UNAVAILABLE；本期通道未知→POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R033",
          "title": "发放指令与“一卡通”平台校验",
          "requirement": "【研究级核验标准；非校方正式规则】R033 R033 L6：发放指令与“一卡通”平台校验 | 真＝学校已发支付指令；假＝尚无支付阶段；未知＝回执失败/缺失 | F041；M021/M022；SRC-001 第 7 条、SRC-004。按指令批次与平台校验时间对应，不将流程成功写成银行到账 | 匹配→PASS_FACT（只证平台流转）；回执未返→SOURCE_UNAVAILABLE；校验失败→NEEDS_HUMAN_DECISION 交财务排错；不改 F042",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R034",
          "title": "银行实际到账或退回",
          "requirement": "【研究级核验标准；非校方正式规则】R034 R034 L6：银行实际到账或退回 | 真＝存在银行/财务对账回执；假＝付款尚未发起；未知＝只有平台成功 | F042；M023/M022；SRC-004。银行流水脱敏键与收款人、支付月份、最终状态对应 | 银行到账可信→PASS_FACT（仅到账事实）；明确退回→NEEDS_HUMAN_DECISION 交财务；仅平台成功/银行断→SOURCE_UNAVAILABLE，不得写“已到账”",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R035",
          "title": "发放差错更正/重发留痕",
          "requirement": "【研究级核验标准；非校方正式规则】R035 R035 L6：发放差错更正/重发留痕 | 真＝存在失败或退回后更正；假＝无支付异常；未知＝原失败原因不明 | F043、F051；M024/M023/M021；SRC-004。保存原指令、失败码、更正卡状态、重新发起和到账回执各自版本 | 链完整→PASS_FACT（更正流程事实）；回执缺→SOURCE_UNAVAILABLE；改卡导致姓名冲突→CONFLICT，资助中心/财务，不重判国助资格",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R036",
          "title": "撤回请求与撤回效力区分",
          "requirement": "【研究级核验标准；非校方正式规则】R036 R036 L2—L7：撤回请求与撤回效力区分 | 真＝本人提出撤回 M025；假＝无撤回请求；未知＝代办/既批准后撤回效力不明 | F047、F031/F038；M025/M019；撤回校本规则无核实 SRC，SRC-002—003 仅证公示异议存在。核本人、原申请版本、受理回执，不删除已批准状态 | 有请求→NEEDS_HUMAN_DECISION 交原受理/审批机关；撤回法定阶段未知→POLICY_UNCONFIRMED；无请求→NOT_APPLICABLE；已到账涉及追退，禁止自动撤销",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R037",
          "title": "证据来源、可读性与归属",
          "requirement": "【研究级核验标准；非校方正式规则】R037 R037 L0—L7：证据来源、可读性与归属 | 真＝任何 R 消费了 M；假＝该 M 对此 R 不适用；未知＝签发者或读数可信度不明 | F044—F045；所有 M001—M031；SRC-001—022 按各材料所映射的实际一项或多项取证，不要求全部同时适用。逐材料验 sourceSystem/issuedBy/effectiveAt/sourceVersion/subject 与 OCR 置信/页定位，不能把可读性当真实性 | 可信→PASS_FACT；文件破损→UNREADABLE 补清晰版；官方源不可连→SOURCE_UNAVAILABLE；主体/签发冲突→CONFLICT，交材料所有人/权威机构",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R038",
          "title": "材料版本替换与受影响规则定向失效",
          "requirement": "【研究级核验标准；非校方正式规则】R038 R038 L2—L7：材料版本替换与受影响规则定向失效 | 真＝M 被补件/重传/源更新；假＝无变化；未知＝新旧版关系不明 | F044—F046；M029＋被替换任一 M；SRC-006、020—022 仅技术设计证据。保存 materialId@sourceVersion、supersedes、受影响的 R 与原 Run，冻结历史 | 关系完整→PASS_FACT（重审管理事实），仅依赖旧版的 R 标 STALE 待重审；无版本映射→CONFLICT，案卷业务 Owner；不得编辑历史 Run 或正式学校决定",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R039",
          "title": "困难身份衍生专项项目独立授权",
          "requirement": "【研究级核验标准；非校方正式规则】R039 R039 L0：困难身份衍生专项项目独立授权 | 真＝申请非国家助学金但声称共用本 ID；假＝普通国助；未知＝项目章程/授权目的未取得 | F016—F021、F038；M030/M001；SRC-014（宣传线索）、SRC-020—021（目录边界）。必须先核资金性质、独立决定、项目主管、兼容条款，再决定是否可同模板 | 授权未取得→POLICY_UNCONFIRMED，A16 不可自动受理；若独立目的证实→NEEDS_HUMAN_DECISION＋CATALOG-CHANGE-REQUEST 交总账 Owner；不创建新 ID",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R040",
          "title": "任意阶段：现行性冲突/来源中断分类",
          "requirement": "【研究级核验标准；非校方正式规则】R040 R040 任意阶段：现行性冲突/来源中断分类 | 真＝规则所需政策/原始记录不可验证；假＝原文/版本与阶段已核；未知＝索引有但正文 412 | F019、F044；M001、该 R 关联源；SRC-007—016、019、023 与任何失败源。分别记“原文缺/效力未知”“官方源不可连”“申请材料不可读”“多份权威冲突”，保留尝试时间和 URL | 现行政策未证→POLICY_UNCONFIRMED 由主管部门核；技术性失联→SOURCE_UNAVAILABLE，源系统管理员；上传材料损坏→UNREADABLE；真正矛盾→CONFLICT，不得统一填 NEEDS_MATERIAL",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "local-l0",
      "name": "L0 批次公告",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-l1",
      "workflowOwner": "local"
    },
    {
      "id": "local-l1",
      "name": "L1 前置身份及认定",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-l2",
      "workflowOwner": "local"
    },
    {
      "id": "local-l2",
      "name": "L2 申报、确认、补件",
      "kind": "supplement-wait",
      "executorRole": "reviewer",
      "nextStageId": "local-l3",
      "returnToStageId": "local-l1",
      "workflowOwner": "local"
    },
    {
      "id": "local-l3",
      "name": "L3 班级/学院审查",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-l4",
      "workflowOwner": "local"
    },
    {
      "id": "local-l4",
      "name": "L4 拟推荐及公示",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-l5",
      "workflowOwner": "local"
    },
    {
      "id": "local-l5",
      "name": "L5 校级审查与决定",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-l6",
      "workflowOwner": "local"
    },
    {
      "id": "local-l6",
      "name": "L6 财务发放及对账",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-l7",
      "workflowOwner": "local"
    },
    {
      "id": "local-l7",
      "name": "L7 后续异动与新批次（本地人工复核；不代表校方正式决定）",
      "kind": "manual-review",
      "executorRole": "teacher",
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
      "id": "supplement-suggestions",
      "kind": "supplement-list",
      "audience": "reviewer"
    },
    {
      "id": "human-review-summary",
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

export const r02Metadata = {
  "templateId": "S03-T07",
  "name": "国家助学金和基于困难身份的助学资助审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S03-T07.md",
  "sourceDocumentSha256": "fba9761918ecba7b3666e7037575caf0be5eb8ddc0f4a89c201d14b42620322f",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23",
  "policyEvidenceStatus": "PARTIAL",
  "sources": [
    {
      "id": "SRC-001",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-002",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-003",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-004",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-005",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-006",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-007",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-008",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-009",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-010",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-011",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-012",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-013",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-014",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-015",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-016",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-017",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-018",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-019",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-020",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-021",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-022",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-023",
      "status": "CURRENTITY-UNKNOWN"
    }
  ],
  "criteria": [
    {
      "sectionId": "evidence-review",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F016",
        "F017",
        "F018",
        "F019",
        "F020",
        "F021"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-020"
      ],
      "fieldIds": [
        "F001",
        "F002",
        "F003",
        "F045"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M006",
        "M011"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-020"
      ],
      "fieldIds": [
        "F005",
        "F006",
        "F011"
      ],
      "materialSlotIds": [
        "M002",
        "M014"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F004",
        "F005"
      ],
      "materialSlotIds": [
        "M002",
        "M003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F007",
        "F010"
      ],
      "materialSlotIds": [
        "M002",
        "M010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "fieldIds": [
        "F008",
        "F009"
      ],
      "materialSlotIds": [
        "M002",
        "M013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "fieldIds": [
        "F049"
      ],
      "materialSlotIds": [
        "M031"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-008"
      ],
      "fieldIds": [
        "F022",
        "F023",
        "F024",
        "F025"
      ],
      "materialSlotIds": [
        "M004",
        "M005",
        "M027"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-008",
        "SRC-020"
      ],
      "fieldIds": [
        "F022",
        "F025"
      ],
      "materialSlotIds": [
        "M004",
        "M005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-014"
      ],
      "fieldIds": [
        "F021",
        "F023",
        "F038",
        "F050"
      ],
      "materialSlotIds": [
        "M001",
        "M004",
        "M019"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-005"
      ],
      "fieldIds": [
        "F001",
        "F002",
        "F003",
        "F014",
        "F015"
      ],
      "materialSlotIds": [
        "M002",
        "M007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-005"
      ],
      "fieldIds": [
        "F014",
        "F016",
        "F017",
        "F018",
        "F019",
        "F020",
        "F031"
      ],
      "materialSlotIds": [
        "M001",
        "M006",
        "M007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-009"
      ],
      "fieldIds": [
        "F017",
        "F018",
        "F019",
        "F020",
        "F031",
        "F032",
        "F033"
      ],
      "materialSlotIds": [
        "M001",
        "M006"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-012"
      ],
      "fieldIds": [
        "F006",
        "F026",
        "F027",
        "F028"
      ],
      "materialSlotIds": [
        "M008",
        "M009"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F031",
        "F032",
        "F033"
      ],
      "materialSlotIds": [
        "M001",
        "M008",
        "M009",
        "M011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-017",
        "SRC-018"
      ],
      "fieldIds": [
        "F026",
        "F027",
        "F028",
        "F033"
      ],
      "materialSlotIds": [
        "M008",
        "M009",
        "M010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F029",
        "F030",
        "F040"
      ],
      "materialSlotIds": [
        "M008",
        "M010",
        "M012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F027",
        "F028",
        "F029",
        "F030",
        "F038",
        "F040"
      ],
      "materialSlotIds": [
        "M008",
        "M012",
        "M019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F008",
        "F012",
        "F013",
        "F040"
      ],
      "materialSlotIds": [
        "M002",
        "M013",
        "M019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F008",
        "F012",
        "F013",
        "F040"
      ],
      "materialSlotIds": [
        "M002",
        "M013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F008",
        "F009",
        "F010",
        "F040"
      ],
      "materialSlotIds": [
        "M002",
        "M013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F005",
        "F011",
        "F050"
      ],
      "materialSlotIds": [
        "M002",
        "M014",
        "M019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-008",
        "SRC-023"
      ],
      "fieldIds": [
        "F017",
        "F018",
        "F019",
        "F022",
        "F023",
        "F024",
        "F025",
        "F026",
        "F027",
        "F028",
        "F044",
        "F045",
        "F046"
      ],
      "materialSlotIds": [
        "M001",
        "M004",
        "M008",
        "M027"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-005"
      ],
      "fieldIds": [
        "F016",
        "F017",
        "F018",
        "F019",
        "F020",
        "F021",
        "F038"
      ],
      "materialSlotIds": [
        "M001",
        "M028"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-002",
        "SRC-017"
      ],
      "fieldIds": [
        "F034",
        "F044"
      ],
      "materialSlotIds": [
        "M015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R026",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F035",
        "F038",
        "F045"
      ],
      "materialSlotIds": [
        "M015",
        "M016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R027",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F036"
      ],
      "materialSlotIds": [
        "M017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R028",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F037",
        "F038",
        "F048"
      ],
      "materialSlotIds": [
        "M017",
        "M018",
        "M026"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R029",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007"
      ],
      "fieldIds": [
        "F038",
        "F050"
      ],
      "materialSlotIds": [
        "M001",
        "M016",
        "M019"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F039"
      ],
      "materialSlotIds": [
        "M019",
        "M020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "fieldIds": [
        "F008",
        "F009",
        "F010",
        "F011",
        "F012",
        "F013",
        "F029",
        "F030",
        "F040",
        "F050"
      ],
      "materialSlotIds": [
        "M012",
        "M013",
        "M019",
        "M021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R032",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "fieldIds": [
        "F001",
        "F002",
        "F003",
        "F051"
      ],
      "materialSlotIds": [
        "M021",
        "M022",
        "M023"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R033",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "fieldIds": [
        "F041",
        "F042"
      ],
      "materialSlotIds": [
        "M021",
        "M022"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R034",
      "srcIds": [
        "SRC-004"
      ],
      "fieldIds": [
        "F042"
      ],
      "materialSlotIds": [
        "M022",
        "M023"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R035",
      "srcIds": [
        "SRC-004"
      ],
      "fieldIds": [
        "F043",
        "F051"
      ],
      "materialSlotIds": [
        "M021",
        "M023",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R036",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F031",
        "F038",
        "F047"
      ],
      "materialSlotIds": [
        "M019",
        "M025"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R037",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F044",
        "F045"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M003",
        "M004",
        "M005",
        "M006",
        "M007",
        "M008",
        "M009",
        "M010",
        "M011",
        "M012",
        "M013",
        "M014",
        "M015",
        "M016",
        "M017",
        "M018",
        "M019",
        "M020",
        "M021",
        "M022",
        "M023",
        "M024",
        "M025",
        "M026",
        "M027",
        "M028",
        "M029",
        "M030",
        "M031"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R038",
      "srcIds": [
        "SRC-006"
      ],
      "fieldIds": [
        "F044",
        "F045",
        "F046"
      ],
      "materialSlotIds": [
        "M029"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R039",
      "srcIds": [
        "SRC-014",
        "SRC-020"
      ],
      "fieldIds": [
        "F016",
        "F017",
        "F018",
        "F019",
        "F020",
        "F021",
        "F038"
      ],
      "materialSlotIds": [
        "M001",
        "M030"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R040",
      "srcIds": [
        "SRC-007"
      ],
      "fieldIds": [
        "F019",
        "F044"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
