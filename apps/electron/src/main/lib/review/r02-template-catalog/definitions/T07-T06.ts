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
  templateId: "T07-T06",
  name: "非科研专属官方公告、新闻及宣传发布审核",
  sourceDocumentPath: "docs/design/review-agent/business-templates/R02/T07-T06.md",
  sourceDocumentSha256: "e9c58de2186afff3e5cf7630b67a8fd91412765c9c89e02ade33035d42d52970",
  officialSchoolTemplate: false,
  researchStatus: 'RESEARCH_HANDOFF_READY',
  policyEvidenceStatus: 'PARTIAL',
  policyEvidenceNotes: "国家信息公开、保密、个人信息、著作权与肖像权规则可追踪；成都理工大学现行新闻舆论制度全文与岗位授权矩阵未核。",
  sources: [
    { sourceId: "SRC-001", sourceClass: "CDUT-VERIFIED", evidenceStatus: "VERIFIED", urls: ["https://xcb.cdut.edu.cn/bmgk/bmjj.htm"] },
    { sourceId: "SRC-002", sourceClass: "CDUT-VERIFIED", evidenceStatus: "VERIFIED", urls: ["https://yb.cdut.edu.cn/info/1074/2904.htm"] },
    { sourceId: "SRC-003", sourceClass: "CDUT-VERIFIED", evidenceStatus: "VERIFIED", urls: ["https://www.cdut.edu.cn/info/1061/5724.htm"] },
    { sourceId: "SRC-004", sourceClass: "CDUT-VERIFIED", evidenceStatus: "VERIFIED", urls: ["https://news.cdut.edu.cn/info/1014/42928.htm"] },
    { sourceId: "SRC-005", sourceClass: "CDUT-VERIFIED", evidenceStatus: "VERIFIED", urls: ["https://dbxb.cdut.edu.cn/xxgkwz/info/1008/4011.htm"] },
    { sourceId: "SRC-006", sourceClass: "CURRENTITY-UNKNOWN", evidenceStatus: "PARTIAL", urls: ["https://news.cdut.edu.cn/info/1004/5800.htm"] },
    { sourceId: "SRC-007", sourceClass: "CURRENTITY-UNKNOWN", evidenceStatus: "PARTIAL", urls: ["https://dbxb.cdut.edu.cn/xxgkwz/gkzn.htm"] },
    { sourceId: "SRC-008", sourceClass: "CDUT-VERIFIED", evidenceStatus: "VERIFIED", urls: ["https://www.cdut.edu.cn/info/1366/7658.htm"] },
    { sourceId: "SRC-009", sourceClass: "CDUT-VERIFIED", evidenceStatus: "VERIFIED", urls: ["https://cmcc.cdut.edu.cn/info/1036/2206.htm"] },
    { sourceId: "SRC-010", sourceClass: "GENERAL-RESEARCH", evidenceStatus: "VERIFIED", urls: ["https://www.moe.gov.cn/jyb_xxgk/xxgk/zhengce/guizhang/202112/t20211206_585101.html"] },
    { sourceId: "SRC-011", sourceClass: "GENERAL-RESEARCH", evidenceStatus: "VERIFIED", urls: ["https://www.moe.gov.cn/srcsite/A01/s7048/201005/t20100512_171909.html"] },
    { sourceId: "SRC-012", sourceClass: "GENERAL-RESEARCH", evidenceStatus: "VERIFIED", urls: ["https://www.ssf.gov.cn/portal/rootfiles/2024/03/25/1713038527579105-1713038527601412.pdf"] },
    { sourceId: "SRC-013", sourceClass: "CDUT-VERIFIED", evidenceStatus: "VERIFIED", urls: ["https://xsc.cdut.edu.cn/info/1046/4456.htm"] },
    { sourceId: "SRC-014", sourceClass: "CDUT-VERIFIED", evidenceStatus: "VERIFIED", urls: ["https://youth.cdut.edu.cn/__local/A/5C/21/DF3711439D4EB3D979DC574B6DD_CA5772CB_7DF50.pdf"] },
    { sourceId: "SRC-015", sourceClass: "CDUT-VERIFIED", evidenceStatus: "VERIFIED", urls: ["https://cmcc.cdut.edu.cn/info/1036/7041.htm", "https://cmcc.cdut.edu.cn/__local/1/62/5B/799E0C13618DBE4F6550A63B850_7E721A30_14D3A.pdf"] },
    { sourceId: "SRC-016", sourceClass: "CDUT-VERIFIED", evidenceStatus: "VERIFIED", urls: ["https://news.cdut.edu.cn/info/1005/53299.htm"] },
    { sourceId: "SRC-017", sourceClass: "GENERAL-RESEARCH", evidenceStatus: "VERIFIED", urls: ["https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm"] },
    { sourceId: "SRC-018", sourceClass: "GENERAL-RESEARCH", evidenceStatus: "VERIFIED", urls: ["https://fjca.miit.gov.cn/zwgk/zcwj/wjfb/art/2020/art_3fd5e3c5e6624d95af229036f95e20d3.html"] },
    { sourceId: "SRC-019", sourceClass: "GENERAL-RESEARCH", evidenceStatus: "VERIFIED", urls: ["https://www.moj.gov.cn/pub/sfbgw/zwgkztzl/2025nianzhuanti/2025mfdxcy/2025mfdxcy_mfdql/202505/t20250507_518708.html"] },
    { sourceId: "SRC-020", sourceClass: "CROSS-SCHOOL-REFERENCE", evidenceStatus: "UNCONFIRMED", urls: ["https://www.wuyiu.edu.cn/xcb/2022/0927/c125a65353/page.htm"] },
  ],
  criteria: [
    { sectionId: 'rule-checks', criterionId: "R001", sourceIds: ["SRC-001", "SRC-005"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R002", sourceIds: ["SRC-001", "SRC-009"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R003", sourceIds: ["SRC-001", "SRC-013", "SRC-014"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R004", sourceIds: ["SRC-004"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R005", sourceIds: ["SRC-004", "SRC-009"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R006", sourceIds: ["SRC-001", "SRC-003", "SRC-005"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R007", sourceIds: ["SRC-001", "SRC-003", "SRC-005"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R008", sourceIds: ["SRC-005", "SRC-008"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R009", sourceIds: ["SRC-004", "SRC-009"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R010", sourceIds: ["SRC-004", "SRC-018"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R011", sourceIds: ["SRC-004", "SRC-006"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R012", sourceIds: ["SRC-005", "SRC-007", "SRC-008", "SRC-010"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R013", sourceIds: ["SRC-001", "SRC-008"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R014", sourceIds: ["SRC-004", "SRC-010", "SRC-011", "SRC-012"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R015", sourceIds: ["SRC-014"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R016", sourceIds: ["SRC-001", "SRC-002", "SRC-003", "SRC-006"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R017", sourceIds: ["SRC-002", "SRC-006", "SRC-007"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R018", sourceIds: ["SRC-001", "SRC-002", "SRC-011"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R019", sourceIds: ["SRC-001", "SRC-004"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R020", sourceIds: ["SRC-001", "SRC-004"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R021", sourceIds: ["SRC-003", "SRC-004"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R022", sourceIds: ["SRC-001", "SRC-004"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R023", sourceIds: ["SRC-001", "SRC-008"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R024", sourceIds: ["SRC-002", "SRC-008"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R025", sourceIds: ["SRC-003", "SRC-011"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R026", sourceIds: ["SRC-001", "SRC-004"], evidenceStatus: "VERIFIED" },
    { sectionId: 'rule-checks', criterionId: "R027", sourceIds: ["SRC-001", "SRC-003"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R028", sourceIds: ["SRC-007", "SRC-008", "SRC-010", "SRC-011"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R029", sourceIds: ["SRC-010", "SRC-017"], evidenceStatus: "PARTIAL" },
    { sectionId: 'rule-checks', criterionId: "R030", sourceIds: ["SRC-017", "SRC-019"], evidenceStatus: "PARTIAL" },
  ],
}

export const templateVersion: TemplateVersion = {
  templateId: "T07-T06",
  version: 1,
  schemaVersion: 2,
  name: "非科研专属官方公告、新闻及宣传发布审核",
  description: "本地研究模板 · 非校方正式模板。依据 R02 研究原稿组织事实核验、材料覆盖和人工待办；不代表成都理工大学已批准采用。当前政策证据状态为 PARTIAL，未确认规则不得自动形成正式通过或拒绝。",
  catalogKind: 'builtin',
  sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非成都理工大学校方正式模板；SRC 仅用于研究来源追踪，不是案卷材料 SourceRef；校本授权与部分现行制度未确认，最终决定由有权人员人工作出。",
  objectType: "document",
  displayName: { template: '{{title}}' },
  fields: [
    { key: "F001", label: "不透明标识", kind: "text", required: false, visibility: "internal", scope: "case", extractionHint: "原稿字段定义与约束：caseId：不透明标识；PublicationCase；P0 起；S；案卷记录/M001 关联；L1；S 分配；无可靠主案则阻止跨案挂证据，HU。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F001；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F002", label: "枚举 A–I / 叠加分支", kind: "text", required: false, visibility: "internal", scope: "case", extractionHint: "原稿字段定义与约束：scenarioType：枚举 A–I / 叠加分支；PublicationCase；P0；U 经校对；M001 稿型描述；L1；NM；触发条件未知需人工分流，不套默认。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F002；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F003", label: "组织引用", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：originUnitId：组织引用；ActorAndChannel；P0；O 优先，U 候选；M005 单位/账号权威信息；L1；HU/SU；不能凭印章图片确定单位。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F003；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F004", label: "可信主体引用", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：initiatorActorId：可信主体引用；ActorAndChannel；P0/各操作；O/后台会话；M005 操作会话/授权事件；L2；HU/SU；Renderer actorId 不可信。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F004；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F005", label: "结构化委托、范围和有效期", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：proxyAuthority：结构化委托、范围和有效期；ActorAndChannel；P0 条件；O/A 或 D 待核；M006 代理授权；L2；代理时 NM+HU；非代理 NA。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F005；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F006", label: "作者/代办人类别及学段", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：creatorIdentityClass：作者/代办人类别及学段；ActorAndChannel；P0 条件；O/D、U 线索；M006 或 M002 署名；L2；学段不影响普通稿件条件时 NA；不得凭自称赋权。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F006；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F007", label: "单位/账号/栏目引用", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：targetChannel：单位/账号/栏目引用；ActorAndChannel；P0；O 优先，U 待核；M001+M005 频道归属；L1；NM+HU/SU；非校方渠道不能按本案准发。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F007；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F008", label: "受众、地域、平台范围", kind: "text", required: false, visibility: "internal", scope: "case", extractionHint: "原稿字段定义与约束：audienceAndScope：受众、地域、平台范围；PublicationCase；P0；U，A 终审固定；M001 与 M014；L1；NM；跨渠道不自动继承批准范围。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F008；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F009", label: "日期时区/时段，可空", kind: "text", required: false, visibility: "internal", scope: "case", extractionHint: "原稿字段定义与约束：proposedPublishAt：日期时区/时段，可空；PublicationCase；P0；U；M001；L1；无固定时限时可空；若内容含截止日则需核事实。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F009；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F010", label: "普通/紧急及事实说明", kind: "text", required: false, visibility: "internal", scope: "case", extractionHint: "原稿字段定义与约束：urgencyReason：普通/紧急及事实说明；PublicationCase；P0 条件；U，A 判断；M001、必要时 M022；L1/L2；不急 NA；急件缺有权指示 HU/PC，不自动豁免。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F010；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F011", label: "文本", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：contentTitle：文本；ContentVersion；P0；D/U；M002 标题；L0/L1；NM 或 UNREADABLE；不得从旧稿自动代用。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F011；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F012", label: "正文/附件结构引用", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：contentBody：正文/附件结构引用；ContentVersion；P0；D/U；M002 稿件页段/对象；L1，含敏感内容升 L2/L3；NM/UNREADABLE；L3 不吸入通用审核。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F012；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F013", label: "SHA/版本/来源时间", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：draftFingerprint：SHA/版本/来源时间；ContentVersion；每次写稿；S（附 D）；M002 对象版本元数据；L1；重算；不能与审签版本绑定时 HU。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F013；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F014", label: "署名/作者/摄制者列表", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：creditAndContributor：署名/作者/摄制者列表；ContentVersion；P0/P1；D/U，D 核；M002 署名、M008 权利说明；L1/L2；有署名需求而缺则 NM；版权不是署名即授权。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F014；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F015", label: "事实来源单位引用", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：factOwnerUnit：事实来源单位引用；OriginEvidence；P0/P1；O/X 或 D；M003/M004；L1；关键事实找不到责任源 HU/SU。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F015；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F016", label: "时间地点及粒度", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：eventTimePlace：时间地点及粒度；OriginEvidence；P1 条件；X/D；M003、M002 对应句；L0/L1；与原件冲突 CONFLICT；无事件型事实 NA。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F016；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F017", label: "事实项、值、段落、重要性", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：claimLedger：事实项、值、段落、重要性；OriginEvidence；P1；S 抽取+D/X 核验；M002 段落→M003/M004；L1/L2；核不了事实 HU/NM；不得作真实认定。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F017；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F018", label: "URL/记录 ID/文号", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：sourceDocRef：URL/记录 ID/文号；OriginEvidence；P1；X/D；M003 来源定位；L1；NM，权威源失联 SU；网页截图非自动权威。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F018；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F019", label: "形成、生效、查询时点", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：sourceEffectiveAt：形成、生效、查询时点；OriginEvidence；P1；X/D；M003 元信息或 M010；L1；关键时序不明 HU；过期不默认为现行。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F019；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F020", label: "图/音/视频明细及哈希", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：assetManifest：图/音/视频明细及哈希；ContentVersion；P0/P1 条件；D+S；M007 文件清单；L1/L2；有素材却无清单 NM；文件损坏 UNREADABLE。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F020；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F021", label: "权利人、许可用途/期限/渠道", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：mediaRightScope：权利人、许可用途/期限/渠道；OriginEvidence；P1 条件；D/人工核证；M008 使用许可页；L2；有第三方素材无有效授权 HU/NM；纯自有无外部素材按实际 NA。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F021；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F022", label: "涉及主体、用途、同意或其他适用合法基础标记", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：personalInfoDisclosure：涉及主体、用途、同意或其他适用合法基础标记；OriginEvidence；P1 条件；D/专业核证；M024 脱敏版本/专业结论；SRC-017；L2，敏感原件不入库；无需个人信息 NA；有争议 HU，禁止自动准发；不把“缺同意书”一律认定违法。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F022；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F023", label: "原始链接/授权范围", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：repostSourceAndPermission：原始链接/授权范围；OriginEvidence；P1 条件；D/外部权利源；M009 源稿、许可；L1/L2；D 情形 NM/HU；非转载 NA。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F023；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F024", label: "源单位意见、签发者、版本", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：originFactAttestation：源单位意见、签发者、版本；OriginEvidence；P1/P2；X/A 或 D 核验；M004；L2；关键事实未核 HU/NM/SU，不以作者签名替代。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F024；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F025", label: "原业务有效结论 ID、状态、时点", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：upstreamDecision：原业务有效结论 ID、状态、时点；OriginEvidence；P1/P2 条件；X/A；M010 正式决定引用；L2；E/I 必需时无结论 HU/SU，不重审原业务。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F025；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F026", label: "G/S/T 目标、对象及版本", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：adjacentBusinessRef：G/S/T 目标、对象及版本；OriginEvidence；P1 条件；X/S 路由核对；M010 外部结论引用；L1/L2；可判不适用 NA；类型不明 PC/HU。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F026；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F027", label: "可公开/待审的专业核验引用", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：secrecyReviewRef：可公开/待审的专业核验引用；ReviewDecision；P2；A/保密有权源；M011，不复制涉密原文；L2/L3 排除正文；未经可信核证 HU/SU；不由关键词检测给“已通过”。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F027；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F028", label: "活动、学院与校级审核链", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：specialCampaignReview：活动、学院与校级审核链；ReviewDecision；P2 条件；A/D 核验；M013；2025 专项见 SRC-014；L2；只有专项命中时按该通知核；其他 NA/PC。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F028；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F029", label: "校稿、修改意见、责任者", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：editorialReviewTrail：校稿、修改意见、责任者；ReviewDecision；P2；A；D 初始线索；M012；L2；缺当前校规要求的环节 HU/PC；未知审次不硬拒。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F029；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F030", label: "准发/退回/暂缓、理由", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：releaseDecision：准发/退回/暂缓、理由；ReviewDecision；P3；A（真实有权人）；M014；L2；P0–P2 不应存在；P3 缺 HU，不能从预审生成。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F030；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F031", label: "稿件指纹/渠道/范围/权限依据", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：decisionBinding：稿件指纹/渠道/范围/权限依据；ReviewDecision；P3；A+S 校验；M014 审签绑定信息；L2；与 F013/F007 不符 CONFLICT，人工确认重新审签。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F031；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F032", label: "执行人、账号授权、动作", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：publisherExecution：执行人、账号授权、动作；PublicationEvent；P4；P/O；M015 后台日志；L2；发布前 NA；发布后源不可得 SU/HU，不采信自报“已发”。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F032；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F033", label: "发布 URL、时点、版本", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：publishedSnapshot：发布 URL、时点、版本；PublicationEvent；P4；P，公开 URL 为辅；M015 快照/可信事件；L0/L1；发布前 NA；已发但 URL 失效 SU，证据不可读 UNREADABLE。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F033；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F034", label: "原案/频道/旧稿版本", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：priorReleaseRef：原案/频道/旧稿版本；PublicationEvent；P5 条件；P/A；M016 历史发布记录；L1/L2；H 情形无原对象 HU/SU；首发 NA。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F034；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F035", label: "新旧稿差异、理由、受影响项", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：changeSet：新旧稿差异、理由、受影响项；ContentVersion；P5 或任意改稿；S+D/U；M017 变更声明/双版本；L1/L2；有改动无差异重算；无法确定影响则 HU。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F035；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F036", label: "请求类型、理由、身份", kind: "text", required: false, visibility: "internal", scope: "case", extractionHint: "原稿字段定义与约束：withdrawOrReviewRequest：请求类型、理由、身份；PublicationCase；P0–P5 条件；U/O，外部申诉可为 D；M018 书面请求/可验证提交；L2；不发生 NA；不可信发起人 HU，不能直接删除。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F036；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F037", label: "复核人、范围、最终结果", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：reconsiderationOutcome：复核人、范围、最终结果；ReviewDecision；P5 条件；A/X；M019 复核权威记录；L2；未作成 NA/待办 HU；不可预填。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F037；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F038", label: "校本版本、有效范围、查得时间", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：policyRevisionRef：校本版本、有效范围、查得时间；ReviewDecision 配置；P1/P2；O/官方制度原文；M020 校规与渠道授权；L1/L2；目前 PC；旧版不可提升为硬阈值。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F038；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F039", label: "冲突、缺失、溯源/阅读状态", kind: "text", required: false, visibility: "internal", scope: "case", extractionHint: "原稿字段定义与约束：consistencyFlags：冲突、缺失、溯源/阅读状态；PublicationCase；P1–P5；S，证据引用；M021 核对结果定位；L1/L2；系统可生疑点，不可自动确认事实或违法。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F039；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F040", label: "紧急、特殊会签、有限范围", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：exceptionAuthorization：紧急、特殊会签、有限范围；ReviewDecision；P2/P3 条件；A，专业会签；M022 专项授权记录；L2；不触发 NA；急件缺有权凭证 HU/PC，禁止默认“绿色通道”。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F040；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F041", label: "出镜/可识别肖像主体、用途、允许公开依据及其渠道范围", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：portraitSubjectAndBasis：出镜/可识别肖像主体、用途、允许公开依据及其渠道范围；结构化清单；MediaSubject；P1/P2 含可识别肖像时；D 提供线索，专业权利人员/有权源确认；M007/M023；SRC-019；L2；不采集额外生物识别原件；不涉及可识别肖像 NA；授权/例外存疑 HU，不能仅凭照片作者授权通过。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F041；原稿政策必填性不自动转成校方强制条件。" },
    { key: "F042", label: "公开个人字段集合、公开依据、必要性、遮盖版及当前公开范围", kind: "text", required: false, visibility: "internal", scope: "subject", extractionHint: "原稿字段定义与约束：publicPersonalDataScope：公开个人字段集合、公开依据、必要性、遮盖版及当前公开范围；结构化对照；ContentVersion×DataSubject；P1/P2 含可识别信息时；S 抽取，D/个人信息有权人员决定；M002/M024、必要时 M010；SRC-017；L2；身份证号/病史等 L3 禁在通用稿库复制；不涉及 NA；字段范围不符 CONFLICT，合法依据/必要性存疑 HU。按原稿所列对象、阶段、可信来源、隐私级别和缺失语义抽取；未证实字段保持未知，不推断校方强制必填。", displayHint: "研究字段 F042；原稿政策必填性不自动转成校方强制条件。" },
  ],
  // Number.MAX_SAFE_INTEGER is a technical unbounded sentinel, not a school policy limit.
  materialSlots: [
    { id: "M001", name: "拟发布主体、类型、目标渠道与受众", purpose: "拟发布主体、类型、目标渠道与受众；发起人/责任单位；申请摘要、校内业务登记或待发布任务单", requiredElements: ["拟发布主体、类型、目标渠道与受众；发起人/责任单位；申请摘要、校内业务登记或待发布任务单", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M002", name: "拟发文本与稿件对象、署名", purpose: "拟发文本与稿件对象、署名；稿件作者/报送人；原始编辑稿、可读正文、附件/链接及可复算版本", requiredElements: ["拟发文本与稿件对象、署名；稿件作者/报送人；原始编辑稿、可读正文、附件/链接及可复算版本", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M003", name: "关键事实的出处、时间、数据/人员名称", purpose: "关键事实的出处、时间、数据/人员名称；原事实单位；权威网页、活动原始记录、业务公告、会议记录或正式数据引用", requiredElements: ["关键事实的出处、时间、数据/人员名称；原事实单位；权威网页、活动原始记录、业务公告、会议记录或正式数据引用", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M004", name: "原事实责任单位核实了稿内关键断言", purpose: "原事实责任单位核实了稿内关键断言；源业务有权人；源单位意见、签发事件、正式核实函或可验证业务记录", requiredElements: ["原事实责任单位核实了稿内关键断言；源业务有权人；源单位意见、签发事件、正式核实函或可验证业务记录", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M005", name: "发起人的真实岗位、单位及目标发布频道归属", purpose: "发起人的真实岗位、单位及目标发布频道归属；学校可信权限管理员；组织/账号权限台账、后台认证会话、授权查询记录", requiredElements: ["发起人的真实岗位、单位及目标发布频道归属；学校可信权限管理员；组织/账号权限台账、后台认证会话、授权查询记录", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M006", name: "代理关系、作者身份/学段与单位委托权", purpose: "代理关系、作者身份/学段与单位委托权；代理人和委托单位；授权委托文书/权限事件、学段身份的必要证明", requiredElements: ["代理关系、作者身份/学段与单位委托权；代理人和委托单位；授权委托文书/权限事件、学段身份的必要证明", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M007", name: "展示素材与正文一致、附件能复现", purpose: "展示素材与正文一致、附件能复现；摄制者/报送人；图片、视频、音频原件或受控对象，素材清单/文件指纹", requiredElements: ["展示素材与正文一致、附件能复现；摄制者/报送人；图片、视频、音频原件或受控对象，素材清单/文件指纹", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M008", name: "第三方文图音视频等作品的著作权/转载许可范围", purpose: "第三方文图音视频等作品的著作权/转载许可范围；权利人及专业权利审查人；著作权许可或法律例外的专业核验、用途/期限/平台说明", requiredElements: ["第三方文图音视频等作品的著作权/转载许可范围；权利人及专业权利审查人；著作权许可或法律例外的专业核验、用途/期限/平台说明", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M009", name: "转载原稿存在、可追溯及传播许可", purpose: "转载原稿存在、可追溯及传播许可；原媒体/编辑；原文 URL/发布信息、许可协议或法律依据的专业核验", requiredElements: ["转载原稿存在、可追溯及传播许可；原媒体/编辑；原文 URL/发布信息、许可协议或法律依据的专业核验", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M010", name: "行政公告所转述的原决定已有效并允许相应公开", purpose: "行政公告所转述的原决定已有效并允许相应公开；源业务有权单位；决议/业务系统结论引用、文号、时间、公开范围、G/S/T 结果", requiredElements: ["行政公告所转述的原决定已有效并允许相应公开；源业务有权单位；决议/业务系统结论引用、文号、时间、公开范围、G/S/T 结果", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M011", name: "拟公开信息有真实专业保密审查结论", purpose: "拟公开信息有真实专业保密审查结论；校方保密有权人；正式保密审查记录、结论编号、审查稿件版本与签发信息", requiredElements: ["拟公开信息有真实专业保密审查结论；校方保密有权人；正式保密审查记录、结论编号、审查稿件版本与签发信息", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M012", name: "实际编辑校对及单位审签轨迹", purpose: "实际编辑校对及单位审签轨迹；各阶段审稿人；编辑审校事件、意见单、版本确认；具体级数待校本制度", requiredElements: ["实际编辑校对及单位审签轨迹；各阶段审稿人；编辑审校事件、意见单、版本确认；具体级数待校本制度", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M013", name: "专项活动投稿已经历指定学院/校团委路径", purpose: "专项活动投稿已经历指定学院/校团委路径；活动单位与校团委；专项提交记录、学院团委审核、学院党委同意及校团委审核事件", requiredElements: ["专项活动投稿已经历指定学院/校团委路径；活动单位与校团委；专项提交记录、学院团委审核、学院党委同意及校团委审核事件", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M014", name: "真实有权人对特定稿件、渠道作正式发布决定", purpose: "真实有权人对特定稿件、渠道作正式发布决定；频道有权人；发布准发/退回/暂缓决定，含签发身份、稿件指纹和权限依据", requiredElements: ["真实有权人对特定稿件、渠道作正式发布决定；频道有权人；发布准发/退回/暂缓决定，含签发身份、稿件指纹和权限依据", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M015", name: "证明是否实际按批准版本发布", purpose: "证明是否实际按批准版本发布；频道执行人；平台发布日志、URL、时间、内容快照、频道授权", requiredElements: ["证明是否实际按批准版本发布；频道执行人；平台发布日志、URL、时间、内容快照、频道授权", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M016", name: "更正/下架究竟指向哪个已发布对象", purpose: "更正/下架究竟指向哪个已发布对象；发布单位；旧案、旧版本、旧发布链接和原决定索引", requiredElements: ["更正/下架究竟指向哪个已发布对象；发布单位；旧案、旧版本、旧发布链接和原决定索引", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M017", name: "修订内容、理由与受影响事实", purpose: "修订内容、理由与受影响事实；提出更正的责任人；新稿、旧稿比较、修改说明、新权威来源/权利证据", requiredElements: ["修订内容、理由与受影响事实；提出更正的责任人；新稿、旧稿比较、修改说明、新权威来源/权利证据", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M018", name: "撤回、投诉、复核或更正请求的类型及主张", purpose: "撤回、投诉、复核或更正请求的类型及主张；有资格提出者；可信办事请求、书面说明、联系与权利关系依据", requiredElements: ["撤回、投诉、复核或更正请求的类型及主张；有资格提出者；可信办事请求、书面说明、联系与权利关系依据", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M019", name: "复核者对原事实或发布决定作成新结论", purpose: "复核者对原事实或发布决定作成新结论；原决定或有权复核主体；复核处理记录、决定、时间、范围、引用原结果", requiredElements: ["复核者对原事实或发布决定作成新结论；原决定或有权复核主体；复核处理记录、决定、时间、范围、引用原结果", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M020", name: "判断当前哪些审核层级和材料适用", purpose: "判断当前哪些审核层级和材料适用；制度管理单位；新闻舆论管理办法现行全文、修订记录、渠道授权配置", requiredElements: ["判断当前哪些审核层级和材料适用；制度管理单位；新闻舆论管理办法现行全文、修订记录、渠道授权配置", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M021", name: "发现不同材料间事实/权限/版本冲突", purpose: "发现不同材料间事实/权限/版本冲突；系统审核记录持有者；结构化对照报告、证据定位、处理建议", requiredElements: ["发现不同材料间事实/权限/版本冲突；系统审核记录持有者；结构化对照报告、证据定位、处理建议", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M022", name: "紧急或特别程序是否取得真实授权", purpose: "紧急或特别程序是否取得真实授权；有权特别处置主体；应急指示、限时会签和有效范围记录", requiredElements: ["紧急或特别程序是否取得真实授权；有权特别处置主体；应急指示、限时会签和有效范围记录", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M023", name: "可识别人物肖像被拟公开使用时的权利基础及允许渠道", purpose: "可识别人物肖像被拟公开使用时的权利基础及允许渠道；当事人/有权权益人员；与特定肖像关联的同意、有效许可、法定例外专业审核记录或公开用途限制", requiredElements: ["可识别人物肖像被拟公开使用时的权利基础及允许渠道；当事人/有权权益人员；与特定肖像关联的同意、有效许可、法定例外专业审核记录或公开用途限制", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
    { id: "M024", name: "拟对公众展示哪些个人信息以及合法依据、最小必要性与脱敏处理", purpose: "拟对公众展示哪些个人信息以及合法依据、最小必要性与脱敏处理；个人信息保护/源业务有权人；公布字段清单、打码后的待发版与专业意见或源业务公开决定的有效引用", requiredElements: ["拟对公众展示哪些个人信息以及合法依据、最小必要性与脱敏处理；个人信息保护/源业务有权人；公布字段清单、打码后的待发版与专业意见或源业务公开决定的有效引用", "核对原件来源、版本、适用阶段和可读性；SRC 仅为研究来源索引，不是案卷材料 SourceRef"], acceptedKinds: ['pdf', 'image', 'office', 'sheet', 'text', 'zip'], minCount: 0, maxCount: Number.MAX_SAFE_INTEGER, allowReuseAcrossSubjects: false },
  ],
  sections: [
    {
      id: 'rule-checks',
      name: '原稿业务规则逐项事实预审',
      description: '规则从本模板研究原稿的 R 编号转译；不是学校正式政策规则。政策/权限未知时输出审阅建议并转人工复核。',
      order: 0,
      required: true,
      criteria: [
    { id: "R001", title: "主案/稿型归属", requirement: "原稿规则 R001：R001 主案/稿型归属，P0；T：首次发稿或更正建案；F：已明确不是发布办理，路由退出；U：主案或情形未明；SRC-001/SRC-005；F001/F002；M001、H 时 M018；主案 ID、正式业务目的、同一稿件/频道/阶段去重；S-DERIVED 与申请描述 T0；旧案有引用不得重建为新许可；可关联 PASS_FACT；缺基础输入 NM→报送人；归属冲突 CF→案卷管理员；未明 HU→业务分流人。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R002", title: "单位及频道权属", requirement: "原稿规则 R002：R002 单位及频道权属，P0/P3；T：拟以校方正式频道发布；F：经证明为独立私人/外媒自发发布；U：频道真伪或归属不明；SRC-001/SRC-009；F003/F007/F008；M001/M005；用 T2 组织及账号授权对照单位、栏目、受众；按当前授权时段核，不把账号截图当权属；范围相符 PASS_FACT；非范围 NOT_APPLICABLE 并路由；凭证缺 HU/SU→账号管理权人；矛盾 CF→宣传归口。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R003", title: "实际报送身份/代理", requirement: "原稿规则 R003：R003 实际报送身份/代理，P0；T：以单位身份提交或受委托代办；F：仅提供作品并未代表单位报送；U：同名、兼职、代理关系未知；SRC-001/SRC-013/SRC-014；F004/F005/F006；M005/M006；T2 身份会话/单位委托范围与 T1 授权附件对照有效期；作者署名 T0 不能替代；学生身份不产生签发权；可证 PASS_FACT；普通作者分支 NOT_APPLICABLE 于代理权；缺委托 NM→报送单位；权限疑点 HU/SU→身份管理者。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R004", title: "稿件可读与不可变版本", requirement: "原稿规则 R004：R004 稿件可读与不可变版本，P0/每次改稿；T：有新稿或变更；F：仅请求查看无新稿；U：附件结构或版本不明；SRC-004；F011/F012/F013；M002；全文/附件可定位，固定内容版本与指纹、时间；T1 文档 + S-DERIVED 校验；指纹不能独立证明审批；可读定版 PASS_FACT；未交 NM→报送人；解析坏 UR→材料持有人；不同稿冒名 CF→编辑。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R005", title: "署名与贡献者事实", requirement: "原稿规则 R005：R005 署名与贡献者事实，P0/P1；T：稿件标作者/摄影/视频或署名涉及责任；F：确无此类署名项；U：署名归属不清；SRC-004/SRC-009；F014/F021；M002/M008；稿内作者字段、素材制作源、权利人说明逐项对应；T1 支持署名事实，署名本身不授版权；以当版为准；匹配 PASS_FACT；无须署名 NOT_APPLICABLE；缺凭据 NM→内容单位；争议 HU/CF→权利核验人。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R006", title: "稿件关键事实与出处", requirement: "原稿规则 R006：R006 稿件关键事实与出处，P1；T：含可验证的人名、地点、日期、数据、事件；F：核验对象确不存在；U：OCR 或原始来源不确定；SRC-001/SRC-003/SRC-005；F015/F016/F017/F018；M002/M003；段落/页码/数据口径与源 T1/T2 逐断言比较，记形成时点；不同统计口径不直接判“假”；一致 PASS_FACT；源互斥 CF→事实源单位；缺引用 NM→供稿人；无法读 UR→材料持有人；断源 SU→源管理员。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R007", title: "来源单位正式核实", requirement: "原稿规则 R007：R007 来源单位正式核实，P1/P2；T：内部独有事实、不能以公开原文证明或应由源部门确证；F：有可靠公开事实源足以比对且无额外要求；U：事实责任主体不明；SRC-001/SRC-003/SRC-005；F015/F017/F024；M003/M004；T2/T3 源单位核实者、意见范围、所核事实清单和版本；不把作者自述提升为单位确认；是否强制核实级次由校规另定；可核意见 PASS_FACT；不触发 NOT_APPLICABLE；缺意见 NM→事实单位；权限未知 HU/PC→源部门/制度管理人。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R008", title: "原事实形成/生效时点", requirement: "原稿规则 R008：R008 原事实形成/生效时点，P1；T：稿件的成立、公布、获奖、时间顺序决定其真假；F：纯常识性描述无时间效力争点；U：日期、期间或版本冲突；SRC-005/SRC-008；F016/F019/F039；M003/M010/M021；比成文、生效、撤销、取数时点及叙述时态，T1/T2 原件优先；不能机械按网页最新上传日取胜；时序吻合 PASS_FACT；相反证据 CF→事实单位；生效意义难定 HU→源业务有权人；断源 SU→源管理员。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R009", title: "图音视频素材清单", requirement: "原稿规则 R009：R009 图音视频素材清单，P0/P1；T：稿件有图、音、视频、海报等；F：确属纯文字；U：外链/附件不明；SRC-004/SRC-009；F013/F020；M002/M007；T1 素材对象及 S-DERIVED 哈希/时长/帧与稿中引用逐项对应，依当前稿版；素材齐不等于可合法发布；可复现 PASS_FACT；无素材 NOT_APPLICABLE；缺文件 NM→摄制/报送人；坏帧 UR→素材持有人。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R010", title: "第三方作品版权使用范围", requirement: "原稿规则 R010：R010 第三方作品版权使用范围，P1/P2；T：拟公开稿件使用第三方受著作权保护的文图音视频；F：经核确无第三方作品；U：原创性、许可用途或法定例外待专业确认；SRC-004/SRC-018；F014/F021；M007/M008；逐作品核版本、作者/权利来源、许可或专业确认的法定例外、用途/期限/平台；注明来源≠自动许可；T1 线索与 T2/T3 权利专业核验分离；对“授权记录存在且范围对应”可 PASS_FACT（非自动法律结论）；不涉 NOT_APPLICABLE；需证据缺 NM→素材持有人；争议 HU→专业版权有权人。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R011", title: "外部转载来源/适用传播范围", requirement: "原稿规则 R011：R011 外部转载来源/适用传播范围，P0/P1；T：转载或据外媒原稿转发；F：确为原创且无需转载许可；U：原作者、授权或原文状态不明；SRC-004/SRC-006（历史）；F018/F023；M009/M008；核源 URL、署名、转载版本和权利范围，T1 原网页仅证内容存在；2004 年规范不用于现行硬判；链接与声明相合 PASS_FACT；非转载 NOT_APPLICABLE；失联 SU→源媒体/编辑；权属不明 HU→专业核证者。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R012", title: "原行政/业务有效决定", requirement: "原稿规则 R012：R012 原行政/业务有效决定，P1/P2；T：公告称某业务获批/生效/要求公开；F：普通报道不引用实体决定；U：公告实质效果或原决定状态不明；SRC-005/SRC-007/SRC-008/SRC-010；F019/F025/F026；M010/M002；T2/T3 源业务决定号、状态、时点、公开范围与文稿逐句比对；P0 尚未产生可先拟稿，P3 前必核；对应一致 PASS_FACT（非再次批准）；无涉 NOT_APPLICABLE；未作成 HU→原业务；失联 SU→源系统；冲突 CF→原决定机关。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R013", title: "G50/S/T 结论路由与效力", requirement: "原稿规则 R013：R013 G50/S/T 结论路由与效力，P1/P2；T：涉及科研公开、线下版位、合同、公文等独立授权；F：不涉前置事项；U：原业务 ID 或 G50 精确边界未明；SRC-001/SRC-008；F025/F026；M010/M020；只核相邻结论 T2/T3 的版本/渠道/有效范围并引用，不复制 G06/G03/G01/T07-T01/T07-T02 审批逻辑；G50 原文未取；引用一致 PASS_FACT；不涉 NOT_APPLICABLE；边界不明 PC→目录 Owner；源未决 HU/SU→原业务有权人。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R014", title: "专业保密审查结论", requirement: "原稿规则 R014：R014 专业保密审查结论，P2；T：拟公开且适用保密审查；F：仅内部未拟公开阶段，不生成终审缺件；U：审查适用级次或权限未知；SRC-004/SRC-010/SRC-011/SRC-012；F012/F013/F027；M011；T3 专业审查的真实签发者、被审版本、公开对象及审查时点；T0 关键词与网页“是”不可替代；L3 只存结论引用；仅“结论存在且绑定”可 PASS_FACT；未到 P2 NOT_APPLICABLE 于当前缺件；无结论 HU→保密有权人；源断 SU→该系统。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R015", title: "2025 三下乡专项审签路径", requirement: "原稿规则 R015：R015 2025 三下乡专项审签路径，P2；T：明确为 SRC-014 所述 2025 项目、其指定投稿平台；F：其他活动/年份/普通稿；U：届次、栏目、后续正式通知变更不明；SRC-014；F002/F006/F028；M013；逐阶段比学院团委审核、学院党委同意、校团委审核及对外重要稿额外报批，T3/人工验真；仅该届专项，不外推全校；已核各环节 PASS_FACT；不触发 NOT_APPLICABLE；环节缺 NM/HU→该届承办单位；届次变更 PC→团委。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R016", title: "编辑审校/岗位链", requirement: "原稿规则 R016：R016 编辑审校/岗位链，P2；T：实际进入编辑审校；F：尚处 P0/P1，不得索签章；U：当前稿型审次与岗位规则未取得；SRC-001/SRC-002/SRC-003/SRC-006（历史）；F029/F038；M012/M020；T3 实际审核记录及当前稿版；审次由现行制度决定，2004/2021 例子不直接硬判；可核已实际完成环节 PASS_FACT；未到阶段 NOT_APPLICABLE 于当前缺件；校规缺 PC→宣传制度管理人；审签人存疑 HU→渠道负责人。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R017", title: "政策版本及适用范围", requirement: "原稿规则 R017：R017 政策版本及适用范围，P1/P2；T：需要判断某项校本级次、时限、渠道规则；F：只做文件可读/同一版本的技术比对；U：制度正文、效力或渠道配置缺；SRC-002/SRC-006/SRC-007；F038；M020；以正式 T2 制度文本/主管机关确认、版本、生效区间及适用频道核；不可将 CURRENTITY-UNKNOWN 升为硬门槛；经核当前条文可 PASS_FACT（仅版本事实）；不涉及 NOT_APPLICABLE；未核 PC→制度管理部门。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R018", title: "真实发布决定及有权人", requirement: "原稿规则 R018：R018 真实发布决定及有权人，P3；T：实际进入正式准发/暂缓/退回；F：仍 P0–P2，不能误报终审缺件；U：谁在该频道有权签发尚未证实；SRC-001/SRC-002/SRC-011；F003/F004/F030；M005/M014/M020；T2 授权与 T3 审签事件对照签发时有效岗位、决定种类；页面按钮/自制签名是 T0；只能确认“决定记录真实存在” PASS_FACT，不代替决定；未到阶段 NOT_APPLICABLE 于当前缺件；未经核证 HU/PC→有权发布单位。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R019", title: "准发对象版本、渠道、受众绑定", requirement: "原稿规则 R019：R019 准发对象版本、渠道、受众绑定，P3；T：已有正式签审决定；F：P3 前无该记录；U：同名不同稿或批准范围不明；SRC-001/SRC-004；F007/F008/F013/F031；M002/M014；T3 决定所绑定指纹、附件、渠道及受众与本案 S-DERIVED 版本逐一比；改字/换图/增平台不得静默继承；完全对应 PASS_FACT；未到阶段 NOT_APPLICABLE；不同 CF→原签发者；范围无法核 HU→渠道有权人。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R020", title: "真实发布执行和回执", requirement: "原稿规则 R020：R020 真实发布执行和回执，P4；T：有准发并已执行发布/对外供稿；F：尚未执行；U：外部平台链接失效或账号日志不可得；SRC-001/SRC-004；F009/F032/F033；M015/M005/M014；T4 发布动作、授权账号、URL/快照、时点与 T3 准发版本对照；F009 计划时间只用于说明偏差，不当校规定时限；校外媒体自主刊发不属于本校审批；匹配 PASS_FACT；发布前 NOT_APPLICABLE 于回执缺件；失联 SU→平台管理员；版本不符 CF→原签发者。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R021", title: "已发原对象追溯", requirement: "原稿规则 R021：R021 已发原对象追溯，P5；T：更正/下架/已发争议；F：首发且尚未发布；U：旧案、旧链接或发布记录不清；SRC-003/SRC-004；F033/F034；M016/M015；取 T4 原发布事件、旧内容指纹与原 T3 决定，不能凭当前页面覆盖历史；过时 URL 仍保留归档引用；可定位 PASS_FACT；首发 NOT_APPLICABLE；记录断 SU→频道管理员；指向不同稿 CF/HU→原决定部门。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R022", title: "稿件差异及定向重审依赖", requirement: "原稿规则 R022：R022 稿件差异及定向重审依赖，P0–P5；T：正文/素材/渠道/证据变更；F：指纹及被依赖事实均无变化；U：无法算完整变更集；SRC-001/SRC-004；F013/F035/F039；M002/M007/M017/M021；S-DERIVED diff 固定旧/新版本，映射旧规则证据集合；不改写旧决定；“轻微修改免审”无校本依据；确定差异 PASS_FACT（仅差异）；无变化 NOT_APPLICABLE 于重审；不明 HU/UR→编辑/签发者；变更后转 11.3。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R023", title: "撤回/异议请求人及阶段", requirement: "原稿规则 R023：R023 撤回/异议请求人及阶段，P0–P5；T：收到撤回、争议或复核请求；F：无该请求；U：提出者资格、范围不明；SRC-001/SRC-008；F004/F034/F036；M018/M005/M016；T2 身份与 T1 请求证据对照请求类型、原案和提出时点；P3 前撤未决申请、P4 后走撤稿/纠错新决定；请求可信 PASS_FACT（仅受理事实）；无申请 NOT_APPLICABLE；资格争议 HU→受理机构；主体缺 NM→提出者。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R024", title: "复核权威结果与原结论引用", requirement: "原稿规则 R024：R024 复核权威结果与原结论引用，P5；T：复核被正式受理并已形成结论；F：未发起复核或尚未进入产出阶段；U：复核有权人、时限、结果效力不明；SRC-002/SRC-008；F025/F036/F037；M018/M019/M010；T3 原决定和复核决定的主体/范围/版本/时间关联；不同原业务异议转原单位，不能用本模板覆写结论；可核复核记录 PASS_FACT；未到产出 NOT_APPLICABLE 于缺件；权限或制度未知 HU/PC→有权复核主体。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R025", title: "紧急/特别授权", requirement: "原稿规则 R025：R025 紧急/特别授权，P2/P3；T：明确援引紧急或特别程序；F：普通稿；U：适用条件、特殊权限或例外时间不明；SRC-003（历史）/SRC-011；F010/F038/F040；M022/M020；T2/T3 当前专项授权、范围、时效、签发人与普通程序比较；2021 疫情专班不具通用效力；授权记录事实可 PASS_FACT（非自动豁免）；普通稿 NOT_APPLICABLE；无校规 PC、缺授权 HU→宣传有权人。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R026", title: "跨渠道许可范围", requirement: "原稿规则 R026：R026 跨渠道许可范围，P0/P3/P4；T：同稿拟发多个官方频道/外部投送；F：单频道且无复用；U：已有决定是否覆盖新增频道未知；SRC-001/SRC-004；F007/F008/F031/F033；M001/M014/M015；以 T3 授权覆盖清单逐频道、受众、期限与 T4 发布记录比较；不得由标题相同推定共用许可；每频道匹配 PASS_FACT；单频道 NOT_APPLICABLE；超出 CF/HU→各频道有权人；源失联 SU→权限管理员。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R027", title: "对外采访/通稿发声权限", requirement: "原稿规则 R027：R027 对外采访/通稿发声权限，P0–P4；T：拟代表学校向外部媒体提供口径、正式通稿；F：仅校内普通报道；U：发言人身份或重要口径的会签依据未知；SRC-001/SRC-003；F003/F007/F008/F024/F030；M004/M005/M014；用事实单位 T2 确认、对外口径 T3 批准的版本/范围与有权联络人比；外媒最终采用非学校可决定；有权记录相合 PASS_FACT；普通稿 NOT_APPLICABLE；权属未核 HU/PC→宣传归口；事实冲突 CF→事实源单位。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R028", title: "法定信息公开与宣传稿边界", requirement: "原稿规则 R028：R028 法定信息公开与宣传稿边界，P1/P2；T：稿件实质承载法定主动/依申请公开答复；F：普通宣传不承载该法定决定；U：公开类别/合法公开范围不明；SRC-007/SRC-008/SRC-010/SRC-011；F025/F026/F038；M010/M020；用信息公开有权机构 T2/T3 决定范围核宣传载体是否一致；仅引用公开决定，不生成法定答复；引用一致 PASS_FACT；不涉 NOT_APPLICABLE；归口/效力不明 HU/PC→信息公开机构。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "semantic", targetScope: 'case' },
    { id: "R029", title: "个人信息公开字段与合法依据", requirement: "原稿规则 R029：R029 个人信息公开字段与合法依据，P1/P2；T：正文、名单、图片说明等拟展示可识别个人信息；F：经核无此类信息；U：字段类别/公开目的/合法依据或必要性不明；SRC-017/SRC-010；F022/F042/F025；M002/M024/M010；对每主体/字段比实际待发版与专业批准公开字段、用途和最小必要范围；第 13 条新闻公益等多种依据由真实有权人判断，不一律索取同意；对 L3 只读受控专业结论；字段与已核可公开范围一致才可 PASS_FACT（非合法性裁定）；不涉 NA；过量字段 CF→源业务/个人信息负责人；依据未明 HU；源不可达 SU。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
    { id: "R030", title: "肖像使用依据与具体镜头", requirement: "原稿规则 R030：R030 肖像使用依据与具体镜头，P1/P2；T：含可识别人物肖像、AI 合成似像或视频镜头；F：经核无可识别主体；U：授权范围或法定例外不明；SRC-019/SRC-017；F020/F041/F013；M007/M023；逐人物/镜头/稿版/平台比可证同意或经专业判断的法定例外；拍摄者版权许可与被摄者肖像依据是不同证据；模型不得因公众人物或校园活动一概认定可用；范围事实相符可 PASS_FACT（非肖像权裁断）；无肖像 NA；对应素材缺 NM、坏帧 UR；权利基础存疑 HU→肖像权专业有权人。本地事实/证据预审；校本政策、权限或终局决定未确认时必须人工复核，不得自动批准或拒绝。", execution: "manual", targetScope: 'case' },
      ],
    },
  ],
  policyVersionIds: [],
  stages: [
    { id: "p0-draft", name: "P0 拟稿/登记", kind: "manual-review", executorRole: "reviewer", workflowOwner: 'local', nextStageId: "p1-fact-source" },
    { id: "p1-fact-source", name: "P1 事实/源决定前置核验", kind: "manual-review", executorRole: "reviewer", workflowOwner: 'local', nextStageId: "p2-editor-specialist" },
    { id: "p2-editor-specialist", name: "P2 编辑、校对、专业会签", kind: "manual-review", executorRole: "reviewer", workflowOwner: 'local', nextStageId: "p3-release-decision" },
    { id: "p3-release-decision", name: "P3 人工发布决定", kind: "manual-review", executorRole: "teacher", workflowOwner: 'local', nextStageId: "p4-publish" },
    { id: "p4-publish", name: "P4 发布执行", kind: "handoff", executorRole: "reviewer", workflowOwner: 'local', nextStageId: "p5-correction" },
    { id: "p5-correction", name: "P5 变更、纠错、撤稿、复核", kind: "finalize", executorRole: "teacher", workflowOwner: 'local' },
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
