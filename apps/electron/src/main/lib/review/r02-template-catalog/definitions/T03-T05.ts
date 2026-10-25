import type { TemplateVersion } from '@profer/shared'

/** R02 research-only runtime projection; not a CDUT official template or policy version. */
export const templateVersion: TemplateVersion = {
  "templateId": "T03-T05",
  "version": 1,
  "schemaVersion": 2,
  "name": "科研项目研究内容、成员、负责人及期限变更审核",
  "description": "本地研究模板 · 非校方正式模板。适用于“科研项目研究内容、成员、负责人及期限变更审核”的材料、事实与风险核对；政策适用、校内授权及正式决定均须由有权人员确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板。来源文档 docs/design/review-agent/business-templates/R02/T03-T05.md；源文档 SHA-256 8cca697876de2e3f81be88f43db546e96b077cd15b542dee0ae62508f0f26e5e；政策证据状态 PARTIAL；不得将 SRC 研究来源伪装为案卷 SourceRef 或正式 PolicyVersion。",
  "objectType": "project",
  "displayName": {
    "template": "{{f002}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "项目批准号/编号",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“项目批准号/编号”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f002",
      "label": "资助机关、科研计划与项目类别",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“资助机关、科研计划与项目类别”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f003",
      "label": "立项年度、资助批次/专项子类",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“立项年度、资助批次/专项子类”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f004",
      "label": "项目/课题/专题层级及父级号 struct",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“项目/课题/专题层级及父级号 struct”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f005",
      "label": "学校是牵头/承担/参与单位",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“学校是牵头/承担/参与单位”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f006",
      "label": "当前正式任务书/合同标识 ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“当前正式任务书/合同标识 ref”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f007",
      "label": "基线版本与历史有效批件链 ref[]",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“基线版本与历史有效批件链 ref[]”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f008",
      "label": "当前基线生效日",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“当前基线生效日”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f009",
      "label": "批准研究方向、任务概要 text/ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“批准研究方向、任务概要 text/ref”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f010",
      "label": "批准研究目标/考核指标 structured-text",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“批准研究目标/考核指标 structured-text”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f011",
      "label": "现有效项目成员名册和角色 person-ref[]",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“现有效项目成员名册和角色 person-ref[]”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f012",
      "label": "当前批准负责人及其层级 person-ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“当前批准负责人及其层级 person-ref”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f013",
      "label": "当前有效执行截止日",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“当前有效执行截止日”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f014",
      "label": "已批准的延期次数与时长 list",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“已批准的延期次数与时长 list”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f015",
      "label": "当前项目状态",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“当前项目状态”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f016",
      "label": "保密/特殊限制标识",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“保密/特殊限制标识”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f017",
      "label": "发起者真实身份 actor-ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“发起者真实身份 actor-ref”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f018",
      "label": "发起资格",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“发起资格”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f019",
      "label": "代理授权范围、有效期和委托人 ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“代理授权范围、有效期和委托人 ref”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f020",
      "label": "拟变更类型集合",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“拟变更类型集合”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f021",
      "label": "申请号/提交版本/对象关联 id+version",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“申请号/提交版本/对象关联 id+version”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f022",
      "label": "变更原因及拟生效时间 text+date?",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“变更原因及拟生效时间 text+date?”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f023",
      "label": "研究内容修改前后对照 diff/ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“研究内容修改前后对照 diff/ref”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f024",
      "label": "研究方向/目标/指标影响声明 text+impact",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“研究方向/目标/指标影响声明 text+impact”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f025",
      "label": "拟增减/替换人员与原角色 person-diff[]",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“拟增减/替换人员与原角色 person-diff[]”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f026",
      "label": "拟任人员资格/可任职证明索引 ref[]",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“拟任人员资格/可任职证明索引 ref[]”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f027",
      "label": "原任/拟任/成员知情、任务交接记录 ref[]",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“原任/拟任/成员知情、任务交接记录 ref[]”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f028",
      "label": "拟延期截止日/期限修订",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“拟延期截止日/期限修订”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f029",
      "label": "延期理由和后续实施计划 text/ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“延期理由和后续实施计划 text/ref”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f030",
      "label": "申请日期、适用截止规则/比较结果",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“申请日期、适用截止规则/比较结果”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f031",
      "label": "负责人不可履职的必要事实摘要 restricted-ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“负责人不可履职的必要事实摘要 restricted-ref”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f032",
      "label": "学院/科研单位初核签发事件 decision-ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“学院/科研单位初核签发事件 decision-ref”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f033",
      "label": "专家论证、评审意见 review-ref",
      "kind": "boolean",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“专家论证、评审意见 review-ref”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f034",
      "label": "校内有权审核/备案决定 decision-ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“校内有权审核/备案决定 decision-ref”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f035",
      "label": "上级批准/备案决定 decision-ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“上级批准/备案决定 decision-ref”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f036",
      "label": "生效后的正式任务书/补充件 doc-ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“生效后的正式任务书/补充件 doc-ref”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f037",
      "label": "办理状态与回执（受理/备案/批准区分）enum+ref",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“办理状态与回执（受理/备案/批准区分）enum+ref”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f038",
      "label": "撤回请求、事实复核与正式救济关联 event-ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“撤回请求、事实复核与正式救济关联 event-ref”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f039",
      "label": "来源、原件页码、哈希、版本/替换链 provenance[]",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“来源、原件页码、哈希、版本/替换链 provenance[]”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f040",
      "label": "跨 G50/S/T 有权结论引用 external-decision-ref[]",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“跨 G50/S/T 有权结论引用 external-decision-ref[]”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "项目立项和权威台账",
      "purpose": "项目立项和权威台账；科研归口/资助机关；立项决定、批准号、项目登记记录；锁项目计划、批准号、层级、牵头/参与状态；P0 当；优先校内授权台账/主管系统，未开放接口可由档案部门核档；不强制负责人重交；F001–F005,F015 / SRC-001,002,004；绑定项目号/主管机关/档案版；源失联 SU，异号 CF；锁项目计划、批准号、层级、牵头/参与状态；P0 当；优先校内授权台账/主管系统，未开放接口可由档案部门核档；不强制负责人重交；F001–F005,F015 / SRC-001,002,004",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "项目立项和权威台账",
        "主管机关",
        "负责人",
        "授权"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m002",
      "name": "当前有效任务书/合同",
      "purpose": "当前有效任务书/合同；科研部门或主管机关；正式签章件/受信档案记录；给出研究方向、指标、成员、负责人和期限的真实基线；P0 当；如平台权威任务书可核则不用重复扫描上传；F004,F006–F013 / SRC-001,002,004,010；原批准版本为主材料；读不清 UR，无法识别生效版本 SU/HD，涉密不进普通通道；给出研究方向、指标、成员、负责人和期限的真实基线；P0 当；如平台权威任务书可核则不用重复扫描上传；F004,F006–F013 / SRC-001,002,004,010",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "当前有效任务书/合同",
        "主管机关",
        "负责人",
        "版本",
        "签章"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m003",
      "name": "历次已批准变更/延期链",
      "purpose": "历次已批准变更/延期链；主管机关/校科研档案；批件、备案回执、历史任务书；确认此前修订与延期次数、最新生效日；P0 条（有历史变更或无法确定当前有效版本）；权威系统历史记录可替代复印件；F007,F008,F013–F015 / SRC-002,005,006,010,012；每份批件绑定自己的项目层级与生效日；源缺 SU，不能断言延期次数为 0；确认此前修订与延期次数、最新生效日；P0 条（有历史变更或无法确定当前有效版本）；权威系统历史记录可替代复印件；F007,F008,F013–F015 / SRC-002,005,006,010,012",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "历次已批准变更/延期链",
        "主管机关",
        "版本",
        "任务书"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m004",
      "name": "变更申请及说明",
      "purpose": "变更申请及说明；现任负责人/有权单位；申请书、线上正式申请记录或签署申请函；表明拟变更类型、理由、申请者与申请版本；P1 当；正式主管系统申请记录可替代另填纸件；学校表单样式待确认；F017,F020–F022,F030 / SRC-001,002,005,006,007；属 ChangeApplication 版本；缺申请 NM，不强制先有批复；表明拟变更类型、理由、申请者与申请版本；P1 当；正式主管系统申请记录可替代另填纸件；学校表单样式待确认；F017,F020–F022,F030 / SRC-001,002,005,006,007",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "变更申请及说明",
        "负责人",
        "版本",
        "签署"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m005",
      "name": "研究方案前后对照",
      "purpose": "研究方案前后对照；项目负责人；拟修订计划/差异说明；指出哪段研究任务变更及其与原任务书的关系；P1 条（C01/C02/复合含内容）；可在 M004 明确列示的对照内完成，无需重复独立附件；F009,F023 / SRC-001,002,010,011；对应 ChangeItem 与 M002 章节；缺明细 NM，读取失败 UR；指出哪段研究任务变更及其与原任务书的关系；P1 条（C01/C02/复合含内容）；可在 M004 明确列示的对照内完成，无需重复独立附件；F009,F023 / SRC-001,002,010,011",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "研究方案前后对照",
        "负责人",
        "任务书",
        "附件"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m006",
      "name": "研究方向和指标影响说明",
      "purpose": "研究方向和指标影响说明；负责人/有权责任单位；对照陈述/目标矩阵；支持备案或重大调整分流，非自动判科学合理；P1 条（内容变化影响方向/指标）；可用 M004/M005 同一材料的可定位段落替代；F010,F024 / SRC-001,002,010,011；绑定指标版本及事项；若难以判断重大性→HD 而非自动准/驳；支持备案或重大调整分流，非自动判科学合理；P1 条（内容变化影响方向/指标）；可用 M004/M005 同一材料的可定位段落替代；F010,F024 / SRC-001,002,010,011",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "研究方向和指标影响说明",
        "负责人",
        "版本"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m007",
      "name": "成员/负责人增减对照",
      "purpose": "成员/负责人增减对照；负责人/牵头单位；名单和角色对照/主管系统申请；确认拟改变的是哪位人、何种角色与层级；P1 条（C03/C04/C05）；任务书现有名册＋申请差异足够时无需重表；F011,F012,F025 / SRC-002,010,011,013；每个参与人用可信人员引用；仅姓名相同→CF/HD；确认拟改变的是哪位人、何种角色与层级；P1 条（C03/C04/C05）；任务书现有名册＋申请差异足够时无需重表；F011,F012,F025 / SRC-002,010,011,013",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "成员/负责人增减对照",
        "负责人",
        "任务书",
        "成员"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m008",
      "name": "拟任负责人资格佐证",
      "purpose": "拟任负责人资格佐证；拟任人/科研归口/人事单位；资质、任职与履历的必要证明；核实计划指定资格及承接项目能力的前置事实；P1 条（C05 等且计划要求）；优先引用人事/项目资格正式结论，不索取不必要隐私扫描；F026 / SRC-002,010,013；对人及计划类别，不跨项目无条件复用；条件未知 PU；核实计划指定资格及承接项目能力的前置事实；P1 条（C05 等且计划要求）；优先引用人事/项目资格正式结论，不索取不必要隐私扫描；F026 / SRC-002,010,013",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "拟任负责人资格佐证",
        "负责人"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m009",
      "name": "当事人知情与同意",
      "purpose": "当事人知情与同意；原/拟任负责人、增减成员与所属单位；确认记录/签章文件；核事项交接和同意，防代签；P1/P4 条，仅当计划/学校有效表单实际要求时；经授权平台本人确认可替代纸签；科发院曾公布国基金参与人同意书但附件未读；F025,F027 / SRC-002（专题同意）,010,011,016,019；逐个签署人、被变更人、时间、项目版本关联；验证不了签名 HD，不能凭发布页猜签名字段；核事项交接和同意，防代签；P1/P4 条，仅当计划/学校有效表单实际要求时；经授权平台本人确认可替代纸签；科发院曾公布国基金参与人同意书但附件未读；F025,F027 / SRC-002（专题同意）,010,011,016,019",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "当事人知情与同意",
        "负责人",
        "版本",
        "时间",
        "签章"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m010",
      "name": "人事身份、离岗或无法履职事实",
      "purpose": "人事身份、离岗或无法履职事实；人事部门/责任单位；正式状态/必要证明；提供负责人替换及代理申请的客观前提；P1 条（C05/C14 且规则触发）；优先人事有权状态与最小事实证明，病历细节非默认材料；F017,F026,F031 / SRC-002,010,013；人员权限受限、敏感个人信息；不可访问 SU/HD，不以无病历全文直接驳回；提供负责人替换及代理申请的客观前提；P1 条（C05/C14 且规则触发）；优先人事有权状态与最小事实证明，病历细节非默认材料；F017,F026,F031 / SRC-002,010,013",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "人事身份、离岗或无法履职事实",
        "负责人",
        "身份"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m011",
      "name": "项目资料与责任交接记录",
      "purpose": "项目资料与责任交接记录；原/拟任或承担单位；交接清单/签收；确保研究数据、记录、成果和责任延续；P4/P6 条或后：是否需在申请前提供由计划细则定；可在决定后形成；F027 / SRC-002,010；原/拟任/项目三方关联；未到阶段不算缺件，后期无交接待人审；确保研究数据、记录、成果和责任延续；P4/P6 条或后：是否需在申请前提供由计划细则定；可在决定后形成；F027 / SRC-002,010",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "项目资料与责任交接记录",
        "成果"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m012",
      "name": "拟延期日期与工作计划",
      "purpose": "拟延期日期与工作计划；负责人；延期申请及期间实施计划；校验拟截止、工作安排与项目目的同一性；P1 条（C06–C09 等延期）；详细计划可以纳入 M004，同内容不重复要件；F013,F014,F028,F029 / SRC-002,005,006,010；锁原期与拟期，跨历史批次核对；日期冲突 CF，计划不可读 UR；校验拟截止、工作安排与项目目的同一性；P1 条（C06–C09 等延期）；详细计划可以纳入 M004，同内容不重复要件；F013,F014,F028,F029 / SRC-002,005,006,010",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "拟延期日期与工作计划",
        "负责人",
        "日期",
        "批次"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m013",
      "name": "延期/变更客观原因支撑",
      "purpose": "延期/变更客观原因支撑；负责人/责任单位；必要说明或经授权证据；佐证特殊原因、不可按期完成等事实；P1 条，依据具体批次和裁量要求；不得默认必须提供疾病原始病历或个人隐私；F022,F029,F031 / SRC-002,005,006,010；仅采最小事实，缺材料 NM 仅限已确认必需；要求不明 PU；佐证特殊原因、不可按期完成等事实；P1 条，依据具体批次和裁量要求；不得默认必须提供疾病原始病历或个人隐私；F022,F029,F031 / SRC-002,005,006,010",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "延期/变更客观原因支撑",
        "负责人",
        "授权",
        "批次"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m014",
      "name": "代理或单位代办授权",
      "purpose": "代理或单位代办授权；承担单位/委托人；有权委托记录、单位出具证明；验证非当前负责人提交资格；P1 条（C14/代理）；真实系统授权可替代纸质委托证明；基金委依托单位应提 PI 无法履职之变更/终止不等于任意秘书可发起；F017–F019 / SRC-002,010,019；锁业务动作、授权期限、项目 ID；仅前端自称有权→HD；验证非当前负责人提交资格；P1 条（C14/代理）；真实系统授权可替代纸质委托证明；基金委依托单位应提 PI 无法履职之变更/终止不等于任意秘书可发起；F017–F019 / SRC-002,010,019",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "代理或单位代办授权",
        "负责人",
        "授权",
        "期限"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m015",
      "name": "学院/承担单位初核意见",
      "purpose": "学院/承担单位初核意见；学院/教学科研单位；正式签章意见或可信审核事件；证明完成应有校内前置层级；P4 后/条，由真实单位办理，不列为首次申请材料；F032 / SRC-002,004,010,012；签章签发机关和单位要校验；尚未产生→待办，不记 NM；证明完成应有校内前置层级；P4 后/条，由真实单位办理，不列为首次申请材料；F032 / SRC-002,004,010,012",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "学院/承担单位初核意见",
        "签章"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m016",
      "name": "专家论证意见",
      "purpose": "专家论证意见；有权组织单位/专家组；论证书/会议意见；重大研究内容及其他规定事项的人审依据；P4/P5 条/后，仅专项规则要求时；不能想象“所有变更一律专家论证”；F033 / SRC-002,010,011；评审意见版本单独归档；未知是否必要→PU/HD；重大研究内容及其他规定事项的人审依据；P4/P5 条/后，仅专项规则要求时；不能想象“所有变更一律专家论证”；F033 / SRC-002,010,011",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "专家论证意见",
        "版本",
        "研究内容"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m017",
      "name": "学校审核/备案决定",
      "purpose": "学校审核/备案决定；科发院、重大项目办、社科处或授权单位；正式决策记录；证明校内同意、审批、备案三种不同动作；P4 后；受信部门事件优于申请人上传截图；F034,F037 / SRC-001,002,005,006；决定范围/时间/签发人独立；没有不代表已否决；证明校内同意、审批、备案三种不同动作；P4 后；受信部门事件优于申请人上传截图；F034,F037 / SRC-001,002,005,006",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "学校审核/备案决定",
        "时间",
        "授权"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m018",
      "name": "向主管机关提交/备案回执",
      "purpose": "向主管机关提交/备案回执；上级平台/牵头或责任单位；受理回执、备案状态；证明完成外部提交、受理或备案；P5 条/后（应上报项目）；官方查询/正式回执替代个人上传；F035,F037 / SRC-002,010,011,012；“已提交”≠“已批准”；源失联 SU，状态模糊 HD；证明完成外部提交、受理或备案；P5 条/后（应上报项目）；官方查询/正式回执替代个人上传；F035,F037 / SRC-002,010,011,012",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "向主管机关提交/备案回执",
        "主管机关"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m019",
      "name": "主管机关正式批复",
      "purpose": "主管机关正式批复；NSFC、科技厅、全国社科办等；批件、正式电子决定；核实有权机关批准的具体事项、层级和生效范围；P5 后/条：仅计划要求批准时产生；无外部审批分支为不适用；F035,F037 / SRC-002,010,011,012,017,019；文号/签章/对象/时间可核；不得 P1 强索；省级第 27 条重大事项与校内备案分别记录，未批仍待人审；核实有权机关批准的具体事项、层级和生效范围；P5 后/条：仅计划要求批准时产生；无外部审批分支为不适用；F035,F037 / SRC-002,010,011,012,017,019",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "主管机关正式批复",
        "主管机关",
        "时间",
        "签章"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m020",
      "name": "变更后经批准的任务书/补充合同",
      "purpose": "变更后经批准的任务书/补充合同；主管机关与校科研档案；正式修订件；形成 P6 新基线及审计链；P6 后/条，仅确需更新时；主管系统已生效电子任务书可替代纸件；F036,F039 / SRC-002,010,012；新旧版本两条有效期；未经批准的拟修订件不替代 M002；形成 P6 新基线及审计链；P6 后/条，仅确需更新时；主管系统已生效电子任务书可替代纸件；F036,F039 / SRC-002,010,012",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "变更后经批准的任务书/补充合同",
        "主管机关",
        "版本",
        "任务书",
        "合同"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m021",
      "name": "申请撤回或撤回受理证据",
      "purpose": "申请撤回或撤回受理证据；合法申请人/原受理机关；请求事件与正式处理回执；区分撤回请求、已处理的合法撤回；P3/P7 条/后；受信平台状态可代纸质申请；F021,F038 / SRC-002,010（原事项主管权限）；未经有权机关确认不得消除已报审批记录；程序未知 PU；区分撤回请求、已处理的合法撤回；P3/P7 条/后；受信平台状态可代纸质申请；F021,F038 / SRC-002,010（原事项主管权限）",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "申请撤回或撤回受理证据"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m022",
      "name": "事实复核或正式救济材料",
      "purpose": "事实复核或正式救济材料；申请人/复核机构；异议、核对记录与结果；处理材料比对争议和对正式决定的不同救济渠道；P7 条/后；事实复核可用系统问题反馈，正式救济按专项规定；F038 / SRC-003,011,012；不假定学校有全计划统一复议；无原依据标 PU/HD；处理材料比对争议和对正式决定的不同救济渠道；P7 条/后；事实复核可用系统问题反馈，正式救济按专项规定；F038 / SRC-003,011,012",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "事实复核或正式救济材料"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m023",
      "name": "邻接 G50/S/T 权威结论",
      "purpose": "邻接 G50/S/T 权威结论；科研伦理/诚信、财务、采购、一般合同、人事等业务 Owner；复用相邻业务完成的决策，避免二次审批或越权裁定；P2/P4/P6 条；可信系统可提供引用 ID 时无须上传完整文件；F040 / SRC-001,003,004；必须有对象/版本/签发权/效力；旧结论过期则不可复用；复用相邻业务完成的决策，避免二次审批或越权裁定；P2/P4/P6 条；可信系统可提供引用 ID 时无须上传完整文件；F040 / SRC-001,003,004",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "邻接 G50/S/T 权威结论",
        "版本",
        "合同"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m024",
      "name": "证据来源、版本与问题日志",
      "purpose": "证据来源、版本与问题日志；受信系统自动生成/复核员；将每份 M 与 F 的材料位点、替换关系、受影响结论挂钩；P0–P7 当（内部审计生成，绝不要求用户上传日志文件）；F017,F021,F030,F039 / SRC-001,003（治理背景）；原件哈希/提取版本、操作者和时间不可覆写；生成失败待技术处理；将每份 M 与 F 的材料位点、替换关系、受影响结论挂钩；P0–P7 当（内部审计生成，绝不要求用户上传日志文件）；F017,F021,F030,F039 / SRC-001,003（治理背景）",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "证据来源、版本与问题日志",
        "版本",
        "时间"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m025",
      "name": "涉密分流的非密标记",
      "purpose": "涉密分流的非密标记；学校授权保密机构/归口；状态或转介编号；不上传涉密原文而证明需要专用渠道；P0/P1 条（C17）；仅非敏最小标识，不接收涉密附件；F016 / SRC-002 第 9 条；标识无法确认→HD；明知涉密则不继续普通 OCR；不上传涉密原文而证明需要专用渠道；P0/P1 条（C17）；仅非敏最小标识，不接收涉密附件；F016 / SRC-002 第 9 条",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "涉密分流的非密标记",
        "授权",
        "保密",
        "附件"
      ],
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "review-rules",
      "name": "原研究模板审核规则",
      "description": "逐条投影源文档 R001…规则；模板内审查标准不等同校方正式政策。来源及证据状态见 r02Metadata。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "项目同一性",
          "requirement": "真：已有科研项目变更申请；假：仅未立项申报→NA 并建议相邻申报事项；未知：项目身份不清→HD；001,002,004；F001–F005；M001,M002；E1/E2 对主管机关、计划、批准号、项目/课题/专题及父项目号逐键核；以申请时项目有效档案为准，禁止同名合案。E3 仅佐证，E4 仅定位；同一性核明 PF；异号/层级 CF→科研归口核档；受信源不可得 SU→档案管理员",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R002",
          "title": "有效任务书基线",
          "requirement": "真：变更须以前次已生效内容为基线；假：非变更案→NA；未知：版本链缺失→SU/HD；001,002,004,010；F006–F008,F013,F014；M002,M003；E1/E2 核签发者、版本、生效日、被替代关系、历次批准；以申请时点有效版本为准，未批拟改 M020 不入基线；无历史变更才可免 M003；版本链核明 PF；两份均称“现行”却不一致 CF→科研档案；不可读 UR→持档人；失联 SU→归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "项目执行状态",
          "requirement": "真：申请为尚可能变更的在研项目；假：查明仅历史归档核对→NA（转 R025）；未知：结题/终止状态不明→HD；002,004,010；F003,F015；M001,M003；E1/E2 按提交日和上级结题、终止、撤销事件核状态；状态有先后效力，不能用网页“在研”覆盖有权终止决定；状态可核 PF；矛盾 CF、平台不通 SU→归口；是否仍能申请由有权部门 HD，不自动否决",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "/P1 涉密与受限通道",
          "requirement": "真：受信标识已确定涉密或须保密渠道；假：有权确认非密→NA；未知：密级未明确→HD；002,003；F016,F039；M024,M025；E1 保密渠道只交非密转介标识；自报“非密”不能覆写有权密级；任何含涉密正文的 M002/M005 不进入通用 OCR；真→HD/安全分流而非索全文；未知→保密管理部门；误传立即停止普通流程，不把涉密附件当 NM",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "发起者与项目角色",
          "requirement": "真：P1 提交、补件或变更发起；假：仅 P0 只读归档→NA；未知：真实认证/项目角色不明→HD；001,002,010；F012,F017,F018；M001,M002,M004,M024；E1 的受信 Main/Host 会话主体对 P0 当前负责人及单位提交事件核；角色按动作发生时判断，PDF 署名/Renderer 字段仅 E3/E4；身份一致 PF（非授权批准）；伪造或跨项目身份 CF→可信身份管理员/科研归口；无后端认证 HD",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "代理和单位代办权",
          "requirement": "真：提交人非现任负责人、或无法履职需要单位发起；假：可信负责人自行提交→NA；未知：授权范围不明→HD；002,010；F017–F019,F031；M004,M010,M014；E1/E2 核有权委托/单位发起权限、有效期、动作与项目对象；死亡、疾病不能机械要求原任本人现时签名；计划要求未知不自拟模板；权限事实可核 PF；缺已确认必需授权 NM；实际单位权责不明 HD/PU→归口及人事有权人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "申请版本、事项和理由",
          "requirement": "真：首次或补正正式申请；假：只有 P0 基线关联→NA；未知：变更意图未能识别→NM/UR；001,002,005,006,007；F020–F022,F030；M004,M024；E3 申请原件/E1 正式提交事件比对项目号、版本、提交时点、事项集、拟生效值和理由；表单具体栏目因 SRC-007 附件未读不可设全校固定栏位；可辨 PF；申请正文缺 NM、OCR 页不可读 UR→申请人/合法代理；同案异版本 CF→案卷管理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "/P2 研究内容前后值",
          "requirement": "真：含内容/方案 ChangeItem；假：仅人员或期限→NA；未知：分类不明→PU/HD；001,002,010,011；F009,F023；M002,M005；E2 原任务书章节对 E3 拟修改章节逐段映射，登记删改、新增任务及页码；当前提案与原文不同正常，不能据差异判造假；比较可定位 PF；缺实际前后对照 NM、不可读 UR、引用错误基线 CF→负责人补说明/归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "方向及指标影响",
          "requirement": "真：内容/指标或技术路线变化；假：纯人员/期限且无内容变化→NA；未知：是否降低或重大性不清→HD；001,002,010,011；F009,F010,F023,F024；M002,M005,M006；E2 的原考核指标和 E3 影响声明逐项并列；SRC-001 的“方向不变、指标不降”仅为自主备案候选条件；学术实质/重大性由有权专家或部门判；缺影响说明 NM；已完成文字对照但尚未有权判断→HD；不得因文字相近给出可备案 PF→科发院/主管机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "/P2 普通成员增减与同人识别",
          "requirement": "真：变更成员名单；假：未涉成员→NA；未知：该人员是成员还是负责人→HD；002,010,011,013,016,019；F011,F025；M002,M003,M007,M009（仅适用时）；E1/E2 现名册对拟名单按受信人员引用、单位、项目内角色匹配；同名不同 ID、父子项目错层需隔离；OCR 姓名仅 E4；SRC-016 仅证实校方发布过知情同意书，附件正文未读，不能据此强制所有项目签名；名单差异可追 PF；不同人/重名歧义 CF/HD→项目管理人；无差异表 NM→负责人",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R011",
          "title": "重大项目骨干/专题条件",
          "requirement": "真：国家重点（重大）骨干或专题负责人变更；假：一般成员→NA；未知：专题层级/牵头角色不明→PU；002 第 7、10 条；F004,F005,F025–F027；M002,M007–M009；E2 原任务书的骨干预算明细及层级核拟任资格，按第 7 条核相应负责人、承担单位的同意及说明；不得把专题规则推广全校。签章与人员引用须 E1/E2；证据可核 PF，签章/身份验不出 HD，必需件缺 NM→课题/项目单位及重大项目办；正式认可仍人决",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R012",
          "title": "负责人替换资格及受限类型",
          "requirement": "真：变更项目/课题负责人；假：仅普通成员→NA；未知：计划是否允许换负责人→PU；002,010 第 26 条,013；F002,F004,F012,F025,F026；M002,M007,M008,M010；E1/E2 核现任与拟任的真实角色、计划和当前时点任职资格；NSFC 面上由依托单位申请报基金委批准，SRC-013 FAQ 仅风险提示，人才类须另核正式办法；身份事实 PF；资格/禁止条件未知 PU、实质承接 HD→归口及计划主管；不可自动更换 PI",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R013",
          "title": "/P2 无法履职原因的最小证明",
          "requirement": "真：以离岗、重大健康/客观原因换负责人或代理；假：通常自发申请→NA；未知：计划要求何种证明→PU；002,010,013；F019,F026,F031；M008,M010,M013,M014；E1 人事状态或 E2 最小必要证明，时间以申请日为准；健康诊断原文不默认为必须，必要的同意/豁免由有权人审；只可核必要事实 PF；个人敏感详情拒入普通档案；无授权源 SU/HD→人事与科研归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "/P2 原期限与历史延期",
          "requirement": "真：提交期限变更或延期；假：无期限 ChangeItem→NA；未知：历史延期件缺失→SU；002,005,006,010；F007,F013,F014；M002,M003；E1/E2 对当前已批准截止日、历次延期及实际生效时点排序；未查到批件不能当作“从未延期”；原期限/次数核明 PF；原值不一致 CF；历史源失联 SU→科研台账或主管机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "延期拟值与后续计划",
          "requirement": "真：申请延期；假：无延期→NA；未知：是日期更正还是新增延期→HD；002,005,006,010；F013,F028,F029；M004,M012,M013；E2 基线 F013 对 E3 拟日期；要求清楚的理由与余下工作安排；拟值短于/等于原值需查是否更正而非直接按延期驳回；特殊证明仅计划确需；拟日期/计划清楚 PF；理由未交 NM、日期互相矛盾 CF、事项性质 HD→负责人/归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "国家重点（重大）延期窗口",
          "requirement": "真：SRC-002 范围且学校为项目牵头单位提出项目延期；假：课题/专题或非该计划→NA；未知：牵头身份/旧任务书不明→PU；002 第 32 条；F002,F004,F005,F013,F028,F030；M001,M002,M012,M024；E1 受信提交时间对 E2 有效执行期限，按该条“执行期结束前 6 个月”作事实时间比较；需由科发院提出意见报主管机关，不代判逾期是否可救济；时间算式 PF 或有依据的“逾规定窗口”HD 待办→科发院/主管机关；无法定适用范围 PU",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R017",
          "title": "2026 校哲社年度项目延期",
          "requirement": "真：F002/F003 锁定 SRC-005 2026 年对应批次；假：其他批次→NA；未知：批次不明→PU；005；F003,F013,F014,F028–F030；M001,M003,M012,M024；E1/E2 比对截止日、提交日、已批准延期次数、拟时长；当期通知为提前至少 2 个月、至多 1 次、最长 1 年；次数历史不完整不得算作 0；算式与次数事实 PF 或异常 HD→社科处；M003 失联 SU；不能套 SRC-006",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "2026“双一流”哲社专项延期",
          "requirement": "真：F003 锁定 SRC-006 2026 专项；假：非该专项→NA；未知：批次不明→PU；006；F003,F013,F014,F028,F029；M001,M003,M012；E1/E2 只比对通知中至多 1 次、最长 6 个月及书面申请；没有在 SRC-006 核出的“提前 2 个月”统一阈值，绝不从 R017 复制；事实 PF、超过通知上限提示 HD→社科处；审批仍人决；批次不能证实 PU",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "NSFC 面上项目延期",
          "requirement": "真：F002 确属面上项目且适用 SRC-010 现行修订；假：青年/重点等非面上→NA；未知：计划批次或过渡规则不明→PU；010 第 30 条；F002,F003,F013,F014,F028–F030；M001,M002,M003,M012,M024；E1/E2 核现有效期、提交日、历史延期及拟期间；届满 60 日前、1 次、最长 2 年，经依托单位审核报基金委；历史项目过渡政策须核；事实 PF，时间/次数超限候选 HD→依托单位/基金委；有效规则未确证 PU，源失联 SU",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "其他计划、旧规与外校来源隔离",
          "requirement": "真：国社科、其他校级/中心、其他专项或不在 R016–019、R030–031 的计划；假：已有确切专项来源的分支→NA；未知：计划/当前政策不明→PU；004,008,009,011,013–015,019；F002–F005,F020,F028–F030；M001,M002,M004,M012；E1/E2 先核该类型当期原发和授权；SRC-008 附件、013 FAQ、014 旧表发布页与 SRC-015 四川大学指南均不能创设成理硬期限/签章；NSFC 依托单位组织职责不替代具体类型项目变更细则；可定位来源 PF（不表示程序满足）；不明 PU→科发院/社科处或上级主管；严禁外校规则硬驳回",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "多事项分项路由",
          "requirement": "真：同案内容/成员/负责人/期限同时变更；假：仅单 ChangeItem→NA；未知：每项对象/效力未分清→HD；001,002,010,011；F004,F020,F023–F030,F040；M004–M013,M023；按 itemid+projectlevel+before+after+authority 从 E2 基线作集合核验；每项各自事实结果和审批层级；某项已备案不代表另一项已批准；分项关系 PF、跨项目混案 CF、角色权限未明 HD→科研归口；不得生成一票“整体批准”",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R022",
          "title": "校内初核与学校决定",
          "requirement": "真：流程已到 P4、且该计划需要对应层级意见/备案/审核；假：P1 首申或无需此层级→NA；未知：学校岗位授权不明→PU/HD；001,002,004–006,010；F032,F034,F037；M015,M017,M024；E1 审批事件/E2 可验签章核组织、岗位、项目层级、事项、时间和决定类型；学院意见、备案、审核同意不可互换；非阶段初件；校内事件真实 PF（非上级批准）；文书仅截图 HD、来源失联 SU→有权学院/科发院/社科处",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "/P5 专家论证可用性",
          "requirement": "真：专项/主管明确需专家意见且实际进入该节点；假：未要求或 P1 尚未到节点→NA；未知：是否要求论证→PU；002,010,011；F010,F024,F033；M006,M016；E1/E2 专家组织单位、对象、意见日期及结论页；不要把模型学术评分当专家意见；计划未列通用专家人数/票决阈值不得自创；论证记录可核 PF，已到节点必需件未形成→HD/待组织；要求不明 PU→科研归口",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "上级受理、备案与批准区别",
          "requirement": "真：应上报且实际来到 P5；假：仅校内备案或 P1 初申→NA；未知：审批/备案层级不清→PU；002,010,011,012；F035,F037；M018,M019,M024；E1 官方项目平台/E2 带文号决定核申请对象、事项、主管签发人、批准/备案/退回的准确动作及生效日；M018 受理回执绝不替代 M019 批准件；状态事实 PF（须保留准确动词）；两件矛盾 CF、官方源失联 SU、验签疑问 HD→主管项目机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "生效基线与任务书修订",
          "requirement": "真：已有有权变更决定且到正式归档；假：仅草稿/尚未审→NA；未知：批准生效条件或需否补充合同不明→PU/HD；002,010,011,012,018；F006–F008,F035–F037,F039；M002,M003,M019,M020,M024；E1/E2 核授权事项、决定生效日、正式新任务书/补充合同版本；无外部审批的合法分支以相应有权校内决定为准，不机械强索 M019。省计划已有变更审批件供后续 T03-T06 中期评估引用，不在本模板复核评估结果（SRC-018 第 8 条）。只追加新基线；关联准确 PF；草稿冒签 CF/HD、任务书尚待生成→归档待办；旧基线可追溯，不由 OCR 改生效日",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "证据归属、可读和版本失效",
          "requirement": "真：新增/替换/撤销任一材料或发生源记录更新；假：本次无证据变化→NA；未知：来源版本/哈希不明→SU/HD；001,003（治理背景）；F021,F030,F039；M002,M007,M024；按 projectid,changeitemid,docid,sourceversion,hash,page/effectivetime,supersedes 建有向依赖；E4 提取不可覆写 E2；M007 v2 只使依赖 v1 的规则结论失效，M002 新有效版则重算基线后继；可定位与版本清楚 PF；文件不可读 UR、源失联 SU、错归案 CF→证据复核人；旧 PF 置“已过期”",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "/P7 撤回、重提与复核请求",
          "requirement": "真：有申请补正、撤回或复核请求；假：无此事件→NA；未知：是否有权撤回/复议→PU；002,003,010,011（相关主管边界，非统一撤回依据）；F021,F038,F039；M021,M022,M024；E1 受信请求/有权受理回执/E2 正式结果按事项和时点分别记录；内部草稿撤回≠上级申报撤回；重提是新申请版本/案号关联，不覆盖有权旧决定；请求事实 PF，但不表示撤回生效；权限待核 PU/HD→原受理机关；重复提交 CF→归口核查",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R028",
          "title": "/P4/P6 邻接权威决定的引用",
          "requirement": "真：变更牵涉伦理、诚信、预算、采购、一般合同、人事或结题状态；假：无关联→NA；未知：是否需某前置决定→PU；001,003,004；F015,F024,F026,F040；M003,M008,M023；E1/E2 只按事项、主体、文号、源版本与效力核 G50/S/T Owner 的已生效结论；不作伦理许可、经费调整、人事任职或采购批准，不使用旧 run@rev；引用同案且有效 PF；决定过期 CF、无权威源 SU、是否前置未知 PU→相邻业务 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "/P6 人员/科研责任交接",
          "requirement": "真：负责人/成员变化且适用规定或决定要求交接，已到相应阶段；假：无人员变化或未到交接节点→NA；未知：是否必须签交接单→PU；002,010 第 27 条,011；F025,F027,F035,F036；M007,M011,M019,M020；E1/E2 对参与者退出后的研究数据、原始实验记录、保密/知识产权事项及接手人按生效节点核交接；NSFC 相关义务不能扩展为所有计划统一申请前要件；已发生交接事实 PF；该时点必需记录缺失 NM/HD→责任单位；P1 不索未来交接件",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R030",
          "title": "四川省科技计划重大调整与延期",
          "requirement": "真：F002/F003 和任务书证明属于 SRC-012 适用的四川省科技计划，变更项目牵头单位/负责人、项目期、主要目标/考核指标；假：非省计划或仅低层级备案事项→NA；未知：专项/直补/过渡项目是否适用第 27 条→PU；012,017 第 3、27、53 条；F001–F005,F007,F013,F014,F020,F028–F030；M001–M004,M012,M024；E1/E2 先锁省计划项目类型、是否须任务书及历次有效延期，再核到期前申请、至多一次延期且不超过一年的原文事实；重大事项由牵头单位书面申请、推荐单位审核、报省科技厅同意。2026 过程规程的中期评估复核时限不得套用；对象、日期、次数可证 PF，超窗/超次/超长作 HD（非自动驳回），源失联 SU，政策范围不明 PU；下一角色：牵头单位、推荐单位、省科技厅",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "四川省科技计划一般研究调整/成员备案",
          "requirement": "真：同一省科技计划项目，仅改变研究方案、技术路线或普通项目参与人员，或合作单位调整；假：重大目标/负责人/期限→NA 并走 R030；未知：与考核指标实质变动分界不清→HD；012,017 第 27 条；F004,F005,F009–F011,F020,F023–F025；M001,M002,M004–M007,M024；E2 已批准任务书对 E3 拟修订内容逐项对照，一般方案/路线/参与人员由负责人自主调整后报牵头单位备案，合作单位由牵头单位自主调整；若目标/指标可能重大变化，停止自治假设交有权机构判断；学校仅参与单位不能自行冒充牵头单位备案；差异与备案层级可证 PF；分类争议 HD、计划权限不明 PU；后续为项目牵头单位/校科研归口，不由系统自创备案事件",
          "execution": "manual",
          "targetScope": "group"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "stage-p0",
      "name": "归案/基线锁定",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p1",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p1",
      "name": "提出申请",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p2",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p2",
      "name": "事实核验与候选路由",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p3",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p3",
      "name": "补件/修正",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p4",
      "workflowOwner": "local",
      "returnToStageId": "stage-p2"
    },
    {
      "id": "stage-p4",
      "name": "校内审核/备案",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p5",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p5",
      "name": "主管机关审批/备案（条件触发）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p6",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p6",
      "name": "生效、关联和归档",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p7",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p7",
      "name": "申请撤回/事实复核/决定救济",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "returnToStageId": "stage-p4"
    }
  ],
  "outputs": [
    {
      "id": "criterion-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-checklist",
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

export const r02Metadata = {
  "templateId": "T03-T05",
  "name": "科研项目研究内容、成员、负责人及期限变更审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T03-T05.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T03-T05.md",
  "sourceDocumentSha256": "8cca697876de2e3f81be88f43db546e96b077cd15b542dee0ae62508f0f26e5e",
  "sourceDocumentBytes": 151179,
  "officialSchoolTemplate": false,
  "researchEvidenceStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "authoringStatus": "RESEARCH_HANDOFF_READY",
  "criteria": [
    {
      "sectionId": "review-rules",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R003",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R004",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R006",
      "srcIds": [
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R007",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R010",
      "srcIds": [
        "SRC-016"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R011",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R012",
      "srcIds": [
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R013",
      "srcIds": [
        "SRC-002",
        "SRC-010",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R014",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-006",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R015",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-006",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R016",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R017",
      "srcIds": [
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R018",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R019",
      "srcIds": [
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R020",
      "srcIds": [
        "SRC-008",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-006",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R023",
      "srcIds": [
        "SRC-002",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R024",
      "srcIds": [
        "SRC-002",
        "SRC-010",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R025",
      "srcIds": [
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R026",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R027",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R029",
      "srcIds": [
        "SRC-002",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R030",
      "srcIds": [
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R031",
      "srcIds": [
        "SRC-012",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const

export { templateVersion as template }
export default templateVersion
