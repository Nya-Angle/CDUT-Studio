import type { TemplateVersion } from '@profer/shared'
export type { TemplateVersion } from '@profer/shared'

export type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED' | 'HISTORICAL' | 'CROSS_SCHOOL_ONLY'
export type R02PolicyEvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
export interface R02CriterionMetadata { sectionId: string; criterionId: string; sourceIds: string[]; evidenceStatus: R02EvidenceStatus }
export interface R02Metadata { templateId: string; name: string; sourceDocumentPath: string; sourceDocumentSha256: string; researchOriginalPath: string; researchOriginalSha256: string; officialSchoolTemplate: false; researchDate: string; policyEvidenceStatus: R02PolicyEvidenceStatus; sourceStatus: Record<string, R02EvidenceStatus>; criteria: R02CriterionMetadata[]; externalPolicyReferences: Array<{id:string;title:string;documentNo:string;publishedAt:string;url:string;evidenceStatus:R02EvidenceStatus;scope:string}> }

const fieldDefinitions = [
  {
    "key": "F001",
    "label": "F001 · case_id / UUID",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F001；case_id / UUID；L0 后端案卷；M；不可缺，阻断建立。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F002",
    "label": "F002 · applicant_subject_ref / opaque ID",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F002；applicant_subject_ref / opaque ID；L1 受信认证；H；`SOURCE_UNAVAILABLE`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F003",
    "label": "F003 · enrollment_record_ref / opaque ID",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F003；enrollment_record_ref / opaque ID；L0 学籍权威记录；H；`SOURCE_UNAVAILABLE`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F004",
    "label": "F004 · education_level / 枚举本科/硕士/博士/其他",
    "kind": "enum",
    "required": false,
    "visibility": "internal",
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
    "readOnly": true,
    "extractionHint": "来源字段字典：F004；education_level / 枚举本科/硕士/博士/其他；L0 学籍记录；H；`NEEDS_MATERIAL` 请求权威核实。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F005",
    "label": "F005 · student_category / 枚举普通/留学/非全/其他",
    "kind": "enum",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "options": [
      {
        "value": "普通",
        "label": "普通"
      },
      {
        "value": "留学",
        "label": "留学"
      },
      {
        "value": "非全",
        "label": "非全"
      },
      {
        "value": "其他",
        "label": "其他"
      }
    ],
    "readOnly": false,
    "extractionHint": "来源字段字典：F005；student_category / 枚举普通/留学/非全/其他；L0 学籍记录；H；`POLICY_UNCONFIRMED`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F006",
    "label": "F006 · admission_cohort / 年度/批次",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F006；admission_cohort / 年度/批次；L2 学籍记录；H；`NEEDS_MATERIAL`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F007",
    "label": "F007 · program_plan_id_version / 字符串+版本",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F007；program_plan_id_version / 字符串+版本；L2 主管部门培养方案；M；`SOURCE_UNAVAILABLE`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F008",
    "label": "F008 · legacy_status / 结业/毕业/在读/肄业/未知",
    "kind": "enum",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "options": [
      {
        "value": "结业",
        "label": "结业"
      },
      {
        "value": "毕业",
        "label": "毕业"
      },
      {
        "value": "在读",
        "label": "在读"
      },
      {
        "value": "肄业",
        "label": "肄业"
      },
      {
        "value": "未知",
        "label": "未知"
      }
    ],
    "readOnly": true,
    "extractionHint": "来源字段字典：F008；legacy_status / 结业/毕业/在读/肄业/未知；L0 正式学籍决定；H；冲突 `CONFLICT`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F009",
    "label": "F009 · legacy_decision_id_date / ID+日期",
    "kind": "date",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F009；legacy_decision_id_date / ID+日期；L0 原结业归档；H；`SOURCE_UNAVAILABLE`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F010",
    "label": "F010 · legacy_certificate_ref_status / ID+枚举",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F010；legacy_certificate_ref_status / ID+枚举；L0 校方证书登记；H；`SOURCE_UNAVAILABLE`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F011",
    "label": "F011 · application_type / 换证/其他",
    "kind": "enum",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "options": [
      {
        "value": "换证",
        "label": "换证"
      },
      {
        "value": "其他",
        "label": "其他"
      }
    ],
    "readOnly": false,
    "extractionHint": "来源字段字典：F011；application_type / 换证/其他；L1 本人申请；M；不符 `NOT_APPLICABLE`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F012",
    "label": "F012 · submitted_at / 带时区时间",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F012；submitted_at / 带时区时间；L1 可信受理系统；M；待核受理时点。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F013",
    "label": "F013 · requester_capacity / 本人/代理/未知",
    "kind": "enum",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "options": [
      {
        "value": "本人",
        "label": "本人"
      },
      {
        "value": "代理",
        "label": "代理"
      },
      {
        "value": "未知",
        "label": "未知"
      }
    ],
    "readOnly": false,
    "extractionHint": "来源字段字典：F013；requester_capacity / 本人/代理/未知；L1 认证及合法授权；H；`NEEDS_HUMAN_DECISION`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F014",
    "label": "F014 · policy_ref_version / SRC+版本+适用裁定",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F014；policy_ref_version / SRC+版本+适用裁定；L2 学校归口制度确认；L；`POLICY_UNCONFIRMED`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F015",
    "label": "F015 · max_study_end / 日期+例外说明",
    "kind": "date",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F015；max_study_end / 日期+例外说明；L2 权威学籍期限计算；H；`POLICY_UNCONFIRMED`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F016",
    "label": "F016 · remedial_route / 重修/论文/其他",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F016；remedial_route / 重修/论文/其他；L2 现行制度与计划；M；`POLICY_UNCONFIRMED`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F017",
    "label": "F017 · missing_requirement_set / 结构化清单+版本",
    "kind": "object",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F017；missing_requirement_set / 结构化清单+版本；L2 官方毕业要求审查；H；`SOURCE_UNAVAILABLE`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F018",
    "label": "F018 · remedial_result_ref / 多条权威成绩/结果 ID",
    "kind": "rows",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F018；remedial_result_ref / 多条权威成绩/结果 ID；L3–L4 教务/培养系统；H；阶段未到不报缺。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F019",
    "label": "F019 · remediation_completed_at / 日期",
    "kind": "date",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F019；remediation_completed_at / 日期；L4 权威结果；H；无法核实按来源不可用。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F020",
    "label": "F020 · graduate_attainment_decision_ref / 结论 ID+状态+版本",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F020；graduate_attainment_decision_ref / 结论 ID+状态+版本；L4 官方毕业资格确认；H；`NEEDS_HUMAN_DECISION`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F021",
    "label": "F021 · thesis_review_ref / ID+状态+版本",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F021；thesis_review_ref / ID+状态+版本；L3–L4 研究生论文系统；H；仅触发时检查。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F022",
    "label": "F022 · defense_result_ref / ID+状态+版本",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F022；defense_result_ref / ID+状态+版本；L4 正式答辩记录；H；仅触发时检查。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F023",
    "label": "F023 · application_revision / 正整数",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F023；application_revision / 正整数；L1/LX 申请事件服务；M；默认首版 1（系统生成）。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F024",
    "label": "F024 · evidence_version_map / 对象→版本/hash",
    "kind": "rows",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F024；evidence_version_map / 对象→版本/hash；全阶段证据仓；M；无归属不参与匹配。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F025",
    "label": "F025 · authorized_decision_actor_ref / opaque 服务身份",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "来源字段字典：F025；authorized_decision_actor_ref / opaque 服务身份；L6 服务端 RBAC/ABAC；H；`NEEDS_HUMAN_DECISION`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F026",
    "label": "F026 · replacement_decision_ref / ID+状态+时间",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F026；replacement_decision_ref / ID+状态+时间；L6 正式决策系统；H；决策前 `NOT_APPLICABLE`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F027",
    "label": "F027 · replacement_certificate_registration_ref / ID+回执",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F027；replacement_certificate_registration_ref / ID+回执；L7 证书/学历注册系统；H；决定前 `NOT_APPLICABLE`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  },
  {
    "key": "F028",
    "label": "F028 · withdrawal_or_review_event / 类型+受理+决定+版本",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "来源字段字典：F028；withdrawal_or_review_event / 类型+受理+决定+版本；LX 真实流程服务；H；未知权限 `POLICY_UNCONFIRMED`。仅采集本案最小必要信息；权威来源不可用或适用性未知时不得猜测，转人工复核。",
    "displayHint": "本地研究模板字段，不代表校方正式字段/必填要求。"
  }
] satisfies TemplateVersion['fields']
const materialSlotDefinitions = [
  {
    "id": "M001",
    "name": "M001 · 本人实名申请/受信身份断言；认证服务，可替代纸质身份证复印件",
    "purpose": "原件材料槽字典：本人实名申请/受信身份断言；认证服务，可替代纸质身份证复印件；L1；F002/F013；R001/R004；SRC-011。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "本人实名申请/受信身份断言；认证服务，可替代纸质身份证复印件",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M002",
    "name": "M002 · 原结业决定及权威学籍状态；学籍服务/档案正式认证摘要，上传结业证仅线索",
    "purpose": "原件材料槽字典：原结业决定及权威学籍状态；学籍服务/档案正式认证摘要，上传结业证仅线索；L0；F003/F008/F009；R002/R003；SRC-001/002/005。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "原结业决定及权威学籍状态；学籍服务/档案正式认证摘要，上传结业证仅线索",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M003",
    "name": "M003 · 原结业证及校方登记对应关系；证书记录回执替代原件图",
    "purpose": "原件材料槽字典：原结业证及校方登记对应关系；证书记录回执替代原件图；L0；F010；R003；SRC-001/011。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "原结业证及校方登记对应关系；证书记录回执替代原件图",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M004",
    "name": "M004 · 有版本的现行/历史规章及归口适用意见；制度库/签署解释",
    "purpose": "原件材料槽字典：有版本的现行/历史规章及归口适用意见；制度库/签署解释；L2；F004–F006/F014；R005/R006；SRC-001–005/010/011。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "有版本的现行/历史规章及归口适用意见；制度库/签署解释",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M005",
    "name": "M005 · 人员学籍批次与期限/例外官方计算；学籍服务回执",
    "purpose": "原件材料槽字典：人员学籍批次与期限/例外官方计算；学籍服务回执；L2；F006/F015；R007；SRC-001/002/005。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "人员学籍批次与期限/例外官方计算；学籍服务回执",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M006",
    "name": "M006 · 适用培养方案及毕业要求/结业缺项清单；主管培养部门",
    "purpose": "原件材料槽字典：适用培养方案及毕业要求/结业缺项清单；主管培养部门；L2；F007/F017；R008；SRC-001/002/005。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "适用培养方案及毕业要求/结业缺项清单；主管培养部门",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M007",
    "name": "M007 · 换证申请及事项声明、收件回执；电子受理回执替代纸表",
    "purpose": "原件材料槽字典：换证申请及事项声明、收件回执；电子受理回执替代纸表；L1；F011/F012/F023；R001/R009；SRC-006/007。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "换证申请及事项声明、收件回执；电子受理回执替代纸表",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M008",
    "name": "M008 · 代理权限/委托证明；合法授权系统与工作人员核验结果",
    "purpose": "原件材料槽字典：代理权限/委托证明；合法授权系统与工作人员核验结果；仅代理 L1；F013；R004；SRC-006/007（正文未取得）。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "代理权限/委托证明；合法授权系统与工作人员核验结果",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M009",
    "name": "M009 · 本科重修权威成绩与完成记录；教务服务",
    "purpose": "原件材料槽字典：本科重修权威成绩与完成记录；教务服务；本科 L3–L4；F016/F018/F019；R010；SRC-001/005。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "本科重修权威成绩与完成记录；教务服务",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M010",
    "name": "M010 · 学业达标/毕业资格正式确认；主管部门正式结论 ID",
    "purpose": "原件材料槽字典：学业达标/毕业资格正式确认；主管部门正式结论 ID；L4；F017/F020；R011；SRC-001/002/005/011。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "学业达标/毕业资格正式确认；主管部门正式结论 ID",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M011",
    "name": "M011 · 研究生结业后送审审批及预答辩结果；导师、分委员会、研究生院",
    "purpose": "原件材料槽字典：研究生结业后送审审批及预答辩结果；导师、分委员会、研究生院；研究生相应 L3；F021；R012；SRC-004。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "研究生结业后送审审批及预答辩结果；导师、分委员会、研究生院",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M012",
    "name": "M012 · 正式论文评阅及复评结果；盲审系统受限摘要",
    "purpose": "原件材料槽字典：正式论文评阅及复评结果；盲审系统受限摘要；研究生送审后 L3–L4；F021；R013；SRC-004。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "正式论文评阅及复评结果；盲审系统受限摘要",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M013",
    "name": "M013 · 正式答辩结论；有权答辩归档",
    "purpose": "原件材料槽字典：正式答辩结论；有权答辩归档；研究生答辩后 L4；F022；R014；SRC-002/004。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "正式答辩结论；有权答辩归档",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M014",
    "name": "M014 · 国际学生类别/专门归口确认；国际学生管理部门权威记录",
    "purpose": "原件材料槽字典：国际学生类别/专门归口确认；国际学生管理部门权威记录；留学 L2；F005/F014；R015；SRC-005。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "国际学生类别/专门归口确认；国际学生管理部门权威记录",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M015",
    "name": "M015 · 差异核对、补件说明及重传证据；申请人与原权威持有者",
    "purpose": "原件材料槽字典：差异核对、补件说明及重传证据；申请人与原权威持有者；LX；F018/F023/F024；R016；SRC-001/011。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "差异核对、补件说明及重传证据；申请人与原权威持有者",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M016",
    "name": "M016 · 有效签批决定、授权主体和完整审计链；校方决策系统",
    "purpose": "原件材料槽字典：有效签批决定、授权主体和完整审计链；校方决策系统；L6；F025/F026；R017；SRC-001/002/011。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "有效签批决定、授权主体和完整审计链；校方决策系统",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M017",
    "name": "M017 · 换发证书、旧证处置和学历电子注册回执；校方证书系统",
    "purpose": "原件材料槽字典：换发证书、旧证处置和学历电子注册回执；校方证书系统；L7；F027；R018；SRC-001/011。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "换发证书、旧证处置和学历电子注册回执；校方证书系统",
      "核验材料主体与本案申请人/对象一致",
      "保留原始版本、形成时间、签发主体和可追溯定位",
      "无法验真、制度适用未知或授权不明时人工复核"
    ],
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M018",
    "name": "M018 · 撤回、异议、复核请求及正式受理/回复；申请人和校方流程服务",
    "purpose": "原件材料槽字典：撤回、异议、复核请求及正式受理/回复；申请人和校方流程服务；LX；F028；R019；SRC-001/011（专门程序待核）。条件性材料按实际阶段与适用规则核对，不得仅因未到产生阶段而报缺件；政策未确认时转人工复核。",
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
      "撤回、异议、复核请求及正式受理/回复；申请人和校方流程服务",
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
    "title": "本人身份和换证请求属同一主体",
    "requirement": "R001；L1 所有申请：本人身份和换证请求属同一主体；F002/F011，M001/M007，SRC-011；相符 PASS_FACT；其他目的 NOT_APPLICABLE；无可信认证 SOURCE_UNAVAILABLE→身份管理员。来源状态：VERIFIED。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R002",
    "title": "存在有效结业而非在读/肄业记录",
    "requirement": "R002；L0 申请：存在有效结业而非在读/肄业记录；F003/F008/F009，M002，SRC-001/002/005；是 PASS_FACT；否路由 NOT_APPLICABLE；互相抵触 CONFLICT→学籍归口。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R003",
    "title": "原证与原结业学籍/登记同人同状态",
    "requirement": "R003；L0：原证与原结业学籍/登记同人同状态；F009/F010，M002/M003，SRC-001/011；匹配 PASS_FACT；仅图片 SOURCE_UNAVAILABLE；冲突 CONFLICT→证书管理。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R004",
    "title": "授权代理关系与范围",
    "requirement": "R004；L1 代理分支：授权代理关系与范围；F013，M001/M008，SRC-011/006；非代理 NOT_APPLICABLE；材料齐但权限未证 POLICY_UNCONFIRMED→受理人员。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R005",
    "title": "学段、类别、政策适用版本一致",
    "requirement": "R005；L2：学段、类别、政策适用版本一致；F004–F006/F014，M004，SRC-001–005/010；有受信归口匹配 PASS_FACT；研究生新规正文未知 POLICY_UNCONFIRMED→制度归口。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R006",
    "title": "校本换证路径是否存在且覆盖该人群",
    "requirement": "R006；L2：校本换证路径是否存在且覆盖该人群；F005/F014/F016，M004，SRC-001/002/005/011；适用已确认 PASS_FACT；特殊群体未证 POLICY_UNCONFIRMED→主管部门。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R007",
    "title": "提交时点与个体期限/例外关系",
    "requirement": "R007；L2：提交时点与个体期限/例外关系；F006/F012/F014/F015，M004/M005，SRC-001/002/005；期限由权威确认且落窗 PASS_FACT；超期事实转 NEEDS_HUMAN_DECISION；未确 POLICY_UNCONFIRMED→学籍归口。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R008",
    "title": "培养方案版本与结业未达标项归属",
    "requirement": "R008；L2：培养方案版本与结业未达标项归属；F007/F017，M006，SRC-001/002/005；有权确认 PASS_FACT；官方清单缺 SOURCE_UNAVAILABLE→教务/培养。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R009",
    "title": "申请回执、申请对象和版本一致",
    "requirement": "R009；L1：申请回执、申请对象和版本一致；F003/F011/F012/F023，M007，SRC-006/007/011；一致 PASS_FACT；表单形式不明 POLICY_UNCONFIRMED；缺提交事实 NEEDS_MATERIAL→受理。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R010",
    "title": "本科 L4 重修完成：对应欠项的官方成绩与时间",
    "requirement": "R010；本科 L4 重修完成：对应欠项的官方成绩与时间；F017–F019，M006/M009，SRC-001/005；全项官方完成 PASS_FACT；仍未完成转 NEEDS_HUMAN_DECISION；未到 L4 NOT_APPLICABLE→教务。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R011",
    "title": "官方毕业条件达标结论已形成且指向该结业记录",
    "requirement": "R011；L4：官方毕业条件达标结论已形成且指向该结业记录；F003/F017/F020，M006/M010，SRC-001/002/005/011；受信达标结论 PASS_FACT；未有权确认 NEEDS_HUMAN_DECISION；待完成阶段不报缺→主管部门。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R012",
    "title": "研究生已启动结业后送审：送审审批链和预答辩事实",
    "requirement": "R012；研究生已启动结业后送审：送审审批链和预答辩事实；F004/F021，M011，SRC-004；环节成立 PASS_FACT；只上传论文 NEEDS_MATERIAL；未送审阶段 NOT_APPLICABLE→研究生院。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R013",
    "title": "研究生送审完成：正式评阅结论同人同稿版本",
    "requirement": "R013；研究生送审完成：正式评阅结论同人同稿版本；F021/F024，M012，SRC-004；匹配 PASS_FACT；存在争议 NEEDS_HUMAN_DECISION；不可读 UNREADABLE→论文归口。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R014",
    "title": "研究生答辩后：正式答辩结果和人、论文版本一致",
    "requirement": "R014；研究生答辩后：正式答辩结果和人、论文版本一致；F022/F024，M013，SRC-002/004；一致 PASS_FACT；缺系统决定 SOURCE_UNAVAILABLE；未来答辩 NOT_APPLICABLE→研究生归口。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R015",
    "title": "国际学生 L2：身份类别及交叉适用解释",
    "requirement": "R015；国际学生 L2：身份类别及交叉适用解释；F005/F014，M004/M014，SRC-005/003；身份确认 PASS_FACT；新旧规冲突 POLICY_UNCONFIRMED→国际处与研究生院。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R016",
    "title": "每一变更证据的主体、源、版本与哈希",
    "requirement": "R016；LX 重传/补件：每一变更证据的主体、源、版本与哈希；F003/F023/F024，M015，SRC-001/011；同对象可核 PASS_FACT；错人 CONFLICT；损坏 UNREADABLE→材料持有者。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R017",
    "title": "学校换证决定来自有权身份、指向本案且不可变留痕",
    "requirement": "R017；L6：学校换证决定来自有权身份、指向本案且不可变留痕；F025/F026，M016，SRC-001/002/011；真实决定存在 PASS_FACT（仅决定存在事实）；权限未证 NEEDS_HUMAN_DECISION；L6 前 NOT_APPLICABLE→有权校方。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R018",
    "title": "实际证书登记、发证日及原证处置与批准决定一致",
    "requirement": "R018；L7：实际证书登记、发证日及原证处置与批准决定一致；F026/F027，M016/M017，SRC-001/011；一致 PASS_FACT；冲突 CONFLICT；决定前 NOT_APPLICABLE→证书归口。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R019",
    "title": "请求身份、受理/决定事件及有效程序",
    "requirement": "R019；LX 撤回/复核：请求身份、受理/决定事件及有效程序；F002/F026/F028，M001/M016/M018，SRC-001/011；事件真值可核 PASS_FACT，是否受理/改变原决定 NEEDS_HUMAN_DECISION；无专门办法 POLICY_UNCONFIRMED→申诉/业务归口。来源状态：PARTIAL。政策/授权未确认时仅输出事实核验与待确认问题，不得自动形成校方正式通过或拒绝。",
    "execution": "manual",
    "targetScope": "case"
  }
] satisfies NonNullable<TemplateVersion['sections']>[number]['criteria']

export const templateVersion: TemplateVersion = {
  templateId: "S07-T08",
  version: 1,
  schemaVersion: 2,
  name: "结业后达标申请换发毕业证资格审核",
  description: '本地研究模板 · 非校方正式模板。政策证据状态：PARTIAL。用于事实核验、材料覆盖检查与人工复核，不得自动形成学校正式批准或拒绝。',
  catalogKind: 'builtin',
  sourceNote: 'R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板由研究原件转为本地草稿，非成都理工大学正式模板；SRC 仅是研究来源索引，不是案卷材料 SourceRef；无 PolicyVersion 绑定，不执行学校远端回写。',
  objectType: 'person',
  displayName: { template: "S07-T08 · 结业后达标申请换发毕业证" },
  fields: fieldDefinitions,
  materialSlots: materialSlotDefinitions,
  sections: [{ id: 'rules', name: '原件规则核验项', description: '逐项对应研究原件第08节规则 ID；研究标准不等于校方正式政策，政策与权限未确认时必须人工复核。', order: 0, required: true, criteria }],
  policyVersionIds: [],
  stages: [
    { id: 'intake', name: "L0 结业/学籍权威记录与申请主体核验", kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'evidence-review', workflowOwner: 'local' },
    { id: 'evidence-review', name: "L1 本人申请与补件事实", kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'policy-confirmation', returnToStageId: 'intake', workflowOwner: 'local' },
    { id: 'policy-confirmation', name: "L2 现行制度、培养方案、最长修业年限适用性确认", kind: 'manual-review', executorRole: 'teacher', nextStageId: 'local-review', returnToStageId: 'evidence-review', workflowOwner: 'local' },
    { id: 'local-review', name: "L3/L4 重修/论文/答辩结果与毕业资格正式决定（只读）", kind: 'manual-review', executorRole: 'teacher', nextStageId: 'local-summary', returnToStageId: 'policy-confirmation', workflowOwner: 'local' },
    { id: 'local-summary', name: "L5/L6/L7 校方换证决定与证书/学历登记回执（只读；LX仅路由待办）", kind: 'finalize', executorRole: 'teacher', workflowOwner: 'local' }
  ],
  outputs: [{ id: 'fact-review-feedback', kind: 'item-feedback', audience: 'reviewer' }, { id: 'supplement-and-confirmation-todo', kind: 'supplement-list', audience: 'teacher' }],
  autoPassPolicy: { enabled: false },
  status: 'draft',
  createdAt: '2026-10-24T03:12:00+08:00'
}

export const r02Metadata: R02Metadata = {
  templateId: "S07-T08",
  name: "结业后达标申请换发毕业证资格审核",
  sourceDocumentPath: "docs/design/review-agent/business-templates/R02/S07-T08.md",
  sourceDocumentSha256: "4a0f7ea71cfd4640d019a260b9e33206300afb4914f4605797c504bf40913e25",
  researchOriginalPath: "docs/design/review-agent/business-templates/R02/research-original/S07-T08.md",
  researchOriginalSha256: "6abee9f18c47285b202a80c7d43c97007660db345f3349395b84cc85978c3795",
  officialSchoolTemplate: false,
  researchDate: '2026-10-24',
  policyEvidenceStatus: 'PARTIAL',
  sourceStatus: {
  "SRC-001": "PARTIAL",
  "SRC-002": "HISTORICAL",
  "SRC-003": "UNCONFIRMED",
  "SRC-004": "PARTIAL",
  "SRC-005": "PARTIAL",
  "SRC-006": "UNCONFIRMED",
  "SRC-007": "UNCONFIRMED",
  "SRC-008": "UNCONFIRMED",
  "SRC-009": "PARTIAL",
  "SRC-010": "PARTIAL",
  "SRC-011": "VERIFIED",
  "SRC-012": "HISTORICAL"
},
  criteria: [
  {
    "sectionId": "rules",
    "criterionId": "R001",
    "sourceIds": [
      "SRC-011"
    ],
    "evidenceStatus": "VERIFIED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R002",
    "sourceIds": [
      "SRC-001",
      "SRC-002",
      "SRC-005"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R003",
    "sourceIds": [
      "SRC-001",
      "SRC-011"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R004",
    "sourceIds": [
      "SRC-006",
      "SRC-011"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R005",
    "sourceIds": [
      "SRC-001",
      "SRC-002",
      "SRC-003",
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
      "SRC-002",
      "SRC-005",
      "SRC-011"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R007",
    "sourceIds": [
      "SRC-001",
      "SRC-002",
      "SRC-005"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R008",
    "sourceIds": [
      "SRC-001",
      "SRC-002",
      "SRC-005"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R009",
    "sourceIds": [
      "SRC-006",
      "SRC-007",
      "SRC-011"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R010",
    "sourceIds": [
      "SRC-001",
      "SRC-005"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R011",
    "sourceIds": [
      "SRC-001",
      "SRC-002",
      "SRC-005",
      "SRC-011"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R012",
    "sourceIds": [
      "SRC-004"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R013",
    "sourceIds": [
      "SRC-004"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R014",
    "sourceIds": [
      "SRC-002",
      "SRC-004"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R015",
    "sourceIds": [
      "SRC-003",
      "SRC-005"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R016",
    "sourceIds": [
      "SRC-001",
      "SRC-011"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R017",
    "sourceIds": [
      "SRC-001",
      "SRC-002",
      "SRC-011"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R018",
    "sourceIds": [
      "SRC-001",
      "SRC-011"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R019",
    "sourceIds": [
      "SRC-001",
      "SRC-011"
    ],
    "evidenceStatus": "PARTIAL"
  }
],
  externalPolicyReferences: [
  {
    "id": "EXT-POLICY-001",
    "title": "普通高等学校学生管理规定",
    "documentNo": "教育部令第41号",
    "publishedAt": "2017-02-04",
    "url": "https://www.moe.gov.cn/jyb_xxgk/xxgk/zhengce/guizhang/201702/t20170216_296385.html",
    "evidenceStatus": "VERIFIED",
    "scope": "第33条：结业后补考/重修/毕业设计/论文/答辩及是否颁证由学校规定；不提供成都理工大学现行期限"
  }
]
}
