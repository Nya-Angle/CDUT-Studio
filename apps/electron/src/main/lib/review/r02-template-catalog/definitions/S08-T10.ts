/** R02 S08-T10: mechanical, source-traceable V3 draft; no official school authorization. */
import type { TemplateVersion } from '@profer/shared'
import { validateTemplate } from '../../template-store'

export const templateVersion: TemplateVersion = {
  templateId: "S08-T10",
  version: 1, schemaVersion: 2, name: "硕博连读、直博或培养层次转段资格审核",
  description: "本地研究模板 · 非校方正式模板。硕博连读、直博或培养层次转段资格审核。仅做证据关联、事实审查、风险与补件建议；政策适用和最终决定由有权人员确认。",
  catalogKind: 'builtin',
  sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 非校方正式模板；审阅稿 docs/design/review-agent/business-templates/R02/S08-T10.md SHA-256 ccd53fbb9c9f1142fba4025860b8e6fe312f79b467dc32da103c94d6143fd266；研究原件 docs/design/review-agent/business-templates/R02/research-original/S08-T10.md SHA-256 777dcc875273ff521e75dac036732c64034ff79a76a4522cc53310d6785d6b32。SRC 为研究文献索引，不是案卷 SourceRef；校规及签批权待确认。",
  objectType:'person', displayName:{template:"硕博连读、直博或培养层次转段资格审核"},
  fields: [
  {
    "key": "F001",
    "label": "caseKey (S)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F001：caseKey (S)；Case；L0–L7；宿主建案事务；M034:caseLink；P1；无键不能关联，H；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F002",
    "label": "admissionYear (I)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F002：admissionYear (I)；Case；L0；招生当期公告 M001:year；P0；P；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F003",
    "label": "batchId (S)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F003：batchId (S)；Case；L0–L4；M001:batch、官方报考批次；P1；P；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F004",
    "label": "admissionRoute (E: mastertophd/directphd/unknown/other)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F004：admissionRoute (E: mastertophd/directphd/unknown/other)；Case；L0；M001:route + M004/M021 的申请目的；P1；未知 H；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F005",
    "label": "applicantOrigin (E: CDUTmaster/CDUTug/externalug/other)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F005：applicantOrigin (E: CDUTmaster/CDUTug/externalug/other)；Applicant；L0；M003/M015:enrollmentSchool；P1；S/H；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F006",
    "label": "receivingCollege (S)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F006：receivingCollege (S)；Program；L0–L1；M001:college、M004/M021；P1；P；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F007",
    "label": "targetDoctoralDiscipline (S:专业代码+名称)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F007：targetDoctoralDiscipline (S:专业代码+名称)；Program；L0–L1；M001:当年目录，M004/M021；P1；P/H；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F008",
    "label": "policySnapshotRef (S)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F008：policySnapshotRef (S)；Case；L0–L7；M001:政策 URI/指纹/SRC；P0；P；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F009",
    "label": "legalName (S)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F009：legalName (S)；Applicant；L1；R:来源学籍/官方身份，M002:name；P2；N/S、异名 C；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F010",
    "label": "legalDocumentKey (S:加密引用)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F010：legalDocumentKey (S:加密引用)；Applicant；L1；R:有权限证件数据，M002:number；P3；N/S，禁明文展示；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F011",
    "label": "sourceSchool (S)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F011：sourceSchool (S)；Applicant；L1；R:原学校学籍/推免，M003/M015；P2；S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F012",
    "label": "sourceStudentNo (S)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F012：sourceStudentNo (S)；Applicant；L1；R:学籍，M003/M015:学号；P2；S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F013",
    "label": "currentStudyStage (E:ug/master/doctoral/unknown)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F013：currentStudyStage (E:ug/master/doctoral/unknown)；Applicant；L0–L6；R:学校学籍/学信网，M003/M015/M031；P2；S/H；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F014",
    "label": "fullTime (B?)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F014：fullTime (B?)；MasterStudy/DirectPhD；L1；R:学籍培养方式，M003/M015；P2；S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F015",
    "label": "degreeCategory (E:academic/professional/unknown)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F015：degreeCategory (E:academic/professional/unknown)；MasterStudy；L1；R:硕士学籍，M003；P2；S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F016",
    "label": "employmentCategory (E:nondirected/directed/unknown)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F016：employmentCategory (E:nondirected/directed/unknown)；MasterStudy；L1；R:硕士录取/学籍，M003；P2；S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F017",
    "label": "masterGrade (I:1/2/3/other)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F017：masterGrade (I:1/2/3/other)；MasterStudy；L1；R:硕士入学学年与当期年级，M003；P2；S/H；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F018",
    "label": "year1EligibilityBasis (E:recommendedmaster/scholarship/other/unknown)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F018：year1EligibilityBasis (E:recommendedmaster/scholarship/other/unknown)；MasterStudy；L1-A；M009 与学校录取/奖学金记录；P2；N/S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F019",
    "label": "scholarshipDecisionRef (S)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F019：scholarshipDecisionRef (S)；MasterStudy；L1-A 按选择；R:官方奖学金决定，M009；P2；条件 N/S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F020",
    "label": "planAndCourseCompletion (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F020：planAndCourseCompletion (O)；MasterStudy；L1-B/C、L6-A；R:校方批准培养计划与课程记录，M008；P2；当前 N/S；A 初期 L；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F021",
    "label": "courseAverageAndScale (O:数值/换算版次)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F021：courseAverageAndScale (O:数值/换算版次)；MasterStudy；L1-B/C；R:正式成绩、换算口径，M008；P2；N/S、口径 H；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F022",
    "label": "languageEvidenceRoute (E)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F022：languageEvidenceRoute (E)；Evidence；L1-B/C、直博按清单；M010/M020:证明种类；P2；条件 N、年度 P；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F023",
    "label": "languageResult (O:成绩/有效期/机构)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F023：languageResult (O:成绩/有效期/机构)；Evidence；L1-B/C；签发平台/有权核验 M010/M020；P2；N/S/H；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F024",
    "label": "researchClaimRefs (L<O>)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F024：researchClaimRefs (L<O>)；Evidence；L1-C 或 B/D 条件；M011/M020:论文/专利/奖项及署名；P2；条件 N/S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F025",
    "label": "researchQualityJudgmentRef (S)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F025：researchQualityJudgmentRef (S)；DecisionRef；L2；G06/校方认定责任人 M011/M014；P2；H，不自动生成；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F026",
    "label": "masterTutorConsent (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F026：masterTutorConsent (O)；MasterStudy；L1-A/B/C；M005:原硕士导师可验证签署；P2；N/H；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F027",
    "label": "doctoralTutorOpinionFact (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F027：doctoralTutorOpinionFact (O)；Program；L1-A/B/C/D；E/H 有直博导师签署时；A–D: M006；直博 E/H: M019 中拟报导师一份；仅核签署及内容，不等于导师当年招生资格或录取承诺；P2；按阶段 N/H，源不通 S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F028",
    "label": "expertRecommendations (L<O>)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F028：expertRecommendations (L<O>)；Evidence；L1-A/B/C/E；M007（硕博）/M019（直博）的每位专家及职称/签署；P2；N/H；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F029",
    "label": "healthEligibility (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F029：healthEligibility (O)；Applicant；L1 或按学院节点；R:依法核验的体检结论，M013；P3；无前置要求不索；条件 N/H；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F030",
    "label": "disciplineAndIntegrityCheck (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F030：disciplineAndIntegrityCheck (O)；Applicant；L1/L5；R:学校纪律、学术诚信及政审有权结论，M012/M027；P3；S/H，不凭自述判无处分；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F031",
    "label": "undergraduateStanding (O:应届/全日制/学籍)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F031：undergraduateStanding (O:应届/全日制/学籍)；DirectPhD；L1-E/F；R:本科就读校、学信网，M015/M016；P2；N/S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F032",
    "label": "recommendationQualification (O:状态/生效期间)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F032：recommendationQualification (O:状态/生效期间)；DirectPhD；L1-E/F；R:来源高校推免有效决定/推免系统，M018；P2；S/H；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F033",
    "label": "undergraduateTranscript (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F033：undergraduateTranscript (O)；DirectPhD；L1-E；M017:来源本科教务签章成绩单；P2；N/U；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F034",
    "label": "signedApplicationFact (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F034：signedApplicationFact (O)；Process；A–D 的 L1；E/F 的 L4（平台开放后）；M004:硕博资格申请表或 M021:直博平台志愿；直博 L1 受理咨询时尚无平台正式志愿，不报缺件；P2；当前时 N、未到时 L，校本表单字段 P；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F035",
    "label": "collegePrecheckRef (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F035：collegePrecheckRef (O)；Process；L2–L3；R:招生学院初审记录 M022/M024；P2；L/S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F036",
    "label": "precheckPublicityRef (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F036：precheckPublicityRef (O)；Process；L3；R:学院初审公示及异议处理 M023；P1/P2；L/S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F037",
    "label": "doctoralRegistrationNo (S)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F037：doctoralRegistrationNo (S)；Process；L4-G；R:博士研招网有效报名记录 M025；P2；L/S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F038",
    "label": "registrationPaymentAndValidation (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F038：registrationPaymentAndValidation (O)；Process；L4-G；R:研招系统缴费及学籍核验回执 M026；P2；L/S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F039",
    "label": "recommendationSystemEvents (O:志愿/复试/待录取确认)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F039：recommendationSystemEvents (O:志愿/复试/待录取确认)；Process；L4–L5-E/F/H；R:全国推免系统 M021；P2；L/S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F040",
    "label": "retestAndEthicsResult (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F040：retestAndEthicsResult (O)；DecisionRef；L5；R:学院考核有权档案 M027；P3；L/S/H；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F041",
    "label": "proposedAdmissionStatus (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F041：proposedAdmissionStatus (O)；DecisionRef；L5；R:学院/学校名单和公示 M028；P2；L/S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F042",
    "label": "formalAdmissionRef (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F042：formalAdmissionRef (O)；DecisionRef；L6；R:教育部录取检查与学校录取通知 M029/M030；P2；L/S；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F043",
    "label": "doctoralRegistrationStatus (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F043：doctoralRegistrationStatus (O)；DecisionRef；L6；R:研究生学籍电子注册 M031；P3；L/S；未注册不可推断；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F044",
    "label": "exceptionHumanReview (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F044：exceptionHumanReview (O)；Process；L1–L2-D；M014:申请证据及导师/学术分委员会意见；P3；H；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F045",
    "label": "remedyOrWithdrawalEvent (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F045：remedyOrWithdrawalEvent (O)；Process；L7-K；M032/M033:请求、受理、正式答复；P3；H/L；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F046",
    "label": "materialVersionChain (L<O>)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F046：materialVersionChain (L<O>)；Audit；各阶段；M034:指纹/来源/父子版本/被替换状态；P1/P3 依材料；失链 C/H；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F047",
    "label": "trustedActorGrant (O)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F047：trustedActorGrant (O)；Audit；所有人工动作；Host/Main 可信会话授权 M034:actor/roleGrant；P3；无授权拒绝写入；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F048",
    "label": "policyCurrentity (E:verifiedforbatch/unknown/superseded)",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F048：policyCurrentity (E:verifiedforbatch/unknown/superseded)；Case；L0–L7；M001:来源/版次/有效期核验记录；P0；P；枚举和复杂值待可信来源核验，不按文字猜类型。"
  }
],
  materialSlots: [
  {
    "id": "M001",
    "name": "当年招生章程、校通知、学院实施细则、专业目录和版本有效性；学校/学院持有，官网原文/PDF",
    "purpose": "研究稿 M001：当年招生章程、校通知、学院实施细则、专业目录和版本有效性；学校/学院持有，官网原文/PDF；N：各情形 L0；2027 当前 P；同一发布机构签章/可核验存档全文；上一年不替代；F002–F008,F048；001/002/004/007/009；年度+学院+专业+发布日期独立快照；缺 P/S，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M002",
    "name": "申请人法定姓名、证件身份；本人/公安身份凭据、依法受权的学校实名记录",
    "purpose": "研究稿 M002：申请人法定姓名、证件身份；本人/公安身份凭据、依法受权的学校实名记录；N：A–L L1；不必重复上传；经授权实名校方学籍记录或人工核验有效证件原件；F009,F010；001/004/005；同案隐私 P3，遮蔽号码；缺 N/S，损 U，冲突 C。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M003",
    "name": "在读硕士身份、年级、学位类型、学习/就业类别；学校研究生学籍或签章证明",
    "purpose": "研究稿 M003：在读硕士身份、年级、学位类型、学习/就业类别；学校研究生学籍或签章证明；N：A–D；校方现行注册/录取电子记录，人工签章证明确认；F005,F011–F017；001/002/005；与当批次时点绑定；缺 S/N，损 U，类别冲突 C。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M004",
    "name": "硕博连读本人申请与目标专业；本人及学院持有的 2026 资格申请表 DOC/签章件",
    "purpose": "研究稿 M004：硕博连读本人申请与目标专业；本人及学院持有的 2026 资格申请表 DOC/签章件；N：A–D L1；如学校认可的同批次官方申报系统原始表单；2014 旧表单不能无条件替代；F004,F006,F007,F034；002/011；2026 表单确实存在、字节内容未读；申请签章版为主，缺 N、损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M005",
    "name": "原硕士导师同意/推荐；导师本人可核验签名或校内流程意见",
    "purpose": "研究稿 M005：原硕士导师同意/推荐；导师本人可核验签名或校内流程意见；N：A–D L1；学校明确认可的实名签署电子记录；F026；002/008；专属该人、该导师、该批次；缺 N/H、损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M006",
    "name": "拟报博士导师接收意向；拟报导师实名意见",
    "purpose": "研究稿 M006：拟报博士导师接收意向；拟报导师实名意见；N：A–D L1；有权学院确认的导师可验证电子意见；F027；001/002；与招生导师及专业绑定；缺 N/H、损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M007",
    "name": "硕博连读至少两名相应学科教授/同等职称专家书面推荐、其中一份为拟报导师；专家/学院持有",
    "purpose": "研究稿 M007：硕博连读至少两名相应学科教授/同等职称专家书面推荐、其中一份为拟报导师；专家/学院持有；N：A–D L1；同年度同学院认可的实名电子签署及职称校验；F028；001/002；按专家主体分别归属，导师兼推荐人不能重复计两人；缺 N/H，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M008",
    "name": "已批硕士个人培养计划、课程完成、成绩与换算；培养单位/校方系统",
    "purpose": "研究稿 M008：已批硕士个人培养计划、课程完成、成绩与换算；培养单位/校方系统；N：B/C L1；L：A 拟录取后课程条件才形成；校方教务签章成绩单及培养计划签章件；F020,F021；002/005；以申请截止日冻结适用版，A 后置独立版；缺 N/S 或 L，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M009",
    "name": "一年级推免入硕或研究生学业奖学金资格事实；招生/奖学金有权机构",
    "purpose": "研究稿 M009：一年级推免入硕或研究生学业奖学金资格事实；招生/奖学金有权机构；C→N：A 选定其中路径；校方招生录取记录、研究生学业奖学金正式决定或签章证明；F018,F019；002；不可将“申请奖学金”当已获奖；缺 N/S，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M010",
    "name": "语言能力证明与考试成绩；语言考试发证机构/学校",
    "purpose": "研究稿 M010：语言能力证明与考试成绩；语言考试发证机构/学校；N：B/C 2026 环土；C：E 按清单；F 尚待 2027 政策；发证平台可验证成绩、校方认可的留服认证或成果替代路径（需当年政策）；F022,F023；002/004；记录考试类别、分数/等级、日期；缺 N/P、损 U，差异 H。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M011",
    "name": "论文、发明专利、成果及署名事实；原出版/专利登记机构、校方成果认定部门",
    "purpose": "研究稿 M011：论文、发明专利、成果及署名事实；原出版/专利登记机构、校方成果认定部门；N：C；C：B 成绩不足及 D 特长；E 仅支持材料；可核的出版/专利记录、校方正式成果认定；不以用户简历代原件；F024,F025；002；每成果独立编号、版本、署名；缺 N/H、损 U，作者冲突 C。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M012",
    "name": "纪律处分/学术诚信事实；培养单位和有权纪检/学生管理记录",
    "purpose": "研究稿 M012：纪律处分/学术诚信事实；培养单位和有权纪检/学生管理记录；C：A–H，依官方可查询或正式要求；学校授权的无处分/诚信核验证明，不强制个人交敏感处分历史；F030；002/004/005；P3 不公开；无法授权查询 S/H，损 U，禁止反向推定清白。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M013",
    "name": "健康体检或资格结论；合规医疗机构/学校指定审查部门",
    "purpose": "研究稿 M013：健康体检或资格结论；合规医疗机构/学校指定审查部门；C：学校当期规定节点；不少情形录取后才交，不是统一 L1 必交；学校认可医院体检及有权审查结论；F029；001/002/004/005；保留必要结论，不提取不必要病历；缺按节点 N/L/H，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M014",
    "name": "特殊学术专长证明及例外审定；本人提交事实，博士导师和学院学术分委员会形成决定",
    "purpose": "研究稿 M014：特殊学术专长证明及例外审定；本人提交事实，博士导师和学院学术分委员会形成决定；N：D 的本人专长来件；L：委员会随后形成意见；学院确认的真实会议/签章审定记录，不接受 AI 评分替代；F025,F044；002；申请材料与学院决定分不同 Owner/版本；缺 N/H 或 L，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M015",
    "name": "本科应届身份、学生证、毕业学校归属；来源本科高校/申请人",
    "purpose": "研究稿 M015：本科应届身份、学生证、毕业学校归属；来源本科高校/申请人；N：E/F L1（F 只做来源核实）；来源高校学籍记录/有效学生证经人工核对；F005,F011–F013,F031；004；本科学籍历史与身份匹配；缺 N/S，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M016",
    "name": "教育部学籍在线验证报告；学信网/本人依法取得的报告",
    "purpose": "研究稿 M016：教育部学籍在线验证报告；学信网/本人依法取得的报告；N：E 的 2026 材料；F 以 2027 政策再核；经授权学信网核验的等效在线记录；F031；004；有效期及校验码不得泄露；缺 N/S/P，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M017",
    "name": "本科完整在校课程成绩；来源高校教务部门加盖公章成绩单",
    "purpose": "研究稿 M017：本科完整在校课程成绩；来源高校教务部门加盖公章成绩单；N：E L1；F 待当期核定；来源学校可核签章电子成绩单；F033；004；原学校教务签发版为主；缺 N/P，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M018",
    "name": "来源本科院校正式推免资格；来源校推免管理部门/全国推免系统",
    "purpose": "研究稿 M018：来源本科院校正式推免资格；来源校推免管理部门/全国推免系统；N：E/F 的直博资格事实；经有权来源校签章的有效推免名单或全国平台身份核验；F032；004/010；来源校决定与接收校录取严格分开；缺 S/H，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M019",
    "name": "两份直博专家推荐书，含一份拟报导师；推荐专家持有，2026 校本附件 DOC/签署件",
    "purpose": "研究稿 M019：两份直博专家推荐书，含一份拟报导师；推荐专家持有，2026 校本附件 DOC/签署件；N：E；F 待核 2027；同年度学校认可的电子签署文件（签署人资格仍核验）；F027,F028；001/004；2026 职称口径冲突：SRC-004 直博办法允许副教授及以上，SRC-001 博士章程基本条件表述正高；有权解释前若仅副高证据，标 POLICYUNCONFIRMED，不可径判通过；缺 N/P/H，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M020",
    "name": "直博英语、获奖和科研支持文件；申请人/发证机构/来源高校",
    "purpose": "研究稿 M020：直博英语、获奖和科研支持文件；申请人/发证机构/来源高校；2026 校办法第三部分第 5 项列明英语及奖项/成果等：逐项核“须交证明类型”和“如有则交支持材料”，不将无奖项当缺件；F 待 2027 校本清单；官方语言成绩/获奖证明和可核成果记录；F022–F025；004/012；英语证明若批次明确必交则 N；奖项、成果未拥有/可选时 NOTAPPLICABLE，不强索；缺/损按各子证据独立输出。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M021",
    "name": "全国推免服务系统志愿、复试通知、待录取确认、取消待录取请求/招生单位同意/考生确认；全国平台/本人",
    "purpose": "研究稿 M021：全国推免服务系统志愿、复试通知、待录取确认、取消待录取请求/招生单位同意/考生确认；全国平台/本人；L：E/F 报名系统开放并触发后才产生；H/K 当期需要，2027 按省级平台程序；校方招生系统可核的全国推免回执（不可由任意截图替代）；F034,F039,F045；001/004/013；每事件分别带国家平台事件键与时间，不能把“申请取消”视为“已取消”；缺 L/S，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M022",
    "name": "学院硕博连读初审名单/个案初审结论；招生学院持有",
    "purpose": "研究稿 M022：学院硕博连读初审名单/个案初审结论；招生学院持有；L：A–D 完成初审后，G 才需要；学院实名签章或可核电子初审公文；F035；002/006；申请与初审分开、不得自己签发；缺 L/S，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M023",
    "name": "初审公示及异议处理结果；学院官网/学院档案",
    "purpose": "研究稿 M023：初审公示及异议处理结果；学院官网/学院档案；L：A–D 初审后，G 引用；学院归档公示及更正公告；F036；002/006；公示版本、起止与更正链；缺 L/S，损 U，冲突 C。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M024",
    "name": "研究生院初审备案回执/记录；研究生院",
    "purpose": "研究稿 M024：研究生院初审备案回执/记录；研究生院；L：学院报备后；学院与研究生院核验的备案档案；F035；002；学院公示不自动生成为已备案；由 R041 独立核验，缺 L/S，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M025",
    "name": "硕博连读研招网博士报名号/报考方式；全国研招平台",
    "purpose": "研究稿 M025：硕博连读研招网博士报名号/报考方式；全国研招平台；L：G 2026 通过初审后；全国研招系统或学校招生办可核原始记录；F037；001/003；同批次仅一条有效报名记录；缺 L/S，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M026",
    "name": "硕博连读缴费、学历学籍校验、报考信息确认的三条可分官方事件；全国研招系统",
    "purpose": "研究稿 M026：硕博连读缴费、学历学籍校验、报考信息确认的三条可分官方事件；全国研招系统；L：G 已网报后各自到节点；平台真实支付/校验/确认回执；需补认证报告时按当年公告；F038；001/003；分别供 R027、R042、R043，不能以银行截图替代成功支付，也不能以支付证明替代信息确认；缺 L/S，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M027",
    "name": "复试评议与政治品德考核；学院评审组/招生领导小组",
    "purpose": "研究稿 M027：复试评议与政治品德考核；学院评审组/招生领导小组；L：L5 复试完成后，G/H 才可能引用；学院原始评分/签署记录及有权结论；F030,F040；001/002/004；评审委员会结论非申请人上传件；缺 L/S/H，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M028",
    "name": "拟录取名单/公示/待录取状态；招生学院和学校",
    "purpose": "研究稿 M028：拟录取名单/公示/待录取状态；招生学院和学校；L：L5 形成后，I 才引用；官方公示更正历史、国家平台待录取回执；F041；001/002/004；区分拟录取、公示无异议与正式录取；缺 L/S，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M029",
    "name": "教育部录取检查结果；学校招生办/上级录取检查系统",
    "purpose": "研究稿 M029：教育部录取检查结果；学校招生办/上级录取检查系统；L：L6 招生审核后；学校有权部门签发的录取检查合格记录；F042；001；申请人不能代出具；缺 L/S，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M030",
    "name": "成都理工大学正式录取通知书；学校招生办",
    "purpose": "研究稿 M030：成都理工大学正式录取通知书；学校招生办；L：L6 录取检查合格后；校方核验的电子/纸质录取通知；F042；001/005；不能由拟录取名单代替，校方撤销则失效；缺 L/S，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M031",
    "name": "入学资格初审、复查及博士学籍电子注册结果；研究生院/学籍主管系统",
    "purpose": "研究稿 M031：入学资格初审、复查及博士学籍电子注册结果；研究生院/学籍主管系统；L：L6 报到并注册后；学校正式学籍数据及合法注册证明；F013,F043；001/005；博士注册前不认为发生博士身份转换；缺 L/S，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M032",
    "name": "撤回、补正、异议或申诉请求；申请人/经核授权代理人",
    "purpose": "研究稿 M032：撤回、补正、异议或申诉请求；申请人/经核授权代理人；C：K/J 用户触发时；校方受理系统认可的申请书/电子提交；F045；001/002/004；按案卷版本和事项类型绑定，代理权限不明 H；缺 N/H，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M033",
    "name": "学院/研究生院正式申诉答复、撤回处理及复核决定；有权机关",
    "purpose": "研究稿 M033：学院/研究生院正式申诉答复、撤回处理及复核决定；有权机关；L：学校受理并作出后，K 引用；有权机关发文或验证的电子决定；F045；001/002/005；申请人的请求不等于已获准撤回/复议；缺 L/S，损 U。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M034",
    "name": "案卷材料版本、引用来源、可信 actor/操作时间；业务系统形成的审计记录",
    "purpose": "研究稿 M034：案卷材料版本、引用来源、可信 actor/操作时间；业务系统形成的审计记录；N：所有受理/更新动作，由系统维护；经 Main 授权写入的不可混淆版本事件，不由用户截图代替；F001,F046,F047；技术合同待核；对原件做指纹+父子版本+失效链；缺 H/C，损 U，不再要求申请人上传。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  }
],
  sections:[{id:'r02-fact-review',name:'研究稿 R 规则逐项事实核验与人工审查',description:'每条 R 均为独立检查：未知政策或签发权限须转人工；不等于正式行政决定。',order:0,required:true,criteria:[
  {
    "id": "R001",
    "title": "当期政策快照；L0，全案",
    "requirement": "| R001｜当期政策快照；L0，全案 | SRC-001/002/004/007/008/009/011/012/013/014；F002,F003,F006–F008,F048；M001。校本政策必须具备真实正文、签发机构、年份/学院/专业、适用时间与版本指纹；监管方 SRC-013 仅能为平台程序性 Check 提供有效来源，不能填 2027 校本学术条件。2014、2022 和 2026 不能跨年当继任版 | T（具体 Check 所需有权政策已核且无未决冲突）→PASSFACT，政策 Owner 锁版；F（明确非此案）→NOTAPPLICABLE 并找当期源；U（2027 校本原文失联/两规冲突）→POLICYUNCONFIRMED，研究生院/学院确认 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R002",
    "title": "业务路径归属；L0，A–L/X",
    "requirement": "| R002｜业务路径归属；L0，A–L/X | SRC-001/004/005/008/013；F004,F005,F013,F048；M001,M003,M015。硕博连读、推免直博、申请—考核制、强基转段、培养/学籍后续事件按权利对象+原机构分路；“独立硕转博”须另有现行授权文本与决定文书 | T（A–K 两类真实招生路径）→PASSFACT，学院事实预审；F（X/强基等另项已证实）→NOTAPPLICABLE 并转对应机构；U（L 自称独立硕转博）→POLICYUNCONFIRMED，研究生院核对象 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R003",
    "title": "同一申请人及材料归属；L1、每次增材 A–L",
    "requirement": "| R003｜同一申请人及材料归属；L1、每次增材 A–L | SRC-001/004/005；F001,F009–F013,F046；M002,M003,M015,M034。按受控身份键+学号/来源院校与每页签发对象匹配；姓名同名不足。签章真实与否不由 OCR 决定 | T→PASSFACT，案卷受理岗；F（同名不同学号/身份证键、串件）→CONFLICT，学籍 Owner/材料岗；U→NEEDSMATERIAL / UNREADABLE / SOURCEUNAVAILABLE，分别找本人/读取岗/身份源 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R004",
    "title": "硕士在读身份与招生类别；L1，A–D",
    "requirement": "| R004｜硕士在读身份与招生类别；L1，A–D | SRC-001 第三节、SRC-002、SRC-005；F005,F011–F017；M003。2026 仅核本校全日制：硕一/二须学术型且非定向、硕三须非定向；报学术博士非定向，年级取该批次官方在读数据 | T→PASSFACT，学院初审；F（可信类别不满足）→NEEDSHUMANDECISION，学院有权审定；U→SOURCEUNAVAILABLE/CONFLICT，学籍部门核验，非本校或他路由交 R002 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R005",
    "title": "目标招生专业、学院和本人申请；L1，A–E",
    "requirement": "| R005｜目标招生专业、学院和本人申请；L1，A–E | SRC-001/002/004/011；F003,F006,F007,F034；M001,M004,M021。学校当年招生目录目标与申请/平台志愿一致；A–D 使用 2026 资格申请表，E 的平台志愿到 L4 才生成，L1 不追 M021 | T→PASSFACT，招生学院；F（专业/学院/年度相斥）→CONFLICT，学院招生办；U→NEEDSMATERIAL/POLICYUNCONFIRMED，材料岗/政策 Owner；直博 L1 无平台志愿 NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R006",
    "title": "硕士导师与拟报博士导师同意；L1，A–D",
    "requirement": "| R006｜硕士导师与拟报博士导师同意；L1，A–D | SRC-002 第二部分；F026,F027；M005,M006。两位职责主体的有效身份、同意内容、目标专业/批次与签署时间分别核验；允许同一人兼任须校方确认，但不把任何签名当审批 | T→PASSFACT，学院初审；F（明确不同意/错导师）→NEEDSHUMANDECISION，学院/导师核实；U→NEEDSMATERIAL/UNREADABLE/NEEDSHUMANDECISION，申请人/签署人 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R007",
    "title": "硕博连读专家推荐主体与资格；L1，A–D",
    "requirement": "| R007｜硕博连读专家推荐主体与资格；L1，A–D | SRC-001 第六节、SRC-002 第一部分；F027,F028；M006,M007。2026 环土至少两名该学科教授或相当职称者，按两名独立签发人计，其中一人是报考导师；推荐文件真伪/职称从权威源取 | T→PASSFACT，学院初审；F（只有一位/不具职称且可信）→NEEDSHUMANDECISION，学院核招生要求；U→NEEDSMATERIAL/UNREADABLE/SOURCEUNAVAILABLE，推荐人/人事管理人 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R008",
    "title": "硕一推免入硕或学业奖学金二选一；L1，A",
    "requirement": "| R008｜硕一推免入硕或学业奖学金二选一；L1，A | SRC-002 第一部分硕一；F017–F019；M003,M009。按 2026 年度原硕士入学推免录取或有效学业奖学金决定，不将“提名”“申请奖学金”算获奖；仅在 A 触发 | T（有任一可信路径）→PASSFACT，学院初审；F（两者被正式否认）→NEEDSHUMANDECISION，学院决定；U→SOURCEUNAVAILABLE/NEEDSMATERIAL，招生/奖助 Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R009",
    "title": "硕一拟录取后课程合格条件；L5–L6，A",
    "requirement": "| R009｜硕一拟录取后课程合格条件；L5–L6，A | SRC-002 第一部分硕一；F020,F041；M008,M028。仅拟录取后依本人批准培养计划核全部课程是否完成且合格；L1/L2 不得强索。拟录取被更正或课程成绩修改必须重验 | T→PASSFACT，学院/培养 Owner；F→NEEDSHUMANDECISION，招生学院核是否取消拟录取资格；U（后阶段已到）→SOURCEUNAVAILABLE/NEEDSMATERIAL，教务 Owner；未到→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R010",
    "title": "硕二课程完成及平均成绩；L1，B",
    "requirement": "| R010｜硕二课程完成及平均成绩；L1，B | SRC-002 第 1 页；F017,F020,F021；M003,M008。2026 环土须完成培养计划课程且平均达到“良好及以上”；使用校方换算办法和申请截止日冻结成绩，换算文件/任一成绩权属不明则不得简单按 80 分等自造阈值 | T→PASSFACT，学院初审；F（平均未达良好）→触发 R011，不直接否决；U→SOURCEUNAVAILABLE/NEEDSHUMANDECISION，培养/学院 Owner；未完成课程 F 交学院判定 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R011",
    "title": "硕二低成绩成果替代；L1–L2，B 且 R010 平均分比较为 F",
    "requirement": "| R011｜硕二低成绩成果替代；L1–L2，B 且 R010 平均分比较为 F | SRC-002 第 1 页；F024,F025；M011。核与专业相关高水平论文及允许署名位置或第一完成人国家发明专利；权属和“高水平”只引用 G06/S08-T05 有权认定，不因 OCR 标“核心”而批准 | T（仅成果事实已核且专业认定已有权威结论）→PASSFACT，学院审计关联；F（可信记录不满足）→NEEDSHUMANDECISION，学院作资格处理；U→NEEDSMATERIAL/NEEDSHUMANDECISION，成果 Owner/学院；R010 达标时→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R012",
    "title": "硕三课程及平均成绩；L1，C",
    "requirement": "| R012｜硕三课程及平均成绩；L1，C | SRC-002 第 1–2 页；F017,F020,F021；M003,M008。2026 环土完成培养计划课程，成绩按申请截止时点及官方换算核“良好及以上”；不存在 B 的低分成果替代分支 | T→PASSFACT，学院初审；F→NEEDSHUMANDECISION，学院核明确条件/例外 R017；U→SOURCEUNAVAILABLE/CONFLICT/NEEDSHUMANDECISION，培养/学院 Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R013",
    "title": "硕三成果必备；L1–L2，C",
    "requirement": "| R013｜硕三成果必备；L1–L2，C | SRC-002 第 1–2 页；F024,F025；M011。2026 环土核有权记录支持的相关高水平期刊论文规定署名或国家发明专利第一完成人；仅核事实及引用认可，不自行裁“高水平” | T→PASSFACT，学院初审；F→NEEDSHUMANDECISION，学院处置；U→NEEDSMATERIAL/SOURCEUNAVAILABLE/NEEDSHUMANDECISION，成果 Owner/学院；D 例外另走 R017 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R014",
    "title": "硕二/三英语路径；L1，B/C",
    "requirement": "| R014｜硕二/三英语路径；L1，B/C | SRC-002 第 1–2 页；F022,F023,F024；M010,M011。2026 环土四选一：CET-4≥450 / CET-6≥425；TOEFL≥70 / IELTS≥5.5 / GRE≥260；英语国家或地区学位+留服认证；符合规定署名的高水平英文专业论文。证书真伪、英文论文质量分别核实；不自加失效年限 | T→PASSFACT，学院初审；F（已核的各可用路径均不满足）→NEEDSHUMANDECISION，学院处理；U→NEEDSMATERIAL/SOURCEUNAVAILABLE/NEEDSHUMANDECISION，发证/成果 Owner；A 初期、E/F 未证当期要求→NOTAPPLICABLE/POLICYUNCONFIRMED |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R015",
    "title": "学术诚信和纪律/政审关联；L1 有当期要求、L5 考核",
    "requirement": "| R015｜学术诚信和纪律/政审关联；L1 有当期要求、L5 考核 | SRC-001 第九节、SRC-002 第一/二部分、SRC-004、SRC-005；F030；M012,M027。仅引用学校有关部门正式有权结论；无处分证明若规定未要求，不向申请人索敏感材料；“无记录”不可自动当“没有违反” | T（有权结论表明符合本阶段）→PASSFACT，学院；F（有权负面结论）→NEEDSHUMANDECISION，招生/纪检有权者；U→SOURCEUNAVAILABLE/NEEDSHUMANDECISION，原记录 Owner；尚无审查节点→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R016",
    "title": "健康资格结论；L1 或 L5/L6 依实际制度",
    "requirement": "| R016｜健康资格结论；L1 或 L5/L6 依实际制度 | SRC-001 第六、九、十节、SRC-002 第一部分、SRC-004；F029；M013。核学校指定/认可的体检合格结论与适用节点；不得读取无关病史，不预设所有申请人 L1 必交体检 | T→PASSFACT，有权体检审核岗；F→NEEDSHUMANDECISION，学校指定部门；U（当前规定必核）→NEEDSMATERIAL/SOURCEUNAVAILABLE，指定机构；未来时→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R017",
    "title": "特殊专长放宽申请及有权审定；L1–L2，D",
    "requirement": "| R017｜特殊专长放宽申请及有权审定；L1–L2，D | SRC-002 第 2 页；F024,F025,F044；M011,M014。申请人提出突出科研事实，报考博士导师和学院学术分委员会分别审核确认；放宽哪些指标、决定文书以正式文件为准；未提交例外则完全不触发 | T（存在合法有权的明确放宽结论）→PASSFACT 仅事实“存在放宽决定”，学院；F（有权明确不同意）→NEEDSHUMANDECISION，学院告知；U→NEEDSHUMANDECISION/SOURCEUNAVAILABLE，导师+学术分委员会；未申请→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R018",
    "title": "直博应届本科及来源学籍；L1，E/F",
    "requirement": "| R018｜直博应届本科及来源学籍；L1，E/F | SRC-001 第三节、SRC-004；F005,F011–F014,F031；M002,M015,M016。2026 核来源本科普通全日制应届、身份一致、学籍在线报告有效且属本人；F（2027）无校级文本时只做身份事实，不判当年资格 | T→PASSFACT，来源高校/招生学院；F（2026 非应届或身份不符）→NEEDSHUMANDECISION/CONFLICT，学院；U→NEEDSMATERIAL/SOURCEUNAVAILABLE，本人/来源校 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R019",
    "title": "来源高校正式推免资格；L1–L4，E/F",
    "requirement": "| R019｜来源高校正式推免资格；L1–L4，E/F | SRC-001 第三节、SRC-004、SRC-010（仅线索）；F032；M018。核具体 2026 年推荐免试资格是否由来源高校有权机构授予并在权威系统有效；S07-T09 的决定只读引用。不得以预推免预约、夏令营合格代替 | T（2026 权威资格生效）→PASSFACT，成都理工大学招生学院；F（2026 明确无资格）→NEEDSHUMANDECISION，来源高校/学院；U→SOURCEUNAVAILABLE/CONFLICT，来源校/推免平台；2027 资格判断须 R001 先过 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R020",
    "title": "直博本科成绩单；L1，E；F 待定",
    "requirement": "| R020｜直博本科成绩单；L1，E；F 待定 | SRC-004；F033；M017。核来源高校教务签章及课程记录归属与完整性，不设并无校本依据的 GPA/排名固定合格线；2027 是否必交须当期文本 | T（成绩事实与本人匹配）→PASSFACT，招生学院；F（有权成绩更正/跨人）→CONFLICT，来源教务；U→NEEDSMATERIAL/UNREADABLE/SOURCEUNAVAILABLE，本人/教务；2027 强制性→POLICYUNCONFIRMED |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R021",
    "title": "直博两名专家的签署主体/职称与规则冲突；L1，E；F 待定",
    "requirement": "| R021｜直博两名专家的签署主体/职称与规则冲突；L1，E；F 待定 | SRC-001 第六节基本条件 vs SRC-004 第三部分第4项；F027,F028；M019。2026 直博专项原文表述“2 位副教授及以上或相应职称、其中一份为报考导师”，2026 博士章程基本条件另表述“2 名正高”。若两名均已核正高、签名人独立且包含报考导师，则满足两种文本的共同交集；仅副高则必须由研究生院作书面适用解释。两名不同主体与同院当年有效签署分别核实；2027 原文未核 | T（两名独立正高、含导师、授权可核且当期表单有效，或有权机构已给适用解释并满足）→PASSFACT 仅材料事实，学院；F（明确一人/伪造签名）→NEEDSHUMANDECISION/CONFLICT；U（仅副高且无解释）→POLICYUNCONFIRMED，研究生院政策 Owner；其余缺/不可读/源失联各进相应代码；2027 → POLICYUNCONFIRMED |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R022",
    "title": "直博辅助外语、奖项、科研证明；L1，E；F 待定",
    "requirement": "| R022｜直博辅助外语、奖项、科研证明；L1，E；F 待定 | SRC-004；F022–F025；M020（可另关联 M011）。按 2026 工作办法及已取得材料核发证/成果事实；“有成果”不同于“符合未明的录取评分阈值”，不得按无来源条件将可选材料变成统一必交 | T（某条事实独立可信）→PASSFACT，学院；F（某条声称被官方否认）→CONFLICT/NEEDSHUMANDECISION，证书/成果 Owner；U→NEEDSMATERIAL（仅确认当前必需）/SOURCEUNAVAILABLE，本人/核验员；未声明可选项目→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R023",
    "title": "全国推免系统直博当前指定节点事件；L4–L5，E/F/H",
    "requirement": "| R023｜全国推免系统直博当前指定节点事件；L4–L5，E/F/H | SRC-001 第七节、SRC-004、SRC-013；F034,F039；M021。每次只核 checkTarget=platformEventType 的一条志愿、复试通知、待录取通知或本人确认事件，须含国家平台事件键、主体、时间、批次；2027 可依省级公告核平台通用程序，但不能因此判校本招生资格。直博不要求再次博士研招网缴费 | T（该节点源事件确实发生）→PASSFACT，学院只读；F（平台明确拒绝/逾时）→NEEDSHUMANDECISION；U（应已形成而不可查询）→SOURCEUNAVAILABLE，平台/招生办；未开放→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R024",
    "title": "硕博连读学院初审结论；L2–L3，A–D/G",
    "requirement": "| R024｜硕博连读学院初审结论；L2–L3，A–D/G | SRC-002 第二部分、SRC-006（仅公告存在）；F035；M022。核招生学院是否真正出具某申请人某批次初审结果，不能用模型“材料齐”生成学院初审批准 | T→PASSFACT（事实“有学院初审通过记录”），学院继续；F（正式未通过）→NEEDSHUMANDECISION，招生学院解释/申诉；U→SOURCEUNAVAILABLE/NOTAPPLICABLE（尚未审），招生办 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R025",
    "title": "学院初审公示生效事实；L3，A–D/G",
    "requirement": "| R025｜学院初审公示生效事实；L3，A–D/G | SRC-002 第二部分、SRC-006（仅证明学院曾公示）；F036；M023。仅核本申请人本年度有效公示/更正及异议处理状态；是否已向研究生院备案由独立 R041 核；学院公示不等于拟录取 | T（学院有效公示及所需异议结果可核）→PASSFACT，学院；F（撤回/有效异议未处理）→NEEDSHUMANDECISION，学院；U（档案当前应有但不可查）→SOURCEUNAVAILABLE，学院，未到→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R026",
    "title": "硕博连读博士网报事实；L4，G",
    "requirement": "| R026｜硕博连读博士网报事实；L4，G | SRC-001 第七节、SRC-003；F037；M025。核“硕博连读”招生方式、本人及专业、有效官方报名号；2026 网报 03-18—03-26，须同批次并已获初审；不得给 E/H 直博套此步骤 | T→PASSFACT，招生办；F（官方显示未报名/方式错误/逾期）→NEEDSHUMANDECISION，研招办处理；U→SOURCEUNAVAILABLE/CONFLICT，平台/学院；L1→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R027",
    "title": "硕博连读报名缴费有效事实；L4，G",
    "requirement": "| R027｜硕博连读报名缴费有效事实；L4，G | SRC-001 第七节、SRC-002 第二部分、SRC-003；F038；M026。仅核 2026 平台支付状态、180 元及报名时窗，校验和报考信息确认分别由 R042/R043；银行扣款截图不能替代平台支付成功 | T（平台确认支付成功且批次一致）→PASSFACT，研招办；F（平台确认欠费/超期）→NEEDSHUMANDECISION，招生办；U→SOURCEUNAVAILABLE，支付/招生平台；未到节点/直博→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R028",
    "title": "学院复试/面试结果；L5，G/H",
    "requirement": "| R028｜学院复试/面试结果；L5，G/H | SRC-001 第八/九节、SRC-002 第 2–3 页、SRC-004；F040；M027。2026 环土硕博面试满分 100、低于 60 不予录取，仅对有权学院考核成绩作只读数值事实比较；2026 直博沿其工作办法，不套该面试分数机制 | T（可信考核记录且达到适用规则）→PASSFACT，招生学院；F（官方明确低于 60 等）→NEEDSHUMANDECISION，学院依法处理；U→SOURCEUNAVAILABLE/NEEDSHUMANDECISION，考核组织；未考→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R029",
    "title": "复试政审/道德考核结论；L5，G/H",
    "requirement": "| R029｜复试政审/道德考核结论；L5，G/H | SRC-001 第九节、SRC-002 第 2–3 页、SRC-004；F030,F040；M027,M012。按有权考核组的单独政治/品德结论读取；2026 环土该项不计复试成绩但不合格则不予录取；不得自行推断敏感结论 | T（有权记载合格）→PASSFACT，学院；F（有权不合格）→NEEDSHUMANDECISION，学院办理；U→SOURCEUNAVAILABLE/NEEDSHUMANDECISION，考核组；未考→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R030",
    "title": "拟录取/公示决定是否真实存在；L5，G/H/I",
    "requirement": "| R030｜拟录取/公示决定是否真实存在；L5，G/H/I | SRC-001 第九节、SRC-002 第三部分、SRC-004；F041；M028。校验学院研究生招生委员会批准的名单或有效全国系统待录取状态、招生年份、公示更正与本人归属；2026 环土公示不少于 7 日属学院流程，工具不自行签发 | T（有权事件可核）→PASSFACT 仅指“有正式拟录取记录”，招生办；F（本人未列/被撤销）→NEEDSHUMANDECISION，学院解释；U→SOURCEUNAVAILABLE/CONFLICT，公告 Owner；L1→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R031",
    "title": "正式录取检查与通知书；L6，I",
    "requirement": "| R031｜正式录取检查与通知书；L6，I | SRC-001 第九节；F042；M029,M030。须校方录取检查合格并发正式录取通知，比较官网/学校权威记录与本人；拟录取名单不代替教育部录检。人事档案调转如学校流程另需，必须由权责部门核定，不擅自新增申请材料槽 | T（有效学校通知和检查回执）→PASSFACT 仅指记录可核，学校招生办；F（有权取消）→NEEDSHUMANDECISION，学校说明；U→SOURCEUNAVAILABLE，招生办；未到→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R032",
    "title": "报到、复查与博士学籍注册；L6，I/L",
    "requirement": "| R032｜报到、复查与博士学籍注册；L6，I/L | SRC-001 第十节、SRC-005；F013,F043；M031。录取后学校报到审查、入学后复查与学籍登记三事件分开；仅以研究生学籍 Owner 可核博士层次记录证明身份变化，不因硕博初审/拟录取改写硕士层次 | T（正式博士注册记录生效）→PASSFACT 仅引用学籍状态，学籍 Owner；F（正式未注册/取消）→NEEDSHUMANDECISION，学籍处；U→SOURCEUNAVAILABLE，学籍管理者；未报到→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R033",
    "title": "材料可读取且页码/签章可定位；各阶段，J",
    "requirement": "| R033｜材料可读取且页码/签章可定位；各阶段，J | SRC-001/002/004/011（材料类型依据）；F009,F024,F028,F034,F046；M002/M004/M007/M011/M019/M020/M034 及其余当期槽按触发。逐页解析质量、文件损坏、附件丢失、签章所在页与证据指针；OCR 置信度不当作源事实 | T（关键字段可读）→PASSFACT 仅“可读”，抽取岗；F（已交但不可读）→UNREADABLE，申请人/原件签发方补可核件；U（文件未到）→NEEDSMATERIAL 或后置 NOTAPPLICABLE，材料岗 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R034",
    "title": "跨材料/跨源事实相容性；各阶段，J",
    "requirement": "| R034｜跨材料/跨源事实相容性；各阶段，J | SRC-001/002/004/005；F002–F013,F020,F024,F032,F035–F043；M002,M003,M008,M011,M018,M022,M023,M028,M031,M034。比较同身份、年度、专业、Owner、有效时间与被更正情况；版本较新不自动代表权威更高 | T（同域资料相容）→PASSFACT，证据核验岗；F（相斥可信事实）→CONFLICT，两端 Owner 共同核对；U（源不通/字迹不清）→SOURCEUNAVAILABLE/UNREADABLE，源系统/读取岗 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R035",
    "title": "版本替换及定向失效；L1–L7，J/K",
    "requirement": "| R035｜版本替换及定向失效；L1–L7，J/K | SRC-001/002/005（阶段/对象）；F001,F046；M034 加被替换的任一 M。每次新增父版/指纹/签发者/时间，计算 M→F→R 反向依赖；改材料仅将依赖它的 R 置内部 STALERECHECKREQUIRED 并重新审，权威源撤销则强制关联失效 | T（新来源可信且依赖完整重算）→PASSFACT 仅审计一致，当前审核人；F（旧结论仍引用被替换页）→CONFLICT，证据 Owner；U（版本链不全）→NEEDSHUMANDECISION，案卷 Owner，不覆盖其他不受影响 R |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R036",
    "title": "一般招生申请撤回的有权处理决定；L2/L7，K",
    "requirement": "| R036｜一般招生申请撤回的有权处理决定；L2/L7，K | SRC-001/002/004（招生流程）、SRC-005（学籍救济）；F045,F047；M032,M033,M034。本人 M032 仅是请求；核 M033 有权答复是否准撤、适用批次、决定时点与撤销范围；2027 推免待录取平台取消事件单由 R044 核 | T（有权答复可核）→PASSFACT 仅答复真实，办理机构；F（仅有请求未决定）→NEEDSHUMANDECISION，学院；U→SOURCEUNAVAILABLE/POLICYUNCONFIRMED，校方流程 Owner；无撤回→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R037",
    "title": "招生申诉、复核与学籍救济分路；L7，K",
    "requirement": "| R037｜招生申诉、复核与学籍救济分路；L7，K | SRC-001 第十二节、SRC-002 第四部分、SRC-004、SRC-005 第四十四条；F045,F047；M032,M033,M034。招生首先学院处理，不服可向研究生院；学籍行政处理另循学籍办法；不得把学籍处理“10 日”施于招生申诉，复核结果须真正发文 | T（有权答复/复核文件可核）→PASSFACT 仅事实，招生学院/研究生院或学籍权责者；F（申诉仍处理中）→NEEDSHUMANDECISION，当前受理机构；U（时限与效力不明）→POLICYUNCONFIRMED/SOURCEUNAVAILABLE，权责机构；未申诉→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R038",
    "title": "人审身份、授权与签署来源；任何人工决定/材料替换",
    "requirement": "| R038｜人审身份、授权与签署来源；任何人工决定/材料替换 | SRC-001/002/004/005（机构权责来源）；F047；M034（可信 Host/Main 授权审计）。对 actorSubject/roleGrantRef/authorityScope、案件、动作、时点和来源决定 ID 校验；Renderer 传来的 teacher/admin 或 PDF 章不能授予权限 | T（宿主可信校验、校方决定外源可核）→PASSFACT 仅授权事件与决定引用可核，Host/Main/有权机构；F（权限不匹配）→NEEDSHUMANDECISION 且拒绝写学校决定，安全/业务 Owner；U→SOURCEUNAVAILABLE，认证/签章 Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R039",
    "title": "本阶段材料完整性而非全周期齐全；每个阶段 A–K",
    "requirement": "| R039｜本阶段材料完整性而非全周期齐全；每个阶段 A–K | SRC-001/002/003/004/005/011/012/013；F003,F004,F008,F048；M001–M034 按 §03.3 的情形与 L0–L7 选槽。checkTarget 必须是单个当期必需槽及义务主体（每槽独立 Check），不许用一个 R 总判吞掉多件问题；任何后生材料或未经证实的学院额外槽当前不报缺件 | T（该槽已有可核证据或合法替代）→PASSFACT 仅本槽齐备事实，材料岗；F（该槽当期确缺）→NEEDSMATERIAL，原材料持有人；U（政策/源/读取问题）→POLICYUNCONFIRMED/SOURCEUNAVAILABLE/UNREADABLE，对应 Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R040",
    "title": "邻接权威决定去重与独立转段阻断；L0–L7，A–L/X",
    "requirement": "| R040｜邻接权威决定去重与独立转段阻断；L0–L7，A–L/X | SRC-001/004/005/008/013（008 仅历史）；F004,F024,F025,F026,F027,F032,F040–F043,F048；M001,M006,M011,M018,M027,M029–M031。按当前要写入的单一决定对象核是否为本 ID：S07-T09 只提供本科推免决定，S08-T01、T06-T01/T02/T03 导师关系/任职/招生资质只读，G06 权属与 S08-T05 成果认定只读；开题至学位另归各项；独立硕转博制度未证，强基转段绝非本案 | T（引用目标与 Owner 无重复）→PASSFACT，模板 Owner；F（企图在本案重写外部有权决定）→CONFLICT/NOTAPPLICABLE 并转原 Owner；U（独立转段规则不明）→POLICYUNCONFIRMED，研究生院政策 Owner；G50 源码缺不阻止清楚的业务边界 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R041",
    "title": "研究生院初审备案事实；L3，G",
    "requirement": "| R041｜研究生院初审备案事实；L3，G | SRC-002 第二部分；F035；M024。只比本人/批次/学院/备案号的权威院级记录。不得以 R025 公示自动推定备案 | T（可信备案存在）→PASSFACT，研究生院；F（官方明确撤销备案）→NEEDSHUMANDECISION，研招办；U（应已备案但无可核通道）→SOURCEUNAVAILABLE，研究生院；尚未送备→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R042",
    "title": "硕博连读博士网报学历学籍校验事实；L4，G",
    "requirement": "| R042｜硕博连读博士网报学历学籍校验事实；L4，G | SRC-001 第七节、SRC-003；F038；M026。读取当年系统有权校验状态/原始记录，与 R027 的支付和 R043 信息确认区分 | T（有效校验回执）→PASSFACT，研招办；F（明确校验失败）→NEEDSHUMANDECISION，研招办核补认证要求；U→SOURCEUNAVAILABLE，研招平台；未到/直博→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R043",
    "title": "硕博连读博士网报本人信息确认事实；L4，G",
    "requirement": "| R043｜硕博连读博士网报本人信息确认事实；L4，G | SRC-001 第七节、SRC-003；F038；M026。核确认事件 ID、本人、批次及时间，不以报名号或已支付代替 | T（有效确认）→PASSFACT，研招办；F（官方未确认/误填）→NEEDSHUMANDECISION，研招办；U→SOURCEUNAVAILABLE；未到/直博→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R044",
    "title": "2027 推免直博待录取取消生效事实；L5/L7，F/H/K",
    "requirement": "| R044｜2027 推免直博待录取取消生效事实；L5/L7，F/H/K | SRC-013 第三部分（三）；F039,F045,F047；M021,M032,M033。按某一 platformOfferId 核本人提出取消请求→接收学校同意→本人在全国推免系统确认是否全部形成，必须是官方事件；此为程序核验，不代学校准撤，也非适用于硕博连读一般撤回 | T（三方对应事件及生效状态可核）→PASSFACT 仅取消事实，招生学院；F（只有请求/学校未同意）→NEEDSHUMANDECISION，招生单位；U→SOURCEUNAVAILABLE/CONFLICT，平台/招生办；未接受待录取或非推免→NOTAPPLICABLE |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  }
]}],
  policyVersionIds:[],
  stages:[
    {id:'intake',name:'登记与证据归类',kind:'auto-check',executorRole:'system',nextStageId:'fact-review',workflowOwner:'local'},
    {id:'fact-review',name:'证据与规则逐项核对',kind:'manual-review',executorRole:'reviewer',nextStageId:'human-decision',workflowOwner:'local'},
    {id:'human-decision',name:'政策、权限与最终结论人工确认',kind:'manual-review',executorRole:'teacher',workflowOwner:'local'},
  ],
  outputs:[
    {id:'r02-issue-feedback',kind:'item-feedback',audience:'reviewer'},
    {id:'r02-needed-materials',kind:'supplement-list',audience:'reviewer'},
  ],
  autoPassPolicy:{enabled:false},status:'draft',createdAt:'2026-10-24T00:00:00.000Z',
}

/** Research provenance only; never manufacture PolicyVersion or signed SourceRef. */
export const r02Metadata = {
  "templateId": "S08-T10",
  "name": "硕博连读、直博或培养层次转段资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S08-T10.md",
  "sourceDocumentSha256": "ccd53fbb9c9f1142fba4025860b8e6fe312f79b467dc32da103c94d6143fd266",
  "originalSourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/S08-T10.md",
  "originalSourceSha256": "777dcc875273ff521e75dac036732c64034ff79a76a4522cc53310d6785d6b32",
  "manifestSha256": "ccd53fbb9c9f1142fba4025860b8e6fe312f79b467dc32da103c94d6143fd266",
  "manifestHashCheck": true,
  "officialSchoolTemplate": false,
  "researchDate": "2026-10-23",
  "policyEvidenceStatus": "PARTIAL",
  "sourceEvidence": [
    {
      "srcId": "SRC-001",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-001：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-002",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-002：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-003",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-003：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-004",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-004：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-005",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-005：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-006",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-006：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-007",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-007：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-008",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-008：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-009",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-009：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-010",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-010：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-011",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-011：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-012",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-012：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-013",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-013：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-014",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-014：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    }
  ],
  "criteria": [
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-011",
        "SRC-012",
        "SRC-013",
        "SRC-014"
      ],
      "fieldIds": [
        "F002",
        "F003",
        "F006",
        "F007",
        "F008",
        "F048"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-008",
        "SRC-013"
      ],
      "fieldIds": [
        "F004",
        "F005",
        "F013",
        "F048"
      ],
      "materialSlotIds": [
        "M001",
        "M003",
        "M015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005"
      ],
      "fieldIds": [
        "F001",
        "F009",
        "F010",
        "F011",
        "F012",
        "F013",
        "F046"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M015",
        "M034"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "fieldIds": [
        "F005",
        "F011",
        "F012",
        "F013",
        "F014",
        "F015",
        "F016",
        "F017"
      ],
      "materialSlotIds": [
        "M003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-011"
      ],
      "fieldIds": [
        "F003",
        "F006",
        "F007",
        "F034"
      ],
      "materialSlotIds": [
        "M001",
        "M004",
        "M021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F026",
        "F027"
      ],
      "materialSlotIds": [
        "M005",
        "M006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F027",
        "F028"
      ],
      "materialSlotIds": [
        "M006",
        "M007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F017",
        "F018",
        "F019"
      ],
      "materialSlotIds": [
        "M003",
        "M009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F020",
        "F041"
      ],
      "materialSlotIds": [
        "M008",
        "M028"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F017",
        "F020",
        "F021"
      ],
      "materialSlotIds": [
        "M003",
        "M008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F024",
        "F025"
      ],
      "materialSlotIds": [
        "M011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F017",
        "F020",
        "F021"
      ],
      "materialSlotIds": [
        "M003",
        "M008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F024",
        "F025"
      ],
      "materialSlotIds": [
        "M011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F022",
        "F023",
        "F024"
      ],
      "materialSlotIds": [
        "M010",
        "M011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "fieldIds": [
        "F030"
      ],
      "materialSlotIds": [
        "M012",
        "M027"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "fieldIds": [
        "F029"
      ],
      "materialSlotIds": [
        "M013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F024",
        "F025",
        "F044"
      ],
      "materialSlotIds": [
        "M011",
        "M014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "fieldIds": [
        "F005",
        "F011",
        "F012",
        "F013",
        "F014",
        "F031"
      ],
      "materialSlotIds": [
        "M002",
        "M015",
        "M016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-010"
      ],
      "fieldIds": [
        "F032"
      ],
      "materialSlotIds": [
        "M018"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-004"
      ],
      "fieldIds": [
        "F033"
      ],
      "materialSlotIds": [
        "M017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "fieldIds": [
        "F027",
        "F028"
      ],
      "materialSlotIds": [
        "M019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-004"
      ],
      "fieldIds": [
        "F022",
        "F023",
        "F024",
        "F025"
      ],
      "materialSlotIds": [
        "M011",
        "M020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-013"
      ],
      "fieldIds": [
        "F034",
        "F039"
      ],
      "materialSlotIds": [
        "M021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-002",
        "SRC-006"
      ],
      "fieldIds": [
        "F035"
      ],
      "materialSlotIds": [
        "M022"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-002",
        "SRC-006"
      ],
      "fieldIds": [
        "F036"
      ],
      "materialSlotIds": [
        "M023"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R026",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "fieldIds": [
        "F037"
      ],
      "materialSlotIds": [
        "M025"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R027",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "fieldIds": [
        "F038"
      ],
      "materialSlotIds": [
        "M026"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "fieldIds": [
        "F040"
      ],
      "materialSlotIds": [
        "M027"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R029",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "fieldIds": [
        "F030",
        "F040"
      ],
      "materialSlotIds": [
        "M012",
        "M027"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "fieldIds": [
        "F041"
      ],
      "materialSlotIds": [
        "M028"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F042"
      ],
      "materialSlotIds": [
        "M029",
        "M030"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R032",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "fieldIds": [
        "F013",
        "F043"
      ],
      "materialSlotIds": [
        "M031"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R033",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-011"
      ],
      "fieldIds": [
        "F009",
        "F024",
        "F028",
        "F034",
        "F046"
      ],
      "materialSlotIds": [
        "M002",
        "M004",
        "M007",
        "M011",
        "M019",
        "M020",
        "M034"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R034",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "fieldIds": [
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
        "F020",
        "F024",
        "F032",
        "F035",
        "F036",
        "F037",
        "F038",
        "F039",
        "F040",
        "F041",
        "F042",
        "F043"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M008",
        "M011",
        "M018",
        "M022",
        "M023",
        "M028",
        "M031",
        "M034"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R035",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "fieldIds": [
        "F001",
        "F046"
      ],
      "materialSlotIds": [
        "M034"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R036",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "fieldIds": [
        "F045",
        "F047"
      ],
      "materialSlotIds": [
        "M032",
        "M033",
        "M034"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R037",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "fieldIds": [
        "F045",
        "F047"
      ],
      "materialSlotIds": [
        "M032",
        "M033",
        "M034"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R038",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "fieldIds": [
        "F047"
      ],
      "materialSlotIds": [
        "M034"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R039",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-011",
        "SRC-012",
        "SRC-013"
      ],
      "fieldIds": [
        "F003",
        "F004",
        "F008",
        "F048"
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
        "M022",
        "M023",
        "M024",
        "M025",
        "M026",
        "M027",
        "M028",
        "M029",
        "M030",
        "M031",
        "M032",
        "M033",
        "M034"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R040",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-008",
        "SRC-013"
      ],
      "fieldIds": [
        "F004",
        "F024",
        "F025",
        "F026",
        "F027",
        "F032",
        "F040",
        "F041",
        "F042",
        "F043",
        "F048"
      ],
      "materialSlotIds": [
        "M001",
        "M006",
        "M011",
        "M018",
        "M027",
        "M029",
        "M030",
        "M031"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R041",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F035"
      ],
      "materialSlotIds": [
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R042",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "fieldIds": [
        "F038"
      ],
      "materialSlotIds": [
        "M026"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R043",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "fieldIds": [
        "F038"
      ],
      "materialSlotIds": [
        "M026"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R044",
      "srcIds": [
        "SRC-013"
      ],
      "fieldIds": [
        "F039",
        "F045",
        "F047"
      ],
      "materialSlotIds": [
        "M021",
        "M032",
        "M033"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const
export const templateValidationIssues = validateTemplate(templateVersion)
