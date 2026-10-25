import type { TemplateVersion } from '@profer/shared'

/** R02 local research definition; it is not a school-issued or school-approved template. */
export const templateVersion: TemplateVersion = {
  "templateId": "S02-T07",
  "version": 1,
  "schemaVersion": 2,
  "name": "逾期补选、退课资格审核",
  "description": "本地研究模板 · 非校方正式模板。历史校本特殊补退选办法与2025—2026学年通知均有证据；2026—2027学年秋季通知正文及相互适用关系尚未取得有权确认。 仅用于事实预审、证据整理和人工待办；政策或权限未确认时不得自动批准或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；来源为当前集成分支研究原件 S02-T07.md。研究来源 SRC 仅是来源索引，不是案卷材料 SourceRef。",
  "objectType": "person",
  "displayName": {
    "template": "{{f003}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "ApplicationAttempt",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "原稿字段 F001；来源/阶段/隐私/缺失处置：L1；受信案卷服务生成；不接受上传值取代；本案申请台账、M001 对应受理号；P1",
      "displayHint": "原稿字段编号 F001。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f002",
      "label": "Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F002；来源/阶段/隐私/缺失处置：L0；学校可信身份/学籍源；M002 已认证用户、M004 学籍关联键；P2",
      "displayHint": "原稿字段编号 F002。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f003",
      "label": "Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F003；来源/阶段/隐私/缺失处置：L1；M002/M004 官方登记姓名，M001 仅供比对；M001“姓名”，M002/M004 姓名栏；P2",
      "displayHint": "原稿字段编号 F003。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f004",
      "label": "Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F004；来源/阶段/隐私/缺失处置：L0；学籍管理/国际学生归口；M004 学段及身份，M014 身份特别认定；P2",
      "displayHint": "原稿字段编号 F004。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f005",
      "label": "Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F005；来源/阶段/隐私/缺失处置：L0；学籍及学校校区管理记录；M004 校区、M014 特殊校区范围；P1/P2",
      "displayHint": "原稿字段编号 F005。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f006",
      "label": "Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F006；来源/阶段/隐私/缺失处置：L1/L2；当前学籍/培养方案及正式异动；M001“学院/班级”，M004 当前学院专业班级；P2",
      "displayHint": "原稿字段编号 F006。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f007",
      "label": "Student",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F007；来源/阶段/隐私/缺失处置：L0/L2；学籍注册记录；M004 本学期注册状态和时点；P2",
      "displayHint": "原稿字段编号 F007。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f008",
      "label": "Student/ApplicationAttempt",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F008；来源/阶段/隐私/缺失处置：L1；可信提交会话与学校身份映射；M001 提交信息、M002 登录主体、必要时 M013；P2",
      "displayHint": "原稿字段编号 F008。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f009",
      "label": "Student/ApplicationAttempt",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F009；来源/阶段/隐私/缺失处置：L1（仅代理）；校方认可的授权记录；M013 授权人/被授权人/动作/期限及可核验签署；P2",
      "displayHint": "原稿字段编号 F009。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f010",
      "label": "TermWindow",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F010；来源/阶段/隐私/缺失处置：L0；当期教务通知/学籍系统；M001“学期”、M003 当期通知；P1",
      "displayHint": "原稿字段编号 F010。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f011",
      "label": "TermWindow",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F011；来源/阶段/隐私/缺失处置：L0；教务系统当期批次配置；M003 轮次公告、M005 批次编号/快照；P1",
      "displayHint": "原稿字段编号 F011。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f012",
      "label": "TermWindow",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F012；来源/阶段/隐私/缺失处置：L0；实时教务系统与有效公告；M003 窗口、M005 观察时刻/批次状态；P1",
      "displayHint": "原稿字段编号 F012。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f013",
      "label": "TermWindow",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F013；来源/阶段/隐私/缺失处置：L0；对应学期与批次的有效通知；M003 原文时间表及版本；P0/P1",
      "displayHint": "原稿字段编号 F013。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f014",
      "label": "CourseTarget",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F014；来源/阶段/隐私/缺失处置：L1/L2；课务/培养方案；M006 课程编码；M001 表单仅有课程名称；P1",
      "displayHint": "原稿字段编号 F014。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f015",
      "label": "CourseTarget",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F015；来源/阶段/隐私/缺失处置：L1；M006 当前课程目录，M001 申请填报；M001“课程名称”、M006 课程标准名；P0/P1",
      "displayHint": "原稿字段编号 F015。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f016",
      "label": "CourseTarget",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F016；来源/阶段/隐私/缺失处置：L1/L2；教务系统教学班；M001“教学班号”、M006 权威班号及学期；P1",
      "displayHint": "原稿字段编号 F016。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f017",
      "label": "CourseTarget/ApplicationAttempt",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F017；来源/阶段/隐私/缺失处置：L1；学生明确申请操作；M001“补选/退选”单项勾选；P1",
      "displayHint": "原稿字段编号 F017。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f018",
      "label": "CourseTarget",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F018；来源/阶段/隐私/缺失处置：L0/L2/L5；教务选课名单；M005 当前名单；L5 时 M019 更新后名单；P2",
      "displayHint": "原稿字段编号 F018。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f019",
      "label": "CourseTarget",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F019；来源/阶段/隐私/缺失处置：L2；教务课表、开/停/合班记录；M006 课表及开课状态、M011 变更记录；P1",
      "displayHint": "原稿字段编号 F019。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f020",
      "label": "CourseTarget",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F020；来源/阶段/隐私/缺失处置：L2（补选/容量相关）；教务教学班容量及学校扩容决定；M006 容量快照；必要时 M011 扩容/改课记录；P1",
      "displayHint": "原稿字段编号 F020。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f021",
      "label": "CourseTarget/Student",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F021；来源/阶段/隐私/缺失处置：L2（涉及学分）；权威选课清单、培养方案和学分登记；M005 名单、M007 学分计算依据；P2",
      "displayHint": "原稿字段编号 F021。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f022",
      "label": "CourseTarget",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F022；来源/阶段/隐私/缺失处置：L2（需要先修时）；当前培养方案/课程要求及已修成绩；M007 先修规则与学生已修记录；P2",
      "displayHint": "原稿字段编号 F022。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f023",
      "label": "ReasonEvent",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F023；来源/阶段/隐私/缺失处置：L1；学生陈述，类别范围仅作办案分流；M008 事由分类、M001“申请原因”；P2，涉健康可 P3",
      "displayHint": "原稿字段编号 F023。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f024",
      "label": "ReasonEvent",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F024；来源/阶段/隐私/缺失处置：L1；学生本人/受权提交者陈述；M001“申请原因”、M008 事实说明；P2/P3",
      "displayHint": "原稿字段编号 F024。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f025",
      "label": "ReasonEvent",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F025；来源/阶段/隐私/缺失处置：L2；异动或教学事件正式记录；M009/M010/M011 生效日，或 M012 经核说明；P2/P3",
      "displayHint": "原稿字段编号 F025。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f026",
      "label": "ReasonEvent",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F026；来源/阶段/隐私/缺失处置：L2（条件事由）；S01 有效决定、校方课务变更等；M009/M010/M011 的编号、签发机构、效力状态；P2",
      "displayHint": "原稿字段编号 F026。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f027",
      "label": "ApplicationAttempt",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F027；来源/阶段/隐私/缺失处置：L1；校方受理戳记或受信系统提交日志；M001 收件时间、申请事件日志；P1",
      "displayHint": "原稿字段编号 F027。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f028",
      "label": "ApplicationAttempt",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F028；来源/阶段/隐私/缺失处置：L1；申请人声明或官方联系方式；M001“联系电话”；P2",
      "displayHint": "原稿字段编号 F028。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f029",
      "label": "ReviewOpinion",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F029；来源/阶段/隐私/缺失处置：L2/L3；课务任课指派/可信签署身份；M006 任课教师关联，M016/M022 签发身份；P2",
      "displayHint": "原稿字段编号 F029。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f030",
      "label": "ReviewOpinion",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F030；来源/阶段/隐私/缺失处置：L3；任课教师正式意见；M016 表单签名栏或校方认可的电子意见、M022；P2",
      "displayHint": "原稿字段编号 F030。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f031",
      "label": "ReviewOpinion",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "原稿字段 F031；来源/阶段/隐私/缺失处置：L3；当前有权学院正式意见；M017 学院意见栏、M022 认证记录；P2",
      "displayHint": "原稿字段编号 F031。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f032",
      "label": "TermWindow",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F032；来源/阶段/隐私/缺失处置：L0/L2/L4；校本现行办法、当期通知及有权解释；M003 通知版本、M014 专项身份规定；P0/P1",
      "displayHint": "原稿字段编号 F032。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f033",
      "label": "DecisionAndExecution",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "原稿字段 F033；来源/阶段/隐私/缺失处置：L4；教务处等被证实的有权审批者；M018 决定正文/编号/签署与 M022；P2",
      "displayHint": "原稿字段编号 F033。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f034",
      "label": "DecisionAndExecution",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F034；来源/阶段/隐私/缺失处置：L5；受信教务选课名单与执行日志；M019 更新后名单、操作事件；P2",
      "displayHint": "原稿字段编号 F034。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f035",
      "label": "DecisionAndExecution",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F035；来源/阶段/隐私/缺失处置：L6（若触发）；校方有权撤回/复核受理与结果；M020 后续申请、M021 结论/受理记录；P2",
      "displayHint": "原稿字段编号 F035。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f036",
      "label": "ApplicationAttempt",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "原稿字段 F036；来源/阶段/隐私/缺失处置：L1 后每次变更；受控案卷版本台账；所有 M 实例版本、原申请/审批绑定哈希；P1/P2",
      "displayHint": "原稿字段编号 F036。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f037",
      "label": "ReasonEvent/CourseTarget",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F037；来源/阶段/隐私/缺失处置：L2（C06）；教务/任课管理的课时、考核或成绩原始记录；M015 考核/缺勤/在修记录；P2",
      "displayHint": "原稿字段编号 F037。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "现（L1 特殊申请）；替代仅限校方正式认可的电子表/OA 申请及受理日志。现行载体形式尚未确认，不强制旧 PDF",
      "purpose": "现（L1 特殊申请）；替代仅限校方正式认可的电子表/OA 申请及受理日志。现行载体形式尚未确认，不强制旧 PDF；F001/F003/F006/F010/F015–F017/F024/F027/F028；SRC-001；一次尝试一版，绑定学生/学期/课程/操作。无申请表达→NEEDS_MATERIAL；扫描不清→UNREADABLE；政策上是否受理→POLICY_UNCONFIRMED",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "现（L1 特殊申请）；替代仅限校方正式认可的电子表/OA 申请及受理日志。现行载体形式尚未确认，不强制旧 PDF；F001/F003/F006/F010/F015–F017/F024/F027/F028；SRC-001；一次尝试一版，绑定学生/学期/课程/操作。无申请表达→NEEDS_MATERIAL；扫描不清→UNREADABLE；政策上是否受理→POLICY_UNCONFIRMED"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "现（L0/L1）；可用校方正式受理时核查原件的受控记录替代，不要求学生上传身份证扫描件",
      "purpose": "现（L0/L1）；可用校方正式受理时核查原件的受控记录替代，不要求学生上传身份证扫描件；F002/F003/F008；SRC-001/002；绑定身份 UID、观察时间和本申请；系统失联→SOURCE_UNAVAILABLE，与 M001 不符→CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "现（L0/L1）；可用校方正式受理时核查原件的受控记录替代，不要求学生上传身份证扫描件；F002/F003/F008；SRC-001/002；绑定身份 UID、观察时间和本申请；系统失联→SOURCE_UNAVAILABLE，与 M001 不符→CONFLICT"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "现（L0）；校方确认的现行公告及受信批次配置可相互校核。2025/2026 旧学期通知不能替代 2026 秋季正文",
      "purpose": "现（L0）；校方确认的现行公告及受信批次配置可相互校核。2025/2026 旧学期通知不能替代 2026 秋季正文；F010–F013/F032；SRC-001/002/003/004/005/007/009；记载来源 URL、公告日期、生效区间、抓取时点；全文未得或相互冲突→POLICY_UNCONFIRMED，不是学生缺件",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "现（L0）；校方确认的现行公告及受信批次配置可相互校核。2025/2026 旧学期通知不能替代 2026 秋季正文；F010–F013/F032；SRC-001/002/003/004/005/007/009；记载来源 URL、公告日期、生效区间、抓取时点；全文未得或相互冲突→POLICY_UNCONFIRMED，不是学生缺件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "现（L0/L2）；仅学校认证的学籍记录或有效正式证明可替代，不要求学生重复开证明",
      "purpose": "现（L0/L2）；仅学校认证的学籍记录或有效正式证明可替代，不要求学生重复开证明；F002–F007；SRC-001/002/006/007/009；以 student UID+term+有效日归属；无法连接→SOURCE_UNAVAILABLE；与申请表不符→CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "现（L0/L2）；仅学校认证的学籍记录或有效正式证明可替代，不要求学生重复开证明；F002–F007；SRC-001/002/006/007/009；以 student UID+term+有效日归属；无法连接→SOURCE_UNAVAILABLE；与申请表不符→CONFLICT"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "现（L0/L2）；受控部门确认的带时间/查询范围名单可合法替代接口；学生截图仅辅助",
      "purpose": "现（L0/L2）；受控部门确认的带时间/查询范围名单可合法替代接口；学生截图仅辅助；F011/F012/F018/F021；SRC-001/002/006；必须记录 student UID+term+class+as-of、数据版本；失联→SOURCE_UNAVAILABLE，模糊图片→UNREADABLE，不能据截图直接认定",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "现（L0/L2）；受控部门确认的带时间/查询范围名单可合法替代接口；学生截图仅辅助；F011/F012/F018/F021；SRC-001/002/006；必须记录 student UID+term+class+as-of、数据版本；失联→SOURCE_UNAVAILABLE，模糊图片→UNREADABLE，不能据截图直接认定"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "现（L0/L2）；有权教学事务人员签发的同一批次表格/名单可替代实时接口",
      "purpose": "现（L0/L2）；有权教学事务人员签发的同一批次表格/名单可替代实时接口；F014–F016/F019/F020/F029；SRC-001/006/009；绑定学期/班号/课程代码/发布时间；不同学期同名课程不可互用，失联→SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "现（L0/L2）；有权教学事务人员签发的同一批次表格/名单可替代实时接口；F014–F016/F019/F020/F029；SRC-001/006/009；绑定学期/班号/课程代码/发布时间；不同学期同名课程不可互用，失联→SOURCE_UNAVAILABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "条（C07，或实际触发先修/学分）；认可的本专业本年级培养方案与有效选课学分记录组合；不得仅用网上普通建议",
      "purpose": "条（C07，或实际触发先修/学分）；认可的本专业本年级培养方案与有效选课学分记录组合；不得仅用网上普通建议；F006/F021/F022；SRC-001/002；绑定专业、培养方案版本与学生已修记录；缺权威记录→SOURCE_UNAVAILABLE，阈值现行性不明→POLICY_UNCONFIRMED",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "条（C07，或实际触发先修/学分）；认可的本专业本年级培养方案与有效选课学分记录组合；不得仅用网上普通建议；F006/F021/F022；SRC-001/002；绑定专业、培养方案版本与学生已修记录；缺权威记录→SOURCE_UNAVAILABLE，阈值现行性不明→POLICY_UNCONFIRMED"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "现（L1 逾期特殊申请）；可写入 M001 申请原因栏，不要求重复上传独立说明书",
      "purpose": "现（L1 逾期特殊申请）；可写入 M001 申请原因栏，不要求重复上传独立说明书；F023/F024/F025；SRC-001；归属一次申请与对象；空白→NEEDS_MATERIAL；前后说法不同→CONFLICT，判断“够不够特殊”留校方",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "现（L1 逾期特殊申请）；可写入 M001 申请原因栏，不要求重复上传独立说明书；F023/F024/F025；SRC-001；归属一次申请与对象；空白→NEEDS_MATERIAL；前后说法不同→CONFLICT，判断“够不够特殊”留校方"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "条（C02）；S01-T04 已生效且可核验的校方结论或正式通知/电子记录为替代；仅转专业申请单不能替代",
      "purpose": "条（C02）；S01-T04 已生效且可核验的校方结论或正式通知/电子记录为替代；仅转专业申请单不能替代；F006/F025/F026；SRC-001/002/006；绑定 student UID、旧新专业、生效日及决定版本；官方记录失联→SOURCE_UNAVAILABLE，草稿非通过",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "条（C02）；S01-T04 已生效且可核验的校方结论或正式通知/电子记录为替代；仅转专业申请单不能替代；F006/F025/F026；SRC-001/002/006；绑定 student UID、旧新专业、生效日及决定版本；官方记录失联→SOURCE_UNAVAILABLE，草稿非通过"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "条（C03）；S01-T01/02 正式生效结论或可核校方记录，不能用学生口述替代",
      "purpose": "条（C03）；S01-T01/02 正式生效结论或可核校方记录，不能用学生口述替代；F004/F007/F025/F026；SRC-001/002/006/009；绑定 student UID、休复学类型、生效日；无法核实→SOURCE_UNAVAILABLE，多个版本冲突→CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "条（C03）；S01-T01/02 正式生效结论或可核校方记录，不能用学生口述替代；F004/F007/F025/F026；SRC-001/002/006/009；绑定 student UID、休复学类型、生效日；无法核实→SOURCE_UNAVAILABLE，多个版本冲突→CONFLICT"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "条（C04 或确有课务变更）；正式系统排课/变更事件、通知或核章记录可替代",
      "purpose": "条（C04 或确有课务变更）；正式系统排课/变更事件、通知或核章记录可替代；F016/F019/F020/F025/F026；SRC-001/003/004/006/009；绑定教学班 ID、旧新安排及有效日；无权威记录→SOURCE_UNAVAILABLE，过期课表不等于正式变更",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "条（C04 或确有课务变更）；正式系统排课/变更事件、通知或核章记录可替代；F016/F019/F020/F025/F026；SRC-001/003/004/006/009；绑定教学班 ID、旧新安排及有效日；无权威记录→SOURCE_UNAVAILABLE，过期课表不等于正式变更"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "条（仅当已确认有效校本规则确实要求）；根据校方认可的证明种类与摘要/结果，不默认索取完整医疗病历",
      "purpose": "条（仅当已确认有效校本规则确实要求）；根据校方认可的证明种类与摘要/结果，不默认索取完整医疗病历；F023–F025；SRC-001（仅笼统特殊情况，无通用附件细则）；仅归属其证明的事实，隐私可达 P3；要求未确认→POLICY_UNCONFIRMED，需但缺失→NEEDS_MATERIAL，糊图→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "条（仅当已确认有效校本规则确实要求）；根据校方认可的证明种类与摘要/结果，不默认索取完整医疗病历；F023–F025；SRC-001（仅笼统特殊情况，无通用附件细则）；仅归属其证明的事实，隐私可达 P3；要求未确认→POLICY_UNCONFIRMED，需但缺失→NEEDS_MATERIAL，糊图→UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "条（C10 且校方确认可代交）；仅学校认可的授权/身份核验，不假设普通委托书必然有效",
      "purpose": "条（C10 且校方确认可代交）；仅学校认可的授权/身份核验，不假设普通委托书必然有效；F008/F009；SRC-001 第五条（仅禁止代选，未证明代交）；绑定授权人/代理人/范围/期限，缺或效力未知→POLICY_UNCONFIRMED/人工，不由客户端虚构授权",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "条（C10 且校方确认可代交）；仅学校认可的授权/身份核验，不假设普通委托书必然有效；F008/F009；SRC-001 第五条（仅禁止代选，未证明代交）；绑定授权人/代理人/范围/期限，缺或效力未知→POLICY_UNCONFIRMED/人工，不由客户端虚构授权"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "条（C08/C12）；有效专项学籍记录+当期通知/有权机关答复组合；不能用其他高校制度",
      "purpose": "条（C08/C12）；有效专项学籍记录+当期通知/有权机关答复组合；不能用其他高校制度；F004/F005/F032；SRC-002/005/007/009；绑定学段、校区、适用学期；未取到本事项规则→POLICY_UNCONFIRMED，部门系统失联→SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "条（C08/C12）；有效专项学籍记录+当期通知/有权机关答复组合；不能用其他高校制度；F004/F005/F032；SRC-002/005/007/009；绑定学段、校区、适用学期；未取到本事项规则→POLICY_UNCONFIRMED，部门系统失联→SOURCE_UNAVAILABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "条（C06）；经有权学校部门确认的课堂及成绩记录，不以学生口述或单张截图替代",
      "purpose": "条（C06）；经有权学校部门确认的课堂及成绩记录，不以学生口述或单张截图替代；F018/F037；SRC-001 第八条、SRC-002 第十二/二十/二十三条；绑定 student+term+class+记录发生时点；失联→SOURCE_UNAVAILABLE，与退课结果矛盾→CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "条（C06）；经有权学校部门确认的课堂及成绩记录，不以学生口述或单张截图替代；F018/F037；SRC-001 第八条、SRC-002 第十二/二十/二十三条；绑定 student+term+class+记录发生时点；失联→SOURCE_UNAVAILABLE，与退课结果矛盾→CONFLICT"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "后（L3）；仅当当期认可的纸质签名或受信电子签署可替代；L1 不必提供",
      "purpose": "后（L3）；仅当当期认可的纸质签名或受信电子签署可替代；L1 不必提供；F029/F030/F036；SRC-001 第十六条及附表；绑定教学班、签发身份、时间、申请版本；未进入 L3 不算缺，进 L3 无权限→NEEDS_HUMAN_DECISION/签署待办",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "后（L3）；仅当当期认可的纸质签名或受信电子签署可替代；L1 不必提供；F029/F030/F036；SRC-001 第十六条及附表；绑定教学班、签发身份、时间、申请版本；未进入 L3 不算缺，进 L3 无权限→NEEDS_HUMAN_DECISION/签署待办"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "后（L3）；经校方认可的实体签章或受信电子意见，不由上传者自我声明替代",
      "purpose": "后（L3）；经校方认可的实体签章或受信电子意见，不由上传者自我声明替代；F006/F031/F036；SRC-001 第十六条及附表；绑定学院、签署角色与版本；前后学院变更→CONFLICT/人工确认；L1 不要求",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "后（L3）；经校方认可的实体签章或受信电子意见，不由上传者自我声明替代；F006/F031/F036；SRC-001 第十六条及附表；绑定学院、签署角色与版本；前后学院变更→CONFLICT/人工确认；L1 不要求"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "后（L4）；须有当前有效的签署/业务决定凭证；普通“教务处经办人”栏本身不自动替代审批",
      "purpose": "后（L4）；须有当前有效的签署/业务决定凭证；普通“教务处经办人”栏本身不自动替代审批；F032/F033/F036；SRC-001 第十六条及附表（效力待确认）、SRC-006；绑定审批机构、决定号、签发日、学生/学期/班号/动作/版本；未作决定→NEEDS_HUMAN_DECISION，不能生成假批复",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "后（L4）；须有当前有效的签署/业务决定凭证；普通“教务处经办人”栏本身不自动替代审批；F032/F033/F036；SRC-001 第十六条及附表（效力待确认）、SRC-006；绑定审批机构、决定号、签发日、学生/学期/班号/动作/版本；未作决定→NEEDS_HUMAN_DECISION，不能生成假批复"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "后（L5）；实际名单/带审计的变更事件，不以批准表或“已处理”消息替代",
      "purpose": "后（L5）；实际名单/带审计的变更事件，不以批准表或“已处理”消息替代；F018/F034/F036；SRC-001 第四、十五、十六条；前后快照需同一对象和有效时间；未更新→待执行，记录矛盾→CONFLICT；不能标已生效",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "后（L5）；实际名单/带审计的变更事件，不以批准表或“已处理”消息替代；F018/F034/F036；SRC-001 第四、十五、十六条；前后快照需同一对象和有效时间；未更新→待执行，记录矛盾→CONFLICT；不能标已生效"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "后/条（L6，且校方允许）；经认可渠道提交的同案申请/收件记录；不默认申请人可自行撤销已生效决定",
      "purpose": "后/条（L6，且校方允许）；经认可渠道提交的同案申请/收件记录；不默认申请人可自行撤销已生效决定；F001/F027/F035/F036；SRC-002 第五十九条仅为限定范围的申诉线索；绑定原决定 ID、动作、提交时点、理由；渠道与期限未知→POLICY_UNCONFIRMED，材料糊→UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "后/条（L6，且校方允许）；经认可渠道提交的同案申请/收件记录；不默认申请人可自行撤销已生效决定；F001/F027/F035/F036；SRC-002 第五十九条仅为限定范围的申诉线索；绑定原决定 ID、动作、提交时点、理由；渠道与期限未知→POLICY_UNCONFIRMED，材料糊→UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "后（L6）；只能使用有权机关正式记录/通知，不由 AI 假设通过",
      "purpose": "后（L6）；只能使用有权机关正式记录/通知，不由 AI 假设通过；F035/F036；SRC-002 第五十九条（仅限定申诉线索）；绑定 M020、原决定及复核版本；未产生时仅为待办，不得提前要求或声称通过",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "后（L6）；只能使用有权机关正式记录/通知，不由 AI 假设通过；F035/F036；SRC-002 第五十九条（仅限定申诉线索）；绑定 M020、原决定及复核版本；未产生时仅为待办，不得提前要求或声称通过"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "后（L3 起随签署生成）；校方可验签的签章/纸质核验记录；OCR 的“签名”文本不能替代",
      "purpose": "后（L3 起随签署生成）；校方可验签的签章/纸质核验记录；OCR 的“签名”文本不能替代；F029–F033/F035/F036；SRC-001/006/009（技术必要性为研究建议）；绑定签发人、组织、授权范围、对象、版本、时间；源失联→SOURCE_UNAVAILABLE；身份不符→CONFLICT/人工核验",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "后（L3 起随签署生成）；校方可验签的签章/纸质核验记录；OCR 的“签名”文本不能替代；F029–F033/F035/F036；SRC-001/006/009（技术必要性为研究建议）；绑定签发人、组织、授权范围、对象、版本、时间；源失联→SOURCE_UNAVAILABLE；身份不符→CONFLICT/人工核验"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "research-criteria",
      "name": "研究稿逐条事实核验规则",
      "description": "逐条来自本批 Markdown 的 R 编号。模板内标准不等于校方政策；政策未确认时仅作语义预审或人工复核。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "当前校本政策是否足以适用于目标案件（L0/L4）",
          "requirement": "R001 当前校本政策是否足以适用于目标案件（L0/L4）；TRUE：本学期、本身份、本校区规则正文及效力有权确认→可继续事实预审，仍非批准；FALSE：确有有效禁办规定→记录有权解释、交校方告知，不能让模型作行政否决；UNKNOWN：SRC-001/005 效力、学期通知缺正文或相互抵触→POLICY_UNCONFIRMED，终止自动准入硬判断。；F004/F005/F010–F013/F032；M003/M014；SRC-001/002/003/004/005/007/009；教务处或专项规则解释权机构；旧通知只能约束其对应学期。当前 2026 秋季默认 UNKNOWN。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "身份/学段/校区归口（L0）",
          "requirement": "R002 身份/学段/校区归口（L0）；TRUE：M004 与 M014 所需范围证实该申请人在本模板某一分支→PASS_FACT（分流）；FALSE：非学生选课、非适用人群→NOT_APPLICABLE，交相应入口；UNKNOWN：学段/校区权威记录失联→SOURCE_UNAVAILABLE，专项适用性不明→POLICY_UNCONFIRMED。；F002/F004/F005/F006/F032；M002/M004/M014；SRC-001/002/007/009；学籍/国际交流/宜宾教务归口；不得用普通本科纸表强制研究生、合作办学、留学生。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "当期窗口与逾期事实（L0）",
          "requirement": "R003 当期窗口与逾期事实（L0）；TRUE：M003 当期轮次 + M005 受信状态同指已关窗→PASS_FACT“确为关窗请求”；FALSE：窗口真实开放→NOT_APPLICABLE，回普通选课 C01；UNKNOWN：当期通知仅标题→POLICY_UNCONFIRMED，系统失联→SOURCE_UNAVAILABLE，冲突→CONFLICT。；F010/F011/F012/F013/F032；M003/M005；SRC-001/002/003/004/005；教学事务中心/适用校区教务；不由旧开学周次推算当前轮次截止。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "本人身份与申请人一致（L1）",
          "requirement": "R004 本人身份与申请人一致（L1）；TRUE：经认证 F002 与 M001、M004 的学生键一致→PASS_FACT；FALSE：不同 UID/实质姓名不符→CONFLICT；UNKNOWN：身份源断开→SOURCE_UNAVAILABLE，纸件模糊→UNREADABLE。；F002/F003/F006/F008；M001/M002/M004；SRC-001/002；受信身份核验者/学籍归口；同名不等于同一人，Renderer 角色字段无效。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "代交是否合法并授权本次操作（L1，C10）",
          "requirement": "R005 代交是否合法并授权本次操作（L1，C10）；TRUE：确为代理且学校接受代交，授权覆盖课程/时间/提交动作→代理事实 PASS_FACT，仍不得代选；FALSE：本人自办→NOT_APPLICABLE，或确认代理无权→CONFLICT/人工处理；UNKNOWN：校本代交规则未取→POLICY_UNCONFIRMED，授权文件缺失且依法可补→NEEDS_MATERIAL。；F008/F009/F002/F016/F017；M001/M002/M013；SRC-001（第 5 条只明确禁止代选）；学生本人、校方受理者；不因“辅导员代交”自报身份给审批权。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "申请对象与操作是否明确（L1）",
          "requirement": "R006 申请对象与操作是否明确（L1）；TRUE：M001 指向唯一学生/学期/课程/教学班且仅选 ADD 或 DROP→PASS_FACT；FALSE：两项皆选、都未选、教学班无法消歧→NEEDS_MATERIAL；UNKNOWN：表单不可读→UNREADABLE，课程班号只有非权威名称→SOURCE_UNAVAILABLE。；F001/F010/F014–F017/F027/F028/F036；M001/M006；SRC-001（第 4 页表单）；学生澄清、教务课务核班；联系字段 F028 仅通知使用，不能以电话缺失硬拒资格；一个班一项操作一个尝试。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "学籍注册是否符合选课事实条件（L0/L2）",
          "requirement": "R007 学籍注册是否符合选课事实条件（L0/L2）；TRUE：M004 证实目标学期已注册→PASS_FACT；FALSE：校方确认未注册→事实记为未注册、NEEDS_HUMAN_DECISION 核准救济或特殊身份情形，不能由模型拒件；UNKNOWN：学籍源失联→SOURCE_UNAVAILABLE，异动时间冲突→CONFLICT。；F004/F007/F010；M004；SRC-001 第 2、11 条、SRC-002 第 7/10 条、SRC-007 第 12/15 条；学籍注册主管；学费截图≠已注册，事实记录不代办补注册。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "教学班与课程权威标识、开课状态（L2）",
          "requirement": "R008 教学班与课程权威标识、开课状态（L2）；TRUE：M006 对应当前 F010 的唯一 F016 和有效课务状态→PASS_FACT；FALSE：申请班号不存在/同名不同班→CONFLICT 或请澄清；UNKNOWN：课务系统不可达→SOURCE_UNAVAILABLE，上传课表不可读→UNREADABLE。；F010/F014/F015/F016/F019；M001/M006；SRC-001 第 4/15 条、SRC-006/009；教学事务人员；不依据课程汉字名称替代教学班键。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "补/退操作与已有选课名单关系（L2）",
          "requirement": "R009 补/退操作与已有选课名单关系（L2）；TRUE：受信 M005 显示 ADD 前未选、DROP 前已选→PASS_FACT“名单前态匹配”；FALSE：名单已到目标状态→事实重复/旧申请风险，交人工核对，不生成拒件；UNKNOWN：当前名单失联→SOURCE_UNAVAILABLE，跨版本冲突→CONFLICT。；F017/F018/F010/F016；M001/M005；SRC-001 第 4/8/15 条、SRC-002 第 10 条；教务系统数据持有人；学生截图不取代系统名单。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "特殊申请理由是否有可核陈述（L1）",
          "requirement": "R010 特殊申请理由是否有可核陈述（L1）；TRUE：M001/M008 明确何事、何时与目标操作的联系→PASS_FACT“已提出理由”；FALSE：理由空白或无法判断所指课程→NEEDS_MATERIAL；UNKNOWN：扫描不可读→UNREADABLE，分类之外的事由不能直接判 FALSE。；F023/F024/F025/F017；M001/M008；SRC-001 第 16 条；学生补充事实陈述；“陈述完整”不等于“校方认可特殊”。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "转专业异动及因果时序（C02）",
          "requirement": "R011 转专业异动及因果时序（C02）；TRUE：M009 是 S01-T04/校方已生效转专业决定且 F025 与课程影响期相关→PASS_FACT（异动及时间）；FALSE：无此事由→NOT_APPLICABLE，仅有未获批申请→NEEDS_HUMAN_DECISION 不认可“已生效”；UNKNOWN：正式记录失联→SOURCE_UNAVAILABLE，旧新专业矛盾→CONFLICT。；F006/F023/F025/F026；M008/M009；SRC-001 第 16 条、SRC-002 第 18 条；学籍主管提供决定；是否足以允许逾期由教务有权者决定，不能让 S01 结论替代。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "休学/复学异动及时序（C03）",
          "requirement": "R012 休学/复学异动及时序（C03）；TRUE：M010 有效决定与目标学期相关→PASS_FACT；FALSE：没有此原因→NOT_APPLICABLE，只是申请中→不能记为生效；UNKNOWN：M010 受信源断开→SOURCE_UNAVAILABLE，生效日与目标学期矛盾→CONFLICT/人工。；F004/F007/F023/F025/F026；M008/M010；SRC-001 第 16 条、SRC-002 第 7 条；学籍主管/S01-T01/02 业务结论；休学决定不会自动撤销课程考核。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "停开/合班/调课事实（C04）",
          "requirement": "R013 停开/合班/调课事实（C04）；TRUE：同一班号的 M011 有有权变更事件、前后版本和有效日→PASS_FACT；FALSE：没有学校调课事由→NOT_APPLICABLE，不能凭个人口述补出事件；UNKNOWN：课务记录缺/失联→SOURCE_UNAVAILABLE，新旧课表冲突→CONFLICT。；F016/F019/F023/F025/F026；M006/M008/M011；SRC-001 第 13/16 条、SRC-003/004（各自学期）；教学事务中心或校区有权课务机构；“补选阶段”改选权不得自动延长到关窗后。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "其他特殊原因证明范围（C05/条件）",
          "requirement": "R014 其他特殊原因证明范围（C05/条件）；TRUE：适用有效校本规则确要求 M012、且证明足以核具体事实→PASS_FACT（仅证明事实）；FALSE：该原因无需外证→NOT_APPLICABLE，已确需但材料缺→NEEDS_MATERIAL；UNKNOWN：是否应要求外证未明→POLICY_UNCONFIRMED，提供但模糊→UNREADABLE。；F023/F024/F025/F032；M008/M012；SRC-001 第 16 条（未细列附件要求）；校方事由审定人；健康隐私 P3 只取必要摘要，不普遍索要病历。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "补选班额与扩容事实（C07/补选）",
          "requirement": "R015 补选班额与扩容事实（C07/补选）；TRUE：M006/M011 当前快照确认班额和校方扩容状态→PASS_FACT（容量数据）；FALSE：仅退课且无容量判断需求→NOT_APPLICABLE；UNKNOWN：数据失联→SOURCE_UNAVAILABLE，不同版本容量冲突→CONFLICT，逾期硬阈值未经证明→POLICY_UNCONFIRMED。；F017/F019/F020；M006/M011；SRC-001 第 9/13 条、SRC-006/009；课务/扩容有权者；“满额”不自动产生逾期申请的校方拒绝决定。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "操作后学分负担事实（C07/条件）",
          "requirement": "R016 操作后学分负担事实（C07/条件）；TRUE：M005+M007 可精确算出同学期变更后学分→PASS_FACT（计算）；FALSE：该学生/课程不触发该项约束→NOT_APPLICABLE；UNKNOWN：权威成绩/培养方案失联→SOURCE_UNAVAILABLE，当前上下限适用不明→POLICY_UNCONFIRMED。；F004/F006/F017/F021/F032；M004/M005/M007；SRC-001 第 6 条、SRC-002 第 11 条、SRC-007 第 16 条；培养方案主管；旧 10–50 范围仅作为待核依据，不作为全学段硬拒绝阈值。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "先修依赖事实（C07/条件）",
          "requirement": "R017 先修依赖事实（C07/条件）；TRUE：M007 中该班适用的先修要求及学生已修记录同源匹配→PASS_FACT；FALSE：官方课程无先修要求→NOT_APPLICABLE，有要求但未满足则记录事实待学校判断；UNKNOWN：课程要求/成绩不可取→SOURCE_UNAVAILABLE，规则版本不明→POLICY_UNCONFIRMED。；F014/F016/F022/F032；M006/M007；SRC-001 第 7 条、SRC-002 第 10/11 条；教学主管；不能据相似课程名猜先修。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "已发生上课/考核事实（C06/退选）",
          "requirement": "R018 已发生上课/考核事实（C06/退选）；TRUE：M015 证实存在考勤、旷课、考试或成绩→PASS_FACT“已有记录”，转人工风险提示；FALSE：经权威记录确认尚无→PASS_FACT“目前无记录”；UNKNOWN：校方记录失联→SOURCE_UNAVAILABLE，矛盾→CONFLICT。；F017/F018/F037；M005/M015；SRC-001 第 8 条、SRC-002 第 12/20/23 条、SRC-007 第 17/22/24 条；任课教师/成绩归口；退课不等于清除旷考，更不得由本模板改写成绩。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "与重修、免修、替代等邻接事项分离（L0/L2）",
          "requirement": "R019 与重修、免修、替代等邻接事项分离（L0/L2）；TRUE：受信课程属性/有效邻项决定表明真正目的为重修或成绩改变→NOT_APPLICABLE 并路由 S02-T08 或对应事项；FALSE：确为普通关窗后 ADD/DROP→PASS_FACT（路由事实）；UNKNOWN：目标不明→NEEDS_MATERIAL/SOURCE_UNAVAILABLE。；F014–F017/F023/F026；M001/M005/M006/M007；SRC-001 第 14 条、SRC-002 第 13/18/19 条、SRC-007 第 18/21/27 条；学生澄清及邻接业务 Owner；不在 S02-T07 作重修资格、成绩更正、课程替代决定。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "任课关系与签署身份（L3）",
          "requirement": "R020 任课关系与签署身份（L3）；TRUE：M006 的当期 F016 任课关系、M022 授权签署人与 M016 一致→PASS_FACT（身份）；FALSE：不同教师/班号/学期→CONFLICT；UNKNOWN：仅 OCR 手写名、无法验签→SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION。L1 未到阶段→NOT_APPLICABLE。；F016/F029/F030/F036；M006/M016/M022；SRC-001 第 16 条及附表、SRC-006；任课教师/学校身份审签管理员；本链须先经 R001 证明当期适用。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "任课教师本案意见事实（L3）",
          "requirement": "R021 任课教师本案意见事实（L3）；TRUE：真实有权教师对当前申请版签署且意见清晰→PASS_FACT（教师意见存在，反对意见也照实记）；FALSE：应审而尚无意见→NEEDS_HUMAN_DECISION 并派教师待办；UNKNOWN：意见糊→UNREADABLE，权限未核→SOURCE_UNAVAILABLE。未到 L3→NOT_APPLICABLE。；F030/F036；M016/M022；SRC-001 第 16 条及附表；任课教师；教师同意不等于教务审批，旧程序效力未经确认前不强制此步。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "学生所在学院本案意见事实（L3）",
          "requirement": "R022 学生所在学院本案意见事实（L3）；TRUE：M017/M022 核得有权学院签名、对象和版本→PASS_FACT（学院意见存在）；FALSE：应审尚未签署→NEEDS_HUMAN_DECISION 并派学院；UNKNOWN：转专业前后学院权限不清→POLICY_UNCONFIRMED，印章难辨→UNREADABLE。未到 L3→NOT_APPLICABLE。；F006/F031/F036；M004/M009/M017/M022；SRC-001 第 16 条及附表、SRC-006/009；学院有权签署者；旧学院签名不可自然继承到新学院。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "是否认可逾期特殊申请（L4）",
          "requirement": "R023 是否认可逾期特殊申请（L4）；TRUE：原因、对象、必要前置事实均已查明→仍输出 NEEDS_HUMAN_DECISION 等校方按当期制度作准许/不准许；FALSE：有实质矛盾/缺件→相应 CONFLICT/NEEDS_MATERIAL；UNKNOWN：现行允许例外条件未核→POLICY_UNCONFIRMED。；F010–F026/F032；M001/M003/M005/M008–M012/M014/M015（条件用）；SRC-001/002/003/004/005/007；教务处或被确证授权的决定机关；“特殊”是政策适用和裁量，不由 AI 数值打分批准。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "正式批准/不批准决定真实性（L4）",
          "requirement": "R024 正式批准/不批准决定真实性（L4）；TRUE：M018/M022 证实有权签发者、决定结论、对象、日期、适用办法及申请版本→PASS_FACT（已存在真实决定，附实际结论），不由规则生成 APPROVED；FALSE：核实无决定→NEEDS_HUMAN_DECISION；UNKNOWN：签发权限失联→SOURCE_UNAVAILABLE，错误部门或错版→CONFLICT。L1–L3→NOT_APPLICABLE。；F001/F017/F032/F033/F036；M001/M018/M022；SRC-001 第 16 条（效力待核）、SRC-006/009；当期正式有权决策者；附表“经办人签名”单独不足以推导批准。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "选课名单是否真正变更生效（L5）",
          "requirement": "R025 选课名单是否真正变更生效（L5）；TRUE：M019 受信前后名单确认目标 ADD/DROP 与正式决定同对象→PASS_FACT（系统生效事实）；FALSE：决定存在但名单未变→NEEDS_HUMAN_DECISION/校方执行待办，不报“已生效”；UNKNOWN：系统失联→SOURCE_UNAVAILABLE，决定与名单不符→CONFLICT。未获批准而请求改名单→NOT_APPLICABLE。；F017/F018/F033/F034/F036；M005/M018/M019；SRC-001 第 4/8/15/16 条；教务系统授权操作者；Agent 不能修改正式名单。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "撤回或重提交事实与授权（L6/C09）",
          "requirement": "R026 撤回或重提交事实与授权（L6/C09）；TRUE：有权渠道收到 M020 并有同案受理回执→PASS_FACT（请求存在），实际撤销与否交校方；FALSE：学生未提出撤回→NOT_APPLICABLE，误提交至非授权渠道→待告知；UNKNOWN：撤回前后可否办理、截止日不明→POLICY_UNCONFIRMED，请求图像不可读→UNREADABLE。；F001/F027/F035/F036；M001/M020/M021（受理回执在其产生时）；SRC-001（未含撤回）、SRC-002 第 59 条（仅有限申诉）；原受理机构/有权决策者；撤回申请≠自动撤销已作出的行政决定。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "复核/申诉请求及正式结论（L6/C09）",
          "requirement": "R027 复核/申诉请求及正式结论（L6/C09）；TRUE：确认属于学校受理范围且 M020 与已有决定可追溯、M021 后续由有权机关形成→分别核请求/复核结论 PASS_FACT；FALSE：并非可受理的申诉类型→按权威渠道人工告知、非自动驳回；UNKNOWN：本事项专门救济路径/期限未证→POLICY_UNCONFIRMED，结果未产生→仅待办。；F002/F033/F035/F036；M018/M020/M021/M022；SRC-002 第 59 条、SRC-007 第 70 条、SRC-010 第 81/89/90 条；原业务机关、受理/申诉机构须分别验权；学校章程的一般申诉权不替代本事项适用范围。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "证据替换与关联结论失效（L1–L6）",
          "requirement": "R028 证据替换与关联结论失效（L1–L6）；TRUE：某 M 的目标/关键内容/可信版本改变→标相关 R、旧签署和输出 STALE、按依赖重核；FALSE：仅非判断性展示字段更正→复用不受影响的事实 PASS_FACT；UNKNOWN：版本/哈希缺→CONFLICT/人工确认，不能继承旧审签。；F001/F016/F017/F023–F026/F033–F036；M001/M005/M006/M008–M022；SRC-001 第 16 条（签批对象）、SRC-008（仅技术研究）；案卷/证据管理员与实际签署机构；STALE 为内部效力标记不是第九种结果码。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "多教学班、多次尝试相互隔离（C11）",
          "requirement": "R029 多教学班、多次尝试相互隔离（C11）；TRUE：目标组合键和证据归属一致，每对象单独校验→PASS_FACT（归属）；FALSE：A 班意见复用 B 班、ADD 批复复用 DROP→CONFLICT；UNKNOWN：申请尝试/班号不清→NEEDS_MATERIAL 或校方记录失联→SOURCE_UNAVAILABLE。；F001/F002/F010/F016/F017/F027/F036；M001/M005/M006/M016–M019；SRC-001 第 4/16 条；案卷分案者、教师、教务审批人；并案展示不等于合并审批对象。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "证据可读性、完整性与获取路径（全阶段）",
          "requirement": "R030 证据可读性、完整性与获取路径（全阶段）；TRUE：当前 R 所用证据页/签署/对象可读、版本可追溯→PASS_FACT（仅可供后续核）；FALSE：已提供证据关键区域损坏→UNREADABLE，申请人确需材料未交→NEEDS_MATERIAL；UNKNOWN：权威系统不可达→SOURCE_UNAVAILABLE，政策仅有标题→POLICY_UNCONFIRMED。；F002/F010/F016/F017/F024/F032/F036；M001–M022（以每次触发的实际 M 为范围）；SRC-001、SRC-002、SRC-003、SRC-004、SRC-005、SRC-006、SRC-007、SRC-008、SRC-009、SRC-010（按业务引用，SRC-008 不作政策）；材料持有人/源系统维护者；不把 OCR 能读当成签章有效，也不把未来 M016–M022 当 L1 缺件。。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "l0-window-classify",
      "name": "L0_WINDOW_CLASSIFY · 先取得学期、教学班、当期选课批次及系统是否开放",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l1-application",
      "workflowOwner": "local"
    },
    {
      "id": "l1-application",
      "name": "L1_APPLICATION · 学生按可用制度提交申请信息与理由",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "l2-fact-check",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "l2-fact-check",
      "name": "L2_FACT_CHECK · 核对注册、学籍异动生效状态、课程班号、现选课名单、关联材料、冲突及容量数据",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l3-preapproval",
      "workflowOwner": "local"
    },
    {
      "id": "l3-preapproval",
      "name": "L3_PREAPPROVAL · 如确属当期仍可处理的特殊情形，逐次获取任课教师意见与所在学院意见",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "l4-school-decision",
      "workflowOwner": "local"
    },
    {
      "id": "l4-school-decision",
      "name": "L4_SCHOOL_DECISION · 交教务处等当期有权机构审定",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "l5-roster-effect",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "l5-roster-effect",
      "name": "L5_ROSTER_EFFECT · 如果获有效批准，再核对教务系统选课名单/课表是否实际更改，记录操作人/时间与教学班",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l6-post-decision",
      "workflowOwner": "local"
    },
    {
      "id": "l6-post-decision",
      "name": "L6_POST_DECISION · 后续补件、撤回、更正、复核或申诉按学校授权流程进行",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "human-decision-handoff",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "human-decision-handoff",
      "name": "人工决定待办交接（来自 §10 NEEDS_HUMAN_DECISION；不代表校方签批）",
      "kind": "handoff",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "pass-fact",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "not-applicable",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "needs-material",
      "kind": "supplement-list",
      "audience": "student"
    },
    {
      "id": "conflict",
      "kind": "item-feedback",
      "audience": "teacher"
    },
    {
      "id": "unreadable",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "source-unavailable",
      "kind": "item-feedback",
      "audience": "teacher"
    },
    {
      "id": "policy-unconfirmed",
      "kind": "item-feedback",
      "audience": "teacher"
    },
    {
      "id": "needs-human-decision",
      "kind": "item-feedback",
      "audience": "teacher"
    },
    {
      "id": "fact-review-summary",
      "kind": "item-feedback",
      "audience": "reviewer"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T03:17:00+08:00"
}

/** Research-source provenance is separate from case SourceRef and PolicyVersion. */
export const r02Metadata = {
  "templateId": "S02-T07",
  "name": "逾期补选、退课资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S02-T07.md",
  "sourceDocumentSha256": "7f21e74f7940fa37c6985c96c258efc45761be0583b309f2845b3ea5cb994fa6",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/S02-T07.md",
  "sourceOriginalSha256": "7f21e74f7940fa37c6985c96c258efc45761be0583b309f2845b3ea5cb994fa6",
  "sourceOriginalGitBlobSha": "abaf40ebaf4eb70bbb63e3bbe754658ca0713344",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23",
  "implementationAsOf": "2026-10-24",
  "researchStatus": "RESEARCH_HANDOFF_READY_POLICY_OPEN",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceSummary": "历史校本特殊补退选办法与2025—2026学年通知均有证据；2026—2027学年秋季通知正文及相互适用关系尚未取得有权确认。",
  "relatedTemplateIds": [
    "S01-T01",
    "S01-T04",
    "S02-T01",
    "S02-T02",
    "S02-T03",
    "S02-T04",
    "S02-T05",
    "S02-T06",
    "S02-T08",
    "S02-T09",
    "S02-T10",
    "T01-T08"
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "| SRC-001 / CURRENTITY-UNKNOWN | 成都理工大学教务处：《成都理工大学学生选课管理办法》，第 2–16、17–18 条及第 4 页附表；[官网 PDF](https://aao.cdut.edu.cn/__local/0/FD/0F/3135F978A388AEEF10442AC1944_5B5A90BC_39C55.pdf?e=.pdf) | 制定日期及印发日期在所见 PDF 未载明；第十七条“自印发之日",
      "url": "https://aao.cdut.edu.cn/__local/0/FD/0F/3135F978A388AEEF10442AC1944_5B5A90BC_39C55.pdf?e=.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-002",
      "title": "| SRC-001 / CURRENTITY-UNKNOWN | 成都理工大学教务处：《成都理工大学学生选课管理办法》，第 2–16、17–18 条及第 4 页附表；[官网 PDF](https://aao.cdut.edu.cn/__local/0/FD/0F/3135F978A388AEEF10442AC1944_5B5A90BC_39C55.pdf?e=.pdf) | 制定日期及印发日期在所见 PDF 未载明；第十七条“自印发之日",
      "url": "https://aao.cdut.edu.cn/__local/0/FD/0F/3135F978A388AEEF10442AC1944_5B5A90BC_39C55.pdf?e=.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-003",
      "title": "| SRC-003 / CDUT-VERIFIED | 成都理工大学教务处：《关于2025-2026学年第一学期选课的通知》，第 1–2 页选课时间及注意事项第 3、6、8 项；[官网 PDF](https://aao.cdut.edu.cn/__local/6/67/EF/AAECEED75632BEE85A5022525E6_C666CA13_20EF1.pdf) | 文末 2025-07-01；首轮 2025-09-06—09-1",
      "url": "https://aao.cdut.edu.cn/__local/6/67/EF/AAECEED75632BEE85A5022525E6_C666CA13_20EF1.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-004",
      "title": "| SRC-004 / CDUT-VERIFIED | 成都理工大学教务处：《关于2025-2026学年第二学期选课的通知》，第 1–2 页两轮次与注意事项第 4–7 项；[通知页面](https://aao.cdut.edu.cn/info/1171/6922.htm)、[官网 PDF](https://aao.cdut.edu.cn/__local/2/88/2A/DD110F6D61AA7E588DF250D047D_669C38",
      "url": "https://aao.cdut.edu.cn/info/1171/6922.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-005",
      "title": "| SRC-005 / CURRENTITY-UNKNOWN | 成都理工大学教务处主页教务通知栏：《关于2026-2027学年第一学期选课的通知》；[教务处主页](https://aao.cdut.edu.cn/) | 首页索引显示“06/26”，推测为 2026-06-26，但未取得该条正式正文、准确发布页、附件及校区/年级范围，时限与效力均待核。 | 截至 2026-10-23 仍只核实官网目录存在标题；精确标题与 site:aa",
      "url": "https://aao.cdut.edu.cn/",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-006",
      "title": "| SRC-006 / CDUT-VERIFIED | 成都理工大学教务处：《科室设置》，“教学事务中心”“学籍管理科”工作职责；[官网页面](https://aao.cdut.edu.cn/jgsz/kssz.htm) | 页面未显示所见版本发布日期、生效/废止；检索于 2026-10-22，针对当前教务处分工线索。 | 已核官网检索正文：教学事务中心负责本科学生选课、课表、重修、教务系统；学籍管理科管本科学生学籍。科室分工不等于个人",
      "url": "https://aao.cdut.edu.cn/jgsz/kssz.htm",
      "evidenceStatus": "GENERAL_RESEARCH"
    },
    {
      "id": "SRC-007",
      "title": "| SRC-007 / CDUT-VERIFIED（所用条款正文） | 成都理工大学：《成都理工大学来华留学生管理规定（试行）》（成理校发〔2022〕26号），第十五至十七条、七十至七十二条；[官网 24 页 PDF](https://dbxb.cdut.edu.cn/__local/6/F5/86/E91EEDCF144F4BC5CA934E95F28_8F010406_8B8F6.pdf) | 2022-08-31 印发；2022-",
      "url": "https://dbxb.cdut.edu.cn/__local/6/F5/86/E91EEDCF144F4BC5CA934E95F28_8F010406_8B8F6.pdf",
      "evidenceStatus": "GENERAL_RESEARCH"
    },
    {
      "id": "SRC-008",
      "title": "| SRC-009 / CDUT-VERIFIED | 成都理工大学宜宾校区：《教务工作部部门职责》第一、二部分；[校区官网](https://yb.cdut.edu.cn/info/1091/4509.htm) | 2026-04-10 发布；适用于宜宾校区教务工作部职责，未载明确废止日期，不是具体学生补退课审批办法。 | 已核校区官网正文：负责校区本科学生选课、调课、学籍维护以及休复学等异动的属地办理。仅能用于判断协作与数据来源，不",
      "url": "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json",
      "evidenceStatus": "GENERAL_RESEARCH"
    },
    {
      "id": "SRC-009",
      "title": "| SRC-009 / CDUT-VERIFIED | 成都理工大学宜宾校区：《教务工作部部门职责》第一、二部分；[校区官网](https://yb.cdut.edu.cn/info/1091/4509.htm) | 2026-04-10 发布；适用于宜宾校区教务工作部职责，未载明确废止日期，不是具体学生补退课审批办法。 | 已核校区官网正文：负责校区本科学生选课、调课、学籍维护以及休复学等异动的属地办理。仅能用于判断协作与数据来源，不",
      "url": "https://yb.cdut.edu.cn/info/1091/4509.htm",
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "id": "SRC-010",
      "title": "| SRC-010 / CDUT-VERIFIED | 成都理工大学：《成都理工大学章程》，第 81 条第 6 项、第 89–90 条；[校方章程正文](https://www.cdut.edu.cn/info/1366/7658.htm) | 校方官网正文可核，网页当前展示未直接给出本次引用条款的完整修订沿革和法定核准生效日；本轮只用于权利与救济机构的一般层级，不作选课专项规程。 | 已核正文关键条款：学生享有对学校处理或处分决定提出",
      "url": "https://www.cdut.edu.cn/info/1366/7658.htm",
      "evidenceStatus": "CONTENT_VERIFIED"
    }
  ],
  "criteria": [
    {
      "sectionId": "research-criteria",
      "criterionId": "r001",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r002",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r003",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r004",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r005",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r006",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r007",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r008",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r009",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r010",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r011",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r012",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r013",
      "sourceIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r014",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r015",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r016",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r017",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r018",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r019",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r020",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r021",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r022",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r023",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r024",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r025",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r026",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r027",
      "sourceIds": [
        "SRC-002",
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r028",
      "sourceIds": [
        "SRC-001",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r029",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r030",
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
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const
