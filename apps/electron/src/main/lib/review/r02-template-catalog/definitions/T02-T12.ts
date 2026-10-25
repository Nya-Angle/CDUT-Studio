import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "T02-T12",
  "version": 1,
  "schemaVersion": 2,
  "name": "离职、辞职、解聘与离岗手续审核",
  "description": "本地研究模板 · 非校方正式模板。基于 R02 研究原件形成的事实预审与人工复核候选，不代表成都理工大学现行制度、授权或正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T02-T12 的研究稿并非校方正式模板；校本政策现行性、适用身份和最终审批权限须由有权人员核实。",
  "objectType": "person",
  "displayName": {
    "template": "{{title}}"
  },
  "fields": [
    {
      "key": "person_key",
      "label": "人员·学校主键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F001；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F001 | 人员·学校主键 `person_key:string` | L0 起 | 人事主数据/人员记录 ID；M001 | P2 | 缺失 `SOURCE_UNAVAILABLE` 并人工核人；不以姓名生成主键 |"
    },
    {
      "key": "legal_name",
      "label": "人员·法定姓名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F002；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F002 | 人员·法定姓名 `legal_name:string` | L0 起 | 人事主数据/劳动或聘用合同签约页；M001/M003 | P1 | 异名、改名保留曾用名证明并 `CONFLICT`，不自行合并 |"
    },
    {
      "key": "identity_verified",
      "label": "人员·身份核验状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F003；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F003 | 人员·身份核验状态 `identity_verified:enum` | L0/L1 | 可信登录断言或线下原件核验登记、证明人与时间；M002 | P2 | 未核则本人发起不可标“已认证”，转人工 |"
    },
    {
      "key": "relationship_class",
      "label": "人员·法律关系/人员类别",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F004；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F004 | 人员·法律关系/人员类别 `relationship_class:enum` | L0/L2 | 人事主数据+合同或真实雇佣主体核验；M001/M003/M026 | P2 | 未知或不一致 `POLICY_UNCONFIRMED`；先分流不套阈值 |"
    },
    {
      "key": "employer_entity_id",
      "label": "用工关系·签约雇主",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F005；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F005 | 用工关系·签约雇主 `employer_entity_id:string` | L0 | 合同首页、登记主体及人事核真；M003/M026 | P1 | 与学校/部门名不一致 `CONFLICT`，需核法人主体 |"
    },
    {
      "key": "work_unit_id",
      "label": "用工关系·在岗单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F006；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F006 | 用工关系·在岗单位 `work_unit_id:string` | L0/L5 | 校内组织人事主数据或单位盖章证明；M001/M008 | P1 | 不把“所在学院”推成合同雇主 |"
    },
    {
      "key": "work_location",
      "label": "用工关系·工作校区/地点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F007；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F007 | 用工关系·工作校区/地点 `work_location:string` | L0/L5 | 合同/岗位记录、组织安排；M001/M003 | P1 | 成都/宜宾仅路由交接地点，不能当身份类别 |"
    },
    {
      "key": "status_at",
      "label": "用工关系·在职状态和取数时点",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F008；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F008 | 用工关系·在职状态和取数时点 `status_at:enum+timestamp` | L0/L4 | 人事主数据带时间版本快照；M001 | P2 | 状态滞后 `CONFLICT`；不得用旧快照覆盖签发文书 |"
    },
    {
      "key": "contract_ref",
      "label": "合同·合同关联号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F009；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F009 | 合同·合同关联号 `contract_ref:string` | L0/L2 | 人事保管合同台账/签署原件；M003 | P2 | 一人多合同先指明本案目标，不能按最新文件名猜 |"
    },
    {
      "key": "contract_kind",
      "label": "合同·法律性质",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F010；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F010 | 合同·法律性质 `contract_kind:enum` | L0/L2 | 真实合同条款及用工主体；M003/M026 | P1 | 聘用合同/劳动合同/项目协议无法确定时人工判定 |"
    },
    {
      "key": "contract_version",
      "label": "合同·有效版本与签署状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F011；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F011 | 合同·有效版本与签署状态 `contract_version:ref+enum` | L0/L2 | 签署原本、补充/变更及台账版本；M003/M004 | P2 | 新旧冲突则暂停日期计算，保存全部版本 |"
    },
    {
      "key": "contract_start",
      "label": "合同·起始日",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F012；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F012 | 合同·起始日 `contract_start:date` | L0/L2 | 最新有效合同约定及用工记录；M003 | P1 | 合同无效或实际用工日有争议转人审 |"
    },
    {
      "key": "contract_end",
      "label": "合同·届满日/终止条件 contract_end:date",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F013；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F013 | 合同·届满日/终止条件 `contract_end:date|condition` | L0/L2/L4 | 最新有效合同/续签、实际履行证据；M003/M013 | P1 | 无固定期限不得伪造结束日；届期不自动等于终止 |"
    },
    {
      "key": "probation_range",
      "label": "合同·试用期边界",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F014；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F014 | 合同·试用期边界 `probation_range:date_range?` | L0/L1 | 已签劳动合同/有效试用约定；M003 | P1 | 试用期真假不明则不套 3 日通知 |"
    },
    {
      "key": "service_terms",
      "label": "附属义务·服务期/违约约定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F015；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F015 | 附属义务·服务期/违约约定引用 `service_terms:ref[]` | L0/L2 | 合同、专项协议与修订记录；M004 | P2 | 2019 样式非当前约定；不能直接算违约金或限制离职 |"
    },
    {
      "key": "special_duties",
      "label": "附属义务·保密/重大项目义务",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F016；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F016 | 附属义务·保密/重大项目义务 `special_duties:ref[]` | L0/L2/L5 | 专项有效协议、保密或项目权威记录；M004/M025 | P3 | 仅录有无及责任部门，内容涉密则最小披露，人工判断 |"
    },
    {
      "key": "contract_signer_authority",
      "label": "合同·签约授权引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F017；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F017 | 合同·签约授权引用 `contract_signer_authority:ref` | L0/L2 | 当时授权委托/学校权责记录；M007/M003 | P1 | 个人签名或章图像不证实授权，待核 |"
    },
    {
      "key": "event_id",
      "label": "审核案卷·本次事件唯一键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F018；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F018 | 审核案卷·本次事件唯一键 `event_id:string` | L0 起 | 案卷聚合的可信事件 ID 及源合同关联 | P1 | 重复建案检查同人、同合同、同事件，不跨事件覆盖 |"
    },
    {
      "key": "scenario_code",
      "label": "审核案卷·办理情形",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F019；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F019 | 审核案卷·办理情形 `scenario_code:enum` | L1/L2 | 人工确认的 A1–H2 类型及支撑事实 | P1 | 自动推荐仅候选，证据不足 `POLICY_UNCONFIRMED` |"
    },
    {
      "key": "initiator_id",
      "label": "发起事件·申报或单位发起者",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F020；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F020 | 发起事件·申报或单位发起者 `initiator_id:ref` | L1 | 可信认证/正式单位来文签发人；M002/M007/M008 | P2 | 来源为 Renderer 字段时不可信 |"
    },
    {
      "key": "actor_auth_ref",
      "label": "发起事件·实际 Actor 权限证据",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F021；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F021 | 发起事件·实际 Actor 权限证据 `actor_auth_ref:ref` | L1/L4/L7 | 后端鉴权、授权期限、委托范围快照；M007 | P2 | 权限过期/范围不符拒绝承认动作，保留日志 |"
    },
    {
      "key": "notice_ref",
      "label": "发起事件·通知/意向正文版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F022；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F022 | 发起事件·通知/意向正文版本 `notice_ref:ref` | L1 | 本人书面签署的通知或原件引用；M005/M012 | P2 | 无本人意思表示不可替代为 HR 代填摘要 |"
    },
    {
      "key": "notice_signed_at",
      "label": "发起事件·通知署期/提交时点",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F023；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F023 | 发起事件·通知署期/提交时点 `notice_signed_at:date?` | L1 | 原文签署日期/可信提交事件；M005 | P1 | 签署与系统上传时间分开，手写不清 `UNREADABLE` |"
    },
    {
      "key": "notice_received_at",
      "label": "送达事件·通知实际到达时点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F024；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F024 | 送达事件·通知实际到达时点 `notice_received_at:timestamp?` | L1/L2 | 签收、收文、可信投递回执；M006 | P2 | 未送达不得臆测 T+30 生效；已提交未送达是不同状态 |"
    },
    {
      "key": "proposed_end_at",
      "label": "发起事件·拟离岗/拟解除日期",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F025；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F025 | 发起事件·拟离岗/拟解除日期 `proposed_end_at:date?` | L1/L2 | 本人通知、协议草案或单位书面建议；M005/M012/M014 | P1 | 仅为主张日期，不等于法律生效日期 F034 |"
    },
    {
      "key": "reason_refs",
      "label": "发起事件·事项理由与依据",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F026；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F026 | 发起事件·事项理由与依据 `reason_refs:ref[]` | L1/L2 | 本人陈述/单位事实报告/有权决定引用；M008/M027 | P2 | 事实原因与法律定性分开，人工认定有争议原因 |"
    },
    {
      "key": "unit_opinion_ref",
      "label": "组织意见·单位事实/拟处理意见",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F027；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F027 | 组织意见·单位事实/拟处理意见 `unit_opinion_ref:ref?` | L2/L3 | 二级单位签发书面事实意见、核真回执；M008/M014 | P2 | 未出意见按是否校本要求判断，不默认初始必需 |"
    },
    {
      "key": "upstream_decision_ref",
      "label": "前置决定·考核/处分/项目结论键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F028；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F028 | 前置决定·考核/处分/项目结论键 `upstream_decision_ref:ref?` | L2 | 原考核或处分等权威系统/机关文书；M009/M010/M025 | P2/P3 | PDF 无法核签发单位时 `SOURCE_UNAVAILABLE` |"
    },
    {
      "key": "upstream_status",
      "label": "前置决定·生效/复核状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F029；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F029 | 前置决定·生效/复核状态 `upstream_status:enum+time` | L2/L4 | 原决定机关状态或认证文书；M009/M010/M024 | P2 | “拟”“公示”“已决定”分开，不能自动升级 |"
    },
    {
      "key": "protected_fact_ref",
      "label": "解除限制·保护事实核验",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F030；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F030 | 解除限制·保护事实核验 `protected_fact_ref:ref?` | L2 | 在法律准许范围内由专责人事/医疗鉴别结果；M011 | P3 | 不强收病历全页；来源不明需人工且最小披露 |"
    },
    {
      "key": "agreement_signatures",
      "label": "双方合意·协议签章状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F031；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F031 | 双方合意·协议签章状态 `agreement_signatures:enum+refs` | L1/L4 | 双方签署原本/可信电子签章及授权；M012/M007 | P2 | 草案/一方签署不等于已达成合意 |"
    },
    {
      "key": "decision_ref",
      "label": "有权决定·正式文书引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F032；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F032 | 有权决定·正式文书引用 `decision_ref:ref?` | L4 | 人事/校级真实签发文书，文号及版本；M015 | P2 | 未有决定不得靠 AI 生成替代；依法通知路径另区分 |"
    },
    {
      "key": "decision_signer",
      "label": "有权决定·签发主体与权限",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F033；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F033 | 有权决定·签发主体与权限 `decision_signer:ref` | L4 | 机关授权表/实际签发记录；M007/M015 | P2 | 旧职务表或公章扫描无法证明现行权限 |"
    },
    {
      "key": "legal_effect_at",
      "label": "法律效果·确认的生效时点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F034；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F034 | 法律效果·确认的生效时点 `legal_effect_at:timestamp?` | L4 | 法规、合同、送达与有权正式文书综合人工确认；M003/M006/M012/M015 | P2 | 不能由 F025 直接复制，争议标 `NEEDS_HUMAN_DECISION` |"
    },
    {
      "key": "decision_receipt_ref",
      "label": "送达事件·决定送达/签收",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F035；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F035 | 送达事件·决定送达/签收 `decision_receipt_ref:ref?` | L4 | 送达登记/可鉴别签收凭证；M016 | P2 | 未生成时 L1–L3 不缺件；L4 依据适用程序核 |"
    },
    {
      "key": "withdrawal_ref",
      "label": "撤回/变更·提出及到达时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F036；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F036 | 撤回/变更·提出及到达时间 `withdrawal_ref:ref?` | L3/L7 | 本人/单位有效提出文书及接收回执；M017 | P2 | 只能记录请求，不能自动撤回已生效法定后果 |"
    },
    {
      "key": "dispute_ref",
      "label": "复核争议·案件与有效结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F037；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F037 | 复核争议·案件与有效结果 `dispute_ref:ref?` | L7 | 有权受理/仲裁/裁判机关文书；M024 | P3 | 不将投诉材料当生效裁决；限制访问和公开 |"
    },
    {
      "key": "work_handoff",
      "label": "交接·工作资料任务",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F038；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F038 | 交接·工作资料任务 `work_handoff:enum+ref` | L5 | 在岗单位接收人签收或权威记录；M018 | P2 | 不自动接受本人自报“已交接” |"
    },
    {
      "key": "asset_handoff",
      "label": "交接·资产及涉密载体",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F039；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F039 | 交接·资产及涉密载体 `asset_handoff:enum+ref` | L5 | 资产/保密实际责任部门回执；M019 | P3 | 缺权威证明 `NEEDS_MATERIAL`，涉密内容不进开放案卷 |"
    },
    {
      "key": "library_clearance",
      "label": "交接·图书借阅清还",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F040；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F040 | 交接·图书借阅清还 `library_clearance:enum+ref` | L5 | 成都理工大学图书馆核真记录；M020 | P1 | 适用时查 SRC-008；不据此重定 F034 |"
    },
    {
      "key": "access_revocation",
      "label": "交接·信息账户回收",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F041；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F041 | 交接·信息账户回收 `access_revocation:enum+ref` | L5 | 信息化/权限系统有权经办记录；M021 | P2/P3 | 该校此流程细则未核，不设全员必需 |"
    },
    {
      "key": "transfer_status",
      "label": "后续转移·档案/社保去向",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F042；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F042 | 后续转移·档案/社保去向 `transfer_status:enum+refs` | L6 | 人事档案/社保接收回执；M022 | P2 | 不许本人上传未知接收单位身份证件；责任主体核实 |"
    },
    {
      "key": "settlement_status",
      "label": "后续结算·是否存在未结事项",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F043；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F043 | 后续结算·是否存在未结事项 `settlement_status:enum+ref` | L6 | 财务薪酬/科研等专责系统结论；M023 | P3 | 不填补偿金额推定值、不将未结等同法律关系未解除 |"
    },
    {
      "key": "evidence_version",
      "label": "证据版本·源版本/摘要指纹",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F044；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F044 | 证据版本·源版本/摘要指纹 `evidence_version:ref+hash` | 每次更换材料 | 原件存证、文件 hash、权威系统 version、归属对象；M001–M030 | P2 | 更换后使依赖旧版本的事实审查失效，保留旧历史 |"
    },
    {
      "key": "policy_basis",
      "label": "适用依据·政策版本和核实状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F045；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F045 | 适用依据·政策版本和核实状态 `policy_basis:refs+enum` | L0/L2/L4 | SRC 索引/学校制度发布与失效记录；SRC-001/003/005/009/010 等 | P0/P1 | 当前校本规章缺失则 `POLICY_UNCONFIRMED`，不填历史阈值 |"
    },
    {
      "key": "evidence_link",
      "label": "证据关联·跨材料同一主体/事件键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F046；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F046 | 证据关联·跨材料同一主体/事件键 `evidence_link:ref[]` | L1–L7 | 真实合同号、文号、人员主键、时间与来源交叉核对；M001–M030 | P2 | 仅同名、同文件夹、OCR 近似都不能确认为同一事件 |"
    },
    {
      "key": "disciplinary_case_state",
      "label": "处分程序·正式立案/结案与期间",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F047；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F047 | 处分程序·正式立案/结案与期间 `disciplinary_case_state:enum+dates+ref` | E2 的 L1/L2/L4 条件 | 有权处分立案机关出具的最小状态回执 M028（非匿名举报/拟调查） | P3 | `NO_FORMAL_CASE/OPEN/CLOSED/UNKNOWN`；状态不可查 `SOURCE_UNAVAILABLE`，法律适用交人审，不公开案情 |"
    },
    {
      "key": "union_notice_ref",
      "label": "劳动合同单方解除·工会通知与反馈",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F048；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F048 | 劳动合同单方解除·工会通知与反馈 `union_notice_ref:ref?` | D2 劳动关系 L2–L4 条件 | 真实雇主向适当工会说明理由的收文/反馈记录 M029 | P2 | 法定程序范围与组织情形不清 `POLICY_UNCONFIRMED`；不得由单位内部“已讨论”文字替代 |"
    },
    {
      "key": "termination_certificate_ref",
      "label": "劳动合同终止/解除证明",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F049；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F049 | 劳动合同终止/解除证明 `termination_certificate_ref:ref?` | 适用劳动合同法的 L4–L6 后续 | 实际用人单位出具并可核真的解除/终止劳动合同证明 M030 | P2 | 与通知 M005、解聘决定 M015、工作交接回执 M018 均非同一文书；未进入法定出证节点不报缺失 |"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "在职身份及人员归属",
      "purpose": "**在职身份及人员归属**；学校人事管理部门持有的人员主数据记录/签章证明；L0 当期，内部取证优先；人事科核真书面证明或加鉴别的摘录；F001–F008；SRC-001/003/006；一人一主键、记录快照日期；来源失联 `SOURCE_UNAVAILABLE`，不强令本人自填“编制”",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "在职身份及人员归属与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "真实本人/代理递交身份",
      "purpose": "**真实本人/代理递交身份**；认证平台鉴别断言或人事当面核对凭证；L1 当期；校方工作人员核验证件并留脱敏核验记录；代理另见 M007；F001–F003/F020–F021；SRC-016；校验认证有效时点与对象；照片不清 `UNREADABLE`、不可鉴别 `NEEDS_HUMAN_DECISION`",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "真实本人/代理递交身份与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "当前签约关系与期限",
      "purpose": "**当前签约关系与期限**；学校人事档案/当事人持有的聘用或劳动合同原本；L0/L2 当期核来源；人事处可核验的合同台账及关键条款摘录；合同丢失由合同双方人工核真；F004–F005/F009–F014/F017；SRC-003/006/009/010；签约双方、编号及最新有效版；缺失 `SOURCE_UNAVAILABLE`，旧版冲突 `CONFLICT`",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "当前签约关系与期限与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "服务期、专项/保密约定与变更",
      "purpose": "**服务期、专项/保密约定与变更**；人事/专项管理单位与本人所持有效附件、补充协议；L2 条件（发现约定或特殊人员）；经双方确认的合同档案摘录、权威专项台账；F011/F015–F017；SRC-003/015/016；逐协议签署日、效力和项目归属；旧 2019/2022 样式非本人现合同，缺失不自动拒绝",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "服务期、专项/保密约定与变更与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "本人辞聘/辞职的实际意思表示",
      "purpose": "**本人辞聘/辞职的实际意思表示**；本人签署书面通知或可信电子签署文书；A/B 的 L1 当期；符合法律形式并可验证本人签署和内容的电子书面通知；F019–F023/F025；SRC-009/010/001；本人、关联合同、内容及署期；非本人签署 `CONFLICT`，不清 `UNREADABLE`",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "本人辞聘/辞职的实际意思表示与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "书面通知何时送达用人单位",
      "purpose": "**书面通知何时送达用人单位**；学校/雇主收文、电子送达凭据、签收记录；L1 后通知已投递时当期；尚未到达则标待发生；有权接收部门核真并附时点说明的签收证明；F024/F034/F046；SRC-009/010；文书与接收主体绑定；只上传而无收悉不能计算时限，`NEEDS_MATERIAL`（已声称送达时）",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "书面通知何时送达用人单位与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "代理、发起、合同/决定签署的授权",
      "purpose": "**代理、发起、合同/决定签署的授权**；学校组织人事部门/法定雇主授权文件与后端角色登记；L1/L4 条件；凡非本人或签发行为须有权限来源；有权部门给出的有效授权范围、起止与核真记录；F017/F020–F021/F031/F033；SRC-002/003/016；授权人、被授权人、事项范围、当时效力；仅前端 Actor `CONFLICT`，无授权不能认可签发",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "代理、发起、合同/决定签署的授权与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "单位发起解除的事实与意见",
      "purpose": "**单位发起解除的事实与意见**；实际用工单位书面事实报告/经办记录；D/E 的 L1/L2 当期；他类仅条件；真实业务负责人签署的事实说明及指向可核原始台账；F020/F026–F027；SRC-009/003；事件与签发单位关联，主张/证明分离；缺失 `NEEDS_MATERIAL`，不可读 `UNREADABLE`",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "单位发起解除的事实与意见与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "考核结果的权威前置事实",
      "purpose": "**考核结果的权威前置事实**；原年度/聘期考核归口部门的有效结论；D1 或以考核为前提的 F1 的 L2 条件；原考核系统有权摘要/签章结论及复核状态；F026/F028–F029；SRC-009/003/004；原决定 ID、人员、年度、状态；草案/截图不得升级为有效考核，`SOURCE_UNAVAILABLE`",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "考核结果的权威前置事实与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "处分决定而非线索",
      "purpose": "**处分决定而非线索**；有权纪律/人事处分机构的正式决定；E1 L2 条件且为关键前置；决定机关鉴别的正文、送达与状态摘要；F028–F029/F034；SRC-009/014；文号、生效/争议状态；只有拟处理或通报时 `NEEDS_HUMAN_DECISION`",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "处分决定而非线索与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "单位解除禁限或特别保护事实",
      "purpose": "**单位解除禁限或特别保护事实**；人事、工伤、依法可核医疗等专责部门的最少必要结论；D1/D2 L2 条件，需按具体解除事由和身份判断；专责机构对条件是否成立的核验意见（不复制病历）；F030；SRC-003（历史）、009/010/016；高敏有权查看；未取不得推定“无保护”；来源失联交人工，信息过量应遮盖",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "单位解除禁限或特别保护事实与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "双方协商解除意向及有效合意",
      "purpose": "**双方协商解除意向及有效合意**；劳动者和真实雇主持有的协商方案或正式签署协议；C1 L1 草案当期；L4 才核正式合意；双方可信电子签署版/合同档案核真；F025/F031/F034；SRC-003/010/009；标 `DRAFT/ONE_SIDE/SIGNED`；缺一方授权不得认定合意，不能提前要签章",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "双方协商解除意向及有效合意与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "合同届期、续签/实际履行事实",
      "purpose": "**合同届期、续签/实际履行事实**；合同双方、人事/考勤记录持有人；F1 L2 条件；到期前可先核合同结束日；当时有效续聘决定/签约台账或有权人事证明确认；F011/F013/F029/F034；SRC-009/010/003/004；跨合同版归属，存在继续工作争议时 `CONFLICT` 不自动终止",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "合同届期、续签/实际履行事实与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "单位拟解聘/通知草案或事项启动记录",
      "purpose": "**单位拟解聘/通知草案或事项启动记录**；单位与人事部门；D1/D2 L1/L2 当期，具体通知义务依依据；有权机关的拟办通知/内部立项记录（必须标草稿）；F025–F027/F045；SRC-009/010/001；`PROPOSED` 不等于正式决定；未有可先保留单位事实 M008",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "单位拟解聘/通知草案或事项启动记录与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "正式解除/终止/调出等有权文书",
      "purpose": "**正式解除/终止/调出等有权文书**；学校真实有权机关/合同签约方；L4 后续产生；G1/G2 已到 L5 时是历史当期证据；有权人事机构认证的法律效果记录；依法通知解除情形不得强迫提供“批准书”；F032–F034/F046；SRC-002/003（历史）/009/010；文号、签发、合同、状态与版本；L1 不缺件，L4 来源失联 `SOURCE_UNAVAILABLE`",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "正式解除/终止/调出等有权文书与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "正式决定告知/送达",
      "purpose": "**正式决定告知/送达**；决定签发方和送达经办单位；L4 后续且视程序条件核；真实收文回执、邮递签收、可信电子送达记录；F034–F035；SRC-009/010；与 M015 同文书号，时间矛盾 `CONFLICT`，不能借用 M006 不同通知",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "正式决定告知/送达与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "撤回、补件、陈述、材料更正请求",
      "purpose": "**撤回、补件、陈述、材料更正请求**；本人、单位或可合法代理者；L3/L7 条件，不前置；可信提交历史/盖章书面更正及签收；F022–F024/F036/F044；SRC-009/010/014；新旧版本/接收日共存，撤回请求≠撤回生效，缺签名与权限人审",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "撤回、补件、陈述、材料更正请求与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "岗位职责、文件与工作交接",
      "purpose": "**岗位职责、文件与工作交接**；原工作部门及实际接收人；L5 后续；若办到交接阶段才当期；具职务权限接收人签收的逐项清单/台账；F006/F038/F046；SRC-007（归档线索）；每条归属清晰，不同接收部门分开；没有签收 `NEEDS_MATERIAL`，清单不清 `UNREADABLE`",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "岗位职责、文件与工作交接与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "固定资产、涉密载体及项目资料移交",
      "purpose": "**固定资产、涉密载体及项目资料移交**；资产/保密/科研专责机构；L5 条件后续，适用类别由校方核定；实际设备台账交接、涉密经办“完成/待办”脱敏证明；F016/F039；SRC-003（历史）/016；同资产/项目 ID 与实际接收人，涉密原文受控；缺失不能自动判“侵占”",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "固定资产、涉密载体及项目资料移交与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "图书馆借阅清还/遗失处理",
      "purpose": "**图书馆借阅清还/遗失处理**；成都理工大学图书馆；L5 后续，符合 SRC-008 的人员当期；图书馆可信清还查询/经办盖章回执；F040；SRC-008；借阅号与本人关联；若未办交接显示待办，不反向推断解除无效",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "图书馆借阅清还/遗失处理与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "账号、门禁及系统权限回收",
      "purpose": "**账号、门禁及系统权限回收**；信息化/系统权限责任部门；L5 条件后续，学校是否列正式离校项待核；受控系统撤权审计或权限管理员签章记录；F041；SRC-016、校本依据待查；账号主体必须可信；来源失联不以个人截图认定已销权",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "账号、门禁及系统权限回收与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "人事档案、社保/关系转移结果",
      "purpose": "**人事档案、社保/关系转移结果**；人事档案及各法定经办部门；L6 后续；法律关系适用的事项才当期核；有权接收部门/人社/档案单位的真实回执；F042；SRC-007/010；档案去向/接收 ID 脱敏；缺失按专责后续待办，不作解除前门槛",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "人事档案、社保/关系转移结果与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "薪资、保险、服务期、科研款项等结算结论",
      "purpose": "**薪资、保险、服务期、科研款项等结算结论**；财务、薪酬社保、科研归口；L6 条件后续；专责部门结算/争议处理结果的最小摘要；F043；SRC-003（历史）/010/015；金额、账户保密；AI 不算违约金额，缺失不自动影响 F034",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "薪资、保险、服务期、科研款项等结算结论与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "申诉/复核/仲裁/裁判与纠正决定",
      "purpose": "**申诉/复核/仲裁/裁判与纠正决定**；有权争议机关；L7 条件，只有实际提出后产生；受理机关可查文号/结果及生效状态；F029/F036–F037；SRC-009/010/014；区分申请、受理、决定、生效；来源失联 `SOURCE_UNAVAILABLE`，无文书不得虚构救济结果",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "申诉/复核/仲裁/裁判与纠正决定与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "专项人才、博士后或重大项目的真实管理结论",
      "purpose": "**专项人才、博士后或重大项目的真实管理结论**；人才/科研/博士后归口单位；H1 L2 条件；专责有权认定的项目结题/聘期考核/协议状态摘录；F015–F016/F028–F029；SRC-015（版本未核）/009；项目、期次和本人版本一致；旧政策 `POLICY_UNCONFIRMED`，不作离职否决",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "专项人才、博士后或重大项目的真实管理结论与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "是否属于校方法定用人主体",
      "purpose": "**是否属于校方法定用人主体**；真实雇主、派遣单位及学校合同管理人员；H1/H2 L0 条件且为路由关键；注册雇主与合同签署方的权威核验/派遣协议的最小摘要；F004–F006/F010；SRC-006/012/010；证据显示外部法人则学校解聘审查 `NOT_APPLICABLE`；查不到则人工，不伪造校园授权",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "是否属于校方法定用人主体与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "当事人对单位提出事项的书面意见、申辩与送达",
      "purpose": "**当事人对单位提出事项的书面意见、申辩与送达**；当事人、合法代理人及有权收件部门；D/E 的 L3 条件，不强迫在 L1 立即提供；有鉴别的书面陈述、可信提交与签收记录；F020/F026/F030/F036；SRC-009/010/014；对应拟处理事件和到达时间；未发表意见≠当然同意解除，来源不明人审",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "当事人对单位提出事项的书面意见、申辩与送达与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "正式处分立案与结案/撤案最小状态证明",
      "purpose": "**正式处分立案与结案/撤案最小状态证明**；依法有权处分立案机关持有；E2 发现案件线索且涉及 SRC-018 第 26 条时 L1/L2 条件；非全员必备；有权部门脱敏状态回执（案件编号、对象、批准立案/结案日期及核验签章）而非卷宗；F019/F029/F047/F046；SRC-018；只验是否“正式立案”及状态、起止；匿名举报或拟调查非同等证据。缺权威来源 `SOURCE_UNAVAILABLE`、法律适用 `NEEDS_HUMAN_DECISION`，不得公开案情",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "正式处分立案与结案/撤案最小状态证明与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "劳动合同单方解除的工会通知/意见回执",
      "purpose": "**劳动合同单方解除的工会通知/意见回执**；真实用人单位与有权工会；D2 真实劳动关系、用人单位单方解除且法定节点进入时 L2–L4 条件；工会实际收件确认与单位处理记录（最小摘要）；F005/F026/F048；SRC-010 第 43 条；与合同雇主、拟解除理由/日期、工会主体/回函版本一致；没有实际单方劳动合同解除则 `NOT_APPLICABLE`，适用性未核 `POLICY_UNCONFIRMED`",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "劳动合同单方解除的工会通知/意见回执与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M030",
      "name": "解除/终止劳动合同证明",
      "purpose": "**解除/终止劳动合同证明**；真实用人单位法定出具并由当事人/人事留存；适用劳动合同法第 50 条且解除/终止节点已经形成后的 L4/L6，绝不在 L1 报缺；雇主可核真电子或纸质出证记录（须内容与书面证明要求一致）；F005/F034/F042/F049；SRC-010 第 50 条；不等同 M005 本人通知、M015 单位处理文书或 M018 交接；未到法定出具节点 `NOT_APPLICABLE`，已到却不可查为 `SOURCE_UNAVAILABLE`/待出证",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "解除/终止劳动合同证明与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "fact-review",
      "name": "事实与权限核验",
      "description": "对应研究原件第 08 节的事实核验规则；所有结果只供本地人工审阅，不替代校方决定。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "R001 人员真实身份与本人绑定",
          "requirement": "**R001** 人员真实身份与本人绑定；L0/L1；SRC-001/016；F001–F003；M001/M002；T=本人/其材料已进入本案；F=经证实不是本案目标者（对其 `NOT_APPLICABLE`）；U=人事主键或身份鉴别暂不可取；对人事主键、合同姓名、现场/可信认证身份同一时点核对；改名需合法关联记录；截图或前端姓名不可替代身份；对代理另触 R005；完全一致 `PASS_FACT`；主键/实名相抵 `CONFLICT`；认证失联 `SOURCE_UNAVAILABLE`；证件字迹不清 `UNREADABLE`；由人事核身。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "R002 法律关系、雇主与在岗单位区分",
          "requirement": "**R002** 法律关系、雇主与在岗单位区分；L0/L2（A–H）；SRC-003/005/006/009/010/012；F004–F008/F010；M001/M003/M026；T=需确定用工主体；F=既有有权证明已明确非本校关系，学校解除审查 `NOT_APPLICABLE`；U=雇主/合同法律性质不能查证；比对真实签约主体、用人记录和当时身份；二级学院、工作校区不是法人雇主；2026 教辅公告只证该批次，校企表单只证该公司；同一关系事实 `PASS_FACT`；合同与档案不一致 `CONFLICT`；原雇主来源失联 `SOURCE_UNAVAILABLE`；法律性质不明 `NEEDS_HUMAN_DECISION`；人事及真实雇主核。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "R003 目标合同、变更链和有效版本",
          "requirement": "**R003** 目标合同、变更链和有效版本；L0/L2；SRC-003/009/010；F009/F011–F013/F044；M003/M004；T=本案依赖合同条款；F=关系类型无此合同证据义务且有他种合法来源；U=多份合同无法识别目标；核合同号、双方签署、补充协议签订/适用起止与变更覆盖范围；原合同与补充协议保留链，不以文件上传时刻判效；版本清晰 `PASS_FACT`；版本抵牾 `CONFLICT`；校内原件未开放 `SOURCE_UNAVAILABLE`；条款效力争议 `NEEDS_HUMAN_DECISION`；合同管理归口。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "R004 本案情形与依据版本可适用",
          "requirement": "**R004** 本案情形与依据版本可适用；L0/L2/L4；SRC-001/003/004/005/009/010/011/015；F004/F019/F045；M001/M003/M004；T=需要按身份选择法源/校本流程；F=事实已证实非本模板事项 `NOT_APPLICABLE`；U=现行办法、适用批次或身份未知；核学校现行发布日期/施行/废止、关系类别及事件时点；2019/2022 历史文本和 2025 会议简讯不能推出现行细则；外校 SRC-013 **永不作为放行依据**；明确适用层级 `PASS_FACT`（仅“选源正确”）；校本缺正文/时效 `POLICY_UNCONFIRMED`；行政适用争议 `NEEDS_HUMAN_DECISION`；人事政策责任人。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "R005 发起或代理操作身份与授权",
          "requirement": "**R005** 发起或代理操作身份与授权；L1/L4/L7；SRC-002/003/016；F017/F020–F021；M002/M007；T=实际发起、代办或签章动作；F=未发生相应操作 `NOT_APPLICABLE`；U=真实后台 Actor/委托范围不可核；认证主体与当时授权的受托人、事项、期间、真实法律相对方核对；本人可书面通知不等于任意代理可代签；Renderer `actor=teacher` 非凭证；合法范围核对 `PASS_FACT`；主体冒用 `CONFLICT`；授权不可取 `SOURCE_UNAVAILABLE`；代理意思表示限制 `NEEDS_HUMAN_DECISION`；后端鉴权管理与人事。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "R006 本人主动辞聘/辞职书面意思",
          "requirement": "**R006** 本人主动辞聘/辞职书面意思；L1（A1/A2/B1/B2）；SRC-001/009/010；F019/F020/F022–F023；M002/M005；T=本人主动提出通知；F=单位发起/双方协商且无本人单方通知 `NOT_APPLICABLE`；U=发起者或事件属性未明；对本人签署、文书内容、日期及目标合同逐项核；“辞聘审批表”未知，不能代替法律上可用的书面通知；如 B1 声称 SRC-010 第38条例外，另在 R008 交人工分类；真实通知 `PASS_FACT`（仅文书事实）；缺当期 M005 `NEEDS_MATERIAL`；签名不清 `UNREADABLE`；非本人 `CONFLICT`；人事受理/本人核。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "R007 本人通知送达与签收时点",
          "requirement": "**R007** 本人通知送达与签收时点；L1/L2（A/B）；SRC-009/010；F023–F024/F046；M005/M006；T=通知确已投递或主张雇主收到；F=尚未投递，送达核对暂 `NOT_APPLICABLE`；U=收文记录无法访问；`signed_at != uploaded_at != received_at`；按收件主体、文书版本和签收原件核，单方上传截图不能代证收讫；有多次送达需逐次记；有效到达事实 `PASS_FACT`；声称已送达但缺回执 `NEEDS_MATERIAL`；收文系统不可查 `SOURCE_UNAVAILABLE`；时点矛盾 `CONFLICT`；雇主收件单位。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "R008 通知期间与例外路径的日期事实",
          "requirement": "**R008** 通知期间与例外路径的日期事实；L2（A/B）；SRC-003（历史）/009/010；F004/F014–F015/F024–F025/F034；M003/M004/M005/M006；T=已确认使用 SRC-009 第17条或 SRC-010 第37条的普通通知路径；F=真实协商/单位解除/经人工确认的第38条特别解除 `NOT_APPLICABLE`；U=试用期、另约或理由性质未核；仅计算已证实送达日到拟日期的日历间隔并列上位法条；事业编另约、劳动者即时解除、法定适用和争议由人审；**计算满足也不判法律效果**；日期比较可核 `PASS_FACT`；校本/另约未知 `POLICY_UNCONFIRMED`；法定例外或不足期间争议 `NEEDS_HUMAN_DECISION`；人事/法务/双方当事人。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "R009 单位处理发起事实与事由",
          "requirement": "**R009** 单位处理发起事实与事由；L1/L2（D/E）；SRC-003（历史）/009/010；F020/F026–F027；M008/M014；T=单位单方拟解除；F=只有本人通知或双方谈判 `NOT_APPLICABLE`；U=单位来文真实性不明；区分原始事实与法律定性、拟办与正式文书；对事项期间、在岗单位及签发主体核对；不同事由不得统一套第16条或劳动法第40条；事实报告可核 `PASS_FACT`；本阶段必要的 M008 缺 `NEEDS_MATERIAL`；真实性冲突 `CONFLICT`；定性 `NEEDS_HUMAN_DECISION`；所在单位与人事。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "R010 年度/聘期考核前置决定引用",
          "requirement": "**R010** 年度/聘期考核前置决定引用；L2（D1/F1条件）；SRC-003（历史）/004/009；F026/F028–F029；M009；T=解除/续聘事由明确依赖考核；F=与考核无关的解除 `NOT_APPLICABLE`；U=原决定、复核状态不知；核 `decision_id+subject+assessment_period+status+version`，仅消费 T02-T05/T02-T06 原有权结论；公示/截图不得升级为生效；第16条还需额外事实与程序；权威考核记录核对 `PASS_FACT`；原部门取数失联 `SOURCE_UNAVAILABLE`；人/期次不符 `CONFLICT`；是否符合法定解聘要件 `NEEDS_HUMAN_DECISION`；考核归口→人事。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "R011 处分前置事实与效力",
          "requirement": "**R011** 处分前置事实与效力；L2（E1条件）；SRC-009/014；F028–F029；M010/M024；T=拟以处分为解除前提；F=仅一般劳动合同解除且无处分关系 `NOT_APPLICABLE`；U=处分状态不明；核正式处分文号、种类（特别区分开除）、被处分者、签发机关、复核/纠正版本；调查、拟处分、公示不是生效处分；正式文书事实 `PASS_FACT`；原机关不可核 `SOURCE_UNAVAILABLE`；只是调查线索/处分法律效果 `NEEDS_HUMAN_DECISION`；处分权机关→人事。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "R012 单位解除相关保护/禁限事实",
          "requirement": "**R012** 单位解除相关保护/禁限事实；L2（D1/D2条件）；SRC-003（历史）/009/010/016；F030；M011；T=拟单方解除且特定法定事由需要查保护事实；F=本人主动通知或无此法律触发 `NOT_APPLICABLE`；U=适用法及个人特殊保护条件未明；专责机关只给“存在/不存在/未知”最少必要核验，不收集全病历或猜孕产/工伤；保护条件与时间状态绑定，不得从未见材料推定不存在；可信最小结论 `PASS_FACT`（仅保护事实）；原机关失联 `SOURCE_UNAVAILABLE`；法律禁限/例外 `NEEDS_HUMAN_DECISION`；人事法务与专责机构。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "R013 协商解除合意与签署状态",
          "requirement": "**R013** 协商解除合意与签署状态；L1/L4（C1）；SRC-003（历史）/009/010；F017/F025/F031；M003/M007/M012；T=双方协商解除；F=单方书面通知或单位单方拟解除 `NOT_APPLICABLE`；U=双方是否真实合意未知；`DRAFT/ONE_SIDE/SIGNED` 分开；逐方核真实合同主体、授权、协议条款及签署时点；L1 只能核草案，**L4 才可能核最终合意**；草案存在/双方签署事实 `PASS_FACT`（各自子事实）；缺签名 `NEEDS_MATERIAL` 仅当宣称已正式签署；效力争议 `NEEDS_HUMAN_DECISION`；双方签约人/人事。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "R014 合同届期与续签/继续履行",
          "requirement": "**R014** 合同届期与续签/继续履行；L2/L4（F1）；SRC-003（历史）/009/010；F008/F011/F013/F029/F034；M001/M003/M013；T=因到期/不续聘拟处理；F=固定事项并非期限终止 `NOT_APPLICABLE`；U=现行终止条件不明；核最新版合同结束条款、续订/调岗与届满后实履记录，先辨无固定期限；时间截至点与签约版本绑定；不能仅因到期日已过推断人事关系解除；届期/续签事实 `PASS_FACT`；两方记录冲突 `CONFLICT`；终止效果/法定续订限制 `NEEDS_HUMAN_DECISION`；合同双方、人事。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "R015 专项人才/服务期及项目权威结论",
          "requirement": "**R015** 专项人才/服务期及项目权威结论；L2（A2/H1条件）；SRC-003（历史）/005/009/015；F015–F016/F028–F029；M004/M025；T=确有专项协议、服务期、脱密或项目义务；F=人事与合同均证实没有专项触发 `NOT_APPLICABLE`；U=现行专项办法/协议版本不明；合同特殊条款与项目人、期次、真实归口结论相连；`SRC-015` 为 2022 非官网副本且效力疑点，不能写“必须服务几年/欠多少钱”；协议/项目事实可核 `PASS_FACT`；政策版本 `POLICY_UNCONFIRMED`；实质解除、补偿或脱密效力 `NEEDS_HUMAN_DECISION`；人才/科研/保密归口。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "R016 当事人陈述及告知机会事实",
          "requirement": "**R016** 当事人陈述及告知机会事实；L3（D/E条件）；SRC-009/010/014；F020/F026–F027/F036；M008/M014/M027；T=该事由及真实程序要求当事人陈述/告知；F=未到程序节点或并无相应法定要求 `NOT_APPLICABLE`；U=程序权利和校本步骤不明；核拟处理同一事件的送达、陈述提交与时点；**沉默不等于同意**；若校本程序不明，不能把本人未上传申辩认定为违失；陈述收悉事实 `PASS_FACT`；此阶段已应有且缺记录 `NEEDS_MATERIAL`；要求依据未知 `POLICY_UNCONFIRMED`；单位/人事/申诉机关。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "R017 决定签发者真实权限",
          "requirement": "**R017** 决定签发者真实权限；L4；SRC-002/003（历史）/016；F017/F021/F033；M007/M015；T=存在拟签发/已签发学校或雇主正式决定；F=依法单方通知发生效果且不涉及学校行政批准文书 `NOT_APPLICABLE`；U=授权表和当时任职不可核；仅可信组织权限或法定代表/委托链可证明签发；前端 Actor、扫描印章、2019 合同样式不证明 2026 权限；不同身份审批机关待校本核；有权身份核对 `PASS_FACT`；冒签/时点矛盾 `CONFLICT`；授权未公开 `SOURCE_UNAVAILABLE`／`POLICY_UNCONFIRMED`；组织人事法务。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "R018 正式人事法律文书与合同对应",
          "requirement": "**R018** 正式人事法律文书与合同对应；L4；SRC-002/007/009/010；F009/F032–F034/F046；M003/M015；T=适用路径实际要求正式解除/终止/调出等文书且 L4 已发生；F=通知或法定终止路径并无法定“校长批准书”要求 `NOT_APPLICABLE`；U=文书类型/形式要求未核；文号、主体、同一合同、签发日期、有效版与真实有权机关核对；“拟解除”不能冒充正式文书；仅有人事登记不必然推翻依法发生的法律效果；正式文书事实 `PASS_FACT`；L4 应有但找不到原机关记录 `SOURCE_UNAVAILABLE`；两份相抵 `CONFLICT`；性质争议 `NEEDS_HUMAN_DECISION`；人事/真实签发机关。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "R019 正式决定送达链",
          "requirement": "**R019** 正式决定送达链；L4；SRC-009/010；F032/F035；M015/M016；T=特定法律/程序要求正式决定送达且决定已形成；F=未形成决定或对应路径无需此类送达 `NOT_APPLICABLE`；U=是否要求/送达对象不明；对同文号的收件人、送达方式与签收时间核；不得拿本人辞职通知 M006 代 M016；时点按真实回执非系统建案时刻；同文到达可核 `PASS_FACT`；收件不一致 `CONFLICT`；证明当前已应有但缺 `NEEDS_MATERIAL`；程序效果 `NEEDS_HUMAN_DECISION`；文书送达部门。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "R020 法律效果时点与交接时点分离",
          "requirement": "**R020** 法律效果时点与交接时点分离；L4→L6；SRC-009 第19条、SRC-010 第44–50条；F024/F025/F031–F035/F038–F043；M003/M006/M012/M013/M015/M016；T=要确认法律关系是否/何时解除终止；F=只核 L1 受理或 L5 单项交接不要求认定生效 `NOT_APPLICABLE`；U=法律关系适用/有效生效基础不明；并列保存通知到达、合意、届满/继续履行、正式文书与交接时点；日期事实先由对应前置 R 核，F034 仅由有权人员确认；**交接未完绝不反向重设法律关系**；不能复制 F025；未有可信法律效果记录时 `NEEDS_HUMAN_DECISION`，有权记录产生后只核其**存在与版本**为 `PASS_FACT`，不由 AI 独立宣告解除；矛盾 `CONFLICT`；人事/法务/签约主体。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "R021 撤回、补件与变更请求本身",
          "requirement": "**R021** 撤回、补件与变更请求本身；L3/L7；SRC-009/010/014；F022–F024/F036/F044；M005/M006/M017；T=有真实撤回/补件/更正请求；F=从未提出 `NOT_APPLICABLE`；U=实际发出/到达不知；记录提出人授权、请求目标、到达时点和旧通知/决定版本；请求是否被接受、能否改变已生效关系不能由文本内容推断；重提需新事件 ID；请求收悉可 `PASS_FACT`；版本错配 `CONFLICT`；签章不可读 `UNREADABLE`；撤回法律效果 `NEEDS_HUMAN_DECISION`；原受理人及有权主体。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "R022 岗位/资料接收事实",
          "requirement": "**R022** 岗位/资料接收事实；L5；SRC-007（归档线索）/016；F006/F038/F046；M018；T=真实离岗安排产生工作交接任务；F=尚在 L1 或相关部门确认无该任务 `NOT_APPLICABLE`；U=学校是否将此项列为必办未知；每项接收人、岗位对象、文件版本及签收时点核；SRC-007 只证明归档类型而非全员交接义务；既有任务不得由本人自报“办结”；有权接收 `PASS_FACT`；已确认任务缺签收 `NEEDS_MATERIAL`；统一必需性未知 `POLICY_UNCONFIRMED`；所在单位接收人。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "R023 资产与涉密载体归还事实",
          "requirement": "**R023** 资产与涉密载体归还事实；L5；SRC-003（历史）/016；F016/F039；M004/M019；T=确有设备/涉密载体交接任务；F=专责部门确认无此资产/任务 `NOT_APPLICABLE`；U=责任台账不可取；核资产编号、责任者、专责接收人及完成时点；只保留脱敏“完成/待办”回执，不写涉密清单到公共案卷；欠交不是 AI认定违法或自动限制离职；回执核真 `PASS_FACT`；有任务而无回执 `NEEDS_MATERIAL`；来源不可用 `SOURCE_UNAVAILABLE`；资产/保密部门。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "R024 图书馆清还事实",
          "requirement": "**R024** 图书馆清还事实；L5；SRC-008；F001/F040；M001/M020；T=本人进入图书馆教职工离校办理且有借阅核清任务；F=尚未进入此环节或图书馆确认为不适用 `NOT_APPLICABLE`；U=借阅账户不可查；对图书馆本人账户、借书归还/赔偿状态和经办回执时间核；SRC-008 校本可核；未清只形成图书待办，不影响 R020 法律效果；图书馆可信记录如实表明“已清/未清”均为对应**借阅状态事实** `PASS_FACT`，未清另外发 `workItem`；仅证据本身缺失才 `NEEDS_MATERIAL`；来源失联 `SOURCE_UNAVAILABLE`；图书馆。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "R025 账号与权限回收事实",
          "requirement": "**R025** 账号与权限回收事实；L5；SRC-016；F001/F041；M001/M021；T=真实系统责任人确认存在应撤回的权限；F=无账号或未到 L5 `NOT_APPLICABLE`；U=学校账户回收清单/时点未核；对人/账户/角色、撤销日志及管理员核真；SRC-016 约束安全与最小化**不证明学校所有系统均为离校必办**；回收记录 `PASS_FACT`；真实任务缺回执 `NEEDS_MATERIAL`；全员必需性 `POLICY_UNCONFIRMED`；信息化/账号管理人。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "R026 档案/社保等关系转移事实",
          "requirement": "**R026** 档案/社保等关系转移事实；L6；SRC-007/010 第50条；F034/F042；M015（若实际有）/M022；T=法律关系类型及后续阶段确认需移转；F=未到 L6 或不适用该关系类型 `NOT_APPLICABLE`；U=接收主体或责任归口不清；核真实受理/出具证明/移转回执、接收机构和时间；《劳动合同法》第50条仅在适用劳动关系情形作法定节点线索，不能无差别套事业编；转移事实 `PASS_FACT`；已应办理而缺核真记录 `NEEDS_MATERIAL`/`SOURCE_UNAVAILABLE`；期限/责任争议 `NEEDS_HUMAN_DECISION`；人事档案/社保归口。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "R027 经济与服务期结算事实存在性",
          "requirement": "**R027** 经济与服务期结算事实存在性；L6；SRC-003（历史）/010/015；F015/F043；M004/M023；T=确有薪资/服务期/科研/保险专责结算事项；F=专责确认无该事项 `NOT_APPLICABLE`；U=专项条款或结算来源不明；只核是否已有真实结算决定/待办状态与经办主体、版本；不由 AI 计算赔偿额、扣款合法性；不让未结算自动阻却 R020；结算状态证实 `PASS_FACT`；经办不可取 `SOURCE_UNAVAILABLE`；款项/争议 `NEEDS_HUMAN_DECISION`；财务/专项管理及争议机关。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "R028 复核、申诉、仲裁/裁判及纠正事实",
          "requirement": "**R028** 复核、申诉、仲裁/裁判及纠正事实；L7；SRC-002/009/010/014；F029/F036–F037；M015/M017/M024；T=有人依法提出或机关已进入救济程序；F=没有救济事件 `NOT_APPLICABLE`；U=受理/生效状态未核；核受理机关、案件文号、类型、日期、权限、纠正/维持版本；事业单位法定申诉与劳动争议不统一设限；申请不等于自动停执行，纠正须另记新事件；受理/结果状态真实 `PASS_FACT`；同号文书相抵 `CONFLICT`；效果/时效 `NEEDS_HUMAN_DECISION`；有权复核/争议机关。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "R029 同人同合同同事件的归属、旧版结论失效",
          "requirement": "**R029** 同人同合同同事件的归属、旧版结论失效；任意证据更新；SRC-002/016；F001/F009/F018/F044–F046；M001–M030（实际变动者）；T=任一实际使用的材料、权威记录或政策版本变更；F=源版本一致且无变更 `NOT_APPLICABLE`；U=新旧归属无法核；针对离职特有的 `person_key+contract_ref+event_id` 核源主体、签署/生效时点及依赖 R；G50 仅供原件可读/哈希，不重复判定法律事件；旧审查标失效、新审查不覆盖历史；归属/版本可核 `PASS_FACT`；不同人合同混入 `CONFLICT`；权威旧源不可找 `SOURCE_UNAVAILABLE`；由人事/案卷 Owner 定向重审。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "R030 正式处分立案期间状态",
          "requirement": "**R030** 正式处分立案期间状态；L1/L2/L4（E2）；SRC-018 第 24–26 条；F004/F019/F029/F047；M001/M010（如有）/M028；T=权威证据显示适用事业单位工作人员的正式处分立案已发生且与拟解除时期交叠；F=权威证明确无此状态 `NOT_APPLICABLE`；U=只有举报/传言/状态不可查；核真实立案批准机关、对象、时间、是否结案；2023 第 26 条“立案调查期间不得解除聘用合同”是**重要法律风险提示**，但案件主体、法律层次和与第 17 条等关系需要人事法务解释；拒绝从举报截图自动设禁办；立案状态本身核真 `PASS_FACT`；正式来源失联 `SOURCE_UNAVAILABLE`；时点/对象冲突 `CONFLICT`；能否解除及法律效力 `NEEDS_HUMAN_DECISION`；处分机关→人事法务。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "R031 单方劳动解除的工会通知事实",
          "requirement": "**R031** 单方劳动解除的工会通知事实；L2–L4（D2 劳动关系）；SRC-010 第 43 条；F005/F019/F026/F048；M003/M008/M029；T=已证实劳动关系、真实雇主单方解除且进入通知程序；F=本人主动通知/双方合意/并非劳动合同关系 `NOT_APPLICABLE`；U=工会程序适用或真实收件主体不可核；核工会通知收件及事由同一，发送时间应与单方处理的程序节点匹配；不能用人事处内部审批截图代工会收讫，合法后果由人工审查；工会已实际收到的事实 `PASS_FACT`；依法应有且缺件 `NEEDS_MATERIAL`；对方机构失联 `SOURCE_UNAVAILABLE`；程序合法性 `NEEDS_HUMAN_DECISION`；真实雇主/工会/法务。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "R032 劳动合同解除/终止证明出具事实",
          "requirement": "**R032** 劳动合同解除/终止证明出具事实；L4/L6（适用劳动关系）；SRC-010 第 50 条；F005/F034/F042/F049；M003/M030；T=可信依据显示劳动合同关系已解除/终止而进入出证节点；F=尚处 L1–L3 或该法律关系不适用 `NOT_APPLICABLE`；U=法律效果或雇主未确认；核证明的出具机关、相对人、劳动合同编号、出具时间与法律效果记录是否吻合；不能拿辞职信、离校章或工作交接单冒充出证；权威已出证 `PASS_FACT`；真正到期却未见凭据 `NEEDS_MATERIAL`/雇主系统失联 `SOURCE_UNAVAILABLE`；证明效力争议 `NEEDS_HUMAN_DECISION`；用人单位人事经办。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "L0",
      "name": "合同与身份定位",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L1",
      "workflowOwner": "local"
    },
    {
      "id": "L1",
      "name": "发起和通知",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L2",
      "workflowOwner": "local"
    },
    {
      "id": "L2",
      "name": "审前事实核对",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L3",
      "workflowOwner": "local"
    },
    {
      "id": "L3",
      "name": "补件、陈述、异议",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L4",
      "workflowOwner": "local"
    },
    {
      "id": "L4",
      "name": "法律效果与有权文书",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L5",
      "workflowOwner": "local"
    },
    {
      "id": "L5",
      "name": "工作与公共资产交接",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L6",
      "workflowOwner": "local"
    },
    {
      "id": "L6",
      "name": "档案、保险与财务后续",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L7",
      "workflowOwner": "local"
    },
    {
      "id": "L7",
      "name": "复核、争议、纠正",
      "kind": "handoff",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "fact-review-report",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-list",
      "kind": "supplement-list",
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
  "templateId": "T02-T12",
  "name": "离职、辞职、解聘与离岗手续审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T02-T12.md",
  "sourceDocumentBytes": 141833,
  "sourceDocumentSha256": "ab77ca2d0f1ff691da09baecacc53c0acebdea30cd7574a09658de288296b5d3",
  "sourceIntegrityVerifiedAgainstManifest": true,
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23（当前可访问的最新正式 MD）",
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceSummary": "国家法律依据可核；学校辞聘流程正文、合同关系分类、2019/2025 校本制度现行性与实际授权仍需确认。",
  "workflowOwner": "local",
  "fields": [
    {
      "fieldId": "F001",
      "key": "person_key",
      "label": "人员·学校主键"
    },
    {
      "fieldId": "F002",
      "key": "legal_name",
      "label": "人员·法定姓名"
    },
    {
      "fieldId": "F003",
      "key": "identity_verified",
      "label": "人员·身份核验状态"
    },
    {
      "fieldId": "F004",
      "key": "relationship_class",
      "label": "人员·法律关系/人员类别"
    },
    {
      "fieldId": "F005",
      "key": "employer_entity_id",
      "label": "用工关系·签约雇主"
    },
    {
      "fieldId": "F006",
      "key": "work_unit_id",
      "label": "用工关系·在岗单位"
    },
    {
      "fieldId": "F007",
      "key": "work_location",
      "label": "用工关系·工作校区/地点"
    },
    {
      "fieldId": "F008",
      "key": "status_at",
      "label": "用工关系·在职状态和取数时点"
    },
    {
      "fieldId": "F009",
      "key": "contract_ref",
      "label": "合同·合同关联号"
    },
    {
      "fieldId": "F010",
      "key": "contract_kind",
      "label": "合同·法律性质"
    },
    {
      "fieldId": "F011",
      "key": "contract_version",
      "label": "合同·有效版本与签署状态"
    },
    {
      "fieldId": "F012",
      "key": "contract_start",
      "label": "合同·起始日"
    },
    {
      "fieldId": "F013",
      "key": "contract_end",
      "label": "合同·届满日/终止条件 contract_end:date"
    },
    {
      "fieldId": "F014",
      "key": "probation_range",
      "label": "合同·试用期边界"
    },
    {
      "fieldId": "F015",
      "key": "service_terms",
      "label": "附属义务·服务期/违约约定引用"
    },
    {
      "fieldId": "F016",
      "key": "special_duties",
      "label": "附属义务·保密/重大项目义务"
    },
    {
      "fieldId": "F017",
      "key": "contract_signer_authority",
      "label": "合同·签约授权引用"
    },
    {
      "fieldId": "F018",
      "key": "event_id",
      "label": "审核案卷·本次事件唯一键"
    },
    {
      "fieldId": "F019",
      "key": "scenario_code",
      "label": "审核案卷·办理情形"
    },
    {
      "fieldId": "F020",
      "key": "initiator_id",
      "label": "发起事件·申报或单位发起者"
    },
    {
      "fieldId": "F021",
      "key": "actor_auth_ref",
      "label": "发起事件·实际 Actor 权限证据"
    },
    {
      "fieldId": "F022",
      "key": "notice_ref",
      "label": "发起事件·通知/意向正文版本"
    },
    {
      "fieldId": "F023",
      "key": "notice_signed_at",
      "label": "发起事件·通知署期/提交时点"
    },
    {
      "fieldId": "F024",
      "key": "notice_received_at",
      "label": "送达事件·通知实际到达时点"
    },
    {
      "fieldId": "F025",
      "key": "proposed_end_at",
      "label": "发起事件·拟离岗/拟解除日期"
    },
    {
      "fieldId": "F026",
      "key": "reason_refs",
      "label": "发起事件·事项理由与依据"
    },
    {
      "fieldId": "F027",
      "key": "unit_opinion_ref",
      "label": "组织意见·单位事实/拟处理意见"
    },
    {
      "fieldId": "F028",
      "key": "upstream_decision_ref",
      "label": "前置决定·考核/处分/项目结论键"
    },
    {
      "fieldId": "F029",
      "key": "upstream_status",
      "label": "前置决定·生效/复核状态"
    },
    {
      "fieldId": "F030",
      "key": "protected_fact_ref",
      "label": "解除限制·保护事实核验"
    },
    {
      "fieldId": "F031",
      "key": "agreement_signatures",
      "label": "双方合意·协议签章状态"
    },
    {
      "fieldId": "F032",
      "key": "decision_ref",
      "label": "有权决定·正式文书引用"
    },
    {
      "fieldId": "F033",
      "key": "decision_signer",
      "label": "有权决定·签发主体与权限"
    },
    {
      "fieldId": "F034",
      "key": "legal_effect_at",
      "label": "法律效果·确认的生效时点"
    },
    {
      "fieldId": "F035",
      "key": "decision_receipt_ref",
      "label": "送达事件·决定送达/签收"
    },
    {
      "fieldId": "F036",
      "key": "withdrawal_ref",
      "label": "撤回/变更·提出及到达时间"
    },
    {
      "fieldId": "F037",
      "key": "dispute_ref",
      "label": "复核争议·案件与有效结果"
    },
    {
      "fieldId": "F038",
      "key": "work_handoff",
      "label": "交接·工作资料任务"
    },
    {
      "fieldId": "F039",
      "key": "asset_handoff",
      "label": "交接·资产及涉密载体"
    },
    {
      "fieldId": "F040",
      "key": "library_clearance",
      "label": "交接·图书借阅清还"
    },
    {
      "fieldId": "F041",
      "key": "access_revocation",
      "label": "交接·信息账户回收"
    },
    {
      "fieldId": "F042",
      "key": "transfer_status",
      "label": "后续转移·档案/社保去向"
    },
    {
      "fieldId": "F043",
      "key": "settlement_status",
      "label": "后续结算·是否存在未结事项"
    },
    {
      "fieldId": "F044",
      "key": "evidence_version",
      "label": "证据版本·源版本/摘要指纹"
    },
    {
      "fieldId": "F045",
      "key": "policy_basis",
      "label": "适用依据·政策版本和核实状态"
    },
    {
      "fieldId": "F046",
      "key": "evidence_link",
      "label": "证据关联·跨材料同一主体/事件键"
    },
    {
      "fieldId": "F047",
      "key": "disciplinary_case_state",
      "label": "处分程序·正式立案/结案与期间"
    },
    {
      "fieldId": "F048",
      "key": "union_notice_ref",
      "label": "劳动合同单方解除·工会通知与反馈"
    },
    {
      "fieldId": "F049",
      "key": "termination_certificate_ref",
      "label": "劳动合同终止/解除证明"
    }
  ],
  "materialSlots": [
    {
      "materialId": "M001",
      "slotId": "M001",
      "name": "在职身份及人员归属"
    },
    {
      "materialId": "M002",
      "slotId": "M002",
      "name": "真实本人/代理递交身份"
    },
    {
      "materialId": "M003",
      "slotId": "M003",
      "name": "当前签约关系与期限"
    },
    {
      "materialId": "M004",
      "slotId": "M004",
      "name": "服务期、专项/保密约定与变更"
    },
    {
      "materialId": "M005",
      "slotId": "M005",
      "name": "本人辞聘/辞职的实际意思表示"
    },
    {
      "materialId": "M006",
      "slotId": "M006",
      "name": "书面通知何时送达用人单位"
    },
    {
      "materialId": "M007",
      "slotId": "M007",
      "name": "代理、发起、合同/决定签署的授权"
    },
    {
      "materialId": "M008",
      "slotId": "M008",
      "name": "单位发起解除的事实与意见"
    },
    {
      "materialId": "M009",
      "slotId": "M009",
      "name": "考核结果的权威前置事实"
    },
    {
      "materialId": "M010",
      "slotId": "M010",
      "name": "处分决定而非线索"
    },
    {
      "materialId": "M011",
      "slotId": "M011",
      "name": "单位解除禁限或特别保护事实"
    },
    {
      "materialId": "M012",
      "slotId": "M012",
      "name": "双方协商解除意向及有效合意"
    },
    {
      "materialId": "M013",
      "slotId": "M013",
      "name": "合同届期、续签/实际履行事实"
    },
    {
      "materialId": "M014",
      "slotId": "M014",
      "name": "单位拟解聘/通知草案或事项启动记录"
    },
    {
      "materialId": "M015",
      "slotId": "M015",
      "name": "正式解除/终止/调出等有权文书"
    },
    {
      "materialId": "M016",
      "slotId": "M016",
      "name": "正式决定告知/送达"
    },
    {
      "materialId": "M017",
      "slotId": "M017",
      "name": "撤回、补件、陈述、材料更正请求"
    },
    {
      "materialId": "M018",
      "slotId": "M018",
      "name": "岗位职责、文件与工作交接"
    },
    {
      "materialId": "M019",
      "slotId": "M019",
      "name": "固定资产、涉密载体及项目资料移交"
    },
    {
      "materialId": "M020",
      "slotId": "M020",
      "name": "图书馆借阅清还/遗失处理"
    },
    {
      "materialId": "M021",
      "slotId": "M021",
      "name": "账号、门禁及系统权限回收"
    },
    {
      "materialId": "M022",
      "slotId": "M022",
      "name": "人事档案、社保/关系转移结果"
    },
    {
      "materialId": "M023",
      "slotId": "M023",
      "name": "薪资、保险、服务期、科研款项等结算结论"
    },
    {
      "materialId": "M024",
      "slotId": "M024",
      "name": "申诉/复核/仲裁/裁判与纠正决定"
    },
    {
      "materialId": "M025",
      "slotId": "M025",
      "name": "专项人才、博士后或重大项目的真实管理结论"
    },
    {
      "materialId": "M026",
      "slotId": "M026",
      "name": "是否属于校方法定用人主体"
    },
    {
      "materialId": "M027",
      "slotId": "M027",
      "name": "当事人对单位提出事项的书面意见、申辩与送达"
    },
    {
      "materialId": "M028",
      "slotId": "M028",
      "name": "正式处分立案与结案/撤案最小状态证明"
    },
    {
      "materialId": "M029",
      "slotId": "M029",
      "name": "劳动合同单方解除的工会通知/意见回执"
    },
    {
      "materialId": "M030",
      "slotId": "M030",
      "name": "解除/终止劳动合同证明"
    }
  ],
  "sources": [
    {
      "srcId": "SRC-001",
      "evidenceStatus": "partial",
      "url": "https://rsc.cdut.edu.cn/"
    },
    {
      "srcId": "SRC-017",
      "evidenceStatus": "partial",
      "url": "https://cece.cdut.edu.cn/info/1034/9641.htm；https://cmcc.cdut.edu.cn/info/1037/8353.htm；制度公开入口"
    },
    {
      "srcId": "SRC-002",
      "evidenceStatus": "verified",
      "url": "https://www.cdut.edu.cn/info/1366/7658.htm"
    },
    {
      "srcId": "SRC-003",
      "evidenceStatus": "partial",
      "url": "https://dbxb.cdut.edu.cn/__local/4/BD/90/5049914910F93D81AD1B1430944_86A4D64A_BCE90.pdf"
    },
    {
      "srcId": "SRC-004",
      "evidenceStatus": "verified",
      "url": "https://dbxb.cdut.edu.cn/info/1042/4846.htm"
    },
    {
      "srcId": "SRC-005",
      "evidenceStatus": "verified",
      "url": "https://dbxb.cdut.edu.cn/__local/B/BF/E4/315B94D635E02CC906C2BAA2CE3_B16889BD_11F7D.pdf"
    },
    {
      "srcId": "SRC-006",
      "evidenceStatus": "verified",
      "url": "https://cece.cdut.edu.cn/info/1034/9643.htm"
    },
    {
      "srcId": "SRC-007",
      "evidenceStatus": "verified",
      "url": "https://dag.cdut.edu.cn/info/1081/1286.htm"
    },
    {
      "srcId": "SRC-008",
      "evidenceStatus": "verified",
      "url": "https://lib.cdut.edu.cn/lxzl/jzglx.htm"
    },
    {
      "srcId": "SRC-009",
      "evidenceStatus": "verified",
      "url": "https://xzfg.moj.gov.cn/front/law/detail?LawID=414"
    },
    {
      "srcId": "SRC-010",
      "evidenceStatus": "verified",
      "url": "https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_0abfdd261c03417b949df19d869add8d.html"
    },
    {
      "srcId": "SRC-011",
      "evidenceStatus": "verified",
      "url": "https://www.scjyfb.net/p/8/?StId=st_app_news_i_x639033808594855168"
    },
    {
      "srcId": "SRC-012",
      "evidenceStatus": "verified",
      "url": "https://lgzc.cdut.edu.cn/info/1102/1808.htm"
    },
    {
      "srcId": "SRC-013",
      "evidenceStatus": "unconfirmed",
      "url": "https://rsc.xhu.edu.cn/_t366/4d/4b/c2806a85323/page.htm"
    },
    {
      "srcId": "SRC-014",
      "evidenceStatus": "verified",
      "url": "https://dghrss.dg.gov.cn/zcfg/qt/content/post_220164.html"
    },
    {
      "srcId": "SRC-015",
      "evidenceStatus": "partial",
      "url": "https://upload.weiqingxuezhe.com/uploads/admin/20250107/%E6%88%90%E7%90%86%E6%A0%A1%E4%BA%BA%E3%80%942022%E3%80%9527%E5%8F%B7_%E5%85%B3%E4%BA%8E%E5%8D%B0%E5%8F%91%E3%80%8A%E6%88%90%E9%83%BD%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E7%8F%A0%E5%B3%B0%E5%BC%95%E6%89%8D%E8%AE%A1%E5%88%92%E5%AE%9E%E6%96%BD%E5%8A%9E%E6%B3%95%E3%80%8B%E7%9A%84%E9%80%9A%E7%9F%A5.pdf"
    },
    {
      "srcId": "SRC-016",
      "evidenceStatus": "verified",
      "url": "https://www.miit.gov.cn/zwgk/zcwj/flfg/art/2022/art_04a0f1fb5df244e39688fd5372623a8d.html"
    },
    {
      "srcId": "SRC-018",
      "evidenceStatus": "verified",
      "url": "https://zsgx.mohrss.gov.cn/zsgx/htmlDocument/2024-01-10/detail_49961.html"
    },
    {
      "srcId": "SRC-019",
      "evidenceStatus": "verified",
      "url": "https://www.mohrss.gov.cn/rydwrsgls/SYDWRSGLSzhengcewenjian/201407/t20140707_133453.html；https://www.mohrss.gov.cn/xxgk2020/fdzdgknr/rcrs_4225/sydwrsgl/201901/t20190128_309877.html"
    },
    {
      "srcId": "SRC-020",
      "evidenceStatus": "verified",
      "url": "https://www.moe.gov.cn/s78/A15/s8355/moe_782/tnull_39857.html"
    },
    {
      "srcId": "SRC-021",
      "evidenceStatus": "verified",
      "url": "https://chinajob.mohrss.gov.cn/h5/c/2023-03-01/370681.shtml"
    }
  ],
  "criteria": [
    {
      "sectionId": "fact-review",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-009"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-003",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-009"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-003",
        "SRC-015"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-009"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-009"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-009"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-016"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R026",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R027",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R028",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R029",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R030",
      "srcIds": [
        "SRC-018"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R031",
      "srcIds": [
        "SRC-010"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R032",
      "srcIds": [
        "SRC-010"
      ],
      "evidenceStatus": "verified"
    }
  ],
  "safetyConstraints": {
    "autoPassEnabled": false,
    "policyVersionIds": [],
    "finalDecision": "manual-authorized-person-only",
    "sourceIndexIdsAreNotCaseSourceRefs": true,
    "unknownPolicyEffect": "needs-confirmation"
  }
} as const
