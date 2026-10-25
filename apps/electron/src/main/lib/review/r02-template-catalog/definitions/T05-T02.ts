/**
 * R02 T05-T02 本地研究模板定义。
 * 来源：docs/design/review-agent/business-templates/R02/T05-T02.md
 * SHA-256：02261dea27f9b1eb2e19e09631179f30bdf2e3eb0aba345ca44bc8d1790a9f3c
 * 非校方正式模板；未确认政策只可形成建议并进入人工复核。
 */
import type { TemplateVersion } from '@profer/shared'

export const template: TemplateVersion = {
  "templateId": "T05-T02",
  "version": 1,
  "schemaVersion": 2,
  "name": "教学改革项目申报、过程检查与结题审核",
  "description": "教学改革项目申报、过程检查与结题审核。本地研究模板 · 非校方正式模板。仅支持事实提取、证据对应和审阅建议；批次政策、适用对象、签批权限未确认时必须待确认并由有权人员人工处理。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非成都理工大学校方正式模板；依据 T05-T02 研究原件的字段、材料槽与规则清单生成，政策证据状态为 PARTIAL。",
  "objectType": "project",
  "displayName": {
    "template": "教学改革项目申报、过程检查与结题审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "内部案卷 ID id [设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F001 类型提示：内部案卷 ID id [设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F002",
      "label": "项目归口：教务处/研究生院/平台等 enum [设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F002 类型提示：项目归口：教务处/研究生院/平台等 enum [设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F003",
      "label": "立项/申报批次及制度版本 str/ref [已证+设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F003 类型提示：立项/申报批次及制度版本 str/ref [已证+设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F004",
      "label": "本次办理阶段 enum [设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F004 类型提示：本次办理阶段 enum [设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F005",
      "label": "申报/管理单位及校区 id/str [已证+设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F005 类型提示：申报/管理单位及校区 id/str [已证+设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F006",
      "label": "人员权威 ID id [设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F006 类型提示：人员权威 ID id [设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F007",
      "label": "负责人姓名/显示名 str [已证+设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F007 类型提示：负责人姓名/显示名 str [已证+设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F008",
      "label": "在岗/导师/任课/管理人员等申报资格身份 enum/bool3 [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F008 类型提示：在岗/导师/任课/管理人员等申报资格身份 enum/bool3 [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F009",
      "label": "团队成员与角色 set [已证+设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F009 类型提示：团队成员与角色 set [已证+设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F010",
      "label": "项目名称 str [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F010 类型提示：项目名称 str [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F011",
      "label": "类别/级别：重点/一般/校级等 enum [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F011 类型提示：类别/级别：重点/一般/校级等 enum [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F012",
      "label": "推荐渠道 enum [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F012 类型提示：推荐渠道 enum [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F013",
      "label": "平台成员/牵头方及备案引用 ref/set [待核]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F013 类型提示：平台成员/牵头方及备案引用 ref/set [待核]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F014",
      "label": "申报目标、方案及预期成果 blob-ref/set [已证+设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F014 类型提示：申报目标、方案及预期成果 blob-ref/set [已证+设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F015",
      "label": "重复/相近选题事实与申明 bool3/ref [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F015 类型提示：重复/相近选题事实与申明 bool3/ref [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F016",
      "label": "同期项目负责人/成员参与数 num/bool3 [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F016 类型提示：同期项目负责人/成员参与数 num/bool3 [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F017",
      "label": "申请/单位送件日期与受理回执 date/ref [已证+设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F017 类型提示：申请/单位送件日期与受理回执 date/ref [已证+设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F018",
      "label": "申报书版本/摘要 ref [设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F018 类型提示：申报书版本/摘要 ref [设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F019",
      "label": "单位汇总—申报项目一致性 bool3 [已证+设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F019 类型提示：单位汇总—申报项目一致性 bool3 [已证+设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F020",
      "label": "单位审意识形态/保密/师德事实及签审 ref/bool3 [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F020 类型提示：单位审意识形态/保密/师德事实及签审 ref/bool3 [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F021",
      "label": "专家遴选/校内拟推荐公示状态 enum/ref [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F021 类型提示：专家遴选/校内拟推荐公示状态 enum/ref [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F022",
      "label": "正式项目号 id [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F022 类型提示：正式项目号 id [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F023",
      "label": "立项批文、批准主体与日期 ref/date [已证+设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F023 类型提示：立项批文、批准主体与日期 ref/date [已证+设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F024",
      "label": "现行获批研究任务/指标基线 ref/set [已证+设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F024 类型提示：现行获批研究任务/指标基线 ref/set [已证+设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F025",
      "label": "正式建设开始/截止时间 date-range [已证+设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F025 类型提示：正式建设开始/截止时间 date-range [已证+设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F026",
      "label": "当前研究/建设进度 str/num? [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F026 类型提示：当前研究/建设进度 str/num? [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F027",
      "label": "阶段成果事实及其与目标关联 set [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F027 类型提示：阶段成果事实及其与目标关联 set [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F028",
      "label": "问题及后续研究计划 str [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F028 类型提示：问题及后续研究计划 str [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F029",
      "label": "经费预算/到账及其批准版本 num/ref [待核]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F029 类型提示：经费预算/到账及其批准版本 num/ref [待核]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F030",
      "label": "项目资金使用记录/期间 set [已证+待核]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F030 类型提示：项目资金使用记录/期间 set [已证+待核]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F031",
      "label": "拟变更类型、变更前/后内容 enum/str [设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F031 类型提示：拟变更类型、变更前/后内容 enum/str [设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F032",
      "label": "变更原因、发生事实 str/ref [设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F032 类型提示：变更原因、发生事实 str/ref [设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F033",
      "label": "变更的正式批准机关、日期和新基线 ref [待核]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F033 类型提示：变更的正式批准机关、日期和新基线 ref [待核]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F034",
      "label": "已获批延期次数与历史记录 num/ref [已证+设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F034 类型提示：已获批延期次数与历史记录 num/ref [已证+设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F035",
      "label": "申请延期理由、拟新到期时间 str/date [已证+设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F035 类型提示：申请延期理由、拟新到期时间 str/date [已证+设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F036",
      "label": "申请提前结题的类别/完成陈述 bool3/str [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F036 类型提示：申请提前结题的类别/完成陈述 bool3/str [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F037",
      "label": "结题报告版本与适用类型 blob-ref [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F037 类型提示：结题报告版本与适用类型 blob-ref [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F038",
      "label": "目标—成果—实证逐项映射 set [已证+设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F038 类型提示：目标—成果—实证逐项映射 set [已证+设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F039",
      "label": "公开成果的资助名/编号标注 bool3/ref [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F039 类型提示：公开成果的资助名/编号标注 bool3/ref [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F040",
      "label": "专家验收意见及“通过/暂缓/不予通过” enum/ref [已证]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F040 类型提示：专家验收意见及“通过/暂缓/不予通过” enum/ref [已证]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F041",
      "label": "正式结果公示、通知及生效状态 ref/date [已证+设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F041 类型提示：正式结果公示、通知及生效状态 ref/date [已证+设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F042",
      "label": "撤项申请类型/主管办理状态 enum/ref [已证+设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F042 类型提示：撤项申请类型/主管办理状态 enum/ref [已证+设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F043",
      "label": "补件/撤回/复核原因与受理回执 str/ref [待核]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F043 类型提示：补件/撤回/复核原因与受理回执 str/ref [待核]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F044",
      "label": "G50/T01/S02/T02 既有权威结论引用 set [设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F044 类型提示：G50/T01/S02/T02 既有权威结论引用 set [设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F045",
      "label": "签署/盖章/回执核验状态 bool3/ref [设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F045 类型提示：签署/盖章/回执核验状态 bool3/ref [设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F046",
      "label": "所用政策版本、适用期、来源健康 ref/enum [设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F046 类型提示：所用政策版本、适用期、来源健康 ref/enum [设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F047",
      "label": "文件归属、源版本、摘要及受影响项 set [设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F047 类型提示：文件归属、源版本、摘要及受影响项 set [设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F048",
      "label": "证据可读性、来源/保密处理许可 enum/ref [设计]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F048 类型提示：证据可读性、来源/保密处理许可 enum/ref [设计]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "当期政策通知/指南",
      "purpose": "M001 当期政策通知/指南；证明批次、资格、时限、流程；教务处/研究生院/上级主管；官方公告、正式文件及指南；申报时系统政策源必需；同机关发布的正式修订可作为新依据，不能用外校通知；F002/F003/F011/F012/F025/F046；SRC-001/003–007/013/014；按签发机关、文号、日期、批次锁定；失联 SOURCE_UNAVAILABLE、现行性不明 POLICY_UNCONFIRMED；不让教师上传网页",
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
        "当期政策通知/指南",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "校内身份与资格",
      "purpose": "M002 校内身份与资格；证明在岗、导师、授课或管理角色；人事、身份和教学任职权威部门；校内认证记录；申报资格核验条件必需；认可的正式人事核实结论可代接口；不强制提供身份证扫描；F006–F009/F032；SRC-001/004；按 personId、效力日期与签发主体关联；源失联人工核，OCR 难辨不自动认定",
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
        "校内身份与资格",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "本批次项目申报书",
      "purpose": "M003 本批次项目申报书；证明题名、成员、类别、目标和申报内容；负责人拟稿，学院/归口保管正式版；2026 附件 2、2023 研究生附件 8 等；首次申报当前必需；若官方系统保存相同受理申报记录可引用，不能用后期结题书替代；F003/F007/F009–F015/F018/F019；SRC-001/003/004；批次、申请人、哈希、版本固定；缺 NEEDS_MATERIAL、坏 UNREADABLE，附件具体栏待核",
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
        "本批次项目申报书",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "单位申报汇总/推荐列表",
      "purpose": "M004 单位申报汇总/推荐列表；证明学院统一报送和项目归属；学院经办和负责人；汇总表、单位正式送件；学院报送当前必需，个人草稿时后续才产生；可引用有权单位的正式在线汇总；F005/F012/F017/F019；SRC-001/003/004；必须对应申报书同项目同行；缺仅给学院待办，冲突 CONFLICT",
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
        "单位申报汇总/推荐列表",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "意识形态、保密、师德单位审核",
      "purpose": "M005 意识形态、保密、师德单位审核；证明学院履行审查；单位审核人/校内签审系统；正式核验结论；2026 省专项学院报送条件必需；可信校内审核记录可引用，AI 自评不可替代；F020/F045；SRC-001；必须关联申报版本、审核人/时点；缺后向学院核验，涉密原文不任意出站",
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
        "意识形态、保密、师德单位审核",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "平台/委托方向、成员关系与备案",
      "purpose": "M006 平台/委托方向、成员关系与备案；证明特殊渠道资格；平台牵头单位及教务处备案受理方；平台通知、资格/备案回执；S03 条件必需，S04 依委托通知另核；官方平台/备案系统条目可代截图；F012/F013/F017；SRC-001/014；平台、批次独立绑定；无平台原件 SOURCE_UNAVAILABLE，不套学校 13 项推荐额度",
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
        "平台/委托方向、成员关系与备案",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "校内拟推荐公示/送省回执",
      "purpose": "M007 校内拟推荐公示/送省回执；证明遴选与上报；教务处公告和正式经办系统；评审、公示、报送后才产生；官网公示或可信报送回执可引用；F021/F041；SRC-001；公示/送省/上级批准三态分离；个人申报时缺失为 N/A，不能代 M008",
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
        "校内拟推荐公示/送省回执",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "正式立项文件/项目名录",
      "purpose": "M008 正式立项文件/项目名录；证明成立、项目号、机关；学校、省级/其他主管机关；正式批文、项目名单、授权项目库；中期/变更/延期/结题当前必需的外部权威事实；首次申报后续产生，可系统引用；F010/F022/F023/F025/F042；SRC-003/005/007/014；机关+项目号+批次+批准日期；仅拟推荐不满足；权威源失联 SOURCE_UNAVAILABLE",
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
        "正式立项文件/项目名录",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "获批目标、任务与计划/预算基线",
      "purpose": "M009 获批目标、任务与计划/预算基线；证明后续履约对象；有权归口保存的批准申报书/任务书；获批后各阶段当前必需，初次申报后续产生；已归档的校方批准版可引用；F024/F025/F029/F038；SRC-003–007/013；由批准版本确定，只有 M015/M017 合法更新；缺基线不能根据最新自报稿猜测",
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
        "获批目标、任务与计划/预算基线",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "中期检查报告",
      "purpose": "M010 中期检查报告；证明进度、建设、成果、问题与计划；负责人；2024 省级研究生中期报告附件 2；S07/S08 当前必需；原提交系统同版记录可引用；F026/F027/F028；SRC-005；项目号+阶段+版本；缺 NEEDS_MATERIAL，坏 UNREADABLE",
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
        "中期检查报告",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "学院中期汇总及签章",
      "purpose": "M011 学院中期汇总及签章；证明学院审查和上报；学院经办；2026 中期附件 3 Excel、签章 PDF；S08 当前必需，S07 个人准备阶段后续产生；可信学院报送归档可引用；F005/F017/F045；SRC-005；PDF/Excel 同项目同版对照；不一致 CONFLICT，签章图像待可信核验",
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
        "学院中期汇总及签章",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "中期阶段成果证据",
      "purpose": "M012 中期阶段成果证据；证明已列报的产出；项目组、成果原发布者；论文、教材、案例、报告等；中期报告列报成果时条件必需；合法取得的出版/成果系统记录可引用；F027/F038；SRC-005；成果逐项对应目标、作者、日期、项目号；没有成果时记录真实进度，不能臆造",
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
        "中期阶段成果证据",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "预算、拨款、使用权威记录",
      "purpose": "M013 预算、拨款、使用权威记录；核经费事实；财务/主管部门；预算批复、账册、资金项目条目；专项经费核验时条件必需，非首次申报/所有结题都强制传；优先合法财务查询；F029/F030；SRC-004/005/013/014；逐笔绑定项目号/期间/版本；源失联 SOURCE_UNAVAILABLE，不可借本模板判断合法报销",
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
        "预算、拨款、使用权威记录",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "变更申请及原/拟新内容对照",
      "purpose": "M014 变更申请及原/拟新内容对照；证明变更意愿；负责人/学院；受理机关要求的书面申请或系统单，现行表未取；S10 当前条件必需；正式受理的电子申请可替代纸件，但不可代批准；F031/F032；SRC-003/004/013/014；两个目标版本不可覆盖；有请求无 M015 时仍执行旧基线",
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
        "变更申请及原/拟新内容对照",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "有权变更批准/驳回",
      "purpose": "M015 有权变更批准/驳回；证明新目标/成员/预算权限；本批次授权主管机关的批复、正式项目系统事件；S10 决定后才产生；可系统引用合法授权记录；F024/F031/F033/F045；SRC-013/014 未核；审批人、项目号、版本与效力时间；来源失联维持旧基线，人工核",
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
        "有权变更批准/驳回",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "延期请求与原因",
      "purpose": "M016 延期请求与原因；证明申请延期；负责人/归口受理；2025 校级研究生延期表附件 12；S11/S12 当前条件必需；2026 省专项具体表格未核，按有权机构认可的受理方式；F035；SRC-001/006/007/013/014；项目号、原到期日、拟新日、申请版；缺请求报缺，不把请求当同意",
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
        "延期请求与原因",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "既有延期批准与新到期记录",
      "purpose": "M017 既有延期批准与新到期记录；证明次数和期限；有权主管机关；批复、项目系统变更记录；批准后才产生；既往已延期的 S12/S13 则需当前核对，可引用可信项目库；F025/F034/F035；SRC-001/006/007/013/014；按批准日期、次数追溯；缺源不可用 M016 申请次数顶替",
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
        "既有延期批准与新到期记录",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "教改研究类别结题报告",
      "purpose": "M018 教改研究类别结题报告；证明结题主张；项目负责人；2025 附件 10、2026 附件 9 教改研究结题书；S13/S14/S15 当前必需；官方线上提交同版可用，不可用教材/案例库的不同表；F036/F037/F038；SRC-006/007；项目号+结题轮次+版本；缺 NEEDS_MATERIAL，坏 UNREADABLE，表单具体栏未逐页核",
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
        "教改研究类别结题报告",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "结题成果及实证证明",
      "purpose": "M019 结题成果及实证证明；核每个目标的成果归属与资助标注；项目组与公开成果签发者；论文、教材、专著、案例、报告、建议等；结题时按立项目标条件必需；可引用可核出版或校方成果平台原件；F035/F038/F039；SRC-005–007；每项 goalId+evidenceId+作者/项目号+日期；无关材料或造假疑点人工处理，不自行定及格篇数",
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
        "结题成果及实证证明",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "学院结题汇总、签章",
      "purpose": "M020 学院结题汇总、签章；证明学院受理及审查；学院负责人/经办；2026 附件 10、2025 附件 11；S13/S14 学院报送阶段当前必需，个人结题起草时后续才产生；归口正式回执可引用；F005/F017/F045；SRC-006/007；按项目号一案一行、签章对应报告版本；缺时给学院待办",
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
        "学院结题汇总、签章",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "专家验收/整改/重验意见",
      "purpose": "M021 专家验收/整改/重验意见；证明已有专家评审事实；研究生院组织的专家/归口；原评审意见、整改要求；评审后才产生；S15 重验需真实先前不合格/整改意见；官方评审系统可引用；F040/F038；SRC-004/006/007；项目号+专家授权+评审轮次+版本；个人自制意见无效，未产生 N/A",
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
        "专家验收/整改/重验意见",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "撤项申请、学院核实/安排",
      "purpose": "M022 撤项申请、学院核实/安排；证明撤项请求；项目负责人/学院；2025 附件 13 撤销表、2026 学院撤项材料；S16 当前条件必需；如官方系统有受理可引用，退休/离职身份由 M002 核；F042/F007/F008；SRC-006/007；申请撤项与批准撤项分别记录；无批准不得将项目标已撤销",
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
        "撤项申请、学院核实/安排",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "撤回、重报或异议复核请求/回执",
      "purpose": "M023 撤回、重报或异议复核请求/回执；证明有请求；申请人、原受理机关；书面或系统申请，合法渠道未证；S18 研究预留，能否受理未知；可信原受理记录可引用，站内自建按钮不能冒用；F004/F043/F017；SRC-013/014 未核；原申请 ID、请求者、阶段/回执；未证实途径 POLICY_UNCONFIRMED，转人工",
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
        "撤回、重报或异议复核请求/回执",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "补件及版本关系",
      "purpose": "M024 补件及版本关系；证明替换了哪些材料；原提供者及可信收件系统；新增文件、版本事件/变更说明；S17 当前条件必需；只补受影响槽，不能原地销毁旧版；F018/F043/F047/F048；SRC-001/005–007，补件制度待核；旧/新哈希+项目与字段；旧依赖结论失效，新版读不了继续 UNREADABLE",
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
        "补件及版本关系",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "G50/S/T 外部权威决定",
      "purpose": "M025 G50/S/T 外部权威决定；证明相邻事项已正式办结；原业务主管/可信跨案引用；T01/S02/T02 等官方结果；真正依赖外部决定时条件必需，优先系统引用；无接口交原主管核，不迫申请人补无关资料；F044/F024；SRC-012/015；对象、签署人、状态、版本严格匹配；失联留来源待办，不由本模板代审批",
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
        "G50/S/T 外部权威决定",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "可信受理、actor 与签章验证链",
      "purpose": "M026 可信受理、actor 与签章验证链；证明谁以何权限处理何版本；主进程认证与校方受理/用印系统（接口未证）；事件与回执；内部全程溯源必需，不是申请人上传新文件；无接线应标系统能力缺口；F001/F004/F005/F006/F017/F045/F047/F048；SRC-001/005–007/012；actorId+org+capability+时间+文档哈希；无法认证不得写正式决定",
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
        "可信受理、actor 与签章验证链",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "权威项目参与、限项、延期名录",
      "purpose": "M027 权威项目参与、限项、延期名录；核已有项目与重复；教务处/研究生院/省级平台项目库，接口未核；明文限项/延期限制触发时条件必需；无法读时由归口核台账，不要求本人自制“全部项目证明”；F009/F015/F016/F034；SRC-001/003/004/006；级别、批次、负责人/成员角色及查询时间；失联 SOURCE_UNAVAILABLE，AI 题名相似仅提示",
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
        "权威项目参与、限项、延期名录",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "2023 研究生教改申报活页",
      "purpose": "M028 2023 研究生教改申报活页；证明旧批次特别材料；负责人/学院；2023 通知要求的活页（栏目未取）；仅 S06 历史批次当前必需；校方正式存档的同版活页可引用，不移植 2026 新批次；F014/F018；SRC-004；申请人、批次、项目名、版本；历史附件不可读 UNREADABLE，不补造",
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
        "2023 研究生教改申报活页",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "正式验收结果公示/最终通知",
      "purpose": "M029 正式验收结果公示/最终通知；证明学校或主管正式处理状态；研究生院/教务处/上级主管；官网公示、正式结论及后续决定；专家评定、公示程序之后才产生；权威网页/系统可直接引用，不令个人上传；F040/F041/F042；SRC-003/006/007/013；项目号+机关+发布日期+结果+异议处理状态；公示不当然等于最终生效",
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
        "正式验收结果公示/最终通知",
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
          "title": "适用政策、批次、归口",
          "requirement": "【研究级核验标准；非校方正式规则】R001 适用政策、批次、归口；全阶段 S01–S19 | T=存在匹配办理批次；F=已确定属于其他专项；U=批次/现行文件不清 | SRC-001/002/003/004/005/006/007/008/009/010/011/013/014/015；F002/F003/F046；M001 | 以签发机关、标题、年度、项目类型、项目名单和发布/适用期交叉定位；2021/2023 历史通知仅历史使用、知识图谱专项路由邻项。真命中 PASS_FACT；另一业务路由为 NOT_APPLICABLE；缺校本细则 POLICY_UNCONFIRMED，官网失联 SOURCE_UNAVAILABLE；教务处/研究生院批次管理员确认",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "一案/项目锚与阶段",
          "requirement": "【研究级核验标准；非校方正式规则】R002 一案/项目锚与阶段；全阶段 | T=本次请求需要确认所属案卷/历史项目；F=仅对已立项编号子事实且阶段为未立项的初次申报（锚验证本身仍触发 T）；U=同名异案或阶段不明 | SRC-001/003/005/006/007/012；F001/F004/F010/F022/F047；M003/M008/M026 | 已立项凭机关+批次+项目号+有效变更链，初报凭内部申请号+受理稿版本；不得凭题名合案。新案项目号子事实为 NOT_APPLICABLE，但案卷锚仍须 PASS_FACT 或异常；异号/异归口 CONFLICT，主进程案卷身份不可读转内部待办；Case Owner/归口档案员",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "负责人实名与申报稿身份",
          "requirement": "【研究级核验标准；非校方正式规则】R003 负责人实名与申报稿身份；申报/变更/撤项 S01–S06/S10/S16 | T=需核人员身份；F=只核匿名公开成果且不需人员身份；U=身份权威库接不通 | SRC-001/004/006/007；F006/F007；M002/M003/M008/M026 | 人员权威 ID 与申报负责人、原批准负责人及更名链对照，不能仅以姓名判断；一致 PASS_FACT，ID 冲突 CONFLICT，库失联 SOURCE_UNAVAILABLE，身份替换权限转 NEEDS_HUMAN_DECISION；人事/学院授权核验人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "申报资格身份",
          "requirement": "【研究级核验标准；非校方正式规则】R004 申报资格身份；S01/S03/S04/S05/S06 | T=批次通知要求在岗教师/管理人员/导师/授课身份；F=中期/结题不重新审历史申请资格；U=现行任职或批次范围不明 | SRC-001/003/004/013/014；F006/F008；M001/M002/M003 | 只用本批次的身份要求核权威在岗/任课事实，身份状态以申报有效时点为准；满足 PASS_FACT，权威事实不满足时 NEEDS_HUMAN_DECISION，来源断开 SOURCE_UNAVAILABLE；人事/学院和归口确认，不机械跨学段否决",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "团队名单与角色归属",
          "requirement": "【研究级核验标准；非校方正式规则】R005 团队名单与角色归属；申报及获准人员变更 S01–S06/S10 | T=项目申报书或获准变更包含成员；F=当前阶段无团队项；U=成员身份/变更链不明 | SRC-001/003/004/013/014；F007/F009/F031/F033；M002/M003/M015 | 对成员姓名、权威 ID、排序/角色及获批成员版本逐人对应；一致 PASS_FACT，团队自报与批准不符 CONFLICT，成员调换但未批转 NEEDS_HUMAN_DECISION；学院/项目主管，不能把申请替换当批准",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "该批次限项与重复选题事实",
          "requirement": "【研究级核验标准；非校方正式规则】R006 该批次限项与重复选题事实；S01/S04/S05/S06 | T=当期通知明确限项或重复申报要求；F=其他阶段或该批次明确无此检查；U=项目参与名录不可用或批次定义不明 | SRC-001/003/004/013/014；F009/F015/F016；M001/M003/M027 | 以同一限项统计口径、申报时点、本人负责人/参与角色及权威在研库对照；SRC-001 的负责人 1 项、同期同类成员最多 2 项只绑定 2026 该专项。等于已核上限不自动记违规，实际超出上限才记 factObserved=false 并交 NEEDS_HUMAN_DECISION；申报人本次新增项目是否计数由批次政策定；同名选题仅提示不自动定抄袭；项目库失联 SOURCE_UNAVAILABLE；项目归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "级别/类别与推荐渠道",
          "requirement": "【研究级核验标准；非校方正式规则】R007 级别/类别与推荐渠道；S01–S06 | T=本次申报分重点/一般或学校/平台/委托渠道；F=后续阶段不新选申报渠道；U=类别/渠道仅凭文件名推断 | SRC-001/003/004/014；F003/F011/F012；M001/M003/M004 | 按当期通知和申报书对应栏及学院报送渠道对照；一致 PASS_FACT，申报与单位报送冲突 CONFLICT，渠道权限未明确 POLICY_UNCONFIRMED；教务处/研究生院/平台办事人。2026 学校推荐名额不能套平台推荐",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "平台成员及提前备案",
          "requirement": "【研究级核验标准；非校方正式规则】R008 平台成员及提前备案；仅 S03 | T=真实平台推荐且需学校备案；F=学校推荐、委托等非平台渠道；U=牵头方资格及备案规则原件缺 | SRC-001/014；F012/F013/F017；M001/M006/M026 | 分别查平台成员关系、牵头方正式通知、教务处备案回执及批次；均权威可核 PASS_FACT，凭个人“已备案”无回执为 SOURCE_UNAVAILABLE/人工核对；平台细则不清 POLICY_UNCONFIRMED；平台牵头方及教务处。不得套校推名额",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "委托揭榜方向及报送上限事实",
          "requirement": "【研究级核验标准；非校方正式规则】R009 委托揭榜方向及报送上限事实；仅 S04 | T=2026 专项竞争性委托渠道；F=非委托；U=榜单/受托渠道原文无法取得 | SRC-001/014；F003/F011/F012/F016；M001/M003/M004/M006 | 校内已核通知称学校该渠道限报 2 项，只核学校统一报送记录数量与榜单方向，不预断省级受托成立；缺榜单 SOURCE_UNAVAILABLE，是否在权威名单外报送由教务处 NEEDS_HUMAN_DECISION；教务处及上级委托机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "当批申报书、目标与版本",
          "requirement": "【研究级核验标准；非校方正式规则】R010 当批申报书、目标与版本；S01–S06 | T=个人初报或学院受理申报；F=只核已批准项目而无需重收申报初稿；U=当批强制栏目未取 | SRC-001/003/004；F010/F014/F018；M001/M003/M024 | 项目题名、申报目标、方案、成员及版本摘要逐段定位；符合已核公告的基本材料存在性 PASS_FACT，当前确须申报书未交 NEEDS_MATERIAL，文件不可读 UNREADABLE，附件逐栏未知 POLICY_UNCONFIRMED；申请人补件/学院确认。不能把 AI 写的申报内容当原签章",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "2023 研究生历史活页",
          "requirement": "【研究级核验标准；非校方正式规则】R011 2023 研究生历史活页；仅 S06 | T=SRC-004 所在旧批次教改研究申报；F=其他批次/类别；U=历史受理档案或活页版式不可核 | SRC-004/013；F014/F018；M003/M028 | 核活页确属同批次、同负责人、同项目及送交版本；一致 PASS_FACT，旧档应存但查无文件按归档侧 SOURCE_UNAVAILABLE，个人当前准备而未交则 NEEDS_MATERIAL；研究生院/学院档案员；不外推为 2026 本科必需",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "单位汇总与申报一致性",
          "requirement": "【研究级核验标准；非校方正式规则】R012 单位汇总与申报一致性；S02/S04 学院环节、S05/S06 | T=实际进入单位统一推荐/报送；F=S01 个人草稿或平台无此校内流程；U=单位汇总版本未核 | SRC-001/003/004；F005/F007/F010/F012/F017/F019；M003/M004/M026 | 对同一项目申报书的题名、负责人、类型、申报版本与汇总表行、校内报送回执逐项比对；一致 PASS_FACT，冲突 CONFLICT，单位尚未生成归其待办 NEEDS_MATERIAL；学院经办/教务处或研究生院，不能责令个人伪造学院盖章",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "2026 省专项学院审查结论与签发",
          "requirement": "【研究级核验标准；非校方正式规则】R013 2026 省专项学院审查结论与签发；S02/S04 学院报送 | T=SRC-001 要求学院意识形态、保密、师德审查；F=其他项目批次无适用依据；U=签审权限或记录来源不明 | SRC-001/002；F020/F045；M005/M026 | 核授权单位对当前申报版本的真实审查记录与签发主体，不抽取不必要涉密原文；核真存在 PASS_FACT，仅有盖章图片 NEEDS_HUMAN_DECISION，系统不通 SOURCE_UNAVAILABLE；学院具权人，不能由 AI 生成师德/保密通过",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "送件截止与受理事实",
          "requirement": "【研究级核验标准；非校方正式规则】R014 送件截止与受理事实；S02/S04/S05/S06/S08/S13/S14 | T=通知确列本批次且已到报送阶段；F=个人本地起草/其他年份；U=回执无法核验 | SRC-001/003/004/005/006/007；F003/F017/F046；M001/M004/M011/M020/M026 | 对发布方、具体经办方、邮件/平台回执时间与公告截止逐一比较；SRC-001 2026-06-22 17:00 不迁移到研究生中期。准时事实 PASS_FACT，权威显示超时则记录事实并 NEEDS_HUMAN_DECISION，不能自判是否可补报；受理处/学院",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "学校拟推荐与正式立项分离",
          "requirement": "【研究级核验标准；非校方正式规则】R015 学校拟推荐与正式立项分离；S02/S19/获批后 | T=出现专家推荐、公示、上级批文中任一记录；F=个人稿尚未进入评审；U=后续决定来源不可核 | SRC-001/003/004/005/007/014；F021/F022/F023/F041；M007/M008/M026 | 逐条记拟推荐/公示/上报/正式立项的不同 issuer、时间、projectAnchor；仅该阶段现有事实可 PASS_FACT。M007 永不证明省级已立项；无上级批文时正式状态 UNKNOWN、SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；教务处/省级或对应立项机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "正式获批任务、期限和基线版本",
          "requirement": "【研究级核验标准；非校方正式规则】R016 正式获批任务、期限和基线版本；S07–S16/S19 | T=已立项并办理中期、变更、延期或结题；F=初次申报尚未立项；U=批准稿/变更批准缺失 | SRC-001/003/004/005/006/007/013/014；F022/F023/F024/F025/F033；M008/M009/M015/M017 | 以权威立项编号和已批目标/原始期限为基线，只有核真有权变更或延期批复后才形成新有效版本；一致 PASS_FACT，变更申请稿偷换原目标 CONFLICT，基线失联 SOURCE_UNAVAILABLE；项目归口/上级批准机关。未立项时为 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "中期进度、问题与计划陈述",
          "requirement": "【研究级核验标准；非校方正式规则】R017 中期进度、问题与计划陈述；S07/S08/S09 | T=本批次确已要求中期报告；F=初报或暂无中期安排；U=S09 无当前通知 | SRC-002/003/004/005/013；F024/F026/F028；M001/M009/M010 | 对照获批目标逐段定位进度、问题、后续计划，记录报告是否描述而不计算“合格率”；存在且可追踪 PASS_FACT，当前必需报告缺 NEEDS_MATERIAL，S09 没有原文 POLICY_UNCONFIRMED；负责人/归口中期管理员",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "阶段成果事实归属",
          "requirement": "【研究级核验标准；非校方正式规则】R018 阶段成果事实归属；S07/S08及确有中期的S09 | T=报告列举可核阶段成果；F=尚未产生成果且该批次不规定当前应有成果；U=成果来源与项目关联未核 | SRC-005/013；F010/F027/F038；M008/M010/M012 | 按成果原刊/机构、作者、项目号、日期、目标关联逐条匹配；对应吻合 PASS_FACT，不一致 CONFLICT，宣称存在而未附可核证据 NEEDS_MATERIAL；负责人补充/学院复核，是否符合质量目标交专家裁量",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "学院中期汇总、扫描件/Excel与签审",
          "requirement": "【研究级核验标准；非校方正式规则】R019 学院中期汇总、扫描件/Excel与签审；仅 S08 | T=学院进入该批次中期统一报送；F=S07 个人阶段；U=来源或签章真伪不明 | SRC-005；F005/F017/F026/F045；M010/M011/M026 | Excel 对应行、签章 PDF、中期报告项目号和日期逐项比对，签审权限另核；吻合 PASS_FACT，两文件不一致 CONFLICT，影像未验证 NEEDS_HUMAN_DECISION；学院中期经办、研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "经费预算/拨付/期间事实",
          "requirement": "【研究级核验标准；非校方正式规则】R020 经费预算/拨付/期间事实；S07/S10/S13 有明确经费核验任务时 | T=适用项目被要求核对授权资金事实；F=普通申报草稿或无经费核验任务；U=预算批复、财务接口或权限未知 | SRC-004/005/007/013/014；F025/F029/F030；M009/M013/M015 | 对同一项目号、预算批准版本、拨付日期、支出发生期和财务账的金额仅作事实比对；吻合 PASS_FACT，矛盾 CONFLICT，财务源断开 SOURCE_UNAVAILABLE；财务/项目主管，支出合法性、调剂授权一律 NEEDS_HUMAN_DECISION",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "变更请求对象及事实",
          "requirement": "【研究级核验标准；非校方正式规则】R021 变更请求对象及事实；仅 S10 | T=立项后提出人员、目标、期限或预算等拟变更；F=没有变更请求；U=本批次受理资格和表单不明 | SRC-003/004/013/014；F024/F031/F032；M009/M014/M026 | 保留原目标、拟改内容、申请理由和拟生效日期对照；内容完整事实 PASS_FACT，但本校受理表/变更类型未知则 POLICY_UNCONFIRMED；请求绝不更新现行基线；负责人/学院，再由项目有权归口确认",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "变更的正式批准与版本切换",
          "requirement": "【研究级核验标准；非校方正式规则】R022 变更的正式批准与版本切换；S10 决定后及 S19 | T=有权机构已处理变更申请；F=仅提出申请、尚无决定；U=签署机关是否有权或批准件不可取 | SRC-003/004/013/014；F024/F031/F033/F045；M014/M015/M026 | 以项目号、变更前后版本、批准机关与效力日期核真 M015；批准成立后仅影响对应目标/成员/期限；真命中 PASS_FACT，未处理为 NOT_APPLICABLE（不生成缺件），权限不清 NEEDS_HUMAN_DECISION；教务处/研究生院或上级权属机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "延期请求理由、目标期限",
          "requirement": "【研究级核验标准；非校方正式规则】R023 延期请求理由、目标期限；S11/S12 | T=项目已立项且申请延期；F=没有延期请求；U=本批次请求渠道或到期时间未知 | SRC-001/006/007/013/014；F025/F035；M008/M009/M016 | 对原批复期限、书面理由、申请期限和批次通知做事实对照；申请已提出的事实 PASS_FACT，不等于获准。2026 省专项可申请延 1 年不自动批准；申请超适用期限交 NEEDS_HUMAN_DECISION；项目归口，办事程序不明 POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "既有延期次数和获准期限",
          "requirement": "【研究级核验标准；非校方正式规则】R024 既有延期次数和获准期限；S12/S13/S19 | T=项目以前曾延期或本次延期已有正式决定；F=首次申请尚未获批；U=旧批复/批准权限不可核 | SRC-001/006/007/013/014；F025/F034/F035；M008/M016/M017/M027 | 只数核真 M017 批准次数和新到期日期，不数 M016 申请次数；匹配具体 2025 校级与 2026 研究生项目通知的“一次/一年”分支，不跨批次复用。PASS_FACT 为记录一致，超界或期限争议交 NEEDS_HUMAN_DECISION；归口/上级主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "结题类型、报告及提前结题条件陈述",
          "requirement": "【研究级核验标准；非校方正式规则】R025 结题类型、报告及提前结题条件陈述；S13/S14/S15 | T=到达本批次结题/整改重验提交阶段；F=申报/中期尚未结题；U=应使用表单或提前条件原文未知 | SRC-004/006/007/013；F036/F037/F047；M001/M018/M024 | 确认“教改研究”而非教材、案例库等其他类别的官方结题表，项目号/轮次/版本一致；报告存在且类型符合 PASS_FACT，缺书 NEEDS_MATERIAL、坏书 UNREADABLE；提前结题是否获准只能转研究生院 NEEDS_HUMAN_DECISION",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "结题目标、成果及实证逐目标关联",
          "requirement": "【研究级核验标准；非校方正式规则】R026 结题目标、成果及实证逐目标关联；S13/S14/S15 | T=结题报告声称履行已有获批目标；F=尚未进入结题；U=正式任务书及获批调整缺失 | SRC-003/004/005/006/007/010/013；F024/F027/F038；M009/M015/M018/M019 | 按 goalId 从批准目标版逐条列 claimedEvidenceId、证据页、发布时间与作者/项目归属；可验证对应 PASS_FACT，具体目标没有支持材料 NEEDS_MATERIAL，目标新稿未获批准 CONFLICT；学术效果、达标率由专家 NEEDS_HUMAN_DECISION",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "省级研究生教改公开成果资助标注",
          "requirement": "【研究级核验标准；非校方正式规则】R027 省级研究生教改公开成果资助标注；S13 中适用 2024 省级项目 | T=适用通知要求公开成果标注资助/编号；F=其他批次或非公开成果无此条款；U=出版原页不能取得 | SRC-004/005/007；F022/F039；M008/M019 | 用对应批次规定的项目名称/批准号逐份对公开原件核字样，记录明确位置；符合 PASS_FACT，标注与批准号不一致 CONFLICT，出版方无法访问 SOURCE_UNAVAILABLE；归口核实后交专家处理，不能对本科项目强加同一字句",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "结题学院送审与签章",
          "requirement": "【研究级核验标准；非校方正式规则】R028 结题学院送审与签章；S13/S14 学院报送节点 | T=学院将负责人结题包汇总报送；F=个人填报尚未交学院；U=学院送达/签章来源未核 | SRC-006/007；F005/F017/F045；M018/M020/M026 | 逐行比对 M020 汇总与 M018 正式报送版本，校验真实单位送达及签审权限；一致 PASS_FACT，错项 CONFLICT，单位未形成则给学院 NEEDS_MATERIAL/人工核验；学院经办和研究生院，不让负责人自制签章",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "专家意见、整改重验依据",
          "requirement": "【研究级核验标准；非校方正式规则】R029 专家意见、整改重验依据；S13/S14评审后、S15 | T=专家已评审，或已有正式旧不合格/整改意见后申请重验；F=结题材料刚提交尚无评审；U=专家记录权限/版本不明 | SRC-004/006/007/013；F037/F038/F040/F045；M018/M021/M024/M026 | 核项目号、验收轮次、专家授权、报告版本与原整改要求；只核意见是否权威存在及对应新版，绝不由模型给“通过/暂缓/不予通过”；核真 PASS_FACT，旧意见套新版 CONFLICT/NEEDS_HUMAN_DECISION；研究生院与评审专家",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "正式验收公示和最终结果效力",
          "requirement": "【研究级核验标准；非校方正式规则】R030 正式验收公示和最终结果效力；S19（或评审后） | T=校方/上级已有正式验收结果；F=尚未评审或公示；U=公示异议处理、终局权限不清 | SRC-003/006/007/013/014；F023/F040/F041；M008/M021/M029/M026 | 将专家意见、公示与有权最终通知分别关联，核公告项目号/机关/时间/生效依据；每层事实可 PASS_FACT，公示≠一律最终批准，生效条件未证则 NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED；教务处/研究生院/上级决定机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "撤项申请与处理事实",
          "requirement": "【研究级核验标准；非校方正式规则】R031 撤项申请与处理事实；仅 S16及处理后S19 | T=已立项研究生项目提出撤项或学院提出特情办理；F=仅是撤回未受理的申报稿；U=撤项终审权/表单和原因未核 | SRC-006/007/013；F006/F008/F022/F042；M002/M008/M022/M029 | 复核人员实际离职/无法结题等原因，核学院申请与正式撤项处理文件，分别记 REQUESTED、ACCEPTED、DECIDED；申报事实符合 PASS_FACT，不代表批准撤项；权力未知 NEEDS_HUMAN_DECISION；研究生院及人事核验人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "撤回、重报和异议复核请求",
          "requirement": "【研究级核验标准；非校方正式规则】R032 撤回、重报和异议复核请求；仅 S18 | T=当事人明确提出撤回/重报/争议申请；F=未提出此类请求；U=受理程序、可申请主体或期限不明 | SRC-013/014（均待核）；F004/F006/F017/F043；M023/M026 | 只记录原案、请求者、原因、拟争议的决定版本及联系归口记录；事实性收到请求可以 PASS_FACT，但官方是否受理永为 POLICY_UNCONFIRMED 直至校方确认，不设自造线上复议；原受理单位/有权复核人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R033",
          "title": "补正材料替换和依赖定向重审",
          "requirement": "【研究级核验标准；非校方正式规则】R033 补正材料替换和依赖定向重审；仅 S17及被影响原阶段 | T=已收到新版或可信更正事件；F=无变更，仅重复查看同版；U=版本/哈希或替换关系丢失 | SRC-001/005/006/007/012/013；F018/F037/F043/F047/F048；M003/M018/M024/M026 | 建旧新 fileId、sha256、sourceVersion、evidenceSpan 的不可变链接，只使依赖旧版的 R 结果 superseded，再计算 affectedRuleIds；新版材料合规可读仅 PASS_FACT 于版本事实，已签/已验收的实质变更仍 NEEDS_HUMAN_DECISION；原材料持有人和原签发机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R034",
          "title": "跨 G50/T01/S02/T02 既有正式决定引用",
          "requirement": "【研究级核验标准；非校方正式规则】R034 跨 G50/T01/S02/T02 既有正式决定引用；S19及真实依赖时 | T=本项目某成果/执行事实须依赖邻业务正式授权；F=不涉及相邻权威决定；U=R02/G50 行级权责未明 | SRC-008/009/012/015；F024/F044；M003/M018/M025 | 校验外部 decisionId、对象、有效版、签发机关、权限与适用范围，仅引用不重新批准调课、个人培养、人事绩效或独立课程项目；吻合 PASS_FACT，缺外部记录 SOURCE_UNAVAILABLE，路由 UNKNOWN 为 POLICY_UNCONFIRMED；原业务 Owner/归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R035",
          "title": "可信受理 Actor、签章和有效签发权限",
          "requirement": "【研究级核验标准；非校方正式规则】R035 可信受理 Actor、签章和有效签发权限；学院/中期/变更/结题/结果阶段 | T=行为被宣称为正式受理、签审或最终决定；F=私人未提交草稿；U=授权会话/签章真实性不明 | SRC-001/002/004/005/006/007/011/012/013/014；F005/F017/F020/F033/F040/F042/F045；M005/M011/M015/M020/M021/M026/M029 | Main/可信认证回执绑定 actorId+org+capability+stage+sourceVersion+time，Renderer actor 字段一律不作真实身份；被授权核真 PASS_FACT，仅图片/自填角色为 NEEDS_HUMAN_DECISION、接线缺 SOURCE_UNAVAILABLE；学校/学院有权人员而非 AI",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R036",
          "title": "材料可读性、来源许可及保密边界",
          "requirement": "【研究级核验标准；非校方正式规则】R036 材料可读性、来源许可及保密边界；所有 S01–S19 | T=当前需读取文件或权威记录；F=当前未到阶段的未来材料；U=合法访问许可、内容可读性或来源健康不明 | SRC-001/003/004/005/006/007/012；F018/F037/F046/F047/F048；M003/M010/M018/M019/M024/M026 | 逐附件检查 MIME/页数/解析成功率及人工抽样页、访问许可、敏感等级、哈希和属主；已核可读 PASS_FACT，不可读 UNREADABLE，权威端不可达 SOURCE_UNAVAILABLE，涉密处理授权不明 NEEDS_HUMAN_DECISION；材料持有人/归口信息安全员。OCR 猜测值不得替代原文",
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
  "templateId": "T05-T02",
  "name": "教学改革项目申报、过程检查与结题审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T05-T02.md",
  "sourceDocumentSha256": "02261dea27f9b1eb2e19e09631179f30bdf2e3eb0aba345ca44bc8d1790a9f3c",
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
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-013",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-014",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-015",
      "status": "GENERAL-RESEARCH"
    }
  ],
  "criteria": [
    {
      "sectionId": "evidence-review",
      "criterionId": "R001",
      "srcIds": [
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
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-012",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-006",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R014",
      "srcIds": [
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
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R026",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-010",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R027",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R029",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R032",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R033",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-012",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R034",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-012",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R035",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-011",
        "SRC-012",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R036",
      "srcIds": [
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
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
