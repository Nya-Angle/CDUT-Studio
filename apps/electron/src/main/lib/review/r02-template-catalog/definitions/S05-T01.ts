import type { TemplateVersion } from '@profer/shared'

export type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "S05-T01",
  "version": 1,
  "schemaVersion": 2,
  "name": "第二课堂成绩单与活动学分认定审核",
  "description": "本地研究模板 · 非校方正式模板。第二课堂成绩单与活动学分认定审核；用于材料事实预审、差异提示与人工办理交接，不代替成都理工大学正式制度、授权或决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板是研究交接材料，不是校方正式模板、表单或授权决定；未确认政策必须人工复核，不自动正式通过或拒绝。",
  "objectType": "person",
  "displayName": {
    "template": "{{f001}} · {{f002}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · caseId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F001；caseId:string，CASE",
      "extractionHint": "| `F001` | `caseId:string`，CASE | ST-00 | 系统案卷生成 | M001/案卷头 | P1 | 缺失阻止业务串案，技术待办，不虚构 ID |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f002",
      "label": "F002 · requestType",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F002；requestType:enum，CASE（A–H4）",
      "extractionHint": "| `F002` | `requestType:enum`，CASE（A–H4） | ST-00 | 申请陈述，经分流核对 | M001 事项栏 | P1 | `NM` 澄清办理目的；不是批准条件 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f003",
      "label": "F003 · actorIdentityRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F003；actorIdentityRef:string，CASE",
      "extractionHint": "| `F003` | `actorIdentityRef:string`，CASE | ST-00/05/07 | 可信认证会话＋Host 授权 | 会话审计/M016 | P3 | `NH` 禁止有权限操作；Renderer 值不采信 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f004",
      "label": "F004 · studentStableId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F004；studentStableId:string，STUDENT_CONTEXT",
      "extractionHint": "| `F004` | `studentStableId:string`，STUDENT_CONTEXT | ST-00 | 经授权学籍主数据/SIS | M002 身份定位 | P3 | `SU`/`NH`；不可只按姓名合并 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f005",
      "label": "F005 · legalName",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F005；legalName:string，STUDENT_CONTEXT",
      "extractionHint": "| `F005` | `legalName:string`，STUDENT_CONTEXT | ST-00 | 学籍主数据及合法更名链 | M002/M014 | P2 | 差异 `CF`，人工核实合法更名 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f006",
      "label": "F006 · studyLevelAndStatus",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F006；studyLevelAndStatus:enum，STUDENT_CONTEXT",
      "extractionHint": "| `F006` | `studyLevelAndStatus:enum`，STUDENT_CONTEXT | ST-00 | 学籍主数据 | M002 状态栏 | P2 | `SU`；不推定所有学生适用 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f007",
      "label": "F007 · entryYearOrCohort",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F007；entryYearOrCohort:string，STUDENT_CONTEXT",
      "extractionHint": "| `F007` | `entryYearOrCohort:string`，STUDENT_CONTEXT | ST-00 | 学籍主数据 | M002 入学批次 | P2 | `SU`；不能选择门槛 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f008",
      "label": "F008 · campusCollegeMajor",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F008；campusCollegeMajor:struct，STUDENT_CONTEXT",
      "extractionHint": "| `F008` | `campusCollegeMajor:struct`，STUDENT_CONTEXT | ST-00 | 学籍及培养单位正式记录 | M002/M014 生效版本 | P2 | `SU`/`CF`，保留历史与现状 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f009",
      "label": "F009 · assessmentPeriod",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F009；assessmentPeriod:string，STUDENT_CONTEXT",
      "extractionHint": "| `F009` | `assessmentPeriod:string`，STUDENT_CONTEXT | ST-00 | 当期校本通知/学生申请 | M001/M003 评价期 | P1 | `NM` 澄清，政策窗口仍 `PU` |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f010",
      "label": "F010 · policyProfileId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F010；policyProfileId:string，POLICY_PROFILE",
      "extractionHint": "| `F010` | `policyProfileId:string`，POLICY_PROFILE | ST-00/04 | 校本政策权威发布者 | M003 文号/版本 | P1 | `PU`，不得自填阈值 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f011",
      "label": "F011 · policyEffectiveInterval",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F011；policyEffectiveInterval:dateRange，POLICY_PROFILE",
      "extractionHint": "| `F011` | `policyEffectiveInterval:dateRange`，POLICY_PROFILE | ST-00/04 | 发布/修订/废止链 | M003 原文效力条款 | P1 | `PU`，跨版须人工选有效条款 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f012",
      "label": "F012 · submitterRelationship",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F012；submitterRelationship:enum，CASE",
      "extractionHint": "| `F012` | `submitterRelationship:enum`，CASE | ST-00 | 可信身份关系/合法代理 | M001/M016 | P3 | 非本人时 `NM`/`NH`；代报不等于审批 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f013",
      "label": "F013 · activityProjectId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F013；activityProjectId:string?，ACTIVITY_PROJECT",
      "extractionHint": "| `F013` | `activityProjectId:string?`，ACTIVITY_PROJECT | ST-01 | 校本认可项目库或正式主办方台账 | M004 项目编号 | P1 | 缺 ID 先用时间/主办方定位，仍不明 `NM` |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f014",
      "label": "F014 · sessionId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F014；sessionId:string?，SESSION",
      "extractionHint": "| `F014` | `sessionId:string?`，SESSION | ST-01 | 活动场次台账 | M004 场次/期次 | P1 | 多场冲突 `CF`；无官方 ID 可用复合定位 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f015",
      "label": "F015 · activityNameOrganizer",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F015；activityNameOrganizer:struct，ACTIVITY_PROJECT",
      "extractionHint": "| `F015` | `activityNameOrganizer:struct`，ACTIVITY_PROJECT | ST-01 | 正式活动主办方/项目源 | M004 标题/主办单位 | P0/P1 | `NM` 核活动标的；海报仅辅助 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f016",
      "label": "F016 · activityCategoryCode",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F016；activityCategoryCode:string?，ACTIVITY_PROJECT",
      "extractionHint": "| `F016` | `activityCategoryCode:string?`，ACTIVITY_PROJECT | ST-04 | 校本分类目录/受权项目库 | M003/M004 分类 | P1 | `PU`，不可自设七类或直接照搬外校 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f017",
      "label": "F017 · eventWindow",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F017；eventWindow:dateRange，SESSION",
      "extractionHint": "| `F017` | `eventWindow:dateRange`，SESSION | ST-01 | 项目/场次源、主办方回函 | M004/M005 时间 | P1 | `NM`/`CF`，时区和更期应留版本 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f018",
      "label": "F018 · registrationAttendanceState",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F018；registrationAttendanceState:enum，PARTICIPATION",
      "extractionHint": "| `F018` | `registrationAttendanceState:enum`，PARTICIPATION | ST-01/02 | 活动签到/核销权威记录 | M005 签到签退/名单行 | P2 | `SU` 或合法替代；报名≠到场 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。",
      "options": [
        {
          "value": "ST-01",
          "label": "ST-01"
        },
        {
          "value": "02",
          "label": "02"
        }
      ]
    },
    {
      "key": "f019",
      "label": "F019 · participationRecordId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F019；participationRecordId:string?，PARTICIPATION",
      "extractionHint": "| `F019` | `participationRecordId:string?`，PARTICIPATION | ST-02 | 主办方可信参与台账 | M005 源记录定位 | P2 | 无 ID 可组合定位，不能凭截图当认证 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f020",
      "label": "F020 · completionOrOutcome",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F020；completionOrOutcome:enum/struct，PARTICIPATION",
      "extractionHint": "| `F020` | `completionOrOutcome:enum/struct`，PARTICIPATION | ST-02 | 主办方完成审验/成果证据 | M006 结果栏 | P2 | 未结束 `PENDING_LATER_STAGE`；已结束才 `NM/SU` |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f021",
      "label": "F021 · awardEntryState",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F021；awardEntryState:enum，AWARD_ENTRY",
      "extractionHint": "| `F021` | `awardEntryState:enum`，AWARD_ENTRY | ST-04 | 二课权威授分账/决定回执 | M010/M017 状态 | P2 | `SU`；无记录≠拒绝授分 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f022",
      "label": "F022 · awardQuantityUnit",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F022；awardQuantityUnit:decimal+enum，AWARD_ENTRY",
      "extractionHint": "| `F022` | `awardQuantityUnit:decimal+enum`，AWARD_ENTRY | ST-04 | 正式授分记录＋校本换算政策 | M003/M010/M017 数值单位 | P2 | 缺规则 `PU`，工时不得直接写入学分 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f023",
      "label": "F023 · postedAtAndRevision",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F023；postedAtAndRevision:timestamp+string，AWARD_ENTRY",
      "extractionHint": "| `F023` | `postedAtAndRevision:timestamp+string`，AWARD_ENTRY | ST-04/06 | 权威授分账历史 | M010/M017 记账时间/版次 | P2 | `SU`；缺版次时人工确认旧账效力 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f024",
      "label": "F024 · sourcePlatformCode",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F024；sourcePlatformCode:string，SOURCE",
      "extractionHint": "| `F024` | `sourcePlatformCode:string`，SOURCE | ST-01/02 | 本校指定系统清单/来源声明 | M004/M005 元数据 | P1 | 未确认平台 `PU`；不可默认到梦空间 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f025",
      "label": "F025 · volunteerRecordRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F025；volunteerRecordRef:string，VOLUNTEER_ENTRY",
      "extractionHint": "| `F025` | `volunteerRecordRef:string`，VOLUNTEER_ENTRY | ST-02（E） | 经确认的志愿服务权威记录 | M009 活动/服务号 | P2 | `SU`/条件 `NM`，不擅自生成时长 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f026",
      "label": "F026 · volunteerHours",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F026；volunteerHours:decimal，VOLUNTEER_ENTRY",
      "extractionHint": "| `F026` | `volunteerHours:decimal`，VOLUNTEER_ENTRY | ST-02（E） | 志愿平台或组织正式核实 | M009 工时及单位 | P2 | `SU`/`CF`；本值始终以小时等原单位存 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f027",
      "label": "F027 · externalCertificateRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F027；externalCertificateRef:string，EXTERNAL_CLAIM",
      "extractionHint": "| `F027` | `externalCertificateRef:string`，EXTERNAL_CLAIM | ST-02（C） | 发证单位原始编号/记录 | M008 证书编号/校验页 | P2 | `NM`；无法提供时可由发证方核实替代 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f028",
      "label": "F028 · externalVerificationState",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F028；externalVerificationState:enum，EXTERNAL_CLAIM",
      "extractionHint": "| `F028` | `externalVerificationState:enum`，EXTERNAL_CLAIM | ST-02（C） | 发证方核查结果/官方查询 | M008 验证回执 | P2 | `SU`/`NH`；证书存在≠校本认可活动 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f029",
      "label": "F029 · conflictPointers",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F029；conflictPointers:array，CHANGE_REVIEW",
      "extractionHint": "| `F029` | `conflictPointers:array`，CHANGE_REVIEW | ST-03 | 两份以上带来源记录的比较 | M005/M010/M011 等证据锚点 | P2 | 未发生冲突为 `NA`；发生则 `CF` 指向双方 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f030",
      "label": "F030 · priorLedgerEntryRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F030；priorLedgerEntryRef:string，AWARD_ENTRY",
      "extractionHint": "| `F030` | `priorLedgerEntryRef:string`，AWARD_ENTRY | ST-04/07 | 历史二课账/正式成绩单 | M010 旧记录 ID/页行 | P2 | 声称已有但查不到 `SU`/`NH` |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f031",
      "label": "F031 · adjacentDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F031；adjacentDecisionRef:string，OFFICIAL_DECISION",
      "extractionHint": "| `F031` | `adjacentDecisionRef:string`，OFFICIAL_DECISION | ST-04 | G50/S/T 或教务/活动权威签发主体 | M015 决定号/效力 | P2/P3 | 触发才需；未正式成立则 `NH`，不可自批 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f032",
      "label": "F032 · academicMappingRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F032；academicMappingRef:string?，POLICY_PROFILE",
      "extractionHint": "| `F032` | `academicMappingRef:string?`，POLICY_PROFILE | ST-04（F/G） | 培养方案/教务学分规则 | M003/M014 对应条款 | P2 | `PU`；不得设统一毕业门槛 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f033",
      "label": "F033 · cumulativeValueUnit",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F033；cumulativeValueUnit:decimal+enum?，AWARD_ENTRY",
      "extractionHint": "| `F033` | `cumulativeValueUnit:decimal+enum?`，AWARD_ENTRY | ST-04（A/F） | 有效二课账计算及政策口径 | M010 汇总行＋逐条来源 | P2 | 缺账 `SU`；缺政策 `PU`；不跨单位求和 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f034",
      "label": "F034 · requestedBeforeAfter",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F034；requestedBeforeAfter:struct，CHANGE_REVIEW",
      "extractionHint": "| `F034` | `requestedBeforeAfter:struct`，CHANGE_REVIEW | ST-03/07 | 学生/组织更正申请 | M011 变更项与目标 | P2 | `NM` 精确到活动/记录，不改整批 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f035",
      "label": "F035 · targetDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F035；targetDecisionRef:string?，CHANGE_REVIEW",
      "extractionHint": "| `F035` | `targetDecisionRef:string?`，CHANGE_REVIEW | ST-07（H3） | 既有正式决定库 | M017 原决定 ID | P3 | 有效决定定位失败 `NH`；不得假造 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f036",
      "label": "F036 · changeOrReviewReason",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F036；changeOrReviewReason:text，CHANGE_REVIEW",
      "extractionHint": "| `F036` | `changeOrReviewReason:text`，CHANGE_REVIEW | ST-03/07 | 主张及支持证据 | M011/M016 陈述 | P2 | `NM`；不得凭笼统“不公平”推断项目事实 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f037",
      "label": "F037 · batchIdAndTargetKeys",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F037；batchIdAndTargetKeys:struct?，BATCH",
      "extractionHint": "| `F037` | `batchIdAndTargetKeys:struct?`，BATCH | ST-00/01（H1） | 授权组织提交的清册＋案卷索引 | M012 清册行/批次号 | P3 | 非批量 `NA`；批内每人仍独立匹配 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f038",
      "label": "F038 · decisionActorAuthorityRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F038；decisionActorAuthorityRef:string?，OFFICIAL_DECISION",
      "extractionHint": "| `F038` | `decisionActorAuthorityRef:string?`，OFFICIAL_DECISION | ST-05/07 | Host 认证授权＋正式签批记录 | M017/M019 角色与决定号 | P3 | 后置前 `PENDING_LATER_STAGE`；签批时 `NH` |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f039",
      "label": "F039 · decisionTimeAndSignature",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F039；decisionTimeAndSignature:struct?，OFFICIAL_DECISION",
      "extractionHint": "| `F039` | `decisionTimeAndSignature:struct?`，OFFICIAL_DECISION | ST-05/06 | 可信正式签发/回执 | M017/M019 签发时间/有效性 | P3 | 未到决定阶段不要求；伪印章 `CF/NH` |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f040",
      "label": "F040 · evidenceVersionLinks",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F040；evidenceVersionLinks:array，CHANGE_REVIEW",
      "extractionHint": "| `F040` | `evidenceVersionLinks:array`，CHANGE_REVIEW | ST-01/03/07 | 案卷证据索引、哈希、版本关系 | 各 M 原件 ID/页行/记录版本 | P1/P2 | 无法读取 `UNREADABLE`；补换后仅重审依赖 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f041",
      "label": "F041 · sourceAvailability",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F041；sourceAvailability:enum+timestamp，SOURCE",
      "extractionHint": "| `F041` | `sourceAvailability:enum+timestamp`，SOURCE | ST-02/04 | 实际查询回执、异常/维护通知 | M020 查询日志 | P1 | 失败记 `SU`，不得转成学生未提供 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。",
      "options": [
        {
          "value": "ST-02",
          "label": "ST-02"
        },
        {
          "value": "04",
          "label": "04"
        }
      ]
    },
    {
      "key": "f042",
      "label": "F042 · affectedResultsAndInvalidation",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F042；affectedResultsAndInvalidation:array，CHANGE_REVIEW",
      "extractionHint": "| `F042` | `affectedResultsAndInvalidation:array`，CHANGE_REVIEW | ST-07 | 依赖图与有权决定历史 | M010/M017/M019 版本引用 | P2/P3 | 无旧结果为 `NA`；旧结果受影响时重审但不自动撤销正式决定 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "M001 · 定位请求事项、受影响活动与申请意愿；学生或授权单位；**研究型事项陈述/受理记录**，非已证实的校本制式申请表",
      "purpose": "定位请求事项、受影响活动与申请意愿；学生或授权单位；**研究型事项陈述/受理记录**，非已证实的校本制式申请表；ST-00 `现核`；H2/H3 亦用；当期真实办事系统中的结构化申请、经核实的书面陈述；F001/F002/F009/F012/F034/F036；SRC-006；case＋submitter ver；无目标 `NEEDS_MATERIAL` 澄清，扫描不清 `UNREADABLE`，不得凭格式不符拒件（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "定位请求事项、受影响活动与申请意愿",
        "学生或授权单位",
        "**研究型事项陈述/受理记录**，非已证实的校本制式申请表"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "M002 · 核本人、学籍身份/学段/年级；学籍主数据持有人；可信校方身份回执",
      "purpose": "核本人、学籍身份/学段/年级；学籍主数据持有人；可信校方身份回执；ST-00 `现核`，**系统优先**；经有权学籍部门核实的盖章证明、合法更名链；身份证扫描不能代替校方主数据；F003–F008/F012；SRC-005/009；studentStableId＋状态生效版；源失联 `SOURCE_UNAVAILABLE`，矛盾 `CONFLICT`，不可读纸件 `UNREADABLE`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "核本人、学籍身份/学段/年级",
        "学籍主数据持有人",
        "可信校方身份回执"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "M003 · 选择二课项目、学分/积分和 cohort 适用规则；校本政策发布/管理单位；**有效制度/项目一览表/培养方案条款**",
      "purpose": "选择二课项目、学分/积分和 cohort 适用规则；校本政策发布/管理单位；**有效制度/项目一览表/培养方案条款**；ST-00/04 对**政策判断条件必需**，不由学生提供；官方制度公示、经主管确认的历史版本与修订/废止链；F009–F011/F016/F022/F032；SRC-001/006/008/009；school＋cohort＋生效区间＋文号 ver；无现行原文 `POLICY_UNCONFIRMED`，OCR 不清 `UNREADABLE`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "选择二课项目、学分/积分和 cohort 适用规则",
        "校本政策发布/管理单位",
        "**有效制度/项目一览表/培养方案条款**"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "M004 · 定位活动、场次、举办单位、项目状态；活动记录持有人/主办方；官方项目公告或登记记录",
      "purpose": "定位活动、场次、举办单位、项目状态；活动记录持有人/主办方；官方项目公告或登记记录；ST-01 A–E/H1 `现核/条件`；官方项目库受权查询、主办单位可核回函；宣传海报只辅助定位；F013–F017/F024；SRC-002/006；project＋session＋活动版；无可定位线索 `NEEDS_MATERIAL`，官方库离线 `SOURCE_UNAVAILABLE`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "定位活动、场次、举办单位、项目状态",
        "活动记录持有人/主办方",
        "官方项目公告或登记记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "M005 · 证明某学生参与、签到/签退、实际到场；活动主办方/平台；参与名单与核销日志",
      "purpose": "证明某学生参与、签到/签退、实际到场；活动主办方/平台；参与名单与核销日志；ST-01/02 对 B/D/H1 `条件必需`，A 已入账可复用；主办方签认的参加清册、线下签到原件或正式回函，必要时多源互证；F004/F014/F017–F019/F029/F040；SRC-006；student＋session＋participation ver；未参加与未记录不等同，源离线 `SOURCE_UNAVAILABLE`，文件破损 `UNREADABLE`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "证明某学生参与、签到/签退、实际到场",
        "活动主办方/平台",
        "参与名单与核销日志"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "M006 · 证明活动完成标准、成绩、成果或项目考核；项目负责人/主办方；正式完成记录、结项/获奖证明",
      "purpose": "证明活动完成标准、成绩、成果或项目考核；项目负责人/主办方；正式完成记录、结项/获奖证明；**活动完成以后** ST-02/04 `条件`，报名阶段**后置**；有权主办方经核实的完成名单、有效成果数据库查询；F020/F021/F034/F040；SRC-006；participation＋outcome ver；尚未结束=`PENDING_LATER_STAGE`；已结束缺证 `NEEDS_MATERIAL/SOURCE_UNAVAILABLE`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "证明活动完成标准、成绩、成果或项目考核",
        "项目负责人/主办方",
        "正式完成记录、结项/获奖证明"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "M007 · 辅助说明学生对参加/完成的个人主张；学生持有的证书、邮件、截图、照片",
      "purpose": "辅助说明学生对参加/完成的个人主张；学生持有的证书、邮件、截图、照片；ST-02 B/C `条件`，绝非普遍必交；M005/M006 官方数据、主办方直接回函；F017–F020/F027/F036/F040；SRC-006；student＋project＋原件 hash；自述与权威冲突 `CONFLICT`，模糊 `UNREADABLE`；单独不足以签发学分（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "辅助说明学生对参加/完成的个人主张",
        "学生持有的证书、邮件、截图、照片"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "M008 · 核外部活动/证书真实性与采信；外部发证者及校本受理方；证书原文/官方核验回执",
      "purpose": "核外部活动/证书真实性与采信；外部发证者及校本受理方；证书原文/官方核验回执；ST-02 C `条件必需`；发证单位官网核验、带验证链的电子证书、官方回函；F027/F028/F031/F040；SRC-006/008；issuer＋certificateId＋学生键＋版本；外部源不可达 `SOURCE_UNAVAILABLE`，真伪争议 `NEEDS_HUMAN_DECISION`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "核外部活动/证书真实性与采信",
        "外部发证者及校本受理方",
        "证书原文/官方核验回执"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "M009 · 独立证明志愿工时及服务对象；志愿服务记录持有人；“志愿四川”或**当期校本确认平台**记录",
      "purpose": "独立证明志愿工时及服务对象；志愿服务记录持有人；“志愿四川”或**当期校本确认平台**记录；ST-02 E `条件必需`；**不是二课学分证书**；志愿组织正式时长核实回函、可查验服务日志；不得自填小时；F025/F026/F013/F014/F040；SRC-003/006；volunteerRecord＋student＋服务期 ver；失联 `SOURCE_UNAVAILABLE`，多源工时冲突 `CONFLICT`，不折算二课分（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "独立证明志愿工时及服务对象",
        "志愿服务记录持有人",
        "“志愿四川”或**当期校本确认平台**记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "M010 · 查既有二课积分/学分、成绩单历史及更正前值；权威二课账持有人；正式历史账/受权导出",
      "purpose": "查既有二课积分/学分、成绩单历史及更正前值；权威二课账持有人；正式历史账/受权导出；ST-04 A/B/F/G/H `条件必需`（已有账时）；不强制学生上传；可信后台历史记录、签发方认证的成绩单副本；F021–F023/F030/F033/F035/F042；SRC-006/007；student＋period＋awardEntry ver；取不到 `SOURCE_UNAVAILABLE`，旧记录不当作最新批准（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "查既有二课积分/学分、成绩单历史及更正前值",
        "权威二课账持有人",
        "正式历史账/受权导出"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "M011 · 精确描述漏记、错归属、撤回、版本变动或复核诉求；学生/授权组织；**差错/更正/异议陈述**",
      "purpose": "精确描述漏记、错归属、撤回、版本变动或复核诉求；学生/授权组织；**差错/更正/异议陈述**；ST-03/07 B/H `条件必需`；校本实际申诉系统工单、书面更正申请和系统差异事件；F029/F034–F036/F040/F042；SRC-006/007；case＋targetActivity/decision＋陈述 ver；缺目标 `NEEDS_MATERIAL`，内容不清 `UNREADABLE`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "精确描述漏记、错归属、撤回、版本变动或复核诉求",
        "学生/授权组织",
        "**差错/更正/异议陈述**"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "M012 · H1 分行定位批次受影响学生及活动；被授权组织；批次清册/受权导出",
      "purpose": "H1 分行定位批次受影响学生及活动；被授权组织；批次清册/受权导出；ST-00/01 H1 `条件必需`，不是所有学生必交；受权系统逐人记录＋确定的批次 ID；可通过后台分案；F003/F004/F013–F019/F037/F040；SRC-006；batch＋row＋student＋session＋清册 ver；权限缺 `NEEDS_HUMAN_DECISION`，跨行串案 `CONFLICT`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "H1 分行定位批次受影响学生及活动",
        "被授权组织",
        "批次清册/受权导出"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "M013 · 核历史活动迁移或旧编码到新编码映射；原系统及迁移责任人；签认迁移清单/旧账对照",
      "purpose": "核历史活动迁移或旧编码到新编码映射；原系统及迁移责任人；签认迁移清单/旧账对照；ST-02/04 G1/H4 `条件`；新旧可信系统查询结果、校本批准的迁移回执；F013/F014/F030/F034/F040/F042；SRC-006；oldId→newId 映射 ver；无映射 `NEEDS_HUMAN_DECISION`，不能以名称自动合并（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "核历史活动迁移或旧编码到新编码映射",
        "原系统及迁移责任人",
        "签认迁移清单/旧账对照"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "M014 · 核转专业、休复学、校区与学段身份及培养方案适用；学籍/教务持有人；正式异动与方案记录",
      "purpose": "核转专业、休复学、校区与学段身份及培养方案适用；学籍/教务持有人；正式异动与方案记录；ST-00/04 F/G `条件必需`；可信校方学籍变更链、培养方案及教务确认意见；F005–F011/F032；SRC-004/005/009；student＋旧/新状态的生效时间＋方案 ver；源断 `SOURCE_UNAVAILABLE`，政策争议 `POLICY_UNCONFIRMED`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "核转专业、休复学、校区与学段身份及培养方案适用",
        "学籍/教务持有人",
        "正式异动与方案记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "M015 · 仅引用其他 G50/S/T 活动许可、竞赛/创新学分、志愿记录等**独立有效结论**；相应主管单位持有的正式决定",
      "purpose": "仅引用其他 G50/S/T 活动许可、竞赛/创新学分、志愿记录等**独立有效结论**；相应主管单位持有的正式决定；ST-04 C/F/特殊活动 `条件`；授权决定服务回执、正式文号可核查副本；F031/F040；SRC-004/011；decisionId＋对象＋效力版；不存在不代签，标 `NEEDS_HUMAN_DECISION`，不可读 `UNREADABLE`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "仅引用其他 G50/S/T 活动许可、竞赛/创新学分、志愿记录等**独立有效结论**",
        "相应主管单位持有的正式决定"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "M016 · 证明非本人代报/批量办理/撤回的代理权或岗位授权；本人/学校人事授权持有人；可验证委托或职务授权",
      "purpose": "证明非本人代报/批量办理/撤回的代理权或岗位授权；本人/学校人事授权持有人；可验证委托或职务授权；ST-00/07 非本人 `条件必需`；已认证岗位权限、明确业务范围的电子委托/可信授权记录；F003/F012/F035/F037/F038；SRC-006；grantor＋agent＋scope＋有效期 ver；权限缺 `NEEDS_HUMAN_DECISION`，截图不能赋权（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "证明非本人代报/批量办理/撤回的代理权或岗位授权",
        "本人/学校人事授权持有人",
        "可验证委托或职务授权"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "M017 · 证明**正式**二课认定、拒绝、更正或原历史认定决定；当期有权签发者；决定文书/权威回执",
      "purpose": "证明**正式**二课认定、拒绝、更正或原历史认定决定；当期有权签发者；决定文书/权威回执；ST-05/06 **后置**；H3 对原案为`已有后置`；可信行政决定库中的有权回执与审核签章校验；F021–F023/F031/F035/F038–F040/F042；SRC-001/006；decisionId＋actor＋effectiveness＋signature ver；未作决定不得索取，旧案不可达 `SOURCE_UNAVAILABLE`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "证明**正式**二课认定、拒绝、更正或原历史认定决定",
        "当期有权签发者",
        "决定文书/权威回执"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "M018 · 正式成绩单出具/最新入账的终态核对；学校指定签发方；电子/纸质成绩单与回写凭据",
      "purpose": "正式成绩单出具/最新入账的终态核对；学校指定签发方；电子/纸质成绩单与回写凭据；ST-06 **后置**；A 若旧单已存在可引用；带校方验证的电子成绩单、权威系统动态状态；F021–F023/F030/F033/F039/F040；SRC-006/007；student＋period＋transcript ver；未签发不要求，内容与决定冲突 `CONFLICT`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "正式成绩单出具/最新入账的终态核对",
        "学校指定签发方",
        "电子/纸质成绩单与回写凭据"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "M019 · 复核机关对原决定作维持/更正/撤销的正式意见；有权复核机构；正式复核决定",
      "purpose": "复核机关对原决定作维持/更正/撤销的正式意见；有权复核机构；正式复核决定；ST-07 H3 **后置**，不得与 M011 申请混同；可验证电子复核回执、签章文书；F034–F039/F042；SRC-006/007；originalDecisionId＋reviewDecisionId＋时间/效力 ver；未完成复核不得要求，缺授权 `NEEDS_HUMAN_DECISION`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "复核机关对原决定作维持/更正/撤销的正式意见",
        "有权复核机构",
        "正式复核决定"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "M020 · 解释数据源失联/接口异常，避免误归责学生；系统管理者；查询日志/维护公告/校方核查记录",
      "purpose": "解释数据源失联/接口异常，避免误归责学生；系统管理者；查询日志/维护公告/校方核查记录；ST-02/04 接口异常 `条件`，**内部生成**；经授权的服务健康回执、主管部门说明；F024/F041/F040；SRC-006；sourceId＋查询时间＋错误码 ver；缺日志保持“不可证明已访问”，不要假称核验成功（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "解释数据源失联/接口异常，避免误归责学生",
        "系统管理者",
        "查询日志/维护公告/校方核查记录"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "identity",
      "name": "主体身份与事项路由",
      "description": "身份、代理、适用范围和请求对象的事实核验。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "R001 · ST-00/07 提交者认证与代理范围",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R001` ST-00/07 提交者认证与代理范围 | T=本人已认证或经核代理；F=不进行受权动作；U=认证/委托未取得 | SRC-006/011；F001/F003/F012；M001/M016 | 校内受信认证会话与授权版本、主体/目标案号/时点比对，L1；提交表中的 `teacher/admin` 不可信 | 无受权动作 F=`NOT_APPLICABLE`；U=`NEEDS_HUMAN_DECISION`，可补合法委托时 `NEEDS_MATERIAL`；下一 Host 可信身份管理员/校方授权岗 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "R002 · ST-00 学生主体唯一归属",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R002` ST-00 学生主体唯一归属 | T=申请指向具体学生；F=纯制度咨询不办理个案；U=学籍无法定位 | SRC-005/009；F004/F005；M002/M014 | 以学籍稳定标识、合法更名链、申请时期为准（L1），与证书学生信息逐项比对，禁止姓名唯一匹配 | 姓名/ID 相悖=`CONFLICT`，学校源未连通=`SOURCE_UNAVAILABLE`，仍无归属=`NEEDS_HUMAN_DECISION`；下一学籍数据持有人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "R003 · ST-00 适用学段与 cohort、政策版",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R003` ST-00 适用学段与 cohort、政策版 | T=学生提出二课认定；F=明确是教务独立课程学分则邻接路由；U=学段政策适用未知 | SRC-001/005/006/008/016；F006–F008/F010/F011；M002/M003/M014 | 核学生的历史学段、专业、入学年与政策有效区间交集；L1 本校政策未取得时不可用 SRC-005 代替二课政策 | U=`POLICY_UNCONFIRMED`，身份源断=`SOURCE_UNAVAILABLE`；下一校团委制度持有人/培养单位 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "R004 · ST-00 办件对象与评价周期",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R004` ST-00 办件对象与评价周期 | T=有查询/补记/复核等明确诉求；F=非二课事项转邻接；U=目的或评价期不明 | SRC-006；F001/F002/F009；M001/M003 | 比对申请记录的事项对象、学期/学年、生效范围，L3 主张仅用于分流，不生成授分事实 | U=`NEEDS_MATERIAL` 澄清对象；政策截止未核=`POLICY_UNCONFIRMED`；下一申请人/受理岗 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "activity-evidence",
      "name": "活动与参与事实",
      "description": "项目、场次、报名、出勤、完成、角色及外部证明核验。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r005",
          "title": "R005 · ST-01 项目真实可定位",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R005` ST-01 项目真实可定位 | T=提到一个活动项目；F=仅 A 类累计无活动级争议时不触发逐活动查证；U=活动 ID 不清 | SRC-006/012/013；F013/F015/F024；M004 | 对照当时项目库或主办方正式记录（L1/L2），用组织者+日期复合检索作线索，不能用海报自动生成认可项目 | 可补定位信息=`NEEDS_MATERIAL`，有权活动台账不可达=`SOURCE_UNAVAILABLE`；下一主办方/项目管理员 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "R006 · ST-04 项目所属二课分类",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R006` ST-04 项目所属二课分类 | T=要求分类/计分；F=仅证实参与不求分类；U=本校类目字典不存在或未确定 | SRC-006/013；F010/F011/F016；M003/M004 | 区分历史媒体列举类别与**当期校本分类编码**，L1 制度+项目记录对应有效时间；不得用国家建议直接填类别 | U=`POLICY_UNCONFIRMED`，项目源自相矛盾=`CONFLICT`；下一校团委政策岗/项目分类负责人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "R007 · ST-01/02 场次及事件时序",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R007` ST-01/02 场次及事件时序 | T=活动有具体场次；F=无需场次的政策查询；U=开始结束或多场归属不明 | SRC-006；F014/F017/F019；M004/M005 | 项目-场次 ID、变更公告、来源时区和举行区间比对（L1/L2），保留调整前后版本 | U=`NEEDS_MATERIAL/CONFLICT` 按来源定；活动未到形成时点只标内部 `PENDING_LATER_STAGE`；下一项目主办方 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "R008 · ST-01/02 报名与出勤事实",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R008` ST-01/02 报名与出勤事实 | T=活动应已举行且申报出勤；F=尚未举行/本案不需出勤；U=签到记录缺失 | SRC-006；F017–F019；M004/M005 | 同学生-场次的报名、签到、签退、核销逐项分离，L1/L2 原始名单优先于个人截图，按事件时间判当期是否应产生 | 未发生=F `NOT_APPLICABLE`，现阶段缺有效参加证=`NEEDS_MATERIAL`，原始源失联=`SOURCE_UNAVAILABLE`，矛盾=`CONFLICT`；下一活动记录持有人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "R009 · ST-02 活动完成或成果事实",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R009` ST-02 活动完成或成果事实 | T=活动完成节点已发生；F=未到完成阶段；U=已结束但评价条件/成果材料不明 | SRC-006；F017/F020；M005/M006 | L1/L2 主办方完成/考核记录与场次、生效时点匹配；签到不自动等于“完成” | F 内部后置；U 源缺=`NEEDS_MATERIAL/SOURCE_UNAVAILABLE`，完成标准不明=`POLICY_UNCONFIRMED`；下一主办方及规则持有人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "R010 · ST-02 证据的个人与成果角色归属",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R010` ST-02 证据的个人与成果角色归属 | T=以多主体文件、获奖作品或个人证明申报；F=仅系统单人记录；U=团队名单不全 | SRC-006/013；F004/F019/F027/F040；M002/M007/M008 | L3 原件/发证者身份名单与 L1 学籍逐成员键比对，区分项目负责人、参与人、获奖者角色，按证书实际颁发日 | 不清=`NEEDS_MATERIAL/NEEDS_HUMAN_DECISION`，人员不符=`CONFLICT`；下一发证者和活动管理员 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "R011 · ST-03/04 同一经历重复或多次有效参加",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R011` ST-03/04 同一经历重复或多次有效参加 | T=存在多个候选参与/授分行；F=只有一条则不触发去重；U=旧活动编码映射缺 | SRC-006；F013/F014/F019/F021–F023/F029；M004/M005/M010 | 比对 stableStudent+project+session+purpose+原始 eventId+版本；只证明存在重复候选，是否允许重复授分需 L1 现行校本条款 | 条目相矛盾=`CONFLICT`，允许次数规则未知=`POLICY_UNCONFIRMED`；下一账持有人/校本政策岗 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "R012 · ST-04 既有账的存在、归属与状态",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R012` ST-04 既有账的存在、归属与状态 | T=查询历史积分、漏记或更正；F=纯报名尚不查授分；U=账不存在或不可查 | SRC-006/007；F021/F023/F030；M010/M017 | L1 官方历史账按学生、活动、期次、入账时间、修订版查；无行和查询失败须分开，旧 M017 只证明其时点决定 | 真实源失联=`SOURCE_UNAVAILABLE`；无行可 `PASS_FACT`“当时未检得账”，绝不能推导拒分；下一账持有人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "R013 · ST-04 数值、单位及账面计算一致",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R013` ST-04 数值、单位及账面计算一致 | T=已有权威授分行；F=尚无授分决定；U=单位缺、跨数据源数值不同 | SRC-006/009；F021–F023/F033；M003/M010/M017 | L1 账/决定的精度、单位、相加口径及历史修订比对；point/credit/hour **不可裸数混加** | 单位冲突=`CONFLICT`，换算无校本依据=`POLICY_UNCONFIRMED`；下一账持有人/制度岗 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "policy-mapping",
      "name": "分类、计量与政策适用",
      "description": "分类、账本、志愿工时映射、累计与毕业边界；未确认政策转人工。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r014",
          "title": "R014 · ST-04 校本计分公式、上限与期限",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R014` ST-04 校本计分公式、上限与期限 | T=请求从事实得出具体学分/累计或逾期结论；F=只核参与事实；U=校本制度文号和生效链缺 | SRC-005/006/008/009；F009–F011/F016/F022；M003/M004/M014 | 必须取 **CDUT 现行、适用 cohort/period 的原文**核类目、公式、单项上限、重复与截止；这些 SRC 无一提供二课具体阈值 | 当前 U 一律=`POLICY_UNCONFIRMED`；即使其他 R PASS 也不授分、不判逾期；下一校团委正式制度解释人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "R015 · ST-02 外部颁发证据的真伪",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R015` ST-02 外部颁发证据的真伪 | T=外部活动/证书提交；F=本校权威活动账且无外证；U=发证者/证书号不明 | SRC-006/008；F027/F028/F040；M007/M008 | L1/L2 发证机构在线验证/正式回函，证书 ID、学生归属与签发时间一致；OCR 字串最多作为检索辅助 | 页/码不可读=`UNREADABLE`，验证源失联=`SOURCE_UNAVAILABLE`，身份不一致=`CONFLICT`；下一发证机构 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "R016 · ST-04 外部经历能否被本校采信",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R016` ST-04 外部经历能否被本校采信 | T=外证真实性得到支持且请求二课认定；F=无外部采信请求；U=本校外部活动目录与证明条件不明 | SRC-006/008；F010/F011/F016/F027/F028/F031；M003/M008/M015 | 分离“外证真实”和“成都理工大学认可”，按现行项目目录/等效性正式认定（L1），他校结果不得直接替代 | U=`POLICY_UNCONFIRMED`，校本个案裁量=`NEEDS_HUMAN_DECISION`；下一校团委授权认定人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "R017 · ST-02 志愿服务时数真实性",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R017` ST-02 志愿服务时数真实性 | T=学生以志愿经历证明参与；F=活动非志愿类；U=服务编号/工时权威记录缺 | SRC-003/006/015；F004/F025/F026；M002/M009 | L1/L2 志愿源/组织方直接核服务日期、参加人、小时单位、签到簿版本；2021 年平台介绍不证明 2026 仍使用相同平台 | 源不可达=`SOURCE_UNAVAILABLE`，工时凭证不可读=`UNREADABLE`，多源冲突=`CONFLICT`；下一志愿记录持有人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "R018 · ST-04 志愿工时映射二课口径",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R018` ST-04 志愿工时映射二课口径 | T=明确请求把志愿事实映射二课成绩；F=仅核志愿工时；U=适用校本转换条款缺 | SRC-003/006/009；F010/F011/F016/F022/F025/F026；M003/M009/M010 | 工时原单位与积分/学分单位严格隔离，只有校本现行公式可做映射，独立权威引用避免双记账 | U=`POLICY_UNCONFIRMED`，不得按 1 小时=1 分猜测；下一二课制度岗、必要时志愿主管 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "R019 · ST-00/04 身份及培养方案变更事实",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R019` ST-00/04 身份及培养方案变更事实 | T=休复学/转专业/学段/校区变更；F=身份期未发生变化；U=学籍变更链不齐 | SRC-005/009；F004/F006–F011/F032；M002/M014 | L1 学籍异动有效日期、旧/新培养方案版本与原课账期间拆分，不以当前学籍覆盖历史身份 | U 源断=`SOURCE_UNAVAILABLE`、历史版缺=`NEEDS_MATERIAL`；规则效力不明=`POLICY_UNCONFIRMED`；下一学籍/培养单位 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "R020 · ST-04 二课累计与教务毕业资格隔离",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R020` ST-04 二课累计与教务毕业资格隔离 | T=提出毕业达标查询/预警；F=普通二课活动核查；U=正式培养方案关联未知 | SRC-004/005/008/009/016；F006/F007/F032/F033；M003/M010/M014/M015 | L1 相关 cohort 培养方案与二课账分渠道验证，分别列单位和正式结论；SRC-005 第 48 条是专业总要求并非二课门槛 | U=`POLICY_UNCONFIRMED`，毕业审查为独立 `NEEDS_HUMAN_DECISION`；下一教务学籍/培养方案归口部门 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "decision-and-change",
      "name": "决定、变更与复核",
      "description": "正式记录、撤回、异议、授权、材料换版及历史迁移的证据核验。",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "r021",
          "title": "R021 · ST-05/07 原正式认定决定的真实性",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R021` ST-05/07 原正式认定决定的真实性 | T=已有决定号需查询/复核；F=决定尚未形成；U=签发主体或历史效力不明 | SRC-001/006/011；F021/F035/F038/F039；M017/M016 | L1 正式记录、签章校验、Host 授权版本与签发时刻一致；照片印章和 OCR 姓名不是认证；原决定更正链应保留 | 签发不可信=`NEEDS_HUMAN_DECISION`、版本矛盾=`CONFLICT`；下一校本决定管理者 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "R022 · ST-06 已签发成绩单与正式账一致",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R022` ST-06 已签发成绩单与正式账一致 | T=确有 M017 后进入签发/入账核对；F=尚无有效认定结论；U=成绩单签发者/版次未知 | SRC-005/006/007；F021–F023/F030/F033/F039；M010/M017/M018 | L1 当时决定、记账、成绩单**按时间序列**逐学生及单位核对；SRC-005 第 58 条是教务学习成绩单，不授权二课成绩单签发 | 尚未正式签发时后置非缺件；两记录冲突=`CONFLICT`、源失联=`SOURCE_UNAVAILABLE`；下一账/成绩单签发持有人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "R023 · ST-03/07 差错或更正请求的明确标的",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R023` ST-03/07 差错或更正请求的明确标的 | T=漏记、错记、复核事实、改材料主张；F=无更正诉求；U=被改对象、前后差异不明 | SRC-006/007；F001/F002/F029/F034/F036/F040；M001/M005/M010/M011 | 请求应包含学生-活动-场次-原记录 ID、旧/新差异、证据版；仅凭一句“不公平”不推断改分 | 目标缺=`NEEDS_MATERIAL`，源与主张冲突=`CONFLICT`；下一学生/主办方或有权更正受理岗 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "R024 · ST-07 撤回主体、对象和阶段门禁",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R024` ST-07 撤回主体、对象和阶段门禁 | T=申请人正式表示撤回；F=未撤回；U=受理时点/允许撤回范围未核 | SRC-006/009；F001/F003/F012/F034–F036；M001/M011/M016/M017 | 先验证 Actor 和原案是否形成有效决定，再查**校本**撤回受理规则；撤回请求≠撤回已生效 | 校本程序未知=`POLICY_UNCONFIRMED`、受权争议=`NEEDS_HUMAN_DECISION`；下一受理人/原决定机关 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "R025 · ST-07 既有决定后异议及复核回执",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R025` ST-07 既有决定后异议及复核回执 | T=明确针对有权原决定提出复核；F=只是初次漏记则 B；U=原决定、复核期限或受理机关未知 | SRC-006/007/009；F029/F034–F036/F038/F039/F042；M010/M011/M017/M019 | L1 原决定 ID/效力与异议要点绑定；M019 是复核结束**之后**形成，不当成申请材料；本科学籍 SRC-005 第 59 条不能直接扩张至二课纠纷 | 复核条件未知=`POLICY_UNCONFIRMED`，实体裁量=`NEEDS_HUMAN_DECISION`；下一有权复核机构待校本确认 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "R026 · ST-00/02 组织批量权限与行隔离",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R026` ST-00/02 组织批量权限与行隔离 | T=组织提交多人清册；F=单个本人申报；U=组织授权或清册行归属不明 | SRC-006/011/014；F003/F004/F012/F037/F040；M002/M012/M016 | L1 授权责任＋L2 清册每行 student/session/record 键，权限按行重新校验；SRC-014 非学校权限证明 | 缺权限=`NEEDS_HUMAN_DECISION`，跨学生串案=`CONFLICT`；下一 Host、组织负责人/校本授权岗 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "R027 · ST-01/03 已到期材料的可读取与证据定位",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R027` ST-01/03 已到期材料的可读取与证据定位 | T=确已提交当前阶段应核材料；F=尚未到形成期或根本无需该材料；U=文件存在但无法解析 | SRC-006/011；F040；M001/M005/M006/M007/M008/M011/M012 | 校验文件 hash、格式、页行/OCR 指针与版本；**OCR 自信度只是可读性信号**，不能确认真假；纸质可转人工直读 | 当前不可读=`UNREADABLE` 指定补清晰件；源系统内部不可读交源持有人；下一材料持有人/校内读取者 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "R028 · ST-02/04 可信数据源可访问性",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R028` ST-02/04 可信数据源可访问性 | T=需从权威源查核且具合法查询资格；F=无相应数据源需要；U=源未接通、查询失败或记录缺 | SRC-006/011；F024/F041；M004/M005/M009/M010/M020 | 保存实际查询时间、认证源、错误码与快照版；没有接口不伪称接口已存在，若通过官方导出/回函成功可替代 | 已尝试且失联=`SOURCE_UNAVAILABLE`，无访问授权=`NEEDS_HUMAN_DECISION`，从未核实源能力=`POLICY_UNCONFIRMED`；下一学校数据管理员 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "R029 · ST-03/07 材料换版后的定向失效",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R029` ST-03/07 材料换版后的定向失效 | T=同一对象有经核新版本且事实发生变化；F=新旧相同或完全无关；U=版本对应/依赖关系缺 | SRC-006/011；F019/F020/F029/F040/F042；M005/M006/M010/M011/M013/M017 | 原件 hash 与 sourceVersion 不覆盖；按 student+session+purpose 建依赖图，仅依赖旧输入的事实核验标 `STALE_RECHECK_REQUIRED`，正式 M017 不自动撤销 | 关系不明=`NEEDS_HUMAN_DECISION`，新旧冲突=`CONFLICT`；下一数据持有人/原决定机关 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "R030 · ST-05 有权人工决定的授权与时序",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R030` ST-05 有权人工决定的授权与时序 | T=前置事实审阅结束并拟形成学校认定；F=仅自动预审不进决策；U=校本最终授权机关或人员缺 | SRC-001/006/011/012；F003/F031/F038/F039；M003/M015/M016/M017 | 真实认证 Actor、委托/岗位授权版本、审批对象范围、时间与签发回执联核；签发后才产生 M017，不信 Renderer actor | 当前不得自主作决定；授权未知=`NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED`；下一校团委/校方正式授权主体 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "R031 · ST-04 邻接 G50/S/T、教务权威结论的引用",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R031` ST-04 邻接 G50/S/T、教务权威结论的引用 | T=本案需要活动安全许可、竞赛/创新学分、综测或志愿等独立事实；F=不依赖邻接；U=决定号/效力不明 | SRC-004/005/006/011；F031/F032；M003/M014/M015 | 只引用邻接决定 `decisionId,issuer,scope,status,version`；G50 技术模板不证明校方已作批准，S03-T01 综测不能被本案代评 | 决定缺=`NEEDS_HUMAN_DECISION`，源失联=`SOURCE_UNAVAILABLE`；下一邻接独立权威持有人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "R032 · ST-02/04 历史迁移、新旧活动编码映射",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R032` ST-02/04 历史迁移、新旧活动编码映射 | T=旧系统活动记录迁移/政策版转换；F=未迁移且稳定主键；U=新旧 ID 对应不明 | SRC-005/006；F008/F013/F014/F030/F034/F040；M010/M013/M014 | 要求来源持有人出具可审计 `oldId/newId + student + session + period + mappingVersion`；活动同名或时间相近不构成映射 | 不明=`NEEDS_HUMAN_DECISION`，版本冲突=`CONFLICT`；下一迁移责任人/原记录持有人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "st-00",
      "name": "ST-00 · 事项分流、身份与规则选择",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "st-01"
    },
    {
      "id": "st-01",
      "name": "ST-01 · 提出/调取项目记录",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "st-02"
    },
    {
      "id": "st-02",
      "name": "ST-02 · 参加/完成事实互证",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "st-03"
    },
    {
      "id": "st-03",
      "name": "ST-03 · 缺口补正与来源冲突处理",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "st-04"
    },
    {
      "id": "st-04",
      "name": "ST-04 · 分类、计量与政策适用",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "st-05"
    },
    {
      "id": "st-05",
      "name": "ST-05 · 有权人工认定/复核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "st-06"
    },
    {
      "id": "st-06",
      "name": "ST-06 · 正式发布、入账、反馈",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "nextStageId": "st-07"
    },
    {
      "id": "st-07",
      "name": "ST-07 · 撤回/异议/复核/变更重审",
      "kind": "handoff",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "review-feedback",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-list",
      "kind": "supplement-list",
      "audience": "student"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

export const r02Metadata = {
  "templateId": "S05-T01",
  "name": "第二课堂成绩单与活动学分认定审核",
  "sourceDocPath": "docs/design/review-agent/business-templates/R02/S05-T01.md",
  "sourceDocSha256": "1c25969b1fd05542d51c2bbca4fe806b3a65a6a08fbace0b4ab0eec2e68301b8",
  "originalResearchPath": "docs/design/review-agent/business-templates/R02/research-original/S05-T01.md",
  "originalResearchSha256": "1c25969b1fd05542d51c2bbca4fe806b3a65a6a08fbace0b4ab0eec2e68301b8",
  "officialSchoolTemplate": false,
  "researchStatus": "POLICY_UNCONFIRMED",
  "policyEvidenceStatus": "UNCONFIRMED",
  "fieldIds": [
    "F001",
    "F002",
    "F003",
    "F004",
    "F005",
    "F006",
    "F007",
    "F008",
    "F009",
    "F010",
    "F011",
    "F012",
    "F013",
    "F014",
    "F015",
    "F016",
    "F017",
    "F018",
    "F019",
    "F020",
    "F021",
    "F022",
    "F023",
    "F024",
    "F025",
    "F026",
    "F027",
    "F028",
    "F029",
    "F030",
    "F031",
    "F032",
    "F033",
    "F034",
    "F035",
    "F036",
    "F037",
    "F038",
    "F039",
    "F040",
    "F041",
    "F042"
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
    "M020"
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "校团委 2026 年职责线索",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://youth.cdut.edu.cn/info/1006/3224.htm"
      ],
      "scopeNote": "校团委 2026 年有二课制度建设工作；**不是 2026 学分细则或批准权限**"
    },
    {
      "id": "SRC-002",
      "title": "2018 年校团委实施方向",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://cist.cdut.edu.cn/info/1145/2605.htm"
      ],
      "scopeNote": "历史实施方向；不是现行办事时限、学分值"
    },
    {
      "id": "SRC-003",
      "title": "志愿服务时长的独立源记录",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://youth.cdut.edu.cn/info/1029/1388.htm"
      ],
      "scopeNote": "当年“志愿四川”参与/工时线索；不是目前所有志愿服务平台或兑换比例"
    },
    {
      "id": "SRC-004",
      "title": "教务处职能分工",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://aao.cdut.edu.cn/jgsz/kssz.htm"
      ],
      "scopeNote": "“创新学分”与毕业审查有教务归口；不是二课成绩单签发人名册"
    },
    {
      "id": "SRC-005",
      "title": "本科生学籍管理制度边界",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://dbxb.cdut.edu.cn/__local/7/B6/E5/006AC04D88A214D1AD8B1F5E540_16B4A5B7_C543C.pdf"
      ],
      "scopeNote": "本科及参照身份、独立创新创业学分、培养方案毕业与教务学习成绩单边界；不规定第二课堂项目积分/最低分"
    },
    {
      "id": "SRC-006",
      "title": "上位制度原文（2018）",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.gqt.org.cn/documents/zqlf/201807/P020180704438215264881.pdf"
      ],
      "scopeNote": "学校可选记录式/学分式/综合式、分层事实审查；没有 CDUT 具体阈值/申诉期限"
    },
    {
      "id": "SRC-007",
      "title": "上位制度原文（2024，大思政）",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.gqt.org.cn/xxgk/tngz_gfxwj/gfxwj/202407/t20240705_796517.htm"
      ],
      "scopeNote": "与综测、评奖等衔接的政策方向；不把这些独立权利转移给 S05-T01"
    },
    {
      "id": "SRC-008",
      "title": "上位制度原文（2024，思政课）",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.gqt.org.cn/xxgk/tngz_gfxwj/gfxwj/202412/t20241226_800981.htm"
      ],
      "scopeNote": "**有条件的**高校可将二课融入培养方案；不能推定 CDUT 已将其普遍列毕业必修"
    },
    {
      "id": "SRC-009",
      "title": "学生管理上位边界",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201702/t20170216_296385.html",
        "https://mee.cdut.edu.cn/info/1033/1104.htm",
        "https://www.moe.gov.cn/jyb_xxgk/xxgk/zhengce/guizhang/"
      ],
      "scopeNote": "具体学分折算需学校制定；不是法定“参与即得分”"
    },
    {
      "id": "SRC-010",
      "title": "外校制度的反例边界",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://news.ustc.edu.cn/info/1055/72977.htm"
      ],
      "scopeNote": "只用于证明高校制度差异；任何分值、系统、流程不得移植"
    },
    {
      "id": "SRC-011",
      "title": "G50 技术目录",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json"
      ],
      "scopeNote": "仅识别可能邻接技术模板；不证明学校正式批准或 V3 已运行"
    },
    {
      "id": "SRC-012",
      "title": "校团委第二课堂工作入口（非积分规范）",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://youth.cdut.edu.cn/zzjg/twjs.htm"
      ],
      "scopeNote": "组织重视第二课堂；不是岗位授权/成绩单签章办法"
    },
    {
      "id": "SRC-013",
      "title": "学校历史二课纳入项目报道（非当期规则）",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://edu.cri.cn/2022-03-08/45087f28-359b-ed60-323b-e241e18fbac2.html"
      ],
      "scopeNote": "曾将社会实践、志愿等活动纳入成绩单用途；不确定 2026 项目目录及分值"
    },
    {
      "id": "SRC-014",
      "title": "2026 年跨校交流的部门线索（非审批授权）",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://xtw.cuit.edu.cn/info/1006/1713.htm"
      ],
      "scopeNote": "成都理工大学青年素质发展中心有对外交流代表；不得与报道中的四川大学二课运营中心或 CDUT 审批人混同"
    },
    {
      "id": "SRC-015",
      "title": "校团委 2025 年青年素质发展中心与志愿管理动态",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://youth.cdut.edu.cn/info/1016/2859.htm"
      ],
      "scopeNote": "青年素质发展中心负责五育活动工作、青协有志愿四川管理工作；不是二课授分授权或 2026 当期规则"
    },
    {
      "id": "SRC-016",
      "title": "研究生学籍与课程学分的独立体系",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://dbxb.cdut.edu.cn/xxgkwz/info/1032/2549.htm"
      ],
      "scopeNote": "研究生按独立学籍和培养方案取得毕业资格，学习成绩单向培养单位申请；不规定二课学分也不证明 2026 后继效力"
    }
  ],
  "criteria": [
    {
      "sectionId": "identity",
      "criterionId": "r001",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F001",
        "F003",
        "F012"
      ],
      "materialSlotIds": [
        "M001",
        "M016"
      ]
    },
    {
      "sectionId": "identity",
      "criterionId": "r002",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F004",
        "F005"
      ],
      "materialSlotIds": [
        "M002",
        "M014"
      ]
    },
    {
      "sectionId": "identity",
      "criterionId": "r003",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F006",
        "F008",
        "F010",
        "F011"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M014"
      ]
    },
    {
      "sectionId": "identity",
      "criterionId": "r004",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F001",
        "F002",
        "F009"
      ],
      "materialSlotIds": [
        "M001",
        "M003"
      ]
    },
    {
      "sectionId": "activity-evidence",
      "criterionId": "r005",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F013",
        "F015",
        "F024"
      ],
      "materialSlotIds": [
        "M004"
      ]
    },
    {
      "sectionId": "activity-evidence",
      "criterionId": "r006",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F010",
        "F011",
        "F016"
      ],
      "materialSlotIds": [
        "M003",
        "M004"
      ]
    },
    {
      "sectionId": "activity-evidence",
      "criterionId": "r007",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F014",
        "F017",
        "F019"
      ],
      "materialSlotIds": [
        "M004",
        "M005"
      ]
    },
    {
      "sectionId": "activity-evidence",
      "criterionId": "r008",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F017",
        "F019"
      ],
      "materialSlotIds": [
        "M004",
        "M005"
      ]
    },
    {
      "sectionId": "activity-evidence",
      "criterionId": "r009",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F017",
        "F020"
      ],
      "materialSlotIds": [
        "M005",
        "M006"
      ]
    },
    {
      "sectionId": "activity-evidence",
      "criterionId": "r010",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F004",
        "F019",
        "F027",
        "F040"
      ],
      "materialSlotIds": [
        "M002",
        "M007",
        "M008"
      ]
    },
    {
      "sectionId": "activity-evidence",
      "criterionId": "r011",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F013",
        "F014",
        "F019",
        "F021",
        "F023",
        "F029"
      ],
      "materialSlotIds": [
        "M004",
        "M005",
        "M010"
      ]
    },
    {
      "sectionId": "activity-evidence",
      "criterionId": "r012",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F021",
        "F023",
        "F030"
      ],
      "materialSlotIds": [
        "M010",
        "M017"
      ]
    },
    {
      "sectionId": "activity-evidence",
      "criterionId": "r013",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F021",
        "F023",
        "F033"
      ],
      "materialSlotIds": [
        "M003",
        "M010",
        "M017"
      ]
    },
    {
      "sectionId": "policy-mapping",
      "criterionId": "r014",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F009",
        "F011",
        "F016",
        "F022"
      ],
      "materialSlotIds": [
        "M003",
        "M004",
        "M014"
      ]
    },
    {
      "sectionId": "policy-mapping",
      "criterionId": "r015",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F027",
        "F028",
        "F040"
      ],
      "materialSlotIds": [
        "M007",
        "M008"
      ]
    },
    {
      "sectionId": "policy-mapping",
      "criterionId": "r016",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F010",
        "F011",
        "F016",
        "F027",
        "F028",
        "F031"
      ],
      "materialSlotIds": [
        "M003",
        "M008",
        "M015"
      ]
    },
    {
      "sectionId": "policy-mapping",
      "criterionId": "r017",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F004",
        "F025",
        "F026"
      ],
      "materialSlotIds": [
        "M002",
        "M009"
      ]
    },
    {
      "sectionId": "policy-mapping",
      "criterionId": "r018",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F010",
        "F011",
        "F016",
        "F022",
        "F025",
        "F026"
      ],
      "materialSlotIds": [
        "M003",
        "M009",
        "M010"
      ]
    },
    {
      "sectionId": "policy-mapping",
      "criterionId": "r019",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F004",
        "F006",
        "F011",
        "F032"
      ],
      "materialSlotIds": [
        "M002",
        "M014"
      ]
    },
    {
      "sectionId": "policy-mapping",
      "criterionId": "r020",
      "srcIds": [
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F006",
        "F007",
        "F032",
        "F033"
      ],
      "materialSlotIds": [
        "M003",
        "M010",
        "M014",
        "M015"
      ]
    },
    {
      "sectionId": "decision-and-change",
      "criterionId": "r021",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F021",
        "F035",
        "F038",
        "F039"
      ],
      "materialSlotIds": [
        "M017",
        "M016"
      ]
    },
    {
      "sectionId": "decision-and-change",
      "criterionId": "r022",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F021",
        "F023",
        "F030",
        "F033",
        "F039"
      ],
      "materialSlotIds": [
        "M017",
        "M010",
        "M018"
      ]
    },
    {
      "sectionId": "decision-and-change",
      "criterionId": "r023",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F001",
        "F002",
        "F029",
        "F034",
        "F036",
        "F040"
      ],
      "materialSlotIds": [
        "M001",
        "M005",
        "M010",
        "M011"
      ]
    },
    {
      "sectionId": "decision-and-change",
      "criterionId": "r024",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F001",
        "F003",
        "F012",
        "F034",
        "F036"
      ],
      "materialSlotIds": [
        "M001",
        "M011",
        "M016",
        "M017"
      ]
    },
    {
      "sectionId": "decision-and-change",
      "criterionId": "r025",
      "srcIds": [
        "SRC-006",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F029",
        "F034",
        "F036",
        "F038",
        "F039",
        "F042"
      ],
      "materialSlotIds": [
        "M010",
        "M011",
        "M017",
        "M019"
      ]
    },
    {
      "sectionId": "decision-and-change",
      "criterionId": "r026",
      "srcIds": [
        "SRC-006",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F003",
        "F004",
        "F012",
        "F037",
        "F040"
      ],
      "materialSlotIds": [
        "M002",
        "M012",
        "M016"
      ]
    },
    {
      "sectionId": "decision-and-change",
      "criterionId": "r027",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F040"
      ],
      "materialSlotIds": [
        "M001",
        "M005",
        "M006",
        "M007",
        "M008",
        "M011",
        "M012"
      ]
    },
    {
      "sectionId": "decision-and-change",
      "criterionId": "r028",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F024",
        "F041"
      ],
      "materialSlotIds": [
        "M004",
        "M005",
        "M009",
        "M010",
        "M020"
      ]
    },
    {
      "sectionId": "decision-and-change",
      "criterionId": "r029",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F019",
        "F020",
        "F029",
        "F040",
        "F042"
      ],
      "materialSlotIds": [
        "M005",
        "M006",
        "M010",
        "M011",
        "M013",
        "M017"
      ]
    },
    {
      "sectionId": "decision-and-change",
      "criterionId": "r030",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F003",
        "F031",
        "F038",
        "F039"
      ],
      "materialSlotIds": [
        "M003",
        "M015",
        "M016",
        "M017"
      ]
    },
    {
      "sectionId": "decision-and-change",
      "criterionId": "r031",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F031",
        "F032"
      ],
      "materialSlotIds": [
        "M003",
        "M014",
        "M015"
      ]
    },
    {
      "sectionId": "decision-and-change",
      "criterionId": "r032",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F008",
        "F013",
        "F014",
        "F030",
        "F034",
        "F040"
      ],
      "materialSlotIds": [
        "M010",
        "M013",
        "M014"
      ]
    }
  ]
} as const
