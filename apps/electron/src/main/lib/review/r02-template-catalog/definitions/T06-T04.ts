// Generated from the reviewed R02 research document. This is not a school-issued template.
import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "T06-T04",
  "version": 1,
  "schemaVersion": 2,
  "name": "教师本科及研究生课程任课资格审核",
  "description": "教师本科及研究生课程任课资格审核。本地研究模板 · 非校方正式模板；校本政策证据为部分核实，未知条件只生成事实核验和人工复核建议。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 研究稿用于本地辅助审查，不是校方正式模板、政策版本或授权决定。当前政策证据状态 PARTIAL；不得据此自动批准或拒绝。",
  "objectType": "person",
  "displayName": {
    "template": "教师本科及研究生课程任课资格审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "case_id UUID/稳定字符串；Case；S0+",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F001；case_id UUID/稳定字符串；Case；S0+；服务端创建事件及 M001/M020 的案卷索引；设计字段，非校本表单栏；P0；无主键拒绝建有效案卷，交系统纠错"
    },
    {
      "key": "F002",
      "label": "case_scenario 枚举 A–K 可复合；Case；S0+",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F002；case_scenario 枚举 A–K 可复合；Case；S0+；S0 本人/学院陈述与课程性质比对 M001/M006；SRC-001/003/004/005；P0；补/政，不可默认按本科普通课"
    },
    {
      "key": "F003",
      "label": "teacher_person_key 字符串/权威主体 ID；CaseTarget；S0+",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F003；teacher_person_key 字符串/权威主体 ID；CaseTarget；S0+；人事/受控教师名录 M002/M003；SRC-002/006（人员事实参考）；P1；源/冲，姓名近似不自动同人"
    },
    {
      "key": "F004",
      "label": "initiator_actor_and_authority 结构体；Case；S0+",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F004；initiator_actor_and_authority 结构体；Case；S0+；服务端认证/代理授权事件 M002/M020；SRC-003 只支持指定批次本人申报；P2；权限未核禁止代表他人提交"
    },
    {
      "key": "F005",
      "label": "employment_status_and_valid_at 状态＋时间区间；Teacher；S1+",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F005；employment_status_and_valid_at 状态＋时间区间；Teacher；S1+；人事处岗位聘用记录 M003；SRC-002（适用学期），研究生是否同条件待核；P2；源，本人劳动合同照片不能直接判定"
    },
    {
      "key": "F006",
      "label": "higher_ed_teacher_certificate 编号/状态/发证机构；Teacher；S1+（分支适用）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F006；higher_ed_teacher_certificate 编号/状态/发证机构；Teacher；S1+（分支适用）；教师资格权威记录 M004；SRC-002/003/006；P2；本科适用按来源核验；研究生条件未知为政，失联源"
    },
    {
      "key": "F007",
      "label": "professional_title_and_effective_date 枚举/日期；Teacher；S1+",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F007；professional_title_and_effective_date 枚举/日期；Teacher；S1+；人事职称台账/核验原件 M005；SRC-001 §19、SRC-004 旧文；P2；源/冲；研究生旧阈值不执行"
    },
    {
      "key": "F008",
      "label": "highest_education_and_degree_evidence 学历层次＋学位类别＋授予/取得日期；Teacher；S1+",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F008；highest_education_and_degree_evidence 学历层次＋学位类别＋授予/取得日期；Teacher；S1+；学历学位校验/人事学历学位台账 M005；SRC-001 §19、SRC-004 历史；P2；源/冲，学历与学位不自动等同，不凭 OCR 推真实证明"
    },
    {
      "key": "F009",
      "label": "discipline_or_subject_fit_evidence 学科类目＋说明；CaseTarget；S1/S2",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F009；discipline_or_subject_fit_evidence 学科类目＋说明；CaseTarget；S1/S2；学历专业与教学能力支持 M005/M008，学院专业适任审查 SRC-001；并非已有学校量化算法；P2；裁；缺少适任意见不判通过"
    },
    {
      "key": "F010",
      "label": "course_authoritative_id 课程目录 ID；Course；S0+",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F010；course_authoritative_id 课程目录 ID；Course；S0+；学校课程目录/有效培养方案 M006；SRC-001 §15、SRC-004（研究生旧）；P0；源/冲，同名课程不默认相同"
    },
    {
      "key": "F011",
      "label": "course_display_name 文本；Course；S0+",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F011；course_display_name 文本；Course；S0+；M001/M006/M007 一致性校核；SRC-001/003；P0；补/冲，不以名称代替 F010"
    },
    {
      "key": "F012",
      "label": "education_level 本科/研究生枚举；CaseTarget；S0+",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F012；education_level 本科/研究生枚举；CaseTarget；S0+；课程目录 M006；SRC-001、SRC-004/011；P0；源/冲，未知不得套用本科条件"
    },
    {
      "key": "F013",
      "label": "course_kind 一般/公选、学位/非学位、实验/实践等枚举；Course；S0+",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F013；course_kind 一般/公选、学位/非学位、实验/实践等枚举；Course；S0+；M006/M007，SRC-003 公选、SRC-004 历史研究生类别；P0；源/政，类别未核不执行分支阈值"
    },
    {
      "key": "F014",
      "label": "proposed_teaching_role 主讲/联合主讲/助课/实验指导等；CaseTarget；S0+",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F014；proposed_teaching_role 主讲/联合主讲/助课/实验指导等；CaseTarget；S0+；M001/M010，SRC-001 §19–20、SRC-004 旧 §12；P0；补/冲，每人每角色分别判断"
    },
    {
      "key": "F015",
      "label": "target_term_and_scope 学期/区间；CaseTarget；S0+",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F015；target_term_and_scope 学期/区间；CaseTarget；S0+；M001/M006 与通知版本 SRC-002/003；历史有效期并非统一；P0；补/政，跨批次不套旧时限"
    },
    {
      "key": "F016",
      "label": "opening_college_and_affiliation 机构唯一 ID；Course/Teacher；S0/S1",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F016；opening_college_and_affiliation 机构唯一 ID；Course/Teacher；S0/S1；教务目录＋人员组织关系 M002/M003/M006，SRC-001 §17；P1；源/冲，跨学院要同时记两方"
    },
    {
      "key": "F017",
      "label": "campus_and_joint_review_flag 校区/布尔；CaseTarget；S0/S2",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F017；campus_and_joint_review_flag 校区/布尔；CaseTarget；S0/S2；官方课程校区 M006 与后续协签 M015；SRC-003 只支持宜宾公选课双签；P0；源/政，不得全部宜宾事项强制双签"
    },
    {
      "key": "F018",
      "label": "syllabus_revision_and_owner 文档 ID/hash/版本；Course；S1+（适用）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F018；syllabus_revision_and_owner 文档 ID/hash/版本；Course；S1+（适用）；教务/研究生受控大纲或申报附件 M007；SRC-003、SRC-005 旧批次；P0；该批次补/冲；其他情形先核是否必需"
    },
    {
      "key": "F019",
      "label": "course_approval_scope 目录状态/方案版本；Course；S1+",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F019；course_approval_scope 目录状态/方案版本；Course；S1+；课程/培养方案有权决定 M006，T05-T01/T05-T03；SRC-001、SRC-004历史；P0；源，不在本案擅自批准新课"
    },
    {
      "key": "F020",
      "label": "prior_undergrad_main_teaching 布尔＋课程/学期证据；Teacher；S1+（E）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F020；prior_undergrad_main_teaching 布尔＋课程/学期证据；Teacher；S1+（E）；可核课表/任教档案 M009；SRC-003 本批次要求；P2；源/冲，课程组助课不算已主讲"
    },
    {
      "key": "F021",
      "label": "teaching_competence_review 事实链接＋人工意见；CaseTarget；S2+",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F021；teaching_competence_review 事实链接＋人工意见；CaseTarget；S2+；有权审核意见/试讲评议 M008/M015，SRC-001 §19、SRC-007 旧；P3；裁/待后，无量化算法不可自动通过"
    },
    {
      "key": "F022",
      "label": "group_teachers_and_role_hours 结构体/名单；Course/CaseTarget；S1（拟议）/S4（定稿）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F022；group_teachers_and_role_hours 结构体/名单；Course/CaseTarget；S1（拟议）/S4（定稿）；课程组提案/后续任务台账 M010；SRC-001 §20、SRC-002学期通知；P1；补仅在确有多教师且当前已需提报，正式排课后置"
    },
    {
      "key": "F023",
      "label": "adverse_evaluation_decision 结构体（subjectKind=teacher+course 或 course+class、评价期/轮次、合格等级/同类末10%、异议及生效状态）；Teacher/Course；S1（D/I/课程异常）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F023；adverse_evaluation_decision 结构体（subjectKind=teacher+course 或 course+class、评价期/轮次、合格等级/同类末10%、异议及生效状态）；Teacher/Course；S1（D/I/课程异常）；学校正式评价记录 M011；SRC-001 §21、SRC-007 旧；P3；源/冲，教师继续任课与教学班课程重新论证触发条件不同；投诉传闻不是生效决定"
    },
    {
      "key": "F024",
      "label": "competence_improvement_status 计划/完成/核定状态；Teacher；S1（D）/S2+",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F024；competence_improvement_status 计划/完成/核定状态；Teacher；S1（D）/S2+；主管部门提升计划与完成认定 M012；SRC-001 §21；P3；进行中为待后，有无完成需源/裁"
    },
    {
      "key": "F025",
      "label": "prior_teaching_qualification_reference 决定 ID/decisionKind=B1",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F025；prior_teaching_qualification_reference 决定 ID/decisionKind=B1；B2/状态/范围；CaseTarget；S1+；旧有效任课资格/聘任决定 M013；SRC-001 §17、SRC-004旧学期聘任；P2；源/冲，跨课段/角色不能照搬；无旧决定的首次申请不列缺件"
    },
    {
      "key": "F026",
      "label": "graduate_course_degree_tier 硕士/博士及学位课属性；Course；S0+（F/G/H）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F026；graduate_course_degree_tier 硕士/博士及学位课属性；Course；S0+（F/G/H）；研究生培养方案/课程目录 M006；SRC-004 历史；P0；源/政，当前门槛未知"
    },
    {
      "key": "F027",
      "label": "applied_policy_revision SRC ID/文号/效期/适用对象；PolicySnapshot；S1+",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F027；applied_policy_revision SRC ID/文号/效期/适用对象；PolicySnapshot；S1+；管理者受控政策档 M021；SRC-001/002/003/004/005/007/011；P0；政，不能用旧文默认转“现行”"
    },
    {
      "key": "F028",
      "label": "college_review_and_joint_signature 意见/权限校验/时间；ReviewOpinion；S2+",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F028；college_review_and_joint_signature 意见/权限校验/时间；ReviewOpinion；S2+；实际有权岗位审核事件 M015/M016；SRC-001 §17、SRC-003，研究生 SRC-005仅历史；P3；待后/政，签章图片不证明授权"
    },
    {
      "key": "F029",
      "label": "authorized_decision_and_scope 结构体（decisionKind=B1",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F029；authorized_decision_and_scope 结构体（decisionKind=B1；B2、决定、Actor权限、课程/学段/角色/学期作用域、效期、签名核证）；AuthorizedDecision；S3+；可信正式决策事件 M017/M020；本科 SRC-001组织职责，最终岗位待核；P3；待后/政，B1/B2 有无并存须制度确认；不得预填approved=true"
    },
    {
      "key": "F030",
      "label": "withdrawal_appeal_and_revision_request 请求类型/时点/指向原决策；RevisionRequest；S5",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F030；withdrawal_appeal_and_revision_request 请求类型/时点/指向原决策；RevisionRequest；S5；经确认申请人与请求记录 M018/M019；本事项校本程序 SRC 缺口；P3；补/政，复核结果待后，不可主动撤销"
    },
    {
      "key": "F031",
      "label": "evidence_version_and_lineage 记录 ID/hash/上传来源/被替代关系；Evidence/Revision；各阶段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F031；evidence_version_and_lineage 记录 ID/hash/上传来源/被替代关系；Evidence/Revision；各阶段；受控存证/正式记录引用 M020，所有文件与官方源记录的版本元数据；为技术设计；P2/P3继承原件最严；无版本阻断依赖该原件的结论引用并核查"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "申请/学院提名事项范围；本人或开课学院",
      "purpose": "M001 申请/学院提名事项范围；本人或开课学院；C S0：课程、学段、角色、学期和发起身份的案卷陈述；只有 E 批次已核个人网上申报，并非全校统一“申请表”；学院经核的提名记录或对应课程任务发起记录，是否正式受理待定；F001/002/010/011/014/015；SRC-001/003；绑定提名人及目标版本；缺失当前对象则NEEDS_MATERIAL，模糊影像UNREADABLE",
      "requiredElements": [
        "C S0：课程、学段、角色、学期和发起身份的案卷陈述；只有 E 批次已核个人网上申报，并非全校统一“申请表”",
        "学院经核的提名记录或对应课程任务发起记录，是否正式受理待定；F001/002/010/011/014/015；SRC-001/003",
        "绑定提名人及目标版本；缺失当前对象则NEEDS_MATERIAL，模糊影像UNREADABLE"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "教师本人及代理人真实性；人事、身份认证管理方",
      "purpose": "M002 教师本人及代理人真实性；人事、身份认证管理方；C S0/S1：可信人员主键及服务端代理授权；可完全不向本人索取扫描身份证；已合法授权的校内身份服务或人工人事核验；F003/004/016；SRC-002/003/006；权限与身份需绑定访问范围和时效；官方不可访问SOURCE_UNAVAILABLE，冲突CONFLICT，不可用自填工号替代",
      "requiredElements": [
        "C S0/S1：可信人员主键及服务端代理授权；可完全不向本人索取扫描身份证",
        "已合法授权的校内身份服务或人工人事核验；F003/004/016；SRC-002/003/006",
        "权限与身份需绑定访问范围和时效；官方不可访问SOURCE_UNAVAILABLE，冲突CONFLICT，不可用自填工号替代"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "校内聘用/工作关系事实；人事处/聘用管理者",
      "purpose": "M003 校内聘用/工作关系事实；人事处/聘用管理者；C 本科主讲 S1，研究生/校外身份按当期政策 T：人事聘用和岗位效期；人事处出具并可核的有效证明；不得仅用自述或过期合同；F003/005/016；SRC-002（限学期）、SRC-006（邻接）；人员与本案人员主键一一对应；失联SOURCE_UNAVAILABLE，证据模糊UNREADABLE，研究生适用性POLICY_UNCONFIRMED",
      "requiredElements": [
        "C 本科主讲 S1，研究生/校外身份按当期政策 T：人事聘用和岗位效期",
        "人事处出具并可核的有效证明；不得仅用自述或过期合同；F003/005/016；SRC-002（限学期）、SRC-006（邻接）",
        "人员与本案人员主键一一对应；失联SOURCE_UNAVAILABLE，证据模糊UNREADABLE，研究生适用性POLICY_UNCONFIRMED"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "高校教师资格证现状；发证权威/人事校验方",
      "purpose": "M004 高校教师资格证现状；发证权威/人事校验方；C 本科主讲 S1，E 批次明确；研究生/外聘是否同要求 T 待新规；经认证证书状态查询或有权机构验证原件；F006；SRC-002/003/006；证号及持有人一致、含有效期/变更；源断联SOURCE_UNAVAILABLE，普通照片不可核真时NEEDS_HUMAN_DECISION",
      "requiredElements": [
        "C 本科主讲 S1，E 批次明确；研究生/外聘是否同要求 T 待新规",
        "经认证证书状态查询或有权机构验证原件；F006；SRC-002/003/006",
        "证号及持有人一致、含有效期/变更；源断联SOURCE_UNAVAILABLE，普通照片不可核真时NEEDS_HUMAN_DECISION"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "学位、职称及学科背景；人事/授予与认定机构",
      "purpose": "M005 学位、职称及学科背景；人事/授予与认定机构；C 本科主讲 S1，研究生 S1 仅采事实不按旧阈值判决；条件身份可能另需证明；人事核定职称/学历学位档案、可验证发证原件；F007/008/009；SRC-001、SRC-004（历史）；与 F003 同人、记录生效点一致；官方断联SOURCE_UNAVAILABLE，不可读UNREADABLE，学科适任仍人工",
      "requiredElements": [
        "C 本科主讲 S1，研究生 S1 仅采事实不按旧阈值判决；条件身份可能另需证明",
        "人事核定职称/学历学位档案、可验证发证原件；F007/008/009；SRC-001、SRC-004（历史）",
        "与 F003 同人、记录生效点一致；官方断联SOURCE_UNAVAILABLE，不可读UNREADABLE，学科适任仍人工"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "所申课程、学段、归口及批准范围；教务/研究生课程管理方",
      "purpose": "M006 所申课程、学段、归口及批准范围；教务/研究生课程管理方；C S0/S1：学校课程目录/获准培养方案对应课程的权威条目；并非教师上传“开课批准书”；校方已生效培养方案或可核课程目录；F002/010/011/012/013/015/016/017/019/026；SRC-001、SRC-004（历史）；按课程代码、课程层次、学院、方案版；源失联SOURCE_UNAVAILABLE，同名冲突CONFLICT",
      "requiredElements": [
        "C S0/S1：学校课程目录/获准培养方案对应课程的权威条目；并非教师上传“开课批准书”",
        "校方已生效培养方案或可核课程目录；F002/010/011/012/013/015/016/017/019/026；SRC-001、SRC-004（历史）",
        "按课程代码、课程层次、学院、方案版；源失联SOURCE_UNAVAILABLE，同名冲突CONFLICT"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "教学大纲内容和版本；课程负责人/校方教务归口",
      "purpose": "M007 教学大纲内容和版本；课程负责人/校方教务归口；C E 批次 S1；H 历史批次有要求，2026 只能 T/政；其他课程按现行校本要求；校方课程大纲库同一有效版/课程负责人提交且归口核证的文件；F011/018；SRC-003、SRC-005（历史）；绑定课程代码、版本与修订者；当前应提供但缺件NEEDS_MATERIAL、不可读UNREADABLE；其他分支不得一律强制",
      "requiredElements": [
        "C E 批次 S1；H 历史批次有要求，2026 只能 T/政；其他课程按现行校本要求",
        "校方课程大纲库同一有效版/课程负责人提交且归口核证的文件；F011/018；SRC-003、SRC-005（历史）",
        "绑定课程代码、版本与修订者；当前应提供但缺件NEEDS_MATERIAL、不可读UNREADABLE；其他分支不得一律强制"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "教学能力及专业适任辅助证明；学院/课程团队/教师",
      "purpose": "M008 教学能力及专业适任辅助证明；学院/课程团队/教师；T S1 仅在已有客观证明时收集，S2 试讲/院级适任审查意见随后形成；本科主讲能力要审但不等于必须交“试讲视频”；校方认可的培训/试讲/课堂能力记录或由授权人员评议；F009/021；SRC-001 §19、SRC-007（历史局部）；记录评议人、评议课程、日期；缺法定材料清单不能机械退件，NEEDS_HUMAN_DECISION；不可读单列",
      "requiredElements": [
        "T S1 仅在已有客观证明时收集，S2 试讲/院级适任审查意见随后形成；本科主讲能力要审但不等于必须交“试讲视频”",
        "校方认可的培训/试讲/课堂能力记录或由授权人员评议；F009/021；SRC-001 §19、SRC-007（历史局部）",
        "记录评议人、评议课程、日期；缺法定材料清单不能机械退件，NEEDS_HUMAN_DECISION；不可读单列"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "曾主讲本科课程事实；教务处教学任务/任教档案管理者",
      "purpose": "M009 曾主讲本科课程事实；教务处教学任务/任教档案管理者；C 仅 E 批次 S1，SRC-003 明确既往主讲条件；可核本科教学任务记录、正式主讲任职档案；本人课表截图仅线索；F020；SRC-003；关联先前课程、学期、教师和“主讲”角色；源失联SOURCE_UNAVAILABLE，助课记录不能作等价替代",
      "requiredElements": [
        "C 仅 E 批次 S1，SRC-003 明确既往主讲条件",
        "可核本科教学任务记录、正式主讲任职档案；本人课表截图仅线索；F020；SRC-003",
        "关联先前课程、学期、教师和“主讲”角色；源失联SOURCE_UNAVAILABLE，助课记录不能作等价替代"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "课程组人员、职责及拟定工作量；课程负责人/开课学院",
      "purpose": "M010 课程组人员、职责及拟定工作量；课程负责人/开课学院；T B 多教师 S1 可提拟议分配，定稿排课 S4 后形成；非多教师不适用；学院正式课程组名录/任务表，已定稿版才可作为排课事实；F014/022；SRC-001 §20、SRC-002（特定学期）；每位教师分别关联角色，定稿与草稿不混；拟议不齐NEEDS_MATERIAL仅限当前流程确须，正式定稿待后",
      "requiredElements": [
        "T B 多教师 S1 可提拟议分配，定稿排课 S4 后形成；非多教师不适用",
        "学院正式课程组名录/任务表，已定稿版才可作为排课事实；F014/022；SRC-001 §20、SRC-002（特定学期）",
        "每位教师分别关联角色，定稿与草稿不混；拟议不齐NEEDS_MATERIAL仅限当前流程确须，正式定稿待后"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "教学评价不利及限制触发事实；教学评价/教务管理机构",
      "purpose": "M011 教学评价不利及限制触发事实；教学评价/教务管理机构；T D/I 或涉及特定教学班课程重新论证时 S1；普通初任无需上传投诉、处分或评价；正式评价序列（教师×课与教学班×课须分键）、评价等级/同类排名及已核复核更正记录；F023；SRC-001 §21、SRC-007（旧局部）；限查看范围，带异议/生效状态；源失联SOURCE_UNAVAILABLE，传闻/匿名指控不得等同生效结论；教师提升 R014/15 与课程再审 R029 不能混",
      "requiredElements": [
        "T D/I 或涉及特定教学班课程重新论证时 S1；普通初任无需上传投诉、处分或评价",
        "正式评价序列（教师×课与教学班×课须分键）、评价等级/同类排名及已核复核更正记录；F023；SRC-001 §21、SRC-007（旧局部）",
        "限查看范围，带异议/生效状态；源失联SOURCE_UNAVAILABLE，传闻/匿名指控不得等同生效结论；教师提升 R014/15 与课程再审 R029 不能混"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "教学能力提升计划及完成事实；学校/学院指定执行者",
      "purpose": "M012 教学能力提升计划及完成事实；学校/学院指定执行者；T D 正式触发能力提升时：计划可为当前已有，完成确认仅完成后才产生 L；归口部门可核的培训完成或能力提升验收记录；F024；SRC-001 §21；计划与完成分别标时间和签发者；尚在整改期不以“缺完成章”退原申请；复核恢复须人工",
      "requiredElements": [
        "T D 正式触发能力提升时：计划可为当前已有，完成确认仅完成后才产生 L",
        "归口部门可核的培训完成或能力提升验收记录；F024；SRC-001 §21",
        "计划与完成分别标时间和签发者；尚在整改期不以“缺完成章”退原申请；复核恢复须人工"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M013",
      "name": "既有特定课程任课资格或聘任决定；资格档案保管方",
      "purpose": "M013 既有特定课程任课资格或聘任决定；资格档案保管方；T S1 续任、恢复、角色变更、引用历史决定；若初次申报没有则不要求；正式可核资格认定事件/有效聘任记录；F025/F029；SRC-001 §17、SRC-004（旧）；决定类型 B1/B2、教师×课程×学段×角色×区间、撤销状态分别比对；找不到旧决定不得拿课表代替，SOURCE_UNAVAILABLE 仅在已知应有权威记录但源失联时使用",
      "requiredElements": [
        "T S1 续任、恢复、角色变更、引用历史决定；若初次申报没有则不要求",
        "正式可核资格认定事件/有效聘任记录；F025/F029；SRC-001 §17、SRC-004（旧）",
        "决定类型 B1/B2、教师×课程×学段×角色×区间、撤销状态分别比对；找不到旧决定不得拿课表代替，SOURCE_UNAVAILABLE 仅在已知应有权威记录但源失联时使用"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "本科公选课网上申报及打印申请表；教师与教务系统",
      "purpose": "M014 本科公选课网上申报及打印申请表；教师与教务系统；T 只 E 指定批次：线上申报先于系统生成打印表；打印件属于 S1 后段，非 S0 必备；该批次教务系统受控申请状态/打印件编号；F002/011/015/018；SRC-003；绑定教学大纲同课程同教师同学期，旧表必须标批次；真正提交节点缺件NEEDS_MATERIAL，无法扫描UNREADABLE",
      "requiredElements": [
        "T 只 E 指定批次：线上申报先于系统生成打印表；打印件属于 S1 后段，非 S0 必备",
        "该批次教务系统受控申请状态/打印件编号；F002/011/015/018；SRC-003",
        "绑定教学大纲同课程同教师同学期，旧表必须标批次；真正提交节点缺件NEEDS_MATERIAL，无法扫描UNREADABLE"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "开课学院审核、跨院意见、宜宾指定协签；开课/协作学院有权岗位",
      "purpose": "M015 开课学院审核、跨院意见、宜宾指定协签；开课/协作学院有权岗位；L S2 审核后生成；宜宾双签只针对 SRC-003 特定 E 批次，其他 J 情形依校本政策；学院系统有权审核事件/校验签章的正式文件，不以教师上传红章图证明；F017/021/028；SRC-001 §17、SRC-003；必须记录签发者岗位与权限有效期、课程作用域；S0/S1 不可作缺件，政策未知POLICY_UNCONFIRMED",
      "requiredElements": [
        "L S2 审核后生成；宜宾双签只针对 SRC-003 特定 E 批次，其他 J 情形依校本政策",
        "学院系统有权审核事件/校验签章的正式文件，不以教师上传红章图证明；F017/021/028；SRC-001 §17、SRC-003",
        "必须记录签发者岗位与权限有效期、课程作用域；S0/S1 不可作缺件，政策未知POLICY_UNCONFIRMED"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "研究生公选课专家评议/审议材料；研究生院培养归口部门",
      "purpose": "M016 研究生公选课专家评议/审议材料；研究生院培养归口部门；L S2 后；仅 2021 研究生公选课已见该程序，2026 是否使用及表式未知；新年度有权培养管理者出具的可核评议结果（如存在）；F021/028；SRC-005 历史、SRC-011上位；学期/专家授权与课程一一绑定；初始一律待后，2026 当前政策POLICY_UNCONFIRMED",
      "requiredElements": [
        "L S2 后；仅 2021 研究生公选课已见该程序，2026 是否使用及表式未知",
        "新年度有权培养管理者出具的可核评议结果（如存在）；F021/028；SRC-005 历史、SRC-011上位",
        "学期/专家授权与课程一一绑定；初始一律待后，2026 当前政策POLICY_UNCONFIRMED"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "正式任课资格认定/聘任决定；校方有权签发机构",
      "purpose": "M017 正式任课资格认定/聘任决定；校方有权签发机构；L S3 后生成；每一决定带决定类型 B1/B2、课程级/学期级作用域、生效/失效、权威 Actor，不由申请人造；可核官方决定系统事件/正式签章原件；F025/029；SRC-001 仅证明本科归口组织，具体签发岗位缺口；旧版不可覆盖，需撤销/替代链；之前待后，岗位授权或 B1/B2 流程不明POLICY_UNCONFIRMED/人工决定",
      "requiredElements": [
        "L S3 后生成；每一决定带决定类型 B1/B2、课程级/学期级作用域、生效/失效、权威 Actor，不由申请人造",
        "可核官方决定系统事件/正式签章原件；F025/029；SRC-001 仅证明本科归口组织，具体签发岗位缺口",
        "旧版不可覆盖，需撤销/替代链；之前待后，岗位授权或 B1/B2 流程不明POLICY_UNCONFIRMED/人工决定"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "撤回、异议、复核或更正请求；本人/合规代理",
      "purpose": "M018 撤回、异议、复核或更正请求；本人/合规代理；T S5 请求时生成；目前缺成都理工大学统一受理表及期限；有权部门实际受理的正式请求、系统留痕；F030；SRC 未获得，GAP-04；关联原案/决定及请求人授权、时点；没提出则NOT_APPLICABLE，提出后缺说明NEEDS_MATERIAL，是否受理人工核",
      "requiredElements": [
        "T S5 请求时生成；目前缺成都理工大学统一受理表及期限",
        "有权部门实际受理的正式请求、系统留痕；F030；SRC 未获得，GAP-04",
        "关联原案/决定及请求人授权、时点；没提出则NOT_APPLICABLE，提出后缺说明NEEDS_MATERIAL，是否受理人工核"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "撤回/复核办理结果、更正或撤销决定；有权校方复核机关",
      "purpose": "M019 撤回/复核办理结果、更正或撤销决定；有权校方复核机关；L S5 正式办结后生成，不是提出异议时的前置材料；原决定机关/校方确认的复核主体正式决定事件；F029/030；SRC 未获得，GAP-03/04；记录原结论、有效替代关系，未经授权不能覆盖 M017；办结前待后，权限未知政/裁",
      "requiredElements": [
        "L S5 正式办结后生成，不是提出异议时的前置材料",
        "原决定机关/校方确认的复核主体正式决定事件；F029/030；SRC 未获得，GAP-03/04",
        "记录原结论、有效替代关系，未经授权不能覆盖 M017；办结前待后，权限未知政/裁"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "证据归属、签发/读取及版本快照；系统存证服务/数据管理员",
      "purpose": "M020 证据归属、签发/读取及版本快照；系统存证服务/数据管理员；C 各阶段内部必留记录，不要求教师上传；受控事件日志及原件/源记录版本引用；F001/004/029/031；技术安全设计，非学校政策 SRC；采用不可悄悄覆盖的版本/替代链接；无原件追踪则暂停引用其结论，内部待修复，不能判申请人缺件",
      "requiredElements": [
        "C 各阶段内部必留记录，不要求教师上传",
        "受控事件日志及原件/源记录版本引用；F001/004/029/031；技术安全设计，非学校政策 SRC",
        "采用不可悄悄覆盖的版本/替代链接；无原件追踪则暂停引用其结论，内部待修复，不能判申请人缺件"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "校本政策版本及当期办事通知；教务处/研究生院/学院制度管理员",
      "purpose": "M021 校本政策版本及当期办事通知；教务处/研究生院/学院制度管理员；R S0/S1 预装或人工核当前规则；不是学生或教师申报材料；校方有效原始规章/批次通知及可核版本；F002/015/027；SRC-001/002/003/004/005/007/010/011；固定适用区间与修订关系；研究生缺现行规章为POLICY_UNCONFIRMED，网站失联另记SOURCE_UNAVAILABLE",
      "requiredElements": [
        "R S0/S1 预装或人工核当前规则；不是学生或教师申报材料",
        "校方有效原始规章/批次通知及可核版本；F002/015/027；SRC-001/002/003/004/005/007/010/011",
        "固定适用区间与修订关系；研究生缺现行规章为POLICY_UNCONFIRMED，网站失联另记SOURCE_UNAVAILABLE"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M022",
      "name": "外聘/兼职/双聘的任教身份与授权依据；学校人事/聘任或合作单位",
      "purpose": "M022 外聘/兼职/双聘的任教身份与授权依据；学校人事/聘任或合作单位；T J 真实存在外部/兼岗人员时 S1；具体是否允许/材料清单暂无校本原文；人事处认可的校内聘任/外聘授权或依法可核的合作关系文件；F003/005/016；SRC-001 §17只支持本科跨学院，外聘准入无现行 SRC；签约主体和有效期与课程学期关联；制度不明POLICY_UNCONFIRMED，源断联SOURCE_UNAVAILABLE，不凭截图给准入",
      "requiredElements": [
        "T J 真实存在外部/兼岗人员时 S1；具体是否允许/材料清单暂无校本原文",
        "人事处认可的校内聘任/外聘授权或依法可核的合作关系文件；F003/005/016；SRC-001 §17只支持本科跨学院，外聘准入无现行 SRC",
        "签约主体和有效期与课程学期关联；制度不明POLICY_UNCONFIRMED，源断联SOURCE_UNAVAILABLE，不凭截图给准入"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules-08-2",
      "name": "08.2 可追溯规则矩阵",
      "description": "依据 T06-T04 原件第 08 节规则表；属于本地研究审查项，不等同学校正式政策规则。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "目标成立与唯一性",
          "requirement": "R001 目标成立与唯一性；S0/S1；T=存在教师×课程×学段×角色×时点申请，F=明确非教师任课资格事项，U=任一目标维度无法确定；SRC-001 §17、SRC-003、SRC-004(历史)；F001/002/010/011/012/013/014/015；M001/M006；对照案卷、课程权威 ID 与课程名称/学段，按 F015 作用期校验；A 课程目录优于 D 自填；课程建设批准归 T05，不在此规则发放；T 且目标一致 PASS_FACT→开课学院；F NOT_APPLICABLE→路由 T05/T01；U 依缺失/源失联输出 NEEDS_MATERIAL/SOURCE_UNAVAILABLE→申报者或教务数据管理员；冲突 CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "教师/提名者身份与代理权",
          "requirement": "R002 教师/提名者身份与代理权；S0/S1；T=任何人或服务主体尝试发起、查看、审核本案，F=仅离线阅读公开政策而无案卷操作，U=服务端主体或代理权限不可核；SRC-003(本批次本人申报)、SRC-002(人员条件)；F003/004；M002/M020；用受信认证主体、教职工唯一键及代理有效期比对，A 服务端权限优先；D 自报工号/院长身份不可鉴权；服务读取也需有权限与审计；T 且核真 PASS_FACT→受理岗；权源失联 SOURCE_UNAVAILABLE→身份管理员；主体不符 CONFLICT→人事；未获代理授权 NEEDS_HUMAN_DECISION→受理岗，绝不放行签批",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "校方课程存在与已获开设权限引用",
          "requirement": "R003 校方课程存在与已获开设权限引用；S0/S1；T=目标课程应已在对应学段有效目录，F=本案只处理既有资格复核且课程已由权威结论固定、无需重新申请课程，U=目录/方案版本不可核；SRC-001 §15–17、SRC-004(历史)；F010/011/012/013/019；M006；A 课程目录与 T05 已批准方案/课程建设结论按生效版比较；同名不同课程代码、学段、所属学院不能合并；不从本案更改课程开设状态；核一致 PASS_FACT→学院；两源不一致 CONFLICT→教务/研究生课程管理员；旧方案失联 SOURCE_UNAVAILABLE；具体新课审批需 T05，非本规则",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "适用政策版本与期限门禁",
          "requirement": "R004 适用政策版本与期限门禁；S0/S1；T=试图执行任何校本硬条件，F=仅作无需资格阈值的材料读取，U=适用学段/类型/学期或政策现行性未知；SRC-001/002/003/004/005/007/009/010/011；F012/013/015/027；M021/M006；匹配成文机关、发布/生效/废止、课程性质及学期；本科长期规范 SRC-001 须保留更新核验，SRC-002 只2025–26春，SRC-003 只2026–27秋公选，旧研究生/学院规章不能升级为现行；A/B 政策原件优于 D 转述；同范围且现行已核 PASS_FACT→规则管理员；不适用 NOT_APPLICABLE→路由；研究生/旧规未核 POLICY_UNCONFIRMED→研究生院或归口学院；源失联 SOURCE_UNAVAILABLE→制度管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "本科主讲聘用事实",
          "requirement": "R005 本科主讲聘用事实；S1；T=本科主讲且当期生效规范/教学任务通知要求学校聘用，F=非该学段/角色或有权学校政策明确豁免，U=当前通知或外聘例外不明；SRC-002（2025–26春）；F003/005/015；M002/M003/M021；A 人事聘用状态按目标学期有效区间比较；只将 SRC-002 条件用于其批次，其他学期应核新通知；外聘路径转 R023，不用 D 合同照自动通过；有效聘用事实 PASS_FACT→学院；官方未接通 SOURCE_UNAVAILABLE→人事；已核无符合条件聘用 NEEDS_HUMAN_DECISION→学院（事实不满足≠正式拒绝）；政策不明 POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "高校教师资格证状态",
          "requirement": "R006 高校教师资格证状态；S1；T=SRC-002适用学期本科主讲或 SRC-003 公选课，F=可核政策确认无需该证的其他角色，U=其他学段/批次规定未确认；SRC-002/003/006；F003/006/012/015；M002/M004/M021；A 教师资格权威状态或 B 核实原件与本人键、形成时点匹配；T02-T15/人事负责其证书权威认定；证书图片 D 只能提示；权威有效 PASS_FACT→学院；无证已核 NEEDS_HUMAN_DECISION→学院；身份不符 CONFLICT→人事；源失联 SOURCE_UNAVAILABLE；U POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "本科主讲职称或学位条件",
          "requirement": "R007 本科主讲职称或学位条件；S1；T=本科主讲适用 SRC-001 §19，F=本科非主讲，U=学段/主讲/政策版本无法确认；SRC-001 §19、SRC-004(不可跨段)、SRC-009(仍使用旁证)；F007/008/014；M005/M021；(讲师及以上职称) OR (硕士及以上学历)，不是 AND；按目标时点 A 人事/学历学位记录比较；专业适任另走 R008；学历/学位字段术语须向人事确认，与学校“硕士及以上学历”原文一致；一项可核满足 PASS_FACT→学院；两项可信均不满足 NEEDS_HUMAN_DECISION 并记录假值→学院；矛盾 CONFLICT→人事；失联 SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "独立讲授能力与学科适任",
          "requirement": "R008 独立讲授能力与学科适任；S2；T=申请承担本科主讲或校方当前政策要求能力评议，F=仅引用已有可核结论且政策明确无需重复评议，U=评价标准/有权审核人未知；SRC-001 §19、SRC-007(局部旧)；F009/021；M005/M008/M015；只比专业、课程及评价范围是否同一，不用 AI 产生“能力足够”行政结论；A/B 经授权学院评议后可记录“评议存在”事实，能力本身属人工裁量；D 试讲视频不等于通过；适任与例外一律 NEEDS_HUMAN_DECISION→学院有权评议人；审查意见尚未形成按 S2 进行中，不构造 S1 NEEDS_MATERIAL；身份/授权失联转 R026",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R009",
          "title": "主讲与助课/实践指导角色不得互认",
          "requirement": "R009 主讲与助课/实践指导角色不得互认；S0/S1；T=角色发生助课→主讲、实践指导→主讲或本案拟任主讲，F=明确保持原辅助角色且政策无新准入要求，U=既有角色/拟任角色不明；SRC-001 §19–20、SRC-004 §12(历史)；F014/025；M001/M010/M013；与原任课结论的角色和课段逐项比对；A/B 旧助课安排即使有效也不能升级成主讲认定；研究生助课具体标准另 R019；仅角色事实一致 PASS_FACT→学院；发生需新主讲认定 NEEDS_HUMAN_DECISION→开课学院；旧结论角色冲突 CONFLICT；U NEEDS_MATERIAL/SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "多教师课程逐人逐角色核查",
          "requirement": "R010 多教师课程逐人逐角色核查；S1→S4；T=同课程有两名及以上教师/课程组，F=单人任教，U=名册/教学角色难以确定；SRC-001 §20、SRC-002(历史任务通知)；F003/014/022；M002/M010；课程组长、主讲、助课逐人建 CaseTarget；S1 名册可为拟议版，S4 学时排课表才定稿；不把任一人通过扩展到全组；分配一致的名册事实 PASS_FACT→学院课程负责人；缺当前拟议名单且要求时 NEEDS_MATERIAL；团队角色冲突 CONFLICT；未来排课未生成 NOT_APPLICABLE",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "R011",
          "title": "本科公选课既往主讲经历",
          "requirement": "R011 本科公选课既往主讲经历；S1；T=SRC-003 指定批次公选课教师（含合上），F=其他课程/其他批次，U=拟任批次/既往角色无法辨明；SRC-003；F014/015/020；M006/M009；A 教务正式教学任务/任教档案查“曾主讲一门本科课程”，明确区分合上主讲与仅助课；不得以旧课表 D 无权声明替代；仅此批次可执行；经核确有 PASS_FACT→公选课学院初审；仅助课/无主讲已证实 NEEDS_HUMAN_DECISION→学院；官方源失联 SOURCE_UNAVAILABLE→教务；矛盾 CONFLICT",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "公选课教学大纲与课程归属",
          "requirement": "R012 公选课教学大纲与课程归属；S1；T=SRC-003 指定批次申报，F=其他批次或无大纲义务的事项，U=课程 ID/政策版本不明；SRC-003、SRC-005(研究生历史，不能并用)；F010/011/018；M006/M007；B/C 当前大纲与 A 课程目录按课程代码、归属、版本/格式（通知要求 PDF）比对；D OCR 未辨不得填充；后续审稿意见不要求在 S1 出现；版本匹配且可读 PASS_FACT→开课学院；未交当期须有大纲 NEEDS_MATERIAL→申报教师/课程负责人；损坏 UNREADABLE；课名版本冲突 CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "公选课申报流水与纸质表生成时点",
          "requirement": "R013 公选课申报流水与纸质表生成时点；S1/S2；T=SRC-003 本科指定批次进入线上提交/纸表阶段，F=S0 草稿或非该批次，U=系统提交状态不可验证；SRC-003；F002/011/015/018/027；M001/M014/M020；先比对线上申报号与大纲/教师/课程，后检查系统打印表和学院提交；2026-05-17 18:00 是学院汇总交教务处节点，不得误写为教师线上提交截止；保留时区及可信收件时间；S0 无纸表不算缺件；提交事实与版本一致 PASS_FACT→学院教务科；当前正式提交缺表 NEEDS_MATERIAL→教师；系统源失联 SOURCE_UNAVAILABLE→教务；逾期是否受理交有权岗位，非 AI 签批",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "R014",
          "title": "不利课堂评价/教学限制是否真实触发",
          "requirement": "R014 不利课堂评价/教学限制是否真实触发；S1；T=有针对本科教师的正式评价或暂停继续任课记录，F=可核无该触发且不属于 D/I，U=学校评价源无法查或仅举报传闻；SRC-001 §21、SRC-007(旧局部)；F023；M011/M020；A 学校生效评价结论与同一教师×同一课程×连续两次或同一学年两次、评价等次/末10%和复核状态匹配；第21条另有同一教学班课程重新论证分支，路由 R029；匿名投诉不能直接等同生效评价；正式教师评价触发事实可 PASS_FACT（不代表可继续任课）→教学管理岗；异议未定/后果裁量 NEEDS_HUMAN_DECISION→校方复核者；冲突 CONFLICT；失联 SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "教学能力提升完成后再审继续任课",
          "requirement": "R015 教学能力提升完成后再审继续任课；S1/S2/S5；T=R014 已证实适用 §21 的提升要求，F=经官方记录明确不需提升，U=原评价或计划是否生效不明；SRC-001 §21、SRC-007(旧院规不得扩大)；F023/024；M011/M012；比较 A/B 计划、执行、完成认定的时间序；仅已完成阶段才读取完成凭证，未完成不能让未来签章成为 S1 缺件；继续/恢复资格仍须有权学院核定；已完成的进度事实 PASS_FACT→学院能力评议；未完成/异议中 NEEDS_HUMAN_DECISION→主管学院；未来完成记录 NOT_APPLICABLE于当前缺件清单；源失联 SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "旧任课决定的有效作用域",
          "requirement": "R016 旧任课决定的有效作用域；S1/S4；T=声称已有此课任课资格或本案为续任/资格引用，F=初任且无旧决定主张，U=旧决定 ID/撤销情况无法核；SRC-001 §17、SRC-004(研究生旧聘任)；F003/010/012/014/015/025；M013/M017；A/B 原决定核“教师×课程×学段×角色×效期×撤销/替代”，不得拿 T01-T02 教学任务表倒推任课资格；研究生旧聘任现行效力仍需 R017；作用域一致的历史决定事实 PASS_FACT→学院/排课单位只读；作用域不符 CONFLICT 或需新认定 NEEDS_HUMAN_DECISION→学院；源失联 SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "研究生当前任课资格政策可用性",
          "requirement": "R017 研究生当前任课资格政策可用性；S0/S1；T=F012=研究生且需判断任课准入，F=本科，U=研究生课程/学期或政策版本不清；SRC-004(2018)、SRC-005(2021旧批次)、SRC-010/014(弱旁证)、SRC-011 §17–18；F012/013/015/026/027；M006/M021；先查研究生院现行正式规章全文/文号及适用关系；只有 2018 旧办法、2021旧通知、2024/2026材料提名或教育部指导意见，不足以构成2026 CDUT量化门槛；当前资料实情=POLICY_UNCONFIRMED→研究生院制度管理员；拿到有效校本新规并经验证才转下一轮配置；不得产生研究生学历/职称“合格”结论",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "研究生学位/非学位及硕博士课程分型事实",
          "requirement": "R018 研究生学位/非学位及硕博士课程分型事实；S0/S1；T=研究生拟任主讲，F=本科或研究生非主讲，U=课程层次/学位类别不明；SRC-004 §8–10(历史)、SRC-008(学院教务岗位)、SRC-011 §17–18；F007/008/012/013/026；M005/M006；A 研究生培养方案/课程目录确定硕士/博士、学位/非学位，B 学历职称来源只核是什么；不比较2018门槛成否；SRC-008 不能作为学院签发权；分型及凭证事实可 PASS_FACT→研究生培养岗，同时 R017 保持 POLICY_UNCONFIRMED；目录矛盾 CONFLICT；源失联 SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "研究生助课者身份、主讲绑定",
          "requirement": "R019 研究生助课者身份、主讲绑定；S1；T=拟担任研究生助课而非主讲，F=本科或独立主讲，U=身份是否学生/教师或当前助课政策未知；SRC-004 §12(仅历史)、SRC-011(上位)；F003/014/026/027；M001/M002/M005/M006/M021；只确认助课人、主讲教师、课程与硕博层次的事实绑定；A/B 记录也不能授权助课；历史申请由主讲提出的流程不得当2026现行；可核绑定事实 PASS_FACT，但资格政策/批准为 POLICY_UNCONFIRMED→研究生院；身份冲突 CONFLICT→人事/研究生管理岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "研究生公选课提案、大纲与专家意见",
          "requirement": "R020 研究生公选课提案、大纲与专家意见；S1/S2；T=研究生公共选修课程申报/续开，F=非此类别，U=现年度是否开放申报及表单/专家程序未知；SRC-005(2021历史)、SRC-011 §18；F013/018/027/028；M007/M016/M021；可核已存在大纲与课程关联，但 2021学院初审/研究生培养科专家意见不得推定2026必须有；M016 仅确有现行程序且 S2 后才可能生成；当前流程 POLICY_UNCONFIRMED→研究生院；S1 不以未来专家意见NEEDS_MATERIAL；课程大纲与目录冲突 CONFLICT→课程归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "局部思政授课资格暂停/恢复",
          "requirement": "R021 局部思政授课资格暂停/恢复；S1/S2/S5；T=相关学院特殊课程且存在恢复/准入主张，F=明确不属该学院/课程，U=旧 2017 办法是否现行、学段范围和岗权未知；SRC-007(2017旧)；F009/021/023/024/025/027；M008/M011/M012/M013/M021；可以核某项历史学院评价/试讲存在，不把2017委员会程序外推全校；当前恢复及例外必须由学院现行制度与真实有权角色核证；主结果 POLICY_UNCONFIRMED→特殊学院制度岗，另挂人工裁量待办（同一 claim 不再发第二结果码）；已有事实冲突另建 CONFLICT issue；F 分支 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "跨院归口及本批次宜宾协签",
          "requirement": "R022 跨院归口及本批次宜宾协签；S1/S2；T=跨学院本科课程或 SRC-003 批次宜宾公选课，F=同学院非宜宾事项且无协签规定，U=课程归属/校区/批次未知；SRC-001 §17、SRC-003；F016/017/028；M002/M006/M015；A 学院/校区归口，B 有权限协签；跨院本科开课学院组织认定；仅 E 的宜宾公选课当前见双签；M015 S2 后产生，S1 不可索件；归口事实 PASS_FACT→开课学院；S2 协签真伪待有权核验 NEEDS_HUMAN_DECISION→学院/宜宾校区；材料后置 NOT_APPLICABLE于 S1",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "外聘/兼聘身份及例外准入",
          "requirement": "R023 外聘/兼聘身份及例外准入；S1；T=教师存在外部/兼职/双聘身份或需例外聘任，F=校方在编普通教师且无例外主张，U=外聘准入现行校本政策未知；SRC-001 §17(只证明跨学院)、SRC-002(历史聘用)；F003/005/016/027；M003/M022/M021；B 人事/外聘合同可核关系、效期、签发主体，但不推定当期任教合法性；不让校外聘书覆盖 A 人事权限台账；校方未给出外聘例外条件；关系真实可 PASS_FACT，资格依然 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→人事＋归口学院；虚假冲突 CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "单材料可读、来源可达与实体归属",
          "requirement": "R024 单材料可读、来源可达与实体归属；S1/S2/S5；T=规则当前必须读取某 M 的具体证据版本，F=该 M 仅未来才产生或当前不适用，U=缺件责任/源可达性待核；SRC-001/002/003/004/005(随被读 M 继承，历史限制不放宽)；F003/010/018/031；M001–M022 中当前需用者；对材料 owner、目标课程与版本、PDF/图片页/可解析字段检查；依 A/B/C/D 分层，先看当前阶段是否应存在，再区分文件损坏、官方源失联、申请人欠件；后置 F NOT_APPLICABLE；损坏 UNREADABLE→材料持有人；官方失联 SOURCE_UNAVAILABLE→数据管理员；当前确须而未交 NEEDS_MATERIAL→对应持有人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "版本替换与影响项重审",
          "requirement": "R025 版本替换与影响项重审；S1/S2/S5；T=M:version 或权威来源发生变化/被撤销，F=无变化且原依赖仍有效，U=替代关系或快照完整性不可核；SRC-001/003(原规则作用域随依赖继承)；F008/015/025/027/031；M005/M013/M020/M021(也适用于所有M)；依 material_id+version_id+sourceRecordId+ruleId+targetFingerprint+policyVersion 算依赖闭包，只将依赖旧版的 R 失效，不重算无关规则；旧 M017 正式效力由有权机关更正，不让复审结果自动擦除；受影响 R 标 stale_for_recheck→事实复核岗；版本缺失 CONFLICT/系统待修；未变更 NOT_APPLICABLE；定向重审见 11.3",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "院级意见与最终可信决定的权限门禁",
          "requirement": "R026 院级意见与最终可信决定的权限门禁；S2/S3；T=收到学院审签或正式任课资格决定操作，F=仍在 S0/S1 事实预审且无决定请求，U=签发岗位/授权范围不明；SRC-001 §17、SRC-003(批次签章)、SRC-005(研究生历史不可套用)；F004/016/028/029/031；M015/M016/M017/M020；用服务端认证、机构岗位授权、范围、时间及可验证原始签发事件，A/B 才能确认；不能信 Renderer approved=true、自报 Actor、章图片；决定人/复核人身份与权限要独立核；权限/时效未知 NEEDS_HUMAN_DECISION 或 POLICY_UNCONFIRMED→学校授权管理员；未达 S2/S3 NOT_APPLICABLE；有效签发事实可 PASS_FACT，但此规则不代替决定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "撤回、复核与决定更正合法受理",
          "requirement": "R027 撤回、复核与决定更正合法受理；S5；T=本人/授权代理提出撤回、复核或重新申请，F=无相关请求，U=校方受理机构/权限/时限未知；SRC-001 §17(仅本科归口，非申诉依据)；F004/025/029/030/031；M013/M017/M018/M019/M020；核请求人、案卷/原决定、材料快照与重提版本；正式撤回/复核须由学校规定的机关按权限和期限处理，当前未取得受理规则；M019 办结后生成；原决定绝不因请求自动撤销；POLICY_UNCONFIRMED＋待受理人工待办→有权机关待确认；请求归属冲突 CONFLICT；未来结果 NOT_APPLICABLE于请求阶段",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "邻接系统既有决定只读复用与防双写",
          "requirement": "R028 邻接系统既有决定只读复用与防双写；S1/S4；T=引用 T01/T02/T05/T06 或 G50 的已有结论，F=无相邻业务引用，U=结论对象/真实签发/业务作用域未核；SRC-001 §17、SRC-006(教师证认定边界)、SRC-008(教务科岗位不等于资格决定)；F005/006/019/025/029；M003/M004/M006/M013/M017；校验被引用的 decisionId+owner+subject+scope+version+issuer，仅消费教师资格证、聘用、课程批准、任务表、导师招生等各自的事实/结论；不在本模板二次批准其原本目的；G50 目录 50 条已核，不能把其技术候选当已签学校决定；权威引用匹配的事实 PASS_FACT→本案审核岗；目标效力不匹配 CONFLICT→归口 Owner；真实决定源或范围未知 SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED→数据/制度 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "课程评价触发重新论证的跨案识别",
          "requirement": "R029 课程评价触发重新论证的跨案识别；S1/S2；T=SRC-001 §21 第一款的某教学班课程连续两次/一年内两次评价合格及以下、末10%，或正式明显异议记录，F=经可核记录无该课程触发，U=评价归属/阈值事实不可核；SRC-001 §21；F010/019/023/027；M006/M011/M021；对课程×教学班×学期的评价序列逐条比对，并与 R014 的教师本人继续任课限制分开；只有有权开课学院、学术分委员会和教务处依 §21 重新论证/审批课程，T01-T03 负责其开课效力；触发事实已核 PASS_FACT→T01-T03 课程重新论证/有权学院；源失联 SOURCE_UNAVAILABLE、评价冲突 CONFLICT、是否明显异议需人工 NEEDS_HUMAN_DECISION；本模板不得给课程重新批准",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R030",
          "title": "公选课开设许可与个人任课资格效力分离",
          "requirement": "R030 公选课开设许可与个人任课资格效力分离；S2/S3/S4；T=本科公选课有学院初审/教务处审核通过或正式开课记录，F=非公选课且不存在混合审批文书，U=文书字段未标明决定对象或签发人权限不可核；SRC-001 §17–18、SRC-003；F010/014/019/025/028/029；M006/M013/M014/M015/M017/M020；分解为courseOpeningDecision（T01-T03）与teacherTeachingQualificationDecision（本 ID），分别验 issuer、课程×教师×角色×学期及实际授权；一个纸表可以容纳两个字段，不能据“教务处审核通过开课”推定教师个人课程资格已获独立签发；可核决定类型/作用域 PASS_FACT→两业务 Owner 各只读；效力不明 NEEDS_HUMAN_DECISION→教务处/学院；原件冲突 CONFLICT；签发岗位未核 POLICY_UNCONFIRMED，不自动给 M017",
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
      "name": "S0 范围确认",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "s1"
    },
    {
      "id": "s1",
      "name": "S1 当前事实准备/提交",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "s2"
    },
    {
      "id": "s2",
      "name": "S2 归口审查/补件",
      "kind": "supplement-wait",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "s3"
    },
    {
      "id": "s3",
      "name": "S3 有权人工决定",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "s4"
    },
    {
      "id": "s4",
      "name": "S4 有效决定引用",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "s5"
    },
    {
      "id": "s5",
      "name": "S5 变化/撤回/异议/复核",
      "kind": "handoff",
      "executorRole": "reviewer",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "item-feedback",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-list",
      "kind": "supplement-list",
      "audience": "teacher"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

export const r02Metadata = {
  "batchId": "T06-A",
  "templateId": "T06-T04",
  "name": "教师本科及研究生课程任课资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T06-T04.md",
  "sourceDocumentSha256": "9024081f3de84cab05daf34700b5db879fec681a5aceb1380e4a18a95d4ff311",
  "sourceDocumentBytes": 150651,
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/T06-T04.md",
  "reviewedDocumentPatchApplied": false,
  "reviewedDocumentPatchSummary": "未做低歧义正文修订；保留原研究稿中的待确认门禁。",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "researchAsOf": "2026-10-23",
  "auditedAt": "2026-10-24",
  "criteria": [
    {
      "sectionId": "rules-08-2",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F001",
        "F015"
      ],
      "materialSlotIds": [
        "M001",
        "M006"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R002",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F003"
      ],
      "materialSlotIds": [
        "M002",
        "M020"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F010"
      ],
      "materialSlotIds": [
        "M006"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-009",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F012"
      ],
      "materialSlotIds": [
        "M006",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R005",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F003"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R006",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F003"
      ],
      "materialSlotIds": [
        "M002",
        "M004",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F007"
      ],
      "materialSlotIds": [
        "M005",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F009"
      ],
      "materialSlotIds": [
        "M005",
        "M008",
        "M015"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F014"
      ],
      "materialSlotIds": [
        "M001",
        "M010",
        "M013"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F003"
      ],
      "materialSlotIds": [
        "M002",
        "M010"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R011",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F014"
      ],
      "materialSlotIds": [
        "M006",
        "M009"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R012",
      "srcIds": [
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F010"
      ],
      "materialSlotIds": [
        "M006",
        "M007"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R013",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F002"
      ],
      "materialSlotIds": [
        "M001",
        "M014",
        "M020"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F023"
      ],
      "materialSlotIds": [
        "M011",
        "M020"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F023"
      ],
      "materialSlotIds": [
        "M011",
        "M012"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F003"
      ],
      "materialSlotIds": [
        "M013",
        "M017"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R017",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-010",
        "SRC-011",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F012"
      ],
      "materialSlotIds": [
        "M006",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R018",
      "srcIds": [
        "SRC-004",
        "SRC-008",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F007"
      ],
      "materialSlotIds": [
        "M005",
        "M006"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R019",
      "srcIds": [
        "SRC-004",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F003"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M005",
        "M006",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R020",
      "srcIds": [
        "SRC-005",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F013"
      ],
      "materialSlotIds": [
        "M007",
        "M016",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R021",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F009"
      ],
      "materialSlotIds": [
        "M008",
        "M011",
        "M012",
        "M013",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F016"
      ],
      "materialSlotIds": [
        "M002",
        "M006",
        "M015"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F003"
      ],
      "materialSlotIds": [
        "M003",
        "M021",
        "M022"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F003"
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
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F008"
      ],
      "materialSlotIds": [
        "M005",
        "M013",
        "M017",
        "M020",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R026",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F004"
      ],
      "materialSlotIds": [
        "M015",
        "M016",
        "M017",
        "M020"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R027",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F004"
      ],
      "materialSlotIds": [
        "M013",
        "M017",
        "M018",
        "M019",
        "M020"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F005"
      ],
      "materialSlotIds": [
        "M003",
        "M004",
        "M006",
        "M013",
        "M017"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R029",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F010"
      ],
      "materialSlotIds": [
        "M006",
        "M011",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F010"
      ],
      "materialSlotIds": [
        "M006",
        "M013",
        "M014",
        "M015",
        "M017",
        "M020"
      ]
    }
  ],
  "sources": [
    {
      "id": "SRC-001",
      "status": "CDUT-VERIFIED",
      "title": "成都理工大学，学院官网转载《[成都理工大学本科课程教学基本规范](https://mee.cdut.edu.cn/info/1117/1944.htm)》，成理校教〔2022〕11号；§15、§17–§21、§24、§43–§44；校办2022-06-04印发、网页2022-06-20发布；自印发实施；同时废止2018版本科教学工作规范",
      "url": "https://mee.cdut.edu.cn/info/1117/1944.htm",
      "scope": "SRC-001；成都理工大学，学院官网转载《[成都理工大学本科课程教学基本规范](https://mee.cdut.edu.cn/info/1117/1944.htm)》，成理校教〔2022〕11号；§15、§17–§21、§24、§43–§44；校办2022-06-04印发、网页2022-06-20发布；自印发实施；同时废止2018版本科教学工作规范；全校本科课程；对主讲、助课、课程组、学院归口有直接作用；CDUT-VERIFIED；全文校内检索可见。2026 年学院培训仍使用该规范[SRC-009]，未见更新废止通告；需向教务处复核最新版本。访问2026-10-22。"
    },
    {
      "id": "SRC-002",
      "status": "CDUT-VERIFIED",
      "title": "成都理工大学教务处《[关于做好2025-2026学年第二学期教学任务安排及课表编排的工作通知](https://aao.cdut.edu.cn/__local/6/D0/6E/D73FB595B334A89DCC3AB9C55E8_B2D0E7C3_27504.pdf)》，教通字〔2025〕45号；PDF p.1–2，“一、教学任务实施原则”第2–5项；2025-10-29；适用2025-2026第二学期，学期事项届满；无独立废止信息",
      "url": "https://aao.cdut.edu.cn/__local/6/D0/6E/D73FB595B334A89DCC3AB9C55E8_B2D0E7C3_27504.pdf",
      "scope": "SRC-002；成都理工大学教务处《[关于做好2025-2026学年第二学期教学任务安排及课表编排的工作通知](https://aao.cdut.edu.cn/__local/6/D0/6E/D73FB595B334A89DCC3AB9C55E8_B2D0E7C3_27504.pdf)》，教通字〔2025〕45号；PDF p.1–2，“一、教学任务实施原则”第2–5项；2025-10-29；适用2025-2026第二学期，学期事项届满；无独立废止信息；本科主讲教师的人事聘用、高校教师资格证、学历职称及教学任务登记；CDUT-VERIFIED；PDF两页已核，限通知所指学期，不作为2026-2027秋季现行通知。访问2026-10-22。"
    },
    {
      "id": "SRC-003",
      "status": "CDUT-VERIFIED",
      "title": "成都理工大学教务处《[关于2026-2027学年第一学期公共选修课申报的通知](https://aao.cdut.edu.cn/info/1171/7023.htm)》；“二、具体要求”“三、申报要求”；网页2026-04-28，落款2026-04-29；学院汇总表及申请表交教务处截止 2026-05-17 18:00，其余网上提交的具体节点依原文核；无另载废止",
      "url": "https://aao.cdut.edu.cn/info/1171/7023.htm",
      "scope": "SRC-003；成都理工大学教务处《[关于2026-2027学年第一学期公共选修课申报的通知](https://aao.cdut.edu.cn/info/1171/7023.htm)》；“二、具体要求”“三、申报要求”；网页2026-04-28，落款2026-04-29；学院汇总表及申请表交教务处截止 2026-05-17 18:00，其余网上提交的具体节点依原文核；无另载废止；本科公共选修课任课教师；含本人申报、教学大纲、课程归属学院及宜宾校区双签的批次证据；CDUT-VERIFIED；校内网页公开原始索引可见；仅2026-2027第一学期公选课。访问2026-10-22。"
    },
    {
      "id": "SRC-004",
      "status": "CURRENTITY-UNKNOWN",
      "title": "成都理工大学，核技术与自动化工程学院转载《[成都理工大学研究生课程建设及课程管理办法（暂行）](https://cnae.cdut.edu.cn/info/1040/1425.htm)》；§3–§14、§26；网页2018-01-09；自2018年1月实施，废止此前试行规定；其后续是否被替代不明",
      "url": "https://cnae.cdut.edu.cn/info/1040/1425.htm",
      "scope": "SRC-004；成都理工大学，核技术与自动化工程学院转载《[成都理工大学研究生课程建设及课程管理办法（暂行）](https://cnae.cdut.edu.cn/info/1040/1425.htm)》；§3–§14、§26；网页2018-01-09；自2018年1月实施，废止此前试行规定；其后续是否被替代不明；当时研究生学位/非学位课、主讲及助课，列有按学期聘任；CURRENTITY-UNKNOWN；2018原文可由校内索引读取，因后续其他文件使用不同规章标题，禁止作为2026硬条件。访问2026-10-22。"
    },
    {
      "id": "SRC-005",
      "status": "CURRENTITY-UNKNOWN",
      "title": "成都理工大学党委研究生工作部、研究生院《[关于申报2021-2022学年春季学期研究生公共选修课的通知](https://gra.cdut.edu.cn/__local/1/CA/91/7C1A10B30713251FB6EE9F0B27D_00D997B4_2C6ED.pdf)》；PDF p.1–2“课程要求/课程管理/申报程序”；2021-12-23；2021-2022春季批次已结束，无持续生效条款",
      "url": "https://gra.cdut.edu.cn/__local/1/CA/91/7C1A10B30713251FB6EE9F0B27D_00D997B4_2C6ED.pdf",
      "scope": "SRC-005；成都理工大学党委研究生工作部、研究生院《[关于申报2021-2022学年春季学期研究生公共选修课的通知](https://gra.cdut.edu.cn/__local/1/CA/91/7C1A10B30713251FB6EE9F0B27D_00D997B4_2C6ED.pdf)》；PDF p.1–2“课程要求/课程管理/申报程序”；2021-12-23；2021-2022春季批次已结束，无持续生效条款；历史研究生公选课，学院先审、培养科组织专家评审；CURRENTITY-UNKNOWN；历史PDF已核；其提及的《研究生课程教学管理办法》最新全文未得。访问2026-10-22。"
    },
    {
      "id": "SRC-006",
      "status": "CDUT-VERIFIED",
      "title": "成都理工大学党委教师工作部（人事处、教师发展中心）《[关于开展2026年高等学校教师资格认定工作的通知](https://rsc.cdut.edu.cn/info/1011/4057.htm)》；一–六部分；2026-04-01；2026上下半年认定安排，未载独立废止",
      "url": "https://rsc.cdut.edu.cn/info/1011/4057.htm",
      "scope": "SRC-006；成都理工大学党委教师工作部（人事处、教师发展中心）《[关于开展2026年高等学校教师资格认定工作的通知](https://rsc.cdut.edu.cn/info/1011/4057.htm)》；一–六部分；2026-04-01；2026上下半年认定安排，未载独立废止；全校受理范围内的高校教师资格证认定业务，不是逐课程任课资格；CDUT-VERIFIED；校内原文可检索，明确人事处初审、省级机构确认及学院评议；仅用于邻接业务边界。访问2026-10-22。"
    },
    {
      "id": "SRC-007",
      "status": "CURRENTITY-UNKNOWN",
      "title": "成都理工大学马克思主义学院《[马克思主义学院教学管理制度](https://marx.cdut.edu.cn/info/1053/1208.htm)》；第一部分“授课资格管理制度”；2017-06-06；具体生效/废止日期不载",
      "url": "https://marx.cdut.edu.cn/info/1053/1208.htm",
      "scope": "SRC-007；成都理工大学马克思主义学院《[马克思主义学院教学管理制度](https://marx.cdut.edu.cn/info/1053/1208.htm)》；第一部分“授课资格管理制度”；2017-06-06；具体生效/废止日期不载；学院思想政治理论课教师的入门、暂停与恢复资格，非全校通用规则；CURRENTITY-UNKNOWN；可查到校内原文，旧规则是否仍有效及有权签发角色待学院确认。访问2026-10-22。"
    },
    {
      "id": "SRC-008",
      "status": "CDUT-VERIFIED",
      "title": "成都理工大学环境与土木工程学院《[研究生管理科](https://cece.cdut.edu.cn/info/1028/9592.htm)》机构职责；“研究生教学管理岗位职责”第2、4项；2026-03-05；网页持续公开，未载废止",
      "url": "https://cece.cdut.edu.cn/info/1028/9592.htm",
      "scope": "SRC-008；成都理工大学环境与土木工程学院《[研究生管理科](https://cece.cdut.edu.cn/info/1028/9592.htm)》机构职责；“研究生教学管理岗位职责”第2、4项；2026-03-05；网页持续公开，未载废止；该学院研究生课表编排、教学计划/培养方案管理；不说明资格签发权；CDUT-VERIFIED；机构职能已核；不能推广为全校审批角色。访问2026-10-22。"
    },
    {
      "id": "SRC-009",
      "status": "CDUT-VERIFIED",
      "title": "成都理工大学机电工程学院《[新进教师教学规范培训会顺利召开](https://mee.cdut.edu.cn/info/1050/3438.htm)》；培训纪要；2026-01-28（记载2026-01-07培训）；非规章，无生效/废止",
      "url": "https://mee.cdut.edu.cn/info/1050/3438.htm",
      "scope": "SRC-009；成都理工大学机电工程学院《[新进教师教学规范培训会顺利召开](https://mee.cdut.edu.cn/info/1050/3438.htm)》；培训纪要；2026-01-28（记载2026-01-07培训）；非规章，无生效/废止；本科新教师培训继续使用《本科课程教学基本规范》；CDUT-VERIFIED；仅作 SRC-001 在2026年仍被使用的旁证，不能证明无新修订。访问2026-10-22。"
    },
    {
      "id": "SRC-010",
      "status": "CURRENTITY-UNKNOWN",
      "title": "成都理工大学校内公开的《[2024年度学位授权点相关报告（封面原始标题待核）](https://gra.cdut.edu.cn/__local/D/69/D5/7104C6BD7D9154AD3388B3A6B70_8DB688D1_F5567D.pdf)》；具体出具学院/学位点待核；检索可见“2.制度建设”段；年度2024，上传/生效/废止日期未见；PDF约16MB未完整打开",
      "url": "https://gra.cdut.edu.cn/__local/D/69/D5/7104C6BD7D9154AD3388B3A6B70_8DB688D1_F5567D.pdf",
      "scope": "SRC-010；成都理工大学校内公开的《[2024年度学位授权点相关报告（封面原始标题待核）](https://gra.cdut.edu.cn/__local/D/69/D5/7104C6BD7D9154AD3388B3A6B70_8DB688D1_F5567D.pdf)》；具体出具学院/学位点待核；检索可见“2.制度建设”段；年度2024，上传/生效/废止日期未见；PDF约16MB未完整打开；文内提到《成都理工大学研究生课程教学管理办法》，只作规章名称被引用的弱旁证；CURRENTITY-UNKNOWN；全文与封面未核，不能确认现行版本，更不能转化任课资格阈值。访问2026-10-22。"
    },
    {
      "id": "SRC-011",
      "status": "GENERAL-RESEARCH",
      "title": "中华人民共和国教育部《[教育部关于改进和加强研究生课程建设的意见](https://www.moe.gov.cn/srcsite/A22/s7065/201412/t20141205_182992.html)》，教研〔2014〕5号；重点核第17–18项有关研究生任课教师要求及课程安排；成文2014-12-05、网站2015-01-13发布；未取得正式废止记录，现行性仍应对照最新政策",
      "url": "https://www.moe.gov.cn/srcsite/A22/s7065/201412/t20141205_182992.html",
      "scope": "SRC-011；中华人民共和国教育部《[教育部关于改进和加强研究生课程建设的意见](https://www.moe.gov.cn/srcsite/A22/s7065/201412/t20141205_182992.html)》，教研〔2014〕5号；重点核第17–18项有关研究生任课教师要求及课程安排；成文2014-12-05、网站2015-01-13发布；未取得正式废止记录，现行性仍应对照最新政策；国家级指导意见，学校/研究生学段原则性适用；不直接规定成都理工大学个人申报表、具体职称门槛或签发权限；GENERAL-RESEARCH；教育部原始公开文本可检索，仅支持学校需建立规范的原则；校本细则待核。访问2026-10-22。"
    },
    {
      "id": "SRC-012",
      "status": "CROSS-SCHOOL-REFERENCE",
      "title": "大连理工大学研究生院《[大连理工大学研究生教学管理办法（2025年7月修订）](https://gs.dlut.edu.cn/info/1086/17146.htm)》；§11、§13–14；2025-07修订，网页2025-08-28；该校自身生效/废止按其校方管理",
      "url": "https://gs.dlut.edu.cn/info/1086/17146.htm",
      "scope": "SRC-012；大连理工大学研究生院《[大连理工大学研究生教学管理办法（2025年7月修订）](https://gs.dlut.edu.cn/info/1086/17146.htm)》；§11、§13–14；2025-07修订，网页2025-08-28；该校自身生效/废止按其校方管理；跨校研究生任课资格基本条件、教师发展中心具体认定、校外专家与课程开设审批分离；CROSS-SCHOOL-REFERENCE；官方正文第四章可读；只能证“可能存在分离的权责与证据路径”，任何职称/证书门槛不得迁移成都理工。访问2026-10-23。"
    },
    {
      "id": "SRC-013",
      "status": "CROSS-SCHOOL-REFERENCE",
      "title": "北京理工大学研究生院《[北京理工大学研究生授课教师管理规定](https://grd.bit.edu.cn/pygz/jwyx/gzzd_jwyx/3f5caaf7e208490bbdb9412d549cf8f5.htm)》，研函〔2026〕84号；§4–5、§6–13；网页2026-07-24；该校有效性以北理工为限",
      "url": "https://grd.bit.edu.cn/pygz/jwyx/gzzd_jwyx/3f5caaf7e208490bbdb9412d549cf8f5.htm",
      "scope": "SRC-013；北京理工大学研究生院《[北京理工大学研究生授课教师管理规定](https://grd.bit.edu.cn/pygz/jwyx/gzzd_jwyx/3f5caaf7e208490bbdb9412d549cf8f5.htm)》，研函〔2026〕84号；§4–5、§6–13；网页2026-07-24；该校有效性以北理工为限；跨校研究生首次授课、新课程、外聘授课、试讲/豁免、学院审核与研究生院备案的分层示例；CROSS-SCHOOL-REFERENCE；官方现行文本可读；不可把其 30 分钟试讲、专家人数或期限当成都理工规则。访问2026-10-23。"
    },
    {
      "id": "SRC-014",
      "status": "CDUT-VERIFIED",
      "title": "成都理工大学管理科学学院《[管理科学学院2026年招收硕博连读研究生实施细则](https://cim.cdut.edu.cn/info/1098/6002.htm)》；学院2026年招生细则中对《成都理工大学研究生课程教学管理办法》百分制/五级制换算的引用；2026年招生批次",
      "url": "https://cim.cdut.edu.cn/info/1098/6002.htm",
      "scope": "SRC-014；成都理工大学管理科学学院《[管理科学学院2026年招收硕博连读研究生实施细则](https://cim.cdut.edu.cn/info/1098/6002.htm)》；学院2026年招生细则中对《成都理工大学研究生课程教学管理办法》百分制/五级制换算的引用；2026年招生批次；只证明该制度名称在2026年另一业务中继续被引用；不涉及任课教师准入阈值或签发人；CDUT-VERIFIED（对标题被引用这一弱事实）；校本院系公开索引可检索、直接网页412；不能据此判全文版本有效。访问2026-10-23。"
    }
  ]
} as const
