import type { TemplateVersion } from '@profer/shared'
export type { TemplateVersion } from '@profer/shared'

export type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED' | 'HISTORICAL' | 'CROSS_SCHOOL_ONLY'
export type R02PolicyEvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
export interface R02CriterionMetadata { sectionId: string; criterionId: string; sourceIds: string[]; evidenceStatus: R02EvidenceStatus }
export interface R02Metadata { templateId: string; name: string; sourceDocumentPath: string; sourceDocumentSha256: string; researchOriginalPath: string; researchOriginalSha256: string; officialSchoolTemplate: false; researchDate: string; policyEvidenceStatus: R02PolicyEvidenceStatus; sourceStatus: Record<string, R02EvidenceStatus>; criteria: R02CriterionMetadata[]; externalPolicyReferences: Array<{id:string;title:string;documentNo:string;publishedAt:string;url:string;evidenceStatus:R02EvidenceStatus;scope:string}> }

const fieldDefinitions = [
  {
    "key": "F001",
    "label": "F001 · 学生权威标识／引用ID",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F001；学生权威标识／引用ID；GraduateSubject；L0 全情形；校身；M001权威身份记录；P3；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F002",
    "label": "F002 · 学生规范姓名／文本",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F002；学生规范姓名／文本；GraduateSubject；L0、L2比对；校身；M001；M008/M009协议抬头；P2；U/V。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F003",
    "label": "F003 · 学段（本/硕/博/其他）／枚举",
    "kind": "enum",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "options": [
      {
        "value": "本科",
        "label": "本科"
      },
      {
        "value": "硕士",
        "label": "硕士"
      },
      {
        "value": "博士",
        "label": "博士"
      },
      {
        "value": "其他",
        "label": "其他"
      }
    ],
    "readOnly": false,
    "extractionHint": "来源字段字典：F003；学段（本/硕/博/其他）／枚举；GraduateSubject；L0路由；校身；M001；P2；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F004",
    "label": "F004 · 毕业届别／枚举或年份",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F004；毕业届别／枚举或年份；GraduateSubject；L0判断当期服务；校身；M001；P2；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F005",
    "label": "F005 · 学院、校区／引用",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F005；学院、校区／引用；GraduateSubject；L0、L3；校身；M001；P1；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F006",
    "label": "F006 · 毕结业/当前服务可办理状态／枚举",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F006；毕结业/当前服务可办理状态／枚举；GraduateSubject；L0、L5；校身或授权校审；M001、M016；非自主推导；P2；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F007",
    "label": "F007 · 申请人声明角色／枚举",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F007；申请人声明角色／枚举；AgreementAction；L0/L1；本人或单位声明，需F008核验；M002；P1；B/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F008",
    "label": "F008 · 真实发起操作人及授权范围／引用",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F008；真实发起操作人及授权范围／引用；AgreementAction；L0/L1/Lx；校身/川台/校审登录与授权；M002、M005、M022；P3；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F009",
    "label": "F009 · 办理情形P01—P12／枚举",
    "kind": "enum",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "options": [
      {
        "value": "P01",
        "label": "P01"
      },
      {
        "value": "P02",
        "label": "P02"
      },
      {
        "value": "P03",
        "label": "P03"
      },
      {
        "value": "P04",
        "label": "P04"
      },
      {
        "value": "P05",
        "label": "P05"
      },
      {
        "value": "P06",
        "label": "P06"
      },
      {
        "value": "P07",
        "label": "P07"
      },
      {
        "value": "P08",
        "label": "P08"
      },
      {
        "value": "P09",
        "label": "P09"
      },
      {
        "value": "P10",
        "label": "P10"
      },
      {
        "value": "P11",
        "label": "P11"
      },
      {
        "value": "P12",
        "label": "P12"
      }
    ],
    "readOnly": false,
    "extractionHint": "来源字段字典：F009；办理情形P01—P12／枚举；AgreementAction；L0；经事实路由，案卷；M002；P1；B。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F010",
    "label": "F010 · 本申请业务标识／引用ID",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F010；本申请业务标识／引用ID；AgreementAction；L1以后；案卷/权威受理系统；M002、M023；P1；U/B。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F011",
    "label": "F011 · 当前阶段／L0—L5/Lx枚举",
    "kind": "enum",
    "required": false,
    "visibility": "internal",
    "scope": "case",
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
        "value": "Lx",
        "label": "Lx"
      }
    ],
    "readOnly": true,
    "extractionHint": "来源字段字典：F011；当前阶段／L0—L5/Lx枚举；AgreementAction；全流程；案卷+校审权威事件；M002、M023；P1；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F012",
    "label": "F012 · 使用的原渠道/平台／枚举",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F012；使用的原渠道/平台／枚举；AgreementAction；L0、L5；川台、国台、历史纸质记录；M002、M003；P1；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F013",
    "label": "F013 · 申请/响应/审批事件时点／时间戳",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F013；申请/响应/审批事件时点／时间戳；AgreementAction；L1之后按事件；相应系统服务端时间；M002、M007、M015/M016；P1；U/V。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F014",
    "label": "F014 · 原就业协议唯一编号／引用",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F014；原就业协议唯一编号／引用；AgreementChain；L0解约/重签；川台或核实原件；M003、M011；P2；U/V。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F015",
    "label": "F015 · 原协议当前有效/解除/待审状态／枚举",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F015；原协议当前有效/解除/待审状态／枚举；AgreementChain；L0解约/重签、L5；川台权威状态；M003、M017；P2；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F016",
    "label": "F016 · 原协议版本及摘要/指纹／复合",
    "kind": "object",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F016；原协议版本及摘要/指纹／复合；AgreementChain；L0、L2、重签前；川台、核实原件；M003、M011、M020；P2；U/V。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F017",
    "label": "F017 · 原单位法定主体识别号／文本",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F017；原单位法定主体识别号／文本；EmployerParty（原）；L0解约/重签；川台/单位权威注册资料；M003、M004；P2；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F018",
    "label": "F018 · 原单位规范名称／文本",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F018；原单位规范名称／文本；EmployerParty（原）；L0/L2；川台/单位原件；M003、M004、M014；P1；U/V。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F019",
    "label": "F019 · 单位具体签约操作人真实授权／引用",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F019；单位具体签约操作人真实授权／引用；EmployerParty；L1/L2；经核的企业授权/平台身份；M005、M014、M022；P3；C/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F020",
    "label": "F020 · 拟签新单位法定主体识别号／文本",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F020；拟签新单位法定主体识别号／文本；EmployerParty（新）；L1初签/重签；川台企业档案/核实登记；M004、M006、M018；P2；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F021",
    "label": "F021 · 拟签新单位规范名称／文本",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F021；拟签新单位规范名称／文本；EmployerParty（新）；L1初签/重签；川台或核实单位证明；M004、M006、M008；P1；U/V。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F022",
    "label": "F022 · 录用/签约意向及适用时间／复合",
    "kind": "object",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F022；录用/签约意向及适用时间／复合；EmployerParty（新）；L1有意向时；单位真实邀约/录用材料；M006、M018；P2；C/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F023",
    "label": "F023 · 线上邀请标识/版本／引用",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F023；线上邀请标识/版本／引用；AgreementAction；L1线上；川台单位邀请事件；M006；P2；U/B。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F024",
    "label": "F024 · 学生对邀请的应约/拒绝事件／枚举+时间",
    "kind": "enum",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "options": [
      {
        "value": "应约",
        "label": "应约"
      },
      {
        "value": "拒绝",
        "label": "拒绝"
      }
    ],
    "readOnly": false,
    "extractionHint": "来源字段字典：F024；学生对邀请的应约/拒绝事件／枚举+时间；AgreementAction；L2线上；川台本人响应记录；M007；P2；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F025",
    "label": "F025 · 线下协议生成/申请版本／引用",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F025；线下协议生成/申请版本／引用；AgreementChain；L1线下；授权平台生成记录/正式表单；M008；P2；U/V。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F026",
    "label": "F026 · 双方签署协议正文与签章证据／引用",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F026；双方签署协议正文与签章证据／引用；AgreementChain；L2已签；核实的双方原件及权威签署记录；M009、M011、M020；P3；B/V/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F027",
    "label": "F027 · 已签版上传/登记提交事件／引用",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F027；已签版上传/登记提交事件／引用；AgreementAction；L2/L3；川台或国台各自原始回执；M010、M026；P2；U/V。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F028",
    "label": "F028 · 解约发起方（生/企）／枚举",
    "kind": "enum",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "options": [
      {
        "value": "学生",
        "label": "学生"
      },
      {
        "value": "企业",
        "label": "企业"
      }
    ],
    "readOnly": false,
    "extractionHint": "来源字段字典：F028；解约发起方（生/企）／枚举；AgreementAction；L1解约；可信平台实际提交人；M012；P1；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F029",
    "label": "F029 · 解约事由/所依据协议条款／文本",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F029；解约事由/所依据协议条款／文本；AgreementAction；L1解约；发起人真实表述+原约；M012、M020；P3；B/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F030",
    "label": "F030 · 相对方同意/拒绝及时间／事件",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F030；相对方同意/拒绝及时间／事件；AgreementAction；L2解约；双方真实平台响应/签署；M013、M014；P3；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F031",
    "label": "F031 · 解除函签署主体、效力核验／引用",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F031；解除函签署主体、效力核验／引用；AgreementChain；L2线下或纸质；单位核验原件/签章及授权；M014；P3；C/V/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F032",
    "label": "F032 · 学院审核意见、经办人、版本／事件",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F032；学院审核意见、经办人、版本／事件；ReviewEvent；L3后；校审；M015；P2；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F033",
    "label": "F033 · 学校后续审批意见、权责、版本／事件",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F033；学校后续审批意见、权责、版本／事件；ReviewEvent；L4后；校审；M016；P2；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F034",
    "label": "F034 · 解约办理完成的权威回执／事件",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F034；解约办理完成的权威回执／事件；AgreementChain；L5旧约解除；川台/校方确认的真实解除状态；M017；P2；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F035",
    "label": "F035 · 当前网签/重签资格状态／枚举",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F035；当前网签/重签资格状态／枚举；GraduateSubject；L5后拟重签；川台/校身授权状态；M017、M018；P2；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F036",
    "label": "F036 · 新协议独立编号与上游解除链／复合",
    "kind": "object",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F036；新协议独立编号与上游解除链／复合；AgreementChain；L1/L5重签过程；川台/正式新约；M018、M019；P2；U/V。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F037",
    "label": "F037 · 特别约定（升学、公务员、违约等）／受限文本",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F037；特别约定（升学、公务员、违约等）／受限文本；AgreementChain；L1/L2及争议时；原协议或合法附件原件；M020；P3；C/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F038",
    "label": "F038 · 证据版本、摘要、来源时间和父版本／复合",
    "kind": "object",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F038；证据版本、摘要、来源时间和父版本／复合；EvidenceRevision；每次收件/补件；案卷不可篡改版本链；M003、M009、M023、M027；P2；U/V。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F039",
    "label": "F039 · 升学/招录等状态变化及生效时点／引用",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F039；升学/招录等状态变化及生效时点／引用；AdjacentDecisionRef；P10 L0/L1；招录/学校权威结果或核实证明；M021；P3；C/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F040",
    "label": "F040 · 毕业去向/档案/离校等只读权威结论／引用+版本",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F040；毕业去向/档案/离校等只读权威结论／引用+版本；AdjacentDecisionRef；冲突及L5关联；国台及G/S/T Owner；M026；P2；U/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F041",
    "label": "F041 · 真实代理授权与可代理范围／引用",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F041；真实代理授权与可代理范围／引用；AgreementAction；有代理才于L0/L1；本人授权、单位授权、校方许可；M022；P3；C/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F042",
    "label": "F042 · 撤回、补件、复核请求及处理事件／复合",
    "kind": "object",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F042；撤回、补件、复核请求及处理事件／复合；AgreementAction；Lx；可信案卷及校审事件；M023、M027；P2；B/H。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  }
] satisfies TemplateVersion['fields']
const materialSlotDefinitions = [
  {
    "id": "M001",
    "name": "M001 · 申请人同一性、届别、学段和服务范围",
    "purpose": "原件材料槽字典：校方学籍/就业Owner；可信本人、学籍与毕业生基本记录；`现` L0所有情形；校方人员人工查验同一权威记录；普通身份证截图**不能**取代身份认证；F001—F006；SRC-001/002（主体线索）；V为校身快照、O=校方身份Owner；源失联→`SOURCE_UNAVAILABLE`，姓名冲突→`CONFLICT`，不强制上传证件影像。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "申请人同一性、届别、学段和服务范围",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M002",
    "name": "M002 · 申办意图、发起者与当前处理编号",
    "purpose": "原件材料槽字典：申请人/单位及受理服务；在线申请/邀请业务事件；`现` L0/L1；有权限平台回执或正式纸质受理记录（是否接受纸件待核）；F007—F013；SRC-003/004；V为受理事件号/提交时间，O=受理业务系统；未真正申请→`NEEDS_MATERIAL`；权限未知→人工核。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "申办意图、发起者与当前处理编号",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M003",
    "name": "M003 · 原协议及占用状态",
    "purpose": "原件材料槽字典：协议平台/学校保存主体；原签约记录及其状态；`条` 有原约、解约/重签前的当前证据；经核实原协议原件与权威状态查询结合；PDF截图不可独立证明仍有效/已解除；F012、F014—F018、F038；SRC-001/004/005；V为原协议号+状态版，O=协议权威源；不可访问→`SOURCE_UNAVAILABLE`；旧约号错→`CONFLICT`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "原协议及占用状态",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M004",
    "name": "M004 · 用人单位法定主体及平台注册资格",
    "purpose": "原件材料槽字典：单位/平台；企业信息及平台认证记录；`现` 初签/重签单位明确后；解约核原单位时条件需用；单位登记主体的可验证证明，**不代替具体签署权**；F017/F018/F020/F021；SRC-004；V为企业主体快照，O=平台注册/单位权威信息；源失联人工核；名称不一→冲突，不能按字符串直接合并。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "用人单位法定主体及平台注册资格",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M005",
    "name": "M005 · 具体单位办理人的签约/解除授权",
    "purpose": "原件材料槽字典：单位有权机关/平台；授权委托、经办角色记录；`条` 单位经办权不清或代理发起；原单位正式授权及核实联系人，不能凭企业账号展示截图推定；F008/F019；SRC-004（只证平台用户操作）；V含授权起止/范围，O=单位授权人；无权/不明→`NEEDS_HUMAN_DECISION`；不可读→`UNREADABLE`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "具体单位办理人的签约/解除授权",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M006",
    "name": "M006 · 单位线上签约邀请与条款草案",
    "purpose": "原件材料槽字典：川台/用人单位；未应约邀请事件；`现` P01、P02应约前；可查询的正式邀请页面/平台回执；无法确认则人工取得平台事件；F020—F023；SRC-004第20—23页；V含邀请ID/版本，O=川台单位邀约；邀请不存在不能造；源断→`SOURCE_UNAVAILABLE`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "单位线上签约邀请与条款草案",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M007",
    "name": "M007 · 毕业生对单位邀请的真实响应",
    "purpose": "原件材料槽字典：川台/学生登录本人；应约、拒绝事件；`后` P01，`现` P02响应已作时；有权平台原始响应记录；本人截图仅低信任待核；F008/F013/F024；SRC-004；V含应约事件ID，O=川台本人操作；尚未响应≠缺首轮材料；响应真实性疑义→人工。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "毕业生对单位邀请的真实响应",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M008",
    "name": "M008 · 线下协议生成申请及未签草案",
    "purpose": "原件材料槽字典：学生/获授权平台；纸质版生成/申请记录；`现` P03，P04之前版本；官方当期表单或权威生成回执；样式来源必须CDUT确认；F002/F021/F025；SRC-001/002（线下业务存在）；V含草案编号，O=生成渠道；未生成→当前阶段补申请；旧版表单适用未知→政策待核。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "线下协议生成申请及未签草案",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M009",
    "name": "M009 · 双方签章的线下协议",
    "purpose": "原件材料槽字典：毕业生、单位；协议正式签署版本；`后` P03，`现` P04已有签署后；电子签署权威记录若被当前渠道接受；仅扫描PDF需校验签署权；F002/F026/F038；SRC-001/002；V为完整合同与附件版本，O=原签主体/协议源；不可读→`UNREADABLE`；签署权不明→人工，不自动判生效。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "双方签章的线下协议",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M010",
    "name": "M010 · 已签协议上传/登记成功事件",
    "purpose": "原件材料槽字典：川台/国台分别存其平台记录；`后` P03，`现/后` P04取决于是否已上传；各平台自己的权威回执，不以其中一个平台事件代替另一个；F027/F013；SRC-001/002/006；V含平台命名空间及回执ID，O=分别对应平台；未提交生成待办；源断→`SOURCE_UNAVAILABLE`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "已签协议上传/登记成功事件",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M011",
    "name": "M011 · 原线上签约结果及完整协议",
    "purpose": "原件材料槽字典：川台/双方；已应约的协议正文和记录；`后` P01，`现` P05/P07已有原约；具有同等权威的当期正式签约回执；截图不作唯一生效证明；F014—F016/F026；SRC-001/004；V绑定协议号、正文及双方响应，O=协议平台；查不到/冲突需授权人核，不能将邀请当已签约。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "原线上签约结果及完整协议",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M012",
    "name": "M012 · 解约发起申请及理由",
    "purpose": "原件材料槽字典：发起方/川台；带原协议号的解除申请；`现` P05/P06/P07提交解约时；有权渠道的正式解约受理记录；线下纸质格式当前未证实；F008/F010/F014/F028/F029；SRC-001/003/004；V为原约关联的独立解约申请号，O=发起渠道；原约号缺失→补核；200字限制只在SRC-004平台对应页面适用。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "解约发起申请及理由",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M013",
    "name": "M013 · 相对方同意/拒绝解约事件",
    "purpose": "原件材料槽字典：川台；单位或学生另一方登录后的响应；`后` P05/P07发起时，`现` 已回应后；经校方认可的正式解除双方合意证明；平台是否接纳纸证待核；F028/F030/F013；SRC-001/004；V含响应人、原约和时间，O=真实相对方；未回复不误判同意；拒绝→人工争议，非自动解约。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "相对方同意/拒绝解约事件",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M014",
    "name": "M014 · 线下或纸质单位解约函与签发证明",
    "purpose": "原件材料槽字典：原单位/毕业生；解除函原件/核实扫描件及签章；`条` P06、P09旧纸制；已有可同时审，不存在等待后续；正式平台相对方同意事件在被当期学校接受时可候选替代；F018/F019/F030/F031；SRC-005（旧制）、SRC-001（双方同意原则）；V关联原约和单位权责证据，O=出函单位；缺少不阻止创建申请；在解除事实判断节点待补，签章不实→人工。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "线下或纸质单位解约函与签发证明",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M015",
    "name": "M015 · 学院真实审核结果",
    "purpose": "原件材料槽字典：学院授权人员/校方办理系统；审查事件；`后` L1/L2，`现` 仅L3完成后核查；已核学校正式签批材料；可代替形式须校本确认；F013/F032；SRC-003；V含审查人、范围、申请版，O=学院授权岗位；尚未出具不催申请人上传；服务端失联人工查。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "学院真实审核结果",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M016",
    "name": "M016 · 学校后续程序决定",
    "purpose": "原件材料槽字典：学校授权审批岗位/系统；审批或退回事件；`后` L3，`现` L4已作时；有权学校书面批示或系统回执（真伪核验）；F006/F013/F033；SRC-003；V含学校决定ID、身份、依据申请版，O=学校；不可用→`SOURCE_UNAVAILABLE`；不能由教师身份字段自造批准。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "学校后续程序决定",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M017",
    "name": "M017 · 原协议解除成功与网签资格权威状态",
    "purpose": "原件材料槽字典：协议平台/学校核定权威系统；最终状态事件；`后` P05—P07，`现` P08拟重签入口；官方可核对解除完成/资格恢复记录；**解约函本身不能替代**；F015/F034/F035；SRC-003/004、SRC-008仅跨校对照；V含状态更新序号，O=协议权威系统；源断→人工，未确认绝不放行自动重签。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "原协议解除成功与网签资格权威状态",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M018",
    "name": "M018 · 新单位录用意向/新签邀请",
    "purpose": "原件材料槽字典：新单位/川台；邀请、录用材料；`现` P08有具体新单位意向时，录用证明强制性`条`且未知；当期正式邀请，若旧规要求书面录用证明需核其现行性；F020—F023/F035/F036；SRC-001/004/005（旧制待核）；V为新单位邀请或录用文号，O=新单位；若只有口头意向仅记录待核；不能据SRC-005强制所有人交offer。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "新单位录用意向/新签邀请",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M019",
    "name": "M019 · 新签协议及后续审批回执",
    "purpose": "原件材料槽字典：新签双方/学校/平台，各有其事件；`后` P08新申请开始后；同等效力的当期线上或线下正式新约/回执，各阶段分别存档；F026/F027/F033/F036；SRC-001/003/004；V为新协议号，不覆盖旧约，O=各授权方；新约未生成不能作为重签前置材料，冲突人工核。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "新签协议及后续审批回执",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M020",
    "name": "M020 · 原协议补充约定及不可拆附件",
    "purpose": "原件材料槽字典：原合同双方/权威协议源；协议附录/备注；`条` 存在升学/公务员/违约条款时；可验证双方认可并绑定该协议版本的合法附件；F016/F026/F029/F037；SRC-001/002；V与原协议指纹绑定，O=双方合同来源；缺页/不清→`UNREADABLE`，解释争议→`NEEDS_HUMAN_DECISION`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "原协议补充约定及不可拆附件",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M021",
    "name": "M021 · 升学、招录或其他身份变化事实",
    "purpose": "原件材料槽字典：招录机关/学校结果Owner或毕业生提供待核证明；`条` P10触发时；可核实录取/录用正式结果，仍不代替解除双方合意；F039；SRC-001/002（特殊约定）；V含决定时点、对象，O=原签发机构；真实性未证→人工；无来源→不认定自动解约。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "升学、招录或其他身份变化事实",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M022",
    "name": "M022 · 代理人授权书及范围",
    "purpose": "原件材料槽字典：被代理本人/单位及授权核验机构；`条` 只有代理发起、单位代表权不明；校方认可的身份认证/正式授权链；是否允许代理待确认；F008/F019/F041；SRC-004（单位用户有操作，非权证）；V含授权人、受托人、有效期，O=授权方；无法验证→人工；禁止前端自称老师或员工代批。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "代理人授权书及范围",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M023",
    "name": "M023 · 补件/撤回/复核申请及办理事件",
    "purpose": "原件材料槽字典：原申请人及学校受理系统；`现` P11/P12当前动作，其他情形为`后/条`；可信受理回执或学校正式书面记录；时限待确认；F010/F011/F038/F042；SRC-003（存在学校流程）；V单调追加，不抹除原案，O=受理系统；权限/时限不明人工；不可读或跨案冲突冻结。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "补件/撤回/复核申请及办理事件",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M024",
    "name": "M024 · 纸质协议遗失/污损的证明事实",
    "purpose": "原件材料槽字典：原协议持有人、纸件管理部门；`条` P09，旧制线索；实际污损原件/核实遗失事实；登报要求不得自动套用；F014—F016/F038；SRC-005；V与旧协议号绑定，O=原持有人/校方存档；`POLICY_UNCONFIRMED`；来源/真实性不清人工。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "纸质协议遗失/污损的证明事实",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M025",
    "name": "M025 · 旧制研究生补发/更换申请表",
    "purpose": "原件材料槽字典：历史研究生院/导师/学院；纸质签批表；`条` P09，仅在校方明确继续适用后才变当前必需；当前学校确认的新版表单/平台流程；F003/F005/F032/F033；SRC-005；V必须标示制度生效届别，O=当前学校授权部门；默认 `POLICY_UNCONFIRMED`，不可催交旧版导师签字或章。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "旧制研究生补发/更换申请表",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M026",
    "name": "M026 · 去向登记及邻接业务权威决定",
    "purpose": "原件材料槽字典：国家去向系统/档案、离校、学籍等Owner；`条` 出现跨业务冲突或L5关联时；对应Owner正式有效决定ID/版本，不是申请者自填“已就业”；F027/F040；SRC-006/007、S07-T03/T04/G50边界；V保留来源系统+对象+版本，O=外部Owner；源失联仅标记，禁止自算/覆盖去向与档案状态。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "去向登记及邻接业务权威决定",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M027",
    "name": "M027 · 冲突澄清/人工复核的真实处置",
    "purpose": "原件材料槽字典：被授权学校岗位/争议方；答复及版本校准事件；`后/条` 发生冲突与复核时；上游Owner正式更正结果、双方共同核对后的有效证明；F038/F042/F031；SRC-001/003（原则，具体救济制度待核）；V绑定冲突前后源记录与签发者，O=有权处理方；未形成结论保持 `CONFLICT`/`NEEDS_HUMAN_DECISION`。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "冲突澄清/人工复核的真实处置",
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
    "title": "申请人身份同一性",
    "requirement": "R001 申请人身份同一性；L0；T=存在待办申请或单位邀约且学生身份可定位；F=明确并非本事项毕业生；?=权威身份待核；SRC-001/002；F001/F002；M001/M002；以校身T0主键比对所有协议/申请当事人，不靠同名；采当前身份快照并保存版本；改名、跨届须查原Owner；同一人事实PASS_FACT；不同主键CONFLICT，身份源断SOURCE_UNAVAILABLE；学校身份Owner→受理人员。来源状态：VERIFIED。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R002",
    "title": "学段、届别及服务资格来源",
    "requirement": "R002 学段、届别及服务资格来源；L0；T=需判断本/硕/博、届别、毕结业及学院归口；F=已经被可信路由判定为其他独立事项；?=当届政策或授权范围未明；SRC-001/002/003/005（旧规不得直用）；F003—F006；M001；学籍T0身份只证身份、状态；是否允许办理必须再与现行校本届别/学段规则比对，不能套2018研旧规、寒假2工作日为普遍期限；身份属性可PASS_FACT，服务资格无现行规则POLICY_UNCONFIRMED；就业中心/研究生归口人工核。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R003",
    "title": "发起人真实身份与代理范围",
    "requirement": "R003 发起人真实身份与代理范围；L0/L1/Lx；T=有人发起、响应或代理；F=本案无外部发起动作；?=真实账号/授权不明；SRC-001/004；F007/F008/F019/F041；M002/M005/M022；验本/企/校服务端操作者及代理委托范围、有效期、原签发者；平台“单位用户”不等于合同签署权；不得采Renderer Actor；经核操作主体事实PASS_FACT；授权存疑NEEDS_HUMAN_DECISION、授权书不可读UNREADABLE；身份/单位授权核验岗位。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R004",
    "title": "受理对象、渠道与阶段事件",
    "requirement": "R004 受理对象、渠道与阶段事件；L0/L1/Lx；T=申请/邀请/补件已发起；F=仅咨询未受理；?=事件记录或渠道失联；SRC-003/004；F009—F013/F042；M002/M023；核P01—P12、申请号、L阶段、渠道及服务端事件时间；同一次协议可有多次申请但ID不可复用；未获原始回执不能宣称正式受理；可追溯事件PASS_FACT；申请信息未形成NEEDS_MATERIAL，权威受理源断SOURCE_UNAVAILABLE；受理经办人。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R005",
    "title": "原协议唯一绑定及状态时点",
    "requirement": "R005 原协议唯一绑定及状态时点；L0解约/重签；T=存在被指向的原协议；F=可信确认首次签约且无原约；?=平台状态/编号不明；SRC-001/004/005（历史线索）；F012/F014—F016/F038；M003/M011；按源平台+原协议号+学生ID+版本+状态时间组成链；扫描正文与权威状态分别比对；过期快照不得证明“现在已解除”；可核原约关联PASS_FACT；编号/状态互斥CONFLICT，源失联SOURCE_UNAVAILABLE；平台原约Owner。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R006",
    "title": "原单位与原协议相对方匹配",
    "requirement": "R006 原单位与原协议相对方匹配；L0/L2解约；T=对原单位身份进行核实；F=可信首次签约无原单位；?=历史单位登记/改名证明不明；SRC-001/004；F017/F018/F031；M003/M004/M014；对法人/组织识别号、曾用名、协议版本与出函主体；不按单位显示名称直接相等；历史更名需查询当时及当前有效登记；匹配事实PASS_FACT；同名异主体/异名疑点CONFLICT；企业登记/校方人工核。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R007",
    "title": "新单位身份及具体签约权限",
    "requirement": "R007 新单位身份及具体签约权限；L1初签/重签；T=已确定拟签单位；F=当前仅解除且未选新单位；?=单位注册、经办授权不明；SRC-001/004；F019—F022/F041；M004/M005/M018/M022；先验主体ID和新旧单位关系，再验实际签约代表授权范围及时间；录用意向不是权证；只有单位账号不能认作有权签字人；单位主体事实PASS_FACT；代表权争议NEEDS_HUMAN_DECISION，主体冲突CONFLICT；单位授权核验者。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R008",
    "title": "单位线上邀请存在及版本",
    "requirement": "R008 单位线上邀请存在及版本；L1 P01/P02，P08线上新约；T=线上发邀；F=经核线下签约；?=邀请事件尚未查询；SRC-004第20—23页；F022/F023/F020/F021；M006/M018；源事件ID、邀请条款版本、发起单位及生成时间一致；邀请在学生响应前才属L1证据；有效期参数学校未确认时不判过期；发邀事实PASS_FACT；邀请未提供NEEDS_MATERIAL、平台源断SOURCE_UNAVAILABLE、过期阈值POLICY_UNCONFIRMED；单位→毕业生。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R009",
    "title": "学生对线上邀请的真实响应",
    "requirement": "R009 学生对线上邀请的真实响应；L2 P02；T=学生已应约/拒绝；F=P01仅发邀尚未进入应约核验；?=学生待响应；SRC-004；F008/F013/F023/F024；M006/M007；响应人学生T0、邀请ID、响应时间和版本匹配；“拒绝邀请”也可事实核实，但不是合同达成；邀请发生在响应之前；响应事实PASS_FACT（须注明同意/拒绝）；未经本人响应NEEDS_MATERIAL仅在当前L2有响应核验义务时，源断SOURCE_UNAVAILABLE；本人/平台Owner。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R010",
    "title": "线下协议草案生成",
    "requirement": "R010 线下协议草案生成；L1 P03/P04前序；T=采取线下协议路径；F=当期明确纯线上；?=当前是否允许纸质及使用何版表单未知；SRC-001/002；F002/F021/F025；M008；比较申请主体、拟签单位、草案编号、生成时间和可用表单版本；不要求此时已有签章；旧制表单不直接通用；草案事实PASS_FACT；缺当前草案NEEDS_MATERIAL，本届表单/渠道POLICY_UNCONFIRMED；毕业生/校方表单Owner。来源状态：VERIFIED。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R011",
    "title": "双方已签协议正文、签署权限与附件",
    "requirement": "R011 双方已签协议正文、签署权限与附件；L2 P04/已完成线上签约；T=存在双方签署版；F=还在L1邀请/草案；?=签署事实待核；SRC-001/002/004；F002/F016/F019/F026/F037/F038；M009/M011/M020/M005；核完整版、双方法定主体、可验证签章/电子表意、不可拆附件和指纹；不能让OCR鉴章或校审盖章自动决定合同法律效力；可核文本/签章事实PASS_FACT，残页UNREADABLE，有权签约/条款争议NEEDS_HUMAN_DECISION；签约双方及必要法律人员。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R012",
    "title": "签署材料上传/登记事件的对象分离",
    "requirement": "R012 签署材料上传/登记事件的对象分离；L2/L3 P04或已签后；T=需查已签版提交；F=尚未签署，提交后置；?=平台回执未查询；SRC-001/002/006；F013/F027/F040；M009/M010/M026；比对各平台命名空间、回执号、协议版本、提交时间；省平台“签约/上传”与国台“去向登记”是不同对象；分别证明已提交事实PASS_FACT；已到提交步骤而未交NEEDS_MATERIAL，查询源断SOURCE_UNAVAILABLE；相应平台Owner，去向交相邻Owner。来源状态：VERIFIED。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R013",
    "title": "解约申请指向的原协议与原因",
    "requirement": "R013 解约申请指向的原协议与原因；L1 P05/P06/P07；T=双方一方正式提出解除；F=仅初次签约；?=提出者/原约号未知；SRC-001/003/004；F008/F010/F014/F028/F029/F037；M003/M012/M020；原约号、提出者身份、事由文本、相应原约条款及平台发起时间绑定；单位端字数限制仅校方公布的当前界面适用，不推成普遍政策；解约申请事实PASS_FACT；缺申请NEEDS_MATERIAL、错误原约CONFLICT、效力解释NEEDS_HUMAN_DECISION；发起方/受理经办人。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R014",
    "title": "相对方同意/拒绝的真实事件",
    "requirement": "R014 相对方同意/拒绝的真实事件；L2 P05/P06/P07；T=对方已有可核回应；F=申请尚在L1待回应；?=回应存在与否源不可核；SRC-001/004；F008/F013/F028/F030；M012/M013/M014；同一原约、相对方真实主体、同意/拒绝及时间；不能将沉默、申请提交、校方收件推定同意。拒绝也是可核事实但不导致成功解约；回应事实PASS_FACT（明示态度）；拒绝则另出NEEDS_HUMAN_DECISION待办，矛盾回应CONFLICT；双方/学校争议处理人员。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R015",
    "title": "线下解约函与具体签发权",
    "requirement": "R015 线下解约函与具体签发权；L2 P06或条件纸制；T=有纸质解除函并要求核；F=当期有效电子回应且校方确认无需纸函；?=纸函必需性未知；SRC-001/005（现行性未知）；F017—F019/F030/F031；M005/M014/M020；查原约ID、出函单位识别号、原件签章、受托签发人及签发时点；2018旧制加盖章要求暂不能硬套新届别；已核书面表示PASS_FACT；函缺页UNREADABLE、权责NEEDS_HUMAN_DECISION、强制性POLICY_UNCONFIRMED；原单位/学校办理人员。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R016",
    "title": "学院审批环节存在且回执真实",
    "requirement": "R016 学院审批环节存在且回执真实；L3；T=申请到学院审核且形成事件；F=仍L1/L2、学院结果未来才产生；?=学院岗位/当前节点未知；SRC-003；F005/F013/F032/F038；M015/M002；校方授权服务端审查人+岗位范围+决定ID+申请版本及时间均核实；寒假通知能证存在学院审核，不证每情形每学段精细签字要求；审核事件已发生事实PASS_FACT；无回执若尚未办理保持待办，岗位未核POLICY_UNCONFIRMED、伪回执CONFLICT；学院有权审核人。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R017",
    "title": "学校后续审批与真实决定权",
    "requirement": "R017 学校后续审批与真实决定权；L4；T=学院节点完结且学校有签发动作；F=尚未进入L4；?=现行有权岗位/审批版本不明；SRC-003；F006/F008/F013/F032/F033；M015/M016；比对校方后端授权岗位、申请及学院版本、学校决定事件ID/时间和内容；“2工作日”仅SRC-003寒假特定承诺，超时≠自动批准；只证明学校已存在某条有权决定事件PASS_FACT，并引用原始决定内容；伪教师ActorCONFLICT、授权不明NEEDS_HUMAN_DECISION；学校审批Owner。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R018",
    "title": "原约解除完成及网签资格恢复",
    "requirement": "R018 原约解除完成及网签资格恢复；L5 P05—P08；T=需要确认解除办理结果或重签前置；F=只有待审解约未到L5（本阶段不应查结果完成）；?=权威状态不可达；SRC-003/004（SRC-008仅比照、不得判）；F014/F015/F034/F035；M003/M017；对同一原约和学生从平台取解除成功/可签资格两个独立状态、时点及版本；双方同意或学校核对函均不能代替平台完成回执；各自有效状态PASS_FACT；旧约仍有效而申请新约CONFLICT，源断SOURCE_UNAVAILABLE，资格含义不明POLICY_UNCONFIRMED；省平台/校方授权人员。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R019",
    "title": "重新签约新旧协议链不覆盖",
    "requirement": "R019 重新签约新旧协议链不覆盖；P08新L0/L1及其后；T=提出重签且旧约已有权威解除完成；F=可信首次签约/仅解除未进入新流程；?=原约释放、重签政策未知；SRC-001/003/004/005（旧录用证明要求不可直用）；F001/F014—F016/F020/F021/F034—F036；M003/M017/M018/M019；原学生ID、旧约解除事件与新单位、新邀约/新协议ID分别绑定；M019只在新约形成后核；次数、间隔、offer强制项待校本确认；链接与独立编号事实PASS_FACT；旧约状态不明SOURCE_UNAVAILABLE，阈值POLICY_UNCONFIRMED，链冲突CONFLICT；学校就业协议Owner/新单位。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R020",
    "title": "升学、招录变化与特别约定",
    "requirement": "R020 升学、招录变化与特别约定；L0/L1 P10；T=援引升学/招录及原约条款；F=无该主张且无此条款；?=录取权威源或附件不明；SRC-001/002/005（历史仅参考）；F014/F016/F029/F037/F039；M003/M020/M021；仅比对权威录取结果对象、时间和原约对应附件；不以“考上研/录公务员”直接推出旧约解除，效力由真实当事人/有权机构解释；录取事实PASS_FACT但解除问题NEEDS_HUMAN_DECISION；缺页UNREADABLE、权威源断SOURCE_UNAVAILABLE；双方/学校办理人员。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R021",
    "title": "纸质协议遗失、污损及补领候选",
    "requirement": "R021 纸质协议遗失、污损及补领候选；L0/L1 P09；T=历史纸约遗失/污损事实被提出；F=有原件、仅普通线上签约；?=学校现行补领制度未知；SRC-005（唯一旧校本线索）；F003/F004/F014—F016/F038；M003/M024/M025；原纸质存档/污损证据与旧约编号匹配；2018登报、纸三联、导师签字与五月领新约无现行性证明；不得将补领当旧约解约；遗失/污损事实可PASS_FACT，程序及表单一律POLICY_UNCONFIRMED；研究生院/就业中心核定。来源状态：UNCONFIRMED。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R022",
    "title": "撤回、补件、复核请求绑定与权限",
    "requirement": "R022 撤回、补件、复核请求绑定与权限；Lx P11/P12；T=已有可核申请请求；F=无Lx动作；?=目标申请/允许范围未明；SRC-003（只证办理链存在）；F008/F010/F011/F041/F042；M002/M022/M023/M027；比申请号、发起人身份、原申请阶段、请求时间、申请版本与其权限；撤回申请≠撤销合同，已有学校决定不可由前台回退；请求受理事实PASS_FACT（不是准撤回/复核结果）；期限/权限POLICY_UNCONFIRMED、跨案CONFLICT；有权受理/复核岗。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R023",
    "title": "材料替换、结论失效与局部重审",
    "requirement": "R023 材料替换、结论失效与局部重审；任一L/Lx；T=材料/上游引用版本有变化；F=指纹及上游版本皆未变；?=历史版本追溯缺失；SRC-001/003（仅流程线索）；F010/F011/F016/F026/F031—F033/F038/F042；M003/M009/M014/M015/M016/M023/M027；记录旧/新sha、父版本、归属及变更字段，撤销依赖此证据的事实预审缓存有效性，不撤销学校真实决定；重审仅依赖R，校审签发历史追加不可覆盖；正确版本链PASS_FACT；记录改写CONFLICT，源断SOURCE_UNAVAILABLE，涉及正式决定变更NEEDS_HUMAN_DECISION；案卷Owner/学校有权复核岗。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R024",
    "title": "去向登记与其他业务只读冲突",
    "requirement": "R024 去向登记与其他业务只读冲突；L5或邻接异常；T=要读去向/档案/离校/毕业授位结论；F=本阶段无跨事项引用；?=Owner不可访问；SRC-006/007；F027/F040；M010/M026；只读比较Owner、业务对象、决定ID、版本、生效时点与本约引用；省平台协议结果不等于国台去向；2023后不得要求报到证改派；上游结论被正确引用PASS_FACT，差异CONFLICT仅作为转交问题、源断SOURCE_UNAVAILABLE；去向/档案/离校/学籍对应Owner。来源状态：VERIFIED。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "semantic",
    "targetScope": "case"
  }
] satisfies NonNullable<TemplateVersion['sections']>[number]['criteria']

export const templateVersion: TemplateVersion = {
  templateId: "S07-T05",
  version: 1,
  schemaVersion: 2,
  name: "毕业就业协议签约、解约与重新签约资格及程序审核",
  description: '本地研究模板 · 非校方正式模板。政策证据状态：PARTIAL。用于事实核验、材料覆盖检查与人工复核，不得自动形成学校正式批准或拒绝。',
  catalogKind: 'builtin',
  sourceNote: 'R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板由研究原件转为本地草稿，非成都理工大学正式模板；SRC 仅是研究来源索引，不是案卷材料 SourceRef；无 PolicyVersion 绑定，不执行学校远端回写。',
  objectType: 'person',
  displayName: { template: "{{F002}} · S07-T05" },
  fields: fieldDefinitions,
  materialSlots: materialSlotDefinitions,
  sections: [{ id: 'rules', name: '原件规则核验项', description: '逐项对应研究原件第08节规则 ID；研究标准不等于校方正式政策，政策与权限未确认时必须人工复核。', order: 0, required: true, criteria }],
  policyVersionIds: [],
  stages: [
    { id: 'intake', name: "L0 识别与分流（本地身份/协议事实核验）", kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'evidence-review', workflowOwner: 'local' },
    { id: 'evidence-review', name: "L1/L2 申请、邀请、相对方响应与签署材料事实核验", kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'policy-confirmation', returnToStageId: 'intake', workflowOwner: 'local' },
    { id: 'policy-confirmation', name: "L3/L4 学院/学校后续审批回执存在性核验（不代审批）", kind: 'manual-review', executorRole: 'teacher', nextStageId: 'local-review', returnToStageId: 'evidence-review', workflowOwner: 'local' },
    { id: 'local-review', name: "L5 系统后续确认/关联（仅只读权威回执）", kind: 'manual-review', executorRole: 'teacher', nextStageId: 'local-summary', returnToStageId: 'policy-confirmation', workflowOwner: 'local' },
    { id: 'local-summary', name: "Lx 补件、撤回、复核入口（仅生成本地待办）", kind: 'finalize', executorRole: 'teacher', workflowOwner: 'local' }
  ],
  outputs: [{ id: 'fact-review-feedback', kind: 'item-feedback', audience: 'reviewer' }, { id: 'supplement-and-confirmation-todo', kind: 'supplement-list', audience: 'teacher' }],
  autoPassPolicy: { enabled: false },
  status: 'draft',
  createdAt: '2026-10-24T03:12:00+08:00'
}

export const r02Metadata: R02Metadata = {
  templateId: "S07-T05",
  name: "毕业就业协议签约、解约与重新签约资格及程序审核",
  sourceDocumentPath: "docs/design/review-agent/business-templates/R02/S07-T05.md",
  sourceDocumentSha256: "c742a0df9f2354109a9e316a46eb421de92142272991125e5455ddc39e562952",
  researchOriginalPath: "docs/design/review-agent/business-templates/R02/research-original/S07-T05.md",
  researchOriginalSha256: "41d56364b89b8353552c4cfd2eee022a7e28580a937a7b6f766efd4bdfad7cea",
  officialSchoolTemplate: false,
  researchDate: '2026-10-24',
  policyEvidenceStatus: 'PARTIAL',
  sourceStatus: {
  "SRC-001": "VERIFIED",
  "SRC-002": "VERIFIED",
  "SRC-003": "PARTIAL",
  "SRC-004": "PARTIAL",
  "SRC-005": "UNCONFIRMED",
  "SRC-006": "VERIFIED",
  "SRC-007": "VERIFIED",
  "SRC-008": "CROSS_SCHOOL_ONLY"
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
      "SRC-002",
      "SRC-003",
      "SRC-005"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R003",
    "sourceIds": [
      "SRC-001",
      "SRC-004"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R004",
    "sourceIds": [
      "SRC-003",
      "SRC-004"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R005",
    "sourceIds": [
      "SRC-001",
      "SRC-004",
      "SRC-005"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R006",
    "sourceIds": [
      "SRC-001",
      "SRC-004"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R007",
    "sourceIds": [
      "SRC-001",
      "SRC-004"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R008",
    "sourceIds": [
      "SRC-004"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R009",
    "sourceIds": [
      "SRC-004"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R010",
    "sourceIds": [
      "SRC-001",
      "SRC-002"
    ],
    "evidenceStatus": "VERIFIED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R011",
    "sourceIds": [
      "SRC-001",
      "SRC-002",
      "SRC-004"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R012",
    "sourceIds": [
      "SRC-001",
      "SRC-002",
      "SRC-006"
    ],
    "evidenceStatus": "VERIFIED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R013",
    "sourceIds": [
      "SRC-001",
      "SRC-003",
      "SRC-004"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R014",
    "sourceIds": [
      "SRC-001",
      "SRC-004"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R015",
    "sourceIds": [
      "SRC-001",
      "SRC-005"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R016",
    "sourceIds": [
      "SRC-003"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R017",
    "sourceIds": [
      "SRC-003"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R018",
    "sourceIds": [
      "SRC-003",
      "SRC-004",
      "SRC-008"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R019",
    "sourceIds": [
      "SRC-001",
      "SRC-003",
      "SRC-004",
      "SRC-005"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R020",
    "sourceIds": [
      "SRC-001",
      "SRC-002",
      "SRC-005"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R021",
    "sourceIds": [
      "SRC-005"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R022",
    "sourceIds": [
      "SRC-003"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R023",
    "sourceIds": [
      "SRC-001",
      "SRC-003"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R024",
    "sourceIds": [
      "SRC-006",
      "SRC-007"
    ],
    "evidenceStatus": "VERIFIED"
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
    "scope": "全国毕业去向登记与本人离校确认；不授予学校就业协议签解约批准权限"
  }
]
}
