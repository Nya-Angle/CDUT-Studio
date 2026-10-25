import type { TemplateVersion } from '@profer/shared'

/**
 * R02 T02-T09: 本地研究模板运行时定义。
 * SRC ID 仅表示研究来源，不是案卷 SourceRef。
 * 本批保留 draft 与人工复核门禁；共享注册/Plan-Run 接线由集成 Owner 负责。
 */
export const templateVersion: TemplateVersion = {
  "templateId": "T02-T09",
  "version": 1,
  "schemaVersion": 2,
  "name": "在职学历学位进修资格申请审核",
  "description": "本地研究模板 · 非校方正式模板。政策证据状态：UNCONFIRMED。仅用于材料完整性、事实归属与证据差异的本地预核；正式人事、师德、聘期、业绩等级或进修资格决定由经确认的有权人员人工作出。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T02-T09 根据 R02 研究交接稿转换；不是成都理工大学正式模板、正式制度或授权签批流程。政策版本未核实，不创建 PolicyVersion，所有自动通过均关闭。",
  "objectType": "person",
  "displayName": {
    "template": "在职学历学位进修资格申请审核"
  },
  "fields": [
    {
      "key": "f001",
      "label": "申请主体权威人员键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F001；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F001"
    },
    {
      "key": "f002",
      "label": "法定/人事登记姓名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F002；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F002"
    },
    {
      "key": "f003",
      "label": "所属组织单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F003；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F003"
    },
    {
      "key": "f004",
      "label": "聘任/人员类别",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F004；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F004"
    },
    {
      "key": "f005",
      "label": "当前任职状态及起讫",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F005；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F005"
    },
    {
      "key": "f006",
      "label": "岗位与应履职职责",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F006；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F006"
    },
    {
      "key": "f007",
      "label": "代理人可信主体键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F007；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F007"
    },
    {
      "key": "f008",
      "label": "代理授权范围与有效期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F008；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F008"
    },
    {
      "key": "f009",
      "label": "联系与通知通道",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F009；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F009"
    },
    {
      "key": "f010",
      "label": "进修计划 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F010；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F010"
    },
    {
      "key": "f011",
      "label": "计划版本/指纹",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F011；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F011"
    },
    {
      "key": "f012",
      "label": "拟培养学校与权威名称",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F012；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F012"
    },
    {
      "key": "f013",
      "label": "地区/境内外",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F013；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F013"
    },
    {
      "key": "f014",
      "label": "目标学历层次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F014；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F014"
    },
    {
      "key": "f015",
      "label": "目标学位层次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F015；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F015"
    },
    {
      "key": "f016",
      "label": "专业/学科/培养方向",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F016；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F016"
    },
    {
      "key": "f017",
      "label": "教学学习形式",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F017；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F017"
    },
    {
      "key": "f018",
      "label": "招生录取类别",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F018；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F018"
    },
    {
      "key": "f019",
      "label": "校内离岗/在岗拟安排",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F019；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F019"
    },
    {
      "key": "f020",
      "label": "拟起始/离岗日期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F020；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F020"
    },
    {
      "key": "f021",
      "label": "拟结束/返岗日期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F021；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F021"
    },
    {
      "key": "f022",
      "label": "申请目的/进修理由",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F022；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F022"
    },
    {
      "key": "f023",
      "label": "外部招生/学籍阶段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F023；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F023"
    },
    {
      "key": "f024",
      "label": "外部报考识别号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F024；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F024"
    },
    {
      "key": "f025",
      "label": "预录取/拟录取事实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F025；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F025"
    },
    {
      "key": "f026",
      "label": "正式录取事实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F026；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F026"
    },
    {
      "key": "f027",
      "label": "入学、在读、完成阶段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F027；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F027"
    },
    {
      "key": "f028",
      "label": "既有学历学位/报考前置背景",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F028；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F028"
    },
    {
      "key": "f029",
      "label": "本岗位职责受影响情况",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F029；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F029"
    },
    {
      "key": "f030",
      "label": "代课/科研/离岗保障拟方案",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F030；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F030"
    },
    {
      "key": "f031",
      "label": "所在单位意见状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F031；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F031"
    },
    {
      "key": "f032",
      "label": "单位意见签发者及权限引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F032；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F032"
    },
    {
      "key": "f033",
      "label": "本事项适用校本政策/版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F033；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F033"
    },
    {
      "key": "f034",
      "label": "校内正式决定 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F034；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F034"
    },
    {
      "key": "f035",
      "label": "校内有权决定者可信 Actor",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F035；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F035"
    },
    {
      "key": "f036",
      "label": "决定文本、效力与范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F036；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F036"
    },
    {
      "key": "f037",
      "label": "决定生效时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F037；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F037"
    },
    {
      "key": "f038",
      "label": "外事/招生/其他权威决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F038；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F038"
    },
    {
      "key": "f039",
      "label": "独立资助事项引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F039；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F039"
    },
    {
      "key": "f040",
      "label": "本次计划变更差异",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F040；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F040"
    },
    {
      "key": "f041",
      "label": "原决定/原计划关联",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F041；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F041"
    },
    {
      "key": "f042",
      "label": "事件类型",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F042；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F042"
    },
    {
      "key": "f043",
      "label": "本事项校内截止及起算",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F043；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F043"
    },
    {
      "key": "f044",
      "label": "外部项目截止与适用年度",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F044；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F044"
    },
    {
      "key": "f045",
      "label": "本案提交/补件/请求时点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F045；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F045"
    },
    {
      "key": "f046",
      "label": "事实异议或复核理由",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F046；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F046"
    },
    {
      "key": "f047",
      "label": "复核/更正最终记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F047；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F047"
    },
    {
      "key": "f048",
      "label": "字段证据归属与核验状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F048；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T09 / F048"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "本人身份与唯一人员键",
      "purpose": "本部 HR/身份管理；权威人员记录，不是身份证照片默认必填；L1；A；经授权查询校方 HR 或由 HR 经办核验归档；本人证件仅在依法必要且系统不可核时收取；F001–F002；SRC-001 背景，直接 SRC=∅；归 ApplicantEmployment/校验时点；不一致 CONFLICT，失联 SOURCE_UNAVAILABLE，不强制反复上传身份证。来源材料槽 M001；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "本部 HR/身份管理；权威人员记录，不是身份证照片默认必填",
        "L1；A",
        "经授权查询校方 HR 或由 HR 经办核验归档；本人证件仅在依法必要且系统不可核时收取"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "任职、聘任类别、岗位与组织关系",
      "purpose": "人事处/授权用人单位；人事聘用合同或 HR 人事状态/岗位记录；L1–L2；A；HR 系统权威取值或经办核验书面证明；不得用申请人的“在编”自述；F003–F006/F032；SRC-001/006 背景，直接 SRC=∅；身份在申请/决定时点分别冻结；缺状态走人工，扫描件不可读标 UNREADABLE。来源材料槽 M002；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "人事处/授权用人单位；人事聘用合同或 HR 人事状态/岗位记录",
        "L1–L2；A",
        "HR 系统权威取值或经办核验书面证明；不得用申请人的“在编”自述"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "本人进修意向、计划与确认",
      "purpose": "申请人；电子声明/计划书/待查校本表单；L0–L1；A；可信本人在线填写与确认可替代上传 PDF；目前无已验证本部统一表名；F009–F022/F045；直接 SRC=∅；主计划每次修改增版；无目标学校/学习方式/日期等影响核验的内容才具体催补，模糊附件 UNREADABLE。来源材料槽 M003；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "申请人；电子声明/计划书/待查校本表单",
        "L0–L1；A",
        "可信本人在线填写与确认可替代上传 PDF；目前无已验证本部统一表名"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "目标培养机构的招生/培养项目信息",
      "purpose": "培养学校官方网站/正式简章；项目名称、形式、资格与截止；L0–L2；C，在目标项目需核时；可登记目标校官方网址、页面快照及访问时点，不要求本人下载重传公开简章；F012–018/F020–021/F023/F044；SRC-008/009 仅目标校为成都理工大学时；否则须目标校原始 SRC；每招生年及专业独立版本；404/变更 SOURCE_UNAVAILABLE，截图缺页 UNREADABLE，不能套当期其他招生项目。来源材料槽 M004；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "培养学校官方网站/正式简章；项目名称、形式、资格与截止",
        "L0–L2；C，在目标项目需核时",
        "可登记目标校官方网址、页面快照及访问时点，不要求本人下载重传公开简章"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "当前岗位教学科研/值班任务",
      "purpose": "教务、人事、所属单位；权威排课/任务记录；L2；C，仅需判断岗位影响时；授权内部系统记录或单位经办核验摘要；不以申请人重复截图代替已存在数据；F006/F029；SRC-002 仅历史背景，直接 SRC=∅；以相关学期/时间窗归属；记录不可用 SOURCE_UNAVAILABLE，不可推断“不影响工作”。来源材料槽 M005；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "教务、人事、所属单位；权威排课/任务记录",
        "L2；C，仅需判断岗位影响时",
        "授权内部系统记录或单位经办核验摘要；不以申请人重复截图代替已存在数据"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "拟离岗与工作覆盖安排",
      "purpose": "申请人与所在单位/教学负责人的候选计划和确认；C02/C07；L2–L3；C；单位正式工作安排记录或计划文本；正式调课/离岗批件不能事前强制；F019–021/F029–030；SRC-002 仅背景，直接 SRC=∅；区分草案/单位确认/正式生效三态；缺计划 NEEDS_MATERIAL，签章真实性待人工。来源材料槽 M006；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "申请人与所在单位/教学负责人的候选计划和确认",
        "C02/C07；L2–L3；C",
        "单位正式工作安排记录或计划文本；正式调课/离岗批件不能事前强制"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "代理权限与本人确认",
      "purpose": "本人及有权授权管理者；委托/授权工作流；L1 发生代办；C；有效校方岗位委托/本人确认事件；不必另做纸质委托如可信系统有授权；F007–F008；直接 SRC=∅；记录代理人、范围、有效期、撤销时间；无有效授权禁止代提交最终申请。来源材料槽 M007；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "本人及有权授权管理者；委托/授权工作流",
        "L1 发生代办；C",
        "有效校方岗位委托/本人确认事件；不必另做纸质委托如可信系统有授权"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "原学历/学位或报考资格背景",
      "purpose": "本人、原培养/授位单位、学信网等有权验证渠道；C04 中目标招生项目实际要求时；C；合法授权电子验证可替代反复上传证书；既有 G50 决定须具有效力引用；F028；SRC-008/009 仅对应招生情形；逐证书独立来源、日期、编号与被核人的一致性；未知不推断不合格。来源材料槽 M008；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "本人、原培养/授位单位、学信网等有权验证渠道",
        "C04 中目标招生项目实际要求时；C",
        "合法授权电子验证可替代反复上传证书；既有 G50 决定须具有效力引用"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m009",
      "name": "报名回执/外部报名号",
      "purpose": "培养学校招生系统；报名回执；已实际报名后；P；招生方可验证电子记录，不需纸质重复打印；F023–F024；SRC-008/009 仅相应报考；外部年度和报名号绑定；未报名 NOT_APPLICABLE，不能提前缺件。来源材料槽 M009；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "培养学校招生系统；报名回执",
        "已实际报名后；P",
        "招生方可验证电子记录，不需纸质重复打印"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "预录取/拟录取通知",
      "purpose": "培养学校招生机构；拟录取公示或正式通知；PRE_ADMITTED 后；P，C03 已取得则当下审阅；可核验的官方公示/电子通知；F023/F025；SRC-008/009 仅相应招生；必须标“拟”，保存公示时间；无则不可造状态，模糊 UNREADABLE。来源材料槽 M010；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "培养学校招生机构；拟录取公示或正式通知",
        "PRE_ADMITTED 后；P，C03 已取得则当下审阅",
        "可核验的官方公示/电子通知"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "正式录取通知",
      "purpose": "培养学校招生机构；录取通知书/权威录取状态；ADMITTED 后；P，C03 已取得则当下审阅；授权查询录取状态/电子录取书；F018/F023/F026；SRC-008/009 仅相应招生；与拟录取分版分效力；无正式录取不因拟录取自动 PASS。来源材料槽 M011；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "培养学校招生机构；录取通知书/权威录取状态",
        "ADMITTED 后；P，C03 已取得则当下审阅",
        "授权查询录取状态/电子录取书"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "定向就业/培养协议",
      "purpose": "培养学校、用人单位和申请人各有权主体；签署协议；实际招生类别且时点触发；C/P；可核验电子合同或有权部门只读签约结果；F018/F038；SRC-008/009 仅目标校报考类型对应时；多方签字与生效条件逐项辨别；未签不等于所有校内申请不合格。来源材料槽 M012；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "培养学校、用人单位和申请人各有权主体；签署协议",
        "实际招生类别且时点触发；C/P",
        "可核验电子合同或有权部门只读签约结果"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "在读/学籍状态",
      "purpose": "培养学校；学籍注册/在读证明；入学注册后；P；经授权官方电子学籍记录/学校出具在读证明；F023/F027；直接校内申请 SRC=∅；时间窗明确，休学/退学/毕业状态不可混用；不可读或离线分开记录。来源材料槽 M013；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "培养学校；学籍注册/在读证明",
        "入学注册后；P",
        "经授权官方电子学籍记录/学校出具在读证明"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "本部校内正式进修决定",
      "purpose": "本部实际有权机关（尚未确认）；正式决定及签发事件；L4 实际决定形成后；P；有效可信业务决定记录，申请人上传“盖章图片”不得直接替代；F033–F037；本事项有效校本 SRC 缺失；与 Case、Plan、Actor、政策版及证据快照绑定；尚未形成时 R019=NOT_APPLICABLE，不催申请人补件；是否进入有权决定流程另由 R018=POLICY_UNCONFIRMED 阻断/待政策主管核。来源材料槽 M014；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "本部实际有权机关（尚未确认）；正式决定及签发事件",
        "L4 实际决定形成后；P",
        "有效可信业务决定记录，申请人上传“盖章图片”不得直接替代"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "所在单位/教学主管意见",
      "purpose": "有权单位及其签发人；若现行规定要求的意见/工作流记录；L3 且制度触发；C/P；经后端授权的组织意见事件；不能凭 OCR 章认定真；F031–F032；SRC-004 仅境外参照，不作境内直接依据；记录意见版本、签发时点及适用计划；无校规先 POLICY_UNCONFIRMED，不得全局必填。来源材料槽 M015；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "有权单位及其签发人；若现行规定要求的意见/工作流记录",
        "L3 且制度触发；C/P",
        "经后端授权的组织意见事件；不能凭 OCR 章认定真"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "补件、资料差异解释",
      "purpose": "本人及材料形成机关；更正说明/核对材料；L2/L6 发现具体缺口或冲突；C；在线差异确认、可追溯的源机关更正文书；F042/F045/F048；直接 SRC=∅；补正不能暗改旧件；可读性差为 UNREADABLE，事实相悖为 CONFLICT。来源材料槽 M016；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "requiredElements": [
        "本人及材料形成机关；更正说明/核对材料",
        "L2/L6 发现具体缺口或冲突；C",
        "在线差异确认、可追溯的源机关更正文书"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "境外项目/国家公派当期申报及结果",
      "purpose": "国际交流处、留学基金委、目标培养学校；官方当期文件；C06 对应项目触发；C/P；已有外事系统权威项目记录/官网公告，不重复索取公开原文；F013/F038/F044；SRC-003/005 按其项目及批次限用；公派项目和境外学位计划分别标识；SRC-005 2025 截止已过，不导出本期门槛。来源材料槽 M017；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "国际交流处、留学基金委、目标培养学校；官方当期文件",
        "C06 对应项目触发；C/P",
        "已有外事系统权威项目记录/官网公告，不重复索取公开原文"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "G05 或其他外事授权决定引用",
      "purpose": "外事/出入境有权主管；真实决定与有效状态；C06 外事作出决定后；R/P；只读外事案卷引用 decisionRef、签发机关和版本；F038；SRC-003/004 为外事程序背景，G50 顶层技术目录已读（业务决定效力仍待校方验证）；外事决定缺/撤销不等于本部人事批准失效与否；分别待主管处理。来源材料槽 M018；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "外事/出入境有权主管；真实决定与有效状态",
        "C06 外事作出决定后；R/P",
        "只读外事案卷引用 decisionRef、签发机关和版本"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m019",
      "name": "变更/延期申请与新版计划",
      "purpose": "本人及权威培养学校/单位（视变更对象）；变更说明；C07 触发时；C；新计划在线填写、已核验学校变更通知；F010–021/F040；直接校规 SRC=∅；必须引用旧计划 ID 与差异；未提供关键变更事实 NEEDS_MATERIAL。来源材料槽 M019；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "本人及权威培养学校/单位（视变更对象）；变更说明",
        "C07 触发时；C",
        "新计划在线填写、已核验学校变更通知"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m020",
      "name": "旧版计划、原意见和决定快照",
      "purpose": "案卷 Owner、人事有权归档者；冻结历史版本；C07/C09 时；C/R；从案卷历史读取，原则上不得要求本人回传原批件；F011/F034/F040–041；直接校规 SRC=∅；旧版只读；若历史链失联 SOURCE_UNAVAILABLE，新决定不可谎称延续原授权。来源材料槽 M020；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "案卷 Owner、人事有权归档者；冻结历史版本",
        "C07/C09 时；C/R",
        "从案卷历史读取，原则上不得要求本人回传原批件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "撤回/终止请求",
      "purpose": "本人或有效授权主体；带时点的请求记录；C08 撤回时；C；本人线上认证事件/规范书面请求；F042/F045；撤回校规 SRC 缺失；请求≠撤回已生效；受理、权限、效力须人工判断。来源材料槽 M021；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "本人或有效授权主体；带时点的请求记录",
        "C08 撤回时；C",
        "本人线上认证事件/规范书面请求"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "事实异议/正式决定复核申请",
      "purpose": "本人；争点、事实来源、对应决定及请求；C09 触发；C；本人认证申诉材料、可追溯补充证据；F041–042/F046；复核校规 SRC 缺失；区分事实纠错与决定复核，原决定 ID/版本不可丢。来源材料槽 M022；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "本人；争点、事实来源、对应决定及请求",
        "C09 触发；C",
        "本人认证申诉材料、可追溯补充证据"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m023",
      "name": "复核/更正处理结果",
      "purpose": "有权复核/纠错机关（尚待核）；正式记录；复核机关作出后；P；可信工作流决定/有权签章文书；F047；复核校规 SRC 缺失；未作出不能“维持/撤销”；签发权限不明时保留待人工。来源材料槽 M023；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "有权复核/纠错机关（尚待核）；正式记录",
        "复核机关作出后；P",
        "可信工作流决定/有权签章文书"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m024",
      "name": "毕业、学位、结束进修后的成果文书",
      "purpose": "培养学校/授位单位；毕业证、学位证、结业/在读结束记录；培养阶段结束后；P/R；授权学历学位电子验证或学校直接签发电子证书；F027；SRC-008/009 仅招生背景；与原申请不同时点；一开始绝不缺件；与 T02-T07 等结果认定分离。来源材料槽 M024；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "培养学校/授位单位；毕业证、学位证、结业/在读结束记录",
        "培养阶段结束后；P/R",
        "授权学历学位电子验证或学校直接签发电子证书"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m025",
      "name": "独立资助/经费事项结果引用",
      "purpose": "财务/科研项目或有权资助部门；只读审批结果；C10 独立经费流程实际产生后；R/P；仅引用授权决定 ID/状态；不收报销单/支付凭证；F039；SRC-004 仅外事财务背景，直接本事项 SRC=∅；资助未批不得伪造已支付，也不因此自动否进修资格。来源材料槽 M025；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "财务/科研项目或有权资助部门；只读审批结果",
        "C10 独立经费流程实际产生后；R/P",
        "仅引用授权决定 ID/状态；不收报销单/支付凭证"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m026",
      "name": "现行校本进修政策、表单及授权矩阵",
      "purpose": "学校人事主管/发布机关；带文号、生效与废止信息的原文和权限表；正式规则启用前；A（机关配置），非申请人材料；有权部门正式政策库/经核原件；不能以外校办法替代；F033/F043；当前直接 SRC=∅；SRC-001/011/012 不够；当前 POLICY_UNCONFIRMED；没有有效版本不得启用通过/否决规则。来源材料槽 M026；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "学校人事主管/发布机关；带文号、生效与废止信息的原文和权限表",
        "正式规则启用前；A（机关配置），非申请人材料",
        "有权部门正式政策库/经核原件；不能以外校办法替代"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rule-checks",
      "name": "原件逐条规则核验",
      "description": "映射研究原件中 R001 至 R027 的全部规则。SRC 是研究来源索引，不是案卷材料 SourceRef。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "事项目的及路由",
          "requirement": "研究规则 R001：\n规则与独立核验对象：R001 事项目的及路由\n阶段；触发 T / F / U：L0–L2；T=以获得学历/学位为目标的本部教职工校内申请；F=仅短期培训/纯学生招生；U=目的或身份模糊\n关联 F / M / SRC：F004/F014/F015/F022/F023；M002/M003/M004；SRC-001(B)/007(B)/010(B)/014(G)\n比较、时间效力、证据优先级、例外：区分学历学位与研修学时，判断仅为候选路由；T02-T10、T08/G50 的候选目录路由已核；不能用培训政策定资格\n可能结果；下一角色：PASS_FACT 仅“描述属于学历学位计划”；F=NOT_APPLICABLE 并提示路由；U=NEEDS_MATERIAL/POLICY_UNCONFIRMED；归口初审候选\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "主体与外部文书同一人",
          "requirement": "研究规则 R002：\n规则与独立核验对象：R002 主体与外部文书同一人\n阶段；触发 T / F / U：L1 起，外部有身份关联证据后复核；T=已有拟关联本申请人的外部文书；F=尚无外部文书时该子比对不适用；U=仅同名/身份键缺\n关联 F / M / SRC：F001/F002/F024–F026/F048；M001/M003/M009/M010/M011；SRC-001(B)\n比较、时间效力、证据优先级、例外：HR 人员键优于自填姓名；按本阶段已存在的报名、拟录取或正式录取文书选 M009/M010/M011 核主体，不前置未来文书；同名不等于同人；申请及录取时点分别留存\n可能结果；下一角色：PASS_FACT 仅对应关系；不一致=CONFLICT，校方 HR/招生源无法取得=SOURCE_UNAVAILABLE；人事经办与招生机关\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "任职状态、类别和组织归属",
          "requirement": "研究规则 R003：\n规则与独立核验对象：R003 任职状态、类别和组织归属\n阶段；触发 T / F / U：L1–L4，C05；T=申报日/决定日有可核的本部聘任记录；F=可证明非本部用工，建议改路由；U=合同效期/类别不明\n关联 F / M / SRC：F003–F006；M002/M005；SRC-001(B)/006(B)\n比较、时间效力、证据优先级、例外：比较 HR 主记录的 effectiveAt 与申请、拟决定日；人员类别资格门槛无校本依据，不得按“编内/代理”直接准驳\n可能结果；下一角色：HR 事实可=PASS_FACT；身份冲突=CONFLICT；系统失联=SOURCE_UNAVAILABLE；类别能否申请=POLICY_UNCONFIRMED；人事经办\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "代理授权及本人确认",
          "requirement": "研究规则 R004：\n规则与独立核验对象：R004 代理授权及本人确认\n阶段；触发 T / F / U：L1/C05；T=经代理录入/代提交；F=本人亲办；U=提交者和本人关系不明\n关联 F / M / SRC：F007/F008/F045；M007/M003；SRC=∅\n比较、时间效力、证据优先级、例外：后端按代理作用范围、有效时段、撤销与本人确认核，扫描委托不自动赋权；代理只可做获准动作\n可能结果；下一角色：T 且核验事实可=PASS_FACT，过期/无权=CONFLICT/NEEDS_HUMAN_DECISION，证明缺=NEEDS_MATERIAL；本人/授权管理员\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "当前计划版本、核心陈述与本人意愿",
          "requirement": "研究规则 R005：\n规则与独立核验对象：R005 当前计划版本、核心陈述与本人意愿\n阶段；触发 T / F / U：L0–L6；T=有当前本人确认的计划；F=仅咨询草稿未提交时不进入正式受理检查；U=无本人确认或计划关联不明\n关联 F / M / SRC：F009–F012/F014–F022/F045/F048；M003；SRC=∅\n比较、时间效力、证据优先级、例外：计划号/版本由 Case Owner 派生；核目标学校、层次、形式、时间、理由是否有足够可定位陈述；联系人仅通知用途，不作为准入门槛；不要求校方以后签发的表单\n可能结果；下一角色：关键事实明晰=PASS_FACT；关键信息缺=NEEDS_MATERIAL，错案/版本=CONFLICT；申请人及案卷经办\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "目标院校项目与公告同一版本",
          "requirement": "研究规则 R006：\n规则与独立核验对象：R006 目标院校项目与公告同一版本\n阶段；触发 T / F / U：L0–L5/C04；T=本人援引一项可辨招生项目；F=纯咨询尚无选定院校项目；U=院校、年度、项目不可辨\n关联 F / M / SRC：F012–F018/F020/F021/F044；M003/M004；SRC-008(E)/009(E)\n比较、时间效力、证据优先级、例外：对照目标院校当期原始公告和本人计划的院校、层次、专业、形式、学制；成都理工大学章程仅限其为招生方时；官网无法访问不让申请人盲补公开通知\n可能结果；下一角色：匹配=PASS_FACT；互斥=CONFLICT；官网失联=SOURCE_UNAVAILABLE；项目未明确=NEEDS_MATERIAL；申请人/培养院校联络人\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "学历、学位、教学形式、招生类别分离",
          "requirement": "研究规则 R007：\n规则与独立核验对象：R007 学历、学位、教学形式、招生类别分离\n阶段；触发 T / F / U：L0–L5/C04；T=计划或公告出现任一相关类别；F=只有非学历学位短训且已转路由；U=项目描述含混\n关联 F / M / SRC：F014–F018/F023；M003/M004/M011；SRC-008(E)/009(E)\n比较、时间效力、证据优先级、例外：分列“取得学历/取得学位”“全日制/非全日制”“定向/非定向”，按外部年度校验；不得以“在职”“全日制”“脱产”彼此推导\n可能结果；下一角色：可辨事实=PASS_FACT；名目冲突=CONFLICT；规则不明=SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；院校/人事经办\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "岗位占用与拟工作覆盖事实",
          "requirement": "研究规则 R008：\n规则与独立核验对象：R008 岗位占用与拟工作覆盖事实\n阶段；触发 T / F / U：L2–L3/C02/C07；T=拟离岗或时间窗有具体履职影响；F=经授权核明确无需调整；U=岗位任务或学习时段缺\n关联 F / M / SRC：F006/F019–F021/F029/F030；M003/M005/M006；SRC-002(B)/016(B)/018(B)\n比较、时间效力、证据优先级、例外：比较同一学期/岗位任务与拟学习日程、覆盖计划；仅核“冲突与安排文本”事实；历史中心减负实践不等于校级离岗权\n可能结果；下一角色：事实一致=PASS_FACT；日期矛盾=CONFLICT；覆盖草案缺=NEEDS_MATERIAL；批准脱产=NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED；所属单位及人事\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "单位意见必要性及签发真实性",
          "requirement": "研究规则 R009：\n规则与独立核验对象：R009 单位意见必要性及签发真实性\n阶段；触发 T / F / U：L3/C02；T=取得适用校规要求并已进入意见节点；F=现行规则明确无须单位意见；U=本部意见链未知\n关联 F / M / SRC：F031/F032/F033；M015/M002/M026；SRC-004(X)/011(B)/019(B)/020(B)\n比较、时间效力、证据优先级、例外：先核规范的意见时点与授权，再核组织、签发者和 planVersion；OCR 章只能提示；境外细则/工程技术学院表不能用于本部境内业务\n可能结果；下一角色：当前多为 POLICY_UNCONFIRMED；取得意见仍需签发校验=NEEDS_HUMAN_DECISION；有权单位/校方政策管理人\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "既有学历学位作为招生前置证明",
          "requirement": "研究规则 R010：\n规则与独立核验对象：R010 既有学历学位作为招生前置证明\n阶段；触发 T / F / U：L1–L3/C04；T=目标院校该项目该年度明确要求此事实；F=尚未到报考节点或没有此项要求；U=报名资格要求不清\n关联 F / M / SRC：F028/F012/F018；M004/M008；SRC-008(E)/009(E)\n比较、时间效力、证据优先级、例外：对照权威学历学位记录与项目具体项；通用身份核验可只读复用 G50，不能把招生门槛升级成学校进修资格门槛\n可能结果；下一角色：权威证据相符=PASS_FACT，缺必需证据=NEEDS_MATERIAL，权威源失联=SOURCE_UNAVAILABLE；招生方/本人\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "外部报名事实",
          "requirement": "研究规则 R011：\n规则与独立核验对象：R011 外部报名事实\n阶段；触发 T / F / U：L1–L5；T=已实际报名；F=尚处意向未报名；U=自述已报无可识别回执\n关联 F / M / SRC：F023/F024；M009/M004；SRC-008(E)/009(E)\n比较、时间效力、证据优先级、例外：比报名号、年份、报考项目与招生机构记录；该年该项目校验，不把报名号当录取\n可能结果；下一角色：T 核实=PASS_FACT，F=NOT_APPLICABLE，缺事实凭据=NEEDS_MATERIAL；招生方/本人\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "拟录取事实",
          "requirement": "研究规则 R012：\n规则与独立核验对象：R012 拟录取事实\n阶段；触发 T / F / U：L1–L5/C03；T=已公示/通知拟录取；F=此前阶段；U=只有“已经通过”等口述\n关联 F / M / SRC：F023/F025；M010；SRC-008(E)/009(E)\n比较、时间效力、证据优先级、例外：官方拟录取公示的人员、项目、公告日期；即使真实也不转 F026 正式录取\n可能结果；下一角色：已核=PASS_FACT，F=NOT_APPLICABLE，公告失联=SOURCE_UNAVAILABLE；招生方核实\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "正式录取事实",
          "requirement": "研究规则 R013：\n规则与独立核验对象：R013 正式录取事实\n阶段；触发 T / F / U：L1–L5/C03；T=招生方已签发正式录取；F=只有意向/拟录取；U=声称已录取无正式来源\n关联 F / M / SRC：F023/F026；M011/M010；SRC-008(E)/009(E)\n比较、时间效力、证据优先级、例外：查最终录取决定/通知及签发时间；M010 无法替 M011；本部是否允许录取后补报另属裁量\n可能结果；下一角色：有效录取=PASS_FACT，F=NOT_APPLICABLE，拟/正式状态冲突=CONFLICT，已声称录取但无依据=NEEDS_MATERIAL；招生方及人事\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "定向培养",
          "requirement": "研究规则 R014：\n规则与独立核验对象：R014 定向培养/就业协议事实\n阶段；触发 T / F / U：L2–L5/C04；T=目标项目类别及其已到签约节点；F=非定向或未到签约节点；U=类别/节点不明\n关联 F / M / SRC：F018/F026/F038；M004/M011/M012；SRC-008(E)/009(E)\n比较、时间效力、证据优先级、例外：对照目标院校年度条款、签约主体、协议效力、签署时点；学校作为招生单位与作为用人单位的身份须区分\n可能结果；下一角色：已签且可核=PASS_FACT；尚未来到节点=NOT_APPLICABLE；应签未签=NEEDS_MATERIAL；有权招生方/用人单位\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "外部学籍",
          "requirement": "研究规则 R015：\n规则与独立核验对象：R015 外部学籍/在读事实\n阶段；触发 T / F / U：L5；T=培养院校已经注册/学籍发生变化；F=入学前；U=口述已在读无官方记录\n关联 F / M / SRC：F023/F027；M013；SRC-008(E)/009(E)\n比较、时间效力、证据优先级、例外：以招生/学籍机关当前时点记录，核注册、休学、退学等状态；不代表本部准许进修\n可能结果；下一角色：PASS_FACT 仅学籍事实；在场不可读=UNREADABLE，源失联=SOURCE_UNAVAILABLE；培养院校/人事经办\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "境外进修",
          "requirement": "研究规则 R016：\n规则与独立核验对象：R016 境外进修/公派与 G05 引用\n阶段；触发 T / F / U：L1–L5/C06；T=涉及国境外学习/公派且已有应核的当期项目事实或 G05 决定；F=纯境内或尚未产生可引用的外事决定（只对决定引用子目标）；U=学习地点或项目不明\n关联 F / M / SRC：F013/F038/F044；M017/M018；SRC-003(X)/004(X)/005(X)/013(G)\n比较、时间效力、证据优先级、例外：每个 checkTarget=外部项目公告/外事决定引用 各自产生唯一结果；当期公告与已签发 G05 决定分离，2025 截止不能用于 2026；本部人事政策属 R018，不能再作为 R016 第二主结果\n可能结果；下一角色：适用且源有效=PASS_FACT；引用尚未签发=NOT_APPLICABLE；源失联=SOURCE_UNAVAILABLE；若把他校/旧批次冒充当期则 CONFLICT；外事/人事各自主管\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "独立资助结果引用",
          "requirement": "研究规则 R017：\n规则与独立核验对象：R017 独立资助结果引用\n阶段；触发 T / F / U：L1–L5/C10；T=另案资助决定确已形成且拟只读引用；F=未涉及资金或另案决定尚未形成；U=声称已批却无法辨资金机关\n关联 F / M / SRC：F039；M025；SRC-004(X)/014(G)\n比较、时间效力、证据优先级、例外：只验证真实资金决定号、适用对象、状态与效期；声称拟申请资助不是已经形成可引用决定，绝不计算可报金额/支付\n可能结果；下一角色：已有有效引用=PASS_FACT，未产生=NOT_APPLICABLE，现有文书与源冲突=CONFLICT，声称已批但源失联=SOURCE_UNAVAILABLE；财务 Owner/人事经办\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "本部直接政策与资格阈值来源",
          "requirement": "研究规则 R018：\n规则与独立核验对象：R018 本部直接政策与资格阈值来源\n阶段；触发 T / F / U：L2–L4；T=拟按年龄、职级、工龄、次数、服务期、成果等判资格；F=仅记录无需适用硬阈值的客观事实；U=规则是否存在/仍有效不明\n关联 F / M / SRC：F004/F005/F014–F016/F033/F043；M026；SRC-001(B)/011(B)/012(B)/014(G)/016(B)/017(B)/019(B)/020(B)\n比较、时间效力、证据优先级、例外：必须检查本部发布机关、文号、对象、版本、生效/废止；上述 SRC 均不能替代现行本部准入条款，无直接 SRC=∅\n可能结果；下一角色：当前全部阈值判定=POLICY_UNCONFIRMED，不产“资格不符”；政策主管人事/授权法务\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "本部正式决定的真实性与效力",
          "requirement": "研究规则 R019：\n规则与独立核验对象：R019 本部正式决定的真实性与效力\n阶段；触发 T / F / U：L4 后；T=权威流程真实签发了本事项决定；F=尚处 L0–L3 未签发；U=仅有图片/伪造字段/无有效 Run\n关联 F / M / SRC：F010/F011/F033–F037；M014/M026；SRC=∅\n比较、时间效力、证据优先级、例外：对照有权机关 Actor、签发角色、政策版本、Case/Plan/Run、证据指纹、时间与撤销状态；无本部现行授权前不能“出具决定”\n可能结果；下一角色：未签 F=NOT_APPLICABLE；已有凭据仍待角色核验=NEEDS_HUMAN_DECISION；无权/错案=CONFLICT；有权签发者/记录管理员\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "材料可读性、来源和归属链",
          "requirement": "研究规则 R020：\n规则与独立核验对象：R020 材料可读性、来源和归属链\n阶段；触发 T / F / U：L1–L6，每个本阶段实际被使用的证据；T=进入事实比对的活跃材料；F=阶段未到或该槽未触发；U=来源/属主不明\n关联 F / M / SRC：F011/F048；M001–M026（按适用选择）；SRC=∅\n比较、时间效力、证据优先级、例外：校验 sourceIssuer、受事人、字段定位、版本/hash、文件页与授权获取状态；含保密/敏感件按最小权限；扫描字形可读≠签发真\n可能结果；下一角色：溯源完整=PASS_FACT；不可读=UNREADABLE，官网/API失联=SOURCE_UNAVAILABLE，错人/错版=CONFLICT；材料管理员/源机关\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "定向补件与冲突解释",
          "requirement": "研究规则 R021：\n规则与独立核验对象：R021 定向补件与冲突解释\n阶段；触发 T / F / U：L2/L6/C08；T=已有具体缺口/争议且本人提交更正；F=无补件事项；U=更正对象/版本不清\n关联 F / M / SRC：F042/F045/F048；M016（及被争议 M）；SRC=∅\n比较、时间效力、证据优先级、例外：核解释引用的 findingId、原材料版本、签发机关更正、提交时点；声明不能覆盖权威材料；只重跑证据依赖规则\n可能结果；下一角色：能绑定更正=PASS_FACT（不代表争议消失）；仍相悖=CONFLICT、附件不可读=UNREADABLE；申请人/源机关/经办\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "计划变更与旧决定影响",
          "requirement": "研究规则 R022：\n规则与独立核验对象：R022 计划变更与旧决定影响\n阶段；触发 T / F / U：L5/C07；T=已提交修改/延期/目标院校变更；F=当前计划未变；U=旧版来源缺\n关联 F / M / SRC：F010/F011/F040/F041；M019/M020（及变更所涉 M）；SRC-001(B)/014(G)\n比较、时间效力、证据优先级、例外：本 R 仅核计划版本差异事实，根据 planVersion 的字段 diff 与历史快照标记受影响旧 Finding 过时，不修改旧决定；变更是否须重批由 R018 检查校本规则、R019 检查新旧真实决定效力\n可能结果；下一角色：差异事实可定位=PASS_FACT；历史链失联=SOURCE_UNAVAILABLE；不触发=NOT_APPLICABLE；Case Owner 下一步通知原有权机关核影响\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "撤回请求及其效力",
          "requirement": "研究规则 R023：\n规则与独立核验对象：R023 撤回请求及其效力\n阶段；触发 T / F / U：L6/C08；T=本人发出可信撤回请求；F=无撤回；U=代提/受理主体不明\n关联 F / M / SRC：F034–F037/F042/F045；M021/M020/M014；SRC=∅\n比较、时间效力、证据优先级、例外：核本人认证、代理范围、请求日期、提交和决定先后；请求受理≠撤回生效；后续是否能重提、原决定是否撤销待校规\n可能结果；下一角色：请求真实=PASS_FACT（仅事实）；生效权限/期限=POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；申请人/有权受理机关\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "事实异议与正式决定复核",
          "requirement": "研究规则 R024：\n规则与独立核验对象：R024 事实异议与正式决定复核\n阶段；触发 T / F / U：L6/C09；T=本人针对特定事实/决定提出争议；F=未争议；U=争议对象/原决定不明\n关联 F / M / SRC：F041/F042/F046/F047；M022/M020/M023；SRC=∅\n比较、时间效力、证据优先级、例外：对齐 originalRunId/decisionId、争点、证据版本、复核权人与时点；事实纠错由核验角色、决定复核由有权机关，不把 M023 提前索要\n可能结果；下一角色：争点可定位=PASS_FACT，原链失联=SOURCE_UNAVAILABLE，是否准许/作何处理=POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；原审/复核机关\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "毕业",
          "requirement": "研究规则 R025：\n规则与独立核验对象：R025 毕业/取得学位等后续事实\n阶段；触发 T / F / U：L5 完成阶段；T=培养机构已签发完成、毕业或授位材料；F=仍在申请/在读；U=仅自称“拿到学位”\n关联 F / M / SRC：F027；M024/M013；SRC-008(E)/009(E)\n比较、时间效力、证据优先级、例外：分列结业、毕业证与学位证，不由本部自动授位；与 T02-T07 业绩认定不合并\n可能结果；下一角色：证书事实可核=PASS_FACT；先期=NOT_APPLICABLE；证书无法核=SOURCE_UNAVAILABLE/UNREADABLE；培养学校/成果引用方\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "校内与校外时限各自效力",
          "requirement": "研究规则 R026：\n规则与独立核验对象：R026 校内与校外时限各自效力\n阶段；触发 T / F / U：L1–L6/C04/C06/C09；T=实际存在需比较的申报/撤回/复核/报名节点；F=不设该节点；U=截止来源/年度/起算不明\n关联 F / M / SRC：F043–F045；M026/M004/M017；SRC-005(X)/008(E)/009(E)\n比较、时间效力、证据优先级、例外：F044 仅外部招生/公派适用项目和年度；校内 F043 必须本部原文，当前值 UNKNOWN；不能以设备时间/2025 通知触发 2026 自动逾期\n可能结果；下一角色：外部节点可核=PASS_FACT；本部时限=POLICY_UNCONFIRMED；时间互斥=CONFLICT；人事政策管理员/外部项目方\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "跨模板权威结果的限定复用",
          "requirement": "研究规则 R027：\n规则与独立核验对象：R027 跨模板权威结果的限定复用\n阶段；触发 T / F / U：L2–L6/C05/C06/C10；T=拟引用 G50、G05、T08、T02 邻接决定；F=没有外部决定依赖；U=来源 Owner 或效力不可核\n关联 F / M / SRC：F038/F039/F041/F048；M018/M025/M020；SRC-013(G)/014(G)\n比较、时间效力、证据优先级、例外：检查 decisionId、签发对象、事件有效期、事项目的、撤销与新版本；只读复用已有授权对象，不替其再次签发；G50 顶层目录与 R02 已读，但各 workspace 业务规则及生产授权尚未逐条核实\n可能结果；下一角色：引用完整=PASS_FACT（仅引用有效性）；源失联=SOURCE_UNAVAILABLE；不同授权对象=CONFLICT；源 Owner/目录维护人\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
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
      "name": "材料与身份初核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "fact-review",
      "workflowOwner": "local"
    },
    {
      "id": "fact-review",
      "name": "事实、证据与规则核对",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "final-review",
      "returnToStageId": "intake",
      "workflowOwner": "local"
    },
    {
      "id": "final-review",
      "name": "本地人工复核与结果整理",
      "kind": "finalize",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "review-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-actions",
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
  "templateId": "T02-T09",
  "name": "在职学历学位进修资格申请审核",
  "officialSchoolTemplate": false,
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T02-T09.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T02-T09.md",
  "sourceDocumentSha256": "5f6cf69ddde96a6ab2497b642b79adc27b1b95de2ebd1cc7bc9fe40fe646ee79",
  "sourceOriginalGitBlobSha": "07313be7faa5236ae31da3f4275dd907e5664667",
  "sourceSnapshot": "2026-10-23",
  "researchAsOf": "2026-10-23",
  "researchEvidenceStatus": "UNCONFIRMED",
  "policyEvidenceStatus": "UNCONFIRMED",
  "authoringStatus": "RESEARCH_HANDOFF_READY",
  "fieldIds": [
    {
      "sourceId": "F001",
      "fieldKey": "f001",
      "label": "申请主体权威人员键"
    },
    {
      "sourceId": "F002",
      "fieldKey": "f002",
      "label": "法定/人事登记姓名"
    },
    {
      "sourceId": "F003",
      "fieldKey": "f003",
      "label": "所属组织单位"
    },
    {
      "sourceId": "F004",
      "fieldKey": "f004",
      "label": "聘任/人员类别"
    },
    {
      "sourceId": "F005",
      "fieldKey": "f005",
      "label": "当前任职状态及起讫"
    },
    {
      "sourceId": "F006",
      "fieldKey": "f006",
      "label": "岗位与应履职职责"
    },
    {
      "sourceId": "F007",
      "fieldKey": "f007",
      "label": "代理人可信主体键"
    },
    {
      "sourceId": "F008",
      "fieldKey": "f008",
      "label": "代理授权范围与有效期"
    },
    {
      "sourceId": "F009",
      "fieldKey": "f009",
      "label": "联系与通知通道"
    },
    {
      "sourceId": "F010",
      "fieldKey": "f010",
      "label": "进修计划 ID"
    },
    {
      "sourceId": "F011",
      "fieldKey": "f011",
      "label": "计划版本/指纹"
    },
    {
      "sourceId": "F012",
      "fieldKey": "f012",
      "label": "拟培养学校与权威名称"
    },
    {
      "sourceId": "F013",
      "fieldKey": "f013",
      "label": "地区/境内外"
    },
    {
      "sourceId": "F014",
      "fieldKey": "f014",
      "label": "目标学历层次"
    },
    {
      "sourceId": "F015",
      "fieldKey": "f015",
      "label": "目标学位层次"
    },
    {
      "sourceId": "F016",
      "fieldKey": "f016",
      "label": "专业/学科/培养方向"
    },
    {
      "sourceId": "F017",
      "fieldKey": "f017",
      "label": "教学学习形式"
    },
    {
      "sourceId": "F018",
      "fieldKey": "f018",
      "label": "招生录取类别"
    },
    {
      "sourceId": "F019",
      "fieldKey": "f019",
      "label": "校内离岗/在岗拟安排"
    },
    {
      "sourceId": "F020",
      "fieldKey": "f020",
      "label": "拟起始/离岗日期"
    },
    {
      "sourceId": "F021",
      "fieldKey": "f021",
      "label": "拟结束/返岗日期"
    },
    {
      "sourceId": "F022",
      "fieldKey": "f022",
      "label": "申请目的/进修理由"
    },
    {
      "sourceId": "F023",
      "fieldKey": "f023",
      "label": "外部招生/学籍阶段"
    },
    {
      "sourceId": "F024",
      "fieldKey": "f024",
      "label": "外部报考识别号"
    },
    {
      "sourceId": "F025",
      "fieldKey": "f025",
      "label": "预录取/拟录取事实"
    },
    {
      "sourceId": "F026",
      "fieldKey": "f026",
      "label": "正式录取事实"
    },
    {
      "sourceId": "F027",
      "fieldKey": "f027",
      "label": "入学、在读、完成阶段"
    },
    {
      "sourceId": "F028",
      "fieldKey": "f028",
      "label": "既有学历学位/报考前置背景"
    },
    {
      "sourceId": "F029",
      "fieldKey": "f029",
      "label": "本岗位职责受影响情况"
    },
    {
      "sourceId": "F030",
      "fieldKey": "f030",
      "label": "代课/科研/离岗保障拟方案"
    },
    {
      "sourceId": "F031",
      "fieldKey": "f031",
      "label": "所在单位意见状态"
    },
    {
      "sourceId": "F032",
      "fieldKey": "f032",
      "label": "单位意见签发者及权限引用"
    },
    {
      "sourceId": "F033",
      "fieldKey": "f033",
      "label": "本事项适用校本政策/版本"
    },
    {
      "sourceId": "F034",
      "fieldKey": "f034",
      "label": "校内正式决定 ID"
    },
    {
      "sourceId": "F035",
      "fieldKey": "f035",
      "label": "校内有权决定者可信 Actor"
    },
    {
      "sourceId": "F036",
      "fieldKey": "f036",
      "label": "决定文本、效力与范围"
    },
    {
      "sourceId": "F037",
      "fieldKey": "f037",
      "label": "决定生效时间"
    },
    {
      "sourceId": "F038",
      "fieldKey": "f038",
      "label": "外事/招生/其他权威决定引用"
    },
    {
      "sourceId": "F039",
      "fieldKey": "f039",
      "label": "独立资助事项引用"
    },
    {
      "sourceId": "F040",
      "fieldKey": "f040",
      "label": "本次计划变更差异"
    },
    {
      "sourceId": "F041",
      "fieldKey": "f041",
      "label": "原决定/原计划关联"
    },
    {
      "sourceId": "F042",
      "fieldKey": "f042",
      "label": "事件类型"
    },
    {
      "sourceId": "F043",
      "fieldKey": "f043",
      "label": "本事项校内截止及起算"
    },
    {
      "sourceId": "F044",
      "fieldKey": "f044",
      "label": "外部项目截止与适用年度"
    },
    {
      "sourceId": "F045",
      "fieldKey": "f045",
      "label": "本案提交/补件/请求时点"
    },
    {
      "sourceId": "F046",
      "fieldKey": "f046",
      "label": "事实异议或复核理由"
    },
    {
      "sourceId": "F047",
      "fieldKey": "f047",
      "label": "复核/更正最终记录"
    },
    {
      "sourceId": "F048",
      "fieldKey": "f048",
      "label": "字段证据归属与核验状态"
    }
  ],
  "materialSlotIds": [
    {
      "sourceId": "M001",
      "slotId": "m001",
      "name": "本人身份与唯一人员键"
    },
    {
      "sourceId": "M002",
      "slotId": "m002",
      "name": "任职、聘任类别、岗位与组织关系"
    },
    {
      "sourceId": "M003",
      "slotId": "m003",
      "name": "本人进修意向、计划与确认"
    },
    {
      "sourceId": "M004",
      "slotId": "m004",
      "name": "目标培养机构的招生/培养项目信息"
    },
    {
      "sourceId": "M005",
      "slotId": "m005",
      "name": "当前岗位教学科研/值班任务"
    },
    {
      "sourceId": "M006",
      "slotId": "m006",
      "name": "拟离岗与工作覆盖安排"
    },
    {
      "sourceId": "M007",
      "slotId": "m007",
      "name": "代理权限与本人确认"
    },
    {
      "sourceId": "M008",
      "slotId": "m008",
      "name": "原学历/学位或报考资格背景"
    },
    {
      "sourceId": "M009",
      "slotId": "m009",
      "name": "报名回执/外部报名号"
    },
    {
      "sourceId": "M010",
      "slotId": "m010",
      "name": "预录取/拟录取通知"
    },
    {
      "sourceId": "M011",
      "slotId": "m011",
      "name": "正式录取通知"
    },
    {
      "sourceId": "M012",
      "slotId": "m012",
      "name": "定向就业/培养协议"
    },
    {
      "sourceId": "M013",
      "slotId": "m013",
      "name": "在读/学籍状态"
    },
    {
      "sourceId": "M014",
      "slotId": "m014",
      "name": "本部校内正式进修决定"
    },
    {
      "sourceId": "M015",
      "slotId": "m015",
      "name": "所在单位/教学主管意见"
    },
    {
      "sourceId": "M016",
      "slotId": "m016",
      "name": "补件、资料差异解释"
    },
    {
      "sourceId": "M017",
      "slotId": "m017",
      "name": "境外项目/国家公派当期申报及结果"
    },
    {
      "sourceId": "M018",
      "slotId": "m018",
      "name": "G05 或其他外事授权决定引用"
    },
    {
      "sourceId": "M019",
      "slotId": "m019",
      "name": "变更/延期申请与新版计划"
    },
    {
      "sourceId": "M020",
      "slotId": "m020",
      "name": "旧版计划、原意见和决定快照"
    },
    {
      "sourceId": "M021",
      "slotId": "m021",
      "name": "撤回/终止请求"
    },
    {
      "sourceId": "M022",
      "slotId": "m022",
      "name": "事实异议/正式决定复核申请"
    },
    {
      "sourceId": "M023",
      "slotId": "m023",
      "name": "复核/更正处理结果"
    },
    {
      "sourceId": "M024",
      "slotId": "m024",
      "name": "毕业、学位、结束进修后的成果文书"
    },
    {
      "sourceId": "M025",
      "slotId": "m025",
      "name": "独立资助/经费事项结果引用"
    },
    {
      "sourceId": "M026",
      "slotId": "m026",
      "name": "现行校本进修政策、表单及授权矩阵"
    }
  ],
  "criteria": [
    {
      "sectionId": "rule-checks",
      "criterionId": "r001",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r002",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r003",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r004",
      "srcIds": [],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r005",
      "srcIds": [],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r006",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r007",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r008",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r009",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r010",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r011",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r012",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r013",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r014",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r015",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r016",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r017",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r018",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r019",
      "srcIds": [],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r020",
      "srcIds": [],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r021",
      "srcIds": [],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r022",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r023",
      "srcIds": [],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r024",
      "srcIds": [],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r025",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r026",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r027",
      "srcIds": [
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ],
  "sourceIndexIds": [
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
    "SRC-018",
    "SRC-019",
    "SRC-020"
  ]
} as const
