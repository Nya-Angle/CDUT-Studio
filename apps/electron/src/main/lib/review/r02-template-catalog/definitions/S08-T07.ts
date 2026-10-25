/** R02 S08-T07: mechanical, source-traceable V3 draft; no official school authorization. */
import type { TemplateVersion } from '@profer/shared'
import { validateTemplate } from '../../template-store'

export const templateVersion: TemplateVersion = {
  templateId: "S08-T07",
  version: 1, schemaVersion: 2, name: "研究生学位论文正式答辩资格与程序材料审核",
  description: "本地研究模板 · 非校方正式模板。研究生学位论文正式答辩资格与程序材料审核。仅做证据关联、事实审查、风险与补件建议；政策适用和最终决定由有权人员确认。",
  catalogKind: 'builtin',
  sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 非校方正式模板；审阅稿 docs/design/review-agent/business-templates/R02/S08-T07.md SHA-256 191e2129c33298aeef424b3d6d61ee475345eebe3229d39ee53b25b7e8ea1058；研究原件 docs/design/review-agent/business-templates/R02/research-original/S08-T07.md SHA-256 6d7af2eba3cc3d3b1a2e914a1966feff3162390bca3bb5d4868d389191aad599。SRC 为研究文献索引，不是案卷 SourceRef；校规及签批权待确认。",
  objectType:'person', displayName:{template:"研究生学位论文正式答辩资格与程序材料审核"},
  fields: [
  {
    "key": "F001",
    "label": "string Case本次答辩尝试ID/父案关系",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F001：string Case本次答辩尝试ID/父案关系；A0；后台可信Case创建事件→案卷源ID，不取文件名；P2；无ID阻止混案/HD；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F002",
    "label": "string Person学校学号/唯一学生标识",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F002：string Person学校学号/唯一学生标识；A0；校方学籍主记录→M001主键/查验回执；P2；SU；与上传姓名不符CONFLICT；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F003",
    "label": "string Person依法登记姓名与必要别名",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F003：string Person依法登记姓名与必要别名；A0；校方学籍主记录→M001姓名栏；P2；SU；OCR仅候选；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F004",
    "label": "enum+time Person在籍/延期/结业等学籍有效身份",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F004：enum+time Person在籍/延期/结业等学籍有效身份；A0；学籍管理正式状态→M001状态及生效日；P2；SU/HD，不能只看“在读”自述；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F005",
    "label": "enum Person硕士/博士当前学段",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F005：enum Person硕士/博士当前学段；A0；学籍+学位申请授权记录→M001；P1；SU；跨学段CONFLICT；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F006",
    "label": "enum Person学术/专业及工程博士论文途径",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F006：enum Person学术/专业及工程博士论文途径；A0；校方培养与学位类型记录→M001；P1；SU；实践成果单列人工路由；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F007",
    "label": "string Person培养单位、学科/专业及学位点",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F007：string Person培养单位、学科/专业及学位点；A0；校方学籍/培养主记录→M001；P1；SU；跨学院权限HD；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F008",
    "label": "relation[] Person导师/联合/行业导师与学生关系、有效期",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F008：relation[] Person导师/联合/行业导师与学生关系、有效期；A1；校方导师分配记录、S08-T01选择变更结果及T06-T01导师资格结果→M001或签认；P2；SU/CONFLICT；学生填报不生效；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F009",
    "label": "decisionRef Upstream毕业资格审查状态/时间/版本",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F009：decisionRef Upstream毕业资格审查状态/时间/版本；A1；学籍培养授权决定→M002；P2；SU；未判定非自动不通过；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F010",
    "label": "decisionRef Upstream课程与培养环节完成状态（含专业硕士的专业实践归口结果）",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F010：decisionRef Upstream课程与培养环节完成状态（含专业硕士的专业实践归口结果）；A1；培养业务授权结果→M002；P2；SU；明细疑问归源业务；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F011",
    "label": "decisionRef Upstream开题有效结论/日期/论文方向",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F011：decisionRef Upstream开题有效结论/日期/论文方向；A1；S08-T03/校方开题档案→M003；P2；SU；版本变更关联F013；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F012",
    "label": "decisionRef Upstream中期考核有效结论/日期",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F012：decisionRef Upstream中期考核有效结论/日期；A1；S08-T04/培养档案→M004；P2；SU；旧规定时距PU；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F013",
    "label": "decisionRef[] Upstream重大改题/方向变更申请和核准链",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F013：decisionRef[] Upstream重大改题/方向变更申请和核准链；A1条件；导师/学院及开题源业务正式审批→M005；P2；触发但无件NM/SU；不触发NA；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F014",
    "label": "decisionRef Upstream提前毕业/培养时限例外授权",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F014：decisionRef Upstream提前毕业/培养时限例外授权；A1条件；有权培养职能部门正式回执→M006；P2；触发而缺SU/HD；否则NA；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F015",
    "label": "string Thesis拟答辩论文题目、语言和成果形式",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F015：string Thesis拟答辩论文题目、语言和成果形式；A0/A1；学生提交稿+校方学位论文登记→M007首页/元数据；P2；NM/UR；与开题题目差异CONFLICT；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F016",
    "label": "hash+version Thesis送审、拟送委员、实际答辩稿关联版本",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F016：hash+version Thesis送审、拟送委员、实际答辩稿关联版本；A1/B0/C；校方收稿回执+只读文件指纹→M007源版本链；P2/P3；NM/CONFLICT；旧版预审失效待重核；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F017",
    "label": "decisionRef Upstream导师签认及意见时间、签认论文版",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F017：decisionRef Upstream导师签认及意见时间、签认论文版；A1；校方导师身份核权的审阅意见→M008；P2；SU/UR/HD；自填代签无效；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F018",
    "label": "decisionRef Upstream学院格式、质量/预审综合结论",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F018：decisionRef Upstream学院格式、质量/预审综合结论；A1；学院预审权威记录→M009；P2；SU/PU；仅引用结果；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F019",
    "label": "decisionRef Upstream学术不端检测处理结果及稿版",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F019：decisionRef Upstream学术不端检测处理结果及稿版；A1；校方检测业务最终判定→M010；P3；SU/UR；不得靠百分比私判；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F020",
    "label": "decisionRef Upstream最终可答辩评阅综合结果/有效版",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F020：decisionRef Upstream最终可答辩评阅综合结果/有效版；A1；盲评及有权处理系统→M011；P3；SU；C/D未处理挂源业务；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F021",
    "label": "relation Thesis评阅修改说明、导师/专家复核及对应稿版",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F021：relation Thesis评阅修改说明、导师/专家复核及对应稿版；A1条件；有权修改审查/导师签认→M012；P2；触发缺NM，是否触发按SRC-003；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F022",
    "label": "record Case正式答辩申请、申请人签认、受理状态/时间",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F022：record Case正式答辩申请、申请人签认、受理状态/时间；B0；校方申请受理回执/有权经办→M013；P2；NM/SU；不凭旧纸质表定唯一格式；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F023",
    "label": "enum+scheduleRef Case目标2026/后续授位批次及适用通知版本",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F023：enum+scheduleRef Case目标2026/后续授位批次及适用通知版本；B0；学院/研究生院批次安排→M013或M031；P1；PU；授位批次晚不否定答辩；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F024",
    "label": "PersonRef[] Organization拟/获核准答辩委员完整名单、角色、名单版",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F024：PersonRef[] Organization拟/获核准答辩委员完整名单、角色、名单版；B0；学院正式组织名单/学位办备案→M014；P2；NM/SU；异版CONFLICT；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F025",
    "label": "qualificationRef[] Organization每位委员内外单位、学科、专业资历、博士导师/行业资质",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F025：qualificationRef[] Organization每位委员内外单位、学科、专业资历、博士导师/行业资质；B0；校方任职及单位确认、合法专家履历→M014；P2；SU/HD；资格自述仅线索；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F026",
    "label": "relation[] Organization委员与申请人导师/近亲/利益回避关系",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F026：relation[] Organization委员与申请人导师/近亲/利益回避关系；B0；可信导师关系+学校利益冲突审查→M015；P3；SU/HD；发现重叠CONFLICT；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F027",
    "label": "PersonRef Organization答辩秘书及任命、职级/职责",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F027：PersonRef Organization答辩秘书及任命、职级/职责；B0；学院正式任命/名单→M016；P2；SU/PU；不能由文件署名自证；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F028",
    "label": "datetime+place Organization计划时间、地点、形式及历次更正",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F028：datetime+place Organization计划时间、地点、形式及历次更正；B0/B1；学院正式排期/公告→M017；P1/P3；NM/SU；改期后旧公告需重核；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F029",
    "label": "enum+decisionRef Organization公开公告或合法不公开/涉密批准",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F029：enum+decisionRef Organization公开公告或合法不公开/涉密批准；B1；学院公告及保密机关认可决定→M018；P1/P3；常规缺NM；涉密授权缺SU/HD；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F030",
    "label": "decisionRef Organization准许组织、审查/备案回执及有权签署者",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F030：decisionRef Organization准许组织、审查/备案回执及有权签署者；B1；学院/学位办对应授权业务→M019；P2；SU/HD；不能以表单盖章图等于授权；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F031",
    "label": "receiptRef Organization给委员的论文稿版/评阅材料交付确认",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F031：receiptRef Organization给委员的论文稿版/评阅材料交付确认；B1条件；学院秘书或安全投递平台回执→M020；P2/P3；是否须留档PU；有制度时NM/SU；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F032",
    "label": "attendance[] Session会议实际到场委员、请假、身份核验",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F032：attendance[] Session会议实际到场委员、请假、身份核验；C；答辩秘书/会议正式出席记录→M021；P2；C前NA；C后NM/CONFLICT；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F033",
    "label": "record+signature Session问答及程序纪要、秘书签认时间",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F033：record+signature Session问答及程序纪要、秘书签认时间；C/D；会议原始记录/秘书归档→M022；P3；C前NA；事后NM/UR；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F034",
    "label": "BallotRef[] Decision实际投票的有效票据/计票及封存标识（2026具体无记名形式待核）",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F034：BallotRef[] Decision实际投票的有效票据/计票及封存标识（2026具体无记名形式待核）；C/D；委员会/秘书受控投票档→M023；P3；C前NA；事后NM/HD；不得公开可识别投票人信息；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F035",
    "label": "integerSet Decision应到/实到/有效票/同意票统计与基数",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F035：integerSet Decision应到/实到/有效票/同意票统计与基数；C/D；会议统计与票据复核→M023；P3；C前NA；事后NM/CONFLICT；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F036",
    "label": "decisionRef Decision委员会正式答辩结果、全文、委员签认",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F036：decisionRef Decision委员会正式答辩结果、全文、委员签认；C/D；受权答辩委员会及签署档→M024；P2/P3；C前NA；事后NM/SU，不代签；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F037",
    "label": "eventRef Decision当场公布决议的时间、主持确认及例外",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F037：eventRef Decision当场公布决议的时间、主持确认及例外；C/D；会议记录/秘书原始留痕→M024/M022；P2；C前NA；事后NM/PU；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F038",
    "label": "hash+reviewRef Thesis答辩后修改和定稿、是否需追加复核",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F038：hash+reviewRef Thesis答辩后修改和定稿、是否需追加复核；D条件；本人论文/导师或学院复核记录→M025；P2/P3；未到D NA；触发而缺NM；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F039",
    "label": "receiptRef Handoff档案与论文提交交接清单、收讫时间",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F039：receiptRef Handoff档案与论文提交交接清单、收讫时间；D/E；学院档案经办/图书馆收讫→M026；P2；D前NA；现行目录未定PU；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F040",
    "label": "decisionRef Process原答辩尝试及其正式未通过/修改决定",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F040：decisionRef Process原答辩尝试及其正式未通过/修改决定；A1条件；上次委员会签署原始决定→M027；P2/P3；首次NA；重答辩缺SU/HD；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F041",
    "label": "decisionRef Process学校接受重新答辩申请及有效时限",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F041：decisionRef Process学校接受重新答辩申请及有效时限；B0条件；学校有权学位机构正式决定→M027；P2；首次NA；重答辩缺SU/HD；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F042",
    "label": "request+decisionRef Process撤回请求、提交人、处理结果及生效范围",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F042：request+decisionRef Process撤回请求、提交人、处理结果及生效范围；B0/D条件；校方可信受理及有权处分回执→M028；P2；未提出NA；提出未裁定HD；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F043",
    "label": "request+decisionRef Process评价/程序复核的申请、受理/决定及对象",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F043：request+decisionRef Process评价/程序复核的申请、受理/决定及对象；A1/C/D条件；有权源业务或学位授予单位→M029；P3；未提出NA；未裁定HD/PU；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F044",
    "label": "auditTrail Process任一签认的真实actor、机构、授权、生效日与审计ID",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F044：auditTrail Process任一签认的真实actor、机构、授权、生效日与审计ID；所有有决定阶段；服务端可信组织身份+签章认证/决定回执→各M证位；P3；SU/HD；Renderer传值不得替代；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F045",
    "label": "authorizationRef Person非本人代办/代撤/代签的身份与授权范围",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F045：authorizationRef Person非本人代办/代撤/代签的身份与授权范围；A0条件；学校确认的代理许可及本人授权→M030；P3；自称代办时SU/HD；本人NA；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F046",
    "label": "handoffRef Handoff答辩结果向后续分委员会/授位会议交接的只读引用",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F046：handoffRef Handoff答辩结果向后续分委员会/授位会议交接的只读引用；D/E；学院正式移交回执→M031；P2；D前NA；E失联SU；禁止合成学位决定；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F047",
    "label": "record Decision博士答辩拟建议授硕的委员会决定引用、本人同意及同校同学科/专业硕士学位历史核验",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F047：record Decision博士答辩拟建议授硕的委员会决定引用、本人同意及同校同学科/专业硕士学位历史核验；C/D条件；实际委员会决议、本人可信同意、校方学位历史只读记录→M032；P3；未触发NA；来源不可达SU；身份/同意冲突CONFLICT；裁量HD，不生成授位决定；枚举和复杂值待可信来源核验，不按文字猜类型。"
  }
],
  materialSlots: [
  {
    "id": "M001",
    "name": "学生身份、学段、学位类别、学院、导师关系；学籍/培养Owner",
    "purpose": "研究稿 M001：学生身份、学段、学位类别、学院、导师关系；学籍/培养Owner；在籍与培养主档；A0必，导师关系A1才核；校方只读学籍/导师主记录或授权查验回执；F002–F008/F044；SRC-001/010；学号、学籍时点、导师任命有效期；SU；用户证件糊UR，不替主档。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "毕业资格、培养环节达成；学籍/培养Owner",
    "purpose": "研究稿 M002：毕业资格、培养环节达成；学籍/培养Owner；校方毕业资格与培养结论；A1必；学位与研究生系统有效结果/人工正式回执；F009–F010/F044；SRC-001/010；对本学期/学生/结论版；SU；历史不一致CONFLICT。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "开题已合规完成及选题信息；S08-T03/培养Owner",
    "purpose": "研究稿 M003：开题已合规完成及选题信息；S08-T03/培养Owner；开题有效结论或变更后复开题结论；A1必（是否免除另核）；同源业务签认结果的引用，不索全套开题材料；F011/F044；SRC-010；原开题对应论文方向、重做版；SU/PU，扫描不清UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "中期合格、阶段有效；S08-T04/培养Owner",
    "purpose": "研究稿 M004：中期合格、阶段有效；S08-T04/培养Owner；中期考核正式结果；A1必（例外待核）；同源业务权威引用；F012/F044；SRC-010；时间与论文/学段对应；SU/PU，无法读取UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "重大改题、方向变更获准；开题主管/学院Owner",
    "purpose": "研究稿 M005：重大改题、方向变更获准；开题主管/学院Owner；变更批复及必要重开题决定；A1条件；学校变更审批日志；F013/F044；SRC-010；新旧标题/方向、批复版；触发缺NM/SU；不触发NA；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "提前毕业/特批例外确实生效；培养主管Owner",
    "purpose": "研究稿 M006：提前毕业/特批例外确实生效；培养主管Owner；有权部门正式例外批准；A1条件；校方规则豁免结果及授权审计；F014/F044；SRC-010；适用学段、有效期、例外范围；触发缺SU/HD；不触发NA；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "论文题目、答辩版本、送审版本连续；申请人提交，学院接收",
    "purpose": "研究稿 M007：论文题目、答辩版本、送审版本连续；申请人提交，学院接收；受控论文稿及系统收稿指纹；A1必，A0可暂缺；校方受控稿库直接关联，不重传全文；F015–F016/F044；SRC-001/003；送审→委员会审阅→实际答辩各自hash；A1缺NM/SU；版冲突CONFLICT；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "导师同意进入论文预审/送审及修改把关；导师Owner",
    "purpose": "研究稿 M008：导师同意进入论文预审/送审及修改把关；导师Owner；电子签认/可核的导师意见；A1必（具体表单PU）；经真实导师授权的系统签认；F017/F044；SRC-001/003/011；签认稿版、师生关系时点；SU/HD；签章图模糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "预审、格式与质量控制结果；学院Owner",
    "purpose": "研究稿 M009：预审、格式与质量控制结果；学院Owner；学院预审正式综合意见；A1必；业务系统结论；旧形式审查表仅候选；F018/F044；SRC-001/011；审查稿版、结论生效时点；SU；旧版或冲突CONFLICT；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "学术不端检测处理已经完成；检测主管Owner",
    "purpose": "研究稿 M010：学术不端检测处理已经完成；检测主管Owner；正式处理结果/审核回执；A1必（表名PU）；检测业务状态引用，禁止学生自报重复率替代；F019/F044；SRC-001/011；检测稿版、批准复核状态；SU/HD；报告不清UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "盲评最终处理是否许可进入答辩；送审主管Owner",
    "purpose": "研究稿 M011：盲评最终处理是否许可进入答辩；送审主管Owner；官方评阅综合有效结论及复/增评最终状态；A1必；源业务仅返回可答辩授权结论，不暴露盲评专家身份；F020/F044；SRC-001/003；对应论文hash与所有复评版；SU；尚无结论NM/HD；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。敏感或涉密原文不得进入普通上传/模型通道；需先由有权人员确定安全渠道与脱敏范围。",
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
    "name": "B意见/复评及修改说明闭合；申请人修稿、导师/有权专家把关",
    "purpose": "研究稿 M012：B意见/复评及修改说明闭合；申请人修稿、导师/有权专家把关；修改说明、校本附件签认；A1条件；源送审业务中的已核修改决定；免传重复论文；F021/F016/F044；SRC-003；指向具体意见、修改稿版、签认；条件成立缺NM；否则NA；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "正式答辩申请/学院受理及批次；本人/学院Owner",
    "purpose": "研究稿 M013：正式答辩申请/学院受理及批次；本人/学院Owner；校方申请记录、受理回执；B0必（最新表名PU）；受理系统有效记录；SRC-011旧《学位申请书》仅候选；F022–F023/F044；SRC-001/011；本次尝试、批次通知版本、申请人；未受理NM/PU；来源SU；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "委员会名册、内外单位与专业资质；学院组织Owner",
    "purpose": "研究稿 M014：委员会名册、内外单位与专业资质；学院组织Owner；正式拟聘/批准名单及可信资格证明；B0必；校方委员档、任职/行业身份核验；不强迫学生搜集履历；F024–F025/F044；SRC-002/004/006；与F030批准的名单版一致；SU/HD；空缺NM；材料不清UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "指导师/亲属/利益冲突回避；学院、导师关系Owner",
    "purpose": "研究稿 M015：指导师/亲属/利益冲突回避；学院、导师关系Owner；学校回避核验/必要声明；B0条件（有冲突必核）；校内导师关系与诚信申报审查；F026/F008/F044；SRC-002/006；按实际人、关系有效时间核；触发缺SU/HD；未触发NA；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "秘书身份、任命和职责；学院Owner",
    "purpose": "研究稿 M016：秘书身份、任命和职责；学院Owner；正式秘书任命/委员名单附页；B0必（资历硬门槛待核）；学院组织记录核验；F027/F044；SRC-002/005；学院授权版、秘书变更版；SU/PU；不清UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "具体答辩日期、地点、形式；学院Owner",
    "purpose": "研究稿 M017：具体答辩日期、地点、形式；学院Owner；排期通知/有效会议安排；B1必；学院可信排期记录；F028/F044；SRC-001/002/006；最新改期版与学生、委员关联；该阶段缺NM/SU；不清UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "一般公开或涉密合法例外；学院/保密Owner",
    "purpose": "研究稿 M018：一般公开或涉密合法例外；学院/保密Owner；公告或正式保密授权及受控安排；B1必（两种取其一）；校方公告系统/保密机关批准记录；F029/F044；SRC-002/006；公开范围、时点、密级及授权级；公告缺NM；涉密准许缺SU/HD；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。敏感或涉密原文不得进入普通上传/模型通道；需先由有权人员确定安全渠道与脱敏范围。",
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
    "name": "答辩组织方案真正获核准/备案；学院/校学位办Owner",
    "purpose": "研究稿 M019：答辩组织方案真正获核准/备案；学院/校学位办Owner；答辩资格/名单的正式核准/备案回执；B1必（审批层级PU）；签章或服务端授权流程记录；F030/F024/F044；SRC-001/002/011；核准人与权限、签时、名单版；SU/HD，未经正式核准不自认准予。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "答辩前已把论文交全体获任委员审阅；学院/秘书Owner",
    "purpose": "研究稿 M020：答辩前已把论文交全体获任委员审阅；学院/秘书Owner；受控投递/签收或有权人逐委员送达核验；B1法定事实必核，具体回执样式仍PU；校方投递日志或授权查验回执，不向学生重复索要；F031/F016/F024/F044；SRC-006第26条；委员名单版、送达时间早于开会、稿版承继；未送达NM；有权源不可读SU；实际送达有争议HD；仅回执表名未知不等于法定事实NA。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "实际参会人、人数、缺席与替补；委员会/秘书Owner",
    "purpose": "研究稿 M021：实际参会人、人数、缺席与替补；委员会/秘书Owner；真实签到/在线认证及会场记录；C后必；校方正式会议系统留痕/秘书核对；F032/F024/F044；SRC-002/006；实到身份与批准名册逐人对应；C前NA；C后NM/CONFLICT；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "程序、提问、作答、宣读及秘书记录；秘书Owner",
    "purpose": "研究稿 M022：程序、提问、作答、宣读及秘书记录；秘书Owner；当次答辩会议纪要及签认；C/D后生成必；学院正式档案记录；F033/F037/F044；SRC-005/006；会场/时间/会议id与M021一致；C前NA；事后NM；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "法定投票事实、票数及全体委员基数可核；委员会/秘书Owner",
    "purpose": "研究稿 M023：法定投票事实、票数及全体委员基数可核；委员会/秘书Owner；原始投票/计票及封存档；C/D后生成必；2026是否必须无记名及制式评定票样式PU；有权票据保管人提供的受控核验结论，普通界面不暴露原票；F024/F034–F035/F044；SRC-006第26条，SRC-002/005旧档；获批准全体委员数、实到、有效/同意票与会次逐版绑定；C前NA；事后缺原始表决证据NM/SU；票据样式PU、效力HD。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。敏感或涉密原文不得进入普通上传/模型通道；需先由有权人员确定安全渠道与脱敏范围。",
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
    "name": "正式通过/不通过等委员会决议与宣布事实；委员Owner",
    "purpose": "研究稿 M024：正式通过/不通过等委员会决议与宣布事实；委员Owner；签署的答辩委员会决议、当场宣布记载；C/D后生成必；官方决定档案及可核签认；F036–F037/F044；SRC-002/005/006；真委员签署、会议与表决版；C前NA；事后NM/SU；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "答辩后的论文修改与复核；本人、导师/学院Owner",
    "purpose": "研究稿 M025：答辩后的论文修改与复核；本人、导师/学院Owner；修订定稿、修改审阅回执；D条件；校方定稿库已签收版本；F038/F016/F044；SRC-005/008；当次委员会意见→定稿hash；触发缺NM；未到阶段NA；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "学位档案/图书馆论文移交；学院/档案馆/图书馆Owner",
    "purpose": "研究稿 M026：学位档案/图书馆论文移交；学院/档案馆/图书馆Owner；清单、馆藏接收证明；D/E后生成；正式档案/图书馆收讫记录；F039/F044；SRC-005/008；移交时间、论文终稿、案卷编号；D前NA；届时校本清单PU；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "再答辩旧决议及校方是否准许重答辩；原/现学位主管Owner",
    "purpose": "研究稿 M027：再答辩旧决议及校方是否准许重答辩；原/现学位主管Owner；旧委员会签字决议＋新申请审核决定；A1/B0条件；旧案不可变决定引用与有权机关回执；F040–F041/F044；SRC-002/006；旧新attempt明确不同，时限适用版；初次NA；重答辩缺SU/HD；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "id": "M028",
    "name": "撤回请求及真正处分结果；本人、受理/有权处分Owner",
    "purpose": "研究稿 M028：撤回请求及真正处分结果；本人、受理/有权处分Owner；授权请求、受理号与有权结果；B0或D条件；学校可核的电子申请/处置事件；F042/F044；SRC-006，校本未核；处理只影响指定尝试/阶段；未提出NA；已提无决定HD；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "id": "M029",
    "name": "复核对象、申请及有权机关处置；本人、评价/程序复核Owner",
    "purpose": "研究稿 M029：复核对象、申请及有权机关处置；本人、评价/程序复核Owner；学术/程序复核请求与处理回执；A1/C/D条件；校方申诉受理/复核业务只读决定；F043/F044；SRC-003/006；区分送审与答辩事件、法定期间；未提出NA；提交待处理HD/PU；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "id": "M030",
    "name": "代理人代办/代撤是否被授权；本人、校方授权机关Owner",
    "purpose": "研究稿 M030：代理人代办/代撤是否被授权；本人、校方授权机关Owner；正式代办授权及身份核验；A0后条件；学校可信代理授权事件；不复制多余证件；F045/F044；SRC-001/006，校本未核；授权对象、动作范围、截止、撤销；本人NA；代理缺SU/HD；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "id": "M031",
    "name": "仅交接正式答辩决定至后续学位审议；学院/学位办Owner",
    "purpose": "研究稿 M031：仅交接正式答辩决定至后续学位审议；学院/学位办Owner；正式移交目录与回执；D/E后生成；学位申请后续业务只读接收记录；F046/F036/F044；SRC-001/006/007；只读答辩决定与授位批次，不覆盖原票；D前NA；失联SU；糊UR。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "id": "M032",
    "name": "博士委员会建议授硕及本人同意、同校同学科/专业硕士学位历史；委员会/本人/校方记录Owner",
    "purpose": "研究稿 M032：博士委员会建议授硕及本人同意、同校同学科/专业硕士学位历史；委员会/本人/校方记录Owner；委员会原决议、可信本人同意、学位历史只读记录；C/D条件后生成；合法校方电子决定和授权学位历史查验，不强制上传额外敏感身份证明；F047/F036/F044；SRC-006第27–28条；同一博士attempt、本人同意时点、先前硕士学位专业匹配；未触发NA；缺可信同意不能自动建议成立；源失联SU、记录冲突CONFLICT、正式审定HD。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。敏感或涉密原文不得进入普通上传/模型通道；需先由有权人员确定安全渠道与脱敏范围。",
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
    "title": "A0｜硕/博正式学位论文答辩路由",
    "requirement": "| R001 A0｜硕/博正式学位论文答辩路由 | T=F005/006为研究生论文；F=本科/其他答辩→NA及建议转路由；U=论文或实践成果形式不明→HD；工程博士实践成果触发SC17人工分流 | SRC-001/004/006/012；F001/F005/F006/F015；M001/M007 | 对学段、成果形式与申请目标逐项对齐；当次有效；E3/E2优先；A0仅核M001与申请意向，M007到A1有稿才核，G50仅排重 | P=范围事实匹配；类型冲突CONFLICT；实践成果NEEDSHUMANDECISION→学院/目录Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R002",
    "title": "A0｜学生唯一身份与本案绑定",
    "requirement": "| R002 A0｜学生唯一身份与本案绑定 | T=新申请建案或有身份更新；F=无本次申请→NA；U=可信学号不可取得→SU；合法姓名更正只读G01结果 | SRC-001/012/013；F001–F003/F044；M001/M013 | 学号×案卷匹配，A0只要求M001；M013仅B0有正式申请后比较；姓名同名不代替学号；查询/更名生效点；E3>E2>E1>E0 | P=身份一致；两个合法源互斥CONFLICT→学籍Owner；错案禁止继续关联 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R003",
    "title": "A0｜当前学籍、学段、学院/学位类别",
    "requirement": "| R003 A0｜当前学籍、学段、学院/学位类别 | T=学生提出本次正式答辩；F=无申请→NA；U=在籍/身份不明→SU；特殊身份或跨学段不直接拒绝 | SRC-001/010；F004–F007；M001 | 学籍正式生效时点、培养单位权限与本次学段一致；E3/E2；入学状态例外请学籍Owner核 | P=精确记录原状态（即使原状态限制继续）；不符CONFLICT、未查到SU→学籍/培养单位 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R004",
    "title": "A1｜毕业资格源业务有效结论",
    "requirement": "| R004 A1｜毕业资格源业务有效结论 | T=推进论文预审/送审/答辩；F=仍停A0→NA；U=源业务未可访问→SU | SRC-001；F009；M002 | 引用权威毕业资格审查结论、签时和对应学生；2026通知为当年版本；E3/E2，不重算成绩 | P=忠实记录有权结论；无已形成结论NM，来源不通SU→学院/毕业资格Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R005",
    "title": "A1｜全部培养环节/专业实践源结论",
    "requirement": "| R005 A1｜全部培养环节/专业实践源结论 | T=拟转入论文送审后续；F=A0→NA；U=专业实践适用类别或豁免不明→PU | SRC-001/010；F006/F010；M002 | 按现行培养计划由Owner确认完成，不重复审核课程学分、专业实践报告；2021特殊专业实践条款未核现行；E3/E2 | P=引用培养结论；明细冲突CONFLICT，旧规强制数值PU→培养Owner/S08-T04 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R006",
    "title": "A1｜开题有效完成状态",
    "requirement": "| R006 A1｜开题有效完成状态 | T=送审后拟答辩；F=A0→NA；U=源开题状态不明→SU | SRC-001/010；F011/F015；M003/M007 | 仅引用S08-T03或学校正式开题结论及题目版本；旧时距不在本规则执行；E3/E2 | P=开题结论归属一致；变题疑问转R009，缺权威结果SU/NM→开题Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R007",
    "title": "A1｜中期考核有效完成状态",
    "requirement": "| R007 A1｜中期考核有效完成状态 | T=送审后拟答辩；F=A0→NA；U=是否存在合法例外不明→PU | SRC-001/010；F012；M004 | 引用S08-T04正式结论和时间、学生身份；2021中期规定需时效核对；E3/E2 | P=原结果确切；有权例外待核HD/PU，结论缺SU→培养/中期Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R008",
    "title": "A1/B1｜开题/中期至答辩时距及获批例外",
    "requirement": "| R008 A1/B1｜开题/中期至答辩时距及获批例外 | T=学校现行规定要求比较时距；F=尚无答辩日期或不适用的正式豁免→NA；U=2021阈值2026适用性不明→PU | SRC-010/001；F011/F012/F014/F028；M003/M004/M006/M017 | 用正式日期作日历差异事实，仅在经校方确认现行的时距配置下核合规；提前毕业例外及重开题不同规则，E3/E2 | P=仅日期关系被证实；阈值未核PU，例外批准效力HD→培养Owner/学位办，绝不按旧年数自动拒绝 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R009",
    "title": "A1｜重大改题及重新开题承继",
    "requirement": "| R009 A1｜重大改题及重新开题承继 | T=论文研究方向/主要内容发生重大变化或正式变更记录；F=源确认无重大变化→NA；U=是否重大需学术判断→HD | SRC-010/001；F011/F013/F015/F016；M003/M005/M007 | 对开题原题及本稿归档方向，查正式变更审批与重开题版；2021操作细节现行待核；E3/E2，高相似不等于没有重大变更 | P=核签认版承继；版本不一致CONFLICT、规则未知PU→导师/学院/开题Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R010",
    "title": "A1｜导师身份关系及本稿签认",
    "requirement": "| R010 A1｜导师身份关系及本稿签认 | T=导师审阅或修改把关应发生；F=尚未进入A1→NA；U=导师关系主档未到→SU | SRC-001/003；F008/F017/F016；M001/M008/M007 | 正式导师关系生效日+签认人授权+所签论文hash；不接受“本人称已签”；E3/E2 | P=签认及版对应；签认者身份存疑HD、错导师CONFLICT→导师岗位Owner/学院 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R011",
    "title": "A1/B1/C｜论文稿身份、所属人及版本链",
    "requirement": "| R011 A1/B1/C｜论文稿身份、所属人及版本链 | T=有论文稿/论文送审结论或拟举行答辩；F=A0尚无稿→NA；U=没有可比hash或材料映射→SU/HD | SRC-001/003；F002/F015/F016；M001/M007/M011 | 校方收稿版本→送审→提交委员→实际答辩逐版关联；不是要求全部hash必须相同；E3受控收稿优先 | P=关系可溯；旧结论错配稿CONFLICT→论文送审Owner，触发定向重审R010/R012–R015 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R012",
    "title": "A1｜格式/学院质量预审结果",
    "requirement": "| R012 A1｜格式/学院质量预审结果 | T=已申请论文送审；F=仅咨询A0→NA；U=预审归口/现行表名未知→PU | SRC-001/011；F018/F016；M009/M007 | 2026通知明确预审环节，但2024旧形式审查表不是2026定式；只读学院原结论及稿版；E3/E2 | P=原结论及绑定事实；没有形成结果NM、校本表格式PU→学院预审Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R013",
    "title": "A1｜学术不端检测处理结论",
    "requirement": "| R013 A1｜学术不端检测处理结论 | T=有论文拟送审；F=未进入相关阶段→NA；U=检测处理源无法取得→SU | SRC-001/011；F019/F016；M010/M007 | 检测版指纹、学院按其权限作的审核结果；2024旧表名不绑定；不能凭比例自动判定学术不端；E3/E2 | P=引用真实处理结果；只有检测率截图HD、版本冲突CONFLICT→检测/学院Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R014",
    "title": "A1｜论文评阅最终准入处理",
    "requirement": "| R014 A1｜论文评阅最终准入处理 | T=送审/复评已发起；F=送审未到阶段→NA；U=最终综合处理未返回→SU/NM | SRC-001/003；F020/F016；M011/M007 | 依2024评阅办法从合法终局记录核“源业务是否许可进入答辩”，不同学段送审数量由源业务判；E3/E2 | P=准确引用准入/不准入结论；C/D未闭合HD/SU，不可本案自改→送审Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R015",
    "title": "A1｜送审后修改、复增评意见闭合",
    "requirement": "| R015 A1｜送审后修改、复增评意见闭合 | T=源结论明确要求修改或后续审批；F=源确认无修改要求→NA；U=要求类型未知→SU/HD | SRC-003；F021/F016/F020；M012/M011/M007 | 逐条对应原意见、修改稿、签认人和有效结果；匿名评阅者不暴露；2024现行办法E3/E2 | P=修改记录与要求一致；规定必有却缺NM、对应稿冲突CONFLICT→导师/学院/送审Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R016",
    "title": "B0｜正式答辩申请与受理关联",
    "requirement": "| R016 B0｜正式答辩申请与受理关联 | T=正式提起一次答辩申请；F=只有A0咨询→NA；U=学校2026表单/受理格式不明→PU | SRC-001/011/009；F001/F022/F023；M013 | 对申请本人、attempt、受理回执、通知批次版本；不把2024纸表作为2026唯一格式；E3/E2 | P=存在本次可信受理事实；未受理NM/SU、格式PU→学院经办/学位办 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R017",
    "title": "B0｜普通硕博委员会基础名单与资历",
    "requirement": "| R017 B0｜普通硕博委员会基础名单与资历 | T=拟由学校正式组建答辩委员会；F=停A1且无组织草案→NA；U=2021人数及资格规则现行不明→PU | SRC-002/006；F024/F025；M014 | 委员人数、学历/职称、校内外来源及角色仅按现行适用校规/法律核；批准名册版、E3/E2；不把旧校规阈值硬判 | P=名单事实和已确认最低要求成立；资格无法确认SU/HD、阈值PU→学院/学位办 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R018",
    "title": "B0｜学术/专业硕士委员会特别身份",
    "requirement": "| R018 B0｜学术/专业硕士委员会特别身份 | T=F005硕士且F006分为学术或专业；F=博士→NA；U=学位性质或校外专家有效类别不明→SU/HD | SRC-002/006；F005/F006/F025；M001/M014 | 分别比对校外学术专家或行业专家的真实从业资历；2021差别规定若未证实现行则PU；E3/E2 | P=特定人员身份可证；类别不符CONFLICT、政策PU→学院学位办 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R019",
    "title": "B0｜工程类博士论文专门委员来源",
    "requirement": "| R019 B0｜工程类博士论文专门委员来源 | T=F006明确工程博士学位论文；F=其他论文类别或实践成果→NA/SC17分流；U=行业身份/特别适用方案不明→SU/HD | SRC-004第九部分/SRC-006第26条；F005/F006/F024/F025；M001/M014 | 2025工程博士试行文件p.15载明委员会不少于5人且单数、校外非同一单位相关行业企业专家不少于2人；核真实资历、来源单位和批准名册；若后续新规冲突交学位办 | P=可证组成与来源事实；来源SU、名单不匹配CONFLICT/HD→工程博士学院/学位办；实践成果不在此自动处理 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R020",
    "title": "B0｜导师/共同导师/亲属利益关系回避",
    "requirement": "| R020 B0｜导师/共同导师/亲属利益关系回避 | T=已拟委员会名单；F=名单尚未形成→NA；U=师生关系及近亲关系权威核不到→SU/HD | SRC-002/006；F008/F024/F026；M001/M014/M015 | 校方导师关系、委员身份、正式回避审查逐人核对；资格审批时点，2021校本细节PU；E3/E2，隐私P3 | P=回避核查完成事实；关系重叠CONFLICT、法律事实需裁量HD→学院学位办/组织者 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R021",
    "title": "B0｜答辩秘书确实受任命",
    "requirement": "| R021 B0｜答辩秘书确实受任命 | T=已有拟正式委员会；F=组织未启动→NA；U=秘书职级门槛2026未知→PU | SRC-002/005；F027/F044；M016 | 学院正式任命与姓名、会议、职责、签名授权对齐；2021职级细则待核；E3/E2 | P=任命事实；冒名CONFLICT/HD、职级硬阈值PU→学院组织人 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R022",
    "title": "B1｜本次时间、地点、形式与公告版本",
    "requirement": "| R022 B1｜本次时间、地点、形式与公告版本 | T=学校已有准备举行的批准方案；F=B0草案尚未获批→NA；U=改期审批要求不明确→PU | SRC-001/002/006；F024/F028/F030；M014/M017/M019 | 对正式批准方案和最新公告/排期的会次、时间、地点、形式逐字段校验；涉密公布例外另R023，E3/E2 | P=计划一致；改期与旧备案不一致CONFLICT→学院组织人重新核定 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R023",
    "title": "B1｜公开答辩或合法不公开例外",
    "requirement": "| R023 B1｜公开答辩或合法不公开例外 | T=答辩组织已获核准；F=未到B1→NA；U=密级/保密适用路径不明→HD/PU | SRC-002/006；F029/F028；M018/M017 | 常规查学校公告；经真实校方保密许可的涉密稿以受控安排替代公开公告；E3/E2且按密级限权 | P=公开或合法例外的事实可证；没有授权SU/HD，非公示不能一律认错→保密部门/学院 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R024",
    "title": "B1｜资格/组织方案有权批准和备案",
    "requirement": "| R024 B1｜资格/组织方案有权批准和备案 | T=拟从B0进入正式答辩待举行；F=尚仅讨论草案→NA；U=2026审批层级、签发人授权不可证→HD/PU | SRC-001/002/011；F022/F024/F030/F044；M013/M014/M019 | 签发人的服务端主体、机构、授权、名单版、决定时间和备案回执均要一致；2024旧流程不可自成决定，E3/E2 | P=批准记录存在且可验证的事实，不是软件准予；无准入回执SU/HD→学位办/学院有权负责人 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R025",
    "title": "B1｜答辩前逐委员论文交付及版本",
    "requirement": "| R025 B1｜答辩前逐委员论文交付及版本 | T=进入正式答辩前组织阶段；F=未到B1/委员会未成立→NA；U=名单或受控送达事实无法核→SU/HD | SRC-006第26条；F016/F024/F031；M007/M014/M020 | 对全体获任委员逐人核交付、送达早于会议、论文稿版本承继；法定交付义务确定，具体回执表单是否强制未知PU；E3/E2送达审计可替代纸签 | P=逐委员送达事实；确知未送达NM，来源失联SU，版本冲突CONFLICT，程序效力HD→学院/秘书/学位办 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R026",
    "title": "C｜委员会真实出席及法定开会人数事实",
    "requirement": "| R026 C｜委员会真实出席及法定开会人数事实 | T=答辩实际举行；F=尚未举行→NA；U=官方会议发生状态不明→SU | SRC-002/006；F024/F032；M014/M021 | 实到逐人对应批准名单及身份；以国家法的组成要求和核现行校本的出席规则核，不从计划名单推实际参会；E3/E2 | P=出席事实准确可核；错人/缺席冲突CONFLICT，程序效力HD→秘书/主席/学院 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R027",
    "title": "C/D｜会议问答与秘书记录形成",
    "requirement": "| R027 C/D｜会议问答与秘书记录形成 | T=真实会场已举行；F=未举行→NA；U=秘书留存介质无法读取→UR | SRC-005/006；F027/F033/F037；M016/M022 | 校方原始纪要对学生、会议、问答、秘书签认和时间；2018具体归档格式PU，E3/E2 | P=记录与会次一致；缺当次记录NM/SU、签认者不明HD→答辩秘书/学院 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R028",
    "title": "C/D｜票据数、全体委员法定分母与表决数",
    "requirement": "| R028 C/D｜票据数、全体委员法定分母与表决数 | T=委员会已表决；F=尚未投票→NA；U=完整批准名单或受控票据不可访问→SU | SRC-006第26条/SRC-005历史归档；F024/F032/F034/F035；M014/M021/M023 | 全体获任组成人员数N为法定分母，核同意票Y与3Y >= 2N，再比投票总张数、实际出席、有效/无效票及决议；不能以实到人数代替分母，仅算术不决定程序效力 | P=票数及法定算式事实准确；7人全体中4赞成不能因实到6人而算通过；票/名册冲突CONFLICT，签认/效力HD→秘书/主席/学位办 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R029",
    "title": "C/D｜委员会正式决议、签认与当场宣布",
    "requirement": "| R029 C/D｜委员会正式决议、签认与当场宣布 | T=委员会已完成会议决议；F=未发生→NA；U=真实签字或宣布记录无法确认→SU/HD | SRC-002/005/006；F033/F036/F037/F044；M022/M024 | 正式决议文书与会次、成员、投票结果、签认时间、当场宣读事实相互印证；E3/E2，不能由AI补写投票结论 | P=有权委员会已签决议的真实性可证；票/文冲突CONFLICT→委员/秘书/学院；只有委员会决定产生学术效力 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R030",
    "title": "D｜答辩后修改、最终论文及复核",
    "requirement": "| R030 D｜答辩后修改、最终论文及复核 | T=委员会/学院明示答辩后修改或需提供定稿；F=无该要求或尚未答辩→NA；U=修改范围/是否应重评未知→HD/PU | SRC-005/008；F016/F036/F038；M007/M024/M025 | 修改说明与当次决议、定稿文件hash、导师/学院确认匹配；2026图书馆提交与委员会决定分阶段，E3/E2 | P=修订稿和授权审阅事实；缺定稿但未到应交节点NA，需交时NM；学术充分性HD→导师/学院 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R031",
    "title": "D/E｜答辩档案及后续受理交接",
    "requirement": "| R031 D/E｜答辩档案及后续受理交接 | T=学院进入当次归档/移交节点；F=仍在B/C或尚未被要求移交→NA；U=2018旧目录对应2026清单未知→PU | SRC-001/005/008/007；F039/F046/F036；M024/M026/M031 | 以正式答辩决议只读指针和档案收讫、论文定稿版、批次受理号核对；不把后续学位委员会决定写回；E3/E2 | P=交接事实；移交源失联SU、旧归档清单PU→学院档案/学位办/图书馆 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R032",
    "title": "A1/B0｜重新答辩的旧案约束与新案权限",
    "requirement": "| R032 A1/B0｜重新答辩的旧案约束与新案权限 | T=以前正式答辩未通过且本人重新申请；F=首次答辩→NA；U=可再次答辩时限、次数与批准主体2026有效性未知→PU/HD | SRC-002/006；F001/F016/F040/F041；M007/M027 | 对旧决议签认、原attempt、新论文版本与新许可逐对象关联；旧2021重答辩具体期限不自动作为拒件门槛；E3/E2 | P=旧新决定引用关系可证；未获校方重答辩受理HD/SU→学位办/学院，不能继承旧通过票 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R033",
    "title": "D/E｜2026授位批次与正式答辩非同一日期",
    "requirement": "| R033 D/E｜2026授位批次与正式答辩非同一日期 | T=授位材料须移交或改批次；F=仍是A1前置→NA；U=学校调整通知未取得→PU | SRC-001/007；F023/F036/F046；M013/M024/M031 | 将SRC-001授位报送日、实际发生的答辩日和正式新批次版本分别存储；晚交只提示授位审议路由，E3/E2 | P=批次流转事实；学校调整版缺PU/SU→学院学位办；不能因为跨批次撤销已合法答辩 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R034",
    "title": "B0/D｜申请撤回及处分的双事件",
    "requirement": "| R034 B0/D｜申请撤回及处分的双事件 | T=有人正式请求撤回当前attempt；F=从未提出→NA；U=撤回节点/效力/代理授权不明→PU/HD | SRC-006/001；F001/F042/F044；M028 | withdrawrequest与有权withdrawdisposition分别存，核本人/授权、时点、目标案和正式回执；2026校本受理规则未知；E3/E2 | P=只说明请求或处分回执存在；请求绝不自行失效原正式决议，没权限HD→学院/学位办 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R035",
    "title": "A1/C/D｜送审/答辩学术复核与学位处置复核分流",
    "requirement": "| R035 A1/C/D｜送审/答辩学术复核与学位处置复核分流 | T=法定主体针对特定评价/程序提出异议；F=未提出→NA；U=目标或受理机关不明→HD/PU | SRC-003第11条/SRC-006第40–41条；F020/F036/F043/F044；M011/M024/M029 | 区分送审业务、答辩学术评价第40条和不受理学位申请/不授位/撤销授位等第41条；核受理日至决定日的法定30日要求；申请期限及校本申诉办法仍PU，30日不是申请人提出异议的期限，不能套送审5工作日 | P=对象与受理事实可核；逾期事实提示而法律效力HD→学位授予单位及复核机关；不得代作决定 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R036",
    "title": "任意实质动作｜签发权限和代理权限",
    "requirement": "| R036 任意实质动作｜签发权限和代理权限 | T=任一“同意/批准/撤回/复核/签署”拟改变业务效力；F=仅用户阅读/草稿事实提取→NA；U=服务端权限或代理授权不可校验→HD | SRC-001/002/006/012/013/014；F030/F036/F042–F045；M019/M024/M028–M030 | 检查真实subject、学校机构、有效角色、动作范围、签时和目标attempt/sourceVersion；区分本人代办与委员投票不可代签；E3/E2唯一可信，Renderer E0无权 | P=身份与权限核验事实；越权/伪造CONFLICT/HD→校方管理员/有权业务机关，模型禁止提交正式决定 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R037",
    "title": "所有阶段｜政策来源适用、文件时效及跨域防重",
    "requirement": "| R037 所有阶段｜政策来源适用、文件时效及跨域防重 | T=规则欲以SRC造成校方资格/必交/审批效果；F=仅记录非约束事实→NA；U=现行版、学段/批次/特例未核→PU | SRC-001–020（SRC-012–016仅项目技术/范围，不作校方法源）；F005/F006/F023/F044；M001/M013/M014/M019 | 锁定issuer+title+clause+effectivefrom/to+scope+batch+confirmedby；2025同名新细则SRC-017/018正文未取得，SRC-002独有人员、签章、时限阈值PU；第26条国家法和2025工程博士特例可独立核相应事实，但不由AI决定许可 | P=适用来源事实已证实；错校/旧条冲突CONFLICT，新版未核PU→研究生院学位办/制度Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R038",
    "title": "C/D｜博士委员会建议授硕的证据与同意关系",
    "requirement": "| R038 C/D｜博士委员会建议授硕的证据与同意关系 | T=博士正式答辩委员会依据第27条提出特殊建议；F=硕士答辩/博士委员会无此建议→NA；U=决定类别或学位历史不明→SU/HD | SRC-006第27–28条；F002/F005/F036/F044/F047；M001/M024/M032 | 核委员会正式建议、本人明确同意、未曾获得本单位同学科/专业硕士学位的权威查询、原博士attempt版本关系；由S08-T08移交学位评定委员会审定。“达到硕士水平”是委员会学术判断，不由AI评分 | P=有权决议/同意/历史状态的客观事实；同意缺NM、学位历史冲突CONFLICT、权威来源失联SU、正式审定HD→委员会/学位办/S08-T08 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
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
  "templateId": "S08-T07",
  "name": "研究生学位论文正式答辩资格与程序材料审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S08-T07.md",
  "sourceDocumentSha256": "191e2129c33298aeef424b3d6d61ee475345eebe3229d39ee53b25b7e8ea1058",
  "originalSourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/S08-T07.md",
  "originalSourceSha256": "6d7af2eba3cc3d3b1a2e914a1966feff3162390bca3bb5d4868d389191aad599",
  "manifestSha256": "191e2129c33298aeef424b3d6d61ee475345eebe3229d39ee53b25b7e8ea1058",
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
    },
    {
      "srcId": "SRC-014",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-014：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-015",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-015：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-016",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-016：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-017",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-017：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-018",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-018：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-019",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-019：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    },
    {
      "srcId": "SRC-020",
      "evidenceStatus": "PARTIAL",
      "title": "SRC-020：参见同 ID 研究稿第 04 节，来源有效性及适用批次需逐条复核"
    }
  ],
  "criteria": [
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-006",
        "SRC-012"
      ],
      "fieldIds": [
        "F001",
        "F005",
        "F006",
        "F015"
      ],
      "materialSlotIds": [
        "M001",
        "M007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-012",
        "SRC-013"
      ],
      "fieldIds": [
        "F001",
        "F002",
        "F003",
        "F044"
      ],
      "materialSlotIds": [
        "M001",
        "M013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F004",
        "F005",
        "F006",
        "F007"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F009"
      ],
      "materialSlotIds": [
        "M002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F006",
        "F010"
      ],
      "materialSlotIds": [
        "M002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F011",
        "F015"
      ],
      "materialSlotIds": [
        "M003",
        "M007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F012"
      ],
      "materialSlotIds": [
        "M004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F011",
        "F012",
        "F014",
        "F028"
      ],
      "materialSlotIds": [
        "M003",
        "M004",
        "M006",
        "M017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F011",
        "F013",
        "F015",
        "F016"
      ],
      "materialSlotIds": [
        "M003",
        "M005",
        "M007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "fieldIds": [
        "F008",
        "F016",
        "F017"
      ],
      "materialSlotIds": [
        "M001",
        "M007",
        "M008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "fieldIds": [
        "F002",
        "F015",
        "F016"
      ],
      "materialSlotIds": [
        "M001",
        "M007",
        "M011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001",
        "SRC-011"
      ],
      "fieldIds": [
        "F016",
        "F018"
      ],
      "materialSlotIds": [
        "M007",
        "M009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-011"
      ],
      "fieldIds": [
        "F016",
        "F019"
      ],
      "materialSlotIds": [
        "M007",
        "M010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "fieldIds": [
        "F016",
        "F020"
      ],
      "materialSlotIds": [
        "M007",
        "M011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-003"
      ],
      "fieldIds": [
        "F016",
        "F020",
        "F021"
      ],
      "materialSlotIds": [
        "M007",
        "M011",
        "M012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-009",
        "SRC-011"
      ],
      "fieldIds": [
        "F001",
        "F022",
        "F023"
      ],
      "materialSlotIds": [
        "M013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-002",
        "SRC-006"
      ],
      "fieldIds": [
        "F024",
        "F025"
      ],
      "materialSlotIds": [
        "M014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-002",
        "SRC-006"
      ],
      "fieldIds": [
        "F005",
        "F006",
        "F025"
      ],
      "materialSlotIds": [
        "M001",
        "M014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-004",
        "SRC-006"
      ],
      "fieldIds": [
        "F005",
        "F006",
        "F024",
        "F025"
      ],
      "materialSlotIds": [
        "M001",
        "M014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-002",
        "SRC-006"
      ],
      "fieldIds": [
        "F008",
        "F024",
        "F026"
      ],
      "materialSlotIds": [
        "M001",
        "M014",
        "M015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-002",
        "SRC-005"
      ],
      "fieldIds": [
        "F027",
        "F044"
      ],
      "materialSlotIds": [
        "M016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006"
      ],
      "fieldIds": [
        "F024",
        "F028",
        "F030"
      ],
      "materialSlotIds": [
        "M014",
        "M017",
        "M019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-002",
        "SRC-006"
      ],
      "fieldIds": [
        "F028",
        "F029"
      ],
      "materialSlotIds": [
        "M017",
        "M018"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-011"
      ],
      "fieldIds": [
        "F022",
        "F024",
        "F030",
        "F044"
      ],
      "materialSlotIds": [
        "M013",
        "M014",
        "M019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-006"
      ],
      "fieldIds": [
        "F016",
        "F024",
        "F031"
      ],
      "materialSlotIds": [
        "M007",
        "M014",
        "M020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R026",
      "srcIds": [
        "SRC-002",
        "SRC-006"
      ],
      "fieldIds": [
        "F024",
        "F032"
      ],
      "materialSlotIds": [
        "M014",
        "M021"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R027",
      "srcIds": [
        "SRC-005",
        "SRC-006"
      ],
      "fieldIds": [
        "F027",
        "F033",
        "F037"
      ],
      "materialSlotIds": [
        "M016",
        "M022"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R028",
      "srcIds": [
        "SRC-005",
        "SRC-006"
      ],
      "fieldIds": [
        "F024",
        "F032",
        "F034",
        "F035"
      ],
      "materialSlotIds": [
        "M014",
        "M021",
        "M023"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R029",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-006"
      ],
      "fieldIds": [
        "F033",
        "F036",
        "F037",
        "F044"
      ],
      "materialSlotIds": [
        "M022",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R030",
      "srcIds": [
        "SRC-005",
        "SRC-008"
      ],
      "fieldIds": [
        "F016",
        "F036",
        "F038"
      ],
      "materialSlotIds": [
        "M007",
        "M024",
        "M025"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-007",
        "SRC-008"
      ],
      "fieldIds": [
        "F036",
        "F039",
        "F046"
      ],
      "materialSlotIds": [
        "M024",
        "M026",
        "M031"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R032",
      "srcIds": [
        "SRC-002",
        "SRC-006"
      ],
      "fieldIds": [
        "F001",
        "F016",
        "F040",
        "F041"
      ],
      "materialSlotIds": [
        "M007",
        "M027"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R033",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "fieldIds": [
        "F023",
        "F036",
        "F046"
      ],
      "materialSlotIds": [
        "M013",
        "M024",
        "M031"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R034",
      "srcIds": [
        "SRC-001",
        "SRC-006"
      ],
      "fieldIds": [
        "F001",
        "F042",
        "F044"
      ],
      "materialSlotIds": [
        "M028"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R035",
      "srcIds": [
        "SRC-003",
        "SRC-006"
      ],
      "fieldIds": [
        "F020",
        "F036",
        "F043",
        "F044"
      ],
      "materialSlotIds": [
        "M011",
        "M024",
        "M029"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R036",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006",
        "SRC-012",
        "SRC-013",
        "SRC-014"
      ],
      "fieldIds": [
        "F030",
        "F036",
        "F042",
        "F043",
        "F044",
        "F045"
      ],
      "materialSlotIds": [
        "M019",
        "M024",
        "M028",
        "M029",
        "M030"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R037",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012",
        "SRC-017",
        "SRC-018"
      ],
      "fieldIds": [
        "F005",
        "F006",
        "F023",
        "F044"
      ],
      "materialSlotIds": [
        "M001",
        "M013",
        "M014",
        "M019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R038",
      "srcIds": [
        "SRC-006"
      ],
      "fieldIds": [
        "F002",
        "F005",
        "F036",
        "F044",
        "F047"
      ],
      "materialSlotIds": [
        "M001",
        "M024",
        "M032"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const
export const templateValidationIssues = validateTemplate(templateVersion)
