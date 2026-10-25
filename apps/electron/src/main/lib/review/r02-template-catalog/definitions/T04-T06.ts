import type { TemplateVersion } from '@profer/shared'

/** Generated from the reviewed R02 research source; this is not a school-issued template. */
export const template: TemplateVersion = {
  "templateId": "T04-T06",
  "version": 1,
  "schemaVersion": 2,
  "name": "国有资产报废、处置及损失核验审核",
  "description": "本地研究模板 · 非校方正式模板。用于材料事实核验、风险提示和人工复核；不构成学校正式表单、制度或批准决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；政策适用、审批权限和最终决定必须由有权人员核验，不创建政策版本。",
  "objectType": "transaction",
  "displayName": {
    "template": "{{caseTitle}}"
  },
  "fields": [
    {
      "key": "case_id",
      "label": "case_id / UUID",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F001；F001 | case_id / UUID | Case；L0 创建 | V3 Main/Case 原始记录，非审批证据 | 案卷元数据 | P1 | 未创建不可作跨案引用"
    },
    {
      "key": "application_batch_id",
      "label": "application_batch_id / 字符串",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F002；F002 | application_batch_id / 字符串 | Batch；L0–L6 | 单位申请编号/受信内部登记 | M001/M003、系统批次键 | P1 | 未正式受理可用暂存 ID，不假冒省级批次号"
    },
    {
      "key": "current_stage",
      "label": "current_stage / 枚举 L0–L6",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F003；F003 | current_stage / 枚举 L0–L6 | Case/Batch；全程 | 已发生的原节点证据，非 Renderer 状态 | M001/M022–M029 的时间链 | P1 | 未知不得提前索要后续材料"
    },
    {
      "key": "applicant_unit_id",
      "label": "applicant_unit_id / 组织标识",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F004；F004 | applicant_unit_id / 组织标识 | ApplicantUnit；L0/L1 | 校方组织目录与正式单位申请〔SRC-001〕 | M001/M004 | P1 | 单位不明则不能判断申报资格"
    },
    {
      "key": "submitter_person_id",
      "label": "submitter_person_id / 受信身份引用",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F005；F005 | submitter_person_id / 受信身份引用 | Actor；L0/L1 | Host/Main 认证账号或单位委托证据〔SRC-001〕 | M001/M004、认证回执 | P2 | 不能用姓名/OCR 自称审批人"
    },
    {
      "key": "delegated_authority",
      "label": "delegated_authority / 结构化引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F006；F006 | delegated_authority / 结构化引用 | Authorization；L1 | 校内真实岗位授权/委托原件，流程待核〔SRC-004〕 | M004、授权有效期/范围 | P2 | 未授权仍可报告事实，不算正式代办"
    },
    {
      "key": "proposed_disposal_method",
      "label": "proposed_disposal_method / 枚举",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F007；F007 | proposed_disposal_method / 枚举 | Batch；L1 | 申请文件与分类规定〔SRC-001/007/008〕 | M001/M003 | P1 | 报废/转让/置换/损失核销混写则 CONFLICT"
    },
    {
      "key": "disposal_reason",
      "label": "disposal_reason / 文本与原因码",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F008；F008 | disposal_reason / 文本与原因码 | Batch/Item；L0/L1 | 使用单位报告、盘点及鉴定〔SRC-001/008〕 | M001/M007/M008 | P1 | 无事实依据则待单位说明，不能 AI 编造"
    },
    {
      "key": "asset_list_revision",
      "label": "asset_list_revision / 文档 ID+版本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F009；F009 | asset_list_revision / 文档 ID+版本 | Batch；L1–L6 | 校资产卡导出/单位盖章清单〔SRC-008〕 | M003 页/行、版本/哈希 | P1 | 换清单必须使旧匹配结论失效"
    },
    {
      "key": "official_asset_card_id",
      "label": "official_asset_card_id / 字符串",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F010；F010 | official_asset_card_id / 字符串 | AssetItem；L0 | 校方资产管理系统或认证导出〔SRC-001/007〕 | M002 行号/资产标签 | P1 | 无卡片不自动判资产不存在，人工核账外问题"
    },
    {
      "key": "asset_category",
      "label": "asset_category / 代码",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F011；F011 | asset_category / 代码 | AssetItem；L0/L2 | 校资产类别/权属记录〔SRC-001/007〕 | M002/M005/M012–M014 | P1 | 未知则不自动选择审批路径"
    },
    {
      "key": "asset_name_model",
      "label": "asset_name_model / 文本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F012；F012 | asset_name_model / 文本 | AssetItem；L0 | 资产卡、实物序列或鉴定〔SRC-001〕 | M002/M007 具体行/照片 | P1 | 型号冲突需现场确认"
    },
    {
      "key": "acquisition_source_limits",
      "label": "acquisition_source_limits / 结构化文本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F013；F013 | acquisition_source_limits / 结构化文本 | AssetItem；L1/L2 | 合同/财政拨款/捐赠及项目限制〔SRC-001〕 | M006、T04-T04 权威引用 | P2 | 来源未知不得忽略合同或捐赠限制"
    },
    {
      "key": "title_and_ownership",
      "label": "title_and_ownership / 证据引用+状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F014；F014 | title_and_ownership / 证据引用+状态 | AssetItem；L1/L2 | 权属证、账卡、合法变更文书〔SRC-001 第 33 条、SRC-008 第 10 条〕 | M005/M012–M014/M030 | P2 | 争议或诉讼须挂起处置，不代判权属"
    },
    {
      "key": "original_asset_value",
      "label": "original_asset_value / 金额+币种",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F015；F015 | original_asset_value / 金额+币种 | AssetItem；L1/L2 | 有权资产卡/财务原始账〔SRC-007〕 | M002 行及记账日 | P2 | 与申请金额不一致须标冲突，不用估算补值"
    },
    {
      "key": "carrying_book_value",
      "label": "carrying_book_value / 金额",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F016；F016 | carrying_book_value / 金额 | AssetItem；L2 | 有权账务或折旧记录〔SRC-006〕 | M002/M028 | P2 | 与原值/评估值严禁混为一项"
    },
    {
      "key": "acquisition_or_use_start_date",
      "label": "acquisition_or_use_start_date / 日期",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F017；F017 | acquisition_or_use_start_date / 日期 | AssetItem；L1/L2 | 验收入账/资产卡〔SRC-001〕 | M002、T04-T04 引用 | P1 | 来源冲突按原始验收记录待复核"
    },
    {
      "key": "useful_life_basis",
      "label": "useful_life_basis / 期间+依据版本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F018；F018 | useful_life_basis / 期间+依据版本 | AssetItem；L2 | 学校当期资产分类寿命配置/资产卡〔SRC-001〕 | M002、待核配置文件 | P1 | 不用模型常识自动计算“已到期可报废”"
    },
    {
      "key": "responsible_custodian",
      "label": "responsible_custodian / 受信人员引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F019；F019 | responsible_custodian / 受信人员引用 | AssetItem；L0/L2 | 资产卡及有效调拨/交接〔SRC-001〕 | M002/M030、T04-T05 决定 | P2 | 保管人变化按有效版本，旧人签字不追认"
    },
    {
      "key": "physical_location_campus",
      "label": "physical_location_campus / 地址代码",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F020；F020 | physical_location_campus / 地址代码 | AssetItem；L0/L2 | 资产卡/盘点原始记录〔SRC-001〕 | M002/M007 | P1/P3 | 涉密位置仅授权可见；跨校区需核真实所在地"
    },
    {
      "key": "physical_condition",
      "label": "physical_condition / 枚举+观察",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F021；F021 | physical_condition / 枚举+观察 | AssetItem；L0/L2 | 有日期的现场核查/技术意见〔SRC-008〕 | M007/M008 | P1 | 使用人自述不等于技术无维修价值结论"
    },
    {
      "key": "incident_or_discovery_date",
      "label": "incident_or_discovery_date / 日期",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F022；F022 | incident_or_discovery_date / 日期 | Incident；L0 | 盘点表、报案/灾情证明〔SRC-008〕 | M007/M016/M018 | P2 | 不能按上传日冒充事件发生日"
    },
    {
      "key": "service_and_repair_history",
      "label": "service_and_repair_history / 引用列表",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F023；F023 | service_and_repair_history / 引用列表 | AssetItem；L0/L2 | 维修/维护档案及现场记录〔SRC-007 第 47 条〕 | M007 页/记录号 | P1 | 没有维修史不直接得出“不可维修”"
    },
    {
      "key": "technical_appraisal_opinion",
      "label": "technical_appraisal_opinion / 枚举+报告引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F024；F024 | technical_appraisal_opinion / 枚举+报告引用 | Appraisal；L2/L3 | 专家/技术部门/专业机构独立文书〔SRC-008 第 30 条〕 | M008 原报告页、签章 | P1/P2 | 仅申请书自填意见则 NEEDS_MATERIAL"
    },
    {
      "key": "appraisal_issuer_credential",
      "label": "appraisal_issuer_credential / 身份与签章引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F025；F025 | appraisal_issuer_credential / 身份与签章引用 | Appraisal；L2/L3 | 专家/机构合法职务或资质证明〔SRC-008〕 | M008 签发页/可验渠道 | P2 | 模型不能指定专家身份，未核则人审"
    },
    {
      "key": "valuation_report",
      "label": "valuation_report / 金额+报告引用",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F026；F026 | valuation_report / 金额+报告引用 | Valuation；L2/L3 | 独立评估机构报告〔SRC-001 第 41 条、SRC-008 第 39 条〕 | M010 报告、基准日/有效期 | P2 | 不以净值替代评估，评估必要性不明转人工"
    },
    {
      "key": "batch_original_value_total",
      "label": "batch_original_value_total / 金额",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F027；F027 | batch_original_value_total / 金额 | Batch；L2/L3 | 同一版本 M003 逐项 F015 汇总，校资产卡复核〔SRC-007〕 | M002/M003 全部行 | P2 | 同一设备重复/拆批则暂停，禁止用未核金额过阈"
    },
    {
      "key": "major_single_set_value",
      "label": "major_single_set_value / 金额",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F028；F028 | major_single_set_value / 金额 | AssetItem；L2/L3 | 资产卡单台/套原值及组成清单〔SRC-007〕 | M002/M003 关联台套行 | P2 | 台/套口径、门槛尚须原件和校本人工核"
    },
    {
      "key": "internal_unit_decision",
      "label": "internal_unit_decision / 文号+状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F029；F029 | internal_unit_decision / 文号+状态 | UnitDecision；L1/L3 | 校内有权会议或单位正式决议〔SRC-006 第 19 条〕 | M009 签章/会议纪要 | P1/P2 | 未作决策时不得把代办提交升级成通过"
    },
    {
      "key": "decision_signatory_role",
      "label": "decision_signatory_role / 受信权限引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F030；F030 | decision_signatory_role / 受信权限引用 | UnitDecision；L1/L4 | 组织岗位权限/签章验证〔SRC-001/002/003〕 | M009/M022/M023 签发信息 | P2 | 单纯姓名和 Renderer role 不可信"
    },
    {
      "key": "title_dispute_lien_litigation",
      "label": "title_dispute_lien_litigation / 多值状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F031；F031 | title_dispute_lien_litigation / 多值状态 | AssetItem；L2/L3 | 有权不动产/合同/司法信息〔SRC-008 第 10 条〕 | M005/M012/M030 | P2/P3 | 不明/担保/诉讼中时不得机械放行处置"
    },
    {
      "key": "police_or_incident_record",
      "label": "police_or_incident_record / 引用+状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F032；F032 | police_or_incident_record / 引用+状态 | Incident；L0–L3 | 公安立案/结案或事故文书〔SRC-008 第 34 条〕 | M016 | P3 | 尚未结案不要求伪造“结案证明”"
    },
    {
      "key": "insurance_compensation",
      "label": "insurance_compensation / 金额+状态",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F033；F033 | insurance_compensation / 金额+状态 | Loss；L2–L4 | 保险人理赔或拒赔说明〔SRC-008 第 34 条〕 | M017 | P2/P3 | 未投保则不适用；理赔未定记待后续"
    },
    {
      "key": "liability_disposition",
      "label": "liability_disposition / 有权文书引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F034；F034 | liability_disposition / 有权文书引用 | Loss；L2–L4 | 职能部门处理或有效司法文书〔SRC-007 第 75 条〕 | M019/M020 | P3 | 不由模型归责、免赔或自行推断金额"
    },
    {
      "key": "approval_route",
      "label": "approval_route / 机关级次+依据版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F035；F035 | approval_route / 机关级次+依据版本 | ApprovalRoute；L2/L3 | 有效法条、校内授权及上级机关确认〔SRC-001/007/008〕 | M009/M022/M023、政策快照 | P1 | 2024 转载原件未核时只能候选路由、人核"
    },
    {
      "key": "supervisory_review",
      "label": "supervisory_review / 文号+状态",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F036；F036 | supervisory_review / 文号+状态 | Approval；L3/L4 | 省级主管部门审核/专家核查/官方回执〔SRC-007〕 | M015/M022 | P1/P2 | 申请人扫描的“同意”字样不是权威审批"
    },
    {
      "key": "final_authority_decision",
      "label": "final_authority_decision / 决定 ID+版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F037；F037 | final_authority_decision / 决定 ID+版本 | Approval；L4 | 法定机关原始签批/可验批文〔SRC-006/007/008〕 | M023 文号、清单附件、印章/验签 | P2 | 尚无批复应 NEEDS_HUMAN_DECISION，非驳回或批准"
    },
    {
      "key": "approved_execution_method",
      "label": "approved_execution_method / 枚举",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F038；F038 | approved_execution_method / 枚举 | Execution；L5 | 已生效的批复及交易平台规则〔SRC-007 第 43–44 条〕 | M023/M024/M025 | P1/P2 | 与批准处置方式不同则冲突待核"
    },
    {
      "key": "transaction_result_amount",
      "label": "transaction_result_amount / 金额+状态",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F039；F039 | transaction_result_amount / 金额+状态 | Execution；L5 | 官方平台成交、拍卖/协议成交证明〔SRC-008 第 43 条〕 | M024 | P2 | 批复前不存在，不得模型估价变卖"
    },
    {
      "key": "physical_handover_disposal",
      "label": "physical_handover_disposal / 时间+回执",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F040；F040 | physical_handover_disposal / 时间+回执 | Execution；L5 | 省级公物仓/有权处置方/回收单位回执〔SRC-007/008〕 | M025 | P1/P2 | 未实施前为阶段未到；遗失或回收不明转人核"
    },
    {
      "key": "proceeds_remitted",
      "label": "proceeds_remitted / 金额+凭证",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F041；F041 | proceeds_remitted / 金额+凭证 | FinanceLink；L5/L6 | 财政非税入库或财务入账权威凭证〔SRC-006 第 25 条〕 | M026，G07 结果引用 | P2 | 不把交易收款等于已缴库"
    },
    {
      "key": "asset_card_derecognition",
      "label": "asset_card_derecognition / 记录 ID",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F042；F042 | asset_card_derecognition / 记录 ID | AssetLedger；L6 | 校资产管理系统有权操作日志〔SRC-006 第 35 条〕 | M027 | P2 | 不允许系统 AI 直接修改下账"
    },
    {
      "key": "accounting_entry",
      "label": "accounting_entry / 凭证 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F043；F043 | accounting_entry / 凭证 ID | FinanceLedger；L6 | 财务正式凭证〔SRC-006 第 35 条〕 | M028，G07 决定引用 | P2 | 缺接口以可验记账凭证替代，不能重复入账"
    },
    {
      "key": "security_and_hazard_type",
      "label": "security_and_hazard_type / 枚举+密级",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F044；F044 | security_and_hazard_type / 枚举+密级 | AssetItem；L0–L5 | 资产标签、保密/辐射/特种设备主管登记〔SRC-010〕 | M021/M007 | P3 | 不清楚是否涉密/危险时先限制处理、人工分流"
    },
    {
      "key": "adjacent_authoritative_decisions",
      "label": "adjacent_authoritative_decisions / 引用数组",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F045；F045 | adjacent_authoritative_decisions / 引用数组 | CrossTemplate；L0–L6 | T04-T04/T05、T03、G07 原有正式业务记录 | M030、原决定版本与状态 | P1/P2 | 失效或无法验证时不可用旧快照继续放行"
    },
    {
      "key": "withdrawal_review_request",
      "label": "withdrawal_review_request / 引用+状态",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F046；F046 | withdrawal_review_request / 引用+状态 | ProcedureEvent；L1–L6 | 原受理/审批部门回执及当事单位请求〔SRC-008 第 12 条〕 | M029 | P2 | 校本受理渠道和时限未知，默认人审，不自动撤批"
    },
    {
      "key": "evidence_revision_hash",
      "label": "evidence_revision_hash / 版本+摘要",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F047；F047 | evidence_revision_hash / 版本+摘要 | Evidence；全程 | 原文件/受信平台入库时生成，校验签章 | 所有 M 的 fileID、哈希、页码/关联行 | P1/P2 | 版本被替换则旧结论无当前效力，保留历史"
    },
    {
      "key": "source_availability_verification",
      "label": "source_availability_verification / 枚举+时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F048；F048 | source_availability_verification / 枚举+时间 | Evidence；全程 | 原链接、官方系统查询/验签日志 | 每个 M/SRC 的访问或核验记录 | P1 | UNREADABLE 与 SOURCE_UNAVAILABLE 分开；不可直接判“不存在”"
    },
    {
      "key": "deadline_attribution",
      "label": "deadline_attribution / 时间+依据",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F049；F049 | deadline_attribution / 时间+依据 | ProcedureEvent；L1–L6 | 有效校本当批通知、法定期限或受理回执 | M001/M022/M029，具体出处 | P1 | 无有效截止日期时保持未知，不设默认 7/15/30 日"
    },
    {
      "key": "controlling_decision_version",
      "label": "controlling_decision_version / 文号+快照",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F050；F050 | controlling_decision_version / 文号+快照 | DecisionLink；L3–L6 | 有权机关正式批准/复核/变更链 | M023/M029 版本图与关联资产 | P2 | 后续变更不得覆盖先前批文；冲突须人工核对"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 单位处置申请、方式和理由",
      "purpose": "资产使用单位；正式申请文件/受理系统记录；A：L1；L0 可先有报告草稿；经单位有权流程确认的电子申请；个人说明仅为线索；F002/F004/F007/F008/F049；SRC-001/008；绑定单位与批次版本；无单位申请不得声称正式受理；文件不可读=UNREADABLE",
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
        "单位处置申请、方式和理由",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "M002 资产账卡、原值、使用单位、保管人",
      "purpose": "校国资系统、财务/资产管理员；权威资产卡及历史流水；A：L0–L2；校方可验系统直接取值或受信导出件；F010–F020/F027/F028；SRC-001/006/007；必须逐资产行绑定；缺系统接口则“待权威核对”，不强制普通人上传；源失联=SOURCE_UNAVAILABLE",
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
        "资产账卡、原值、使用单位、保管人",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 本次处置资产清单",
      "purpose": "申报单位及校资产系统；资产 ID、方式、金额、批次明细；A：L1；L0 可临时清单；从 M002 选取生成的受信批次清单，单位确认；F002/F007/F009/F010/F027；SRC-008 第 30、34 条；每次修订形成新清单版本，旧匹配结论失效；缺项标 NEEDS_MATERIAL",
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
        "本次处置资产清单",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 代办与岗位授权",
      "purpose": "校内组织人事/单位有权负责人；认证授权或委托书；C：代办申报时 L1；受信的校方岗位权限、有效电子委托；F004–F006/F030；SRC-001/002/003，SRC-004 待核；核授权范围、有效期及目标批次；自填角色或截图不替代；不可读=UNREADABLE",
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
        "代办与岗位授权",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 资产权属与纠纷状态",
      "purpose": "产权主管单位、资产档案；证书/登记/法律文件；C：权属不明、转移、特殊类 L1/L2；原登记簿可验查询；不能仅凭采购发票代替产权登记；F011/F014/F031；SRC-001 第 33 条、SRC-008 第 10 条；逐资产验证且保留有效日；纠纷未清先停止自动下游流转",
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
        "资产权属与纠纷状态",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 资产取得来源与专项限制",
      "purpose": "财务、采购、捐赠/科研资助方；合同/捐赠协议/项目约束；C：资金或使用权有特殊限制 L1/L2；T04-T04 已生效入账事实和原合同权威引用；F013/F014/F045；SRC-001/006；绑定合同版本、资产 ID；材料无效/不明时转人工核来源",
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
        "资产取得来源与专项限制",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M007",
      "name": "M007 现状、盘点、报修和维护记录",
      "purpose": "使用单位、保管人、维修/盘点部门；现场记录、工单；C：损坏/盘亏/技术判断 L0/L2；常规报废有则取；有日期、责任人、资产标签的校方工单/现场核验；F020–F023/F032；SRC-001/007/008；照片须指向具体设备与拍摄时点；缺客观记录=待补，不能仅凭口述定报废",
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
        "现状、盘点、报修和维护记录",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 专家/技术鉴定",
      "purpose": "技术部门、专家组、专业机构；正式鉴定结论、签章、资质；C：提前报废、技术淘汰、按资产类要求 L2/L3；依法具备相同权限的机构报告；无维修价值须由有权技术人认定；F021/F024/F025；SRC-005（表单正文未核）、SRC-008 第 30 条；必须关联资产与本次批次；旧设备鉴定或普通维修意见未必等价；不可读退补",
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
        "专家/技术鉴定",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 单位内部集体决策",
      "purpose": "单位有权会议或学校集体决策机关；会议纪要/决议/签批；C：正式报批前按权限 L1/L3；校方审批系统可验正式决议，不能用代办签字替代；F029/F030/F035；SRC-001/006/007/008；有决策时间、有效签发人和同版清单；没有不得声称审批程序完成",
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
        "单位内部集体决策",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 资产评估报告",
      "purpose": "受托评估机构、归口部门；评估报告/资格/基准日；C：转让、置换等法定要求 L2/L3；法律明确可免评估的有权确认文件；模型估价不行；F026/F035；SRC-001 第 41/42 条、SRC-008 第 39/40 条；核评估对象、范围、有效期、签发；报告过期/资产清单变化重新人核",
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
        "资产评估报告",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 转让/置换/捐赠意向材料",
      "purpose": "申请单位、拟受让/置入方；意向协议或需求文件；C：特定处置方式 L1/L3；上位规则允许的双方盖章明细或正式需求文件；F007/F014/F031；SRC-008 第 18/22/26/38 条；意向性不等于已成交；多方文书签章和版本不符=CONFLICT",
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
        "转让/置换/捐赠意向材料",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 不动产权属及拆除专业文件",
      "purpose": "房产归口/登记机关、鉴定或规划主管机关；权证、危房鉴定、规划/立项文件；C：房地处置或拆除 L1–L3；权威登记查询和同等效力专业文书；不得用照片替危房鉴定；F011/F014/F031/F035；SRC-007 第 39/40 条、SRC-008 第 30 条；区分土地与建筑物、门牌和资产卡；不一致先权属核定",
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
        "不动产权属及拆除专业文件",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 车辆登记与评估证据",
      "purpose": "公务车管理归口、车辆登记机关；行驶证、登记证、专业鉴定；C：车辆处置 L1–L3；官方车辆登记查询/合规报告；F011/F014/F026/F035；SRC-007 第 39 条、SRC-008 第 30 条；车架号、牌照、资产卡三向匹配；缺失不按普通设备放行",
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
        "车辆登记与评估证据",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 无形资产和科技成果权属",
      "purpose": "科发院/知识产权登记或合同持有人；权利证明、许可与保护期限；C：软件、专利等无形资产处置 L1–L3；有效专利/著作权登记或有权科研成果处置决定引用；F011/F013/F014/F031/F045；SRC-001/006 第 23 条、SRC-007 第 45 条；专利/许可/成果权利分开，不能把合同技术成果与学校产权默认等同",
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
        "无形资产和科技成果权属",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M015",
      "name": "M015 省级贵重大批量仪器核查",
      "purpose": "省级主管部门专家组；现场核查报告与抽检记录；L：达到最终确认的适用条件后于 L3/L4 形成；省级主管部门原系统报告，不以校内普通设备照片替代；F027/F028/F036；SRC-007 第 41 条（原件待核）；受同一批次和单台套清单约束；没有到核查阶段不判初始缺件",
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
        "省级贵重大批量仪器核查",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M016",
      "name": "M016 盗抢及公安案件事实",
      "purpose": "公安或有权事故调查部门；报案/立案/结案证明；C：盗抢时 L0–L4；结案文件仅结案后；可验公安案件回执与结案文书；当事人自述只作线索；F022/F032；SRC-008 第 34 条；案件号、资产编号、时间匹配；未结案不能以不存在论",
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
        "盗抢及公安案件事实",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 保险理赔事实",
      "purpose": "保险人、财务部门；保险合同、理赔或拒赔说明；C/L：投保且涉及损失，依进展 L2–L4；保险人官方回执、有效理赔决定；F033/F034；SRC-008 第 34 条；未投保 NOT_APPLICABLE；理赔未结状态待后续，不能估算赔偿到账",
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
        "保险理赔事实",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "M018 灾害、意外事故及毁损证明",
      "purpose": "应急/相关主管部门、事故调查机关；受灾证明、事故调查报告；C：不可抗力/事故 L0–L3；有权部门同等证明或事故处理文件；F022/F032/F034；SRC-006/008 第 34 条；形成时间和资产批次关联；无证明先报告并待补，不自动定不可抗力",
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
        "灾害、意外事故及毁损证明",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "M019 责任认定/有权处理文件",
      "purpose": "学校/外部法定职能部门、法院；责任处理决定、裁判、结案等；C/L：非正常损失核销前，责任程序完成时；同等效力的有权处理/司法文书；模型结论不行；F034/F036；SRC-001 第 51 条、SRC-007 第 75 条、SRC-008 第 32/34 条；人员身份敏感 P3；未处理不得写“已无责任”，并与核销分开",
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
        "责任认定/有权处理文件",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "M020 赔偿、追偿或追回处理",
      "purpose": "财务、司法执行/有关职能部门；赔偿金缴纳或追偿结果；C/L：发生责任赔偿时 L3/L4 及后续；权威缴款/执行回执与处理决定；F033/F034/F041；SRC-007 第 75 条、SRC-008 第 34 条；未定金额/尚在履行不可填零冒充结案，缺源人审",
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
        "赔偿、追偿或追回处理",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "M021 涉密、放射性、特种设备专项文书",
      "purpose": "保密、辐射/环保、特设主管机关或有权机构；退役、送贮、检验、注销许可；C/L：专项处置对应法定节点 L2–L6；主管系统可验许可/鉴定，不用普通报废审批替代；F011/F044/F035；SRC-003/010、SRC-008 第 30/58 条；按密级保护全文，校方常规审查仅核许可存在与效力；未形成先暂停危险实体处置",
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
        "涉密、放射性、特种设备专项文书",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "M022 上级审核、备案与专家反馈",
      "purpose": "省级主管部门或有权机关；正式转报、审核意见、受理回执；L：校内正式报批后 L3/L4；原机关系统状态或盖章文书；F030/F035/F036/F049；SRC-007/008；不要求 L1 有省级反馈；与资产清单版本不符就人工核对",
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
        "上级审核、备案与专家反馈",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "M023 最终有权处置批准或不批准",
      "purpose": "法定审批机关；正式批复、附表、签章、决定版本；L：L4 决定形成后；原机关可验证电子公文/批复；不以截图或模型判词替代；F035–F038/F050；SRC-006 第 19 条、SRC-007/008；文号、机关权限、对象、方式、附件版本必须一致；未形成 NEEDS_HUMAN_DECISION",
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
        "最终有权处置批准或不批准",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "M024 处置平台交易/成交记录",
      "purpose": "省级处置平台、公物仓、交易机构；公告、竞价、成交/协议凭证；L：依法批准后 L5；合法平台受信交易记录；不得用未成交报价或 AI 估价；F038/F039；SRC-007 第 43/44 条、SRC-008 第 42/43 条；成交资产与 M023 批复明细逐项对应，缺平台结果仅后续待办",
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
        "处置平台交易/成交记录",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "M025 报废实物交割/回收/拆除",
      "purpose": "有权回收处置机构、执行单位；移交清单、处置回执；L：批准后实施 L5；有权平台电子交割或盖章处置记录；F038/F040；SRC-007 第 44 条、SRC-008 第 43 条；保留重量/数量/编号与批复对应；未实施绝不作为 L1 必需",
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
        "报废实物交割/回收/拆除",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "M026 处置收入/非税入库",
      "purpose": "财务/财政国库系统；收款、缴库/结算凭证；L：发生收入后 L5/L6；G07/财务权威结论引用或财政缴库回执；F039/F041；SRC-006 第 25/26 条、SRC-007 第 54 条；不以成交价证明已到账入库；无收入合法情形可 NOT_APPLICABLE",
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
        "处置收入/非税入库",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M027",
      "name": "M027 资产卡片变更及下账记录",
      "purpose": "校资产管理系统有权操作人；已批处置的资产卡下账日志；L：批准且实施后 L6；可验资产信息系统日志与版本快照；F010/F042/F047；SRC-006 第 35/39 条、SRC-008 第 13 条；下账必须关联批复/实施结果；不可由模型代写",
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
        "资产卡片变更及下账记录",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "M028 会计核销/凭证",
      "purpose": "学校财务处；记账/销账凭证及会计处理记录；L：批准且满足会计条件后 L6；G07 或财务权威系统只读记录；F016/F041/F043；SRC-006 第 35/39 条、SRC-007 第 52 条；账卡与财务账不一致=CONFLICT，不让模板调账",
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
        "会计核销/凭证",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "M029 补件、修改、撤回、终止或复核",
      "purpose": "原申请单位与受理/审批机关；变更说明、回执、复核决定；C/L：实际提出变更/救济时 L1–L6；原受理/原批准机关官方流程回执，具体校本渠道未知；F003/F046/F047/F050；SRC-008 第 12 条、SRC-004 待核；保留原批文、旧材料与新材料版本；没有回执不宣称撤回成功",
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
        "补件、修改、撤回、终止或复核",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M030",
      "name": "M030 相邻业务权威结论及历史来源",
      "purpose": "T04-T04 入账、T04-T05 调拨、T03 科技成果、G07 财务等业务 Owner；C：需这些事实时 L0–L6；原对象/决定 ID、签发主体、状态及有效版本的受信引用；F013/F014/F019/F045/F050；SRC-001/006 及 R02/G50 待核；引用失效/重审中则不能沿用旧 PASS_FACT；不把副本当主业务新决定",
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
        "相邻业务权威结论及历史来源",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "rules",
      "name": "原件第 08 节审核规则",
      "description": "源自 T04-T06 原件第 08 节规则表；研究来源与案卷材料分离，未确认政策只生成语义提示或人工待办。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "案卷、批次及资产行隔离",
          "requirement": "规则：R001 案卷、批次及资产行隔离；L0–L6；列2：T=同批资产待核；F=目标行不属于本案→NA；U=批次归属不明；列3：SRC-001/008；F001/F002/F009/F010/F047；M001/M002/M003；列4：原受信批次与清单行一一绑定，旧版本不得跨批次复用；L0 临时号不是正式受理号；列5：匹配 PASS_FACT；错案 CONFLICT；归属未知 NEEDS_HUMAN_DECISION → 单位资产管理员/国资归口",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r002",
          "title": "单位申请主体",
          "requirement": "规则：R002 单位申请主体；L1–L4；列2：T=单位正式申报；F=只有个人事实报告→NA（正式申请规则）；U=单位身份或有权签章不明；列3：SRC-001/002/003；F004/F005/F030；M001/M004；列4：核校方组织标识、签署人与申请单位、受信发起渠道及当期关系；学生/使用人不能凭姓名变为申请单位；列5：一致 PASS_FACT；冒名 CONFLICT；未有正式单位申请 NEEDS_MATERIAL → 资产使用单位负责人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "代办/岗位授权",
          "requirement": "规则：R003 代办/岗位授权；L1–L4；列2：T=提交者非单位有权直接签发人；F=已验直接签发→NA；U=授权覆盖范围不明；列3：SRC-001/002/003/004（流程待核）；F005/F006/F030；M001/M004；列4：核授权人、被授权人、资产批次、动作范围、有效期与组织岗位源，前端 role 不可信；受信系统授权可替代纸件；列5：授权可核 PASS_FACT；授权缺项 NEEDS_MATERIAL；过期/矛盾 CONFLICT；规则细节未知 POLICY_UNCONFIRMED → 单位/受理岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "资产身份和账卡",
          "requirement": "规则：R004 资产身份和账卡；L0–L6；列2：T=资产清单行参与；F=不在本批次→NA；U=账外或标签缺失；列3：SRC-001/006/008；F009–F012/F015/F020；M002/M003/M007；列4：比对资产卡号、型号、序列、原值、位置与同一版本清单，不用 OCR 相似名称合并资产；账外情况须人查；列5：一致 PASS_FACT；双卡/金额矛盾 CONFLICT；账外 NEEDS_HUMAN_DECISION → 国资归口/资产使用单位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "现管单位和保管责任",
          "requirement": "规则：R005 现管单位和保管责任；L0–L3；列2：T=需确认保管链；F=本次无保管关联对象→NA；U=历史变更未取得；列3：SRC-001；F004/F019/F045；M002/M030；列4：取资产账卡及 T04-T05 原有效调拨/交接决定，验证生效时间；不重新裁定调拨合法性；列5：一致 PASS_FACT；旧保管人替现责任人签字 CONFLICT；源未接入 SOURCE_UNAVAILABLE → T04-T05 原 Owner/国资",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "权属、担保或争讼",
          "requirement": "规则：R006 权属、担保或争讼；L1–L4；列2：T=拟处置学校资产；F=排除的企业独立资产→NA 并转专项；U=权属登记不明；列3：SRC-001/006/008；F011/F014/F031；M002/M005/M012/M014；列4：权属登记、限制性合同、诉讼保全与账卡逐资产对照，按受理日有效版本；不得模型判归属；列5：权属证据一致 PASS_FACT；矛盾 CONFLICT；存在未决争议 NEEDS_HUMAN_DECISION → 产权/法务/国资",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r007",
          "title": "取得来源与用途限制",
          "requirement": "规则：R007 取得来源与用途限制；L1–L3；列2：T=专项资金、捐赠、项目或合同限制存在；F=可验确无特殊约束→NA；U=来源未知；列3：SRC-001/006；F013/F014/F045；M006/M030；列4：核原合同/捐赠、项目批复和 T04-T04 有效入账来源；不因资金已支付自动消除处置限制；列5：条款和申请相符 PASS_FACT；冲突 CONFLICT；来源不明 NEEDS_HUMAN_DECISION → 归口/原项目与合同 Owner",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "处置方式及理由归属",
          "requirement": "规则：R008 处置方式及理由归属；L1–L3；列2：T=申请报废/出售/转让/置换/损失核销；F=仅调拨借用→NA 并指 T04-T05；U=方式不明；列3：SRC-001/007/008；F007/F008/F011；M001/M003/M011；列4：逐清单行比较申请正文、方式与理由；混合方式保留各行分别路由，不把出售按报废办理；列5：一致 PASS_FACT；主从矛盾 CONFLICT；方式未说明 NEEDS_MATERIAL → 单位/国资归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "使用年限与继续使用事实",
          "requirement": "规则：R009 使用年限与继续使用事实；L1–L3；列2：T=以到龄/技术淘汰申请报废；F=非报废→NA；U=有效年限或资产类别规则缺失；列3：SRC-001/008；F017/F018/F021/F023；M002/M007；列4：对验收起用日、类别年限依据和现状作事实比较；到龄不自动推出无使用价值，未到龄不自动绝对禁止报废；列5：事实相符 PASS_FACT；年限相互矛盾 CONFLICT；校本年限依据未知 POLICY_UNCONFIRMED → 技术单位/国资",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "提前报废、技术鉴定和签发资质",
          "requirement": "规则：R010 提前报废、技术鉴定和签发资质；L2/L3；列2：T=未到龄提前报废或需专业结论；F=无相关鉴定法定触发→NA；U=是否须鉴定不明；列3：SRC-001/005（表题）/008；F021/F023–F025；M007/M008；列4：鉴定结论、被鉴资产、日期、机构/专家签发资格一一对应；L0 无鉴定属未来材料；有相反报告保留冲突；列5：有效报告身份和范围可核 PASS_FACT（非报废许可）；缺件 NEEDS_MATERIAL；专业争议 NEEDS_HUMAN_DECISION → 技术鉴定机构/归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "报废仪器总原值、单台套价值和现场核查候选",
          "requirement": "规则：R011 报废仪器总原值、单台套价值和现场核查候选；L2–L4；列2：T=仪器设备报废且可能涉及省级专家现场核查；F=可证实非仪器报废→NA；U=500 万元统计范围、台套定义或规定现行性未知；列3：SRC-007 第 41 条（跨校转载）/008；F009/F010/F015/F027/F028/F036；M002/M003/M015；列4：本案批次可以按 M003 受信清单核算原值，但不能由“本批次小于 500 万元”推断省级核查不适用；第 41 条原文没有明确总额统计期间/批次边界，可能涉及多批汇总；40 万元指单价或整套价值。M015 为触发并经主管确认后的 L3/L4 证据，不是 L1 申请表附件；列5：本案算术可核 PASS_FACT；重复/刻意拆批线索 CONFLICT；核查适用与汇总口径 POLICY_UNCONFIRMED → 省级主管部门/国资人工",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r012",
          "title": "评估程序与估值来源",
          "requirement": "规则：R012 评估程序与估值来源；L2/L3；列2：T=出售、转让、置换等依法需评估；F=权威规则明确免评→NA；U=评估适用性待核；列3：SRC-001/007/008；F007/F015/F016/F026/F035；M010；列4：核评估机构、对象、基准日、范围、有效期、依法免评文件；不得用原值或净值充当评估价、模型定底价；列5：报告对应 PASS_FACT；无应有报告 NEEDS_MATERIAL；免评权限未知 POLICY_UNCONFIRMED → 归口/评估机构",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "转让、出售、置换或捐赠对方与条件",
          "requirement": "规则：R013 转让、出售、置换或捐赠对方与条件；L1–L3；列2：T=涉及交易或赠与相对方；F=单纯报废/损失核销→NA；U=实际方式模糊；列3：SRC-001/007/008；F007/F014/F031/F035；M005/M011；列4：申请方式与双方意向、资产清单、权属限制比对；意向价/协议不代表批准成交，具体交易方式人审；列5：文书事实一致 PASS_FACT；方案与对方冲突 CONFLICT；资质/交易路线 NEEDS_HUMAN_DECISION → 国资/法务",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "房屋土地与拆除权证",
          "requirement": "规则：R014 房屋土地与拆除权证；L1–L4；列2：T=房地或拆除类处置；F=非房地→NA；U=权属地类未知；列3：SRC-001/007/008；F011/F014/F031/F035；M005/M012；列4：房屋/土地分别核权证、坐落、资产卡、规划或危房鉴定与所报方式；照片不能代法定鉴定；列5：证据对应 PASS_FACT；位置/产权矛盾 CONFLICT；权限、拆除安全 NEEDS_HUMAN_DECISION → 房产/规划/国资",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "车辆登记与车辆专项权限",
          "requirement": "规则：R015 车辆登记与车辆专项权限；L1–L4；列2：T=机动车/公务车；F=非车辆→NA；U=分类或登记不明；列3：SRC-001/007/008；F011/F014/F026/F035；M005/M013；列4：车架号、牌照、登记主体、资产卡与专业意见一致；不假设普通办公设备批复即可处置公车；列5：三向匹配 PASS_FACT；错车 CONFLICT；审批级次 POLICY_UNCONFIRMED → 车辆管理归口/国资",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r016",
          "title": "无形资产、科技成果及企业资产边界",
          "requirement": "规则：R016 无形资产、科技成果及企业资产边界；L1–L4；列2：T=无形资产、知识产权、科技成果或股权；F=普通实物资产→NA；U=产权主体不明；列3：SRC-001/006 第23条/007；F011/F013/F014/F031/F045；M006/M014/M030；列4：核权利人、登记/许可、资助合同、原科技成果 Owner 决定；企业主体不满足学校直接处置权即转专项，不替代成果转化批准；列5：权利链对应 PASS_FACT；冲突 CONFLICT；特别法/审批归口 NEEDS_HUMAN_DECISION → 科研成果/法务/国资",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "单位内部决策与签章",
          "requirement": "规则：R017 单位内部决策与签章；L2/L3；列2：T=进入正式校内报批；F=仅 L0 事实报告→NA；U=何级会议/审批权限不明；列3：SRC-001/006/007/008；F029/F030/F035；M001/M003/M009；列4：单位/学校真实决议、签发职权、签发日期及资产清单版本对应；个人代办签字不能替代会议；列5：文书有效对应 PASS_FACT；签章/清单不一致 CONFLICT；校本级次 POLICY_UNCONFIRMED → 有权单位/校国资会议受理岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "盘亏毁损/损失事件与资产清单",
          "requirement": "规则：R018 盘亏毁损/损失事件与资产清单；L0–L3；列2：T=盘亏或毁损报告；F=无损失的普通处置→NA；U=损失类型不明；列3：SRC-001/007/008；F010/F019/F021/F022/F032；M002/M003/M007；列4：盘点数量、资产卡、发现日、保管人及事件报告核对；L0 允许先登记未结事实；列5：一致 PASS_FACT；数量矛盾 CONFLICT；仍需调查 NEEDS_HUMAN_DECISION → 使用单位/国资/调查岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "盗抢与公安文书",
          "requirement": "规则：R019 盗抢与公安文书；L0–L4；列2：T=声称被盗/抢；F=其他损失→NA；U=事故性质未认定；列3：SRC-006/008；F022/F032；M007/M016；列4：核案件号、报案主体、地点、资产编号与公安文书形成时点；报案回执不等于结案证明，不提前强制结案；列5：文书归属 PASS_FACT；关键报案材料当前缺失 NEEDS_MATERIAL；案件结论未出 NEEDS_HUMAN_DECISION → 保卫/公安/国资",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "保险理赔事实",
          "requirement": "规则：R020 保险理赔事实；L2–L4；列2：T=确有保险且损失落入理赔事项；F=可验未投保/不涉及理赔→NA；U=保单不明；列3：SRC-007/008；F013/F033/F034；M006/M017；列4：保单险别、保险人决定、理赔/拒赔状态、到账和资产事件对应；索赔未决不填 0 元或已到账；列5：已发生事实 PASS_FACT；理赔凭据矛盾 CONFLICT；尚未决定 NEEDS_HUMAN_DECISION → 财务/保险人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "灾害事故与客观原因证明",
          "requirement": "规则：R021 灾害事故与客观原因证明；L0–L3；列2：T=称不可抗力/事故；F=纯折旧报废→NA；U=性质待调查；列3：SRC-006/008；F021/F022/F032/F034；M007/M018；列4：按灾情、事故调查文书的事件日/场所/资产范围匹配；申请人口述不能作法定免责判断；列5：事件关联 PASS_FACT；无客观证据 NEEDS_MATERIAL；原因定性 NEEDS_HUMAN_DECISION → 应急/调查/国资",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "责任认定权限和文件",
          "requirement": "规则：R022 责任认定权限和文件；L3/L4；列2：T=事故、管理不善、遗失需责任处理并拟核销；F=现有权威证明无需该责任程序→NA；U=应否追责尚无有权结论；列3：SRC-001/007/008；F019/F034/F036；M007/M019；列4：核责任决定机关、对象、事件、版本和救济/生效状态；不从 OCR 或“我愿赔”推断过错；列5：已有文件仅文书匹配 PASS_FACT；矛盾 CONFLICT；过错/免责 NEEDS_HUMAN_DECISION → 有权责任处理机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "赔偿追偿与实际履行",
          "requirement": "规则：R023 赔偿追偿与实际履行；L3–L6；列2：T=有权决定须赔偿/追偿；F=有权认定不涉及赔偿→NA；U=金额/主体仍未定；列3：SRC-001/007/008；F033/F034/F041；M019/M020；列4：将决定书责任主体及金额与缴款/执行回执分离核验；主张赔偿不等于履行，赔偿事实不自动产生核销批准；列5：收付事实匹配 PASS_FACT；账款冲突 CONFLICT；未决 NEEDS_HUMAN_DECISION → 财务/责任处理机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "涉密、放射性和特种设备专项文件",
          "requirement": "规则：R024 涉密、放射性和特种设备专项文件；L0–L6；列2：T=存在法定特别管控属性；F=可信登记证明普通资产→NA；U=是否涉密/危险未知；列3：SRC-003/010/008；F011/F020/F021/F044；M007/M021；列4：专项证照、退役/注销/检验/送贮节点与法定机关验证；有些文书须实施后形成，不于 L0 强要；涉密原文不得上传普通云模型；列5：已有证照对应 PASS_FACT；无法核证 NEEDS_HUMAN_DECISION；未获必需许可禁止实体处置 → 实验室安全/法定主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "处分方式与最终审批权限路由",
          "requirement": "规则：R025 处分方式与最终审批权限路由；L2–L4；列2：T=拟提交正式处置审批；F=仅 L0 发现阶段→NA；U=现行校本/省级权限冲突未解决；列3：SRC-001/006/007/008；F007/F011/F027/F028/F035/F049；M003/M009/M022；列4：依受理日有效法律/特例、资产类别、方式、权限与当前批次重建候选路由；2024 转载门槛与校本授权未证实，不自动指定审批人；列5：政策原文齐后仅事实分流 PASS_FACT；现时无证 POLICY_UNCONFIRMED → 国资/上级主管核定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "上级审核、核查及受理回执",
          "requirement": "规则：R026 上级审核、核查及受理回执；L3/L4；列2：T=申请已正式转报主管机关；F=尚处 L1/L2→NA；U=是否已转报不明；列3：SRC-006/007/008；F030/F036/F049；M015/M022；列4：核上级原机关受理号、审核意见、批次清单和签发时间；达到官方确认条件的实地核查 M015 才在本阶段适用；列5：回执归属 PASS_FACT；错批次 CONFLICT；主管源不通 SOURCE_UNAVAILABLE → 国资转报岗/主管机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "最终有效批复/不批复与签发权",
          "requirement": "规则：R027 最终有效批复/不批复与签发权；L4–L6；列2：T=已到需核有权决定阶段；F=前期尚未报批→NA；U=决定尚未形成/权限争议；列3：SRC-001/006/007/008；F030/F035–F038/F050；M022/M023；列4：原机关决定 ID、文号、验签主体、方式、资产附件、版本与生效/变更链；校内会议与 OCR“同意”不能代替终局文件；列5：批文事实存在 PASS_FACT（只核真实存在，包含不批准）；错附件 CONFLICT；尚待机关决定 NEEDS_HUMAN_DECISION → 法定审批机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "平台交易、成交与处置方式",
          "requirement": "规则：R028 平台交易、成交与处置方式；L5；列2：T=已有有效批准并须交易/竞价；F=已批报废无需交易→NA；U=是否须平台处置未知；列3：SRC-006/007/008；F007/F026/F037–F039；M010/M023/M024；列4：原批复方法、交易项目、成交资产、价格和时间比对，未获正式批准不得把意向报价当成交；不做价格合理性裁量；列5：事实一致 PASS_FACT；未经授权成交 CONFLICT；平台路径未知 POLICY_UNCONFIRMED → 处置平台/国资",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "报废实物交割、分类回收与处置顺序",
          "requirement": "规则：R029 报废实物交割、分类回收与处置顺序；L5；列2：T=已进入实物实施；F=无实物可移交的纯无形资产→NA；U=实施节点/法定特殊许可未明确；列3：SRC-006/007/008/010；F010/F037/F038/F040/F044；M021/M023/M025；列4：回收/拆解机构、资产编号数量、批准范围、专门许可证和时间对照；临时保管不得冒充最终合法处置；列5：交割事实 PASS_FACT；先行处置或多出设备 CONFLICT；危险物件 NEEDS_HUMAN_DECISION → 国资/安全主管/处置机构",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "处置收入与缴库事实",
          "requirement": "规则：R030 处置收入与缴库事实；L5/L6；列2：T=交易形成应入账的处置收入；F=合法无收入报废→NA；U=收支性质不明；列3：SRC-006/007/008；F039/F041；M024/M026/M030；列4：交易额、收款、非税缴库三者分别核对，引用 G07/财务原记录，不再自审财务支付合规性；列5：已入库事实 PASS_FACT；金额/凭据相悖 CONFLICT；无法得财务权威源 SOURCE_UNAVAILABLE → 财务/G07 Owner",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "资产卡状态与下账日志",
          "requirement": "规则：R031 资产卡状态与下账日志；L6；列2：T=已有有权决定及实施记录、进入资产账务处理；F=未到 L6→NA；U=下账节点规则不明；列3：SRC-001/006/008；F009/F010/F037/F040/F042/F047；M003/M023/M025/M027；列4：逐资产关联签批清单、实施证据、系统有权操作日志和日期；不直接改写资产卡；合法阶段例外需原政策；列5：账卡事实相符 PASS_FACT；越批下账 CONFLICT；系统源不通 SOURCE_UNAVAILABLE → 国资资产账务岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "财务会计核销与账卡勾稽",
          "requirement": "规则：R032 财务会计核销与账卡勾稽；L6；列2：T=会计部门完成或申请核销；F=未到会计处理阶段→NA；U=尚未取得财务权威状态；列3：SRC-006/007/008；F015/F016/F041/F042/F043；M002/M023/M026/M027/M028/M030；列4：批复与会计凭证/资产卡按原值、净值、款项分类匹配；G07/财务原 Owner 保持唯一记账权，模板只读验证；列5：勾稽事实 PASS_FACT；不平 CONFLICT；原源无法获取 SOURCE_UNAVAILABLE → 财务/G07",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "补件、撤回、终止、重提和复核状态",
          "requirement": "规则：R033 补件、撤回、终止、重提和复核状态；L1–L6；列2：T=原单位提出变更/救济；F=无程序事件→NA；U=校方受理方式或时限未核；列3：SRC-004（正文不可读）/008 第12/13条；F003/F046/F049/F050；M001/M023/M029；列4：分申请请求、受理回执、决定结果和既有批文效力；批准后终止走原批准机关备案/处置，不能客户端撤批；撤回后重提建立新申请版本关系；列5：请求与回执一致仅 PASS_FACT；缺受理依据 POLICY_UNCONFIRMED；正式撤回/复核效力 NEEDS_HUMAN_DECISION → 原受理/批准机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "相邻模板权威结论复用",
          "requirement": "规则：R034 相邻模板权威结论复用；L0–L6；列2：T=引用入账/调拨/科研成果/财务等既有结论；F=无关联决定需求→NA；U=原 Owner 或版本不明；列3：SRC-001/006/007；F013/F014/F019/F041/F045/F050；M002/M006/M014/M026/M028/M030；列4：必须核原业务模板/对象/决定 ID、签发身份、效力版本及当前状态；T04-T04/T05、T03、G07 结论只读，不在本模板重作决定；列5：引用相符 PASS_FACT；失效旧结论 CONFLICT；G50 映射未知 POLICY_UNCONFIRMED → 相邻原 Owner/集成岗",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r035",
          "title": "替换材料、主从版本与定向重审",
          "requirement": "规则：R035 替换材料、主从版本与定向重审；L0–L6；列2：T=有新材料覆盖既有当前版本或决定关联变动；F=仅追加无影响资料→NA；U=无法定位依赖目标；列3：SRC-001/006/008；F002/F009/F010/F047/F050；M001/M003/M008/M009/M010/M023/M029/M030；列4：内容寻址保留旧哈希与结论，记录前后页行/资产和批次变更；失效的只是受影响 R×target×sourceVersion 当前结论，不篡改历史机关批文；列5：影响集合明确 PASS_FACT；版本错配 CONFLICT；无法自动判批文效力 NEEDS_HUMAN_DECISION → 原审批机关/国资与受影响规则 Owner",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r036",
          "title": "证据可读性、来源连通与校验",
          "requirement": "规则：R036 证据可读性、来源连通与校验；L0–L6；列2：T=某 R 在当前阶段引用 M 或外部系统；F=相关材料本阶段尚不适用→NA；U=来源或权限状态不明；列3：SRC-001/004/005/006/007/008；F047/F048；M001–M030（按触发选择）；列4：先区分文件不存在、已有文件 OCR 不可读、官方源失联、验证失败，分别记录网页/文件/签章与访问时间；不可据检索失败宣布文件不存在；列5：内容可验 PASS_FACT；当前应有缺件 NEEDS_MATERIAL；不可读 UNREADABLE；源失联 SOURCE_UNAVAILABLE → 材料持有人/系统管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r037",
          "title": "政策版本、资格期限与权限变更",
          "requirement": "规则：R037 政策版本、资格期限与权限变更；L1–L6；列2：T=需要法定/校本门槛、期限、审批级次；F=只记 L0 客观事实不触发→NA；U=当期校本原文或正式修订未取得；列3：SRC-001/004/005/006/007/008/009（仅旧线索）；F003/F018/F027/F028/F035/F048/F049；M001/M002/M009/M022/M029；列4：对政策签发、施行、废改、学校适用、当期通知、F048 来源连通/校验时间和受理日核定；跨校指南及历史目录不作硬法条，500万/40万及撤回期限保持未知；列5：有完整政策原文才可核其事实 PASS_FACT；政策未知 POLICY_UNCONFIRMED；解释与适用争议 NEEDS_HUMAN_DECISION → 学校国资/有权政策机关",
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
      "name": "发现与资产核对",
      "kind": "auto-check",
      "executorRole": "reviewer",
      "nextStageId": "L1",
      "workflowOwner": "local"
    },
    {
      "id": "L1",
      "name": "单位内部研判/发起",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L2",
      "returnToStageId": "L0",
      "workflowOwner": "local"
    },
    {
      "id": "L2",
      "name": "归口初审与专业证据",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L3",
      "returnToStageId": "L1",
      "workflowOwner": "local"
    },
    {
      "id": "L3",
      "name": "校内集体决策与逐级报批（仅核验真实意见）",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "L4",
      "returnToStageId": "L2",
      "workflowOwner": "local"
    },
    {
      "id": "L4",
      "name": "有权审批、退补/撤回/复核（仅记录真实决定）",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "L5",
      "returnToStageId": "L3",
      "workflowOwner": "local"
    },
    {
      "id": "L5",
      "name": "批准后实施与交割（仅核对后续凭证）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L6",
      "returnToStageId": "L4",
      "workflowOwner": "local"
    },
    {
      "id": "L6",
      "name": "账务更新与归档（仅核对凭证；不执行销账/记账）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "L5",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "review-observations",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "review-issues",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "review-todos",
      "kind": "supplement-list",
      "audience": "teacher"
    },
    {
      "id": "external-decision-reference",
      "kind": "item-feedback",
      "audience": "teacher"
    },
    {
      "id": "history-and-supersession",
      "kind": "item-feedback",
      "audience": "reviewer"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

/** Source and policy-evidence metadata; SRC identifiers are research citations, never case SourceRefs. */
export const r02Metadata = {
  "templateId": "T04-T06",
  "name": "国有资产报废、处置及损失核验审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T04-T06.md",
  "sourceDocumentSha256": "c63c203f32ea4219d6fcda862ef4502941e984e96f325c4c2a79ded560d433ae",
  "researchOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T04-T06.md",
  "researchOriginalBlobSha1": "1a2aef0d9934d505383fa977f80a6e16fca40319",
  "manifestBytes": 156733,
  "manifestSha256": "c63c203f32ea4219d6fcda862ef4502941e984e96f325c4c2a79ded560d433ae",
  "manifestSourceSnapshot": "2026-10-22（当前可访问的最新正式 MD）",
  "researchAsOf": "2026-10-23",
  "officialSchoolTemplate": false,
  "researchStatus": "REVIEWED_WITH_INTEGRATION_GUARD_OPEN",
  "policyEvidenceStatus": "PARTIAL",
  "sourceHashNormalization": "Reviewed copy is the current research blob plus one LF to match the manifest; the research-original blob is unchanged.",
  "fields": [
    {
      "fieldId": "F001",
      "key": "case_id",
      "sourceLabel": "case_id / UUID",
      "scope": "case"
    },
    {
      "fieldId": "F002",
      "key": "application_batch_id",
      "sourceLabel": "application_batch_id / 字符串",
      "scope": "case"
    },
    {
      "fieldId": "F003",
      "key": "current_stage",
      "sourceLabel": "current_stage / 枚举 L0–L6",
      "scope": "case"
    },
    {
      "fieldId": "F004",
      "key": "applicant_unit_id",
      "sourceLabel": "applicant_unit_id / 组织标识",
      "scope": "subject"
    },
    {
      "fieldId": "F005",
      "key": "submitter_person_id",
      "sourceLabel": "submitter_person_id / 受信身份引用",
      "scope": "subject"
    },
    {
      "fieldId": "F006",
      "key": "delegated_authority",
      "sourceLabel": "delegated_authority / 结构化引用",
      "scope": "subject"
    },
    {
      "fieldId": "F007",
      "key": "proposed_disposal_method",
      "sourceLabel": "proposed_disposal_method / 枚举",
      "scope": "case"
    },
    {
      "fieldId": "F008",
      "key": "disposal_reason",
      "sourceLabel": "disposal_reason / 文本与原因码",
      "scope": "case"
    },
    {
      "fieldId": "F009",
      "key": "asset_list_revision",
      "sourceLabel": "asset_list_revision / 文档 ID+版本",
      "scope": "case"
    },
    {
      "fieldId": "F010",
      "key": "official_asset_card_id",
      "sourceLabel": "official_asset_card_id / 字符串",
      "scope": "subject"
    },
    {
      "fieldId": "F011",
      "key": "asset_category",
      "sourceLabel": "asset_category / 代码",
      "scope": "subject"
    },
    {
      "fieldId": "F012",
      "key": "asset_name_model",
      "sourceLabel": "asset_name_model / 文本",
      "scope": "subject"
    },
    {
      "fieldId": "F013",
      "key": "acquisition_source_limits",
      "sourceLabel": "acquisition_source_limits / 结构化文本",
      "scope": "subject"
    },
    {
      "fieldId": "F014",
      "key": "title_and_ownership",
      "sourceLabel": "title_and_ownership / 证据引用+状态",
      "scope": "subject"
    },
    {
      "fieldId": "F015",
      "key": "original_asset_value",
      "sourceLabel": "original_asset_value / 金额+币种",
      "scope": "subject"
    },
    {
      "fieldId": "F016",
      "key": "carrying_book_value",
      "sourceLabel": "carrying_book_value / 金额",
      "scope": "subject"
    },
    {
      "fieldId": "F017",
      "key": "acquisition_or_use_start_date",
      "sourceLabel": "acquisition_or_use_start_date / 日期",
      "scope": "subject"
    },
    {
      "fieldId": "F018",
      "key": "useful_life_basis",
      "sourceLabel": "useful_life_basis / 期间+依据版本",
      "scope": "subject"
    },
    {
      "fieldId": "F019",
      "key": "responsible_custodian",
      "sourceLabel": "responsible_custodian / 受信人员引用",
      "scope": "subject"
    },
    {
      "fieldId": "F020",
      "key": "physical_location_campus",
      "sourceLabel": "physical_location_campus / 地址代码",
      "scope": "subject"
    },
    {
      "fieldId": "F021",
      "key": "physical_condition",
      "sourceLabel": "physical_condition / 枚举+观察",
      "scope": "subject"
    },
    {
      "fieldId": "F022",
      "key": "incident_or_discovery_date",
      "sourceLabel": "incident_or_discovery_date / 日期",
      "scope": "subject"
    },
    {
      "fieldId": "F023",
      "key": "service_and_repair_history",
      "sourceLabel": "service_and_repair_history / 引用列表",
      "scope": "subject"
    },
    {
      "fieldId": "F024",
      "key": "technical_appraisal_opinion",
      "sourceLabel": "technical_appraisal_opinion / 枚举+报告引用",
      "scope": "subject"
    },
    {
      "fieldId": "F025",
      "key": "appraisal_issuer_credential",
      "sourceLabel": "appraisal_issuer_credential / 身份与签章引用",
      "scope": "subject"
    },
    {
      "fieldId": "F026",
      "key": "valuation_report",
      "sourceLabel": "valuation_report / 金额+报告引用",
      "scope": "subject"
    },
    {
      "fieldId": "F027",
      "key": "batch_original_value_total",
      "sourceLabel": "batch_original_value_total / 金额",
      "scope": "case"
    },
    {
      "fieldId": "F028",
      "key": "major_single_set_value",
      "sourceLabel": "major_single_set_value / 金额",
      "scope": "subject"
    },
    {
      "fieldId": "F029",
      "key": "internal_unit_decision",
      "sourceLabel": "internal_unit_decision / 文号+状态",
      "scope": "subject"
    },
    {
      "fieldId": "F030",
      "key": "decision_signatory_role",
      "sourceLabel": "decision_signatory_role / 受信权限引用",
      "scope": "subject"
    },
    {
      "fieldId": "F031",
      "key": "title_dispute_lien_litigation",
      "sourceLabel": "title_dispute_lien_litigation / 多值状态",
      "scope": "subject"
    },
    {
      "fieldId": "F032",
      "key": "police_or_incident_record",
      "sourceLabel": "police_or_incident_record / 引用+状态",
      "scope": "subject"
    },
    {
      "fieldId": "F033",
      "key": "insurance_compensation",
      "sourceLabel": "insurance_compensation / 金额+状态",
      "scope": "subject"
    },
    {
      "fieldId": "F034",
      "key": "liability_disposition",
      "sourceLabel": "liability_disposition / 有权文书引用",
      "scope": "subject"
    },
    {
      "fieldId": "F035",
      "key": "approval_route",
      "sourceLabel": "approval_route / 机关级次+依据版本",
      "scope": "subject"
    },
    {
      "fieldId": "F036",
      "key": "supervisory_review",
      "sourceLabel": "supervisory_review / 文号+状态",
      "scope": "subject"
    },
    {
      "fieldId": "F037",
      "key": "final_authority_decision",
      "sourceLabel": "final_authority_decision / 决定 ID+版本",
      "scope": "subject"
    },
    {
      "fieldId": "F038",
      "key": "approved_execution_method",
      "sourceLabel": "approved_execution_method / 枚举",
      "scope": "subject"
    },
    {
      "fieldId": "F039",
      "key": "transaction_result_amount",
      "sourceLabel": "transaction_result_amount / 金额+状态",
      "scope": "subject"
    },
    {
      "fieldId": "F040",
      "key": "physical_handover_disposal",
      "sourceLabel": "physical_handover_disposal / 时间+回执",
      "scope": "subject"
    },
    {
      "fieldId": "F041",
      "key": "proceeds_remitted",
      "sourceLabel": "proceeds_remitted / 金额+凭证",
      "scope": "case"
    },
    {
      "fieldId": "F042",
      "key": "asset_card_derecognition",
      "sourceLabel": "asset_card_derecognition / 记录 ID",
      "scope": "subject"
    },
    {
      "fieldId": "F043",
      "key": "accounting_entry",
      "sourceLabel": "accounting_entry / 凭证 ID",
      "scope": "subject"
    },
    {
      "fieldId": "F044",
      "key": "security_and_hazard_type",
      "sourceLabel": "security_and_hazard_type / 枚举+密级",
      "scope": "subject"
    },
    {
      "fieldId": "F045",
      "key": "adjacent_authoritative_decisions",
      "sourceLabel": "adjacent_authoritative_decisions / 引用数组",
      "scope": "subject"
    },
    {
      "fieldId": "F046",
      "key": "withdrawal_review_request",
      "sourceLabel": "withdrawal_review_request / 引用+状态",
      "scope": "subject"
    },
    {
      "fieldId": "F047",
      "key": "evidence_revision_hash",
      "sourceLabel": "evidence_revision_hash / 版本+摘要",
      "scope": "subject"
    },
    {
      "fieldId": "F048",
      "key": "source_availability_verification",
      "sourceLabel": "source_availability_verification / 枚举+时间",
      "scope": "subject"
    },
    {
      "fieldId": "F049",
      "key": "deadline_attribution",
      "sourceLabel": "deadline_attribution / 时间+依据",
      "scope": "subject"
    },
    {
      "fieldId": "F050",
      "key": "controlling_decision_version",
      "sourceLabel": "controlling_decision_version / 文号+快照",
      "scope": "case"
    }
  ],
  "materials": [
    {
      "materialId": "M001",
      "name": "M001 单位处置申请、方式和理由"
    },
    {
      "materialId": "M002",
      "name": "M002 资产账卡、原值、使用单位、保管人"
    },
    {
      "materialId": "M003",
      "name": "M003 本次处置资产清单"
    },
    {
      "materialId": "M004",
      "name": "M004 代办与岗位授权"
    },
    {
      "materialId": "M005",
      "name": "M005 资产权属与纠纷状态"
    },
    {
      "materialId": "M006",
      "name": "M006 资产取得来源与专项限制"
    },
    {
      "materialId": "M007",
      "name": "M007 现状、盘点、报修和维护记录"
    },
    {
      "materialId": "M008",
      "name": "M008 专家/技术鉴定"
    },
    {
      "materialId": "M009",
      "name": "M009 单位内部集体决策"
    },
    {
      "materialId": "M010",
      "name": "M010 资产评估报告"
    },
    {
      "materialId": "M011",
      "name": "M011 转让/置换/捐赠意向材料"
    },
    {
      "materialId": "M012",
      "name": "M012 不动产权属及拆除专业文件"
    },
    {
      "materialId": "M013",
      "name": "M013 车辆登记与评估证据"
    },
    {
      "materialId": "M014",
      "name": "M014 无形资产和科技成果权属"
    },
    {
      "materialId": "M015",
      "name": "M015 省级贵重大批量仪器核查"
    },
    {
      "materialId": "M016",
      "name": "M016 盗抢及公安案件事实"
    },
    {
      "materialId": "M017",
      "name": "M017 保险理赔事实"
    },
    {
      "materialId": "M018",
      "name": "M018 灾害、意外事故及毁损证明"
    },
    {
      "materialId": "M019",
      "name": "M019 责任认定/有权处理文件"
    },
    {
      "materialId": "M020",
      "name": "M020 赔偿、追偿或追回处理"
    },
    {
      "materialId": "M021",
      "name": "M021 涉密、放射性、特种设备专项文书"
    },
    {
      "materialId": "M022",
      "name": "M022 上级审核、备案与专家反馈"
    },
    {
      "materialId": "M023",
      "name": "M023 最终有权处置批准或不批准"
    },
    {
      "materialId": "M024",
      "name": "M024 处置平台交易/成交记录"
    },
    {
      "materialId": "M025",
      "name": "M025 报废实物交割/回收/拆除"
    },
    {
      "materialId": "M026",
      "name": "M026 处置收入/非税入库"
    },
    {
      "materialId": "M027",
      "name": "M027 资产卡片变更及下账记录"
    },
    {
      "materialId": "M028",
      "name": "M028 会计核销/凭证"
    },
    {
      "materialId": "M029",
      "name": "M029 补件、修改、撤回、终止或复核"
    },
    {
      "materialId": "M030",
      "name": "M030 相邻业务权威结论及历史来源"
    }
  ],
  "sources": [
    {
      "srcId": "SRC-001",
      "title": "成都理工大学，《成都理工大学国有资产管理办法》，成理校发〔2021〕19 号",
      "url": "https://gz.cdut.edu.cn/__local/7/BF/5C/359363FECC36DD8F19D78A72F13_250F0B0E_72048.pdf",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-002",
      "title": "成都理工大学国资与实验室管理处，《机构设置》（部门职责）",
      "url": "https://gz.cdut.edu.cn/jgsehz.htm",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-003",
      "title": "成都理工大学国资与实验室管理处，《内设机构及职责》",
      "url": "https://gz.cdut.edu.cn/jgsehz/nsjgjzz.htm",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-004",
      "title": "成都理工大学国资与实验室管理处，《一般固定资产报废处置流程》",
      "url": "https://gz.cdut.edu.cn/bsfwlc.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-005",
      "title": "成都理工大学国资与实验室管理处，《成都理工大学大型设备报废技术鉴定表》及《成都理工大学无形资产处置技术鉴定表》",
      "url": "https://gz.cdut.edu.cn/index.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-006",
      "title": "国务院，《行政事业性国有资产管理条例》，国务院令第 738 号",
      "url": "https://xzfg.moj.gov.cn/front/law/detail?LawID=677",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-007",
      "title": "四川省教育厅、省机关事务管理局、省财政厅，《四川省省属高等学校国有资产管理办法》，川教〔2024〕112 号；由西南石油大学国有资产管理处全文转载",
      "url": "https://www.swpu.edu.cn/gzc/info/1066/3510.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-008",
      "title": "四川省机关事务管理局，《四川省省直行政事业单位国有资产处置管理实施办法》，川机管发〔2023〕243 号；由四川司法警官职业学院网站转存文件",
      "url": "https://www.scpcfe.cn/__local/1/54/D3/8B8C15FF348A8A947A84D51FD96_F14640C2_6D711.pdf",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-009",
      "title": "成都理工大学核资源勘查技术实验教学中心，《管理规章制度》列《仪器设备报废办理程序》《仪器设备损坏、丢失事故处理办法》《废旧物资处置实施细则》《固定资产处置管理实施办法》",
      "url": "https://www.cdut.edu.cn/nret/gltz/glgzzd.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-010",
      "title": "成都理工大学，《成都理工大学实验室放射性同位素与射线装置管理办法》，成理校发〔2017〕44 号",
      "url": "https://gz.cdut.edu.cn/__local/3/45/7E/014364EF4DA2FDFEF012ACD2A2B_93C46EA3_77C00.pdf?e=.pdf",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-011",
      "title": "成都理工大学国资与实验室管理处，《校党委第三巡察组巡察国资与实验室管理处党组织反馈意见会召开》",
      "url": "https://gz.cdut.edu.cn/info/1043/2535.htm",
      "evidenceStatus": "PARTIAL"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules",
      "criterionId": "r001",
      "srcIds": [
        "SRC-001",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r002",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r004",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r005",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r006",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r007",
      "srcIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r008",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r009",
      "srcIds": [
        "SRC-001",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r010",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r011",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r012",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r013",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r014",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r015",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r016",
      "srcIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r017",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r018",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r019",
      "srcIds": [
        "SRC-006",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r020",
      "srcIds": [
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r021",
      "srcIds": [
        "SRC-006",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r022",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r023",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r024",
      "srcIds": [
        "SRC-003",
        "SRC-010",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r025",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r026",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r027",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r028",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r029",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r030",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r031",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r032",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r033",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r034",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r035",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r036",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r037",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    }
  ],
  "sourceStages": [
    {
      "id": "L0",
      "name": "发现与资产核对",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "L1",
      "name": "单位内部研判/发起",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "L2",
      "name": "归口初审与专业证据",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "L3",
      "name": "校内集体决策与逐级报批",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "L4",
      "name": "有权审批、退补/撤回/复核",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "L5",
      "name": "批准后实施与交割",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "L6",
      "name": "账务更新与归档",
      "sourceSection": "03.1",
      "mainline": true
    }
  ],
  "stageModelNote": "L0–L6 是原件定义的研究用时间轴，不代表学校系统有七个页面或七级审批。模板阶段仅表达主线；每次到达 L4 都必须核验真实有权决定，L5/L6 仅能引用批准后真实产生的交割/账务凭证。撤回、复核、退补及终止是原件 §03/§11 的条件分支，不得由线性 nextStageId 推断为必经步骤。",
  "resultCodes": [
    {
      "code": "PASS_FACT",
      "meaning": "仅指定事实命题有可追溯、同版本且无冲突的证据支持；不代表行政批准。"
    },
    {
      "code": "NOT_APPLICABLE",
      "meaning": "触发条件可信为假，或证据属于尚未到来的后置阶段；须记录理由。"
    },
    {
      "code": "NEEDS_MATERIAL",
      "meaning": "当前阶段确需且合法持有人可提供的材料缺失。"
    },
    {
      "code": "CONFLICT",
      "meaning": "有效证据在资产、批次、金额、签署主体、版本或法定顺序上实质冲突。"
    },
    {
      "code": "UNREADABLE",
      "meaning": "材料已存在但无法可靠读取所需内容。"
    },
    {
      "code": "SOURCE_UNAVAILABLE",
      "meaning": "应由权威系统/原机关提供的来源暂不可访问或无法核验。"
    },
    {
      "code": "POLICY_UNCONFIRMED",
      "meaning": "当前校本条款、授权口径、上级原件或适用日期尚未证实。"
    },
    {
      "code": "NEEDS_HUMAN_DECISION",
      "meaning": "审批、赔偿责任、权属争议、专业安全或法定复核等必须由有权人员决定。"
    }
  ],
  "outputContract": [
    {
      "id": "review-observations",
      "sourceType": "ReviewObservation",
      "sourceSection": "10.2",
      "runtimeKind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "review-issues",
      "sourceType": "ReviewIssue",
      "sourceSection": "10.2",
      "runtimeKind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "review-todos",
      "sourceType": "ReviewTodo",
      "sourceSection": "10.2",
      "runtimeKind": "supplement-list",
      "audience": "teacher"
    },
    {
      "id": "external-decision-reference",
      "sourceType": "ExternalDecisionRef",
      "sourceSection": "10.2",
      "runtimeKind": "item-feedback",
      "audience": "teacher",
      "readOnly": true
    },
    {
      "id": "history-and-supersession",
      "sourceType": "supersedesIssueId/auditEventId",
      "sourceSection": "10.2/11.1",
      "runtimeKind": "item-feedback",
      "audience": "reviewer",
      "readOnly": true
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
