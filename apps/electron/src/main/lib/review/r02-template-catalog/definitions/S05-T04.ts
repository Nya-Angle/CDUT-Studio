import type { TemplateVersion } from '@profer/shared'

export type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "S05-T04",
  "version": 1,
  "schemaVersion": 2,
  "name": "学生社团成立、注册、变更、换届与注销审核",
  "description": "本地研究模板 · 非校方正式模板。学生社团成立、注册、变更、换届与注销审核；用于材料事实预审、差异提示与人工办理交接，不代替成都理工大学正式制度、授权或决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板是研究交接材料，不是校方正式模板、表单或授权决定；未确认政策必须人工复核，不自动正式通过或拒绝。",
  "objectType": "organization",
  "displayName": {
    "template": "{{f002}} · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · 事项",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F001；enum，所有：事项",
      "extractionHint": "| F001 | enum，所有：事项 | NEW/ANNUAL/CHANGE/ELECTION/MERGE_SPLIT/DISSOLVE/RECTIFY；经办选择、服务端冻结 | O/N |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。",
      "options": [
        {
          "value": "NEW",
          "label": "NEW"
        },
        {
          "value": "ANNUAL",
          "label": "ANNUAL"
        },
        {
          "value": "CHANGE",
          "label": "CHANGE"
        },
        {
          "value": "ELECTION",
          "label": "ELECTION"
        },
        {
          "value": "MERGE_SPLIT",
          "label": "MERGE_SPLIT"
        },
        {
          "value": "DISSOLVE",
          "label": "DISSOLVE"
        },
        {
          "value": "RECTIFY",
          "label": "RECTIFY"
        }
      ]
    },
    {
      "key": "f002",
      "label": "F002 · 主体",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F002；UUID，所有：主体",
      "extractionHint": "| F002 | UUID，所有：主体 | 学校社团登记 ID；NEW 用临时筹备 ID，后绑定不覆盖 | O/U |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f003",
      "label": "F003 · 登记状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F003；enum+version，存量：登记状态",
      "extractionHint": "| F003 | enum+version，存量：登记状态 | 未登记/有效/整改/暂停/注销等仅按真实校本状态字典映射，权威登记簿 | O/U |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f004",
      "label": "F004 · 当前操作者",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F004；personId，所有：当前操作者",
      "extractionHint": "| F004 | personId，所有：当前操作者 | Host/Main 可信 Actor 与业务角色，不取前端字符串 | P/U |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f005",
      "label": "F005 · 学段校区",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F005；enum，所有：学段校区",
      "extractionHint": "| F005 | enum，所有：学段校区 | 本研/国际等及成都/宜宾/分社；权威学籍、组织台账 | P/C |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f006",
      "label": "F006 · 发起人及代表",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F006；personId[]，NEW：发起人及代表",
      "extractionHint": "| F006 | personId[]，NEW：发起人及代表 | 申报名单+学籍源交叉匹配；全国最低发起人数要求见 SRC-010 第 4 条第（一）项；校本适用范围、身份核验链和受理流程待确认 | P/C |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f007",
      "label": "F007 · 名称宗旨类别",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F007；string，NEW/CHANGE：名称宗旨类别",
      "extractionHint": "| F007 | string，NEW/CHANGE：名称宗旨类别 | 草案与登记簿名称，规范化比较并保留原文 | O/N |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f008",
      "label": "F008 · 章程",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F008；fileVersion，NEW/CHANGE/ELECTION/DISSOLVE：章程",
      "extractionHint": "| F008 | fileVersion，NEW/CHANGE/ELECTION/DISSOLVE：章程 | 草案/现行已备案章程及条款版本，人工确认真实性 | O/C |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f009",
      "label": "F009 · 业务指导单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F009；orgId，NEW/CHANGE/ANNUAL：业务指导单位",
      "extractionHint": "| F009 | orgId，NEW/CHANGE/ANNUAL：业务指导单位 | 申报意向与授权单位台账分开存储 | O/U |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f010",
      "label": "F010 · 指导教师",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F010；personId，NEW/CHANGE/ANNUAL：指导教师",
      "extractionHint": "| F010 | personId，NEW/CHANGE/ANNUAL：指导教师 | 拟聘/在聘标识、任期、聘任权威记录 | P/U |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f011",
      "label": "F011 · 负责人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F011；personId+period，存量：负责人",
      "extractionHint": "| F011 | personId+period，存量：负责人 | 权威登记负责人、当前任期与交接状态 | P/U |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f012",
      "label": "F012 · 成员",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F012；list+snapshot，ANNUAL/ELECTION：成员",
      "extractionHint": "| F012 | list+snapshot，ANNUAL/ELECTION：成员 | 截止时点、实名最小化成员清单/成员数及其来源 | P/C |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f013",
      "label": "F013 · 批次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F013；academicYear+window，ANNUAL/NEW：批次",
      "extractionHint": "| F013 | academicYear+window，ANNUAL/NEW：批次 | 校团委发布的适用批次与受理窗口；公告索引不足以定期限 | O/C |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f014",
      "label": "F014 · 原/拟内容",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F014；recordRef，CHANGE：原/拟内容",
      "extractionHint": "| F014 | recordRef，CHANGE：原/拟内容 | 字段路径、旧值、新值、原因、旧登记版本 | O/N |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f015",
      "label": "F015 · 内部决议",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F015；eventRecord，ELECTION/DISSOLVE/MERGE_SPLIT：内部决议",
      "extractionHint": "| F015 | eventRecord，ELECTION/DISSOLVE/MERGE_SPLIT：内部决议 | 会议类型、通知、出席、表决记录、章程适用条款 | S/C |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f016",
      "label": "F016 · 候选人与新任人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F016；personId[]，ELECTION：候选人与新任人",
      "extractionHint": "| F016 | personId[]，ELECTION：候选人与新任人 | 候选人同意、学籍事实、职务，资格阈值配置化 | P/C |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f017",
      "label": "F017 · 承继主体",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F017；relation[]，MERGE_SPLIT：承继主体",
      "extractionHint": "| F017 | relation[]，MERGE_SPLIT：承继主体 | 原主体 ID、拟新主体 ID/临时 ID、成员/责任承继方案 | O/C |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f018",
      "label": "F018 · 业务余额",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F018；ledgerRef，ANNUAL/DISSOLVE：业务余额",
      "extractionHint": "| F018 | ledgerRef，ANNUAL/DISSOLVE：业务余额 | 项目、在办活动、资产、经费、债务存在性；专门系统签发 | S/U |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f019",
      "label": "F019 · 年度决定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F019；recordRef，ANNUAL/RECTIFY：年度决定",
      "extractionHint": "| F019 | recordRef，ANNUAL/RECTIFY：年度决定 | 年度批次、原决定 ID、整改要求与期限原文 | S/U |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f020",
      "label": "F020 · 有权决定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F020；signedDecisionRef，决定阶段：有权决定",
      "extractionHint": "| F020 | signedDecisionRef，决定阶段：有权决定 | decisionId、机关、签章校验、决定类型、效力日期、撤销关系 | S/L |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f021",
      "label": "F021 · 进度",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F021；enum+recordRef，所有：进度",
      "extractionHint": "| F021 | enum+recordRef，所有：进度 | DRAFT/SUBMITTED/REVIEW/DECIDED/WITHDRAW_REQUESTED/CLOSED 等研究事件，非学校法定状态 | O/N |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f022",
      "label": "F022 · 证据链",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F022；pointer[]，所有：证据链",
      "extractionHint": "| F022 | pointer[]，所有：证据链 | materialSlot/evidenceId/sourceVersion/ownerId/hash/上传时点，服务端只增 | S/N |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f023",
      "label": "F023 · 原案",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F023；recordRef，RECTIFY/复核：原案",
      "extractionHint": "| F023 | recordRef，RECTIFY/复核：原案 | originalCaseId/decisionId/争议范围/提出者/版本链 | S/C |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f024",
      "label": "F024 · 授权",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F024；roleGrant，决定与撤回：授权",
      "extractionHint": "| F024 | roleGrant，决定与撤回：授权 | 后端授权岗位、作用域、授权生效/失效、代理/签章可信记录 | S/U |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f025",
      "label": "F025 · 政策快照",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F025；enum，所有：政策快照",
      "extractionHint": "| F025 | enum，所有：政策快照 | 校本制度版本、校区学段适用性、配置生效日及来源 | O/C |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f026",
      "label": "F026 · 送达",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F026；evidenceRef，决定/公示：送达",
      "extractionHint": "| F026 | evidenceRef，决定/公示：送达 | 通知、送达对象、送达方式与时间，仅有效记录 | S/L |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "M001 · 所有 A，经办：事项申请及代表授权；可信在线申请/授权备案",
      "purpose": "所有 A，经办：事项申请及代表授权；可信在线申请/授权备案；F001/F004/F021/F024；SRC-001；没有代表证据→NEEDS_MATERIAL；授权后端断连→SOURCE_UNAVAILABLE（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "所有 A，经办：事项申请及代表授权",
        "可信在线申请/授权备案"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "M002 · NEW A，发起人：身份与发起名单；授权学籍核验替代扫描证件",
      "purpose": "NEW A，发起人：身份与发起名单；授权学籍核验替代扫描证件；F005/F006；SRC-001；身份源断连→SOURCE_UNAVAILABLE；全国最低要求为 20 名以上本校在读学生联合发起（SRC-010 第 4 条第（一）项）；校本适用范围、身份核验链与当前程序仍 POLICY_UNCONFIRMED（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "NEW A，发起人：身份与发起名单",
        "授权学籍核验替代扫描证件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "M003 · NEW/CHANGE A，申请方：章程草案/修订对照及名称宗旨；可核电子版",
      "purpose": "NEW/CHANGE A，申请方：章程草案/修订对照及名称宗旨；可核电子版；F007/F008/F014；SRC-001；应提交版本缺失→NEEDS_MATERIAL；无法提取→UNREADABLE（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "NEW/CHANGE A，申请方：章程草案/修订对照及名称宗旨",
        "可核电子版"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "M004 · NEW/CHANGE/ANNUAL A，指导单位：指导关系意见/权威台账",
      "purpose": "NEW/CHANGE/ANNUAL A，指导单位：指导关系意见/权威台账；F009；SRC-004/SRC-006；意见是否强制未知→POLICY_UNCONFIRMED；权威源断连→SOURCE_UNAVAILABLE（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "NEW/CHANGE/ANNUAL A，指导单位：指导关系意见/权威台账"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "M005 · NEW/CHANGE/ANNUAL A，教师/聘任主管：拟聘意见或当前聘任证明",
      "purpose": "NEW/CHANGE/ANNUAL A，教师/聘任主管：拟聘意见或当前聘任证明；F010；SRC-004/SRC-006；旧获奖名单不得代替任职，缺台账→SOURCE_UNAVAILABLE（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "NEW/CHANGE/ANNUAL A，教师/聘任主管：拟聘意见或当前聘任证明"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "M006 · NEW A，筹备人：社团宗旨、活动计划、组织设置说明（待表单确认）",
      "purpose": "NEW A，筹备人：社团宗旨、活动计划、组织设置说明（待表单确认）；F007/F008；SRC-001；清单未证→POLICY_UNCONFIRMED，非自动拒绝（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "NEW A，筹备人：社团宗旨、活动计划、组织设置说明（待表单确认）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "M007 · 存量 Q，登记主管：现有社团登记与负责人名册",
      "purpose": "存量 Q，登记主管：现有社团登记与负责人名册；F002/F003/F011；SRC-001/SRC-003；无可信查询→SOURCE_UNAVAILABLE，不以自报替代（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "存量 Q，登记主管：现有社团登记与负责人名册"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "M008 · ANNUAL A，社团：本学年总结、活动清单及运行说明",
      "purpose": "ANNUAL A，社团：本学年总结、活动清单及运行说明；F012/F013/F019；SRC-003/SRC-005；年审清单未知→POLICY_UNCONFIRMED；文件坏→UNREADABLE（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "ANNUAL A，社团：本学年总结、活动清单及运行说明"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "M009 · ANNUAL A，社团/管理单位：成员及负责人截止日快照",
      "purpose": "ANNUAL A，社团/管理单位：成员及负责人截止日快照；F011/F012；SRC-003；两来源矛盾→CONFLICT；私人名单最小化保存（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "ANNUAL A，社团/管理单位：成员及负责人截止日快照"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "M010 · ANNUAL/RECTIFY Q，登记主管：往期年审、整改通知及履行记录",
      "purpose": "ANNUAL/RECTIFY Q，登记主管：往期年审、整改通知及履行记录；F019/F023；SRC-001/SRC-003；没有权威数据→SOURCE_UNAVAILABLE（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "ANNUAL/RECTIFY Q，登记主管：往期年审、整改通知及履行记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "M011 · CHANGE A，社团：变更前后对照及申请理由",
      "purpose": "CHANGE A，社团：变更前后对照及申请理由；F008/F009/F010/F014；SRC-001；原值不符→CONFLICT；审批或备案效力待核（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "CHANGE A，社团：变更前后对照及申请理由"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "M012 · ELECTION A，社团：换届公告、会员/代表会议记录、选举计票资料",
      "purpose": "ELECTION A，社团：换届公告、会员/代表会议记录、选举计票资料；F008/F012/F015/F016；SRC-001/SRC-009(仅比较)；比例未知→POLICY_UNCONFIRMED，会议真实性争议→NEEDS_HUMAN_DECISION（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "ELECTION A，社团：换届公告、会员/代表会议记录、选举计票资料"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "M013 · ELECTION A，候选人/管理单位：候选资格与就任意愿、交接清单",
      "purpose": "ELECTION A，候选人/管理单位：候选资格与就任意愿、交接清单；F005/F011/F016；SRC-001；资格阈值待核；前后任冲突→CONFLICT（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "ELECTION A，候选人/管理单位：候选资格与就任意愿、交接清单"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "M014 · MERGE_SPLIT A，各社团：每一主体的决议及承继计划",
      "purpose": "MERGE_SPLIT A，各社团：每一主体的决议及承继计划；F002/F015/F017；SRC-001；一方无决议→NEEDS_MATERIAL；新主体授权→人工（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "MERGE_SPLIT A，各社团：每一主体的决议及承继计划"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "M015 · DISSOLVE A，社团/管理方：解散意向或学校启动文书及依据",
      "purpose": "DISSOLVE A，社团/管理方：解散意向或学校启动文书及依据；F003/F015/F024；SRC-001；无合法发起权→NEEDS_HUMAN_DECISION（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "DISSOLVE A，社团/管理方：解散意向或学校启动文书及依据"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "M016 · ANNUAL/DISSOLVE Q，财务/活动主管：资产、资金、在办项目和责任台账/结清引用",
      "purpose": "ANNUAL/DISSOLVE Q，财务/活动主管：资产、资金、在办项目和责任台账/结清引用；F018；SRC-005；断连→SOURCE_UNAVAILABLE；不代替财务审批（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "ANNUAL/DISSOLVE Q，财务/活动主管：资产、资金、在办项目和责任台账/结清引用"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "M017 · RECTIFY/申诉 A，当事人：原决定及具体争议、补正证据",
      "purpose": "RECTIFY/申诉 A，当事人：原决定及具体争议、补正证据；F019/F023；SRC-001；未给原案关联→NEEDS_MATERIAL；救济期限待政策核实（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "RECTIFY/申诉 A，当事人：原决定及具体争议、补正证据"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "M018 · 决定 D，有权部门：受理、指导、评议或备案过程记录",
      "purpose": "决定 D，有权部门：受理、指导、评议或备案过程记录；F021/F024；SRC-001；未到该阶段→NOT_APPLICABLE；真实性不明→NEEDS_HUMAN_DECISION（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "决定 D，有权部门：受理、指导、评议或备案过程记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "M019 · 决定 D，学校有权机构：签发决定、登记/年审状态变更",
      "purpose": "决定 D，学校有权机构：签发决定、登记/年审状态变更；F002/F003/F020/F024；SRC-001；未形成→NOT_APPLICABLE；伪造签章→CONFLICT/人工安全处理（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "决定 D，学校有权机构：签发决定、登记/年审状态变更"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "M020 · 决定 D，管理机构：公示、送达、归档与撤销关联",
      "purpose": "决定 D，管理机构：公示、送达、归档与撤销关联；F020/F026；SRC-002/SRC-003；公示不等于批准；时点/效力待核（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "决定 D，管理机构：公示、送达、归档与撤销关联"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "identity",
      "name": "主体与申请人身份",
      "description": "社团主体、经办人、发起人和基础组织材料。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "R001 · 所有 SUBMITTED：经办身份真实",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R001 | 所有 SUBMITTED：经办身份真实 | F004/F024；M001；SRC-001 | 可信 Actor 与授权比对；权限不明→SOURCE_UNAVAILABLE 数，越权→NEEDS_HUMAN_DECISION 决 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "R002 · NEW 申请：发起人身份/在读事实",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R002 | NEW 申请：发起人身份/在读事实 | F005/F006；M002；SRC-001/SRC-010 | 学籍记录逐人比对；全国最低人数要求依 SRC-010 第 4 条第（一）项核对；校本适用范围/身份核验链未确认→POLICY_UNCONFIRMED 业 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "R003 · NEW/CHANGE 申请：名称、宗旨、章程版本自洽",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R003 | NEW/CHANGE 申请：名称、宗旨、章程版本自洽 | F007/F008/F014；M003；SRC-001/SRC-010 | 章程主体/名称一致；不同版本→CONFLICT 申 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "R004 · NEW/CHANGE/ANNUAL：指导单位关联存在",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R004 | NEW/CHANGE/ANNUAL：指导单位关联存在 | F009；M004；SRC-004/SRC-010 | 单位台账与提交意见比对；任权未知→POLICY_UNCONFIRMED 业 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "R005 · NEW/CHANGE/ANNUAL：指导教师在聘事实",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R005 | NEW/CHANGE/ANNUAL：指导教师在聘事实 | F010；M005；SRC-004/SRC-006/SRC-010 | 聘任期间与社团主键核对；历史获奖记录不替代 数 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "R006 · NEW 申请：筹备方案版本与主体一致",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R006 | NEW 申请：筹备方案版本与主体一致 | F002/F007/F008；M006；SRC-001/SRC-010 | 文书与临时 ID 比对；正式清单未知→POLICY_UNCONFIRMED 业 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "lifecycle",
      "name": "组织生命周期事实",
      "description": "登记状态、年审、负责人、指导单位与内部程序事实。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r007",
          "title": "R007 · 存量申请：登记主体与状态可查",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R007 | 存量申请：登记主体与状态可查 | F002/F003；M007；SRC-001 | 权威登记 ID/版本匹配；失联→SOURCE_UNAVAILABLE 数 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "R008 · ANNUAL：所报学年匹配受理批次",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R008 | ANNUAL：所报学年匹配受理批次 | F013；M008；SRC-003/SRC-010 | 官方窗口比对；仅公告索引→POLICY_UNCONFIRMED 业 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "R009 · ANNUAL：成员/负责人快照一致",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R009 | ANNUAL：成员/负责人快照一致 | F011/F012；M009；SRC-003/SRC-010 | 截止时点、关联 ID 对账；冲突→CONFLICT 业 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "R010 · ANNUAL/RECTIFY：既往决定与整改引用真实",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R010 | ANNUAL/RECTIFY：既往决定与整改引用真实 | F019/F023；M010；SRC-001/SRC-003 | 原 decisionId 与要求版本比对；缺授权源→SOURCE_UNAVAILABLE 数 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "R011 · CHANGE：原登记值与变更对照一致",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R011 | CHANGE：原登记值与变更对照一致 | F003/F014；M007/M011；SRC-001 | oldVersion/oldValue CAS 核验；不一致→CONFLICT 业 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "R012 · CHANGE：是否审批还是备案有政策支持",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R012 | CHANGE：是否审批还是备案有政策支持 | F014/F025；M011；SRC-001/SRC-010 | 精确变更项查校本授权矩阵；未配置→POLICY_UNCONFIRMED 业 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "change-review",
      "name": "变更、换届与退出",
      "description": "变更、合并分立、解散、整改和复核证据；效力仍待校本核验。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r013",
          "title": "R013 · ELECTION：换届发起人对应当前社团",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R013 | ELECTION：换届发起人对应当前社团 | F002/F011/F024；M001/M007；SRC-001 | 在任人/授权代理与名册核验；自报社长→NEEDS_HUMAN_DECISION 决 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "R014 · ELECTION：会议与计票证据属于本次换届",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R014 | ELECTION：会议与计票证据属于本次换届 | F008/F015；M012；SRC-001/SRC-009(对照)/SRC-010 | 章程版本、会议日期、签署者一致；比例/程序效力待核→POLICY_UNCONFIRMED 业 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "R015 · ELECTION：候选人与就任意愿可对应",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R015 | ELECTION：候选人与就任意愿可对应 | F005/F016；M013；SRC-001 | 逐人身份/意愿关联；签名争议→NEEDS_HUMAN_DECISION 决 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "R016 · MERGE_SPLIT：所有原主体与承继映射完整",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R016 | MERGE_SPLIT：所有原主体与承继映射完整 | F002/F017；M007/M014；SRC-001 | 每一原主体 ID 和计划映射；缺一方→NEEDS_MATERIAL 申 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "R017 · MERGE_SPLIT：新设/消灭主体的决定种类明确",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R017 | MERGE_SPLIT：新设/消灭主体的决定种类明确 | F017/F025；M014/M019(D)；SRC-001 | 逐主体待办，不自动生效；政策未知→POLICY_UNCONFIRMED 业 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "R018 · DISSOLVE：启动者及内部意向可追溯",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R018 | DISSOLVE：启动者及内部意向可追溯 | F015/F024；M015；SRC-001/SRC-010 | 核章程授权和文书来源；争议→NEEDS_HUMAN_DECISION 决 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "R019 · ANNUAL/DISSOLVE：在办活动与资产责任已披露",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R019 | ANNUAL/DISSOLVE：在办活动与资产责任已披露 | F018；M016；SRC-005 | 仅核权威台账存在及匹配，非财务结清决定；差异→CONFLICT 数 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "R020 · RECTIFY/复核：原决定及争议版本定位准确",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R020 | RECTIFY/复核：原决定及争议版本定位准确 | F019/F023；M017/M010；SRC-001 | 原案、证据和争议范围比对；是否受理/期限→POLICY_UNCONFIRMED 业 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "decision-records",
      "name": "授权决定与登记留痕",
      "description": "受控决定、登记版本、公示送达和证据归属。",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "r021",
          "title": "R021 · 决定阶段：签批角色权限可验证",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R021 | 决定阶段：签批角色权限可验证 | F020/F024；M018/M019；SRC-001/SRC-010 | Main/Host 授权+签章+生效区间；缺权威权限→SOURCE_UNAVAILABLE 数；禁止 AI 代签 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "R022 · 决定后：登记版本与有效决定一致",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R022 | 决定后：登记版本与有效决定一致 | F002/F003/F020；M019；SRC-001/SRC-010 | decisionId→登记事件一一对应；未决定→NOT_APPLICABLE；异步异常→CONFLICT 数 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "R023 · 公示/送达阶段：效力和通知时点可溯",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R023 | 公示/送达阶段：效力和通知时点可溯 | F020/F026；M020；SRC-002/SRC-003 | 区分拟公示/正式决定/登记生效；原件未得→POLICY_UNCONFIRMED 业 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "R024 · 所有材料变更：证据对象及版本可归属",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R024 | 所有材料变更：证据对象及版本可归属 | F002/F022/F023；M001/M017；SRC-001 | hash+ownerId+sourceVersion+caseId 比对；跨社团混用→CONFLICT 业 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "R025 · 所有阶段：校区、学段及分社管辖可核",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| R025 | 所有阶段：校区、学段及分社管辖可核 | F005/F025；M002/M007；SRC-001/SRC-005/SRC-010 | 查适用矩阵；本校未证→POLICY_UNCONFIRMED 业 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "intake",
      "name": "辨认主体/已登记状态",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "select-case"
    },
    {
      "id": "select-case",
      "name": "选择办理情形",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "submission"
    },
    {
      "id": "submission",
      "name": "学生提交当前阶段材料",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "fact-review"
    },
    {
      "id": "fact-review",
      "name": "受理与事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "supplement-or-appeal"
    },
    {
      "id": "supplement-or-appeal",
      "name": "必要时补件/异议/撤回",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "authority-review"
    },
    {
      "id": "authority-review",
      "name": "业务指导意见/校内评议（仅在校本确认后启用）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "human-decision"
    },
    {
      "id": "human-decision",
      "name": "有权机关人工决定",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "record-notice"
    },
    {
      "id": "record-notice",
      "name": "决定送达或公示",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "nextStageId": "registry-update"
    },
    {
      "id": "registry-update",
      "name": "登记状态/年度版本变更及留痕",
      "kind": "handoff",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "review-feedback",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-list",
      "kind": "supplement-list",
      "audience": "organizer"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

export const r02Metadata = {
  "templateId": "S05-T04",
  "name": "学生社团成立、注册、变更、换届与注销审核",
  "sourceDocPath": "docs/design/review-agent/business-templates/R02/S05-T04.md",
  "sourceDocSha256": "e69265475d40622e7f48768c8d4cda6ca9bc617ba826aa222c8b8818027e64b9",
  "originalResearchPath": "docs/design/review-agent/business-templates/R02/research-original/S05-T04.md",
  "originalResearchSha256": "c9d858b448ec33aa0d392911ecb6624023d6cc8deac223eab3ae7b54c648b195",
  "officialSchoolTemplate": false,
  "researchStatus": "PARTIALLY_VERIFIED",
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
    "F026"
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
    "M017",
    "M018",
    "M019",
    "M020"
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "教育部：《普通高等学校学生管理规定》（教育部令第41号），[教育部官方 PDF](",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://hudong.moe.gov.cn/jyb_xxgk/xxgk/zhengce/guizhang/202112/P020211208551013106022.pdf"
      ],
      "scopeNote": "教育部：《普通高等学校学生管理规定》（教育部令第41号），[教育部官方 PDF](https://hudong.moe.gov.cn/jyb_xxgk/xxgk/zhengce/guizhang/202112/P020211208551013106022.pdf) | 第2、6、44、45、55、59–66、68条；PDF 第16–17页（第44–45条）；2017-02-04 公布，2017-09-01 起施行；未检得废止日期 | 适用普通高等学历教育的本专科/研究生，特定群体第66条参照；**原文已验**，2026-10-22；校本实施权限仍未知"
    },
    {
      "id": "SRC-002",
      "title": "成都理工大学校团委官网公告栏目：《关于2026年成都理工大学新社团成立的公示》，[校团委首页索引](",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://youth.cdut.edu.cn/index.htm"
      ],
      "scopeNote": "成都理工大学校团委官网公告栏目：《关于2026年成都理工大学新社团成立的公示》，[校团委首页索引](https://youth.cdut.edu.cn/index.htm) | 首页「团委公告」，索引日期 2026-06-11；原文条页、实际公布/批准生效日未知 | 本校新成立事项有官网栏目线索；**仅索引已验，详情页未成功读取**；2026-10-22"
    },
    {
      "id": "SRC-003",
      "title": "成都理工大学校团委官网公告栏目：《成都理工大学2025-2026学年学生社团年度审核结果公示》，[校团委首页索引](",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://youth.cdut.edu.cn/index.htm"
      ],
      "scopeNote": "成都理工大学校团委官网公告栏目：《成都理工大学2025-2026学年学生社团年度审核结果公示》，[校团委首页索引](https://youth.cdut.edu.cn/index.htm) | 首页「团委公告」，索引日期 2026-06-23；原文条页、正式登记结果和有效日期未知 | 本校年度审核事项有官网栏目线索；**仅索引已验，详情页未成功读取**；2026-10-22"
    },
    {
      "id": "SRC-004",
      "title": "成都理工大学校团委：《关于2025年度成都理工大学优秀学生社团指导教师评审结果公示》，[原文](",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://youth.cdut.edu.cn/info/1006/3203.htm"
      ],
      "scopeNote": "成都理工大学校团委：《关于2025年度成都理工大学优秀学生社团指导教师评审结果公示》，[原文](https://youth.cdut.edu.cn/info/1006/3203.htm) | 正文开头、名单与公示段；2025-12-02 发布，公示期 2025-12-02—04；这是当期表彰公告，非现行社团注册规则 | 本校指导教师/业务指导单位/校团委参与事实；**原文已验**；2026-10-22。引用《…指导教师聘任、管理及考核办法（试行）》（成理校学〔2023〕2号），**该办法原文未取得**"
    },
    {
      "id": "SRC-005",
      "title": "成都理工大学校团委：《关于2024-2025学年“青春之彩”学生社团精品活动立项结果公示》，[原文](",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://youth.cdut.edu.cn/info/1006/2716.htm"
      ],
      "scopeNote": "成都理工大学校团委：《关于2024-2025学年“青春之彩”学生社团精品活动立项结果公示》，[原文](https://youth.cdut.edu.cn/info/1006/2716.htm) | 正文申报流程、36项表及公示段；2024-09-11 发布，公示期 2024-09-11—13；项目批次已过 | 本校、包含成都/宜宾分社活动项目；**原文已验**；2026-10-22。仅能证明活动项目和指导关系，不得作为组织资格批准依据"
    },
    {
      "id": "SRC-006",
      "title": "成都理工大学党委学生工作部（处）、校团委：《关于成都理工大学2022年度优秀学生社团指导教师的公示》，[原文](",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://xsc.cdut.edu.cn/info/1046/1085.htm"
      ],
      "scopeNote": "成都理工大学党委学生工作部（处）、校团委：《关于成都理工大学2022年度优秀学生社团指导教师的公示》，[原文](https://xsc.cdut.edu.cn/info/1046/1085.htm) | 正文依据和名单；2023-04-26 发布，公示期 2023-04-26—28；历史批次 | 本校指导单位与教师分布；**原文已验**；2026-10-22。亦仅间接引用成理校学〔2023〕2号"
    },
    {
      "id": "SRC-007",
      "title": "成都理工大学校团委：《岁末年终，让我们一起盘点成理共青团和成理青年的“高光时刻”》，[原文](",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://youth.cdut.edu.cn/info/1016/1812.htm"
      ],
      "scopeNote": "成都理工大学校团委：《岁末年终，让我们一起盘点成理共青团和成理青年的“高光时刻”》，[原文](https://youth.cdut.edu.cn/info/1016/1812.htm) | 正文「这一年，社团改革显成效」段；2023-01-21 发布，回顾2022年；无规范生效日 | 本校历史管理做法：「思政＋业务」双导师及曾拟定文件；**原文已验**；2026-10-22。不能据「拟定」推知文件已现行实施"
    },
    {
      "id": "SRC-008",
      "title": "成都理工大学：《成都理工大学章程》，[学校官网页面](",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://www.cdut.edu.cn/info/1366/7658.htm"
      ],
      "scopeNote": "成都理工大学：《成都理工大学章程》，[学校官网页面](https://www.cdut.edu.cn/info/1366/7658.htm) | 检索片段显示第27、49条涉党委加强社团管理及校团委；网页搜索记录约2023年前后，公布、核准和修订日期待原文复核 | 校本章程线索；**仅索引片段已见，访问返回412，现行版本未校验**；2026-10-22。不得从该片段推定签批人"
    },
    {
      "id": "SRC-009",
      "title": "清华大学：《清华大学学生社团建设管理办法》，[原文](",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.tsinghua.edu.cn/info/1288/1301.htm"
      ],
      "scopeNote": "清华大学：《清华大学学生社团建设管理办法》，[原文](https://www.tsinghua.edu.cn/info/1288/1301.htm) | 第5–8、12–17、21、23–27条；2021-03-22 页面公布，称2020—2021学年度会议审议修订；现行性仅就对照原文，不适用本校 | **外校原文已验**；2026-10-22。可提示查成立/年审评议、换届、注销、财务等证据链，但不得移入其中整改 3–6 个月、校党委核准等外校特有期限/职权；全国 20 人最低要求另据 SRC-010，不由清华办法推导"
    },
    {
      "id": "SRC-010",
      "title": "中共教育部党组、共青团中央：《关于印发〈高校学生社团建设管理办法〉的通知》（教党〔2020〕13号），签章扫描副本（[高校网站托管 PDF](",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.jmi.edu.cn/_upload/article/files/35/b9/edcf8d7c46d08c132ad9fb77019f/ae4d5240-defd-483c-9c8e-8150ca54a443.pdf",
        "https://ytw.hnie.edu.cn/info/1005/2841.htm",
        "https://www.cqctcm.edu.cn/xgc/2024/0331/c1207a3293/page.htm"
      ],
      "scopeNote": "中共教育部党组、共青团中央：《关于印发〈高校学生社团建设管理办法〉的通知》（教党〔2020〕13号），签章扫描副本（[高校网站托管 PDF](https://www.jmi.edu.cn/_upload/article/files/35/b9/edcf8d7c46d08c132ad9fb77019f/ae4d5240-defd-483c-9c8e-8150ca54a443.pdf)；[另一高校官方转录](https://ytw.hnie.edu.cn/info/1005/2841.htm)；[条文核对页面](https://www.cqctcm.edu.cn/xgc/2024/0331/c1207a3293/page.htm)） | 第 4 条第（一）项及第 5–6、10、17、21–23、28、30、32–33 条；转录副本所载发文日期与部分扫描副本日期存在差异，准确签发日期以发文机关档案为准；截至 2026-10-24 未检得替代文件 | 全国普通高等学校学生社团上位规范；第 4 条明确 20 名以上本校在读学生联合发起、正式学籍和未受校纪处分等最低要求；签章原件由高校网站托管，非"
    }
  ],
  "criteria": [
    {
      "sectionId": "identity",
      "criterionId": "r001",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F004",
        "F024"
      ],
      "materialSlotIds": [
        "M001"
      ]
    },
    {
      "sectionId": "identity",
      "criterionId": "r002",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F005",
        "F006"
      ],
      "materialSlotIds": [
        "M002"
      ]
    },
    {
      "sectionId": "identity",
      "criterionId": "r003",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F007",
        "F008",
        "F014"
      ],
      "materialSlotIds": [
        "M003"
      ]
    },
    {
      "sectionId": "identity",
      "criterionId": "r004",
      "srcIds": [
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F009"
      ],
      "materialSlotIds": [
        "M004"
      ]
    },
    {
      "sectionId": "identity",
      "criterionId": "r005",
      "srcIds": [
        "SRC-004",
        "SRC-006",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F010"
      ],
      "materialSlotIds": [
        "M005"
      ]
    },
    {
      "sectionId": "identity",
      "criterionId": "r006",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F002",
        "F007",
        "F008"
      ],
      "materialSlotIds": [
        "M006"
      ]
    },
    {
      "sectionId": "lifecycle",
      "criterionId": "r007",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F002",
        "F003"
      ],
      "materialSlotIds": [
        "M007"
      ]
    },
    {
      "sectionId": "lifecycle",
      "criterionId": "r008",
      "srcIds": [
        "SRC-003",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F013"
      ],
      "materialSlotIds": [
        "M008"
      ]
    },
    {
      "sectionId": "lifecycle",
      "criterionId": "r009",
      "srcIds": [
        "SRC-003",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F011",
        "F012"
      ],
      "materialSlotIds": [
        "M009"
      ]
    },
    {
      "sectionId": "lifecycle",
      "criterionId": "r010",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F019",
        "F023"
      ],
      "materialSlotIds": [
        "M010"
      ]
    },
    {
      "sectionId": "lifecycle",
      "criterionId": "r011",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F003",
        "F014"
      ],
      "materialSlotIds": [
        "M007",
        "M011"
      ]
    },
    {
      "sectionId": "lifecycle",
      "criterionId": "r012",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F014",
        "F025"
      ],
      "materialSlotIds": [
        "M011"
      ]
    },
    {
      "sectionId": "change-review",
      "criterionId": "r013",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F002",
        "F011",
        "F024"
      ],
      "materialSlotIds": [
        "M001",
        "M007"
      ]
    },
    {
      "sectionId": "change-review",
      "criterionId": "r014",
      "srcIds": [
        "SRC-001",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F008",
        "F015"
      ],
      "materialSlotIds": [
        "M012"
      ]
    },
    {
      "sectionId": "change-review",
      "criterionId": "r015",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F005",
        "F016"
      ],
      "materialSlotIds": [
        "M013"
      ]
    },
    {
      "sectionId": "change-review",
      "criterionId": "r016",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F002",
        "F017"
      ],
      "materialSlotIds": [
        "M007",
        "M014"
      ]
    },
    {
      "sectionId": "change-review",
      "criterionId": "r017",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F017",
        "F025"
      ],
      "materialSlotIds": [
        "M014",
        "M019"
      ]
    },
    {
      "sectionId": "change-review",
      "criterionId": "r018",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F015",
        "F024"
      ],
      "materialSlotIds": [
        "M015"
      ]
    },
    {
      "sectionId": "change-review",
      "criterionId": "r019",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F018"
      ],
      "materialSlotIds": [
        "M016"
      ]
    },
    {
      "sectionId": "change-review",
      "criterionId": "r020",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F019",
        "F023"
      ],
      "materialSlotIds": [
        "M017",
        "M010"
      ]
    },
    {
      "sectionId": "decision-records",
      "criterionId": "r021",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F020",
        "F024"
      ],
      "materialSlotIds": [
        "M018",
        "M019"
      ]
    },
    {
      "sectionId": "decision-records",
      "criterionId": "r022",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F002",
        "F003",
        "F020"
      ],
      "materialSlotIds": [
        "M019"
      ]
    },
    {
      "sectionId": "decision-records",
      "criterionId": "r023",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F020",
        "F026"
      ],
      "materialSlotIds": [
        "M020"
      ]
    },
    {
      "sectionId": "decision-records",
      "criterionId": "r024",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F002",
        "F022",
        "F023"
      ],
      "materialSlotIds": [
        "M001",
        "M017"
      ]
    },
    {
      "sectionId": "decision-records",
      "criterionId": "r025",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F005",
        "F025"
      ],
      "materialSlotIds": [
        "M002",
        "M007"
      ]
    }
  ]
} as const
