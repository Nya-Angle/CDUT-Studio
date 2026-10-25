import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "S01-T02",
  "version": 1,
  "schemaVersion": 2,
  "name": "学生复学及退役复学资格审核",
  "description": "本地研究模板 · 非校方正式模板。用于“学生复学及退役复学资格审核”的事实、材料和来源核验；未确认政策条件一律进入本地人工复核，不产生校方正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 非成都理工大学校方正式模板；源文档 docs/design/review-agent/business-templates/R02/S01-T02.md；SHA-256 7f560e37357026cbacc9bcbde7c267e7ff9163a0e2b8ebceceea8c443d037159；研究/政策证据状态 PARTIAL。校方现行规则、特殊身份适用及签批权限未完全确认；不得生成校方正式批准/拒绝，不连接学校远端回写。",
  "objectType": "person",
  "displayName": {
    "template": "S01-T02 · 学生复学及退役复学资格审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · O1；L1–L6",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F001。原始定义：O1；L1–L6 | 受理服务登记 M001 的 recordId；系统设计 | P1 | 尚未受理先建立临时案号，禁止输出正式批准。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F001；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F002",
      "label": "F002 · O1；L1–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F002。原始定义：O1；L1–L4 | M001 申请栏目对照 M003 原决定，第40/28/37条（SRC-002/004/005） | P2 | NM；与原状态不一致 CONFLICT。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F002；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F003",
      "label": "F003 · O1；L1–L4",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F003。原始定义：O1；L1–L4 | 可信服务登记 M001 时间戳，非申请者手写日；SRC-002/004/005 | P1 | SU；无法评估窗口。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F003；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F004",
      "label": "F004 · O1；L1",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F004。原始定义：O1；L1/L5 | M001 申请诉求栏目；校方最终学期须另由 M018 核定 | P2 | NM，不推定学籍已恢复。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F004；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F005",
      "label": "F005 · O1；L1",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F005。原始定义：O1；L1 | M001 签名或受控提交记录，身份另查 M005；SRC-002/004/005 | P2 | NM；若身份冲突 CONFLICT。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F005；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F006",
      "label": "F006 · O1；L1–L2",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F006。原始定义：O1；L1–L2 | M001 声明与 M006 授权件；校本允许条件无 SRC 正文 | P2 | 非代理 NA；代理无证明 NM+HU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F006；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F007",
      "label": "F007 · O1；L1–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F007。原始定义：O1；L1–L4 | 服务端会话/人工原件核验 M005；项目设计约束 | P2 | SU；渲染器字段不可信。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F007；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F008",
      "label": "F008 · O2；L0–L5",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F008。原始定义：O2；L0–L5 | 学籍权威快照 M002.record/studentId；SRC-002/004/005 | P2 | SU；禁止仅姓名定同一人。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F008；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F009",
      "label": "F009 · O2；L0–L5",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F009。原始定义：O2；L0–L5 | M002.name；SRC-002/004/005 | P2 | SU；与 M005 冲突则 CONFLICT。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F009；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F010",
      "label": "F010 · O2；L1–L3",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F010。原始定义：O2；L1–L3 | M005 可信绑定 + M002 学号，核验流水位置；设计约束 | P3 | SU/HU；不要求无理由上传身份证影像。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F010；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F011",
      "label": "F011 · O2；L0–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F011。原始定义：O2；L0–L4 | M002.level；SRC-002/004/005 | P2 | SU，不能直接套本科规则。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F011；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F012",
      "label": "F012 · O2；L0–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F012。原始定义：O2；L0–L4 | M002.studyMode；研究生 SRC-004 第2条 | P2 | SU/PU，影响 D1/D2 选择。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F012；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F013",
      "label": "F013 · O2；L0–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F013。原始定义：O2；L0–L4 | M002.studentCategory；SRC-005、011、012 | P2 | SU/PU，无法可靠路由。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F013；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F014",
      "label": "F014 · O2；L0–L5",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F014。原始定义：O2；L0–L5 | M002.campus；SRC-009 | P2 | SU；不能猜属地审批权。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F014；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F015",
      "label": "F015 · O2；L0–L5",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F015。原始定义：O2；L0–L5 | M002.collegeOrgId；SRC-002 第40、SRC-005 第37条 | P2 | SU；未核组织管辖 HU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F015；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F016",
      "label": "F016 · O2；L0",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F016。原始定义：O2；L0/L5 | M002.enrolmentProgram/grade；课程调整只看 M021；SRC-002 第18条 | P2 | SU；不阻断 L1。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F016；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F017",
      "label": "F017 · O2；L0–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F017。原始定义：O2；L0–L4 | M002.statusEffectiveAt，SRC-002/004/005 | P2 | SU；若已退学则 CONFLICT/人工分流。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F017；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F018",
      "label": "F018 · O2；L0–L6",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F018。原始定义：O2；L0–L6 | M002 学籍系统查询记录/归档快照；设计约束 | P1 | SU；禁止按陈旧截图定当前状态。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F018；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F019",
      "label": "F019 · O3；L0–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F019。原始定义：O3；L0–L4 | M003 正式原决定文号/受控记录；SRC-002/004/005 | P2 | SU；学生可提供线索但不代正式决定。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F019；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F020",
      "label": "F020 · O3；L0–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F020。原始定义：O3；L0–L4 | M003 条款、申请理由与正式决定；SRC-002 第38/39、SRC-004 第21–25条 | P2/P3 | SU；源间冲突 CONFLICT。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F020；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F021",
      "label": "F021 · O3；L0–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F021。原始定义：O3；L0–L4 | M003 批准生效栏，变更 M004；SRC-002/004/005 | P2 | SU，区间无法核验。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F021；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F022",
      "label": "F022 · O3",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F022。原始定义：O3/O4；L0–L4 | M003 结束日及 M004 最新合法修订；SRC-002/004/005 | P2 | SU；不以学生填的日期裁定。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F022；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F023",
      "label": "F023 · O3；L0–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F023。原始定义：O3；L0–L4 | 存在变更时 M004 正式记录；SRC-002/004 | P2 | 未发生 NA；声明变更但无源 SU/CONFLICT。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F023；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F024",
      "label": "F024 · O4；L2–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F024。原始定义：O4；L2–L4 | F003 + F022，M001/M003/M004；SRC-002 第40、SRC-004 第28、SRC-005 第37条 | P1 | 基础字段缺 SU；争议 HU/PU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F024；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F025",
      "label": "F025 · O4",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F025。原始定义：O4/O5；L2–L4 | F031、F022，M012/M003；SRC-001 第27、SRC-002 第39、SRC-004 第25条 | P2 | 军事适用且日期缺 NM/SU；临界 HU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F025；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F026",
      "label": "F026 · O4；L0–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F026。原始定义：O4；L0–L4 | M016 校本原文、SRC-002/004/005/011/012 | P0 | PU；尤其合办 2026 不可强套旧规。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F026；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F027",
      "label": "F027 · O4；L2–L4",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F027。原始定义：O4；L2–L4 | M016 修订和适用对象核对；SRC-003、011、012 | P1 | PU+HU，不能按发文日期猜。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F027；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F028",
      "label": "F028 · O6；L1–L3",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F028。原始定义：O6；L1–L3 | M010/M014 的申请主张；SRC-002 第40、SRC-004 第28、SRC-005 第37条 | P2 | 非适用 NA；适用 NM。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F028；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F029",
      "label": "F029 · O6；L2–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F029。原始定义：O6；L2–L4 | M010/M014 的可采性核验意见；校本细则缺 | P2 | HU；不能把学生自述设 PASS_FACT。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F029；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F030",
      "label": "F030 · O5；L1–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F030。原始定义：O5；L1–L4 | M011 入伍凭证页位/权威记录；SRC-001/002/004 | P2 | 非军 NA；军人缺 NM/SU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F030；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F031",
      "label": "F031 · O5；L1–L4",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F031。原始定义：O5；L1–L4 | M012 退役凭证日期栏/有权登记；SRC-001/002/004 | P2 | 非军 NA；军人缺 NM/SU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F031；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F032",
      "label": "F032 · O5；L1–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F032。原始定义：O5；L1–L4 | M011/M012 出具机关与编号；SRC-001/002/004 | P2 | 依据凭证是否具编号人工核验 HU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F032；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F033",
      "label": "F033 · O5；L2–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F033。原始定义：O5；L2–L4 | M011/M012/M013 对照 M003；SRC-002 第39、SRC-004 第25条 | P2 | 不一致 CONFLICT；来源暂不可用 SU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F033；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F034",
      "label": "F034 · O6；L1–L3",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F034。原始定义：O6；L1–L3 | 本科 M007/留学生 M009 的机构栏；SRC-002/005 | P3 | 非适用 NA；适用缺 NM。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F034；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F035",
      "label": "F035 · O6；L2–L3",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F035。原始定义：O6；L2–L3 | M007/M009 的医院资质核验证据；SRC-002 第40、SRC-005 第37条 | P3 | HU；研究生医院等级未知为 PU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F035；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F036",
      "label": "F036 · O6；L1–L3",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F036。原始定义：O6；L1–L3 | M007/M009 签发日期页位；SRC-002/005 | P3 | NM/UNREADABLE；有效期是否限定 PU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F036；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F037",
      "label": "F037 · O6；L1–L3",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F037。原始定义：O6；L1–L3 | M007/M009 医师出具的原文定位；SRC-002/005 | P3 | NM，真假与适学性 HU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F037；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F038",
      "label": "F038 · O6；L3–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F038。原始定义：O6；L3–L4 | **后续产生** M008 医疗复查意见；SRC-002 第40、SRC-005 第37条 | P3 | L1 NA（未产生）；L3 未成 HU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F038；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F039",
      "label": "F039 · O6；L3–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F039。原始定义：O6；L3–L4 | M008 正式复查记录；SRC-002/005 | P3 | 尚未安排 NA；复查后缺 SU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F039；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F040",
      "label": "F040 · O6；L3–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F040。原始定义：O6；L3–L4 | M008 签发单位和学校指定依据；SRC-002/005 | P3 | HU；未确认指定机构不得自动合格。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F040；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F041",
      "label": "F041 · O7；L3–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F041。原始定义：O7；L3–L4 | **后生** M017 学院真实审批记录；SRC-002 第40、SRC-005 第37条 | P2 | L1 NA；学院无签批依据 HU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F041；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F042",
      "label": "F042 · O7；L4–L6",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F042。原始定义：O7；L4–L6 | M018 正式决定及 actor/org/authority；SRC-002/004/005 | P2 | L1–L3 NA；无权威决定 HU，绝非自动批准。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F042；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F043",
      "label": "F043 · O7；L5–L6",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F043。原始定义：O7；L5–L6 | M019 教务/国际处/研究生归口正式登记；SRC-002/004/005 | P2 | L1 NA；决定后无记录 SU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F043；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F044",
      "label": "F044 · O8；L1–L6",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F044。原始定义：O8；L1–L6 | 任一 M001–M023 元数据源 ID/版本；设计约束 | P1 | 缺则 UNREADABLE/失去证据归属，不出 PASS_FACT。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F044；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F045",
      "label": "F045 · O8；L1–L6",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F045。原始定义：O8；L1–L6 | 任一 M 的 page/field/recordLocator；设计约束 | P1 | 缺则需人工定位 HU；不虚写页码。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F045；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F046",
      "label": "F046 · O8；L1–L6",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F046。原始定义：O8；L1–L6 | M 实例所属 F001/F008 与权威 M002；设计约束 | P2 | CONFLICT，阻止跨案串用。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F046；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F047",
      "label": "F047 · O8；L2–L6",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F047。原始定义：O8；L2–L6 | 材料 supersedes ID、依赖 F 清单、重审日志；设计约束 | P1 | 旧版不可靠则 HU；不能静默继承旧结论。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F047；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F048",
      "label": "F048 · O7；L5–L6",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F048。原始定义：O7；L5–L6 | M020 恢复学籍快照 + M021 培养/课程安排；SRC-002 第18–19条、SRC-013（旧） | P2 | L1–L4 NA；不阻断复学资格，后续 SU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F048；本地研究字段，不代表校方正式表单或已接通数据接口。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 复学申请意愿、类型、拟恢复学期",
      "purpose": "学生提出；校方受理后持有；属于本学生/案卷及提交时刻版本",
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
        "学生提出；校方受理后持有；属于本学生/案卷及提交时刻版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 确认真实学号、学籍、学段、校区、学院、当前状态",
      "purpose": "学籍主管部门持有；按学号+获取日+recordVersion，禁止跨案复用旧截图",
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
        "学籍主管部门持有；按学号+获取日+recordVersion，禁止跨案复用旧截图"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 · 证明原休学/保留学籍的正式批准类型、日期、有效期",
      "purpose": "学籍审批/备案部门；本学生+原案文号+签发版本",
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
        "学籍审批/备案部门；本学生+原案文号+签发版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 · 证明续期、例外或有效期变更",
      "purpose": "原有权部门；本学生+M003原案关联+变更序列 version",
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
        "原有权部门；本学生+M003原案关联+变更序列 version"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 · 申请人身份与学籍主体绑定",
      "purpose": "身份核验服务/校方受理人；当前会话/案卷身份绑定版本",
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
        "身份核验服务/校方受理人；当前会话/案卷身份绑定版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 · 代交/代理权限事实",
      "purpose": "申请人与代理人/有权确认机构；双身份、权限范围、有效期版本",
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
        "申请人与代理人/有权确认机构；双身份、权限范围、有效期版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "M007 · 本科因病康复诊断",
      "purpose": "学生取得、医疗机构签发；本学生+诊断日+医院签发版本",
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
        "学生取得、医疗机构签发；本学生+诊断日+医院签发版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 · 校医院/学校指定医院复查是否合格",
      "purpose": "校医院/指定医院签发、学校接收；本学生+复查 ID+日期+版本",
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
        "校医院/指定医院签发、学校接收；本学生+复查 ID+日期+版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 · 来华留学生因病康复诊断",
      "purpose": "学生取得、合格医疗机构签发；本学生+机构国别/资质+签发版本",
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
        "学生取得、合格医疗机构签发；本学生+机构国别/资质+签发版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 原非病休学/其他特殊保留理由的解除、终止或返校条件凭据",
      "purpose": "学生或原事项权威出具方；本学生+原理由+出具版次",
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
        "学生或原事项权威出具方；本学生+原理由+出具版次"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 入伍事实及入伍日期",
      "purpose": "学生提供线索、兵役权威出具方持有；本学生+兵役事件+凭证版本",
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
        "学生提供线索、兵役权威出具方持有；本学生+兵役事件+凭证版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 退役身份、时间及证件出具机关",
      "purpose": "兵役主管出具、学生可提供；本学生+退役事件+文号版本",
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
        "兵役主管出具、学生可提供；本学生+退役事件+文号版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 · 军事保留学籍与兵役记录衔接的特殊核对函/权威更正记录",
      "purpose": "学籍部门与兵役权威；本学生+M003/M011/M012交叉引用+修订版本",
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
        "学籍部门与兵役权威；本学生+M003/M011/M012交叉引用+修订版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 研究生按原休学原因提供的“有关证明材料”",
      "purpose": "学生及原证明持有人；本研究生+原因+出具版本",
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
        "学生及原证明持有人；本研究生+原因+出具版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 宜宾校区内部转办/岗位授权记录",
      "purpose": "宜宾校区教务工作部/相关学院；校区组织记录及签发版本",
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
        "宜宾校区教务工作部/相关学院；校区组织记录及签发版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 某身份实际适用的现行学籍规范、补充通知及校本授权",
      "purpose": "政策制定/公开部门；公开文件文号、有效期、版本，原则无学生归属",
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
        "政策制定/公开部门；公开文件文号、有效期、版本，原则无学生归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 · 学院材料审查、资格复核与签署意见",
      "purpose": "有权学院审核主体；本学生+案卷+经认证审批人/授权版次",
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
        "有权学院审核主体；本学生+案卷+经认证审批人/授权版次"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "M018 · 正式复学决定/办理结论及送达记录",
      "purpose": "适用学段有权校方主体；本学生+决定文号+签署版本+权限",
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
        "适用学段有权校方主体；本学生+决定文号+签署版本+权限"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "M019 · 教务处/国际处/研究生归口备案记录",
      "purpose": "真实备案机关；本学生+M018决定引用+备案日期/版次",
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
        "真实备案机关；本学生+M018决定引用+备案日期/版次"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "M020 · 已恢复学籍的权威状态更新快照",
      "purpose": "学籍主管记录；本学生+M018决定引用+当前查询版本",
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
        "学籍主管记录；本学生+M018决定引用+当前查询版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "M021 · 年级、培养方案、课程补选或学分衔接",
      "purpose": "学院教务/培养单位；本学生+复学决定+课程方案版本",
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
        "学院教务/培养单位；本学生+复学决定+课程方案版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "M022 · 撤回请求、复核/申诉及后续处理记录",
      "purpose": "学生提出、有权受理机关归档；本学生+原决定+申诉版次",
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
        "学生提出、有权受理机关归档；本学生+原决定+申诉版次"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "M023 · G50/S/T 相邻事项正式结论的权威引用（更名、转专业、年级、财务资助等）",
      "purpose": "对应事项有权部门；本学生+独立事项/决定 ID+版本+撤销状态",
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
        "对应事项有权部门；本学生+独立事项/决定 ID+版本+撤销状态"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules-01",
      "name": "08.2 基础身份、学籍与时限 R001–R010",
      "description": "对应源 Markdown 的 08 规则分组；分项内所有结论仅为本地研究预审。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "L0–L2 现行政策分支；SRC-001/002/003/004/005/011/012；F011–F014/F026/F027；M002/M016",
          "requirement": "原稿规则编号/标题：**R001** L0–L2 现行政策分支；SRC-001/002/003/004/005/011/012；F011–F014/F026/F027；M002/M016；触发/适用：T：来源确认身份与校规适用性；F：可证实属于本 ID 之外身份→NA/路由；U：校规全文、施行时间或特别规定不明→PU；来源、字段及材料关联：用学校权威学段/身份与规范范围、发文号、生效/废止链匹配；2026 合办目录不能当全文；不跨校取阈值；核验要求：T PASS_FACT（仅适用性）；F NOT_APPLICABLE；U POLICY_UNCONFIRMED，交教务/研究生/国际处政策负责人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "L0–L2 是否为已有学籍的休学/保留学籍学生；SRC-001/002/004/005；F008/F017/F019/F020；M002/M003",
          "requirement": "原稿规则编号/标题：**R002** L0–L2 是否为已有学籍的休学/保留学籍学生；SRC-001/002/004/005；F008/F017/F019/F020；M002/M003；触发/适用：T：学籍存在且原批准类型吻合；F：正式记录证实仅保留入学资格/已终止→NA 本 ID、另案人工路由；U：系统失联或记录互斥→SU/CONFLICT；来源、字段及材料关联：比对学号+学籍生命周期+原决定 ID 和有效日；新生入学不是复学；旧截图无权推翻状态；核验要求：T PASS_FACT；F NOT_APPLICABLE（或有权不利决定另案）；U SU/CONFLICT，学校学籍主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "L1–L2 本人身份绑定；SRC-001/002/004/005（申请主体）；F007–F010/F046；M001/M002/M005",
          "requirement": "原稿规则编号/标题：**R003** L1–L2 本人身份绑定；SRC-001/002/004/005（申请主体）；F007–F010/F046；M001/M002/M005；触发/适用：T：可信身份与学号/主体一致；F：指向另一学生→CONFLICT；U：可信验证未得→SU/HU；来源、字段及材料关联：后端 session 或线下核验 vs 权威学籍学生标识；不能因同名、Renderer actor 或证件照片自动绑定；核验要求：T PASS_FACT；F CONFLICT；U SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION，身份核验员/学籍主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "L1 申请意愿及时间；SRC-002 第40、SRC-004 第28、SRC-005 第37条；F001–F005；M001/M005",
          "requirement": "原稿规则编号/标题：**R004** L1 申请意愿及时间；SRC-002 第40、SRC-004 第28、SRC-005 第37条；F001–F005；M001/M005；触发/适用：T：本人有效表达申请且受理时间可追；F：未提交申请→NEEDS_MATERIAL；U：受理记录不可读/未可核→UNREADABLE/SU；来源、字段及材料关联：学校认可受理记录的时刻优于手写日期；当前统一表单未知，不凭缺某旧格式表拒件；核验要求：T PASS_FACT（申请存在）；F NEEDS_MATERIAL；U UNREADABLE/SOURCE_UNAVAILABLE，学生/受理窗口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "L1–L3 代理合法性；SRC-001（一般权利线索，无 CDUT 代理许可条款）；F006/F007/F010；M005/M006",
          "requirement": "原稿规则编号/标题：**R005** L1–L3 代理合法性；SRC-001（一般权利线索，**无 CDUT 代理许可条款**）；F006/F007/F010；M005/M006；触发/适用：T：存在代办主张→校本授权仍须核；F：可信本人申请、无代办→NA；U：代签真实性/代理许可不清→PU/HU；来源、字段及材料关联：检委托范围、期限、授权来源与双身份；**不设自动准许代理门槛**，儿童/成年学生差异由学校决定；核验要求：T NEEDS_HUMAN_DECISION；F NOT_APPLICABLE；U POLICY_UNCONFIRMED/HU，校方受理/授权审查人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "L0–L2 原批准决定及事由；SRC-002 第38–40、SRC-004 第21–28、SRC-005 第35–37条；F019–F022；M002/M003",
          "requirement": "原稿规则编号/标题：**R006** L0–L2 原批准决定及事由；SRC-002 第38–40、SRC-004 第21–28、SRC-005 第35–37条；F019–F022；M002/M003；触发/适用：T：真实原批准及事由、始末一致；F：正式学籍与决议相反→CONFLICT；U：原决定无法取→SU；来源、字段及材料关联：对照正式决定文号、签发单位、学籍系统状态及生效版本；申请人上传复印件仅辅助查号；核验要求：T PASS_FACT；F CONFLICT；U SOURCE_UNAVAILABLE，学籍主管/原签发部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "L0–L2 续期/变更权威链；SRC-002/004/005；F021–F023/F047；M003/M004",
          "requirement": "原稿规则编号/标题：**R007** L0–L2 续期/变更权威链；SRC-002/004/005；F021–F023/F047；M003/M004；触发/适用：T：存在正式修订且按决定顺序覆盖旧区间→PASS；F：确认无变更→NA；U：两版均称有效或更正来源不可得→CONFLICT/SU；来源、字段及材料关联：按有权决定生效日、撤销引用、原案 ID 排序；不以最新上传时间代有效性；更改期限须影响 R008/R010；核验要求：T PASS_FACT；F NOT_APPLICABLE；U CONFLICT/SOURCE_UNAVAILABLE，原决定机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "L2 本科/研/来华复学申请窗口（含军事保留学籍到期申请）；SRC-002 第39–40、SRC-004 第25/28、SRC-005 第37条；F003/F022/F024–F026；M001/M003/M004/M012/M016",
          "requirement": "原稿规则编号/标题：**R008** L2 本科/研/来华复学申请窗口（**含军事保留学籍到期申请**）；SRC-002 第39–40、SRC-004 第25/28、SRC-005 第37条；F003/F022/F024–F026；M001/M003/M004/M012/M016；触发/适用：T：对应分支法定/校本窗口内有可核日期关系→PASS；F：不属于已验证的这些分支→NA/PU，**提前/逾期反证→HU 非自动驳回**；U：假期顺延/军人两年末日/实际受理日争议→PU/SU/HU；来源、字段及材料关联：以学校权威有效结束日、可信受理日及退役后两年记录比对；军人 R010 管保留期限、R008 管申请时间；研究生寒暑假顺延单独核，J/L 无法套旧阈值；核验要求：T PASS_FACT（日期事实）；F NA/HU；U PU/SU/HU，学籍归口决定例外",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "L2 军事入伍与退役凭据交叉核验；SRC-001 第27、SRC-002 第39、SRC-004 第25条；F030–F033；M003/M011/M012/M013",
          "requirement": "原稿规则编号/标题：**R009** L2 军事入伍与退役凭据交叉核验；SRC-001 第27、SRC-002 第39、SRC-004 第25条；F030–F033；M003/M011/M012/M013；触发/适用：T：权威兵役记录与原学校决定对应且退役日可信→PASS；F：非军→NA，**互斥身份/日期→CONFLICT**；U：凭证缺/糊/来源不可达→NM/UNREADABLE/SU；来源、字段及材料关联：军队/兵役出具机关信息优于 OCR，和学校原决定交叉；不自动验章，疑假材料交核验主体；核验要求：T PASS_FACT（经核兵役事实）；F NA/CONFLICT；U NM/UNREADABLE/SU/HU，兵役及学籍主管",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "L2 军事保留学籍至退役后两年的时间关系；SRC-001 第27、SRC-002 第39、SRC-004 第25/28条；F022/F025/F031；M003/M004/M012",
          "requirement": "原稿规则编号/标题：**R010** L2 军事保留学籍至退役后两年的时间关系；SRC-001 第27、SRC-002 第39、SRC-004 第25/28条；F022/F025/F031；M003/M004/M012；触发/适用：T：日期来源可靠，落在原有效保留期内→PASS；F：非军→NA；**超界→HU 而非自动退学**；U：两年尾日算法/顺延/撤销争议→PU/CONFLICT；来源、字段及材料关联：以正式退役日、学校保留学籍决定与合法变更核对；特殊延迟不凭经验推断，研究生假期因素另核；核验要求：T PASS_FACT（时间对照）；F NA/HU；U PU/CONFLICT，学院或学校有权学籍审查人",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-02",
      "name": "08.3 证明、医院、属地与证据治理 R011–R021",
      "description": "对应源 Markdown 的 08 规则分组；分项内所有结论仅为本地研究预审。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "R011",
          "title": "L1–L3 普通本科因病康复诊断；SRC-002 第40条；F034–F037；M007",
          "requirement": "原稿规则编号/标题：**R011** L1–L3 普通本科因病康复诊断；SRC-002 第40条；F034–F037；M007；触发/适用：T：二甲及以上医院诊断文书可读、身份及出具资质经核→PASS（仅文书事实）；F：非本科因病→NA，明确等级/出具机关不符→HU；U：缺、糊、资质难核→NM/UNREADABLE/HU；来源、字段及材料关联：按病愈诊断、机构等级和签署日期逐项定位；证明“康复诊断已出具”不等于学校复查合格；有效期未知不设天数；核验要求：T PASS_FACT；F NA/HU；U NM/UNREADABLE/HU，学生补件/学院核资质",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "L1–L3 来华留学生因病诊断；SRC-005 第37条；F034–F037；M009",
          "requirement": "原稿规则编号/标题：**R012** L1–L3 来华留学生因病诊断；SRC-005 第37条；F034–F037；M009；触发/适用：T：校医院或中国境内二甲及以上医院诊断可核→PASS（存在与资质）；F：非该分支→NA，不符出具条件→HU；U：境外文件能否采信不明→PU/HU；来源、字段及材料关联：区分来华特殊二选一出具机构，不能复用本科“仅二甲以上”要求；签发有效期未知；核验要求：T PASS_FACT；F NA/HU；U NM/UNREADABLE/PU/HU，国际处/医院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "L1–L3 研究生有关证明；SRC-004 第28条；F020/F028/F029；M003/M014",
          "requirement": "原稿规则编号/标题：**R013** L1–L3 研究生有关证明；SRC-004 第28条；F020/F028/F029；M003/M014；触发/适用：T：与原休学事由相符且有关证明已可读→PASS（存在事实）；F：非研究生此分支→NA；U：校方要求的细项、医学门槛未明→PU/HU；来源、字段及材料关联：研究生含全/非全，**不能要求本科 M007/M008**；校方是否采信仍需学校审查；核验要求：T PASS_FACT（形式事实）；F NA；U PU/HU/NM，研究生学籍归口/学生补证",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "L1–L3 本科/来华非病等原因消除证据；SRC-002 第40、SRC-005 第37条；F020/F028/F029；M003/M010",
          "requirement": "原稿规则编号/标题：**R014** L1–L3 本科/来华非病等原因消除证据；SRC-002 第40、SRC-005 第37条；F020/F028/F029；M003/M010；触发/适用：T：确有该原因关联凭据且与原决定匹配→PASS（文件存在）；F：因病/军事分支→NA；U：具体附件名单或“原因已消除”标准未知→PU/HU；来源、字段及材料关联：只核证明归属和所述事实；创业等不同原因不能填成统一“医院证明”；核验要求：T PASS_FACT（有限事实）；F NA；U PU/HU/NM，学院/国际处",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "L3–L4 有权医疗复查；SRC-002 第40、SRC-005 第37条；F038–F040；M007/M008/M009",
          "requirement": "原稿规则编号/标题：**R015** L3–L4 有权医疗复查；SRC-002 第40、SRC-005 第37条；F038–F040；M007/M008/M009；触发/适用：T：适用身份有校医院/指定医院正式复查记录，可核记其意见→PASS（记录确有该结论）；F：非本科/来华病休或尚在 L1–L2→NA（待后生）；U：复查未完成、指定医院资格不明、意见冲突→HU/SU；来源、字段及材料关联：对复查机构、日期、学生绑定、原诊断版本、医方意见逐项核；**不由模型判断医学康复或强制学生先交后生 M008**；核验要求：T PASS_FACT（记录事实）；F NA；U NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE，指定医院/学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "L2–L5 宜宾属地经办与签批关系；SRC-002 第40、SRC-009；F014/F015/F041–F043；M002/M015/M017/M018",
          "requirement": "原稿规则编号/标题：**R016** L2–L5 宜宾属地经办与签批关系；SRC-002 第40、SRC-009；F014/F015/F041–F043；M002/M015/M017/M018；触发/适用：T：K 叠加分支且校区正式转办证据可取→PASS（转办事实）；F：非宜宾→NA；U：校区独立批准授权不明→HU/PU；来源、字段及材料关联：校区部门职责≠学院审批权限；只以校方明确授权链认定权责，M015 为内部产生，非学生上传；核验要求：T PASS_FACT（转办记录）；F NA；U HU/PU/SU，宜宾教务工作部/学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "L1–L6 文件/权威记录可读性；SRC-002/004/005（业务证据背景，本条为技术证据标准）；F044/F045；任一适用 M001–M023",
          "requirement": "原稿规则编号/标题：**R017** L1–L6 文件/权威记录可读性；SRC-002/004/005（业务证据背景，**本条为技术证据标准**）；F044/F045；任一适用 M001–M023；触发/适用：T：关键页/结构字段能可靠读取→PASS；F：槽位未触发或尚未产生→NA；U：文件已存在但不可读→UNREADABLE；来源、字段及材料关联：OCR 置信度不能决定真实性；原件人工可读时可有独立人工核验记录；合法来源尚未取到交 R019 而非本条；核验要求：T PASS_FACT（可读性）；F NA；U UNREADABLE，持有人/材料读取员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "L1–L6 材料所属学生和案卷；SRC-002/004/005（学生身份对象）；F001/F008/F010/F046；M001/M002/M005及任一目标 M",
          "requirement": "原稿规则编号/标题：**R018** L1–L6 材料所属学生和案卷；SRC-002/004/005（学生身份对象）；F001/F008/F010/F046；M001/M002/M005及任一目标 M；触发/适用：T：学生 ID、案卷 ID、原决定引用均可一致绑定→PASS；F：不同学号或同名错案→CONFLICT；U：绑定来源不可靠→SU/HU；来源、字段及材料关联：多文件多页须每个目标 F 绑定页位；不得跨学生、跨申请复用旧诊断或兵役证；核验要求：T PASS_FACT；F CONFLICT；U SU/HU，案卷经办/学籍核验员",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "L1–L6 证据来源与定位；SRC-002/004/005（仅业务依据，本条为设计约束）；F044/F045；任一适用 M001–M023",
          "requirement": "原稿规则编号/标题：**R019** L1–L6 证据来源与定位；SRC-002/004/005（仅业务依据，本条为设计约束）；F044/F045；任一适用 M001–M023；触发/适用：T：记录提供签发机关、ID、版次、可审证据页位→PASS；F：目标尚未产生→NA；U：学校源失联→SU，上传无来源→HU；来源、字段及材料关联：来源优先级按 05 节；URL/OCR/匿名截图不等于有权证明；证据应归到每个字段而不是笼统一案卷；核验要求：T PASS_FACT（溯源元数据）；F NA；U SU/HU，资料持有人/经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "L0–L6 学籍与原决定当前有效版本；SRC-002/004/005（状态依据）；F017/F018/F019/F044/F047；M002/M003/M004",
          "requirement": "原稿规则编号/标题：**R020** L0–L6 学籍与原决定**当前有效版本**；SRC-002/004/005（状态依据）；F017/F018/F019/F044/F047；M002/M003/M004；触发/适用：T：可核权威查询版本和有效状态一致→PASS；F：已知仅旧截图不能证明现状→HU；U：原系统不可读或同时显示矛盾状态→SU/CONFLICT；来源、字段及材料关联：学籍最新权威登记和合法决定效力分开对照；被撤销/已替换的旧证据不可冒充当前状态；核验要求：T PASS_FACT；F HU；U SU/CONFLICT，学籍数据所有者",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "L2–L6 材料替换与受影响事实失效；SRC-002/004/005（证据对应业务，版本策略属技术设计）；F044–F047；任一被替换 M001–M023",
          "requirement": "原稿规则编号/标题：**R021** L2–L6 材料替换与受影响事实失效；SRC-002/004/005（证据对应业务，**版本策略属技术设计**）；F044–F047；任一被替换 M001–M023；触发/适用：T：存在可核 supersedes(V2,V1)→使依赖 V1 的旧事实结果失效并定向重审；F：无变更→NA；U：版本链断裂/跨案指向→CONFLICT/HU；来源、字段及材料关联：仅失效关联旧 R 的事实结果，不抹除原审计、不自动改写学校 M018；正式决定受影响需另请有权人复核；核验要求：T PASS_FACT（替换链记录）＋后续重审待办；F NA；U CONFLICT/HU，证据管理/原签发机关",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-03",
      "name": "08.4 学校决定、后续事务与救济 R022–R029",
      "description": "对应源 Markdown 的 08 规则分组；分项内所有结论仅为本地研究预审。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "R022",
          "title": "L3–L4 学院审查意见；SRC-002 第40、SRC-005 第37、SRC-004 第28条（研究生不推定学院终审）；F015/F041；M017/M005",
          "requirement": "原稿规则编号/标题：**R022** L3–L4 学院审查意见；SRC-002 第40、SRC-005 第37、SRC-004 第28条（研究生不推定学院终审）；F015/F041；M017/M005；触发/适用：T：本科/来华学院有权签署意见可核→PASS（意见存在）；F：研究生无学院法定必经链或仍 L1–L2→NA；U：签署权限/经办记录不清→HU/SU；来源、字段及材料关联：验组织、人员、受托权限、提交时间及本案身份；不能把任意教师上传意见当学院有效通过；核验要求：T PASS_FACT（存在）；F NA；U HU/SU，本科/留学生学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "L4 校方正式复学决定及签发权限；SRC-002 第40、SRC-004 第28、SRC-005 第37条；F007/F015/F041/F042；M017/M018/M005",
          "requirement": "原稿规则编号/标题：**R023** L4 校方正式复学决定及签发权限；SRC-002 第40、SRC-004 第28、SRC-005 第37条；F007/F015/F041/F042；M017/M018/M005；触发/适用：T：原机关有效决定、可信签发人及范围/时间/未撤销状态均获确认→PASS（记录真实）；F：尚未到 L4→NA、正式审查不合格/未批准→**记录事实并转 HU**；U：权限、真伪、有效性未核→HU/CONFLICT/SU；来源、字段及材料关联：研究生“学校审查”不等于某教师权限；Renderer approved 无效；M018 的真实业务决定内容独立保存，R023 **不签发批准**；核验要求：T PASS_FACT（已存在的可信决定事实）；F NA/HU；U HU/CONFLICT/SU，本科/研/国际学籍有权主体",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "L5 备案；SRC-002 第40、SRC-005 第37、SRC-004 第28条（研究生仅学校审查，不推定本科式备案）；F042/F043；M018/M019",
          "requirement": "原稿规则编号/标题：**R024** L5 备案；SRC-002 第40、SRC-005 第37、SRC-004 第28条（研究生仅学校审查，不推定本科式备案）；F042/F043；M018/M019；触发/适用：T：应备案分支有正式备案记录→PASS；F：L1–L4 或研究生尚无备案要求证据→NA/PU，不列为学生材料；U：学校备案源断线→SU；来源、字段及材料关联：对应备案机关与 M018 决定 ID；无法查备案不直接推断正式决定无效；核验要求：T PASS_FACT；F NA/PU；U SU，教务处/国际处/研究生归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "L5 正式决定与学籍更新一致性；SRC-002/004/005；F017/F018/F042/F043；M018/M020",
          "requirement": "原稿规则编号/标题：**R025** L5 正式决定与学籍更新一致性；SRC-002/004/005；F017/F018/F042/F043；M018/M020；触发/适用：T：签发生效决定与权威现状态可交叉对应→PASS；F：L1–L4 未到更新阶段→NA；U：记录互斥、未同步或系统失联→CONFLICT/SU；来源、字段及材料关联：同一学生和生效日；学籍更新是下游，不可根据审核模块结论伪造恢复状态；核验要求：T PASS_FACT；F NA；U CONFLICT/SU，学籍部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "L5 课程年级衔接；SRC-002 第18–19条、SRC-013（当前性未知）；F016/F048；M020/M021",
          "requirement": "原稿规则编号/标题：**R026** L5 课程年级衔接；SRC-002 第18–19条、SRC-013（**当前性未知**）；F016/F048；M020/M021；触发/适用：T：后生培养方案/选课结果有可信归属→PASS；F：L1–L4→NA；U：旧选课表单效力未知→PU，正式课程结果未可得→SU；来源、字段及材料关联：仅核后续事实，不用旧 SRC-013 表单倒卡复学；转专业须另行决定；核验要求：T PASS_FACT（下游事实）；F NA；U PU/SU，学院教学负责人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "L2/L5 他事项权威决定只读引用；SRC-002 第18/35条、SRC-006/007/014/015；F009/F016/F042/F048；M023/M002/M018",
          "requirement": "原稿规则编号/标题：**R027** L2/L5 他事项权威决定只读引用；SRC-002 第18/35条、SRC-006/007/014/015；F009/F016/F042/F048；M023/M002/M018；触发/适用：T：相关 G50/S/T 正式决定有唯一 ID、签署和效期→PASS（引用真）；F：本案无此其他事项→NA；U：已有申请但未见有效他案决定→SU/HU；来源、字段及材料关联：学籍更正 G01、转专业、课程、资助/财务各归自身机关；引用不得向另一模板回写批准；G50 精确编号未核；核验要求：T PASS_FACT（引用）；F NA；U SU/HU，其他事项真实 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "L1–L4 决定前撤回请求；SRC-001/002/004/005（均未提供统一校本撤回许可细则）；F001/F003/F005/F042/F047；M001/M018/M022",
          "requirement": "原稿规则编号/标题：**R028** L1–L4 决定前撤回请求；SRC-001/002/004/005（均**未提供统一校本撤回许可细则**）；F001/F003/F005/F042/F047；M001/M018/M022；触发/适用：T：撤回意向由可信本人/获准代理提出→PASS（**仅接收意向事实**）；F：无撤回或已有正式决定而主张“自动撤销”→NA/转 R029；U：能否撤回、受理效力与重提规则未知→PU/HU；来源、字段及材料关联：撤回 REQUESTED 与校方确认 WITHDRAWN 分开；不得擦除提交时间、旧案证据或真实 M018；核验要求：T PASS_FACT（请求事实）；F NA；U PU/HU，原受理学校窗口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "L6 决定后申诉/复核记录；SRC-001 第59–64、SRC-002 第59、SRC-005 第70条；F003/F042/F047；M018/M022",
          "requirement": "原稿规则编号/标题：**R029** L6 决定后申诉/复核记录；SRC-001 第59–64、SRC-002 第59、SRC-005 第70条；F003/F042/F047；M018/M022；触发/适用：T：申诉意思、原决定、递交/受理记录可核→PASS（存在事实）；F：尚无决定也无申诉→NA；U：期限、受理资格、暂停效力或复核结果需校方确认→PU/HU；来源、字段及材料关联：只消费正式学校原决定和有权复核新决定；不因申诉提交就自行撤销原处理，后续结果版本另归档；核验要求：T PASS_FACT（存在）；F NA；U PU/HU，学生申诉处理机构/有权复核人",
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
      "name": "本地人工复核（不签发校方决定）· L0 原有学籍与前置决定",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "l1",
      "workflowOwner": "local"
    },
    {
      "id": "l1",
      "name": "本地研究预审 · L1 申请",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l2",
      "workflowOwner": "local"
    },
    {
      "id": "l2",
      "name": "本地研究预审 · L2 事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l3",
      "workflowOwner": "local"
    },
    {
      "id": "l3",
      "name": "本地研究预审 · L3 补件与有权复查",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l4",
      "workflowOwner": "local"
    },
    {
      "id": "l4",
      "name": "本地人工复核（不签发校方决定）· L4 正式审查决定",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "l5",
      "workflowOwner": "local"
    },
    {
      "id": "l5",
      "name": "本地研究预审 · L5 备案与复学后教学衔接",
      "kind": "handoff",
      "executorRole": "reviewer",
      "nextStageId": "l6",
      "workflowOwner": "local"
    },
    {
      "id": "l6",
      "name": "本地研究预审 · L6 异议、复核与历史材料更新",
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
  "templateId": "S01-T02",
  "name": "学生复学及退役复学资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S01-T02.md",
  "researchOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/S01-T02.md",
  "sourceDocumentSha256": "14ab9fd472abef5826d9dd7987d33cc1b98d2814b54cafee0106be7f043c6708",
  "officialSchoolTemplate": false,
  "researchStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "sourceSnapshotDate": "2026-10-23",
  "sourceIntegrity": "manifest SHA-256 for source blob plus one terminal LF, per dispatch integrity note",
  "sources": [
    {
      "srcId": "SRC-001",
      "title": "`GENERAL-RESEARCH`；教育部《普通高等学校学生管理规定》（第 41 号令） — 2017-02-04 公布；2017-09-01 实施；第 21 号令同期废止；**后续修订未见证据** — 全国普通高等学历本科/研究生等；**教育部正文已核验**。校本具体期限从适用校规读取，不用其他学校流程填充。",
      "url": "https://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201702/t20170216_296385.html",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-002",
      "title": "`CDUT-VERIFIED`；成都理工大学《全日制普通本科学生学籍管理办法》，成理校教〔2019〕18 号 — 2019-12-31 印发；2020-01-01 执行；明确废止成理校教〔2017〕17 号；**未见此后整体废止公告** — 成都理工全日制普通本科；中外合作及来华本科等“参照”须以特别/新规优先；**18 页原文已核验**。第 40 条是本事项本科决定归口的主要校本依据。",
      "url": "https://dbxb.cdut.edu.cn/__local/7/B6/E5/006AC04D88A214D1AD8B1F5E540_16B4A5B7_C543C.pdf",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-003",
      "title": "`CDUT-VERIFIED`；学校信息公开网《学籍管理办法》目录 — 目录页面两项均标 2023-04-12；非规范生效日 — 信息公开索引仍收录 2019 本科和 2021 研究生制度；**目录条目已核验**，但目录自身不证明无更新。",
      "url": "https://dbxb.cdut.edu.cn/xxgkwz/gksx/xjglbf.htm",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-004",
      "title": "`CDUT-VERIFIED`；成都理工大学《研究生学籍管理办法》，成理校研〔2021〕13 号 — 2021-06-16 印发；2021-09-01 执行；废止成理校研〔2019〕32 号；**后续废止未见证据** — 成都理工全日制、非全日制研究生；**校本网页原文已核验**。复学第 28 条；退学第 30–32 条。",
      "url": "https://dbxb.cdut.edu.cn/xxgkwz/info/1032/2549.htm",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-005",
      "title": "`CDUT-VERIFIED`；成都理工大学《来华留学生管理规定（试行）》，成理校发〔2022〕26 号 — 2022-08-31 印发；2022-09-01 试行；其他抵触文件以本规定为准；后续版本待校方复核 — 成都理工来华学历留学生，港澳台侨参照；**24 页原文已核验**。第 37 条规定学院办理、国际处备案及因病复查。",
      "url": "https://dbxb.cdut.edu.cn/__local/6/F5/86/E91EEDCF144F4BC5CA934E95F28_8F010406_8B8F6.pdf",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-006",
      "title": "`GENERAL-RESEARCH`；教育部办公厅《关于进一步做好高校学生参军入伍工作的通知》，教学厅〔2015〕3 号 — 2015-04-30 官方发布；后续废止未见证据 — 全国高校退役学生支持政策；**教育部原文已核验**。退役复学后“经学校同意并履行相关程序”可转专业，**不是免审批**。",
      "url": "https://www.moe.gov.cn/srcsite/A15/s7063/201504/t20150430_189485.html",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-007",
      "title": "`CDUT-VERIFIED`；成都理工大学教务处《2025 年银一丁 1 名同学退役复学申请转专业信息》及同意通知 — 2025-03-25；个案通知，无普遍生效/废止属性 — 成都理工**单个本科退役复学后转专业**；**原始通知已核验**。证明存在该个案、学院审查/教务复核/公示及后续事务，不推广为复学统一审批流程。",
      "url": "https://aao.cdut.edu.cn/__local/F/E6/1D/BC8B0C24229BFCFE5E6E058807D_B562DF0F_1388B.pdf",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-008",
      "title": "`CDUT-VERIFIED`；成都理工大学教务处《科室设置》—学籍管理科职责 — 页面现显示职责，未见明确发布时间和生效日 — 本科日常学籍、电子注册、学籍档案；**网站职责正文已核验**，不等于个案批准权限。",
      "url": "https://aao.cdut.edu.cn/jgsz/kssz.htm",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-009",
      "title": "`CDUT-VERIFIED`；成都理工大学宜宾校区《教务工作部部门职责》 — 2026-04-10 发布；非制度生效日 — 宜宾校区属地学籍办理；**职责正文已核验**，不凌驾于校级审批规定。",
      "url": "https://yb.cdut.edu.cn/info/1091/4509.htm",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-010",
      "title": "`CURRENTITY-UNKNOWN`；成都理工大学教务处《申请休学（保留学籍）办理流程》 — 2018-09-13 发布；后续是否更新不明 — **休学/保留学籍**而非复学，页面文本已检索但**现行效力待核**；只能证明旧入口及学院办公室线索，不能反推 2026 复学办理流程。",
      "url": "https://aao.cdut.edu.cn/info/1185/2200.htm",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-011",
      "title": "`CDUT-VERIFIED`；成都理工大学党政办公室《校长办公会纪要〔2026〕5 号》 — 会议 2026-04-01；通报 2026-04-03 — 学校已审定修订**中外合作办学学生学籍管理办法**相关事宜；**原文已核验**，但不含复学条款或新法生效日。",
      "url": "https://dbxb.cdut.edu.cn/__local/4/8E/44/37108469BC7B14AE48968442947_7DD7FA82_121AB.pdf",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-012",
      "title": "`CURRENTITY-UNKNOWN`；成都理工大学国际教育学院《管理制度》目录中的《关于印发〈成都理工大学中外合作办学学生学籍管理办法〉的通知》 — 目录显示 2026-06-08；正文发布/生效/废止细节未取到 — 中外合作办学项目，**目录标题已核验、规范全文未核验**。可能替代 2022 旧版本；本 ID 暂不得设置此分支自动硬规则。",
      "url": "https://cie.cdut.edu.cn/jyjx/zwhzbxgl/glzd.htm",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-013",
      "title": "`CURRENTITY-UNKNOWN`；成都理工大学《学生选课管理办法》 — 网页可读的历史规章；文件引用已废止的成理校教〔2017〕17 号，**现行性不明** — 涉及复学后的补选/退选课程；**文本文字已核验、当前是否适用未核**，不得自动要求教师/学院/教务处旧表单签章。",
      "url": "https://www.aao.cdut.edu.cn/__local/0/FD/0F/3135F978A388AEEF10442AC1944_5B5A90BC_39C55.pdf?e=.pdf",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-014",
      "title": "`CDUT-VERIFIED`；成都理工大学财务处《“只跑一次”办理事项清单》 — PDF 可公开读取；目录元数据的生成/修订日期未明确；后续版本待核 — 财务处“学籍异动办理”列复学通知单、复学证明复印件两份；**清单内容已核验**，仅属于正式复学**之后**的财务办理，不是复学申请材料。",
      "url": "https://jcc.cdut.edu.cn/__local/8/A8/96/748E97CB5061A750C78C9A841EF_9631E851_E5400.pdf",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-015",
      "title": "`CDUT-VERIFIED`；成都理工大学《研究生国家助学金管理办法》，成理校研〔2024〕40 号 — 2024-07-07 印发并执行，废止成理校学〔2017〕107 号；后续变更未见 — 成都理工研究生**下游资助**；**原文已核验**。复学后次月恢复发放的事实，不能作为复学资格条件。",
      "url": "https://cnae.cdut.edu.cn/40haochengdouligongdaxueyanjiushengguojiazhuxuejinguanlibanfa.pdf",
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
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R004",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R006",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R007",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R008",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R011",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R012",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R013",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R014",
      "srcIds": [
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R015",
      "srcIds": [
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R016",
      "srcIds": [
        "SRC-002",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R017",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R018",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R019",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R020",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R021",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R022",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R023",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R024",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R025",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R026",
      "srcIds": [
        "SRC-002",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R027",
      "srcIds": [
        "SRC-002",
        "SRC-006",
        "SRC-007",
        "SRC-014",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R029",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ],
  "exceptionRouteNotes": [],
  "publicationGuard": "Integration Owner must register this research template as candidate-held (for example via saveAuthoringCandidateDraft); the R02_RESEARCH_TEMPLATE_NONOFFICIAL sourceNote prefix is not recognized by template-store.isCandidateDraft in the current shared code."
} as const
