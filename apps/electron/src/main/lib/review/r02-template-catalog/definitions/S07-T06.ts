import type { TemplateVersion } from '@profer/shared'
export type { TemplateVersion } from '@profer/shared'

export type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED' | 'HISTORICAL' | 'CROSS_SCHOOL_ONLY'
export type R02PolicyEvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
export interface R02CriterionMetadata { sectionId: string; criterionId: string; sourceIds: string[]; evidenceStatus: R02EvidenceStatus }
export interface R02Metadata { templateId: string; name: string; sourceDocumentPath: string; sourceDocumentSha256: string; researchOriginalPath: string; researchOriginalSha256: string; officialSchoolTemplate: false; researchDate: string; policyEvidenceStatus: R02PolicyEvidenceStatus; sourceStatus: Record<string, R02EvidenceStatus>; criteria: R02CriterionMetadata[]; externalPolicyReferences: Array<{id:string;title:string;documentNo:string;publishedAt:string;url:string;evidenceStatus:R02EvidenceStatus;scope:string}> }

const fieldDefinitions = [
  {
    "key": "F001",
    "label": "F001 · 受信毕业生主体 ID string",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F001`；受信毕业生主体 ID `string`；GraduateSubject；`L0`、*；学籍/实名认证 `M001`；身份主键及认证回执；P3；ID。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F002",
    "label": "F002 · 学号 string",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F002`；学号 `string`；GraduateSubject；`L0`、*；学籍 `M002`；学籍标识/官方记录；P3；ID；不可用合同上学号代填。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F003",
    "label": "F003 · 姓名/合法姓名版本 string",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F003`；姓名/合法姓名版本 `string`；GraduateSubject；`L0/L3`、*；学籍 `M002`；姓名/变更历史；P2；ID；与证明不符标 CONFLICT。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F004",
    "label": "F004 · 院系/校区 string",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F004`；院系/校区 `string`；GraduateSubject；`L0/L5`、*；学籍/岗位归属 `M002`；院系权威字段；P1；SRC；影响角色路由交人工。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F005",
    "label": "F005 · 毕业届别 year/string",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F005`；毕业届别 `year/string`；GraduateSubject；`L0/L8`、*；学籍 `M002`；届别/毕业学年；P1；ID；不能猜为当前届。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F006",
    "label": "F006 · 学段 enum?（本科/硕士/博士等）",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F006`；学段 `enum?`（本科/硕士/博士等）；GraduateSubject；`L0`、*；培养状态 `M002`；学段/教育层次；P1；ID；枚举校本待核。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F007",
    "label": "F007 · 培养方式/全非全 enum?",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F007`；培养方式/全非全 `enum?`；GraduateSubject；`L0`、J；培养归口 `M002`；培养方式；P2；HUM；不可由学生自填锁定。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F008",
    "label": "F008 · 毕/结/延毕状态及生效日 enum+date?",
    "kind": "date",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F008`；毕/结/延毕状态及生效日 `enum+date?`；GraduateSubject；`L0/L6/L8`、*；学籍 `M002`；状态记录、有效日；P2；SRC/ID；不自裁毕业资格。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F009",
    "label": "F009 · 定向/委培标记、原单位引用 ref?",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F009`；定向/委培标记、原单位引用 `ref?`；GraduateSubject；`L0`、J；培养/就业授权数据 `M014`；定向协议及学校上传单位；P3；HUM/POL；非定向 NA。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F010",
    "label": "F010 · 平台去向登记 ID string?",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F010`；平台去向登记 ID `string?`；DestinationRecord；`L0/L2–L9`、*；官方去向系统 `M003`；原生记录标识；P1；首次未建可为空；已有记录 SRC。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F011",
    "label": "F011 · 去向大类 enum?",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F011`；去向大类 `enum?`；DestinationAssertion；`L2/L3`、*；本人声明+平台 `M003`；去向选择项；P2；MAT；不自动根据合同选类。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F012",
    "label": "F012 · 去向子类/项目类型 enum?",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F012`；去向子类/项目类型 `enum?`；DestinationAssertion；`L2/L3`、*；本人声明+平台 `M003`；子类选项；P2；POL/NA；平台版本枚举需核。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F013",
    "label": "F013 · 实际去向事实生效日期 date?",
    "kind": "date",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F013`；实际去向事实生效日期 `date?`；DestinationAssertion；`L1–L3`、A–F/J、G/I；相关事实原件 `M004–M016`；合同/任职/创业/录取事实日期；P2；MAT；未发生不得填虚构日期。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F014",
    "label": "F014 · 本次提交时间 timestamp?",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F014`；本次提交时间 `timestamp?`；DestinationRecord；`L2/L4/L8`、*；官方平台 `M003`；提交事件；P1；SRC；无官方记录不声称已提交。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F015",
    "label": "F015 · 本次声明提交者与本人关系 ref/enum?",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F015`；本次声明提交者与本人关系 `ref/enum?`；DestinationAssertion；`L2`、*；实名提交会话 `M001/M003`；提交帐号/委托凭据；P2；HUM；代办资格校本未知。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F016",
    "label": "F016 · 学校（院系）审核状态 enum?",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F016`；学校（院系）审核状态 `enum?`；OfficialDecision；`L5/L8`、*；平台官方审签 `M018`；审核结果/退回原因；P1；LATE/SRC；绝非 AI verdict。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F017",
    "label": "F017 · 本人去向确认状态/时间 enum+date?",
    "kind": "date",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F017`；本人去向确认状态/时间 `enum+date?`；OfficialDecision；`L6`、*；本人平台确认 `M019`；确认事件；P2；LATE；不影响首次提交事实。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F018",
    "label": "F018 · 查询核验授权状态/范围 enum+scope?",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F018`；查询核验授权状态/范围 `enum+scope?`；OfficialDecision；`L7`、*；本人官方授权 `M020`；授权记录、有效范围；P3；LATE；未授权不分享。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F019",
    "label": "F019 · 去向记录版本/快照号 string?",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F019`；去向记录版本/快照号 `string?`；DestinationRecord；`L2–L9`、*；官方平台 `M003/M015`；记录版本/历史链；P1；SRC；旧版必须标时点。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F020",
    "label": "F020 · 来源系统标识、获取时间 string+timestamp",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F020`；来源系统标识、获取时间 `string+timestamp`；DestinationRecord；`L0–L9`、*；读取服务/官方回执 `M003`；原系统/抓取时间；P1；SRC；缓存须标非实时。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F021",
    "label": "F021 · 用人单位法定全称 string?",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F021`；用人单位法定全称 `string?`；DestinationAssertion；`L1–L3`、A–C/F-3/G；协议/合同/证明 `M004–M007/M013`；主体名称、签署页；P1；MAT；简称冲突人工核验。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F022",
    "label": "F022 · 单位统一社会信用代码/主体标识 string?",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F022`；单位统一社会信用代码/主体标识 `string?`；DestinationAssertion；`L3`、A–C/F-3；官方工商/证书或原文 `M005–M007/M022`；统一代码/核验回执；P0；HUM/POL；未规定时不强制。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F023",
    "label": "F023 · 工作岗位、工作性质 string?",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F023`；工作岗位、工作性质 `string?`；DestinationAssertion；`L1–L3`、A–D/F-3；合同/工作证明 `M004–M008`；岗位与实际工作内容；P2；MAT；实习岗位不能当就业自动通过。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F024",
    "label": "F024 · 三方协议签约/解约版本与有效状态 ref?",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F024`；三方协议签约/解约版本与有效状态 `ref?`；DestinationAssertion；`L1–L3/L8`、A/A-P/G/J；`S07-T05` 官方结果 `M004`，纸件 `M005` 仅佐证；协议 ID/状态/生效日；P2；SRC/HUM；不能本地批准协议。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F025",
    "label": "F025 · 劳动合同当事人、合同期限 structured?",
    "kind": "object",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F025`；劳动合同当事人、合同期限 `structured?`；DestinationAssertion；`L1–L3`、B；原合同/官方记录 `M006`；甲乙方、签署日、效力期间；P3；MAT；期限阈值 POL。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F026",
    "label": "F026 · 其他录用事实/聘用期间 structured?",
    "kind": "object",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F026`；其他录用事实/聘用期间 `structured?`；DestinationAssertion；`L1–L3`、C；单位证明 `M007`；具体任职/工作/日期；P2；MAT；是否足够 POL/HUM。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F027",
    "label": "F027 · 证明出具主体与核验方式 structured?",
    "kind": "object",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F027`；证明出具主体与核验方式 `structured?`；ProofMaterial；`L3/L5`、A–E/F-3；原件签发者+核验记录 `M005–M010/M022`；印章/签字/回访记录；P2；HUM；OCR 识章不是验真。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F028",
    "label": "F028 · 自由职业工作/项目事实 structured?",
    "kind": "object",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F028`；自由职业工作/项目事实 `structured?`；DestinationAssertion；`L1–L3`、D；本人+项目方证据 `M008`；服务内容/交付/日期；P2；MAT；仅“拟接单”不算完成事实。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F029",
    "label": "F029 · 收入凭据、期间及金额 structured?",
    "kind": "object",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F029`；收入凭据、期间及金额 `structured?`；ProofMaterial；`L3`、D/C（仅政策触发）；依法收集的凭据 `M009`；经脱敏流水/付款记录；P3；POL/NA；未知月数与阈值不判断。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F030",
    "label": "F030 · 创业主体、本人角色、经营状态 structured?",
    "kind": "object",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F030`；创业主体、本人角色、经营状态 `structured?`；DestinationAssertion；`L1–L3`、E；登记机关/孵化机构/经营事实 `M010`；主体登记/角色/活动证据；P2；MAT/HUM；未注册能否认定 POL。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F031",
    "label": "F031 · 升学机构、录取状态及日期 structured?",
    "kind": "object",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F031`；升学机构、录取状态及日期 `structured?`；DestinationAssertion；`L1–L3`、F-1；录取机构 `M011`；通知书/公示/录取状态；P2；MAT；意向不等于录取。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F032",
    "label": "F032 · 未就业当前类别/原因 enum?",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F032`；未就业当前类别/原因 `enum?`；DestinationAssertion；`L2`、F-2；本人平台填报 `M012`；分类选项/申报时间；P3；MAT；不得强制虚构就业证明。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F033",
    "label": "F033 · 招录项目/入伍/科研助理等权威结果 structured?",
    "kind": "object",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F033`；招录项目/入伍/科研助理等权威结果 `structured?`；DestinationAssertion；`L1–L3`、F-3；项目/主管部门 `M013`；录取/入伍/接收证明；P2；MAT；阶段尚无结果须改选真实状态。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F034",
    "label": "F034 · 变更前登记 ID、版本、原类别 ref?",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F034`；变更前登记 ID、版本、原类别 `ref?`；DestinationChange；`L4/L8`、G/H/I；原平台快照 `M015`；旧记录主键/历史有效区间；P1；SRC；不可拿新证据替换旧史。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F035",
    "label": "F035 · 变更原因、生效时点、新旧差异 structured?",
    "kind": "object",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F035`；变更原因、生效时点、新旧差异 `structured?`；DestinationChange；`L4/L8`、G/H/I；本人申请/事实证据 `M016/M017`；修改说明/前后比对；P2；MAT/HUM；时效条件 POL。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F036",
    "label": "F036 · 审核操作者受信 ID、岗位、授权范围 ref?",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F036`；审核操作者受信 ID、岗位、授权范围 `ref?`；OfficialDecision；`L5/L8/L9`、*；认证服务/官方审计 `M018/M023`；有权帐号、签名/审计轨迹；P3；HUM/SRC；Renderer 字段无效。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F037",
    "label": "F037 · 官方审核结果、理由与时间 structured?",
    "kind": "object",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F037`；官方审核结果、理由与时间 `structured?`；OfficialDecision；`L5/L8`、*；官方记录 `M018`；决定 ID/结果/时间；P1；LATE/SRC；不能自动生成。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F038",
    "label": "F038 · 材料 ID、归属、版本、哈希及原始定位 structured",
    "kind": "object",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F038`；材料 ID、归属、版本、哈希及原始定位 `structured`；ProofMaterial；`L2–L9`、*；附件服务/权威原件 `M001–M023`；页/条/文件坐标与内容摘要；P1；MAT/HUM；无归属不能判通过。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F039",
    "label": "F039 · 材料可读性/页完整性 enum+details",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：`F039`；材料可读性/页完整性 `enum+details`；ProofMaterial；`L3/L4`、*；OCR+人工查验 `M001–M023`；缺页/模糊/遮挡位置；P1；UNREADABLE；可读不等于真实。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F040",
    "label": "F040 · 档案/离校关联状态的只读引用 ref?",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F040`；档案/离校关联状态的只读引用 `ref?`；DestinationRecord；`L6/L8`、G/I（必要时）；`S07-T04/T03` `M021`；关联决定 ID/版本；P3；SRC/NA；就业核验不改档案。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F041",
    "label": "F041 · 异议、复核、就业违规举报的类型与状态 structured?",
    "kind": "object",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F041`；异议、复核、就业违规举报的类型与状态 `structured?`；DestinationChange；`L9`、H；本人请求及有权处理记录 `M023`；请求 ID、渠道、回执；P3；HUM；不得混成同一复核程序。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F042",
    "label": "F042 · 本届校本规则版本/适用性 ref?",
    "kind": "date",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：`F042`；本届校本规则版本/适用性 `ref?`；DestinationAssertion；`L0/L3/L5`、*；正式校本通知/配置（目前待证）；发文号、届别、适用日期、SRC；P1；POL；无文号不启用硬阈值。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  }
] satisfies TemplateVersion['fields']
const materialSlotDefinitions = [
  {
    "id": "M001",
    "name": "M001 · 确定本人/提交主体",
    "purpose": "原件材料槽字典：学校/国家身份认证会话与主体 ID；不是身份证照片；`L0` 当前，**系统读取优先**；经学校认可的实名人工验身份记录；F001/F015/F038；[SRC-001][SRC-014]；会话主体绑定毕业生，不与前端姓名自述混同；无可信主体→`ID/HUM`；来源失联→`SOURCE_UNAVAILABLE`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "确定本人/提交主体",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M002",
    "name": "M002 · 确认届别、学段、培养方式、毕（结）业",
    "purpose": "原件材料槽字典：学籍/培养管理归口的权威主数据；`L0` 当前，**系统读取优先**；校方盖章的当前学籍证明/经授权官方导出；F002–F009/F038；[SRC-001][SRC-008]；记录有效日期、培养方式版本，不能借用他人学籍；缺失→`ID/SRC`；截图不清→`UNREADABLE`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "确认届别、学段、培养方式、毕（结）业",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M003",
    "name": "M003 · 去向申报/当前正式登记记录",
    "purpose": "原件材料槽字典：毕业生本人填写的去向条目与全国/校级系统原生记录；`L2` 当前；首次尚未有官方 ID 可先有待提交声明；经受信人员复核的官方导出/原平台回执；F010–F020/F038；[SRC-002][SRC-014]；保存提交版/审核版/确认版及源系统快照时间；尚未提交≠来源失联；已有记录不可读→`SOURCE_UNAVAILABLE`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "去向申报/当前正式登记记录",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M004",
    "name": "M004 · 引用已完成的就业协议状态",
    "purpose": "原件材料槽字典：`S07-T05` 权威签约/解约结果记录（只读）；`A` 当前条件；未签不强要；经官方平台签约鉴证的回执/有权人员核对结果；F021/F024/F038；[SRC-005][SRC-014]；绑定协议 ID、版本、当前有效/解除状态及本人；来源失联→`SOURCE_UNAVAILABLE`；与登记不一致→`CONFLICT`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "引用已完成的就业协议状态",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M005",
    "name": "M005 · 纸质已签协议补充登记",
    "purpose": "原件材料槽字典：毕业生/用人单位持有的双方已签协议完整影像；`A-P` **签署后**当前条件；`A` 网签无需默认复传；若当届平台认可，可用官方鉴证完整电子协议；F021–F024/F027/F038/F039；[SRC-014] 第 4.4 节；签署双方、页码、日期、单位名称、扫描版本；应有未有→`NEEDS_MATERIAL`；缺页/模糊→`UNREADABLE`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "纸质已签协议补充登记",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M006",
    "name": "M006 · 劳动合同事实",
    "purpose": "原件材料槽字典：本人/用人单位持有的劳动或聘用合同；`B` 合同形成后当前条件；校方认可的劳动关系权威记录（待证）；F021/F023/F025/F038/F039；[SRC-014]；核甲乙方、签署版、期限、姓名/单位版本；无合同而报 B→`NEEDS_MATERIAL` 或人工改类；页缺→`UNREADABLE`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "劳动合同事实",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M007",
    "name": "M007 · 其他录用形式证明",
    "purpose": "原件材料槽字典：录用/聘用单位签发的工作证明、录用函或可核验原始凭证；`C` 事实形成后当前条件；用人单位原生录用记录/经校方核定的其他证明；F021–F023/F026/F027/F038；[SRC-014]；外校示例 [SRC-011]；核出具主体、具体岗位/期间、签发日、材料版本；无有效证明→`NEEDS_MATERIAL`；什么形式合规→`POLICY_UNCONFIRMED`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "其他录用形式证明",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M008",
    "name": "M008 · 自由职业事实及本人说明",
    "purpose": "原件材料槽字典：本人持有的服务合同、项目交付、委托确认等；必要时本人声明；`D` 事实已发生时条件；经校本认可的项目平台订单/服务确认等；F023/F028/F038；[SRC-004][SRC-014]；把项目主体、成果和发生时间绑定到本人；完全无事实→`NEEDS_MATERIAL/HUM`；声明是否必须签字→`POLICY_UNCONFIRMED`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "自由职业事实及本人说明",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M009",
    "name": "M009 · 自由职业/其他形式收入事实",
    "purpose": "原件材料槽字典：本人持有且依法提交的收入、结算、付款记录；`D/C` **仅在现行校本规定要求时**条件，不能默认强制；有权学校确认可采信的付款凭证或税务记录；F029/F038；2023 专项 [SRC-004]，外校 [SRC-011]；金额、期间、收款主体、遮盖范围和完整性；政策未证→`POLICY_UNCONFIRMED/NA`；不能以无流水直接判未就业。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "自由职业/其他形式收入事实",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M010",
    "name": "M010 · 自主创业身份与经营事实",
    "purpose": "原件材料槽字典：工商登记机关、孵化机构、交易平台及本人资料；`E` 经营事实已形成时条件；经校本认定的孵化协议、股权关系、经营交易证据；F030/F038；[SRC-014]，外校 [SRC-011]；创业主体、本人股权/管理角色、有效日期；无创业事实→`NEEDS_MATERIAL`；未注册孵化是否可采信→`POLICY_UNCONFIRMED`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "自主创业身份与经营事实",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M011",
    "name": "M011 · 升学录取/入学事实",
    "purpose": "原件材料槽字典：录取高校或境外学校出具的正式录取、入学证明；`F-1` 录取结果已产生时条件；校方认可的录取名单原始公示/正式可验录取状态；F031/F038；[SRC-014]；录取人、项目、机构、结果日期及版本；仅 offer/拟录取与正式结果不清→`NEEDS_HUMAN_DECISION`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "升学录取/入学事实",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M012",
    "name": "M012 · 未就业本人当前状态",
    "purpose": "原件材料槽字典：全国/校级平台中的本人真实未就业类别选择/说明；`F-2` 当前，**平台字段即可，不默认额外纸面证明**；经学校授权的本人状态声明；F011/F012/F032/F038；[SRC-001][SRC-014]；本人状态时点与记录版本；保留真实类别；无分类说明→补填当前字段；不得要求虚假就业证明。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "未就业本人当前状态",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M013",
    "name": "M013 · 其他特定去向决定佐证",
    "purpose": "原件材料槽字典：公招/基层项目/应征/科研助理/医学规培/国际组织/境外工作等有权机构结果；`F-3` 对应项目结果形成后条件；项目部门正式接收函、公示、入伍材料等同目的原件；F021/F023/F033/F038；[SRC-014]；项目类型与签发机关、结果是否生效、本人匹配；尚未产生→先登记真实“拟/未就业”状态；无效材料→`NEEDS_MATERIAL`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "其他特定去向决定佐证",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M014",
    "name": "M014 · 定向/委培权威关系",
    "purpose": "原件材料槽字典：学校培养/就业系统内定向单位及定向协议有效版本；`J` 当前条件，**优先官方只读**；有权研究生管理部门经确认的协议/变更回执；F007/F009/F024/F038；[SRC-001][SRC-014]；绑定培养方式与定向单位版本，不能任意改公司名；权威关系不符→`CONFLICT/HUM`；接口不可达→`SOURCE_UNAVAILABLE`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "定向/委培权威关系",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M015",
    "name": "M015 · 旧去向版本快照",
    "purpose": "原件材料槽字典：全国/校级登记系统旧记录、官方作废及变更日志；`G/H/I` 已有记录时条件，系统读取；经授权保全的历史导出/官方记录；F010/F019/F034/F038；[SRC-014]；明确快照时点和旧记录生效区间；无旧版不能判历史变更是否合法→`SOURCE_UNAVAILABLE/HUM`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "旧去向版本快照",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M016",
    "name": "M016 · 变化后的新事实证明",
    "purpose": "原件材料槽字典：新合同/单位证明/工作事实/升学材料等，按新类别引用 `M004–M014`；`G/I` **新事实形成后**条件；不强制单独制作第二份证件；已提交的同一权威材料新版本，按新目的复用；F013/F035/F038；[SRC-001][SRC-014]；新旧事实生效日，需与原版本可比较；无事实不接受“已落实新去向”；缺现行校本依据→`POLICY_UNCONFIRMED`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "变化后的新事实证明",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M017",
    "name": "M017 · 更正、撤回/作废申请理由",
    "purpose": "原件材料槽字典：毕业生在平台操作产生的申请或有权工作人员核验记录；`G/H` 请求操作当时条件，**不默认纸质申请表**；当届平台原生更正/撤回/作废事件；F015/F035/F038/F041；[SRC-014]；谁发起、何时、对应哪个旧记录及是否仍可操作；无权限/超期条件不明→`POLICY_UNCONFIRMED/HUM`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "更正、撤回/作废申请理由",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M018",
    "name": "M018 · 学校正式审核/退回记录",
    "purpose": "原件材料槽字典：官方平台校方实名审签事件及结果；`L5` **后续才产生**；首次不得前置；经学校核验的官方签章审查结论；F016/F036/F037/F038；[SRC-001][SRC-014]；决定者岗位、来源、决定对象、时间、版本；未出决定→`LATE`；失联→`SOURCE_UNAVAILABLE`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "学校正式审核/退回记录",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M019",
    "name": "M019 · 毕业生去向确认",
    "purpose": "原件材料槽字典：本人全国平台确认去向/提示有误记录；`L6` **正式审核后**才产生；受信平台本人确认回执；F017/F038；[SRC-014] 第 7 节；本人/记录/确认时点三者匹配；未进入确认阶段→`LATE`；错配→`CONFLICT`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "毕业生去向确认",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M020",
    "name": "M020 · 查询核验授权",
    "purpose": "原件材料槽字典：本人全国平台授权查询去向信息；`L7` **本人确认后**才产生；经权威平台可验的本人授权事件；F018/F038；[SRC-001][SRC-014] 第 8 节；授权对象、目的、范围、时间；无授权→不得对外查询，不作为登记未通过原因。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "查询核验授权",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M021",
    "name": "M021 · 档案/离校权威结果只读参照",
    "purpose": "原件材料槽字典：`S07-T04`/`S07-T03` 的已经形成的决定/转递状态；`L6/L8` **关联触发时**条件；不作为首次去向必交；校方档案馆/离校系统经核验的官方回执；F040/F038；[SRC-009][SRC-001]；以其独立记录 ID、版本、导出/寄送时点作关联；来源失联只提示联动风险，不阻塞就业事实预审。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "档案/离校权威结果只读参照",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M022",
    "name": "M022 · 单位或签发人真实性核验结果",
    "purpose": "原件材料槽字典：校方人工回访记录、工商/机构正式查询及有权出具方验证；`L3/L5` 需要调查时**后续/条件**；官方单位登记查询回执或签发单位确认；F022/F027/F038；[SRC-007]；核验时间、核验员、联络路径、签发内容版本；不能验真→`NEEDS_HUMAN_DECISION`；不得自动判假。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "单位或签发人真实性核验结果",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M023",
    "name": "M023 · 异议/复核/举报材料",
    "purpose": "原件材料槽字典：申请人请求、官方投诉入口与受理/处理结果；`L9` **异议发生后**条件，处理结果更晚产生；当届有权学校复核回执或平台举报编号；F036/F041/F038；[SRC-003][SRC-014] 第 7 节；区分对审核结果异议与就业违规举报的管辖/版本；复核制度不明→`POLICY_UNCONFIRMED`，不得创建虚假校级复核状态。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 20,
    "requiredElements": [
      "异议/复核/举报材料",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  }
] satisfies TemplateVersion['materialSlots']
const criteria = [
  {
    "id": "R001",
    "title": "认证申请人是否归属本案",
    "requirement": "R001 L0 全部；认证申请人是否归属本案；F001/F002/F015/F038，M001/M002，SRC-001/002；T：受信主体与学籍主键一致→PASS_FACT；错配→CONFLICT；F：NA（非本人申请路径待授权）；U：SOURCE_UNAVAILABLE；学籍身份归口。来源状态：VERIFIED。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R002",
    "title": "届别、学段、毕结业状态可否从受信源读取",
    "requirement": "R002 L0 全部；届别、学段、毕结业状态可否从受信源读取；F005–F009，M002/M014，SRC-001/008；T：记录可定位→PASS_FACT；冲突→CONFLICT；F：NA；U：SOURCE_UNAVAILABLE，特殊身份适用未证→POLICY_UNCONFIRMED；学籍/研究生培养岗。来源状态：VERIFIED。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R003",
    "title": "本人是否明确选择去向类别及对应时点",
    "requirement": "R003 L2 全部；本人是否明确选择去向类别及对应时点；F011–F014，M003，SRC-002/014；T：选择与提交版可定位→PASS_FACT；尚未选→NEEDS_MATERIAL（补字段）；F：NA；U：SOURCE_UNAVAILABLE；申请人。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R004",
    "title": "类别枚举是否属于当届平台受信配置",
    "requirement": "R004 L2–L3 全部；类别枚举是否属于当届平台受信配置；F011/F012/F042，M003，SRC-002/014/015；T：有现行枚举且匹配→PASS_FACT；不匹配→CONFLICT；F：NA；U：POLICY_UNCONFIRMED；就业归口配置岗。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R005",
    "title": "申报人与证据主体是否一致",
    "requirement": "R005 L3 有就业事实类别；申报人与证据主体是否一致；F001/F003/F021/F025–F027/F038，M002/M004–M013，SRC-001/015；T：证件主体可核一致→PASS_FACT；错配→CONFLICT；不可读→UNREADABLE；F：NA；U：NEEDS_HUMAN_DECISION；就业核验岗/签发方。来源状态：VERIFIED。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R006",
    "title": "网签状态是否来自 S07-T05 权威版本",
    "requirement": "R006 L3 A；网签状态是否来自 S07-T05 权威版本；F019/F024，M003/M004，SRC-005/014/018；T：有效版本可证→PASS_FACT；与声明冲突→CONFLICT；F：NA；U：SOURCE_UNAVAILABLE；S07-T05 状态 Owner。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R007",
    "title": "已签纸质三方补登的签署页/主体是否完整",
    "requirement": "R007 L3 A-P；已签纸质三方补登的签署页/主体是否完整；F021/F024/F027/F039，M005，SRC-005/014；T：已签且可读→PASS_FACT；缺页→UNREADABLE，未交→NEEDS_MATERIAL；F：NA；U：POLICY_UNCONFIRMED（当届允许方式未知）；本人/协议经办岗。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R008",
    "title": "合同当事人、期限、签署状态与登记一致",
    "requirement": "R008 L3 B；合同当事人、期限、签署状态与登记一致；F021/F023/F025，M006，SRC-014/015；T：事实一致→PASS_FACT；矛盾→CONFLICT；未交→NEEDS_MATERIAL；F：NA；U：NEEDS_HUMAN_DECISION；本人/单位/就业岗。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R009",
    "title": "其他录用材料能否证明实际录用而非仅意向",
    "requirement": "R009 L3 C；其他录用材料能否证明实际录用而非仅意向；F021/F026/F027，M007，SRC-014/015；T：实际任职线索一致→PASS_FACT（仅文面事实）；仅 offer→CONFLICT；无件→NEEDS_MATERIAL；F：NA；U：POLICY_UNCONFIRMED（证明形式要求）；就业岗/签发单位。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R010",
    "title": "自由职业项目/服务是否已发生",
    "requirement": "R010 L3 D；自由职业项目/服务是否已发生；F013/F028，M008，SRC-004/014/015；T：已发生且可定位→PASS_FACT；仅拟开展→CONFLICT；无证据→NEEDS_MATERIAL；F：NA；U：NEEDS_HUMAN_DECISION；本人/事实核验岗。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R011",
    "title": "收入/持续期/本人签章阈值是否有有效校本依据",
    "requirement": "R011 L3 C/D 按当届政策触发；收入/持续期/本人签章阈值是否有有效校本依据；F029/F042，M009，SRC-004/011/015；T：仅当正式参数存在时核对，不达要求交人工；F：NOT_APPLICABLE；U：POLICY_UNCONFIRMED，不凭2023专项或外校数字判错；就业政策主管岗。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R012",
    "title": "创业主体与本人经营角色是否有发生事实",
    "requirement": "R012 L3 E；创业主体与本人经营角色是否有发生事实；F013/F030，M010，SRC-014/015；T：本人和经营事实相符→PASS_FACT；仅计划书→CONFLICT；无件→NEEDS_MATERIAL；F：NA；U：POLICY_UNCONFIRMED（未注册替代形式）；本人/创业事实归口。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R013",
    "title": "录取结果是否正式且与申报人匹配",
    "requirement": "R013 L3 F-1；录取结果是否正式且与申报人匹配；F013/F031，M011，SRC-014；T：正式结果吻合→PASS_FACT；仅申请回执→CONFLICT；未交→NEEDS_MATERIAL；F：NA；U：NEEDS_HUMAN_DECISION；录取机构/就业岗。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R014",
    "title": "未就业真实状态是否被完整记录",
    "requirement": "R014 L2 F-2；未就业真实状态是否被完整记录；F011/F032，M003/M012，SRC-001/003/015；T：本人当期类别已填→PASS_FACT；漏填→NEEDS_MATERIAL（补字段而非就业证明）；F：NA；U：SOURCE_UNAVAILABLE；本人/就业岗。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R015",
    "title": "特定招录、应征等权威结果是否已产生",
    "requirement": "R015 L3 F-3；特定招录、应征等权威结果是否已产生；F013/F033，M013，SRC-014/015；T：结果与主体/时点一致→PASS_FACT；仅报名→CONFLICT；无已形成证据→NEEDS_MATERIAL；F：NA；U：POLICY_UNCONFIRMED（子类标准）；项目主管/就业岗。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R016",
    "title": "定向委培单位和培养状态是否匹配",
    "requirement": "R016 L0/L3 J；定向委培单位和培养状态是否匹配；F007–F009/F024，M002/M014，SRC-001/003/014；T：与权威定向关系一致→PASS_FACT；不符→CONFLICT；F：NA；U：SOURCE_UNAVAILABLE 或 POLICY_UNCONFIRMED（CDUT适用）；培养/定向协议归口。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R017",
    "title": "单位/签发人是否经独立核验",
    "requirement": "R017 L3 有单位证明；单位/签发人是否经独立核验；F021/F022/F027，M007/M022，SRC-007/015；T：经有权来源核实→PASS_FACT；不一致→CONFLICT；F：NA；U：NEEDS_HUMAN_DECISION；OCR 印章不得当验真；就业核验岗。来源状态：VERIFIED。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R018",
    "title": "当前材料是否可读且页码完整",
    "requirement": "R018 L3 全部有附件；当前材料是否可读且页码完整；F038/F039，M004–M017，SRC-013/015；T：目标段完整→PASS_FACT；缺页/遮挡→UNREADABLE；F：NA；U：NEEDS_HUMAN_DECISION；上传人/人工阅读岗。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R019",
    "title": "撤回或退回动作是否对应当前有效记录",
    "requirement": "R019 L4/G/H；撤回或退回动作是否对应当前有效记录；F010/F016/F019/F034/F035，M003/M015/M017，SRC-014；T：权限、状态、版本均经平台证实→PASS_FACT；旧版本冲突→CONFLICT；F：NA；U：POLICY_UNCONFIRMED（本届按钮与期限）；平台实名操作岗。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R020",
    "title": "新旧去向事实与生效日是否可分",
    "requirement": "R020 L8 G/I；新旧去向事实与生效日是否可分；F013/F019/F034/F035，M015/M016，SRC-001/014；T：时点/版本分离→PASS_FACT；旧件覆盖新事实→CONFLICT；无旧记录→SOURCE_UNAVAILABLE；F：NA；U：POLICY_UNCONFIRMED（毕业后权限）；学校就业归口。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R021",
    "title": "正式审核是否来自有权账户与原生回执",
    "requirement": "R021 L5 后续；正式审核是否来自有权账户与原生回执；F016/F036/F037，M018，SRC-001/002/014；T：双重可信→PASS_FACT（回执存在）；角色伪造→NEEDS_HUMAN_DECISION；F：尚未进入L5→NA；U：SOURCE_UNAVAILABLE/权限未知→POLICY_UNCONFIRMED；校方授权管理员。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R022",
    "title": "本人确认是否针对已核记录版本",
    "requirement": "R022 L6 后续；本人确认是否针对已核记录版本；F017/F019，M003/M019，SRC-002/014；T：版本和本人确认一致→PASS_FACT；错版→CONFLICT；F：NA；U：SOURCE_UNAVAILABLE；毕业生本人。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R023",
    "title": "对外查询授权是否包含请求范围",
    "requirement": "R023 L7 后续；对外查询授权是否包含请求范围；F018/F019，M020，SRC-001/002/014；T：授权范围/版本匹配→PASS_FACT；未授权不得披露（NEEDS_HUMAN_DECISION/拒绝查询动作）；F：NA；U：SOURCE_UNAVAILABLE；个人信息授权主管。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R024",
    "title": "异议、去向更正和违规举报是否分流",
    "requirement": "R024 L9 H；异议、去向更正和违规举报是否分流；F041，M023，SRC-003/014/017；T：诉求、受理渠道清楚→PASS_FACT（路由事实）；错送→CONFLICT；F：NA；U：POLICY_UNCONFIRMED（校本复核期限）；就业中心/监督渠道。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R025",
    "title": "档案/离校对象是否只读独立引用",
    "requirement": "R025 L6/L8 关联；档案/离校对象是否只读独立引用；F040，M021，SRC-009/018；T：引用准确→PASS_FACT；不同对象不因单位不同判错；F：NA；U：SOURCE_UNAVAILABLE（仅联动提示）；S07-T03/T04 Owner。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R026",
    "title": "新版材料是否使依赖旧版的事实结论过期",
    "requirement": "R026 L3/L8 全部；新版材料是否使依赖旧版的事实结论过期；F019/F035/F038/F039，M003/M015/M016，SRC-014/018；T：hash或官方版本变更→旧内审失效、局部重审后再给事实码；F：NA；U：NEEDS_HUMAN_DECISION；审核引擎/人工核验。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R027",
    "title": "本届类别/材料目录适用性是否有校本正式版本",
    "requirement": "R027 L0/L3 全部；本届类别/材料目录适用性是否有校本正式版本；F005/F006/F042，M002/M003，SRC-005/006/007/015；T：配置来源与届别相符→PASS_FACT（政策定位）；F：NA；U：POLICY_UNCONFIRMED；不能替代具体材料判定；就业政策配置责任人。来源状态：VERIFIED。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R028",
    "title": "本案证明是否错关联他人或其他申请版本",
    "requirement": "R028 L3 全部；本案证明是否错关联他人或其他申请版本；F001/F010/F038，M001/M003/M004–M017，SRC-001/018；T：person/case/version/hash 完全归属→PASS_FACT；串案→CONFLICT；F：NA；U：NEEDS_HUMAN_DECISION；案卷权属管理岗。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  }
] satisfies NonNullable<TemplateVersion['sections']>[number]['criteria']

export const templateVersion: TemplateVersion = {
  templateId: "S07-T06",
  version: 1,
  schemaVersion: 2,
  name: "就业去向登记、就业证明与相关变更材料审核",
  description: '本地研究模板 · 非校方正式模板。政策证据状态：PARTIAL。用于事实核验、材料覆盖检查与人工复核，不得自动形成学校正式批准或拒绝。',
  catalogKind: 'builtin',
  sourceNote: 'R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板由研究原件转为本地草稿，非成都理工大学正式模板；SRC 仅是研究来源索引，不是案卷材料 SourceRef；无 PolicyVersion 绑定，不执行学校远端回写。',
  objectType: 'person',
  displayName: { template: "{{F003}} · S07-T06" },
  fields: fieldDefinitions,
  materialSlots: materialSlotDefinitions,
  sections: [{ id: 'rules', name: '原件规则核验项', description: '逐项对应研究原件第08节规则 ID；研究标准不等于校方正式政策，政策与权限未确认时必须人工复核。', order: 0, required: true, criteria }],
  policyVersionIds: [],
  stages: [
    { id: 'intake', name: "L0 识别/路由与权威身份核验", kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'evidence-review', workflowOwner: 'local' },
    { id: 'evidence-review', name: "L1/L2 事实形成、本人填报/补登", kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'policy-confirmation', returnToStageId: 'intake', workflowOwner: 'local' },
    { id: 'policy-confirmation', name: "L3/L4/L5 事实预审、退回补正与学校有效审核（仅记录权威回执）", kind: 'manual-review', executorRole: 'teacher', nextStageId: 'local-review', returnToStageId: 'evidence-review', workflowOwner: 'local' },
    { id: 'local-review', name: "L6/L7 本人去向确认与查询核验授权（本人/授权事实）", kind: 'manual-review', executorRole: 'teacher', nextStageId: 'local-summary', returnToStageId: 'policy-confirmation', workflowOwner: 'local' },
    { id: 'local-summary', name: "L8/L9 去向变更、作废、异议/复核路由（不改写外部系统）", kind: 'finalize', executorRole: 'teacher', workflowOwner: 'local' }
  ],
  outputs: [{ id: 'fact-review-feedback', kind: 'item-feedback', audience: 'reviewer' }, { id: 'supplement-and-confirmation-todo', kind: 'supplement-list', audience: 'teacher' }],
  autoPassPolicy: { enabled: false },
  status: 'draft',
  createdAt: '2026-10-24T03:12:00+08:00'
}

export const r02Metadata: R02Metadata = {
  templateId: "S07-T06",
  name: "就业去向登记、就业证明与相关变更材料审核",
  sourceDocumentPath: "docs/design/review-agent/business-templates/R02/S07-T06.md",
  sourceDocumentSha256: "8ef8be7b15754c37d3aef2e4e739414e092a885269ae2932fcc8a738d563f9ff",
  researchOriginalPath: "docs/design/review-agent/business-templates/R02/research-original/S07-T06.md",
  researchOriginalSha256: "56a87abdd730022f5ff1b7a8494f446904d14f4f9f7bc6433d292caa93e1893f",
  officialSchoolTemplate: false,
  researchDate: '2026-10-24',
  policyEvidenceStatus: 'PARTIAL',
  sourceStatus: {
  "SRC-001": "VERIFIED",
  "SRC-002": "VERIFIED",
  "SRC-003": "PARTIAL",
  "SRC-004": "PARTIAL",
  "SRC-005": "VERIFIED",
  "SRC-006": "VERIFIED",
  "SRC-007": "VERIFIED",
  "SRC-008": "VERIFIED",
  "SRC-009": "HISTORICAL",
  "SRC-010": "HISTORICAL",
  "SRC-011": "CROSS_SCHOOL_ONLY",
  "SRC-012": "CROSS_SCHOOL_ONLY",
  "SRC-013": "UNCONFIRMED",
  "SRC-014": "PARTIAL",
  "SRC-015": "VERIFIED",
  "SRC-016": "VERIFIED",
  "SRC-017": "HISTORICAL",
  "SRC-018": "PARTIAL"
},
  criteria: [
  {
    "sectionId": "rules",
    "criterionId": "R001",
    "sourceIds": [
      "SRC-001",
      "SRC-002"
    ],
    "evidenceStatus": "VERIFIED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R002",
    "sourceIds": [
      "SRC-001",
      "SRC-008"
    ],
    "evidenceStatus": "VERIFIED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R003",
    "sourceIds": [
      "SRC-002",
      "SRC-014"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R004",
    "sourceIds": [
      "SRC-002",
      "SRC-014",
      "SRC-015"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R005",
    "sourceIds": [
      "SRC-001",
      "SRC-015"
    ],
    "evidenceStatus": "VERIFIED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R006",
    "sourceIds": [
      "SRC-005",
      "SRC-014",
      "SRC-018"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R007",
    "sourceIds": [
      "SRC-005",
      "SRC-014"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R008",
    "sourceIds": [
      "SRC-014",
      "SRC-015"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R009",
    "sourceIds": [
      "SRC-014",
      "SRC-015"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R010",
    "sourceIds": [
      "SRC-004",
      "SRC-014",
      "SRC-015"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R011",
    "sourceIds": [
      "SRC-004",
      "SRC-011",
      "SRC-015"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R012",
    "sourceIds": [
      "SRC-014",
      "SRC-015"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R013",
    "sourceIds": [
      "SRC-014"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R014",
    "sourceIds": [
      "SRC-001",
      "SRC-003",
      "SRC-015"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R015",
    "sourceIds": [
      "SRC-014",
      "SRC-015"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R016",
    "sourceIds": [
      "SRC-001",
      "SRC-003",
      "SRC-014"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R017",
    "sourceIds": [
      "SRC-007",
      "SRC-015"
    ],
    "evidenceStatus": "VERIFIED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R018",
    "sourceIds": [
      "SRC-013",
      "SRC-015"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R019",
    "sourceIds": [
      "SRC-014"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R020",
    "sourceIds": [
      "SRC-001",
      "SRC-014"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R021",
    "sourceIds": [
      "SRC-001",
      "SRC-002",
      "SRC-014"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R022",
    "sourceIds": [
      "SRC-002",
      "SRC-014"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R023",
    "sourceIds": [
      "SRC-001",
      "SRC-002",
      "SRC-014"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R024",
    "sourceIds": [
      "SRC-003",
      "SRC-014",
      "SRC-017"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R025",
    "sourceIds": [
      "SRC-009",
      "SRC-018"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R026",
    "sourceIds": [
      "SRC-014",
      "SRC-018"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R027",
    "sourceIds": [
      "SRC-005",
      "SRC-006",
      "SRC-007",
      "SRC-015"
    ],
    "evidenceStatus": "VERIFIED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R028",
    "sourceIds": [
      "SRC-001",
      "SRC-018"
    ],
    "evidenceStatus": "PARTIAL"
  }
],
  externalPolicyReferences: [
  {
    "id": "EXT-POLICY-001",
    "title": "教育部办公厅关于建立高校毕业生毕业去向登记制度的通知",
    "documentNo": "教学厅〔2023〕5号",
    "publishedAt": "2023-06-21",
    "url": "https://www.moe.gov.cn/srcsite/A15/s3265/202306/t20230621_1065229.html",
    "evidenceStatus": "VERIFIED",
    "scope": "全国去向自主登记、审核、离校确认与本人授权核验；不替代校本材料门槛"
  }
]
}
