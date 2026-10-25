import type { TemplateVersion } from '@profer/shared'

// Mechanical transcription of the matching canonical Markdown's F/M/R tables.
// SRC references are research citations, never live Case SourceRefs.
export const templateVersion: TemplateVersion = {
  "templateId": "S05-T02",
  "version": 1,
  "schemaVersion": 2,
  "name": "志愿服务工时与志愿活动经历认证审核",
  "description": "本地研究模板 · 非校方正式模板。志愿服务工时与志愿活动经历认证审核；可核材料事实与流程差异，但具体校本标准、授权签发及最终决定待人工确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 已完成研究的本地资料模板，非成都理工大学正式发布；不得据此自动授予学分、成绩、奖励、干部评价或提案立案。",
  "objectType": "person",
  "displayName": {
    "template": "S05-T02 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · applicant_student_ref：内部学生引用；Applicant/申请",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F001：applicant_student_ref：内部学生引用；Applicant/申请；校内身份服务 T1；L2/S，不能仅相信填写的学号。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f002",
      "label": "F002 · enrollment_interval_and_level：活动时学籍起止及本研/毕业状态；Applicant/审核",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F002：enrollment_interval_and_level：活动时学籍起止及本研/毕业状态；Applicant/审核；学籍 T1；L2/S，毕业生受理政策未知则 P。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f003",
      "label": "F003 · requester_actor_and_delegation：本人/组织代理及可验证授权；Case/提交",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F003：requester_actor_and_delegation：本人/组织代理及可验证授权；Case/提交；服务端身份/委派 T1；L2/H。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f004",
      "label": "F004 · application_purpose：单项、区间汇总、经历证明、补录、纠错、复核；Case/申请",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F004：application_purpose：单项、区间汇总、经历证明、补录、纠错、复核；Case/申请；用户声明+路由；L1/B。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f005",
      "label": "F005 · requested_period_and_entry_ids：活动条目集合与目标期间；Case/申请",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F005：requested_period_and_entry_ids：活动条目集合与目标期间；Case/申请；申请+校验后的 Entry refs；L1/B。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f006",
      "label": "F006 · lawful_consent_scope：查询/共享/保留的同意范围；Case/授权",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F006：lawful_consent_scope：查询/共享/保留的同意范围；Case/授权；显式授权事件；L2/H（拒绝非必要披露不等于否定活动事实）。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f007",
      "label": "F007 · platform_kind_and_link_status：志愿四川/其他/纸质、实时连接状态；SourceRecord/查验",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F007：platform_kind_and_link_status：志愿四川/其他/纸质、实时连接状态；SourceRecord/查验；平台配置和调用日志 T1；L1/S。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f008",
      "label": "F008 · volunteer_identity_binding：平台 ID 与本人映射、映射可信级；SourceRecord/查验",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F008：volunteer_identity_binding：平台 ID 与本人映射、映射可信级；SourceRecord/查验；T1/T2 双边验证；L2/S。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f009",
      "label": "F009 · organizer_identity：组织名称、类型、可查验签发单位 ID；Organizer/核验",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F009：organizer_identity：组织名称、类型、可查验签发单位 ID；Organizer/核验；组织官网、登记或正式回函；L1/S。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f010",
      "label": "F010 · activity_source_id：活动或项目原始唯一 ID；Entry/查验",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F010：activity_source_id：活动或项目原始唯一 ID；Entry/查验；组织原始记录 T1/T2；L1/S。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f011",
      "label": "F011 · activity_name：活动名称；Entry/核验",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F011：activity_name：活动名称；Entry/核验；原始记录/证明；L0/B。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f012",
      "label": "F012 · event_date_and_timezone：发生日期、时区；Entry/核验",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F012：event_date_and_timezone：发生日期、时区；Entry/核验；原始记录；L1/B。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f013",
      "label": "F013 · service_location_scope：校内/社区/异地、地点类别；Entry/核验",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F013：service_location_scope：校内/社区/异地、地点类别；Entry/核验；官方活动记录；L2/H，默认不留精确轨迹。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f014",
      "label": "F014 · service_content_and_role：实际服务事项、岗位、服务对象脱敏摘要；Entry/核验",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F014：service_content_and_role：实际服务事项、岗位、服务对象脱敏摘要；Entry/核验；组织记录+佐证；L2/B。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f015",
      "label": "F015 · volunteering_nature：自愿、无偿、公益性质与争议说明；Entry/审核",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F015：volunteering_nature：自愿、无偿、公益性质与争议说明；Entry/审核；活动文件与组织确认；L1/H。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f016",
      "label": "F016 · signup_and_attendance_state：报名、签到、签退、取消、完成，分别记录；Entry/活动后",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F016：signup_and_attendance_state：报名、签到、签退、取消、完成，分别记录；Entry/活动后；组织日志 T1/T2，截图 T4；L2/S。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f017",
      "label": "F017 · actual_service_intervals：实际服务开始/结束/有效暂停段；Entry/核验",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F017：actual_service_intervals：实际服务开始/结束/有效暂停段；Entry/核验；组织可信记录/回函；L2/S。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f018",
      "label": "F018 · claimed_hours_decimal：申报小时及原始精度；Entry/申请",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F018：claimed_hours_decimal：申报小时及原始精度；Entry/申请；申请人主张；L1/B，不是确认时长。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f019",
      "label": "F019 · certified_hours_decimal：组织确认的服务小时与口径；Entry/核验",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F019：certified_hours_decimal：组织确认的服务小时与口径；Entry/核验；T1/T2；L1/S，不能由 OCR 盖章自赋值。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f020",
      "label": "F020 · record_lifecycle_state：组织记录待录入/已确认/更正/注销及时间；SourceRecord/查验",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F020：record_lifecycle_state：组织记录待录入/已确认/更正/注销及时间；SourceRecord/查验；组织 T1/T2；L1/S。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f021",
      "label": "F021 · proof_reference_and_serial：证明编号、日期、签发路径/签名哈希；SourceRecord/核验",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F021：proof_reference_and_serial：证明编号、日期、签发路径/签名哈希；SourceRecord/核验；组织官方证明 T2；L2/S。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f022",
      "label": "F022 · issuer_verification_route：组织公开核验网址/可核工作邮箱/正式函；Organizer/查验",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F022：issuer_verification_route：组织公开核验网址/可核工作邮箱/正式函；Organizer/查验；独立检索和组织权威名录；L1/S，不能只用截图自带电话。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f023",
      "label": "F023 · issuer_verification_result：回函值、签名、查询时间、操作者；SourceRecord/查验",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F023：issuer_verification_result：回函值、签名、查询时间、操作者；SourceRecord/查验；后端受控服务 T1/T2；L2/S。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f024",
      "label": "F024 · evidence_revision：每材料的哈希/版本、时间、所属 entry；MaterialVersion/每次更新",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F024：evidence_revision：每材料的哈希/版本、时间、所属 entry；MaterialVersion/每次更新；本地证据仓库不可变元数据；L1/B。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f025",
      "label": "F025 · conflict_duplicate_group：同一人同时段/跨平台重叠证据群；Entry/组合",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F025：conflict_duplicate_group：同一人同时段/跨平台重叠证据群；Entry/组合；计算+人工标注来源；L1/H。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f026",
      "label": "F026 · anomaly_facts：超长、负数、不同日期、地理不符、双重占时等客观旗标；Entry/核验",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F026：anomaly_facts：超长、负数、不同日期、地理不符、双重占时等客观旗标；Entry/核验；事实比对，附阈值版本；L2/H。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f027",
      "label": "F027 · issuer_correction_ref：原组织已签更正决定/修订记录；SourceRecord/纠错",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F027：issuer_correction_ref：原组织已签更正决定/修订记录；SourceRecord/纠错；T1/T2；L2/S。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f028",
      "label": "F028 · institution_decision_ref：本校正式认定决定 ID、授权主体和签署版本；Case/决定后",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F028：institution_decision_ref：本校正式认定决定 ID、授权主体和签署版本；Case/决定后；本校 T1 可信签名；L2/S；决定前 N。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f029",
      "label": "F029 · reviewer_authority_ref：学校具体受理/审核/签批角色与委派；Case/待决定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F029：reviewer_authority_ref：学校具体受理/审核/签批角色与委派；Case/待决定；服务端授权表+制度版本；L2/P。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f030",
      "label": "F030 · challenge_and_reason_codes：申诉争点、关联 R/Entry/决定；Case/复核",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F030：challenge_and_reason_codes：申诉争点、关联 R/Entry/决定；Case/复核；本人提交+事件日志；L2/H。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f031",
      "label": "F031 · linked_G_ST_decisions：场地/安全/活动组织/积分评奖关联决议；Case/必要时",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F031：linked_G_ST_decisions：场地/安全/活动组织/积分评奖关联决议；Case/必要时；别的模板正式 DecisionRef；L1/N，未触发不要求。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f032",
      "label": "F032 · applicable_policy_revision：认证当期政策来源/学段/批次版本；Case/决定前",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F032：applicable_policy_revision：认证当期政策来源/学段/批次版本；Case/决定前；学校授权配置；L1/P。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f033",
      "label": "F033 · risk_or_event_scope：重大活动/校外组织/高风险及外部批准指针；Entry/路由",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F033：risk_or_event_scope：重大活动/校外组织/高风险及外部批准指针；Entry/路由；组织说明和 G 决定；L1/H。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f034",
      "label": "F034 · source_access_audit：来源故障类型、最后成功查询、缓存新鲜度；SourceRecord/查验",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F034：source_access_audit：来源故障类型、最后成功查询、缓存新鲜度；SourceRecord/查验；服务端审计日志；L1/S。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f035",
      "label": "F035 · service_quality_or_experience_note：本人/组织描述与完成评价；Entry/经历认证",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F035：service_quality_or_experience_note：本人/组织描述与完成评价；Entry/经历认证；组织活动评价/事实回函；L1/H。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f036",
      "label": "F036 · withdrawal_or_review_event_ref：撤回或复核请求和签认事件；Case/事件后",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F036：withdrawal_or_review_event_ref：撤回或复核请求和签认事件；Case/事件后；可信身份审计；L2/N。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "M001 · 校方学生身份与学籍区间的可信查询；校方身份服务",
      "purpose": "研究材料槽 M001：校方学生身份与学籍区间的可信查询；校方身份服务；Case/提交时必需；无服务→SOURCE_UNAVAILABLE，不能让自拍身份证等同后台核验；F001,F002,F003·R001,R002·SRC-013。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "校方学生身份与学籍区间的可信查询；校方身份服务",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "M002 · 学生的分项申报与活动清单，目的/期间/主张小时；申请人",
      "purpose": "研究材料槽 M002：学生的分项申报与活动清单，目的/期间/主张小时；申请人；Case/提交必需；缺→NEEDS_MATERIAL；不可读文本→UNREADABLE；F004,F005,F018·R002,R003·SRC-013。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "学生的分项申报与活动清单，目的/期间/主张小时；申请人",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "M003 · 志愿四川/其他平台的可信活动完成与记录详情，含记录版本；平台/组织",
      "purpose": "研究材料槽 M003：志愿四川/其他平台的可信活动完成与记录详情，含记录版本；平台/组织；Entry/活动后优先，平台未接时可走 M004/M008；连通性失败→SOURCE_UNAVAILABLE；F007,F008,F010,F016,F017,F019,F020·R004,R005,R006,R007,R008·SRC-002,SRC-003。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "志愿四川/其他平台的可信活动完成与记录详情，含记录版本；平台/组织",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "M004 · 原组织原始服务名册、活动日志、时段记录（可脱敏），组织方掌握",
      "purpose": "研究材料槽 M004：原组织原始服务名册、活动日志、时段记录（可脱敏），组织方掌握；Entry/已有服务但平台缺项/异常时条件必需；组织失联→SOURCE_UNAVAILABLE；F009,F010,F011,F012,F014,F016,F017·R004,R006,R007,R011·SRC-002。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "原组织原始服务名册、活动日志、时段记录（可脱敏），组织方掌握",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "M005 · 原组织活动说明/公益服务岗位与服务性质、必要培训/风险说明，主办方",
      "purpose": "研究材料槽 M005：原组织活动说明/公益服务岗位与服务性质、必要培训/风险说明，主办方；Entry/活动属性争议时条件必需；无法证明公益性→NEEDS_HUMAN_DECISION；F014,F015,F033,F035·R003,R025·SRC-001,SRC-002。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "原组织活动说明/公益服务岗位与服务性质、必要培训/风险说明，主办方",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "M006 · 签退/完工、实际服务日志或组织完成评价，组织方",
      "purpose": "研究材料槽 M006：签退/完工、实际服务日志或组织完成评价，组织方；Entry/对“已报名但无完成记录”、部分时段争议条件必需；不可读→UNREADABLE；F016,F017,F035·R006,R007,R025·SRC-002。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "签退/完工、实际服务日志或组织完成评价，组织方",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "M007 · 组织签发记录证明（编号、活动、时间、内容、主体），可校验电子件/纸件；组织方",
      "purpose": "研究材料槽 M007：组织签发记录证明（编号、活动、时间、内容、主体），可校验电子件/纸件；组织方；Entry/校外或无平台记录时条件必需；缺页→NEEDS_MATERIAL，不可读→UNREADABLE；F009,F011,F012,F014,F019,F021·R008,R013,R017·SRC-002,SRC-010。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "组织签发记录证明（编号、活动、时间、内容、主体），可校验电子件/纸件；组织方",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "M008 · 组织公函/可验证邮件/原系统查验证据与回函，组织方和查验服务",
      "purpose": "研究材料槽 M008：组织公函/可验证邮件/原系统查验证据与回函，组织方和查验服务；Entry/对 T4 截图、跨单位、异常或源冲突条件必需；未答复→SOURCE_UNAVAILABLE；F022,F023,F034·R008,R013,R014,R024·SRC-002。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "组织公函/可验证邮件/原系统查验证据与回函，组织方和查验服务",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "M009 · 原记录补正申请、旧/新版本及组织更正确认，申请人和组织",
      "purpose": "研究材料槽 M009：原记录补正申请、旧/新版本及组织更正确认，申请人和组织；Entry/补录/纠错时条件必需；没更正决定→人工/来源待核，旧版保留；F020,F024,F027·R015,R016,R027·SRC-002。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "原记录补正申请、旧/新版本及组织更正确认，申请人和组织",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "M010 · 多项活动的重复、时间重叠对比明细与原时段来源，审核系统/组织",
      "purpose": "研究材料槽 M010：多项活动的重复、时间重叠对比明细与原时段来源，审核系统/组织；Entry group/多条相交才生成；无法消除→CONFLICT；F017,F019,F025,F026·R010,R011,R012·SRC-002。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "多项活动的重复、时间重叠对比明细与原时段来源，审核系统/组织",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "M011 · 异常工时或冒名的组织解释、原始日志、事实核查报告，组织方/可信调查角色",
      "purpose": "研究材料槽 M011：异常工时或冒名的组织解释、原始日志、事实核查报告，组织方/可信调查角色；Entry/异常触发；未得到结论→NEEDS_HUMAN_DECISION，不自动作处罚；F008,F017,F023,F026·R011,R012,R023·SRC-001,SRC-002。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "异常工时或冒名的组织解释、原始日志、事实核查报告，组织方/可信调查角色",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "M012 · 适用年度、学生群体、主管权限的当期校本政策条款与配置，校方",
      "purpose": "研究材料槽 M012：适用年度、学生群体、主管权限的当期校本政策条款与配置，校方；Case/业务决定前必须确认；缺→POLICY_UNCONFIRMED；不是要求学生补政策文件；F029,F032·R019,R020,R029·SRC-003,SRC-004,SRC-013。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "适用年度、学生群体、主管权限的当期校本政策条款与配置，校方",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "M013 · 如活动由学生社团正式组织，S05-T05 组织责任 DecisionRef（非报名），学校",
      "purpose": "研究材料槽 M013：如活动由学生社团正式组织，S05-T05 组织责任 DecisionRef（非报名），学校；Entry/仅制度要求且该活动受 T05 管辖时；未来/不适用→NOT_APPLICABLE；F031,F033·R022·SRC-013,SRC-014。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "如活动由学生社团正式组织，S05-T05 组织责任 DecisionRef（非报名），学校",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "M014 · G03 场地、G04 群体安全、G05 集体出行、G07 财务等既有可信决定引用，学校",
      "purpose": "研究材料槽 M014：G03 场地、G04 群体安全、G05 集体出行、G07 财务等既有可信决定引用，学校；Entry/仅涉及该许可时作为背景/风险待办；不成为所有历史工时的普遍前置件；F031,F033·R022·SRC-001,SRC-013。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "G03 场地、G04 群体安全、G05 集体出行、G07 财务等既有可信决定引用，学校",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "M015 · 有权校方对本案/逐项时长的签名、权限、时间和理由；校方",
      "purpose": "研究材料槽 M015：有权校方对本案/逐项时长的签名、权限、时间和理由；校方；Case/仅决定阶段产生，申请时不得报缺；伪造/无权限→NEEDS_HUMAN_DECISION；F028,F029,F032·R020,R021·SRC-013。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "有权校方对本案/逐项时长的签名、权限、时间和理由；校方",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "M016 · 对撤回、复核/申诉的本人请求、新证据与原决定指针；本人和校方",
      "purpose": "研究材料槽 M016：对撤回、复核/申诉的本人请求、新证据与原决定指针；本人和校方；Case/仅触发时；对原未争项保持历史版本；F028,F030,F036·R026,R027·SRC-002。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "对撤回、复核/申诉的本人请求、新证据与原决定指针；本人和校方",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "M017 · 记录/校内决定被撤销或失效的签发通知和旧新版本；原签发者/校方",
      "purpose": "研究材料槽 M017：记录/校内决定被撤销或失效的签发通知和旧新版本；原签发者/校方；Entry/Case/已发生更正、撤销时才有；必须复查引用方，不能静默删；F020,F027,F028,F036·R016,R021·SRC-002。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "记录/校内决定被撤销或失效的签发通知和旧新版本；原签发者/校方",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "M018 · 每条证据哈希、归属、签发时间、解析及来源快照版本账；证据仓库",
      "purpose": "研究材料槽 M018：每条证据哈希、归属、签发时间、解析及来源快照版本账；证据仓库；每次收件生成，非学生补交；缺→系统内部错误，先停止复用结果；F024,F034·R017,R026·SRC-013。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "每条证据哈希、归属、签发时间、解析及来源快照版本账；证据仓库",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "M019 · 原始组织在跨单位服务的主体身份、记录移交/核验及合并权限，组织方",
      "purpose": "研究材料槽 M019：原始组织在跨单位服务的主体身份、记录移交/核验及合并权限，组织方；Entry/跨单位汇总时；原组织不可达→SOURCE_UNAVAILABLE；F009,F022,F023,F032·R013,R014·SRC-002,SRC-012。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "原始组织在跨单位服务的主体身份、记录移交/核验及合并权限，组织方",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "M020 · 志愿者和服务对象敏感材料的访问授权及脱敏记录；本人/系统",
      "purpose": "研究材料槽 M020：志愿者和服务对象敏感材料的访问授权及脱敏记录；本人/系统；Case/涉及额外查询或共享才需；不同意非必要取证则改用少数据方式；F006,F013,F014·R023·SRC-001,SRC-002。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
      "maxCount": 100,
      "requiredElements": [
        "志愿者和服务对象敏感材料的访问授权及脱敏记录；本人/系统",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "intake",
      "name": "身份、请求及服务性质",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "R001 · 提交时申请主体有可信学生身份/代理权限？真受理，假权限冲突，未知待查",
          "requirement": "R02本地研究检查（非校方政策）：提交时申请主体有可信学生身份/代理权限？真受理，假权限冲突，未知待查；F001,F002,F003 / M001 / SRC-013；T1 服务端学籍与 actor 绑定；PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE → 学籍/权限管理者。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "R002 · 申请目的、期间、条目归属在本 ID 业务范围？真路由，假转邻项，未知补描述",
          "requirement": "R02本地研究检查（非校方政策）：申请目的、期间、条目归属在本 ID 业务范围？真路由，假转邻项，未知补描述；F002,F004,F005 / M001,M002 / SRC-013,SRC-014；PASS_FACT/NOT_APPLICABLE/NEEDS_MATERIAL → 申请人/路由人。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "R003 · 已实际提供自愿、无偿、公益服务？真可进入工时事实核验，假不能以志愿服务记录，未知调查性质",
          "requirement": "R02本地研究检查（非校方政策）：已实际提供自愿、无偿、公益服务？真可进入工时事实核验，假不能以志愿服务记录，未知调查性质；F014,F015 / M002,M005 / SRC-001,SRC-002；PASS_FACT/NEEDS_HUMAN_DECISION/NEEDS_MATERIAL → 组织方/校方。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "service",
      "name": "服务事实、时长及来源核查",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r004",
          "title": "R004 · 该活动与组织确实存在且能够绑定原项目？真标活动，假可疑，未知查源",
          "requirement": "R02本地研究检查（非校方政策）：该活动与组织确实存在且能够绑定原项目？真标活动，假可疑，未知查源；F009,F010,F011,F012 / M003,M004 / SRC-002；PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE → 组织方。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r005",
          "title": "R005 · 平台志愿者、证明人和校内学生是同一主体？真继续，假冲突，未知补可信映射",
          "requirement": "R02本地研究检查（非校方政策）：平台志愿者、证明人和校内学生是同一主体？真继续，假冲突，未知补可信映射；F001,F008,F021 / M001,M003,M007 / SRC-001,SRC-002；PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE → 身份/组织负责人。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r006",
          "title": "R006 · 存在服务完成记录而非仅报名/单边签到？真“完成可核”，假不把报名当完成，未知核签到和工作日志",
          "requirement": "R02本地研究检查（非校方政策）：存在服务完成记录而非仅报名/单边签到？真“完成可核”，假不把报名当完成，未知核签到和工作日志；F016,F035 / M003,M004,M006 / SRC-002,SRC-003；PASS_FACT/NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE → 组织方。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r007",
          "title": "R007 · 申报时数能由实际服务时段/组织科学确认的小时支持？真支持，假差异冲突，未知求原始时段",
          "requirement": "R02本地研究检查（非校方政策）：申报时数能由实际服务时段/组织科学确认的小时支持？真支持，假差异冲突，未知求原始时段；F017,F018,F019 / M003,M004,M006 / SRC-002 第7条；PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE → 组织方。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r008",
          "title": "R008 · 已出具证明可独立确认出具者、编号与记录内容？真验签，假疑伪，未知求官方核验",
          "requirement": "R02本地研究检查（非校方政策）：已出具证明可独立确认出具者、编号与记录内容？真验签，假疑伪，未知求官方核验；F009,F021,F022,F023 / M007,M008 / SRC-002 第14–17条；PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE → 原签发机构。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r009",
          "title": "R009 · 组织确认数与申请小时一致（按统一精度）？真对齐，假列具体差额，未知先核原值",
          "requirement": "R02本地研究检查（非校方政策）：组织确认数与申请小时一致（按统一精度）？真对齐，假列具体差额，未知先核原值；F018,F019 / M002,M003,M007 / SRC-002 第7条；PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE → 组织方/申请人。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r010",
          "title": "R010 · 同一条记录跨截图、证明、平台未被重复求和？真单计，假去重争议，未知构建唯一键",
          "requirement": "R02本地研究检查（非校方政策）：同一条记录跨截图、证明、平台未被重复求和？真单计，假去重争议，未知构建唯一键；F010,F019,F025 / M003,M007,M010 / SRC-002；PASS_FACT/CONFLICT/NEEDS_HUMAN_DECISION → 审核人。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r011",
          "title": "R011 · 同一人不同活动时段无不合理重叠？真通过，假提示精确交集，未知待可信时段",
          "requirement": "R02本地研究检查（非校方政策）：同一人不同活动时段无不合理重叠？真通过，假提示精确交集，未知待可信时段；F012,F017,F025 / M004,M010,M011 / SRC-002；PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE → 组织方/人工。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r012",
          "title": "R012 · 超长、跨地不可能赶赴、负数等异常得到合理说明？真异常解除，假保留风险，未知待日志",
          "requirement": "R02本地研究检查（非校方政策）：超长、跨地不可能赶赴、负数等异常得到合理说明？真异常解除，假保留风险，未知待日志；F013,F017,F019,F026 / M010,M011 / SRC-002,SRC-008；PASS_FACT/NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE → 组织核查者；外校 8h 非硬阈值。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r013",
          "title": "R013 · 跨单位组织记录/证明真实且用途互认已核？真查验，假或不允许时按政策，未知待校方决定",
          "requirement": "R02本地研究检查（非校方政策）：跨单位组织记录/证明真实且用途互认已核？真查验，假或不允许时按政策，未知待校方决定；F009,F022,F023,F032 / M007,M008,M019 / SRC-002,SRC-012；PASS_FACT/POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE → 组织方/校团委。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r014",
          "title": "R014 · 当前没有平台数据时有合法可核替代来源？真走替代，假申请补证，未知来源暂不可达",
          "requirement": "R02本地研究检查（非校方政策）：当前没有平台数据时有合法可核替代来源？真走替代，假申请补证，未知来源暂不可达；F007,F023,F034 / M004,M007,M008,M019 / SRC-002 第2/4条；PASS_FACT/NEEDS_MATERIAL/SOURCE_UNAVAILABLE → 申请人/组织。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r015",
          "title": "R015 · 漏记/错记补录具备原组织可溯的更正依据？真以新版本重审，假旧记录不改，未知等待原签发方",
          "requirement": "R02本地研究检查（非校方政策）：漏记/错记补录具备原组织可溯的更正依据？真以新版本重审，假旧记录不改，未知等待原签发方；F020,F024,F027 / M009,M018 / SRC-002 第13条；PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE → 原签发方。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r016",
          "title": "R016 · 原始服务记录被组织正式撤销、失效或更正？真冻结旧引用，假当前版本继续，未知查源",
          "requirement": "R02本地研究检查（非校方政策）：原始服务记录被组织正式撤销、失效或更正？真冻结旧引用，假当前版本继续，未知查源；F020,F027,F028 / M009,M017 / SRC-002；NEEDS_HUMAN_DECISION/PASS_FACT/SOURCE_UNAVAILABLE → 原机构和学校有权人。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r017",
          "title": "R017 · 本条当前必需的证据可解析、有归属、版本未篡改？真有效，假不可读/归属错误，未知追存储",
          "requirement": "R02本地研究检查（非校方政策）：本条当前必需的证据可解析、有归属、版本未篡改？真有效，假不可读/归属错误，未知追存储；F021,F024,F034 / M007,M018 / SRC-002,SRC-013；PASS_FACT/UNREADABLE/SOURCE_UNAVAILABLE → 补件人/系统。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        }
      ]
    },
    {
      "id": "authority",
      "name": "政策、权限与版本核查",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r018",
          "title": "R018 · 申请阶段不存在被错误提前索要的签认/校方决定？真阶段正确，假任务配置错误，未知待状态",
          "requirement": "R02本地研究检查（非校方政策）：申请阶段不存在被错误提前索要的签认/校方决定？真阶段正确，假任务配置错误，未知待状态；F004,F028,F036 / M002,M015,M016 / SRC-013；PASS_FACT/NEEDS_HUMAN_DECISION/NOT_APPLICABLE → 工作流管理员，不向学生发补未来决定。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "R019 · 存在覆盖本申请学段、日期、用途的校本认证政策版本？真采用，假不兼容，未知政策缺位",
          "requirement": "R02本地研究检查（非校方政策）：存在覆盖本申请学段、日期、用途的校本认证政策版本？真采用，假不兼容，未知政策缺位；F002,F004,F032 / M012 / SRC-003,SRC-004,SRC-006,SRC-013；PASS_FACT/POLICY_UNCONFIRMED/POLICY_UNCONFIRMED → 校方政策所有者。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "R020 · 预备签决定人具备服务端核验的现行权力？真可审签，假禁止签批，未知待授权",
          "requirement": "R02本地研究检查（非校方政策）：预备签决定人具备服务端核验的现行权力？真可审签，假禁止签批，未知待授权；F029,F032 / M012 / SRC-013；PASS_FACT/NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED → 校内权限管理员；签署成功后才产生 M015/F028。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "R021 · 学校最终决定与所核 entry/rule/evidence 版本严格绑定且未失效？真可对外消费，假作废/重签，未知暂停共享",
          "requirement": "R02本地研究检查（非校方政策）：学校最终决定与所核 entry/rule/evidence 版本严格绑定且未失效？真可对外消费，假作废/重签，未知暂停共享；F024,F028,F029 / M015,M017,M018 / SRC-013；PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE → 校内有权签发者。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "R022 · 关联 S05-T05/G03/G04/G05/G07 的独立许可仅在触发时引用且未冒用？真仅消费，假转交或提示，未知待关联",
          "requirement": "R02本地研究检查（非校方政策）：关联 S05-T05/G03/G04/G05/G07 的独立许可仅在触发时引用且未冒用？真仅消费，假转交或提示，未知待关联；F031,F033 / M013,M014 / SRC-001,SRC-013,SRC-014；PASS_FACT/NOT_APPLICABLE/NEEDS_HUMAN_DECISION → 对应 G/S 负责人。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "R023 · 敏感数据查询、共享受限且未超出本人授权与工作必要？真查询，假阻断越权，未知求权限",
          "requirement": "R02本地研究检查（非校方政策）：敏感数据查询、共享受限且未超出本人授权与工作必要？真查询，假阻断越权，未知求权限；F006,F013,F014 / M020 / SRC-001 第20/21条,SRC-002 第16条；PASS_FACT/NEEDS_HUMAN_DECISION/NEEDS_HUMAN_DECISION → 数据管理员。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "R024 · 官方查验路径独立于申请人的证明文本取得？真可信，假疑自造，未知获取官方通道",
          "requirement": "R02本地研究检查（非校方政策）：官方查验路径独立于申请人的证明文本取得？真可信，假疑自造，未知获取官方通道；F022,F023 / M008 / SRC-002 第17条；PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE → 组织方/查验人。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "changes",
      "name": "经历认证、纠错与复核",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "r025",
          "title": "R025 · “经历认证”描述的岗位、内容、评价由组织记录支持？真可认证内容，假修改主张，未知待确认",
          "requirement": "R02本地研究检查（非校方政策）：“经历认证”描述的岗位、内容、评价由组织记录支持？真可认证内容，假修改主张，未知待确认；F014,F035 / M005,M006 / SRC-002 第7/10条；PASS_FACT/CONFLICT/NEEDS_HUMAN_DECISION → 组织方。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "R026 · 任何材料修订均产生新版本并只使依赖它的规则失效？真定向复跑，假拒复用旧 Observation，未知检查证据账",
          "requirement": "R02本地研究检查（非校方政策）：任何材料修订均产生新版本并只使依赖它的规则失效？真定向复跑，假拒复用旧 Observation，未知检查证据账；F024,F030,F036 / M016,M018 / SRC-013；PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE → 工作流/审查者。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "R027 · 复核提出了明确争点、新证据或程序错误且有原决定引用？真重开相关 entry/rule，假要求补充争点，未知核身份",
          "requirement": "R02本地研究检查（非校方政策）：复核提出了明确争点、新证据或程序错误且有原决定引用？真重开相关 entry/rule，假要求补充争点，未知核身份；F028,F030,F036 / M015,M016,M009 / SRC-002 第13条,SRC-013；PASS_FACT/NEEDS_MATERIAL/NEEDS_HUMAN_DECISION → 复核人。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "R028 · 资料中活动时间起止、平台日期、证明日期等不发生无法解释的时间顺序矛盾？真一致，假列冲突，未知找原组织",
          "requirement": "R02本地研究检查（非校方政策）：资料中活动时间起止、平台日期、证明日期等不发生无法解释的时间顺序矛盾？真一致，假列冲突，未知找原组织；F012,F017,F021,F026 / M003,M007,M010 / SRC-002；PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE → 组织/审核人。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "R029 · 本次认证请求不自动执行其他事项的学分、荣誉及奖励折算？真仅输出服务事实，假拆路由，未知等用途确认",
          "requirement": "R02本地研究检查（非校方政策）：本次认证请求不自动执行其他事项的学分、荣誉及奖励折算？真仅输出服务事实，假拆路由，未知等用途确认；F004,F031,F032 / M002,M012 / SRC-004,SRC-006,SRC-013,SRC-014；PASS_FACT/NOT_APPLICABLE/POLICY_UNCONFIRMED → S05-T01 / S03 主管。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "route",
      "name": "事项路由与材料分类",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "facts"
    },
    {
      "id": "facts",
      "name": "逐项事实预审与定向补件",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "policy"
    },
    {
      "id": "policy",
      "name": "政策有效性、争议与权限人工复核",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "nextStageId": "handoff"
    },
    {
      "id": "handoff",
      "name": "向有权办理者交接建议与证据",
      "kind": "handoff",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "feedback",
      "kind": "item-feedback",
      "audience": "student"
    },
    {
      "id": "supplements",
      "kind": "supplement-list",
      "audience": "reviewer"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

export const r02Metadata = {
  "templateId": "S05-T02",
  "name": "志愿服务工时与志愿活动经历认证审核",
  "sourceDocPath": "docs/design/review-agent/business-templates/R02/S05-T02.md",
  "sourceDocSha256": "78fe4604e3e65420855407f2ea00b8a928ffd86594c49c5a3176a370aec88dc2",
  "originalResearchPath": "ChatGPT Library:/S05-T02_正式业务模板_MD_v1.0.md",
  "originalResearchSha256": "78fe4604e3e65420855407f2ea00b8a928ffd86594c49c5a3176a370aec88dc2",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
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
    "F031",
    "F032",
    "F033",
    "F034",
    "F035",
    "F036"
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
    "M020"
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "国务院令第685号《志愿服务条例》，第2、3、7、11–21、25、29条。https://xzfg.moj.gov.cn/front/law/detail?LawID=430",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://xzfg.moj.gov.cn/front/law/detail?LawID=430"
      ],
      "scopeNote": "2017-08-22公布，2017-12-01施行；境内志愿服务；2026-10-24 已读司法部行政法规库和北京市政府转载全文；GENERAL-RESEARCH（全国规范，非校内审批程序）；校方内部办理角色仍未知"
    },
    {
      "id": "SRC-002",
      "title": "民政部令第67号《志愿服务记录与证明出具办法（试行）》，第2–7、11–17、19、26条。https://www.beijing.gov.cn/zhengce/zhengcefagui/202206/t20220606_2730651.html",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.beijing.gov.cn/zhengce/zhengcefagui/202206/t20220606_2730651.html"
      ],
      "scopeNote": "2020-12-02发布，2021-02-01施行；依法记录/签发的组织与志愿者，全国；2026-10-24 读官方全文，页面标“有效”；GENERAL-RESEARCH（上位部门规则）"
    },
    {
      "id": "SRC-003",
      "title": "成都理工大学校团委《志愿小课堂｜你最好奇的问题在这为你解答！》，第9问“志愿四川”报名、签到、签退。https://youth.cdut.edu.cn/info/1029/1388.htm",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://youth.cdut.edu.cn/info/1029/1388.htm"
      ],
      "scopeNote": "网站检索显示约 2021 年；校园科普，不是正式业务程序章程；2026-10-24 搜索引擎提取相关全文片段，直接访问 412；CURRENTITY-UNKNOWN；不得以 2021 科普断定 2026 所有活动必须同样签到"
    },
    {
      "id": "SRC-004",
      "title": "共青团成都理工大学传播科学与艺术学院委员会《关于申报成都理工大学2025年度共青团工作先进集体和个人的通知》，优秀青年志愿者条件/程序及附件 14、15。https://ccsa.cdut.edu.cn/info/1013/10717.htm",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://ccsa.cdut.edu.cn/info/1013/10717.htm"
      ],
      "scopeNote": "2026-03-27发布；该学院 2025 年度评优申报，平台注册及该奖项年度 ≥20 小时条件；2026-10-24 已读正文 L133–L161；CDUT-VERIFIED（仅本年度本评优条件，非全校志愿时长认证最低线）"
    },
    {
      "id": "SRC-005",
      "title": "成都理工大学档案馆《“橘颂”校史文化讲解团成员招募通知》，志愿认定说明。https://dag.cdut.edu.cn/info/1076/2088.htm",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://dag.cdut.edu.cn/info/1076/2088.htm"
      ],
      "scopeNote": "网页搜索为 2026 年具体招募；称服务时长依学校管理规定由官方平台登记认定；2026-10-24 搜索页可检，打开返回错误；CURRENTITY-UNKNOWN（全文/生效及所称校规未取得）"
    },
    {
      "id": "SRC-006",
      "title": "成都理工大学生态环境学院《2023年研究生学业奖学金评审实施细则》，志愿服务计分表。https://sthjxy.cdut.edu.cn/info/1013/3178.htm",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://sthjxy.cdut.edu.cn/info/1013/3178.htm"
      ],
      "scopeNote": "2023 年该学院研究生学业奖学金；该项以志愿四川时长为准、每6小时计1分的当期专项换算；2026-10-24 搜索片段可核，打开错误；CURRENTITY-UNKNOWN（非 2026 现行，更非全校通用）"
    },
    {
      "id": "SRC-007",
      "title": "成都理工大学核自学院《研究生学生活动类附加分依据（最高3分）》PDF 第1页。https://cnae.cdut.edu.cn/__local/6/E9/F4/2226106BF149350E232E6C31348_B16B4795_298F1.pdf",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://cnae.cdut.edu.cn/__local/6/E9/F4/2226106BF149350E232E6C31348_B16B4795_298F1.pdf"
      ],
      "scopeNote": "搜索显示 2025/26 附件线索；该学院研究生奖学金附加分，志愿服务和社会实践证明有专门规则；2026-10-24 已读1页 PDF；CURRENTITY-UNKNOWN（审批时点/适用学年未核，不能作本模板小时阈值）"
    },
    {
      "id": "SRC-008",
      "title": "共青团兰州大学委员会《2026年秋季学期星级志愿者认证通知》，认证方式和注意事项。https://tuanwei.lzu.edu.cn/tuanweigonggao/2026/1012/338341.html",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://tuanwei.lzu.edu.cn/tuanweigonggao/2026/1012/338341.html"
      ],
      "scopeNote": "2026-10-12发布，仅兰大；“志愿汇”记录/异常时长/跨组织补录/社会实践分离；2026-10-24 已读；CROSS-SCHOOL-REFERENCE（所有门槛与补录标签不得搬用）"
    },
    {
      "id": "SRC-009",
      "title": "共青团内江师范学院委员会《学生志愿服务管理办法》，第18–27条。https://tw.njtc.edu.cn/info/1321/118201.htm",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://tw.njtc.edu.cn/info/1321/118201.htm"
      ],
      "scopeNote": "2026-03-25发布，内江师院；“志愿四川”签到、校外组织、时限与认定权限；2026-10-24 已读；CROSS-SCHOOL-REFERENCE；该校 30 日补录期限不适用于成理"
    },
    {
      "id": "SRC-010",
      "title": "共青团山西科技学院委员会《关于青年志愿者寒/暑假志愿服务经历和时长的认定材料通知》，二、三节。https://tw.sxist.edu.cn/info/1472/2661.htm",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://tw.sxist.edu.cn/info/1472/2661.htm"
      ],
      "scopeNote": "2022-12-21，山西科技学院假期志愿服务；纸质证明、组织章、疑义与实践边界；2026-10-24 已读；CROSS-SCHOOL-REFERENCE；照片张数、8h上限仅为该校特例"
    },
    {
      "id": "SRC-011",
      "title": "共青团山东大学（青岛）工作委员会《志愿服务时长管理细则》，第5–9条。https://www.law.sdu.edu.cn/info/1090/6629.htm",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://www.law.sdu.edu.cn/info/1090/6629.htm"
      ],
      "scopeNote": "2021-05-13发布，山东大学青岛校区；多组织互认、审核/录入分工及例外；2026-10-24 已读；CROSS-SCHOOL-REFERENCE；交通时间折算和每日上限不能跨校套用"
    },
    {
      "id": "SRC-012",
      "title": "宁夏回族自治区民政厅《志愿服务记录与证明出具办法（试行）》宁民规发〔2023〕16号，第17–23条。https://mca.nx.gov.cn/zwgk/zcfg/flfg/202311/t20231120_4355702.html",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://mca.nx.gov.cn/zwgk/zcfg/flfg/202311/t20231120_4355702.html"
      ],
      "scopeNote": "2023-10-27，地方有效范围仅宁夏；多组织服务的转移/汇总与证明范例；2026-10-24 已读；CROSS-SCHOOL-REFERENCE（跨省亦不可替成理决定跨单位互认）"
    },
    {
      "id": "SRC-013",
      "title": "CDUT Studio R02《ST-CANDIDATE-MASTER-CATALOG-R02.md》S05 七项和 G50 边界，来源于已校验整合 ZIP 的 00_R02原始范围与规范",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [],
      "scopeNote": "2026-10-22 项目候选范围；非校规；2026-10-24 已读归档；GENERAL-RESEARCH（项目技术边界）"
    },
    {
      "id": "SRC-014",
      "title": "CDUT Studio R02《ST-CATALOG-AUDIT-R02.md》，原 S05-02 去重及 G03/G04/G07、代表提案边界，同包",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [],
      "scopeNote": "2026-10-22 范围审查；非校规；2026-10-24 已读归档；GENERAL-RESEARCH"
    },
    {
      "id": "SRC-015",
      "title": "四川省财政厅《2023年度共青团四川省委机关单位决算》：“志愿四川”平台功能描述。https://czt.sc.gov.cn/scczt/c112175/2024/9/13/30732511b19942f39eabf308d6ba2a82/files/2023%E5%B9%B4%E5%BA%A6%E5%85%B1%E9%9D%92%E5%9B%A2%E5%9B%9B%E5%B7%9D%E7%9C%81%E5%A7%94%E6%9C%BA%E5%85%B3%E5%8D%95%E",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://czt.sc.gov.cn/scczt/c112175/2024/9/13/30732511b19942f39eabf308d6ba2a82/files/2023%E5%B9%B4%E5%BA%A6%E5%85%B1%E9%9D%92%E5%9B%A2%E5%9B%9B%E5%B7%9D%E7%9C%81%E5%A7%94%E6%9C%BA%E5%85%B3%E5%8D%95%E4%BD%8D%E5%86%B3%E7%AE%97.pdf"
      ],
      "scopeNote": "2024-09-13 公开的是 2023 年度平台建设情况；2026-10-24 检索片段核到签到/定位/扫码等技术能力线索；CURRENTITY-UNKNOWN，不能证明本校获 API 权限或特定记录可被查询"
    }
  ],
  "criteria": [
    {
      "sectionId": "intake",
      "criterionId": "r001",
      "srcIds": [
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F001",
        "F002",
        "F003"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "intake",
      "criterionId": "r002",
      "srcIds": [
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F002",
        "F004",
        "F005"
      ],
      "materialSlotIds": [
        "M001",
        "M002"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "intake",
      "criterionId": "r003",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F014",
        "F015"
      ],
      "materialSlotIds": [
        "M002",
        "M005"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "service",
      "criterionId": "r004",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F009",
        "F010",
        "F011",
        "F012"
      ],
      "materialSlotIds": [
        "M003",
        "M004"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "service",
      "criterionId": "r005",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F001",
        "F008",
        "F021"
      ],
      "materialSlotIds": [
        "M001",
        "M003",
        "M007"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "service",
      "criterionId": "r006",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F016",
        "F035"
      ],
      "materialSlotIds": [
        "M003",
        "M004",
        "M006"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "service",
      "criterionId": "r007",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F017",
        "F018",
        "F019"
      ],
      "materialSlotIds": [
        "M003",
        "M004",
        "M006"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "service",
      "criterionId": "r008",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F009",
        "F021",
        "F022",
        "F023"
      ],
      "materialSlotIds": [
        "M007",
        "M008"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "service",
      "criterionId": "r009",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F018",
        "F019"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M007"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "service",
      "criterionId": "r010",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F010",
        "F019",
        "F025"
      ],
      "materialSlotIds": [
        "M003",
        "M007",
        "M010"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "service",
      "criterionId": "r011",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F012",
        "F017",
        "F025"
      ],
      "materialSlotIds": [
        "M004",
        "M010",
        "M011"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "service",
      "criterionId": "r012",
      "srcIds": [
        "SRC-002",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F013",
        "F017",
        "F019",
        "F026"
      ],
      "materialSlotIds": [
        "M010",
        "M011"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "service",
      "criterionId": "r013",
      "srcIds": [
        "SRC-002",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F009",
        "F022",
        "F023",
        "F032"
      ],
      "materialSlotIds": [
        "M007",
        "M008",
        "M019"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "service",
      "criterionId": "r014",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F007",
        "F023",
        "F034"
      ],
      "materialSlotIds": [
        "M004",
        "M007",
        "M008",
        "M019"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "service",
      "criterionId": "r015",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F020",
        "F024",
        "F027"
      ],
      "materialSlotIds": [
        "M009",
        "M018"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "service",
      "criterionId": "r016",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F020",
        "F027",
        "F028"
      ],
      "materialSlotIds": [
        "M009",
        "M017"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "service",
      "criterionId": "r017",
      "srcIds": [
        "SRC-002",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F021",
        "F024",
        "F034"
      ],
      "materialSlotIds": [
        "M007",
        "M018"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "authority",
      "criterionId": "r018",
      "srcIds": [
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F004",
        "F028",
        "F036"
      ],
      "materialSlotIds": [
        "M002",
        "M015",
        "M016"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "authority",
      "criterionId": "r019",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-006",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002",
        "F004",
        "F032"
      ],
      "materialSlotIds": [
        "M012"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "authority",
      "criterionId": "r020",
      "srcIds": [
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F028",
        "F029",
        "F032"
      ],
      "materialSlotIds": [
        "M012",
        "M015"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "authority",
      "criterionId": "r021",
      "srcIds": [
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F024",
        "F028",
        "F029"
      ],
      "materialSlotIds": [
        "M015",
        "M017",
        "M018"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "authority",
      "criterionId": "r022",
      "srcIds": [
        "SRC-001",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F031",
        "F033"
      ],
      "materialSlotIds": [
        "M013",
        "M014"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "authority",
      "criterionId": "r023",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F006",
        "F013",
        "F014"
      ],
      "materialSlotIds": [
        "M020"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "authority",
      "criterionId": "r024",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F022",
        "F023"
      ],
      "materialSlotIds": [
        "M008"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "changes",
      "criterionId": "r025",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F014",
        "F035"
      ],
      "materialSlotIds": [
        "M005",
        "M006"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "changes",
      "criterionId": "r026",
      "srcIds": [
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F024",
        "F030",
        "F036"
      ],
      "materialSlotIds": [
        "M016",
        "M018"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "changes",
      "criterionId": "r027",
      "srcIds": [
        "SRC-002",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F028",
        "F030",
        "F036"
      ],
      "materialSlotIds": [
        "M009",
        "M015",
        "M016"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "changes",
      "criterionId": "r028",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F012",
        "F017",
        "F021",
        "F026"
      ],
      "materialSlotIds": [
        "M003",
        "M007",
        "M010"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "changes",
      "criterionId": "r029",
      "srcIds": [
        "SRC-004",
        "SRC-006",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F004",
        "F031",
        "F032"
      ],
      "materialSlotIds": [
        "M002",
        "M012"
      ],
      "policyOrAuthorityGate": true
    }
  ]
} as const
