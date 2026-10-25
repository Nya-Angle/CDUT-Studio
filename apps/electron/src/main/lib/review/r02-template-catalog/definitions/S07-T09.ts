import type { TemplateVersion } from '@profer/shared'

export type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED' | 'HISTORICAL' | 'CROSS_SCHOOL_ONLY'
export type R02PolicyEvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
export interface R02CriterionMetadata { sectionId: string; criterionId: string; sourceIds: string[]; evidenceStatus: R02EvidenceStatus }
export interface R02Metadata { templateId: string; name: string; sourceDocumentPath: string; sourceDocumentSha256: string; researchOriginalPath: string; researchOriginalSha256: string; officialSchoolTemplate: false; researchDate: string; policyEvidenceStatus: R02PolicyEvidenceStatus; sourceStatus: Record<string, R02EvidenceStatus>; criteria: R02CriterionMetadata[]; externalPolicyReferences: Array<{id:string;title:string;documentNo:string;publishedAt:string;url:string;evidenceStatus:R02EvidenceStatus;scope:string}> }

// These are research review targets, NOT PolicyVersion and NOT deterministic eligibility gates.
const fieldDefinitions = [
  {
    "key": "F001",
    "label": "F001 · `policyYear:int` 例如 2027",
    "kind": "number",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "F001；`policyYear:int` 例如 2027；规则快照@P0；有效通知/权，L；缺失策略 PU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F002",
    "label": "F002 · `caseId:string` 唯一案卷",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F002；`caseId:string` 唯一案卷；Case@P1；V3 可信服务，L；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F003",
    "label": "F003 · `studentId:string`",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F003；`studentId:string`；学生@P1；校学籍权，P；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F004",
    "label": "F004 · `originInstitution:string`",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F004；`originInstitution:string`；本科学校@P1；学籍权，P；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F005",
    "label": "F005 · `enrollmentType:enum` 全日制普通本科/其他",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F005；`enrollmentType:enum` 全日制普通本科/其他；学籍@P1；校学籍权，P；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F006",
    "label": "F006 · `expectedGraduationYear:int`",
    "kind": "number",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F006；`expectedGraduationYear:int`；学籍@P1；校学籍权，P；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F007",
    "label": "F007 · `admissionSubtype:enum` 普通/专升本/第二学士/其他",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F007；`admissionSubtype:enum` 普通/专升本/第二学士/其他；学籍@P1；校学籍权，P；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F008",
    "label": "F008 · `collegeCode:string`",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F008；`collegeCode:string`；学院@P1；校学籍权，P；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F009",
    "label": "F009 · `majorCode:string`",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F009；`majorCode:string`；专业@P1；校学籍权，P；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F010",
    "label": "F010 · `programLength:int` 四/五/其他",
    "kind": "number",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F010；`programLength:int` 四/五/其他；培养方案@P2；教务权，L；缺失策略 SU/PU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F011",
    "label": "F011 · `firstAttemptCourses:array{courseId,requiredType,credits,firstScore,gradeScale,year}`",
    "kind": "rows",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F011；`firstAttemptCourses:array{courseId,requiredType,credits,firstScore,gradeScale,year}`；课程@P2；教务权，S；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F012",
    "label": "F012 · `retakenCourseCount:int` 取当届学校认定口径",
    "kind": "number",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F012；`retakenCourseCount:int` 取当届学校认定口径；课程@P1；教务权，S；缺失策略 SU/PU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F013",
    "label": "F013 · `cet4Score:number",
    "kind": "number",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "F013；`cet4Score:number；null`；缺失策略 外语@P1；考试权威核验，S。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F014",
    "label": "F014 · `cet4EvidenceDate:date",
    "kind": "date",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "F014；`cet4EvidenceDate:date；null`；缺失策略 外语@P1；考试权威核验，S。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F015",
    "label": "F015 · `foreignLanguageMajor:boolean`",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "F015；`foreignLanguageMajor:boolean`；专业分类@P1；教务权，P；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F016",
    "label": "F016 · `artsSportsMajor:boolean`",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "F016；`artsSportsMajor:boolean`；专业分类@P1；教务权，P；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F017",
    "label": "F017 · `foreignLanguageRuleVersion:string",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "F017；`foreignLanguageRuleVersion:string；null`；缺失策略 学院例外@P0；当届外院正式细则，L。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F018",
    "label": "F018 · `collegeEnglishCourseScores:array<number>`",
    "kind": "rows",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "F018；`collegeEnglishCourseScores:array<number>`；艺体外语@P1；教务权，S；缺失策略 SU/NA。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F019",
    "label": "F019 · `examCheatingFinding:enum` 已查实/无记录/待查",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F019；`examCheatingFinding:enum` 已查实/无记录/待查；纪律@P1；有权部门，R；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F020",
    "label": "F020 · `academicMisconductFinding:enum` 已查实/无记录/待查",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F020；`academicMisconductFinding:enum` 已查实/无记录/待查；学术诚信@P1；有权部门，R；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F021",
    "label": "F021 · `ideologyAssessment:enum` 合格/不合格/待核",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F021；`ideologyAssessment:enum` 合格/不合格/待核；思政@P2；学院党委/签发权，R；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F022",
    "label": "F022 · `weightedCourseAverage:number",
    "kind": "number",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F022；`weightedCourseAverage:number；null`；缺失策略 成绩计算@P2；F011 校验结果，S。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F023",
    "label": "F023 · `collegeScorePolicyVersion:string",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F023；`collegeScorePolicyVersion:string；null`；缺失策略 学院评分制度@P0；当届获审细则，L。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F024",
    "label": "F024 · `compositeScore:number",
    "kind": "number",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F024；`compositeScore:number；null`；缺失策略 评分@P2；课程85%+综合15%，S。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F025",
    "label": "F025 · `majorRanking:int",
    "kind": "number",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F025；`majorRanking:int；null`；缺失策略 专业排名@P3；学院经签发总账，S。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F026",
    "label": "F026 · `majorQuota:int",
    "kind": "number",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F026；`majorQuota:int；null`；缺失策略 2027 当届专业配额@P3；学校/学院有效名单，L。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F027",
    "label": "F027 · `claimedAchievements:array` 类型/等级/年份/成员",
    "kind": "rows",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "F027；`claimedAchievements:array` 类型/等级/年份/成员；成果申报@P2；学生申报非权，P；缺失策略 NA/NM。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F028",
    "label": "F028 · `actualContribution:record",
    "kind": "object",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F028；`actualContribution:record；null` 作者排序、本人贡献；缺失策略 成果@P2；机构/组委会/专家组核对，S。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F029",
    "label": "F029 · `conflictOfInterestForWork:boolean",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "F029；`conflictOfInterestForWork:boolean；null` 直系亲属等；缺失策略 成果@P2；披露+专家核验，R。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F030",
    "label": "F030 · `expertVerification:enum` 通过/不通过/未审",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F030；`expertVerification:enum` 通过/不通过/未审；成果@P2；专家组签名报告权，S；缺失策略 SU/NA。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F031",
    "label": "F031 · `publicDefenseOutcome:enum` 通过/未通过/未举行",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F031；`publicDefenseOutcome:enum` 通过/未通过/未举行；成果@P2；完整签名与音视频记录权，S；缺失策略 SU/NA。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F032",
    "label": "F032 · `comprehensivePerformanceScore:number",
    "kind": "number",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F032；`comprehensivePerformanceScore:number；null`；缺失策略 综合表现@P2；学院签发评分，S。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F033",
    "label": "F033 · `collegeNominationStatus:enum` 未形成/拟推荐/递补/不推荐",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F033；`collegeNominationStatus:enum` 未形成/拟推荐/递补/不推荐；学院名单@P3；学院签发权，S；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F034",
    "label": "F034 · `collegePublicNotice:record{start,end,version}`",
    "kind": "object",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F034；`collegePublicNotice:record{start,end,version}`；学院公示@P3；学院官网/档案权，P；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F035",
    "label": "F035 · `collegeReconsideration:enum` 无/处理中/维持/变更",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F035；`collegeReconsideration:enum` 无/处理中/维持/变更；复议@P3/P6；学院复议机关，R；缺失策略 NA/SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F036",
    "label": "F036 · `schoolDecision:enum` 未审/通过/未通过/撤销",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F036；`schoolDecision:enum` 未审/通过/未通过/撤销；学校审定@P4/P6；校级委员会签发权，S；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F037",
    "label": "F037 · `schoolPublicNotice:record{start,end,version}`",
    "kind": "object",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F037；`schoolPublicNotice:record{start,end,version}`；校级公示@P4；官方公告权，P；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F038",
    "label": "F038 · `staffConflictDisclosure:record` 利益关系/回避结果",
    "kind": "object",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F038；`staffConflictDisclosure:record` 利益关系/回避结果；工作人员@P2-P4；有权监督机关，R；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F039",
    "label": "F039 · `nationalSystemRecommendation:enum` 未核/已备案/无/取消",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F039；`nationalSystemRecommendation:enum` 未核/已备案/无/取消；系统@P5；推免服务系统权，S；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F040",
    "label": "F040 · `receivingDecisionRef:string",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F040；`receivingDecisionRef:string；null`；缺失策略 外校或本校接收@P7；招生单位系统权，S。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F041",
    "label": "F041 · `withdrawalStatus:enum` 未请求/请求中/权威已受理/已撤销",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "F041；`withdrawalStatus:enum` 未请求/请求中/权威已受理/已撤销；本案@P6；申请人请求+有权确认，P；缺失策略 NA/SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F042",
    "label": "F042 · `appealRecord:record",
    "kind": "object",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "F042；`appealRecord:record；null` 申请依据/处理结果；缺失策略 本案@P3/P6；受理部门签发，R。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F043",
    "label": "F043 · `evidenceVersion:string` hash/序号",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F043；`evidenceVersion:string` hash/序号；每份资料@全阶段；V3 证据保管，L；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F044",
    "label": "F044 · `sourceVersion:string` 规则版本+时效",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F044；`sourceVersion:string` 规则版本+时效；规则快照@全阶段；有权来源，L；缺失策略 PU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F045",
    "label": "F045 · `trustedActor:record` subject/role/scope/session",
    "kind": "object",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F045；`trustedActor:record` subject/role/scope/session；事件@全阶段；Main/后端认证，R；缺失策略 SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F046",
    "label": "F046 · `noticeOrAppealWindow:record` 日期/依据",
    "kind": "object",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": true,
    "extractionHint": "F046；`noticeOrAppealWindow:record` 日期/依据；公示、复议@P3/P4/P6；当届公告权，L；缺失策略 PU/SU。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  },
  {
    "key": "F047",
    "label": "F047 · `specialPlanCode:string",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case",
    "readOnly": false,
    "extractionHint": "F047；`specialPlanCode:string；null` 普通/专项代码；缺失策略 申请@P0；当届正式政策及本人申请，P。来源、主体、届别和版本均须可信核实；学生自报/OCR仅能作核查线索，待确认规则交人工，不触发正式资格决定。",
    "displayHint": "研究性字段；学校真实学籍/审批/系统回执须另行验权。"
  }
] satisfies TemplateVersion['fields']
const materialSlotDefinitions = [
  {
    "id": "M001",
    "name": "M001 · 学籍权威快照",
    "purpose": "**学籍权威快照**：成都理工、年级、招生类别、学院专业、学制；校学籍系统签发记录；P1现；F003-F010；R001-R003/R036；SRC-001；缺失/例外：系统缺 `SOURCE_UNAVAILABLE`，勿用学生口述通过。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M002",
    "name": "M002 · 本人推免申请与届别选择",
    "purpose": "**本人推免申请与届别选择**：当届学院正式申请表；本人持有，须认证确认；P1现，表样/截止以学院有效通知为准；F001/F002/F003/F008/F009/F047；R004/R005；SRC-001；缺失/例外：学生应传未传 `NEEDS_MATERIAL`；表版本未知 `POLICY_UNCONFIRMED`。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "M003",
    "name": "M003 · 认证主体与授权凭据",
    "purpose": "**认证主体与授权凭据**：学校身份认证/受权代理/服务端权限；全阶段现；F003/F045；R004/R030/R031；SRC-001；缺失/例外：身份源失联 `SOURCE_UNAVAILABLE`，不允许前端假签。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M004",
    "name": "M004 · 培养方案及首次修读学分成绩",
    "purpose": "**培养方案及首次修读学分成绩**：教务正式课程分数/学分/必修限选分类；合法权威成绩单替代；P2现；F010/F011/F022；R013-R015/R036；SRC-001；缺失/例外：系统丢失 `SOURCE_UNAVAILABLE`；影像不清 `UNREADABLE`。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M005",
    "name": "M005 · 重修课程清单",
    "purpose": "**重修课程清单**：教务正式重修标记与门数；P1现；F012；R006；SRC-001；缺失/例外：不凭申请人只报总数；权威缺 `SOURCE_UNAVAILABLE`。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M006",
    "name": "M006 · CET4 成绩及考试时点",
    "purpose": "**CET4 成绩及考试时点**：考试权威可核成绩/原证书；P1，普通非外语非艺体专业现；F013/F014/F015/F016；R010；SRC-001；缺失/例外：学生证书未传可补，核验服务失联则 `SOURCE_UNAVAILABLE`。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "M007",
    "name": "M007 · 外语专业另定标准及艺体大学英语成绩",
    "purpose": "**外语专业另定标准及艺体大学英语成绩**：当届学院规则+教务课程记录；P1，例外分支现；F015-F018；R011/R012；SRC-001；缺失/例外：学院例外未公布 `POLICY_UNCONFIRMED`，课程查不到 `SOURCE_UNAVAILABLE`。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M008",
    "name": "M008 · 考试纪律与学术不端权威结论",
    "purpose": "**考试纪律与学术不端权威结论**：处分/考务/学术机构记录，非未经查实举报；P1现；F019/F020；R007/R008；SRC-001；缺失/例外：机关查不到 `SOURCE_UNAVAILABLE`，疑点 `NEEDS_HUMAN_DECISION`。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M009",
    "name": "M009 · 思想品德考核签发意见",
    "purpose": "**思想品德考核签发意见**：学院党委或校方授权机关记录；P2后（仅考核节点）；F021；R009；SRC-001；缺失/例外：申请 P1 未出不能报学生缺件，P2 未发则机关待办。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M010",
    "name": "M010 · 当届本学院遴选/评分及外语细则",
    "purpose": "**当届本学院遴选/评分及外语细则**：学院官网公告+校级审核备案凭据；P0现作为规则配置，不是学生文件；F017/F023/F044；R005/R011/R016/R017/R029；SRC-001；缺失/例外：未取 `POLICY_UNCONFIRMED`，禁借 2026 附表。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M011",
    "name": "M011 · 声明成果证据",
    "purpose": "**声明成果证据**：证书、论文、专利、竞赛名单、角色、贡献；学生+权威发文部门；P2，申请加分时现；F027-F029；R017/R018/R036；SRC-001；缺失/例外：无申报则 `NOT_APPLICABLE`，有申报缺证明 `NEEDS_MATERIAL`。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "M012",
    "name": "M012 · 专家鉴定、公开答辩和保存件",
    "purpose": "**专家鉴定、公开答辩和保存件**：有权专家组签署意见、需要时的录音录像；P2后，成果加分触发；F030/F031；R019/R035；SRC-001；缺失/例外：未审 `NEEDS_HUMAN_DECISION`，不可把未来签字当学生缺件。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M013",
    "name": "M013 · 成绩计算及专业排序工作底稿",
    "purpose": "**成绩计算及专业排序工作底稿**：学院经核确认的综合表现、85/15 公式及专业同批候选名单；P2/P3后；F022-F025/F032；R015/R016/R020；SRC-001；缺失/例外：公式输入缺 `SOURCE_UNAVAILABLE`，规则未核 `POLICY_UNCONFIRMED`。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M014",
    "name": "M014 · 学院各专业名额分配",
    "purpose": "**学院各专业名额分配**：学校/学院当届公示或签发配额；P3后；F008/F009/F026；R021；SRC-001；缺失/例外：缺权威配额 `SOURCE_UNAVAILABLE`，不能猜“前 X%”。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M015",
    "name": "M015 · 学院拟推荐/递补名单和公示凭据",
    "purpose": "**学院拟推荐/递补名单和公示凭据**：公告 URL、时间、版本及工作小组签发；P3后；F033/F034/F046；R021/R022/R036；SRC-001；缺失/例外：公示未到阶段不缺；到阶段源丢失 `SOURCE_UNAVAILABLE`。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M016",
    "name": "M016 · 学院复议受理与结论",
    "purpose": "**学院复议受理与结论**：申诉本人/学院签发复议意见；P3/P6可；F035/F042/F046；R023；SRC-001；缺失/例外：没申诉 `NOT_APPLICABLE`，已受理未答 `NEEDS_HUMAN_DECISION`。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M017",
    "name": "M017 · 学校审定名单/决定",
    "purpose": "**学校审定名单/决定**：校级委员会有权签发记录；P4后；F036；R024/R032；SRC-001；缺失/例外：申请阶段非必需，到 P4 未审交校级待办。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M018",
    "name": "M018 · 学校公示记录",
    "purpose": "**学校公示记录**：学校官方名单、开始/截止与版本；P4后；F037/F046；R025；SRC-001；缺失/例外：未发布时校级待办，未公示完不能宣称终局生效。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M019",
    "name": "M019 · 工作人员/学生利益相关关系披露及回避记录",
    "purpose": "**工作人员/学生利益相关关系披露及回避记录**：受限机关记录；P2-P4条件触发；F029/F038；R018/R027；SRC-001；缺失/例外：应报未报为人工核查，不能自动捏造亲属关系。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M020",
    "name": "M020 · 国家推免服务系统资格状态",
    "purpose": "**国家推免服务系统资格状态**：可信接口/签名结果/人工核验编号；P5后；F039；R026/R032/R033/R036；SRC-002/SRC-003；缺失/例外：系统不可连 `SOURCE_UNAVAILABLE`，学生截图不是签发。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M021",
    "name": "M021 · 招生单位接收回执",
    "purpose": "**招生单位接收回执**：校外或本校研究生招生系统正式记录；P7可只读；F040；R033；SRC-002/SRC-003；缺失/例外：非本案必需，不能据其创建推荐资格。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M022",
    "name": "M022 · 本人撤回意愿及有权处理回执",
    "purpose": "**本人撤回意愿及有权处理回执**：带认证的请求和后续正式状态；P6可；F041/F045；R031/R032；SRC-001/SRC-002；缺失/例外：未请求 `NOT_APPLICABLE`；已请求未办保留 `REQUESTED`。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M023",
    "name": "M023 · 复核/举报新证据与版本",
    "purpose": "**复核/举报新证据与版本**：本人/监督机构受权提交、调查签发结论；P6可；F042/F043/F045；R023/R028/R034；SRC-001；缺失/例外：可补佐证，严重指控由人工调查而非 AI 裁决。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M024",
    "name": "M024 · 证据与政策版本总账",
    "purpose": "**证据与政策版本总账**：每份材料归属、SHA256、sourceVersion、事件序号；全阶段现；F001/F002/F043/F044；R001/R029/R030/R034；SRC-001/SRC-003；缺失/例外：版本无法确认则冻结旧 Run 结论，不可“旧通过复用”。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M025",
    "name": "M025 · 专项计划政策与授权",
    "purpose": "**专项计划政策与授权**：当届国防科工补偿等批准文件与个人资格凭据；P0/P2条件触发；F047；R028；SRC-001；缺失/例外：未取得专项原文 `POLICY_UNCONFIRMED`；无专项 `NOT_APPLICABLE`。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "M026",
    "name": "M026 · 原始申报资料和专家意见归档收据",
    "purpose": "**原始申报资料和专家意见归档收据**：学院归档、教务处原件保管日志；P2后、终案后；F030/F031/F043；R035；SRC-001；缺失/例外：归档只由单位形成，不能当 P1 学生缺件。材料必须关联本案主体、来源和版本；校方/学院/国家系统后置凭据不视为初始申请缺件。",
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
      "材料主体与本案对象一致",
      "可核的签发主体、日期及来源版本",
      "仅按触发阶段与当前届别确认真实材料义务"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  }
] satisfies TemplateVersion['materialSlots']
const criteria = [
  {
    "id": "R001",
    "title": "P1 本年度应届",
    "requirement": "R001 · P1 本年度应届：T 为毕业届别与 `F001` 相同；F 为非本届；U 无学籍快照；核对依据/字段/槽位：F001/F006；M001/M024；SRC-001；结果及下一角色：T `PASS_FACT`；F `NEEDS_HUMAN_DECISION`；U `SOURCE_UNAVAILABLE`→学籍科/学院。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R002",
    "title": "P1 普通全日制本科及来源学校",
    "requirement": "R002 · P1 普通全日制本科及来源学校：T 为 CDUT 且普通全日制；F 为不符；U 不能核学校身份；核对依据/字段/槽位：F004/F005；M001；SRC-001；结果及下一角色：T PASS；F 人工资格结论；U 源不可得→教务。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R003",
    "title": "P1 排除类别",
    "requirement": "R003 · P1 排除类别：T 为非专升本、非第二学士；F 为被列入排除；U 招录子类不明；核对依据/字段/槽位：F007；M001；SRC-001；结果及下一角色：T PASS；F 人审；U 源不可得→学籍科。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R004",
    "title": "P1 本人身份及合法申报",
    "requirement": "R004 · P1 本人身份及合法申报：T 为后端可信 Actor 与学籍同一人；F 不同人/越权；U 会话不可鉴权；核对依据/字段/槽位：F002/F003/F045；M002/M003；SRC-001；结果及下一角色：T PASS；F `NEEDS_HUMAN_DECISION` 并阻断提交；U 源不可得→认证/教务。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R005",
    "title": "P0/P1 年度学院实施细则/表版",
    "requirement": "R005 · P0/P1 年度学院实施细则/表版：T 规则当前学院及届别有效；F 适用对象不符；U 未发布/未取；核对依据/字段/槽位：F001/F008/F023/F044；M002/M010；SRC-001；结果及下一角色：T PASS；F/ U `POLICY_UNCONFIRMED`→学院/教务。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R006",
    "title": "P1 重修门数",
    "requirement": "R006 · P1 重修门数：T 权威课程重修 **≤2门**；F 大于2；U 课程计数数据欠缺；核对依据/字段/槽位：F012；M005；SRC-001；结果及下一角色：T PASS；F 人审不符事实；U 源不可得→教务。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R007",
    "title": "P1 考试作弊已查实状态",
    "requirement": "R007 · P1 考试作弊已查实状态：T 无查实记录；F 有权机关查实；U 待调查或未取；核对依据/字段/槽位：F019；M008；SRC-001；结果及下一角色：T PASS；F 人审并保密；U `SOURCE_UNAVAILABLE` / `NEEDS_HUMAN_DECISION`→纪律机构。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R008",
    "title": "P1 学术不端已查实状态",
    "requirement": "R008 · P1 学术不端已查实状态：T 无查实记录；F 有权机关确认存在；U 有举报尚未认定；核对依据/字段/槽位：F020；M008；SRC-001；结果及下一角色：T PASS；F 人审；U 人工调查→学术诚信机关。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R009",
    "title": "P2 思想品德考核",
    "requirement": "R009 · P2 思想品德考核：T 有权学院党委结论合格；F 不合格；U 尚未签发；核对依据/字段/槽位：F021；M009；SRC-001；结果及下一角色：T PASS；F 人审；U `NEEDS_HUMAN_DECISION`→学院党委；P1不报缺件。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R010",
    "title": "P1 普通非外语非艺体",
    "requirement": "R010 · P1 普通非外语非艺体：T CET4≥425 且成绩取得时间符合校文“截至2026年9月1日前”；F 低分/明显逾期；U 证据不可证或恰在边界日含不含存歧义；例外不适用；核对依据/字段/槽位：F013/F014/F015/F016；M006；SRC-001；结果及下一角色：T PASS；F 人审；U 补学生证据/查官方源或 `POLICY_UNCONFIRMED`→学院。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R011",
    "title": "P1 外语类专业",
    "requirement": "R011 · P1 外语类专业：T 按**外国语学院当届另定标准**事实成立；F 明确不符；U 未取得标准；普通专业 NA；核对依据/字段/槽位：F015/F017；M007/M010；SRC-001；结果及下一角色：T PASS；F 人审；U `POLICY_UNCONFIRMED`→外国语学院。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R012",
    "title": "P1 艺体类专业",
    "requirement": "R012 · P1 艺体类专业：T 权威《大学英语》**所有相关课程≥60**；F 有课程低于60；U 课程未全取；非艺体 NA；核对依据/字段/槽位：F016/F018；M007；SRC-001；结果及下一角色：T PASS；F 人审；U 源不可得→教务。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R013",
    "title": "P2 课程集合",
    "requirement": "R013 · P2 课程集合：T 四年制取前三年、五年制前四年，必修含限选且首修；F 错混选修/补考/重修；U 学制异型/记录不足；核对依据/字段/槽位：F010/F011；M004；SRC-001；结果及下一角色：T PASS；F `CONFLICT` 并重算；U 源不可得/政策待核→教务。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R014",
    "title": "P2 五级制换分",
    "requirement": "R014 · P2 五级制换分：T 优95/良85/中75/及格65/不及格55 的字段按原始等级映射；F 有不一致；U 等级定义缺；核对依据/字段/槽位：F011；M004；SRC-001；结果及下一角色：T PASS；F CONFLICT；U 源不可得→学院。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R015",
    "title": "P2 加权课程均分",
    "requirement": "R015 · P2 加权课程均分：T `sum(firstScore*credit)/sum(credit)` 且分母有效；F 计算有误；U 缺学分/首修；核对依据/字段/槽位：F011/F022；M004/M013；SRC-001；结果及下一角色：T PASS；F CONFLICT→教务校验；U 源不可得，不虚填零。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R016",
    "title": "P2 综合分",
    "requirement": "R016 · P2 综合分：T `0.85*F022 + 0.15*F032` 且综合表现按本院已批版本；F 数值错误；U 本院评分细则未取；核对依据/字段/槽位：F022/F023/F024/F032；M010/M013；SRC-001；结果及下一角色：T PASS；F CONFLICT；U `POLICY_UNCONFIRMED`→学院。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R017",
    "title": "P2 申报成果计分资格",
    "requirement": "R017 · P2 申报成果计分资格：T 证据/级别/角色等符合该届学院规则；F 不符合；U 学院细则未取；无成果 NA；核对依据/字段/槽位：F023/F027/F028；M011/M010；SRC-001；结果及下一角色：T PASS；F 人审剔除该项；U 政策待核/补件→专家组。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R018",
    "title": "P2 利益关联成果",
    "requirement": "R018 · P2 利益关联成果：T 权威核验与直系亲属或其他利益相关者**无**不得计分的合作关系；F 已查实关联；U 未查；核对依据/字段/槽位：F027/F028/F029；M011/M019；SRC-001；结果及下一角色：T PASS；F 人审不得计分；U 人工核验→专家组/纪检。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R019",
    "title": "P2 高水平成果鉴定",
    "requirement": "R019 · P2 高水平成果鉴定：T 完成专家组真实鉴定、必要公开答辩、签字存档，符合采分条件；F 不通过；U 尚未审；核对依据/字段/槽位：F030/F031；M012；SRC-001；结果及下一角色：T PASS；F 人审不计分；U `NEEDS_HUMAN_DECISION`→专家组。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R020",
    "title": "P3 专业排序",
    "requirement": "R020 · P3 专业排序：T 按批准专业范围/总分版本得到有权签发名次；F 计算/同分处理冲突；U 缺全体候选或同分规则；核对依据/字段/槽位：F008/F009/F024/F025；M013；SRC-001；结果及下一角色：T PASS；F CONFLICT；U `POLICY_UNCONFIRMED` / `SOURCE_UNAVAILABLE`→学院。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R021",
    "title": "P3 名额及排名",
    "requirement": "R021 · P3 名额及排名：T 确认本人在当届**对应专业**可推荐名额和名单内；F 不在名额内；U 无正式名额；核对依据/字段/槽位：F009/F025/F026/F033；M014/M015；SRC-001；结果及下一角色：T PASS；F 人审递补/未推荐；U 源不可得→学校/学院，不预测配额。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R022",
    "title": "P3 学院公示",
    "requirement": "R022 · P3 学院公示：T 已在学院网站至少**3日**且对应名单版本；F 不足/名单变更未另行处理；U 缺记录；核对依据/字段/槽位：F033/F034/F046；M015；SRC-001；结果及下一角色：T PASS；F CONFLICT/人审程序纠正；U 源不可得→学院。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R023",
    "title": "P3/P6 异议复议",
    "requirement": "R023 · P3/P6 异议复议：T 有异议则存在真实受理与签发结论；F 已发现不一致未纠；U 尚在查；无异议 NA；核对依据/字段/槽位：F035/F042/F046；M016/M023；SRC-001；结果及下一角色：T PASS；F CONFLICT→学院；U `NEEDS_HUMAN_DECISION`→复议机关。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R024",
    "title": "P4 校级审定",
    "requirement": "R024 · P4 校级审定：T 校级委员会已签发对**同一名单版本**通过；F 未通过/撤销；U 尚未决定；核对依据/字段/槽位：F033/F036；M017；SRC-001；结果及下一角色：T PASS（仅“审定记录存在”）；F 人审；U `NEEDS_HUMAN_DECISION`→校级委员会。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R025",
    "title": "P4 学校公示",
    "requirement": "R025 · P4 学校公示：T 当届学校拟推荐名单公示至少**7日**且版本一致；F 不足；U 未有公告/不明；核对依据/字段/槽位：F036/F037/F046；M018；SRC-001；结果及下一角色：T PASS；F CONFLICT/程序补正；U 源不可得→教务。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R026",
    "title": "P5 全国系统备案",
    "requirement": "R026 · P5 全国系统备案：T 推荐资格与学生、年份、名单版本相符且系统显示已备案；F 系统否认/撤销；U 无可信回执；核对依据/字段/槽位：F003/F006/F039；M020；SRC-002/SRC-003；结果及下一角色：T PASS（确有备案事实）；F 人审；U `SOURCE_UNAVAILABLE`→教务授权接口。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R027",
    "title": "P2-P4 关联关系回避",
    "requirement": "R027 · P2-P4 关联关系回避：T 相关人员已按规定申报并获正式回避/管理记录；F 未按规报备且有影响；U 未查明；无关系 NA；核对依据/字段/槽位：F038；M019；SRC-001；结果及下一角色：T PASS；F 人工违规调查；U `NEEDS_HUMAN_DECISION`→监督机关。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R028",
    "title": "P0/P2 专项计划",
    "requirement": "R028 · P0/P2 专项计划：T 当届专项文件存在且附加条件可核；F 不合适；U 未取得；普通 NA；核对依据/字段/槽位：F047/F044；M025/M023；SRC-001；结果及下一角色：T PASS；F 人审；U `POLICY_UNCONFIRMED`→专项主管机构。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R029",
    "title": "P0 规则届别和效力",
    "requirement": "R029 · P0 规则届别和效力：T `F001/F044` 与当届官方 SRC 同时成立；F 用了上一届参数；U 生效/过渡冲突；核对依据/字段/槽位：F001/F044；M010/M024；SRC-001/SRC-006；结果及下一角色：T PASS；F CONFLICT 并冻结原规则；U 政策待核→教务。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R030",
    "title": "全阶段证据归属",
    "requirement": "R030 · 全阶段证据归属：T 当前材料与 Case/学生/可信源签名一致；F 跨学生/替换材料/伪造 Actor；U 归属不可知；核对依据/字段/槽位：F002/F003/F043/F045；M003/M024；SRC-001/SRC-003；结果及下一角色：T PASS；F CONFLICT 并隔离；U 源不可得→后台/学院。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R031",
    "title": "P6 撤回请求真实性",
    "requirement": "R031 · P6 撤回请求真实性：T 本人或有权机关确有撤回请求且认证通过；F 身份错/越权；U 认证不可得；未撤回 NA；核对依据/字段/槽位：F041/F045；M022/M003；SRC-001/SRC-002；结果及下一角色：T PASS（请求真实）；F 阻断；U 源不可得→认证/教务。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R032",
    "title": "P6 撤回实际生效",
    "requirement": "R032 · P6 撤回实际生效：T 有权机构作出撤回/取消且必要系统同步；F 仅学生请求尚未处理；U 系统未知；无撤回 NA；核对依据/字段/槽位：F036/F039/F041；M017/M020/M022；SRC-001/SRC-002；结果及下一角色：T PASS（撤销状态核实）；F `NEEDS_HUMAN_DECISION`；U 源不可得→校方/系统。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R033",
    "title": "P7 推荐/接收隔离",
    "requirement": "R033 · P7 推荐/接收隔离：T 已备案推荐与招生单位接收状态分别由各自权源签发；F 把接收邮件当推荐或平台录取；U 回执未核；无接收 NA；核对依据/字段/槽位：F039/F040；M020/M021；SRC-002/SRC-003/SRC-004；结果及下一角色：T PASS（状态归属正确）；F CONFLICT；U 源不可得→招生单位/教务。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R034",
    "title": "全阶段证据版本新鲜度",
    "requirement": "R034 · 全阶段证据版本新鲜度：T 关联的 F/M/规则版本未变化；F 材料重传/源版本变更使原 Observation 过期；U 版本不明；核对依据/字段/槽位：F042/F043/F044；M023/M024；SRC-001/SRC-003；结果及下一角色：T PASS；F 撤销旧事实有效性并定向复审；U SOURCE_UNAVAILABLE→V3 后端。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R035",
    "title": "P2/终案归档",
    "requirement": "R035 · P2/终案归档：T 成果原始材料/鉴定意见按 SRC-001 留存不少于 5 年的组织责任被配置并有机构归档回执；F 丢件；U 尚未办理；核对依据/字段/槽位：F030/F031/F043；M012/M026；SRC-001；结果及下一角色：T PASS；F CONFLICT→学院/教务；U 人工保管待办，不归责学生。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R036",
    "title": "全阶段跨件一致性",
    "requirement": "R036 · 全阶段跨件一致性：T 学籍、课程、奖项、候选名单、备案身份版本互相吻合；F 同主体不同证据出现实质冲突；U 两端不能取；核对依据/字段/槽位：F003/F011/F027/F033/F039；M001/M004/M011/M015/M020；SRC-001/SRC-003；结果及下一角色：T PASS；F `CONFLICT`→原数据权属机构；U 源不可得。【适用门禁】2027届数值、比例、日期及公示时限仅为当届研究证据；其他届别必须先取得新政策和学院规则，未知时仅生成 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。此项 PASS_FACT 只证明局部事实，不证明已被学院推荐、学校审定或国家系统备案。",
    "execution": "manual",
    "targetScope": "case"
  }
] satisfies NonNullable<TemplateVersion['sections']>[number]['criteria']

export const templateVersion: TemplateVersion = {
  templateId: 'S07-T09',
  version: 1,
  schemaVersion: 2,
  name: "优秀应届本科毕业生推荐免试攻读研究生（推免）资格审核",
  description: '本地研究模板 · 非校方正式模板。2027届仅为政策研究样本；学院细则、名额与权威身份尚待核。事实初审及人工复核，不自动获得推免资格。',
  catalogKind: 'builtin',
  sourceNote: 'R02_RESEARCH_TEMPLATE_NONOFFICIAL: 此模板并非成都理工大学正式授权的申报或决定流程。SRC 是政策研究索引而非案卷 SourceRef；学院拟推荐、学校审定、国家系统备案和招生单位接收各自独立，未配置正式 PolicyVersion 或平台写回。',
  objectType: 'person',
  displayName: { template: 'S07-T09 · 推免资格研究预审' },
  fields: fieldDefinitions,
  materialSlots: materialSlotDefinitions,
  sections: [{ id: 'rules', name: 'R001–R036 本地事实与政策审阅', description: '逐条映射源稿 §08。每项仅人工/语义证据检查；年度数值不得跨届别移植，最终决策由有权校方及国家平台产生。', order: 0, required: true, criteria }],
  policyVersionIds: [],
  stages: [
  {
    "id": "p0-policy",
    "name": "P0 届别、学院及专项政策适用核实",
    "kind": "manual-review",
    "executorRole": "reviewer",
    "nextStageId": "p1-application",
    "workflowOwner": "local"
  },
  {
    "id": "p1-application",
    "name": "P1 本人申请、学籍、外语与诚信事实",
    "kind": "manual-review",
    "executorRole": "reviewer",
    "nextStageId": "p2-assessment",
    "returnToStageId": "p0-policy",
    "workflowOwner": "local"
  },
  {
    "id": "p2-assessment",
    "name": "P2 课程首修、综合表现与专家鉴定",
    "kind": "manual-review",
    "executorRole": "teacher",
    "nextStageId": "p3-college",
    "returnToStageId": "p1-application",
    "workflowOwner": "local"
  },
  {
    "id": "p3-college",
    "name": "P3 学院排序、拟推荐、公示与复议（只读核验）",
    "kind": "manual-review",
    "executorRole": "teacher",
    "nextStageId": "p4-school",
    "returnToStageId": "p2-assessment",
    "workflowOwner": "local"
  },
  {
    "id": "p4-school",
    "name": "P4 学校有权审定与公示（只读核验）",
    "kind": "manual-review",
    "executorRole": "teacher",
    "nextStageId": "p5-system",
    "returnToStageId": "p3-college",
    "workflowOwner": "local"
  },
  {
    "id": "p5-system",
    "name": "P5 全国推免系统权威备案（只读核验）",
    "kind": "manual-review",
    "executorRole": "teacher",
    "nextStageId": "p6-local-review",
    "returnToStageId": "p4-school",
    "workflowOwner": "local"
  },
  {
    "id": "p6-local-review",
    "name": "P6 撤回、版本复核与本地人工审阅；P7接收状态仅只读",
    "kind": "finalize",
    "executorRole": "teacher",
    "returnToStageId": "p5-system",
    "workflowOwner": "local"
  }
] satisfies TemplateVersion['stages'],
  outputs: [
    { id:'factual-review', kind:'item-feedback', audience:'reviewer' },
    { id:'pending-policy-and-evidence', kind:'supplement-list', audience:'teacher' },
  ],
  autoPassPolicy: { enabled:false },
  status: 'draft',
  createdAt: '2026-10-24T14:00:00+08:00',
}

export const r02Metadata: R02Metadata = {
  templateId:'S07-T09',
  name:"优秀应届本科毕业生推荐免试攻读研究生（推免）资格审核",
  sourceDocumentPath:"docs/design/review-agent/business-templates/R02/S07-T09.md",
  sourceDocumentSha256:"9d9f48542f61b89d9b46f44ed9485271a632c0912ac2aaa4408002a421aea8d0",
  // Source was a completed independent research draft in ChatGPT Library, not a research-original blob in this repo.
  researchOriginalPath:'ChatGPT Library:/S07-T09_正式业务模板_MD_v1.0.md',
  researchOriginalSha256:"9d9f48542f61b89d9b46f44ed9485271a632c0912ac2aaa4408002a421aea8d0",
  officialSchoolTemplate:false,
  researchDate:'2026-10-24',
  policyEvidenceStatus:'PARTIAL',
  sourceStatus:{
  "SRC-001": "PARTIAL",
  "SRC-002": "VERIFIED",
  "SRC-003": "VERIFIED",
  "SRC-004": "HISTORICAL",
  "SRC-005": "HISTORICAL",
  "SRC-006": "UNCONFIRMED",
  "SRC-007": "UNCONFIRMED",
  "SRC-008": "HISTORICAL",
  "SRC-009": "HISTORICAL",
  "SRC-010": "HISTORICAL",
  "SRC-011": "CROSS_SCHOOL_ONLY"
} as Record<string,R02EvidenceStatus>,
  criteria:[
  {
    "sectionId": "rules",
    "criterionId": "R001",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R002",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R003",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R004",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R005",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R006",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R007",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R008",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R009",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R010",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R011",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R012",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R013",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R014",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R015",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R016",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R017",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R018",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R019",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R020",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R021",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R022",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R023",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R024",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R025",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R026",
    "sourceIds": [
      "SRC-002",
      "SRC-003"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R027",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R028",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R029",
    "sourceIds": [
      "SRC-001",
      "SRC-006"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R030",
    "sourceIds": [
      "SRC-001",
      "SRC-003"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R031",
    "sourceIds": [
      "SRC-001",
      "SRC-002"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R032",
    "sourceIds": [
      "SRC-001",
      "SRC-002"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R033",
    "sourceIds": [
      "SRC-002",
      "SRC-003",
      "SRC-004"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R034",
    "sourceIds": [
      "SRC-001",
      "SRC-003"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "rules",
    "criterionId": "R035",
    "sourceIds": [
      "SRC-001"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "rules",
    "criterionId": "R036",
    "sourceIds": [
      "SRC-001",
      "SRC-003"
    ],
    "evidenceStatus": "PARTIAL"
  }
] as R02CriterionMetadata[],
  externalPolicyReferences:[
  {
    "id": "SRC-001",
    "title": "成都理工大学推荐2027年优秀应届本科毕业生免试攻读研究生遴选工作实施办法",
    "documentNo": "2027届校级文件",
    "publishedAt": "2026-08-28",
    "url": "https://yz.chsi.com.cn/tm/tjbf/detail?schCode=10616&zsgsId=3545932903",
    "evidenceStatus": "PARTIAL",
    "scope": "仅2027届校级核验样本，需学院当届规则与校方签发原文"
  },
  {
    "id": "SRC-002",
    "title": "四川省2027年推荐优秀应届本科毕业生免试攻读研究生公告",
    "documentNo": "四川省2027届",
    "publishedAt": "2026-09-21",
    "url": "https://www.sceea.cn/Html/202609/Newsdetail_4970.html",
    "evidenceStatus": "VERIFIED",
    "scope": "系统/报考阶段，不能代替校内推荐决定"
  },
  {
    "id": "SRC-003",
    "title": "中国研招网推免服务系统说明",
    "documentNo": "全国平台说明",
    "publishedAt": "",
    "url": "https://yz.chsi.com.cn/tm/",
    "evidenceStatus": "VERIFIED",
    "scope": "推荐备案与招生接收独立；本地无权回写"
  },
  {
    "id": "SRC-006",
    "title": "全国高等学校推荐优秀应届本科毕业生免试攻读研究生工作管理规定",
    "documentNo": "教学厅〔2026〕1号",
    "publishedAt": "",
    "url": "",
    "evidenceStatus": "UNCONFIRMED",
    "scope": "上位文件全文与生效过渡未核；不得推定条文"
  }
] as R02Metadata['externalPolicyReferences'],
}
