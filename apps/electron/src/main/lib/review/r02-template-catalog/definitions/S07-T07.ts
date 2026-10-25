import type { TemplateVersion } from '@profer/shared'
export type { TemplateVersion } from '@profer/shared'

export type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED' | 'HISTORICAL' | 'CROSS_SCHOOL_ONLY'
export type R02PolicyEvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
export interface R02CriterionMetadata { sectionId: string; criterionId: string; sourceIds: string[]; evidenceStatus: R02EvidenceStatus }
export interface R02Metadata { templateId: string; name: string; sourceDocumentPath: string; sourceDocumentSha256: string; researchOriginalPath: string; researchOriginalSha256: string; officialSchoolTemplate: false; researchDate: string; policyEvidenceStatus: R02PolicyEvidenceStatus; sourceStatus: Record<string, R02EvidenceStatus>; criteria: R02CriterionMetadata[]; externalPolicyReferences: Array<{id:string;title:string;documentNo:string;publishedAt:string;url:string;evidenceStatus:R02EvidenceStatus;scope:string}> }

const fieldDefinitions = [
  {
    "key": "F001",
    "label": "F001 · 年度批次 ID string；ReviewBatch",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F001；年度批次 ID `string`；ReviewBatch；C；省级当期通知，SRC-006/007/013；M001 公告文号/批次；低；未定位年度不选默认值，`POLICY_UNCONFIRMED`。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F002",
    "label": "F002 · 年度政策版本及生效窗口 ref；ReviewBatch",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F002；年度政策版本及生效窗口 `ref`；ReviewBatch；C；正式原件及附件 SRC-005/007；M001 源文件页/哈希；低；失联 `SOURCE_UNAVAILABLE`，不得沿用上一年度自动放行。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F003",
    "label": "F003 · 申请人认证主体引用 ref；ApplicantIdentity",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F003；申请人认证主体引用 `ref`；ApplicantIdentity；C；省平台可信会话/学校核对机制（实现待查）；M002 认证记录而非可编辑字段；高；不能认证则 `NEEDS_HUMAN_DECISION`，不接受 Renderer Actor。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F004",
    "label": "F004 · 法定姓名 string；ApplicantIdentity",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F004；法定姓名 `string`；ApplicantIdentity；A/C；学籍权威记录与身份证明校核 SRC-001/012；M002/M003/M004 姓名区域；高；不同名 `CONFLICT`，先查更名记录。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F005",
    "label": "F005 · 身份号码 string；ApplicantIdentity",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F005；身份号码 `string`；ApplicantIdentity；C；认证身份/校方权威身份档 SRC-012；M002/M004 身份字段；高；不一致须人工核身；对外脱敏。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F006",
    "label": "F006 · 本人联系方式 string；ApplicantIdentity",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F006；本人联系方式 `string`；ApplicantIdentity；C；本人申请表（待核验）SRC-012；M004 申请表电话；高；`NEEDS_MATERIAL`，不据电话倒推身份。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F007",
    "label": "F007 · 毕业院校/校区权威 ID ref；GraduationQualification",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F007；毕业院校/校区权威 ID `ref`；GraduationQualification；A/E；CDUT 学籍/SRC-001、SRC-006；M003 学校记录、M018 校审；中；单凭自由填写院校名不算权威；校本身份待核。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F008",
    "label": "F008 · 毕业年月/日期 date；GraduationQualification",
    "kind": "date",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F008；毕业年月/日期 `date`；GraduationQualification；A/E；CDUT 教务/研究生校档 SRC-001/006；M003 毕业记录；中；缺失待学籍核对，不硬套当期届别。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F009",
    "label": "F009 · 最后学历层次 enum；GraduationQualification",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F009；最后学历层次 `enum`；GraduationQualification；A/E；CDUT 学籍权威 SRC-001/006；M003/M018；中；学历层次不明 `NEEDS_HUMAN_DECISION`。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F010",
    "label": "F010 · 是否全日制普通高等教育 bool?；GraduationQualification",
    "kind": "boolean",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F010；是否全日制普通高等教育 `bool?`；GraduationQualification；E；学校学籍/省审核要求 SRC-006；M003/M018；中；`unknown` 不当作否。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F011",
    "label": "F011 · 最后学历实际学制年数 number；GraduationQualification",
    "kind": "number",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F011；最后学历实际学制年数 `number`；GraduationQualification；E；教务/研究生管理权威 SRC-001/006/012；M003/M018；中；连读路径冲突需学校确认。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F012",
    "label": "F012 · 专升本/连读/第二学士路径 enum + ref；GraduationQualification",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F012；专升本/连读/第二学士路径 `enum + ref`；GraduationQualification；E；历史学籍阶段和修读关系 SRC-001/006/012；M003 学段映射；中；不从学历证书单字段自行推导，人工核定。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F013",
    "label": "F013 · 首次实际就业日期 date；EmploymentSegment",
    "kind": "date",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F013；首次实际就业日期 `date`；EmploymentSegment；B/C；录聘文件/合同及单位证明 SRC-006/012；M005/M007；中；合同日期≠实际到岗日则 `CONFLICT`。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F014",
    "label": "F014 · 就业分段 ID、顺序 array<object>；EmploymentSegment",
    "kind": "rows",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F014；就业分段 ID、顺序 `array<object>`；EmploymentSegment；B/C；每一单位任职履历及证明 SRC-001/006/012；M005/M007/M009；中；漏段 `NEEDS_MATERIAL`；不可自动拼接断档。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F015",
    "label": "F015 · 单位法人全称及权威标识 string + ref；EmploymentSegment",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F015；单位法人全称及权威标识 `string + ref`；EmploymentSegment；B/C；录聘单位/法人登记 SRC-006/012；M005/M011；中；简称重名需查法人，不靠 OCR 模糊匹配。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F016",
    "label": "F016 · 单位性质/国有出资结构 enum + ref；EmploymentSegment",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F016；单位性质/国有出资结构 `enum + ref`；EmploymentSegment；C/F；单位档案/国资会商 SRC-006/012；M011/M019；中；国企属性未确认转县级有权核验。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F017",
    "label": "F017 · 行业、岗位项目类型 enum；EmploymentSegment",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F017；行业、岗位项目类型 `enum`；EmploymentSegment；C/F；用人单位、人社/项目权威记录 SRC-001/006/012；M005/M008/M011；中；排除行业由有权部门核定，机器仅提示。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F018",
    "label": "F018 · 就业所属市州/县/乡镇 ref；EmploymentSegment",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F018；就业所属市州/县/乡镇 `ref`；EmploymentSegment；B/F；单位地址+省当期地区名单 SRC-006/007；M005/M010/M001；中；未获当期县名单 `POLICY_UNCONFIRMED`。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F019",
    "label": "F019 · 实际工作现场地址 string；EmploymentSegment",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F019；实际工作现场地址 `string`；EmploymentSegment；B/F；单位正式证明/上级主管核实 SRC-006/012；M007/M010；中；注册地址≠现场，需补工作地证明。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F020",
    "label": "F020 · 实际工作岗位 string；EmploymentSegment",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F020；实际工作岗位 `string`；EmploymentSegment；B/F；单位人事/年度考核 SRC-001/006；M005/M006/M007；中；与录聘不符 `CONFLICT`。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F021",
    "label": "F021 · 分段开始/结束时间 date pair；EmploymentSegment",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F021；分段开始/结束时间 `date pair`；EmploymentSegment；B/F；录聘/调动、单位证明 SRC-001/006；M005/M007/M009；中；空档/交叠与考核不符须列问题。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F022",
    "label": "F022 · 正常调动、借调/借用类型 enum + ref；EmploymentSegment",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F022；正常调动、借调/借用类型 `enum + ref`；EmploymentSegment；B/F；正式调动/借调文书 SRC-001/006；M009；中；未见正式性质不可自作“正常调动”。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F023",
    "label": "F023 · 按年考核期间/等次 array<object>；ServiceAssessment",
    "kind": "rows",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F023；按年考核期间/等次 `array<object>`；ServiceAssessment；B（逐年产生）/D；用人单位年度考核源 SRC-001/006/012；M006 每年度页/印章；中；尚未产生不算缺件；满三年时缺证 `NEEDS_MATERIAL`。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F024",
    "label": "F024 · 证明人身份/职务 string + ref；EmploymentSegment",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F024；证明人身份/职务 `string + ref`；EmploymentSegment；D；单位主要负责人/人事负责人 SRC-006/012；M007 签章栏及人事授权；中；不是可信主体则 `NEEDS_HUMAN_DECISION`。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F025",
    "label": "F025 · 手写签名/单位公章状态与日期 enum + date；EmploymentSegment",
    "kind": "date",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F025；手写签名/单位公章状态与日期 `enum + date`；EmploymentSegment；D；原件视觉与单位验证 SRC-006/012；M004/M007 盖章区域；中；OCR 不能鉴真；不清为 `UNREADABLE`。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F026",
    "label": "F026 · 区划变更批复文号/生效日 ref + date；EmploymentSegment",
    "kind": "date",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F026；区划变更批复文号/生效日 `ref + date`；EmploymentSegment；B/C（条件）；县级以上人民政府文件 SRC-006；M012 批复条文；低/中；非城关变城关的例外无批复须人工核。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F027",
    "label": "F027 · 最后学历各学年应缴学费 array<money>；TuitionAndAidHistory",
    "kind": "rows",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F027；最后学历各学年应缴学费 `array<money>`；TuitionAndAidHistory；E；CDUT 计划财务 SRC-001/006/012；M013 校方账本；高；不让申请人金额替代校账。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F028",
    "label": "F028 · 各学年实缴学费 array<money>；TuitionAndAidHistory",
    "kind": "rows",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F028；各学年实缴学费 `array<money>`；TuitionAndAidHistory；E；CDUT 财务结算 SRC-001/006/012；M013 付款记账；高；对账失败 `CONFLICT`/`SOURCE_UNAVAILABLE`。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F029",
    "label": "F029 · 各学年减免及减免原因 array<object>；TuitionAndAidHistory",
    "kind": "rows",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F029；各学年减免及减免原因 `array<object>`；TuitionAndAidHistory；E；CDUT 资助及财务决定 SRC-002/006/012；M014 生效资助版本；高；无证不能简单置零；查是否全额免学费。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F030",
    "label": "F030 · 各学年欠缴及补缴状态 array<money + enum>；TuitionAndAidHistory",
    "kind": "rows",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F030；各学年欠缴及补缴状态 `array<money + enum>`；TuitionAndAidHistory；E；CDUT 财务 SRC-001/002/006；M013 欠费台账；高；新旧冲突触发人工，不按 2018 拒绝。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F031",
    "label": "F031 · 国家助学贷款类别/经办银行 enum + ref；TuitionAndAidHistory",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F031；国家助学贷款类别/经办银行 `enum + ref`；TuitionAndAidHistory；E/H；校园地 CDUT/生源地经办机构 SRC-006/012；M015 合同与银行记录；高；不能判定时不执行代偿路径。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F032",
    "label": "F032 · 贷款本金、利息及已偿数 money tuple；TuitionAndAidHistory",
    "kind": "date",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F032；贷款本金、利息及已偿数 `money tuple`；TuitionAndAidHistory；E/H；银行/经办机构与高校核对 SRC-012；M015 金额及日期；高；申请人上传余额截图仅线索，差异转银行。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F033",
    "label": "F033 · 指定核对时点未结清余额 money + date；TuitionAndAidHistory",
    "kind": "date",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F033；指定核对时点未结清余额 `money + date`；TuitionAndAidHistory；E/H；经办银行/资助中心 SRC-006；M015 余额证明；高；历史金额不能当实时余额。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F034",
    "label": "F034 · 历史学费/贷款/入伍/退役资助结果 array<ref>；TuitionAndAidHistory",
    "kind": "rows",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F034；历史学费/贷款/入伍/退役资助结果 `array<ref>`；TuitionAndAidHistory；E；CDUT 权威资助决定/S03 引用 SRC-001/006；M014/M016/M017；高；结果缺失 `SOURCE_UNAVAILABLE`，不能用声明“未享”放行。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F035",
    "label": "F035 · 省平台申请号、提交时间与状态 ref + datetime + enum；ApplicationSubmission",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F035；省平台申请号、提交时间与状态 `ref + datetime + enum`；ApplicationSubmission；D；四川学生资助在线系统 SRC-006；M004 系统受理回执；中；本地草稿 ID 不冒充外部申请号。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F036",
    "label": "F036 · 本人手写签字与承诺状态 enum + date；ApplicationSubmission",
    "kind": "date",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F036；本人手写签字与承诺状态 `enum + date`；ApplicationSubmission；D；省平台表单/本人签字 SRC-006/012；M004 签字区；中；缺签名 `NEEDS_MATERIAL`，电子登录不替代规定手写。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F037",
    "label": "F037 · 高校事实审核版本、经办主体和时间 ref；AuthorityReview",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F037；高校事实审核版本、经办主体和时间 `ref`；AuthorityReview；E 后；学校真实授权校审 SRC-001/004/006；M018 审核记载表；高；学校未审不能造 `PASS_FACT`；关联事实版本。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F038",
    "label": "F038 · 县级审核/会商意见与版本 ref；AuthorityReview",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F038；县级审核/会商意见与版本 `ref`；AuthorityReview；F 后；县教育及人社/国资会商 SRC-006；M019 审核结果；中；不可由学校或 AI 代签。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F039",
    "label": "F039 · 公示编号、起止、异议及处置 ref + date range；AuthorityReview",
    "kind": "date",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F039；公示编号、起止、异议及处置 `ref + date range`；AuthorityReview；F 后；县级教育部门公示 SRC-006/010；M020 脱敏公示记录；中；无公示结果不可推断“无异议”。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F040",
    "label": "F040 · 市州终审结论引用 ref；AuthorityReview",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F040；市州终审结论引用 `ref`；AuthorityReview；G 后；市州学生资助/教育局 SRC-006；M021 有效终审文件；中；`PASS_FACT` 不可替代终审。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F041",
    "label": "F041 · 省级结算/拨款结果引用 ref；AuthorityReview",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F041；省级结算/拨款结果引用 `ref`；AuthorityReview；G/H 后；省学生资助中心/财政 SRC-006；M022 正式结算凭据；高；未收到资金不作到账声称。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F042",
    "label": "F042 · 银行销账/社保卡支付回执 ref + money + datetime；FundingExecution",
    "kind": "number",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F042；银行销账/社保卡支付回执 `ref + money + datetime`；FundingExecution；H 后；经办银行/县中心/高校 SRC-006；M023 回执及书面告知；高；未回执为“未证实履行”，不能倒写资格失败。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F043",
    "label": "F043 · copyCertification[]: {materialId, segmentId, pages, certifiedText, clerkName, employerSeal, issuedAt, verification}",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：**F043**；`copyCertification[]: {materialId, segmentId, pages, certifiedText, clerkName, employerSeal, issuedAt, verification}`；`SubmissionEvidence`，D/申请上传复印件时按原件实例触发；就业单位出具“复印属实”、经办人署名、单位公章；`M024`对应被认证的`M003/M005/M006/M008/M009/M011`等实际复印件；SRC-014附件3备注5；中/含个人资料时高；不能从Word容器其他页继承章；缺认证依R032 `NEEDS_MATERIAL`，章/字不可读`UNREADABLE`，真伪存疑人审。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F044",
    "label": "F044 · workSiteJointProof: {segmentId, employerOrg, supervisingOrg, exactWorksite, bothSignaturesOrSeals, issuedAt}；Employ",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：**F044**；`workSiteJointProof: {segmentId, employerOrg, supervisingOrg, exactWorksite, bothSignaturesOrSeals, issuedAt}`；`EmploymentSegment`，D/F，录聘/合同/协议无具体工作地时触发；就业单位**与其上一级主管部门共同出具**的书面地点证明`M010`；SRC-014附件3备注2；中/含岗位地址时高；只有一个单位意见不视为具备双单位证明；缺任一有权出具人`NEEDS_MATERIAL`，上下级关系未知县级`NEEDS_HUMAN_DECISION`。。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  }
] satisfies TemplateVersion['fields']
const materialSlotDefinitions = [
  {
    "id": "M001",
    "name": "M001 · 当期政策、受助学校和地区名单、申请窗口；省教育厅/财政厅正式公告与附件",
    "purpose": "原件材料槽字典：当期政策、受助学校和地区名单、申请窗口；省教育厅/财政厅正式公告与附件；C 现必（由研究者/系统配置，不是学生上传）；官方原件为准；F001/F002/F018；SRC-005/006/007/013；`policy@batch-version`，绑定 ReviewBatch；原件失联 `SOURCE_UNAVAILABLE`；年份不明 `POLICY_UNCONFIRMED`；扫描不清须重新取件。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "当期政策、受助学校和地区名单、申请窗口；省教育厅/财政厅正式公告与附件",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M002",
    "name": "M002 · 申请人本人身份/与学籍关联；省申报认证或校方有权身份记录",
    "purpose": "原件材料槽字典：申请人本人身份/与学籍关联；省申报认证或校方有权身份记录；C 现必的**可信身份引用**，不预设身份证复印件必须上传；原系统实名认证+学校校档；F003—F005；SRC-001/012；`identity@issuer-version` 属 ApplicantIdentity；无可信认证人工核身；身份证扫描不清 `UNREADABLE`，禁止仅 OCR 冒认。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "申请人本人身份/与学籍关联；省申报认证或校方有权身份记录",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M003",
    "name": "M003 · 最后学历、毕业年度、实际学制/路径；教务/研究生学籍权威记录或毕业证",
    "purpose": "原件材料槽字典：最后学历、毕业年度、实际学制/路径；教务/研究生学籍权威记录或毕业证；A 已存在，D 申请材料按当批清单；E 内部核验必；真实校方授权查得的学籍记录可避免重复上传；F004/F007—F012；SRC-001/006/012；`graduation@sourceVersion` 属 GraduationQualification；学历冲突 `CONFLICT`；不能取校档 `SOURCE_UNAVAILABLE`；证书扫描不清 `UNREADABLE`。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "最后学历、毕业年度、实际学制/路径；教务/研究生学籍权威记录或毕业证",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M004",
    "name": "M004 · 年度申请人承诺、本人签字及正式提交；省平台生成申请表/受理回执",
    "purpose": "原件材料槽字典：年度申请人承诺、本人签字及正式提交；省平台生成申请表/受理回执；D **现必**，A/B/C 预审前不需要已签完表；不能用自拟表格替代系统打印与手写签字；F004—F006/F013—F025/F035/F036；SRC-001/006/012；`application@submission-version` 属 ApplicationSubmission；未提交状态只留草稿；缺手写签名 `NEEDS_MATERIAL`；扫描不清 `UNREADABLE`。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "年度申请人承诺、本人签字及正式提交；省平台生成申请表/受理回执",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M005",
    "name": "M005 · 录聘/劳动关系及初次到岗时间；用人单位、人社录聘机关出具文件、合同",
    "purpose": "原件材料槽字典：录聘/劳动关系及初次到岗时间；用人单位、人社录聘机关出具文件、合同；B 已有，D **现必**；每段就业各一份；2025 正式清单对部分无录聘的机关/项目允许人社书面证明；2026 替代资格待核。F013—F022；SRC-006/012/013；`employmentSegment[n]@issuer-version`；缺关系凭据 `NEEDS_MATERIAL`；模糊仅 `UNREADABLE`，不能把模糊日期按推测补齐。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "录聘/劳动关系及初次到岗时间；用人单位、人社录聘机关出具文件、合同",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M006",
    "name": "M006 · 三年内逐年度任职考核及服务时长；用人单位/有权考核机构正式考核表",
    "purpose": "原件材料槽字典：三年内逐年度任职考核及服务时长；用人单位/有权考核机构正式考核表；B 逐年形成，D 满三年时 **现必**；经有权单位确认的其他年度考核材料可替代（2025 清单）；F020/F021/F023；SRC-001/006/012；`assessment[segment,year]@version`；未来年度未产生时 `NOT_APPLICABLE`；正式申请时缺周期 `NEEDS_MATERIAL`，不清 `UNREADABLE`。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "三年内逐年度任职考核及服务时长；用人单位/有权考核机构正式考核表",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M007",
    "name": "M007 · 就业单位对具体地点、岗位、时段、考核、证明人的正式意见与公章",
    "purpose": "原件材料槽字典：就业单位对具体地点、岗位、时段、考核、证明人的正式意见与公章；D **现必**；正常调动则每个有权单位均需；2026 省文明确负责人或人事负责人亲笔签名、单位盖章，不得代签；F019—F025；SRC-001/006/012；`unitOpinion[segment]@signedVersion`；缺章/无签字 `NEEDS_MATERIAL`；签章真伪或权限争议 `NEEDS_HUMAN_DECISION`。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "就业单位对具体地点、岗位、时段、考核、证明人的正式意见与公章",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M008",
    "name": "M008 · 特岗、“一村一大”“三支一扶”或西部计划身份及服务；项目主管部门服务协议/项目证",
    "purpose": "原件材料槽字典：特岗、“一村一大”“三支一扶”或西部计划身份及服务；项目主管部门服务协议/项目证；SC06/SC07 条件必；普通机关/国企 `NOT_APPLICABLE`；西部志愿者 2025 清单用志愿服务证及服务协议；其它项目无录聘书的替代须按 2026 确认；F017/F021—F023；SRC-001/006/012/013；`programService@issuer-version`；无服务证明 `NEEDS_MATERIAL`，项目真实性争议送主管部门。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "特岗、“一村一大”“三支一扶”或西部计划身份及服务；项目主管部门服务协议/项目证",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M009",
    "name": "M009 · 正常调动、借调、借用的法律/人事关系与连续性；原单位及新单位/人社文书",
    "purpose": "原件材料槽字典：正常调动、借调、借用的法律/人事关系与连续性；原单位及新单位/人社文书；SC08 条件必；无调动 `NOT_APPLICABLE`；每段录聘、正式调动文件及双方/多方单位意见；F014/F021/F022；SRC-001/006/012；`mobility[segment]@version`；缺段 `NEEDS_MATERIAL`；不同调令冲突 `CONFLICT`；签发权限不明人工核定。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "正常调动、借调、借用的法律/人事关系与连续性；原单位及新单位/人社文书",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M010",
    "name": "M010 · 实际工作现场处于县以下/乡镇且与法定注册地址不同的事实；工作单位及上级主管单位意见",
    "purpose": "原件材料槽字典：实际工作现场处于县以下/乡镇且与法定注册地址不同的事实；工作单位及上级主管单位意见；SC05/08/09、地点不清时条件必；**2026附件3备注2**要求单位和上级主管部门共同书面说明具体工作地；F018/F019/F044；SRC-013/014；R033；`worksite[segment]@effectiveVersion`；少一方证明`NEEDS_MATERIAL`，双方矛盾`CONFLICT`，真伪/区划仍`NEEDS_HUMAN_DECISION`。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "实际工作现场处于县以下/乡镇且与法定注册地址不同的事实；工作单位及上级主管单位意见",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M011",
    "name": "M011 · 国有企业出资结构与合法法人/行业范围；工商登记、章程及国资确认",
    "purpose": "原件材料槽字典：国有企业出资结构与合法法人/行业范围；工商登记、章程及国资确认；SC05 条件必；**2026附件3国企栏**已列章程出资主体/比例页、企业法人营业执照、税务登记证；F015—F017；SRC-013/014；R010/R032；`employerLegal@registrationVersion`；只有企业名称不够；出资证据缺`NEEDS_MATERIAL`，性质争议县级人社/国资会商。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "国有企业出资结构与合法法人/行业范围；工商登记、章程及国资确认",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M012",
    "name": "M012 · 工作地行政区划、城关镇变更生效时间；县级以上政府批复文件",
    "purpose": "原件材料槽字典：工作地行政区划、城关镇变更生效时间；县级以上政府批复文件；SC09 条件必；政府批复原件或公开政府公报，不用商业地图截图代替；F018/F019/F026；SRC-002/006；`adminBoundary@effectiveDate`；找不到批复 `SOURCE_UNAVAILABLE`/`NEEDS_HUMAN_DECISION`，日期不清 `UNREADABLE`。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "工作地行政区划、城关镇变更生效时间；县级以上政府批复文件",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M013",
    "name": "M013 · 各学年应缴、实缴、欠缴及补缴情形；CDUT 计划财务账本",
    "purpose": "原件材料槽字典：各学年应缴、实缴、欠缴及补缴情形；CDUT 计划财务账本；E 内部事实**现必**；原则上不要求学生重复上传；需经真实校方授权获取；无接口时可走有权工作人员人工核账，不是学生自制汇总；F027/F028/F030；SRC-001/002/006/012；`tuitionLedger@financialVersion` 属 TuitionAndAidHistory；校账不可达 `SOURCE_UNAVAILABLE`，多版本冲突 `CONFLICT`。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 100,
    "requiredElements": [
      "各学年应缴、实缴、欠缴及补缴情形；CDUT 计划财务账本",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M014",
    "name": "M014 · 学费减免、全部免学费、已发其它学费补偿事实；CDUT 资助/财务有效记录",
    "purpose": "原件材料槽字典：学费减免、全部免学费、已发其它学费补偿事实；CDUT 资助/财务有效记录；E 内部事实现必，存在历史资助时条件深入核实；复用 S03 有效资助决定版本；F029/F034；SRC-001/002/006/012；`aidDecision@effectiveVersion`；不得凭“未提供减免单”推定未享受；无法查源 `SOURCE_UNAVAILABLE`。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "学费减免、全部免学费、已发其它学费补偿事实；CDUT 资助/财务有效记录",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M015",
    "name": "M015 · 校园地/生源地贷款合同、放款、余额及经办银行；贷款经办机构、CDUT 有权数据",
    "purpose": "原件材料槽字典：校园地/生源地贷款合同、放款、余额及经办银行；贷款经办机构、CDUT 有权数据；E 如有贷款条件必；H 以最新余额再核一次；银行/国家助学贷款经办系统的可信回执优先于申请人截图；F031—F033；SRC-001/006/012；`loanAccount@asOf/version` 属 TuitionAndAidHistory；余额时点不一致 `CONFLICT`，源失联 `SOURCE_UNAVAILABLE`，禁用旧截图当实时数。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "校园地/生源地贷款合同、放款、余额及经办银行；贷款经办机构、CDUT 有权数据",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M016",
    "name": "M016 · 入伍学费补偿、贷款代偿、退役学费减免是否已享；学校资助主管权威决定",
    "purpose": "原件材料槽字典：入伍学费补偿、贷款代偿、退役学费减免是否已享；学校资助主管权威决定；E 内部核验现必；确有记录则条件深入调查；引用 S03-T12 有效决定及撤销/追回版本，不要求申请人自证“从未享受”；F034；SRC-001/002/006；`militaryAidDecision@version`；源失联 `SOURCE_UNAVAILABLE`；结果冲突 `CONFLICT`，不直接判学校批准/驳回。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "入伍学费补偿、贷款代偿、退役学费减免是否已享；学校资助主管权威决定",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M017",
    "name": "M017 · 旧年符合条件未办成的原因、已否获批/发放；省平台历史申请/市县记录",
    "purpose": "原件材料槽字典：旧年符合条件未办成的原因、已否获批/发放；省平台历史申请/市县记录；SC10 条件必；真实历史申报及发放查询优先，可由申请人提供受理单作线索；F001/F002/F034/F035；SRC-002/006；`historicalApplication@version`；不能核未办成原因/是否已付款则 `NEEDS_HUMAN_DECISION`。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "旧年符合条件未办成的原因、已否获批/发放；省平台历史申请/市县记录",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M018",
    "name": "M018 · 本校学籍/学费/贷款/资助的系统审核结果；CDUT 授权工作人员",
    "purpose": "原件材料槽字典：本校学籍/学费/贷款/资助的系统审核结果；CDUT 授权工作人员；E **后置，此阶段生成**；校方经有权人员签审的审核记载表/可信系统回执；F007—F012/F027—F037；SRC-001/004/006/012；`schoolVerification@actor+caseVersion`；不存在时是尚待校审；不让本人签字或 AI 输出代替。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "本校学籍/学费/贷款/资助的系统审核结果；CDUT 授权工作人员",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M019",
    "name": "M019 · 县级审核、与人社/国资会商、实地核查意见；就业地县教育部门",
    "purpose": "原件材料槽字典：县级审核、与人社/国资会商、实地核查意见；就业地县教育部门；F **后置，此阶段生成**；县级真实审核记录，必要时附会商文书；F016—F026/F038；SRC-002/006；`countyReview@decisionVersion`；县未审为未产生，未受理不可说“审查不通过”；结果失联 `SOURCE_UNAVAILABLE`。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "县级审核、与人社/国资会商、实地核查意见；就业地县教育部门",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M020",
    "name": "M020 · 县级公示、异议及处理情况；县级教育部门正式公示/处置记录",
    "purpose": "原件材料槽字典：县级公示、异议及处理情况；县级教育部门正式公示/处置记录；F **后置，此阶段生成**；官方脱敏公示与行政异议结果，公开名单不等于终审；F039；SRC-006/010；`publicNotice@publicationVersion`；公示缺失不自动假定无异议；敏感信息仅脱敏访问。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "县级公示、异议及处理情况；县级教育部门正式公示/处置记录",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M021",
    "name": "M021 · 市州终审汇总的有效结论；市州资助管理中心/教育局",
    "purpose": "原件材料槽字典：市州终审汇总的有效结论；市州资助管理中心/教育局；G **后置，此阶段生成**；真实终审编号/签章或外部可信结果引用；F040；SRC-006；`municipalFinal@decisionVersion`；不可从学校和县级通过推导最终批准；未取得为待终审/待核。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "市州终审汇总的有效结论；市州资助管理中心/教育局",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M022",
    "name": "M022 · 省级结算/拨款决定；省学生资助中心、教育/财政部门",
    "purpose": "原件材料槽字典：省级结算/拨款决定；省学生资助中心、教育/财政部门；G/H **后置，此阶段生成**；省级正式结算/下达资金凭据；F041；SRC-006；`provinceSettlement@version`；失联不等于资金尚未结算；不得自行记“已付”。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "省级结算/拨款决定；省学生资助中心、教育/财政部门",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M023",
    "name": "M023 · 银行核减余额、贷款代偿或社保卡“一卡通”支付回执及告知；有权高校、县中心、银行",
    "purpose": "原件材料槽字典：银行核减余额、贷款代偿或社保卡“一卡通”支付回执及告知；有权高校、县中心、银行；H **后置，此阶段生成**；银行有权还款凭据、社保卡发放系统记录/书面通知；F032/F033/F042；SRC-002/006；`paymentReceipt@settlement+version`；未结算不得索取；未到回执只标待执行/待查，禁止伪造销账。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "银行核减余额、贷款代偿或社保卡“一卡通”支付回执及告知；有权高校、县中心、银行",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M024",
    "name": "M024 · 为上传的各份复印件证明与原件一致：就业单位“复印属实”意见、经办人姓名、公章的图像及可核验签发记录；材料出具/核实者为相应就业单位",
    "purpose": "原件材料槽字典：为**上传的各份复印件**证明与原件一致：就业单位“复印属实”意见、经办人姓名、公章的图像及可核验签发记录；材料出具/核实者为相应就业单位；D条件必：实际提交复印件扫描时，**每个复印件证据实例**逐份关联认证；若系合法原件/电子权威记录，按当批受理口径先确认适用性，非无条件要求额外印章；F043；R018/R032；SRC-013/014 附件3备注5；`copyCertification[materialId@version,pages]@issuerVersion`；认证缺页`NEEDS_MATERIAL`、字章模糊`UNREADABLE`、签发权限不明`NEEDS_HUMAN_DECISION`；只认证复印件，不取代材料本体。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
    "maxCount": 100,
    "requiredElements": [
      "为上传的各份复印件证明与原件一致：就业单位“复印属实”意见、经办人姓名、公章的图像及可核验签发记录；材料出具/核实者为相应就业单位",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M025",
    "name": "M025 · 提交后补正、正式撤回、县级公示异议、市州核查/复核的外部有权机构书面处理或受理回执；各阶段主管机关持有",
    "purpose": "原件材料槽字典：提交后补正、正式撤回、县级公示异议、市州核查/复核的**外部有权机构书面处理或受理回执**；各阶段主管机关持有；X阶段申请人发起请求后**未来形成**，只在回执已签发时可引用；本地草稿取消不要求此槽；F035/F039/F040；R031；SRC-005/010/013/014（省文未列统一撤回渠道）；`remedyReceipt[externalApplicationId,kind,issuer,stage]@version`；无已证渠道时`POLICY_UNCONFIRMED`，申请刚提出而未形成时“待外部答复”不是`NEEDS_MATERIAL`；禁止伪造撤回成功。。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "提交后补正、正式撤回、县级公示异议、市州核查/复核的外部有权机构书面处理或受理回执；各阶段主管机关持有",
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
    "title": "批次政策生效",
    "requirement": "R001 批次政策生效；C/D，SC02/04/10/18；T=拟按特定年度申报；F=A/B 仅建毕业就业背景；U=未定批次或原件版本；SRC-005/006/007/013；F001/F002；M001；同时核文号、有效批次、申报窗和适用对象；2026 为 05-20—06-18，不能带入其他年。镜像扫描件与校内具体实施不一致时标冲突待核。；T 且该范围原件可信→PASS_FACT（政策版本事实）；校本条件缺→POLICY_UNCONFIRMED，原站无法获取→SOURCE_UNAVAILABLE；学校资助政策 Owner 核定。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R002",
    "title": "申请人真实同一性",
    "requirement": "R002 申请人真实同一性；C/D，SC02/10/14/18；T=已有申报人及证据；F=匿名政策咨询；U=仅自由填写姓名/认证不可取；SRC-001/012/013；F003—F005；M002/M003/M004/M005；校学籍身份、外部实名认证与申请表、任职文件逐件比对；曾用名仅引用 G01 有效更正。OCR 姓近似不作身份合并。；一致且核权→PASS_FACT；多身份/号码相抵→CONFLICT；认证链未知→NEEDS_HUMAN_DECISION，可信源断连→SOURCE_UNAVAILABLE；学校学籍/实名核验岗。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R003",
    "title": "毕业学校和省属路径",
    "requirement": "R003 毕业学校和省属路径；A/E，SC01—04；T=候选为成都理工大学毕业生；F=明确属于其他高校自身申报路线；U=学校/归属只有陈述；SRC-001/003/006/013；F007/F008；M001/M003/M018；以学校学籍及省属高校 2026 名录核毕业学校、年度；外校/部属高校不能套本校申请结论。；属本校且来源明→PASS_FACT；他校正式证明→记录不属本路由事实并由学校资助岗转有权流程 NEEDS_HUMAN_DECISION；不存在校档→SOURCE_UNAVAILABLE。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R004",
    "title": "正常批次届别与首次就业截止",
    "requirement": "R004 正常批次届别与首次就业截止；C/D，SC02/05—09；T=2026 正常首次申报；F=已明确补办 SC10（转 R005）；U=首次就业或申报类别不明；SRC-006/013；F001/F008/F013/F035；M001/M003/M005/M007；2026 当批对应 2022 年毕业、首次就业不晚于 2023-06-30；以实际到岗、权威录聘文件而非签约日/登记日单证比较。窗口已结束不等于可改历史记录。；达条件→PASS_FACT；日期真实不符→NEEDS_HUMAN_DECISION（不擅否决）；时间自相矛盾→CONFLICT；毕业/在岗证明缺→NEEDS_MATERIAL；高校与单位核对。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R005",
    "title": "合规补办与历史重复",
    "requirement": "R005 合规补办与历史重复；C/D，SC10；T=申请 2023—2025 因故未成功办理补办；F=2026 正常首办；U=历史申请/终审/已支付信息缺；SRC-002/006/013；F001/F002/F034/F035；M001/M017/M021/M023；仅以 2026 允许补办的政策和原年度外部受理、终审、支付记录对照；M021/M023 是历史已形成记录，不是让新申请者先交未来凭据。；历史状态可核且符合补办来源→PASS_FACT（事实）；已支付/旧案状态矛盾→CONFLICT 或 NEEDS_HUMAN_DECISION；省平台及原县/市核历史。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R006",
    "title": "最后学历和实际学制",
    "requirement": "R006 最后学历和实际学制；E，SC03/04/11/14；T=需按最终学历计学年；F=A/B 仅收集历史就业事实；U=连读/专升本/第二学士阶段不清；SRC-001/006/012/013；F009/F011/F012/F027；M003/M013/M018；各学籍阶段与 2026 省文件中“最后学历实际学制”对应；专升本只计本科学段，第二学士只计第二学士阶段，不能本科和研究生叠加。学校确认实际年数和当批学段适用。；校档一致→PASS_FACT；重复学段或起讫矛盾→CONFLICT；CDUT 第二学士实际路由未证→POLICY_UNCONFIRMED；本科学籍/研究生教育和财务复核。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R007",
    "title": "全日制普通高等教育与允许学段",
    "requirement": "R007 全日制普通高等教育与允许学段；E，SC02—04/14；T=正式资格审核学历性质；F=A/B 尚未办理资格；U=无法取得学籍性质或第二学士归属；SRC-001/006/013；F009/F010/F012；M003/M018；取学校学籍 Owner 的全日制及学历类别，不按毕业证照片推测；本科与研究生走各自权威记录。；符合来源→PASS_FACT；记录显著不符→NEEDS_HUMAN_DECISION；校内特殊学段未核→POLICY_UNCONFIRMED；学校资助/学籍岗。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R008",
    "title": "首次到岗事实与就业文书完整性",
    "requirement": "R008 首次到岗事实与就业文书完整性；B/C/D，SC01/02/05—10；T=已存在实际就业分段；F=A 阶段尚未实际就业；U=仅协议签订日/去向登记，无实到岗；SRC-001/006/012/013；F013—F015/F021；M005/M007；逐就业段对录聘/合同全文、单位签发日期、实际报到日；复用 S07-T05/T06 有效记录仅作关联，不自动等同连续在岗。；事实一致→PASS_FACT；缺录聘或当批允许替代→NEEDS_MATERIAL（说明可选有权证明）；合同/到岗冲突→CONFLICT；单位人事核实。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R009",
    "title": "当批地区及实际工作场所",
    "requirement": "R009 当批地区及实际工作场所；C/F，SC02/05/08/09/15；T=核任一就业分段地区；F=未就业的 A 阶段；U=工作现场未定位/2026 地区名录未核；SRC-006/007/013；F018/F019/F021；M001/M005/M007/M010；对照2026 附件 2 县名录及当时县—乡镇层级；将工商注册地址与实际工作现场分开，县本级、城关镇可能排除；区划变动转 R015。；准确匹配→PASS_FACT（地点事实）；法定定位尚有裁量→NEEDS_HUMAN_DECISION；地图与单位矛盾→CONFLICT；县级教育/属地部门。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R010",
    "title": "单位性质与排除行业",
    "requirement": "R010 单位性质与排除行业；C/F，SC02/05/15；T=按机关、事业或国企类申报；F=确以专项服务项目申报、按 R011；U=登记号/出资/岗位行业不明；SRC-001/006/012/013；F015—F017/F020；M005/M011/M019；以工商/国资或机构编制档、章程出资及县级会商比对；金融、烟酒、通讯、电力生产运输销售等当批排除行业须按具体单位、岗位核，不凭企业名。；单位事实被核实→PASS_FACT；国资结构缺→NEEDS_MATERIAL，部门解释争议→NEEDS_HUMAN_DECISION；县级会商人社/国资。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R011",
    "title": "特岗/一村一大/三支一扶/西部计划身份",
    "requirement": "R011 特岗/一村一大/三支一扶/西部计划身份；C/D，SC06/07；T=申报属上述项目；F=普通机关/事业/企业；U=只有自称项目名；SRC-001/006/012/013；F017/F021/F023；M005/M006/M008；核项目主管部门出具的服务协议/志愿服务证或当批可接受的录聘替代；仍须经 R009/R012/R013 独立核地点和年限。；项目身份可靠→PASS_FACT（非整体资格）；证件缺→NEEDS_MATERIAL；主管部门资料不可取→SOURCE_UNAVAILABLE；项目主管和县级资助部门。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R012",
    "title": "三年对年对月对日连续服务",
    "requirement": "R012 三年对年对月对日连续服务；B/C/F，SC01/02/05—10；T=满三年后的正式申请/分段服务核验；F=A/B 服务期尚未成熟；U=有空档、借调性质未知或任期终日缺；SRC-001/006/013；F013/F014/F021—F023；M005/M006/M007/M009；按首次就业日起实际有效任职区间逐段计算满 3 年、零空档，试用考核有效期按制度核；正常调动需要每段仍满足政策。2023-06-19—06-30 首聘而网申 2026-06-18 已结束的时间相遇情形必须请主管机关解释成熟节点，不能硬拒。；足年且权威吻合→PASS_FACT；缺段→NEEDS_MATERIAL，交叠/空档相抵→CONFLICT，申报窗口与满三年冲突→POLICY_UNCONFIRMED；单位人事、县资助及政策 Owner。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R013",
    "title": "年度考核等次例外",
    "requirement": "R013 年度考核等次例外；B/D，SC02/06—08；T=服务考核已形成且进入当批正式申请；F=A/B 未来年度尚未形成；U=考核期间/等次缺失；SRC-001/006/012/013（2026 正文考核条）；F020/F023；M006/M007；2026 省文明确：除试用期年度考核为不定等次外，出现不定等次、基本称职/合格或不称职/不合格情形须主管复核其不可申请后果；不得把“试用期不定”机械一律否决。；每年等级满足→PASS_FACT；缺该年度表→NEEDS_MATERIAL；试用期性质/较差等次争议→NEEDS_HUMAN_DECISION；有权考核部门、县审核。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R014",
    "title": "多单位正常调动/借调借用",
    "requirement": "R014 多单位正常调动/借调借用；B/D/F，SC08；T=发生两段及以上工作单位；F=单单位连续服务；U=证件出现单位切换但无正式调令；SRC-001/006/012/013；F014—F022/F023；M005/M006/M007/M009/M010；比对每段正式关系、实际现场、起止及签章；2026 省文要求 A/B/C 每段均满足地区与基层单位，非普通跳槽自动承接。；每段核对一致→PASS_FACT；单位/时间相抵→CONFLICT；缺调令/证明→NEEDS_MATERIAL；县级人社/资助判断“正常”。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R015",
    "title": "行政区划调整的时间例外",
    "requirement": "R015 行政区划调整的时间例外；B/F，SC09；T=就业后非城关镇调整为城关镇；F=无区划变化且地点正常；U=现在地址改变但生效日不清；SRC-002/006/013；F018/F019/F021/F026；M007/M012；2026 原文需县级以上政府批复，调整生效时点晚于本人首次就业或相应正常调动时点；保存调整前后两个区划版本。；官方时序可证→PASS_FACT（例外事实）；批文缺→SOURCE_UNAVAILABLE；例外是否成立需县机关 NEEDS_HUMAN_DECISION，不可用地图代批复。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R016",
    "title": "用人单位证明、签章和证明人权限",
    "requirement": "R016 用人单位证明、签章和证明人权限；D，SC02/05—10；T=正式提交就业单位意见；F=A/B 尚未申请；U=印章/手写签字区域模糊或不知权限；SRC-001/006/012/013；F014/F024/F025；M004/M007/M009；2026 当批本人签字表内单位意见；每段单位均盖公章，证明人为主要负责人或人事负责人、亲笔签名不得代签/仅签章。扫描图只证明“有图样”，真伪交签发单位核。；形式齐且可追溯→PASS_FACT（形式事实）；缺签字/章→NEEDS_MATERIAL；模糊→UNREADABLE；涉嫌代签→NEEDS_HUMAN_DECISION；单位人事/县资助。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R017",
    "title": "本人申请表与正式提交边界",
    "requirement": "R017 本人申请表与正式提交边界；C/D，SC02/10/18；T=以当批省系统正式提交；F=C 仅本地预审草稿；U=无省系统申请号或回执；SRC-006/012/013；F003/F006/F035/F036；M002/M004；2026 申请表从省系统生成并本人亲笔签字；联系方式 F006 只用于合法通知、不证明其身份；正式提交后系统信息不可自改，本地“已保存”不作已递交。；签收、版本、签字相符→PASS_FACT（提交证据事实）；签名/当批必填联系方式缺→NEEDS_MATERIAL；外部回执不可取→SOURCE_UNAVAILABLE；申请人/省系统受理岗。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R018",
    "title": "当批身份类别材料覆盖",
    "requirement": "R018 当批身份类别材料覆盖；D，SC02/05/06/07/08；T=类别和本批申报时点明确；F=其他类别专属材料不适用；U=身份类别/2026 表格细项不清；SRC-006/012/013（2026 附件 3）；F009/F015—F017/F023/F035；M001/M003—M011；逐类按附件 3 的现阶段清单校缺：机关事业录聘、国企 M011、项目服务证/主管文件 M008、考核 M006；合法替代须有当批文件，不能用 2025 表代替。；当前应具且具备→PASS_FACT（材料事实）；当前缺→NEEDS_MATERIAL，OCR 不清→UNREADABLE，细项不辨→POLICY_UNCONFIRMED；CDUT 接件岗与外部省系统。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R019",
    "title": "最后学历学费与年度上限",
    "requirement": "R019 最后学历学费与年度上限；E，SC03/04/11/14；T=校方按最后学历核计额基础；F=A—D 尚未校审；U=财务账/学制数缺；SRC-001/006/012/013；F011/F027/F028/F029；M003/M013/M014/M018；按最后学历实际年数逐学年核收费、实缴与批准减免；2026 省文上限 6000 元/学年属当批数值，不固定为所有年；仅输出待核金额依据，欠缴依 R020。；账证一致→PASS_FACT（核算输入）；重复学段/金额冲突→CONFLICT；算额政策口径不清→POLICY_UNCONFIRMED；CDUT 计划财务/资助。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R020",
    "title": "全免、部分减免及欠费旧新口径",
    "requirement": "R020 全免、部分减免及欠费旧新口径；E，SC11/13/14；T=核减免或欠费历史；F=A—D 尚未财务审核；U=校方账源无权限/减免决定不明；SRC-001 第九条、SRC-002/006/013；F027—F030/F034；M001/M013/M014/M018；先识别已全部免学费和有效部分减免，分别引用有权记录；2026 省文说明欠缴纳入计算并向学校补缴，2018 校本“全缴清”仍须学校正式协调，不把旧条款作自动拒绝。；账事实一致→PASS_FACT；新旧政策执行权冲突→POLICY_UNCONFIRMED；多账本相抵→CONFLICT；学校财务及校资助负责人。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R021",
    "title": "服兵役/退役资助互斥",
    "requirement": "R021 服兵役/退役资助互斥；E，SC13/14；T=核同一受助学段既有教育资助；F=A—D 尚未到校审；U=原决定版/是否撤销不可取；SRC-001/002/006/013；F029/F034；M014/M016/M018；只引用 S03-T12 已生效的国家入伍资助、退役教育资助决定及其撤销/追回版本；2026 省文声明已享不再享本奖补。存在原决定不等于仍有效，严禁双写。；查无有效重复且有权证明→PASS_FACT（互斥事实）；有效受助/撤销争议→NEEDS_HUMAN_DECISION；数据不符→CONFLICT；CDUT 资助有权岗。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R022",
    "title": "国家助学贷款类型、余额与优先偿还",
    "requirement": "R022 国家助学贷款类型、余额与优先偿还；E/H，SC12/17；T=权威核实存在校园地/生源地贷款；F=有权记录确认无国家助学贷款；U=贷款类型、银行/余额不可取；SRC-001/006/012/013；F031—F033/F042；M015/M023；学校、县生源地中心、经办银行按贷款合同、核验时点未清余额确认；资格前置 E 阶段不得索取 H 阶段 M023。将获批款优先偿还未清贷款的方向交资金 Owner，不直接销账。；E 贷款事实可证→PASS_FACT，权威确定无贷→NOT_APPLICABLE（贷款优先代偿子项）；余额跨时点冲突→CONFLICT，银行失联→SOURCE_UNAVAILABLE；银行/有权资助经办。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R023",
    "title": "学校事实审核回执与授权",
    "requirement": "R023 学校事实审核回执与授权；E 完成后，SC03/11/14；T=外部申请到达学校审核环节；F=A—D 尚未提交；U=无可信校审结果或审核 Actor；SRC-001/004/006/013；F003/F007—F012/F027—F037；M003/M013—M016/M018；校财务/学籍/资助分职责审核后，由授权学校账号形成 M018，锁定本次依赖版本；拒绝 Renderer 输入 teacher=true 作审批。；有权回执和引用事实匹配→PASS_FACT（学校审查存在事实），未形成结果→NEEDS_HUMAN_DECISION 待学校办理；身份未证→NEEDS_HUMAN_DECISION；校资助审核岗。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R024",
    "title": "县级服务真实性审核与会商",
    "requirement": "R024 县级服务真实性审核与会商；F，SC05/08/09/15；T=县级已受理并按工作地审查；F=未进入 F；U=县级会商或实地证据不明；SRC-002/006/010/013；F016—F026/F038；M005—M012/M019；查各段地点、单位性质、连续期、必要人社/国资会商和县级意见；县级确认不能由学校推定。签发/职权按该县实际机关。；M019 有权记录真实存在→PASS_FACT（县审事实）；尚待会商→NEEDS_HUMAN_DECISION，县源失联→SOURCE_UNAVAILABLE；就业地县资助中心。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R025",
    "title": "县级公示及异议处理",
    "requirement": "R025 县级公示及异议处理；F，SC15；T=县级审查后进入公示；F=未到公示阶段；U=未取到官方公示、异议及处置；SRC-002/006/010/013；F038/F039；M019/M020；2026 批次按通知公示不少于 5 个工作日，县级真实公示与异议处置另记；公开名单只说明阶段信息，个人身份证号脱敏。；公示及处置记录可证→PASS_FACT（程序事实）；无有效结案/有异议→NEEDS_HUMAN_DECISION；来源断连→SOURCE_UNAVAILABLE；县教育局。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R026",
    "title": "市州终审",
    "requirement": "R026 市州终审；G，SC16；T=县级完成上报进入市州终审；F=尚未县审公示；U=终审文书/权限不可核；SRC-002/006/013；F038—F040；M019—M021；只从市州教育/资助有权系统或签发文书读取结论、签章、文号、有效日及撤销版本；2026 汇总截止 08-07，结果不根据期限倒推。；终审记录可信→PASS_FACT（存在该决定，并非模板批准）；待市州处理→NEEDS_HUMAN_DECISION，源断→SOURCE_UNAVAILABLE；市州资助部门。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R027",
    "title": "省级备查、结算与拨款证据",
    "requirement": "R027 省级备查、结算与拨款证据；G/H，SC16/17；T=已有市州终审并启动结算；F=县/市未形成决定；U=结算进度或实际金额未知；SRC-006/013；F040/F041；M021/M022；省资助管理中心及教育/财政有权文件验证结算对象、时间、金额，资金到账不能从市州名单或财政计划文本猜。；M022 真实记录→PASS_FACT（结算事实）；未办理→NEEDS_HUMAN_DECISION 待资金 Owner；官方源失联→SOURCE_UNAVAILABLE；省教育/财政业务 Owner。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R028",
    "title": "贷款销账和社保卡支付履行",
    "requirement": "R028 贷款销账和社保卡支付履行；H，SC12/17；T=款项结算后进入实际清偿/发放；F=尚未真实结算；U=银行/一卡通回执没有可信时间点；SRC-002/006/013；F031—F033/F041/F042；M015/M022/M023；区分校园地贷款由高校、生源地贷款由县级中心办理，再以经办银行核减回执或“一卡通”实际支付凭据查金额和日期；不能修改外部借款余额。；M023 凭据可证→PASS_FACT（履行事实）；回执待到→NEEDS_HUMAN_DECISION 或机构失联 SOURCE_UNAVAILABLE；县资助/高校贷款经办/银行。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R029",
    "title": "有权人员身份、签发权限与不可伪造决定",
    "requirement": "R029 有权人员身份、签发权限与不可伪造决定；D—H/X，SC14—18；T=有人要求形成人工确认或引入外部决定；F=纯机器预审无审批动作；U=用户传入自报角色/无法校验 Actor；SRC-001/004/006/013；F003/F035/F037—F042；M002/M018—M023；校内可信 Main/服务端会话和真实主管系统核 actorRef+org+authorityBasis+target+caseRevision+decisionId；县市省银行各自独占决定，Renderer/OCR 的同名字串永不可信。；权限与有效源完整→PASS_FACT（授权核验事实）；自报教师/越权操作→NEEDS_HUMAN_DECISION 且拒写；待各层授权主管确认。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R030",
    "title": "材料更新、依赖失效和定向重审",
    "requirement": "R030 材料更新、依赖失效和定向重审；A—H/X，SC08/11/14/18；T=任一已用材料源版本或校方权威数据更新；F=本轮证据完全未变化；U=旧新哈希/来源版本不可追溯；SRC-001/006/013（业务证据要求）；F002/F014/F019—F025/F027—F034/F037；M001/M005—M007/M009/M013—M016/M018；比较每一 fieldInstance 的 evidence@version 和 sourceHash，仅使依赖该 F/M 的 R 旧事实意见失效；有权外部决定只发复核建议，不被本地撤销。规则依赖见 11.3。；版本可追→PASS_FACT（变更事实），随后对应旧结果标 STALE_REVIEW_REQUIRED；哈希丢失→NEEDS_HUMAN_DECISION；可信 case Owner 分派重审。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R031",
    "title": "撤回、补正、异议或复核请求的合法路径",
    "requirement": "R031 撤回、补正、异议或复核请求的合法路径；X，SC18；T=申请人提出上述请求；F=无争议请求；U=外部系统无回执/政策不说明提交后入口；SRC-002/005/006/007/013；F002/F003/F035/F039/F040；M001/M004/M020/M021；先区分本地草稿、正式省系统已提交、县级公示、市州终审四种法律事实；2026 正式提交不能自改。提出诉求可记录，但撤回生效、重提、行政复核必须由有权外部渠道书面确认。；本地草稿撤销引用→PASS_FACT（本地操作事实）；已提交无有效程序→POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION，回执失联→SOURCE_UNAVAILABLE；实际省系统/县/市经办按阶段答复。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R032",
    "title": "复印件逐份认证完备性",
    "requirement": "R032 复印件逐份认证完备性；ApplicationSubmission.materialInstance，D/SC02/05/06/07/08，每份上传复印件独立实例；T=2026当批申报，已知为申请人提供的复印件；F=并非复印件或该材料当前阶段不应提交且有权渠道明确认可其他原件；U=不确定是否复印件、材料页关系或受理要求；SRC-013/014附件3备注5；F043；M024+实际被复印的M003/M005/M006/M008/M009/M011等。逐页检查“复印属实”意见、经办人署名、就业单位公章及其明确认证哪份材料，不对整份Word只核一次。；T且逐件形式齐→PASS_FACT（仅认证形式）；缺经办/章/意见→NEEDS_MATERIAL；认证区域不可读→UNREADABLE；章真实性/授权争议→NEEDS_HUMAN_DECISION；持有人就业单位补证、县级受理机关核真。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R033",
    "title": "缺工作地文书的双主体共同证明",
    "requirement": "R033 缺工作地文书的双主体共同证明；EmploymentSegment[segmentId]，D/F，SC02/05/06/07/08/15，逐段；T=录聘文件、劳动合同或服务协议未明示可定位具体工作地；F=已有具足且可信的具体实际工作地记载；U=文书模糊、地址与现场冲突或是否上级主管关系不明；SRC-013/014附件3备注2；F019/F044；M005/M008/M010/M007。只在T时查单位和上一级主管部门共同出具的地点书证、签发身份、实际现场地址；排除仅用企业注册地址代替。；双主体形式与内容可核→PASS_FACT；少任一机构意见→NEEDS_MATERIAL；扫描低清→UNREADABLE；具体地址两证相抵→CONFLICT；上下级关系或县乡性质仍需县教育/人社国资 NEEDS_HUMAN_DECISION。。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  }
] satisfies NonNullable<TemplateVersion['sections']>[number]['criteria']

export const templateVersion: TemplateVersion = {
  templateId: "S07-T07",
  version: 1,
  schemaVersion: 2,
  name: "基层就业学费补偿、国家助学贷款代偿资格审核",
  description: '本地研究模板 · 非校方正式模板。政策证据状态：PARTIAL。用于事实核验、材料覆盖检查与人工复核，不得自动形成学校正式批准或拒绝。',
  catalogKind: 'builtin',
  sourceNote: 'R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板由研究原件转为本地草稿，非成都理工大学正式模板；SRC 仅是研究来源索引，不是案卷材料 SourceRef；无 PolicyVersion 绑定，不执行学校远端回写。',
  objectType: 'person',
  displayName: { template: "{{F004}} · S07-T07" },
  fields: fieldDefinitions,
  materialSlots: materialSlotDefinitions,
  sections: [{ id: 'rules', name: '原件规则核验项', description: '逐项对应研究原件第08节规则 ID；研究标准不等于校方正式政策，政策与权限未确认时必须人工复核。', order: 0, required: true, criteria }],
  policyVersionIds: [],
  stages: [
    { id: 'intake', name: "A/B 毕业、首次就业、服务履行与变动事实", kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'evidence-review', workflowOwner: 'local' },
    { id: 'evidence-review', name: "C/D 批次申请准备与本人正式提交/单位证明", kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'policy-confirmation', returnToStageId: 'intake', workflowOwner: 'local' },
    { id: 'policy-confirmation', name: "E/F 高校事实核验、县级审核/公示（仅记录外部结果）", kind: 'manual-review', executorRole: 'teacher', nextStageId: 'local-review', returnToStageId: 'evidence-review', workflowOwner: 'local' },
    { id: 'local-review', name: "G/H 市州终审、省级备查、资金代偿/发放回执（只读）", kind: 'manual-review', executorRole: 'teacher', nextStageId: 'local-summary', returnToStageId: 'policy-confirmation', workflowOwner: 'local' },
    { id: 'local-summary', name: "X 补件、撤回、复核/争议入口（本地待办；权限待确认）", kind: 'finalize', executorRole: 'teacher', workflowOwner: 'local' }
  ],
  outputs: [{ id: 'fact-review-feedback', kind: 'item-feedback', audience: 'reviewer' }, { id: 'supplement-and-confirmation-todo', kind: 'supplement-list', audience: 'teacher' }],
  autoPassPolicy: { enabled: false },
  status: 'draft',
  createdAt: '2026-10-24T03:12:00+08:00'
}

export const r02Metadata: R02Metadata = {
  templateId: "S07-T07",
  name: "基层就业学费补偿、国家助学贷款代偿资格审核",
  sourceDocumentPath: "docs/design/review-agent/business-templates/R02/S07-T07.md",
  sourceDocumentSha256: "fbbf14e9ad2334c400de1c1e346e8d48f015dc32104aaa4d00756f9b2f90a3b2",
  researchOriginalPath: "docs/design/review-agent/business-templates/R02/research-original/S07-T07.md",
  researchOriginalSha256: "3160503e3bfd97fa8173497301349d2754d3d8515b03507ca4fd2e0fc5dad77f",
  officialSchoolTemplate: false,
  researchDate: '2026-10-24',
  policyEvidenceStatus: 'PARTIAL',
  sourceStatus: {
  "SRC-001": "HISTORICAL",
  "SRC-002": "HISTORICAL",
  "SRC-003": "PARTIAL",
  "SRC-004": "PARTIAL",
  "SRC-005": "UNCONFIRMED",
  "SRC-006": "PARTIAL",
  "SRC-007": "UNCONFIRMED",
  "SRC-008": "HISTORICAL",
  "SRC-009": "HISTORICAL",
  "SRC-010": "PARTIAL",
  "SRC-011": "PARTIAL",
  "SRC-012": "HISTORICAL",
  "SRC-013": "PARTIAL",
  "SRC-014": "PARTIAL",
  "SRC-015": "PARTIAL"
},
  criteria: [
  {
    "sectionId": "rules",
    "criterionId": "R001",
    "sourceIds": [
      "SRC-005",
      "SRC-006",
      "SRC-007",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R002",
    "sourceIds": [
      "SRC-001",
      "SRC-012",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R003",
    "sourceIds": [
      "SRC-001",
      "SRC-003",
      "SRC-006",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R004",
    "sourceIds": [
      "SRC-006",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R005",
    "sourceIds": [
      "SRC-002",
      "SRC-006",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R006",
    "sourceIds": [
      "SRC-001",
      "SRC-006",
      "SRC-012",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R007",
    "sourceIds": [
      "SRC-001",
      "SRC-006",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R008",
    "sourceIds": [
      "SRC-001",
      "SRC-006",
      "SRC-012",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R009",
    "sourceIds": [
      "SRC-006",
      "SRC-007",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R010",
    "sourceIds": [
      "SRC-001",
      "SRC-006",
      "SRC-012",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R011",
    "sourceIds": [
      "SRC-001",
      "SRC-006",
      "SRC-012",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R012",
    "sourceIds": [
      "SRC-001",
      "SRC-006",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R013",
    "sourceIds": [
      "SRC-001",
      "SRC-006",
      "SRC-012",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R014",
    "sourceIds": [
      "SRC-001",
      "SRC-006",
      "SRC-012",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R015",
    "sourceIds": [
      "SRC-002",
      "SRC-006",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R016",
    "sourceIds": [
      "SRC-001",
      "SRC-006",
      "SRC-012",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R017",
    "sourceIds": [
      "SRC-006",
      "SRC-012",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R018",
    "sourceIds": [
      "SRC-006",
      "SRC-012",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R019",
    "sourceIds": [
      "SRC-001",
      "SRC-006",
      "SRC-012",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R020",
    "sourceIds": [
      "SRC-001",
      "SRC-002",
      "SRC-006",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R021",
    "sourceIds": [
      "SRC-001",
      "SRC-002",
      "SRC-006",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R022",
    "sourceIds": [
      "SRC-001",
      "SRC-006",
      "SRC-012",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R023",
    "sourceIds": [
      "SRC-001",
      "SRC-004",
      "SRC-006",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R024",
    "sourceIds": [
      "SRC-002",
      "SRC-006",
      "SRC-010",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R025",
    "sourceIds": [
      "SRC-002",
      "SRC-006",
      "SRC-010",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R026",
    "sourceIds": [
      "SRC-002",
      "SRC-006",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R027",
    "sourceIds": [
      "SRC-006",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R028",
    "sourceIds": [
      "SRC-002",
      "SRC-006",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R029",
    "sourceIds": [
      "SRC-001",
      "SRC-004",
      "SRC-006",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R030",
    "sourceIds": [
      "SRC-001",
      "SRC-006",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R031",
    "sourceIds": [
      "SRC-002",
      "SRC-005",
      "SRC-006",
      "SRC-007",
      "SRC-013"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R032",
    "sourceIds": [
      "SRC-013",
      "SRC-014"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R033",
    "sourceIds": [
      "SRC-013",
      "SRC-014"
    ],
    "evidenceStatus": "PARTIAL"
  }
],
  externalPolicyReferences: [
  {
    "id": "EXT-POLICY-001",
    "title": "关于调整完善国家助学贷款有关政策的通知",
    "documentNo": "财教〔2024〕188号",
    "publishedAt": "2024-10-31",
    "url": "https://www.moe.gov.cn/jyb_xxgk/moe_1777/moe_1779/202411/t20241104_1160686.html",
    "evidenceStatus": "VERIFIED",
    "scope": "全国国家助学贷款与国家基层就业学费补偿/贷款代偿标准；不得未经有权确认直接覆盖四川省级本地“学费奖补”方案"
  },
  {
    "id": "EXT-POLICY-002",
    "title": "关于做好2026年省属高校毕业生到艰苦边远地区基层单位就业学费奖补工作的通知",
    "documentNo": "川教函〔2026〕110号",
    "publishedAt": "2026-04-17",
    "url": "https://jy.sicnu.edu.cn/video/2026/4/21/1776758764512.pdf",
    "evidenceStatus": "PARTIAL",
    "scope": "20页盖章镜像可读；四川省教育厅原始公开页访问失败；只支持2026地方奖补项目事实，不证明CDUT校内签批授权"
  }
]
}
