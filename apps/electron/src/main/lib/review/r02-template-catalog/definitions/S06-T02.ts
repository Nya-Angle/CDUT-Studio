import type { TemplateVersion } from '@profer/shared'

export type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'

export interface R02CriterionMetadata {
  sectionId: string
  criterionId: string
  srcIds: string[]
  evidenceStatus: R02EvidenceStatus
  sourceRuleTitle: string
}

export interface R02Metadata {
  templateId: string
  name: string
  sourceDocumentPath: string
  sourceOriginalPath: string
  sourceDocumentBytes: number
  sourceDocumentSha256: string
  officialSchoolTemplate: false
  researchEvidenceStatus: R02EvidenceStatus
  policyEvidenceStatus: R02EvidenceStatus
  auditedAt: string
  criteria: R02CriterionMetadata[]
}

export const template: TemplateVersion = {
  "templateId": "S06-T02",
  "version": 1,
  "schemaVersion": 2,
  "name": "学科竞赛报名、校内推荐与参赛资格审核",
  "description": "本地研究模板 · 非校方正式模板。用于整理事实、证据版本、问题与待人工复核事项；不代替成都理工大学或赛事/实践主管机关作出正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板为本地研究模板，非校方正式模板；当前政策证据状态为 PARTIAL，未经有权部门确认不得作为正式审批依据。",
  "objectType": "project",
  "displayName": {
    "template": "{{F001}} · {{F002}}"
  },
  "fields": [
    {
      "key": "F001",
      "label": "赛事唯一定位",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F001：competitionKey:string，赛事唯一定位；申报选择与官方赛项目录核对，M001；原始阶段/缺失语义：A—G；无官方对应则 POLICY_UNCONFIRMED；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F002",
      "label": "届次/年份/校内批次",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F002：editionYear:string，届次/年份/校内批次；M001，不按系统当前年猜；原始阶段/缺失语义：A—G；无明确届次不套用历史阈值；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F003",
      "label": "赛道、组别、本研区分",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F003：trackAndGroup:string，赛道、组别、本研区分；M001/M002；原始阶段/缺失语义：A—G；不明确须承办方确认；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F004",
      "label": "A—G 的当前业务阶段与发生时间",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F004：businessStage:enum，A—G 的当前业务阶段与发生时间；可信工作流事件；原始阶段/缺失语义：全程；不可由学生自填“已批准”推进；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F005",
      "label": "通知/规程/补充通知版本、优先级与有效区间",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F005：policyBundleRef，通知/规程/补充通知版本、优先级与有效区间；M001；原始阶段/缺失语义：A—G；现行性未明 POLICY_UNCONFIRMED；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F006",
      "label": "受信登录主体与提交授权",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F006：applicantActorRef，受信登录主体与提交授权；Host/Main + M002/M003；原始阶段/缺失语义：B—G；Renderer 自报姓名不构成认证；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F007",
      "label": "在校/全日制、本科/研究生等",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F007：studentStatusAndLevel，在校/全日制、本科/研究生等；校内学籍可信快照 M003；原始阶段/缺失语义：B—G；权威数据不可得 SOURCE_UNAVAILABLE；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F008",
      "label": "专业/学院/校区等赛项限制相关属性",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F008：majorCollegeCampus，专业/学院/校区等赛项限制相关属性；M003；原始阶段/缺失语义：B—G；不对未知属性作推断；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F009",
      "label": "个人/队伍、成员 ID 集合、负责人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F009：entryKindAndRoster，个人/队伍、成员 ID 集合、负责人；M002/M004；原始阶段/缺失语义：B—G；记录每名成员的独立身份；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F010",
      "label": "队长、成员、同赛道重复参队事实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F010：memberRoleAndDuplicates，队长、成员、同赛道重复参队事实；M004 + 可信报名库；原始阶段/缺失语义：B—G；只有当期明确禁止重复时才比较；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F011",
      "label": "跨校成员及其受信身份、当期许可",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F011：crossSchoolMembership，跨校成员及其受信身份、当期许可；M001/M004/M005；原始阶段/缺失语义：B—G；SRC-006 不能代替其他赛项许可；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F012",
      "label": "指导教师名单、任职事实与计数",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F012：mentorIdentityEmployment，指导教师名单、任职事实与计数；M001/M006；原始阶段/缺失语义：B—G，按适用条件；不得由姓名推断在职；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F013",
      "label": "指导意愿、确认时间与可信签认引用",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F013：mentorAcceptance，指导意愿、确认时间与可信签认引用；M007；原始阶段/缺失语义：C—G，按适用条件；不因自填联系方式判确认；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F014",
      "label": "按 windowKind=INTERNAL_APPLICATION/EXTERNAL_REGISTRATION/ROSTER_FREEZE 分别存截止时间、时区、渠道与提交回执",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F014：registrationWindowChannel，按 windowKind=INTERNAL_APPLICATION/EXTERNAL_REGISTRATION/ROSTER_FREEZE 分别存截止时间、时区、渠道与提交回执；M001/M008；原始阶段/缺失语义：B—F；不得将官网截止视为校内报名仍开放（SRC-010 为索引线索，待取得原件后启用）；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F015",
      "label": "学院、承办组织、校级推荐机关与委托范围",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F015：organizerAuthority，学院、承办组织、校级推荐机关与委托范围；M001/M009/M017；原始阶段/缺失语义：D—G；无授权不得作正式决定；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F016",
      "label": "校赛/面试/评审结果的权威引用",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F016：selectionEvidence，校赛/面试/评审结果的权威引用；M009/M010；原始阶段/缺失语义：D—G；学生自报分数不能替代结果；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F017",
      "label": "赛道名额、名额使用与候补序位",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F017：quotaAllocation，赛道名额、名额使用与候补序位；M001/M010；原始阶段/缺失语义：D—G；计数可核、推荐不可自动给出；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F018",
      "label": "学校/授权机关的正式推荐名单、版本及签发事件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F018：schoolRecommendationRef，学校/授权机关的正式推荐名单、版本及签发事件；M011/M017；原始阶段/缺失语义：E—G；没有正式证据不能显示“已推荐”；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F019",
      "label": "公示、异议和处理结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F019：publicityAndObjectionRef，公示、异议和处理结论；M001/M012；原始阶段/缺失语义：E—G，仅当该赛事有此程序；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F020",
      "label": "上级赛事平台接收/拒绝回执",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F020：externalRegistrationRef，上级赛事平台接收/拒绝回执；M015；原始阶段/缺失语义：F—G；不等于学校批准或获奖；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F021",
      "label": "各 M 的 hash、上传时间、签发版本和依赖关系",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F021：materialVersionSet，各 M 的 hash、上传时间、签发版本和依赖关系；受信存储；原始阶段/缺失语义：B—G；定向重审与快照冻结之依据；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F022",
      "label": "补件、人员变更、撤回、弃权、重提事件及原案关联",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F022：changeWithdrawalEvent，补件、人员变更、撤回、弃权、重提事件及原案关联；M013；原始阶段/缺失语义：G 或有关阶段；晚于正式决定须交原机关；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F023",
      "label": "异议/复核理由、范围及有权处理回执",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F023：reviewPetitionRef，异议/复核理由、范围及有权处理回执；M014/M012；原始阶段/缺失语义：G；模型不裁量是否复核成立；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F024",
      "label": "签发者主体 ID、授权范围、签署时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F024：trustedDecisionActor，签发者主体 ID、授权范围、签署时间；Host/Main + M017；原始阶段/缺失语义：E—G；不可使用 Renderer 传入的 Actor；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F025",
      "label": "当期赛事如有原创/权属声明要求及证据引用",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F025：originalityDeclaration，当期赛事如有原创/权属声明要求及证据引用；M001/M016；原始阶段/缺失语义：B—F；真实性争议送人工/权属域；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F026",
      "label": "G06/G07/G03/G05 与相邻 S/T 的外部正式结果指针",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F026：downstreamAuthorityRefs，G06/G07/G03/G05 与相邻 S/T 的外部正式结果指针；原始阶段/缺失语义：各阶段仅只读引用；未取得时不据此判断其审批通过；来源与证据位置：。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 当届官方通知、赛项规程及补充版本",
      "purpose": "当届官方通知、赛项规程及补充版本；学校/组委会原文（官方文件 T1）；A 起必需取得规则来源，但不要求学生上传；无原文不可凭历史阈值硬判",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "当届官方通知、赛项规程及补充版本",
        "学校/组委会原文（官方文件 T1）",
        "A 起必需取得规则来源",
        "但不要求学生上传"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 申请表/官方报名登记快照",
      "purpose": "申请表/官方报名登记快照；申请人填报（T3）；B 起，个人/队伍自填事实，不构成学校批准",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "申请表/官方报名登记快照",
        "申请人填报（T3）",
        "B 起",
        "个人/队伍自填事实"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 · 校内可信学籍与当前身份属性快照",
      "purpose": "校内可信学籍与当前身份属性快照；Host/授权系统（T0）；B 起；无法授权获取时走人工核实，不强迫全量敏感证明上传",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "校内可信学籍与当前身份属性快照",
        "Host/授权系统（T0）",
        "B 起",
        "无法授权获取时走人工核实"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 · 团队成员、角色和成员确认记录",
      "purpose": "团队成员、角色和成员确认记录；成员本人受信签认优于队长声明（T0/T3）；B 起，团队情形；个人赛 NOT_APPLICABLE",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "团队成员、角色和成员确认记录",
        "成员本人受信签认优于队长声明（T0/T3）",
        "B 起",
        "团队情形"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 · 外校成员在校身份/组队同意凭据",
      "purpose": "外校成员在校身份/组队同意凭据；外校主管可信记录（T1/T2）；B—C，仅当前赛事允许跨校且确有跨校成员",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "外校成员在校身份/组队同意凭据",
        "外校主管可信记录（T1/T2）",
        "B—C",
        "仅当前赛事允许跨校且确有跨校成员"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 · 指导教师身份、在职情况及其指导队伍约束的权威快照",
      "purpose": "指导教师身份、在职情况及其指导队伍约束的权威快照；人事/教师系统（T0）；B—C，仅赛事要求导师时，非申请人自填名片",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "指导教师身份、在职情况及其指导队伍约束的权威快照",
        "人事/教师系统（T0）",
        "B—C",
        "仅赛事要求导师时"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "M007 · 指导教师本人接受指导的有效确认/签认（T0/T2）",
      "purpose": "指导教师本人接受指导的有效确认/签认（T0/T2）；C 后如承办方或系统身份门禁要求，不能臆造学校纸质盖章要件",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "指导教师本人接受指导的有效确认/签认（T0/T2）",
        "C 后如承办方或系统身份门禁要求",
        "不能臆造学校纸质盖章要件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 · 报名提交时点、来源渠道、校内/赛事平台登记凭据（T0/T1/T2）",
      "purpose": "报名提交时点、来源渠道、校内/赛事平台登记凭据（T0/T1/T2）；B—C，报名后才产生；报名前不强制提交成功截图",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "报名提交时点、来源渠道、校内/赛事平台登记凭据（T0/T1/T2）",
        "B—C",
        "报名后才产生",
        "报名前不强制提交成功截图"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 · 学院推荐、导师面试/赛事组织分工及遴选过程记录（T1/T2）",
      "purpose": "学院推荐、导师面试/赛事组织分工及遴选过程记录（T1/T2）；D，若该批次采取此路径；联系人身份不是批准权",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "学院推荐、导师面试/赛事组织分工及遴选过程记录（T1/T2）",
        "D",
        "若该批次采取此路径",
        "联系人身份不是批准权"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 校赛成绩/排名、裁判记录与当届名额发布（T1/T2）",
      "purpose": "校赛成绩/排名、裁判记录与当届名额发布（T1/T2）；D 后产生；D 前缺失不报补件",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "校赛成绩/排名、裁判记录与当届名额发布（T1/T2）",
        "D 后产生",
        "D 前缺失不报补件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 有权机关签发的学校推荐名单/决定和版本（T0/T1）",
      "purpose": "有权机关签发的学校推荐名单/决定和版本（T0/T1）；E 形成后；申请人报名初期不可被要求先交",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "有权机关签发的学校推荐名单/决定和版本（T0/T1）",
        "E 形成后",
        "申请人报名初期不可被要求先交"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 按当届规则形成的公示、异议登记与处理决定（T1/T2）",
      "purpose": "按当届规则形成的公示、异议登记与处理决定（T1/T2）；E—G，仅当具体赛事设置公示/异议",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "按当届规则形成的公示、异议登记与处理决定（T1/T2）",
        "E—G",
        "仅当具体赛事设置公示/异议"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 · 当事人补件/换人/撤回/弃权/重提申请及收到记录（T0/T2/T3）",
      "purpose": "当事人补件/换人/撤回/弃权/重提申请及收到记录（T0/T2/T3）；发生时才出现；已决定的变更需回到原权威机关",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "当事人补件/换人/撤回/弃权/重提申请及收到记录（T0/T2/T3）",
        "发生时才出现",
        "已决定的变更需回到原权威机关"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 本人异议/复核申请、事实依据及受理/处理回执（T0/T2/T3）",
      "purpose": "本人异议/复核申请、事实依据及受理/处理回执（T0/T2/T3）；G；无校本通用诉期则不编造时限",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "本人异议/复核申请、事实依据及受理/处理回执（T0/T2/T3）",
        "G",
        "无校本通用诉期则不编造时限"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 外部赛事官网的提交/受理/退回回执（T1/T2）",
      "purpose": "外部赛事官网的提交/受理/退回回执（T1/T2）；F 才产生；不能倒推为“校方推荐通过”",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "外部赛事官网的提交/受理/退回回执（T1/T2）",
        "F 才产生",
        "不能倒推为“校方推荐通过”"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 特定赛事要求的原创承诺、参赛作品关联和必要授权证据（T2/T3）",
      "purpose": "特定赛事要求的原创承诺、参赛作品关联和必要授权证据（T2/T3）；B—F 依赛事节点；IP 归属另走 G06",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "特定赛事要求的原创承诺、参赛作品关联和必要授权证据（T2/T3）",
        "B—F 依赛事节点",
        "IP 归属另走 G06"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 · Host/Main 审批主体、岗位授权及签发事件审计（T0）",
      "purpose": "Host/Main 审批主体、岗位授权及签发事件审计（T0）；D—G；不是 Renderer 自填字段，也不是让学生上传的批准章",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "Host/Main 审批主体、岗位授权及签发事件审计（T0）",
        "D—G",
        "不是 Renderer 自填字段",
        "也不是让学生上传的批准章"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "entry-eligibility",
      "name": "报名与参赛资格类规则",
      "description": "来自原始模板第08节规则分组。每条规则对应原始 R ID；SRC 仅为研究来源索引，不是案卷 SourceRef。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "当期赛事规则可用（A—G）",
          "requirement": "原文第08节规则 R001。T 已选定赛事实例；F 尚未选择赛事实例（仅意向页）；U 赛事名/届次/赛道范围不明。SRC-001—005、SRC-007；F001—F005；M001；核对官方原文的赛项、届次、赛道、发布机关、修订优先级、有效期；T1 高于自传旧通知，SRC-007 仅历史线索。赛前/申报时点版本必须匹配。；确认当届适用范围→PASS_FACT；原件已知但无法读取→SOURCE_UNAVAILABLE；无现行条文→POLICY_UNCONFIRMED；两份同等有效官方规定矛盾→CONFLICT；承办学院/赛事管理人确认版本。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "申请主体与报名模式（B—C）",
          "requirement": "原文第08节规则 R002。T 报名提交；F 仅公告浏览/尚未提交；U 是否允许个人、队伍或学院统一报送未明确。SRC-002/003/004；F003/F004/F006/F009；M001/M002；将自报个人/队伍模式与当届原文逐字段比较。学院统一报名的场景不把“未由个人平台提交”判为违规；原文缺适用模式则 U。；一致→PASS_FACT；已证实模式不符→CONFLICT；必填报名表未交→NEEDS_MATERIAL；申请人/学院赛事负责人。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "R003",
          "title": "申请人与学生资格身份（B—C）",
          "requirement": "原文第08节规则 R003。T 赛事要求学生身份；F 仅非学生赛道且路由已确认不属本事项；U 对象/学段规则不明。SRC-002—005；F006/F007；M002/M003；对比 Host 登录主体与校内权威学籍快照、报名时点的有效学段；扫描学生证仅次级线索。跨院校、休复学等例外按有权学籍结论，不自己审批学籍。；在校身份和申报一致→PASS_FACT；两者冲突→CONFLICT；可信系统不可访问→SOURCE_UNAVAILABLE；学籍权威部门/承办学院。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "专业、学段和赛道适配（B—C）",
          "requirement": "原文第08节规则 R004。T 当届对本科/研究生、专业或赛道有明确条件；F 已证明该属性不设限制；U 当期规则或专业归属解释不明。SRC-002/003/004；F003/F007/F008；M001/M003；对当前学籍属性和当届赛道集合比较；SRC-003 的“经济管理专业、本研组”及 SRC-004 的“本科”仅做同届示例。专业交叉认定须承办方确认。；明确匹配→PASS_FACT；明确不符→CONFLICT；专业边界需解释→NEEDS_HUMAN_DECISION；学院/赛项承办方。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "团队人数与角色组成（B—C）",
          "requirement": "原文第08节规则 R005。T 当前赛项要求团队；F 已确认个人赛；U 队伍模式/人数限额无当前依据。SRC-002—005；F009/F010；M001/M004/M002；团队成员 ID 去重，按成员身份及角色统计，与该届上下限及队长要求比对。队长填的其他成员姓名不足以证实其加入；名单修订需同届版本。；可信名单满足规定→PASS_FACT；人数/角色确定违规则→CONFLICT；该阶段应交名单未交→NEEDS_MATERIAL；团队负责人、成员本人、学院。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "R006",
          "title": "跨校组队允许性与身份（B—C）",
          "requirement": "原文第08节规则 R006。T 团队存在外校成员且该赛项适用跨校核验；F 已证实无外校成员；U 是否允许跨校或跨校成员身份无法界定。SRC-003/005/006；F011/F009；M001/M004/M005；将当前赛事条文与外校成员可信归属证据逐个比对。SRC-006 允许并公示的是特定挑战杯场景，不能覆盖 SRC-003/005 的同届禁止。跨校许可未核实不“默认禁止”。；当届允许且身份可核→PASS_FACT；当届明确禁止仍含外校成员→CONFLICT；许可解释不清→POLICY_UNCONFIRMED；承办组织/双方学校联系人。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R007",
          "title": "禁止重复组队与成员角色互斥（B—C）",
          "requirement": "原文第08节规则 R007。T 当届明确限制跨团队或重复报名；F 官方规则确认不设该限制；U 限制范围不明。SRC-003；F010/F009；M001/M004；基于当届官方报名库查询同一成员在同一限制范围内的其他参赛记录，不能跨不同赛道/年度推断违规。不可仅依申请人声明“未重复”。；无受限重复→PASS_FACT；实际重复记录→CONFLICT；官方库无法查询→SOURCE_UNAVAILABLE；竞赛报名管理人/成员本人。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "R008",
          "title": "指导教师数量、身份与在职事实（B—C）",
          "requirement": "原文第08节规则 R008。T 对应赛项规定指导教师人数/校内在职等；F 官方当期规则不要求；U 指导教师是否必需或身份条件不明。SRC-002/003/004/005；F012；M001/M006；可信教师系统读取任职/在岗、指导数量（若赛事限制）并与当届要求比较；SRC-005 的“校内在职教师”仅适用该赛项。不得凭自填教师 ID。；任职和数量匹配→PASS_FACT；可信事实不符→CONFLICT；人事数据不可得→SOURCE_UNAVAILABLE；指导教师/学院竞赛负责人。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "指导教师本人确认（C）",
          "requirement": "原文第08节规则 R009。T 对应赛项或校内授权流程有证据证明须取得教师本人接受指导确认；F 已确认此阶段无需确认；U 仅通知载有导师名单但未说明确认形式。SRC-002/003/005；F013/F012；M001/M007；Host 可信教师签认/可验签确认与指定队伍、赛道、届次一致。老师姓名、截图及 Renderer actor 均不能证明本人同意。不得凭一般性常识创设纸质签章要求。；受信确认已存在→PASS_FACT；校方明定需交而未交→NEEDS_MATERIAL；无授权确认链→NEEDS_HUMAN_DECISION；指导教师本人/学院。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R010",
          "title": "报名时点与合法渠道（B—C，F 外部阶段另由 R017）",
          "requirement": "原文第08节规则 R010。T 已出现校内报名提交事件且该届校内渠道/截止有规定；F 尚未提交仅意向阶段；U 对应窗口或渠道未可靠取得。SRC-003/004/005、SRC-010（仅索引警示）；F014/F002；M001/M002/M008；分别比较校内报名、外部报名、名单冻结三种窗口的可信服务端时间、时区、渠道；不得以外部报名仍开证明校内已逾期可补报。SRC-003 截止后不可改队伍属该届特殊限制；延长/补录需正式补充通知。；按期指定校内渠道提交→PASS_FACT；可信记录明示逾期/错渠道→CONFLICT；已明确需要证明但未交→NEEDS_MATERIAL；提交方或渠道失联→SOURCE_UNAVAILABLE；承办学院/校内受理人员。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R011",
          "title": "原创性承诺与作品权属边界（B—F）",
          "requirement": "原文第08节规则 R011。T 当届确有原创承诺或授权材料要求且已到该阶段；F 尚未到作品/承诺阶段或无要求；U 要求文本及权属范围不清。SRC-005、SRC-008（仅技术边界）；F025/F026；M001/M016；只核“规定的承诺/必要文件有无及署名一致”，不由 AI 判定真正原创、侵权或许可有效。真实性投诉、权属争议交 G06/赛事有权部门。；文件存在且可核格式→PASS_FACT（只限文件事实）；现阶段要求的承诺未交→NEEDS_MATERIAL；权属/抄袭争议→NEEDS_HUMAN_DECISION；赛事承办方/G06 权属机关。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "selection-and-external-registration",
      "name": "选拔、正式推荐、对外报名与变更",
      "description": "来自原始模板第08节规则分组。每条规则对应原始 R ID；SRC 仅为研究来源索引，不是案卷 SourceRef。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "R012",
          "title": "选拔/学院报送的授权（D）",
          "requirement": "原文第08节规则 R012。T 实际执行校内遴选、学院推荐或面试；F 当届明确允许个人直报且无需校内遴选；U 审核组织或委托权限不明。SRC-002/003/004；F015/F024；M001/M009/M017；核对本届官方承办单位、授权文件、组织者受信主体与活动范围。学院联系人/学生干部不可因发通知而获得推荐签发权。；角色在授权范围内→PASS_FACT（仅权限事实）；受信人员角色不符→CONFLICT；授权尚未确定→NEEDS_HUMAN_DECISION；主管部门/授权管理员。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R013",
          "title": "校赛评审或面试结果来源真实性（D）",
          "requirement": "原文第08节规则 R013。T 当前阶段依选拔成绩/面试结果进入推荐；F 当届无需此途径；U 选拔机制未明。SRC-002/003/004；F016；M009/M010；比对原始裁判/遴选组织记录、队伍 ID、组别、成绩版本、公布时间；不自动评分，不把学生自报分数作为官方排名。；官方可核结果一致→PASS_FACT；名单/成绩来源冲突→CONFLICT；原评审记录无法取得→SOURCE_UNAVAILABLE；裁判组/学院承办方。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R014",
          "title": "赛道推荐名额、拟报送名单与候补顺位（D—E）",
          "requirement": "原文第08节规则 R014。T 当届学校向上级赛事限额推荐且已有待核的拟报送名单；F 无限额或 D 阶段尚未形成拟报送名单（只形成候选池）；U 名额有效版本或分配方式不明。SRC-003/004；F017/F016；M001/M010；逐赛事、赛道、组别、届次核对拟报送/已签发推荐人数与配额及重复占额；候选池人数可以大于推荐名额，本身不是违规。名次只引用原裁判结果；候补由机关决定。；拟报送计数不超当届限额→PASS_FACT（不是获得名额）；拟报送超额或同一名额重复占用→CONFLICT；名额调整/并列择优→NEEDS_HUMAN_DECISION；校赛组委会/推荐机关。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R015",
          "title": "学校正式推荐决定的真实性（E）",
          "requirement": "原文第08节规则 R015。T 请求展示“学校已推荐”或交接上级赛；F 仍为报名/预审/候选阶段；U 本届是否需要学校推荐未明确。SRC-002/003/006；F018/F024；M001/M011/M017；只验证原生推荐名单、签发机关、授权、时间、未撤销版本及目标队伍一致；不由本 R 生成签发事件。校赛排名、AI 预审结果和审核人点击“通过”均不能替代。；已有有效原生决定→PASS_FACT（可另显示可信外部决定）；尚待有权机关签发→NEEDS_HUMAN_DECISION；伪造/错版本→CONFLICT；指定推荐机关。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R016",
          "title": "公示与异议处理是否影响推荐（E—G）",
          "requirement": "原文第08节规则 R016。T 本届明确设置公示/异议且已到阶段；F 当前赛项明确无此程序或尚未到公示阶段；U 无现行公示规则。SRC-006、SRC-009（未核实）；F019；M001/M012；核对当前届公示、受理时段、异议对象、处理机关和最终版本；SRC-006 只能证明 2025 挑战杯个案。异议未决时只生成有权机关的是否暂停报送待办，不得擅自冻结或撤销既有决定；匿名/逾期异议能否受理须依本届条文。；公示及处置事实可核→PASS_FACT；在途异议或程序裁量→NEEDS_HUMAN_DECISION；公告版本矛盾→CONFLICT；公示发布/异议受理机关。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "外部赛事报名回执事实（F）",
          "requirement": "原文第08节规则 R017。T 已在当届规定的外部渠道尝试报名/交接；F 未到对外报名阶段；U 官方报名渠道未核实。SRC-003/005；F020/F014；M001/M015；对接官方平台回执 ID、队伍/赛道/届次及受理状态与时间；申请人截图不能自动证明平台正式接收。外部回执不是校内推荐或获奖证明。；官方受理事实已验证→PASS_FACT；官方明确拒绝/数据不符→CONFLICT；权威回执不可取得→SOURCE_UNAVAILABLE；赛事报名平台/承办学院。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R018",
          "title": "成员变更、撤回、弃权与重提（B—G）",
          "requirement": "原文第08节规则 R018。T 有正式变更/撤回/弃权/重提事件；F 无此事件；U 事件作用于哪个已签发决定或当届变更时限不明。SRC-003；F021/F022/F018/F024；M001/M013/M011/M017；验证申请人身份、原案 ID、提交时点及受影响名单版本；SRC-003 某届截止后不得更改团队，弃权候补须有权机关确认。重提生成新申请尝试/版本，不改写已撤回记录。；撤回/变更请求事实成立→PASS_FACT（仅请求事实）；触及已签发决定/候补名额→NEEDS_HUMAN_DECISION；错人撤回或旧版冲突→CONFLICT；申请人、原推荐机关/外部组委会。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R019",
          "title": "异议、复核申请及答复归属（G）",
          "requirement": "原文第08节规则 R019。T 当事人发起该届规则允许的异议/复核请求；F 无此申请；U 对应赛项的复核权限、实名要求、期限、受理条件不明。SRC-006、SRC-007（未核实）；F023/F019/F024；M014/M012/M017；对比提出者、受理渠道、涉案决定版本与受理证明。SRC-006 的实名要求仅该公示；其他届次不预设。仅认定“申请已提交/已回复”事实，不判断理由成立；需由原机关或规则指定复核人决定。；有权接收的凭据与对象可核→PASS_FACT（仅程序事实）；答复待决→NEEDS_HUMAN_DECISION；引用错误决定版本→CONFLICT；赛事指定异议受理/复核机构。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "材料版本与定向重审一致性（B—G）",
          "requirement": "原文第08节规则 R020。T 任一被规则依赖的 F/M/sourceVersion 更新；F 无变化；U 版本/依赖映射失踪或现行来源版本未知。SRC-002/003/008（技术线索，非校本授权）；F004/F021/F022/F026；M002/M004/M013；用 materialId + hash + sourceVersion + targetId 对比原快照，按 §11 的依赖表只重审受影响 R 及派生结论；保留原正式决定，不擅自撤销。；影响集正确重建→PASS_FACT（仅审计一致）；丢失原版本/关联错位→CONFLICT；依赖关系无法确定→NEEDS_HUMAN_DECISION；案件 Owner/材料管理员。。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "A",
      "name": "当期赛事配置",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "B"
    },
    {
      "id": "B",
      "name": "意向/报名提交",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "C"
    },
    {
      "id": "C",
      "name": "事实预审/补件",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "D"
    },
    {
      "id": "D",
      "name": "校内选拔/推荐候选状态核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "E"
    },
    {
      "id": "E",
      "name": "正式决定依据核验/公示（适用时）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "F",
      "skippableReason": "仅当该届赛事存在正式推荐/公示步骤时进入；是否适用须绑定当届规程。"
    },
    {
      "id": "F",
      "name": "对外报名/交接事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "G",
      "skippableReason": "仅当当届赛事需要对外报名/交接时进入；本地不得模拟外部平台受理。"
    },
    {
      "id": "G",
      "name": "变更、撤回、复核、归档转交",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "skippableReason": "仅有变更、撤回、异议/复核或归档事件时进入；不得自动撤销或释放名额。"
    }
  ],
  "outputs": [
    {
      "id": "fact-result-and-source-comparison",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "current-stage-supplement-list",
      "kind": "supplement-list",
      "audience": "student"
    },
    {
      "id": "authorized-recommendation-decision-referral",
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
export const templateVersion: TemplateVersion = template

export const r02Metadata: R02Metadata = {
  "templateId": "S06-T02",
  "name": "学科竞赛报名、校内推荐与参赛资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S06-T02.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/S06-T02.md",
  "sourceDocumentBytes": 130993,
  "sourceDocumentSha256": "945a2f2e7dcf12fc021ca4a0424bdca31814291b451abdc1b4e9884f60c9cb64",
  "officialSchoolTemplate": false,
  "researchEvidenceStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "auditedAt": "2026-10-24",
  "criteria": [
    {
      "sectionId": "entry-eligibility",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "当期赛事规则可用（A—G）"
    },
    {
      "sectionId": "entry-eligibility",
      "criterionId": "R002",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "申请主体与报名模式（B—C）"
    },
    {
      "sectionId": "entry-eligibility",
      "criterionId": "R003",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "申请人与学生资格身份（B—C）"
    },
    {
      "sectionId": "entry-eligibility",
      "criterionId": "R004",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "专业、学段和赛道适配（B—C）"
    },
    {
      "sectionId": "entry-eligibility",
      "criterionId": "R005",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "团队人数与角色组成（B—C）"
    },
    {
      "sectionId": "entry-eligibility",
      "criterionId": "R006",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "跨校组队允许性与身份（B—C）"
    },
    {
      "sectionId": "entry-eligibility",
      "criterionId": "R007",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "禁止重复组队与成员角色互斥（B—C）"
    },
    {
      "sectionId": "entry-eligibility",
      "criterionId": "R008",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "指导教师数量、身份与在职事实（B—C）"
    },
    {
      "sectionId": "entry-eligibility",
      "criterionId": "R009",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "指导教师本人确认（C）"
    },
    {
      "sectionId": "entry-eligibility",
      "criterionId": "R010",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "报名时点与合法渠道（B—C，F 外部阶段另由 R017）"
    },
    {
      "sectionId": "entry-eligibility",
      "criterionId": "R011",
      "srcIds": [
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "原创性承诺与作品权属边界（B—F）"
    },
    {
      "sectionId": "selection-and-external-registration",
      "criterionId": "R012",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "选拔/学院报送的授权（D）"
    },
    {
      "sectionId": "selection-and-external-registration",
      "criterionId": "R013",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "校赛评审或面试结果来源真实性（D）"
    },
    {
      "sectionId": "selection-and-external-registration",
      "criterionId": "R014",
      "srcIds": [
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "赛道推荐名额、拟报送名单与候补顺位（D—E）"
    },
    {
      "sectionId": "selection-and-external-registration",
      "criterionId": "R015",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "学校正式推荐决定的真实性（E）"
    },
    {
      "sectionId": "selection-and-external-registration",
      "criterionId": "R016",
      "srcIds": [
        "SRC-006",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "公示与异议处理是否影响推荐（E—G）"
    },
    {
      "sectionId": "selection-and-external-registration",
      "criterionId": "R017",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "外部赛事报名回执事实（F）"
    },
    {
      "sectionId": "selection-and-external-registration",
      "criterionId": "R018",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "成员变更、撤回、弃权与重提（B—G）"
    },
    {
      "sectionId": "selection-and-external-registration",
      "criterionId": "R019",
      "srcIds": [
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "异议、复核申请及答复归属（G）"
    },
    {
      "sectionId": "selection-and-external-registration",
      "criterionId": "R020",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "材料版本与定向重审一致性（B—G）"
    }
  ]
}
