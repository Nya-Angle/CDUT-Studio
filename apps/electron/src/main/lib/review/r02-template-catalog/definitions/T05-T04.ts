/**
 * R02 T05-T04 本地研究模板定义。
 * 来源：docs/design/review-agent/business-templates/R02/T05-T04.md
 * SHA-256：7006503703c394c88352dac60e6ecd42e4a06ab40c3bc88af37c05e8de9b652a
 * 非校方正式模板；未确认政策只可形成建议并进入人工复核。
 */
import type { TemplateVersion } from '@profer/shared'

export const template: TemplateVersion = {
  "templateId": "T05-T04",
  "version": 1,
  "schemaVersion": 2,
  "name": "教材编写、出版与教材建设项目申报审核",
  "description": "教材编写、出版与教材建设项目申报审核。本地研究模板 · 非校方正式模板。仅支持事实提取、证据对应和审阅建议；批次政策、适用对象、签批权限未确认时必须待确认并由有权人员人工处理。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非成都理工大学校方正式模板；依据 T05-T04 研究原件的字段、材料槽与规则清单生成，政策证据状态为 PARTIAL。",
  "objectType": "project",
  "displayName": {
    "template": "教材编写、出版与教材建设项目申报审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "string：案卷/教材候选业务键；O-CASE",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F001 类型提示：string：案卷/教材候选业务键；O-CASE。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F002",
      "label": "enum：决定事件类型（拟出版/建设立项/专项推荐）；O-CASE",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F002 类型提示：enum：决定事件类型（拟出版/建设立项/专项推荐）；O-CASE。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F003",
      "label": "string：批次/通知编号及版本；O-BATCH",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原研究字段 F003 类型提示：string：批次/通知编号及版本；O-BATCH。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F004",
      "label": "enum：本科/研究生/跨学段适用；O-BATCH",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F004 类型提示：enum：本科/研究生/跨学段适用；O-BATCH。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F005",
      "label": "enum+date：办理阶段/是否仍在受理期；O-BATCH",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F005 类型提示：enum+date：办理阶段/是否仍在受理期；O-BATCH。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F006",
      "label": "trusted-id：当前操作者真实身份；O-TEAM",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F006 类型提示：trusted-id：当前操作者真实身份；O-TEAM。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F007",
      "label": "trusted-id：主编/项目负责人身份；O-TEAM",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F007 类型提示：trusted-id：主编/项目负责人身份；O-TEAM。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F008",
      "label": "trusted-id+authorization：委托代办人和权限；O-TEAM",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F008 类型提示：trusted-id+authorization：委托代办人和权限；O-TEAM。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F009",
      "label": "string+org-id：申报学院/归口部门；O-BATCH",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F009 类型提示：string+org-id：申报学院/归口部门；O-BATCH。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F010",
      "label": "string：教材题名/项目教材名称；O-BOOK",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F010 类型提示：string：教材题名/项目教材名称；O-BOOK。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F011",
      "label": "enum：纸本、数字、融合及其说明；O-BOOK",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F011 类型提示：enum：纸本、数字、融合及其说明；O-BOOK。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F012",
      "label": "hash+version：完整书稿/清样内容指纹；O-BOOK",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F012 类型提示：hash+version：完整书稿/清样内容指纹；O-BOOK。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F013",
      "label": "enum：已完稿状态及证据；O-BOOK",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F013 类型提示：enum：已完稿状态及证据；O-BOOK。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F014",
      "label": "year：预计签约出版年度；O-PUBLISH",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F014 类型提示：year：预计签约出版年度；O-PUBLISH。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F015",
      "label": "org-id：声称著作权归属单位；O-PUBLISH",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F015 类型提示：org-id：声称著作权归属单位；O-PUBLISH。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F016",
      "label": "array：主编/副主编/参编人员清单与职务；O-TEAM",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F016 类型提示：array：主编/副主编/参编人员清单与职务；O-TEAM。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F017",
      "label": "array：团队单位/角色/贡献声明；O-TEAM",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F017 类型提示：array：团队单位/角色/贡献声明；O-TEAM。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F018",
      "label": "array：拟适用课程/教学用途；O-BOOK",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F018 类型提示：array：拟适用课程/教学用途；O-BOOK。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F019",
      "label": "hash+version：适用课程大纲及课程标识；O-BOOK",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F019 类型提示：hash+version：适用课程大纲及课程标识；O-BOOK。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F020",
      "label": "uri+manifest：数字教材链接和资源清单；O-BOOK",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F020 类型提示：uri+manifest：数字教材链接和资源清单；O-BOOK。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F021",
      "label": "string+date：拟出版审核表申请版本；O-CASE",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F021 类型提示：string+date：拟出版审核表申请版本；O-CASE。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F022",
      "label": "decision-ref：编写人员资格审核结论；O-COLLEGE",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F022 类型提示：decision-ref：编写人员资格审核结论；O-COLLEGE。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F023",
      "label": "decision-ref：政治方向/稿件审查意见；O-COLLEGE",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F023 类型提示：decision-ref：政治方向/稿件审查意见；O-COLLEGE。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F024",
      "label": "list+count：专家审读身份/校外属性；O-COLLEGE",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F024 类型提示：list+count：专家审读身份/校外属性；O-COLLEGE。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F025",
      "label": "decision-ref：学术分委会/专家意见；O-COLLEGE",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F025 类型提示：decision-ref：学术分委会/专家意见；O-COLLEGE。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F026",
      "label": "uri+interval+state：学院教材/人员公示；O-COLLEGE",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F026 类型提示：uri+interval+state：学院教材/人员公示；O-COLLEGE。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F027",
      "label": "signed-ref：学院审核表签章及汇总报送；O-COLLEGE",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F027 类型提示：signed-ref：学院审核表签章及汇总报送；O-COLLEGE。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F028",
      "label": "decision-ref：学校专家终审意见；O-SCHOOL",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F028 类型提示：decision-ref：学校专家终审意见；O-SCHOOL。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F029",
      "label": "uri+interval+state：全校公示及异议；O-SCHOOL",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F029 类型提示：uri+interval+state：全校公示及异议；O-SCHOOL。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F030",
      "label": "signed-ref：最终有效教材拟出版决定；O-SCHOOL",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F030 类型提示：signed-ref：最终有效教材拟出版决定；O-SCHOOL。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F031",
      "label": "string+version：教材建设项目申请书与申报事项；O-PROJECT",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F031 类型提示：string+version：教材建设项目申请书与申报事项；O-PROJECT。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F032",
      "label": "object：项目团队、目标/周期/预算主张；O-PROJECT",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F032 类型提示：object：项目团队、目标/周期/预算主张；O-PROJECT。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F033",
      "label": "signed-ref：项目学院初审/推荐；O-PROJECT",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F033 类型提示：signed-ref：项目学院初审/推荐；O-PROJECT。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F034",
      "label": "signed-ref：学校/上级立项或推荐结果；O-PROJECT",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F034 类型提示：signed-ref：学校/上级立项或推荐结果；O-PROJECT。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F035",
      "label": "ref+hash：前次申报/结果与改动说明；O-REMEDY",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F035 类型提示：ref+hash：前次申报/结果与改动说明；O-REMEDY。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F036",
      "label": "event-list：补件、撤回、异议、复核事件/受理权；O-REMEDY",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F036 类型提示：event-list：补件、撤回、异议、复核事件/受理权；O-REMEDY。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F037",
      "label": "signed-ref：正式出版合同；O-PUBLISH",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F037 类型提示：signed-ref：正式出版合同；O-PUBLISH。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F038",
      "label": "signed-ref：版权授权/共编权属结论；O-PUBLISH",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F038 类型提示：signed-ref：版权授权/共编权属结论；O-PUBLISH。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F039",
      "label": "string+date：ISBN/出版版本/实物信息；O-PUBLISH",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F039 类型提示：string+date：ISBN/出版版本/实物信息；O-PUBLISH。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    },
    {
      "key": "F040",
      "label": "provenance：每证据持有人、签发方、提取页、时间、哈希、适用性；O-CASE",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原研究字段 F040 类型提示：provenance：每证据持有人、签发方、提取页、时间、哈希、适用性；O-CASE。按本批原文及可信来源核验；未列明的枚举值、阈值和校方规则不得推定。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "批次对象、资格、期限、报送渠道",
      "purpose": "M001；批次对象、资格、期限、报送渠道；教务处/研究生院持有的当期拟出版通知；T0 当前必需的政策来源，非申请人上传；同机构有效公文归档；F002–F005/F009/F014；SRC-001/002；按文号、日期、适用学段存快照；失联 SU，旧批次 PC",
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
        "批次对象、资格、期限、报送渠道",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "主编教材申请主张",
      "purpose": "M002；主编教材申请主张；主编填写的拟出版教材审核表（T0 原稿，T1 签审版另验）；T0 当前必需（2026 拟出版）；校方可信表单系统产生的同等申请记录，接口未知；F007/F010–F018/F021；SRC-001/002/015；绑定申请人与书稿版本；缺 NM、表单读不清 UR、格位细项待核",
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
        "主编教材申请主张",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "证明有完整可审读的书稿/清样",
      "purpose": "M003；证明有完整可审读的书稿/清样；主编持有的电子稿、教材样书版本；T0 当前必需（2026 拟出版），T1/T2 复核版本；同一内容的学校受控存档，不以旧稿替代；F010/F012/F013/F016；SRC-001/002；hash、页数/链接、书名和作者清单；缺 NM、页缺 UR、版本冲突 CF",
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
        "证明有完整可审读的书稿/清样",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "适用课程及内容范围",
      "purpose": "M004；适用课程及内容范围；有权课程主管部门形成课程大纲；2026 批次 T1→T2 学院正式报送必需，T0 可提前引用但不得提前催件；有权课程系统同一版本大纲可替纸件，是否准许替纸件须由收件部门确认；F018/F019；SRC-001/002；课程标识、修订日期、学院；T1 送审缺 NM，来源失联 SU，错课程 CF",
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
        "适用课程及内容范围",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "审读/报送纸质样书",
      "purpose": "M005；审读/报送纸质样书；主编提供、学院统一递交 3 套纸质样书；T1→T2 当前必需：仅 2026 批次纸本；数字教材不适用；已由有权部门持有且可定位的同版本 3 套记录，若准许；F011/F012；SRC-001/002；与 M003 内容同版；缺 NM、数量/版本不符 CF，纸样损坏 UR",
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
        "审读/报送纸质样书",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "数字教材可读性和配套资源",
      "purpose": "M006；数字教材可读性和配套资源；主编的链接/资源包；T0 清样依赖该链接时必需；T1→T2 学院电子报送条件必需：数字/融合及通知所需配套资源；权威受控仓库的同版资源和访问授权；F011/F012/F020；SRC-001/002；资源清单/指纹/访问日/授权范围；断链 SU/UR，非数字资源 NA；不外发未经授权稿件",
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
        "数字教材可读性和配套资源",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "主编、编写团队及代办授权",
      "purpose": "M007；主编、编写团队及代办授权；主编/学校人事记录、申报表内人员名单、必要时委托文书；T0 当前必需的身份事实，单独文件是否必需未知；代办时条件必需；可信身份和人事/组织记录优先，不能仅自填；F006–F009/F016/F017；SRC-001/002/007/011；按人员身份 ID 和组织关系版本；不匹配 CF、授权未证 HU",
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
        "主编、编写团队及代办授权",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "著作权归属及合作贡献声明",
      "purpose": "M008；著作权归属及合作贡献声明；主编/共编主体持有的声明或协议；T0 条件必需：权属声称冲突/联合编写需核；独立纸件是否要求未知；有权版权登记/权属协议或 G06 正式结论 M030；F015/F017/F038；SRC-001/007/011/013；适用教材版本与各权利人签名；缺 PC/HU、冲突 CF",
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
        "著作权归属及合作贡献声明",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "编写人员资格及政治审查",
      "purpose": "M009；编写人员资格及政治审查；学院党委/党总支形成的正式审核记录；T1 当前必需的学院审核结果，T0 未来才有；校内有权党组织正式签章记录；F022/F023；SRC-001/002/007；人员名单+稿件版+签署时间；无原件 NM，内容敏感 HU，扫描模糊 UR",
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
        "编写人员资格及政治审查",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "专家个人学术审读",
      "purpose": "M010；专家个人学术审读；受邀专家正式签章评审表（2 位，至少 1 校外为 2026 拟出版批次）；T1 当前必需的学院专家结果，T0 未来才有；有权专家签署的可信电子评审记录；F024/F025；SRC-001/002/015；专家身份、回避、书稿版本一一对应；缺 NM，校外身份不明 HU",
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
        "专家个人学术审读",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "学院学术分委员会学术把关",
      "purpose": "M011；学院学术分委员会学术把关；该委员会正式意见/会议记录；T1 当前必需的学院意见；是否独立成纸件待核；审核表内可核的学院学术意见可替；F025；SRC-001/002/015；会议/签章与稿件版；缺独立纸件先 PC，不重复要件",
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
        "学院学术分委员会学术把关",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "教材学院初审公示及汇总",
      "purpose": "M012；教材学院初审公示及汇总；学院正式公示和附件 3；T1 结束时当前必需，T0 不需；学院权威公示页/正式存档优先于截图；F026/F027；SRC-001/002/015；公示区间、名单、批次、异议情况；失联 SU，异议未知 HU",
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
        "教材学院初审公示及汇总",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "编写人员资格公示",
      "purpose": "M013；编写人员资格公示；学院党组织正式公示和附件 4；T1 结束时当前必需，T0 不需；党委有权公示记录；F016/F022/F026；SRC-001/002/007/015；人员清单与 M007 对应；变更后旧公示不覆盖，差异 CF",
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
        "编写人员资格公示",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "学院签章审核表、专家表及送审汇总报送",
      "purpose": "M014；学院签章审核表、专家表及送审汇总报送；学院经办归档；T1→T2 当前必需，2026 学院正式报送；可核验签章的校内流程回执/电子文件，接口未知；F023/F027；SRC-001/002；学院签章/时间/申报版本；缺 NM，伪造疑虑 HU",
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
        "学院签章审核表、专家表及送审汇总报送",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "学校终审专家意见",
      "purpose": "M015；学校终审专家意见；学校组织评审形成的有权记录；T2 发生审查后必需，T0/T1 不需；学校正式审评系统记录；F028；SRC-001/002；绑定 M003 及 M010 版本；无意见 NM，旧稿意见 CF",
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
        "学校终审专家意见",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "全校拟出版公示及异议记录",
      "purpose": "M016；全校拟出版公示及异议记录；学校/研究生院发布原文；T2 公示时必需，T0/T1 不需；校方正式公示页、可认证存档；F029；SRC-001/002/003；公示开始结束、异议状态；断链 SU，截图不核真 HU",
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
        "全校拟出版公示及异议记录",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "公示完成后的有效学校决定",
      "purpose": "M017；公示完成后的有效学校决定；有权机关正式签发文件或可靠审批记录；T2 结束后才产生，T0 不需；唯一正式权威决议/公文，不用 AI 预审替代；F030；SRC-001/002/011；文号、签章授权、对象/版次；未产生 NEEDS_HUMAN_DECISION",
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
        "公示完成后的有效学校决定",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "项目当期范围、指标、期限与立项权限",
      "purpose": "M018；项目当期范围、指标、期限与立项权限；项目归口/上级部门正式指南；T0 当前必需的政策来源，非申请人上传；有权发布机关最新有效文件；F002–F005/F009/F031/F032；SRC-005/009/011；2023 实例仅历史；2026 找不到则 PC/SU，不开放自动判定",
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
        "项目当期范围、指标、期限与立项权限",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "教材建设项目申请",
      "purpose": "M019；教材建设项目申请；项目负责人正式申报书；T0 条件必需：仅有开放指南时；校方可信项目系统申请数据（若存在）；F007/F010/F031/F032；SRC-005/016；项目类型、负责人、版本；表格未读，细字段 PC、缺案 NM",
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
        "教材建设项目申请",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "项目编写团队、建设方案、阶段目标、预算的证据",
      "purpose": "M020；项目编写团队、建设方案、阶段目标、预算的证据；负责人提供；T0 按项目指南条件必需，不可对所有申报强制；M019 内已包含且可核的内容可代，避免重复上传；F017/F032；SRC-005/016；以方案/表格版次绑定，阈值与金额待指南；缺 PC/NM",
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
        "项目编写团队、建设方案、阶段目标、预算的证据",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "项目学院初审、推荐意见",
      "purpose": "M021；项目学院初审、推荐意见；学院有权签章文书；T1 项目审核后才产生；正式校园项目流程记录；F033；SRC-005；学院签发与 M019 版次；缺 NM、角色不可信 HU",
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
        "项目学院初审、推荐意见",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "项目学校/上级立项或推荐结果",
      "purpose": "M022；项目学校/上级立项或推荐结果；委员会/有权机构决议；T2/T3 才产生；原发文机关的正式决定，学校推荐不能替代上级立项；F034；SRC-005/009；分别登记校荐/上级终审；未产生不在 T0 报缺",
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
        "项目学校/上级立项或推荐结果",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "证明上一批结果与被要求修改事项",
      "purpose": "M023；证明上一批结果与被要求修改事项；先前有权审查机关持有的意见；TX 再申报当前条件必需，若批次允许；原案权威结果引用，不重复提交全文；F035；SRC-004/002；旧案 ID、决定日期、旧稿 hash；查不到 SU/PC",
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
        "证明上一批结果与被要求修改事项",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "说明稿件本次变更",
      "purpose": "M024；说明稿件本次变更；主编修改情况说明及差异证据；TX 再申报条件必需，依当批文件；正式版本比对说明可辅助，但不替代主编说明/专家复审；F035；SRC-004/002；新旧稿各自 hash；说明不可读 UR，版本不一致 CF",
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
        "说明稿件本次变更",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "当前阶段补件通知和提交回执",
      "purpose": "M025；当前阶段补件通知和提交回执；有权办理人/申请人共同形成；TX 补件时产生；可追溯校内事件账记录；F036/F040；SRC-011；事由、截止、责任人待现行规则；缺 PC/HU",
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
        "当前阶段补件通知和提交回执",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "撤回请求与受理处理",
      "purpose": "M026；撤回请求与受理处理；主编/正式代理提出、有权机构作出；TX 撤回时产生；经认证校内业务事件和有权答复；F036；SRC-011；请求不等于撤回生效；无规则 PC/HU",
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
        "撤回请求与受理处理",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "公示异议/复核申请事实及证据",
      "purpose": "M027；公示异议/复核申请事实及证据；异议人或主编提出；TX 异议时产生；2026 研究生公示有反映渠道；公示规定的正式受理渠道收件记录；F029/F036；SRC-003/011；涉个人信息，限权限；未证正式复核程序 PC",
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
        "公示异议/复核申请事实及证据",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "异议处理/复核决定",
      "purpose": "M028；异议处理/复核决定；有权机关签发结果；TX 有权处理后才产生；正式答复或复核文件；F036；SRC-003/011；与 M027 事件关联；缺结果不得宣称结案",
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
        "异议处理/复核决定",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "出版合同/签约证明",
      "purpose": "M029；出版合同/签约证明；出版社、权利人持有的正式合同；T3 后续才产生（2026 预审拟签约）；签署双方公证/校方合同归档可核；F037；SRC-001/002/011；不是 T0 必交；角色/合同主体冲突 CF/HU",
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
        "出版合同/签约证明",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M030",
      "name": "版权许可、共同创作协议或 G06 权威权属结论",
      "purpose": "M030；版权许可、共同创作协议或 G06 权威权属结论；有权版权/校方机构持有；TX 权属争议及出版签约环节；正式有权决定优先于单方声明；F015/F017/F038；SRC-007/011/013；权属不明 HU，冲突 CF；不能要求贡献比率",
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
        "版权许可、共同创作协议或 G06 权威权属结论",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M031",
      "name": "ISBN、版权页、出版实物/电子正式发行数据",
      "purpose": "M031；ISBN、版权页、出版实物/电子正式发行数据；出版方/权威书目持有；T3 正式出版后才产生；出版机构书目或国家书目信息（核验后）；F039；SRC-010；不能用于拟出版 T0 不合格理由",
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
        "ISBN、版权页、出版实物/电子正式发行数据",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M032",
      "name": "项目过程/结题验收材料",
      "purpose": "M032；项目过程/结题验收材料；项目负责人、学院、研究生院持有；T3 项目实施/验收才产生；有权主管部门项目管理系统/原始报告；F032/F034；SRC-005/008；按项目号、立项版本和成果归属；缺件仅在该节点处理",
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
        "项目过程/结题验收材料",
        "核对材料对应的对象、适用阶段、来源与版本",
        "将缺失、不可读、权威来源不可访问、政策未确认和事实冲突分开记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M033",
      "name": "身份授权、取证页位、上传/签发/替换/复核事件账",
      "purpose": "M033；身份授权、取证页位、上传/签发/替换/复核事件账；业务系统持有；各阶段内部当前必需；非申请人上传；主系统可信事件/签章校验及来源哈希；F001/F005/F006/F008/F036/F040；SRC-013；只保存可信事件并标原件来源；记录中断 SU，旧结论不冒充当前",
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
        "身份授权、取证页位、上传/签发/替换/复核事件账",
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
          "title": "批次、学段、决定事件与窗口",
          "requirement": "【研究级核验标准；非校方正式规则】R001 T0–T3 批次、学段、决定事件与窗口 | T=可定位该年度/学段/事项的正式通知；F=仅在本案已明确排除该类申报时；U=只有历史批次或类型不明 | SRC-001/002/005/009；F002–F005/F009；M001/M018 | 对发文机关、文号、适用对象、收件机关、截止和阶段；A 级批次优先，不能以 2023 项目或 2026 第一批推定当前开放。证据失联 SOURCE_UNAVAILABLE，现行适用不明 POLICY_UNCONFIRMED；不设超期自动驳回 | PASS_FACT 仅证明“所选批次事实匹配”，接学院/归口经办",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "每次写入 操作者与代理权限",
          "requirement": "【研究级核验标准；非校方正式规则】R002 每次写入 操作者与代理权限 | T=有人提交或执行写事件；F=纯只读无写事件；U=SSO/受托关系不可核 | SRC-001/002/011；F001/F006–F009/F040；M002/M007/M033 | 后台认证身份、权威组织关系与主编/负责人及可验证授权逐一比；D 级 Renderer 自填无权。账号失联 SOURCE_UNAVAILABLE，真实身份不一致 CONFLICT，代理权限争议 NEEDS_HUMAN_DECISION | PASS_FACT 仅证明授权校验通过；接身份/授权管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "编写人员名单身份与同一性",
          "requirement": "【研究级核验标准；非校方正式规则】R003 T0–T1 编写人员名单身份与同一性 | T=拟出版申报有主编/作者团队；F=非编写出版事项；U=团队所属案件/身份不可核 | SRC-001/002/007/011；F007/F016/F017/F022；M002/M007/M009/M013 | 对人员稳定身份、单位、名单版本及学院正式审查对应人员是否同一；A/B 校验，C 扫描待核。名单不同 CONFLICT，身份权源失联 SOURCE_UNAVAILABLE；只核对名单，不核资格合法性 | PASS_FACT 仅证明名单同一，具体资格另交 R030/学院党委",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "拟出版归属主张与预期签约年度",
          "requirement": "【研究级核验标准；非校方正式规则】R004 T0 拟出版归属主张与预期签约年度 | T=明确申请 2026 第一批拟出版；F=已证为纯建设项目；U=批次或权属适用性不明 | SRC-001/002/011/017；F002/F014/F015/F038；M001/M002/M008/M030 | 将拟签约年份和“校为著作权归属单位”这一申请资格主张分别与当期通知核；主编单方声明只能 PASS_FACT 于“声称一致”，权属真实性未证仍需 HU，不得显示“资格已最终通过”。合同或 G06 可信结论相反则 CONFLICT；无已签合同明确不报缺 M029 | 只证字段主张，不认定版权真实归属；学院有权机构/版权管理者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "已完稿与清样版本",
          "requirement": "【研究级核验标准；非校方正式规则】R005 T0 已完稿与清样版本 | T=2026 拟出版批次；F=项目申请当期不要求完稿；U=事项未识别 | SRC-001/002；F010/F012–F014；M002/M003 | 文件完整性、目录页码、稿件 hash、拟签约年份；T0 需可审读完稿，AI 不判学术完成质量。缺稿 NEEDS_MATERIAL，部分缺页 UNREADABLE，申请/稿件冲突 CONFLICT | PASS_FACT 仅证明可审读稿件存在；交学院学术审核",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "申请、封面与团队一致性",
          "requirement": "【研究级核验标准；非校方正式规则】R006 T0–T2 申请、封面与团队一致性 | T=申请表和书稿/团队版本均已进入当前阶段；F=只有项目指南而无拟出版申请；U=证据无法归案 | SRC-001/002/015；F007/F010/F012/F016/F021/F040；M002/M003/M007 | 以正式申请为申报主张，把书名、主编、署名次序和书稿版本逐字段对照，不能以同名合并；来源 C 需核原件。分歧 CONFLICT，附件表格细格位未知 POLICY_UNCONFIRMED | PASS_FACT 仅证明字段同版一致；交学院经办/主编更正",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "→T2 学院送审的课程与课程大纲",
          "requirement": "【研究级核验标准；非校方正式规则】R007 T1→T2 学院送审的课程与课程大纲 | T=2026 拟出版已进入学院统一报送前核件阶段；F=T0 仅主编初交或非该批次；U=学院送审阶段/大纲效力不明 | SRC-001/002；F018/F019；M002/M004 | 对课程代码、用途及大纲原始版本；有权课程系统 B 级记录可供核对，是否可代纸件由收件单位确认。T0 无 M004=NOT_APPLICABLE（尚未到该节点）；T1→T2 缺当前要求大纲 NEEDS_MATERIAL、系统失联 SOURCE_UNAVAILABLE、错课程 CONFLICT | PASS_FACT 仅证对应事实，不形成 T01-T04 选用许可；课程主管/学院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "纸本/数字载体及资源",
          "requirement": "【研究级核验标准；非校方正式规则】R008 T0–T2 纸本/数字载体及资源 | T=已确认 2026 拟出版媒介类型且处于本阶段应核媒介环节；F=非拟出版事项或尚未到达对应材料节点；U=纸本/融合/纯数字界定不明 | SRC-001/002；F011/F012/F020；M003/M005/M006 | T0 数字链接/资源可访问；T1→T2 纸本三套数量及与电子稿一致；数字教材免纸质三套但非免书稿；链接失效 SOURCE_UNAVAILABLE 或 UNREADABLE，载体冲突 CONFLICT，媒介不明 POLICY_UNCONFIRMED | PASS_FACT 只核本次介质/资源存在；交学院归口；纯数字纸样子条件豁免不是整条 R 豁免",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "TX 联合编写版权、署名及贡献冲突",
          "requirement": "【研究级核验标准；非校方正式规则】R009 TX 联合编写版权、署名及贡献冲突 | T=存在跨单位/共编/权属矛盾；F=可信来源证实当前无需专门争议办理；U=权属结构无从核 | SRC-001/007/011/013/017；F015–F017/F038；M007/M008/M029/M030 | 多方声明、授权书、合同和已有权威权属决定按主体/作品版本/授权范围比；署名或贡献声明≠著作权证明。G06 原决定仅在同一版权/交易对象且真实签发时引用；权利来源冲突 CONFLICT，权属/贡献裁决 HU，任意百分比门槛 PC | PASS_FACT 仅证文件表面一致；交版权/法务/有权机构",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "学院政治与人员审查是否发生",
          "requirement": "【研究级核验标准；非校方正式规则】R010 T1 学院政治与人员审查是否发生 | T=C01/C02 进入学院审查；F=未进入 T1 或独立项目不同程序；U=阶段/党组织权限不明 | SRC-001/002/007/011；F016/F022/F023；M009/M013/M003 | 核学院党委/党总支记录、人员清单、内容/插图审查关联书稿 hash、签发权与时间；政治实质全须人审。阶段到达无文书 NEEDS_MATERIAL，签署不可信 NEEDS_HUMAN_DECISION，不可读 UNREADABLE | PASS_FACT 只证程序记录同版存在；交学院党委",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "学院学术审查和专家资格",
          "requirement": "【研究级核验标准；非校方正式规则】R011 T1 学院学术审查和专家资格 | T=2026 拟出版已进入专家审读；F=非该批次或尚未到 T1；U=受聘身份不可核 | SRC-001/002/015；F024/F025/F012；M010/M011/M003 | 2026 本科/研究生第一批须 2 位相关专家且至少 1 位校外；核有权专家身份与签章、分委会意见、稿件版本；此数字不得搬到项目立项。人数或名单冲突 CONFLICT，专家权不明 NEEDS_HUMAN_DECISION | PASS_FACT 仅为构成/签署存在；学术优劣交学院学委/专家",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "→T2 学院审核表签章和送审",
          "requirement": "【研究级核验标准；非校方正式规则】R012 T1→T2 学院审核表签章和送审 | T=学院拟把审核通过教材报学校；F=未达到学院报送阶段；U=学院签章授权未取得 | SRC-001/002/015；F021/F025/F027；M002/M011/M014 | 以学院签章、审核表、专家意见和报送回执对同一个教材/版次；2026 通知纸电报送是学院责任。缺阶段件 NEEDS_MATERIAL，签发真实性待核 NEEDS_HUMAN_DECISION | PASS_FACT 仅证明学院送审证据，交学校收件经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "结束学院双公示及异议处理",
          "requirement": "【研究级核验标准；非校方正式规则】R013 T1 结束学院双公示及异议处理 | T=2026 拟出版学院完成初审拟报送；F=T0 尚未学院公示；U=公示链接/周期未核 | SRC-001/002/007/015；F022/F026/F027；M012/M013/M014 | 学院教材初审公示与人员资格公示分别核机构、批次、名单、版本、异议处理，不以截图替代权威网页；失联 SOURCE_UNAVAILABLE、冲突 CONFLICT、状态待认定 NEEDS_HUMAN_DECISION | PASS_FACT 不等于公示无异议的正式核定；交学院党委/学院正式公示单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "学校专家终审记录",
          "requirement": "【研究级核验标准；非校方正式规则】R014 T2 学校专家终审记录 | T=学院通过并进入校级审评；F=尚未进入校评阶段；U=校方评审授权不明 | SRC-001/002/011；F028/F012/F027；M014/M015 | 对有权学校组织、终审记录、意见所审稿件/申请版本、签发时间；到达节点无记录 NEEDS_MATERIAL、旧稿引用 CONFLICT、签署权不明 NEEDS_HUMAN_DECISION | PASS_FACT 仅证明终审记录，不代表学校批准；交学校有权评审机构",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "校级公示与异议状态",
          "requirement": "【研究级核验标准；非校方正式规则】R015 T2 校级公示与异议状态 | T=已有学校终审待公示或正在公示；F=校终审尚未触发公示；U=公示页失联 | SRC-001/002/003；F029/F036；M016/M027/M028 | 校方正式公示原文、起止、书名/团队及异议轨迹；2026 研究生样本 5/9–5/14 不是通用期限。失联 SOURCE_UNAVAILABLE，未到期/异议未结 NEEDS_HUMAN_DECISION，错版本 CONFLICT | PASS_FACT 仅证明公示事实；交原发布/异议受理单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "结束正式同意出版决定可信性",
          "requirement": "【研究级核验标准；非校方正式规则】R016 T2 结束正式同意出版决定可信性 | T=声称该本教材已获同意出版；F=只询问是否有齐套申请而未主张批准；U=决定原件/授权不明 | SRC-001/002/003/011；F028–F030/F040；M015/M016/M017/M028/M033 | 验证终审、完成公示/异议处理、正式有权决定对象与版次；截图、OCR“同意”、未结束公示不能替代。权威决定缺失 NEEDS_HUMAN_DECISION、效力争议同码、跨批版本 CONFLICT | PASS_FACT 仅证明决定记录与目标匹配；发布/维持批准只能学校有权机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "项目/专项申报窗口和书面申请",
          "requirement": "【研究级核验标准；非校方正式规则】R017 T0 项目/专项申报窗口和书面申请 | T=有该学段/年度生效且开放的教材建设/专项指南；F=本案已证为拟出版而非立项；U=只有 2023 历史通知或 2026 专项片段 | SRC-005/009/016；F002–F005/F031；M018/M019 | 核指南发文者、类别、适用人群、截止、申请书版本；历史 2023 事项仅可演练，2026 常开资格未证。无当批文件 POLICY_UNCONFIRMED，权威网页失联 SOURCE_UNAVAILABLE | PASS_FACT 仅证明项目申请形式，交项目归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "建设方案、成员、目标与预算证据",
          "requirement": "【研究级核验标准；非校方正式规则】R018 T0 建设方案、成员、目标与预算证据 | T=有效项目指南要求相应字段；F=指南明确无该项目材料要求；U=附件未读或阈值未知 | SRC-005/016；F007/F017/F031/F032；M019/M020 | 把项目申报书内或单独建设方案、人员/计划/预算对应同一项目版次；M019 已含内容则不重复上传。表格格位、预算上限及成果目标不可据旧表推定，按 POLICY_UNCONFIRMED | PASS_FACT 仅证明材料陈述完整，交项目初审人员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "项目学院推荐/审核签发",
          "requirement": "【研究级核验标准；非校方正式规则】R019 T1 项目学院推荐/审核签发 | T=当期项目指南确有学院审核节点且已进入；F=未进入项目学院评审；U=指南不明 | SRC-005/011；F033/F009；M018/M021 | 学院授权机关、签章、项目/负责人与申请版次；2023 年流程不能直接作 2026 授权。缺当前正式推荐 NEEDS_MATERIAL，签权争议 NEEDS_HUMAN_DECISION | PASS_FACT 仅证明有学院推荐，交学校项目主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "/T3 学校推荐、学校立项和上级决定区分",
          "requirement": "【研究级核验标准；非校方正式规则】R020 T2/T3 学校推荐、学校立项和上级决定区分 | T=项目已进入学校/上级办理阶段；F=尚在 T0 申请阶段；U=权限层级或文件不可辨 | SRC-005/009/011；F034/F032；M022/M018 | 对推荐/立项/资助分别核签发机关、文号、目标与生效时点；学校推荐不等于省/国家立项，项目立项不等于拨款。错层级 CONFLICT，正式决定待出 NEEDS_HUMAN_DECISION | PASS_FACT 仅核有权文件内容，不替代该机关决定；交项目归口/上级",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "TX 复报旧案及稿件修订说明",
          "requirement": "【研究级核验标准；非校方正式规则】R021 TX 复报旧案及稿件修订说明 | T=当期明确允许/要求前批未通过者改稿重报；F=初次申报或通知没有该分支；U=当期指南不可核 | SRC-002/004/011；F012/F035/F040；M003/M023/M024 | 旧决定只引用，记录 oldHash→newHash、逐项修改与新批；2026 研究生通知有修改说明条款，适用“前批未通过重报”需结合真实批次，不自动跨年适用。前件失联 SOURCE_UNAVAILABLE、说明缺 NEEDS_MATERIAL、版本不一致 CONFLICT | PASS_FACT 仅核差异链可追溯，交主编/学院重新审核",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "TX 补件通知、范围和签收",
          "requirement": "【研究级核验标准；非校方正式规则】R022 TX 补件通知、范围和签收 | T=有权经办确认当阶段需要补件；F=无补件事件；U=办理时限/签收权限未知 | SRC-001/002/011；F036/F040；M025/M033 | 核材料槽、原问题、通知与回执、版本和发出人；当前阶段件才可催，T2 决定不得在 T0 催。未核时限 POLICY_UNCONFIRMED，缺受理凭据 NEEDS_HUMAN_DECISION | PASS_FACT 仅证送达与补交链，交阶段经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "TX 主编/受托人撤回请求及效力",
          "requirement": "【研究级核验标准；非校方正式规则】R023 TX 主编/受托人撤回请求及效力 | T=有实际撤回请求；F=未提出；U=请求人授权或校方程序未核 | SRC-003/011；F006/F008/F036；M026/M033 | 请求、权限、接受机关、原案状态及答复各自记录；提出撤回≠已生效，不能抹除先前决定。现行撤回截止未知 POLICY_UNCONFIRMED，受理/效力 NEEDS_HUMAN_DECISION | PASS_FACT 仅证请求真实，交有权受理部门",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "TX 公示异议/正式复核请求与处理",
          "requirement": "【研究级核验标准；非校方正式规则】R024 TX 公示异议/正式复核请求与处理 | T=公示异议或有证据的复核请求；F=未提出且公示尚待正常推进；U=申诉/复核权源未核 | SRC-003/011；F029/F036/F040；M016/M027/M028/M033 | 2026 研究生公示允许反映异议，不能由此推导独立行政复核期限；区分提出/受理/处理/正式答复，证据限制 P2/P3。答复未出 NEEDS_HUMAN_DECISION，正式制度不明 POLICY_UNCONFIRMED | PASS_FACT 仅证事件链，交公告指定受理或有权复核者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "出版合同、签章与版权边界",
          "requirement": "【研究级核验标准；非校方正式规则】R025 T3 出版合同、签章与版权边界 | T=实际进入出版签约或出现合同权属争议；F=2026 T0 仅拟签约、合同尚未产生；U=权利主体不明 | SRC-001/002/011/017/018/019；F014/F015/F037/F038；M029/M030/M008 | 逐项核合同相对方、出版方、许可/专有出版权范围、纸电载体、期限、作品版次、共同作者授权、签约时点；国家版权局 2026 示范文本仅辅助设计比对字段，不能取代真实合同或校本审批。错权利人/未授权许可 CONFLICT/HU，合同效力与资格交法务，T0 没合同绝不报缺 | PASS_FACT 仅核合同原档一致性；合同/版权主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "正式出版物信息",
          "requirement": "【研究级核验标准；非校方正式规则】R026 T3 正式出版物信息 | T=已经公开发行并要核对版本；F=拟出版尚未发行；U=发行状态不明 | SRC-001/002/010；F039/F010/F012；M031/M003 | 按出版方/权威书目核 ISBN、版次、题名和版本关系；不把缺 ISBN 用于 T0 不通过。来源失联 SOURCE_UNAVAILABLE，实物版本差异 CONFLICT | PASS_FACT 仅核版次事实，交出版事务经办",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "教材建设项目过程和结题",
          "requirement": "【研究级核验标准；非校方正式规则】R027 T3 教材建设项目过程和结题 | T=正式立项且列入当期验收范围、已到过程/验收阶段；F=尚在建设立项申请或其他类别项目；U=当期项目名单/附件原件不明 | SRC-005/008/011；F031/F032/F034/F040；M018/M022/M032 | 逐项目号/年度/批准延期与立项申报书预期目标、成果版次、当期结题文书核对；成理研〔2026〕43号含教材建设项目结题报告书、9/7学院报送，仅2026该批到期项目适用，附表未读就保留 PC，不将“省级教改必须标注”扩成所有教材项目通用硬件。到阶段已证缺件 NM，名单/材料源失联 SU | PASS_FACT 仅为报送事实，验收结论由归口与专家作出",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "全阶段 证据归属、可读与有效版次",
          "requirement": "【研究级核验标准；非校方正式规则】R028 全阶段 证据归属、可读与有效版次 | T=任一材料入案或替换；F=无输入证据的尚未发生事件；U=原件/主档不可定位 | SRC-001/002/013；F001/F012/F035/F040；M003/M006/M024/M033 | 以材料 ID/权利人/签发者、SHA-256、页位、读取时间、可访问权限、主从版本核证；D 级 OCR 不升为签章。缺源 SOURCE_UNAVAILABLE，损坏 UNREADABLE，冒用他案 CONFLICT；旧 run 只能历史引用 | PASS_FACT 只证该次取证可追溯，交材料持有人/案卷 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "全阶段 G50/S/T 权威结论引用与决定去重",
          "requirement": "【研究级核验标准；非校方正式规则】R029 全阶段 G50/S/T 权威结论引用与决定去重 | T=本案援引教材选用、课程、项目、人事业绩或 G06 权属既有决定；F=没有外部决定依赖；U=外部已签决定/授权关系未核 | SRC-010/013/014/020；F002/F018/F034/F038/F040；M004/M022/M030/M033 | 指定 SHA 的 G50 50 个候选目录已读，但它标注未集成/禁止发布；g06-t03/t04/t09 仅按独立对象类型引用，不以候选代真实决定。外部引用必须同时验 issuer、decisionId、objectId、对象/材料版次、有效期，T01-T04 选用≠出版，T05-T02/03 改革/课程≠教材项目 | PASS_FACT 仅证可核真实外部记录匹配；无真实决定 HU/SU，交相应 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "编写人员实质资格与党委意见",
          "requirement": "【研究级核验标准；非校方正式规则】R030 T0–T1 编写人员实质资格与党委意见 | T=拟出版申报到达要求核编写人员资格的节点；F=仅项目申报且现行指南没有此要求；U=成理校教〔2024〕18 号第 10/11 条正文尚缺 | SRC-001/002/007/011；F007/F016/F022/F023；M007/M009/M013 | R003 可核身份名单，但绝不能据此认定资格合规；资格门槛、例外、党委政治审查效力均需 2024 校本原件及有权人判断，现状只能 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION，不设职称或贡献百分比 | 即使名单 PASS_FACT，R030 仍待制度/学院党委核定",
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
  "templateId": "T05-T04",
  "name": "教材编写、出版与教材建设项目申报审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T05-T04.md",
  "sourceDocumentSha256": "7006503703c394c88352dac60e6ecd42e4a06ab40c3bc88af37c05e8de9b652a",
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
      "status": "CURRENTITY-UNKNOWN"
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
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-010",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-011",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-012",
      "status": "CURRENTITY-UNKNOWN"
    },
    {
      "id": "SRC-013",
      "status": "GENERAL-RESEARCH"
    },
    {
      "id": "SRC-014",
      "status": "GENERAL-RESEARCH"
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
      "status": "CDUT-VERIFIED"
    },
    {
      "id": "SRC-021",
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
        "SRC-005",
        "SRC-009",
        "SRC-011"
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
        "SRC-011",
        "SRC-013",
        "SRC-015"
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
        "SRC-011",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-011",
        "SRC-013",
        "SRC-015",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-011",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-011",
        "SRC-013",
        "SRC-017"
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
        "SRC-011",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-005",
        "SRC-009",
        "SRC-011",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-005",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-005",
        "SRC-009",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-005",
        "SRC-009",
        "SRC-011"
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
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-003",
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-011",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-011",
        "SRC-013",
        "SRC-017",
        "SRC-018",
        "SRC-019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R026",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R027",
      "srcIds": [
        "SRC-005",
        "SRC-008",
        "SRC-009",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "evidence-review",
      "criterionId": "R029",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005",
        "SRC-007",
        "SRC-009",
        "SRC-010",
        "SRC-011",
        "SRC-013",
        "SRC-014",
        "SRC-020"
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
        "SRC-011",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
