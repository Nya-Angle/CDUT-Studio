import type { TemplateVersion } from '@profer/shared'

export type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'

export interface R02CriterionSourceMetadata {
  sectionId: string
  criterionId: string
  sourceIds: string[]
  evidenceStatus: R02EvidenceStatus
}

export interface R02SourceMetadata {
  sourceId: string
  sourceClass: string
  evidenceStatus: R02EvidenceStatus
  urls: string[]
}

export interface R02TemplateMetadata {
  templateId: string
  name: string
  sourceDocumentPath: string
  sourceDocumentSha256: string
  officialSchoolTemplate: false
  researchStatus: 'RESEARCH_HANDOFF_READY'
  policyEvidenceStatus: 'PARTIAL'
  policyEvidenceNotes: string
  sources: R02SourceMetadata[]
  criteria: R02CriterionSourceMetadata[]
}

export const r02Metadata: R02TemplateMetadata = {
  templateId: "T07-T05",
  name: "单位官方新媒体账号开设、变更及注销审核",
  sourceDocumentPath: "docs/design/review-agent/business-templates/R02/T07-T05.md",
  sourceDocumentSha256: "cd4a07b461493170485edd8137a3c44cb7ec854650b03d3d9b9e7ccdbeef4d34",
  officialSchoolTemplate: false,
  researchStatus: 'RESEARCH_HANDOFF_READY',
  policyEvidenceStatus: 'PARTIAL',
  policyEvidenceNotes: "国家账号规则与部分学校职能事实已核；学校账号专项制度、当前账号台账和签发矩阵未核。",
  sources: [
    { sourceId: "SRC-001", sourceClass: "CDUT-VERIFIED", evidenceStatus: "VERIFIED", urls: ["https://xcb.cdut.edu.cn/index.htm"] },
    { sourceId: "SRC-002", sourceClass: "CURRENTITY-UNKNOWN", evidenceStatus: "PARTIAL", urls: ["https://xcb.cdut.edu.cn/bmgk/bmjj.htm"] },
    { sourceId: "SRC-003", sourceClass: "CURRENTITY-UNKNOWN", evidenceStatus: "PARTIAL", urls: ["https://xcb.cdut.edu.cn/mtcl1/xxgfxmtpt.htm", "https://xcb.cdut.edu.cn/mtcl1/xhxmtpt.htm", "https://media.cdut.edu.cn/"] },
    { sourceId: "SRC-004", sourceClass: "CURRENTITY-UNKNOWN", evidenceStatus: "PARTIAL", urls: ["https://xcb.cdut.edu.cn/info/1023/1148.htm"] },
    { sourceId: "SRC-005", sourceClass: "CURRENTITY-UNKNOWN", evidenceStatus: "PARTIAL", urls: ["https://yb.cdut.edu.cn/info/1074/2904.htm"] },
    { sourceId: "SRC-006", sourceClass: "CURRENTITY-UNKNOWN", evidenceStatus: "PARTIAL", urls: ["https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4011.htm"] },
    { sourceId: "SRC-007", sourceClass: "GENERAL-RESEARCH", evidenceStatus: "VERIFIED", urls: ["https://www.cac.gov.cn/2022-06/26/c_1657868775042841.htm"] },
    { sourceId: "SRC-008", sourceClass: "GENERAL-RESEARCH", evidenceStatus: "VERIFIED", urls: ["https://www.cac.gov.cn/2021-01/22/c_1612887880656609.htm"] },
    { sourceId: "SRC-009", sourceClass: "GENERAL-RESEARCH", evidenceStatus: "VERIFIED", urls: ["https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm"] },
    { sourceId: "SRC-010", sourceClass: "CROSS-SCHOOL-REFERENCE", evidenceStatus: "UNCONFIRMED", urls: ["https://xcb.sisu.edu.cn/gzzd/791bdff1dc7c44d7aab79e6c255d16ee.htm"] },
    { sourceId: "SRC-011", sourceClass: "CDUT-VERIFIED", evidenceStatus: "VERIFIED", urls: ["https://www.cdut.edu.cn/xb2022/info/1759/2248.htm"] },
  ],
  criteria: [
    { sectionId: 'rule-checks', criterionId: "R001", sourceIds: ["SRC-007"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R002", sourceIds: ["SRC-009"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R003", sourceIds: ["SRC-001", "SRC-002", "SRC-003"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R004", sourceIds: ["SRC-001", "SRC-002", "SRC-005", "SRC-009"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R005", sourceIds: ["SRC-003", "SRC-007"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R006", sourceIds: ["SRC-007"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R007", sourceIds: ["SRC-007"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R008", sourceIds: ["SRC-007", "SRC-008"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R009", sourceIds: ["SRC-007"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R010", sourceIds: ["SRC-008", "SRC-009"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R011", sourceIds: ["SRC-008", "SRC-009"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R012", sourceIds: ["SRC-007", "SRC-008"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R013", sourceIds: ["SRC-008", "SRC-009"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R014", sourceIds: ["SRC-001", "SRC-002", "SRC-005", "SRC-006", "SRC-010"], evidenceStatus: "UNCONFIRMED" },
    { sectionId: 'rule-checks', criterionId: "R015", sourceIds: ["SRC-001", "SRC-002", "SRC-005", "SRC-009"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R016", sourceIds: ["SRC-007", "SRC-008"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R017", sourceIds: ["SRC-003", "SRC-006"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R018", sourceIds: ["SRC-001", "SRC-006"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R019", sourceIds: ["SRC-005", "SRC-008"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R020", sourceIds: ["SRC-005", "SRC-008"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R021", sourceIds: ["SRC-009"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R022", sourceIds: ["SRC-008", "SRC-009"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R023", sourceIds: ["SRC-008", "SRC-009"], evidenceStatus: "VERIFIED" },
  ],
}

export const templateVersion: TemplateVersion = {
  templateId: "T07-T05",
  version: 1,
  schemaVersion: 2,
  name: "单位官方新媒体账号开设、变更及注销审核",
  description: "本地研究模板 · 非校方正式模板。依据 R02 研究原稿组织事实核验、材料覆盖和人工待办；不代表成都理工大学已批准采用。当前政策证据状态为 PARTIAL，未确认规则不得自动形成正式通过或拒绝。",
  catalogKind: 'builtin',
  sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非成都理工大学校方正式模板；SRC 仅用于研究来源追踪，不是案卷材料 SourceRef；校本授权与部分现行制度未确认，最终决定由有权人员人工作出。",
  objectType: "organization",
  displayName: { template: '{{title}}' },
  fields: [
    { key: "F001", label: "case_id", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：string，Case.case_id；P0～P5；CASE 案卷主键；系统元数据；I；系统生成失败则停。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F001；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F002", label: "operation_type（开设/变更/注销/补登记）", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：enum，Case.operation_type（开设/变更/注销/补登记）；P0；APPL M001 指定；按对象核；I；问，不能自动推断。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F002；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F003", label: "stage", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：enum，Case.stage；全程；CASE 可信状态机与操作历史；I；停。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F003；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F004", label: "org_id", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：string，OrganizationClaim.org_id；P0/P1；ORG 组织目录 ID，M001 仅为主张；I；核；无接口转人工。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F004；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F005", label: "org_name", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：string，OrganizationClaim.org_name；P0/P1；ORG 正式名称，M001 对照；I；核；与账号主体不一致→冲突。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F005；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F006", label: "actor_id", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：string，OrganizationClaim.actor_id；P0/P3；HOST 可信 Actor，非表单自由文本；P；认证失败停。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F006；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F007", label: "actor_role", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：enum，OrganizationClaim.actor_role；P0/P3；HOST/ORG 当前角色和隶属关系；I；核；不得按学生/教师标签赋权。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F007；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F008", label: "string/ref，OrganizationClaim.agent_mandate", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：string/ref，OrganizationClaim.agent_mandate；P1；ORG/DEC 实际授权，M002 如需；S；未证授权权能→人工。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F008；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F009", label: "account_uid", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：string，AccountSubject.account_uid；P0 已有账号/P4 新账号；PLAT M003/M008 的唯一账号标识；I；新开 N/A；已有缺失则核。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F009；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F010", label: "platform", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：enum，AccountSubject.platform；P0；APPL M001 + PLAT 页面；I；问。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F010；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F011", label: "display_name", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：string，AccountSubject.display_name；P0；M001 拟名或 M003 现名；I；问；更名需新旧对照。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F011；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F012", label: "uri，AccountSubject.public_url", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：uri，AccountSubject.public_url；既有/P4；PLAT M003/M008 官方链接；I；新开 N/A；已有核。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F012；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F013", label: "string/ref，AccountSubject.official_subject", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：string/ref，AccountSubject.official_subject；P0/P1；ORG 机构主体 + PLAT 认证状态，M003†；I；不能仅凭昵称认定。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F013；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F014", label: "string/ref，AccountSubject.admin_identity", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：string/ref，AccountSubject.admin_identity；P1 变更/责任审查；ORG/PLAT 管理员标识，M006；只保留内部 ID；P；核；禁止上传完整证件和凭据。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F014；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F015", label: "enum/ref，AccountSubject.admin_affiliation", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：enum/ref，AccountSubject.admin_affiliation；P1 变更/责任审查；ORG 人事/指导组织核验；P；无接口转人工，不让申请人冗余上传。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F015；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F016", label: "purpose_and_scope", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：text，AccountSubject.purpose_and_scope；P0；APPL M001/M005 的用途、内容类别；I；问；适法性由人判。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F016；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F017", label: "before_after", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：object，ChangeSet.before_after；P0 变更/注销；M003、M007、权威历史台账 M011；I/P；新开 N/A；变更未对齐→冲突。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F017；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F018", label: "date/unknown，ChangeSet.intended_effective_at", kind: "date", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：date/unknown，ChangeSet.intended_effective_at；P0 变更；APPL M001/M007；仅计划日期；I；问或未知；不自定提前天数。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F018；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F019", label: "reason", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：string，ChangeSet.reason；P0 变更/纠错；APPL M001/M007；I；问。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F019；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F020", label: "retirement_plan", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：text，Case.retirement_plan；P0 注销；APPL M009，非平台注销证明；I；非注销 N/A；注销问。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F020；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F021", label: "string/ref，ChangeSet.unit_consent_refs", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：string/ref，ChangeSet.unit_consent_refs；P1 主办单位争议/转移；双方有权单位意见 M004/M016（若适用），与最终 DEC 分开；S；有争议停并转人。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F021；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F022", label: "string/ref，Case.approval_ref", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：string/ref，Case.approval_ref；P3 之后；DEC M012 真实决定 ID、版本/签发者；S；P0～P2 N/A；P3 后待/核。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F022；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F023", label: "string/ref，Case.platform_outcome_ref", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：string/ref，Case.platform_outcome_ref；P4 之后；PLAT M008 或 M010 实际回执；S；P0～P3 N/A；不得伪造。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F023；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F024", label: "int/ref，Case.evidence_revision", kind: "number", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：int/ref，Case.evidence_revision；全程更新；CASE 证据版本/校验哈希；I；版本缺失停；撤销旧结论。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F024；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F025", label: "exception_request_type（补件/撤回/复核/争议）", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：enum，Case.exception_request_type（补件/撤回/复核/争议）；PX；CASE 受控操作，M013/M015/M016；I；非 PX N/A；否则问。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F025；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F026", label: "string/ref，Case.review_ref", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：string/ref，Case.review_ref；PX 复核；DEC/PLAT 有权复核或申诉结果，M016；S；未复核 N/A；待复核不等于通过。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F026；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F027", label: "record_currentity", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：enum，Case.record_currentity；P1/P5；CROSS SRC 时效、M011 台账时间、核验时间；I；旧记录需核；政策未知需人工。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F027；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F028", label: "enum/list，Case.conflict_flags", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：enum/list，Case.conflict_flags；P1～P5；CROSS 主从证据比对输出（不作为事实源）；I；冲突无法消解则停。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F028；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F029", label: "enum/ref，Case.security_incident_type（疑似盗用/认证冒名/凭据暴露/平台冻结/无）", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：enum/ref，Case.security_incident_type（疑似盗用/认证冒名/凭据暴露/平台冻结/无）；P0～P5/PX 发现时；受控安全告警/平台事件 M017；APPL 只能提交风险线索；S；不得询问秘密；未知即安全人工核实，紧急情形优先止损。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F029；原稿政策必填性不自动转成校方强制条件。" },
  ],
  // Number.MAX_SAFE_INTEGER is a technical unbounded sentinel, not a school policy limit.
  materialSlots: [
    { id: "M001", name: "非声称校方表单", purpose: "申请单位/代办人：开户/变更/注销事项说明、目标账号及操作内容；业务受理信息表（非声称校方表单）；P0 当前基本；可用校方真实业务单或受控系统输入替代", requiredElements: ["申请单位/代办人：开户/变更/注销事项说明、目标账号及操作内容；业务受理信息表（非声称校方表单）；P0 当前基本；可用校方真实业务单或受控系统输入替代", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M002", name: "申请单位", purpose: "申请单位：代理/代表资格证明、真实授权引用；P1 条件：代理权不能从可信角色推知；合法替代 ORG/DEC 核验", requiredElements: ["申请单位：代理/代表资格证明、真实授权引用；P1 条件：代理权不能从可信角色推知；合法替代 ORG/DEC 核验", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M003", name: "账号持有人/平台", purpose: "账号持有人/平台：既有账号官方主页、平台 UID、认证主体/控制权可验证摘要；P0 变更、注销、补登记当前基本；新开号 N/A；替代平台 API/受控查询", requiredElements: ["账号持有人/平台：既有账号官方主页、平台 UID、认证主体/控制权可验证摘要；P0 变更、注销、补登记当前基本；新开号 N/A；替代平台 API/受控查询", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M004", name: "意见", purpose: "单位负责人/组织指导单位：主办/归口单位意见（不是最终学校决定）；P1 或 P3 仅条件性：有适用校本要求、权属/组织资格争议才取得；可以由真实有权系统意见记录合法替代，不得替代 M012 最终 DEC", requiredElements: ["单位负责人/组织指导单位：主办/归口单位意见（不是最终学校决定）；P1 或 P3 仅条件性：有适用校本要求、权属/组织资格争议才取得；可以由真实有权系统意见记录合法替代，不得替代 M012 最终 DEC", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M005", name: "拟主办单位", purpose: "拟主办单位：运营目的、内容类别、责任安排、安全机制概要；P1 新开号条件待校本确认；可在 M001 内完整表达，无需重复文件", requiredElements: ["拟主办单位：运营目的、内容类别、责任安排、安全机制概要；P1 新开号条件待校本确认；可在 M001 内完整表达，无需重复文件", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M006", name: "学校人事/组织授权系统", purpose: "学校人事/组织授权系统：管理员的岗位/隶属或组织负责人身份核验；P1 管理员变更、授权争议条件；权威在线查询优先，不要求证件复印件", requiredElements: ["学校人事/组织授权系统：管理员的岗位/隶属或组织负责人身份核验；P1 管理员变更、授权争议条件；权威在线查询优先，不要求证件复印件", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M007", name: "原/新主办或管理员", purpose: "原/新主办或管理员：变更前后差异、移交事项清单/证明；P1 变更当前基本；但学校是否要求专表待核；可以受控交接单/系统事件替代", requiredElements: ["原/新主办或管理员：变更前后差异、移交事项清单/证明；P1 变更当前基本；但学校是否要求专表待核；可以受控交接单/系统事件替代", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M008", name: "平台/运营受托人", purpose: "平台/运营受托人：开户认证成功或资料变更生效凭证；P4 后续；替代平台管理后台受控查验结果", requiredElements: ["平台/运营受托人：开户认证成功或资料变更生效凭证；P4 后续；替代平台管理后台受控查验结果", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M009", name: "账号主办单位", purpose: "账号主办单位：注销理由、计划、对历史内容/档案/用户互动的风险说明；P0 注销当前基本；内容范围/档案细目及强制程度待校本配置", requiredElements: ["账号主办单位：注销理由、计划、对历史内容/档案/用户互动的风险说明；P0 注销当前基本；内容范围/档案细目及强制程度待校本配置", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M010", name: "平台/账号责任单位", purpose: "平台/账号责任单位：注销或关停真实完成记录及台账校正；P4/P5 后续；替代平台受控状态查询 + 有权校内台账", requiredElements: ["平台/账号责任单位：注销或关停真实完成记录及台账校正；P4/P5 后续；替代平台受控状态查询 + 有权校内台账", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M011", name: "学校权威账号台账/历史决定", purpose: "学校权威账号台账/历史决定：原始备案、主体、责任人及旧变更记录；既有账号 P1 条件/系统可查优先；非必须要求申请人上传", requiredElements: ["学校权威账号台账/历史决定：原始备案、主体、责任人及旧变更记录；既有账号 P1 条件/系统可查优先；非必须要求申请人上传", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M012", name: "有权校方审批/备案机构", purpose: "有权校方审批/备案机构：本事项真实书面决定/登记回执；P3 后续；受控正式工作流/有文号或签章的有效文件", requiredElements: ["有权校方审批/备案机构：本事项真实书面决定/登记回执；P3 后续；受控正式工作流/有文号或签章的有效文件", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M013", name: "发起人", purpose: "发起人：补件说明和有问题材料的新版本；P2 条件；以原槽替换版本为主，不必新建无意义独立附件", requiredElements: ["发起人：补件说明和有问题材料的新版本；P2 条件；以原槽替换版本为主，不必新建无意义独立附件", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M014", name: "不含秘密值", purpose: "账号现/新管理责任方：受控凭据交接状态回执（不含秘密值）；P3/P4 管理员变更后续/条件；仅安全系统非秘密状态引用", requiredElements: ["账号现/新管理责任方：受控凭据交接状态回执（不含秘密值）；P3/P4 管理员变更后续/条件；仅安全系统非秘密状态引用", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M015", name: "发起人", purpose: "发起人：撤回请求及理由（按校本流程若适用）；PX 条件，未撤回 N/A；受控操作事件或正式文书可替代", requiredElements: ["发起人：撤回请求及理由（按校本流程若适用）；PX 条件，未撤回 N/A；受控操作事件或正式文书可替代", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M016", name: "申请人/原有权部门/平台", purpose: "申请人/原有权部门/平台：争议或复核申请、账号归属异议、控制权异常相关记录；PX 或 F/H 情形条件；申请理由当前可有，申诉受理回执和调查结论后续生成；可引用原决定", requiredElements: ["申请人/原有权部门/平台：争议或复核申请、账号归属异议、控制权异常相关记录；PX 或 F/H 情形条件；申请理由当前可有，申诉受理回执和调查结论后续生成；可引用原决定", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M017", name: "绝非后台凭据或原始日志包", purpose: "安全管理者/平台：脱敏安全事件指针、平台冻结/盗用提示、最低必要处置状态；绝非后台凭据或原始日志包；任一 P 阶段 K 风险触发才获取，受控安全台账/平台工单/可信人工核验可替代；不得向普通提交人索取密码/验证码", requiredElements: ["安全管理者/平台：脱敏安全事件指针、平台冻结/盗用提示、最低必要处置状态；绝非后台凭据或原始日志包；任一 P 阶段 K 风险触发才获取，受控安全台账/平台工单/可信人工核验可替代；不得向普通提交人索取密码/验证码", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
  ],
  sections: [
    {
      id: 'rule-checks',
      name: '原稿业务规则逐项事实预审',
      description: '规则从本模板研究原稿的 R 编号转译；不是学校正式政策规则。政策/权限未知时输出审阅建议并转人工复核。',
      order: 0,
      required: true,
      criteria: [
    { id: "R001", title: "案卷与操作目标", requirement: "原稿规则 R001：R001 案卷与操作目标 P0–P5；T=新建/继续本案，F=已终结且仅查询，U=目标不明确；SRC-007；F001–F003、F009–F011；M001；CASE 主键绑定本次操作；一个目标=平台+既有UID或拟建标识+机构；APPL 是主张，旧案不能偷偷换 UID；后续注册 UID 在 P4 才回填；对象一致→通过；缺操作类型→NEEDS_MATERIAL 给发起人；换目标→CONFLICT 给案卷管理员。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R002", title: "可信发起 Actor", requirement: "原稿规则 R002：R002 可信发起 Actor P0/PX/P3；T=提交、撤回或签发动作，F=纯只读，U=鉴权失败；SRC-009；F003、F006–F007；M001/M015；HOST 当前会话与服务端角色/操作签名，不采信 M001 自填“职务”；每次关键动作重新验当前会话；读档无须假设发起身份；可信操作身份→通过；HOST 无法查询→SOURCE_UNAVAILABLE 给身份管理员；权限范围不明→NEEDS_HUMAN_DECISION 给有权授权方。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R003", title: "申请组织身份", requirement: "原稿规则 R003：R003 申请组织身份 P0/P1；T=以机构名义申请，F=排除的纯个人账号，U=组织是否为校属未知；SRC-001/002/003；F004–F005、F013；M001/M011†；ORG 正式单位 ID/名称优于自述及媒体名单；历史清单只证曾出现；核单位当前存在/归属，时间以 ORG 当前记录为准；组织对应→通过；两机构主张相冲突→CONFLICT 给组织归口；组织资格校本规则未知→POLICY_UNCONFIRMED 给宣传归口。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R004", title: "代表/代办授权范围", requirement: "原稿规则 R004：R004 代表/代办授权范围 P1/P3；T=提交人非权威直授角色，或 P3 有人以组织名义出决定；F=纯只读/无此代理行为，U=代理关系或签发节点未知；SRC-001/002（职能线索）、SRC-009（数据边界）；F006–F008、F021–F022；P1 M002†、M004†（须有明确校本依据或权属争议）、P3 M012↗；HOST 当前 Actor→ORG 当前任职和代理范围→DEC 实际授权文件；逐比组织/目标账号/操作/时段/撤销状态。M004 单位意见的“有没有”与“应不应该必须有”分开判；SRC-005 不证明审批链；授权事实确可核才 PASS_FACT；有权角色/校本签发要求未知→POLICY_UNCONFIRMED 归宣传归口核制度，个案权限冲突→NEEDS_HUMAN_DECISION 给原组织有权人；不得把 M004 在 B/C/F/G 的 P0 固化为缺件。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R005", title: "平台及账号唯一身份", requirement: "原稿规则 R005：R005 平台及账号唯一身份 P1，P4回填；T=既有账号或新号注册完成，F=未注册新号 P0–P3，U=账号唯一性无法建立；SRC-003/007；F009–F012；M003/M008↗/M011†；比较平台类型、不可混淆 UID、规范化官方 URL；PLAT 当前可验证标识高于截图，名称相同不是 UID 相同；新号 P0 无 UID 合法；同一账号→通过；UID 冲突→CONFLICT 给账号核验人；新开号尚无 UID→NOT_APPLICABLE。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R006", title: "机构认证/账号主体对应", requirement: "原稿规则 R006：R006 机构认证/账号主体对应 P1/P4；T=声称既有官方主体或完成平台认证，F=拟新开号尚未认证，U=平台不提供主体可核信息；SRC-007 第7–11、13条；F004–F005、F013；M003/M008↗/M011†；将 ORG 正式名与 PLAT 认证主体比较；平台认证只能证明平台层，学校开办许可另由 R014/15；按当前认证快照、撤销状态核时效；对应→通过；主体不一致→CONFLICT 给账号主办单位；平台身份查不到→SOURCE_UNAVAILABLE 给受控平台核验员。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R007", title: "拟用单位名称/标识真实性", requirement: "原稿规则 R007：R007 拟用单位名称/标识真实性 P0/P1；T=新开号或更名/头像/机构标识，F=只更换管理员且公开号不变，U=是否使用校名不清；SRC-007 第7–10条；F005、F011、F013、F017；M001/M003/M007†；对比正式机构名称、拟用账号昵称/头像声明，不做图像主观“校徽授权”；APPL/图片为主张，ORG 为权威；校徽许可属于人工权限裁量；字面一致仅通过事实；可能仿冒→CONFLICT/NEEDS_HUMAN_DECISION 给宣传归口；校名使用许可标准未知→POLICY_UNCONFIRMED。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R008", title: "账号用途/内容类别表述", requirement: "原稿规则 R008：R008 账号用途/内容类别表述 P0/P1；T=开设或用途变化，F=仅普通管理员更换，U=用途未描述；SRC-007 第11条、SRC-008 第15–16条；F016、F017；M001/M005†/M007†；核用途是否与申请说明、拟登记的内容类别相同；APPL 只能证“已声明”，对教育类资质/特殊信息服务许可不得自行判合法；内容类别规则以平台最新要求另核；表述完整一致→通过陈述事实；当前说明缺→NEEDS_MATERIAL 给发起人；是否可运营→NEEDS_HUMAN_DECISION 给归口/平台。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R009", title: "变更前后值和版本链", requirement: "原稿规则 R009：R009 变更前后值和版本链 P1；T=账号资料/责任人变更或历史纠错，F=新开号、单纯注销，U=旧版本未知；SRC-007 第10条；F009、F017–F019、F024；M003/M007/M011†；锁 UID，比较旧值来源与新值；要求解释变更目的，区别“拟生效”与“已生效”；旧台账在新权威记录出现后只作历史；不得复制旧比较结论；前后可追→通过；差异冲突→CONFLICT 给账号管理员；无旧权威源→SOURCE_UNAVAILABLE 或人审；未变更→N/A。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R010", title: "管理员身份及单位隶属", requirement: "原稿规则 R010：R010 管理员身份及单位隶属 P1；T=管理员/责任人变化或控制权争议，F=无人员变化且无风险，U=人员角色无法核实；SRC-008 第16条、SRC-009；F014–F015、F017；M003/M006†/M007；ORG 在职/组织隶属核验优于个人上传证件；PLAT 只证后台控制权；对照新旧管理员及实际单位，当前状态优先于旧截图；CDUT 任职门槛未核；隶属可核→通过事实；身份不符→CONFLICT 给人事/主办单位；管理员资格标准→POLICY_UNCONFIRMED 给归口。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R011", title: "受控交接完成事实", requirement: "原稿规则 R011：R011 受控交接完成事实 P4；T=管理员变更已获真实办理授权并进入交接，F=无管理员交接/仍在 P0–P3，U=安全渠道不可用；SRC-008 第16条、SRC-009 第51条；F014–F015、F023；M007/M014↗；只读取受控密码/权限交接的非秘密状态及新旧主体；不从截图猜密码已交；受控系统回执优先，状态核验时间不得早于交接；完成状态可核→通过；未完成为NEEDS_HUMAN_DECISION给账号安全管理员；安全源失联→SOURCE_UNAVAILABLE；早期 N/A。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R012", title: "运营主体转移双方权属", requirement: "原稿规则 R012：R012 运营主体转移双方权属 P1（平台动作 P4 交 R016）；T=主办/运营单位或平台认证主体变动，F=原主办与认证主体均不变，U=是更名还是转让不清；SRC-008 第11条、SRC-007 第7–10条；F004–F005、F013、F017、F021；M003/M007/M011†、M004†（有证据条件才触发）、M016†；固定 UID，区分仅名称更改与账号使用权/运营主体转让；比旧/新 ORG 及各自声明、权威权属来源，平台转让需运营者向平台提出申请、平台认证受让方并公示主体变更，操作结果 P4 由 R016 核；是否准许校内转移仍人审；两方权属陈述及目标对应可核仅 PASS_FACT；双方证据矛盾→CONFLICT 给双单位；学校是否允许/谁同意→POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；无平台转让回执不能声称已转让。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R013", title: "停用/注销意向与内容处置计划", requirement: "原稿规则 R013：R013 停用/注销意向与内容处置计划 P0/P1；T=拟停用或永久注销，F=非终止运营，U=暂停/永久终止不明；SRC-008 第11条、第16/19条，SRC-009 第19/51条；F009、F017、F020；M001/M003/M009；逐 UID 区分暂时停用、平台终止服务、学校撤销备案、内容删档四种不同对象；检查理由、影响范围、计划版本与必要留存/交接提示是否表达；平台停用需真实向平台申请，P4 才核结果；不能从国家法生成校内具体档案年限；当前计划可核仅 PASS_FACT；计划目标冲突→CONFLICT；校内保存与授权标准未知→POLICY_UNCONFIRMED 给档案/宣传归口；不得自动清理资料。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R014", title: "校本制度现行性与适用链", requirement: "原稿规则 R014：R014 校本制度现行性与适用链 P1/P3；T=需判成都理工是否允许此组织/操作/签批或备案，F=纯查询不请求校内许可，U=制度现行性未知；SRC-001/002/005/006（全部是职能/制度存在性线索，不是可执行账号条款）；F002–F005、F027；M001、M004†（只在实际有条件时）、M012↗；必须取得 CDUT 规范原文、文号、施行/废止链、对应组织和操作的条款、解释人；未取得前所有校本配额/时限/权限门槛为配置空值。SRC-010 外校阈值绝不启用；当前必为 POLICY_UNCONFIRMED（就校方具体开户链）；归学校宣传/制度管理方。不能反将 M004/M012 的不存在报普通 NEEDS_MATERIAL，不能以其它 R 事实 PASS 覆盖。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R015", title: "校内正式决定真实性及权限匹配", requirement: "原稿规则 R015：R015 校内正式决定真实性及权限匹配 P3/P5；T=到决定/备案登记环节或有人声称存在学校决定，F=P0–P2 尚无决定阶段/无签发主张，U=签发权或有效性未知；SRC-001/002/005（仅职能线索）、SRC-009（个人信息）；F006–F008、F022、F024；M012↗、M004†（校本确需或权属争议时）；只接纳 DEC 受控真决定，逐比 decisionId/issuerActor/issuerOrg/authorityBasis/operation/accountKey/signedAt/effectiveAt/revocationStatus/sourceVersion/currentRunRef；同时核本校权限条款，证明 OCR 印章“像真”不够；没有现行权限依据不能 PASS；实际签发者、条款、文书和目标全匹配才 PASS_FACT（仅证明真决定存在及适用）；校本权限未核→POLICY_UNCONFIRMED，可读文书但需真授权解释→NEEDS_HUMAN_DECISION；文书缺失且当阶段依法明确需有→NEEDS_MATERIAL 归 DEC Owner；P0–P2 N/A。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R016", title: "平台实际操作结果", requirement: "原稿规则 R016：R016 平台实际操作结果 P4/P5；T=开户注册/信息变更/注销已执行，F=动作未启动，U=回执不可得；SRC-007 第9–17条、SRC-008；F009、F012–F013、F023；M008↗/M010↗；PLAT 真实操作号、账号 UID、时间、状态；学校审批文件不能代替平台生效、申请计划不等于实际注销；优先当前官方记录；确认生效→通过平台事实；截图与平台相冲→CONFLICT；平台源失联→SOURCE_UNAVAILABLE 给受控运营员。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R017", title: "账号台账当前性和归档归属", requirement: "原稿规则 R017：R017 账号台账当前性和归档归属 P5（P1 可查旧记录）；T=需要结案/历史校正，F=未到归档且无旧记录需求，U=台账管理者不明；SRC-003/006；F009、F013、F023、F027；M003/M008↗/M010↗/M011†；学校当前台账与 PLAT 真实状态、目标单位、有效决定比对；官网静态名单只供线索；台账时间、撤销状态与本案版本绑定；台账一致→通过事实；账实冲突→CONFLICT 给台账 Owner；无法访问→SOURCE_UNAVAILABLE；不得据此伪造已归档。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R018", title: "邻接模板有效决定引用", requirement: "原稿规则 R018：R018 邻接模板有效决定引用 P1/P3；T=本案确需消费公文/网站/宣传/科研公开/合同等他项真决定，F=无交叉权威对象，U=决定范围不清；SRC-001/006（职责线索，不产生转引义务）；F008、F013、F021–F022；M002†/M004†/M011†/M012↗（只在被引用时）；按实读 R02 总账核 T07-T01/02/03/04/06/07 与 T03-T03、T04-T03，按审计核 G01、g06-t05/t06、G02、G03 等；只对 originTemplate/decisionId/issuer/authorityBasis/scope/target/version/effective/revoked 读并比引用适用性，不重审正文/合同实质/科研公开权利。若无他项决定且并不被政策证明必需，触发 F→N/A；已签他项决定及范围吻合→PASS_FACT（只证引用）；失效/错账号→CONFLICT；权威接口不可得→SOURCE_UNAVAILABLE；是否法定前置不明→POLICY_UNCONFIRMED，不得要求无谓多跑模板。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R019", title: "撤回请求及阶段边界 PX", requirement: "原稿规则 R019：R019 撤回请求及阶段边界 PX；T=用户真实发起撤回，F=无撤回请求，U=原阶段/已执行操作不明；SRC-005（校本程序未核）、SRC-008 第20条仅平台救济；F001–F003、F023–F025；M015/M008†/M010†；HOST 可信请求、CASE 版本、已存在的 DEC/PLAT 状态；撤回申请≠撤销已生效许可或外部操作；不能引入外校撤回截止；请求可核→通过“已请求”事实；能否允许撤回→POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION 给原审批主体；不可自动回滚。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R020", title: "异议/复核渠道与原决定 PX", requirement: "原稿规则 R020：R020 异议/复核渠道与原决定 PX；T=有正式异议/复核请求，F=无异议，U=申诉类型/原决定不清；SRC-008 第20条（平台）、SRC-005（校内未核）；F001、F022、F025–F026；M011†/M012†/M016；将学校审批复核与平台服务投诉分开；请求者、原决定 ID、变更版本、复核结论签发人各需独立可信证据；申请提出时 M016 回执/结论尚未生成；请求及原对象可核→通过请求事实；校本复核途径未知→POLICY_UNCONFIRMED 给归口；复核后仅权威决定可改变正式状态。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R021", title: "材料版本、归属与影响集", requirement: "原稿规则 R021：R021 材料版本、归属与影响集 P0–P5/PX；T=任一原槽证据/权威记录/政策版本更新或被引用，F=只读且输入不变，U=版本/归属标识丢失；SRC-009 第8/51条；F001、F009、F017、F024、F028；M001/M003/M007/M011/M013 仅可选变更说明/M017† 及其余实际被换版本的原槽；CASE 校验 caseId,slotId,targetPlatform,accountUid或provisionalKey,sourceOwner,sourceVersion,receivedAt,stage,contentHash；补件优先替换被指出的原 M 槽（如 M003 v1→v2），M013 不作重复必交；冻结当前 Plan/Run 后计算 R←F/M/SRC 影响闭包，只重审依赖 R，旧 Run 标过期不冒充现行结果；版本归属连贯→PASS_FACT；异号跨案覆盖→CONFLICT 给案卷管理员；源版本丢失→SOURCE_UNAVAILABLE，停用相应旧发现并定向补证。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R022", title: "凭据隔离与个人信息最小化 全阶段", requirement: "原稿规则 R022：R022 凭据隔离与个人信息最小化 全阶段；T=涉及管理员证明、交接、截图、告警或导出，F=经安全分类证明无相关数据，U=文件敏感性无法判明；SRC-009 第5–9/28/51条、SRC-008 第16条；F006、F008、F014–F015、F024、F029；M002/M003/M006†/M014↗/M017†；上传前做允许范围判断，只存最小身份核验状态及安全渠道引用；凭据、验证码、Cookie、私钥、完整身份证影像不得进入普通材料仓/OCR/LLM/索引/导出；若已误入仓，立即隔离、停止传播、保留非秘密审计号并移交有权安全处理，不在 Issue 里回显秘密；合规处理事实可核→PASS_FACT；疑似秘密入仓→NEEDS_HUMAN_DECISION 给安全管理员，先隔离；无法安全读→UNREADABLE，但不为识别秘密而触发不必要 OCR。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R023", title: "账号安全异常及应急交接 全阶段", requirement: "原稿规则 R023：R023 账号安全异常及应急交接 全阶段；T=F029 标记盗用/冒名/泄露/平台冻结/异常控制权，F=可信记录明确无事件，U=无法确证风险是否存在；SRC-008 第16/18/19条、SRC-009 第51/57条；F009、F023、F029；M017†、M003†；从安全受控事件只读核 platform+UID+eventId+status+observedAt+owner，与本案目标比对；紧急止损不等待本模板审批通过，后续校内关停/注销另走 R013–R017；不索取原始凭据、完整安全日志、攻击过程；事件已登记且正确关联→PASS_FACT（仅事实）；账号不一致→CONFLICT 给安全/平台 Owner；安全源不可达→SOURCE_UNAVAILABLE；是否恢复/关停/通知及责任追究→NEEDS_HUMAN_DECISION 给真正有权机构；明确无事件 N/A。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
      ],
    },
  ],
  policyVersionIds: [],
  stages: [
    { id: "p0-draft", name: "P0 起草", kind: "manual-review", executorRole: "reviewer", workflowOwner: 'local', nextStageId: "p1-p2-review" },
    { id: "p1-p2-review", name: "P1 受理前置核验 / P2 补件与修订（按触发）", kind: "manual-review", executorRole: "reviewer", workflowOwner: 'local', nextStageId: "p3-decision" },
    { id: "p3-decision", name: "P3 校内意见/决定（节点待校本证实）", kind: "manual-review", executorRole: "teacher", workflowOwner: 'local', nextStageId: "p4-platform" },
    { id: "p4-platform", name: "P4 平台办理", kind: "handoff", executorRole: "reviewer", workflowOwner: 'local', nextStageId: "p5-archive" },
    { id: "p5-archive", name: "P5 结果登记/归档", kind: "finalize", executorRole: "teacher", workflowOwner: 'local' },
  ],
  outputs: [
    { id: 'review-feedback', kind: 'item-feedback', audience: 'reviewer' },
    { id: 'supplement-checklist', kind: 'supplement-list', audience: 'teacher' },
  ],
  autoPassPolicy: { enabled: false },
  status: 'draft',
  createdAt: '2026-10-24T00:00:00.000Z',
}

export default templateVersion
