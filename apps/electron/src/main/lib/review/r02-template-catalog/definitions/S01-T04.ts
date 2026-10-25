/**
 * R02 S01-T04：转专业及专业身份变更申请审核（研究候选）。
 * 所有字段、材料与 R 规则从 canonical Markdown 的 §06/§07/§08 转录；
 * SRC 为研究来源，不是当前案卷的 SourceRef，也没有真实学校 PolicyVersion。
 * 本模块不创建 Case/Run/Decision，也不自动产生校方结论。
 */
import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "S01-T04",
  "version": 1,
  "schemaVersion": 2,
  "name": "转专业及专业身份变更申请审核",
  "description": "本地研究模板 · 非校方正式模板。核验校内正式学籍主修专业变更申请的材料、事实、资格、考核、公示、决定与生效记录；不同身份/批次和未知校本条件需人工确认，绝不自动正式批准或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 非成都理工大学官方模板；源文档 docs/design/review-agent/business-templates/R02/S01-T04.md；SHA-256 4afb024d7e4da0ddff4e41a91e2936bac1632f436fdd7a74afbe60de3aa68db7；研究状态 PARTIAL。2026 校级通知正文/具体学院指标/研究生授权流程未核全；研究 SRC 不是案卷 SourceRef，不得替代 PolicyVersion，不存在学校远端写回。",
  "objectType": "person",
  "displayName": {
    "template": "S01-T04 · 转专业及专业身份变更申请审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · application_id",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F001（application_id）；string；申请/提交。来源与敏感属性：后端生成唯一 ID；I/T。缺失/异常：未生成不可提交，服务错误阻断写入。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F001；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F002",
      "label": "F002 · student_id",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F002（student_id）；string；学生/全程。来源与敏感属性：认证学籍标识，非 OCR；P/T。缺失/异常：SU；不能用姓名匹配冒充。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F002；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F003",
      "label": "F003 · applicant_actor",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F003（applicant_actor）；ref；动作/全程。来源与敏感属性：服务端认证身份与委托授权；S/T。缺失/异常：SU，拒绝越权动作。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F003；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F004",
      "label": "F004 · education_level",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F004（education_level）；enum；学生/路由。来源与敏感属性：本科/硕士/博士/其他，学籍可信源；P/T。缺失/异常：SU 或人工路由。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F004；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F005",
      "label": "F005 · enrollment_state",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F005（enrollment_state）；enum；学生/提交。来源与敏感属性：在籍、休学、复学待生效、退学等；P/T。缺失/异常：SU，不推定“在读”。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F005；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F006",
      "label": "F006 · campus_program",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F006（campus_program）；object；学生/路由。来源与敏感属性：校区/合作办学/特殊项目；S/T。缺失/异常：SU；校区、项目限制还须 F022。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F006；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F007",
      "label": "F007 · source_major_code",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F007（source_major_code）；string；主修专业/提交。来源与敏感属性：官方当前专业代码及学院；P/T。缺失/异常：SU；截图不替代。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F007；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F008",
      "label": "F008 · target_major_code",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F008（target_major_code）；string；申请志愿/提交。来源与敏感属性：在有效专业目录中选择，提交 U/目录 T；P。缺失/异常：NM 或目录 SU。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F008；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F009",
      "label": "F009 · source_grade",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F009（source_grade）；string；学籍/提交。来源与敏感属性：官方年级；P/T。缺失/异常：SU。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F009；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F010",
      "label": "F010 · target_grade",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F010（target_grade）；string；转入拟编级/申请后。来源与敏感属性：方案或审批决定，非用户任意填定；P/T。缺失/异常：未决定时 NA，不报缺件。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F010；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F011",
      "label": "F011 · track",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F011（track）；enum；申请/路由。来源与敏感属性：普通/第二志愿/退役/创业/健康/合作/学校调整/研究生；P/U + T 校准。缺失/异常：不明需人工定路由。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F011；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F012",
      "label": "F012 · cycle_id",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F012（cycle_id）；string；年度批次/提交。来源与敏感属性：校级年度通知确定；I/T。缺失/异常：PU，年度未发布或未绑定不得硬判。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F012；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F013",
      "label": "F013 · submitted_at",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F013（submitted_at）；time；提交。来源与敏感属性：可信服务端时间；I/T。缺失/异常：未提交 NA，已提交缺失 SU。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F013；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F014",
      "label": "F014 · admission_category",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F014（admission_category）；enum/ref；资格。来源与敏感属性：招生来源、专项/定向协议、校区类别的官方档案；S/T。缺失/异常：SU，不能用猜测拒绝。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F014；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F015",
      "label": "F015 · prior_transfer_history",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F015（prior_transfer_history）；list；资格。来源与敏感属性：官方历史正式变更决定；S/T。缺失/异常：SU；限制次数需政策 F022。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F015；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F016",
      "label": "F016 · discipline_status",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F016（discipline_status）；enum/ref；资格。来源与敏感属性：正式处分是否有效与解除，授权源；S/T。缺失/异常：SU；阈值未核 PU。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F016；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F017",
      "label": "F017 · return_from_service",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F017（return_from_service）；ref；例外资格。来源与敏感属性：已核退役复学结果+相应证明；S/T。缺失/异常：C03 条件 NM/SU。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F017；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F018",
      "label": "F018 · return_from_startup",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F018（return_from_startup）；ref；例外资格。来源与敏感属性：已核休学创业及复学事实；S/T。缺失/异常：C04 条件 NM/SU。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F018；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F019",
      "label": "F019 · source_college",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F019（source_college）；ref；学籍/全程。来源与敏感属性：当前学院代码；P/T。缺失/异常：SU。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F019；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F020",
      "label": "F020 · target_college",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F020（target_college）；ref；目标/提交。来源与敏感属性：有效目标专业对应学院；P/T。缺失/异常：SU。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F020；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F021",
      "label": "F021 · consent_revision",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F021（consent_revision）；ref；自愿申请/提交。来源与敏感属性：本人签署/认证的具体目标与提交时间；S/T。缺失/异常：C01–C06/C08 NM；C07 NA。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F021；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F022",
      "label": "F022 · policy_config_version",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F022（policy_config_version）；ref；规则/全程。来源与敏感属性：当期校级办法+年度通知+学院授权细则，批准人与适用期；I/T。缺失/异常：PU；不得使用过期阈值。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F022；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F023",
      "label": "F023 · official_transcript",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F023（official_transcript）；ref；考核。来源与敏感属性：教务处签发成绩记录、版本；S/T。缺失/异常：当期规定要求才 NM，否则 NA。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F023；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F024",
      "label": "F024 · eligibility_facts",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F024（eligibility_facts）；object；资格。来源与敏感属性：成绩/学分/学科要求，基于 F022 和 F023；S/T。缺失/异常：PU 或 SU，不设伪阈值。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F024；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F025",
      "label": "F025 · assessment_results",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F025（assessment_results）；object；考核后。来源与敏感属性：官方分项成绩与考核组签发；S/T。缺失/异常：考核前 NA；考核完成后 SU。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F025；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F026",
      "label": "F026 · capacity_ranking",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F026（capacity_ranking）；object；拟录取。来源与敏感属性：批次、名额、排序版本、特殊通道处理；I/T。缺失/异常：拟录取前 NA；指标未签 PU。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F026；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F027",
      "label": "F027 · eligibility_decision",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F027（eligibility_decision）；ref；资格结束。来源与敏感属性：官方资格审查结论与 actor/时间；I/T。缺失/异常：初审前 NA；之后 SU。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F027；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F028",
      "label": "F028 · proposal_and_publicity",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F028（proposal_and_publicity）；ref；拟录取/公示。来源与敏感属性：授权的拟接收、公告起止、异议；P/T。缺失/异常：公示前 NA；之后 SU。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F028；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F029",
      "label": "F029 · objection_event",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F029（objection_event）；ref；异议/公示后。来源与敏感属性：实名异议、受理回执与处置权属；S/T。缺失/异常：没有提出 NA，非默认缺件。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F029；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F030",
      "label": "F030 · school_decision",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F030（school_decision）；ref；正式决定。来源与敏感属性：官方决定编号、学生、目标专业、签发人和效力；S/T。缺失/异常：决定前 NA；不得由 AI 补造。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F030；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F031",
      "label": "F031 · registry_change",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F031（registry_change）；ref；生效核验。来源与敏感属性：官方学籍变更事件与旧/新专业版本；S/T。缺失/异常：决定前 NA，等待后端生效。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F031；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F032",
      "label": "F032 · exception_reason",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F032（exception_reason）；enum/ref；特殊通道。来源与敏感属性：本人理由及可授权事实，不强制公开原始疾病细节；S/U、部分 T。缺失/异常：普通情形 NA；特殊条件材料 NM。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F032；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F033",
      "label": "F033 · evidence_snapshot",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F033（evidence_snapshot）；object；全程。来源与敏感属性：附件 ID、SHA、归属、fileVersion、OCR 状态；I/T。缺失/异常：系统必需，非材料内容缺失。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F033；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F034",
      "label": "F034 · source_binding",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F034（source_binding）；object；规则/全程。来源与敏感属性：SRC URL/文号/条款、取得时间与版本；I/T。缺失/异常：不足则 PU/SU。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F034；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F035",
      "label": "F035 · review_actor_authority",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F035（review_actor_authority）；ref；每次签收/决定。来源与敏感属性：后端 actor 身份、权限与授权时间；S/T。缺失/异常：SU，越权事件不生效。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F035；非官方字段，非已连接校方接口。"
    },
    {
      "key": "F036",
      "label": "F036 · withdraw_or_review_status",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F036（withdraw_or_review_status）；enum/ref；后续事件。来源与敏感属性：撤回/复核申请、校方受理、决定引用；S/T。缺失/异常：无事件 NA；有事件须可信确认。若依赖可信学校数据，学生自报或 OCR 不构成权威事实。",
      "displayHint": "研究稿 §06 F036；非官方字段，非已连接校方接口。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 自愿申请表",
      "purpose": "学生持有；当期《转专业申请表》或有签署回执的正式线上申报；目的、志愿、承诺、时间。阶段及缺失处置：A、C07 不适用；本轮真实必需而缺→NM；签字难读→UNREADABLE。研究关联：F001/F003/F008/F011/F021；R001/R009/R028；SRC-004/005。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：自愿申请表",
        "核验材料身份、签发主体、时点、关联申请与版本：A、C07 不适用；本轮真实必需而缺→NM；签字难读→UNREADABLE"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 学籍主记录",
      "purpose": "教务学籍源持有；在籍状态、当前专业/年级/学院的可信 API 回执，不以学生证照片代替。阶段及缺失处置：E，源断→SU；记录与申请不一致→CONFLICT。研究关联：F002/F004/F005/F007/F009/F019；R001/R002/R003/R011/R012/R022/R028；SRC-001/015。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：学籍主记录",
        "核验材料身份、签发主体、时点、关联申请与版本：E，源断→SU；记录与申请不一致→CONFLICT"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 · 招生类别与约定",
      "purpose": "招生/学籍部门；特殊招生来源、培养协议、校区项目授权查询，必要脱敏文书。阶段及缺失处置：E/C06，源不可用→SU；无校本有效禁转条款→PU。研究关联：F006/F014；R004/R021；SRC-001/002/004。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：招生类别与约定",
        "核验材料身份、签发主体、时点、关联申请与版本：E/C06，源不可用→SU；无校本有效禁转条款→PU"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 · 目标专业接收目录",
      "purpose": "教务处/转入学院；专业代码、校区、名额及适用年级的当期已签方案。阶段及缺失处置：E，年度尚未发布→PU；名额不可核不猜。研究关联：F008/F010/F020/F026；R006/R016；SRC-003/013。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：目标专业接收目录",
        "核验材料身份、签发主体、时点、关联申请与版本：E，年度尚未发布→PU；名额不可核不猜"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 · 当期申请时窗通知",
      "purpose": "教务处；校级公告、批次、开放/截止时刻与志愿约束（带原文签发版）。阶段及缺失处置：E；缺原件或与学院版本不一致→PU/CONFLICT。研究关联：F011/F012/F013/F022；R005/R023/R027；SRC-003。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：当期申请时窗通知",
        "核验材料身份、签发主体、时点、关联申请与版本：E；缺原件或与学院版本不一致→PU/CONFLICT"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 · 原因/专业学习计划",
      "purpose": "学生；申请表相应栏、附信或官方要求的个人说明。阶段及缺失处置：A；当期要求才 NM，既有表中已提供不二次索要。研究关联：F008/F021/F032；R009；SRC-005/006。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：原因/专业学习计划",
        "核验材料身份、签发主体、时点、关联申请与版本：A；当期要求才 NM，既有表中已提供不二次索要"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "M007 · 正式成绩单",
      "purpose": "教务处；带可信签发验证的大学课程成绩单，或后台只读成绩源。阶段及缺失处置：A/考核；该院该批要求才 NM；OCR 模糊可要求清晰件，官方源断 SU。研究关联：F023/F024；R010/R028；SRC-005/006。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：正式成绩单",
        "核验材料身份、签发主体、时点、关联申请与版本：A/考核；该院该批要求才 NM；OCR 模糊可要求清晰件，官方源断 SU"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 · 特长/简历佐证",
      "purpose": "学生/竞赛签发机构；简历、专业介绍、作品或校级荣誉记录，按学院当年方案。阶段及缺失处置：A/考核，条件必需；不为全部学院强制。研究关联：F032/F024；R010；SRC-005/006。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：特长/简历佐证",
        "核验材料身份、签发主体、时点、关联申请与版本：A/考核，条件必需；不为全部学院强制"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 · 退役复学证明",
      "purpose": "学籍/服役机关；退役证明与 `S01-T02` 已签复学决定及真实性查询。阶段及缺失处置：C03，条件缺件 NM、后台决定查不到 SU；涉敏最小化。研究关联：F017/F005；R011；SRC-001/007。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：退役复学证明",
        "核验材料身份、签发主体、时点、关联申请与版本：C03，条件缺件 NM、后台决定查不到 SU；涉敏最小化"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 休学创业复学证明",
      "purpose": "学籍部门及创业项目有权机构；有效休学/复学决定，创业事实认可记录。阶段及缺失处置：C04；按政策必要时条件 NM，制度细节 PU。研究关联：F018/F032；R012；SRC-001。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：休学创业复学证明",
        "核验材料身份、签发主体、时点、关联申请与版本：C04；按政策必要时条件 NM，制度细节 PU"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 健康适配证明",
      "purpose": "学校授权医疗/教学部门；与学习适配有关的最小化诊断结论，不收不必要病史。阶段及缺失处置：C05 且规则允许时；必要性未证→PU；不可读→UNREADABLE。研究关联：F032；R013；SRC-001/002。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：健康适配证明",
        "核验材料身份、签发主体、时点、关联申请与版本：C05 且规则允许时；必要性未证→PU；不可读→UNREADABLE"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 培养方案与专业限制",
      "purpose": "专业管理部门；先修课程/入学类别/培养容量、研究生学科归属及版本。阶段及缺失处置：C01/C06/C08 按专业规定；方案未知 PU，非学生“漏交”。研究关联：F008/F010/F022；R006/R016/R022；SRC-004/009。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：培养方案与专业限制",
        "核验材料身份、签发主体、时点、关联申请与版本：C01/C06/C08 按专业规定；方案未知 PU，非学生“漏交”"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 · 资格审查意见",
      "purpose": "原/拟转入学院有权者；签名、清单、时间的资格初审/复核结果。阶段及缺失处置：L，仅资格审查后产生；缺则 SU/待办，不能倒灌到提交阶段。研究关联：F027/F035；R014/R029；SRC-005/014。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：资格审查意见",
        "核验材料身份、签发主体、时点、关联申请与版本：L，仅资格审查后产生；缺则 SU/待办，不能倒灌到提交阶段"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 专业考核成绩",
      "purpose": "拟转入学院；笔面试/作品评价官方分项成绩与考核记录。阶段及缺失处置：L，考核前 NA；完成后丢失 SU，冲突人工核验。研究关联：F025/F035；R015/R016/R029；SRC-005/006。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：专业考核成绩",
        "核验材料身份、签发主体、时点、关联申请与版本：L，考核前 NA；完成后丢失 SU，冲突人工核验"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 拟接收及公示",
      "purpose": "学院/教务处；拟接收名单、排序快照、批次公示页面和更正版本。阶段及缺失处置：L，仅拟录取后；无法核验公示不能当决定。研究关联：F026/F028；R016/R017/R018/R029；SRC-005/008。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：拟接收及公示",
        "核验材料身份、签发主体、时点、关联申请与版本：L，仅拟录取后；无法核验公示不能当决定"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 公示异议处理",
      "purpose": "投诉人/有权学院；异议、调查、纠错/维持通知，含时间及对象版本。阶段及缺失处置：X，未发生 NA；已受理而无处理结果则人工待办。研究关联：F029/F036；R018/R025/R029；SRC-005/010。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：公示异议处理",
        "核验材料身份、签发主体、时点、关联申请与版本：X，未发生 NA；已受理而无处理结果则人工待办"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 · 学校正式转专业决定",
      "purpose": "教务处/学校授权机构；文号、签章可信元数据、同一学号/专业的签发决定。阶段及缺失处置：L，签发前 NA；材料截图不等于可信正式决定。研究关联：F030/F035；R019/R020/R026/R029；SRC-008/007。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：学校正式转专业决定",
        "核验材料身份、签发主体、时点、关联申请与版本：L，签发前 NA；材料截图不等于可信正式决定"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "M018 · 学籍专业变更回执",
      "purpose": "有权学籍登记系统；含变更前后专业、学期、生效时间的版本化事件。阶段及缺失处置：D，未批准前 NA；决定后查不到 SU/待执行。研究关联：F031/F007/F008；R020/R029；SRC-001/008。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：学籍专业变更回执",
        "核验材料身份、签发主体、时点、关联申请与版本：D，未批准前 NA；决定后查不到 SU/待执行"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "M019 · 撤回/放弃申请回执",
      "purpose": "本人/受理单位；带认证时间的请求及授权受理、撤回生效答复。阶段及缺失处置：X，事件发生才必需；口头要求需正式化。研究关联：F003/F036；R024/R029；SRC-003。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：撤回/放弃申请回执",
        "核验材料身份、签发主体、时点、关联申请与版本：X，事件发生才必需；口头要求需正式化"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "M020 · 复核/申诉申请及处置",
      "purpose": "本人/有权复核机构；原决定、异议具体事实、正式受理/决定与送达。阶段及缺失处置：X，复核时触发；未提供说明可按受理政策 NM/PU。研究关联：F029/F036/F030；R025/R029；SRC-010/001。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：复核/申诉申请及处置",
        "核验材料身份、签发主体、时点、关联申请与版本：X，复核时触发；未提供说明可按受理政策 NM/PU"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "M021 · 校本政策受控包",
      "purpose": "教务处/制度发布方；校规全文、年度通知、学院实施方案及生效关联（含来源 URI/hash）。阶段及缺失处置：E；校本参数未证 PU，绝不转成“学生缺材料”。研究关联：F022/F034；R003/R004/R005/R007/R008/R010/R013/R016/R018/R021/R022/R023/R024/R027/R028；SRC-002/003/004/015。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：校本政策受控包",
        "核验材料身份、签发主体、时点、关联申请与版本：E；校本参数未证 PU，绝不转成“学生缺材料”"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "M022 · 学校组织调整指令",
      "purpose": "校级发文机关；专业撤并/调整的受影响群体、学籍变化与告知文件。阶段及缺失处置：C07，只有学校主动调整才条件必需；无决定需人工。研究关联：F011/F030/F035；R026；SRC-001。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：学校组织调整指令",
        "核验材料身份、签发主体、时点、关联申请与版本：C07，只有学校主动调整才条件必需；无决定需人工"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "M023 · 处分记录摘要",
      "purpose": "授权学工/教务后台；当前是否处分、解除时间，不拉取不必要细节。阶段及缺失处置：A 仅当现行政策明确相关；SU 或 PU 而非学生补件。研究关联：F016；R008；SRC-002/003。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：处分记录摘要",
        "核验材料身份、签发主体、时点、关联申请与版本：A 仅当现行政策明确相关；SU 或 PU 而非学生补件"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "M024 · 已转专业历史",
      "purpose": "学籍主系统；历史正式专业变更事件，区别于撤回未批准的申请。阶段及缺失处置：A、当期次数有限才参与；政策未核 PU，记录不可用 SU。研究关联：F015；R007；SRC-002/003。须按案卷当前版本和真实签发来源核验；不得假定已接通学校后台。",
      "requiredElements": [
        "本槽证据用途：已转专业历史",
        "核验材料身份、签发主体、时点、关联申请与版本：A、当期次数有限才参与；政策未核 PU，记录不可用 SU"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "submission",
      "name": "申请、身份和源版本核验",
      "order": 0,
      "required": true,
      "description": "按原研究稿 §08 对当前阶段的事实、证据版本与政策适用性生成检查与人工待办；未进入的下游阶段不得判作缺件。",
      "criteria": [
        {
          "id": "R001",
          "title": "申请行为来自有权本人/代理",
          "requirement": "研究核验要求：**申请行为来自有权本人/代理**；提交，C01–C06/C08。证据比较与未定状态：服务端会话 actor、委托权限与表单签署主体精确一致为 T→`PASS_FACT`；已证冒名 F→`PASS_FACT(false)` 并拒绝本次动作、告知本人/安全岗；无认证 U→`SOURCE_UNAVAILABLE`，本人重新认证。。研究索引（非案卷 SourceRef）：SRC-001/004；F001/F002/F003/F021；M001/M002。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "当前主修专业代码与学籍源一致",
          "requirement": "研究核验要求：**当前主修专业代码与学籍源一致**；提交，全部。证据比较与未定状态：F007 与 M002 官方源一致 T；确定不一致 F→`CONFLICT` 并由学籍管理员核旧/新版本；学籍源离线 U→`SOURCE_UNAVAILABLE`，不可用照片“补过”。。研究索引（非案卷 SourceRef）：SRC-002/015；F002/F007/F019；M002。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "提交时刻落在权威年度窗口",
          "requirement": "研究核验要求：**提交时刻落在权威年度窗口**；提交，C01/C02/C06。证据比较与未定状态：校级时区、开放/截止、服务端 F013 和适用批次比较；内 T，过期 F→记录客观迟交并交教务处理；当期正文/时刻不明 U→`POLICY_UNCONFIRMED`；官网接口故障→`SOURCE_UNAVAILABLE`，不能自拟 2026 截止日。。研究索引（非案卷 SourceRef）：SRC-003/005；F012/F013/F022；M005/M021。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "本人志愿与目标及申请表版本一致",
          "requirement": "研究核验要求：**本人志愿与目标及申请表版本一致**；申请，C01–C06/C08。证据比较与未定状态：M001/M006 或可信线上表的专业代码、批次、签名、F021 revision 完全一致 T；目标不一致 `CONFLICT`→请本人确认并重签；当前必须的表未交 `NEEDS_MATERIAL`；C07→`NOT_APPLICABLE`。。研究索引（非案卷 SourceRef）：SRC-004/005；F008/F011/F021；M001/M006。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "所用校本制度版本真实覆盖本案阶段",
          "requirement": "研究核验要求：**所用校本制度版本真实覆盖本案阶段**；所有核心规则运行前。证据比较与未定状态：将 F022/F034 的适用人群、学年、生效/废止、学院授权与 M021 原件核对 T；有更高效力冲突→`CONFLICT` 并冻结争议条款；只有 2019 文件而缺当期正文→`POLICY_UNCONFIRMED`，下一教务处制度归口。。研究索引（非案卷 SourceRef）：SRC-002/003/004/015；F012/F022/F034；M005/M021。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "复审结论所引用材料和源版本仍是当前有效版本",
          "requirement": "研究核验要求：**复审结论所引用材料和源版本仍是当前有效版本**；每次复跑/决定前。证据比较与未定状态：F033 的 SHA、fileVersion、sourceVersion 与冻结计划/规则快照一致 T；任一被重传/来源更新 F→旧 Observation 失效，仅受影响规则重审；缺旧版本可追溯性→`SOURCE_UNAVAILABLE`，不得沿用旧 PASS。。研究索引（非案卷 SourceRef）：SRC-012；F001/F033/F034；M001/M002/M007/M021。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "签发动作的 actor 具有相应角色权限",
          "requirement": "研究核验要求：**签发动作的 actor 具有相应角色权限**；资格、录取、异议、决定每一事件。证据比较与未定状态：F035 服务端角色、授权范围、签发时刻与相关 M013–M020 的签名一致 T；Renderer 或模型冒充老师/教务签发 F→拒绝且安全审计；权限服务不可用 U→`SOURCE_UNAVAILABLE`。。研究索引（非案卷 SourceRef）：SRC-012；F003/F035；M013/M014/M015/M016/M017/M018/M019/M020。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "eligibility",
      "name": "学籍资格与当期校本条件",
      "order": 1,
      "required": true,
      "description": "按原研究稿 §08 对当前阶段的事实、证据版本与政策适用性生成检查与人工待办；未进入的下游阶段不得判作缺件。",
      "criteria": [
        {
          "id": "R003",
          "title": "在读/复学状态符合当期申请轨道",
          "requirement": "研究核验要求：**在读/复学状态符合当期申请轨道**；资格，本科及研究生。证据比较与未定状态：学籍有效状态与 F011 轨道的校本条件匹配 T；确认不匹配 F→`PASS_FACT(false)`（由教务人工告知或校本退回）；状态无法查 U→`SOURCE_UNAVAILABLE`；该状态是否获特殊通道须读 F022，未知→`POLICY_UNCONFIRMED`。。研究索引（非案卷 SourceRef）：SRC-001/003/009；F004/F005/F011/F022；M002/M021。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "特殊招生/项目身份是否触发限制",
          "requirement": "研究核验要求：**特殊招生/项目身份是否触发限制**；资格，C01/C06。证据比较与未定状态：官方招生约定与已核政策绑定核对；未触发 T；确认禁止 F→`PASS_FACT(false)` 并交教务解释；协议冲突 `CONFLICT`，未拿到当期具体清单→`POLICY_UNCONFIRMED`。禁止把 2019 一批/二批禁转条款机械套 2026。。研究索引（非案卷 SourceRef）：SRC-001/002/004；F006/F014/F022；M003/M021。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "目标专业/年级确属当期可接收集合",
          "requirement": "研究核验要求：**目标专业/年级确属当期可接收集合**；资格，本科/研究生条件化。证据比较与未定状态：F008/F010/F020 与有签发版目标目录及 M012 一致 T；目录明确不含 F→`PASS_FACT(false)` 交教务；目标被撤并/多版本冲突 `CONFLICT`；无指标/批准版→`POLICY_UNCONFIRMED`。。研究索引（非案卷 SourceRef）：SRC-001/003/013；F008/F010/F020/F022；M004/M012。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "历史转专业记录是否超过当期限额",
          "requirement": "研究核验要求：**历史转专业记录是否超过当期限额**；资格，普通申请。证据比较与未定状态：M024 签发变更事件计数与已核 F022 次数限制对照 T/F；过去“申请失败”不得自动计为已转专业；当期“允许几次”未核 U→`POLICY_UNCONFIRMED`；后台历史访问失败→`SOURCE_UNAVAILABLE`。任何不予受理仍交教务确认。。研究索引（非案卷 SourceRef）：SRC-002/003；F015/F022；M024/M021。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "有效处分是否满足当期可申请条件",
          "requirement": "研究核验要求：**有效处分是否满足当期可申请条件**；资格，政策确有要求时。证据比较与未定状态：从 M023 取有效/解除状态，对照 F022 规则 T/F；当期规则不要求→`NOT_APPLICABLE`；历史 2019 标准不能直接使用，未知→`POLICY_UNCONFIRMED`；无权限/源断→`SOURCE_UNAVAILABLE` 而非索取学生处分证明。。研究索引（非案卷 SourceRef）：SRC-002/003；F016/F022；M023/M021。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "课程成绩/考核材料满足本院本批已公布证据要求",
          "requirement": "研究核验要求：**课程成绩/考核材料满足本院本批已公布证据要求**；资格/考核，C01/C02/C06。证据比较与未定状态：M007 学校签发记录与已签学院方案需要的科目、成绩、资料类型逐项对照 T/F；成绩单缺而当期要求→`NEEDS_MATERIAL`；带章扫描不可读→`UNREADABLE`；官方成绩冲突→`CONFLICT`；方案未取→`POLICY_UNCONFIRMED`。M008 仅在细则明示时触发。。研究索引（非案卷 SourceRef）：SRC-005/006；F022/F023/F024；M007/M008/M021。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "合作办学/特殊项目使用其当期专门实施方案",
          "requirement": "研究核验要求：**合作办学/特殊项目使用其当期专门实施方案**；C06 提交/资格。证据比较与未定状态：`F006` 属专项、M003/M021 挂接 2026 有权方案正文时才逐项核；取得适用版本 T；缺附件→`POLICY_UNCONFIRMED`，不沿用旧禁止条文；普通路径 NA，下一为国际教育学院/教务处。。研究索引（非案卷 SourceRef）：SRC-001/004；F006/F014/F022；M003/M021。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "研究生“正式专业变更”符合研究生院制度路由",
          "requirement": "研究核验要求：**研究生“正式专业变更”符合研究生院制度路由**；C08。证据比较与未定状态：F004 与学籍专业代码证明本对象确为专业而非导师/培养计划转动；校本最新版及签批序列明确 T→事实核验；2021 旧制度效力或导师/学院权限未核→`POLICY_UNCONFIRMED` + 研究生院人工；本科 NA。。研究索引（非案卷 SourceRef）：SRC-009；F004/F007/F008/F022；M002/M012/M021。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "后续志愿/批次具备独立且合法的申请资格",
          "requirement": "研究核验要求：**后续志愿/批次具备独立且合法的申请资格**；C02。证据比较与未定状态：F011/F012 与当期 M005/M021 批次开启、上一志愿权威处置、志愿顺序相符 T；第二志愿不允许或已被上一批次正式锁定时 F→记录并由教务核；批次条件未知 U→`POLICY_UNCONFIRMED`，普通单次申请 NA。。研究索引（非案卷 SourceRef）：SRC-003/005；F011/F012/F022/F036；M005/M021。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "exceptions",
      "name": "优先考虑、特殊轨道及学校调整",
      "order": 2,
      "required": true,
      "description": "按原研究稿 §08 对当前阶段的事实、证据版本与政策适用性生成检查与人工待办；未进入的下游阶段不得判作缺件。",
      "criteria": [
        {
          "id": "R011",
          "title": "退役复学特殊事实确已成立",
          "requirement": "研究核验要求：**退役复学特殊事实确已成立**；C03 资格。证据比较与未定状态：有效退役凭证与 `S01-T02` 已签复学决定同属 F002 T→`PASS_FACT`，并标记“依法优先考虑候选”；不能据此自动录取；证据缺→`NEEDS_MATERIAL`，复学服务失联→`SOURCE_UNAVAILABLE`，矛盾→`CONFLICT`；普通 C01→`NOT_APPLICABLE`。。研究索引（非案卷 SourceRef）：SRC-001/007；F002/F017/F005；M009/M002。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "休学创业复学及创业事实已得到相应确认",
          "requirement": "研究核验要求：**休学创业复学及创业事实已得到相应确认**；C04 资格。证据比较与未定状态：M010 中复学决定和创业事实/身份同属申请人 T；缺必须证明→`NEEDS_MATERIAL`，真实创业资格评价权不在本模板→`NEEDS_HUMAN_DECISION`，生效细则未知→`POLICY_UNCONFIRMED`；其他轨道 NA。。研究索引（非案卷 SourceRef）：SRC-001；F018/F032/F005；M010/M002。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "健康/特殊原因足以进入所申请的专门审查轨道",
          "requirement": "研究核验要求：**健康/特殊原因足以进入所申请的专门审查轨道**；C05 资格。证据比较与未定状态：先验证该轨道已获 F022 授权；依据最小化诊断与有权院方意见判断证据是否可核，完整 T 也必须 `NEEDS_HUMAN_DECISION`；不应存过量病史；当期无规则→`POLICY_UNCONFIRMED`；其他轨道 NA。。研究索引（非案卷 SourceRef）：SRC-001/002；F011/F022/F032；M011/M021。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "学校主动专业调整具备真实群体命令",
          "requirement": "研究核验要求：**学校主动专业调整具备真实群体命令**；C07。证据比较与未定状态：M022 已签校级命令覆盖本学生、旧/新专业及迁移时间 T→`NEEDS_HUMAN_DECISION`（按命令执行）；仅有学院建议/群聊截图 F→不得变更；命令未到 `SOURCE_UNAVAILABLE`，不要求伪造学生自愿申请表；普通申请 NA。。研究索引（非案卷 SourceRef）：SRC-001；F002/F007/F008/F011/F030；M022/M017。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "assessment",
      "name": "资格审查、考核与拟接收计算",
      "order": 3,
      "required": true,
      "description": "按原研究稿 §08 对当前阶段的事实、证据版本与政策适用性生成检查与人工待办；未进入的下游阶段不得判作缺件。",
      "criteria": [
        {
          "id": "R014",
          "title": "资格初审结论由有权学院真实签发",
          "requirement": "研究核验要求：**资格初审结论由有权学院真实签发**；初审完成后。证据比较与未定状态：M013 的学生、目标、申请版本、审核员与 F035 权限一致 T；若签名越权/对象错 `CONFLICT`；尚未初审→`NOT_APPLICABLE`（当前阶段）；声称完成但官方源丢失→`SOURCE_UNAVAILABLE`，下一学院教务。。研究索引（非案卷 SourceRef）：SRC-005/014；F001/F027/F035；M013。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "专业考核结果归属于正确考生与批次",
          "requirement": "研究核验要求：**专业考核结果归属于正确考生与批次**；考核完成后。证据比较与未定状态：M014 签发的科目/成绩/缺考、F025 对应 F001、专业与批次 T/F；尚未考试 NA；应有成绩而无权威记录→`SOURCE_UNAVAILABLE`；学生成绩截图与学院成绩异→`CONFLICT`，交考核组复核。。研究索引（非案卷 SourceRef）：SRC-005/006；F001/F012/F025/F035；M014。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "本轮拟接收排序/名额使用当期正式公式和容量",
          "requirement": "研究核验要求：**本轮拟接收排序/名额使用当期正式公式和容量**；考核后。证据比较与未定状态：仅对 M004/M012/M014/M015 同批同专业、已批准 F022 公式排序；一致 T；已证计算有误 F→记录复核待办，非自动录取；公式/名额或同分规则未确认→`POLICY_UNCONFIRMED`；特例优先名额须人工。。研究索引（非案卷 SourceRef）：SRC-003/006；F022/F025/F026；M004/M012/M014/M015/M021。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "official-result",
      "name": "公示、正式决定与学籍生效",
      "order": 4,
      "required": true,
      "description": "按原研究稿 §08 对当前阶段的事实、证据版本与政策适用性生成检查与人工待办；未进入的下游阶段不得判作缺件。",
      "criteria": [
        {
          "id": "R017",
          "title": "“拟接收”事实仅来自本批授权公示",
          "requirement": "研究核验要求：**“拟接收”事实仅来自本批授权公示**；拟录取。证据比较与未定状态：M015、F028 同学生目标/批次且未被更正版本撤销 T→`PASS_FACT` 仅进入公示；有更正冲突→`CONFLICT`；未公示前→`NOT_APPLICABLE`；不得将此条转换为 F030。。研究索引（非案卷 SourceRef）：SRC-005/008；F012/F026/F028；M015。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "公示期和异议处理状态已按当期要求完成",
          "requirement": "研究核验要求：**公示期和异议处理状态已按当期要求完成**；公示阶段。证据比较与未定状态：F028 起止日期与当期政策吻合、M016 争议已被有权方解决 T；有未解决异议→`NEEDS_HUMAN_DECISION`；时长/受理路径未知→`POLICY_UNCONFIRMED`；未到公示阶段 NA，不机械继承 2019“五工作日”。。研究索引（非案卷 SourceRef）：SRC-002/003/005；F022/F028/F029；M015/M016/M021。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "正式转专业决定实际签发且覆盖本申请",
          "requirement": "研究核验要求：**正式转专业决定实际签发且覆盖本申请**；学校决定阶段。证据比较与未定状态：有权来源 M017 的文号、签章身份、对象、源/目标专业、效力与 F030 相符 T→`PASS_FACT(official_decision_verified)`，才可进入登记；未签发→`NOT_APPLICABLE` / 等待决定；材料照片或无授权签字→`SOURCE_UNAVAILABLE`/`NEEDS_HUMAN_DECISION`，不得生成许可。。研究索引（非案卷 SourceRef）：SRC-007/008；F002/F007/F008/F030/F035；M017。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "学籍专业登记与已签决定一致",
          "requirement": "研究核验要求：**学籍专业登记与已签决定一致**；决定生效后。证据比较与未定状态：M018 的官方变更事件旧/新专业、日期与 M017 一致 T→`PASS_FACT(registry_effective)`；不一致→`CONFLICT`，交学籍岗修复；源不可用→`SOURCE_UNAVAILABLE`；决定尚未签发 NA，严禁先写主数据。。研究索引（非案卷 SourceRef）：SRC-001/008；F007/F008/F030/F031；M017/M018。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "review-withdraw",
      "name": "撤回、异议与复核",
      "order": 5,
      "required": true,
      "description": "按原研究稿 §08 对当前阶段的事实、证据版本与政策适用性生成检查与人工待办；未进入的下游阶段不得判作缺件。",
      "criteria": [
        {
          "id": "R024",
          "title": "撤回请求由有权主体在允许阶段提出并生效",
          "requirement": "研究核验要求：**撤回请求由有权主体在允许阶段提出并生效**；C09。证据比较与未定状态：M019 本人认证、真实受理号、适用 F022 撤回阶段一致 T→标记撤回生效并冻结后续动作；已形成正式决定则不能“删掉决定”，须走校方纠正程序；受理未确认→`NEEDS_HUMAN_DECISION`；无申请 NA。。研究索引（非案卷 SourceRef）：SRC-001/003；F003/F022/F036；M019/M021。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "异议/复核事件关联正确原结论与版本",
          "requirement": "研究核验要求：**异议/复核事件关联正确原结论与版本**；C10。证据比较与未定状态：M020/M016 的主体、原 `rule_id`/决定号、原附件版本、实际受理权限一致 T→登记复核；时限/适用范围无法核→`POLICY_UNCONFIRMED` + 转人工；原决定未被有权撤销时仍保持效力；没有事件 NA。。研究索引（非案卷 SourceRef）：SRC-001/010；F029/F030/F035/F036；M016/M020。只能输出可追溯事实/问题/补件建议；政策和签批权限未确认须人工处理，禁止自动形成学校批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "intake",
      "name": "材料归类与事实初查",
      "kind": "auto-check",
      "executorRole": "system",
      "workflowOwner": "local",
      "nextStageId": "fact-review"
    },
    {
      "id": "fact-review",
      "name": "事实核验、缺件和冲突人工复核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "returnToStageId": "intake",
      "nextStageId": "policy-review"
    },
    {
      "id": "policy-review",
      "name": "校本政策适用性与权限人工确认",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "returnToStageId": "fact-review",
      "nextStageId": "handoff"
    },
    {
      "id": "handoff",
      "name": "本地审阅建议与待办交接（非学校决定）",
      "kind": "handoff",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "returnToStageId": "policy-review"
    }
  ],
  "outputs": [
    {
      "id": "facts-and-issues",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-request",
      "kind": "supplement-list",
      "audience": "student"
    },
    {
      "id": "student-fact-feedback",
      "kind": "item-feedback",
      "audience": "student"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

/** 集成 Owner 可按此来源映射建立稳定 Check×target/sourceVersion 绑定。 */
export const r02Metadata = {
  "templateId": "S01-T04",
  "name": "转专业及专业身份变更申请审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S01-T04.md",
  "sourceDocumentSha256": "4afb024d7e4da0ddff4e41a91e2936bac1632f436fdd7a74afbe60de3aa68db7",
  "officialSchoolTemplate": false,
  "researchStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "sourceNature": "研究公开资料 SRC 索引；非案卷 SourceRef、非 PolicyVersion 或学校正式规则",
  "policyBinding": "UNBOUND",
  "schoolApproval": "NOT_GRANTED",
  "scenarios": [
    "C01",
    "C02",
    "C03",
    "C04",
    "C05",
    "C06",
    "C07",
    "C08",
    "C09",
    "C10",
    "C11"
  ],
  "sources": [
    {
      "srcId": "SRC-001",
      "source": "教育部，《普通高等学校学生管理规定》（教育部令第41号），[2017 年教育部原始发布](https://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201702/t20170216_296385.html)，第21条、25–27条（申诉处置另见第59–65条，适用须核）",
      "scopeAndAccess": "2017-09-01 起施行；普通高校学生；`WEB-INDEX`，教育部搜索正文片段可核第21条",
      "evidenceLimitation": "`GENERAL-RESEARCH`（上位全国规则）；有兴趣/专长可申请，特殊招生约定限制，学校须制定公平程序与公示制度；退役后复学及休学创业优先考虑。不是“优先即录取”。"
    },
    {
      "srcId": "SRC-002",
      "source": "成都理工大学《全日制普通本科学生学籍管理办法》，成理校教〔2019〕18号，第34–35条；[学校 2022 年公开 PDF 汇编物理页51–52](https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf)",
      "scopeAndAccess": "2019 文件、2022 汇编；普通本科；`WEB-READ`",
      "evidenceLimitation": "`CURRENTITY-UNKNOWN`；曾规定一次机会、若干限制、学院考核→教务处审批→公示→发文；**因 2023/2026 另有资料，全部仅作历史参照，不作为本轮自动硬判**。"
    },
    {
      "srcId": "SRC-003",
      "source": "成都理工大学教务处《[关于开展2026年普通本科生转专业工作的通知]》，教通字〔2026〕3号；[2026 中外合作通知转引](https://cie.cdut.edu.cn/info/1048/1811.htm)",
      "scopeAndAccess": "2026 年度、本科；原件正文/完整附件未获取；转引 `INDEX-ONLY / BLOCKED`",
      "evidenceLimitation": "`CURRENTITY-UNKNOWN`（**正文未核**）；可证存在年度校级通知，尚不能提取具体申请起止日、志愿数、限制、考试分数及名额。"
    },
    {
      "srcId": "SRC-004",
      "source": "成都理工大学国际教育学院（牛津布鲁克斯学院），[《关于2026年中外合作办学本科生转专业工作的通知》](https://cie.cdut.edu.cn/info/1048/1811.htm)（附实施方案与转专业申请表）",
      "scopeAndAccess": "2026-03-24；中外合作本科；搜索片段，页面原开返回 412、附件未读",
      "evidenceLimitation": "`CDUT-VERIFIED`（**公告存在、附录名称及校方审核通过的声明限 2026 专项**）；具体限制/材料槽依附件配置，现为 `POLICY_UNCONFIRMED`。"
    },
    {
      "srcId": "SRC-005",
      "source": "成都理工大学文法学院（纪检监察学院），[2026 年转专业可参加考核名单公示（第二志愿）](https://wfxy.cdut.edu.cn/info/1078/3596.htm)，正文、2026-06-11 公告",
      "scopeAndAccess": "2026 年第二志愿、社会学；`WEB-READ`",
      "evidenceLimitation": "`CDUT-VERIFIED`（限该学院该批）：学生申请→资格审核→参加考核；考核日 6/14，公告要求教务处盖章成绩单、简历/专业介绍、学生证；**这些材料和日期不推广到全部学院**。"
    },
    {
      "srcId": "SRC-006",
      "source": "成都理工大学文法学院，[2024 年本科生转专业复试和录取规则](https://wfxy.cdut.edu.cn/info/1078/1224.htm)，第2–4部分",
      "scopeAndAccess": "2024-06-05、当年法学等；`WEB-READ`",
      "evidenceLimitation": "`CURRENTITY-UNKNOWN`（历史学院实践）：曾设复试成绩、不同权重、排序/同分规则、提交成绩单等；数值与权重**不得直接用于 2026**。"
    },
    {
      "srcId": "SRC-007",
      "source": "成都理工大学教务处，[2025 年退役复学转专业决定 PDF](https://aao.cdut.edu.cn/__local/F/E6/1D/BC8B0C24229BFCFE5E6E058807D_B562DF0F_1388B.pdf)，物理页1",
      "scopeAndAccess": "2025-03-25；退役后复学本科个案；`WEB-READ`",
      "evidenceLimitation": "`CDUT-VERIFIED`（仅个案）：本人申请、相关学院审查、教务处复核、公示无异议、后续住宿档案学费调整；**不推导绝对免考或保证转入**。"
    },
    {
      "srcId": "SRC-008",
      "source": "成都理工大学教务处，[官方首页 2026-07-03“关于同意袁小满等631名同学转专业的决定”索引](https://aao.cdut.edu.cn/)",
      "scopeAndAccess": "2026-07-03、本科年轮；`INDEX-ONLY`，首页读取超时",
      "evidenceLimitation": "`CDUT-VERIFIED`（仅官方索引显示存在校级同意决定、人数标题）；**未取得决定原文、附件名单和生效日期**，不可据索引签发某人状态。"
    },
    {
      "srcId": "SRC-009",
      "source": "成都理工大学，[成理校研〔2021〕13号《研究生学籍管理办法》](https://dbxb.cdut.edu.cn/xxgkwz/info/1032/2549.htm)，第四章转专业/转学；第45条施行日期",
      "scopeAndAccess": "2021-09-01 起、研究生；搜索正文片段，页面 412",
      "evidenceLimitation": "`CURRENTITY-UNKNOWN`（当期有无替代版未核）；研究生专业变更存在独立制度，与本科细则不可互相套用。"
    },
    {
      "srcId": "SRC-010",
      "source": "成都理工大学数学科学学院，[规章制度页列“成都理工大学学生申诉管理办法”](https://math.cdut.edu.cn/txgz/gzzd.htm)",
      "scopeAndAccess": "列示日 2023-02-24；学生；`INDEX-ONLY / BLOCKED`",
      "evidenceLimitation": "`CURRENTITY-UNKNOWN`：存在校内学生申诉办法线索，未取得全文与适用于**转专业普通招生选拔异议**的条款、期限；不可自动承诺“必然受理法定申诉”。"
    },
    {
      "srcId": "SRC-011",
      "source": "成都大学教务处，[2025–2026 本科生转专业工作通知](https://jw.cdu.edu.cn/info/1043/12243.htm)",
      "scopeAndAccess": "2026-03；另一学校；索引/网页可检索",
      "evidenceLimitation": "`CROSS-SCHOOL-REFERENCE`；仅提示可按一般/特殊原因分两类并用系统申请与书面申请，**不得借用其 3 月具体窗口或硬性条件**。"
    },
    {
      "srcId": "SRC-012",
      "source": "CDUT Studio R02 研究总账及[本整合 ZIP 归档]：`ST-CANDIDATE-MASTER-CATALOG-R02.md`、`ST-CATALOG-AUDIT-R02.md`、`RESEARCH-TO-BUSINESS-MD-PROMPTS-R02.md`",
      "scopeAndAccess": "2026-10-22、内部研究范围冻结；本轮解包全文与 S01/T 邻接已核",
      "evidenceLimitation": "`GENERAL-RESEARCH`；定义 ID、G01 与相邻模板路由，不属于校方转专业政策。"
    },
    {
      "srcId": "SRC-013",
      "source": "成都理工大学材料与化学化工学院，[党政联席会 2026 年第3号通报 PDF](https://cmcc.cdut.edu.cn/__local/3/CE/7C/8937F3FCE340B1224CDBD01B80F_ED0AAE95_E91E.pdf)，物理页1",
      "scopeAndAccess": "2026-03-10、学院当期；`WEB-READ`",
      "evidenceLimitation": "`CDUT-VERIFIED`（仅证明学院会议审议本院 2026 实施方案）；未取得该方案正文，不能继承该学院具体录取规则。"
    },
    {
      "srcId": "SRC-014",
      "source": "成都理工大学环境与土木工程学院，[2026 年资格初审合格名单公告](https://cece.cdut.edu.cn/info/1063/9857.htm)",
      "scopeAndAccess": "2026-04、该院；`INDEX-ONLY / BLOCKED`",
      "evidenceLimitation": "`CDUT-VERIFIED`（该学院当年度曾先作资格初审）；不能把初审名单当专业录取名单。"
    },
    {
      "srcId": "SRC-015",
      "source": "成都理工大学数学科学学院，[2023 年规章制度目录：《全日制普通本科学生学籍管理办法（试行）》](https://math.cdut.edu.cn/txgz/gzzd.htm)",
      "scopeAndAccess": "网页列示 2023-01-10、普通本科；`INDEX-ONLY / BLOCKED`",
      "evidenceLimitation": "`CURRENTITY-UNKNOWN`（全文、批准/替代关系待取）；提示不能直接把 2019 规定作为现行。"
    }
  ],
  "criteria": [
    {
      "sectionId": "submission",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "fieldIds": [
        "F001",
        "F002",
        "F003",
        "F021"
      ],
      "materialSlotIds": [
        "M001",
        "M002"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "submission",
      "criterionId": "R002",
      "srcIds": [
        "SRC-002",
        "SRC-015"
      ],
      "fieldIds": [
        "F002",
        "F007",
        "F019"
      ],
      "materialSlotIds": [
        "M002"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "submission",
      "criterionId": "R005",
      "srcIds": [
        "SRC-003",
        "SRC-005"
      ],
      "fieldIds": [
        "F012",
        "F013",
        "F022"
      ],
      "materialSlotIds": [
        "M005",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "submission",
      "criterionId": "R009",
      "srcIds": [
        "SRC-004",
        "SRC-005"
      ],
      "fieldIds": [
        "F008",
        "F011",
        "F021"
      ],
      "materialSlotIds": [
        "M001",
        "M006"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "submission",
      "criterionId": "R027",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-015"
      ],
      "fieldIds": [
        "F012",
        "F022",
        "F034"
      ],
      "materialSlotIds": [
        "M005",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "submission",
      "criterionId": "R028",
      "srcIds": [
        "SRC-012"
      ],
      "fieldIds": [
        "F001",
        "F033",
        "F034"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M007",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "submission",
      "criterionId": "R029",
      "srcIds": [
        "SRC-012"
      ],
      "fieldIds": [
        "F003",
        "F035"
      ],
      "materialSlotIds": [
        "M013",
        "M014",
        "M015",
        "M016",
        "M017",
        "M018",
        "M019",
        "M020"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "eligibility",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-009"
      ],
      "fieldIds": [
        "F004",
        "F005",
        "F011",
        "F022"
      ],
      "materialSlotIds": [
        "M002",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "eligibility",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "fieldIds": [
        "F006",
        "F014",
        "F022"
      ],
      "materialSlotIds": [
        "M003",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "eligibility",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-013"
      ],
      "fieldIds": [
        "F008",
        "F010",
        "F020",
        "F022"
      ],
      "materialSlotIds": [
        "M004",
        "M012"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "eligibility",
      "criterionId": "R007",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "fieldIds": [
        "F015",
        "F022"
      ],
      "materialSlotIds": [
        "M024",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "eligibility",
      "criterionId": "R008",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "fieldIds": [
        "F016",
        "F022"
      ],
      "materialSlotIds": [
        "M023",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "eligibility",
      "criterionId": "R010",
      "srcIds": [
        "SRC-005",
        "SRC-006"
      ],
      "fieldIds": [
        "F022",
        "F023",
        "F024"
      ],
      "materialSlotIds": [
        "M007",
        "M008",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "eligibility",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "fieldIds": [
        "F006",
        "F014",
        "F022"
      ],
      "materialSlotIds": [
        "M003",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "eligibility",
      "criterionId": "R022",
      "srcIds": [
        "SRC-009"
      ],
      "fieldIds": [
        "F004",
        "F007",
        "F008",
        "F022"
      ],
      "materialSlotIds": [
        "M002",
        "M012",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "eligibility",
      "criterionId": "R023",
      "srcIds": [
        "SRC-003",
        "SRC-005"
      ],
      "fieldIds": [
        "F011",
        "F012",
        "F022",
        "F036"
      ],
      "materialSlotIds": [
        "M005",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "exceptions",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "fieldIds": [
        "F002",
        "F017",
        "F005"
      ],
      "materialSlotIds": [
        "M009",
        "M002"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "exceptions",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F018",
        "F032",
        "F005"
      ],
      "materialSlotIds": [
        "M010",
        "M002"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "exceptions",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F011",
        "F022",
        "F032"
      ],
      "materialSlotIds": [
        "M011",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "exceptions",
      "criterionId": "R026",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F002",
        "F007",
        "F008",
        "F011",
        "F030"
      ],
      "materialSlotIds": [
        "M022",
        "M017"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "assessment",
      "criterionId": "R014",
      "srcIds": [
        "SRC-005",
        "SRC-014"
      ],
      "fieldIds": [
        "F001",
        "F027",
        "F035"
      ],
      "materialSlotIds": [
        "M013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "assessment",
      "criterionId": "R015",
      "srcIds": [
        "SRC-005",
        "SRC-006"
      ],
      "fieldIds": [
        "F001",
        "F012",
        "F025",
        "F035"
      ],
      "materialSlotIds": [
        "M014"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "assessment",
      "criterionId": "R016",
      "srcIds": [
        "SRC-003",
        "SRC-006"
      ],
      "fieldIds": [
        "F022",
        "F025",
        "F026"
      ],
      "materialSlotIds": [
        "M004",
        "M012",
        "M014",
        "M015",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "official-result",
      "criterionId": "R017",
      "srcIds": [
        "SRC-005",
        "SRC-008"
      ],
      "fieldIds": [
        "F012",
        "F026",
        "F028"
      ],
      "materialSlotIds": [
        "M015"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "official-result",
      "criterionId": "R018",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-005"
      ],
      "fieldIds": [
        "F022",
        "F028",
        "F029"
      ],
      "materialSlotIds": [
        "M015",
        "M016",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "official-result",
      "criterionId": "R019",
      "srcIds": [
        "SRC-007",
        "SRC-008"
      ],
      "fieldIds": [
        "F002",
        "F007",
        "F008",
        "F030",
        "F035"
      ],
      "materialSlotIds": [
        "M017"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "official-result",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001",
        "SRC-008"
      ],
      "fieldIds": [
        "F007",
        "F008",
        "F030",
        "F031"
      ],
      "materialSlotIds": [
        "M017",
        "M018"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "review-withdraw",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "fieldIds": [
        "F003",
        "F022",
        "F036"
      ],
      "materialSlotIds": [
        "M019",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    },
    {
      "sectionId": "review-withdraw",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F029",
        "F030",
        "F035",
        "F036"
      ],
      "materialSlotIds": [
        "M016",
        "M020"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDecisionGate": "NEEDS_HUMAN_DECISION"
    }
  ]
} as const
