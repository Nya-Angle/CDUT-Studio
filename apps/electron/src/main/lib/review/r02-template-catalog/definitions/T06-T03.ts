// Generated from the reviewed R02 research document. This is not a school-issued template.
import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "T06-T03",
  "version": 1,
  "schemaVersion": 2,
  "name": "研究生导师招生指标申请与分配材料审核",
  "description": "研究生导师招生指标申请与分配材料审核。本地研究模板 · 非校方正式模板；校本政策证据为部分核实，未知条件只生成事实核验和人工复核建议。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 研究稿用于本地辅助审查，不是校方正式模板、政策版本或授权决定。当前政策证据状态 PARTIAL；不得据此自动批准或拒绝。",
  "objectType": "person",
  "displayName": {
    "template": "研究生导师招生指标申请与分配材料审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "caseId：UUID／Case",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F001；caseId：UUID／Case；建案起全程；后端案卷生成；CaseAggregate不可由用户任意覆盖；内；N：内部建案失败，禁止孤立结论"
    },
    {
      "key": "F002",
      "label": "admissionYear：年／Plan",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F002；admissionYear：年／Plan；P0起；批次通知、校方计划；M001/M002，SRC-002/013；公；S：等待当年计划，不猜系统年"
    },
    {
      "key": "F003",
      "label": "batchId：文本/权威ID／Plan",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F003；batchId：文本/权威ID／Plan；P0起；实际招生或指标受理批次；M001/M002；内；P：本案是否有导师指标批次待核"
    },
    {
      "key": "F004",
      "label": "situationCode：枚举A–L／Case",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F004；situationCode：枚举A–L／Case；P1、PX；真实申请动作/经办选择，关联3.2；内；N：不能判定路由则待分案"
    },
    {
      "key": "F005",
      "label": "actorId：认证主体ID／Actor",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F005；actorId：认证主体ID／Actor；全程写动作；Host/Main可信登录及审计日志；非附件；个；S：未认证不能提交/签批"
    },
    {
      "key": "F006",
      "label": "actingCapacity：导师/学院经办/代理及授权范围／Actor",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F006；actingCapacity：导师/学院经办/代理及授权范围／Actor；P1/各操作；IAM/岗位授权或正式委托；M004/M021；限；H：没有授权不得代办"
    },
    {
      "key": "F007",
      "label": "tutorId：教师权威标识／Tutor",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F007；tutorId：教师权威标识／Tutor；P1起；学校人事/导师主数据；M004；个；S：姓名相似不能替代ID匹配"
    },
    {
      "key": "F008",
      "label": "tutorDisplayName：文本／Tutor",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F008；tutorDisplayName：文本／Tutor；P1起；同F007，显示及人工核对；M004；个；S：只能作未验证显示，禁止按名合并"
    },
    {
      "key": "F009",
      "label": "collegeId：机构ID／Tutor/Plan",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F009；collegeId：机构ID／Tutor/Plan；P0起；学校组织机构与学位点归属；M002/M004；内；S/C：转隶冲突请机构Owner核"
    },
    {
      "key": "F010",
      "label": "disciplineCode：学科专业/学位点代码／Plan",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F010；disciplineCode：学科专业/学位点代码／Plan；P0起；本年度招生专业目录、学位授权台账；M001/M002；内；S：不能用自由文本归并学位点"
    },
    {
      "key": "F011",
      "label": "degreeLevel：硕士/博士枚举／Plan",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F011；degreeLevel：硕士/博士枚举／Plan；P0起；学校下达计划及年度资格决定；M002/M005；内；N：缺层次不进入计额"
    },
    {
      "key": "F012",
      "label": "degreeType：学术/专业学位枚举／Plan",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F012；degreeType：学术/专业学位枚举／Plan；P0起；2026章程和本年度计划；M001/M002，SRC-002/013；内；S：计划维度不明暂停合计"
    },
    {
      "key": "F013",
      "label": "studyMode：全日制/非全日制/另有规定／Plan",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F013；studyMode：全日制/非全日制/另有规定／Plan；P0起；当年招生章程及计划；M001/M002，SRC-002/013；内；S：保留未知不默认全日制"
    },
    {
      "key": "F014",
      "label": "planCategory：普通/专项及子类／Plan",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F014；planCategory：普通/专项及子类／Plan；P0起；具体下达和专项公告；M001/M002/M008；内；P：未获专项依据不能推断可申请"
    },
    {
      "key": "F015",
      "label": "planSourceRef：原始下达文号/版本／Plan",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F015；planSourceRef：原始下达文号/版本／Plan；P0起；学校归口部门的下达/更新；M002；限；S：仅有招生章程不足以确认最终额度"
    },
    {
      "key": "F016",
      "label": "unitPlanAmount：非负整数或未知／Plan",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F016；unitPlanAmount：非负整数或未知／Plan；P0、P3；学校给学院/学位点/专项的有效计划；M002；限；S：不靠章程拟数计算人均值"
    },
    {
      "key": "F017",
      "label": "requestedAmount：非负整数或未知／Demand",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F017；requestedAmount：非负整数或未知／Demand；P1；导师真实需求或学院汇总初稿；M006；内；N：若实际按学院直接分配，可NA"
    },
    {
      "key": "F018",
      "label": "existingAllocatedAmount：非负整数或未知／Quota",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F018；existingAllocatedAmount：非负整数或未知／Quota；P2/调整；已生效指标台账/决定；M013；限；S：不把草案当已分配"
    },
    {
      "key": "F019",
      "label": "occupiedAmount：非负整数或未知／Quota",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F019；occupiedAmount：非负整数或未知／Quota；P5或已占额情形；招生Owner正式录取/占额流水；M010；限；S：不能把未知置0"
    },
    {
      "key": "F020",
      "label": "annualEligibilityStatus：有效/暂停/未知等／Tutor",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F020；annualEligibilityStatus：有效/暂停/未知等／Tutor；P1起；本年度有权招生资格决定；M005；限；S：岗位有效不能补为可招生"
    },
    {
      "key": "F021",
      "label": "eligibilityDecisionRef：决议/生效期引用／Tutor",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F021；eligibilityDecisionRef：决议/生效期引用／Tutor；P1起；T06相邻招生资格Owner签发结果；M005；限；S：不从申请人自证推定"
    },
    {
      "key": "F022",
      "label": "appointmentDecisionRef：岗位/指导范围引用／Tutor",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F022；appointmentDecisionRef：岗位/指导范围引用／Tutor；P1起；岗位管理Owner有效决定；M004，SRC-001；个；S：待校方核查岗位而非硬驳回"
    },
    {
      "key": "F023",
      "label": "restrictionStatus：无/扣减/暂停/不明／Tutor",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F023；restrictionStatus：无/扣减/暂停/不明／Tutor；P2，若有处理；生效质量/招生资格处罚记录；M007；限；S/P：未有权核“无”不可默认"
    },
    {
      "key": "F024",
      "label": "restrictionDecisionRef：处理/申诉/撤销版本／Decision",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F024；restrictionDecisionRef：处理/申诉/撤销版本／Decision；条件P2；质量/资格Owner正式决定；M007，SRC-004/010；限；P/H：2023旧算法不得直接运算"
    },
    {
      "key": "F025",
      "label": "qualityConclusionRef：培养质量结果引用／Evidence",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F025；qualityConclusionRef：培养质量结果引用／Evidence；条件P2；相邻质量Owner已核结论；M007；不得读盲审专家身份；限；S：只等权威结论，不索取涉密明细"
    },
    {
      "key": "F026",
      "label": "projectRef：项目编号/负责人／Evidence",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F026；projectRef：项目编号/负责人／Evidence；专项P1–P2；科研归口项目台账或项目批准书；M008；限；N/S：专项触发时补可信证据"
    },
    {
      "key": "F027",
      "label": "fundingFactRef：经费/经费状态引用／Evidence",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F027；fundingFactRef：经费/经费状态引用／Evidence；专项P2；有权项目/财务记录；M008；限；S/P：具体金额条件待政策，不上传完整财务账本"
    },
    {
      "key": "F028",
      "label": "teamMemberIds：教师ID集合／Demand",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F028；teamMemberIds：教师ID集合／Demand；团队P1；被核对的导师主数据与团队材料；M004/M009；个；N：需要明确归属；普通个人NA"
    },
    {
      "key": "F029",
      "label": "collaborationAuthorityRef：合作/双导师批复引用／Demand",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F029；collaborationAuthorityRef：合作/双导师批复引用／Demand；团队P2；学校/学院有权联合培养记录；M009；限；H：不能凭导师声明认定指标归属"
    },
    {
      "key": "F030",
      "label": "demandRationale：陈述／Demand",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F030；demandRationale：陈述／Demand；条件P1；本人/学院说明及佐证；M006；内；N：若校本办法要求才列必需，否者NA"
    },
    {
      "key": "F031",
      "label": "submittedAt：时间戳／Case",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F031；submittedAt：时间戳／Case；P1/PX；后端提交审计事件与受理回执；M006；内；S：不从文档修改日期推定"
    },
    {
      "key": "F032",
      "label": "draftSchemeVersion：文档ID/版本／Quota",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F032；draftSchemeVersion：文档ID/版本／Quota；P3；学院拟议方案；M011；限；NA：P1绝不能提前要求"
    },
    {
      "key": "F033",
      "label": "proposedAmount：非负整数或未知／Quota",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F033；proposedAmount：非负整数或未知／Quota；P3；学院授权拟议方案；M011；限；H：AI不给出行政决定数"
    },
    {
      "key": "F034",
      "label": "formalDecisionRef：文号/签发者/生效点／Decision",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F034；formalDecisionRef：文号/签发者/生效点／Decision；P4及之后；有权批复、签章和服务端核验；M013；限；H：缺则只是预审或拟分配"
    },
    {
      "key": "F035",
      "label": "effectiveQuota：非负整数或未知／Quota",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F035；effectiveQuota：非负整数或未知／Quota；P4及之后；正式有效决定/校内名额台账；M013；限；H：不能由F033或模型输出赋值"
    },
    {
      "key": "F036",
      "label": "appealRef：请求编号/理由／Remedy",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F036；appealRef：请求编号/理由／Remedy；异议PX；提交人认证记录与异议材料；M017；限；N：J情形缺则待补，其他NA"
    },
    {
      "key": "F037",
      "label": "withdrawalRef：请求编号/状态／Remedy",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F037；withdrawalRef：请求编号/状态／Remedy；撤回PX；真实提出人/受理人及决定；M016；限；N/H：请求不等于获准撤回"
    },
    {
      "key": "F038",
      "label": "adjustmentDelta：整数或未知／Demand",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F038；adjustmentDelta：整数或未知／Demand；计划调整P5；调整说明与新旧计划；M015/M002；限；N/H：无正式调整仍以旧额度有效"
    },
    {
      "key": "F039",
      "label": "effectiveAt：时间及适用范围／Decision",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F039；effectiveAt：时间及适用范围／Decision；P4后；正式生效决定/更正决定；M013/M018；限；S/H：日期未知不推断已生效"
    },
    {
      "key": "F040",
      "label": "policyVersionRef：文件号/效力区间／Plan",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F040；policyVersionRef：文件号/效力区间／Plan；P0起；当前校本统一/学院办法；M003/M020；限；P：不套用SRC-004/012/015旧阈值"
    },
    {
      "key": "F041",
      "label": "actorAuthorityRef：权限证明/有效期／Actor",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F041；actorAuthorityRef：权限证明/有效期／Actor；各写操作；后端授权/IAM或有效委托；M021；限；H：没有授权只能只读或保存本人草稿"
    },
    {
      "key": "F042",
      "label": "evidenceVersionDigest：槽版本+hash映射／Evidence",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F042；evidenceVersionDigest：槽版本+hash映射／Evidence；每次提交/重审；服务端材料归属与不可变版本索引；M001–M023；限；S：丢版本则旧结论冻结待核，不继承通过"
    },
    {
      "key": "F043",
      "label": "doctorLimitCategory：普通/经正式认定的院士等国家和省部级高水平师资/待核／Tutor×Year",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F043；doctorLimitCategory：普通/经正式认定的院士等国家和省部级高水平师资/待核／Tutor×Year；P3按博士普通名额分账时；经人事与招生主管联合确认的师资类别及适用年度；M022，SRC-001第11条；限；S/P：不由头衔文字或简历猜测3名例外"
    },
    {
      "key": "F044",
      "label": "countedGeneralDoctoralAdmissions：整数或未知／Quota×Tutor×Year",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F044；countedGeneralDoctoralAdmissions：整数或未知／Quota×Tutor×Year；P3拟议、P4复核；同年度已核普通博士拟分配和正式占额去重汇总；M011/M013/M023；限；S/C：不得只取单学院一行；专项不混数"
    },
    {
      "key": "F045",
      "label": "firstMasterAdmissionStatus：首次/非首次/未知／Tutor×Level",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F045；firstMasterAdmissionStatus：首次/非首次/未知／Tutor×Level；P3拟议硕士上限时；招生主管历史招收记录；M022，SRC-001第12条；个；S：无历史记录不得默认“首次”"
    },
    {
      "key": "F046",
      "label": "countedGeneralMasterAdmissions：整数或未知／Quota×Tutor×Year",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F046；countedGeneralMasterAdmissions：整数或未知／Quota×Tutor×Year；P3拟议、P4复核；本年度普通硕士分配/占额跨学院及学位类型归集；M011/M013/M023；限；S/C：多学科/不同计划须去重汇总"
    },
    {
      "key": "F047",
      "label": "specialExclusionAuthorityRef：计划类别、专项批准文号及豁免范围／Plan",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F047；specialExclusionAuthorityRef：计划类别、专项批准文号及豁免范围／Plan；专项P2、P3限额比较；学校招生计划Owner对科研项目等专项性质的有效认定；M002/M008/M023，SRC-001第13条；限；P/H：名称带“专项”或导师自述不自动豁免普通限额"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "当期招生背景/招生归口部门",
      "purpose": "M001；当期招生背景/招生归口部门；R 2026硕/博章程、招生目录、专项公告；当P0；学校有效统一公告及存证页；F002/003/010–014；SRC-002/013；按招生年度/批次；失联→SOURCE_UNAVAILABLE；截断→UNREADABLE",
      "requiredElements": [
        "当期招生背景/招生归口部门",
        "R 2026硕/博章程、招生目录、专项公告；当P0",
        "学校有效统一公告及存证页",
        "F002/003/010–014；SRC-002/013；按招生年度/批次",
        "失联→SOURCE_UNAVAILABLE；截断→UNREADABLE"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "实际下达额度及变更/招生计划Owner",
      "purpose": "M002；实际下达额度及变更/招生计划Owner；R 校→学院→学位点/专项的有效计划文号与调整版本；当P0，调整后新版；招生归口部门认可的正式下达台账/盖章件；F002/003/009–016；SRC-002/013/014；按年度、学院、计划类别；缺来源→SOURCE_UNAVAILABLE，不得把M001拟数当下达",
      "requiredElements": [
        "实际下达额度及变更/招生计划Owner",
        "R 校→学院→学位点/专项的有效计划文号与调整版本；当P0，调整后新版",
        "招生归口部门认可的正式下达台账/盖章件",
        "F002/003/009–016；SRC-002/013/014；按年度、学院、计划类别",
        "缺来源→SOURCE_UNAVAILABLE，不得把M001拟数当下达"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "校/学院分配制度/政策持有人",
      "purpose": "M003；校/学院分配制度/政策持有人；R 当年度适用的导师指标确定办法和授权表；当P0（当前缺原文）；主管部门确认的生效制度及废止链；F003/014/040；SRC-006/012；按单位/学段/年度；POLICY_UNCONFIRMED，不自动评分或签批",
      "requiredElements": [
        "校/学院分配制度/政策持有人",
        "R 当年度适用的导师指标确定办法和授权表；当P0（当前缺原文）",
        "主管部门确认的生效制度及废止链",
        "F003/014/040；SRC-006/012；按单位/学段/年度",
        "POLICY_UNCONFIRMED，不自动评分或签批"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M004",
      "name": "导师真实身份、岗位和代理关系/人事及导师管理Owner",
      "purpose": "M004；导师真实身份、岗位和代理关系/人事及导师管理Owner；R 校内教师ID、岗位有效范围及单位归属；当P1；经过校内人事/导师管理部门核验的有效决议摘录；F005–009/022/028；SRC-001；按导师ID/有效期；来源失联→S；扫描证书不可读→UNREADABLE；不得仅凭姓名",
      "requiredElements": [
        "导师真实身份、岗位和代理关系/人事及导师管理Owner",
        "R 校内教师ID、岗位有效范围及单位归属；当P1",
        "经过校内人事/导师管理部门核验的有效决议摘录",
        "F005–009/022/028；SRC-001；按导师ID/有效期",
        "来源失联→S；扫描证书不可读→UNREADABLE；不得仅凭姓名"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "当年是否具有相应层次招生资格/招生资格Owner",
      "purpose": "M005；当年是否具有相应层次招生资格/招生资格Owner；R 当年度资格认定/暂停或恢复的有效结论；当P1；有签发者与生效区间的学校正式证明；F011/020/021；SRC-001/003（2025仅背景）；逐导师/年度/层次；缺→S/H；不由岗位证书或导师声明替代",
      "requiredElements": [
        "当年是否具有相应层次招生资格/招生资格Owner",
        "R 当年度资格认定/暂停或恢复的有效结论；当P1",
        "有签发者与生效区间的学校正式证明",
        "F011/020/021；SRC-001/003（2025仅背景）；逐导师/年度/层次",
        "缺→S/H；不由岗位证书或导师声明替代"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "名额需求/导师或有权学院经办",
      "purpose": "M006；名额需求/导师或有权学院经办；D/R 个人需求书、学院汇总表或经核实的系统报送记录；当P1（若当年按直接分配，可由学院生成）；经受理部门认可的报送清单/回执，不强制统一申请表；F004/017/030/031；SRC-006/007/012；按申报人+导师+批次；N；无法确认是否必需标P，不能制造校本格式",
      "requiredElements": [
        "名额需求/导师或有权学院经办",
        "D/R 个人需求书、学院汇总表或经核实的系统报送记录；当P1（若当年按直接分配，可由学院生成）",
        "经受理部门认可的报送清单/回执，不强制统一申请表",
        "F004/017/030/031；SRC-006/007/012；按申报人+导师+批次",
        "N；无法确认是否必需标P，不能制造校本格式"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "既有限招/停招及学位质量有效处理/质量或资格Owner",
      "purpose": "M007；既有限招/停招及学位质量有效处理/质量或资格Owner；R 生效扣减/暂停/恢复/撤销处理；条P2，涉及处理才需；决定部门出具的可核验生效处理摘录；F023–025；SRC-004/010；按导师、层次、年、决定版本；S/P/H；不能从论文评阅原稿自行处罚",
      "requiredElements": [
        "既有限招/停招及学位质量有效处理/质量或资格Owner",
        "R 生效扣减/暂停/恢复/撤销处理；条P2，涉及处理才需",
        "决定部门出具的可核验生效处理摘录",
        "F023–025；SRC-004/010；按导师、层次、年、决定版本",
        "S/P/H；不能从论文评阅原稿自行处罚"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "科研经费/项目专项条件/科研财务Owner",
      "purpose": "M008；科研经费/项目专项条件/科研财务Owner；R/D 项目批准、经费状态和专项适用性证据；条P1–P2，专项触发；科研/财务归口的项目查询结果或有效证明；F014/026/027；SRC-002/011；项目ID、计划、有效期；N/S/P；不可索取不必要的完整财务流水",
      "requiredElements": [
        "科研经费/项目专项条件/科研财务Owner",
        "R/D 项目批准、经费状态和专项适用性证据；条P1–P2，专项触发",
        "科研/财务归口的项目查询结果或有效证明",
        "F014/026/027；SRC-002/011；项目ID、计划、有效期",
        "N/S/P；不可索取不必要的完整财务流水"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "跨学院/双导师团队依据/主办及合作单位",
      "purpose": "M009；跨学院/双导师团队依据/主办及合作单位；R/D 联合培养或团队授权、导师名单、名额归属说明；条P1–P2；同权限联合签署/正式批复；F009/028/029；SRC-002/013；多方/层次/计划归属；N/H；单方声明不等于共同确认",
      "requiredElements": [
        "跨学院/双导师团队依据/主办及合作单位",
        "R/D 联合培养或团队授权、导师名单、名额归属说明；条P1–P2",
        "同权限联合签署/正式批复",
        "F009/028/029；SRC-002/013；多方/层次/计划归属",
        "N/H；单方声明不等于共同确认"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "已录取与指标占用/招生录取Owner",
      "purpose": "M010；已录取与指标占用/招生录取Owner；R 生效录取占额/调剂更换导师流水；后P5，若申请为已有占额调整则当；招生归口部门核验的占额台账快照；F018/019/038；SRC-003/009/014；按学生权威ID但对本案最小化展示；S/C；未知不可算0，不把拟录取自动当最终占额",
      "requiredElements": [
        "已录取与指标占用/招生录取Owner",
        "R 生效录取占额/调剂更换导师流水；后P5，若申请为已有占额调整则当",
        "招生归口部门核验的占额台账快照",
        "F018/019/038；SRC-003/009/014；按学生权威ID但对本案最小化展示",
        "S/C；未知不可算0，不把拟录取自动当最终占额"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "学院拟分配额度及说明/学院有权组织",
      "purpose": "M011；学院拟分配额度及说明/学院有权组织；D/R 拟分配方案、排序依据；后P3；有学院责任主体可验证的拟议记录；F032/033；SRC-006/012；方案版本、每导师、每计划；未形成→NA；如已到P3则N/H；不能当正式指标",
      "requiredElements": [
        "学院拟分配额度及说明/学院有权组织",
        "D/R 拟分配方案、排序依据；后P3",
        "有学院责任主体可验证的拟议记录",
        "F032/033；SRC-006/012；方案版本、每导师、每计划",
        "未形成→NA；如已到P3则N/H；不能当正式指标"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "会议/公示/征询记录/相应有权组织",
      "purpose": "M012；会议/公示/征询记录/相应有权组织；R/D 依现行制度规定才形成的会议意见、纪要及公示异议；后P3–P4；同程序授权的正式记录；F032/040/041；SRC-006/012；机构、会议时间、签发人；现行必经性待核→P；不得P1强制上传",
      "requiredElements": [
        "会议/公示/征询记录/相应有权组织",
        "R/D 依现行制度规定才形成的会议意见、纪要及公示异议；后P3–P4",
        "同程序授权的正式记录",
        "F032/040/041；SRC-006/012；机构、会议时间、签发人",
        "现行必经性待核→P；不得P1强制上传"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "正式导师指标额度及变更决定/最终有权部门",
      "purpose": "M013；正式导师指标额度及变更决定/最终有权部门；R 生效批复、额度台账及其授权链；后P4，已分配核验则当；相同权限的正式签发件/可核校内额度记录；F018/034/035/039；SRC-002/013；年度/导师/类别/版本；H/S；AI预审不得生成代用批复",
      "requiredElements": [
        "正式导师指标额度及变更决定/最终有权部门",
        "R 生效批复、额度台账及其授权链；后P4，已分配核验则当",
        "相同权限的正式签发件/可核校内额度记录",
        "F018/034/035/039；SRC-002/013；年度/导师/类别/版本",
        "H/S；AI预审不得生成代用批复"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "补正说明及替换证据/原持有人",
      "purpose": "M014；补正说明及替换证据/原持有人；D/R 退补回执、局部更正、新附件；条PX；同发行人新版来源或权威勘误；F006/017/031/042及被替换字段；依原槽SRC；N/UNREADABLE；旧槽留档，依赖旧结论失效",
      "requiredElements": [
        "补正说明及替换证据/原持有人",
        "D/R 退补回执、局部更正、新附件；条PX",
        "同发行人新版来源或权威勘误",
        "F006/017/031/042及被替换字段；依原槽SRC",
        "N/UNREADABLE；旧槽留档，依赖旧结论失效"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "追加/调减需求及原因/学院/学校计划Owner",
      "purpose": "M015；追加/调减需求及原因/学院/学校计划Owner；D/R 新旧计划比较、正式变更请求；条P5调整；有权调整方签发的变更申请记录；F015–019/038；SRC-002/013/014；关联原决定与新批次；N/P/H；未有正式新决定，额度不变",
      "requiredElements": [
        "追加/调减需求及原因/学院/学校计划Owner",
        "D/R 新旧计划比较、正式变更请求；条P5调整",
        "有权调整方签发的变更申请记录",
        "F015–019/038；SRC-002/013/014；关联原决定与新批次",
        "N/P/H；未有正式新决定，额度不变"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M016",
      "name": "撤回请求/认证发起人及受理者",
      "purpose": "M016；撤回请求/认证发起人及受理者；D/R 请求、理由、身份与受理回执；条PX撤回；同等可追责电子申请与回执；F005/006/037/041；SRC-007（经办职责有限）；关联原案版本；N/H；撤回是否生效待有权批准",
      "requiredElements": [
        "撤回请求/认证发起人及受理者",
        "D/R 请求、理由、身份与受理回执；条PX撤回",
        "同等可追责电子申请与回执",
        "F005/006/037/041；SRC-007（经办职责有限）；关联原案版本",
        "N/H；撤回是否生效待有权批准"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "异议申请/受影响导师或合法代表",
      "purpose": "M017；异议申请/受影响导师或合法代表；D/R 争议范围、具体理由与证据；条PX复核；被正式受理的异议回执；F005/006/036/041；SRC-011只涉及学生申诉，不能直接迁用；关联原方案/决定；N/P；不设猜测期限",
      "requiredElements": [
        "异议申请/受影响导师或合法代表",
        "D/R 争议范围、具体理由与证据；条PX复核",
        "被正式受理的异议回执",
        "F005/006/036/041；SRC-011只涉及学生申诉，不能直接迁用；关联原方案/决定",
        "N/P；不设猜测期限"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "复核结果或更正决定/受理复核机关",
      "purpose": "M018；复核结果或更正决定/受理复核机关；R 经有权机构审查后的复核/更正文本；后PX处理之后；真实复核机关签发的有效决议；F034/036/039；相关原案SRC；关联原决定版本；未形成→NA；形成后缺失→S/H",
      "requiredElements": [
        "复核结果或更正决定/受理复核机关",
        "R 经有权机构审查后的复核/更正文本；后PX处理之后",
        "真实复核机关签发的有效决议",
        "F034/036/039；相关原案SRC；关联原决定版本",
        "未形成→NA；形成后缺失→S/H"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "直博/硕博连读渠道已认可的占额依据/招生Owner",
      "purpose": "M019；直博/硕博连读渠道已认可的占额依据/招生Owner；R 当年实际录取结果及具体招生方式、导师关联；后P5，预留核验P1可NA；有权招生台账的最小字段摘录；F014/018/019；SRC-003/009/013；当年学生最小化去标识关联；S；学生报名回执不是录取占额决定",
      "requiredElements": [
        "直博/硕博连读渠道已认可的占额依据/招生Owner",
        "R 当年实际录取结果及具体招生方式、导师关联；后P5，预留核验P1可NA",
        "有权招生台账的最小字段摘录",
        "F014/018/019；SRC-003/009/013；当年学生最小化去标识关联",
        "S；学生报名回执不是录取占额决定"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "现行政策版本与旧版废止链/规章主管部门",
      "purpose": "M020；现行政策版本与旧版废止链/规章主管部门；R 2024后论文评阅制度修订及各院指标办法生效证明；条P0/P2涉及旧处理或阈值时；学校规章部门确认的现行制度全文与生效说明；F023/024/040；SRC-004/010/012/015；年度、政策覆盖领域；P；不能把2018限额或2023扣减直接设为R规则",
      "requiredElements": [
        "现行政策版本与旧版废止链/规章主管部门",
        "R 2024后论文评阅制度修订及各院指标办法生效证明；条P0/P2涉及旧处理或阈值时",
        "学校规章部门确认的现行制度全文与生效说明",
        "F023/024/040；SRC-004/010/012/015；年度、政策覆盖领域",
        "P；不能把2018限额或2023扣减直接设为R规则"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M021",
      "name": "真实经办/代理/审批权限/人事与校内IAM或授权方",
      "purpose": "M021；真实经办/代理/审批权限/人事与校内IAM或授权方；R 登录身份、岗位授权、委托权限和有效期；当任意代办或审批动作；经校内确认的代理委托/授权审批记录，不能仅自制委托书；F005/006/041；SRC-001/007；按操作者/单位/动作/期限；H/S；角色字段、签名图片、客户端actor不授信",
      "requiredElements": [
        "真实经办/代理/审批权限/人事与校内IAM或授权方",
        "R 登录身份、岗位授权、委托权限和有效期；当任意代办或审批动作",
        "经校内确认的代理委托/授权审批记录，不能仅自制委托书",
        "F005/006/041；SRC-001/007；按操作者/单位/动作/期限",
        "H/S；角色字段、签名图片、客户端actor不授信"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "导师高水平师资认定及硕士首次招收状态/人事与招生Owner",
      "purpose": "M022；导师高水平师资认定及硕士首次招收状态/人事与招生Owner；R 官方师资类别、历史硕士首招状态的最小必要摘录；条P3限招判断，不是P1必传；具有同等数据权属的认证/历史招生记录；F043/F045；SRC-001第11–12条；按导师ID、类别、有效年度/历史记录版本；校方源断→SOURCE_UNAVAILABLE，认定权限未知→POLICY_UNCONFIRMED，不索简历代替",
      "requiredElements": [
        "导师高水平师资认定及硕士首次招收状态/人事与招生Owner",
        "R 官方师资类别、历史硕士首招状态的最小必要摘录；条P3限招判断，不是P1必传",
        "具有同等数据权属的认证/历史招生记录",
        "F043/F045；SRC-001第11–12条；按导师ID、类别、有效年度/历史记录版本",
        "校方源断→SOURCE_UNAVAILABLE，认定权限未知→POLICY_UNCONFIRMED，不索简历代替"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "普通/科研专项跨院跨学位类型的同导师分账核对/学校招生计划Owner",
      "purpose": "M023；普通/科研专项跨院跨学位类型的同导师分账核对/学校招生计划Owner；R 本年度M002/M011/M013/M010派生的权威分账户清单；条P3–P5限招/专项排除判断；有权招生部门核定的同年度同导师计数台账；F043–F047；SRC-001第11–13条、SRC-002、SRC-017(仅类别背景)；每导师×年度×学段×专项ID×版本；汇总未形成→SOURCE_UNAVAILABLE；两个账户重复或归属冲突→CONFLICT；不能自行加总不相容类别",
      "requiredElements": [
        "普通/科研专项跨院跨学位类型的同导师分账核对/学校招生计划Owner",
        "R 本年度M002/M011/M013/M010派生的权威分账户清单；条P3–P5限招/专项排除判断",
        "有权招生部门核定的同年度同导师计数台账",
        "F043–F047；SRC-001第11–13条、SRC-002、SRC-017(仅类别背景)；每导师×年度×学段×专项ID×版本",
        "汇总未形成→SOURCE_UNAVAILABLE；两个账户重复或归属冲突→CONFLICT；不能自行加总不相容类别"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "rules-08-2",
      "name": "8.2 R001–R025连续事实规则",
      "description": "依据 T06-T03 原件第 08 节规则表；属于本地研究审查项，不等同学校正式政策规则。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "当期招生类别和层次",
          "requirement": "R001 当期招生类别和层次，P0；T=本案对应当年招生章程；F=非导师指标事项→NOT_APPLICABLE并移路由；U=年度/招生方式未知→核计划；SRC-002/013/014；F002/003/010–014；M001/M002；依当年正式章程/专业目录核学硕/专硕/学博/专博、全非全及专项标识；章程只提供类别和背景，不直接提供导师名额；M001不可读→UNREADABLE/招生院公告维护人；章程与业务批次无法匹配→CONFLICT/招生计划Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "学院/学位点有效计划与版本",
          "requirement": "R002 学院/学位点有效计划与版本，P0、P5调整；T=存在分配或调整批次；F=明确不属本案计划→NOT_APPLICABLE；U=批次归属不明→计划Owner；SRC-002/013/014；F002/003/009–016/038；M002/M001；对正式下达文号、归口单位、计划子账户、适用起止和更新链；有效M002优于章程M001拟数；新计划不得默默回写旧案；下达来源失联→SOURCE_UNAVAILABLE/学校招生计划Owner；两个有效版本冲突→CONFLICT/签发部门",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R003",
          "title": "当前分配制度、授权与旧版链",
          "requirement": "R003 当前分配制度、授权与旧版链，P0及涉及政策时；T=本案涉及导师级分配条件；F=仅核招生章程公开事实、不进行指标决定→NOT_APPLICABLE；U=学校/学院适用范围不明→政策Owner；SRC-001/004/006/010/012/015；F003/014/023/024/040；M003/M020；已知2024年第11–13条限招上位边界；其2026现行性、学院具体分配公式、适用单位和授权链分别核验；旧2018上限、2023论文扣减只作反例，不把未知评分阈值写死；原文/效力不明→POLICY_UNCONFIRMED/研究生院及学院规章Owner；同一范围有效规章相抵触→CONFLICT/签发部门",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R004",
          "title": "真实操作者及该动作权限",
          "requirement": "R004 真实操作者及该动作权限，P1/P3/P4/PX；T=提交、代办、撤回、复核或签发写动作；F=无写动作的公开只读核验→NOT_APPLICABLE；U=认证角色不明→身份Owner；SRC-001/007（仅职责背景）；F001/004–006/031/041；M021/M004；后端可信身份会话对照校内岗位/委托的操作种类、授权期间和被代理导师ID；不得信Renderer角色、上传签章图；IAM取不到→SOURCE_UNAVAILABLE/身份Owner；授权范围不足→NEEDS_HUMAN_DECISION/校内权限Owner；冒用主体→CONFLICT/安全经办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "导师权威ID、学院学科归属",
          "requirement": "R005 导师权威ID、学院学科归属，P1；T=案卷绑定导师；F=仅学院聚合不涉个人时个人段→NOT_APPLICABLE；U=教师ID/归属不明→人事Owner；SRC-001/007；F007–010/028；M004/M002/M009（团队时）；不按姓名模糊合并；核教师ID、隶属变动生效日与招生学科代码，学院与计划M002同一时点一致；同名异人/转隶冲突→CONFLICT/人事+学院；主数据失联→SOURCE_UNAVAILABLE/人事Owner",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R006",
          "title": "导师岗位资格记录存在及范围",
          "requirement": "R006 导师岗位资格记录存在及范围，P1；T=以导师身份参与分配；F=仅学院计划建档不涉及个人→NOT_APPLICABLE；U=岗位范围未知→导师管理Owner；SRC-001（岗位与招生资格分开）；F007/011/022；M004；核有权岗位决定及硕博指导范围、有效/退出日期；此R不授予年度招生资格；岗位决定取不到→SOURCE_UNAVAILABLE/导师岗位Owner；旧/新岗位决定冲突→CONFLICT/该Owner",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R007",
          "title": "当年度招生资格引用",
          "requirement": "R007 当年度招生资格引用，P1；T=导师拟占本年度某层次指标；F=尚是学校总计划且无具体导师→NOT_APPLICABLE；U=相应年度/层次资格未知→资格Owner；SRC-001/003（2025仅反例）；F002/007/011/020/021；M005/M004；只核T06相邻年度招生资格的有效签发结论ID与年份、层次、停招/恢复日期；岗位资格不得代替招生资格；权威资格记录失联→SOURCE_UNAVAILABLE/资格Owner；存在未解除停招且是否影响指标由现行政策定→NEEDS_HUMAN_DECISION/资格与指标Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "需求/学院汇总真实性与报送版本",
          "requirement": "R008 需求/学院汇总真实性与报送版本，P1；T=本批次经校本流程确认要个人申请或学院汇总；F=经现行制度确认按学院直接配置无需个人需求→个人M006段NOT_APPLICABLE；U=申报方式/截止未查→政策Owner；SRC-006/007/012（12正文缺）/016（外校反例）；F004/017/030/031；M006/M021；核本人/授权经办的请求、受理时间和导师/计划归属；只有年度通知明确后才核截止与必填项，不复用学生报名时间，也不迁入成都大学“增加人数申请表”；必需需求确实没交→NEEDS_MATERIAL/原发起人；必经性未知→POLICY_UNCONFIRMED/学院招生经办",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R009",
          "title": "不同层次/专项的子账户与重复申报",
          "requirement": "R009 不同层次/专项的子账户与重复申报，P1–P3；T=申请含额度或跨渠道预留；F=没有导师配额目标的计划总览→NOT_APPLICABLE；U=是否可相互占用未定→计划Owner；SRC-002/003(2025)/013；F009–019；M001/M002/M006/M019（P5才使用）；建年度+层次+学位类型+学习方式+专项+学院+导师键；在同一有效账户识别重复或跨账户混数，2025硕博连读只能作渠道线索；重复归属相抵触→CONFLICT/计划Owner；跨渠道折抵授权未知→POLICY_UNCONFIRMED/专项Owner",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R010",
          "title": "生效质量处罚/限招是否影响本案，条件P2",
          "requirement": "R010 生效质量处罚/限招是否影响本案，条件P2；T=权威记录表明有关处罚或扣减；F=权威部门确认本年本层次无生效处理→NOT_APPLICABLE；U=未查明有无处理→质量Owner；SRC-001/004/010/015(失效反例)；F007/011/023–025/040；M007/M020/M005；先核正式处理/撤销及对应导师、年度、层次，再要求现行政策；不据原始盲审、历史3次规则或2018限额自行扣人数；生效政策不明→POLICY_UNCONFIRMED/规章Owner；处罚有事实但额度影响待裁量→NEEDS_HUMAN_DECISION/有权质量+指标Owner",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R011",
          "title": "科研/经费专项项目事实，条件P1–P2",
          "requirement": "R011 科研/经费专项项目事实，条件P1–P2；T=专项且当年方案确实要求项目或经费；F=普通计划或专项不要求该事实→NOT_APPLICABLE；U=专项细则/门槛未知→专项政策Owner；SRC-002/005(2023项目背景)/011；F014/026/027；M008/M002；核同专项项目ID、负责人、经费状态与有效期，科研/财务Owner记录优于自制截图；金额阈值、加分权重待当期校本文件；校内项目源失联→SOURCE_UNAVAILABLE/科研财务Owner；阈值未知→POLICY_UNCONFIRMED/专项Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "跨院/团队指标主体及联合授权，条件P1–P2",
          "requirement": "R012 跨院/团队指标主体及联合授权，条件P1–P2；T=多导师、跨院或联合培养名额；F=单导师单院且无团队→NOT_APPLICABLE；U=多方真实归属不明→联合单位；SRC-001/002/013（仅招生形式背景）；F007/009/010/028/029/041；M009/M004/M021；逐人核ID、计划归属与联合签发机关；不能把“团队同意”解释为转移个人配额的批准；只有单方签署→CONFLICT/合作学院+计划Owner；授权类型未知→POLICY_UNCONFIRMED/学院规章Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "既往生效额度/原决定基准，已分配核验或调整P2/P5",
          "requirement": "R013 既往生效额度/原决定基准，已分配核验或调整P2/P5；T=本案引用前一生效额度；F=首次尚无先前额度且尚未P4→NOT_APPLICABLE；U=原决定是否有效未知→指标Owner；SRC-002/013（不直接证明个人额度）；F002/007/014/018/034/035/039；M013/M002；核原文号/签发者、时点及计划分账；2025批准书不可当2026新配额；旧案历史不得覆盖；原决定源失联→SOURCE_UNAVAILABLE/指标Owner；纸面“同意”无授权链→NEEDS_HUMAN_DECISION/审批权限Owner",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R014",
          "title": "学院拟议额度与计划勾稽",
          "requirement": "R014 学院拟议额度与计划勾稽，P3；T=学院已开展拟议；F=申请撤回且未形成拟议→NOT_APPLICABLE；U=拟议状态/权限不明→学院Owner；SRC-006/012；F015/016/017/032/033；M011/M002/M006；对学院拟议版、导师/子账户汇总与当前计划M002比较；加总只为发现矛盾，不替有权机构算“应给几名”；草案缺/不可读→NEEDS_MATERIAL/学院经办或UNREADABLE/文件持有人；分账冲突→CONFLICT/计划+学院Owner",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R015",
          "title": "拟议会议/公示/意见是否履行，条件P3–P4",
          "requirement": "R015 拟议会议/公示/意见是否履行，条件P3–P4；T=当前有效办法明确该程序必经；F=现行办法证实非必经→NOT_APPLICABLE；U=程序是否必经未知→政策Owner；SRC-006/007/012；F032/040/041；M012/M003/M021；仅在法定/校定节点后核有权会议、签发者、议程与公示期间；P1无纪要是正常，不拿学院岗位说明创设审批权；规则缺失→POLICY_UNCONFIRMED/学院规章Owner；会议真实而授权未知→NEEDS_HUMAN_DECISION/学校权限Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "正式指标决定的存在、权限、生效点",
          "requirement": "R016 正式指标决定的存在、权限、生效点，P4及已决定核验；T=宣称已获得/改变导师额度；F=只是P1–P3事实预审且未声称已生效→NOT_APPLICABLE；U=正式决定状态不明→指标Owner；SRC-001/002/013（仅权责/计划边界）；F018/032–035/039/041；M013/M011/M021/M003；校验有权签发机关、额度账户、文号、版本、生效时间，M013优于M011；此R核“有效决定存在”这一事实而不自行作决定；决定未签发但需批准→NEEDS_HUMAN_DECISION/有权指标决定者；未核签发权→POLICY_UNCONFIRMED/校院授权Owner；伪章冲突→CONFLICT",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R017",
          "title": "招生渠道及已占额事实",
          "requirement": "R017 招生渠道及已占额事实，P5/已有占额时；T=已有正式录取、直博/硕博连读等渠道占用；F=还未到实际录取阶段、且本案非已有占额核验→NOT_APPLICABLE（仅阶段已进入仍无占额需求时）；U=招生Owner占额是否存在未知→该Owner；SRC-003(2025渠道)/009/014；F014/018/019/035；M010/M019/M013；以招生Owner正式录取/调剂占额记录及计划账户为准；学生报名或拟录取回执≠最终有效占额，且不接管学生录取复核；占额源不可取→SOURCE_UNAVAILABLE/招生Owner；两个系统占额冲突→CONFLICT/招生+指标Owner",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "计划动态调整申请与新旧链，条件P5",
          "requirement": "R018 计划动态调整申请与新旧链，条件P5；T=下达新计划/有正式调额申请；F=无调整事件且权威计划确认不变→NOT_APPLICABLE；U=是否有更新未知→计划Owner；SRC-002/013/014；F015/016/018/019/038/040；M015/M002/M010/M013；比新旧计划文号、调整理由、有效日期、已占额约束；仅有调整申请不改变生效额度，正式变更仍须R016；请求件缺→NEEDS_MATERIAL/申请方；新计划失联→SOURCE_UNAVAILABLE/招生计划Owner；调整批准权限未核→NEEDS_HUMAN_DECISION",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R019",
          "title": "补件、纠错、材料替换后的定向重审，条件PX",
          "requirement": "R019 补件、纠错、材料替换后的定向重审，条件PX；T=同案有新材料版本/勘误；F=无更正事件→NOT_APPLICABLE；U=新旧材料对应关系不明→材料Owner；SRC-001/006（事实范围背景）；F001/007/031/042及被影响字段；M014及被替换M；对caseId+slotId+对象ID+sourceVersion+hash建父子链；只有依赖被换证据的R结果失效，其他R保持可用；历史PASS_FACT标被替代，不伪造新Run；替换件无法读→UNREADABLE/原持有人；归属冲突→CONFLICT/案卷经办；处理方式待授权→NEEDS_HUMAN_DECISION",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "撤回请求人、节点及效果，条件PX",
          "requirement": "R020 撤回请求人、节点及效果，条件PX；T=原请求人/授权代理提出撤回；F=未提出撤回→NOT_APPLICABLE；U=是否真实撤回或可撤回期限未知→受理Owner；SRC-007（仅经办背景）/012（政策缺）；F005/006/034/037/039/041；M016/M021/M013（P4后）/M010（已有占额时）；核请求/原案版本、申请人授权和是否已有生效/占额；收到M016只证请求存在，撤回批准及是否释放额度须另有权决定；权限和窗口未证→POLICY_UNCONFIRMED/受理规章Owner；已生效撤销须NEEDS_HUMAN_DECISION/原决定者",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R021",
          "title": "指标异议的真实请求、对象和路由，条件PX",
          "requirement": "R021 指标异议的真实请求、对象和路由，条件PX；T=导师/合法代表对本案拟议或有效指标提出异议；F=无异议→NOT_APPLICABLE；U=受理范围/期限未知→复核Owner；SRC-006/011（11仅学生申诉反例）/012；F005/006/036/041；M017/M011或M013/M021；核争议对象、原版决定或拟议、提交人、理由、证据和提交时点；不拿学生录取申诉时限判导师异议逾期；自述无争议对象→NEEDS_MATERIAL/请求人；受理权或时限未知→POLICY_UNCONFIRMED/学校复核规章Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "复核结果/更正决定的真伪和效力，PX复核形成后",
          "requirement": "R022 复核结果/更正决定的真伪和效力，PX复核形成后；T=有权机关已形成复核/更正结果；F=没有发起复核且无历史结果→NOT_APPLICABLE；U=请求已提出但结果未形成→保持等待不索件；SRC-001/006/012（具体复核权待核）；F034/036/039/041/042；M018/M017/M013/M021；核复核主体授权、原决定引用、是否改变额度、生效日期与送达；仅由正式M018/M013变更Decision，不重写原案历史；复核尚未作出→NEEDS_HUMAN_DECISION/有权复核机关；签发权未知→POLICY_UNCONFIRMED/规章Owner；版本矛盾→CONFLICT/原决定者",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R023",
          "title": "普通博士导师限招比较事实，条件P3–P4",
          "requirement": "R023 普通博士导师限招比较事实，条件P3–P4；T=普通博士拟分配且2024年第11条对当批次已确认适用；F=非博士或只审学校总计划→NOT_APPLICABLE；U=类别/当前效力/同年跨院合计未知→待核；SRC-001第11条；F002/F007/F011/F014/F043/F044/F040；M003/M011/M013/M022/M023；第11条通常博士每年不超过2人，院士等国家和省部级高水平师资不超过3人；其中定向博士不超过1人且服从比例控制。先取得学校正式类别认定、全部普通博士跨院分账及当年制度适用证明；仅比对数值与事实，不决定某人应分多少。第11条在籍博士达14停招属于T06-T02有效资格结果，此R不得自作停招决定；合计与可信记录相抵触→CONFLICT/计划Owner；政策生效链未证→POLICY_UNCONFIRMED/规章Owner；超出界限或待遇例外需裁量→NEEDS_HUMAN_DECISION/实际分配权人；台账失联→SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R024",
          "title": "普通硕士导师限招比较事实，条件P3–P4",
          "requirement": "R024 普通硕士导师限招比较事实，条件P3–P4；T=普通硕士拟分配且2024年第12条适用；F=非硕士或只有计划总量→NOT_APPLICABLE；U=首招/跨计划计数或政策版本未知→待核；SRC-001第12条；F002/F007/F011/F014/F045/F046/F040；M003/M011/M013/M022/M023；比对正式普通硕士全年归集数与第12条每年不超过4人；经招生Owner证实首次招生的，关注“一般不超过2人”的原则条款，例外由有权部门判断，不能机器一票否决；不得把单个学硕/专硕账户小计充当全年总数；原文与当期授权未核→POLICY_UNCONFIRMED/政策Owner；首招源失联→SOURCE_UNAVAILABLE/招生Owner；计数冲突→CONFLICT/计划Owner；原则例外/超限→NEEDS_HUMAN_DECISION/分配权人",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R025",
          "title": "科研项目等专项排除普通限招计数，条件P2–P4",
          "requirement": "R025 科研项目等专项排除普通限招计数，条件P2–P4；T=申请主张SRC-001第13条专项豁免；F=权威计划确属普通计划且无专项主张→NOT_APPLICABLE；U=批次专项归属/效力未知→专项Owner；SRC-001第13条、SRC-002、SRC-017(只作考生流程边界)；F002/F014/F015/F027/F044/F046/F047；M002/M008/M011/M023；2024第13条仅称“以科研项目等专项招生计划招收的研究生数量”不计入第11/12条限招；必须证明招生部门认定的正式专项计划及每人每账户归属。同一占额不得既在普通计划计算又在专项扣除；不得从SRC-017考生报考同意函自动识别获得专项名额；专项分类无权威证明→POLICY_UNCONFIRMED/专项政策Owner；不同账户同时占用→CONFLICT/招生+指标Owner；批准分配未形成→NEEDS_HUMAN_DECISION/有权分配机关",
          "execution": "manual",
          "targetScope": "group"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "p0",
      "name": "P0 计划/依据建档",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p1"
    },
    {
      "id": "p1",
      "name": "P1 提出需求/集中汇总",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p2"
    },
    {
      "id": "p2",
      "name": "P2 事实预审/退补",
      "kind": "supplement-wait",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p3"
    },
    {
      "id": "p3",
      "name": "P3 拟分配/会议",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p4"
    },
    {
      "id": "p4",
      "name": "P4 有权决定/生效",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p5"
    },
    {
      "id": "p5",
      "name": "P5 占用/动态调整",
      "kind": "handoff",
      "executorRole": "reviewer",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "item-feedback",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-list",
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
  "batchId": "T06-A",
  "templateId": "T06-T03",
  "name": "研究生导师招生指标申请与分配材料审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T06-T03.md",
  "sourceDocumentSha256": "56e3e6eb04d270f3aa78502c789afa9818143c367d2e1102128d460921f0599d",
  "sourceDocumentBytes": 137458,
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/T06-T03.md",
  "reviewedDocumentPatchApplied": false,
  "reviewedDocumentPatchSummary": "未做低歧义正文修订；保留原研究稿中的待确认门禁。",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "researchAsOf": "2026-10-23",
  "auditedAt": "2026-10-24",
  "criteria": [
    {
      "sectionId": "rules-08-2",
      "criterionId": "R001",
      "srcIds": [
        "SRC-002",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002"
      ],
      "materialSlotIds": [
        "M001",
        "M002"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R002",
      "srcIds": [
        "SRC-002",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F002"
      ],
      "materialSlotIds": [
        "M001",
        "M002"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-006",
        "SRC-010",
        "SRC-012",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F003"
      ],
      "materialSlotIds": [
        "M003",
        "M020"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F001"
      ],
      "materialSlotIds": [
        "M004",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F007",
        "F008",
        "F009",
        "F010"
      ],
      "materialSlotIds": [
        "M002",
        "M004",
        "M009"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F007"
      ],
      "materialSlotIds": [
        "M004"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002"
      ],
      "materialSlotIds": [
        "M004",
        "M005"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R008",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F004"
      ],
      "materialSlotIds": [
        "M006",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R009",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F009",
        "F010",
        "F011",
        "F012",
        "F013",
        "F014",
        "F015",
        "F016",
        "F017",
        "F018",
        "F019"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M006",
        "M019"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-010",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F007"
      ],
      "materialSlotIds": [
        "M005",
        "M007",
        "M020"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R011",
      "srcIds": [
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F014"
      ],
      "materialSlotIds": [
        "M002",
        "M008"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F007"
      ],
      "materialSlotIds": [
        "M004",
        "M009",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R013",
      "srcIds": [
        "SRC-002",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002"
      ],
      "materialSlotIds": [
        "M002",
        "M013"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R014",
      "srcIds": [
        "SRC-006",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F015"
      ],
      "materialSlotIds": [
        "M002",
        "M006",
        "M011"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R015",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F032"
      ],
      "materialSlotIds": [
        "M003",
        "M012",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F018"
      ],
      "materialSlotIds": [
        "M003",
        "M011",
        "M013",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R017",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F014"
      ],
      "materialSlotIds": [
        "M010",
        "M013",
        "M019"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R018",
      "srcIds": [
        "SRC-002",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F015"
      ],
      "materialSlotIds": [
        "M002",
        "M010",
        "M013",
        "M015"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F001"
      ],
      "materialSlotIds": [
        "M014"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R020",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F005"
      ],
      "materialSlotIds": [
        "M010",
        "M013",
        "M016",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R021",
      "srcIds": [
        "SRC-006",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F005"
      ],
      "materialSlotIds": [
        "M011",
        "M013",
        "M017",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F034"
      ],
      "materialSlotIds": [
        "M013",
        "M017",
        "M018",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002",
        "F007",
        "F011",
        "F014",
        "F040",
        "F043",
        "F044"
      ],
      "materialSlotIds": [
        "M003",
        "M011",
        "M013",
        "M022",
        "M023"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002",
        "F007",
        "F011",
        "F014",
        "F040",
        "F045",
        "F046"
      ],
      "materialSlotIds": [
        "M003",
        "M011",
        "M013",
        "M022",
        "M023"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-017"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002",
        "F014",
        "F015",
        "F027",
        "F044",
        "F046",
        "F047"
      ],
      "materialSlotIds": [
        "M002",
        "M008",
        "M011",
        "M023"
      ]
    }
  ],
  "sources": [
    {
      "id": "SRC-001",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED（2024发布文本；后续修订待证）；成都理工大学：《成都理工大学研究生指导教师岗位管理办法》，成理校研〔2024〕23号",
      "url": "https://cnae.cdut.edu.cn/__local/9/09/32/078522620118EF78C1344E0E040_EF742B3C_424F74.pdf",
      "scope": "SRC-001；CDUT-VERIFIED（2024发布文本；后续修订待证）；成都理工大学：《成都理工大学研究生指导教师岗位管理办法》，成理校研〔2024〕23号；[校内原文PDF](https://cnae.cdut.edu.cn/__local/9/09/32/078522620118EF78C1344E0E040_EF742B3C_424F74.pdf)，PDF第1页落款、6页第10条、7–8页第11–14条、12–13页附则；2024-04-18印发（修正旧稿错误的04-24），自印发施行；第21条废止成理校研〔2021〕19号；适用CDUT博/硕导师；本轮下载官方14页扫描原件并逐页看图复核关键页。第3条岗位与招生资格分审；第10条年度资格；第11条博士通常2/高水平师资3及定向1、在籍博士达14人暂停；第12条硕士4、首招一般2；第13条科研专项不计入上述限招。不得从限额推导个人获配数；主管部门仍需核对2026修订"
    },
    {
      "id": "SRC-002",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED；成都理工大学研究生院：《成都理工大学2026年博士研究生招生章程》",
      "url": "https://gra.cdut.edu.cn/__local/D/86/30/8EBCC1F48BCA687D97FB8DE3B67_540D94D6_3D57C.pdf",
      "scope": "SRC-002；CDUT-VERIFIED；成都理工大学研究生院：《成都理工大学2026年博士研究生招生章程》；[校内原文PDF](https://gra.cdut.edu.cn/__local/D/86/30/8EBCC1F48BCA687D97FB8DE3B67_540D94D6_3D57C.pdf)，第1–2页“二、招生计划”“三、招生方式”；2026招生年度；检索页显示2026-01-21同期发布；有效只针对当年，后续调整按通知；未见废止信息；原文已核对；教育部下达总量、学院实际招生按需求调整、专项类型及三种博士选拔方式，不能导出导师个人数值分配公式"
    },
    {
      "id": "SRC-003",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED；成都理工大学党委研工部/研究生院：《成都理工大学2025年招收硕博连读研究生的通知》",
      "url": "https://gra.cdut.edu.cn/__local/D/88/ED/D3929F36A0ABB7D5E8DAF2365D0_D319D5B9_3C0CA.pdf",
      "scope": "SRC-003；CDUT-VERIFIED；成都理工大学党委研工部/研究生院：《成都理工大学2025年招收硕博连读研究生的通知》；[校内原文PDF](https://gra.cdut.edu.cn/__local/D/88/ED/D3929F36A0ABB7D5E8DAF2365D0_D319D5B9_3C0CA.pdf)，第3页“三、申请专业和导师”，第3–4页“选拔工作程序”；2025-03-03发布；只适用2025批次，过期年度规则不能自动执行于2026；原文已核对；学院统筹硕博连读占学院当年博士计划、占导师当年博士招生指标；学生初审及录取与指标分配分离"
    },
    {
      "id": "SRC-004",
      "status": "CURRENTITY-UNKNOWN",
      "title": "CURRENTITY-UNKNOWN；成都理工大学：《成都理工大学研究生学位论文评阅实施办法》，成理校研〔2023〕6号",
      "url": "https://cnae.cdut.edu.cn/__local/B/F8/40/929A95B23EB7CF79723C14C7BF2_1CD1D65A_5FAA6.pdf",
      "scope": "SRC-004；CURRENTITY-UNKNOWN；成都理工大学：《成都理工大学研究生学位论文评阅实施办法》，成理校研〔2023〕6号；[校内原文PDF](https://cnae.cdut.edu.cn/__local/B/F8/40/929A95B23EB7CF79723C14C7BF2_1CD1D65A_5FAA6.pdf)，第6–7页第十二条、附则；2023-03-29印发施行，原2021年27号文同时废止；2024会议记载审定该办法修订，2026现行版本未核定；历史原文已核对、当前规范力未核对；可作为待核扣减/暂停处理关联的定位线索，不得按第十二条在2026自动扣指标"
    },
    {
      "id": "SRC-005",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED；成都理工大学研究生院：《关于开展2023年成都理工大学研究生质量工程项目申报立项工作的通知》",
      "url": "https://gra.cdut.edu.cn/info/1011/3362.htm",
      "scope": "SRC-005；CDUT-VERIFIED；成都理工大学研究生院：《关于开展2023年成都理工大学研究生质量工程项目申报立项工作的通知》；[研究生院原文](https://gra.cdut.edu.cn/info/1011/3362.htm)，第二部分“项目管理”；发布2023-04-26；2023特定项目批次，后续效力不推广；正文已核对；研究生质量工程实施情况可作为招生指标配置参考依据；未提供统一权重或自动加分"
    },
    {
      "id": "SRC-006",
      "status": "CURRENTITY-UNKNOWN",
      "title": "CURRENTITY-UNKNOWN；成都理工大学材料与化学化工学院/材料与化工学位点：《学位授权点建设年度报告》（校研究生院所载PDF）",
      "url": "https://gra.cdut.edu.cn/__local/D/69/D5/7104C6BD7D9154AD3388B3A6B70_8DB688D1_F5567D.pdf",
      "scope": "SRC-006；CURRENTITY-UNKNOWN；成都理工大学材料与化学化工学院/材料与化工学位点：《学位授权点建设年度报告》（校研究生院所载PDF）；[校内年度报告PDF](https://gra.cdut.edu.cn/__local/D/69/D5/7104C6BD7D9154AD3388B3A6B70_8DB688D1_F5567D.pdf)，检索定位“制度建设”，本轮网页工具因16MB超过读取限制未能全篇复核；2024年度报告，约2025年公示；只是年度建设陈述，并非指标办法正文；学校域名检索摘录指向曾修订《材料与化学化工学院研究生导师硕士研究生招生指标确定办法》；仅原文线索，不能据报告推定该细则2026生效、评分项或签发权限"
    },
    {
      "id": "SRC-007",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED；成都理工大学环境与土木工程学院：《研究生管理科》岗位职责",
      "url": "https://cece.cdut.edu.cn/info/1028/9592.htm",
      "scope": "SRC-007；CDUT-VERIFIED；成都理工大学环境与土木工程学院：《研究生管理科》岗位职责；[学院原文](https://cece.cdut.edu.cn/info/1028/9592.htm)，研究生教务管理岗位职责第一项；发布2026-03-05；仅适用该学院的岗位工作说明；正文已核对；汇总各学科专业年度招生计划上报的学院经办职责；不构成核定导师个人名额的批准权"
    },
    {
      "id": "SRC-008",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED；成都理工大学党代会专题网：《坚守教育报国初心 勇担立德树人使命 努力推进高质量人才培养》",
      "url": "https://ddh.cdut.edu.cn/info/1011/1084.htm",
      "scope": "SRC-008；CDUT-VERIFIED；成都理工大学党代会专题网：《坚守教育报国初心 勇担立德树人使命 努力推进高质量人才培养》；[校本历史总结](https://ddh.cdut.edu.cn/info/1011/1084.htm)，“研究生教育篇”第一节；约2020–2021总结，非规章且没有效力期限；正文已核对；佐证“招生指标分配动态管理”并非虚构事项；不可凭此认定现行分配权限或条件"
    },
    {
      "id": "SRC-009",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED；成都理工大学研究生院：《成都理工大学2026年招收硕博连读研究生报名须知》",
      "url": "https://gra.cdut.edu.cn/info/1075/5753.htm",
      "scope": "SRC-009；CDUT-VERIFIED；成都理工大学研究生院：《成都理工大学2026年招收硕博连读研究生报名须知》；[研究生院原文](https://gra.cdut.edu.cn/info/1075/5753.htm)，（一）至（四）；另见[研究生院检索索引](https://gra.cdut.edu.cn/search.jsp?currentnum=2&newskeycode2=5b2V5Y%2BW&searchScope=0&wbtreeid=1001)所列2026-03-09《招收硕博连读研究生的通知》；2026-03-17发布，适用2026报名；正文通过搜索索引核验，直开网页有412限制；2026-03-09被引通知尚未取得完整原文；报名须知正文可检索核对；证明2026学年仍有硕博连读途径与学院考核，未据此断定指标数量/导师个人审批"
    },
    {
      "id": "SRC-010",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED；成都理工大学党政办公室：《校长办公会通报》，校长办公会纪要〔2024〕10号",
      "url": "https://dbxb.cdut.edu.cn/__local/A/20/E9/C7C001E21BDEEC81A8AF688EFE0_F1368739_13A3C.pdf",
      "scope": "SRC-010；CDUT-VERIFIED；成都理工大学党政办公室：《校长办公会通报》，校长办公会纪要〔2024〕10号；[学校公示PDF](https://dbxb.cdut.edu.cn/__local/A/20/E9/C7C001E21BDEEC81A8AF688EFE0_F1368739_13A3C.pdf)，第1页第5–6项；2024-04-03开会，2024-04-05通报；会议记录非修订正文；原文已核对；2024审定导师岗位管理与论文评阅办法修订事项，提示SRC-004版本风险；不证明具体修订何时生效"
    },
    {
      "id": "SRC-011",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED；成都理工大学生态环境学院：《2026年“科研经费博士研究生专项招生计划”实施细则》",
      "url": "https://sthjxy.cdut.edu.cn/info/1013/4000.htm",
      "scope": "SRC-011；CDUT-VERIFIED；成都理工大学生态环境学院：《2026年“科研经费博士研究生专项招生计划”实施细则》；[学院原文](https://sthjxy.cdut.edu.cn/info/1013/4000.htm)，第一至四部分；发布2026-04-22，适用该学院该年专项；网页直接打开曾遇412，搜索返回正文可核；原文内容经官方索引核对；需先经导师同意的考生报名步骤以及学院复核/申诉，不是导师指标申请签批流程；不得跨学院泛化"
    },
    {
      "id": "SRC-012",
      "status": "CURRENTITY-UNKNOWN",
      "title": "CURRENTITY-UNKNOWN；成都理工大学材料与化学化工学院：《材料与化学化工学院研究生导师硕士研究生招生指标确定办法》（仅由SRC-006提到的原文标题）",
      "scope": "SRC-012；CURRENTITY-UNKNOWN；成都理工大学材料与化学化工学院：《材料与化学化工学院研究生导师硕士研究生招生指标确定办法》（仅由SRC-006提到的原文标题）；待向学院研究生教学管理部门/研究生院取得制度全文；检索路径：site:cdut.edu.cn \"研究生导师硕士研究生招生指标确定办法\"、site:gra.cdut.edu.cn \"招生指标\" \"导师\"；曾于2024年度报告提到修订；版本号、施行日、废止日、是否2026继续有效均未知；仅该学院/硕士层次线索；正文未取得，不产生可执行条款；须补办版本、签发部门、评分和复核权限后才能变为规范证据"
    },
    {
      "id": "SRC-013",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED；成都理工大学研究生院：《成都理工大学2026年硕士研究生招生章程》",
      "url": "https://gra.cdut.edu.cn/info/1074/5442.htm",
      "scope": "SRC-013；CDUT-VERIFIED；成都理工大学研究生院：《成都理工大学2026年硕士研究生招生章程》；[研究生院原文](https://gra.cdut.edu.cn/info/1074/5442.htm)，第一部分“招生人数”、第三/六部分；直接打开有412，学校索引及检索正文可核；2025-09-26发布，适用2026招生年度；实际招生人数依教育部计划与生源调整；未见废止；当期招生规模及学习方式/学位类型线索已核；所列人数及卓越工程师团队计划是招生计划，不是导师个人获配额度；学生报名材料不得转成导师材料"
    },
    {
      "id": "SRC-014",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED；成都理工大学研究生院：《成都理工大学2026年硕士研究生招生复试录取工作办法》",
      "url": "https://gra.cdut.edu.cn/info/1074/5775.htm",
      "scope": "SRC-014；CDUT-VERIFIED；成都理工大学研究生院：《成都理工大学2026年硕士研究生招生复试录取工作办法》；[研究生院原文](https://gra.cdut.edu.cn/info/1074/5775.htm)，关于按学校下达学院计划组织录取的部分；直接打开有412，检索正文可核；2026招生复试录取批次；后续调整及终版仍随官方公告；当期学院计划控制与录取分工线索已核；本ID只引用已占额/计划事实，绝不核判学生复试录取"
    },
    {
      "id": "SRC-015",
      "status": "CURRENTITY-UNKNOWN",
      "title": "CURRENTITY-UNKNOWN；成都理工大学研究生院：《成都理工大学2018年博士研究生复试录取工作的通知》",
      "url": "https://gra.cdut.edu.cn/info/1075/4359.htm",
      "scope": "SRC-015；CURRENTITY-UNKNOWN；成都理工大学研究生院：《成都理工大学2018年博士研究生复试录取工作的通知》；[研究生院原文](https://gra.cdut.edu.cn/info/1075/4359.htm)，2018年第三部分“关于拟录取”第4项；2018-05-18发布，仅2018当年适用；2026不可据此继承每人招生上限；历史原文已核对，但不是2026现行政策。2018“原则上不超过2人”等限额仅作失效阈值反例，不自动迁移到2026规则"
    },
    {
      "id": "SRC-016",
      "status": "CROSS-SCHOOL-REFERENCE",
      "title": "CROSS-SCHOOL-REFERENCE；成都大学研究生处：《关于报送2026级硕士研究生与导师双选工作方案通知》（并非成都理工大学）",
      "url": "https://yjsc.cdu.edu.cn/info/1052/8236.htm",
      "scope": "SRC-016；CROSS-SCHOOL-REFERENCE；成都大学研究生处：《关于报送2026级硕士研究生与导师双选工作方案通知》（并非成都理工大学）；[成都大学原文](https://yjsc.cdu.edu.cn/info/1052/8236.htm)，第二项“导师增加招生人数申请”、第三项报送时限；2026-07-09发布，适用成都大学2026级硕士双选；对CDUT无政策效力；网页正文已核对，仅作反例：该校的“增加招生人数申请表”、7月/9月时限及国家项目导师至少1名安排，均不得迁入成都理工大学T06-T03"
    },
    {
      "id": "SRC-017",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED（仅特定学院、考生录取事项）；成都理工大学材料与化学化工学院：《2026年“科研经费博士研究生专项招生计划”实施细则》",
      "url": "https://cmcc.cdut.edu.cn/info/1037/9106.htm",
      "scope": "SRC-017；CDUT-VERIFIED（仅特定学院、考生录取事项）；成都理工大学材料与化学化工学院：《2026年“科研经费博士研究生专项招生计划”实施细则》；[学院官方网页](https://cmcc.cdut.edu.cn/info/1037/9106.htm)，报考及学院考核程序；2026批次，仅材料与化学化工学院及该专项；本轮通过学校索引校验，直开可能受412限制；学院明确要求考生先与报考导师沟通，属于考生报考流程；不能据此认定导师个人专项获配、经费达标或跨普通计划调配"
    }
  ]
} as const
