/** R02 S08-T08: mechanical, source-traceable V3 draft; no official school authorization. */
import type { TemplateVersion } from '@profer/shared'
import { validateTemplate } from '../../template-store'

export const templateVersion: TemplateVersion = {
  templateId: "S08-T08",
  version: 1, schemaVersion: 2, name: "硕博士学位申请、延期授予及学位决定材料审核",
  description: "本地研究模板 · 非校方正式模板。硕博士学位申请、延期授予及学位决定材料审核。仅做证据关联、事实审查、风险与补件建议；政策适用和最终决定由有权人员确认。",
  catalogKind: 'builtin',
  sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 非校方正式模板；审阅稿 docs/design/review-agent/business-templates/R02/S08-T08.md SHA-256 56accce1b84e02dd71195153c33b8a23340229c3307f68f28d5de14aa577ffc4；研究原件 docs/design/review-agent/business-templates/R02/research-original/S08-T08.md SHA-256 1b1f806c72cc6c903ab1ba1d287aaa199cacd2d469a4bd312ce96da30a707eaa。SRC 为研究文献索引，不是案卷 SourceRef；校规及签批权待确认。",
  objectType:'person', displayName:{template:"硕博士学位申请、延期授予及学位决定材料审核"},
  fields: [
  {
    "key": "F001",
    "label": "申请案标识",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F001：string；DA；L0 正式受理后；可信案卷登记或受理回执；M001/M024；P1；草稿可暂缺；受理后缺 SU，重复案 CF；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F002",
    "label": "学号/校内身份主键",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F002：string；AP；L0；学校学籍主记录；M002；P2；缺 SU，同名不同号 CF；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F003",
    "label": "法定姓名及历史姓名映射",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F003：string/list；AP；L0；学籍主记录、依法更名依据；M002；P2；不匹配 CF，无法回源 SU；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F004",
    "label": "申请主体身份/特殊类别",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F004：enum/list；AP；L0、特殊办理；校方身份管理/资格记录；M002/M003；P2；身份不明 HD，不凭职工账号推断；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F005",
    "label": "申请学位层次",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F005：enum{硕士,博士}；DA；L0；校方学籍及申请记录；M003；P1；错层次 CF，不能跨层自动转换；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F006",
    "label": "学位类型",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F006：enum{学术,专业}；DA；L0；校方培养/学位点信息；M003；P1；类型冲突 CF，缺 SU；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F007",
    "label": "培养单位 ID/有效期",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F007：string；EN；L0；学校学院/培养记录；M003；P1；变更历史不明 SU/HD；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F008",
    "label": "学位授权点及专业代码",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F008：string；EN；L0；校方学位点/培养登记；M003；P1；授权点归属冲突 CF；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F009",
    "label": "学籍与修业状态",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F009：enum+dates；EN；L1；学籍管理系统正式结论；M004；P2；缺 SU，修业延期另路由；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F010",
    "label": "毕业/培养资格审查结论",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F010：enum+signedRef；EN；L1；培养单位权威审查；M005；P2；未核不可标通过；SU/HD；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F011",
    "label": "目标学位审议批次",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F011：year-month enum；DA；L0、顺延；有权经办确认的目标批次；M001/M023；P1；未定可待确认；旧/新批次矛盾 CF；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F012",
    "label": "批次政策来源版本/截止",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F012：object{src,date,cutoff}；DA；L0、L5；校方有效通知和后续变更；M023；P0；无当期版本 PC，不直接用 2026 规则跨年；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F013",
    "label": "导师同意/审阅结论",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F013：enum+signedRef；ST；L2；导师通过校方核验的审阅；M006；P2；阶段已到仍缺 SU/NM，冒名 CF；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F014",
    "label": "预审/预答辩结论",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F014：enum+ref；ST；L2；学院预审组织的正式结果；M007；P2；未举行不要求；已举行无记录 SU；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F015",
    "label": "学术不端文字复制比检测结论",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F015：enum+ref；ST；L2 送审前；学校检测流程签发结果；M008；P3；缺 SU，不能从比例自行定违规；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F016",
    "label": "双盲评阅综合结果",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F016：enum+refs；ST；L2 评阅完成；培养单位/受托评阅平台正式意见；M009；P3；未返回为阶段等待；已完成取不到 SU；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F017",
    "label": "送审、答辩论文版本标识",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F017：hash/version；ST；L2–L3；学校认可提交稿与论文修订链；M009/M010；P2；论文版本不一致 CF，需原阶段重认定；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F018",
    "label": "答辩委员会正式决议",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F018：enum+signedRef；ST；L3 答辩后；答辩委员会记录；M010；P2；答辩前不适用；后缺 SU/HD；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F019",
    "label": "学术/专业成果达标权威认定",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F019：enum+pointVersion；ST；L4 条件适用；学位点成果认定 Owner；M011；P2；成果标准不明 PC，不能由清单推达标；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F020",
    "label": "正式提交/受理凭证",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F020：object{time,receipt}；DA；L0 提交后、L4；学校受理机关/系统回执；M024；P2；未提交不适用，回执失联 SU；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F021",
    "label": "分委员会建议类别与理由引用",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F021：enum+ref；CM；L5 会后；分委员会有权会议记录；M012；P3；会议前不适用；会后缺 SU/HD；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F022",
    "label": "分委会成员任命、授权事项、会议事实与表决凭证",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F022：object{bodyId,appointmentRef,term,scope,meetingId,agenda,attendance,conflictOfInterest,voteRef}；CM；L5 组织配置可在会前核；会议事实只在会后核；现行任命/会议原记录及学校核验；M013；P3；缺现行章程/本院任命 PC/SU，会议程序需授权机构判断 HD；仅文法学院公告不外推；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F023",
    "label": "校级学位正式决定及生效时间",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F023：enum+signedRef；DE；L6 会后；校学位评定委员会权威决议；M014；P3；会前不适用，会后无可信签发 HD/SU；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F024",
    "label": "拟决定告知/陈述申辩及最终决定送达证据",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F024：object{time,mode,content,statementRef}；DE；L6 拟不授予/撤销决定前；L7、L8 最终决定告知；有权通知机关正式记录、申请人申辩接收记录；M015；P3；前置告知未核不得将拟决定当生效；SU/HD；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F025",
    "label": "学位信息登记/证书状态",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F025：object；DE；L7；校方登记/证书系统；M016；P2；尚未登记不等于未授位；SU；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F026",
    "label": "撤回意愿/受理结果",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F026：object；DA；L8 撤回请求时；实名申请与有权受理机关；M017；P2；无受理结论不能视为已撤回；HD；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F027",
    "label": "补正材料提交事件与替换指针",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F027：object；EV；L8 补件时；校内接件/原材料版本链；M018；P2；缺变更链 CF/SU，原件不删除；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F028",
    "label": "学术复核申请、受理及结论",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F028：object；RE；L8 学术争议时；校方学术复核机关；M019；P3；申请缺件 NM，受理与结论缺 SU；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F029",
    "label": "学位决定复核申请、受理及结论",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F029：object；RE；L8 决定争议时；校方有权复核机关；M020；P3；申请缺件 NM，结论不可信 HD；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F030",
    "label": "涉密资格/可披露范围",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F030：enum+signedRef；ST；L2–L7 涉密时；学校保密/学位管理部门；M021；P3；未核密级 HD，禁止普通公开处理；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F031",
    "label": "代理的具体行为授权、校方核准与有效期",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F031：object{principalId,agentId,permittedAction,scope,effectiveFrom,effectiveUntil,schoolApprovalRef}；AP；L0/L8 确有代办动作时；有效委托+学校对应动作的有权受理/核准；M022；P3；批准未知 PC/HD，接口失联 SU，未核准前不创建有权 actor 或正式撤回/复核事件；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F032",
    "label": "证据签发、获取、摘要、sourceVersion、supersedes",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F032：object；EV；每次上传/回源/换版；原件/可信来源元数据及校方接件流水；M018/M024，也挂接全部 M；P2；缺校验链 CF/SU，旧结论转待复核；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F033",
    "label": "博士建议改授硕士的申请人明示同意",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F033：object{consent,degreeTarget,signedAt,authorityRef}；AP；L3 仅触发《学位法》第27条特例时；本人可信同意声明及学院确认；M025；P2；未取得真实明示同意 HD/NM；原博士申请不当然表示同意改授；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F034",
    "label": "同单位同学科/专业已获硕士学位历史核验",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F034：object{hasPriorMaster,degreePoint,awardingUnit,sourceRef}；DE；L3 仅触发第27条特例时；学校原学位授予档案/可信授位记录；M026；P2；无法回源 SU，校外硕士经历不能冒充“本单位该学科专业已获”；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F035",
    "label": "归档批次、移交与签收状态",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F035：object{degreeDecisionId,degreeBatch,archiveDueAt,transferredAt,archiveReceiptRef}；DE；L7 正式校级决定后，且进入该批次归档工作时；学校档案馆 2026 通知与归档责任单位/档案馆签收记录；M027；P2；未到归档阶段 NA；归档日没公开 PC；应交却无校内来源 SU；不能以证书缺失推断未授位；枚举和复杂值待可信来源核验，不按文字猜类型。"
  }
],
  materialSlots: [
  {
    "id": "M001",
    "name": "真实学位申请意愿；申请人/受理机关",
    "purpose": "研究稿 M001：正式学位申请书、学校申请系统记录；C@L0正式提交，草稿为 H；2026 现行表单内容 U；学校已确认的电子申请与带签收的正式文书可互替；旧纸本不强制；F001/F011；SRC-002/004/010/011/012；本人、同层次/同学位点/批次绑定；缺 NM/PC，糊 UR，伪签 CF。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M002",
    "name": "身份与姓名同一性；校方学籍管理机关",
    "purpose": "研究稿 M002：学籍主记录/正式身份核验；C@L0；已可信连接的校内账户及人事/学籍映射，无须上传身份证照片；校方证明可人工回源；F002/F003/F004；SRC-001/004/007；学号为主键，曾用名需官方映射；缺 SU，糊 UR/回源，冲突 CF。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。敏感或涉密原文不得进入普通上传/模型通道；需先由有权人员确定安全渠道与脱敏范围。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M003",
    "name": "学位层次、类型、单位与学位点；学校培养部门",
    "purpose": "研究稿 M003：培养/学位点登记；C@L0；经校方签发的在读/培养记录；不以学生自填专业名替代；F004–F008；SRC-001/002/004；绑定入学批次与学位点版本；缺 SU，糊 UR，异校/错层 CF。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M004",
    "name": "当前学籍/修业状态；学校学籍部门",
    "purpose": "研究稿 M004：学籍状态记录；C@L1，L0 为 H；校内经办人回源学籍系统；不要求申请人重复上传已有状态；F009；SRC-007/001；状态以签发时间为准；缺 SU，糊 UR，修业延长另案。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M005",
    "name": "已通过毕业/培养资格审查；培养单位",
    "purpose": "研究稿 M005：毕业资格核验的有权结论；C@L1；正式系统结论或培养单位签发记录；成绩表只作线索，不能自动代替最终审核；F010；SRC-001/006；记录审批者、有效日期与版本；缺 SU，糊 UR，意见矛盾 CF。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M006",
    "name": "导师已审阅/同意进入预审、送审；导师/学院",
    "purpose": "研究稿 M006：导师意见原记录；C@L2对应节点；系统内经核验的导师意见，不能用录入“同意”文字替代；F013；SRC-001/002/011；绑定论文版本与真实导师；缺 SU/NM，糊 UR，冒签 CF。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M007",
    "name": "预审合格/处理情况；学院预审组织",
    "purpose": "研究稿 M007：预审/预答辩正式意见；C@L2预审完成后，启动前 H；学院有效电子结论/签署记录，不必申请人重复提交；F014；SRC-001/006；引用预审批次及论文版本；缺 SU，糊 UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M008",
    "name": "送审前学术不端文字复制比检测已完成；学校检测责任主体",
    "purpose": "研究稿 M008：检测及处理结论；C@L2送审前；原校方检测结果/授权复核证明，不能由截图比值直接推定通过；F015；SRC-001/006；敏感检测过程不向无权人展开；缺 SU，糊 UR，结论冲突 HD。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M009",
    "name": "双盲评阅结论及论文版本；学院/第三方平台",
    "purpose": "研究稿 M009：正式专家评阅及综合处理记录；C@L2评阅结束、前为 H；可信受托平台回执/学院正式汇总，不强制申请人上传专家原文；F016/F017；SRC-006/001/010/011；每份意见与送审稿、结果版本绑定；缺 SU，糊 UR，改稿不匹配 CF。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。敏感或涉密原文不得进入普通上传/模型通道；需先由有权人员确定安全渠道与脱敏范围。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M010",
    "name": "答辩及正式决议；答辩委员会",
    "purpose": "研究稿 M010：答辩决议、必要的会议/表决/签署凭证；C@L3答辩后、前为 H；学院正式答辩记录，而非学生自行编写的答辩结果；F017/F018；SRC-002/004/008；与答辩论文版本、委员会对应；缺 SU，糊 UR，假章 CF/HD。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M011",
    "name": "学术或专业成果达到学位点标准；成果认定有权主体",
    "purpose": "研究稿 M011：成果认定结论/标准版本；T@L4，是否要求及学位点标准 U；已生效 G06/S08-T05 的成果认定决定；不强制重传论文全文；F019；SRC-002/004/010/011；标准按人、点、学位类型与版本；缺 SU/PC，糊 UR；不得自行判篇数。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M012",
    "name": "分委员会针对本申请的真实建议；本学院对应分委会",
    "purpose": "研究稿 M012：会议之后的建议原文、理由、讨论对象清单及有权签发记录；H→L5，不得会前催要；校内正式会议纪要/可信建议决定引用；与 M013 独立相互核对，不以秘书个人意见替代；F021/F022；SRC-001/002/004/005/009；每案学号/层次/学位点/批次/答辩结论版本准确绑定；建议存在可核但有效会议授权尚未确认时 R017 可 PF(文字存在)、R018 PC/HD；缺 SU，糊 UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M013",
    "name": "本案分委会的现行授权与会议成立事实；学校委员会任免机关/本学院会议组织者",
    "purpose": "研究稿 M013：会前可用的本学院现行任命/任期/负责学位点/授权范围证明；会后该次会议号、议程、到会/回避/表决/签发记录；H→L5会后集体建议，会前不要求未来会议票；正式任命文件+校内会议原始登记；仅文法学院的 SRC-005 是实例，不能证明其他学院；候选扫描件可作待验线索；F022/F021/F032；SRC-004 第9–11条、SRC-005/009/002；本案学院/学位点、成员任期、授权动作、实际会议及证据版本四重绑定；2025 章程全文缺→PC，原源不可得 SU，签字图未验 CF/HD；不得让学生或代理自行生成会议授权。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M014",
    "name": "校级正式学位决定；校学位评定委员会",
    "purpose": "研究稿 M014：校级会议决议正本或可信决议登记；H→L6，会议后 C；校方正式决议登记与公告（仅公告可证明公布名单，细节需内证）；F023；SRC-003/004；独立于 M012；缺 SU/HD，糊 UR，伪批准 CF。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M015",
    "name": "拟决定前告知/陈述申辩及决定后送达；校方有权通知机关",
    "purpose": "研究稿 M015：拟不授予/撤销决定前的告知事实、理由、依据和听取申辩记录 T@L6；决定后通知及送达 H→L7；学校可验真的送达流水、书面回执和申辩接收记录；公告不当然替代个别权利告知；F024；SRC-004/003；各次动作单独编号/时间/对象，拟决定告知不得被会后公告倒填；缺 SU/HD，糊 UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M016",
    "name": "学位决定后的学位信息登记与证书流程；学位办/登记发证部门",
    "purpose": "研究稿 M016：决定后实际登记条目、学位证书制作/领取状态；H→L7，与归档移交 M027 分离；学校学位电子登记与制证系统的可验真记录；不要求学生以证书照片证明授位决议；F025/F023/F032；SRC-001/003/004；必须关联 M014 正式决定号及身份、层次、批次；缺 SU，糊 UR，证书尚未发不反向推翻学位；归档时间单查 M027。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M017",
    "name": "撤回意愿及学校受理；申请人/受理机关",
    "purpose": "研究稿 M017：实名撤回申请及受理回执；T@L8；学校核实的线上撤回操作记录或纸质签收（方式待核）；F026；SRC-004/012；关联原 M024，保留原案；缺 NM/SU，糊 UR；仅意愿不代表撤回成功。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M018",
    "name": "补件/更正/覆盖与受影响项；申请人/经办人",
    "purpose": "研究稿 M018：变更材料、接收流水、版本替换指针；T@L8；校内原件补正与可信版本记录，不强制重交未变项目；F027/F032；SRC-001/004；supersedes 指旧源版本，不能删除；缺 NM/SU，糊 UR，旧结论过期。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M019",
    "name": "学术复核申请、受理与决定；申请人/学校学术复核机关",
    "purpose": "研究稿 M019：学术评价异议及正式复核记录；T@L8；学校正式申请/受理/复核回执；涉及 M009/M010/M011 哪项即引用哪项；F028；SRC-004；受理后 30 日法定复核期限；缺申请 NM、无校方受理 SU，糊 UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M020",
    "name": "不受理/不授位/撤销的决定复核；当事人/学校复核机关",
    "purpose": "研究稿 M020：对原正式行为不服的复核申请、受理与决定；T@L8；正式申请/复核回执；引用实际存在的 M014/M015/M024；F029；SRC-004；不与 M019 混用，受理后 30 日；缺申请 NM/机关结论 SU，糊 UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M021",
    "name": "涉密审批及可披露范围；保密主管/学院",
    "purpose": "研究稿 M021：涉密资格、论文分级及访问许可；T@L2–L7；正式保密审查记录，不能用文件名“机密”代替；F030；SRC-002/004/008；访问控制与源标记匹配；缺 SU/HD，糊 UR，停止普通流转。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。敏感或涉密原文不得进入普通上传/模型通道；需先由有权人员确定安全渠道与脱敏范围。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M022",
    "name": "某一代理动作的委托与校方接受代理权限；本人/代理人/学校受理机关",
    "purpose": "研究稿 M022：身份已核的委托原文、动作细目/有效期、学校对本次特定动作的审批/受理回执；T@L0/L8仅真实发生代理行为；校方可信后台核准/书面受理与签发记录；委托书扫描件仅为候选，不是独立授权令牌；F031/F004/F026/F028/F029/F032；SRC-004/012/009；精确绑定本人、代理、原受理案、permittedAction（申请、撤回、两类复核分别判断）、时间和批准机关；学校尚未承认时 PC/HD、源失联 SU、伪委托 CF、糊 UR，不能授予 Main actor 权限。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M023",
    "name": "适用批次政策与变更公告；学校研究生院",
    "purpose": "研究稿 M023：2026 年办理通知、后续修订及校历批次配置；C@L0/L5；学校官方通知的权威缓存与版本，绝不要求申请人上传；F011/F012；SRC-001；以最新正式通知取代旧时间配置；缺 PC/SU，糊 UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M024",
    "name": "正式提交/受理与来源流水；受理机关",
    "purpose": "研究稿 M024：接收回执/可信系统流水及来源校验信息；H→L0正式提交/L4；经办人签收凭证或系统回执，可代替单独截图；F001/F020/F032；SRC-001/004；绑定提交人、接收时间、原始源；缺 SU，糊 UR，受理真实性疑点 HD。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M025",
    "name": "博士建议改授硕士的本人明示同意；博士申请人/学校接件机关",
    "purpose": "研究稿 M025：经核实的同意/不同意原声明及接件记录；T@L3仅有第27条建议时；有法定效力且可回源的校内本人确认，不限强制旧纸面格式，具体受理形式待学校核；F033/F002/F005；SRC-004 第27条；绑定申请人、本次博士答辩建议和拟硕士学科专业；本人须真实明确同意，不可由旧博士申请代替；缺 NM/HD，糊 UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M026",
    "name": "本单位该学科/专业是否已授过硕士学位；学校学位档案/学位办",
    "purpose": "研究稿 M026：既往学位授予档案或可信登记的核验结论；T@L3仅有第27条建议时；有权学校部门回源、书面确认；不要求学生上传自己历史证书替代学校内部档案；F034/F002/F008；SRC-004 第27条；身份、授位单位、学科/专业、历史生效时间准确匹配；失联 SU、同名误认 CF、读取失败 UR；结论由学校有权确认。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  },
  {
    "id": "M027",
    "name": "本批次学位评审材料归档移交；学院/研究生院、档案馆",
    "purpose": "研究稿 M027：完成归档后的移交清单与有权接收回执、决定号及授位批次；H→L7（仅进入归档程序后核）；学校档案管理系统可验真的移交登记及签收记录；不向学生催交校内移交单；F035/F023/F032；SRC-008/013/004；绑定已生效 M014、授位批次、归档规则版本；2026 6/12 月期限由 SRC-013 明示，9 月待核；缺 SU/PC，糊 UR，账与实体不符 CF。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
    "requiredElements": [
      "出具方及适用对象",
      "内容哈希、版本与生效时点",
      "可信证据来源及当前阶段"
    ],
    "acceptedKinds": [
      "pdf",
      "image",
      "office",
      "sheet",
      "text"
    ],
    "minCount": 0,
    "maxCount": 20,
    "allowReuseAcrossSubjects": false
  }
],
  sections:[{id:'r02-fact-review',name:'研究稿 R 规则逐项事实核验与人工审查',description:'每条 R 均为独立检查：未知政策或签发权限须转人工；不等于正式行政决定。',order:0,required:true,criteria:[
  {
    "id": "R001",
    "title": "L0 申请人身份同一性：T=建立本人案；F=尚无案→NA；U=是否本人不明→HD",
    "requirement": "| R001 L0 申请人身份同一性：T=建立本人案；F=尚无案→NA；U=是否本人不明→HD | SRC-001/004/007；F002/F003/F004/F032；M002 | A/B 学籍主键、合法更名链与材料人名逐笔比，取提交/签发时有效身份；吻合→PF | 同名异学号/冒名→CF，校方主记录失联→SU；申请人、学校学籍身份机关核查，不能按姓名合并 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R002",
    "title": "L0 真实申请意愿及申请归属：T=提交或确认草稿；F=未申请→NA；U=是否已提交不明→SU",
    "requirement": "| R002 L0 真实申请意愿及申请归属：T=提交或确认草稿；F=未申请→NA；U=是否已提交不明→SU | SRC-002/004/012；F001/F011/F020/F032；M001/M024 | 申请人可验签意愿 C 与受理机关 A/B 回执对应，草稿无回执不判缺；真实申请已签收→PF | 提交态 M001 真缺→NM，最新表单不明→PC；申请人补正/学院核实，不以旧纸本必交性硬判 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R003",
    "title": "L0 学位层次、类型、单位与学位点：T=有申请层次；F=未申请→NA；U=特殊资格来源不明→SU/PC",
    "requirement": "| R003 L0 学位层次、类型、单位与学位点：T=有申请层次；F=未申请→NA；U=特殊资格来源不明→SU/PC | SRC-001/002/004；F004/F005/F006/F007/F008；M003/M002 | 对学校有效培养/授权点 A/B 与申请类型精确比对，学校身份映射/授权点版本与申请期一致→PF | 硕/博或学术/专业错配→CF；港澳台/联合培养例外的校规未核→PC；培养部门核查，不自动转换学位 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R004",
    "title": "L0/L1 学籍及修业状态引用：T=进入前置资格审查；F=仍为纯草稿→NA；U=学籍机关不明→SU",
    "requirement": "| R004 L0/L1 学籍及修业状态引用：T=进入前置资格审查；F=仍为纯草稿→NA；U=学籍机关不明→SU | SRC-001/007；F009；M004 | 仅读学校学籍 A/B 生效状态及审批时间，原系统说“不在籍”也是可核事实→PF（并阻断后续、送学籍 Owner） | 状态来源失联→SU，修业年限规则版本不明→PC；不能将学位顺延改写为学籍延长 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R005",
    "title": "L1 毕业资格门禁：T=拟进入论文预审；F=尚未到资格门禁→NA；U=环节完成否不明→SU",
    "requirement": "| R005 L1 毕业资格门禁：T=拟进入论文预审；F=尚未到资格门禁→NA；U=环节完成否不明→SU | SRC-001 第1页；F010；M005 | 校方毕业资格审查 A/B 结论与申请人/签发批次匹配；明确“未通过”也如实记 PF+禁止进入后续阶段 | 申请人自传成绩表不能替代；缺权威结论→SU，有权部门认定待办→HD；学院培养审核 Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R006",
    "title": "L0/L5 有效批次及截止版本：T=明确拟参会批次；F=暂未选定→NA（并留待选批次）；U=公告是否调整不明→PC",
    "requirement": "| R006 L0/L5 有效批次及截止版本：T=明确拟参会批次；F=暂未选定→NA（并留待选批次）；U=公告是否调整不明→PC | SRC-001 第3页；F011/F012；M023 | 仅比对 2026 年学校通知与经确认的后续调期、申报批次；三次分委会与送件时点是年度具体日程，新年度不复用 | 超出当批次且有官方安排→记录下一批次事实，不判不授位；通知失联→SU、被改期未核→PC；学院/学位办 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R007",
    "title": "L2 导师意见签发真实性：T=已进入需导师审阅节点；F=尚未预审→NA；U=节点是否到期不明→HD",
    "requirement": "| R007 L2 导师意见签发真实性：T=已进入需导师审阅节点；F=尚未预审→NA；U=节点是否到期不明→HD | SRC-001/002/011；F013/F017；M006 | 对导师当期真实关系 A/B、意见签发人与论文版本；有权意见已形成→PF | 冒签或导师关系不一致→CF；原导师意见未可得→SU；导师及学院核验，导师资格另案 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R008",
    "title": "L2 论文预审结论引用：T=预审已进行或申请送审；F=还未预审→NA；U=预审状态不明→SU",
    "requirement": "| R008 L2 论文预审结论引用：T=预审已进行或申请送审；F=还未预审→NA；U=预审状态不明→SU | SRC-001/006；F014/F017；M007 | 核学院预审 A/B 专家结论、版本和日期；“不同意送审”亦只作为真实结果→PF，不重新评审 | 未完成整改/复审不能自动通过；材料不可读→UR；学院预审 Owner，2026 的预审要求由原 Owner 应用 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R009",
    "title": "L2 学术不端文字复制比检测结论：T=拟进入送审；F=尚未送审门禁→NA；U=送审节点未知→HD",
    "requirement": "| R009 L2 学术不端文字复制比检测结论：T=拟进入送审；F=尚未送审门禁→NA；U=送审节点未知→HD | SRC-001 第2页；F015/F017；M008 | 取学校检测 A/B 的“已通过相关检测程序”结论并比对送审稿版本；不从截图比率推断阈值 | 校方结论缺→SU；需专家处理→HD；学院检测责任主体，敏感检测报告 P3 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R010",
    "title": "L2 专家评阅结果引用：T=评阅已结束且拟答辩；F=专家未返回→NA；U=是否结束不明→SU",
    "requirement": "| R010 L2 专家评阅结果引用：T=评阅已结束且拟答辩；F=专家未返回→NA；U=是否结束不明→SU | SRC-001/004/006；F016/F017；M009 | 逐份追溯受托评阅/学院正式汇总结论 A/B 和送审论文标识；意见已回→PF（可能是未通过事实） | 专家原文 C/D 不代原渠道；回源失败→SU，版本相斥→CF；评阅 Owner/学院决定后续 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R011",
    "title": "L2/L3 论文主从版本链：T=至少两个相关阶段记录形成；F=只有初始稿→NA；U=版本标识不可辨→UR",
    "requirement": "| R011 L2/L3 论文主从版本链：T=至少两个相关阶段记录形成；F=只有初始稿→NA；U=版本标识不可辨→UR | SRC-001/006；F017/F027/F032；M008/M009/M010/M018 | 比较稿件摘要、提交时点、评阅/答辩关联的 sourceVersion；A/B 允许原 Owner 认定有效更改→PF | 新稿继承旧评阅不明→CF/HD；定向失效依赖 R009/010/012，不抹除历史；学院及原评阅 Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R012",
    "title": "L3 答辩结论存在与权限：T=答辩已经举行；F=尚未答辩→NA；U=答辩完成时间不明→SU",
    "requirement": "| R012 L3 答辩结论存在与权限：T=答辩已经举行；F=尚未答辩→NA；U=答辩完成时间不明→SU | SRC-002/004 第25–27条；F017/F018/F032；M010 | 答辩委员会原签发决议 A/B，绑定本人、论文版本及会议；只核“其正式结论为何”→PF | 未通过不得衍生通过；签名、人数、程序可信性不足→HD/PC；答辩组织回源，S08-T08 不重投票 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R013",
    "title": "L3 博士改授硕士建议例外：T=博士答辩委员会正式建议改授硕士；F=无此建议→NA；U=是否为该法定案由不明→HD",
    "requirement": "| R013 L3 博士改授硕士建议例外：T=博士答辩委员会正式建议改授硕士；F=无此建议→NA；U=是否为该法定案由不明→HD | SRC-004 第27–28条；F002/F005/F006/F008/F018/F033/F034/F032；M003/M010/M025/M026 | 核独立于原博士申请的本人明示同意 M025、本单位同学科专业是否已获硕士 M026、答辩委员会建议原文及目标硕士学位点 A/B；仅成立建议事实→PF | 无本人同意、目标类别未经核准→HD/CF；学校历史授位源失联→SU；仍须校学位评定委员会审定，原博士申请不得静默变更为硕士授位；学院/校学位办 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R014",
    "title": "L4 成果要求认定引用：T=适用学位点现行成果门槛已由有权部门确认；F=明确无该项要求→NA；U=门槛/适用类别不明→PC",
    "requirement": "| R014 L4 成果要求认定引用：T=适用学位点现行成果门槛已由有权部门确认；F=明确无该项要求→NA；U=门槛/适用类别不明→PC | SRC-002/004/010/011；F019/F005/F006/F008；M011/M003 | 只核 G06/S08-T05 的正式认定结论、标准版本和本人归属 A/B；认定“未达标”亦只陈述事实→PF | 不自行按论文数量、刊物、专利评分；认可结论失联→SU；原成果认定 Owner，不重开授权对象 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R015",
    "title": "L0/L4 正式提交与受理事实：T=申请已提交；F=仅草稿→NA；U=受理状态未知→SU",
    "requirement": "| R015 L0/L4 正式提交与受理事实：T=申请已提交；F=仅草稿→NA；U=受理状态未知→SU | SRC-001/004 第23条；F001/F020/F032；M001/M024 | 区分 submittedAt、官方 acceptedAt 与该轮申请截止日；原系统回执 A/B 有效→PF；截止日起60日为是否受理决定期限 | 缺申请人依法提交件→NM，受理机关回执失联→SU；60 日非授位倒计时；学校受理机关 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R016",
    "title": "L4 重复案和学位层次归属：T=同学号/层次/学位点存在并行申请或跨批次；F=唯一案无迁移→NA；U=历史案源不可得→SU",
    "requirement": "| R016 L4 重复案和学位层次归属：T=同学号/层次/学位点存在并行申请或跨批次；F=唯一案无迁移→NA；U=历史案源不可得→SU | SRC-001/004；F001/F002/F005/F006/F008/F011/F020/F032；M001/M003/M024 | 校方受理案源 A/B 按业务目的与生效记录比较；续批次只建立历史关联，不合并不同层次合法申请 | 真正重复冲突→CF，是否允许同批多次受理由学校核定→HD/PC；学位办维护案卷关系 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R017",
    "title": "L5 分委员会建议事实：T=分委会会议已召开且讨论本申请；F=会前→NA；U=会议状态不明→SU",
    "requirement": "| R017 L5 分委员会建议事实：T=分委会会议已召开且讨论本申请；F=会前→NA；U=会议状态不明→SU | SRC-001/002/005/009；F021/F011；M012 | 校内会议建议源 A/B 逐案对齐论文/申请冻结快照，授/不授/暂缓均作建议事实→PF | 会议材料不可读→UR，文件无签发或需裁量→HD；学院分委会/秘书，建议不决定授位 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R018",
    "title": "L5 分委会本案授权及会议程序可信性：T=有分委会建议欲作本案正式输入，且已到实际审议节点；F=会前无建议→NA（任命可另作非阻断准备核对）；U=授权来源/本案会议事实不明→PC/SU",
    "requirement": "| R018 L5 分委会本案授权及会议程序可信性：T=有分委会建议欲作本案正式输入，且已到实际审议节点；F=会前无建议→NA（任命可另作非阻断准备核对）；U=授权来源/本案会议事实不明→PC/SU | SRC-004 第9–11条、SRC-005/009/002；F021/F022/F032/F008；M012/M013/M003 | 两层联查但仅判断该建议能否作为有效有权会议建议引用：①当期对应学院/学位点成员任命、任期与获授权职责；②该次会议号、议程、真实参会、利益回避、投票/会议记录签发及建议内容。SRC-005 仅文法学院的组织实例，不能跨院作为任命证书；2025 章程全文须校方核准后才可执行法定人数和程序阈值 | 仅有盖章图或秘书文字不能 PF；会议已举行但源失联→SU，程序参数无现行文本→PC，需要合法性裁量→HD；学位办和本学院分委会核实，不得赋权给材料上传者 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R019",
    "title": "L5 暂缓建议的现行案由和效力：T=真正分委会建议中含“暂缓”；F=无此建议→NA；U=建议是否为现行校本可办理种类不明→PC",
    "requirement": "| R019 L5 暂缓建议的现行案由和效力：T=真正分委会建议中含“暂缓”；F=无此建议→NA；U=建议是否为现行校本可办理种类不明→PC | SRC-002/004/009；F021/F022/F023；M012/M013（不以前置 M014） | 将“建议文字确实存在”交 R017，本规则只核2025章程/现行授位制度是否允许该类建议、其原因/期限/恢复程序及校级决定权限；完整有效授权和政策源才可 PF(政策适用事实)，仍需校级决定 | 旧 2021 细则只可提示历史案由；当前无章程全文→PC、裁量→HD；建议绝不产生 F023 或改变已生效学位；分委会/校学位办政策 Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R020",
    "title": "L6 校级学位决定的存在、签发与对象：T=校学位评定委员会已经审议本案；F=尚待开会→NA（另记待人决定）；U=会议/名单未核→HD/SU",
    "requirement": "| R020 L6 校级学位决定的存在、签发与对象：T=校学位评定委员会已经审议本案；F=尚待开会→NA（另记待人决定）；U=会议/名单未核→HD/SU | SRC-003/004 第28–29条；F023/F001/F005/F006/F008/F032；M014/M003/M012 | 校学位评定委员会 A/B 决议与本人、学位类型、批次、会议号对齐；公告只能证明公布范围内的事实，不能代内部完整卷宗 | M014 不可信→HD/CF，已公开结果与可信内证抵触→CF；仅学校有权机关写正式决定，模板只记录其外部权威引用 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R021",
    "title": "L6 拟不授予/撤销前法定告知与申辩：T=真实有权机关正在拟作不授予/撤销决定，且尚未作决定；F=不属于该拟否定情形→NA；U=拟决定类型或程序启动节点未知→HD",
    "requirement": "| R021 L6 拟不授予/撤销前法定告知与申辩：T=真实有权机关正在拟作不授予/撤销决定，且尚未作决定；F=不属于该拟否定情形→NA；U=拟决定类型或程序启动节点未知→HD | SRC-004 第37/39条；F024/F032；M015（此时 M014 尚未形成，不得报缺） | 核拟决定内容、事实、理由、依据的决定前告知时间，陈述申辩的接收/听取机会与记录；合法机关已核事件才能 PF(程序事实) | 仅有会后公告不能倒推会前告知；校方记录失联→SU，程序是否充分待有权机关→HD，不能让学生补造通知；校级决策程序负责人 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R022",
    "title": "L7 正式决定的通知/送达事实：T=校级决定已形成且有权机关应通知本申请人；F=会前→NA；U=法定/校本送达时点与方式不明→PC",
    "requirement": "| R022 L7 正式决定的通知/送达事实：T=校级决定已形成且有权机关应通知本申请人；F=会前→NA；U=法定/校本送达时点与方式不明→PC | SRC-003/004 第29/39–41条；F023/F024/F032；M014/M015 | 用同一决定号对校方通知/送达流水、内容、接收人、时间与源版本进行比对，仅证已通知何事→PF，不把公告自动当个别送达 | 送达源失联→SU，签收/身份冲突→CF，现行送达方式 PC；学位办/通知机关；登记制证改由 R031，归档改由 R032 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R023",
    "title": "L3→L5 逾批次答辩后的排期顺延：T=答辩通过时间晚于官方当批次可处理截止节点；F=未逾期→NA；U=有无后续改期通知不明→PC",
    "requirement": "| R023 L3→L5 逾批次答辩后的排期顺延：T=答辩通过时间晚于官方当批次可处理截止节点；F=未逾期→NA；U=有无后续改期通知不明→PC | SRC-001 第3页；F011/F012/F018/F027；M010/M023/M018（仅换版时） | 用答辩原记录时间与最新可核会议/材料报送批次表比对，确属顺延→PF（仅排期事实） | 不推成“暂缓授予”或学籍延长；日期来源失联→SU，跨 2027 必须新公告→PC；学院/学位办重定审议批次 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R024",
    "title": "L8 补件、更正和版本替换：T=发生正式补正/换稿事件；F=无改动→NA；U=是否已被接收不明→SU",
    "requirement": "| R024 L8 补件、更正和版本替换：T=发生正式补正/换稿事件；F=无改动→NA；U=是否已被接收不明→SU | SRC-001/004；F027/F032/F017；M018/M024 | 校方接收的更新链 A/B 保存 oldVersion→newVersion、hash、签发者/时间、影响对象；完整→PF | 申请人新上传 C 未必已被学校正式采用；替代链缺→CF/SU；源 Owner 决定旧评阅是否仍适用，绝不覆盖有权校级决定 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R025",
    "title": "L8 撤回/重提对原申请的真实效力：T=本人或候选代理提出撤回/重提；F=无请求→NA；U=是否存在本案可信撤回请求不明→SU/HD",
    "requirement": "| R025 L8 撤回/重提对原申请的真实效力：T=本人或候选代理提出撤回/重提；F=无请求→NA；U=是否存在本案可信撤回请求不明→SU/HD | SRC-004/012；F026/F020/F031/F032；M017/M024，仅代理事件另取 M022 | 明确分开 requestRecordedAt（只证明意愿）、schoolAcceptedAt（接收）与 effectiveWithdrawalAt（学校核准撤回生效）；有代理则以 R029=PASSFACT（具体行为校方授权有效） 为前置门禁，按原受理号比对效果、范围和后续重新受理 | 本校撤回窗口/形式不明→PC，权力判断→HD，校方确认源失联→SU；只上传委托或点撤回时不得变更申请状态；申请人→学校有权受理机关 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R026",
    "title": "L8 学术评价复核：T=对评阅/答辩/成果学术评价结论提出异议；F=无此争议→NA；U=争议对象不清→HD",
    "requirement": "| R026 L8 学术评价复核：T=对评阅/答辩/成果学术评价结论提出异议；F=无此争议→NA；U=争议对象不清→HD | SRC-004 第40条；F028/F016/F018/F019/F032；M019 + 被争议 M009/M010/M011 | 核原学术结论、复核申请、学校受理日、重组专家与正式复核决定 A/B；受理后30日是复核机关办理期限 | 原定结论不是由本模板重审；申请依法必需内容缺→NM、受理源缺→SU；学校有权学术复核机关 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R027",
    "title": "L8 不受理/不授位/撤销决定复核：T=对这类正式行为不服；F=仅学术评价争议→NA；U=是否已有正式对象不明→SU/HD",
    "requirement": "| R027 L8 不受理/不授位/撤销决定复核：T=对这类正式行为不服；F=仅学术评价争议→NA；U=是否已有正式对象不明→SU/HD | SRC-004 第41条；F029/F023/F024/F020/F032；M020 + 已存在的 M024/M014/M015 | 对比正式原行为、申请、学校受理日期和复核决定 A/B；受理后30日内进行并决定；无校级决定时可对真实不受理行为复核 | 无正式争议对象不能捏造，不以 R026 结论覆盖；申请缺 NM、来源失联 SU；学校有权学位决定复核机关 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R028",
    "title": "L2–L7 涉密材料权限：T=校方认定涉密或保密程序适用；F=正式确认非涉密→NA；U=密级/权限不明→HD",
    "requirement": "| R028 L2–L7 涉密材料权限：T=校方认定涉密或保密程序适用；F=正式确认非涉密→NA；U=密级/权限不明→HD | SRC-002/004 第30条及 SRC-008；F030/F032；M021 | 以校方保密主管 A/B 认定的密级、允许流转人、渠道与论文源版本比对；相符→PF | 未验先隔离且不在普通待办展示原文；审批源缺 SU，规则细节旧版→PC；保密主管与学位办人工处理 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R029",
    "title": "L0/L8 代理某个具体动作的校方许可：T=观察到代理申请/提交/撤回/学术复核/决定复核任一具体动作；F=真实本人自行办理→NA；U=代理身份或动作类型不明→HD",
    "requirement": "| R029 L0/L8 代理某个具体动作的校方许可：T=观察到代理申请/提交/撤回/学术复核/决定复核任一具体动作；F=真实本人自行办理→NA；U=代理身份或动作类型不明→HD | SRC-004/012/009；F031/F004/F026/F028/F029/F032；M022 + 仅实际动作之 M001/M017/M019/M020 | 核实名委托人的身份、真实意愿、代理人身份、permittedAction、scope、起止时点与学校有权受理机关已经核准该动作的可信后台回执；不得以同意“提交”扩大为“撤回/复核”；授权与行为一一绑定后仅 PF(代理许可事实) | SRC-004 不直接证明校本准许代理；校内批准未核→PC/HD，委托书或 Renderer 角色声明本身没有权；签名冲突→CF，校方批准接口失联→SU；代理核准前只登记待验证意愿，不写正式受理/撤回/复核状态 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R030",
    "title": "全阶段 证据可读、验真和归属完整性：T=新进证据拟支持某事实检查；F=无新证据且不影响本次目标→NA；U=签发链或读权限不明→SU/HD",
    "requirement": "| R030 全阶段 证据可读、验真和归属完整性：T=新进证据拟支持某事实检查；F=无新证据且不影响本次目标→NA；U=签发链或读权限不明→SU/HD | SRC-001/003/004/008；F001/F002/F017/F020/F023/F032；M001–M027（逐实例，仅实际到期的对应 M） | 逐材料保存来源主体、原文位置、可读性、hash、版本、权威签发/受领时间；A/B 真实性可追→PF；C/D 不自动升级 | 文件存在但 OCR 不可读→UR；同一源签发矛盾→CF；接口失联→SU；值班经办/数据 Owner 回源，不由 Renderer 补假字段 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R031",
    "title": "L7 决议后的学位登记/证书状态关联：T=正式 M014 存在且学校已启动登记/证书流程；F=会前或尚未启动→NA；U=现行制证时间或登记渠道未知→PC",
    "requirement": "| R031 L7 决议后的学位登记/证书状态关联：T=正式 M014 存在且学校已启动登记/证书流程；F=会前或尚未启动→NA；U=现行制证时间或登记渠道未知→PC | SRC-001/003/004 第29条；F023/F025/F032；M014/M016 | 学校正式登记、证书制作/领取状态与校级决议号及学位层次精确配对，发证进度只证实该环节；已授学位可暂未制证 | 校内记录失联→SU，身份与证书条目冲突→CF；图像未采集/离校手续影响发放而非撤销决定；校学位办/证书部门 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R032",
    "title": "L7 2026年归档批次与实际移交签收：T=已正式授位且当前批次归档时点已到或真实移交事件已发生；F=尚无校级决定、尚未进入归档办理→NA；U=该批次通知/截止未知→PC",
    "requirement": "| R032 L7 2026年归档批次与实际移交签收：T=已正式授位且当前批次归档时点已到或真实移交事件已发生；F=尚无校级决定、尚未进入归档办理→NA；U=该批次通知/截止未知→PC | SRC-013/008/004 第30条；F035/F023/F032；M027/M014 | 核对授位批次、当年有权归档单位、移交清单/档案馆签收和来源版本；2026年6月→11月30日、12月→2027年3月30日由 SRC-013 配置。真实签收才 PF | 2026年9月与其他批次截止不从旧规类推→PC；归档回执失联→SU，扫描不可读→UR；由学院/研究生院/档案馆办，不能要求申请人提供内部记录 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "manual",
    "targetScope": "case"
  }
]}],
  policyVersionIds:[],
  stages:[
    {id:'intake',name:'登记与证据归类',kind:'auto-check',executorRole:'system',nextStageId:'fact-review',workflowOwner:'local'},
    {id:'fact-review',name:'证据与规则逐项核对',kind:'manual-review',executorRole:'reviewer',nextStageId:'human-decision',workflowOwner:'local'},
    {id:'human-decision',name:'政策、权限与最终结论人工确认',kind:'manual-review',executorRole:'teacher',workflowOwner:'local'},
  ],
  outputs:[
    {id:'r02-issue-feedback',kind:'item-feedback',audience:'reviewer'},
    {id:'r02-needed-materials',kind:'supplement-list',audience:'reviewer'},
  ],
  autoPassPolicy:{enabled:false},status:'draft',createdAt:'2026-10-24T00:00:00.000Z',
}

/** Research provenance only; never manufacture PolicyVersion or signed SourceRef. */
export const r02Metadata = {
  "templateId": "S08-T08",
  "name": "硕博士学位申请、延期授予及学位决定材料审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S08-T08.md",
  "sourceDocumentSha256": "56accce1b84e02dd71195153c33b8a23340229c3307f68f28d5de14aa577ffc4",
  "originalSourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/S08-T08.md",
  "originalSourceSha256": "1b1f806c72cc6c903ab1ba1d287aaa199cacd2d469a4bd312ce96da30a707eaa",
  "manifestSha256": "56accce1b84e02dd71195153c33b8a23340229c3307f68f28d5de14aa577ffc4",
  "manifestHashCheck": true,
  "officialSchoolTemplate": false,
  "researchDate": "2026-10-23",
  "policyEvidenceStatus": "PARTIAL",
  "sourceEvidence": [
    {
      "srcId": "SRC-001",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-001：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-002",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-002：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-003",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-003：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-004",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-004：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-005",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-005：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-006",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-006：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-007",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-007：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-008",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-008：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-009",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-009：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-010",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-010：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-011",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-011：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-012",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-012：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-013",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-013：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    }
  ],
  "criteria": [
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-007"
      ],
      "fieldIds": [
        "F002",
        "F003",
        "F004",
        "F032"
      ],
      "materialSlotIds": [
        "M002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-012"
      ],
      "fieldIds": [
        "F001",
        "F011",
        "F020",
        "F032"
      ],
      "materialSlotIds": [
        "M001",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "fieldIds": [
        "F004",
        "F005",
        "F006",
        "F007",
        "F008"
      ],
      "materialSlotIds": [
        "M002",
        "M003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "fieldIds": [
        "F009"
      ],
      "materialSlotIds": [
        "M004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F010"
      ],
      "materialSlotIds": [
        "M005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F011",
        "F012"
      ],
      "materialSlotIds": [
        "M023"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-011"
      ],
      "fieldIds": [
        "F013",
        "F017"
      ],
      "materialSlotIds": [
        "M006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-006"
      ],
      "fieldIds": [
        "F014",
        "F017"
      ],
      "materialSlotIds": [
        "M007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F015",
        "F017"
      ],
      "materialSlotIds": [
        "M008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-006"
      ],
      "fieldIds": [
        "F016",
        "F017"
      ],
      "materialSlotIds": [
        "M009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-006"
      ],
      "fieldIds": [
        "F017",
        "F027",
        "F032"
      ],
      "materialSlotIds": [
        "M008",
        "M009",
        "M010",
        "M018"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-002",
        "SRC-004"
      ],
      "fieldIds": [
        "F017",
        "F018",
        "F032"
      ],
      "materialSlotIds": [
        "M010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-004"
      ],
      "fieldIds": [
        "F002",
        "F005",
        "F006",
        "F008",
        "F018",
        "F032",
        "F033",
        "F034"
      ],
      "materialSlotIds": [
        "M003",
        "M010",
        "M025",
        "M026"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-010",
        "SRC-011"
      ],
      "fieldIds": [
        "F005",
        "F006",
        "F008",
        "F019"
      ],
      "materialSlotIds": [
        "M003",
        "M011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "fieldIds": [
        "F001",
        "F020",
        "F032"
      ],
      "materialSlotIds": [
        "M001",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "fieldIds": [
        "F001",
        "F002",
        "F005",
        "F006",
        "F008",
        "F011",
        "F020",
        "F032"
      ],
      "materialSlotIds": [
        "M001",
        "M003",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005",
        "SRC-009"
      ],
      "fieldIds": [
        "F011",
        "F021"
      ],
      "materialSlotIds": [
        "M012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-009"
      ],
      "fieldIds": [
        "F008",
        "F021",
        "F022",
        "F032"
      ],
      "materialSlotIds": [
        "M003",
        "M012",
        "M013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-009"
      ],
      "fieldIds": [
        "F021",
        "F022",
        "F023"
      ],
      "materialSlotIds": [
        "M012",
        "M013",
        "M014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-003",
        "SRC-004"
      ],
      "fieldIds": [
        "F001",
        "F005",
        "F006",
        "F008",
        "F023",
        "F032"
      ],
      "materialSlotIds": [
        "M003",
        "M012",
        "M014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-004"
      ],
      "fieldIds": [
        "F024",
        "F032"
      ],
      "materialSlotIds": [
        "M014",
        "M015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-003",
        "SRC-004"
      ],
      "fieldIds": [
        "F023",
        "F024",
        "F032"
      ],
      "materialSlotIds": [
        "M014",
        "M015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F011",
        "F012",
        "F018",
        "F027"
      ],
      "materialSlotIds": [
        "M010",
        "M018",
        "M023"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "fieldIds": [
        "F017",
        "F027",
        "F032"
      ],
      "materialSlotIds": [
        "M018",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-004",
        "SRC-012"
      ],
      "fieldIds": [
        "F020",
        "F026",
        "F031",
        "F032"
      ],
      "materialSlotIds": [
        "M017",
        "M022",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R026",
      "srcIds": [
        "SRC-004"
      ],
      "fieldIds": [
        "F016",
        "F018",
        "F019",
        "F028",
        "F032"
      ],
      "materialSlotIds": [
        "M009",
        "M010",
        "M011",
        "M019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R027",
      "srcIds": [
        "SRC-004"
      ],
      "fieldIds": [
        "F020",
        "F023",
        "F024",
        "F029",
        "F032"
      ],
      "materialSlotIds": [
        "M014",
        "M015",
        "M020",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R028",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-008"
      ],
      "fieldIds": [
        "F030",
        "F032"
      ],
      "materialSlotIds": [
        "M021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R029",
      "srcIds": [
        "SRC-004",
        "SRC-009",
        "SRC-012"
      ],
      "fieldIds": [
        "F004",
        "F026",
        "F028",
        "F029",
        "F031",
        "F032"
      ],
      "materialSlotIds": [
        "M001",
        "M017",
        "M019",
        "M020",
        "M022"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-008"
      ],
      "fieldIds": [
        "F001",
        "F002",
        "F017",
        "F020",
        "F023",
        "F032"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M003",
        "M004",
        "M005",
        "M006",
        "M007",
        "M008",
        "M009",
        "M010",
        "M011",
        "M012",
        "M013",
        "M014",
        "M015",
        "M016",
        "M017",
        "M018",
        "M019",
        "M020",
        "M021",
        "M022",
        "M023",
        "M024",
        "M025",
        "M026",
        "M027"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004"
      ],
      "fieldIds": [
        "F023",
        "F025",
        "F032"
      ],
      "materialSlotIds": [
        "M014",
        "M016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R032",
      "srcIds": [
        "SRC-004",
        "SRC-008",
        "SRC-013"
      ],
      "fieldIds": [
        "F023",
        "F032",
        "F035"
      ],
      "materialSlotIds": [
        "M014",
        "M027"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const
export const templateValidationIssues = validateTemplate(templateVersion)
