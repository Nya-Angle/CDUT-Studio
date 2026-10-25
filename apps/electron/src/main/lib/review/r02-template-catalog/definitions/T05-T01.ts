/**
 * R02 T05-T01 本地研究模板定义。
 * 来源：docs/design/review-agent/business-templates/R02/T05-T01.md
 * SHA-256：39f6eb1ba5274bf21c6b13b3bb2d2a61ed1706cd20c2618fd7d6a503a38b6867
 * 非校方正式模板；未确认政策只可形成建议并进入人工复核。
 */
import type { TemplateVersion } from '@profer/shared'

export const template: TemplateVersion = {
  "templateId": "T05-T01",
  "version": 1,
  "schemaVersion": 2,
  "name": "本研人才培养方案制定、修订审核",
  "description": "本研人才培养方案制定、修订审核。本地研究模板 · 非校方正式模板。仅支持事实提取、证据对应和审阅建议；批次政策、适用对象、签批权限未确认时必须待确认并由有权人员人工处理。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非成都理工大学校方正式模板；依据 T05-T01 研究原件的字段、材料槽与规则清单生成，政策证据状态为 PARTIAL。",
  "objectType": "document",
  "displayName": {
    "template": "本研人才培养方案制定、修订审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "Case 本地案卷唯一 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F001 类型提示：UUID/字符串。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F002",
      "label": "Scope 所属学校/校区（CDUT；跨校另记录）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F002 类型提示：枚举。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F003",
      "label": "Scope 学段：本科/硕士/博士",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F003 类型提示：枚举。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F004",
      "label": "Scope 学位类型：学术/专业；本科 NA",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F004 类型提示：枚举。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F005",
      "label": "Scope 培养形式：全/非全、联培、合作办学等条件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F005 类型提示：枚举/列表。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F006",
      "label": "Scope 学院/牵头及参与培养单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F006 类型提示：机构代码/列表。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F007",
      "label": "Scope 本科专业/学科点/类别领域代码",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F007 类型提示：字符串。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F008",
      "label": "Scope 专业或学位点正式名称",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F008 类型提示：字符串。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F009",
      "label": "Revision 首次制定/全量修订/局部修订",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F009 类型提示：枚举。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F010",
      "label": "Revision 旧方案权威文档 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F010 类型提示：文书引用。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F011",
      "label": "Revision 旧方案版本/官方效力标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F011 类型提示：字符串。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F012",
      "label": "Revision 拟制定目标版本（例如自称 2026 版）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F012 类型提示：字符串。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F013",
      "label": "Revision 拟适用入学届别/群体",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F013 类型提示：字符串/届别列表。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F014",
      "label": "Revision 拟生效日期而非已生效日",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F014 类型提示：日期/可空。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F015",
      "label": "Case 正式发起/拟制责任单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F015 类型提示：机构代码。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F016",
      "label": "Case 当前提交者可信身份及所在单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F016 类型提示：actor 受限引用。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F017",
      "label": "Case 代理人职务/委托范围和时段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F017 类型提示：授权引用/可空。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F018",
      "label": "Revision 对应批次/学段依据 ID 与有效期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F018 类型提示：政策文书+时效。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F019",
      "label": "Revision 学科专业/培养类别适用权威标准及版次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F019 类型提示：标准文书引用。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F020",
      "label": "Revision 当前供审拟稿 M004",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F020 类型提示：材料 ID。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F021",
      "label": "Revision 拟稿二进制及正文提取版本指纹",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F021 类型提示：SHA-256/指纹。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F022",
      "label": "Revision 培养目标段落",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F022 类型提示：结构化文本。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F023",
      "label": "Revision 毕业要求/能力成果目标",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F023 类型提示：结构化文本。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F024",
      "label": "Revision 课程学时/学分/模块/实践等表格",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F024 类型提示：结构化列表。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F025",
      "label": "Revision 旧新差异与修订理由",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F025 类型提示：文本+diff 引用。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F026",
      "label": "Research 专业需求调研/用人单位意见",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F026 类型提示：证据引用。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F027",
      "label": "Research 培养目标达成分析",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F027 类型提示：证据引用。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F028",
      "label": "Review 专家评议意见及会议记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F028 类型提示：文书/记录引用。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F029",
      "label": "Review 专家实际看过的稿本指纹",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F029 类型提示：指纹/关联。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F030",
      "label": "Review 学院学术委员会意见（若适用）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F030 类型提示：决议引用。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F031",
      "label": "Review 学位评定分委员会意见（研究生如适用）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F031 类型提示：决议引用。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F032",
      "label": "Decision 教务处/研究生院等校级归口审查记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F032 类型提示：文书引用。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F033",
      "label": "Decision 最终批准/印发文书号与签发机关",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F033 类型提示：正式文书引用。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F034",
      "label": "Scope 中外/多学院共建项目责任与签发权限",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F034 类型提示：授权关系引用。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F035",
      "label": "Case 已被可信事件推进到的阶段 S0—S6/SE",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F035 类型提示：枚举。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F036",
      "label": "Event 补正/替稿/撤回/复核的请求及处理记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F036 类型提示：事件引用。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F037",
      "label": "Reference G50/S/T 专业设置、身份、学位授权等有效决定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F037 类型提示：跨案决定引用。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F038",
      "label": "Case 版本、姓名、代码、届别、来源矛盾及受影响字段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F038 类型提示：枚举+定位列表。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "专业/学位点合法存在、代码/层次/牵头单位",
      "purpose": "M001 专业/学位点合法存在、代码/层次/牵头单位；学校专业设置、研究生学位授权管理部门的台账/批准结果；S0 权威引用基线，新专业尤须确认；校方注册库可核条目、正式设立/学位点授权文书 M019；不要求申请人重复上传校方自有证明；F002—F008/F015/F034；[SRC-001、SRC-002、SRC-009]；以签发机构、授权有效期及目标专业代码归属；暂不可读校方记录 SU，代码与稿本冲突 CF，无授权结论 HD",
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
        "专业/学位点合法存在、代码/层次/牵头单位",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "本学段本批次现行指导意见、修（制）订通知/材料目录及权限",
      "purpose": "M002 本学段本批次现行指导意见、修（制）订通知/材料目录及权限；教务处/研究生院正式文件；S0—S6 权威引用基线，不可得时不阻断草稿收集；官网制度库、归口部门原文确认件；报道只可作为检索线索；F009/F012/F015/F018/F019；[SRC-004、SRC-005、SRC-012、SRC-016、SRC-020]；保留文号、签发日、生效/废止及适用批次；原文缺 PU，源不可访问 SU；上传截图不升级为政策证据",
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
        "本学段本批次现行指导意见、修（制）订通知/材料目录及权限",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "被修订的现行权威旧方案及其适用届别",
      "purpose": "M003 被修订的现行权威旧方案及其适用届别；方案档案保管部门；S1 修订条件基线；真正首制 NA；校方正式发布库文件或有权归口核印旧文及版次，不强迫反复上传；F010/F011/F013/F025/F038；[SRC-007、SRC-010]；旧版码、批准号、届别及校区与新稿对象一致；找不到 SU，扫描不可读 UR，冲突 CF；网页上传时间不能证明生效",
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
        "被修订的现行权威旧方案及其适用届别",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "当前专业/学位点拟制或修订稿",
      "purpose": "M004 当前专业/学位点拟制或修订稿；责任培养单位/专业负责人提供的 Word/PDF/可核电子稿；S1 内容事实预审核线；S0 咨询可尚未形成；来源明确的原始电子稿/受信扫描件；各类格式需保持相同内容指纹；F003—F014/F020—F025/F038；[SRC-007、SRC-010]；强制绑定对象键、稿件文件 ID、编辑单位、内容指纹、版次；无稿 NM（无法内容预审），不能识别 UR，跨专业错投 CF",
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
        "当前专业/学位点拟制或修订稿",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "责任单位送审函、发起说明与代理路径",
      "purpose": "M005 责任单位送审函、发起说明与代理路径；学院/研究生培养单位的受理文件/电子签发记录；S0—S5 条件；校级是否要求特定表单待 M002 核；单位办公系统有权送审记录、已验证签发公函；普通教师上传声明不等价；F009/F013—F017/F036；[SRC-006、SRC-014、SRC-017]；绑定发起单位、发起人及送审对象；若当期制度未规定不报缺件 PU；已声明送审而找不到授权记录 HD，不可读 UR",
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
        "责任单位送审函、发起说明与代理路径",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "专业需求/行业就业/社会调研与论证证据",
      "purpose": "M006 专业需求/行业就业/社会调研与论证证据；修订工作组、专业团队的调查报告及原始依据；S2 条件；2025 本科检查有工作事实；同期有来源的调研汇总和可追溯访谈/会议纪要；不要求个人数据全量移交；F026/F019/F025；[SRC-003、SRC-021]；标样本对象、年期、调查单位与草稿关联；当期要求未明 PU，确认应有而缺 NM，个人信息限制 L2/L3，扫描不可读 UR",
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
        "专业需求/行业就业/社会调研与论证证据",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "培养目标达成度/毕业要求达成情况分析",
      "purpose": "M007 培养目标达成度/毕业要求达成情况分析；专业/教学质量团队的报告或核定分析数据；S2 条件（正常修订常有关联）；首次开办无历史毕业生可 NA；教学评价部门可核的统计报告，脱敏后的同一口径记录 [SRC-003]；F023/F027；[SRC-003、SRC-021]；必须标统计届别和方案基准版本；无历史批次 NA；政策未知 PU，指标来自未授权系统 HD，不可读 UR",
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
        "培养目标达成度/毕业要求达成情况分析",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "适用国家/行业/学科/专业标准及项目约束",
      "purpose": "M008 适用国家/行业/学科/专业标准及项目约束；归口业务部门或标准发布机关的正式文本；S1—S2 条件权威引用，随学段专业而异；标准发布机关有效全文或归口部门明确适用的正式引用；不以专家口头转述为权威文本；F019/F022—F024；[SRC-001、SRC-021]；标版次、适用专业/学位类型/制定时点；阈值原文缺 PU，无法取得 SU；政策冲突 HD",
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
        "适用国家/行业/学科/专业标准及项目约束",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "旧新差异及修订理由表",
      "purpose": "M009 旧新差异及修订理由表；培养单位的对照说明，或系统生成的 diff；S1 修订条件基线；首制 NA；可从 M003+M004 严格对齐生成并附页码，不必额外索要手写对照表；F009—F014/F025/F038；[SRC-003、SRC-017]；对照准确旧版与当前新稿指纹；错用另一专业 CF，缺可读旧稿 SU/UR，明确应有时缺 NM",
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
        "旧新差异及修订理由表",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "专家论证会通知、签到、意见/纪要及审议稿本",
      "purpose": "M010 专家论证会通知、签到、意见/纪要及审议稿本；学院/专家组的原始会议档案；S3 后续已发生才产生，不同批次是否必须待核；有权会议平台可信会议记录+附件列表；学院新闻不替代纪要及签名核验；F028/F029/F021/F026；[SRC-006、SRC-021]；核会期、召集人、专家身份、所审 F021 指纹；会前 NA，已称开会却无原件 NM/HD，签字不可识别 UR",
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
        "专家论证会通知、签到、意见/纪要及审议稿本",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "学院学术委员会/专业建设委员会意见",
      "purpose": "M011 学院学术委员会/专业建设委员会意见；被授权会议办公室的决议记录；S4 条件且后续；适用性待当期规定确认；同等有权机构电子决议/正式档案，不用专家个人推荐信替代；F030/F029；[SRC-017、SRC-020]；证明会议合法性、参会/回避与目标稿，旧学院规定仅作线索；未到阶段 NA，是否要求 PU，对象不符 CF",
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
        "学院学术委员会/专业建设委员会意见",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "研究生学位评定分委员会培养方案审查意见",
      "purpose": "M012 研究生学位评定分委员会培养方案审查意见；相应分委员会正式决议；S4 研究生条件且后续；本科 NA；由有权会议秘书确认的决议、会议系统签发记录；F031/F029/F004/F007；[SRC-011—SRC-013]；核分委员会所辖学位点、任期、决议版次；2025 校章程原文尚缺 PU；假签名 HD，对象不一致 CF",
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
        "研究生学位评定分委员会培养方案审查意见",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "本科教务处/研究生院等校级归口受理、审核或反馈",
      "purpose": "M013 本科教务处/研究生院等校级归口受理、审核或反馈；真实行政流转记录；S5 后续，实际审批链待 M002 证实；归口办公室公文流转/校内受信业务台账；一般老师的“已通过”截图无效；F032/F018/F035；[SRC-002、SRC-009、SRC-020]；需精确关联审查事项、受理时间、稿本指纹；未发生 NA，宣称存在但来源失联 SU/HD，不可读 UR",
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
        "本科教务处/研究生院等校级归口受理、审核或反馈",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "采纳审查意见后的定稿内容",
      "purpose": "M014 采纳审查意见后的定稿内容；责任培养单位及归口部门；S5—S6 后续；无改动也应锁定实际决策稿；经授权明确锁版的 M004 同指纹，可不重复上传；F020—F025/F029/F033；[SRC-007、SRC-010、SRC-021]；对应专家意见版本与拟签发版；定稿与审定稿不同 CF/HD，尚未定稿 NA，不可读 UR",
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
        "采纳审查意见后的定稿内容",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "学校最终有效批准/印发决定",
      "purpose": "M015 学校最终有效批准/印发决定；校级有权机关签发公文或受信决议台账；S5—S6 仅正式决定后；初稿阶段严禁催交；经核实权力链的电子公文/正式批准记录；学院“审定会”新闻非合法替代；F013/F014/F033/F035/F037；[SRC-001、SRC-021]；仅 A 级决定，核机关、权限、文号、签发时间、决定稿指纹；未决 NA，声称生效而失证 HD/SU，伪章 HD",
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
        "学校最终有效批准/印发决定",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "正式适用入学届别/实施日期与覆盖范围映射",
      "purpose": "M016 正式适用入学届别/实施日期与覆盖范围映射；学校归口部门正式公告/发布目录；S6 后续；申请初期仅填提议值；M015 正式附件中明确年级与范围，或学校正式方案库带版本生效标记；F011—F014/F033/F038；[SRC-007、SRC-009]；分本科/学硕/专硕/博士/校区及跨年级并行；公告未载 PU/HD，错误覆盖 CF，勿以“2025版”直接映成“2025级”",
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
        "正式适用入学届别/实施日期与覆盖范围映射",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "补件通知、修改说明、撤回/复核/重报的事件文书",
      "purpose": "M017 补件通知、修改说明、撤回/复核/重报的事件文书；申请单位及真正受理机关；SE 只在事件发生后，不得事先要求；案卷 owner 可信受理事件及原通知；申请人发件不能证明对方已受理；F001/F016/F035/F036/F038；[SRC-001、SRC-012]；关联源案、源稿指纹、事件 actor 与时间；未发生 NA，已提交未收讫 HD，链接失联 SU，不可读 UR",
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
        "补件通知、修改说明、撤回/复核/重报的事件文书",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "委托代理/任职及机构授权证明",
      "purpose": "M018 委托代理/任职及机构授权证明；人员主管部门或有权机构授权记录；S0/SE 代理时条件；本人有权提交则 NA；校方人员/岗位权限断言、有效单位授权书并核委托范围；F015—F017/F034/F036；[SRC-001、SRC-014]；权限须覆盖对应代码、操作、时间；只上传身份证/名片不足以证权限 HD，过期 CF，不可读 UR",
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
        "委托代理/任职及机构授权证明",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "其他专业设置/学位授权/身份/合作审批的既有权威结论",
      "purpose": "M019 其他专业设置/学位授权/身份/合作审批的既有权威结论；原 G50/S/T owner 与主管部门；S0—SE 触发时权威引用，非本案新审批；原 owner 提供可验证决定 ID/状态/版本或有权签发公文原件；不支持源系统则人工核验；F006/F007/F017/F034/F037；[SRC-001、SRC-019]；必须有授权源、效力范围、是否被撤销与源版本；不可访问 SU，自报通过 HD，互相冲突 CF",
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
        "其他专业设置/学位授权/身份/合作审批的既有权威结论",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "中外合作/联合培养项目的合法协议和双方方案审批权",
      "purpose": "M020 中外合作/联合培养项目的合法协议和双方方案审批权；国际合作或联合培养主管部门文件；S0—S3 U-04/X-01 条件权威引用；已生效项目批复、正式协议或校方项目办核实的权责记录；非合作项目 NA；F005/F006/F013/F015/F034；[SRC-001] 仅一般权责，专项校本 SRC 未取得；双方版本/翻译及适用人群各自标识；尚无本校统一流程 PU，协议失联 SU，双签权争议 HD",
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
        "中外合作/联合培养项目的合法协议和双方方案审批权",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "evidence-review",
      "name": "研究级事实核验与政策待确认",
      "description": "对应原件第 08 节逐条规则。事实核验与政策适用性分开；研究来源 SRC 仅作为元数据，不是案卷材料 SourceRef。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "唯一对象路由",
          "requirement": "【研究级核验标准；非校方正式规则】R001 S0 唯一对象路由 | T：跨学生/届别的整体专业方案；F：仅个人计划、某学期排课；U：材料目的混合不明 | SRC-015/022/024；F003/F020；M004 | 看申请目标、对象粒度、课程表是否有学号/导师，校方教学任务有独立执行对象；2018 个人表仅反证，不能据标题“培养计划”路由 | T 可 PASS_FACT；F NOT_APPLICABLE 并转 S02/T01；U NEEDS_HUMAN_DECISION → 教务处/研究生院分流人",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "学校归属",
          "requirement": "【研究级核验标准；非校方正式规则】R002 S0 学校归属 | T：归属 CDUT；F：确为他校独立方案；U：校区/联合发布归属未核 | SRC-001/007/010；F002/F003；M001/M004 | 比学校代码、正式机构主体、是否联培；M004 校名 OCR 属 C，不抵 A 级备案 | 对得上 PASS_FACT；归属冲突 CONFLICT；A 源失联 SOURCE_UNAVAILABLE → 培养单位/归口",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "专业/学位点资格与代码",
          "requirement": "【研究级核验标准；非校方正式规则】R003 S0 专业/学位点资格与代码 | T：目标专业/授权点已登记；F：该实体属相邻的“增设专业/学位授权”决定而非本案审批；U：未查得授权 | SRC-001/007/009/010；F003—F008/F037；M001/M019 | 对代码、名称、层次、类别和有权设立状态；首制必须先引用原设置决定，不能本案顺带核准设专业 | A 登记吻合 PASS_FACT；异码 CONFLICT；登记不可得 SOURCE_UNAVAILABLE；申请越权设立 NEEDS_HUMAN_DECISION → 专业/学位点归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "申报单位主责",
          "requirement": "【研究级核验标准；非校方正式规则】R004 S0 申报单位主责 | T：学校台账与正式送审单位一致；F：只是非主责技术整理人；U：跨院牵头未确认 | SRC-002/006/008/014/020；F006/F015；M001/M002/M005 | 验单位代码、所辖专业和批次送审关系，2025 工作会议证明参与却未证明全校唯一申报人 | 符合证据 PASS_FACT；主从冲突 CONFLICT；权限未明 NEEDS_HUMAN_DECISION → 教务处/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "/SE 提交者真实身份",
          "requirement": "【研究级核验标准；非校方正式规则】R005 S0/SE 提交者真实身份 | T：有可信提交事件；F：尚未发生任何提交；U：只有 Renderer 自填姓名/职务 | SRC-001/014/019；F016/F035；M005/M018 | 从 Main/Host 可信身份或经主管验真的人员记录核，不以 OCR 签名/isTeacher 作 actor；提交时点限定当次事件 | 身份一致 PASS_FACT；身份不符 CONFLICT；自报不足 NEEDS_HUMAN_DECISION → 有权受理岗/身份管理者",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "/SE 代理授权",
          "requirement": "【研究级核验标准；非校方正式规则】R006 S0/SE 代理授权 | T：他人代发或代撤回/复核；F：受信本人在权责内操作；U：是否代理/授权范围不明 | SRC-001/014；F016/F017/F034；M018/M005 | 核授权主体、事项、专业范围、有效期及代办动作；印章截图只属 C，校方原授权为 A | T 有效 PASS_FACT；F NOT_APPLICABLE；过期/不匹配 CONFLICT；U NEEDS_HUMAN_DECISION → 人事/业务归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "现行批次政策",
          "requirement": "【研究级核验标准；非校方正式规则】R007 S0—S6 现行批次政策 | T：已取得适用本学段、版本的完整校本制度；F：已确定该批次不适用某文件；U：仅有间接文号/历史文件 | SRC-004/005/012/016；F018/F019；M002/M008 | 对文号、全文、签发日期、适用层次/批次、废止替代关系；2021 研究生指引不能当然约束 2026 | 原文与时效同证 PASS_FACT；F NOT_APPLICABLE；U POLICY_UNCONFIRMED，原件请求失联 SOURCE_UNAVAILABLE → 归口政策管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "/SE 截止日来源隔离",
          "requirement": "【研究级核验标准；非校方正式规则】R008 S0/SE 截止日来源隔离 | T：正主张本案存在法定/校定申请期限；F：本案无截止审查请求；U：只找到邻接业务期限 | SRC-005/009/023/024；F018/F035/F036；M002/M017 | 比较期限所属业务、对象和批次；2026-10-09 属课程项目申报，2025-11-28 属教学检查表，均非本方案审批期限 | 适用真证 PASS_FACT；借错期限 CONFLICT（来源归属）；原文未取得 POLICY_UNCONFIRMED → 教务处/研究生院，不自动逾期驳回",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "当前拟稿存在与可读",
          "requirement": "【研究级核验标准；非校方正式规则】R009 S1 当前拟稿存在与可读 | T：内容预审已开始；F：仅 S0 咨询/未形成稿；U：实际阶段不可核 | SRC-007/010；F020/F021/F035；M004 | 材料 ID、原件摘要、提取页表和读取质量；Word/PDF/受信扫描可替代，扫描缺页与未提交不同 | 可读 PASS_FACT；确应有但缺 NEEDS_MATERIAL；坏页 UNREADABLE；U NEEDS_HUMAN_DECISION → 起草单位/材料岗",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "封面对象归属",
          "requirement": "【研究级核验标准；非校方正式规则】R010 S1 封面对象归属 | T：稿本可读且对象已指向特定专业；F：S0 未送内容稿；U：仅旧版或代码不明 | SRC-007/010；F003—F008/F020/F038；M001/M004 | 将封面/课程页与 A 级专业代码、学位类型、院系逐项对应；专业别名须有正式别名映射 | 一致 PASS_FACT；跨学段/异码 CONFLICT；主数据失联 SOURCE_UNAVAILABLE → 专业/学位点管理岗",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "首制或修订的分类",
          "requirement": "【研究级核验标准；非校方正式规则】R011 S1 首制或修订的分类 | T：提交新制/全量/局修类型；F：单纯课程执行调整；U：首制理由与已有旧方案矛盾 | SRC-007/017/024；F009/F010/F011；M001/M003/M004/M005 | 查看原专业是否已有有效整体方案；首次开办无可引用旧版才可 M003/M009=NA；旧学院局修程序非全校授权 | 分类事实 PASS_FACT；学期课表 NOT_APPLICABLE；旧版冲突 CONFLICT；局修是否允许 POLICY_UNCONFIRMED → 本科研院归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "修订基准权威旧版",
          "requirement": "【研究级核验标准；非校方正式规则】R012 S1 修订基准权威旧版 | T：F009 为全修/局修；F：确为首次制订；U：是否存在先前有效版不明 | SRC-007/010/017；F010/F011/F013；M003/M016 | 只与有权归口签发且覆盖该届别的旧版比，PDF 上传日非生效日；不能要求起草人重传校方已有档案 | 旧版可证 PASS_FACT；首制 NOT_APPLICABLE；权威版失联 SOURCE_UNAVAILABLE；异版 CONFLICT → 方案档案管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "版本差异的可回溯性",
          "requirement": "【研究级核验标准；非校方正式规则】R013 S1 版本差异的可回溯性 | T：修订且存在可比旧稿；F：首次制订；U：旧版正文不可得 | SRC-003/017；F009/F020/F021/F025；M003/M004/M009 | 生成/核验同代码、同范围旧—新 diff，记录每个变更页行；可系统计算，不强制另交“对照表”；历史学院阈值不可复用 | diff 可追 PASS_FACT；首制 NOT_APPLICABLE；旧版缺源 SOURCE_UNAVAILABLE；错稿 CONFLICT；不可抽取 UNREADABLE → 起草/归口",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "目标版本及拟适用届别",
          "requirement": "【研究级核验标准；非校方正式规则】R014 S1 目标版本及拟适用届别 | T：稿本载拟目标版本/群体；F：尚在 S0；U：仅写“2025版”却无适用年级 | SRC-007/009/010；F012/F013/F014/F038；M004/M005/M016 | 对目标版次与拟覆盖入学届别逐值核对；M016 只在生效后决定真实范围 | “拟议值一致” PASS_FACT（非正式生效）；跨材料届别冲突 CONFLICT；届别规则不明 POLICY_UNCONFIRMED → 归口方案管理员",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "培养目标与毕业/能力要求文本",
          "requirement": "【研究级核验标准；非校方正式规则】R015 S1 培养目标与毕业/能力要求文本 | T：进入整体稿内容核查；F：尚在 S0；U：对应正文结构未核 | SRC-007/010/021；F022/F023；M004 | 核对应章节是否存在、读取得到何文本、内部编号是否可对齐；不按模型意见判断学术目标好坏 | 可定位 PASS_FACT；关键页坏 UNREADABLE；硬性栏目是否必填缺现行规程 POLICY_UNCONFIRMED → 专业负责人/学术专家",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "课程/环节结构提取",
          "requirement": "【研究级核验标准；非校方正式规则】R016 S1 课程/环节结构提取 | T：实际存在专业整体课程方案表；F：个人课程计划/本学期课表；U：附件格式或归属不明 | SRC-007/010/022/024；F004/F005/F024；M004/M008 | 比模块、学时学分、实践环节与对象/页码；不以个人培养表中 20/29/32 学分或排课规则充作本案阈值 | 完整可读 PASS_FACT（提取事实）；错类 NOT_APPLICABLE；坏表 UNREADABLE；标准达标 POLICY_UNCONFIRMED → 起草单位/归口",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "专业/学位适用标准的权威性",
          "requirement": "【研究级核验标准；非校方正式规则】R017 S1—S2 专业/学位适用标准的权威性 | T：主张某国标/行业标准强制适用；F：学校确认该标准与本类型无关；U：缺正式适用文件或版本 | SRC-016/021；F019/F022—F024；M002/M008/M004 | 必须核标准发布机关、年份、学段/专业覆盖和校本吸收方式；学院专家曾参照国标不证明所有阈值适用 | 来源可核 PASS_FACT（仅标准身份）；不适用 NOT_APPLICABLE；U POLICY_UNCONFIRMED，冲突 NEEDS_HUMAN_DECISION → 归口政策/学术专家",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "本研/学硕/专硕/博士及培养形式分支",
          "requirement": "【研究级核验标准；非校方正式规则】R018 S0—S2 本研/学硕/专硕/博士及培养形式分支 | T：研究生整体方案；F：本科；U：专博/非全授权及 2026 类型口径不明 | SRC-009/010/014/016/018；F003/F004/F005/F007/F019；M001/M002/M004/M008 | 核硕博授权、学术/专业学位、类别领域、全非全与对应方案，不移植历史 2023 方案指标 | 归属事实 PASS_FACT；本科对研究生专属项 NOT_APPLICABLE；当期指标未核 POLICY_UNCONFIRMED，跨类别 CONFLICT → 研究生院/学位点",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "行业需求与调研证明",
          "requirement": "【研究级核验标准；非校方正式规则】R019 S2 行业需求与调研证明 | T：该批次要求且调研阶段已经形成；F：尚在 S0/S1 或无此义务；U：当期材料目录未知 | SRC-003/008/021/023；F026/F018；M002/M006 | 核调研报告单位、样本/日期、针对的专业及稿本；2025 教学检查只证检查了工作情况，不设统一全校样本数 | 已形成可追 PASS_FACT；确应交却缺 NEEDS_MATERIAL；原文未知 POLICY_UNCONFIRMED；页坏 UNREADABLE → 责任工作组",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "培养目标达成度分析",
          "requirement": "【研究级核验标准；非校方正式规则】R020 S2 培养目标达成度分析 | T：有历史毕业群体且当期确要求分析；F：首制无历史群体/尚未形成；U：是否必交及适用届别未知 | SRC-003/021/023；F027/F013；M002/M007 | 比分析统计群体、版次、来源和被修订专业；学校检查要求不等于初报必交 | 可追 PASS_FACT；无历史对象 NOT_APPLICABLE；制度未核 POLICY_UNCONFIRMED；应有却无 NEEDS_MATERIAL → 专业质量团队",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "专家论证原始事实",
          "requirement": "【研究级核验标准；非校方正式规则】R021 S3 专家论证原始事实 | T：专家会已经举行；F：尚未举行且当前 S0—S2；U：只有新闻/未取得原会议档案 | SRC-006/021；F028/F035；M010 | 查会议日期、召集主体、专家名单、原始意见、正式留存档案；“审定会”标题/领导在场不等于校级批准 | 会议事实可证 PASS_FACT；未来 NOT_APPLICABLE；档案失联 SOURCE_UNAVAILABLE；签发有效性 NEEDS_HUMAN_DECISION → 学院会务/归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "专家审阅稿版本绑定",
          "requirement": "【研究级核验标准；非校方正式规则】R022 S3—S5 专家审阅稿版本绑定 | T：存在真实专家审议；F：尚无审议；U：会议记录没有列出所审附件 | SRC-006/021；F021/F028/F029/F038；M004/M010/M014 | 比 F029 会议附件指纹与 F021；M014 只在已到定稿阶段额外比较，不得在 S3 催交；审过 A 版不自动覆盖 B 版，可按变动字段人工确认意见是否仍适用 | 匹配 PASS_FACT；未发生 NOT_APPLICABLE；不同 CONFLICT；不明 NEEDS_HUMAN_DECISION → 专家组秘书/归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "学院学术审议",
          "requirement": "【研究级核验标准；非校方正式规则】R023 S4 学院学术审议 | T：本学段本批次现行规定要求且会议发生；F：无需此环节或未到 S4；U：仅见旧院办法 | SRC-017/020；F030/F029；M002/M011 | 核委员会权限、任期、议事记录与目标稿；2022 年某院汇编不能推广到全校 2026 | 已核事实 PASS_FACT；F NOT_APPLICABLE；现行性不明 POLICY_UNCONFIRMED；错稿/错组织 CONFLICT → 学院/教务处",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "学位分委员会审查",
          "requirement": "【研究级核验标准；非校方正式规则】R024 S4 学位分委员会审查 | T：研究生学位点且适用章程要求的会议已发生；F：本科或阶段尚未到；U：2025 章程未得全文 | SRC-011/012/013；F031/F004/F007/F029；M002/M012 | 核分委员会任期/所辖授权点、原决议、所审指纹；学院成立公告只证其职责实例 | 可证会议事实 PASS_FACT；本科/未达 NOT_APPLICABLE；权限现行性 POLICY_UNCONFIRMED；错辖 CONFLICT → 分委员会秘书/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "校级归口审阅/反馈",
          "requirement": "【研究级核验标准；非校方正式规则】R025 S5 校级归口审阅/反馈 | T：已提交有权归口并产生反馈；F：尚未到此阶段；U：仅有“教务处通过”聊天截图 | SRC-002/009/020；F032/F035；M013 | 读有权部门流转号、核时间、关联稿指纹及反馈主体；“组织制修订”不等于最终批准 | 归口事实 PASS_FACT；未来 NOT_APPLICABLE；原台账失联 SOURCE_UNAVAILABLE；伪权限 NEEDS_HUMAN_DECISION → 教务处/研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "最后定稿与意见衔接",
          "requirement": "【研究级核验标准；非校方正式规则】R026 S5—S6 最后定稿与意见衔接 | T：已生成定稿供正式决定；F：仍是初稿/未定稿；U：定稿与专家审稿差异无说明 | SRC-007/010/021；F020/F021/F025/F029/F032；M004/M010/M013/M014 | 核定稿 SHA、稿本页、专家与归口反馈是否被采纳/记录；是否必须再次审议只能由当期程序决定 | 版本关系明确 PASS_FACT；未来 NOT_APPLICABLE；错锁版 CONFLICT；是否须重审 NEEDS_HUMAN_DECISION → 起草单位/归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "最终决定及签发真实性",
          "requirement": "【研究级核验标准；非校方正式规则】R027 S5—S6 最终决定及签发真实性 | T：声称学校已正式批准/印发；F：仍在申报和审议中；U：文书或签发权限不明 | SRC-001/011/012/021；F016/F033/F035；M015/M014 | 仅核 A 级原公文号、签发机关、授权链、时间、批准稿指纹；学院专家意见和 Renderer 的 approved 均不得替代 | 原决定真实性事实 PASS_FACT，另行记录学校原文决定值；未决 NOT_APPLICABLE；无来源 SOURCE_UNAVAILABLE；越权/伪签 NEEDS_HUMAN_DECISION → 校级有权机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "正式适用届别及生效范围",
          "requirement": "【研究级核验标准；非校方正式规则】R028 S6 正式适用届别及生效范围 | T：已有正式决定并需要执行版本映射；F：尚无学校决定；U：只有“2025 版”无适用年级 | SRC-007/009；F011—F014/F033/F038；M015/M016 | 以 A 级发布附件中的实施日、年级、层次/专业及旧版继续有效条款为准；PDF 上传日期不推定生效 | 范围可读 PASS_FACT；未决 NOT_APPLICABLE；范围冲突 CONFLICT；缺明确条款 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION → 正式签发/归口部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "联合/跨院合作权责",
          "requirement": "【研究级核验标准；非校方正式规则】R029 S0—S3 联合/跨院合作权责 | T：中外合作/多学院共同管理或共享方案；F：单院常规方案；U：正式协议及联合审批授权缺失 | SRC-001（仅一般权限）；F005/F006/F015/F034；M019/M020 | 核正式协议适用学段/专业及各方签发范围；目前没有可直接证明校本合作方案审批链的 SRC，不能推定双签合法 | 仅对权威协议事实可 PASS_FACT；普通方案 NOT_APPLICABLE；专门流程 POLICY_UNCONFIRMED；越权 NEEDS_HUMAN_DECISION → 国际合作/双方归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "—SE 跨 G50/S/T 权威结论引用",
          "requirement": "【研究级核验标准；非校方正式规则】R030 S0—SE 跨 G50/S/T 权威结论引用 | T：须依赖另业务已形成的专业设立/学位点授权/公文或身份决定；F：未触发外部授权事实；U：来源 owner 暂不可取 | SRC-001/019/024；F007/F017/F034/F037；M001/M018/M019 | 校验 sourceCaseId,decisionId,owner,issuer,effectiveScope,sourceVersion,revocationState，只读有效结论，不依本案重定其是否批准 | A 级结论在范围内 PASS_FACT；不涉及 NOT_APPLICABLE；失联 SOURCE_UNAVAILABLE；已撤销或范围矛盾 CONFLICT/NEEDS_HUMAN_DECISION → 原业务 owner/归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "—SE 材料间实体冲突",
          "requirement": "【研究级核验标准；非校方正式规则】R031 S0—SE 材料间实体冲突 | T：有至少两份证据需交叉核姓名、单位、专业代码、学段、届别；F：无可比第二证据；U：至少一方无法读取/取源 | SRC-007/010/014/021；F002/F003/F006—F008/F013/F038；M001/M003/M004/M005/M010/M015 | 比同一字段归属+来源等级+版本而非字符串模糊相等；签字同名仍需 actor 核，现行权威源优先但不能遮盖冲突 | 一致 PASS_FACT；无比较项 NOT_APPLICABLE；不符 CONFLICT；来源缺 SOURCE_UNAVAILABLE，坏页 UNREADABLE → 材料岗/归口",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "SE 替稿后定向失效与重审",
          "requirement": "【研究级核验标准；非校方正式规则】R032 SE 替稿后定向失效与重审 | T：同案某材料新版指纹与旧版不同；F：内容指纹未变；U：缺旧版/变动范围无法提取 | SRC-006/007/019/021；F001/F020/F021/F025/F028—F033/F038；M003/M004/M009/M010—M016 | 对 changedFields 计算 R 的输入依赖闭包，仅将旧版受影响结论标 STALE，保留签发历史；学术审议是否可沿用交人工 | 定向重审完成的事实 PASS_FACT；无变化 NOT_APPLICABLE；改动范围不明 UNREADABLE/NEEDS_HUMAN_DECISION → 起草单位、旧审查原权利主体",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R033",
          "title": "SE 补件/退回与重新送审",
          "requirement": "【研究级核验标准；非校方正式规则】R033 SE 补件/退回与重新送审 | T：已有可信补件通知或替稿提交；F：未发生；U：申请人截图无受理记录 | SRC-003/005/023（后两类仅检查/间接线索）；F001/F035/F036；M017/M004/M005 | 先确认通知来自原有权受理机关、是否当前应有，再链接所补稿件、产生时间和旧问题；未确认学校期限时不按超时驳回 | 事件事实 PASS_FACT；未发生 NOT_APPLICABLE；确证当前应交而缺 NEEDS_MATERIAL；时限未知 POLICY_UNCONFIRMED → 原受理岗/申请单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R034",
          "title": "SE 撤回后重新发起",
          "requirement": "【研究级核验标准；非校方正式规则】R034 SE 撤回后重新发起 | T：有经确认的撤回请求/重报动作；F：没有该事件；U：校方是否收讫及撤回效力不明 | SRC-001/012；F001/F015—F017/F035/F036；M017/M018/M015 | 记录申请动作、真实 actor、原案与重报尝试的 lineage；申请提交不等于学校已同意撤销，已有生效决定不能自动删除 | 请求事实 PASS_FACT；未发生 NOT_APPLICABLE；效力/重报资格 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION → 原决定机关/受理机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R035",
          "title": "SE 复核、异议与正式纠错",
          "requirement": "【研究级核验标准；非校方正式规则】R035 SE 复核、异议与正式纠错 | T：要求复核既有材料处理或已形成决定；F：尚无复核请求；U：复核权限、期限或原决定来源未知 | SRC-001/011/012/013；F001/F033/F035—F037；M017/M015/M019 | 核申请者资格、被复核的原问题/文书和处理机关授权，附原案版本；不从一般申诉机制推定统一天数或自动推翻原文 | 复核请求存在 PASS_FACT；未发生 NOT_APPLICABLE；期限/权限缺 POLICY_UNCONFIRMED，实质争议 NEEDS_HUMAN_DECISION → 有权复核/原签发机关",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "local-intake",
      "name": "材料登记与对象/阶段核对",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-fact-review",
      "workflowOwner": "local"
    },
    {
      "id": "local-fact-review",
      "name": "事实、版本与证据覆盖预审",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "local-human-review",
      "returnToStageId": "local-intake",
      "workflowOwner": "local"
    },
    {
      "id": "local-human-review",
      "name": "有权人员人工复核（非校方正式决定）",
      "kind": "manual-review",
      "executorRole": "teacher",
      "returnToStageId": "local-fact-review",
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
  "templateId": "T05-T01",
  "name": "本研人才培养方案制定、修订审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T05-T01.md",
  "sourceDocumentSha256": "39f6eb1ba5274bf21c6b13b3bb2d2a61ed1706cd20c2618fd7d6a503a38b6867",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-22",
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
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-005",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-006",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-007",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-008",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-009",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-010",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-011",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-012",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-013",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-014",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-015",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-016",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-017",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-018",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-019",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-020",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-021",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-022",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-023",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-024",
      "status": "CDUT-VERIFIED"
    }
  ],
  "criteria": [
    {
      "sectionId": "evidence-review",
      "criterionId": "R001",
      "srcIds": [
        "SRC-007",
        "SRC-010",
        "SRC-015",
        "SRC-022",
        "SRC-024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-009",
        "SRC-010",
        "SRC-019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-008",
        "SRC-009",
        "SRC-012",
        "SRC-014",
        "SRC-016",
        "SRC-017",
        "SRC-020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-014",
        "SRC-017",
        "SRC-019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-014",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-012",
        "SRC-016",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-009",
        "SRC-012",
        "SRC-016",
        "SRC-020",
        "SRC-023",
        "SRC-024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-006",
        "SRC-007",
        "SRC-009",
        "SRC-010",
        "SRC-014",
        "SRC-017",
        "SRC-024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-007",
        "SRC-009",
        "SRC-010",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-003",
        "SRC-007",
        "SRC-010",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-009",
        "SRC-010",
        "SRC-014",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-007",
        "SRC-010",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-010",
        "SRC-021",
        "SRC-022",
        "SRC-024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-010",
        "SRC-012",
        "SRC-016",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-009",
        "SRC-010",
        "SRC-012",
        "SRC-014",
        "SRC-016",
        "SRC-018",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-008",
        "SRC-012",
        "SRC-016",
        "SRC-020",
        "SRC-021",
        "SRC-023"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-012",
        "SRC-016",
        "SRC-020",
        "SRC-021",
        "SRC-023"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-006",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-010",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-012",
        "SRC-016",
        "SRC-017",
        "SRC-020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-010",
        "SRC-011",
        "SRC-012",
        "SRC-013",
        "SRC-016",
        "SRC-020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-002",
        "SRC-009",
        "SRC-020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R026",
      "srcIds": [
        "SRC-002",
        "SRC-006",
        "SRC-007",
        "SRC-009",
        "SRC-010",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R027",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-010",
        "SRC-011",
        "SRC-012",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-009",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R029",
      "srcIds": [
        "SRC-001",
        "SRC-010",
        "SRC-019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-009",
        "SRC-010",
        "SRC-014",
        "SRC-019",
        "SRC-024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006",
        "SRC-007",
        "SRC-009",
        "SRC-010",
        "SRC-014",
        "SRC-017",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R032",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-006",
        "SRC-007",
        "SRC-009",
        "SRC-010",
        "SRC-017",
        "SRC-019",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R033",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-010",
        "SRC-012",
        "SRC-014",
        "SRC-017",
        "SRC-023"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R034",
      "srcIds": [
        "SRC-001",
        "SRC-012",
        "SRC-014",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R035",
      "srcIds": [
        "SRC-001",
        "SRC-011",
        "SRC-012",
        "SRC-013",
        "SRC-019",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
