import type { TemplateVersion } from '@profer/shared'
export type { TemplateVersion }

export type R02EvidenceStatus = 'verified' | 'partial' | 'unconfirmed'
export interface R02CriterionMetadata { sectionId: string; criterionId: string; sourceIds: string[]; evidenceStatus: R02EvidenceStatus; fieldIds: string[]; materialIds: string[] }
export interface R02Metadata { templateId: string; name: string; sourceDocumentPath: string; sourceDocumentSha256: string; officialSchoolTemplate: false; researchAsOf: string; policyEvidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'; sourceIds: string[]; fieldIds: string[]; materialIds: string[]; criteria: R02CriterionMetadata[] }

export const templateVersion: TemplateVersion = {
  "templateId": "S03-T03",
  "version": 1,
  "schemaVersion": 2,
  "name": "国家励志奖学金申报审核",
  "description": "本地研究模板 · 非校方正式模板。用于国家励志奖学金申报审核的材料核验和人工审阅建议；政策/授权未确认时不得形成正式通过或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本定义由 R02 研究交接稿转换，不是成都理工大学正式发布模板；SRC 为研究来源索引，不是案卷材料 SourceRef；未确认政策由有权人员人工复核。",
  "objectType": "person",
  "displayName": {
    "template": "S03-T03 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "F001 · ScholarshipCase.caseId（不透明 ID）",
      "kind": "text",
      "required": true,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F001。ScholarshipCase.caseId（不透明 ID）；各；宿主可信案卷登记/受理日志，非表单 OCR；P1；未建案不进入核验；由宿主建案，避免人为拼接学号充当全局键。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f002",
      "label": "F002 · Applicant.schoolStudentId（字符串）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F002。Applicant.schoolStudentId（字符串）；P1—P6；校方学籍 M003 学号；与 M002 申报表学号交叉验证；P2；不符 CONFLICT；源不可得 SU，不靠姓名单独确定对象。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f003",
      "label": "F003 · Applicant.legalName（字符串）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F003。Applicant.legalName（字符串）；P1—P6；学籍 M003 姓名，M002 学生姓名栏；P2；同名异号不可合案；更名须权威学籍证据 M011，不清晰 UNREADABLE。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f004",
      "label": "F004 · Applicant.studyLevelAndProgram（枚举＋文本）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F004。Applicant.studyLevelAndProgram（枚举＋文本）；P1/P2；学籍 M003 学段、学习形式、第二学士/学制信息；P2；学段不明 SU；特别学制资格 HD/PU，不按文本臆断。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f005",
      "label": "F005 · Applicant.enrollmentStatus（状态＋生效日）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F005。Applicant.enrollmentStatus（状态＋生效日）；P1/P2/P3；学籍 M003 当前/参评期状态，异动文书 M011；P2；与自述矛盾 CONFLICT；无法访问学籍 SU。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f006",
      "label": "F006 · Applicant.entryDateAndGrade（日期＋年级）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F006。Applicant.entryDateAndGrade（日期＋年级）；P1/P2；学籍 M003 入学/编入/年级；异动见 M011；P2；特殊学制或无法还原实际年级转 HD；不能只用当年减入学年。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f007",
      "label": "F007 · Applicant.affiliation（学院/专业/班级＋生效区间）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F007。Applicant.affiliation（学院/专业/班级＋生效区间）；P1—P4；学籍 M003，异动 M011；与 M002 填报院系对照；P2；归口/专业不一致 CONFLICT；批次归属 PU 待人定。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f008",
      "label": "F008 · Case.reviewAcademicYear（学年，例“2024—2025”）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F008。Case.reviewAcademicYear（学年，例“2024—2025”）；P0—P6；当期 M001 国励志参评学年和 M002 申请学年；P1；缺有效批次 PU；与成绩/困难/国奖学年错位 CONFLICT。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f009",
      "label": "F009 · Case.applicationBatch（批次 ID/日历年/通知版）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F009。Case.applicationBatch（批次 ID/日历年/通知版）；P0—P6；M001 当期学校公告及学院通知的名称、发布日期/版本；P1；无当期签发件 PU；不可借 2025 代填 2026。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f010",
      "label": "F010 · Case.collegeAndRankingGroup（归口＋专业/年级群组）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F010。Case.collegeAndRankingGroup（归口＋专业/年级群组）；P0—P4；M001/M021 有效群组说明，学籍 M003 归属；P1；归口、名额池/分母不一致 CONFLICT/PU；由有权学院核定。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f011",
      "label": "F011 · Application.submittedAtAndReceipt（时间＋回执/通道）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F011。Application.submittedAtAndReceipt（时间＋回执/通道）；P2/P3；四川资助平台提交回执或校方受理 M002 的渠道信息；P2；无提交依据 NM/SU；超时是否受理须当期 M001＋人工，不自动拒件。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f012",
      "label": "F012 · Application.declaration（本人事实陈述/承诺版本）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F012。Application.declaration（本人事实陈述/承诺版本）；P2/补件；M002 学生本人填写区、可信提交记录；P2；本人栏缺失 NM；不把其陈述作为成绩/困难正式结论。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f013",
      "label": "F013 · Hardship.academicYear（学年）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F013。Hardship.academicYear（学年）；P1/P2/P3；学校困难认定 M006 的认定/适用年度；P3；与 F008 不符 CONFLICT；认定制度要求具体年待 PU [SRC-002]。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f014",
      "label": "F014 · Hardship.statusAndValidity（正式认定状态＋生效/撤销版本）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F014。Hardship.statusAndValidity（正式认定状态＋生效/撤销版本）；P1—P4；学生资助管理中心或有权认定机关 M006 结果记录；P3；只有个人自述 NM；权威源失联 SU；动态调整须重新核验。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f015",
      "label": "F015 · Academic.failedCourses（不及格事实/科目范围＋学年）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F015。Academic.failedCourses（不及格事实/科目范围＋学年）；P1/P2/P3；教务 M004 权威课程成绩范围和有效版；P2；课程范围未知 PU；成绩不可核 SU；2025 学院“无不及格”不得直接当 2026 参数。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f016",
      "label": "F016 · Academic.gradeRank（正整数名次）",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F016。Academic.gradeRank（正整数名次）；P1/P2/P3；M004 教务正式排名或授权排名证明；P2；不可用个人自制排名替换；缺校方名次 SU/NM。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f017",
      "label": "F017 · Academic.gradeRankDenominator（正整数人数）",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F017。Academic.gradeRankDenominator（正整数人数）；P1/P2/P3；M004/M021 同一专业/年级排名总人数；P2；未见分母时不计算百分位；报 SU/PU。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f018",
      "label": "F018 · Academic.comprehensiveRank（正整数名次）",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F018。Academic.comprehensiveRank（正整数名次）；P1/P2/P3；M005 学院正式综合测评/综测排名，可引用 S03-T01；P2；综测结论未生效 NM/SU；不另行加扣分计算。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f019",
      "label": "F019 · Academic.comprehensiveRankDenominator（正整数人数）",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F019。Academic.comprehensiveRankDenominator（正整数人数）；P1/P2/P3；M005/M021 同一群组人数；P2；分母缺失/组别不同 SU/CONFLICT。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f020",
      "label": "F020 · Academic.rankingBasis（群组口径/方法/有效期）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F020。Academic.rankingBasis（群组口径/方法/有效期）；P0—P3；官方 M021 排名说明、参评期、生效的群组编号；P1；不同专业、参评期或评法不互算；未知 PU/HD。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f021",
      "label": "F021 · Academic.sourceRevision（成绩/综测双版本＋签发时间）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F021。Academic.sourceRevision（成绩/综测双版本＋签发时间）；P1—P4；M004/M005 的签发机构、时间、名单版及有效日期；P2；版本不可定 SU，不同版本 CONFLICT；重发后依赖结果失效。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f022",
      "label": "F022 · Recognition.issuerAndLevel（颁发单位/奖项级别/名称）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F022。Recognition.issuerAndLevel（颁发单位/奖项级别/名称）；P2/P3 条件；M009 证书/学校登记的表彰项目和颁发机关；P2；非例外情形 NOT_APPLICABLE；证据不全 NM。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f023",
      "label": "F023 · Recognition.issuedAtAndApplicableYear（颁发日＋归属学年）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F023。Recognition.issuedAtAndApplicableYear（颁发日＋归属学年）；P2/P3 条件；M009 正式证书签发日/学校奖项台账；P2；2025 例外需核学年；跨年/无日期 CONFLICT/HD，2026 规则 PU。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f024",
      "label": "F024 · CrossAward.nationalScholarship（正式决定状态＋学年＋号）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F024。CrossAward.nationalScholarship（正式决定状态＋学年＋号）；P2—P5；相邻 S03-T02 业务正式决定 M008，不采用单纯报名状态；P2；结果未形成≠已获奖；不可达 SU；同学年已获奖 CONFLICT。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f025",
      "label": "F025 · CrossAward.nationalGrant（正式受助/申请状态＋学年）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F025。CrossAward.nationalGrant（正式受助/申请状态＋学年）；P2—P5 条件；独立助学金决定 M007；P2；可兼得；无该记录不造成国励志硬退件，查询失联 SU 仅影响交叉核对。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f026",
      "label": "F026 · CrossAid.tuitionWaiverAndTargetProgram（培养类别＋费用减免生效期）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F026。CrossAid.tuitionWaiverAndTargetProgram（培养类别＋费用减免生效期）；P2/P3 条件；学籍培养类别、资助项目正式决定 M010；P2/P3；对应特别情形未知 PU/HD，不能把任意困难补助视为全免项目。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f027",
      "label": "F027 · Enrollment.changeEvent（类型/生效日/签发版本）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F027。Enrollment.changeEvent（类型/生效日/签发版本）；P1—P4 条件；M011 复学/休学/转专业/延毕的校方正式记录；P2；自述无法替代；有异动而无有效决定 NM/SU。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f028",
      "label": "F028 · Application.formIdentityAndStudentSignoff（申请表版本＋本人确认状态）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F028。Application.formIdentityAndStudentSignoff（申请表版本＋本人确认状态）；P2/P3；M002 四川系统下载表的标题、版号、学生本人栏及提交记录；P2；2021版仅在 2025 学院附件可见；2026 版本 PU；不得要求未来审批签章 [SRC-004]。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f029",
      "label": "F029 · Evidence.ownershipAndRevision（owner/source/hash/supersedes/version）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F029。Evidence.ownershipAndRevision（owner/source/hash/supersedes/version）；各；M002—M022 对应文件元数据、持有人和受理审计事件；P1；敏感内容依源提高；新件缺归属 NM；替换件撤销引用、旧核验标过时，不消灭审计历史。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f030",
      "label": "F030 · College.recommendationStatus（拟推荐/未推荐＋版号）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F030。College.recommendationStatus（拟推荐/未推荐＋版号）；P3/P4/P5；学院正式 M012/M013 审核台账与推荐清单；P2；P2 阶段 NOT_APPLICABLE；未公开版/签发不明 SU/HD。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f031",
      "label": "F031 · College.reviewerAction（有权人/组织/动作/时间）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F031。College.reviewerAction（有权人/组织/动作/时间）；P3/P4；M012 学院评议/初审签发台账及可信 F038；P2；身份不足不得认为已正式初审；待 HD。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f032",
      "label": "F032 · Publicity.windowAndListVersion（起止/发布主体/名单版本）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F032。Publicity.windowAndListVersion（起止/发布主体/名单版本）；P4/P5；M014 学院发布的正式公示记录及修改说明；P1/P2 涉人员；P2/P3 阶段不要求；日数冲突 PU/HD，不自行取 3 或 5 天。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f033",
      "label": "F033 · Review.objectionAndDisposition（异议号/内容分类/受理与回复状态）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F033。Review.objectionAndDisposition（异议号/内容分类/受理与回复状态）；P4/P5 条件；M015 异议原件，M016 有权人正式办理结果；P2/P3；无异议 NOT_APPLICABLE；未裁决≠无异议；来源缺 NM/SU/HD。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f034",
      "label": "F034 · School.leadershipReviewAndProposedDecision（校级审议号/拟推荐结论/签发者与审议日）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F034。School.leadershipReviewAndProposedDecision（校级审议号/拟推荐结论/签发者与审议日）；P5/P6；学校有权领导小组 M017 审议及上报记录；上级批复另属 F043/M023；P2；申请期不应存在；无校级签发件 SU/HD；即使学校审议通过也不能由模型宣布上级已批获奖。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f035",
      "label": "F035 · Application.withdrawalState（请求时/受理时/生效与权限）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F035。Application.withdrawalState（请求时/受理时/生效与权限）；P2—P5 条件；M019 本人可信请求和有权办理者的处理记录；P2；请求不等于撤回已生效；期限、允许性 PU/HD。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f036",
      "label": "F036 · Application.amendmentImpact（更正原因/所替换材料/受影响项）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F036。Application.amendmentImpact（更正原因/所替换材料/受影响项）；P2—P5 条件；M018 补件回执、原件—新件关联及源系统新版本；P2；未发生补件 NOT_APPLICABLE；身份/归属/替换链不清 CONFLICT/NM。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f037",
      "label": "F037 · Payment.payoutRecord（发放批次/到账/异常状态）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F037。Payment.payoutRecord（发放批次/到账/异常状态）；P6；学校财务及银行/社保卡平台 M020 正式回执；P3；P2—P5 不需要；支付源失联 SU，不得反推审批结果。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f038",
      "label": "F038 · Actor.authzContext（可信主体/组织/动作权限/时效）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F038。Actor.authzContext（可信主体/组织/动作权限/时效）；各办理动作；Host/Main 验证的身份和岗位授权，操作审计；无可接受的 Renderer 字段位置；P3；未授权则不得执行签发、撤回生效、复核与决定；HD，仅做事实草稿。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f039",
      "label": "F039 · Batch.policyParameters（适用对象/截止/排名/名额/公示/例外的版本化配置）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F039。Batch.policyParameters（适用对象/截止/排名/名额/公示/例外的版本化配置）；P0—P6；M001 当期校/学院正式通知＋M021 正式排序口径；P0/P1；2026 未核实字段一律 PU，不写默认阈值、日期、名额或有效授权。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f040",
      "label": "F040 · Conduct.disciplinaryStatusAndPeriod（处分/法律处罚有权确认状态＋起止/撤销版）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F040。Conduct.disciplinaryStatusAndPeriod（处分/法律处罚有权确认状态＋起止/撤销版）；P1/P2/P3；学生工作管理部门可授权查询的 M022 正式结论；适用期与 F008、当期 M001 比较；P3；不能访问合法源 SU；处分记录与更正件冲突 CONFLICT；是否影响本批次资格 PU/HD。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f041",
      "label": "F041 · Conduct.humanReviewOpinion（品行/诚信评议状态＋正式评议人/时间）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F041。Conduct.humanReviewOpinion（品行/诚信评议状态＋正式评议人/时间）；P3/P4；申请人 M002 承诺只作自述；有权学院 M012 正式评议结论及 F038；P2/P3；P2 前尚无院审意见 NOT_APPLICABLE；不从 F040=无处分 推出品行通过，人工 HD。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f042",
      "label": "F042 · Applicant.nationality（国家/国籍资格状态＋核证源版）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F042。Applicant.nationality（国家/国籍资格状态＋核证源版）；P1/P2；校方入学身份主数据、已授权的 M003 身份核验或有权单位签发的必要字段；不默认收集身份证原图 [SRC-015第2条]；P3；未经验证的本人填写国籍只是陈述；有权源失联 SU，内容不符 CONFLICT，确认非中国国籍时仅记录政策事实而不由模型发行政拒绝书。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f043",
      "label": "F043 · SuperiorAuthority.approval（逐级报送号/批复号/机关/生效状态）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F043。SuperiorAuthority.approval（逐级报送号/批复号/机关/生效状态）；P5/P6；M023 有权省级教育部门或法定主管部门的正式批复、受控报送/批复台账 [SRC-015第10条]；P2；P2—P4 NOT_APPLICABLE；报送成功≠批复，未取得 SU/HD，2026 具体报送路径 PU。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    },
    {
      "key": "f044",
      "label": "F044 · School.publicityWindowAndListVersion（全校发布者、起止、至少5工作日核证、名单版）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F044。School.publicityWindowAndListVersion（全校发布者、起止、至少5工作日核证、名单版）；P5；M024 有权学校发布机关的全校公示及归档版；依 SRC-015第10条，不以 M014 学院公示替代；P1/P2；P2—P4 NOT_APPLICABLE；不足上位最短值标 CONFLICT 待有权机关处理，未找到校级公示记录 SU；法定节假日口径及新修订仍需复核。字段缺失不自动等于资格不符；需要权威记录或政策判断时转人工复核。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "当期校本正式公告、院系实施通知、受理规则",
      "purpose": "当期校本正式公告、院系实施通知、受理规则：明确对象、批次、窗口、配额、角色；学校资助中心/学院签发的规范与通知；P0 当前必需于应用硬条件前；非申请人材料；有权人提供完整签发件/校方正式网存档，保存生效及适用批次；往年通知不合法替代当期；F008—F011/F039；SRC-001/004—006/012/013；issuer+文号+批次+适用期+正文版；2026 未取 POLICY_UNCONFIRMED，OCR 模糊 UNREADABLE，源不可用 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "当期校本正式公告、院系实施通知、受理规则",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "本专科生国家励志奖学金申请表或省系统有效填报记录",
      "purpose": "本专科生国家励志奖学金申请表或省系统有效填报记录：本人申请、确认和提交；学生本人提供；四川省学生资助管理系统记录为有权受理时的优先载体；P2 学生当前必需的本人部分，含确需签署的本人确认；校方系统若已有合法提交记录免重复纸质上传；2025 传播学院要求省系统打印申请表两份、成绩/获奖材料，另由学生发送“初审名单表”电子工作表；该填报工作表只是申请附件，不等于 M013 学院有权正式拟推荐名单。2026 所需份数、格式未证；F002/F003/F007—F012/F028/F029；SRC-004/006/015；绑定 studentId+awardYear+batch+formVersion+submitTime+studentIdentity；未提交 NEEDS_MATERIAL，不可读 UNREADABLE；学院/学校后签栏此时允许空白",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "本专科生国家励志奖学金申请表或省系统有效填报记录",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "学籍/身份/学段/院系权威快照",
      "purpose": "学籍/身份/学段/院系权威快照：证明申请主体、国籍资格与在籍、年级；学籍管理部门主数据或合法出具的在校学籍证明；国籍部分由有授权的合法身份核证机关/入学档案提供最小化摘要；P1/P2 当前事实必需，校方优先自行核对，非学生默认上传义务；有签发者可追溯的教务学籍或入学身份核验结果；学生证/截图仅辅助，不替代正式状态；仅核中国国籍事实，身份证号码及原件不默认进入模板；F002—F007/F010/F042；SRC-004—006/015；学号＋签发日＋状态生效日＋数据版；国籍事实必须有可验证出处；缺权威源 SOURCE_UNAVAILABLE，文本冲突 CONFLICT，扫描不清 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "学籍/身份/学段/院系权威快照",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "参评学年成绩单与学业排名",
      "purpose": "参评学年成绩单与学业排名：课程及名次分母、是否不及格；教务/学院正式成绩排名记录；P1/P2 当前事实必需；不得因学校系统未接入便无条件要求学生上传；盖章或验证签发的教务学业证明/校方认可的电子成绩单；F008/F015—F017/F021；SRC-004—006；学号＋学年＋成绩范围＋名次/总数＋源版本；仅学生自算名次 NEEDS_MATERIAL，不可读 UNREADABLE，源失联 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "参评学年成绩单与学业排名",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "参评学年综合素质测评正式结果",
      "purpose": "参评学年综合素质测评正式结果：综测名次及分母；学院正式考评机构/相邻 S03-T01 已审定结论；P1/P2 当前事实必需（适用相关排名条件时）；经确认的学院综测汇总表中限本申请人可见投影或正式签发证明；个人加分票据不是同等替代；F008/F018/F019/F021；SRC-004/005；学号＋综测年度＋专业群体＋审定版；未形成 NEEDS_MATERIAL（权威产生方），源断 SOURCE_UNAVAILABLE；错人 CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "参评学年综合素质测评正式结果",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "对应学年家庭经济困难认定的有效结果",
      "purpose": "对应学年家庭经济困难认定的有效结果：确认入库/有效期；学校资助管理中心/有权认定机关的困难认定结果库；P1/P2 当前事实必需，由学校核验；不是让学生重新解释家庭财务；有权机关签发的困难认定有效凭据或校内授权查询证实；家庭收入自述不合法替代；F002/F008/F013/F014；SRC-002/004—006/009；学号＋认定学年＋决定号＋变更版；未认定是待相邻业务处理，源失联 SOURCE_UNAVAILABLE，扫描不清 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "对应学年家庭经济困难认定的有效结果",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "国家助学金既有申请/决定",
      "purpose": "国家助学金既有申请/决定：仅验证可兼得的并行状态；独立国家助学金归口机构/正式决定台账；P2—P5 条件必需（确需跨事项核对时），不是国励志常规必交；合法授权的助学金决定查询或签发通知；申请意向与有效决定必须区分；F025/F008；SRC-004/005；学号＋助学金所属学年/批次＋决定版；不可查只使交叉信息 SOURCE_UNAVAILABLE，不得误判国励志不合格",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "国家助学金既有申请/决定",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "本专科国家奖学金正式决定/结果台账",
      "purpose": "本专科国家奖学金正式决定/结果台账：同参评学年互斥查验；独立 S03-T02 或原审批机关正式获奖台账；P2—P5 条件必需（并行国奖或存在获奖线索）；校方应提供查询；经确认的正式国奖发文/获奖名单权威版，不以“报名表/拟推荐表”替代已获奖决定；F002/F008/F024；SRC-004/005；学号＋参评学年＋奖项＋批准状态/号＋变更版；正式来源不可查 SOURCE_UNAVAILABLE，与他源异议 CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "本专科国家奖学金正式决定/结果台账",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "校级及以上表彰证据",
      "purpose": "校级及以上表彰证据：排名例外的奖项类型、日期、级别；颁发单位、校方荣誉登记部门；学生可持有证书；P2/P3 条件必需（当期确有排名例外且触发）；发奖机关登记记录或可核实电子证书；学生照片只有佐证性；F022/F023/F029；SRC-004；证书号＋颁发人＋日期＋学生＋适用学年；未触发 NOT_APPLICABLE，缺证明 NEEDS_MATERIAL，不可辨识 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "校级及以上表彰证据",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "特殊培养、定向/乡村振兴类学费全免的正式身份及资助决定",
      "purpose": "特殊培养、定向/乡村振兴类学费全免的正式身份及资助决定；学籍培养主管部门、学费与资助项目有权单位；P2/P3 条件必需（确有相关项目/全免线索）；有权单位项目名册、录取类别、免学费正式决定并能核学年，不能用单一缴费截图代替资格；F004/F026/F008；SRC-004—006；人＋项目＋待遇起止＋决定版本；对 2026 适用政策未知 POLICY_UNCONFIRMED；证据源失联 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "特殊培养、定向/乡村振兴类学费全免的正式身份及资助决定",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "学籍异动、复学、转专业、年级编入、延期等正式通知",
      "purpose": "学籍异动、复学、转专业、年级编入、延期等正式通知；学籍管理部门签发的异动决定/历史记录；P1—P4 条件必需（异动或学制争议触发）；具有签发者、日期和状态的历史学籍权威导出，非个人说明；F004—F007/F027/F029；SRC-004—006/001；人＋事项＋前后状态＋生效日＋发文版；不存在异动 NOT_APPLICABLE，冲突 CONFLICT，不可获取 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "学籍异动、复学、转专业、年级编入、延期等正式通知",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "院级评议、初审意见/签章台账",
      "purpose": "院级评议、初审意见/签章台账：证明已依法开展院审；辅导员及学院当期获授权评审组签发；P3 后续才产生；P2 不得要求学生交；学院正式电子评议审批轨迹、可验证签发件；普通上传签名不能代表授权；F030/F031/F038；SRC-005/001；审核人可信 ID＋学院＋批次＋时间＋结论版；P3 前 NOT_APPLICABLE，签发者不明 NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "院级评议、初审意见/签章台账",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "学院拟推荐清单/名额执行版",
      "purpose": "学院拟推荐清单/名额执行版：证明院内推荐状态；学院评审工作组或有权发布单位；P3/P4 后续才产生；经学院认证的正式名单及可核验登记号；仅作“拟推荐”不作为学校获奖决定；F010/F030/F029；SRC-005/007；发布者＋名单版本＋学生＋奖项＋批次；尚未形成 NOT_APPLICABLE，与 M014 版本不一致 CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "学院拟推荐清单/名额执行版",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "院内公示证据",
      "purpose": "院内公示证据：确定公示名单版、窗口、公告渠道；学院发布机构/公告台账；P4 后续才产生；学院官网有效页面与正式留档的同版截图/签发 PDF，需核可靠发布时间；F030/F032/F029；SRC-004/005/007；发布实体＋公示起止＋名单版本＋撤换/异议纪录；申请时不得索取；日数效力不明 POLICY_UNCONFIRMED",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "院内公示证据",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "异议/复核申请与关联证据",
      "purpose": "异议/复核申请与关联证据：触发争议办理；可信提交的本人或被当期政策允许的提出者；P4/P5 条件必需（仅提出争议时）；有权窗口正式收件回执及对应证据；未核实代理权限不得接受代理自称；F033/F029，争议可能涉及 F002—F027；SRC-001/005/007；申请人身份＋公示版＋异议点＋证据版＋提交时刻；无异议 NOT_APPLICABLE；不清 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "异议/复核申请与关联证据",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "正式异议处理/复核结论",
      "purpose": "正式异议处理/复核结论：证明有权机构已答复；经制度授权的学院/学校办理机关；P4/P5 后续才产生，仅在 M015 已受理后；具可验签发者、答复日期与处理结果的正式回复/台账；F033/F038；SRC-001/005/007；受理号＋处理机关＋结论时间＋所据材料版；受理但无结论 NEEDS_HUMAN_DECISION，签发权不明亦然",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "正式异议处理/复核结论",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "学校评审领导小组审议意见与报送回执",
      "purpose": "学校评审领导小组审议意见与报送回执：证明校级研究通过、拟上报状态（不是上级批复）；学校学生资助管理机构、学校评审领导小组及受权报送部门；P5 后续才产生；申请期不需要；可核学校领导小组审议记录、校级建议名单、真实上报编号，三者须区分；如无可信原件不可用截图代替；F034/F038/F008/F043；SRC-001/005/009/012/013/015；人＋奖励学年＋审议结果＋签发者＋审议/报送版本；未有权审议不可标校级通过，未获批复不可标终局获奖",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "学校评审领导小组审议意见与报送回执",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "更正、补件与重发凭据",
      "purpose": "更正、补件与重发凭据：证明哪个事实版本被更换；申请人（自有内容）或成绩/困难/荣誉等原权威单位（其记录）；P2—P5 条件必需（更正触发）；原机关出具新版本或正式校方补充说明；对官方成绩不得用学生手工涂改替代；F021/F029/F036，按影响域关联 F002—F027；SRC-004—006；旧材料号→新材料号、时间、缘由、权威签发；新材料缺归属 CONFLICT，不可读 UNREADABLE；旧事实结果失效",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "更正、补件与重发凭据",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "撤回请求及受理/生效记录",
      "purpose": "撤回请求及受理/生效记录：区分请求和处理；学生可信请求；有效撤回由当期有权受理机关确认；P2—P5 条件必需（学生发起撤回后）；仅本人提出的意愿先形成；经本人验证的申请/受理回执；代理签署合法性、审批方式须政策确认；F002/F035/F038；SRC-001/013；请求人＋接收人＋批次＋时间＋处理状态；身份不实 CONFLICT，权限未定 NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "撤回请求及受理/生效记录",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "实际资金发放和银行/社保卡支付回执",
      "purpose": "实际资金发放和银行/社保卡支付回执：仅后续对账；学校财务及授权发放平台；P6 后续才产生；无正式获奖结果不得作为申请证据；学校财务查询/正式支付台账；学生到账截图仅核对线索；F034/F037；SRC-008/011；有效决定号＋支付批次＋款项状态，银行卡敏感信息最小化；无源 SOURCE_UNAVAILABLE，差错由财务办",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "实际资金发放和银行/社保卡支付回执",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "排名群组及计算口径的正式说明",
      "purpose": "排名群组及计算口径的正式说明：使成绩与综测名次可比；教务/学院成绩和综测组织者，当期有效说明/名单表头；P0/P1/P2 当前事实必需于使用排名阈值前；非学生上传义务；由有权人签发的年级专业群体、应计课程和人数统计说明；不能单凭两张表的“前十”认定同一组；F010/F016—F021/F039；SRC-004/005/001；学院＋专业＋年级＋学年＋分母算法＋时间＋源版；未知口径 POLICY_UNCONFIRMED，记录不一致 CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "排名群组及计算口径的正式说明",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "参评期间纪律处分/合法可核法律处罚的有效状态摘要",
      "purpose": "参评期间纪律处分/合法可核法律处罚的有效状态摘要：遵纪守法客观前置事实；学生工作主管部门及依法有权持有处罚记录的机关；学院评议部门只应获授权的必要结论；P1—P3 当期纪律条件适用时当前事实必需；校方持有、非学生默认上传；品行评议意见另在后续 M012 形成；有效的学校处分查询摘要（仅状态、起止和解除/撤销信息）、经权威机关证实的结论；传闻、搜索曝光、个人“无处分承诺”不合法替代；F002/F008/F039/F040/F041；SRC-004/005/001；学号＋参评期＋有权出具者＋处分生效/终止/撤销版；访问权限不足 SOURCE_UNAVAILABLE，异议 CONFLICT，是否构成当期排除条件 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；案情不扩散",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "参评期间纪律处分/合法可核法律处罚的有效状态摘要",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "上级主管部门审核批复",
      "purpose": "上级主管部门审核批复：证明报送后的正式批准或调整；省级教育行政部门或制度确定的有权上级主管单位；学校可持有其有验签的正式收文/授权查询结果；P5 校级公示及报送以后才产生；P2—P4 不能列申请缺件；正式上级批复文件、主管机关可核的批准数据库回执；学校“已上报”截图、学院初审不构成合法替代；F002/F008/F009/F034/F038/F043；SRC-015/001/013；上级机关＋批复文号＋批准对象＋批次＋生效/变更版本；尚未到阶段 NOT_APPLICABLE；已到期不能访问 SOURCE_UNAVAILABLE；身份/版本不明 CONFLICT/HD",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "上级主管部门审核批复",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "校级全校公示原件",
      "purpose": "校级全校公示原件：证明学校领导小组研究通过后的法定公示阶段；校级学生资助主管机关及学校官方公告发布者；学生不负责提供；P5 校级审议后才产生；按 SRC-015 第十条校内公示不少于五工作日，2026 执行需核当期有效修订和校方记录；学校官网签发的当批公告、带可信时间和名单版的归档公告及有效异议处理记录；学院公示 M014 不是同一材料的合法替代；F002/F008/F009/F032/F033/F034/F044；SRC-015/001/013；发布者＋学校层级＋公示工作日历＋名单哈希＋更改/异议版；P2/P3 NOT_APPLICABLE，缺校级源 SOURCE_UNAVAILABLE，公开时不可带家庭困难详述",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      maxCount: Number.MAX_SAFE_INTEGER,
      "requiredElements": [
        "校级全校公示原件",
        "签发方、对象、适用时点与来源版本（如适用）"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rule-review",
      "name": "审核规则逐条清单",
      "description": "逐条映射原件第 08 节规则；只生成本地事实核验、证据差异与人工复核建议。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "R001 · 国励志当批次规则可用于本学生学院/学年",
          "requirement": "原件 R001：P0 国励志当批次规则可用于本学生学院/学年；SRC-001/004—006/012/013/015/016；F008/F009/F039；M001；逐文号、机构、适用学段/院系/批次/发布日期；本批次 A/B 优先，2025 仅历史样例；省级2026文号原文未取；PASS_FACT 表示已确认配置适用范围，供后续事实比对；批次尚未启动 NOT_APPLICABLE；版本明确不适用则登记适用冲突交校方；未取 2026 校方/省级原件 POLICY_UNCONFIRMED；公告打不开 SOURCE_UNAVAILABLE；资助中心补取并授权配置。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "R002 · 学号、姓名、本人与案卷绑定",
          "requirement": "原件 R002：P2 学号、姓名、本人与案卷绑定；SRC-004/006/015；F001/F002/F003/F029/F038；M002/M003；核学生可信登录与学校学籍 A 对本人表 B/C，按学号＋生效姓名，不用姓名单匹配；PASS_FACT 仅身份事实匹配；可信不同学生/学号冲突 CONFLICT，暂停材料归属；非本案动作 NOT_APPLICABLE；学籍源断 SOURCE_UNAVAILABLE、表不可读 UNREADABLE、本人缺申请 NEEDS_MATERIAL；学籍单位/本人分别处理。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "R003 · 中华人民共和国国籍前置",
          "requirement": "原件 R003：P2 中华人民共和国国籍前置；SRC-015 第2条；F002/F042；M003；有权身份源必要字段 A/B，对应申请时点；不把身份证原图设常规材料；PASS_FACT 仅核国籍符合上位条件；已由有权源确认为不符合，记录事实并 NEEDS_HUMAN_DECISION 送学校；无申报 NOT_APPLICABLE；国籍未见权威摘要 SOURCE_UNAVAILABLE，个人自述不充分；学校学籍/身份主管核证，避免隐私扩采。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "R004 · 全日制本专科（含第二学士）及招生计划内归属",
          "requirement": "原件 R004：P2 全日制本专科（含第二学士）及招生计划内归属；SRC-015 第1条、SRC-004/005；F004/F005；M003；查正式学段、学制、学习形式 A，时间锁参评学年；研究生、教职工不是分支；PASS_FACT 属该项目身份事实；有权源显示研究生/非全日制等，记不符事实并交学校 NEEDS_HUMAN_DECISION；无申请 NOT_APPLICABLE；第二学士/复杂学制无权威分类 SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED；教务确认，不能凭文本标签猜测。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "R005 · 二年级及以上及参评年级",
          "requirement": "原件 R005：P2 二年级及以上及参评年级；SRC-015 第3条、SRC-005；F006/F027；M003/M011；以有效学籍及学业阶段 A 判断“二年级起”，复学/转入不能直接用 2026−入学年；PASS_FACT 年级条件获事实支持；正式记录确定仍未达二年级，记不符事实给学校 NEEDS_HUMAN_DECISION；异动与编入年级不清 POLICY_UNCONFIRMED 或 SOURCE_UNAVAILABLE；教务出具适用说明。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "R006 · 参评期间在籍身份及状态有效",
          "requirement": "原件 R006：P2 参评期间在籍身份及状态有效；SRC-004—006/015；F005/F008/F027；M003/M011；参评学年内与申请时状态两个时点分开，核休复学等 A；PASS_FACT 对适用时点状态匹配；失去在籍或不一致记录真实状态并送有权人，不自动出拒绝函；无申请 NOT_APPLICABLE；缺效力起止 SOURCE_UNAVAILABLE/CONFLICT；学籍部门判历史时段。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "R007 · 学院、专业、排名群组受理归属",
          "requirement": "原件 R007：P2 学院、专业、排名群组受理归属；SRC-004—006/015；F007/F010/F020；M001/M003/M021；参评年与当前院系按生效时点区分，确认专业/年级池、学院跨院转入后的权限；PASS_FACT 当前归口清楚；正式名册冲突 CONFLICT，不得由 UI 改学院；未到归口流程 NOT_APPLICABLE；无当期群组口径 POLICY_UNCONFIRMED；学院与教务联合定归口。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "R008 · 本人申请提交、可接受表版与本人确认",
          "requirement": "原件 R008：P2 本人申请提交、可接受表版与本人确认；SRC-004/006/015 第4条及样表；F011/F012/F028/F029；M001/M002；核四川系统受理凭证/被认可纸表、提交时间、本人栏；样表院系/学校意见是以后签；PASS_FACT 仅本人申请已合规提交；申请尚未提交 NEEDS_MATERIAL；表属他人 CONFLICT；未开放报名 NOT_APPLICABLE；当期表版不知 POLICY_UNCONFIRMED；文件乱码 UNREADABLE；本人/学院受理岗处理。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "R009 · 提交截止时间与允许例外",
          "requirement": "原件 R009：P2 提交截止时间与允许例外；SRC-006/013/015/016 第4条；F011/F039；M001/M002；310 附2曾写 9/30，2025 CDUT 学院 10 月窗口存在；比较需当前具权限的省校解释/通知版本；有当期一致来源且时间内 PASS_FACT；时间确定在期限之外仅记“逾期事实”并 NEEDS_HUMAN_DECISION，不自动驳回；不申请 NOT_APPLICABLE；国家/学院时间不一致或 2026 缺通知 POLICY_UNCONFIRMED；资助中心提供衔接授权。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "R010 · 对应参评学年家庭经济困难正式认定",
          "requirement": "原件 R010：P2 对应参评学年家庭经济困难正式认定；SRC-002/004—006/015 第2条；F002/F008/F013/F014；M006；学号、学年、认定有效期和撤销版 A；学生自述不能变认定；PASS_FACT 仅已有有效认定事实；认定库确定无有效记录：标事实待有权认定处理，NEEDS_HUMAN_DECISION，不由本模板重新认定；认定源断 SOURCE_UNAVAILABLE、时效未知 POLICY_UNCONFIRMED、学年错 CONFLICT；转原认定机构。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "R011 · 课程成绩范围及不及格情况",
          "requirement": "原件 R011：P2 课程成绩范围及不及格情况；SRC-004/005/015 第2条；F008/F015/F021；M004/M021；原教务 A 同学年/课程范围；2025 某院无不及格要求不得默认 2026；PASS_FACT 表示教务课程事实读对，只有核准当期条件才比较；发现学业客观不达当期条文时记录事实并送学院 NEEDS_HUMAN_DECISION；不适用课程分支 NOT_APPLICABLE；课程范围/阈值缺 POLICY_UNCONFIRMED；教务记录失联 SOURCE_UNAVAILABLE；学院/教务补口径。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "R012 · 学业名次和人数分母可靠且同群体",
          "requirement": "原件 R012：P2 学业名次和人数分母可靠且同群体；SRC-004/005；F010/F016/F017/F020/F021；M004/M021；核 0<名次≤人数、专业/年级/参评年/发布版同一 A；不从 OCR 猜分母；PASS_FACT 为可比较名次事实；不同群组或分母/名次矛盾 CONFLICT，不自作排名；分母源断 SOURCE_UNAVAILABLE、无法读 UNREADABLE；教务正式重发。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "R013 · 综合测评名次和人数分母可靠",
          "requirement": "原件 R013：P2 综合测评名次和人数分母可靠；SRC-004/005；F010/F018/F019/F020/F021；M005/M021；经授权的 S03-T01 或学院正式综测 A，要求年度/口径与申报一致；PASS_FACT 为综测排名可靠；名次越界或错人错组 CONFLICT；综测未要求时 NOT_APPLICABLE；综测尚未签发 NEEDS_MATERIAL（由校方产生）或源失联 SOURCE_UNAVAILABLE；综测有权单位处理。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "R014 · 成绩／综测竞争阈值适用与比较",
          "requirement": "原件 R014：P2 成绩／综测竞争阈值适用与比较；SRC-001/004/005/013；F015—F021/F039；M001/M004/M005/M021；仅当期该学院获授权条件；2025 传播学院 10%/30% 历史示例；按规定名次与群组判；当前条文、记录完备且达事实门槛 PASS_FACT；条件不满足时保留分数事实、是否择优 NEEDS_HUMAN_DECISION；本批不使用某项排名 NOT_APPLICABLE；无 2026 院系阈值 POLICY_UNCONFIRMED；有权学院核条件，不擅定比例。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "R015 · /P3 排名例外表彰的类型、年限、真实性",
          "requirement": "原件 R015：P2/P3 排名例外表彰的类型、年限、真实性；SRC-004/013；F022/F023/F029/F039；M001/M009；仅在本批次允许且 R014 未达通常门槛时触发；颁发者、学年与获奖人 A/B 核证；对触发例外的表彰事实 PASS_FACT，例外是否批准仍 NEEDS_HUMAN_DECISION；无例外或常规已达标 NOT_APPLICABLE；表彰属他人 CONFLICT；证书缺 NEEDS_MATERIAL，不可读 UNREADABLE，2026 例外资格 POLICY_UNCONFIRMED；学院和颁发机构各管其证据。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "R016 · 处分/法律处罚客观有效状态与参评期间",
          "requirement": "原件 R016：P2 处分/法律处罚客观有效状态与参评期间；SRC-004/005/015 第2条；F008/F039/F040；M001/M022；仅授权读取有效/撤销/解除摘要 A，分别判断处分生效时点与当前适用条文；PASS_FACT 表示可核客观纪录与当期规则无事实冲突；有有效不利事实须 NEEDS_HUMAN_DECISION 交学校，不由模型给品行判定；未触发纪律条件 NOT_APPLICABLE；纪律来源受限 SOURCE_UNAVAILABLE、跨学院政策差 POLICY_UNCONFIRMED、撤销版相矛盾 CONFLICT；学工主管部门处理。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "R017 · 品行、诚实守信与生活俭朴的正式综合评议",
          "requirement": "原件 R017：P3 品行、诚实守信与生活俭朴的正式综合评议；SRC-004/005/015 第2条；F012/F038/F041；M002/M012/M022；本人承诺 C 与学院经可信 Actor 的正式意见 A/B 分层；无处分≠道德合格；有效院评已形成，PASS_FACT 仅证明“存在有权评议及结论版”，择优事实仍交人工；P2 尚未进入院评 NOT_APPLICABLE；未获授权签发不能判通过；学院意见待作 NEEDS_HUMAN_DECISION，假签名 CONFLICT，权限源失联 SOURCE_UNAVAILABLE；院评有权人处理。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "R018 · P5 同一参评学年国奖与国励志互斥",
          "requirement": "原件 R018：P2—P5 同一参评学年国奖与国励志互斥；SRC-004/005/015 第3条；F002/F008/F024；M008；只对正式生效的 S03-T02 国奖获奖结果 A；分开“正在申请、拟推荐、正式获奖、其他学年”；核无同学年正式国奖获奖 PASS_FACT；国奖只在申请/拟推荐阶段≠互斥事实；已正式获同学年国奖，保留互斥事实并 NEEDS_HUMAN_DECISION 交获奖审批有权机关，不能本模板撤另一奖；没国奖线索为按政策配置查验；正式源未接入 SOURCE_UNAVAILABLE；年别不一致 CONFLICT；原国奖机关查明。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "R019 · P5 国家助学金与国励志合法并存",
          "requirement": "原件 R019：P2—P5 国家助学金与国励志合法并存；SRC-004/005/015 第3条；F002/F008/F025；M007；对助学金正式决定或申请状态 A，年度可不同；兼得不涉及本模板对助学金的审批；PASS_FACT 表示并存不构成互斥；无助学金申请 NOT_APPLICABLE，绝不因无受助记录退国励志申请；助学金源断 SOURCE_UNAVAILABLE 只影响交叉信息；原助学金机构查询。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "R020 · /P3 特殊培养项目与指定学费全免排除",
          "requirement": "原件 R020：P2/P3 特殊培养项目与指定学费全免排除；SRC-004—006/013/015 第3条公费师范特例；F004/F008/F026/F039；M001/M010；2025 校本涉及特定定向免学费项目；不得推广至全部助学、军役资助、普通减免；查正式培养+待遇 A；核明确项目身份和本批适用性 PASS_FACT（仅事实）；仅一般减免不触发排除 NOT_APPLICABLE；确属排除项目由有权人处理 NEEDS_HUMAN_DECISION；当期排除列表缺 POLICY_UNCONFIRMED；培养类身份来源断 SOURCE_UNAVAILABLE；教务/资助中心定项目。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "R021 · /P3 学籍异动引起年级、归口、群组的重核",
          "requirement": "原件 R021：P2/P3 学籍异动引起年级、归口、群组的重核；SRC-001/004—006/013；F004—F007/F010/F020/F027；M003/M004/M005/M011/M021；只在权威异动 A 出现时触发，按生效区间确认旧/新院系受理、排名年度；异动合法且各归口明确 PASS_FACT，配发新的依赖重核任务；无异动 NOT_APPLICABLE；新旧归口有冲突 CONFLICT；学籍例外认定 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；教务＋涉及学院联合处理。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "R022 · P6 材料归属、签发版本、替换链的可信性",
          "requirement": "原件 R022：P2—P6 材料归属、签发版本、替换链的可信性；SRC-004—006/015（追溯原则）；F002/F008/F021/F029/F036；M002/M004/M005/M006/M018；issuer+subject+awardYear+sourceVersion+effectiveAt；新 A 正式更正才撤当前旧引用，C 后传不可覆 A；PASS_FACT 证明引用版有效、归属同人，触发受影响 R 重演；同时有效 A/B 相冲 CONFLICT；未发生更新 NOT_APPLICABLE（补件分支）；版本标识缺 NEEDS_MATERIAL（持有人）、源断 SOURCE_UNAVAILABLE；原签发部门核版本，审计保存旧结论。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "R023 · 辅导员/学院初评和授权签发",
          "requirement": "原件 R023：P3 辅导员/学院初评和授权签发；SRC-005/006/015 第9条；F030/F031/F038/F041；M012；检学院当期评审组授权 A、意见版与名单学生、学年；模型意见不是评审意见；PASS_FACT 只确认学院有效初审记录存在，择优仍人工；P2 尚未开展 NOT_APPLICABLE；无权签发 CONFLICT/NEEDS_HUMAN_DECISION；正式院审未形成 NEEDS_HUMAN_DECISION，授权源断 SOURCE_UNAVAILABLE；学院工作组处理。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "R024 · 学院名额与拟推荐名单一致",
          "requirement": "原件 R024：P3 学院名额与拟推荐名单一致；SRC-005/007/015 第5—9条；F009/F010/F030/F039；M001/M013；比学院当批正式配额、学生群组、名单版及重复条目；不得由排名生成获奖名单；PASS_FACT 表示名额/推荐版数据一致，不是获奖；未到推荐阶段 NOT_APPLICABLE；重复占额/归口不同 CONFLICT，交学院复核；当批配额源断 SOURCE_UNAVAILABLE 或政策缺 POLICY_UNCONFIRMED；学院/学校资助中心补权威名额。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "R025 · 学院/年级公示层级、窗口及名单一致",
          "requirement": "原件 R025：P4 学院/年级公示层级、窗口及名单一致；SRC-004—007；F030/F032/F029；M013/M014；区分年级1天、院级3工作日/实际5天等 2025 证据，校级另在 R027；核同名单版本 A/B；PASS_FACT 只证明本层公示事实；P2/P3 公示尚未开始 NOT_APPLICABLE；名单修改未跟踪 CONFLICT；当期学院阶段/公示天数未知 POLICY_UNCONFIRMED，公告源断 SOURCE_UNAVAILABLE；学院发布部门核。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "R026 · 学校评审领导小组审议通过及校级建议名单",
          "requirement": "原件 R026：P5 学校评审领导小组审议通过及校级建议名单；SRC-001/009/013/015 第9—10条；F034/F038；M017；逐学校领导小组真实组织授权、讨论决议、名单版本与受理号，不把学院公示替代；PASS_FACT 表示校级研究通过的提名事实，仍非省级批准；仅学院推荐、尚未进入 P5 NOT_APPLICABLE；伪签发 CONFLICT/NEEDS_HUMAN_DECISION；CDUT 具体签批身份未知 POLICY_UNCONFIRMED 或正式记录源断 SOURCE_UNAVAILABLE；校资助中心核。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "R027 · 学校正式校内公示不少于5工作日及无未决有效异议",
          "requirement": "原件 R027：P5 学校正式校内公示不少于5工作日及无未决有效异议；SRC-015 第10条、SRC-001/013；F032/F033/F044；M017/M024/M015/M016；校级发布机构和名单版、实际工作日、公告窗口、变更再公示；学院 M014 不替代，现行修订待核；PASS_FACT 仅证公示程序事实满足现已核上位下限；P2/P4 未到阶段 NOT_APPLICABLE；公示不足或有未处置异议 NEEDS_HUMAN_DECISION，并保留事实偏差；校内公示缺正式记录 SOURCE_UNAVAILABLE，新规则解释 POLICY_UNCONFIRMED；学校公布/纪检与资助有权者处理。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "R028 · /P5 有效异议受理与答复版本",
          "requirement": "原件 R028：P4/P5 有效异议受理与答复版本；SRC-001/005/007/013/015；F002/F029/F033/F038；M014/M015/M016/M024；对公示名单版本、提出人授权、受理时间、争议事实与答复签发人逐项比；不可由模型评断理由；PASS_FACT 只证有权办理记录与被争议事实已更新，不等于复核维持；无异议 NOT_APPLICABLE；回复与争议版冲突 CONFLICT；已受理待审 NEEDS_HUMAN_DECISION，期限/代理规则 POLICY_UNCONFIRMED，扫描不清 UNREADABLE；真实受理机关办理。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "R029 · /P6 学校上报与省级/有权主管部门批复一致",
          "requirement": "原件 R029：P5/P6 学校上报与省级/有权主管部门批复一致；SRC-015 第10条、SRC-001/013/016；F008/F009/F034/F038/F043；M017/M023；比学校报送名单版、批复号、签发单位、批准年别和修改名单；9/30/11月上位时间节点仍需当期省校解释；PASS_FACT 只在真实批复内容证明对象时记录批准事实；只有有权原机关决定才具法定效力；未到上级阶段 NOT_APPLICABLE；明确批复不同意/变更时输出事实并送学校 NEEDS_HUMAN_DECISION；批复源断 SOURCE_UNAVAILABLE、当年上报路径 POLICY_UNCONFIRMED、版本不同 CONFLICT；省级主管与学校核回。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "R030 · 资金实际支付与有权获奖批复对应",
          "requirement": "原件 R030：P6 资金实际支付与有权获奖批复对应；SRC-008/011/015 第11条；F002/F008/F034/F037/F043；M017/M020/M023；核学校财务支付 A 对唯一批准结果+批次；2024 发放 6000 不能反推 2026 单据；2024 金额变更见 SRC-011；PASS_FACT 只说明财务核对相符；P2—P5 尚无正式批复 NOT_APPLICABLE；金额、学年异常 CONFLICT 待财务复核；财务源断 SOURCE_UNAVAILABLE、支付未执行交人工待办；不以学生截图判已批准。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "R031 · P5 补件/更正的合法来源和定向重审触发",
          "requirement": "原件 R031：P2—P5 补件/更正的合法来源和定向重审触发；SRC-004—006/015；F021/F029/F036/F038；M018 及受影响原槽；核发起人可更正其本人内容、官方成绩须原签发机关改；旧版引用标失效，按依赖图重跑；PASS_FACT 表示新引用合法及重审任务正确排入，不自动批准原申请；无修改 NOT_APPLICABLE；改坏学号/签发者 CONFLICT，停止新版本采信；补件记录缺 NEEDS_MATERIAL，新件不可读 UNREADABLE，开放补件期限 POLICY_UNCONFIRMED；原证据持有人与院审接办。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "R032 · P5 撤回请求与撤回生效有权分离",
          "requirement": "原件 R032：P2—P5 撤回请求与撤回生效有权分离；SRC-001/013；F002/F035/F038；M002/M019；验本人可信请求+所属案卷+批次；是否可撤回及谁批准需学校制度；“申请撤回”不是“已撤回”；PASS_FACT 只确认本人请求已收到，生效须独立正式办理动作；无撤回 NOT_APPLICABLE；疑似冒名 CONFLICT；有权批准/期限不明 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；学校受理机关定生效与重提方式。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "R033 · P5 组织权限与签发防伪核证",
          "requirement": "原件 R033：P3—P5 组织权限与签发防伪核证；SRC-001/005/009/013/015；F031/F034/F038/F043；M012/M016/M017/M019/M023/M024；Host/Main 从独立可信组织身份源验岗位、期限、动作权限；Renderer actor/role 绝不可采信；OCR 签章仅索引；PASS_FACT 仅操作授权事实确证，不代替政策决策；仅普通事实预审无签发动作 NOT_APPLICABLE；伪造身份 CONFLICT 并禁签；认证源或授权表不可得 SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；学校管理与安全部门处置。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "R034 · P5 重复申报/同人同学年同奖项案卷交叉",
          "requirement": "原件 R034：P1—P5 重复申报/同人同学年同奖项案卷交叉；SRC-004—006/015（评审对象）；F001/F002/F008/F009/F029；M002/M003/M017；唯一键含真实学号、学年、奖项、当批次，处理重新提交/撤回后重提的合法版本，不以同名去重；PASS_FACT 说明归档/去重关系清楚，仍待当期重提规则；未有重复记录 NOT_APPLICABLE；不同人被合案 CONFLICT；重提许可未知 POLICY_UNCONFIRMED；受理人与案卷管理员核关联，不创造第二项权利决定。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r035",
          "title": "R035 · 全阶段 后续签章和决定仅在阶段到达时要求",
          "requirement": "原件 R035：全阶段 后续签章和决定仅在阶段到达时要求；SRC-004—008/015 样表/第10—11条；F028/F030—F034/F037/F043/F044；M002/M012—M020/M023/M024；以当次阶段 P2/P3/P4/P5/P6 门控；P2 仅本人申报，院校签章与支付是未来记录；PASS_FACT 表示正确不强迫提前提供，后续材料标 NOT_APPLICABLE；业务未触发的后续事项 NOT_APPLICABLE；强制申请人补未来签章是流程设计缺陷，送产品维护；当前应由学校产生却未产生 NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE，不是学生 NEEDS_MATERIAL；受理/流程 Owner 修订。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r036",
          "title": "R036 · 全阶段 证据可读性、来源在线和同版关联的分级检测",
          "requirement": "原件 R036：全阶段 证据可读性、来源在线和同版关联的分级检测；SRC-001—SRC-016；F001/F002/F029/F036；M001—M024（仅本次激活者）；先判阶段→来源是否授权/可用→文件是否可解析→签发/人员/学年是否一致；不拿 OCR 可信度当政策结论；PASS_FACT 仅技术上可读、来源可核且关联正确；非激活材料 NOT_APPLICABLE；主体不符 CONFLICT；申请人缺件 NEEDS_MATERIAL、扫描不可读 UNREADABLE、权威来源不可达 SOURCE_UNAVAILABLE、政策未证 POLICY_UNCONFIRMED；分别发给原责任方。若校本规则、当前批次、证据效力或权限无法确认，必须转人工复核；本条仅生成本地审阅建议，不产生正式通过/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "p0",
      "name": "公告与批次配置",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p1"
    },
    {
      "id": "p1",
      "name": "前置事实形成",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p2"
    },
    {
      "id": "p2",
      "name": "学生申报",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p3"
    },
    {
      "id": "p3",
      "name": "辅导员评议、学院初审",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p4"
    },
    {
      "id": "p4",
      "name": "年级／院内初步公示、异议处理",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p5"
    },
    {
      "id": "p5",
      "name": "校级领导小组审议及全校公示",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p6"
    },
    {
      "id": "p6",
      "name": "逐级上报、主管部门批复",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p7"
    },
    {
      "id": "p7",
      "name": "后续核对与资金发放（仅只读核对；不执行校方写回）",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "item-feedback",
      "kind": "item-feedback",
      "audience": "student"
    },
    {
      "id": "human-review-todo",
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

export const r02Metadata: R02Metadata = {
  "templateId": "S03-T03",
  "name": "国家励志奖学金申报审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S03-T03.md",
  "sourceDocumentSha256": "2a0975ee82cfbdfb892bad3057f0dc2bb54a9d2ca07a5b93f6ba3fd76f325944",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-22",
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
    "SRC-016"
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
    "F042",
    "F043",
    "F044"
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
    "M022",
    "M023",
    "M024"
  ],
  "criteria": [
    {
      "sectionId": "rule-review",
      "criterionId": "r001",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F008",
        "F009",
        "F039"
      ],
      "materialIds": [
        "M001"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r002",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F001",
        "F002",
        "F003",
        "F029",
        "F038"
      ],
      "materialIds": [
        "M002",
        "M003"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r003",
      "sourceIds": [
        "SRC-015"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F002",
        "F042"
      ],
      "materialIds": [
        "M003"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r004",
      "sourceIds": [
        "SRC-015",
        "SRC-004"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F004",
        "F005"
      ],
      "materialIds": [
        "M003"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r005",
      "sourceIds": [
        "SRC-015",
        "SRC-005"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F006",
        "F027"
      ],
      "materialIds": [
        "M003",
        "M011"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r006",
      "sourceIds": [
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F005",
        "F008",
        "F027"
      ],
      "materialIds": [
        "M003",
        "M011"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r007",
      "sourceIds": [
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F007",
        "F010",
        "F020"
      ],
      "materialIds": [
        "M001",
        "M003",
        "M021"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r008",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F011",
        "F012",
        "F028",
        "F029"
      ],
      "materialIds": [
        "M001",
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r009",
      "sourceIds": [
        "SRC-006"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F011",
        "F039"
      ],
      "materialIds": [
        "M001",
        "M002"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r010",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F002",
        "F008",
        "F013",
        "F014"
      ],
      "materialIds": [
        "M006"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r011",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F008",
        "F015",
        "F021"
      ],
      "materialIds": [
        "M004",
        "M021"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r012",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F010",
        "F016",
        "F017",
        "F020",
        "F021"
      ],
      "materialIds": [
        "M004",
        "M021"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r013",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F010",
        "F018",
        "F019",
        "F020",
        "F021"
      ],
      "materialIds": [
        "M005",
        "M021"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r014",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F015",
        "F016",
        "F017",
        "F018",
        "F019",
        "F020",
        "F021",
        "F039"
      ],
      "materialIds": [
        "M001",
        "M004",
        "M005",
        "M021"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r015",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F022",
        "F023",
        "F029",
        "F039"
      ],
      "materialIds": [
        "M001",
        "M009"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r016",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F008",
        "F039",
        "F040"
      ],
      "materialIds": [
        "M001",
        "M022"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r017",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F012",
        "F038",
        "F041"
      ],
      "materialIds": [
        "M002",
        "M012",
        "M022"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r018",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F002",
        "F008",
        "F024"
      ],
      "materialIds": [
        "M008"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r019",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F002",
        "F008",
        "F025"
      ],
      "materialIds": [
        "M007"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r020",
      "sourceIds": [
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F004",
        "F008",
        "F026",
        "F039"
      ],
      "materialIds": [
        "M001",
        "M010"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r021",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F004",
        "F005",
        "F006",
        "F007",
        "F010",
        "F020",
        "F027"
      ],
      "materialIds": [
        "M003",
        "M004",
        "M005",
        "M011",
        "M021"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r022",
      "sourceIds": [
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F002",
        "F008",
        "F021",
        "F029",
        "F036"
      ],
      "materialIds": [
        "M002",
        "M004",
        "M005",
        "M006",
        "M018"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r023",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F030",
        "F031",
        "F038",
        "F041"
      ],
      "materialIds": [
        "M012"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r024",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F009",
        "F010",
        "F030",
        "F039"
      ],
      "materialIds": [
        "M001",
        "M013"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r025",
      "sourceIds": [
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F030",
        "F032",
        "F029"
      ],
      "materialIds": [
        "M013",
        "M014"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r026",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F034",
        "F038"
      ],
      "materialIds": [
        "M017"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r027",
      "sourceIds": [
        "SRC-015",
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F032",
        "F033",
        "F044"
      ],
      "materialIds": [
        "M017",
        "M024",
        "M015",
        "M016",
        "M014"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r028",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F002",
        "F029",
        "F033",
        "F038"
      ],
      "materialIds": [
        "M014",
        "M015",
        "M016",
        "M024"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r029",
      "sourceIds": [
        "SRC-015",
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F008",
        "F009",
        "F034",
        "F038",
        "F043"
      ],
      "materialIds": [
        "M017",
        "M023"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r030",
      "sourceIds": [
        "SRC-008",
        "SRC-011"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F002",
        "F008",
        "F034",
        "F037",
        "F043"
      ],
      "materialIds": [
        "M017",
        "M020",
        "M023"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r031",
      "sourceIds": [
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F021",
        "F029",
        "F036",
        "F038"
      ],
      "materialIds": [
        "M018"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r032",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F002",
        "F035",
        "F038"
      ],
      "materialIds": [
        "M002",
        "M019"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r033",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F031",
        "F034",
        "F038",
        "F043"
      ],
      "materialIds": [
        "M012",
        "M016",
        "M017",
        "M019",
        "M023",
        "M024"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r034",
      "sourceIds": [
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F001",
        "F002",
        "F008",
        "F009",
        "F029"
      ],
      "materialIds": [
        "M002",
        "M003",
        "M017"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r035",
      "sourceIds": [
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F030",
        "F031",
        "F032",
        "F033",
        "F034",
        "F028",
        "F037",
        "F043",
        "F044"
      ],
      "materialIds": [
        "M012",
        "M013",
        "M014",
        "M015",
        "M016",
        "M017",
        "M018",
        "M019",
        "M020",
        "M002",
        "M023",
        "M024"
      ]
    },
    {
      "sectionId": "rule-review",
      "criterionId": "r036",
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
        "SRC-016"
      ],
      "evidenceStatus": "unconfirmed",
      "fieldIds": [
        "F001",
        "F002",
        "F029",
        "F036"
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
        "M022",
        "M023",
        "M024"
      ]
    }
  ]
}

export default templateVersion
