import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "T02-T13",
  "version": 1,
  "schemaVersion": 2,
  "name": "退休、延期退休及返聘资格审核",
  "description": "本地研究模板 · 非校方正式模板。基于 R02 研究原件形成的事实预审与人工复核候选，不代表成都理工大学现行制度、授权或正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T02-T13 的研究稿并非校方正式模板；校本政策现行性、适用身份和最终审批权限须由有权人员核实。",
  "objectType": "person",
  "displayName": {
    "template": "{{title}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "案卷唯一标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F001；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F001 | 案卷唯一标识 `ID` | Case / P0–P7 | 案卷服务端 | M035:manifest | I | U；不可自行造权威编号 |"
    },
    {
      "key": "f002",
      "label": "办理情形",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F002；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F002 | 办理情形 `enum(C01–C10)` | Case / P0 | 授权受理选择+核验 | M035:scenario | I | H?；C09/C10 作为叠加 |"
    },
    {
      "key": "f003",
      "label": "当前阶段",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F003；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F003 | 当前阶段 `enum(P0–P7)` | Case / 全程 | 已验证办理事件 | M035:stage | I | U；不得以页面状态冒充审批阶段 |"
    },
    {
      "key": "f004",
      "label": "适用政策版本及核定状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F004；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F004 | 适用政策版本及核定状态 `refs/status` | Case / P0、变更时 | 发文机关原文+人事解释 | M036:policy/scope；SRC-001/006/007/009/010 | I | P?；不得写死年龄 |"
    },
    {
      "key": "f005",
      "label": "学校人员权威 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F005；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F005 | 学校人员权威 ID `ID` | Person / P0 | 学校人事 | M001:personId | S | U；本人身份证 OCR 不替代 |"
    },
    {
      "key": "f006",
      "label": "学校核定姓名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F006；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F006 | 学校核定姓名 `string` | Person / P0 | 学校人事 | M001:name、M002:identity | S | U；同音/曾用名交人工核真 |"
    },
    {
      "key": "f007",
      "label": "当前/末任单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F007；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F007 | 当前/末任单位 `orgRef` | Person / P0/P2 | 学校人事与任职文书 | M001:unit | I | U；与申请书冲突→CONFLICT |"
    },
    {
      "key": "f008",
      "label": "在职/延退/已退休状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F008；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F008 | 在职/延退/已退休状态 `enum+time` | Person / P0/P6 | 人事退休登记 | M001:status、M021:retired | S | U；已退休者不可走待退休普通路径 |"
    },
    {
      "key": "f009",
      "label": "人员类别、干部人事管理权限",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F009；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F009 | 人员类别、干部人事管理权限 `enum/ref` | Person / P0/P3 | 组织人事核定 | M002:personCategory | H | U/H?；不可由职称推干部类别 |"
    },
    {
      "key": "f010",
      "label": "学校认定出生年月",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F010；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F010 | 学校认定出生年月 `yearMonth` | Person / P0 | 人事档案审核结论 | M002:birthYM | S | U；自填生日仅候选 |"
    },
    {
      "key": "f011",
      "label": "经权威确定法定退休时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F011；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F011 | 经权威确定法定退休时间 `yearMonth` | Retirement / P0 | 国家法规+授权人事核定 | M003:legalRetireYM、M036:policy | S | U/P?；不直接套通用年龄 |"
    },
    {
      "key": "f012",
      "label": "所适用的最低缴费年限对应年份及有权核证状态 （C02=所选退休年份；C03=法定退休年龄年份）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F012；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F012 | 所适用的最低缴费年限对应**年份及有权核证状态** `enum+year+period`（C02=所选退休年份；C03=法定退休年龄年份） | Retirement / C02/C03 P0–P3 | 社保经办/权威参保记录 | M019:qualifyingYears、M036:policy | S | U/P?；社保审核仍独立决定，不由当前缴费累计反推已符合 |"
    },
    {
      "key": "f013",
      "label": "本次预计/拟经办退休日期",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F013；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F013 | 本次预计/拟经办退休日期 `date` | Retirement / P0/P6 | 人事确认的计划或退休办理文书 | M003:proposed、M020:retireOrder | S | U/H?；未计划时未知 |"
    },
    {
      "key": "f014",
      "label": "弹性提前退休书面告知时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F014；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F014 | 弹性提前退休书面告知时间 `date` | Retirement / C02 P1 | 本人签署、单位收件 | M004:noticeReceivedAt | I | D；非 C02 为 NA |"
    },
    {
      "key": "f015",
      "label": "本人拟选择退休时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F015；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F015 | 本人拟选择退休时间 `yearMonth` | Retirement / C02/C03 P1 | 本人选择/双方书面约定 | M004:chosenYM、M005:agreedYM | S | D；跨政策年度再核 |"
    },
    {
      "key": "f016",
      "label": "弹性延迟协商一致及书面明确",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F016；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F016 | 弹性延迟协商一致及书面明确 `status/date` | Retirement / C03 P1 | 本人和单位签署 | M005:agreement/signatures | I | D；非 C03 为 NA |"
    },
    {
      "key": "f017",
      "label": "正高级专业技术资格",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F017；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F017 | 正高级专业技术资格 `ref/level` | Expert / C04/C05/C09 P0 | 职称有权机构记录 | M007:title | I | U；不以申报表自称替代 |"
    },
    {
      "key": "f018",
      "label": "当前受聘岗位及级别",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F018；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F018 | 当前受聘岗位及级别 `ref/level` | Expert / C04/C05/C09 P0 | 人事聘岗权威记录 | M007:appointment/grade | I | U；岗位和职称分开 |"
    },
    {
      "key": "f019",
      "label": "领导/管理职务及任免状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F019；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F019 | 领导/管理职务及任免状态 `ref/status` | Person / C09 P0/P3 | 组织部门任免决定 | M002:cadre、M029:removal | H | U/H?；移交干部权限 |"
    },
    {
      "key": "f020",
      "label": "单位岗位空缺/限额事实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F020；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F020 | 单位岗位空缺/限额事实 `status` | Expert / C04/C05 P2 | 有权岗位配置部门 | M008:vacancy | I | U/P?；旧 2018 条件现行性待核 |"
    },
    {
      "key": "f021",
      "label": "近年岗位年度考核结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F021；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F021 | 近年岗位年度考核结论 `list/year` | Expert / C04/C05 P2 | 人事考核权威结果 | M009:assessments | S | U/P?；历史年限不硬编码 |"
    },
    {
      "key": "f022",
      "label": "特定荣誉、人才计划资格",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F022；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F022 | 特定荣誉、人才计划资格 `list/ref` | Expert / C04/C05 P2 | 颁发机关/人事认定 | M010:award | I | U 或 NA（替代路径） |"
    },
    {
      "key": "f023",
      "label": "正在承担的项目/重大任务状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F023；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F023 | 正在承担的项目/重大任务状态 `list/ref` | Expert / C04/C05/C10 P2 | 科研归口或上级发文 | M011:project、M030:task | I | U 或 NA（替代路径） |"
    },
    {
      "key": "f024",
      "label": "在培研究生指导事实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F024；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F024 | 在培研究生指导事实 `list/ref` | Expert / C04/C05 P2 | 研究生培养有权系统/证明 | M011:studentGuide | S | U 或 NA（替代路径），不授导师资格 |"
    },
    {
      "key": "f025",
      "label": "能否继续履职的有权确认",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F025；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F025 | 能否继续履职的有权确认 `status` | Expert / C04/C05 P2 | 单位有权确认/必要时适法医疗证明 | M012:fitness、M006:healthDeclaration | H | H?/P?；禁止 AI 医学判断 |"
    },
    {
      "key": "f026",
      "label": "单位工作需要、拟承担任务",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F026；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F026 | 单位工作需要、拟承担任务 `text+period` | Expert/Rehire / P1/P2 | 所在单位正式需求 | M006:plannedWork、M022:roleNeed | I | D（单位发起）或 P? |"
    },
    {
      "key": "f027",
      "label": "上次特殊延退批准及有效期",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F027；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F027 | 上次特殊延退批准及有效期 `decisionRef/date` | Expert / C05 P0 | 上次学校正式批准 | M013:priorDecision | I | U；不得用旧批准替新批准 |"
    },
    {
      "key": "f028",
      "label": "本次申请延退起止/时长",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F028；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F028 | 本次申请延退起止/时长 `dateRange` | Expert / C04/C05 P1 | 本人审批表拟填、单位复核 | M006:requestedPeriod | I | D/P?；旧上限不可自动裁定 |"
    },
    {
      "key": "f029",
      "label": "本人签署及声明",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F029；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F029 | 本人签署及声明 `signatureRef/date` | Expert / C04/C05 P1 | 申请人原始签字/验真 | M006:applicantSignature | S | D；OCR 可见不等于验真 |"
    },
    {
      "key": "f030",
      "label": "所在单位集体研究意见",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F030；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F030 | 所在单位集体研究意见 `eventRef` | Decision / C04/C05 P2 | 会议纪要+责任人签章 | M014:unitDecision | I | L→P2 才核；有权真实性待核 |"
    },
    {
      "key": "f031",
      "label": "人事处审核意见",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F031；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F031 | 人事处审核意见 `eventRef` | Decision / C04/C05 P3 | 人事处授权审查 | M015:hrReview | I | L→P3 才核 |"
    },
    {
      "key": "f032",
      "label": "干部人事权限报批结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F032；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F032 | 干部人事权限报批结果 `decisionRef` | Decision / C02/C03/C09 P3/P4 | 组织人事有权机关 | M016:cadreApproval | H | L/H?；适用权由人事确认 |"
    },
    {
      "key": "f033",
      "label": "校党委常委会审定事件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F033；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F033 | 校党委常委会审定事件 `eventRef` | Decision / C04/C05 P4 | 会议正式决议 | M017:committee | I | L/P?；旧校本流程当前性待核 |"
    },
    {
      "key": "f034",
      "label": "公示及异议核查状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F034；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F034 | 公示及异议核查状态 `status/events` | Decision / C04/C05 P5 | 人事处正式公示、受理核查 | M018:notice/objection | I/H | L/P?；不要提前要公示证明 |"
    },
    {
      "key": "f035",
      "label": "四川省教育厅备案状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F035；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F035 | 四川省教育厅备案状态 `receiptRef` | Decision / C04/C05 P5 | 备案有权部门回执 | M031:filing | I | L/P?；备案非审批 |"
    },
    {
      "key": "f036",
      "label": "正式退休完成状态与日期",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F036；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F036 | 正式退休完成状态与日期 `status/date` | Retirement/Rehire / C06/C07 P0或C01 P6 | 人事退休手续权威记录 | M021:retiredAt | S | U；返聘前必须人工核真 |"
    },
    {
      "key": "f037",
      "label": "社保养老金申请/受理或核定状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F037；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F037 | 社保养老金申请/受理或核定状态 `eventRef` | Retirement / P6 | 社保经办机构正式反馈 | M032:pensionEvent | S | L；非学校资格批准 |"
    },
    {
      "key": "f038",
      "label": "拟返聘岗位、责任、期限",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F038；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F038 | 拟返聘岗位、责任、期限 `object` | Rehire / C06/C07 P1 | 用人单位提出需求 | M022:role/term | I | D（发起单位）/P? |"
    },
    {
      "key": "f039",
      "label": "返聘经费/岗位预算授权",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F039；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F039 | 返聘经费/岗位预算授权 `decisionRef` | Rehire / P2–P4 | 有权财务/校方 | M023:budget | I | L/P?；校本必需性未核 |"
    },
    {
      "key": "f040",
      "label": "有权返聘批准结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F040；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F040 | 有权返聘批准结论 `decisionRef` | Rehire / C06/C07 P4 | 依现行校规的审批机关 | M024:rehireApproval | I | L/P?；不凭外校权限 |"
    },
    {
      "key": "f041",
      "label": "生效返聘协议及期限",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F041；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F041 | 生效返聘协议及期限 `ref/dateRange` | Rehire / C07 P0、C06 P6 | 学校授权签约人与本人签署 | M025:agreement | S | C07 U / C06 L；不能推定协议自动成立 |"
    },
    {
      "key": "f042",
      "label": "本人意愿及身份/签署核实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F042；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F042 | 本人意愿及身份/签署核实 `status/ref` | Retirement/Expert/Rehire / P1 | 本人签名、可信认证或授权 | M004/M005/M006/M022/M034 | S | D/H?；代理另核身份 |"
    },
    {
      "key": "f043",
      "label": "补正、撤回、替换与版本事件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F043；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F043 | 补正、撤回、替换与版本事件 `eventRef` | Evidence / 全程 | 案卷受理日志+原请求 | M027/M035:versionEvents | I | L；无事件为 NA |"
    },
    {
      "key": "f044",
      "label": "外部权威结论引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F044；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F044 | 外部权威结论引用 `sourceRef/version` | Evidence / 条件触发 | G50/S/T/人事/科研/教务等有权来源 | M001/M007/M009/M011/M016/M036 | I | U；不可自己生成被引用决定 |"
    },
    {
      "key": "f045",
      "label": "异议、复核受理和处理结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F045；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F045 | 异议、复核受理和处理结果 `eventRef/status` | Evidence / C08 P5/P7 | 有权部门收件和正式答复 | M027/M028:review | H | L/P?；未知法定渠道转人工 |"
    },
    {
      "key": "f046",
      "label": "学校正式批准延退及有效期限",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F046；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F046 | 学校正式批准延退及有效期限 `decisionRef/dateRange` | Decision / C04/C05 P4–P5 | 学校有权签发批件、盖章审批栏 | M033:schoolApproval | I | L/P?；须独立于 F033 会议、F035 备案 |"
    },
    {
      "key": "f047",
      "label": "是否已开始依法享受基本养老保险待遇/领取退休金及核定时点",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F047；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F047 | 是否已开始依法享受基本养老保险待遇/领取退休金及核定时点 `enum(true/false/unknown)+date` | Rehire/Retirement / C06/C07 P0、涉及关系性质争议时 | 社保经办/人事养老金权威记录，非退休证或本人自述 | M037:pensionBenefitStatus；SRC-014 | S | U；**与 F036 已退休事实不同**，不能以 F047 单项自动定性 |"
    },
    {
      "key": "f048",
      "label": "本次返聘关系性质、签约主体与争议解决途径的有权法律审查结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F048；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F048 | 本次返聘关系性质、签约主体与争议解决途径的**有权法律审查结果** `decisionRef/status` | Rehire / C06/C07 P3–P6、法律关系异议时 | 学校有权限的人事/法务、具体合同签发机关 | M038:legalReview；SRC-014/015 | H | L/P?/H?；法律解释争议不得由模型代判 |"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "人员 ID、姓名、末任单位和在/离职状态",
      "purpose": "人员 ID、姓名、末任单位和在/离职状态；学校人事处；人事主记录摘录；**C 各情形/P0**；C06/C07 也要核退休身份；有权人事部门签章的个人基本信息核验单；F005–F008,F044；SRC-003/005；人；以人事记录版本为主；U，纸件 X；不可凭个人上传身份证代替在册身份",
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
        "人员 ID、姓名、末任单位和在/离职状态与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "出生年月、人员类别/干部权限、必要时管理岗位",
      "purpose": "出生年月、人员类别/干部权限、必要时管理岗位；组织人事/人事处；有权档案认定；**C 各情形/P0**（C09 细分）；干部人事部门正式确认文件；F006,F009,F010,F019；SRC-006/009；人；认定机构与认定时点；U/H?，纸件 X；证件截图只作为冲突线索",
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
        "出生年月、人员类别/干部权限、必要时管理岗位与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "法定退休年月和经办计划",
      "purpose": "法定退休年月和经办计划；人事处；按当期政策及档案核定的退休时间记录；**C C01–C05/P0**，若校内未形成则开人事核定待办；由人事处签署的退休年月确认；计算器仅辅证；F004,F011,F013；SRC-006/007/008/009；校；绑定政策版本；U/P?，纸件 X；不能自动以年龄式补齐",
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
        "法定退休年月和经办计划与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "弹性提前退休本人意愿与选择时间",
      "purpose": "弹性提前退休本人意愿与选择时间；本人持原件、单位收件；书面告知；**C C02/P1**；非 C02 不适用；同等可核的本人签署纸/电子文书及有效收件凭证；F014,F015,F042；SRC-007 第1、2条；人；申请签署版+收件时点；D/X；到期规则仅在适用性确认后判断",
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
        "弹性提前退休本人意愿与选择时间与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "弹性延迟退休双方一致及时间",
      "purpose": "弹性延迟退休双方一致及时间；本人和单位；签署的书面协商安排；**C C03/P1**；非 C03 不适用；学校有授权的书面协议/共同签认确认书；F015,F016,F042；SRC-007 第4–6条；单+人；双方签名版本；D/X；单方申请不能代一致",
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
        "弹性延迟退休双方一致及时间与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "本人填写部分",
      "purpose": "特殊高级专家延退初始申请事实；本人；《成都理工大学高级专家申请延长退休年龄审批表》**本人填写部分**；**K C04/C05/P1**；仅在 SRC-001 当期仍适用或有等效现行表时必需；人事处确认的现行替代表，不可用外校表；F025,F026,F028,F029,F042；SRC-001 第5条/附表 PDF p6；人；签署版本，学校意见栏此时可空；D/P?/X；未签后续学校栏不算缺件",
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
        "本人填写部分与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "专业技术职称和当前聘岗等级",
      "purpose": "专业技术职称和当前聘岗等级；人事处；资格/聘岗权威记录；**K C04/C05/C09/P0**；由人事处核定的职称与聘岗合并证明；F017,F018,F044；SRC-001 第1条、SRC-009；人；岗位聘期版本；U/X，争议交职称/聘岗主管",
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
        "专业技术职称和当前聘岗等级与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "岗位余量及单位需求/编制",
      "purpose": "岗位余量及单位需求/编制；院系及岗位主管；岗位配置证明；**K C04/C05/P2**（旧规候选，现行性待核）；有权岗位配置处室确认意见；F020；SRC-001 第2、3条；单；岗位计划当期版本；U/P?/X；不令个人证明空岗",
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
        "岗位余量及单位需求/编制与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "相关年度考核事实",
      "purpose": "相关年度考核事实；人事处/考核归口；正式考核结果；**K C04/C05/P2**（具体年限待校方确认）；考核主管处室汇总核验；F021,F044；SRC-001 第3条；人；逐考核年度+版本；U/P?/X，不得重评考核",
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
        "相关年度考核事实与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "特殊荣誉、人才计划或贡献认定",
      "purpose": "特殊荣誉、人才计划或贡献认定；颁证机关/人事处；正式称号/认定记录；**K C04/C05/P2**：本人主张该条必要条件时；权威颁发单位核验函或校人事认定；F022；SRC-001 第3条；人；证书编号/有效期；U/P?/X；与 M011 是候选替代路径，不要求同时提供",
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
        "特殊荣誉、人才计划或贡献认定与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "未完科研项目或在培研究生事实",
      "purpose": "未完科研项目或在培研究生事实；科研归口/研究生院；项目或培养权威状态；**K C04/C05/P2**：本人主张该条必要条件时；项目主管/研究生院正式状态核验，不以本人列表代替；F023,F024,F044；SRC-001 第3条；人+项目/学籍；各自状态版本；U/P?/X；两个事实不可互相冒充",
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
        "未完科研项目或在培研究生事实与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "能否履行工作任务",
      "purpose": "能否履行工作任务；用人单位/依法有权医疗机构；履岗确认或合规证明；**K C04/C05/P2**，具体方式与必要性待校方明确；本单位经授权的履岗能力结论（若规定允许）；F025；SRC-001 第2、3条；人；限制健康原始资料传播；H?/P?/X；不对健康自动诊断",
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
        "能否履行工作任务与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "既有延退期限与学校决定",
      "purpose": "既有延退期限与学校决定；学校人事处；上期正式批准/备案记录；**C C05/P0**，其他情形 NA；学校有权人事决定档案认证摘录；F027；SRC-001 第5条；校；旧决定号/有效期；U/X；旧决定不得用于新授权",
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
        "既有延退期限与学校决定与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "教学科研单位集体研究",
      "purpose": "教学科研单位集体研究；单位；党政联席会/实验室主任办公会真实纪要或单位意见；**L C04/C05/P2**；其他情形按校规待核；授权单位正式决议及签章核验；F030；SRC-001 第5条；单；会议批次及签署者；L→P2 后 U/X/H?",
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
        "教学科研单位集体研究与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "人事处资格核查/初审",
      "purpose": "人事处资格核查/初审；人事处；正式审核意见；**L C04/C05/P3**；C01–C03 是否需要单独件待校规；授权人事承办记录/签章审查单；F031；SRC-001 第5条、SRC-007 第13条；校；审查人和时间；L→P3 后 U/X/H?",
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
        "人事处资格核查/初审与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "干部人事管理权限报批",
      "purpose": "干部人事管理权限报批；组织人事有权机关；独立审定/审批记录；**K C02/C03/C09/P3–P4**（符合人员权限条件时）；同一干部权限有权机关电子审批回执；F032,F044；SRC-007 第13条；政/校；审批级别和授权；L/H?/X；校本具体链待核",
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
        "干部人事管理权限报批与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "学校党委常委会审定",
      "purpose": "学校党委常委会审定；学校；真实会议决议；**L C04/C05/P4**（基于旧校规）；学校正式会议决定核验单；F033；SRC-001 第5条；校；会议号/日期/决议版本；L/P?/X；不得以人事处初审代替",
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
        "学校党委常委会审定与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "公示及异议处理",
      "purpose": "公示及异议处理；人事处/有权处理机关；公告、期限记录、异议核查文件；**L C04/C05/P5**（旧校规）；异议发生才附处理；官网存档/盖章公示证明+正式核查决定；F034,F045；SRC-001 第5条；校；公示批次+异议版本；L/P?/X；公示未启动不作初审缺件",
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
        "公示及异议处理与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "养老金最低缴费年限适用和参保事实",
      "purpose": "养老金最低缴费年限适用和参保事实；社保经办/人事薪酬社保科；权威记录；**K C02及C03/P0–P3**：国家弹性退休路线一旦核定适用则须核；非弹性社保路线 NA；社保主管/经办的正式年限核验，不收全部流水；C02 按所选退休年、C03 按法定到龄年；F012；SRC-007 第1、7条；政；适用年份、查询时点、记录版本；U/X/P?；本人截图只供对账，不得以当年累计代替适用年份",
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
        "养老金最低缴费年限适用和参保事实与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "到龄退休事项办理指令/通知",
      "purpose": "到龄退休事项办理指令/通知；人事处；经批准或确认的内部经办单；**L C01–C03/P3–P6**，校内有无专表待核；有权人事岗位出具的退休办理状态证明；F013；SRC-007 第3、8条；校；办理批次；L/P?/X；不是所有人初始申请必需",
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
        "到龄退休事项办理指令/通知与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "已办妥退休的权威事实",
      "purpose": "已办妥退休的权威事实；人事处；退休手续完成/状态登记；**C C06/C07/P0**；**L C01–C05/P6**；学校正式退休证明/有权人事系统状态；F008,F036；SRC-004/007；人/校；退休生效时点；C 时 U/X；退休证明不能由本人声称替代",
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
        "已办妥退休的权威事实与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "返聘工作需要、工作内容及本人意愿候选",
      "purpose": "返聘工作需要、工作内容及本人意愿候选；用人单位和本人；拟聘任务说明/意向；**C C06/P1**，**K C07/P1**；具体校本表单待核；用人单位正式拟聘函+本人可核意愿记录；F026,F038,F042；SRC-001 第7条、SRC-004；单+人；本次拟议版；D/P?/X；仅可预审不代表有权批准",
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
        "返聘工作需要、工作内容及本人意愿候选与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "返聘岗位及经费授权",
      "purpose": "返聘岗位及经费授权；财务/岗位主管；正式预算或岗位批准；**L/K C06/C07/P2–P4**（是否必需及机关待校本核）；同一有权部门批准文书；F039；SRC-004（仅证明材料存在，非授权依据）；校；资金批次+批准版本；L/P?/X；不能凭拟聘函推经费已批",
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
        "返聘岗位及经费授权与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "有权返聘决定",
      "purpose": "有权返聘决定；学校当期规定的批准机关；正式批件；**L C06/C07/P4**，批准机关与程序待核；具有同等授权的正式审批记录；F040；SRC-001 第7条（仅提返聘）；校；批准主体/有效期；L/P?/X；绝不可按外校审批模拟",
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
        "有权返聘决定与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "双方生效返聘协议与期限",
      "purpose": "双方生效返聘协议与期限；正式签约双方；协议原件/校方签约登记；**L C06/P6**；**C C07/P0**；授权签约平台的可核电子协议；F041,F042；SRC-004；具体制度未核；校+人；合同版本及签约权限；C 时 U/X，L 时等待签约",
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
        "双方生效返聘协议与期限与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "返聘履约、续期/解除或转岗事实",
      "purpose": "返聘履约、续期/解除或转岗事实；用人单位、人事及双方；评价与变更原件；**K C07/P1/P7**（申请续期/终止/变更时）；原签约双方签署的履约/解除记录；F041,F043；SRC-004 仅归档线索，细则待取；校+人；原协议关联新版本；U/P?/X；不可由申请口头单方重写协议",
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
        "返聘履约、续期/解除或转岗事实与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "本人/单位补件、撤回、异议/复核请求",
      "purpose": "本人/单位补件、撤回、异议/复核请求；提出者；签署申请及受理记录；**C C08/P触发时**，其余情形非必要；可信身份发起的正式受理事件；F043,F045；SRC-001 第5条（仅公示异议）；案+人；请求与收件时间；D/X；无渠道时 P?，不伪造已受理",
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
        "本人/单位补件、撤回、异议/复核请求与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "有权复核/异议处理结论",
      "purpose": "有权复核/异议处理结论；处理机关；正式书面答复或复核决定；**L C08/P5/P7**；具有权限的处理系统回执/正式文件；F045；SRC-001 第5条，其他待核；校/政；复核决定版本；L/P?/X；AI 预审结果不可代替",
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
        "有权复核/异议处理结论与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "管理职务免除/干部任免事实",
      "purpose": "管理职务免除/干部任免事实；组织人事；免职或任免正式决定；**K C04/C05/C09/P0–P3**，仅触发旧 2018 条款或现行干部政策时；干部管理机关认证的人事变动记录；F019；SRC-001 第3条、SRC-009；人/政；任免生效日期；U/P?/X；不得按“未上传免职令”否定普通退休",
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
        "管理职务免除/干部任免事实与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M030",
      "name": "上级部署重要任务",
      "purpose": "上级部署重要任务；上级主管机关；正式任务文件；**C C10/P1**；有权机关确认任务真实性的正式函；F023,F026；SRC-001 第8条；政；任务文号和期限；U/X；任务本身不等于延退批准",
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
        "上级部署重要任务与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M031",
      "name": "四川省教育厅备案回执/已报备案记录",
      "purpose": "四川省教育厅备案回执/已报备案记录；人事处与省厅；备案证明；**L C04/C05/P5**（旧校本流程，现行性未知）；有权人事处核验已报备案的正式留痕；F035；SRC-001 第5条、SRC-010；政/校；备案批次；L/P?/X；不得当作审批意见",
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
        "四川省教育厅备案回执/已报备案记录与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M032",
      "name": "社保退休待遇申报与审核反馈",
      "purpose": "社保退休待遇申报与审核反馈；社保经办；申请受理/核定回执；**L C01–C03/P6**，特殊延退结束实际退休时再关联；社保经办正式查询/回执；F037；SRC-007 第8、9条；政；受理号和核定时点；L/U/X；不在校内预审直接定养老金",
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
        "社保退休待遇申报与审核反馈与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M033",
      "name": "学校正式延退批准及签章",
      "purpose": "学校正式延退批准及签章；学校；正式审批表学校栏或独立批件；**L C04/C05/P4–P5**，旧路径公示后批准；学校有权签发的正式批准文件；F046；SRC-001 第5条/附件；校；签发日期、批准期限；L/P?/X；与 M017 审定、M031 备案分离",
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
        "学校正式延退批准及签章与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M034",
      "name": "代理/经办者有效授权及身份核验",
      "purpose": "代理/经办者有效授权及身份核验；本人/有权组织；委托或职责授权文件；**K 任一情形/P0–P1**，仅实际代理时；可信认证下的授权记录及有权复核；F042；SRC-001 附表仅证本人签署要求，不证代理许可；校本代理规则待核；人/单；授权范围和有效期；D/H?/X；不能依据口称“代办”放行",
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
        "代理/经办者有效授权及身份核验与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M035",
      "name": "证据清单、版本/替换与阶段事件",
      "purpose": "证据清单、版本/替换与阶段事件；案卷可信记录；系统事件与原件映射；**C 全情形/全程**，由案卷系统产生而非申请人材料；具签名、时间与存证机制的登记表；F001–F003,F043；SRC-001 第5条流程仅用于阶段研究，不是技术实现授权；案；事件序列和版本关系；U；不可由 Renderer 自编历史记录",
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
        "证据清单、版本/替换与阶段事件与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M036",
      "name": "适用法规范本及学校核定政策口径",
      "purpose": "适用法规范本及学校核定政策口径；人事/发文机关；法规库与正式校本解释；**C 全情形/P0**；**现行校本口径缺失则只记待核**；同等效力的正式修订通知/人事授权解释；F004,F011,F044；SRC-001/006/007/009/010；政/校；发布日期/生效日/失效日；P?/U；不让申请人上传代替政策维护",
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
        "适用法规范本及学校核定政策口径与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M037",
      "name": "是否依法开始领取养老金或退休金及权威起领时点",
      "purpose": "是否依法开始领取养老金或退休金及权威起领时点；社保经办/人事薪酬社保；待遇状态摘要；**K C06/C07/P0–P3**：拟定性关系、争议或需确认是否开始领取时；**并非全部返聘一开始必上传的养老金明细**；有权社保/人事部门出具的“已/未/未知”状态核对函，不收金额流水；F047；SRC-007 第8–10条、SRC-014 第21条；人+政；办理序列、查询时点、最小化返回；U/X；退休证明 M021 不能替代依法享受待遇的确证；不得自行推定关系类型",
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
        "是否依法开始领取养老金或退休金及权威起领时点与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M038",
      "name": "本次返聘合同性质、法律主体、风险与争议处理的有权审查意见",
      "purpose": "本次返聘合同性质、法律主体、风险与争议处理的有权审查意见；学校人事/法务/有权签约方；**L/K C06/C07/P3–P6**：需作出关系性质或签约权限判断时；有签发权限的正式合法性/合同审签记录；F048；SRC-014/015、SRC-001 第7条（仅旧校本事项）；校；审查人授权、法律版本、拟议协议版本；L/P?/H?/X；没有校方授权文件不可强行判“劳动”或“劳务”",
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
        "本次返聘合同性质、法律主体、风险与争议处理的有权审查意见与本次事项/人员的对应关系",
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
          "title": "R001 案卷版本及阶段身份",
          "requirement": "**R001** 案卷版本及阶段身份；T:全部 C/P0–P7；F:本案之外；U:案卷关联不清；SRC-001/007；F001–F003,F043；M035；可信事件序列匹配案卷、情形、阶段、人员和文件版本；UI 阶段标签不算事件；T:一致→通过，篡改/并案→`CONFLICT`；F:NA；U:S；案卷有权经办。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "R002 本人姓名、唯一人员 ID 与证明归属",
          "requirement": "**R002** 本人姓名、唯一人员 ID 与证明归属；T:全部 C/P0、重传时；F:无人员相关证据的纯政策研究（不办案）；U:代理/同名主体待核；SRC-003/005；F005,F006,F007；M001,M002,M035；人事权威 ID+姓名与上传件签名/原始证据的人员归属核对；曾用名须档案确认，不靠相似度合并；T:一致→通过，实质不一致→`CONFLICT`；F:NA；U:H；人事档案部门。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "R003 在岗/已退休状态与路线一致",
          "requirement": "**R003** 在岗/已退休状态与路线一致；T:C01–C07/P0及 P6；F:C08 仅就请求文书核对时；U:状态时点缺失；SRC-001/004/007；F002,F008,F036；M001,M021；人事退休登记及生效日；C01–C05 预退/延退须在岗，C06/07 须已有真实退休事实；预申请返聘不得冒充已退休；T:相符→通过，互斥状态→`CONFLICT`；F:NA；U:S；人事处。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "R004 适用法律版本、学校规则和身份门禁",
          "requirement": "**R004** 适用法律版本、学校规则和身份门禁；T:全部 C/P0及政策更改；F:无正在判定的个人案卷；U:校规/身份/衔接未知；SRC-001/006/007/009/010/013；F004,F009,F011；M002,M003,M036；核国家生效日、旧校规版本及人事处正式解释；2018 阈值绝不默认 2026 有效，SRC-013 仅区分两证明路径；T:政策来源和范围可证→通过，政策交叉无法解释→`POLICY_UNCONFIRMED`；F:NA；U:P；人事处政策/干部管理。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "R005 权威法定退休时点与经办计划",
          "requirement": "**R005** 权威法定退休时点与经办计划；T:C01–C05/P0或变化时；F:C06/07 已正式退休后的单纯返聘；U:人员类别/退休年月未核；SRC-006/007/008/009；F009–F011,F013；M002,M003,M036；比对官方政策和人事核定退休年月，校验拟经办时间；官方计算器只辅助，女性高职/干部身份不靠性别 OCR 推算；T:权威值相符→通过，冲突→`CONFLICT`；F:NA；U:P/S 按缺政策或缺记录；人事处。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "R006 弹性提前最低缴费年限事实",
          "requirement": "**R006** 弹性提前最低缴费年限事实；T:C02/P0–P3；F:非 C02；U:社保适用口径/缴费时点未知；SRC-006/007 第1、7条；F012,F015；M019,M036；在拟退休时点核社保主管确认的可认定缴费年限；不自行计算养老金额，也不强要全部参保流水；T:社保可核→通过；不足/特殊年限需有权机关核定→`NEEDS_HUMAN_DECISION`；F:NA；U:P/S；薪酬社保/社保经办。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "R007 弹性提前本人书面告知与提前期",
          "requirement": "**R007** 弹性提前本人书面告知与提前期；T:C02/P1；F:非 C02或尚未 P1；U:本人选择时间/适用日期未知；SRC-007 第2条；F014,F015,F042；M004,M003；用单位可信收件日与本人选定退休时间比较，国家规则至少提前3个月；实际政策适用类别须先经 R004、R005 核实；T:可核且时间符合→通过，文件未交→`NEEDS_MATERIAL`，迟告须人工核处理→`NEEDS_HUMAN_DECISION`；F:NA；U:P/H；本人及人事。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "R008 弹性提前自愿、选择幅度及排除条件",
          "requirement": "**R008** 弹性提前自愿、选择幅度及排除条件；T:C02/P1–P3；F:非 C02；U:旧法定年龄/本人意愿无法辨别；SRC-006 第3条、SRC-007 第1/10/14条；F008,F011,F015,F042；M001,M003,M004,M036；签署与适用生效时点核真；最长提前3年、不得早于适用原法定年龄；已领取养老金或2024年末前到旧法定年龄者需辨明排除；T:基础事实符合→通过，触及排除/特殊身份→`NEEDS_HUMAN_DECISION`；F:NA；U:P；人事/社保。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "R009 弹性延迟双方书面一致",
          "requirement": "**R009** 弹性延迟双方书面一致；T:C03/P1；F:非 C03；U:签约方身份/权限不明；SRC-007 第4、5条；F015,F016,F042；M005,M001；签署书面协议需本人和单位有效意思表示，保留签署日及版本；本人单签或单位口头同意不算双方一致；T:双方真实一致→通过，缺当前协议→`NEEDS_MATERIAL`，两份矛盾→`CONFLICT`；F:NA；U:H；本人、单位签约授权人。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "R010 弹性延迟书面时点、范围与不得再次延长",
          "requirement": "**R010** 弹性延迟书面时点、范围与不得再次延长；T:C03/P1或变更时；F:非 C03；U:法定到龄/月或旧决定路径不明；SRC-007 第4、6条；F011,F015,F016,F027,F028；M003,M005,M013,M036；至少提前1个月书面确定，距法定退休年龄不超3年；确定后不得再延长，提前终止需协商；C05 专家再申请须先与 C03 法律关系分流；T:现有协议事实满足→通过，明显超界/重复延长→`NEEDS_HUMAN_DECISION` 且保留异常理由，不“自动切换”；F:NA；U:P/H；人事/法务。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "R011 干部人事管理权限与正式报批",
          "requirement": "**R011** 干部人事管理权限与正式报批；T:C02/03 适用 SRC-007 第13条或 C09 触发时/P3–P4；F:有权核定不触发的人员；U:干部身份/批准机关未核；SRC-007 第13条、SRC-009；F009,F019,F032；M002,M016；根据组织干部权威分类和当前授权清单核报批事实，普通经办签名不能替干部审批；须在其规定批准阶段查，不在 P1 要批件；T:有真实有权报批→通过，尚未决/权限不明→`NEEDS_HUMAN_DECISION`；F:NA；U:P/H；组织人事权限机关。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "R012 特殊高级专家对象、职称和聘岗级别",
          "requirement": "**R012** 特殊高级专家对象、职称和聘岗级别；T:C04/05/P0，或 C09 需要专业身份时；F:其他且无职称关联；U:2018 资格范围当期有效性未知；SRC-001 第1条、SRC-013（区分证明路径）；F017,F018,F044；M007,M036；校方正高级资格与**现聘教师专业技术岗位等级**分别核；2018 三级及以上是历史文本，不以职称证书等同聘岗；T:两个权威事实各自可核→通过（仅事实），当前准入阈值仍 P；F:NA；U:P；人事聘岗主管。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "R013 专家申请空岗/名额的组织事实",
          "requirement": "**R013** 专家申请空岗/名额的组织事实；T:C04/05/P2且现行政策要求；F:其他案或现行规则不要求；U:2018 空岗条件是否沿用未知；SRC-001 第2–3条、SRC-010；F020；M008,M036；核有权岗位主管本轮批次/时点的空缺，不以单位自述取代；2018 名额条件不得先硬判；T:空岗事实可核→通过，事实冲突→`CONFLICT`；F:NA；U:P；岗位配置主管/人事。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "R014 专家年度考核结论",
          "requirement": "**R014** 专家年度考核结论；T:C04/05/P2且现行规定要求；F:其他或当前明确不要求；U:考核年限与校规仍不明；SRC-001 第3条、SRC-010；F021,F044；M009,M036；只核逐年度有权考核结论及覆盖年度；不由审核系统重评等次或把2018年限作固定条件；T:事实存在且一致→通过，资格是否满足仍人事判断；F:NA；U:P；人事考核归口。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "R015 本次单项主张的荣誉/项目/在培生支撑事实",
          "requirement": "**R015** 本次**单项主张**的荣誉/项目/在培生支撑事实；T:C04/05/P2实际主张某一独立事实，对每个 `claimId` 各评一次；F:现行政策不要求或无该主张；U:2018“至少一种”结构是否沿用未知；SRC-001 第3条、SRC-010；F022–F024,F044；M010,M011,M036；`targetId=claimId`；每次只验证一项：荣誉归人事/颁发机关、项目归科研、在培生归研究生院；不把三个不同事实合并成一条“齐全”结论；能否替代取决于现行规则；T:该项权威事实可核→通过，失效/结题与自述冲突→`CONFLICT`；F:NA；U:P；对应单项原签发机关。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "R016 继续履岗事实及健康材料最小化",
          "requirement": "**R016** 继续履岗事实及健康材料最小化；T:C04/05/P2且规则要求履岗能力；F:非专家分支或无此合法要求；U:所需证明形式不明；SRC-001 第2–3条；F025；M006,M012,M036；仅核由有权单位提供的“能否履行任务”结论，不读取多余诊疗信息；医学判断不交 AI；T:有合法履岗结论→通过，争议→`NEEDS_HUMAN_DECISION`；F:NA；U:P/H；单位有权人事/依法医疗主体。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "R017 专家任务需要与拟延退期限",
          "requirement": "**R017** 专家任务需要与拟延退期限；T:C04/05/P1–P2；F:非专家路线；U:旧延退申请窗口/上限尚待确认；SRC-001 第3–5条；F026,F028；M006,M030,M036；比较本人拟申请期间与单位工作任务、项目周期；2018每期时长、年龄和提前三个月为待核历史阈值；T:任务及拟议期限一致→通过，仅凭此不证准入；F:NA；U:P；用人单位/人事。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "R018 专家本人申请表签署与版本",
          "requirement": "**R018** 专家本人申请表签署与版本；T:C04/05/P1且现行规定采用该表或等效表；F:其他分支；U:校方是否改用新表未知；SRC-001 第5条/附表、SRC-003；F029,F042；M006,M034,M036；只查申请人段落的真实签署及申请版本；P1“单位/学校审批意见”空白合法；代理能否签署另待 R036；T:申请签署已核→通过，现阶段签名缺失→`NEEDS_MATERIAL`；F:NA；U:P/H；本人/人事受理。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "R019 再延退的前次批件及法律路径",
          "requirement": "**R019** 再延退的前次批件及法律路径；T:C05/P0–P1；F:除 C05；U:上期究竟是 C03 弹性延迟还是特殊延退不清；SRC-001 第5条、SRC-007 第4条、SRC-013；F016,F027,F028,F046；M005,M013,M033,M036；前次校方正式批件及期限可溯源；前次批准不自动续批，C03 已确定的弹性延迟不得借旧特殊延退“续期”；T:上期真实有效且路径可辨→通过；路径冲突→`CONFLICT`/有权解释→`NEEDS_HUMAN_DECISION`；F:NA；U:P/H；人事/原决定机关。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "R020 管理职务/领导岗位任免前置",
          "requirement": "**R020** 管理职务/领导岗位任免前置；T:C04/05/09 且人员为规定需处理干部职务/P0–P3；F:未任相关职务者；U:干部级别或现行免职条件未知；SRC-001 第3条、SRC-009；F019,F032；M002,M029,M036；以有权组织任免生效记录核对拟退休、延退关系，不令本人上传组织干部内部文件；T:任免事实可核→通过，能否兼任须权限裁量；F:NA；U:P/H；组织干部部门。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "R021 上级重大任务真实性及例外边界",
          "requirement": "**R021** 上级重大任务真实性及例外边界；T:C10/P1或叠加 C04/05；F:无真实上级特派；U:任务与例外授权条件未知；SRC-001 第8条、SRC-010；F023,F026；M030,M036；任务须有权上级正式发文、指定对象/期限；2018“参照”不等于豁免其他准入条件；T:任务发文真→通过，例外能否获准仍`NEEDS_HUMAN_DECISION`；F:NA；U:P；上级/学校人事。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "R022 单位集体研究程序事实",
          "requirement": "**R022** 单位集体研究程序事实；T:C04/05 且适用2018路线/P2；F:其他或该校规不要求；U:当前路径/会议授权不清；SRC-001 第5条；F026,F030；M014,M006,M036；比对会议批次、任务、人员、形成时点与签发权限；P1 无此纪要属未来证据；T:正式纪要一致→通过，尚未研究→`NEEDS_HUMAN_DECISION`；F:NA；U:P；所在单位集体及人事。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "R023 人事处审核意见真实性",
          "requirement": "**R023** 人事处审核意见真实性；T:C04/05 按现行路线到 P3；F:其他或规则明示不设此环节；U:其他退休类型是否单独复审未知；SRC-001 第5条、SRC-003、SRC-007 第13条；F031；M015,M036；人事处真实授权人员、审核对象与当期材料版本相符；初次申报不得要求已存在审批意见；T:有真实审查事件→通过；待人事审查→`NEEDS_HUMAN_DECISION`；F:NA；U:P；人事处。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "R024 校党委常委会审定事件",
          "requirement": "**R024** 校党委常委会审定事件；T:C04/05 现行应走2018路径/P4；F:其他或规则已变更；U:2026批准权变化未知；SRC-001 第5条；F033；M017,M036；决议编号、签发机关、会议日与该案对应；不能以单位/人事“同意”代常委会；T:审定事实成立→通过，尚待集体决定→`NEEDS_HUMAN_DECISION`；F:NA；U:P；学校有权会议/人事。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "R025 公示程序与异议状态",
          "requirement": "**R025** 公示程序与异议状态；T:C04/05 现行须公示且已到 P5；F:其他或程序不适用；U:2026仍否适用、期间未知；SRC-001 第5条；F034,F045；M018,M028,M036；公告期间及有无异议分别核；2018原文5个工作日不得无条件套2026；有异议先核有权处理；T:公示事实可核→通过，异议未处理→`NEEDS_HUMAN_DECISION`；F:NA；U:P；人事处/异议处理机关。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "R026 正式学校延退批准与期限",
          "requirement": "**R026** 正式学校延退批准与期限；T:C04/05 到现行规定的正式签发节点（2018旧规为P5公示完成后）；F:其他或尚未到签发阶段；U:现行学校批准权限未知；SRC-001 第5条、SRC-013；F033,F046；M017,M033,M036；校方批准文书、权限链、签章/官方系统记录、人员与期次及有效期独立核真；会议审定和学校正式批准不混同；T:批件真实→通过（“批准已存在”的**证据事实**）；无有权决定→`NEEDS_HUMAN_DECISION`；F:NA；U:P/H；学校正式签发机关。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "R027 省厅备案事实及审批区分",
          "requirement": "**R027** 省厅备案事实及审批区分；T:C04/05 现行须备案且达到 P5；F:无需备案/阶段未到；U:川教函2018/462及2026备案范围未知；SRC-001 第5条、SRC-010；F035；M031,M036；备案号/时间与学校批件期次对账；备案是存档程序而非审批或资格真值；T:备案记录真→通过，需备案但尚未完成→`NEEDS_HUMAN_DECISION`；F:NA；U:P；人事处/省厅。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "R028 普通退休实际经办及状态变化",
          "requirement": "**R028** 普通退休实际经办及状态变化；T:C01–03到 P3–P6、C04/05期满转 P6；F:其余；U:校内经办发起权限未知；SRC-004/005/007 第3条；F008,F013,F036；M020,M021；分开检查预排期指令、实际退休手续与登记日期；发起时没有正式退休证明应等 P6；T:当前阶段经办事实成立→通过；待办理→`NEEDS_HUMAN_DECISION`；F:NA；U:P/S；人事处/离退休经办。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "R029 养老金申请和经办结果的独立性",
          "requirement": "**R029** 养老金申请和经办结果的独立性；T:C01–03退休办理后 P6、C04/05实际退休后；F:未退休/仅返聘资格；U:社保经办结果不可得；SRC-007 第7–9条；F012,F037；M019,M032；比对社保申请/受理/核定号及时间，不核定金额和起领月，不能用学校批准替代社保决定；T:回执真实→通过，未核定→`NEEDS_HUMAN_DECISION`；F:NA；U:S；社保经办/薪酬社保。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "R030 返聘前已正式退休",
          "requirement": "**R030** 返聘前已正式退休；T:C06/07/P0；F:仅尚在职延退；U:退休日/状态权威记录不可得；SRC-001 第7条、SRC-004、SRC-007 第5条；F008,F036；M001,M021；必须证明在拟返聘关系生效前真实退休；弹性延迟期间仍为原人事关系，不能视作已返聘；T:已退休→通过，在职状态与申请返聘冲突→`CONFLICT`；F:NA；U:S；人事处。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "R031 返聘工作需求、范围与本人意向",
          "requirement": "**R031** 返聘工作需求、范围与本人意向；T:C06/P1或 C07 续聘/转岗申请；F:单纯协议终止无新聘需要；U:返聘校规是否允许该业务路径未知；SRC-001 第7条、SRC-004；F026,F038,F042；M022,M036；用人单位正式需求与本人意愿、人员及期限核对；不得拿外校表或项目临聘批准作为返聘承诺；T:拟议事实一致→通过，是否可聘仍 P；F:NA；U:P；用人单位/本人、人事。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "R032 返聘预算/岗位授权",
          "requirement": "**R032** 返聘预算/岗位授权；T:C06/07 且现行规则要求、进入 P2–P4；F:无需预算批准或尚未到阶段；U:校规机关/额度未知；SRC-004（仅归档线索）、SRC-001 第7条；F039；M023,M036；同一工作期和签发人的真实经费/岗位权限；预算批准不能推出返聘资格获批；T:预算授权事实可核→通过，尚需有权预算决定→`NEEDS_HUMAN_DECISION`；F:NA；U:P；财务/岗位主管。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R033",
          "title": "R033 返聘正式批准权限与期次",
          "requirement": "**R033** 返聘正式批准权限与期次；T:C06/07 经确认须批且到 P4；F:未到 P4或无需独立批文；U:现行返聘批准机关未知；SRC-001 第7条、SRC-004；F040；M024,M036；校方有权决定文书、签发人/期次/条款与拟议一致；不沿用2018专家延退审批权或外校授权；T:已签发授权决定事实→通过，待批→`NEEDS_HUMAN_DECISION`；F:NA；U:P；学校有权返聘批准者。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R034",
          "title": "R034 返聘协议双方签署的证据事实",
          "requirement": "**R034** 返聘协议双方签署的证据事实；T:C06/P6签约、C07/P0已有协议；F:延退期间或尚未签约的 C06/P1；U:校方签约者权限/法律性质未确认；SRC-004、SRC-001 第7条、SRC-014；F041,F042,F048；M025,M036,M038；核双方实际签署、服务起止、人员与退休事实；**签名事实可过，不代表法律效力/关系类别已被判定**；不凭预算推断协议成立；T:签署证据真实→通过，仅证事实；效力未知另记 R043 的 P/H，未签→`NEEDS_HUMAN_DECISION`；F:NA；U:P/H；校方授权签约人/本人。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R035",
          "title": "R035 返聘续期、转岗和终止的原合同关系",
          "requirement": "**R035** 返聘续期、转岗和终止的原合同关系；T:C07/P1/P7有变更事件；F:C06首次签约或 C07 暂无变更；U:终止/续期校规未核；SRC-004；F038,F041,F043；M025,M026,M035；比对旧协议有效期、变更原因、新的双方真实协议/解除文件和交接；旧协议不能自动展期，也不覆盖历史；T:变更事实有可溯记录→通过，是否生效仍 H；F:NA；U:P；有权签约双方/人事。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R036",
          "title": "R036 单次提交/签署事件的 Actor 及代理授权真实性",
          "requirement": "**R036** 单次提交/签署事件的 Actor 及代理授权真实性；T:全部存在签署/提交/撤回/决定事件，对每个 `eventId` 单独评；代理才需 M034/P0–P7；F:当前无相关事件；U:代理是否合法或审批人权限未知；SRC-001 附表、SRC-007 第2/4/13条；F029,F032,F042；M004,M005,M006,M016,M022,M025,M034,M035；`targetId=eventId`；核一次事件的认证主体、对应权限/授权范围、原件签署；Renderer role/teacher、OCR 印章均不是可信 Actor；T:该事件身份和权限可证→通过，冒用/串案→`CONFLICT`；F:NA；U:P/H；人事权限管理员/事件本人。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R037",
          "title": "R037 相邻权威事实/批准复用与去重",
          "requirement": "**R037** 相邻权威事实/批准复用与去重；T:本案使用 G50/S/T 其他决定或职称、科研等外部权威结果；F:未引用外部结果；U:原决策 ID/版本或目录无法取得；SRC-001/003、SRC-004（仅索引）、SRC-013；F017,F021–F024,F032,F044；M001,M007,M009,M011,M016,M036；同一人员、决定对象、权限、签发来源、有效期和版本逐项核；不把 run@rev、截图“通过”视作真实 Run/决定；T:外部决定可核→通过（仅引用），内容冲突→`CONFLICT`；F:NA；U:S/P；原业务有权 Owner/人事。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R038",
          "title": "R038 补件、撤回、异议及复核的程序状态",
          "requirement": "**R038** 补件、撤回、异议及复核的程序状态；T:C08 或原案出现真实请求/P1–P7；F:无请求；U:正式受理渠道/期限与撤回效力不明；SRC-001 第5条（仅旧公示异议）、SRC-007 第6条（仅弹性延迟提前终止）；F003,F043,F045；M027,M028,M035,M036；核提出者资格、申请版本、收件与有权受理/答复；决定后不得“撤回即删除审批”；政策不支持自动复核期限；T:请求已收件的事实可核→通过，待处理→`NEEDS_HUMAN_DECISION`；F:NA；U:P/H；原案有权受理机关。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R039",
          "title": "R039 单次材料替换事件的定向失效映射",
          "requirement": "**R039** 单次材料替换事件的定向失效映射；T:有某 `replacementEventId` /P0–P7，每个事件单独评；F:无替换；U:主从关联不清；SRC-001 第5条（流程研究）、SRC-019（仅技术目录）；F001,F003,F043,F044；M035,M036；`targetId=replacementEventId`；核版本、片段、issuer、依赖 F/R 图；旧观察归档并不代表当前效力，新版只重审直接/间接依赖 R；正式决定只请求有权复核；T:事件失效范围有凭→通过，旧新证据矛盾→`CONFLICT`；F:NA；U:S；案卷业务 Owner/原决定机关。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R040",
          "title": "R040 弹性延迟退休最低缴费年限核定时点",
          "requirement": "**R040** 弹性**延迟**退休最低缴费年限核定时点；T:C03/P0–P3确属国家弹性延迟路线；F:非C03；U:法定退休时间/年限权威记录或人员适用性不明；SRC-007 第7条、SRC-006；F011,F012,F016；M003,M019,M036；单独核弹性延迟者达到**本人法定退休年龄对应年份**最低缴费年限的权威情况（区别 R006 弹性提前按选定退休年份）；不以退休后月份年限倒填资格；T:权威记录可核→`PASS_FACT`（仅事实），未满足/例外争议→`NEEDS_HUMAN_DECISION`；F:NA；U:S/P；人事薪酬社保科/社保经办。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R041",
          "title": "R041 敏感人事/医疗/养老数据的单次处理权限",
          "requirement": "**R041** 敏感人事/医疗/养老数据的单次处理权限；T:调取、OCR、对外传输或披露涉及 F009/F010/F025/F047 的记录时，按 `accessEventId` 评；F:纯公开制度比对无个人信息；U:访问法律基础/最小必要性或授权来源未核；SRC-016 第6、13、28–30、51条；F001,F009,F010,F025,F047；M001,M002,M012,M035,M037；比对读取者服务端真实权限、限定目的/字段、处理合法性、保护措施与审计事件；不得把病历整页给通用模型或把本人上传视作一切用途同意；T:一次受控处理有可信记录→`PASS_FACT`（仅合法性证据），越权/不必要披露→`NEEDS_HUMAN_DECISION`并阻断导出；F:NA；U:H/S；数据持有人/隐私负责人。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R042",
          "title": "R042 返聘当事人是否已依法开始享受养老待遇",
          "requirement": "**R042** 返聘当事人是否已依法开始享受养老待遇；T:C06/C07/P0–P3拟作合同法律性质判断或待遇状态争议；F:与关系性质无关的单纯归档；U:待遇记录不可得；SRC-007 第8–10条、SRC-014 第21条；F036,F047；M021,M037；单独核养老金/退休金**实际权威状态和时点**，不以“退休证”“满退休年龄”“领取退休金”互相推定，更不援引已废 2020 解释第32条第1款自动判劳务；T:状态事实与对应时点可核→`PASS_FACT`；证据冲突→`CONFLICT`；F:NA；U:S；社保经办/人事薪酬社保。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R043",
          "title": "R043 返聘合同法律性质和签约权限有权审查事实",
          "requirement": "**R043** 返聘合同法律性质和签约权限有权审查事实；T:C06/C07/P3–P6需签约、续签或发生关系性质异议；F:在岗 C03 且只延续原人事关系；U:当期法解释/学校授权或协议版本未定；SRC-014 第21条、SRC-015 第36/37条、SRC-001 第7条（2018）；F041,F047,F048；M025,M037,M038,M036；核是否存在与**本次协议版本**绑定的正式法务/人事审查、签约方权限和适用法版本；当前校本返聘专规缺失时不能当作必经内部表单，更不能把 AI 预测写 F048；T:有权审查真实存在→`PASS_FACT`（只证存在），尚待决定→`NEEDS_HUMAN_DECISION`；F:NA；U:P/H；学校人事/法务及有权签约主体。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "P0",
      "name": "预核身份与适用政策",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P1",
      "workflowOwner": "local"
    },
    {
      "id": "P1",
      "name": "本人选择/申请或单位提出需求",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P2",
      "workflowOwner": "local"
    },
    {
      "id": "P2",
      "name": "单位核验/集体研究（仅适用分支）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P3",
      "workflowOwner": "local"
    },
    {
      "id": "P3",
      "name": "人事/干部权限审核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P4",
      "workflowOwner": "local"
    },
    {
      "id": "P4",
      "name": "有权决定",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P5",
      "workflowOwner": "local"
    },
    {
      "id": "P5",
      "name": "公示异议/备案（仅适用分支）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P6",
      "workflowOwner": "local"
    },
    {
      "id": "P6",
      "name": "办理退休、社保申请或签署返聘协议",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P7",
      "workflowOwner": "local"
    },
    {
      "id": "P7",
      "name": "履行、归档、续期/退出/复核",
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
  "templateId": "T02-T13",
  "name": "退休、延期退休及返聘资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T02-T13.md",
  "sourceDocumentBytes": 148284,
  "sourceDocumentSha256": "f28b5fac67d0e060a52895fe60b0fefe3b9cf80299d15e310d4d75bf5e62f4b9",
  "sourceIntegrityVerifiedAgainstManifest": true,
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23（当前可访问的最新正式 MD）",
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceSummary": "国家 2025 年退休规则可核；2018 校本特殊延退办法现行性、2026 校内流程、特殊女性身份政策和返聘授权仍需确认。",
  "workflowOwner": "local",
  "fields": [
    {
      "fieldId": "F001",
      "key": "f001",
      "label": "案卷唯一标识"
    },
    {
      "fieldId": "F002",
      "key": "f002",
      "label": "办理情形"
    },
    {
      "fieldId": "F003",
      "key": "f003",
      "label": "当前阶段"
    },
    {
      "fieldId": "F004",
      "key": "f004",
      "label": "适用政策版本及核定状态"
    },
    {
      "fieldId": "F005",
      "key": "f005",
      "label": "学校人员权威 ID"
    },
    {
      "fieldId": "F006",
      "key": "f006",
      "label": "学校核定姓名"
    },
    {
      "fieldId": "F007",
      "key": "f007",
      "label": "当前/末任单位"
    },
    {
      "fieldId": "F008",
      "key": "f008",
      "label": "在职/延退/已退休状态"
    },
    {
      "fieldId": "F009",
      "key": "f009",
      "label": "人员类别、干部人事管理权限"
    },
    {
      "fieldId": "F010",
      "key": "f010",
      "label": "学校认定出生年月"
    },
    {
      "fieldId": "F011",
      "key": "f011",
      "label": "经权威确定法定退休时间"
    },
    {
      "fieldId": "F012",
      "key": "f012",
      "label": "所适用的最低缴费年限对应年份及有权核证状态 （C02=所选退休年份；C03=法定退休年龄年份）"
    },
    {
      "fieldId": "F013",
      "key": "f013",
      "label": "本次预计/拟经办退休日期"
    },
    {
      "fieldId": "F014",
      "key": "f014",
      "label": "弹性提前退休书面告知时间"
    },
    {
      "fieldId": "F015",
      "key": "f015",
      "label": "本人拟选择退休时间"
    },
    {
      "fieldId": "F016",
      "key": "f016",
      "label": "弹性延迟协商一致及书面明确"
    },
    {
      "fieldId": "F017",
      "key": "f017",
      "label": "正高级专业技术资格"
    },
    {
      "fieldId": "F018",
      "key": "f018",
      "label": "当前受聘岗位及级别"
    },
    {
      "fieldId": "F019",
      "key": "f019",
      "label": "领导/管理职务及任免状态"
    },
    {
      "fieldId": "F020",
      "key": "f020",
      "label": "单位岗位空缺/限额事实"
    },
    {
      "fieldId": "F021",
      "key": "f021",
      "label": "近年岗位年度考核结论"
    },
    {
      "fieldId": "F022",
      "key": "f022",
      "label": "特定荣誉、人才计划资格"
    },
    {
      "fieldId": "F023",
      "key": "f023",
      "label": "正在承担的项目/重大任务状态"
    },
    {
      "fieldId": "F024",
      "key": "f024",
      "label": "在培研究生指导事实"
    },
    {
      "fieldId": "F025",
      "key": "f025",
      "label": "能否继续履职的有权确认"
    },
    {
      "fieldId": "F026",
      "key": "f026",
      "label": "单位工作需要、拟承担任务"
    },
    {
      "fieldId": "F027",
      "key": "f027",
      "label": "上次特殊延退批准及有效期"
    },
    {
      "fieldId": "F028",
      "key": "f028",
      "label": "本次申请延退起止/时长"
    },
    {
      "fieldId": "F029",
      "key": "f029",
      "label": "本人签署及声明"
    },
    {
      "fieldId": "F030",
      "key": "f030",
      "label": "所在单位集体研究意见"
    },
    {
      "fieldId": "F031",
      "key": "f031",
      "label": "人事处审核意见"
    },
    {
      "fieldId": "F032",
      "key": "f032",
      "label": "干部人事权限报批结果"
    },
    {
      "fieldId": "F033",
      "key": "f033",
      "label": "校党委常委会审定事件"
    },
    {
      "fieldId": "F034",
      "key": "f034",
      "label": "公示及异议核查状态"
    },
    {
      "fieldId": "F035",
      "key": "f035",
      "label": "四川省教育厅备案状态"
    },
    {
      "fieldId": "F036",
      "key": "f036",
      "label": "正式退休完成状态与日期"
    },
    {
      "fieldId": "F037",
      "key": "f037",
      "label": "社保养老金申请/受理或核定状态"
    },
    {
      "fieldId": "F038",
      "key": "f038",
      "label": "拟返聘岗位、责任、期限"
    },
    {
      "fieldId": "F039",
      "key": "f039",
      "label": "返聘经费/岗位预算授权"
    },
    {
      "fieldId": "F040",
      "key": "f040",
      "label": "有权返聘批准结论"
    },
    {
      "fieldId": "F041",
      "key": "f041",
      "label": "生效返聘协议及期限"
    },
    {
      "fieldId": "F042",
      "key": "f042",
      "label": "本人意愿及身份/签署核实"
    },
    {
      "fieldId": "F043",
      "key": "f043",
      "label": "补正、撤回、替换与版本事件"
    },
    {
      "fieldId": "F044",
      "key": "f044",
      "label": "外部权威结论引用"
    },
    {
      "fieldId": "F045",
      "key": "f045",
      "label": "异议、复核受理和处理结果"
    },
    {
      "fieldId": "F046",
      "key": "f046",
      "label": "学校正式批准延退及有效期限"
    },
    {
      "fieldId": "F047",
      "key": "f047",
      "label": "是否已开始依法享受基本养老保险待遇/领取退休金及核定时点"
    },
    {
      "fieldId": "F048",
      "key": "f048",
      "label": "本次返聘关系性质、签约主体与争议解决途径的有权法律审查结果"
    }
  ],
  "materialSlots": [
    {
      "materialId": "M001",
      "slotId": "M001",
      "name": "人员 ID、姓名、末任单位和在/离职状态"
    },
    {
      "materialId": "M002",
      "slotId": "M002",
      "name": "出生年月、人员类别/干部权限、必要时管理岗位"
    },
    {
      "materialId": "M003",
      "slotId": "M003",
      "name": "法定退休年月和经办计划"
    },
    {
      "materialId": "M004",
      "slotId": "M004",
      "name": "弹性提前退休本人意愿与选择时间"
    },
    {
      "materialId": "M005",
      "slotId": "M005",
      "name": "弹性延迟退休双方一致及时间"
    },
    {
      "materialId": "M006",
      "slotId": "M006",
      "name": "本人填写部分"
    },
    {
      "materialId": "M007",
      "slotId": "M007",
      "name": "专业技术职称和当前聘岗等级"
    },
    {
      "materialId": "M008",
      "slotId": "M008",
      "name": "岗位余量及单位需求/编制"
    },
    {
      "materialId": "M009",
      "slotId": "M009",
      "name": "相关年度考核事实"
    },
    {
      "materialId": "M010",
      "slotId": "M010",
      "name": "特殊荣誉、人才计划或贡献认定"
    },
    {
      "materialId": "M011",
      "slotId": "M011",
      "name": "未完科研项目或在培研究生事实"
    },
    {
      "materialId": "M012",
      "slotId": "M012",
      "name": "能否履行工作任务"
    },
    {
      "materialId": "M013",
      "slotId": "M013",
      "name": "既有延退期限与学校决定"
    },
    {
      "materialId": "M014",
      "slotId": "M014",
      "name": "教学科研单位集体研究"
    },
    {
      "materialId": "M015",
      "slotId": "M015",
      "name": "人事处资格核查/初审"
    },
    {
      "materialId": "M016",
      "slotId": "M016",
      "name": "干部人事管理权限报批"
    },
    {
      "materialId": "M017",
      "slotId": "M017",
      "name": "学校党委常委会审定"
    },
    {
      "materialId": "M018",
      "slotId": "M018",
      "name": "公示及异议处理"
    },
    {
      "materialId": "M019",
      "slotId": "M019",
      "name": "养老金最低缴费年限适用和参保事实"
    },
    {
      "materialId": "M020",
      "slotId": "M020",
      "name": "到龄退休事项办理指令/通知"
    },
    {
      "materialId": "M021",
      "slotId": "M021",
      "name": "已办妥退休的权威事实"
    },
    {
      "materialId": "M022",
      "slotId": "M022",
      "name": "返聘工作需要、工作内容及本人意愿候选"
    },
    {
      "materialId": "M023",
      "slotId": "M023",
      "name": "返聘岗位及经费授权"
    },
    {
      "materialId": "M024",
      "slotId": "M024",
      "name": "有权返聘决定"
    },
    {
      "materialId": "M025",
      "slotId": "M025",
      "name": "双方生效返聘协议与期限"
    },
    {
      "materialId": "M026",
      "slotId": "M026",
      "name": "返聘履约、续期/解除或转岗事实"
    },
    {
      "materialId": "M027",
      "slotId": "M027",
      "name": "本人/单位补件、撤回、异议/复核请求"
    },
    {
      "materialId": "M028",
      "slotId": "M028",
      "name": "有权复核/异议处理结论"
    },
    {
      "materialId": "M029",
      "slotId": "M029",
      "name": "管理职务免除/干部任免事实"
    },
    {
      "materialId": "M030",
      "slotId": "M030",
      "name": "上级部署重要任务"
    },
    {
      "materialId": "M031",
      "slotId": "M031",
      "name": "四川省教育厅备案回执/已报备案记录"
    },
    {
      "materialId": "M032",
      "slotId": "M032",
      "name": "社保退休待遇申报与审核反馈"
    },
    {
      "materialId": "M033",
      "slotId": "M033",
      "name": "学校正式延退批准及签章"
    },
    {
      "materialId": "M034",
      "slotId": "M034",
      "name": "代理/经办者有效授权及身份核验"
    },
    {
      "materialId": "M035",
      "slotId": "M035",
      "name": "证据清单、版本/替换与阶段事件"
    },
    {
      "materialId": "M036",
      "slotId": "M036",
      "name": "适用法规范本及学校核定政策口径"
    },
    {
      "materialId": "M037",
      "slotId": "M037",
      "name": "是否依法开始领取养老金或退休金及权威起领时点"
    },
    {
      "materialId": "M038",
      "slotId": "M038",
      "name": "本次返聘合同性质、法律主体、风险与争议处理的有权审查意见"
    }
  ],
  "sources": [
    {
      "srcId": "SRC-001",
      "evidenceStatus": "partial",
      "url": "https://energy.cdut.edu.cn/__local/9/2B/47/E629E0DE36A2DD65D35BC43C566_E42FAFF2_4BC39.pdf"
    },
    {
      "srcId": "SRC-002",
      "evidenceStatus": "verified",
      "url": "https://energy.cdut.edu.cn/yjsjyy/dspr.htm"
    },
    {
      "srcId": "SRC-003",
      "evidenceStatus": "verified",
      "url": "https://rsc.cdut.edu.cn/"
    },
    {
      "srcId": "SRC-004",
      "evidenceStatus": "verified",
      "url": "https://dag.cdut.edu.cn/info/1081/1286.htm"
    },
    {
      "srcId": "SRC-005",
      "evidenceStatus": "verified",
      "url": "https://ltx.cdut.edu.cn/bmgk/kszz.htm"
    },
    {
      "srcId": "SRC-006",
      "evidenceStatus": "verified",
      "url": "https://www.mohrss.gov.cn/SYrlzyhshbzb/dongtaixinwen/buneiyaowen/rsxw/202409/t20240913_525781.html"
    },
    {
      "srcId": "SRC-007",
      "evidenceStatus": "verified",
      "url": "https://www.mohrss.gov.cn/wap/zc/zcwj/202501/t20250101_533701.html"
    },
    {
      "srcId": "SRC-008",
      "evidenceStatus": "verified",
      "url": "https://www.mohrss.gov.cn/SYrlzyhshbzb/ztzl/zt202409/zcmdm/202409/t20240913_525722.html"
    },
    {
      "srcId": "SRC-009",
      "evidenceStatus": "partial",
      "url": "https://www.yxes.gov.cn/esxzfxxgk/esxrsjjyyatabljg6043/20251015/1628394.html"
    },
    {
      "srcId": "SRC-010",
      "evidenceStatus": "partial",
      "url": null
    },
    {
      "srcId": "SRC-011",
      "evidenceStatus": "unconfirmed",
      "url": "https://rsc.sicau.edu.cn/info/1024/5936.htm"
    },
    {
      "srcId": "SRC-012",
      "evidenceStatus": "unconfirmed",
      "url": "https://www2.scut.edu.cn/hr/2025/0611/c4310a593852/page.htm"
    },
    {
      "srcId": "SRC-013",
      "evidenceStatus": "verified",
      "url": "https://rsc.cdut.edu.cn/info/1040/3940.htm"
    },
    {
      "srcId": "SRC-014",
      "evidenceStatus": "verified",
      "url": "https://www.court.gov.cn/zixun/xiangqing/472691.html"
    },
    {
      "srcId": "SRC-015",
      "evidenceStatus": "verified",
      "url": "https://xzfg.moj.gov.cn/front/law/detail?LawID=414"
    },
    {
      "srcId": "SRC-016",
      "evidenceStatus": "verified",
      "url": "https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm"
    },
    {
      "srcId": "SRC-017",
      "evidenceStatus": "unconfirmed",
      "url": "https://rsc.cpu.edu.cn/c1/1c/c4798a246044/page.htm"
    },
    {
      "srcId": "SRC-018",
      "evidenceStatus": "verified",
      "url": "https://rsc.cdut.edu.cn/info/1040/3883.htm"
    },
    {
      "srcId": "SRC-019",
      "evidenceStatus": "verified",
      "url": "https://raw.githubusercontent.com/Fuck-GH-Admin/cdut-studio-review-agent/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json"
    }
  ],
  "criteria": [
    {
      "sectionId": "fact-review",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-007",
        "SRC-009"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-007"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R026",
      "srcIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R027",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R028",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R029",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-007"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R032",
      "srcIds": [
        "SRC-004",
        "SRC-001"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R033",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R034",
      "srcIds": [
        "SRC-004",
        "SRC-001",
        "SRC-014"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R035",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R036",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R037",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-013"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R038",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R039",
      "srcIds": [
        "SRC-001",
        "SRC-019"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R040",
      "srcIds": [
        "SRC-007",
        "SRC-006"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R041",
      "srcIds": [
        "SRC-016"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R042",
      "srcIds": [
        "SRC-007",
        "SRC-014"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R043",
      "srcIds": [
        "SRC-014",
        "SRC-015",
        "SRC-001"
      ],
      "evidenceStatus": "partial"
    }
  ],
  "safetyConstraints": {
    "autoPassEnabled": false,
    "policyVersionIds": [],
    "finalDecision": "manual-authorized-person-only",
    "sourceIndexIdsAreNotCaseSourceRefs": true,
    "unknownPolicyEffect": "needs-confirmation"
  }
} as const
