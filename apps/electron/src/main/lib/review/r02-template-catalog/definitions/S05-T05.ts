import type { TemplateVersion } from '@profer/shared'

export type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "S05-T05",
  "version": 1,
  "schemaVersion": 2,
  "name": "学生社团活动立项与组织责任审核",
  "description": "本地研究模板 · 非校方正式模板。学生社团活动立项与组织责任审核；用于材料事实预审、差异提示与人工办理交接，不代替成都理工大学正式制度、授权或决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板是研究交接材料，不是校方正式模板、表单或授权决定；未确认政策必须人工复核，不自动正式通过或拒绝。",
  "objectType": "project",
  "displayName": {
    "template": "{{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · 活动案卷与目标索引",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F001；caseId/activityKey:string；活动案卷与目标索引，含组织/活动/批次/版本对应键",
      "extractionHint": "| `F001` | `caseId/activityKey:string`；活动案卷与目标索引，含组织/活动/批次/版本对应键 | `P0—PX` | Main 创建键；`M005` 计划中活动标识，`SRC-002` 公示项目名称只作历史匹配 | I；无原目标则先建案/找案，复核或变更不可越案 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f002",
      "label": "F002 · 办理路线",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F002；route:enum(general,premium,other,unknown)；办理路线",
      "extractionHint": "| `F002` | `route:enum(general,premium,other,unknown)`；办理路线 | `P0` | `M001` 校方通知与 `M005` 申报目的；`SRC-002、SRC-006` | I；未知转人工路由，不把科创/普通活动混进精品立项 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。",
      "options": [
        {
          "value": "general",
          "label": "general"
        },
        {
          "value": "premium",
          "label": "premium"
        },
        {
          "value": "other",
          "label": "other"
        },
        {
          "value": "unknown",
          "label": "unknown"
        }
      ]
    },
    {
      "key": "f003",
      "label": "F003 · 政策与批次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F003；policyRef/batchId/effectiveWindow:ref；政策与批次",
      "extractionHint": "| `F003` | `policyRef/batchId/effectiveWindow:ref`；政策与批次 | `P0` | `M001` 当前原文、校团委发布记录；`SRC-002、SRC-008` | I；效力未知 `POLICY_UNCONFIRMED`，检索失败 `SOURCE_UNAVAILABLE` |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f004",
      "label": "F004 · 主办和联合社团列表",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F004；societyIds:string[]；主办和联合社团列表",
      "extractionHint": "| `F004` | `societyIds:string[]`；主办和联合社团列表 | `P0/P1` | `M002` 校方社团台账（若可接入）优先于 `M005` 自述；`SRC-001、SRC-002` | I；名称可待查，主办社团不明人工核对，不能以简称强行配对 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f005",
      "label": "F005 · 各社团身份/年审状态",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F005；societyStatus:ref@date；各社团身份/年审状态",
      "extractionHint": "| `F005` | `societyStatus:ref@date`；各社团身份/年审状态 | `P0` | `M002` 归口 `S05-T04` 的权威结论；`SRC-001、SRC-008` 仅证明确有管理事项 | I；台账失联 `SOURCE_UNAVAILABLE`，不凭上传截图强行批准 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f006",
      "label": "F006 · 校区、学段、组织层级",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F006；campus/degreeLevel/societyLevel:enum[]；校区、学段、组织层级",
      "extractionHint": "| `F006` | `campus/degreeLevel/societyLevel:enum[]`；校区、学段、组织层级 | `P0/P1` | `M002/M003/M005` 交叉核对；`SRC-002` 含宜宾分社实例 | S；规则适格性未知则人工确认，不臆设本科/硕博限制 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f007",
      "label": "F007 · 可信申报人身份",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F007；applicantActorId:string；可信申报人身份",
      "extractionHint": "| `F007` | `applicantActorId:string`；可信申报人身份 | `P0/P1/PX` | 可信登录/学校人员台账 `M003`，不采信 Renderer；`SRC-001、SRC-002` | S；无可信身份暂停提交或转窗口核验，不允许代理冒签 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f008",
      "label": "F008 · 授权代表及联合主责",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F008；representativeScope/leadSociety:ref；授权代表及联合主责",
      "extractionHint": "| `F008` | `representativeScope/leadSociety:ref`；授权代表及联合主责 | `P0/P1`、联合时 | `M003/M004` 授权台账、组织确认，`SRC-002` 只支持联合署名存在 | S；未能核授权则人工，不用“会长”文本代授权 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f009",
      "label": "F009 · 业务指导关系",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F009；guidanceUnit/teacherRefs:ref[]；业务指导关系",
      "extractionHint": "| `F009` | `guidanceUnit/teacherRefs:ref[]`；业务指导关系 | `P1`，`P2` 再核 | `M004/M009` 校方管理记录或初审记录；`SRC-002、SRC-003` | S；教师是否必签未知；已知关系不等于审批签章 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f010",
      "label": "F010 · 活动项目",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F010；title/purpose:string；活动项目",
      "extractionHint": "| `F010` | `title/purpose:string`；活动项目 | `P1—P4` | `M005`、后续 `M010` 权威结果；`SRC-002` 项目名称示例 | P（仅公示者）/I；缺主题可问询，不按未知校规自动否决 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f011",
      "label": "F011 · 活动方案版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F011；planId/hash/revision:ref；活动方案版本",
      "extractionHint": "| `F011` | `planId/hash/revision:ref`；活动方案版本 | `P1—PX` | `M005`、Main 版本日志；`SRC-002` 只能证实活动项目存在 | I；缺内容使事实比对 `NEEDS_MATERIAL`，不等于校规强制附件已判定 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f012",
      "label": "F012 · 举办时间场次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F012；startAt/endAt/sessionCount:datetime/int；举办时间场次",
      "extractionHint": "| `F012` | `startAt/endAt/sessionCount:datetime/int`；举办时间场次 | `P1`、实施/变更 | `M005/M006`，实际许可 `M011/M012`；`SRC-004` | I；时段不明则提示核实；历史许可只覆盖原场次 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f013",
      "label": "F013 · 实际地点/校内外",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F013；venues/siteType:ref[]；实际地点/校内外",
      "extractionHint": "| `F013` | `venues/siteType:ref[]`；实际地点/校内外 | `P1/P3/PX` | `M005/M006`、场地决定 `M012`；`SRC-004` | I；未知不能推定“校内默认许可” |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f014",
      "label": "F014 · 规模和类型",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F014；estimatedParticipants/activityFormat:object；规模和类型",
      "extractionHint": "| `F014` | `estimatedParticipants/activityFormat:object`；规模和类型 | `P1/P3` | `M005/M006/M007` 申请预计值；`SRC-004` 仅职责不含阈值 | I；人数未明提示补充事实，**不设**假定大型活动人数线 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f015",
      "label": "F015 · 风险与组织责任",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F015；riskFactors/responsibilityOwners:object[]；风险与组织责任",
      "extractionHint": "| `F015` | `riskFactors/responsibilityOwners:object[]`；风险与组织责任 | `P1/P3` | `M005/M007` 申请内容与经授权单位核验；`SRC-004、SRC-012`（`SRC-009` 已废止，不参与判定） | S/I；高风险裁量人工，责任人身份未证实时保留冲突 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f016",
      "label": "F016 · 外部事项",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F016；externalPeople/publicity/foreign/partners:object；外部事项",
      "extractionHint": "| `F016` | `externalPeople/publicity/foreign/partners:object`；外部事项 | `P1/P3`，条件触发 | `M005/M008` 自述，外部主管权威 `M013`；`SRC-010` 仅检索参考 | S；事项存在但审批必要性未知，应触发人工核政策 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f017",
      "label": "F017 · 计划财务安排",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F017；budgetSources/purposes:object；计划财务安排",
      "extractionHint": "| `F017` | `budgetSources/purposes:object`；计划财务安排 | `P1`，有资金时 | `M008` 自述、独立财务 `M014`；`SRC-005` 报销边界 | S；预算金额不是已批准金额，金额是否必填未知 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f018",
      "label": "F018 · 申报环节",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F018；submittedAt/acceptanceStatus/deadline:ref；申报环节",
      "extractionHint": "| `F018` | `submittedAt/acceptanceStatus/deadline:ref`；申报环节 | `P0—P2` | `M001` 当期通知、Main 可信流水，`SRC-002` 历史程序 | I；缺现行申报日期不自动超期，待主管部门确认 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f019",
      "label": "F019 · 治安/场地需否独立审查",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F019；separateReviewTriggers:enum[]；治安/场地需否独立审查",
      "extractionHint": "| `F019` | `separateReviewTriggers:enum[]`；治安/场地需否独立审查 | `P1/P3/PX` | `M006/M007` 风险事实、校方现行制度 `M001`、`SRC-004` | I；条件真伪无政策依据时 `unknown`，人工判定，不自动批准/免办 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f020",
      "label": "F020 · 本 ID 立项决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F020；projectDecisionRef/status:ref；本 ID 立项决定引用",
      "extractionHint": "| `F020` | `projectDecisionRef/status:ref`；本 ID 立项决定引用 | `P2` 评审后 | `M010` 校团委有权结果，`SRC-002` 历史公示 | I/P（限公示范围）；无决定是未定，不能由模型填“已批准” |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f021",
      "label": "F021 · 安全/场地/宣传许可",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F021；externalPermitRefs:ref[]；安全/场地/宣传许可",
      "extractionHint": "| `F021` | `externalPermitRefs:ref[]`；安全/场地/宣传许可 | `P3` 及变更 | `M011/M012/M013` 各主管机关记录；`SRC-004、SRC-011` | I；源不可访问区别于未申请/未批，范围错配记冲突 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f022",
      "label": "F022 · 实际举办/结项",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F022；executionOrClosureRef:ref；实际举办/结项",
      "extractionHint": "| `F022` | `executionOrClosureRef:ref`；实际举办/结项 | `P4` | `M015` 实施记录及真实结项确认；`SRC-008` 仅栏目标题 | S/I；首报缺失标 `NOT_APPLICABLE`，不是缺件 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f023",
      "label": "F023 · 变更链",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F023；priorVersion/newVersion/diff:object；变更链",
      "extractionHint": "| `F023` | `priorVersion/newVersion/diff:object`；变更链 | `PX` | `M005/M006/M016` 与 Main 版本关系；`SRC-002、SRC-004` 仅边界 | I；缺旧版本应查历史案卷，禁止无轨迹覆盖 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f024",
      "label": "F024 · 补件/撤回/异议",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F024；requestKind/reason/claimantRef:object；补件/撤回/异议",
      "extractionHint": "| `F024` | `requestKind/reason/claimantRef:object`；补件/撤回/异议 | `PX` | `M003/M016`、2024 公示实名异议信息 `SRC-002` | S；请求可保存为待办，不得直接使撤回生效 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f025",
      "label": "F025 · 变更/撤回/复核处理结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F025；resolutionDecisionRef/actorRole:ref；变更/撤回/复核处理结论",
      "extractionHint": "| `F025` | `resolutionDecisionRef/actorRole:ref`；变更/撤回/复核处理结论 | `PX/P4` 处理后 | `M017` 校方受控决定；`SRC-002` 仅存在异议渠道 | S/I；无合法裁决人只记 `NEEDS_HUMAN_DECISION` |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f026",
      "label": "F026 · 证据元数据",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F026；sourceFileId/sourceVersion/issuer/effectiveAt:object；证据元数据",
      "extractionHint": "| `F026` | `sourceFileId/sourceVersion/issuer/effectiveAt:object`；证据元数据 | 任一读取或重审 | 每个 `M001—M022` 的来源、页/段、签发及 Main 溯源日志；`SRC-001—SRC-015`，其中 `SRC-015` 仅线索级 | I/S；无归属/版本不参与生效决定比较，需溯源或重采 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f027",
      "label": "F027 · 社团集体决定与活动方案版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F027；collectiveDecisionRef:ref；社团集体决定与活动方案版本",
      "extractionHint": "| `F027` | `collectiveDecisionRef:ref`；社团集体决定与活动方案版本 | `P3` 开展前，不能首报即必得 | `M018` 社团集体决策的真实记录、授权与范围；`SRC-012` 第 9、21 条 | S/I；没取得有效决策证据则请社团/校团委核，不接受经办人自述即过 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f028",
      "label": "F028 · 对应社团指导教师活动同意",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F028；teacherConsentRef:ref；对应社团指导教师活动同意",
      "extractionHint": "| `F028` | `teacherConsentRef:ref`；对应社团指导教师活动同意 | `P3` 开展前 | `M019` 可信指导教师本人/单位确认；`SRC-012` 第 21 条、`SRC-003` 任职制度线索 | S/I；材料手写署名仅 C 类，缺可信身份转人工确认 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f029",
      "label": "F029 · 业务指导单位活动批准",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F029；guidanceUnitApprovalRef:ref；业务指导单位活动批准",
      "extractionHint": "| `F029` | `guidanceUnitApprovalRef:ref`；业务指导单位活动批准 | `P3` 开展前，与专项推荐分开 | `M020` 有权业务指导单位正式决定；`SRC-012` 第 21、28 条、`SRC-002` 仅专项初审实例 | I；`M009` 推荐不得充当 `M020` 批准；缺校方权威凭证转人工 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f030",
      "label": "F030 · 活动宣传内容的指导教师审核",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F030；publicityReviewRef:ref；活动宣传内容的指导教师审核",
      "extractionHint": "| `F030` | `publicityReviewRef:ref`；活动宣传内容的指导教师审核 | `P3` 宣传发布前，条件触发 | `M021` 受控审核记录；`SRC-012` 第 23 条 | I/S；没有宣传则不适用，具体账号备案另属主管单位 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    },
    {
      "key": "f031",
      "label": "F031 · 校外协议及资金批准",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原研究字段 F031；externalAgreementApprovalRef:ref；校外协议及资金批准",
      "extractionHint": "| `F031` | `externalAgreementApprovalRef:ref`；校外协议及资金批准 | `P3` 签署或接受资金前，条件触发 | `M022` 相应校方主管的同意记录；`SRC-012` 第 22、30 条 | S；拟预算不等于学校允许签约/收款；若角色或合同管辖不明转人工 |。仅作本地研究模板的事实提取提示；字段/阈值/校本适用性不明时不得形成正式结论。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "M001 · 证实适用校规、活动类型与批次期限；校团委/职能部门**政策原文或当期申报表/指南**（B）",
      "purpose": "证实适用校规、活动类型与批次期限；校团委/职能部门**政策原文或当期申报表/指南**（B）；`P0` 校方应提供的政策依据，不能归责学生必上传；可由可信学校链接/原件替代扫描件；`F002/F003/F018/F019/F026`；`SRC-001/002/008/009/010/015`（`009` 已废止、`010` 外校、`015` 商业转载，**均不得作为成都理工当期政策**）；记录发布、生效及废止；原件失联 `SOURCE_UNAVAILABLE`，效力未知 `POLICY_UNCONFIRMED`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实适用校规、活动类型与批次期限",
        "校团委/职能部门**政策原文或当期申报表/指南**（B）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "M002 · 证实社团身份、校区、年审或资格状态；校团委/S05-T04 持有的**社团注册台账或受控状态结论**（A）",
      "purpose": "证实社团身份、校区、年审或资格状态；校团委/S05-T04 持有的**社团注册台账或受控状态结论**（A）；`P0` 来源可得才查询；可信校方书面认证可作为人工替代，不要求学生反复上传；`F004/F005/F006/F026`；`SRC-001/002/008`；每个社团独立来源版本和状态日期；源失联 `SOURCE_UNAVAILABLE`，名称对不上 `CONFLICT`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实社团身份、校区、年审或资格状态",
        "校团委/S05-T04 持有的**社团注册台账或受控状态结论**（A）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "M003 · 证实经办人真实身份及代办授权；学校会话/社团任职管理者持有的认证、授权或组织确认（A；申请人可提交 C 辅助）",
      "purpose": "证实经办人真实身份及代办授权；学校会话/社团任职管理者持有的认证、授权或组织确认（A；申请人可提交 C 辅助）；`P0/P1/PX` 对提交、修改、撤回及复核均需可信核验；受控校方身份验证优先于手签截图；`F006/F007/F008/F024/F026`；`SRC-001/002` 仅间接支持身份/社团背景；绑定角色生效期、代理范围和案卷；缺权限须人工核实，OCR 不可读只针对上传辅助件 `UNREADABLE`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "证实经办人真实身份及代办授权",
        "学校会话/社团任职管理者持有的认证、授权或组织确认（A",
        "申请人可提交 C 辅助）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "M004 · 证实联合主责/业务指导关系；各社团、业务指导单位、校团委持有的**共同举办责任说明**（C）及任职/指导关系确认（A）",
      "purpose": "证实联合主责/业务指导关系；各社团、业务指导单位、校团委持有的**共同举办责任说明**（C）及任职/指导关系确认（A）；`P1` 联合举办或需核指导关系时条件取；校方可信名单可替代申请人自行上传的重复证明，正式会签是否需要未知；`F004/F008/F009/F015/F026`；`SRC-002/003`；每个组织单列签发者、责任范围和版本；矛盾 `CONFLICT`，签章必要性未知 `POLICY_UNCONFIRMED`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实联合主责/业务指导关系",
        "各社团、业务指导单位、校团委持有的**共同举办责任说明**（C）及任职/指导关系确认（A）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "M005 · 证实活动目的、项目名称、内容与责任主张；社团经办人持有的**活动策划/申报文本**（C）",
      "purpose": "证实活动目的、项目名称、内容与责任主张；社团经办人持有的**活动策划/申报文本**（C）；`P1` 事实核验的基础输入；是否有官方制式申报表未知，可先用说明/方案，不能声称完成正式申报；`F001/F002/F004/F010/F011/F015/F023/F026`；`SRC-002` 证明精品活动存在，**不**证明某附件格式；主件版本 `planRev/hash`；缺文本 `NEEDS_MATERIAL`（事实不可核），不可读 `UNREADABLE`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实活动目的、项目名称、内容与责任主张",
        "社团经办人持有的**活动策划/申报文本**（C）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "M006 · 证实拟办时间、场次、场地与估计人数；经办人/场地联络人持有的**日程、场地意向、规模说明**（C）",
      "purpose": "证实拟办时间、场次、场地与估计人数；经办人/场地联络人持有的**日程、场地意向、规模说明**（C）；`P1` 可在 `M005` 中以同等具体内容替代独立附件；正式场地批准只在 `P3` 产生；`F011/F012/F013/F014/F019/F023/F026`；`SRC-004`；逐场次版本关联；缺地点/时间视事实待补，不得说“场地许可缺失”（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实拟办时间、场次、场地与估计人数",
        "经办人/场地联络人持有的**日程、场地意向、规模说明**（C）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "M007 · 证实组织分工、风险识别和应对计划；活动组织者持有的**责任安排/风险说明或预案**（C）",
      "purpose": "证实组织分工、风险识别和应对计划；活动组织者持有的**责任安排/风险说明或预案**（C）；`P1/P3` 风险因素识别时条件采集；是否必须特定预案/签字由保卫部现行规定核定，不能套外校人数线；`F014/F015/F019/F026`；`SRC-004/009/010`（后两条仅研究）；版本绑定举办范围；缺事实可提示补充，不可读 `UNREADABLE`，硬性门槛未知 `POLICY_UNCONFIRMED`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实组织分工、风险识别和应对计划",
        "活动组织者持有的**责任安排/风险说明或预案**（C）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "M008 · 证实外部嘉宾、宣传、校外合作、赞助与拟经费来源；经办人持有的**外部安排及预算说明**（C）",
      "purpose": "证实外部嘉宾、宣传、校外合作、赞助与拟经费来源；经办人持有的**外部安排及预算说明**（C）；`P1` 因 `F016/F017` 条件触发；不存在该因素则 `NOT_APPLICABLE`；独立宣传/经费批准不应混同；`F016/F017/F026`；`SRC-005/010`（外校只作线索）；资金/合作方信息敏感、须版本归属；事实缺失可问询，审批是否必要未知（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实外部嘉宾、宣传、校外合作、赞助与拟经费来源",
        "经办人持有的**外部安排及预算说明**（C）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "M009 · 证实精品项目业务指导单位初审/推荐；该单位持有**受控推荐流水或意见书**（A）",
      "purpose": "证实精品项目业务指导单位初审/推荐；该单位持有**受控推荐流水或意见书**（A）；`P2` 单位实际处理后才产生，**首报不得要求**；能够向单位查询则直接引用，不要求学生上传签章照；`F009/F018/F026`；`SRC-002` 2024 流程；记录推荐人、单位、时间、活动/方案版本；尚未形成 `NOT_APPLICABLE` 于首报，逾阶段仍不可取 `SOURCE_UNAVAILABLE` 或人工待办（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实精品项目业务指导单位初审/推荐",
        "该单位持有**受控推荐流水或意见书**（A）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "M010 · 证实“青春之彩”适用批次专项评审及正式立项/公示结果；校团委持有**有权结果记录、官网原始公示**（A）",
      "purpose": "证实“青春之彩”适用批次专项评审及正式立项/公示结果；校团委持有**有权结果记录、官网原始公示**（A）；`P2` 评审后才产生；公示可替代来源不明的截图，且仅匹配同批次同项目；没有得到公示不等于自动驳回；`F010/F018/F020/F026`；`SRC-002/008`；签发机关/批次/公示版本/撤销变更应同时核，失联 `SOURCE_UNAVAILABLE`，结论需有权机关解释（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实“青春之彩”适用批次专项评审及正式立项/公示结果",
        "校团委持有**有权结果记录、官网原始公示**（A）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "M011 · 证实具体活动/场次治安安全审批；校保卫部或法定主管持有**治安/安全决定**（A）",
      "purpose": "证实具体活动/场次治安安全审批；校保卫部或法定主管持有**治安/安全决定**（A）；`P3` 经现行校本规则判断确需时才引用，**不是首报必需**；可通过有权部门查验记录替代材料上传；`F012/F014/F015/F019/F021/F026`；`SRC-004/011`（G50 只候选）；比较许可对象、时间、场次、有效/撤销状态；缺触发政策则人工，不可用立项 `M010` 代替（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实具体活动/场次治安安全审批",
        "校保卫部或法定主管持有**治安/安全决定**（A）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "M012 · 证实具体时间/场地使用权；场地管理单位或保卫部持有**场地许可/预约最终确认**（A）",
      "purpose": "证实具体时间/场地使用权；场地管理单位或保卫部持有**场地许可/预约最终确认**（A）；`P3` 场地实际需批时引用，首报可只有 `M006` 意向；可信受控场馆记录可替代扫描件，意向单不可替代最终许可；`F012/F013/F019/F021/F026`；`SRC-004`；逐场馆/时间段/状态匹配；改场地后旧许可保留历史但不作新范围通过（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实具体时间/场地使用权",
        "场地管理单位或保卫部持有**场地许可/预约最终确认**（A）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "M013 · 证实外部宣传、校外来宾、涉外事项等专项决定；相应**有权职能部门**持有的正式批准（A）",
      "purpose": "证实外部宣传、校外来宾、涉外事项等专项决定；相应**有权职能部门**持有的正式批准（A）；`P3` 仅被校规确认触发时引用；校本审批种类与有权单位未知，未触发则 `NOT_APPLICABLE`；`F016/F021/F026`；`SRC-001/010`（无现行成理细则）；许可类型、对象、颁发者均要单独核，缺政策 `POLICY_UNCONFIRMED`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实外部宣传、校外来宾、涉外事项等专项决定",
        "相应**有权职能部门**持有的正式批准（A）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "M014 · 证实活动经费项目资助、预算或事前支出授权；校团委财务/经费权利人持有**财务决定引用**（A）",
      "purpose": "证实活动经费项目资助、预算或事前支出授权；校团委财务/经费权利人持有**财务决定引用**（A）；`P3/P4` 有独立资金审批时查询，不拿费用预算 `M008` 冒充批准；**`SRC-014` 是报销流程原文，不是本活动可支付的批准**；实际费用行报销仍链接 G07/财务权威记录；`F017/F021/F026`；`SRC-005/011/014`；按资金项目/预算版本/付款目的归属；未知则转财务，不由本案批准（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "证实活动经费项目资助、预算或事前支出授权",
        "校团委财务/经费权利人持有**财务决定引用**（A）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "M015 · 证实活动实施/专项结项事实；主办方持有的**总结、签到、影像**（C），校团委持有的**结项记录**（A）",
      "purpose": "证实活动实施/专项结项事实；主办方持有的**总结、签到、影像**（C），校团委持有的**结项记录**（A）；`P4` 举办后才可能生成，**任何 P1 首报均不得要求**；第二课堂学分/志愿工时或发票、报销结果仅引用邻接业务；`F010/F012/F022/F026`；`SRC-008` 目前仅索引，不能据此立结项附件硬条件；注意参与人隐私、限定用途；结项政策未知 `POLICY_UNCONFIRMED`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "证实活动实施/专项结项事实",
        "主办方持有的**总结、签到、影像**（C），校团委持有的**结项记录**（A）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "M016 · 证实补件、改期、变更、撤回、异议请求；申请人/申诉人提交的**有身份认证的请求记录**（C+可信交易）",
      "purpose": "证实补件、改期、变更、撤回、异议请求；申请人/申诉人提交的**有身份认证的请求记录**（C+可信交易）；`PX` 请求时发生；可用受控在线提交替代上传申请书，受理制度未知；始终绑定原案原材料和目标版本；`F001/F007/F023/F024/F026`；`SRC-002` 仅支持某批次实名异议渠道；保留原/新内容 hash；无法确认请求人→身份待核，不把请求当生效决定（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "证实补件、改期、变更、撤回、异议请求",
        "申请人/申诉人提交的**有身份认证的请求记录**（C+可信交易）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "M017 · 证实人工作出的更正、撤回生效、异议/复核处理等**最终处置**；原有权单位持有的受控决定记录（A）",
      "purpose": "证实人工作出的更正、撤回生效、异议/复核处理等**最终处置**；原有权单位持有的受控决定记录（A）；`PX/P4` 实际审查后才产生，不能首报强制上传、不能由用户自行创建；可信单位事务流水优先于回执照片；`F020/F023/F024/F025/F026`；`SRC-002` 仅有异议渠道不证明复核步骤；核签发角色/生效时间/覆盖决定版本；缺权威状态 `NEEDS_HUMAN_DECISION`（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
      "maxCount": 1000,
      "requiredElements": [
        "证实人工作出的更正、撤回生效、异议/复核处理等**最终处置**",
        "原有权单位持有的受控决定记录（A）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "M018 · 证实社团**集体研究决定举办该活动并授权代表**；社团组织持有决策记录/受控会议决议（C，经校方证实为 A）",
      "purpose": "证实社团**集体研究决定举办该活动并授权代表**；社团组织持有决策记录/受控会议决议（C，经校方证实为 A）；`P3` 开展前必须有合法的集体决策事实（`SRC-012`），但 `P1` 首次草稿时尚可未形成；可信社团会议管理台账或校团委确认可替代手签文本；`F004/F008/F010/F011/F027/F026`；`SRC-012` 第 9、21 条；绑定社团、案卷、方案版本、表决/授权身份；证据未形成→办理待办，无法读取→`UNREADABLE`，争议→人工（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实社团**集体研究决定举办该活动并授权代表**",
        "社团组织持有决策记录/受控会议决议（C，经校方证实为 A）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "M019 · 证实**社团指导教师对该活动/方案的同意**；真实在任指导教师及管理单位持有受控同意记录（A）",
      "purpose": "证实**社团指导教师对该活动/方案的同意**；真实在任指导教师及管理单位持有受控同意记录（A）；`P3` 开展前须具备；可能在 `P1/P2` 提早形成但不是申请入门的未来签章必交；可靠登录记录/岗位验签替代签名图片；`F009/F010/F011/F028/F026`；`SRC-012` 第 21 条、`SRC-003`；核教师任职与生效区间、方案版本；冒名 `CONFLICT`，无可信核验人工（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实**社团指导教师对该活动/方案的同意**",
        "真实在任指导教师及管理单位持有受控同意记录（A）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "M020 · 证实**业务指导单位批准开展社团活动**；业务指导单位有权岗位持有正式批准/业务事务流水（A）",
      "purpose": "证实**业务指导单位批准开展社团活动**；业务指导单位有权岗位持有正式批准/业务事务流水（A）；`P3` 开展前按上位规范须具备；与精品项目初审推荐 `M009` 不同。由学校实际流程确定审批节点及合法替代记录；`F009/F010/F011/F029/F026`；`SRC-012` 第 21、28 条、`SRC-002` 仅为专项流程；需核签发单位、岗位、覆盖的方案/场次；缺校本校验渠道保留人工，不能用 `M010` 公示替代（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实**业务指导单位批准开展社团活动**",
        "业务指导单位有权岗位持有正式批准/业务事务流水（A）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "M021 · 证实**活动信息/宣传文案由指导教师审核同意**；指导教师/校方宣传平台持有受控审核记录（A）",
      "purpose": "证实**活动信息/宣传文案由指导教师审核同意**；指导教师/校方宣传平台持有受控审核记录（A）；`P3` 活动宣传发布前条件取得；无宣传才为 `NOT_APPLICABLE`；建立网站/媒体账号的另行审核备案不由本活动直接决定；`F016/F030/F026`；`SRC-012` 第 23 条；绑定具体宣传稿版本、平台、教师身份；只看正文自述“老师审核过”不足以通过（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实**活动信息/宣传文案由指导教师审核同意**",
        "指导教师/校方宣传平台持有受控审核记录（A）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "M022 · 证实**学校允许与校外单位/个人签约或接受资助**；校方有权对外合作/经费主管持有审批记录（A）",
      "purpose": "证实**学校允许与校外单位/个人签约或接受资助**；校方有权对外合作/经费主管持有审批记录（A）；`P3` 校外签约或收款前条件取得；计划联系尚未签署不当作已签约，合法替代为经有权机关可验真的许可记录；`F016/F017/F031/F026`；`SRC-012` 第 22、30 条；按合同方、金额/项目、用途、批准范围版本核；承诺书/草预算不可替代正式同意，签发者未知→人工（材料槽数量上限为本地技术容器设置，不代表校方必交或数量门槛）",
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
        "证实**学校允许与校外单位/个人签约或接受资助**",
        "校方有权对外合作/经费主管持有审批记录（A）"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "route-and-subject",
      "name": "适用范围与主体路由",
      "description": "批次、社团状态、经办身份、适用校规与方案对象。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "R001 · T：F002/F003 指向社团活动或当期精品项目，核 M001 发文机关、活动类型、批次、施行时点；F：可信来源证实非社团活动，路由他模板；U：只见过期通知。SRC-002/006/012；F002/F003/F018/F026；M001/M005",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R001` `P0` 事项路由与当期政策 | T：`F002/F003` 指向社团活动或当期精品项目，核 `M001` 发文机关、活动类型、批次、施行时点；F：可信来源证实非社团活动，路由他模板；U：只见过期通知。`SRC-002/006/012`；`F002/F003/F018/F026`；`M001/M005` | 历史 `SRC-002` 仅 2024—25，科技 `SRC-006` 不可代用；B＞C。对应事实有据 `PASS_FACT`，F `NOT_APPLICABLE`，U `POLICY_UNCONFIRMED`，链接失联 `SOURCE_UNAVAILABLE`；下一：校团委批次归口/人工路由 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "R002 · T：申请社团列于 F004；核 S05-T04 或管理台账 M002 的身份/有效期；F：明确非学生社团则不适用本模板；U：台账不可查。SRC-001/012 第 6/9 条；F004/F005/F006/F026；M002/M005",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R002` `P0` 社团真实存在与状态 | T：申请社团列于 `F004`；核 S05-T04 或管理台账 `M002` 的身份/有效期；F：明确非学生社团则不适用本模板；U：台账不可查。`SRC-001/012` 第 6/9 条；`F004/F005/F006/F026`；`M002/M005` | 按活动拟办日及查询日期双时点核，A＞C；同名不同组织 `CONFLICT`，A 失联 `SOURCE_UNAVAILABLE`，已确认有效 `PASS_FACT`，身份真实但批准性质有争议 `NEEDS_HUMAN_DECISION`；下一：校团委/S05-T04 权威 Owner |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "R003 · T：有人提交/更正/撤回，按可信登录 M003、集体授权 M018 比 F007/F008 的组织和权限；F：纯只读历史查询不涉及经办动作；U：代理链不明。SRC-012 第 9 条、SRC-001；F007/F008/F024/F026；M003/M018",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R003` `P0/PX` 真实经办人与代理权 | T：有人提交/更正/撤回，按可信登录 `M003`、集体授权 `M018` 比 `F007/F008` 的组织和权限；F：纯只读历史查询不涉及经办动作；U：代理链不明。`SRC-012` 第 9 条、`SRC-001`；`F007/F008/F024/F026`；`M003/M018` | 检任职起止、代理范围、目标版本；A＞C，OCR 签名不可靠；属实 `PASS_FACT`、不适用 `NOT_APPLICABLE`、同名错人 `CONFLICT`、授权待核 `NEEDS_HUMAN_DECISION`；下一：学校身份 Owner/社团管理岗 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "R004 · T：有当期资格分支，核 F006 与组织/人员 M002/M003；F：当期制度未区分不另设门槛；U：分校区/院级权限无文件。SRC-002/012；F003/F004/F006/F026；M001/M002/M003",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R004` `P0` 校区学段归属与适格性 | T：有当期资格分支，核 `F006` 与组织/人员 `M002/M003`；F：当期制度未区分不另设门槛；U：分校区/院级权限无文件。`SRC-002/012`；`F003/F004/F006/F026`；`M001/M002/M003` | 2024 宜宾分社实例不得变成所有年度规则；B 校本现行与 A 身份双核，已证分支事实 `PASS_FACT`，无分支 `NOT_APPLICABLE`，规则未知 `POLICY_UNCONFIRMED`；下一：校团委校区受理负责人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "R005 · T：已有活动主题和可信组织宗旨，比较 M005 与 M002 章程/业务类型；F：此非社团活动；U：章程或目的不可读。SRC-001/012 第 22 条；F004/F010/F015/F026；M002/M005",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R005` `P1` 目的与社团宗旨对应 | T：已有活动主题和可信组织宗旨，比较 `M005` 与 `M002` 章程/业务类型；F：此非社团活动；U：章程或目的不可读。`SRC-001/012` 第 22 条；`F004/F010/F015/F026`；`M002/M005` | 同活动现行章程、方案版本；A/B＞C；明显反向陈述 `CONFLICT`，价值/意识形态行政裁量不能模型裁决 `NEEDS_HUMAN_DECISION`，仅可核“文字是否相符” `PASS_FACT`；下一：指导教师/业务指导单位 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "R006 · T：提交 M005，核 F001/F010/F011 及目标社团、方案 hash，指向明确；F：尚在空白草稿无可比较对象；U：缺文本。SRC-002/012；F001/F004/F010/F011/F026；M005/M006",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R006` `P1` 活动标识与方案完整可比性 | T：提交 `M005`，核 `F001/F010/F011` 及目标社团、方案 hash，指向明确；F：尚在空白草稿无可比较对象；U：缺文本。`SRC-002/012`；`F001/F004/F010/F011/F026`；`M005/M006` | 本次冻结的 `sourceVersion`，C 不升级 A；可读且字段可核 `PASS_FACT`，材料未给 `NEEDS_MATERIAL`，损坏 `UNREADABLE`，两个有效主件互相矛盾 `CONFLICT`；下一：申请经办人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "R007 · T：M005/M006 含场次、地点/人数，逐场次比 F012—F014；F：未进入活动方案环节；U：字段不明。SRC-004/012；F011/F012/F013/F014/F026；M005/M006",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R007` `P1/P3` 时间地点规模一致 | T：`M005/M006` 含场次、地点/人数，逐场次比 `F012—F014`；F：未进入活动方案环节；U：字段不明。`SRC-004/012`；`F011/F012/F013/F014/F026`；`M005/M006` | 仅对同 `planRev` 比，不设大型活动人数阈值；一致 `PASS_FACT`，缺基础数据 `NEEDS_MATERIAL`，主从方案互斥 `CONFLICT`，文件无法解析 `UNREADABLE`；下一：申请经办人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "pre-activity-responsibility",
      "name": "活动开展前责任",
      "description": "集体决策、指导教师同意、业务指导单位批准及责任事实。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r008",
          "title": "R008 · T：进入拟实际举办阶段，按 M018 查集体决定与 F027、方案 F011、申请代表 F008 的对应；F：尚在 P1；U：决议形成/有效性不清。SRC-012 第 9、21 条；F008/F011/F027/F026；M003/M005/M018",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R008` `P3` 社团集体决策事实 | T：进入拟实际举办阶段，按 `M018` 查集体决定与 `F027`、方案 `F011`、申请代表 `F008` 的对应；F：尚在 `P1`；U：决议形成/有效性不清。`SRC-012` 第 9、21 条；`F008/F011/F027/F026`；`M003/M005/M018` | 同社团、同活动、方案版本、会议信任层级；A/经校方验真的 C＞自述；核实存在 `PASS_FACT`，P1 `NOT_APPLICABLE`，未得到应有事实 `NEEDS_MATERIAL` 或 `NEEDS_HUMAN_DECISION`（需核有效决议），冒名 `CONFLICT`；下一：社团集体/校团委管理岗 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "R009 · T：拟举办且指导教师归属已核，比较教师本人受控 M019 与 F009/F028、方案版；F：首报未到同意节点；U：任职/同意未证。SRC-012 第 21 条、SRC-003；F009/F011/F028/F026；M004/M019",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R009` `P3` 指导教师对活动同意 | T：拟举办且指导教师归属已核，比较教师本人受控 `M019` 与 `F009/F028`、方案版；F：首报未到同意节点；U：任职/同意未证。`SRC-012` 第 21 条、`SRC-003`；`F009/F011/F028/F026`；`M004/M019` | 看任职和同意时间是否覆盖活动实施及版本；A＞签名图；真 `PASS_FACT`，未形成 `NEEDS_MATERIAL`，校方身份渠道失联 `SOURCE_UNAVAILABLE`，冒名 `CONFLICT`；下一：指导教师本人/主管单位 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "R010 · T：拟举办，按权威 M020 比 F009/F029 与具体活动、版本；F：仍处草拟；U：审批岗位或决定不可确认。SRC-012 第 21、28 条、SRC-002；F009/F011/F029/F026；M009/M020",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R010` `P3` 业务指导单位批准 | T：拟举办，按权威 `M020` 比 `F009/F029` 与具体活动、版本；F：仍处草拟；U：审批岗位或决定不可确认。`SRC-012` 第 21、28 条、`SRC-002`；`F009/F011/F029/F026`；`M009/M020` | 上位批准要求 ≠ `M009` 精品项目**推荐**；A＞C；批准事实有证 `PASS_FACT`，只拿推荐 `NEEDS_HUMAN_DECISION`，审批来源失联 `SOURCE_UNAVAILABLE`，流程权限未知 `POLICY_UNCONFIRMED`；下一：真实业务指导单位有权岗 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "R011 · T：F004 多社团或跨校区，逐一匹配 M002/M004/M018 的代表、责任分工；F：经证实单社团；U：只有联合字样但名单不明。SRC-002/012；F004/F008/F009/F015/F026；M002/M003/M004/M018",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R011` `P1/P3` 联合举办主责 | T：`F004` 多社团或跨校区，逐一匹配 `M002/M004/M018` 的代表、责任分工；F：经证实单社团；U：只有联合字样但名单不明。`SRC-002/012`；`F004/F008/F009/F015/F026`；`M002/M003/M004/M018` | 2024 联合署名仅事实例；A/经验证 C；主责可核 `PASS_FACT`，F `NOT_APPLICABLE`，缺事实 `NEEDS_MATERIAL`，多方冲突 `CONFLICT`，会签顺序未知 `POLICY_UNCONFIRMED`；下一：各社团/业务指导单位 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "R012 · T：存在规模/演出/实验/公共场地特征，检查 M006/M007 的负责人与风险叙述、F014/F015/F019；F：相关因素已可信排除；U：规模性质未知。SRC-004/012；F014/F015/F019/F026；M005/M006/M007",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R012` `P1/P3` 风险与责任事实 | T：存在规模/演出/实验/公共场地特征，检查 `M006/M007` 的负责人与风险叙述、`F014/F015/F019`；F：相关因素已可信排除；U：规模性质未知。`SRC-004/012`；`F014/F015/F019/F026`；`M005/M006/M007` | `SRC-004` 只证明部门职责，不给人数线；可核组织责任 `PASS_FACT`，事实缺失 `NEEDS_MATERIAL`，高风险与分类 `NEEDS_HUMAN_DECISION`，校本阈值 `POLICY_UNCONFIRMED`；下一：保卫部/业务指导单位 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "R013 · T：F013/F016 显示校外/嘉宾/涉外事项，核 M005/M008 的地点、身份和行为性质；F：有明确证据无此因素；U：标题不足判断。SRC-012/013；F013/F016/F026；M005/M006/M008",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R013` `P1` 外来人员、校外活动识别 | T：`F013/F016` 显示校外/嘉宾/涉外事项，核 `M005/M008` 的地点、身份和行为性质；F：有明确证据无此因素；U：标题不足判断。`SRC-012/013`；`F013/F016/F026`；`M005/M006/M008` | 先记录客观触发，**不推导所有来宾都必须同一审批**；C 事实 `PASS_FACT`，F `NOT_APPLICABLE`，不足 `NEEDS_MATERIAL`，需要哪个机关许可 `POLICY_UNCONFIRMED`；下一：业务指导单位/对应职能部门 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "R014 · T：线上/线下宣传或活动信息发布，验证 M021 与 F016/F030 文案 hash、教师身份；F：无宣传；U：未交实际发布内容。SRC-012 第 23 条；F009/F016/F030/F026；M008/M021",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R014` `P3` 宣传文案指导教师审阅 | T：线上/线下宣传或活动信息发布，验证 `M021` 与 `F016/F030` 文案 hash、教师身份；F：无宣传；U：未交实际发布内容。`SRC-012` 第 23 条；`F009/F016/F030/F026`；`M008/M021` | 宣传**发布前**审核；A＞自述签字；审核可验 `PASS_FACT`，无宣传 `NOT_APPLICABLE`，文案缺失 `NEEDS_MATERIAL`，教师不明 `NEEDS_HUMAN_DECISION`；下一：指导教师/宣传平台负责人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "R015 · T：存在拟签协议/收外部资助，比 M022 学校有权同意与 F016/F017/F031 对象、用途；F：无校外签约及外部资助；U：只有合作意向。SRC-012 第 22、30 条；F016/F017/F031/F026；M008/M022",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R015` `P3` 校外签约或接受资助许可 | T：存在拟签协议/收外部资助，比 `M022` 学校有权同意与 `F016/F017/F031` 对象、用途；F：无校外签约及外部资助；U：只有合作意向。`SRC-012` 第 22、30 条；`F016/F017/F031/F026`；`M008/M022` | 必须在签约/收款前有符合上位规范的批准；A＞C，拟赞助不等于已批准；有效 `PASS_FACT`，未发生 `NOT_APPLICABLE`，源失联 `SOURCE_UNAVAILABLE`，具体校本岗位未知 `NEEDS_HUMAN_DECISION`；下一：校方有权对外/经费单位 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "independent-permits",
      "name": "独立许可与专项结果引用",
      "description": "精品项目、治安/场地、讲座、宣传、合同及财务授权引用。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r016",
          "title": "R016 · T：有活动预算/支出，比较 M008 计划与 M014 若已形成的用途/项目；F：明确无财务事项；U：是否需事前授权未知。SRC-005/012 第 30 条、SRC-011/014；F017/F021/F026；M008/M014",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R016` `P1/P3` 预算叙述与财务决定边界 | T：有活动预算/支出，比较 `M008` 计划与 `M014` 若已形成的用途/项目；F：明确无财务事项；U：是否需事前授权未知。`SRC-005/012` 第 30 条、`SRC-011/014`；`F017/F021/F026`；`M008/M014` | 预算是 C 计划；`SRC-014` 2025 年校财务 PDF 第 9 页的学生活动费票据/网报/审签仅是**后续报销**；计划一致 `PASS_FACT`（只限文字），无资金 `NOT_APPLICABLE`，拨付与报销须 G07/财务有权决定 `NEEDS_HUMAN_DECISION`，不得用 PDF 票据门槛拒绝社团立项；下一：财务/采购及 G07 Owner |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "R017 · T：R001 确认当期精品批次、进入初审后，查业务指导单位 M009 与 F009/F018；F：一般活动没有专项推荐；U：是否已初审未知。SRC-002；F003/F009/F018/F026；M001/M009",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R017` `P2` 精品项目初审推荐事实 | T：`R001` 确认当期精品批次、进入初审后，查业务指导单位 `M009` 与 `F009/F018`；F：一般活动没有专项推荐；U：是否已初审未知。`SRC-002`；`F003/F009/F018/F026`；`M001/M009` | 仅该批次流程，A 原始推荐＞签字图；有 `PASS_FACT`，非专项 `NOT_APPLICABLE`，待部门确认 `NEEDS_HUMAN_DECISION`，原件不可得 `SOURCE_UNAVAILABLE`；下一：专项业务指导单位 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "R018 · T：有当期专项结果，核 M010 的发布机关、批次、社团、名称、等级与 F003/F020；F：非专项；U：只见 2024 结果拟用于新活动。SRC-002/008；F003/F004/F010/F018/F020/F026；M001/M005/M010",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R018` `P2` 校团委精品项目结果一致 | T：有当期专项结果，核 `M010` 的发布机关、批次、社团、名称、等级与 `F003/F020`；F：非专项；U：只见 2024 结果拟用于新活动。`SRC-002/008`；`F003/F004/F010/F018/F020/F026`；`M001/M005/M010` | 公示期与项目范围必须同年度；A 官方原件＞截图；准确匹配 `PASS_FACT`（仅“该批次曾立项”），旧批次错用 `CONFLICT`，当前无原文 `SOURCE_UNAVAILABLE`，终局是否公示即生效人决；下一：校团委专项有权岗 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "R019 · T：校本有权部门确认该场次须办治安/安全，核 M011 与 F012/F014/F021 对象时段/撤销状态；F：有权明确不要求；U：人数门槛/权限未取。SRC-004/011/012；F012/F014/F019/F021/F026；M001/M006/M007/M011",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R019` `P3` 独立治安/安全许可引用 | T：校本有权部门确认该场次须办治安/安全，核 `M011` 与 `F012/F014/F021` 对象时段/撤销状态；F：有权明确不要求；U：人数门槛/权限未取。`SRC-004/011/012`；`F012/F014/F019/F021/F026`；`M001/M006/M007/M011` | A 保卫决定，`SRC-011` 技术候选非政策；许可匹配 `PASS_FACT`（仅“许可存在且覆盖”），F `NOT_APPLICABLE`，U `POLICY_UNCONFIRMED`，已撤销/范围错配 `CONFLICT`；下一：保卫部治安科/法定有权部门 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "R020 · T：场地有权部门确认须批准，比较 M012 场馆、场次、有效期与 F012/F013；F：校本制度明确无此审批；U：特殊场馆归口未知。SRC-004/012；F012/F013/F019/F021/F026；M001/M006/M012",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R020` `P3` 场地时间段许可引用 | T：场地有权部门确认须批准，比较 `M012` 场馆、场次、有效期与 `F012/F013`；F：校本制度明确无此审批；U：特殊场馆归口未知。`SRC-004/012`；`F012/F013/F019/F021/F026`；`M001/M006/M012` | A 场地正式确认＞申请意向；仅同地同场次 `PASS_FACT`，无义务 `NOT_APPLICABLE`，未知 `POLICY_UNCONFIRMED`，旧许可不覆盖新时间 `CONFLICT`；下一：保卫/场地主管单位 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "R021 · T：M008 明确学生团体邀请校外组织/人员到校**举办讲座等第 44 条覆盖活动**，比学校权威 M013 与 F016/F021；F：客观不属于该特定类型；U：活动性质/授权不明。SRC-013 **第 44 条第三款**、SRC-012；F013/F016/F021/F026；M008/M013",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R021` `P3` 校外来宾入校讲座批准引用 | T：`M008` 明确学生团体邀请校外组织/人员到校**举办讲座等第 44 条覆盖活动**，比学校权威 `M013` 与 `F016/F021`；F：客观不属于该特定类型；U：活动性质/授权不明。`SRC-013` **第 44 条第三款**、`SRC-012`；`F013/F016/F021/F026`；`M008/M013` | 该类活动依法需要学校批准，但由成都理工哪个岗位签发仍须核定；B 上位+ A 校内许可；同案有效证据 `PASS_FACT` 仅说明许可引用覆盖，F `NOT_APPLICABLE`，U `POLICY_UNCONFIRMED`，未得权威许可 `NEEDS_HUMAN_DECISION`；下一：业务指导单位/校内讲座主管，不把所有外宾或一般访客都当作讲座 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "change-and-follow-up",
      "name": "变更、结项与复核",
      "description": "方案换版、撤回、异议、活动结项及证据链完整性。",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "r022",
          "title": "R022 · T：M016 变更请求、F023 比出责任人/方案/时间地点/经费变化；F：相同 hash 且可信确认无语义变化；U：旧版缺失。SRC-002/004/012；F011/F012/F013/F015/F023/F026；M005/M006/M016",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R022` `PX` 变更与版本影响集合 | T：`M016` 变更请求、`F023` 比出责任人/方案/时间地点/经费变化；F：相同 hash 且可信确认无语义变化；U：旧版缺失。`SRC-002/004/012`；`F011/F012/F013/F015/F023/F026`；`M005/M006/M016` | 旧版 `runId` 不冒充新版，按 09.3 映射重审；差异有效识别 `PASS_FACT`，无变更 `NOT_APPLICABLE`，主从版互斥 `CONFLICT`，校本需否重批 `NEEDS_HUMAN_DECISION`；下一：申请人及各原决定机关 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "R023 · T：M016 提出此请求，核 M003 可信身份、原决定和目标范围；F：无请求；U：原案号/代理链不明。SRC-002/012；F001/F007/F023/F024/F026；M003/M010/M016",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R023` `PX` 撤回/异议/复核请求真实性 | T：`M016` 提出此请求，核 `M003` 可信身份、原决定和目标范围；F：无请求；U：原案号/代理链不明。`SRC-002/012`；`F001/F007/F023/F024/F026`；`M003/M010/M016` | 仅 2024 公示有实名异议实例；对新学年的受理期限不沿用；已认证请求 `PASS_FACT`（只限请求收到），F `NOT_APPLICABLE`，假身份 `CONFLICT`，程序未知 `POLICY_UNCONFIRMED`；下一：校团委原办理/复核机构 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "R024 · T：有权部门 M017 已形成，核 F025 的 actor、岗位、原 F020 及生效/撤销时间；F：仅请求尚待答复；U：只有回复截图或前端 actor。SRC-002/012；F020/F024/F025/F026；M010/M016/M017",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R024` `PX` 受控更正/撤回/复核正式决定 | T：有权部门 `M017` 已形成，核 `F025` 的 actor、岗位、原 `F020` 及生效/撤销时间；F：仅请求尚待答复；U：只有回复截图或前端 `actor`。`SRC-002/012`；`F020/F024/F025/F026`；`M010/M016/M017` | A 受控决定不得由 C 替代；可信同案有权结论 `PASS_FACT`（只确认记录），未形成 `NOT_APPLICABLE`（该记录尚不存在）并待办，冒签 `CONFLICT`，实质处分 `NEEDS_HUMAN_DECISION`；下一：原决定 Owner/法定复核人员 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "R025 · T：活动已举办且进入已核实的结项流程，核 M015 的时间活动主办与上游 F020/F022；F：尚未举办；U：只有 2026 结项栏目标题。SRC-008/012；F010/F012/F020/F022/F026；M010/M015",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R025` `P4` 举办/结项事实 | T：活动已举办且进入已核实的结项流程，核 `M015` 的时间活动主办与上游 `F020/F022`；F：尚未举办；U：只有 2026 结项栏目标题。`SRC-008/012`；`F010/F012/F020/F022/F026`；`M010/M015` | 首报绝不要求总结照片；C 举办事实不代替 A 结项决定；事实可读 `PASS_FACT`，早期 `NOT_APPLICABLE`，现行结项规则未知 `POLICY_UNCONFIRMED`，原件失联 `SOURCE_UNAVAILABLE`；下一：校团委项目结项 Owner |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "R026 · T：本次引用任一 M/权威决定，校验 F026 的目标、hash、页码、颁发者、取证时间、sourceVersion；F：本轮不引用该槽；U：截屏无来源。SRC-002/011/012；F001/F011/F026；M001/M002/M005/M010/M017",
          "requirement": "原件规则行（研究预审，不是学校正式政策）：| `R026` `P0—PX` 证据归属、可读性与权威链 | T：本次引用任一 `M`/权威决定，校验 `F026` 的目标、hash、页码、颁发者、取证时间、`sourceVersion`；F：本轮不引用该槽；U：截屏无来源。`SRC-002/011/012`；`F001/F011/F026`；`M001/M002/M005/M010/M017` | 全阶段、全材料通用独立完整性事实；真实可追溯 `PASS_FACT`，非目标 `NOT_APPLICABLE`，无法解析 `UNREADABLE`，校方源失联 `SOURCE_UNAVAILABLE`，版本冲突 `CONFLICT`；下一：材料所有者/可信 Main 案卷负责人 |。SRC 是研究来源索引，不是案卷 SourceRef；事实齐备也不得替代校方正式决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "p0",
      "name": "P0 · 适用政策与路由",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p1"
    },
    {
      "id": "p1",
      "name": "P1 · 草拟/首次提交",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p2"
    },
    {
      "id": "p2",
      "name": "P2 · 单位推荐/专项评审",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p3"
    },
    {
      "id": "p3",
      "name": "P3 · 活动实施前",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p4"
    },
    {
      "id": "p4",
      "name": "P4 · 举办后/结项与费用",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "nextStageId": "px"
    },
    {
      "id": "px",
      "name": "PX · 变更/撤回/复核",
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
  "templateId": "S05-T05",
  "name": "学生社团活动立项与组织责任审核",
  "sourceDocPath": "docs/design/review-agent/business-templates/R02/S05-T05.md",
  "sourceDocSha256": "c286e4968de3e633916a471e8b8d987e575b23b90eb3f62e7e2fbc3e55ad6430",
  "originalResearchPath": "docs/design/review-agent/business-templates/R02/research-original/S05-T05.md",
  "originalResearchSha256": "c286e4968de3e633916a471e8b8d987e575b23b90eb3f62e7e2fbc3e55ad6430",
  "officialSchoolTemplate": false,
  "researchStatus": "PARTIALLY_VERIFIED; OFFICIAL_POLICY_UNVERIFIED_FOR_GENERAL_ACTIVITY_AND_CURRENT_BATCH",
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
    "F031"
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
    "M020",
    "M021",
    "M022"
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "成都理工大学：《成都理工大学章程》",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://www.cdut.edu.cn/info/1366/7658.htm"
      ],
      "scopeNote": "成都理工大学：《成都理工大学章程》 https://www.cdut.edu.cn/info/1366/7658.htm | 第 27、80、81、91 条；网站检索显示约 2023 年发布，页面具体发布日期/批准施行及修订废止日待核 | 学校本身；学生与社团一般地位及党委社团管理职能已核到正文，不授权具体活动终审人；现行修订版待再比对"
    },
    {
      "id": "SRC-002",
      "title": "共青团成都理工大学委员会：《关于2024-2025学年“青春之彩”学生社团精品活动立项结果公示》",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://youth.cdut.edu.cn/info/1006/2716.htm"
      ],
      "scopeNote": "共青团成都理工大学委员会：《关于2024-2025学年“青春之彩”学生社团精品活动立项结果公示》 https://youth.cdut.edu.cn/info/1006/2716.htm | 正文首 3 段、36 项名单及末尾公示/异议段；2024-09-11 发布；公示 2024-09-11—13；项目审批决定的有效/终止日未载明 | 成都理工大学当学年学生社团，含宜宾分社/联合社团实例；全文已读，能证明**该批次**立项及“公开申报→业务指导单位初审→校团委专项评审→公示”；不能推出一般活动管理规则"
    },
    {
      "id": "SRC-003",
      "title": "校团委：《关于2025年度成都理工大学优秀学生社团指导教师评审结果公示》",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://youth.cdut.edu.cn/info/1006/3203.htm"
      ],
      "scopeNote": "校团委：《关于2025年度成都理工大学优秀学生社团指导教师评审结果公示》 https://youth.cdut.edu.cn/info/1006/3203.htm | 首段；2025-12-02 发布；引用《成都理工大学学生社团指导教师聘任、管理及考核办法（试行）》（成理校学〔2023〕2号），该办法正文及废止日尚未取得 | 2025 年指导教师评优；已核其“业务指导单位初审推荐、校团委资格审查”及教师制度存在性，**不能把评优资格审查直接套到活动审签**"
    },
    {
      "id": "SRC-004",
      "title": "成都理工大学党委保卫部（保卫处、人民武装部）：《机构设置》",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://bwc.cdut.edu.cn/bmjs/jgsz.htm"
      ],
      "scopeNote": "成都理工大学党委保卫部（保卫处、人民武装部）：《机构设置》 https://bwc.cdut.edu.cn/bmjs/jgsz.htm | 官网搜索索引显示“四、治安科”第 4 项，但原网页打开返回 412；具体刊发、生效、修订日未标明 | 官方索引描述该科职责包括大型活动治安审批、校内活动场地审批；**仅索引验证，未直读完整原文/现行职责**，不能据此设强制安全/场地阈值"
    },
    {
      "id": "SRC-005",
      "title": "成都理工大学财务处：《业务流程》“事业经费—学生活动报销事项标准流程”",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://jcc.cdut.edu.cn/ywlc/5.htm"
      ],
      "scopeNote": "成都理工大学财务处：《业务流程》“事业经费—学生活动报销事项标准流程” https://jcc.cdut.edu.cn/ywlc/5.htm | 官网索引见 2024-04-18 条目及部分流程摘要；直开原网页返回 412，生效/废止不明 | 官方索引提示学生活动支出报销与经费明细/活动情况材料，但**未获取最新完整流程/附件**，仅作后续财务线索，不作当前社团立项校本规则"
    },
    {
      "id": "SRC-006",
      "title": "校团委：《关于公布成都理工大学2025年度校级科技立项立项结果的通知》",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://youth.cdut.edu.cn/info/1006/3032.htm"
      ],
      "scopeNote": "校团委：《关于公布成都理工大学2025年度校级科技立项立项结果的通知》 https://youth.cdut.edu.cn/info/1006/3032.htm | 正文第 1—3 段；2025-04-29 发布；公示 2025-04-29—05-01；有效期未载明 | 2025 年校级科技立项单独流程；50 项重点项目含 5 项“社团专项”，明确其与“青春之彩”精品活动立项不能混同；原文已核"
    },
    {
      "id": "SRC-007",
      "title": "校团委：《岁末年终，让我们一起盘点成理共青团和成理青年的“高光时刻”》",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://youth.cdut.edu.cn/info/1016/1812.htm"
      ],
      "scopeNote": "校团委：《岁末年终，让我们一起盘点成理共青团和成理青年的“高光时刻”》 https://youth.cdut.edu.cn/info/1016/1812.htm | “这一年，社团改革显成效”小节；**2023-01-21** 发布，回顾 2022 年团委工作；2026-10-23 官网正文可读；无制度生效期 | 证实校团委曾开展精品活动立项、社团导师建设并**拟定**经费管理办法；“拟定”不能等于办法已颁行或现行有效"
    },
    {
      "id": "SRC-008",
      "title": "校团委官网《校团委》首页",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://youth.cdut.edu.cn/index.htm"
      ],
      "scopeNote": "校团委官网《校团委》首页 https://youth.cdut.edu.cn/index.htm | “团委公告”索引：2026-06-18“2025—2026学年‘青春之彩’学生社团精品活动结项结果”、2026-06-23 学生社团年度审核、2026-07-18 青少年科技社团专项活动立项评审；三则正文 URL 未取到，首页访问存在 412 | 学校当期栏目**标题层证据**，可指导下一轮检索，不可据标题抽取具体结项规则、年度审核标准或专项适格条件；本轮未核实正文"
    },
    {
      "id": "SRC-009",
      "title": "中华人民共和国教育部：《〈高校学生社团管理暂行办法〉出台》",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.moe.gov.cn/jyb_xwfb/s5147/201601/t20160113_227746.html"
      ],
      "scopeNote": "中华人民共和国教育部：《〈高校学生社团管理暂行办法〉出台》 https://www.moe.gov.cn/jyb_xwfb/s5147/201601/t20160113_227746.html | 2016-01-13 新闻解读；其所述 **2015 年暂行办法已被教党〔2020〕13号第 33 条明确废止** | **失效旧制度线索，不得作为任一现行审批规则**；仍保留 SRC 号防止旧版本被错误复用"
    },
    {
      "id": "SRC-010",
      "title": "共青团长沙理工大学委员会：《长沙理工大学学生社团管理办法》2024 修订版",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.csust.edu.cn/xtw/info/1018/5354.htm"
      ],
      "scopeNote": "共青团长沙理工大学委员会：《长沙理工大学学生社团管理办法》2024 修订版 https://www.csust.edu.cn/xtw/info/1018/5354.htm | 第 30、33—37、40—42 条；2024-10-18 发布，自发布日起施行，第 54 条；该校后续修订未知 | 仅长沙理工大学适用；可提示询问活动申请、校外活动、嘉宾、指导教师、经费等方面，**任何时间窗、阈值及签批链均不得迁用成都理工大学**"
    },
    {
      "id": "SRC-011",
      "title": "`Fuck-GH-Admin/cdut-studio-review-agent`：`docs/design/review-agent/acceptance/d4-unified-r01/catalog.json`，",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json"
      ],
      "scopeNote": "`Fuck-GH-Admin/cdut-studio-review-agent`：`docs/design/review-agent/acceptance/d4-unified-r01/catalog.json`，https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json | JSON 根字段 `templateCount=50`、`publicationAllowed=false`、`authoritativeSchoolTemplate=false`；技术 SHA `7b6cdc843d26e926c0c63b8c51a451ff3925cfad`；所属 workspace `d4-g04-t06`、`g07-t01` 具体 module purpose 已核 | 仅技术去重；`d4-g04-t06` 对象为校"
    },
    {
      "id": "SRC-012",
      "title": "**原发文机关：中共教育部党组、共青团中央**：《关于印发〈高校学生社团建设管理办法〉的通知》（教党〔2020〕13号）签章扫描原件，校际托管副本",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.jmi.edu.cn/_upload/article/files/35/b9/edcf8d7c46d08c132ad9fb77019f/ae4d5240-defd-483c-9c8e-8150ca54a443.pdf；复核发文首页转录",
        "https://ytw.hnie.edu.cn/info/1005/2841.htm；逐条复核",
        "https://www.cqctcm.edu.cn/xgc/2024/0331/c1207a3293/page.htm"
      ],
      "scopeNote": "**原发文机关：中共教育部党组、共青团中央**：《关于印发〈高校学生社团建设管理办法〉的通知》（教党〔2020〕13号）签章扫描原件，校际托管副本 https://www.jmi.edu.cn/_upload/article/files/35/b9/edcf8d7c46d08c132ad9fb77019f/ae4d5240-defd-483c-9c8e-8150ca54a443.pdf；复核发文首页转录 https://ytw.hnie.edu.cn/info/1005/2841.htm；逐条复核 https://www.cqctcm.edu.cn/xgc/2024/0331/c1207a3293/page.htm | 扫描 11 页，关键为 PDF 第 7—8 页第 21—24 条、第 9—11 页第 28、30、32—33 条；发文转录载 **2020-01-20**，第 33 条“自发布施行”并废止 2015-12-18 暂行办法；签章扫描及转录均为非发文机关网站托管，2026-10-23 复核；后续有无修订仍需留意 | **全国上位规范**而非成理内部操作细则。第 21 条社团"
    },
    {
      "id": "SRC-013",
      "title": "**中华人民共和国教育部**：《普通高等学校学生管理规定》（教育部令第 41 号）官方正文",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201702/t20170216_296385.html；可读取的官方省级教育/政府转载",
        "https://www.fujian.gov.cn/zcwjk/sjyt/202312/t20231229_6369343.htm；教育部规章公开",
        "https://www.moe.gov.cn/jyb_xxgk/xxgk/zhengce/guizhang/202112/P020211208551013106022.pdf"
      ],
      "scopeNote": "**中华人民共和国教育部**：《普通高等学校学生管理规定》（教育部令第 41 号）官方正文 https://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201702/t20170216_296385.html；可读取的官方省级教育/政府转载 https://www.fujian.gov.cn/zcwjk/sjyt/202312/t20231229_6369343.htm；教育部规章公开 PDF https://www.moe.gov.cn/jyb_xxgk/xxgk/zhengce/guizhang/202112/P020211208551013106022.pdf | 2017-02-04 公布、2017-09-01 施行；**第 44 条第三款**关于学生团体邀校外组织/人员到校举办讲座等须经学校批准；**第 45 条**为一般课外活动支持/不影响秩序；**第 46 条**为大型集会游行示威的法定批准。教育部 URL 直开重定向，2026-10-23 通过福建省政府全文对照核定准确条号；尚须监测新修订 | 上位部门规章，不是成理内部签发岗位许可"
    },
    {
      "id": "SRC-014",
      "title": "成都理工大学财务处（采购与招标管理中心）：《成都理工大学“只跑一次”财务事项清单》**原始 PDF**",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://jcc.cdut.edu.cn/__local/8/A8/96/748E97CB5061A750C78C9A841EF_9631E851_E5400.pdf"
      ],
      "scopeNote": "成都理工大学财务处（采购与招标管理中心）：《成都理工大学“只跑一次”财务事项清单》**原始 PDF** https://jcc.cdut.edu.cn/__local/8/A8/96/748E97CB5061A750C78C9A841EF_9631E851_E5400.pdf | PDF 封面载 **2025 年 4 月**，共 17 页；PDF 第 9 页（阅读器从 1 起算，页面印刷页码 7）序号 17“学生活动费”，列发票/网报/审签/投递及明细表或事项说明、部分报销限额；2026-10-23 通过官方原件文字表格核读。适用版本后续是否替换不明 | **可证明校本财务报销属于独立后续流程**；其金额和票据规则仅用于 G07/财务有权业务，不作为社团立项时的人数、安全、资助、活动准办硬门槛。真实社团专项资金归口另核"
    },
    {
      "id": "SRC-015",
      "title": "商业网站千里马转载线索：《成都理工大学2026—2027学年“青春之彩”学生社团精品活动融入“一站式”学生社区建设立项结果公示》",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.qianlima.com/bid-630726461.html"
      ],
      "scopeNote": "商业网站千里马转载线索：《成都理工大学2026—2027学年“青春之彩”学生社团精品活动融入“一站式”学生社区建设立项结果公示》 https://www.qianlima.com/bid-630726461.html | 页面标注 **2026-09-14**，声称 32 社团申报、29 项立项、分档资助与分批拨付；页面将部分机构和信息隐匿，**未找到可核对的成都理工大学原发布 URL、正式附件与盖章原件**；2026-10-23 查看 | **仅当期校本文件线索，不可计作 CDUT-VERIFIED 或实际拨款决定**；禁止把转载数字/金额、公示期直接写为资格 R 或 G07 审批阈值，待校团委核原始通知、立项结果、资金批文及后续变更"
    }
  ],
  "criteria": [
    {
      "sectionId": "route-and-subject",
      "criterionId": "r001",
      "srcIds": [
        "SRC-002",
        "SRC-006"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F002",
        "F003",
        "F018",
        "F026"
      ],
      "materialSlotIds": [
        "M001",
        "M005"
      ]
    },
    {
      "sectionId": "route-and-subject",
      "criterionId": "r002",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F004",
        "F005",
        "F006",
        "F026"
      ],
      "materialSlotIds": [
        "M002",
        "M005"
      ]
    },
    {
      "sectionId": "route-and-subject",
      "criterionId": "r003",
      "srcIds": [
        "SRC-012",
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F007",
        "F008",
        "F024",
        "F026"
      ],
      "materialSlotIds": [
        "M003",
        "M018"
      ]
    },
    {
      "sectionId": "route-and-subject",
      "criterionId": "r004",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F006",
        "F003",
        "F004",
        "F026"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M001"
      ]
    },
    {
      "sectionId": "route-and-subject",
      "criterionId": "r005",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F004",
        "F010",
        "F015",
        "F026"
      ],
      "materialSlotIds": [
        "M005",
        "M002"
      ]
    },
    {
      "sectionId": "route-and-subject",
      "criterionId": "r006",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F001",
        "F010",
        "F011",
        "F004",
        "F026"
      ],
      "materialSlotIds": [
        "M005",
        "M006"
      ]
    },
    {
      "sectionId": "route-and-subject",
      "criterionId": "r007",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F012",
        "F014",
        "F011",
        "F013",
        "F026"
      ],
      "materialSlotIds": [
        "M005",
        "M006"
      ]
    },
    {
      "sectionId": "pre-activity-responsibility",
      "criterionId": "r008",
      "srcIds": [
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F027",
        "F011",
        "F008",
        "F026"
      ],
      "materialSlotIds": [
        "M018",
        "M003",
        "M005"
      ]
    },
    {
      "sectionId": "pre-activity-responsibility",
      "criterionId": "r009",
      "srcIds": [
        "SRC-012",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F009",
        "F028",
        "F011",
        "F026"
      ],
      "materialSlotIds": [
        "M019",
        "M004"
      ]
    },
    {
      "sectionId": "pre-activity-responsibility",
      "criterionId": "r010",
      "srcIds": [
        "SRC-012",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F009",
        "F029",
        "F011",
        "F026"
      ],
      "materialSlotIds": [
        "M020",
        "M009"
      ]
    },
    {
      "sectionId": "pre-activity-responsibility",
      "criterionId": "r011",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F004",
        "F008",
        "F009",
        "F015",
        "F026"
      ],
      "materialSlotIds": [
        "M002",
        "M004",
        "M018",
        "M003"
      ]
    },
    {
      "sectionId": "pre-activity-responsibility",
      "criterionId": "r012",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F014",
        "F015",
        "F019",
        "F026"
      ],
      "materialSlotIds": [
        "M006",
        "M007",
        "M005"
      ]
    },
    {
      "sectionId": "pre-activity-responsibility",
      "criterionId": "r013",
      "srcIds": [
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F013",
        "F016",
        "F026"
      ],
      "materialSlotIds": [
        "M005",
        "M008",
        "M006"
      ]
    },
    {
      "sectionId": "pre-activity-responsibility",
      "criterionId": "r014",
      "srcIds": [
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F016",
        "F030",
        "F009",
        "F026"
      ],
      "materialSlotIds": [
        "M021",
        "M008"
      ]
    },
    {
      "sectionId": "pre-activity-responsibility",
      "criterionId": "r015",
      "srcIds": [
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F016",
        "F017",
        "F031",
        "F026"
      ],
      "materialSlotIds": [
        "M022",
        "M008"
      ]
    },
    {
      "sectionId": "independent-permits",
      "criterionId": "r016",
      "srcIds": [
        "SRC-005",
        "SRC-011",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F017",
        "F021",
        "F026"
      ],
      "materialSlotIds": [
        "M008",
        "M014"
      ]
    },
    {
      "sectionId": "independent-permits",
      "criterionId": "r017",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F009",
        "F018",
        "F003",
        "F026"
      ],
      "materialSlotIds": [
        "M009",
        "M001"
      ]
    },
    {
      "sectionId": "independent-permits",
      "criterionId": "r018",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F003",
        "F020",
        "F004",
        "F010",
        "F018",
        "F026"
      ],
      "materialSlotIds": [
        "M010",
        "M001",
        "M005"
      ]
    },
    {
      "sectionId": "independent-permits",
      "criterionId": "r019",
      "srcIds": [
        "SRC-004",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F012",
        "F014",
        "F021",
        "F019",
        "F026"
      ],
      "materialSlotIds": [
        "M011",
        "M001",
        "M006",
        "M007"
      ]
    },
    {
      "sectionId": "independent-permits",
      "criterionId": "r020",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F012",
        "F013",
        "F019",
        "F021",
        "F026"
      ],
      "materialSlotIds": [
        "M012",
        "M001",
        "M006"
      ]
    },
    {
      "sectionId": "independent-permits",
      "criterionId": "r021",
      "srcIds": [
        "SRC-013",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F016",
        "F021",
        "F013",
        "F026"
      ],
      "materialSlotIds": [
        "M008",
        "M013"
      ]
    },
    {
      "sectionId": "change-and-follow-up",
      "criterionId": "r022",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F023",
        "F011",
        "F012",
        "F013",
        "F015",
        "F026"
      ],
      "materialSlotIds": [
        "M016",
        "M005",
        "M006"
      ]
    },
    {
      "sectionId": "change-and-follow-up",
      "criterionId": "r023",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F001",
        "F007",
        "F023",
        "F024",
        "F026"
      ],
      "materialSlotIds": [
        "M016",
        "M003",
        "M010"
      ]
    },
    {
      "sectionId": "change-and-follow-up",
      "criterionId": "r024",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F025",
        "F020",
        "F024",
        "F026"
      ],
      "materialSlotIds": [
        "M017",
        "M010",
        "M016"
      ]
    },
    {
      "sectionId": "change-and-follow-up",
      "criterionId": "r025",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F020",
        "F022",
        "F010",
        "F012",
        "F026"
      ],
      "materialSlotIds": [
        "M015",
        "M010"
      ]
    },
    {
      "sectionId": "change-and-follow-up",
      "criterionId": "r026",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F026",
        "F001",
        "F011"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M005",
        "M010",
        "M017"
      ]
    }
  ]
} as const
