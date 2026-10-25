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
  "templateId": "T08-T05",
  "version": 1,
  "schemaVersion": 2,
  "name": "团队实验室管理员、岗位负责人及组织授权人变更审核",
  "description": "团队实验室管理员、岗位负责人及组织授权人变更审核。本地研究模板 · 非校方正式模板。政策证据状态：PARTIAL；仅用于事实提取、差异提示和人工复核，不产生学校正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板由 R02 研究 Markdown 转换；非校方正式模板。SRC 仅是研究来源索引，不是案卷 SourceRef。所有校内政策、权限、法律关系或正式决定未确认时必须人工复核。",
  "objectType": "organization",
  "displayName": {
    "template": "团队实验室管理员、岗位负责人及组织授权人变更审核（本地研究案卷）"
  },
  "fields": [
    {
      "key": "F001",
      "label": "案卷号（F001）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F001 | 案卷号/string | CaseIntent | P1 | 受信案卷服务生成，不由文件自报 | case:id | P1 | S；未建案不可伪造. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F002",
      "label": "实际动作人身份（F002）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F002 | 实际动作人身份/opaque ID | CaseIntent.Actor | P1，各动作重验 | 服务端受信登录身份/人工现场核验留痕；非 Renderer 输入 | session:principal、log:actor | P2 | S/H；拒绝匿名签发. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F003",
      "label": "动作人单位与当前经办资格（F003）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F003 | 动作人单位与当前经办资格/object | CaseIntent.ActorAffiliation | P1，P3–P6 重验 | 学校组织/人员权限源或单位有权人员核验 | record:org-role@v | P2 | S/H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F004",
      "label": "代理链与授权范围（F004）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F004 | 代理链与授权范围/ref+interval | CaseIntent.Delegation | P1 条件、P3 再验 | 有权委托文件/可信授权登记；仅自述不可信 | M003:条款/签章 | P2 | N/H；不明即待办. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F005",
      "label": "情形代码（F005）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F005 | 情形代码/enum A–H（可叠加） | CaseIntent | P1 | 申请陈述，经办人核验业务范围 | M001:子类型 | P1 | N/P；未核路由待人. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F006",
      "label": "归属单位（F006）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F006 | 归属单位/受信组织 ID | DutyChangeTarget.Unit | P1–P2 | 学校正式组织主数据/单位证明 | M004:单位记录 | P1 | S/H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F007",
      "label": "实验室或团队 ID（F007）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F007 | 实验室或团队 ID/名称/object | DutyChangeTarget.LabTeam | P1–P2 | 单位实验室/团队名录，必要时人工确认 | M004:名录项@v | P1 | S/H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F008",
      "label": "房间或设施范围（F008）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F008 | 房间或设施范围/list | DutyChangeTarget.Room | P1 条件 | 有权房间台账/风险信息牌，按房间逐项归属 | M004:房间号 | P1 | N/S；若职位不绑定房间可 N/A. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F009",
      "label": "责任岗位类型（F009）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F009 | 责任岗位类型/enum+localCode | DutyChangeTarget.Duty | P1 | 申请陈述与组织岗位/安全责任定义对照 | M001:岗位、M005:责任类型 | P1 | N/P. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F010",
      "label": "拟调整的职责（F010）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F010 | 拟调整的职责/授权范围/structured text | DutyChangeTarget.Scope | P1–P2 | 原岗位职责记录/原授权文书及申请变更描述 | M001:范围、M005/M009:条款 | P1/P3 | N/X；不因标题相同视为同权. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F011",
      "label": "变更理由及触发事实（F011）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F011 | 变更理由及触发事实/enum+text | CaseIntent.Reason | P1 | 申请说明；有事实的附有权离岗/调岗等记录 | M001:事由、M007:原因 | P1/P2 | N；真实性待核. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F012",
      "label": "原持有人（F012）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F012 | 原持有人/opaque person ref 或可信空缺 | DutyChangeTarget.PreviousHolder | P1–P2 | 有效原岗位/房间责任台账 | M005:原记录@v | P2 | S/X；不能按同名匹配. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F013",
      "label": "拟任人员（F013）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F013 | 拟任人员/opaque person ref | DutyChangeTarget.ProposedHolder | P1–P2 | 人事/聘用/在站/被允许的校外身份权威记录 | M006:person@v | P2 | N/S/H. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F014",
      "label": "拟任人员身份类别（F014）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F014 | 拟任人员身份类别/enum | PersonSnapshot | P2 | 学校有效身份记录；教工/项目聘用/博士后/学生/访学/其他 | M006:身份类别 | P2 | S/P；不推导任岗资格. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F015",
      "label": "任职或聘用有效状态（F015）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F015 | 任职或聘用有效状态/interval+status | PersonSnapshot | P2 | T02/T08 已生效结论或校方人事/博士后权威记录 | M006/M008:文号@v | P2 | S/H；“拟录用”不算已聘. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F016",
      "label": "原岗位责任记录（F016）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F016 | 原岗位责任记录/record ref+sourceVersion | RoleAssignment | P2 | 实验室/单位现有任命、指定、责任牌对应权威台账 | M005:record@v | P1/P2 | S/X. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F017",
      "label": "原职责生效（F017）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F017 | 原职责生效/失效区间/interval | RoleAssignment | P2 | F016 所属正式记录/原文书 | M005:生效栏 | P1 | S/H；不自行补日期. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F018",
      "label": "期望生效时间（F018）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段字典摘录：F018 | 期望生效时间/date 或 unknown | CaseIntent | P1 | 申请意向，**非已确定生效日** | M001:拟生效日 | P1 | N；不得用作逾期阈值. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F019",
      "label": "实验室风险类别（F019）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F019 | 实验室风险类别/等级/record ref | LabRisk | P2 条件 | 有权实验室安全分类分级/危险源台账，SRC-001 第 8、16 条 | M004:风险记录@v | P3 | S/H；不能从照片凭空定级. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F020",
      "label": "已发生培训（F020）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F020 | 已发生培训/准入结论/ref+status | SafetyQualification | P2 条件 | G04/专门安全培训或操作准入的权威记录 | M010:decision@v | P2/P3 | S/H；未取得不等于自动无资格. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F021",
      "label": "前置人事（F021）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F021 | 前置人事/用工决定/ref+version | LinkedDecision.HR | P2 条件 | T02/T08 或学校人事/用工原决定 | M008:decision@v | P2 | S/H；不同意时不能替代决定. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F022",
      "label": "资产（F022）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F022 | 资产/门禁/专项许可关联/ref+version | LinkedDecision.Special | P2/P5 条件 | G04、T04 或具体有权系统 | M010/M015:ref@v | P2/P3 | S/H；不能据本案改其状态. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F023",
      "label": "原组织授权及期限（F023）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F023 | 原组织授权及期限/issuer+scope+interval | OriginalDelegation | P2，D 情形 | 有效组织授权原文/可验记录，含签发组织 | M009:正文与有效期 | P3 | N/S/H；不存在先人工核是否超范围. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F024",
      "label": "材料及主从版本（F024）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F024 | 材料及主从版本/manifest | EvidenceVersion | P1，所有补件 | 系统收件记录/源文件和权威记录版本，独立签名与哈希 | evidence:hash/page/@v | 依材料最高级 | S/X；版本不可追溯则不自动通过. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F025",
      "label": "文书签发者权限核验（F025）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F025 | 文书签发者权限核验/issuer+result | EvidenceAuthority | P2/P4 | 人事/机构现行权限配置与签署源校验 | M009/M013/M020:签发记录 | P2/P3 | P/H；姓名签名不是证明. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F026",
      "label": "交接对象与实际状态（F026）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F026 | 交接对象与实际状态/list+status | Handover | P2 已发生时，P5 复核 | 单位现状核对、双方可核交接及资产/钥匙等独立系统引用 | M011/M012:项目/回执 | P1/P2 | N/S/H；缺权威结果不判完成. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F027",
      "label": "有权决定机关及权限条款（F027）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F027 | 有权决定机关及权限条款/record ref | DecisionAuthority | P4 | 学校现行组织权限/岗位指定规定与权限矩阵 | M020:条/页/版本 | P1/P3 | P/H；不得客户端自选审批人. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F028",
      "label": "正式决定 ID、结果、版本（F028）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F028 | 正式决定 ID、结果、版本/record | Decision | P4 之后 | 有权组织经受信签发的原始决定 | M013:文号/签章@v | P2/P3 | H/S；不可用 PASS_FACT 填充. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F029",
      "label": "正式生效起止（F029）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F029 | 正式生效起止/interval | Decision | P4/P5 | F028 原决定、依法有效变更/撤销文书 | M013:生效条款 | P1/P2 | H；不以 F018 代替. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F030",
      "label": "责任牌（F030）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F030 | 责任牌/台账同步回执/record ref | PostDecisionSync | P5 | 有权实验室/房间台账管理系统或人工复核原件 | M014:record@v | P1 | S/H；并非 P1 缺件. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F031",
      "label": "补件、撤回、复核动作与效力（F031）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F031 | 补件、撤回、复核动作与效力/log ref | CaseAction | P3/P6 | 服务端受信操作日志、校方处理结论 | M016–M019:log/决定 | P2 | S/H；请求≠已获准撤回. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    },
    {
      "key": "F032",
      "label": "适用政策版本和程序期限（F032）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段字典摘录：F032 | 适用政策版本和程序期限/record | PolicyBinding | P1–P6 | SRC-001、现行学院/校级办事规程、经有权单位确认的配置 | SRC:条页/生效、M020 | P0/P1 | P/H；未知期限不自动拒收. 此为本地研究字段，不代表学校表单必填；缺失、来源失联、不可读、冲突和政策未知须分别记录，不得把未知默认为 false 或通过。"
    }
  ],
  "materialSlots": [
  {
    "id": "M001",
    "name": "M001 说明本次“什么岗位/谁/哪个房间/为何更换”；经办人持有的结构化变更陈述（申请页或单位实际表单）",
    "purpose": "说明本次“什么岗位/谁/哪个房间/为何更换”；经办人持有的结构化变更陈述（申请页或单位实际表单）；说明本次“什么岗位/谁/哪个房间/为何更换”；经办人持有的结构化变更陈述（申请页或单位实际表单）；`C@P1`；合法替代为校方已存在的电子业务申请记录，不是强迫上传手写申请书；F005–F013、F018；SRC-001（责任范围）、SRC-010（模板范围未核）。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F005",
      "F013",
      "F018"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M002",
    "name": "M002 证明经办人真实身份、隶属及经办资格；学校身份/组织权限服务或单位有权核验记录持有",
    "purpose": "证明经办人真实身份、隶属及经办资格；学校身份/组织权限服务或单位有权核验记录持有；证明经办人真实身份、隶属及经办资格；学校身份/组织权限服务或单位有权核验记录持有；`C@P1`、P3–P6 再验；如校方可查原始记录禁止无故另交身份证复印件；系统断连可以受信人工核验；F002–F003；SRC-001 第 6–7 条（组织责任）、SRC-002（部门职能待时效核）。拟任人身份 F014 由 M006 证明。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F003",
      "F014"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M003",
    "name": "M003 证明代办合法授权；委托人/单位持有的委托/代理原件或可信代理登记",
    "purpose": "证明代办合法授权；委托人/单位持有的委托/代理原件或可信代理登记；证明代办合法授权；委托人/单位持有的委托/代理原件或可信代理登记；`K@P1` 仅代理提出时；无代理则 `NOT_APPLICABLE`；可用校方经核验的授权登记代替纸质委托；F004、F002–F003；SRC-001（不含代理程序）、SRC-010（表单未核）。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F004",
      "F002",
      "F003"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M004",
    "name": "M004 证明单位、实验室/团队、房间与风险范围；学校/二级单位权威组织、场所及安全风险台账持有",
    "purpose": "证明单位、实验室/团队、房间与风险范围；学校/二级单位权威组织、场所及安全风险台账持有；证明单位、实验室/团队、房间与风险范围；学校/二级单位权威组织、场所及安全风险台账持有；`C@P1/P2`；按具体房间/团队读取原始名录或有权单位出具的现状确认；不要求申请人拍全套房间牌；F006–F008、F019；SRC-001 第 2、6、8、16、22 条，SRC-004/005 为实践佐证。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F008",
      "F019"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M005",
    "name": "M005 证明变更前岗位、职责及原责任人；实验室/单位正式责任台账、原指定/任命记录持有",
    "purpose": "证明变更前岗位、职责及原责任人；实验室/单位正式责任台账、原指定/任命记录持有；证明变更前岗位、职责及原责任人；实验室/单位正式责任台账、原指定/任命记录持有；`C@P1/P2`；原岗位确实空缺可由有权单位提供空缺原始记录；不能填虚构旧责任人；F009–F010、F012、F016–F017；SRC-001 第 6–7、22 条。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F009",
      "F010",
      "F012",
      "F016",
      "F017"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M006",
    "name": "M006 证明拟任人身份与在岗/聘用事实；人事/项目用工/博士后或相应权威组织持有的有效状态记录",
    "purpose": "证明拟任人身份与在岗/聘用事实；人事/项目用工/博士后或相应权威组织持有的有效状态记录；证明拟任人身份与在岗/聘用事实；人事/项目用工/博士后或相应权威组织持有的有效状态记录；`C@P1/P2`（事实核）；从有权系统读取优先；无法读取可使用原机关可验记录。此项不证明“必然任岗合格”；F013–F015；SRC-001 第 11 条（培训身份覆盖）、SRC-010（邻接 T/S 未核）。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F013",
      "F015"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M007",
    "name": "M007 证明已发生的离岗、轮岗、停职等变更缘由；单位或人事/项目用工权威记录持有",
    "purpose": "证明已发生的离岗、轮岗、停职等变更缘由；单位或人事/项目用工权威记录持有；证明已发生的离岗、轮岗、停职等变更缘由；单位或人事/项目用工权威记录持有；`K@P1/P2` 仅声称既成事实时；纯工作调整理由可先由 M001 描述，未来离岗决定不作为 P1 必交；F011、F015、F026；SRC-001（责任落实）、SRC-010（T08 路由未核）。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F011",
      "F015",
      "F026"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M008",
    "name": "M008 引用前置人事/聘用/岗位变更已生效结论；T02/T08 人事或项目用工决定保管机关",
    "purpose": "引用前置人事/聘用/岗位变更已生效结论；T02/T08 人事或项目用工决定保管机关；引用前置人事/聘用/岗位变更已生效结论；T02/T08 人事或项目用工决定保管机关；`K@P2` 仅岗位变更依赖已发生的正式人事/合同调整时；优先绑定原 DecisionRef，不重复上传整卷；F015、F021；SRC-010（邻接路由待核）。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F021"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M009",
    "name": "M009 证明原组织授权存在、范围、期限和撤销条件；原签发组织持有的授权文书/受信登记",
    "purpose": "证明原组织授权存在、范围、期限和撤销条件；原签发组织持有的授权文书/受信登记；证明原组织授权存在、范围、期限和撤销条件；原签发组织持有的授权文书/受信登记；`K@P1/P2`，D 类既有授权变更；若从无有效原授权，先人工核是否另属“首次授予”；F010、F023、F025；SRC-001 不支持外部代理权，SRC-010/T07 路由待核。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F023",
      "F025"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M010",
    "name": "M010 证明特定操作/进入实验室已取得安全培训、准入或专项资格；G04/安全部门权威记录保管",
    "purpose": "证明特定操作/进入实验室已取得安全培训、准入或专项资格；G04/安全部门权威记录保管；证明特定操作/进入实验室已取得安全培训、准入或专项资格；G04/安全部门权威记录保管；`K@P2` 仅实际操作/准入权需被核的叠加 F 情形；未产生准入决定时标独立待办，不要求上传将来许可；F019–F020、F022；SRC-001 第 11、18、25 条，SRC-003（现行性未核），SRC-009（G04 对象已核、真实决定接口未核）。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F019",
      "F020",
      "F022"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M011",
    "name": "M011 证明交接范围的当前事实；原/新责任人、实验室或资产保管方的清单草稿、现状盘点",
    "purpose": "证明交接范围的当前事实；原/新责任人、实验室或资产保管方的清单草稿、现状盘点；证明交接范围的当前事实；原/新责任人、实验室或资产保管方的清单草稿、现状盘点；`K@P2/P3` 已开展交接或 E、G 类涉及钥匙/设备/危险源时；可引用权威资产/危险源台账，不要求尚未完成的交接签收；F026、F022；SRC-001 第 16、18、22 条、SRC-003（专项时效待核）。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F022"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M012",
    "name": "M012 证明职责交接确已发生；原/新责任人或指定接管人及单位核验的完成记录",
    "purpose": "证明职责交接确已发生；原/新责任人或指定接管人及单位核验的完成记录；证明职责交接确已发生；原/新责任人或指定接管人及单位核验的完成记录；`L@P5`；若 P1 前已合法完成部分交接，可先作为 M011 的事实附件，但不推定新岗位生效；F026；SRC-001 第 6–7、22 条（责任连续性）、SRC-010（具体交接表未核）。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F026"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M013",
    "name": "M013 证明本次有权人的正式指定、任命、撤销、组织授权或其他决定；相应有权机关持有原始决定",
    "purpose": "证明本次有权人的正式指定、任命、撤销、组织授权或其他决定；相应有权机关持有原始决定；证明本次有权人的正式指定、任命、撤销、组织授权或其他决定；相应有权机关持有原始决定；`L@P4`；没有“可由申请人签个字替代”的合法替代；若电子签发则以受信决定记录代替纸件；F025、F027–F029；SRC-001 第 6–7 条仅支持部分安全责任确定，其他职务/授权待 SRC-010 与校本核。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F027",
      "F029"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M014",
    "name": "M014 证明新责任台账、房间安全信息牌/组织授权登记完成更新；实验室/单位登记机关持有",
    "purpose": "证明新责任台账、房间安全信息牌/组织授权登记完成更新；实验室/单位登记机关持有；证明新责任台账、房间安全信息牌/组织授权登记完成更新；实验室/单位登记机关持有；`L@P5`；对不涉及房间牌的岗位可 `NOT_APPLICABLE`，有权系统更新回执代替照片；F028–F030；SRC-001 第 22 条、SRC-005（2026 当期台账实践）。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F028",
      "F030"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M015",
    "name": "M015 证明独立门禁/危险操作、资产/专项许可系统完成后置同步；G04/T04 等各自有权机关持有",
    "purpose": "证明独立门禁/危险操作、资产/专项许可系统完成后置同步；G04/T04 等各自有权机关持有；证明独立门禁/危险操作、资产/专项许可系统完成后置同步；G04/T04 等各自有权机关持有；`L@P5` 仅触发相应独立业务时；源系统回执代替申请人截图，无决定时保持待办；F020、F022；SRC-001 第 11、16、18 条，SRC-003（专项时效未定），SRC-009/010。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F020",
      "F022"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M016",
    "name": "M016 解释补件、材料更正和前后版本差异；提出更正的受信经办人持有",
    "purpose": "解释补件、材料更正和前后版本差异；提出更正的受信经办人持有；解释补件、材料更正和前后版本差异；提出更正的受信经办人持有；`K@P3`（有补件动作才需）；可用受信表单版本对比和字段审计代替重新提交全套材料；F024、F031；SRC-010（流程待核）。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F024",
      "F031"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M017",
    "name": "M017 证明撤回请求确由有权人提出；申请人/代理人和受信案卷系统持有",
    "purpose": "证明撤回请求确由有权人提出；申请人/代理人和受信案卷系统持有；证明撤回请求确由有权人提出；申请人/代理人和受信案卷系统持有；`K@P3`（仅请求撤回）；校内电子请求回执可代替纸质申请；不等于撤回批准；F002–F004、F031–F032；SRC-010（校本撤回流程未核）。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F004",
      "F031",
      "F032"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M018",
    "name": "M018 证明复核请求指向哪一已存在决定与何种争议；异议申请人及正式受理机关持有",
    "purpose": "证明复核请求指向哪一已存在决定与何种争议；异议申请人及正式受理机关持有；证明复核请求指向哪一已存在决定与何种争议；异议申请人及正式受理机关持有；`K@P6`（仅发生复核时）；有权系统受理记录、异议说明及原决定引用，毋需重传全部初始材料；F028、F031–F032；SRC-010（复核制度未核）。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F028",
      "F031",
      "F032"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M019",
    "name": "M019 证明有权复核机关的维持/撤销/变更结论；复核机关持有",
    "purpose": "证明有权复核机关的维持/撤销/变更结论；复核机关持有；证明有权复核机关的维持/撤销/变更结论；复核机关持有；`L@P6`；电子复核决定可代替纸件；复核申请阶段不得先要求；F028–F031；SRC-010（复核权限待核）。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F028",
      "F031"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M020",
    "name": "M020 证明审批人、签章人、撤回/复核有权主体及适用程序版本；学校职能部门持有的制度/权限矩阵",
    "purpose": "证明审批人、签章人、撤回/复核有权主体及适用程序版本；学校职能部门持有的制度/权限矩阵；证明审批人、签章人、撤回/复核有权主体及适用程序版本；学校职能部门持有的制度/权限矩阵；`P@P2/P4/P6`，非申请人上传义务；SRC-001 可证明部分指定/明确责任，无法覆盖三类人员全部授权；F025、F027、F032；SRC-001 第 5–7、34–35 条，SRC-002（现行性待核）、SRC-010（未读）。原件未规定业务数量上限；槽位 maxCount 使用宽松技术上限，不构成政策阈值。SRC 仅为研究索引，不作为案卷附件或 SourceRef。",
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
      "F027",
      "F032"
    ],
    "allowReuseAcrossSubjects": false
  }
],
  "sections": [
    {
      "id": "R02_RESEARCH_RULES",
      "name": "逐条事实核验",
      "description": "逐条对应 T08-T05 原文 §08 的 R 规则。此分项是研究检查项，不是学校政策；SRC IDs 只保存在 r02Metadata，不得作为案卷 SourceRef。条件性阶段、例外与校本规则待确认时转人工。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "R001 · P1 本次是否为既有职责/授权变更且案卷/目标唯一 T：有可信旧目标或有权确认的空缺、陈述清楚→核 `caseId+targetId`；F：明确首次设岗/无关事项→`NOT_APPLICABLE` 并路由；U：变更与新授予边界不明",
          "requirement": "原文规则行： **R001 P1** 本次是否为既有职责/授权**变更**且案卷/目标唯一 ； T：有可信旧目标或有权确认的空缺、陈述清楚→核 `caseId+targetId`；F：明确首次设岗/无关事项→`NOT_APPLICABLE` 并路由；U：变更与新授予边界不明 ； SRC-001、010；F001、F005、F009–F010；M001、M005 ； 比岗位与职责目标、旧来源版本；申请书只证意向，不证已经任命。生效以旧职责区间和后续决定分别核 ； T 比对一致 `PASS_FACT`；陈述缺→`NEEDS_MATERIAL` 经办人；路由政策不明→`POLICY_UNCONFIRMED` 归口核定；不得自动新设组织权力 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R002",
          "title": "R002 · P1/P3–P6 每次动作人及单位身份真实 T：有受信动作发生→按服务端 principal 与当时单位任职比对；F：无该动作→`NOT_APPLICABLE`；U：身份源失联",
          "requirement": "原文规则行： **R002 P1/P3–P6** 每次动作人及单位身份真实 ； T：有受信动作发生→按服务端 principal 与当时单位任职比对；F：无该动作→`NOT_APPLICABLE`；U：身份源失联 ； SRC-001 §6–7、002、010；F002–F003；M002 ； 查受信身份/组织版本、动作时间和目标，Renderer 声称的 actor/role 及扫描签名低于权威源 ； 一致 `PASS_FACT`（仅身份事实）；源失联 `SOURCE_UNAVAILABLE` 给身份管理员；受信人和材料署名冲突 `CONFLICT` 给经办主管；未具权限不允许写决定 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R003",
          "title": "R003 · P1/P3–P6 代办权限链是否覆盖当前动作 T：操作主体非本人/单位直接经办者→核委托；F：确认无代理→`NOT_APPLICABLE`；U：代理关系未明",
          "requirement": "原文规则行： **R003 P1/P3–P6** 代办权限链是否覆盖当前动作 ； T：操作主体非本人/单位直接经办者→核委托；F：确认无代理→`NOT_APPLICABLE`；U：代理关系未明 ； SRC-001（不规定委托形式）、010；F002–F004；M002–M003 ； 委托主体、事项、对象、期间、撤回及签署源逐项对应动作时点；形式有效性仍由校方制度配置 ； 已证事实 `PASS_FACT`（非准许代理的行政决定）；缺可补委托 `NEEDS_MATERIAL` 给代办人；签发权限未知 `POLICY_UNCONFIRMED` 给单位，冒名 `CONFLICT` 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "R004 · P1/P2 单位—实验室/团队—房间归属匹配 T：目标落具体组织/房间→核组织与房间；F：岗位确不绑定房间则仅房间子项 `NOT_APPLICABLE`；U：场所/组织登记不明",
          "requirement": "原文规则行： **R004 P1/P2** 单位—实验室/团队—房间归属匹配 ； T：目标落具体组织/房间→核组织与房间；F：岗位确不绑定房间则仅房间子项 `NOT_APPLICABLE`；U：场所/组织登记不明 ； SRC-001 §2、6、22；SRC-004/SRC-005 仅为未核新闻线索；F006–F008；M004 ； 比可信组织 ID、场所 ID、校区与台账源版本；房间牌为现实佐证，不可替代原始名录 ； 一致 `PASS_FACT`；校内源不可用 `SOURCE_UNAVAILABLE` 给台账管理人；跨单位矛盾 `CONFLICT` 给双方单位；不可自行合并两个校区 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "R005 · P1/P2 原岗位与原持有人/可信空缺真实 T：确认存在更换目标→核旧记录；F：经有权确认并路由为纯首次设立→`NOT_APPLICABLE`；U：原持有人不明",
          "requirement": "原文规则行： **R005 P1/P2** 原岗位与原持有人/可信空缺真实 ； T：确认存在更换目标→核旧记录；F：经有权确认并路由为纯首次设立→`NOT_APPLICABLE`；U：原持有人不明 ； SRC-001 §6–7、22；F009、F012、F016–F017；M005 ； 比旧岗位/房间/职责、稳定人员 ID、原生效—失效区间、台账版本；空缺必须有可信记录 ； 一致 `PASS_FACT`；原源失联 `SOURCE_UNAVAILABLE` 给实验室台账人；新旧不一致 `CONFLICT` 给所属单位；不能编造旧负责人 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R006",
          "title": "R006 · P1/P2 拟任人唯一且与真实身份相符 T：具体拟任人被指明→核 personId；F：经人工确认只撤旧岗、尚无继任人且允许处理→继任人子项 `NOT_APPLICABLE`，仅标责任空档；U：拟任对象不确定",
          "requirement": "原文规则行： **R006 P1/P2** 拟任人唯一且与真实身份相符 ； T：具体拟任人被指明→核 personId；F：经人工确认只撤旧岗、尚无继任人且允许处理→继任人子项 `NOT_APPLICABLE`，仅标责任空档；U：拟任对象不确定 ； SRC-001 §11、010；F013–F014；M001、M006 ； 用稳定人员 ID 和受信身份类别查本人，姓名 OCR 只是辅助；判断时点为拟生效期 ； 一致 `PASS_FACT`；申报人漏写 `NEEDS_MATERIAL` 给经办人；同名异 ID `CONFLICT` 给人事/单位；任岗资格仍不随身份通过 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "R007 · P2 拟任人/原任人当时聘用或在站事实状态 T：申请以某身份在岗为前提→核有效区间；F：明确该身份不作为本事项条件→`NOT_APPLICABLE`；U：身份时效未知",
          "requirement": "原文规则行： **R007 P2** 拟任人/原任人当时聘用或在站**事实状态** ； T：申请以某身份在岗为前提→核有效区间；F：明确该身份不作为本事项条件→`NOT_APPLICABLE`；U：身份时效未知 ； SRC-001 §11、010；F014–F015；M006–M007 ； 引学校人事/博士后/项目用工有效源；`拟录用/拟续聘/计划离岗`≠既成状态，逐人比较申请时间与状态区间 ； 有效事实 `PASS_FACT`，无现行任岗条件 `POLICY_UNCONFIRMED` 给政策责任人；源失联 `SOURCE_UNAVAILABLE` 给人事；日期冲突 `CONFLICT` 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "R008 · P2 依赖的 T02/T08 岗位/劳动决定已生效且属本目标 T：本次职责依赖既成合同/人事状态调整→引用其决定；F：不依赖→`NOT_APPLICABLE`；U：是否关联不明",
          "requirement": "原文规则行： **R008 P2** 依赖的 T02/T08 岗位/劳动决定已生效且属本目标 ； T：本次职责依赖既成合同/人事状态调整→引用其决定；F：不依赖→`NOT_APPLICABLE`；U：是否关联不明 ； SRC-010；F015、F021；M006、M008 ； 只读原部门 DecisionRef/原件，核签发、人员 ID、版本、生效范围；当前仅有申请单时不得当决定 ； 已证相符 `PASS_FACT`；前置未形成则 `NEEDS_HUMAN_DECISION` 给人事/用工权人；原系统不可用 `SOURCE_UNAVAILABLE`，错配 `CONFLICT`；不在本案作续聘决定 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "R009 · P1/P2 离岗、轮岗、临代等触发事实是否已经发生 T：理由声称已发生离岗/交接前提→核事实日；F：仅为未来意向或普通工作调整→本既成事实规则 `NOT_APPLICABLE`；U：事由不清",
          "requirement": "原文规则行： **R009 P1/P2** 离岗、轮岗、临代等**触发事实**是否已经发生 ； T：理由声称已发生离岗/交接前提→核事实日；F：仅为未来意向或普通工作调整→本既成事实规则 `NOT_APPLICABLE`；U：事由不清 ； SRC-001 §6–7、22，010；F011、F015、F026；M001、M007、M011 ； 申请叙述与有权离岗记录/现状盘点比同一人、岗位、日期；交接草稿不等于完成 ； 相符 `PASS_FACT`；原因说明缺 `NEEDS_MATERIAL` 给经办人；离岗决定尚待有权方→`NEEDS_HUMAN_DECISION`；两源冲突 `CONFLICT` 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "R010 · P1/P2 拟变更职责边界及意向时间无内部歧义 T：申报调整某职责/授权范围→比旧与新范围、拟生效日；F：子目标未要求调整某特定权限→该子项 `NOT_APPLICABLE`；U：范围描述无法辨认",
          "requirement": "原文规则行： **R010 P1/P2** 拟变更职责边界及意向时间无内部歧义 ； T：申报调整某职责/授权范围→比旧与新范围、拟生效日；F：子目标未要求调整某特定权限→该子项 `NOT_APPLICABLE`；U：范围描述无法辨认 ； SRC-001 §6–7、22；F010–F011、F017–F018；M001、M005、M009（D 触发时） ； 同一单位、岗位、房间、事项、旧职责区间逐维对比；F018 仅意向，不得当学校截止或最终生效日 ； 清晰一致 `PASS_FACT`；申请范围漏写 `NEEDS_MATERIAL` 给经办人；范围与旧文不符 `CONFLICT` 给所属单位；授权范围合法性另 `R014/R015` 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "R011 · P2 实验室风险分类与本次目标绑定 T：涉及有分类分级/危险源的房间或 F 叠加→查风险台账；F：权威确认无此风险叠加→`NOT_APPLICABLE`；U：风险源未知",
          "requirement": "原文规则行： **R011 P2** 实验室风险分类与本次目标绑定 ； T：涉及有分类分级/危险源的房间或 F 叠加→查风险台账；F：权威确认无此风险叠加→`NOT_APPLICABLE`；U：风险源未知 ； SRC-001 §8、16、25，003（现行性待核）；F008、F019；M004 ； 以具体房间/危险源 ID、风险类别、源版本、生效时点比对，照片/OCR 不得自定等级 ； 相符 `PASS_FACT`（风险事实）；源失联 `SOURCE_UNAVAILABLE` 给安全管理员；风险政策阈值缺 `POLICY_UNCONFIRMED` 给学校归口；严重不一致 `CONFLICT` 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "R012 · P2/P5 G04 个人准入/专项操作资格的独立结论引用 T：拟任人实际需要准入、危险操作或门禁→引用对应 G04/专项有效决定；F：仅管理职责且不需该操作→`NOT_APPLICABLE`；U：是否涉及操作不明",
          "requirement": "原文规则行： **R012 P2/P5** G04 个人准入/专项操作资格的**独立结论引用** ； T：拟任人实际需要准入、危险操作或门禁→引用对应 G04/专项有效决定；F：仅管理职责且不需该操作→`NOT_APPLICABLE`；U：是否涉及操作不明 ； SRC-001 §11、18、25，003、009；F019–F020、F022；M010、M015（P5 才生成） ； 仅匹配人员×房间/门×操作×时段×版本，G04 T01/T03/T05 与本案不同授权；P2 只引用已有结论，P5 回执后置 ； 关联可信 `PASS_FACT`（仅“引用相符”），无许可时独立 G04 待办 `NEEDS_HUMAN_DECISION`，源不可用 `SOURCE_UNAVAILABLE`；本案**不得开门/签作业票** 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R013",
          "title": "R013 · P2/P4 多岗兼任、跨单位与责任空档事实 T：G/E 叠加或同房多岗位、跨组织→逐目标比范围/时段；F：单目标、无冲突→本叠加 `NOT_APPLICABLE`；U：责任边界未核",
          "requirement": "原文规则行： **R013 P2/P4** 多岗兼任、跨单位与责任空档事实 ； T：G/E 叠加或同房多岗位、跨组织→逐目标比范围/时段；F：单目标、无冲突→本叠加 `NOT_APPLICABLE`；U：责任边界未核 ； SRC-001 §4–7、22；F006–F010、F012–F018、F026；M004–M005、M011、M020 ； 对每一 `unitId+labId+roomId+dutyId+interval` 求重叠/空档；人数上限、兼任/应急合法性均无已证校本阈值 ； 重叠/空档**客观事实**可 `PASS_FACT` 表示已识别，不意味着允许；权责不明 `NEEDS_HUMAN_DECISION` 给各单位；相反权威记录 `CONFLICT`，禁以甲签章覆盖乙 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R014",
          "title": "R014 · P2 D 类原组织授权及原签发权源存在 T：申请变更已存在的组织授权→核旧授权；F：已核从无原授权→该变更分支 `NOT_APPLICABLE` 并人工路由首次授权；U：原权源不明",
          "requirement": "原文规则行： **R014 P2** D 类**原组织授权**及原签发权源存在 ； T：申请变更已存在的组织授权→核旧授权；F：已核从无原授权→该变更分支 `NOT_APPLICABLE` 并人工路由首次授权；U：原权源不明 ； SRC-001（未规定对外权源）、010；F010、F023、F025；M009、M020 ； 比组织、授权人、受权人、事项清单、区间、撤销和签发源；“内部维护台账”不得拼接成“对外签合同” ； 原授权事实相符 `PASS_FACT`，但新授权权源待 `R015`；无校本签批依据 `POLICY_UNCONFIRMED` 给授权组织，扫描件冲突 `CONFLICT` 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "R015 · P2/P4/P6 当前权限矩阵能否证明某主体对该种决定有权 T：即将确认指定/任命、撤销、撤回处理或复核→核有权主体；F：仅 P1 事实陈述无签批动作→本签批检查 `NOT_APPLICABLE`；U：权限清单不全",
          "requirement": "原文规则行： **R015 P2/P4/P6** 当前权限矩阵能否证明某主体对**该种决定**有权 ； T：即将确认指定/任命、撤销、撤回处理或复核→核有权主体；F：仅 P1 事实陈述无签批动作→本签批检查 `NOT_APPLICABLE`；U：权限清单不全 ； SRC-001 §5–7、34–35，002（现行性未知）、010；F025、F027、F032；M020、M013（P4 时） ； 按动作、岗位类别、单位/校区、签发日和当时政策版本检查；SRC-001 仅证安全员“负责人指定”、单位“明确责任”原则，不能推出其他审批权 ； 有权事实相符才 `PASS_FACT`；缺现行程序 `POLICY_UNCONFIRMED` 给归口政策管理员；适用权争议 `NEEDS_HUMAN_DECISION`；无受信校验禁止签发 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R016",
          "title": "R016 · P4 正式决定真实性、内容与效力期间 T：存在实际有权机构作出的 P4 决定→校核决定；F：尚在 P1–P3 且未形成决定→未激活而非缺件；U：声称已决定但来源未验",
          "requirement": "原文规则行： **R016 P4** 正式决定真实性、内容与效力期间 ； T：存在实际有权机构作出的 P4 决定→校核决定；F：尚在 P1–P3 且未形成决定→**未激活**而非缺件；U：声称已决定但来源未验 ； SRC-001 §6–7、22，010；F018、F025、F027–F029；M013、M020 ； 决定 ID、签发权限、岗位/房间/人员、范围、版本、生效区间与授权源交叉比对；草稿/签名图片/`PASS_FACT` 永不代替 Decision ； 原始决定与权限均可证仅给 `PASS_FACT`（决定存在事实），有权裁量仍原机关；政策未知 `POLICY_UNCONFIRMED`，签章疑点 `CONFLICT`，不可读 `UNREADABLE`；不回填为 P1 必需 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "R017 · P2/P5 交接清单现状与完成事实分期核验 T：已经有交接草稿/盘点或 P5 应交接→分期核；F：按有权决定不发生交接的子项→`NOT_APPLICABLE`；U：交接目标不明",
          "requirement": "原文规则行： **R017 P2/P5** 交接清单现状与完成事实分期核验 ； T：已经有交接草稿/盘点或 P5 应交接→分期核；F：按有权决定不发生交接的子项→`NOT_APPLICABLE`；U：交接目标不明 ； SRC-001 §6–7、16、18、22，003；F022、F026；M011（P2）、M012（P5） ； P2 只比钥匙/危险源/设备清单的现状和版本，P5 才比签收责任人、逐项回执、完成日期；资产权属由 T04 判 ； 相应阶段的事实相符 `PASS_FACT`；可补现场清单 `NEEDS_MATERIAL` 给交接经办人，资产源失联 `SOURCE_UNAVAILABLE`；P5 未完成则待办，不倒推 P4 无效 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "R018 · P5 安全责任台账、房间牌/组织登记同步事实 T：P4 有生效决定且岗位触发责任登记→查同步；F：有权核定无此类登记义务→`NOT_APPLICABLE`；U：需同步的范围不清",
          "requirement": "原文规则行： **R018 P5** 安全责任台账、房间牌/组织登记同步事实 ； T：P4 有生效决定且岗位触发责任登记→查同步；F：有权核定无此类登记义务→`NOT_APPLICABLE`；U：需同步的范围不清 ； SRC-001 §22；SRC-005 仅未核新闻线索；F016、F028–F030；M013–M014 ； 逐房/岗位核 P4 决定、更新记录、责任牌、操作者、版本和时间；登记不是任命权源 ； 相符 `PASS_FACT`（已同步事实）；原系统不可用 `SOURCE_UNAVAILABLE` 给台账维护人；牌与 Decision 不一致 `CONFLICT`，不能反推批准 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "R019 · P5 下游独立系统回执与正式决定关联 T：有实际门禁/资产/危险操作等后续变更→核独立回执；F：无下游事项→`NOT_APPLICABLE`；U：是否影响专项系统未定",
          "requirement": "原文规则行： **R019 P5** 下游独立系统回执与正式决定关联 ； T：有实际门禁/资产/危险操作等后续变更→核独立回执；F：无下游事项→`NOT_APPLICABLE`；U：是否影响专项系统未定 ； SRC-001 §11、16、18，003、009、010；F020、F022、F028、F030；M013、M015 ； 仅比独立机关 own DecisionRef、回执 ID、人员/房间/资产/操作、时间、版本；T08 决定不是 G04/T04 决定 ； 回执事实相符 `PASS_FACT`；源失联 `SOURCE_UNAVAILABLE` 给 G04/T04 管理人，错权限 `CONFLICT`；尚未产生则 P5 待办，绝不能假标“已开通” 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R020",
          "title": "R020 · P1–P6 当前依赖证据可读取、源和归属可追溯 T：该阶段 R 需用某源→核读取/定位；F：材料属于未来阶段或本目标不触发→`NOT_APPLICABLE`；U：源不能确认",
          "requirement": "原文规则行： **R020 P1–P6** 当前依赖证据可读取、源和归属可追溯 ； T：该阶段 R 需用某源→核读取/定位；F：材料属于未来阶段或本目标不触发→`NOT_APPLICABLE`；U：源不能确认 ； SRC-001、009、010；F001、F024；M001–M020（按阶段触发） ； 核文件哈希、页区间、图像可读区、源记录 ID/版本、持有人、所属目标；OCR 文本不是原始证据 ； 可追溯 `PASS_FACT`；字迹不明 `UNREADABLE` 给材料持有人/经办人；校内系统失联 `SOURCE_UNAVAILABLE` 给源管理员；不强迫补未来 M013/M019 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R021",
          "title": "R021 · P1–P6 主附件、补页、签章版本是否属同一有效文书 T：同一材料有正文/附件/补充页→逐件比较；F：独立单页权威记录无附件→`NOT_APPLICABLE`；U：版本关系不明",
          "requirement": "原文规则行： **R021 P1–P6** 主附件、补页、签章版本是否属同一有效文书 ； T：同一材料有正文/附件/补充页→逐件比较；F：独立单页权威记录无附件→`NOT_APPLICABLE`；U：版本关系不明 ； SRC-001（仅具体规范背景）、010；F023–F025、F028；M009、M013、M016 ； 核文号、附件号、签发者、签署版本、权限范围、hash 与替换链；未见共同签发依据不拼接扩大权力 ； 关系可证 `PASS_FACT`；页不可读 `UNREADABLE` 给提交人，互相矛盾 `CONFLICT` 给原签发机关；签章效力仍经 `R015/R016` 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "R022 · P3及任意上游更新 受影响证据结论是否失效并定向重核 T：源版本/hash 或上游 DecisionRef 更新→算依赖差异；F：仅上传与现有 R 无关材料→影响规则 `NOT_APPLICABLE`；U：替换关系缺",
          "requirement": "原文规则行： **R022 P3及任意上游更新** 受影响证据结论是否失效并定向重核 ； T：源版本/hash 或上游 DecisionRef 更新→算依赖差异；F：仅上传与现有 R 无关材料→影响规则 `NOT_APPLICABLE`；U：替换关系缺 ； SRC-009（技术参考）、010；F015–F016、F020–F025、F031；M005、M008–M010、M016 ； 记录旧 `sourceVersion→new`、变更字段、受影响 `ruleId,targetId`；旧事实结果标 `STALE_FACT` 内部标记而非第九个对外结果码；新 run 仅重算依赖子图 ； 版本关系正确 `PASS_FACT`（重算范围事实）；来源链冲突 `CONFLICT` 给证据核验人；缺更正说明 `NEEDS_MATERIAL` 给经办人；已签发决定**不自动撤销** 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "R023 · P3 撤回请求与原案归属、请求人权限 T：收到撤回请求→核受信动作和原案；F：未申请撤回→`NOT_APPLICABLE`；U：请求真实性未知",
          "requirement": "原文规则行： **R023 P3** 撤回**请求**与原案归属、请求人权限 ； T：收到撤回请求→核受信动作和原案；F：未申请撤回→`NOT_APPLICABLE`；U：请求真实性未知 ； SRC-010（程序待核）；F001–F004、F028、F031–F032；M002–M003、M017、M020 ； 比 case/target、请求人、权限、到达时间、P4 是否生效，校本撤回截止和效力未知；请求回执≠获准 ； 请求事实相符 `PASS_FACT`（仅收到请求），权限/效力未知 `POLICY_UNCONFIRMED` 或 `NEEDS_HUMAN_DECISION` 给原受理/决定机关；不得直接删除案或撤销决定 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R024",
          "title": "R024 · P1/P3 撤回后重新申请是否为独立提交且不借用失效结论 T：重提关联旧案→校验新 case/target 和旧状态；F：首次申请→`NOT_APPLICABLE`；U：旧案是否撤回/决定不明",
          "requirement": "原文规则行： **R024 P1/P3** 撤回后重新申请是否为独立提交且不借用失效结论 ； T：重提关联旧案→校验新 case/target 和旧状态；F：首次申请→`NOT_APPLICABLE`；U：旧案是否撤回/决定不明 ； SRC-010；F001、F002–F005、F024、F031；M001–M002、M016–M017 ； 新申请拥有新案号/当前源版本与独立审批链；可复用仍有效权威资料但不能继承旧 `PASS_FACT` 作为新决定 ； 关系明晰 `PASS_FACT`（关联事实），旧案决议矛盾 `CONFLICT` 给案卷管理员；撤回效力未知 `NEEDS_HUMAN_DECISION`；不改写历史审计 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R025",
          "title": "R025 · P6 异议/复核指向真实决定并由有权方处理 T：收到复核/异议→核原决定及争议目标；F：无人提出→`NOT_APPLICABLE`；U：资格/受理权限不明",
          "requirement": "原文规则行： **R025 P6** 异议/复核指向真实决定并由有权方处理 ； T：收到复核/异议→核原决定及争议目标；F：无人提出→`NOT_APPLICABLE`；U：资格/受理权限不明 ； SRC-010（校本救济程序未核）；F002–F003、F025、F027–F032；M002、M013、M018–M020 ； 核原 `decisionId@v`、争议项、受信申请人、提出时间、有权复核签发者；复核结论 `M019` 仅在后续形成；不得填默认 7/15/30 天 ； 关联事实可 `PASS_FACT`；程序/期限未知 `POLICY_UNCONFIRMED` 给原决定机关/复核机关；复核裁量 `NEEDS_HUMAN_DECISION`；无有效新决定不得改旧决定效力 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R026",
          "title": "R026 · P1–P6 当前学校、校区、岗位及动作的政策版本可适用 T：拟套用某项校本硬条件、时限或权限→验证政策；F：仅非规范性的材料整理/可读性比对→`NOT_APPLICABLE`；U：存在/现行性未定",
          "requirement": "原文规则行： **R026 P1–P6** 当前学校、校区、岗位及动作的政策版本可适用 ； T：拟套用某项校本**硬条件、时限或权限**→验证政策；F：仅非规范性的材料整理/可读性比对→`NOT_APPLICABLE`；U：存在/现行性未定 ； SRC-001–003、006–008、010；F005、F006、F009、F025、F027、F032；M020 ； 对发布机关、条款、生效和废止、适用单位与动作时点核对；明确废止 SRC-007，SRC-003 仅辅助，G50 不能补校规 ； 有效适用版本可证 `PASS_FACT`（仅政策匹配事实）；版本未知 `POLICY_UNCONFIRMED` 给政策主管，不启用任岗/兼任人数/截止等硬阈值；行政裁量始终 `NEEDS_HUMAN_DECISION` 。执行边界：只核验本案可追溯事实与来源版本；SRC 是研究来源索引，不是案卷材料 SourceRef。若政策现行性、适用身份、签发权限、法律关系或事实真伪未证，结果必须保持待确认/人工复核；不得自动批准、拒绝、签约、解除、任命或回写学校系统。",
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
      "name": "P0 变更意向",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p1"
    },
    {
      "id": "p1",
      "name": "P1 申请/候选案建立",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p2"
    },
    {
      "id": "p2",
      "name": "P2 事实核验和权威引用",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p3"
    },
    {
      "id": "p3",
      "name": "P3 补件/更正/撤回申请",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p4"
    },
    {
      "id": "p4",
      "name": "P4 有权主体形成决定",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p5"
    },
    {
      "id": "p5",
      "name": "P5 生效、交接及系统同步",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p6"
    },
    {
      "id": "p6",
      "name": "P6 异议/复核",
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
  "templateId": "T08-T05",
  "name": "团队实验室管理员、岗位负责人及组织授权人变更审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T08-T05.md",
  "researchSourcePath": "docs/design/review-agent/business-templates/R02/research-original/T08-T05.md",
  "sourceDocumentSha256": "2bcf4ea9d7b4970b1fc8d6cefc6d63640c1ee5334b4f3a61e28b8b5ab77fe583",
  "sourceDocumentBytes": 129754,
  "manifestExpectedBytes": 129755,
  "manifestExpectedSha256": "d328ede5f607aabefdf19168ea4f2efe24a27a12357a9eb4dfeb26cc4c73ac11",
  "sourceIntegrityStatus": "LINE_ENDING_DRIFT_ONE_LF",
  "sourceIntegrityNote": "research-original 当前 Git blob 不含末尾 LF；审阅副本按原件正文原样复制，SHA-256/字节数记录当前实际字节。清单 SHA-256 对应原始 blob 追加一个 LF；此差异不表示正文损坏。",
  "officialSchoolTemplate": false,
  "researchStatus": "ROUND4_DELIVERED_REVISE",
  "policyEvidenceStatus": "PARTIAL",
  "sourceRecordCount": 10,
  "fieldCount": 32,
  "materialSlotCount": 20,
  "criterionCount": 26,
  "criteria": [
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "R02_RESEARCH_RULES",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-007"
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
    "SRC-010"
  ],
  "researchEvidenceStatus": "PARTIAL"
}