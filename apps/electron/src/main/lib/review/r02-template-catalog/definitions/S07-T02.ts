import type { FieldSpec, MaterialSlotSpec, TemplateCriterionSpec, TemplateSectionSpec, TemplateVersion, WorkflowStageSpec } from '@profer/shared'

type EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
type R02Criterion = {
  sectionId: string
  criterionId: string
  title: string
  requirement: string
  execution: TemplateCriterionSpec['execution']
  srcIds: string[]
  evidenceStatus: EvidenceStatus
}

const fields: FieldSpec[] = [
  {
    "key": "studentName",
    "label": "学生姓名",
    "kind": "text",
    "required": false,
    "visibility": "public",
    "scope": "case"
  },
  {
    "key": "studentId",
    "label": "权威学籍键/学号",
    "kind": "text",
    "required": true,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "graduationCohort",
    "label": "毕业/申请届次",
    "kind": "text",
    "required": true,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "major",
    "label": "本科专业",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "undergraduateProgramType",
    "label": "普通本科/特殊办学类别",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "graduationStatusRef",
    "label": "已生效毕业状态引用",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "degreeApplicationType",
    "label": "申请情形/批次",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "currentRuleVersion",
    "label": "本次适用学位细则版本",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "academicEvidenceSummary",
    "label": "权威学业事实摘要",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "exceptionRef",
    "label": "例外/异议材料引用",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  },
  {
    "key": "priorDecisionRef",
    "label": "既有授位决定引用",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case"
  }
]
const materialSlots: MaterialSlotSpec[] = [
  {
    "id": "current-degree-rules",
    "name": "当前有效学位法与校本细则",
    "purpose": "政策依据槽；校本细则全文/生效条款未核前不启用硬阈值",
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
      "发文主体/文号",
      "施行/过渡条款",
      "适用对象"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "official-graduation-status",
    "name": "权威毕业状态引用",
    "purpose": "只读使用S07-T01/教务权威事实，不重审毕业资格",
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
      "学生主键",
      "毕业状态",
      "生效版本"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "degree-application",
    "name": "本次学士学位申请材料",
    "purpose": "原稿未提供完整字段/材料清单，按当前正式通知人工核对",
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
      "申请人/届次",
      "申请事项",
      "受理记录"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "academic-records",
    "name": "权威成绩/学业事实",
    "purpose": "仅对照当前有效规则与已生效记录，不推定阈值",
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
      "学生主键",
      "成绩/学分事实",
      "源版本"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "submission"
  },
  {
    "id": "special-case-records",
    "name": "特殊情形/正式认定",
    "purpose": "仅适用时由有权业务方提供可核记录",
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
      "情形类别",
      "有权认定",
      "生效时点"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  },
  {
    "id": "degree-decision-records",
    "name": "分委员会/学位评定委员会记录",
    "purpose": "后续正式决定由有权组织作出；本地模板只记录是否存在可核引用",
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
      "会议/决定编号",
      "签发主体",
      "对象/时点"
    ],
    "allowReuseAcrossSubjects": false,
    "requiredAt": "decision"
  }
]
const criteria: R02Criterion[] = [
  {
    "sectionId": "scope-routing",
    "criterionId": "undergraduate-only-routing",
    "title": "本科生学士学位范围路由",
    "requirement": "只适用于普通本科生学士学位授予资格与申请材料；继续教育、中外合作、研究生等路径先按当前正式范围路由，不混用阈值。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-009",
      "SRC-012"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "scope-routing",
    "criterionId": "identity-and-graduation-status",
    "title": "身份与毕业状态引用",
    "requirement": "确认学号、学段、专业、届别与权威毕业状态；S07-T01只读提供毕业与培养事实，本模板不修改学籍。",
    "execution": "semantic",
    "srcIds": [
      "SRC-002",
      "SRC-004",
      "SRC-007"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "policy-evidence",
    "criterionId": "current-rule-version",
    "title": "现行校本细则版本与效力",
    "requirement": "获取当前生效的成都理工大学学士学位授予工作细则及施行/过渡条款；2020旧文号冲突、2025会议纪要或2026新闻不能替代全文。缺失则政策未知。",
    "execution": "manual",
    "srcIds": [
      "SRC-005",
      "SRC-006",
      "SRC-010"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "policy-evidence",
    "criterionId": "application-material-presence",
    "title": "当届申请材料清单",
    "requirement": "逐项对照当届正式申请通知/材料清单与实际提交记录；原稿第06—14节未形成字段/材料字典，不得从模板外推材料或阈值。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-002",
      "SRC-006"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "policy-evidence",
    "criterionId": "academic-evidence-consistency",
    "title": "权威学业事实一致性",
    "requirement": "成绩、学分、课程和其他学业条件只引用权威记录与当前细则；无当前规则时整理事实并人工复核，不设分数线或学分阈值。",
    "execution": "semantic",
    "srcIds": [
      "SRC-001",
      "SRC-002"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "policy-evidence",
    "criterionId": "exception-and-special-category",
    "title": "例外与特殊类别",
    "requirement": "对特殊项目、荣誉/辅修、往届、延期、处分等例外仅核本次适用正式规定及有权认定；不从2024/2025名单或继续教育通知推定。",
    "execution": "manual",
    "srcIds": [
      "SRC-002",
      "SRC-007",
      "SRC-009",
      "SRC-010"
    ],
    "evidenceStatus": "UNCONFIRMED"
  },
  {
    "sectionId": "authority-boundary",
    "criterionId": "committee-and-role-boundary",
    "title": "学位评定组织与岗位边界",
    "requirement": "《学位法》第24条规定申请学士学位由学位评定委员会组织审查并作出是否授予的决议；学院建议名单/部门职能只证明流程事实，不替代最终决议。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-003",
      "SRC-004",
      "SRC-007"
    ],
    "evidenceStatus": "PARTIAL"
  },
  {
    "sectionId": "authority-boundary",
    "criterionId": "formal-decision-separation",
    "title": "正式授位决定分离",
    "requirement": "输出材料缺口、事实差异和待确认项；最终授位决定不得由本地模板、AI语义pass/fail或材料齐全自动生成。",
    "execution": "manual",
    "srcIds": [
      "SRC-001",
      "SRC-003",
      "SRC-006"
    ],
    "evidenceStatus": "PARTIAL"
  }
]
const sectionDefinitions: Array<Pick<TemplateSectionSpec, 'id' | 'name' | 'order' | 'required'>> = [
  {
    "id": "scope-routing",
    "name": "适用范围与权威事实",
    "order": 0,
    "required": true
  },
  {
    "id": "policy-evidence",
    "name": "当前制度与材料依据",
    "order": 1,
    "required": true
  },
  {
    "id": "authority-boundary",
    "name": "角色、例外与决定边界",
    "order": 2,
    "required": true
  }
]
const sources: Array<{ srcId: string; url: string; evidenceStatus: EvidenceStatus; note: string }> = [
  {
    "srcId": "SRC-001",
    "url": "https://www.moe.gov.cn/jyb_sjzl/sjzl_zcfg/zcfg_jyfl/202404/t20240426_1127804.html",
    "evidenceStatus": "VERIFIED",
    "note": "《中华人民共和国学位法》2025-01-01施行；第23—24条区分申请材料与学士授位决议"
  },
  {
    "srcId": "SRC-002",
    "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
    "evidenceStatus": "PARTIAL",
    "note": "成理校教〔2019〕18号本科生学籍办法；2026后续修订/与新学位法衔接待核"
  },
  {
    "srcId": "SRC-003",
    "url": "https://www.cdut.edu.cn/info/1366/7658.htm",
    "evidenceStatus": "PARTIAL",
    "note": "学校章程关于学位评定委员会职责的页面，会议程序与具体授权仍待核"
  },
  {
    "srcId": "SRC-004",
    "url": "https://aao.cdut.edu.cn/jgsz/kssz.htm",
    "evidenceStatus": "PARTIAL",
    "note": "教务处公开职责不等于个体批准权限"
  },
  {
    "srcId": "SRC-005",
    "url": "https://dbxb.cdut.edu.cn/__local/4/D3/B4/D990E9F4ED77354BA8E41329F13_46B56453_275D1.pdf",
    "evidenceStatus": "PARTIAL",
    "note": "2025校长办公会纪要只记审定相关事宜，不能倒推施行日期/条款"
  },
  {
    "srcId": "SRC-006",
    "url": "https://aao.cdut.edu.cn/info/1172/6945.htm",
    "evidenceStatus": "UNCONFIRMED",
    "note": "2026会议新闻提及修订后细则解读；页面直开HTTP 412，全文/施行条款未取得"
  },
  {
    "srcId": "SRC-007",
    "url": "https://cc.cdut.edu.cn/info/1066/4540.htm",
    "evidenceStatus": "PARTIAL",
    "note": "2026学院建议授位名单/公示，非校级最终授位决定"
  },
  {
    "srcId": "SRC-009",
    "url": "https://jjy.cdut.edu.cn/info/1040/2385.htm",
    "evidenceStatus": "PARTIAL",
    "note": "继续教育本科路径，仅用于排除范围，不移植成绩阈值"
  },
  {
    "srcId": "SRC-010",
    "url": "https://dbxb.cdut.edu.cn/xxgkwz/info/1007/1066.htm",
    "evidenceStatus": "UNCONFIRMED",
    "note": "2020细则文号在页面与学院引用间存在3号/4号差异，附件/废止关系未核"
  },
  {
    "srcId": "SRC-012",
    "url": "https://gra.cdut.edu.cn/__local/9/BC/89/D76B59272CC862FACEE252AAA16_C6BD07A3_4A2BD.pdf",
    "evidenceStatus": "PARTIAL",
    "note": "研究生学位流程仅用于与本科模板分流"
  }
]

const sections: TemplateSectionSpec[] = sectionDefinitions.map((section) => ({
  ...section,
  criteria: criteria
    .filter((item) => item.sectionId === section.id)
    .map((item) => ({
      id: item.criterionId,
      title: item.title,
      requirement: item.requirement,
      execution: item.execution,
      targetScope: 'subject',
    })),
}))

const stages: WorkflowStageSpec[] = [
  { id: 'intake', name: '材料登记与来源清点', kind: 'auto-check', executorRole: 'system', nextStageId: 'fact-review', workflowOwner: 'local' },
  { id: 'fact-review', name: '事实核对与补件建议', kind: 'manual-review', executorRole: 'reviewer', returnToStageId: 'intake', nextStageId: 'human-review', workflowOwner: 'local' },
  { id: 'human-review', name: '人工复核与待确认事项整理', kind: 'manual-review', executorRole: 'teacher', workflowOwner: 'local' },
]

export const S07_T02: TemplateVersion = {
  templateId: 'S07-T02',
  version: 1,
  schemaVersion: 2,
  status: 'draft',
  createdAt: '2026-10-24T00:00:00.000Z',
  name: "本科生学士学位授予资格与申请材料审核",
  description: "本地研究模板 · 非校方正式模板。仅为本科生学士学位授予材料与权威事实的保守预审壳；原研究稿仅完成第1轮，未配置校级授位阈值或最终决策。",
  catalogKind: 'builtin',
  sourceNote: 'R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非成都理工大学校方正式模板；SRC 为研究来源索引，不是案卷材料 SourceRef。政策不确定项只产生审阅建议并进入人工复核。',
  objectType: 'person',
  displayName: { template: '{{studentName}} · S07-T02 事实核验' },
  fields,
  materialSlots,
  sections,
  policyVersionIds: [],
  stages,
  outputs: [
    { id: 'fact-review-summary', kind: 'item-feedback', audience: 'reviewer' },
    { id: 'supplement-checklist', kind: 'supplement-list', audience: 'reviewer' },
  ],
  autoPassPolicy: { enabled: false },
}

export const r02Metadata = {
  templateId: 'S07-T02',
  name: "本科生学士学位授予资格与申请材料审核",
  sourceDocumentPath: 'docs/design/review-agent/business-templates/R02/S07-T02.md',
  sourceDocumentSha256: 'fb5e13f2580a34bebc46bcd9fbdb37e560c163966dcf14fe106df8d4c2c484ff',
  officialSchoolTemplate: false,
  researchAsOf: '2026-10-24',
  researchStatus: 'ROUND1_DRAFT',
  policyEvidenceStatus: 'PARTIAL' as const,
  sources,
  criteria: criteria.map(({ sectionId, criterionId, srcIds, evidenceStatus }) => ({
    sectionId,
    criterionId,
    srcIds: [...srcIds],
    evidenceStatus,
  })),
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = S07_T02
