/** R02 S08-T09: mechanical, source-traceable V3 draft; no official school authorization. */
import type { TemplateVersion } from '@profer/shared'
import { validateTemplate } from '../../template-store'

export const templateVersion: TemplateVersion = {
  templateId: "S08-T09",
  version: 1, schemaVersion: 2, name: "研究生联合培养及培养单位变更资格审核",
  description: "本地研究模板 · 非校方正式模板。研究生联合培养及培养单位变更资格审核。仅做证据关联、事实审查、风险与补件建议；政策适用和最终决定由有权人员确认。",
  catalogKind: 'builtin',
  sourceNote: "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 非校方正式模板；审阅稿 docs/design/review-agent/business-templates/R02/S08-T09.md SHA-256 ecc53457ce2d43b2407581475e96db7c5a35e0f81800c51b856c4668562b9d72；研究原件 docs/design/review-agent/business-templates/R02/research-original/S08-T09.md SHA-256 1e42c163d0e25a22661c24df2fd3e9e046f84849d889951e8fb347ce86fc3cad。SRC 为研究文献索引，不是案卷 SourceRef；校规及签批权待确认。",
  objectType:'person', displayName:{template:"研究生联合培养及培养单位变更资格审核"},
  fields: [
  {
    "key": "F001",
    "label": "案卷唯一 ID / UUID",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F001：案卷唯一 ID / UUID；Case；P0–P7；案卷；M001:系统主键；内；生成失败停止建案，不手填；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F002",
    "label": "事项子类型 / enum：联培新申、专项确认、校际联培、学籍单位调整、合作方调整、续期、撤回、复核、G05 转路由",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F002：事项子类型 / enum：联培新申、专项确认、校际联培、学籍单位调整、合作方调整、续期、撤回、复核、G05 转路由；Case；P0；本人声明+校方人工分型；M001/M004:事项选择及理由；内；未知→人工分型，不默认为新申；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F003",
    "label": "生命周期阶段/事件时点 / enum+timestamp",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F003：生命周期阶段/事件时点 / enum+timestamp；Case；P0–P7；案卷；M001:事件时间轴；内；源断→暂停状态推进；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F004",
    "label": "申请主体稳定引用 / token",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F004：申请主体稳定引用 / token；Applicant；P1/P7；校方身份绑定（尚未证实接口）；M001/M004:登录绑定/签署者；敏；未核身份→人工，不建立有效决定；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F005",
    "label": "申请人姓名 / string",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F005：申请人姓名 / string；Applicant；P1/P2；校籍优先，本人提交仅核对；M002/M004:姓名；个；不一致→CONFLICT，拒绝按姓名合并；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F006",
    "label": "研究生学号 / string，保留前导零",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F006：研究生学号 / string，保留前导零；StudentSnapshot；P1/P2；校籍；M002/M004:学号；敏；源断→人工核学籍，不凭 OCR 过关；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F007",
    "label": "本人/代理或学院经办身份 / enum+authRef",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F007：本人/代理或学院经办身份 / enum+authRef；Applicant；P1/P7；登录权限与授权证明，M001:申请与录入审计；敏；代办授权未知→人工，教师不是默认申请人；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F008",
    "label": "硕士/博士/直博 / enum",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F008：硕士/博士/直博 / enum；StudentSnapshot；P2；校籍；M002/M011:培养层次；个；源断→人工，不按项目标题推断；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F009",
    "label": "学术/专业学位 / enum",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F009：学术/专业学位 / enum；StudentSnapshot；P2；校籍；M002/M011:学位类型；个；源断→人工；2026 大港只适用专业硕士；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F010",
    "label": "全日制/非全日制 / enum",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F010：全日制/非全日制 / enum；StudentSnapshot；P2；校籍；M002/M011:学习形式；个；源断→人工，不由住宿地点推断；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F011",
    "label": "入学年级/学籍批次 / year+code",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F011：入学年级/学籍批次 / year+code；StudentSnapshot；P2；校籍；M002/M011:入学年月与级别；个；源断→人工；特定批次才比对年级；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F012",
    "label": "在读/休学/保留学籍/结束等状态 / enum+effectiveAt",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F012：在读/休学/保留学籍/结束等状态 / enum+effectiveAt；StudentSnapshot；P2/P6；校籍；M002:学籍状态及生效日；敏；源断→人工；禁止“未知=在读”；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F013",
    "label": "当期注册状态 / enum+term",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F013：当期注册状态 / enum+term；StudentSnapshot；P2；校籍；M002:注册学期，SRC-008 只证明可由学院核查；敏；源断→人工，绝不强迫学生提供截屏；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F014",
    "label": "当前学籍所在培养单位代码 / orgRef+effectiveAt",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F014：当前学籍所在培养单位代码 / orgRef+effectiveAt；StudentSnapshot；P2/P5；校籍；M002:学院代码，SRC-007 对概念作校本区分；个；旧新版本不一致→核生效日；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F015",
    "label": "学科专业/专业学位领域 / code+name",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F015：学科专业/专业学位领域 / code+name；StudentSnapshot；P2；校籍；M002/M011:专业；个；源断→人工，按批次专业范围判断；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F016",
    "label": "本科专业/学位背景 / string+provenance",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F016：本科专业/学位背景 / string+provenance；StudentSnapshot/BatchProof；仅对应专项 P2；在校前置学历权威档案或合法证明；M012:本科专业事实；敏；未必需要，仅 SRC-005/011/012 所限批次条件触发→待补或人工；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F017",
    "label": "研究方向/拟岗位匹配描述 / text+ref",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F017：研究方向/拟岗位匹配描述 / text+ref；StudentSnapshot/BatchProof；专项 P1/P2；本人研究陈述+导师或项目权威核对；M004/M012:研究方向；个；缺→待补；“匹配度”专业裁量→人工；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F018",
    "label": "当前校内导师稳定引用 / personRef+validity",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F018：当前校内导师稳定引用 / personRef+validity；StudentSnapshot；P2/P3；校方导师关系或 S08-T01/T06 有效决定；M026/M013:导师及签署人；敏；源断→人工；名字相同不能认定；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F019",
    "label": "联培项目及子项目标识 / projectRef",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F019：联培项目及子项目标识 / projectRef；ProjectBatch；P0/P1；校项；M003:通知标题、项目方、编号；内；未查到现行项目→政未核；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F020",
    "label": "适用年度版本和申请窗口 / version+dateRange",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F020：适用年度版本和申请窗口 / version+dateRange；ProjectBatch；P0/P1；校项；M003:发布日期、截止节点；内；缺→政未核；不得用 2025/2026 历史窗口指示当前可报；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F021",
    "label": "批次资格条件及适用身份快照 / structuredRef",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F021：批次资格条件及适用身份快照 / structuredRef；ProjectBatch；P0/P2；校项；M003:对象、范围、条件段落；内；缺→政未核，不跨批次拷贝门槛；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F022",
    "label": "联培合作/接收机构唯一标识 / orgRef",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F022：联培合作/接收机构唯一标识 / orgRef；PartnerOrUnit；P1/P5；校项+协议与权威机构核对；M003/M015/M018:合作方；内；同名不同主体→CONFLICT/人工；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F023",
    "label": "合作单位/学籍学院/跨校目的院校类型 / enum",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F023：合作单位/学籍学院/跨校目的院校类型 / enum；PartnerOrUnit；P0/P2；校籍+协议与 SRC-007 概念；M002/M015:机构性质；内；不明→人工分型，不据名称“学校”自动改学籍；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F024",
    "label": "拟调整至的校内学籍所在单位 / orgRef",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F024：拟调整至的校内学籍所在单位 / orgRef；PartnerOrUnit；学籍调整 P1/P5；本人提出+校方单位名录；M004/M015:拟单位；个；无独立校本依据→政未核，不自动变更；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F025",
    "label": "申请理由/拟变更事项 / text",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F025：申请理由/拟变更事项 / text；Case；P1、变更 P7；本人；M004/M019:本人说明；个；当前必要但语义欠缺→待补，不据 AI 判理由充分；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F026",
    "label": "拟联培/变更起止时间 / dateRange",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F026：拟联培/变更起止时间 / dateRange；Case/ProjectBatch；P1/P5；本人拟议+官方项目时间窗/协议；M004/M003/M018；个；如公告未要求具体日期则允许未知，后续由有权单位确认；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F027",
    "label": "申请提交/学院汇总的时间戳 / timestamp+actor",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F027：申请提交/学院汇总的时间戳 / timestamp+actor；Case；P1/P3；案卷收件审计/校签；M001/M014:提交回执；内；缺→源断；线下实际收件时间须人工核实；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F028",
    "label": "申请材料版本/哈希/归属 / objectRef",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F028：申请材料版本/哈希/归属 / objectRef；Case；每次增量 P1–P7；案卷；M001:材料版本树和来源；内；无版本关联不得复用既有事实结论；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F029",
    "label": "原生效联培/变更决定引用 / decisionRef",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F029：原生效联培/变更决定引用 / decisionRef；Decision；仅 G/H/K P5/P7；既决；M016:原决定编号与状态；敏；源断→人工；不能由申请人称“曾获批”替代；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F030",
    "label": "原协议/项目授权引用 / agreementRef",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F030：原协议/项目授权引用 / agreementRef；Agreement；E/G/H P0/P5；学校正式协议档案；M018:协议编号和双方签署；敏；缺→源断/人工，是否必须个人协议待核；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F031",
    "label": "协议及附件当前版本 / version+effectiveAt",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F031：协议及附件当前版本 / version+effectiveAt；Agreement；P5–P7；校方档案与有权签约方；M018/M020:版本号、签约/生效日；敏；不同版本→CONFLICT，并冻结旧结论；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F032",
    "label": "培养责任分工/导师安排 / structuredText",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F032：培养责任分工/导师安排 / structuredText；Agreement；P2/P5/P6；项目通知+有效协议+正式决定；M003/M018/M020:培养方式、责任条款；敏；没有条文不推断责任已落实→人工；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F033",
    "label": "成果权利条款存在性/页码及冲突标记 / clauseRef",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F033：成果权利条款存在性/页码及冲突标记 / clauseRef；Agreement；P5；正式协议，M018/M020:知识产权/成果条款定位；敏；无条款→待核而非推定归属；确权走 G06；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F034",
    "label": "校内导师意见及签发引用 / signedOpinionRef",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F034：校内导师意见及签发引用 / signedOpinionRef；Opinion；条件性 P3；校签；M013:签署者、意见、日期；敏；当期要求才必需，伪签→CONFLICT；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F035",
    "label": "学籍所在学院意见及签发引用 / signedOpinionRef",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F035：学籍所在学院意见及签发引用 / signedOpinionRef；Opinion；条件性 P3；校签；M014:学院签章/电子授权；敏；经办人上传不代表学院审批；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F036",
    "label": "拟接收方/拟学院前置意见 / signedOpinionRef",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F036：拟接收方/拟学院前置意见 / signedOpinionRef；Opinion；条件性 P3/P5；外函/校签；M015:签发主体及事项范围；敏；无具体规范不预置“必须两院签章”；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F037",
    "label": "合作单位遴选结果/岗位 / selectionRef",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F037：合作单位遴选结果/岗位 / selectionRef；Decision；P4 后；外函权威回执；M017:名单/岗位/日期；敏；未面试时不适；未认证截图→人工；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F038",
    "label": "学校正式资格/单位变更决定 / decisionRef+outcome",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F038：学校正式资格/单位变更决定 / decisionRef+outcome；Decision；P5 后；校签有权机关；M020:决定对象/结论/生效时点；敏；无权限主体→人工，永不从 PASSFACT 推出批准；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F039",
    "label": "正式决定签发 Actor / authRef+signatureAt",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F039：正式决定签发 Actor / authRef+signatureAt；Decision；P5 后；后端授权证明+校签；M020:签发人/机构、权限时点；敏；Renderer 声明无效，源断不得落正式决定；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F040",
    "label": "G05 实际外出决定引用 / externalDecisionRef",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F040：G05 实际外出决定引用 / externalDecisionRef；ExternalDecision；P6 后；已生效 G05 原流程；M021:批准对象/期限/状态；敏；未产生时不适，不能拿联培批准替代；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F041",
    "label": "补件、撤回或复核事件 / eventType+ref+time",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F041：补件、撤回或复核事件 / eventType+ref+time；Event；P7；本人有效申请+机关处理记录；M001/M023–M025:事件、证据快照；敏；未发起时不适；未确认权限→人工；枚举和复杂值待可信来源核验，不按文字猜类型。"
  },
  {
    "key": "F042",
    "label": "录取/注册学校及学籍注册地稳定代码 / institutionRef+registrationTerm+effectiveAt",
    "kind": "text",
    "required": false,
    "visibility": "internal",
    "scope": "case",
    "displayHint": "源字段 F042：录取/注册学校及学籍注册地稳定代码 / institutionRef+registrationTerm+effectiveAt；StudentSnapshot；P0/P2，跨校联培 E、疑似转学 F/G、专项 D 时触发；普通校企也用于身份消歧；学校招生/学籍电子注册权威回执 M002，专项 M011 辅证；SRC-013 第 8、12 条，当事人自填/合作方邀请不是可写真源；敏；源断→SOURC；枚举和复杂值待可信来源核验，不按文字猜类型。"
  }
],
  materialSlots: [
  {
    "id": "M001",
    "name": "案卷主索引、分型、收件/操作/时间、材料哈希及授权事件；后台可信案卷持有人，原生日志",
    "purpose": "研究稿 M001：案卷主索引、分型、收件/操作/时间、材料哈希及授权事件；后台可信案卷持有人，原生日志；当 P0–P7；仅可由本案后端生成审计记录，无申请人手制替代；F001–F004,F007,F027,F028,F041；SRC：无直接政策条款（技术证据）；系统事件/版本树；归本案；不可用→SOURCEUNAVAILABLE 停止有法律效力的推进；损坏→UNREADABLE/技术修复，不能删除旧事件。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "学籍是否真实、稳定 ID、层次、类型、注册、录取/注册学校与内部学院、导师基础信息；学校学籍主管持有的授权查询或原始学籍档案",
    "purpose": "研究稿 M002：学籍是否真实、稳定 ID、层次、类型、注册、录取/注册学校与内部学院、导师基础信息；学校学籍主管持有的授权查询或原始学籍档案；当 P2；合法替代为学校学籍岗核验签署的带时点证明，非学生自行截图；F005–F015,F018,F023,F042；SRC-001/002/003/008/013；学籍主记录/生效日期/录取学校代码；学籍 Owner/学期与快照版本；源断→SOURCEUNAVAILABLE 并人工调档；影像糊→UNREADABLE，姓名冲突→CONFLICT。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "本次项目身份、条件、批次、时限及适用政策；研究生院/项目归口方持有的正式公告、合法修订或有效签发文件",
    "purpose": "研究稿 M003：本次项目身份、条件、批次、时限及适用政策；研究生院/项目归口方持有的正式公告、合法修订或有效签发文件；当 P0，有具体招生批次时必须能指定该版；正式公文、公开原页或有权归档版本可互证；F019–F023,F026,F032；SRC-005/011/012/009，统一学籍依据另见 SRC-003/004；公告条件段/附件目录；按“项目+年度+发布日期+修订号”冻结；原页失联→SOURCEUNAVAILABLE；现行性未知→POLICYUNCONFIRMED，不能回退旧批次。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "学生本人申请意愿、事项及理由、拟期间；学生或被正式授权的代理人持有的申请表、可核实名义的电子申请/书面申请",
    "purpose": "研究稿 M004：学生本人申请意愿、事项及理由、拟期间；学生或被正式授权的代理人持有的申请表、可核实名义的电子申请/书面申请；当 P1（撤回/复核使用独立 M023/024）；同等身份绑定的学校受理记录可代纸件；F002,F004,F005,F007,F017,F024–F026；SRC-005/011/012 仅支持各自批次、其他情形政策待核；申请签名/日期/理由；归申请人、本案提交版本；无真实意愿→NEEDSMATERIAL/人工身份核定；签名糊→UNREADABLE。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "2026 大港岗位经历与专业背景；申请人持有的个人简历",
    "purpose": "研究稿 M005：2026 大港岗位经历与专业背景；申请人持有的个人简历；条 A/P1（仅 SRC-005 指定）；若公告授权的电子简历有权接收回执，可合法替代载体；F015–F017,F025；SRC-005 六、材料项；简历教育/科研段；归 A 项目申请版本；缺→NEEDSMATERIAL；不可读→UNREADABLE；不能强加于 B/C。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "2026 大港报名基本信息汇集；本人填报、学院汇总保有的项目要求表单",
    "purpose": "研究稿 M006：2026 大港报名基本信息汇集；本人填报、学院汇总保有的项目要求表单；条 A/P1–P3；可采当批次指定正式电子表/学院原始汇总，不以自制通用表替代；F005–F011,F015,F017,F027；SRC-005 申请材料/学院汇总段；附件表格格位未核；归 A 批次及学院报送版；缺→相应提交阶段 NEEDSMATERIAL；不可读/字段冲突→UNREADABLE/CONFLICT。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "2025 大港学生背景及意愿；本人简历，学院受理",
    "purpose": "研究稿 M007：2025 大港学生背景及意愿；本人简历，学院受理；条 B/P1，历史批次才适用；可用 SRC-011 认可的电子简历/官方收件记录；F005–F017,F025；SRC-011 申报材料段，具体附件位置未核；归 B 历史案；缺→NEEDSMATERIAL；糊→UNREADABLE，禁止补造 2026 版要求。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "2025 大港学院报送清单/基本信息汇总；学院经办持有的汇总文件",
    "purpose": "研究稿 M008：2025 大港学院报送清单/基本信息汇总；学院经办持有的汇总文件；条 B/P3；当期有权学院接收/发送的可追溯电子汇总为合法替代；F006,F011,F015,F019,F027；SRC-011 学院汇总段；归 B 学院报送版本；学院档案源断→SOURCEUNAVAILABLE，不要强求学生提供学院文件。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "2025 中海油项目推荐意愿及专业背景；本人/学院持有的专项推荐表",
    "purpose": "研究稿 M009：2025 中海油项目推荐意愿及专业背景；本人/学院持有的专项推荐表；条 C/P1–P3；只有 SRC-012 该项目认可的官方电子表/授权收件可替代；F004–F011,F015–F017,F025,F034–F035（意见栏是否存在待取附件核）；SRC-012 附件推荐表名称；归 C 批次学生及推荐版本；无表→NEEDSMATERIAL；签章格未见原件不能宣称具体签序；糊→UNREADABLE。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "2025 中海油名单与基础信息；本人填、学院保有的专项信息简表",
    "purpose": "研究稿 M010：2025 中海油名单与基础信息；本人填、学院保有的专项信息简表；条 C/P1–P3；同批次指定正式电子表或有权学院原始汇总可替代；F005–F011,F015–F017,F027；SRC-012 附件信息表名称，格位未核；归 C 批次和汇总版；缺→NEEDSMATERIAL；不可读→UNREADABLE；不同表同人学号冲突→CONFLICT。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "博士专项招生类别及是否属于该项目；学校研究生招生主管持有的有效录取/项目资格记录",
    "purpose": "研究稿 M011：博士专项招生类别及是否属于该项目；学校研究生招生主管持有的有效录取/项目资格记录；条 D/P0–P2，仅已招录资格事实；学校正式招生系统/档案核验可代纸质通知；F008–F011,F015,F019,F021,F042；SRC-009/014 仅招生专项；招生类别、录取学校和录取记录；归学校招生决定版，后续资格变更不能重写录取结果；源断→SOURCEUNAVAILABLE，录取通知截图不是变更批准。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "当批次额外事实，如既有本科专业、外语证明、研究方向和材料真实性；本人/权威档案持有的特定支撑",
    "purpose": "研究稿 M012：当批次额外事实，如既有本科专业、外语证明、研究方向和材料真实性；本人/权威档案持有的特定支撑；条 A/B/C 的公告逐项触发；权威学业档案、学校已核成绩/同等正式证明可替代上传，公告未要求则不收；F015–F017,F021；SRC-005/011/012 的专用条件；对应正式证书项/成绩栏；归特定学生+批次+证明颁发版本；缺且实际要求→NEEDSMATERIAL；无权威核验→人工；模糊→UNREADABLE。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "导师是否同意该项目申请；项目所列在任导师保有的可核实签署意见",
    "purpose": "研究稿 M013：导师是否同意该项目申请；项目所列在任导师保有的可核实签署意见；条 A/P3（SRC-005 明示）；C 等其他项目只有通知/附件核实后才激活；校方可信签批记录可替代纸签；F018,F034；SRC-005 六、申请和签字；导师姓名、意见、签日；归项目+学号+导师有效聘任时点；缺→NEEDSMATERIAL 由导师补签；无法核签发主体→CONFLICT/人工。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "学院推荐、真实性审查、汇总签发/收件；学生学籍所在学院有权人员及部门保有的正式意见、报送记录",
    "purpose": "研究稿 M014：学院推荐、真实性审查、汇总签发/收件；学生学籍所在学院有权人员及部门保有的正式意见、报送记录；条 A/P3（签字与汇总）；条 B/P3（核真与汇总）；C 按原表另核；学院原始收件/电子签批可替代复印件；F027,F035；SRC-005/011/012；签发人、学院章/系统签批、送达时间；归各学院当期批次报送版；若学生不能取得学院资料→SOURCEUNAVAILABLE 由学院核，不能归责学生；不清→UNREADABLE。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "跨校/校内拟接收单位存在、愿意接收及相关条件；校方项目主管与接收方保有的正式项目确认/同意记录",
    "purpose": "研究稿 M015：跨校/校内拟接收单位存在、愿意接收及相关条件；校方项目主管与接收方保有的正式项目确认/同意记录；条 E/F/G 的具体有效流程明确要求时才收；有效公文、双方核实的项目记载可替代邀请函，口头邮件不足；F022–F024,F036；SRC-001/007/010 支持分清单位角色，无具体校本必交条款；单位代码/签发页；归相关法人/学院及项目版本；当前无权威依据→POLICYUNCONFIRMED/人工；冲突→CONFLICT。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "已生效联培资格或原学校处理决定，核当前是否仍有效；有权学校业务 Owner 持有的决定/办结记录",
    "purpose": "研究稿 M016：已生效联培资格或原学校处理决定，核当前是否仍有效；有权学校业务 Owner 持有的决定/办结记录；条 D/F/G/H/K；原决定确实存在才需；可信学校决定登记与原公文互认，不让本人重复上传；F029,F031,F038；SRC-001/003/010 仅提供原则/现行性未知，原决定个案本身才是主证；发文号、对象、有效日；归原案+决定版本；源断→SOURCEUNAVAILABLE/人工；被撤销版本不可继承 PASSFACT。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "合作企业/接收方选拔与岗位结果；对应批次有权遴选主体及学校项目办保有的正式名单/回函",
    "purpose": "研究稿 M017：合作企业/接收方选拔与岗位结果；对应批次有权遴选主体及学校项目办保有的正式名单/回函；后 P4，未面试者 NOTAPPLICABLE；企业正式回执由学校核验可替学生上传；F017,F022,F037；SRC-005/011/012 选拔流程；公示/有效回函/岗位与日期；归合作方决定的批次+版本；结果未产生不可报缺件；截图不能证实效力；不清→UNREADABLE。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "双方培养责任、合作机构、实施期及成果条款的项目/个案协议；学校授权档案与合作方正式签约原件",
    "purpose": "研究稿 M018：双方培养责任、合作机构、实施期及成果条款的项目/个案协议；学校授权档案与合作方正式签约原件；条 E/G/H/P5 或已有协议可先作 P0 基线；学校合同档案/签约双方核验件合法替代学生保管件，是否必有个案协议待核；F022,F026,F030–F033；SRC-010 提及基地管理但原文未取得、SRC-001 原则；协议双方、条号、签章及生效日；归合同主体+项目+签约版；源断→SOURCEUNAVAILABLE/人工，不臆造 IP 归属；版本冲突→CONFLICT。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "合作方/培养单位/期限变更的具体请求、与原基线差异；原研究生及有权项目经办持有",
    "purpose": "研究稿 M019：合作方/培养单位/期限变更的具体请求、与原基线差异；原研究生及有权项目经办持有；条 G/H/P1 或新版本 P7；同等身份绑定的补充申请/修订记录替代纸件；F002,F024–F026,F029,F031,F041；SRC-005 个别岗位调剂仅为批次线索，一般变更规则待核；变更前后对照；归原决定引用+申请增量版；缺→NEEDSMATERIAL；变更理由不足不作 AI 实质裁量。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "学校正式资格/单位变更决定及其生效的协议补充件；学校现行授权机关及各有权签约方持有",
    "purpose": "研究稿 M020：学校正式资格/单位变更决定及其生效的协议补充件；学校现行授权机关及各有权签约方持有；后 P5；有效学校决议/合法电子签批、独立授权的签约版本可代相应纸件，学校决定与协议签约必须分别核验；F031–F033,F038–F039；SRC-001/003/004/010 仅为待厘清权限的依据，具体决定须本案有权签发；结论页/电子签批；归学校决定 ID 与协议签约 ID 的两个独立版本号；未签发不构成初始缺件；无权限→NEEDSHUMANDECISION，糊→UNREADABLE。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "实际离校/访学/出访合法审批；G05 原业务系统 Owner 持有的正式决定",
    "purpose": "研究稿 M021：实际离校/访学/出访合法审批；G05 原业务系统 Owner 持有的正式决定；引/后 P6，真实外出触发才用；G05 有效登记记录可代纸质外出审批；F040；SRC-007 第 4 页表单证明是独立事项；批准目标、时间、状态；归 G05 独立决定版本；无审批时不得据联培批准默认放行；接口断→SOURCEUNAVAILABLE。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "因联培形成的个人培养计划或课程调整有效结论；S08-T02 业务 Owner 持有",
    "purpose": "研究稿 M022：因联培形成的个人培养计划或课程调整有效结论；S08-T02 业务 Owner 持有；引/后 P6，仅涉及计划改变时用；S08-T02 有效决定记录为优先替代；F032,F041（仅关联不写主数据）；SRC：现行校本 T02 流程待取；计划版/生效日；归 S08-T02 独立决定版本；未触发不适用；源断→SOURCEUNAVAILABLE，不能代判课程。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "原申请人申请撤回的意思与身份、学校收件/确认；本人及学校受理岗分别保有",
    "purpose": "研究稿 M023：原申请人申请撤回的意思与身份、学校收件/确认；本人及学校受理岗分别保有；当 J/P7 发起撤回时；可信电子申请或有签字的书面请求可替代纸质固定格式，格式权限待核；F004,F007,F029,F041；SRC：本事项撤回规则尚缺；撤回请求及送达回执；归原申请版本+撤回事件版；缺有效身份→NEEDSMATERIAL/人工；尚未有校方确认不可删除或逆转正式决定。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "争议对象及理由；受影响人提供的异议申请与其所指原决定/遴选回执",
    "purpose": "研究稿 M024：争议对象及理由；受影响人提供的异议申请与其所指原决定/遴选回执；当 K/P7 发起时；合法受理电子复核申请可替代纸件，学校何种救济可用待核；F029,F037–F041；SRC：现行本事项复核条款缺，SRC-002 不作现行时限依据；异议请求/原决定引用；归被挑战决定版本+申请事件版；原决定源断→SOURCEUNAVAILABLE，无受理权限→NEEDSHUMANDECISION。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "权限合格机关形成的复核/申诉最终答复；有权复核部门持有的有效结论",
    "purpose": "研究稿 M025：权限合格机关形成的复核/申诉最终答复；有权复核部门持有的有效结论；后 K/P7；机关电子正式答复和存档公文互认，不要求申请一开始提交；F039,F041；SRC：校本现行救济规定待取得；复核签发/送达与生效时间；归独立复核决定版；未产生 NOTAPPLICABLE，无权机关签发→CONFLICT/人工，源断→SOURCEUNAVAILABLE。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "导师任职与师生指导关系的权威状态；学校导师管理 Owner/S08-T01/T06 结论持有人",
    "purpose": "研究稿 M026：导师任职与师生指导关系的权威状态；学校导师管理 Owner/S08-T01/T06 结论持有人；条 A/C/E/D 等涉及导师身份核验的 P2/P3；有权导师关系/资格登记可代老师自行证明；F018,F034；SRC-005 提供具体批次签字要求，资格制度原文待核；导师编号/生效期；归导师资格/关系原业务版本；源断→SOURCEUNAVAILABLE，不能让签名字迹充当资格授权。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "name": "联培实施后的到岗、实践、返校及学籍状态后续记录；实施单位与学籍主管分别持有",
    "purpose": "研究稿 M027：联培实施后的到岗、实践、返校及学籍状态后续记录；实施单位与学籍主管分别持有；后 P6，仅项目实施/结束追踪；学校或接收方正规考勤/考核回执、学籍记录依各自权限代纸件；F012,F014,F026,F032,F041；SRC-005/007 为项目/外出脉络，不证明完成细则；实际期间/签发日期；各实施活动各自版本并绑定 M020 有效期；从未实施不适用；源断→SOURCEUNAVAILABLE，与协议期冲突→CONFLICT。是否应由学生当前上传须按阶段、触发条件及授权来源人工核实；校方后置记录不是申请初期缺件。",
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
    "title": "事项路由",
    "requirement": "| R001 事项路由 | P0；T=联培资格/单位调整；F=纯出行、转学、教师/基地建设项目；U=“培养单位”未辨含义 | SRC-001/003/007/013/015；F002,F014,F022–F024,F042；M001,M002,M004,M015 | 学籍注册学校/学院、合作主体、任务派出方与基地立项申请人身份分栏比；E0 学籍优先，E2 说明辅助；本校变更制度缺失例外留 U | √→PASSFACT（仅“可作本案预审”）；F→NOTAPPLICABLE 并转 G05/S01-T05/项目建设 Owner；U→POLICYUNCONFIRMED；学院培养岗人工分型 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R002",
    "title": "项目批次/政策版本",
    "requirement": "| R002 项目批次/政策版本 | P0；T=按年度/项目申请；F=撤回等仅处理原案；U=找不到适用正式公告 | SRC-005/009/011/012、SRC-003（缺正文）；F019–F021；M003,M011 | 比项目 ID、身份范围、正式修订、发布/截止时间；E1 官方公告，E0 招生专项；历史批次只供历史核查；通用学籍政策不从旧版继承 | √→PASSFACT（版本已锁）；错批次/过期却称当前可报→CONFLICT；无当期规章→POLICYUNCONFIRMED；研究生院项目维护人 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R003",
    "title": "申请人和代理权限",
    "requirement": "| R003 申请人和代理权限 | P1/P7；T=本人/代理提交或撤回复核；F=仅学校背景校验事件；U=代理授权未证 | SRC-005（本人申请例）；F004,F007,F041；M001,M004,M023,M024 | 可信登录主体与学生稳定标识和授权范围、签署时间互证；E0 后端会话/正式授权，E2 申请；不能信 Renderer 的 actor/role | √→PASSFACT（身份事实）；他人冒名→CONFLICT；无可核权限→NEEDSHUMANDECISION；身份管理员/学院收件岗 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R004",
    "title": "学号与姓名一人一案",
    "requirement": "| R004 学号与姓名一人一案 | P1–P2；T=有学生个案；F=纯政策维护；U=学籍记录不能取 | SRC-008/005；F004–F006,F011；M001,M002,M004,M006,M009,M010 | E0 学号/实名有效时点+E2 表中学号匹配；同名不代替稳定 ID，前导零保留；OCR E3 只辅助 | √→PASSFACT；学号不同→CONFLICT；原籍源断→SOURCEUNAVAILABLE；学籍岗核对，缺本人解释可补件 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R005",
    "title": "在读、学段与学籍归属",
    "requirement": "| R005 在读、学段与学籍归属 | P2；T=项目限定在读或涉及学院；F=不需要新核学籍的纯材料版本事件；U=注册/学籍记录不可取 | SRC-001/008/003（现行条款缺）；F008–F015；M002,M011 | E0 学籍当日快照、注册学期与有效日期比，不由宿舍/企业证明推断；历史状态按申请当日核，校本“休学可否报”未核 | √→PASSFACT（学籍事实）；信息不一致→CONFLICT；源断→SOURCEUNAVAILABLE；限制解释→POLICYUNCONFIRMED；学籍 Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R006",
    "title": "年级、学位类型及学习形式",
    "requirement": "| R006 年级、学位类型及学习形式 | P2；T=A/B/C/D 存在已证实特定对象条件；F=一般 E/F/G/H 未发现该批次条件；U=公告失联或分类不明 | SRC-005/009/011/012/014；F008–F011,F019–F021；M002,M003,M011 | 逐批次对比 E0 学籍分类与 E1 招收对象：A 2025 级全日制专业硕士，B/C 各用自身公告，D 只验已取得的专项录取事实；SRC-014 2026 特定非全博士专项不移植成在读变更门槛。不设统一阈值 | √→PASSFACT；超出该批次书面范围→CONFLICT（事实不符，非正式拒绝）；政策未知→POLICYUNCONFIRMED；项目经办/招生岗 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R007",
    "title": "专业方向/岗位适配",
    "requirement": "| R007 专业方向/岗位适配 | P2；T=公告列专业或研究方向要求；F=无此公告条件；U=公告/拟岗位不明 | SRC-005/011/012；F015,F017,F019,F021；M002,M003,M004,M005,M007,M012 | 专业代码与公布范围可作 E0/E1 精确比；研究方向是否契合岗位通常为导师/企业学术裁量，不能用文本相似度替代；时间同项目批次 | 专业在列→PASSFACT；明确不符→CONFLICT；专业适配主观判断→NEEDSHUMANDECISION；导师/项目专业评审人 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R008",
    "title": "本科/语言等特殊条件",
    "requirement": "| R008 本科/语言等特殊条件 | P2；T=特定通知明确要求对应证明（C 等）；F=无该项要求；U=附件未读/现行条件不明 | SRC-012/005/011；F016,F017,F021；M003,M012 | E1 公告逐项激活，E0 合法学业记录优先；英语分值及本科背景只用当批次真实阈值，不创造新的通用最低分；证明生成时间不晚于截止节点 | √→PASSFACT；必交未有→NEEDSMATERIAL；无法读→UNREADABLE；门槛未核→POLICYUNCONFIRMED；学生/学籍档案岗及专项评审人 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R009",
    "title": "本人申请意思与事项",
    "requirement": "| R009 本人申请意思与事项 | P1；T=新申、变更、续期；F=学院代维护名单；U=申请主体/表意不明 | SRC-005/011/012；F002,F004,F007,F025–F026；M001,M004,M019 | 证实本人自愿申请、理由、目标项目和拟日期与当前案卷相符；E2 身份绑定书面/电子意思，学校受理 E0；理由充分性不做 AI 裁量 | √→PASSFACT；真实本人意思缺→NEEDSMATERIAL；假签→CONFLICT；理由是否足够→NEEDSHUMANDECISION；申请人/收件岗 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R010",
    "title": "特定批次表单齐备且归属正确",
    "requirement": "| R010 特定批次表单齐备且归属正确 | P1/P3；T=A/B/C；F=其它情形；U=无法认定 A/B/C 或正式附件未取 | SRC-005/011/012；F005–F011,F015,F017,F028；M005–M010,M012 | 按 A=M005/M006、B=M007/M008、C=M009/M010，逐张核学号、项目、版本和可读区域；各通知的电子/纸件要求不同；E1 通知+E2 原件 | √→PASSFACT；仅本批次必需缺→NEEDSMATERIAL；页格糊→UNREADABLE；要求与附件原文不确定→POLICYUNCONFIRMED；申请人/学院汇总岗 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R011",
    "title": "申请/学院收件时点",
    "requirement": "| R011 申请/学院收件时点 | P1/P3；T=有批次期限及正式收件凭证；F=无已证实时间要求的非招募情形；U=线下收件时间无法核 | SRC-005/011/012；F020,F027；M001,M003,M008,M014 | 核提交回执来源、北京时间和截止节点，学生/学院两个截止不可混；2025/26 均已过去，历史回放独立记录；E0 审计或学院收件为准 | √→PASSFACT；客观逾当批次时间→CONFLICT 并送人核允许例外与否；收件源断→SOURCEUNAVAILABLE；学院/项目受理人 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R012",
    "title": "导师关系、意见和签发权",
    "requirement": "| R012 导师关系、意见和签发权 | P2/P3；T=A 已明确需导师签，其他仅真有条款时；F=公告未要求或阶段未到；U=C 等原表未见 | SRC-005/012、SRC-003（导师制度待核）；F018,F034；M013,M026,M009 | 导师/师生关系有效时间与签字时点比，E0 导师关系/授权，签字只是前置意见；不得由申请人填师名或 OCR 字迹认作授权 | √→PASSFACT；已触发而缺意见→NEEDSMATERIAL；假签/关系不符→CONFLICT；政策不清→POLICYUNCONFIRMED；导师本人、导师管理 Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R013",
    "title": "学院核验、意见与报送",
    "requirement": "| R013 学院核验、意见与报送 | P3；T=A 学院同意签署，B 学院核真实性与汇总，C 按专项通知/附件；F=未到学院节点；U=学院签发职权未核 | SRC-005/011/012；F027,F035,F039；M008,M009,M014 | 逐批次比较 E1 通知要求与 E0 学院签发/收件记录；报告人和有权签发人不同，时间先后与 P3 一致，不能套 SRC-006 2019 顺序 | √→PASSFACT（意见存在有效）；无已明确要求的签章→NEEDSMATERIAL；越权签章→CONFLICT/人工；学院责任人 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R014",
    "title": "合作方真实性和拟接收意见",
    "requirement": "| R014 合作方真实性和拟接收意见 | P0/P3/P5；T=E/F/G 或实际须核接收方；F=仅撤回/补件等未变单位；U=单位法律主体/许可条件不明 | SRC-001/007/010（具体协议未得）；F022–F024,F036；M003,M015,M018 | E0 学校合作项目授权与 E1 签约/对方正式回函比机构代码、主体、有效期；单方邀请/相近集团名不足，校内拟学院意见仅在现行规则触发 | √→PASSFACT（主体同一事实）；更名证据矛盾→CONFLICT；学校必须要求何种意见未知→POLICYUNCONFIRMED；项目主管/双方协议管理员 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R015",
    "title": "原有效决定、对象与版本",
    "requirement": "| R015 原有效决定、对象与版本 | P0/P5；T=D 原专项确认、G/H 变更、K 对决定申诉；F=首次无原决定；U=校方历史决定取不到 | SRC-001/003/010（权限细则待核）；F029,F031,F038；M011,M016,M020 | E0 原决定 ID/学号/批次、原签发机关、有效时间、撤销/变更状态逐一对；原录取决定仅证录取，不证新单位获批 | √→PASSFACT（原决定存在有效）；号不符/已撤销却声称有效→CONFLICT；查档失败→SOURCEUNAVAILABLE；学校原决定 Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R016",
    "title": "协议有效性与培养职责",
    "requirement": "| R016 协议有效性与培养职责 | P2/P5；T=有已签联培协议，或具体流程要求新协议；F=项目尚未到 P5 且未要求预先签；U=基地办法/协议签约规则缺 | SRC-010（间接）、SRC-001；F030–F032,F022,F026；M003,M018,M020 | 校方合同档案 E0+双方正式签约 E1，核主体、培养责任、指导分工、期间、签署/生效日；项目协议≠每名学生个人协议，不能默认必需 | √→PASSFACT（条目及版本一致）；签章/期间冲突→CONFLICT；法定形式未得→POLICYUNCONFIRMED；合同归口/双方有权签署人 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R017",
    "title": "成果权利条款存在/冲突",
    "requirement": "| R017 成果权利条款存在/冲突 | P5；T=有协议且涉及成果、论文或 IP 安排；F=尚无有效协议的报名阶段；U=协议不可调取 | SRC-010（仅线索）；F031,F033；M018,M020 | 只从 E0/E1 有效协议定位有无条款、页码和冲突版本；不判知识产权属于哪方；校方科研法务/G06 必须独立确认 | 有无与页码可核→PASSFACT；条款相互矛盾→CONFLICT；无法取档→SOURCEUNAVAILABLE；权属结论→NEEDSHUMANDECISION；G06/法务 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R018",
    "title": "企业面试与遴选",
    "requirement": "| R018 企业面试与遴选 | P4；T=A/B/C 已完成项目选拔；F=未面试/不含企业选择的 E/F 等；U=外部结果来源不可核 | SRC-005/011/012；F017,F022,F037；M017 | E1 对应企业授权面试组的正式结果，核学生/批次/岗位/日期；学校人员仅登记，未经认证个人截图 E3 不作结果 | √→PASSFACT（企业结果已被核实）；名单身份不符→CONFLICT；正式结果未产生→NOTAPPLICABLE；结果源失联→SOURCEUNAVAILABLE；企业遴选岗/项目归口 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R019",
    "title": "合作方/学院调整基线",
    "requirement": "| R019 合作方/学院调整基线 | P1/P5；T=F/G 改合作方、岗位或学籍学院；F=首次联培或仅纯时长续期；U=变更性质/审批依据未知 | SRC-001/003/005/007/010；F014,F022–F025,F029–F031,F036；M002,M015,M016,M018,M019 | E0 原学籍/决定+E1 原协议与拟单位对照，区分企业内调与校内学籍变化；SRC-005 的动态调剂只属该项目 | 基线及变化事实可核→PASSFACT；旧新主体矛盾→CONFLICT；是否具审批目的/机关不明→POLICYUNCONFIRMED；项目主管/学籍岗 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R020",
    "title": "续期期间与原有效期",
    "requirement": "| R020 续期期间与原有效期 | P1/P5；T=H 申请延长；F=初次参与/无期限变化；U=续期规则或原有效期未知 | SRC-001/010（无校本续期阈值）；F020,F025–F026,F029–F031；M016,M018,M019 | 原生效时间和拟延长期之间的连续/重叠事实可比，E0 原决定、E1 协议优先；不推断最长联培期和宽限期 | 日期可核→PASSFACT（仅区间事实）；互斥日期→CONFLICT；续期许可/上限不明→POLICYUNCONFIRMED，进入人工；学籍/项目审批机关 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R021",
    "title": "学校正式决定与可信签发",
    "requirement": "| R021 学校正式决定与可信签发 | P5；T=有学校正式处理/变更决定要登记；F=仅 P1–P4 未形成决定；U=签发权未查明 | SRC-003/004/005/010（学校终审授权未得）；F031,F038–F039；M001,M020 | 必须独立核 E0 正式决定 ID、决策对象、权限主体、签章时点、生效条件；协议签约为另一独立权限；Renderer actor 一律无效 | 核到真实决定仅 PASSFACT（“该决定存在有效”）；伪造/越权→CONFLICT；无权源→SOURCEUNAVAILABLE；当前授权未明→NEEDSHUMANDECISION；学校有权决策机关 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "manual",
    "targetScope": "case"
  },
  {
    "id": "R022",
    "title": "出行决定与实际实施",
    "requirement": "| R022 出行决定与实际实施 | P6；T=拟离校/出国/交流且要实施；F=未出行或只是资格报名；U=G05 原决定无法访问 | SRC-007；F012,F014,F026,F040；M020,M021,M027 | E0 只读 G05 审批对象、出行时间、签发和当前状态；实施到岗另由外出/项目记录证明；学校联培决定绝不能替代 G05 | G05 有效决定可核→PASSFACT（仅引用）；不存在时本案不批准出行→NEEDSHUMANDECISION/G05 待办；源断→SOURCEUNAVAILABLE；G05 Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R023",
    "title": "培养计划/导师依赖决定",
    "requirement": "| R023 培养计划/导师依赖决定 | P2/P6；T=联培变更实际触发导师、课程计划变动；F=没有相应变动；U=外部权威状态不明 | SRC-005/007，S08-T01/T02 原校本制度待核；F018,F032,F034,F041；M022,M026 | E0 只读 S08-T01/T02 和导师资格 Owner 的有效结论/版本；本案不生成导师调整或课程计划批准 | 引用一致→PASSFACT；外部结论冲突→CONFLICT；未产生→NEEDSHUMANDECISION 并转对应 Owner；源断→SOURCEUNAVAILABLE；T01/T02/导师管理人 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R024",
    "title": "材料版本归属及定向失效",
    "requirement": "| R024 材料版本归属及定向失效 | P1–P7；T=修改 M 或政策源、原决定版发生变化；F=无相关变化；U=旧版哈希/映射缺失 | SRC-005/011/012（材料所属批次；增量失效机制为设计约束非校规）；F001,F003,F028,F041；M001,M003,M004,M012,M018,M020 | 对比案卷不可变来源/哈希、材料所属人+项目、规则依赖索引与签发时点；保留历史，标识旧结论 superseded；只重审受影响 R | 版本及传播可核→PASSFACT（技术事实）；错案归属→CONFLICT；旧源断→SOURCEUNAVAILABLE；案卷 Owner/受影响事实复核人 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R025",
    "title": "撤回意愿与决定边界",
    "requirement": "| R025 撤回意愿与决定边界 | P7；T=J 本人提交撤回；F=未撤回；U=学校是否有权确认/如何处理不明 | SRC-002/003（不得沿用旧申诉/撤回条款）；F004,F007,F029,F041；M001,M016,M020,M023 | 核 E2 撤回签名和 E0 身份、原案收件、P5 生效决定是否存在；撤回申请≠撤销原决定；不得物理删除档案 | 有效申请事实→PASSFACT；冒名→CONFLICT；本校撤回效力/期限无据→POLICYUNCONFIRMED+NEEDSHUMANDECISION 待办；有权学校受理人 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R026",
    "title": "异议请求与有权复核",
    "requirement": "| R026 异议请求与有权复核 | P7；T=K 对明确对象提异议；F=无异议；U=受理机关/申诉期限不明 | SRC-002/003（新规缺）、SRC-005/011/012（企业决定类型）；F029,F037–F039,F041；M001,M017,M020,M024,M025 | 校方决定、企业选择、学院意见按签发 Owner 分路由；核 E2 异议申请、E0/E1 被挑战版本；复核答复仅完成后形成，旧版“10日”不可用 | 请求对象可核→PASSFACT（只证明已提出）；不真实/错人→CONFLICT；权限期限未证→POLICYUNCONFIRMED；复核结论须有权机关 NEEDSHUMANDECISION；相应复核机关 |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R027",
    "title": "到岗/实施/返校记录",
    "requirement": "| R027 到岗/实施/返校记录 | P6；T=项目实施或结束后确实产生履行记录；F=报名期/项目尚未实施；U=项目档案/外部记录源失联 | SRC-005/007/010（非考核细则）；F012,F014,F026,F032,F041；M002,M020,M027 | E0 学籍和正式资格有效期+E1 接收方正式到岗/实践/返校回执按事实时点对齐；不推定专业实践学分或授位达标 | 对应活动事实可核→PASSFACT；时段/身份矛盾→CONFLICT；源断→SOURCEUNAVAILABLE；成绩/学位等另案 NEEDSHUMANDECISION；实施单位与学籍 Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
    "execution": "semantic",
    "targetScope": "case"
  },
  {
    "id": "R028",
    "title": "跨校联培注册学校一致性",
    "requirement": "| R028 跨校联培注册学校一致性 | P0/P2/P5；T=E 跨校联培、D 专项真实跨校学习或 F/G 声称改变学籍注册学校；F=只有校企园区/岗位变化且学校注册事实没有争议；U=注册学校或项目性质无法权威核定 | SRC-013 第 8、12 条、SRC-001 第 27 条；F014,F022–F024,F042；M002,M003,M011,M015,M016,M020 | 用学校学籍电子注册/录取原记录 E0 比较录取学校与当前注册学校、接收方及真正转学决定；校际联培的接收学校不是新注册学校。仅核注册学校和合作单位的不同角色，不判特许项目的行政变动 | 一致且仍在录取学校注册→PASSFACT；材料互斥→CONFLICT；权威记录断→SOURCEUNAVAILABLE；实际变更注册学校→本案 NOTAPPLICABLE 并转 S01-T05；特殊项目政策不明→POLICYUNCONFIRMED；学校学籍 Owner |。仅做原文所列事实、冲突、例外及来源状态检查；未核校规/权限必须提示人工确认，禁止自动正式批准、拒绝或远端写回。",
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
  "templateId": "S08-T09",
  "name": "研究生联合培养及培养单位变更资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S08-T09.md",
  "sourceDocumentSha256": "ecc53457ce2d43b2407581475e96db7c5a35e0f81800c51b856c4668562b9d72",
  "originalSourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/S08-T09.md",
  "originalSourceSha256": "1e42c163d0e25a22661c24df2fd3e9e046f84849d889951e8fb347ce86fc3cad",
  "manifestSha256": "ecc53457ce2d43b2407581475e96db7c5a35e0f81800c51b856c4668562b9d72",
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
    }
  ],
  "criteria": [
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-007",
        "SRC-013"
      ],
      "fieldIds": [
        "F002",
        "F014",
        "F022",
        "F023",
        "F024",
        "F042"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M004",
        "M015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-009",
        "SRC-011",
        "SRC-012"
      ],
      "fieldIds": [
        "F019",
        "F020",
        "F021"
      ],
      "materialSlotIds": [
        "M003",
        "M011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-005"
      ],
      "fieldIds": [
        "F004",
        "F007",
        "F041"
      ],
      "materialSlotIds": [
        "M001",
        "M004",
        "M023",
        "M024"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-005",
        "SRC-008"
      ],
      "fieldIds": [
        "F004",
        "F005",
        "F006",
        "F011"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M004",
        "M006",
        "M009",
        "M010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-008"
      ],
      "fieldIds": [
        "F008",
        "F009",
        "F010",
        "F011",
        "F012",
        "F013",
        "F014",
        "F015"
      ],
      "materialSlotIds": [
        "M002",
        "M011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-005",
        "SRC-009",
        "SRC-011",
        "SRC-012",
        "SRC-014"
      ],
      "fieldIds": [
        "F008",
        "F009",
        "F010",
        "F011",
        "F019",
        "F020",
        "F021"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-005",
        "SRC-011",
        "SRC-012"
      ],
      "fieldIds": [
        "F015",
        "F017",
        "F019",
        "F021"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M004",
        "M005",
        "M007",
        "M012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-005",
        "SRC-011",
        "SRC-012"
      ],
      "fieldIds": [
        "F016",
        "F017",
        "F021"
      ],
      "materialSlotIds": [
        "M003",
        "M012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-005",
        "SRC-011",
        "SRC-012"
      ],
      "fieldIds": [
        "F002",
        "F004",
        "F007",
        "F025",
        "F026"
      ],
      "materialSlotIds": [
        "M001",
        "M004",
        "M019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-005",
        "SRC-011",
        "SRC-012"
      ],
      "fieldIds": [
        "F005",
        "F006",
        "F007",
        "F008",
        "F009",
        "F010",
        "F011",
        "F015",
        "F017",
        "F028"
      ],
      "materialSlotIds": [
        "M005",
        "M006",
        "M007",
        "M008",
        "M009",
        "M010",
        "M012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-005",
        "SRC-011",
        "SRC-012"
      ],
      "fieldIds": [
        "F020",
        "F027"
      ],
      "materialSlotIds": [
        "M001",
        "M003",
        "M008",
        "M014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-012"
      ],
      "fieldIds": [
        "F018",
        "F034"
      ],
      "materialSlotIds": [
        "M009",
        "M013",
        "M026"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-011",
        "SRC-012"
      ],
      "fieldIds": [
        "F027",
        "F035",
        "F039"
      ],
      "materialSlotIds": [
        "M008",
        "M009",
        "M014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-010"
      ],
      "fieldIds": [
        "F022",
        "F023",
        "F024",
        "F036"
      ],
      "materialSlotIds": [
        "M003",
        "M015",
        "M018"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-010"
      ],
      "fieldIds": [
        "F029",
        "F031",
        "F038"
      ],
      "materialSlotIds": [
        "M011",
        "M016",
        "M020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F022",
        "F026",
        "F030",
        "F031",
        "F032"
      ],
      "materialSlotIds": [
        "M003",
        "M018",
        "M020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-010"
      ],
      "fieldIds": [
        "F031",
        "F033"
      ],
      "materialSlotIds": [
        "M018",
        "M020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-005",
        "SRC-011",
        "SRC-012"
      ],
      "fieldIds": [
        "F017",
        "F022",
        "F037"
      ],
      "materialSlotIds": [
        "M017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005",
        "SRC-007",
        "SRC-010"
      ],
      "fieldIds": [
        "F014",
        "F022",
        "F023",
        "F024",
        "F025",
        "F029",
        "F030",
        "F031",
        "F036"
      ],
      "materialSlotIds": [
        "M002",
        "M015",
        "M016",
        "M018",
        "M019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F020",
        "F025",
        "F026",
        "F029",
        "F030",
        "F031"
      ],
      "materialSlotIds": [
        "M016",
        "M018",
        "M019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-010"
      ],
      "fieldIds": [
        "F031",
        "F038",
        "F039"
      ],
      "materialSlotIds": [
        "M001",
        "M020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-007"
      ],
      "fieldIds": [
        "F012",
        "F014",
        "F026",
        "F040"
      ],
      "materialSlotIds": [
        "M020",
        "M021",
        "M027"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-005",
        "SRC-007"
      ],
      "fieldIds": [
        "F018",
        "F032",
        "F034",
        "F041"
      ],
      "materialSlotIds": [
        "M022",
        "M026"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-005",
        "SRC-011",
        "SRC-012"
      ],
      "fieldIds": [
        "F001",
        "F003",
        "F028",
        "F041"
      ],
      "materialSlotIds": [
        "M001",
        "M003",
        "M004",
        "M012",
        "M018",
        "M020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "fieldIds": [
        "F004",
        "F007",
        "F029",
        "F041"
      ],
      "materialSlotIds": [
        "M001",
        "M016",
        "M020",
        "M023"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R026",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-005",
        "SRC-011",
        "SRC-012"
      ],
      "fieldIds": [
        "F029",
        "F037",
        "F038",
        "F039",
        "F041"
      ],
      "materialSlotIds": [
        "M001",
        "M017",
        "M020",
        "M024",
        "M025"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R027",
      "srcIds": [
        "SRC-005",
        "SRC-007",
        "SRC-010"
      ],
      "fieldIds": [
        "F012",
        "F014",
        "F026",
        "F032",
        "F041"
      ],
      "materialSlotIds": [
        "M002",
        "M020",
        "M027"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "r02-fact-review",
      "criterionId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-013"
      ],
      "fieldIds": [
        "F014",
        "F022",
        "F023",
        "F024",
        "F042"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M011",
        "M015",
        "M016",
        "M020"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const
export const templateValidationIssues = validateTemplate(templateVersion)
