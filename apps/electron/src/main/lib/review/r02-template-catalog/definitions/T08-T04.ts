import type { TemplateVersion } from '@profer/shared'

export interface R02CriterionMetadata {
  sectionId: string
  criterionId: string
  sourceIds: string[]
  evidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
}

export interface R02Metadata {
  templateId: string
  name: string
  sourceDocumentPath: string
  researchSourcePath: string
  sourceDocumentSha256: string
  sourceDocumentBytes: number
  manifestExpectedBytes: number
  manifestExpectedSha256: string
  sourceIntegrityStatus: 'LINE_ENDING_DRIFT_ONE_LF' | 'REVIEWED_COPY_PATCHED' | 'MATCH'
  sourceIntegrityNote: string
  officialSchoolTemplate: false
  researchStatus: string
  researchEvidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
  policyEvidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
  sourceRecordCount: number
  sourceIds: string[]
  fieldCount: number
  materialSlotCount: number
  criterionCount: number
  criteria: R02CriterionMetadata[]
}

/** V3 native draft definition; intentionally not registered/published by this batch. */
export const templateVersion: TemplateVersion = {
  "templateId": "T08-T04",
  "version": 1,
  "schemaVersion": 2,
  "name": "项目用工解除、离岗与责任交接审核",
  "description": "项目用工解除、离岗与责任交接审核。本地研究模板 · 非校方正式模板。政策证据状态：PARTIAL；仅用于事实提取、差异提示和人工复核，不产生学校正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板由 R02 研究 Markdown 转换；非校方正式模板。SRC 仅是研究来源索引，不是案卷 SourceRef。所有校内政策、权限、法律关系或正式决定未确认时必须人工复核。",
  "objectType": "person",
  "displayName": {
    "template": "项目用工解除、离岗与责任交接审核（本地研究案卷）"
  },
  "fields": [
    {
      "key": "F001",
      "label": "案卷标识 ID（F001）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F001 | 案卷标识 ID / Case | P0 | 可信建案事件 | M001:caseRef | L | 未建案停止关联，不能伪造. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F002",
      "label": "劳动者唯一关联 ID（F002）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F002 | 劳动者唯一关联 ID / Person | P0 | 有权限的用工/身份主数据 | M002:人员键 | S | 姓名不足以匹配，人工核身份. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F003",
      "label": "合同姓名 String（F003）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F003 | 合同姓名 String / Person | P0 | 本人合同与可信名册 | M002/M003:姓名字段 | P | 差异须核更名/重名，CONFLICT. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F004",
      "label": "用工性质 Enum（F004）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F004 | 用工性质 Enum / Employment | P0 | 已签合同、用工台账 | M002/M003:用工属性 | S | UNKNOWN，先身份分流. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F005",
      "label": "实际用人单位名称/主体 ID（F005）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F005 | 实际用人单位名称/主体 ID / Employment | P0 | 合同签章、可核机构登记 | M003:甲方及章，M002:雇主 | P | 不从院系或 PI 推定雇主. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F006",
      "label": "授权签署人及授权范围 Ref（F006）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F006 | 授权签署人及授权范围 Ref / Employment | P2/P3 | 合同主体有效授权链 | M004:授权页及效期 | S | 无验证转人工，不认定有效签章. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F007",
      "label": "劳动合同编号 Ref（F007）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F007 | 劳动合同编号 Ref / Contract | P0 | 合同原件/权威台账 | M003:首页/编号 | P | 无号时用可审计指纹，不能臆造. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F008",
      "label": "合同期限类型 Enum（F008）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F008 | 合同期限类型 Enum / Contract | P0 | 原合同及书面变更 | M003:期限条款，M005 | P | UNKNOWN，不能按固定期处理. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F009",
      "label": "合同起始日 Date（F009）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F009 | 合同起始日 Date / Contract | P0 | 合同正文、用工起始记录 | M003:期限页，M002 | P | 不用招聘批次日期替代. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F010",
      "label": "合同期限止日或任务终止条件 Date/String（F010）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F010 | 合同期限止日或任务终止条件 Date/String / Contract | P0 | 合同正文及有效变更 | M003:终止条款，M005 | P | 任务型不得擅填日期. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F011",
      "label": "当前合同版本与前序版本 Ref（F011）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F011 | 当前合同版本与前序版本 Ref / Contract | P0/P2 | 签署文本及可信合同台账 | M003/M005:版本/签章 | P | 竞争版本触发 CONFLICT. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F012",
      "label": "项目/课题标识 ID（F012）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F012 | 项目/课题标识 ID / Project | P0 | 项目主管正式立项台账 | M006:项目编号 | L | 不以经费截图替代项目事实. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F013",
      "label": "资金来源及招聘批次 Enum/String（F013）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F013 | 资金来源及招聘批次 Enum/String / Project | P0 | 用工/项目台账、当期公告 | M006:经费批次；SRC-001/002/010 | P | UNKNOWN，批次政策待核. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F014",
      "label": "团队及 PI 关联 ID（F014）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F014 | 团队及 PI 关联 ID / Project | P0/P4 | 有效团队/项目成员记录 | M006:现任成员表 | P | PI 身份非雇主授权. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F015",
      "label": "事件路径 Enum（F015）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F015 | 事件路径 Enum / ExitEvent | P1 | 真实通知/协商/单位记录 | M007/M009/M010/M011/M027/M028 | P | A–J 可能叠加；UNKNOWN 不判断生效. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F016",
      "label": "发起人身份及代理授权 Ref（F016）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F016 | 发起人身份及代理授权 Ref / ExitEvent | P1 | 可信登录、授权文件、本人核验 | M001/M004/M007:签名 | S | 未验代理不得作意思表示. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F017",
      "label": "劳动者通知或协商请求 Ref（F017）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F017 | 劳动者通知或协商请求 Ref / ExitEvent | P1（A/B） | 本人发出的原件与来源 | M007:通知正文/签名 | S | 尚未发出不填“已通知”. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F018",
      "label": "通知送达/接收时点 DateTime（F018）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F018 | 通知送达/接收时点 DateTime / ExitEvent | P1/P2（A/C） | 接收回执/可靠系统日志 | M008:收件时间与收件人 | S | 无可靠送达证据为 UNKNOWN. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F019",
      "label": "拟解除/离岗日 Date（F019）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F019 | 拟解除/离岗日 Date / ExitEvent | P1 | 申请意向、通知或合同条款 | M007/M009/M010/M027 | P | 仅意向，不反写法定生效日. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F020",
      "label": "试用期核验 Bool3（F020）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F020 | 试用期核验 Bool3 / Employment | P2（A/C） | 有效合同和用工记录 | M003/M005/M002:试用期及起始 | S | UNKNOWN，不能自动用3日阈值. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F021",
      "label": "用人单位拟解除事由及事实 Ref（F021）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F021 | 用人单位拟解除事由及事实 Ref / ExitEvent | P2（C） | 雇主正式事由与调查材料 | M010:事实清单/出具者 | S | 高影响人工审，不自动评判合法性. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F022",
      "label": "保护性情形核查结论 Enum/Ref（F022）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F022 | 保护性情形核查结论 Enum/Ref / ExitEvent | P2（C/D） | 有权人事/法务最小化结论 | M012:限定结论，不收原始病历 | S | UNKNOWN 必人工，不据空缺推否. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F023",
      "label": "工会通知/程序状态 Enum/Ref（F023）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F023 | 工会通知/程序状态 Enum/Ref / ExitEvent | P3（C） | 工会及雇主有效办理记录 | M013:通知/意见/处理回执 | S | 条件适用未知，不自动通过. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F024",
      "label": "双方协商协议及签署 Ref（F024）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F024 | 双方协商协议及签署 Ref / ExitEvent | P3（B） | 双方真实签署的协议 | M009:签章/日期/条款 | S | 尚未成立保留待办，勿提前必填. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F025",
      "label": "有权解除/终止文书 Ref（F025）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F025 | 有权解除/终止文书 Ref / Decision | P3（C/D等） | 雇主或法定机关有效文书 | M014:文号/签署/送达 | S | 仅系统结果不构成正式决定. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F026",
      "label": "权威生效或终止日 Date（F026）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F026 | 权威生效或终止日 Date / Decision | P3/P5 | 有效协议、法定事件与来源 | M009/M014/M015:明确日期 | S | 与 F019 分离，冲突人工处理. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F027",
      "label": "交接清单范围及持有人 Ref/Set（F027）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F027 | 交接清单范围及持有人 Ref/Set / Handover | P2/P4 | 项目/实验室清单及当事方 | M016:逐项编号/责任人 | P | 无清单不等于“无资产”. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F028",
      "label": "资产归还/转移签收状态 Enum/Ref（F028）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F028 | 资产归还/转移签收状态 Enum/Ref / Handover | P4 | 有权资产保管人/资产台账 | M017:资产号/签收时间 | P | 个人照片不可替代正式签收. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F029",
      "label": "科研记录/数据资料交接状态 Enum/Ref（F029）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F029 | 科研记录/数据资料交接状态 Enum/Ref / Handover | P4 | 项目数据责任方与档案管理方 | M018:目录/非涉密回执 | S/X | 涉密仅允许状态标志，不收正文. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F030",
      "label": "系统账号/权限移交状态 Enum/Ref（F030）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F030 | 系统账号/权限移交状态 Enum/Ref / Handover | P4 | 真实权限管理系统或负责人 | M019:操作事件/账号范围 | S | 不执行外部停权；源不可用留待办. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F031",
      "label": "涉密/特殊项目分流 Bool3/Enum（F031）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F031 | 涉密/特殊项目分流 Bool3/Enum / Project | P0/P2 | 有权保密机构给的非涉密标志 | M020:安全分流回执 | S/X | UNKNOWN 先保守停上传，不能读密件分类. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F032",
      "label": "项目成员调整决定 Ref（F032）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F032 | 项目成员调整决定 Ref / Project | P3/P4（J及适用E/F） | 项目有权归口正式决定 | M021:允许公开的编号/状态 | S/X | 合同解除不自动生成项目调整. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F033",
      "label": "解除/终止证明 Ref（F033）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F033 | 解除/终止证明 Ref / Aftercare | P5 | 用人单位依法出具的证明 | M015:签发日期/编号 | S | 后置义务，初申缺失不报错. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F034",
      "label": "工资及未付劳动报酬办理状态 Enum/Ref（F034）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F034 | 工资及未付劳动报酬办理状态 Enum/Ref / Aftercare | P5或实际支付争议发生时 | 真实雇主薪酬/财务与银行可核回执 | M022:工资期间/状态/回执号 | S | 只跟踪工资，不自动付款或以工资争议否决解除. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F035",
      "label": "争议/复核文书 Ref（F035）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F035 | 争议/复核文书 Ref / Dispute | P6（或发生时） | 有权复核、仲裁、法院等 | M024:案号/裁判生效标记 | S | 不以待裁决状态猜结果. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F036",
      "label": "操作者真实身份及审计事件 Ref（F036）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F036 | 操作者真实身份及审计事件 Ref / Audit | P0–P6 | 后台可信身份/业务事件账本 | M001/M023:actor、时间、动作 | S | Renderer 字段不可写权. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F037",
      "label": "相邻 G50/S/T 权威结论链接 Ref（F037）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F037 | 相邻 G50/S/T 权威结论链接 Ref / LinkedDecision | P0–P6 | 经核的原业务 Owner/决定源 | M025:原决定、状态、版本 | P/S | 无完整来源不得复用结论. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F038",
      "label": "材料/结果基线与替代链 Ref（F038）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F038 | 材料/结果基线与替代链 Ref / Audit | P0–P6 | 可信文件版本及 ReviewRun 引用 | M023:材料指纹/父版本 | S | 变更仅使受影响预审结论待重审. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F039",
      "label": "项目完成/经费终止事实 Enum/Ref（F039）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F039 | 项目完成/经费终止事实 Enum/Ref / Project | P1/P2（E） | 项目系统、有效结题/经费文件 | M028:项目事件页 | P | 不由该事实直接计算劳动关系终止. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F040",
      "label": "补件/撤回/改期/复核请求 Ref/Enum（F040）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F040 | 补件/撤回/改期/复核请求 Ref/Enum / Audit | P6 或任何阶段 | 经验证请求人及时间戳 | M026:请求动作与目标版本 | S | 草稿操作不改变已生效法律行为. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F041",
      "label": "劳动者主张第38条事由及现有证据 Ref（F041）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F041 | 劳动者主张第38条事由及现有证据 Ref / ExitEvent | P1/P2（A2） | 本人已有事实凭据与有权核查结果 | M029:事由/日期/来源 | S | 缺失或争议转HD，不自动判断成立. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F042",
      "label": "是否从事接触职业病危害的作业及离岗检查最小状态 Bool3/Ref（F042）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F042 | 是否从事接触职业病危害的作业及离岗检查最小状态 Bool3/Ref / Employment | P2（C/D/K，条件触发） | 雇主职业卫生岗位危害清单与职业健康监护管理者 | M030:风险类别和检查办理状态，不含病历 | S | UNKNOWN→NEEDS_HUMAN_DECISION；不从“实验室工作”推定接触或不接触. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F043",
      "label": "合同期满后继续实际工作及雇主异议事实 Bool3/Ref（F043）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F043 | 合同期满后继续实际工作及雇主异议事实 Bool3/Ref / Employment | P2（D/L，条件触发） | 有权用工考勤、工资与管理日志，双方记录 | M031:期满后劳动事实/异议来源 | S | UNKNOWN 不以纸面到期直接宣告终止. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F044",
      "label": "档案及社会保险关系转移办理状态 Enum/Ref（F044）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F044 | 档案及社会保险关系转移办理状态 Enum/Ref / Aftercare | P5（依法需要时） | 用人单位人事/社保与有权平台 | M032:办理时间/可核回执 | S | 区分各自责任与实际经办状态；不自称系统已转移. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F045",
      "label": "经济补偿支付及争议状态 Enum/Ref（F045）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F045 | 经济补偿支付及争议状态 Enum/Ref / Aftercare | P5（依法适用时） | 真实雇主财务/劳动者合法付款凭据 | M033:补偿事项/支付状态 | S | 不由 AI 判是否应付、金额和争议终局；不阻断解除证明. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    }
  ],
  "materialSlots": [
  {
    "id": "M001",
    "name": "M001 建案、委托及真实操作链；平台 Owner 的事件记录",
    "purpose": "建案、委托及真实操作链；平台 Owner 的事件记录；建案、委托及真实操作链；平台 Owner 的事件记录；C@P0，Q@P6；可信后台建案/登录事件；不能由截图代替。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F001",
      "F016",
      "F036"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M002",
    "name": "M002 劳动者实际身份/用工类别；实际用人单位名册/人事记录",
    "purpose": "劳动者实际身份/用工类别；实际用人单位名册/人事记录；劳动者实际身份/用工类别；实际用人单位名册/人事记录；C@P0；有权限的实名劳动用工名册、原件查验记录；不得无必要重复收身份证全号。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F002",
      "F005",
      "F009",
      "F020"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M003",
    "name": "M003 原劳动合同或具同等效力的聘用协议；合同双方各持一份",
    "purpose": "原劳动合同或具同等效力的聘用协议；合同双方各持一份；原劳动合同或具同等效力的聘用协议；合同双方各持一份；C@P0（能取原记录不再上传）；已核的可验证电子合同/双方所持签署原件；招聘公告不是合同替代。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F003",
      "F011",
      "F020"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M004",
    "name": "M004 雇主签约/解除授权及代理权限；真实授权者",
    "purpose": "雇主签约/解除授权及代理权限；真实授权者；雇主签约/解除授权及代理权限；真实授权者；Q@P1–P3（发生代理/签发时）；有效授权书及登记/核验记录，明确授权范围及期间。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F006",
      "F016"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M005",
    "name": "M005 补充协议、续签和岗位/期限变更链；合同双方",
    "purpose": "补充协议、续签和岗位/期限变更链；合同双方；补充协议、续签和岗位/期限变更链；合同双方；Q@P0/P2（出现多版本/变更时）；经双方认可且来源可查的正式合同变更或 T08-T03 权威决定。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F008",
      "F011",
      "F020"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M006",
    "name": "M006 项目、招聘批次、团队负责人事实；项目/聘用归口",
    "purpose": "项目、招聘批次、团队负责人事实；项目/聘用归口；项目、招聘批次、团队负责人事实；项目/聘用归口；C@P0（项目关联事实）；可信项目成员名册和项目编号；公告仅辅助判断批次背景。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F012",
      "F014"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M007",
    "name": "M007 本人解除通知、协商初始请求及意思表示；劳动者",
    "purpose": "本人解除通知、协商初始请求及意思表示；劳动者；本人解除通知、协商初始请求及意思表示；劳动者；C@P1（A/B），其他路径不适用；有署名/可验证发送的通知或真实本人认可的文字记录；由代理发出须另证授权。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F015",
      "F017",
      "F019"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M008",
    "name": "M008 通知送达及接收时点；双方邮件/邮寄/单位接收系统",
    "purpose": "通知送达及接收时点；双方邮件/邮寄/单位接收系统；通知送达及接收时点；双方邮件/邮寄/单位接收系统；Q@P1/P2（A/C争议、期限判断）；能确认对象和时间的签收、合法电子送达日志等。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F018"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M009",
    "name": "M009 双方协商解除协议及合意；真实合同双方",
    "purpose": "双方协商解除协议及合意；真实合同双方；双方协商解除协议及合意；真实合同双方；L@P3（B达成后）；双方可验证电子签或签署原件；单方申请、PI 同意不可替代。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F015",
      "F019",
      "F024",
      "F026"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M010",
    "name": "M010 用人单位拟解除的事实与理由；雇主/有权调查方",
    "purpose": "用人单位拟解除的事实与理由；雇主/有权调查方；用人单位拟解除的事实与理由；雇主/有权调查方；C@P2（C），条件补充；有权单位原始事实资料、制度告知及调查记录；非 PI 单方评价。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F015",
      "F019",
      "F021"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M011",
    "name": "M011 合同期限届满/任务完成等法定终止依据；合同及有权方",
    "purpose": "合同期限届满/任务完成等法定终止依据；合同及有权方；合同期限届满/任务完成等法定终止依据；合同及有权方；C@P1/P2（D）；合同期限/变更条款，依法成立的相关终止事件证明；项目结题不当然替代。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F010",
      "F015",
      "F026"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M012",
    "name": "M012 保护性情形或法定限制的最小结论；有权人事/法务",
    "purpose": "保护性情形或法定限制的最小结论；有权人事/法务；保护性情形或法定限制的最小结论；有权人事/法务；Q@P2（C/D等需判断）；仅收可披露的“需保护/不适用/未知”结论及核验者，不上传原始医疗/生育档案。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F022"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M013",
    "name": "M013 法定工会通知、意见与答复；工会/用人单位",
    "purpose": "法定工会通知、意见与答复；工会/用人单位；法定工会通知、意见与答复；工会/用人单位；L@P3（C适用时）；有权程序日志、正式收发文及处理意见；不能以 PI 群聊截图代替。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F023"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M014",
    "name": "M014 单方解除通知或其他有权劳动关系决定；雇主/法定主体",
    "purpose": "单方解除通知或其他有权劳动关系决定；雇主/法定主体；单方解除通知或其他有权劳动关系决定；雇主/法定主体；L@P3（C/D等形成时）；原签发文件、可信电子签、外部有权文书；系统 PASS_FACT 不替代。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F025",
      "F026"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M015",
    "name": "M015 解除/终止证明及其出具日期；真实用人单位",
    "purpose": "解除/终止证明及其出具日期；真实用人单位；解除/终止证明及其出具日期；真实用人单位；L@P5；单位正式证明/可核验电子证明；不由系统生成学校证明。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F026",
      "F033"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M016",
    "name": "M016 待交项目、实物、文档和责任清单；当事人/项目组/保管方",
    "purpose": "待交项目、实物、文档和责任清单；当事人/项目组/保管方；待交项目、实物、文档和责任清单；当事人/项目组/保管方；Q@P2，C@P4（存在交接义务时）；可信资产与资料台账导出的逐项清单，必要时多方核对。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F027"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M017",
    "name": "M017 实物/固定资产签收；资产保管人及归口",
    "purpose": "实物/固定资产签收；资产保管人及归口；实物/固定资产签收；资产保管人及归口；L@P4（涉及资产时）；资产系统调拨/归还回执或经授权保管人原始签收。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F028"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M018",
    "name": "M018 科研资料、记录、成果数据移交；项目数据责任方",
    "purpose": "科研资料、记录、成果数据移交；项目数据责任方；科研资料、记录、成果数据移交；项目数据责任方；L@P4（涉及资料时）；非涉密目录及有权接收回执；涉密只接受可公开办理状态。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F029"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M019",
    "name": "M019 账号、门禁、密钥或权限回收记录；信息系统权限管理方",
    "purpose": "账号、门禁、密钥或权限回收记录；信息系统权限管理方；账号、门禁、密钥或权限回收记录；信息系统权限管理方；L@P4（涉及权限时）；身份与权限系统可信审计回执/受权管理员确认。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F030"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M020",
    "name": "M020 是否涉密及线下分流的可公开标志；有权保密/项目管理方",
    "purpose": "是否涉密及线下分流的可公开标志；有权保密/项目管理方；是否涉密及线下分流的可公开标志；有权保密/项目管理方；C@P0/P2（J/疑似涉密），非涉密时Q；非涉密标志/分流证明，禁止以涉密原文上传证明密级。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F031"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M021",
    "name": "M021 重点项目成员/研发骨干调整结论；有权项目管理链",
    "purpose": "重点项目成员/研发骨干调整结论；有权项目管理链；重点项目成员/研发骨干调整结论；有权项目管理链；L@P3/P4（SRC-012适用且触发人员变动）；正式项目变更批复的可公开标识；不收秘密附件。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F032"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M022",
    "name": "M022 工资及实际劳动报酬的支付状态；雇主薪酬/财务持有",
    "purpose": "工资及实际劳动报酬的支付状态；雇主薪酬/财务持有；工资及实际劳动报酬的支付状态；雇主薪酬/财务持有；L@P5（或已产生工资争议时 Q@P1）；有权薪酬台账与付款回执；仅最小化期间与状态。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F034"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M023",
    "name": "M023 材料版本、案卷基线和可信操作者日志；后台业务 Owner",
    "purpose": "材料版本、案卷基线和可信操作者日志；后台业务 Owner；材料版本、案卷基线和可信操作者日志；后台业务 Owner；C@P0，更新时C@P6；可信来源事件账本、材料 hash 与决定引用；不得用旧 run@rev 假装真实 Run。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F036",
      "F038"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M024",
    "name": "M024 复核、劳动争议或仲裁/法院有效文书；有权机关/当事人",
    "purpose": "复核、劳动争议或仲裁/法院有效文书；有权机关/当事人；复核、劳动争议或仲裁/法院有效文书；有权机关/当事人；Q@P6（存在争议才需要）；官方查询或核验生效文书，受理中与已生效分开。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F035"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M025",
    "name": "M025 G50/S/T 相邻事项的权威结论引用；原业务 Owner",
    "purpose": "G50/S/T 相邻事项的权威结论引用；原业务 Owner；G50/S/T 相邻事项的权威结论引用；原业务 Owner；Q@P0–P6（确需复用）；附原决定主体、场景、sourceVersion 和状态的可信链接，不用截图代审批。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F037"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M026",
    "name": "M026 补件、撤回、改期、复核请求；原当事人/有权代理",
    "purpose": "补件、撤回、改期、复核请求；原当事人/有权代理；补件、撤回、改期、复核请求；原当事人/有权代理；Q@任何阶段，P6常见；可信操作请求与授权、修改范围；撤回法律通知须独立法律证据。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F040",
      "F036"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M027",
    "name": "M027 团队/岗位内部转移安排；合同双方及原新团队",
    "purpose": "团队/岗位内部转移安排；合同双方及原新团队；团队/岗位内部转移安排；合同双方及原新团队；C@P1（F），Q@P4；正式岗位安排、经双方确认的合同变更或其权威引用。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F014",
      "F015",
      "F019",
      "F027"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M028",
    "name": "M028 项目任务完成、结题、经费结束事实；项目归口",
    "purpose": "项目任务完成、结题、经费结束事实；项目归口；项目任务完成、结题、经费结束事实；项目归口；C@P1（E），Q@P2（其他）；可信结题/项目调整/经费状态记录；不替代劳动合同决定。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F012",
      "F013",
      "F039"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M029",
    "name": "M029 劳动者依第38条提出解除的具体事实凭据；劳动者及有关权威来源",
    "purpose": "劳动者依第38条提出解除的具体事实凭据；劳动者及有关权威来源；劳动者依第38条提出解除的具体事实凭据；劳动者及有关权威来源；Q@P1/P2（A2主张时必要）；合同履行记录、工资/社保权威记录或其他法定事由凭据；敏感数据最小展示，不要求无关私人材料。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F017",
      "F041"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M030",
    "name": "M030 职业病危害岗位接触及离岗前职业健康检查的最小结论；雇主职业卫生归口",
    "purpose": "职业病危害岗位接触及离岗前职业健康检查的最小结论；雇主职业卫生归口；职业病危害岗位接触及离岗前职业健康检查的最小结论；雇主职业卫生归口；Q@P2（K 或 C/D 岗位危害触发）；检查完成后 L；岗位风险清单、受授权核验的“应检查/已组织/未组织/不适用”状态；不收完整病历与诊断单。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F042",
      "F022"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M031",
    "name": "M031 期满后继续用工与雇主是否提出异议的事实；雇主用工管理者、劳动者",
    "purpose": "期满后继续用工与雇主是否提出异议的事实；雇主用工管理者、劳动者；期满后继续用工与雇主是否提出异议的事实；雇主用工管理者、劳动者；Q@P2（D/L 期满且出现继续劳动线索）；可核考勤、任务分配、工资及异议通知的最小化片段/摘要。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F043",
      "F010",
      "F011"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M032",
    "name": "M032 档案及社保关系依法办理转移的办理状态；实际用人单位人事、相关平台",
    "purpose": "档案及社保关系依法办理转移的办理状态；实际用人单位人事、相关平台；档案及社保关系依法办理转移的办理状态；实际用人单位人事、相关平台；L@P5（相应义务触发）；人事/社保可信受理与转移回执；可按两个目标对象拆子项。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F044"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M033",
    "name": "M033 经济补偿办理和支付事实；雇主财务与劳动者",
    "purpose": "经济补偿办理和支付事实；雇主财务与劳动者；经济补偿办理和支付事实；雇主财务与劳动者；L@P5（法定或约定补偿确有触发时）；双方权威结算与实际付款凭据，涉及争议另转法务/仲裁。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 2147483647,
    "requiredElements": [
      "F045"
    ],
    "allowReuseAcrossSubjects": false
  }
],
  "sections": [
    {
      "id": "R02_RESEARCH_RULES",
      "name": "逐条事实核验",
      "description": "逐条对应 T08-T04 原文 §08 的 R 规则。此分项是研究检查项，不是学校政策；SRC IDs 只保存在 r02Metadata，不得作为案卷 SourceRef。条件性阶段、例外与校本规则待确认时转人工。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "R001 · 可信案卷及操作主体；P0–P6",
          "requirement": "原文规则行： R001 可信案卷及操作主体；P0–P6 ； T=发生建案或状态操作；F=已核无需此操作；U=actor 或工单来源不明 ； SRC-009（仅技术）；F001/F036/F038；M001/M023 ； 后台可信日志逐事件比对 case/actor/权限/时间及基线；前端声明或截图不可靠；历史 run@rev 不当真实 Run ； PASS_FACT/NOT_APPLICABLE/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；V3 后台业务 Owner 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R002",
          "title": "R002 · 劳动者唯一对应；P0",
          "requirement": "原文规则行： R002 劳动者唯一对应；P0 ； T=存在被审核劳动关系；F=已证实不属于本案；U=人员键不全 ； SRC-004 第2条；F002/F003；M002/M003 ； 按实名受控键、合同当事人、更名记录匹配；姓名相同不能合并；姓名变更按当时原件查 ； PASS_FACT/CONFLICT/NEEDS_MATERIAL/SOURCE_UNAVAILABLE；雇主用工档案人员 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R003",
          "title": "R003 · 用工形式与真正法律雇主；P0",
          "requirement": "原文规则行： R003 用工形式与真正法律雇主；P0 ； T=合同编外/劳动关系线索；F=可信证据表明另案正式编内或其他制度；U=派遣/校企/多单位混同主体不明 ； SRC-002/004 第2、58、96条、SRC-005（仅企业表）、SRC-006（适用未证）、SRC-011/013 第4条、SRC-016 第3条；SRC-018、SRC-019（仅外校分类对照、**非裁决依据**）；F004/F005；M002/M003/M031（如触发） ； 比合同甲方、公章、实际管理/工资/社保记录；**多单位混同用工时不得仅凭合同封面作不可争议定论**；2019 编内制度不套编外，校属企业不代学校；招聘历史仅为身份线索；外校流程不移植 ； PASS_FACT（仅证据一致）/NOT_APPLICABLE/CONFLICT/POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；真实雇主、法务及必要时仲裁法院 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "R004 · 代理及签署权；P1–P3",
          "requirement": "原文规则行： R004 代理及签署权；P1–P3 ； T=代理发通知或单位签发；F=真实本人依法自行发出且不涉代理；U=授权链、范围、期限未证 ； SRC-004 第16、36–43条、SRC-013 第4条；F006/F016；M001/M004 ； 逐项核授权人、事项、时段、是否具相应签署权；PI 身份/电子图片不能替代；授权有效日按行为日判断 ； PASS_FACT/NOT_APPLICABLE/NEEDS_MATERIAL/NEEDS_HUMAN_DECISION；真实雇主授权管理者 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "R005 · 劳动合同存在及有效主从版本；P0/P2",
          "requirement": "原文规则行： R005 劳动合同存在及有效主从版本；P0/P2 ； T=有劳动关系线索；F=已确认另有适用关系/不适用本模板；U=原件或版本不明 ； SRC-004 第10、16–17、35条；F007/F011；M003/M005 ； 合同号、双方签署、变更次序、来源时间交叉；重扫同版与真实变更分开；不能由最新上传覆盖法律原件 ； PASS_FACT/NEEDS_MATERIAL/UNREADABLE/CONFLICT；实际合同保管方 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R006",
          "title": "R006 · 合同期限及试用期事实；P0/P2",
          "requirement": "原文规则行： R006 合同期限及试用期事实；P0/P2 ； T=已定位合同；F=有权确认不涉期限计算；U=期限类型、起止/任务条件未知 ； SRC-004 第12–15、19、37、44条、SRC-013 第13条；F008/F009/F010/F020；M002/M003/M005/M011 ； 核期限种类、试用期条款、实际起始与变更；不以某招聘批次的一年聘期替代个案；试用期未知不套三日规则 ； PASS_FACT/CONFLICT/NEEDS_MATERIAL/NEEDS_HUMAN_DECISION；合同归口与法务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "R007 · 项目与批次归属事实；P0",
          "requirement": "原文规则行： R007 项目与批次归属事实；P0 ； T=合同被报作项目用工；F=经可信核实无项目关联并重新路由；U=项目号/批次来源不明 ； SRC-001、SRC-002、SRC-003、SRC-010（公告仅各自特定批次）、SRC-012 第2条；F012/F013/F014；M006 ； 比项目立项号、资金批次、现任 PI 与有效日；INDEX_ONLY 不作离岗政策，PI 不被提升为雇主 ； PASS_FACT/NOT_APPLICABLE/SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED；项目/招聘归口 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "R008 · 事件类型与发起人的真实性；P1",
          "requirement": "原文规则行： R008 事件类型与发起人的真实性；P1 ； T=有某解除/终止/转岗/项目终止主张；F=可信证据表明仅一般咨询；U=多路径混称“离职” ； SRC-004 第35–45条；F015/F016；M001/M007/M009/M010/M011/M027/M028 ； 依据实际通知、合意、单位意向、法定届满、项目/岗位变更分对象分类；同一案可含多个后续事件但不混法律效力 ； PASS_FACT/NOT_APPLICABLE/CONFLICT/NEEDS_HUMAN_DECISION；本人、雇主法务与项目归口 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "R009 · 劳动者真实通知/请求；P1（A1/A2/B）",
          "requirement": "原文规则行： R009 劳动者真实通知/请求；P1（A1/A2/B） ； T=本人主张通知或协商；F=单位单方/纯期满而无本人通知；U=签署与实际发出状态不清 ； SRC-004 第36–38条；F016/F017；M007/M004 ； 比通知目标雇主、本人/有权代理、内容及发送时点；平台草稿不等同已发，协商邀请不等于已达成协议 ； PASS_FACT/NOT_APPLICABLE/NEEDS_MATERIAL/UNREADABLE/CONFLICT；劳动者与接收雇主 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "R010 · 书面通知送达及时间线；P1/P2（A1及需证送达者）",
          "requirement": "原文规则行： R010 书面通知送达及时间线；P1/P2（A1及需证送达者） ； T=路径依法涉及送达与期间比较；F=已核路径无需该项；U=收件主体/接收时间不明 ； SRC-004 第37、40条；F017/F018/F019/F020；M003/M005/M007/M008 ； 收件回执与签约雇主、试用期、通知正文比对；法定时限按正确起点人工复核，未经确认的校内线上渠道不能认作有效送达 ； PASS_FACT/NOT_APPLICABLE/NEEDS_MATERIAL/CONFLICT/NEEDS_HUMAN_DECISION；雇主收件方与法务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "R011 · 劳动者第38条事由事实；P1/P2（A2）",
          "requirement": "原文规则行： R011 劳动者第38条事由事实；P1/P2（A2） ； T=主张第38条解除；F=已核仅第37条或合意路径；U=理由种类或履行事实不明 ； SRC-004 第38条；F017/F041/F034；M007/M029/M022 ； 核主张期间/雇主与已有工资社保或其他原记录；未到账据、证明冲突时不替仲裁作法律成立判断；敏感信息最小收集 ； PASS_FACT（仅“提交了凭据”）/NOT_APPLICABLE/NEEDS_MATERIAL/CONFLICT/NEEDS_HUMAN_DECISION；雇主法务或法定机构 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "R012 · 协商合意及双方签名；P3（B）",
          "requirement": "原文规则行： R012 协商合意及双方签名；P3（B） ； T=双方已声称达成解除协议；F=明示尚在协商且无协议；U=签署状态不明 ； SRC-004 第36条；F006/F024/F026；M004/M009/M003 ； 对齐合同双方、签署授权、协议日期、内容和版本；未达成时为后续未形成而非初申请缺件 ； PASS_FACT（仅有效原件可核事实）/NOT_APPLICABLE/CONFLICT/NEEDS_HUMAN_DECISION；合同双方/雇主授权人 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R013",
          "title": "R013 · 用人单位拟单方解除事由事实；P2（C）",
          "requirement": "原文规则行： R013 用人单位拟单方解除事由事实；P2（C） ； T=真实雇主拟单方解除；F=劳动者自主解除/合意或纯届满；U=单位真实发起与事由不明 ； SRC-004 第39–41条；F015/F021；M010/M003 ； 逐项比雇主列明条款、证据日期、规章及劳动者对应行为；不得从 PI 负评或资金不足自动推出法定事由 ； PASS_FACT（仅事由记录一致）/NOT_APPLICABLE/NEEDS_MATERIAL/CONFLICT/NEEDS_HUMAN_DECISION；实际雇主人事法务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R014",
          "title": "R014 · 法定保护、延续及限制的适用事实；P2/P3（C/D）",
          "requirement": "原文规则行： R014 法定保护、延续及限制的适用事实；P2/P3（C/D） ； T=法定单方或期满路径需审保护/延续；F=已核明确不触发对应法条；U=保护情形未核 ； SRC-004 第42、45条；F022/F010/F021；M012/M003/M011 ； 只收有权人事/法务形成的最小结论，核时间窗口；无病历不等于无保护；不得上传原始医疗等不必要敏感资料 ； NOT_APPLICABLE/PASS_FACT（仅有权核验记录）/NEEDS_HUMAN_DECISION/CONFLICT；雇主有权人事与法务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "R015 · 法定工会程序记录；P3（C适用时）",
          "requirement": "原文规则行： R015 法定工会程序记录；P3（C适用时） ； T=经有权人判应履行法定工会通知；F=可信确认不属于触发范围；U=适用范围或处理记录不明 ； SRC-004 第43条；F023/F021；M013/M010 ； 核通知、工会意见、处理回执与解除行为先后；学校具体工会受理环节未知；到阶段才检 ； PASS_FACT/NOT_APPLICABLE/NEEDS_MATERIAL/NEEDS_HUMAN_DECISION；用人单位与工会 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R016",
          "title": "R016 · 雇主法律文书/决定的真实性；P3（形成后）",
          "requirement": "原文规则行： R016 雇主法律文书/决定的真实性；P3（形成后） ； T=宣称已发出单方解除/终止文书；F=尚处草拟未作决定；U=签发主体或送达未知 ； SRC-004 第39–50条、SRC-013 第24条；F006/F025/F026；M014/M004/M008 ； 比雇主法人、授权、签发对象/合同、时间、实际来源；系统预审不得生成有权文书；效力争议仅有权机关判 ； PASS_FACT（仅文件存在及匹配）/NOT_APPLICABLE/CONFLICT/NEEDS_HUMAN_DECISION；真实雇主/法定机构 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "R017 · 届满/法定终止事件真实性；P1–P3（D）",
          "requirement": "原文规则行： R017 届满/法定终止事件真实性；P1–P3（D） ； T=主张合同依法期满、任务型工作已完成或其他法定终止；F=属其他路径且无届满；U=合同变更/延续/继续用工不明 ； SRC-004 第15、44–45条、SRC-013 第13/22条、SRC-016 第10–11条；F008/F010/F011/F022/F026/F043；M003/M005/M011/M012/M031（条件） ； 合同实际版本与法定终止事由/延续结论交叉；任务完成是合同约定的“任务型终止”才进一步核，单纯资金结束不是；期满继续工作交 R032；法律效力人工核 ； PASS_FACT（仅日期/项目或劳动事实）/NOT_APPLICABLE/CONFLICT/NEEDS_HUMAN_DECISION；合同主体人事法务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "R018 · 项目完结不等于劳动关系结束；P1/P2（E）",
          "requirement": "原文规则行： R018 项目完结不等于劳动关系结束；P1/P2（E） ； T=项目结题/经费事件作为离岗理由；F=无此事件且不依赖项目完结；U=项目台账取不到 ； SRC-004 第44–45条、SRC-012 第2条；F012/F013/F039/F010；M006/M028/M003 ； 分比项目号/批次/结题时点和合同的终止条件；合同未见相应法定事件不能自动衍生解除文书 ； PASS_FACT（仅项目事实）/NOT_APPLICABLE/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；项目归口与雇主 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "R019 · 团队变更与劳动合同持续性；P1/P2（F）",
          "requirement": "原文规则行： R019 团队变更与劳动合同持续性；P1/P2（F） ； T=仅内转/换岗或合同变更；F=已核为真正离岗解除且无内转；U=新旧团队安排无权威版本 ； SRC-004 第35条；F014/F015/F019/F011；M027/M005/M006 ； 对新旧岗位有效期、合同双方书面变更与交接范围；团队接收证明不等同劳动关系终止 ； PASS_FACT（仅安排事实）/NOT_APPLICABLE/NEEDS_MATERIAL/CONFLICT；团队归口与真实雇主 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R020",
          "title": "R020 · 交接义务对象清单；P2/P4（G及其他有交接义务时）",
          "requirement": "原文规则行： R020 交接义务对象清单；P2/P4（G及其他有交接义务时） ； T=已识别存在工作/资产/资料交接责任；F=有权归口明确此项无交接对象；U=台账/责任范围不明 ； SRC-004 第50条、SRC-007、SRC-008（职责索引）；SRC-018/019 仅外校结构参考，不提供判断阈值；F027；M016 ； 逐项比资产号/资料类别、责任人、时间快照；不能以空白单自动判无物、不能以交接缺失推法律解除无效；外校会签不作为必要条件 ； PASS_FACT（仅范围已核）/NOT_APPLICABLE/NEEDS_MATERIAL/POLICY_UNCONFIRMED；项目与保管归口 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R021",
          "title": "R021 · 实物及固定资产签收；P4",
          "requirement": "原文规则行： R021 实物及固定资产签收；P4 ； T=清单包含需交资产；F=有权核定无此项；U=有清单但接收人/数量未知 ； SRC-008（INDEX_ONLY，签收细则待核）、SRC-004 第50条；F027/F028；M016/M017 ； 一资产一编号比责任人/签收量/时点与原清单；自拍、PI 口头“都交了”不可替保管方回执 ； PASS_FACT（每件签收事实）/NOT_APPLICABLE/NEEDS_MATERIAL/CONFLICT/SOURCE_UNAVAILABLE；资产登记及保管人 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "R022 · 科研数据与档案移交；P4",
          "requirement": "原文规则行： R022 科研数据与档案移交；P4 ； T=确有可交科研资料/记录；F=有权归口核定无此项；U=资料性质、接收责任或秘密等级不明 ； SRC-007、SRC-012 第9条（限适用项目）；F027/F029/F031；M016/M018/M020 ； 比非涉密目录、资料版本/接收人及安全分流标志；疑似涉密不接收正文，不能以一张总签收冒充科研记录归档 ； PASS_FACT（仅安全回执事实）/NOT_APPLICABLE/CONFLICT/NEEDS_HUMAN_DECISION；科研数据责任方/保密归口 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "R023 · 账号、门禁与访问权回收事实；P4",
          "requirement": "原文规则行： R023 账号、门禁与访问权回收事实；P4 ； T=有待回收账号或权限；F=有权权限台账证明无相关授权；U=权限源未接通 ； SRC-008（机构线索，账户规则待查）；F030/F027；M019/M016 ； 对权限清单/撤销事件、操作人、实际时间比对；只读不执行停权，未接接口可受控人工核验 ； PASS_FACT/NOT_APPLICABLE/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；实际系统权限 Owner 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R024",
          "title": "R024 · 涉密专项安全分流；P0/P2/P4（J及疑似涉密）",
          "requirement": "原文规则行： R024 涉密专项安全分流；P0/P2/P4（J及疑似涉密） ； T=获授权标志确认属于 SRC-012 适用涉密项目；F=有权标志证实不属涉密流程；U=未经核准密级/类别 ； SRC-012 第2、9条；F012/F031；M006/M020 ； **分流在读取材料正文前执行**；T 不进入普通 OCR/上传，仅收可公开办理标志；未分类 U 保守禁止密件导入，不由模型读文定密 ； PASS_FACT（仅分流标志）/NOT_APPLICABLE/NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE；有权保密机构 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R025",
          "title": "R025 · 特定重点项目成员调整结论；P3/P4（J或命中该项目）",
          "requirement": "原文规则行： R025 特定重点项目成员调整结论；P3/P4（J或命中该项目） ； T=SRC-012 范围内且人员变更触发其第10条；F=有权证实不在该范围或未触发调整；U=项目级别、人员类别或审批状态不明 ； SRC-012 第2、10条；F012/F014/F032；M006/M021 ； 核项目/人员/调整事项及公开可查决定状态；雇主解除不能代替项目链成员变更批准；涉密回执只留安全状态 ； PASS_FACT（仅已有决定可核）/NOT_APPLICABLE/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；项目主管授权链 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R026",
          "title": "R026 · 解除/终止证明办理；P5",
          "requirement": "原文规则行： R026 解除/终止证明办理；P5 ； T=可信劳动关系解除/终止事件已发生；F=仅拟申请/仍在劳动关系中；U=实际法律事件未证 ； SRC-004 第50条、SRC-013 第24条；F025/F026/F033；M009/M014/M015 ； 比雇主、劳动者、合同、解除/终止日期及证明法定记载项；后置文件不作为初申必填，不代签发 ； PASS_FACT（仅证明记录）/NOT_APPLICABLE/NEEDS_MATERIAL/NEEDS_HUMAN_DECISION；用人单位证明出具人 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R027",
          "title": "R027 · 工资支付状态；P5或出现欠薪主张时",
          "requirement": "原文规则行： R027 工资支付状态；P5或出现欠薪主张时 ； T=存在到期工资/报酬办理事实；F=有权核定该目标期间无工资项；U=工资所属雇主/期间/状态不明 ； SRC-004 第30、50条；F034/F026；M022/M003 ； 按目标工资期间与来源核“已受理/已付/有异议”，不可用社保或经济补偿回执替代工资；系统不执行付款 ； PASS_FACT（仅支付状态）/NOT_APPLICABLE/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；实际雇主薪酬财务归口 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R028",
          "title": "R028 · 外部争议、复核与裁决效力；P6/触发时",
          "requirement": "原文规则行： R028 外部争议、复核与裁决效力；P6/触发时 ； T=有复核或劳动争议文书；F=经确认无此业务请求；U=案件效力/受理状态不明 ； SRC-004 第77条；F035/F040；M024/M026 ； 比正式案号/受理阶段/生效标记，区分在途与终局；系统不裁断违法解除、赔偿及争议结果 ； PASS_FACT（仅程序状态）/NOT_APPLICABLE/CONFLICT/NEEDS_HUMAN_DECISION；真实复核机关/仲裁法院 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R029",
          "title": "R029 · 相邻 G50/S/T 结论的可复用性；P0–P6",
          "requirement": "原文规则行： R029 相邻 G50/S/T 结论的可复用性；P0–P6 ； T=依赖录用、合同变更、项目/资产等他案决定；F=本项事实不依赖他案；U=原决定版本/作用域不明 ； SRC-009（仅技术线索）、SRC-004/012（限事实适用）；F037/F002/F005/F007/F012；M025 ； 比原 Owner、决定编号、人员/合同/项目、时点、当前/撤销状态；只消费不重签，过期源重核，不能由 run@rev 仿冒 ； PASS_FACT（仅引用一致）/NOT_APPLICABLE/CONFLICT/SOURCE_UNAVAILABLE；原业务决定 Owner 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R030",
          "title": "R030 · 申请变更、撤回、材料版本及定向重审；P0–P6",
          "requirement": "原文规则行： R030 申请变更、撤回、材料版本及定向重审；P0–P6 ； T=出现补件、草稿撤回、更正、重提或复核；F=无新变更/请求；U=目标版本、操作者或外部法律事实不明 ； SRC-004 第36–38、77条、SRC-009（仅技术）；F036/F038/F040/F017/F018；M001/M023/M026/M007/M008 ； 比请求人与权限、前后 hash、父版本及所依 R；平台撤回**不**撤销已实际送达的通知、协议或真实决定；只使依赖旧证据的预审结论失效 ； PASS_FACT（仅操作链）/NOT_APPLICABLE/CONFLICT/NEEDS_HUMAN_DECISION；V3 Owner、本人及真正有权法律主体 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R031",
          "title": "R031 · 接触职业病危害作业者的离岗检查状态；P2/P3（K或C/D条件触发）",
          "requirement": "原文规则行： R031 接触职业病危害作业者的离岗检查状态；P2/P3（K或C/D条件触发） ； T=有权职业卫生记录确认岗位接触法定职业病危害；F=有权确认不接触；U=岗位风险或检查状态不明 ； SRC-004 第42/45条、SRC-016 第17条、SRC-017 第35–36条；F022/F042；M012/M030 ； 查真实岗位危害记录及“离岗检查组织/完成”最小状态，**不是**从实验室名称推断；缺检查涉及单位义务和劳动关系效力，必须人事法务/职业卫生处理，不上传病历 ； PASS_FACT（仅核到检查状态）/NOT_APPLICABLE/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；真实雇主职业卫生与法务 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R032",
          "title": "R032 · 期满后继续实际用工事实；P2（D/L）",
          "requirement": "原文规则行： R032 期满后继续实际用工事实；P2（D/L） ； T=纸面期满后存在继续工作或雇主异议线索；F=有权证据确认无此项；U=是否继续工作/是否异议未知 ； SRC-016 第10–11条、SRC-004 第14/44条；F010/F011/F043；M003/M005/M031 ； 对照期满日之后真实劳动、工资、管理行为和异议时间，不凭一张考勤截图认定法律关系；R017 须消费本结论的事实状态 ； PASS_FACT（仅继续工作事实）/NOT_APPLICABLE/CONFLICT/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；雇主用工法务/有权争议机关 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R033",
          "title": "R033 · 敏感信息与涉密材料读取授权；P0–P6",
          "requirement": "原文规则行： R033 敏感信息与涉密材料读取授权；P0–P6 ； T=处理含个人或潜在秘密的材料；F=可信确认仅不涉及个人信息/秘密的公共证据；U=合法处理依据、使用目的、权限或密级不明 ； SRC-014 第6/13/21/24/28条、SRC-015 第31/35–36条、SRC-012 第9条（特定项目）；F002/F022/F031/F035/F036；M001/M012/M020/M023/M024 ； 先核处理目的、法定/合同/有效同意等依据、数据最小化和真实读权限；涉密风险先执行 R024 安全分流；仅允许授权审阅不允许普通 OCR 处理密件 ； PASS_FACT（仅权限/最小化证据事实）/NOT_APPLICABLE/POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；有权数据保护/保密管理员 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R034",
          "title": "R034 · 档案与社保关系转移办理事实；P5",
          "requirement": "原文规则行： R034 档案与社保关系转移办理事实；P5 ； T=适用劳动关系解除/终止且到相应单位义务阶段；F=法律或身份路由证实此项不归该主体/情形；U=转移主体或时间不明 ； SRC-004 第50条；F026/F044；M015/M032 ； 以 `target=档案`、`target=社会保险关系` 分实例核受理/转移回执及日期；法律规定由有权主体履责，模板只提供提醒与事实跟踪 ； PASS_FACT/NOT_APPLICABLE/NEEDS_MATERIAL/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；实际用人单位与法定经办方 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R035",
          "title": "R035 · 经济补偿支付事实；P5（依法触发时）",
          "requirement": "原文规则行： R035 经济补偿支付事实；P5（依法触发时） ； T=由法律/有权处理结果认定存在补偿项目；F=有权确认个案不触发；U=是否触发、支付主体或争议尚不清 ； SRC-004 第46–50条、SRC-013 第22/27条；F026/F045；M003/M009/M014/M033 ； 以具体补偿事项和实际付款回执为核验目标；劳动合同法第50条有关在办结工作交接时支付补偿的规定不得扩张成扣发普通工资/证明；额度、非法解除等由有权方定性 ； PASS_FACT（仅付款事实）/NOT_APPLICABLE/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；真实雇主财务/法务及争议机关 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "p0",
      "name": "P0 识别业务与身份",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p1"
    },
    {
      "id": "p1",
      "name": "P1 意思表示/事件登记",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p2"
    },
    {
      "id": "p2",
      "name": "P2 初核与分派",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p3"
    },
    {
      "id": "p3",
      "name": "P3 人工协商/决定/通知",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p4"
    },
    {
      "id": "p4",
      "name": "P4 实际工作交接",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p5"
    },
    {
      "id": "p5",
      "name": "P5 解除/终止后履行义务",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p6"
    },
    {
      "id": "p6",
      "name": "P6 补证/更正/复核/归档",
      "kind": "handoff",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "fact-review-summary",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "targeted-supplement-tasks",
      "kind": "supplement-list",
      "audience": "reviewer"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T03:10:00+08:00"
}

/** Backward-friendly explicit name for the definition object. */
export const template = templateVersion

/** Research provenance only. SRC IDs here are not case evidence SourceRef values. */
export const r02Metadata: R02Metadata = {
  "templateId": "T08-T04",
  "name": "项目用工解除、离岗与责任交接审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T08-T04.md",
  "researchSourcePath": "docs/design/review-agent/business-templates/R02/research-original/T08-T04.md",
  "sourceDocumentSha256": "c0d167d169ae808be966a14eecc126b4c73ec453bd5bafd630409658456dcec6",
  "sourceDocumentBytes": 146241,
  "manifestExpectedBytes": 146242,
  "manifestExpectedSha256": "ef4847f5e08744cacb311b383c99eabd79f812619905baf64822edcd86adde65",
  "sourceIntegrityStatus": "LINE_ENDING_DRIFT_ONE_LF",
  "sourceIntegrityNote": "research-original 当前 Git blob 不含末尾 LF；审阅副本按原件正文原样复制，SHA-256/字节数记录当前实际字节。清单 SHA-256 对应原始 blob 追加一个 LF；此差异不表示正文损坏。",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "sourceRecordCount": 19,
  "fieldCount": 45,
  "materialSlotCount": 33,
  "criterionCount": 35,
  "criteria": [
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-011",
        "SRC-013",
        "SRC-016",
        "SRC-018",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-004",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-004",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-010",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-004",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-004",
        "SRC-013",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-004",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-004",
        "SRC-007",
        "SRC-008",
        "SRC-018",
        "SRC-019"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-004",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-007",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-004",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R029",
      "sourceIds": [
        "SRC-004",
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R030",
      "sourceIds": [
        "SRC-004",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R031",
      "sourceIds": [
        "SRC-004",
        "SRC-016",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R032",
      "sourceIds": [
        "SRC-004",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R033",
      "sourceIds": [
        "SRC-012",
        "SRC-014",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R034",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R035",
      "sourceIds": [
        "SRC-004",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ],
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
    "SRC-018",
    "SRC-019"
  ],
  "researchEvidenceStatus": "PARTIAL"
}