/**
 * R02 T05-T03 本地研究模板定义。
 * 来源：docs/design/review-agent/business-templates/R02/T05-T03.md
 * SHA-256：361f6eab2b0c859eb7d0743ad20653cd4a2a72ff26d42557b0837cc81889c867
 * 非校方正式模板；未确认政策只可形成建议并进入人工复核。
 */
import type { TemplateVersion } from '@profer/shared'

export const template: TemplateVersion = {
  "templateId": "T05-T03",
  "version": 1,
  "schemaVersion": 2,
  "name": "课程建设、精品课程与在线课程建设立项审核",
  "description": "课程建设、精品课程与在线课程建设立项审核。本地研究模板 · 非校方正式模板。仅支持事实提取、证据对应和审阅建议；批次政策、适用对象、签批权限未确认时必须待确认并由有权人员人工处理。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非成都理工大学校方正式模板；依据 T05-T03 研究原件的字段、材料槽与规则清单生成，政策证据状态为 PARTIAL。",
  "objectType": "project",
  "displayName": {
    "template": "课程建设、精品课程与在线课程建设立项审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "学段/教学体系 enum",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F001 类型提示：学段/教学体系 enum。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F002",
      "label": "项目建设类别 enum/string",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F002 类型提示：项目建设类别 enum/string。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F003",
      "label": "批次唯一代码/年度 string",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F003 类型提示：批次唯一代码/年度 string。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F004",
      "label": "校本公告/政策版本 URI+hash+date",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F004 类型提示：校本公告/政策版本 URI+hash+date。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F005",
      "label": "报送截止/分阶段截止 datetime?",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F005 类型提示：报送截止/分阶段截止 datetime?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F006",
      "label": "主管/归口组织及动作 orgId+roles",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F006 类型提示：主管/归口组织及动作 orgId+roles。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F007",
      "label": "本批课程清单/学院名额 ref+value?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F007 类型提示：本批课程清单/学院名额 ref+value?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F008",
      "label": "申请/案卷唯一 ID uuid",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F008 类型提示：申请/案卷唯一 ID uuid。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F009",
      "label": "当前办理阶段 enum",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F009 类型提示：当前办理阶段 enum。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F010",
      "label": "申请提交/送达时间 datetime",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F010 类型提示：申请提交/送达时间 datetime。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F011",
      "label": "代理/经办人可信 ID personId?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F011 类型提示：代理/经办人可信 ID personId?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F012",
      "label": "课程负责人可信 ID personId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F012 类型提示：课程负责人可信 ID personId。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F013",
      "label": "负责人姓名 string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F013 类型提示：负责人姓名 string。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F014",
      "label": "负责人所属学院/单位 orgId",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F014 类型提示：负责人所属学院/单位 orgId。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F015",
      "label": "在职/聘用或身份状态 enum+date",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F015 类型提示：在职/聘用或身份状态 enum+date。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F016",
      "label": "职称/学位与生效日 struct?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F016 类型提示：职称/学位与生效日 struct?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F017",
      "label": "研究生教学经历/授课事实 list?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F017 类型提示：研究生教学经历/授课事实 list?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F018",
      "label": "本批限项/历史事故/在研状态 struct?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F018 类型提示：本批限项/历史事故/在研状态 struct?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F019",
      "label": "课程权威 ID courseId?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F019 类型提示：课程权威 ID courseId?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F020",
      "label": "课程名称/曾用名 string+aliases?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F020 类型提示：课程名称/曾用名 string+aliases?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F021",
      "label": "培养方案版本/课程归属 ref+version",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F021 类型提示：培养方案版本/课程归属 ref+version。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F022",
      "label": "课程学分与学时 number+unit?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F022 类型提示：课程学分与学时 number+unit?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F023",
      "label": "课程性质/专业方向 enum/string?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F023 类型提示：课程性质/专业方向 enum/string?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F024",
      "label": "既有开课/建设基础 list+dates?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F024 类型提示：既有开课/建设基础 list+dates?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F025",
      "label": "平台与项目课程 ID platformId+courseId?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F025 类型提示：平台与项目课程 ID platformId+courseId?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F026",
      "label": "资源/图谱/访问量等指标 metrics?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F026 类型提示：资源/图谱/访问量等指标 metrics?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F027",
      "label": "平台数据截止/出具者/签名 struct?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F027 类型提示：平台数据截止/出具者/签名 struct?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F028",
      "label": "课程资源清单及第三方素材来源 list",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F028 类型提示：课程资源清单及第三方素材来源 list。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F029",
      "label": "建设目标和拟交付成果 text+struct",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F029 类型提示：建设目标和拟交付成果 text+struct。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F030",
      "label": "建设进度/阶段任务与周期 schedule",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F030 类型提示：建设进度/阶段任务与周期 schedule。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F031",
      "label": "团队成员身份集合 personId[]?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F031 类型提示：团队成员身份集合 personId[]?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F032",
      "label": "团队分工/参与确认 role[]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F032 类型提示：团队分工/参与确认 role[]。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F033",
      "label": "企业外方负责人资质 struct?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F033 类型提示：企业外方负责人资质 struct?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F034",
      "label": "合作企业身份、合作基础 org+evidence[]?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F034 类型提示：合作企业身份、合作基础 org+evidence[]?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F035",
      "label": "校企课程大纲与授课协同 struct?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F035 类型提示：校企课程大纲与授课协同 struct?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F036",
      "label": "知识产权/公开传播承诺 signedStatement?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F036 类型提示：知识产权/公开传播承诺 signedStatement?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F037",
      "label": "申报书版次、填报签署 hash+date+sign?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F037 类型提示：申报书版次、填报签署 hash+date+sign?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F038",
      "label": "学院初审意见/签发者 decisionRef?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F038 类型提示：学院初审意见/签发者 decisionRef?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F039",
      "label": "学院推荐排序/汇总版本 rank?+version",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F039 类型提示：学院推荐排序/汇总版本 rank?+version。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F040",
      "label": "归口受理回执 receipt+time?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F040 类型提示：归口受理回执 receipt+time?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F041",
      "label": "专家组和评审/部门评议意见 reviewRef?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F041 类型提示：专家组和评审/部门评议意见 reviewRef?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F042",
      "label": "公示内容、版本与期限 noticeRef?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F042 类型提示：公示内容、版本与期限 noticeRef?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F043",
      "label": "异议请求人/事项及证据 struct?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F043 类型提示：异议请求人/事项及证据 struct?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F044",
      "label": "正式立项/同意建设/不予立项决定 enum+ref?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F044 类型提示：正式立项/同意建设/不予立项决定 enum+ref?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F045",
      "label": "决定机关、审定依据、文号（若有）及日期 struct?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F045 类型提示：决定机关、审定依据、文号（若有）及日期 struct?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F046",
      "label": "既有项目/相邻业务正式状态 decisionLink[]?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F046 类型提示：既有项目/相邻业务正式状态 decisionLink[]?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F047",
      "label": "补正、撤回、变更请求 event?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F047 类型提示：补正、撤回、变更请求 event?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F048",
      "label": "补正/撤回/复核处理结果 decisionRef?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F048 类型提示：补正/撤回/复核处理结果 decisionRef?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F049",
      "label": "中期、结题、上线、验收事实 eventRefs[]?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F049 类型提示：中期、结题、上线、验收事实 eventRefs[]?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F050",
      "label": "建设经费/配套资金口径 money?+currency",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F050 类型提示：建设经费/配套资金口径 money?+currency。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F051",
      "label": "规定报送渠道及方式 enum+address?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F051 类型提示：规定报送渠道及方式 enum+address?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F052",
      "label": "材料主从版本链与失效范围 versionGraph",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F052 类型提示：材料主从版本链与失效范围 versionGraph。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F053",
      "label": "审核/代报送主体的组织授权 authorityRef?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F053 类型提示：审核/代报送主体的组织授权 authorityRef?。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F054",
      "label": "2026 校企课程拟定企业授课学时 nonnegativeInt+totalHours+planVersion",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F054 类型提示：2026 校企课程拟定企业授课学时 nonnegativeInt+totalHours+planVersion。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "批次公告/现行规则",
      "purpose": "M001；批次公告/现行规则；教务处、研究生院、继续教育学院或国际教育等归口官方公告/公文；前 公告定位；可用同机关确认的有效公文档案，不由申请人提供；F001–006,F050–051；SRC-001/002/004/005/006/007/008；以官方 URL、发布/效力版归属归口；源/政→暂停门槛判断；附件名不是规则正文",
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
        "批次公告/现行规则",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "课程范围/学院名额/申报批次清单",
      "purpose": "M002；课程范围/学院名额/申报批次清单；发文部门及学院，官方目录/名额附件；条 A 学院配额、B 第三批目录；合法替代为主管部门可核签清单；F002,F007,F019–023；SRC-002 附3、004 附1；每批单独版本；源→核名单；读→换可读官方版；不靠教师自填名单",
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
        "课程范围/学院名额/申报批次清单",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "立项申报书",
      "purpose": "M003；立项申报书；教师持有、学校提供版式的填报件；前 A/B/C/D；E/F 原始表未取到，必需性 政；校方认可的在线表单记录可替代纸件；F008,F012–014,F019–024,F029–037；SRC-002 附1、004 附2、005 附1、006 附3；教师申报版及哈希；缺→补件；读→重交清晰版；内容与汇总不一致 冲",
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
        "立项申报书",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "学院申报汇总表",
      "purpose": "M004；学院申报汇总表；学院教务经办/培养单位，学院汇总记录；续·T2 A/B/C/D 由学院统一报送；可用部门确认的同版结构化汇总；F014,F019,F038–039；SRC-002 附2、004 附3、005 附2、006 附10；学院批次版本；T1 不要求；T2 缺/读 由学院补；跨院或排序冲突人工",
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
        "学院申报汇总表",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "培养方案/课程目录",
      "purpose": "M005；培养方案/课程目录；教务、研究生、继教等权威课程管理归口；条·T1 A 和 C 课程身份、B 清单映射；官方只读查询或核签课程清单为替代，原则上无需教师重复上传；F019–023,F035；SRC-002/004/005；版本包含学年、课程 ID、主管组织；源→待部门核；冲→比对年份，禁用个人自报替换",
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
        "培养方案/课程目录",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "人员及任职/职称/学位权威记录",
      "purpose": "M006；人员及任职/职称/学位权威记录；人事/组织/学位数据归口；条·T1 A/B/C/D 对当批负责人资格；部门查询或核签证明替代，不能强制教师重复上传；F011–016,F033,F053；SRC-002/004/005/006；以人员 ID、有效日期绑定；源→人工查职称；冲→停资格结论；身份证/工号等不向无权限者展示",
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
        "人员及任职/职称/学位权威记录",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "既往授课、事故与限项等权威记录",
      "purpose": "M007；既往授课、事故与限项等权威记录；教学管理/项目库；条·T1 C 研究生授课经历、D 历史限项/禁报；其他类别不能自动要求；F017–018,F024；SRC-005/006；源库+生效期记录；源/政→人工核；不能凭“未查到”判不存在事故",
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
        "既往授课、事故与限项等权威记录",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "建设计划、目标与里程碑",
      "purpose": "M008；建设计划、目标与里程碑；教师/团队，申报书正文或附页；前 A/B/C，D 以当年申报内容为准；若已完整填写于 M003，不另强迫上传；F024,F029–030,F032,F035；SRC-002/004/005/006；申请版本从属于 M003；缺/读→明确缺哪项；内容价值、可行性由专家判断",
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
        "建设计划、目标与里程碑",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "现有课程建设基础/资源清单",
      "purpose": "M009；现有课程建设基础/资源清单；教师和平台、列视频/教材/图谱等；条 A 强调较好基础、B 部分已有素材、C 既往教学基础；可用受信教学档案或 M003 内列示，非强制单独附件；F024–028；SRC-002/004/005/009；按资源原版、链接、归属和日期保存；读/冲→定位疑点；与未来交付 M022 区分；截图仅线索",
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
        "现有课程建设基础/资源清单",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "平台来源报表/后台授权统计",
      "purpose": "M010；平台来源报表/后台授权统计；问渠学堂、网络课程等平台归口；条 只有申报证明确需核在线基础，或立项后实际验收；授权导出/人工平台核签为替代；F025–027；SRC-002/003/009；课程 ID、统计截止、出具人和摘要哈希；源→不可自动判数值；申请人截图不能提升为平台签发数据",
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
        "平台来源报表/后台授权统计",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "版权/素材出处及合法传播说明",
      "purpose": "M011；版权/素材出处及合法传播说明；课程负责人、权利人；条 A/B 及含第三方在线资源的其他分支；可在 M003 内嵌声明与素材清单或正式授权文件；F028,F036；SRC-002/004；逐素材源与签署版；缺/读→就适用部分补充；侵权或涉密疑点 H 专人处理",
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
        "版权/素材出处及合法传播说明",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "团队名单、角色/参与确认",
      "purpose": "M012；团队名单、角色/参与确认；负责人及成员、学院确认；条 B/C 团队组织、A 多人团队、D 对限项核验；当期申报书中完整名单可替代单独名册；F031–033；SRC-002/004/005/006；逐人 ID 与申请版绑定；冲→人事/本人核；不能以负责人代签当成员同意",
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
        "团队名单、角色/参与确认",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "企业合作方与专家资质",
      "purpose": "M013；企业合作方与专家资质；合作企业/学院，企业证明或机构核签记录；条·C 研究生校企双负责人资质；企业正式任职证明、职务资格或学校认可档案为替代；F033–034；SRC-005；企业名称、签发者、有效日期；缺/读→C 场景补；真实性及资格裁量 H，非其他分支必交",
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
        "企业合作方与专家资质",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "合作协议/基地证明/既往合作成果",
      "purpose": "M014；合作协议/基地证明/既往合作成果；学校、企业、基地管理者；条·C 证明稳定合作基础；SRC-005 列举不同佐证，是否足以互替依当期完整表单及学院审查；F034,F046；SRC-005；双方签署版/项目编号/生效日期；缺/读→就缺口补证；冲→校企双向核；不臆造必须三件齐全",
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
        "合作协议/基地证明/既往合作成果",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "拟建校企课程教学大纲",
      "purpose": "M015；拟建校企课程教学大纲；校内外双负责人、学院；前·C SRC-005 明确配套大纲；可为学院受信课程大纲版本；F022,F035,F054；R018/R031；SRC-005；课程 ID、16/32 学时规格、企业授课学时及双方版本；缺/读→补清晰版；本批学时分配的事实值可比，分工可行性由专家审",
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
        "拟建校企课程教学大纲",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "学院初审/排序/推荐签署记录",
      "purpose": "M016；学院初审/排序/推荐签署记录；学院有权审核者；续·T2 A/B/C/D；E 的推荐存在但表单/签章格式 政；可由学校流程中已签发意见替代纸章；F014,F038–039,F053；SRC-002/004/005/006/008；绑定 M003 申报哈希；T1 不索要；缺/冲→学院核，签章图片不代表主体可信",
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
        "学院初审/排序/推荐签署记录",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "部门收件/受理回执",
      "purpose": "M017；部门收件/受理回执；受理机关，OA/邮箱/纸件登记；续·T2/T3；可用有权接收人确认的寄送记录/签收单，不假设已建线上入口；F010,F037,F040,F051–052；SRC-002/004/005/006；到达时间和受理方版本；不以邮箱“已发送”推定校方签收；源/冲→受理机关查",
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
        "部门收件/受理回执",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "专家评审意见/评审名单",
      "purpose": "M018；专家评审意见/评审名单；归口组织的专家组；续·T3 A/B/C/D/E 有评审；受信专家平台记录或正式会议纪要可替代单页；F041；SRC-002/004/005/006/007；评审人/对象/文件版本；T1/T2 不索取；源不可达待归口核，结论非正式批准",
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
        "专家评审意见/评审名单",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "实际发布的公示页面/公示记录",
      "purpose": "M019；实际发布的公示页面/公示记录；学院/归口部门；续·T4 C/E 有当批公示依据；B 的公告拟公示但 2026 正式结果“公布”与独立公示不能混淆，实际发生才启用；A/D 未证明；F042；R023；SRC-004/005/007/016；发布时间、截止、页面版；源/政→查是否存在公示；未核即不催交；不能自行计算“无异议即批准”",
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
        "实际发布的公示页面/公示记录",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "公示异议与关联证据",
      "purpose": "M020；公示异议与关联证据；异议人提交，归口机关收件；条·T4 有异议才产生；机关收件编号/书面证据，依法限制查看；F043；SRC-007，其余 SRC-004/005 仅确认公示存在；异议提交版；未异议 N/A；缺/读→按有权机关程序补；不得对外泄露异议人",
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
        "公示异议与关联证据",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "有权立项/同意建设/不予立项决定及名单",
      "purpose": "M021；有权立项/同意建设/不予立项决定及名单；学校或本批实际受权审定机关；续·T5 仅当结果已形成时需要；C 为正式发文，B 可为经证实授权的党政联席会审定及正式结果公告，学校 OA/真实核签名单为可用形态；F044–045,F053；R024；SRC-002/005/008/016；机关、会议/文号（如有）、课程/项目 ID、版本；T1–T4 不要求；B 仅目录摘要不等于完整可核名单或授权；严禁要求政策未规定的第二张公文",
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
        "有权立项/同意建设/不予立项决定及名单",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "建设中期、课程上线及结题验收材料/权威结论",
      "purpose": "M022；建设中期、课程上线及结题验收材料/权威结论；项目组和归口部门；续·T6 仅在立项后、后续流程产生；官方验收系统记录替代项目自述；F026–027,F049；SRC-003/005/006/015；按阶段另存版本；立项前 N/A；材料缺/读不能倒推立项无效",
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
        "建设中期、课程上线及结题验收材料/权威结论",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "补正、更正、撤回或变更请求",
      "purpose": "M023；补正、更正、撤回或变更请求；已授权申请人/代理；条·G/H 发起时产生，授权流程请求记录可替代纸件；F047,F052–053；具体许可规则 SRC-002～008 未见完整条款；从属原案版；无请求 N/A；身份不真/越权 H，不因请求即撤销",
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
        "补正、更正、撤回或变更请求",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "正式补正/撤回/异议/复核处理结果",
      "purpose": "M024；正式补正/撤回/异议/复核处理结果；有权学院/归口/学校；续·G/H/I 处理完才产生；可信签发与流程记录替代截图；F048；SRC-007 对异议提出仅部分支持，处分规则现行性待核；绑定原决定版；未决定不得先交；源→保留待办，严禁自动裁量",
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
        "正式补正/撤回/异议/复核处理结果",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "既有项目/相邻 T01/T02/S02/G50 正式结论",
      "purpose": "M025；既有项目/相邻 T01/T02/S02/G50 正式结论；各有权业务 Owner；条 D 限项/旧项目与 C 合作基础等实际触发；可直接按合法权限只读引用权威记录，不要求无故重复上传；F018,F024,F046；SRC-006/013/014；保留来源决定 ID/签发/时效；源/政→人工查；旧结论不能冒充本案新立项",
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
        "既有项目/相邻 T01/T02/S02/G50 正式结论",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "当批经费计划或申报预算",
      "purpose": "M026；当批经费计划或申报预算；负责人/财务归口；条 若当批表单要求申请预算；SRC-004/005 提供经费标准但未证明均需独立预算附件；可在 M003 内体现；F029–030,F050；SRC-004/005；金额币种及当批版本；无预算栏目不设必交；经费“资助标准”≠拨付凭证",
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
        "当批经费计划或申报预算",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "2023 研究生质量工程项目活页",
      "purpose": "M027；2023 研究生质量工程项目活页；负责人/学院；前·D，当年 SRC-006 四明确附申报书及项目活页；可使用官方认可在线填写版本；F024,F029–030,F037；SRC-006；项目类别、申请版、院级汇总同号；当年 缺/读→补；不推广为其他年份全部课程申报必交",
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
        "2023 研究生质量工程项目活页",
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
          "title": "批次真实性",
          "requirement": "【研究级核验标准；非校方正式规则】R001 批次真实性；T0、T1、T2 | 真：A/B/C/D 官方批次匹配；假：非课程建设立项请求；未知：E/F 或新批无正式通知 | 002/004/005/006/007/008 → F001–004,F006 → M001 | 按公告域名、发文机关、标题、时间、哈希及子类核同一批次；E0，宣传页 SRC-009/010 不替代；历史截止仅供历史回放 | 真且核对一致 PASS_FACT→归口；假 NOT_APPLICABLE→路由；未知 POLICY_UNCONFIRMED→归口政策管理员；官网失联 SOURCE_UNAVAILABLE→发文部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "学段与项目子类",
          "requirement": "【研究级核验标准；非校方正式规则】R002 学段与项目子类；T0/T1 | 真：已选 A～E；假：决定实为 T01 排课/结题/成果认定；未知：F 或混合标题 | 002/004/005/006/007/011 → F001–003,F019,F023 → M001,M002,M003 | 以决定对象、课程体系及当批子类对照，E0/E1；名称含“课程”不充分；跨学段须拆申请记录而非重编号模板 | 一致 PASS_FACT→经办；错路由 NOT_APPLICABLE→相邻事项 Owner；不明 POLICY_UNCONFIRMED→归口人工",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "报送截止与渠道",
          "requirement": "【研究级核验标准；非校方正式规则】R003 报送截止与渠道；T2 | 真：确已进入提交/接收阶段；假：仅拟稿且尚无实际送达；未知：受理阶段/延长期限不明 | 002/004/005/006 → F005,F009–010,F040,F051 → M001,M017 | 用公告时区与受理机关记录比较；E0+E1，不能用文件 mtime、邮件已发送代签收；2025/2026 既往窗口不开放新报，延期例外须授权 | 已核及时送达 PASS_FACT→归口受理；逾期事实或延期争议 NEEDS_HUMAN_DECISION→受理机关；无回执权威源 SOURCE_UNAVAILABLE；仅拟稿 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "目录及学院限额",
          "requirement": "【研究级核验标准；非校方正式规则】R004 目录及学院限额；T1/T2 | 真：A 院额或 B 课程目录实际适用；假：C/D 无该项要求；未知：附件名可见但正文未读取/新批次 | 002/004 → F002,F007,F019–023 → M001,M002,M005 | E0 名额/目录同批同版，E1 课程 ID/单位；附件读取失败不猜名额；“优先支持”非排斥条款 | 匹配 PASS_FACT→学院；确证超额/例外 NEEDS_HUMAN_DECISION→学院/归口；官方附件失联 SOURCE_UNAVAILABLE；政策未明 POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "负责人同一身份",
          "requirement": "【研究级核验标准；非校方正式规则】R005 负责人同一身份；T1/T2 | 真：申请明确负责人；假：尚未建人选的预咨询；未知：代理、改名或同名者未核 | 002/004/005/006 → F011–014,F053 → M003,M004,M006,M016 | 学校人员 ID、组织归属有效日对照两类 E1/E2 记录；同名不合并、身份证只给有权者；受信授权代理单独核 | 同 ID PASS_FACT→学院；冲突 CONFLICT→人事/学院；人员源失联 SOURCE_UNAVAILABLE；代理权不明 NEEDS_HUMAN_DECISION",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "在职/聘任身份",
          "requirement": "【研究级核验标准；非校方正式规则】R006 在职/聘任身份；T1 | 真：A/B/C 申报教师身份受当批条件约束；假：另有当批公告明确不需要该身份；未知：其他类型或合同/调动效力不明 | 002/004/005 → F012,F014–015 → M001,M006 | E0 批次资格与 E1 人事任用的申报截止生效日核对；聘用变更、特殊身份须主管解释 | 已核符合 PASS_FACT→学院；事实不符/例外 NEEDS_HUMAN_DECISION→人事/归口；人事源失联 SOURCE_UNAVAILABLE；假 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "职称/学位特定条件",
          "requirement": "【研究级核验标准；非校方正式规则】R007 职称/学位特定条件；T1 | 真：B 中级职称或 C 公告所列校内资质路径；假：A 不据此套 B 门槛；未知：职称等效和政策版次未定 | 004/005 → F015–016 → M001,M003,M006 | 对照任职/资格授予生效日；E0+E1；B 的中级资格仅 2026 第三批，其他分支不泛化 | 符合 PASS_FACT→学院；同一职称两值 CONFLICT→人事；已核不达标或等效争议 NEEDS_HUMAN_DECISION→归口；假 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "任课史与历史限项",
          "requirement": "【研究级核验标准；非校方正式规则】R008 任课史与历史限项；T1 | 真：C 要相关教学经历，或 D 2023 有限项/事故规则；假：A/B 不凭 2023 门槛审核；未知：其他年度重用 D 条款 | 005/006 → F017–018,F046 → M001,M007,M025 | 课程任课年、项目期、事故正式状态与各自批次 E0/E1 对照；处罚性记录需权利限制/人工复核，缺查不是“无事故” | 可核事实 PASS_FACT→归口；涉处罚/限项裁量 NEEDS_HUMAN_DECISION→研究生院；历史库失联 SOURCE_UNAVAILABLE；跨年 POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "课程 ID 与培养方案版",
          "requirement": "【研究级核验标准；非校方正式规则】R009 课程 ID 与培养方案版；T1/T2 | 真：A/C 须绑定课程及专业；假：确不要求课程入目录的建设子类；未知：E/F 规则未见 | 002/005/004 → F019–021,F023 → M001,M003,M005 | E0 要求与 E1 校方课程表同 ID、同体系、同学年，按当期方案版本；A“原则上”未入目录不得硬否 | 完整对应 PASS_FACT→学院；两份权威课程冲突 CONFLICT→课程归口；A 例外 NEEDS_HUMAN_DECISION→教务处；源失联 SOURCE_UNAVAILABLE",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "学分、学时与课程性质",
          "requirement": "【研究级核验标准；非校方正式规则】R010 学分、学时与课程性质；T1 | 真：公告/申报方案明确审此数值；假：本批不要求或仅拟建授课方案待专家；未知：单位、版本不明 | 002/005/004 → F021–023,F035 → M001,M005,M015 | 仅同课程同版本、同单位比对；E0+E1/E2；C 课程形态例外由研究生院认定，非课程建设跨批通用阈值 | 数值一致 PASS_FACT→学院；不一致 CONFLICT→课程归口；例外/数值实质 NEEDS_HUMAN_DECISION→专家；假 NOT_APPLICABLE",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "既有基础与未来交付区分",
          "requirement": "【研究级核验标准；非校方正式规则】R011 既有基础与未来交付区分；T1/T6 | 真：通知要求写明建设基础；假：T1 仅后续验收材料；未知：当期基础附件必交性不明 | 002/003/004/005/015 → F024,F028–030,F049 → M003,M008,M009,M022 | E0 分阶段、E2 自述基础与 E1 教学档案对照；历史资源不等于计划交付，SRC-003 验收 90% 不可回用于 T1 | 现有基础可溯 PASS_FACT→学院；应写而未写 NEEDS_MATERIAL→教师；优劣 NEEDS_HUMAN_DECISION→专家；T1 对 M022 NOT_APPLICABLE",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "平台数据归属/统计口径",
          "requirement": "【研究级核验标准；非校方正式规则】R012 平台数据归属/统计口径；T1 条件/T6 | 真：自报真实已上线资源或业务需验证统计；假：尚未上线且当前只写建设计划；未知：平台来源、统计对象/口径不清 | 002/003/009 → F025–027 → M009,M010,M022 | 课程 ID+分母+截止日+签发者同版比较；E1 授权导出优于 E3 截图；SRC-009 只证明平台存在；T1 不应用 T6 验收值 | 同口径 PASS_FACT→平台归口；不同口径/原值 CONFLICT→平台；无接口/报表 SOURCE_UNAVAILABLE→平台人工核；未上线 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "资源/知识产权来源",
          "requirement": "【研究级核验标准；非校方正式规则】R013 资源/知识产权来源；T1 | 真：A/B 或材料确有第三方素材；假：无传播素材且无本批要求；未知：素材归属/许可期限不明 | 002/004 → F028,F036 → M003,M009,M011 | 逐资源 URL/权利人/授权范围/期限核 E2/E1；个人承诺仅能证明已承诺，不能确权；侵权风险为人工事实调查 | 签署/来源清楚 PASS_FACT（仅声明事实）→学院；应有清单却缺 NEEDS_MATERIAL→教师；侵权疑点 NEEDS_HUMAN_DECISION→法务/归口；未知 POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "建设目标与里程碑",
          "requirement": "【研究级核验标准；非校方正式规则】R014 建设目标与里程碑；T1 | 真：A/B/C 有申报建设计划；假：仅预咨询未正式拟报；未知：E/F 表单栏目不明 | 002/004/005 → F029–030,F037 → M003,M008 | 对申请同版目标、周期、交付物是否已描述做结构/文本一致性核，E0+E2；质量/可行性只供专家评审 | 已写且一致 PASS_FACT（只核存在）→学院；适用缺页 NEEDS_MATERIAL→教师；质量裁量 NEEDS_HUMAN_DECISION→专家；E/F POLICY_UNCONFIRMED",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "团队身份、分工及限项",
          "requirement": "【研究级核验标准；非校方正式规则】R015 团队身份、分工及限项；T1/T2 | 真：有多人团队、B/C 要求或 D 限项；假：合法单人项目无需成员同意材料；未知：项目人数上限或多头申报限制无原文 | 002/004/005/006 → F018,F031–032,F046 → M003,M012,M025 | 成员可信 ID、同意版本、重复项目权威状态比对；E0+E1/E2；成员签名图片不自动可信，D 限项不跨年 | 清单同版 PASS_FACT→学院；人员冲突 CONFLICT→成员/人事；限项裁量 NEEDS_HUMAN_DECISION→归口；未知 POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "企业双负责人资格",
          "requirement": "【研究级核验标准；非校方正式规则】R016 企业双负责人资格；T1（仅 C） | 真：C 校企合作；假：A/B/D/E；未知：企业证书签发/替代资格不明 | 005 → F031,F033,F053 → M001,M012,M013 | 企业专家高级职称或核心部门负责等公告认可路径，结合单位真实性、生效期按 E0+E2 核；不能仅凭无副高即否决 | 路径证据可核 PASS_FACT→学院；材料缺 NEEDS_MATERIAL→企业/教师；资格真伪/例外 NEEDS_HUMAN_DECISION→研究生院；假 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "校企合作基础与协议",
          "requirement": "【研究级核验标准；非校方正式规则】R017 校企合作基础与协议；T1（仅 C） | 真：C 要校企合作基础；假：无企业共建；未知：合同、基地、成果是否能互相替代 | 005 → F034,F046 → M013,M014,M025 | 合作双方组织名、盖章/签发、存续期及课程关联核 E1/E2；协议过期与当前基地证明分别保留，不能暗定三证全须 | 可核同一合作事实 PASS_FACT→学院；缺必要证明 NEEDS_MATERIAL→校企双方；替代/实质 NEEDS_HUMAN_DECISION→研究生院；冲突 CONFLICT",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "校企共建大纲",
          "requirement": "【研究级核验标准；非校方正式规则】R018 校企共建大纲；T1（仅 C） | 真：C 正式申报并须大纲；假：非 C 或仅专家尚未组织；未知：大纲校企双签格式未核 | 005 → F022,F035,F037 → M003,M015 | E0 明示配套教学大纲；E2 对课程 ID、双方教师、学时、内容、版号；课堂效果优劣由专家评 | 原件字段吻合 PASS_FACT→学院；缺/不可读 NEEDS_MATERIAL/UNREADABLE→负责人；共拟效力 NEEDS_HUMAN_DECISION→研究生院；假 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "当批申报表与签署版",
          "requirement": "【研究级核验标准；非校方正式规则】R019 当批申报表与签署版；T1/T2 | 真：A/B/C/D 已有官方表单标题；假：仅 F 新批待公告，不可催交；未知：E 原表、附件字段无法取得 | 002/004/005/006/008 → F008,F037,F052 → M001,M003,M027 | 核学校表单版本与申请哈希、应有签署位置；E0+E2；SRC 附件 412 时只核可证实栏目，D 独需历史 M027 | A/B/C/D 表单存在且同版 PASS_FACT→学院；确实缺 NEEDS_MATERIAL→教师；无法读 UNREADABLE；E/F POLICY_UNCONFIRMED",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "学院初审、推荐与排序",
          "requirement": "【研究级核验标准；非校方正式规则】R020 学院初审、推荐与排序；T2 | 真：学院实际形成审核/推荐阶段；假：T1 未到或 F 批次未启用；未知：排序/名额要求未知 | 002/004/005/006/008 → F014,F038–039,F053 → M002,M003,M004,M016 | 核学院 orgId、审核岗位权限、推荐对象指向最新申报哈希和同批榜单；E0+E1/E2；A 排序，B/C/D 不强行排序 | 同权同版 PASS_FACT→归口；旧版推荐 CONFLICT→学院；签发权限不明 NEEDS_HUMAN_DECISION→学院负责人；T1 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "部门收件/形式审查定位",
          "requirement": "【研究级核验标准；非校方正式规则】R021 部门收件/形式审查定位；T2/T3 | 真：已报归口；假：未正式提交；未知：校方签收、受理渠道未知 | 002/004/005/006 → F010,F040,F051–052 → M001,M017 | 比对签收机关、申请版、实际送达时点；E0+E1；邮箱发送成功不能当受理，纸件可用有权签收 | 签收 PASS_FACT→归口；受理机关不达 SOURCE_UNAVAILABLE→收件人；收件方版本不一 CONFLICT→学院/归口；未报 NOT_APPLICABLE",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "专家评审记录效力",
          "requirement": "【研究级核验标准；非校方正式规则】R022 专家评审记录效力；T3 | 真：已有专家评审；假：T1/T2 尚未评审；未知：专家授权/意见主体无法查 | 002/004/005/006/007 → F041,F053 → M003,M018 | 比委派身份、会议/系统意见、评审所见申请哈希、有效日；E1/E2；模型不能模仿专家意见，评审通过不等于立项 | 真正有权同版评审事实 PASS_FACT→归口；旧版/身份冲突 CONFLICT→评审组织；质量/有效性 NEEDS_HUMAN_DECISION→专家/归口；假 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "公示、期限及异议存在性",
          "requirement": "【研究级核验标准；非校方正式规则】R023 公示、期限及异议存在性；T4 | 真：某批有实际公示事件；假：未到 T4 或无需公示；未知：B 是否发生独立公示、期限未核 | 004/005/007/008/016 → F042–043 → M019,M020 | E1 官方公示页时间戳、名单版本；E 2025-06-04～10 仅当年异议窗；B 的“公布评审结果/会议审定”不自动等于事前公示及异议期 | 公示可核 PASS_FACT→归口；有异议 NEEDS_HUMAN_DECISION→受理机关；官网失联 SOURCE_UNAVAILABLE；无需公示 NOT_APPLICABLE；政策未知 POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "有权正式决定的真实性",
          "requirement": "【研究级核验标准；非校方正式规则】R024 有权正式决定的真实性；T5 | 真：核验已经产生的最终决定；假：T1–T4 只在预审/评议；未知：B/E 机关授权及完整名单无法核 | 002/004/005/007/008/016 → F044–045,F053 → M018,M019,M021 | 按批次核真实 OA/发文/经授权部门会议审定及正式公告，对机关授权、课程 ID、日期、版本、会议/文号（若有）。C 明示发文；B 已见第12次会议审定并公布线索，但官方摘要不足逐门确权；公示或 OCR 章不能替代，也不强要不存在的第二批文 | 权威决定存在且对象匹配 PASS_FACT→实际决定归口；授权不明 NEEDS_HUMAN_DECISION→主管机关；原件失联 SOURCE_UNAVAILABLE；T1–T4 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "前项目与邻接业务结论复用",
          "requirement": "【研究级核验标准；非校方正式规则】R025 前项目与邻接业务结论复用；T1/T6 条件 | 真：D 限项、C 合作基础或申请引用旧决定；假：无真实前置业务要求；未知：G50/R02 映射或旧文书效力未核 | 006/005/011/013/014 → F018,F024,F046 → M005,M007,M025 | 旧决定类型+ID+签发组织+有效期+业务对象一致方只读消费 E1；SRC-013/014 不能假装已检索；T01 开课和 T02 职称决定不推出新立项 | 引用真实 PASS_FACT→学院；旧决定失联 SOURCE_UNAVAILABLE→原 Owner；跨业务效力 POLICY_UNCONFIRMED→归口；假 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "经费口径与申报预算",
          "requirement": "【研究级核验标准；非校方正式规则】R026 经费口径与申报预算；T1 条件/T5 | 真：当批确要求预算、或要核公告资助标准；假：当批表单未规定个人填独立预算；未知：经费表附件未取 | 004/005 → F029–030,F050 → M001,M003,M026 | E0 公告资助标准与 E2 申请预算同币种、同阶段核；配套/拨付须财务 E1 另行证明；不得据额度推“已拨付” | 口径可核 PASS_FACT→归口/财务；应填未填 NEEDS_MATERIAL→负责人；是否拨付/超额审批 NEEDS_HUMAN_DECISION→财务；未知 POLICY_UNCONFIRMED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "材料替换与失效传播",
          "requirement": "【研究级核验标准；非校方正式规则】R027 材料替换与失效传播；G/T1–T5 | 真：M003/M008/M011/M014/M015 等存在新版本；假：无版本变化；未知：未验证新文件归属 | 002/004/005 → F008,F037,F047,F052 → M003,M008,M011,M014,M015,M016,M018,M023 | 比原哈希→新哈希、目标 F 变化集、旧学院/专家意见所见版本；系统 E1 审计，校方重签 E1；只定向重审受影响 R | 已建失效链 PASS_FACT（事件记录）→原阶段 Owner；不一致 CONFLICT→学院/归口；未授权变更 NEEDS_HUMAN_DECISION→有权经办；假 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "补正/撤回/复核请求的权限",
          "requirement": "【研究级核验标准；非校方正式规则】R028 补正/撤回/复核请求的权限；G/H/I | 真：已收到针对当前申请或公示的请求；假：无请求；未知：阶段许可、代理/异议主体资格未核 | 002/004/005/007/008 → F008–011,F043,F047,F052–053 → M019,M020,M023 | 身份/代理授权与案件版本及渠道、期限同批核；E1 受理机关权限，E2 请求书；SRC-007 只证明当年书面异议可提，不得扩展全部批次 | 身份/请求事实 PASS_FACT→受理机关；权限时限不明 POLICY_UNCONFIRMED→归口；非法冒名风险 NEEDS_HUMAN_DECISION→校方权限负责人；无请求 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "补正/撤回/异议处理结论",
          "requirement": "【研究级核验标准；非校方正式规则】R029 补正/撤回/异议处理结论；G/H/I/T5 | 真：请求已有有权处理的 M024；假：根本未发生该种请求；未知：已提请求尚待处理或签发主体/授权不明 | 007/008/005 → F048,F053 → M020,M023,M024 | E1 处理记录核事件 ID、原申请/公示/正式决定版、签发与时间；不得把请求或 AI 建议变为生效撤回/复核；处理文书只能在办理后产生 | 处理事实可核 PASS_FACT→归口；尚无决定 NEEDS_HUMAN_DECISION→有权机关办理，不是缺申报材料；签发来源失联 SOURCE_UNAVAILABLE；无请求 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "后续验收与立项隔离",
          "requirement": "【研究级核验标准；非校方正式规则】R030 后续验收与立项隔离；T6 | 真：已进入立项后建设/验收关联；假：T1–T5 未产生后续材料；未知：是否确有生效立项决定 | 003/005/006/015 → F026–027,F044–046,F049 → M021,M022,M025 | E1 正式立项与后续验收各有独立决定 ID/生效日；SRC-003 的 90% 只限该验收；不能用旧验收批准反推本轮立项 | 双链可核 PASS_FACT（仅“已关联”）→后续 Owner；验收争议 NEEDS_HUMAN_DECISION→归口；不能取权威源 SOURCE_UNAVAILABLE；未到 T6 NOT_APPLICABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "校企课程学时规格与企业讲授比例",
          "requirement": "【研究级核验标准；非校方正式规则】R031 校企课程学时规格与企业讲授比例；T1（仅 C 2026） | 真：校企课程大纲有总学时和拟定企业授课量；假：A/B/D/E 或仅预咨询；未知：是否属于 C/有否批准例外 | 005 → F019,F022,F035,F054 → M001,M003,M015 | 同课程同大纲版核 totalHours ∈ {16,32}，16 学时对应 1 学分、32 学时对应 2 学分，且 enterpriseHours/totalHours ≥ 1/4；量纲不同不得比较；32 学时企业授课可增加到 1/3 属鼓励而非一律强制。只核申报拟定学时，不冒充实际授课 | 同版符合 PASS_FACT→学院；跨件冲突 CONFLICT→团队/学院；确认不足或特殊规格 NEEDS_HUMAN_DECISION→研究生院，不能自动驳回；大纲缺/不可读 NEEDS_MATERIAL/UNREADABLE→负责人；非 C NOT_APPLICABLE",
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
  "templateId": "T05-T03",
  "name": "课程建设、精品课程与在线课程建设立项审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T05-T03.md",
  "sourceDocumentSha256": "361f6eab2b0c859eb7d0743ad20653cd4a2a72ff26d42557b0837cc81889c867",
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
      "status": "CURRENTITY-UNKNOWN"
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
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-015",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-016",
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-017",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-018",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-019",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-020",
      "status": "CROSS-SCHOOL-REFERENCE"
    }
  ],
  "criteria": [
    {
      "sectionId": "evidence-review",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
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
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-009",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-009",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-002",
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
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-002",
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
      "criterionId": "R026",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R027",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R028",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R029",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R030",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-005",
        "SRC-006",
        "SRC-008",
        "SRC-013",
        "SRC-014",
        "SRC-015",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
