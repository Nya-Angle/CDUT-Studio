import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "T02-T10",
  "version": 1,
  "schemaVersion": 2,
  "name": "访学、研修、培训的人事安排与资格审核",
  "description": "本地研究模板 · 非校方正式模板。基于 R02 研究原件形成的事实预审与人工复核候选，不代表成都理工大学现行制度、授权或正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T02-T10 的研究稿并非校方正式模板；校本政策现行性、适用身份和最终审批权限须由有权人员核实。",
  "objectType": "person",
  "displayName": {
    "template": "{{title}}"
  },
  "fields": [
    {
      "key": "case_key",
      "label": "系统案卷号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F001；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F001` `case_key` | 标识，Case | L0～LX | 可信案卷聚合 `M001:系统案卷号`，不可由表格自行伪造 | P1 | SU；待建立案卷 |"
    },
    {
      "key": "person_registry_key",
      "label": "人员唯一编号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F002；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F002` `person_registry_key` | 受控标识，Person | L0 起 | 校内人事目录 `M002:人员唯一编号`；2025 岗培**拟聘教师**可暂以校方可核的招聘/拟聘记录唯一键绑定后续工号，二者非同一字符串时保留权威映射，不得自造工号 | P2 | SU；人工核身份及拟聘—入职映射 |"
    },
    {
      "key": "legal_name",
      "label": "法定姓名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F003；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F003` `legal_name` | 文本，Person | L0 起 | `M002:法定姓名`，`M009:申请表姓名` 仅对照；合法更名记录须人事确认 | P2 | SU；冲突保留各别名 |"
    },
    {
      "key": "affiliation_unit",
      "label": "聘任/人事关系单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F004；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F004` `affiliation_unit` | 组织引用，Person | L0/L1 | `M002:聘任/人事关系单位`，`M007:学院意见抬头` 为交叉核 | P1 | SU；转人事处核实 |"
    },
    {
      "key": "personnel_status",
      "label": "在职/在岗/聘任/具名 2025 岗培的拟聘状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F005；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F005` `personnel_status` | 枚举＋生效区间，Person | L0/L1/L3 | `M002:在职/在岗/聘任/具名 2025 岗培的拟聘状态`；拟聘必须出自有权人事或招聘主管的可信记录，不因本人勾选而通过 | P2 | SU；不得将拟聘身份一律当作“非适用教职工” |"
    },
    {
      "key": "personnel_category",
      "label": "教师/管理人员/干部标识",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F006；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F006` `personnel_category` | 枚举，Person | L0/条件分流 | `M002:教师/管理人员/干部标识`，博士后可由 `M025:在站/未进站/在职` 核验 | P2 | SU；先分流，禁泛用 |"
    },
    {
      "key": "submit_actor",
      "label": "提交操作日志",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F007；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F007` `submit_actor` | 受控主体引用，Person | L0/LX | Host 已认证的提交者及 `M001:提交操作日志`，不是 Renderer 字段 | P2 | SU；暂停代办敏感操作 |"
    },
    {
      "key": "proxy_authorization",
      "label": "本人授权与可核代理关系",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F008；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F008` `proxy_authorization` | 授权引用/状态，Person | 代理提交时 | `M003:本人授权与可核代理关系`；校本代理制度未确认 | P3 | PU/HD；非代理则不适用 |"
    },
    {
      "key": "activity_kind",
      "label": "通知标题/活动性质",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F009；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F009` `activity_kind` | 受控枚举，Activity | L0 起 | `M004:通知标题/活动性质`，`M001:事项选择` 仅为候选 | P1 | NM；先确定目的 |"
    },
    {
      "key": "project_id_name",
      "label": "官方项目名称与代码",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F010；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F010` `project_id_name` | 文本＋项目码，Activity | L0/L1/L2 | `M004:官方项目名称与代码`，`M009:表内项目` 交叉核 | P1 | NM；无法定位项目则 PU |"
    },
    {
      "key": "policy_year",
      "label": "通知适用年度",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F011；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F011` `policy_year` | 年份，Activity | L0 起 | `M004:通知适用年度`，不能默认采用上传年份 | P0 | NM；PU 阻止旧规则套新批 |"
    },
    {
      "key": "batch_id",
      "label": "正式批次及更正件",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F012；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F012` `batch_id` | 文本/枚举，Activity | 批次型 L0/L2 | `M004:正式批次及更正件`，`M015:平台受理批次` 核对 | P1 | PU；2026 六月批次冲突人工 |"
    },
    {
      "key": "eligible_population",
      "label": "通知参加人员/选派类别条文",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F013；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F013` `eligible_population` | 受控对象集合，Activity | L0/L1 | `M004:通知参加人员/选派类别条文`；只判该项目 | P1 | PU；不擅推年龄/教龄 |"
    },
    {
      "key": "application_deadline",
      "label": "报名/材料/网上提交截止原文",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F014；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F014` `application_deadline` | 时间＋时区＋适用节点，Activity | L1/L2 | `M004:报名/材料/网上提交截止原文` | P0 | PU；过期受理由有权部门决定 |"
    },
    {
      "key": "host_institution_place",
      "label": "外方邀请函/合作单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F015；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F015` `host_institution_place` | 组织/国家地区，Activity | 境外/邀请制 L1 | `M005:外方邀请函/合作单位`；官方立项清单 `M004` 为约束 | P1 | NM；虚拟/在线需确认形式 |"
    },
    {
      "key": "planned_period",
      "label": "邀请期限、M010:研修计划、M006:工作调整时段",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F016；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F016` `planned_period` | 日期区间，Activity | 需离岗 L1/L3/L5 | `M005:邀请期限`、`M010:研修计划`、`M006:工作调整时段` | P1 | NM；冲突人工确认 |"
    },
    {
      "key": "invitation_state",
      "label": "意向邮件/正式邀请/撤销更正",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F017；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F017` `invitation_state` | 枚举＋出具方，Activity | 邀请制 L0/L1 | `M005:意向邮件/正式邀请/撤销更正`，区分文件性质 | P1 | NM/PU；不得把意向当正式 |"
    },
    {
      "key": "stage_code",
      "label": "可信办理日志/阶段转换",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F018；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F018` `stage_code` | 枚举，Case | 全程 | `M001:可信办理日志/阶段转换`；仅本稿 L0～LX | P1 | SU；不能靠客户端自报阶段 |"
    },
    {
      "key": "current_duties",
      "label": "本科/研究生课程、管理岗位职责的权威安排",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F019；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F019` `current_duties` | 工作任务引用，Arrangement | 需离岗 L1/L3 | `M006:本科/研究生课程、管理岗位职责的权威安排` | P2 | SU；非离岗场景不适用 |"
    },
    {
      "key": "replacement_arrangement",
      "label": "任务衔接/替代方案及版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F020；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F020` `replacement_arrangement` | 计划＋责任人，Arrangement | 需离岗 L1/L3/L5 | `M006:任务衔接/替代方案及版本`；合理性待主管评价 | P2 | NM/HD；不能自动认可 |"
    },
    {
      "key": "unit_opinion_ref",
      "label": "单位负责人签署的报名汇总/进修意见",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F021；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F021` `unit_opinion_ref` | 机关意见引用，Arrangement | 单位审签阶段 | `M007:单位负责人签署的报名汇总/进修意见`，核身份授权 | P2 | SU/HD；意见未签不可补造 |"
    },
    {
      "key": "teaching_opinion_ref",
      "label": "教务处/研究生院确认的教学安排意见",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F022；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F022` `teaching_opinion_ref` | 机关意见引用，Arrangement | 旧出国细则相应阶段 | `M008:教务处/研究生院确认的教学安排意见` | P2 | PU/SU；仅政策适用才要求 |"
    },
    {
      "key": "application_form_ref",
      "label": "相应项目审核表与签署状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F023；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F023` `application_form_ref` | 文档引用，Activity | 校方要求的申报阶段 | `M009:相应项目审核表与签署状态`；SRC-012 表体未读取 | P2 | PU/NM；不自行发明栏位 |"
    },
    {
      "key": "study_plan_ref",
      "label": "中英文研修计划/出访说明",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F024；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F024` `study_plan_ref` | 计划引用，Activity | 指定项目 L1 | `M010:中英文研修计划/出访说明`；计划全文由需要的 Owner 核 | P2 | NM；具体字数只对具名项目 |"
    },
    {
      "key": "funding_source_opinion",
      "label": "经费主管/财务部门来源意见",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F025；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F025` `funding_source_opinion` | 资金来源意见引用，Arrangement | 旧出境会签条件阶段 | `M011:经费主管/财务部门来源意见`，不核报销金额 | P3 | PU/SU；财务报销另域 |"
    },
    {
      "key": "cadre_review_ref",
      "label": "组织部审批结果状态/官方编号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F026；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F026` `cadre_review_ref` | 受限政审状态，DecisionRef | 干部条件触发 | `M012:组织部审批结果状态/官方编号`，不读取政审细节 | P3 | PU/SU；普通教师不适用 |"
    },
    {
      "key": "international_opinion_ref",
      "label": "国际处对任务时间等的审核意见",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F027；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F027` `international_opinion_ref` | 机关意见引用，DecisionRef | 旧出国审核适用阶段 | `M013:国际处对任务时间等的审核意见` | P2 | PU/SU；不能代替外事放行 |"
    },
    {
      "key": "project_recommendation_ref",
      "label": "G05-T03 正式推荐及公示结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F028；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F028` `project_recommendation_ref` | 跨域结果引用，DecisionRef | G05 推荐后 L2 | `M014:G05-T03 正式推荐及公示结果`，附项目/人/批次 | P2 | SU；不得用申报受理替代 |"
    },
    {
      "key": "csc_application_ref",
      "label": "CSC 平台提交/退回/提回及时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F029；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F029` `csc_application_ref` | 外部申报状态引用，DecisionRef | CSC 已提交 L2 | `M015:CSC 平台提交/退回/提回及时间` | P2 | SU；未到申报阶段不适用 |"
    },
    {
      "key": "csc_admission_ref",
      "label": "CSC 官方录取名单/资格证/录取件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F030；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F030` `csc_admission_ref` | 外部录取决定引用，DecisionRef | CSC 录取后 L4 | `M016:CSC 官方录取名单/资格证/录取件` | P2 | SU；初报不能要求 |"
    },
    {
      "key": "hr_approval_ref",
      "label": "学校人事处或现行授权机构正式决定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F031；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F031` `hr_approval_ref` | 人事决定引用，DecisionRef | 有权审批后 L3 | `M017:学校人事处或现行授权机构正式决定` | P3 | PU/SU；事实核齐非批准 |"
    },
    {
      "key": "training_agreement_ref",
      "label": "双方依法签署的进修协议/生效版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F032；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F032` `training_agreement_ref` | 协议引用，DecisionRef | 校内批准后 | `M018:双方依法签署的进修协议/生效版本` | P3 | PU/SU；先前阶段不适用 |"
    },
    {
      "key": "departure_clearance_ref",
      "label": "G05-T04/国际处任务与行前合规状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F033；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F033` `departure_clearance_ref` | 外事放行状态引用，DecisionRef | 行前 L4 | `M019:G05-T04/国际处任务与行前合规状态` | P3 | SU；T02 不决定放行 |"
    },
    {
      "key": "training_enrolment_ref",
      "label": "培训管理平台报名、学籍或选课登记",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F034；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F034` `training_enrolment_ref` | 培训登记状态，Training | 注册/报名后 | `M020:培训管理平台报名、学籍或选课登记` | P2 | SU；报名之前不适用 |"
    },
    {
      "key": "completion_evidence_ref",
      "label": "官方结业证、认可学时/学籍记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F035；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F035` `completion_evidence_ref` | 成绩/证书引用，Training | 结业后 L6 | `M021:官方结业证、认可学时/学籍记录` | P2 | SU；尚未结业不作缺件 |"
    },
    {
      "key": "return_summary_ref",
      "label": "单位确认研修报告/归岗记录及版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F036；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F036` `return_summary_ref` | 报告/归岗记录，Training | 归岗/验收 L6 | `M021:单位确认研修报告/归岗记录及版本` | P2 | NM/SU；仅当期规定触发 |"
    },
    {
      "key": "change_request_ref",
      "label": "变更申请、原因、拟时段/地点 + M023:原决定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F037；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F037` `change_request_ref` | 变更差异记录，Change | L5/LX | `M022:变更申请、原因、拟时段/地点` + `M023:原决定` | P2 | NM；申请≠批准 |"
    },
    {
      "key": "withdrawal_review_ref",
      "label": "提交及平台回执",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F038；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F038` `withdrawal_review_ref` | 撤回/异议状态，Change | LX | `M022:提交及平台回执`；涉及代理需 `M003` | P2 | NM/SU；不能自行撤销正式决定 |"
    },
    {
      "key": "authoritative_link",
      "label": "校方/G05/CSC/人事决定 ID＋签发人＋scope",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F039；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F039` `authoritative_link` | 外部决定/业务链接，Evidence | 跨域结果出现时 | `M023:校方/G05/CSC/人事决定 ID＋签发人＋scope` | P2 | SU；只读，不复制主结论 |"
    },
    {
      "key": "evidence_version_key",
      "label": "文件哈希、来源版本、签发时点、被替换版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F040；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F040` `evidence_version_key` | 版本标识，Evidence | 材料到达/替换全程 | `M024:文件哈希、来源版本、签发时点、被替换版本` | P2 | SU；不可用无版本截图判最新 |"
    },
    {
      "key": "induction_training_mode_basis",
      "label": "线上/线下条件、M026:学校认可的特殊线上资格证明",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F041；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F041` `induction_training_mode_basis` | 结构化枚举／有限核验状态，Training | 仅 2025 岗培 A1 的报名方式确认 | `M004:线上/线下条件`、`M026:学校认可的特殊线上资格证明`；仅记录方式/类别/是否经有权人确认，不在报告保存孕哺或健康证明全文 | P3 | 普通线下 NA；申请特殊线上却无证明 NM（可按通知改线下），主管意见不可得 SU/HD；其他年度 PU |"
    },
    {
      "key": "induction_qualification_basis",
      "label": "本科及以上学历事实、既往岗培学籍/完成记录与拟聘或在岗身份交叉核",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F042；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| `F042` `induction_qualification_basis` | 资格事实集合／权威记录引用，Training | 仅 2025 岗培 A1 人群确认 | `M027:本科及以上学历事实、既往岗培学籍/完成记录与拟聘或在岗身份交叉核`；只存必要事实及版本、不扩大收集证件全文 | P2 | 经授权系统未接 SU；当前应核而可由人员补证 NM；行政例外 HD；其他年度 PU |"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "案卷提交/受理日志：确定当事人、项目与阶段",
      "purpose": "Host/Main 案卷 Owner；受理事件、可信提交者、时间和阶段 `L0` 起；所有入本模板案件 `D`；无可替代的自制截图；F001、F007、F009、F018；SRC-011（技术约束）；案卷系统版本归主 Owner；缺=SU/阻止错误建案；不可读=技术修复，不能判申请人违规",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "案卷提交/受理日志：确定当事人、项目与阶段与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "人事身份与在岗／拟聘事实",
      "purpose": "学校人事处或具授权的招聘主管人员目录/聘用待生效记录，自 `L0` 依权限取得；本校在职人事身份审核 `D`；**A1 2025 岗培可用可核验的拟聘用身份**，不强索尚未生成的正式工号；经主管认可的正式证明可在无接口时人工替代；未进站外部申请人不强制；F002–F006；SRC-002、004、006、013；人事处或合法招聘 Owner 为内容持有人，记录状态/生效区间；缺/断联=SU；拟聘不能自报，模糊扫描=UR 并请求权威核验",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "人事身份与在岗／拟聘事实与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "代理授权/协办记录：证明代办权",
      "purpose": "申请人、受理机构；有权限的代理授信记录/经认可授权文书，`L0/LX`；**代理触发 C**；具体合法授权形式未查，不能默认手写授权书足够；本人操作无需；F007、F008、F038；SRC-006（归口线索，具体制度未证）；以授权主体、范围、失效时间版本归属；无=PU/HD；不可读则不允许代理敏感动作",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "代理授权/协办记录：证明代办权与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "当期通知/项目授权版本：识别范围与期限",
      "purpose": "当期学校人事/教师发展、国际处、CSC/博管办；官方通知正文、批次及更正件，`L0`；所有情形 `D` 的**政策锚点**，可以是权威网页版本/校方公告；没有校本通用办法时允许记录尚未取得，不造新政策；F009–F014；SRC-001～005、008～010、013～016（015 只适用 2024 国内研修，016 仅路由教师资格）；通知发布机构为 Owner；日期/批次/修订链随案冻结；无现行法源=PU；源失联=SU；抓取不可读=UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "当期通知/项目授权版本：识别范围与期限与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "正式邀请/邀约意向：证明接收单位与拟期限",
      "purpose": "境外/国内接收单位、导师；带签发者及时间的邀请信、邮件原始头或正式更正件，`L0/L1`；邀请制 `C`；2018 细则初询可意向邮件，2026 创新项目校内初报要正式邀请。没有邀请要求的国内线上培训不适用；F015–F017；SRC-002、003、009；外方单位/导师 Owner，需核申请人、项目、日期；缺正式邀请=NM（仅具名项目），不可读=UNREADABLE，意向不冒充正式",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "正式邀请/邀约意向：证明接收单位与拟期限与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "工作任务与拟替代计划：说明离岗对课程、管理工作影响",
      "purpose": "所在单位教务/管理部门及人员本人；排课/岗位安排权威记录＋拟工作交接方案，`L1`；需离岗且现行流程触发时 `C`；无离岗的线上培训不要求；权威系统安排可替代表格截图；F016、F019、F020；SRC-002（旧流程）；教学/管理 Owner 与方案作者分别签发；缺源系统=SU，缺本人方案且明确应提交=NM；文字不可读=UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "工作任务与拟替代计划：说明离岗对课程、管理工作影响与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "所在单位意见/学院汇总：核是否已有真实单位审签",
      "purpose": "所在学院/部门及授权负责人；带审批日志的正式意见或审签汇总表 `L1/L6`；2025 岗培报名、暑研事后汇总分别 `D`；2024“中坚计划”清华批次报名 `D`；**2026 创新项目教职工表上的学院负责人签章与人事处领导签章也是 E1 当期明示的 `D`，可与 `M009` 共用一份实体表格但分签发者核验**；其他境外旧程序仍 `C`；OA 受控记录经主管认可可替代扫描件；F021、F003、F004；SRC-002～005、012、015；单位/人事处各对自己的栏位负责，个人/项目/批次及表单版本绑定；未到审签节点=L；无法验证签章=SU/HD，签署顺序未知不得编造",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "所在单位意见/学院汇总：核是否已有真实单位审签与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "教学主管意见：核派出期教学衔接是否获确认",
      "purpose": "教务处/研究生院等；正式教学工作主管意见，`L2/L3`；旧出国细则对应阶段 `C`，目前**现行性待确认**；可凭有权系统决定编号替代纸件；F022、F019、F020；SRC-002；教学主管 Owner；未形成且尚未到节点=L；需要而无法读=SU/UNREADABLE，合理性=HD",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "教学主管意见：核派出期教学衔接是否获确认与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "该项目申请/审核表：申报身份与人事意见位置",
      "purpose": "人员本人填报，人事及单位签发相关栏目；2018 出国进修表、2024 清华研修报名表/汇总表、2026 CSC 教职工审核表均为**不同实体及年度版本** `L1`；当期校本通知明示时 `C/D`；2024/2026 附件表体未读取，**不预设具体字段或签章顺序**，其中 C1 的单位报名表不得冒充 E1 教职工出国审核表；正式 OA 表单只有经主管确认才可替代；F003、F010、F023；SRC-002、003、012、015；表单由发布机构定版，填报人/签署栏多 Owner；缺模板=PU，当前须交而未交=NM，不可读=UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "该项目申请/审核表：申报身份与人事意见位置与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "研修计划/任务说明：活动目的、时间与工作安排",
      "purpose": "申请人及接收导师；校本出国进修说明、2026 创新项目中英文研修计划、相应版本 `L1`；指定项目 `C`；2026 创新项目注明中英文且“1000字以上”，**仅该年度批次**；普通岗培/暑研不触发；F016、F024；SRC-002、003；计划作者/确认导师归属，修订版替换旧计划；缺=NM，不可读=UNREADABLE；计划价值判断交专家",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "研修计划/任务说明：活动目的、时间与工作安排与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "经费来源及主管/财务前置意见：证明旧制有相关会签",
      "purpose": "经费主管部门、财务处；预算清单/已签意见 `L2/L3`；仅旧国境外进修流程且确认现行适用时 `C`；CSC 录取材料由对应主管按旧细则确认；不是报销票据槽；F025；SRC-002；财务/经费 Owner；未到会签阶段=L；来源失联=SU，金额合理性和报销另域",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "经费来源及主管/财务前置意见：证明旧制有相关会签与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "干部出国政审/审批状态：敏感资格节点",
      "purpose": "党委组织部；按干部管理权限形成的正式审批状态/编号 `L2/L3`；仅权威干部标识并且相关出境流程触发 `C`；普通教师 `NOT_APPLICABLE`；只读受限结论，不要全文；F006、F026；SRC-002；组织部 Owner；无权限=HD/SU，不得读取敏感细节；不可读=限权人工核验",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "干部出国政审/审批状态：敏感资格节点与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "国际处任务时间等前置意见",
      "purpose": "国际交流与合作处；2018 进修表内国际处意见/正式受控会签记录 `L2/L3`；旧出境程序且确认现行时 `C`；不替代真正的外事行前放行；F027；SRC-002、007；国际处 Owner；未形成=L；无法读=SU/UNREADABLE，不得 T02 代签",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "国际处任务时间等前置意见与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "G05 项目材料包索引／校内推荐公示结果（同槽不同阶段）",
      "purpose": "2026 牵头实验室、国际处或 G05-T03 Owner；`L1` 初报的选拔材料包索引，`L2` 才产生正式评审推荐、公示结果；`L1/E1` **仅 R 读**个人简历、外方导师简历、外语证明等 G05 域材料索引；`L2/E2` 推荐、公示已由有权者正式形成才 `R` 读结果。**E1 不要求尚未发生的推荐决定**，也不重复索取项目选拔材料；F028（仅 L2）、F039（跨域索引）；SRC-003、009～011；G05 项目材料的持有者与推荐/公示签发者分别记录，版本与项目批次一致；L1 推荐决定未产生→NA，L2 已存在但源断→SU；选拔合格性不得由 T02 二次决断",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "G05 项目材料包索引／校内推荐公示结果（同槽不同阶段）与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "CSC 平台申报及提回记录",
      "purpose": "国家公派留学管理信息平台/项目受理单位；提交状态、批次、时间、退回原因 `L2`；完成校内推荐并进入国家网上申报后 `R/L`；可信系统导出/受理单位核验可替代截图；F012、F029；SRC-003、009、010；CSC/受理单位 Owner；当期已提交而无法连通=SU；截图不可核=UNREADABLE/SU，不把提交当录取",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "CSC 平台申报及提回记录与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "CSC 正式录取文件/资格",
      "purpose": "CSC；官方录取通知、正式名单或可查官方状态 `L4`；**正式录取后** `R/L`；未经正式发布绝非初报必需；F030；SRC-002、009、010；CSC Owner，核人/项目/时限；已录取而源断联=SU；未经核真扫描件不得形成资格",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "CSC 正式录取文件/资格与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "校内人事决定",
      "purpose": "人事处或经确认授权签发人；正式出国进修/工作安排批准 `L3`；有权决策后才 `R/L`，2018 流程适用性须先核；不作为申请人事前提交材料；F031、F039；SRC-001、002、006；人事审批 Owner，携签发人权限、生效期、撤销版本；不可达=SU/PU；不能写“默认批准”",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "校内人事决定与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "学校进修协议",
      "purpose": "学校人事处及本人；旧细则所列审批后协议 `L3/L4`；批准后 `L`，确认当期仍要求才 `R/C`；不得在初报强迫签订；F032；SRC-002；双方合同归属与版本；尚未批准不作缺件；不清晰/未验证双方签名=UNREADABLE/HD",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "学校进修协议与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "外事任务、证照与行前审核结果",
      "purpose": "G05-T04/国际处及有权出入境机关；任务批件、行前审核状态 `L4`；派出前由外事 Owner 形成的 `R/L`；不在 T02 收集护照、签证、机票、酒店原件来代审；F033、F039；SRC-002、007、011；G05/外事 Owner，核任务/时效；断联=SU，不得凭人事意见放行",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "外事任务、证照与行前审核结果与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "培训平台注册/学籍",
      "purpose": "省师资培训平台或教师研修平台，`L1/L5` 报名后；2025 岗培/线上暑研**报名后** `R/L`；若无法取得接口，经教师发展科认可能提供官方记录供人工核验；F034；SRC-004、005；平台 Owner，年度/个人/课程版本；未报名时=阶段未达，不作缺件；已报而源断=SU",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "培训平台注册/学籍与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "结业证、学院研修汇总与回国报告",
      "purpose": "培训平台/学校学院/出访人员，结业或归岗 `L6`；只有活动结束并已到相应检查阶段 `C/R/L`；2025 暑研有证书和学院汇总，旧出国细则有任务报告；均不得在 L1 要求；F035、F036；SRC-002、004、005；平台/学院/本人分别负责其部分；期未至不报缺；有规定而缺=NM 或 SU；不可读=UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "结业证、学院研修汇总与回国报告与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "变更、撤回、补件、复核申请与回执",
      "purpose": "申请人/代理、受理机构/CSC 平台；原申请引用、拟变更项、时间、渠道回执 `L5/LX`；发生请求时 `D/C`；申诉/复核渠道未核，不得强制申请人提供“复核结论”；平台可查回执优先；F037、F038；SRC-003、010；提出请求者和受理机关各有版本；无申请事实=不适用，已提交源断=SU，不可读=UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "变更、撤回、补件、复核申请与回执与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "跨业务正式决定链接及原决定",
      "purpose": "T02/G05/人事/CSC 各自业务 Owner；决定号、人员、项目、日期、scope、签发机关，`L2～LX`；只有对应决定产生时 `R/L`，不得拿旧 Run 号伪造；同一个结果不双写；F031、F033、F037、F039；SRC-002、003、009～011；归原业务 Owner；没有有效引用=SU，冲突按签发辖区人工复核；版本错配令受影响结论失效",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "跨业务正式决定链接及原决定与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "材料版本、来源与读取审计",
      "purpose": "Case/Run 受控记录；文件哈希、页码/表格坐标、`sourceVersion`、归属、替换链 `L0～LX`；每份真实材料 `D` 的技术元数据，由系统生成，不可要求用户上传；索引需能追踪本轮/旧轮；F001、F018、F040；SRC-011（技术约束）；Main/Case Owner；缺元数据=SU/不允许肯定结果；OCR 无法定位=UNREADABLE，旧结论不复用",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "材料版本、来源与读取审计与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "博士后在站/人事关系及合作导师同意",
      "purpose": "博管办、设站单位、合作导师/人事关系单位；项目系统中有权状态记录 `L0/L1`；SRC-013 博士后项目触发 `C/R`；申请人为未进站博士毕业生时不能无条件要求本校“在职教师证明”，对应路由到博管办；F005、F006、F021；SRC-013；博管办及对应单位 Owner，核在站区间/导师及其权限；源断=SU；跨身份冲突=HD",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "博士后在站/人事关系及合作导师同意与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "2025 岗培特殊线上培训资格证明：核对应允许的报名方式",
      "purpose": "申请人及合法证明签发主体、教师发展科；2025 通知载明的副高及以上、获中级职称达 2 年、附属医院、45 周岁及以上、孕哺、特殊工作/家庭情况对应证明或主管认可的权威状态，最早 A1/L1；**2025 岗培明确申请线上类别时 `C`**；普通线下无需此件；证明可由已授权的学校人事职称/年龄状态、单位官方认定替代，须教师发展科认可，不收存非必要健康细节；F005、F006、F041；SRC-004；按人/2025 批次/所选线上类别/签发者版本绑定；确需证明却未提供=NM（通知允许转线下），不可读=UR、主管源断=SU，例外类别需 HD，不能推至 2026 以后",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "2025 岗培特殊线上培训资格证明：核对应允许的报名方式与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "2025 岗培既往参训与学历资格的权威状态",
      "purpose": "教师发展科/省师培中心培训档案、学校人事或具备合法权限的学历核验来源；2025 A1/L1；仅 2025 岗培的当期对象核验 `D/R`：**未参加过岗前培训、大学本科毕业及以上学历**，优先权威记录；确无接口时可请本人提供经受理部门认可的证据，但不预设已有学信网/培训库接口、不强制重复上传；F005、F006、F042；SRC-004；先核身份、批次、过往培训记录时间及学历事实，敏感细节最小化；源断=SU、可补而缺=NM、记录矛盾=CF；是否受理特殊情况交教师发展科 HD",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "2025 岗培既往参训与学历资格的权威状态与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "fact-review",
      "name": "事实与权限核验",
      "description": "对应研究原件第 08 节的事实核验规则；所有结果只供本地人工审阅，不替代校方决定。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "R001 事项唯一目的分流",
          "requirement": "**R001** 事项唯一目的分流；`L0`；T=访学/研修/培训的人事事实；F=学生培养、攻读学历、教师资格认定、境外任教、因私出境、报销等其他目的；U=目的未辨；SRC-003、SRC-011、SRC-014、SRC-016；F001/F009/F010；M001/M004。比较当期官方项目目的、受审人及提交意图；2026 教师资格认定属 T02-T15（岗培证书只是其前件），同一材料多用途只路由，不推导本模板全权；T 且源可靠→PF（仅路由事实）；F→NA 并提示相邻 Owner；U 缺项目锚点→PU/NM，国际处或教师发展科确认归口。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "R002 人事关系和在岗/拟聘状态",
          "requirement": "**R002** 人事关系和在岗/拟聘状态；`L0/L1/L3`；T=对应项目要求本校任职、或 SRC-004 的**拟聘/已聘**教师；F=证实与项目对象无关；U=人事或拟聘关系未知；SRC-002、SRC-004、SRC-005、SRC-006、SRC-013；F002/F004/F005/F006；M002/M025。人事/招聘主数据的本人、任职或拟聘决定及生效区间与项目时点比对；2025 A1 **不可把尚无正式在职号的拟聘教师自动排除**；博士后/临聘要依项目和权威记录分流；T 可信匹配→PF；F→NA 并路由；U 官方源断→SU、记录互斥→CF、身份口径未知→PU；人事处、招聘主管或博管办。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "R003 姓名、身份和材料归属",
          "requirement": "**R003** 姓名、身份和材料归属；全阶段；T=材料描述了本案受审人；F=证实属于别人；U=缺法定标识/更名链；SRC-002、SRC-003、SRC-006；F002/F003/F004；M002/M009/M016。正式人员 ID 优先于姓名模糊匹配；旧姓须有权威更名链；不同教师的相同姓名不可复用；T 一致→PF；F→CF，不自动归入他案；U→SU/NM；人事处核验，当事人补更名证据。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "R004 提交人及代理权限",
          "requirement": "**R004** 提交人及代理权限；`L0/LX`；T=当前操作由代理执行；F=本人经 Host 认证亲自操作；U=身份或授权来源不明；SRC-006（机构线索，代理制度未证）；F007/F008；M001/M003。以可信登录与有权授信、授权范围/有效期比对；本人操作无需代理件，纸面授权形式由校方核定；T 授权已核且仅协办→PF；F→NA；U→PU/SU/HD，暂停代理签署和撤回；受理机关核授权。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "R005 项目政策版本和批次识别",
          "requirement": "**R005** 项目政策版本和批次识别；`L0/L2`；T=存在具名年度/批次通知；F=该项目明确无批次；U=无现期原文或条文矛盾；SRC-001、SRC-002、SRC-003、SRC-004、SRC-005、SRC-009、SRC-010；F010/F011/F012；M004/M015。锁正式标题、年份、发布日期、修订链；2026 六月校方文内“第一批”与 CSC 第二批冲突，不能悄改；T 无冲突→PF；F 仅批次字段→NA；U→PU，若可访问源断联→SU；国际处/教师发展科核更正。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "R006 特定通知的人群覆盖",
          "requirement": "**R006** 特定通知的人群覆盖；`L0/L1`；T=通知明确限制某身份；F=通知表述开放且无此限制；U=资格口径/身份未证；SRC-003、SRC-004、SRC-005、SRC-013、SRC-015；F005/F006/F013；M002/M004/M025。比较当期发布的人群文字与**活动时点**在岗/新入职/在站状态；SRC-015 的年龄、到校年限、既往研修要求**只在 2024 清华具名批次**核对应事实，不外推到其他项目；T 匹配→PF，**身份已核但未覆盖→HD 交主管决定受理/分流，并非两份证据冲突**；F→NA；U→PU/SU，只有记录互相矛盾才 CF；人事处、教师发展科或博管办。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "R007 报名节点和时效事实",
          "requirement": "**R007** 报名节点和时效事实；`L1/L2/L6`；T=具名通知存在明确截止；F=当前节点没有截止约束；U=年度/批次/时区不明；SRC-003、SRC-004、SRC-005、SRC-009、SRC-010、SRC-015；F011/F012/F014；M001/M004/M015。以官方时区、节点和可信收件回执时间比对；2024 清华、2025 岗培/暑研、2026 CSC 仅各自历史批次，逾期受理归主管裁量；T 时间相符→PF；时间超限→HD（非自动拒件）；F→NA；U→PU/CF；当期受理机关。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "R008 阶段与证据版本完整性",
          "requirement": "**R008** 阶段与证据版本完整性；全阶段；T=已有当前可预审的事实或文件；F=某材料属于未来阶段；U=阶段/版本索引失联；SRC-011（技术要求，非校规）；F001/F018/F040；M001/M024。受控案卷事件、SHA/签发时点、材料归属、`replaced_by` 比对；前端阶段、旧 run@rev 不是授权证据；T 版本可追溯→PF；F 对该未来槽→NA；U→SU/UR；Main/Case Owner 重建可追溯引用。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "R009 2025 岗前培训报名与单位汇总事实",
          "requirement": "**R009** 2025 岗前培训报名与单位汇总事实；`A1/L1`；T=2025 当期通知覆盖的报名阶段；F=非此项目/阶段；U=未核单位表和当前记录；SRC-004；F013/F014/F021；M004/M007/M009。核单位负责人审批/公章及 OA 收件而非 AI 代签；报名汇总签批节点才需要，2026 新批次不得沿用；T 已核→PF；F→NA；当前确需材料无件→NM，签发真伪未知→SU/HD；单位及教师发展科。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "R010 岗前培训平台学籍/结业事实",
          "requirement": "**R010** 岗前培训平台学籍/结业事实；`A2/L6`；T=已完成报名或到结业节点；F=报名尚未发生或结业时点未到；U=培训系统状态不可得；SRC-004；F034/F035；M020/M021。以平台正式学籍/证书对申请人和年度，而非本人填报；结业未至绝非报名拒绝理由；T 对应平台记录→PF；F→NA；U 平台失联→SU、证书难辨→UR；培训平台/教师发展科。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "R011 2025 暑期线上研修参与事实",
          "requirement": "**R011** 2025 暑期线上研修参与事实；`B1/L1/L5`；T=2025 在职教师参加该线上专题；F=非该专题/未开班；U=平台状态未得；SRC-005；F005/F009/F034；M002/M004/M020。对照在职身份、专题及平台记录；通知未给普通教师事前批准函的通用义务，不能凭缺该函判失败；T 已核→PF；F→NA；U→SU，个人确需补登记录才 NM；教师发展科或平台。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "R012 暑研结业与学院 OA 汇总",
          "requirement": "**R012** 暑研结业与学院 OA 汇总；`B2/L6`；T=2025 专题已到结业/学院汇总阶段；F=培训进行中；U=证书或汇总发布状态未知；SRC-005；F021/F035；M007/M021/M024。证书归属与学院审签 OA 汇总双证核对；2025-09-19 18:00 是学院汇总截止，不是所有教师资格否决阈值；T 两事实分别已核→PF；F→NA；当前有义务无件→NM；证书源断 SU/不可读 UR；教师发展科/学院。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "R013 国内集中研修的校本审批适用性",
          "requirement": "**R013** 国内集中研修的校本审批适用性；`C1/L0/L1`；T=有该国内项目、与人事工作安排有关；F=纯自学无需离岗安排；U=当期报批制度未取得；SRC-006、SRC-008、SRC-015；F009/F015/F016/F019/F021；M002/M004/M005/M006/M007。2024 清华具名项目要求学院推荐、院长（书记）审签与 OA 报送，是**该批次报名事实**；2025 浙江大学新闻只有活动事实，不能据此设门槛；其他国内自选访学的人事事前审批仍待校规；T 具名批次的来源与人事事实可 PF，方案合理性 HD；F→NA；U→PU；教师发展中心确认其他年度/类别规则。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "R014 邀请机关、本人、合作项目和邀请性质",
          "requirement": "**R014** 邀请机关、本人、合作项目和邀请性质；`D1/E1/L1`；T=当期正式邀请制；F=项目不要求邀请；U=邀请制是否适用未明；SRC-002、SRC-003、SRC-009；F010/F015/F017；M004/M005/M009。对正式邀请的姓名、项目、接收单位、日期与项目清单逐项比对；2018 意向邮件不能冒充 2026 指定项目正式函；T 一致→PF，错配→CF，当前正式函应交未交→NM；F→NA；U→PU；国际处/G05-T03 核接收资格。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "R015 研修计划与邀请期一致性",
          "requirement": "**R015** 研修计划与邀请期一致性；`D1/E1/L1`；T=该项目要求研修计划；F=非计划制培训；U=计划要求或签发版本不明；SRC-002、SRC-003；F016/F024；M005/M010。比申请人、计划目标、时段、导师确认和邀请期；2026 专项语言/字数只限该项目，不泛化，学术价值人工评议；T 文本及期限一致→PF，日期矛盾→CF，现阶段缺件 NM，质量判断 HD；F→NA；U→PU；单位及 G05 项目评审者。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "R016 离岗任务、排课及替代方案",
          "requirement": "**R016** 离岗任务、排课及替代方案；`L1/L3/L5`；T=实际脱岗且影响教学/管理任务；F=线上学习等不影响任务；U=任务或脱岗性质未知；SRC-002（旧细则现行待核）；F016/F019/F020；M005/M006/M024。学校排课/岗位记录优于个人自述；逐日覆盖拟出访时段，不让模板自行认可替代人的任课资格；T 时间覆盖事实→PF、遗漏或重叠→CF/NM，方案合理性→HD；F→NA；U→SU/PU；学院和教务/研究生院。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "R017 所在单位及人事处审签存在性和权限",
          "requirement": "**R017** 所在单位及人事处审签存在性和权限；`A1/B2/C1/D1/E1/L1/L6`；T=具名通知要求当前审签（E1 明确学院及人事处领导分别签字盖章，2024 清华批次仅要求单位院长/书记审签）；F=该阶段未要求；U=签发者真实身份或授权不可核；SRC-002、SRC-003、SRC-004、SRC-005、SRC-012、SRC-015；F004/F021；M002/M007/M009。审核 OA/签发日志，分辨签发角色与项目批次；**不得将 E1 的人事处领导签章泛化至 C1 或 A1**；同一实体 M009 不重复索两份，未读 SRC-012 表体不能自创签章顺序；签名图片不足证实身份；T 对该批次需签发的机关分别验真→PF，当前确需而未有→NM，身份/授权不明→SU/HD；F→NA；表体结构不明→PU；原签发单位与教师发展科/人事处按各自权限核。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "R018 教学主管部门意见的存在性",
          "requirement": "**R018** 教学主管部门意见的存在性；`D1/F1/L2/L3`；T=现行出境流程确认需教学主管会签；F=其他项目/无需教学调整；U=2018 旧制是否沿用不明；SRC-002；F019/F020/F022；M006/M008。核本科/研究生教学 Owner 正式意见号与相关课程时段，不能从单位同意推定教务批准；T 原件已核→PF，现期应有却缺 NM，合理性 HD；F→NA；U→PU/SU；教务处/研究生院。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "R019 经费来源前置意见存在性",
          "requirement": "**R019** 经费来源前置意见存在性；`D1/L2/L3`；T=现行规定要求前置经费会签；F=无此前置要求；U=旧细则适用性不明；SRC-002；F025；M011/M004。只核签发机关与费用来源意见，不核差旅票据、会计入账及资助金额是否应拨付；T 核实意见存在→PF；F→NA；U→PU/SU，预算合理性 HD；经费主管/财务处。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "R020 干部身份触发的受限审批",
          "requirement": "**R020** 干部身份触发的受限审批；`G1/L2/L3`；T=权威干部管理身份且现行出国条款触发；F=已核普通教职工；U=身份或受限意见不可用；SRC-002；F006/F026；M002/M012。仅用组织部受限结果状态和决定号，不读取政审内容；旧程序不得自动推为现期义务；T 有权状态可查→PF（仅存在性），审批裁量 HD；F→NA；U→PU/SU；党委组织部。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "R021 国际处出境前置意见",
          "requirement": "**R021** 国际处出境前置意见；`D1/L2/L3`；T=现行出境进修流程要求国际处会签；F=无此程序的国内学习；U=权限/旧细则效力未核；SRC-002、SRC-007；F027；M013/M004。查国际处对任务与时间的正式签发结果；这是会签，不等于 G05-T04 行前放行；T 已核→PF；F→NA；未确认政策 PU/来源断 SU；国际处。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "R022 境外进修人事审核表版本与当期申报状态",
          "requirement": "**R022** 境外进修人事审核表版本与当期申报状态；`D1/E1/L1`；T=该项目通知列明人事审核表；F=线上自学没有此表；U=表体未取得或签署顺序不明；SRC-002、SRC-003、SRC-012；F003/F023；M009/M004。人、项目、批次、表单发布机构与已形成栏位逐项核；2026 附件未读，绝不填造签章顺序；T 能验存在/归属→PF，当前表缺 NM；F→NA；U→PU/UR；人事处/国际处核表体。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "R023 2026 CSC 创新项目校内初报关键材料",
          "requirement": "**R023** 2026 CSC 创新项目校内初报关键材料；`E1/L1/L2`；T=明确属于 SRC-003 两项获批项目的教职工访问学者；F=项目/学段不属于；U=身份或附件政策不明；SRC-003、SRC-009、SRC-012；F005/F010/F013/F017/F021/F023/F024；M002/M004/M005/M007/M009/M010/M014。核正式邀请、当期中英文计划及**已到的学院/人事签章**与身份；L1 的 M014 仅是 G05 项目材料索引，推荐结果在 L2 另核 R024；简历/语言合格性转 G05，不前置 CSC 录取；T 当前可核事实→PF，正式邀请/计划/审核表应有却确未有 NM；签章真实性不明 SU/HD，表体未知 PU；F→NA；国际处/人事处，遴选由 G05。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "R024 校内项目推荐与公示结果的只读引用",
          "requirement": "**R024** 校内项目推荐与公示结果的只读引用；`E2/L2`；T=G05-T03 已形成正式推荐/公示；F=尚在初报；U=结果源未接入/版本不明；SRC-003、SRC-009、SRC-011；F028/F039；M014/M023。核推荐机关、当事人、项目/批次及发布版本；本模板不能再次评审竞争分数或选拔名额；T 权威存在→PF（“已收到推荐事实”）；F→NA；U→SU/CF；国际处/牵头实验室/G05。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "R025 CSC 网上申报提交与提回记录",
          "requirement": "**R025** CSC 网上申报提交与提回记录；`E2/L2`；T=已获校内推荐并进入 2026 对应网上窗口；F=未到网上申报；U=受理批次或平台记录未知；SRC-003、SRC-009、SRC-010；F012/F014/F029；M004/M014/M015。以 CSC/受理单位回执和时间核对；校方六月批次措辞冲突不能作为自动拒件依据；受理回执不是录取；T 平台事实可核→PF，冲突 CF；F→NA；U→PU/SU；CSC 平台受理单位/国际处。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "R026 CSC 录取真实性与有效范围",
          "requirement": "**R026** CSC 录取真实性与有效范围；`F1/L4`；T=申请人主张已正式录取；F=尚在 E1/E2；U=录取源不可验证；SRC-009、SRC-010；F002/F010/F030；M002/M016/M023。核 CSC 官方录取名单/通知的本人、项目、资助身份、有效区间；截图不能替代正式决定；T 可核→PF（只读录取存在），不同人/项目 CF；F→NA；U→SU/UR；CSC/项目受理单位。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "R027 校内人事工作安排最终决定的真实性",
          "requirement": "**R027** 校内人事工作安排最终决定的真实性；`F1/L3/L4`；T=已到依法应由校内机关决定节点；F=仅是初报/推荐；U=现行决定权、决定源未知；SRC-001、SRC-002、SRC-006；F031/F039；M017/M023。2018 记载人事处，2026 现行签发人权限须确认；有权正式决定与单位意见/CSC 录取分别比对；T 有权人真实签发→PF（仅引用）；F→NA；U→PU/SU/HD；现行人事批准机关，不由 T02 自动签发。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "R028 审批后进修协议的形成",
          "requirement": "**R028** 审批后进修协议的形成；`L3/L4`；T=现行程序要求且人事批准已生效；F=尚未校内批准或不适用；U=协议要求/签署版本未知；SRC-002；F031/F032；M017/M018。逐双方、对象、起止日、签发版本核协议；不能在初报先索签署件，也不能将 CSC 自身协议混同学校协议；T 协议已验真→PF；F→NA；U→PU/SU/UR；学校人事处与签约本人。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "R029 G05 外事任务与行前放行状态",
          "requirement": "**R029** G05 外事任务与行前放行状态；`L4`；T=已有出境任务拟进入行前节点；F=境内培训/外事节点未至；U=权威放行记录不可达；SRC-002、SRC-007、SRC-011；F033/F039；M019/M023。读取 G05-T04 或国际处真实决定、人员/目的地/生效区间；不得凭人事批准推导出境资格；T 可核引用→PF（非本模板放行）；F→NA；U→SU/CF；国际处/G05-T04。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "R030 培训结业、境外研修归岗与报告",
          "requirement": "**R030** 培训结业、境外研修归岗与报告；`H3/L6`；T=活动确已结束且对应通知要求结业或归岗材料；F=正在实施中；U=是否有报告义务未知；SRC-002、SRC-004、SRC-005；F035/F036；M020/M021/M023。核培训平台证书、原研修安排、本人报告、学院/人事确认，各部分签发者不同；回国任务考核的旧制现行性待核；T 对应事实吻合→PF，确需现期报告缺 NM，期未至 NA；U→PU/SU；教师发展科/原批准单位。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "R031 博士后身份与交流项目边界",
          "requirement": "**R031** 博士后身份与交流项目边界；`X1/L0/L1`；T=SRC-013 项目受审人确有本校人事工作安排；F=只具未进站资格/其他单位人事关系；U=关系或在站状态不明；SRC-013；F002/F005/F006/F021；M002/M004/M025。区分在站、未进站及在职科研三分支，以博管办和人事关系单位记录为准；不把在站等同正式教职工；T 只核本校人事事实 PF；F→NA 转博管办；U→SU/PU/HD；博管办/设站单位。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "R032 访学延期、地点/单位变更申请的差异",
          "requirement": "**R032** 访学延期、地点/单位变更申请的差异；`H1/L5`；T=已有原批准且提交变更请求；F=无变更；U=原决定/提交主体不可核；SRC-002、SRC-010、SRC-011；F016/F020/F037/F039；M006/M022/M023。对比旧决定有效区间与拟新时段/单位；CSC、人事及外事变更分别由各自 Owner 决定，申请不改旧批件；T 差异可核→PF（仅申请事实）、是否应允许→HD；F→NA；U→SU/CF；原有权决定机关。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R033",
          "title": "R033 撤回、重提与复核请求的效力边界",
          "requirement": "**R033** 撤回、重提与复核请求的效力边界；`H2/LX`；T=本人/授权代理有撤回、重提或异议请求；F=无请求；U=渠道、权限、回执不明；SRC-003、SRC-010；F007/F008/F038；M001/M003/M022/M023。原阶段/平台关闭时间与有权受理机关回执比对；正式决定之后不得用“提回”自动撤销，重提保留原尝试版本；T 请求已登记→PF（仅请求事实）、生效待 HD；F→NA；U→PU/SU；原受理单位/复核主管。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R034",
          "title": "R034 跨业务权威决定错配与复用",
          "requirement": "**R034** 跨业务权威决定错配与复用；`L2–LX`；T=案卷引用 G05/CSC/人事/教学的正式结果；F=尚无该结果；U=决定 ID/签发权不明；SRC-002、SRC-003、SRC-009、SRC-010、SRC-011；F028/F030/F031/F033/F039；M014/M016/M017/M019/M023。必须同人、同项目、同批次、同决定 scope、同生效区间、同版本；无权跨域复制签批；T 范围完全相符→PF（只读引用）；F→NA；错配 CF、来源失联 SU；各原 Owner/唯一 Case Owner。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R035",
          "title": "R035 现有材料可读性与字段定位",
          "requirement": "**R035** 现有材料可读性与字段定位；全阶段；T=本阶段已收到应处理的文件/证据；F=该文件仅后续才形成；U=源未到或读取失败原因不明；SRC-003、SRC-004、SRC-005、SRC-011；F023/F024/F035/F040；M005/M009/M010/M021/M024。逐页/表格坐标/OCR 置信不足位置留痕；源不存在/网络断联≠已到文件不可读；不得猜字补章；T 可定位并可人工复核→PF；F→NA；已到但无法识读 UR，根本未取源 SU；材料提供者/档案管理人。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R036",
          "title": "R036 2025 岗培线上特殊情形与证明",
          "requirement": "**R036** 2025 岗培线上特殊情形与证明；`A1/L1`；T=申请 2025 岗培**特殊线上**类别；F=选择正常线下且无特殊证明要求；U=方式/特殊原因或本人状态不明；SRC-004，第三（一）、四；F005/F006/F041；M002/M004/M026。以该校 2025 通知列出的职称/年限、附属医院、年龄、孕哺或特殊安排范围及相应真实证明比对；只保存受限核验状态，**未交证明按通知可改参加线下**，非整项资格否决；T 具名条件且凭证可核→PF（仅报名方式事实）、证明缺且当前应交→NM、源断 SU、不可读 UR，例外 HD；F→NA；U→PU/SU；教师发展科/单位，2026 及其他项目不可套用。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R037",
          "title": "R037 2025 岗培学历与既往培训经历事实",
          "requirement": "**R037** 2025 岗培学历与既往培训经历事实；`A1/L1`；T=2025 岗培拟聘/已聘，须确认是否未参加过岗培及本科以上学历；F=非该年度项目；U=个人档案/官方培训史无法核；SRC-004，第一、四；F005/F006/F013/F042；M002/M004/M027。校方/省师培中心可验证的既往培训记录、合法学历记录与人事拟聘身份比对；先核项目制度时效，**不预设数据库已经接入**；师资博士后、拟聘人员不能因缺在职工号而排除；T 已核事实一致→PF；记录互斥 CF；当前可补件 NM、权威源断 SU、不可读 UR；例外受理 HD；F→NA；U→PU/SU；教师发展科/省师培中心/人事处。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "L0",
      "name": "识别活动与主体",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L1",
      "workflowOwner": "local"
    },
    {
      "id": "L1",
      "name": "申报准备和单位意见",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L2",
      "workflowOwner": "local"
    },
    {
      "id": "L2",
      "name": "校内项目审查/推荐（按需）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L3",
      "workflowOwner": "local"
    },
    {
      "id": "L3",
      "name": "人事/任务有权决定（按需）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L4",
      "workflowOwner": "local"
    },
    {
      "id": "L4",
      "name": "外部录取与外事派出（按需）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L5",
      "workflowOwner": "local"
    },
    {
      "id": "L5",
      "name": "实施、延期/变更",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L6",
      "workflowOwner": "local"
    },
    {
      "id": "L6",
      "name": "结束、归岗/学习证明确认",
      "kind": "handoff",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "fact-review-report",
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
  "templateId": "T02-T10",
  "name": "访学、研修、培训的人事安排与资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T02-T10.md",
  "sourceDocumentBytes": 150518,
  "sourceDocumentSha256": "9ad3f122f83789bd1731b26b1873a27a7dc8aca4c8fda47543d64081999611ad",
  "sourceIntegrityVerifiedAgainstManifest": true,
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23（当前可访问的最新正式 MD）",
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceSummary": "校本和批次通知部分核实；当前签批权限、部分原件附件及未来年度批次仍需确认。",
  "workflowOwner": "local",
  "fields": [
    {
      "fieldId": "F001",
      "key": "case_key",
      "label": "系统案卷号"
    },
    {
      "fieldId": "F002",
      "key": "person_registry_key",
      "label": "人员唯一编号"
    },
    {
      "fieldId": "F003",
      "key": "legal_name",
      "label": "法定姓名"
    },
    {
      "fieldId": "F004",
      "key": "affiliation_unit",
      "label": "聘任/人事关系单位"
    },
    {
      "fieldId": "F005",
      "key": "personnel_status",
      "label": "在职/在岗/聘任/具名 2025 岗培的拟聘状态"
    },
    {
      "fieldId": "F006",
      "key": "personnel_category",
      "label": "教师/管理人员/干部标识"
    },
    {
      "fieldId": "F007",
      "key": "submit_actor",
      "label": "提交操作日志"
    },
    {
      "fieldId": "F008",
      "key": "proxy_authorization",
      "label": "本人授权与可核代理关系"
    },
    {
      "fieldId": "F009",
      "key": "activity_kind",
      "label": "通知标题/活动性质"
    },
    {
      "fieldId": "F010",
      "key": "project_id_name",
      "label": "官方项目名称与代码"
    },
    {
      "fieldId": "F011",
      "key": "policy_year",
      "label": "通知适用年度"
    },
    {
      "fieldId": "F012",
      "key": "batch_id",
      "label": "正式批次及更正件"
    },
    {
      "fieldId": "F013",
      "key": "eligible_population",
      "label": "通知参加人员/选派类别条文"
    },
    {
      "fieldId": "F014",
      "key": "application_deadline",
      "label": "报名/材料/网上提交截止原文"
    },
    {
      "fieldId": "F015",
      "key": "host_institution_place",
      "label": "外方邀请函/合作单位"
    },
    {
      "fieldId": "F016",
      "key": "planned_period",
      "label": "邀请期限、M010:研修计划、M006:工作调整时段"
    },
    {
      "fieldId": "F017",
      "key": "invitation_state",
      "label": "意向邮件/正式邀请/撤销更正"
    },
    {
      "fieldId": "F018",
      "key": "stage_code",
      "label": "可信办理日志/阶段转换"
    },
    {
      "fieldId": "F019",
      "key": "current_duties",
      "label": "本科/研究生课程、管理岗位职责的权威安排"
    },
    {
      "fieldId": "F020",
      "key": "replacement_arrangement",
      "label": "任务衔接/替代方案及版本"
    },
    {
      "fieldId": "F021",
      "key": "unit_opinion_ref",
      "label": "单位负责人签署的报名汇总/进修意见"
    },
    {
      "fieldId": "F022",
      "key": "teaching_opinion_ref",
      "label": "教务处/研究生院确认的教学安排意见"
    },
    {
      "fieldId": "F023",
      "key": "application_form_ref",
      "label": "相应项目审核表与签署状态"
    },
    {
      "fieldId": "F024",
      "key": "study_plan_ref",
      "label": "中英文研修计划/出访说明"
    },
    {
      "fieldId": "F025",
      "key": "funding_source_opinion",
      "label": "经费主管/财务部门来源意见"
    },
    {
      "fieldId": "F026",
      "key": "cadre_review_ref",
      "label": "组织部审批结果状态/官方编号"
    },
    {
      "fieldId": "F027",
      "key": "international_opinion_ref",
      "label": "国际处对任务时间等的审核意见"
    },
    {
      "fieldId": "F028",
      "key": "project_recommendation_ref",
      "label": "G05-T03 正式推荐及公示结果"
    },
    {
      "fieldId": "F029",
      "key": "csc_application_ref",
      "label": "CSC 平台提交/退回/提回及时间"
    },
    {
      "fieldId": "F030",
      "key": "csc_admission_ref",
      "label": "CSC 官方录取名单/资格证/录取件"
    },
    {
      "fieldId": "F031",
      "key": "hr_approval_ref",
      "label": "学校人事处或现行授权机构正式决定"
    },
    {
      "fieldId": "F032",
      "key": "training_agreement_ref",
      "label": "双方依法签署的进修协议/生效版本"
    },
    {
      "fieldId": "F033",
      "key": "departure_clearance_ref",
      "label": "G05-T04/国际处任务与行前合规状态"
    },
    {
      "fieldId": "F034",
      "key": "training_enrolment_ref",
      "label": "培训管理平台报名、学籍或选课登记"
    },
    {
      "fieldId": "F035",
      "key": "completion_evidence_ref",
      "label": "官方结业证、认可学时/学籍记录"
    },
    {
      "fieldId": "F036",
      "key": "return_summary_ref",
      "label": "单位确认研修报告/归岗记录及版本"
    },
    {
      "fieldId": "F037",
      "key": "change_request_ref",
      "label": "变更申请、原因、拟时段/地点 + M023:原决定"
    },
    {
      "fieldId": "F038",
      "key": "withdrawal_review_ref",
      "label": "提交及平台回执"
    },
    {
      "fieldId": "F039",
      "key": "authoritative_link",
      "label": "校方/G05/CSC/人事决定 ID＋签发人＋scope"
    },
    {
      "fieldId": "F040",
      "key": "evidence_version_key",
      "label": "文件哈希、来源版本、签发时点、被替换版本"
    },
    {
      "fieldId": "F041",
      "key": "induction_training_mode_basis",
      "label": "线上/线下条件、M026:学校认可的特殊线上资格证明"
    },
    {
      "fieldId": "F042",
      "key": "induction_qualification_basis",
      "label": "本科及以上学历事实、既往岗培学籍/完成记录与拟聘或在岗身份交叉核"
    }
  ],
  "materialSlots": [
    {
      "materialId": "M001",
      "slotId": "M001",
      "name": "案卷提交/受理日志：确定当事人、项目与阶段"
    },
    {
      "materialId": "M002",
      "slotId": "M002",
      "name": "人事身份与在岗／拟聘事实"
    },
    {
      "materialId": "M003",
      "slotId": "M003",
      "name": "代理授权/协办记录：证明代办权"
    },
    {
      "materialId": "M004",
      "slotId": "M004",
      "name": "当期通知/项目授权版本：识别范围与期限"
    },
    {
      "materialId": "M005",
      "slotId": "M005",
      "name": "正式邀请/邀约意向：证明接收单位与拟期限"
    },
    {
      "materialId": "M006",
      "slotId": "M006",
      "name": "工作任务与拟替代计划：说明离岗对课程、管理工作影响"
    },
    {
      "materialId": "M007",
      "slotId": "M007",
      "name": "所在单位意见/学院汇总：核是否已有真实单位审签"
    },
    {
      "materialId": "M008",
      "slotId": "M008",
      "name": "教学主管意见：核派出期教学衔接是否获确认"
    },
    {
      "materialId": "M009",
      "slotId": "M009",
      "name": "该项目申请/审核表：申报身份与人事意见位置"
    },
    {
      "materialId": "M010",
      "slotId": "M010",
      "name": "研修计划/任务说明：活动目的、时间与工作安排"
    },
    {
      "materialId": "M011",
      "slotId": "M011",
      "name": "经费来源及主管/财务前置意见：证明旧制有相关会签"
    },
    {
      "materialId": "M012",
      "slotId": "M012",
      "name": "干部出国政审/审批状态：敏感资格节点"
    },
    {
      "materialId": "M013",
      "slotId": "M013",
      "name": "国际处任务时间等前置意见"
    },
    {
      "materialId": "M014",
      "slotId": "M014",
      "name": "G05 项目材料包索引／校内推荐公示结果（同槽不同阶段）"
    },
    {
      "materialId": "M015",
      "slotId": "M015",
      "name": "CSC 平台申报及提回记录"
    },
    {
      "materialId": "M016",
      "slotId": "M016",
      "name": "CSC 正式录取文件/资格"
    },
    {
      "materialId": "M017",
      "slotId": "M017",
      "name": "校内人事决定"
    },
    {
      "materialId": "M018",
      "slotId": "M018",
      "name": "学校进修协议"
    },
    {
      "materialId": "M019",
      "slotId": "M019",
      "name": "外事任务、证照与行前审核结果"
    },
    {
      "materialId": "M020",
      "slotId": "M020",
      "name": "培训平台注册/学籍"
    },
    {
      "materialId": "M021",
      "slotId": "M021",
      "name": "结业证、学院研修汇总与回国报告"
    },
    {
      "materialId": "M022",
      "slotId": "M022",
      "name": "变更、撤回、补件、复核申请与回执"
    },
    {
      "materialId": "M023",
      "slotId": "M023",
      "name": "跨业务正式决定链接及原决定"
    },
    {
      "materialId": "M024",
      "slotId": "M024",
      "name": "材料版本、来源与读取审计"
    },
    {
      "materialId": "M025",
      "slotId": "M025",
      "name": "博士后在站/人事关系及合作导师同意"
    },
    {
      "materialId": "M026",
      "slotId": "M026",
      "name": "2025 岗培特殊线上培训资格证明：核对应允许的报名方式"
    },
    {
      "materialId": "M027",
      "slotId": "M027",
      "name": "2025 岗培既往参训与学历资格的权威状态"
    }
  ],
  "sources": [
    {
      "srcId": "SRC-001",
      "evidenceStatus": "partial",
      "url": "https://dice.cdut.edu.cn/info/1034/1086.htm"
    },
    {
      "srcId": "SRC-002",
      "evidenceStatus": "verified",
      "url": "https://dice.cdut.edu.cn/info/1034/1085.htm"
    },
    {
      "srcId": "SRC-003",
      "evidenceStatus": "verified",
      "url": "https://dice.cdut.edu.cn/info/1033/1861.htm"
    },
    {
      "srcId": "SRC-004",
      "evidenceStatus": "verified",
      "url": "https://rsc.cdut.edu.cn/info/1011/3932.htm"
    },
    {
      "srcId": "SRC-005",
      "evidenceStatus": "verified",
      "url": "https://rsc.cdut.edu.cn/info/1011/3942.htm"
    },
    {
      "srcId": "SRC-006",
      "evidenceStatus": "verified",
      "url": "https://rsc.cdut.edu.cn/"
    },
    {
      "srcId": "SRC-007",
      "evidenceStatus": "verified",
      "url": "https://dice.cdut.edu.cn/bmgk/bmjj.htm"
    },
    {
      "srcId": "SRC-008",
      "evidenceStatus": "verified",
      "url": "https://rsc.cdut.edu.cn/info/1011/4016.htm"
    },
    {
      "srcId": "SRC-009",
      "evidenceStatus": "verified",
      "url": "https://origin-www.csc.edu.cn/article/3795"
    },
    {
      "srcId": "SRC-010",
      "evidenceStatus": "verified",
      "url": "https://origin-www.csc.edu.cn/article/4131；辅证《2026年创新项目人员申请流程》https://origin-bg.csc.edu.cn/article/3799"
    },
    {
      "srcId": "SRC-011",
      "evidenceStatus": "verified",
      "url": "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json"
    },
    {
      "srcId": "SRC-012",
      "evidenceStatus": "partial",
      "url": "https://dice.cdut.edu.cn/info/1033/1861.htm"
    },
    {
      "srcId": "SRC-013",
      "evidenceStatus": "verified",
      "url": "https://rsc.cdut.edu.cn/info/1040/4042.htm"
    },
    {
      "srcId": "SRC-014",
      "evidenceStatus": "verified",
      "url": "https://cie.cdut.edu.cn/info/1048/1483.htm"
    },
    {
      "srcId": "SRC-015",
      "evidenceStatus": "verified",
      "url": "https://rsc.cdut.edu.cn/info/1040/3514.htm"
    },
    {
      "srcId": "SRC-016",
      "evidenceStatus": "verified",
      "url": "https://rsc.cdut.edu.cn/info/1011/4057.htm"
    }
  ],
  "criteria": [
    {
      "sectionId": "fact-review",
      "criterionId": "R001",
      "srcIds": [
        "SRC-003",
        "SRC-011",
        "SRC-014",
        "SRC-016"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-004",
        "SRC-002",
        "SRC-005",
        "SRC-006",
        "SRC-013"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-006"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-013",
        "SRC-015"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-009",
        "SRC-010",
        "SRC-015"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-011"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-006",
        "SRC-008",
        "SRC-015"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-009"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-012",
        "SRC-015"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-012"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-003",
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-003",
        "SRC-009",
        "SRC-011"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-003",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R026",
      "srcIds": [
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R027",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R028",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R029",
      "srcIds": [
        "SRC-002",
        "SRC-007",
        "SRC-011"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R030",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R031",
      "srcIds": [
        "SRC-013"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R032",
      "srcIds": [
        "SRC-002",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R033",
      "srcIds": [
        "SRC-003",
        "SRC-010"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R034",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-009",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R035",
      "srcIds": [
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-011"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R036",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R037",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "verified"
    }
  ],
  "safetyConstraints": {
    "autoPassEnabled": false,
    "policyVersionIds": [],
    "finalDecision": "manual-authorized-person-only",
    "sourceIndexIdsAreNotCaseSourceRefs": true,
    "unknownPolicyEffect": "needs-confirmation"
  },
  "auxiliaryStageNotes": [
    {
      "id": "LX",
      "name": "撤回、补件、复核",
      "sourceSection": "03.1 / 03.2 H2",
      "behavior": "side-route-available-from-current-stage",
      "runtimeRepresentation": "metadata-only",
      "reason": "原件将 LX 定义为可从多个生命周期阶段发生的侧向事件；当前 WorkflowStageSpec 仅提供单一 nextStageId/returnToStageId，不能无损表达多入口分支。不得把 LX 错误串联为 L6 之后的线性阶段。",
      "integrationAction": "在单独获准的共享 schema/runner 变更中增加分支/转移表达后再接线。"
    }
  ]
} as const
