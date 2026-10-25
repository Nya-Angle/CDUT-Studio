import type { TemplateVersion } from '@profer/shared'

// Mechanical transcription of the matching canonical Markdown's F/M/R tables.
// SRC references are research citations, never live Case SourceRefs.
export const templateVersion: TemplateVersion = {
  "templateId": "S05-T07",
  "version": 1,
  "schemaVersion": 2,
  "name": "学生代表大会及研究生代表大会代表提案提交、立案程序审核",
  "description": "本地研究模板 · 非校方正式模板。学生代表大会及研究生代表大会代表提案提交、立案程序审核；可核材料事实与流程差异，但具体校本标准、授权签发及最终决定待人工确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 已完成研究的本地资料模板，非成都理工大学正式发布；不得据此自动授予学分、成绩、奖励、干部评价或提案立案。",
  "objectType": "document",
  "displayName": {
    "template": "S05-T07 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · proposal_id",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F001：UUID，案卷/提交起；V3服务端不可变生成；M004；L1；必。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f002",
      "label": "F002 · assembly_id",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F002：字符串，届次/全程；本届公告及机构目录 M001；L1；权。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f003",
      "label": "F003 · assembly_type",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F003：enum 学代会/研代会，全程；M001，禁止凭学号猜测；L1；必。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f004",
      "label": "F004 · assembly_level",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F004：enum 校级/院级，全程；M001；L1；必。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f005",
      "label": "F005 · submission_window",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F005：时间区间+时区，提交；本届签发通知 M001；L1；配。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f006",
      "label": "F006 · received_at",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F006：时间戳，提交/受理；服务端接收事件 M004；L1；必。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f007",
      "label": "F007 · proposer_identity",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F007：主体ID，提交/撤回；认证会话+名册 M002；L2；权。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f008",
      "label": "F008 · enrollment_state",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F008：在校生与学段，提交；学籍权威只读 M003；L2；权。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f009",
      "label": "F009 · delegate_credential",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F009：资格ID+届次，提交；资格审查通过的名册 M002；L2；权。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f010",
      "label": "F010 · delegate_status",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F010：enum 正式/候选/列席/终止/未知；资格版本 M002；L2；权。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f011",
      "label": "F011 · cosigners",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F011：数组：代表ID、确认版本；联名确认 M006；非联名为空；L2；条。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f012",
      "label": "F012 · proposal_right_scope",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F012：委员会授权范围/阶段；M001/M002、本届规范；L1；配。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f013",
      "label": "F013 · title",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F013：文本，提案内容；M004；L1；必。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f014",
      "label": "F014 · grounds",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F014：文本，案由与问题事实；M004；L2；必。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f015",
      "label": "F015 · research_basis",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F015：调研事实及数据摘要；M005，允许匿名化/统计；L2/L3；条：规范要求充分调查，证据形式待本届配置。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f016",
      "label": "F016 · recommended_actions",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F016：文本，建议或措施；M004；L1；必。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f017",
      "label": "F017 · issue_units",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F017：议题结构/计数；M004正文的语义拆分；L1；必。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f018",
      "label": "F018 · topic_area",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F018：enum 教学/成长/服务/权益/其他；M004；仅路由提示；L1；必。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f019",
      "label": "F019 · school_jurisdiction",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F019：enum 内/外/混合/未知；M004/M005+学校职责依据；L1；条：委员会判断。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f020",
      "label": "F020 · policy_conflict_risk",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F020：冲突条款+证据版本；M004/M005+SRC-001/校本规范；L1；条：委员会判断。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f021",
      "label": "F021 · privacy_clearance",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F021：enum 清洁/需脱敏/疑侵权/未知；M007/M004；L3；条。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f022",
      "label": "F022 · submission_version",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F022：hash、sourceVersion、owner；M004/M005/M006等提交包；L1；必。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f023",
      "label": "F023 · committee_decision",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F023：enum 立案/不立案/退补/转建议/待定；签发决定 M009；L1；后。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f024",
      "label": "F024 · docket_id",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F024：立案号+决定版本；权威记录 M009；L1；后：仅立案。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f025",
      "label": "F025 · transfer_event",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F025：目标机构+时间+决定ID；M010；L1；后：已立案。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f026",
      "label": "F026 · department_route",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F026：处理部门/事项范围；M010/M011；L1；后：移交。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f027",
      "label": "F027 · response_state",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F027：受理/办理/答复+版本；M011；L1/L2；后。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f028",
      "label": "F028 · withdrawal_intent",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F028：撤回理由+目标版本；M012；L2；条。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f029",
      "label": "F029 · review_intent",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F029：程序性复核理由+原决定；M014；L2；条。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f030",
      "label": "F030 · target_version",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F030：materialId/runId/decisionId/version；服务端事件溯源，M008–M015；L1；必：发生二次事件。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f031",
      "label": "F031 · confidentiality_scope",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F031：查看/公开/存储范围；M007与当前制度；L3；条。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f032",
      "label": "F032 · local_rules_version",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F032：当届通知版本与生效区间；M001、可信配置；L1；配。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "M001 · 校团委/本届筹备组签发公告、征集通知、窗口、权限；可可信后台等效记录",
      "purpose": "研究材料槽 M001：校团委/本届筹备组签发公告、征集通知、窗口、权限；可可信后台等效记录；提交前校本配置；F002–F005/F012/F032；R001/R002/R005；SRC-001/003；未公开为 POLICY_UNCONFIRMED；权威接口断连为 SOURCE_UNAVAILABLE；版本绑定届次。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "校团委/本届筹备组签发公告、征集通知、窗口、权限；可可信后台等效记录",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "M002 · 资格委员会名册与通过结果，服务端签发记录替代证明扫描件",
      "purpose": "研究材料槽 M002：资格委员会名册与通过结果，服务端签发记录替代证明扫描件；提交/异议；F007/F009/F010；R003/R004/R006；SRC-001；后台不可取 SOURCE_UNAVAILABLE；影印表不可凭OCR认定正式。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "资格委员会名册与通过结果，服务端签发记录替代证明扫描件",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "M003 · 学籍权威记录，必要时向主管人工取证",
      "purpose": "研究材料槽 M003：学籍权威记录，必要时向主管人工取证；提交；F008；R003；SRC-001；接口不可用 SOURCE_UNAVAILABLE；不要求敏感整份学籍档案上传。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "学籍权威记录，必要时向主管人工取证",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "M004 · 提案人持有的案名、案由、建议、署名版本；如本届有格式要求则用本届表",
      "purpose": "研究材料槽 M004：提案人持有的案名、案由、建议、署名版本；如本届有格式要求则用本届表；提交及补件；F001/F006/F013/F014/F016–F018/F022；R007–R009/R015；SRC-001；缺全文 NEEDS_MATERIAL；损坏/模糊 UNREADABLE；每次重传新 sourceVersion。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "提案人持有的案名、案由、建议、署名版本；如本届有格式要求则用本届表",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "M005 · 提案人持有匿名调查、座谈摘要、公开数据，或可核的正文调研描述",
      "purpose": "研究材料槽 M005：提案人持有匿名调查、座谈摘要、公开数据，或可核的正文调研描述；提交按情形；F015/F019/F020；R010–R013；SRC-001/009；有效性及强制文件形态待校本配置；缺法定未证表格不能硬拒。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "提案人持有匿名调查、座谈摘要、公开数据，或可核的正文调研描述",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "M006 · 联名代表分别确认/受信任签章，不能由主提案人自填代签",
      "purpose": "研究材料槽 M006：联名代表分别确认/受信任签章，不能由主提案人自填代签；联名提交；F011；R006；SRC-001；未确认 NEEDS_MATERIAL；签名版本冲突 CONFLICT。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "联名代表分别确认/受信任签章，不能由主提案人自填代签",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "M007 · 提案人提供脱敏附件、必要授权证明或匿名统计；权威管理员限制访问",
      "purpose": "研究材料槽 M007：提案人提供脱敏附件、必要授权证明或匿名统计；权威管理员限制访问；涉敏感材料时；F021/F031；R014；SRC-001；无合法处理依据需人工保密处理，不能公开原件。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "提案人提供脱敏附件、必要授权证明或匿名统计；权威管理员限制访问",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "M008 · V3服务端保存逐规则审查所依材料及 Plan fingerprint",
      "purpose": "研究材料槽 M008：V3服务端保存逐规则审查所依材料及 Plan fingerprint；预审后；F022/F030；R015/R016；SRC-011/012；此前不存在不算缺件；不得覆盖老快照。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "V3服务端保存逐规则审查所依材料及 Plan fingerprint",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "M009 · 本届提案工作委员会签发文件/后台决定、理由、编号",
      "purpose": "研究材料槽 M009：本届提案工作委员会签发文件/后台决定、理由、编号；委员会审查完成后；F023/F024；R017/R018；SRC-001；预审时不需要；签发源失联 SOURCE_UNAVAILABLE。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "本届提案工作委员会签发文件/后台决定、理由、编号",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "M010 · 权益部门签发的分送对象、时间、承接记录",
      "purpose": "研究材料槽 M010：权益部门签发的分送对象、时间、承接记录；已立案后；F025/F026；R019；SRC-001；立案前 NOT_APPLICABLE；已过应办节点提醒有权人。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "权益部门签发的分送对象、时间、承接记录",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "M011 · 签发回复、反馈送达、后续进度",
      "purpose": "研究材料槽 M011：签发回复、反馈送达、后续进度；转办后；F027；R020；SRC-001/003/004；不许由AI编造“已解决”；不可读取 UNREADABLE。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "签发回复、反馈送达、后续进度",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "M012 · 提案人本人经过身份校验的撤回请求，目标提案/决定版本",
      "purpose": "研究材料槽 M012：提案人本人经过身份校验的撤回请求，目标提案/决定版本；任意被允许阶段；F028/F030；R021；SRC-001+本届配置；无申请则 NOT_APPLICABLE；合法阶段未知 POLICY_UNCONFIRMED。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "提案人本人经过身份校验的撤回请求，目标提案/决定版本",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "M013 · 已签发接受/拒绝及通知",
      "purpose": "研究材料槽 M013：已签发接受/拒绝及通知；撤回申请后；F023/F030；R022；本届细则待配；未来材料，不提前报缺。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "已签发接受/拒绝及通知",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "M014 · 本人对提交、资格、立案、送达程序的异议与原决定索引",
      "purpose": "研究材料槽 M014：本人对提交、资格、立案、送达程序的异议与原决定索引；争议触发；F029/F030；R023；SRC-001+校本待配；不等同处分申诉；复核入口未知 POLICY_UNCONFIRMED。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "本人对提交、资格、立案、送达程序的异议与原决定索引",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "M015 · 受信任复核主体签发的新决定、依据及版本",
      "purpose": "研究材料槽 M015：受信任复核主体签发的新决定、依据及版本；复核受理后；F030；R024；校本待配；未作出时 NEEDS_HUMAN_DECISION；不能套自动时限。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "受信任复核主体签发的新决定、依据及版本",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "M016 · 筹备组/提案工作委员会所作整体情况报告",
      "purpose": "研究材料槽 M016：筹备组/提案工作委员会所作整体情况报告；大会报告阶段；F025/F027；R025；SRC-001/005；当前提案提交时 NOT_APPLICABLE；公开前可仅记录汇总统计。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "筹备组/提案工作委员会所作整体情况报告",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "M017 · 提案人对问题码逐项改正文或权威后台修改回执",
      "purpose": "研究材料槽 M017：提案人对问题码逐项改正文或权威后台修改回执；退补阶段；F022/F030；R015/R016；SRC-001；不得无声替换 M004；生成新版本和关联理由。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "提案人对问题码逐项改正文或权威后台修改回执",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "eligibility",
      "name": "大会、代表资格与征集条件",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "R001 · 登记/提交：大会 ID、类型、层级相符。F002–F004；M001/M004；SRC-001/003",
          "requirement": "R02本地研究检查（非校方政策）：登记/提交：大会 ID、类型、层级相符。F002–F004；M001/M004；SRC-001/003；符合 PASS_FACT；不符 CONFLICT/路由另一大会；配置不明 POLICY_UNCONFIRMED→筹备组。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "R002 · 提交：接收时间在本届征集窗口内。F005/F006/F032；M001/M004；SRC-001/009（外校只启发）",
          "requirement": "R02本地研究检查（非校方政策）：提交：接收时间在本届征集窗口内。F005/F006/F032；M001/M004；SRC-001/009（外校只启发）；真 PASS_FACT；假 NEEDS_HUMAN_DECISION（逾期救济规则待配）；窗口未知 POLICY_UNCONFIRMED→筹备组。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "R003 · 提交：发起人当时在校生身份与指定学段匹配。F007/F008；M002/M003；SRC-001 第13/17条",
          "requirement": "R02本地研究检查（非校方政策）：提交：发起人当时在校生身份与指定学段匹配。F007/F008；M002/M003；SRC-001 第13/17条；真 PASS_FACT；假 CONFLICT/人工核身份；数据源断开 SOURCE_UNAVAILABLE→学籍主管/资格委员会。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "R004 · 提交：主提案人有本届正式代表资格。F009/F010；M002；SRC-001 第14/15/17条",
          "requirement": "R02本地研究检查（非校方政策）：提交：主提案人有本届正式代表资格。F009/F010；M002；SRC-001 第14/15/17条；真 PASS_FACT；候选/列席或终止 NEEDS_HUMAN_DECISION（同时建议 G08 分流）；资格不明 SOURCE_UNAVAILABLE→资格委员会。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "R005 · 提交：提案人资格所属届次、学院/校级范围与大会一致。F002–F004/F012；M001/M002；SRC-001 第2/37条",
          "requirement": "R02本地研究检查（非校方政策）：提交：提案人资格所属届次、学院/校级范围与大会一致。F002–F004/F012；M001/M002；SRC-001 第2/37条；真 PASS_FACT；明显异届 CONFLICT；本届授权范围不明 POLICY_UNCONFIRMED→筹备组。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "R006 · 联名提交：每个列出的联名人均为有效代表且各自确认版本一致。F011/F022；M002/M006；SRC-001 第15/34条",
          "requirement": "R02本地研究检查（非校方政策）：联名提交：每个列出的联名人均为有效代表且各自确认版本一致。F011/F022；M002/M006；SRC-001 第15/34条；真 PASS_FACT；单人提案 NOT_APPLICABLE；未确认 NEEDS_MATERIAL；相斥 CONFLICT；人数下限未知不作硬判→委员会。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "precheck",
      "name": "提案正文与形式审查",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r007",
          "title": "R007 · 提交：正文表单存在且可逐字段读取。F013/F014/F016/F022；M004；SRC-001 第35条",
          "requirement": "R02本地研究检查（非校方政策）：提交：正文表单存在且可逐字段读取。F013/F014/F016/F022；M004；SRC-001 第35条；真 PASS_FACT；缺文件 NEEDS_MATERIAL；损坏/无法解析 UNREADABLE→提案人。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "R008 · 提交：文本是否一事一案。F017/F013/F014；M004；SRC-001 第35条",
          "requirement": "R02本地研究检查（非校方政策）：提交：文本是否一事一案。F017/F013/F014；M004；SRC-001 第35条；一事 PASS_FACT；相互独立多个事项 NEEDS_HUMAN_DECISION（拆分/退补由委员会决定）；语义歧义同上→委员会。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "R009 · 提交：案名、案由、建议/措施三个核心项目有实质内容。F013/F014/F016；M004；SRC-001 第35条",
          "requirement": "R02本地研究检查（非校方政策）：提交：案名、案由、建议/措施三个核心项目有实质内容。F013/F014/F016；M004；SRC-001 第35条；齐备 PASS_FACT；字段空缺 NEEDS_MATERIAL；内容是否充分 NEEDS_HUMAN_DECISION→提案人/委员会。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "R010 · 征集/提交：具备可解释的同学意见征集与调查事实。F015；M005/M004；SRC-001 第33条",
          "requirement": "R02本地研究检查（非校方政策）：征集/提交：具备可解释的同学意见征集与调查事实。F015；M005/M004；SRC-001 第33条；正文叙述可识别 PASS_FACT；完全无调研陈述 NEEDS_HUMAN_DECISION；必须上传哪种调查附件未知 POLICY_UNCONFIRMED→委员会。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "R011 · 委员会审查：内容是否在学校可处理职权内。F019/F018；M004/M005；SRC-001 第35条（二）2、SRC-003",
          "requirement": "R02本地研究检查（非校方政策）：委员会审查：内容是否在学校可处理职权内。F019/F018；M004/M005；SRC-001 第35条（二）2、SRC-003；明确校内事项可形成事实提示 PASS_FACT；外部事项/交叉管辖 NEEDS_HUMAN_DECISION；校内权限资料缺 POLICY_UNCONFIRMED→委员会/学校部门。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "R012 · 委员会审查：提案具有群体公共性而非纯个人具体诉求。F014/F015/F019；M004/M005；SRC-001 第33/35条（二）3",
          "requirement": "R02本地研究检查（非校方政策）：委员会审查：提案具有群体公共性而非纯个人具体诉求。F014/F015/F019；M004/M005；SRC-001 第33/35条（二）3；多人意见线索 PASS_FACT；纯个人纠纷 NEEDS_HUMAN_DECISION+G08/S04 分流；证据不足 POLICY_UNCONFIRMED→委员会。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "R013 · 委员会审查：是否存在与可适用法规、政策或上级规章抵触的可定位条款。F020/F032；M004/M005/M001；SRC-001 第35条（二）1、SRC-002",
          "requirement": "R02本地研究检查（非校方政策）：委员会审查：是否存在与可适用法规、政策或上级规章抵触的可定位条款。F020/F032；M004/M005/M001；SRC-001 第35条（二）1、SRC-002；找到适用且无冲突证据只作 PASS_FACT 的核查范围声明；可疑冲突 NEEDS_HUMAN_DECISION；校规版次失明 POLICY_UNCONFIRMED→委员会/法务。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "R014 · 提交/转办：个人信息与敏感附件访问、公开范围是否合适。F021/F031；M004/M007；SRC-001/003",
          "requirement": "R02本地研究检查（非校方政策）：提交/转办：个人信息与敏感附件访问、公开范围是否合适。F021/F031；M004/M007；SRC-001/003；可合法脱敏 PASS_FACT；明显泄露风险 NEEDS_HUMAN_DECISION（限制访问、待办脱敏）；不需个人资料 NOT_APPLICABLE→数据保护负责人。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "R015 · 退补/提交：正本、附件、署名的 materialId/sourceVersion/归属一致。F001/F011/F022；M004/M005/M006/M017；SRC-011/012",
          "requirement": "R02本地研究检查（非校方政策）：退补/提交：正本、附件、署名的 materialId/sourceVersion/归属一致。F001/F011/F022；M004/M005/M006/M017；SRC-011/012；一致 PASS_FACT；不同版本或不同人材料 CONFLICT；文件损坏 UNREADABLE→提案人。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "R016 · 预审：所有被引用的权威证据都能够验证出处而非OCR推定。F009/F022/F032；M001/M002/M008；SRC-001/011",
          "requirement": "R02本地研究检查（非校方政策）：预审：所有被引用的权威证据都能够验证出处而非OCR推定。F009/F022/F032；M001/M002/M008；SRC-001/011；T0/T1可验证 PASS_FACT；只有截图或网络不可用 SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；不可读 UNREADABLE→资格/受理人员。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "resolution",
      "name": "委员会决定、转办与答复",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r017",
          "title": "R017 · 委员会完成审查：是否有真实有权立案/不立案决定。F023/F030；M009；SRC-001 第36条（一）",
          "requirement": "R02本地研究检查（非校方政策）：委员会完成审查：是否有真实有权立案/不立案决定。F023/F030；M009；SRC-001 第36条（一）；真实签发 PASS_FACT（仅“决定存在”事实）；未作出 NEEDS_HUMAN_DECISION；签发系统不可用 SOURCE_UNAVAILABLE→提案工作委员会。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "R018 · 立案完成：决定与 docket_id、对应提交版本、原因一致。F022–F024；M009/M008；SRC-001 第36条（一）",
          "requirement": "R02本地研究检查（非校方政策）：立案完成：决定与 docket_id、对应提交版本、原因一致。F022–F024；M009/M008；SRC-001 第36条（一）；一致 PASS_FACT；批准与编号相斥 CONFLICT；未立案 NOT_APPLICABLE；凭OCR号不可确认 SOURCE_UNAVAILABLE→委员会。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "R019 · 已立案：权益工作机构移交目标、接收记录关联正确决定版本。F024–F026；M009/M010；SRC-001 第36条（一）（二）",
          "requirement": "R02本地研究检查（非校方政策）：已立案：权益工作机构移交目标、接收记录关联正确决定版本。F024–F026；M009/M010；SRC-001 第36条（一）（二）；可核 PASS_FACT；未到移交阶段 NOT_APPLICABLE；误投/错版本 CONFLICT；已到期未转 NEEDS_HUMAN_DECISION→权益机构。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "R020 · 办理后：职能部门的回复与权益机构对代表反馈具有对应关系。F025–F027；M010/M011；SRC-001 第36条（二）（三）、SRC-004",
          "requirement": "R02本地研究检查（非校方政策）：办理后：职能部门的回复与权益机构对代表反馈具有对应关系。F025–F027；M010/M011；SRC-001 第36条（二）（三）、SRC-004；记录齐 PASS_FACT（不评价满意/完成）；办理中 NOT_APPLICABLE；回复与案号矛盾 CONFLICT；不能签收 NEEDS_HUMAN_DECISION→权益机构/部门。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "review",
      "name": "撤回、复核与大会报告",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "r021",
          "title": "R021 · 撤回申请：请求来自有权提案人且准确指向当前对象/阶段。F007/F028/F030；M002/M012；SRC-001+本届细则",
          "requirement": "R02本地研究检查（非校方政策）：撤回申请：请求来自有权提案人且准确指向当前对象/阶段。F007/F028/F030；M002/M012；SRC-001+本届细则；真 PASS_FACT（仅收到请求）；非本人 CONFLICT；是否允许撤回/截至时点未知 POLICY_UNCONFIRMED→委员会。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "R022 · 撤回处理：可信决定和撤回请求一一对应。F023/F028/F030；M012/M013；SRC-001+本届细则",
          "requirement": "R02本地研究检查（非校方政策）：撤回处理：可信决定和撤回请求一一对应。F023/F028/F030；M012/M013；SRC-001+本届细则；真 PASS_FACT；尚无决定 NEEDS_HUMAN_DECISION；不申请 NOT_APPLICABLE；跨届错引 CONFLICT→委员会/权益机构。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "R023 · 复核提出：异议有原决定引用和明确程序争点，且渠道存在。F029/F030；M009/M014；SRC-001+本届细则",
          "requirement": "R02本地研究检查（非校方政策）：复核提出：异议有原决定引用和明确程序争点，且渠道存在。F029/F030；M009/M014；SRC-001+本届细则；形式完整 PASS_FACT；缺原决定 NEEDS_MATERIAL；校本是否开放/时限未知 POLICY_UNCONFIRMED→指定复核主体。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "R024 · 复核办结：复核结果源自授权主体，且不覆盖原决定审计链。F023/F029/F030；M014/M015；SRC-001+本届细则",
          "requirement": "R02本地研究检查（非校方政策）：复核办结：复核结果源自授权主体，且不覆盖原决定审计链。F023/F029/F030；M014/M015；SRC-001+本届细则；真实签发 PASS_FACT；无决定 NEEDS_HUMAN_DECISION；权威源不可取 SOURCE_UNAVAILABLE→复核主体。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "R025 · 大会报告：提案立案及反馈汇总有可核案卷对照。F024–F027；M009–M011/M016；SRC-001 第36条（三）（四）、SRC-005",
          "requirement": "R02本地研究检查（非校方政策）：大会报告：提案立案及反馈汇总有可核案卷对照。F024–F027；M009–M011/M016；SRC-001 第36条（三）（四）、SRC-005；可核 PASS_FACT；报告未进入阶段 NOT_APPLICABLE；汇总与单案矛盾 CONFLICT→提案工作委员会。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "route",
      "name": "事项路由与材料分类",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "facts"
    },
    {
      "id": "facts",
      "name": "逐项事实预审与定向补件",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "policy"
    },
    {
      "id": "policy",
      "name": "政策有效性、争议与权限人工复核",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "nextStageId": "handoff"
    },
    {
      "id": "handoff",
      "name": "向有权办理者交接建议与证据",
      "kind": "handoff",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "feedback",
      "kind": "item-feedback",
      "audience": "student"
    },
    {
      "id": "supplements",
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

export const r02Metadata = {
  "templateId": "S05-T07",
  "name": "学生代表大会及研究生代表大会代表提案提交、立案程序审核",
  "sourceDocPath": "docs/design/review-agent/business-templates/R02/S05-T07.md",
  "sourceDocSha256": "6ac61cfb27de6946afd0bd1385ccdb8dcff493411c2e414cb849de835852f806",
  "originalResearchPath": "ChatGPT Library:/S05-T07_正式业务模板_MD_v1.0.md",
  "originalResearchSha256": "6ac61cfb27de6946afd0bd1385ccdb8dcff493411c2e414cb849de835852f806",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
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
  "materialSlotIds": [
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
    "M017"
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "共青团中央办公厅、全国学联秘书处：中青办联发〔2021〕3号《普通高等学校学生（研究生）代表大会工作规定》",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.gqt.org.cn/xxgk/tngz_gfxwj/other_tngz/202210/t20221012_790004.htm"
      ],
      "scopeNote": "第2、12–17、20、22、33–37、40条；代表资格、提案一事一案、不予立案、委员会职责和替代2017旧规；2021年发布，2022年官方汇集页可访问；适用普通高校学代会/研代会；无检索到取代此规定的更新正式全文（不表示穷尽）；GENERAL-RESEARCH（现行上位规范原文，非成理个别届次细则）"
    },
    {
      "id": "SRC-002",
      "title": "中华全国学生联合会：《中华全国学生联合会章程》",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://qgxl.youth.cn/xljj/xlzc/202507/t20250711_16111252.htm"
      ],
      "scopeNote": "2025年7月3日修订，组织定位、会员权利与治理框架；不含某校具体提案表单门槛；2025-07-11官方发布，2026-10-24查阅；全国学联组织规范；GENERAL-RESEARCH（现行全国学联章程）"
    },
    {
      "id": "SRC-003",
      "title": "成都理工大学：《成都理工大学章程》",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://www.cdut.edu.cn/info/1366/7658.htm"
      ],
      "scopeNote": "学校《章程》第四十五条学生代表大会制度；校长相关职权中组织处理学生代表大会有关行政工作的提案；学校官网官方页面已检索到正文片段；完整本届执行细则及是否有后续修订待核；CURRENTITY-UNKNOWN（校本制度依据，细则效力待核）"
    },
    {
      "id": "SRC-004",
      "title": "成都理工大学研究生院：第六次研代会提案工作交流布置会",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://gra.cdut.edu.cn/info/1018/5659.htm"
      ],
      "scopeNote": "2026-01-09会议，研究生代表及多个职能部门围绕提案落实交流；涉及研判、落实、反馈；2026-01-12公开，官方检索摘要核实，网页直接打开暂报错；仅作2026年实践存在性证据；CDUT-VERIFIED（仅公开事件，不是立案规则）"
    },
    {
      "id": "SRC-005",
      "title": "成都理工新闻网：第十四次学代会、第四次研代会会议报道",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://news.cdut.edu.cn/info/1004/46505.htm"
      ],
      "scopeNote": "两会听取并审议提案工作报告；证明代表提案报告阶段真实存在；2023年前后历史大会，官网可检索；不可推定本届表单和时限；CURRENTITY-UNKNOWN（校本历史实践）"
    },
    {
      "id": "SRC-006",
      "title": "成都理工大学物理学院：第一次学代会/研代会预备会议",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://cop.cdut.edu.cn/info/1703/5106.htm"
      ],
      "scopeNote": "审议资格审查报告、听取学代会与研代会提案工作报告；历史学院实践；不是全校统一细则；CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-007",
      "title": "成都理工大学计算机与网络安全学院：第八次学代会代表团报道",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://cist.cdut.edu.cn/info/1141/1897.htm"
      ],
      "scopeNote": "代表调研同学意见形成提案的历史实践；历史报道；不能外推所有本届代表须采用的调研形式；CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-008",
      "title": "成都理工大学机电工程学院：第二次学代会/研代会",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://mee.cdut.edu.cn/info/1050/2023.htm"
      ],
      "scopeNote": "报道提案审查报告及代表资格审查报告；历史学院实践；本届学校具体委员会设置待核；CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-009",
      "title": "华中师范大学政治与国际关系学院：2026年双代会提案征集通知",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://politics.ccnu.edu.cn/info/1288/16483.htm"
      ],
      "scopeNote": "二至六部分；本院提案委员会、调研说明、附件表格、逐级征集；2026-06-01，本院特定届次；任何“一人至少一份”或日期不得用于成都理工；CROSS-SCHOOL-REFERENCE"
    },
    {
      "id": "SRC-010",
      "title": "青岛科技大学团委：2025年代表选举及提案通知",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://gqt.qust.edu.cn/info/1037/9117.htm"
      ],
      "scopeNote": "第二部分；提案登记/汇总表、类别、分送和办复；2025-11-06，青科大第28/7次大会，不得继受其名额、时间、附件；CROSS-SCHOOL-REFERENCE"
    },
    {
      "id": "SRC-011",
      "title": "R02 原始候选目录（文件库整合包内）",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [],
      "scopeNote": "S05-T07 固定名称/ID，S05-T04/T05/T06 与 G50 分界；2026-10-22，项目内部范围设计证据，不是学校政策；GENERAL-RESEARCH"
    },
    {
      "id": "SRC-012",
      "title": "R02 范围审查记录（文件库整合包内）",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [],
      "scopeNote": "“新增提案”独立于 G08 公共诉求、T07-T08 教代会提案；G03/G04/G07 不重审批；2026-10-22，内部规划版本，不可作为行政裁量依据；GENERAL-RESEARCH"
    }
  ],
  "criteria": [
    {
      "sectionId": "eligibility",
      "criterionId": "r001",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F002",
        "F003",
        "F004"
      ],
      "materialSlotIds": [
        "M001",
        "M004"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "eligibility",
      "criterionId": "r002",
      "srcIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F005",
        "F006",
        "F032"
      ],
      "materialSlotIds": [
        "M001",
        "M004"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "eligibility",
      "criterionId": "r003",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F007",
        "F008"
      ],
      "materialSlotIds": [
        "M002",
        "M003"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "eligibility",
      "criterionId": "r004",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F009",
        "F010"
      ],
      "materialSlotIds": [
        "M002"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "eligibility",
      "criterionId": "r005",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002",
        "F003",
        "F004",
        "F012"
      ],
      "materialSlotIds": [
        "M001",
        "M002"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "eligibility",
      "criterionId": "r006",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F011",
        "F022"
      ],
      "materialSlotIds": [
        "M002",
        "M006"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "precheck",
      "criterionId": "r007",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F013",
        "F014",
        "F016",
        "F022"
      ],
      "materialSlotIds": [
        "M004"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "precheck",
      "criterionId": "r008",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F013",
        "F014",
        "F017"
      ],
      "materialSlotIds": [
        "M004"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "precheck",
      "criterionId": "r009",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F013",
        "F014",
        "F016"
      ],
      "materialSlotIds": [
        "M004"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "precheck",
      "criterionId": "r010",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F015"
      ],
      "materialSlotIds": [
        "M004",
        "M005"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "precheck",
      "criterionId": "r011",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F018",
        "F019"
      ],
      "materialSlotIds": [
        "M004",
        "M005"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "precheck",
      "criterionId": "r012",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F014",
        "F015",
        "F019"
      ],
      "materialSlotIds": [
        "M004",
        "M005"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "precheck",
      "criterionId": "r013",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F020",
        "F032"
      ],
      "materialSlotIds": [
        "M001",
        "M004",
        "M005"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "precheck",
      "criterionId": "r014",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F021",
        "F031"
      ],
      "materialSlotIds": [
        "M004",
        "M007"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "precheck",
      "criterionId": "r015",
      "srcIds": [
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F001",
        "F011",
        "F022"
      ],
      "materialSlotIds": [
        "M004",
        "M005",
        "M006",
        "M017"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "precheck",
      "criterionId": "r016",
      "srcIds": [
        "SRC-001",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F009",
        "F022",
        "F032"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M008"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "resolution",
      "criterionId": "r017",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F023",
        "F030"
      ],
      "materialSlotIds": [
        "M009"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "resolution",
      "criterionId": "r018",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F022",
        "F023",
        "F024"
      ],
      "materialSlotIds": [
        "M008",
        "M009"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "resolution",
      "criterionId": "r019",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F024",
        "F025",
        "F026"
      ],
      "materialSlotIds": [
        "M009",
        "M010"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "resolution",
      "criterionId": "r020",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F025",
        "F026",
        "F027"
      ],
      "materialSlotIds": [
        "M010",
        "M011"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "review",
      "criterionId": "r021",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F007",
        "F028",
        "F030"
      ],
      "materialSlotIds": [
        "M002",
        "M012"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "review",
      "criterionId": "r022",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F023",
        "F028",
        "F030"
      ],
      "materialSlotIds": [
        "M012",
        "M013"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "review",
      "criterionId": "r023",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F029",
        "F030"
      ],
      "materialSlotIds": [
        "M009",
        "M014"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "review",
      "criterionId": "r024",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F023",
        "F029",
        "F030"
      ],
      "materialSlotIds": [
        "M014",
        "M015"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "review",
      "criterionId": "r025",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F024",
        "F025",
        "F026",
        "F027"
      ],
      "materialSlotIds": [
        "M009",
        "M010",
        "M011",
        "M016"
      ],
      "policyOrAuthorityGate": true
    }
  ]
} as const
