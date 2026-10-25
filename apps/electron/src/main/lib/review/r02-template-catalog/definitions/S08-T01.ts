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
  templateId: "S08-T01", version: 1, schemaVersion: 2, name: "研究生导师选择、变更和双向确认审核",
  description: "本地研究模板 · 非校方正式模板。研究生导师选择、变更和双向确认审核；仅供本地材料核验、证据覆盖检查和人工审阅建议，不构成学校正式审批。政策证据状态：PARTIAL。",
  catalogKind: 'builtin', sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 非校方正式模板；研究原件 docs/design/review-agent/business-templates/R02/research-original/S08-T01.md（原件文件 SHA-256=0d073d33973247a136b105d04421f796c261f6e3b8cc3db83014c247b644874a）；审阅后来源文档 docs/design/review-agent/business-templates/R02/S08-T01.md（SHA-256=0d073d33973247a136b105d04421f796c261f6e3b8cc3db83014c247b644874a）；政策证据 PARTIAL，禁止将模板 criterion 视为 PolicyVersion 或学校授权。", objectType: 'person', displayName: { template: "研究生导师选择、变更和双向确认审核" },
  fields:     [
    {
      "key": "F001",
      "label": "本案唯一业务 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F001；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F002",
      "label": "办理情形码 A1/A2/A3/B/C/D/E/G1/G2/G3/H 及复合标签",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F002；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F003",
      "label": "申请修订版本；整数/版本戳",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F003；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F004",
      "label": "收件、提交时间；带时区时间戳",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F004；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F005",
      "label": "研究生唯一权威身份 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F005；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F006",
      "label": "研究生当前权威姓名/历史姓名关联",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F006；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F007",
      "label": "入学/在籍/休复学/毕业等状态；枚举+生效日",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F007；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F008",
      "label": "硕士/博士/直博及其他校方类别",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F008；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F009",
      "label": "全日制/非全日制培养方式",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F009；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F010",
      "label": "学术/专业学位类别",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F010；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F011",
      "label": "归属培养单位/学院及有效期；代码",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F011；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F012",
      "label": "学科/专业学位类别及代码",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F012；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F013",
      "label": "招生年级/双选批次；字符串/年度",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F013；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F014",
      "label": "国际学生身份与特殊管理路由标记",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F014；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F015",
      "label": "联合培养/双导师项目及权威方案版本；对象引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F015；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F016",
      "label": "当前有效导师关系登记 ID、状态、登记时点；对象引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F016；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F017",
      "label": "现/原导师权威身份 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F017；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F018",
      "label": "拟接收导师权威身份 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F018；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F019",
      "label": "拟导师的校内/校外身份、主/副导师角色；枚举+机构",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F019；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F020",
      "label": "学生申请意向、理由与必要范围摘要；文本/受限枚举",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F020；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F021",
      "label": "发起者可信主体、身份/代理/单位角色；对象引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F021；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F022",
      "label": "原导师的意见、签发主体和时间；枚举+引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F022；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F023",
      "label": "拟导师的接收意见及条件/时间；枚举+引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F023；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F024",
      "label": "对应时间的导师资格/指导权限决定引用；对象+有效区间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F024；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F025",
      "label": "可接收能力/招生指标适用结论及年度；引用/数值（条件配置）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F025；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F026",
      "label": "调解事项、过程状态、结论/未解决事实；对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F026；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F027",
      "label": "原导师无法履职的组织认可原因及起止事实；受限文本/引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F027；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F028",
      "label": "培养单位提出/审核/协商意见、签发人及时间；对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F028；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F029",
      "label": "正式校方决定编号、类型、签发主体和版本；对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F029；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F030",
      "label": "决定作出/送达/关系生效时点及各自依据；时间组",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F030；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F031",
      "label": "新导师关系登记 ID、前后差异和版本；对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F031；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F032",
      "label": "培养指导责任交接清单和当前状态；对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F032；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F033",
      "label": "受影响培养阶段及关联案例；数组引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F033；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F034",
      "label": "补件/撤回/申诉等程序动作类型与请求时间；枚举+时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F034；原稿标注枚举/复合枚举，但未确认完整选项集合；运行时不强制选项，须按对应规则人工核验。"
    },
    {
      "key": "F035",
      "label": "程序动作回执、受理或复核结论；对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F035；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F036",
      "label": "适用政策/当期通知版本和核实状态；来源引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F036；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F037",
      "label": "各证据的归属案、文件哈希、页字段、版本/状态；数组",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F037；字段语义来自研究模板字段字典。"
    },
    {
      "key": "F038",
      "label": "原案、并发案、被撤回/被复核决定的关联 ID；引用数组",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "displayHint": "原始字段编号 F038；字段语义来自研究模板字段字典。"
    }
  ],
  materialSlots:     [
    {
      "id": "M001",
      "name": "研究生身份、学段及当前培养状态",
      "purpose": "M001 研究生身份、学段及当前培养状态；学籍/录取主管机关；已认证学籍或录取记录、校方可验证摘录；当前必需 P0，A/B/C/D/E/A3；资料可由校方取；校方有权人员核真出具的记录/受理核验；不能以未经核验身份证照或自填姓名代替；F005–F015、F021；SRC-002/003，实际身份字段校方待核；学生身份主键+权威快照版本；不与别人的同名材料混用；校方源不能接 SU/HD；上传模糊 UNREADABLE；相异 CONFLICT，不拒绝身份不明者的知情咨询",
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
        "原文证明目的：研究生身份、学段及当前培养状态",
        "关联字段：F005、F006、F007、F008、F009、F010、F011、F012、F013、F014、F015、F021",
        "研究来源索引（非案卷 SourceRef）：SRC-002",
        "原文槽位定义：M001 研究生身份、学段及当前培养状态；学籍/录取主管机关；已认证学籍或录取记录、校方可验证摘录；当前必需 P0，A/B/C/D/E/A3；资料可由校方取；校方有权人员核真出具的记录/受理核验；不能以未经核验身份证照或自填姓名代替；F005–F015、F021；SRC-002/003，实际身份字段校方待核；学生身份主键+权威快照版本；不与别人的同名材料混用；校方源不能接 SU/HD；上传模糊 UNREADABLE；相异 CONFLICT，不拒绝身份不明者的知情咨询"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "已生效现/原导师关系基线",
      "purpose": "M002 已生效现/原导师关系基线；培养单位/研究生院权威导师关系登记或盖章确认的现状；条件必需 B/C/D/E P0，有旧关系的 A3；A1/A2 未建立者 NA；有权管理机关提供的校方记录摘录/原件核验；招生报考意向不能替代；F016/F017；SRC-001/003；归学生、导师组合及有效时间；变更后保留老快照；无校方登记查询 SU/HD；两份关系记录冲突 CF；模糊 UNREADABLE",
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
        "原文证明目的：已生效现/原导师关系基线",
        "关联字段：F016、F017",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M002 已生效现/原导师关系基线；培养单位/研究生院权威导师关系登记或盖章确认的现状；条件必需 B/C/D/E P0，有旧关系的 A3；A1/A2 未建立者 NA；有权管理机关提供的校方记录摘录/原件核验；招生报考意向不能替代；F016/F017；SRC-001/003；归学生、导师组合及有效时间；变更后保留老快照；无校方登记查询 SU/HD；两份关系记录冲突 CF；模糊 UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "学生本人初选或变更意向",
      "purpose": "M003 学生本人初选或变更意向；学生本人；学校认可的申请入口、书面申请、可核验签名/确认记录；当前必需 A/B 学生发起 P1；C/D 单位启动时按现行程序可后补/待核，E 可由 M011 承载；同一学生的经授权在线确认或正式认可表单；代提交须另核代理权；F002/F018/F020/F021；SRC-001、历史 SRC-004 仅对照；归当前案与请求版本，不与旧申请混用；敏感理由最小化；学生发起无意向证据 NM；签名不可核 HD；模糊 UNREADABLE",
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
        "原文证明目的：学生本人初选或变更意向",
        "关联字段：F002、F018、F020、F021",
        "研究来源索引（非案卷 SourceRef）：SRC-001、SRC-004",
        "原文槽位定义：M003 学生本人初选或变更意向；学生本人；学校认可的申请入口、书面申请、可核验签名/确认记录；当前必需 A/B 学生发起 P1；C/D 单位启动时按现行程序可后补/待核，E 可由 M011 承载；同一学生的经授权在线确认或正式认可表单；代提交须另核代理权；F002/F018/F020/F021；SRC-001、历史 SRC-004 仅对照；归当前案与请求版本，不与旧申请混用；敏感理由最小化；学生发起无意向证据 NM；签名不可核 HD；模糊 UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "当期初选/招生批次及校方组织安排",
      "purpose": "M004 当期初选/招生批次及校方组织安排；研究生院/培养单位；当届通知、已公布匹配安排/录取证明；条件必需 A1/A2 P0/P1，必须先证实存在适用通知；不是学生默认上传；校方公开通知或单位可信招生/分配记录；F008/F010/F012/F013/F015/F018/F025/F036；SRC-001/007；批次、年度、培养单位和发布日期；不跨届继承；未找到通告 PC/SU；不可读 UNREADABLE，不能因无公告自动判初选不合格",
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
        "原文证明目的：当期初选/招生批次及校方组织安排",
        "关联字段：F008、F010、F012、F013、F015、F018、F025、F036",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M004 当期初选/招生批次及校方组织安排；研究生院/培养单位；当届通知、已公布匹配安排/录取证明；条件必需 A1/A2 P0/P1，必须先证实存在适用通知；不是学生默认上传；校方公开通知或单位可信招生/分配记录；F008/F010/F012/F013/F015/F018/F025/F036；SRC-001/007；批次、年度、培养单位和发布日期；不跨届继承；未找到通告 PC/SU；不可读 UNREADABLE，不能因无公告自动判初选不合格"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "拟导师身份、岗位资格/指导权限及当期限制",
      "purpose": "M005 拟导师身份、岗位资格/指导权限及当期限制；学校导师管理主体或教师域 T06-T01/T02/T03 的有权结论持有人；并非 S08-T06；条件必需 P2/P4，候选明确时由可信源核；不作为学生上传责任；已签发的教师域岗位/招生/指标结论或校方有权人员核实，不以导师简介/职称单独替代；F018/F019/F024/F025；SRC-001，变更接收阈值待 SRC-003；精确导师身份、学段、年度、权限有效区间；资格更新需重核；无有效源 SU/HD；资格冲突 CF；在读转接与招生数值的适用性 PC",
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
        "原文证明目的：拟导师身份、岗位资格/指导权限及当期限制",
        "关联字段：F018、F019、F024、F025",
        "研究来源索引（非案卷 SourceRef）：SRC-001、SRC-003",
        "原文槽位定义：M005 拟导师身份、岗位资格/指导权限及当期限制；学校导师管理主体或教师域 T06-T01/T02/T03 的有权结论持有人；并非 S08-T06；条件必需 P2/P4，候选明确时由可信源核；不作为学生上传责任；已签发的教师域岗位/招生/指标结论或校方有权人员核实，不以导师简介/职称单独替代；F018/F019/F024/F025；SRC-001，变更接收阈值待 SRC-003；精确导师身份、学段、年度、权限有效区间；资格更新需重核；无有效源 SU/HD；资格冲突 CF；在读转接与招生数值的适用性 PC"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "原导师意见与已尽/未尽指导事实",
      "purpose": "M006 原导师意见与已尽/未尽指导事实；原导师或有权培养单位；带真实签发人/时间的意见；条件必需 B/C/D P2/P3，须先查情形；导师失联/争议可能不适用常规签名；经校方许可的认证在线确认、单位处理原导师无法表态情况的正式记录；F017/F022；SRC-001，普通变更历史参 SRC-004；原导师与原关系 ID、申请版本；不能复用到新次变更；在 C/D 特殊案不机械标拒绝；标 HD，等待单位处理；模糊 UNREADABLE",
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
        "原文证明目的：原导师意见与已尽/未尽指导事实",
        "关联字段：F017、F022",
        "研究来源索引（非案卷 SourceRef）：SRC-001、SRC-004",
        "原文槽位定义：M006 原导师意见与已尽/未尽指导事实；原导师或有权培养单位；带真实签发人/时间的意见；条件必需 B/C/D P2/P3，须先查情形；导师失联/争议可能不适用常规签名；经校方许可的认证在线确认、单位处理原导师无法表态情况的正式记录；F017/F022；SRC-001，普通变更历史参 SRC-004；原导师与原关系 ID、申请版本；不能复用到新次变更；在 C/D 特殊案不机械标拒绝；标 HD，等待单位处理；模糊 UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "拟接收导师的独立接收意愿",
      "purpose": "M007 拟接收导师的独立接收意愿；拟导师；认证确认、正式签署意见或项目约定有效记录；条件必需 P2，候选出现后取得；初始 P1 NA；校方认可的直接电子确认/纸本验真，项目共导协商须核规则；F018/F023；SRC-001/007，E 的表单待 SRC-005；导师身份、接收条件、意见版本、时间点；附条件不得抹去；未产生时 NA；进入 P2 仍无据 NM/HD；条件相互矛盾 CF",
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
        "原文证明目的：拟接收导师的独立接收意愿",
        "关联字段：F018、F023",
        "研究来源索引（非案卷 SourceRef）：SRC-001、SRC-005",
        "原文槽位定义：M007 拟接收导师的独立接收意愿；拟导师；认证确认、正式签署意见或项目约定有效记录；条件必需 P2，候选出现后取得；初始 P1 NA；校方认可的直接电子确认/纸本验真，项目共导协商须核规则；F018/F023；SRC-001/007，E 的表单待 SRC-005；导师身份、接收条件、意见版本、时间点；附条件不得抹去；未产生时 NA；进入 P2 仍无据 NM/HD；条件相互矛盾 CF"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "导学矛盾调解与双方权益保障过程",
      "purpose": "M008 导学矛盾调解与双方权益保障过程；培养单位经授权调解人员；纪要/协调结果/未解决事实；条件必需 C P3，初始反映不强求已调解；有权单位生成的非公开调解记录/处理决定，不强制学生披露隐私谈话全文；F026/F028；SRC-001 第十八条；争议案号、参与人、时间、保密范围；L3 限权；还未调解 NA；声称调解完成无记录 NM/HD；冲突由组织认定",
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
        "原文证明目的：导学矛盾调解与双方权益保障过程",
        "关联字段：F026、F028",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M008 导学矛盾调解与双方权益保障过程；培养单位经授权调解人员；纪要/协调结果/未解决事实；条件必需 C P3，初始反映不强求已调解；有权单位生成的非公开调解记录/处理决定，不强制学生披露隐私谈话全文；F026/F028；SRC-001 第十八条；争议案号、参与人、时间、保密范围；L3 限权；还未调解 NA；声称调解完成无记录 NM/HD；冲突由组织认定"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "导师不能继续履行指导职责的组织事实",
      "purpose": "M009 导师不能继续履行指导职责的组织事实；培养单位/人事等有权机关；离岗、研究计划变化或必要的履责情况说明；条件必需 D P1/P3，有权组织发起可在 P1 提供最小事实；校方正式人员状态/单位证明确认，不要求学生提交导师完整病历；F027/F021；SRC-001 第十八条；仅保留足以说明指导中断的事实、日期和有权来源；L3 隔离；隐私证据不可读/不可提供转有权单位核查；不机械要求医生诊断书，HD",
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
        "原文证明目的：导师不能继续履行指导职责的组织事实",
        "关联字段：F027、F021",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M009 导师不能继续履行指导职责的组织事实；培养单位/人事等有权机关；离岗、研究计划变化或必要的履责情况说明；条件必需 D P1/P3，有权组织发起可在 P1 提供最小事实；校方正式人员状态/单位证明确认，不要求学生提交导师完整病历；F027/F021；SRC-001 第十八条；仅保留足以说明指导中断的事实、日期和有权来源；L3 隔离；隐私证据不可读/不可提供转有权单位核查；不机械要求医生诊断书，HD"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "培养单位的正式申请、调解后处理或审核意见",
      "purpose": "M010 培养单位的正式申请、调解后处理或审核意见；有权培养单位；正式发文/审批意见/协商转接结论；C/D 若单位启动可在 P1 当前必核单位发起事实；一般 B/A 为 P3 后置；有权单位电子公文/可靠原件，不可用辅导员口述或普通邮件冒签；F002/F021/F026–F028；SRC-001/003；归单位、申请案/当前版本、签发人及权限；不跨单位复用；P1 一般申请 NA；C/D 无可证单位主体 HD；签章不清 UNREADABLE",
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
        "原文证明目的：培养单位的正式申请、调解后处理或审核意见",
        "关联字段：F026、F027、F028、F002、F021",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M010 培养单位的正式申请、调解后处理或审核意见；有权培养单位；正式发文/审批意见/协商转接结论；C/D 若单位启动可在 P1 当前必核单位发起事实；一般 B/A 为 P3 后置；有权单位电子公文/可靠原件，不可用辅导员口述或普通邮件冒签；F002/F021/F026–F028；SRC-001/003；归单位、申请案/当前版本、签发人及权限；不跨单位复用；P1 一般申请 NA；C/D 无可证单位主体 HD；签章不清 UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "国际研究生更换导师专用表单",
      "purpose": "M011 国际研究生更换导师专用表单；国际学生/培养学院/国际教育学院；2026-06 栏目指示之官方表单正文待取得；E 条件必需性未知；仅在学校明确要求该表时于 P1/P2 使用；若校方认可的等效线上申请可以承载 M003/意见，不得额外重复索取；F014/F020–F023/F028；SRC-005/009；核实表格版号、语言、各栏签发主体及申请版本后定；现阶段 PC，不因未上传直接拒绝国际生；模糊 UNREADABLE；原附件失联 SU",
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
        "原文证明目的：国际研究生更换导师专用表单",
        "关联字段：F020、F021、F022、F023、F014、F028",
        "研究来源索引（非案卷 SourceRef）：SRC-005",
        "原文槽位定义：M011 国际研究生更换导师专用表单；国际学生/培养学院/国际教育学院；2026-06 栏目指示之官方表单正文待取得；E 条件必需性未知；仅在学校明确要求该表时于 P1/P2 使用；若校方认可的等效线上申请可以承载 M003/意见，不得额外重复索取；F014/F020–F023/F028；SRC-005/009；核实表格版号、语言、各栏签发主体及申请版本后定；现阶段 PC，不因未上传直接拒绝国际生；模糊 UNREADABLE；原附件失联 SU"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "专项/联合培养双导师安排及权责",
      "purpose": "M012 专项/联合培养双导师安排及权责；项目主管培养单位；批准的项目方案、联合培养安排/校企职责文件；A3 当前条件必需 P0/P1（先证明确属该项目）；其他 NA；授权项目主管系统记录/批准的项目文书；不能用企业推荐信替代校方安排；F015/F019/F033；SRC-007；项目批次、校内外导师身份、职责分工和方案版本；无方案 SU/PC/HD；跨项目引用 CF；不可读 UNREADABLE",
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
        "原文证明目的：专项/联合培养双导师安排及权责",
        "关联字段：F015、F019、F033",
        "研究来源索引（非案卷 SourceRef）：SRC-007",
        "原文槽位定义：M012 专项/联合培养双导师安排及权责；项目主管培养单位；批准的项目方案、联合培养安排/校企职责文件；A3 当前条件必需 P0/P1（先证明确属该项目）；其他 NA；授权项目主管系统记录/批准的项目文书；不能用企业推荐信替代校方安排；F015/F019/F033；SRC-007；项目批次、校内外导师身份、职责分工和方案版本；无方案 SU/PC/HD；跨项目引用 CF；不可读 UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "学校有权决定和必要送达",
      "purpose": "M013 学校有权决定和必要送达；校内有权决定机关；正式决定文书/经核验审批回执；P4/H 后续才产生，申请初期 NA；可核验的学校审批系统决定，必须保留签发主体和权限链；F029/F030/F035/F038；SRC-001/003，旧 SRC-004 不作现行授权；决定号、案号、签发版本及送达时间；原决定不可被新上传覆盖；P1 不索取；声称批准但无 M013 则 NM/SU/HD；伪造/不匹配 CF",
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
        "原文证明目的：学校有权决定和必要送达",
        "关联字段：F029、F030、F035、F038",
        "研究来源索引（非案卷 SourceRef）：SRC-001、SRC-004",
        "原文槽位定义：M013 学校有权决定和必要送达；校内有权决定机关；正式决定文书/经核验审批回执；P4/H 后续才产生，申请初期 NA；可核验的学校审批系统决定，必须保留签发主体和权限链；F029/F030/F035/F038；SRC-001/003，旧 SRC-004 不作现行授权；决定号、案号、签发版本及送达时间；原决定不可被新上传覆盖；P1 不索取；声称批准但无 M013 则 NM/SU/HD；伪造/不匹配 CF"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "新旧导师关系正式登记",
      "purpose": "M014 新旧导师关系正式登记；研究生院/培养单位权威关系台账；登记前后记录/受权摘录；P5/H 后续才产生；校方有权出具的状态确认，不能以导师群聊/学院口头告知代替；F016/F031/F030；SRC-001/003；以学生/导师/生效时间/台账版本为主键；老记录只作历史；尚未登记 NA（P4）或 P5 SU/HD；决定与台账不一致 CF",
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
        "原文证明目的：新旧导师关系正式登记",
        "关联字段：F016、F031、F030",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M014 新旧导师关系正式登记；研究生院/培养单位权威关系台账；登记前后记录/受权摘录；P5/H 后续才产生；校方有权出具的状态确认，不能以导师群聊/学院口头告知代替；F016/F031/F030；SRC-001/003；以学生/导师/生效时间/台账版本为主键；老记录只作历史；尚未登记 NA（P4）或 P5 SU/HD；决定与台账不一致 CF"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "培养职责交接、指导安排转移",
      "purpose": "M015 培养职责交接、指导安排转移；培养单位、原/新导师及有权项目人员；交接单或正式指导责任安排；P5/H 后续才产生；不能预先提交；经培养单位认可的交接/新指导安排记录，具体格式未知；F032/F033；SRC-001 第十八条；专门交接制度待查；关联旧/新导师关系、案号、计划版本、每项移交完成时点；批准不自动生成交接；P5 无证明 NM/HD；科研权属转 G06",
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
        "原文证明目的：培养职责交接、指导安排转移",
        "关联字段：F032、F033",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M015 培养职责交接、指导安排转移；培养单位、原/新导师及有权项目人员；交接单或正式指导责任安排；P5/H 后续才产生；不能预先提交；经培养单位认可的交接/新指导安排记录，具体格式未知；F032/F033；SRC-001 第十八条；专门交接制度待查；关联旧/新导师关系、案号、计划版本、每项移交完成时点；批准不自动生成交接；P5 无证明 NM/HD；科研权属转 G06"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "受影响培养阶段的权威版本",
      "purpose": "M016 受影响培养阶段的权威版本；培养管理部门；培养计划、开题或中期等已发生阶段记录；条件必需 P3/P5，仅当变更确实影响该阶段；各相邻 S08 业务已形成的正式结论/校方记录；不再要求重复上传论文全套；F033/F038；SRC-001 第五条；具体阶段另取有效校规；按源业务 ID/版本/日期引用，不复制其审批结论为本案决定；阶段源中断 SU，影响不明 HD；无关联阶段 NA",
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
        "原文证明目的：受影响培养阶段的权威版本",
        "关联字段：F033、F038",
        "研究来源索引（非案卷 SourceRef）：SRC-001",
        "原文槽位定义：M016 受影响培养阶段的权威版本；培养管理部门；培养计划、开题或中期等已发生阶段记录；条件必需 P3/P5，仅当变更确实影响该阶段；各相邻 S08 业务已形成的正式结论/校方记录；不再要求重复上传论文全套；F033/F038；SRC-001 第五条；具体阶段另取有效校规；按源业务 ID/版本/日期引用，不复制其审批结论为本案决定；阶段源中断 SU，影响不明 HD；无关联阶段 NA"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "补件及修订材料",
      "purpose": "M017 补件及修订材料；当前申请人或材料有权签发者；重传附件、新的权威源版本/说明；G1 条件必需 P6，仅对确实发生更新的槽位；源系统新版本/有权主体补件；不强制整套重新提交；F003/F034/F037；SRC-008 仅为版本设计参考，实体证明效力仍沿被替换原 M 槽的政策 SRC；绑定原 M ID、新哈希、修订人及替代链，保留旧版审计；无更新 NA；更新不可读 UNREADABLE；被替换旧结论失效",
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
        "原文证明目的：补件及修订材料",
        "关联字段：F003、F034、F037",
        "研究来源索引（非案卷 SourceRef）：SRC-008",
        "原文槽位定义：M017 补件及修订材料；当前申请人或材料有权签发者；重传附件、新的权威源版本/说明；G1 条件必需 P6，仅对确实发生更新的槽位；源系统新版本/有权主体补件；不强制整套重新提交；F003/F034/F037；SRC-008 仅为版本设计参考，实体证明效力仍沿被替换原 M 槽的政策 SRC；绑定原 M ID、新哈希、修订人及替代链，保留旧版审计；无更新 NA；更新不可读 UNREADABLE；被替换旧结论失效"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "撤回请求及处理回执",
      "purpose": "M018 撤回请求及处理回执；有权申请人+受理机关；撤回请求、机关受理/确认回执；G2 条件必需 P6，只在提出撤回时；正式认可的在线/纸质撤回申请，确认结果必须另有可信受理；F021/F034/F035/F038；SRC-003 待核；绑定欲撤回的准确案号、版本和回执；不直接删除原材料；只有请求无机关确认→HD，不得写“已撤回”；渠道未知 PC",
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
        "原文证明目的：撤回请求及处理回执",
        "关联字段：F021、F034、F035、F038",
        "研究来源索引（非案卷 SourceRef）：SRC-003",
        "原文槽位定义：M018 撤回请求及处理回执；有权申请人+受理机关；撤回请求、机关受理/确认回执；G2 条件必需 P6，只在提出撤回时；正式认可的在线/纸质撤回申请，确认结果必须另有可信受理；F021/F034/F035/F038；SRC-003 待核；绑定欲撤回的准确案号、版本和回执；不直接删除原材料；只有请求无机关确认→HD，不得写“已撤回”；渠道未知 PC"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "正式异议/申诉请求",
      "purpose": "M019 正式异议/申诉请求；有权主体/学生申诉机构；异议陈述、被异议决定及正式受理证明；G3 条件必需 P6，确实申诉才需；校方认可的申诉提交与有权机构回执；与普通意见反馈区分；F021/F034/F035/F038；SRC-003 待核，SRC-004 仅历史；一申诉对应具体决定版本、送达时点、受理身份；申诉期限未证实→PC/HD；缺已作出决定则转核 M013；不可读 UNREADABLE",
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
        "原文证明目的：正式异议/申诉请求",
        "关联字段：F021、F034、F035、F038",
        "研究来源索引（非案卷 SourceRef）：SRC-003、SRC-004",
        "原文槽位定义：M019 正式异议/申诉请求；有权主体/学生申诉机构；异议陈述、被异议决定及正式受理证明；G3 条件必需 P6，确实申诉才需；校方认可的申诉提交与有权机构回执；与普通意见反馈区分；F021/F034/F035/F038；SRC-003 待核，SRC-004 仅历史；一申诉对应具体决定版本、送达时点、受理身份；申诉期限未证实→PC/HD；缺已作出决定则转核 M013；不可读 UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "复核或申诉处理结果",
      "purpose": "M020 复核或申诉处理结果；有权申诉/复核机关；书面决定/校方结果回执；G3 P6 后续才产生；经核实的正式申诉处理决定，AI 不能替代；F035/F038；SRC-009/010/011（校本原文及本案适用性仍待核）；原决定、复核决定及其生效/送达分别留版本；尚未出结果 NA；申请人自报“胜诉”不算，NM/SU/HD",
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
        "原文证明目的：复核或申诉处理结果",
        "关联字段：F035、F038",
        "研究来源索引（非案卷 SourceRef）：SRC-009",
        "原文槽位定义：M020 复核或申诉处理结果；有权申诉/复核机关；书面决定/校方结果回执；G3 P6 后续才产生；经核实的正式申诉处理决定，AI 不能替代；F035/F038；SRC-009/010/011（校本原文及本案适用性仍待核）；原决定、复核决定及其生效/送达分别留版本；尚未出结果 NA；申请人自报“胜诉”不算，NM/SU/HD"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "案卷收件、审查版本与程序事件日志",
      "purpose": "M021 案卷收件、审查版本与程序事件日志；系统唯一 Case/Run/Decision Owner 或校方认可回执；案卷记录/事件流水；P1–P6 当前程序底座，由系统生成而非学生上传；有权机关受理回执、可核验签名的历史凭证；不得伪造运行事实；F001/F003/F004/F021/F035/F037/F038；技术参考 SRC-008 已读取，但不是实机事件；每次事件 immutable 版本、actor 权限、关联 M/F；不将旧 run@rev 冒充真实 Run；无正式回执则标“草稿/未证实受理”；源失联 SU，异常转 HD",
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
        "原文证明目的：案卷收件、审查版本与程序事件日志",
        "关联字段：F001、F003、F004、F021、F035、F037、F038",
        "研究来源索引（非案卷 SourceRef）：SRC-008",
        "原文槽位定义：M021 案卷收件、审查版本与程序事件日志；系统唯一 Case/Run/Decision Owner 或校方认可回执；案卷记录/事件流水；P1–P6 当前程序底座，由系统生成而非学生上传；有权机关受理回执、可核验签名的历史凭证；不得伪造运行事实；F001/F003/F004/F021/F035/F037/F038；技术参考 SRC-008 已读取，但不是实机事件；每次事件 immutable 版本、actor 权限、关联 M/F；不将旧 run@rev 冒充真实 Run；无正式回执则标“草稿/未证实受理”；源失联 SU，异常转 HD"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  sections:   [
    {
      "id": "rules-8-2",
      "name": "08.2 连续独立规则（R001–R028）",
      "order": 0,
      "required": false,
      "criteria": [
        {
          "id": "R001",
          "title": "学生权威身份及申请材料归属",
          "requirement": "R001 学生权威身份及申请材料归属；P0 起；T=存在本案学生主体；F=咨询尚未建具体个案；U=校内身份源无法确定；SRC-002/003；F001/F005/F006/F037；M001/M003/M011；L-A 学号与正式更名/国际姓名映射对 L-C 申请和证据归属；取申请时点快照；同名不等于同人；一致 PF；跨主体 CF；源断 SU；字迹模糊 UR；改名无法核 HD。下一角色：学籍/国际学生有权经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "研究生身份、培养类别及适用学段",
          "requirement": "R002 研究生身份、培养类别及适用学段；P0；T=已主张 A/B/C/D/E 之一；F=经证实非本校研究生关系案件；U=录取、在籍、全非全、硕博身份不明；SRC-002/003/009；F007–F014/F036；M001/M004；L-A 的状态生效日、学院、项目与当期适用规定比较；2022 国际规则仅在确属来华留学学生时引用；2024 规则正文缺时不可判最终申请资格；身份事实一致 PF；材料互斥 CF；政策适用 PC；学籍源缺 SU；非业务范围 NA 并转正确入口。下一角色：研究生院/国际教育学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "原导师关系真实性及历史基线",
          "requirement": "R003 原导师关系真实性及历史基线；P0，B/C/D/E 与有旧关系 A3；T=当前有需调整的关系；F=权威确认初次尚未建关系；U=登记源不可用或是否有原关系不明；SRC-001/003；F016/F017/F038；M002/M014；L-A 当前关系登记对历史 M014/申请陈述，以登记生效区间和学生 ID 比较；招生报名导师不可代替在读导师；一致 PF；两份有效登记相斥 CF；源断 SU；初配经证实无原关系 NA。下一角色：导师关系数据持有部门",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "本次发起者及提交权限",
          "requirement": "R004 本次发起者及提交权限；P1/G1/G2/G3；T=有学生请求或 C/D 单位发起；F=仅草稿未提交；U=代理权、校方任职权限不明；SRC-001/003/008；F001–F004/F021/F038；M003/M010/M018/M019/M021；后端真实认证和本案版本/回执比对 L-B 请求；SRC-001 第十八条支持 C 单位申请；代理权限须校方确认，前端 actor 不可信；可信提交事实 PF；代冒签/错案 CF；代理授权不明 HD；渠道时效 PC；仅草稿 NA。下一角色：受理单位与身份管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "初次双选批次与导师候选绑定",
          "requirement": "R005 初次双选批次与导师候选绑定；P0/P1 A1/A2；T=当期有正式初次选导师安排；F=B/C/D 在读调整；U=批次规则未取得；SRC-001/003/007；F008/F013/F018/F036；M003/M004；L-B 当届单位/研究生院通知比对学生年级与候选 ID；不能将 2026 硕招文本当校内选导师截止日期；本轮未得统一通知；批次/人选事实可核 PF；冲突 CF；通知不可得 SU；强制批次条件未知 PC；在读变更 NA。下一角色：培养单位初配经办",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "学生本人选择/变更意思表示",
          "requirement": "R006 学生本人选择/变更意思表示；P1；T=A1/A2/A3/B 学生主动申请，E 按其主情形；F=C/D 已证实单位依法启动且尚未征得本人意愿；U=本人/代理/单位启动关系不明；SRC-001/003/005；F002/F020/F021/F037；M003/M011/M010；L-B 认证意愿原件及签署时点；核学生 F005、请求对象 F018 和修订版本；单位启动不能假造学生同意；真实意愿 PF；无材料 NM；签名归属冲突 CF/HD；单位发起且尚未轮到本人程序 NA，不视为永久豁免。下一角色：本人/培养单位",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "拟导师身份和项目角色匹配",
          "requirement": "R007 拟导师身份和项目角色匹配；P2；T=已指定拟导师；F=仅 P1 待选且允许先受理；U=姓名或内外导师身份无法唯一定位；SRC-001/007；F018/F019/F037；M005/M007/M012；L-A 人员身份、L-B 项目内外导师角色对意见签名；候选姓名与教师身份 ID 一致，不凭企业名片授校方角色；以意见签署日为时间点；一致 PF；异人/错角色 CF；身份源断 SU；人员未定但未到 P2 NA。下一角色：培养单位/项目主管",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "拟导师岗位资格及指导授权（仅消费教师域决定）",
          "requirement": "R008 拟导师岗位资格及指导授权（仅消费教师域决定）；P2及 P4 决定前重核；T=目标导师明确且需要实际指导授权；F=尚无具体人选的 P1；U=教师域 T06 结论未取得或资格适用区间不明；SRC-001/003/008；F018/F024/F029；M005/M013；只引用 L-A T06-T01 岗位及视情 T06-T02 招生资格的真实结果 ID、授权学段、起讫与决定日状态；不凭职称判资格；中途停招、退出岗位要查对在读继续指导的实际影响，不能等同自动解除所有原指导关系；同期授权事实 PF；授权冲突 CF；源断 SU；权限争议 HD；P1 NA。下一角色：教师域 T06/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "在读更换是否受招生/指导人数限制的适用结论",
          "requirement": "R009 在读更换是否受招生/指导人数限制的适用结论；P2/P4；T=有权现行政策明确需对此种接收核人数；F=经政策证明无需核；U=招生与在读转接适用关系未知；SRC-001/003/004/008；F008/F013/F025/F036；M004/M005；L-P SRC-001 第十一至十三条已核年度招生限额；先由校方解释是否适用于本次在读更换，再仅消费 T06-T02/T03 的对应年度/学段有权结论。SRC-004 2021 条件不可替代 2024 学籍条文；仅规则明确适用且权威结果一致 PF；适用未知 PC/HD；指标源断 SU；已核不适用 NA。下一角色：研究生院培养管理与教师域 T06-T03 指标主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "原导师意见及签发归属",
          "requirement": "R010 原导师意见及签发归属；P2 B，C/D 依实际组织处理；T=现行程序已要求并进入征求阶段；F=A1/A2 确无原导师或 C/D 已获合法替代安排；U=原导师不能联系、拒签或例外权限未明；SRC-001/003/004；F017/F022/F026/F027；M006/M008/M009/M010；L-B 原导师实名意见对 L-A 原关系 ID、提交时点；“反对”是真实意见而非事实缺失；特殊争议只由单位核合法替代；意见真实 PF（含不同意事实）；异人签署 CF；已适用但未取得 NM；无法签署/争议处理 HD；经证实不需 NA。下一角色：原导师/培养单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "拟导师独立接收意愿及附条件状态",
          "requirement": "R011 拟导师独立接收意愿及附条件状态；P2；T=已要求接收确认；F=P1 尚未沟通或无拟导师；U=签署来源/条件是否满足未知；SRC-001/005/007；F018/F023/F037；M007/M011；L-B 拟导师真实认证意见、对象、意见版本和附条件条款；国际表可承载但须逐人验签；意见不得升级为校方批准；真实表达 PF（即使条件待落实）；签发者不符 CF；P2 缺 NM；条件效力 HD；P1 NA。下一角色：拟导师/培养单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "双导师/校企项目授权与分工",
          "requirement": "R012 双导师/校企项目授权与分工；P0/P3 A3、A3+B/C/D；T=权威证实属于专项双导师项目；F=正式确认非该项目；U=只有专业学位标签或企业推荐信；SRC-007/003；F010/F015/F019/F033；M012/M004；L-B 已批准项目方案按学段、专业、批次与校内/外职责、角色变更对象比对；SRC-007 不推广到全部研究生；项目/角色确证 PF；项目记录与申报冲突 CF；方案源断 SU；适用细则 PC/HD；非项目 NA。下一角色：项目主管培养单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "导学矛盾调解与必要时单位申请事实",
          "requirement": "R013 导学矛盾调解与必要时单位申请事实；P3 C；T=以导学矛盾为由请求组织介入；F=确证普通 B 且无争议；U=争议分类或保密案号未核；SRC-001；F002/F026/F028；M008/M010；L-B 培养单位授权调解/未解决记录，观察事件时点和保护范围；真实矛盾不在此判责，调解未完成不能假报已完成；调解过程事实 PF；声称完成无件 NM；记录矛盾 CF；需解除/重定 HD；非争议 NA。下一角色：培养单位有权调解人员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "原导师不能履责与在读指导保障之组织事实",
          "requirement": "R014 原导师不能履责与在读指导保障之组织事实；P1/P3 D；T=有组织提出无法继续履责或 T06 可信退出岗位事件；F=有权核真不存在该原因；U=健康/调离事实保密或来源不足；SRC-001/012；F002/F017/F027/F028；M009/M010/M005；L-A/B 单位/人事最小事实、起止时间、在读生现由谁临时保障指导的组织安排；SRC-001 第十五条第（四）款明确被取消导师资格者的在读后续指导由培养单位负责安排；不索取学生无权取得的教师病历；事故事实及临时保障安排仅在各自有原件时 PF；相斥 CF；单位未证 HD/SU；已证非 D 则 NA 并重分类。下一角色：培养单位/有权人事部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "培养单位意见、转接协商及向研工部/研究生院提请事实",
          "requirement": "R015 培养单位意见、转接协商及向研工部/研究生院提请事实；P3，C/D 重点，A/B 仅在适用程序确认后；T=单位已到处理/提请阶段；F=P1 仅受理学生意愿；U=院内签发岗位与例外程序未知；SRC-001/003；F011/F021/F028；M010/M008/M009；L-B 单位文书、真实签发岗位、案号与本次导师前后身份比对；SRC-001 第十八条仅肯定单位作用，不完整规定所有签核顺序；已形成真实意见 PF；虚假签发 CF；未出文书 NM；权限不明 PC/HD；尚未到 P3 NA。下一角色：培养单位主管/研究生院受理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "国际研究生表单及特别路由",
          "requirement": "R016 国际研究生表单及特别路由；P1/P3 E；T=学籍源确认为国际研究生且存在适用本案的表单要求；F=权威确认非国际管理对象；U=现行 M011 正文、2022 与 2024 制度衔接不明；SRC-003/005/009；F014/F020/F021/F028/F036；M001/M011/M010；L-P 2022 国际规章第 34 条 + 2026 表单栏目；L-B 表单逐项认证签署；未见附件不能编签章层级或重复要求 M003；身份/已核栏位事实 PF；目前程序 PC/SU；签名冲突 CF；不适用 NA。下一角色：国际教育学院、研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "已发生培养阶段关联及不重复决定",
          "requirement": "R017 已发生培养阶段关联及不重复决定；P3/P5；T=导师调整影响已存在的开题/中期/送审等阶段；F=权威确认无相关阶段记录；U=关联课程/培养系统无法读取；SRC-001/008；F033/F038；M016/M012；L-A 引用其他 S08 真实阶段案号/版本，核对导师、时间和影响范围；本案只提示复核，不判原阶段是否通过；来源版本变化定向重核；引用匹配 PF；版本/对象冲突 CF；阶段源断 SU；影响裁量 HD；无关联 NA。下一角色：对应 S08 阶段 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "正式关系处理决定之真实签发及对象",
          "requirement": "R018 正式关系处理决定之真实签发及对象；P4/H；T=案卷进入正式决定核验或声称已有决定；F=P1–P3 尚未走到决定；U=有无有效决定或机关授权链不明；SRC-001/003；F021/F029/F038；M013/M010/M021；L-A 校方决定号、签发人签发时任职授权、申请修订版、学生与新旧导师绑定；2024 学籍办法未得前不臆定唯一终签人；可核决定存在 PF，不等于本模板自行批准；伪决/对象冲突 CF；机关源失联 SU；权限未证 PC/HD；前期 NA。下一角色：研究生院/正式签发机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "决定送达与关系生效时间的分离",
          "requirement": "R019 决定送达与关系生效时间的分离；P4/P5/H；T=M013 已正式形成而需核通知或生效；F=未形成决定且仍在 P1–P3；U=送达方式、生效条款未知；SRC-003/009；F004/F029/F030/F035；M013/M014/M021；L-A 逐一比较文书作出日、送达回执日、官方生效依据与登记时点；2022 国际规章的处分送达条款不能套用普通导师变更；各个真实时间事实 PF；时间相斥 CF；规则未证 PC/HD；回执确需而缺 NM；前期 NA。下一角色：正式决定机关/学生工作授权经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "导师关系台账变更是否真实登记",
          "requirement": "R020 导师关系台账变更是否真实登记；P5/H；T=已有可核正式决定且进入登记核验；F=尚在 P1–P4；U=权威导师关系库不可取得；SRC-001/003；F016/F017/F029–F031；M013/M014/M002；L-A 登记版本比对决定指定学生、旧/新导师、实际状态与登记时间；决定不能代替台账，不自推生效；已登记匹配 PF；新旧关系矛盾 CF；库失联 SU；签发/登记法效不明 HD/PC；前期 NA。下一角色：研究生院导师关系登记管理人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "培养指导责任移交是否已实施",
          "requirement": "R021 培养指导责任移交是否已实施；P5/H；T=正式决定后要求责任转接；F=P1–P4 未到最终交接；U=无交接规定或组织保障处于争议；SRC-001/003/012；F017/F018/F028/F032/F033；M015/M016/M013/M010；L-B 正式决定关联的培养单位、实际接任导师和项目指导交接记录，逐项核培养计划、持续指导、已发生阶段材料保管的交接与责任时点；P3 临时保障仅由 R014/R015 核其真实存在，不代表永久登记或最终 M015；科研样本/经费权属转 G06；仅有真实完结交接时 PF；声称已完成却无证 NM；内容相斥 CF；无规则/紧急保障 HD/PC；最终交接未到阶段 NA。下一角色：培养单位、原/新导师及阶段主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "补件材料版本、所有权与影响范围",
          "requirement": "R022 补件材料版本、所有权与影响范围；P6 G1；T=同案确有新版本或材料替换；F=未发生补件；U=新旧版无法关联；SRC-008；F001/F003/F034/F037/F038；M017/M021 及被替换 M；技术证据链：case、源版本、哈希、原签发人、supersedes 与页字段；不得静默把 v1 的 PF 给 v2；仅重核依赖 R，技术机制不构成校规；版本链可信 PF；跨案/篡改 CF；新材料不可读 UR；无法建立版本 HD；无变更 NA。下一角色：本案 Case Owner/材料持有人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "撤回请求与正式受理/确认区分",
          "requirement": "R023 撤回请求与正式受理/确认区分；P6 G2；T=现案有撤回请求；F=无请求；U=请求人与当前阶段有无撤回权或处理机关不明；SRC-003/008；F001/F003/F021/F034/F035/F038；M018/M021；L-B 本人请求对准同案版本，L-A 机关处理回执另查；只提交请求不改变现存正式决定，撤回期限和决定前后差异尚无现行法条；请求真实 PF（只证明申请动作）；错案 CF；机关确认缺时 HD/PC；源断 SU；无请求 NA。下一角色：原受理机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "正式异议/复核请求及适用程序",
          "requirement": "R024 正式异议/复核请求及适用程序；P6 G3；T=相对具体已作决定提出异议；F=无正式异议；U=主体资格、期限及机关授权未核；SRC-003/004/009/010/011；F021/F029/F030/F034/F035/F038；M013/M019/M021；L-B 请求与 L-A 原决定/送达分段核真；SRC-011 第 60 条的十日要求针对法定学校处理/处分决定，不能自动套到全部导师变更或初选；SRC-009 第七十条及 SRC-010 仅提供校本申诉文书线索；请求与原决定可对应 PF（仅提交事实）；错决定 CF；现行具体程序 PC；受理与时限争议 HD；无异议 NA。下一角色：有权申诉/复核机构",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "同一学生并行案与决定版本先后关系",
          "requirement": "R025 同一学生并行案与决定版本先后关系；P1/P4/P6/H；T=发现关联案或多个互斥拟变更；F=权威确认无冲突并行案；U=Case/Decision 可信账本不可查询；SRC-008/003；F001/F003/F016/F029/F038；M021/M013/M020；L-A 唯一案卷/真实决定日志核学生、旧关系、时间、有效决定版本；旧 Run/前端改号不得替代；不自动以最后上传胜出；顺序一致 PF；互斥案 CF；账本失联 SU；先后效力 HD；未并行 NA。下一角色：研究生院与唯一 Case/Decision Owner",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "本案政策适用及法源现行性",
          "requirement": "R026 本案政策适用及法源现行性；P0–P4，全部情形；T=本案需形成门槛/流程判断；F=纯咨询尚未进入制度适用环节；U=文件正文、施行/废止及当批通知无法确认；SRC-001/002/003/004/005/006/007/009/010/011/012；F002/F008–F015/F025/F036；M004/M011/M012；L-P 按决定时点对 2024 版、特定学院通知、项目、国际旧规及全国上位规范逐条核；SRC-001 年度招生限额不直接等于在读换导师指标；SRC-011 第 60 条不自动覆盖所有关系调整异议；冲突由有权机构解释；对应事实的有效条款与适用主体均已核才 PF；当前多数审批门槛 PC；规范冲突 HD；非适用阶段 NA。下一角色：研究生院/法务与培养管理主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "撤回的有权机关处理结果",
          "requirement": "R027 撤回的有权机关处理结果；P6 G2 受理后；T=机关已对撤回请求形成结果；F=仅提出请求尚未进入机关处理结果阶段；U=处理回执权限/效力不明；SRC-003/008；F021/F029/F034/F035/F038；M018/M021/M013；L-A 机关回复对准本案/决定版本、真实权限、出具时间；不同于 R023 仅证明提出撤回，若 P4 已有决定需额外确认其处理效力；真回执存在 PF（不等于自动撤销原决定）；不同案 CF；已进入应答而失联 SU；法效不明 PC/HD；尚未结果阶段 NA。下一角色：原受理机关/决定机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "申诉/复核的有权机关处理结果",
          "requirement": "R028 申诉/复核的有权机关处理结果；P6 G3 进入复核处理后；T=真实复核结果已形成或被主张；F=申诉刚提出且尚未进入结果核验；U=复核文书/正式受理机关无法核真；SRC-003/009/010/011；F029/F030/F035/F038；M020/M013/M019/M021；L-A 复核机关文书、签发时授权、与原决定关系、送达/生效时点；先校正申诉类型是否在所引制度范围内；R024 只证明提交复核请求，不评价其支持与否；结果真实性 PF；伪造或对象冲突 CF；源断 SU；效力/是否改判 HD/PC；尚未作出 NA。下一角色：有权复核机关、原决定机关",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  policyVersionIds: [], stages:     [
    {
      "id": "p0",
      "name": "关系/资格基线读取：核研究生身份及当前导师登记，识别招生已录取但尚未报到、在籍、国际生、联合培养",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "nextStageId": "p1"
    },
    {
      "id": "p1",
      "name": "发起与建案：取得学生意向，或由培养单位在特殊情形下发起；绑定办理情形和申请版本",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p2"
    },
    {
      "id": "p2",
      "name": "双向沟通与事实核验：拟导师接收意愿，当前导师意见，T06 资格/岗位结论",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "nextStageId": "p3"
    },
    {
      "id": "p3",
      "name": "组织调解/协调及培养单位意见：处理矛盾、离岗、双导师职责分工",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local",
      "nextStageId": "p4"
    },
    {
      "id": "p4",
      "name": "学校有权主体人工决定、送达/通知",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p5"
    },
    {
      "id": "p5",
      "name": "生效关系登记与培养责任交接核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p6"
    },
    {
      "id": "p6",
      "name": "补件、版本更正、撤回、异议/复核（可从各阶段进入）",
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
  templateId: "S08-T01", name: "研究生导师选择、变更和双向确认审核", sourceDocumentPath: "docs/design/review-agent/business-templates/R02/S08-T01.md", sourceDocumentSha256: "0d073d33973247a136b105d04421f796c261f6e3b8cc3db83014c247b644874a",
  originalSourceDocumentPath: "docs/design/review-agent/business-templates/R02/research-original/S08-T01.md", originalSourceSha256: "0d073d33973247a136b105d04421f796c261f6e3b8cc3db83014c247b644874a", manifestSha256: "0d073d33973247a136b105d04421f796c261f6e3b8cc3db83014c247b644874a", manifestHashCheck: true,
  officialSchoolTemplate: false, researchDate: '2026-10-24', policyEvidenceStatus: 'PARTIAL',
  sourceEvidence:   [
    {
      srcId: "SRC-001",
      evidenceStatus: "VERIFIED",
      title: "| SRC-001 | 成都理工大学，《关于印发〈成都理工大学研究生指导教师岗位管理办法〉的通知》（成理校研〔2024〕23 号） | [学校域 14 页 PDF](https://energy.cdut.edu.cn/__local/9/AA/99/34CEDDCF9FF86FBE66A5E632631_3B5D2F7C_44101.pdf)；第二、三、四、五、十一至十三、十五、十六、十八、十九"
    },
    {
      srcId: "SRC-002",
      evidenceStatus: "VERIFIED",
      title: "| SRC-002 | 成都理工大学党委研究生工作部、研究生院，《2025年秋季学期在校研究生学年注册工作的通知》 | [原始通知](https://gra.cdut.edu.cn/info/1011/5345.htm)，通知首段 | 发布 2025-09-09；单次学年注册通知，非导师程序规定 | CDUT，2025 学年在校研究生；旁证成理校研〔2024〕29 号被实际采用 | CDUT-VE"
    },
    {
      srcId: "SRC-003",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-003 | 成都理工大学，《成都理工大学研究生学籍管理办法》（成理校研〔2024〕29 号） | 原文待取得；检索 site:gra.cdut.edu.cn、site:dbxb.cdut.edu.cn、全网精确文号；线索 SRC-002、SRC-006 | 2024 年新版已在 2025 研究生院通知中被援引；印发、生效、废止条款 未知 | CDUT 研究生学籍；有关导师更换条文及在籍"
    },
    {
      srcId: "SRC-004",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-004 | 成都理工大学，《成都理工大学研究生学籍管理办法》（成理校研〔2021〕13 号） | [校信息公开正文](https://dbxb.cdut.edu.cn/xxgkwz/info/1032/2549.htm)，第二、十五、四十四至四十六条；校站索引/搜索缓存可读取，直接页面访问曾返回 412 | 印发 2021-06-16；2021-09-01 生效，明确废止 2019 版"
    },
    {
      srcId: "SRC-005",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-005 | 成都理工大学国际教育学院，《成都理工大学国研究生更换导师申请表 / Application for Change of Supervisor》（栏目原显示标题，疑有文字漏字） | [国际教育学院教学管理栏目](https://cie.cdut.edu.cn/lxcl1/jxgl.htm)，2026-06-11 表单条目；附件直链与表格正文待取 | 栏目条目标示 2026-0"
    },
    {
      srcId: "SRC-006",
      evidenceStatus: "VERIFIED",
      title: "| SRC-006 | 成都理工大学，2024 年第十次校长办公会通报（校长办公会纪要〔2024〕10 号） | [学校域 PDF](https://dbxb.cdut.edu.cn/__local/A/20/E9/C7C001E21BDEEC81A8AF688EFE0_F1368739_13A3C.pdf)，第 5、6 项 | 会议 2024-04-03；纪要公开时间不详；会议记录非行政细则 |"
    },
    {
      srcId: "SRC-007",
      evidenceStatus: "VERIFIED",
      title: "| SRC-007 | 成都理工大学党委研究生工作部、研究生院，《成都理工大学2026年硕士研究生招生章程》 | [研究生院正文](https://gra.cdut.edu.cn/info/1074/5442.htm)，卓越工程师学院培养方式段 | 2026 招生年度；年度招生章程，不是普遍导师变更细则 | CDUT，卓越工程师学院工程专业学位硕士校企联合培养情形 | CDUT-VERIFIED："
    },
    {
      srcId: "SRC-008",
      evidenceStatus: "PARTIAL",
      title: "| SRC-008 | R02 项目研究目录与 G50 冻结技术清单 | 文件库整合包 CDUT-ST-R02-Partial-Integration-20261023-FINAL.zip 内 00_R02原始范围与规范/ST-CANDIDATE-MASTER-CATALOG-R02.md（S08、T06）、ST-CATALOG-AUDIT-R02.md（S08 旧映射、G50边界）、RESEAR"
    },
    {
      srcId: "SRC-009",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-009 | 成都理工大学，《关于印发〈成都理工大学来华留学生管理规定（试行）〉的通知》（成理校发〔2022〕26 号） | [学校域 PDF](https://dbxb.cdut.edu.cn/__local/6/F5/86/E91EEDCF144F4BC5CA934E95F28_8F010406_8B8F6.pdf)，第 3 条（PDF 第 2 页）、第 34 条（第 13 页）、第"
    },
    {
      srcId: "SRC-010",
      evidenceStatus: "UNCONFIRMED",
      title: "| SRC-010 | 成都理工大学数学科学学院，规章制度索引《成都理工大学学生申诉管理办法》 | [学校学院目录](https://math.cdut.edu.cn/txgz/gzzd.htm)，列示日期 2023-02-24；校本原件文号线索来自 SRC-009 第七十条：成理校发〔2022〕24 号 | 目录上线 2023-02-24；原件发文/现行效力、完整条文与是否包括普通导师变更均未核"
    },
    {
      srcId: "SRC-011",
      evidenceStatus: "PARTIAL",
      title: "| SRC-011 | 中华人民共和国教育部，《普通高等学校学生管理规定》（教育部令第 41 号） | [教育部原文](https://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201702/t20170216_296385.html)，第 59–65 条申诉与复查，第 60 条的法定 10 日期限 | 2017-02-04 公布、2017-09-01 施行"
    },
    {
      srcId: "SRC-012",
      evidenceStatus: "PARTIAL",
      title: "| SRC-012 | 中华人民共和国教育部，《研究生导师指导行为准则》（教研〔2020〕12 号） | [教育部原文](https://www.moe.gov.cn/srcsite/A22/s7065/202011/t20201111_499442.html)，科学公正参与招生、投入指导、构建和谐导学关系的规定 | 2020-11-04 文件，教育部门户公开；本次仅核导师行为原则 | 全国研究生"
    }
  ],
  criteria:   [
    {
      "sectionId": "rules-8-2",
      "criterionId": "R001",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R002",
      "srcIds": [
        "SRC-002"
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
        "SRC-001"
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
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
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
        "SRC-007"
      ],
      "evidenceStatus": "VERIFIED"
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
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001"
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
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R022",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R023",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R024",
      "srcIds": [
        "SRC-003",
        "SRC-011",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R025",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R026",
      "srcIds": [
        "SRC-001",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R027",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-8-2",
      "criterionId": "R028",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
}
