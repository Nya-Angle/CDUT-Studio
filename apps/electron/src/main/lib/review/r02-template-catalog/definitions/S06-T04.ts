/**
 * S06-T04｜学生创新科研成果校级奖励申报审核
 * R02 研究稿映射，非成都理工大学正式模板；所有政策合规结论须人工核准。
 * SRC 为研究文献编号，不是 ReviewCase 的 SourceRef。
 */
import type { TemplateVersion, TemplateCriterionSpec, TemplateSectionSpec } from '@profer/shared'

interface ResearchCriterion extends TemplateCriterionSpec {
  /** 真实模板字段/材料槽绑定；供 V3 统一编译器转成 Check.target。 */
  researchBindings: { fieldKeys: string[]; materialSlotIds: string[]; researchSourceIds: string[] }
  policyEvidenceStatus: 'UNCONFIRMED'
}
interface ResearchSection extends TemplateSectionSpec { criteria: ResearchCriterion[] }
type ResearchTemplateVersion = Omit<TemplateVersion, 'sections'> & {
  officialSchoolTemplate: false
  policyEvidenceStatus: 'UNCONFIRMED'
  researchSource: { path: string; sha256: string }
  sections: ResearchSection[]
}

export const r02Metadata = {
  "templateId": "S06-T04",
  "name": "学生创新科研成果校级奖励申报审核",
  "sourcePath": "docs/design/review-agent/business-templates/R02/S06-T04.md",
  "sourceSha256": "aaf9e78f559d18cd12eb284273313f6505ca445188b3940014c849176aed28a8",
  "officialSchoolTemplate": false,
  "policyEvidenceStatus": "UNCONFIRMED",
  "researchSourceStatus": "LIBRARY_FORMAL_RESEARCH_V1",
  "deduplicationBoundary": "校级成果奖励批次+作品/成果唯一标识+权利主体+奖励类型；同一成果已计入 S06-T03/S03 或其他奖励时须人工核对制度是否允许，不自动叠加。",
  "ruleBindings": [
    {
      "id": "R001",
      "fields": [
        "F002",
        "F003",
        "F010"
      ],
      "materials": [
        "M001"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R002",
      "fields": [
        "F001",
        "F010",
        "F012"
      ],
      "materials": [
        "M001",
        "M003"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R003",
      "fields": [
        "F002",
        "F009",
        "F010"
      ],
      "materials": [
        "M001",
        "M003"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R004",
      "fields": [
        "F005",
        "F007"
      ],
      "materials": [
        "M001",
        "M002"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R005",
      "fields": [
        "F003",
        "F004",
        "F025"
      ],
      "materials": [
        "M001",
        "M003"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R006",
      "fields": [
        "F006",
        "F007",
        "F008"
      ],
      "materials": [
        "M002"
      ],
      "researchSources": [
        "SRC-003"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R007",
      "fields": [
        "F010",
        "F011",
        "F012",
        "F013"
      ],
      "materials": [
        "M003",
        "M009"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R008",
      "fields": [
        "F009",
        "F018"
      ],
      "materials": [
        "M004"
      ],
      "researchSources": [
        "SRC-003"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R009",
      "fields": [
        "F011",
        "F012",
        "F013"
      ],
      "materials": [
        "M005",
        "M006",
        "M007",
        "M009"
      ],
      "researchSources": [
        "SRC-004"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R010",
      "fields": [
        "F013",
        "F014"
      ],
      "materials": [
        "M005",
        "M006",
        "M007"
      ],
      "researchSources": [
        "SRC-004"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R011",
      "fields": [
        "F006",
        "F016"
      ],
      "materials": [
        "M005",
        "M006",
        "M007",
        "M008"
      ],
      "researchSources": [
        "SRC-003"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R012",
      "fields": [
        "F016",
        "F017",
        "F018"
      ],
      "materials": [
        "M004",
        "M008"
      ],
      "researchSources": [
        "SRC-003"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R013",
      "fields": [
        "F003",
        "F013",
        "F015"
      ],
      "materials": [
        "M001",
        "M005",
        "M006",
        "M007",
        "M009"
      ],
      "researchSources": [
        "SRC-004"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R014",
      "fields": [
        "F012",
        "F014"
      ],
      "materials": [
        "M001",
        "M006",
        "M007"
      ],
      "researchSources": [
        "SRC-004"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R015",
      "fields": [
        "F011",
        "F022"
      ],
      "materials": [
        "M008",
        "M012"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R016",
      "fields": [
        "F011",
        "F021"
      ],
      "materials": [
        "M010"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R017",
      "fields": [
        "F009",
        "F023"
      ],
      "materials": [
        "M011"
      ],
      "researchSources": [
        "SRC-003"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R018",
      "fields": [
        "F011",
        "F019",
        "F020"
      ],
      "materials": [
        "M001",
        "M013",
        "M014"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R019",
      "fields": [
        "F011",
        "F019",
        "F020"
      ],
      "materials": [
        "M001",
        "M013",
        "M014"
      ],
      "researchSources": [
        "SRC-005",
        "SRC-010"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R020",
      "fields": [
        "F006",
        "F024"
      ],
      "materials": [
        "M015"
      ],
      "researchSources": [
        "SRC-003"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R021",
      "fields": [
        "F025",
        "F027",
        "F034"
      ],
      "materials": [
        "M018"
      ],
      "researchSources": [
        "SRC-003"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R022",
      "fields": [
        "F003",
        "F025",
        "F028",
        "F031"
      ],
      "materials": [
        "M001",
        "M018"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R023",
      "fields": [
        "F009",
        "F025",
        "F029"
      ],
      "materials": [
        "M016"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R024",
      "fields": [
        "F028",
        "F030",
        "F031"
      ],
      "materials": [
        "M017",
        "M018"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R025",
      "fields": [
        "F024",
        "F028",
        "F034"
      ],
      "materials": [
        "M015",
        "M018"
      ],
      "researchSources": [
        "SRC-003"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R026",
      "fields": [
        "F028",
        "F032"
      ],
      "materials": [
        "M018"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    }
  ]
} as const

export const template: ResearchTemplateVersion = {
  templateId: "S06-T04",
  version: 1,
  schemaVersion: 2,
  name: "学生创新科研成果校级奖励申报审核",
  description: '本地研究模板／非校方正式模板。仅供材料分拣、事实核验、问题建议及人工复审；校本政策和决定权待确认。',
  catalogKind: 'reference',
  sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 正式研究稿 docs/design/review-agent/business-templates/R02/S06-T04.md；SHA-256 aaf9e78f559d18cd12eb284273313f6505ca445188b3940014c849176aed28a8；本地研究模板、非校方正式模板；所有政策细则待确认。",
  objectType: "project",
  displayName: { template: "学生创新科研成果校级奖励申报审核" },
  fields: [
    { key: "F001", label: "templateId: enum(S06-T04)，Case/全程", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "templateId: enum(S06-T04)，Case/全程；后端路由，L；不符改路由" },
    { key: "F002", label: "awardBatchId: string，Batch/SUBMIT", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "awardBatchId: string，Batch/SUBMIT；经签发的 M001，L；无批次为 POLICY_UNCONFIRMED" },
    { key: "F003", label: "policyVersion/hash: string，Batch/全程", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "policyVersion/hash: string，Batch/全程；政策中心 M001，L；未绑定暂停硬判" },
    { key: "F004", label: "intakeWindow: timeRange，Batch/SUBMIT", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "intakeWindow: timeRange，Batch/SUBMIT；M001，L；无法取源 SOURCE_UNAVAILABLE" },
    { key: "F005", label: "allowedStudentGroups: enum-set，Batch/SUBMIT", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "allowedStudentGroups: enum-set，Batch/SUBMIT；M001，L；未列明则 POLICY_UNCONFIRMED" },
    { key: "F006", label: "applicantId: opaqueStudentRef，Person/SUBMIT", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "applicantId: opaqueStudentRef，Person/SUBMIT；校方身份服务 M002，P；无法验证不能以自填替代" },
    { key: "F007", label: "studentLevel/status/asOf: object，Person/SUBMIT", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "studentLevel/status/asOf: object，Person/SUBMIT；学籍权威服务 M002，P；按政策规定时点核验" },
    { key: "F008", label: "applicantSchool/college: identifier，Person/SUBMIT", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "applicantSchool/college: identifier，Person/SUBMIT；学籍服务 M002，P；材料冲突则 CONFLICT" },
    { key: "F009", label: "applicantConsent/representativeAuthority: enum+timestamp，Person/Team/SUBMIT", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "applicantConsent/representativeAuthority: enum+timestamp，Person/Team/SUBMIT；本人签名授权 M003/M004，P；代理无权先停" },
    { key: "F010", label: "applicationUnit/awardType: enum，Claim/SUBMIT", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "applicationUnit/awardType: enum，Claim/SUBMIT；M001/M003，L；与 S03 等冲突先分路由" },
    { key: "F011", label: "achievementId/fingerprint: string，Achievement/SUBMIT", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "achievementId/fingerprint: string，Achievement/SUBMIT；DOI/专利号/软件登记号/书号＋版本 M005–M007，L；标识不唯一送人工" },
    { key: "F012", label: "achievementType: enum(paper,patent,software,book,report,other)，Achievement/SUBMIT", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "achievementType: enum(paper,patent,software,book,report,other)，Achievement/SUBMIT；M003/M005–M007，L；类型未列则未核政策" },
    { key: "F013", label: "achievementTitle/publishedAt: string+date，Achievement/SUBMIT", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "achievementTitle/publishedAt: string+date，Achievement/SUBMIT；发行/登记权威源 M005–M007，L；自填不能单独成真" },
    { key: "F014", label: "officialState: enum(published,accepted,registered,authorized,withdrawn,unknown)，Achievement/REVIEW", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "officialState: enum(published,accepted,registered,authorized,withdrawn,unknown)，Achievement/REVIEW；发行方/国知局等 M005–M007，L；视通知区别处理" },
    { key: "F015", label: "affiliationAtOutput: string，Achievement/REVIEW", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "affiliationAtOutput: string，Achievement/REVIEW；原件署名 M005–M007，L；未定义归属条件不硬判" },
    { key: "F016", label: "contributionOrder: array(person,role,rank,cofirst)，Achievement/REVIEW", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "contributionOrder: array(person,role,rank,cofirst)，Achievement/REVIEW；官方作者/发明人名单 M005–M008，P；有争议需人核" },
    { key: "F017", label: "contributionStatement: text+signature，Achievement/REVIEW", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "contributionStatement: text+signature，Achievement/REVIEW；成员本人确认 M008，P；非权威事实" },
    { key: "F018", label: "teamMembers/consent: array(ref,status)，Team/SUBMIT", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "teamMembers/consent: array(ref,status)，Team/SUBMIT；M004/M008 与校方身份服务，P；无本人确认不能代表" },
    { key: "F019", label: "previousClaimDecisions: array(recordId,award,decision,version)，Claim/REVIEW", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "previousClaimDecisions: array(recordId,award,decision,version)，Claim/REVIEW；后端授权奖励台账 M013/M014，P；未查到不等于零" },
    { key: "F020", label: "duplicatePolicyScope: object(crossBatch,crossAward,sameProduct,levelUpgrade)，Batch/REVIEW", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "duplicatePolicyScope: object(crossBatch,crossAward,sameProduct,levelUpgrade)，Batch/REVIEW；M001，L；缺失时不得自动判允许或禁报" },
    { key: "F021", label: "linkedG06Decision: id+version/status，Achievement/REVIEW", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "linkedG06Decision: id+version/status，Achievement/REVIEW；G06 签发记录 M010，P；无权限返回来源不可用" },
    { key: "F022", label: "linkedProjectDecision: id+version/status，Project/REVIEW", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "linkedProjectDecision: id+version/status，Project/REVIEW；S06-T01 签发记录 M012，L；仅条件性需要" },
    { key: "F023", label: "integrityAttestation: signedBoolean，Person/SUBMIT", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "integrityAttestation: signedBoolean，Person/SUBMIT；M011，P；需要时缺失可补" },
    { key: "F024", label: "officialIntegrityOutcome: enum(activeBar,cleared,pending,notQueried)，Person/REVIEW", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "officialIntegrityOutcome: enum(activeBar,cleared,pending,notQueried)，Person/REVIEW；有权主管签发 M015，S；pending≠违规已定" },
    { key: "F025", label: "decisionStage: enum(draft,submitted,checking,publicity,decided,withdrawn,review)，Case/全程", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "decisionStage: enum(draft,submitted,checking,publicity,decided,withdrawn,review)，Case/全程；Main 后端日志，L；禁止 Renderer 改写" },
    { key: "F026", label: "materialVersionRefs: map(slot,fileHash,owner,sourceVersion)，Case/全程", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "materialVersionRefs: map(slot,fileHash,owner,sourceVersion)，Case/全程；Main 上传与存储服务，P；不同版本不得混用" },
    { key: "F027", label: "reviewerAndRecusal: list(actor,scope,recused)，REVIEW", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "reviewerAndRecusal: list(actor,scope,recused)，REVIEW；机构权限/签章 M018，P；缺失阶段性未形成" },
    { key: "F028", label: "awardDecision: object(outcome,level,issuer,date,recordId)，DECIDE", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "awardDecision: object(outcome,level,issuer,date,recordId)，DECIDE；后端正式 M018，P；仅终审后存在" },
    { key: "F029", label: "withdrawRequest/effectiveAt: object，WITHDRAW", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "withdrawRequest/effectiveAt: object，WITHDRAW；M016 与后端受理决定，P；未触发不必填" },
    { key: "F030", label: "appealReason/evidenceRefs: object，APPEAL", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "appealReason/evidenceRefs: object，APPEAL；M017，P；未触发不必填" },
    { key: "F031", label: "objectionWindow/publicityRecord: object，REVIEW/APPEAL", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "objectionWindow/publicityRecord: object，REVIEW/APPEAL；M018 正式公示记录，P；公示阶段才取" },
    { key: "F032", label: "awardAmount/paymentRef: reference，DECIDE/后续", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "awardAmount/paymentRef: reference，DECIDE/后续；G07 可信给付引用，S；本模板只展示状态不核算" },
    { key: "F033", label: "caseRunId/planFingerprint: string，Case/全程", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "caseRunId/planFingerprint: string，Case/全程；V3 Main 冻结 Run/Plan，L；任何重审绑定快照" },
    { key: "F034", label: "policyExceptionDecision: id+reason+issuer，REVIEW/DECIDE", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "policyExceptionDecision: id+reason+issuer，REVIEW/DECIDE；有权例外决定 M018，P；空值不代表自动豁免" },
  ],
  materialSlots: [
    { id: "M001", name: "批次通知/规则文件：校方政策中心签发的奖励名目、开放窗口、适用对象、可奖成果、等级、禁重、主管及签批；B，SUBMIT 前配置；无学生替代", purpose: "批次通知/规则文件：校方政策中心签发的奖励名目、开放窗口、适用对象、可奖成果、等级、禁重、主管及签批；B，SUBMIT 前配置；无学生替代；F002–F005/F010/F020；R001–R005/R018–R021；SRC-001/005", requiredElements: ["批次通知/规则文件：校方政策中心签发的奖励名目、开放窗口、适用对象、可奖成果、等级、禁重、主管及签批；B，SUBMIT 前配置；无学生替代"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M002", name: "学籍身份与学段快照：校方可信系统；B，SUBMIT；学生证扫描只作核验线索", purpose: "学籍身份与学段快照：校方可信系统；B，SUBMIT；学生证扫描只作核验线索；F006–F008；R004/R006；SRC-001/003", requiredElements: ["学籍身份与学段快照：校方可信系统；B，SUBMIT；学生证扫描只作核验线索"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M003", name: "申请书/奖励类别及本人声明：学生提交并授权；S，SUBMIT；有后端签名电子表单可替纸件", purpose: "申请书/奖励类别及本人声明：学生提交并授权；S，SUBMIT；有后端签名电子表单可替纸件；F009–F013；R003/R007；SRC-001/013", requiredElements: ["申请书/奖励类别及本人声明：学生提交并授权；S，SUBMIT；有后端签名电子表单可替纸件"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M004", name: "团队主申报人授权与成员清单：本人签名/可信电子授权；C，C04 的 SUBMIT", purpose: "团队主申报人授权与成员清单：本人签名/可信电子授权；C，C04 的 SUBMIT；F009/F018；R008/R012；SRC-003/013", requiredElements: ["团队主申报人授权与成员清单：本人签名/可信电子授权；C，C04 的 SUBMIT"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M005", name: "论文/专著成果：出版主页/DOI/卷期页、全文封面与署名页、收录正式记录；C，C01/C02 的 SUBMIT；刊物官方可查询替代截图", purpose: "论文/专著成果：出版主页/DOI/卷期页、全文封面与署名页、收录正式记录；C，C01/C02 的 SUBMIT；刊物官方可查询替代截图；F011–F017；R009/R010/R011/R013；SRC-004/006", requiredElements: ["论文/专著成果：出版主页/DOI/卷期页、全文封面与署名页、收录正式记录；C，C01/C02 的 SUBMIT；刊物官方可查询替代截图"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M006", name: "专利授权/法律状态：专利号、证书及国知局权威著录，非单凭受理通知；C，C03；官方注册核查可替文件", purpose: "专利授权/法律状态：专利号、证书及国知局权威著录，非单凭受理通知；C，C03；官方注册核查可替文件；F011–F016；R009/R010/R011/R014；SRC-004/012", requiredElements: ["专利授权/法律状态：专利号、证书及国知局权威著录，非单凭受理通知；C，C03；官方注册核查可替文件"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M007", name: "软件登记/其他成果：合法登记证书、发行证据、验收证明；C，C03 或特批种类；无相应规则不要求", purpose: "软件登记/其他成果：合法登记证书、发行证据、验收证明；C，C03 或特批种类；无相应规则不要求；F011–F016；R009/R010/R011/R014；SRC-004/008", requiredElements: ["软件登记/其他成果：合法登记证书、发行证据、验收证明；C，C03 或特批种类；无相应规则不要求"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M008", name: "作者/发明人贡献说明与争议证据：署名原件、成员确认、导师专业意见；C，共一、团队、排名争议时", purpose: "作者/发明人贡献说明与争议证据：署名原件、成员确认、导师专业意见；C，共一、团队、排名争议时；F016–F018；R011/R012/R015；SRC-003/006", requiredElements: ["作者/发明人贡献说明与争议证据：署名原件、成员确认、导师专业意见；C，共一、团队、排名争议时"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M009", name: "申请成果与归属单位清单：本人填报＋原件校验；S，仅本批要求对应类别时；与 M005–007 关联", purpose: "申请成果与归属单位清单：本人填报＋原件校验；S，仅本批要求对应类别时；与 M005–007 关联；F011–F015；R007/R009/R013；SRC-006/013", requiredElements: ["申请成果与归属单位清单：本人填报＋原件校验；S，仅本批要求对应类别时；与 M005–007 关联"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M010", name: "G06 权属/成果登记有效决定：G06 权威接口 B；仅要求权属/署名可核时；原件扫描不是 G06 已批", purpose: "G06 权属/成果登记有效决定：G06 权威接口 B；仅要求权属/署名可核时；原件扫描不是 G06 已批；F021；R016；SRC-001/002", requiredElements: ["G06 权属/成果登记有效决定：G06 权威接口 B；仅要求权属/署名可核时；原件扫描不是 G06 已批"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M011", name: "科研诚信承诺/授权核验记录：学生本人与要求的成员/导师签名；S，SUBMIT；允许可信电子承诺", purpose: "科研诚信承诺/授权核验记录：学生本人与要求的成员/导师签名；S，SUBMIT；允许可信电子承诺；F009/F023；R017；SRC-003第15条", requiredElements: ["科研诚信承诺/授权核验记录：学生本人与要求的成员/导师签名；S，SUBMIT；允许可信电子承诺"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M012", name: "大创项目身份及结题关联：S06-T01 系统 B；C，仅成果以结题为奖条件时", purpose: "大创项目身份及结题关联：S06-T01 系统 B；C，仅成果以结题为奖条件时；F022；R015；SRC-001/002", requiredElements: ["大创项目身份及结题关联：S06-T01 系统 B；C，仅成果以结题为奖条件时"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M013", name: "历史申报记录与原奖励决定：当前案件关联的校级台账 B；C，重复/升级或复核旧案时", purpose: "历史申报记录与原奖励决定：当前案件关联的校级台账 B；C，重复/升级或复核旧案时；F019；R018/R019；SRC-001/010/015", requiredElements: ["历史申报记录与原奖励决定：当前案件关联的校级台账 B；C，重复/升级或复核旧案时"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M014", name: "跨批次奖励查重回执：经授权服务端检索的带覆盖范围回执，包含查不到/权限不足；B、REVIEW", purpose: "跨批次奖励查重回执：经授权服务端检索的带覆盖范围回执，包含查不到/权限不足；B、REVIEW；F019/F020；R018/R019；SRC-010/013/015", requiredElements: ["跨批次奖励查重回执：经授权服务端检索的带覆盖范围回执，包含查不到/权限不足；B、REVIEW"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M015", name: "科研诚信调查及正式处理决定：有权部门受限接口 B；C，仅被正式告知存在待处理案件时；学生不得被要求自取他人处分档案", purpose: "科研诚信调查及正式处理决定：有权部门受限接口 B；C，仅被正式告知存在待处理案件时；学生不得被要求自取他人处分档案；F024；R020；SRC-003/011", requiredElements: ["科研诚信调查及正式处理决定：有权部门受限接口 B；C，仅被正式告知存在待处理案件时；学生不得被要求自取他人处分档案"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M016", name: "撤回申请与受理决定：学生请求和有权人回执两条不同事件；L，C09；有电子签名替纸件", purpose: "撤回申请与受理决定：学生请求和有权人回执两条不同事件；L，C09；有电子签名替纸件；F029；R023；SRC-001", requiredElements: ["撤回申请与受理决定：学生请求和有权人回执两条不同事件；L，C09；有电子签名替纸件"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M017", name: "异议/复核申请与新证据：争议要点、指定规则/成果、材料版本；L，C10；不得提前在 SUBMIT 要求", purpose: "异议/复核申请与新证据：争议要点、指定规则/成果、材料版本；L，C10；不得提前在 SUBMIT 要求；F030；R024；SRC-001/009", requiredElements: ["异议/复核申请与新证据：争议要点、指定规则/成果、材料版本；L，C10；不得提前在 SUBMIT 要求"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M018", name: "评审、公示、正式决定、例外决定与撤销处置：后端签发的一组分阶段记录，每条子记录单独版本与授权；L/B，C07/C10/C11；未经签发不得补空白章", purpose: "评审、公示、正式决定、例外决定与撤销处置：后端签发的一组分阶段记录，每条子记录单独版本与授权；L/B，C07/C10/C11；未经签发不得补空白章；F027/F028/F031/F034；R021/R022/R025/R026；SRC-003/009", requiredElements: ["评审、公示、正式决定、例外决定与撤销处置：后端签发的一组分阶段记录，每条子记录单独版本与授权；L/B，C07/C10/C11；未经签发不得补空白章"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
  ],
  sections: [{
    id: 'research-review', name: '逐条事实核验与人工复审', order: 0, required: true,
    description: '每个 R 编号是独立可追踪的审核要求；即使语义核验得到事实也不等于政策合规或正式校方决定。',
    criteria: [
      { id: "R001", title: "存在独立有效的学生成果奖励批次；SUBMIT/全部；F002,F003,F010；M001；SRC-001,005", requirement: "存在独立有效的学生成果奖励批次；SUBMIT/全部；F002,F003,F010；M001；SRC-001,005；可读有效通知且独立于 S03 → PASS_FACT/承办人；公告显属荣誉/竞赛 → NOT_APPLICABLE/路由员改投 S03/S06-T03；无法取得正文或适用主体系争议 → POLICY_UNCONFIRMED/政策管理员", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F002","F003","F010"], materialSlotIds: ["M001"], researchSourceIds: ["SRC-001"] } },
      { id: "R002", title: "本次申请目标确为成果奖励而非权属/竞赛认定；SUBMIT/全部；F001,F010,F012；M001,M003；SRC-001,002", requirement: "本次申请目标确为成果奖励而非权属/竞赛认定；SUBMIT/全部；F001,F010,F012；M001,M003；SRC-001,002；对象匹配 → PASS_FACT/受理人；目标明确属 G06/S03/竞赛 → NOT_APPLICABLE/路由员；多模板同等匹配 → NEEDS_HUMAN_DECISION/申请人确认", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F001","F010","F012"], materialSlotIds: ["M001","M003"], researchSourceIds: ["SRC-001"] } },
      { id: "R003", title: "申请书表达本批次明确奖种及本人申报意愿；SUBMIT/全部；F002,F009,F010；M001,M003；SRC-001,013", requirement: "申请书表达本批次明确奖种及本人申报意愿；SUBMIT/全部；F002,F009,F010；M001,M003；SRC-001,013；一致 → PASS_FACT/受理人；错报其他批次/冒签 → CONFLICT/受理人；缺签/缺申请书 → NEEDS_MATERIAL/申请人", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F002","F009","F010"], materialSlotIds: ["M001","M003"], researchSourceIds: ["SRC-001"] } },
      { id: "R004", title: "申请所属学段被该批次允许；SUBMIT/全部；F005,F007；M001,M002；SRC-001,006,009", requirement: "申请所属学段被该批次允许；SUBMIT/全部；F005,F007；M001,M002；SRC-001,006,009；校方规则及学段匹配 → PASS_FACT/学院；已明确排除该学段 → CONFLICT/受理人核路由；规则没写/身份源失联 → POLICY_UNCONFIRMED或SOURCE_UNAVAILABLE/政策管理员或学籍服务", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F005","F007"], materialSlotIds: ["M001","M002"], researchSourceIds: ["SRC-001"] } },
      { id: "R005", title: "提交时间处于本批可受理窗口；SUBMIT/全部；F003,F004,F025；M001,M003；SRC-001,013", requirement: "提交时间处于本批可受理窗口；SUBMIT/全部；F003,F004,F025；M001,M003；SRC-001,013；时点合法 → PASS_FACT/受理人；明确逾期且无受理例外 → NEEDS_HUMAN_DECISION/有权受理人；窗口未公告 → POLICY_UNCONFIRMED/批次主管", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F004","F025"], materialSlotIds: ["M001","M003"], researchSourceIds: ["SRC-001"] } },
      { id: "R006", title: "所需时点学生身份有效且归属学院可信；SUBMIT/全部；F006,F007,F008；M002；SRC-003,006", requirement: "所需时点学生身份有效且归属学院可信；SUBMIT/全部；F006,F007,F008；M002；SRC-003,006；学籍原始记录吻合 → PASS_FACT/学院；校方与申请人身份不一致 → CONFLICT/学籍管理员；权威接口无法查询 → SOURCE_UNAVAILABLE/学籍管理员", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F006","F007","F008"], materialSlotIds: ["M002"], researchSourceIds: ["SRC-003"] } },
      { id: "R007", title: "申请书成果 ID 与提交清单对应且没有无来源增项；SUBMIT/全部；F010–F013；M003,M009；SRC-001,013", requirement: "申请书成果 ID 与提交清单对应且没有无来源增项；SUBMIT/全部；F010–F013；M003,M009；SRC-001,013；清单逐项对应 → PASS_FACT/学院；不同成果混成单项 → CONFLICT/申请人；漏清单 → NEEDS_MATERIAL/申请人", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F010","F011","F012","F013"], materialSlotIds: ["M003","M009"], researchSourceIds: ["SRC-001"] } },
      { id: "R008", title: "团队代理确获所有被申报成员授权；SUBMIT/C04；F009,F018；M004；SRC-003,013", requirement: "团队代理确获所有被申报成员授权；SUBMIT/C04；F009,F018；M004；SRC-003,013；签名对应可信成员 → PASS_FACT/学院；被申报者否认/身份冲突 → CONFLICT/学院核验；未授权成员 → NEEDS_MATERIAL/团队代表；个人申请 → NOT_APPLICABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F009","F018"], materialSlotIds: ["M004"], researchSourceIds: ["SRC-003"] } },
      { id: "R009", title: "成果标识与权威成果客体对应；REVIEW/C01–C05；F011–F013；M005/M006/M007,M009；SRC-004,012", requirement: "成果标识与权威成果客体对应；REVIEW/C01–C05；F011–F013；M005/M006/M007,M009；SRC-004,012；DOI/公告号/登记号＋原文对应 → PASS_FACT/学院；号与标题/权利客体不符 → CONFLICT/成果核验员；材料未交/不可读 → NEEDS_MATERIAL或UNREADABLE/申请人", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F011","F012","F013"], materialSlotIds: ["M005","M006","M007","M009"], researchSourceIds: ["SRC-004"] } },
      { id: "R010", title: "发表、出版、授权或登记状态已被权威来源证实；REVIEW/C01–C03；F013,F014；M005/M006/M007；SRC-004,012", requirement: "发表、出版、授权或登记状态已被权威来源证实；REVIEW/C01–C03；F013,F014；M005/M006/M007；SRC-004,012；状态及日期可核 → PASS_FACT/成果核验员；“录用”伪写成“见刊”等 → CONFLICT/核验员；官网/数据库不可用 → SOURCE_UNAVAILABLE/成果持有人或资料管理员", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F013","F014"], materialSlotIds: ["M005","M006","M007"], researchSourceIds: ["SRC-004"] } },
      { id: "R011", title: "申请人确在成果官方署名/发明人表列中；REVIEW/C01–C04；F006,F016；M005/M006/M007,M008；SRC-003,004", requirement: "申请人确在成果官方署名/发明人表列中；REVIEW/C01–C04；F006,F016；M005/M006/M007,M008；SRC-003,004；身份、署名原件、排序相符 → PASS_FACT/学院；官方表无本人或相互矛盾 → CONFLICT/有权成果部门；共一、姓名重名无可靠同一性 → NEEDS_HUMAN_DECISION/学院", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F006","F016"], materialSlotIds: ["M005","M006","M007","M008"], researchSourceIds: ["SRC-003"] } },
      { id: "R012", title: "申报贡献陈述有团队或导师核对支持；REVIEW/多人合作；F016–F018；M004,M008；SRC-003第12条,013", requirement: "申报贡献陈述有团队或导师核对支持；REVIEW/多人合作；F016–F018；M004,M008；SRC-003第12条,013；声明与成员确认相符 → PASS_FACT/专业评审；贡献争议或签字否认 → CONFLICT/学院调查；缺陈述 → NEEDS_MATERIAL/团队；独作成果 → NOT_APPLICABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F016","F017","F018"], materialSlotIds: ["M004","M008"], researchSourceIds: ["SRC-003"] } },
      { id: "R013", title: "署名单位及成果形成时间满足本批明示口径；REVIEW/成果类；F003,F013,F015；M001,M005/M006/M007,M009；SRC-004,006,013", requirement: "署名单位及成果形成时间满足本批明示口径；REVIEW/成果类；F003,F013,F015；M001,M005/M006/M007,M009；SRC-004,006,013；与有效本批规定匹配 → PASS_FACT/学院；明确不符 → NEEDS_HUMAN_DECISION/有权受理人决定不受理与否；本批未确认是否要第一单位/起止日 → POLICY_UNCONFIRMED/政策管理员", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F013","F015"], materialSlotIds: ["M001","M005","M006","M007","M009"], researchSourceIds: ["SRC-004"] } },
      { id: "R014", title: "专利/软件类奖励所要求的状态与成果类型相符；REVIEW/C03；F012,F014；M001,M006/M007；SRC-004,012,014", requirement: "专利/软件类奖励所要求的状态与成果类型相符；REVIEW/C03；F012,F014；M001,M006/M007；SRC-004,012,014；达到本批明定的授权/登记状态 → PASS_FACT/学院；仅申请号却声称授权 → CONFLICT/成果核验员；校本批次对软件或发明受理能否奖励未知 → POLICY_UNCONFIRMED/政策管理员；论文情形 → NOT_APPLICABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F012","F014"], materialSlotIds: ["M001","M006","M007"], researchSourceIds: ["SRC-004"] } },
      { id: "R015", title: "引用项目的阶段身份和成果归属关系真实；REVIEW/C05；F011,F022；M008,M012；SRC-001,002", requirement: "引用项目的阶段身份和成果归属关系真实；REVIEW/C05；F011,F022；M008,M012；SRC-001,002；已签的阶段/结题记录匹配 → PASS_FACT/学院；项目号或参与关系相冲突 → CONFLICT/S06-T01 主管；项目系统不可达 → SOURCE_UNAVAILABLE/接口管理员；未要求项目结题 → NOT_APPLICABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F011","F022"], materialSlotIds: ["M008","M012"], researchSourceIds: ["SRC-001"] } },
      { id: "R016", title: "G06 关联成果的已签版本未被撤销或更正；REVIEW/通知要求 G06 前置的客体；F011,F021；M010；SRC-001,002,012", requirement: "G06 关联成果的已签版本未被撤销或更正；REVIEW/通知要求 G06 前置的客体；F011,F021；M010；SRC-001,002,012；有签决定且版本绑定匹配 → PASS_FACT/学院；G06 已撤销/署名更正与申请不符 → CONFLICT/G06 处理人；接口无权限/未出具 → SOURCE_UNAVAILABLE或NEEDS_HUMAN_DECISION/G06；无需该前置 → NOT_APPLICABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F011","F021"], materialSlotIds: ["M010"], researchSourceIds: ["SRC-001"] } },
      { id: "R017", title: "科研诚信承诺与授权核验已由本人真实作出；SUBMIT/全部；F009,F023；M011；SRC-003第15–16条", requirement: "科研诚信承诺与授权核验已由本人真实作出；SUBMIT/全部；F009,F023；M011；SRC-003第15–16条；完整可信承诺 → PASS_FACT/学院；否认签署/冒签 → CONFLICT/诚信主管；未签 → NEEDS_MATERIAL/申请人；OCR“有印章”不能直接判真", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F009","F023"], materialSlotIds: ["M011"], researchSourceIds: ["SRC-003"] } },
      { id: "R018", title: "既往奖项查重覆盖范围、检索时点及权威来源充分；REVIEW/全部；F011,F019,F020；M001,M013,M014；SRC-001,010,013", requirement: "既往奖项查重覆盖范围、检索时点及权威来源充分；REVIEW/全部；F011,F019,F020；M001,M013,M014；SRC-001,010,013；当前通知规定的台账已检且有覆盖范围回执 → PASS_FACT/奖项管理员；仅检单院、缺跨批索引 → SOURCE_UNAVAILABLE/奖项管理员补查；政策不说明查重范围 → POLICY_UNCONFIRMED/政策管理员", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F011","F019","F020"], materialSlotIds: ["M001","M013","M014"], researchSourceIds: ["SRC-001"] } },
      { id: "R019", title: "本成果的既往奖励关系符合该批明示的不重复规则；REVIEW/C06及全部可能重复；F011,F019,F020；M001,M013,M014；SRC-005,010,013,015", requirement: "本成果的既往奖励关系符合该批明示的不重复规则；REVIEW/C06及全部可能重复；F011,F019,F020；M001,M013,M014；SRC-005,010,013,015；本批允许或明示例外且有签记录 → PASS_FACT/校级评审；证实同权利重复领取而政策明禁 → CONFLICT/奖项主管；未查全、是否可升级补差或跨奖重复无规定 → SOURCE_UNAVAILABLE或POLICY_UNCONFIRMED/主管；不得将 SRC-010 的国奖限制类推所有奖励", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F011","F019","F020"], materialSlotIds: ["M001","M013","M014"], researchSourceIds: ["SRC-005","SRC-010"] } },
      { id: "R020", title: "是否存在正式生效且适用于本奖励的科研诚信禁评决定；REVIEW/C07/C11；F006,F024；M015；SRC-003第16、21–25条,011", requirement: "是否存在正式生效且适用于本奖励的科研诚信禁评决定；REVIEW/C07/C11；F006,F024；M015；SRC-003第16、21–25条,011；官方查询明确适用中的禁评决定 → NEEDS_HUMAN_DECISION/有权诚信及奖项部门依法处理；官方回执明确核查覆盖且无有效禁评 → PASS_FACT/奖项部门；调查中、无权限或查询失败 → NEEDS_HUMAN_DECISION或SOURCE_UNAVAILABLE/诚信主管；不凭举报自动定罪", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F006","F024"], materialSlotIds: ["M015"], researchSourceIds: ["SRC-003"] } },
      { id: "R021", title: "评审程序中回避、专业评价所需签署完整；REVIEW/进入专业评议者；F025,F027,F034；M018；SRC-003,009", requirement: "评审程序中回避、专业评价所需签署完整；REVIEW/进入专业评议者；F025,F027,F034；M018；SRC-003,009；应到评议/回避签名完整 → PASS_FACT/校级组织者；存在未回避或角色无权限 → CONFLICT/组织者；尚未开评审 → NOT_APPLICABLE；裁量分歧 → NEEDS_HUMAN_DECISION/评审组", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F025","F027","F034"], materialSlotIds: ["M018"], researchSourceIds: ["SRC-003"] } },
      { id: "R022", title: "奖项决定确由授权机构按批次签发；DECIDE/候选公示后；F003,F025,F028,F031；M001,M018；SRC-005,006,009", requirement: "奖项决定确由授权机构按批次签发；DECIDE/候选公示后；F003,F025,F028,F031；M001,M018；SRC-005,006,009；后端签名、适用政策及公示阶段均匹配 → PASS_FACT（“存在已签决定”而非 AI 审批）/归档员；文书签发人或公示时点不符 → CONFLICT/校级秘书；尚未决定 → NOT_APPLICABLE；批次权限规则未知 → POLICY_UNCONFIRMED/主管", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F025","F028","F031"], materialSlotIds: ["M001","M018"], researchSourceIds: ["SRC-005"] } },
      { id: "R023", title: "撤回请求来自有权申请人且具备本阶段撤回权限；WITHDRAW/C09；F009,F025,F029；M016；SRC-001,009", requirement: "撤回请求来自有权申请人且具备本阶段撤回权限；WITHDRAW/C09；F009,F025,F029；M016；SRC-001,009；合法请求且后端确认生效 → PASS_FACT/受理人；他人冒撤、已决定却当作草稿撤回 → CONFLICT/主管；申请未收到回执 → NEEDS_HUMAN_DECISION/受理人；未发起撤回 → NOT_APPLICABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F009","F025","F029"], materialSlotIds: ["M016"], researchSourceIds: ["SRC-001"] } },
      { id: "R024", title: "申诉请求有可识别争议对象、提出人和时点；APPEAL/C10；F028,F030,F031；M017,M018；SRC-001,009,011", requirement: "申诉请求有可识别争议对象、提出人和时点；APPEAL/C10；F028,F030,F031；M017,M018；SRC-001,009,011；主体及时限可核且案件可定位 → PASS_FACT/复核秘书；针对其他主体无权申诉 → CONFLICT/复核秘书；本批未公开救济窗口 → POLICY_UNCONFIRMED/有权主管；没有申诉 → NOT_APPLICABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F028","F030","F031"], materialSlotIds: ["M017","M018"], researchSourceIds: ["SRC-001"] } },
      { id: "R025", title: "撤销、追回或重新授奖有独立有权决定而非预审自动生成；DECIDE/C11；F024,F028,F034；M015,M018；SRC-003第24条,009", requirement: "撤销、追回或重新授奖有独立有权决定而非预审自动生成；DECIDE/C11；F024,F028,F034；M015,M018；SRC-003第24条,009；有权撤销/变更决定真实 → PASS_FACT/校级决定执行人；仅 AI 怀疑就拟追回 → CONFLICT/主管；仍在调查或复核 → NEEDS_HUMAN_DECISION/有权调查与奖项主体；无撤销事件 → NOT_APPLICABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F024","F028","F034"], materialSlotIds: ["M015","M018"], researchSourceIds: ["SRC-003"] } },
      { id: "R026", title: "奖励资格决定与奖金支付后续事项相分离；DECIDE/已授奖；F028,F032；M018；SRC-001,002,009", requirement: "奖励资格决定与奖金支付后续事项相分离；DECIDE/已授奖；F028,F032；M018；SRC-001,002,009；有正式资格决定并另挂 G07 支付引用 → PASS_FACT/财务接口负责人；把预审 PASS_FACT 当付款指令或自行算款 → CONFLICT/后端阻断；G07 状态未返回 → SOURCE_UNAVAILABLE/财务服务；未授奖 → NOT_APPLICABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F028","F032"], materialSlotIds: ["M018"], researchSourceIds: ["SRC-001"] } },
    ],
  }],
  policyVersionIds: [],
  policyRefs: [],
  stages: [
    { id: 'intake', name: '材料识别与事实核验', kind: 'auto-check', executorRole: 'system', nextStageId: 'review' },
    { id: 'review', name: '证据冲突、缺件与政策适用人工复核', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'decision-review' },
    { id: 'decision-review', name: '人工确认和本地审阅建议', kind: 'manual-review', executorRole: 'teacher' },
  ],
  outputs: [
    { id: 'issues', kind: 'item-feedback', audience: 'reviewer' },
    { id: 'missing', kind: 'supplement-list', audience: 'student' },
  ],
  autoPassPolicy: { enabled: false },
  officialSchoolTemplate: false,
  policyEvidenceStatus: 'UNCONFIRMED',
  researchSource: { path: "docs/design/review-agent/business-templates/R02/S06-T04.md", sha256: "aaf9e78f559d18cd12eb284273313f6505ca445188b3940014c849176aed28a8" },
  status: 'draft',
  createdAt: '2026-10-24T00:00:00.000Z',
}

export default template

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
