import type { TemplateVersion } from '@profer/shared'

/** R02 research-only runtime projection; not a CDUT official template or policy version. */
export const templateVersion: TemplateVersion = {
  "templateId": "T03-T02",
  "version": 1,
  "schemaVersion": 2,
  "name": "纵向科研项目立项任务书与责任承担审核",
  "description": "本地研究模板 · 非校方正式模板。适用于“纵向科研项目立项任务书与责任承担审核”的材料、事实与风险核对；政策适用、校内授权及正式决定均须由有权人员确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板。来源文档 docs/design/review-agent/business-templates/R02/T03-T02.md；源文档 SHA-256 bb7575c6b952a8a944ab50bac459833cc4d4d3ec83403372934c69b018a50012；政策证据状态 PARTIAL；不得将 SRC 研究来源伪装为案卷 SourceRef 或正式 PolicyVersion。",
  "objectType": "project",
  "displayName": {
    "template": "{{f002}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "项目唯一号",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“项目唯一号”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f002",
      "label": "正式项目名称",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“正式项目名称”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f003",
      "label": "立项主管机构",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“立项主管机构”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f004",
      "label": "项目计划/资助品种",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“项目计划/资助品种”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f005",
      "label": "批准年度及批次",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“批准年度及批次”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f006",
      "label": "立项批复文号",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“立项批复文号”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f007",
      "label": "正式立项状态及日期",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“正式立项状态及日期”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f008",
      "label": "原申报书有效版本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“原申报书有效版本”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f009",
      "label": "学校承担身份",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“学校承担身份”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f010",
      "label": "校内承担单位",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“校内承担单位”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f011",
      "label": "合作单位集合",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“合作单位集合”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f012",
      "label": "项目—课题—专题上下级关系",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“项目—课题—专题上下级关系”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f013",
      "label": "获批负责人实名",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“获批负责人实名”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f014",
      "label": "负责人校内可信身份关联",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“负责人校内可信身份关联”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f015",
      "label": "课题/专题负责人正式认定",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“课题/专题负责人正式认定”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f016",
      "label": "获批原研究目标/指标",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“获批原研究目标/指标”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f017",
      "label": "任务书载明目标/指标",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“任务书载明目标/指标”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f018",
      "label": "实施起止时间",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“实施起止时间”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f019",
      "label": "约束文书类型",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“约束文书类型”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f020",
      "label": "任务文本现行版本/哈希",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“任务文本现行版本/哈希”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f021",
      "label": "当前业务流转状态",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“当前业务流转状态”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f022",
      "label": "指标差异与条件上下文",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“指标差异与条件上下文”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f023",
      "label": "负责人/相关人员签字状态",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“负责人/相关人员签字状态”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f024",
      "label": "合作单位章状态",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“合作单位章状态”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f025",
      "label": "学校章/用印进度",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“学校章/用印进度”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f026",
      "label": "主管部门受理/签批回执",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“主管部门受理/签批回执”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f027",
      "label": "科研责任承诺适用类别",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“科研责任承诺适用类别”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f028",
      "label": "承诺实际签署状态",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“承诺实际签署状态”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f029",
      "label": "国自然计划书与签页关系",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“国自然计划书与签页关系”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f030",
      "label": "合作任务/协议分工版本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“合作任务/协议分工版本”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f031",
      "label": "任务书项目档案员",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“任务书项目档案员”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f032",
      "label": "该批办理时点",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“该批办理时点”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f033",
      "label": "退回/撤回/重提事件",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“退回/撤回/重提事件”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f034",
      "label": "后续变更有权决定",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“后续变更有权决定”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f035",
      "label": "涉密分流级别",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“涉密分流级别”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f036",
      "label": "操作者可信会话/委托",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“操作者可信会话/委托”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f037",
      "label": "校内经办归口机构",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“校内经办归口机构”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f038",
      "label": "真实签批权限版本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“真实签批权限版本”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f039",
      "label": "材料证据来源及替换版本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“材料证据来源及替换版本”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f040",
      "label": "当前政策时效与适用依据",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“当前政策时效与适用依据”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f041",
      "label": "科研诚信承诺适用与文书覆盖关系",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“科研诚信承诺适用与文书覆盖关系”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "正式立项依据",
      "purpose": "正式立项依据：证明项目已获主管部门正式批准；主管部门批文、正式立项清单、可验证资助结果台账；校方可已归档；L1 起各正式案件本阶段必需；L0 不适用；授权主管系统可验证的正式项目记录；不能以“拟立项公示”代替；F001–F007、F009–F013 / SRC-001、004；同号、年度、承担单位、负责人、批准状态；官方源无法访问→SOURCEUNAVAILABLE；截图待核，不能当批准；主管部门批文、正式立项清单、可验证资助结果台账；校方可已归档；L1 起各正式案件本阶段必需；L0 不适用；授权主管系统可验证的正式项目记录；不能以“拟立项公示”代替",
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
        "正式立项依据",
        "负责人",
        "授权"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m002",
      "name": "原始获准申报书",
      "purpose": "原始获准申报书：冻结研究任务和人员对比基线；项目负责人、上级申报系统及科发院归档的最终电子申请书；L2 起本阶段必需用于比对目标；L1 初登记可后续取；上级可验证“最终提交/获准版本”及其字段；不得拿初稿替代；F008、F011、F016、F022、F029 / SRC-001、012、013；必须是批准对应申报版本，保存页码/哈希；找不到版本→NEEDSMATERIAL/SOURCEUNAVAILABLE；不可读→UNREADABLE；项目负责人、上级申报系统及科发院归档的最终电子申请书；L2 起本阶段必需用于比对目标；L1 初登记可后续取；上级可验证“最终提交/获准版本”及其字段；不得拿初稿替代",
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
        "原始获准申报书",
        "负责人",
        "版本"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m003",
      "name": "任务书填报草稿",
      "purpose": "任务书填报草稿：核当前待审内容；负责人在四川省系统或相应业务系统生成的待审版；省科技计划 C02/C03 L2–L3R 本阶段必需；其他按品种条件；有权系统返回同版本字段/打印预览，经办核验记录；F017–F022、F033 / SRC-001；项目号、草稿提交时点、变更序号；缺→待填报；不可读→补可读版，不索取最终章；负责人在四川省系统或相应业务系统生成的待审版；省科技计划 C02/C03 L2–L3R 本阶段必需；其他按品种条件；有权系统返回同版本字段/打印预览，经办核验记录",
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
        "任务书填报草稿",
        "负责人",
        "版本",
        "任务书"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m004",
      "name": "省科技计划审核后正式任务书",
      "purpose": "省科技计划审核后正式任务书：核实际准备签署的版式和责任；主管部门系统导出的含标识正式版、同版签署原件或历史正式归档件；省科技计划 C04/C05 本阶段必需；C11 对符合当年品种的历史正式任务书条件必需；C01–C03 后续产生；有权系统正式导出件或学校归档的同一正式版；历史文书标识须按对应当批要求确认，不能以2026年格式强制历史批次；F017–F025、F027–F028、F031 / SRC-001、002、005；核正文及签章页同版；2026特定批次二维码/水印仅按当批核；不据标识鉴真；缺→阶段待办或查历史档案；扫描不清→UNREADABLE，不以草稿代替；主管部门系统导出的含标识正式版、同版签署原件或历史正式归档件；省科技计划 C04/C05 本阶段必需；C11 对符合当年品种的历史正式任务书条件必需；C01–C03 后续产生；有权系统正式导出件或学校归档的同一正式版；历史文书标识须按对应当批要求确认，不能以2026年格式强制历史批次",
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
        "省科技计划审核后正式任务书",
        "签章",
        "任务书",
        "批次",
        "签署"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m005",
      "name": "国家重点（重大）项目/专项任务书",
      "purpose": "国家重点（重大）项目/专项任务书：承担层级、指标及负责人；项目牵头单位、课题单位、科发院重大项目办保存的正式任务书或规定层级附件；仅 C06/C07 在任务确定阶段本阶段必需，其他资助类别不借此槽代要求文书；有权牵头单位正式档案/国家科技系统权威任务记录；F009–F020、F030、F034 / SRC-004；项目/课题/专题层级、上下级任务及签发版本；文书不存在与版本未知须区分；跨品种误套时 NOTAPPLICABLE；项目牵头单位、课题单位、科发院重大项目办保存的正式任务书或规定层级附件；仅 C06/C07 在任务确定阶段本阶段必需，其他资助类别不借此槽代要求文书；有权牵头单位正式档案/国家科技系统权威任务记录",
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
        "国家重点（重大）项目/专项任务书",
        "负责人",
        "版本",
        "任务书",
        "附件"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m006",
      "name": "国家自然科学基金资助项目计划书",
      "purpose": "国家自然科学基金资助项目计划书；项目负责人、依托单位与基金委官方系统/正式纸件；C08/C09 获批后计划书阶段本阶段必需；申报阶段后续产生；官方系统计划书及依托单位验证的同版电子/纸件；F017–F021、F029 / SRC-013、014、015；资助批准号与最终申请书一致；缺→NEEDSMATERIAL（仅到此阶段），不可读→重取清晰版；项目负责人、依托单位与基金委官方系统/正式纸件；C08/C09 获批后计划书阶段本阶段必需；申报阶段后续产生；官方系统计划书及依托单位验证的同版电子/纸件",
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
        "国家自然科学基金资助项目计划书",
        "负责人"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m007",
      "name": "国自然申请书纸质签字盖章页",
      "purpose": "国自然申请书纸质签字盖章页；项目负责人、主要参与者、合作/依托单位签章，依托单位归档；C08/C09 纸质计划书签报阶段本阶段必需；获批前不要求；经基金委/依托单位核对的签章页归档记录，不能拿旧申请封面代替；F023、F024、F029 / SRC-013、014；对照 最终电子申请书姓名、单位及签章信息；缺→签报阶段待办；印章模糊→人工验证；项目负责人、主要参与者、合作/依托单位签章，依托单位归档；C08/C09 纸质计划书签报阶段本阶段必需；获批前不要求；经基金委/依托单位核对的签章页归档记录，不能拿旧申请封面代替",
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
        "国自然申请书纸质签字盖章页",
        "负责人",
        "签章"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m008",
      "name": "外部社科项目有权任务约束文本",
      "purpose": "外部社科项目有权任务约束文本：避免强制错误的任务书类型；仅该资助品种主管部门规定/认可的正式任务书、申请书、资助合同或等效约束文件；C10 仅核实该品种有效规定后条件必需；规定未知先判政策待核；上级可核批准文本/确认记录，同一品种具体文书是否可互替必须有明确依据；F016–F020、F040 / SRC-006、007（仅作校级对比和归口提示，不构成外部文书合法替代依据）；明确资助机关、批号、文本类型、版本及生效时点；无外部品种规范→POLICYUNCONFIRMED；不自动判缺任何指定格式；仅该资助品种主管部门规定/认可的正式任务书、申请书、资助合同或等效约束文件；C10 仅核实该品种有效规定后条件必需；规定未知先判政策待核；上级可核批准文本/确认记录，同一品种具体文书是否可互替必须有明确依据",
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
        "外部社科项目有权任务约束文本",
        "版本",
        "任务书",
        "合同"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m009",
      "name": "学校科研工作者承诺书",
      "purpose": "学校科研工作者承诺书：一般责任承诺；负责人签字原件、科发院/学校存档；官网有样件目录；学校校规及实际项目签署阶段条件必需，不能把它当立项前置批复；可验证的校方归档签署件/官方电子签证据；F027、F028 / SRC-003、010；项目号、签署人、表单版次；附件正文尚未核齐；若表单版次未明→人工确认；不按模型生成一份“校规承诺书”；负责人签字原件、科发院/学校存档；官网有样件目录；学校校规及实际项目签署阶段条件必需，不能把它当立项前置批复；可验证的校方归档签署件/官方电子签证据",
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
        "学校科研工作者承诺书",
        "负责人",
        "附件",
        "签署"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m010",
      "name": "包干制试点诚信承诺",
      "purpose": "包干制试点诚信承诺：限定历史项目责任；2023–25 特定四川省项目负责人/科发院归档；C11 经年限及品种命中后签任务书时条件必需，2026 项目不自动触发；校内原始诚信承诺记录；F004、F005、F027、F028 / SRC-005；立项年度与列举项目品种双重命中；未见正式版→归口查历史档案；未核品种→政策待核；2023–25 特定四川省项目负责人/科发院归档；C11 经年限及品种命中后签任务书时条件必需，2026 项目不自动触发；校内原始诚信承诺记录",
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
        "包干制试点诚信承诺",
        "负责人",
        "任务书"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m011",
      "name": "合作协议、合作任务书或分工文本",
      "purpose": "合作协议、合作任务书或分工文本：确认合作任务及责任；牵头单位、合作单位及校方存档的正式协议/该类别合作任务附件；C07/C09 有合作且主管要求时条件必需；NSFC 2026 特定 SDIC 获批后签合作协议；其他品种的合作任务书需先取得适用规定；官方签署/学校归档的同版合作协议或经规定允许的合作任务书；不必重复上传同件；F011、F030 / SRC-004、012、015、016（016仅目录未核）；责任分工、单位名称、签章版与相应主任务文本一致；尚未到签订时点→NOTAPPLICABLE；附件版次不明→POLICYUNCONFIRMED；法律效力争议交 T07/人工；牵头单位、合作单位及校方存档的正式协议/该类别合作任务附件；C07/C09 有合作且主管要求时条件必需；NSFC 2026 特定 SDIC 获批后签合作协议；其他品种的合作任务书需先取得适用规定；官方签署/学校归档的同版合作协议或经规定允许的合作任务书；不必重复上传同件",
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
        "合作协议、合作任务书或分工文本",
        "签章",
        "任务书",
        "附件",
        "签署"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m012",
      "name": "合作单位印章/授权确认",
      "purpose": "合作单位印章/授权确认；合作单位、学校经办用印档案，合同/任务书签章页；C04/C09 涉合作且当批要求时条件必需；早期草稿后续产生；合作方有效电子签章或独立可查用印记录；F011、F024 / SRC-001、013；章名对应单位，签章页与正式稿同版；缺→办理签章待办；只看章图不自动鉴真；合作单位、学校经办用印档案，合同/任务书签章页；C04/C09 涉合作且当批要求时条件必需；早期草稿后续产生；合作方有效电子签章或独立可查用印记录",
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
        "合作单位印章/授权确认",
        "签章",
        "任务书",
        "授权",
        "合同"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m013",
      "name": "专题/负责人特殊认定或调整说明",
      "purpose": "专题/负责人特殊认定或调整说明；项目/课题负责人、承担单位出具的签名盖章说明；C06/C07 遇第7条“未明确/不一致/拟调整”时条件必需；经科发院重大项目办确认的有权说明/批复；F012–F015、F034 / SRC-004；覆盖具体专题、身份和任务书版本；缺或无各级签章→NEEDSHUMANDECISION，不得擅自认定；项目/课题负责人、承担单位出具的签名盖章说明；C06/C07 遇第7条“未明确/不一致/拟调整”时条件必需；经科发院重大项目办确认的有权说明/批复",
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
        "专题/负责人特殊认定或调整说明",
        "负责人",
        "身份",
        "版本",
        "签章"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m014",
      "name": "校内签章及报送动作记录",
      "purpose": "校内签章及报送动作记录；科发院真实用印/报送记录、签章后的正式件；C05 L5 本阶段必需作校内动作证据；C04 正在办理时后续产生；有权校方用印日志和同版正式件；F025、F036、F038 / SRC-001、002；真实经办人、时间、印章、文件哈希；无记录不能根据模糊盖章图片断言校内审批成功；科发院真实用印/报送记录、签章后的正式件；C05 L5 本阶段必需作校内动作证据；C04 正在办理时后续产生；有权校方用印日志和同版正式件",
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
        "校内签章及报送动作记录",
        "时间",
        "签章"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m015",
      "name": "上级受理/签批回执",
      "purpose": "上级受理/签批回执；四川科技厅、基金委或其他主管部门授权系统/正式来函；L6 后要作“已受理/生效事实”时本阶段必需；L1–L5 后续产生；官方查询编号及经校方经办复核的结果；F021、F026 / SRC-001、004、013；归属项目和正式任务书版本，状态与时间；失联→SOURCEUNAVAILABLE；未产生不能提前记通过；四川科技厅、基金委或其他主管部门授权系统/正式来函；L6 后要作“已受理/生效事实”时本阶段必需；L1–L5 后续产生；官方查询编号及经校方经办复核的结果",
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
        "上级受理/签批回执",
        "版本",
        "时间",
        "任务书",
        "授权"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m016",
      "name": "退回、撤回与重提记录",
      "purpose": "退回、撤回与重提记录；主管信息系统操作记录、校方审查日志；C03/C12 触发后本阶段必需；无退回场景不适用；权威操作记录截图可核编号/签发者，或系统原生审计事件；F021、F033、F036、F039 / SRC-001；保留旧稿与新稿版本链，不覆盖原件；只有申请人声称撤回→人工核验，不能标完成；主管信息系统操作记录、校方审查日志；C03/C12 触发后本阶段必需；无退回场景不适用；权威操作记录截图可核编号/签发者，或系统原生审计事件",
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
        "退回、撤回与重提记录",
        "版本"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m017",
      "name": "变更/延期/终止申请与批复",
      "purpose": "变更/延期/终止申请与批复；负责人提出申请，学校/上级主管按权限决定；C13 L7 条件必需；初始立项与尚未变更时不适用；正式批复、备案回执或授权系统可验决定；F018、F020、F034 / SRC-003、004；区分申请版与批准版，记录生效日期；缺批准时保留旧任务书效力，不给变更 PASS；负责人提出申请，学校/上级主管按权限决定；C13 L7 条件必需；初始立项与尚未变更时不适用；正式批复、备案回执或授权系统可验决定",
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
        "变更/延期/终止申请与批复",
        "负责人",
        "日期",
        "任务书",
        "授权"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m018",
      "name": "特定批次项目档案员记载",
      "purpose": "特定批次项目档案员记载；2026 第一批省计划任务书“十、附加条款”第12条；C04 该批条件必需；其他批次不可硬加；当批正式任务书相关栏位，学校若有正式人员登记可校核；F031 / SRC-001；同版正式书所附页，不将独立“档案员证明”虚构为必需；空缺→该批签书待办；其他批次不适用；2026 第一批省计划任务书“十、附加条款”第12条；C04 该批条件必需；其他批次不可硬加；当批正式任务书相关栏位，学校若有正式人员登记可校核",
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
        "特定批次项目档案员记载",
        "任务书",
        "批次"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m019",
      "name": "代理/授权操作记录",
      "purpose": "代理/授权操作记录；有权负责人委托、校方账户代理授权或正式代办凭据；科研秘书/助理代操作、代提交时条件必需；本人办理不需；校方可信账户委托记录（若存在）；人工核验委托范围；F014、F033、F036 / SRC-001、004；代理人≠签署人≠审批人，授权含时效与动作范围；无有效代理记录→不得代签；自行转本人办理；有权负责人委托、校方账户代理授权或正式代办凭据；科研秘书/助理代操作、代提交时条件必需；本人办理不需；校方可信账户委托记录（若存在）；人工核验委托范围",
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
        "代理/授权操作记录",
        "负责人",
        "授权",
        "签署"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m020",
      "name": "当批公告与政策版本",
      "purpose": "当批公告与政策版本；科发院/社科处/主管部门公开通知及校内政策快照；所有案件路由时本阶段必需（由系统取政策，不是用户材料）；经确认的合法印发文本与补充/更正通知；F003–F005、F019、F027、F032、F040 / SRC-001–016；记录 URL、公告版、核验日、适用批次和冲突处理；当前原文不可访问→SOURCEUNAVAILABLE，效力不明→POLICYUNCONFIRMED；科发院/社科处/主管部门公开通知及校内政策快照；所有案件路由时本阶段必需（由系统取政策，不是用户材料）；经确认的合法印发文本与补充/更正通知",
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
        "当批公告与政策版本",
        "版本",
        "批次"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m021",
      "name": "涉密项目安全路由凭据",
      "purpose": "涉密项目安全路由凭据；具权限的学校保密管理系统/经办机构；C14 最初分流时本阶段必需，普通渠道只可取不敏感令牌；安全系统“已接管”最少元数据，不含任务书内容；F035、F036 / SRC-004；不将 P3 原文下载、传送或显示给普通审核系统；无安全通道→NEEDSHUMANDECISION 并停止普通解析；具权限的学校保密管理系统/经办机构；C14 最初分流时本阶段必需，普通渠道只可取不敏感令牌；安全系统“已接管”最少元数据，不含任务书内容",
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
        "涉密项目安全路由凭据",
        "任务书",
        "保密"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m022",
      "name": "可信人事、组织和权限台账核验",
      "purpose": "可信人事、组织和权限台账核验；校方人事/科研管理/审批授权部门；不是申请人上传身份证的替代来源；涉负责人身份、校内经办或签批时条件必需；合法授权校方查询结果，或人工经办核验回执；F010、F013–F015、F036–F038 / SRC-004、007、012；记录校内身份键、核验人及当时授权版本，避免暴露完整证件号；接口不存在不推定通过；采取人工核验，身份争议冻结正式决定；校方人事/科研管理/审批授权部门；不是申请人上传身份证的替代来源；涉负责人身份、校内经办或签批时条件必需；合法授权校方查询结果，或人工经办核验回执",
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
        "可信人事、组织和权限台账核验",
        "负责人",
        "身份",
        "版本",
        "授权"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m023",
      "name": "科研诚信承诺签署或覆盖证明",
      "purpose": "科研诚信承诺签署或覆盖证明：核本品种实际适用承诺，而非再造一个“统一必交件”；学校已签承诺归档、品种专项当批表单；科发院/社科处或有权管理单位持有；只有 R035 证实签署品种、主体、阶段后条件必需；申报前/填报初始未到节点为后续材料；如 M009/M010 已被有权确认覆盖，引用同件、不重复提交；校方签署原件或有权可信记录，包括同件复用批准的政策版本与覆盖范围；私人保证书不能代替；F013、F027、F028、F041 / R025、R026、R035 / SRC-003、005、017；projectKey、signer可信ID、签署时点、policyVersion、sourceVersion、内容及覆盖事项、同件多槽引用关系；文书或具体签署时点未核先 POLICYUNCONFIRMED；应有而无 NEEDSMATERIAL；签名真伪未知 NEEDSHUMANDECISION；扫描不清 UNREADABLE；学校已签承诺归档、品种专项当批表单；科发院/社科处或有权管理单位持有；只有 R035 证实签署品种、主体、阶段后条件必需；申报前/填报初始未到节点为后续材料；如 M009/M010 已被有权确认覆盖，引用同件、不重复提交；校方签署原件或有权可信记录，包括同件复用批准的政策版本与覆盖范围；私人保证书不能代替",
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
        "科研诚信承诺签署或覆盖证明",
        "版本",
        "签署"
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
          "title": "涉密安全分流",
          "requirement": "SRC-004第9条；F001、F035–F036；M021、M022；仅校方保密管理授权记录/非敏感路由标记 B；T/U 不接收或继续处理普通正文，不能靠文本分类模型“解密”。安全管道不存在也不得上传。；T=NEEDSHUMANDECISION（保密分流，不执行内容 R）；F=内容审核继续（本 R NOTAPPLICABLE）；U=NEEDSHUMANDECISION；学校有权保密人员。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "立项后范围与路由",
          "requirement": "SRC-001、SRC-006、SRC-008、SRC-012；F003–F005、F007、F040；M001、M020；以立项主管机构 A、正式品种与资金层级对照学校通告 B；校级社科申报通知不得当外部纵向审批规则；不同学段只按获批身份。；T=PASSFACT（仅路由身份）并执行 R004；F=NOTAPPLICABLE 转申报/校级项目；U=POLICYUNCONFIRMED 或官方源失联 SOURCEUNAVAILABLE；科研归口部门。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "当批政策效力及具体适用",
          "requirement": "SRC-001、SRC-002、SRC-003、SRC-004、SRC-005、SRC-009、SRC-010、SRC-011、SRC-013、SRC-014、SRC-015、SRC-016、SRC-017–021（后4项仅各自限定目的）；F003–F005、F019、F027、F032、F040–F041；M020；对照政策印发/适用期/专项覆盖与后发冲突条款；不能拿2017目录、社科校级公告或跨校转录造硬条件，也不能把 NSFC FAQ 当 CDUT 用印授权。2026-09/10 新近省自然基金规则对2026年1月首批有无过渡效力未核，不能追溯覆盖。原文不可达记录日期与原因。；T=PASSFACT（仅当前所核政策适用事实，不授批准）；F=该专项 NOTAPPLICABLE；U=POLICYUNCONFIRMED（仅数据源断开为 SOURCEUNAVAILABLE）；科发院/社科处政策负责人。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "立项批复真实性",
          "requirement": "SRC-001、004、012；F001、F006–F007；M001、M020；以 A 级批复号、正式项目台账号、批准状态及日期匹配；“推荐”“公示”“申报成功”与正式批复分开。既有校方可信名册可作核查不强制上传。；T=PASSFACT（立项事实）；F=NOTAPPLICABLE 本立项后阶段并路由；U=SOURCEUNAVAILABLE/NEEDSMATERIAL；科发院/社科处。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "正式项目号与文件归属",
          "requirement": "SRC-001、004；F001–F002、F006、F039；M001、M002、M003、M004、M005、M006、M008；A 级项目号+年度+主从层级优先，名称作补证；每份 C/D 证据标项目键与位置，异项目文件绝不串用。更名须有权关联说明。；同归属 PASSFACT；错挂/同号冲突 CONFLICT；无定位 NEEDSMATERIAL / UNREADABLE；案卷经办人/科研归口。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "单位承担关系",
          "requirement": "SRC-001、SRC-004；F009、F010、F011；M001、M005、M022；核 A 级批准单位与 B 级校内组织映射；学院改名或多单位协作不自动构成项目负责人更改，需人工溯源。；匹配 PASSFACT；不属于本校 NOTAPPLICABLE 或证据互斥 CONFLICT；不明 NEEDSHUMANDECISION；相应归口+单位。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R007",
          "title": "国家重点（重大）项目—课题—专题关系",
          "requirement": "SRC-004第2、5–7条；F009、F012、F015；M001、M005；比对 A/C 级项目/课题/专题结构与任务书正文和 CDUT 承担关系；子层级不是新增独立资助批准；只有参与并不当然构成专题负责人。；层级一致 PASSFACT；非专项 NOTAPPLICABLE；错连 CONFLICT；身份裁量 NEEDSHUMANDECISION；重大项目办。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R008",
          "title": "专题负责人特殊认定/调整",
          "requirement": "SRC-004第7、10条；F012–F015、F034；M005、M013、M017、M022；按办法要求核具体有权方签盖章说明/正式调整决定，关联当前专题和文件版本；申请人自制证明 D 无授权效力，未获批准的拟变更不替代原负责人。；有权认定材料事实 PASSFACT；无特殊触发 NOTAPPLICABLE；批准缺失 NEEDSHUMANDECISION/应有 M013 缺 NEEDSMATERIAL；重大项目办与有权牵头方。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R009",
          "title": "负责人身份与本人签署主体",
          "requirement": "SRC-001、003、004；F013–F015；M001、M005、M006、M022；A 级正式负责人名册对 B 级最小化身份键；姓名文本一致不代表同一自然人。人事任职决定归 T02，本规则只消费身份确认。；匹配 PASSFACT；本签署角色不符 CONFLICT/NOTAPPLICABLE；U=NEEDSHUMANDECISION；校方人事核验+科研归口。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R010",
          "title": "代理人操作及真实会话",
          "requirement": "SRC-001、004（责任主体背景，授权细则未核）；F014、F033、F036；M019、M022；B 级服务端会话、校内有效代理授权时间/范围；界面自报角色不可信。代上传不等于代签章、代审批。不可见校方授权时不得推出“允许代办”。；真授权范围内 PASSFACT 仅表示代理操作资格；本人操作本条 NOTAPPLICABLE；代理无凭据 NEEDSHUMANDECISION/应提交官方授权而无材料 NEEDSMATERIAL；身份管理岗。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "校内归口与正式决定权",
          "requirement": "SRC-001、004、007；F036–F038；M014、M020、M022；B 级岗位职责+当时有效授权版本+真实主体会话；社科/科技分别归口。科发院“经办审核”不能提升为上级项目批复权限；本地系统不得签发学校行政决定。；授权事实可核 PASSFACT；无校内动作 NOTAPPLICABLE；未核/越权 NEEDSHUMANDECISION；学校业务/用印权限管理者。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "获准申报书基准版",
          "requirement": "SRC-001、012、013；F008、F016、F039；M001、M002；主管系统 A 或校方可信归档 B 的最终获准版、编号及哈希，D 级个人旧草稿不取代。若主管部门最终批准的附件直接取代原申报文本，须附权威替代链。；基线锁定 PASSFACT；有合法免交依据 NOTAPPLICABLE；缺 NEEDSMATERIAL、官方源断 SOURCEUNAVAILABLE、版本冲突 CONFLICT；负责人/归口。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "项目品种决定的任务约束文本类型",
          "requirement": "SRC-001、004、006、013–016；F004、F019、F040；M004、M005、M006、M008、M011、M020；以适用政策定义主约束文本与合作附件；NSFC 计划书不得拿省任务书代替；SRC-006 校级申请书不能证明外部社科 M008 合法替代；SRC-016 附件内容未核不要求通用提交。；正确品种文本 PASSFACT；尚未到阶段 NOTAPPLICABLE；类型未定 POLICYUNCONFIRMED；资助归口政策岗。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R014",
          "title": "当前阶段文本是否形成",
          "requirement": "SRC-001、002、004、013、014；F017、F020–F021；M003、M004、M005、M006、M016；A/B 级状态时间与对应版本；C02/C03 对 M003、C04/C05 对 M004、C06/C07 对 M005、C08/C09 计划书阶段对 M006。不得以“纸件未盖章”否认已填草稿。；当前文本齐全可读 PASSFACT；未来文书 NOTAPPLICABLE；当前缺 NEEDSMATERIAL；状态不明 SOURCEUNAVAILABLE/NEEDSHUMANDECISION；经办人。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "正式文本版本/可读性",
          "requirement": "SRC-001、002、004、013；F020、F039；M003、M004、M005、M006、M008；锁定 A/B/C 级来源、生成时间、页数、正文/附件/签章页的版本关系；扫描缺页/关键字段 OCR 混淆优先标不可读，哈希不同不等于批准新版本。；可读且同版 PASSFACT；未到阶段 NOTAPPLICABLE；不可读 UNREADABLE；两份均称现行且互斥 CONFLICT；材料持有人/归口。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "研究目标、绩效指标和任务分工差异",
          "requirement": "SRC-001、003第2条、004第10条；F016–F017、F022；M002、M003、M004、M005、M006、M008；冻结目标/指标逐项及原文位置，给出缺项、增项、量纲和文字变化；不同类别不能直接套 SRC-001 “只能增加”说法，路线可否自主调整和重大/重要调整由有权人结合适用政策判定。；全部文本对应且无实质争议可 PASSFACT（仅比对事实）；已知差异 NEEDSHUMANDECISION，正式文本矛盾 CONFLICT；U按缺件/不可读/政策未知分码；项目负责人→科发院/重大项目办。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "执行期限与阶段变更",
          "requirement": "SRC-003第2条、004第10、32条；F018、F034；M001、M003、M004、M005、M006、M017；比起止时间及正式获批调整记录；一般科研路线调整不等同自动延长任务期；延期是否准许、幅度、年限和审批机关不得凭算法设值。；原期限对应 PASSFACT；未触发 NOTAPPLICABLE；期限矛盾 CONFLICT；拟调整未获准 NEEDSHUMANDECISION；项目负责人/主管科研部门。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "合作单位及责任分工",
          "requirement": "SRC-001、004、012、015；F011、F017、F030；M002、M005、M006、M011；逐方校核名称、任务、对应项目层级与当前版协议；只有合作协议才进入 T07 的法务效力核定，本文仅对照分工证据；不同版本的协议与任务书不可拼成一个“完整件”。；同版事实对应 PASSFACT；无合作 NOTAPPLICABLE；分工冲突 CONFLICT/科研实质争议 NEEDSHUMANDECISION；科研归口/合作单位。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R019",
          "title": "2026 省计划第一批档案员条款",
          "requirement": "SRC-001“十、附加条款”第12条；F005、F020、F031；M001、M004、M018、M020；对照当批正式任务书指定栏目与学校归档的档案员姓名角色；不擅自要求独立证明或以 OCR 人名作正式岗位任命。；填写事实 PASSFACT；其他批/早期 NOTAPPLICABLE；该批遗漏 NEEDSMATERIAL；身份权限有疑 NEEDSHUMANDECISION；负责人/科发院。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "当批任务填报及纸件时点",
          "requirement": "SRC-001、002、011、020–021（020为新规时间链提示、021仅检索线索）；F005、F021、F032、F040；M001、M016、M020；校内2026首批线上节点仅摘录 2026-02-03；纸件写“2025年3月6日（星期五）”冲突。第三方转录的省厅流程候选含2月5日/3月6日/3月13日/3月20日不同处理节点，不能将省厅处室审核日等同学校送纸件日。务必回溯上级原版、校内更正及政策过渡后分别配置，不擅自纠正年份/起算终止。；明确无歧义且经有效原文核定的单一事实日期摘录可 PASSFACT；不适用 NOTAPPLICABLE；校内纸件时间冲突或上级关键文本未验 POLICYUNCONFIRMED；不能自动逾期否决；科发院/省厅。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "负责人及关联签名",
          "requirement": "SRC-001、003、004、013、014；F013–F014、F023、F036；M004、M005、M007、M009、M022；以 A/B 身份核验+当前版本 C 签署证据，签页须属于同项目/当前正文；旧版签名、OCR人名、扫描笔迹不能单独证明鉴真或授权。；本人签署事实经核 PASSFACT；未来阶段 NOTAPPLICABLE；该阶段漏签 NEEDSMATERIAL；疑签 NEEDSHUMANDECISION/签页不符 CONFLICT；签署者/校内归口。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "合作单位盖章与法人归属",
          "requirement": "SRC-001、013–015；F011、F024；M004、M007、M011、M012；核当批规定、合作单位与签章主体、签章页哈希对应当前正式版；合作伙伴章真伪/代理签发须有权主体或人工核验，不能靠图像颜色判断。；核验事实 PASSFACT；不适用 NOTAPPLICABLE；应有而缺 NEEDSMATERIAL；旧版章 CONFLICT；真假未定 NEEDSHUMANDECISION；合作方/学校签章经办。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R023",
          "title": "学校用印与校内审查动作",
          "requirement": "SRC-001、002、004；F021、F025、F036–F038；M004、M005、M014、M022；B 级用印台账、审查人授权、用印时间和实际文本版本一致；C04 刚生成正式书时 M014 是未来材料，不可提前报缺。；已核学校用印动作 PASSFACT；未来 NOTAPPLICABLE；已应有而缺 NEEDSMATERIAL；权限或印章不真 NEEDSHUMANDECISION；有权校方用印岗。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "上级接收、签批和任务效力",
          "requirement": "SRC-001、004、013、014；F021、F026；M004、M005、M006、M014、M015；仅 A 级官方回执或经学校查验的有权正式决定号、时间、关联文件版可核接收性质；“已提交”“待受理”“受理”“批准生效”不同状态不可互换。；只对实际官方状态事实给 PASSFACT；未到阶段 NOTAPPLICABLE；源失联 SOURCEUNAVAILABLE、状态含糊 NEEDSHUMANDECISION；主管机关/科研归口。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "一般科研责任承诺适用与签署",
          "requirement": "SRC-003第1条、010、017第15条；F013–F014、F027–F028、F041；M009、M020、M022、M023（仅经校方认可同件覆盖）；核校方指定有效表单、本人/项目归属、签署时间与档案版次；SRC-010只有目录，不能用AI生成承诺代替正式件；SRC-017诚信承诺制度原则不证明另需第三张表。与M023是否同件覆盖由归口有权确认，不按名称自动等同。；适用且已核签 PASSFACT；不适用 NOTAPPLICABLE；明确应有而无 NEEDSMATERIAL；表单/授权不明 POLICYUNCONFIRMED/NEEDSHUMANDECISION；负责人/科发院。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "四川 2023–2025 包干试点诚信承诺",
          "requirement": "SRC-005第3、6条；F004–F005、F027–F028；M001、M004、M010、M020；按当年立项决定、正式四川省计划任务书同版及诚信承诺签署记录，归档复核不得套2026新格式；项目负责人可核但经费支付权不在此。；历史适用且归属匹配 PASSFACT；2026 NOTAPPLICABLE；该批应有缺 NEEDSMATERIAL；原件版本/政策争议 POLICYUNCONFIRMED/NEEDSHUMANDECISION；科发院。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "国自然计划书与纸质签页一致性",
          "requirement": "SRC-012–014；F001、F008、F019、F023、F029；M001、M002、M006、M007、M020；A 级基金获批/计划书、C 级签页逐人单位与最终电子申请书核；NSFC FAQ 纸质两份仅该类问答提示且动态，校内截止另核。计划书在 L2 缺 M007 不是缺件。；对应事实 PASSFACT；未来纸签 NOTAPPLICABLE；该阶段缺页 NEEDSMATERIAL；不同最终版 CONFLICT；文件不可读 UNREADABLE；负责人/科发院。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "特定合作项目协议/合作任务书",
          "requirement": "SRC-015、016；F011、F019、F030、F040；M006、M011、M012、M020；仅 SRC-015 所涉 SDIC 批次能以学校公告确认“获批后合作协议随计划书备案”；SRC-016 目录不能推广其他国基金项目强制签“合作任务书”，协议法务效力由 T07 审，文书归属本文核。；合作分工/备案证据 PASSFACT；未触发 NOTAPPLICABLE；应有文件缺 NEEDSMATERIAL；非特定类未知 POLICYUNCONFIRMED；项目负责人/科发院。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R029",
          "title": "外部社科纵向约束文本",
          "requirement": "SRC-006、007、009、018、019（均不证明外部文本通则）；F003–F005、F007、F019、F040；M001、M008、M020；国家社科2026公告证获准后承担承诺但仍是申报文件；2026-10-08“立项名单公示”不是正式批准，不能成为M001。社科处先取得同品种上级立项后任务/回执/协议要求，确认是否任务书或有效其他文本；没有规范时不得误索 M004/M005，也不得据校级社科“等效”推出通过。；外部合法文本可核后 PASSFACT；校级/未正式立项 NOTAPPLICABLE；当前文书品种无证 POLICYUNCONFIRMED；社科处/上级主管。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "校内退回补正与再提交",
          "requirement": "SRC-001；F020–F021、F033、F036、F039；M003、M016、M019、M022；校方 B/主管 A 级有权操作号、退回理由、退回时间与新旧草稿哈希；要求只补受影响内容，旧意见保留不套新版本。超过次数、期限及正式救济未知，不自拟。；事件证实 PASSFACT 仅表示流程事件；无事件 NOTAPPLICABLE；缺日志 NEEDSMATERIAL/源断 SOURCEUNAVAILABLE；权限争议 NEEDSHUMANDECISION；实际退回经办方。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "主动撤回、重提与复核资格",
          "requirement": "SRC-001、004（未证明通用主动撤回/复核权）；F021、F033、F036、F038–F039；M016、M019、M020、M022；必须区分撤回草稿、上级正式项目撤项和复核申请；校方实际权限与有效系统事件 A/B 对应版本。对无制度证据的复核请求只能转办，不能自动受理、驳回或恢复。；已有官方操作事件 PASSFACT；无触发 NOTAPPLICABLE；未知程序 POLICYUNCONFIRMED；受理裁量 NEEDSHUMANDECISION；有权主管/校内归口。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "已生效任务变更、延期、终止批准",
          "requirement": "SRC-003第2条、004第10–11、32条；F017–F018、F020、F026、F034；M004、M005、M006、M008、M015、M017；冻结 L6 当前有效版，区分申请、批准、备案、撤销，各自生效时点；国家重点（重大）按专门办法，其他种类需其主管规范。仅有申请时不得重设有效目标/负责人。；有权决定存在及版本归属 PASSFACT；无触发 NOTAPPLICABLE；未批变更需 NEEDSHUMANDECISION，权威文书冲突 CONFLICT；上级/专项归口。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R033",
          "title": "证据版本更替与结论失效",
          "requirement": "SRC-001、SRC-003、SRC-004（材料责任背景；失效算法属于研发控制，不声称校规）；F001、F020、F039；M001–M023；以 materialId+projectKey+scopeLevel+sourceVersion+hash 查依赖图；只使消费旧版的 R 事实失效，旧证据/决定原样留痕；新草稿不能覆盖历史已生效批准版，所依其他项目决定须核当前效力。；来源/替换链可核则本规则 PASSFACT（仅版本事件）；另将消费旧版的 R 内部置 STALENEEDSREVIEW 并重审；未变动本规则 NOTAPPLICABLE；不明 NEEDSHUMANDECISION/UNREADABLE；案卷经办与受影响归口。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R034",
          "title": "邻接事项权威结论消费/避免双签批",
          "requirement": "SRC-003、004、007（职责边界而非 G50 完整目录）；F009、F018、F034、F037–F039；M017、M020、M022；仅引用有权决定 issuer+decisionId+scope+effectiveAt+version：科研伦理/成果 G06、财务 G07、采购 T04、一般合同 T07、人事 T02；本模板不复制同一授权签批。G50原始目录未取得时只能建议人工转介而不能捏造 templateid。；权威事实引用可核 PASSFACT（不重新“批准”）；未涉及 NOTAPPLICABLE；目录/权限未知 POLICYUNCONFIRMED/NEEDSHUMANDECISION；相关业务决定 Owner。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R035",
          "title": "立项后科研诚信承诺原件与适用时点",
          "requirement": "SRC-017第14–15、18条；SRC-003第1条；SRC-005第6条；SRC-010、018仅相关背景；F004、F005、F013、F027、F028、F041；M001、M009、M010、M020、M023；用本品种政策版本+权威负责人+签署时点+项目号+表单版号比对原件；经有权校方确认 M009/M010 与 M023 可同件覆盖时建立一个材料ID多槽引用，不索第三份。SRC-017只规定全面承诺制度，并无全部资助品种统一独立第三表和统一签署日。T 且原件缺→补件，存在但扫描不清→不可读，签名真伪/签章授权需人工，不用 OCR 认证。；T且全项可信匹配=PASSFACT（仅签署存在及归属）；F=NOTAPPLICABLE；U=POLICYUNCONFIRMED；当前明确应有却缺=NEEDSMATERIAL、文件已到不可读=UNREADABLE、两版内容冲突=CONFLICT、授权或真实性未核=NEEDSHUMANDECISION；负责人提交→科发院/社科处归口及校方诚信管理人员确认。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "stage-l0",
      "name": "上级尚未正式立项或仅为拟资助",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-l1",
      "workflowOwner": "local"
    },
    {
      "id": "stage-l1",
      "name": "官方立项依据已可核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-l2",
      "workflowOwner": "local"
    },
    {
      "id": "stage-l2",
      "name": "按资助品种填写任务书/计划书或识别等效约束文本",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-l3",
      "workflowOwner": "local"
    },
    {
      "id": "stage-l3",
      "name": "归口校内核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-l4",
      "workflowOwner": "local"
    },
    {
      "id": "stage-l4",
      "name": "有权人员签署、合作单位签章及校方用印（若要求）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-l5",
      "workflowOwner": "local"
    },
    {
      "id": "stage-l5",
      "name": "报送后等待主管部门签批/接收",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-l6",
      "workflowOwner": "local"
    },
    {
      "id": "stage-l6",
      "name": "引用有权受理/生效状态进入执行",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-l7",
      "workflowOwner": "local"
    },
    {
      "id": "stage-l7",
      "name": "后续更正/调整/终止/复核",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "returnToStageId": "stage-l3"
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
  "templateId": "T03-T02",
  "name": "纵向科研项目立项任务书与责任承担审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T03-T02.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T03-T02.md",
  "sourceDocumentSha256": "bb7575c6b952a8a944ab50bac459833cc4d4d3ec83403372934c69b018a50012",
  "sourceDocumentBytes": 149881,
  "officialSchoolTemplate": false,
  "researchEvidenceStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "authoringStatus": "RESEARCH_HANDOFF_READY",
  "criteria": [
    {
      "sectionId": "review-rules",
      "criterionId": "R001",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-008",
        "SRC-012"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-009",
        "SRC-010",
        "SRC-011",
        "SRC-013",
        "SRC-014",
        "SRC-015",
        "SRC-016",
        "SRC-017",
        "SRC-018",
        "SRC-019",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-012"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R007",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R008",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-007"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-006",
        "SRC-013",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R017",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R018",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-012",
        "SRC-015"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-011",
        "SRC-020"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R025",
      "srcIds": [
        "SRC-003",
        "SRC-010",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R026",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R027",
      "srcIds": [
        "SRC-012",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R028",
      "srcIds": [
        "SRC-015",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R029",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-009",
        "SRC-018",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R032",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R033",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R034",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-007"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R035",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-010",
        "SRC-017",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
} as const

export { templateVersion as template }
export default templateVersion
