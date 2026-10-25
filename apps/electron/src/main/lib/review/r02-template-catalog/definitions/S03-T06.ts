/**
 * R02 S03-T06 本地研究模板定义。
 * 来源：docs/design/review-agent/business-templates/R02/S03-T06.md
 * SHA-256：bc954bf1ae59a77f38f6ef971e6e09aa8f90e1aa1fc877737f04a9db0f576c38
 * 非校方正式模板；未确认政策只可形成建议并进入人工复核。
 */
import type { TemplateVersion } from '@profer/shared'

export const template: TemplateVersion = {
  "templateId": "S03-T06",
  "version": 1,
  "schemaVersion": 2,
  "name": "家庭经济困难学生资格认定审核",
  "description": "家庭经济困难学生资格认定审核。本地研究模板 · 非校方正式模板。仅用于事实核验、证据对应和人工复核；不代行学校签批，不自动产生正式批准或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非成都理工大学校方正式模板；原件 S03-T06 的字段、材料槽、规则及阶段转换为 V3 TemplateVersion；政策证据状态 PARTIAL，未确认条件只生成审阅建议/待确认事项，最终决定须由本地 reviewer/teacher 人工处理。",
  "objectType": "person",
  "displayName": {
    "template": "家庭经济困难学生资格认定审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "case_id／string · Case · P1 起",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F001；case_id／string · Case · P1 起 · 本地受控建案流水；技术设计 SRC-012 · M024:案卷主键 · L1 · N：阻止串案；生成前不开始核验。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F002",
      "label": "student_id／string · StudentIdentity · P1/P5/P7",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F002；student_id／string · StudentIdentity · P1/P5/P7 · 学校可信学籍记录 SRC-002/004（存在流程，未验证接口） · M002:学号/唯一标识 · L2 · S；本人上传学号只供匹配不自证。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F003",
      "label": "legal_name／string · StudentIdentity · P1/P7",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F003；legal_name／string · StudentIdentity · P1/P7 · 校务学籍/身份管理；学生签字作对照 · M002:姓名；M001:申请签名 · L2 · S 或冲突人工核对，禁止同名合并。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F004",
      "label": "student_level／enum · StudentIdentity · P0/P1",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F004；student_level／enum · StudentIdentity · P0/P1 · 学籍状态；SRC-002/004/015 · M002:学段 · L2 · S；决定本/研分支，不能用上传人选项替代。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F005",
      "label": "enrollment_status／enum · StudentIdentity · P1/P6",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F005；enrollment_status／enum · StudentIdentity · P1/P6 · 学籍管理正式记录；SRC-006/015 · M002:状态；M023:变更事件 · L2 · S；休退学不由模型自动裁定资格。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F006",
      "label": "college_program_class／object · StudentIdentity · P1/P3",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F006；college_program_class／object · StudentIdentity · P1/P3 · 校务组织及班级/专业名册；SRC-002/004/015 · M002:归属；M015:评议组 · L2 · S/H；不得自动套用 SRC-015 到其他学院。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F007",
      "label": "academic_year／string · Case · P0 起",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F007；academic_year／string · Case · P0 起 · 校方本年度通知/批次配置；SRC-001/014 · M003:学年；M024:绑定 · L1 · P：不得用历史截止日填空。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F008",
      "label": "batch_id／string · Case · P0/P1",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F008；batch_id／string · Case · P0/P1 · 当期通知的真实批次；SRC-002/014 · M003:批次；M024:索引 · L1 · P：无当期依据只能标未知批次。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F009",
      "label": "policy_revision／ref · Case · P0/P5",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F009；policy_revision／ref · Case · P0/P5 · 官方校规全文及适用记录；SRC-001/010/015 · M003:来源版本 · L1 · P：不能继承 2018 规则。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F010",
      "label": "request_type／enum(A,B,C,D,E_NEW,E_SUPPLEMENT,F,G,H) · Application · P1/P6/P7",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F010；request_type／enum(A,B,C,D,E_NEW,E_SUPPLEMENT,F,G,H) · Application · P1/P6/P7 · 本人请求及校方受理核对；SRC-006/009 · M001/M010/M011/M012/M013:申请意图 · L2 · N：E_NEW 补认与 E_SUPPLEMENT 旧案补件须区分；不混同撤回、异议。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F011",
      "label": "submitter_auth_id／ref · Application · P1/P7",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F011；submitter_auth_id／ref · Application · P1/P7 · Host/Main 已认证会话，受权核验；SRC-016 · M024:会话绑定，不以表单姓名为凭 · L2 · S/H；Renderer actor 不可信。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F012",
      "label": "proxy_authorization／ref? · Application · P1/P7（代理时）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F012；proxy_authorization／ref? · Application · P1/P7（代理时） · 真实授权或监护证明；SRC-009，校本接受范围未知 · M008:授权对象/时段 · L3 · NA 或 P/H；不默认允许代理。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F013",
      "label": "submitted_at／datetime · Application · P1/P2",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F013；submitted_at／datetime · Application · P1/P2 · 受控受理服务的收件时间；SRC-002/014 · M024:事件日志 · L1 · N；历史公告时间不能填入本案。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F014",
      "label": "form_revision／string · Application · P1",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F014；form_revision／string · Application · P1 · 校方 2026 表原件（未取得）；SRC-003/007 · M001:表头/版本标记 · L1 · P；不因版本文字不清直接拒收。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F015",
      "label": "applicant_declaration／bool+ref · Application · P1",
      "kind": "boolean",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F015；applicant_declaration／bool+ref · Application · P1 · 本人承诺/有效签署校验；SRC-007/009 · M001:承诺与签名框 · L2 · N/P：签署方式依本年度表单核定。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F016",
      "label": "family_hardship_summary／string · Circumstance · P1/P2",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F016；family_hardship_summary／string · Circumstance · P1/P2 · 本人陈述，只有在校方核验后升级事实；SRC-009/015 · M001:家情区；M004:叙述 · L3 · N/P：不得要求无关家人隐私细节。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F017",
      "label": "economic_capacity_summary／object? · Circumstance · P1/P2",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F017；economic_capacity_summary／object? · Circumstance · P1/P2 · 本人陈述及按需权威证明；SRC-009 · M001/M004:经济状况；M014:核验摘要 · L3 · P/H；不自动索取全家流水或设收入阈值。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F018",
      "label": "household_burden_summary／object? · Circumstance · P1/P2",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F018；household_burden_summary／object? · Circumstance · P1/P2 · 本人陈述及必要特定事实证据；SRC-009/015 · M004:家庭负担；M006:必要摘要 · L3/L4 · NA/P；不足以机械得出困难等级。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F019",
      "label": "special_group_category／enum? · Circumstance · P1/P2",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F019；special_group_category／enum? · Circumstance · P1/P2 · 本人陈述+受权渠道核实；SRC-015 第 14 条仅本学院 · M005:特困/低保等类别摘要 · L4 · NA；该学院符合分支时核证明，其他学院 P。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F020",
      "label": "hardship_event_type／enum? · Circumstance · P1/P6",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F020；hardship_event_type／enum? · Circumstance · P1/P6 · 本人陈述或学校已核事件；SRC-006/009 · M007/M010:事件类型 · L3/L4 · NA；动态情形触发才要求。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F021",
      "label": "hardship_event_date／date? · Circumstance · P1/P6",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F021；hardship_event_date／date? · Circumstance · P1/P6 · 当事人声明与有效发生日期证据；SRC-006 · M007/M010:时间段 · L3 · NA；不明日期留冲突/人工，不猜日期。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F022",
      "label": "evidence_issuer_validity／object? · Evidence · P2",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F022；evidence_issuer_validity／object? · Evidence · P2 · 可辨签发机关、时间及受权核验结果；SRC-009/015 · M005–M007/M014:落款/核验记录 · L3/L4 · NA；不可读 UNREADABLE，核验源故障 SOURCE_UNAVAILABLE。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F023",
      "label": "prior_decision_ref／ref? · Decision · P1/P6/P7",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F023；prior_decision_ref／ref? · Decision · P1/P6/P7 · 学校正式历史认定记录；SRC-005/009 · M009:决定 ID · L2/L3 · NA 或 S；不能用上一年截图冒充本年度。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F024",
      "label": "recognition_status_grade／object? · Decision · P1/P6/P8",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F024；recognition_status_grade／object? · Decision · P1/P6/P8 · 学校有权正式结果（可指旧年，也可指当年有效结果，依 F025/F035 限定）；SRC-008/015 · M009/M019:状态与等级 · L3 · NA/S；拟认定表不能替代。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F025",
      "label": "prior_decision_year_version／object? · Decision · P1/P6/P7",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F025；prior_decision_year_version／object? · Decision · P1/P6/P7 · 学校决定的版本/学年记录；SRC-008/009 · M009:学年及版本 · L2 · NA/S；不同年度必须分开。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F026",
      "label": "change_reason／string? · Review · P6",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F026；change_reason／string? · Review · P6 · 本人说明/学校核查事件；SRC-006/015 · M010:变化内容 · L3/L4 · NA；需变化时 N，事实裁量 H。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F027",
      "label": "target_case_decision_ref／ref? · Review · P2/P7",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F027；target_case_decision_ref／ref? · Review · P2/P7 · 校方受理编号/原案正式记录；SRC-004/009 · M011/M012/M013:所指版本 · L2 · 条件 N/S；防止补错案卷、错撤旧决议。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F028",
      "label": "withdrawal_or_objection_claim／string? · Review · P7",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F028；withdrawal_or_objection_claim／string? · Review · P7 · 经本人身份核验的撤回/异议请求；SRC-004/009 · M012/M013:请求正文 · L3 · NA；触发时 N，是否合法生效 H。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F029",
      "label": "evaluation_actor_ref／ref? · Evaluation · P3",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F029；evaluation_actor_ref／ref? · Evaluation · P3 · 正式组成的评议组/真实签认；SRC-002/004/015 · M015:名单与签认 · L2 · 后续才有；无凭证 H/S，不用上传者自证。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F030",
      "label": "evaluation_recommendation／object? · Evaluation · P3",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F030；evaluation_recommendation／object? · Evaluation · P3 · 正式班级/专业评议记录；SRC-002/015 · M015:意见区/时间 · L3 · 后续才有；拟意见不当终局。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F031",
      "label": "college_review_actor_outcome／object? · Evaluation · P4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F031；college_review_actor_outcome／object? · Evaluation · P4 · 学院真实授权的审查记录；SRC-002/015 · M016:审核人/建议 · L2/L3 · 后续才有；授权不明 H。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F032",
      "label": "notice_process_and_objection／object? · Evaluation · P4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F032；notice_process_and_objection／object? · Evaluation · P4 · 学院依法依规最小范围公示/异议记录；SRC-002/004/015 · M017:公示元数据，非私密名单全文 · L2/L3 · 后续才有；公开范围/天数 P。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F033",
      "label": "review_channel_record／ref? · Review · P4/P7",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F033；review_channel_record／ref? · Review · P4/P7 · 官方公示/受理通知、真实受理回执；SRC-004/014 · M013/M020:渠道和回执 · L2 · P/S；不得造申诉期限或承办人。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F034",
      "label": "formal_signer_authority／ref? · Decision · P5",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F034；formal_signer_authority／ref? · Decision · P5 · 真实校方授权及签发记录；SRC-001/004/005 · M018:签发者与印证 · L2 · 后续才有；未知授权 NEEDS_HUMAN_DECISION。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F035",
      "label": "decision_effective_window／object? · Decision · P5/P8",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F035；decision_effective_window／object? · Decision · P5/P8 · 学校正式决定/学年效力记录；SRC-001/009 · M018/M019:生效/有效期 · L2/L3 · 后续才有；无明示不推定跨年有效。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F036",
      "label": "formal_status_version／object? · Decision · P5/P6/P8",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F036；formal_status_version／object? · Decision · P5/P6/P8 · 学校正式结果主键及版本链；SRC-004/005 · M018/M019/M020:状态/修订 · L3 · 后续才有；拟状态不得改写正式状态。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F037",
      "label": "downstream_purpose_authorization／object? · DownstreamUse · P8",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F037；downstream_purpose_authorization／object? · DownstreamUse · P8 · 受信任的下游用途/角色/字段授权；SRC-008/016 · M021:访问请求审计 · L2 · 未授权拒绝，非申请人的“缺件”。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F038",
      "label": "material_lineage／object · Evidence · P1 起",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F038；material_lineage／object · Evidence · P1 起 · 系统保管的来源文件哈希/版本/归属；技术线索 SRC-012 · M024:源版本/替换链 · L2/L3 · N：不许失去旧版本但不可用旧识别结论替换新件。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F039",
      "label": "applicability_config／object · Case · P0/P2",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F039；applicability_config／object · Case · P0/P2 · 经校方确认的学院/学段/批次政策适用矩阵；SRC-001/014/015 · M003:配置及出处 · L1 · P：未核就只推荐人工校验，不启硬门槛。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F040",
      "label": "evidence_quality_conflict／enum+ref · Evidence · P2–P8",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F040；evidence_quality_conflict／enum+ref · Evidence · P2–P8 · 受控分析输出+人工核验意见；SRC-009/016 · M024:材料冲突链；M014:核验意见 · L2/L3 · 记录 CONFLICT/UNREADABLE/SOURCE_UNAVAILABLE 等，绝不推定伪造。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "本人提出申请及真实承诺；学生持有校方认定申请表或获确认的电子表",
      "purpose": "原研究材料槽 M001：本人提出申请及真实承诺；学生持有校方认定申请表或获确认的电子表；P1／当（申请人）；经校方确认的线上有效申请记录；2026 表附件未取得，不得假定具体签章栏；F003/F010/F014–F018；SRC-003/007/009；同一学生本学年签名与表版本；无受理申请先 NEEDS_MATERIAL，签署方式不明 POLICY_UNCONFIRMED，扫描不可读 UNREADABLE",
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
        "本人提出申请及真实承诺；学生持有校方认定申请表或获确认的电子表",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "在籍身份、学段和学院归属；学籍主管系统正式记录",
      "purpose": "原研究材料槽 M002：在籍身份、学段和学院归属；学籍主管系统正式记录；P1、P6、P7／当（校）；校方授权人员核验的学籍证明/正式导出；学生证照片仅供索引；F002–F006/F011；SRC-002/004/006/015；记录查询时间与学生唯一键；无接口 SOURCE_UNAVAILABLE，同名冲突 CONFLICT，不逼学生上传本可校内核的资料",
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
        "在籍身份、学段和学院归属；学籍主管系统正式记录",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "适用规章、当期批次、时间窗；校资助部门/研工等官方通知及规章",
      "purpose": "原研究材料槽 M003：适用规章、当期批次、时间窗；校资助部门/研工等官方通知及规章；P0 起／当（校）；获校方核章/确认的权威纸质文件；不是他校网站或历史公告；F007–F009/F039；SRC-001/003/014/015；绑定学院/学段/学年与制度修订；找不到 2026 通知记 POLICY_UNCONFIRMED，学校存储失联记 SOURCE_UNAVAILABLE",
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
        "适用规章、当期批次、时间窗；校资助部门/研工等官方通知及规章",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "家庭困难事实陈述细节；申请人声明/必要时附页",
      "purpose": "原研究材料槽 M004：家庭困难事实陈述细节；申请人声明/必要时附页；P1/P2／条；申请表 M001 已充分包含则不另要一份；仅保留业务必需的家情摘要；F016–F018；SRC-009/015/016；绑定表及其补充版本；触发且必要内容缺失 NEEDS_MATERIAL；无需完整家庭成员私密资料",
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
        "家庭困难事实陈述细节；申请人声明/必要时附页",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "法定/政策性特殊困难身份事实；有关机关出具的低保、特困、建档等类别证明或经授权可信记录",
      "purpose": "原研究材料槽 M005：法定/政策性特殊困难身份事实；有关机关出具的低保、特困、建档等类别证明或经授权可信记录；P1/P2／条；可验机关权威状态或校方核验摘要；仅 SRC-015 本学院研究生的特殊群体证明分支有明确依据；F019/F022；SRC-015 第14条、SRC-016；每次核发/有效期及学生关联；该学院触发缺件 NEEDS_MATERIAL，其他学院必要性 POLICY_UNCONFIRMED；核验接口不可达 SOURCE_UNAVAILABLE",
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
        "法定/政策性特殊困难身份事实；有关机关出具的低保、特困、建档等类别证明或经授权可信记录",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "残疾、重大疾病/照护等直接相关负担；学生自愿提供经学校按适用规则要求的证明",
      "purpose": "原研究材料槽 M006：残疾、重大疾病/照护等直接相关负担；学生自愿提供经学校按适用规则要求的证明；P1/P2/P6／条；合法核验摘要/经受权人员查验原件并只记录结论，避免拷贝病历全文；不是所有申请必交；F018/F019/F022；SRC-009/015/016；限特定事件及真实主体、L4 加密访问；若适用性不明 POLICY_UNCONFIRMED，可读问题 UNREADABLE，不公开病情",
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
        "残疾、重大疾病/照护等直接相关负担；学生自愿提供经学校按适用规则要求的证明",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "灾害、事故或突发事件与日期；本人材料或有权部门证明",
      "purpose": "原研究材料槽 M007：灾害、事故或突发事件与日期；本人材料或有权部门证明；P1/P2/P6／条；政府灾害记录、有关单位有效核验意见；事实无需一次要求多种重复附件；F020–F022；SRC-006/009/016；原事发时点、关联学生和事件；条件触发但无必要证据 NEEDS_MATERIAL，签发核验源不可用 SOURCE_UNAVAILABLE",
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
        "灾害、事故或突发事件与日期；本人材料或有权部门证明",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "真实代理权；监护人/代理人持有效授权与身份核验材料",
      "purpose": "原研究材料槽 M008：真实代理权；监护人/代理人持有效授权与身份核验材料；P1/P7／条；法规允许的监护关系或校方认可的电子委托；不得凭上传家长姓名当授权；F011/F012；SRC-009/016（校本代办待核）；指明授权对象、范围、期限和案卷；可否代办仍 POLICY_UNCONFIRMED，未核不得以代理角色提交决定",
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
        "真实代理权；监护人/代理人持有效授权与身份核验材料",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "上一学年/既有正式认定事实；学校资助档案或有权签发记录",
      "purpose": "原研究材料槽 M009：上一学年/既有正式认定事实；学校资助档案或有权签发记录；P1/P6/P7／条（校）；校内授权结果查询；学生持旧证明仅供定位；F023–F025；SRC-005/008/009；旧学年/等级/签发版本独立保存；源缺 SOURCE_UNAVAILABLE，不得直接延期为当前有效结果",
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
        "上一学年/既有正式认定事实；学校资助档案或有权签发记录",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "动态调整或情况变更声明；本人/受理人书面或有效电子申请",
      "purpose": "原研究材料槽 M010：动态调整或情况变更声明；本人/受理人书面或有效电子申请；P6／条；校方可信变更登记或经核实的通知；按发生事实匹配 M005–M007；F020/F021/F026；SRC-006/009/015；记录变更前后、申请时点和所指决定；动态触发无说明 NEEDS_MATERIAL，生效裁量留人工",
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
        "动态调整或情况变更声明；本人/受理人书面或有效电子申请",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "具体补件及替换证据；申请人补交材料+学校补件记录",
      "purpose": "原研究材料槽 M011：具体补件及替换证据；申请人补交材料+学校补件记录；P2／条；原 M 的新版，原始校内证据重读；不另建重复认定结论；F027/F038/F040；SRC-002/009（现行补件细则待核）；old_version→new_version 与缺口 ID；缺件 NEEDS_MATERIAL，不可读 UNREADABLE，旧事实结论作待重审标记",
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
        "具体补件及替换证据；申请人补交材料+学校补件记录",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "本人真实撤回意愿与目标；本人/合法代理的撤回申请",
      "purpose": "原研究材料槽 M012：本人真实撤回意愿与目标；本人/合法代理的撤回申请；P7／条；经受权校务会话确认的撤回记录；不可用删除文件代替；F010/F027/F028；SRC-009（本校程序未知）；所指原申请及材料版本；请求缺失 NEEDS_MATERIAL，是否能撤回/撤销结果 POLICY_UNCONFIRMED + 人工",
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
        "本人真实撤回意愿与目标；本人/合法代理的撤回申请",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "拟结论或正式结论异议事项；学生/校规允许的申请主体提交复核请求",
      "purpose": "原研究材料槽 M013：拟结论或正式结论异议事项；学生/校规允许的申请主体提交复核请求；P7／条；官方渠道真实受理回执与争议事实说明；不能把模型负面提示自动当申诉；F027/F028/F033；SRC-004/009/014；目标拟案/已生效决定及异议时间；申诉期不明 POLICY_UNCONFIRMED，已提交争议须留审计链",
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
        "拟结论或正式结论异议事项；学生/校规允许的申请主体提交复核请求",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "受权人员事实核验纪要；校方查验员形成记录",
      "purpose": "原研究材料槽 M014：受权人员事实核验纪要；校方查验员形成记录；P2/P6／后（核验之后）；若授权系统已提供验证状态即可记核验 ID，不复印第三方敏感证明；F017/F022/F040；SRC-009/015/016；留核验人、校验日期、关联的 M 版本；不可由 OCR 自动伪造核验员签名；无授权 NEEDS_HUMAN_DECISION",
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
        "受权人员事实核验纪要；校方查验员形成记录",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "班级/专业评议程序和意见；评议组正式记录",
      "purpose": "原研究材料槽 M015：班级/专业评议程序和意见；评议组正式记录；P3／后；授权电子评议系统的可信结果；只记录必要建议和组成证据；F006/F029/F030；SRC-002/004/015；绑定本年度实际评议组织、记录人、时间、案卷；P1 缺它不构成缺件；P3 源缺 SOURCE_UNAVAILABLE",
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
        "班级/专业评议程序和意见；评议组正式记录",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "学院审核建议与审核者；学院有权工作人员的审查记录",
      "purpose": "原研究材料槽 M016：学院审核建议与审核者；学院有权工作人员的审查记录；P4／后；正式学院电子审批结果；普通辅导员聊天截图不足以证明院级授权；F031；SRC-002/004/015；学院、批次、签署人及评议版本；P1 不要求；授权不清 NEEDS_HUMAN_DECISION",
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
        "学院审核建议与审核者；学院有权工作人员的审查记录",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "受控公示和异议受理程序；学院/相关部门的公示过程记录",
      "purpose": "原研究材料槽 M017：受控公示和异议受理程序；学院/相关部门的公示过程记录；P4／后；公示公告元数据、受理窗口/脱敏统计，可不存详细家情或公开名单副本；F032/F033；SRC-002/004/015/016；绑定名单版本、发布范围、起止日及异议结果；具体天数按当期政策 POLICY_UNCONFIRMED，不能先强制收件",
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
        "受控公示和异议受理程序；学院/相关部门的公示过程记录",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "有权部门正式认定决定；学校受权签发文件/正式记录",
      "purpose": "原研究材料槽 M018：有权部门正式认定决定；学校受权签发文件/正式记录；P5/P6复核后／后；有效、可追溯的校内电子决定；不要求既交签发文件又重复上传同一条数据库记录；F034–F036；SRC-001/004/005/015；学生/学年/等级/签发者/生效时段/版本；签发链未知 NEEDS_HUMAN_DECISION，P1 不需此件",
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
        "有权部门正式认定决定；学校受权签发文件/正式记录",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "正式结果建档与可查询版本；学校资助权威数据库",
      "purpose": "原研究材料槽 M019：正式结果建档与可查询版本；学校资助权威数据库；P5/P8／后（校）；对同一 M018 决定的受控索引/验真响应，不额外强迫申请人上传；F024/F035/F036；SRC-005/008/009；记录可信主键及查询时点；库不可达 SOURCE_UNAVAILABLE，拟认定结果不得冒充最终",
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
        "正式结果建档与可查询版本；学校资助权威数据库",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "撤回/申诉/复核正式处理结果；有权受理或复核主体的决定",
      "purpose": "原研究材料槽 M020：撤回/申诉/复核正式处理结果；有权受理或复核主体的决定；P7/P6办结／后；真实校方受理/决定记录；如复核导致新认定，链接新版 M018/M019；F026–F028/F033/F036；SRC-004/009（具体权限待核）；关联旧决定和新处理版本；缺校方决定 NEEDS_HUMAN_DECISION，不由 AI 自动结束复核",
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
        "撤回/申诉/复核正式处理结果；有权受理或复核主体的决定",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "下游目的授权和结果查询审计；经认证的奖助系统/校方授权人",
      "purpose": "原研究材料槽 M021：下游目的授权和结果查询审计；经认证的奖助系统/校方授权人；P8／后；可核查的授权查询日志，仅返回有效学年的必要状态/等级；F024/F035–F037；SRC-008/016；记查询人、用途、范围、目标和结果版本；无权限拒绝访问，绝不传家情原件",
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
        "下游目的授权和结果查询审计；经认证的奖助系统/校方授权人",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "姓名/学号不一致的权威更正；学籍/身份管理处正式更名或合并证明",
      "purpose": "原研究材料槽 M022：姓名/学号不一致的权威更正；学籍/身份管理处正式更名或合并证明；P2/P7／条（校为主）；学校受权学籍更正记录；申请人身份证明只作为可核线索；F002/F003/F022/F040；SRC-009/016；保留原/新标识及生效时点；冲突未消除前 CONFLICT，不要合并同名两人",
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
        "姓名/学号不一致的权威更正；学籍/身份管理处正式更名或合并证明",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "在籍状态变化事件；教务/研究生学籍权威通知",
      "purpose": "原研究材料槽 M023：在籍状态变化事件；教务/研究生学籍权威通知；P6/H／条（校）；正式学籍变动记录及生效日期；学生口头自述仅为线索；F005/F021/F026；SRC-006/015；绑定变动前后状态和原认定版本；数据源不可达 SOURCE_UNAVAILABLE，不能仅凭退学截图自动取消认定",
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
        "在籍状态变化事件；教务/研究生学籍权威通知",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "案卷/材料来源和版本流水；受控 Case/证据服务",
      "purpose": "原研究材料槽 M024：案卷/材料来源和版本流水；受控 Case/证据服务；P1 起／当（系统内部）；受控业务日志，不要求学生上传 JSON 或手写记录；F001/F007/F008/F010/F011/F013/F027/F038/F040；SRC-012（技术线索）；保存原文件校验和、替换链、变更者、审核旧事实有效性；链断裂 CONFLICT 并人工查证",
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
        "案卷/材料来源和版本流水；受控 Case/证据服务",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "必要时受权访谈、实地核验意见；学校指定工作人员",
      "purpose": "原研究材料槽 M025：必要时受权访谈、实地核验意见；学校指定工作人员；P2/P6／条且后产生；授权核实记录；仅在学校制度和个案必要性允许时执行，非普遍入户要求；F017/F018/F022/F040；SRC-009/015/016；单次核验目的、时点、人员、最小记录；制度不明 POLICY_UNCONFIRMED，不由算法“主动调查”",
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
        "必要时受权访谈、实地核验意见；学校指定工作人员",
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
          "title": "规则适用性",
          "requirement": "【研究级核验标准；非校方正式规则】R001 R001 [P] P0 规则适用性 | T：有原始规章且校/院/学段/学年相符；F：明确不在该文件授权范围；U：条款不全或效力未知 | SRC-001/010/014/015；F004/F006/F007/F009/F039；M002/M003 | 对原文署名/施行/授权范围与申请对象逐维匹配；O 优先；2024 校规全文缺失不作全校细则推断 | T→PASS_FACT 仅确认适用来源；F→NOT_APPLICABLE 于该政策分支并转人工重路由；U→POLICY_UNCONFIRMED→校资助中心/研工部",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "批次与时限",
          "requirement": "【研究级核验标准；非校方正式规则】R002 R002 [P] P0 批次与时限 | T：学校确认当期批次和实际收件日对应；F：证实非本批次/超出窗口；U：2026 窗口或补认例外未取得 | SRC-002/003/014；F007/F008/F013/F039；M003/M024 | 当期通知发布时间/生效日与系统受理时间比对；历史 2024-09-09 不可沿用 | T→PASS_FACT；F→NEEDS_HUMAN_DECISION 是否准许补认；U→POLICY_UNCONFIRMED→批次管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "学生身份绑定",
          "requirement": "【研究级核验标准；非校方正式规则】R003 R003 [E/D] P1/P7 学生身份绑定 | T：学号、姓名、学段、案卷属于同一人；F：至少一个权威唯一标识矛盾；U：学籍不可得 | SRC-002/004/009/016；F001–F004/F038；M001/M002/M022/M024 | O 学籍唯一键与申请书签名/案卷三方比对，记录查询时点；改名需核 M022 | T→PASS_FACT；F→CONFLICT→学籍主管；U→SOURCE_UNAVAILABLE→学校数据管理员，不将重名判造假",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "提交人与代理授权",
          "requirement": "【研究级核验标准；非校方正式规则】R004 R004 [G/D/P] P1/P7 提交人与代理授权 | T：可信会话为本人或校方认可有效代理；F：会话与目标不符/代理范围不符；U：代理制度与凭据未核 | SRC-009/016；F011/F012/F027；M002/M008/M012/M013/M024 | Main/Host 真实会话与授权期间、对象、行为匹配；O/V，Renderer actor 与文件落款仅作 S | T→PASS_FACT；F→CONFLICT 并阻止代签→校方身份管理员；U→POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→受理人",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "学段与在籍状态",
          "requirement": "【研究级核验标准；非校方正式规则】R005 R005 [E/P] P1/P6 学段与在籍状态 | T：学籍状态、培养类型符合已核适用制度；F：可信记录明确超出该已核规则；U：在籍或资格范围未知 | SRC-002/004/006/015；F004–F006/F039；M002/M003/M023 | 学籍 O 的有效日期和制度学段匹配；SRC-015 第4条只限定该学院研究生分支 | T→PASS_FACT；F→该分支 NOT_APPLICABLE 并人工确认其他政策；U→SOURCE_UNAVAILABLE 或 POLICY_UNCONFIRMED→学籍/资助主管",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R006",
          "title": "认定申请事实",
          "requirement": "【研究级核验标准；非校方正式规则】R006 R006 [E/P] P1 认定申请事实 | T：存在学生本次真实有效申请；F：尚未提交本次必要申请；U：现行表式/电子替代效力未知 | SRC-003/007/009/017；F010/F013/F014/F016；M001/M024 | 原图与受理登记相互印证，核目标学年及申请版本；2024 新生表不替代 2026 标准 | T→PASS_FACT；F→NEEDS_MATERIAL→本人；U→POLICY_UNCONFIRMED→受理部门，不索要后续院章",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "本人承诺与签认",
          "requirement": "【研究级核验标准；非校方正式规则】R007 R007 [E/P] P1 本人承诺与签认 | T：适用表要求的本人/合法监护签认可读且身份匹配；F：当期确需且缺签署；U：电子签名/代理签署规则未核 | SRC-007/009/003；F003/F011/F015；M001/M008/M024 | 对本人承诺、签字区与身份/受理版本匹配；扫描签名不等于可信登录；2025 宣传“不用基层盖章”不推定所有表格项 | T→PASS_FACT；F→NEEDS_MATERIAL→本人；U→POLICY_UNCONFIRMED→资助受理人",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "家情陈述对应",
          "requirement": "【研究级核验标准；非校方正式规则】R008 R008 [G/E] P2 家情陈述对应 | T：所陈困难事实与本次声明、证据位置相互对应；F：叙述与有效证据存在具体矛盾；U：该事实尚无必要数据或不足解释 | SRC-009/015/016；F016–F018/F038/F040；M001/M004/M014 | 仅同一家庭事件和期间逐项对照 S/V，OCR 是 A；不把家庭收入一个数字映射困难等级 | T→PASS_FACT；F→CONFLICT→核验员；U：非必须 NOT_APPLICABLE，确属当前应补说明才 NEEDS_MATERIAL→本人",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "特殊群体证明分支",
          "requirement": "【研究级核验标准；非校方正式规则】R009 R009 [E/P] P2 特殊群体证明分支 | T：符合 SRC-015 第4条的学院研究生且申报其第14条特殊群体；F：该特定分支不触发；U：所属学院/特殊类别/证明效力未知 | SRC-015 第4/14条、SRC-001/014；F004/F006/F019/F022/F039；M002/M003/M005/M006 | 按该学院政策比较类别、有效签发时间、学生关联，O/V 核验；非特殊群体该学院明确不另强制证明 | T 且证据匹配→PASS_FACT，该院应交未交→NEEDS_MATERIAL；F→NOT_APPLICABLE；U→POLICY_UNCONFIRMED→所属学院，不能全校套用",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "突发状况与发生日期",
          "requirement": "【研究级核验标准；非校方正式规则】R010 R010 [G/E] P2/P6 突发状况与发生日期 | T：本案称灾害/事故/疾病等变化且证据与事发日对应；F：没有此类主张；U：时间、签发或真实性不能核 | SRC-006/009/015；F020/F021/F022/F026；M007/M010/M014/M025 | 校方已核事件或本人材料逐时间轴核对；只查该事件及必要证据，O/V/S | T→PASS_FACT（事件事实）；F→NOT_APPLICABLE；U→UNREADABLE/CONFLICT/SOURCE_UNAVAILABLE 依成因→有权核验员；是否提升档次另人工",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "证明出具者与效期",
          "requirement": "【研究级核验标准；非校方正式规则】R011 R011 [G/D] P2 证明出具者与效期 | T：证明来源可追溯、签发机关权限及覆盖期间足以支持具体事实；F：权威信息与证明日期/主体矛盾；U：核验源未接通或状态无法确定 | SRC-009/015/016；F019–F022/F038/F040；M005/M006/M007/M014/M025 | 查原件页/签发单位/验证结果及查询时间；O/V>S>A，过期材料只能证明历史事实 | T→PASS_FACT；F→CONFLICT→核验员；U→SOURCE_UNAVAILABLE（权威源断）或 NEEDS_HUMAN_DECISION（真伪待核）→学校",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "可读性",
          "requirement": "【研究级核验标准；非校方正式规则】R012 R012 [D] P1–P7 可读性 | T：当前目标页/图层必要字句可读取且可定位；F：该材料本次不使用；U：模糊、缺页、文件损坏、抽取质量不足 | SRC-009/016；F014–F022/F040；M001/M004–M008/M011–M014/M022 | 原始页、bbox/页码与 OCR 置信校验；OCR 解析失败不说明材料未提供 | T→PASS_FACT；F→NOT_APPLICABLE；U→UNREADABLE→材料持有人/学校核验员，保护已可读部分的结果",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R013",
          "title": "跨材料身份/版本冲突",
          "requirement": "【研究级核验标准；非校方正式规则】R013 R013 [G/D] P2 跨材料身份/版本冲突 | T：身份、同一事实和来源版本可解释且相符；F：确定的同一生效期间事实/主体冲突；U：相关官方更名或原始记录不可得 | SRC-009/016；F002/F003/F022/F038/F040；M001/M002/M005/M009/M011/M022/M024 | 以可信主键、事实期间、替换链对照；不同年度不因档次不同直接判冲突 | T→PASS_FACT；F→CONFLICT→学籍/资助核验员；U→SOURCE_UNAVAILABLE 或人工，不能自动定性失信",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R014",
          "title": "定向补件与旧事实失效",
          "requirement": "【研究级核验标准；非校方正式规则】R014 R014 [D] P2 定向补件与旧事实失效 | T：M011 新版本关联原缺口和旧文件，重算其依赖字段；F：未发生替换；U：替换对象/旧版缺失 | SRC-009/012（技术线索）；F001/F027/F038/F040；M011/M024 | 哈希、sourceVersion、targetCase 和受影响 R 列表比对；旧事实核验标待重审，保留历史审计 | T→受影响事实核完才 PASS_FACT；F→NOT_APPLICABLE；U→CONFLICT→案卷核验人，不静默更新正式 M018",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "跨年旧决定",
          "requirement": "【研究级核验标准；非校方正式规则】R015 R015 [G/P] P1/P6 跨年旧决定 | T：旧学校有效决定归属与历史学年/版本吻合；F：没有旧正式认定；U：校方历史档案失联或只有截图 | SRC-005/008/009；F023–F025/F035/F036；M009/M019/M024 | O 原始决议及有效期核对，按年重建适用性；本学年续期条件缺现行校本依据 | T→PASS_FACT 仅“存在历史结果”；F→NOT_APPLICABLE（首次）；U→SOURCE_UNAVAILABLE→资助中心；是否当年沿用→POLICY_UNCONFIRMED",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "评议组织与真实记录",
          "requirement": "【研究级核验标准；非校方正式规则】R016 R016 [E/P] P3 评议组织与真实记录 | T：正式班级/专业评议记录存在、学生和学年对应、签认可信；F：该阶段尚未开始；U：评议组授权/人数/回避或记录真实性未核 | SRC-002/004/015；F006/F029/F030；M003/M015/M024 | V/O 评议记录主键、产生时点、成员授权匹配；不要以学生上传的名单图当审批 | T→PASS_FACT 仅评议程序事实；F→NOT_APPLICABLE 于 P1/P2；U→POLICY_UNCONFIRMED 或 NEEDS_HUMAN_DECISION→学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "学院审核建议",
          "requirement": "【研究级核验标准；非校方正式规则】R017 R017 [E/P] P4 学院审核建议 | T：学院真实授权审查记录与当前评议版本一致；F：尚未进入 P4；U：审核者权限/流程缺失 | SRC-002/004/015；F029–F031/F038；M015/M016/M024 | 比对评议版本、学院、审核人、时间、可信签认；院级拟结论不等同学校正式签发 | T→PASS_FACT；F→NOT_APPLICABLE；U→NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE→学院有权人",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "公示及隐私控制",
          "requirement": "【研究级核验标准；非校方正式规则】R018 R018 [E/G/P] P4 公示及隐私控制 | T：适用范围内受控公示流程记录存在，未公开家庭敏感信息；F：尚未到公示阶段；U：公示时限、合法范围、异议记录未确认 | SRC-002/004/009/015/016；F032/F033/F039；M003/M017 | 核发布时间、版次、范围、反馈通道和脱敏字段；不保存病历/身份证全文作公示凭据 | T→PASS_FACT（流程）；F→NOT_APPLICABLE；U→POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→学院/校资助部门；越权公开须人工安全处置",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "学校正式决定与签发权",
          "requirement": "【研究级核验标准；非校方正式规则】R019 R019 [E/P] P5 学校正式决定与签发权 | T：已取得匹配学生/学年、校方有权签发、有效状态与版本的原始记录；F：仍在拟评议/院审阶段；U：仅见盖章图片、签发授权或校方记录未核 | SRC-001/004/005/015；F002/F007/F031/F034–F036；M016/M018/M019 | 校规授权链+学校可信原始决定/库记录双核；正式决定与拟意见层级隔离 | T→PASS_FACT 只证明“有有效学校决定”；F→NOT_APPLICABLE 于尚未办理 P5；U→NEEDS_HUMAN_DECISION 或 SOURCE_UNAVAILABLE→学校授权签发/档案员，绝不 AI 批准",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "下游复用授权",
          "requirement": "【研究级核验标准；非校方正式规则】R020 R020 [G/D] P8 下游复用授权 | T：真实下游用途、调用人、学生、学年、正式结果及字段最小范围全匹配；F：无下游申请或非该授权用途；U：正式结果源/下游权限无法核实 | SRC-008/016；F002/F007/F024/F035–F037；M018/M019/M021 | 以 O 最终结果和可信 ACL/目的审计，必要字段才回应；不复制 M005–M007 | T→PASS_FACT 并允许权限化事实查询；F→NOT_APPLICABLE/拒绝越权访问；U→SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION→授权管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "动态变更请求",
          "requirement": "【研究级核验标准；非校方正式规则】R021 R021 [E/P] P6 动态变更请求 | T：本人或校方依据真实变化提出调整，指向旧状态/事件期间；F：无变更而只是续认；U：春季窗口、具体表式、事件可信度待核 | SRC-006/009/015；F020/F021/F023/F026/F038；M009/M010/M014/M025 | 旧决定版本、事发日及变化说明联查；SRC-015 仅该学院可支持秋季/春季框架 | T→PASS_FACT 仅“调整请求及事件已登记”，正式档次→NEEDS_HUMAN_DECISION；F→NOT_APPLICABLE；U→POLICY_UNCONFIRMED→校方资助主管",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "撤回申请的真实性与效力",
          "requirement": "【研究级核验标准；非校方正式规则】R022 R022 [G/P] P7 撤回申请的真实性与效力 | T：受权本人明确指向未决申请提出撤回；F：没有撤回请求；U：已决案件/代理撤回范围或受理截止不明 | SRC-009/014/016；F010–F012/F027/F028/F036；M008/M012/M018/M020/M024 | 核登录人、原案状态、请求时间/版本；区分撤回申请与撤销有权决定 | T→PASS_FACT 仅申请事实，有效撤回须授权人 NEEDS_HUMAN_DECISION；F→NOT_APPLICABLE；U→POLICY_UNCONFIRMED→受理机构，不删除历史",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "异议与复核关联",
          "requirement": "【研究级核验标准；非校方正式规则】R023 R023 [E/P] P7 异议与复核关联 | T：真实异议指向拟意见或正式结果的可核版本；F：无异议；U：争议时限/主体资格/承办权限未知 | SRC-004/009/014/015；F027/F028/F033/F036；M013/M015/M017/M018/M020 | 依原目标签发级别确定受理角色，核原版和回执；2024 公示期不是 2026 申诉期限 | T→PASS_FACT 仅收件事实，复核结论→NEEDS_HUMAN_DECISION；F→NOT_APPLICABLE；U→POLICY_UNCONFIRMED→学院/学校法定承办者",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R024",
          "title": "学籍变化影响复查",
          "requirement": "【研究级核验标准；非校方正式规则】R024 R024 [E/P] P6 学籍变化影响复查 | T：权威学籍事件与既有认定同人且时点相关；F：无真实学籍变化；U：学籍变更生效日期/库不可达 | SRC-006/009/015；F002/F005/F021/F023/F026/F036；M002/M009/M023/M024 | 以学籍 O 生效时段关联学校认定 O，与奖助发放属于不同决定链 | T→PASS_FACT 仅确认复查触发；资格/资金后果→NEEDS_HUMAN_DECISION；F→NOT_APPLICABLE；U→SOURCE_UNAVAILABLE/CONFLICT→学籍和资助部门",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R025",
          "title": "重复办理/跨模板边界",
          "requirement": "【研究级核验标准；非校方正式规则】R025 R025 [D] P1/P8 重复办理/跨模板边界 | T：发生跨案/跨模板复用请求且学年、学生及正式决定版本一致；F：没有复用请求；U：目标权威决定或 G50/R02 语义尚未核 | SRC-008/012/013；F001/F007/F010/F027/F036/F037/F038；M009/M018/M019/M021/M024 | 关联 case–decision–sourceVersion、下游目的、技术目录；不能用 G50 材料核验结果伪装 S03 决定 | T 且权限符合→PASS_FACT；若版本或主体矛盾→CONFLICT；F→NOT_APPLICABLE；U→POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→目录 Owner/学校负责人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "最小化/敏感信息权限",
          "requirement": "【研究级核验标准；非校方正式规则】R026 R026 [G] P1–P8 最小化/敏感信息权限 | T：只处理业务必要 L3/L4 数据且访问/导出目的和角色匹配；F：不涉及私密家情（仍正常日志）；U：敏感数据接收方/合法处理基础/传输路径未核 | SRC-009/016；F011/F016–F019/F022/F032/F037/F038；M004–M007/M014/M017/M021/M024 | 根据法律的最小化、合法基础、告知及授权范围查数据流；不假定云端模型可接收全文 | T→PASS_FACT（访问合规事实）；F→NOT_APPLICABLE 于特定敏感处理分支；U→NEEDS_HUMAN_DECISION，越权访问立即阻断→个人信息负责人",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "local-p0",
      "name": "P0 政策与批次确认",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-p1",
      "workflowOwner": "local"
    },
    {
      "id": "local-p1",
      "name": "P1 本人申请",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-p2",
      "workflowOwner": "local"
    },
    {
      "id": "local-p2",
      "name": "P2 事实核验与补件",
      "kind": "supplement-wait",
      "executorRole": "reviewer",
      "nextStageId": "local-p3",
      "returnToStageId": "local-p1",
      "workflowOwner": "local"
    },
    {
      "id": "local-p3",
      "name": "P3 班级/年级/专业评议",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-p4",
      "workflowOwner": "local"
    },
    {
      "id": "local-p4",
      "name": "P4 学院审核与隐私保护公示",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-p5",
      "workflowOwner": "local"
    },
    {
      "id": "local-p5",
      "name": "P5 校级或研究生归口审核及入库",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-p6",
      "workflowOwner": "local"
    },
    {
      "id": "local-p6",
      "name": "P6 动态复查/补认",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-p7",
      "workflowOwner": "local"
    },
    {
      "id": "local-p7",
      "name": "P7 撤回、异议与复核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-p8",
      "workflowOwner": "local"
    },
    {
      "id": "local-p8",
      "name": "P8 下游授权复用（本地人工复核；不代表校方正式决定）",
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
  "templateId": "S03-T06",
  "name": "家庭经济困难学生资格认定审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S03-T06.md",
  "sourceDocumentSha256": "bc954bf1ae59a77f38f6ef971e6e09aa8f90e1aa1fc877737f04a9db0f576c38",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-22",
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
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-006",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-007",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-008",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-009",
      "status": "GENERAL-RESEARCH"
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
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-013",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-014",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-015",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-016",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-017",
      "status": "CDUT-VERIFIED"
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
        "F004",
        "F006",
        "F007",
        "F009",
        "F039"
      ],
      "materialSlotIds": [
        "M002",
        "M003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F007",
        "F008",
        "F013",
        "F039"
      ],
      "materialSlotIds": [
        "M003",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F001",
        "F002",
        "F003",
        "F004",
        "F038"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M022",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-009"
      ],
      "fieldIds": [
        "F011",
        "F012",
        "F027"
      ],
      "materialSlotIds": [
        "M002",
        "M008",
        "M012",
        "M013",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-002",
        "SRC-015"
      ],
      "fieldIds": [
        "F004",
        "F005",
        "F006",
        "F039"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M023"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-003"
      ],
      "fieldIds": [
        "F010",
        "F013",
        "F014",
        "F016"
      ],
      "materialSlotIds": [
        "M001",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-007"
      ],
      "fieldIds": [
        "F003",
        "F011",
        "F015"
      ],
      "materialSlotIds": [
        "M001",
        "M008",
        "M024"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-009"
      ],
      "fieldIds": [
        "F016",
        "F017",
        "F018",
        "F038",
        "F040"
      ],
      "materialSlotIds": [
        "M001",
        "M004",
        "M014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-015"
      ],
      "fieldIds": [
        "F004",
        "F006",
        "F019",
        "F022",
        "F039"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M005",
        "M006"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-006"
      ],
      "fieldIds": [
        "F020",
        "F021",
        "F022",
        "F026"
      ],
      "materialSlotIds": [
        "M007",
        "M010",
        "M014",
        "M025"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-009"
      ],
      "fieldIds": [
        "F019",
        "F020",
        "F021",
        "F022",
        "F038",
        "F040"
      ],
      "materialSlotIds": [
        "M005",
        "M006",
        "M007",
        "M014",
        "M025"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-009"
      ],
      "fieldIds": [
        "F014",
        "F015",
        "F016",
        "F017",
        "F018",
        "F019",
        "F020",
        "F021",
        "F022",
        "F040"
      ],
      "materialSlotIds": [
        "M001",
        "M004",
        "M005",
        "M006",
        "M007",
        "M008",
        "M011",
        "M012",
        "M013",
        "M014",
        "M022"
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
        "F002",
        "F003",
        "F022",
        "F038",
        "F040"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M005",
        "M009",
        "M011",
        "M022",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-009"
      ],
      "fieldIds": [
        "F001",
        "F027",
        "F038",
        "F040"
      ],
      "materialSlotIds": [
        "M011",
        "M018",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-005"
      ],
      "fieldIds": [
        "F023",
        "F024",
        "F025",
        "F035",
        "F036"
      ],
      "materialSlotIds": [
        "M009",
        "M019",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F006",
        "F029",
        "F030"
      ],
      "materialSlotIds": [
        "M003",
        "M015",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F029",
        "F030",
        "F031",
        "F038"
      ],
      "materialSlotIds": [
        "M015",
        "M016",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F032",
        "F033",
        "F039"
      ],
      "materialSlotIds": [
        "M003",
        "M017"
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
        "F002",
        "F007",
        "F031",
        "F034",
        "F035",
        "F036"
      ],
      "materialSlotIds": [
        "M016",
        "M018",
        "M019"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-008"
      ],
      "fieldIds": [
        "F002",
        "F007",
        "F024",
        "F035",
        "F036",
        "F037"
      ],
      "materialSlotIds": [
        "M005",
        "M006",
        "M007",
        "M018",
        "M019",
        "M021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-006",
        "SRC-015"
      ],
      "fieldIds": [
        "F020",
        "F021",
        "F023",
        "F026",
        "F038"
      ],
      "materialSlotIds": [
        "M009",
        "M010",
        "M014",
        "M025"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-009"
      ],
      "fieldIds": [
        "F010",
        "F011",
        "F012",
        "F027",
        "F028",
        "F036"
      ],
      "materialSlotIds": [
        "M008",
        "M012",
        "M018",
        "M020",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-004"
      ],
      "fieldIds": [
        "F027",
        "F028",
        "F033",
        "F036"
      ],
      "materialSlotIds": [
        "M013",
        "M015",
        "M017",
        "M018",
        "M020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-006"
      ],
      "fieldIds": [
        "F002",
        "F005",
        "F021",
        "F023",
        "F026",
        "F036"
      ],
      "materialSlotIds": [
        "M002",
        "M009",
        "M023",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-008"
      ],
      "fieldIds": [
        "F001",
        "F007",
        "F010",
        "F027",
        "F036",
        "F037",
        "F038"
      ],
      "materialSlotIds": [
        "M009",
        "M018",
        "M019",
        "M021",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R026",
      "srcIds": [
        "SRC-009"
      ],
      "fieldIds": [
        "F011",
        "F016",
        "F017",
        "F018",
        "F019",
        "F022",
        "F032",
        "F037",
        "F038"
      ],
      "materialSlotIds": [
        "M004",
        "M005",
        "M006",
        "M007",
        "M014",
        "M017",
        "M021",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
