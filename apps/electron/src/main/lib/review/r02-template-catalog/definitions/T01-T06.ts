import type { TemplateVersion } from "@profer/shared"

export const T01T06_TEMPLATE: TemplateVersion = {
  "templateId": "T01-T06",
  "version": 1,
  "schemaVersion": 2,
  "name": "课程考核方式、考核方案调整审核",
  "description": "本地研究模板 · 非校方正式模板。课程考核方式、考核方案调整审核的材料解析、事实核对和审阅建议用途；政策适用性、授权、期限和最终办理结果须由有权人员人工确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；政策证据状态为 PARTIAL，任何未确认规则均不得自动产生正式通过或拒绝。",
  "objectType": "custom",
  "displayName": {
    "template": "T01-T06 · 课程考核方式、考核方案调整审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · caseId（ID）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：ProposalCase；P0+；官/项目受控案卷。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F001 caseId（ID）；ProposalCase；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F002",
      "label": "F002 · scenarioCode（枚举 A—I）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：ProposalCase；P0+；混。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F002 scenarioCode（枚举 A—I）；ProposalCase；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F003",
      "label": "F003 · stage（枚举 P0—P8）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：ProposalCase；P0+；官/受控案卷。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F003 stage（枚举 P0—P8）；ProposalCase；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F004",
      "label": "F004 · applicantPersonKey（受控 ID）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ActorGrant；P0+；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F004 applicantPersonKey（受控 ID）；ActorGrant；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F005",
      "label": "F005 · applicantRoleAndTrust（枚举＋验证结果）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ActorGrant；P0+；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F005 applicantRoleAndTrust（枚举＋验证结果）；ActorGrant；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F006",
      "label": "F006 · courseOwnerPersonKey（受控 ID）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ActorGrant；P0+；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F006 courseOwnerPersonKey（受控 ID）；ActorGrant；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F007",
      "label": "F007 · delegationGrant（权限范围/期限/引用）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ActorGrant；代理触发 P0+；官/混。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F007 delegationGrant（权限范围/期限/引用）；ActorGrant；代理触发 P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F008",
      "label": "F008 · educationSegment（本科/研究生/其他枚举）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：CourseOffering；P0+；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F008 educationSegment（本科/研究生/其他枚举）；CourseOffering；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F009",
      "label": "F009 · courseCode（字符串）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：CourseOffering；P0+；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F009 courseCode（字符串）；CourseOffering；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F010",
      "label": "F010 · courseName（字符串）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：CourseOffering；P0+；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F010 courseName（字符串）；CourseOffering；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F011",
      "label": "F011 · courseCategory（通识/通修/专业/跨院/研究生等枚举）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：CourseOffering；P0+；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F011 courseCategory（通识/通修/专业/跨院/研究生等枚举）；CourseOffering；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F012",
      "label": "F012 · offeringUnitId（机构 ID）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：CourseOffering；P0+；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F012 offeringUnitId（机构 ID）；CourseOffering；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F013",
      "label": "F013 · teachingOrRecipientUnits（机构 ID[]）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：CourseOffering；跨院或多单位触发 P1；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F013 teachingOrRecipientUnits（机构 ID[]）；CourseOffering；跨院或多单位触发 P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F014",
      "label": "F014 · academicYearTerm（标准学期）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：CourseOffering；P0+；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F014 academicYearTerm（标准学期）；CourseOffering；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F015",
      "label": "F015 · offeringCycle（周期/起止）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：CourseOffering；P0+；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F015 offeringCycle（周期/起止）；CourseOffering；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F016",
      "label": "F016 · targetTeachingClassIds（ID[]）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：CourseOffering；P1+；官/混。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F016 targetTeachingClassIds（ID[]）；CourseOffering；P1+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F017",
      "label": "F017 · affectedStudentCoverage（数量/受控名单引用）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：CourseOffering；P1；P6 再核；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F017 affectedStudentCoverage（数量/受控名单引用）；CourseOffering；P1；P6 再核。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F018",
      "label": "F018 · currentSyllabusRef（版本 ID＋指纹）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：SyllabusRevision；P0+；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F018 currentSyllabusRef（版本 ID＋指纹）；SyllabusRevision；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F019",
      "label": "F019 · currentSyllabusApplicability（学期/班/生效区间）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：SyllabusRevision；P1+；官/混。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F019 currentSyllabusApplicability（学期/班/生效区间）；SyllabusRevision；P1+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F020",
      "label": "F020 · currentCourseDescriptionRef（版本 ID＋内容）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：SyllabusRevision；P1+；官/混。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F020 currentCourseDescriptionRef（版本 ID＋内容）；SyllabusRevision；P1+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F021",
      "label": "F021 · proposedSyllabusRef（版本 ID＋指纹）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：SyllabusRevision；大纲变化 P1；申。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F021 proposedSyllabusRef（版本 ID＋指纹）；SyllabusRevision；大纲变化 P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F022",
      "label": "F022 · changeDimensions（形式/权重/评价标准多选）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：AssessmentDelta；P0+；申/混。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F022 changeDimensions（形式/权重/评价标准多选）；AssessmentDelta；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F023",
      "label": "F023 · oldAssessmentMethod（结构化文字）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：AssessmentDelta；方式变化 P1；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F023 oldAssessmentMethod（结构化文字）；AssessmentDelta；方式变化 P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F024",
      "label": "F024 · newAssessmentMethod（结构化文字）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：AssessmentDelta；方式变化 P1；申。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F024 newAssessmentMethod（结构化文字）；AssessmentDelta；方式变化 P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F025",
      "label": "F025 · oldWeightComponents（带单位的比例集合）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：AssessmentDelta；权重变化 P1；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F025 oldWeightComponents（带单位的比例集合）；AssessmentDelta；权重变化 P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F026",
      "label": "F026 · newWeightComponents（带单位的比例集合）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：AssessmentDelta；权重变化 P1；申。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F026 newWeightComponents（带单位的比例集合）；AssessmentDelta；权重变化 P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F027",
      "label": "F027 · rubricBeforeAfter（版本配对/差异）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：AssessmentDelta；标准变化 P1；混。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F027 rubricBeforeAfter（版本配对/差异）；AssessmentDelta；标准变化 P1。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F028",
      "label": "F028 · reasonAndImpact（文本＋结构化影响）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：ProposalCase；P1+；申；事实待核。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F028 reasonAndImpact（文本＋结构化影响）；ProposalCase；P1+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F029",
      "label": "F029 · requestedEffectiveTime（日期＋对象范围）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：ProposalCase；P1+；申。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F029 requestedEffectiveTime（日期＋对象范围）；ProposalCase；P1+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F030",
      "label": "F030 · courseProgressAtRequest（未开课/在课/考核前后）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：CourseOffering；P1+；官/混。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F030 courseProgressAtRequest（未开课/在课/考核前后）；CourseOffering；P1+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F031",
      "label": "F031 · noticePublicationStatus（未发布/已发布/未知）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：NoticeCoverage；已有发布时 P1，P6；官/混。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F031 noticePublicationStatus（未发布/已发布/未知）；NoticeCoverage；已有发布时 P1，P6。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F032",
      "label": "F032 · assessmentOrGradesState（未评/部分/已提交/未知）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：CourseOffering；当期变更/争议触发；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F032 assessmentOrGradesState（未评/部分/已提交/未知）；CourseOffering；当期变更/争议触发。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F033",
      "label": "F033 · grassrootsReviewEvent（审定事件指针）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：GovernanceEvent；P3 后；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F033 grassrootsReviewEvent（审定事件指针）；GovernanceEvent；P3 后。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F034",
      "label": "F034 · collegeConsentEvent（同意事件指针）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：GovernanceEvent；P4 后；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F034 collegeConsentEvent（同意事件指针）；GovernanceEvent；P4 后。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F035",
      "label": "F035 · teachingAffairsFilingEvent（备案事件指针）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：GovernanceEvent；P5 后；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F035 teachingAffairsFilingEvent（备案事件指针）；GovernanceEvent；P5 后。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F036",
      "label": "F036 · curriculumChangeDecision（相邻审批引用）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：GovernanceEvent；E 情形转办后；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F036 curriculumChangeDecision（相邻审批引用）；GovernanceEvent；E 情形转办后。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F037",
      "label": "F037 · specialExceptionDecision（例外决定指针）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：GovernanceEvent；D 情形有授权处理后；官/规。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F037 specialExceptionDecision（例外决定指针）；GovernanceEvent；D 情形有授权处理后。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F038",
      "label": "F038 · studentNoticeCoverageRef（送达摘要）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：NoticeCoverage；P6 后或 H 争议；官/混。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F038 studentNoticeCoverageRef（送达摘要）；NoticeCoverage；P6 后或 H 争议。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F039",
      "label": "F039 · adjacentDecisionRef（G/S/T 决定指针）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：GovernanceEvent；有关联事项时 P2+；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F039 adjacentDecisionRef（G/S/T 决定指针）；GovernanceEvent；有关联事项时 P2+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F040",
      "label": "F040 · evidenceVersionChain（证据归属/指纹映射）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：EvidenceLink；P0+；官/项目受控。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F040 evidenceVersionChain（证据归属/指纹映射）；EvidenceLink；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F041",
      "label": "F041 · withdrawalOrRecheckRequest（状态＋理由）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：IssueAndRecheck；P7 或请求出现时；申/官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F041 withdrawalOrRecheckRequest（状态＋理由）；IssueAndRecheck；P7 或请求出现时。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F042",
      "label": "F042 · policyVersionAndCurrentity（SRC[]＋状态）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿字段定义：ProposalCase；P0+；规。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F042 policyVersionAndCurrentity（SRC[]＋状态）；ProposalCase；P0+。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F043",
      "label": "F043 · authorizedRoleChain（机构/角色/事件权限）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：ActorGrant；P2—P5；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F043 authorizedRoleChain（机构/角色/事件权限）；ActorGrant；P2—P5。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F044",
      "label": "F044 · conflictAndDisposition（问题码[]＋处理结论）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：IssueAndRecheck；P2 起按需；项目事实＋人工决定。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F044 conflictAndDisposition（问题码[]＋处理结论）；IssueAndRecheck；P2 起按需。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F045",
      "label": "F045 · petitionerPersonAndClassRef（受控学生ID＋对应教学班引用）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：IssueAndRecheck；H/P7 由学生提出异议时；官/混。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F045 petitionerPersonAndClassRef（受控学生ID＋对应教学班引用）；IssueAndRecheck；H/P7 由学生提出异议时。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    },
    {
      "key": "F046",
      "label": "F046 · schoolAuthorizedEffectiveInterval（正式生效起止及适用班/版本）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿字段定义：GovernanceEvent；真实机关行为形成后 P5/P6/P8；官。按原稿缺失/冲突语义处理；不把提交人自述自动升级为校方权威事实。",
      "displayHint": "研究原稿字段/类型/阶段：F046 schoolAuthorizedEffectiveInterval（正式生效起止及适用班/版本）；GovernanceEvent；真实机关行为形成后 P5/P6/P8。当前按 text 保留原始表述，不推断数值阈值或枚举选项。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 身份及职工状态真实",
      "purpose": "学校身份中心/人事；受控登录断言、任职记录；P0 当前必需（系统取）；经学校人事/组织核验的实名在岗证明；F004/F005；SRC-001；人员唯一键＋认证时点；来源失联 SOURCEUNAVAILABLE，上传工牌截图不自动通过；不可读人工核。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "学校身份中心/人事；受控登录断言、任职记录",
        "P0 当前必需（系统取）",
        "经学校人事/组织核验的实名在岗证明；F004/F005；SRC-001"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 · 课程负责人/教师任务关系",
      "purpose": "教务处/开课学院；课程负责人台账、正式教学任务、排课记录；P0 当前必需（系统优先）；学院可回查的正式任课/任命文件；F005/F006/F043；SRC-001 第17、20、22条；课程/学期/单位；失联由学院核，不把教师自述作授权。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "教务处/开课学院；课程负责人台账、正式教学任务、排课记录",
        "P0 当前必需（系统优先）",
        "学院可回查的正式任课/任命文件；F005/F006/F043；SRC-001 第17、20、22条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "M003 · 受托经办身份与授权范围",
      "purpose": "课程负责人/学院授权机构；正式委托或经办配置；代理情形 P0 条件必需；可回查的组织内授权关系；F007/F043；SRC-001 角色框架，具体代理政策待核；人员、事项、期限；无授权只可保存草稿，不能代签/代提交有权事件。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "课程负责人/学院授权机构；正式委托或经办配置",
        "代理情形 P0 条件必需",
        "可回查的组织内授权关系；F007/F043；SRC-001 角色框架，具体代理政策待核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 · 课程与开课批次真值",
      "purpose": "教务处/研究生院/开课学院；课程主数据、培养层次、开课计划；P0 当前必需（系统取）；正式开课通知/校方盖章课程清单＋校方复核；F008—F017/F030；SRC-001、SRC-009；课程代码＋学期＋教学班；失联 SOURCEUNAVAILABLE，不硬要申请人再上传截图。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "教务处/研究生院/开课学院；课程主数据、培养层次、开课计划",
        "P0 当前必需（系统取）",
        "正式开课通知/校方盖章课程清单＋校方复核；F008—F017/F030；SRC-001、SRC-009"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M005",
      "name": "M005 · 当前有效教学大纲及评价依据",
      "purpose": "开课学院/教务处；有版本及备案关联的教学大纲；P0 当前必需（系统优先）；学院确认的有效大纲纸质/电子复本，需回查备案版本；F018/F019/F023/F025/F027；SRC-001 第10、11、22、30条；生效学期/教学班/课程版本；缺原版暂停比对，SOURCEUNAVAILABLE；遮挡页 UNREADABLE。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "开课学院/教务处；有版本及备案关联的教学大纲",
        "P0 当前必需（系统优先）",
        "学院确认的有效大纲纸质/电子复本，需回查备案版本；F018/F019/F023/F025/F027；SRC-001 第10、11、22、30条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M006",
      "name": "M006 · 课程说明中既有考核约定",
      "purpose": "开课学院/课程组；正式课程说明/教学日历评价节；P1 当前必需（系统优先）；学院确认已发课程说明、教务平台正式历史版；F020/F023/F025；SRC-001 第12、27条；发布版本/课程/班；版本无从证实列 CONFLICT/人工，不用教师私下 PPT 当正式说明。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "开课学院/课程组；正式课程说明/教学日历评价节",
        "P1 当前必需（系统优先）",
        "学院确认已发课程说明、教务平台正式历史版；F020/F023/F025；SRC-001 第12、27条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "M007 · 已公布考核方式、时间或相关安排",
      "purpose": "教务处/学院发布平台；课程公告/考试计划；D/H 及已公布情形 条件必需；含正式来源和发布时间的存档公告，经发布机关回查；F020/F030/F031；SRC-001 第29条、SRC-002、SRC-003；发布渠道、教学班、时点；缺源由主管机构补取；图片残缺 UNREADABLE。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "教务处/学院发布平台；课程公告/考试计划",
        "D/H 及已公布情形 条件必需",
        "含正式来源和发布时间的存档公告，经发布机关回查；F020/F030/F031；SRC-001 第29条、SRC-002、SRC-003"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M008",
      "name": "M008 · 调整提议与原因、目标范围",
      "purpose": "本人/授权经办人；可审阅申请说明或受控表单草稿；P1 当前必需；若学校有正式表式则以该表；未核到统一表前可用项目候选事实表，不能宣称被学校受理；F002/F022/F024/F028/F029；SRC-001/002；申报人＋课程＋目标班＋版本；缺描述 NEEDSMATERIAL，不可读补清晰稿。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "本人/授权经办人；可审阅申请说明或受控表单草稿",
        "P1 当前必需",
        "若学校有正式表式则以该表；未核到统一表前可用项目候选事实表，不能宣称被学校受理；F002/F022/F024/F028/F029；SRC-001/002"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "M009 · 拟修订大纲及逐项差异",
      "purpose": "课程负责人/课程组；大纲修订稿、章节对照；涉及大纲的 A/B/C/D 条件必需；可标注的修订版及原文页号；F021—F024/F027；SRC-001 第10、22条；旧版/新版成对指纹；缺稿补件，不拿后续 M014 代替修订稿。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "课程负责人/课程组；大纲修订稿、章节对照",
        "涉及大纲的 A/B/C/D 条件必需",
        "可标注的修订版及原文页号；F021—F024/F027；SRC-001 第10、22条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 · 考核构成新旧比例及算法",
      "purpose": "课程负责人；构成表/评分组成对照；权重变化 条件必需；拟大纲中明确同层级百分比与计算方式的章节；F025/F026；SRC-001 第30条；需关联原版、目标班、生效期；不清单位/分母 NEEDSMATERIAL，和不是 100% 只提示事实问题。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "课程负责人；构成表/评分组成对照",
        "权重变化 条件必需",
        "拟大纲中明确同层级百分比与计算方式的章节；F025/F026；SRC-001 第30条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 · 评价标准、量表和题型层级差异",
      "purpose": "课程组；评分标准/评价量表修订稿；评价标准或非卷面方式变化 条件必需；拟大纲评价章节或学院认可的考核方案附件；F027/F024；SRC-001 第10、27、33条；学院场景 SRC-005；保留前后对应页；不同适用对象触发 CONFLICT；专门试卷保密转 T01-T05。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "课程组；评分标准/评价量表修订稿",
        "评价标准或非卷面方式变化 条件必需",
        "拟大纲评价章节或学院认可的考核方案附件；F027/F024；SRC-001 第10、27、33条；学院场景 SRC-005"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 · 被影响教学班与范围",
      "purpose": "教务系统/学院；班级 ID、选课人数与受众摘要；多班/跨院/告知情形 条件必需（能查则系统取）；校方正式教学班清单、课程任务书核验件；F013/F016/F017；SRC-001、SRC-009；不默认上传学生个人名单；无法查校方源则 SOURCEUNAVAILABLE。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "教务系统/学院；班级 ID、选课人数与受众摘要",
        "多班/跨院/告知情形 条件必需（能查则系统取）",
        "校方正式教学班清单、课程任务书核验件；F013/F016/F017；SRC-001、SRC-009"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M013",
      "name": "M013 · 特殊原因、过程进度和影响说明",
      "purpose": "申请人及学院；事件说明、授课进度/突发情况证明；D/E 或明显影响学生权益 条件必需；可核实的教学运行事实记录，不接受笼统“情况特殊”替代理由；F028—F032；SRC-001、SRC-002、SRC-003；限当学期/目标班/事发时点；真实性或是否足以例外由人工决定。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "申请人及学院；事件说明、授课进度/突发情况证明",
        "D/E 或明显影响学生权益 条件必需",
        "可核实的教学运行事实记录，不接受笼统“情况特殊”替代理由；F028—F032；SRC-001、SRC-002、SRC-003"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 · 基层教学组织审定结果",
      "purpose": "基层教学组织；会议审定/受控审批事件；本科常规 A/C 等 P3 后续才产生；组织授权核验后的正式审定记录；F033/F043；SRC-001 第22条；必须引用 M009 对应版本；P0 缺失为正常，P3 后无源 SOURCEUNAVAILABLE。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "基层教学组织；会议审定/受控审批事件",
        "本科常规 A/C 等 P3 后续才产生",
        "组织授权核验后的正式审定记录；F033/F043；SRC-001 第22条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "M015 · 开课学院（系）同意记录",
      "purpose": "开课学院（系）；正式同意事件/签发意见；本科常规 A/C 等 P4 后续才产生；学院可验证的纸质审批单或电子事件；F034/F043；SRC-001 第22条；院系、角色、时间、版本；不可读请机构回查，不能以盖章图视为已签。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "开课学院（系）；正式同意事件/签发意见",
        "本科常规 A/C 等 P4 后续才产生",
        "学院可验证的纸质审批单或电子事件；F034/F043；SRC-001 第22条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 · 教务处备案/回执",
      "purpose": "教务处；正式备案登记或可核验回执；本科常规 A/C 等 P5 后续才产生；学校备案库/文号与原件反查；F035/F040；SRC-001 第11、22条；备案针对特定大纲版；缺则 P5 不能称备案完成，P0 不要求。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "教务处；正式备案登记或可核验回执",
        "本科常规 A/C 等 P5 后续才产生",
        "学校备案库/文号与原件反查；F035/F040；SRC-001 第11、22条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "M017 · 跨学院共同审定/论证",
      "purpose": "开课及学生所在学院、教务处；意见/论证纪要；B 情形按真正适用程序 条件必需，通常 P3—P5 后续；双方及教务处可回查正式意见；F013/F043；SRC-001 第11条；第11条主要是大纲制定，调整时是否必要待核；不得提前强制上传。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "开课及学生所在学院、教务处；意见/论证纪要",
        "B 情形按真正适用程序 条件必需，通常 P3—P5 后续",
        "双方及教务处可回查正式意见；F013/F043；SRC-001 第11条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "M018 · 培养方案或课程设置变更审批",
      "purpose": "培养单位/学术分委员会/教务处；专家论证与审批结果；E 路由相邻业务 后续才产生；相邻 T01-T03/T05-T01 权威 decisionId；F036/F039；SRC-001 第7条；对应课程/方案版本；不得作为本项普通大纲修订的必备附件。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "培养单位/学术分委员会/教务处；专家论证与审批结果",
        "E 路由相邻业务 后续才产生",
        "相邻 T01-T03/T05-T01 权威 decisionId；F036/F039；SRC-001 第7条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "M019 · 学期中例外批准/特别授权",
      "purpose": "有权机关待确认；特殊变更正式决定及援引条款；D 条件触发，但只在合法决定后产生；仅接受能回查授权机关、文本、时效、受影响范围的决定；F037/F042；SRC-002、SRC-003 为不得随意变更依据；未查到特批通道时 POLICYUNCONFIRMED/人工，不制造一个审批表。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "有权机关待确认；特殊变更正式决定及援引条款",
        "D 条件触发，但只在合法决定后产生",
        "仅接受能回查授权机关、文本、时效、受影响范围的决定；F037/F042；SRC-002、SRC-003 为不得随意变更依据"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "M020 · 学生告知与有效发布凭证",
      "purpose": "学院/学校发布平台；公告版本、覆盖与发送记录；P6 后续才产生，H 争议时已有的记录须核；正式校方通知库及受众摘要；F031/F038；SRC-001 第27、39条（具体变更告知程序待核）；内容版/班级/时点；源失联 SOURCEUNAVAILABLE；截图不自动证明合法送达。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "学院/学校发布平台；公告版本、覆盖与发送记录",
        "P6 后续才产生，H 争议时已有的记录须核",
        "正式校方通知库及受众摘要；F031/F038；SRC-001 第27、39条（具体变更告知程序待核）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "M021 · 学生反馈或方案实施争议",
      "purpose": "当事学生、学院受理部门；异议书/校方登记；H/P7 有异议时 条件必需；由校方正式受理的异议记录，口头反馈先留候选；F038/F041/F044；SRC-001 第39条（复核渠道待核）；个人受限；身份与课程匹配，无法核身份交人工，不公布明文成绩。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "当事学生、学院受理部门；异议书/校方登记",
        "H/P7 有异议时 条件必需",
        "由校方正式受理的异议记录，口头反馈先留候选；F038/F041/F044；SRC-001 第39条（复核渠道待核）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "M022 · 院级非卷面考试方案",
      "purpose": "传播科学与艺术学院/任课教师；《非卷面考试方案》；F 且学院试行规章确仍生效时，考前 条件必需；可回查学院认可的现行表式/电子替代；F024/F027/F028；SRC-005；2023 表名与时点已见，现行性未证实：标 POLICYUNCONFIRMED；审批结论仍后续产生。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "传播科学与艺术学院/任课教师；《非卷面考试方案》",
        "F 且学院试行规章确仍生效时，考前 条件必需",
        "可回查学院认可的现行表式/电子替代；F024/F027/F028；SRC-005"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "M023 · 研究生现行政策及流程配置",
      "purpose": "研究生院；正式课程教学管理办法、现行表单/职权表；G 判断政策的校方来源前置，非申请人上传义务；研究生院提供生效全文和废止说明；F042/F043；SRC-006—008；无有效制度即 POLICYUNCONFIRMED；2018 旧规不作现行替代。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "研究生院；正式课程教学管理办法、现行表单/职权表",
        "G 判断政策的校方来源前置，非申请人上传义务",
        "研究生院提供生效全文和废止说明；F042/F043；SRC-006—008"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "M024 · 撤回、事实复核或重新申报请求",
      "purpose": "申请人/受理机关；请求记录与签收；提出请求时 P7 条件必需；经受理机关登记的申请、原案关联；F041/F040；SRC-001（专项撤回/复核程序暂无校本依据）；明确原版本与申请人身份；请求未获批不能标作正式撤销。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "申请人/受理机关；请求记录与签收",
        "提出请求时 P7 条件必需",
        "经受理机关登记的申请、原案关联；F041/F040；SRC-001（专项撤回/复核程序暂无校本依据）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "M025 · 相邻 G/S/T 权威结果",
      "purpose": "原业务 Owner/学校受控业务系统；签发决定与目标；E/I 或已有相邻事件 条件必需（结果已存在时引用）；真正可回查的原业务决定，不接受改写后的 AI 摘要；F036/F039；SRC-001 第7、35条；校验 decisionId＋target＋sourceVersion＋签发角色；不存在时只等待不虚构。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "原业务 Owner/学校受控业务系统；签发决定与目标",
        "E/I 或已有相邻事件 条件必需（结果已存在时引用）",
        "真正可回查的原业务决定，不接受改写后的 AI 摘要；F036/F039；SRC-001 第7、35条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "M026 · 材料归属与版本清单",
      "purpose": "项目受控案卷；源文件指纹、页码、关联对象和替换史；P0 当前必需（系统自动生成）；有受控审计日志的同等证据台账；F001/F003/F040/F044；SRC-001（技术设计非政策）；原始文件不覆盖，变更标旧结论失效；台账损坏 SOURCEUNAVAILABLE。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "项目受控案卷；源文件指纹、页码、关联对象和替换史",
        "P0 当前必需（系统自动生成）",
        "有受控审计日志的同等证据台账；F001/F003/F040/F044；SRC-001（技术设计非政策）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "M027 · 已考核/成绩正式提交状态",
      "purpose": "教务系统成绩管理人；提交状态、覆盖摘要；D/H/I 已产生考核成绩时 条件必需；成绩管理员确认的受控状态摘要；F032；SRC-001 第31、34、35条；不得申请人批量上传学生详细成绩代替；失联交成绩管理部门。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "教务系统成绩管理人；提交状态、覆盖摘要",
        "D/H/I 已产生考核成绩时 条件必需",
        "成绩管理员确认的受控状态摘要；F032；SRC-001 第31、34、35条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M028",
      "name": "M028 · 最终有效的校方处理事件",
      "purpose": "真实审定/批准/备案机关；不同法效动作及其正式文书；主管处理发生后 后续才产生；有权机关可回查的决定书/事件或退回意见；F033—F037/F040/F043；SRC-001、相关已核阶段制度；不从 M014/M015/M016 自动合并为“批准”；版本或职权冲突时 NEEDSHUMANDECISION。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "真实审定/批准/备案机关；不同法效动作及其正式文书",
        "主管处理发生后 后续才产生",
        "有权机关可回查的决定书/事件或退回意见；F033—F037/F040/F043；SRC-001、相关已核阶段制度"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "M029 · 校本政策现行性及专项授权证据",
      "purpose": "教务处/研究生院/适用学院或校办法规职能；现行全文、废止说明、专项授权及表单/通知规则；P2 校方政策源核实，非申请人随案上传义务；特殊程序判断前必须得证；可回查学校正式发布件及授权解释、流程配置审批记录；F042/F043/F046；SRC-001/005—008/010/011；外校 SRC-012 不得占槽；绑定文件号、施行时段、学段、课程类型/校区、授权机关及抓取时间；失联 SOURCEUNAVAILABLE，仅见旧版/名称 POLICYUNCONFIRMED。材料槽为证据目的，不表示必须上传独立文件；正式校方替代效力由人工确认。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "教务处/研究生院/适用学院或校办法规职能；现行全文、废止说明、专项授权及表单/通知规则",
        "P2 校方政策源核实，非申请人随案上传义务；特殊程序判断前必须得证",
        "可回查学校正式发布件及授权解释、流程配置审批记录；F042/F043/F046；SRC-001/005—008/010/011；外校 SRC-012 不得占槽"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "evidence-checks",
      "name": "原稿审核规则逐项核验",
      "description": "依据 T01-T06 原稿规则表逐条生成稳定 criterion ID；SRC 是研究来源索引，不是案卷材料 SourceRef。所有未确认政策均需人工确认。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "R001 · 案卷对象与阶段可达，P0—P8",
          "requirement": "R001 案卷对象与阶段可达，P0—P8；T=有同一案卷的申请或复核事件；F=未建立本项案卷；U=归属不明；SRC-001；F001—F003/F040；M008/M026；核案卷事件序号、情形 A—I、版本链及 P 阶段顺序；A（项目受控日志）对 C 声明，相符 PASSFACT，相互矛盾 CONFLICT；按提交/复核事件时点；U→SOURCEUNAVAILABLE；不把项目草稿号当校方审批号；案卷 Owner/受理人核事件链",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "R002 · 实名与课程负责关系，P0—P2",
          "requirement": "R002 实名与课程负责关系，P0—P2；T=教师/课程组申请；F=学生仅提异议（H）或路由 I；U=人员键未知；SRC-001 第19—22条；F004—F006；M001/M002；A（学校实名、人事和课程责任台账）用受控人员键＋学期/课程匹配；相符 PASSFACT，不同人/岗位 CONFLICT；以申报时任职与该期任务为准；U→SOURCEUNAVAILABLE；重名、调岗不按姓名解决；人事/开课学院人工核真",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R003",
          "title": "R003 · 代理提交权限，P0/P1",
          "requirement": "R003 代理提交权限，P0/P1；T=申报人非主办人或代办；F=同一授权主办人本人；U=代理授权状态不明；SRC-001 第20/22条（无专门委托条款）；F004—F007/F043；M001—M003；A/B 校验授权人、经办人、事项、范围、有效起止与申请操作；相符 PASSFACT，超期/越权 CONFLICT；不延伸到 P3—P5 的机关签发；U→NEEDSMATERIAL（当期可提供的正式委托确实缺失）/NEEDSHUMANDECISION（代理制度解释不明），若校方授权源失联则 SOURCEUNAVAILABLE；课程负责人/学院受理员处理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "R004 · 课程实体与开课实例，P0—P2",
          "requirement": "R004 课程实体与开课实例，P0—P2；T=需审具体课程/班级；F=纯政策咨询不建案；U=课程代码/学段不明；SRC-001 第10/17条、SRC-009；F008—F017/F030；M004/M012；A 按代码、学段、课程类别、开课学院、学期/开课周期、教学班 IDs 匹配；相符 PASSFACT，同名异码/异学段 CONFLICT；使用该期排课版；U→SOURCEUNAVAILABLE；多班按班目标分别核，教务处/培养单位校验主数据",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "R005 · 基准教学大纲有效性，P0—P2",
          "requirement": "R005 基准教学大纲有效性，P0—P2；T=需与现行大纲比对；F=E/I 只转办；U=正式大纲版本不可确定；SRC-001 第10/11/22/30条；F018/F019/F040；M005/M026；A 优先确认备案/认可大纲的课程、学期、教学班、生效区间、指纹；完全匹配 PASSFACT，申报“现行版”与备案版矛盾 CONFLICT；历史版不得覆盖当期版；U→SOURCEUNAVAILABLE（校方版本库失联）或 UNREADABLE（唯一材料坏页）；学院/教务处确认正式生效版",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "R006 · 当前对学生公布的基准安排，P1/P2/P6",
          "requirement": "R006 当前对学生公布的基准安排，P1/P2/P6；T=已发布课程说明/考试计划；F=尚未进入应发布阶段且无历史安排；U=是否已发布不明；SRC-001 第12/27/29条、SRC-002、SRC-003；F020/F030/F031；M006/M007；A/B 的课程说明考核节与通知发布时间、班级、考试方式比对；同版本一致 PASSFACT，已发布说明与申报旧方案冲突 CONFLICT；以学生实际适用时点为界；U→SOURCEUNAVAILABLE（发布系统失联）/UNREADABLE；无变更通知校本期限证据；课程组与发布机构核对",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "R007 · 提议、差异稿与作用范围，P1/P2",
          "requirement": "R007 提议、差异稿与作用范围，P1/P2；T=申请方案/大纲调整；F=H/I 只查既有实施或成绩；U=改变内容不清；SRC-001 第10/22/27条；F002/F021/F022/F028/F029；M008/M009；以原版与修订稿页段、变更维度、原因、目标教学班/学期建立前后配对；信息足以审查 PASSFACT，前后稿互斥 CONFLICT；效力时间只记申请值；U→NEEDSMATERIAL/UNREADABLE；若只改单次方案且无需改大纲，M009 是否必须由学校确认；申请人/课程负责人补可审阅差异",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "R008 · 考核形式差异，P1/P2",
          "requirement": "R008 考核形式差异，P1/P2；T=F022 含形式改变；F=仅权重/标准变化；U=方式不可解析；SRC-001 第27/30条、SRC-002、SRC-003；F022—F024；M005/M006/M008/M009；对照已生效考核形式与拟形式（考试/考查、笔试/报告等）并定位原节，差异明确 PASSFACT，声称“未变更”但事实有变 CONFLICT；A/B 优先于 C；禁止推导许可；U→NEEDSMATERIAL 或 UNREADABLE；考试命题与试题保密转 T01-T05；课程负责人澄清",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "R009 · 成绩构成与比例算术，P1/P2",
          "requirement": "R009 成绩构成与比例算术，P1/P2；T=F022 含权重；F=非权重变更；U=分母/层级不明；SRC-001 第30条、SRC-002、SRC-003；F022/F025/F026；M005/M010；同层级组件、单位与分母规范化后验 100% 并与正式大纲旧比例配对；算术自洽 PASSFACT，明确 110% 等数值矛盾 CONFLICT；第30条“一般不低于20%”仅提示有权人员判断，不自动否决；U→NEEDSMATERIAL/UNREADABLE；嵌套权重、减免与特殊课型须人工解释；课程负责人/教务员复核，权重许可交有权机关",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "R010 · 评价标准与评分量表差异，P1/P2",
          "requirement": "R010 评价标准与评分量表差异，P1/P2；T=更改评分标准或非卷面评价；F=标准不变；U=无法定位变化；SRC-001 第10/27/33条；F021/F024/F027；M009/M011；旧新量表的评价维度、分值规则与班级版本按节配对；差异和算法清楚 PASSFACT，版本混用 CONFLICT；只核可描述事实，不评判教育合理性；U→NEEDSMATERIAL/UNREADABLE；试卷命题内容走 T01-T05；课程组提供评分依据",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "R011 · 开课周期/在课时点归类，P1/P2",
          "requirement": "R011 开课周期/在课时点归类，P1/P2；T=本科调整申请；F=G 研究生或 E/I 路由；U=课程进度不可查；SRC-001 第22条、SRC-002、SRC-003；F014/F015/F029/F030；M004/M008/M013；比对周期结束日、提交日、拟生效日与开课进度，判“下周期常规”或“当期在课”；时序可确定 PASSFACT；申报周期与校方记录互斥 CONFLICT。下周期不等于已同意；U→SOURCEUNAVAILABLE/NEEDSMATERIAL；学期中只能进入特殊风险待核，课程负责人/教务处界定；具体申请截止日未知",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "R012 · 本科课程类别与审定主体边界，P2/P3",
          "requirement": "R012 本科课程类别与审定主体边界，P2/P3；T=通识/通修/专业/跨学院须选路径；F=G 或 E/I 排除；U=类别/衔接解释未定；SRC-001 第11/17/22条；F011—F013/F043；M004/M012/M017；A/B 确认课程类别、开课及受课单位、申请版本，形成初始大纲链与常规调整链的候选对照；类别事实确证 PASSFACT，学院归属不符 CONFLICT；U→POLICYUNCONFIRMED（11与22条衔接）或 SOURCEUNAVAILABLE（类别库失联）；M017 仅在适用程序实际触发后要求；教务处人工释明",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "R013 · 多班/跨学院影响目标，P1/P2/P6",
          "requirement": "R013 多班/跨学院影响目标，P1/P2/P6；T=多个班、跨院或适用对象改变；F=单一班且范围未变；U=目标数量或适用范围不明；SRC-001 第17/27/30条、SRC-009；F013/F016/F017/F019；M004/M005/M012；A 比较教学班名单、原大纲覆盖、拟调整覆盖的集合差异；目标被证实 PASSFACT，单班意见试图覆盖全部班 CONFLICT；名单随选课/调整版本保留时点；U→SOURCEUNAVAILABLE，申请范围模糊则 NEEDSMATERIAL；教务处/学院核范围，禁止复制学生明文名单",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R014",
          "title": "R014 · 当期特别变更与已评分追溯风险，P2/P5",
          "requirement": "R014 当期特别变更与已评分追溯风险，P2/P5；T=在课中、已公布或已产生考核结果后改权重/形式；F=下一周期尚未实施；U=实际考核状态或例外规则未知；SRC-001 第27/30/35条、SRC-002、SRC-003；F029—F032/F037；M007/M013/M019/M027；A/B 校验已有公告、进度、成绩提交状态、拟生效时间与受影响人；事实清楚但是否允许例外/追溯一律 NEEDSHUMANDECISION，源与申述不符 CONFLICT；不重算已提交成绩；U→POLICYUNCONFIRMED（特别授权规则不明）或 SOURCEUNAVAILABLE（成绩状态库不可用）；M019 仅有权机关决定后产生；教务处/实际有权机关处理",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "R015 · 基层教学组织审定，P3 已真实启动/处理后",
          "requirement": "R015 基层教学组织审定，P3 已真实启动/处理后；T=本科常规大纲进入 P3；F=P0—P2 或未走该链；U=签发真伪不明；SRC-001 第22条；F021/F033/F043；M002/M009/M014；A/B 核审定组织、经校验的签发人/会议有效记录、修订版指纹、审定时间；确属同一版本 PASSFACT，签在 V1 却用于 V2 CONFLICT；不代审教育质量；U→SOURCEUNAVAILABLE/NEEDSHUMANDECISION；未发生 P3 时不索 M014；基层组织授权负责人核实",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "R016 · 开课学院同意，P4 已真实发生后",
          "requirement": "R016 开课学院同意，P4 已真实发生后；T=本科常规大纲已到学院同意环节；F=未到 P4；U=同意事件来源不明；SRC-001 第22条；F034/F040/F043；M009/M015；A/B 核开课学院、有权人员、同意的目标班/大纲指纹、日期；一致 PASSFACT，对错版本/错单位 CONFLICT；不将签章图片单独认证为真；U→SOURCEUNAVAILABLE/NEEDSHUMANDECISION；只要求已发生的学院事件，学院教务及有权签发人处理",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "R017 · 教务处备案事实，P5 备案行为后",
          "requirement": "R017 教务处备案事实，P5 备案行为后；T=常规大纲进入备案环节；F=备案未发生/不适用；U=回执真实性或适用性未知；SRC-001 第11/22条；F035/F040/F043；M009/M016；A/B 按备案编号、机构、对应课程/大纲版、时间核验；有效备案事实 PASSFACT，仅有“提交备案申请”却写“备案完成” CONFLICT；备案不是审批；U→SOURCEUNAVAILABLE；不因无 P0 回执判缺件；教务处备案记录持有人复核",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "R018 · 校方行为效力与签发权限，P3—P5/P8",
          "requirement": "R018 校方行为效力与签发权限，P3—P5/P8；T=案卷引用已形成的正式审定、同意、备案或特殊决定；F=还没有形成机关行为；U=签发机关/权源不确定；SRC-001 第7/11/22条、SRC-002、SRC-003；F033—F037/F040/F043/F046；M014—M019/M028/M029；A/B 逐事件验证行为类型、授权主体、版本、目标、明示生效区间及后续撤销记录；真实性与语义匹配 PASSFACT，伪造或把备案写成许可 CONFLICT；行为各自独立，F046 不能由 F029 申请值补齐；U→POLICYUNCONFIRMED（学期中特批权源）/NEEDSHUMANDECISION（权限裁量）/SOURCEUNAVAILABLE（校方事件源失联）；各原签发机关作权威核验",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "R019 · 培养方案/课程设置变更路由，P0—P2",
          "requirement": "R019 培养方案/课程设置变更路由，P0—P2；T=申请实为新开、删减/停开或培养方案课程调整；F=仅考核评价调整；U=混合事项性质不清；SRC-001 第7条；F010/F022/F036/F039；M008/M018/M025；对比请求对象与课程开设计划；T→本模板 NOTAPPLICABLE 并提示 T01-T03/T05-T01 原业务（不是失败审批）；已有决定仅链接 A 原业务记录；不得本项重复批准；U→NEEDSHUMANDECISION；M018 为相邻业务决定后才引用；教务处/培养方案责任部门核路由",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "R020 · 指定学院非卷面考试方案，P1/P2，审批事件后 P5",
          "requirement": "R020 指定学院非卷面考试方案，P1/P2，审批事件后 P5；T=传播科学与艺术学院适用课型；F=别院/无非卷面；U=2023试行规章现行性未证；SRC-005、SRC-001 第27/33条；F012/F024/F027/F028/F042；M011/M022/M028；先确认课型、院系与拟方案章节；方案事实完整 PASSFACT，材料错院/版本 CONFLICT。SRC-005现行性不明，不能仅凭 P2 材料判办事许可；学院批复只在其产生后校验；U→POLICYUNCONFIRMED，扫描表不可读→UNREADABLE；校院考务负责人核附件表式、申报时点、具体批准权",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "R021 · 研究生身份与课型归属，P0—P2",
          "requirement": "R021 研究生身份与课型归属，P0—P2；T=F008 为研究生；F=本科；U=学段/培养单位/课型不明；SRC-007 第8—9条、SRC-010（2026名称线索）；F008/F011/F012；M004；A 先证培养层次、培养单位、课程类别、开课期；事实相符才 PASSFACT，错课程/错学段 CONFLICT；不在此 R 判断研究生审批链，另见 R030；U→SOURCEUNAVAILABLE（学段库失联）/CONFLICT（多源矛盾）；培养单位/研究生院管理岗核真",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "R022 · 学生告知与实际发布覆盖，P6 或 H 已存在通知时",
          "requirement": "R022 学生告知与实际发布覆盖，P6 或 H 已存在通知时；T=方案已实施/已发布或学生称未获告知；F=初稿未发布且未进入 P6；U=通知源未知；SRC-001 第27/31/39条；F016/F017/F020/F031/F038/F046；M007/M020；A/B 对应有权实际生效版、教学班、受众覆盖、发布时间、实际内容作交集核对；记录事实完整 PASSFACT，遗漏目标班/内容错版 CONFLICT；已读率不等于同意或通知合规，法规适用另见 R033；U→SOURCEUNAVAILABLE（学校发布记录）/UNREADABLE（唯一本次公告损坏）；课程组/发布机关核源，不与 R033 合并结果",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "R023 · 学生实施争议与异议受理，P7/H",
          "requirement": "R023 学生实施争议与异议受理，P7/H；T=出现学生异议；F=无已提出异议；U=异议人/受理身份不明；SRC-001 第27/39条；F017/F038/F041/F044/F045；M001/M020/M021/M024；A/B/C 按受控学籍/选课身份核异议人 F045，再核异议目标班、方案版、事实主张及校方受理回执；事实可指认 PASSFACT，错班/错人 CONFLICT；救济程序及是否撤销由 R033/授权机关决定；U→SOURCEUNAVAILABLE（受理台账）或 NEEDSHUMANDECISION（身份争议）；学生隐私最小化，成绩分数争议转 S02-T06；学院/教务相关权责人员处理",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R024",
          "title": "R024 · 已提交成绩更正/复核排除，P0/P2/H",
          "requirement": "R024 已提交成绩更正/复核排除，P0/P2/H；T=对个人分数更正、复议，或已提交成绩的变相重算；F=仅未实施的课程方案调整；U=提交状态不明；SRC-001 第35条；F032/F039；M027/M025；A 由成绩系统核“正式提交/个人分数”事实；T→本项 NOTAPPLICABLE/转 S02-T06、成绩管理程序；任何已存在 S02 决定只引用，不反算新分数；U→SOURCEUNAVAILABLE；教学计划层面与个人成绩混合申请需拆目标而非创建新模板；成绩管理部门/相邻 Owner 处理",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R025",
          "title": "R025 · 邻接 G50/S/T 有权结果复用，P2—P8",
          "requirement": "R025 邻接 G50/S/T 有权结果复用，P2—P8；T=本案确需引用已存在外部决定；F=无关联业务；U=原系统状态不可查；SRC-001 第7/24/29/32/35条（仅界定校本事项）；F036/F039/F040；M018/M025；A 校验原 decisionId、decisionType、issuer、targetKey、sourceVersion、effectiveInterval、status；匹配 PASSFACT，错目标/失效决定 CONFLICT；不重复判他案实体许可；U→SOURCEUNAVAILABLE；未读 G50 目录时不声称已完成跨模板去重；原 G/S/T Owner 回答，当前案只存引用",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R026",
          "title": "R026 · 撤回请求/重提/事实复核的事件归属，P7 或任一阶段请求发生时",
          "requirement": "R026 撤回请求/重提/事实复核的事件归属，P7 或任一阶段请求发生时；T=有撤回/重提/复核请求；F=未请求；U=校方受理状态不明；SRC-001 第22/35条（不含专门撤回条款）；F001/F003/F041；M024/M026；A/B/C 核请求人、原案版、提交/签收事件与后续新申请版；事实链一致 PASSFACT，冒用他案请求 CONFLICT；“提出撤回”不是“撤回生效”；U→POLICYUNCONFIRMED（程序、可撤回期限）/SOURCEUNAVAILABLE（签收台账）；受理部门与原有权机关作是否接受决定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "R027 · 材料替换与定向失效，P2—P8",
          "requirement": "R027 材料替换与定向失效，P2—P8；T=证据或政策源版本发生改变；F=无版本变化；U=旧版指纹/依赖图缺失；SRC-001 第22/30/35条（业务版本锚点；依赖算法属项目设计）；F018/F021/F040/F044；M005/M009/M026；A/C 对旧新哈希、证据页、字段提取及 R→F/M/SRC 依赖图求影响集；更新后仅重跑受影响 R，其他同目标且源未变的事实结论可保留；旧审定/备案不自动转给新 V2；U→SOURCEUNAVAILABLE（台账损坏）或 NEEDSHUMANDECISION（签发变更效力）；案卷 Owner/原决定机关核失效范围",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R028",
          "title": "R028 · 案卷结论与正式机关行为分离，P5/P8",
          "requirement": "R028 案卷结论与正式机关行为分离，P5/P8；T=准备出核验报告/归档或同步学校决定；F=仍未到报告阶段；U=原决定无法核真；SRC-001 第11/22/35条；F003/F033—F044；M026/M028；A 逐项列事实、待办、历史版本、可回查机构事件；若引用事件准确 PASSFACT，声称系统预审直接批准 CONFLICT；只可展示外部真实决定的原文状态，不能自行签发；U→SOURCEUNAVAILABLE/NEEDSHUMANDECISION；归档与正式生效效力属教务处/相应学校机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "R029 · 阶段材料的“未来未产生”保护，P0—P6",
          "requirement": "R029 阶段材料的“未来未产生”保护，P0—P6；T=被核对象在当前阶段还不能合法形成；F=该阶段行为已实际完成；U=当前状态不同步；SRC-001 第22条、SRC-005（学院时效未定）；F003/F033—F038/F040；M014—M020/M028；A 核阶段事件的实际发生时间；若尚未发生，相关机构证据检查 NOTAPPLICABLE，不标申请人缺件；若已发生，转 R015—R018/R020/R022 查原记录；若“P0已盖章”却绑定未提出的 V2，CONFLICT；U→SOURCEUNAVAILABLE（流程数据断链）；考前学院方案 M022 不等于学院批复；受理/校方流程 Owner 核同步",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "R030 · 研究生当期课程考核方案制度源，P2/P3—P5",
          "requirement": "R030 研究生当期课程考核方案制度源，P2/P3—P5；T=R021 已核为研究生课程且需调整；F=确为本科；U=现行签发版/授权链未获；SRC-006、SRC-007、SRC-008、SRC-010；F008/F011/F042/F043；M023/M029；校方受控政策库/研究生院签发原文须同时给出现行条款、施行/废止、课程类别与变更机关，版本与申请学期吻合才对“制度确有可援引原件”出 PASSFACT；旧 2018 表或 2026 招生公告只证明线索；U→POLICYUNCONFIRMED；法规库断连 SOURCEUNAVAILABLE；研究生院提供正式现行办法/流程，不要求任课教师提交校规，不生成许可",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "R031 · 学期中/已考核后特殊调整权源，P2/P5",
          "requirement": "R031 学期中/已考核后特殊调整权源，P2/P5；T=R011/R014 确认为当期开课且拟改变形式/权重/追溯；F=明确定在下一周期未实施；U=是否存在合法例外程序不明；SRC-001 第22/30/35条、SRC-002/003；F029—F032/F037/F042/F043/F046；M007/M013/M019/M027/M029；先只核政策库是否存在适用于目标学期/班级的正式特别授权条文，有原件且机构与事项/时效匹配→PASSFACT（仅权源存在），伪用周期后备案或过期院级文书→CONFLICT；真实是否准许追溯仍由机关决定；U→POLICYUNCONFIRMED；当期已评定成绩→另开 NEEDSHUMANDECISION，若已正式提交分数还须 R024 路由；教务处或校方真正授权机关核政策和个人权益",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R032",
          "title": "R032 · 本科第11条类别链与第22条常规链衔接，P2/P3",
          "requirement": "R032 本科第11条类别链与第22条常规链衔接，P2/P3；T=跨学院基础课/通修通识/专业课程拟调整大纲；F=明确不修改大纲或为研究生；U=校方针对该类型的当前组织链解释缺失；SRC-001 第11/22条、SRC-011（校区职责线索）；F011—F013/F021/F042/F043；M004/M009/M017/M029；分别建立首次制定大纲与周期后常规调整的权限表，核校方现行解释是否要求共同审定、教务组织或备案；源链已由权威解释固定才 PASSFACT（链条确认），不能把第11条自然外推为所有改动的重复会签；U→POLICYUNCONFIRMED；开课学院/教务处/校区有权岗位核并写入策略版本；不得申请 P1 提前补 M017 未来会签",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R033",
          "title": "R033 · 学生知情、异议及效力规则适用，P2（当期提议）/P6/P7",
          "requirement": "R033 学生知情、异议及效力规则适用，P2（当期提议）/P6/P7；T=存在即将实施的变更或学生已提出异议；F=下一期尚未通知且尚无权益争议；U=校本渠道、时限、可否追溯/受理机关未明；SRC-001 第27/31/39条、SRC-002/003、SRC-012（跨校仅反例）；F016/F017/F029/F031/F038/F041/F042/F045/F046；M007/M020/M021/M029；先独立核校方实际生效的通知/异议条款是否存在且适用于该班/期，才能给“制度适用已查明”PASSFACT；是否真实覆盖由 R022 检查；不得把 SRC-001 第31条过程成绩公布一周误写为方案调整通知时限；U→POLICYUNCONFIRMED，有通知但权益公平性仍需 NEEDSHUMANDECISION 的另项待办；教务处/受理机关解释，绝不移用武汉理工 SRC-012 的程序",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "intake",
      "name": "提议/建案与课程/考核对象定位（P0–P2）",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "evidence-review",
      "workflowOwner": "local"
    },
    {
      "id": "evidence-review",
      "name": "事实、课程大纲、考核方式与影响范围核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "intake",
      "nextStageId": "human-confirmation",
      "workflowOwner": "local"
    },
    {
      "id": "human-confirmation",
      "name": "正式权源、学生告知及后续决定仅供人工核验",
      "kind": "handoff",
      "executorRole": "teacher",
      "returnToStageId": "evidence-review",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "review-summary",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "missing-evidence",
      "kind": "supplement-list",
      "audience": "reviewer"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-23T19:00:00.000Z"
}

export const r02Metadata = {
  "templateId": "T01-T06",
  "name": "课程考核方式、考核方案调整审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T01-T06.md",
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/T01-T06.md",
  "sourceDocumentBytes": 161920,
  "sourceDocumentSha256": "910cf5e08a1a9f2521d6c94a63bee4179789a1ee8877eecd8be6f09b4587f490",
  "sourceHashBasis": "dispatch manifest SHA-256; verified against original UTF-8 bytes plus one final LF",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyStatusRaw": "PARTIALLY_VERIFIED: 本科2022基本规范关键条款和2024/2025两份教务PDF已复核；研究生现行办法全文、当期特殊调整权限、统一表单及学生告知/异议流程未获校方确认",
  "policyEvidenceStatus": "PARTIAL",
  "criteria": [
    {
      "sectionId": "evidence-checks",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R029",
      "sourceIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R030",
      "sourceIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R031",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R032",
      "sourceIds": [
        "SRC-001",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R033",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "成都理工大学（机电工程学院官网转载校办印发件）：《成都理工大学本科课程教学基本规范》 (https://mee.cdut.edu.cn/info/1117/1944.htm)；成理校教〔2022〕11号；第 7、10—12、15、17、19—22、25、27—32、35、38—39、43—44 条；常规大纲调整链、课程评价/权重依大纲、学生成绩反馈、成绩更正边界；官网发布 2022-06-20；校长办公室 2022-06-04 印发，自印发日起实施；明示废止的是成理校教〔2018〕10号；适用本科课程，2025 教务通知再次引用本规范",
      "url": "https://mee.cdut.edu.cn/info/1117/1944.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-002",
      "title": "成都理工大学教务处：《关于做好2024—2025学年第二学期期末考试有关工作的通知》教通字〔2025〕25号 PDF (https://www.aao.cdut.edu.cn/local/A/A9/09/0D8AFAFE17938B772AAD0DE080319FDF4503E3B5.pdf)；第 1 页“二、考试要求”第 1 项；第 2 页“四、其他要求”第 1 项：考核方式与成绩构成不得随意变更、引用 2022 规范；2025-06-23；当期考试通知，适用 2024—2025-2 本科考试；无独立长期施行/废止条款",
      "url": "https://www.aao.cdut.edu.cn/__local/A/A9/09/0D8AFAFE17938B772AAD0DE0803_19FDF450_3E3B5.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-003",
      "title": "成都理工大学教务处：《关于做好2024—2025学年第一学期期末考试有关工作的通知》教通字〔2024〕73号 PDF (https://aao.cdut.edu.cn/local/5/E1/70/0CFBF107E3B3BA9D5305E2EA8D324DEBD074BF2C.pdf)；第 1 页“二、考试要求”第 1 项及第 2 页“其他要求”：同样要求依大纲、不得随意改方式和构成，引用 2022 规范；2024-12-25；2024—2025-1 学期通知；当期适用，未载长期失效条款",
      "url": "https://aao.cdut.edu.cn/__local/5/E1/70/0CFBF107E3B3BA9D5305E2EA8D3_24DEBD07_4BF2C.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-004",
      "title": "成都理工大学，成理校教〔2017〕28 号：《成都理工大学课程考核管理规定》 (https://cnae.cdut.edu.cn/local/B/CD/55/1347E45BA0243810CF9A9F4D250EAEE3C5577A641.pdf)；汇编印刷页 55—59 / PDF 第 59—63 页，第 2—4、9、11—14、17—18 条；考试/考查、大纲约束、考试管理；2017-12-05 印发；本次截取段未核到统一施行/废止日；明确针对全日制本专科，非学历教育参照",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-005",
      "title": "成都理工大学传播科学与艺术学院：《传播科学与艺术学院考务工作规范（试行）》 (https://ccsa.cdut.edu.cn/info/1034/1892.htm)；“非卷面考试命题与组织”第 2、3 项：实践性展示类在考前一月提交非卷面方案报学院审批，论文/报告需符合大纲并于开考前申报；附件 4 为院级非卷面考试方案；2023-02-22 发布；施行/废止日未核；仅限该学院、标“试行”",
      "url": "https://ccsa.cdut.edu.cn/info/1034/1892.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-006",
      "title": "成都理工大学核技术与自动化工程学院：《成都理工大学研究生课程建设及课程管理办法（暂行）》 (https://cnae.cdut.edu.cn/info/1040/1425.htm)；第 2、6、13、19—21、26 条；2018 年课程大纲由学院学位（术）评定委员审定、研究生院（部）批准备案；页面 2018-01-09，文中称自 2018-01 实施并废止更旧规定；研究生及参照的进修生",
      "url": "https://cnae.cdut.edu.cn/info/1040/1425.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-007",
      "title": "成都理工大学（信息公开网站）：《成都理工大学研究生学籍管理办法》，成理校研〔2021〕13号 (https://dbxb.cdut.edu.cn/xxgkwz/info/1032/2549.htm)；第 8—9 条：研究生应依培养方案/计划参加考核，考核与成绩评定依学校研究生课程教学相关管理规定；2021 年文件，具体印发日、施行与废止条款需继续核；研究生",
      "url": "https://dbxb.cdut.edu.cn/xxgkwz/info/1032/2549.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-008",
      "title": "成都理工大学研究生院发布的学位授权点 2024 年建设报告 PDF (https://gra.cdut.edu.cn/local/D/69/D5/7104C6BD7D9154AD3388B3A6B708DB688D1F5567D.pdf)；“制度建设 / 课程教学”有关页（PDF 内“2.制度建设”段，页码待再定位）；提到 2024 年依《成都理工大学研究生课程教学管理办法》管理；2024 年工作事实；网页首次发布日期未核；学校研究生建设报告而非规范性文件，无施行/废止概念",
      "url": "https://gra.cdut.edu.cn/__local/D/69/D5/7104C6BD7D9154AD3388B3A6B70_8DB688D1_F5567D.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-009",
      "title": "成都理工大学教务处：《关于2024—2025学年第二学期选课的通知》PDF (https://aao.cdut.edu.cn/local/2/BA/E1/80FDC10ACB0141DD44782BB4498B5AF362E2C769.pdf)；第 1—2 页“选课注意事项”第 1、2、6、7 项：课程/教学班选课、停开合班与教务系统确认关系；2024-12-26；该学期选课通知；2024—2025-2 学生/教学班适用，通知期外不作为永久规定",
      "url": "https://aao.cdut.edu.cn/__local/2/BA/E1/80FDC10ACB0141DD44782BB4498_B5AF362E_2C769.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-010",
      "title": "成都理工大学管理科学学院：《2026年招收硕博连读研究生实施细则》 (https://cim.cdut.edu.cn/info/1098/6002.htm)；正文关于学业成绩的条款明确转引《成都理工大学研究生课程教学管理办法》的百分制/五级制换算标准；搜索索引可定位，HTML 直开 412；2026 招生批次，仅证明研究生课程教学管理办法至 2026 仍被院系引用的名称/评分体系线索；不构成该办法完整、现行签发版本",
      "url": "https://cim.cdut.edu.cn/info/1098/6002.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-011",
      "title": "成都理工大学宜宾校区：《教务工作部部门职责》 (https://yb.cdut.edu.cn/info/1091/4509.htm)；部门职责条目包括本校区本科教学运行、成绩管理、考核课程考试组织和试卷工作；官方搜索索引，HTML 直开 412；2026 年页面；宜宾校区组织职责说明，不是全校审批授权文件",
      "url": "https://yb.cdut.edu.cn/info/1091/4509.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-012",
      "title": "武汉理工大学：校教字〔2023〕29号《本科课程过程性考核实施细则》PDF (https://naoep.whut.edu.cn/rcpy/bks/sjjx/202311/P020231106575009594075.pdf)；PDF 第 5—6 页（印刷页 5—6）第 11—13 条：课程组拟定、在执行期更改有明确申请/批准/备案链、首次课告知学生；第 7、9 条含该校特有比例；2023-05-25 印发；仅武汉理工大学本科、该校规定范围",
      "url": "https://naoep.whut.edu.cn/rcpy/bks/sjjx/202311/P020231106575009594075.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = T01T06_TEMPLATE
