import type { TemplateVersion } from '@profer/shared'

/** R02 research-only runtime projection; not a CDUT official template or policy version. */
export const templateVersion: TemplateVersion = {
  "templateId": "T03-T03",
  "version": 1,
  "schemaVersion": 2,
  "name": "横向科研合同立项与研究合同内容审核",
  "description": "本地研究模板 · 非校方正式模板。适用于“横向科研合同立项与研究合同内容审核”的材料、事实与风险核对；政策适用、校内授权及正式决定均须由有权人员确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板。来源文档 docs/design/review-agent/business-templates/R02/T03-T03.md；源文档 SHA-256 85e3a2b66ec72c5cfe1610176378cf93395a720de76b2111c912770956a08393；政策证据状态 PARTIAL；不得将 SRC 研究来源伪装为案卷 SourceRef 或正式 PolicyVersion。",
  "objectType": "project",
  "displayName": {
    "template": "{{f002}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "案卷标识／id／Case",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“案卷标识／id／Case”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f002",
      "label": "当前办理阶段／enum／Case",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“当前办理阶段／enum／Case”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f003",
      "label": "办理情形 A–I／enum／Case",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“办理情形 A–I／enum／Case”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f004",
      "label": "事件发生时点／time／Event",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“事件发生时点／time／Event”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f005",
      "label": "发起人可信身份 ID／id／Party",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“发起人可信身份 ID／id／Party”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f006",
      "label": "发起人姓名／text／Party",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“发起人姓名／text／Party”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f007",
      "label": "人员类别／enum／Party",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“人员类别／enum／Party”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f008",
      "label": "所属校内单位／ref／Party",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“所属校内单位／ref／Party”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f009",
      "label": "代理权限与期限／ref／Party",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“代理权限与期限／ref／Party”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f010",
      "label": "拟负责人 ID／id／Party",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“拟负责人 ID／id／Party”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f011",
      "label": "科研责任承诺状态／enum／AuthorityEvidence",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“科研责任承诺状态／enum／AuthorityEvidence”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f012",
      "label": "相对方名称／text／Party",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“相对方名称／text／Party”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f013",
      "label": "相对方统一社会信用代码／text／Party",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“相对方统一社会信用代码／text／Party”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f014",
      "label": "相对方主体类型／enum／Party",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“相对方主体类型／enum／Party”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f015",
      "label": "对方签约人及权限／ref／Party",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“对方签约人及权限／ref／Party”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f016",
      "label": "合同及项目名称／text／DraftContract",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“合同及项目名称／text／DraftContract”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f017",
      "label": "草案版本／id／DraftContract",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“草案版本／id／DraftContract”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f018",
      "label": "资金／项目来源性质／enum／Case",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“资金／项目来源性质／enum／Case”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f019",
      "label": "拟技术合同子类型／enum／DraftContract",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“拟技术合同子类型／enum／DraftContract”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f020",
      "label": "各方角色及法律关系／list／DraftContract",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“各方角色及法律关系／list／DraftContract”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f021",
      "label": "技术目标／text／ResearchPlan",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“技术目标／text／ResearchPlan”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f022",
      "label": "任务与参与分工／list／ResearchPlan",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“任务与参与分工／list／ResearchPlan”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f023",
      "label": "技术方案／text／ResearchPlan",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“技术方案／text／ResearchPlan”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f024",
      "label": "实施与交付时间安排／list／DraftContract",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“实施与交付时间安排／list／DraftContract”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f025",
      "label": "可交付成果／list／ResearchPlan",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“可交付成果／list／ResearchPlan”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f026",
      "label": "验收指标与方式／list／DraftContract",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“验收指标与方式／list／DraftContract”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f027",
      "label": "合同价款及币种／decimal+text／DraftContract",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“合同价款及币种／decimal+text／DraftContract”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f028",
      "label": "支付里程碑／list／DraftContract",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“支付里程碑／list／DraftContract”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f029",
      "label": "背景知识产权／ref/list／ResearchPlan",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“背景知识产权／ref/list／ResearchPlan”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f030",
      "label": "新成果权属／收益安排／text／DraftContract",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“新成果权属／收益安排／text／DraftContract”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f031",
      "label": "保密与受限状态／enum／DraftContract",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“保密与受限状态／enum／DraftContract”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f032",
      "label": "采购／科研外协触发线索／flag/list／Case",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“采购／科研外协触发线索／flag/list／Case”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f033",
      "label": "所在单位初审意见／ref／AuthorityEvidence",
      "kind": "boolean",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“所在单位初审意见／ref／AuthorityEvidence”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f034",
      "label": "专家／法务／专责意见／ref／AuthorityEvidence",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“专家／法务／专责意见／ref／AuthorityEvidence”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f035",
      "label": "学校授权签约者／ref／AuthorityEvidence",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“学校授权签约者／ref／AuthorityEvidence”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f036",
      "label": "校内批准绑定／ref／AuthorityEvidence",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“校内批准绑定／ref／AuthorityEvidence”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f037",
      "label": "双方签署完成状态／ref／Event",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“双方签署完成状态／ref／Event”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f038",
      "label": "技术合同认定登记证明／ref／Event",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“技术合同认定登记证明／ref／Event”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f039",
      "label": "到款／票据权威关联／ref／Event",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“到款／票据权威关联／ref／Event”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f040",
      "label": "补件或合同变更事件／ref/list／Event",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“补件或合同变更事件／ref/list／Event”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f041",
      "label": "撤回／复核请求及处理状态／enum/ref／Event",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“撤回／复核请求及处理状态／enum/ref／Event”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f042",
      "label": "G50/S/T 权威结论关联／ref/list／AuthorityEvidence",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“G50/S/T 权威结论关联／ref/list／AuthorityEvidence”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f043",
      "label": "材料版本和哈希／id/hash／MaterialSource",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“材料版本和哈希／id/hash／MaterialSource”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    },
    {
      "key": "f044",
      "label": "材料归属、页位、采集渠道／ref／MaterialSource",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "仅从可追溯来源提取“材料归属、页位、采集渠道／ref／MaterialSource”；证据不足或政策/身份未知时保留待确认，不从文件名或界面自报值推断。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "证明案卷发起、情形、阶段及操作事件",
      "purpose": "；证明案卷发起、情形、阶段及操作事件；可信案卷事件账本，提交意图由负责人表达；当前必需 P0/P1；允许同一业务系统的经认证业务流水替代，不要求申请人制作纸质《立项申请表》；F001–F004,F018,F044；SRC-001/002（存在事项入口，字段细则未核）；绑定 caseId+事件签发主体+时点；无法创建或关联→SOURCEUNAVAILABLE；时点／情形不明→澄清；事件日志损坏→UNREADABLE，不补造签章；证明案卷发起、情形、阶段及操作事件；可信案卷事件账本，提交意图由负责人表达；当前必需 P0/P1；允许同一业务系统的经认证业务流水替代，不要求申请人制作纸质《立项申请表》；F001–F004,F018,F044；SRC-001/002（存在事项入口，字段细则未核）",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "证明案卷发起、情形、阶段及操作事件",
        "负责人",
        "签章",
        "签发主体"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m002",
      "name": "确认校内发起人身份、组织和拟负责人身份",
      "purpose": "；确认校内发起人身份、组织和拟负责人身份；校方人事／统一身份／科研权限记录；当前必需的权威事实 P1，非个人必传材料；通过受权校方接口或人工授权核验替代，不能用用户自报角色代替；F005–F008,F010；SRC-001/007（人员责任原则；具体资格待校本核）；subjectId+人事有效期；接口不可用→SOURCEUNAVAILABLE，不同身份记录冲突→CONFLICT；记录不可读→UNREADABLE，敏感资料限权查看；确认校内发起人身份、组织和拟负责人身份；校方人事／统一身份／科研权限记录；当前必需的权威事实 P1，非个人必传材料；通过受权校方接口或人工授权核验替代，不能用用户自报角色代替；F005–F008,F010；SRC-001/007（人员责任原则；具体资格待校本核）",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "确认校内发起人身份、组织和拟负责人身份",
        "负责人",
        "身份",
        "授权"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m003",
      "name": "证明经办代理范围／期限",
      "purpose": "；证明经办代理范围／期限；委托人及学校有权主体的委托／代理授权记录；条件必需 P1/P3，仅非本人经办或代签时；可信电子授权可替代纸件，普遍允许代理的范围待核；F009–F010；SRC-005/006/008；授权 ID、签发者、有效期、撤销状态及案卷绑定；触发后无有效授权→NEEDSMATERIAL+人工，签发系统离线→SOURCEUNAVAILABLE；签章模糊→UNREADABLE；证明经办代理范围／期限；委托人及学校有权主体的委托／代理授权记录；条件必需 P1/P3，仅非本人经办或代签时；可信电子授权可替代纸件，普遍允许代理的范围待核；F009–F010；SRC-005/006/008",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "证明经办代理范围／期限",
        "签章",
        "授权",
        "期限"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m004",
      "name": "证明科研项目负责人履行责任承诺",
      "purpose": "；证明科研项目负责人履行责任承诺；科研承诺书或校方有权承诺事件；条件必需，仅校方 2024 经费办法所涉承诺实际触发的 P3/经费阶段；学校现行表单或可信电子承诺可替代，不作全部 P1 合同必传；F011；SRC-007 第 1 条；承诺人与项目 ID、产生时间；未到承诺节点→NOTAPPLICABLE；触发而未提供→NEEDSMATERIAL；可见但不清→UNREADABLE；证明科研项目负责人履行责任承诺；科研承诺书或校方有权承诺事件；条件必需，仅校方 2024 经费办法所涉承诺实际触发的 P3/经费阶段；学校现行表单或可信电子承诺可替代，不作全部 P1 合同必传；F011；SRC-007 第 1 条",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "证明科研项目负责人履行责任承诺",
        "负责人",
        "时间",
        "合同"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m005",
      "name": "核对合同相对方真实主体",
      "purpose": "；核对合同相对方真实主体；相对方提供登记信息＋法定登记公示／身份核验记录；条件必需 P1/P3：对方主体性质、名称、代码存在核验疑点时；可信国家登记查询可替代执照扫描，境外／自然人主体不得强套统一社会信用代码；F012–F014；SRC-012 第 843–850 条；以主体唯一标识、登记变更历史和查询时间绑定；未查得→SOURCEUNAVAILABLE／人工核查，草案与登记不同→CONFLICT；附件糊→UNREADABLE；核对合同相对方真实主体；相对方提供登记信息＋法定登记公示／身份核验记录；条件必需 P1/P3：对方主体性质、名称、代码存在核验疑点时；可信国家登记查询可替代执照扫描，境外／自然人主体不得强套统一社会信用代码；F012–F014；SRC-012 第 843–850 条",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "核对合同相对方真实主体",
        "身份",
        "时间",
        "合同",
        "相对方"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m006",
      "name": "核对对方签约人有权代表相对方",
      "purpose": "；核对对方签约人有权代表相对方；法定代表或有效委托证明由相对方持有；条件必需 P3/P5 准备签署时；可信商事登记法代信息或验证过的委托可替代部分纸件，签前草案不必先有对方盖章；F015；SRC-005/012；签署主体、代理人、权限、有效期与 M015 当前版相连；应核无件→NEEDSMATERIAL；登记端失联→SOURCEUNAVAILABLE；印章不清→UNREADABLE；核对对方签约人有权代表相对方；法定代表或有效委托证明由相对方持有；条件必需 P3/P5 准备签署时；可信商事登记法代信息或验证过的委托可替代部分纸件，签前草案不必先有对方盖章；F015；SRC-005/012",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "核对对方签约人有权代表相对方",
        "相对方",
        "签署"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m007",
      "name": "核心合同草案，证明拟议主体、研究内容、权利义务、价款、时间与版本",
      "purpose": "；核心合同草案，证明拟议主体、研究内容、权利义务、价款、时间与版本；发起人／项目组持有，含可解析文档或受控原文；当前必需 P1 的研究合同内容预审；经当事方确认的完整电子合同草稿合法替代扫描件，内容已在附件中的不要求再填一份；F012,F014,F016–F020,F022,F024–F032,F043–F044；SRC-005/012；绑定 caseId+contractInstanceId+version+hash+具体条款／页位；不存在→NEEDSMATERIAL，不可抽取→UNREADABLE，错误案卷→CONFLICT，保密不允许解析→NEEDSHUMANDECISION；核心合同草案，证明拟议主体、研究内容、权利义务、价款、时间与版本；发起人／项目组持有，含可解析文档或受控原文；当前必需 P1 的研究合同内容预审；经当事方确认的完整电子合同草稿合法替代扫描件，内容已在附件中的不要求再填一份；F012,F014,F016–F020,F022,F024–F032,F043–F044；SRC-005/012",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "核心合同草案，证明拟议主体、研究内容、权利义务、价款、时间与版本",
        "版本",
        "时间",
        "合同",
        "保密"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m008",
      "name": "补足技术目标、方案、任务分工、成果及验收指标",
      "purpose": "；补足技术目标、方案、任务分工、成果及验收指标；发起人／项目组持有，技术任务书／报价技术附件／经验证正文；条件必需 P1/P2，仅 M007 信息不足或主合同明确援引独立技术附件时；M007 已包含完整同等信息即视为合法替代，不重复上传；F020–F026,F043–F044；SRC-012 第 845/851 条及相应技术合同规范；必须标注对应 M007 版本及附件编号；关键附件缺且无法按合同解释→NEEDSMATERIAL；附件指标与主文不同→CONFLICT；技术图不可读→UNREADABLE；补足技术目标、方案、任务分工、成果及验收指标；发起人／项目组持有，技术任务书／报价技术附件／经验证正文；条件必需 P1/P2，仅 M007 信息不足或主合同明确援引独立技术附件时；M007 已包含完整同等信息即视为合法替代，不重复上传；F020–F026,F043–F044；SRC-012 第 845/851 条及相应技术合同规范",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "补足技术目标、方案、任务分工、成果及验收指标",
        "版本",
        "任务书",
        "合同",
        "成果"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m009",
      "name": "证明被引用背景知识产权或已有专利／成果处置许可的权源",
      "purpose": "；证明被引用背景知识产权或已有专利／成果处置许可的权源；权利人及 G06 有权决定机关 持有；条件必需 P2/P3，仅涉及既有成果权属主张、许可／转让／处分时；有效知识产权登记、权源文件或可核 G06 决定可替代普通图片；F029–F030,F042；SRC-012 第 845/851/861 条；G06 校本 SRC 待取；关联标的/权利号、权利人、授权类型、有效期及本合同条款版本；未核即人工，旧许可冒用→CONFLICT，机关不可访问→SOURCEUNAVAILABLE；证明被引用背景知识产权或已有专利／成果处置许可的权源；权利人及 G06 有权决定机关 持有；条件必需 P2/P3，仅涉及既有成果权属主张、许可／转让／处分时；有效知识产权登记、权源文件或可核 G06 决定可替代普通图片；F029–F030,F042；SRC-012 第 845/851/861 条；G06 校本 SRC 待取",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "证明被引用背景知识产权或已有专利／成果处置许可的权源",
        "版本",
        "授权",
        "合同",
        "成果"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m010",
      "name": "判断受限、涉密技术材料应走何种处理通道",
      "purpose": "；判断受限、涉密技术材料应走何种处理通道；校方保密专责签发的安全分流状态；条件必需 P0/P3，触发涉密／受限标识时；仅传输批准的分级元数据／安全证明引用，普通 AI 不得接收涉密正文作为替代；F031,F042；SRC-009（目录级，细则未核），SRC-013 第 21 条；保密判定主体、权限、期限与限制范围；无权威分流→POLICYUNCONFIRMED+NEEDSHUMANDECISION；泄密风险停止解析，不以 NEEDSMATERIAL 诱导上传；判断受限、涉密技术材料应走何种处理通道；校方保密专责签发的安全分流状态；条件必需 P0/P3，触发涉密／受限标识时；仅传输批准的分级元数据／安全证明引用，普通 AI 不得接收涉密正文作为替代；F031,F042；SRC-009（目录级，细则未核），SRC-013 第 21 条",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "判断受限、涉密技术材料应走何种处理通道",
        "保密",
        "期限"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m011",
      "name": "证明混合科研、采购或下游外协已转交其有权所有者",
      "purpose": "；证明混合科研、采购或下游外协已转交其有权所有者；T04／科研外协权威案件引用；条件必需 P2/P3，仅项目确实触发采购或另行外协；相关所有者的有效受理／决定 ID 可替代本模板二次材料审查；F032,F042；SRC-005 第 15 条解读，SRC-010；绑定另案 ID、当事法律关系及决定效力；对象不同→CONFLICT，尚无决定而要求前置与否未知→POLICYUNCONFIRMED；已决定但接口失联→SOURCEUNAVAILABLE；证明混合科研、采购或下游外协已转交其有权所有者；T04／科研外协权威案件引用；条件必需 P2/P3，仅项目确实触发采购或另行外协；相关所有者的有效受理／决定 ID 可替代本模板二次材料审查；F032,F042；SRC-005 第 15 条解读，SRC-010",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "证明混合科研、采购或下游外协已转交其有权所有者"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m012",
      "name": "记录所在单位／校内科研初审意见",
      "purpose": "；记录所在单位／校内科研初审意见；真实有权单位审签事件；后续才产生／条件必需 P3，是否必经待 SRC-002/003/006；受权校方电子意见替代图像签字，不得在 P1 要求已有盖章；F033,F036；SRC-002/003/005/006；决定人可信 ID、单位、权限、所审 contractVersion；尚未到节点→NOTAPPLICABLE，到节点政策不明→POLICYUNCONFIRMED，错版→CONFLICT；记录所在单位／校内科研初审意见；真实有权单位审签事件；后续才产生／条件必需 P3，是否必经待 SRC-002/003/006；受权校方电子意见替代图像签字，不得在 P1 要求已有盖章；F033,F036；SRC-002/003/005/006",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "记录所在单位／校内科研初审意见"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m013",
      "name": "支持技术专家、法务或专责部门裁量",
      "purpose": "；支持技术专家、法务或专责部门裁量；具职权专家意见／法务审查；后续才产生／条件必需 P3，案件触发和具体必经条款待核；经认证校方意见替代纸件，不以 AI 分析冒充该意见；F034,F042；SRC-005/006/012；审查人、权限、关联条款／案卷版本、撤销状态；未触发→NOTAPPLICABLE，法审节点不明→POLICYUNCONFIRMED，签章不可读→UNREADABLE；支持技术专家、法务或专责部门裁量；具职权专家意见／法务审查；后续才产生／条件必需 P3，案件触发和具体必经条款待核；经认证校方意见替代纸件，不以 AI 分析冒充该意见；F034,F042；SRC-005/006/012",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "支持技术专家、法务或专责部门裁量",
        "版本",
        "签章"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m014",
      "name": "证明校内合同审批及合法授权签署",
      "purpose": "；证明校内合同审批及合法授权签署；学校当前有权审批与签约授权记录；后续才产生 P5；经认证校内决定＋有效授权清册才有意义；P1 不必有最终批准，不准用上传截图自动替代；F035–F036,F043；SRC-005/006/008；绑定案卷、合同哈希／版本、批准人 ID、授权范围、时点及有效性；不符→CONFLICT，原件未取→POLICYUNCONFIRMED，系统失联→SOURCEUNAVAILABLE；证明校内合同审批及合法授权签署；学校当前有权审批与签约授权记录；后续才产生 P5；经认证校内决定＋有效授权清册才有意义；P1 不必有最终批准，不准用上传截图自动替代；F035–F036,F043；SRC-005/006/008",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "证明校内合同审批及合法授权签署",
        "版本",
        "授权",
        "合同",
        "签署"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m015",
      "name": "证明各方签署的是被审批的合同版本",
      "purpose": "；证明各方签署的是被审批的合同版本；有签署验证的正式合同，由校方及相对方共同形成；后续才产生 P5；可靠电子签约原件或可依法核验的纸质原件为替代，起草时绝非必交；扫描图不独自证明生效；F035,F037,F043–F044；SRC-005/012；签约主体、时间、签章、hash 与 M014 绑定；错版→CONFLICT，尚未签署→NOTAPPLICABLE，签页不可读→UNREADABLE，最终效力人工核；证明各方签署的是被审批的合同版本；有签署验证的正式合同，由校方及相对方共同形成；后续才产生 P5；可靠电子签约原件或可依法核验的纸质原件为替代，起草时绝非必交；扫描图不独自证明生效；F035,F037,F043–F044；SRC-005/012",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "证明各方签署的是被审批的合同版本",
        "版本",
        "时间",
        "签章",
        "合同"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m016",
      "name": "证明后续技术合同认定登记结果",
      "purpose": "；证明后续技术合同认定登记结果；受委托的外部技术合同登记机构证明；后续才产生／条件必需 P6，仅实际提出认定登记时；可查验的登记机关有效记录替代图片，不得签前索取；F038；SRC-013 第 10–16 条；登记号、登记机关、合同签订主体及版本、变更／撤销状态；登记系统不可用→SOURCEUNAVAILABLE；不登记→NOTAPPLICABLE；复核由该体系决定；证明后续技术合同认定登记结果；受委托的外部技术合同登记机构证明；后续才产生／条件必需 P6，仅实际提出认定登记时；可查验的登记机关有效记录替代图片，不得签前索取；F038；SRC-013 第 10–16 条",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "证明后续技术合同认定登记结果",
        "版本",
        "合同"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m017",
      "name": "证明后续真实到款、开票与资金记录",
      "purpose": "；证明后续真实到款、开票与资金记录；学校财务系统或有权财务审签记录；后续才产生／条件必需 P6，经费到款／开票时；校方可信财务记录替代申请人截图；不作为 P1 初审证据；F039；SRC-007/011；财务凭证号、资金对应合同 ID、发生时点、冲销状态；接口缺失→SOURCEUNAVAILABLE，金额不合→CONFLICT，未到阶段→NOTAPPLICABLE；证明后续真实到款、开票与资金记录；学校财务系统或有权财务审签记录；后续才产生／条件必需 P6，经费到款／开票时；校方可信财务记录替代申请人截图；不作为 P1 初审证据；F039；SRC-007/011",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "证明后续真实到款、开票与资金记录",
        "金额",
        "合同"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m018",
      "name": "保存补件、撤回、复核请求、审查回复、变更差异",
      "purpose": "；保存补件、撤回、复核请求、审查回复、变更差异；案卷审计事件及受权当事人请求／有权决定；条件必需 P4/P7，事件发生才生成；可信校内业务事件／正式书面请求均可承载，但申请与批准不得混同；F017,F040–F041,F043–F044；SRC-005 第 40–41 条解读，SRC-013 第 15–16 条（限外部登记）；以原案+前后版本+请求人+时点+决定所有者串联；旧决定撤销未知→NEEDSHUMANDECISION，新旧合同冲突→CONFLICT，事件损坏→UNREADABLE；保存补件、撤回、复核请求、审查回复、变更差异；案卷审计事件及受权当事人请求／有权决定；条件必需 P4/P7，事件发生才生成；可信校内业务事件／正式书面请求均可承载，但申请与批准不得混同；F017,F040–F041,F043–F044；SRC-005 第 40–41 条解读，SRC-013 第 15–16 条（限外部登记）",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "保存补件、撤回、复核请求、审查回复、变更差异",
        "版本",
        "合同"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m019",
      "name": "引用 G50／相邻 S/T 已完成的独立前置结果",
      "purpose": "；引用 G50／相邻 S/T 已完成的独立前置结果；其他归口有权系统的决定证明；条件必需 P3/P7，确有相邻业务触发时；只读权威结论（对象、版本、签发权限、效力）替代重新审查其全套材料；F030,F032,F034,F042；SRC-005/007/009/010，G50 精确键值待查；保存源模板 ID、原决定 ID、源材料版本、权限、失效与撤销状态；错对象／错版本→CONFLICT，链接断→SOURCEUNAVAILABLE；不得以自填结论代替；引用 G50／相邻 S/T 已完成的独立前置结果；其他归口有权系统的决定证明；条件必需 P3/P7，确有相邻业务触发时；只读权威结论（对象、版本、签发权限、效力）替代重新审查其全套材料；F030,F032,F034,F042；SRC-005/007/009/010，G50 精确键值待查",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "引用 G50／相邻 S/T 已完成的独立前置结果",
        "版本"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m020",
      "name": "证明中石油平台等特定投标／账户业务的登记与科研项目投标承诺",
      "purpose": "；证明中石油平台等特定投标／账户业务的登记与科研项目投标承诺；经办人、科发院及财务持有相应分工记录；条件必需 P0，仅真实使用该平台流程时；按 SRC-015 流程可信登记/承诺记录替代重复上传，后续钱包回单须按实际发生才取；F010,F018,F044；SRC-015；投标项目、平台账户、承诺签署及资金事件分别建版本；普通科研合同→NOTAPPLICABLE，实际触发缺件→NEEDSMATERIAL，记录失联→SOURCEUNAVAILABLE；证明中石油平台等特定投标／账户业务的登记与科研项目投标承诺；经办人、科发院及财务持有相应分工记录；条件必需 P0，仅真实使用该平台流程时；按 SRC-015 流程可信登记/承诺记录替代重复上传，后续钱包回单须按实际发生才取；F010,F018,F044；SRC-015",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "证明中石油平台等特定投标／账户业务的登记与科研项目投标承诺",
        "版本",
        "合同",
        "签署"
      ],
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "review-rules",
      "name": "原研究模板审核规则",
      "description": "逐条投影源文档 R001…规则；模板内审查标准不等同校方正式政策。来源及证据状态见 r02Metadata。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "案卷与可信事件归属",
          "requirement": "P0–P7；T＝本案发生提交／操作；F＝本次无操作；U＝事件来源不明；SRC-001/002；F001–F004,F044；M001；比较服务端 caseId、场景、事件时点、已登录主体与材料封套，A 层事件不能由文件名重构；旧流程细节待核；T 一致 PASSFACT；错案 CONFLICT；源断 SOURCEUNAVAILABLE；U 不授权下一状态。下一：案卷服务／科研经办人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "发起人可信身份与组织",
          "requirement": "P1/P2，P0 特定投标亦可用；T＝发起／代表本人；F＝无新人员事实核查；U＝身份来源未知；SRC-001/007；F005–F008,F010；M002/M001；A 层校内 subjectId、所属单位、有效人事时点，与草案发起声明 C 层对照；姓名重复不代表身份相同；接口不通不要求随意传身份证照；一致的身份事实 PASSFACT；对不上 CONFLICT；A 源失联 SOURCEUNAVAILABLE。下一：身份管理／科研归口",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "R003",
          "title": "负责人独立承接资格",
          "requirement": "P1–P3；T＝需核拟负责人是否可主持；F＝仅作为非主责团队成员；U＝身份类别／资格政策未定；SRC-003/004/007；F007–F008,F010；M002/M001；查有效校本横向主持资格规则与 A 层任职，现只有经费负责人责任原则，没有足以硬判博士后／学生／外聘等资格的现行条文；不得以同名或学校邮箱推出有权主持；F NOTAPPLICABLE；U 或现有政策不足 POLICYUNCONFIRMED，资格例外请有权人 NEEDSHUMANDECISION。下一：科发院／人事",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R004",
          "title": "经办／代签代理范围",
          "requirement": "P1/P3/P5；T＝代理发起或代签；F＝确为本人操作且无代理；U＝权限链或作用范围未知；SRC-005/006/008；F005,F009–F010；M002/M003；校方受权委托 A/B 层核签发者、代理事项、时限、撤销及当前合同关联；经办代理不自动享有学校签约权；签章图片不验真；F NOTAPPLICABLE；权限对象不合 CONFLICT；权威不可读 UNREADABLE／失联 SOURCEUNAVAILABLE；校本权限条件不全 POLICYUNCONFIRMED。下一：授权管理／合同有权人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "相对方主体与名称",
          "requirement": "P1–P3；T＝草案列明相对方；F＝仅 P0 尚无合同；U＝主体身份性质不明；SRC-012；F012–F014；M005/M007；对照合同首部 C/B 与登记 A（企业代码／登记变更链）；自然人、境外主体按适用的身份体系人工核，不能硬套国内统一代码；登记按核验时点冻结；F NOTAPPLICABLE；一致 PASSFACT；异名无变更链 CONFLICT；源失联 SOURCEUNAVAILABLE；复杂法律主体交合同有权人。下一：项目组／合同管理",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R006",
          "title": "相对方签约代表权",
          "requirement": "P3/P5；T＝准备核签署授权；F＝仅 P1 起草，尚无签署任务；U＝代表关系不明；SRC-005/012；F012,F015；M005/M006/M015；验证法定代表登记、委托范围、签署时点与正式合同签章 B；相对方预留空白签章栏在 P1 非缺件；F NOTAPPLICABLE；真实范围与签约角色不符 CONFLICT；应有授权缺 NEEDSMATERIAL；法律效力由合同有权人。下一：相对方经办／学校合同审查",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "草案存在、版本和可定位性",
          "requirement": "P1/P2/P4；T＝进入合同内容事实审核；F＝P0 意向或已终结而无当前审查；U＝文档归属／版次不清；SRC-001/005/012；F016–F017,F043–F044；M001/M007；必须有可读合同草案 C/B，记录案卷、合同实例、hash、页／条与版次；同名附件重传必须生成新版本；M007 中实际定位，不以模型推测补页；F NOTAPPLICABLE；缺件 NEEDSMATERIAL；不可读 UNREADABLE；归错案／版次矛盾 CONFLICT。下一：负责人／材料管理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "横向科研实质与拟技术合同类型",
          "requirement": "P1/P2；T＝含拟学校承接研究／技术服务；F＝权威确定为纵向、纯采购或一般合同；U＝混合技术／劳务不明；SRC-005/012/013；F018–F021；M001/M007/M008；对照合同当事义务、技术问题及方法是否能在 C/B 层定位，按通用法区分开发、咨询、服务仅作线索；法定技术合同登记分类由外部机关，校内归口另核；F NOTAPPLICABLE 并路由 T03-T01/02、T04-T03、T07-T02；T 内容可定位 PASSFACT（只表明草案载明）；U NEEDSHUMANDECISION。下一：科研归口／合同法务",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "多方任务责任和校内主责",
          "requirement": "P1–P3；T＝多方合作／跨单位；F＝单一明确主体；U＝主责单位或合作法律关系不明；SRC-005/012；F008,F020,F022；M002/M007/M008；逐方对照名单、任务与交付责任，定位合同条及附件，校内主责归口按正式制度确认；可核对应关系不自动判断治理结构合理；F NOTAPPLICABLE；文本一致 PASSFACT；分工矛盾 CONFLICT；主审归口政策未知 POLICYUNCONFIRMED。下一：双方起草人／科研归口",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R010",
          "title": "技术目标与研究方法对应",
          "requirement": "P1/P2；T＝拟研发或技术服务；F＝已路由非科研；U＝技术任务性质不明；SRC-012 第 845/851 条及技术合同章；F021,F023；M007/M008；比较合同技术标的与任务书技术路线、目标是否同一问题，保留段落和技术附件版次；方案科学可行性不在机器可判范围，涉密状态先受 R014；目标／方法可相互定位 PASSFACT；缺所引用附件 NEEDSMATERIAL；实质冲突 CONFLICT；可行性 NEEDSHUMANDECISION。下一：项目组／科研专家",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R011",
          "title": "进度、成果、验收一致性",
          "requirement": "P1–P2；T＝存在交付与验收约定；F＝P0 无合同；U＝时间／验收表达不可区分；SRC-012；F024–F026；M007/M008；对照交付时间、成果数量及验收方式是否跨合同主从文本一致；日期按实际历法和约定条件比较，不预设学校统一时长／量化合格值；一致事实 PASSFACT；应有内容但缺 NEEDSMATERIAL；期限／指标冲突 CONFLICT；可接受性 NEEDSHUMANDECISION。下一：项目组／科研归口",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R012",
          "title": "合同价款与分期支付算术",
          "requirement": "P1/P2；T＝草案列金额／付款；F＝尚无草案；U＝含税／币种／计价基准不明；SRC-005/012；F027–F028；M007；比较大小写金额、币种、分项加总及支付里程碑（同一税口径）；合同价款不等同到账、开票或学校管理费，不使用 SRC-014 专项 500 万门槛；对齐 PASSFACT；数值矛盾 CONFLICT；金额字段残缺 NEEDSMATERIAL；商业可接受性 NEEDSHUMANDECISION。下一：起草方／合同管理",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "背景 IP 与拟成果权属",
          "requirement": "P1–P3；T＝合同含既有 IP／许可处分或新成果权属；F＝经核无此条款触发（新成果约定本身仍核文本）；U＝产权／权利范围不明；SRC-005/012；F029–F030,F042；M007/M009/M019；比对合同 IP 条款、权利号、权利主体与 G06 或权威登记 A/B，按有效期和合同版本引用；仅文本一致不代表学校同意处分；无背景 IP 支线 NOTAPPLICABLE；权源匹配的事实 PASSFACT；不匹配 CONFLICT；是否应处置或权属合法性 NEEDSHUMANDECISION。下一：成果/IP 权威部门",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "保密／受限资料安全分流",
          "requirement": "P0–P5 的内容解析前；T＝标识涉密、受限或具有风险线索；F＝受权渠道核定可作普通处理；U＝权限或保密分类不明；SRC-009/013 第 21 条；F023,F031,F044；M007/M010；先由校方保密专责可信元数据 A 判断处理通道，普通 AI 不接触涉密全文；校本涉密办法仅目录已见，不能自动判定密级或“已解密”；T 或 U 只给 NEEDSHUMANDECISION／POLICYUNCONFIRMED 并停止普通解析；F 才继续其他 R；状态来源失联 SOURCEUNAVAILABLE。下一：校保密工作专责",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "下游采购／外协的条件引用",
          "requirement": "P1–P3；T＝主合同引出学校采购或下游科研外协；F＝无独立采购／外协法律关系；U＝混合合同边界不清；SRC-005/010；F018,F020,F032,F042；M007/M011/M019；主合同的学校承接任务仍归 T03；对采购 T04／科研外协只读取其真实 Owner 决定引用、案号及效力；SRC-010 外协材料表不自动要求主合同提交；F NOTAPPLICABLE；正确关联 PASSFACT（引用事实）；错合同 CONFLICT；审批是否前置未知 POLICYUNCONFIRMED。下一：采购／外协归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "项目负责人科研责任承诺",
          "requirement": "P3／经费办理触发；T＝当前适用要求负责人作科研责任承诺；F＝尚未到该业务节点；U＝现行具体表单或触发范围不明；SRC-007 第 1 条；F011；M002/M004；核有权承诺人、项目 ID、承诺时间及可信记录 A/B；2024 经费办法不证明所有 P1 合同必须先有承诺章；F NOTAPPLICABLE；有效记录存在 PASSFACT；触发而尚无记录 NEEDSMATERIAL；范围未证 POLICYUNCONFIRMED。下一：负责人／科研经费归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "所在单位与科研归口初审",
          "requirement": "P3；T＝校本当前流程要求单位／科研审签；F＝P1/P2 尚未走审签；U＝是否必经、实际签发者权限不明；SRC-002/003/005/006；F033,F036；M012/M001；对照可信校内审批事件 A：审签者、权限、案卷、所审合同哈希、撤销有效期；旧流程不可替换当期授权；缺现行校本程序先停止硬判；F NOTAPPLICABLE；有事件且版本匹配仅事实 PASSFACT；错签发者/版本 CONFLICT；制度未核 POLICYUNCONFIRMED。下一：所属单位／科研归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "专家／法务有权前置审查",
          "requirement": "P3；T＝当期有效校规及合同风险触发专门审查；F＝尚在起草或经权威认定不触发；U＝审查门槛／角色不明；SRC-005/006/012；F034,F042；M013/M019；A/B 层意见核专家／法务真实身份、审查事项、当前合同版本及撤销状态；AI 风险提示≠法务意见，金额触发线不得猜；F NOTAPPLICABLE；可信意见存在 PASSFACT（仅证已出具）；错版 CONFLICT；是否强制未知 POLICYUNCONFIRMED。下一：法务／专业评审",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "校内批准与对外签约授权",
          "requirement": "P5；T＝拟由学校有权人决定或签署；F＝仅 P0–P4 事实预审；U＝授权公告／变更名单无法核；SRC-005/006/008；F035–F036,F043；M014/M012；A 层真实审批决策 ID、批准角色及其权能、合同版本哈希和当日有效授权；2026 公告目前只见目录；本 R 不签发批准、只验证来源；F NOTAPPLICABLE；已核真实批准存在仅 PASSFACT（“决定记录存在且匹配”，不等同 AI 批准）；权能未核 POLICYUNCONFIRMED；错版 CONFLICT。下一：校合同有权审批人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "正式签约文本与批准版本关联",
          "requirement": "P5/P6；T＝已有签署并需验证；F＝未到签约；U＝正式文本真实性／生效条件不明；SRC-005/012；F015,F035–F037,F043–F044；M006/M014/M015；将签署原件 B、各方签署者权限 A/B、学校批准对象 A 与合同全文哈希及签署日期匹配；扫描件签名图片不是密码学验签或法律生效结论；F NOTAPPLICABLE；事实匹配 PASSFACT；签约后版本不符 CONFLICT；合法生效效力 NEEDSHUMANDECISION。下一：签约管理／学校法务",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "技术合同登记真实性",
          "requirement": "P6；T＝确已向外部登记机构申报／登记；F＝签前或无登记事项；U＝登记机构状态未知；SRC-013 第 10–16 条；F038；M015/M016；仅查询登记机构 A 的登记号、合同主体、技术合同版本、撤销／变更与复核效力；登记证不是校内合同审批，登记期限不能套用于 P1；F NOTAPPLICABLE；有效登记事实 PASSFACT；错合同 CONFLICT；机构无法连通 SOURCEUNAVAILABLE。下一：登记机构及其复核机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "后续到款与开票权威记录",
          "requirement": "P6；T＝实际发生到款／开票；F＝签前或无资金事件；U＝财务记录来源不明；SRC-007/011；F027–F028,F039；M007/M017；比较财务系统 A 的票据／收入凭证合同引用、时间及冲销状态；与草案拟付款额仅做差异提示，不自动认定违约、预算通过、可报销；F NOTAPPLICABLE；真实关联 PASSFACT；源断 SOURCEUNAVAILABLE；不同合同 CONFLICT。下一：财务／科研经费管理员",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "补件、合同改版与影响项失效",
          "requirement": "P2/P4/P7；T＝草案或权威材料源有新版本；F＝hash/来源无变化且版本仍有效；U＝来源 hash／变更内容不可得；SRC-005/012；F017,F040,F043–F044；M007/M008/M018；比较 old/new sourceVersion+hash+sourceLocator 及 F 依赖集；F 为真亦要输出当前版的有效核验，旧 R 只能历史保存；按 11.2 的影响图定向重跑，不让旧批准跟随新稿；无改动事实 PASSFACT；版次矛盾 CONFLICT；新件不清 UNREADABLE；无法比对 SOURCEUNAVAILABLE；实质改动送责任人重审。下一：发起人／原审批 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "签前撤回、重提与复核意愿",
          "requirement": "P4/P7；T＝发生撤回／复核请求；F＝没有请求；U＝申请人资格、已签约或处理权限不明；SRC-002/005/006/013；F002,F037,F040–F041；M001/M015/M018；可信事件 A 区分 REQUESTED 与 DECIDED；以申请时点判断签前或签后，签后不自动解除；校内申诉渠道及期限仍未核，外部登记复核只归 SRC-013；F NOTAPPLICABLE；请求被记录 PASSFACT（仅提交事实）；越权修改 CONFLICT；能否撤销／复核 POLICYUNCONFIRMED+人工。下一：原有权审核人／法务／登记机构（分流）",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "跨 G50/S/T 已有权威决定引用",
          "requirement": "P3/P5/P7；T＝IP、采购、法审、财务等邻接决定实际相关；F＝不存在相邻独立事项；U＝Owner/键值／引用效力不明；SRC-005/007/009/010；F030,F032,F034,F042；M009/M011/M013/M019；必须验证源模板、源案、issuer、权限、业务对象、材料版本、决定撤销状态；只读取其有权结论，不将其复制为 T03-T03 签发状态。G50 精确技术 ID 待实际 catalog 核实；F NOTAPPLICABLE；引用吻合 PASSFACT；冲突 CONFLICT；源失联 SOURCEUNAVAILABLE；精确路由未核 POLICYUNCONFIRMED。下一：对应 G06/G07/T04/T07 Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "中石油平台特殊投标前置",
          "requirement": "P0，衔接 P1；T＝确为 SRC-015 的该类平台账户／投标经办；F＝普通横向合同；U＝平台账户用途未明；SRC-015；F010,F018,F044；M001/M020；按特定流程核投标承诺、账户借用登记的真实经办与时序，后续保证金回单只在资金事件发生时取；不得套到普通合同，也不代表获科研合同批准；F NOTAPPLICABLE；投标手续事实相符 PASSFACT；应有承诺未产生 NEEDSMATERIAL；系统失联 SOURCEUNAVAILABLE。下一：科发院投标业务／财务",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "stage-p0",
      "name": "意向／投标准备",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p1",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p1",
      "name": "起草／登记意图",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p2",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p2",
      "name": "事实初核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p3",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p3",
      "name": "条件性部门前置",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p4",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p4",
      "name": "补件／修订／签前撤回或复核申请",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p5",
      "workflowOwner": "local",
      "returnToStageId": "stage-p2"
    },
    {
      "id": "stage-p5",
      "name": "有权人工决定／签署",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p6",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p6",
      "name": "外部登记与经费事件",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "stage-p7",
      "workflowOwner": "local"
    },
    {
      "id": "stage-p7",
      "name": "履约、合同变更或争议",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "criterion-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-checklist",
      "kind": "supplement-list",
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
  "templateId": "T03-T03",
  "name": "横向科研合同立项与研究合同内容审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T03-T03.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T03-T03.md",
  "sourceDocumentSha256": "85e3a2b66ec72c5cfe1610176378cf93395a720de76b2111c912770956a08393",
  "sourceDocumentBytes": 118808,
  "officialSchoolTemplate": false,
  "researchEvidenceStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "authoringStatus": "ROUND3_DRAFT",
  "criteria": [
    {
      "sectionId": "review-rules",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R003",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R004",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R005",
      "srcIds": [
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R006",
      "srcIds": [
        "SRC-005",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R008",
      "srcIds": [
        "SRC-005",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R009",
      "srcIds": [
        "SRC-005",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R010",
      "srcIds": [
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R011",
      "srcIds": [
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R012",
      "srcIds": [
        "SRC-005",
        "SRC-012",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R013",
      "srcIds": [
        "SRC-005",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R014",
      "srcIds": [
        "SRC-009",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R015",
      "srcIds": [
        "SRC-005",
        "SRC-010"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R016",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R017",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R018",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R019",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R020",
      "srcIds": [
        "SRC-005",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R021",
      "srcIds": [
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R022",
      "srcIds": [
        "SRC-007",
        "SRC-011"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R023",
      "srcIds": [
        "SRC-005",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R024",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-006",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R025",
      "srcIds": [
        "SRC-005",
        "SRC-007",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "VERIFIED"
    },
    {
      "sectionId": "review-rules",
      "criterionId": "R026",
      "srcIds": [
        "SRC-015"
      ],
      "evidenceStatus": "VERIFIED"
    }
  ]
} as const

export { templateVersion as template }
export default templateVersion
