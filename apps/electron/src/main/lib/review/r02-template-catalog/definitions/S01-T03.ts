import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "S01-T03",
  "version": 1,
  "schemaVersion": 2,
  "name": "保留入学资格、保留学籍与应征入伍保留资格审核",
  "description": "本地研究模板 · 非校方正式模板。用于“保留入学资格、保留学籍与应征入伍保留资格审核”的事实、材料和来源核验；未确认政策条件一律进入本地人工复核，不产生校方正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 非成都理工大学校方正式模板；源文档 docs/design/review-agent/business-templates/R02/S01-T03.md；SHA-256 9eef12553162d4c4948e7d865ca6001cb23c929e88ebf53d52a912b009adb356；研究/政策证据状态 PARTIAL。校方现行规则、特殊身份适用及签批权限未完全确认；不得生成校方正式批准/拒绝，不连接学校远端回写。",
  "objectType": "person",
  "displayName": {
    "template": "S01-T03 · 保留入学资格、保留学籍与应征入伍保留资格审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · Case.case_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F001。原始定义：`Case.case_ref` 唯一案卷版本化引用 | P1–P8 | 可信案卷服务 | 受理元数据、M024 | L1 | 尚未建案可在P0为空；P1缺失则不得串案(NM)。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F001；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F002",
      "label": "F002 · Case.scenario",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F002。原始定义：`Case.scenario` C-A/B1/B2/C/D/E/F1/F2/F3/G1/G2/G3/H1/H2 | P0–P8 | 有权招生/学籍状态结合请求，人工确认 | M001/M002/M004/M005；SRC-002–010 | L1 | 身份未定为PC/CF，禁止强制选入伍。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F002；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F003",
      "label": "F003 · Person.filing_capacity",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F003。原始定义：`Person.filing_capacity` 本人/法定情形代理/待核 | P1–P3 | 可信身份认证与授权 | M003/M013/M014；SRC-004 | L2 | 代理权限无据HR，不能当本人签署。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F003；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F004",
      "label": "F004 · Person.subject_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F004。原始定义：`Person.subject_ref` 被办理学生/新生内部身份键 | P1–P8 | 招录或学籍底账/可信鉴权 | M003/M004/M005；SRC-001–003 | L3 | 不匹配CF；权威系统断连SU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F004；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F005",
      "label": "F005 · Person.legal_name",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F005。原始定义：`Person.legal_name` 法定姓名及校方记载版本 | P1–P8 | 有权录取/学籍身份库 | M003/M004/M005；G01更正决定 | L2 | OCR差异CF；需G01校正，不覆盖官方值。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F005；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F006",
      "label": "F006 · Person.identity_credential",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F006。原始定义：`Person.identity_credential` 证件类型及最小必要校验标识 | P1–P3 | 可信身份核验、证件原件 | M003/M013；SRC-004 | L3 | 不能读取UNREADABLE，缺可验证身份NM/HR；不公开全号。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F006；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F007",
      "label": "F007 · Person.proxy_authorization",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F007。原始定义：`Person.proxy_authorization` 代理人身份/授权范围及有效期 | P1–P3（仅代理） | 经核证本人授权/军地可接受的代办 | M013/M014；SRC-004第3条 | L3 | 无代理则不适用；有代理但无权威凭证HR。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F007；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F008",
      "label": "F008 · Admission.level",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F008。原始定义：`Admission.level` 本科/硕士/博士/国际学历生 | P0–P8 | 招录底账或学籍底账 | M004/M005；SRC-002/003/010 | L2 | 无可信来源SU/PC；勿套其他学段表。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F008；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F009",
      "label": "F009 · Admission.cohort",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F009。原始定义：`Admission.cohort` 录取年度、批次、学习方式 | P1–P5 | 学校相应年度招生记录 | M004；SRC-008/009（仅2026硕士） | L2 | 批次不明PC；禁止用2026时限套2027。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F009；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F010",
      "label": "F010 · Admission.admission_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F010。原始定义：`Admission.admission_ref` 招生录取/拟录取权威编号 | P1–P5（仅新生） | 校招生/研招底账 | M004；SRC-002/003/004 | L2 | `C-B1`录取前可仅有拟录取标识；不能强制正式编号ND。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F010；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F011",
      "label": "F011 · Admission.admission_phase",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F011。原始定义：`Admission.admission_phase` 拟录取/正式录取/取消及权威事件日 | P1–P5（新生） | 招生/录检真实记录 | M004；SRC-008/009 | L2 | 当前尚未形成正式录取非缺件，状态矛盾CF。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F011；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F012",
      "label": "F012 · Enrollment.registration_status",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F012。原始定义：`Enrollment.registration_status` 未取得学籍/在籍/历史/未知 | P0–P8 | 校学籍底账+实际注册时点 | M005；SRC-001/002/003 | L2 | 与申报身份不符CF，决定C-C还是C-D/E须HR。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F012；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F013",
      "label": "F013 · Enrollment.enrollment_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F013。原始定义：`Enrollment.enrollment_ref` 学号/学籍权威版本键 | P1–P8（仅在籍） | 有权限学籍系统 | M005；SRC-002/003/010 | L2 | 未注册新生为ND，不可强迫报学号；在籍源断联SU。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F013；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F014",
      "label": "F014 · AdmissionOrEnrollment.program",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F014。原始定义：`AdmissionOrEnrollment.program` 所属学院/专业/培养单位 | P1–P5 | 校方招生/学籍底账 | M004/M005；SRC-002/003/010 | L2 | 跨学院材料疑归属时CF/HR。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F014；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F015",
      "label": "F015 · Request.retention_reason",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F015。原始定义：`Request.retention_reason` 普通新生/正式入伍/学校联培/校本其他 | P0–P5 | 本人陈述+相关签发事实 | M001/M002/M006/M007/M009/M015/M026；SRC-002–005/010 | L2 | 只陈述无证据时NM/HR；不能自动判“其他原因合格”。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F015；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F016",
      "label": "F016 · Request.first_submitted_at",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F016。原始定义：`Request.first_submitted_at` 申请人提交/县办初收时点 | P1–P8 | 收件时间戳、带签收凭证 | M001/M002/M009/M011；SRC-004/008 | L2 | 时点不明PC/HR；电子创建日≠正式递交日。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F016；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F017",
      "label": "F017 · Request.proposed_start",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F017。原始定义：`Request.proposed_start` 申请拟保留起始日 | P1–P5（需用时） | 本人申请与校方计划 | M001/M002/M006；SRC-002/003 | L2 | 未证实起算规则PC；不得按本人填写生效。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F017；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F018",
      "label": "F018 · Request.proposed_end_or_length",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F018。原始定义：`Request.proposed_end_or_length` 期望期限/截止日 | P1–P5（需用时） | 申请书+现行适用政策+学校决定 | M001/M002；SRC-002/003/004 | L2 | 期限仅供人审，旧规现行性未知PC，不能自动延长。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F018；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F019",
      "label": "F019 · Request.other_reason_support",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F019。原始定义：`Request.other_reason_support` 特殊/健康事由证明及必要性标记 | P1–P4（事由触发） | 学校明确要求的有权机构文件 | M007/M008；SRC-001/002/003 | L3 | 学校尚未确定材料门槛PC；不索取无关诊断或病史。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F019；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F020",
      "label": "F020 · MilitaryEvent.conscription_authority",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F020。原始定义：`MilitaryEvent.conscription_authority` 入伍县级机关识别与辖区 | P1–P5（入伍） | 真实军地签发/核对机关 | M009/M010/M011；SRC-004 | L3 | 仅报名地点不等于有权发文机构CF/HR。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F020；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F021",
      "label": "F021 · MilitaryEvent.enlistment_approved",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F021。原始定义：`MilitaryEvent.enlistment_approved` 已批准/待定/未批准及事件日 | P1–P5（入伍） | 有权征兵机关正式决定 | M010/M012；SRC-004/007 | L3 | 报名页不足，待审批时ND而非PASS_FACT。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F021；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F022",
      "label": "F022 · MilitaryEvent.enlistment_notice",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F022。原始定义：`MilitaryEvent.enlistment_notice` 《入伍通知书》编号/签发日期 | P1–P5（已批准入伍） | 军地正式通知书核验 | M010/M012；SRC-004/005/007 | L3 | 缺件NM；照片不可读UNREADABLE，未核原发机关HR。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F022；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F023",
      "label": "F023 · MilitaryEvent.freshman_reserved_forms",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F023。原始定义：`MilitaryEvent.freshman_reserved_forms` 新生入伍专表份数、县办章与时点 | P1–P4（C-C） | 县征兵办正式表格/印章核验 | M009；SRC-004第3–5条 | L3 | 学生仅咨询阶段ND；办证中待军地提交，不归责申请人。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F023；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F024",
      "label": "F024 · MilitaryEvent.dispatch_receipt",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F024。原始定义：`MilitaryEvent.dispatch_receipt` 县办致函编号/寄送与高校收文日 | P2–P5（C-C） | 县级机关公函+学校收文登记 | M011；SRC-004第5条 | L3 | 县已寄/校未收到须SU或HR，不能判学校拒批。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F024；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F025",
      "label": "F025 · Cooperation.project_authorization",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F025。原始定义：`Cooperation.project_authorization` 校组织项目/联合培养批准引用 | P1–P5（C-F1/2/3） | 校内项目主管正式计划及授权 | M015/M017；SRC-002/003/010 | L2 | 私自赴他校或缺校方组织证据则HR/PC。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F025；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F026",
      "label": "F026 · Cooperation.study_period",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F026。原始定义：`Cooperation.study_period` 联培计划开始/结束、修改版本 | P1–P7（C-F） | 学校项目合同/正式调整 | M015/M016/M017；SRC-002/003/010 | L2 | 日期不一致CF，后续延期不能自动转保留延期。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F026；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F027",
      "label": "F027 · SchoolDecision.decision_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F027。原始定义：`SchoolDecision.decision_ref` 学校保留决定/通知编号 | P5–P8 | 有权限正式签发/存档记录 | M018；SRC-004第6条、校本规定 | L2 | P1–P4=ND；不能凭模型产出创建编号。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F027；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F028",
      "label": "F028 · SchoolDecision.authorized_signer",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F028。原始定义：`SchoolDecision.authorized_signer` 真 Actor、权限依据及签发机构版本 | P4–P8 | Main/宿主可信身份授权+校文书 | M018；SRC-003/004/005 | L3 | 无权验证则HR；手填“学院批准”不可信。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F028；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F029",
      "label": "F029 · SchoolDecision.legal_effect",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F029。原始定义：`SchoolDecision.legal_effect` 正式结论/生效期/送达时点 | P5–P8 | 校方签发决定与送达记录 | M018；SRC-001/002/003 | L2 | P1–P4=ND；文书与系统不一致CF，不自动覆盖。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F029；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F030",
      "label": "F030 · Enrollment.sync_event",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F030。原始定义：`Enrollment.sync_event` 学校/主管平台录取或学籍状态更新记录 | P6–P8 | 授权内部学籍信息、真实同步回执 | M019；SRC-004第6条 | L2 | 无接口SU，不让申请者截图冒充完成状态。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F030；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F031",
      "label": "F031 · Aftercare.discharge_or_project_end",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F031。原始定义：`Aftercare.discharge_or_project_end` 退役/中途退回/项目实际结束及证明 | P7–P8（后续） | 军地退役文书或学校项目结项 | M020/M025/M017；SRC-004第7–9条、SRC-003 | L3 | 初始P1–P5=ND；起算争议HR，异常服役须人工。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F031；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F032",
      "label": "F032 · Aftercare.return_request_ref",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F032。原始定义：`Aftercare.return_request_ref` 入学/复学申请及时间 | P8（返校） | S01-T02/新生入学正式收件记录 | M021；SRC-002/003/004 | L2 | 首次保留申请=ND；不在本案作复学批准。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F032；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F033",
      "label": "F033 · ReviewEvent.withdrawal_request",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F033。原始定义：`ReviewEvent.withdrawal_request` 撤回请求/接收、是否已生效决定 | P1–P8（主动触发） | 本人受信申请及校方受理 | M023；校本程序待核 | L2 | 请求≠撤销正式决定，程序未知PC/HR。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F033；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F034",
      "label": "F034 · ReviewEvent.appeal_ref",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F034。原始定义：`ReviewEvent.appeal_ref` 异议/申诉所对决定与日期 | P5–P8（主动触发） | 学生申诉机构的实际受理记录 | M022/M023；SRC-001/002/010 | L3 | 无正式决定时仅保留咨询/意见；时限不擅定。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F034；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F035",
      "label": "F035 · Evidence.source_version",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F035。原始定义：`Evidence.source_version` 材料哈希、归属、签发人、时间、OCR来源 | P1–P8 | 收件系统不可覆盖日志/原发机关校验 | M001–M026；SRC-004/012 | L3 | 任何不能校验的替换只生候审版，受影响结论失效。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F035；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F036",
      "label": "F036 · SchoolDecision.prior_authoritative_result",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F036。原始定义：`SchoolDecision.prior_authoritative_result` 既有G01/S01-T02或历史保留正式决定引用 | P1–P8（已有时） | 唯一有权业务域权威记录 | M022；SRC-012仅供G50定位 | L2 | 无历史不需上传；冲突时标CF不能重签。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F036；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F037",
      "label": "F037 · Case.applicable_policy_epoch",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F037。原始定义：`Case.applicable_policy_epoch` 学段、届次对应校本制度与当期通知 | P1–P8 | 校方制度管理/公开官网原件 | SRC-001–010、M004 | L1 | 更新/废止不明PC；不得使用转载SRC-015自动裁定。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F037；本地研究字段，不代表校方正式表单或已接通数据接口。"
    },
    {
      "key": "F038",
      "label": "F038 · Case.conflict_or_manual_review",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段 F038。原始定义：`Case.conflict_or_manual_review` 证据冲突编号、责任主体及解决回执 | P2–P8（异常触发） | 校招录/学籍/军地/项目机关核验回函 | M011/M018/M022/M024；SRC-002–010 | L2 | 未关闭保留CF/HR，不自动采信最近扫描件。未明确的值域、现行校规和签批权限不得推断；涉及权威学籍事实须由可信来源或有权人员复核。",
      "displayHint": "来源字段 F038；本地研究字段，不代表校方正式表单或已接通数据接口。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 普通本科新生书面保留请求",
      "purpose": "新生本人→校方规定收件机构；格式及用章**未知**",
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
        "新生本人→校方规定收件机构；格式及用章**未知**"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 研究生新生书面申请",
      "purpose": "本人→研究生招生/学籍授权受理端；本人书面稿/收件记录",
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
        "本人→研究生招生/学籍授权受理端；本人书面稿/收件记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 · 本人实名核验",
      "purpose": "本人/校方受信认证；证件核验记录，必要时证件原件",
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
        "本人/校方受信认证；证件核验记录，必要时证件原件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 · 学校录取/拟录取底账",
      "purpose": "招生办/研招；官方录取底账、录检/招生记录",
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
        "招生办/研招；官方录取底账、录检/招生记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 · 在校学籍底账",
      "purpose": "教务/研究生/国际生学籍权威部门；校方记录",
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
        "教务/研究生/国际生学籍权威部门；校方记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 · 《成都理工大学学生休学（保留学籍）申请表》",
      "purpose": "在籍本科生→学院办公室；校本表原件字段待取得",
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
        "在籍本科生→学院办公室；校本表原件字段待取得"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "M007 · 普通保留原因的客观佐证",
      "purpose": "事由关联真实出证机构/本人陈述；类型取决校本规则",
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
        "事由关联真实出证机构/本人陈述；类型取决校本规则"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 · 健康/特殊原因的有限医疗支持",
      "purpose": "有资质医疗机构；诊断或校方认可的医学意见",
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
        "有资质医疗机构；诊断或校方认可的医学意见"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 · 入伍新生专用《保留入学资格申请表》（两份）及县办盖章",
      "purpose": "县级征兵办受理，申请人/获允许代理先提交；军地专用表",
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
        "县级征兵办受理，申请人/获允许代理先提交；军地专用表"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 正式《入伍通知书》",
      "purpose": "县级征兵/兵役机关正式文书，校方可核验副本",
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
        "县级征兵/兵役机关正式文书，校方可核验副本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 县办致校招生部门正式公函及收文回执",
      "purpose": "县级征兵办公室→校招生部门；正式函件和校方收文",
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
        "县级征兵办公室→校招生部门；正式函件和校方收文"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 在籍军人入伍批准事实或可核副本",
      "purpose": "军地入伍批准机关；《入伍通知书》或校军地受信记录",
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
        "军地入伍批准机关；《入伍通知书》或校军地受信记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 · 受托人本人证件核验",
      "purpose": "获准代办人/有权军地机关；本人证件核验",
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
        "获准代办人/有权军地机关；本人证件核验"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 委托权限/关系记录",
      "purpose": "本人委托声明及军地受理核实，或正式受理授权",
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
        "本人委托声明及军地受理核实，或正式受理授权"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 学校组织跨校联合培养批准/选派",
      "purpose": "负责跨校项目的校方授权主管单位",
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
        "负责跨校项目的校方授权主管单位"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 《成都理工大学校际交流项目申请表》",
      "purpose": "在籍本科生/校际项目办理部门；2018指南明确表名",
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
        "在籍本科生/校际项目办理部门；2018指南明确表名"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 · 研究生/留学生项目批准与后续项目结束记录",
      "purpose": "研院项目部门/国际交流与合作处、培养单位；项目决议/记录",
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
        "研院项目部门/国际交流与合作处、培养单位；项目决议/记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "M018 · 学校正式保留决定/《保留入学资格通知书》及有效送达记录",
      "purpose": "正式有权学校签发/归档部门",
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
        "正式有权学校签发/归档部门"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "M019 · 已批准后的校方学籍/招录状态回写",
      "purpose": "有权招生、教务、研院及主管平台",
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
        "有权招生、教务、研院及主管平台"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "M020 · 退役证明和实际退役时间",
      "purpose": "部队/退役有权机关",
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
        "部队/退役有权机关"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "M021 · 后续入学/复学请求及审查结果",
      "purpose": "新生/原在校生→招录或S01-T02授权办理部门",
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
        "新生/原在校生→招录或S01-T02授权办理部门"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "M022 · 历史正式决定/身份更正/相关申诉处理引用",
      "purpose": "原有权学校业务部门、G01或S01-T02",
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
        "原有权学校业务部门、G01或S01-T02"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "M023 · 撤回、异议、复核申请",
      "purpose": "本人/授权代理与真正受理机构",
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
        "本人/授权代理与真正受理机构"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "M024 · 材料更正/版本替换、经办回执与权属日志",
      "purpose": "受理系统/有权经办人；上传版本、原件哈希、签收/更改历史",
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
        "受理系统/有权经办人；上传版本、原件哈希、签收/更改历史"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "M025 · 入伍被退回/中途退伍/拒服役等军地异常处理",
      "purpose": "军地有权处理机关，后续阶段的正式处理文书",
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
        "军地有权处理机关，后续阶段的正式处理文书"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "M026 · 在籍研究生/国际学历生的保留学籍申请意思表示及正式收件事实",
      "purpose": "本人→研究生或国际学生有权归口；书面申请/有权受理记录，**具体专用表名称、格式与签批栏未证实**",
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
        "本人→研究生或国际学生有权归口；书面申请/有权受理记录，**具体专用表名称、格式与签批栏未证实**"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules-01",
      "name": "8.2 逐条规则：主体、准入、普通新生申请（R001–R012）",
      "description": "对应源 Markdown 的 08 规则分组；分项内所有结论仅为本地研究预审。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "P1–P3；已有正式申请须绑定同一真实办理主体",
          "requirement": "原稿规则编号/标题：`R001` P1–P3；已有正式申请须绑定同一真实办理主体；触发/适用：SRC-001/SRC-004；F001/F003/F004/F005/F006/F035；M003/M024；来源、字段及材料关联：对受信登录/实名校验与A录取或学籍对象键、D证件的签发和现行有效范围；代理身份不可覆盖本人；更正后的历史证件保留原时点；核验要求：T：同一人证据一致→`PASS_FACT`；同名不同证件/案卷→`CONFLICT`。F：P0未申请→`NOT_APPLICABLE`。U：未核实名→`NEEDS_MATERIAL`，识别不清→`UNREADABLE`，身份源失联→`SOURCE_UNAVAILABLE`；结果与下一步：本人核验窗口；歧义交招生/学籍归口与安全授权岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "P0–P3；需判新生保留入学资格还是在籍保留学籍",
          "requirement": "原稿规则编号/标题：`R002` P0–P3；需判新生保留入学资格还是在籍保留学籍；触发/适用：SRC-001/SRC-002/SRC-003/SRC-004；F002/F008/F010/F011/F012/F013/F014；M004/M005；来源、字段及材料关联：A录取底账的批次与A首次注册/在籍事件按发生日交叉校对；学校后补录入可能晚于真实注册，不能凭“有没有学号”定路由；核验要求：T：未注册且录取成立走C-A/B/C、在籍走C-D/E/F→`PASS_FACT`(路由事实)；记录互斥→`CONFLICT`。F：不涉及这两类状态的纯咨询→`NOT_APPLICABLE`。U：A源失联→`SOURCE_UNAVAILABLE`，行政边界不明→`NEEDS_HUMAN_DECISION`；结果与下一步：招生部门+学籍归口联合核定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "P1–P8；应用具体学段/招录届次政策",
          "requirement": "原稿规则编号/标题：`R003` P1–P8；应用具体学段/招录届次政策；触发/适用：SRC-001/SRC-002/SRC-003/SRC-005/SRC-008/SRC-009/SRC-010/SRC-011/SRC-015；F008/F009/F037；M004/M005；来源、字段及材料关联：A学籍类别/届次映射有效校规原文及生效、废止时间；2017本科SRC-011明确已废止；2026硕士专规仅该批次；转载SRC-015不作校本生效依据；核验要求：T：有权来源且时段正确→`PASS_FACT`(来源适用事实)；发现拿已废止或别届条款套用→`CONFLICT`或人工纠正。F：纯材料可读性检查→`NOT_APPLICABLE`。U：当前有效版本未确认→`POLICY_UNCONFIRMED`；结果与下一步：教务处制度解释人、研究生院、国际处按学段确认",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "P1–P8；姓名/证件/学籍身份有来源差异或正式G01更正",
          "requirement": "原稿规则编号/标题：`R004` P1–P8；姓名/证件/学籍身份有来源差异或正式G01更正；触发/适用：SRC-002/SRC-003/SRC-012；F004/F005/F006/F036/F038；M003/M004/M005/M022；来源、字段及材料关联：比对A身份主记录与D原证件、G01已生效更正版本和变更时间；不能以OCR覆盖权威姓名；历史同人文书保留旧称谓；核验要求：T：核定完全一致→`PASS_FACT`；未解释身份冲突→`CONFLICT`。F：无身份差异且已由R001核实→`NOT_APPLICABLE`。U：G01记录不可达→`SOURCE_UNAVAILABLE`，合法更名关联需人审→`NEEDS_HUMAN_DECISION`；结果与下一步：身份记录归口/G01更正负责人，本案仅回读",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "P1–P3；实际由受托人代办，尤其C-C",
          "requirement": "原稿规则编号/标题：`R005` P1–P3；实际由受托人代办，尤其C-C；触发/适用：SRC-004第3条；F003/F007/F035；M013/M014；来源、字段及材料关联：受托人D证件、本人委托范围、县办受理授权与有效时段逐一核；只将2013办法代理范围用于新生入伍，其他分支需本校另有依据；核验要求：T：获对应机关确认的权限事实→`PASS_FACT`；伪称本人/代办不在授权范围→`CONFLICT`并停签。F：本人自行申请→`NOT_APPLICABLE`。U：证件/授权缺→`NEEDS_MATERIAL`，普通分支是否允许代办→`POLICY_UNCONFIRMED`；结果与下一步：县征兵办（C-C）或校相关受理/身份授权岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "P1–P4；C-A普通本科新生提出保留请求",
          "requirement": "原稿规则编号/标题：`R006` P1–P4；C-A普通本科新生提出保留请求；触发/适用：SRC-001/SRC-002第5条；F008/F015/F016/F017/F018/F035；M001/M004；来源、字段及材料关联：D本人申请及A录取批次/未注册事实关联，同年度核时点；校方本科学段原表未知，不能臆造必须填的栏目；核验要求：T：有可归属申请与录取→`PASS_FACT`(申请存在)，非本人申请而无授权→`CONFLICT`。F：非C-A→`NOT_APPLICABLE`。U：申请全无→`NEEDS_MATERIAL`，本校格式/理由要求无据→`POLICY_UNCONFIRMED`；结果与下一步：本科招生/教务经授权受理方，具体终审人待核",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "P1–P4；2026硕士拟录取/录取者申请普通保留",
          "requirement": "原稿规则编号/标题：`R007` P1–P4；**2026硕士**拟录取/录取者申请普通保留；触发/适用：SRC-003第5条/SRC-008“八”第3项/SRC-009录取(六)；F009/F011/F015/F016/F037；M002/M004；来源、字段及材料关联：A研招批次与受信书面收文时点比较；`录取前提出`与`被录取新生`分别指申请与最终资格，不得提前要求正式录取通知书；仅2026硕士适用；核验要求：T：2026有有效书面申请及录取阶段匹配→`PASS_FACT`(递交事实)；真正收件日期显示不同于官方要求→`NEEDS_HUMAN_DECISION`而非自动拒绝。F：非2026硕士→`NOT_APPLICABLE`。U：书面申请缺→`NEEDS_MATERIAL`，录取阶段无权威回读→`SOURCE_UNAVAILABLE`，规则衔接不明→`POLICY_UNCONFIRMED`；结果与下一步：2026研究生招生办公室、党委研工部/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "P1–P4；非2026硕士或博士新生普通保留",
          "requirement": "原稿规则编号/标题：`R008` P1–P4；非2026硕士或博士新生普通保留；触发/适用：SRC-003第5条/SRC-015仅转载线索；F008/F009/F015/F016/F037；M002/M004；来源、字段及材料关联：D书面申请与A本届招生记录关联；不能从2026硕士复制申请截止；2027转载材料不产生硬门槛；核验要求：T：本届存在申请事实→`PASS_FACT`(递交)，本届政策与申请时点不符时→`NEEDS_HUMAN_DECISION`。F：非此届/学段→`NOT_APPLICABLE`。U：书面申请缺→`NEEDS_MATERIAL`；当期规定未取得→`POLICY_UNCONFIRMED`；结果与下一步：相关年度硕/博士招生单位与研究生院政策岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "P1–P4；普通保留主张依赖特殊/健康事由材料",
          "requirement": "原稿规则编号/标题：`R009` P1–P4；普通保留主张依赖特殊/健康事由材料；触发/适用：SRC-001/SRC-002/SRC-003；F015/F019/F035；M007/M008；来源、字段及材料关联：只比对经校方明确要求的事由材料之签发机构、本人归属及有效期；不采外校医院级别、诊断阈值/完整病史；健康信息L3限访问；核验要求：T：已明确适用的材料确属本申请→`PASS_FACT`(事实存在)，事实矛盾→`CONFLICT`。F：该理由不需额外佐证→`NOT_APPLICABLE`。U：校方没确定哪些证明必需→`POLICY_UNCONFIRMED`；已明确必需却缺→`NEEDS_MATERIAL`；不可读→`UNREADABLE`；结果与下一步：对应招生/学籍政策岗，医疗事实必要时由获授权专业审核人判断",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "P1–P5；C-A普通本科新生拟保留期限",
          "requirement": "原稿规则编号/标题：`R010` P1–P5；C-A普通本科新生拟保留期限；触发/适用：SRC-002第5条/SRC-011废止历史；F009/F017/F018/F037；M001/M004；来源、字段及材料关联：区分申请人拟起止与校方可批准时限；2019条文“一年”先核现行政策与招生届次，不让算法自动生成生效/失效决定；核验要求：T：拟申请期限与已核当期规则相符→`PASS_FACT`(期限算术)；超过或起算争议→`NEEDS_HUMAN_DECISION`。F：非C-A→`NOT_APPLICABLE`。U：有效校本期限尚未确认→`POLICY_UNCONFIRMED`，申请日期缺且被要求→`NEEDS_MATERIAL`；结果与下一步：本科招生/教务政策解释与真正终审岗位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "P1–P5；普通研究生新生拟保留期限",
          "requirement": "原稿规则编号/标题：`R011` P1–P5；普通研究生新生拟保留期限；触发/适用：SRC-003第5条/SRC-009录取(六)；F008/F009/F017/F018/F037；M002/M004；来源、字段及材料关联：现有2021办法和2026硕士章程记载1–2年；按届次确认现行有效期/特殊例外，不能移入入伍新生“退役+2年”规则；核验要求：T：有权有效规定下的期限事实符合→`PASS_FACT`(算术)，相悖→`NEEDS_HUMAN_DECISION`。F：不属普通研究生新生→`NOT_APPLICABLE`。U：博士当期或学校现行细则不明→`POLICY_UNCONFIRMED`；结果与下一步：党委研工部、研究生院及当届研招授权人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "P1–P5；C-C已录取未到校入伍新生需核录取合法性",
          "requirement": "原稿规则编号/标题：`R012` P1–P5；C-C已录取未到校入伍新生需核录取合法性；触发/适用：SRC-004第2/6条/SRC-001；F008/F009/F010/F011/F012/F014；M003/M004；来源、字段及材料关联：由高校招生部门A录取/录检底账确认在入伍时间线上的录取资格、身份及注册状态，军地不能替学校认定合法录取；核验要求：T：录取与本人一致且未注册→`PASS_FACT`(录取事实)；已有学籍→`CONFLICT`并转C-D/E核定。F：不是入伍新生→`NOT_APPLICABLE`。U：招生底账无法访问→`SOURCE_UNAVAILABLE`，资格行政解释需人工→`NEEDS_HUMAN_DECISION`；结果与下一步：学校招生部门；涉及已在籍时联动学籍归口",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-02",
      "name": "8.3 逐条规则：入伍与联合培养权威证据（R013–R022）",
      "description": "对应源 Markdown 的 08 规则分组；分项内所有结论仅为本地研究预审。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "R013",
          "title": "P1–P4；C-C新生入伍是否正式获批",
          "requirement": "原稿规则编号/标题：`R013` P1–P4；C-C新生入伍是否**正式获批**；触发/适用：SRC-004第2–5条/SRC-007；F020/F021/F022/F035；M010/M003；来源、字段及材料关联：以军地D《入伍通知书》与原发机关A核验批准事件日、身份、编号；报名/体检/政审并非批准；不可混同学校保留决定；核验要求：T：正式入伍且人证一致→`PASS_FACT`(入伍事实)；报名截图冒充结果→`NEEDS_HUMAN_DECISION`(未达正式批准证据)。F：非C-C→`NOT_APPLICABLE`。U：未获批尚不存在M010→`NOT_APPLICABLE`于P0并转C-G3；已批准却缺文书→`NEEDS_MATERIAL`；不清→`UNREADABLE`；结果与下一步：县征兵办/入伍原签发机关核证，学校招生部门只读",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "P1–P4；C-C新生正式办理入伍保留专表",
          "requirement": "原稿规则编号/标题：`R014` P1–P4；C-C新生正式办理入伍保留专表；触发/适用：SRC-004第3–5条；F003/F020/F022/F023/F035；M009/M010/M013/M014；来源、字段及材料关联：两份专表与县办签章等形成日期分离：学生起件→县办盖章→向学校寄函。正式批准后对M010人名及军地事实交叉核验；其未完成军地部分不归责学生，代理适用R005；核验要求：T：军地已核专表且归属本录取新生→`PASS_FACT`；份数/学生身份不符→`CONFLICT`。F：非C-C→`NOT_APPLICABLE`。U：起件材料缺→`NEEDS_MATERIAL`；县办仍在办理→`SOURCE_UNAVAILABLE`/机构待办，不能判学生错；结果与下一步：县级征兵办；学校招生部门收文人员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "P2–P5；C-C县办向学校致函、学校实际收文",
          "requirement": "原稿规则编号/标题：`R015` P2–P5；C-C县办向学校致函、学校实际收文；触发/适用：SRC-004第5–6条；F020/F023/F024/F035；M011/M009/M010；来源、字段及材料关联：A军地发文流水与A高校招生收文逐项核时点/编号，区分寄出与送达；国家办法的具体机关法定期限与学校内部签发时间分开；核验要求：T：两端函号及收件一致→`PASS_FACT`(流转事实)；函件收文内容相悖→`CONFLICT`。F：不是C-C或仍P0→`NOT_APPLICABLE`。U：县已发而校方未查到→`SOURCE_UNAVAILABLE`；未发→相关军地待办；不能要求学生提交学校回执；结果与下一步：县征兵办收发文岗及高校招生收文岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "P1–P4；C-D在籍本科生校本保留申请",
          "requirement": "原稿规则编号/标题：`R016` P1–P4；C-D在籍本科生校本保留申请；触发/适用：SRC-002第39条/SRC-005/SRC-006待原表；F012/F013/F015/F016/F017/F018/F035；M005/M006；来源、字段及材料关联：A学籍在籍+ D校本休学(保留学籍)申请表；2018教务处流程指学院办公室受理但签章和现行性未证实；禁止将其作为研究生批准表；核验要求：T：当前在籍且受理申请事实清楚→`PASS_FACT`(申请事实)；错人/错学段→`CONFLICT`。F：非C-D→`NOT_APPLICABLE`。U：缺受理申请→`NEEDS_MATERIAL`，表格版本现行性未核→`POLICY_UNCONFIRMED`，图像不可读→`UNREADABLE`；结果与下一步：本科所在学院办公室及教务处现行流程确认人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "P1–P4；C-E/F2/F3在籍研究生或国际生申请事实",
          "requirement": "原稿规则编号/标题：`R017` P1–P4；C-E/F2/F3在籍研究生或国际生申请事实；触发/适用：SRC-003第25条/SRC-010第35–37条；F003/F008/F012/F015/F016/F017/F018/F035；M005/M026；来源、字段及材料关联：A在籍状态+D书面申请或真实受理记录；**形式字段尚未知**，不能把本科M006当统一校表，国际项目另经对应主管；核验要求：T：申请人/学籍一致且有真实申请记录→`PASS_FACT`(申请事实)，主体错位→`CONFLICT`。F：非此三分支→`NOT_APPLICABLE`。U：完全没有申请事实→`NEEDS_MATERIAL`，校本表格式与办理要求不明→`POLICY_UNCONFIRMED`；结果与下一步：研究生院/培养单位或国际交流与合作处及相应学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "P1–P5；C-F1/F2/F3是否为学校组织跨校联合培养",
          "requirement": "原稿规则编号/标题：`R018` P1–P5；C-F1/F2/F3是否为**学校组织**跨校联合培养；触发/适用：SRC-002第39条/SRC-003第25条/SRC-010第36–37条；F012/F025/F026/F035；M005/M015；来源、字段及材料关联：A学校批准的项目编号、学生选派和合作学校与D项目文件比对；私费访问邀请/外校录取不自动等于CDUT组织；核验要求：T：权威项目与学生和时段一致→`PASS_FACT`(联培事实)；只有私人访学→`NEEDS_HUMAN_DECISION`(学校认定)。F：非联培→`NOT_APPLICABLE`。U：校项目库失联→`SOURCE_UNAVAILABLE`，批准文件读不清→`UNREADABLE`；结果与下一步：项目主管单位，学段相应学籍归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "P1–P4；C-F1本科联培办事表与培养期",
          "requirement": "原稿规则编号/标题：`R019` P1–P4；C-F1本科联培办事表与培养期；触发/适用：SRC-002第39条/SRC-005；F008/F015/F025/F026；M015/M016；来源、字段及材料关联：对照2018教务处所列《校际交流项目申请表》与校方项目起止；2018指南不是2026最新版证明，不能从表单反推校方批准；核验要求：T：当前认可表格与已核项目相符→`PASS_FACT`；与真实项目异主体/异期间→`CONFLICT`。F：非C-F1→`NOT_APPLICABLE`。U：原表缺→`NEEDS_MATERIAL`(待政策确认)，现行格式/期限未知→`POLICY_UNCONFIRMED`；结果与下一步：本科学院办公室、教务处项目授权经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "P1–P7；C-F2/F3研究生或国际生项目批准及期间变化",
          "requirement": "原稿规则编号/标题：`R020` P1–P7；C-F2/F3研究生或国际生项目批准及期间变化；触发/适用：SRC-003第25–26条/SRC-010第36–37条；F008/F025/F026/F031；M015/M017；来源、字段及材料关联：A研究生院或国际交流处项目批准、有效区间与D相关记录核对；P7才可能出现结束/延期证明；普通本科表不适用；核验要求：T：校方相应机构确认项目事实→`PASS_FACT`；无相应校组织授权→`NEEDS_HUMAN_DECISION`。F：非C-F2/F3→`NOT_APPLICABLE`。U：项目机关记录失联→`SOURCE_UNAVAILABLE`，项目签批链/延期效力不明→`POLICY_UNCONFIRMED`；结果与下一步：研究生院项目主管/国际交流与合作处",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "P1–P4；C-D/E在籍学生正式应征入伍",
          "requirement": "原稿规则编号/标题：`R021` P1–P4；C-D/E在籍学生正式应征入伍；触发/适用：SRC-002第39条/SRC-003第25条/SRC-005/SRC-007；F012/F013/F020/F021/F022；M005/M012（可复用M010）；来源、字段及材料关联：A在籍状态与军地D入伍决定/通知的人证及时间逐项比对；本科2018表单适用R016，研究生独立R017；同一入伍文书不得双上传；核验要求：T：本人确已正式入伍→`PASS_FACT`；仅报名/体检阶段→`NEEDS_HUMAN_DECISION`并转C-G3。F：非C-D/E→`NOT_APPLICABLE`。U：文书缺且确已批准→`NEEDS_MATERIAL`，军地核验失联→`SOURCE_UNAVAILABLE`；结果与下一步：军地原签发机关、学校相应学籍部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "P4–P8；因服役/联培确定保留期间及延长申请",
          "requirement": "原稿规则编号/标题：`R022` P4–P8；因服役/联培确定保留期间及延长申请；触发/适用：SRC-001第9条/SRC-002第39–40条/SRC-003第25–28条/SRC-004第7–9条/SRC-010第36–37条；F017/F018/F026/F029/F031/F037；M018/M020/M017；来源、字段及材料关联：区分“退役后2年”保护、联培项目期间、普通新生期限及真实校方决定；退役实际发生在P7以后；项目延期≠自动批准延长；校方仍需确认起算和例外；核验要求：T：只在当前已形成的A/D事件间做时间事实比对→`PASS_FACT`(时间线)，期限/例外争议→`NEEDS_HUMAN_DECISION`。F：尚无具体期间/未到期且未触发此检查→`NOT_APPLICABLE`。U：现行起算政策不明→`POLICY_UNCONFIRMED`，后续退役证明尚未产生→`NOT_APPLICABLE`于P1；结果与下一步：校学籍归口、招生部门或军地/项目有权机关按争议归属核定",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-03",
      "name": "8.4 逐条规则：正式决定、异常、复核和路由（R023–R032）",
      "description": "对应源 Markdown 的 08 规则分组；分项内所有结论仅为本地研究预审。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "R023",
          "title": "P1–P8；当前触发的任一材料需被读取或人工识别",
          "requirement": "原稿规则编号/标题：`R023` P1–P8；当前触发的任一材料需被读取或人工识别；触发/适用：SRC-001/SRC-003/SRC-004（原件证据要求）/SRC-012（技术线索）；F035/F038；M001–M026（仅当前激活子集）；来源、字段及材料关联：以原二进制文件与解析版本校验页码、文本可辨、身份字段和文件哈希；OCR不可替代原件；照片完整性与真实性独立，过时旧版本另存；核验要求：T：当期必要字段可读且来源可辨→`PASS_FACT`(可读性)，文本虽可读却与权威记录冲突由相应R输出`CONFLICT`。F：后续未生成M/不适用槽→`NOT_APPLICABLE`。U：已上传无法解析→`UNREADABLE`；根本未提供当前必需M→`NEEDS_MATERIAL`；权威源失联→`SOURCE_UNAVAILABLE`；结果与下一步：材料提交人（重传/补件）、OCR人工核验员、各原发机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "P4–P6；查询是否已有真实学校决定或准备由有权人签发",
          "requirement": "原稿规则编号/标题：`R024` P4–P6；查询是否已有**真实学校决定**或准备由有权人签发；触发/适用：SRC-001/SRC-002/SRC-003/SRC-004第6条/SRC-005/SRC-012（仅架构）；F027/F028/F029/F035；M018；来源、字段及材料关联：将A校方公文/审批原簿与D签章文件、当期组织授权/可信Main actor核对，区分**决定签发、送达、异动入账**三个事件；Renderer传role及模型建议一律不升格；核验要求：T：核到真实有权签发和决定文号、日期→`PASS_FACT`(已有决定事实)，但不是本Agent批准；发现伪造/无授权声明→`CONFLICT`及权限待核。F：尚P1–P3且无决定→`NOT_APPLICABLE`。U：签署机构/权限未知→`NEEDS_HUMAN_DECISION`，校方原文书不可达→`SOURCE_UNAVAILABLE`；结果与下一步：新生由招生或研院授权签发方、在籍由相应学籍授权岗位；人工制度岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "P6–P8；已有真实决定，需要比对权威状态回写",
          "requirement": "原稿规则编号/标题：`R025` P6–P8；已有真实决定，需要比对权威状态回写；触发/适用：SRC-004第6条/SRC-002/SRC-003；F012/F027/F029/F030/F035；M018/M019；来源、字段及材料关联：A决定有效时点与A招录、学籍/主管平台回写流水比较；网络延迟、学校系统与学信网时点不齐不等于撤销决定；核验要求：T：决定与回写同一对象/状态一致→`PASS_FACT`(同步事实)；状态错人或相反→`CONFLICT`。F：决定尚未产生(P1–P4)→`NOT_APPLICABLE`。U：后台/外部平台失联→`SOURCE_UNAVAILABLE`；是否允许更正需原系统人工判；结果与下一步：学校招生/教务/研院信息归口，必要时联系主管平台",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "P7–P8；已获保留后退役、联培结束、计划回校",
          "requirement": "原稿规则编号/标题：`R026` P7–P8；已获保留后退役、联培结束、计划回校；触发/适用：SRC-002第40条/SRC-003第28条/SRC-004第7条/SRC-010第37条；F027/F029/F031/F032/F036；M018/M017结束部分/M020/M021；来源、字段及材料关联：A原保留批准+D退役/项目结束与返校另案A收件按日期关联；研究生“期满前2周”属后续复学，C-C新生返校属入学，二者不能互作批准；核验要求：T：历史与结束事件真实可回引→`PASS_FACT`(后续路由事实)，时间风险只提示人工。F：仍在首次申请/保留未生效→`NOT_APPLICABLE`。U：退役尚未发生→`NOT_APPLICABLE`于P1，旧校方决定失联→`SOURCE_UNAVAILABLE`，起算与入学争议→`NEEDS_HUMAN_DECISION`；结果与下一步：S01-T02复学归口或新生招生入学部门，仅只读原保留决定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "P7–P8；军地中途退回、入伍取消、拒服役或其他例外事实",
          "requirement": "原稿规则编号/标题：`R027` P7–P8；军地中途退回、入伍取消、拒服役或其他例外事实；触发/适用：SRC-004第8–9条/SRC-001/SRC-002/SRC-003；F021/F031/F038；M025/M020/M022；来源、字段及材料关联：A军地异常决定与D材料核验“何时、何种原因、谁签发”，再由校方有权者解释保留资格的法律效果；不得拿一般退役+2年覆盖专门例外；核验要求：T：异常事件事实可核→`PASS_FACT`(军地事实)，**学籍效果仍`NEEDS_HUMAN_DECISION`**。F：普通持续服役或无异常→`NOT_APPLICABLE`。U：军事原始机关结果失联→`SOURCE_UNAVAILABLE`、处理归类不清→`POLICY_UNCONFIRMED`；结果与下一步：军地有权机关核事实，学校招生/学籍和合法性审查岗核后果",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "P1–P8；存在历史决定、G01身份更正、S01-T01休学或S01-T02复学等相邻正式结果",
          "requirement": "原稿规则编号/标题：`R028` P1–P8；存在历史决定、G01身份更正、S01-T01休学或S01-T02复学等相邻正式结果；触发/适用：SRC-012/SRC-013/SRC-014（技术与目录，非政策）+SRC-001/SRC-002/SRC-003；F005/F012/F027/F036；M022/M018；来源、字段及材料关联：只读原业务权威决定ID、版本、生效及撤销记录；不从G50技术候选推断已正式签发。S01-T01休学实体、S01-T02复学实体、G01身份字段纠正均不由本模板二次决定；核验要求：T：相关有效先决事实已核→`PASS_FACT`(引用关系)，冲突/互斥异动→`CONFLICT`。F：确无历史或相邻决定→`NOT_APPLICABLE`。U：原系统不可达→`SOURCE_UNAVAILABLE`，R02边界尚未核对→`POLICY_UNCONFIRMED`；结果与下一步：原决定Owner/G01/S01-T01/S01-T02，对本案只供引用",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "P2–P8；任一上传材料或权威源发生替换/更正版",
          "requirement": "原稿规则编号/标题：`R029` P2–P8；任一上传材料或权威源发生替换/更正版；触发/适用：SRC-012（技术快照只作设计边界）、SRC-001/SRC-002/SRC-003（决定不可自造）；F001/F035/F038；M024及实际更改的M；来源、字段及材料关联：比较旧/新SHA、原发者、对象、时点、权威来源版本；按8.5依赖表把所有依赖该版本的**事实R**失效后重算，正式校方决定不自动撤销；核验要求：T：版号变更且来源真实→`PASS_FACT`(版本事件)，受影响旧规则结果标`SUPERSEDED`仅作为元数据而非第九种结果码；F：没有版本变更→`NOT_APPLICABLE`。U：无法确定来源归属→`CONFLICT`/`NEEDS_HUMAN_DECISION`；结果与下一步：受信案卷Owner执行定向重审；各原发机关处理真伪",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "P1–P8；本人申请撤回、重提或重复案",
          "requirement": "原稿规则编号/标题：`R030` P1–P8；本人申请撤回、重提或重复案；触发/适用：SRC-001/SRC-003/SRC-004（相关法定决定边界）/SRC-012（技术）；F001/F016/F027/F029/F033/F035/F036；M023/M022/M024；来源、字段及材料关联：绑定撤回请求与案卷、当事人和请求接收时点，查是否已有校方决定；重新提交形成新申请/事件引用原版本，不能无痕覆盖前案；一般撤回生效点校本无据；核验要求：T：受信本人确有撤回或重提请求→`PASS_FACT`(请求事实)，但接受/生效仍`NEEDS_HUMAN_DECISION`；同一案冲突→`CONFLICT`。F：无人撤回/重提→`NOT_APPLICABLE`。U：书面请求缺→`NEEDS_MATERIAL`（以校方确需书面为前提），正式撤回政策未知→`POLICY_UNCONFIRMED`；结果与下一步：原受理经办、作成决定的校方有权岗，重提交案卷Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "P5–P8；已有有权学校决定且申请人请求申诉/复核",
          "requirement": "原稿规则编号/标题：`R031` P5–P8；已有有权学校决定且申请人请求申诉/复核；触发/适用：SRC-001第59–65条/SRC-002第59条/SRC-010第70条；F027/F029/F034/F035/F036；M018/M022/M023；来源、字段及材料关联：A原决定/送达日期、D申诉意思和A申诉收文关联；2019/2022具体适用申诉校规未全核，不能自设5/10/15天或以复议AI输出撤销；核验要求：T：可确认有人针对正式决定提出请求→`PASS_FACT`(申请事实)，真实受理资格/法律效果`NEEDS_HUMAN_DECISION`。F：尚无正式决定或未提出异议→`NOT_APPLICABLE`。U：申诉原件不可读→`UNREADABLE`，申诉程序现行性未知→`POLICY_UNCONFIRMED`；结果与下一步：学校学生申诉处理机构、法定复核/申诉机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "P0–P8；收到兵役资助、学费代偿、G01证明用印、身份更正、退学等异目的材料/请求",
          "requirement": "原稿规则编号/标题：`R032` P0–P8；收到兵役资助、学费代偿、G01证明用印、身份更正、退学等**异目的**材料/请求；触发/适用：SRC-007/SRC-012/SRC-013/SRC-014；F002/F015/F036；M001/M024（本案入口所收申报文件）、M022（有历史权威结果时）；来源、字段及材料关联：解析请求目的与实际权限对象，相关财政/学籍变更/单纯开证明均转其Owner；不得仅因材料出现入伍字样就推导学籍批准或资助批准；核验要求：T：目标确属他业务→`PASS_FACT`(路由识别)并另案，不给本案审批结论。F：目标仍是S01-T03保留→`NOT_APPLICABLE`。U：目的无法辨清→`NEEDS_HUMAN_DECISION`；R02全目录未核→`POLICY_UNCONFIRMED`；结果与下一步：对应G50、S/T或学校资助中心；本模板只回引其有效结论",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "p0",
      "name": "本地研究预审 · P0 意向/预咨询",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "p1",
      "workflowOwner": "local"
    },
    {
      "id": "p1",
      "name": "本地研究预审 · P1 申请/军地起件",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p2",
      "workflowOwner": "local"
    },
    {
      "id": "p2",
      "name": "本地研究预审 · P2 收文、验身、校内归属核对",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p3",
      "workflowOwner": "local"
    },
    {
      "id": "p3",
      "name": "本地研究预审 · P3 补件/冲突复核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p4",
      "workflowOwner": "local"
    },
    {
      "id": "p4",
      "name": "本地人工复核（不签发校方决定）· P4 有权部门审核/人工裁量",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "p5",
      "workflowOwner": "local"
    },
    {
      "id": "p5",
      "name": "本地人工复核（不签发校方决定）· P5 决定/签发/送达",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "p6",
      "workflowOwner": "local"
    },
    {
      "id": "p6",
      "name": "本地研究预审 · P6 学籍/招录系统状态入账",
      "kind": "handoff",
      "executorRole": "reviewer",
      "nextStageId": "p7",
      "workflowOwner": "local"
    },
    {
      "id": "p7",
      "name": "本地研究预审 · P7 保留期间事件跟踪",
      "kind": "handoff",
      "executorRole": "reviewer",
      "nextStageId": "p8",
      "workflowOwner": "local"
    },
    {
      "id": "p8",
      "name": "本地研究预审 · P8 返校/入学、正式不利处理与申诉",
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
  "templateId": "S01-T03",
  "name": "保留入学资格、保留学籍与应征入伍保留资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S01-T03.md",
  "researchOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/S01-T03.md",
  "sourceDocumentSha256": "6aece78d3e3277bf9201d2d800e4dd9d3de268fe1cfbc1abebccea6a70d71bdb",
  "officialSchoolTemplate": false,
  "researchStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "sourceSnapshotDate": "2026-10-23",
  "sourceIntegrity": "manifest SHA-256 for source blob plus one terminal LF, per dispatch integrity note",
  "sources": [
    {
      "srcId": "SRC-001",
      "title": "`GENERAL-RESEARCH`｜教育部《普通高等学校学生管理规定》（教育部令第41号） — 2017-02-16 网页；2017-09-01 施行，替代第21号令；未见后续废止 — 全国普通高校本、研上位规则。**已核关键原文**（官方教育部页面与校数学学院同文）。规定新生保留资格期间无学籍、入伍应保留至退役后2年，申诉与不利处理须依法办理。",
      "url": "https://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201702/t20170216_296385.html",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-002",
      "title": "`CDUT-VERIFIED`｜成都理工大学《全日制普通本科学生学籍管理办法》（成理校教〔2019〕18号） — 2019-12-31 发布；2020-01-01 施行；明确废止2017年第17号，是否再被后规替代**待复核** — 全日制普通本科；特殊本科群体在第二条写“参照”。**已核 18页原文**；新生一年、入伍保留至退役后2年，在籍入伍时间不计修业年限。",
      "url": "https://dbxb.cdut.edu.cn/__local/7/B6/E5/006AC04D88A214D1AD8B1F5E540_16B4A5B7_C543C.pdf",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-003",
      "title": "`CDUT-VERIFIED`｜成都理工大学《研究生学籍管理办法》（成理校研〔2021〕13号） — 2021-06-16 签发；2023-04-12 网页公开；2021-09-01 施行且废止2019年第32号；后续是否修订待复核 — 全日制及非全日制研究生。**已核官网原文相关条款**；保留入学资格由研工部/研究生院审核；在籍入伍及联合培养保留学籍。官网直开出现 412，检索到完整相关原文但暂未本地留存签发附件。",
      "url": "https://dbxb.cdut.edu.cn/xxgkwz/info/1032/2549.htm",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-004",
      "title": "`GENERAL-RESEARCH`｜教育部、总参谋部《应征入伍普通高等学校录取新生保留入学资格及退役后入学办法（试行）》（教学〔2013〕8号） — 2013-07-17 发布；本轮未见独立生效/废止条款，当前适用性须按主管机关最新解释复核 — 国家专门规定，**已核原始页面全文正文**。区分新生与在籍、允许特定委托办理、县征兵办向招生部门流转、学校出具通知；退役后的入学在另一步。",
      "url": "https://www.moe.gov.cn/srcsite/A15/s3265/201307/t20130717_154482.html",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-005",
      "title": "`CDUT-VERIFIED`｜成都理工大学教务处《申请休学（保留学籍）办理流程》 — 2018-09-13；生效/废止未载明；**2019新本科办法之后是否更新未知** — 大概率面向普通本科在校生；**已核官网完整办事条目**：学院办公室收件、学校表格、入伍通知书或校际交流项目申请表。不得自动推广至研究生。",
      "url": "https://aao.cdut.edu.cn/info/1185/2200.htm",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-006",
      "title": "`CURRENTITY-UNKNOWN`｜成都理工大学材料与化学化工学院资料下载《成都理工大学学生休学（保留学籍）申请表》 — 2019-07-05 索引；原表版本与替代/废止状态不明 — 仅证明曾有校本表，**正文未核实**；不可从表名推定院长/教务处签字栏或提交材料清单。下一轮提取原表并向教务处确认现行性。",
      "url": "https://cmcc.cdut.edu.cn/index/zlxz.htm",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-007",
      "title": "`CDUT-VERIFIED`｜成都理工大学党委保卫部（保卫处、人民武装部）《2026年上半年征兵，正在报名！》 — 2026-01-23；适用于2026上半年征兵告知，**不能跨批次当常设期限** — **已核当期公告相关正文**。取得《入伍通知书》后用于学籍保留、资助等；征兵审批与学籍/资助审批分离。",
      "url": "https://www.cdut.edu.cn/info/1064/22308.htm",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-008",
      "title": "`CDUT-VERIFIED`｜成都理工大学研究生院《成都理工大学2026年硕士研究生招生复试录取工作办法》 — 2026-03-26；只适用2026年硕士录取批次；下年度须重查 — **已核当期原文关键段**：保留入学资格须在录取前书面申请，学校审核同意。不可据此推断博士或所有年度同一期限。",
      "url": "https://gra.cdut.edu.cn/info/1074/5775.htm",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-009",
      "title": "`CDUT-VERIFIED`｜成都理工大学研究生院《成都理工大学2026年硕士研究生招生章程》 — 2025-09-26；适用2026硕士招生年度；下一年度应以当年新章程替换 — **已核相关正文**：被录取新生经学校审查可保留一至二年，期间无学籍。其“被录取后可申请”与 SRC-008“录取前书面”需结合真实招生流程解释。",
      "url": "https://gra.cdut.edu.cn/info/1074/5442.htm",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-010",
      "title": "`CDUT-VERIFIED`｜成都理工大学《来华留学生管理规定（试行）》（成理校发〔2022〕26号） — 2022-08-31；2022-09-01 试行；未见后续废止 — 适用于持外国护照、在校注册的来华学历学生等，**已核24页原文**；跨校联合培养保留学籍；申诉引用2022年第24号。不能硬套普通本科或国民入伍规定。",
      "url": "https://dbxb.cdut.edu.cn/__local/6/F5/86/E91EEDCF144F4BC5CA934E95F28_8F010406_8B8F6.pdf",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-011",
      "title": "`CDUT-VERIFIED`｜成都理工大学《全日制普通本科学生学籍管理办法（试行）》（成理校教〔2017〕17号） — 2017发布；**2020-01-01 被新本科办法明确废止** — **已核历史存在与废止**；仅用于旧案例追溯，绝不作为2026硬规则来源。",
      "url": "https://cmp.cdut.edu.cn/__local/5/8C/5D/CB1295C548BB5C63428A98CF31B_B118AFC5_7A92E.pdf",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-012",
      "title": "`GENERAL-RESEARCH`｜`Fuck-GH-Admin/cdut-studio-review-agent` D4 G50 技术清单 — `docs/design/review-agent/acceptance/d4-unified-r01/catalog.json` @ `7b6cdc843d26e926c0c63b8c51a451ff3925cfad`；`templateCount`、`domainCounts`、`publicationAllowed`、`authoritativeSchoolTemplate`、`templates` — 固定 SHA 的技术快照；无“法规生效”概念 — **已核真实仓库 JSON*",
      "url": null,
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "NO_DIRECT_URL_IN_INDEX"
    },
    {
      "srcId": "SRC-013",
      "title": "`CURRENTITY-UNKNOWN`｜R02 总账《ST-CANDIDATE-MASTER-CATALOG-R02.md》 — 用户指派文件名；本轮会话本地目录、固定技术 SHA 目录及文件检索未取得原文 — R02 修订时间不明；生效/废止不适用 — **未核到原件**；按派单固定 `S01-T03` 与 S72+T72，不推导所有相邻 S/T 的具体编号或去向。",
      "url": null,
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "NO_DIRECT_URL_IN_INDEX"
    },
    {
      "srcId": "SRC-014",
      "title": "`CURRENTITY-UNKNOWN`｜R02 对照《ST-CATALOG-AUDIT-R02.md》 — 用户指派文件名；本轮会话本地目录、固定技术 SHA 目录及文件检索未取得原文 — R02 时间不明；生效/废止不适用 — **未核到原件**；原116项的去重/拆并裁决尚需逐条比对。现只确认 G50 技术清单中几个字面相邻目的。",
      "url": null,
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "NO_DIRECT_URL_IN_INDEX"
    },
    {
      "srcId": "SRC-015",
      "title": "`GENERAL-RESEARCH`｜教育在线转载《成都理工大学2027年硕士研究生招生章程》 — 转载2026-10-08；原校方发布/最终生效版本不明 — **未核到成都理工大学官方同名原件**；转载出现一至二年口径，但只能作为继续查找2027官方文本的线索，不得投入校本自动规则。",
      "url": "https://www.eol.cn/kaoshi/ky/yxdt/202610/t20261008_2780084.shtml",
      "evidenceStatus": "UNCONFIRMED",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-016",
      "title": "限2026博士；尚未从可核条款证明适用2026硕士“录取前书面”同一期限。博士仍须按当届政策由研究生招生岗核定，不用转载SRC-015驱动硬判",
      "url": "https://gra.cdut.edu.cn/info/1075/5666.htm",
      "evidenceStatus": "PARTIAL",
      "sourceIndexStatus": "PRESENT"
    },
    {
      "srcId": "SRC-017",
      "title": "保留学籍引起助学金暂停/恢复有**独立资助链**，本模板只回引学籍已签决定，不审查金额、资格、发放。是否有更新办法仍需核定",
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
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
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
        "SRC-003",
        "SRC-005",
        "SRC-008",
        "SRC-009",
        "SRC-010",
        "SRC-011",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R004",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R005",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R007",
      "srcIds": [
        "SRC-003",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R008",
      "srcIds": [
        "SRC-003",
        "SRC-015"
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
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R010",
      "srcIds": [
        "SRC-002",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R011",
      "srcIds": [
        "SRC-003",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-01",
      "criterionId": "R012",
      "srcIds": [
        "SRC-004",
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R013",
      "srcIds": [
        "SRC-004",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R014",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R015",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R016",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R017",
      "srcIds": [
        "SRC-003",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R018",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R019",
      "srcIds": [
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R020",
      "srcIds": [
        "SRC-003",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R021",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-02",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R025",
      "srcIds": [
        "SRC-004",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R026",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R027",
      "srcIds": [
        "SRC-004",
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R028",
      "srcIds": [
        "SRC-012",
        "SRC-013",
        "SRC-014",
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R029",
      "srcIds": [
        "SRC-012",
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-03",
      "criterionId": "R032",
      "srcIds": [
        "SRC-007",
        "SRC-012",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ],
  "exceptionRouteNotes": [],
  "publicationGuard": "Integration Owner must register this research template as candidate-held (for example via saveAuthoringCandidateDraft); the R02_RESEARCH_TEMPLATE_NONOFFICIAL sourceNote prefix is not recognized by template-store.isCandidateDraft in the current shared code."
} as const
