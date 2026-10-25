import type { TemplateVersion as SharedTemplateVersion } from '@profer/shared'

export type TemplateVersion = SharedTemplateVersion

export const r02Metadata = {
  "templateId": "T02-T15",
  "name": "高等学校教师资格认定校内材料与资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T02-T15.md",
  "sourceDocumentSha256": "16afb134c40f0e06f701cfe748344fcbc0305480e2730f42229ce3f645094481",
  "originalSourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T02-T15.md",
  "originalSourceSha256": "22f321dbd4c3660f3538a394569b309ee62aaf6fcf1389a904d201c15a295330",
  "officialSchoolTemplate": false,
  "researchDate": "2026-10-24",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceNote": "已读取成都理工大学2026年校内通知正文及国家/省级依据线索；校内附件、当期省级通知完整附件及校内逾期处理授权未全部核实。",
  "sources": [
    {
      "id": "SRC-001",
      "label": "CDUT-VERIFIED",
      "evidenceStatus": "UNCONFIRMED",
      "title": "CDUT-VERIFIED；成都理工大学党委教师工作部（人事处、教师发展中心），《关于开展2026年高等学校教师资格认定工作的通知》"
    },
    {
      "id": "SRC-002",
      "label": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "title": "GENERAL-RESEARCH；四川省教师资格认定事务中心，川教资〔2026〕4号《关于开展2026年高等学校教师资格认定工作的通知》"
    },
    {
      "id": "SRC-003",
      "label": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "title": "GENERAL-RESEARCH；四川省教育厅，川教函〔2026〕57号《四川省教育厅关于印发〈四川省申请认定教师资格人员体检办法〉的通知》及办法正文"
    },
    {
      "id": "SRC-004",
      "label": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "title": "GENERAL-RESEARCH；国务院，《教师资格条例》（国务院令第188号）"
    },
    {
      "id": "SRC-005",
      "label": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "title": "GENERAL-RESEARCH；教育部令第10号，《〈教师资格条例〉实施办法》"
    },
    {
      "id": "SRC-006",
      "label": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "PARTIAL",
      "title": "CROSS-SCHOOL-REFERENCE；四川师范大学人事处，《关于开展2026年下半年高等学校教师资格认定工作的通知》"
    },
    {
      "id": "SRC-007",
      "label": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "title": "CURRENTITY-UNKNOWN；成都理工大学人事处网站“服务指南”栏，《四川省高等学校教师资格证申请指南》"
    },
    {
      "id": "SRC-008",
      "label": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "title": "CURRENTITY-UNKNOWN；成都理工大学 SRC-001 所列附件1–8（报名材料清单、面试/能力测评标准、审查表、花名册、体检新旧表等）"
    },
    {
      "id": "SRC-009",
      "label": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "title": "CURRENTITY-UNKNOWN；四川省教师发展中心，《四川省高校教师资格认定工作流程图》"
    },
    {
      "id": "SRC-010",
      "label": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "title": "CURRENTITY-UNKNOWN；Fuck-GH-Admin/cdut-studio-review-agent 技术 G50 目录与 R02 总账/审计"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-002",
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
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-001",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-002",
        "SRC-003",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-001",
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-001",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R029",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
} as const

export const templateVersion: TemplateVersion = {
  "templateId": "T02-T15",
  "version": 1,
  "schemaVersion": 2,
  "name": "高等学校教师资格认定校内材料与资格审核",
  "description": "本地研究模板 · 非校方正式模板。依据研究原件构建，供事实核验、材料完整性提示与人工复核使用；现行校本政策及授权未完全确认，不产生正式通过或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板为本地研究模板，非校方正式模板；政策证据状态为 PARTIAL，未确认规则只能待确认或人工复核，不生成学校远端回写或正式决定。",
  "objectType": "person",
  "displayName": {
    "template": "{{F001}} · {{F002}}"
  },
  "fields": [
    {
      "key": "F001",
      "label": "case_id",
      "kind": "text",
      "required": false,
      "extractionHint": "F001 case_id：UUID；Case；S0；服务端唯一建案记录；非本人上传；P1；缺失不得继续绑定材料，修复内部案件",
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "F002",
      "label": "batch_key",
      "kind": "text",
      "required": false,
      "extractionHint": "F002 batch_key：枚举(年度+上下半年)；Application；S0；当期正式公告 SRC-001/002、案卷批次配置 M027；P1；PC；不臆造新批次",
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "F003",
      "label": "stage",
      "kind": "text",
      "required": false,
      "extractionHint": "F003 stage：S0–S4枚举；Case；全程；有权事件日志和材料实际产生状态；P1；SU/HD，禁止客户端自报推进到省级",
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "F004",
      "label": "person_authority_key",
      "kind": "text",
      "required": false,
      "extractionHint": "F004 person_authority_key：受控主体键；Person；S0；校方可信身份/证件原件比对 M001；P3；NM/HD；同名不可合并，脱敏展示",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F005",
      "label": "name_verified",
      "kind": "text",
      "required": false,
      "extractionHint": "F005 name_verified：字符串；Person；S0；证件/人事记录与网报 M001/M012；P2；CF，曾用名须证明",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F006",
      "label": "citizenship_status",
      "kind": "text",
      "required": false,
      "extractionHint": "F006 citizenship_status：枚举/未知；Eligibility；S0；合法身份证明 M001；SRC-002 认定范围；P2；NM/HD，不从姓名推测国籍",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F007",
      "label": "retirement_age_condition",
      "kind": "text",
      "required": false,
      "extractionHint": "F007 retirement_age_condition：真/假/未知；Eligibility；S0；人事权威年龄/退休状态；M001/M002；P2；HD/PC，按当期法定年龄与特殊政策人工核定",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F008",
      "label": "employer_school",
      "kind": "text",
      "required": false,
      "extractionHint": "F008 employer_school：机构标识；Employment；S0；学校人事任职资料、M002；P2；CF/HD，挂靠不可冒充 CDUT 员工",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F009",
      "label": "employing_unit",
      "kind": "text",
      "required": false,
      "extractionHint": "F009 employing_unit：组织标识；Employment；S0；校内人事单位/聘任文件 M002；P2；SU/HD，不得只信本人选院系",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F010",
      "label": "employment_status",
      "kind": "text",
      "required": false,
      "extractionHint": "F010 employment_status：在职/非在职/未知；Employment；S0；人事权威状态/有效聘用记录 M002；P2；HD/CF，过期合同须核原任职状态",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F011",
      "label": "job_role",
      "kind": "text",
      "required": false,
      "extractionHint": "F011 job_role：专任/辅导员/科研/行政等候选；Employment；S0；人事正式岗位/聘任记录 M002；P2；HD，角色标签不代替任教证明",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F012",
      "label": "teaching_duty_fact",
      "kind": "text",
      "required": false,
      "extractionHint": "F012 teaching_duty_fact：证明/未知；Employment；S0；教务任务、教学科研单位/人事确认 M003；P2；HD/SU，不得照搬他校20课时阈值",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F013",
      "label": "campus",
      "kind": "text",
      "required": false,
      "extractionHint": "F013 campus：本部/宜宾/其他/未知；Person；S0；工作校区权威记录、体检安排 M002/M009/M010；P1；PC/HD，医院范围须对校本通知",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F014",
      "label": "qualification_category",
      "kind": "text",
      "required": false,
      "extractionHint": "F014 qualification_category：高等学校教师资格/其他；Application；S0；本人申请与网报类别 M012，SRC-004 第4条；P1；若其他学段路由排除，不能用本模板批准",
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "F015",
      "label": "applied_discipline",
      "kind": "text",
      "required": false,
      "extractionHint": "F015 applied_discipline：学科编码/文本；Application；S0提出、S1校验；网报 M012 与评议材料 M014/M015；P2；CF；辅导员思政及学科一致性人工核",
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "F016",
      "label": "official_registration_no",
      "kind": "text",
      "required": false,
      "extractionHint": "F016 official_registration_no：字符串；Application；S1+；中国教师资格网本人报名号 M012；P2；S0前未来待生成；S1后 NM/SU",
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "F017",
      "label": "official_registration_time",
      "kind": "text",
      "required": false,
      "extractionHint": "F017 official_registration_time：时间戳；Application；S1+；官方网报回执/有权查询 M012；P2；NM/CF；体检表切换不得用上传日",
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "F018",
      "label": "official_confirmation_point",
      "kind": "text",
      "required": false,
      "extractionHint": "F018 official_confirmation_point：机构标识；Application；S1+；中国教师资格网本校确认点 M012；P1；CF/HD；他校确认点不得当 CDUT 已受理",
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "F019",
      "label": "degree_education_level",
      "kind": "text",
      "required": false,
      "extractionHint": "F019 degree_education_level：层级与学历事实；Eligibility；S0；高校学历证书/权威学历核验 M004；P2；NM/SU；至少本科学历的政策事实 SRC-002",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F020",
      "label": "education_verification",
      "kind": "text",
      "required": false,
      "extractionHint": "F020 education_verification：已核/待核/不符；Eligibility；S0→S2；学历核验回执或原件核验 M004/M025；P2；SU/HD，OCR不是学信网结果",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F021",
      "label": "doctorate_degree_fact",
      "kind": "text",
      "required": false,
      "extractionHint": "F021 doctorate_degree_fact：有/无/未知；Eligibility；条件S0；学位证书及权威学位事实 M005；P2；主张博士免测时 NM/HD；否则 NA",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F022",
      "label": "associate_professor_or_above_fact",
      "kind": "text",
      "required": false,
      "extractionHint": "F022 associate_professor_or_above_fact：已获职务/无/未知；Eligibility；条件S0；人事职务正式任命/证书 M006；P2；主张职务免测时 NM/HD；拟获评不算已任职",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F023",
      "label": "putonghua_level",
      "kind": "text",
      "required": false,
      "extractionHint": "F023 putonghua_level：等级/免测待核；Eligibility；S0；官方等级证书或权威核验 M007；P2；普通分支 NM；博士/职务免测先 HD",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F024",
      "label": "putonghua_verification",
      "kind": "text",
      "required": false,
      "extractionHint": "F024 putonghua_verification：已核/未核/来源不可达；Eligibility；S0→S2；普通话证书官方核验或经办核原件 M007/M025；P2；SU/HD，不强制重复上传已由官方验证信息",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F025",
      "label": "training_qualification",
      "kind": "text",
      "required": false,
      "extractionHint": "F025 training_qualification：证书种类/状态；Eligibility；S0；四川省岗培、教育科学理论或国培相关证书 M008；P2；一般分支 NM；免测是否仍需此证 PC/HD",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F026",
      "label": "ability_test_applicability",
      "kind": "text",
      "required": false,
      "extractionHint": "F026 ability_test_applicability：应测/可免/未知；Assessment；S0判断、S2核定；F021/F022 与 SRC-002/005、评议记录 M014；P1；HD/PC；不以 AI 自动豁免",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F027",
      "label": "ability_test_result",
      "kind": "text",
      "required": false,
      "extractionHint": "F027 ability_test_result：原评议结果/未产生；Assessment；S2+；评议组签发测试材料 M014；P2；对应应测者 NM/HD；确认免测则 NA",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F028",
      "label": "expert_committee_opinion",
      "kind": "text",
      "required": false,
      "extractionHint": "F028 expert_committee_opinion：签发状态/结论；Assessment；S2/S3+；校级专家审查意见、本人回传扫描 M015；P2；NM/HD（仅需测者及校方要求情形）；不可由本人签发",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F029",
      "label": "physical_form_policy_version",
      "kind": "text",
      "required": false,
      "extractionHint": "F029 physical_form_policy_version：旧/新/未知；Assessment；S1→S2；F017、体检表 M009/M010、SRC-002/003；P1；PC/CF；2026-04-20按报名日分界",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F030",
      "label": "medical_institution",
      "kind": "text",
      "required": false,
      "extractionHint": "F030 medical_institution：认可医院/未知；Assessment；S2；医院签章 M009/M010 与当期认可名单 SRC-001/003；P2；HD/PC，不自动认可他校指定医院",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F031",
      "label": "medical_final_conclusion",
      "kind": "text",
      "required": false,
      "extractionHint": "F031 medical_final_conclusion：合格/不合格/待定；Assessment；S2+；合规医院最终体检/复查结论 M009/M010；P3；NM/HD；不诊断单项指标",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F032",
      "label": "pregnancy_xray_exception",
      "kind": "text",
      "required": false,
      "extractionHint": "F032 pregnancy_xray_exception：适用/不适用/待核；Assessment；条件S2；医院医学说明 M011，只存必要例外状态；P3；适用则 NM/HD，其他 NA",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F033",
      "label": "conduct_review_state",
      "kind": "text",
      "required": false,
      "extractionHint": "F033 conduct_review_state：已查/待查/需人工决定；Assessment；S2/S3；有权单位思想品德审查 M023；P3；HD/SU，自我承诺不能替代权威审查",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F034",
      "label": "criminal_record_check_state",
      "kind": "text",
      "required": false,
      "extractionHint": "F034 criminal_record_check_state：授权核查状态；Assessment；S2/S3；有权机关/学校合规查询结果 M024；P3；HD/SU，不上传/展示具体敏感犯罪细节",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F035",
      "label": "department_original_check",
      "kind": "text",
      "required": false,
      "extractionHint": "F035 department_original_check：核验人/时间/范围；Review；S2+；学院真实核验记录 M025；P2；NM/HD，扫描印章只能标候选",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F036",
      "label": "department_roster",
      "kind": "text",
      "required": false,
      "extractionHint": "F036 department_roster：版号/签发状态；Review；S3+；学院初审人员花名册及签章 M016；P2；阶段前未来待生成，S3 NM",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F037",
      "label": "school_initial_review",
      "kind": "text",
      "required": false,
      "extractionHint": "F037 school_initial_review：初审状态/回执；Review；S3+；人事处/确认点有权管理员审核 M017；P2；SU/HD，不是省级认定",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F038",
      "label": "provincial_receipt",
      "kind": "text",
      "required": false,
      "extractionHint": "F038 provincial_receipt：受理/退回/待定；Review；S4+；省中心正式回执 M019（需有 M018 送审链）；P2；未收到时后续待生成；不得强行标受理",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F039",
      "label": "official_recognition",
      "kind": "text",
      "required": false,
      "extractionHint": "F039 official_recognition：认定/不予/未决定；Review；S4+；法定机关正式决定/证书验证 M020；P2；未决定 HD/SU；AI不得签发或撤销",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F040",
      "label": "evidence_version_graph",
      "kind": "text",
      "required": false,
      "extractionHint": "F040 evidence_version_graph：关联/哈希/版本集合；Case；全程；M001–M027 元数据及案卷事件记录；P1；未建立关联禁止复用旧通过结论；受影响项重审",
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "F041",
      "label": "trusted_actor_audit",
      "kind": "text",
      "required": false,
      "extractionHint": "F041 trusted_actor_audit：主体/组织/权限/时间；Case；全程；服务端认证与操作审计、M025/M022；P2；无可信 actor 的写操作拒绝，交管理员纠正",
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "F042",
      "label": "deadline_policy_resolution",
      "kind": "text",
      "required": false,
      "extractionHint": "F042 deadline_policy_resolution：校/省时限版本和冲突状态；Application；S0→S3；M027 当前通知及正式解释 SRC-001/002；P1；CF/PC/HD；尤其2026两批次网报日期",
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "F043",
      "label": "applicant_request",
      "kind": "text",
      "required": false,
      "extractionHint": "F043 applicant_request：更正/补件/撤回/复核请求状态；RequestEvent；条件S1+；本人认证请求、关联原件 M021；P2；无请求 NA；有请求缺本人身份 HD",
      "visibility": "internal",
      "scope": "subject"
    },
    {
      "key": "F044",
      "label": "request_disposition",
      "kind": "text",
      "required": false,
      "extractionHint": "F044 request_disposition：有权回复/授权处理状态；RequestEvent；请求处理后；授权机构答复/省级回执 M022；P2；未作决定不得标同意，HD/PC",
      "visibility": "internal",
      "scope": "subject"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "有效身份证明、受控身份核验记录",
      "purpose": "有效身份证明、受控身份核验记录；当前必需 S0；可由依法授权身份系统核验，不能仅姓名/OCR替代；F004–F007；SRC-002/004/005；附本人及本案；证件版本/核验时间留存。缺 NM，模糊 UNREADABLE，姓名冲突 CF/HD；敏感号码脱敏",
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
      "requiredElements": [
        "当前必需 S0；可由依法授权身份系统核验，不能仅姓名/OCR替代",
        "F004–F007；SRC-002/004/005",
        "附本人及本案；证件版本/核验时间留存。缺 NM，模糊 UNREADABLE，姓名冲突 CF/HD；敏感号码脱敏"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "正式聘用/任职/人事身份记录；必要时合同原件",
      "purpose": "正式聘用/任职/人事身份记录；必要时合同原件；当前必需 S0 的任职事实；有可信 HR 记录时无需本人重复传合同，接口未知则有权核原件；F007–F013；SRC-001/002；校方单位/岗位/起止期，按人事源版本归属。未核 SU/HD，冲突 CF，不得以挂靠证明替代",
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
      "requiredElements": [
        "当前必需 S0 的任职事实；有可信 HR 记录时无需本人重复传合同，接口未知则有权核原件",
        "F007–F013；SRC-001/002",
        "校方单位/岗位/起止期，按人事源版本归属。未核 SU/HD，冲突 CF，不得以挂靠证明替代"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "任教任务/课程或正式教学科研单位证明",
      "purpose": "任教任务/课程或正式教学科研单位证明；条件必需 S0/S2：F012 不可由 M002 充分证明、非典型岗位或有学科争议时；可信教务记录可替代重复上传；F011–F015；SRC-001/002；学期、课程、单位、签发者需与本人对应；未有学校课时阈值原件时 PC/HD，不可套用他校20课时",
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
      "requiredElements": [
        "条件必需 S0/S2：F012 不可由 M002 充分证明、非典型岗位或有学科争议时；可信教务记录可替代重复上传",
        "F011–F015；SRC-001/002",
        "学期、课程、单位、签发者需与本人对应；未有学校课时阈值原件时 PC/HD，不可套用他校20课时"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "毕业证书、官方学历核验或依法认可认证",
      "purpose": "毕业证书、官方学历核验或依法认可认证；当前必需 S0；中国教师资格网已合法核验可用官方结果，不强迫重复传证书；F019/F020；SRC-002/004/005；姓名/证书编号/出具机构及核验版本；缺 NM，无法在线验证 SU 并转原件/认证人工核",
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
      "requiredElements": [
        "当前必需 S0；中国教师资格网已合法核验可用官方结果，不强迫重复传证书",
        "F019/F020；SRC-002/004/005",
        "姓名/证书编号/出具机构及核验版本；缺 NM，无法在线验证 SU 并转原件/认证人工核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "博士学位证书及权威学位证明",
      "purpose": "博士学位证书及权威学位证明；条件必需 S0：主张博士豁免时；以获核实学位记录合法替代扫描件；F021/F026；SRC-002/005；与 F004 主体一致，学位获取日期须已生效；缺 NM/HD，否则 NA",
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
      "requiredElements": [
        "条件必需 S0：主张博士豁免时；以获核实学位记录合法替代扫描件",
        "F021/F026；SRC-002/005",
        "与 F004 主体一致，学位获取日期须已生效；缺 NM/HD，否则 NA"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "教师专业技术职务证书/聘任生效记录",
      "purpose": "教师专业技术职务证书/聘任生效记录；条件必需 S0：主张职务免测时；可信人事职务记录可核，无授权时核原件；F022/F026；SRC-002/005；职务类别、等级、生效时间、所属本人；仅职称评审材料/拟聘公示不可替代；缺 NM/HD",
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
      "requiredElements": [
        "条件必需 S0：主张职务免测时；可信人事职务记录可核，无授权时核原件",
        "F022/F026；SRC-002/005",
        "职务类别、等级、生效时间、所属本人；仅职称评审材料/拟聘公示不可替代；缺 NM/HD"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "普通话等级证书和可核成绩/证书信息",
      "purpose": "普通话等级证书和可核成绩/证书信息；条件必需 S0/S1：非确认免测者；国家/省认可的权威核验可替代重复扫描；F023/F024；SRC-002/005；证书编号/姓名/等级对应人；无法读取 UNREADABLE，权威核验不可用 SU；博士/职务豁免待核而非直接 NA",
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
      "requiredElements": [
        "条件必需 S0/S1：非确认免测者；国家/省认可的权威核验可替代重复扫描",
        "F023/F024；SRC-002/005",
        "证书编号/姓名/等级对应人；无法读取 UNREADABLE，权威核验不可用 SU；博士/职务豁免待核而非直接 NA"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "省高校岗培、教育科学理论自考或新入职教师国培示范培训合格证明",
      "purpose": "省高校岗培、教育科学理论自考或新入职教师国培示范培训合格证明；当前必需 S0 的普通分支；免测分支是否可不交仍 PC/HD；可用权威发证记录；F025/F026；SRC-001/002；证书类型、号、姓名、生效期；无法核 NM/SU；不把校内一般培训活动等同法定所列证书",
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
      "requiredElements": [
        "当前必需 S0 的普通分支；免测分支是否可不交仍 PC/HD；可用权威发证记录",
        "F025/F026；SRC-001/002",
        "证书类型、号、姓名、生效期；无法核 NM/SU；不把校内一般培训活动等同法定所列证书"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "2026-04-20 前报名适用的《四川省教师资格申请人员体格检查表》",
      "purpose": "2026-04-20 前报名适用的《四川省教师资格申请人员体格检查表》；条件必需 S2：有权确认报名前于 4月20日；按 SRC-002 使用旧表，不能用新表自动置换；F017/F029–F031；SRC-001/002/003/008；绑定医院签章、医生结论、签发日、本次人；缺 NM、不可读 UNREADABLE、医院争议 HD",
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
      "requiredElements": [
        "条件必需 S2：有权确认报名前于 4月20日；按 SRC-002 使用旧表，不能用新表自动置换",
        "F017/F029–F031；SRC-001/002/003/008",
        "绑定医院签章、医生结论、签发日、本次人；缺 NM、不可读 UNREADABLE、医院争议 HD"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "2026-04-20 及之后报名适用《四川省申请认定教师资格人员体检表》",
      "purpose": "2026-04-20 及之后报名适用《四川省申请认定教师资格人员体检表》；条件必需 S2：当期报名日触发；正式认可的医院/医疗电子记录可支持核验，非任意医院报告；F017/F029–F031；SRC-001/002/003/008；2026新版/批次与原件关联；缺 NM，看不清结论 UNREADABLE，疑问转医院/人事人工核",
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
      "requiredElements": [
        "条件必需 S2：当期报名日触发；正式认可的医院/医疗电子记录可支持核验，非任意医院报告",
        "F017/F029–F031；SRC-001/002/003/008",
        "2026新版/批次与原件关联；缺 NM，看不清结论 UNREADABLE，疑问转医院/人事人工核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "指定/认可医疗机构出具相关医学检查证明",
      "purpose": "指定/认可医疗机构出具相关医学检查证明；条件必需 S2：本人依法申请该例外；不要求非适用者提供孕情；F032；SRC-002/003；极高敏，仅保存必要“例外证据已核”与权威证明；缺 NM/HD，不把自述代替医院证明",
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
      "requiredElements": [
        "条件必需 S2：本人依法申请该例外；不要求非适用者提供孕情",
        "F032；SRC-002/003",
        "极高敏，仅保存必要“例外证据已核”与权威证明；缺 NM/HD，不把自述代替医院证明"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "本次网上报名号、批次、申请学科、确认点、提交时间及官方回执/授权查询",
      "purpose": "本次网上报名号、批次、申请学科、确认点、提交时间及官方回执/授权查询；后续才产生 S1；已可合法读取官方记录时不再要求重复截屏；F002/F005/F014–F018/F040；SRC-001/002/004；报名号+批次+本人 为主键；S0 不催交；S1 缺 NM/SU、学科/身份不符 CF",
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
      "requiredElements": [
        "后续才产生 S1；已可合法读取官方记录时不再要求重复截屏",
        "F002/F005/F014–F018/F040；SRC-001/002/004",
        "报名号+批次+本人 为主键；S0 不催交；S1 缺 NM/SU、学科/身份不符 CF"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "近期免冠正面1寸白底彩照，按照当期校内提交流程",
      "purpose": "近期免冠正面1寸白底彩照，按照当期校内提交流程；当前必需 S1/S3 的学校收集节点，SRC-001 另要求背写姓名身份证号；版本/是否同版须核 SRC-008；F004/F005/F016；SRC-001/008；关联本人报名号/来源相片版；过早没有报名号不得判缺，影像模糊 UNREADABLE，不强加他校同版规则",
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
      "requiredElements": [
        "当前必需 S1/S3 的学校收集节点，SRC-001 另要求背写姓名身份证号；版本/是否同版须核 SRC-008",
        "F004/F005/F016；SRC-001/008",
        "关联本人报名号/来源相片版；过早没有报名号不得判缺，影像模糊 UNREADABLE，不强加他校同版规则"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "按省/校测评标准生成的评分、过程和有权签名",
      "purpose": "按省/校测评标准生成的评分、过程和有权签名；后续才产生 S2：仅应测分支；免测经有权确认为 NA；F015/F026/F027/F041；SRC-001/002/005/008；关联当次学科、评议组及测评时间；未测试不生成“0分”，需测时缺 NM/HD",
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
      "requiredElements": [
        "后续才产生 S2：仅应测分支；免测经有权确认为 NA",
        "F015/F026/F027/F041；SRC-001/002/005/008",
        "关联当次学科、评议组及测评时间；未测试不生成“0分”，需测时缺 NM/HD"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "委员会审定后归还申请人扫描上传的正式审查表",
      "purpose": "委员会审定后归还申请人扫描上传的正式审查表；后续才产生 S2/S3：SRC-001 明确先专家审定再由本人上传；免测人员是否另出表须核；F015/F027/F028/F035；SRC-001/005/008；真实委员会意见为主、申请人扫描为从；缺页/无签发来源 UNREADABLE/HD，不能让本人伪签",
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
      "requiredElements": [
        "后续才产生 S2/S3：SRC-001 明确先专家审定再由本人上传；免测人员是否另出表须核",
        "F015/F027/F028/F035；SRC-001/005/008",
        "真实委员会意见为主、申请人扫描为从；缺页/无签发来源 UNREADABLE/HD，不能让本人伪签"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "统一汇总的 Word/盖章扫描件及人员条目",
      "purpose": "统一汇总的 Word/盖章扫描件及人员条目；后续才产生 S3：学院汇总/签章后；不要求首次申报本人提供；F004/F005/F016/F035/F036；SRC-001/008；版本与申报批次及每人报名号关联；漏人/重人 CF，未签或未读 HD/UNREADABLE",
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
      "requiredElements": [
        "后续才产生 S3：学院汇总/签章后；不要求首次申报本人提供",
        "F004/F005/F016/F035/F036；SRC-001/008",
        "版本与申报批次及每人报名号关联；漏人/重人 CF，未签或未读 HD/UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "教师资格管理信息系统的学校初审状态及核验人回执",
      "purpose": "教师资格管理信息系统的学校初审状态及核验人回执；后续才产生 S3：人事处真实审核后；F037/F041；SRC-001/002；与 M012/M016 对应；缺失时保持待审，来源不可达 SU，不得填“省级已认定”",
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
      "requiredElements": [
        "后续才产生 S3：人事处真实审核后",
        "F037/F041；SRC-001/002",
        "与 M012/M016 对应；缺失时保持待审，来源不可达 SU，不得填“省级已认定”"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "校方送审函、初审名单及省级当期上报清单",
      "purpose": "校方送审函、初审名单及省级当期上报清单；后续才产生 S3末/S4初；仅学校有权报送，不由本人填签章；F036–F038；SRC-002/008；关联学校批准版、批次、发件人；签章/清单不完整转人事处 HD，不自动盖章",
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
      "requiredElements": [
        "后续才产生 S3末/S4初；仅学校有权报送，不由本人填签章",
        "F036–F038；SRC-002/008",
        "关联学校批准版、批次、发件人；签章/清单不完整转人事处 HD，不自动盖章"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "省中心系统审核、受理/退回信息及可验证回执",
      "purpose": "省中心系统审核、受理/退回信息及可验证回执；后续才产生 S4：省中心实际接收后；F038/F040；SRC-002/004/005；源系统/文号/批次校验；未回时保留待省审，不当 NM；无法联系 SU",
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
      "requiredElements": [
        "后续才产生 S4：省中心实际接收后",
        "F038/F040；SRC-002/004/005",
        "源系统/文号/批次校验；未回时保留待省审，不当 NM；无法联系 SU"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "省级认定决定或有权委托机关的证书/系统核验",
      "purpose": "省级认定决定或有权委托机关的证书/系统核验；后续才产生 S4末：正式决定后；不得申请初始必交；F039；SRC-004/005；正式发证机关、证号、日期可核；未颁不得合成；与初审不符 CF/HD",
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
      "requiredElements": [
        "后续才产生 S4末：正式决定后；不得申请初始必交",
        "F039；SRC-004/005",
        "正式发证机关、证号、日期可核；未颁不得合成；与初审不符 CF/HD"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "认证提交的请求及指向的材料/决定版本",
      "purpose": "认证提交的请求及指向的材料/决定版本；条件必需 S1+：本人确实发起某种请求时；无请求 NA；F001/F016/F040/F043；SRC-004/005（具体校本程序未知）；请求类型/时间/原目标、本人签发/认证；未证实代理权限不得接收他人替办，缺 HD",
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
      "requiredElements": [
        "条件必需 S1+：本人确实发起某种请求时；无请求 NA",
        "F001/F016/F040/F043；SRC-004/005（具体校本程序未知）",
        "请求类型/时间/原目标、本人签发/认证；未证实代理权限不得接收他人替办，缺 HD"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "补正、撤回受理、更正、异议处理或复核答复",
      "purpose": "补正、撤回受理、更正、异议处理或复核答复；后续才产生：请求被有权人正式处理后；F041/F043/F044；SRC-004/005、校本流程待核；绑定请求事件、权限与前后版本；没有回执不能自动视为同意；SU/HD/PC",
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
      "requiredElements": [
        "后续才产生：请求被有权人正式处理后",
        "F041/F043/F044；SRC-004/005、校本流程待核",
        "绑定请求事件、权限与前后版本；没有回执不能自动视为同意；SU/HD/PC"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "工作单位/教师资格认定相关部门的正式鉴定/核验结果",
      "purpose": "工作单位/教师资格认定相关部门的正式鉴定/核验结果；当前必需 S2/S3 的事实核验，具体申报材料形式及是否网办待 SRC-008；不要求通用 AI 保存个人细节；F033；SRC-002/004/005；仅保存完成状态、来源机关及必要结论，争议 HD，无权限 SU",
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
      "requiredElements": [
        "当前必需 S2/S3 的事实核验，具体申报材料形式及是否网办待 SRC-008；不要求通用 AI 保存个人细节",
        "F033；SRC-002/004/005",
        "仅保存完成状态、来源机关及必要结论，争议 HD，无权限 SU"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "按省通知及法定流程核查的结果状态",
      "purpose": "按省通知及法定流程核查的结果状态；当前必需 S2/S3 的授权审查，不是一律申请人上传“无犯罪证明”；F034；SRC-002 第五部分、SRC-004/005；高敏，最小保留已核/待核/转人工；源失联 SU，不得 OCR 判“无犯罪”",
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
      "requiredElements": [
        "当前必需 S2/S3 的授权审查，不是一律申请人上传“无犯罪证明”",
        "F034；SRC-002 第五部分、SRC-004/005",
        "高敏，最小保留已核/待核/转人工；源失联 SU，不得 OCR 判“无犯罪”"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "原件核验事件、证据版本比对、责任人签章/审计",
      "purpose": "原件核验事件、证据版本比对、责任人签章/审计；后续才产生 S2/S3，供所有适用 M 对应核验，不由本人自造；F020/F024/F035/F040/F041；SRC-001/002/005；记录核验 M 的哈希/版、经办权限与日期；缺 HD，不允许“看起来盖章”直接通过",
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
      "requiredElements": [
        "后续才产生 S2/S3，供所有适用 M 对应核验，不由本人自造",
        "F020/F024/F035/F040/F041；SRC-001/002/005",
        "记录核验 M 的哈希/版、经办权限与日期；缺 HD，不允许“看起来盖章”直接通过"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "全部合同页、依法可用的社保参保证明/人事原件",
      "purpose": "全部合同页、依法可用的社保参保证明/人事原件；条件必需（CDUT 尚未确认）：若 SRC-008 当批清单明列，或 M002 事实冲突由有权人要求；他校 SRC-006 不可直接移植；F008–F012；SRC-006/007/008；仅在真实需要时核相应期间与本人；不凭缺“连续6个月”自动驳回 CDUT 申请；PC/HD",
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
      "requiredElements": [
        "条件必需（CDUT 尚未确认）：若 SRC-008 当批清单明列，或 M002 事实冲突由有权人要求；他校 SRC-006 不可直接移植",
        "F008–F012；SRC-006/007/008",
        "仅在真实需要时核相应期间与本人；不凭缺“连续6个月”自动驳回 CDUT 申请；PC/HD"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "SRC-001/002/003 的当年批次通知、医院/表单/截止与正式补充答复",
      "purpose": "SRC-001/002/003 的当年批次通知、医院/表单/截止与正式补充答复；当前必需 S0 的政策元数据，无需申请人上传；F002/F029/F042；SRC-001/002/003/007/008；源、发布日期、适用区间、变更记录冻结；失效 POLICY_UNCONFIRMED，校内/省级时间节点不同、校内逾期后果待核；有确证实质矛盾才 CF/HD",
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
      "requiredElements": [
        "当前必需 S0 的政策元数据，无需申请人上传",
        "F002/F029/F042；SRC-001/002/003/007/008",
        "源、发布日期、适用区间、变更记录冻结；失效 POLICY_UNCONFIRMED，校内/省级时间节点不同、校内逾期后果待核；有确证实质矛盾才 CF/HD"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules",
      "name": "审核规则逐条清单（对应研究原件第08节）",
      "description": "逐条保留原件 R 规则的事实命题、阶段、字段/材料/SRC 引用和异常出口；仅作本地研究检查，不等同学校决定。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "S0；申请类别属于高校教师资格",
          "requirement": "R001 S0；申请类别属于高校教师资格；T：拟申请本类别；F：明确申请其他学段→NA并路由；U：类别未选→NM；SRC-004/005；F001/F002/F014；M012/M027（S0可先用申请意向，S1再核网报）；对照法定类别及本人意向，S1以后与官方类别校验；跨批次不得复用；类别更正需本人/官方网站；不同则CF/HD，本案归口人事处，不为其他学段作决定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "S0–S3；现行批次、期限和本校政策可确定",
          "requirement": "R002 S0–S3；现行批次、期限和本校政策可确定；T：本年度本批申报；F：非当前批次历史案→NA只查史；U：批次不明→PC；SRC-001/002/007/008；F002/F017/F042；M012/M027（S0可无M012）；以本批原公告及更正公告对照；2026 上/下半年校内截止早于省级网报窗口，原 URL 和签发日期并存；校内提前截止性质不明一律PC，已网报仍不自动通过/退件；人事处取得正式解释，必要时报省中心",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "S0–S4；同一人及证件/网报/证书主体一致",
          "requirement": "R003 S0–S4；同一人及证件/网报/证书主体一致；T：存在本人/本批材料；F：没有此类申请→NA；U：无法绑定→NM；SRC-002/004/005；F001/F004/F005/F016/F040；M001/M004/M012/M025（分阶段）；受控主体键与证件、官方报名号、资质证书、院系名册的权威姓名/证件号码比对；签发更名证明人工核；同名不同号、跨批次姓名不符→CF/HD；证件模糊→UR，身份源失联→SU；人事处与本人核验，绝不以OCR合并",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "S0；中国公民及法定年龄受理边界",
          "requirement": "R004 S0；中国公民及法定年龄受理边界；T：申请人拟走本校高校教师资格；F：其他事项→NA；U：身份或退休条件不明→HD；SRC-002/004/005；F006/F007；M001/M002/M027；官方证件和依法确认的人事年龄/退休状态，适用申报当时法律政策；不自行写定固定岁数；如明确非中国公民或不符受理范围，记录事实→HD由人事处答复；退休政策争议PC/HD，不可AI驳回",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "S0；本校正式聘任及当前在职",
          "requirement": "R005 S0；本校正式聘任及当前在职；T：以CDUT职工身份申请；F：其他高校人员→本模板NA；U：单位/任用来源未知→SU/HD；SRC-001/002；F008/F009/F010；M002/M026（条件）；可信HR或签发的聘任事实、单位起止期，与当批日期比较；不以本人自填学院为证；校外、挂靠、兼职、合同疑点→HD/CF；他校社保月数不得套用，院系/人事处核定",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R006",
          "title": "S0/S2；专门从事教育教学工作及岗位情形",
          "requirement": "R006 S0/S2；专门从事教育教学工作及岗位情形；T：本批本校教师资格申请需核实际任教；F：确属别的业务而非本模板申请→NA；U：职责/证据不明→HD；SRC-001/002/006（006仅排除外校阈值）；F011/F012/F013；M002/M003/M026；教务课程/教学安排或有权单位证明对应本批实际任教期间；已由可信教务/HR 完整核得可PASS_FACT，无需另传 M003；职能部门聘教学科研岗需双向确认；不能自动按20课时判CDUT、不能因职位含“行政”就否定；事实缺NM、任教真实性HD，人事/教务/学院处理",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "S0/S1；辅导员申报学科一致",
          "requirement": "R007 S0/S1；辅导员申报学科一致；T：权威岗位为辅导员；F：不是辅导员→NA；U：岗位不清→HD；SRC-001/008；F011/F015；M002/M003/M012（S1后）；校本通知辅导员申报思想政治类，学科按官方网报与聘任事实比较；具体学科代码待附件；非思政学科→CF/HD、未网报前仅提示；学院/人事处确认，不替本人改报",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "S0；本科及以上学历及学历有效性",
          "requirement": "R008 S0；本科及以上学历及学历有效性；T：本批申请；F：他类事项→NA；U：学历记录待核→NM/SU；SRC-002/004/005；F019/F020；M004/M025（核原件阶段）；学历层级、发证机关及权威学历认证，核对姓名与证书生效；大学本科及以上为省级口径；外国/港澳台学历须依法认证，官网不可达可核原件→SU/HD；真实层级不足→HD交人事处",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "S0/S2；博士学位或副教授以上教师职务免测依据",
          "requirement": "R009 S0/S2；博士学位或副教授以上教师职务免测依据；T：本人主张相关免测；F：明确未主张且无该条件→NA；U：资格证明不充分→HD；SRC-002/005；F021/F022/F026；M005/M006/M027；博士已获学位/已生效教师专业技术职务官方记录，对照免测发生时点；职称申报通过不等于正式教师职务；仅“拟评副教授”→HD并保持普通分支；真实源不可达SU；由人事处/委员会确认免测范围",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "S0/S2；普通话等级与适用豁免",
          "requirement": "R010 S0/S2；普通话等级与适用豁免；T：尚未经有权人确认可免普通话；F：有可信豁免确认→NA；U：免测依据争议→HD；SRC-002/005；F021–F024/F026；M005/M006/M007（条件）；省口径普通话二级乙等及以上、证书官网或原件核验；博士/副教授教师职务免测依官方规则核，非自报；无等级或不达标记录→HD，证书缺NM、读不清UR、查证断连SU；人事处核豁免",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "S0/S2；当期岗培/教育科学理论合格证明",
          "requirement": "R011 S0/S2；当期岗培/教育科学理论合格证明；T：按当期规则需此证明；F：有权依据明确免交→NA；U：免测分支是否免交不明→PC；SRC-001/002/008；F025/F026；M008/M027；三类省级明确的合格证明，核发证机关、版本与本人；普通分支 S0准备，认定校本提交时点待附件；不能把任意校内培训等同岗培资格；缺且确定当前必需NM；校本免交争议PC，人事处确认",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "S1；网报确实发生、本校确认点与类别学科匹配",
          "requirement": "R012 S1；网报确实发生、本校确认点与类别学科匹配；T：已进入官方网报阶段；F：S0尚未申请→NA（未来待生成）；U：是否网报不明→SU；SRC-001/002/004；F002/F014–F018；M012；权威报名号+本人+批次+时间+确认点相互核；上传截图只作待核辅助；非本校确认点、错误类别/学科→CF/HD，官方源断连SU，确实未报NM；本人/人事处跟进",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "S1/S3；本批次照片与本人关联",
          "requirement": "R013 S1/S3；本批次照片与本人关联；T：已进入学校通知指定照片收集节点；F：S0或未要求照片阶段→NA；U：节点/格式版未核→PC；SRC-001/008；F004/F005/F016；M013/M012；通知索引提示1寸白底近期照片，核本人报名号、正面可读及当前校本提交说明；附件细则未核；缺NM、辨认不出UR、与本人不符CF；人事处定受理节点，不增设他校同版条件",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "S1/S2；按网报日选择新旧体检表",
          "requirement": "R014 S1/S2；按网报日选择新旧体检表；T：报名时间已能认证且体检进入核验；F：S0无网报或当前无体检义务→NA；U：报名日不明→SU/PC；SRC-002/003/008；F017/F029；M012/M009/M010/M027；2026-04-20前为旧表 M009、当日及以后为新表 M010；依官方网报时间，不依体检/上传日；仅对2026适用；官方记录与截图矛盾CF，旧新表过渡例外PC/HD；人事处核批次和体检政策",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "S2；体检医院认可及原始签发真实",
          "requirement": "R015 S2；体检医院认可及原始签发真实；T：本次实际体检已形成证明；F：S0/S1尚未体检→NA；U：医院范围或签章来源不明→PC/HD；SRC-001/002/003/008；F013/F030/F040；M009/M010/M027；查校本指派/省级认可名单、医院原始签章、校区安排与本人体检日期；非任意医院都合法；医院名单附件不可得→PC，印章模糊UR，签发争议HD；学校联系人/医院核，不靠 AI 验章形状",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R016",
          "title": "S2；医院最终健康结论、复查状态",
          "requirement": "R016 S2；医院最终健康结论、复查状态；T：医院应已完成本次体检；F：体检尚未到应形成节点→NA；U：最终结论尚未签发→NM/HD；SRC-002/003；F029–F031；M009/M010；看医院签出的最终“合格/不合格/待复查”等结论及日期，不从检查值重新诊断；体检不合格仅引用医院事实→HD，复查等待医院；结论不清UR，签发机构难核SU，下一办理人为医院/人事处",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "S2；怀孕胸透例外证据",
          "requirement": "R017 S2；怀孕胸透例外证据；T：本人申请适用该例外；F：未主张、不适用→NA；U：医学证明或政策范围不明→HD/PC；SRC-002/003；F032；M011/M009/M010；合规医院医学证明、替代/免做指定项目的正式规定，存最少状态而非孕情细节；自述不代医院NM/HD，医学例外是否允许由医院及学校核定，不因单项空白判体检不合格",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "S2；学院教育教学能力实际测试结论",
          "requirement": "R018 S2；学院教育教学能力实际测试结论；T：R009有权确认应测且当前测试已进入节点；F：正式免测/未到节点→NA；U：应测性未定→HD；SRC-001/002/005/008；F015/F026/F027；M014/M005/M006（条件）；评议组真实测试评分、签名、学科与时间；校本评分及合格线附件未读，不设置自动分数阈值；无测评结果但已到节点NM，测试争议/分数判断HD/PC，学科不同CF；评议组处理",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "S2/S3；教师资格专家审查委员会意见与本人回传一致",
          "requirement": "R019 S2/S3；教师资格专家审查委员会意见与本人回传一致；T：当期本分支确需审查表且委员会已完成审定；F：尚未进入该生成阶段或正式免交→NA；U：免测者是否需表待核→PC；SRC-001/005/008；F015/F027/F028/F041；M014/M015/M025；比对真实委员会签署的原表、学科、批次、结果与申请人回传扫描；先审定后回传；本人扫描不能创造委员会决定；缺真实意见HD/NM，章模糊UR、内容不符CF；委员会/人事处核",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "S2/S3；思想品德等有权审查事实",
          "requirement": "R020 S2/S3；思想品德等有权审查事实；T：进入有权审查阶段；F：尚未到节点→NA；U：审核形式与权限不明→PC/HD；SRC-002/004/005/008；F033/F041；M023/M025（核验轨迹）；只读工作单位/主管机关形成的必要状态、核验时间与权限，不作人格评判；申请人自述不等于官方审查、结论争议→HD，受控信息缺且到节点NM/SU；人事/有权单位处理",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R021",
          "title": "S2/S3；违法犯罪记录授权核查完成状态",
          "requirement": "R021 S2/S3；违法犯罪记录授权核查完成状态；T：依法需要本次授权查询；F：此阶段尚未启动→NA（非免查）；U：查询权限/接口未知→HD/SU；SRC-002/004/005；F034/F041；M024；有权机关/指定核查主体的已查询状态、时间和必要结论，不把犯罪细节上传通用模型；自传“无犯罪证明”不自动替代法定查询；查询断连SU，不利事实HD交有权人，不得AI自决",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "S2；学院证书原件与电子件一致性核验",
          "requirement": "R022 S2；学院证书原件与电子件一致性核验；T：学院已受理材料原件核对；F：未到S2→NA；U：核验人权限未确认→HD；SRC-001/002/008；F020/F024/F035/F040/F041；M004/M007/M025；对本次使用的资质原件、当前扫描版和合法核验回执逐一留痕；不需要每人重复上传同一已核材料；原件缺/不可读NM/UR，核验签字不可确认HD；学院真实授权人处理",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "S3；学院汇总名册与每案报名事实匹配",
          "requirement": "R023 S3；学院汇总名册与每案报名事实匹配；T：本批学院已到汇总签发节点；F：尚在S0–S2→NA；U：签发授权不明→HD；SRC-001/008；F004/F005/F016/F035/F036；M012/M016/M025；按本批次本人报名号、名单行、院系及有权签章版逐人对应，核错漏/重名；材料初齐却未签章不得算学院通过；名册未生成NM，姓名冲突CF；学院经办/签发负责人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "S3；人事处学校初审真实状态",
          "requirement": "R024 S3；人事处学校初审真实状态；T：学校有权管理员已处理；F：尚未流转到S3→NA；U：系统状态/权限不可证→SU/HD；SRC-001/002/008；F036/F037/F041；M016/M017/M025；以授权确认点系统状态、批次和操作者为准；仅事实预审全绿不能写校内已通过；无校方审核回执继续待初审HD，源断连SU，名册不一致CF；人事处处理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "S3末/S4初；学校送省材料和真实报送权限",
          "requirement": "R025 S3末/S4初；学校送省材料和真实报送权限；T：人事处启动本案送省；F：尚未达到报送环节→NA；U：报送与接收边界不清→HD；SRC-001/002/004/005/008；F036–F038/F041；M016–M019（按阶段到场）；真实签发的报省清单/交接版，与校内审核版及官方受理号核对；不能申请人自造公函；未送省时不催省回执；签发权限未知HD、报件错版CF；校人事处与省中心分别核",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R026",
          "title": "S4；省级受理、正式认定与证书为引用结果",
          "requirement": "R026 S4；省级受理、正式认定与证书为引用结果；T：官方接收/决定已产生；F：尚未产生→NA且显示“待省审/未决定”；U：官网断连→SU；SRC-002/004/005；F038/F039/F040；M019/M020；通过省级官方系统/文书验证本批本人受理回执、决定机关、证书有效性；受理≠认定，原始正式决定保留只读；截图不能创设效力；内容不符CF、合法性/撤销疑问HD，省级/法定机关处理，本地只引用不变更",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "S1–S4；本人更正/撤回/异议/重报请求及有权处置",
          "requirement": "R027 S1–S4；本人更正/撤回/异议/重报请求及有权处置；T：存在认证请求；F：无请求→NA；U：发起者身份或救济渠道不明→HD/PC；SRC-004/005/001/008；F001/F004/F016/F040/F041/F043/F044；M012/M021/M022（M022处理后）；请求绑定本人、原批次/材料版、提交时点；有权机关回执单独校验，跨批次生成新案关联不覆写历史；本人请求≠准许撤回，学校复核≠撤销省决定；校本渠道不明PC，权限冲突HD，送省后交省级有权机构",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "S0–S4；证据归属、版本及过期结论失效",
          "requirement": "R028 S0–S4；证据归属、版本及过期结论失效；T：新增或替换了本案证明/引用型决定；F：无变更事件→NA；U：原证据所属人、批次或替代关系不明→CF/HD；SRC-001/002/004/005；F001/F002/F004/F016/F040；M001/M012/M021/M025（分别按产生阶段）；校验 caseId + personKey + batchKey + materialVersionId + sourceIssuer + sha256，核新旧替代链与已签发决定引用；版本与阶段须有效，不要求 S0 有 M012/M025；旧事实结果必须标 SUPERSEDED 并按 11.3 重审依赖 R；跨案错归属CF、元数据缺NM/HD，案卷 Owner/有权经办核",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "S0–S4；各环节操作人真实授权与签发权限",
          "requirement": "R029 S0–S4；各环节操作人真实授权与签发权限；T：有申请、核验、评议、学校初审、报送或省决定写事件；F：仅普通浏览没有决定事件→NA；U：主体/签发权限无法验→HD/SU；SRC-001/002/004/005；F003/F028/F035–F039/F041/F044；M015/M016/M017/M018/M020/M022/M025（按阶段出现）；每次比较服务端认证 actorServerId、组织/岗位/授权期限、事件类型、签发版及原系统回执；任何客户端传入角色字符串都不作可信凭证；没有真实授权绝不写学校/省决定；可读签名章图也不等于电子签发；不符HD/CF，系统权限管理员/签发机关处理",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "s0",
      "name": "S0 · 申请类别、批次和身份门禁",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "s1"
    },
    {
      "id": "s1",
      "name": "S1 · 网报与材料版本核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "returnToStageId": "s0",
      "nextStageId": "s2"
    },
    {
      "id": "s2",
      "name": "S2 · 教育教学能力与免测事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "returnToStageId": "s1",
      "nextStageId": "s3"
    },
    {
      "id": "s3",
      "name": "S3 · 校内初审与有权审查记录核验",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "returnToStageId": "s2",
      "nextStageId": "s4"
    },
    {
      "id": "s4",
      "name": "S4 · 省级认定结果引用与状态核验",
      "kind": "finalize",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "returnToStageId": "s3"
    }
  ],
  "outputs": [
    {
      "id": "fact-review-feedback",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-action-list",
      "kind": "supplement-list",
      "audience": "reviewer"
    },
    {
      "id": "human-review-summary",
      "kind": "item-feedback",
      "audience": "teacher"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00+08:00"
}

export default templateVersion
