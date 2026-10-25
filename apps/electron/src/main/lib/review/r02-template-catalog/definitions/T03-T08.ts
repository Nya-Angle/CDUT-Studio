import type { TemplateVersion } from '@profer/shared'

/** T03-T08 的 R02 研究稿投影：本地事实预审，不代表学校政策或审批。 */
export const templateVersion: TemplateVersion = {
  "templateId": "T03-T08",
  "version": 1,
  "schemaVersion": 2,
  "name": "科研外协、技术合作及委托研究立项审核",
  "description": "本地研究模板 · 非校方正式模板。仅审核主项目下真实对外科研工作包的立项事实、合作方、经费与风险前置条件；主合同、采购、预算变更、保密、合同签章及成果验收分别引用其有权决定。部分规则待确认，禁止自动正式批准或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；来源 docs/design/review-agent/business-templates/R02/T03-T08.md；SHA-256 01592025bc49e56367fa6bd9e57f29f17db211d716a004ecc12d5a386b84453f；PARTIAL，2017 科研外协办法及 2024 校级合同办法权限链待确认。SRC 不是案卷 SourceRef 或真实 PolicyVersion。",
  "objectType": "project",
  "displayName": {
    "template": "{{f007}} · {{f019}} 外协立项"
  },
  "fields": [
    {
      "key": "f001",
      "label": "caseId（F001）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F001 id/案卷/全程；服务端唯一；P1；U。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f002",
      "label": "stage（F002）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F002 enum/案卷/全程；§03 枚举由服务端转换；P1；U。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f003",
      "label": "subtype（F003）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F003 enum/外协/发起；C01–C10 分支，可复选条件；P1；B。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f004",
      "label": "requesterId（F004）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F004 id/申请人/发起；学校身份服务；P2；U。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f005",
      "label": "requesterAuthority（F005）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F005 ref/项目岗位/发起；项目台账授权或服务端授权；P2；U。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f006",
      "label": "academicUnitId（F006）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F006 id/承办学院/发起；组织权限台账；P1；U。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f007",
      "label": "parentProjectId（F007）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F007 id/主项目/发起；科研台账；P1；B/U。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f008",
      "label": "projectFundingType（F008）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F008 enum/主项目/发起；纵向 NSFC/重点研发/其他纵向、横向、校内或未知；P1；U。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f009",
      "label": "projectEffectiveStatus（F009）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F009 enum+日期/主项目/全程；立项、执行、暂停、终止及有效期；P1；U。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f010",
      "label": "originalTaskScope（F010）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F010 str/ref/主项目/发起；原任务书或合同章节；P2；B。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f011",
      "label": "sponsorRestriction（F011）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F011 ref/主项目/发起；资助方批复、禁止分包/变更条件；P2；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f012",
      "label": "approvedProjectTotal（F012）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F012 money/主项目/预算；学校可信总经费及币种；P2；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f013",
      "label": "approvedOutboundBudget（F013）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F013 money/外拨/预算；批复外拨预算或授权自主调剂事实；P2；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f014",
      "label": "cumulativeOutboundCommitted（F014）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F014 money/同一主项目/预算；已承诺/签订/拟签合并去重汇总；P2；U。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f015",
      "label": "proposedOutboundAmount（F015）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F015 money/本外协/立项；币种、小数、总额；P2；C（无偿可0）。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f016",
      "label": "postProposalOutboundRatio（F016）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F016 decimal/横向外协/预算；(F014+F015去重)/F012，分母/口径待项目核对；P2；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f017",
      "label": "fundUseAndFlow（F017）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F017 enum/资金/立项；外拨科研合作/服务采购/无款/其他；P2；B。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f018",
      "label": "collaborationMode（F018）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F018 enum/外协/发起；计划内合作、新增委托研究、共同研发、技术服务、争议；P1；B。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f019",
      "label": "delegatedResearchTasks（F019）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F019 str/外协/发起；清晰科研工作包、数量/方法；P2；B。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f020",
      "label": "necessityAndAlternatives（F020）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F020 str/外协/发起；校内能力限制/替代方案/不委托影响；P2；B。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f021",
      "label": "capacityGapEvidence（F021）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F021 ref/外协/发起；设备、专门能力或时间限制说明；P2；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f022",
      "label": "deliverableAcceptanceCriteria（F022）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F022 str/外协/发起；指标、格式、成果质量与验收负责人；P2；B。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f023",
      "label": "performanceDates（F023）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F023 date range/外协/发起；与主项目期限比较；P1；B。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f024",
      "label": "counterpartyLegalIdentity（F024）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F024 id/外部单位/立项；证照统一代码、存续状态与权威校核；P2；B。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f025",
      "label": "counterpartyQualifications（F025）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F025 list/ref/外部单位/立项；项目特需资质/岗位专业能力；P2；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f026",
      "label": "counterpartyPerformanceCapacity（F026）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F026 list/ref/外部单位/立项；人员、设备、类似科研成果；P2；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f027",
      "label": "counterpartyPaymentAccount（F027）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F027 ref/外部单位/签约/支付阶段；账户同一性，经财务可信核验；P2；L。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f028",
      "label": "conflictDisclosure（F028）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F028 list/ref/PI/团队/立项；参股、任职、直接利益及近亲属相关关系的申请声明；P2；B。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f029",
      "label": "conflictVerificationDecision（F029）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F029 ref/独立归口/立项会签；关联事实处理意见/调查决定；P2；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f030",
      "label": "priceReasonablenessEvidence（F030）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F030 list/ref/外协/立项；成本构成、比价或价格依据，不当“最低价”自动过；P2；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f031",
      "label": "contractDraftVersion（F031）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F031 hash+版本/合同/立项；条款草案与来源；P2；B。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f032",
      "label": "contractResearchTerms（F032）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F032 list/合同/立项；主体、目标、期限、费用、验收、违约、保密；P2；B。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f033",
      "label": "procurementClassification（F033）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F033 enum/ref/外协/分流；采购/科研非采购/待定、由采购归口确认；P1；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f034",
      "label": "procurementDecisionId（F034）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F034 ref/T04/会签；对应拟采购事项签发记录；P1；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f035",
      "label": "budgetChangeDecisionId（F035）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F035 ref/T03-T04/会签；预算/外拨调剂决定；P2；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f036",
      "label": "securityClassification（F036）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F036 enum/任务/筛查；公开/内部敏感/商业秘密/国家秘密/未知；P3元数据；U/C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f037",
      "label": "securityReleaseDecisionId（F037）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F037 ref/保密归口/会签；可对外合作/脱敏流转批准；P3元数据；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f038",
      "label": "ipDataRightsTerms（F038）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F038 list/合同/立项；成果权属、许可、数据使用/交付与技术保密条款；P2；B。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f039",
      "label": "ipEthicsDecisionRefs（F039）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F039 list/ref/G06/会签；有触发时签发引用；P2；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f040",
      "label": "signatoryAuthorityRef（F040）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F040 ref/合同/签署；授权范围、有效期与签署权限；P1；L。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f041",
      "label": "unitReviewRecord（F041）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F041 ref/学院/受理之后；实际审查人及意见；P1；L。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f042",
      "label": "researchManagementReview（F042）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F042 ref/科研归口/受理之后；实际决定/会签意见；P1；L。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f043",
      "label": "outsourceDecisionId（F043）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F043 ref/签发决定/有权结论后；不可伪造正式决定；P1；L。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f044",
      "label": "executedContractId（F044）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F044 ref/合同/生效后；真实双方签署合同与版号；P2；L。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f045",
      "label": "performanceOrAcceptanceRef（F045）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F045 ref/履约/后续；实际验收签发或 T03-T10 关联结果；P2；L。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f046",
      "label": "amendmentOrWithdrawalEvent（F046）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F046 event/案卷/变更/撤回；请求人身份、旧版ID、理由、有效时点；P2；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f047",
      "label": "reviewRequestRef（F047）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "F047 ref/复核/决定之后；申诉对象、理由、受理机关；P2；C。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    },
    {
      "key": "f048",
      "label": "evidenceManifest（F048）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "F048 list/所有材料/全程；documentId,ownerId,objectId,sha256,sourceVersion,receivedAt,readability,authority；P2；U。仅按案卷对象、来源版本与可信证据提取；无权限或证据时保留未知，不根据截图推定正式批准。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "主项目身份/执行状态（M001）",
      "purpose": "主项目身份/执行状态；科研归口权威立项台账、任务书 ID，可附授权下载件；当前；F005/F007–F009，R001–R003，SRC-003/010；后端失联→SOURCE_UNAVAILABLE。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "主项目身份/执行状态",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "原任务书、合同和预算中外协任务是否已列（M002）",
      "purpose": "原任务书、合同和预算中外协任务是否已列；PI/科研处持有签发版及可信修订/批复；条件：纵向/任务受限；F010–F013，R003/R005/R006，SRC-003/012/013；版本冲突→CONFLICT。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "原任务书、合同和预算中外协任务是否已列",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "外协必要性及校内替代分析（M003）",
      "purpose": "外协必要性及校内替代分析；PI 理由书/同行专业意见；当前；F019–F021，R004，SRC-003/004/018；未提供→NEEDS_MATERIAL，科学价值留人工。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 1,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "外协必要性及校内替代分析",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "工作包、时间、成果及验收方案（M004）",
      "purpose": "工作包、时间、成果及验收方案；PI 技术任务书/拟合同附件；当前；F018/F019/F022/F023，R003/R005/R013，SRC-003/004；模糊指标→人工完善。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 1,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "工作包、时间、成果及验收方案",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "合作方独立主体资格（M005）",
      "purpose": "合作方独立主体资格；外部单位证照/登记证据 + 有效权威核验结果；当前；F024，R008，SRC-004/018；身份不同→CONFLICT。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 1,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "合作方独立主体资格",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "特需专业能力/履约资源（M006）",
      "purpose": "特需专业能力/履约资源；外部单位业绩、设备/人员和依法须有资质的证书/可信注册核验；条件；F025/F026，R009，SRC-018；不可读→UNREADABLE。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "特需专业能力/履约资源",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "外协金额、报价基础及经费结构（M007）",
      "purpose": "外协金额、报价基础及经费结构；PI 报价/询价或市场、成本论证；有费用时当前；F012–F017/F030，R006/R007/R011，SRC-003/011；无币种/口径→NEEDS_MATERIAL。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "外协金额、报价基础及经费结构",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "关联关系与利益冲突声明（M008）",
      "purpose": "关联关系与利益冲突声明；PI/团队本人分角色签的声明或学校可信承诺；当前；F028，R010，SRC-004；不把自我声明当无关系的最终证明。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 1,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "关联关系与利益冲突声明",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "关联事实独立核实与处置（M009）",
      "purpose": "关联事实独立核实与处置；科研/纪检/法务有权记录、可信企业登记；条件：关联、矛盾或高风险；F029，R010，SRC-004；失联→SOURCE_UNAVAILABLE。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "关联事实独立核实与处置",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "合同草案与科研权利义务（M010）",
      "purpose": "合同草案与科研权利义务；承办人拟稿、合法模板或校版；当前；F031/F032/F038，R012–R014/R017，SRC-005/008；有后续签章栏不报缺。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 1,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "合同草案与科研权利义务",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "采购性质/方式意见（M011）",
      "purpose": "采购性质/方式意见；采购归口/采购系统签发；条件：服务采购/争议；F033/F034，R014，SRC-014/015；未签时只停进入采购路径，不替其决定。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "采购性质/方式意见",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "预算调整或增拨审批（M012）",
      "purpose": "预算调整或增拨审批；T03-T04/资助方权威决定；条件：超授权预算/新增合作；F013/F035，R006/R015，SRC-003/012/013；不可由 PI 上传“我批准”替代。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "预算调整或增拨审批",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "密级与可合作/对外提供审批元数据（M013）",
      "purpose": "密级与可合作/对外提供审批元数据；定密责任部门/保密后端的最小令牌；条件：涉密/未知需核；F036/F037，R016，SRC-016/017；禁止原始涉密材料上传。禁止上传任何国家秘密原件、未脱敏技术正文，只允许最小化授权状态/决定引用。",
      "acceptedKinds": [
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "经核验的对象身份与来源版本",
        "禁止上传任何国家秘密原件、未脱敏技术正文，只允许最小化授权状态/决定引用。"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "产权、数据/伦理条件（M014）",
      "purpose": "产权、数据/伦理条件；学校成果/伦理归口批准或合同对应条款；条件：涉及权利处分/伦理敏感；F038/F039，R017，SRC-004/017；只传引用不重批。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "产权、数据/伦理条件",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "合同签署权限和用章请求（M015）",
      "purpose": "合同签署权限和用章请求；校合同系统签发和授权证明；后续：签约前；F040，R019，SRC-005/008；立项初审不报缺。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "合同签署权限和用章请求",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "学院与科研归口审查、会签意见（M016）",
      "purpose": "学院与科研归口审查、会签意见；真实学校签发后台；后续：受理/决定；F041/F042/F043，R018/R020，SRC-003/005/008；不能用申请人填表替代。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "学院与科研归口审查、会签意见",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "双方真实签章合同及版本索引（M017）",
      "purpose": "双方真实签章合同及版本索引；学校合同台账、双方可信原件；后续：合同生效后；F044，R021，SRC-005/008；OCR 印章不当正式生效。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "双方真实签章合同及版本索引",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "对方开户主体同一性（M018）",
      "purpose": "对方开户主体同一性；财务可信资料，脱敏核对；后续：G07 支付前；F027，R022，SRC-011/012；本模板不得展示完整账号。仅允许脱敏账户主体核对，不收集或展示完整银行账号。",
      "acceptedKinds": [
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "经核验的对象身份与来源版本",
        "仅允许脱敏账户主体核对，不收集或展示完整银行账号。"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "履约进度证据（M019）",
      "purpose": "履约进度证据；PI/外协方进度报告、研发成果和合同追踪；后续：履行；F045，R023，SRC-003/004；不作为立项缺件。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "履约进度证据",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "协作任务验收证据（M020）",
      "purpose": "协作任务验收证据；项目组专家验收/学院监督或 T03-T10 正式结论；后续：验收；F045，R024，SRC-003 第6条；验收签发不能凭 AI。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "协作任务验收证据",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "变更申请及原合同/批准对照（M021）",
      "purpose": "变更申请及原合同/批准对照；PI 与学校合同系统；条件：修改；F031/F035/F043/F044/F046，R025，SRC-004/005/008；旧版不删除。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "变更申请及原合同/批准对照",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "终止/解除协商、已履行与资金风险资料（M022）",
      "purpose": "终止/解除协商、已履行与资金风险资料；承办单位、合同归口；条件：决定后终止；F044/F046，R026，SRC-005/008；与撤回不同。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "终止/解除协商、已履行与资金风险资料",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m023",
      "name": "撤回/复核申请及送达凭证（M023）",
      "purpose": "撤回/复核申请及送达凭证；申请人、学校正式接收端；条件；F004/F043/F046/F047，R026/R027，SRC-005/008；截止未知不自动驳回。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "撤回/复核申请及送达凭证",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m024",
      "name": "资助方/主项目主管对新增外协的书面许可（M024）",
      "purpose": "资助方/主项目主管对新增外协的书面许可；项目主管/科研归口；条件：专项限制触发；F011/F035，R005/R015，SRC-012/013；未知政策→POLICY_UNCONFIRMED。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "资助方/主项目主管对新增外协的书面许可",
        "经核验的对象身份与来源版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m025",
      "name": "技术数据交付与保密/商业秘密安排（M025）",
      "purpose": "技术数据交付与保密/商业秘密安排；法务/保密归口脱敏条款和签发令牌；条件；F036–F039，R016/R017，SRC-016/017；原始秘密不可读不是普通 OCR 故障。禁止上传任何国家秘密原件、未脱敏技术正文，只允许最小化授权状态/决定引用。",
      "acceptedKinds": [
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 20,
      "requiredElements": [
        "经核验的对象身份与来源版本",
        "禁止上传任何国家秘密原件、未脱敏技术正文，只允许最小化授权状态/决定引用。"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "identity-scope",
      "name": "项目身份与外协任务边界",
      "description": "逐条核对 R 规则和来源，按阶段触发；非官方自动批准规则。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "申请人有主项目发起权",
          "requirement": "申请人有主项目发起权；DRAFT/PRECHECK；T=发起本外协，F=仅浏览，U=授权未知。F004/F005/F007；M001；SRC-003/010。后端比对身份、项目负责/委托授权和有效期：相符 PASS_FACT；冒用 CONFLICT→科研归口核查；缺原始授权 SOURCE_UNAVAILABLE→身份管理员；无发起情形 NOT_APPLICABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "主项目真实且当前可实施",
          "requirement": "主项目真实且当前可实施；PRECHECK；T=关联主项目，F=无主项目/纯框架，U=台账缺失。F007–F009；M001；SRC-003/010。核签发状态、项目期间：有效 PASS_FACT；明确终止/不属本案 CONFLICT/NOT_APPLICABLE→科研归口；台账不可用 SOURCE_UNAVAILABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "拟外协任务属于原研究目标的可追踪子任务",
          "requirement": "拟外协任务属于原研究目标的可追踪子任务；PRECHECK；T=存在主任务，F=无研究任务，U=范围不清。F010/F018/F019/F022；M002/M004；SRC-003/004/010。逐项映射任务书章节、指标和外协 SOW：对应 PASS_FACT；不同研究目标 CONFLICT→T03-T05/项目主管；不明 NEEDS_MATERIAL→PI。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "提出了可核的委外必要性与替代方案",
          "requirement": "提出了可核的委外必要性与替代方案；PRECHECK；T=委外研究，F=纯无任务交流，U=必要性不明。F019–F021；M003/M004；SRC-003/004/018。查原因与校内能力差距证据：有论证 PASS_FACT（不等于经济合理裁量）；空白 NEEDS_MATERIAL→PI；专业价值/例外 NEEDS_HUMAN_DECISION→科研归口。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "专项资助限制和原批准合作边界匹配",
          "requirement": "专项资助限制和原批准合作边界匹配；PRECHECK；T=纵向/有主管限制，F=无限制的横向情形，U=资助类型未知。F008/F010/F011/F018；M002/M004/M024；SRC-003/012/013。比主任务书合作对象、范围及新增许可：一致 PASS_FACT；明示不得新增却新增 CONFLICT→资助主管/科研归口；未能核专项规则 POLICY_UNCONFIRMED；F=NOT_APPLICABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "funding-counterparty",
      "name": "外拨资金与合作方风险",
      "description": "逐条核对 R 规则和来源，按阶段触发；非官方自动批准规则。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "R006",
          "title": "拟金额处于已批准或可自主决定外拨预算权内",
          "requirement": "拟金额处于已批准或可自主决定外拨预算权内；PRECHECK；T=发生外拨，F=无费用，U=资金流不明。F012–F015/F017/F035；M002/M007/M012；SRC-003/012/013。核额度、总承诺去重、变更审批：相符 PASS_FACT；超额无授权 CONFLICT→T03-T04；授权口径不明 POLICY_UNCONFIRMED→科研/财务；F=NOT_APPLICABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "横向外协比例准确并触发正确例外审查",
          "requirement": "横向外协比例准确并触发正确例外审查；PRECHECK；T=横向有外协费，F=纵向或无款，U=性质/分母不明。F008/F012/F014–F016；M007；SRC-003 第3条。核“外协费支出总额/项目总经费”累积口径：≤50%且可信 PASS_FACT；>50%标 NEEDS_HUMAN_DECISION→科研/财务核“原则上”的适用/例外，不自动拒绝；数据不全 NEEDS_MATERIAL/SOURCE_UNAVAILABLE；F=NOT_APPLICABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "合作方主体为可识别独立法人/合法主体且与合同一致",
          "requirement": "合作方主体为可识别独立法人/合法主体且与合同一致；PRECHECK；T=有外部受托方，F=纯校内自研，U=主体身份不明。F024/F031；M005/M010；SRC-004/018。核登记代码、名称存续及合同抬头：一致 PASS_FACT；抬头不一/注销 CONFLICT→PI/法务；无法在线查 SOURCE_UNAVAILABLE→科研归口。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "合作方具备具体研究工作包要求的能力/必要资质",
          "requirement": "合作方具备具体研究工作包要求的能力/必要资质；PRECHECK；T=专业资质/资源有要求，F=无强制资质，U=项目资质标准不明。F019/F025/F026；M004/M006；SRC-004/018。能力与任务逐项比对：证据足 PASS_FACT；证据缺 NEEDS_MATERIAL→PI/合作方；不符合明确准入 CONFLICT→科研归口；专业能力优劣人工决定，F=NOT_APPLICABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "利益关系披露与可查关联事实一致",
          "requirement": "利益关系披露与可查关联事实一致；PRECHECK/会签；T=校外合作，F=不适用外协，U=关联数据未核。F024/F028/F029；M005/M008/M009；SRC-004 负面清单。核本人及直系亲属参股/任职披露与权威资料：无明显矛盾 PASS_FACT（非证明无任何关联）；隐瞒/相互冲突 CONFLICT→科研诚信有权部门；有关联需要独立处置 NEEDS_HUMAN_DECISION；来源失联 SOURCE_UNAVAILABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "报价与任务/金额对象一致、有公允性可供审查的依据",
          "requirement": "报价与任务/金额对象一致、有公允性可供审查的依据；PRECHECK；T=有款，F=无款，U=价格依据不明。F015/F019/F022/F030；M004/M007；SRC-003/011/018。检查成本项、币种、工作量和关联交易说明：证据齐 PASS_FACT（非价格批准）；空白 NEEDS_MATERIAL→PI；明显相互矛盾 CONFLICT→财务/科研归口；公允性争议 NEEDS_HUMAN_DECISION。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "contract-referrals",
      "name": "合同草案及采购保密产权分流",
      "description": "逐条核对 R 规则和来源，按阶段触发；非官方自动批准规则。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "R012",
          "title": "草案版本完整且双方、任务、费用对象同一",
          "requirement": "草案版本完整且双方、任务、费用对象同一；PRECHECK；T=拟签科研外协，F=只有意向框架，U=缺合同。F019/F023/F024/F031/F032；M004/M010；SRC-005/008/018。核合同主体、任务/金额/期限一致：相符 PASS_FACT；主体错/范围冲突 CONFLICT→承办人/合同归口；缺草案 NEEDS_MATERIAL；纯框架 NOT_APPLICABLE并路由。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "合同有可检验交付/验收约定",
          "requirement": "合同有可检验交付/验收约定；PRECHECK；T=需受托科研成果，F=纯框架无工作包，U=条款模糊。F022/F023/F032；M004/M010；SRC-003 第6条/005/018。逐项对照里程碑、指标、质量和验收责任：有可验证条件 PASS_FACT；遗漏 NEEDS_MATERIAL→PI/法务；“完成研究”无标准 NEEDS_HUMAN_DECISION→科研归口；F=NOT_APPLICABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "采购分类及要求的采购决定已被正确路由",
          "requirement": "采购分类及要求的采购决定已被正确路由；预审/会签；T=采购或性质争议，F=可信裁定非采购研究合作，U=未分类。F017/F018/F033/F034；M004/M010/M011；SRC-014/015/018。核财政资金、采购对象与 T04 decisionId：签发适用路径 PASS_FACT；擅称免采或缺签 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→T04；F=NOT_APPLICABLE；无法取签发 SOURCE_UNAVAILABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "新增外协对预算/主项目变更依赖已合法解决",
          "requirement": "新增外协对预算/主项目变更依赖已合法解决；会签；T=偏离原任务书或预算，F=计划内无调整，U=调整权不明。F010–F013/F035；M002/M012/M024；SRC-003/012/013。核 T03-T04/T03-T05 和资助主管签发：有决定 PASS_FACT；无有权决定 NEEDS_HUMAN_DECISION→项目管理；审批服务失联 SOURCE_UNAVAILABLE；F=NOT_APPLICABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "拟外部披露技术材料已获合法保密路径授权",
          "requirement": "拟外部披露技术材料已获合法保密路径授权；预审至签约；T=敏感/涉密或未知，F=可信确认为公开且无其他商业限制，U=分类来源不可达。F036/F037；M013/M025；SRC-003 第12条/016/017。只核保密元数据、签发范围和对方：允许范围匹配 PASS_FACT；无签发 NEEDS_HUMAN_DECISION→保密归口，禁止外发；令牌失联 SOURCE_UNAVAILABLE；F=NOT_APPLICABLE，不将秘密文本交模型。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "成果权属/数据/伦理条款已明确并取得需独立签的决定",
          "requirement": "成果权属/数据/伦理条款已明确并取得需独立签的决定；会签；T=涉及权利处分/伦理/数据对外使用，F=不触发，U=内容不清。F038/F039；M010/M014/M025；SRC-004/017。核合同条款与 G06 有效决定的 scope：一致 PASS_FACT；缺同意 NEEDS_HUMAN_DECISION→G06/法务；条款冲突 CONFLICT；F=NOT_APPLICABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "authority-contract",
      "name": "授权签发与合同版本核验",
      "description": "逐条核对 R 规则和来源，按阶段触发；非官方自动批准规则。",
      "order": 3,
      "required": false,
      "criteria": [
        {
          "id": "R018",
          "title": "学院/科研归口受理意见来自有权人",
          "requirement": "学院/科研归口受理意见来自有权人；SUBMITTED/UNDER_REVIEW；T=进入正式受理，F=草稿，U=权限服务不可用。F006/F041/F042；M016；SRC-003/004/005/008。查签发身份、岗位、签发时权力：匹配 PASS_FACT；冒名 CONFLICT→归口管理员；尚未产生意见 NEEDS_HUMAN_DECISION（队列待办，非补件）；F=NOT_APPLICABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "签署人授权范围与合同对象/版本匹配",
          "requirement": "签署人授权范围与合同对象/版本匹配；CONTRACT_PREPARATION；T=准备签约，F=尚未到该阶段，U=授权失联。F031/F040；M010/M015；SRC-005/008。核签字人、期限、金额/合同类型权限：匹配 PASS_FACT；不符 CONFLICT→合同管理；服务失联 SOURCE_UNAVAILABLE；F=NOT_APPLICABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "T03-T08 最终立项决定真实、有效、未撤销",
          "requirement": "T03-T08 最终立项决定真实、有效、未撤销；DECIDED+；T=进入决定/执行，F=预审，U=决定不可查。F041–F043；M016；SRC-003/005/008。读学校签发式 decisionId 和版本：有效 PASS_FACT；撤销/角色越权 CONFLICT→科研管理；尚未签发 NEEDS_HUMAN_DECISION→有权审批人；F=NOT_APPLICABLE。本规则不自己产生批准。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "已签合同与批准草案版本一致",
          "requirement": "已签合同与批准草案版本一致；EFFECTIVE_MONITORING；T=学校已签，F=签约前，U=合同台账失联。F031/F043/F044；M010/M017；SRC-005/008。哈希比对、签章可信平台与授权范围：一致 PASS_FACT；事后改页/不一致 CONFLICT→合同归口；不可读 UNREADABLE→承办人；F=NOT_APPLICABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "外协收款主体与合同相对方对应",
          "requirement": "外协收款主体与合同相对方对应；转 G07 前；T=计划付款，F=无款/未签，U=财务记录失联。F024/F027/F044；M005/M017/M018；SRC-003/011/012。仅比较脱敏账户持有人与合同方：匹配 PASS_FACT；不同 CONFLICT→财务；不可查 SOURCE_UNAVAILABLE；F=NOT_APPLICABLE。不执行支付。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "performance-remedies",
      "name": "履约、变更、撤回和复核",
      "description": "逐条核对 R 规则和来源，按阶段触发；非官方自动批准规则。",
      "order": 4,
      "required": false,
      "criteria": [
        {
          "id": "R023",
          "title": "阶段履约记录对应已签工作包与有效版本",
          "requirement": "阶段履约记录对应已签工作包与有效版本；EFFECTIVE_MONITORING；T=到了约定阶段，F=未到期，U=期限不可查。F022/F023/F044/F045；M004/M017/M019；SRC-003/004。比较阶段成果与原合同 ID：有记录 PASS_FACT（不等于技术验收）；无进度证据 NEEDS_MATERIAL→PI；矛盾 CONFLICT→科研归口；F=NOT_APPLICABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "协作任务验收结论由合法责任方签发",
          "requirement": "协作任务验收结论由合法责任方签发；ACCEPTANCE_LINKED；T=成果验收阶段，F=尚未完成，U=验收来源不可用。F045；M019/M020；SRC-003 第6条。验证项目组专家验收/学院监督或 T03-T10 结论范围：已签 PASS_FACT；尚待验收 NEEDS_HUMAN_DECISION→PI/学院；失联 SOURCE_UNAVAILABLE；F=NOT_APPLICABLE，不自动决定全项目结题。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "外协变更已绑定旧决定和必要重新审批",
          "requirement": "外协变更已绑定旧决定和必要重新审批；变更；T=任务/金额/对方/合同条款改变，F=无变更，U=旧版不详。F031/F035/F043/F044/F046；M021；SRC-003/004/005/008。diff 变更事实和触发 T03-T04/T05/T04/G06 的签发：齐全 PASS_FACT；无授权 NEEDS_HUMAN_DECISION→原签发链；不一致 CONFLICT；F=NOT_APPLICABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "撤回与已生效合同解除的阶段法律事实正确分流",
          "requirement": "撤回与已生效合同解除的阶段法律事实正确分流；任意阶段；T=收到撤回/终止事件，F=无事件，U=事件签名未核。F002/F043/F044/F046；M022/M023；SRC-005/008。核请求人、决定和签约时间：签约前允许送审撤回 PASS_FACT（仅确认受理）；已签则 NEEDS_HUMAN_DECISION→合同管理走变更/解除，不可删案；F=NOT_APPLICABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "复核/申诉针对有效决定且由有权机关受理",
          "requirement": "复核/申诉针对有效决定且由有权机关受理；复核；T=提出复核，F=无复核，U=期限/受理权不明。F004/F043/F047；M016/M023；SRC-003/005/008。核决定 ID、身份、送达及可受理情形：成立 PASS_FACT（仅受理事实）；不符 CONFLICT→复核机关；校本期限未证 POLICY_UNCONFIRMED→有权机关确认；F=NOT_APPLICABLE。仅输出事实/待办建议；人工有权决定、政策现行性、签发记录不得推断为已批准。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "policyRefs": [],
  "stages": [
    {
      "id": "local-intake",
      "name": "本地材料与身份初核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "local-precheck"
    },
    {
      "id": "local-precheck",
      "name": "科研任务与经费事实预审",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "returnToStageId": "local-intake",
      "nextStageId": "local-referrals"
    },
    {
      "id": "local-referrals",
      "name": "采购、保密、预算及产权独立决定引用",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "returnToStageId": "local-precheck",
      "nextStageId": "local-summary"
    },
    {
      "id": "local-summary",
      "name": "人工确认事实报告与未决事项",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "returnToStageId": "local-referrals"
    }
  ],
  "outputs": [
    {
      "id": "fact-review",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-todos",
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

/** 来源、适用性与依赖索引只作研究追溯，不作为案卷材料或 PolicyVersion。 */
export const r02Metadata = {
  "templateId": "T03-T08",
  "name": "科研外协、技术合作及委托研究立项审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T03-T08.md",
  "sourceOriginalPath": "00_已完成模板研究稿/T03-T08_正式业务模板_MD_v1.0.md",
  "sourceDocumentSha256": "01592025bc49e56367fa6bd9e57f29f17db211d716a004ecc12d5a386b84453f",
  "sourceDocumentBytes": 64394,
  "officialSchoolTemplate": false,
  "researchEvidenceStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "authoringStatus": "RESEARCH_HANDOFF_READY",
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
    "SRC-011",
    "SRC-012",
    "SRC-013",
    "SRC-014",
    "SRC-015",
    "SRC-016",
    "SRC-017",
    "SRC-018"
  ],
  "criteria": [
    {
      "sectionId": "identity-scope",
      "criterionId": "R001",
      "fieldIds": [
        "F004",
        "F005",
        "F007"
      ],
      "materialSlotIds": [
        "m001"
      ],
      "srcIds": [
        "SRC-003",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "identity-scope",
      "criterionId": "R002",
      "fieldIds": [
        "F007",
        "F008",
        "F009"
      ],
      "materialSlotIds": [
        "m001"
      ],
      "srcIds": [
        "SRC-003",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "identity-scope",
      "criterionId": "R003",
      "fieldIds": [
        "F010",
        "F018",
        "F019",
        "F022"
      ],
      "materialSlotIds": [
        "m002",
        "m004"
      ],
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "humanDecisionRequired": false
    },
    {
      "sectionId": "identity-scope",
      "criterionId": "R004",
      "fieldIds": [
        "F019",
        "F020",
        "F021"
      ],
      "materialSlotIds": [
        "m003",
        "m004"
      ],
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "humanDecisionRequired": false
    },
    {
      "sectionId": "identity-scope",
      "criterionId": "R005",
      "fieldIds": [
        "F008",
        "F010",
        "F011",
        "F018"
      ],
      "materialSlotIds": [
        "m002",
        "m004",
        "m024"
      ],
      "srcIds": [
        "SRC-003",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "funding-counterparty",
      "criterionId": "R006",
      "fieldIds": [
        "F012",
        "F013",
        "F014",
        "F015",
        "F017",
        "F035"
      ],
      "materialSlotIds": [
        "m002",
        "m007",
        "m012"
      ],
      "srcIds": [
        "SRC-003",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "funding-counterparty",
      "criterionId": "R007",
      "fieldIds": [
        "F008",
        "F012",
        "F014",
        "F015",
        "F016"
      ],
      "materialSlotIds": [
        "m007"
      ],
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "funding-counterparty",
      "criterionId": "R008",
      "fieldIds": [
        "F024",
        "F031"
      ],
      "materialSlotIds": [
        "m005",
        "m010"
      ],
      "srcIds": [
        "SRC-004",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "humanDecisionRequired": false
    },
    {
      "sectionId": "funding-counterparty",
      "criterionId": "R009",
      "fieldIds": [
        "F019",
        "F025",
        "F026"
      ],
      "materialSlotIds": [
        "m004",
        "m006"
      ],
      "srcIds": [
        "SRC-004",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "humanDecisionRequired": false
    },
    {
      "sectionId": "funding-counterparty",
      "criterionId": "R010",
      "fieldIds": [
        "F024",
        "F028",
        "F029"
      ],
      "materialSlotIds": [
        "m005",
        "m008",
        "m009"
      ],
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "funding-counterparty",
      "criterionId": "R011",
      "fieldIds": [
        "F015",
        "F019",
        "F022",
        "F030"
      ],
      "materialSlotIds": [
        "m004",
        "m007"
      ],
      "srcIds": [
        "SRC-003",
        "SRC-011",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "humanDecisionRequired": false
    },
    {
      "sectionId": "contract-referrals",
      "criterionId": "R012",
      "fieldIds": [
        "F019",
        "F023",
        "F024",
        "F031",
        "F032"
      ],
      "materialSlotIds": [
        "m004",
        "m010"
      ],
      "srcIds": [
        "SRC-005",
        "SRC-008",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "humanDecisionRequired": false
    },
    {
      "sectionId": "contract-referrals",
      "criterionId": "R013",
      "fieldIds": [
        "F022",
        "F023",
        "F032"
      ],
      "materialSlotIds": [
        "m004",
        "m010"
      ],
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "humanDecisionRequired": false
    },
    {
      "sectionId": "contract-referrals",
      "criterionId": "R014",
      "fieldIds": [
        "F017",
        "F018",
        "F033",
        "F034"
      ],
      "materialSlotIds": [
        "m004",
        "m010",
        "m011"
      ],
      "srcIds": [
        "SRC-014",
        "SRC-015",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "contract-referrals",
      "criterionId": "R015",
      "fieldIds": [
        "F010",
        "F011",
        "F012",
        "F013",
        "F035"
      ],
      "materialSlotIds": [
        "m002",
        "m012",
        "m024"
      ],
      "srcIds": [
        "SRC-003",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "contract-referrals",
      "criterionId": "R016",
      "fieldIds": [
        "F036",
        "F037"
      ],
      "materialSlotIds": [
        "m013",
        "m025"
      ],
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "contract-referrals",
      "criterionId": "R017",
      "fieldIds": [
        "F038",
        "F039"
      ],
      "materialSlotIds": [
        "m010",
        "m014",
        "m025"
      ],
      "srcIds": [
        "SRC-004",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "authority-contract",
      "criterionId": "R018",
      "fieldIds": [
        "F006",
        "F041",
        "F042"
      ],
      "materialSlotIds": [
        "m016"
      ],
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "authority-contract",
      "criterionId": "R019",
      "fieldIds": [
        "F031",
        "F040"
      ],
      "materialSlotIds": [
        "m010",
        "m015"
      ],
      "srcIds": [
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "authority-contract",
      "criterionId": "R020",
      "fieldIds": [
        "F041",
        "F042",
        "F043"
      ],
      "materialSlotIds": [
        "m016"
      ],
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "authority-contract",
      "criterionId": "R021",
      "fieldIds": [
        "F031",
        "F043",
        "F044"
      ],
      "materialSlotIds": [
        "m010",
        "m017"
      ],
      "srcIds": [
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "authority-contract",
      "criterionId": "R022",
      "fieldIds": [
        "F024",
        "F027",
        "F044"
      ],
      "materialSlotIds": [
        "m005",
        "m017",
        "m018"
      ],
      "srcIds": [
        "SRC-003",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "performance-remedies",
      "criterionId": "R023",
      "fieldIds": [
        "F022",
        "F023",
        "F044",
        "F045"
      ],
      "materialSlotIds": [
        "m004",
        "m017",
        "m019"
      ],
      "srcIds": [
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL",
      "humanDecisionRequired": false
    },
    {
      "sectionId": "performance-remedies",
      "criterionId": "R024",
      "fieldIds": [
        "F045"
      ],
      "materialSlotIds": [
        "m019",
        "m020"
      ],
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "performance-remedies",
      "criterionId": "R025",
      "fieldIds": [
        "F031",
        "F035",
        "F043",
        "F044",
        "F046"
      ],
      "materialSlotIds": [
        "m021"
      ],
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "performance-remedies",
      "criterionId": "R026",
      "fieldIds": [
        "F002",
        "F043",
        "F044",
        "F046"
      ],
      "materialSlotIds": [
        "m022",
        "m023"
      ],
      "srcIds": [
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    },
    {
      "sectionId": "performance-remedies",
      "criterionId": "R027",
      "fieldIds": [
        "F004",
        "F043",
        "F047"
      ],
      "materialSlotIds": [
        "m016",
        "m023"
      ],
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "humanDecisionRequired": true
    }
  ]
} as const

export { templateVersion as template }
export default templateVersion
