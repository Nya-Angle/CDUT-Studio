/**
 * R02 S03-T08 本地研究模板定义。
 * 来源：docs/design/review-agent/business-templates/R02/S03-T08.md
 * SHA-256：34363a6381feeaf752dd18b3f32ab47f49650334fafafd5d38b3d6c3d15c0ef7
 * 非校方正式模板；未确认政策只可形成建议并进入人工复核。
 */
import type { TemplateVersion } from '@profer/shared'

export const template: TemplateVersion = {
  "templateId": "S03-T08",
  "version": 1,
  "schemaVersion": 2,
  "name": "国家助学贷款申请校内资格与材料核验",
  "description": "国家助学贷款申请校内资格与材料核验。本地研究模板 · 非校方正式模板。仅用于事实核验、证据对应和人工复核；不代行学校签批，不自动产生正式批准或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非成都理工大学校方正式模板；原件 S03-T08 的字段、材料槽、规则及阶段转换为 V3 TemplateVersion；政策证据状态 PARTIAL，未确认条件只生成审阅建议/待确认事项，最终决定须由本地 reviewer/teacher 人工处理。",
  "objectType": "person",
  "displayName": {
    "template": "国家助学贷款申请校内资格与材料核验"
  },
  "fields": [
    {
      "key": "F001",
      "label": "UUID／案卷·L0–L5 · 后端创建且不可重用 · P1／待源",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F001；UUID／案卷·L0–L5 · 后端创建且不可重用 · P1／待源。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F002",
      "label": "不透明 ID／学生·全程 · 校内可信学籍或录取服务，不接受 Renderer 角色声明 · P1／待源",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F002；不透明 ID／学生·全程 · 校内可信学籍或录取服务，不接受 Renderer 角色声明 · P1／待源。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F003",
      "label": "YYYY-YYYY／贷款事件·全程 · 校方当期配置、学生选择后二次确认 · P0／待补",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F003；YYYY-YYYY／贷款事件·全程 · 校方当期配置、学生选择后二次确认 · P0／待补。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F004",
      "label": "枚举：录取新生/在读/复学/毕业/其他／L0 · 可信学籍或录取状态及生效日 · P1／待源",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F004；枚举：录取新生/在读/复学/毕业/其他／L0 · 可信学籍或录取状态及生效日 · P1／待源。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F005",
      "label": "本专科/硕士/博士/预科/其他／L0 · 校内权威记录，不单独构成拒绝条件 · P1／待源",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F005；本专科/硕士/博士/预科/其他／L0 · 校内权威记录，不单独构成拒绝条件 · P1／待源。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F006",
      "label": "全日制/非全日制/待核／L0 · 学籍记录；具体银行适用资格另核 · P1／待源或待策",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F006；全日制/非全日制/待核／L0 · 学籍记录；具体银行适用资格另核 · P1／待源或待策。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F007",
      "label": "校区学院代码／L0–L3 · 校方组织名录与可信学籍 · P1／待源",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F007；校区学院代码／L0–L3 · 校方组织名录与可信学籍 · P1／待源。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F008",
      "label": "生源地/校园地/未定／L0–L1 · 学生意向及正式受理来源分别存 · P1／待补；校园地待策",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F008；生源地/校园地/未定／L0–L1 · 学生意向及正式受理来源分别存 · P1／待补；校园地待策。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F009",
      "label": "国开行/中国银行/四川农信/其他/未知／L1–L3 · 学生声明后与银行回执来源核对 · P1／待补或待策",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F009；国开行/中国银行/四川农信/其他/未知／L1–L3 · 学生声明后与银行回执来源核对 · P1／待补或待策。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F010",
      "label": "首贷/续贷/预申请/未定／L0–L1 · 学生声明；以经办机构回执为准 · P1／待补，非校方审批项",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F010；首贷/续贷/预申请/未定／L0–L1 · 学生声明；以经办机构回执为准 · P1／待补，非校方审批项。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F011",
      "label": "最小化回执标识或令牌／L2–L3 · 银行/资助部门签发、可核验；禁止公开展示原码 · P2／后续、待补或待源",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F011；最小化回执标识或令牌／L2–L3 · 银行/资助部门签发、可核验；禁止公开展示原码 · P2／后续、待补或待源。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F012",
      "label": "校验码/二维码/纸件/其他／L2 · 当期银行种类及校方通知匹配 · P1／待补",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F012；校验码/二维码/纸件/其他／L2 · 当期银行种类及校方通知匹配 · P1／待补。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F013",
      "label": "学年／回执·L2 · 原始回执可读字段或外部核验结果 · P1／待补或不可读",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F013；学年／回执·L2 · 原始回执可读字段或外部核验结果 · P1／待补或不可读。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F014",
      "label": "一致/不一致/无法核／L2 · 官方接口或授权人员对学号/姓名最少字段比对 · P1／待源或冲突",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F014；一致/不一致/无法核／L2 · 官方接口或授权人员对学号/姓名最少字段比对 · P1／待源或冲突。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F015",
      "label": "未验证/真实/失败/服务不可用／L2–L3 · 仅官方银行或学校授权核验记录 · P1／待源；OCR 非真实验证",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F015；未验证/真实/失败/服务不可用／L2–L3 · 仅官方银行或学校授权核验记录 · P1／待源；OCR 非真实验证。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F016",
      "label": "未受理/受理/签约/拒绝/未知／L1–L4 · 县级资助机构或经办银行正式状态 · P2／后续或待源",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F016；未受理/受理/签约/拒绝/未知／L1–L4 · 县级资助机构或经办银行正式状态 · P2／后续或待源。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F017",
      "label": "未放款/放款/未知／L4 · 银行有权状态；短信仅线索 · P2／后续或待源",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F017；未放款/放款/未知／L4 · 银行有权状态；短信仅线索 · P2／后续或待源。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F018",
      "label": "未处理/确认/退回/更正/撤回请求／L3 · 后端有权岗位签署记录 · P1／后续、待人工",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F018；未处理/确认/退回/更正/撤回请求／L3 · 后端有权岗位签署记录 · P1／后续、待人工。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F019",
      "label": "服务端人员 ID/岗位授权版本／L3–L5 · 后端 IAM 和签名事件，不信 UI 自报 · P1／待源",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F019；服务端人员 ID/岗位授权版本／L3–L5 · 后端 IAM 和签名事件，不信 UI 自报 · P1／待源。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F020",
      "label": "未到账/已到账/待核／L4 · 财务可信入账记录 · P2／后续或待源",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F020；未到账/已到账/待核／L4 · 财务可信入账记录 · P2／后续或待源。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F021",
      "label": "未抵扣/部分/完成/待核／L4 · 财务系统及学年收费项 · P2／后续或待源",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F021；未抵扣/部分/完成/待核／L4 · 财务系统及学年收费项 · P2／后续或待源。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F022",
      "label": "学费/住宿费组合／L1–L4 · 财务当期权威收费项目，不当作贷款批准额度 · P1／待源",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F022；学费/住宿费组合／L1–L4 · 财务当期权威收费项目，不当作贷款批准额度 · P1／待源。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F023",
      "label": "在读/录取/收费/银行指定证明/无／L1–L3 · 当期确有证明要求及银行表格 · P1／待策，条件触发",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F023；在读/录取/收费/银行指定证明/无／L1–L3 · 当期确有证明要求及银行表格 · P1／待策，条件触发。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F024",
      "label": "已核授权/未核/不需章／L3 · 现行校方印章授权台账 · P1／待策或待人工",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F024；已核授权/未核/不需章／L3 · 现行校方印章授权台账 · P1／待策或待人工。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F025",
      "label": "他项签发 ID、版本／L1–L3 · 仅消费 S03-T06 的有效决定；不得自行重判 · P2／待策，条件触发",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F025；他项签发 ID、版本／L1–L3 · 仅消费 S03-T06 的有效决定；不得自行重判 · P2／待策，条件触发。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F026",
      "label": "合法依据、告知版本与访问范围／全程 · 学校经授权的数据治理服务 · P1／待源；缺失不得索取敏感原件",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F026；合法依据、告知版本与访问范围／全程 · 学校经授权的数据治理服务 · P1／待源；缺失不得索取敏感原件。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F027",
      "label": "目标事件、原因、请求时间／L2–L5 · 本人可信申请或授权经办登记 · P1／条件触发",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F027；目标事件、原因、请求时间／L2–L5 · 本人可信申请或授权经办登记 · P1／条件触发。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F028",
      "label": "有权复核人、签署结果、时间／L5 · 校方正式处理记录 · P1／后续、待人工",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F028；有权复核人、签署结果、时间／L5 · 校方正式处理记录 · P1／后续、待人工。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F029",
      "label": "批次、适用学段、银行路径、有效区间／全程 · 校方政策登记与生效审批 · P0／待策",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F029；批次、适用学段、银行路径、有效区间／全程 · 校方政策登记与生效审批 · P0／待策。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F030",
      "label": "材料 hash、源文档版本、目标对象／全程 · 可信存储及证据链 · P1／缺则暂停事实认定",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F030；材料 hash、源文档版本、目标对象／全程 · 可信存储及证据链 · P1／缺则暂停事实认定。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F031",
      "label": "外部合同/银行事项的脱敏引用／L2–L5 · 经办机构的最小化验证结果 · P2／后续；不得复制全合同",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原研究字段 F031；外部合同/银行事项的脱敏引用／L2–L5 · 经办机构的最小化验证结果 · P2／后续；不得复制全合同。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    },
    {
      "key": "F032",
      "label": "校内补正/事实异议/银行争议/不适用／L5 · 权责分流人工确认 · P1／待策",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原研究字段 F032；校内补正/事实异议/银行争议/不适用／L5 · 权责分流人工确认 · P1／待策。候选字段字典不是校方现行表单转录；未确认的必需性、枚举值及权限不得推定。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "学籍/录取真实性：校方后端记录；无接口时由有权教务/研工人员签发最小状态证明",
      "purpose": "原研究材料槽 M001：学籍/录取真实性：校方后端记录；无接口时由有权教务/研工人员签发最小状态证明；L0；F002–F007；R001–R003；SRC-001/002/003；待源；不强迫上传完整身份证；读则人工核",
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
        "学籍/录取真实性：校方后端记录；无接口时由有权教务/研工人员签发最小状态证明",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "学年与当期通知：校方正式缴费/资助发布及版本",
      "purpose": "原研究材料槽 M002：学年与当期通知：校方正式缴费/资助发布及版本；L0；F003/F029；R004；SRC-001；无现行来源待策，不要求学生代提供制度",
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
        "学年与当期通知：校方正式缴费/资助发布及版本",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "生源地受理类别声明：学生最小表单，后续外部回执替代",
      "purpose": "原研究材料槽 M003：生源地受理类别声明：学生最小表单，后续外部回执替代；L0–L1；F008–F010；R005/R006；SRC-001/005；缺；未确定银行允许暂存草稿",
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
        "生源地受理类别声明：学生最小表单，后续外部回执替代",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "国开行/中行回执校验码：学生持有，校内安全表单仅保存掩码+可验证令牌",
      "purpose": "原研究材料槽 M004：国开行/中行回执校验码：学生持有，校内安全表单仅保存掩码+可验证令牌；L2，银行匹配；F011–F015；R007/R010；SRC-001；缺/读；不得日志记录明码",
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
        "国开行/中行回执校验码：学生持有，校内安全表单仅保存掩码+可验证令牌",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "四川农信 APP 回执二维码：学生截图或获认可的银行电子回执",
      "purpose": "原研究材料槽 M005：四川农信 APP 回执二维码：学生截图或获认可的银行电子回执；L2，农信匹配；F011–F015；R008/R010；SRC-001；缺/读；遮蔽无关卡号、余额和通知栏",
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
        "四川农信 APP 回执二维码：学生截图或获认可的银行电子回执",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "其他银行纸质贷款回执：学生交辅导员、学院汇总；可接受校方正式认可的电子等效回执",
      "purpose": "原研究材料槽 M006：其他银行纸质贷款回执：学生交辅导员、学院汇总；可接受校方正式认可的电子等效回执；L2–L3，其他银行；F011–F015；R009/R010；SRC-001；缺/读；签章效力待策",
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
        "其他银行纸质贷款回执：学生交辅导员、学院汇总；可接受校方正式认可的电子等效回执",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "回执真实性/归属核验结果：银行系统回传或有权校方人员有据人工确认",
      "purpose": "原研究材料槽 M007：回执真实性/归属核验结果：银行系统回传或有权校方人员有据人工确认；L3；F014/F015/F019；R010/R011；SRC-001/005；待源；不以 OCR 冒充联网验证",
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
        "回执真实性/归属核验结果：银行系统回传或有权校方人员有据人工确认",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "校内确认/报送审计事件：校方后端签署与外部提交回执",
      "purpose": "原研究材料槽 M008：校内确认/报送审计事件：校方后端签署与外部提交回执；L3；F018/F019/F030；R012；SRC-004/005；后续形成；无权不得伪造",
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
        "校内确认/报送审计事件：校方后端签署与外部提交回执",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "银行/县资助机构外部受理或签约结果：官方状态最小回执",
      "purpose": "原研究材料槽 M009：银行/县资助机构外部受理或签约结果：官方状态最小回执；L1–L4，若需判断外部进展；F016/F031；R013；SRC-005/006/012；待源；不索全合同",
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
        "银行/县资助机构外部受理或签约结果：官方状态最小回执",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "银行放款可信状态：官方确认；短信可作待核线索",
      "purpose": "原研究材料槽 M010：银行放款可信状态：官方确认；短信可作待核线索；L4；F017；R014；SRC-001；后续，缺不阻断初申",
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
        "银行放款可信状态：官方确认；短信可作待核线索",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "财务到账与抵扣记录：财务系统权威账务事件/票据",
      "purpose": "原研究材料槽 M011：财务到账与抵扣记录：财务系统权威账务事件/票据；L4；F020–F022；R015/R016；SRC-001；待源；与银行状态分开",
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
        "财务到账与抵扣记录：财务系统权威账务事件/票据",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "校方学籍/学费证明请求：经办机构当期明确格式及用途",
      "purpose": "原研究材料槽 M012：校方学籍/学费证明请求：经办机构当期明确格式及用途；L1–L3 条件性；F023；R017；SRC-005；条件未证实待策；不预先报缺",
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
        "校方学籍/学费证明请求：经办机构当期明确格式及用途",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "用印授权与签章事件：校方当前授权清单、用印台账",
      "purpose": "原研究材料槽 M013：用印授权与签章事件：校方当前授权清单、用印台账；L3 条件性；F024/F019；R018；SRC-005/004；待策/待人工；印章图像不是授权证明",
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
        "用印授权与签章事件：校方当前授权清单、用印台账",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "困难认定的他项正式结论引用：S03-T06 有权决定编号，不收家庭调查全文",
      "purpose": "原研究材料槽 M014：困难认定的他项正式结论引用：S03-T06 有权决定编号，不收家庭调查全文；L1 条件性；F025；R019；SRC-007/008；条件未证实待策，不得因缺而拒贷",
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
        "困难认定的他项正式结论引用：S03-T06 有权决定编号，不收家庭调查全文",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "数据处理告知、授权访问记录：校内隐私权限审计",
      "purpose": "原研究材料槽 M015：数据处理告知、授权访问记录：校内隐私权限审计；全程；F026；R020；SRC-011；无合法依据则停止敏感处理",
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
        "数据处理告知、授权访问记录：校内隐私权限审计",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "更正/补件请求与新证据：本人申请或经办登记、旧新版指针",
      "purpose": "原研究材料槽 M016：更正/补件请求与新证据：本人申请或经办登记、旧新版指针；L2–L5；F027/F030；R021；SRC-011；缺时不启动更正；读则补传",
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
        "更正/补件请求与新证据：本人申请或经办登记、旧新版指针",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "校内撤回请求及处理决定：本人可信签署、经办回执",
      "purpose": "原研究材料槽 M017：校内撤回请求及处理决定：本人可信签署、经办回执；L2–L5；F027/F018；R022；SRC-004/005；不自动触发外部银行撤销",
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
        "校内撤回请求及处理决定：本人可信签署、经办回执",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "复核申请与校方有权决定：申诉理由、目标事实、决定签名",
      "purpose": "原研究材料槽 M018：复核申请与校方有权决定：申诉理由、目标事实、决定签名；L5；F028/F032；R023；SRC-004/011；程序/期限未核待策、人工处理",
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
        "复核申请与校方有权决定：申诉理由、目标事实、决定签名",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "2026 校园地项目开放及办理规定：校方现行公告或正式答复",
      "purpose": "原研究材料槽 M019：2026 校园地项目开放及办理规定：校方现行公告或正式答复；L0–L1 校园地情形；F008/F029；R024；SRC-002/003；2025 旧文不可替代；待策",
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
        "2026 校园地项目开放及办理规定：校方现行公告或正式答复",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "贷款类别冲突权威核验：外部系统正式证据，非学生口头自述",
      "purpose": "原研究材料槽 M020：贷款类别冲突权威核验：外部系统正式证据，非学生口头自述；L1–L3 双类疑似；F008/F016/F031；R025；SRC-002/003；无权威连接待源/人工，不自行取消",
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
        "贷款类别冲突权威核验：外部系统正式证据，非学生口头自述",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "代理申请权限：学校允许代理的当期说明及可信授权书",
      "purpose": "原研究材料槽 M021：代理申请权限：学校允许代理的当期说明及可信授权书；L0–L5 若代理；F002/F019；R026；SRC-011；待策/待人工；禁止默认代理有权",
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
        "代理申请权限：学校允许代理的当期说明及可信授权书",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "新生、复学及特殊学段路径说明：当期校级/研究生/迎新规则",
      "purpose": "原研究材料槽 M022：新生、复学及特殊学段路径说明：当期校级/研究生/迎新规则；L0，路径例外；F004–F006/F029；R027；SRC-002/003/006；未核待策，不能按标签直接拒绝",
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
        "新生、复学及特殊学段路径说明：当期校级/研究生/迎新规则",
        "核对主体、适用阶段、来源与版本",
        "分别记录缺失、不可读、来源不可用、政策未确认和事实冲突"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "evidence-review",
      "name": "研究级事实核验与政策待确认",
      "description": "对应原件第 08 节逐条规则；SRC 为研究来源索引，不是案卷材料 SourceRef。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "学生身份指向同案",
          "requirement": "【研究级核验标准；非校方正式规则】R001 R001 学生身份指向同案 | L0；T 所有案/F 无/U 身份源失联 | F001/F002/F030；M001；SRC-011 | ID 匹配 PASS_FACT；错配 CONFLICT，失联 SOURCE_UNAVAILABLE；学籍管理员",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R002",
          "title": "录取/在读状态可信",
          "requirement": "【研究级核验标准；非校方正式规则】R002 R002 录取/在读状态可信 | L0；T 所有案/F 无/U 系统失联 | F004/F002；M001；SRC-002/003 | 状态可核 PASS_FACT；不在预设路径则 NEEDS_HUMAN_DECISION 而非拒贷；教务/研工",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R003",
          "title": "学段及修读形式记录一致",
          "requirement": "【研究级核验标准；非校方正式规则】R003 R003 学段及修读形式记录一致 | L0；T 所有案/F 无/U 未授权查 | F005/F006；M001；SRC-002/003 | 一致 PASS_FACT；例外待策 POLICY_UNCONFIRMED；研工/资助中心",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "学年政策版本对应",
          "requirement": "【研究级核验标准；非校方正式规则】R004 R004 学年政策版本对应 | L0；T 所有案/F 无/U 未有当期通知 | F003/F029；M002；SRC-001 | 2026 在校生路径 PASS_FACT；新生/其他年份无据 POLICY_UNCONFIRMED；政策 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "贷款子类声明可识别",
          "requirement": "【研究级核验标准；非校方正式规则】R005 R005 贷款子类声明可识别 | L0；T 有申请意向/F 无/U 声明缺 | F008/F010；M003；SRC-001/005 | 分类 PASS_FACT；缺 NEEDS_MATERIAL；学院",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R006",
          "title": "经办银行路径可识别",
          "requirement": "【研究级核验标准；非校方正式规则】R006 R006 经办银行路径可识别 | L1；T 生源地回执流程/F 校园地/U 类别不明 | F009/F012；M003；SRC-001 | 明确分组 PASS_FACT；缺 NEEDS_MATERIAL；学院/中心",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "国开行/中行回执码存在且归属本案",
          "requirement": "【研究级核验标准；非校方正式规则】R007 R007 国开行/中行回执码存在且归属本案 | L2；T F009=国开行/中行/F 其他/U 银行未定 | F011–F014；M004；SRC-001 | 可读且年/人匹配 PASS_FACT；缺/读/错配分别 NEEDS_MATERIAL/UNREADABLE/CONFLICT；学生补正",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "四川农信二维码材料匹配",
          "requirement": "【研究级核验标准；非校方正式规则】R008 R008 四川农信二维码材料匹配 | L2；T 农信/F 其他/U 银行未定 | F011–F014；M005；SRC-001 | 对象匹配 PASS_FACT；缺/读/错配对应异常；学生补正",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "其他银行纸回执与汇总记录匹配",
          "requirement": "【研究级核验标准；非校方正式规则】R009 R009 其他银行纸回执与汇总记录匹配 | L2–L3；T 其他行/F 指定三类/U 未定 | F011–F014；M006；SRC-001 | 可读、归属匹配 PASS_FACT；无纸件 NEEDS_MATERIAL；学院",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "回执真实性有权核验",
          "requirement": "【研究级核验标准；非校方正式规则】R010 R010 回执真实性有权核验 | L3；T 已有回执/F 尚未生成回执/U 核验路径未配置 | F015/F019；M007；SRC-001/005 | 有权回执验证 PASS_FACT；接口失联 SOURCE_UNAVAILABLE，错码 CONFLICT，无法定验证法 POLICY_UNCONFIRMED；资助中心",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "回执学年/学生双键一致",
          "requirement": "【研究级核验标准；非校方正式规则】R011 R011 回执学年/学生双键一致 | L2–L3；T 回执已到/F 未到/U 不可读 | F002/F003/F013/F014；M001/M004/M005/M006/M007；SRC-001 | 两键匹配 PASS_FACT；旧年度/他人 CONFLICT；学院/中心",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "校内确认由真实授权人执行",
          "requirement": "【研究级核验标准；非校方正式规则】R012 R012 校内确认由真实授权人执行 | L3；T 签发校内确认/F 尚未决策/U 授权台账未知 | F018/F019；M008；SRC-004/005 | 签名+权限+版本均一致 PASS_FACT；无授权 NEEDS_HUMAN_DECISION；中心主管",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R013",
          "title": "外部受理/签约状态仅作引用",
          "requirement": "【研究级核验标准；非校方正式规则】R013 R013 外部受理/签约状态仅作引用 | L1–L4；T 有外部状态用途/F 不需/U 不可查询 | F016/F031；M009；SRC-005/006/012 | 官方状态 PASS_FACT；仅学生自述 SOURCE_UNAVAILABLE；经办机构",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R014",
          "title": "银行放款事实可证",
          "requirement": "【研究级核验标准；非校方正式规则】R014 R014 银行放款事实可证 | L4；T 查询放款/F L0–L3/U 接口失联 | F017；M010；SRC-001 | 官方已放款 PASS_FACT；无官方证据 SOURCE_UNAVAILABLE；银行",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "财务到账记录可信",
          "requirement": "【研究级核验标准；非校方正式规则】R015 R015 财务到账记录可信 | L4；T 查询到账/F L0–L3/U 财务服务失联 | F020；M011；SRC-001 | 已到账 PASS_FACT；银行已放款而未入账不判矛盾，列待办；财务",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R016",
          "title": "财务抵扣状态与账项一致",
          "requirement": "【研究级核验标准；非校方正式规则】R016 R016 财务抵扣状态与账项一致 | L4；T 查询收费状态/F L0–L3/U 未入账 | F021/F022；M011；SRC-001 | 账项一致 PASS_FACT；差额留财务待办，勿据此拒贷；财务",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "特定收费/在读证明的必要性",
          "requirement": "【研究级核验标准；非校方正式规则】R017 R017 特定收费/在读证明的必要性 | L1–L3；T 外部机构提出校方证明/F 无请求/U 要求来源未核 | F023；M012；SRC-005 | 现行要求可核 PASS_FACT；只有历史模板 POLICY_UNCONFIRMED；中心",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "用印权限真实有效",
          "requirement": "【研究级核验标准；非校方正式规则】R018 R018 用印权限真实有效 | L3；T 证明依法需要章/F 免章/U 2026 权限未核 | F024/F019；M013；SRC-004/005 | 当前授权+签名 PASS_FACT；授权不明 NEEDS_HUMAN_DECISION，政策未核 POLICY_UNCONFIRMED；印章主管",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "困难认定是否是当前条件",
          "requirement": "【研究级核验标准；非校方正式规则】R019 R019 困难认定是否是当前条件 | L1；T 当期银行明确要求校内困难结论/F 无该要求/U 要求未知 | F025/F029；M014；SRC-007/008 | 引用有效 S03-T06 决定 PASS_FACT；要求未证不索表；资助中心/银行",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R020",
          "title": "敏感信息处理依据与最小必要",
          "requirement": "【研究级核验标准；非校方正式规则】R020 R020 敏感信息处理依据与最小必要 | 全程；T 处理 P2/F 无 P2/U 权限源失联 | F026；M015；SRC-011 | 合规授权可核 PASS_FACT；不明 NEEDS_HUMAN_DECISION；数据保护负责人",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R021",
          "title": "更正证据版本和目标案卷",
          "requirement": "【研究级核验标准；非校方正式规则】R021 R021 更正证据版本和目标案卷 | L2–L5；T 补件更正/F 无更正/U 原版本丢失 | F027/F030；M016；SRC-011 | 新旧引用匹配 PASS_FACT；归属不符 CONFLICT；学院",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "校内撤回与外部合同分离",
          "requirement": "【研究级核验标准；非校方正式规则】R022 R022 校内撤回与外部合同分离 | L2–L5；T 撤回请求/F 无/U 外部状态不可查 | F027/F018/F031；M017/M009；SRC-004/005 | 可受理校内请求但最终处置 NEEDS_HUMAN_DECISION；中心与银行分别确认",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "复核申请已由有权主体结案",
          "requirement": "【研究级核验标准；非校方正式规则】R023 R023 复核申请已由有权主体结案 | L5；T 复核申请/F 无/U 权限不明 | F028/F032；M018；SRC-004/011 | 有签署决定 PASS_FACT；未签 NEEDS_HUMAN_DECISION；学校复核主体",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R024",
          "title": "校园地 2026 开放资格可证",
          "requirement": "【研究级核验标准；非校方正式规则】R024 R024 校园地 2026 开放资格可证 | L0–L1；T F008=校园地/F 生源地/U 贷款类型未知 | F008/F029；M019；SRC-002/003 | 仅凭 2025 未开通记录输出 POLICY_UNCONFIRMED；校资助中心正式答复后按新版本重审",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R025",
          "title": "同学年两类贷款冲突可证",
          "requirement": "【研究级核验标准；非校方正式规则】R025 R025 同学年两类贷款冲突可证 | L1–L3；T 权威来源提示双类/F 无疑点/U 系统不通 | F003/F008/F016/F031；M020；SRC-002/003 | 真冲突 CONFLICT 转机构；未取得银行状态 SOURCE_UNAVAILABLE；不自动撤销",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "代理办理权限适格",
          "requirement": "【研究级核验标准；非校方正式规则】R026 R026 代理办理权限适格 | L0–L5；T 代理人操作/F 本人操作/U 未有代理制度 | F002/F019；M021；SRC-011 | 已授权 PASS_FACT；其他 NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED；中心",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R027",
          "title": "新生/复学/非全日制例外路径",
          "requirement": "【研究级核验标准；非校方正式规则】R027 R027 新生/复学/非全日制例外路径 | L0；T 特殊学籍路径/F 常规在校/U 学籍未知 | F004–F006/F029；M022；SRC-002/003/006/014 | 有当期明确路径 PASS_FACT；未知 POLICY_UNCONFIRMED；教务/研工/迎新",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "local-l0",
      "name": "L0 咨询与路由",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-l1",
      "workflowOwner": "local"
    },
    {
      "id": "local-l1",
      "name": "L1 外部申请/首贷或续贷",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-l2",
      "workflowOwner": "local"
    },
    {
      "id": "local-l2",
      "name": "L2 外部受理后取得回执",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-l3",
      "workflowOwner": "local"
    },
    {
      "id": "local-l3",
      "name": "L3 学校确认与报送",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-l4",
      "workflowOwner": "local"
    },
    {
      "id": "local-l4",
      "name": "L4 外部审贷、放款",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-l5",
      "workflowOwner": "local"
    },
    {
      "id": "local-l5",
      "name": "L5 结案/异议/更正（本地人工复核；不代表校方正式决定）",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "review-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-suggestions",
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
  "createdAt": "2026-10-24T00:00:00.000Z"
}

export const r02Metadata = {
  "templateId": "S03-T08",
  "name": "国家助学贷款申请校内资格与材料核验",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S03-T08.md",
  "sourceDocumentSha256": "33410ab863aaedfba343d0847b1e53b4ea7e284fe396c2bb996d7ee1924043b2",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23",
  "policyEvidenceStatus": "PARTIAL",
  "sources": [
    {
      "id": "SRC-001",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-002",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-003",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-004",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-005",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-006",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-007",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-008",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-009",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-010",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-011",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-012",
      "status": "UNCONFIRMED"
    },
    {
      "id": "SRC-013",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-014",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-015",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-016",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-017",
      "status": "CURRENTITY-UNKNOWN"
    }
  ],
  "criteria": [
    {
      "sectionId": "evidence-review",
      "criterionId": "R001",
      "srcIds": [
        "SRC-011"
      ],
      "fieldIds": [
        "F001",
        "F002",
        "F030"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F002",
        "F004"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F005",
        "F006"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F003",
        "F029"
      ],
      "materialSlotIds": [
        "M002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F008",
        "F010"
      ],
      "materialSlotIds": [
        "M003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F009",
        "F012"
      ],
      "materialSlotIds": [
        "M003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F009",
        "F011",
        "F012",
        "F013",
        "F014"
      ],
      "materialSlotIds": [
        "M004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F011",
        "F012",
        "F013",
        "F014"
      ],
      "materialSlotIds": [
        "M005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F011",
        "F012",
        "F013",
        "F014"
      ],
      "materialSlotIds": [
        "M006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F015",
        "F019"
      ],
      "materialSlotIds": [
        "M007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F002",
        "F003",
        "F013",
        "F014"
      ],
      "materialSlotIds": [
        "M001",
        "M004",
        "M005",
        "M006",
        "M007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-004"
      ],
      "fieldIds": [
        "F018",
        "F019"
      ],
      "materialSlotIds": [
        "M008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-005"
      ],
      "fieldIds": [
        "F016",
        "F031"
      ],
      "materialSlotIds": [
        "M009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F017"
      ],
      "materialSlotIds": [
        "M010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F020"
      ],
      "materialSlotIds": [
        "M011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F021",
        "F022"
      ],
      "materialSlotIds": [
        "M011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-005"
      ],
      "fieldIds": [
        "F023"
      ],
      "materialSlotIds": [
        "M012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-004"
      ],
      "fieldIds": [
        "F019",
        "F024"
      ],
      "materialSlotIds": [
        "M013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-007"
      ],
      "fieldIds": [
        "F025",
        "F029"
      ],
      "materialSlotIds": [
        "M014"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-011"
      ],
      "fieldIds": [
        "F026"
      ],
      "materialSlotIds": [
        "M015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-011"
      ],
      "fieldIds": [
        "F027",
        "F030"
      ],
      "materialSlotIds": [
        "M016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-004"
      ],
      "fieldIds": [
        "F018",
        "F027",
        "F031"
      ],
      "materialSlotIds": [
        "M009",
        "M017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-004"
      ],
      "fieldIds": [
        "F028",
        "F032"
      ],
      "materialSlotIds": [
        "M018"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F008",
        "F029"
      ],
      "materialSlotIds": [
        "M019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F003",
        "F008",
        "F016",
        "F031"
      ],
      "materialSlotIds": [
        "M020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R026",
      "srcIds": [
        "SRC-011"
      ],
      "fieldIds": [
        "F002",
        "F019"
      ],
      "materialSlotIds": [
        "M021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R027",
      "srcIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F004",
        "F005",
        "F006",
        "F029"
      ],
      "materialSlotIds": [
        "M022"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
