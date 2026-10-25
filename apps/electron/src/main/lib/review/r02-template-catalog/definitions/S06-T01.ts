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
  "templateId": "S06-T01",
  "version": 1,
  "schemaVersion": 2,
  "name": "大学生创新训练计划立项、中期、结项全过程审核",
  "description": "本地研究模板 · 非校方正式模板。用于整理事实、证据版本、问题与待人工复核事项；不代替成都理工大学或赛事/实践主管机关作出正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板为本地研究模板，非校方正式模板；当前政策证据状态为 PARTIAL，未经有权部门确认不得作为正式审批依据。",
  "objectType": "project",
  "displayName": {
    "template": "{{F007}} · {{F003}}"
  },
  "fields": [
    {
      "key": "F001",
      "label": "临时申请键",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F001：string 临时申请键；原始阶段/缺失语义：Application・申报至正式立项前；来源与证据位置：经办受理/可信案卷生成，非项目官方号。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F002",
      "label": "正式项目编号",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F002：string? 正式项目编号；原始阶段/缺失语义：Project・正式立项后；来源与证据位置：学校/省/国家正式名单或台账。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F003",
      "label": "年度和批次",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F003：string 年度和批次；原始阶段/缺失语义：BatchPolicy・申报及各阶段；来源与证据位置：本年度校方通知/项目台账。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F004",
      "label": "项目类型",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F004：enum 项目类型；原始阶段/缺失语义：Project/Application・申报；来源与证据位置：2026 校方当期类别及上位定义。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F005",
      "label": "项目级别",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F005：enum 项目级别；原始阶段/缺失语义：Project/Application・申报/升格；来源与证据位置：当期通知与正式立项。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F006",
      "label": "一般/重点领域等项目类别",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F006：enum? 一般/重点领域等项目类别；原始阶段/缺失语义：BatchPolicy/Project・适用申报；来源与证据位置：当期通知/官方推荐名单。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F007",
      "label": "项目名称",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F007：string 项目名称；原始阶段/缺失语义：Application/Project・全阶段；来源与证据位置：申请陈述→正式项目台账定版。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F008",
      "label": "研究内容/技术路径",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F008：text 研究内容/技术路径；原始阶段/缺失语义：Application・申报及正式任务更新；来源与证据位置：申请书和获批任务书，学术质量由专家。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F009",
      "label": "建设目标与预期成果",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F009：list/text 建设目标与预期成果；原始阶段/缺失语义：Application/StageReport・申报、结题比较；来源与证据位置：正式批准的计划目标，申请时为自陈。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F010",
      "label": "资助性质/来源",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F010：string? 资助性质/来源；原始阶段/缺失语义：Project・立项后及经费分支；来源与证据位置：官方立项/资助文件、财务权威结论。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F011",
      "label": "本次认证操作主体",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F011：id 本次认证操作主体；原始阶段/缺失语义：Application/EvidenceRef・每次提交；来源与证据位置：受信任 Host/Main/身份服务。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F012",
      "label": "负责人校内身份",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F012：list<id,name> 负责人校内身份；原始阶段/缺失语义：PersonRole・申请及每阶段；来源与证据位置：校方学籍/项目台账核对，不仅上传姓名。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F013",
      "label": "学段、学制、入学年级、在读/毕业/休复学与生效日",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F013：record 学段、学制、入学年级、在读/毕业/休复学与生效日；原始阶段/缺失语义：PersonRole・资格、跨学段/结题；来源与证据位置：学籍主管权威记录。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F014",
      "label": "项目归属学院",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F014：id 项目归属学院；原始阶段/缺失语义：Project/PersonRole・全阶段；来源与证据位置：受理主管学院和正式项目台账。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F015",
      "label": "同学年在研参与/主持事实",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F015：list<project-ref> 同学年在研参与/主持事实；原始阶段/缺失语义：PersonRole・立项资格；来源与证据位置：校级项目台账（可得时），不得仅凭自报做否决。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F016",
      "label": "团队名单、角色与人数（含主持人）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F016：list<member-id,role> 团队名单、角色与人数（含主持人）；原始阶段/缺失语义：PersonRole・申报、变更、结题；来源与证据位置：申报版与有效项目/变更决定；人数按校方同批类型规则。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F017",
      "label": "指导教师真实身份",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F017：id 指导教师真实身份；原始阶段/缺失语义：PersonRole・申报至结题；来源与证据位置：校方人事/任职及项目台账。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F018",
      "label": "有效导师指导/本人同意关系",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F018：record/bool? 有效导师指导/本人同意关系；原始阶段/缺失语义：PersonRole・提交、变更；来源与证据位置：导师经认证的意见/官方项目关系。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F019",
      "label": "申请/阶段提交时间",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F019：datetime 申请/阶段提交时间；原始阶段/缺失语义：Application/StageReport・每次提交；来源与证据位置：可信接收回执，不用文档内手填日期。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F020",
      "label": "当前申报书及提交版本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F020：string/hash 当前申报书及提交版本；原始阶段/缺失语义：EvidenceRef・立项/补件；来源与证据位置：接收文件哈希与版本链。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F021",
      "label": "适用窗口/截止时间",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F021：datetime/interval? 适用窗口/截止时间；原始阶段/缺失语义：BatchPolicy・申报/公示/结题；来源与证据位置：当期通知原文或正式延期公告。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F022",
      "label": "院级评审主体/授权",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F022：list<actor,authority> 院级评审主体/授权；原始阶段/缺失语义：Decision・学院评审；来源与证据位置：学院评审组织正式记录。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F023",
      "label": "学院初审/推荐及公示结果",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F023：enum+ref 学院初审/推荐及公示结果；原始阶段/缺失语义：Decision・院评完成后；来源与证据位置：学院签发原件及公示。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F024",
      "label": "学校拟立项/复核状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F024：enum+ref 学校拟立项/复核状态；原始阶段/缺失语义：Decision・学校推荐阶段；来源与证据位置：教务处/创新创业学院公示/决定。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F025",
      "label": "省/国家级审核/公布状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F025：enum+ref 省/国家级审核/公布状态；原始阶段/缺失语义：Decision・对应项目级别立项后；来源与证据位置：省教育部门/教育部权威公布/备案。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F026",
      "label": "正式项目状态和有效期限",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F026：enum+dates 正式项目状态和有效期限；原始阶段/缺失语义：Project・立项生效后；来源与证据位置：学校/上级项目台账与签发文书。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F027",
      "label": "获批建设任务版本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F027：string/hash 获批建设任务版本；原始阶段/缺失语义：Project・获批后至结题；来源与证据位置：学校确认的任务/计划。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F028",
      "label": "中期检查期及实际进度",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F028：record 中期检查期及实际进度；原始阶段/缺失语义：StageReport・到中期时；来源与证据位置：负责人报告+学院/导师评价，分来源。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F029",
      "label": "经费使用和预算差异事实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F029：record 经费使用和预算差异事实；原始阶段/缺失语义：StageReport・有经费时中期/结项；来源与证据位置：财务/项目权威记录优先于自述。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F030",
      "label": "申请变更对象与前后值",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F030：enum+diff 申请变更对象与前后值；原始阶段/缺失语义：Project/Application・变更发起；来源与证据位置：项目负责人申请及原有效项目版本。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F031",
      "label": "变更/延期/终止决定与生效",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F031：enum+ref 变更/延期/终止决定与生效；原始阶段/缺失语义：Decision・变更审定后；来源与证据位置：有权学校机构正式审批。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F032",
      "label": "结题报告项目实施事实",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F032：record 结题报告项目实施事实；原始阶段/缺失语义：StageReport・结题申请；来源与证据位置：项目负责人陈述，需与过程/计划对照。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F033",
      "label": "结题成果主张及项目关联",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F033：list<evidence-ref> 结题成果主张及项目关联；原始阶段/缺失语义：StageReport・结题申请；来源与证据位置：成果简表/原件与 G06 等外部权威记录。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F034",
      "label": "院级结题汇总/答辩意见",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F034：record+ref 院级结题汇总/答辩意见；原始阶段/缺失语义：Decision・院级验收后；来源与证据位置：学院正式专家记录和汇总。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F035",
      "label": "学校最终验收结论",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F035：enum+ref 学校最终验收结论；原始阶段/缺失语义：Decision・学校正式验收后；来源与证据位置：学校有效签发结题通知/台账。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F036",
      "label": "省/国结项备案与公布",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F036：enum+ref 省/国结项备案与公布；原始阶段/缺失语义：Decision・按级别需要时；来源与证据位置：省厅/教育部正式备案/公布。政策相关选项和必填条件未确认时不得固化为拒绝条件。",
      "displayHint": "源模板标注为枚举/分类字段；选项依当期有效原文确认，本实现不固化未证选项。"
    },
    {
      "key": "F037",
      "label": "补件、撤回与更正请求状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F037：record 补件、撤回与更正请求状态；原始阶段/缺失语义：Application・任一申请阶段；来源与证据位置：已认证提交与受理机关回执。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F038",
      "label": "异议对象、理由与结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F038：record 异议对象、理由与结果；原始阶段/缺失语义：Appeal・公示/验收后；来源与证据位置：申请人提交及有权机关后续决定。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F039",
      "label": "证据版本/归属链",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F039：list<hash,version,issuer,time> 证据版本/归属链；原始阶段/缺失语义：EvidenceRef・每一阶段；来源与证据位置：文件内容、收件回执、权威签发来源。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F040",
      "label": "G50/S/T 外部权威结果",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F040：list<decision-ref> G50/S/T 外部权威结果；原始阶段/缺失语义：EvidenceRef・仅涉及相邻事项时；来源与证据位置：外部已核有权机关决定及版本。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F041",
      "label": "跨级别/更名项目权威关联",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "源字段 F041：list<link-ref> 跨级别/更名项目权威关联；原始阶段/缺失语义：Project・升格、同名/改名时；来源与证据位置：学校/省/国正式项目映射。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    },
    {
      "key": "F042",
      "label": "签发机构、签发人及阶段授权",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "源字段 F042：record 签发机构、签发人及阶段授权；原始阶段/缺失语义：Decision・每一正式意见/决定；来源与证据位置：学校机构授权/签章及签发台账。政策相关选项和必填条件未确认时不得固化为拒绝条件。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 创新训练项目的申请主张",
      "purpose": "创新训练项目的申请主张；学生负责人；当期创新类申报书；2025 校本有同名表，2026 内容未取",
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
        "创新训练项目的申请主张",
        "学生负责人",
        "当期创新类申报书",
        "2025 校本有同名表"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 真实学籍、姓名/学号/学段",
      "purpose": "真实学籍、姓名/学号/学段；学校学籍主管；学籍权威查询结果、已核验在读证明",
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
        "真实学籍、姓名/学号/学段",
        "学校学籍主管",
        "学籍权威查询结果、已核验在读证明"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 · 当前成员/导师关系、本人参与事实",
      "purpose": "当前成员/导师关系、本人参与事实；团队/导师与学校台账；当前申请书内团队导师栏及经认证同意/项目关系记录",
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
        "当前成员/导师关系、本人参与事实",
        "团队/导师与学校台账",
        "当前申请书内团队导师栏及经认证同意/项目关系记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 · 学院初评、专家评分/质询",
      "purpose": "学院初评、专家评分/质询；学院评审组；学院评审记录/答辩表和审定记录",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "学院初评、专家评分/质询",
        "学院评审组",
        "学院评审记录/答辩表和审定记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 · 学院推荐/公示/异议窗口",
      "purpose": "学院推荐/公示/异议窗口；学院；推荐名单、学院公示和异议处理记录",
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
        "学院推荐/公示/异议窗口",
        "学院",
        "推荐名单、学院公示和异议处理记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 · 学校拟立项/校级推荐状态",
      "purpose": "学校拟立项/校级推荐状态；学校主管部门；教务处/创新创业学院校级拟立项公告",
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
        "学校拟立项/校级推荐状态",
        "学校主管部门",
        "教务处/创新创业学院校级拟立项公告"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "M007 · 正式立项及项目号/期限",
      "purpose": "正式立项及项目号/期限；学校有权机关；立项批复、正式学校名单/项目台账",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "正式立项及项目号/期限",
        "学校有权机关",
        "立项批复、正式学校名单/项目台账"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "M008 · 省/国项目正式状态、备案",
      "purpose": "省/国项目正式状态、备案；相应上级机关；教育部/省厅正式名单、备案/公布",
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
        "省/国项目正式状态、备案",
        "相应上级机关",
        "教育部/省厅正式名单、备案/公布"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 · 批准后的研究任务和成果基线",
      "purpose": "批准后的研究任务和成果基线；学校/项目组；获批任务书、计划书或最终申报版本",
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
        "批准后的研究任务和成果基线",
        "学校/项目组",
        "获批任务书、计划书或最终申报版本"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 中期进度和问题",
      "purpose": "中期进度和问题；项目负责人；中期报告/进展汇报，2026 表名未证",
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
        "中期进度和问题",
        "项目负责人",
        "中期报告/进展汇报",
        "2026 表名未证"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 项目实际进展支撑",
      "purpose": "项目实际进展支撑；团队/研究记录持有人；实验记录、调查纪要、原型照片、研究数据等",
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
        "项目实际进展支撑",
        "团队/研究记录持有人",
        "实验记录、调查纪要、原型照片、研究数据等"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 中期导师/学院评议结论",
      "purpose": "中期导师/学院评议结论；导师/学院；中期核验意见、专家评议或检查记录",
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
        "中期导师/学院评议结论",
        "导师/学院",
        "中期核验意见、专家评议或检查记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 · 资助性质及批准预算",
      "purpose": "资助性质及批准预算；学校/财务/项目；资助通知、经核预算与任务经费表",
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
        "资助性质及批准预算",
        "学校/财务/项目",
        "资助通知、经核预算与任务经费表"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 实施中经费使用事实",
      "purpose": "实施中经费使用事实；财务权威与负责人说明；财务凭证索引/支出汇总/项目自述，分层标记",
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
        "实施中经费使用事实",
        "财务权威与负责人说明",
        "财务凭证索引/支出汇总/项目自述",
        "分层标记"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 负责人/成员/导师/内容/期限/终止请求",
      "purpose": "负责人/成员/导师/内容/期限/终止请求；项目负责人；变更、延期、终止申请及前后差异，校本表名未证",
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
        "负责人/成员/导师/内容/期限/终止请求",
        "项目负责人",
        "变更、延期、终止申请及前后差异",
        "校本表名未证"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 导师、学院对变更的审查意见",
      "purpose": "导师、学院对变更的审查意见；导师/学院；本人审核、学院审查表/意见",
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
        "导师、学院对变更的审查意见",
        "导师/学院",
        "本人审核、学院审查表/意见"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 · 变更/延期/终止是否生效",
      "purpose": "变更/延期/终止是否生效；学校有权部门；正式审批文书/项目状态变更记录",
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
        "变更/延期/终止是否生效",
        "学校有权部门",
        "正式审批文书/项目状态变更记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "M018 · 创新类结题实施陈述",
      "purpose": "创新类结题实施陈述；项目负责人；《成都理工大学大学生创新训练计划项目结题报告书（创新类）》",
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
        "创新类结题实施陈述",
        "项目负责人",
        "《成都理工大学大学生创新训练计划项目结题报告书（创新类）》"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "M019 · 创新类成果条目与归属主张",
      "purpose": "创新类成果条目与归属主张；项目负责人；《成都理工大学大学生创新训练计划项目结题成果简表（创新类）》",
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
        "创新类成果条目与归属主张",
        "项目负责人",
        "《成都理工大学大学生创新训练计划项目结题成果简表（创新类）》"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "M020 · 证明结题成果及研究过程",
      "purpose": "证明结题成果及研究过程；项目组/成果权威单位；成果原件、报告、数据/照片/登记、论文等支撑",
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
        "证明结题成果及研究过程",
        "项目组/成果权威单位",
        "成果原件、报告、数据/照片/登记、论文等支撑"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "M021 · 结题项目汇总、批次归属",
      "purpose": "结题项目汇总、批次归属；文法通知列作报送项，填表主体未核；《2024年大学生创新训练计划项目结题项目汇总表》",
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
        "结题项目汇总、批次归属",
        "文法通知列作报送项",
        "填表主体未核",
        "《2024年大学生创新训练计划项目结题项目汇总表》"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "M022 · 结题答辩和专家评价",
      "purpose": "结题答辩和专家评价；学院/专家；结题答辩记录、评阅/会议意见",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "结题答辩和专家评价",
        "学院/专家",
        "结题答辩记录、评阅/会议意见"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "M023 · 学校正式结题结果",
      "purpose": "学校正式结题结果；学校有权机构；学校审核/结题发文或权威台账",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "学校正式结题结果",
        "学校有权机构",
        "学校审核/结题发文或权威台账"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "M024 · 国创/省级结题上报备案或公布",
      "purpose": "国创/省级结题上报备案或公布；上级主管机关；教育部/省厅结题验收公布/备案记录",
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
        "国创/省级结题上报备案或公布",
        "上级主管机关",
        "教育部/省厅结题验收公布/备案记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "M025 · 补件、更正理由及差异",
      "purpose": "补件、更正理由及差异；原提交人；补充文件、修订说明、受理回执/版本映射",
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
        "补件、更正理由及差异",
        "原提交人",
        "补充文件、修订说明、受理回执/版本映射"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "M026 · 提交撤回请求及是否被受理",
      "purpose": "提交撤回请求及是否被受理；合法申请人/受理机关；撤回申请及后续回执、审批结果",
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
        "提交撤回请求及是否被受理",
        "合法申请人/受理机关",
        "撤回申请及后续回执、审批结果"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "M027 · 异议/申诉对象和理由",
      "purpose": "异议/申诉对象和理由；合资格异议人；书面异议、结题申诉、原决定及新证据",
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
        "异议/申诉对象和理由",
        "合资格异议人",
        "书面异议、结题申诉、原决定及新证据"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "M028 · 正式复核/异议处理结论",
      "purpose": "正式复核/异议处理结论；有权受理机关；处理回执、复核决定/维持或变更的文书",
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
        "正式复核/异议处理结论",
        "有权受理机关",
        "处理回执、复核决定/维持或变更的文书"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "M029 · G06/G07/G03/G05 及相邻 S/T 的独立结论",
      "purpose": "G06/G07/G03/G05 及相邻 S/T 的独立结论；各独立业务的有效决定引用/证据索引",
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
        "G06/G07/G03/G05 及相邻 S/T 的独立结论",
        "各独立业务的有效决定引用/证据索引"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M030",
      "name": "M030 · 创业训练/创业实践申请事实",
      "purpose": "创业训练/创业实践申请事实；学生负责人；当期创业类申报书，2025 校本有名称但2026 原件未读",
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
        "创业训练/创业实践申请事实",
        "学生负责人",
        "当期创业类申报书",
        "2025 校本有名称但2026 原件未读"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M031",
      "name": "M031 · 创业类结题报告事实",
      "purpose": "创业类结题报告事实；学生负责人；《成都理工大学大学生创新训练计划项目结题报告书（创业类）》",
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
        "创业类结题报告事实",
        "学生负责人",
        "《成都理工大学大学生创新训练计划项目结题报告书（创业类）》"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M032",
      "name": "M032 · 证明跨级别升格/更名/项目编号映射",
      "purpose": "证明跨级别升格/更名/项目编号映射；学校及上级；正式项目关系、推荐升级批文或历史项目映射",
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
        "证明跨级别升格/更名/项目编号映射",
        "学校及上级",
        "正式项目关系、推荐升级批文或历史项目映射"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M033",
      "name": "M033 · 证实签发与代理权限",
      "purpose": "证实签发与代理权限；学校人事、学籍/机构授权源；学生授权、教师任职、专家任命、学院/学校签发机关证据",
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
        "证实签发与代理权限",
        "学校人事、学籍/机构授权源",
        "学生授权、教师任职、专家任命、学院/学校签发机关证据"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M034",
      "name": "M034 · 当期可适用规则、材料和窗口",
      "purpose": "当期可适用规则、材料和窗口；归口校方；当前年度/batch 官网通知、附件版本及校本制度；已见计网学院 2026 首批正文，附件/修订另核",
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
        "当期可适用规则、材料和窗口",
        "归口校方",
        "当前年度/batch 官网通知、附件版本及校本制度",
        "已见计网学院 2026 首批正文"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "application-and-project-identity",
      "name": "申报、学院评议和正式立项",
      "description": "来自原始模板第08节规则分组。每条规则对应原始 R ID；SRC 仅为研究来源索引，不是案卷 SourceRef。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "当前批次政策适用性",
          "requirement": "原文第08节规则 R001。T：任一 A01–A10；F：明确非此批次→NA；U：政策时效/来源不明→P/S；SRC-001/002/003/005/009/014；F003–F006/F021；M034；将机关、适用年、学院、类型、级别、窗口同真实项目逐维比较；同范围确证可 PASS_FACT。旧年度条件强加给新批次→P；有效通知冲突→C；学院经办、学校政策归口人。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "申请/项目唯一身份",
          "requirement": "原文第08节规则 R002。T：建案、跨阶段关联、升格；F：无关联事件→NA；U：官方映射缺→S；SRC-002/006/010；F001–F003/F005/F007/F014/F041；M001/M007/M008/M032；申请键或正式号+年度/级别/学院核对；同名不能合案。官方跨级关系已证→PASS_FACT，项目身份两证冲突→C；学校项目台账经办。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "可信提交人、代理与签发授权",
          "requirement": "原文第08节规则 R003。T：提交/代理/正式签发；F：无相关主体行为→NA；U：认证/授权源不可得→S/H；SRC-001/002/003；F011/F012/F017/F022/F042；M002/M033；会话主体与学生、导师、评审者、签发机关、阶段授权分别验证；前端 actor、teacher 标志、扫描签名不授予权限。身份冲突→C；代理范围无现行依据→P；学籍/人事授权经办、实际签发机关。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "负责人学籍及学段事实",
          "requirement": "原文第08节规则 R004。T：A01 资格或 A10 身份变化；F：无相关事项→NA；U：学籍台账缺→S、适用范围/例外未知→P；SRC-001/003/009/014；F003–F005/F012–F015；M001/M002/M034；核申报日学籍、学制、入学级、在读状态和学院。仅计网学院 2026 第一批且同时匹配类别/级别可对照 3.3 年级；吻合→PASS_FACT。确实不在列明年级时记录带条款的资格疑问并交学院 NEEDS_HUMAN_DECISION，不制造第九个“FAIL”码，也不由模型作不予立项决定；适用范围/例外未知 P，学号异人 C；不移植 2022/2025 数值；学籍主管、学院资格审核人。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "团队及导师本人关系、人数事实",
          "requirement": "原文第08节规则 R005。T：团队申报/变更；F：该类额外材料不适用→NA；U：官方关系或本批人数门槛未证→S/P；SRC-001/003/014；F003–F005/F013/F016–F018；M001/M002/M003/M033/M034；对成员本校身份、导师任职与本人意见及名单版本；计网学院 2026 第一批可按创新≤10/其他≤15（均含主持人）对照 F016，其中校/省创新类负责人和成员都应按 SRC-003 的学制/入学级对照 F013，其余类别不得错套成员年级。超员/年级差异→列条款交学院 NEEDS_HUMAN_DECISION，而非 AI 自行拒绝；其他学院门槛 P、官方名单冲突 C、学术质量 H；导师、学院项目管理员。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R006",
          "title": "五类本批分类与申报级别路由",
          "requirement": "原文第08节规则 R006。T：A01/A09 或申请改类别；F：另有独立授权目的→NA/转对应 S06/G；U：当期表式、类别的实际教育项目属性未知→P；SRC-001/002/003/006/012/013/014；F003–F006；M001/M030/M034；SRC-003 计网 2026 首批列五类，教育部 SRC-001 三类为上位分类，不能机械等同竞赛。已核 R02 的大创立项—中期—结项归 S06-T01；创业孵化/创业扶持/竞赛本身分别归 S06-T07/T08/T02/T03。创新类用 M001，创业类按当期确证表式选 M030；产业命题/红色筑梦不得硬分派 M030。类别与批次矛盾→C，审批仍归校方；当期学院受理、R02 目录主管。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "申报书题名、目标及内容存在性",
          "requirement": "原文第08节规则 R007。T：A01 已需提交当期申请；F：未达提交节点→NA；U：表式要求未知→P，已确定必需而未交→N；SRC-001/003/014；F007–F009/F020；M001/M030/M034；检查当前申请版本的题名、研究内容与目标可读且互相一致；内容齐全可 PASS_FACT、缺 N、扫描糊 U；创新性和可行性须专家 H；负责人、学院专家。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "可信提交时间和窗口",
          "requirement": "原文第08节规则 R008。T：申请/补件已接收且同批时限已证；F：本阶段不须提交→NA；U：2026 时限未核→P；SRC-002/003/005/014；F003/F019/F021；M001/M030/M025/M034；仅用可信接收事件比对本院本批有效截止/延长决定，不能跨用 2025 文法 04-11 或结题 05-08；逾期是否受理是 H，不自动否决；学院受理机构。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "学院评审/推荐证据与授权",
          "requirement": "原文第08节规则 R009。T：A02 评审已发生；F：尚未评审→NA；U：学院记录不可取→S；SRC-002/004/006；F022/F023/F042；M004/M005/M033；查项目申请版、专家组织授权、评审及推荐归属；只证明“已评/已推荐”可 PASS_FACT；评分优劣与回避是 H，记录对象不符 C；学院评审组织。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "学校拟立项公示与推荐关系",
          "requirement": "原文第08节规则 R010。T：A03 拟名单已发布；F：尚未公示→NA；U：官网不可达→S；SRC-002/003/004/006；F003–F005/F021/F023/F024；M005/M006/M034；对学校拟名单与院推荐按项目、批次比较；拟名单事实 PASS_FACT 不写 F026。仅 SRC-003 所指计网第一批校省创新院级推荐核对公示是否至少 3 个工作日（按有效校历/公休日核），不向其他院级别复制；实际起止/修订源未知 P，名单互相矛盾 C；公示异议实质 H；创新创业学院/教务处。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "正式立项与上级记录的效力",
          "requirement": "原文第08节规则 R011。T：声称正式立项或进入执行；F：仅询问尚未批准的拟立项状态→NA；U：声称已批准而批文失联→S，要求上级何种批复不明→P；SRC-001/002/010；F002/F005/F025/F026/F042；M006/M007/M008/M033；分级核学校正式批准、上级所需公布/备案、文书和生效日；能证权威文书存在可 PASS_FACT（仅事实）。若自称已获批，不能因只见 M006 就判 NA 并掩盖缺失 M007；无证应 S/H。两份正式决定不一致 C，备案要求不明 P；学校项目主管及相应上级机关。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "升级、改名、跨批次重复关系",
          "requirement": "原文第08节规则 R012。T：主张升格/更名/跨批关联；F：无该事项→NA；U：官方连续映射未取→S；SRC-002/006/010；F002/F003/F007/F041；M007/M008/M032；查两侧项目号、级别、年度和有权批准的映射；同题不等于同案，未证的重复申报限制 P/H；关联已证可 PASS_FACT，矛盾 C；学校项目台账、资格审查人。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "implementation-and-closeout",
      "name": "执行、中期、变更、结题",
      "description": "来自原始模板第08节规则分组。每条规则对应原始 R ID；SRC 仅为研究来源索引，不是案卷 SourceRef。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "R013",
          "title": "已批准目标和计划基线版本",
          "requirement": "原文第08节规则 R013。T：有效立项后执行/结题；F：未批准→NA；U：学校确认版缺失→S/P；SRC-001/005；F008/F009/F026/F027；M001/M007/M009；由有权确认的项目任务版对照原申请；学校若未另签任务书，需其认可的最终申请快照，不能从草稿替代。版本一致可 PASS_FACT、对不上 C，研究内容价值 H；学校项目经办、指导教师。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R014",
          "title": "中期触发及进度报告事实",
          "requirement": "原文第08节规则 R014。T：正式项目且当期中期已启动；F：尚未启动或不用→NA；U：2026 中期要求未知→P；SRC-001/008/009；F021/F026–F028；M009/M010/M011/M034；对进度、目标和当期形成的记录比对项目、日期、内容；必交报告缺 N、不可读 U、与批准目标矛盾 C。不得使用外校百分比或论文阈值判不通过；负责人、学院中期检查经办。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "中期导师/学院评议来源",
          "requirement": "原文第08节规则 R015。T：导师/学院确已中期评议；F：未评→NA；U：已签原件失联→S；SRC-001/008；F017/F018/F028/F042；M010/M012/M033；核受评报告版与指导/学院有权评价人；只能证明“已评”可 PASS_FACT，不能 AI 创设“合格”等级；意见冲突 C、学术评价 H；指导教师、学院评审组。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R016",
          "title": "资助预算、经费使用与财务权限",
          "requirement": "原文第08节规则 R016。T：项目有经费且当期要求披露；F：确无此类义务→NA；U：财务源缺 S、政策缺 P；SRC-001/002/008/011；F010/F029/F040；M013/M014/M029；预算/资助批复、财务凭证、自述分来源核数与项目号；一致仅为事实 PASS_FACT，矛盾 C；“已支出”不等于 G07 报销批准，付款裁量 H 且归 G07；财务/G07 权威 Owner、学校项目经办。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "变更/延期/终止请求与拟改差异",
          "requirement": "原文第08节规则 R017。T：真实 A05 申请；F：无申请→NA；U：变更允许范围/期限未知→P；SRC-001/009；F026/F030/F039；M009/M015/M034；对原有效状态和拟改导师、成员、期限、任务做字段差分；请求确收可 PASS_FACT，申请缺 N/不可读 U；能否准许 H，不据历史 2022 条款硬判；负责人、导师、学院受理。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "变更意见及正式生效决定",
          "requirement": "原文第08节规则 R018。T：声称已审核/批准变更；F：尚待审批→NA（决定子项）；U：有权文书失联→S；SRC-001/009；F017/F018/F026/F031/F042；M015/M016/M017/M033；分别核导师/学院意见与学校正式决定、签发范围、生效版本；可证有权文书存在为 PASS_FACT，意见不等于已生效，未知校本例外 H/P，版本冲突 C；无 M017 不改 F026；导师、学院审查人、学校有权审批人。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "当期结题资格、阶段和期限事实",
          "requirement": "原文第08节规则 R019。T：正式项目进入适用结题批次；F：不在批次/尚未到期→NA；U：本院结题范围未核→P；SRC-001/005/009；F002/F003/F021/F026/F027；M007/M009/M034；SRC-005 仅适用文法学院 2026 年对 2024 年已立项且期满项目；查项目号、学校有效期限和批次通知。跨院/提前结题要求 P/H，不将 05-08 截止推广；学院结题经办、学校项目主管。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "创新或创业结题报告及实施陈述",
          "requirement": "原文第08节规则 R020。T：A06 且当期须报；F：未到结题或非该类别→NA；U：当期表单版不明→P；SRC-001/005；F004/F007/F032/F039；M018/M031/M034；创新类用 M018、适用创业类用 M031；核题名、项目、执行事实、版本；可追溯一致→PASS_FACT，缺 N、OCR 损 U、张冠李戴 C，质量 H；项目负责人、学院结题秘书。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "结题成果主张、原件与权属引用",
          "requirement": "原文第08节规则 R021。T：已触发成果提交或团队声称成果；F：无此类槽→NA；U：数量/类型标准不明→P；SRC-001/005/007/011；F009/F033/F040；M019/M020/M029；SRC-005 指定创新类的 M019 与支撑 M020 逐项核项目、日期、批准目标；遗漏 N、不可读 U、跨项目归属 C。原创性/贡献 H；G06 确权只读 M029，不能用专利标题直接确权；负责人、学院专家、G06 权威 Owner。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R022",
          "title": "学院结题汇总与答辩评阅",
          "requirement": "原文第08节规则 R022。T：学院已经组织当期验收；F：仅提交尚未评→NA；U：汇总责任未知 P、已成记录失联 S；SRC-005/007；F003/F034/F042；M021/M022/M033；对结题批次、汇总表、项目号、报告版、专家签认比对；“已答辩/有意见”可 PASS_FACT，评分和通过与否由专家/校方 H。M021 实际填报责任未证，不误派学生；学院结题组织、真实汇总责任人。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "学校验收决定与上级备案状态",
          "requirement": "原文第08节规则 R023。T：声称学校已结题或该级应备案；F：学院答辩后学校尚未决定→NA；U：有权决定失联→S；SRC-001/005/010；F026/F035/F036/F042；M022/M023/M024/M033；分离学院意见、学校审核、上级所需公布/备案；经核正式文书可 PASS_FACT（仅证存在及归属），不创造“结题通过”。是否必须上级备案 P；两个有效结论冲突 C；学校结题签发者、按级别上级机关。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "changes-and-record-integrity",
      "name": "补件、撤回、复核、外部权限和版本",
      "description": "来自原始模板第08节规则分组。每条规则对应原始 R ID；SRC 仅为研究来源索引，不是案卷 SourceRef。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "R024",
          "title": "补件、更正和影响定位",
          "requirement": "原文第08节规则 R024。T：认证过的材料补充/替换；F：无补件→NA；U：原版来源/归属不明→C/S；SRC-003/005；F019/F020/F037/F039；M001/M018/M019/M025；对旧/新收件时间、哈希、内容、提交主体、变动字段做差分；版本链可核 PASS_FACT，已交但损坏 U、真正缺 N；相关旧事实检查失效，按 11.3 定向重审，不自动撤销真实决定；原提交人、案卷经办。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "撤回请求及受理效力",
          "requirement": "原文第08节规则 R025。T：有撤回当前申请/变更请求；F：无撤回→NA；U：主体资格、节点、受理规则不明→P；SRC-001/002/005；F011/F019/F037/F042；M026/M033/M034；核认证申请人、目标申请/版本、提交时间、机关回执；只证“已请求撤回”可 PASS_FACT，不能当“已撤销正式立项”；收到冲突回执 C，准许与否 H；申请人、原受理机关与有权批准者。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "异议、复核与针对的原决定",
          "requirement": "原文第08节规则 R026。T：公示异议或国创结题申诉；F：无异议→NA；U：期限/受理机关资格未知→P；SRC-001/002；F021/F038/F039/F042；M006/M023/M027/M028；绑定原文书 ID/版本、异议人、事实证据与受理回执；教育部第 19 条仅证国创结题异议可向学校有关部门提出，不填本校时限；复核源缺 S、实质结论 H。旧决定待新有权决定才可能改变；申诉人、学校有权受理及复核人。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "G50 与邻接 S/T 权威决定引用",
          "requirement": "原文第08节规则 R027。T：成果权属、经费报销、场地、出行、竞赛或创业扶持等独立授权实际相关；F：不涉及→NA；U：目录已映射但具体 G50 接口/本校签发关系未证→P/S；SRC-001/011/012/013；F029/F033/F040；M020/M029/M034；先按已核 R02 S06-T02–T08、G03/G04/G05/G06/G07 等目的路由，查外部业务对象、有效决定 ID、签发机关、状态/版本/本案关联；只证“已引用”可 PASS_FACT，不重做邻项决定。外部冲突 C、源不可取 S；G05 国内个人学术出行覆盖缺口保留待目录负责人裁定；对应外部业务 Owner、本项目归口人。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R028",
          "title": "任意材料的来源、可读、归属和版本",
          "requirement": "原文第08节规则 R028。T：某 M 槽已交或已被权威查询；F：本阶段该槽不适用→NA；U：归属及来源不可识别→C/S；SRC-001/002/005/011（通用方法背景；特定槽须继承 07.2 的专属 SRC）；F001/F002/F039/F042；M001–M034；留原件、来源机关、收件事件、哈希、页/段、发出时间和项目号；可读且归属可核才 PASS_FACT，绝不代表该 M 的材料义务或政策阈值已被验证。损坏 U、两有权版本冲突 C、官方源失联 S。后传旧文件不会变成新文书；上传人、项目数据经办、真实签发机关。如当期政策、签发权限、受理时限或例外未证实，必须保留未知/人工复核，不得将缺证据转为自动正式通过或拒绝。",
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
      "name": "申请准备",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "B"
    },
    {
      "id": "B",
      "name": "学院初审及评审推荐状态核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "C"
    },
    {
      "id": "C",
      "name": "学校复核与上级立项链证据核对",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "D"
    },
    {
      "id": "D",
      "name": "获准后执行及中期",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "E"
    },
    {
      "id": "E",
      "name": "项目变更/延期/终止申请核验（条件支线）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "F",
      "skippableReason": "仅发生变更/延期/终止时进入；未发生时记录本阶段不适用。"
    },
    {
      "id": "F",
      "name": "结题申请与验收材料核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "G"
    },
    {
      "id": "G",
      "name": "学校决定引用、异议/复核与归档（本地转交）",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "skippableReason": "仅存在正式决定、异议/复核或归档触发时办理；不得自动形成终局决定。"
    }
  ],
  "outputs": [
    {
      "id": "fact-check-record",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "current-stage-supplements",
      "kind": "supplement-list",
      "audience": "student"
    },
    {
      "id": "authorized-decision-referral",
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
  "templateId": "S06-T01",
  "name": "大学生创新训练计划立项、中期、结项全过程审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S06-T01.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/S06-T01.md",
  "sourceDocumentBytes": 152015,
  "sourceDocumentSha256": "1fb3ea68b71d2778e0a4f63bbf80b14d0d33333034f08b1f1f70784e1edd05a0",
  "officialSchoolTemplate": false,
  "researchEvidenceStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "auditedAt": "2026-10-24",
  "criteria": [
    {
      "sectionId": "application-and-project-identity",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "当前批次政策适用性"
    },
    {
      "sectionId": "application-and-project-identity",
      "criterionId": "R002",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "申请/项目唯一身份"
    },
    {
      "sectionId": "application-and-project-identity",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "可信提交人、代理与签发授权"
    },
    {
      "sectionId": "application-and-project-identity",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "负责人学籍及学段事实"
    },
    {
      "sectionId": "application-and-project-identity",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "团队及导师本人关系、人数事实"
    },
    {
      "sectionId": "application-and-project-identity",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "五类本批分类与申报级别路由"
    },
    {
      "sectionId": "application-and-project-identity",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "申报书题名、目标及内容存在性"
    },
    {
      "sectionId": "application-and-project-identity",
      "criterionId": "R008",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "可信提交时间和窗口"
    },
    {
      "sectionId": "application-and-project-identity",
      "criterionId": "R009",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "学院评审/推荐证据与授权"
    },
    {
      "sectionId": "application-and-project-identity",
      "criterionId": "R010",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "学校拟立项公示与推荐关系"
    },
    {
      "sectionId": "application-and-project-identity",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "正式立项与上级记录的效力"
    },
    {
      "sectionId": "application-and-project-identity",
      "criterionId": "R012",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "升级、改名、跨批次重复关系"
    },
    {
      "sectionId": "implementation-and-closeout",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "已批准目标和计划基线版本"
    },
    {
      "sectionId": "implementation-and-closeout",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "中期触发及进度报告事实"
    },
    {
      "sectionId": "implementation-and-closeout",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "中期导师/学院评议来源"
    },
    {
      "sectionId": "implementation-and-closeout",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "资助预算、经费使用与财务权限"
    },
    {
      "sectionId": "implementation-and-closeout",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "变更/延期/终止请求与拟改差异"
    },
    {
      "sectionId": "implementation-and-closeout",
      "criterionId": "R018",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "变更意见及正式生效决定"
    },
    {
      "sectionId": "implementation-and-closeout",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "当期结题资格、阶段和期限事实"
    },
    {
      "sectionId": "implementation-and-closeout",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "创新或创业结题报告及实施陈述"
    },
    {
      "sectionId": "implementation-and-closeout",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "结题成果主张、原件与权属引用"
    },
    {
      "sectionId": "implementation-and-closeout",
      "criterionId": "R022",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "学院结题汇总与答辩评阅"
    },
    {
      "sectionId": "implementation-and-closeout",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "学校验收决定与上级备案状态"
    },
    {
      "sectionId": "changes-and-record-integrity",
      "criterionId": "R024",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "补件、更正和影响定位"
    },
    {
      "sectionId": "changes-and-record-integrity",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "撤回请求及受理效力"
    },
    {
      "sectionId": "changes-and-record-integrity",
      "criterionId": "R026",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "异议、复核与针对的原决定"
    },
    {
      "sectionId": "changes-and-record-integrity",
      "criterionId": "R027",
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
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "G50 与邻接 S/T 权威决定引用"
    },
    {
      "sectionId": "changes-and-record-integrity",
      "criterionId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceRuleTitle": "任意材料的来源、可读、归属和版本"
    }
  ]
}
