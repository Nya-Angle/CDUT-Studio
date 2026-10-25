import type { TemplateVersion } from '@profer/shared'

/** Generated from the R02 research handoff; policy gaps remain manual. */
export const template: TemplateVersion = {
  "templateId": "S04-T06",
  "version": 1,
  "schemaVersion": 2,
  "name": "学生纪律处分申诉程序与材料审核",
  "description": "本地研究模板 · 非校方正式模板。学生纪律处分申诉程序与材料审核；只做材料归属、可读性、版本一致性与待核事项整理。校本规则、权限与正式决定必须由有权人员人工确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；SRC IDs 仅为研究来源索引，不是案卷材料 SourceRef。政策证据状态为 PARTIAL；所有未确认政策/权限/效力项均须人工复核。",
  "objectType": "person",
  "displayName": {
    "template": "{{F002}} · 学生纪律处分申诉程序与材料审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "caseId UUID，全阶段单案",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：caseId UUID，全阶段单案；T/L；阻止错案关联。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F001；原稿字段合同：caseId UUID，全阶段单案；T/L；阻止错案关联；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F002",
      "label": "申请人实名主体ID，L1",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：申请人实名主体ID，L1；T/H；未核身份→人工。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F002；原稿字段合同：申请人实名主体ID，L1；T/H；未核身份→人工；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F003",
      "label": "姓名/学号，L1",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：姓名/学号，L1；T与S/H；冲突，不凭姓名定案。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F003；原稿字段合同：姓名/学号，L1；T与S/H；冲突，不凭姓名定案；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F004",
      "label": "培养类型：本专/研/留学/继续教育/非学历/未知，L1",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：培养类型：本专/研/留学/继续教育/非学历/未知，L1；T/M；未知→归口确认。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F004；原稿字段合同：培养类型：本专/研/留学/继续教育/非学历/未知，L1；T/M；未知→归口确认；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F005",
      "label": "原决定相对人ID，L0",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：原决定相对人ID，L0；T/H；未取得→SOURCE_UNAVAILABLE。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F005；原稿字段合同：原决定相对人ID，L0；T/H；未取得→SOURCE_UNAVAILABLE；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F006",
      "label": "原处分文书号，L0",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：原处分文书号，L0；T/D/M；可替代为官方系统唯一决定ID。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F006；原稿字段合同：原处分文书号，L0；T/D/M；可替代为官方系统唯一决定ID；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F007",
      "label": "原处分类型与决定日，L0",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：原处分类型与决定日，L0；T/M；待原机关核验。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F007；原稿字段合同：原处分类型与决定日，L0；T/M；待原机关核验；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F008",
      "label": "原决定版本hash，L0",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：原决定版本hash，L0；T/H；保留未认证状态。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F008；原稿字段合同：原决定版本hash，L0；T/H；保留未认证状态；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F009",
      "label": "处分机关及有权决策记录ID，L0",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：处分机关及有权决策记录ID，L0；T/M；重大处分人工核。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F009；原稿字段合同：处分机关及有权决策记录ID，L0；T/M；重大处分人工核；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F010",
      "label": "申诉途径与期限告知文字，L0",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：申诉途径与期限告知文字，L0；T/D/M；未载/不清→期限争议。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F010；原稿字段合同：申诉途径与期限告知文字，L0；T/D/M；未载/不清→期限争议；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F011",
      "label": "送达方式：签收/留置/邮寄/公告/其他，L0",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：送达方式：签收/留置/邮寄/公告/其他，L0；T/M；未知→人工。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F011；原稿字段合同：送达方式：签收/留置/邮寄/公告/其他，L0；T/M；未知→人工；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F012",
      "label": "送达原始时点与凭证ID，L0",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：送达原始时点与凭证ID，L0；T/M；不能由上传时间替代。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F012；原稿字段合同：送达原始时点与凭证ID，L0；T/M；不能由上传时间替代；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F013",
      "label": "学生自述收到时点，L1",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：学生自述收到时点，L1；S/M；与F012不同则冲突。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F013；原稿字段合同：学生自述收到时点，L1；S/M；与F012不同则冲突；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F014",
      "label": "书面申诉文本及明确请求，L1",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：书面申诉文本及明确请求，L1；S/H；不可读→UNREADABLE。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F014；原稿字段合同：书面申诉文本及明确请求，L1；S/H；不可读→UNREADABLE；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F015",
      "label": "书面申诉签署/确认方式，L1",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：书面申诉签署/确认方式，L1；T/S/M；具体法定方式未核。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F015；原稿字段合同：书面申诉签署/确认方式，L1；T/S/M；具体法定方式未核；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F016",
      "label": "提交时间及渠道，L1",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：提交时间及渠道，L1；S/T/M；未有回执不等于已收件。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F016；原稿字段合同：提交时间及渠道，L1；S/T/M；未有回执不等于已收件；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F017",
      "label": "官方收件时间/回执ID，L2",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：官方收件时间/回执ID，L2；T/M；无接口→SOURCE_UNAVAILABLE。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F017；原稿字段合同：官方收件时间/回执ID，L2；T/M；无接口→SOURCE_UNAVAILABLE；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F018",
      "label": "代理类型及代理ID，L1条件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：代理类型及代理ID，L1条件；T/S/H；校本资格未明→人工。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F018；原稿字段合同：代理类型及代理ID，L1条件；T/S/H；校本资格未明→人工；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F019",
      "label": "授权范围/期限及证明版本，L1条件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：授权范围/期限及证明版本，L1条件；T/S/H；不自动承认代理。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F019；原稿字段合同：授权范围/期限及证明版本，L1条件；T/S/H；不自动承认代理；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F020",
      "label": "争议事实与证据列表，L1–L4",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：争议事实与证据列表，L1–L4；S/H；无附证可记录主张，不一律拒收。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F020；原稿字段合同：争议事实与证据列表，L1–L4；S/H；无附证可记录主张，不一律拒收；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F021",
      "label": "补正通知范围/期限，L3后生",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：补正通知范围/期限，L3后生；T/M；未通知不报缺。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F021；原稿字段合同：补正通知范围/期限，L3后生；T/M；未通知不报缺；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F022",
      "label": "补充证据版本与收到时间，L3",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：补充证据版本与收到时间，L3；T/S/H；与原材料并存。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F022；原稿字段合同：补充证据版本与收到时间，L3；T/S/H；与原材料并存；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F023",
      "label": "撤回表达及官方处理状态，L3条件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：撤回表达及官方处理状态，L3条件；S与T/M；未确认不得关案。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F023；原稿字段合同：撤回表达及官方处理状态，L3条件；S与T/M；未确认不得关案；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F024",
      "label": "受理决定/签发主体/时间，L2后生",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：受理决定/签发主体/时间，L2后生；T/M；无权威写入→未知。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F024；原稿字段合同：受理决定/签发主体/时间，L2后生；T/M；无权威写入→未知；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F025",
      "label": "复查意见/延长审批/听取意见记录，L4后生",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：复查意见/延长审批/听取意见记录，L4后生；T/H；未到阶段不报缺。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F025；原稿字段合同：复查意见/延长审批/听取意见记录，L4后生；T/H；未到阶段不报缺；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F026",
      "label": "复查决定与送达日/版本，L5后生",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：复查决定与送达日/版本，L5后生；T/H；不推定已签发。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F026；原稿字段合同：复查决定与送达日/版本，L5后生；T/H；不推定已签发；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F027",
      "label": "重作处分决定号/版本/送达，L6条件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：重作处分决定号/版本/送达，L6条件；T/H；无重作触发→N/A。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F027；原稿字段合同：重作处分决定号/版本/送达，L6条件；T/H；无重作触发→N/A；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F028",
      "label": "省级后续申诉与答复关联ID，L7可选",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：省级后续申诉与答复关联ID，L7可选；T/S/H；未启动→N/A。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F028；原稿字段合同：省级后续申诉与答复关联ID，L7可选；T/S/H；未启动→N/A；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "原处分决定书；原处分机关；官方电子决议记录",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 原处分决定书；原处分机关；官方电子决议记录；L0–L1；F005–F010/R002–R004/SRC-002/004/005；缺转机关，坏请求清晰版",
      "requiredElements": [
        "原处分决定书；原处分机关；官方电子决议记录"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "决定证据附件/调查索引；原机关；正式案卷摘录",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 决定证据附件/调查索引；原机关；正式案卷摘录；有实体争议时 L1–L4；F020/R014/SRC-002；无证不得臆判",
      "requiredElements": [
        "决定证据附件/调查索引；原机关；正式案卷摘录"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "原决定送达凭证；原机关；可查签收/邮寄/公告留痕",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 原决定送达凭证；原机关；可查签收/邮寄/公告留痕；L1期限争议；F011–F013/R005–R007/SRC-002/005；冲突人工",
      "requiredElements": [
        "原决定送达凭证；原机关；可查签收/邮寄/公告留痕"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "申诉书；学生；合法书面电子签署件",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 申诉书；学生；合法书面电子签署件；L1；F014–F016/R008–R009/SRC-002；坏件补清晰件",
      "requiredElements": [
        "申诉书；学生；合法书面电子签署件"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "可信学籍身份核验结果；学籍系统；授权证明",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 可信学籍身份核验结果；学籍系统；授权证明；L1；F002–F005/R001/R010/SRC-002/006；无服务人工核",
      "requiredElements": [
        "可信学籍身份核验结果；学籍系统；授权证明"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "代理身份与授权书；本人/代理；法定代理证明或可核委托书",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 代理身份与授权书；本人/代理；法定代理证明或可核委托书；L1代理条件；F018–F019/R011/SRC-007；校本要求未知人工",
      "requiredElements": [
        "代理身份与授权书；本人/代理；法定代理证明或可核委托书"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "提交/收件回执；委员会办公室；系统签收流水",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 提交/收件回执；委员会办公室；系统签收流水；L2；F016–F017/R012/SRC-002；缺不可断言已收件",
      "requiredElements": [
        "提交/收件回执；委员会办公室；系统签收流水"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "期限例外/告知异议证明；学生/原机关；医院/事故/公告底稿等",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 期限例外/告知异议证明；学生/原机关；医院/事故/公告底稿等；L1–L2触发；F010–F013/R007/SRC-002；人工认定",
      "requiredElements": [
        "期限例外/告知异议证明；学生/原机关；医院/事故/公告底稿等"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "补正通知；办公室；官方消息原件",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 补正通知；办公室；官方消息原件；L3发出后；F021/R013/SRC-007；未发生不缺",
      "requiredElements": [
        "补正通知；办公室；官方消息原件"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "补充举证及收件版本；学生/办公室；可追溯附件",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 补充举证及收件版本；学生/办公室；可追溯附件；L3发生后；F020/F022/R014–R015/SRC-002；不覆旧版",
      "requiredElements": [
        "补充举证及收件版本；学生/办公室；可追溯附件"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "正式受理/不受理文书；办公室；认证流程记录",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 正式受理/不受理文书；办公室；认证流程记录；L2决定形成后；F024/R016/SRC-007；未形成不预缺",
      "requiredElements": [
        "正式受理/不受理文书；办公室；认证流程记录"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "回避、听取意见、复查会议记录；委员会；正式纪要/审批记录",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 回避、听取意见、复查会议记录；委员会；正式纪要/审批记录；L4发生后；F025/R017/SRC-002/015；未开展不报缺",
      "requiredElements": [
        "回避、听取意见、复查会议记录；委员会；正式纪要/审批记录"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "延长复查期限审批；学校有权人；签批日志",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 延长复查期限审批；学校有权人；签批日志；L4条件触发；F025/R018/SRC-002；未延长 N/A",
      "requiredElements": [
        "延长复查期限审批；学校有权人；签批日志"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "撤回申请与回复；学生/办公室；书面受理回执",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 撤回申请与回复；学生/办公室；书面受理回执；L3撤回条件；F023/R019/SRC-007；没确认不结案",
      "requiredElements": [
        "撤回申请与回复；学生/办公室；书面受理回执"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "校内复查决定书与送达；委员会；签发归档版",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 校内复查决定书与送达；委员会；签发归档版；L5后生；F026/R020/SRC-002；不能事前强制",
      "requiredElements": [
        "校内复查决定书与送达；委员会；签发归档版"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "重作决定与送达；原有权机关；正式文书",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 重作决定与送达；原有权机关；正式文书；L6条件；F027/R021/SRC-002；不以建议代决定",
      "requiredElements": [
        "重作决定与送达；原有权机关；正式文书"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "省级申诉回执/处理书；学生/省级机关；权威记录",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 省级申诉回执/处理书；学生/省级机关；权威记录；L7可选；F028/R022/SRC-002；不属初次必交",
      "requiredElements": [
        "省级申诉回执/处理书；学生/省级机关；权威记录"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules",
      "name": "研究稿事实核验与人工复核标准",
      "description": "每条 criterion 来自对应研究稿 R 规则；不是学校正式政策，不自动形成行政决定。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "L1所有人：申请主体与可信实名绑定",
          "requirement": "L1所有人：申请主体与可信实名绑定；F002–F004/M005/SRC-001/002；SOURCE_UNAVAILABLE或CONFLICT；身份部门。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "L1已有决定：是否为正式处分而非拟议/其他处理",
          "requirement": "L1已有决定：是否为正式处分而非拟议/其他处理；F005–F008/M001/SRC-002/004/005；CONFLICT；原处分机关。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "L1：申请人与决定相对人是否同一或有合法代理",
          "requirement": "L1：申请人与决定相对人是否同一或有合法代理；F002/F005/F018/M001/M005/M006/SRC-002/007；NEEDS_HUMAN_DECISION；办公室。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "L1：文书号、版本、机关与处分项目可定位且互相一致",
          "requirement": "L1：文书号、版本、机关与处分项目可定位且互相一致；F006–F009/M001/SRC-002；SOURCE_UNAVAILABLE/CONFLICT；原机关。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "L1：决定书中申诉渠道及期限告知可核",
          "requirement": "L1：决定书中申诉渠道及期限告知可核；F010/M001/SRC-002第53/60/64条；NEEDS_HUMAN_DECISION；办公室。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "L1期限判断：送达方式、时间与原始证明一致",
          "requirement": "L1期限判断：送达方式、时间与原始证明一致；F011–F013/M003/SRC-002/005；CONFLICT/NEEDS_MATERIAL；原机关。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "L1–L2争议：期限基点与例外证据齐备，列10日/第64条争议提示，不作失权决定",
          "requirement": "L1–L2争议：期限基点与例外证据齐备，列10日/第64条争议提示，不作失权决定；F010–F013/F016–F017/M003/M007/M008/SRC-002/003/007；POLICY_UNCONFIRMED或NEEDS_HUMAN_DECISION；办公室。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "L1：书面申诉表达是否指向明确决定和请求",
          "requirement": "L1：书面申诉表达是否指向明确决定和请求；F006/F014/M001/M004/SRC-002；NEEDS_MATERIAL/UNREADABLE；学生。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "L1：签署/提交版本与提交人声明可追溯",
          "requirement": "L1：签署/提交版本与提交人声明可追溯；F014–F016/M004/SRC-002/007；POLICY_UNCONFIRMED；办公室。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "L1：本专、研究生、留学生等学段的制度适用确认",
          "requirement": "L1：本专、研究生、留学生等学段的制度适用确认；F004/M005/SRC-002/005/006/009/010；POLICY_UNCONFIRMED；学籍部门/办公室。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "L1代理条件：类型、授权范围、身份证明对应",
          "requirement": "L1代理条件：类型、授权范围、身份证明对应；F018–F019/M006/SRC-007；POLICY_UNCONFIRMED；办公室人工确认。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "L2已递交：学生提交记录与官方收件回执分离核验",
          "requirement": "L2已递交：学生提交记录与官方收件回执分离核验；F016–F017/M007/SRC-002；SOURCE_UNAVAILABLE；办公室。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "L3实际收到补正通知：要求事项与期限有官方来源",
          "requirement": "L3实际收到补正通知：要求事项与期限有官方来源；F021/M009/SRC-007；POLICY_UNCONFIRMED；办公室。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "L1–L4实体争议附件：证据是否归属本案本决定且可读，非判断证明力",
          "requirement": "L1–L4实体争议附件：证据是否归属本案本决定且可读，非判断证明力；F020/F022/M002/M010/SRC-002；CONFLICT/UNREADABLE；学生/委员会。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "L3材料更新：新旧版本、接收时间与影响的主张对应",
          "requirement": "L3材料更新：新旧版本、接收时间与影响的主张对应；F020/F022/M010/SRC-002；CONFLICT；办公室。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "L2决定已作出：正式受理意见签发方与收件身份/案号对应",
          "requirement": "L2决定已作出：正式受理意见签发方与收件身份/案号对应；F017/F024/M007/M011/SRC-001/007；SOURCE_UNAVAILABLE；委员会办公室。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "L4实际复查：听取意见、回避/会议记录若已形成，核对签发归属，不判程序合法性",
          "requirement": "L4实际复查：听取意见、回避/会议记录若已形成，核对签发归属，不判程序合法性；F025/M012/SRC-002/015；NEEDS_HUMAN_DECISION；委员会。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "L4实际延长：批准人、批准日期与延长理由关联，基准15日及最长再15日提示",
          "requirement": "L4实际延长：批准人、批准日期与延长理由关联，基准15日及最长再15日提示；F017/F025/M013/SRC-002/003；NEEDS_HUMAN_DECISION；学校负责人/委员会。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "L3撤回触发：撤回表达与官方接收/处理不混同",
          "requirement": "L3撤回触发：撤回表达与官方接收/处理不混同；F023/M014/SRC-007；POLICY_UNCONFIRMED；办公室。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "L5复查决定形成后：文书签发及送达是否权威、是否与原处分对应",
          "requirement": "L5复查决定形成后：文书签发及送达是否权威、是否与原处分对应；F026/M015/SRC-002；SOURCE_UNAVAILABLE/CONFLICT；委员会。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "L6复查建议要求重作时：复查意见与实际新处分决定分别核验",
          "requirement": "L6复查建议要求重作时：复查意见与实际新处分决定分别核验；F025–F027/M015/M016/SRC-002第61条；NEEDS_HUMAN_DECISION；原有权决定机关。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "L7省级救济发生后：校内复查送达与省级材料归属可关联，15日只提示",
          "requirement": "L7省级救济发生后：校内复查送达与省级材料归属可关联，15日只提示；F026/F028/M015/M017/SRC-002/003；SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；省级机关。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "l1",
      "name": "L1 申诉人、处分决定、送达与书面诉求核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l2",
      "workflowOwner": "local"
    },
    {
      "id": "l2",
      "name": "L2 提交/官方收件与受理文书核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l3",
      "workflowOwner": "local"
    },
    {
      "id": "l3",
      "name": "L3 补件、追加证据与撤回事件核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l4",
      "workflowOwner": "local"
    },
    {
      "id": "l4",
      "name": "L4 复查过程、意见与延长审批记录核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l5",
      "workflowOwner": "local"
    },
    {
      "id": "l5",
      "name": "L5 复查决定及送达事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l6",
      "workflowOwner": "local"
    },
    {
      "id": "l6",
      "name": "L6 有权机关重作决定与送达关联核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l7",
      "workflowOwner": "local"
    },
    {
      "id": "l7",
      "name": "L7 省级后续救济关联（不代办、不作结论）",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "result-code-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "issue-and-todo-list",
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

/** SRC identifiers are research references, never case-material SourceRef values. */
export const r02Metadata = {
  "templateId": "S04-T06",
  "name": "学生纪律处分申诉程序与材料审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S04-T06.md",
  "sourceDocumentSha256": "05164175f3c7a83755cd5b1512088c7b4ff65204008d42f57c27925ede805466",
  "officialSchoolTemplate": false,
  "researchDate": "2026-10-23",
  "policyEvidenceStatus": "PARTIAL",
  "originalResearchBlobSha": "f0d975eded1597bb102b5af3c99ecc66bc41195d",
  "manifestSha256WithOneTrailingLf": "65b208593cf6ac9f17984a674f2aab160ba66739f2086e28062b06ff5791bc87",
  "criteria": [
    {
      "sectionId": "rules",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R002",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R003",
      "srcIds": [
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R004",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R005",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R006",
      "srcIds": [
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R007",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R008",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R009",
      "srcIds": [
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R010",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-006",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R011",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R012",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R013",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R014",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R015",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R017",
      "srcIds": [
        "SRC-002",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R018",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R019",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R020",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R021",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R022",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ],
  "resultCodes": [
    {
      "code": "PASS_FACT",
      "meaning": "当前事实与可信证据匹配；只代表该项事实可核，不代表正式受理、批准或申诉获准。",
      "nextAction": "保留该项事实和来源引用，交下一阶段人工审查。",
      "notEquivalentTo": "不代表正式受理、处分/住宿批准、申诉获准、解除或撤销等学校决定。"
    },
    {
      "code": "NOT_APPLICABLE",
      "meaning": "条件确实不触发或当前阶段尚未到达；未知不能当作不适用。",
      "nextAction": "记录不触发理由；必要时提示邻接模板路由。",
      "notEquivalentTo": "不代表正式受理、处分/住宿批准、申诉获准、解除或撤销等学校决定。"
    },
    {
      "code": "NEEDS_MATERIAL",
      "meaning": "已触发且到达使用阶段、允许提交的必要事实材料缺失；不得要求后续才形成的决定书。",
      "nextAction": "列明材料槽、证据目的、合法替代和提交角色。",
      "notEquivalentTo": "不代表正式受理、处分/住宿批准、申诉获准、解除或撤销等学校决定。"
    },
    {
      "code": "CONFLICT",
      "meaning": "不同可信来源、主体键或版本链对同一事实存在不可自动消解的矛盾。",
      "nextAction": "锁定争议字段、双方来源引用与权属核对人。",
      "notEquivalentTo": "不代表正式受理、处分/住宿批准、申诉获准、解除或撤销等学校决定。"
    },
    {
      "code": "UNREADABLE",
      "meaning": "已有材料因扫描、损坏、加密或 OCR 不可靠而无法读出关键事实。",
      "nextAction": "标注文件、页码/区域，交材料持有人重传或人工视觉核验。",
      "notEquivalentTo": "不代表正式受理、处分/住宿批准、申诉获准、解除或撤销等学校决定。"
    },
    {
      "code": "SOURCE_UNAVAILABLE",
      "meaning": "权威系统/校内数据源不可访问、权限不足或无可核原件。",
      "nextAction": "转校内数据 Owner 或线下正式核实，不转嫁为申请人缺件。",
      "notEquivalentTo": "不代表正式受理、处分/住宿批准、申诉获准、解除或撤销等学校决定。"
    },
    {
      "code": "POLICY_UNCONFIRMED",
      "meaning": "当前适用制度版本、效力、期限、授权或过渡规则缺少权威依据。",
      "nextAction": "交制度解释/业务 Owner 补现行依据；不得输出硬性资格结论。",
      "notEquivalentTo": "不代表正式受理、处分/住宿批准、申诉获准、解除或撤销等学校决定。"
    },
    {
      "code": "NEEDS_HUMAN_DECISION",
      "meaning": "事实需要裁量、权利效力判断或有权机关正式决定。",
      "nextAction": "交真实授权人形成正式结果；模型/Renderer 不得签发。",
      "notEquivalentTo": "不代表正式受理、处分/住宿批准、申诉获准、解除或撤销等学校决定。"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
