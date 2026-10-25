import type { TemplateVersion } from '@profer/shared'

// Mechanical transcription of the matching canonical Markdown's F/M/R tables.
// SRC references are research citations, never live Case SourceRefs.
export const templateVersion: TemplateVersion = {
  "templateId": "S05-T06",
  "version": 1,
  "schemaVersion": 2,
  "name": "学生干部任职、任期履职与工作经历认定审核",
  "description": "本地研究模板 · 非校方正式模板。学生干部任职、任期履职与工作经历认定审核；可核材料事实与流程差异，但具体校本标准、授权签发及最终决定待人工确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 已完成研究的本地资料模板，非成都理工大学正式发布；不得据此自动授予学分、成绩、奖励、干部评价或提案立案。",
  "objectType": "person",
  "displayName": {
    "template": "S05-T06 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · caseId",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F001：caseId 案卷全程 ID；Main 创建一次，L；无法建案则技术中止；不生造业务缺件。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f002",
      "label": "F002 · applicantActorId",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F002：applicantActorId 发起者全程 ID；登录/委托代理认证，H；U/A。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f003",
      "label": "F003 · subjectStudentId",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F003：subjectStudentId 任职人全程 ID；可信学籍/校友映射，H；U；不让 OCR 自证。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f004",
      "label": "F004 · studentLevel",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F004：studentLevel 任命时 enum{本科,硕士,博士,其他}；学籍有效期快照，M；U/P。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f005",
      "label": "F005 · enrollmentInterval",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F005：enrollmentInterval 任命时 [date,date]；学籍历史记录，H；U；历史在读证据替代核实。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f006",
      "label": "F006 · subjectConsentOrBasisRef",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F006：subjectConsentOrBasisRef 处理/代理 ref；合法授权/目的记录，H；N/A，不能未经依据扩大处理。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f007",
      "label": "F007 · organizationId",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F007：organizationId 任期 ID；正式组织目录，M；U/A。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f008",
      "label": "F008 · organizationType",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F008：organizationType 任期 enum{学生会,研究生会,团委兼职,班委,团支委,社团,党支部,其他}；组织名册与版本，M；P/A。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f009",
      "label": "F009 · organizationLevel",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F009：organizationLevel 任期 enum{校,院,系,班,社团,其他}；正式组织目录，L；P/A。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f010",
      "label": "F010 · orgValidityDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F010：orgValidityDecisionRef 任期 ref；组织/社团备案生效决定，M；U；S05-T04 条件引用。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f011",
      "label": "F011 · positionIdAndTitle",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F011：positionIdAndTitle 任期 ID+text；当届岗位设置文件，M；U/A。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f012",
      "label": "F012 · appointmentRoute",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F012：appointmentRoute 任期 enum{选举,任命,聘任,代理,临时,其他}；程序及章程，M；P/A。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f013",
      "label": "F013 · termId",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F013：termId 任期 ID；组织届次/任期主档，M；U/P。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f014",
      "label": "F014 · effectiveStart",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F014：effectiveStart 任期 date；有权任命决定，M；U/A；不从公示日擅自推算。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f015",
      "label": "F015 · plannedEnd",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F015：plannedEnd 任期 date?；当届岗位/任期配置，M；P；初任可能未到期。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f016",
      "label": "F016 · actualEnd",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F016：actualEnd 退出/期满 date?；有权退出/期满事件，M；L，只有退出或证明期末触发。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f017",
      "label": "F017 · appointmentDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F017：appointmentDecisionRef 任期 ref；正式选举/任命/聘任档案，M；N/U/A。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f018",
      "label": "F018 · appointmentState",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F018：appointmentState 任期 enum{候选,拟任,生效,中止,结束,撤销}；任免服务，M；U/A。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f019",
      "label": "F019 · selectionProcessRef",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F019：selectionProcessRef 候选 ref?；选举程序、资格审查，M；L/P：仅候选/程序核实触发。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f020",
      "label": "F020 · roleDutyVersion",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F020：roleDutyVersion 履职 ref；正式岗位职责/届次版本，M；P/A。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f021",
      "label": "F021 · performancePeriod",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F021：performancePeriod 考核 [date,date]；组织考核批次，M；L：未进入考核期。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f022",
      "label": "F022 · performanceEvidenceRefs",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F022：performanceEvidenceRefs 履职 ref[]；工作台账/会议/活动记录，M/H；N；不得只用自述断言。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f023",
      "label": "F023 · assessmentAuthorityId",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F023：assessmentAuthorityId 考核 ID；考核任命/授权名单，M；U/A。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f024",
      "label": "F024 · assessmentOutcome",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F024：assessmentOutcome 考核 enum{优秀,良好,合格,不合格,未评,其他}；有签名考核决定，H；L/U；不得自算等级。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f025",
      "label": "F025 · assessmentDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F025：assessmentDecisionRef 考核 ref；正式评议结果+版本，H；L/U/A。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f026",
      "label": "F026 · earlyExitDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F026：earlyExitDecisionRef 变更 ref?；辞职/免职/离岗正式决定，H；L；有退出争议则 U/A。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f027",
      "label": "F027 · changeOrRenewalRefs",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F027：changeOrRenewalRefs 变更 ref[]；新岗位、新届任命记录，M；L/N。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f028",
      "label": "F028 · attestationPurpose",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F028：attestationPurpose 证明 enum{历史经历,毕业求职,学籍内证明,下游资格引用,其他}；本人申请/校方用途，M；N/P。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f029",
      "label": "F029 · attestationIssuerId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F029：attestationIssuerId 签发 ID?；授权签发主体目录，M；L：签发阶段才需要。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f030",
      "label": "F030 · attestationDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F030：attestationDecisionRef 签发 ref?；有权签名/证明流水，H；L：签发前不是缺件。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f031",
      "label": "F031 · canonicalAppointmentKey",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F031：canonicalAppointmentKey 去重 hash；规范对象合并逻辑/源事件，M；A：不能用姓名+年份代替。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f032",
      "label": "F032 · sourceVersionVector",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F032：sourceVersionVector 全程 map<ref,rev/hash>；各可信记录版本、附件 hash，M；U/A；缓存无来源时不可沿用旧 PASS。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f033",
      "label": "F033 · policyBatch",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F033：policyBatch 全程 ID+dateRange；校本制度批次/组织岗位配置，M；P；不套下游年度推免口径。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f034",
      "label": "F034 · decisionActorAndScope",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F034：decisionActorAndScope 决定 ID+role+scope；主端授权服务，H；U/A；Renderer 一律不可信。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f035",
      "label": "F035 · reviewTargetDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F035：reviewTargetDecisionRef 复核 ref?；既有正式决定与版本，H；L，复核时必需。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f036",
      "label": "F036 · reviewOrWithdrawalEventRef",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F036：reviewOrWithdrawalEventRef 复核/撤回 ref?；签名申请与服务端事件，H；L，事件出现才启用。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "M001 · 主体身份/历史在读；学籍主管可信记录；毕业生档案核验回执替代",
      "purpose": "研究材料槽 M001：主体身份/历史在读；学籍主管可信记录；毕业生档案核验回执替代；B 任职事实核实；绑定 F003+enrollmentVersion；F002–F005 / R002–R003 / SRC-018；源失联 U；本人截图只能补充。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "主体身份/历史在读；学籍主管可信记录；毕业生档案核验回执替代",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "M002 · 组织与岗位合法存在；当届组织岗位表、校团委/学院正式编制、社团换届生效记录",
      "purpose": "研究材料槽 M002：组织与岗位合法存在；当届组织岗位表、校团委/学院正式编制、社团换届生效记录；B 任期；社团条件引用 S05-T04 的批准版本；F007–F011 / R004–R005 / SRC-001,002,014,017；源失联 U；不一致 CONFLICT。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "组织与岗位合法存在；当届组织岗位表、校团委/学院正式编制、社团换届生效记录",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "M003 · 任职产生程序；选举结果/资格审查、推荐审核会议、授权聘任程序",
      "purpose": "研究材料槽 M003：任职产生程序；选举结果/资格审查、推荐审核会议、授权聘任程序；C 候选、选任程序被核时；绑定届次；F012,F019 / R006 / SRC-003,005,014,016；未到选举节点 FUTURE；不清 P。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "任职产生程序；选举结果/资格审查、推荐审核会议、授权聘任程序",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "M004 · 任职生效事实；任命文号、聘书、可信任命数据库记录",
      "purpose": "研究材料槽 M004：任职生效事实；任命文号、聘书、可信任命数据库记录；B 已称“任职”；绑定 person/position/term/issuedVersion；F011,F013,F014,F017,F018 / R007–R010 / SRC-003,005,009；缺 N/U/A；模糊扫描 UNREADABLE。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "任职生效事实；任命文号、聘书、可信任命数据库记录",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "M005 · 拟任/任命公示状态；官网公示/公示结果、异议处理回执",
      "purpose": "研究材料槽 M005：拟任/任命公示状态；官网公示/公示结果、异议处理回执；C 有公示程序时；拟任不得等同生效；F018,F019 / R010 / SRC-004,005；无适用公示环节 L；原站失联 U。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "拟任/任命公示状态；官网公示/公示结果、异议处理回执",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "M006 · 在任岗位职责；正式职责、学年任务书、工作分工备案",
      "purpose": "研究材料槽 M006：在任岗位职责；正式职责、学年任务书、工作分工备案；C 有履职评价时；职责版本要在评价期有效；F020,F021 / R015 / SRC-014,015；无校本职责 P/A。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "在任岗位职责；正式职责、学年任务书、工作分工备案",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "M007 · 个人述职与阶段工作叙述；申请人/工作秘书",
      "purpose": "研究材料槽 M007：个人述职与阶段工作叙述；申请人/工作秘书；C 考核期到达，不能替代正式评分；F021,F022 / R015–R016 / SRC-008,013,014；缺 N；不可读 UNREADABLE。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "个人述职与阶段工作叙述；申请人/工作秘书",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "M008 · 独立履职凭据；会议纪要、项目台账、活动授权角色、工作记录（经核验）",
      "purpose": "研究材料槽 M008：独立履职凭据；会议纪要、项目台账、活动授权角色、工作记录（经核验）；C 对照具体工作事项及日期；每件有 targetId+hash；F020–F022 / R015,R026 / SRC-014；缺 N，职责争议 A。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "独立履职凭据；会议纪要、项目台账、活动授权角色、工作记录（经核验）",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "M009 · 中期/期末述职评议记录；组织考核秘书、有权评价机构",
      "purpose": "研究材料槽 M009：中期/期末述职评议记录；组织考核秘书、有权评价机构；C 应开展该阶段评议时；绑定考核批次/学生评价保护；F021,F023–F025 / R016–R018 / SRC-013,014,015；未到期 FUTURE；无正式结论 U/A。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "中期/期末述职评议记录；组织考核秘书、有权评价机构",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "M010 · 履职合格/等级正式决定；主管组织签名或可信考核台账",
      "purpose": "研究材料槽 M010：履职合格/等级正式决定；主管组织签名或可信考核台账；B 在要求“履职评价已认定”时；仅摘要向下游开放；F023–F025 / R017–R018 / SRC-003,009,010；缺 U/A，不凭自评自动合格。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "履职合格/等级正式决定；主管组织签名或可信考核台账",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "M011 · 变更、续任、新任记录；旧/新组织档案",
      "purpose": "研究材料槽 M011：变更、续任、新任记录；旧/新组织档案；C 变更、连任、跨届；分离对象版本；F013–F018,F027 / R011–R012 / SRC-001,002,020；缺 N/U。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "变更、续任、新任记录；旧/新组织档案",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "M012 · 提前退出/解聘/暂停与交接记录；原组织/有权管理者",
      "purpose": "研究材料槽 M012：提前退出/解聘/暂停与交接记录；原组织/有权管理者；C 早退/处分导致岗位终止；只看有权生效决定；F016,F018,F026 / R019–R020 / SRC-003,015,021；有争议 A；未发生 L。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "提前退出/解聘/暂停与交接记录；原组织/有权管理者",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "M013 · 历史岗位经历证明申请与用途；本人、档案主管",
      "purpose": "研究材料槽 M013：历史岗位经历证明申请与用途；本人、档案主管；C 求职/历史补证、申请授权和身份；签发后才有正式证明；F006,F028,F029 / R023–R025 / SRC-009,018,019；缺 N/P。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "历史岗位经历证明申请与用途；本人、档案主管",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "M014 · 已出具证明、编号/印章/电子签名校验；签发部门",
      "purpose": "研究材料槽 M014：已出具证明、编号/印章/电子签名校验；签发部门；FUTURE 直至签发事件；已签发核真才 B；F029,F030,F032 / R025,R028 / SRC-009,018；未签发 L；伪章冲突 A。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "已出具证明、编号/印章/电子签名校验；签发部门",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "M015 · 重复申报/跨组织比对；历史任免主档及声明（本人声明为补充）",
      "purpose": "研究材料槽 M015：重复申报/跨组织比对；历史任免主档及声明（本人声明为补充）；C 同期多岗、已有认定、跨届申请；F007,F011,F013,F017,F031,F032 / R011,R013,R022,R027 / SRC-002,009,010；源 U/A，不直接拒绝并任。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "重复申报/跨组织比对；历史任免主档及声明（本人声明为补充）",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "M016 · 校本制度/组织授权/任期考核表单当前版本；政策持有部门",
      "purpose": "研究材料槽 M016：校本制度/组织授权/任期考核表单当前版本；政策持有部门；C 需要校本门槛或主管判断时；policyBatch；F008,F012,F020,F023,F029,F033,F034 / R005,R020,R024,R028 / SRC-003,005,006,011；无法核政策 P。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "校本制度/组织授权/任期考核表单当前版本；政策持有部门",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "M017 · 原决定与复核/撤回书面申请、身份认证和新证据；本人+原签发方",
      "purpose": "研究材料槽 M017：原决定与复核/撤回书面申请、身份认证和新证据；本人+原签发方；C 申请撤回/异议，绑定原版本与事由；F002,F035,F036 / R029–R030 / SRC-001,018；缺原决定 U/A；不默认销毁历史事实。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "原决定与复核/撤回书面申请、身份认证和新证据；本人+原签发方",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "M018 · 有权决定、复核结果或正式更正签名及流水；组织主管/受托系统",
      "purpose": "研究材料槽 M018：有权决定、复核结果或正式更正签名及流水；组织主管/受托系统；FUTURE 直至对应正式节点，不提前向学生要签字；F030,F034–F036 / R028–R030 / SRC-014,018；未产生 L；签发权不符 A。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "有权决定、复核结果或正式更正签名及流水；组织主管/受托系统",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "M019 · 源记录校验与证据版本清单；上传系统、校方档案服务",
      "purpose": "研究材料槽 M019：源记录校验与证据版本清单；上传系统、校方档案服务；B 所有事实核验；hash、时间戳、来源、对象与源读权限；F001,F017,F025,F030–F034 / R001,R014,R027 / SRC-001,018；无源 U，不使用旧缓存。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "源记录校验与证据版本清单；上传系统、校方档案服务",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "M020 · 历史纠错依据；原件/档案勘误/授权改正通知",
      "purpose": "研究材料槽 M020：历史纠错依据；原件/档案勘误/授权改正通知；C 更正岗位/起止/考核，保留旧版本；F014–F018,F025,F032,F035 / R021,R030 / SRC-001,018；缺 N/U/A。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "历史纠错依据；原件/档案勘误/授权改正通知",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "appointment",
      "name": "岗位、任命、任期与来源",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "R001 · 路由到“岗位任期经历”而非活动/奖评；所有案卷；F007,F008,F028 / M019 / SRC-001,002",
          "requirement": "R02本地研究检查（非校方政策）：路由到“岗位任期经历”而非活动/奖评；所有案卷；F007,F008,F028 / M019 / SRC-001,002；比对请求目的、对象和 R02 目录。T→PASS_FACT 继续；F→NOT_APPLICABLE 并路由 S05-T01/T04/T05/T07/S03；?→POLICY_UNCONFIRMED 由模板管理员确认。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r002",
          "title": "R002 · 发起人是否有本人或合法代理权；申请/补件/复核；F002,F003,F006 / M001,M013 / SRC-018",
          "requirement": "R02本地研究检查（非校方政策）：发起人是否有本人或合法代理权；申请/补件/复核；F002,F003,F006 / M001,M013 / SRC-018；可信登录人与主体比对/授权验证。T→PASS_FACT；F→NEEDS_HUMAN_DECISION（疑似越权，不显示别人的材料）交身份管理员；?→SOURCE_UNAVAILABLE（授权服务）或 NEEDS_MATERIAL（可补委托）。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r003",
          "title": "R003 · 任职发生时身份是否在适用学籍区间；首次/历史证明；F003–F005,F014 / M001,M004 / SRC-005,009,020",
          "requirement": "R02本地研究检查（非校方政策）：任职发生时身份是否在适用学籍区间；首次/历史证明；F003–F005,F014 / M001,M004 / SRC-005,009,020；将官方学籍区间与任命日交叉比对，并按岗位及批次读取合法例外。T→PASS_FACT；F→CONFLICT（若来源相反）或 NEEDS_HUMAN_DECISION，交学籍主管；?→SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED，不得凭截图拒绝。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r004",
          "title": "R004 · 任职组织当届是否确实存在；首次/社团岗位；F007–F010 / M002 / SRC-002,006,017",
          "requirement": "R02本地研究检查（非校方政策）：任职组织当届是否确实存在；首次/社团岗位；F007–F010 / M002 / SRC-002,006,017；查组织名册、社团备案及有效日。T→PASS_FACT；F→CONFLICT（申请所称组织与生效记录冲突）交组织主管；?→SOURCE_UNAVAILABLE 或 POLICY_UNCONFIRMED。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r005",
          "title": "R005 · 任命机关是否对该岗位该届有权；首次/变更；F007–F013,F033 / M002,M016 / SRC-005,006,014,016,017",
          "requirement": "R02本地研究检查（非校方政策）：任命机关是否对该岗位该届有权；首次/变更；F007–F013,F033 / M002,M016 / SRC-005,006,014,016,017；authorityMatrix[type,level,position,term] 与签发组织比对。T→PASS_FACT；F→NEEDS_HUMAN_DECISION 交原有权机构；?→POLICY_UNCONFIRMED，不能由模型指定主管。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r006",
          "title": "R006 · 候选/选举/遴选程序是否有被要求的阶段记录；C01/C02；F012,F019,F033 / M003 / SRC-003,005,014,016",
          "requirement": "R02本地研究检查（非校方政策）：候选/选举/遴选程序是否有被要求的阶段记录；C01/C02；F012,F019,F033 / M003 / SRC-003,005,014,016；仅对配置明确要求的程序节点核其文号、会议/选举记录。T→PASS_FACT；F→CONFLICT 或 NEEDS_HUMAN_DECISION 交选任单位；?→NEEDS_MATERIAL/POLICY_UNCONFIRMED；未触发→NOT_APPLICABLE。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r007",
          "title": "R007 · 正式任命/聘任决定是否存在并生效；称已任职/证明；F013,F017,F018 / M004 / SRC-003,004,005,009",
          "requirement": "R02本地研究检查（非校方政策）：正式任命/聘任决定是否存在并生效；称已任职/证明；F013,F017,F018 / M004 / SRC-003,004,005,009；验证可信事件 status=effective 与文号/签名；T→PASS_FACT；仅拟任→CONFLICT（若申报已任职）交任命方；缺凭证可补→NEEDS_MATERIAL；源不通→SOURCE_UNAVAILABLE；未任命不自动签经历。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r008",
          "title": "R008 · 任职文件记载的人是否为本申请主体；首次/历史；F003,F017 / M001,M004 / SRC-009,018",
          "requirement": "R02本地研究检查（非校方政策）：任职文件记载的人是否为本申请主体；首次/历史；F003,F017 / M001,M004 / SRC-009,018；比对可信 personId、原始别名/更名前身份链。T→PASS_FACT；F→CONFLICT 交档案核实；?→UNREADABLE（影印）/SOURCE_UNAVAILABLE，不得靠同名判定。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r009",
          "title": "R009 · 所申报职务是否与当届任命岗位一致；首次/更正；F011,F013,F017 / M002,M004 / SRC-005,009,010",
          "requirement": "R02本地研究检查（非校方政策）：所申报职务是否与当届任命岗位一致；首次/更正；F011,F013,F017 / M002,M004 / SRC-005,009,010；比对岗位代码及历史称谓映射。T→PASS_FACT；F→CONFLICT 交任命单位；?→POLICY_UNCONFIRMED（岗位码表）/NEEDS_MATERIAL。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r010",
          "title": "R010 · 开始、计划终止与实际退出日期逻辑且来源相符；首次/届满；F014–F018 / M004,M005,M012 / SRC-003,004,009,020",
          "requirement": "R02本地研究检查（非校方政策）：开始、计划终止与实际退出日期逻辑且来源相符；首次/届满；F014–F018 / M004,M005,M012 / SRC-003,004,009,020；正式生效日优于公示日/申请日，actualEnd >= effectiveStart；T→PASS_FACT；F→CONFLICT；?→SOURCE_UNAVAILABLE 或 POLICY_UNCONFIRMED（确切起算规则）交原任命人。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r011",
          "title": "R011 · 同一组织/同届多岗位是否有分别可追溯任免；兼任、历任；F007,F011,F013,F017,F027 / M011,M015 / SRC-002,009,010",
          "requirement": "R02本地研究检查（非校方政策）：同一组织/同届多岗位是否有分别可追溯任免；兼任、历任；F007,F011,F013,F017,F027 / M011,M015 / SRC-002,009,010；按 appointmentDecisionRef 分组，区分岗位变更和并岗；T→PASS_FACT；复制同一文号作独立任命→CONFLICT；?→NEEDS_MATERIAL/SOURCE_UNAVAILABLE 交档案管理员。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r012",
          "title": "R012 · 续任或跨届是否存在新有权任免；连任；F013–F018,F027 / M011 / SRC-001,002,021",
          "requirement": "R02本地研究检查（非校方政策）：续任或跨届是否存在新有权任免；连任；F013–F018,F027 / M011 / SRC-001,002,021；比对前后届次、原决定及续任决定。T→PASS_FACT；F→CONFLICT（虚接任期）交任命方；?→NEEDS_MATERIAL/POLICY_UNCONFIRMED；无续任诉求→NOT_APPLICABLE。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r013",
          "title": "R013 · 同一申请是否复用已签发的同一任期事实；所有重审/历史；F017,F030,F031 / M015,M019 / SRC-001,002,009",
          "requirement": "R02本地研究检查（非校方政策）：同一申请是否复用已签发的同一任期事实；所有重审/历史；F017,F030,F031 / M015,M019 / SRC-001,002,009；同一 canonical key+源版本命中，T→PASS_FACT 并引用既有结果；F→NOT_APPLICABLE 新记录；模糊并档→NEEDS_HUMAN_DECISION，不可删掉另一组织真实兼任。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r014",
          "title": "R014 · 输入资料是否对应同一目标对象与当前版本；所有事实；F001,F017,F025,F030–F034 / M019 / SRC-001,018",
          "requirement": "R02本地研究检查（非校方政策）：输入资料是否对应同一目标对象与当前版本；所有事实；F001,F017,F025,F030–F034 / M019 / SRC-001,018；每段证据检查 owner/target/sourceVersion/hash/撤销标志。T→PASS_FACT；F→CONFLICT 并撤销旧派生结果；?→SOURCE_UNAVAILABLE/UNREADABLE 交记录管理员。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        }
      ]
    },
    {
      "id": "performance",
      "name": "履职、考核、变更与去重",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r015",
          "title": "R015 · 所述履职活动是否与当期岗位职责关联；中期/末期；F020–F022 / M006–M008 / SRC-008,014,015",
          "requirement": "R02本地研究检查（非校方政策）：所述履职活动是否与当期岗位职责关联；中期/末期；F020–F022 / M006–M008 / SRC-008,014,015；按职责版本、工作日期、实际角色逐件关联，不以组织总活动自动认本人；T→PASS_FACT（有证据的具体活动）；F→CONFLICT；?→NEEDS_MATERIAL/POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION 交指导教师。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r016",
          "title": "R016 · 考核周期是否已到且适用于此岗位；在任/期末；F008,F021,F033 / M007,M009 / SRC-003,013,014,015",
          "requirement": "R02本地研究检查（非校方政策）：考核周期是否已到且适用于此岗位；在任/期末；F008,F021,F033 / M007,M009 / SRC-003,013,014,015；比对考核计划 assessmentDue 与当前阶段。T→PASS_FACT 并启用 M009；未到→NOT_APPLICABLE；?→POLICY_UNCONFIRMED（组织考核计划）交考核秘书。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r017",
          "title": "R017 · 评议人员/机构是否有权出该周期考核；考核阶段；F021,F023,F025 / M009,M010 / SRC-003,013,015,017",
          "requirement": "R02本地研究检查（非校方政策）：评议人员/机构是否有权出该周期考核；考核阶段；F021,F023,F025 / M009,M010 / SRC-003,013,015,017；考核签发方对照 assessmentAuthorityMatrix。T→PASS_FACT；F→NEEDS_HUMAN_DECISION；?→POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE 交主管组织。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r018",
          "title": "R018 · 有效的合格/等级考核事实是否已签发；考核后/申请“履职合格”；F021,F024,F025 / M009,M010 / SRC-003,009,010,013",
          "requirement": "R02本地研究检查（非校方政策）：有效的合格/等级考核事实是否已签发；考核后/申请“履职合格”；F021,F024,F025 / M009,M010 / SRC-003,009,010,013；读取原签发考核决定及版本。T→PASS_FACT 并原样记录等级；证据明确“不合格”→仍可 PASS_FACT 核实该等级事实，不能改写为“任职不存在”；两份等级冲突→CONFLICT；无结果→SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r019",
          "title": "R019 · 是否有有效提前退出/免职或停职事件；拟退出/证明；F016,F018,F026 / M012 / SRC-003,015,021",
          "requirement": "R02本地研究检查（非校方政策）：是否有有效提前退出/免职或停职事件；拟退出/证明；F016,F018,F026 / M012 / SRC-003,015,021；与签名退出决定、实际结束日比对。T→PASS_FACT 确认退出事实；F（学生说退出但无决定）→NEEDS_HUMAN_DECISION；?→SOURCE_UNAVAILABLE；无退出事件→NOT_APPLICABLE。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r020",
          "title": "R020 · 所问用途是否设置有效任期长短/履职标准；出具用途/下游引用；F014–F016,F024,F028,F033 / M004,M010,M012,M016 / SRC-009,010,011,012",
          "requirement": "R02本地研究检查（非校方政策）：所问用途是否设置有效任期长短/履职标准；出具用途/下游引用；F014–F016,F024,F028,F033 / M004,M010,M012,M016 / SRC-009,010,011,012；先取得用途+适用年度学院的阈值，再计算分段、扣除规则（如有）。T→PASS_FACT 仅核“满足该用途事实”；F→PASS_FACT 核实“不满足”并附明细（不否认实际经历）；无已核校本阈值→POLICY_UNCONFIRMED，交该用途主管，绝不全校默认一年。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r021",
          "title": "R021 · 更正请求与旧版任职记录是否有可核差异；纠错；F014–F018,F025,F032,F035 / M020 / SRC-001,018",
          "requirement": "R02本地研究检查（非校方政策）：更正请求与旧版任职记录是否有可核差异；纠错；F014–F018,F025,F032,F035 / M020 / SRC-001,018；比较原版与独立原件，有差异→CONFLICT/NEEDS_HUMAN_DECISION 交原签发方决定纠错；相同→PASS_FACT 表示无需改；?→NEEDS_MATERIAL/SOURCE_UNAVAILABLE。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r022",
          "title": "R022 · 同一任职事实是否重复计作两条经历；重复申报；F017,F031,F032 / M015 / SRC-002,009,010",
          "requirement": "R02本地研究检查（非校方政策）：同一任职事实是否重复计作两条经历；重复申报；F017,F031,F032 / M015 / SRC-002,009,010；同一任免文号+人+岗位+届次+有效版本识别。重复→PASS_FACT 命中既有事实并合并展示，不重复发放新的独立事实记录；非重复→NOT_APPLICABLE；来源不明→NEEDS_HUMAN_DECISION。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        }
      ]
    },
    {
      "id": "attestation",
      "name": "经历证明、边界与复核",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r023",
          "title": "R023 · 经历证明申请用途与必要字段是否完整；历史/证明；F002,F003,F006,F028 / M001,M013 / SRC-009,018,019",
          "requirement": "R02本地研究检查（非校方政策）：经历证明申请用途与必要字段是否完整；历史/证明；F002,F003,F006,F028 / M001,M013 / SRC-009,018,019；身份、用途、接收范围核验。T→PASS_FACT；可补→NEEDS_MATERIAL；用途无合法处理依据→NEEDS_HUMAN_DECISION 交隐私/证明管理员；仅任职初审→NOT_APPLICABLE。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "R024 · 是否把任职事实误作评优、推免、学时直接批准；任何消费出口；F024,F028,F030,F033 / M010,M013,M016 / SRC-001,002,009,010,011",
          "requirement": "R02本地研究检查（非校方政策）：是否把任职事实误作评优、推免、学时直接批准；任何消费出口；F024,F028,F030,F033 / M010,M013,M016 / SRC-001,002,009,010,011；校验消费方独立 template/政策批次，T（有独立决定链）→PASS_FACT（只允许关联）；F→NEEDS_HUMAN_DECISION 阻断越权写奖评；?→POLICY_UNCONFIRMED 由下游主管处理。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "R025 · 经历证明是否已经由合法签发者签发、未撤销；证明完成；F029,F030,F032 / M014 / SRC-009,018",
          "requirement": "R02本地研究检查（非校方政策）：经历证明是否已经由合法签发者签发、未撤销；证明完成；F029,F030,F032 / M014 / SRC-009,018；有签名、编号、对象、用途与现行版本验证 T→PASS_FACT；伪证/撤销→CONFLICT 交签发方；未签发→NOT_APPLICABLE（将来事件）而非伪造完成；签发服务失联→SOURCE_UNAVAILABLE。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "R026 · 跨组织同期任职及履职是否存在具体互斥冲突；多任职；F007,F011,F014–F016,F020–F022 / M008,M015 / SRC-001,002,014",
          "requirement": "R02本地研究检查（非校方政策）：跨组织同期任职及履职是否存在具体互斥冲突；多任职；F007,F011,F014–F016,F020–F022 / M008,M015 / SRC-001,002,014；同期可兼任；仅证据显示时间、岗位职责或来源相互排斥时→CONFLICT 交两个原组织协调；无冲突→PASS_FACT；?→NEEDS_MATERIAL/NEEDS_HUMAN_DECISION，重叠本身不作失败。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "R027 · 文件/评议数据读取与向下游披露是否最小授权；全程；F002,F003,F006,F025,F032,F034 / M015,M019 / SRC-018",
          "requirement": "R02本地研究检查（非校方政策）：文件/评议数据读取与向下游披露是否最小授权；全程；F002,F003,F006,F025,F032,F034 / M015,M019 / SRC-018；ACL+目的+字段白名单+读取日志验证。T→PASS_FACT；越权→NEEDS_HUMAN_DECISION 并停止披露；授权源不通→SOURCE_UNAVAILABLE。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "R028 · 当前签发/任免/考核动作是否由有权服务端 actor 做出；所有正式决定；F029,F030,F034 / M014,M016,M018 / SRC-005,006,014,017,018",
          "requirement": "R02本地研究检查（非校方政策）：当前签发/任免/考核动作是否由有权服务端 actor 做出；所有正式决定；F029,F030,F034 / M014,M016,M018 / SRC-005,006,014,017,018；服务端鉴权与 scope,term,recordVersion、CAS 检查。T→PASS_FACT（权限事实），正式业务决定仍须独立事件；F→NEEDS_HUMAN_DECISION 并拒写；?→POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "R029 · 撤回的是否为可撤回的申请流程，不是抹去已生效任命；撤回；F001,F030,F035,F036 / M017,M018 / SRC-001,018",
          "requirement": "R02本地研究检查（非校方政策）：撤回的是否为可撤回的申请流程，不是抹去已生效任命；撤回；F001,F030,F035,F036 / M017,M018 / SRC-001,018；比对状态、申请主体、已签发版本。T→PASS_FACT 并提交撤回待办；已作决定→NEEDS_HUMAN_DECISION 转正式更正/复核；?→SOURCE_UNAVAILABLE；无撤回→NOT_APPLICABLE。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "R030 · 复核目标、理由、补证和审批权限是否明确；复核；F002,F032,F034–F036 / M017,M018,M020 / SRC-001,014,018",
          "requirement": "R02本地研究检查（非校方政策）：复核目标、理由、补证和审批权限是否明确；复核；F002,F032,F034–F036 / M017,M018,M020 / SRC-001,014,018；绑定目标 decisionId@rev，检查受理时限等若未配置→POLICY_UNCONFIRMED；证据充足→PASS_FACT（可提交给复核者，不是复核胜诉）；证据冲突→CONFLICT；决定由复核机关做；无申请→NOT_APPLICABLE。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "route",
      "name": "事项路由与材料分类",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "facts"
    },
    {
      "id": "facts",
      "name": "逐项事实预审与定向补件",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "policy"
    },
    {
      "id": "policy",
      "name": "政策有效性、争议与权限人工复核",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "nextStageId": "handoff"
    },
    {
      "id": "handoff",
      "name": "向有权办理者交接建议与证据",
      "kind": "handoff",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "feedback",
      "kind": "item-feedback",
      "audience": "student"
    },
    {
      "id": "supplements",
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
  "templateId": "S05-T06",
  "name": "学生干部任职、任期履职与工作经历认定审核",
  "sourceDocPath": "docs/design/review-agent/business-templates/R02/S05-T06.md",
  "sourceDocSha256": "33daf79aea9db9f46d32f6a1b84fe1d57ccc2cb87de19bbc3b55f93ae0a2e8a7",
  "originalResearchPath": "ChatGPT Library:/S05-T06_正式业务模板_MD_v1.0.md",
  "originalResearchSha256": "33daf79aea9db9f46d32f6a1b84fe1d57ccc2cb87de19bbc3b55f93ae0a2e8a7",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
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
    "F036"
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
      "title": "CDUT Studio Review R02《ST-CANDIDATE-MASTER-CATALOG-R02.md》§1/S05 行及范围说明；本地整合 ZIP /00_R02原始范围与规范/",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [],
      "scopeNote": "2026-10-22，研发候选而非学校规则；学生事项；本地全文；GENERAL-RESEARCH/ENG"
    },
    {
      "id": "SRC-002",
      "title": "CDUT Studio Review R02《ST-CATALOG-AUDIT-R02.md》§二 S05-05、§四 G50；同 ZIP",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [],
      "scopeNote": "2026-10-22，项目边界审查；本地全文；GENERAL-RESEARCH/ENG"
    },
    {
      "id": "SRC-003",
      "title": "成都理工大学校团委《关于公开选拔…学生兼职副书记的通知》，§二选拔条件、§五聘任管理（摘要称中期及任期考核）",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://youth.cdut.edu.cn/info/1006/3224.htm"
      ],
      "scopeNote": "2026-03 左右专项遴选；仅校团委兼职副书记；官方索引片段可检索，原站正文 412；CURRENTITY-UNKNOWN/NORM，不可冒充阅读全文"
    },
    {
      "id": "SRC-004",
      "title": "校团委《学生兼职副书记选拔结果公示》，报名、资格审查、面试及拟任公示",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://youth.cdut.edu.cn/info/1006/3231.htm"
      ],
      "scopeNote": "2026 批次特定人选，公示≠任命完成；官方索引可检、原站 412；CURRENTITY-UNKNOWN/OBS"
    },
    {
      "id": "SRC-005",
      "title": "校团委《关于遴选成都理工大学学生会第十六届主席团成员候选人的通知》，组织架构、候选资格及程序",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://youth.cdut.edu.cn/info/1006/3048.htm"
      ],
      "scopeNote": "2025 届主席团候选，不能代表 2026 全校所有岗位；官方索引可检、原站 412；CURRENTITY-UNKNOWN/NORM"
    },
    {
      "id": "SRC-006",
      "title": "《成都理工大学章程》，第二十七条、学生会/学代会条款",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://www.cdut.edu.cn/info/1366/7658.htm"
      ],
      "scopeNote": "已发布校章程，精确修订现行版本待学校核；官方索引可检、原站 412；CURRENTITY-UNKNOWN/NORM"
    },
    {
      "id": "SRC-007",
      "title": "商学院《第十次学生代表大会、第六次研究生代表大会》，工作报告/章程修正说明",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://cc.cdut.edu.cn/info/1042/4370.htm"
      ],
      "scopeNote": "2025-11，学院组织存在性，不等于已拿到签发细则；官方索引可检、原站 412；CURRENTITY-UNKNOWN/OBS"
    },
    {
      "id": "SRC-008",
      "title": "商学院《2025年学生组织年终述职》，各组织工作汇报",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://cc.cdut.edu.cn/info/1042/4368.htm"
      ],
      "scopeNote": "2025-12 学院活动记录；不能代替个人正式考核；官方索引可检、原站 412；CURRENTITY-UNKNOWN/OBS"
    },
    {
      "id": "SRC-009",
      "title": "计算机与网络安全学院（示范性软件学院）2026届推免遴选综合评分细则，PDF第9页备注、第11页附件1-1（0 起索引页8/10）",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://cist.cdut.edu.cn/__local/B/BF/C3/2350FDA2E173CF84B12FDDBC033_D686AA1D_EF94A.pdf"
      ],
      "scopeNote": "2025-09-05 发布，2026届该学院推免；满一年且合格、聘书或公章证明、同组织多岗位只取最高等级是其推免计分条件；官方 PDF 全文可读；CDUT-VERIFIED/NORM，仅该专项届次"
    },
    {
      "id": "SRC-010",
      "title": "机电工程学院推免综合评分表/分级表，PDF第2页（0 起页1）社会工作项、第5页注7",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://mee.cdut.edu.cn/__local/8/31/6B/86085C897703DD5ED6C4D0E3FC8_ED1E90FD_27606.pdf"
      ],
      "scopeNote": "文件披露任职满一年、分管老师证明、同组织最高职务；明载 2027-01 起实施，在 2026-10 尚非当前生效计分口径；官方 PDF 全文可读；CDUT-VERIFIED/NORM-FUTURE，不得现在硬判"
    },
    {
      "id": "SRC-011",
      "title": "机电工程学院2023—2024学年本科学生评优实施细则，优秀学生干部参评年任职及考核条件",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://mee.cdut.edu.cn/info/1049/3014.htm"
      ],
      "scopeNote": "2023–24 年历史评优，荣誉而非任职经历确认；官方检索摘录；原文页面可达性/新版本待核；CURRENTITY-UNKNOWN/NORM-HISTORICAL"
    },
    {
      "id": "SRC-012",
      "title": "生态环境学院2024年推免综合考评规则，任职一年、例外、班长团支书班级异议等条目",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://sthjxy.cdut.edu.cn/info/1013/3157.htm"
      ],
      "scopeNote": "2024年该学院推免，旧批次有不同例外；官方检索摘录；CURRENTITY-UNKNOWN/NORM-HISTORICAL"
    },
    {
      "id": "SRC-013",
      "title": "共青团中央、教育部、全国学联《关于巩固高校学生会（研究生会）改革成果的若干措施》，工作人员述职评议/组织改革条",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.moe.gov.cn/jyb_xxgk/moe_1777/moe_1779/202309/t20230926_1082768.html"
      ],
      "scopeNote": "2023-09 全国高校学生会/研会；每学期述职评议的上位指导，不自动定义个人毕业证明样式；官方搜索原文节录，全文工具打开失败；GENERAL-RESEARCH/NORM"
    },
    {
      "id": "SRC-014",
      "title": "共青团中央、全国学联《加强和改进新时代学联学生会工作实施方案》，§三第8、9项",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.gqt.org.cn/xxgk/tngz_gfxwj/gfxwj/202210/t20221012_789991.htm"
      ],
      "scopeNote": "2022-10，全国学生会组织遴选、培训、述职与评价机制；官方全文网页已读；GENERAL-RESEARCH/NORM"
    },
    {
      "id": "SRC-015",
      "title": "共青团中央《共青团指导学生联合会工作的若干规定（试行）》，第八条",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.gqt.org.cn/xxgk/tngz_gfxwj/other_tngz/202303/t20230328_791559.htm"
      ],
      "scopeNote": "2023-03，学联与其指导的学生会人员遴选、考核、退出；官方全文网页已读；GENERAL-RESEARCH/NORM"
    },
    {
      "id": "SRC-016",
      "title": "全国学联《普通高等学校学生（研究生）代表大会工作规定》，网页注明 2021-05-14 发布，第五、八、十、十二至十五条及提案章",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.gqt.org.cn/tngz/gd/gd_zzgz/202609/t20260909_811392.htm"
      ],
      "scopeNote": "全国学代会/研代会组织及代表提案；网址含 202609 但不等于 2026 版；官方全文网页已读；GENERAL-RESEARCH/NORM"
    },
    {
      "id": "SRC-017",
      "title": "共青团中央、教育部《中国共产主义青年团普通高等学校基层组织工作条例》，第二十二至二十六、三十三条",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.gqt.org.cn/xxgk/tngz_gfxwj/other_tngz/202311/t20231102_794161.htm"
      ],
      "scopeNote": "2024-01-01 施行；团组织/工作骨干管理；官方全文网页已读；GENERAL-RESEARCH/NORM"
    },
    {
      "id": "SRC-018",
      "title": "全国人大常委会《中华人民共和国个人信息保护法》，第六、十三、十七、十九、二十四、二十八至三十条",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.samr.gov.cn/wljys/gzzd/art/2023/art_3ef1e889c1e644d4b65b5f5c7f432386.html"
      ],
      "scopeNote": "2021-11-01 施行；所有处理个人信息者，不授权自动任命；国家市场监管总局转载法律全文已读；GENERAL-RESEARCH/LAW"
    },
    {
      "id": "SRC-019",
      "title": "中国海洋大学化学化工学院《开展学生骨干任职考核》，个人提交、辅导员考核及公示",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://chem.ouc.edu.cn/2025/0827/c5491a504617/page.htm"
      ],
      "scopeNote": "2025-08，仅跨校流程样例；官方搜索摘要；CROSS-SCHOOL-REFERENCE"
    },
    {
      "id": "SRC-020",
      "title": "山东大学经济学院《2025–2026学年团委兼职学生干部选拔》，公示后计任职及退出不认经历",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://www.econ.sdu.edu.cn/info/1263/12998.htm"
      ],
      "scopeNote": "2025–26，仅该校该学院，可启发起算/退出分支；官方搜索摘要；CROSS-SCHOOL-REFERENCE"
    },
    {
      "id": "SRC-021",
      "title": "燕山大学《学生干部队伍管理规定》燕大党发〔2025〕25号，分类管理、期内考核、退出",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://xgc.ysu.edu.cn/info/1323/1406.htm"
      ],
      "scopeNote": "2025，该校制度仅供变体对照；官方搜索摘要；CROSS-SCHOOL-REFERENCE"
    }
  ],
  "criteria": [
    {
      "sectionId": "appointment",
      "criterionId": "r001",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F007",
        "F008",
        "F028"
      ],
      "materialSlotIds": [
        "M019"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "appointment",
      "criterionId": "r002",
      "srcIds": [
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002",
        "F003",
        "F006"
      ],
      "materialSlotIds": [
        "M001",
        "M013"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "appointment",
      "criterionId": "r003",
      "srcIds": [
        "SRC-005",
        "SRC-009",
        "SRC-020"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F003",
        "F004",
        "F005",
        "F014"
      ],
      "materialSlotIds": [
        "M001",
        "M004"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "appointment",
      "criterionId": "r004",
      "srcIds": [
        "SRC-002",
        "SRC-006",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F007",
        "F008",
        "F009",
        "F010"
      ],
      "materialSlotIds": [
        "M002"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "appointment",
      "criterionId": "r005",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-014",
        "SRC-016",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F007",
        "F008",
        "F009",
        "F010",
        "F011",
        "F012",
        "F013",
        "F033"
      ],
      "materialSlotIds": [
        "M002",
        "M016"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "appointment",
      "criterionId": "r006",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-014",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F012",
        "F019",
        "F033"
      ],
      "materialSlotIds": [
        "M003"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "appointment",
      "criterionId": "r007",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F013",
        "F017",
        "F018"
      ],
      "materialSlotIds": [
        "M004"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "appointment",
      "criterionId": "r008",
      "srcIds": [
        "SRC-009",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F003",
        "F017"
      ],
      "materialSlotIds": [
        "M001",
        "M004"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "appointment",
      "criterionId": "r009",
      "srcIds": [
        "SRC-005",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F011",
        "F013",
        "F017"
      ],
      "materialSlotIds": [
        "M002",
        "M004"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "appointment",
      "criterionId": "r010",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-009",
        "SRC-020"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F014",
        "F015",
        "F016",
        "F017",
        "F018"
      ],
      "materialSlotIds": [
        "M004",
        "M005",
        "M012"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "appointment",
      "criterionId": "r011",
      "srcIds": [
        "SRC-002",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F007",
        "F011",
        "F013",
        "F017",
        "F027"
      ],
      "materialSlotIds": [
        "M011",
        "M015"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "appointment",
      "criterionId": "r012",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F013",
        "F014",
        "F015",
        "F016",
        "F017",
        "F018",
        "F027"
      ],
      "materialSlotIds": [
        "M011"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "appointment",
      "criterionId": "r013",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F017",
        "F030",
        "F031"
      ],
      "materialSlotIds": [
        "M015",
        "M019"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "appointment",
      "criterionId": "r014",
      "srcIds": [
        "SRC-001",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F001",
        "F017",
        "F025",
        "F030",
        "F031",
        "F032",
        "F033",
        "F034"
      ],
      "materialSlotIds": [
        "M019"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "performance",
      "criterionId": "r015",
      "srcIds": [
        "SRC-008",
        "SRC-014",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F020",
        "F021",
        "F022"
      ],
      "materialSlotIds": [
        "M006",
        "M007",
        "M008"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "performance",
      "criterionId": "r016",
      "srcIds": [
        "SRC-003",
        "SRC-013",
        "SRC-014",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F008",
        "F021",
        "F033"
      ],
      "materialSlotIds": [
        "M007",
        "M009"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "performance",
      "criterionId": "r017",
      "srcIds": [
        "SRC-003",
        "SRC-013",
        "SRC-015",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F021",
        "F023",
        "F025"
      ],
      "materialSlotIds": [
        "M009",
        "M010"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "performance",
      "criterionId": "r018",
      "srcIds": [
        "SRC-003",
        "SRC-009",
        "SRC-010",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F021",
        "F024",
        "F025"
      ],
      "materialSlotIds": [
        "M009",
        "M010"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "performance",
      "criterionId": "r019",
      "srcIds": [
        "SRC-003",
        "SRC-015",
        "SRC-021"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F016",
        "F018",
        "F026"
      ],
      "materialSlotIds": [
        "M012"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "performance",
      "criterionId": "r020",
      "srcIds": [
        "SRC-009",
        "SRC-010",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F014",
        "F015",
        "F016",
        "F024",
        "F028",
        "F033"
      ],
      "materialSlotIds": [
        "M004",
        "M010",
        "M012",
        "M016"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "performance",
      "criterionId": "r021",
      "srcIds": [
        "SRC-001",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F014",
        "F015",
        "F016",
        "F017",
        "F018",
        "F025",
        "F032",
        "F035"
      ],
      "materialSlotIds": [
        "M020"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "performance",
      "criterionId": "r022",
      "srcIds": [
        "SRC-002",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F017",
        "F031",
        "F032"
      ],
      "materialSlotIds": [
        "M015"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "attestation",
      "criterionId": "r023",
      "srcIds": [
        "SRC-009",
        "SRC-018",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002",
        "F003",
        "F006",
        "F028"
      ],
      "materialSlotIds": [
        "M001",
        "M013"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "attestation",
      "criterionId": "r024",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F024",
        "F028",
        "F030",
        "F033"
      ],
      "materialSlotIds": [
        "M010",
        "M013",
        "M016"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "attestation",
      "criterionId": "r025",
      "srcIds": [
        "SRC-009",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F029",
        "F030",
        "F032"
      ],
      "materialSlotIds": [
        "M014"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "attestation",
      "criterionId": "r026",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F007",
        "F011",
        "F014",
        "F015",
        "F016",
        "F020",
        "F021",
        "F022"
      ],
      "materialSlotIds": [
        "M008",
        "M015"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "attestation",
      "criterionId": "r027",
      "srcIds": [
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002",
        "F003",
        "F006",
        "F025",
        "F032",
        "F034"
      ],
      "materialSlotIds": [
        "M015",
        "M019"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "attestation",
      "criterionId": "r028",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-014",
        "SRC-017",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F029",
        "F030",
        "F034"
      ],
      "materialSlotIds": [
        "M014",
        "M016",
        "M018"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "attestation",
      "criterionId": "r029",
      "srcIds": [
        "SRC-001",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F001",
        "F030",
        "F035",
        "F036"
      ],
      "materialSlotIds": [
        "M017",
        "M018"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "attestation",
      "criterionId": "r030",
      "srcIds": [
        "SRC-001",
        "SRC-014",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002",
        "F032",
        "F034",
        "F035",
        "F036"
      ],
      "materialSlotIds": [
        "M017",
        "M018",
        "M020"
      ],
      "policyOrAuthorityGate": true
    }
  ]
} as const
