import type { TemplateVersion } from '@profer/shared'

/** 本地研究模板；不代表学校已发布或授权。 */
export const S03T13: TemplateVersion = {
  "templateId": "S03-T13",
  "version": 1,
  "schemaVersion": 2,
  "name": "新生入学“绿色通道”学费缓缴资格审核",
  "description": "新生入学“绿色通道”学费缓缴资格审核。本地研究模板 · 非校方正式模板。仅供事实核验和人工复核建议；不得代替校本制度或正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 来源 docs/design/review-agent/business-templates/R02/research-original/S03-T13.md；非校方正式模板。政策证据 PARTIAL；当期校本授权和最终决定未确认，不创建政策版本，不作学校远端回写。",
  "objectType": "person",
  "displayName": {
    "template": "{{applicant_id}} · 新生入学“绿色通道”学费缓缴资格审核"
  },
  "fields": [
    {
      "key": "applicant_id",
      "label": "applicant_id（F001）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "admission_batch",
      "label": "admission_batch（F002）",
      "kind": "text",
      "required": true,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "education_level",
      "label": "education_level（F003）",
      "kind": "enum",
      "required": true,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "campus",
      "label": "campus（F004）",
      "kind": "enum",
      "required": true,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "application_actor",
      "label": "application_actor（F005）",
      "kind": "text",
      "required": true,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "self_confirmation",
      "label": "self_confirmation（F006）",
      "kind": "boolean",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "fee_period",
      "label": "fee_period（F007）",
      "kind": "text",
      "required": true,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "fee_item",
      "label": "fee_item（F008）",
      "kind": "enum",
      "required": true,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "tuition_due",
      "label": "tuition_due（F009）",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "tuition_paid",
      "label": "tuition_paid（F010）",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "tuition_outstanding",
      "label": "tuition_outstanding（F011）",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "requested_defer_amount",
      "label": "requested_defer_amount（F012）",
      "kind": "number",
      "required": true,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "hardship_statement",
      "label": "hardship_statement（F013）",
      "kind": "text",
      "required": true,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "hardship_evidence_status",
      "label": "hardship_evidence_status（F014）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "prior_hardship_decision",
      "label": "prior_hardship_decision（F015）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "loan_state",
      "label": "loan_state（F016）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "loan_evidence_ref",
      "label": "loan_evidence_ref（F017）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "promised_payment_date",
      "label": "promised_payment_date（F018）",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "form_version",
      "label": "form_version（F019）",
      "kind": "text",
      "required": true,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "submitted_at",
      "label": "submitted_at（F020）",
      "kind": "text",
      "required": true,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "counselor_opinion",
      "label": "counselor_opinion（F021）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "college_opinion",
      "label": "college_opinion（F022）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "approved_decision",
      "label": "approved_decision（F023）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "decision_authority",
      "label": "decision_authority（F024）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "enrollment_status",
      "label": "enrollment_status（F025）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "payment_ledger_event",
      "label": "payment_ledger_event（F026）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "withdrawal_request",
      "label": "withdrawal_request（F027）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "review_request",
      "label": "review_request（F028）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "case_version",
      "label": "case_version（F029）",
      "kind": "text",
      "required": true,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "evidence_binding",
      "label": "evidence_binding（F030）",
      "kind": "text",
      "required": true,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "policy_batch_config",
      "label": "policy_batch_config（F031）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "review_outcome",
      "label": "review_outcome（F032）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "录取身份与学段校区",
      "purpose": "录取身份与学段校区；招生机构/学生；P0 必；可信招生接口优先，录取通知书仅待核线索；缺接口 SOURCE_UNAVAILABLE。F001–F004；R001–R002；SRC-001/003",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 1,
      "maxCount": 20,
      "requiredElements": [
        "录取身份与学段校区；招生机构/学生；P0 必；可信招生接口优先，录取通知书仅待核线索；缺接口 SOURCE_UNAVAILABLE。F001–F004；R001–R002；SRC-001/003"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M002",
      "name": "当届政策/办理窗口及空白表版本",
      "purpose": "当届政策/办理窗口及空白表版本；资助中心；P0 必权威政策参数；无 2026 级正式版本 POLICY_UNCONFIRMED，不得强制旧表。F019/F031；R003；SRC-003/005/009",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 1,
      "maxCount": 20,
      "requiredElements": [
        "当届政策/办理窗口及空白表版本；资助中心；P0 必权威政策参数；无 2026 级正式版本 POLICY_UNCONFIRMED，不得强制旧表。F019/F031；R003；SRC-003/005/009"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M003",
      "name": "学生缓缴申请和经济困难陈述",
      "purpose": "学生缓缴申请和经济困难陈述；学生本人；P1 当前材料；当届表或获授权线下记录，字段要求待校本确认；缺失 NEEDS_MATERIAL。F005/F012/F013/F018/F020；R004/R006；SRC-001/003",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "学生缓缴申请和经济困难陈述；学生本人；P1 当前材料；当届表或获授权线下记录，字段要求待校本确认；缺失 NEEDS_MATERIAL。F005/F012/F013/F018/F020；R004/R006；SRC-001/003"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M004",
      "name": "本人确认/代办权限",
      "purpose": "本人确认/代办权限；学生、代理人；P1 代理条件必；可信本人确认优先，法定授权形式未核；缺失补授权并交人工。F005/F006；R005；SRC-001",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "本人确认/代办权限；学生、代理人；P1 代理条件必；可信本人确认优先，法定授权形式未核；缺失补授权并交人工。F005/F006；R005；SRC-001"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M005",
      "name": "学费应缴/实缴/欠费及学年科目",
      "purpose": "学费应缴/实缴/欠费及学年科目；财务处；P1/P7 权威记录；财务导出/可核系统凭据可替代纸账，截图只能线索；无权威源 SOURCE_UNAVAILABLE。F007–F011/F026；R007/R008/R016；SRC-001/006",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "学费应缴/实缴/欠费及学年科目；财务处；P1/P7 权威记录；财务导出/可核系统凭据可替代纸账，截图只能线索；无权威源 SOURCE_UNAVAILABLE。F007–F011/F026；R007/R008/R016；SRC-001/006"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M006",
      "name": "家庭困难或突发变故佐证",
      "purpose": "家庭困难或突发变故佐证；学生、证明机关；P1–P3 条件；既有 T06 决定、合适权威证明或经授权调查记录可作为不同目的的佐证，不能等价为困难正式认定；未及时取得转人工/补证。F013–F015；R009；SRC-001/013/014",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "家庭困难或突发变故佐证；学生、证明机关；P1–P3 条件；既有 T06 决定、合适权威证明或经授权调查记录可作为不同目的的佐证，不能等价为困难正式认定；未及时取得转人工/补证。F013–F015；R009；SRC-001/013/014"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M007",
      "name": "贷款受理证明、合同/贷款阶段凭据",
      "purpose": "贷款受理证明、合同/贷款阶段凭据；贷款机构、学生；P2 贷款条件；受理回执可替代合同用于“受理事实”，不能替代放款；缺证提示。F016/F017；R010；SRC-001",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "贷款受理证明、合同/贷款阶段凭据；贷款机构、学生；P2 贷款条件；受理回执可替代合同用于“受理事实”，不能替代放款；缺证提示。F016/F017；R010；SRC-001"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M008",
      "name": "辅导员事实审核意见",
      "purpose": "辅导员事实审核意见；辅导员；P2 后置，可信签署记录或校方认可纸表；P1 不报缺。F021；R011；SRC-001",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "辅导员事实审核意见；辅导员；P2 后置，可信签署记录或校方认可纸表；P1 不报缺。F021；R011；SRC-001"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M009",
      "name": "学院复核及汇总签章",
      "purpose": "学院复核及汇总签章；学院；P4 后置，电子签署或校方认可纸表；P1–P3 不报缺。F022；R012；SRC-001",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "学院复核及汇总签章；学院；P4 后置，电子签署或校方认可纸表；P1–P3 不报缺。F022；R012；SRC-001"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M010",
      "name": "资助管理中心缓缴决定及告知",
      "purpose": "资助管理中心缓缴决定及告知；有权校方；P5 后置，可信决定服务/可验证正式文书；印章图片只作待核。F023/F024；R013；SRC-001/007",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "资助管理中心缓缴决定及告知；有权校方；P5 后置，可信决定服务/可验证正式文书；印章图片只作待核。F023/F024；R013；SRC-001/007"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M011",
      "name": "教务/研究生/迎新备案注册",
      "purpose": "教务/研究生/迎新备案注册；学校部门；P6 后置，权威登记/批次回执；无源不假定已注册。F025；R014；SRC-001",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "教务/研究生/迎新备案注册；学校部门；P6 后置，权威登记/批次回执；无源不假定已注册。F025；R014；SRC-001"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M012",
      "name": "付款、贷款到账、资助抵扣及余额更新",
      "purpose": "付款、贷款到账、资助抵扣及余额更新；财务处；P7 后置，每笔流水关联学年和科目；学生支付截图非权威收款。F009–F011/F016/F026；R015/R016；SRC-001/002",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "付款、贷款到账、资助抵扣及余额更新；财务处；P7 后置，每笔流水关联学年和科目；学生支付截图非权威收款。F009–F011/F016/F026；R015/R016；SRC-001/002"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M013",
      "name": "撤回请求及其受理/确认",
      "purpose": "撤回请求及其受理/确认；本人和有权机构；P1–P8 条件，电子可信请求/校方认可文书；仅请求不等于撤销决定。F027；R017；SRC-001（专项程序未规定）",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "撤回请求及其受理/确认；本人和有权机构；P1–P8 条件，电子可信请求/校方认可文书；仅请求不等于撤销决定。F027；R017；SRC-001（专项程序未规定）"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M014",
      "name": "异议、复核证据和正式结果",
      "purpose": "异议、复核证据和正式结果；学生/复核机构；P5–P8 条件，原决定+新证据+可信复核结果；无审批权限时只挂待办。F028/F032；R018；SRC-001（专项程序待核）",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "异议、复核证据和正式结果；学生/复核机构；P5–P8 条件，原决定+新证据+可信复核结果；无审批权限时只挂待办。F028/F032；R018；SRC-001（专项程序待核）"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M015",
      "name": "案卷证据版本和归属审计",
      "purpose": "案卷证据版本和归属审计；系统；全阶段，CAS 事件、hash、归属键，不可由用户截屏替代。F029/F030；R019；SRC-011",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "案卷证据版本和归属审计；系统；全阶段，CAS 事件、hash、归属键，不可由用户截屏替代。F029/F030；R019；SRC-011"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    }
  ],
  "sections": [
    {
      "id": "rules-08",
      "name": "可达规则清单",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "P0 申请主体与录取记录一致；T 新生拟报名，F 非入学事件，U 录取源缺",
          "requirement": "原文核验项：P0 申请主体与录取记录一致；T 新生拟报名，F 非入学事件，U 录取源缺。执行摘要：R001 | P0 申请主体与录取记录一致；T 新生拟报名，F 非入学事件，U 录取源缺 | F001/F002、M001、SRC-001/003；可信 ID 对照，冲突 CONFLICT→招生核验，缺权威源 SOURCE_UNAVAILABLE→招生。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "P0 学段校区属于当届可受理对象；T 当届批次，F 非新生，U 适用名单未知",
          "requirement": "原文核验项：P0 学段校区属于当届可受理对象；T 当届批次，F 非新生，U 适用名单未知。执行摘要：R002 | P0 学段校区属于当届可受理对象；T 当届批次，F 非新生，U 适用名单未知 | F002–F004/F031、M001/M002、SRC-003/004/005；当届范围匹配，未知 POLICY_UNCONFIRMED→资助中心。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "P0/P1 使用当前正式政策/申请表；T 启动申请，F 非此项，U 当届表不可取得",
          "requirement": "原文核验项：P0/P1 使用当前正式政策/申请表；T 启动申请，F 非此项，U 当届表不可取得。执行摘要：R003 | P0/P1 使用当前正式政策/申请表；T 启动申请，F 非此项，U 当届表不可取得 | F019/F031、M002、SRC-003/005/009；版本比较，未知 POLICY_UNCONFIRMED→资助中心，旧表差异人工确认。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "P1 学生申请与困难事由可读且归属一致；T 已发起，F 未发起，U 案卷源未到",
          "requirement": "原文核验项：P1 学生申请与困难事由可读且归属一致；T 已发起，F 未发起，U 案卷源未到。执行摘要：R004 | P1 学生申请与困难事由可读且归属一致；T 已发起，F 未发起，U 案卷源未到 | F005/F012/F013、M003、SRC-001/003；文本和归属核，缺件 NEEDS_MATERIAL→本人，难读 UNREADABLE→本人。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "P1 代理申请有本人确认及可信权限；T 非本人上传，F 本人可信提交，U 代理规则未知",
          "requirement": "原文核验项：P1 代理申请有本人确认及可信权限；T 非本人上传，F 本人可信提交，U 代理规则未知。执行摘要：R005 | P1 代理申请有本人确认及可信权限；T 非本人上传，F 本人可信提交，U 代理规则未知 | F005/F006、M004、SRC-001；主体签署核验，缺授权 NEEDS_MATERIAL，形式未知 POLICY_UNCONFIRMED→辅导员/权限管理员。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "P1 承诺拟缴日期与申请叙述相容；T 有承诺/当届要求，F 不适用承诺要求，U 当届期限未知",
          "requirement": "原文核验项：P1 承诺拟缴日期与申请叙述相容；T 有承诺/当届要求，F 不适用承诺要求，U 当届期限未知。执行摘要：R006 | P1 承诺拟缴日期与申请叙述相容；T 有承诺/当届要求，F 不适用承诺要求，U 当届期限未知 | F012/F018/F031、M003/M002、SRC-001/002；语义/日期比较，矛盾 CONFLICT，允许期限 POLICY_UNCONFIRMED→辅导员/资助中心。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "P1 学费缺口与申请金额对应；T 申请缓缴学费，F 只申请其他科目，U 财务源未连",
          "requirement": "原文核验项：P1 学费缺口与申请金额对应；T 申请缓缴学费，F 只申请其他科目，U 财务源未连。执行摘要：R007 | P1 学费缺口与申请金额对应；T 申请缓缴学费，F 只申请其他科目，U 财务源未连 | F007–F012、M005/M003、SRC-001；同学年科目时点计算，申请额高于可核余额 CONFLICT→财务/学生，无账 SOURCE_UNAVAILABLE。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "P1 非学费科目的授权范围确认；T 包含住宿费/其他费，F 仅学费，U 当届规则不明",
          "requirement": "原文核验项：P1 非学费科目的授权范围确认；T 包含住宿费/其他费，F 仅学费，U 当届规则不明。执行摘要：R008 | P1 非学费科目的授权范围确认；T 包含住宿费/其他费，F 仅学费，U 当届规则不明 | F008/F031、M002/M005、SRC-001/003/004/012；政策冲突 POLICY_UNCONFIRMED→资助中心，不自动扩大批准范围。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "P2 困难事实证明链与陈述不矛盾；T 申请困难缓缴，F 非困难主题，U 证明标准未定",
          "requirement": "原文核验项：P2 困难事实证明链与陈述不矛盾；T 申请困难缓缴，F 非困难主题，U 证明标准未定。执行摘要：R009 | P2 困难事实证明链与陈述不矛盾；T 申请困难缓缴，F 非困难主题，U 证明标准未定 | F013–F015、M003/M006、SRC-001/013/014；核关联和矛盾，缺可得材料 NEEDS_MATERIAL、无法及时取得 NEEDS_HUMAN_DECISION→辅导员；不得要求事先 T06 认定。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "P2/P7 贷款状态准确分类；T 宣称贷款，F 明确未申请，U 机构源不可得",
          "requirement": "原文核验项：P2/P7 贷款状态准确分类；T 宣称贷款，F 明确未申请，U 机构源不可得。执行摘要：R010 | P2/P7 贷款状态准确分类；T 宣称贷款，F 明确未申请，U 机构源不可得 | F016/F017、M007/M012、SRC-001；受理≠合同≠放款≠学校入账，冲突 CONFLICT→贷款承办人/财务，缺权威证据 SOURCE_UNAVAILABLE。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "P2 辅导员审核意见为真实阶段产物；T 已进入完成初审动作，F 尚在 P1，U 授权未知",
          "requirement": "原文核验项：P2 辅导员审核意见为真实阶段产物；T 已进入完成初审动作，F 尚在 P1，U 授权未知。执行摘要：R011 | P2 辅导员审核意见为真实阶段产物；T 已进入完成初审动作，F 尚在 P1，U 授权未知 | F021/F024、M008、SRC-001；签署人授权及案卷绑定，未生成 NEEDS_MATERIAL→辅导员，授权不明 NEEDS_HUMAN_DECISION。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "P4 学院复核汇总为真实授权行为；T 拟报学校审批，F 未到 P4，U 当届授权不明",
          "requirement": "原文核验项：P4 学院复核汇总为真实授权行为；T 拟报学校审批，F 未到 P4，U 当届授权不明。执行摘要：R012 | P4 学院复核汇总为真实授权行为；T 拟报学校审批，F 未到 P4，U 当届授权不明 | F022/F024、M009、SRC-001；签署/汇总归属，缺后置材料 NEEDS_MATERIAL→学院，不提前拦截 P1。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "P5 学校决定权威与金额、科目、期限明确；T 号称已决定，F 尚未审批，U 真实签发源不可得",
          "requirement": "原文核验项：P5 学校决定权威与金额、科目、期限明确；T 号称已决定，F 尚未审批，U 真实签发源不可得。执行摘要：R013 | P5 学校决定权威与金额、科目、期限明确；T 号称已决定，F 尚未审批，U 真实签发源不可得 | F023/F024、M010、SRC-001/007；权限签署与字段比对，无可信源 SOURCE_UNAVAILABLE，裁量未做 NEEDS_HUMAN_DECISION→资助中心。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "P6 备案/注册与真实缓缴决定相对应；T 学校决定已签，F 尚未签，U 登记源不可得",
          "requirement": "原文核验项：P6 备案/注册与真实缓缴决定相对应；T 学校决定已签，F 尚未签，U 登记源不可得。执行摘要：R014 | P6 备案/注册与真实缓缴决定相对应；T 学校决定已签，F 尚未签，U 登记源不可得 | F023/F025、M010/M011、SRC-001；决定号/学生/批次比对，矛盾 CONFLICT→教务/研究生/迎新部门。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "P7 贷款或资助到账后是否形成实际财务抵扣；T 宣称到账/抵扣，F 未有此事，U 财务流水未到",
          "requirement": "原文核验项：P7 贷款或资助到账后是否形成实际财务抵扣；T 宣称到账/抵扣，F 未有此事，U 财务流水未到。执行摘要：R015 | P7 贷款或资助到账后是否形成实际财务抵扣；T 宣称到账/抵扣，F 未有此事，U 财务流水未到 | F016/F026、M007/M012、SRC-001/002；流水金额/科目核对，学生截图不可代替账；无源 SOURCE_UNAVAILABLE→财务。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "P7 未缴余额、获批额和补缴义务的时序正确；T 已批准/后续缴费，F 未决定，U 最新账未到",
          "requirement": "原文核验项：P7 未缴余额、获批额和补缴义务的时序正确；T 已批准/后续缴费，F 未决定，U 最新账未到。执行摘要：R016 | P7 未缴余额、获批额和补缴义务的时序正确；T 已批准/后续缴费，F 未决定，U 最新账未到 | F009–F011/F023/F026、M005/M010/M012、SRC-001/002；禁止将缓缴额减作免债，冲突 CONFLICT→财务，过期处理 NEEDS_HUMAN_DECISION→资助中心。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "P1–P8 撤回请求的本人及生效状态明确；T 请求撤回，F 无请求，U 校方程序不明",
          "requirement": "原文核验项：P1–P8 撤回请求的本人及生效状态明确；T 请求撤回，F 无请求，U 校方程序不明。执行摘要：R017 | P1–P8 撤回请求的本人及生效状态明确；T 请求撤回，F 无请求，U 校方程序不明 | F027/F023、M013/M010、SRC-001；确认本人及决定前后，未知 POLICY_UNCONFIRMED，实际撤销 NEEDS_HUMAN_DECISION→有权机构。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "P5–P8 复核请求及正式复核结果有效归属；T 提出异议/复核，F 无争议，U 复核制度未知",
          "requirement": "原文核验项：P5–P8 复核请求及正式复核结果有效归属；T 提出异议/复核，F 无争议，U 复核制度未知。执行摘要：R018 | P5–P8 复核请求及正式复核结果有效归属；T 提出异议/复核，F 无争议，U 复核制度未知 | F028/F032、M014/M010、SRC-001；原决定/新事实/签署主体对比，NEEDS_HUMAN_DECISION→校方有权复核人。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "全阶段证据归属和版本单调可追溯；T 有材料变动，F 尚无材料，U 案卷权威版本缺",
          "requirement": "原文核验项：全阶段证据归属和版本单调可追溯；T 有材料变动，F 尚无材料，U 案卷权威版本缺。执行摘要：R019 | 全阶段证据归属和版本单调可追溯；T 有材料变动，F 尚无材料，U 案卷权威版本缺 | F029/F030、M015、SRC-011；hash、case、owner、sourceVersion、target 对齐，不同人/旧证据 CONFLICT→案卷管理员；不复用失效的 R 结果。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
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
      "name": "申请登记、身份与范围核验",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "evidence-review",
      "workflowOwner": "local"
    },
    {
      "id": "evidence-review",
      "name": "材料、事实与来源核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "intake",
      "nextStageId": "policy-confirmation",
      "workflowOwner": "local"
    },
    {
      "id": "policy-confirmation",
      "name": "当期政策、适用范围与权限人工确认",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "evidence-review",
      "nextStageId": "final-decision",
      "workflowOwner": "local"
    },
    {
      "id": "final-decision",
      "name": "有权人员人工决定与结果记录",
      "kind": "finalize",
      "executorRole": "teacher",
      "returnToStageId": "evidence-review",
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
      "id": "supplement-list",
      "kind": "supplement-list",
      "audience": "student"
    },
    {
      "id": "human-decision-record",
      "kind": "approval",
      "audience": "teacher"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

/** SRC 为研究来源索引，不是案卷 SourceRef。 */
export const r02Metadata = {
  "templateId": "S03-T13",
  "name": "新生入学“绿色通道”学费缓缴资格审核",
  "version": "1.0",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/S03-T13.md",
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/S03-T13.md",
  "sourceGitBlobSha": "50ac0195b58b3af28025256a4bbe1bcfdf4dd988",
  "sourceDocumentSha256": "cfede916dd9062cc4d23f840d26fb3fc636f8def31569a73a6fa4be5bb17b2ce",
  "sourceManifestBytes": 35097,
  "sourceManifestSha256": "b0989ec11c25b8272cd4aa71f0ed47efb14575aa498155a02cd558a20feccb74",
  "officialSchoolTemplate": false,
  "researchDate": "2026-10-24",
  "policyEvidenceStatus": "PARTIAL",
  "workflowOwner": "local",
  "sourceEvidence": [
    {
      "sourceId": "SRC-001",
      "title": "CDUT-VERIFIED 原文已复核；第 14 条历史表单、审批链、仅当年学费、历史缓缴期限；2026 是否继续有效 **UNKNOWN**。2017 起试行、废止日期未证实",
      "evidenceStatus": "PARTIAL",
      "url": "https://dbxb.cdut.edu.cn/__local/2/EF/5F/C946856138CC936C6C90E48FD40_F0D178B4_5A517.pdf"
    },
    {
      "sourceId": "SRC-002",
      "title": "CURRENTITY-UNKNOWN 2025 成都校区本科当届告知；获批部分之外仍缴费、规定期限内缴清，2026 不自动沿用",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://cist.cdut.edu.cn/info/1135/7385.htm"
    },
    {
      "sourceId": "SRC-003",
      "title": "CURRENTITY-UNKNOWN：官方搜索索引可核“申请表→辅导员→学院→学生资助管理中心”摘要；本轮网页直达 HTTP 412，附件正文未读；限 2024 本科生",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://xsc.cdut.edu.cn/info/1046/2208.htm，“入学时不用愁"
    },
    {
      "sourceId": "SRC-004",
      "title": "CURRENTITY-UNKNOWN：官方索引显示困难大一新生暂筹不齐学费住宿费可先办理入学；直达 412，非 2026 签批细则",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://xsc.cdut.edu.cn/info/1032/3429.htm，新生绿色通道节"
    },
    {
      "sourceId": "SRC-005",
      "title": "CURRENTITY-UNKNOWN：目录可索引标题和“各学院、宜宾校区”线索；专项正文/附件未读，限 2025",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://xsc.cdut.edu.cn/index/tzgg/19.htm"
    },
    {
      "sourceId": "SRC-006",
      "title": "CDUT-VERIFIED 官方搜索索引可核在校生表一式两份、2026-07-30 期限；直达 412，**仅在校生，不得用于 2026 新生自动时限**",
      "evidenceStatus": "PARTIAL",
      "url": "https://jcc.cdut.edu.cn/info/1012/2724.htm"
    },
    {
      "sourceId": "SRC-007",
      "title": "CURRENTITY-UNKNOWN：官方职责索引涉及新生绿色通道，具体 2026 签章/授权未核",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://xsc.cdut.edu.cn/bmgk/jgsz.htm，“学生资助管理中心办公室”"
    },
    {
      "sourceId": "SRC-008",
      "title": "GENERAL-RESEARCH：当届办理线索，报道非正式校方规范，网页直接获取未完成",
      "evidenceStatus": "PARTIAL",
      "url": "https://yurenhao1.sizhengwang.cn/a/cdlgdx/260929/2529243.shtml"
    },
    {
      "sourceId": "SRC-009",
      "title": "CURRENTITY-UNKNOWN：仅确认附件文件名，**未得原始空白表、填写栏位、承诺原文、签字规则**",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sourceId": "SRC-010",
      "title": "GENERAL-RESEARCH：技术线索尚未取得固定 SHA 原文件；不冒称逐条 catalog 对照",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sourceId": "SRC-011",
      "title": "GENERAL-RESEARCH：**本轮已实际解压阅读**。核 S03-T13 新增，T11 减免、T12 服兵役、T13 缓缴，144 项总账一致；不是学校政策",
      "evidenceStatus": "PARTIAL"
    },
    {
      "sourceId": "SRC-012",
      "title": "GENERAL-RESEARCH：官方搜索正文显示全国高校绿色通道对无力足额缴费新生缓收学费、住宿费并提供入学服务；单页打开超时，非 CDUT 内部审批细则",
      "evidenceStatus": "PARTIAL",
      "url": "https://www.moe.gov.cn/fbh/live/2026/78343/twwd/202607/t20260728_1445368.html"
    },
    {
      "sourceId": "SRC-013",
      "title": "GENERAL-RESEARCH：国家政策历史原文索引强调简化报到手续、保护隐私，不能据此推校内专用签批表",
      "evidenceStatus": "PARTIAL",
      "url": "https://www.moe.gov.cn/srcsite/A05/s7505/202009/t20200904_485133.html"
    },
    {
      "sourceId": "SRC-014",
      "title": "GENERAL-RESEARCH：新生报到与经济困难证明的历史政策依据；证明形式不能覆盖当届 CDUT 要求",
      "evidenceStatus": "PARTIAL",
      "url": "https://www.moe.gov.cn/jyb_xwfb/xw_fbh/moe_2069/s7135/s7555/s7557/201308/t20130823_156260.html"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules-08",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ],
  "limitations": [
    "SRC-* 是研究来源索引，不是案卷 SourceRef。",
    "政策/权限/当期批次未知时只转人工复核，不自动批准或拒绝。",
    "保持 draft；共享注册与 Plan/Run 接线由集成 Owner 负责。"
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = S03T13
