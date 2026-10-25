import type { TemplateVersion } from '@profer/shared'

/** R02 research-only runtime projection; not a CDUT official template or policy version. */
export const templateVersion: TemplateVersion = {
  "templateId": "T03-T04",
  "version": 1,
  "schemaVersion": 2,
  "name": "科研项目预算调整申请与变更权限审核",
  "description": "本地研究模板 · 非校方正式模板。适用于“科研项目预算调整申请与变更权限审核”的材料、事实与风险核对；政策适用、校内授权及正式决定均须由有权人员确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板。来源文档 docs/design/review-agent/business-templates/R02/T03-T04.md；源文档 SHA-256 11fa6d206cf238637e676330fdcd1303fb3e3d9e839f8b4f6d3012dbe4d6217d；政策证据状态 PARTIAL；不得将 SRC 研究来源伪装为案卷 SourceRef 或正式 PolicyVersion。",
  "objectType": "project",
  "displayName": {
    "template": "{{f002}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "项目唯一编号",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“项目唯一编号”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f002",
      "label": "项目名称",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“项目名称”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f003",
      "label": "资助计划/项目类别",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“资助计划/项目类别”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f004",
      "label": "立项批准年度",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“立项批准年度”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f005",
      "label": "资金管理方式",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“资金管理方式”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f006",
      "label": "学校承担身份及项目层级",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“学校承担身份及项目层级”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f007",
      "label": "执行状态与起止日期",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“执行状态与起止日期”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f008",
      "label": "责任人可信身份",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“责任人可信身份”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f009",
      "label": "当前申请/经办主体",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“当前申请/经办主体”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f010",
      "label": "代理授权及范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“代理授权及范围”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f011",
      "label": "所在单位/归口部门",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“所在单位/归口部门”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f012",
      "label": "有效任务书及变更引用",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“有效任务书及变更引用”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f013",
      "label": "初始批复预算引用",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“初始批复预算引用”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f014",
      "label": "当前有效预算版本",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“当前有效预算版本”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f015",
      "label": "资金来源与用途限制",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“资金来源与用途限制”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f016",
      "label": "当前科目及金额",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“当前科目及金额”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f017",
      "label": "目前项目/课题预算总额",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“目前项目/课题预算总额”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f018",
      "label": "拟调科目/金额",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“拟调科目/金额”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f019",
      "label": "本次净变动与方向",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“本次净变动与方向”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f020",
      "label": "拟购置设备明细及变化",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“拟购置设备明细及变化”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f021",
      "label": "调整原因与任务关联",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“调整原因与任务关联”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f022",
      "label": "现有设备配置/必要性佐证",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“现有设备配置/必要性佐证”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f023",
      "label": "间接费当前与拟调情况",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“间接费当前与拟调情况”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f024",
      "label": "协作参与单位/外拨变化",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“协作参与单位/外拨变化”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f025",
      "label": "政府采购预算变更关联",
      "kind": "boolean",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“政府采购预算变更关联”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f026",
      "label": "结题与结余归属事实",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“结题与结余归属事实”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f027",
      "label": "本次正式提交时间",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“本次正式提交时间”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f028",
      "label": "本案适用政策版本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“本案适用政策版本”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f029",
      "label": "当前申请与材料版本",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“当前申请与材料版本”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f030",
      "label": "决定机构与签发身份",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“决定机构与签发身份”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f031",
      "label": "正式决定结论/文号/时间",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“正式决定结论/文号/时间”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f032",
      "label": "财务记账/备案生效记录",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“财务记账/备案生效记录”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f033",
      "label": "撤回/复核请求与办理结论",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“撤回/复核请求与办理结论”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f034",
      "label": "涉密等级/处理渠道判别",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“涉密等级/处理渠道判别”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f035",
      "label": "资金政策适用批次和时间轴",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“资金政策适用批次和时间轴”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f036",
      "label": "设备购置费净增量",
      "kind": "boolean",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“设备购置费净增量”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f037",
      "label": "间接费用重新核定差额及资助期满日",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“间接费用重新核定差额及资助期满日”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f038",
      "label": "社科主管级别与调剂类别",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“社科主管级别与调剂类别”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f039",
      "label": "已核签发权链与决定作用域",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“已核签发权链与决定作用域”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f040",
      "label": "合作研究外拨与补充协议版本",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“合作研究外拨与补充协议版本”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "项目归属、计划批次与承担角色",
      "purpose": "项目归属、计划批次与承担角色；科发院/社科处；正式项目台账、立项通知或有权系统导出；当前必需，A–H 基础；可信校科研台账直接取用；无接口则校科研部门可核导出，不接受私人清单冒充；F001–F008、F011；SRC-001–004、009；必须与项目/课题/专题层级及立项年绑定；缺失 NEEDSMATERIAL，源失联 SOURCEUNAVAILABLE，模糊 UNREADABLE；科发院/社科处；正式项目台账、立项通知或有权系统导出；当前必需，A–H 基础；可信校科研台账直接取用；无接口则校科研部门可核导出，不接受私人清单冒充",
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
        "项目归属、计划批次与承担角色",
        "批次"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m002",
      "name": "批复任务、责任人与执行期",
      "purpose": "批复任务、责任人与执行期；负责人/归口处/资助方；已签任务书、立项批复、有效变更任务书；当前必需，除权威台账已完整证明且业务允许直接引用；主管部门已签批的数字任务书或正式校台账关联；OCR 截图仅待核；F001–F008、F012、F015；SRC-001、002、003、004；优先最新有效签批版，含签署主体和项目 ID；旧版冲突 CONFLICT，不得由模型选择新旧；负责人/归口处/资助方；已签任务书、立项批复、有效变更任务书；当前必需，除权威台账已完整证明且业务允许直接引用；主管部门已签批的数字任务书或正式校台账关联；OCR 截图仅待核",
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
        "批复任务、责任人与执行期",
        "负责人",
        "任务书",
        "签署"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m003",
      "name": "原批准和当前有效预算",
      "purpose": "原批准和当前有效预算；财务处/科研归口/资助方；核定预算、预算附件与已生效调剂/账务记录；预算制 A–D 当前必需；包干制仅当确有采购或资金预算事实时条件必需；校财务授权只读账套、有效预算版本及正式批复组合；不得要求重复上传同一有效表；F013–F017、F023；SRC-001、002、009；标明初批/最新有效、项目层级/币种/快照时间；缺版待补，系统失联 SOURCEUNAVAILABLE，数值不清 UNREADABLE；财务处/科研归口/资助方；核定预算、预算附件与已生效调剂/账务记录；预算制 A–D 当前必需；包干制仅当确有采购或资金预算事实时条件必需；校财务授权只读账套、有效预算版本及正式批复组合；不得要求重复上传同一有效表",
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
        "原批准和当前有效预算",
        "版本",
        "时间",
        "预算",
        "授权"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m004",
      "name": "申请身份与责任人绑定",
      "purpose": "申请身份与责任人绑定；学校身份/项目管理部门；可信登录身份、人员台账与项目负责人关系；当前必需，A–H；已认证的校登录会话加项目授权关系即可；不得索身份证复印件作为默认文件；F008–F011；SRC-001、002、003、004；绑定在当前项目/申请版上；姓名相同但 ID 不同 CONFLICT，身份源失联不准用 Renderer 自报角色；学校身份/项目管理部门；可信登录身份、人员台账与项目负责人关系；当前必需，A–H；已认证的校登录会话加项目授权关系即可；不得索身份证复印件作为默认文件",
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
        "申请身份与责任人绑定",
        "负责人",
        "身份",
        "授权"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m005",
      "name": "申请说明与逐科目变更方案",
      "purpose": "申请说明与逐科目变更方案；负责人/授权提交人；申请正文、变更表或经批准的校系统结构化提交；A–D、E2、F2、G 当前必需；E1/F1 未触发调剂时不必需；已确认适用 SRC-005 流程的系统提交记录可替代 PDF；SRC-012 提纲仅作格式线索；F018、F019、F021、F027、F029；SRC-001、002、005、012；以提交版号/可追溯哈希绑定 M003，不得拿不同项目预算作对照；理由不清 NEEDSMATERIAL，表格坏页 UNREADABLE；负责人/授权提交人；申请正文、变更表或经批准的校系统结构化提交；A–D、E2、F2、G 当前必需；E1/F1 未触发调剂时不必需；已确认适用 SRC-005 流程的系统提交记录可替代 PDF；SRC-012 提纲仅作格式线索",
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
        "申请说明与逐科目变更方案",
        "负责人",
        "预算",
        "授权"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m006",
      "name": "设备费清单及前后变化",
      "purpose": "设备费清单及前后变化；项目负责人/采购资产相关部门；拟购设备明细、预算设备清单及差异；B/C 当前必需；D2 涉设备条件必需；正式预算附件中已有清单可引用，只补实际变化项；F016、F018–F020；SRC-001、002、012；清单应绑定项目、设备条目/预算版本；缺项待补，型号/金额冲突 CONFLICT；项目负责人/采购资产相关部门；拟购设备明细、预算设备清单及差异；B/C 当前必需；D2 涉设备条件必需；正式预算附件中已有清单可引用，只补实际变化项",
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
        "设备费清单及前后变化",
        "负责人",
        "版本",
        "金额",
        "预算"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m007",
      "name": "现有设备配置与增购必要性",
      "purpose": "现有设备配置与增购必要性；学院、资产或项目负责人；设备配置记录、需求/共享设备说明；C 当前条件必需；D2 设备调增适用时必需；学院或资产部门的可信配置核验可替代申请人手工证明；F020、F022；SRC-001 第 2 条，SRC-002 第 12、17 条；反映申请时配置状态及核查时间；缺核验事实 NEEDSMATERIAL，经济合理性留人工；学院、资产或项目负责人；设备配置记录、需求/共享设备说明；C 当前条件必需；D2 设备调增适用时必需；学院或资产部门的可信配置核验可替代申请人手工证明",
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
        "现有设备配置与增购必要性",
        "负责人",
        "时间"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m008",
      "name": "间接费调整依据",
      "purpose": "间接费调整依据；财务处/项目负责人；原预算间接费额度、调剂说明、资助规定；仅触及间接费时条件必需；M003 已含可信明细则不重复上传；取得主管机关适用规定；F015、F023、F028；SRC-001、002、009、012（提纲效力待核）；同一预算制及版本；“不得调增”是否适用需核项目类别，政策冲突 POLICYUNCONFIRMED；财务处/项目负责人；原预算间接费额度、调剂说明、资助规定；仅触及间接费时条件必需；M003 已含可信明细则不重复上传；取得主管机关适用规定",
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
        "间接费调整依据",
        "主管机关",
        "负责人",
        "版本",
        "预算"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m009",
      "name": "课题间调剂/参与单位或外拨变化",
      "purpose": "课题间调剂/参与单位或外拨变化；牵头/承担单位、负责人；课题预算附表、外拨安排、合作单位变更说明；D1 当前必需；D2 仅触发跨主体时必需；有效任务书/外拨协议/校科研系统已保存的相关权威内容；F006、F017–F019、F024；SRC-002 第 15、17 条，SRC-009 第 23 条；项目/课题/专题层级及受款单位一一对应；无外部批准不视为已同意，金额冲突 CONFLICT；牵头/承担单位、负责人；课题预算附表、外拨安排、合作单位变更说明；D1 当前必需；D2 仅触发跨主体时必需；有效任务书/外拨协议/校科研系统已保存的相关权威内容",
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
        "课题间调剂/参与单位或外拨变化",
        "负责人",
        "金额",
        "预算",
        "任务书"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m010",
      "name": "政府采购预算及调整影响",
      "purpose": "政府采购预算及调整影响；采购/资产及科研管理部门；已批政府采购预算、拟变更及关联编号；E2/F2 当前必需；B/C 若影响政府采购则条件必需；T04/采购系统的有效预算或决定记录，只读复用；不得再审采购方式；F020、F025；SRC-003 第 10 条、SRC-004 第 8 条；同采购项目、资金来源、预算版；不可读 UNREADABLE，无法证实是否存在采购预算则人工分流；采购/资产及科研管理部门；已批政府采购预算、拟变更及关联编号；E2/F2 当前必需；B/C 若影响政府采购则条件必需；T04/采购系统的有效预算或决定记录，只读复用；不得再审采购方式",
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
        "政府采购预算及调整影响",
        "预算"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m011",
      "name": "已结题与结余资金归属、可用额度",
      "purpose": "已结题与结余资金归属、可用额度；科研归口/财务处/资助方；结题验收决定、结余预算及财务记录；G 当前必需；正式结题/财务账套可核记录直接引用，不能用项目组自报余额；F007、F014、F026；SRC-007（办法全文待核），SRC-002 第 19 条；必须区分项目结题、财务结账、主管机关结余留用；不足 POLICYUNCONFIRMED/SOURCEUNAVAILABLE；科研归口/财务处/资助方；结题验收决定、结余预算及财务记录；G 当前必需；正式结题/财务账套可核记录直接引用，不能用项目组自报余额",
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
        "已结题与结余资金归属、可用额度",
        "主管机关",
        "预算"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m012",
      "name": "已批准的研究任务/承担单位变更",
      "purpose": "已批准的研究任务/承担单位变更；相关 T03 科研任务流程和资助主管机关；有效变更决定；只在预算变更以研究任务先决变化为条件时必需；相邻科研事项权威决定编号及已核任务书新版本；F012、F024；SRC-001 第 2 条（一）、SRC-002 第 10 条；必须早于依赖其生效的预算调整；未批准不可把待审批研究任务视为有效事实；相关 T03 科研任务流程和资助主管机关；有效变更决定；只在预算变更以研究任务先决变化为条件时必需；相邻科研事项权威决定编号及已核任务书新版本",
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
        "已批准的研究任务/承担单位变更",
        "主管机关",
        "版本",
        "预算",
        "任务书"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m013",
      "name": "适用校本/资助政策快照",
      "purpose": "适用校本/资助政策快照；科发院/社科处/法务或模板管理员；有效政策原文及确认记录；系统内引证，S0–S5；不是申请人上传义务；SRC 正文、校方书面解释、正式现行目录；不得使用外校政策替代；F003–F006、F028；SRC-001–012；绑定政策生效窗口、项目批次；缺现行性 POLICYUNCONFIRMED，不能称校方批准；科发院/社科处/法务或模板管理员；有效政策原文及确认记录；系统内引证，S0–S5；不是申请人上传义务；SRC 正文、校方书面解释、正式现行目录；不得使用外校政策替代",
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
        "适用校本/资助政策快照",
        "批次"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m014",
      "name": "涉密分类及处理渠道确认",
      "purpose": "涉密分类及处理渠道确认；校保密归口/科研主管；项目保密标记与线下移交状态；S0 条件必需：项目密级未知、疑涉密或专项涉密时，内容读取前先确认；由有权保密部门在合规环境内确认；不要求申请人向普通系统上传涉密证明正文；F034；SRC-002 第 9 条；含密级/处理渠道及确认时间；不明确即暂停普通 AI 接触并人工分流；校保密归口/科研主管；项目保密标记与线下移交状态；S0 条件必需：项目密级未知、疑涉密或专项涉密时，内容读取前先确认；由有权保密部门在合规环境内确认；不要求申请人向普通系统上传涉密证明正文",
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
        "涉密分类及处理渠道确认",
        "时间",
        "保密"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m015",
      "name": "学院审核意见或批准",
      "purpose": "学院审核意见或批准；学院/教学科研单位有权签发人；审批回执、有效签章文书；S4 后续才产生，B/C、D 指定路径；经认证电子审批事件可替纸签；具体认可方式待校本核定；F030、F031；SRC-001 第 2 条、SRC-002 第 29 条、SRC-012（只作提纲）；必须引用本次 M005/M003 版；申请首阶段不要求，伪造身份/版本不符 CONFLICT；学院/教学科研单位有权签发人；审批回执、有效签章文书；S4 后续才产生，B/C、D 指定路径；经认证电子审批事件可替纸签；具体认可方式待校本核定",
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
        "学院审核意见或批准",
        "身份",
        "版本",
        "签章"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m016",
      "name": "科研部门、牵头单位、专业机构或主管部门批准/备案",
      "purpose": "科研部门、牵头单位、专业机构或主管部门批准/备案；按项目类型有权单位；决定文书、主管平台回执、转报记录；S4/S5 后续才产生，C、D、E2/F2 等按情形触发；官方授权系统的带文号/版本/签发身份事件；校内意见不得替外部同意；F030、F031；SRC-001、002 第 17、29 条、SRC-003/004、SRC-009；分批准与备案、权力层级和文号；未发生不是当前缺件；签署者不可信 NEEDSHUMANDECISION；按项目类型有权单位；决定文书、主管平台回执、转报记录；S4/S5 后续才产生，C、D、E2/F2 等按情形触发；官方授权系统的带文号/版本/签发身份事件；校内意见不得替外部同意",
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
        "科研部门、牵头单位、专业机构或主管部门批准/备案",
        "身份",
        "版本",
        "授权",
        "签署"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m017",
      "name": "财务预算变更生效/备案流水",
      "purpose": "财务预算变更生效/备案流水；财务处；财务系统最新预算版本、记账/备案回执；S5 后续才产生，申请批准后依制度核验；校财务权威只读记录替截图；未接接口可用签发可核凭证；F014、F032；SRC-001 第 12 条、SRC-002 第 5、17 条；绑定最终批准预算版；缺失不等于未获批准，财务源失联 SOURCEUNAVAILABLE；财务处；财务系统最新预算版本、记账/备案回执；S5 后续才产生，申请批准后依制度核验；校财务权威只读记录替截图；未接接口可用签发可核凭证",
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
        "财务预算变更生效/备案流水",
        "版本",
        "预算"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m018",
      "name": "代理授权证明",
      "purpose": "代理授权证明；负责人/校职能部门；授权委托、可核电子代理关系；H1 代理时条件当前必需，有可信校授权记录则免上传；校内部授权、职务代理登记（须有实际授权效力）；不能凭科研助理名片；F009、F010；SRC-002 第 16 条只证助理服务职能，代理许可仍待校本核；限本人、项目、行为范围、期限；缺失人工确认，不暗授权；负责人/校职能部门；授权委托、可核电子代理关系；H1 代理时条件当前必需，有可信校授权记录则免上传；校内部授权、职务代理登记（须有实际授权效力）；不能凭科研助理名片",
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
        "代理授权证明",
        "负责人",
        "授权",
        "期限"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m019",
      "name": "撤回/异议/复核请求及回复",
      "purpose": "撤回/异议/复核请求及回复；申请人、有权受理/决定机构；请求书、系统受理和答复记录；H2 在 S6 发起时条件必需；受理与回复后续才产生；同案卷可信事件记录；原 M001–M017 不重复上传；F029、F033；程序来源待校本核，SRC-001/002 未给通用期限；绑定原决定、申请版和请求版本；无机关/期限依据保持 POLICYUNCONFIRMED，不能自动撤销；申请人、有权受理/决定机构；请求书、系统受理和答复记录；H2 在 S6 发起时条件必需；受理与回复后续才产生；同案卷可信事件记录；原 M001–M017 不重复上传",
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
        "撤回/异议/复核请求及回复",
        "版本",
        "期限"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m020",
      "name": "NSFC 设备购置费与间接费联动测算证据",
      "purpose": "NSFC 设备购置费与间接费联动测算证据；财务处/NSFC 资助方；设备购置费原核定和变更、间接费原核定/重算、资助期满日；I 类触发设备购置费调增时 S2 条件输入；正式结题结算/退回记录 S5/S6 后续才产生；已签预算+财务核算表/NSFC 官方数据，不以申请人自算取代；F036/F037；R034；SRC-009/013；与项目、预算版、币种和资助期一一对应，缺源 SOURCEUNAVAILABLE；不要求 S1 提供尚未形成的结题文书；财务处/NSFC 资助方；设备购置费原核定和变更、间接费原核定/重算、资助期满日；I 类触发设备购置费调增时 S2 条件输入；正式结题结算/退回记录 S5/S6 后续才产生；已签预算+财务核算表/NSFC 官方数据，不以申请人自算取代",
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
        "NSFC 设备购置费与间接费联动测算证据",
        "预算"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m021",
      "name": "主管资金办法、指南与批次适用证明",
      "purpose": "主管资金办法、指南与批次适用证明；资助机关、科发院/社科处；当批资助通知、政策原文、适用性解释；S0–S5 内部政策材料，J/K/L 等政策分支当前依赖；非申请人默认上传义务；可信政策发布源与项目任务书交叉引用，校内确认另立签发版本；F028/F035/F038；R035/R036/R037/R038；SRC-008/013–018；缺校方持有政策不得转成申请者违规；旧新版本冲突 POLICYUNCONFIRMED；资助机关、科发院/社科处；当批资助通知、政策原文、适用性解释；S0–S5 内部政策材料，J/K/L 等政策分支当前依赖；非申请人默认上传义务；可信政策发布源与项目任务书交叉引用，校内确认另立签发版本",
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
        "主管资金办法、指南与批次适用证明",
        "版本",
        "任务书",
        "批次"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m022",
      "name": "项目×动作×机构签发授权矩阵",
      "purpose": "项目×动作×机构签发授权矩阵；校内权限管理员/资助主管机关；有效角色配置、正式岗位委托与签发链；S4/S6 验签时条件依赖；研究稿不要求申请者上传，也不强迫 S1 先有审批结果；后端可信身份/正式授权文件；不是 Renderer role 或 OCR 印章；F030/F031/F039；R029/R038；SRC-001/002/009/010/015/016；未证实权限则 NEEDSHUMANDECISION；校外签发权不能由本地配置凭空产生；校内权限管理员/资助主管机关；有效角色配置、正式岗位委托与签发链；S4/S6 验签时条件依赖；研究稿不要求申请者上传，也不强迫 S1 先有审批结果；后端可信身份/正式授权文件；不是 Renderer role 或 OCR 印章",
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
        "项目×动作×机构签发授权矩阵",
        "主管机关",
        "身份",
        "授权"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m023",
      "name": "合作研究外拨变更的有效补充协议",
      "purpose": "合作研究外拨变更的有效补充协议；项目依托/合作研究单位；经双方有权主体签署的补充协议及版本；NSFC 外拨变化 S4/S5 条件后续产生；S1 只需 M009 的拟变更和原协议；正式双方签署版本/可验证合同档案，引用原合作关系；F024/F040；R039；SRC-013 第 17 项；不能在申请阶段报缺未来协议；签署后版本不匹配 CONFLICT，未签时转有权单位办理；项目依托/合作研究单位；经双方有权主体签署的补充协议及版本；NSFC 外拨变化 S4/S5 条件后续产生；S1 只需 M009 的拟变更和原协议；正式双方签署版本/可验证合同档案，引用原合作关系",
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
        "合作研究外拨变更的有效补充协议",
        "版本",
        "合同",
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
          "title": "涉密安全门禁",
          "requirement": "T=可信密级标记涉密；F=可信明确非涉密；U=未取得可信分类/项目类别疑涉密；SRC-002 第 9 条、SRC-010 第 36 条；F003/F034；M001/M014；A 的保密归口记录优先，项目批次/密级随任务书变更重验；涉密及 U 均不得将正文送普通 OCR，例外须有专用合规环境证明；T=NEEDSHUMANDECISION→校保密归口线下；F=PASSFACT→S0 其他核验；U=SOURCEUNAVAILABLE 或 POLICYUNCONFIRMED→保密归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "项目编号、层级及责任单位唯一归属",
          "requirement": "T=存在可核项目记录；F=确认所提交对象非本校承担的科研项目；U=编号/层级缺失或互相矛盾；SRC-001 第 1–2 条、SRC-002 第 2、5 条；F001–F003/F006/F011；M001/M002；A 台账与 B 任务书按编号、所属课题/专题和承担单位核对；同名项目不能视为同一项目；以申请时有效项目关系为准；T 一致=PASSFACT→科研归口；T 冲突=CONFLICT；F=NOTAPPLICABLE→路由管理员；U 缺资料=NEEDSMATERIAL/台账失联=SOURCEUNAVAILABLE→科研归口",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "R003",
          "title": "立项批次、任务书状态与实施期",
          "requirement": "T=已立项且需在某执行状态下办理；F=项目仍处申报前、并无生效任务书；U=延期、终止或结题状态不清；SRC-001 第 2 条、SRC-002 第 7、28–29 条、SRC-003 第 3 条；F004/F007/F012；M001/M002/M011；A/B 任务书及获批延期、结题文书核年限，不以申请自写截止日取代；已结题转 R024，不机械拒绝；T=PASSFACT→科研归口；F=NOTAPPLICABLE→立项事项；U=CONFLICT/NEEDSMATERIAL→项目管理岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "资金制式、专项类别与校方承担身份",
          "requirement": "T=资助资金方式/计划及牵头身份可证；F=明确落在 T03-T04 以外的普通财务或合同业务；U=政策分层及预算制/包干制不明；SRC-001–004、SRC-009 第 23–24 条、SRC-010 第 3、5、30 条；F003–F006/F028；M001/M002/M013；A/B 立项任务书+有效专项指南，按资助批次、中央财政前补助/其他资金、牵头/参与识别；不能仅凭科目表出现就把包干制判为预算制；T=PASSFACT→科发院/社科处分类岗；F=NOTAPPLICABLE→邻接事项；U=POLICYUNCONFIRMED→归口政策岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "真实负责人和申请身份绑定",
          "requirement": "T=由负责人提出/操作；F=确认只有无权他人主张办理；U=身份源或负责人变更记录不可核；SRC-001 第 2 条、SRC-002 第 7、13 条；F008/F009/F011；M001/M002/M004；A 校登录主体 ID 与 B 当前任务书责任人匹配，姓名同形不是同一人；负责人变更必须引用正式有效记录；Renderer actor 不可信；T=PASSFACT→经办/科研归口；F=NEEDSHUMANDECISION→校身份及归口核权；U=SOURCEUNAVAILABLE/CONFLICT→校身份核验岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "代办授权作用域",
          "requirement": "T=F009≠F008 且以代理身份提交；F=同一可信负责人本人办理；U=代理关系未证明；SRC-002 第 16 条仅证助理服务，不证审批代理权；F008–F010；M004/M018/M013；A 授权台账或 B 可验委托，核项目、动作、起止日与授权人；C 自称助理不合格；代理能否提交由校方补证；T 已核授权且校方允许=PASSFACT→受理岗；T 超权=NEEDSHUMANDECISION；F=NOTAPPLICABLE；U=POLICYUNCONFIRMED/NEEDSMATERIAL→归口授权岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "政策生效版本与提纲冲突",
          "requirement": "T=具体项目有多个声称适用的政策/表单；F=已证单一有效规范且无争议；U=现行目录或时效缺失；SRC-001 第 13 条、SRC-002 第 36–37 条、SRC-005/008/010/011/012；F003–F005/F027/F028；M002/M013；以发布机构、文号、施行/废止、资助方专项文件和立项/申请日期逐一比；SRC-012 的设备费“不能调增”对 SRC-001 不得自动覆盖；外校说明不构成 A；T 有冲突=POLICYUNCONFIRMED→科发院/社科处书面解释；F=PASSFACT→原规则；U=POLICYUNCONFIRMED→政策归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "原批与当前有效预算基线",
          "requirement": "T=预算制项目需要逐科目调剂；F=已核包干制普通使用不存在逐科目预算；U=当前预算版本/层级不明；SRC-001 第 2 条、SRC-002 第 17 条、SRC-010 第 29、40 条；F013–F017；M002/M003/M017；A 财务最新生效版优先于 C 申请附件；B 批复用于追溯初始预算；按项目/课题/来源、币种与快照日对齐，不能拿未备案计划作当前基线；T 一致=PASSFACT→科研财务事实核验；T 版本冲突=CONFLICT；F=NOTAPPLICABLE；U=SOURCEUNAVAILABLE/NEEDSMATERIAL",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "R009",
          "title": "科目拟调金额与合计计算",
          "requirement": "T=本次有明确数值变更；F=确证纯包干制无科目变更；U=旧/新金额或币种缺失；SRC-001 第 2 条、SRC-002 第 17 条、SRC-010 第 40 条；F016–F020；M003/M005/M006；C 拟调数与 A 当前预算逐行比较，固定币种、同一预算层级重算净差；不自动假定总额可变或同项目跨单位可互抵；换版须重算；T 算术一致=PASSFACT→科研财务岗；不等或错基线=CONFLICT；F=NOTAPPLICABLE；U=NEEDSMATERIAL/UNREADABLE",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "R010",
          "title": "调剂事由与项目任务关联",
          "requirement": "T=提交了正式调整说明；F=E1/F1 等无需调剂申请；U=理由或有效任务依据缺失；SRC-001 第 2 条、SRC-002 第 10、17 条；F012/F021；M002/M005；C 理由与 B 任务书关联项目与活动，可核“已陈述、未串项目”；必要性、绩效及经济合理性不由 AI 实体裁定；T 事实一致=PASSFACT，必要性仍可 NEEDSHUMANDECISION→学院/科发院；F=NOTAPPLICABLE；U=NEEDSMATERIAL",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "A：一般预算制非设备费自主调剂适用",
          "requirement": "T=预算制纵向、项目内业务费/劳务费直接费调剂且无专项更高权审批；F=设备费/总额/跨课题或包干制；U=科目/专项约束未知；SRC-001 第 2 条、SRC-009 第 24 条；F003/F005/F016–F019/F023/F028；M003/M005/M013；A 政策+财务类别、C 本次方向；不得把负责人自主权限当成系统自动“批准”，重大专项先走 R014–R018；T=PASSFACT（权限分类）→可信项目负责人及按规留痕；F=NOTAPPLICABLE→其他案型；U=POLICYUNCONFIRMED→科研归口",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R012",
          "title": "B：设备费调减、结构/明细调整",
          "requirement": "T=一般预算制设备费减少或清单结构变化；F=无设备变化/为调增；U=设备费新旧版不清；SRC-001 第 2 条、SRC-012（待核载体）；F016–F020；M003/M005/M006/M015；A 旧预算设备清单与 C 新清单差异，认定触发学院审批路径；M015 是 S4 结果，不在 S1 检缺；已走 R016 的重大专项先核专项优先级；T=PASSFACT（路径）→学院有权负责人 S4；F=NOTAPPLICABLE；U=NEEDSMATERIAL/CONFLICT→科研归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "C：设备费调增路径",
          "requirement": "T=一般预算制设备费增额；F=不调增；U=金额、现有设备或政策冲突未解；SRC-001 第 2 条、SRC-012（效力未知）；F016–F022/F028；M003/M005/M006/M007/M013/M015/M016；A 旧版+B/C 论证、学院现有配置事实比对；2024 校本正文载“学院审核后科研部门审批”，但无日期提纲称禁止调增：两者效力未澄清不能硬判；T 事实=PASSFACT，权限冲突=POLICYUNCONFIRMED→科发院解释；必要性=NEEDSHUMANDECISION→学院/科研部门；F=NOTAPPLICABLE；U 待补 M007",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "D1：国家重点研发项目预算总额变更",
          "requirement": "T=项目总额变化；F=总额已证不变；U=项目层级/总额不清；SRC-002 第 17 条、SRC-010 第 40 条（一）；F006/F014/F017–F019/F028；M002/M003/M005/M009/M016；A/B 项目总额及中央财政前补助口径，查项目承担单位→专业机构→主责单位链；SRC-010 第 12、15 条的“重点专项概算”非本规则项目层级；T=PASSFACT（升级路径）→项目承担单位及专业机构；F=NOTAPPLICABLE→R015–R018；U=CONFLICT/POLICYUNCONFIRMED→重大项目办",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "R015",
          "title": "D1：课题间、参与单位及外拨变更",
          "requirement": "T=同项目课题间调剂/变更课题承担参与单位/课题参与单位间调剂；F=无跨层级/主体变化；U=调出调入主体不明；SRC-002 第 17 条、SRC-009 第 23 条（仅 NSFC）、SRC-010 第 40 条（二）（三）；F006/F017–F019/F024；M002/M003/M005/M009/M016；A/B 任务书单位及层级+拟外拨表；区分前者需专业机构审核批准、后者总额不变可项目承担单位审批报备案；不同项目资助方分流，不跨机构代签；T=PASSFACT（精确路径待主体核权）→牵头/承担单位、专业机构；F=NOTAPPLICABLE；U=NEEDSMATERIAL/POLICYUNCONFIRMED",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R016",
          "title": "D2：重点研发课题设备费调剂",
          "requirement": "T=国家重点研发中央财政前补助课题预算总额不变且涉及设备费；F=不涉及设备费/非该资金类型；U=课题总额或资金来源不清；SRC-002 第 17 条、SRC-010 第 40 条（三）；F005/F006/F017–F020/F022；M002/M003/M005/M006/M007/M013/M015；A 课题额度与 B/C 清单、现有设备配置证据；国家办法由研究任务负责人提出、所在单位综合配置办理，校内审核层级按专项和授权核，不以 SRC-012 一概禁止；T 数据可核但仍需配置/必要性决定=NEEDSHUMANDECISION（事实比较另存）→承担单位/重大项目办；F=NOTAPPLICABLE；U=POLICYUNCONFIRMED/NEEDSMATERIAL",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R017",
          "title": "D2：重点研发其他直接费自主调剂",
          "requirement": "T=国家重点研发中央财政前补助且仅设备费外其他直接费调剂；F=设备费、间接费、总额/单位变更；U=费用分类未明；SRC-002 第 17 条、SRC-010 第 40 条（四）；F005/F016–F019/F023/F028；M003/M005/M013；A 政策及有效预算类别对 C 申请值，先排除交叉触发 R014–R016/R018；科研实际需要的自主安排仍需可信责任人；T=PASSFACT→课题/参与单位任务负责人；F=NOTAPPLICABLE；U=POLICYUNCONFIRMED/CONFLICT→重大项目办",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R018",
          "title": "间接费用变更的方向与主体",
          "requirement": "T=间接费总额/单位分配变更；F=明确不涉间接费；U=批复基线/项目政策不清；SRC-009 第 24 条、SRC-010 第 40 条（五）、SRC-012（待核）；F015/F023/F028；M003/M005/M008/M013；A 资金办法+核定间接费，C 调增/调减说明；仅 SRC-010 所适用的课题间接费总额不得调增可识别为政策不符候选，正式解释由主管机构；其他计划不得套用；T 方向核对=PASSFACT，禁令/协商事项=NEEDSHUMANDECISION→课题承担单位/资金主管；F=NOTAPPLICABLE；U=POLICYUNCONFIRMED",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R019",
          "title": "E1：2023–2025 四川省特定包干试点普通使用",
          "requirement": "T=项目在 SRC-003 第 3 条试点和立项年范围且不改政府采购预算；F=未列试点/有采购预算变更；U=试点名单或年度未知；SRC-003 第 3、9–10 条；F003–F005/F025/F028；M001/M002/M004/M013；A 正式试点/立项批复；仅有“省级项目”“包干制”标签不足；2026 新立项不能沿用旧窗口；T=NOTAPPLICABLE（无需科目预算调剂）→项目负责人按其他用款制度；F=NOTAPPLICABLE（转 R020 或其他制度）；U=POLICYUNCONFIRMED→科发院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "E2：四川省包干试点政府采购预算变更",
          "requirement": "T=R019 适用的项目确有政府采购预算需调；F=无该预算变更；U=采购预算是否存在不明；SRC-003 第 10 条；F005/F025/F028；M001/M002/M005/M010/M013/M016；A 已批采购预算编号+B 变更事实；校科研部门审核、国资/财务备案环节按当期授权核，T04 只读复用已有采购决定；T=PASSFACT（路由）→科发院/国资及财务；F=NOTAPPLICABLE；U=NEEDSMATERIAL/POLICYUNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "F1：校级包干项目无采购变更",
          "requirement": "T=校级包干项目普通使用且无政府采购预算变化；F=非校级包干/有采购变更；U=学校级别或管理方式未核；SRC-004 第 2、7–8 条；F003/F005/F025/F028；M001/M002/M004/M013；A 校级立项文件；不强制虚构 F016 分科目预算；与 2024 总则衔接不明时配置待核；T=NOTAPPLICABLE（科目调剂）→校级项目负责人；F=NOTAPPLICABLE（转 R022）；U=POLICYUNCONFIRMED→科研归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "F2：校级包干项目政府采购预算变更",
          "requirement": "T=校级项目有已编政府采购预算及申请变化；F=无变化；U=采购预算版本未知；SRC-004 第 8 条；F003/F005/F025；M001/M002/M005/M010/M016；A 校级计划、已批采购预算+B 变更请求；科研管理部门审核后报国资备案，采购方式不在本 R 决定；T=PASSFACT（路由）→科研管理部门/国资；F=NOTAPPLICABLE；U=SOURCEUNAVAILABLE/NEEDSMATERIAL",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "国家重点研发计划指南指定包干制",
          "requirement": "T=SRC-010 第 30 条所适用且项目指南确定经费包干制；F=指南确认预算制；U=指南/批复方式不明；SRC-010 第 3、30 条、SRC-002 第 17 条；F003–F006/F028；M001/M002/M013；A 上位办法及该项目指南；包干项目无需具体项目预算和调剂程序，不以校办系统形式要求反证；后补助/自筹资金要另核；T=NOTAPPLICABLE（科目预算调剂）→任务负责人；F=PASSFACT（需走预算制其他 R）→重大项目办；U=POLICYUNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "G：结余资金不同于在研调剂",
          "requirement": "T=项目已有可信结题/结余并申请其预算变化；F=仍在研且无结余事项；U=余额与结余归属状态不清；SRC-007（全文未核）、SRC-010 第 43、48–49 条（限重点研发）；F007/F014/F026/F028；M001/M005/M011/M013；A 结题决定+财务结余/主管规则，余额截图不等于有权处分；不得由一般在研项目审批链推导结余批准权；T=POLICYUNCONFIRMED→科发院/财务核专项结余办法；F=NOTAPPLICABLE；U=NEEDSMATERIAL/SOURCEUNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "研究任务变更的权威先决事实",
          "requirement": "T=预算请求依赖研究目标、承担单位、计划任务已变；F=预算调剂不依赖此类变更；U=先决变更仍在审或文书无法验证；SRC-001 第 2 条（一）、SRC-002 第 10 条；F007/F012/F024；M002/M005/M012；B 有权科研任务变更决定的版本和生效日，不重新审研究实体；未批准的任务草稿不得作为生效事实；T 有效=PASSFACT→预算归口；T 未生效=NEEDSHUMANDECISION→相邻 T03 事项；F=NOTAPPLICABLE；U=SOURCEUNAVAILABLE/CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "与采购预算及 T04 权威决定的依赖",
          "requirement": "T=本次设备/项目预算变化影响政府采购预算或已批采购计划；F=可信证据确认不涉及；U=无法证实是否存在采购计划；SRC-003 第 10 条、SRC-004 第 8 条、SRC-010 第 33 条；F020/F025；M003/M005/M010/M013；A 采购预算/正式采购变更编号，只判断是否需另行处理；不能审招标方式、供应商资质或资产验收；T=PASSFACT（提示依赖）→采购/国资 T04 Owner；F=NOTAPPLICABLE；U=POLICYUNCONFIRMED/SOURCEUNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "资金来源、外拨和承担单位限制",
          "requirement": "T=变更跨资金来源/外拨单位或存在多来源出资；F=同一来源同一主体内调剂；U=资金提供方限制未知；SRC-002 第 13、17 条、SRC-010 第 2、35、40 条末款；F006/F015/F024；M002/M003/M009/M012/M013；A 批复区分中央财政、地方、自筹等；上位 SRC-010 其他来源资金在总额不变跨单位调剂可由项目承担单位审批并备案，不保证委托合同允许；T 主体间合意/资助方限制需裁量=NEEDSHUMANDECISION（比对事实另存）→项目承担单位/资助方；F=NOTAPPLICABLE；U=POLICYUNCONFIRMED",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R028",
          "title": "专项提交时点与原则性例外",
          "requirement": "T=SRC-002 覆盖的重点（重大）项目有时间限制触发；F=不属于该专项；U=真实提交日/结题日或条文适用不明；SRC-002 第 28–29 条、SRC-001 第 2 条；F007/F027/F028；M001/M002/M005/M013；A/B 有效任务期与可信提交时间对照专项“提前两个月”“结题前三个月原则上不受理”，不转成全校通用硬拦截；“原则上”交由有权机构例外裁量；T 时间在通常区间=PASSFACT→重大项目办；触及原则性例外=NEEDSHUMANDECISION→重大项目办；F=NOTAPPLICABLE；U=POLICYUNCONFIRMED/SOURCEUNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "正式决定权限、签发与对应申请版",
          "requirement": "T=实际收到院/校/外部批准或备案；F=尚在 S1–S3 未进入决定期；U=文书签署身份/权限不可信；SRC-001 第 2 条、SRC-002 第 17、29 条、SRC-009 第 23–24 条、SRC-010 第 40 条；F008/F029–F031；M004/M005/M013/M015/M016；A 签发账号及授权、B 决定文号/生效时间核权限链，并和 M005 本次申请版一一绑定；“同意”图片、Renderer 角色字符串不算签发；T 来源真实=PASSFACT（仅“决定已被验证”事实）→财务/下个有权机关；F=NOTAPPLICABLE（未到时）→原审批路径；U=NEEDSHUMANDECISION/CONFLICT→签发机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "财务生效/备案不等于批准",
          "requirement": "T=有核实需要的预算生效/备案记录；F=项目无需相应预算入账事项；U=财务源不可用或决定与账套未对应；SRC-001 第 12 条、SRC-002 第 5、17 条、SRC-010 第 33、35 条；F014/F029/F031–F032；M003/M016/M017；A 财务最新账套事件与 B 授权决定版本/签发时序匹配；不能把学生/教师上传截图记为财务处决定；T 一致=PASSFACT（财务生效事实）→案卷归档岗；F=NOTAPPLICABLE；U=SOURCEUNAVAILABLE/CONFLICT→财务处",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "补件/替换版导致旧结论失效",
          "requirement": "T=被引用 M/F 的源版本变化；F=经可信内容指纹确认未变且有效；U=无法识别材料归属/哈希；SRC-001 第 2 条、SRC-002 第 17 条（对应事实规范）；F001/F014/F018–F019/F029–F031；M003/M005/M015/M016/M017；A 不可变版次与 B 当前决定绑定，按第 11 节依赖图令旧 R 过期不可用并只重算受影响链；不得抹除旧决定或自动重签；T=NEEDSHUMANDECISION（若已签发受影响）→原签发机关；未签发仅标结果待复核→材料审核岗；F=PASSFACT（版本不变）；U=CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "撤回、复核或重新提交的权限事实",
          "requirement": "T=已有 M019 载明撤回/异议/复核/重申请求；F=无此类请求；U=请求指向的旧案卷或签发版本不明；SRC-001/002 均无已核通用撤回复核时限；F009/F029/F031–F033；M004/M015/M016/M017/M019/M013；C 请求只形成受理待处理状态；A/B 有权机关正式答复方可改变生效结论；学校受理/时效/复核机关需补法定或校本依据，已生效预算不能自动回滚；T 仅有请求且授权程序不明=POLICYUNCONFIRMED→原受理机关人工办理；T 后续有合法授权及核真回复=PASSFACT（仅答复事实）→案卷管理员；F=NOTAPPLICABLE；U=NEEDSMATERIAL/CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R033",
          "title": "证据完整性、可读性与材料归属",
          "requirement": "T=某触发规则当前必需 M 已提供或可权威复用；F=该 M 被可信事实证明本情形不需要/尚未产生；U=证据缺失、损坏、来源断开或项目/版本不明；SRC-001–004/009–010/013–016 为已核规范，SRC-005/012 仅载体线索；F001/F014/F027/F029；M001–M023（以 07.3 按案型/阶段筛选）；对每槽查页/字段定位、项目 ID、发行主体、版本和抽取可读性；OCR 不可辨即尝试可信结构化记录；M015–M017 不得在 S1 判缺，M013 不向申请人索取；T=PASSFACT→对应事实规则；F=NOTAPPLICABLE；U 按缺=NEEDSMATERIAL、坏页=UNREADABLE、权威源失联=SOURCEUNAVAILABLE、错项目=CONFLICT→材料持有人/归口",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R034",
          "title": "NSFC 2026 设备购置费变动与间接费联动",
          "requirement": "T=NSFC 预算制项目设备购置费调增；F=非该项目/无调增；U=购置费新旧额或资助期不清；SRC-009 第 24 条、SRC-013 第 12 项；F004/F035–F037；M003/M006/M020；对同一项目原核定/调增额、2026-01-01 后资助期满及重新计算间接费差额逐项核。5 万仅决定相应间接费差额处理方式，绝不是设备费审批的允许阈值；结题处理属于后续财务/NSFC 主体；T=数字事实可核 PASSFACT，差额处理和授权须 NEEDSHUMANDECISION→财务处/NSFC；F=NOTAPPLICABLE；U=NEEDSMATERIAL/POLICYUNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R035",
          "title": "国家社科项目预算权限分流",
          "requirement": "T=批文证实国家社科且有预算调整请求；F=非国家社科/已核包干普通使用；U=批次、管理方式和子类型不明；SRC-015 第 18–22 条、SRC-008（校本全文未核）；F003–F006/F018/F023/F035/F038；M001/M002/M003/M005/M021；预算制总额增减及原无外拨需增列由责任单位、省级社科机关、全国社科工作办逐层；设备/既有外拨为单位审批；业务/劳务自主调并备案；间接费在研不得调增。包干无科目调剂；不得仅凭校内 SRC-008 目录证明其当前具体签发人；T 仅事实路径 PASSFACT→社科处及法定机关；F=NOTAPPLICABLE；U=POLICYUNCONFIRMED→社科处",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R036",
          "title": "四川省社科 2026 权限与废止版本",
          "requirement": "T=省社科规划项目且适用 2026-02-04 新规；F=资助方确证其他计划；U=老项目过渡或“省社科/省科技”混同；SRC-016 第 16–20、43 条；F003–F005/F018/F023/F035/F038；M001/M002/M003/M005/M021；本省社科新规明确总额/新增外拨省社科规划办批准，设备/既有外拨责任单位审批，业务/劳务自主安排报备案，包干无科目调剂；旧 2023 试行办法被废，但已立项项目是否有特别过渡按任务书核；T=PASSFACT（法定路径核对）→社科处/项目责任单位/省社科规划办；F=NOTAPPLICABLE；U=POLICYUNCONFIRMED",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R037",
          "title": "四川财政科技 2025/2026 政策批次",
          "requirement": "T=四川省财政科技计划/省科技项目拟在研调剂；F=已核省社科或国家资助不属此款；U=2025 新办法/2026 规程与项目批次关系不明；SRC-003 第 3 条、SRC-017/018；F003–F005/F035/F038；M001/M002/M013/M021；对资助批文与 2025 川财规〔2025〕10号、2026 科技过程规程逐一配对；仅知文件题名/存在而未核实具体调剂条款时不可形成阈值与签发结果，旧包干试点不能自动延伸 2026；T 计划可核但专项适用未全证 POLICYUNCONFIRMED→科发院；F=NOTAPPLICABLE；U=SOURCEUNAVAILABLE/POLICYUNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R038",
          "title": "实际签发链覆盖本案金额、科目和项目层级",
          "requirement": "T=收到声称已签发/备案的正式决定；F=尚在 S1–S3；U=机构、身份、作用域或链条不全；SRC-001/002/009/010/015/016；F006/F029–F031/F039；M015/M016/M022；对项目/课题/专题与每一行动作核校内岗位授权、校外资助机关、签发时间及针对的申请版本；前端 role、OCR 公章、同名人员不具授权效力；与 R029 协作只验权限链覆盖事实而非重复审批实体；T=PASSFACT 仅证“已签有权文书”→财务/归档；F=NOTAPPLICABLE；U=NEEDSHUMANDECISION/CONFLICT→原签发机关",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R039",
          "title": "NSFC 合作外拨预算变动与补充协议",
          "requirement": "T=NSFC 项目合作外拨调增/减或分工变更；F=无合作研究外拨变化；U=原协议/变更金额/参与主体不可核；SRC-013 第 17 项、SRC-009 第 23 条；F024/F035/F040；M002/M009/M012/M023；S2 核原协议、参与单位、拟变更及有权审批路由；M023 是达成合意后 S4/S5 才形成，不在初申报缺件。调增需要承担单位从严论证必要性，不能以预算数字一致取代双方补充协议；T 前置事实=PASSFACT，调增必要性 NEEDSHUMANDECISION→项目依托/合作单位；F=NOTAPPLICABLE；U=NEEDSMATERIAL/CONFLICT",
          "execution": "manual",
          "targetScope": "group"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "stage-s0",
      "name": "变更触发与识别",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-s1",
      "workflowOwner": "local"
    },
    {
      "id": "stage-s1",
      "name": "提交或记录",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-s2",
      "workflowOwner": "local"
    },
    {
      "id": "stage-s2",
      "name": "事实核验与分流",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-s3",
      "workflowOwner": "local"
    },
    {
      "id": "stage-s3",
      "name": "补件/更正",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-s4",
      "workflowOwner": "local",
      "returnToStageId": "stage-s2"
    },
    {
      "id": "stage-s4",
      "name": "有权决定",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-s5",
      "workflowOwner": "local"
    },
    {
      "id": "stage-s5",
      "name": "备案/账务生效",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-s6",
      "workflowOwner": "local"
    },
    {
      "id": "stage-s6",
      "name": "撤回/复核/再次变更",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "returnToStageId": "stage-s2"
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
  "templateId": "T03-T04",
  "name": "科研项目预算调整申请与变更权限审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T03-T04.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T03-T04.md",
  "sourceDocumentSha256": "11fa6d206cf238637e676330fdcd1303fb3e3d9e839f8b4f6d3012dbe4d6217d",
  "sourceDocumentBytes": 148931,
  "officialSchoolTemplate": false,
  "researchEvidenceStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "authoringStatus": "RESEARCH_HANDOFF_READY",
  "criteria": [
    {
      "sectionId": "review-rules",
      "criterionId": "R001",
      "srcIds": [
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R006",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005",
        "SRC-008",
        "SRC-010",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R014",
      "srcIds": [
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R015",
      "srcIds": [
        "SRC-002",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R016",
      "srcIds": [
        "SRC-002",
        "SRC-010",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R017",
      "srcIds": [
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R018",
      "srcIds": [
        "SRC-009",
        "SRC-010",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R019",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R020",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R021",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R022",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R023",
      "srcIds": [
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R024",
      "srcIds": [
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R026",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R027",
      "srcIds": [
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R029",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R032",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R033",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R034",
      "srcIds": [
        "SRC-009",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R035",
      "srcIds": [
        "SRC-008",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R036",
      "srcIds": [
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R037",
      "srcIds": [
        "SRC-003",
        "SRC-017",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R038",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-009",
        "SRC-010",
        "SRC-015",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R039",
      "srcIds": [
        "SRC-009",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const

export { templateVersion as template }
export default templateVersion
