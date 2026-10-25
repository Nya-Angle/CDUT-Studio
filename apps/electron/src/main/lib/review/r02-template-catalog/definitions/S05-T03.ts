import type { TemplateVersion } from '@profer/shared'

// Mechanical transcription of the matching canonical Markdown's F/M/R tables.
// SRC references are research citations, never live Case SourceRefs.
export const templateVersion: TemplateVersion = {
  "templateId": "S05-T03",
  "version": 1,
  "schemaVersion": 2,
  "name": "劳动教育实践学时、课程表现认定审核",
  "description": "本地研究模板 · 非校方正式模板。劳动教育实践学时、课程表现认定审核；可核材料事实与流程差异，但具体校本标准、授权签发及最终决定待人工确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 已完成研究的本地资料模板，非成都理工大学正式发布；不得据此自动授予学分、成绩、奖励、干部评价或提案立案。",
  "objectType": "person",
  "displayName": {
    "template": "S05-T03 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · student_id",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F001：student_id（不透明ID；Case/提交；学校唯一学生主体）；身份网关/学籍M001；P；查/停；不得取上传姓名代替。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f002",
      "label": "F002 · student_status",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F002：student_status（枚举；Case/受理；在读/休学/已毕业/其他）；学籍状态M001；I/P；查；影响适用而非擅定资格。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f003",
      "label": "F003 · cohort_program",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F003：cohort_program（结构体；Case/路由；入学级/学院/专业/学段/校区）；学籍及培养方案M001/M002；P/I；查。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f004",
      "label": "F004 · curriculum_version",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F004：curriculum_version（字符串；Case/路由；2025版等）；授权培养计划M002；I；查/停；禁止跨版本套公式。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f005",
      "label": "F005 · course_instance_id",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F005：course_instance_id（ID；Case/受理；理论/实践及开课学期）；开课/选课记录M003；I/P；查；未确证可先受理咨询。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f006",
      "label": "F006 · course_enrollment",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F006：course_enrollment（布尔/状态；Case/受理；已修读/未修/免修来源）；选课与教学状态M003；I/P；查/配。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f007",
      "label": "F007 · course_scope_policy",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F007：course_scope_policy（引用/版号；Case/路由；适用年级/项目）；M002/M011/M020；I；配；POLICY_UNCONFIRMED。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f008",
      "label": "F008 · activity_id",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F008：activity_id（ID；Claim/提交；课程活动唯一键）；M004/M005；I；查/补。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f009",
      "label": "F009 · activity_module",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F009：activity_module（枚举；Claim/匹配；生活生产/公益服务/专业创新/其他）；M004/M011；I；配；不能按标题猜分类。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f010",
      "label": "F010 · activity_time_window",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F010：activity_time_window（起止时间+时区；Claim/事后）；M004/M006；P/I；补/查。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f011",
      "label": "F011 · activity_organizer",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F011：activity_organizer（组织ID；Claim/事前/事后）；M004/M010；O/I；查。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f012",
      "label": "F012 · activity_plan_status",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F012：activity_plan_status（状态+版本；Claim/活动前）；M004，必要时M017；I；查/后；未开放不得认定授权。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f013",
      "label": "F013 · claimed_workload",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F013：claimed_workload（数量+单位；Claim/申报；hour/session/week）；申报表及M006；I/P；补；不可单位混算。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f014",
      "label": "F014 · verified_attendance",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F014：verified_attendance（枚举+时点+出具人；Claim/事后）；M005/M006；P；查；自述不构成真。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f015",
      "label": "F015 · observed_workload",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F015：observed_workload（数量+单位+区间；Claim/事后）；M006/M007；P/I；查；无记录不自动给0。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f016",
      "label": "F016 · observed_performance",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F016：observed_performance（量表项/意见/等级；Claim/事后）；M007/M008；P/I；查；由授权观察者评定。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f017",
      "label": "F017 · assessor_id_role",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F017：assessor_id_role（可信角色ID；Claim/事后）；M007/M010或签发服务；P/I；查/停；不能凭印章OCR通过。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f018",
      "label": "F018 · external_evidence_id",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F018：external_evidence_id（可验证凭据；Claim/事后）；M009/M010；P；补/查；仅当校外模块适用。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f019",
      "label": "F019 · source_decision_link",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F019：source_decision_link（他模板决定ID+版本；Claim/事后）；M017或可信关联存储；I；查/后；无相邻决定时不能假签。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f020",
      "label": "F020 · conversion_policy",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F020：conversion_policy（规则版号+单位+上限；Claim/认定）；M011/M020；I；配；缺失不可换算。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f021",
      "label": "F021 · recognized_amount",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F021：recognized_amount（数字+单位；Claim/认定后）；正式课程认定M012；I/P；后；不是学生可填字段。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f022",
      "label": "F022 · duplicate_key",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F022：duplicate_key（student+activity+segment+target_unit；Claim/汇总）；M012关联事实；I；查；跨学期/跨模块重复标冲突。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f023",
      "label": "F023 · course_rubric_version",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F023：course_rubric_version（规则集ID；Course/期末）；M011/M020；I；配/后。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f024",
      "label": "F024 · course_score_draft",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F024：course_score_draft（分项+分制；Course/期末）；M013；P/I；后；教师可评但模型不签。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f025",
      "label": "F025 · course_score_posted",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F025：course_score_posted（成绩+入账版号；Course/发布后）；M014/教务可信服务；P/S；后/查；不由上传成绩截图替代。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f026",
      "label": "F026 · absence_reason_type",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F026：absence_reason_type（枚举；Claim/例外；病假/公假/其他）；M016；S（可能含健康）；条件补，默认不采细节。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f027",
      "label": "F027 · substitute_decision",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "研究字段 F027：substitute_decision（有权例外决定引用；Claim/特殊）；M016；I/S；后/查；未签不视同豁免。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f028",
      "label": "F028 · recognition_decision",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F028：recognition_decision（决定ID+版本+签者；Case/待签后）；M012；I/P；后；人工核定才有。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f029",
      "label": "F029 · withdraw_state",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F029：withdraw_state（枚举+目标版本；Case/撤回）；M018；I/P；条件后；不能撤销已入账成绩。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f030",
      "label": "F030 · review_case_ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F030：review_case_ref（申诉ID+目标事项；Case/申诉）；M015/M019；I/S；条件后；按成绩与事实争议分路由。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f031",
      "label": "F031 · evidence_version",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F031：evidence_version（哈希/序列号；每M/任意阶段）；可信文件存储+时间戳；I；停；缺版本不可复用旧结论。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f032",
      "label": "F032 · target_object_version",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F032：target_object_version（case/claim/run版本；每次运行）；服务端案卷CAS；I；停；旧run不得冒充新结论。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f033",
      "label": "F033 · policy_effective_window",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F033：policy_effective_window（起止/适用范围；每规则）；M020+发布机关；I；配；当期政策不明。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f034",
      "label": "F034 · actor_authorization",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F034：actor_authorization（权限范围/到期；每签发）；可信后台权限；S/I；停；Renderer不可信。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f035",
      "label": "F035 · linked_g_permission",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F035：linked_g_permission（用途+许可ID+版本；活动前/事后）；M017；I；条件查；G 不由本案审批。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f036",
      "label": "F036 · record_consistency_state",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F036：record_consistency_state（一致/不符/来源失联；认定）；M005–M014比对结果；I；查；冲突不得默认通过。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    },
    {
      "key": "f037",
      "label": "F037 · permitted_course_grading_basis",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "研究字段 F037：permitted_course_grading_basis（认定标准版本+评分权；期末）；M011/M020与教务配置；I；配/后；不能据外校量规推算。仅供事实抽取、人工校验；权威后端值不能由用户上传材料覆盖。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "M001 · 学生身份及学籍状态；学校SSO/学籍服务，允许可信脱敏核验回执而非身份证全图",
      "purpose": "研究材料槽 M001：学生身份及学籍状态；学校SSO/学籍服务，允许可信脱敏核验回执而非身份证全图；S必；后台失联SOURCE_UNAVAILABLE，学生截图不能代替；F001–F003,F034；R001–R002；SRC-017,SRC-018。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "学生身份及学籍状态；学校SSO/学籍服务，允许可信脱敏核验回执而非身份证全图",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "M002 · 生效专业培养方案、学段、学年/年级；教务发布培养方案/有签发版本",
      "purpose": "研究材料槽 M002：生效专业培养方案、学段、学年/年级；教务发布培养方案/有签发版本；S必；未知年级版POLICY_UNCONFIRMED，PDF不可读UNREADABLE；F003–F005,F007,F033；R003–R004；SRC-001,SRC-005。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "生效专业培养方案、学段、学年/年级；教务发布培养方案/有签发版本",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "M003 · 课程实例与选课/修读状态；教务选课/开课记录或主管可核回执",
      "purpose": "研究材料槽 M003：课程实例与选课/修读状态；教务选课/开课记录或主管可核回执；S条（按学籍与计划有课程）；后台不可得SOURCE_UNAVAILABLE；F005–F006；R004–R005；SRC-008,SRC-010。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "课程实例与选课/修读状态；教务选课/开课记录或主管可核回执",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "M004 · 项目任务与组织归属；当期学院通知、排班、课程项目清单，带发布日期及活动ID",
      "purpose": "研究材料槽 M004：项目任务与组织归属；当期学院通知、排班、课程项目清单，带发布日期及活动ID；A必；未安排活动时NOT_APPLICABLE，通知失效先核源；F008–F012；R006–R008；SRC-003,SRC-004,SRC-006。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "项目任务与组织归属；当期学院通知、排班、课程项目清单，带发布日期及活动ID",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "M005 · 参加对象/班级排班及签到名单；班级/组织源台账或可信考勤流水",
      "purpose": "研究材料槽 M005：参加对象/班级排班及签到名单；班级/组织源台账或可信考勤流水；A条（记录存在）；可与M006互为证据但自报名单独立不足；F008,F014,F022；R009–R011；SRC-004,SRC-007。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "参加对象/班级排班及签到名单；班级/组织源台账或可信考勤流水",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "M006 · 现场起止、出勤、实际时长；后勤/课程指导员签发日志、电子考勤/现场核验回执",
      "purpose": "研究材料槽 M006：现场起止、出勤、实际时长；后勤/课程指导员签发日志、电子考勤/现场核验回执；A必（计时类）；无签到待核、文件损坏UNREADABLE、服务失联SOURCE_UNAVAILABLE；F010,F013–F015；R009–R012；SRC-007,SRC-009。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "现场起止、出勤、实际时长；后勤/课程指导员签发日志、电子考勤/现场核验回执",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "M007 · 现场劳动质量/劳动纪律与观察者；有权指导员/后勤检查表、课程实践评语",
      "purpose": "研究材料槽 M007：现场劳动质量/劳动纪律与观察者；有权指导员/后勤检查表、课程实践评语；A条（项目需考核）、C汇总；若考核确需但缺项NEEDS_MATERIAL，不编评分；F016–F017；R013–R014；SRC-007,SRC-008,SRC-009。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "现场劳动质量/劳动纪律与观察者；有权指导员/后勤检查表、课程实践评语",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "M008 · 任务成果/反思报告/作品；组织者原件或学生报告与授权教师复核",
      "purpose": "研究材料槽 M008：任务成果/反思报告/作品；组织者原件或学生报告与授权教师复核；A条（课程/项目要求）；自拍照片只证明展示、不能独立证明全程出勤；F016；R013；SRC-001,SRC-008。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "任务成果/反思报告/作品；组织者原件或学生报告与授权教师复核",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "M009 · 公益服务、校外劳动第三方证明；原单位可验证函/平台签发凭据",
      "purpose": "研究材料槽 M009：公益服务、校外劳动第三方证明；原单位可验证函/平台签发凭据；A条（校外活动）；外校表单非成理标准，验证失败CONFLICT/SOURCE_UNAVAILABLE；F018–F019；R015–R016；SRC-006,SRC-014。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "公益服务、校外劳动第三方证明；原单位可验证函/平台签发凭据",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "M010 · 出具证明主体及活动真实性；单位回执、学校组织方名单、机构核验链接",
      "purpose": "研究材料槽 M010：出具证明主体及活动真实性；单位回执、学校组织方名单、机构核验链接；A条（外部/证明真实性争议）；不是识别出公章即可通过；F011,F017–F018；R015；SRC-006,SRC-017。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "出具证明主体及活动真实性；单位回执、学校组织方名单、机构核验链接",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "M011 · 课程/学院生效的模块清单、计时换算、评分量规；教务/课程负责人文件",
      "purpose": "研究材料槽 M011：课程/学院生效的模块清单、计时换算、评分量规；教务/课程负责人文件；S先查适用范围，C必查评分；无原文POLICY_UNCONFIRMED，不使用外校比率；F007,F009,F020,F023,F037；R007,R017–R018,R021；SRC-003,SRC-005,SRC-008。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "课程/学院生效的模块清单、计时换算、评分量规；教务/课程负责人文件",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "M012 · 个人劳动教育认定台账与签发历史；校内课程认定服务，含占用活动区间",
      "purpose": "研究材料槽 M012：个人劳动教育认定台账与签发历史；校内课程认定服务，含占用活动区间；C必；源失联不从无记录推断未参加，先SOURCE_UNAVAILABLE；F021–F022,F028,F031；R019–R020,R025；SRC-008,SRC-017。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "个人劳动教育认定台账与签发历史；校内课程认定服务，含占用活动区间",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "M013 · 教师分项成绩草稿/过程评定记录；任课教师或教学平台签署的原始成绩",
      "purpose": "研究材料槽 M013：教师分项成绩草稿/过程评定记录；任课教师或教学平台签署的原始成绩；C条（课程结算时），此前后；不可读须人工重导；F016,F023–F024；R021–R023；SRC-008,SRC-009。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "教师分项成绩草稿/过程评定记录；任课教师或教学平台签署的原始成绩",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "M014 · 正式教务成绩/成绩变更流水；成绩服务签发记录",
      "purpose": "研究材料槽 M014：正式教务成绩/成绩变更流水；成绩服务签发记录；D条（已发布）；未发布时不得缺件，源失联SOURCE_UNAVAILABLE；F025,F028–F030；R023–R026；SRC-009,SRC-010。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "正式教务成绩/成绩变更流水；成绩服务签发记录",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "M015 · 本人事实争议/成绩复核理由、目标版本及证据；经身份绑定的申请",
      "purpose": "研究材料槽 M015：本人事实争议/成绩复核理由、目标版本及证据；经身份绑定的申请；X条（异议）；走S02-T06时需有效复核案号，截止期未知不硬拒；F030,F032；R026–R027；SRC-010,SRC-018。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "本人事实争议/成绩复核理由、目标版本及证据；经身份绑定的申请",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "M016 · 请假、补做、合理替代/豁免决定；有权课程/学院回执，可只采结论",
      "purpose": "研究材料槽 M016：请假、补做、合理替代/豁免决定；有权课程/学院回执，可只采结论；X条（缺席/特殊安排）；医疗原始证明限授权人，未知例外政策人工处理；F026–F027；R028–R029；SRC-015,SRC-017。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "请假、补做、合理替代/豁免决定；有权课程/学院回执，可只采结论",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "M017 · 场地、风险/实验准入、集体出行或经费外部已签决定；G决定引用",
      "purpose": "研究材料槽 M017：场地、风险/实验准入、集体出行或经费外部已签决定；G决定引用；S/A条（触发G的活动）；如果尚在办理，NEEDS_HUMAN_DECISION而非自动拒绝课程事实；F019,F035；R030；SRC-018。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "场地、风险/实验准入、集体出行或经费外部已签决定；G决定引用",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "M018 · 撤回请求及目标对象版本；本人或合法代理的签名请求",
      "purpose": "研究材料槽 M018：撤回请求及目标对象版本；本人或合法代理的签名请求；X条（撤回）；未提出时不要求，已发布成绩不得物理删除；F029,F031–F034；R031；SRC-010,SRC-017。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "撤回请求及目标对象版本；本人或合法代理的签名请求",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "M019 · 复核/成绩更正的签发结论；S02-T06/T01-T08或教务服务",
      "purpose": "研究材料槽 M019：复核/成绩更正的签发结论；S02-T06/T01-T08或教务服务；D条（发生异议或更正后）；未来件不提前报缺；F025,F028,F030；R026–R027；SRC-010,SRC-018。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "复核/成绩更正的签发结论；S02-T06/T01-T08或教务服务",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "M020 · 政策变更快照、项目规则版本与例外授权；学校正式发布机关",
      "purpose": "研究材料槽 M020：政策变更快照、项目规则版本与例外授权；学校正式发布机关；S/C条（跨学期、版本/冲突）；不可得POLICY_UNCONFIRMED；F004,F007,F020,F023,F031,F033,F037；R003,R017–R018,R032；SRC-003–SRC-005。由实际业务情形和阶段确定必需性；合法可信来源可替代申请人上传，数量上限非校本政策。",
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
        "政策变更快照、项目规则版本与例外授权；学校正式发布机关",
        "来源主体及对应目标",
        "当前有效版本/可核归属"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "curriculum",
      "name": "学籍、培养方案与课程归属",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "R001 · 提交的学生身份与可信主数据是否同一主体；S/所有；F001,F034/M001；SRC-017,SRC-018；SSO主体与案卷主体等值比较",
          "requirement": "R02本地研究检查（非校方政策）：提交的学生身份与可信主数据是否同一主体；S/所有；F001,F034/M001；SRC-017,SRC-018；SSO主体与案卷主体等值比较；T:PASS_FACT；F:CONFLICT→身份管理核实；U:SOURCE_UNAVAILABLE→教务/学籍接口管理员。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "R002 · 该学生在认定时点的学籍状态是否满足所指课程学段范围；S/目标专业；F002,F003/M001；SRC-005,SRC-010；比对学籍状态与有效方案",
          "requirement": "R02本地研究检查（非校方政策）：该学生在认定时点的学籍状态是否满足所指课程学段范围；S/目标专业；F002,F003/M001；SRC-005,SRC-010；比对学籍状态与有效方案；T:PASS_FACT；F:NOT_APPLICABLE（确实不在范围）→学生课程咨询；U:POLICY_UNCONFIRMED→学院教务判断休学/毕业衔接。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "R003 · 当期申请的培养方案版本是否真实且覆盖该生年级、专业、学段；S；F003,F004,F033/M002,M020；SRC-001,SRC-005；版本+生效窗口比对",
          "requirement": "R02本地研究检查（非校方政策）：当期申请的培养方案版本是否真实且覆盖该生年级、专业、学段；S；F003,F004,F033/M002,M020；SRC-001,SRC-005；版本+生效窗口比对；T:PASS_FACT；F:CONFLICT→教务更正方案指派；U:POLICY_UNCONFIRMED→院教务提供现行版。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "R004 · 当期培养方案是否含该生对应的劳动教育实践课程目标；S/课程适用者；F004,F005,F007/M002,M003；SRC-001,SRC-005；检查修读计划及课程性质",
          "requirement": "R02本地研究检查（非校方政策）：当期培养方案是否含该生对应的劳动教育实践课程目标；S/课程适用者；F004,F005,F007/M002,M003；SRC-001,SRC-005；检查修读计划及课程性质；T:PASS_FACT；F:NOT_APPLICABLE→引导正确课程；U:POLICY_UNCONFIRMED→课程负责人定范围。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "R005 · 该学生与目标课程实例/学期是否有可信修读关系；S；F005,F006/M003；SRC-008,SRC-010；选课注册比对",
          "requirement": "R02本地研究检查（非校方政策）：该学生与目标课程实例/学期是否有可信修读关系；S；F005,F006/M003；SRC-008,SRC-010；选课注册比对；T:PASS_FACT；F:CONFLICT→学院教务核课程归属；U:SOURCE_UNAVAILABLE→教务平台管理员。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "activity",
      "name": "劳动任务、参与、质量与外部事实",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r006",
          "title": "R006 · 活动是否属于有来源ID的真实任务/排班；A/计入课程的项目；F008,F010,F012/M004；SRC-004,SRC-006；活动ID与公开或签发排班比对",
          "requirement": "R02本地研究检查（非校方政策）：活动是否属于有来源ID的真实任务/排班；A/计入课程的项目；F008,F010,F012/M004；SRC-004,SRC-006；活动ID与公开或签发排班比对；T:PASS_FACT；F:NOT_APPLICABLE（证实纯非课程活动）→路由S05-T02等；U:NEEDS_MATERIAL→组织方补任务令。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r007",
          "title": "R007 · 该活动所属劳动课程模块是否由适用校本课程政策明确允许；S→A/各模块；F007,F009/M004,M011；SRC-003,SRC-004,SRC-005；核模块字典与实际活动内容",
          "requirement": "R02本地研究检查（非校方政策）：该活动所属劳动课程模块是否由适用校本课程政策明确允许；S→A/各模块；F007,F009/M004,M011；SRC-003,SRC-004,SRC-005；核模块字典与实际活动内容；T:PASS_FACT；F:NOT_APPLICABLE→相关S/T；U:POLICY_UNCONFIRMED→课程负责人提供模块清单。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r008",
          "title": "R008 · 出具活动任务/通知的组织方身份与课程/活动ID是否匹配；A；F011,F012/M004,M010；SRC-004,SRC-006；签发主体/机构域名及版本校验",
          "requirement": "R02本地研究检查（非校方政策）：出具活动任务/通知的组织方身份与课程/活动ID是否匹配；A；F011,F012/M004,M010；SRC-004,SRC-006；签发主体/机构域名及版本校验；T:PASS_FACT；F:CONFLICT→组织单位解释；U:SOURCE_UNAVAILABLE→学院核原始通知。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r009",
          "title": "R009 · 学生是否在该项目原始考勤记录中有实际到场记录；A；F001,F008,F014/M005,M006；SRC-004,SRC-007；按学号+活动+时段核对",
          "requirement": "R02本地研究检查（非校方政策）：学生是否在该项目原始考勤记录中有实际到场记录；A；F001,F008,F014/M005,M006；SRC-004,SRC-007；按学号+活动+时段核对；T:PASS_FACT；F:CONFLICT（自报参与却权威记录否定）→现场指导员核实；U:NEEDS_MATERIAL/后台缺失SOURCE_UNAVAILABLE→考勤持有人。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r010",
          "title": "R010 · 所申报起止区间是否与有权现场记录重合且不超过其实际观察范围；A；F010,F013,F015/M006；SRC-007,SRC-009；区间交并与端点签发核查",
          "requirement": "R02本地研究检查（非校方政策）：所申报起止区间是否与有权现场记录重合且不超过其实际观察范围；A；F010,F013,F015/M006；SRC-007,SRC-009；区间交并与端点签发核查；T:PASS_FACT；F:CONFLICT→现场指导员修正时段；U:NEEDS_MATERIAL→补可追溯考勤。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r011",
          "title": "R011 · 同一学生、同一时段的请假/缺勤与到场记录是否不矛盾；A/出现缺勤记录；F010,F014,F026/M005,M006,M016；SRC-007,SRC-010；对照请假与现场登记",
          "requirement": "R02本地研究检查（非校方政策）：同一学生、同一时段的请假/缺勤与到场记录是否不矛盾；A/出现缺勤记录；F010,F014,F026/M005,M006,M016；SRC-007,SRC-010；对照请假与现场登记；T:PASS_FACT；F:CONFLICT→学院/现场双方调查；U:SOURCE_UNAVAILABLE→请假系统管理者。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r012",
          "title": "R012 · 申报时长的单位是否与可信记录一致且可无损比较；A；F013,F015/M006；SRC-005,SRC-007；检查单位hour/session/week及精度",
          "requirement": "R02本地研究检查（非校方政策）：申报时长的单位是否与可信记录一致且可无损比较；A；F013,F015/M006；SRC-005,SRC-007；检查单位hour/session/week及精度；T:PASS_FACT；F:CONFLICT→学生/组织方更正单位；U:POLICY_UNCONFIRMED（学周折时）→课程负责人；禁止直接乘8。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r013",
          "title": "R013 · 课程要求的劳动成果或表现项是否有具体观察/作品记录；A/需表现评价的项目；F016/M007,M008；SRC-001,SRC-008；逐评价项与证据比对",
          "requirement": "R02本地研究检查（非校方政策）：课程要求的劳动成果或表现项是否有具体观察/作品记录；A/需表现评价的项目；F016/M007,M008；SRC-001,SRC-008；逐评价项与证据比对；T:PASS_FACT；F:NEEDS_MATERIAL→指导员补记录（未要求成果的项目为NOT_APPLICABLE）；U:POLICY_UNCONFIRMED→教师核项目评价要求。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r014",
          "title": "R014 · 现场评分/评语是否由该项目有权指导评定人签发；A/C；F016,F017,F034/M007,M010；SRC-007,SRC-008；签署人与活动授权交集",
          "requirement": "R02本地研究检查（非校方政策）：现场评分/评语是否由该项目有权指导评定人签发；A/C；F016,F017,F034/M007,M010；SRC-007,SRC-008；签署人与活动授权交集；T:PASS_FACT；F:CONFLICT→课程教师/组织单位核签；U:NEEDS_HUMAN_DECISION（授权角色不明）→学院课程负责人。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r015",
          "title": "R015 · 校外/公益证明是否可向原出具机构验证其活动、学生、日期一致；A/外部来源；F011,F018/M009,M010；SRC-006,SRC-017；机构核验回执/授权接口",
          "requirement": "R02本地研究检查（非校方政策）：校外/公益证明是否可向原出具机构验证其活动、学生、日期一致；A/外部来源；F011,F018/M009,M010；SRC-006,SRC-017；机构核验回执/授权接口；T:PASS_FACT；F:CONFLICT→原机构与学生核实；U:SOURCE_UNAVAILABLE（联系不到原机构）→学院课程人工决定是否接受替代。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r016",
          "title": "R016 · 已被认定的志愿/社会实践项目能否在本校当期劳动教育方案下用于本模块；A/跨项目；F009,F018,F019/M009,M011,M017；SRC-003,SRC-006,SRC-018；核项目性质与",
          "requirement": "R02本地研究检查（非校方政策）：已被认定的志愿/社会实践项目能否在本校当期劳动教育方案下用于本模块；A/跨项目；F009,F018,F019/M009,M011,M017；SRC-003,SRC-006,SRC-018；核项目性质与映射授权；T:PASS_FACT（仅有资格映射）；F:NOT_APPLICABLE→S05-T02/S06-T05；U:POLICY_UNCONFIRMED→课程负责人；跨项决定只引用不重签。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    },
    {
      "id": "recognition",
      "name": "学时归属、课程评分与授权",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r017",
          "title": "R017 · 活动原始单位到劳动课程认定单位是否有当前有效的换算公式；C/计量活动；F015,F020,F033/M011,M020；SRC-001,SRC-005；规则版号与单位维度",
          "requirement": "R02本地研究检查（非校方政策）：活动原始单位到劳动课程认定单位是否有当前有效的换算公式；C/计量活动；F015,F020,F033/M011,M020；SRC-001,SRC-005；规则版号与单位维度；T:PASS_FACT；F:POLICY_UNCONFIRMED→教务确认换算；U:POLICY_UNCONFIRMED→不得计算金额/学时；外校方案不生效。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "R018 · 拟认定数量是否在当前适用课程模块额度、上限及不可重复条款内；C/有完整政策的项目；F020,F021,F023/M011,M012,M020；SRC-003,SRC-005；按已签台账聚合且检查上限",
          "requirement": "R02本地研究检查（非校方政策）：拟认定数量是否在当前适用课程模块额度、上限及不可重复条款内；C/有完整政策的项目；F020,F021,F023/M011,M012,M020；SRC-003,SRC-005；按已签台账聚合且检查上限；T:PASS_FACT（数量待有权签）；F:CONFLICT→课程负责人裁定异常；U:POLICY_UNCONFIRMED→配置额度与合计单位。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "R019 · 同一活动同一时间片是否已被本劳动课程台账占用认定；C/重复申报；F008,F021,F022/M005,M012；SRC-008,SRC-018；按学生/活动/片段/版本检索",
          "requirement": "R02本地研究检查（非校方政策）：同一活动同一时间片是否已被本劳动课程台账占用认定；C/重复申报；F008,F021,F022/M005,M012；SRC-008,SRC-018；按学生/活动/片段/版本检索；T（确有占用）:CONFLICT→课程管理员去重；F（未占用）:PASS_FACT；U:SOURCE_UNAVAILABLE→课程台账管理员。注意谓词为“已占用”。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "R020 · 聚合前后个人劳动实践已认定总量与每一来源条目之和是否一致；C/结算；F020–F022/M012；SRC-005,SRC-008；同量纲汇总并比对版本",
          "requirement": "R02本地研究检查（非校方政策）：聚合前后个人劳动实践已认定总量与每一来源条目之和是否一致；C/结算；F020–F022/M012；SRC-005,SRC-008；同量纲汇总并比对版本；T:PASS_FACT；F:CONFLICT→课程管理员修台账；U:SOURCE_UNAVAILABLE→教务数据管理员。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "R021 · 当前课程成绩草稿引用的评分量规是否与学生培养计划和学期一致；C/期末；F004,F023,F037/M002,M011,M013；SRC-005,SRC-008；版号、学期、分项检查",
          "requirement": "R02本地研究检查（非校方政策）：当前课程成绩草稿引用的评分量规是否与学生培养计划和学期一致；C/期末；F004,F023,F037/M002,M011,M013；SRC-005,SRC-008；版号、学期、分项检查；T:PASS_FACT；F:CONFLICT→任课教师重新计算；U:POLICY_UNCONFIRMED→课程负责人提供当期量规。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "R022 · 每项课程表现分数/等级是否可追溯到对应有权原始评价记录；C/期末；F016,F017,F024/M007,M013；SRC-008,SRC-009；逐项核指标、来源与签名",
          "requirement": "R02本地研究检查（非校方政策）：每项课程表现分数/等级是否可追溯到对应有权原始评价记录；C/期末；F016,F017,F024/M007,M013；SRC-008,SRC-009；逐项核指标、来源与签名；T:PASS_FACT；F:CONFLICT→任课教师核分项；U:NEEDS_MATERIAL（评分依据确需却缺）→教师补过程材料；未到期末为NOT_APPLICABLE。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "R023 · 成绩草稿与教务已发布成绩是否指向同一有效课程实例与版本；D/仅正式发布后；F005,F024,F025/M013,M014；SRC-009,SRC-010；课程/学期/成绩版比对",
          "requirement": "R02本地研究检查（非校方政策）：成绩草稿与教务已发布成绩是否指向同一有效课程实例与版本；D/仅正式发布后；F005,F024,F025/M013,M014；SRC-009,SRC-010；课程/学期/成绩版比对；T:PASS_FACT；F:CONFLICT→教师走T01-T08/教务更正；U:SOURCE_UNAVAILABLE→教务成绩管理员；发布前NOT_APPLICABLE。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "R024 · 拟发起课程成绩入账/更正的actor是否持有该课程和操作的可信权限；C/D；F025,F034/M003,M014；SRC-008,SRC-009；服务端角色+课程授权验证",
          "requirement": "R02本地研究检查（非校方政策）：拟发起课程成绩入账/更正的actor是否持有该课程和操作的可信权限；C/D；F025,F034/M003,M014；SRC-008,SRC-009；服务端角色+课程授权验证；T:PASS_FACT（仅权限事实）；F:NEEDS_HUMAN_DECISION→权限管理员阻止提交；U:SOURCE_UNAVAILABLE→教务授权服务；AI永不代签。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "R025 · 待签劳动认定决定是否明确绑定学生、课程、项目、证据快照与政策版本；C/签发前；F001,F004,F008,F028,F031–F033/M011,M012,M020；SRC-008,SRC-018；",
          "requirement": "R02本地研究检查（非校方政策）：待签劳动认定决定是否明确绑定学生、课程、项目、证据快照与政策版本；C/签发前；F001,F004,F008,F028,F031–F033/M011,M012,M020；SRC-008,SRC-018；检查所有对象版号、过期失效；T:PASS_FACT（仅记录完整）；F:CONFLICT→学院课程管理员重建提议；U:NEEDS_HUMAN_DECISION→正式签发人拒绝盲签。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "appeal",
      "name": "争议、替代、撤回与重审",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "r026",
          "title": "R026 · 学生异议的对象究竟是未发布的项目事实还是已发布的课程成绩；X/争议；F025,F030/M014,M015；SRC-010,SRC-018；目标类型与已发布状态校验",
          "requirement": "R02本地研究检查（非校方政策）：学生异议的对象究竟是未发布的项目事实还是已发布的课程成绩；X/争议；F025,F030/M014,M015；SRC-010,SRC-018；目标类型与已发布状态校验；T（项目事实）:PASS_FACT→本案重核；F（正式成绩）:NOT_APPLICABLE→S02-T06；U:SOURCE_UNAVAILABLE→教务确认发布状态。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "R027 · 复核/成绩变更引用的上一决定与新决定是否构成有权、可追溯替代链；D/复核后；F025,F028,F030,F032/M014,M015,M019；SRC-009,SRC-010；actor+前后版+原",
          "requirement": "R02本地研究检查（非校方政策）：复核/成绩变更引用的上一决定与新决定是否构成有权、可追溯替代链；D/复核后；F025,F028,F030,F032/M014,M015,M019；SRC-009,SRC-010；actor+前后版+原因核验；T:PASS_FACT；F:CONFLICT→复核受理机构/教务核查；U:NEEDS_HUMAN_DECISION→等待正式复核决定，不能覆盖旧成绩。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "R028 · 该生特殊缺勤是否落入有权公布的补做/替代/豁免可申请情形；X/缺勤者；F026,F033/M016,M020；SRC-001,SRC-015；校本规则与原因类型比对",
          "requirement": "R02本地研究检查（非校方政策）：该生特殊缺勤是否落入有权公布的补做/替代/豁免可申请情形；X/缺勤者；F026,F033/M016,M020；SRC-001,SRC-015；校本规则与原因类型比对；T:PASS_FACT（仅可提出）；F:NOT_APPLICABLE→按一般课程处理；U:POLICY_UNCONFIRMED→学院教务；外校六学时补做不适用。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "R029 · 该特殊补做/替代是否有真正有权的决定与对应完成事实；X/已有补做；F027,F014,F034/M006,M016；SRC-008,SRC-017；核决定签发与新活动对应",
          "requirement": "R02本地研究检查（非校方政策）：该特殊补做/替代是否有真正有权的决定与对应完成事实；X/已有补做；F027,F014,F034/M006,M016；SRC-008,SRC-017；核决定签发与新活动对应；T:PASS_FACT；F:NEEDS_HUMAN_DECISION→课程负责人核定；U:NEEDS_MATERIAL（已完成补做无现场记录）→指导员补件；未完成时为NOT_APPLICABLE。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "R030 · 该活动所需的外部G事项许可是否存在且与活动范围、时间和版本一致；S/A/确需安全/场地/经费等事项；F012,F019,F035/M004,M017；SRC-018；只读取G决定ID、范围及有效期",
          "requirement": "R02本地研究检查（非校方政策）：该活动所需的外部G事项许可是否存在且与活动范围、时间和版本一致；S/A/确需安全/场地/经费等事项；F012,F019,F035/M004,M017；SRC-018；只读取G决定ID、范围及有效期；T:PASS_FACT（G事实）；F:NEEDS_HUMAN_DECISION→G03/G04/G05/G07相应主管；U:SOURCE_UNAVAILABLE→关联许可服务；不由本规则签发G许可。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "R031 · 撤回者是否为有权本人且请求的目标决定仍处于允许撤回的阶段；X/撤回；F028,F029,F032,F034/M018,M012,M014；SRC-010,SRC-017；服务端身份+案卷版本+发布状态",
          "requirement": "R02本地研究检查（非校方政策）：撤回者是否为有权本人且请求的目标决定仍处于允许撤回的阶段；X/撤回；F028,F029,F032,F034/M018,M012,M014；SRC-010,SRC-017；服务端身份+案卷版本+发布状态比较；T:PASS_FACT（可受理撤回请求）→案卷负责人；F:NEEDS_HUMAN_DECISION（已签/已发布）→有权撤销/更正流程；U:SOURCE_UNAVAILABLE→教务确认状态。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "R032 · 新上传/签发的证据是否改变任何已核规则所消费的字段、来源或对象版本；任意补件/撤回后；F031,F032,F036/M006,M007,M011,M012,M020；SRC-008,SRC-018；对",
          "requirement": "R02本地研究检查（非校方政策）：新上传/签发的证据是否改变任何已核规则所消费的字段、来源或对象版本；任意补件/撤回后；F031,F032,F036/M006,M007,M011,M012,M020；SRC-008,SRC-018；对依赖指纹做差异比对；T:PASS_FACT（触发影响规则失效和定向重审）→案卷服务；F:NOT_APPLICABLE（完全同一证据版本）→无须重跑；U:CONFLICT（版本不可追）→管理员冻结旧判。只形成可追溯事实、问题或待办建议；未知政策/签批权必须人工确认，PASS_FACT 不等于正式通过。",
          "execution": "semantic",
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
  "templateId": "S05-T03",
  "name": "劳动教育实践学时、课程表现认定审核",
  "sourceDocPath": "docs/design/review-agent/business-templates/R02/S05-T03.md",
  "sourceDocSha256": "ef9a823a8f17b0062338d3a738fb59d0e8b9dce880c60e78f7b3e37a2f574f1b",
  "originalResearchPath": "ChatGPT Library:/S05-T03_正式业务模板_MD_v1.0.md",
  "originalResearchSha256": "36839af61cca5237c13664f5ceedd30902846c233bfcf15bbc67ad571f08aab7",
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
    "F036",
    "F037"
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
      "title": "教育部，《大中小学劳动教育指导纲要（试行）》，教材〔2020〕4号，全文，「课程设置、实施途径、评价」段",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.moe.gov.cn/srcsite/A26/jcj_kcjcgh/202007/t20200715_472808.html"
      ],
      "scopeNote": "2020-07；普通高校本科等；GENERAL-RESEARCH（全国政策）；本科劳动教育纳入培养方案，依托课程不少于32学时；要求日常劳动、劳动周（月）及过程评价。不是单个实践槽固定32h。"
    },
    {
      "id": "SRC-002",
      "title": "中共中央、国务院，《关于全面加强新时代大中小学劳动教育的意见》，全文，「全面构建」「劳动素养评价」",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.moe.gov.cn/jyb_xxgk/moe_1777/moe_1778/202003/t20200326_435127.html"
      ],
      "scopeNote": "2020-03；全国；GENERAL-RESEARCH；劳动教育纳入培养全过程，评价劳动参与及实践表现；不能以其推导成理项目评分细则。"
    },
    {
      "id": "SRC-003",
      "title": "成都理工大学主页，《协同担当育桃李……高校后勤劳动育人实践基地》，新闻，「四大课程模块」",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://www.cdut.edu.cn/info/1414/22004.htm"
      ],
      "scopeNote": "2025年度成果报道；成理办学事实；CDUT-VERIFIED（存在性）；引《学生劳动教育实施方案》《〈劳动教育〉课程实施方案》，四模块：理论、生活生产、公益服务岗位、专业创新劳动；两方案全文未得。"
    },
    {
      "id": "SRC-004",
      "title": "成都理工大学地球与行星科学学院，《关于开展2026年春季学期“集体劳动日”主题教育活动的通知》，正文，一至四",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://ces.cdut.edu.cn/info/1148/7805.htm"
      ],
      "scopeNote": "2026-03-09；地科院全体学生，2025级本科校园清洁任务；CDUT-VERIFIED（本学院本学期）；每周三集体劳动日，寝室卫生与2025级班级校园清洁；具体安排由学院公众号通知；所引学院《实践课程实施方案（试行）》附件1未取得，不能确证课时、评分、考勤认定办法。"
    },
    {
      "id": "SRC-005",
      "title": "成都理工大学《本科专业人才培养方案（2025版）》，地球物理学卓越班PDF，第8页总表、第12–13页学期表",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://cog.cdut.edu.cn/__local/9/2F/69/9CBFE4BB110BF2026CDDEAD9F49_CB9AB1C3_AC75F.pdf"
      ],
      "scopeNote": "2025版、该特定本科专业；CDUT-VERIFIED（专业计划条目）；劳动理论0.5学分8学时、实践1.5学分1.5周；学周不能未经政策换算为钟点小时，不代表所有专业/级别。"
    },
    {
      "id": "SRC-006",
      "title": "成都理工大学校团委，《关于开展2025年大学生寒假“返家乡”社会实践活动的通知》，正文，活动评价段",
      "sourceStatus": "CDUT-VERIFIED",
      "evidenceStatus": "VERIFIED",
      "urls": [
        "https://youth.cdut.edu.cn/info/1006/2821.htm"
      ],
      "scopeNote": "2025寒假活动批次；CDUT-VERIFIED（特定活动通知）；院系将实践成果作为劳动教育公益服务劳动实践环节的考核评价内容；没有公布自动等时折算比例。"
    },
    {
      "id": "SRC-007",
      "title": "成都理工大学后勤保障部，《后勤服务集团楼寓中心组织开展学生劳动教育实践活动》，报道，实践检查段",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://clhq.cdut.edu.cn/info/1059/1607.htm"
      ],
      "scopeNote": "约2022年实践；CURRENTITY-UNKNOWN；楼寓中心指导、检查、考核寝室/教学楼等劳动；证明历史存在现场责任人记录，不能视为2026通用考核细则。"
    },
    {
      "id": "SRC-008",
      "title": "成都理工大学，《本科课程教学基本规范》，学院发布，「课程考核与成绩评定」及过程记录",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://mee.cdut.edu.cn/info/1117/1944.htm"
      ],
      "scopeNote": "2022年左右公开；CURRENTITY-UNKNOWN（未核替代文件）；任课教师对学习成绩评定负责，评分比例依课程教学大纲；支持过程表现材料，不给出劳动课专用比例。"
    },
    {
      "id": "SRC-009",
      "title": "成都理工大学《课程考核管理规定》，成理校教〔2017〕28号，学校制度汇编PDF，PDF第59–65页，第三、四、二十五、二十八条",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf"
      ],
      "scopeNote": "2017-12；普通本专科考核；CURRENTITY-UNKNOWN；考查含出勤、讨论、作业、实践等；历史规定教师保留过程记录、成绩上传并严格更改。不能直接判定2026劳动课的计分/更正期限。"
    },
    {
      "id": "SRC-010",
      "title": "成都理工大学《全日制普通本科学生学籍管理办法》，成理校教〔2019〕18号，同校汇编PDF，PDF第41–52页，第二十四至二十八条",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf"
      ],
      "scopeNote": "2019-12生效，适用本校普通本科；CURRENTITY-UNKNOWN；历史学生成绩复核程序、成绩存档及实践类考核处理线索；2026是否仍用其具体天数要教务处复核，不能硬判时限。"
    },
    {
      "id": "SRC-011",
      "title": "成都理工大学《本科教育教学审核评估任务分解表》，学校PDF，PDF第12–13页2.1.2、5.2.2–5.2.3",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://mee.cdut.edu.cn/__local/B/6F/D6/A69883A35C98AF51BDA2C78B01F_A670A01A_D4C21.pdf"
      ],
      "scopeNote": "2022审核评估；CURRENTITY-UNKNOWN（管理职责线索）；教务处、学生工作部门及各学院按不同维度承担教学与劳育推进，团委另列志愿/社团；不能从职责总表推出成绩最终签章人。"
    },
    {
      "id": "SRC-012",
      "title": "成都理工大学校团委，《工作简报》，PDF，约第18–19页「劳育篇」",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://youth.cdut.edu.cn/__local/B/EE/BE/EDD9F3CD6FAD6E280380D1E2852_0D8693BA_1B9213.pdf"
      ],
      "scopeNote": "2024秋季事件；CURRENTITY-UNKNOWN；机电工程学院有独立学期课程实践实施方案、地科院有集体劳动日；说明学院差异是现实存在的。"
    },
    {
      "id": "SRC-013",
      "title": "成都理工大学《章程》，官网，第88条",
      "sourceStatus": "CURRENTITY-UNKNOWN",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://www.cdut.edu.cn/info/1366/7658.htm"
      ],
      "scopeNote": "官网公开章程，当前修订状态待复核；CURRENTITY-UNKNOWN；保障学生接受劳动教育的权利；不是免考学时或无须课程要求的依据。"
    },
    {
      "id": "SRC-014",
      "title": "东南大学机械工程学院，《〈劳动教育与实践〉课程学时及实践课程选课的说明》，正文",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://me.seu.edu.cn/ug/2024/0919/c29189a503301/page.htm"
      ],
      "scopeNote": "2024-09；东南大学；CROSS-SCHOOL-REFERENCE；区分生活劳动16学时与项目课；仅提供模块与特殊学生补足的设计示例，不得用于成理计算。"
    },
    {
      "id": "SRC-015",
      "title": "沈阳建筑大学教务处《劳动教育课程实施文件》，学校PDF，「成绩考核」",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://jw.sjzu.edu.cn/__local/0/6D/6B/E21F0A37CB099DA117084BF1A54_1816F3A9_310CA.pdf"
      ],
      "scopeNote": "约2023–2024；沈阳建筑大学；CROSS-SCHOOL-REFERENCE；每学期6学时、两级评分、请假补做等仅用于提醒配置这些分支；绝非成理要求。"
    },
    {
      "id": "SRC-016",
      "title": "大连海洋大学，《关于在2024级学生中开展〈劳动实践〉必修课程的通知》，正文，「成绩认定」",
      "sourceStatus": "CROSS-SCHOOL-REFERENCE",
      "evidenceStatus": "UNCONFIRMED",
      "urls": [
        "https://www.dlou.edu.cn/2025/1113/c5866a199599/page.htm"
      ],
      "scopeNote": "2025-11，2024级；CROSS-SCHOOL-REFERENCE；组织/后勤/学院分工及老师汇总成绩链示例；其24小时、比例及加分不用于成理。"
    },
    {
      "id": "SRC-017",
      "title": "全国人大常委会，《中华人民共和国个人信息保护法》，工信部公布全文，第6、28–30条",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [
        "https://www.miit.gov.cn/jgsj/zfs/fl/art/2022/art_515a4b20c12f430eab54bb4f56d89f56.html"
      ],
      "scopeNote": "2021-11-01施行，全国；GENERAL-RESEARCH；最小必要和敏感信息保护要求：医疗、行踪等不作为一般审核必收件。"
    },
    {
      "id": "SRC-018",
      "title": "成都理工大学 R02《ST-CANDIDATE-MASTER-CATALOG-R02》《ST-CATALOG-AUDIT-R02》及任务合同（本次整合ZIP内对应路径）",
      "sourceStatus": "GENERAL-RESEARCH",
      "evidenceStatus": "PARTIAL",
      "urls": [],
      "scopeNote": "2026-10-22；内部研究项目目录；GENERAL-RESEARCH（非校规）；锁定S05-T03名称、S05-T02与T03不同学时体系、G50判重与交付编号规范。"
    }
  ],
  "criteria": [
    {
      "sectionId": "curriculum",
      "criterionId": "r001",
      "srcIds": [
        "SRC-017",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F001",
        "F034"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "curriculum",
      "criterionId": "r002",
      "srcIds": [
        "SRC-005",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002",
        "F003"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "curriculum",
      "criterionId": "r003",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F003",
        "F004",
        "F033"
      ],
      "materialSlotIds": [
        "M002",
        "M020"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "curriculum",
      "criterionId": "r004",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F004",
        "F005",
        "F007"
      ],
      "materialSlotIds": [
        "M002",
        "M003"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "curriculum",
      "criterionId": "r005",
      "srcIds": [
        "SRC-008",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F005",
        "F006"
      ],
      "materialSlotIds": [
        "M003"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "activity",
      "criterionId": "r006",
      "srcIds": [
        "SRC-004",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F008",
        "F010",
        "F012"
      ],
      "materialSlotIds": [
        "M004"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "activity",
      "criterionId": "r007",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F007",
        "F009"
      ],
      "materialSlotIds": [
        "M004",
        "M011"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "activity",
      "criterionId": "r008",
      "srcIds": [
        "SRC-004",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F011",
        "F012"
      ],
      "materialSlotIds": [
        "M004",
        "M010"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "activity",
      "criterionId": "r009",
      "srcIds": [
        "SRC-004",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F001",
        "F008",
        "F014"
      ],
      "materialSlotIds": [
        "M005",
        "M006"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "activity",
      "criterionId": "r010",
      "srcIds": [
        "SRC-007",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F010",
        "F013",
        "F015"
      ],
      "materialSlotIds": [
        "M006"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "activity",
      "criterionId": "r011",
      "srcIds": [
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F010",
        "F014",
        "F026"
      ],
      "materialSlotIds": [
        "M005",
        "M006",
        "M016"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "activity",
      "criterionId": "r012",
      "srcIds": [
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F013",
        "F015"
      ],
      "materialSlotIds": [
        "M006"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "activity",
      "criterionId": "r013",
      "srcIds": [
        "SRC-001",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F016"
      ],
      "materialSlotIds": [
        "M007",
        "M008"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "activity",
      "criterionId": "r014",
      "srcIds": [
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F016",
        "F017",
        "F034"
      ],
      "materialSlotIds": [
        "M007",
        "M010"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "activity",
      "criterionId": "r015",
      "srcIds": [
        "SRC-006",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F011",
        "F018"
      ],
      "materialSlotIds": [
        "M009",
        "M010"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "activity",
      "criterionId": "r016",
      "srcIds": [
        "SRC-003",
        "SRC-006",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F009",
        "F018",
        "F019"
      ],
      "materialSlotIds": [
        "M009",
        "M011",
        "M017"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "recognition",
      "criterionId": "r017",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F015",
        "F020",
        "F033"
      ],
      "materialSlotIds": [
        "M011",
        "M020"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "recognition",
      "criterionId": "r018",
      "srcIds": [
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F020",
        "F021",
        "F023"
      ],
      "materialSlotIds": [
        "M011",
        "M012",
        "M020"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "recognition",
      "criterionId": "r019",
      "srcIds": [
        "SRC-008",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F008",
        "F021",
        "F022"
      ],
      "materialSlotIds": [
        "M005",
        "M012"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "recognition",
      "criterionId": "r020",
      "srcIds": [
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F020",
        "F021",
        "F022"
      ],
      "materialSlotIds": [
        "M012"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "recognition",
      "criterionId": "r021",
      "srcIds": [
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F004",
        "F023",
        "F037"
      ],
      "materialSlotIds": [
        "M002",
        "M011",
        "M013"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "recognition",
      "criterionId": "r022",
      "srcIds": [
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F016",
        "F017",
        "F024"
      ],
      "materialSlotIds": [
        "M007",
        "M013"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "recognition",
      "criterionId": "r023",
      "srcIds": [
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F005",
        "F024",
        "F025"
      ],
      "materialSlotIds": [
        "M013",
        "M014"
      ],
      "policyOrAuthorityGate": false
    },
    {
      "sectionId": "recognition",
      "criterionId": "r024",
      "srcIds": [
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F025",
        "F034"
      ],
      "materialSlotIds": [
        "M003",
        "M014"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "recognition",
      "criterionId": "r025",
      "srcIds": [
        "SRC-008",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F001",
        "F004",
        "F008",
        "F028",
        "F031",
        "F032",
        "F033"
      ],
      "materialSlotIds": [
        "M011",
        "M012",
        "M020"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "appeal",
      "criterionId": "r026",
      "srcIds": [
        "SRC-010",
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F025",
        "F030"
      ],
      "materialSlotIds": [
        "M014",
        "M015"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "appeal",
      "criterionId": "r027",
      "srcIds": [
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F025",
        "F028",
        "F030",
        "F032"
      ],
      "materialSlotIds": [
        "M014",
        "M015",
        "M019"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "appeal",
      "criterionId": "r028",
      "srcIds": [
        "SRC-001",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F026",
        "F033"
      ],
      "materialSlotIds": [
        "M016",
        "M020"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "appeal",
      "criterionId": "r029",
      "srcIds": [
        "SRC-008",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F014",
        "F027",
        "F034"
      ],
      "materialSlotIds": [
        "M006",
        "M016"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "appeal",
      "criterionId": "r030",
      "srcIds": [
        "SRC-018"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F012",
        "F019",
        "F035"
      ],
      "materialSlotIds": [
        "M004",
        "M017"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "appeal",
      "criterionId": "r031",
      "srcIds": [
        "SRC-010",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F028",
        "F029",
        "F032",
        "F034"
      ],
      "materialSlotIds": [
        "M012",
        "M014",
        "M018"
      ],
      "policyOrAuthorityGate": true
    },
    {
      "sectionId": "appeal",
      "criterionId": "r032",
      "srcIds": [
        "SRC-008",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F031",
        "F032",
        "F036"
      ],
      "materialSlotIds": [
        "M006",
        "M007",
        "M011",
        "M012",
        "M020"
      ],
      "policyOrAuthorityGate": false
    }
  ]
} as const
