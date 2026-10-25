import type { TemplateVersion } from '@profer/shared'

export type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'

export interface R02TemplateMetadata {
  templateId: string
  name: string
  sourceDocumentPath: string
  researchSourcePath: string
  reviewedDocumentPath: string
  sourceDocumentSha256: string
  sourceDocumentBytes: number
  manifestExpectedBytes: number
  manifestExpectedSha256: string
  sourceIntegrityStatus: 'MATCH' | 'LINE_ENDING_DRIFT_ONE_LF' | 'REVIEWED_PATCH_APPLIED'
  sourceIntegrityNote: string
  sourceSnapshotCommit: string
  officialSchoolTemplate: false
  researchStatus: string
  researchEvidenceStatus: R02EvidenceStatus
  policyEvidenceStatus: R02EvidenceStatus
  sourceRecordCount: number
  sourceIds: string[]
  fieldCount: number
  fieldIds: string[]
  materialSlotCount: number
  materialIds: string[]
  criterionCount: number
  criteria: Array<{
    sectionId: string
    criterionId: string
    sourceIds: string[]
    evidenceStatus: R02EvidenceStatus
  }>
}
export const T08T01Template: TemplateVersion = {
  "templateId": "T08-T01",
  "version": 1,
  "schemaVersion": 2,
  "name": "科研助理、项目聘用人员招聘岗位立项审核",
  "description": "本地研究模板 · 非校方正式模板。科研助理、项目聘用人员招聘岗位立项审核；仅支持事实整理、材料覆盖核对和本地审阅建议，未经有权人员核定不得产生学校正式批准或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板来自 R02 研究原件 T08-T01，非成都理工大学校方正式模板；政策证据为 PARTIAL，校内授权与当前表单未确认。",
  "objectType": "project",
  "displayName": {
    "template": "T08-T01 · 科研助理岗位立项"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · caseId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F001）：UUID；Case；L0—L8；系统新建案卷事件；案卷事件，不要求上传；P1；建案失败则阻断；不从客户端任意复用旧 ID。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。",
      "readOnly": true
    },
    {
      "key": "f002",
      "label": "F002 · scenarioCode",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F002）：枚举 C01—C14；Case；L0 起；申报选择+校本路由人工核定；M001、M002；P1；无法分类则 C13 待人工；禁止强塞 C01。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。",
      "options": [
        {
          "value": "C01",
          "label": "C01"
        },
        {
          "value": "C02",
          "label": "C02"
        },
        {
          "value": "C03",
          "label": "C03"
        },
        {
          "value": "C04",
          "label": "C04"
        },
        {
          "value": "C05",
          "label": "C05"
        },
        {
          "value": "C06",
          "label": "C06"
        },
        {
          "value": "C07",
          "label": "C07"
        },
        {
          "value": "C08",
          "label": "C08"
        },
        {
          "value": "C09",
          "label": "C09"
        },
        {
          "value": "C10",
          "label": "C10"
        },
        {
          "value": "C11",
          "label": "C11"
        },
        {
          "value": "C12",
          "label": "C12"
        },
        {
          "value": "C13",
          "label": "C13"
        },
        {
          "value": "C14",
          "label": "C14"
        }
      ]
    },
    {
      "key": "f003",
      "label": "F003 · lifecycleStage",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F003）：枚举 L0—L8；Case；全期；后台状态机/有权操作事件；案卷事件时间线；P1；无权前进则保持原阶段，不用客户端报送状态。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。",
      "options": [
        {
          "value": "L0",
          "label": "L0"
        },
        {
          "value": "L1",
          "label": "L1"
        },
        {
          "value": "L2",
          "label": "L2"
        },
        {
          "value": "L3",
          "label": "L3"
        },
        {
          "value": "L4",
          "label": "L4"
        },
        {
          "value": "L5",
          "label": "L5"
        },
        {
          "value": "L6",
          "label": "L6"
        },
        {
          "value": "L7",
          "label": "L7"
        },
        {
          "value": "L8",
          "label": "L8"
        }
      ]
    },
    {
      "key": "f004",
      "label": "F004 · batchId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F004）：字符串/可空；Demand；L1—L3；当期科发院/单位正式通知；M002 公告批次栏，SRC-001—004；P1；无征集批次可空但 POLICY_UNCONFIRMED；不可借 2025 批次。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f005",
      "label": "F005 · policyVersion",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F005）：文号+日期+效力；Authority；L0—L5；正式发文机构/版本登记；M002/M011、SRC-005—014；P1；版本失联 SOURCE_UNAVAILABLE，过期 POLICY_UNCONFIRMED。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f006",
      "label": "F006 · unitId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F006）：单位编码；Unit；L0—L5；学校组织名录/授权单位核验；M003 单位源记录；P1；名称相似不够，冲突转单位确认。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f007",
      "label": "F007 · submitterActorId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F007）：可信主体 ID；Unit；L0—L6；后台登录与组织权威；M004 权限来源和系统事件；P2；只取可信会话；未知则待身份核验。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f008",
      "label": "F008 · delegationRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F008）：可空授权引用；Unit；代理时 L0—L6；单位有权授权文书/系统；M004 代理范围、有效期；P2；未授权代理不得代签，NEEDS_HUMAN_DECISION。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f009",
      "label": "F009 · employmentRoute",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F009）：枚举科研助理编外/项目聘用待核/培养助研/正式用工/博士后；Demand；L0；校本公告+用工主管部门；M001/M003，SRC-001—004、013；P1；非明确定义的类别转 C13/C14，不能自动通过。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f010",
      "label": "F010 · postLayer",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F010）：枚举学校/学院/项目/平台/联合；Demand；L0—L2；当期岗位征集通知、单位认定；M001/M002，SRC-001—004；P1；层级不一致 CONFLICT，不猜审批人。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f011",
      "label": "F011 · postTitle",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F011）：文本；Demand；L1—L5；提出者陈述+当期计划表；M001 岗位名称栏；P0/P1；不完整 NEEDS_MATERIAL，不使用旧招聘标题替代。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f012",
      "label": "F012 · postDuties",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F012）：分项文本；Demand；L1—L5；项目负责人陈述+任务书事实；M001/M005，SRC-008、009；P1/P3；需人工判断相关性；涉密部分不得进普通解析。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f013",
      "label": "F013 · postCount",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F013）：非负整数；Demand；L1—L5；需求表+指标权威；M001/M008；P1；数值不明请求澄清；数量上限未知不自动拒绝。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f014",
      "label": "F014 · termStart",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F014）：日期/未知；Demand；L1—L5；需求表+项目周期；M001/M005/M006；P1；未确定可标待确认；不硬套特定 2026 聘期。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f015",
      "label": "F015 · termEnd",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F015）：日期/未知；Demand；L1—L5；需求表+项目周期；M001/M005/M006；P1；不能凭空生成期限，跨项目期交人工。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f016",
      "label": "F016 · projectId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F016）：项目号/可重复列表；Project；项目岗 L1—L5；学校科研项目批准记录；M005 项目号、正式任务书；P1/P3；来源系统不可用 SOURCE_UNAVAILABLE；不能从手写号自证。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f017",
      "label": "F017 · projectClass",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F017）：枚举纵向/横向/重大/平台/其他；Project；L1—L5；科研管理权威；M005，SRC-005、006；P1；分类未知不套用资金规则。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f018",
      "label": "F018 · projectState",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F018）：在研/已结题/中止/未知；Project；L2—L5；最新有权科研项目记录；M005 项目状态和有效日期；P1/P3；旧状态与新记录冲突则重取快照并人工核。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f019",
      "label": "F019 · taskBookRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F019）：任务书版本引用；Project；项目岗 L2—L5；有权项目管理系统/文书；M005 任务书首页及任务分工页；P1/P3；缺本案关联任务依据信息时待补，非全部项目强制同格式任务书。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f020",
      "label": "F020 · projectPIId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F020）：权威负责人 ID；Project；项目岗 L0—L5；科研项目正式负责人记录；M005 负责人签发位置、M004；P2；姓名同字不同人不算匹配；转权威确认。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f021",
      "label": "F021 · projectUnitAuthority",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F021）：主体-项目-单位授权关系；Project；L0—L5；组织/科研管理联合权威；M003/M004/M005；P2；未授权申请转人工；不能由经费申请人自证代理权。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f022",
      "label": "F022 · fundingChannel",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F022）：枚举财政项目/横向/结余/单位配套/其他；Funding；L1—L5；需求声明+财务确认；M006/M007，SRC-005、006、008、009；P1/P2；来源未知不认定为可用资金。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f023",
      "label": "F023 · budgetLine",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F023）：科目编码/文字；Funding；L2—L5；项目预算与财务权威；M006/M007，SRC-006；P2；不得把“劳务费可列支”解释为任意岗位都批准。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f024",
      "label": "F024 · fundingAccountRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F024）：脱敏账户引用；Funding；L2—L5；财务处账户权威；M007 或人工财务核验凭据；P2/P3；不让申请人上传完整账户敏感信息；无接口转人工。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f025",
      "label": "F025 · estimatedCost",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F025）：金额+币种+覆盖期+计算说明；Funding；L1—L5；申请者测算、财务核算；M006 岗位成本测算；P2；没有校本测算口径不自动认定足够/不足。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f026",
      "label": "F026 · usableFunds",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F026）：金额+截止日+保留限制；Funding；L2—L5；财务权威快照；M007 余额/指标确认；P2/P3；不能以过期截图判定，缺失标 SOURCE_UNAVAILABLE。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f027",
      "label": "F027 · spendingRestrictions",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F027）：列表/未知；Funding；L2—L5；资金合同/任务书/财务核；M005/M007/M019，SRC-005、006；P2/P3；特殊限制未核转人工，不据一般通知消除专款限制。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f028",
      "label": "F028 · priorCommitments",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F028）：已承诺岗位/占用额引用；Funding；L2—L5；财务/岗位台账；M007/M021；P2；查不到不能判“无重复占用”；标未知。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f029",
      "label": "F029 · demandVersion",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F029）：单调版本号；Demand；L1—L8；本案后台 CAS 更新；M001/M013/M020；P1；版本不一致拒绝覆盖旧证据并提示冲突。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f030",
      "label": "F030 · sourceVersionRefs",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F030）：SRC/M 版本集合；Evidence；L0—L8；文件签发机关/校本源系统；M002/M005/M020；P1/P3；失效或取不到版本阻断对应事实结论。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f031",
      "label": "F031 · priorPostDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F031）：可空岗位/决定引用；Demand；调整/复核 L3—L8；本案历史或有权岗位台账；M012/M016；P1/P2；不可拿招聘公告伪造旧批准。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f032",
      "label": "F032 · changeDelta",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F032）：字段差异+理由；Demand；C07—C11 的 L4—L6；原申请主体陈述+系统比对；M013/M022；P1；缺旧版本不能自动局部重审。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f033",
      "label": "F033 · unitOpinionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F033）：签发意见引用/未知；Authority；条件触发 L2—L5；校本授权单位；M009/F041 所引签章权限；P1/P2；未查校本必需性不一律索要盖章。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f034",
      "label": "F034 · financeOpinionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F034）：经费确认文号/未知；Authority；资金疑问 L2—L5；财务处有权确认；M007；P2；不能将财务意见作为岗位批准。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f035",
      "label": "F035 · staffingOpinionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F035）：用工指标确认/未知；Authority；指标受管控时 L2—L7；现行学校用工管理授权部门；M008；P2；指标主管未明 POLICY_UNCONFIRMED。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f036",
      "label": "F036 · officialDecisionRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F036）：正式签发/决定号；Authority；仅 L7 形成；有权岗位决定源记录；M016；P2；L1—L6 缺失是正常；绝不提前要求。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f037",
      "label": "F037 · withdrawalEvent",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F037）：撤回主体+时间+理由+效力状态；Case；C11/撤回 L6；可信操作事件+有权受理；M014；P2；不直接删除已批准/已发布岗位。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f038",
      "label": "F038 · reconsiderationRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F038）：异议请求/处理状态；Case；C10 L6；有权申请主体与复核机构；M015；P2；期限、层级未知，人工核定。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f039",
      "label": "F039 · publicationRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F039）：招聘公告/版本引用；Downstream；L8 或 C11；科发院/单位官网正式公告；M017，SRC-001—004；P0；新设岗申请时为空合法；已发布后变更需核实时效。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f040",
      "label": "F040 · restrictedFlag",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F040）：保密/限制级别/未知；Project；L0—L5；有权项目保密管理单位；M019，SRC-006 第 9 条；P3；未核不得上传涉密全文，转线下授权通道。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f041",
      "label": "F041 · signingAuthorityRef",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F041）：权限文号+角色+组织+期间；Authority；所有代签/决定 L0—L7；组织人事/正式授权文书；M004/M009/M016；P2；无效授权不签发，Renderer 身份输入无效。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    },
    {
      "key": "f042",
      "label": "F042 · evidenceProvenance",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段定义（F042）：材料 ID、哈希、定位、来源、时间、所有者；Evidence；全阶段；文件接收/权威源取数事件；M001—M022 元数据及替换链；P1/P3；无法追溯不许输出 PASS_FACT；旧版证据结论标失效。。字段仅用于本地事实整理；条件必填与法律效果必须按原件规则人工核验。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "M001 · 岗位需求及职责说明：证明“申请的是什么岗位”",
      "purpose": "提出需求者/用人单位；岗位需求表或结构化申请；当前必需，L1；经校方确认的内部在线岗位申报记录；本轮未取得统一表单；F002、F009—F015、F022、F025、F029；SRC-001—004、008；归属岗位需求，逐栏定位，版本随 F029；缺关键事实 NEEDS_MATERIAL；模糊扫描 UNREADABLE，不推断人数。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 1,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "提出需求者/用人单位；岗位需求表或结构化申请",
        "当前必需，L1",
        "经校方确认的内部在线岗位申报记录；本轮未取得统一表单",
        "F002、F009—F015、F022、F025、F029；SRC-001—004、008"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "M002 · 当期征集/岗位政策：确定受理范围与时效",
      "purpose": "科发院/学院/上级主管；正式通知、补充通知、批次公告；条件必需，有批次或政策门槛时 L0—L2；公开官方网站可核版本/学校归档原文，原则不令申请人重复上传；F004、F005、F010、F030；SRC-001—004、007、011、012、014；归属批次，原文 URL/发布日期/补充替代关系；取不到 SOURCE_UNAVAILABLE；旧批次 POLICY_UNCONFIRMED。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "科发院/学院/上级主管；正式通知、补充通知、批次公告",
        "条件必需，有批次或政策门槛时 L0—L2",
        "公开官方网站可核版本/学校归档原文，原则不令申请人重复上传",
        "F004、F005、F010、F030；SRC-001—004、007、011、012、014"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "M003 · 用人单位权威归属：证实单位和提出人任职/关系",
      "purpose": "学校组织人事或科研管理；单位编码/任职归属/机构证明；当前必需，L0；后台可信组织名录查询及带时间戳结果；F006、F009、F010、F021；SRC-001—004；归属单位+时点，不公开无关人员；无记录需单位核验，不接受仅盖章图片自证。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 1,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "学校组织人事或科研管理；单位编码/任职归属/机构证明",
        "当前必需，L0",
        "后台可信组织名录查询及带时间戳结果",
        "F006、F009、F010、F021；SRC-001—004"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "M004 · 提交/代理权限：确认谁能提出、代填、代签",
      "purpose": "学校可信身份机构或授权单位；登录授权/代理书/岗位职务；当前必需的 Actor 验证；代理证明仅条件必需；后台可信身份权限令牌、学校正式代理登记；F007、F008、F020、F021、F041；SRC-005、006（项目职责，仅参考）；归属个人+单位+作用域+有效期；P2；无授权阻断有权签发，必要时人工确认；不从 Renderer 取得。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "学校可信身份机构或授权单位；登录授权/代理书/岗位职务",
        "当前必需的 Actor 验证；代理证明仅条件必需",
        "后台可信身份权限令牌、学校正式代理登记",
        "F007、F008、F020、F021、F041；SRC-005、006（项目职责，仅参考）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "M005 · 项目任务/立项有效事实：核岗位依托",
      "purpose": "科研管理部门；批准项目、任务书、负责人/期限记录；条件必需，项目岗 L1—L3；已认证项目源系统、带签发版本的任务书/正式项目决定；F012、F014—F021、F027、F040；SRC-005、006；归属每一项目号及任务书修订版；涉密 P3；失联 SOURCE_UNAVAILABLE，不拿申报书草稿替代已立项。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "科研管理部门；批准项目、任务书、负责人/期限记录",
        "条件必需，项目岗 L1—L3",
        "已认证项目源系统、带签发版本的任务书/正式项目决定",
        "F012、F014—F021、F027、F040；SRC-005、006"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "M006 · 岗位经费测算/出资声明：说明资金需求",
      "purpose": "项目负责人/单位；岗位成本方案、周期与资金来源表；当前必需，L1；学校固定表式待核；M001 已含明细测算可免单独附件；F014、F015、F022、F023、F025；SRC-005、006、008、009；归属本需求版本及币种/成本期间；P2；没有测算说明 NEEDS_MATERIAL；不足与否转人工。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 1,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "项目负责人/单位；岗位成本方案、周期与资金来源表",
        "当前必需，L1；学校固定表式待核",
        "M001 已含明细测算可免单独附件",
        "F014、F015、F022、F023、F025；SRC-005、006、008、009"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "M007 · 经费来源与可用性权威确认：核实账户和限制",
      "purpose": "财务处及有权项目主管；预算核定、资金可用性/科目限制结果；条件必需，涉及财务可用性结论、L2—L5；权威账套系统只读快照或财务部门正式核验记录，免申请人上传截图；F022—F028、F034；SRC-005、006、008、009；归属项目+科目+账户脱敏引用+采集日；P2/P3；源失联/过期不判余额充足；人工财务待办。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "财务处及有权项目主管；预算核定、资金可用性/科目限制结果",
        "条件必需，涉及财务可用性结论、L2—L5",
        "权威账套系统只读快照或财务部门正式核验记录，免申请人上传截图",
        "F022—F028、F034；SRC-005、006、008、009"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "M008 · 用工指标/名额核定证据：核岗位数来源",
      "purpose": "有权岗位/用工主管机构（未知）；指标台账或正式意见；条件必需，指标受控时、L2—L5；经机构验证的岗位额度源记录；F013、F035；SRC-001—004 仅证批次数量，不证指标分配；归属单位/批次/岗位及签发版本；P2；制度与签发者未知 POLICY_UNCONFIRMED，不凭公告名额自动批。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "有权岗位/用工主管机构（未知）；指标台账或正式意见",
        "条件必需，指标受控时、L2—L5",
        "经机构验证的岗位额度源记录",
        "F013、F035；SRC-001—004 仅证批次数量，不证指标分配"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "M009 · 单位初核意见：核归属与责任确认",
      "purpose": "二级单位有权人员；单位意见/校本送审记录；条件必需，如现行制度要求 L2；学校内部正式流程中的有权电子确认；F006、F021、F033、F041；SRC-001、003、004（只证单位参与）；归属单位+岗位+真实签发人/授权版本；P2；未明规定不能设为硬性必交；图像签章不可独立验真。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "二级单位有权人员；单位意见/校本送审记录",
        "条件必需，如现行制度要求 L2",
        "学校内部正式流程中的有权电子确认",
        "F006、F021、F033、F041；SRC-001、003、004（只证单位参与）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "M010 · 联合项目成本与职责分摊：核重复承担",
      "purpose": "各项目负责人及涉及单位；多方分担书/经费计划；条件必需，C05；各项目权威预算记录+已授权电子确认；F016—F028；SRC-008 第 3/4 部分；多项目逐项 owner，不可只附单一 PI 自签；P2/P3；缺任一资金主体授权为 CONFLICT/待补。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "各项目负责人及涉及单位；多方分担书/经费计划",
        "条件必需，C05",
        "各项目权威预算记录+已授权电子确认",
        "F016—F028；SRC-008 第 3/4 部分"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "M011 · 特定项目科研助理配备条件：核项目类别触发",
      "purpose": "上级计划/科发院；申报指南及有效校内通知；条件必需，C06；可核官方通知及最新补充，不要求申请人自制复印；F004、F005、F017；SRC-007、014；归属具体计划、年度与批次；P0/P1；旧指南/未核政策 POLICY_UNCONFIRMED。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "上级计划/科发院；申报指南及有效校内通知",
        "条件必需，C06",
        "可核官方通知及最新补充，不要求申请人自制复印",
        "F004、F005、F017；SRC-007、014"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "M012 · 既有岗位/决定引用：识别是否重复或变更",
      "purpose": "岗位决定保管部门；原岗位台账或正式批准文件；条件必需，C07/C08/C11；本案历史正式有效决定只读引用；F029、F031、F036、F039；SRC-001—004 只能旁证招聘发布；归属旧岗位和签发日；P1/P2；无原决定不假设已批准；转人工辨别新报/重报。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "岗位决定保管部门；原岗位台账或正式批准文件",
        "条件必需，C07/C08/C11",
        "本案历史正式有效决定只读引用",
        "F029、F031、F036、F039；SRC-001—004 只能旁证招聘发布"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "M013 · 新旧岗位差异说明：核调整范围",
      "purpose": "原有权需求提出主体；变更申请及差异版本；条件必需，C07/C08/C11；系统自动差异+提出主体确认，不必重复交旧文件；F012—F028、F029、F031、F032；SRC-005、006；归属同一岗位对象，引用旧版快照/新版本；P1/P2；缺旧版仅可全量待核，不能局部放行。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "原有权需求提出主体；变更申请及差异版本",
        "条件必需，C07/C08/C11",
        "系统自动差异+提出主体确认，不必重复交旧文件",
        "F012—F028、F029、F031、F032；SRC-005、006"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "M014 · 撤回申请和身份事件：核撤回意思表示",
      "purpose": "原提出者/有权继任者；可信撤回操作/正式撤回说明；条件必需，L6 撤回；认证的系统撤回事件、学校有效纸质文书核验；F003、F007、F031、F037、F041；校本 SRC 缺；归属案卷+当前版+操作时点；P2；未证权限不撤销；已批准/发布转有权人工。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "原提出者/有权继任者；可信撤回操作/正式撤回说明",
        "条件必需，L6 撤回",
        "认证的系统撤回事件、学校有效纸质文书核验",
        "F003、F007、F031、F037、F041；校本 SRC 缺"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "M015 · 事实复核请求与争议证据：核异议内容",
      "purpose": "被核验岗位的有权主体；复核申请、争议证据；条件必需，C10；系统带事实定位的异议事件；相关权威记录复查；F031、F038、F042；岗位复核校本 SRC 缺；指向争议 F/M/版本及原核验记录；P2；无法定位争议则请澄清，不造复核期限。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "被核验岗位的有权主体；复核申请、争议证据",
        "条件必需，C10",
        "系统带事实定位的异议事件；相关权威记录复查",
        "F031、F038、F042；岗位复核校本 SRC 缺"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "M016 · 正式岗位决定/批复：证实有效行政/校内决定",
      "purpose": "现行授权机构；有权批复、签发记录；后续才产生，L7；可信校内审批源系统的决定引用；F031、F035、F036、F041；岗位批准校本 SRC 缺；决定号、签发者、授权、岗位版本、生效日；P2；L1—L5 无此材料属正常；L7 授权缺失禁宣称通过。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "requiredElements": [
        "现行授权机构；有权批复、签发记录",
        "后续才产生，L7",
        "可信校内审批源系统的决定引用",
        "F031、F035、F036、F041；岗位批准校本 SRC 缺"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "M017 · 正式招聘公告/岗位计划：只核发布后事实",
      "purpose": "科发院/学院官网；公告及补充/更正文；后续才产生，L8；C11 变更后核查；官方发布网页或机构公文归档；F004、F030、F039；SRC-001—004；归属发布批次/岗位/公告版本；P0；新设岗不要求；已发布版本失联标来源缺口。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "requiredElements": [
        "科发院/学院官网；公告及补充/更正文",
        "后续才产生，L8；C11 变更后核查",
        "官方发布网页或机构公文归档",
        "F004、F030、F039；SRC-001—004"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "M018 · 个人报名、资格、面试、公示、体检、准入和聘用资料",
      "purpose": "应聘者、招聘单位、人事处；个人档案；后续才产生，且本 ID 不收集/不审；下游录用模板按必要性和授权自行获取；本 ID 无个人 F；SRC-001、002、003 仅证其在 L8；人员个人资料属于下游，应最小披露；P2/P3；本案缺失一律不得导致岗位立项不通过。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "decision",
      "requiredElements": [
        "应聘者、招聘单位、人事处；个人档案",
        "后续才产生，且本 ID 不收集/不审",
        "下游录用模板按必要性和授权自行获取",
        "本 ID 无个人 F；SRC-001、002、003 仅证其在 L8"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "M019 · 涉密/专用经费渠道确认：避免越权解析",
      "purpose": "项目保密/资金管理授权部门；可公开的保密级别与受理路径元数据；条件必需，C12；经许可的密级/受限标记和线下处理回执，不传涉密正文；F027、F040；SRC-006 第 9 条；归属项目+限制级别，普通案卷不保留涉密内容；P3；未授权读取即隔离并人工，不能 OCR 继续审核。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "项目保密/资金管理授权部门；可公开的保密级别与受理路径元数据",
        "条件必需，C12",
        "经许可的密级/受限标记和线下处理回执，不传涉密正文",
        "F027、F040；SRC-006 第 9 条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "M020 · 证据清单及版本链：证实材料版本/归属",
      "purpose": "审核后台；源文件索引、哈希、OCR 页码/表格单元格与替换历史；当前必需，凡有材料/权威记录；系统自动生成，不由申请人上传；F001、F029、F030、F042；技术要求，非校本行政规定；归属案卷/岗位/项目/材料，记录先后替代；P1/P3；无完整归属不产出 PASS_FACT，先修复证据定位。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 1,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "审核后台；源文件索引、哈希、OCR 页码/表格单元格与替换历史",
        "当前必需，凡有材料/权威记录",
        "系统自动生成，不由申请人上传",
        "F001、F029、F030、F042；技术要求，非校本行政规定"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "M021 · 既有岗位/经费承诺占用台账：排除重报",
      "purpose": "有权岗位台账/财务处；按项目/期次的占用记录；条件必需，疑重复或联合出资；学校系统的只读唯一键和有效记录；F013、F024—F028、F031；SRC-005、006 仅作责任原则；归属岗位+资金科目+生效时段，P2；查不到不能断言“无重复”，人工核账。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "有权岗位台账/财务处；按项目/期次的占用记录",
        "条件必需，疑重复或联合出资",
        "学校系统的只读唯一键和有效记录",
        "F013、F024—F028、F031；SRC-005、006 仅作责任原则"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "M022 · 针对缺口的补充说明/更正件：闭环具体问题",
      "purpose": "原需求提出者/单位或真正权威签发人；有目标的补件、纠错证明；条件必需，L4；校方系统修正后的最新事实，或有权签发更正证明；指向受影响 F/M，F029、F032、F042；由关联 SRC 继承；标明 replaces 旧 M、页码/单元格、签发主体；P1/P2；无对应缺口不泛要；仍不可读 UNREADABLE，保留历史。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 50,
      "requiredAt": "submission",
      "requiredElements": [
        "原需求提出者/单位或真正权威签发人；有目标的补件、纠错证明",
        "条件必需，L4",
        "校方系统修正后的最新事实，或有权签发更正证明",
        "指向受影响 F/M，F029、F032、F042；由关联 SRC 继承"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules-8-2",
      "name": "R001—R032 独立检查规则",
      "order": 0,
      "required": true,
      "description": "来自原件第 08 节的研究性检查项；不构成校方正式政策。",
      "criteria": [
        {
          "id": "r001",
          "title": "R001 用工性质/路由，L0",
          "requirement": "T=提出科研助理/项目聘用需求；F=明确属于其他已识别事项；U=“科研助理”是否指学生助研、博士后或社会用工未知；SRC-001—004、013、017、018；F002/F009/F010；M001/M003；比合同制编外公告与培养助研具体关系，批次公告 A、培养原文仅其适用范围 A，名称自述 C；社会用工属性可核为 PASS_FACT，明确学生培养进入 C14 本规则 NOT_APPLICABLE，混合身份 CONFLICT，非科研助理项目聘用口径不明 POLICY_UNCONFIRMED；学籍不自动构成岗位批准。；用工主管/研究生培养归口核路由",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "R002 批次与适用政策，L0—L2",
          "requirement": "T=存在当期征集/专项申报批次；F=经确认无批次管理；U=是否有当前批次未知；SRC-001—004、007、011、012、014—017、020；F004/F005/F010/F030；M002/M011/M020；以官网原发+补充的 A 级版本链核岗位层级、有效窗口；SRC-002 第一批受 SRC-015 补充、SRC-016 第二批独立，SRC-020 仅第三批标题线索。此处核的是当期发布版本这一事实，不是设岗受理窗口；版本不符 CONFLICT，时效政策未明 POLICY_UNCONFIRMED，官网源失联 SOURCE_UNAVAILABLE；招聘报名截止不作岗位设立截止。；当期批次发布机构/科发院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "R003 提出单位归属，L0—L2",
          "requirement": "T=有提交单位；F=排除的纯个人报名案；U=无法确定提出单位；SRC-001—004；F006/F007/F010/F021；M001/M003/M020；对组织名录 B 与岗位需求 C 的单位编码、有效期和所属层级，不按单位简称猜；吻合 PASS_FACT，两份 B 源不合 CONFLICT，单位权威源失联 SOURCE_UNAVAILABLE。；组织人事/用人单位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "R004 真实申请主体，L0—L3",
          "requirement": "T=提交/送审操作；F=无操作；U=后台 Actor 身份或任职未解析；SRC-001、005、006（仅参与者责任）；F007/F020/F021/F041；M003/M004/M005；后台受保护会话和项目/组织 B 源核唯一人员 ID+单位+生效时间，Renderer 角色 D 不可信；匹配 PASS_FACT，同名不同 ID CONFLICT，校本主体资格不明 POLICY_UNCONFIRMED；不得由项目经费责任倒推岗位审批权。；后台身份门禁/单位归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "R005 代理权限，L0—L6",
          "requirement": "T=代理/单位代办或代签；F=可信本人操作；U=是否代理不清；SRC-005/006 仅项目责任背景、校本代理授权缺；F007/F008/F021/F041；M004/M009；B 级授权记录逐一校对象、动作、组织、有效期，代填≠代签≠批准；有效的代办事实可 PASS_FACT，授权已撤销 CONFLICT，无校本授权范围 NEEDS_HUMAN_DECISION，缺代理文书 NEEDS_MATERIAL。；组织人事/授权单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "R006 岗位需求可识别性，L1—L3",
          "requirement": "T=新岗或变更需求；F=纯撤回复核不重申岗位；U=岗位目标/版本不明；SRC-001—004、008/009；F001/F011—F015/F029/F042；M001/M006/M020；C 级申请表逐栏核岗位、职责、人数、周期和需求版本；字段全且可读 PASS_FACT 只代表“陈述完整”，缺栏 NEEDS_MATERIAL，页不可读 UNREADABLE，目标版本错配 CONFLICT；不据此确认岗位必要性。；提出者/单位经办",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "R007 职责与项目事实对应，L1—L5",
          "requirement": "T=岗位依托项目/平台；F=已确认学校统筹无项目绑定；U=职责归属不清；SRC-008/009、005/006；F011/F012/F016/F019；M001/M005；将 C 级职责与 B 级任务书可披露部分逐条定位、核时点；文字相符 PASS_FACT 只证描述对应，明显不符 CONFLICT，是否必要/可由何岗承担 NEEDS_HUMAN_DECISION；涉密改走 R020。；项目负责人/科研管理部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "R008 人数和指标来源，L2—L5",
          "requirement": "T=申请岗位人数/受控制度约束；F=非岗位案；U=指标是否受校本管控不明；SRC-001—004、016/017（只证其各批次发布数）、校本指标制度缺；F013/F035；M001/M008；C 级拟人数与 B 级当期授权指标的同单位/批次/周期逐项对齐；单纯整数格式可 PASS_FACT，指标制度/批准人未知 POLICY_UNCONFIRMED，真实指标分配 NEEDS_HUMAN_DECISION，绝不以历史“19/50/15/7/2”等招聘数作统一上限。；岗位/用工指标主管（待确定）",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "R009 拟聘期间与项目有效期，L1—L5",
          "requirement": "T=有项目期限约束；F=独立学校统筹岗位且无该约束；U=期限或项目效力不明；SRC-005/006、008/009；F014/F015/F018/F019；M001/M005/M006；比日期先后、覆盖期与 B 级任务书有效窗口；机械无矛盾 PASS_FACT，项目已中止/期限对不上 CONFLICT，延期是否许可或无校本最短最长聘期 NEEDS_HUMAN_DECISION。；科研项目管理/用工主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "R010 项目真实性与状态，L2—L5",
          "requirement": "T=项目出资/依托；F=非项目型学校统筹；U=项目号有无正式立项不明；SRC-005/006；F016—F019/F030；M005/M020；B 级项目号、立项决定、状态、任务书版本和抓取时点比 C 主张；真实匹配 PASS_FACT，申报草稿当获批 CONFLICT，B 源断连 SOURCE_UNAVAILABLE，中止后设岗 NEEDS_HUMAN_DECISION。；科研管理归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "R011 项目负责人/承担关系，L0—L5",
          "requirement": "T=以具体项目名义设岗；F=无项目依托；U=承担/继任授权未知；SRC-005 第 2/3 条、006 第 4/5 条；F006/F016/F020/F021；M003/M004/M005；可信唯一 PI ID、单位、分工与任务书修订版 B 交叉核对，签章图片 C 不自证；吻合 PASS_FACT，不符 CONFLICT；PI 对经费负责不等于岗位终审。；科研管理与组织人事",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "R012 出资渠道与账户归属，L1—L5",
          "requirement": "T=有经费承诺；F=仅排除路由无资金核验；U=来源类别或账户归属未明；SRC-005、006、008、009；F022/F024/F027/F034；M006/M007；将 C 级资金说明对 B 级项目账户、经费类别和资金来源；匹配 PASS_FACT 只证归属，账户失联 SOURCE_UNAVAILABLE，资金可否用于此岗 NEEDS_HUMAN_DECISION；不可要求上传完整敏感账号。；财务处/科研管理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "R013 支出科目与限制，L2—L5",
          "requirement": "T=拟以项目资金承担岗位费用；F=非项目资金且明确另有制度；U=资金性质不清；SRC-005 第 11 条、006 第 12—16/36 条、008/009；F017/F023/F027；M005/M006/M007/M019；按项目种类和生效合同 B 优先于一般鼓励政策；可证科目文本一致 PASS_FACT，禁止性条款冲突 CONFLICT，适用口径解释 NEEDS_HUMAN_DECISION，无本校通用阈值不硬判。；财务处/科研项目归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "R014 岗位成本测算事实，L1—L5",
          "requirement": "T=提交职位或调整成本；F=纯撤回且成本不变；U=拟费用覆盖期/科目不明；SRC-008/009、005/006；F013—F015/F023/F025；M001/M006；数量×各期成本项目仅做数学复算，保留 C 级公式和币种期次；算式可重现 PASS_FACT，缺依据 NEEDS_MATERIAL，新旧数字不一致 CONFLICT；工资保险口径和“足额”须人工财务确定。；提出者说明/财务处定口径",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "R015 资金可用性快照，L2—L5",
          "requirement": "T=需要事实声明“有可用经费”；F=不属本阶段或不承诺资金可用；U=是否需该意见尚不明；SRC-005/006、008/009；F024—F028/F034；M006/M007；B 级预算可用额、已冻结额、采集时点与具体支出范围核真；一致的快照数字 PASS_FACT，过期/不具权限 SOURCE_UNAVAILABLE，足够支付的行政财务结论 NEEDS_HUMAN_DECISION，不能仅看余额截图。；财务处",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "R016 既有占用与重复承诺，L2—L5",
          "requirement": "T=有可能重复申报/复用资金或岗位；F=权威记录证明完全不交叉；U=是否有台账未知；SRC-005/006（财务责任背景）；F013/F024—F028/F031；M007/M021；B 级岗位号+账户科目+生效期间联合键对重复占用，不能用无记录截图证明零占用；一致 PASS_FACT，重叠而无法解释 CONFLICT，台账失联 SOURCE_UNAVAILABLE。；岗位台账主管/财务处",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "R017 多项目分担有效事实，L2—L5",
          "requirement": "T=两个及以上项目共同出资；F=单一经费来源；U=出资关系未知；SRC-008 第三/四部分、005/006 依项目种类；F016/F020—F028/F041；M005/M007/M010/M021；逐项目 B 级预算与签署权限核成本分摊、时间和余额，不能一名 PI 代所有项目；份额相加的数学事实可 PASS_FACT，权属冲突 CONFLICT，跨单位是否允许 NEEDS_HUMAN_DECISION。；各项目负责人/财务/用人单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "R018 特定计划科研助理要求，L0—L3",
          "requirement": "T=申报 SRC-007 或 014 明列的项目类别与年度；F=已确认其他计划；U=项目类别或当期政策未知；SRC-007、014；F004/F005/F017/F030；M002/M005/M011；同计划+年度+申请窗口与官网 A 级原文核触发；确有条文 PASS_FACT 只证“该项目申报要求”，附件/更新失联 SOURCE_UNAVAILABLE；“足额”值和是否等于岗位已批准 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION。；科发院申报部门/岗位归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "R019 重大项目特殊责任和预算，L2—L5",
          "requirement": "T=国家重点研发/科技重大专项；F=普通项目；U=项目类别不明；SRC-006 第 2/4/5/12—16/36 条；F017/F019/F023/F027；M005/M007；A 级专项制度+对应 B 级任务书逐款核预算、支出、专款与责任，其他项目不套；可核一致 PASS_FACT，限制不符 CONFLICT，是否允许此具体岗位 NEEDS_HUMAN_DECISION。；重大项目科研归口/财务",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "R020 涉密及受限处理路径，L0—L5",
          "requirement": "T=已知项目密级/受限数据；F=有权确认不涉密；U=保密标识或权限未知；SRC-006 第 9 条（仅适用其重大项目）；F027/F040/F042；M005/M019/M020；B 级保密管理只返回允许披露的元数据，D 级 OCR 不接触原文；许可路径明确可 PASS_FACT 仅证分流，普通渠道传涉密文档立即隔离 NEEDS_HUMAN_DECISION，权限未明 POLICY_UNCONFIRMED。；保密主管/线下有权审查人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "R021 单位意见真实有效，L2—L5",
          "requirement": "T=现行政策要求单位意见或已经提交意见；F=确认当前不要求且未提交；U=意见是否强制未知；SRC-001/003/004 仅证单位参与，岗位签审条款缺；F006/F021/F033/F041；M003/M004/M009；B 级受理流水+单位签发权限/期间比对，不用印章图 C 自证；签发来源吻合可 PASS_FACT，无校本强制规定 POLICY_UNCONFIRMED，未获签权 NEEDS_HUMAN_DECISION。；单位有权初核/组织人事",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "R022 岗位指标核定意见，L2—L7",
          "requirement": "T=现行批次需指标核定；F=有效政策明确免指标；U=指标主管/制度不明；SRC-001/002 历史招聘数仅背景、校本指标授权缺；F013/F035/F041；M008/M016；B 级指标意见应含岗位/单位/批次/签发授权；数据一致可 PASS_FACT 仅证意见存在，无真实指标来源 SOURCE_UNAVAILABLE，审批权不明 NEEDS_HUMAN_DECISION；不把公告数量当配置。；有权岗位指标主管（待核）",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "R023 原岗位决定有效性，L3—L8",
          "requirement": "T=C07/C08/C11 变更或声称已有批准；F=首次新岗；U=新报/变更难区分；SRC-001—004 只作发布背景、岗位批准授权 SRC 缺；F029/F031/F036/F041；M012/M016/M020；查 B 级岗位决定号、对象、有效期、上游版本与后续更改；有效旧决定引用 PASS_FACT 仅证其曾签发，只有招聘公告 POLICY_UNCONFIRMED，失联 SOURCE_UNAVAILABLE，绝不补造批准。；岗位决定保管机构",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "R024 变更差异与受影响范围，L3—L6",
          "requirement": "T=人数/职责/期限/项目/资金更改；F=未修改；U=旧版或差异不明；SRC-005/006 仅项目预算边界、校本变更规则缺；F012—F032/F042；M012/M013/M020/M022；旧新 Demand/材料源版本逐字段比，生成受影响 R 清单并冻结旧结论；可完整定位差异 PASS_FACT，无法找旧版 NEEDS_MATERIAL 或 SOURCE_UNAVAILABLE（按保管者），是否重批 NEEDS_HUMAN_DECISION。；需求提出者/岗位归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "R025 证据可读与溯源，L0—L8",
          "requirement": "T=存在本案输入材料或权威记录；F=该类材料在本情形尚未产生；U=来源与归属不明；SRC-001—020 中按对象选择实际适用的官方条文；SRC-019 仅作排除对照；F001/F029/F030/F042；M001—M022（逐槽）；校 materialId/hash/source/owner/target/version/page/cell，可读且源定位无歧义才 PASS_FACT（仅证可读可追），图像遮挡 UNREADABLE，哈希/归属不合 CONFLICT，源 URL 失联 SOURCE_UNAVAILABLE；不得把 OCR D 当认证凭证。；材料提交人/档案或源记录保管者",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "R026 定向补件响应，L4",
          "requirement": "T=存在定位到 F/M 的待办；F=无待补问题；U=补件是否替代旧版不清；SRC-001—020 中原问题 R 实际适用的 SRC 逐项继承（并非校本补件时限依据），校本补件制度缺；F029/F030/F032/F042；M020/M022；检 supersedes、案卷/目标、问题号、签发者及旧新哈希，定向重开依赖 R；更正文件可读定位 PASS_FACT，错案材料 CONFLICT，同页仍模糊 UNREADABLE，缺有效回应 NEEDS_MATERIAL；不重跑无关 R。；原待办目标人/材料真正签发者",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "R027 撤回身份和效力，L6（C11 可跨 L7）",
          "requirement": "T=申请撤回或取消岗位；F=无撤回事件；U=操作权限/申请效力未知；SRC-001—004 仅招聘后续背景，岗位撤回制度缺；F003/F007/F031/F037/F041；M004/M012/M014/M016/M017；核可信 Actor、当前案卷版本和是否已有 B 级批准/公告；撤回事件存在可 PASS_FACT 仅证已提出，正式撤回效力 NEEDS_HUMAN_DECISION；未经授权 CONFLICT，不得删除历史。；当前阶段的有权受理/决定机构（未证实）",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "R028 事实异议/复核请求，L6",
          "requirement": "T=提交异议；F=无异议；U=申诉人资格或争议对象未知；SRC-013 的培养复议不得套用，本岗位复核 SRC 缺；F007/F031/F038/F042；M004/M015/M020；核原 runId/ruleId/materialVersion、有权申诉主体和新证据；请求与事实对应可 PASS_FACT 仅证收到，复核权限/时限 POLICY_UNCONFIRMED，复核裁决 NEEDS_HUMAN_DECISION，不重开无争议 R。；有权事实复核人/岗位复核机关（待核）",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "R029 正式决定主体权限，L5—L7",
          "requirement": "T=拟签批/驳回/批准/撤销岗位；F=仅事实预审；U=签发职责范围不清；SRC-001—004/005/006 均未授岗位终审权；F003/F035/F041；M004/M008/M009/M016；后端把 B 级真实 Actor 的机构、作用域、动作、授权文件版本与目标岗位冻结版交叉核验；权限真实可 PASS_FACT 仅证权限事实，无校本授权一律 NEEDS_HUMAN_DECISION 并禁止正式写入，冒名 CONFLICT。；学校有权岗位主管/组织人事核授权",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "R030 已签岗位决定真实性，L7—L8",
          "requirement": "T=出现声称正式批准/否决/撤销的决定；F=L1—L6 尚无决定；U=决定形式不明；SRC-001—004 仅公告背景，直接校本签发制度缺；F029/F031/F036/F041/F042；M012/M016/M020；必须具 B 级签发来源、决定号、案卷/岗位版、授权、签发/生效时间，和冻结计划/真实运行绑定；核验已签文书仅能 PASS_FACT 记“决定存在且可验证”，内容效力争议 NEEDS_HUMAN_DECISION；盖章图不可伪装权威。；有权签发机关与档案保管者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "R031 招聘发布与既有岗位改变，L8/C11",
          "requirement": "T=岗位已公告或据公告申请撤回/变更；F=未发布新岗；U=发布状态未知；SRC-001—004、015—017、020（仅列表线索）；F004/F030/F031/F036/F039；M012/M016/M017；官方公告及补充版本 A 核确有发布，第一批变更链比 SRC-002/015，第二批不继承第一批窗口；PASS_FACT 仅证发布事实，第三批 SRC-020 只够 POLICY_UNCONFIRMED；变更公告和已录用人员权益 NEEDS_HUMAN_DECISION，官网暂失联 SOURCE_UNAVAILABLE；公告≠岗位设立批复。；发布单位/人事及岗位有权部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "R032 下游个人材料越界，L0—L8",
          "requirement": "T=上传或试图据应聘者资料作岗位决定；F=未提交下游个人资料；U=附件归属不明；SRC-001—004、015—017（招聘后续）、013/018（培养路由）；F002/F009/F042（无个人 F）；M018/M020；M018 只有“排除并转下游”的合法用途，识别其是否为个人报名/公示/体检/准入；本案 NOT_APPLICABLE 且不得读取多余敏感内容，若替代岗位需求或误归属则 CONFLICT，隐私无法确认转人工隔离；M018 永远不是立项必交件。；隐私/招聘下游归口，不向本案审查人扩权",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "intake",
      "name": "材料登记与来源版本核验",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "review",
      "workflowOwner": "local"
    },
    {
      "id": "review",
      "name": "证据与规则人工复核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-final",
      "returnToStageId": "intake",
      "workflowOwner": "local"
    },
    {
      "id": "local-final",
      "name": "本地审阅结论（非校方决定）",
      "kind": "finalize",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "fact-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "follow-up-items",
      "kind": "supplement-list",
      "audience": "reviewer"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T03:05:00+08:00"
}

export const template = T08T01Template

export const r02Metadata: R02TemplateMetadata = {
  "templateId": "T08-T01",
  "name": "科研助理、项目聘用人员招聘岗位立项审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T08-T01.md",
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/T08-T01.md",
  "sourceDocumentSha256": "b7ee1a09b3b57ff0c57919df8f1765923bbe0c5f6999e1ccf5c6def16100587a",
  "sourceDocumentBytes": 139594,
  "sourceSnapshotCommit": "150acfe761cb7ad0424a2ca009fd57f12dbfddfd",
  "officialSchoolTemplate": false,
  "researchEvidenceStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
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
    "SRC-019",
    "SRC-020"
  ],
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
    "F032",
    "F033",
    "F034",
    "F035",
    "F036",
    "F037",
    "F038",
    "F039",
    "F040",
    "F041",
    "F042"
  ],
  "materialIds": [
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
  "criteria": [
    {
      "sectionId": "rules-8-2",
      "criterionId": "r001",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-013",
        "SRC-017",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r002",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-007",
        "SRC-011",
        "SRC-012",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r003",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r004",
      "sourceIds": [
        "SRC-001",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r005",
      "sourceIds": [
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r006",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r007",
      "sourceIds": [
        "SRC-005",
        "SRC-006",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r008",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-016",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r009",
      "sourceIds": [
        "SRC-005",
        "SRC-006",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r010",
      "sourceIds": [
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r011",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r012",
      "sourceIds": [
        "SRC-005",
        "SRC-006",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r013",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r014",
      "sourceIds": [
        "SRC-005",
        "SRC-006",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r015",
      "sourceIds": [
        "SRC-005",
        "SRC-006",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r016",
      "sourceIds": [
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r017",
      "sourceIds": [
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r018",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r019",
      "sourceIds": [
        "SRC-006"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r020",
      "sourceIds": [
        "SRC-006"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r021",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r022",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r023",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r024",
      "sourceIds": [
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r025",
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
        "SRC-019",
        "SRC-020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r026",
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
        "SRC-019",
        "SRC-020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r027",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r028",
      "sourceIds": [
        "SRC-013"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r029",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r030",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r031",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "r032",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ],
  "manifestExpectedBytes": 139284,
  "manifestExpectedSha256": "0b68bceba73624fe1e35f15037f1ef1f28f006e990cce6cd9bba2177a8f005b5",
  "researchSourcePath": "docs/design/review-agent/business-templates/R02/research-original/T08-T01.md",
  "sourceIntegrityStatus": "REVIEWED_PATCH_APPLIED",
  "sourceIntegrityNote": "research-original 的当前 Git blob 不含末尾 LF，追加一个 LF 后与清单 SHA-256 匹配；本审阅副本只更正国科发资〔2020〕132号的效力状态，依据科技部2025-08-05失效文件目录，研究原件保持只读。",
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "sourceRecordCount": 20,
  "fieldCount": 42,
  "materialSlotCount": 22,
  "criterionCount": 32
}

export default T08T01Template

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = T08T01Template
