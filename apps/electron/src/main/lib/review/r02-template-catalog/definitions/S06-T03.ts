/**
 * S06-T03｜学科竞赛奖项、成绩与参赛角色认定审核
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
  "templateId": "S06-T03",
  "name": "学科竞赛奖项、成绩与参赛角色认定审核",
  "sourcePath": "docs/design/review-agent/business-templates/R02/S06-T03.md",
  "sourceSha256": "7fac598f0200289f14564b1a7c26fdb3d6494acfa01385cabce7e9e06c5e4a98",
  "officialSchoolTemplate": false,
  "policyEvidenceStatus": "UNCONFIRMED",
  "researchSourceStatus": "LIBRARY_FORMAL_RESEARCH_V1",
  "deduplicationBoundary": "赛事主办方+届次+赛道/赛段+团队+被认定人+奖项/成绩；赛前推荐 S06-T02 不等于获奖事实，其他奖学金/成果奖励只引用已签事实，不再次认定。",
  "ruleBindings": [
    {
      "id": "R001",
      "fields": [
        "F005",
        "F006",
        "F007",
        "F008",
        "F009",
        "F010",
        "F011",
        "F012"
      ],
      "materials": [
        "M001",
        "M002"
      ],
      "researchSources": [
        "SRC-019"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R002",
      "fields": [
        "F001",
        "F002"
      ],
      "materials": [
        "M002",
        "M018"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R003",
      "fields": [
        "F003",
        "F004"
      ],
      "materials": [
        "M003",
        "M012"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R004",
      "fields": [
        "F007",
        "F008",
        "F009",
        "F010",
        "F011",
        "F012"
      ],
      "materials": [
        "M001",
        "M004",
        "M019"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R005",
      "fields": [
        "F017",
        "F018",
        "F019",
        "F020",
        "F028",
        "F030"
      ],
      "materials": [
        "M004",
        "M005",
        "M014"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R006",
      "fields": [
        "F016",
        "F028",
        "F032"
      ],
      "materials": [
        "M004",
        "M013"
      ],
      "researchSources": [
        "SRC-004"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R007",
      "fields": [
        "F014",
        "F015",
        "F017",
        "F018",
        "F019",
        "F020"
      ],
      "materials": [
        "M004",
        "M005"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R008",
      "fields": [
        "F012",
        "F013",
        "F029"
      ],
      "materials": [
        "M009",
        "M019"
      ],
      "researchSources": [
        "SRC-003"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R009",
      "fields": [
        "F001",
        "F014",
        "F018",
        "F019",
        "F020"
      ],
      "materials": [
        "M002",
        "M005"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R010",
      "fields": [
        "F001",
        "F021",
        "F022"
      ],
      "materials": [
        "M004",
        "M006"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R011",
      "fields": [
        "F022",
        "F023",
        "F024",
        "F025"
      ],
      "materials": [
        "M006",
        "M010",
        "M011",
        "M019"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R012",
      "fields": [
        "F015",
        "F026",
        "F027"
      ],
      "materials": [
        "M008",
        "M019"
      ],
      "researchSources": [
        "SRC-013"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R013",
      "fields": [
        "F006",
        "F021",
        "F022",
        "F023"
      ],
      "materials": [
        "M007",
        "M008"
      ],
      "researchSources": [
        "SRC-007"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R014",
      "fields": [
        "F003",
        "F004",
        "F021"
      ],
      "materials": [
        "M007",
        "M012"
      ],
      "researchSources": [
        "SRC-019"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R015",
      "fields": [
        "F021",
        "F022",
        "F023",
        "F024"
      ],
      "materials": [
        "M006",
        "M010"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R016",
      "fields": [
        "F016",
        "F028",
        "F032"
      ],
      "materials": [
        "M004",
        "M013"
      ],
      "researchSources": [
        "SRC-008"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R017",
      "fields": [
        "F023",
        "F024",
        "F025"
      ],
      "materials": [
        "M010",
        "M011"
      ],
      "researchSources": [
        "SRC-010"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R018",
      "fields": [
        "F008",
        "F009",
        "F010",
        "F011",
        "F012",
        "F013",
        "F014",
        "F015",
        "F016",
        "F029",
        "F031"
      ],
      "materials": [
        "M009",
        "M016"
      ],
      "researchSources": [
        "SRC-019"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R019",
      "fields": [
        "F003",
        "F004",
        "F022"
      ],
      "materials": [
        "M003",
        "M006"
      ],
      "researchSources": [
        "SRC-005"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R020",
      "fields": [
        "F017",
        "F028",
        "F030"
      ],
      "materials": [
        "M004",
        "M014"
      ],
      "researchSources": [
        "SRC-004"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R021",
      "fields": [
        "F001",
        "F002",
        "F022",
        "F030"
      ],
      "materials": [
        "M002",
        "M018"
      ],
      "researchSources": [
        "SRC-002"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R022",
      "fields": [
        "F009",
        "F013",
        "F023",
        "F024",
        "F029"
      ],
      "materials": [
        "M009",
        "M019"
      ],
      "researchSources": [
        "SRC-010"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R023",
      "fields": [
        "F002",
        "F005",
        "F032"
      ],
      "materials": [
        "M001",
        "M015"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R024",
      "fields": [
        "F016",
        "F028",
        "F030",
        "F031",
        "F032"
      ],
      "materials": [
        "M013",
        "M016"
      ],
      "researchSources": [
        "SRC-013"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R025",
      "fields": [
        "F002",
        "F030",
        "F031",
        "F032",
        "F033",
        "F034"
      ],
      "materials": [
        "M015",
        "M016",
        "M017"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "R026",
      "fields": [
        "F031",
        "F033",
        "F034"
      ],
      "materials": [
        "M016",
        "M017"
      ],
      "researchSources": [
        "SRC-001"
      ],
      "policyEvidenceStatus": "UNCONFIRMED"
    }
  ]
} as const

export const template: ResearchTemplateVersion = {
  templateId: "S06-T03",
  version: 1,
  schemaVersion: 2,
  name: "学科竞赛奖项、成绩与参赛角色认定审核",
  description: '本地研究模板／非校方正式模板。仅供材料分拣、事实核验、问题建议及人工复审；校本政策和决定权待确认。',
  catalogKind: 'reference',
  sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 正式研究稿 docs/design/review-agent/business-templates/R02/S06-T03.md；SHA-256 7fac598f0200289f14564b1a7c26fdb3d6494acfa01385cabce7e9e06c5e4a98；本地研究模板、非校方正式模板；所有政策细则待确认。",
  objectType: "project",
  displayName: { template: "学科竞赛奖项、成绩与参赛角色认定审核" },
  fields: [
    { key: "F001", label: "subjectStudentId:string", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "subjectStudentId:string；被认定人；全过程，不用姓名作主键；学籍/身份后台，P2；S；不能可靠识别则 SOURCE_UNAVAILABLE" },
    { key: "F002", label: "actorGrant:object", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "actorGrant:object；发起 actor、角色、授权范围与有效期；服务端认证/委托记录，P2；S；无权操作拒绝写入并派安全处理" },
    { key: "F003", label: "studentAtEventStatus:enum", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "studentAtEventStatus:enum；比赛举行时本科/硕/博/毕业/转学等历史状态；当期学籍快照，P2；S；历史档案不可得等可信核验" },
    { key: "F004", label: "affiliationAtEvent:string", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "affiliationAtEvent:string；赛时学校/学院、跨校组队单位；当期学籍+赛方队伍，P1；S/C；允许姓名相同但学校不同" },
    { key: "F005", label: "caseStage:enum", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "caseStage:enum；03 的申请阶段/修订态；Case 后端事件，P1；S；不可由用户随意改" },
    { key: "F006", label: "claimKind:enum", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "claimKind:enum；AWARD/TEAM_ROLE/SCORE/PARTICIPATION/CORRECTION；本人声明/有权业务操作，P1；Q；不同类型的材料条件不同" },
    { key: "F007", label: "organizerName:string", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "organizerName:string；本届该赛段实际主办/授奖单位；赛事章程/官方页面，P0；Q；不能与赞助单位混淆" },
    { key: "F008", label: "competitionKey:string", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "competitionKey:string；赛事名、唯一活动主键；同名异赛要分开；官方公告/赛事目录，P0；Q" },
    { key: "F009", label: "edition:string", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "edition:string；年份/届数（可同时持有），比赛事件时点；官方赛事标识，P0；Q" },
    { key: "F010", label: "track:string", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "track:string；赛道/赛题/作品方向；无则 N/A；组委会规则/结果，P0；C；不可自行把赛题 A 当赛道" },
    { key: "F011", label: "division:string", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "division:string；本科/研究生/地区/专业组别；组委会章程及公告，P0；C；未公布时未知" },
    { key: "F012", label: "roundAndTier:string", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "roundAndTier:string；校赛/省赛/全国/国际赛段事实；颁奖单位/官方公告，P0；Q；不能从“全国大赛校选赛”名称推全国奖" },
    { key: "F013", label: "schoolClass:string?", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "schoolClass:string?；对该赛事/年份/用途的校方类别 A1/A2…（若适用）；年度学校目录/有权校方映射，P1；U；不决定获奖事实真假" },
    { key: "F014", label: "awardTitle:string?", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "awardTitle:string?；原文奖名称/等次，不自行升级转换；官方最终公告/证书，P0；C：仅 AWARD" },
    { key: "F015", label: "placeOrRank:string?", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "placeOrRank:string?；原文排名/名次，缺值不可反推出“第一”；组委会正式记录，P1；C：SCORE/RANK" },
    { key: "F016", label: "externalResultState:enum", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "externalResultState:enum；NO_RESULT/PROVISIONAL/FINAL/CORRECTED/REVOKED/UNKNOWN；组委会公告历史，P1；S；不能确定时 SOURCE_UNAVAILABLE" },
    { key: "F017", label: "noticeLocator:string?", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "noticeLocator:string?；正式页面/公告号/发布文件与页码；主办方可追溯 URL/文件，P0；C；如有官方证书核验可合法替代" },
    { key: "F018", label: "certificateCode:string?", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "certificateCode:string?；证书序列号或可核验证件 URL；组委会证书库，P1；C；未签发证书不提前报缺" },
    { key: "F019", label: "certificateIssuer:string?", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "certificateIssuer:string?；证书颁发机关（不是二次宣传媒体）；电子证书签名或原件，P0；C" },
    { key: "F020", label: "certificateIssuedAt:date?", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "certificateIssuedAt:date?；证书正式签发时间；官方证书记录，P1；C" },
    { key: "F021", label: "teamKey:string?", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "teamKey:string?；官方队伍编号，缺官方号用本地临时关联键不可冒充官方；主办方报名台账，P1；C：TEAM_ROLE/团队奖" },
    { key: "F022", label: "teamRoster:array<memberToken>", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "teamRoster:array<memberToken>；参赛队员列表；每人是稳定 token + 学校归属；组委会官方名单/获奖文件，P2；C；只认申报人时可仅持本人片段" },
    { key: "F023", label: "subjectRole:enum?", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "subjectRole:enum?；contestant/captain/coach/organizer/other，必须区分“申报角色”与“已证角色”；官方角色文件/经授权校方核对，P1；C；无证 NEEDS_HUMAN_DECISION" },
    { key: "F024", label: "memberOrder:integer?", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "memberOrder:integer?；参赛者官方“名次/署名排序”及其排序语义；队伍原始署名文件，P1；C；显示顺序不是贡献排序" },
    { key: "F025", label: "contributionNarrative:string?", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "contributionNarrative:string?；设计/编程/答辩等自述及证据，不等于权属份额；本人+团队记录，P2；C；涉及贡献争议仅人工评议" },
    { key: "F026", label: "scoreValue:decimal?", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "scoreValue:decimal?；原始得分，不自行换算学分/GPA；组委会成绩系统，P1；C：SCORE 且主办方确有成绩" },
    { key: "F027", label: "scoreUnit:string?", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "scoreUnit:string?；分数满分/赛段/等级换算来源；官方规则，P0；C；无法释义不通过成绩核验" },
    { key: "F028", label: "sourceRevision:object", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "sourceRevision:object；URL/发布时间/抓取快照/签名与校验指纹；可信取证适配器，P1；S；丢失则 SOURCE_UNAVAILABLE" },
    { key: "F029", label: "schoolCatalogRevision:string?", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "schoolCatalogRevision:string?；目录的签发单位、年度、适用学段、有效起止及版本；学校正式目录与配置，P1；U；目录缺失不等于奖不存在" },
    { key: "F030", label: "evidenceVersion:object", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "evidenceVersion:object；每一槽 fileId/hash/uploadAt/owner/readingStatus；Case 存储、服务端记录，P1；S；不可读需单槽提示" },
    { key: "F031", label: "priorRecognitionRef:string?", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "priorRecognitionRef:string?；学校已签同赛事单元的 decisionId/revision；可信决定/Outbox，P1；S；缺记录可初次申请" },
    { key: "F032", label: "petitionEvent:object?", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "petitionEvent:object?；异议/撤回/更正的种类、发生时点、受理编号、主体；校内事件+赛方回执，P2；C：异议或更正时" },
    { key: "F033", label: "schoolDecisionRef:object?", kind: 'text', required: false, visibility: "internal", scope: 'case', extractionHint: "schoolDecisionRef:object?；有权校内签发人/机构、decisionId、签发时间、状态；服务端签认台账，P2；L；不得作为提交前材料" },
    { key: "F034", label: "finalOutputState:enum", kind: 'text', required: false, visibility: "public", scope: 'case', extractionHint: "finalOutputState:enum；本次核验状态、每个 claim/item 的终态；规则组合器+有权签认，P1；L；不能由学生填写" },
  ],
  materialSlots: [
    { id: "M001", name: "申请事实声明：竞赛、年届、赛道/组别、本人主张；本人提交；授权代录的批次申报清单等效", purpose: "申请事实声明：竞赛、年届、赛道/组别、本人主张；本人提交；授权代录的批次申报清单等效；A；缺关键锚点 NEEDS_MATERIAL；格式损坏 UNREADABLE；F005–F017、F021–F027；R001/R004/R023；SRC-019/021", requiredElements: ["申请事实声明：竞赛、年届、赛道/组别、本人主张；本人提交；授权代录的批次申报清单等效"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M002", name: "服务端身份与代理授权：校内登录票据/委托记录；由可信适配器持有，不要求上传身份证照", purpose: "服务端身份与代理授权：校内登录票据/委托记录；由可信适配器持有，不要求上传身份证照；A/S；授权拒绝独立安全事件，身份服务离线 SOURCE_UNAVAILABLE；F001/F002；R001/R002/R009/R021；SRC-002", requiredElements: ["服务端身份与代理授权：校内登录票据/委托记录；由可信适配器持有，不要求上传身份证照"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M003", name: "赛时学籍和学校归属快照：学籍后端/历史档案；有效历史认定记录替代", purpose: "赛时学籍和学校归属快照：学籍后端/历史档案；有效历史认定记录替代；C/S；不是“没有上传学籍截图”的缺件；离线派档案核验；F003/F004；R003/R019；SRC-001/002", requiredElements: ["赛时学籍和学校归属快照：学籍后端/历史档案；有效历史认定记录替代"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M004", name: "官方获奖/成绩公告：组委会最终版、带签发路径的官方文件；必要时公示版只用于拟获奖事实", purpose: "官方获奖/成绩公告：组委会最终版、带签发路径的官方文件；必要时公示版只用于拟获奖事实；AWARD A/C；官方证书可补证；官方网页打不开记 SOURCE_UNAVAILABLE，不判伪；F007–F017/F028；R004/R005/R006/R007/R008/R010/R016/R020；SRC-004/005/006/013/014/015", requiredElements: ["官方获奖/成绩公告：组委会最终版、带签发路径的官方文件；必要时公示版只用于拟获奖事实"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M005", name: "证书：正式纸质证书高清图+主办方核验，或可验证电子证书、带认证的获奖文件", purpose: "证书：正式纸质证书高清图+主办方核验，或可验证电子证书、带认证的获奖文件；仅证书已经签发时 C；公告已可核时不一律要求；OCR 失败 UNREADABLE；F014/F018–F020/F030；R005/R007/R009；SRC-007/008/017", requiredElements: ["证书：正式纸质证书高清图+主办方核验，或可验证电子证书、带认证的获奖文件"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M006", name: "正式获奖队伍/参赛队员名册：组委会名单、核验接口或原始组队备案；团队负责人持有", purpose: "正式获奖队伍/参赛队员名册：组委会名单、核验接口或原始组队备案；团队负责人持有；TEAM A/C；未列全体成员则只查已证人员，不虚构名单；F021–F024/F028；R010/R011/R015/R019；SRC-005/013", requiredElements: ["正式获奖队伍/参赛队员名册：组委会名单、核验接口或原始组队备案；团队负责人持有"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M007", name: "参赛确认：赛方报名成功与出勤/提交作品/成绩的正式台账或学校赛事组织签到（按主张范围）", purpose: "参赛确认：赛方报名成功与出勤/提交作品/成绩的正式台账或学校赛事组织签到（按主张范围）；PARTICIPATION C；纯报名成功不等于实际到赛；不可读 UNREADABLE；F006/F008–F012/F021–F023；R013/R014；SRC-007/008/013", requiredElements: ["参赛确认：赛方报名成功与出勤/提交作品/成绩的正式台账或学校赛事组织签到（按主张范围）"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M008", name: "赛事正式成绩表及评阅结果：赛事成绩查询页/签发成绩记录；无公布成绩的赛事填 N/A", purpose: "赛事正式成绩表及评阅结果：赛事成绩查询页/签发成绩记录；无公布成绩的赛事填 N/A；SCORE C；不向无成绩赛事索要未来/不存在的成绩单；F015/F026/F027/F028；R012/R013；SRC-013/014", requiredElements: ["赛事正式成绩表及评阅结果：赛事成绩查询页/签发成绩记录；无公布成绩的赛事填 N/A"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M009", name: "学校当年度竞赛认定目录与规则：经认证签发的目录、适用区间和适用学段", purpose: "学校当年度竞赛认定目录与规则：经认证签发的目录、适用区间和适用学段；CLASSIFICATION C/U；缺目录 POLICY_UNCONFIRMED，奖项事实继续查；F013/F029；R008/R018/R022；SRC-003/010/011/012/016", requiredElements: ["学校当年度竞赛认定目录与规则：经认证签发的目录、适用区间和适用学段"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M010", name: "官方成员角色及署名顺序：队伍提交页/最终团队名单/组委会明确角色文件", purpose: "官方成员角色及署名顺序：队伍提交页/最终团队名单/组委会明确角色文件；ROLE C；“队员”可由名册证；无官方队长/贡献记录不可猜；F022–F024；R011/R015/R017；SRC-005/013", requiredElements: ["官方成员角色及署名顺序：队伍提交页/最终团队名单/组委会明确角色文件"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M011", name: "贡献与角色补证：答辩分工、提交记录、导师说明、成员意见；仅供有权人裁量", purpose: "贡献与角色补证：答辩分工、提交记录、导师说明、成员意见；仅供有权人裁量；有争议且需要个人贡献判定 C；材料齐全仍 NEEDS_HUMAN_DECISION；F023–F025；R011/R017；SRC-010/011/002", requiredElements: ["贡献与角色补证：答辩分工、提交记录、导师说明、成员意见；仅供有权人裁量"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M012", name: "已签 S06-T02 参赛/推荐决定、学校事先备案；只有确实走过该程序才有", purpose: "已签 S06-T02 参赛/推荐决定、学校事先备案；只有确实走过该程序才有；C；不存在不会否定外部获奖事实；不得倒逼补办过去审批；F003/F004/F021；R003/R014；SRC-019/020", requiredElements: ["已签 S06-T02 参赛/推荐决定、学校事先备案；只有确实走过该程序才有"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M013", name: "组委会的更正、补充名单、撤奖、申诉答复；由原授奖机构发布/服务端取回", purpose: "组委会的更正、补充名单、撤奖、申诉答复；由原授奖机构发布/服务端取回；更正撤销 C；只有举报无正式处理则保留争议状态；F016/F028/F032；R006/R016/R024；SRC-008/013/014", requiredElements: ["组委会的更正、补充名单、撤奖、申诉答复；由原授奖机构发布/服务端取回"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M014", name: "官方来源核验/取证回执：API 响应签章、公开网页快照、学校档案查询与失败日志", purpose: "官方来源核验/取证回执：API 响应签章、公开网页快照、学校档案查询与失败日志；需要证据真实性/网站故障时 C；失败记录为 SOURCE_UNAVAILABLE，不是申请人造假；F017–F020/F028/F030；R005/R020；SRC-002/013/014", requiredElements: ["官方来源核验/取证回执：API 响应签章、公开网页快照、学校档案查询与失败日志"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M015", name: "申请人复核/异议/撤回请求及相应通知回执；校内系统记录", purpose: "申请人复核/异议/撤回请求及相应通知回执；校内系统记录；复核/撤回 C；未发生不要求；F005/F032；R023/R024/R025；SRC-001/013/014", requiredElements: ["申请人复核/异议/撤回请求及相应通知回执；校内系统记录"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M016", name: "已有获奖事实签认/下游引用账：decisionId+版本+原证据指纹", purpose: "已有获奖事实签认/下游引用账：decisionId+版本+原证据指纹；去重、变更 C/S；无此前记录是初申正常态；F030/F031/F033；R018/R024/R025/R026；SRC-019/021", requiredElements: ["已有获奖事实签认/下游引用账：decisionId+版本+原证据指纹"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M017", name: "学校本次事实认定决定/有权人电子签署及送达回执；校内可信签发服务产出", purpose: "学校本次事实认定决定/有权人电子签署及送达回执；校内可信签发服务产出；L；申请时绝不报缺；签发失败时保持人工待办；F033/F034；R025/R026；SRC-001/021", requiredElements: ["学校本次事实认定决定/有权人电子签署及送达回执；校内可信签发服务产出"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M018", name: "处理他人队员信息的校方合法依据/有权批量录入授权及最小化策略；安全管理员持有", purpose: "处理他人队员信息的校方合法依据/有权批量录入授权及最小化策略；安全管理员持有；跨人批量办理 C/S；不得要学生擅自收集身份证号码；F001/F002/F022/F030；R002/R021；SRC-002", requiredElements: ["处理他人队员信息的校方合法依据/有权批量录入授权及最小化策略；安全管理员持有"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
    { id: "M019", name: "该届赛事章程、赛段、奖项/成绩与队伍角色定义原文；赛事主办方公布", purpose: "该届赛事章程、赛段、奖项/成绩与队伍角色定义原文；赛事主办方公布；新赛事/不同届次 C；找不到不能强行换算名次或层级；F007–F016/F023/F024/F027；R004/R008/R011/R012/R022；SRC-007/008/009/013", requiredElements: ["该届赛事章程、赛段、奖项/成绩与队伍角色定义原文；赛事主办方公布"], acceptedKinds: ['pdf','image','office','sheet','text'], minCount: 0, maxCount: 20, requiredAt: 'decision', allowReuseAcrossSubjects: false },
  ],
  sections: [{
    id: 'research-review', name: '逐条事实核验与人工复审', order: 0, required: true,
    description: '每个 R 编号是独立可追踪的审核要求；即使语义核验得到事实也不等于政策合规或正式校方决定。',
    criteria: [
      { id: "R001", title: "申请完整锚点；SUBMITTED，T=存在具体 claim、赛事与赛段，F=未提交，U=不能识别", requirement: "申请完整锚点；SUBMITTED，T=存在具体 claim、赛事与赛段，F=未提交，U=不能识别；F005–F012；M001/M002；SRC-019/021；校验字段与 stage；T PASS_FACT；必要锚点缺 NEEDS_MATERIAL 给申请人；格式错误 UNREADABLE 给材料支持；F NOT_APPLICABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F005","F006","F007","F008","F009","F010","F011","F012"], materialSlotIds: ["M001","M002"], researchSourceIds: ["SRC-019"] } },
      { id: "R002", title: "发起权与批量代录权限；SUBMITTED，T=有本人/合法授权，F=本次不涉及代理，U=身份后端失联", requirement: "发起权与批量代录权限；SUBMITTED，T=有本人/合法授权，F=本次不涉及代理，U=身份后端失联；F001/F002；M002/M018；SRC-002；服务端 grant scope 检查；有权 PASS_FACT；越权不写入并 NEEDS_HUMAN_DECISION 给安全/管理员；无可信认证 SOURCE_UNAVAILABLE；非代理分支 NOT_APPLICABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F001","F002"], materialSlotIds: ["M002","M018"], researchSourceIds: ["SRC-002"] } },
      { id: "R003", title: "比赛时点学籍/归属可证；FACT_PRECHECK，T=欲认定成都理工本人赛时身份，F=不主张本校学生事实，U=历史来源缺", requirement: "比赛时点学籍/归属可证；FACT_PRECHECK，T=欲认定成都理工本人赛时身份，F=不主张本校学生事实，U=历史来源缺；F003/F004；M003/M012；SRC-001/002；按日期对历史记录而非今天状态；匹配 PASS_FACT；权威记录不符 CONFLICT 给身份/学院核验；后端不可用 SOURCE_UNAVAILABLE；赛前 S06-T02 记录非必需", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F004"], materialSlotIds: ["M003","M012"], researchSourceIds: ["SRC-001"] } },
      { id: "R004", title: "赛事唯一标识/赛段一致；FACT_PRECHECK，T=外部竞赛事实，F=非学科竞赛，U=赛事章程不明", requirement: "赛事唯一标识/赛段一致；FACT_PRECHECK，T=外部竞赛事实，F=非学科竞赛，U=赛事章程不明；F007–F012；M001/M004/M019；SRC-005/006/013/019；主办方-年度-组别-赛段对齐；一致 PASS_FACT；不同赛事/校赛冒国赛 CONFLICT 给申请人/学院；不在范围 NOT_APPLICABLE 并路由；缺原章程 NEEDS_MATERIAL 或源失联 SOURCE_UNAVAILABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F007","F008","F009","F010","F011","F012"], materialSlotIds: ["M001","M004","M019"], researchSourceIds: ["SRC-005"] } },
      { id: "R005", title: "奖项证据来源真实性；FACT_PRECHECK，T=声称 AWARD，F=只主张参赛/角色，U=无法验证原件", requirement: "奖项证据来源真实性；FACT_PRECHECK，T=声称 AWARD，F=只主张参赛/角色，U=无法验证原件；F017–F020/F028/F030；M004/M005/M014；SRC-005/007/014/015；官网域名、签发者、证书验真/哈希与时间比较；可溯源 PASS_FACT；伪造嫌疑不自动定罪、矛盾 CONFLICT 给赛事联络人；不可读 UNREADABLE；官网故障 SOURCE_UNAVAILABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F017","F018","F019","F020","F028","F030"], materialSlotIds: ["M004","M005","M014"], researchSourceIds: ["SRC-005"] } },
      { id: "R006", title: "当前外部结果是否 FINAL；FACT_PRECHECK/复核，T=已正式发布，F=仅 PROVISIONAL/REVOKED，U=无法确定", requirement: "当前外部结果是否 FINAL；FACT_PRECHECK/复核，T=已正式发布，F=仅 PROVISIONAL/REVOKED，U=无法确定；F016/F028/F032；M004/M013；SRC-004/005/013/014/015；版本链+正式公告判断；FINAL PASS_FACT；公示初稿 NEEDS_HUMAN_DECISION 或等待来源（不可签最终获奖）；REVOKED CONFLICT 通知有权人；未知 SOURCE_UNAVAILABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F016","F028","F032"], materialSlotIds: ["M004","M013"], researchSourceIds: ["SRC-004"] } },
      { id: "R007", title: "获奖等次/名次按原文件逐字匹配；FACT_PRECHECK，T=AWARD，F=仅参赛，U=文件模糊", requirement: "获奖等次/名次按原文件逐字匹配；FACT_PRECHECK，T=AWARD，F=仅参赛，U=文件模糊；F014/F015/F017–F020；M004/M005；SRC-005/006/013；原文精确字段比对，禁止 OCR 推等级；精确 PASS_FACT；等次/赛段矛盾 CONFLICT；不可读 UNREADABLE；无可验证证书和公告 NEEDS_MATERIAL 或 SOURCE_UNAVAILABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F014","F015","F017","F018","F019","F020"], materialSlotIds: ["M004","M005"], researchSourceIds: ["SRC-005"] } },
      { id: "R008", title: "“国家/省/校”赛段与校方 A1/A2 等类别不得混同；分类阶段，T=用户请求学校类别，F=仅赛事事实，U=目录缺", requirement: "“国家/省/校”赛段与校方 A1/A2 等类别不得混同；分类阶段，T=用户请求学校类别，F=仅赛事事实，U=目录缺；F012/F013/F029；M009/M019；SRC-003/010/011/012/016；按签发目录、适用期和具体用途匹配；已有适用目录 PASS_FACT（类别比对）；目录缺 POLICY_UNCONFIRMED 给校内主管；外校/未来口径 CONFLICT；F NOT_APPLICABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F012","F013","F029"], materialSlotIds: ["M009","M019"], researchSourceIds: ["SRC-003"] } },
      { id: "R009", title: "个人获奖主张确由本人享有；FACT_PRECHECK，T=个人奖，F=团队奖，U=证书持有人不清", requirement: "个人获奖主张确由本人享有；FACT_PRECHECK，T=个人奖，F=团队奖，U=证书持有人不清；F001/F014/F018–F020；M002/M005；SRC-005/007/017；本人 token 与获奖者/签发路径对应；匹配 PASS_FACT；“导师奖/队伍奖”冒个人奖 CONFLICT 给学院；F NOT_APPLICABLE，无身份可证 NEEDS_MATERIAL", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F001","F014","F018","F019","F020"], materialSlotIds: ["M002","M005"], researchSourceIds: ["SRC-005"] } },
      { id: "R010", title: "团体奖的被认定人确在该届最终获奖名单；FACT_PRECHECK，T=团队成果，F=个人奖，U=成员名单未公布", requirement: "团体奖的被认定人确在该届最终获奖名单；FACT_PRECHECK，T=团队成果，F=个人奖，U=成员名单未公布；F001/F021/F022；M004/M006；SRC-005/013；官方名册按 token+队号联结；列明本人 PASS_FACT；官方名单明确不包含 CONFLICT；只提交团体奖状不列名 NEEDS_MATERIAL/官方数据缺 SOURCE_UNAVAILABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F001","F021","F022"], materialSlotIds: ["M004","M006"], researchSourceIds: ["SRC-005"] } },
      { id: "R011", title: "队长/队员/指导者角色来源；FACT_PRECHECK，T=声称 ROLE，F=未声称，U=官方不记该角色", requirement: "队长/队员/指导者角色来源；FACT_PRECHECK，T=声称 ROLE，F=未声称，U=官方不记该角色；F022–F025；M006/M010/M011/M019；SRC-005/010/011/013；区分名单位置与角色字段；官方明确角色 PASS_FACT；“列第1位=队长/第一贡献人”不成立 NEEDS_HUMAN_DECISION；互斥声明 CONFLICT；F NOT_APPLICABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F022","F023","F024","F025"], materialSlotIds: ["M006","M010","M011","M019"], researchSourceIds: ["SRC-005"] } },
      { id: "R012", title: "竞赛成绩/原始名次真实性；FACT_PRECHECK，T=SCORE，F=未主张分数，U=赛方未公开原始分数", requirement: "竞赛成绩/原始名次真实性；FACT_PRECHECK，T=SCORE，F=未主张分数，U=赛方未公开原始分数；F015/F026/F027；M008/M019；SRC-013/014；单位、赛段、赛方成绩对比；官方成绩一致 PASS_FACT；原数据不同 CONFLICT；成绩根本不公开 SOURCE_UNAVAILABLE，不得虚构0分；F NOT_APPLICABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F015","F026","F027"], materialSlotIds: ["M008","M019"], researchSourceIds: ["SRC-013"] } },
      { id: "R013", title: "报名与实际参赛经历区分；FACT_PRECHECK，T=PARTICIPATION，F=仅 AWARD，U=赛事只有报名记录", requirement: "报名与实际参赛经历区分；FACT_PRECHECK，T=PARTICIPATION，F=仅 AWARD，U=赛事只有报名记录；F006/F021–F023；M007/M008；SRC-007/008/013；报名/签到/作品提交/正式参赛记录分层；赛方可证实际参赛 PASS_FACT；仅报名不能证明参赛 NEEDS_MATERIAL；资料冲突 CONFLICT；F NOT_APPLICABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F006","F021","F022","F023"], materialSlotIds: ["M007","M008"], researchSourceIds: ["SRC-007"] } },
      { id: "R014", title: "已有赛前推荐的关联决议是否对应此队；关联事实阶段，T=档案显示需关联，F=该赛事无校内推荐，U=原登记系统失联", requirement: "已有赛前推荐的关联决议是否对应此队；关联事实阶段，T=档案显示需关联，F=该赛事无校内推荐，U=原登记系统失联；F003/F004/F021；M007/M012；SRC-019/020；核对 teamKey/赛段/签认版本；对应 PASS_FACT；错链 CONFLICT 给 S06-T02 记录持有者；无前置决定 NOT_APPLICABLE，不否定获奖事实", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F004","F021"], materialSlotIds: ["M007","M012"], researchSourceIds: ["SRC-019"] } },
      { id: "R015", title: "队伍成员角色类型不得误当个人奖；FACT_PRECHECK，T=有团队成员/指导者，F=个人独立赛，U=名单模糊", requirement: "队伍成员角色类型不得误当个人奖；FACT_PRECHECK，T=有团队成员/指导者，F=个人独立赛，U=名单模糊；F021–F024；M006/M010；SRC-005/007/013；比较身份类型/获奖归属；无混淆 PASS_FACT；导师署名被作为学生本人 CONFLICT；角色不明确 NEEDS_HUMAN_DECISION", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F021","F022","F023","F024"], materialSlotIds: ["M006","M010"], researchSourceIds: ["SRC-005"] } },
      { id: "R016", title: "是否存在更正、撤奖或最终公告替换；任何时点，T=存在公告变更，F=无可证变更，U=官方版本失联", requirement: "是否存在更正、撤奖或最终公告替换；任何时点，T=存在公告变更，F=无可证变更，U=官方版本失联；F016/F028/F032；M004/M013；SRC-008/013/014；比版本 ID/签发时间/更正案号；变更已核 PASS_FACT 但触发旧事实过期并派校内更正；伪变更 CONFLICT；无变更 NOT_APPLICABLE；失联 SOURCE_UNAVAILABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F016","F028","F032"], materialSlotIds: ["M004","M013"], researchSourceIds: ["SRC-008"] } },
      { id: "R017", title: "个人贡献主张与“队员资格”不可等同；ROLE 争议时 T=要求贡献排序，F=只核正式参赛，U=无法核人际分工", requirement: "个人贡献主张与“队员资格”不可等同；ROLE 争议时 T=要求贡献排序，F=只核正式参赛，U=无法核人际分工；F023–F025；M010/M011；SRC-010/011/016；官网无贡献时查分工证据并留人审；单纯队员身份可 PASS_FACT；贡献度决定 NEEDS_HUMAN_DECISION 给授权专家，互斥材料 CONFLICT；F NOT_APPLICABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F023","F024","F025"], materialSlotIds: ["M010","M011"], researchSourceIds: ["SRC-010"] } },
      { id: "R018", title: "与旧决定重复/年度目录重复套用；FACT_PRECHECK/复核，T=存在相同赛事单元旧案，F=首报，U=旧账不可访问", requirement: "与旧决定重复/年度目录重复套用；FACT_PRECHECK/复核，T=存在相同赛事单元旧案，F=首报，U=旧账不可访问；F008–F016/F029/F031；M009/M016；SRC-019/021；按届次+队伍+人+赛段+奖项去重，不压平不同结果；相同事实引已有 PASS_FACT+ref；不一致 CONFLICT 给记录管理员；跨届/跨赛段 NOT_APPLICABLE；主账离线 SOURCE_UNAVAILABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F008","F009","F010","F011","F012","F013","F014","F015","F016","F029","F031"], materialSlotIds: ["M009","M016"], researchSourceIds: ["SRC-019"] } },
      { id: "R019", title: "本人赛时单位与获奖公开名单单位的对应；FACT_PRECHECK，T=名单有单位，F=公告无单位，U=学校未校核", requirement: "本人赛时单位与获奖公开名单单位的对应；FACT_PRECHECK，T=名单有单位，F=公告无单位，U=学校未校核；F003/F004/F022；M003/M006；SRC-005/013；跨校组队合法性按赛事章程，而非一律拒绝；可对应 PASS_FACT；不符 CONFLICT；不得一概排除跨校参赛；F NOT_APPLICABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F003","F004","F022"], materialSlotIds: ["M003","M006"], researchSourceIds: ["SRC-005"] } },
      { id: "R020", title: "权威来源可达及可核；所有需来源步骤，T=来源或核验 API 可用，F=仅本地已可验证的权威归档，U=当前链接/服务失联", requirement: "权威来源可达及可核；所有需来源步骤，T=来源或核验 API 可用，F=仅本地已可验证的权威归档，U=当前链接/服务失联；F017/F028/F030；M004/M014；SRC-004/005/014/015；保存 HTTP 状态、时间、备份签章链；来源可靠 PASS_FACT；经认证档案替代也可 PASS_FACT；失联 SOURCE_UNAVAILABLE 给来源管理员；不可读副本 UNREADABLE", execution: "semantic", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F017","F028","F030"], materialSlotIds: ["M004","M014"], researchSourceIds: ["SRC-004"] } },
      { id: "R021", title: "他人信息最小必要/合法代理处理；SUBMITTED/展示，T=团队或批量涉及他人，F=仅本人，U=授权依据未知", requirement: "他人信息最小必要/合法代理处理；SUBMITTED/展示，T=团队或批量涉及他人，F=仅本人，U=授权依据未知；F001/F002/F022/F030；M002/M018；SRC-002；检验被授处理范围+字段最小化；合规 PASS_FACT；越权 NEEDS_HUMAN_DECISION 安全管理员并拒绝扩散；资料不全 SOURCE_UNAVAILABLE；F NOT_APPLICABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F001","F002","F022","F030"], materialSlotIds: ["M002","M018"], researchSourceIds: ["SRC-002"] } },
      { id: "R022", title: "是否有可执行的校本目录/受理期限/队伍排名政策；分类或人审阶段，T=需作校内正式级别/时效认定，F=只读赛事事实，U=当期制度不明", requirement: "是否有可执行的校本目录/受理期限/队伍排名政策；分类或人审阶段，T=需作校内正式级别/时效认定，F=只读赛事事实，U=当期制度不明；F009/F013/F023/F024/F029；M009/M019；SRC-010/011/012/016/017；校验适用学院、年届、学段与生效日；已核对应政策仅 PASS_FACT（政策适用事实）；没有同范围依据 POLICY_UNCONFIRMED 给政策负责人；外校或2027未生效规则冒充现行 CONFLICT；F NOT_APPLICABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F009","F013","F023","F024","F029"], materialSlotIds: ["M009","M019"], researchSourceIds: ["SRC-010"] } },
      { id: "R023", title: "本人撤回/异议事件有效性；REVIEW/撤回，T=有 M015，F=无事件，U=身份不清", requirement: "本人撤回/异议事件有效性；REVIEW/撤回，T=有 M015，F=无事件，U=身份不清；F002/F005/F032；M001/M015；SRC-001/013/014；核对请求主体、受理系统及签认前后时点；有效撤回申请 PASS_FACT 仅中止未签案；对已签认 NEEDS_HUMAN_DECISION 更正流程；赛事申诉依组委会处理；F NOT_APPLICABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F002","F005","F032"], materialSlotIds: ["M001","M015"], researchSourceIds: ["SRC-001"] } },
      { id: "R024", title: "旧事实因赛方更正与新证据而失效；复核/源变更，T=存在 M013/M016 修订，F=无变化，U=权威变更未证", requirement: "旧事实因赛方更正与新证据而失效；复核/源变更，T=存在 M013/M016 修订，F=无变化，U=权威变更未证；F016/F028/F030–F032；M013/M016；SRC-013/014/019；比较 sourceVersion+affectedClaims；需更新 PASS_FACT（触发失效）并派校内授权复审/下游失效通知；冲突 CONFLICT；F NOT_APPLICABLE；只有举报 NEEDS_HUMAN_DECISION", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F016","F028","F030","F031","F032"], materialSlotIds: ["M013","M016"], researchSourceIds: ["SRC-013"] } },
      { id: "R025", title: "授权签认与来源闭包；FACT_READY/终审，T=请求正式认定，F=仅临时预审，U=权限源离线", requirement: "授权签认与来源闭包；FACT_READY/终审，T=请求正式认定，F=仅临时预审，U=权限源离线；F002/F030–F034；M015/M016/M017；SRC-001/002/021；核验规则结果、所有版本、签发者权限、CAS与可审计签名；可信正式签认 PASS_FACT；无签字 NEEDS_HUMAN_DECISION 给有权者；身份/授权后端离线 SOURCE_UNAVAILABLE；F NOT_APPLICABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F002","F030","F031","F032","F033","F034"], materialSlotIds: ["M015","M016","M017"], researchSourceIds: ["SRC-001"] } },
      { id: "R026", title: "已签认结果没有被当成其他事项审批；决定发布/Outbox，T=关联结果要下发，F=无下游，U=目标无授权", requirement: "已签认结果没有被当成其他事项审批；决定发布/Outbox，T=关联结果要下发，F=无下游，U=目标无授权；F031/F033/F034；M016/M017；SRC-001/019/020；只发布事实、决定版本与授权消费范围；正确消费 PASS_FACT；目标未授权 NEEDS_HUMAN_DECISION/拒绝；禁止给其他模板生成资金、学分或奖学金审批 CONFLICT；F NOT_APPLICABLE", execution: "manual", targetScope: 'case', policyEvidenceStatus: 'UNCONFIRMED', researchBindings: { fieldKeys: ["F031","F033","F034"], materialSlotIds: ["M016","M017"], researchSourceIds: ["SRC-001"] } },
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
  researchSource: { path: "docs/design/review-agent/business-templates/R02/S06-T03.md", sha256: "7fac598f0200289f14564b1a7c26fdb3d6494acfa01385cabce7e9e06c5e4a98" },
  status: 'draft',
  createdAt: '2026-10-24T00:00:00.000Z',
}

export default template

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
