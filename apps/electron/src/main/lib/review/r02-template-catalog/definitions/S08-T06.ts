import type { TemplateVersion } from '@profer/shared'
import { validateTemplate } from '../../template-store'

export interface R02CriterionEvidenceMetadata { sectionId: string; criterionId: string; srcIds: string[]; evidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED' }
export interface R02Metadata {
  templateId: string; name: string; sourceDocumentPath: string; sourceDocumentSha256: string
  originalSourceDocumentPath: string; originalSourceSha256: string; manifestSha256: string; manifestHashCheck: boolean
  officialSchoolTemplate: false; researchDate: string; policyEvidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
  sourceEvidence: Array<{ srcId: string; evidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'; title: string }>
  criteria: R02CriterionEvidenceMetadata[]
}

export const templateVersion: TemplateVersion = {
  templateId: "S08-T06", version: 1, schemaVersion: 2, name: "学位论文预审、预答辩、送审资格与评阅材料审核",
  description: "本地研究模板 · 非校方正式模板。学位论文预审、预答辩、送审资格与评阅材料审核；仅供本地材料核验、证据覆盖检查和人工审阅建议，不构成学校正式审批。政策证据状态：PARTIAL。",
  catalogKind: 'builtin', sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 非校方正式模板；研究原件 docs/design/review-agent/business-templates/R02/research-original/S08-T06.md（原件文件 SHA-256=516a27d22ccc299d8c3589c8220d5528861659ef230002b9ef1c0c7f35ab9774）；审阅后来源文档 docs/design/review-agent/business-templates/R02/S08-T06.md（SHA-256=516a27d22ccc299d8c3589c8220d5528861659ef230002b9ef1c0c7f35ab9774）；政策证据 PARTIAL，禁止将模板 criterion 视为 PolicyVersion 或学校授权。", objectType: 'person', displayName: { template: "学位论文预审、预答辩、送审资格与评阅材料审核" },
  fields:     [
    {
      "key": "F001",
      "label": "学校受理号/本地案卷关联号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F001；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F002",
      "label": "学号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F002；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F003",
      "label": "法定/学籍姓名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F003；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F004",
      "label": "在读/结业/其他身份",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F004；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F005",
      "label": "硕士/博士",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F005；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F006",
      "label": "学术/专业/工程类专业博士",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F006；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F007",
      "label": "reference；I，培养单位/专业",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F007；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F008",
      "label": "reference；I，当前导师/校企导师组",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F008；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F009",
      "label": "reference；A，申请批次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F009；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F010",
      "label": "当前生命周期阶段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F010；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F011",
      "label": "毕业资格审查结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F011；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F012",
      "label": "list(reference)；I，上游有效决定",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F012；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F013",
      "label": "论文/工程博士实践成果路径",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F013；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F014",
      "label": "论文题目",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F014；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F015",
      "label": "reference/hash；T，提交论文版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F015；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F016",
      "label": "涉密分类/安全路由",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F016；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F017",
      "label": "格式检测完成状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F017；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F018",
      "label": "学院质量控制结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F018；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F019",
      "label": "导师同意预审",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F019；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F020",
      "label": "time；P，预审申请提出/受理时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F020；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F021",
      "label": "预审采用专家评阅/预答辩",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F021；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F022",
      "label": "预审专家人数/任职资格已核状态",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F022；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F023",
      "label": "list；P，每位预审专家是否同意送审",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F023；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F024",
      "label": "学院预审综合结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F024；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F025",
      "label": "range；P，再预审修改起止",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F025；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F026",
      "label": "reference；T，修改前后版本关联",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F026；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F027",
      "label": "导师确认修改/同意进入后续",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F027；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F028",
      "label": "reference；D，正式学术不端检测号/时间/版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F028；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F029",
      "label": "检测通过/复检/未通过/未知",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F029；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F030",
      "label": "学院准入与送审经办确认",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F030；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F031",
      "label": "reference；E，双盲送审文件版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F031；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F032",
      "label": "reference/time；E，第三方平台受理事件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F032；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F033",
      "label": "预计校外专家份数",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F033；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F034",
      "label": "实返专家意见份数",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F034；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F035",
      "label": "list；E，A/B/C/D 结论集合",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F035；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F036",
      "label": "综合处理去向",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F036；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F037",
      "label": "reference；E，评阅意见锚定论文版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F037；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F038",
      "label": "reference；X，A/B 修改说明与导师把关",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F038；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F039",
      "label": "reference/date；X，C/D 修改说明/起止",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F039；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F040",
      "label": "分委员会同意复增评",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F040；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F041",
      "label": "reference；X，复评/增评平台事件与结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F041；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F042",
      "label": "观点分歧申诉适格性",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F042；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F043",
      "label": "reference/time；X，观点分歧申诉受理号/时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F043；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F044",
      "label": "reference；X，同行复议及后续增评结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F044；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F045",
      "label": "结业生官方结业日期",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F045；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F046",
      "label": "integer/enum；X，结业后一次机会使用状态",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F046；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F047",
      "label": "reference；X，结业后五人预答辩结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F047；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F048",
      "label": "reference；X，研究生院特别送审批准",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F048；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F049",
      "label": "reference；H，涉密审批许可状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F049；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F050",
      "label": "enum/reference；H，机要送达/专人取回状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F050；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F051",
      "label": "reference；H，签批人服务端可信授权",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F051；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F052",
      "label": "reference/date；H，当期有效政策版本",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F052；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F053",
      "label": "enum/reference；H，撤回提出及学校处置",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F053；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F054",
      "label": "enum/list；H，材料取回、读取、权源冲突状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F054；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F055",
      "label": "list(reference)；H，旧新版材料及结论效力链",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F055；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F056",
      "label": "time；X，盲审/检测结果正式送达时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F056；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F057",
      "label": "reference/enum；H，学院当期质量控制/预审细则的有效版本与适用对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F057；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F058",
      "label": "enum/reference；H，第三方受理后稿件撤回、替换、重投的学校+平台分别确认状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F058；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    }
  ],
  materialSlots:     [
    {
      "id": "M001",
      "name": "申请人学籍身份、博士/硕士、学位类型、学院专业；学籍管理部门/校方权威记录",
      "purpose": "M001；申请人学籍身份、博士/硕士、学位类型、学院专业；学籍管理部门/校方权威记录；申请起当前必需、校方记录优先；校方学籍证明/审核回执；F002–F007/F013；SRC-001/002；学号＋生效时间绑定；系统 U，请学院核验；扫描件 B 不猜身份",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：申请人学籍身份、博士/硕士、学位类型、学院专业；学籍管理部门/校方权威记录",
        "关联字段：F002、F003、F004、F005、F006、F007、F013",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M001；申请人学籍身份、博士/硕士、学位类型、学院专业；学籍管理部门/校方权威记录；申请起当前必需、校方记录优先；校方学籍证明/审核回执；F002–F007/F013；SRC-001/002；学号＋生效时间绑定；系统 U，请学院核验；扫描件 B 不猜身份"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "已完成培养环节、毕业资格审查通过；培养单位/学校决定记录",
      "purpose": "M002；已完成培养环节、毕业资格审查通过；培养单位/学校决定记录；预审前当前必需、校方记录优先；校方签章资格通过单/系统权威查询；F011/F012；SRC-001 第一部分、SRC-002 第五条；同一学号及本次申请；缺权威 U/H，不以成绩单替代",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：已完成培养环节、毕业资格审查通过；培养单位/学校决定记录",
        "关联字段：F011、F012",
        "研究来源索引（非案卷 SourceRef）：SRC-001、SRC-002",
        "原文槽位定义：M002；已完成培养环节、毕业资格审查通过；培养单位/学校决定记录；预审前当前必需、校方记录优先；校方签章资格通过单/系统权威查询；F011/F012；SRC-001 第一部分、SRC-002 第五条；同一学号及本次申请；缺权威 U/H，不以成绩单替代"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "当前导师/双导师关系与授权；研究生管理部门/正式关系记录",
      "purpose": "M003；当前导师/双导师关系与授权；研究生管理部门/正式关系记录；预审/送审签署前当前必需、校方记录优先；学校正式导师分配或变更结论；F008/F051；SRC-001/004，邻接 S08-T01；以有效任命期约束签署；未知 U，不信签名字体",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：当前导师/双导师关系与授权；研究生管理部门/正式关系记录",
        "关联字段：F008、F051",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M003；当前导师/双导师关系与授权；研究生管理部门/正式关系记录；预审/送审签署前当前必需、校方记录优先；学校正式导师分配或变更结论；F008/F051；SRC-001/004，邻接 S08-T01；以有效任命期约束签署；未知 U，不信签名字体"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "预审申请、受理时间、申请主体；学生提交＋学院受理事件",
      "purpose": "M004；预审申请、受理时间、申请主体；学生提交＋学院受理事件；提出预审时当前必需；学校线上受理申请等效；F001/F020；SRC-001 第二部分；同一次申请/批次；学生可补 Q/B，学院受理未回 U",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：预审申请、受理时间、申请主体；学生提交＋学院受理事件",
        "关联字段：F001、F020",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M004；预审申请、受理时间、申请主体；学生提交＋学院受理事件；提出预审时当前必需；学校线上受理申请等效；F001/F020；SRC-001 第二部分；同一次申请/批次；学生可补 Q/B，学院受理未回 U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "供学院预审的论文正文与题目；学生提交的非涉密论文稿",
      "purpose": "M005；供学院预审的论文正文与题目；学生提交的非涉密论文稿；预审申请当前必需；涉密禁普通接收；学院授权论文版本库同版文件；F014/F015；SRC-001/002；同作者、文题与当前版本；缺 Q、不可读 B、涉密 H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：供学院预审的论文正文与题目；学生提交的非涉密论文稿",
        "关联字段：F014、F015",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M005；供学院预审的论文正文与题目；学生提交的非涉密论文稿；预审申请当前必需；涉密禁普通接收；学院授权论文版本库同版文件；F014/F015；SRC-001/002；同作者、文题与当前版本；缺 Q、不可读 B、涉密 H"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "预审前格式检测完成与整改线索；学生或学校格式服务持有",
      "purpose": "M006；预审前格式检测完成与整改线索；学生或学校格式服务持有；预审前条件必需/证明形式待核；经学院确认的格式检测完成状态，不必重复报告；F017；SRC-001 第二部分；必须绑定论文版本；暂缺 P/U，不能仅凭“建议一次”自动拒绝",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：预审前格式检测完成与整改线索；学生或学校格式服务持有",
        "关联字段：F017",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M006；预审前格式检测完成与整改线索；学生或学校格式服务持有；预审前条件必需/证明形式待核；经学院确认的格式检测完成状态，不必重复报告；F017；SRC-001 第二部分；必须绑定论文版本；暂缺 P/U，不能仅凭“建议一次”自动拒绝"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "学院形式/相关性/论文质量控制审查；学院有权审查人",
      "purpose": "M007；学院形式/相关性/论文质量控制审查；学院有权审查人；预审受理当前必需但本院具体表单待核；学院可信审批事件、同版审查表；F018；SRC-001 第二部分、SRC-006（流程）、SRC-014（参考表）；同版论文；学院系统 U、表单 B、标准不明 P",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：学院形式/相关性/论文质量控制审查；学院有权审查人",
        "关联字段：F018",
        "研究来源索引（非案卷 SourceRef）：SRC-001、SRC-006、SRC-014",
        "原文槽位定义：M007；学院形式/相关性/论文质量控制审查；学院有权审查人；预审受理当前必需但本院具体表单待核；学院可信审批事件、同版审查表；F018；SRC-001 第二部分、SRC-006（流程）、SRC-014（参考表）；同版论文；学院系统 U、表单 B、标准不明 P"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "导师已审阅且同意提交预审；导师真实签署",
      "purpose": "M008；导师已审阅且同意提交预审；导师真实签署；预审申请当前必需；校方认证导师电子签批或可核纸件；F019/F027/F051；SRC-001 第二部分；签署人身份＋文版；缺确认 U/H，OCR 不算签批",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：导师已审阅且同意提交预审；导师真实签署",
        "关联字段：F019、F027、F051",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M008；导师已审阅且同意提交预审；导师真实签署；预审申请当前必需；校方认证导师电子签批或可核纸件；F019/F027/F051；SRC-001 第二部分；签署人身份＋文版；缺确认 U/H，OCR 不算签批"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "预审组织形式及专家人数/身份资质；学院/专家组组织记录",
      "purpose": "M009；预审组织形式及专家人数/身份资质；学院/专家组组织记录；学院启动预审后后续产生；常规预审办理时需；学院授权专家名单/资格核验清单；F021/F022；SRC-001/004；关联本次预审场次；未组织 N；名单来源不明 U",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：预审组织形式及专家人数/身份资质；学院/专家组组织记录",
        "关联字段：F021、F022",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M009；预审组织形式及专家人数/身份资质；学院/专家组组织记录；学院启动预审后后续产生；常规预审办理时需；学院授权专家名单/资格核验清单；F021/F022；SRC-001/004；关联本次预审场次；未组织 N；名单来源不明 U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "预审专家逐人意见与最终院内处理结果；学院/专家组",
      "purpose": "M010；预审专家逐人意见与最终院内处理结果；学院/专家组；专家审查后后续产生，送审前需；校方有效预审结果记录、签章汇总；F023/F024/F025；SRC-001 第二部分；对应 M005 版本及场次；未结束 N；字迹 B/意见冲突 C",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：预审专家逐人意见与最终院内处理结果；学院/专家组",
        "关联字段：F023、F024、F025",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M010；预审专家逐人意见与最终院内处理结果；学院/专家组；专家审查后后续产生，送审前需；校方有效预审结果记录、签章汇总；F023/F024/F025；SRC-001 第二部分；对应 M005 版本及场次；未结束 N；字迹 B/意见冲突 C"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "预答辩问答、专家决议；学院/预答辩专家组",
      "purpose": "M011；预答辩问答、专家决议；学院/预答辩专家组；条件必需，后续产生：实际采取预答辩或强制专项时；学院预答辩记录/可信会议决议；F021–F024；SRC-001/004/002（结业专项）；场次/申请人；未采取该形式 NOT_APPLICABLE；缺决议 U",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：预答辩问答、专家决议；学院/预答辩专家组",
        "关联字段：F021、F022、F023、F024",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M011；预答辩问答、专家决议；学院/预答辩专家组；条件必需，后续产生：实际采取预答辩或强制专项时；学院预答辩记录/可信会议决议；F021–F024；SRC-001/004/002（结业专项）；场次/申请人；未采取该形式 NOT_APPLICABLE；缺决议 U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "按预审意见修改后的当前论文版本和逐项调整记录；学生、导师",
      "purpose": "M012；按预审意见修改后的当前论文版本和逐项调整记录；学生、导师；预审有意见后及送审前条件必需；学院认可的同版论文及修改对照；F015/F025–F027；SRC-001 第二部分；连接 M005、M010；新稿 Q/B；旧预审结论需版本适用性复核",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：按预审意见修改后的当前论文版本和逐项调整记录；学生、导师",
        "关联字段：F025、F026、F027、F015",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M012；按预审意见修改后的当前论文版本和逐项调整记录；学生、导师；预审有意见后及送审前条件必需；学院认可的同版论文及修改对照；F015/F025–F027；SRC-001 第二部分；连接 M005、M010；新稿 Q/B；旧预审结论需版本适用性复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "正式检测之前导师允许检测的签署；导师",
      "purpose": "M013；正式检测之前导师允许检测的签署；导师；普通非涉密正式检测阶段条件必需；校方有效检测导师同意记录；F027/F028；SRC-003 第七条及附件 1，效力待查；与最终检测版本一致；校方系统 U/政策 P，不能用格式检测代替",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：正式检测之前导师允许检测的签署；导师",
        "关联字段：F027、F028",
        "研究来源索引（非案卷 SourceRef）：SRC-003",
        "原文槽位定义：M013；正式检测之前导师允许检测的签署；导师；普通非涉密正式检测阶段条件必需；校方有效检测导师同意记录；F027/F028；SRC-003 第七条及附件 1，效力待查；与最终检测版本一致；校方系统 U/政策 P，不能用格式检测代替"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "正式学术不端检测结果及批准通过状态；研究生院/学院指定管理员",
      "purpose": "M014；正式学术不端检测结果及批准通过状态；研究生院/学院指定管理员；普通论文送审前当前必需，预审申请尚未形成不要求；校方检测审批表/管理员有权结果；F028/F029；SRC-001 第三部分、SRC-002 第五条、SRC-003；检测版本、时间、管理员；无结果 U、报告 B、阈值政策 P",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：正式学术不端检测结果及批准通过状态；研究生院/学院指定管理员",
        "关联字段：F028、F029",
        "研究来源索引（非案卷 SourceRef）：SRC-001、SRC-002、SRC-003",
        "原文槽位定义：M014；正式学术不端检测结果及批准通过状态；研究生院/学院指定管理员；普通论文送审前当前必需，预审申请尚未形成不要求；校方检测审批表/管理员有权结果；F028/F029；SRC-001 第三部分、SRC-002 第五条、SRC-003；检测版本、时间、管理员；无结果 U、报告 B、阈值政策 P"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "学院有权送审准入及导师同意送审；培养单位经办/校内审批",
      "purpose": "M015；学院有权送审准入及导师同意送审；培养单位经办/校内审批；送审准备当前必需，之前未生成为 N；学院认证送审审批或同等内部决定；F027/F030/F051；SRC-002 第五、六条、SRC-003 附件 2；锚定 M014、M016；仅学生上传的表格不等于批准",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：学院有权送审准入及导师同意送审；培养单位经办/校内审批",
        "关联字段：F027、F030、F051",
        "研究来源索引（非案卷 SourceRef）：SRC-002、SRC-003",
        "原文槽位定义：M015；学院有权送审准入及导师同意送审；培养单位经办/校内审批；送审准备当前必需，之前未生成为 N；学院认证送审审批或同等内部决定；F027/F030/F051；SRC-002 第五、六条、SRC-003 附件 2；锚定 M014、M016；仅学生上传的表格不等于批准"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "按双盲要求处理的正式送审电子论文；学生提交、学院把关",
      "purpose": "M016；按双盲要求处理的正式送审电子论文；学生提交、学院把关；已获准送审时当前必需，预审前未来项；培养单位论文送审仓库版本；F014/F015/F031；SRC-002 第六条；匿名副本与原版做受控映射；缺 Q/B，含作者身份 H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：按双盲要求处理的正式送审电子论文；学生提交、学院把关",
        "关联字段：F014、F015、F031",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M016；按双盲要求处理的正式送审电子论文；学生提交、学院把关；已获准送审时当前必需，预审前未来项；培养单位论文送审仓库版本；F014/F015/F031；SRC-002 第六条；匿名副本与原版做受控映射；缺 Q/B，含作者身份 H"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "第三方平台送审受理/上传回执；学院指定工作人员",
      "purpose": "M017；第三方平台送审受理/上传回执；学院指定工作人员；真正送出后后续产生；委托评阅平台授权回执/操作日志；F030/F032；SRC-002 第七、八条；回执唯一键绑定 M016，缺平台记录 U；学生不补造",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：第三方平台送审受理/上传回执；学院指定工作人员",
        "关联字段：F030、F032",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M017；第三方平台送审受理/上传回执；学院指定工作人员；真正送出后后续产生；委托评阅平台授权回执/操作日志；F030/F032；SRC-002 第七、八条；回执唯一键绑定 M016，缺平台记录 U；学生不补造"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "匿名校外专家意见及 A/B/C/D；第三方平台、学院保管",
      "purpose": "M018；匿名校外专家意见及 A/B/C/D；第三方平台、学院保管；外审返回后后续产生；评阅综合时必需；平台原始评阅书及校方核验记录；F033–F037/F056；SRC-002 第七至十、十四条；绑定本次送审回执与版本；未回 N/等待，不能报学生缺件",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：匿名校外专家意见及 A/B/C/D；第三方平台、学院保管",
        "关联字段：F033、F034、F035、F036、F037、F056",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M018；匿名校外专家意见及 A/B/C/D；第三方平台、学院保管；外审返回后后续产生；评阅综合时必需；平台原始评阅书及校方核验记录；F033–F037/F056；SRC-002 第七至十、十四条；绑定本次送审回执与版本；未回 N/等待，不能报学生缺件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "A/B（有 B 时）的逐项修改说明与导师把关；学生+导师",
      "purpose": "M019；A/B（有 B 时）的逐项修改说明与导师把关；学生+导师；返 A/B 以后条件必需；SRC-002 附件 1 或校方同等签署说明；F038/F051；SRC-002 第十条、附件 1；对应 M018 逐项、页码与新文版；无 B 可 NOT_APPLICABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：A/B（有 B 时）的逐项修改说明与导师把关；学生+导师",
        "关联字段：F038、F051",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M019；A/B（有 B 时）的逐项修改说明与导师把关；学生+导师；返 A/B 以后条件必需；SRC-002 附件 1 或校方同等签署说明；F038/F051；SRC-002 第十条、附件 1；对应 M018 逐项、页码与新文版；无 B 可 NOT_APPLICABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "C/D 后实质修改说明、修改时间及导师意见；学生+导师",
      "purpose": "M020；C/D 后实质修改说明、修改时间及导师意见；学生+导师；返 C/D 后条件必需、后续才有；SRC-002 附件 2 或校方同等材料；F039/F055；SRC-002 第十条、附件 2；对应未通过意见与新版论文；缺 Q/B，修订时间无法确定 H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：C/D 后实质修改说明、修改时间及导师意见；学生+导师",
        "关联字段：F039、F055",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M020；C/D 后实质修改说明、修改时间及导师意见；学生+导师；返 C/D 后条件必需、后续才有；SRC-002 附件 2 或校方同等材料；F039/F055；SRC-002 第十条、附件 2；对应未通过意见与新版论文；缺 Q/B，修订时间无法确定 H"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "C/D 修改后分委员会审阅同意复/增评；有权分委员会",
      "purpose": "M021；C/D 修改后分委员会审阅同意复/增评；有权分委员会；M020 完成后条件必需、后续产生；经核验分委员会决定/附件 2 签章；F040/F051；SRC-002 第十条、附件 2；绑定本轮修改稿；来源 U，用户截图不转成批准",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：C/D 修改后分委员会审阅同意复/增评；有权分委员会",
        "关联字段：F040、F051",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M021；C/D 修改后分委员会审阅同意复/增评；有权分委员会；M020 完成后条件必需、后续产生；经核验分委员会决定/附件 2 签章；F040/F051；SRC-002 第十条、附件 2；绑定本轮修改稿；来源 U，用户截图不转成批准"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "复评、增评平台受理及新评阅意见；学院平台经办",
      "purpose": "M022；复评、增评平台受理及新评阅意见；学院平台经办；经 M021 准入并平台处理后后续产生；平台复增评回执/专家书；F041/F035/F037；SRC-002 第十、十一条；同一送审轮次＋版本；未返回等待，非学生补件",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：复评、增评平台受理及新评阅意见；学院平台经办",
        "关联字段：F041、F035、F037",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M022；复评、增评平台受理及新评阅意见；学院平台经办；经 M021 准入并平台处理后后续产生；平台复增评回执/专家书；F041/F035/F037；SRC-002 第十、十一条；同一送审轮次＋版本；未返回等待，非学生补件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "学术观点分歧书面申诉与递交/受理；学生、导师、分委会",
      "purpose": "M023；学术观点分歧书面申诉与递交/受理；学生、导师、分委会；已收到一份 C/D 且争议适格时条件必需；SRC-002 附件 3 正式申诉表或认证等效记录；F042/F043/F056；SRC-002 第十一条、附件 3；收到意见后计 5 工作日；学生补 Q/B，适格性 H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：学术观点分歧书面申诉与递交/受理；学生、导师、分委会",
        "关联字段：F042、F043、F056",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M023；学术观点分歧书面申诉与递交/受理；学生、导师、分委会；已收到一份 C/D 且争议适格时条件必需；SRC-002 附件 3 正式申诉表或认证等效记录；F042/F043/F056；SRC-002 第十一条、附件 3；收到意见后计 5 工作日；学生补 Q/B，适格性 H"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "学术观点差异佐证及论文原文；学生、导师提出，分委会收",
      "purpose": "M024；学术观点差异佐证及论文原文；学生、导师提出，分委会收；提出 M023 时条件必需；有权分委会接收的申诉论证与原审版本；F014/F037/F042；SRC-002 第十一条；必须是原评阅版本而非事后换稿；不完整 Q/B",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：学术观点差异佐证及论文原文；学生、导师提出，分委会收",
        "关联字段：F014、F037、F042",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M024；学术观点差异佐证及论文原文；学生、导师提出，分委会收；提出 M023 时条件必需；有权分委会接收的申诉论证与原审版本；F014/F037/F042；SRC-002 第十一条；必须是原评阅版本而非事后换稿；不完整 Q/B"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "校内 3–5 位同行复议、分委会意见与必要增评；分委会/学院平台",
      "purpose": "M025；校内 3–5 位同行复议、分委会意见与必要增评；分委会/学院平台；申诉受理并审查后后续产生；SRC-002 附件 3 与校内决议，增评另有 M022；F044；SRC-002 第十一条、附件 3；逐条对应争议事实，结果未签发 N，不自动推断胜诉",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：校内 3–5 位同行复议、分委会意见与必要增评；分委会/学院平台",
        "关联字段：F044",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M025；校内 3–5 位同行复议、分委会意见与必要增评；分委会/学院平台；申诉受理并审查后后续产生；SRC-002 附件 3 与校内决议，增评另有 M022；F044；SRC-002 第十一条、附件 3；逐条对应争议事实，结果未签发 N，不自动推断胜诉"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "正式结业时间及既往一次送审资格记录；学籍管理/研究生院",
      "purpose": "M026；正式结业时间及既往一次送审资格记录；学籍管理/研究生院；结业后特殊送审申请当前必需、校方记录优先；校方结业事实、历次送审台账；F004/F045/F046；SRC-002 第十条七项；申请人＋结业日期＋历史次数；来源 U/H，不凭本人声明",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：正式结业时间及既往一次送审资格记录；学籍管理/研究生院",
        "关联字段：F004、F045、F046",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M026；正式结业时间及既往一次送审资格记录；学籍管理/研究生院；结业后特殊送审申请当前必需、校方记录优先；校方结业事实、历次送审台账；F004/F045/F046；SRC-002 第十条七项；申请人＋结业日期＋历史次数；来源 U/H，不凭本人声明"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "结业后一次送审的本人申请、承诺及导师意见；本人+导师",
      "purpose": "M027；结业后一次送审的本人申请、承诺及导师意见；本人+导师；特殊申请当前必需，与普通申请不互相替代；SRC-002 附件 4 学校专用表或其正式线上等效；F045/F046/F048；SRC-002 附件 4；原因及本人真实签名；缺 Q/B、签署真实性 H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：结业后一次送审的本人申请、承诺及导师意见；本人+导师",
        "关联字段：F045、F046、F048",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M027；结业后一次送审的本人申请、承诺及导师意见；本人+导师；特殊申请当前必需，与普通申请不互相替代；SRC-002 附件 4 学校专用表或其正式线上等效；F045/F046/F048；SRC-002 附件 4；原因及本人真实签名；缺 Q/B、签署真实性 H"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "结业后五位校内同行专家预答辩记录和分委会意见；分委会",
      "purpose": "M028；结业后五位校内同行专家预答辩记录和分委会意见；分委会；本人申请、导师同意后条件必需、后续产生；SRC-002 附件 4 专项预答辩页/有效校方决定；F047；SRC-002 第十条七项、附件 4；场次与专家 5 位，未组织 N、来源 U",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：结业后五位校内同行专家预答辩记录和分委会意见；分委会",
        "关联字段：F047",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M028；结业后五位校内同行专家预答辩记录和分委会意见；分委会；本人申请、导师同意后条件必需、后续产生；SRC-002 附件 4 专项预答辩页/有效校方决定；F047；SRC-002 第十条七项、附件 4；场次与专家 5 位，未组织 N、来源 U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "党委研究生工作部/研究生院批准结业后送审；该有权部门",
      "purpose": "M029；党委研究生工作部/研究生院批准结业后送审；该有权部门；M028 通过后条件必需、后续产生；SRC-002 附件 4 的部门意见或认证系统决定；F048/F051；SRC-002；未审批 N/U，不把等待说成学生未交批准件",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：党委研究生工作部/研究生院批准结业后送审；该有权部门",
        "关联字段：F048、F051",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M029；党委研究生工作部/研究生院批准结业后送审；该有权部门；M028 通过后条件必需、后续产生；SRC-002 附件 4 的部门意见或认证系统决定；F048/F051；SRC-002；未审批 N/U，不把等待说成学生未交批准件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M030",
      "name": "涉密学位论文正式批准与范围核验的白名单状态；保密主管",
      "purpose": "M030；涉密学位论文正式批准与范围核验的白名单状态；保密主管；涉密路由当前必需，普通业务不得索原件；保密机构单项授权的真/假/未知令牌；F016/F049；SRC-005 第十三至十八条、附件 2；不暴露密级/知悉范围/内容；不可验证 U/H，禁止普通上传",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：涉密学位论文正式批准与范围核验的白名单状态；保密主管",
        "关联字段：F016、F049",
        "研究来源索引（非案卷 SourceRef）：SRC-005",
        "原文槽位定义：M030；涉密学位论文正式批准与范围核验的白名单状态；保密主管；涉密路由当前必需，普通业务不得索原件；保密机构单项授权的真/假/未知令牌；F016/F049；SRC-005 第十三至十八条、附件 2；不暴露密级/知悉范围/内容；不可验证 U/H，禁止普通上传"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M031",
      "name": "涉密送审/取回的机要或专人转运状态；保密经办",
      "purpose": "M031；涉密送审/取回的机要或专人转运状态；保密经办；涉密审批、送审后后续产生；保密渠道授权状态确认；F050；SRC-005 第十八条；不存运单敏感细节；未执行 N，不作普通平台凭证",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：涉密送审/取回的机要或专人转运状态；保密经办",
        "关联字段：F050",
        "研究来源索引（非案卷 SourceRef）：SRC-005",
        "原文槽位定义：M031；涉密送审/取回的机要或专人转运状态；保密经办；涉密审批、送审后后续产生；保密渠道授权状态确认；F050；SRC-005 第十八条；不存运单敏感细节；未执行 N，不作普通平台凭证"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M032",
      "name": "有效年度/学院批次通知和修订；研究生院/学院",
      "purpose": "M032；有效年度/学院批次通知和修订；研究生院/学院；申请及改批时当前必需、校方记录优先；学校官网正式通知及有权学院后续通知；F009/F052；SRC-001；记录文号、生效区间、批次；无法取得 U/P，不按 2024 旧时点",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：有效年度/学院批次通知和修订；研究生院/学院",
        "关联字段：F009、F052",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M032；有效年度/学院批次通知和修订；研究生院/学院；申请及改批时当前必需、校方记录优先；学校官网正式通知及有权学院后续通知；F009/F052；SRC-001；记录文号、生效区间、批次；无法取得 U/P，不按 2024 旧时点"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M033",
      "name": "导师/培养环节/成果等邻接权威结论引用；S08-T01–T05、G50 的对应机构",
      "purpose": "M033；导师/培养环节/成果等邻接权威结论引用；S08-T01–T05、G50 的对应机构；仅当现行规章构成上游门槛时条件必需、校方记录优先；有权业务结果 ID/校内认证结论；F008/F011/F012；SRC-001/002；R02 总账与审计已核，G50 运行时映射待取；引用决议版本而非重复扫描原件；未连通 U/P",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：导师/培养环节/成果等邻接权威结论引用；S08-T01–T05、G50 的对应机构",
        "关联字段：F008、F011、F012",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M033；导师/培养环节/成果等邻接权威结论引用；S08-T01–T05、G50 的对应机构；仅当现行规章构成上游门槛时条件必需、校方记录优先；有权业务结果 ID/校内认证结论；F008/F011/F012；SRC-001/002；R02 总账与审计已核，G50 运行时映射待取；引用决议版本而非重复扫描原件；未连通 U/P"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M034",
      "name": "撤回请求及学校接受/拒绝事件；申请人及有权部门",
      "purpose": "M034；撤回请求及学校接受/拒绝事件；申请人及有权部门；申请人提出撤回才条件触发；带校方受理号的请求/正式处置；F053；本轮无明确校本程序 SRC；请求/决定分两段；权责不明 P/H，不得将提交视为生效",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：撤回请求及学校接受/拒绝事件；申请人及有权部门",
        "关联字段：F053",
        "原文槽位定义：M034；撤回请求及学校接受/拒绝事件；申请人及有权部门；申请人提出撤回才条件触发；带校方受理号的请求/正式处置；F053；本轮无明确校本程序 SRC；请求/决定分两段；权责不明 P/H，不得将提交视为生效"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M035",
      "name": "正式检测结果异议与复议认定；学生、导师、分委员会",
      "purpose": "M035；正式检测结果异议与复议认定；学生、导师、分委员会；非涉密检测后发生异议才条件触发；SRC-003 附件 5/学校有效复议事件；F028/F029/F056；SRC-003 第十一条；不与 M023 学术观点申诉混用；检测办法时效 P，资料 B",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：正式检测结果异议与复议认定；学生、导师、分委员会",
        "关联字段：F028、F029、F056",
        "研究来源索引（非案卷 SourceRef）：SRC-003",
        "原文槽位定义：M035；正式检测结果异议与复议认定；学生、导师、分委员会；非涉密检测后发生异议才条件触发；SRC-003 附件 5/学校有效复议事件；F028/F029/F056；SRC-003 第十一条；不与 M023 学术观点申诉混用；检测办法时效 P，资料 B"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M036",
      "name": "校内真实经办/审批人身份、单位及权限核验；学校身份/人事/权限主管",
      "purpose": "M036；校内真实经办/审批人身份、单位及权限核验；学校身份/人事/权限主管；每次使用有权签批时校方记录优先，非学生上传；统一认证、授权审计或可核校方决定；F008/F051；SRC-002/005 角色条款；签名＋角色＋时效＋权限范围；无法信任 U/H，Renderer 自报无效",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：校内真实经办/审批人身份、单位及权限核验；学校身份/人事/权限主管",
        "关联字段：F008、F051",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M036；校内真实经办/审批人身份、单位及权限核验；学校身份/人事/权限主管；每次使用有权签批时校方记录优先，非学生上传；统一认证、授权审计或可核校方决定；F008/F051；SRC-002/005 角色条款；签名＋角色＋时效＋权限范围；无法信任 U/H，Renderer 自报无效"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M037",
      "name": "版本链、替换原因、读取/权源日志；案卷经办与学校来源持有",
      "purpose": "M037；版本链、替换原因、读取/权源日志；案卷经办与学校来源持有；全程管理项；替换后条件必需；学校记录号/只读文件对照，带源文件定位；F015/F026/F054/F055；SRC-001/002；旧新版本及影响范围保持可追溯；损坏 B、冲突 C，不删除旧结论",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：版本链、替换原因、读取/权源日志；案卷经办与学校来源持有",
        "关联字段：F015、F026、F054、F055",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M037；版本链、替换原因、读取/权源日志；案卷经办与学校来源持有；全程管理项；替换后条件必需；学校记录号/只读文件对照，带源文件定位；F015/F026/F054/F055；SRC-001/002；旧新版本及影响范围保持可追溯；损坏 B、冲突 C，不删除旧结论"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M038",
      "name": "学院当期预审、质量控制、格式检测、硕士送审窗口与专项规则；学院发文/研院备案持有者",
      "purpose": "M038；学院当期预审、质量控制、格式检测、硕士送审窗口与专项规则；学院发文/研院备案持有者；学院参数需要作为硬判时才条件必需，申请初始不要求学生提交；学院正式发布文件及若规定须备案的确认；F007/F009/F017/F018/F052/F057；SRC-001/004；SRC-010 不作已核依据；精确到学院+专业/学位类型+批次+生效区间；未取得 P，不用学生口述；扫描版 B；不能读取时 U",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：学院当期预审、质量控制、格式检测、硕士送审窗口与专项规则；学院发文/研院备案持有者",
        "关联字段：F007、F009、F017、F018、F052、F057",
        "研究来源索引（非案卷 SourceRef）：SRC-001、SRC-010",
        "原文槽位定义：M038；学院当期预审、质量控制、格式检测、硕士送审窗口与专项规则；学院发文/研院备案持有者；学院参数需要作为硬判时才条件必需，申请初始不要求学生提交；学院正式发布文件及若规定须备案的确认；F007/F009/F017/F018/F052/F057；SRC-001/004；SRC-010 不作已核依据；精确到学院+专业/学位类型+批次+生效区间；未取得 P，不用学生口述；扫描版 B；不能读取时 U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M039",
      "name": "外审平台受理之后撤稿/替稿/重投的学校处理和平台反馈；校方指定经办/第三方平台",
      "purpose": "M039；外审平台受理之后撤稿/替稿/重投的学校处理和平台反馈；校方指定经办/第三方平台；发出 M034 且已有 M017 后未来条件事件，尚未处置不得报学生缺件；有权学校决定记录＋平台可核回执或经办留档，两者不可互相替代；F032/F053/F055/F058；SRC-002 第四、七、八条仅证经办组织，具体撤改规程未知；绑定原受理号、原送审版本和新申请/新轮次；未形成 N/WAIT_HUMAN；来源失联 U；冲突 C；政策不明 P",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredElements": [
        "原文证明目的：外审平台受理之后撤稿/替稿/重投的学校处理和平台反馈；校方指定经办/第三方平台",
        "关联字段：F032、F053、F055、F058",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M039；外审平台受理之后撤稿/替稿/重投的学校处理和平台反馈；校方指定经办/第三方平台；发出 M034 且已有 M017 后未来条件事件，尚未处置不得报学生缺件；有权学校决定记录＋平台可核回执或经办留档，两者不可互相替代；F032/F053/F055/F058；SRC-002 第四、七、八条仅证经办组织，具体撤改规程未知；绑定原受理号、原送审版本和新申请/新轮次；未形成 N/WAIT_HUMAN；来源失联 U；冲突 C；政策不明 P"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  sections:   [
    {
      "id": "rules-8-2",
      "name": "8.2 按独立核验对象逐 R 建模",
      "order": 0,
      "required": false,
      "criteria": [
        {
          "id": "R001",
          "title": "入口：T=本校研究生学位论文；F=本科或工程博士实践成果；?=路径未知",
          "requirement": "R001；入口：T=本校研究生学位论文；F=本科或工程博士实践成果；?=路径未知；SRC-001/002/004；F004–F007/F013；M001/M004；学校学段/申报路线核对；T→PASS_FACT；F→NOT_APPLICABLE并记录 SC-11/CCR；?→SOURCE_UNAVAILABLE，不强套论文；学院研究生经办/目录 Owner",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "身份：T=进入预审案卷；F=仅公开批次查询；?=校方身份无法核",
          "requirement": "R002；身份：T=进入预审案卷；F=仅公开批次查询；?=校方身份无法核；SRC-001/002；F001–F004；M001/M004；学号、校方姓名和案卷主体、受理人同人核；同名不同学号不合案；一致 PASS_FACT，异人 CONFLICT，学籍源失联 SOURCE_UNAVAILABLE；学籍/学院经办",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "学位类别与学院：T=本校博硕申请；F=非本校；?=学位类型不明",
          "requirement": "R003；学位类别与学院：T=本校博硕申请；F=非本校；?=学位类型不明；SRC-001/002/004；F004–F008；M001/M003/M033；层次、学术/专业、工程博士、在读/结业、学院从权威记录查；一致 PASS_FACT，混用政策 POLICY_UNCONFIRMED，记录失联 SOURCE_UNAVAILABLE；学院/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "批次政策：T=申请、改期或重提；F=无办理动作；?=变更通知效力不明",
          "requirement": "R004；批次政策：T=申请、改期或重提；F=无办理动作；?=变更通知效力不明；SRC-001/002/006–011；F009/F020/F052；M004/M032；公告文号、适用期间与后继通知比较；2024 旧日期、2023 已废办法不得覆盖 2026/2024 当前依据；有效 PASS_FACT，效力不明 POLICY_UNCONFIRMED，官网失联 SOURCE_UNAVAILABLE；学院/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "毕业资格：T=准备预审或送审；F=尚未申请；?=官方资格状态不可查",
          "requirement": "R005；毕业资格：T=准备预审或送审；F=尚未申请；?=官方资格状态不可查；SRC-001 第一部分/SRC-002 第五条；F010/F011；M002；只引用学校已作的毕业资格审查；真实通过 PASS_FACT，真实未通过 PASS_FACT(否定事实)+不得擅自推进，来源中断 SOURCE_UNAVAILABLE；不自己重算课程、开题、中期；学院资格审核岗",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "上游结论：T=当前校本门槛确需引用；F=该前置项不适用；?=门槛仍争议",
          "requirement": "R006；上游结论：T=当前校本门槛确需引用；F=该前置项不适用；?=门槛仍争议；SRC-001/002；F008/F011/F012；M003/M033；消费 S08-T01—T05/G50 决定 ID/版本，不再次授予导师资格、认定成果或开题；有效 PASS_FACT，无权源 SOURCE_UNAVAILABLE，必要性未知 POLICY_UNCONFIRMED；邻接业务 Owner/学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "论文版本：T=普通论文进入预审/送审收稿；F=涉密专线；?=保密未判",
          "requirement": "R007；论文版本：T=普通论文进入预审/送审收稿；F=涉密专线；?=保密未判；SRC-001/002；F002/F014–F016/F026；M005/M012/M016/M037；题目、身份、当前稿来源和版本指纹相对；同版可读 PASS_FACT，当期学生稿缺 NEEDS_MATERIAL，损坏 UNREADABLE，版本冲突 CONFLICT；学生/学院经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "涉密门禁：T=保密主管确认涉密或有风险；F=确证非涉密；?=保密状态不可核",
          "requirement": "R008；涉密门禁：T=保密主管确认涉密或有风险；F=确证非涉密；?=保密状态不可核；SRC-005/SRC-002 第十八条；F016/F049；M030/M036；仅取授权白名单状态，不接收涉密正文、专家实名或密级；可信涉密状态 PASS_FACT(路由事实)，无源 SOURCE_UNAVAILABLE，安全裁量 NEEDS_HUMAN_DECISION；普通流程暂停；保密主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "导师签批：T=需要导师当前有效审阅或同意；F=未到签署节点；?=任命无法核",
          "requirement": "R009；导师签批：T=需要导师当前有效审阅或同意；F=未到签署节点；?=任命无法核；SRC-001/002/004；F008/F019/F027/F051；M003/M008/M036；人员任命生效期+签名来源+论文版本核；有效 PASS_FACT，任命冲突 CONFLICT，Renderer 自报身份只得 NEEDS_HUMAN_DECISION；学院/导师",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "预审申请：T=本人已正式提出；F=草稿；?=学院受理状态不明",
          "requirement": "R010；预审申请：T=本人已正式提出；F=草稿；?=学院受理状态不明；SRC-001 第二部分；F001/F020；M004；本人提交、学院真实受理两事件独立存；提交事实 PASS_FACT，当前申请缺 NEEDS_MATERIAL，学院回执源失联 SOURCE_UNAVAILABLE；申请并非受理或通过；本人/学院经办",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "格式检测：T=准备提出预审；F=仅写作；?=学院证明形式不明",
          "requirement": "R011；格式检测：T=准备提出预审；F=仅写作；?=学院证明形式不明；SRC-001 第二部分；F017/F052；M006/M032；“建议检测一次”与“格式检测完成后申请”并存，不创造分数线；仅可证检测已发生 PASS_FACT；是否须正式回执未知 POLICY_UNCONFIRMED；学院质量控制岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "学院形式/相关性审查：T=预审受理；F=未申请；?=本院具体表未知",
          "requirement": "R012；学院形式/相关性审查：T=预审受理；F=未申请；?=本院具体表未知；SRC-001/SRC-006、SRC-014仅表单线索；F018/F052；M007；校方同版审查决定 PASS_FACT；学生自评不顶替；校方源无从核 SOURCE_UNAVAILABLE，要求表单效力不明 POLICY_UNCONFIRMED；学院质量控制岗",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "普通预审专家组：T=普通博硕且学院已组织；F=尚未组织或专项工程博士；?=身份不明",
          "requirement": "R013；普通预审专家组：T=普通博硕且学院已组织；F=尚未组织或专项工程博士；?=身份不明；SRC-001 第二部分；F005/F021/F022；M009；硕士校内合资格专家至少2名、博士至少3名，逐人以学院名册核；核到事实 PASS_FACT，名单失联 SOURCE_UNAVAILABLE，专家资格争议 NEEDS_HUMAN_DECISION；学院预审组织人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "工程博士专项组：T=工程专业博士论文进入预审；F=普通博硕；?=是否属专项未核",
          "requirement": "R014；工程博士专项组：T=工程专业博士论文进入预审；F=普通博硕；?=是否属专项未核；SRC-004 第六部分/SRC-001；F006/F013/F022；M003/M009/M011；核校企导师、校外/行业专家组成；不能仅套普通博士“3位校内”，专项与一般要求冲突 POLICY_UNCONFIRMED，核实事实 PASS_FACT；学院/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "预审专家意见：T=专家组完成评议；F=尚未评议；?=是否完毕不明",
          "requirement": "R015；预审专家意见：T=专家组完成评议；F=尚未评议；?=是否完毕不明；SRC-001 第二部分；F021–F024；M009/M010/M011；学院原始逐人意见对比汇总结论及论文版本；全同意仍须修改；一致 PASS_FACT、相反 CONFLICT，尚未生成 NOT_APPLICABLE/等待；学院预审组织人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "预审不同意重来：T=至少一专家不同意；F=全同意；?=意见不可核",
          "requirement": "R016；预审不同意重来：T=至少一专家不同意；F=全同意；?=意见不可核；SRC-001 第二部分；F023–F026；M010/M012/M009；从原意见/修改起点至再次申请须修改不少于2周；当前修改稿缺 NEEDS_MATERIAL，可靠时间不明 NEEDS_HUMAN_DECISION，新预审意见未形成不可报缺；学生/导师/学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "常规预答辩：T=学院选择以预答辩组织预审；F=选择专家评阅/仅“建议”；?=形式尚未决定",
          "requirement": "R017；常规预答辩：T=学院选择以预答辩组织预审；F=选择专家评阅/仅“建议”；?=形式尚未决定；SRC-001 第二部分/SRC-004；F021/F024；M009/M011；只对实际启动的预答辩检查有权记录，真实通过事实 PASS_FACT；未选 NOT_APPLICABLE；结业专项预答辩另见 R034；学院/专家组",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "预审后修改：T=预审结束拟送审；F=尚未预审；?=专家意见未返回",
          "requirement": "R018；预审后修改：T=预审结束拟送审；F=尚未预审；?=专家意见未返回；SRC-001 第二部分；F014/F015/F026/F027；M005/M008/M010/M012/M037；即使全同意也核修改稿与导师审阅版本；同版完整 PASS_FACT，学生新稿/说明缺 NEEDS_MATERIAL，旧签字覆盖新稿不明 NEEDS_HUMAN_DECISION；学生/导师/学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "正式学术不端检测：T=普通非涉密论文送审前；F=预审或涉密；?=制度版本不明",
          "requirement": "R019；正式学术不端检测：T=普通非涉密论文送审前；F=预审或涉密；?=制度版本不明；SRC-001/SRC-002 第五条/SRC-003现行性待核；F028/F029；M013/M014/M035；仅使用学校有权检测“通过”记录及所测稿，不直接拿旧复制比阈值拒绝或指认学术不端；核实 PASS_FACT，管理员源断 SOURCE_UNAVAILABLE，阈值效力不明 POLICY_UNCONFIRMED；学校检测经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "送审准入：T=学院拟办理普通正式送审；F=预审未完；?=权限不明",
          "requirement": "R020；送审准入：T=学院拟办理普通正式送审；F=预审未完；?=权限不明；SRC-001/SRC-002 第五/六条；F011/F019/F024/F027/F029/F030/F051；M002/M008/M010/M014/M015/M036；核毕业资格、导师同意、预审、检测前置事实；M015 必须由有权学院形成。事实核齐 PASS_FACT(待正式决定)，缺签批不自行批准，权限不明 NEEDS_HUMAN_DECISION；学院送审批准人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "匿名送审稿：T=已获准提交电子稿；F=预审或涉密；?=送审身份不明",
          "requirement": "R021；匿名送审稿：T=已获准提交电子稿；F=预审或涉密；?=送审身份不明；SRC-002 第六/十三条；F015/F031/F037；M016/M030；认证同版匿名副本和双盲要求；稿件可核 PASS_FACT，学生稿缺 NEEDS_MATERIAL，匿名暴露疑虑 NEEDS_HUMAN_DECISION；学院平台经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "第三方受理：T=学院正式上传；F=仅批准未上传；?=回执失联",
          "requirement": "R022；第三方受理：T=学院正式上传；F=仅批准未上传；?=回执失联；SRC-002 第四/七/八条/SRC-012限特定学院；F030–F032；M015/M016/M017；平台回执唯一号、提交人授权和论文版次核；真实受理 PASS_FACT，仍未上传 NOT_APPLICABLE，平台不可查 SOURCE_UNAVAILABLE；学生自报不算受理；学院平台经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "初评专家份数/等待：T=普通第三方已受理；F=未送出或涉密；?=轮次无从查",
          "requirement": "R023；初评专家份数/等待：T=普通第三方已受理；F=未送出或涉密；?=轮次无从查；SRC-002 第三/七/八条；F005/F033/F034；M017/M018；博士5份、硕士2份原始回评，齐全 PASS_FACT；未齐为 NOT_APPLICABLE(综合处理条件未达)+WAIT_EXTERNAL_REVIEW，不索学生评阅书；超时由学校启动增评；学院平台经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "A/B/C/D分类：T=该轮意见已齐；F=等待；?=版本或回执不明",
          "requirement": "R024；A/B/C/D分类：T=该轮意见已齐；F=等待；?=版本或回执不明；SRC-002 第九/十条；F034–F037；M017/M018；原始意见与该次送审稿对应：全A、A/B、含C无D、含D；分类事实 PASS_FACT，冲突 CONFLICT，不由AI判断论文质量或宣布准予答辩；学院学位经办",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "B修改：T=本轮仅A/B且含B；F=全A或含C/D；?=意见不可查",
          "requirement": "R025；B修改：T=本轮仅A/B且含B；F=全A或含C/D；?=意见不可查；SRC-002 第十条二项/附件1；F035/F038；M018/M019；作者按专家逐项答复、标章节页码，导师核签同版修改；完整 PASS_FACT，当前说明缺 NEEDS_MATERIAL，导师未证 NEEDS_HUMAN_DECISION；学生/导师",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "C无D修改：T=至少C且无D；F=无C/D或含D；?=等级不明",
          "requirement": "R026；C无D修改：T=至少C且无D；F=无C/D或含D；?=等级不明；SRC-002 第十条三、五项/附件2；F005/F035/F039；M018/M020；硕士修改≥2周、博士≥1个月；若由有权专家确认主要是错字/格式原因则统一≥3个月且不受理争议；记录与期限齐 PASS_FACT，原因不明 NEEDS_HUMAN_DECISION，材料缺 NEEDS_MATERIAL；学生/导师/分委会",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "D修改：T=本轮含D；F=无D；?=意见不可查",
          "requirement": "R027；D修改：T=本轮含D；F=无D；?=意见不可查；SRC-002 第十条四、五项/附件2；F005/F035/F039；M018/M020；硕士修改≥1个月、博士≥3个月；语言格式主因一律≥3个月。要求原专家复评且增聘同行增评；原始时间与说明齐 PASS_FACT，原因/时间不明 NEEDS_HUMAN_DECISION；学生/导师/学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "C/D后复增评批准：T=修改后拟重送；F=全A/B或仍修改；?=授权未证",
          "requirement": "R028；C/D后复增评批准：T=修改后拟重送；F=全A/B或仍修改；?=授权未证；SRC-002 第十条三四项/附件2；F027/F039/F040/F051；M020/M021/M036；对同版修订稿核导师与分委员会真实审阅同意，之后才可送平台；有权证据齐 PASS_FACT，截图或身份存疑 NEEDS_HUMAN_DECISION，校方源断 SOURCE_UNAVAILABLE；导师/分委员会/学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "复增评回传和循环：T=R028已批准且平台重送；F=未获准；?=原轮次不明",
          "requirement": "R029；复增评回传和循环：T=R028已批准且平台重送；F=未获准；?=原轮次不明；SRC-002 第十/十一条；F035/F037/F041；M018/M021/M022/M037；回执、同版复/增评、原专家或替代原因核；返回A/B按相应分支，返回C/D再回R026—R028；可证 PASS_FACT，未回 NOT_APPLICABLE+WAIT_EXTERNAL_REVIEW，版本冲突 CONFLICT；学院平台经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "观点争议适格：T=存在一份C或D且本人/导师主张真实学术观点差异；F=全A/B、结业后一次送审失败之特定禁止；?=有多份C/D、学术归因或送达日不明",
          "requirement": "R030；观点争议适格：T=存在一份C或D且本人/导师主张真实学术观点差异；F=全A/B、结业后一次送审失败之特定禁止；?=有多份C/D、学术归因或送达日不明；SRC-002 第十条五七项/第十一条及附件3；F035/F042/F043/F056；M018/M023/M024/M026；第十一条“原则上有且仅有一个C或D”，不是机器绝对封闭的例外；多份及疑难提交分委会决定。以正式收到意见起5工作日、表述主因不受理；申请存在事实 PASS_FACT，是否学术分歧由分委会定，起点未知 NEEDS_HUMAN_DECISION；本人/导师/分委员会",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "观点申诉同行复议：T=分委会正式受理；F=未申请/不适格；?=受理不明",
          "requirement": "R031；观点申诉同行复议：T=分委会正式受理；F=未申请/不适格；?=受理不明；SRC-002 第十一条/附件3；F042–F044；M023/M024/M025/M022；3—5名校内同行逐条给意见，确属学术分歧后由学院另聘2名增评；真实结论存在 PASS_FACT，仍评议中 NOT_APPLICABLE+等待，不能由AI认定胜诉；分委员会/学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "结业后一次送审资格：T=正式结业博硕申请特殊送审；F=普通在读；?=结业日期/次数无权源",
          "requirement": "R032；结业后一次送审资格：T=正式结业博硕申请特殊送审；F=普通在读；?=结业日期/次数无权源；SRC-002 第十条七项；F004/F005/F045/F046；M026；校方结业日硕士1年内、博士2年内、限1次申请，核历次台账；符合 PASS_FACT，不符合 PASS_FACT(否定事实)+交主管，不直接拒绝；记录失联 SOURCE_UNAVAILABLE；学籍经办/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R033",
          "title": "结业后本人申请：T=R032分支已启动；F=普通在读；?=申请主体不明",
          "requirement": "R033；结业后本人申请：T=R032分支已启动；F=普通在读；?=申请主体不明；SRC-002 第十条七项/附件4；F008/F045/F046/F051；M003/M027/M036；本人承诺、申请理由与导师同意分别核真；当前本人的申请表缺 NEEDS_MATERIAL，有效导师签署可核 PASS_FACT，权限存疑 NEEDS_HUMAN_DECISION；结业学生/导师/学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R034",
          "title": "结业后预答辩与专批：T=已提出且导师同意；F=普通学生；?=申请阶段未确认",
          "requirement": "R034；结业后预答辩与专批：T=已提出且导师同意；F=普通学生；?=申请阶段未确认；SRC-002 第十条七项/附件4；F047/F048/F051；M027/M028/M029/M036；先分委员会组织至少5名校内同行预答辩通过，再报党委研究生工作部、研究生院批准；已形成决定事实 PASS_FACT；申请初始尚无M028/M029为NOT_APPLICABLE/等待，不能报缺；分委员会/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R035",
          "title": "结业后单次外审与救济范围：T=R034批准并已送审；F=未获批准；?=送审身份不明",
          "requirement": "R035；结业后单次外审与救济范围：T=R034批准并已送审；F=未获批准；?=送审身份不明；SRC-002 第十条七项；F030/F032/F034/F035/F048；M026/M029/M017/M018；仍须学院真实送出、评阅；本次送审未通过不再受理复审或申诉，不得推断任何其他法定救济均消失。外审回传 PASS_FACT，未回 NOT_APPLICABLE+等待；学院/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R036",
          "title": "涉密送审交接：T=R008确属涉密且保密渠道启动；F=普通论文；?=保密授权未知",
          "requirement": "R036；涉密送审交接：T=R008确属涉密且保密渠道启动；F=普通论文；?=保密授权未知；SRC-005 第十三—二十条/SRC-002 第十八条；F016/F049/F050；M030/M031；仅校方保密人员提供“机要/专人已送达/取回”安全状态，严禁正文进普通OCR与互联网平台；状态可核 PASS_FACT，无法取得 SOURCE_UNAVAILABLE+安全停审；学校保密主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R037",
          "title": "正式检测结果异议：T=检测不利结论且提出复议；F=未检测、无异议或涉密；?=2021版时效不明",
          "requirement": "R037；正式检测结果异议：T=检测不利结论且提出复议；F=未检测、无异议或涉密；?=2021版时效不明；SRC-003 第十一条/附件5（现行性待核），SRC-001；F028/F029/F056；M014/M035；与外审学术观点 M023 严格分开；以校方现行检测复议制度为准，旧复制比或旧时限不自动拒绝；复议存在事实 PASS_FACT，时效未证 POLICY_UNCONFIRMED；学校检测经办/分委员会",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R038",
          "title": "普通撤回与重提：T=本人提出撤回/重提；F=无请求；?=授权和平台状态不明",
          "requirement": "R038；普通撤回与重提：T=本人提出撤回/重提；F=无请求；?=授权和平台状态不明；SRC-001/002仅流程背景，撤回制度未证实；F001/F010/F032/F053；M004/M017/M034/M036；“申请撤回”与学校“撤回已生效”分两事件；请求存在 PASS_FACT(仅请求)，准许/拒绝权责未知 POLICY_UNCONFIRMED+有权人工办理；重新提交须新受理号/版本，不能恢复旧有效性；本人/学院/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R039",
          "title": "论文更版与效力：T=论文、签批或专家意见版本变化；F=未变；?=无法追溯版本",
          "requirement": "R039；论文更版与效力：T=论文、签批或专家意见版本变化；F=未变；?=无法追溯版本；SRC-001/002/003（是否必须重检测仍待授权）；F014/F015/F026/F028/F031/F037/F054/F055；M005/M008/M010/M012/M014/M016/M018/M037；对照前后指纹、影响章节及审批所据版本；更改事实 PASS_FACT，错误关联 CONFLICT。保留旧结果但受影响R标失效待重核，不扩大至无关学籍决定；送审后是否能替换要校方裁定；学院/导师/平台经办",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R040",
          "title": "正式签发权限与决定记录：T=引用任一学校“已批准/否决/撤回生效”决定；F=仅学生申请或外部等待；?=校方身份来源不可达",
          "requirement": "R040；正式签发权限与决定记录：T=引用任一学校“已批准/否决/撤回生效”决定；F=仅学生申请或外部等待；?=校方身份来源不可达；SRC-001/002/004/005/SRC-012仅示某院岗位；F030/F040/F048/F051/F053；M003/M015/M021/M029/M034/M036；签发人服务端身份+岗位有效期+业务动作+案卷/稿本+时间+有权记录号原子核验；校方决定存在 PASS_FACT；Renderer自称teacher无效，权限不明 NEEDS_HUMAN_DECISION；学校权限管理员/相应审批岗位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R041",
          "title": "意见保密、读取与归档界限：T=评阅材料引用或答辩后档案出现；F=预审前无评阅书；?=材料阶段不明",
          "requirement": "R041；意见保密、读取与归档界限：T=评阅材料引用或答辩后档案出现；F=预审前无评阅书；?=材料阶段不明；SRC-002 第十三—十五条/SRC-013（后续交存）；F010/F054/F055；M018/M019/M020/M023/M025/M037；匿名意见只给授权人；与答辩档案一同归档、图书馆定稿不等于预审材料；当期稿可读归属正确 PASS_FACT，不可读 UNREADABLE，错阶段 NOT_APPLICABLE；学院经办/档案管理人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R042",
          "title": "学院/批次具体参数：T=拟以学院限期、格式检测、补件清单或专项细则作为当前门槛；F=仅引用已核校级共同要求；?=学院规定版本/备案/适用人群不明",
          "requirement": "R042；学院/批次具体参数：T=拟以学院限期、格式检测、补件清单或专项细则作为当前门槛；F=仅引用已核校级共同要求；?=学院规定版本/备案/适用人群不明；SRC-001 第一至三部分/SRC-004 第十部分/SRC-010仅入口；F007/F009/F017/F018/F052/F057；M007/M032/M038；逐核签发主体、适用学位类型、学院、学科、批次、生效区间及校级冲突；完整可追事实 PASS_FACT，来源失联 SOURCE_UNAVAILABLE，效力不明 POLICY_UNCONFIRMED，不先制造全校统一门槛；学院质量控制/研究生院政策管理人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R043",
          "title": "平台受理后撤稿/换稿/重投：T=已有 M017 受理且发生变更请求；F=未送出或没有变更；?=学校/平台撤改权责不明",
          "requirement": "R043；平台受理后撤稿/换稿/重投：T=已有 M017 受理且发生变更请求；F=未送出或没有变更；?=学校/平台撤改权责不明；SRC-002 第四/七/八条只确定上传/查询经办，无公开撤改细则；F015/F032/F053/F055/F058；M017/M034/M037/M039；将请求、校方允许/拒绝、平台执行/拒绝、原意见保留、所涉版本/轮次分别核；真实事件 PASS_FACT(事件事实)，未决 NEEDS_HUMAN_DECISION，规程不明 POLICY_UNCONFIRMED，绝不能学生新上传覆盖旧回执；学院有权经办/平台管理员/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R044",
          "title": "论文与实践成果路径的上位法/政策适用：T=工程类博士或其他专业学位出现“实践成果”路径声明；F=已确证常规论文路径；?=专业类别的校本授权不明",
          "requirement": "R044；论文与实践成果路径的上位法/政策适用：T=工程类博士或其他专业学位出现“实践成果”路径声明；F=已确证常规论文路径；?=专业类别的校本授权不明；SRC-004 第一、二、六至八部分/SRC-015 第二十五条/SRC-016 第三部分；F005/F006/F013/F052；M001/M004/M033；只能核“申请路径自报/官方记载”及学校授权是否存在；常规工程类博士实践成果不进入论文材料规则，其他专业学位不能凭 2026 国家改革文件直接自称已获学校开通；路由事实 PASS_FACT、校本开通未知 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；学院/研究生院/目录 Owner",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  policyVersionIds: [], stages:     [
    {
      "id": "phase-1",
      "name": "申请与身份/版本定位",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "phase-2"
    },
    {
      "id": "phase-2",
      "name": "毕业/培养资格前置",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "phase-3"
    },
    {
      "id": "phase-3",
      "name": "预审申请与学院组织",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "phase-4"
    },
    {
      "id": "phase-4",
      "name": "预审结果处理",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "phase-5"
    },
    {
      "id": "phase-5",
      "name": "送审准入复核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "phase-6"
    },
    {
      "id": "phase-6",
      "name": "委托评阅与意见等待",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "phase-7"
    },
    {
      "id": "phase-7",
      "name": "评阅结论处理与后续分流",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "phase-8"
    },
    {
      "id": "phase-8",
      "name": "补件/重审/撤回/复核",
      "kind": "handoff",
      "executorRole": "reviewer",
      "workflowOwner": "local"
    }
  ],
  outputs: [{ id: 'review-feedback', kind: 'item-feedback', audience: 'reviewer' }, { id: 'supplement-suggestions', kind: 'supplement-list', audience: 'student' }],
  autoPassPolicy: { enabled: false }, status: 'draft', createdAt: '2026-10-24T00:00:00.000Z'
}
export const templateValidationIssues = validateTemplate(templateVersion)
export const r02Metadata: R02Metadata = {
  templateId: "S08-T06", name: "学位论文预审、预答辩、送审资格与评阅材料审核", sourceDocumentPath: "docs/design/review-agent/business-templates/R02/S08-T06.md", sourceDocumentSha256: "516a27d22ccc299d8c3589c8220d5528861659ef230002b9ef1c0c7f35ab9774",
  originalSourceDocumentPath: "docs/design/review-agent/business-templates/R02/research-original/S08-T06.md", originalSourceSha256: "516a27d22ccc299d8c3589c8220d5528861659ef230002b9ef1c0c7f35ab9774", manifestSha256: "516a27d22ccc299d8c3589c8220d5528861659ef230002b9ef1c0c7f35ab9774", manifestHashCheck: true,
  officialSchoolTemplate: false, researchDate: '2026-10-24', policyEvidenceStatus: 'PARTIAL',
  sourceEvidence:   [
    {
      srcId: "SRC-001",
      evidenceStatus: "VERIFIED",
      title: "| SRC-001 | CDUT-VERIFIED；3 页全文已核 | 党委研究生工作部、研究生院、卓越工程师学院：《关于2026年博士、硕士研究生毕业答辩和学位申请工作安排的通知》，成理研〔2026〕1号。[校本 PDF](https://gra.cdut.edu.cn/__local/9/BC/89/D76B59272CC862FACEE252AAA16_C6BD07A3_4A2BD.pdf)"
    },
    {
      srcId: "SRC-002",
      evidenceStatus: "VERIFIED",
      title: "| SRC-002 | CDUT-VERIFIED；20 页全文含附件已核 | 成都理工大学：《成都理工大学研究生学位论文评阅实施办法》，成理校研〔2024〕41号。[校本 PDF](https://energy.cdut.edu.cn/__local/2/E4/72/CEA8B4F56BF6B55F199D43D6BE7_A5B0F6F4_5056D.pdf) | 第 2—19 条，PDF 第 "
    },
    {
      srcId: "SRC-003",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-003 | CURRENTITY-UNKNOWN；本轮直接读到 14 页旧制度和附件，后继效力未确定 | 成都理工大学：《成都理工大学研究生“学位论文学术不端行为检测系统”使用管理办法》，成理校研〔2021〕24号。[校本 PDF](https://cnae.cdut.edu.cn/__local/9/A3/FA/557DD63FCBC6081D698473CBF53_69A489D7"
    },
    {
      srcId: "SRC-004",
      evidenceStatus: "VERIFIED",
      title: "| SRC-004 | CDUT-VERIFIED；16 页全文已核 | 成都理工大学：《成都理工大学工程类博士专业学位研究生学位论文与申请学位实践成果实施细则（试行）》，成理校研〔2025〕17号。[校本 PDF](https://cnae.cdut.edu.cn/__local/7/DF/6D/BD6CDE5F1009E83D74AFDBDBF64_7BC2F78A_BFB2C.pdf) | "
    },
    {
      srcId: "SRC-005",
      evidenceStatus: "VERIFIED",
      title: "| SRC-005 | CDUT-VERIFIED；14 页全文含附表已核 | 成都理工大学：《成都理工大学涉密研究生和涉密学位论文管理办法（试行）》，成理校研〔2024〕22号。[校本 PDF](https://cnae.cdut.edu.cn/__local/6/00/E3/65182F44988453DBC26FEB60E83_8824077E_36E1D.pdf) | 第二、三章，尤其第十"
    },
    {
      srcId: "SRC-006",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-006 | CURRENTITY-UNKNOWN；旧稿报告流程图已核，本轮检索到页面但未重取图本体 | 成都理工大学研究生院：《申请硕士学位论文送审及申请论文答辩流程》。[页面](https://gra.cdut.edu.cn/info/1015/3750.htm) / [1 页流程图 PDF](https://gra.cdut.edu.cn/__local/3/15/7E/9B0F8"
    },
    {
      srcId: "SRC-007",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-007 | CURRENTITY-UNKNOWN；学校搜索索引能显示历史正文，直开网页返回 412 | 成都理工大学研究生院：《关于2023-2024学年第二学期研究生毕业答辩和学位申请工作安排的通知》。[校网页](https://gra.cdut.edu.cn/info/1007/4908.htm) | 2024-03-06，适用于旧春季批次；预审表附件未重取 | 用户线索核为真实历"
    },
    {
      srcId: "SRC-008",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-008 | CURRENTITY-UNKNOWN / 已废止；由新文件明确取代，旧 PDF 身份可核 | 成都理工大学：《成都理工大学研究生学位论文评阅实施办法》，成理校研〔2023〕6号。[旧校本 PDF](https://cnae.cdut.edu.cn/__local/B/F8/40/929A95B23EB7CF79723C14C7BF2_1CD1D65A_5FAA6.pdf) "
    },
    {
      srcId: "SRC-009",
      evidenceStatus: "VERIFIED",
      title: "| SRC-009 | CDUT-VERIFIED；1 页会议通报已核 | 成都理工大学党政办公室：《校长办公会纪要〔2025〕16号》，[官网 PDF](https://dbxb.cdut.edu.cn/__local/4/D3/B4/D990E9F4ED77354BA8E41329F13_46B56453_275D1.pdf) | 2025-07-09 会议、2025-07-11 通报；第 6"
    },
    {
      srcId: "SRC-010",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-010 | CURRENTITY-UNKNOWN；搜索索引核到 2025-08-26 同名发布和附件名称，直开正文返回 412，附件未读 | 成都理工大学能源学院：《成都理工大学硕士、博士学位授予工作实施细则》。[学院公开页](https://energy.cdut.edu.cn/info/1387/5006.htm) | 2025-08-26 页面；附件名“关于印发_成都理工大学硕士"
    },
    {
      srcId: "SRC-011",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-011 | CURRENTITY-UNKNOWN；旧版官方页面可检索，完整新旧效力未确定 | 成都理工大学：《成都理工大学硕士、博士学位授予工作实施细则（修订）》，成理校研〔2021〕26号。[学校信息公开页](https://dbxb.cdut.edu.cn/xxgkwz/info/1033/2552.htm) | 成文 2021-06-29，页面 2023-04-12；旧版第十二条"
    },
    {
      srcId: "SRC-012",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-012 | CURRENTITY-UNKNOWN；本轮搜索摘录显示岗位，直开页面返回 412，旧稿声称全文已核但本轮未重读 | 成都理工大学环境与土木工程学院：《研究生管理科》。[学院官网](https://cece.cdut.edu.cn/info/1028/9592.htm) | 2026-03-05 页面；该学院本科室职能 | 搜索摘录确认含校外论文送审职责；只证明该学院可能的经"
    },
    {
      srcId: "SRC-013",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-013 | CURRENTITY-UNKNOWN；图书馆 2026 通知索引可核、详页未逐段核 | 成都理工大学图书馆：《图书馆关于2026年毕业研究生学位论文提交工作的通知》。[学校图书馆官网](https://lib.cdut.edu.cn/info/1022/4818.htm) | 搜索索引为 2026-05-26（列表显示 05-30，有发布字段不一致）；图书馆收存环节 | 与"
    },
    {
      srcId: "SRC-014",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-014 | CURRENTITY-UNKNOWN；学校域名 PDF 索引可识别表单页，下载受限 | 成都理工大学传播科学与艺术学院站点所载《成都理工大学研究生学位论文形式审查表》所在 PDF。[校本 PDF 索引](https://ccsa.cdut.edu.cn/__local/C/E0/47/ECED9A1073CD49E6A8AE70CF49C_8820420B_50698.pd"
    },
    {
      srcId: "SRC-015",
      evidenceStatus: "PARTIAL",
      title: "| SRC-015 | GENERAL-RESEARCH / 现行国家法律；教育部官网全文可检 | 全国人大常委会：《中华人民共和国学位法》，2024-04-26 通过。[教育部转载原文](https://www.moe.gov.cn/jyb_sjzl/sjzl_zcfg/zcfg_jyfl/202404/t20240426_1127804.html) | 第二十五条等；2025-01-01 起施"
    },
    {
      srcId: "SRC-016",
      evidenceStatus: "PARTIAL",
      title: "| SRC-016 | GENERAL-RESEARCH / 新发布国家政策；教育部官网正文可检 | 国务院学位委员会办公室：《关于做好专业学位研究生以实践成果申请学位工作的意见》，学位办〔2026〕26号。[教育部原文](https://www.moe.gov.cn/srcsite/A22/moe_826/202610/t20261019_1455041.html) | 2026-09-14 成"
    }
  ],
  criteria:   [
    {
      "sectionId": "rules-8-2",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R008",
      "srcIds": [
        "SRC-005",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R014",
      "srcIds": [
        "SRC-004",
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R018",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R021",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R022",
      "srcIds": [
        "SRC-002",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R023",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R024",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R025",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R026",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R027",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R028",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R029",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R030",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R031",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R032",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R033",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R034",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R035",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R036",
      "srcIds": [
        "SRC-005",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R037",
      "srcIds": [
        "SRC-003",
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R038",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R039",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R040",
      "srcIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R041",
      "srcIds": [
        "SRC-002",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R042",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R043",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R044",
      "srcIds": [
        "SRC-004",
        "SRC-015",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
}
