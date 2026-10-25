import type { TemplateVersion } from '@profer/shared'

type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
type R02CriterionMetadata = { sectionId: string; criterionId: string; sourceRuleId: string; srcIds: string[]; evidenceStatus: R02EvidenceStatus; note: string }
type R02Metadata = { templateId: string; name: string; sourceDocumentPath: string; sourceOriginalPath: string; sourceDocumentSha256: string; sourceDocumentBytes: number; sourceBlobSha: string; sourceBranch: string; officialSchoolTemplate: false; researchStatus: string; sourcePolicyStatus: string; policyEvidenceStatus: R02EvidenceStatus; requiresPreUploadSecurityGate: true; secureIntakeEnforcedByTemplateVersion: false; requiredIntegrationGate: string; criteria: R02CriterionMetadata[] }

export const templateVersion: TemplateVersion = {
  "templateId": "T03-T07",
  "version": 1,
  "schemaVersion": 2,
  "name": "科研项目结题、验收与科研绩效材料审核",
  "description": "本地研究模板 · 非校方正式模板。用于科研项目结题、验收与科研绩效材料审核的事实与证据核对；政策证据状态为 PARTIAL，未经有权人员确认不得形成正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板由研究原件 docs/design/review-agent/business-templates/R02/research-original/T03-T07.md 转换；非成都理工大学校方正式模板，不代表学校授权或正式政策。研究依据可支持事实核验和材料对照，但校本授权、当期批次表单及具体项目适用条件并未全部核实。任何不确定政策均人工复核。 SRC 是研究来源索引，不是案卷材料 SourceRef。",
  "objectType": "project",
  "displayName": {
    "template": "科研项目结题、验收与科研绩效材料审核 · 本地研究核验"
  },
  "fields": [
    {
      "key": "review_case_id",
      "label": "review_case_id",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F001；F001 review_case_id:string；ReviewApplication；ALL；L；系统生成的本次案卷记录，非学校项目号；L1；无则不能稳定建案，人工补建；不可复用别案"
    },
    {
      "key": "procedure_stage",
      "label": "procedure_stage",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F002；F002 procedure_stage:enum；ReviewApplication；ALL；L+有权流程意见；P0–P5/PX 状态记录；L1；未知则停用阶段性“必交”判断，HD"
    },
    {
      "key": "project_id",
      "label": "project_id",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F003；F003 project_id:string；Project；P0+；U/A；科研台账项目号或立项批文、任务书标头；L1；SU；与证书/成果号不同则 CONFLICT"
    },
    {
      "key": "program_family",
      "label": "program_family",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F004；F004 program_family:enum；Project；P0；A/U；计划类别与立项机关批文；L1；PC；不能猜属于重大/普通纵向/社科"
    },
    {
      "key": "project_subtype",
      "label": "project_subtype",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F005；F005 project_subtype:string；Project；P0；A；专项、课题/专题及年度通知标题；L1；PC；不把同域模板拆号"
    },
    {
      "key": "funding_batch",
      "label": "funding_batch",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F006；F006 funding_batch:string；Project；P0；A/U；立项年度与当期批次、项目批准号；L1；SU，不能据当前年份推定批次"
    },
    {
      "key": "school_management_unit",
      "label": "school_management_unit",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F007；F007 school_management_unit:string；Project；P0；U；科发院、社科处、中心/主管单位确认记录；L1；HD 归口核对；不按学科关键词猜"
    },
    {
      "key": "school_participation_role",
      "label": "school_participation_role",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F008；F008 school_participation_role:enum；Project；P0；A；牵头/承担课题/专题/参与，任务书主体栏；L1；PC；未知不可套牵头验收期限"
    },
    {
      "key": "lead_or_entrusting_org",
      "label": "lead_or_entrusting_org",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F009；F009 lead_or_entrusting_org:string；Project；P0；A；项目牵头/主管/委托单位公文、合同；L1；SU；不能把校方归口等同外部决定者"
    },
    {
      "key": "principal_person_status",
      "label": "principal_person_status",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F010；F010 principal_person_status:enum；ProjectPrincipal；P0/PX；U/A；在职/博士后/外聘/学生或其他，立项时资格与当前变更；L2；HD；年龄/身份申请门槛不自动复判结题"
    },
    {
      "key": "principal_authoritative_id",
      "label": "principal_authoritative_id",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F011；F011 principal_authoritative_id:ref；ProjectPrincipal；P0+；U；校内可信人员标识与项目台账授权指针，不收明文身份证号；L2；SU/HD；客户端自填不构成审批权"
    },
    {
      "key": "principal_display_name",
      "label": "principal_display_name",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F012；F012 principal_display_name:string；ProjectPrincipal；P0+；U/A；任务书姓名、签字页与权威人员档案；L2；CONFLICT；同名不能替代 F011"
    },
    {
      "key": "submitter_identity_ref",
      "label": "submitter_identity_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F013；F013 submitter_identity_ref:ref；ReviewApplication；P1/P2/PX；U；可信登录主体、委托办理人的校验结果；L2；SU/HD；Renderer 传 actor 不可信"
    },
    {
      "key": "delegate_authority_ref",
      "label": "delegate_authority_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F014；F014 delegate_authority_ref:ref?；ReviewApplication；C 代办；D/U；委派书或可核系统授权及作用范围；L2；无代办则 NA；代办却缺则 HD，不代签"
    },
    {
      "key": "project_title",
      "label": "project_title",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F015；F015 project_title:string；Project；P0+；A；批准任务书/合同标题；L1；NM/SU；与成果标题相异不自动失败"
    },
    {
      "key": "governing_document_ref",
      "label": "governing_document_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F016；F016 governing_document_ref:ref；ProjectAuthority；P0+；A/U；立项批复/任务书/合同原件位置；L1/L2；SU；不使用未核草稿为现行任务书"
    },
    {
      "key": "governing_version",
      "label": "governing_version",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F017；F017 governing_version:string；ProjectAuthority；P0+；A/D；正式签发版号、变更单及生效日期；L1；SU/CONFLICT；无法比对成果基准则 PC"
    },
    {
      "key": "approved_start_at",
      "label": "approved_start_at",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F018；F018 approved_start_at:date?；ProjectAuthority；P0；A；正式立项执行期起点；L1；SU，不能反推开始日"
    },
    {
      "key": "approved_end_at",
      "label": "approved_end_at",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F019；F019 approved_end_at:date?；ProjectAuthority；P0/PX；A/D；原定期满及有效延期后的期满日；L1；SU；缺时不计算逾期"
    },
    {
      "key": "approved_amendment_refs",
      "label": "approved_amendment_refs",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F020；F020 approved_amendment_refs:ref[]；ProjectAuthority；C 变更/延期；D/U；正式变更、延期批复及替代链；L1/L2；申请书不能充批复；缺则旧版仍待核"
    },
    {
      "key": "target_indicator_id",
      "label": "target_indicator_id",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F021；F021 target_indicator_id:string；Target；P1/P3；A；任务书目标/绩效指标原段落；L1；PC；禁止无源补指标"
    },
    {
      "key": "target_expected_result",
      "label": "target_expected_result",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F022；F022 target_expected_result:structured；Target；P1/P3；A；约定成果形式、数量、质量和考核方式原页；L1/L2；NM/SU；不以 AI 主观改写正式阈值"
    },
    {
      "key": "completion_narrative_ref",
      "label": "completion_narrative_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F023；F023 completion_narrative_ref:ref；ReviewApplication；P1；S；结题/终结报告、当期申请正文位置；L1/L2；现阶段据 SRC/通知确定必需后 NM；否则 PC"
    },
    {
      "key": "outcome_item_id",
      "label": "outcome_item_id",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F024；F024 outcome_item_id:string；OutcomeEvidence；P1+；S/U；成果目录条目、成果编号、可核数据库标识；L1/L2；缺关联时 NM/HD；条目逐件保存"
    },
    {
      "key": "outcome_type",
      "label": "outcome_type",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F025；F025 outcome_type:enum；OutcomeEvidence；P1+；A/S；论文/报告/知识产权/实物/影像等相应形式；L1/L2；与任务书要求冲突则 CONFLICT"
    },
    {
      "key": "outcome_to_project_mapping",
      "label": "outcome_to_project_mapping",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F026；F026 outcome_to_project_mapping:ref；OutcomeEvidence；P1+；A+S/U；项目批准号标注、成果正文或批示关联段落；L1/L2；CONFLICT；不能仅凭题目相似证明归属"
    },
    {
      "key": "financial_statement_ref",
      "label": "financial_statement_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F027；F027 financial_statement_ref:ref?；FinancialReference；C P1/P3；D/U；财务处签章经费明细/决算，SRC-001/009；L2；该类/阶段法定必交才 NM；财务接口失联 SU"
    },
    {
      "key": "audit_or_finance_acceptance_ref",
      "label": "audit_or_finance_acceptance_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F028；F028 audit_or_finance_acceptance_ref:ref?；FinancialReference；C P3+；D/U；审计报告、财务验收意见，SRC-001；L2；尚未出具 NA；不以无财务验收认定科研不达标"
    },
    {
      "key": "project_self_assessment_ref",
      "label": "project_self_assessment_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F029；F029 project_self_assessment_ref:ref?；StageOpinion；C P1/P3；S/A；重大项目综合绩效自评与成果对照，SRC-001；L1/L2；当类应报而缺 NM；其他类不强制"
    },
    {
      "key": "expert_opinion_ref",
      "label": "expert_opinion_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F030；F030 expert_opinion_ref:ref?；StageOpinion；C P3；D；专家鉴定汇总/已签意见，SRC-001/009；L1/L2；P1 为 NA；伪签或无权签署 HD"
    },
    {
      "key": "formal_decision_ref",
      "label": "formal_decision_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F031；F031 formal_decision_ref:ref?；FormalDecision；P4/P5；D/U；主管单位/市社科联/委托方结论或证书；L1/L2；P1/P2 为 NA；P4 来源失联 SU"
    },
    {
      "key": "formal_decision_status",
      "label": "formal_decision_status",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F032；F032 formal_decision_status:enum?；FormalDecision；P4/P5；D/U；文书所载结论及更正、撤销标记；L1；无权威原件为 UNKNOWN/HD，不据材料齐全推断"
    },
    {
      "key": "formal_decision_issued_at",
      "label": "formal_decision_issued_at",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F033；F033 formal_decision_issued_at:date?；FormalDecision；P4/P5；D；文书签发日与效力起点；L1；SU；不以扫描上传时间代签发日"
    },
    {
      "key": "extension_request_at",
      "label": "extension_request_at",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F034；F034 extension_request_at:date?；ExceptionalAction；C PX；S+受理回执；申请发起日/受理日分别留痕；L1/L2；不同于批准日；超限需人工判有无补救"
    },
    {
      "key": "extension_approval_ref",
      "label": "extension_approval_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F035；F035 extension_approval_ref:ref?；ExceptionalAction；C PX；D/U；原有权单位批准延期文书；L1/L2；缺批准即 PENDING，不可自动改 F019"
    },
    {
      "key": "withdrawal_or_termination_ref",
      "label": "withdrawal_or_termination_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F036；F036 withdrawal_or_termination_ref:ref?；ExceptionalAction；C PX；S/D；撤回材料申请 vs 主管单位撤项/终止批复，类型必分；L1/L2；只有申请时不得更改项目正式状态"
    },
    {
      "key": "business_performance_assessment_ref",
      "label": "business_performance_assessment_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F037；F037 business_performance_assessment_ref:ref?；DownstreamReference；C P5；D/U；学院业务绩效考核意见，SRC-003；L2；仅关联；支付/分配不在此决定"
    },
    {
      "key": "performance_allocation_approval_ref",
      "label": "performance_allocation_approval_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F038；F038 performance_allocation_approval_ref:ref?；DownstreamReference；C P5；D/U；学院审批的绩效分配意见，SRC-003/010；L2；待确认有效表单；缺则 PC/SU，不发薪"
    },
    {
      "key": "recognized_outcome_grade_ref",
      "label": "recognized_outcome_grade_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F039；F039 recognized_outcome_grade_ref:ref?；OutcomeEvidence；C P1/P5；D/U；学校已认定成果级别及版本，SRC-004/006；L1/L2；无权威分级则 HD，不由期刊名直接推断"
    },
    {
      "key": "submitted_at",
      "label": "submitted_at",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F040；F040 submitted_at:datetime?；ReviewApplication；P1/P2/PX；U/L；受理系统回执时间、线下收件凭证；L1；无回执不得推定按期办理"
    },
    {
      "key": "material_revision_ref",
      "label": "material_revision_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F041；F041 material_revision_ref:ref；EvidenceVersion；ALL；L；具体材料 hash/版本/替代记录、页码；L1/L2；缺则不复用旧事实结论，HD"
    },
    {
      "key": "governing_source_currentity",
      "label": "governing_source_currentity",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F042；F042 governing_source_currentity:enum；PolicyContext；P0/P1；U/A+人工版本核验；SRC、计划当期文件和有效区间；L1；UNKNOWN=PC，暂停该类硬阈值"
    },
    {
      "key": "confidentiality_class",
      "label": "confidentiality_class",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F043；F043 confidentiality_class:enum；Project/Evidence；P0/ALL；D/U；正式涉密标识/资助方保密要求；SRC-001 第9条；L2/L3；未知含密风险时人工分流；L3 正文禁止进入普通模型"
    },
    {
      "key": "evidence_conflict_refs",
      "label": "evidence_conflict_refs",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F044；F044 evidence_conflict_refs:ref[]；ReviewApplication；P2/PX；L+对照 A/U/S；不一致的字段、页码及来源版本；L1/L2；不静默覆盖冲突，由有权人核定"
    },
    {
      "key": "reconsideration_request_ref",
      "label": "reconsideration_request_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F045；F045 reconsideration_request_ref:ref?；ExceptionalAction；C PX；S+受理记录；争议决定编号及申请理由；L2；无明确受理途径时 HD，不能承诺法定申诉"
    },
    {
      "key": "reconsideration_decision_ref",
      "label": "reconsideration_decision_ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F046；F046 reconsideration_decision_ref:ref?；ExceptionalAction；C P4/PX；D/U；有权机关复核/更正文书及生效时间；L2；尚未作出 NA，旧决定保持其当时效力"
    },
    {
      "key": "funding_variant",
      "label": "funding_variant",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F047；F047 funding_variant:enum?；Project；C P0/P1；A；资助/自筹/预算制、项目经费类型；L1/L2；无法核实则 PC，不能套市社科尾款材料"
    },
    {
      "key": "foreign_outcome_language",
      "label": "foreign_outcome_language",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F048；F048 foreign_outcome_language:string?；OutcomeEvidence；C P1/P5；S/U；外文成果正文及相应译文/摘要；L1/L2；外文情形才触发材料槽；语言不明 HD"
    },
    {
      "key": "acceptance_method",
      "label": "acceptance_method",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F049；F049 acceptance_method:enum?（审核/专家/备案自主/其他）；ProvincialAcceptance；H2-SC/P0–P4；A/U；四川省资金支持方式、批准立项经费、主管机关当期受理方式与试点备案记录；SRC-016；L1；缺项目资助类型/批次/试点授权→PC，不仅按金额判断“学校自主验收”"
    },
    {
      "key": "approved_funding_amount",
      "label": "approved_funding_amount",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F050；F050 approved_funding_amount:number?（元）；ProjectAuthority；H2-SC/P0–P3；A/U；正式批准立项经费而非支出余额、自述或合同估算；M002/M035；L2；无权威数额→SU/HD；不得据 OCR 数字直接选验收模式"
    },
    {
      "key": "province_disposition_type",
      "label": "province_disposition_type",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F051；F051 province_disposition_type:enum?（正常验收/二次验收/终止/撤销/撤销申诉）；ExceptionalAction/Decision；H2-SC/P3–PX；D/U；科技厅系统签发的受理与决定记录；M037/M039；L1/L2；不同动作、时限、签发人分开；申请≠决定，无法确认→PC/HD"
    },
    {
      "key": "endorsement_issuer_and_primary_unit",
      "label": "endorsement_issuer_and_primary_unit",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F052；F052 endorsement_issuer_and_primary_unit:ref?；OutcomeEvidence；E3/P1–P3；D/U+原始批示；签批者职务层级、批示真实性、成果篇目、学校第一署名单位的授权证据；M038；L2；只凭截图/OCR 不认官方身份；缺原件来源→SU/HD，不让 AI 给批示等级"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "项目存在、归口与计划类别",
      "purpose": "M001 项目存在、归口与计划类别；科发院/社科处/资助方；项目台账/批准记录；权 P0；纸质立项批复或可核电子证书代替不可访问台账；F003–F009,F015,F047；SRC-001/002/006–009；批次/项目号；缺 SU/HD；不可读 UNREADABLE",
      "requiredElements": [
        "项目存在、归口与计划类别",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "目标、期限、任务与承担关系",
      "purpose": "M002 目标、期限、任务与承担关系；项目负责人/牵头单位/资助方；正式任务书、批文、横向合同或获批申请书；现 P0/P1 的有效依据；可核签发电子原件替代扫描件，不接收未签草案作批准版；F008–F009,F015–F022；SRC-001/002/006–009/012/013；签发版+变更链；缺 SU/PC，字迹模糊 UNREADABLE",
      "requiredElements": [
        "目标、期限、任务与承担关系",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "负责人与提交人真实授权",
      "purpose": "M003 负责人与提交人真实授权；学校可信身份/项目登记；内部可信身份和当前负责人指针；权 P0/P1；无接口由科研归口人员对照原件/台账留核验记录，不要求身份证扫描件；F010–F013；SRC-001/002/005；权限生效区间；缺 SU/HD，不可读取则 SU",
      "requiredElements": [
        "负责人与提交人真实授权",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "合法代理权",
      "purpose": "M004 合法代理权；项目负责人或有权单位；明确范围的委托、授权记录；条 仅代办；合法学校授权记录可替代纸质委托，空口声明不可替代；F013–F014；SRC-001/002（授权格式未确立）；代理人与项目、期限；缺 HD/PC，不可读 UNREADABLE",
      "requiredElements": [
        "合法代理权",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "变更/延期已经生效",
      "purpose": "M005 变更/延期已经生效；主管单位/科发院/社科处；正式批准文书/可信状态；条 已发生变更/获准延期时；有权系统记录可代 PDF，申请书不可替代批复；F017–F020,F034–F035；SRC-001/006/007；替代旧任务版本；缺 SU/HD，不可读 UNREADABLE",
      "requiredElements": [
        "变更/延期已经生效",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "结题/结项申请或终结报告",
      "purpose": "M006 结题/结项申请或终结报告；项目负责人；当期结题报告、终结报告/申请表；现 P1，具体表式由项目类别决定；官方线上申报回执可代线下纸表时须有原文支持；F002,F023,F040；SRC-001/002/006–009/014；当前提交版，缺 NM 或政策未核 PC；不可读 UNREADABLE",
      "requiredElements": [
        "结题/结项申请或终结报告",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "目标—成果逐项对照",
      "purpose": "M007 目标—成果逐项对照；负责人/项目实施组；任务书指标与产出映射、阶段总结；条 有绩效/目标逐项评价的项目 P1/P3；若权威系统已有对应指标记录则引用；F021–F026,F029；SRC-001/006/007；绑定 M002 目标版本；缺 NM/PC；不可读 UNREADABLE",
      "requiredElements": [
        "目标—成果逐项对照",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "成果目录及项目归属",
      "purpose": "M008 成果目录及项目归属；负责人/成果管理系统；成果清单、论文/报告/专利编号与资助标注；现 有成果证明义务的 P1；已核成果台账可免重复上传目录，但需校对关联；F024–F026,F039,F048；SRC-001/004/006–009；一成果一记录及多项目使用历史；缺 NM/PC，不可读 UNREADABLE",
      "requiredElements": [
        "成果目录及项目归属",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "研究成果原件/正式输出",
      "purpose": "M009 研究成果原件/正式输出；作者、出版社、研究团队/授权仓库；论文、出版物、报告、样机/影像等；条 按任务书/通知要求 P1；可核出版/批示/成果登记的权威存档代复印件，委托合同另核；F024–F026,F048；SRC-001/006–009/014；原创者、项目号、成果版次；缺 NM/PC，不可读 UNREADABLE",
      "requiredElements": [
        "研究成果原件/正式输出",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "项目综合绩效自评",
      "purpose": "M010 项目综合绩效自评；重大项目负责人；综合绩效自评与代表性成果材料；现 国家重点（重大）项目需自评的 P1/P3，其他项目条件触发；权威主管系统已报送记录可替代再次上传；F021–F022,F029,F040；SRC-001 第30条；自评期/指标版本；缺 NM，来源不可取 SU，不可读 UNREADABLE",
      "requiredElements": [
        "项目综合绩效自评",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "资金决算及财务审核事实",
      "purpose": "M011 资金决算及财务审核事实；财务处/负责人；资金决算、财务部门审核数据；条 专属项目财务验收阶段；有权财务结论可引用，不重审每张票据；F027,F047；SRC-001 第25–26条、SRC-003；财务科目/时点；缺 NM/NA/SU 依阶段，不可读 UNREADABLE",
      "requiredElements": [
        "资金决算及财务审核事实",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "财务审计/财务验收意见",
      "purpose": "M012 财务审计/财务验收意见；合规会计师事务所、财务处/主管方；审计报告/意见；后 重大项目财务验收前按 SRC-001 条件出现；非所有项目统一必交；可核资助方电子结论替代副本；F028；SRC-001 第25–26条；审计范围与课题/项目号；P1 未产 NA，P3 应出未出 NM/SU",
      "requiredElements": [
        "财务审计/财务验收意见",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "学院/校内初核意见",
      "purpose": "M013 学院/校内初核意见；二级学院、科发院/社科处；正式受理、初审或退回记录；后 P2 才产生；可信业务系统有效意见替代扫描签章，不预索于 P1；F002,F040–F041；SRC-001/002/009；仅对当时提交版有效；缺 NA/SU，不可读 UNREADABLE",
      "requiredElements": [
        "学院/校内初核意见",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "专家鉴定/验收意见",
      "purpose": "M014 专家鉴定/验收意见；专家组与主办单位；专家汇总意见、有效签章；后 P3 组织后产生；有权签发系统记录可代复印件；F030；SRC-001/009；专家组+具体目标/提交版；P1 NA；无签发核验 HD",
      "requiredElements": [
        "专家鉴定/验收意见",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "项目正式验收/结项决定",
      "purpose": "M015 项目正式验收/结项决定；资助方、主管方/委托方或有权校方；正式验收意见、结项结论；后 P4 才产生；可核主管系统状态或电子证书等效；F031–F033；SRC-001/002/006–009/013；决定签发机关及版本；P1 NA；P4 未得 SU，不可读 UNREADABLE",
      "requiredElements": [
        "项目正式验收/结项决定",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "专项中心/其他计划特定表单",
      "purpose": "M016 专项中心/其他计划特定表单；归口中心/资助方；当期项目结题审批书或专属表；条 H3/其他明确要求才用；不得将 SRC-014 的中心表泛化，附件未读取先 PC；F004–F006,F023；SRC-014；具体批次/表单版本未核，PC；不可读 UNREADABLE",
      "requiredElements": [
        "专项中心/其他计划特定表单",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "成都市社科线下结项申请表",
      "purpose": "M017 成都市社科线下结项申请表；项目负责人；2025版《成都市哲学社会科学规划项目结项申请表》；现 F1 P1；官方当期有效表或被认可系统办理凭证才可替代；F003,F023,F040；SRC-008；市级项目号、当期表版；缺 NM；附件内部字段 PC/不可读 UNREADABLE",
      "requiredElements": [
        "成都市社科线下结项申请表",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "成都市社科成果原件/电子可编辑件",
      "purpose": "M018 成都市社科成果原件/电子可编辑件；项目负责人、出版或批示机关；刊物/研究报告/批示成果原件及可编辑电子成果；现 F1 P1；官方可核全文与纸件替代须市社科联认可，不把截图等同成果原件；F024–F026,F048；SRC-008 第3点；纸电同成果和资助标注；缺 NM，不可读 UNREADABLE",
      "requiredElements": [
        "成都市社科成果原件/电子可编辑件",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "成都市社科线下结项证书",
      "purpose": "M019 成都市社科线下结项证书；市级有权结项机构；已签发结项证书；后 F2 P5才是必需；主管方权威电子证书可替代扫描件；F031–F033；SRC-008 第4点；对应 F1 项目及签发日；F1 未发证 NA，F2 缺 SU/NM",
      "requiredElements": [
        "成都市社科线下结项证书",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "成都市社科尾款回执及发票",
      "purpose": "M020 成都市社科尾款回执及发票；项目负责人/单位财务；单位签章尾款回执、发票；条 F1 资助项目结项时；官方财务记录能否替代须市社科联确认，暂不允许自行替代；F027,F047；SRC-008 第5点；仅资助项目；自筹 NA，资助缺 NM，票据不可读 UNREADABLE",
      "requiredElements": [
        "成都市社科尾款回执及发票",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "成都市社科外文成果译文与说明",
      "purpose": "M021 成都市社科外文成果译文与说明；项目负责人/学校科研部门；中文译文、刊物级别证明、意识形态证明；条 F1 有英文成果时；需单位审核盖章，非机器翻译件可独自替代；F026,F039,F048；SRC-008 第5点；每件外文成果对应；缺 NM，签章真伪 HD，不可读 UNREADABLE",
      "requiredElements": [
        "成都市社科外文成果译文与说明",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "教育部人文社科在线结项/终结报告",
      "purpose": "M022 教育部人文社科在线结项/终结报告；项目负责人/教育部业务系统；在线提交回执、终结报告书；现 G1 P1；以可信业务系统提交记录核准，不强制另交相同 PDF；2018样表现行性待核；F003,F023,F040；SRC-009 第1–2点；批准号、报送版/回执；缺 NM/PC，不可读 UNREADABLE",
      "requiredElements": [
        "教育部人文社科在线结项/终结报告",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m023",
      "name": "教育部项目财务盖章明细",
      "purpose": "M023 教育部项目财务盖章明细；学校财务部门；经费开支明细账盖章 PDF；现 G1 P1（按 SRC-009 当页）；可核财务电子签章明细替代纸件，最终以主管方认可为准；F027；SRC-009 第3点；本项目财务期间/财务章；缺 NM，签章疑点 HD，无法打开 UNREADABLE",
      "requiredElements": [
        "教育部项目财务盖章明细",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m024",
      "name": "教育部项目合作方外拨经费明细",
      "purpose": "M024 教育部项目合作方外拨经费明细；合作单位财务部门；审核盖章直接费用明细账；条 G1 有外拨资金时；合法电子签章副本或主管系统可核件；F027,F047；SRC-009 第3点；外拨单位及项目号；无外拨 NA，有外拨缺 NM",
      "requiredElements": [
        "教育部项目合作方外拨经费明细",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m025",
      "name": "教育部项目外文成果中文摘要",
      "purpose": "M025 教育部项目外文成果中文摘要；项目负责人；外文成果对应中文版摘要与成果名称译文；条 G1 外文成果时；正式双语材料可替代单独摘要的条件须上级确认；F024,F026,F048；SRC-009 第5点；一成果一译名/摘要，缺 NM/PC，无法读取 UNREADABLE",
      "requiredElements": [
        "教育部项目外文成果中文摘要",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m026",
      "name": "教育部个人鉴定意见纸件",
      "purpose": "M026 教育部个人鉴定意见纸件；专家/学校科研管理部门；专家个人意见表；后 G2 通讯/会议鉴定后线下上交；根据 SRC-009 不需上传个人表，只保留纸件归档指针；F030；SRC-009 第6点；评审批次、专家签署；P1 NA，P3 后未归档 SU",
      "requiredElements": [
        "教育部个人鉴定意见纸件",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m027",
      "name": "教育部专家鉴定汇总表",
      "purpose": "M027 教育部专家鉴定汇总表；学校科研管理部门；已盖章汇总 PDF；后 G2 P3 由学校补充扫描上传，不由负责人提交替代；F030,F040；SRC-009 第6点；绑定学校上传版；P1 NA，学校未上传 SU/HD",
      "requiredElements": [
        "教育部专家鉴定汇总表",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m028",
      "name": "有权成果/项目分级认定",
      "purpose": "M028 有权成果/项目分级认定；科发院/社科处/获授权机构；学校正式认定结果或权威成果级别；条 D1/D2 或其他明确引用级别时；可核科研成果权威记录替代个人自述；F024,F039；SRC-004/006；认定年度、原制度版本；缺 HD/SU，不由 AI 评级",
      "requiredElements": [
        "有权成果/项目分级认定",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m029",
      "name": "纵向科研绩效业务考核意见",
      "purpose": "M029 纵向科研绩效业务考核意见；学院有权考核主体；业务实绩考核报告/审批意见；条 I P5；可核学院审批系统记录替代上传；不是结题申请入口件；F037；SRC-003 第4条、SRC-010 待核；关联项目与绩效期间；未产生 NA，事后缺 SU/PC",
      "requiredElements": [
        "纵向科研绩效业务考核意见",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m030",
      "name": "绩效分配方案及审批",
      "purpose": "M030 绩效分配方案及审批；项目负责人提出、学院审批；方案和有效审批结果；条 I P5；可靠学院原始记录替代副本；只引用、不计算或支付；F038；SRC-003/010；方案版本与审批主体；缺 SU/PC，不可读 UNREADABLE",
      "requiredElements": [
        "绩效分配方案及审批",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m031",
      "name": "申请撤回/补件/延期/复核说明",
      "purpose": "M031 申请撤回/补件/延期/复核说明；项目负责人/合法代理；所针对决定或材料版本、原因和受理回执；条 PX 对应动作才需；可信办理系统申请记录可替代纸件，但不得充批准意见；F034,F036,F040,F045；SRC-001/006/007/009；必须指向被操作版本；缺 NM/PC，理由裁量 HD",
      "requiredElements": [
        "申请撤回/补件/延期/复核说明",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m032",
      "name": "撤项/延期/复核的正式批准或更正",
      "purpose": "M032 撤项/延期/复核的正式批准或更正；原有权机构；正式撤项/终止、延期批准或复核决定；后 PX 决定后产生；有权系统可核状态可代副本；F020,F035–F036,F046；SRC-001/006/007；决定范围、效力及替代链；申请时 NA，决定后失联 SU",
      "requiredElements": [
        "撤项/延期/复核的正式批准或更正",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m033",
      "name": "委托方验收/交付确认",
      "purpose": "M033 委托方验收/交付确认；委托单位/牵头机构；合同交付记录、签收、验收或系统确认；条 H1/H2 按合同/主管方规则；有权电子签收/验收记录可替代扫描件；F009,F026,F031；SRC-012/013；合同标的、交付版、接收人；条件未核 PC，不可读 UNREADABLE",
      "requiredElements": [
        "委托方验收/交付确认",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m034",
      "name": "补件或替换材料说明/关联记录",
      "purpose": "M034 补件或替换材料说明/关联记录；补交人+本案记录；补充说明、变更清单、旧新文件对照；条 J1 P2/PX；可信办事系统留痕可代独立说明文件，不强迫额外造表；F002,F041,F044；SRC-009（仅教育部退回有例证）；保留旧版不可删失；缺对照 HD，不可读 UNREADABLE",
      "requiredElements": [
        "补件或替换材料说明/关联记录",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m035",
      "name": "四川省科技计划验收申请、任务对照与科技报告",
      "purpose": "M035 四川省科技计划验收申请、任务对照与科技报告；省科技系统/牵头单位；验收申请表、验收评价报告、指标佐证、需科技报告的先行报告；条 H2-SC/P1，按 SRC-016 第16、19–20条及当期任务书；已有主管系统可核回执可替代二次上传；申报时不必有验收证书；F003–F009,F017,F021–F026,F040,F049–F050；SRC-016；绑定任务书批准版、项目级/课题级，省原站本轮未直读→PC；实际确认必交才 NM；不清晰 UNREADABLE",
      "requiredElements": [
        "四川省科技计划验收申请、任务对照与科技报告",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m036",
      "name": "四川省科技计划验收财务附件及专项审计",
      "purpose": "M036 四川省科技计划验收财务附件及专项审计；财务处/审计机构/省科技系统；资金明细、固定资产明细、专项审计报告或经费合规承诺；条 H2-SC/P1–P3 按批准模式/金额/资助方式：小额审核评价不一律要专项审计；专家评价专项经费达到适用阈值才可能要专项审计；仅引用 G07/财务签发事实；F027/F028/F047/F049–F050；SRC-016；校方财务提供，签章、金额范围与项目号绑定；法定确认前 PC，未产 NA，确认须有却无 NM，接口断 SU",
      "requiredElements": [
        "四川省科技计划验收财务附件及专项审计",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m037",
      "name": "四川省科技计划评价正式证书/系统决定",
      "purpose": "M037 四川省科技计划评价正式证书/系统决定；四川省科技厅/已备案自主验收主体及主管系统；评分结论、确认流、验收评价证书；后 H2-SC/P4–P5，不作 P1 申请必交；须核出具机关、评价模式与确认链；F031–F033,F049,F051；SRC-016；按项目 ID、决策主体、系统版；P1 NA，正式记录已存在却取不到 SU，截图非授权决定",
      "requiredElements": [
        "四川省科技计划评价正式证书/系统决定",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m038",
      "name": "2026特色新型智库团队肯定性批示成果证据",
      "purpose": "M038 2026特色新型智库团队肯定性批示成果证据；原批示签发/收文机关、校方社科处；批示文书/授权核验记录、成果第一署名单位与原件指针；条 E3/P1 按 SRC-017/获批申请书；可引用经校方核实的政务批示归档，不要求向普通 LLM 上传含密或未公开全文；F021–F026,F039,F052；SRC-017；每篇批示独立编号/领导层级/授权可查范围；隐私 L2、涉密 L3 隔离；缺校本真实性核验→HD/SU",
      "requiredElements": [
        "2026特色新型智库团队肯定性批示成果证据",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m039",
      "name": "省科技二次验收、项目终止/撤销及申诉处置",
      "purpose": "M039 省科技二次验收、项目终止/撤销及申诉处置；项目牵头单位/科技厅；整改申请与报告、终止请求、撤销通知、申诉及正式新结论；条/后 H2-SC/P3–PX；动作中申请与后续决定两份不同记录；不把一般补件当省厅撤销申诉；F031–F036,F040,F045–F046,F051；SRC-016；绑定原验收/撤销文书与送达/反馈时点；具体时限依正式新规与已核受理回执，缺权限 PC/HD",
      "requiredElements": [
        "省科技二次验收、项目终止/撤销及申诉处置",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m040",
      "name": "国家社科分项目类别结项受理记录和有权决定",
      "purpose": "M040 国家社科分项目类别结项受理记录和有权决定；全国社科工作办/省级主管/学校社科归口；年度/青年/西部在线结项记录、重大项目专属结项审批书等；条/后 H2-NS/P1 或 P4；先确认类别、合同/申请书和当期表式才确定何项 P1 必交；正式结项证书是 P4 产物；F003–F006,F016–F026,F031–F033,F040–F042；SRC-015/019–021；校站参考文件和 2024 清单尚不能作 2026 通用硬条件；未得当期确认 PC，权威系统失联 SU",
      "requiredElements": [
        "国家社科分项目类别结项受理记录和有权决定",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "project-baseline",
      "name": "项目身份、批次、责任与有效依据",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "项目案卷身份与项目号",
          "requirement": "R001 项目案卷身份与项目号，P0+；T=有本事项项目；F=非科研结题事项→NA 路由；U=对象不明→HD；SRC-001/002（校本类型示例）及本项目立项批文；F001–F003；M001；对本次案卷键和批准项目号、承办事项版本；新补件不得另造权威项目号；L 对 A/U；一致 PASS_FACT；项目号冲突 CONFLICT；U 记录断联 SU；校科研归口核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "计划类别、子类型和批次",
          "requirement": "R002 计划类别、子类型和批次，P0；T=能辨计划；F=非 T03 管辖→NA；U=批次/适用类别未定→PC；SRC-001/002/006–009/011–014；F004–F006；M001/M002；立项批文及其年度/主管单位对照通知，2026 D/E 门槛不可倒用往年；附件索引不能定条件；T 核一致 PASS_FACT，互斥 CONFLICT；U PC/SU；科发院/社科处核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "学校牵头/参与层级与归口",
          "requirement": "R003 学校牵头/参与层级与归口，P0；T=本校承担或管理；F=纯外部项目→NA；U=学校角色不明→HD；SRC-001 第5–7条、SRC-002/009；F007–F009；M001/M002；对牵头/承担课题/专题/参与、学校管理部门、委托/资助方；项目级与课题级证书不得互代；权威一致 PASS_FACT；层级矛盾 CONFLICT；科发院/社科处与牵头方核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "有效负责人和身份归属",
          "requirement": "R004 有效负责人和身份归属，P0/P1/PX；T=需有人承担当前申请；F=只做无主体制度检索→NA；U=缺可信人员指针→SU/HD；SRC-001/002/005；F010–F012；M001/M003；核项目批准/正式调整中的负责人指针、人员档案及生效区间；同名/学生/博士后/退休不自动赋权，申请时年龄资格不在结题重新判；一致 PASS_FACT；姓名相同ID不同 CONFLICT；归口及可信身份管理核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "提交人与代理权限",
          "requirement": "R005 提交人与代理权限，P1/P2/PX；T=有人正式递交；F=仅 P0 咨询→NA；U=代理方式尚未核→PC/HD；SRC-001/002/005（授权形式未见通则）；F013/F014；M003/M004；服务端可信身份与有效委派的项目/动作/期限比较；Renderer actor、扫描签名和项目负责人姓名都不授予审批权；授权可核 PASS_FACT；代办冲突 CONFLICT；授权缺口 HD；校归口/身份授权者核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "立项/任务书/合同的有效签发版",
          "requirement": "R006 立项/任务书/合同的有效签发版，P0/P1；T=有执行目标待审；F=仅处理政策咨询→NA；U=无法确认哪版有效→SU；SRC-001/002/006–009/012/013；F015–F017/F020；M002/M005；对签发单位、项目号、任务/合同书页与获准变更链；上传草案不能替代批准版；主版本改变时受影响检查失效；一致 PASS_FACT；两批准版冲突 CONFLICT；签发无权 HD；科研归口或资助/委托方核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "批准执行期与本次提交时点",
          "requirement": "R007 批准执行期与本次提交时点，P0/P1/PX；T=项目有生效期限/收件要求；F=该计划确无截止限制→NA；U=期限规则未明→PC；SRC-001/002/006/007/009；F018/F019/F034/F040；M002/M005/M031；批准起止、正式延期批准时间与受理回执逐个比较；未得批复不能更新 F019；迟交是否可补救是人工裁量；日期事实可核 PASS_FACT，时间/版本矛盾 CONFLICT；回执缺 NM/SU 按有权来源；归口/资助方核是否受理。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "当期政策/表单效力",
          "requirement": "R008 当期政策/表单效力，P0/P1；T=存在该类别的明确规则；F=所查来源不适用→NA，不得借用；U=现行性未核→PC；SRC-001–014（逐案取适用条）；F004–F006/F042；M001/M002/M016；比发文机关、适用对象、正式废止/修订、任务书条款和收件日；成理校发〔2021〕52号已被 SRC-004 废止；已核适用事实 PASS_FACT；只见旧目录 PC/SU；社科处/科发院与发文机关核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "项目涉密与允许处理通道",
          "requirement": "R009 项目涉密与允许处理通道，P0+；T=有内容/级别判断需求；F=已由有权机关核非涉密→NA 于专门分流；U=有涉密征象但级别未知→HD；SRC-001 第9条、SRC-005；F043；M001/M002/M009；用正式保密标识和有权人工核，不解析疑似 L3 原文；涉密不是 OCR 缺件；普通流程禁处理 L3；普通审查结果为 HD/路由；校保密/科研归口处理。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "当期结题/终结申请实际递交",
          "requirement": "R010 当期结题/终结申请实际递交，P1/P2；T=本分支当期要报申请；F=P0 或未到申请节点→NA；U=表式/渠道待核→PC；SRC-001/002/006–009/014；F002/F023/F040；M006/M017/M022；对真实受理回执或正式申请当前版；F/G 的专用表另由 R023/R027 核；校方退回并非资助方拒绝；已交且可读 PASS_FACT；明示必交且缺 NM；无法打开 UNREADABLE；负责人/归口补核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "任务书指标及预期成果定义",
          "requirement": "R011 任务书指标及预期成果定义，P1/P3；T=项目有应达目标；F=此阶段不评价指标→NA；U=有效目标版本未知→SU/PC；SRC-001/002/006/007；F016/F017/F021/F022；M002/M007；逐项保存原文页码/成果形式/数量/考核方式；只对有权当前版比，不凭 AI 生成指标；目标定位可核 PASS_FACT；旧新冲突 CONFLICT；需主办单位解释时 HD。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "成果存在性、形式与可读性",
          "requirement": "R012 成果存在性、形式与可读性，P1/P3；T=计划要求提交成果；F=该阶段无成果义务→NA；U=成果类型未在有效任务书载明→PC；SRC-001/006–009；F024/F025/F048；M008/M009；清单逐件绑定原件/官方公开记录、出版/批示日及版本；不同项目可容多成果，图片 OCR 不能替代成果原件；存在且可核 PASS_FACT；已证必交缺 NM；损坏 UNREADABLE；作者/学校归口核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "成果与项目/目标的归属映射",
          "requirement": "R013 成果与项目/目标的归属映射，P1/P3；T=成果用于本案结题；F=仅阅项目档案无成果引用→NA；U=未定成果归属要求→PC；SRC-001/004/006–009；F021/F022/F024–F026；M007/M008/M009；对项目批准号、任务目标条目、成果资助标注、研究期间与成果页；题目相似不能证明归属，多个资金来源需人工审；可核映射 PASS_FACT；项目号/标注不一致 CONFLICT；相关性裁量 HD；社科处/科发院核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "证据版本与新旧替换依赖",
          "requirement": "R014 证据版本与新旧替换依赖，P2/PX/ALL 更新事件；T=材料换版或发现双版本；F=无替换事项→NA；U=替代关系不明→HD；SRC-001/002/009（业务背景），技术留痕非校本硬阈值；F017/F020/F041/F044；M002/M005/M034；比旧新 hash、页、签发时点、supersedes、受影响 F/R；仅新上传不撤销正式 M015；旧事实审核不得无条件沿用；完整追溯 PASS_FACT；不一致 CONFLICT；版本不可溯 HD；受理归口/原决定机关分权。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "program-specific-evidence",
      "name": "不同项目类别的结题与验收证据",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r015",
          "title": "重大项目牵头验收时序，A/P1–P3",
          "requirement": "R015 重大项目牵头验收时序，A/P1–P3；T=SRC-001 范围且本校牵头；F=B/其他→NA；U=牵头角色或执行期不明→PC；SRC-001 第25、30–33条；F008/F019/F029/F040；M001/M002/M010；依适用条款分别核财务验收申请、验收准备、自评上报、项目验收的时间点；学校受理与外部通过分开；超期处置交有权机关；日期可核为 PASS_FACT 并另注明是否逾期（逾期事实≠证据冲突）；两权威日期互斥才 CONFLICT；缺回执 NM/SU；科发院重大项目办/主管方核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "重大项目综合绩效自评证据，A/P1/P3",
          "requirement": "R016 重大项目综合绩效自评证据，A/P1/P3；T=该项目有自评义务；F=其他计划/课题并未明确→NA；U=报送责任未定→PC；SRC-001 第30–33条；F021/F022/F029；M007/M010；对自评目标、代表性成果、任务书版本、系统报送回执；自评分数不等于专家验收结论；已报可核 PASS_FACT；现时缺 NM；评价优劣 HD；项目办/主管方。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "重大项目财务前置事实，A 或已明确 B/P1–P3",
          "requirement": "R017 重大项目财务前置事实，A 或已明确 B/P1–P3；T=本计划本阶段要求财务验收；F=财务意见尚属后产→NA；U=课题与项目层级/当期办法不明→PC；SRC-001 第25–29条、SRC-003；F027/F028；M011/M012；核财务决算、审计/验收意见对应项目和阶段，财务章/审计范围；不复核 G07 每笔报销、不把财务验收当科学结题；已有权核 PASS_FACT；应出未出 NM/SU；签章疑点 HD；财务处与主管方。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "校级科研结题程序与项目种类，C1/C2/P1–P4",
          "requirement": "R018 校级科研结题程序与项目种类，C1/C2/P1–P4；T=SRC-002 所辖校级计划；F=省部或横向→NA；U=专项结题表单/签发权未知→PC；SRC-002 第2、4、5、12条；F004–F007/F023/F031；M001/M006/M013/M015；核当前校级批次任务完成材料和归口职责；只在 P2/P4 引入后产意见；SRC-002 不足以确证统一结题清单；基础事实 PASS_FACT；专属要件 PC；正式决定由授权校部门而非模板产生。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "引才科研启动费聘期目标，C2/P1–P3",
          "requirement": "R019 引才科研启动费聘期目标，C2/P1–P3；T=正式引才启动费项目；F=C1 或一般科研→NA；U=合同/人事目标不明→SU；SRC-002 第4、9条；F010/F018–F022；M002/M007/M009；按聘用合同、获准项目目标与产出期逐项核；人员现身份变化不当然撤销原聘期；人事目标与科研任务属不同事实；可核事实 PASS_FACT；目标冲突 CONFLICT；达标裁量 HD；人事处/科研归口核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "2026 校哲社基金分级成果事实，D1/D2/P1",
          "requirement": "R020 2026 校哲社基金分级成果事实，D1/D2/P1；T=2026对应获批一般/青年；F=其他年度/项目→NA；U=成果有效级别或批准号缺→PC/HD；SRC-004/006/018（SRC-018 是2021管理办法索引，未读正文，不作独立门槛）；F004–F006/F024/F025/F039；M008/M009/M028；一般 B2 及以上、青年 C 及以上只按 SRC-006 对应批次核已有权分级记录；学术级别认定不由期刊 OCR 决定；级别记录存在 PASS_FACT；不符者只报条件事实/HD，不能 AI 签“结题不通过”；社科处与分级认定主体。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "2026 校哲社基金成果资助标注和复用，D1/D2/P1",
          "requirement": "R021 2026 校哲社基金成果资助标注和复用，D1/D2/P1；T=使用成果申请该基金结项；F=其他计划→NA；U=多案引用历史/当期约束不清→HD；SRC-006 第3–4部分、SRC-005；F024/F026/F039；M008/M009/M028；核成果项目号、资助标注、同一成果既往使用记录及主题关系；重复使用争议不等同正式科研失信；清楚一致 PASS_FACT；标注冲突 CONFLICT；真实性/重复是否允许 HD，交社科处，涉嫌不端另 G06。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "2026 双一流社科专项承诺成果，E1/E2/P1",
          "requirement": "R022 2026 双一流社科专项承诺成果，E1/E2/P1；T=对应攀登精神/校史专项；F=其他专项/年度→NA；U=获批成果形式未取到→SU/PC；SRC-007 第4部分；F004/F005/F022/F025/F026；M002/M006/M009；对获批申请书的报告、影像或校史研究成果分别核类型、数量和实际材料；“学术/育人价值”须人评，不能设统一打分；形式存在 PASS_FACT；应有缺件 NM；价值判定 HD；社科处/项目评审人。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "成都市社科线下结项成套材料，F1/P1",
          "requirement": "R023 成都市社科线下结项成套材料，F1/P1；T=市社科规划初次纸质结项；F=F2 或其他项目→NA；U=当前申请表版本未确认→PC；SRC-008 第3点；F003/F023–F026/F040；M017/M018；纸质申请表/成果原件与电子可编辑版逐项比对项目号、作者、版本；表格内部隐藏字段在附件未取到前不构造；两种形态相符 PASS_FACT；少当前必交 NM；纸电冲突 CONFLICT；社科处/市社科联。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "成都市社科资助类尾款佐证，F1/P1",
          "requirement": "R024 成都市社科资助类尾款佐证，F1/P1；T=正式资助项目；F=自筹→NA；U=资助属性不可核→PC；SRC-008 第5点；F027/F047；M001/M020；依批文核 F047 才索回执/发票；只核是否具备形式、对应项目及签章证据，不判票据税务/财务真实性；可核事实 PASS_FACT；资助缺 NM；真伪需 HD 转财务/市级机关。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "成都市社科外文成果附件，F1/P1",
          "requirement": "R025 成都市社科外文成果附件，F1/P1；T=本次成果为外文；F=非外文→NA；U=语言/要求版本不明→PC；SRC-008 第5点；F024/F026/F039/F048；M009/M021；逐外文成果核中文译文、相关等级及意识形态证明的校方审阅签章，不能由机器翻译自行代章；齐且可核 PASS_FACT；应有缺 NM；证明权限未核 HD；社科处及有权单位。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "成都市社科线下结项后线上补录，F2/P5",
          "requirement": "R026 成都市社科线下结项后线上补录，F2/P5；T=已有有效线下结项证书；F=仍在 F1→NA；U=证书真实性/签发状态不明→SU/HD；SRC-008 第4点；F024–F026/F031–F033；M018/M019/M015；核市级证书签发者/编号/日期与刊物封面、版权、目录、正文或批示件同一项目；补录仅发生在纸质结项之后；证书和刊物页对应 PASS_FACT；错项目 CONFLICT；已发证源失联 SU；社科处/市级主管。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "教育部人文社科在线初报与财务明细，G1/P1",
          "requirement": "R027 教育部人文社科在线初报与财务明细，G1/P1；T=本年度适用教育部人文社科一般项目结项；F=G2 或其他资助方→NA；U=教育部当期系统/附件版次未核→PC；SRC-009 第1–3点；F023/F027/F040；M022/M023；对在线回执、终结报告和学校财务盖章明细对应批准号/阶段；网址/身份证号登录线索不能当校方身份认证；已可核 PASS_FACT；现时少一项 NM；签章存疑 HD；社科处/财务处。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "教育部人文社科外拨经费明细，G1/P1",
          "requirement": "R028 教育部人文社科外拨经费明细，G1/P1；T=项目实际存在合作外拨经费；F=已核无外拨→NA；U=合同/支出状况未知→SU/HD；SRC-009 第3点；F027/F047；M023/M024；合作方签章直接费用明细与学校财务明细/项目号对照；不重复 G07 的支出核算；有权对应 PASS_FACT；外拨缺 NM；差异 CONFLICT；财务处与合作单位。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "教育部人文社科外文成果摘要，G1/P1",
          "requirement": "R029 教育部人文社科外文成果摘要，G1/P1；T=当前成果为外文；F=无外文→NA；U=外文形式或当期要求不明→PC；SRC-009 第5点；F024/F026/F048；M009/M025；核同一成果的中文名称/摘要与外文原件的标识关联，全文机器翻译不是正式学术评价；一一对应 PASS_FACT；当前必交缺 NM；译文争议 HD；社科处。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "教育部鉴定意见的校方后产责任，G2/P3",
          "requirement": "R030 教育部鉴定意见的校方后产责任，G2/P3；T=经有效程序进入专家通讯/会议鉴定；F=G1 初报未评审→NA；U=鉴定方式/上级程序未核→PC；SRC-009 第6–7点；F030/F040/F041；M014/M026/M027；学校按其权限上传汇总表，个人意见纸件归档；审核专家签章、学校上传版本与本案项目号；禁止向负责人追索校方后产件；已出可核 PASS_FACT；校方应出未出 NM（派校方）、已出但源失联 SU；无权签发 HD；社科处/主管部门。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "横向/地调合同交付与委托确认，H1/P1–P4",
          "requirement": "R031 横向/地调合同交付与委托确认，H1/P1–P4；T=有效科研委托合同已明确交付条件；F=非横向→NA；U=横向管理办法/合同现行效力未确认→PC；SRC-013（未核）及实际有效合同；F008/F009/F016/F022/F026/F031；M002/M009/M033；核合同交付标的、版次、委托方签收/验收角色；收件单≠合同验收结论，T07 只供合同权威状态；有权确认事实 PASS_FACT；双方版本冲突 CONFLICT；法律效力 HD 转 T07/委托方，不能由 T03 批准。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "一般纵向/专门中心项目特定程序，H2/H3/P0–P4",
          "requirement": "R032 一般纵向/专门中心项目特定程序，H2/H3/P0–P4；T=有主管方/研究中心当期有效通知；F=通知不适用该项目→NA；U=仅见旧目录/失联网页→PC/SU；SRC-011–014（待核）；F004–F006/F023/F042；M001/M002/M006/M016；从立项年度、合同与当期通知决定表式/期限；SRC-014 2026 摘要和旧 2017 管理办法不可成硬门槛，不能套用别计划清单；目前多为 PC/SU；取得正式源才允许 PASS_FACT/NM；科发院/社科处/专项中心。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "authority-followup",
      "name": "校内核验、专家意见、正式决定与复核",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r033",
          "title": "校内核验意见、退回补正与复交",
          "requirement": "R033 校内核验意见、退回补正与复交，P2/J1；T=已正式递交后有校方退回/补件事件；F=初报尚未初审→NA；U=该计划是否支持退回待核→PC；SRC-009 第2点（仅教育部明确）、SRC-001/002；F002/F040/F041/F044；M013/M034；校方 M013 产生于提交后，载明退回的材料版；补交 M034 仅替换受影响材料，重审关联 R；不是外部结题否决；改动受影响事实重核 PASS_FACT/CONFLICT/NM；版本不明 HD；原校内受理人。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "专家评价意见真实存在及其归属",
          "requirement": "R034 专家评价意见真实存在及其归属，P3；T=本类别且当前已组织专家评审；F=尚在申请/该计划无评审→NA；U=谁组织评审未知→PC；SRC-001/009；F021/F022/F030/F041；M007/M014；专家组签发记录必须绑定具体目标、项目号与当时材料版本；有意见不代表“专家一致通过”，不由 AI 作学术评分；真实存在 PASS_FACT；签章身份无权 HD；意见与对象冲突 CONFLICT；评审组织方/主管单位。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r035",
          "title": "正式结题/验收决定引用有效性",
          "requirement": "R035 正式结题/验收决定引用有效性，P4/P5；T=已有或需引用正式决定；F=P1/P2 尚未形成→NA；U=签发权/证书状态不可核→SU/HD；SRC-001/002/006–009/013（各依类别）；F009/F031–F033/F046；M015/M019/M032；核决定者、决定对象、文号/电子证书、签发时间、生效/撤销/更正链；初核 M013 和专家 M014 不能等同 M015；仅“存在已核正式文书”PASS_FACT；矛盾 CONFLICT；真实性存疑 HD，原资助/委托/学校授权机关决定。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r036",
          "title": "项目科研绩效业务事实关联，I/P5",
          "requirement": "R036 项目科研绩效业务事实关联，I/P5；T=已有有效项目成果/结题状态需关联学院业务绩效；F=还未产生关联办理→NA；U=现行考核表与分配流程未知→PC；SRC-003 第4条、SRC-004；SRC-010 待核；F031–F033/F037–F039；M015/M028/M029/M030；对项目/成果有效结论、学院业务考核与经审批的分配方案，逐一核签发角色、期间、对象；不得在此计算或支付报酬；可核存在 PASS_FACT；级别/人员分配争议 HD；学院核业务、财务/G07负责支付。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r037",
          "title": "延期、变更申请与正式批准分离，J2/PX",
          "requirement": "R037 延期、变更申请与正式批准分离，J2/PX；T=本次请求变更/延期；F=没有动作→NA；U=该计划申请权限/限期未知→PC；SRC-001/006/007（各限类别）；F017–F020/F034/F035/F040；M002/M005/M031/M032；比申请日、受理回执与计划门槛：D1/D2 提前2个月且至多1次、最长1年；E1/E2 至多1次、最长6个月；获准签发前 F019 保持原有效期限；其他类别不得套期限；申请存在 PASS_FACT≠批准；超期/权限争议 HD，主管/社科处有权者；决定后才更新 F020/F035。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r038",
          "title": "申请撤回、撤项/终止及正式复核，J3/PX",
          "requirement": "R038 申请撤回、撤项/终止及正式复核，J3/PX；T=本次有撤回/终止/事实异议/复核请求；F=仅改普通材料→NA；U=制度没写办理权/期限→PC/HD；SRC-001（局部）、SRC-006/007（局部）；F031/F032/F036/F045/F046；M015/M031/M032；撤回“本次申请”与主管方“项目撤项”类型分离；复核请求引用决定编号与原版，只有原有权机关的新文书能更改既有决定；申请已收到仅 PASS_FACT；不得自动撤项/翻案；校归口核受理权、原决定机关复核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r039",
          "title": "邻接授权业务的权威结论复用",
          "requirement": "R039 邻接授权业务的权威结论复用，P1–P5/PX；T=本案依赖财务、诚信、合同、采购、个人业绩的外部决定；F=不存在该依赖→NA；U=目录/接口或签发权限不明→SU/HD；SRC-003/004/005；G50/R02 原件待核；F026–F028/F031/F037–F039；M011/M012/M015/M028/M029/M030/M033；五元组核对象、决定类型、签发主体、生效状态、版本；不复算 G07 票据、G06 诚信处分、T04 采购、T07 合同、T02-T07 个人绩效；只引用权威事实 PASS_FACT；对象/版本不符 CONFLICT；权威性未核 HD，转实际业务 Owner。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "program-extensions",
      "name": "省级验收、智库与国家社科专项分支",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "r040",
          "title": "省科技计划适用批次与评价方式，H2-SC/P0–P1",
          "requirement": "R040 省科技计划适用批次与评价方式，H2-SC/P0–P1；T=经批准的四川省科技计划前补助项目且本单位角色已核；F=其他计划/非适用资金方式→NA；U=资助方式、金额或试点授权不明→PC；SRC-016 第14、18–21条；F003–F009/F017/F049/F050；M001/M002/M035；对正式任务书、批准资助金额、当期科技厅安排：拟按不超过20万元审核、20万元以上专家，低于100万元的部分符合备案试点可自主；自主验收不是成都理工天然权限，二次核规及备案后才启用；已核类别/模式事实 PASS_FACT；原站/任务书未得 PC/SU；科发院、科技厅项目管理处室、推荐单位核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r041",
          "title": "省科技验收申请与期满节点，H2-SC/P1",
          "requirement": "R041 省科技验收申请与期满节点，H2-SC/P1；T=满足 R040 且进入正式验收申请；F=未到期/其他计划→NA；U=批准期限或适用过渡安排不明→PC；SRC-016 第16、19–20条；F019/F040/F049；M002/M005/M035；按正式执行期及有效延期核候选“期满3个月内提出申请、1年内完成评价”；提早完成须满足原文条件；以省厅可信回执时点为准，不把办件草稿当提交；时点可核 PASS_FACT，仅标明是否超过候选窗口；迟报受理/补救由科技厅裁量 HD，不由系统拒件。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r042",
          "title": "省科技验收财务附件与审计触发，H2-SC/P1–P3",
          "requirement": "R042 省科技验收财务附件与审计触发，H2-SC/P1–P3；T=省科技验收且按官方模式确定财务附件种类；F=本模式不要求该项→NA；U=金额、经费类型或模式未定→PC；SRC-016 第19–21条；F027/F028/F047/F049/F050；M011/M012/M036；审核评价依主管机关接受的经费使用承诺/说明、专家评价按模式引用财务明细；专项经费 100万元及以上专项审计候选仅在专家评价条款下核；不凭财务材料自行作资金合规意见；可验证附件存在与归属 PASS_FACT，已确认必交而缺 NM，金额/方式争议 PC/HD；财务处、审计/科技厅处理。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r043",
          "title": "省科技评价结论/证书的后产引用，H2-SC/P4–P5",
          "requirement": "R043 省科技评价结论/证书的后产引用，H2-SC/P4–P5；T=科技厅/获备案机构已作相应正式评价；F=P1/P2 尚未评→NA；U=签发链/评价方式未知→HD/SU；SRC-016 第19–23条；F031–F033/F049/F051；M015/M037；查验系统内评价结果与确认链、证书对象、是否二次验收及结论版本；“优秀/合格/不合格”必须来自有权系统，专家建议不能冒充终局；仅“正式结果存在且归属匹配”PASS_FACT；原决定机关处理异议，财务结余另 G07。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r044",
          "title": "省科技二次验收、终止、撤销与申诉分流，H2-SC/PX",
          "requirement": "R044 省科技二次验收、终止、撤销与申诉分流，H2-SC/PX；T=确有整改/二次验收、终止申请、科技厅撤销或撤销申诉事件；F=一般补件或初报→NA；U=事件类型/送达日及当期适用细则未核→PC；SRC-016 第24、27–28条；F034–F036/F040/F045/F046/F051；M031/M032/M039；二次验收候选“仅一次、60日内且期满不超过1年”；撤销后申诉候选“30日”；终止申请与科技厅撤销分别有主体/权力；项目负责人撤回初报不等于终止/撤销；仅事件、通知/受理事实 PASS_FACT；逾期、复核与救济是否成立 HD；科技厅原决定机关核；资金退回交财务/G07。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r045",
          "title": "2026特色新型智库团队批示指标事实，E3/P1–P3",
          "requirement": "R045 2026特色新型智库团队批示指标事实，E3/P1–P3；T=SRC-017 2026正式获批项目、当期核结项成果；F=E1/E2 或其他批次→NA；U=批准申请书或领导批示身份/职务无法核→PC/HD；SRC-017 第四部分；F004–F006/F021–F026/F039/F052；M002/M006/M009/M038；按获批合同与批示逐件核学校第一署名单位、真实肯定性批示和层级及数量的候选两条路径；领导身份、批示性质及成果价值由社科处/有权人核，不据 OCR 宣布达标；可核基础归属 PASS_FACT；证明有冲突 CONFLICT；级别/真实性 HD，社科处与有权签批机关核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r046",
          "title": "国家社科项目类别与当期结项表式、项目号，H2-NS/P0–P5",
          "requirement": "R046 国家社科项目类别与当期结项表式、项目号，H2-NS/P0–P5；T=国家社科年度/青年/西部/重大/后期等已核类型；F=其他计划→NA；U=2026有效结项手续未确认→PC；SRC-015、SRC-019、SRC-020、SRC-021（其中 SRC-019 为国家2026申报，不能代结项指南；SRC-020 历史通则时效未核）；F003–F006/F016/F017/F023/F031/F040/F042；M001/M002/M006/M015/M040；将申报年度、任务书的成果与完成期、国家社科项目类别和主管系统受理记录对照；重大/后期资助专表不得用年度/青年清单互替，参考 PDF 份数/复议次数不启用；类别/项目号可核 PASS_FACT；当期规范缺 PC、接口断 SU；社科处、全国社科工作办/有权主管核。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "intake-gate",
      "name": "材料登记、适用范围与安全门禁",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "fact-review",
      "workflowOwner": "local"
    },
    {
      "id": "fact-review",
      "name": "项目事实、材料版本与证据覆盖核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "intake-gate",
      "nextStageId": "authorized-review",
      "workflowOwner": "local"
    },
    {
      "id": "authorized-review",
      "name": "有权人员人工复核与待确认结论",
      "kind": "manual-review",
      "executorRole": "teacher",
      "returnToStageId": "fact-review",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "fact-review-summary",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "follow-up-tasks",
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

export const r02Metadata: R02Metadata = {
  "templateId": "T03-T07",
  "name": "科研项目结题、验收与科研绩效材料审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T03-T07.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T03-T07.md",
  "sourceDocumentSha256": "9bad2ea74fbedaca59f6787b0dbfed379468f7466bfa77afbf721fee589073be",
  "sourceDocumentBytes": 165862,
  "sourceBlobSha": "d29451d7f9322ff67faeff1851f96d6126a52fd9",
  "sourceBranch": "feat/v3-r02-template-library@150acfe761cb7ad0424a2ca009fd57f12dbfddfd",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "sourcePolicyStatus": "\"PARTIALLY_VERIFIED; 校方官网已核若干制度与批次通知，省厅2026规程存在官方原站访问受阻，横向、一般纵向、2026实际批次适用性及校内授权链仍未核\"",
  "policyEvidenceStatus": "PARTIAL",
  "requiresPreUploadSecurityGate": true,
  "secureIntakeEnforcedByTemplateVersion": false,
  "requiredIntegrationGate": "共享 Main/文件导入路径必须在文件选择、落盘、OCR/解析及模型调用前核验保密属性与获准环境；未知/拒绝时不得数字化受理。该门禁属于集成 Owner 所有权，不在本批文件内。",
  "criteria": [
    {
      "sectionId": "project-baseline",
      "criterionId": "r001",
      "sourceRuleId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r002",
      "sourceRuleId": "R002",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r003",
      "sourceRuleId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r004",
      "sourceRuleId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r005",
      "sourceRuleId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r006",
      "sourceRuleId": "R006",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r007",
      "sourceRuleId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006",
        "SRC-007",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r008",
      "sourceRuleId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-010",
        "SRC-011",
        "SRC-012",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r009",
      "sourceRuleId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r010",
      "sourceRuleId": "R010",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r011",
      "sourceRuleId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r012",
      "sourceRuleId": "R012",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r013",
      "sourceRuleId": "R013",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r014",
      "sourceRuleId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r015",
      "sourceRuleId": "R015",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r016",
      "sourceRuleId": "R016",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r017",
      "sourceRuleId": "R017",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r018",
      "sourceRuleId": "R018",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r019",
      "sourceRuleId": "R019",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r020",
      "sourceRuleId": "R020",
      "srcIds": [
        "SRC-004",
        "SRC-006",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r021",
      "sourceRuleId": "R021",
      "srcIds": [
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r022",
      "sourceRuleId": "R022",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r023",
      "sourceRuleId": "R023",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r024",
      "sourceRuleId": "R024",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r025",
      "sourceRuleId": "R025",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r026",
      "sourceRuleId": "R026",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r027",
      "sourceRuleId": "R027",
      "srcIds": [
        "SRC-009"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r028",
      "sourceRuleId": "R028",
      "srcIds": [
        "SRC-009"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r029",
      "sourceRuleId": "R029",
      "srcIds": [
        "SRC-009"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r030",
      "sourceRuleId": "R030",
      "srcIds": [
        "SRC-009"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r031",
      "sourceRuleId": "R031",
      "srcIds": [
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-specific-evidence",
      "criterionId": "r032",
      "sourceRuleId": "R032",
      "srcIds": [
        "SRC-011",
        "SRC-012",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-followup",
      "criterionId": "r033",
      "sourceRuleId": "R033",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-followup",
      "criterionId": "r034",
      "sourceRuleId": "R034",
      "srcIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-followup",
      "criterionId": "r035",
      "sourceRuleId": "R035",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-followup",
      "criterionId": "r036",
      "sourceRuleId": "R036",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-followup",
      "criterionId": "r037",
      "sourceRuleId": "R037",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-followup",
      "criterionId": "r038",
      "sourceRuleId": "R038",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-followup",
      "criterionId": "r039",
      "sourceRuleId": "R039",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-extensions",
      "criterionId": "r040",
      "sourceRuleId": "R040",
      "srcIds": [
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-extensions",
      "criterionId": "r041",
      "sourceRuleId": "R041",
      "srcIds": [
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-extensions",
      "criterionId": "r042",
      "sourceRuleId": "R042",
      "srcIds": [
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-extensions",
      "criterionId": "r043",
      "sourceRuleId": "R043",
      "srcIds": [
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-extensions",
      "criterionId": "r044",
      "sourceRuleId": "R044",
      "srcIds": [
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-extensions",
      "criterionId": "r045",
      "sourceRuleId": "R045",
      "srcIds": [
        "SRC-017"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "program-extensions",
      "criterionId": "r046",
      "sourceRuleId": "R046",
      "srcIds": [
        "SRC-015",
        "SRC-019",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    }
  ]
}

export default templateVersion
