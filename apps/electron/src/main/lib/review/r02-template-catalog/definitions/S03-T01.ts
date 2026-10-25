import type { TemplateVersion } from '@profer/shared'
export type { TemplateVersion }

export type R02EvidenceStatus = 'verified' | 'partial' | 'unconfirmed'
export interface R02CriterionMetadata { sectionId: string; criterionId: string; sourceIds: string[]; evidenceStatus: R02EvidenceStatus; fieldIds: string[]; materialIds: string[] }
export interface R02Metadata { templateId: string; name: string; sourceDocumentPath: string; sourceDocumentSha256: string; officialSchoolTemplate: false; researchAsOf: string; policyEvidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'; sourceIds: string[]; fieldIds: string[]; materialIds: string[]; criteria: R02CriterionMetadata[] }

export const templateVersion: TemplateVersion = {
  "templateId": "S03-T01",
  "version": 1,
  "schemaVersion": 2,
  "name": "综合素质测评及分项加扣分材料审核",
  "description": "本地研究模板 · 非校方正式模板。用于综合素质测评及分项加扣分材料审核的材料核验和人工审阅建议；政策/授权未确认时不得形成正式通过或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本定义由 R02 研究交接稿转换，不是成都理工大学正式发布模板；SRC 为研究来源索引，不是案卷材料 SourceRef；未确认政策由有权人员人工复核。",
  "objectType": "person",
  "displayName": {
    "template": "S03-T01 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · caseId: string",
      "kind": "text",
      "required": true,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F001。caseId: string；系统案卷创建 L0；必；不可与正式学校决定 ID 混用；绑定本人权限。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f002",
      "label": "F002 · studentRef: opaque",
      "kind": "text",
      "required": true,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F002。studentRef: opaque；T：可信学生身份/学籍名册 L0；必；与上传表单学号核对，不接受仅 Renderer 自述作身份凭证。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f003",
      "label": "F003 · educationLevel: enum",
      "kind": "text",
      "required": true,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F003。educationLevel: enum；T：本科、硕士、博士、阶段性身份 L0；必；校内身份源确认；影响学院政策选择，C 不可覆盖。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f004",
      "label": "F004 · collegeRef: string",
      "kind": "text",
      "required": true,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F004。collegeRef: string；T：学籍所在学院/年级管理归口 L0；必；变更学院保留历史快照；政策范围不得按自由文本判定。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f005",
      "label": "F005 · cohortAndClass: object?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F005。cohortAndClass: object?；T：入学年、年级、班级 L0；适用时必；缺失可提示但不自行判定新生能否参评。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f006",
      "label": "F006 · assessmentYear: string",
      "kind": "text",
      "required": true,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F006。assessmentYear: string；T：学校当期通知/申报批次 L0；必；格式为起止学年，非上传日；政策期次绑定。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f007",
      "label": "F007 · caseMode: enum",
      "kind": "text",
      "required": true,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F007。caseMode: enum；路由与经本人确认 L0；必；UG_ASSESSMENT / GRAD_SPECIAL_APPENDIX / OFFICIAL_RESULT_REFERENCE，不得以相似名称跨制度合并。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f008",
      "label": "F008 · policyRef: object?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F008。policyRef: object?；T：正式学校/学院政策原文、修订号、SRC 及真实性 L0；计分前必；缺则政策未确认；不得拿 SRC-011 填充。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f009",
      "label": "F009 · policyValidity: object?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F009。policyValidity: object?；T：生效、废止、适用学院、学段、学年 L0；计分前必；未知不默认持续生效；变化触发定向重审。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f010",
      "label": "F010 · caseStage: enum",
      "kind": "text",
      "required": true,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F010。caseStage: enum；A：工作流事件 L0 起；必；仅合法角色可推进，阶段不同材料槽不同。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f011",
      "label": "F011 · claimIdAndEventId: object",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F011。claimIdAndEventId: object；C 主张 ID + T/D 原始事件引用 L1；每个主张必；原始事件标识未知可临时空，但不能据此判非重复。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f012",
      "label": "F012 · claimCategory: string?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F012。claimCategory: string?；C：申报分项，T：政策分类确认 L1/L3；L1 为候选；计分类别须经政策核实，允许“未分类”。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f013",
      "label": "F013 · eventPeriod: interval?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F013。eventPeriod: interval?；C/D/T：活动或奖惩发生时间 L1/L2；事实时间可暂缺；与政策有效时段分别比对，证书日期不天然等于活动日期。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f014",
      "label": "F014 · eventIssuer: string?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F014。eventIssuer: string?；D/T：活动主办、奖项签发机构 L1/L2；可信级别待核；未核真不得作确证。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f015",
      "label": "F015 · awardOrRecordDetail: object?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F015。awardOrRecordDetail: object?；D/T：奖级、名次、职责、奖惩类别 L1/L2；只记录原文事实，不由 OCR 映射出校内分值。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f016",
      "label": "F016 · claimantParticipation: enum?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F016。claimantParticipation: enum?；C/D/T：个人、团队成员、本人负责人等 L1/L2；集体记录须到个人资格证据，不从团队名称推断。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f017",
      "label": "F017 · personAttribution: object?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F017。personAttribution: object?；T/D：成员名单、本人证明、跨身份关联 L2；适用集体项必；含人员稳定 ID 和来源位置。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f018",
      "label": "F018 · claimedPoints: decimal?",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F018。claimedPoints: decimal?；C：本人自评分数 L1；可选；仅声明，永不能直接变为正式评分。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f019",
      "label": "F019 · authoritativeRecordRef: object?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F019。authoritativeRecordRef: object?；T：学工系统、出具部门、主办方原始记录 L2；条件性必；记录不可得应区分“缺件”与“来源不可用”。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f020",
      "label": "F020 · recordEffectState: enum?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F020。recordEffectState: enum?；T：正式生效/撤销/待处理/复核中及日期 L2；对扣分和负面记录极重要；缺值不推断生效。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f021",
      "label": "F021 · materialRefs: string[]",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F021。materialRefs: string[]；D/T：材料槽实例及页面定位 L1 起；主张至少有可追踪材料或待补状态；任何输出绑定具体材料槽。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f022",
      "label": "F022 · materialVersions: object[]",
      "kind": "text",
      "required": true,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F022。materialVersions: object[]；系统：sha256、版本号、时间、来源及前序引用 L1 起；必；文件无法读取也保留 hash 和错误原因；历史只读。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f023",
      "label": "F023 · eventDedupKey: string?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F023。eventDedupKey: string?；系统从稳定事件号、签发者、主体、时间生成 L2；仅嫌疑索引；模糊相似不能自动断为重复。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f024",
      "label": "F024 · factVerdicts: object[]",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F024。factVerdicts: object[]；系统每 R 的核验事件 L2 起；仅允许八个核验结果码；包含 target/sourceVersion，非学校决定。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f025",
      "label": "F025 · trustedActorRef: opaque?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F025。trustedActorRef: opaque?；A：Main/Host/校内认证身份 L3 起；正式操作必；前端发送的角色文本绝不可信；授权范围需校本确认。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f026",
      "label": "F026 · decisionRef: object?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F026。decisionRef: object?；A/T：授权角色、签章、决定时间、适用制度 L5；仅正式核定后出现；缺失不得以“人工确认”文本替代。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f027",
      "label": "F027 · officialAssessmentRef: object?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F027。officialAssessmentRef: object?；T：学校/学院认可的综测正式版本 L5/L6；下游引用必；含签发和生效信息；无权读取者不可查看。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f028",
      "label": "F028 · revisionChain: object[]",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F028。revisionChain: object[]；系统：案卷/主张/结论版本及被替换关系 L1 起；补件、撤回、复核和更新必须追加；不能静默改旧结果。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f029",
      "label": "F029 · requestedAction: enum?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F029。requestedAction: enum?；C/A：补正、撤回、重提、分项异议 L4/L6；发生时必；区分未核定材料主张与已形成正式成绩。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f030",
      "label": "F030 · disputeTarget: object?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F030。disputeTarget: object?；C/A：具体 R、主张、证据、原结果版本 L4/L6；提复核时必；不允许无目标地整案覆盖结论。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f031",
      "label": "F031 · disputeBasis: text?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F031。disputeBasis: text?；C/D：本人理由、影响的事实和新材料 L4/L6；复核请求时必；时限/是否受理由校本规则和有权人确认。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f032",
      "label": "F032 · downstreamUseRef: object?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F032。downstreamUseRef: object?；T：评优、奖助、推免等独立事项标识 L6；只读链接；不得反向更新本案的学校综测结论。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "学籍身份/学院/培养层次权威回执",
      "purpose": "学籍身份/学院/培养层次权威回执；T，高；学籍身份/学院/培养层次权威回执；T，高；L0；身份匹配须使用受控来源，不要求本人公开敏感学籍档案；F002–F006；R001",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "学籍身份/学院/培养层次权威回执",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "当前本科综测总办法、当期公告的正式版本及有效期",
      "purpose": "当前本科综测总办法、当期公告的正式版本及有效期；T，高；当前本科综测总办法、当期公告的正式版本及有效期；T，高；L0 后取配置；未取得即政策待确认，不由学生补一份网文；F006/F008/F009；R002",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "当前本科综测总办法、当期公告的正式版本及有效期",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "学院分项计分细则、研究生专项实施细则、修订通知",
      "purpose": "学院分项计分细则、研究生专项实施细则、修订通知；T，高；学院分项计分细则、研究生专项实施细则、修订通知；T，高；L0 后取配置；按学院/年级/学段选择；F003/F004/F007–F009/F012；R002/R008",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "学院分项计分细则、研究生专项实施细则、修订通知",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M004",
      "name": "本人申报表/分项自评声明、申请时间",
      "purpose": "本人申报表/分项自评声明、申请时间；C，中；本人申报表/分项自评声明、申请时间；C，中；L1 本人提交；可在授权窗口修改；F011/F012/F018/F021；R003",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "本人申报表/分项自评声明、申请时间",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "活动、志愿、竞赛、任职、荣誉等证书、证明或可追踪电子记录",
      "purpose": "活动、志愿、竞赛、任职、荣誉等证书、证明或可追踪电子记录；D，待核；活动、志愿、竞赛、任职、荣誉等证书、证明或可追踪电子记录；D，待核；L1 相关项目才需要；替代为主办单位确认记录；F013–F016/F021/F022；R004–R007",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "活动、志愿、竞赛、任职、荣誉等证书、证明或可追踪电子记录",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "活动主办方原始名册、团体成员名单、职责/贡献证明",
      "purpose": "活动主办方原始名册、团体成员名单、职责/贡献证明；T/D，视核验程度；活动主办方原始名册、团体成员名单、职责/贡献证明；T/D，视核验程度；L2 仅团队归属或真实性争议时取；不可要求普通个人项目都交；F014/F016/F017/F019；R005/R007",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "活动主办方原始名册、团体成员名单、职责/贡献证明",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "学工系统活动/考勤/教务或同一原始记录的权威查询回执",
      "purpose": "学工系统活动/考勤/教务或同一原始记录的权威查询回执；T，高；学工系统活动/考勤/教务或同一原始记录的权威查询回执；T，高；L2 按需且授权可查；来源不可用不能转嫁为“学生缺件”；F013/F019/F020；R010/R011/R023",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "学工系统活动/考勤/教务或同一原始记录的权威查询回执",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "学校正式奖惩/处分及其送达、生效、复查状态记录",
      "purpose": "学校正式奖惩/处分及其送达、生效、复查状态记录；T，高且敏感；学校正式奖惩/处分及其送达、生效、复查状态记录；T，高且敏感；L2 仅涉及负面分项且政策允许时受控查询；F015/F020；R011",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "学校正式奖惩/处分及其送达、生效、复查状态记录",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "同事件既往申报/跨分项证据引用、复用记录",
      "purpose": "同事件既往申报/跨分项证据引用、复用记录；T/A，中至高；同事件既往申报/跨分项证据引用、复用记录；T/A，中至高；L2 只在同人/同事件多项时使用；无记录不直接定不重复；F011/F023/F028；R009",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "同事件既往申报/跨分项证据引用、复用记录",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "学院/班级评议表、审核意见及相应签章或授权记录",
      "purpose": "学院/班级评议表、审核意见及相应签章或授权记录；A，待验；学院/班级评议表、审核意见及相应签章或授权记录；A，待验；L3 或更晚；不能要求 L1 初申时存在；F024/F025/F026；R013/R015",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "学院/班级评议表、审核意见及相应签章或授权记录",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M011",
      "name": "补件、更正后的附件、原件补核回执",
      "purpose": "补件、更正后的附件、原件补核回执；D/T，视来源；补件、更正后的附件、原件补核回执；D/T，视来源；L2/L4/L6 应要求特定问题再补，保留旧版本；F021/F022/F028–F030；R016",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "补件、更正后的附件、原件补核回执",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "本人撤回/重提申请与可信身份确认",
      "purpose": "本人撤回/重提申请与可信身份确认；C/A，待验；本人撤回/重提申请与可信身份确认；C/A，待验；L1–L4 或之后经有权机关决定可否撤回；不预设学校许可；F025/F028/F029；R017",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "本人撤回/重提申请与可信身份确认",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "分项异议/复核申请、原争议结果、理由及新证据",
      "purpose": "分项异议/复核申请、原争议结果、理由及新证据；C/D；分项异议/复核申请、原争议结果、理由及新证据；C/D；L4/L6，在有可争议结果后出现；F028–F031；R018",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "分项异议/复核申请、原争议结果、理由及新证据",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "正式综测结论的学校/学院授权签发记录、版本及其更正/撤销文书",
      "purpose": "正式综测结论的学校/学院授权签发记录、版本及其更正/撤销文书；T/A，高；正式综测结论的学校/学院授权签发记录、版本及其更正/撤销文书；T/A，高；L5–L6；绝不能列为 L1 申请缺件；F026–F028；R019/R020",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "正式综测结论的学校/学院授权签发记录、版本及其更正/撤销文书",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M015",
      "name": "下游评奖、奖助或推免事项引用/批准记录",
      "purpose": "下游评奖、奖助或推免事项引用/批准记录；T/A，高；下游评奖、奖助或推免事项引用/批准记录；T/A，高；L6，独立事项产生后；不在综测案卷中复制决定；F027/F032；R020",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "下游评奖、奖助或推免事项引用/批准记录",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "核自学院研究生活动专项表及导师/学生签署部分",
      "purpose": "核自学院研究生活动专项表及导师/学生签署部分；D/A，效力未核；核自学院研究生活动专项表及导师/学生签署部分；D/A，效力未核；仅 C05 且现行版及学院授权获确认时，L1 可见自评、L3 才有学院意见；F003/F007/F018/F025；R012/R015",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "核自学院研究生活动专项表及导师/学生签署部分",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "审核人受控身份及学院/学年授权名册或正式委派",
      "purpose": "审核人受控身份及学院/学年授权名册或正式委派；T，高；审核人受控身份及学院/学年授权名册或正式委派；T，高；L3–L6 每次正式操作时校验；普通学生无需上传；F025/F026；R013/R019/R022",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "审核人受控身份及学院/学年授权名册或正式委派",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M018",
      "name": "原记录更正、处分撤销或异议结果的正式确认回执",
      "purpose": "原记录更正、处分撤销或异议结果的正式确认回执；T，高；原记录更正、处分撤销或异议结果的正式确认回执；T，高；L4/L6 仅发生变更后产生；不可预先索取；F019/F020/F028；R011/R016/R018",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "原记录更正、处分撤销或异议结果的正式确认回执",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rule-review",
      "name": "审核规则逐条清单",
      "description": "逐条映射原件第 08 节规则；只生成本地事实核验、证据差异与人工复核建议。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "R001 · 学生、学段与学院归属",
          "requirement": "原件 R001：L0；学生、学段与学院归属。SRC-001/002/003/006；F001–F007；M001；真：本案涉及在校综测；假：纯他校/非学生资料→NOT_APPLICABLE；未知：学籍源不可得→SOURCE_UNAVAILABLE，本人需补可用身份线索→NEEDS_MATERIAL；与可信学籍源做稳定 ID、学院、参评学年的精确匹配；入学/转学院时以目标学年有效记录为准。明示不符则 CONFLICT，相符 PASS_FACT；年级适格规则缺失转 R002。下一办理：本人补正或学院学籍管理员核实。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "R002 · 本校现行综测政策选择与有效期",
          "requirement": "原件 R002：L0；本校现行综测政策选择与有效期。SRC-001/002/003/006/008；F003–F009；M002/M003；真：政策版本与学生范围均可核；假：仅下游引用、不做本次计分→NOT_APPLICABLE；未知：校本原文/效力缺失→POLICY_UNCONFIRMED；比较学校、学院、学年、学段、修订生效/废止；2025 评优、2015 历史权重、2022 研究生奖学金不能作为当期本科综测政策。正反适用均须完整范围；下一办理：学校/学院政策管理员确认。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "R003 · 本人申报与分项对象完整可指认",
          "requirement": "原件 R003：L1；本人申报与分项对象完整可指认。SRC-002/003/007；F001/F002/F010–F012/F018/F021；M004；真：本人提出特定分项主张；假：系统只引用已经正式签发的结果→NOT_APPLICABLE；未知：申报主张缺目标或本人授权→NEEDS_MATERIAL；对照案卷/本人/主张 ID 和分项明细；已声明且关联具体人/事件可 PASS_FACT（仅声明完整）。申报人与学籍不符→CONFLICT；下一办理：本人或已验证的合法协助人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "R004 · 相关附件能否完整读取",
          "requirement": "原件 R004：L2；相关附件能否完整读取。SRC-001/007/009；F021/F022；M004/M005/M007/M011/M016；真：该核验项具有待解析附件；假：可直接结构化读取权威源→NOT_APPLICABLE；未知：缺文件→NEEDS_MATERIAL；按页数/类型/页码/必要签章区域核查，扫描截断、空页、乱码、OCR 关键字段不可辨→UNREADABLE；内容可读仅 PASS_FACT（可读取，不等于真实）。原件损坏而主办源可查询，转 R023；下一办理：材料上传者或档案持有人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "R005 · 主办方、证书与真实活动记录对应",
          "requirement": "原件 R005：L2；主办方、证书与真实活动记录对应。SRC-004/007；F011/F014/F015/F019/F021；M005/M006/M007；真：分项证据声称来源于具体机构；假：本案没有该类活动主张→NOT_APPLICABLE；未知：签发方或原始记录缺→视负责方 NEEDS_MATERIAL/SOURCE_UNAVAILABLE；对照证书编号、活动名称、单位、主办名单和发生期；表面字段一致但机构未核验不可宣称“真证”，可 NEEDS_HUMAN_DECISION；互相矛盾→CONFLICT。下一办理：活动主办方/学院核验人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "R006 · 事件归属参评期间",
          "requirement": "原件 R006：L2；事件归属参评期间。SRC-002/004/006/007；F006/F009/F013/F015；M002/M003/M005/M007；真：有当期政策的期间规则和事件日期；假：不按时段限制的纯身份核验→NOT_APPLICABLE；未知：事件期缺→NEEDS_MATERIAL，政策日期口径缺→POLICY_UNCONFIRMED；比较实际活动时间、获奖/发证日期与政策规定的对应日期类型；不能默认“发证时间=发生时间”。明确范围相符才 PASS_FACT，矛盾 CONFLICT；下一办理：本人补证/政策管理员确认/学院评议。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "R007 · 集体成果与学生个人证据归属",
          "requirement": "原件 R007：L2；集体成果与学生个人证据归属。SRC-004/007；F002/F011/F016/F017；M005/M006；真：证书为团队或由团队获奖引入个人申请；假：有权记录明示个人单项→NOT_APPLICABLE；未知：没有成员或本人关联证明→NEEDS_MATERIAL；将本人稳定身份与原始团体名单、成员角色和姓名异体记录核对；成员信息矛盾→CONFLICT，事实相符可 PASS_FACT，至于集体降档/拆分仍归 R008/R014。下一办理：主办方、学院人工核验。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "R008 · /L3",
          "requirement": "原件 R008：L2/L3；校本分项类别、加扣分条件。SRC-001/004/007/008；F003/F007–F009/F012/F015/F018；M002/M003/M005/M016；真：有确认现行政策覆盖的分项；假：本规则明示不包含该申报类型→NOT_APPLICABLE；未知：政策类别/阈值缺→POLICY_UNCONFIRMED；把主张与当期、该院、该培养层次条款逐条对照，记录条号；无法由“按规定加分”推分值。文义归类有裁量→NEEDS_HUMAN_DECISION；下一办理：学院计分负责人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "R009 · 同一活动/成果的重复申报风险",
          "requirement": "原件 R009：L2；同一活动/成果的重复申报风险。SRC-006/007；F002/F011/F012/F023/F028；M005/M006/M009；真：同一学生多张同源或高度相似申报；假：单一且无关联事件→NOT_APPLICABLE；未知：事件号/既有记录不可查→SOURCE_UNAVAILABLE；同稳定事件 ID、机构、时段、人员、奖项联查；精确双报→CONFLICT，仅相似→NEEDS_HUMAN_DECISION；只在相应研究生奖学金政策生效时适用 SRC-006 的重复申报限制，非全校禁复用。下一办理：学院计分负责人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "R010 · 学工/活动客观记录与申报对应",
          "requirement": "原件 R010：L2；学工/活动客观记录与申报对应。SRC-001/002/009；F002/F011/F013/F019；M005/M007；真：申报行为有校内原始记录可查询；假：非校内记录且政策允许其他证明→NOT_APPLICABLE；未知：平台不可用→SOURCE_UNAVAILABLE；核查主体、活动、记录创建/更正时间和签发部门；一致仅 PASS_FACT；学工日志与证书冲突→CONFLICT，不自动以更晚一项覆盖。下一办理：相关记录管理员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "R011 · /L6",
          "requirement": "原件 R011：L2/L6；负面项、处分状态或撤销效力。SRC-001/003/010；F013/F015/F019/F020；M007/M008/M018；真：政策要求引用负面官方记录且已获授权查询；假：无负面主张/正式记录→NOT_APPLICABLE；未知：仅口头通报、拟处分或效力不明→NEEDS_HUMAN_DECISION，官方源失联→SOURCE_UNAVAILABLE；核实作出机构、正式状态、有效期间、撤销/复查结果；正式状态与扣分依据属不同决定，证据冲突 CONFLICT；不得自行创建处分或凭图片扣分。下一办理：有权奖惩记录部门与综测管理员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "R012 · L3",
          "requirement": "原件 R012：L0–L3；研究生专属分项表的适用性。SRC-006/007；F003/F004/F007–F009/F018；M001/M003/M016；真：研究生、当期所在学院和表单制度一致；假：本科/其他学院→NOT_APPLICABLE；未知：SRC-007 无有效年份或学院确认→POLICY_UNCONFIRMED；对照学院、学段、奖学金类型、研究生表的申报年度和签名目的；即使材料完整，也只能核对自评与学院意见差异，不能自动用“最高 3 分”。下一办理：研究生学院奖助/综测归口。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "R013 · L6",
          "requirement": "原件 R013：L3–L6；评议/复核人权限真实性。SRC-001/002/003/006/007；F004/F006/F010/F025；M010/M017；真：进入需人员确认的阶段；假：仅 L1/L2 机器提示→NOT_APPLICABLE；未知：无可信任命/角色来源→NEEDS_HUMAN_DECISION；Main/Host 依据受控 Actor 和委派名单按学院、业务、年限核对；来自 Renderer 的 teacher/actor 自述即使格式合法也不通过授权；缺失不得签发。下一办理：身份/业务权限管理员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "R014 · 候选分项的计分建议可否进入人工裁量",
          "requirement": "原件 R014：L3；候选分项的计分建议可否进入人工裁量。SRC-002/003/004/007/008；F008/F009/F012/F015/F018/F024；M002/M003/M005/M010；真：政策条款/事实均已核验且需计分；假：本案仅需事实完整性核验→NOT_APPLICABLE；未知：任何现行分值/封顶未证→POLICY_UNCONFIRMED；只形成“人工计分待办”，报告本人自评分与相关事实；即使已证实分项可加分仍 NEEDS_HUMAN_DECISION，没有校方签发前绝不输出正式分数。下一办理：授权综测计分人员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "R015 · L5",
          "requirement": "原件 R015：L1–L5；材料的阶段可达性。SRC-002/003/007；F010/F021/F025/F026；M004/M010/M014/M016；真：某槽已进入制度允许出现的阶段；假：L1 尚未发生 L3/L5 的签字、核定→NOT_APPLICABLE；未知：阶段本身无权威校本流程→POLICY_UNCONFIRMED；自评时不要求学院评议或正式成绩；L5 后有权追踪相应记录。若当前阶段本应已有材料但缺，则仅按责任区分 NEEDS_MATERIAL 或 NEEDS_HUMAN_DECISION。下一办理：对应阶段的责任人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "R016 · /L4/L6",
          "requirement": "原件 R016：L2/L4/L6；补件和版本替换是否保留原始链。SRC-001/009；F011/F021/F022/F024/F028/F030；M005/M011/M018；真：同一主张材料新增/修改/撤销生效记录；假：版本未变化→NOT_APPLICABLE；未知：缺变更来源或旧版定位→CONFLICT；对比 hash、被更改字段和事实证据目标，生成有影响集合；只重新执行依赖该材料/字段的 R，保留历史结果和问题闭合/重开关系。下一办理：本人补件/原记录管理部门/学院复核。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "R017 · L6",
          "requirement": "原件 R017：L1–L6；撤回申请和重提授权。SRC-002/003/010（权利边界参考，不是综测撤回规则）；F002/F010/F025/F028/F029；M001/M012；真：有明确针对某主张/整案的撤回或重提请求；假：无请求→NOT_APPLICABLE；未知：本人身份/可撤回阶段不明→NEEDS_HUMAN_DECISION；认证请求者与原主体一致；未正式核定时可记录“撤回待确认”，是否能撤回由当期校规决定；已签发结果不得靠撤回请求删除。下一办理：本人/有权受理人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "R018 · /L6",
          "requirement": "原件 R018：L4/L6；对指定分项/成绩提出异议或复核。SRC-003/005/006/010；F010/F024/F028–F031；M010/M013/M018；真：存在可指认的争议原结果和新理由；假：没有异议请求→NOT_APPLICABLE；未知：综测专属受理渠道/期限/权限不明→POLICY_UNCONFIRMED；确保争议类型是综测而非奖助/处分，锁定旧决定及材料版本；同证据不一致→CONFLICT，争议实质裁定→NEEDS_HUMAN_DECISION；不得套用教育部处分 10 日或奖助公示期限。下一办理：待确认的综测复核归口。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "R019 · /L6",
          "requirement": "原件 R019：L5/L6；正式综测决定的可信签发和版本。SRC-001/002/003；F001/F002/F006/F025–F028；M014/M017；真：有学校/学院正式核定动作或记录引用；假：仍为 L1/L2 的事实预审→NOT_APPLICABLE；未知：签发主体权限/政策未确认→NEEDS_HUMAN_DECISION；必须真实授权 Actor、适用校本程序和结论签章/批次关联一致，且不覆盖原有决定；通过只表明记录可被核验 PASS_FACT，不表示本系统作出了审批。下一办理：正式归口审批/档案管理员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "R020 · 下游仅引用已生效综测结论",
          "requirement": "原件 R020：L6；下游仅引用已生效综测结论。SRC-002/003/005/006；F001/F002/F006/F027/F028/F032；M014/M015；真：评优/奖助/其他业务请求综测结果；假：未发起下游事项→NOT_APPLICABLE；未知：正式版本缺或源不可查→SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；验同人、同学年、签发单位和官方版本；下游仅取只读引用，后续评奖是否通过由自己的模板决定。版本不合→CONFLICT。下一办理：下游归口审批人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "R021 · 排除跨学校政策污染",
          "requirement": "原件 R021：L0；排除跨学校政策污染。SRC-008/011/001；F004/F006/F008/F009；M002/M003；真：政策载体疑似来自其他学校或历史文书；假：来源学校确为 CDUT 且适用性已核→NOT_APPLICABLE；未知：来源校别不能核实→SOURCE_UNAVAILABLE；检学校全称、cdut.edu.cn/cdu.edu.cn 域与公章；发现成都大学办法当成都理工大学使用→CONFLICT 并阻断硬计分；旧校内自述仅 POLICY_UNCONFIRMED。下一办理：政策管理员。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "R022 · L6",
          "requirement": "原件 R022：L0–L6；数据访问者/申请者与对象关系。SRC-001/010；F001/F002/F004/F025/F032；M001/M017；真：发起读取、审核、修改或导出；假：离线静态规则说明→NOT_APPLICABLE；未知：身份提供方式未经验证→NEEDS_HUMAN_DECISION；校内可信 session + 案卷权限 + 最小字段范围校验；Renderer 冒充辅导员、跨学生取处分信息一律禁止，不因学生持有某截图而开放后台。下一办理：登录/权限管理人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "R023 · /L6",
          "requirement": "原件 R023：L2/L6；原始记录来源不可用与降级。SRC-001/004/007；F019/F021/F022/F024；M005/M006/M007/M014；真：某 R 依赖外部原始记录且读取故障；假：直接证据已足且无需查源→NOT_APPLICABLE；未知：断网/不存在/无权访问难辨→SOURCE_UNAVAILABLE；记录来源、请求时间和错误类型；不能把服务不可用当学生缺件，也不能用旧缓存“事实通过”冒充当前核验。允许留存候选事实转人工核实。下一办理：源系统管理员/学院审核人。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "l0",
      "name": "政策选期",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "l1"
    },
    {
      "id": "l1",
      "name": "初次自评/材料收集",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "l2"
    },
    {
      "id": "l2",
      "name": "事实预核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "l3"
    },
    {
      "id": "l3",
      "name": "授权人员评议",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "l4"
    },
    {
      "id": "l4",
      "name": "初评结果可见/更正",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "l5"
    },
    {
      "id": "l5",
      "name": "综测正式核定",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "l6"
    },
    {
      "id": "l6",
      "name": "后续复核/下游使用",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "item-feedback",
      "kind": "item-feedback",
      "audience": "student"
    },
    {
      "id": "human-review-todo",
      "kind": "supplement-list",
      "audience": "reviewer"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

export const r02Metadata: R02Metadata = {
  "templateId": "S03-T01",
  "name": "综合素质测评及分项加扣分材料审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S03-T01.md",
  "sourceDocumentSha256": "aa31ced10d50c726dd2a8f3cdd4b2210b40eadd44a7ceb3e2a443e959aa9f571",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23",
  "policyEvidenceStatus": "PARTIAL",
  "sourceIds": [
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
    "SRC-011"
  ],
  "fieldIds": [
    "F001",
    "F002",
    "F003",
    "F004",
    "F005",
    "F006",
    "F007",
    "F008",
    "F009",
    "F010",
    "F011",
    "F012",
    "F013",
    "F014",
    "F015",
    "F016",
    "F017",
    "F018",
    "F019",
    "F020",
    "F021",
    "F022",
    "F023",
    "F024",
    "F025",
    "F026",
    "F027",
    "F028",
    "F029",
    "F030",
    "F031",
    "F032"
  ],
  "materialIds": [
    "M001",
    "M002",
    "M003",
    "M004",
    "M005",
    "M006",
    "M007",
    "M008",
    "M009",
    "M010",
    "M011",
    "M012",
    "M013",
    "M014",
    "M015",
    "M016",
    "M017",
    "M018"
  ],
  "criteria": [
    {
      "sectionId": "rule-review",
      "criterionId": "r001",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F001",
        "F002",
        "F003",
        "F004",
        "F005",
        "F006",
        "F007"
      ],
      "materialIds": [
        "M001"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r002",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F003",
        "F004",
        "F005",
        "F006",
        "F007",
        "F008",
        "F009"
      ],
      "materialIds": [
        "M002",
        "M003"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r003",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F010",
        "F011",
        "F012",
        "F001",
        "F002",
        "F018",
        "F021"
      ],
      "materialIds": [
        "M004"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r004",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F021",
        "F022"
      ],
      "materialIds": [
        "M004",
        "M005",
        "M007",
        "M011",
        "M016"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r005",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F011",
        "F014",
        "F015",
        "F019",
        "F021"
      ],
      "materialIds": [
        "M005",
        "M006",
        "M007"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r006",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F006",
        "F009",
        "F013",
        "F015"
      ],
      "materialIds": [
        "M002",
        "M003",
        "M005",
        "M007"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r007",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F002",
        "F011",
        "F016",
        "F017"
      ],
      "materialIds": [
        "M005",
        "M006"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r008",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F007",
        "F008",
        "F009",
        "F003",
        "F012",
        "F015",
        "F018"
      ],
      "materialIds": [
        "M002",
        "M003",
        "M005",
        "M016"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r009",
      "sourceIds": [
        "SRC-006"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F002",
        "F011",
        "F012",
        "F023",
        "F028"
      ],
      "materialIds": [
        "M005",
        "M006",
        "M009"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r010",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F002",
        "F011",
        "F013",
        "F019"
      ],
      "materialIds": [
        "M005",
        "M007"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r011",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F013",
        "F015",
        "F019",
        "F020"
      ],
      "materialIds": [
        "M007",
        "M008",
        "M018"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r012",
      "sourceIds": [
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F007",
        "F008",
        "F009",
        "F003",
        "F004",
        "F018"
      ],
      "materialIds": [
        "M001",
        "M003",
        "M016"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r013",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F004",
        "F006",
        "F010",
        "F025"
      ],
      "materialIds": [
        "M010",
        "M017"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r014",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F008",
        "F009",
        "F012",
        "F015",
        "F018",
        "F024"
      ],
      "materialIds": [
        "M002",
        "M003",
        "M005",
        "M010"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r015",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F010",
        "F021",
        "F025",
        "F026"
      ],
      "materialIds": [
        "M004",
        "M010",
        "M014",
        "M016"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r016",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F011",
        "F021",
        "F022",
        "F024",
        "F028",
        "F030"
      ],
      "materialIds": [
        "M005",
        "M011",
        "M018"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r017",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F002",
        "F010",
        "F025",
        "F028",
        "F029"
      ],
      "materialIds": [
        "M001",
        "M012"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r018",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F028",
        "F029",
        "F030",
        "F031",
        "F010",
        "F024"
      ],
      "materialIds": [
        "M010",
        "M013",
        "M018"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r019",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F025",
        "F026",
        "F027",
        "F028",
        "F001",
        "F002",
        "F006"
      ],
      "materialIds": [
        "M014",
        "M017"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r020",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F001",
        "F002",
        "F006",
        "F027",
        "F028",
        "F032"
      ],
      "materialIds": [
        "M014",
        "M015"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r021",
      "sourceIds": [
        "SRC-008"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F004",
        "F006",
        "F008",
        "F009"
      ],
      "materialIds": [
        "M002",
        "M003"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r022",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F001",
        "F002",
        "F004",
        "F025",
        "F032"
      ],
      "materialIds": [
        "M001",
        "M017"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r023",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F019",
        "F021",
        "F022",
        "F024"
      ],
      "materialIds": [
        "M005",
        "M006",
        "M007",
        "M014"
      ]
    }
  ]
}

export default templateVersion
