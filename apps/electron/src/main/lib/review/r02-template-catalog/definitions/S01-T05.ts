import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "S01-T05",
  "version": 1,
  "schemaVersion": 2,
  "name": "跨校转入、转出和转学申请审核",
  "description": "本地研究模板 · 非校方正式模板。用于“跨校转入、转出和转学申请审核”的事实、材料和来源核验；未确认政策条件一律进入本地人工复核，不产生校方正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 非成都理工大学校方正式模板；源文档 docs/design/review-agent/business-templates/R02/S01-T05.md；SHA-256 81645cb6909f7ab8b5fbea4db9f1f1d51732cfabb8da0d1de480ee0b36022643；研究/政策证据状态 PARTIAL。校方现行规则、特殊身份适用及签批权限未完全确认；不得生成校方正式批准/拒绝，不连接学校远端回写。",
  "objectType": "person",
  "displayName": {
    "template": "S01-T05 · 跨校转入、转出和转学申请审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · 申请案卷ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F001。原始定义：申请案卷ID / string | TransferApplication | L0起 | 案卷服务生成 | 本地Case唯一键；M028核关联 | P1 | 未建案不得假定已有官方申请编号。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F001；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F002",
      "label": "F002 · 方向：成理转入",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F002。原始定义：方向：成理转入/转出 / enum | TransferRoute | L0 | 学生主张+学校身份交叉核验 | M001、M003 | P1 | 不明`POLICY_UNCONFIRMED`路线待分流。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F002；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F003",
      "label": "F003 · 原在籍高校",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F003。原始定义：原在籍高校 / schoolRef | TransferRoute | L0–L2 | 原校官方学籍 | M003、M004 | P1 | 与M001冲突则`CONFLICT`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F003；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F004",
      "label": "F004 · 拟转入高校",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F004。原始定义：拟转入高校 / schoolRef | TransferRoute | L0–L3 | 申请人意向、拟转入校后续签发 | M001、M017 | P1 | L1只是意向，不能标已接收。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F004；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F005",
      "label": "F005 · 省内",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F005。原始定义：省内/跨省及省份 / enum+code | TransferRoute | L0、L5 | 两校官方所在地/省级办理文件 | M003、M020、M021 | P1 | 不明时不得路由到省厅固定路径。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F005；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F006",
      "label": "F006 · 学段与学生类别",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F006。原始定义：学段与学生类别 / enum | StudentIdentity | L0 | 现行学籍/招生身份与来华留学规定 | M002、M003、M014 | P2 | 未确认不得套本科/研究生门槛。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F006；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F007",
      "label": "F007 · 当前办理阶段",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F007。原始定义：当前办理阶段 / enum | TransferApplication | 每次事件 | 官方文件产生时间和有权流程记录 | M001、M015–M023、M028 | P1 | 仅模型推断不改变正式状态；需人工确认。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F007；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F008",
      "label": "F008 · 转学理由类型",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F008。原始定义：转学理由类型 / enum | ReasonEvidence | L0–L1 | 本人签字申请，校方核其性质 | M001、M008–M010 | P2 | 仅口头说明则待申请确认。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F008；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F009",
      "label": "F009 · 正式申请提交",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F009。原始定义：正式申请提交/受理时间 / datetime? | TransferApplication | L1 | 官方收件记录；若无则分开记录本人签署日 | M001、M028 | P1 | 无校方受理证据不得假定已受理。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F009；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F010",
      "label": "F010 · 本人签署与签署日期",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F010。原始定义：本人签署与签署日期 / boolean+date | TransferApplication | L1 | 原始签名申请及身份核对 | M001 | P2 | 未签按当前申请材料缺失，不能代签。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F010；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F011",
      "label": "F011 · 学生正式姓名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F011。原始定义：学生正式姓名 / string | StudentIdentity | L0–L2 | 原校有效学籍/法定证明 | M002、M003 | P2 | 同名不视为同人；更正转G01权威结论。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F011；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F012",
      "label": "F012 · 法定身份证明类型",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F012。原始定义：法定身份证明类型 / enum | StudentIdentity | L0–L2 | 法定证件与原校身份库 | M002、M014 | P2 | 未确认需人工身份核验。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F012；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F013",
      "label": "F013 · 法定证件号码",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F013。原始定义：法定证件号码/受控标识 / sensitiveString | StudentIdentity | L0–L2 | 原件或授权身份源、原校学籍 | M002、M003 | P3 | 不一致`CONFLICT`，严禁全文公开。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F013；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F014",
      "label": "F014 · 原校学号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F014。原始定义：原校学号 / string | Enrollment | L0–L2 | 原校学籍系统 | M003 | P2 | 不独立证明本人身份。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F014；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F015",
      "label": "F015 · 出生日期与申请时年龄",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F015。原始定义：出生日期与申请时年龄 / date+derived | StudentIdentity | L1 | 有权身份证明与收件日期 | M002、M001 | P3 | 未知则监护签字适用性`UNKNOWN`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F015；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F016",
      "label": "F016 · 监护人身份、关系及附签",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F016。原始定义：监护人身份、关系及附签 / structured | TransferApplication | L1条件 | 法定监护权记录、本人申请 | M011、M001 | P3 | 未满18且缺签`NEEDS_MATERIAL`，授权争议转人工。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F016；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F017",
      "label": "F017 · 原校当前学籍状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F017。原始定义：原校当前学籍状态 / enum | Enrollment | L0、L1、L6 | 学籍系统和生效的相邻决定 | M003、M027 | P2 | 系统暂不可连`SOURCE_UNAVAILABLE`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F017；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F018",
      "label": "F018 · 初次注册",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F018。原始定义：初次注册/入学时间 / date | Enrollment | L1–L2 | 原校学籍与录取信息 | M003、M004 | P2 | 不能凭口述推“满一学期”。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F018；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F019",
      "label": "F019 · 预计毕业日期",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F019。原始定义：预计毕业日期/最后学年 / date+enum | Enrollment | L2 | 学籍及培养计划 | M003、M005 | P2 | 学制变动或延期须人工确认。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F019；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F020",
      "label": "F020 · 原校年级、专业、培养单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F020。原始定义：原校年级、专业、培养单位 / structured | Enrollment | L1–L2 | 原校正式记录 | M003、M004 | P2 | 与录取专业不同需校内权威变更链。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F020；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F021",
      "label": "F021 · 招生类型",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F021。原始定义：招生类型/定向等限制属性 / enum | Enrollment | L2 | 原校本科招生/研究生招生主管记录 | M004；研究生可核M012中相应正式招生属性 | P2 | 特殊招生规则存疑`POLICY_UNCONFIRMED`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F021；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F022",
      "label": "F022 · 高考考生号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F022。原始定义：高考考生号 / sensitiveString | ProgramComparison | L2本科 | 省招录/学校录取名册 | M004 | P3 | 无权威号不可用身份证号代造。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F022；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F023",
      "label": "F023 · 高考生源地及改革省份属性",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F023。原始定义：高考生源地及改革省份属性 / code | ProgramComparison | L2本科 | 录取名册、当年省政策 | M004、M007 | P2 | 不明不启动成绩/选科阈值。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F023；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F024",
      "label": "F024 · 原录取年份",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F024。原始定义：原录取年份 / year | ProgramComparison | L2本科 | 录取名册 | M004 | P2 | 冲突转招生部门核证。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F024；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F025",
      "label": "F025 · 学生当年录取",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F025。原始定义：学生当年录取/高考成绩及口径 / decimal+unit | ProgramComparison | L2本科 | 原录取名册、省招录证据 | M004 | P2 | 分数类别/加分口径未知不可直接比较。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F025；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F026",
      "label": "F026 · 拟转入年级、专业",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F026。原始定义：拟转入年级、专业/学科 / structured | TransferRoute | L0意向，L3确认 | M001提出、拟转入院校有权记录确认 | M001、M016、M017 | P1 | 意向版本≠会议批准版本。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F026；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F027",
      "label": "F027 · 拟转入专业相应年",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F027。原始定义：拟转入专业相应年/生源地录取基准 / decimal+provenance | ProgramComparison | L3本科 | 拟转入校招生/档案录取新生名册 | M006 | P2 | 缺原始比对名册则`SOURCE_UNAVAILABLE`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F027；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F028",
      "label": "F028 · 高考改革选科组合与拟专业要求",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F028。原始定义：高考改革选科组合与拟专业要求 / structured | ProgramComparison | L3条件 | 当年官方高考/招生要求和原选科记录 | M007、M004 | P2 | 改革批次不明则`POLICY_UNCONFIRMED`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F028；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F029",
      "label": "F029 · 研究生两校",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F029。原始定义：研究生两校/学科录取控制比较 / structured | ProgramComparison | L3研究生 | 两校研究生招生主管部门记录 | M012 | P2 | 口径或年次不明交研究生院人工判断。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F029；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F030",
      "label": "F030 · 本人陈述的转学理由文本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F030。原始定义：本人陈述的转学理由文本 / text | ReasonEvidence | L1 | 本人签字申请 | M001 | P2 | 缺本人解释时`NEEDS_MATERIAL`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F030；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F031",
      "label": "F031 · 诊断证明机构、等级、病情章、日期",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F031。原始定义：诊断证明机构、等级、病情章、日期/关联 / structured | ReasonEvidence | L1因病 | 二甲以上含二甲医院出具证明、机构核真 | M008 | P3 | 难辨识`UNREADABLE`，真伪存疑转人工。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F031；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F032",
      "label": "F032 · 特殊困难",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F032。原始定义：特殊困难/特别需要证据事实、出证单位 / structured | ReasonEvidence | L1条件 | 有权出证机关与校方签章核验 | M009 | P3 | 足够性为人工裁量，非AI定性。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F032；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F033",
      "label": "F033 · 校方培养条件变化事实与证明",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F033。原始定义：校方培养条件变化事实与证明 / structured | ReasonEvidence | L1/L2条件 | 原校正式证明及省厅协调通知 | M010 | P2 | 申请人无法先取得时交学校待办。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F033；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F034",
      "label": "F034 · 原校审核意见、签发人权限、日期",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F034。原始定义：原校审核意见、签发人权限、日期 / structured | InstitutionalAct | L2 | 原校正式文件/授权签章 | M015 | P2 | 缺有权签发或草稿`NEEDS_HUMAN_DECISION`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F034；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F035",
      "label": "F035 · 拟转入院系集体研究意见",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F035。原始定义：拟转入院系集体研究意见 / structured | InstitutionalAct | L3 | 院系会议纪要与院系章 | M016 | P2 | 缺记载或效力不明不得当校级批准。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F035；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F036",
      "label": "F036 · 拟转入校校长办公会",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F036。原始定义：拟转入校校长办公会/专题会决定 / structured | InstitutionalAct | L3 | 校级会议纪要与学校签章 | M017 | P2 | 不存在/未签发不可推断同意转入。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F036；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F037",
      "label": "F037 · 研究生拟转入专业导师意见",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F037。原始定义：研究生拟转入专业导师意见 / structured | InstitutionalAct | L3研究生 | 导师本人/相关培养单位的有效意见 | M013 | P2 | 缺失为该分支待办，非导师最终审批。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F037；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F038",
      "label": "F038 · 转出校公示起止、页面、异议与结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F038。原始定义：转出校公示起止、页面、异议与结果 / structured | InstitutionalAct | L4 | 转出校正式官网和出具部门 | M018 | P2 | 不可读或期间不足标待校方核验。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F038；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F039",
      "label": "F039 · 拟转入校公示起止、页面、异议与结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F039。原始定义：拟转入校公示起止、页面、异议与结果 / structured | InstitutionalAct | L4 | 拟转入校官网和出具部门 | M019 | P2 | 公示未结束不得标“无异议”。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F039；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F040",
      "label": "F040 · 省转学申请表的两校意见与转入校签字日",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F040。原始定义：省转学申请表的两校意见与转入校签字日 / structured | ProvincialAndRegisterAct | L5 | 学校签章的省内/跨省表 | M020 | P2 | 签字日未核不得自动计算备案期限。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F040；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F041",
      "label": "F041 · 省级备案",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F041。原始定义：省级备案/跨省确认路径、受理/结果 / structured | ProvincialAndRegisterAct | L5 | 四川省厅/转出地/转入地有权部门记录 | M021 | P2 | 提交、受理、确认、备案严格分开。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F041；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F042",
      "label": "F042 · 学信网学籍异动申请和审核结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F042。原始定义：学信网学籍异动申请和审核结果 / structured | ProvincialAndRegisterAct | L6 | 有权学籍系统返回及学校核验 | M022 | P2 | “已提交”不等于“已审核通过”。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F042；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F043",
      "label": "F043 · 撤回请求、受理与效力",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F043。原始定义：撤回请求、受理与效力 / structured | AmendmentAndAppeal | LX | 本人申请及有权机关正式回应 | M025 | P2 | 没有有权回应保持请求待核。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F043；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F044",
      "label": "F044 · 异议",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F044。原始定义：异议/申诉请求、机关、结论 / structured | AmendmentAndAppeal | LX | 正式申诉受理与决定 | M026 | P3 | 不套通用期限；法律路径交人工。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F044；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F045",
      "label": "F045 · 材料原始版本、签发时间、hash及引用链",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F045。原始定义：材料原始版本、签发时间、hash及引用链 / structured | AmendmentAndAppeal | 全过程 | 原始字节、学校公文、可信采集审计记录 | M028及各M来源属性 | P2 | 替换旧版本后依赖事实标失效待审。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F045；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F046",
      "label": "F046 · 相邻G",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F046。原始定义：相邻G/S/T权威决定ID及效力 / reference | AmendmentAndAppeal | L1、LX | 源模板有权决定与当前状态 | M027 | P2 | 不能凭旧截图代替当前权威决定。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F046；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F047",
      "label": "F047 · 转入校接收、报到、就读状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F047。原始定义：转入校接收、报到、就读状态 / structured | ProvincialAndRegisterAct | L6 | 转入校正式接收与学籍/报到记录 | M023、M022 | P2 | 异动未获审核不能先标“已到校接收”。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F047；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F048",
      "label": "F048 · 来华留学身份及涉外特别转学依据状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F048。原始定义：来华留学身份及涉外特别转学依据状态 / structured | StudentIdentity | L0–L3条件 | 护照/国际学生学籍与有权主管文件 | M014 | P3 | 适用政策未核则`POLICY_UNCONFIRMED`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F048；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F049",
      "label": "F049 · 学生在校期间表现鉴定、院系签章及覆盖期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F049。原始定义：学生在校期间表现鉴定、院系签章及覆盖期 / structured | Enrollment | L2核验、L5备案用 | 原校二级院系正式鉴定与签章 | M029 | P2 | L1不能要求学生自制；院系鉴定未形成交原校待办，疑伪`NEEDS_HUMAN_DECISION`。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F049；本地研究字段，不代表校方正式表单或已接通数据接口。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 本人跨校转学真实申请与原因、方向、意向学校",
      "purpose": "本人；签名申请书及学校收件信息；省厅归档版另需教务处章",
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
        "本人；签名申请书及学校收件信息；省厅归档版另需教务处章"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 法定身份、年龄、姓名及证件类型",
      "purpose": "本人持证；校方授权读取身份记录或核验原件",
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
        "本人持证；校方授权读取身份记录或核验原件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 · 原校真实学籍、状态、学号、层次、入学年与专业",
      "purpose": "原校学籍部门/学信网有权核验；正式学籍记录",
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
        "原校学籍部门/学信网有权核验；正式学籍记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 · 本科原招生类型、批次、年份、生源地、入学成绩",
      "purpose": "原校招生/档案部门；原录取新生名册，归档版加招生或档案部门章",
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
        "原校招生/档案部门；原录取新生名册，归档版加招生或档案部门章"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 · 实际在校各学期课程/成绩和学年",
      "purpose": "原校教务或研究生培养管理；各学期正式成绩单，省厅归档版加教务处章",
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
        "原校教务或研究生培养管理；各学期正式成绩单，省厅归档版加教务处章"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 · 本科拟转入专业相应录取基准",
      "purpose": "拟转入校招生/档案部门；相应年、生源地、专业录取新生名册，归档加招生或档案部门章",
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
        "拟转入校招生/档案部门；相应年、生源地、专业录取新生名册，归档加招生或档案部门章"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "M007 · 高考改革省份选考要求与本人选科事实",
      "purpose": "招生主管/当年省招录部门；专业选考要求及考生正式记录",
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
        "招生主管/当年省招录部门；专业选考要求及考生正式记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 · 因病转学理由的规定级别诊断证据",
      "purpose": "本人持有、二级甲等及以上医院签发；含诊断和公章的证明",
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
        "本人持有、二级甲等及以上医院签发；含诊断和公章的证明"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 · 特殊困难/特别需要的具体事实",
      "purpose": "本人说明及相应有权单位证明，按省厅要求校方核章",
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
        "本人说明及相应有权单位证明，按省厅要求校方核章"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 原校培养条件发生变化或学校不能继续培养",
      "purpose": "原校正式说明及必要时省级协调记录",
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
        "原校正式说明及必要时省级协调记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 未满18周岁法定监护人在本人申请上的附签",
      "purpose": "监护人本人签名；监护关系有疑问时由校方核法定关系记录",
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
        "监护人本人签名；监护关系有疑问时由校方核法定关系记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 研究生两校录取控制/学科条件及可核招生属性",
      "purpose": "原校与拟转入校研究生招生部门官方控制/录取记录",
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
        "原校与拟转入校研究生招生部门官方控制/录取记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 · 拟转入专业导师接受/同意证据",
      "purpose": "拟转入专业导师和培养单位；本人有效签名意见",
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
        "拟转入专业导师和培养单位；本人有效签名意见"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 来华留学生身份及其特别程序适用性",
      "purpose": "本人护照、学校国际学生正式学籍；特别制度由主管出具",
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
        "本人护照、学校国际学生正式学籍；特别制度由主管出具"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 原校审查与是否同意转出的有权意见",
      "purpose": "原校学籍主管及学校有权签发部门；正式意见/文件",
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
        "原校学籍主管及学校有权签发部门；正式意见/文件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 拟转入院系集体研究结论",
      "purpose": "拟转入院系；集体研究纪要/正式院系意见",
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
        "拟转入院系；集体研究纪要/正式院系意见"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 · 拟转入校有权校级集体决定",
      "purpose": "拟转入校；校长办公会或专题会议纪要、有效校级决定",
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
        "拟转入校；校长办公会或专题会议纪要、有效校级决定"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "M018 · 原校公示经过、期限与异议结果",
      "purpose": "原校官网公示及主管签发结果/归档",
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
        "原校官网公示及主管签发结果/归档"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "M019 · 拟转入校公示经过、期限与异议结果",
      "purpose": "拟转入校官网公示及主管签发结果/归档",
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
        "拟转入校官网公示及主管签发结果/归档"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "M020 · 对应省内/跨省路径的有权学校签章申请表",
      "purpose": "两校主管机构；省转学申请/备案表及签章日期",
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
        "两校主管机构；省转学申请/备案表及签章日期"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "M021 · 省级备案、跨省确认与受理状态",
      "purpose": "四川省教育厅、相关外省教育主管机关；政务服务办理回执与最终结果",
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
        "四川省教育厅、相关外省教育主管机关；政务服务办理回执与最终结果"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "M022 · 学信网学籍异动提交、审核与实际生效",
      "purpose": "两校学籍主管及学信网授权核验流程",
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
        "两校学籍主管及学信网授权核验流程"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "M023 · 转入学校实际报到/学习接收与权威登记",
      "purpose": "转入校教务/研究生/国际学生学籍部门；正式接收报到记录",
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
        "转入校教务/研究生/国际学生学籍部门；正式接收报到记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "M024 · 补件、替换、事实修订及校方补正历史",
      "purpose": "本人或有权经办；补件请求、提交材料索引、正式更正文件",
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
        "本人或有权经办；补件请求、提交材料索引、正式更正文件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "M025 · 撤回申请与撤回是否获有权确认",
      "purpose": "本人请求；原受理机关/有权决定机关正式回复",
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
        "本人请求；原受理机关/有权决定机关正式回复"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "M026 · 异议、申诉、复查与有权机关答复",
      "purpose": "学生/其他依法可提出者及规定复核机关；申请、受理与结论",
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
        "学生/其他依法可提出者及规定复核机关；申请、受理与结论"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "M027 · 相邻业务已生效权威结论的引用",
      "purpose": "G01、S01-T01/T02/T03及其他正式业务拥有者；决定ID/效力状态",
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
        "G01、S01-T01/T02/T03及其他正式业务拥有者；决定ID/效力状态"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "M028 · 材料、事实与版本审计链",
      "purpose": "案卷服务与可信采集/人工经办记录；非申请材料",
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
        "案卷服务与可信采集/人工经办记录；非申请材料"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "M029 · 在校期间表现鉴定及规定二级院系盖章",
      "purpose": "原校二级院系；正式在校表现鉴定，四川省备案材料需二级院系章",
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
        "原校二级院系；正式在校表现鉴定，四川省备案材料需二级院系章"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules-01",
      "name": "8.2 申请入口、身份、理由与限制事实（R001–R013）",
      "description": "对应源 Markdown 的 08 规则分组；分项内所有结论仅为本地研究预审。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "跨校转学事项和成理方向",
          "requirement": "原稿规则编号/标题：R001 跨校转学事项和成理方向；触发/适用：L0–L1；T=两校不同且一方是成理、申请变更学籍所在校；F=仅转专业/交流或成理无业务角色；U=校别或目的未定；来源、字段及材料关联：SRC-001/003/008；F001–F005；M001/M003；核验要求：以本人申请C的意向与原校学籍A/B比校名、学校代码、省份、方向；拟转入学校L1只是意向；结果与下一步：相符`PASS_FACT`仅路由成立；校别冲突`CONFLICT`；学籍源不通`SOURCE_UNAVAILABLE`→成理相应学籍归口人工分流；F退其他事项",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "本人身份与学籍同一性",
          "requirement": "原稿规则编号/标题：R002 本人身份与学籍同一性；触发/适用：L0–L2；T=已有候选学生和原校记录；F=纯匿名咨询；U=缺法定号或关键记录；来源、字段及材料关联：SRC-001/003/005；F011–F014；M002/M003；核验要求：核正式姓名、法定标识、原校学号、学校标识；有效身份变更仅用M027对应已生效决定，A/B互核；结果与下一步：同人事实`PASS_FACT`；同名异证/新旧姓名无授权链`CONFLICT`；证件模糊`UNREADABLE`→原校身份主管，绝不自动合并",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "学段与身份适用路径",
          "requirement": "原稿规则编号/标题：R003 学段与身份适用路径；触发/适用：L0–L2；T=明确普通本科/硕博/来华留学学历身份；F=不属正式高校学籍转学；U=学段、招生身份冲突；来源、字段及材料关联：SRC-001/003/005/007；F006/F012/F017/F048；M002/M003/M014；核验要求：以有权学籍、招生、护照/国际学生登记A/B交叉核实；身份类别决定规则集合，不由UI传参决定；结果与下一步：路径可核`PASS_FACT`；研究生高考规则及本科导师规则`NOT_APPLICABLE`；涉外细则未核`POLICY_UNCONFIRMED`→本科教务/研究生院/国际学生主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "当前学籍状态及相邻决定",
          "requirement": "原稿规则编号/标题：R004 当前学籍状态及相邻决定；触发/适用：L0–L2、LX；T=查在籍、休学、复学、保留资格或退学效力；F=无触发的相邻状态不需附决定；U=源决定或生效期不明；来源、字段及材料关联：SRC-003/005；F017/F046；M003/M027；核验要求：以当前学籍A与源G01、S01-T01/T02/T03等权威决定ID/版本比对主体、生效日、撤销记录；结果与下一步：一致`PASS_FACT`仅核状态；新旧状态冲突`CONFLICT`；接口断`SOURCE_UNAVAILABLE`→源业务Owner/学籍部门，不在本模板代作复学退学决定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "在校学期、毕业前一年限制",
          "requirement": "原稿规则编号/标题：R005 在校学期、毕业前一年限制；触发/适用：L2；T=普通本硕进入转学资格事实审查；F=L0咨询或非适用涉外制度未核；U=注册学期/毕业计划有争议；来源、字段及材料关联：SRC-001第22条/SRC-002第一部分；F017–F020；M003/M004/M005/M027；核验要求：由原校注册日、学年学期、正式预计毕业与延期决定计算是否落入限制；不能凭“2022级”算精确边界，学期口径/例外有争议核校方；结果与下一步：无已知限制事实`PASS_FACT`；落入不足一学期/毕业前一年标`restriction_detected + NEEDS_HUMAN_DECISION`→原校学籍及拟转入校受理人；记录不全`SOURCE_UNAVAILABLE`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "本人正式申请及校方收件",
          "requirement": "原稿规则编号/标题：R006 本人正式申请及校方收件；触发/适用：L1；T=本人请求正式申请；F=L0仅咨询；U=是否已校方受理不明；来源、字段及材料关联：SRC-001第23条/SRC-002第二部分；F008–F010/F030；M001/M028；核验要求：核本人签名、理由、签署日期；本人签署与校方收件时间分列，归档所需教务处章到L2–L5再查；结果与下一步：签名/理由可核`PASS_FACT`（只说明本人提出）；当前未签`NEEDS_MATERIAL`→本人；受理无权威记录`SOURCE_UNAVAILABLE`→受理部门；不得伪造受理时间",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "未成年监护附签",
          "requirement": "原稿规则编号/标题：R007 未成年监护附签；触发/适用：L1；T=申请时年龄未满18周岁；F=已满18周岁；U=法定出生信息或监护人签字真实性待核；来源、字段及材料关联：SRC-002第二部分；F010/F015/F016；M001/M002/M011；核验要求：以有权身份证明和申请时点计算年龄，再核本人签名+附加监护签名；关系证明仅有争议时另查；结果与下一步：双签事实可核`PASS_FACT`；少附签`NEEDS_MATERIAL`→本人/监护人；争议`NEEDS_HUMAN_DECISION`→学籍经办/有权身份部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "理由陈述与法定类型定位",
          "requirement": "原稿规则编号/标题：R008 理由陈述与法定类型定位；触发/适用：L1；T=正式申请并有病/困难/特别需要/非本人原因线索；F=L0纯咨询；U=只有口述或理由归类有冲突；来源、字段及材料关联：SRC-001第22/23条/SRC-002第一部分；F008/F030；M001；核验要求：核本人签名叙述，分类只为选择M008/009/010；“正当性”与无法继续学习程度须拟转入校裁量；结果与下一步：有可核叙述`PASS_FACT`仅叙述存在；缺陈述`NEEDS_MATERIAL`→本人；证明与理由矛盾`CONFLICT`→原校/拟转入校",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "因病诊断证明要件",
          "requirement": "原稿规则编号/标题：R009 因病诊断证明要件；触发/适用：L1–L2；T=F008因病；F=其他理由；U=诊断与本人/医院真实性不明；来源、字段及材料关联：SRC-002第二部分第（七）项；F008/F031；M001/M008；核验要求：核二甲以上（含二甲）医院、病情证明专用章、姓名和签发时点；医疗事实A/B需原签发医院核真，疾病是否需要转学不自动判断；结果与下一步：要件事实可核`PASS_FACT`；本人本阶段未提交`NEEDS_MATERIAL`；医院权限/诊断必要性`NEEDS_HUMAN_DECISION`→医院核证/两校有权审查，P3限制展示",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "特殊困难或特别需要证明",
          "requirement": "原稿规则编号/标题：R010 特殊困难或特别需要证明；触发/适用：L1–L2；T=相应理由；F=无此理由；U=证明单位/困难事实效力不明；来源、字段及材料关联：SRC-002第二部分第（七）项；F008/F032；M001/M009；核验要求：核说明、必要证据、校方教务处章的阶段差异；证明所载事实≠学校认定理由充分；结果与下一步：证据要件存在`PASS_FACT`仅事实；申请人应交而缺`NEEDS_MATERIAL`；需行政裁量`NEEDS_HUMAN_DECISION`→原校及拟转入校主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "非本人原因学校培养条件变化",
          "requirement": "原稿规则编号/标题：R011 非本人原因学校培养条件变化；触发/适用：L1–L3；T=原校无法继续培养等非本人原因；F=无此情形；U=学校正式原因及省厅协调记录不明；来源、字段及材料关联：SRC-001第22条/SRC-002第一部分第（三）项；F008/F033；M001/M010；核验要求：学生可先陈述，原校正式出证A、省厅协调结果另核；不将学校应产生证明转嫁本人；结果与下一步：原校事实已核`PASS_FACT`仅条件变化；M010未出`SOURCE_UNAVAILABLE`→原校/省厅协调经办；是否接收`NEEDS_HUMAN_DECISION`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "定向就业等招生限制事实",
          "requirement": "原稿规则编号/标题：R012 定向就业等招生限制事实；触发/适用：L2；T=需查招生形式限制的国内本硕；F=非此学段且特别政策不适用；U=招生记录未核或特殊类型是否属定向争议；来源、字段及材料关联：SRC-001第22条/SRC-002第一部分；F006/F021；M003/M004/M012；核验要求：本科读取加章录取名册，研究生读取招生正式记录；只查“以定向就业招生录取”及明确分类，不推断所有专项招生禁止；结果与下一步：无命中`PASS_FACT`仅此限制；证实定向就业标`restriction_detected + NEEDS_HUMAN_DECISION`→两校招生/学籍部门；无法取得`SOURCE_UNAVAILABLE`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "转学不得低层次转高层次",
          "requirement": "原稿规则编号/标题：R013 转学不得低层次转高层次；触发/适用：L2–L3；T=正式学历层次转移且拟层次可核；F=只是交流/非转学；U=培养层次或拟学校决定尚无；来源、字段及材料关联：SRC-001第22条/SRC-002第一部分；F006/F020/F026；M003/M016/M017；核验要求：比两校有权培养层次A/B；意向专业L1不得冒充拟校正式批准层次；结果与下一步：未见“低转高”限制事实可核`PASS_FACT`（高转低的其他适用性仍须主管确认）；低转高命中`restriction_detected + NEEDS_HUMAN_DECISION`→拟转入校；缺后置校级记录在L1不报缺件",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-02",
      "name": "8.3 培养、成绩、院校材料与学校决定（R014–R025）",
      "description": "对应源 Markdown 的 08 规则分组；分项内所有结论仅为本地研究预审。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "R014",
          "title": "本科原录取与拟录取比较",
          "requirement": "原稿规则编号/标题：R014 本科原录取与拟录取比较；触发/适用：L3本科；T=正式本科转学且两校可给同生源地相应年相关专业原始记录；F=研究生、涉外特别程序不适用；U=年份/省份/专业/录取批次或分数口径不明；来源、字段及材料关联：SRC-001第22条/SRC-002第一部分；F020/F022–F027；M004/M006；核验要求：仅同生源地、相应年份、拟转入专业对应官方名册A/B，可比同一分数口径；不得用网络宣传最低分或机械比较不同批次；结果与下一步：可比且未见分低限制`PASS_FACT`仅分数关系；低于基准`restriction_detected + NEEDS_HUMAN_DECISION`→两校招生；口径不匹配`CONFLICT`/`POLICY_UNCONFIRMED`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "高考改革省份选科",
          "requirement": "原稿规则编号/标题：R015 高考改革省份选科；触发/适用：L3本科；T=高考改革省份且需核选科；F=非改革省份/非本科；U=当年选科政策/个人科目/拟专业要求不明；来源、字段及材料关联：SRC-002第一部分第（四）项；F023/F024/F028；M004/M007；核验要求：以同一招录年省份的本人正式选科与拟转入专业适用年份的官方选考要求比对；不拿2026最新宣传替代当年政策；结果与下一步：要求可比且满足`PASS_FACT`仅科目事实；明确不符`restriction_detected + NEEDS_HUMAN_DECISION`→招生主管；制度年次未知`POLICY_UNCONFIRMED`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "研究生录取控制标准",
          "requirement": "原稿规则编号/标题：R016 研究生录取控制标准；触发/适用：L3研究生；T=硕/博转学且有可比研究生控制标准；F=本科高考路径；U=学科、学位层次、年份、控制线口径不明；来源、字段及材料关联：SRC-001第22条/SRC-002第一部分/SRC-005第18条；F006/F026/F029；M003/M012；核验要求：两校研究生招生权威A/B记录，同层次同年和可比专业/门类比较；口径不能确立时不计算差值；结果与下一步：未见“转入更高”`PASS_FACT`仅比较事实；更高标`restriction_detected + NEEDS_HUMAN_DECISION`→研究生招生/培养主管；源缺`SOURCE_UNAVAILABLE`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "成理研究生专门限制",
          "requirement": "原稿规则编号/标题：R017 成理研究生专门限制；触发/适用：L2–L3；T=成理研究生转出或转入；F=普通本科；U=现行第18条适用性/跨学科/同城/延期状态不清；来源、字段及材料关联：SRC-005第18条（现行待核）；F003/F004/F017/F019/F020/F026；M003/M005/M012/M027；核验要求：学校所在地、学科门类、延期/退学状态取有权记录；第18条可能改版，特别例外按研究生院确认；结果与下一步：条款及事实齐备且未触限制`PASS_FACT`仅已检项；触限制`NEEDS_HUMAN_DECISION`；校本现行性未知优先`POLICY_UNCONFIRMED`→研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "拟转入专业导师同意",
          "requirement": "原稿规则编号/标题：R018 拟转入专业导师同意；触发/适用：L3研究生；T=研究生拟校导师意见进入该阶段；F=本科路径；U=导师权或是否达到L3不清；来源、字段及材料关联：SRC-002第二部分末段/SRC-005；F026/F037；M013/M016；核验要求：核拟转入导师本人/培养单位授权、意向专业一致与真实签发日A/B；L1没有导师意见不是缺件；结果与下一步：有效意见存在`PASS_FACT`仅导师表态；L3未签由校方办理`SOURCE_UNAVAILABLE`；口头聊天不替代`NEEDS_HUMAN_DECISION`→拟转入校研究生培养单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "每学期成绩完整及校方签发",
          "requirement": "原稿规则编号/标题：R019 每学期成绩完整及校方签发；触发/适用：L2–L5；T=省厅材料要求覆盖在校学期；F=L0/L1早期或特别涉外流程不适用；U=学期清单/校方电子签章效力未知；来源、字段及材料关联：SRC-001第18条/SRC-002第二部分第（四）项；F018–F020；M003/M005；核验要求：原校A/B逐学期列清，需核教务处章或经主管确认的有效电子记录，成绩更正保留版本；结果与下一步：各期与签发事实`PASS_FACT`；学校档案无法取`SOURCE_UNAVAILABLE`→原校教务/培养部门；成绩版本冲突`CONFLICT`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "在校期间表现鉴定",
          "requirement": "原稿规则编号/标题：R020 在校期间表现鉴定；触发/适用：L2–L5；T=省厅备案比照材料适用；F=L1或涉外特别路径未经确认；U=原校院系身份/鉴定覆盖期不明；来源、字段及材料关联：SRC-002第二部分第（三）项；F020/F049；M003/M029；核验要求：对照本人、原校二级院系、实际在籍覆盖期、院系章A/B；学生自行撰写不是校方鉴定；结果与下一步：合法鉴定事实`PASS_FACT`；学校尚未提供`SOURCE_UNAVAILABLE`→原校院系；冒章疑点`NEEDS_HUMAN_DECISION`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "原校有权转出意见",
          "requirement": "原稿规则编号/标题：R021 原校有权转出意见；触发/适用：L2；T=原校进入正式审核并产生意见；F=L0/L1未形成；U=签发主体/文件效力不清；来源、字段及材料关联：SRC-001第23条/SRC-002第三部分；F003/F034；M003/M015；核验要求：检核原校、意见对应申请版/学生/专业、签发权限和时间A/B；个人辅导员聊天C不等于学校意见；结果与下一步：仅能认定“原校出具某意见”`PASS_FACT`；草稿/无权签`NEEDS_HUMAN_DECISION`→原校有权签发机关；无官方源`SOURCE_UNAVAILABLE`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "拟转入院系集体研究",
          "requirement": "原稿规则编号/标题：R022 拟转入院系集体研究；触发/适用：L3；T=拟转入院系已研究；F=L0–L2未研究；U=纪要版本、院系章或议题对象不明；来源、字段及材料关联：SRC-002第二部分第（八）项；F026/F035；M016；核验要求：核有权院系、会议时点/集体研究纪要、院系章及拟专业对应A/B；不推“院系同意=学校接收”；结果与下一步：纪要事实`PASS_FACT`；会后失联`SOURCE_UNAVAILABLE`→拟转入院系；权限争议`NEEDS_HUMAN_DECISION`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "拟转入校校级有权决定",
          "requirement": "原稿规则编号/标题：R023 拟转入校校级有权决定；触发/适用：L3；T=有校长办公会/专题会作出决定；F=会议前；U=文件真伪、授权或内容与院系不一致；来源、字段及材料关联：SRC-001第23条/SRC-002第二部分第（九）项；F004/F026/F035/F036；M016/M017；核验要求：核有权会议、本人、拟专业、议题、时间、校章A/B和正式决议具体**同意/不同意**；不以OCR的“同意”自称批准；结果与下一步：`PASS_FACT`只表示**已核见该机关作出何种决定**；是否同意以有权正式文件保留，不由AI决定；疑伪`NEEDS_HUMAN_DECISION`→拟转入校有权会议秘书/主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "转出校公示程序及结果",
          "requirement": "原稿规则编号/标题：R024 转出校公示程序及结果；触发/适用：L4；T=转出校启动并完成需核公示；F=未进入公示阶段；U=页面、起止日、异议结果不明；来源、字段及材料关联：SRC-001第24条/SRC-002第二部分第（十）项；F038；M018；核验要求：核正式官网和公示部门出具盖章结果；公示至少5工作日、姓名/考生号/两校/年级专业/分数理由等依法应列要素，日期按工作日口径；结果与下一步：公示事实可核`PASS_FACT`；不足期/异议未结`NEEDS_HUMAN_DECISION`→原校公示部门；网页失联`SOURCE_UNAVAILABLE`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "拟转入校公示程序及结果",
          "requirement": "原稿规则编号/标题：R025 拟转入校公示程序及结果；触发/适用：L4；T=拟转入校公示已到应核阶段；F=尚未开始；U=结果/日期/公示主体不明；来源、字段及材料关联：SRC-001第24条/SRC-002第二部分第（十一）项；F039；M019；核验要求：同R024但独立核拟转入校，不能用原校公示代替；至少5工作日，有异议必须有结果证据A/B；结果与下一步：公示事实可核`PASS_FACT`；日期或结论不符`NEEDS_HUMAN_DECISION`→拟转入校公示部门；页面失联`SOURCE_UNAVAILABLE`",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-03",
      "name": "8.4 备案、衔接、例外与版本控制（R026–R037）",
      "description": "对应源 Markdown 的 08 规则分组；分项内所有结论仅为本地研究预审。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "R026",
          "title": "省转学申请表及归档要件",
          "requirement": "原稿规则编号/标题：R026 省转学申请表及归档要件；触发/适用：L5；T=两校已形成所需校际文件并启动省厅材料；F=L0–L4未到备案；U=当期表格/校方签章形式未证；来源、字段及材料关联：SRC-002第二部分/SRC-004/009（后二者待核，非硬依据）；F005/F010/F034–F040/F049；M001/M004–M006/M015–M020/M029；核验要求：以四川省内/跨省相应**官方当期表**、转入校签字日和学校意见，比完整材料槽；研究生比照、外省与涉外差异分别标待核；外校SRC-010不能作为现行表；结果与下一步：当前归档事实`PASS_FACT`；缺校方签署交责任学校`SOURCE_UNAVAILABLE`；版本不明`POLICY_UNCONFIRMED`→转入校备案经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "省内备案和跨省确认有权路径",
          "requirement": "原稿规则编号/标题：R027 省内备案和跨省确认有权路径；触发/适用：L5；T=已确认双方学校所在地、办理方向且进入省级环节；F=前阶段；U=转出/转入省、跨省特别要求或省厅记录不明；来源、字段及材料关联：SRC-002第三部分；F002–F005/F041；M003/M020/M021；核验要求：省内四川由拟转入校报川教厅；四川跨省转出按转入地确认（确需可先报四川）；跨省转入四川须转出地确认后拟转入校线上报四川；以官方状态A/B核权限；结果与下一步：正确机构路径事实`PASS_FACT`；错误省份/仅受理冒充确认`CONFLICT`→转入校经办与两省主管；源不通`SOURCE_UNAVAILABLE`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "备案时间与集中办理节点",
          "requirement": "原稿规则编号/标题：R028 备案时间与集中办理节点；触发/适用：L5；T=有可信转入校申请表签字日且已启动备案；F=L0–L4；U=签字日、履行日期或特殊跨省规则不明；来源、字段及材料关联：SRC-001第24条/SRC-002第四部分；F009/F040/F041；M020/M021；核验要求：四川规定3、6、9、12月集中办理，校际手续后3个月内，起点为转入校在表签字日；不把这些当成成理首轮申请截止；结果与下一步：记录可核的日期关系`PASS_FACT`；超期/无法核期限`NEEDS_HUMAN_DECISION`/`POLICY_UNCONFIRMED`→转入校及省厅主管；时点不明`SOURCE_UNAVAILABLE`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "学信网学籍异动审核状态",
          "requirement": "原稿规则编号/标题：R029 学信网学籍异动审核状态；触发/适用：L6；T=省级报备后正式发起学籍异动；F=尚未到L6；U=仅有提交截图/官方审核结果未知；来源、字段及材料关联：SRC-002第四部分；F007/F041/F042；M021/M022；核验要求：区分`提交、受理、审核通过/退回`，以有权学籍核验记录A/B；不得以业务软件Run、二维码或个人截图冒充学信网确认；结果与下一步：有权确认事实`PASS_FACT`；仅提交不等于通过，若状态矛盾`CONFLICT`→转入校学籍管理员；源失联`SOURCE_UNAVAILABLE`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "正式报到、接收与学籍衔接",
          "requirement": "原稿规则编号/标题：R030 正式报到、接收与学籍衔接；触发/适用：L6；T=电子学籍异动审核已确认；F=尚处前置阶段；U=异动结果或接收登记不明；来源、字段及材料关联：SRC-002第四部分；F004/F042/F047；M022/M023；核验要求：核拟转入校正式接收/注册A/B发生在所要求的学籍异动审核之后；校级同意书或省厅受理不是入学登记；结果与下一步：合法接收事实`PASS_FACT`；顺序倒置`CONFLICT`→两校学籍归口；校方尚未登记`SOURCE_UNAVAILABLE`",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "来华留学特别程序和身份",
          "requirement": "原稿规则编号/标题：R031 来华留学特别程序和身份；触发/适用：L0–L3涉外；T=官方确认属于来华留学学历生；F=国内普通本硕；U=护照、国际学生身份或特别转学规范未核；来源、字段及材料关联：SRC-007第31–34条；F006/F012/F013/F048；M002/M003/M014；核验要求：核护照更新链、国际学生权威学籍和特别适用办法；不自动搬用本科高考、四川省内普通材料门槛；结果与下一步：身份可核可记有限`PASS_FACT`；特别程序仍`POLICY_UNCONFIRMED`→国际学生管理主管；两号不符`CONFLICT`",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "补件、替换及定向重审",
          "requirement": "原稿规则编号/标题：R032 补件、替换及定向重审；触发/适用：LX任一阶段；T=某M新增、替换或撤销；F=从未变更材料；U=版本依赖链不完整；来源、字段及材料关联：SRC-001/002为业务背景，技术规则非校方政策；F001/F007/F045；M024/M028及被变更M；核验要求：逐项比`hash、sourceVersion、personRef、签发时间、取证时点`，求依赖受影响F与R集合；不重用旧Run，不改变已签发学校公文；结果与下一步：依赖链可靠`PASS_FACT`仅版本事实；旧核验标`STALE_RECHECK_REQUIRED`并定向重审；失链`CONFLICT`→经办及技术Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R033",
          "title": "撤回请求与有效处理",
          "requirement": "原稿规则编号/标题：R033 撤回请求与有效处理；触发/适用：LX；T=本人明确提出撤回；F=未申请撤回；U=递交主体/当时阶段/受理机关效力不明；来源、字段及材料关联：SRC-003/005（仅申诉/学籍背景，撤回特别授权缺）；F009/F043；M001/M025；核验要求：记录请求日期、当前阶段、是否已有两校/省厅决定、主管书面回复；撤回可否生效必须依校本现行办法人工裁定；结果与下一步：请求存在可记`PASS_FACT`仅“提出了撤回”；办理效力`POLICY_UNCONFIRMED`/`NEEDS_HUMAN_DECISION`→原受理机关/有权撤销机关；不得删除历史",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R034",
          "title": "异议、申诉和复核",
          "requirement": "原稿规则编号/标题：R034 异议、申诉和复核；触发/适用：LX；T=已针对某具体决定提出复核/申诉；F=没有提出；U=有权机关、校本期限和受理资格不明；来源、字段及材料关联：SRC-001第59–64条/SRC-003第59条/SRC-005第44条/SRC-012/013（后两者只证制度机构存在）；F044；M026；核验要求：绑定原决定ID、签发学校、决定类型、送达或知悉日期、申诉人、受理机关、书面决定；本科、研究生及外校决定分别查，不能套统一倒计时；结果与下一步：申请事实可核`PASS_FACT`，是否受理/维持/变更只引有权决定；流程不明`POLICY_UNCONFIRMED`→对应学校有权申诉主管机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R035",
          "title": "G50/S/T相邻权威结论复用",
          "requirement": "原稿规则编号/标题：R035 G50/S/T相邻权威结论复用；触发/适用：L1/LX；T=已有身份更正、休复学、保留学籍、其他事项权威决定影响当前转学；F=无适用邻接事项；U=源模板、决定当前效力/版本不明；来源、字段及材料关联：SRC-003/005；F011/F013/F017/F046；M003/M027；核验要求：核源决定`templateId、decisionId、owner、effectiveAt、revokedAt、sourceVersion、scope`及学生归属A/B；G50精确映射待总账，不复制其裁量；结果与下一步：仅复用源决定事实`PASS_FACT`；旧版与当前冲突`CONFLICT`，源不可达`SOURCE_UNAVAILABLE`→源业务Owner；绝不二次签相邻决定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R036",
          "title": "政策适用版本与校本缺口",
          "requirement": "原稿规则编号/标题：R036 政策适用版本与校本缺口；触发/适用：所有阶段；T=规则要用现行学段/校本阈值；F=仅记录无政策依赖的案卷元数据；U=旧版/新规过渡或专项原文未核；来源、字段及材料关联：SRC-001/002/003/004/005/007/009（004/009待核）；F006/F007/F009/F045；M028；核验要求：规则存`SRC标识、有效起止、校本确认人、核验时点`；成理2017专项全文缺、当期窗口缺、外校SRC-010/011只作参照；结果与下一步：经核现行上位依据可支持限定事实`PASS_FACT`；任何依赖未核校本阈值`POLICY_UNCONFIRMED`→学籍/研究生/国际学生政策负责人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R037",
          "title": "原件可读性、签发权限与证据归属",
          "requirement": "原稿规则编号/标题：R037 原件可读性、签发权限与证据归属；触发/适用：任一接收/引用材料的阶段；T=材料进入某R核验；F=未到应需阶段；U=页码、真伪或材料归属不明；来源、字段及材料关联：SRC-001/002为原始文书要求，采集规则为技术设计；F001/F011/F013/F045；M002–M029（M028技术留痕）；核验要求：校验材料字节、版本、页/字段、签发机关、授权、学生/校别、签发时间及真实来源；OCR低可信时可人工阅原件；结果与下一步：可读且来源可核`PASS_FACT`仅证据归属；扫描损坏`UNREADABLE`；来源失联`SOURCE_UNAVAILABLE`；权属冲突`CONFLICT`→材料持有人/对应学校经办",
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
      "name": "本地研究预审 · L0 意向定位",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "l1",
      "workflowOwner": "local"
    },
    {
      "id": "l1",
      "name": "本地研究预审 · L1 本人正式申请",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l2",
      "workflowOwner": "local"
    },
    {
      "id": "l2",
      "name": "本地研究预审 · L2 原校核验与意见",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l3",
      "workflowOwner": "local"
    },
    {
      "id": "l3",
      "name": "本地研究预审 · L3 拟转入校实质审核及集体研究",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l4",
      "workflowOwner": "local"
    },
    {
      "id": "l4",
      "name": "本地研究预审 · L4 两校公示、异议与结果",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l5",
      "workflowOwner": "local"
    },
    {
      "id": "l5",
      "name": "本地研究预审 · L5 省级备案/跨省确认",
      "kind": "handoff",
      "executorRole": "reviewer",
      "nextStageId": "l6",
      "workflowOwner": "local"
    },
    {
      "id": "l6",
      "name": "本地研究预审 · L6 电子学籍异动、报到衔接",
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
  "templateId": "S01-T05",
  "name": "跨校转入、转出和转学申请审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S01-T05.md",
  "researchOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/S01-T05.md",
  "sourceDocumentSha256": "4bbcce8c51d0544219faa58be12ca2ca67aeb65ceb1e3ac515584d236c8caca1",
  "officialSchoolTemplate": false,
  "researchStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "sourceSnapshotDate": "2026-10-23",
  "sourceIntegrity": "manifest SHA-256 for source blob plus one terminal LF, per dispatch integrity note",
  "sources": [
    {
      "srcId": "SRC-001",
      "title": "`GENERAL-RESEARCH` / **已核关键正文** — 中华人民共和国教育部，《普通高等学校学生管理规定》（教育部令第41号） — 2017-02-04公布；2017-09-01施行；本轮未发现现行废止依据，更新性仍应定期核对 — 全国普通高校学生转学基本界限；转专业区分、第22条限制、第23条两校与决定、第24条公示备案",
      "url": "https://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201702/t20170216_296385.html",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-002",
      "title": "`GENERAL-RESEARCH` / **已核全文重要章节** — 四川省教育厅，《关于普通高等学校学生转学工作的通知》（川教〔2022〕65号；罗江区政府转载全文） — 2022-09-01施行、有效期5年；2023-08-21政府转载；明确废止川教函〔2017〕341号 — 四川省高校普通本科、研究生的办理条件、材料及省内/跨省流程；附件表格**未取得原件**，留待核",
      "url": "https://luojiang.gov.cn/gk/cdgk/jczwgkbzml/lybl/xwjy/zcwj/gfxwj/1541106.htm",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-003",
      "title": "`CDUT-VERIFIED` / **已核关键正文；现行性待部门确认** — 成都理工大学，成理校教〔2019〕18号《成都理工大学全日制普通本科学生学籍管理办法》 — 2019-12-31印发、2020-01-01施行；废止2017版本科学籍管理办法；本轮未发现后续废止公告 — 成都理工大学国内普通本科；第37条转引2017专项转学办法，不代表该专项已完整核实",
      "url": "https://dbxb.cdut.edu.cn/__local/7/B6/E5/006AC04D88A214D1AD8B1F5E540_16B4A5B7_C543C.pdf",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-004",
      "title": "`CURRENTITY-UNKNOWN` / **未核专项正文** — 成都理工大学，成理校教〔2017〕18号《成都理工大学全日制普通本科学生转学管理办法（试行）》 — **当前独立全文URL未取得**；可从[SRC-003]第37条间接核文号与标题 — 2017年文号可证；具体印发日、生效、修改或废止时间待核 — 本事项最关键校本细则；不得在未读正文前生成学校特定审批阈值或表单顺序",
      "url": null,
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "NO_DIRECT_URL_IN_INDEX"
    },
    {
      "srcId": "SRC-005",
      "title": "`CDUT-VERIFIED` / **已核关键正文；现行性待部门确认** — 成都理工大学，成理校研〔2021〕13号《关于印发〈成都理工大学研究生学籍管理办法〉的通知》 — 2021-09-01施行；第45条明确废止成理校研〔2019〕32号；更新性待核 — 成都理工大学研究生；第18条有其自身不得转学情形，不能照套本科表",
      "url": "https://dbxb.cdut.edu.cn/xxgkwz/info/1032/2549.htm",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-006",
      "title": "`CDUT-VERIFIED` / **已核部门职责** — 成都理工大学教务处，《科室设置》中的“学籍管理科”职责 — 页面发表/更新日未标明；2026-10-22检索，岗位组织可能变化 — 本科学籍业务归口事实，非独立校级转学批准授权文件",
      "url": "https://aao.cdut.edu.cn/jgsz/kssz.htm",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-007",
      "title": "`CDUT-VERIFIED` / **已核关键正文；适用细则待核** — 成都理工大学，成理校发〔2022〕26号《成都理工大学来华留学生管理规定（试行）》 — 2022年文件；完整落款日期、施行条款及后续修订待查 — 持外国护照、在校接受普通高等学历教育的来华留学本科/研究生；第34条另指四川相关管理办法",
      "url": "https://dbxb.cdut.edu.cn/__local/6/F5/86/E91EEDCF144F4BC5CA934E95F28_8F010406_8B8F6.pdf",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-008",
      "title": "`CDUT-VERIFIED` / **已核正文** — 成都理工大学文法学院，《2026年转专业可参加专业考核学生名单公示》 — 2026-06-11发布，针对2026年转专业工作，非长期规范 — **仅作非同一事项的边界实证**：校内转专业有专门工作链，不能充作跨校转学案例或授权",
      "url": "https://wfxy.cdut.edu.cn/info/1078/3596.htm",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-009",
      "title": "`CURRENTITY-UNKNOWN` / **仅制度入口核实，未核正文** — 成都理工大学教务处，主页“管理制度”中的《成都理工大学全日制普通本科学生转学管理办法》条目 — 列表可检索；无法由“02/27”认定文档发布年、修订年、现行版本 — 支持学校确有专项制度入口，但不能反向证明[SRC-004]2017全文仍原样有效",
      "url": "https://aao.cdut.edu.cn/",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-010",
      "title": "`CROSS-SCHOOL-REFERENCE` / **已核外校表单目录** — 成都信息工程大学教务处，《四川省普通高等学校学生转学备案表（省内）》 — 2026-01-07发布；该校页面更新/适用性不代表成理适用 — 证明省内表单有公开版本线索；**不得**作为成都理工大学当前表单或受理说明",
      "url": "https://jwc.cuit.edu.cn/info/1079/1127.htm",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-011",
      "title": "`CROSS-SCHOOL-REFERENCE` / **已核外校制度相关全文** — 西昌学院，西学院教〔2024〕37号《西昌学院普通本专科学生转学实施办法》 — 2024-12-27印发；**仅为西昌学院自身规则** — 对照可见学校初次申请材料、后续会议、公示、备案附件可能分阶段，绝不移植其表格份数或节点到成理",
      "url": "https://www.xcc.edu.cn/jwc/glzd80/xjxwk/790706/%E5%85%B3%E4%BA%8E%E5%8D%B0%E5%8F%91%E3%80%8A%E8%A5%BF%E6%98%8C%E5%AD%A6%E9%99%A2%E6%99%AE%E9%80%9A%E6%9C%AC%E4%B8%93%E7%A7%91%E5%AD%A6%E7%94%9F%E8%BD%AC%E5%AD%A6%E5%AE%9E%E6%96%BD%E5%8A%9E%E6%B3%95%E3%80%8B%E7%9A%84%E9%80%9A%E7%9F%A5.pdf",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-012",
      "title": "`CDUT-VERIFIED` / **仅校方条目及文号交叉印证，未取得完整申诉办法正文** — 成都理工大学数学科学学院《规章制度》中的《成都理工大学学生申诉管理办法》；成理校发〔2022〕24号由来华留学生管理规定第70条交叉指认 — 2022文号得到校方资料间接印证，列表2023-02-24是网页发布时间，现行性及全文条款未知 — 证明申诉制度存在，不证明转学拒绝、撤回、复核的法定受理范围或期限；访问学院栏目遇412",
      "url": "https://math.cdut.edu.cn/txgz/gzzd.htm",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-013",
      "title": "`CDUT-VERIFIED` / **官网章程相关条文可检** — 成都理工大学《成都理工大学章程》 — 章程网站公开；具体修订版生效与转学个案适用须核 — 证明学校设申诉处理委员会及学生对处理处分异议的权利，不等同所有转学不予接收均可按处分申诉期限处理",
      "url": "https://www.cdut.edu.cn/info/1366/7658.htm",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-014",
      "title": "`GENERAL-RESEARCH` / **教育部官方规章PDF，交叉校核** — 教育部《普通高等学校学生管理规定》官方规章PDF — 2017-09-01起施行，2021政府公开PDF作为文本核对，不是2021新修订 — 对SRC-001作原文印证；校本申诉适用仍需专门依据",
      "url": "https://www.moe.gov.cn/jyb_xxgk/xxgk/zhengce/guizhang/202112/P020211208551013106022.pdf",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules-01",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R004",
      "srcIds": [
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R007",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R009",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R010",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R015",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R017",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R018",
      "srcIds": [
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R020",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R022",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R026",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R027",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R029",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R030",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R031",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R032",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R033",
      "srcIds": [
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R034",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R035",
      "srcIds": [
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R036",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-009",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R037",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ],
  "exceptionRouteNotes": [
    "`L0-L6`为研究模型，不是成都理工大学已上线的状态机。`LX`是可附着于任何阶段的变更/争议轨迹。不同高校内部审查与两校公示的精确先后，只有取得校本现行办法和当期通知后才能确定，以下不强行造出唯一顺序。",
    "| LX 补件、撤回、复核、政策/版本变更 | 本人、经办及有权复核单位围绕某一阶段形成独立事件 | M024-M027按事件发生后收录；替换件保留历史，更新后影响事实重审 | 成理本科申诉办法细节未取得；研究生办法第44条有特定申诉时限，但不可概括为一切转学撤回期限 | 只登记撤回/复核申请及有权回复，不将申请动作自动映射为撤销原决定 | [SRC-003][SRC-005] |"
  ],
  "publicationGuard": "Integration Owner must register this research template as candidate-held (for example via saveAuthoringCandidateDraft); the R02_RESEARCH_TEMPLATE_NONOFFICIAL sourceNote prefix is not recognized by template-store.isCandidateDraft in the current shared code."
} as const
