import type { TemplateVersion } from '@profer/shared'

/** R02 local research definition; it is not a school-issued or school-approved template. */
export const templateVersion: TemplateVersion = {
  "templateId": "S02-T09",
  "version": 1,
  "schemaVersion": 2,
  "name": "辅修、双学位、微专业修读资格审核",
  "description": "本地研究模板 · 非校方正式模板。国家辅修/双学士规则与《学位法》可核；校本微专业办法和2025年学位授予细则正文未取得，具体门槛必须按项目与批次隔离。 仅用于事实预审、证据整理和人工待办；政策或权限未确认时不得自动批准或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；来源为当前集成分支研究原件 S02-T09.md。研究来源 SRC 仅是来源索引，不是案卷材料 SourceRef。",
  "objectType": "person",
  "displayName": {
    "template": "{{f003}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "string；A 案卷/申请标识",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F001；来源/阶段/隐私/缺失处置：L1—L8；T0 内部持久化申请号，不能等同学校受理号；M013/M014；P1",
      "displayHint": "原稿字段编号 F001。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f002",
      "label": "string；I 学校稳定学生身份键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F002；来源/阶段/隐私/缺失处置：L1—L8；T0 学校认证或 T1 学籍证明，M002/M003；P2",
      "displayHint": "原稿字段编号 F002。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f003",
      "label": "string；I 法定/学籍姓名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F003；来源/阶段/隐私/缺失处置：L1—L8；T0/T1 学籍记录 + M004 的申请姓名位置；P2",
      "displayHint": "原稿字段编号 F003。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f004",
      "label": "enum；I 学段及培养类别",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F004；来源/阶段/隐私/缺失处置：L1—L8；T0/T1 学籍记录 M002；P2",
      "displayHint": "原稿字段编号 F004。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f005",
      "label": "enum+validAt；I 在籍/休复退状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F005；来源/阶段/隐私/缺失处置：L1—L8；T0/T1 有权学籍记录 M002/M023；P2",
      "displayHint": "原稿字段编号 F005。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f006",
      "label": "string/number；H 年级、入学届次",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F006；来源/阶段/隐私/缺失处置：L1—L2、L6；T0/T1 学籍学年记录 M003；P2",
      "displayHint": "原稿字段编号 F006。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f007",
      "label": "string；H 主修学院",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F007；来源/阶段/隐私/缺失处置：L1—L2、L6；T0/T1 学籍与盖章成绩 M003/M005；P2",
      "displayHint": "原稿字段编号 F007。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f008",
      "label": "code+category；H 主修专业/大类",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F008；来源/阶段/隐私/缺失处置：L1—L2、L6；T0/T1 主修专业原始编码 M003；P2",
      "displayHint": "原稿字段编号 F008。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f009",
      "label": "enum；H 当前办学校区",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F009；来源/阶段/隐私/缺失处置：L1—L2、L6；T0/T1 学籍就读校区 M003；P2",
      "displayHint": "原稿字段编号 F009。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f010",
      "label": "ref；A 当前操作人身份/可代理范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F010；来源/阶段/隐私/缺失处置：每次动作；T0 可信 Host/Main 身份门禁 + M027，非 Renderer 参数；P3",
      "displayHint": "原稿字段编号 F010。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f011",
      "label": "enum；A MINOR_BACHELOR/DUAL_BACHELOR_PROGRAM/MICRO_PROGRAM/HISTORICAL_DUAL",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F011；来源/阶段/隐私/缺失处置：L0—L8；T1 项目章程/批准、T2 申请选择 M001/M012/M027；P1",
      "displayHint": "原稿字段编号 F011。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f012",
      "label": "string；B 项目正式标识与名称",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F012；来源/阶段/隐私/缺失处置：L0—L8；T1 校方招简/项目批件 M001/M012；P1",
      "displayHint": "原稿字段编号 F012。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f013",
      "label": "string/ref；B 承办学院/主管单位",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F013；来源/阶段/隐私/缺失处置：L0—L8；T1 招简落款及原文件 M001；P1",
      "displayHint": "原稿字段编号 F013。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f014",
      "label": "string；B 招生年份/学期/批次键",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F014；来源/阶段/隐私/缺失处置：L0—L8；T1 官方通知标题与版本 M001；P1",
      "displayHint": "原稿字段编号 F014。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f015",
      "label": "ref+date/hash；B 生效政策/公告版次",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F015；来源/阶段/隐私/缺失处置：L0—L8；T1 公告 URL/原件章节与快照 M001/M028；P1",
      "displayHint": "原稿字段编号 F015。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f016",
      "label": "datetime range；B 电子/纸质截止及公示窗口",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F016；来源/阶段/隐私/缺失处置：L0—L5；T1 当期招简具体节次 M001；P1",
      "displayHint": "原稿字段编号 F016。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f017",
      "label": "int；B 招收容量/是否计划满额",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F017；来源/阶段/隐私/缺失处置：L0/L3；T1 公告上限/学院报考统计 M001/M017；P1",
      "displayHint": "原稿字段编号 F017。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f018",
      "label": "structured；B 项目年级、校区、学科范围",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F018；来源/阶段/隐私/缺失处置：L0/L2；T1 招简资格条款 M001；P1",
      "displayHint": "原稿字段编号 F018。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f019",
      "label": "number+qualifier；B 批次 GPA 门槛及计算口径",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F019；来源/阶段/隐私/缺失处置：L0/L2；T1 招简资格段 M001；“原则”标记不可丢失；P1",
      "displayHint": "原稿字段编号 F019。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f020",
      "label": "decimal；H 主修有效 GPA",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F020；来源/阶段/隐私/缺失处置：L1/L2/L3；T0 教务成绩主记录或 T1 盖章成绩单 M005；P2",
      "displayHint": "原稿字段编号 F020。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f021",
      "label": "date/ref；H GPA 计算学期与出具源版本",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F021；来源/阶段/隐私/缺失处置：L1/L2/L3、重审；T0/T1 官方成绩单版本/查询时间 M005/M026；P2",
      "displayHint": "原稿字段编号 F021。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f022",
      "label": "enum/ref；H 核心课有无重修",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F022；来源/阶段/隐私/缺失处置：仅 C02 L2；T0 成绩/修读档案 M010 或 T1 有权学院证明；P2",
      "displayHint": "原稿字段编号 F022。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f023",
      "label": "enum+validAt；H 违纪处分状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F023；来源/阶段/隐私/缺失处置：C02—C05 L2/L6；T0 校方授权处置记录或 T1 有权证明 M008；P3",
      "displayHint": "原稿字段编号 F023。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f024",
      "label": "enum/ref；H 其他在读微专业",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F024；来源/阶段/隐私/缺失处置：C04 L2/L6；T0 学校项目注册记录/T1 正式证明 M009；P2",
      "displayHint": "原稿字段编号 F024。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f025",
      "label": "int/ref；H 已修读辅修项目数",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F025；来源/阶段/隐私/缺失处置：C01 L2/L6；T0 学校辅修记录/T1 历史入读证明 M011；P2",
      "displayHint": "原稿字段编号 F025。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f026",
      "label": "bool+categoryProof；H 主辅专业大类差异",
      "kind": "boolean",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F026；来源/阶段/隐私/缺失处置：C01 L2；T1 专业目录 + T0 学籍编码 M003/M011；P2",
      "displayHint": "原稿字段编号 F026。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f027",
      "label": "text；A 学生修读意愿/事由",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F027；来源/阶段/隐私/缺失处置：L1/L2；T2 本人表单/简历 M004/M006；P2",
      "displayHint": "原稿字段编号 F027。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f028",
      "label": "person+time；A 申请表署名/同意",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F028；来源/阶段/隐私/缺失处置：L1；T2 纸质签名/可信电子签 M004，是否本人须核 F002/F010；P2",
      "displayHint": "原稿字段编号 F028。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f029",
      "label": "datetime+receiptRef；A 电子提交",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F029；来源/阶段/隐私/缺失处置：L1/L2；T1 招办邮箱回执/学校在线汇总平台 M013；P2",
      "displayHint": "原稿字段编号 F029。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f030",
      "label": "datetime+receiptRef；A 纸质提交",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F030；来源/阶段/隐私/缺失处置：L1/L2，C05 秋季首周；T1 收件盖章/签收记录 M014；P2",
      "displayHint": "原稿字段编号 F030。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f031",
      "label": "ref+hash/version；E 材料页位和版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F031；来源/阶段/隐私/缺失处置：任意已到阶段；原件哈希、页/段、签发日/取得日、所有者 M004—M028；P2",
      "displayHint": "原稿字段编号 F031。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f032",
      "label": "enum+decisionRef；S 学院资格初审结论",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F032；来源/阶段/隐私/缺失处置：L2—L3 结束时；T1 承办学院原始审核单 M015；P2",
      "displayHint": "原稿字段编号 F032。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f033",
      "label": "int；S 本批实收有效报名人数",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F033；来源/阶段/隐私/缺失处置：L3；T1 招办有效报名统计 M017；P1",
      "displayHint": "原稿字段编号 F033。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f034",
      "label": "enum/ref；S 当期择优/面试触发方案",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F034；来源/阶段/隐私/缺失处置：L3；T1 官方方案与学院审核会议/记录 M001/M017；P1",
      "displayHint": "原稿字段编号 F034。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f035",
      "label": "structured/ref；S 专家面试出席和评分",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F035；来源/阶段/隐私/缺失处置：C04 超额 L3；T1 评委原始签发评分 M016；P3",
      "displayHint": "原稿字段编号 F035。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f036",
      "label": "int/ref；S 学院最终择优序位或评审结论",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F036；来源/阶段/隐私/缺失处置：超额 L3；T1 经学院核定的原始择优记录 M017；P2",
      "displayHint": "原稿字段编号 F036。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f037",
      "label": "ref；S 拟录取名单版本及候选人匹配",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F037；来源/阶段/隐私/缺失处置：L4；T1 学院原始 PDF/公告 M018；掩码不得独立认人；P2",
      "displayHint": "原稿字段编号 F037。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f038",
      "label": "datetime range；S 公示开始结束、异议渠道",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F038；来源/阶段/隐私/缺失处置：L4；T1 官方公示原页及办学学院通知 M018；P1",
      "displayHint": "原稿字段编号 F038。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f039",
      "label": "ref+status；S 异议提交和处理",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F039；来源/阶段/隐私/缺失处置：有异议的 L4/L8；T1 有权受理/回复档案 M019；P3",
      "displayHint": "原稿字段编号 F039。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f040",
      "label": "ref+effectiveAt；D 正式录取名单",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F040；来源/阶段/隐私/缺失处置：L5 起；T1 学院正式录取签发单 M020；P2",
      "displayHint": "原稿字段编号 F040。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f041",
      "label": "ref+time；D 教务处备案记录",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F041；来源/阶段/隐私/缺失处置：L5 起；T0/T1 教务处备案回执/档案 M021；P2",
      "displayHint": "原稿字段编号 F041。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f042",
      "label": "ref+time；A 学生书面退出意思表示",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F042；来源/阶段/隐私/缺失处置：L6，主动退修时；T2 学生署名退修申请 M022；P2",
      "displayHint": "原稿字段编号 F042。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f043",
      "label": "ref+effectiveAt；D 退出/终止审批与备案",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F043；来源/阶段/隐私/缺失处置：L6 退出/终止时；T1 C02/C03党政联席会、C04教务科及教务处 M023；P2",
      "displayHint": "原稿字段编号 F043。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f044",
      "label": "structured refs；X S01/S02/G50权威决定及结业/学位类别",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "原稿字段 F044；来源/阶段/隐私/缺失处置：L2/L6/L7/L8；T0/T1 外部正式决定号、签发者、版本 M024—M026/M028；P2/P3",
      "displayHint": "原稿字段编号 F044。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f045",
      "label": "structured+datetime；A 录取前撤回请求、受理及再提交关联",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F045；来源/阶段/隐私/缺失处置：C09 的 L1/L2；不得用于 C14 L6；T2 学生撤回申请 + T1 学院收件/是否准许的通知 M029；P2",
      "displayHint": "原稿字段编号 F045。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f046",
      "label": "structured+ref；A 复核/申诉对象、原决定版、诉求、进度",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F046；来源/阶段/隐私/缺失处置：C15 L2/L4/L8；T2 本人复核请求 + T1 有权受理/回复 M030，公示异议另有 M019；P3",
      "displayHint": "原稿字段编号 F046。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f047",
      "label": "ref+scope+time；D 校方授权签发人及原始权限证据",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "原稿字段 F047；来源/阶段/隐私/缺失处置：L2/L3/L4/L5/L6/L7/L8 每个正式动作；T0 有权校方身份认证/授权角色表 + T1 原始签发 M015/M019—M025/M030；P3",
      "displayHint": "原稿字段编号 F047。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "当期项目确实开放、范围/名额/截止/审核方式；开办学院/教务处官方网页、盖章通知、附件",
      "purpose": "当期项目确实开放、范围/名额/截止/审核方式；开办学院/教务处官方网页、盖章通知、附件；当前，L0 已有；所有情形应先有有效批次依据，C01/C06 现行专项未取得；校方档案原件或可核网页历史快照；按批次+版次归属，不接受学生自改截屏；F011—F019/F034；[SRC-001—005/009/012]；失联 SOURCE_UNAVAILABLE，无法确定版本 POLICY_UNCONFIRMED，不判学生缺件",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "当期项目确实开放、范围/名额/截止/审核方式；开办学院/教务处官方网页、盖章通知、附件；当前，L0 已有；所有情形应先有有效批次依据，C01/C06 现行专项未取得；校方档案原件或可核网页历史快照；按批次+版次归属，不接受学生自改截屏；F011—F019/F034；[SRC-001—005/009/012]；失联 SOURCE_UNAVAILABLE，无法确定版本 POLICY_UNCONFIRMED，不判学生缺件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "证明合法在籍、学段、状态；学籍主管部门主记录/正式证明",
      "purpose": "证明合法在籍、学段、状态；学籍主管部门主记录/正式证明；当前，L1/L2；L6 状态变动时再核；授权校方在线核验或正式学籍证明，按学号+核验时点；不强制重复上传；F002/F004/F005；[SRC-001]；无法读 UNREADABLE，无授权源 SOURCE_UNAVAILABLE，证据矛盾 CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明合法在籍、学段、状态；学籍主管部门主记录/正式证明；当前，L1/L2；L6 状态变动时再核；授权校方在线核验或正式学籍证明，按学号+核验时点；不强制重复上传；F002/F004/F005；[SRC-001]；无法读 UNREADABLE，无授权源 SOURCE_UNAVAILABLE，证据矛盾 CONFLICT"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "证明当前年级、主修专业/大类、主修学院及校区；学籍/教务机关记录",
      "purpose": "证明当前年级、主修专业/大类、主修学院及校区；学籍/教务机关记录；当前 L1/L2；C01—C06，C08 变更后重核；授权学籍查询/校方证明，按学生、学期和专业版本；可与 M002 同份物理证明多目的引用不重复上传；F003/F006—F009/F026；[SRC-001—005]；来源缺则权威核验待办，专业大类不明确需人工释义",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明当前年级、主修专业/大类、主修学院及校区；学籍/教务机关记录；当前 L1/L2；C01—C06，C08 变更后重核；授权学籍查询/校方证明，按学生、学期和专业版本；可与 M002 同份物理证明多目的引用不重复上传；F003/F006—F009/F026；[SRC-001—005]；来源缺则权威核验待办，专业大类不明确需人工释义"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m004",
      "name": "证明学生申请/项目选择/签名；本人申报表原件，纸质或签署 PDF",
      "purpose": "证明学生申请/项目选择/签名；本人申报表原件，纸质或签署 PDF；当前 C02—C05；C01 需本人申报意思但现行正式表格格式待核；C06 非普通在校自行报名；正式规定的电子签/校方在线申报记录仅在校方认可时替代纸件；表、电子件和纸件必须同人同批同版；F003/F011/F012/F027/F028/F031；[SRC-002—005]；已明确要求缺表 NEEDS_MATERIAL，不能验签 NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明学生申请/项目选择/签名；本人申报表原件，纸质或签署 PDF；当前 C02—C05；C01 需本人申报意思但现行正式表格格式待核；C06 非普通在校自行报名；正式规定的电子签/校方在线申报记录仅在校方认可时替代纸件；表、电子件和纸件必须同人同批同版；F003/F011/F012/F027/F028/F031；[SRC-002—005]；已明确要求缺表 NEEDS_MATERIAL，不能验签 NEEDS_HUMAN_DECISION"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "证明 GPA 及学业成绩；主修学院教务科/校教务处签章成绩单或可信官方成绩接口",
      "purpose": "证明 GPA 及学业成绩；主修学院教务科/校教务处签章成绩单或可信官方成绩接口；当前 C02—C05；C01 现行具体成绩材料要求未找到，资格事实可按学校记录核；各招简认可的校方盖章打印成绩证明/校方签发数字成绩记录；按成绩期次+出具日+学生号归属；F007/F020/F021/F031；[SRC-002—005]；缺已明确证明时 NEEDS_MATERIAL，仅 OCR 模糊 UNREADABLE，成绩冲突 CONFLICT",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明 GPA 及学业成绩；主修学院教务科/校教务处签章成绩单或可信官方成绩接口；当前 C02—C05；C01 现行具体成绩材料要求未找到，资格事实可按学校记录核；各招简认可的校方盖章打印成绩证明/校方签发数字成绩记录；按成绩期次+出具日+学生号归属；F007/F020/F021/F031；[SRC-002—005]；缺已明确证明时 NEEDS_MATERIAL，仅 OCR 模糊 UNREADABLE，成绩冲突 CONFLICT"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "证明学习经历、能力与报名动机；本人简历/简历表",
      "purpose": "证明学习经历、能力与报名动机；本人简历/简历表；当前 C02/C03/C05；不强制 C04，C01 未查到；招简附件格式或开办学院正式认可等效格式；同一简历版本随申请存档，涉及个人经历不得擅自联网核实；F027/F031/F036；[SRC-002/003/005]；限确有要求的项目缺失 NEEDS_MATERIAL；内容评优由学院人工",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明学习经历、能力与报名动机；本人简历/简历表；当前 C02/C03/C05；不强制 C04，C01 未查到；招简附件格式或开办学院正式认可等效格式；同一简历版本随申请存档，涉及个人经历不得擅自联网核实；F027/F031/F036；[SRC-002/003/005]；限确有要求的项目缺失 NEEDS_MATERIAL；内容评优由学院人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "项目收件汇总、表格或线上报名关联；本人/收件学院汇总电子档或平台提交记录",
      "purpose": "项目收件汇总、表格或线上报名关联；本人/收件学院汇总电子档或平台提交记录；当前 C02—C05 的通知指定形式；通常电子件，C04 以通知在线汇总执行，C01 未核；学校官方在线汇总表受理回执等价性由开办学院确认；关联批次/院系/目标项目；F011/F012/F014/F029/F031；[SRC-002—005]；缺指定电子表 NEEDS_MATERIAL，不能以纸质成绩单取代",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "项目收件汇总、表格或线上报名关联；本人/收件学院汇总电子档或平台提交记录；当前 C02—C05 的通知指定形式；通常电子件，C04 以通知在线汇总执行，C01 未核；学校官方在线汇总表受理回执等价性由开办学院确认；关联批次/院系/目标项目；F011/F012/F014/F029/F031；[SRC-002—005]；缺指定电子表 NEEDS_MATERIAL，不能以纸质成绩单取代"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "证明处分是否存在及效力；有权校方部门处分记录/授权核验摘要",
      "purpose": "证明处分是否存在及效力；有权校方部门处分记录/授权核验摘要；条件 C02—C05 L2；招简有禁止，核验义务存在，但并非均规定学生必须单独上传“无处分证明”；最小必要校方签发“满足/不满足该项”证明，含有效时点；敏感信息不得转发无权第三方；F023；[SRC-002—005]；学校无法查 SOURCE_UNAVAILABLE；自报“无处分”不可当 T1",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明处分是否存在及效力；有权校方部门处分记录/授权核验摘要；条件 C02—C05 L2；招简有禁止，核验义务存在，但并非均规定学生必须单独上传“无处分证明”；最小必要校方签发“满足/不满足该项”证明，含有效时点；敏感信息不得转发无权第三方；F023；[SRC-002—005]；学校无法查 SOURCE_UNAVAILABLE；自报“无处分”不可当 T1"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "证明是否有其他在读微专业；教务/项目管理方注册记录",
      "purpose": "证明是否有其他在读微专业；教务/项目管理方注册记录；条件 C04 L2/L6，其他项目仅其当期政策另明示时；校方在读项目查询/正式结论；同学生+检查时点+项目状态；F024；[SRC-004/009]；无权威记录 SOURCE_UNAVAILABLE，不可单凭申请人声明认无",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明是否有其他在读微专业；教务/项目管理方注册记录；条件 C04 L2/L6，其他项目仅其当期政策另明示时；校方在读项目查询/正式结论；同学生+检查时点+项目状态；F024；[SRC-004/009]；无权威记录 SOURCE_UNAVAILABLE，不可单凭申请人声明认无"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "证明核心主修课是否重修；教务成绩/修读记录",
      "purpose": "证明核心主修课是否重修；教务成绩/修读记录；条件 C02 L2；仅智慧电网明示；校方课程重修记录/学院官方证明；必须对齐其公告的“核心专业课”范围；F022；[SRC-002]；核心课目录或结果未知 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明核心主修课是否重修；教务成绩/修读记录；条件 C02 L2；仅智慧电网明示；校方课程重修记录/学院官方证明；必须对齐其公告的“核心专业课”范围；F022；[SRC-002]；核心课目录或结果未知 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "辅修在读数量、主辅专业大类；教务/学籍辅修注册档案及专业目录",
      "purpose": "辅修在读数量、主辅专业大类；教务/学籍辅修注册档案及专业目录；条件 C01 L2；不把已申请未录取计为已修读；授权辅修记录及专业大类正式目录；按每个注册专业和有效期；F025/F026；[SRC-001/012]；未能查登记 SOURCE_UNAVAILABLE；不同学院不等于不同大类",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "辅修在读数量、主辅专业大类；教务/学籍辅修注册档案及专业目录；条件 C01 L2；不把已申请未录取计为已修读；授权辅修记录及专业大类正式目录；按每个注册专业和有效期；F025/F026；[SRC-001/012]；未能查登记 SOURCE_UNAVAILABLE；不同学院不等于不同大类"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "双学士复合项目合法招生来源；招生部门/省级审批机关原始项目批准和学生录取记录",
      "purpose": "双学士复合项目合法招生来源；招生部门/省级审批机关原始项目批准和学生录取记录；条件 C06 L0/L2；先核现行项目，绝非要求普通学生自己向省级机关要批件；校方官网项目审批/招生文件+合法录取确认；属学校持有源，不由学生上传虚构许可；F011—F014/F018；[SRC-012]；CDUT 对应授权未证 POLICY_UNCONFIRMED，不受理成普通辅修",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "双学士复合项目合法招生来源；招生部门/省级审批机关原始项目批准和学生录取记录；条件 C06 L0/L2；先核现行项目，绝非要求普通学生自己向省级机关要批件；校方官网项目审批/招生文件+合法录取确认；属学校持有源，不由学生上传虚构许可；F011—F014/F018；[SRC-012]；CDUT 对应授权未证 POLICY_UNCONFIRMED，不受理成普通辅修"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "证明电子材料确于指定渠道送达；受理邮箱/校方平台回执、收件日志",
      "purpose": "证明电子材料确于指定渠道送达；受理邮箱/校方平台回执、收件日志；条件 C02—C05 L1/L2，项目指定电子提交时；尤其 C05 先到；邮箱已送达日志+学院收件确认或权威平台回执；仅申请人“已发送”截图非终局；F001/F014/F029；[SRC-002—005]；无法核时间 NEEDS_HUMAN_DECISION，校方日志失联 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明电子材料确于指定渠道送达；受理邮箱/校方平台回执、收件日志；条件 C02—C05 L1/L2，项目指定电子提交时；尤其 C05 先到；邮箱已送达日志+学院收件确认或权威平台回执；仅申请人“已发送”截图非终局；F001/F014/F029；[SRC-002—005]；无法核时间 NEEDS_HUMAN_DECISION，校方日志失联 SOURCE_UNAVAILABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "证明纸件按所要求日期到达；学院教务科纸件签收/交件记录",
      "purpose": "证明纸件按所要求日期到达；学院教务科纸件签收/交件记录；条件 C02—C05 在各项目纸件实际到期后；C05 不早于秋季第一周；学院签收簿/纸件收讫证明，纸电同人同批同版；F001/F030；[SRC-002—005]；未到纸件期限 NOT_APPLICABLE，逾期需学院人工裁定，不自动拒绝",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明纸件按所要求日期到达；学院教务科纸件签收/交件记录；条件 C02—C05 在各项目纸件实际到期后；C05 不早于秋季第一周；学院签收簿/纸件收讫证明，纸电同人同批同版；F001/F030；[SRC-002—005]；未到纸件期限 NOT_APPLICABLE，逾期需学院人工裁定，不自动拒绝"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "资格初审是否完成及有权人员意见；开办学院审核台账/审核签字",
      "purpose": "资格初审是否完成及有权人员意见；开办学院审核台账/审核签字；后续 L2 处理完毕，C02—C05 或合法 C01 方案触发；学院可信电子审核日志或签章审批单；按审核人身份、对象、成绩版本归属；F032；[SRC-002—005]；L1 不索取，缺审核记录不能自行转资格已通过",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "资格初审是否完成及有权人员意见；开办学院审核台账/审核签字；后续 L2 处理完毕，C02—C05 或合法 C01 方案触发；学院可信电子审核日志或签章审批单；按审核人身份、对象、成绩版本归属；F032；[SRC-002—005]；L1 不索取，缺审核记录不能自行转资格已通过"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "防灾减灾超额专家面试实际评分；学院专家评委评分/签到原件",
      "purpose": "防灾减灾超额专家面试实际评分；学院专家评委评分/签到原件；条件且后续 C04+C11 真正超额后 L3；有权专家组签署成绩或学院批准评分台账；原始个人评分保密限权使用；F035；[SRC-004]；未触发为 NOT_APPLICABLE，缺得分不自动填零",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "防灾减灾超额专家面试实际评分；学院专家评委评分/签到原件；条件且后续 C04+C11 真正超额后 L3；有权专家组签署成绩或学院批准评分台账；原始个人评分保密限权使用；F035；[SRC-004]；未触发为 NOT_APPLICABLE，缺得分不自动填零"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "证实实际报名人数、择优规则和经学院确认的排名；招生开办学院统计/评审记录",
      "purpose": "证实实际报名人数、择优规则和经学院确认的排名；招生开办学院统计/评审记录；条件且后续 C11 及项目需要竞争性评审的 L3；学院正式汇总、评审会议记录/授权系统导出；必须绑定当批/有效报名口径；F017/F033/F034/F036；[SRC-002—005]；名单数量≠报名数量，超额未知先 NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证实实际报名人数、择优规则和经学院确认的排名；招生开办学院统计/评审记录；条件且后续 C11 及项目需要竞争性评审的 L3；学院正式汇总、评审会议记录/授权系统导出；必须绑定当批/有效报名口径；F017/F033/F034/F036；[SRC-002—005]；名单数量≠报名数量，超额未知先 NEEDS_HUMAN_DECISION"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "证明“拟录取”确已公示及期限、候选人条目；开办学院官网名单+公示页",
      "purpose": "证明“拟录取”确已公示及期限、候选人条目；开办学院官网名单+公示页；后续 C12 L4；绝不是 L1 申请附件；校方原页/带时间戳官方 PDF，候选匹配需完整身份源补核；按公示起止、修订版、撤下版归档；F037/F038；[SRC-002—005/017]；名单只露遮蔽学号则身份需人工确认，未公布不可称已录取",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明“拟录取”确已公示及期限、候选人条目；开办学院官网名单+公示页；后续 C12 L4；绝不是 L1 申请附件；校方原页/带时间戳官方 PDF，候选匹配需完整身份源补核；按公示起止、修订版、撤下版归档；F037/F038；[SRC-002—005/017]；名单只露遮蔽学号则身份需人工确认，未公布不可称已录取"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "证明公示异议受理和处理；招生/申诉有权部门诉求与答复",
      "purpose": "证明公示异议受理和处理；招生/申诉有权部门诉求与答复；条件且后续 C12/C15 存在异议 L4/L8；正式受理号、送达记录、处理回复；关联原公示版、个人申请版；F039；[SRC-001—005]；无异议不得要求“零异议证明”，有异议无处理待 NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明公示异议受理和处理；招生/申诉有权部门诉求与答复；条件且后续 C12/C15 存在异议 L4/L8；正式受理号、送达记录、处理回复；关联原公示版、个人申请版；F039；[SRC-001—005]；无异议不得要求“零异议证明”，有异议无处理待 NEEDS_HUMAN_DECISION"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "证明最终招生录取事实；开办学院正式签发名单",
      "purpose": "证明最终招生录取事实；开办学院正式签发名单；后续 C13 L5；学院正式名单/校方授权系统录取记录；按同批次/签发日/正式或撤销版归属；F040；[SRC-002—005]；拟录取 M018 不能替代；来源失联 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明最终招生录取事实；开办学院正式签发名单；后续 C13 L5；学院正式名单/校方授权系统录取记录；按同批次/签发日/正式或撤销版归属；F040；[SRC-002—005]；拟录取 M018 不能替代；来源失联 SOURCE_UNAVAILABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "证明教务处收到正式录取备案；教务处备案回执/登记记录",
      "purpose": "证明教务处收到正式录取备案；教务处备案回执/登记记录；后续 C13 L5；教务处档案查询/备案回执，按 M020 录取决定号绑定；F041；[SRC-002—005/007]；学院自称“已上报”不等于“已备案”",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明教务处收到正式录取备案；教务处备案回执/登记记录；后续 C13 L5；教务处档案查询/备案回执，按 M020 录取决定号绑定；F041；[SRC-002—005/007]；学院自称“已上报”不等于“已备案”"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "证明本人书面退修意愿；已录取学生退出申请原件",
      "purpose": "证明本人书面退修意愿；已录取学生退出申请原件；条件且后续 C14 L6；仅实际提出退修；学校认可的签名书面申请/授权电子申请；不得由辅导员截屏代签；F042；[SRC-002—004]；未请求退出 NOT_APPLICABLE，无本人签名 NEEDS_HUMAN_DECISION",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明本人书面退修意愿；已录取学生退出申请原件；条件且后续 C14 L6；仅实际提出退修；学校认可的签名书面申请/授权电子申请；不得由辅导员截屏代签；F042；[SRC-002—004]；未请求退出 NOT_APPLICABLE，无本人签名 NEEDS_HUMAN_DECISION"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m023",
      "name": "证明退修/终止经有权审批并备案；开办学院+教务处决定及记录",
      "purpose": "证明退修/终止经有权审批并备案；开办学院+教务处决定及记录；条件且后续 C14 L6；C02/C03 党政联席会决定、C04 教务科批准，均需相应备案；C05 原文未核具体批准级别；F043；[SRC-002—004]；错误部门签发 CONFLICT，缺批准不改变正式录取",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明退修/终止经有权审批并备案；开办学院+教务处决定及记录；条件且后续 C14 L6；C02/C03 党政联席会决定、C04 教务科批准，均需相应备案；C05 原文未核具体批准级别；F043；[SRC-002—004]；错误部门签发 CONFLICT，缺批准不改变正式录取"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m024",
      "name": "证明休复学、退学、专业/年级变化已正式生效；S01 有权学籍部门决定",
      "purpose": "证明休复学、退学、专业/年级变化已正式生效；S01 有权学籍部门决定；条件且后续 C08 L6；按对应 S01-T01/T02/T03/T04/T06/T08 有效决定与时点复用；同一人版本链；F005—F009/F044；[SRC-001/016]；自报状态不生效，接口失联 SOURCE_UNAVAILABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明休复学、退学、专业/年级变化已正式生效；S01 有权学籍部门决定；条件且后续 C08 L6；按对应 S01-T01/T02/T03/T04/T06/T08 有效决定与时点复用；同一人版本链；F005—F009/F044；[SRC-001/016]；自报状态不生效，接口失联 SOURCE_UNAVAILABLE"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m025",
      "name": "证明结业/学位最终决定及正确证书类别；教务处/学位委员会文书",
      "purpose": "证明结业/学位最终决定及正确证书类别；教务处/学位委员会文书；后续 C10 L7；永不作为 L1 报名材料；学校统一结业证和审核记录或校学位委员会授位决定；学院“建议授位”不可替代校级决定；F044；[SRC-001/002/006/013/014]；决定缺则不宣称结业/授位；学信网口径冲突 POLICY_UNCONFIRMED",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明结业/学位最终决定及正确证书类别；教务处/学位委员会文书；后续 C10 L7；永不作为 L1 报名材料；学校统一结业证和审核记录或校学位委员会授位决定；学院“建议授位”不可替代校级决定；F044；[SRC-001/002/006/013/014]；决定缺则不宣称结业/授位；学信网口径冲突 POLICY_UNCONFIRMED"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m026",
      "name": "证明正式成绩复核/更正已生效；成绩管理有权方结果决定",
      "purpose": "证明正式成绩复核/更正已生效；成绩管理有权方结果决定；条件 C08/C16 发生后，S02-T06 等结论已形成时；权威成绩主记录新版本/正式复核处理结果，关联原 GPA 截点；不由本模板写分；F020/F021/F044；[SRC-001/016]；只收到学生主张不重写成绩，需外部有权结论",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明正式成绩复核/更正已生效；成绩管理有权方结果决定；条件 C08/C16 发生后，S02-T06 等结论已形成时；权威成绩主记录新版本/正式复核处理结果，关联原 GPA 截点；不由本模板写分；F020/F021/F044；[SRC-001/016]；只收到学生主张不重写成绩，需外部有权结论"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m027",
      "name": "证明他人代交的授权范围与有效期；本人+校方认证方授权书或校本委托机制",
      "purpose": "证明他人代交的授权范围与有效期；本人+校方认证方授权书或校本委托机制；条件 实际代理申请/递交时；无代理即 NOT_APPLICABLE；经学校确认的授权记录/可信电子授权；仅赋予代交，不赋予学院审批；F002/F010/F028；[SRC-001/015]；无法核代理则人工处理，前端 role=teacher 无权",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明他人代交的授权范围与有效期；本人+校方认证方授权书或校本委托机制；条件 实际代理申请/递交时；无代理即 NOT_APPLICABLE；经学校确认的授权记录/可信电子授权；仅赋予代交，不赋予学院审批；F002/F010/F028；[SRC-001/015]；无法核代理则人工处理，前端 role=teacher 无权"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m028",
      "name": "证明旧双学位适用年代或批次政策修订；教务处/历史档案或现行发布方红头/原表/修订函",
      "purpose": "证明旧双学位适用年代或批次政策修订；教务处/历史档案或现行发布方红头/原表/修订函；条件 C07 历史遗留，或任何项目公告冲突 L0/L8；有档案号的 2018 表/通知、或校方正式更正声明；必须比对生效期，不得用历史替代当期；F011/F014/F015/F044；[SRC-008/009/010/011]；无历史对应关系 POLICY_UNCONFIRMED",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "submission",
      "requiredElements": [
        "证明旧双学位适用年代或批次政策修订；教务处/历史档案或现行发布方红头/原表/修订函；条件 C07 历史遗留，或任何项目公告冲突 L0/L8；有档案号的 2018 表/通知、或校方正式更正声明；必须比对生效期，不得用历史替代当期；F011/F014/F015/F044；[SRC-008/009/010/011]；无历史对应关系 POLICY_UNCONFIRMED"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m029",
      "name": "证明录取前学生真实撤回意思、提交时点和学院受理状态；学生本人+原受理单位撤回申请/送达回执",
      "purpose": "证明录取前学生真实撤回意思、提交时点和学院受理状态；学生本人+原受理单位撤回申请/送达回执；条件 C09 L1/L2 撤回或撤回后重提；不能混用录取后 M022/M023；本人署名撤回函/校方核验的在线撤回记录；收件/是否允许重报须由原承办方证明；以 F001/F014 关联原版，不覆盖历史；F001/F028/F029/F045；[SRC-002—005]（仅证明对应招生窗口，未证专门撤回规则）；真实申请不等于已生效撤回，受理权限 POLICY_UNCONFIRMED",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "decision",
      "requiredElements": [
        "证明录取前学生真实撤回意思、提交时点和学院受理状态；学生本人+原受理单位撤回申请/送达回执；条件 C09 L1/L2 撤回或撤回后重提；不能混用录取后 M022/M023；本人署名撤回函/校方核验的在线撤回记录；收件/是否允许重报须由原承办方证明；以 F001/F014 关联原版，不覆盖历史；F001/F028/F029/F045；[SRC-002—005]（仅证明对应招生窗口，未证专门撤回规则）；真实申请不等于已生效撤回，受理权限 POLICY_UNCONFIRMED"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m030",
      "name": "证明申请人对初审、公示、录取或退修决定的正式复核/申诉请求及处理；本人+有权受理部门请求、登记、回复/最终决定",
      "purpose": "证明申请人对初审、公示、录取或退修决定的正式复核/申诉请求及处理；本人+有权受理部门请求、登记、回复/最终决定；条件 C15 L2/L4/L8，提出复核时当前需本人请求；处理记录须等受理后产生；本人签名/可信提交记录与学校受理号、原被复核决定关联；如仅公示异议可联用 M019，不要求第二次提交；F010/F039/F046/F047；[SRC-001/002—005]；没专门受理窗口或期限时 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION，不可默认逾期丧失权利",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 999,
      "requiredAt": "decision",
      "requiredElements": [
        "证明申请人对初审、公示、录取或退修决定的正式复核/申诉请求及处理；本人+有权受理部门请求、登记、回复/最终决定；条件 C15 L2/L4/L8，提出复核时当前需本人请求；处理记录须等受理后产生；本人签名/可信提交记录与学校受理号、原被复核决定关联；如仅公示异议可联用 M019，不要求第二次提交；F010/F039/F046/F047；[SRC-001/002—005]；没专门受理窗口或期限时 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION，不可默认逾期丧失权利"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "research-criteria",
      "name": "研究稿逐条事实核验规则",
      "description": "逐条来自本批 Markdown 的 R 编号。模板内标准不等于校方政策；政策未确认时仅作语义预审或人工复核。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "T=指定项目批次，F=纯非修读事务，U=名称无法路由",
          "requirement": "R001；C01—C07，L0/L1；T=指定项目批次，F=纯非修读事务，U=名称无法路由；[SRC-001—005/008/009/012]；F011—F016；M001/M028；真=校方有效期内官方通知/规章与项目、校区、批次完全相符(T1)；假=已核相反/过期公告；未知=缺本批现行规则或网页失联；POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE；教务处/开办学院核项目与版次；C01 2019办法可说明基础资格但不证明2026具体招生日。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "T=自称辅修/双学士/旧双学位，F=纯微专业申请，U=混用名称",
          "requirement": "R002；C01/C06/C07，L0/L2；T=自称辅修/双学士/旧双学位，F=纯微专业申请，U=混用名称；[SRC-001/008/012]；F011/F012/F014/F044；M001/M012/M028；真=事项真实法律类别与原届招生/项目文书一致；假=旧制在校申请冒称2026双学士；未知=缺项目批准或旧制档案；POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；教务处/招生部门确认路由，不造新模板。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "T=含学生身份或名单匹配，F=纯公开批次读取，U=仅有匿名线索",
          "requirement": "R003；全情形 L1—L8；T=含学生身份或名单匹配，F=纯公开批次读取，U=仅有匿名线索；[SRC-001/017]；F002/F003/F031；M002/M003/M004/M018；真=T0/T1 学号稳定标识、姓名与案卷属同一人；假=确证不同人；未知=遮蔽学号/同名/OCR 错读；CONFLICT/UNREADABLE/SOURCE_UNAVAILABLE；学籍/开办学院人工身份核对；不能以拟录取掩码唯一锁人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "T=有人代交/签批/撤回复核，F=无需身份权限的纯展示，U=Actor 来源不明",
          "requirement": "R004；C09/C14/C15 及正式操作 L1—L8；T=有人代交/签批/撤回复核，F=无需身份权限的纯展示，U=Actor 来源不明；[SRC-001/015]；F010/F028/F047；M027/M029/M030；真=Host/Main T0 认证操作者有该动作权限；代理仅在校认可范围内代交；假=越权、自填 role 或授权失效；未知=校方门禁未接；NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE；学校身份与授权管理员；Renderer Actor 不可信。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "T=校本学生修读资格，F=仅历史档案阅览，U=无学籍记录",
          "requirement": "R005；C01—C06，L1/L2/L6；T=校本学生修读资格，F=仅历史档案阅览，U=无学籍记录；[SRC-001—005]；F004/F005；M002/M024；真=对应有效时点符合指定全日制本科、在籍状态(T0/T1)；假=已生效退学/学段不符；未知=学籍变动待签；SOURCE_UNAVAILABLE/CONFLICT；学籍部门与招生学院；不对特殊学籍身份擅用一般条款。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "T=项目明示年级范围，F=没有年级要求的其它情形，U=公告含糊",
          "requirement": "R006；C01/C02/C04/C05，L2；T=项目明示年级范围，F=没有年级要求的其它情形，U=公告含糊；[SRC-001/002/004/005]；F006/F018；M001/M003；真=权威年级/年届与本批范围相合；假=明确超出；未知=留级/编入生年级口径未定；POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；教务学籍科/开办学院确认编入年级。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "T=有校区限制，F=无专属校区条件，U=转校区事实不明",
          "requirement": "R007；C02/C05，L2；T=有校区限制，F=无专属校区条件，U=转校区事实不明；[SRC-002/005]；F009/F018；M001/M003/M024；真=办学校区与本项目批次公告一致；假=权威校区不在范围；未知=异动尚未生效；CONFLICT/SOURCE_UNAVAILABLE；学籍科/学院核生效时点；C05 宜宾校区不应错排。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "T=当期公告明示招生专业/学科范围，F=非该项目，U=“相关”类别无定义",
          "requirement": "R008；C02—C05，L2；T=当期公告明示招生专业/学科范围，F=非该项目，U=“相关”类别无定义；[SRC-002—005/017]；F007/F008/F018；M001/M003；真=权威专业编码在正式项目范围；假=已核明确不在；未知=“相关理工”与拟录取口径有疑义；POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；开办学院书面释义，不据一条公示推例外自动有效。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "T=辅修修读，F=微专业，U=已有辅修登记不明",
          "requirement": "R009；C01，L2；T=辅修修读，F=微专业，U=已有辅修登记不明；[SRC-001] 第52条；F025；M011；真=有权注册档案证明不超过本制度一项辅修；假=有效登记超限；未知=历史申请与实有登记无法区分；SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；教务处辅修归口，不把未录取申报计入在读。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "T=辅修跨专业大类资格，F=微专业，U=专业目录映射不明",
          "requirement": "R010；C01，L2；T=辅修跨专业大类资格，F=微专业，U=专业目录映射不明；[SRC-001/012]；F008/F026；M003/M011；真=主辅专业按有权专业目录归于不同大类；假=同一大类；未知=目录变更/双名称；POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；教务处对专业大类确认，不把不同学院等同跨类。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "T=现代双学士复合项目，F=在校普通辅修，U=无法确认制度类别",
          "requirement": "R011；C06，L0/L2；T=现代双学士复合项目，F=在校普通辅修，U=无法确认制度类别；[SRC-012] 第15条；F011—F015/F044；M001/M012；真=合法项目批准、通过相应高考招生的有权录取记录均可核；假=明确无项目或录取不符；未知=CDUT 批件/名录未得；POLICY_UNCONFIRMED 优先；招生办/教务处及有权项目管理方；本 ID 只消费决定。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "T=历史旧制遗留，F=2026新申请，U=入学届不明",
          "requirement": "R012；C07，L1/L8；T=历史旧制遗留，F=2026新申请，U=入学届不明；[SRC-008/001/012]；F006/F011/F014/F015；M002/M028；真=旧申请、有效历史文件、入学及批次一致；假=用旧文审核新生；未知=过渡条款/废止效力不明；POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；档案与教务部门判旧制效力。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "T=项目招简援引2023全校微专业办法，F=非微专业，U=该文件未得",
          "requirement": "R013；C02—C05 L2；T=项目招简援引2023全校微专业办法，F=非微专业，U=该文件未得；[SRC-002—005/009]；F015/F018/F024；M001/M028；真=取得真实现行上位校本办法并确认适用；假=正式文件证实已替代且本通知口径冲突；未知=只有文件号无正文；当前通常 POLICY_UNCONFIRMED；教务处补原文；绝不由四个招简推一个全校统一 GPA/多报门槛。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "T=要求主修成绩单，F=未要求的纯历史/后续情形，U=来源不明",
          "requirement": "R014；C02—C05 L1/L2；T=要求主修成绩单，F=未要求的纯历史/后续情形，U=来源不明；[SRC-002—005]；F020/F021/F031；M005/M026；真=校方成绩源/合格盖章件属于本人本期，绩点可定位计算时点；假=已核伪归属或过期误用；未知=页模糊/印章不明；UNREADABLE/CONFLICT/SOURCE_UNAVAILABLE；主修学院教务科/校教务处核成绩签发。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "T=该批确定 GPA 条款，F=无GPA资格要求分支，U=缺有效算法/版次",
          "requirement": "R015；C02—C05 L2；T=该批确定 GPA 条款，F=无GPA资格要求分支，U=缺有效算法/版次；[SRC-002—005]；F014/F019—F021；M001/M005；真=同周期权威 GPA 与本项目门槛一致；假=低于明确数值；未知=成绩换版/计算范围不明。C02“原则≥3.0”即使偏低也只输出待学院裁量；CONFLICT/POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；开办学院确认是否采纳例外，不自动拒绝。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "T=智慧电网核心课重修条件，F=其它项目，U=核心课程口径不明",
          "requirement": "R016；C02 L2；T=智慧电网核心课重修条件，F=其它项目，U=核心课程口径不明；[SRC-002]；F022；M001/M010；真=权威记录明确不违反公告核心课重修限制；假=记录显示违反；未知=核心课清单或重修状态无证明；POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE；主修学院/电网项目学院核对。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "T=该批有处分资格要求，F=无此限制情形，U=处分时效口径不明",
          "requirement": "R017；C02—C05 L2；T=该批有处分资格要求，F=无此限制情形，U=处分时效口径不明；[SRC-002—005]；F023；M001/M008；真=授权学校记录表明在规定时点满足要求；假=权威记录表明有效处分违限；未知=处分解除/查询授权不足；SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；有权学生管理部门/开办学院；个人“无处分”不作真。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "T=防灾不得同时在读其它微专业，F=其余项目且无当期类似条款，U=2023统一规定未知",
          "requirement": "R018；C04 L2；T=防灾不得同时在读其它微专业，F=其余项目且无当期类似条款，U=2023统一规定未知；[SRC-004/009]；F024；M001/M009；真=校方注册记录显示无其它在读项目；假=确有在读；未知=申请记录与正式在读不清；SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；教务/开办学院；不可从 C04 外推禁止多项目同时申请。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "T=当期确需本人签表/申报，F=C06已有招生决定的核验，U=C01现行表单未得",
          "requirement": "R019；C01—C05 L1；T=当期确需本人签表/申报，F=C06已有招生决定的核验，U=C01现行表单未得；[SRC-001—005]；F027/F028/F031；M004/M027；真=申请表属本人/目标同批，签署有效且版本清晰；假=签名确非本人/目标错误；未知=附件格式、真实签章不可确认；NEEDS_MATERIAL/UNREADABLE/NEEDS_HUMAN_DECISION；本人补表、学院核验；C01不得以2018表替代。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "T=当期明示简历，F=C04或未规定者，U=附件模板不明",
          "requirement": "R020；C02/C03/C05 L1；T=当期明示简历，F=C04或未规定者，U=附件模板不明；[SRC-002/003/005]；F027/F031；M006；真=该人本批简历存在且属于申请版；假=上传他人简历/错误批次；未知=缺文件/扫描无法读；NEEDS_MATERIAL/UNREADABLE；学生补件，内容优劣由开办学院评议。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "T=当期明示汇总电子表或在线登记，F=C01或非相关项目，U=表单原格式未得",
          "requirement": "R021；C02—C05 L1；T=当期明示汇总电子表或在线登记，F=C01或非相关项目，U=表单原格式未得；[SRC-002—005]；F012/F014/F029；M007；真=电子汇总/在线登记对应本人与本批；假=目标项目/身份错；未知=无可核收件记录或表无法读；NEEDS_MATERIAL/UNREADABLE/SOURCE_UNAVAILABLE；学生/收件学院根据渠道补正。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "T=已到电子件提交要求，F=纯纸件办理，U=电子到达日无证据",
          "requirement": "R022；C02—C05 L1/L2；T=已到电子件提交要求，F=纯纸件办理，U=电子到达日无证据；[SRC-002—005]；F016/F029；M001/M013；真=可信学院邮件/平台送达时点落在有效窗口；假=有权记录确证超过截止；未知=学生只持发件截图或邮箱失联；SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；学院收件人裁决超时受理，机器不自动延长期限。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "T=当前已到项目纸件应交时点，F=C05秋季首周前或无需纸件，U=校历/开学日期未核",
          "requirement": "R023；C02—C05 L1/L2；T=当前已到项目纸件应交时点，F=C05秋季首周前或无需纸件，U=校历/开学日期未核；[SRC-002—005]；F016/F030；M001/M014；真=学院签收证明纸件按其独立期限提交；假=权威收件日确超时；未知=收件日志暂不可查；NOT_APPLICABLE（尚未到期）/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；开办学院核校历及补件规则。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "T=电子件与纸件都已真实到达，F=仅单介质且另份尚未到期，U=版本/归属不全",
          "requirement": "R024；C02—C05 L2；T=电子件与纸件都已真实到达，F=仅单介质且另份尚未到期，U=版本/归属不全；[SRC-002—005]；F002/F003/F014/F028—F031；M004/M005/M007/M013/M014；真=同人、同项目、同批、同关键页/表、同版本或合法修订链；假=两个权威版本确证不一致；未知=扫描无法比对；CONFLICT/UNREADABLE；收件学院和本人确认哪版实际生效，保留双版。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "T=学院已完成资格初审，F=仅 L1 尚未审理，U=审核结果失联",
          "requirement": "R025；C01—C05 L2/L3；T=学院已完成资格初审，F=仅 L1 尚未审理，U=审核结果失联；[SRC-002—005/007]；F032/F047；M015；真=有权院级初审意见且所据申请/成绩版相同；假=确有不通过意见；未知=无已产生原文或身份未经证；SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；开办学院原审核人；不得由本 R 自写初审通过。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "T=进入需要判断是否超额的选拔节点，F=L1且未完成收件，U=报名统计无权威",
          "requirement": "R026；C11 L3；T=进入需要判断是否超额的选拔节点，F=L1且未完成收件，U=报名统计无权威；[SRC-002—005]；F017/F033/F034；M001/M017；真=有效报名人数与招简计划上限可比，已确定超额与否；假=官方统计口径不一致/证明虚假；未知=统计未形成；SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；招生学院统计核定；拟录取人数不能当报名人数。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "T=超额需要成绩/简历择优，F=未超额，U=评分方案不明",
          "requirement": "R027；C02/C03/C05 + C11 L3；T=超额需要成绩/简历择优，F=未超额，U=评分方案不明；[SRC-002/003/005]；F034/F036；M006/M017；真=学院按当期正式方法产生可核择优结果；假=经核校方结果与批次/排名版本不符；未知=只知学生 GPA 未见学院排序；NOT_APPLICABLE/NEEDS_HUMAN_DECISION；开办学院评审人；不由 AI 以绩点排序代签。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "T=防灾确超额且面试已开展，F=未超额无需面试，U=专家评分尚未形成",
          "requirement": "R028；C04+C11 L3；T=防灾确超额且面试已开展，F=未超额无需面试，U=专家评分尚未形成；[SRC-004]；F033—F036/F047；M016/M017；真=专业专家有权原始评分与学院总评记录一致；假=排名/加权记录相矛盾；未知=无专家可核评分；NOT_APPLICABLE/NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE；防灾学院专家组；60/40 是该项目专用，模型不代评。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "T=学院拟录取已公示，F=申请初审阶段，U=有“录取”截图无发布源",
          "requirement": "R029；C12 L4；T=学院拟录取已公示，F=申请初审阶段，U=有“录取”截图无发布源；[SRC-002—005/017]；F002/F003/F037；M018；真=名单从校方发布且全身份与项目版本经授权核匹配；假=同名非本人/名单指向别批；未知=掩码学号不能唯一识别；CONFLICT/NEEDS_HUMAN_DECISION；学院核完整学号；拟录取≠正式录取。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "T=公告给出需核公示时间，F=L1/L2或尚无公示，U=公示起止未见",
          "requirement": "R030；C12 L4；T=公告给出需核公示时间，F=L1/L2或尚无公示，U=公示起止未见；[SRC-002/004/005/017]；F014/F038；M001/M018；真=公示持续天数及工作日口径与该批次一致；假=可核公示长度不足；未知=网页修改/校历争议；POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；发布学院确定修订公示效力；不将期限届满变录取。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "T=确有公示异议或被投诉，F=尚无公示/无人提出异议，U=处理状态不明",
          "requirement": "R031；C12/C15 L4/L8；T=确有公示异议或被投诉，F=尚无公示/无人提出异议，U=处理状态不明；[SRC-001—005/017]；F039/F047；M018/M019；真=受理/处理记录归属原公示版且由有权单位签发；假=回应来自无关单位/版本；未知=未回复/系统失联；NOT_APPLICABLE/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；公示学院/申诉主管；不要求“无异议证明”。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "T=学生已进入正式录取核验，F=仅拟录取期间，U=学院是否签发不明",
          "requirement": "R032；C13 L5；T=学生已进入正式录取核验，F=仅拟录取期间，U=学院是否签发不明；[SRC-002—005/017]；F037/F040/F047；M018/M020；真=同批且有权学院正式名单明确载入本人；假=确证未载或正式撤销记录；未知=只有拟录取 PDF；SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；开办学院发决定，系统仅核真；不凭公示自动签录。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "T=项目通知要求教务备案，F=早于正式名单，U=仅有“学院已上报”陈述",
          "requirement": "R033；C13 L5；T=项目通知要求教务备案，F=早于正式名单，U=仅有“学院已上报”陈述；[SRC-002—005/007]；F040/F041/F047；M020/M021；真=教务处可核备案记录关联正式录取号；假=有权记录确证备案错误对象；未知=备案未产生/源失联；SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；教务处备案持有人；学院正式录取与教务备案两个事实。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "T=申请人录取前要求撤回或撤回后重提，F=未提出且正常审理，U=代理意思不可信",
          "requirement": "R034；C09 L1/L2；T=申请人录取前要求撤回或撤回后重提，F=未提出且正常审理，U=代理意思不可信；[SRC-002—005]；F010/F028/F045；M004/M013/M029；真=本人真实撤回请求、原批次与受理回执同链；假=申请人/批次错配；未知=是否已经被学院准许、是否可重报无政策；POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；原承办学院决定受理/重提；不以撤回请求删旧案。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r035",
          "title": "T=已录取学生主动要求退修，F=仅报名撤回 C09，U=书面签名不真",
          "requirement": "R035；C14 L6；T=已录取学生主动要求退修，F=仅报名撤回 C09，U=书面签名不真；[SRC-002—004]；F040/F042；M020/M022；真=本人署名退修申请属于已录取同项目，且实际提出时点可核；假=他人/项目不符；未知=非校方核验签字；NEEDS_MATERIAL/UNREADABLE/NEEDS_HUMAN_DECISION；本人补件与项目学院核真，尚非退修完成。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r036",
          "title": "T=退修/终止正进入批准备案核验，F=未申请退修/尚未批准，U=批准层级不明",
          "requirement": "R036；C14 L6；T=退修/终止正进入批准备案核验，F=未申请退修/尚未批准，U=批准层级不明；[SRC-002—004]；F040—F043/F047；M020/M021/M022/M023；真=C02/C03 党政联席会、C04 教务科及教务备案均可核且同案；假=错误单位签发/不具效力；未知=C05具体路径未知；POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；对应项目学院+教务处；不从 L6 申请函自动撤销 L5 录取。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r037",
          "title": "T=外部 S01 已生效学籍/主修事件，F=没有变化，U=只有本人陈述",
          "requirement": "R037；C08 L6；T=外部 S01 已生效学籍/主修事件，F=没有变化，U=只有本人陈述；[SRC-001/016]；F005—F009/F044；M002/M003/M024；真=相应 S01 有权决定与生效日可核，项目资格只消费该事实；假=提出的异动已被驳回；未知=记录未同步；SOURCE_UNAVAILABLE/CONFLICT；学籍有权人核有效版本；不代签休复学/转专业/退学。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r038",
          "title": "T=发生正式成绩复核/更正，F=只有未受理的改分要求，U=生效结果未出",
          "requirement": "R038；C08/C16 L2/L6/L8；T=发生正式成绩复核/更正，F=只有未受理的改分要求，U=生效结果未出；[SRC-001/016]；F020/F021/F044；M005/M026；真=成绩主管/邻接 S02-T06 等有效决定版本更替；假=学生上传自改表但无有权结果；未知=正式处分/成绩记录未同步；SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；成绩业务有权人及开办学院确定原批次成绩是否追溯。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r039",
          "title": "T=进入后续结业或授位核查，F=L1初次报修读，U=证书类别/签发不明",
          "requirement": "R039；C10 L7；T=进入后续结业或授位核查，F=L1初次报修读，U=证书类别/签发不明；[SRC-001/002/006/010—014]；F011/F040/F044；M020/M025；真=微专业结业有学院初审+教务审核，或辅修授位有校学位评定委员会有效决议；假=仅建议授位/证书类型不符；未知=2025学位细则或学信网口径冲突；POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；教务处/校学位委员会，非招生资格审批。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r040",
          "title": "T=对已核事实/已有决定提出复核，F=未提复核，U=受理/原文权限不明",
          "requirement": "R040；C15 L2/L4/L8；T=对已核事实/已有决定提出复核，F=未提复核，U=受理/原文权限不明；[SRC-001/002—005]；F039/F046/F047；M019/M030及原被申诉 M；真=复核请求对应原版与有权受理记录，随后引用有权处理结论；假=诉求混到无关案/假决定；未知=校方受理期限及复核层级不明；POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；有权学校申诉机构，不自动认定逾期或改判。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r041",
          "title": "T=证据材料被替换/字段变化，F=没有变化，U=无原版 hash",
          "requirement": "R041；C09/C16 任意已审阶段；T=证据材料被替换/字段变化，F=没有变化，U=无原版 hash；[SRC-001—005/015]；F001/F014/F031/F044；M004/M005/M013/M014/M018/M026/M028；真=新旧版本/归属/受影响字段可追踪，仅失效依赖旧版的 R；假=替换跨了另案不能继承；未知=丢失原版无法差量；CONFLICT/NEEDS_HUMAN_DECISION；证据管理员与受影响 R 负责学院；新件不覆盖旧结论和有权决定。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r042",
          "title": "T=声称有权录取、签批、退出、复核、发证，F=纯材料读取，U=校方角色来源失联",
          "requirement": "R042；L2—L8；T=声称有权录取、签批、退出、复核、发证，F=纯材料读取，U=校方角色来源失联；[SRC-001—007/013/015]；F010/F032/F040/F041/F043/F047；M015/M019/M020/M021/M023/M025/M030；真=真实认证 Actor、有效职务/授权范围、原始签发与决定号可核；假=无权人/Renderer假教师；未知=权威权限表不可用；NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE；Host/Main 校方身份门禁+相应职能部门；只消费或引用，不生成审批人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r043",
          "title": "T=学生同时申请多个，F=仅单项目，U=2023全校共通政策未知",
          "requirement": "R043；C02—C05 多项目并投 L1/L2；T=学生同时申请多个，F=仅单项目，U=2023全校共通政策未知；[SRC-002—005/009]；F011/F012/F014/F024；M001/M009/M028；真=已证仅“申请”与“在读”状态的差异，不触发本项目禁令；假=某项目有明确当期限制且已存在在读记录；未知=是否允许多报的校级规定尚未取得；POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；教务处/开办学院确认同时报名；不从防灾“无其他在读”外推全校禁并投。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "l0",
      "name": "L0 项目及批次发布",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "l1",
      "workflowOwner": "local"
    },
    {
      "id": "l1",
      "name": "L1 学生自愿申请",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l2",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "l2",
      "name": "L2 身份／材料／资格事实核验",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "l3",
      "workflowOwner": "local"
    },
    {
      "id": "l3",
      "name": "L3 竞争选拔／学院初复审",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "l4",
      "workflowOwner": "local"
    },
    {
      "id": "l4",
      "name": "L4 拟录取公示及异议",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "l5",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "l5",
      "name": "L5 正式录取与备案",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "l6",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "l6",
      "name": "L6 注册修读、退出、状态变更",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "l7",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "l7",
      "name": "L7 完成学业与结业／学位",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "l8",
      "workflowOwner": "local"
    },
    {
      "id": "l8",
      "name": "L8 复核、申诉或纠错",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "human-decision-handoff",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "human-decision-handoff",
      "name": "人工决定待办交接（来自 §10 NEEDS_HUMAN_DECISION；不代表校方签批）",
      "kind": "handoff",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "pass-fact",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "not-applicable",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "needs-material",
      "kind": "supplement-list",
      "audience": "student"
    },
    {
      "id": "conflict",
      "kind": "item-feedback",
      "audience": "teacher"
    },
    {
      "id": "unreadable",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "source-unavailable",
      "kind": "item-feedback",
      "audience": "teacher"
    },
    {
      "id": "policy-unconfirmed",
      "kind": "item-feedback",
      "audience": "teacher"
    },
    {
      "id": "needs-human-decision",
      "kind": "item-feedback",
      "audience": "teacher"
    },
    {
      "id": "fact-review-summary",
      "kind": "item-feedback",
      "audience": "reviewer"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T03:17:00+08:00"
}

/** Research-source provenance is separate from case SourceRef and PolicyVersion. */
export const r02Metadata = {
  "templateId": "S02-T09",
  "name": "辅修、双学位、微专业修读资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S02-T09.md",
  "sourceDocumentSha256": "c1574041c1fb618642ec99be9480bb988223be534d876e149d2d8bfaaf6108bb",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/S02-T09.md",
  "sourceOriginalSha256": "c1574041c1fb618642ec99be9480bb988223be534d876e149d2d8bfaaf6108bb",
  "sourceOriginalGitBlobSha": "d3e031ebf0d7c4299de72b2fd3176445efe51254",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23",
  "implementationAsOf": "2026-10-24",
  "researchStatus": "RESEARCH_HANDOFF_READY_POLICY_OPEN",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceSummary": "国家辅修/双学士规则与《学位法》可核；校本微专业办法和2025年学位授予细则正文未取得，具体门槛必须按项目与批次隔离。",
  "relatedTemplateIds": [
    "S01-T01",
    "S01-T04",
    "S02-T02",
    "S02-T03",
    "S02-T04",
    "S02-T05",
    "S02-T06",
    "S02-T08",
    "S02-T10",
    "T01-T08"
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "| SRC-001 | CDUT-VERIFIED；成都理工大学，《成都理工大学全日制普通本科学生学籍管理办法》（成理校教〔2019〕18号）；[校方 PDF](https://dbxb.cdut.edu.cn/__local/7/B6/E5/006AC04D88A214D1AD8B1F5E540_16B4A5B7_C543C.pdf) | 2019-12-31 印发，2020-01-01 生效；第2、7、24、51、52、57—59、",
      "url": "https://dbxb.cdut.edu.cn/__local/7/B6/E5/006AC04D88A214D1AD8B1F5E540_16B4A5B7_C543C.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-002",
      "title": "| SRC-002 | CDUT-VERIFIED；成都理工大学核技术与自动化工程学院，《成都理工大学智慧电网微专业2026年春季招生简章》；[官网](https://cnae.cdut.edu.cn/info/1062/3853.htm) | 2026-03-05；第三节报名资格（3.0 GPA 等）、3/4—3/15 提交、学院择优、公示3工作日、教务备案；第五节退出，第六节结业。仅该微专业成都校区2026春批次；不是常年条款 | ",
      "url": "https://cnae.cdut.edu.cn/info/1062/3853.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-003",
      "title": "| SRC-003 | CDUT-VERIFIED；成都理工大学教务处、机电工程学院，《成都理工大学智能车联网工程微专业2026年春季招生简章》；[官网](https://mee.cdut.edu.cn/info/1049/3563.htm) | 落款 2026-03-30；第三节招生、成绩与简历、3/30—4/10 申请、资格与拟录取公示、备案；第五节退出、第六节结业。仅该项目2026春 | 官网索引正文核对；直开受限。不能把第六节未",
      "url": "https://mee.cdut.edu.cn/info/1049/3563.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-004",
      "title": "| SRC-004 | CDUT-VERIFIED；成都理工大学环境与土木工程学院，《成都理工大学“智慧防灾减灾”微专业招生简章》；[官网](https://cece.cdut.edu.cn/info/1116/10236.htm) | 2026-07-01；第四节二年级以上、GPA≥2.0、无其他在读微专业；第五节7/1—7/30材料，专业教师审查、超额面试（60/40）、拟录取公示5工作日、报教务处备案。仅该项目2026秋批次 | ",
      "url": "https://cece.cdut.edu.cn/info/1116/10236.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-005",
      "title": "| SRC-005 | CDUT-VERIFIED；成都理工大学计算机与网络安全学院，《地学智能软件开发与应用微专业招生简章》；[官网](https://cist.cdut.edu.cn/info/1136/7767.htm) | 2026-06-17；第三节二/三年级、校区、GPA≥2.0，电子件8/25前、纸件秋季开学第一周、拟录取公示5工作日及教务备案。仅该项目2026秋 | 官网索引正文核对；直开返回 412。时间口径已核索引文",
      "url": "https://cist.cdut.edu.cn/info/1136/7767.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-006",
      "title": "| SRC-006 | CDUT-VERIFIED；成都理工大学商学院，《商学院2026年本科毕业生建议授予学士学位名单公示（第一批次）》；[官网](https://cc.cdut.edu.cn/info/1066/4540.htm) | 2026-06-09；正文第五项建议授予辅修学士学位32人，学院学位评定分委员会投票，6/9—6/11 公示。适用于授位后阶段，不构成修读招生通知 | 官网索引正文核对；直开受限。是“建议授予”非校级",
      "url": "https://cc.cdut.edu.cn/info/1066/4540.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-007",
      "title": "| SRC-007 | CDUT-VERIFIED；成都理工大学教务处，《科室设置》；[官网](https://aao.cdut.edu.cn/jgsz/kssz.htm) | 未发现明确页面发布日期、生效／废止日；职责条目含“负责辅修学士学位的组织实施工作和指导学生转专业工作”；教务处职责说明，非审批授权书 | 官网索引内容核对；直开受限。只证实部门职能，不能据此伪造签核层级 |",
      "url": "https://aao.cdut.edu.cn/jgsz/kssz.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-008",
      "title": "| SRC-008 | CURRENTITY-UNKNOWN；成都理工大学教务处／文法学院存档，《关于组织学生报名修读2018年双学位专业的通知》及附《成都理工大学双学位教育管理办法》（成理校教〔2018〕11号）；[校方存档](https://wfxy.cdut.edu.cn/info/1078/1151.htm) | 网页标2018-08-31、通知落款2018-05-25；附办法第8—11、17—20、22条，通知报名条件及流程；",
      "url": "https://wfxy.cdut.edu.cn/info/1078/1151.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-009",
      "title": "| SRC-009 | CURRENTITY-UNKNOWN；成都理工大学，《成都理工大学微专业建设与管理办法（试行）》（成理校教〔2023〕8号）；公开原文链接未定位，各招生简章反复引用：[例：SRC-002](https://cnae.cdut.edu.cn/info/1062/3853.htm) | 发文号指向2023，原文条号、正式发布日期、生效／废止及有无修订均未核；有各微专业招简的间接约束 | 未获原始全文。不能将某个学院的",
      "url": "https://cnae.cdut.edu.cn/info/1062/3853.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-010",
      "title": "| SRC-010 | CDUT-VERIFIED；成都理工大学党政办公室，《校长办公会纪要〔2025〕16号》；[校方 PDF](https://dbxb.cdut.edu.cn/__local/4/D3/B4/D990E9F4ED77354BA8E41329F13_46B56453_275D1.pdf) | 2025-07-09 召开、2025-07-11 通报；第7项审定《成都理工大学学士学位授予工作细则》相关事宜；仅证明发生审定",
      "url": "https://dbxb.cdut.edu.cn/__local/4/D3/B4/D990E9F4ED77354BA8E41329F13_46B56453_275D1.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-011",
      "title": "| SRC-011 | CURRENTITY-UNKNOWN；成都理工大学信息公开网，《关于印发〈成都理工大学学士学位授予工作细则〉的通知》；[公开页](https://dbxb.cdut.edu.cn/xxgkwz/info/1007/1066.htm) | 页面发布时间2023-01-18、标题显示成理校教〔2020〕3号；2024 商学院公示却引成理校教〔2020〕4号，且 SRC-010 指向2025年新审定；适用2026授位依",
      "url": "https://dbxb.cdut.edu.cn/xxgkwz/info/1007/1066.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-012",
      "title": "| SRC-012 | GENERAL-RESEARCH；国务院学位委员会，《学士学位授权与授予管理办法》（学位〔2019〕20号）；[教育部官网](https://www.moe.gov.cn/srcsite/A22/yjss_xwgl/moe_818/201907/t20190726_392378.html)；[教育部法制平台正文](https://qspfw.moe.gov.cn/html/edudoc/20190729/1612",
      "url": "https://www.moe.gov.cn/srcsite/A22/yjss_xwgl/moe_818/201907/t20190726_392378.html",
      "evidenceStatus": "GENERAL_RESEARCH"
    },
    {
      "id": "SRC-013",
      "title": "| SRC-013 | GENERAL-RESEARCH；全国人大常委会，《中华人民共和国学位法》；[教育部转载](https://www.moe.gov.cn/jyb_sjzl/sjzl_zcfg/zcfg_jyfl/202404/t20240426_1127804.html) | 2024-04-26 通过，2025-01-01 起施行，旧《学位条例》同时废止；第19条学士学位学业要求，第24条学位评定委员会组织审查决议，第29条学",
      "url": "https://www.moe.gov.cn/jyb_sjzl/sjzl_zcfg/zcfg_jyfl/202404/t20240426_1127804.html",
      "evidenceStatus": "GENERAL_RESEARCH"
    },
    {
      "id": "SRC-014",
      "title": "| SRC-014 | CDUT-VERIFIED；成都理工大学能源学院，《成都理工大学2025年“地热能开发”微专业招生简章》；[官网](https://energy.cdut.edu.cn/info/1284/5153.htm) | 2025年项目简章、结业部分声称微专业结业证书“经过教育部认证，学信网可查”；但 SRC-002/003 等 2026 简章明确微专业非学历、学信网无备注、无学位。仅用作校本资料内部冲突证据 | 官网索",
      "url": "https://energy.cdut.edu.cn/info/1284/5153.htm",
      "evidenceStatus": "GENERAL_RESEARCH"
    },
    {
      "id": "SRC-015",
      "title": "| SRC-017 | CDUT-VERIFIED；成都理工大学机电工程学院，《“智能车联网工程”微专业拟录取名单》；[校方一页 PDF](https://mee.cdut.edu.cn/__local/B/48/AC/665A0D37D8835FC56E6699E2DCF_86CA091A_2261A.pdf) | 可核名单共28条，栏目为序号、遮蔽学号、姓名、所属学院、专业；PDF 内未见确切签发/生效/废止日期，依 2026 同批",
      "url": "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json",
      "evidenceStatus": "GENERAL_RESEARCH"
    },
    {
      "id": "SRC-016",
      "title": "| SRC-017 | CDUT-VERIFIED；成都理工大学机电工程学院，《“智能车联网工程”微专业拟录取名单》；[校方一页 PDF](https://mee.cdut.edu.cn/__local/B/48/AC/665A0D37D8835FC56E6699E2DCF_86CA091A_2261A.pdf) | 可核名单共28条，栏目为序号、遮蔽学号、姓名、所属学院、专业；PDF 内未见确切签发/生效/废止日期，依 2026 同批",
      "url": "https://mee.cdut.edu.cn/__local/B/48/AC/665A0D37D8835FC56E6699E2DCF_86CA091A_2261A.pdf",
      "evidenceStatus": "GENERAL_RESEARCH"
    },
    {
      "id": "SRC-017",
      "title": "| SRC-017 | CDUT-VERIFIED；成都理工大学机电工程学院，《“智能车联网工程”微专业拟录取名单》；[校方一页 PDF](https://mee.cdut.edu.cn/__local/B/48/AC/665A0D37D8835FC56E6699E2DCF_86CA091A_2261A.pdf) | 可核名单共28条，栏目为序号、遮蔽学号、姓名、所属学院、专业；PDF 内未见确切签发/生效/废止日期，依 2026 同批",
      "url": "https://mee.cdut.edu.cn/__local/B/48/AC/665A0D37D8835FC56E6699E2DCF_86CA091A_2261A.pdf",
      "evidenceStatus": "CONTENT_VERIFIED"
    }
  ],
  "criteria": [
    {
      "sectionId": "research-criteria",
      "criterionId": "r001",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r002",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r003",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r004",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r005",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r006",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r007",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r008",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r009",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r010",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r011",
      "sourceIds": [
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r012",
      "sourceIds": [
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r013",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r014",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r015",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r016",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r017",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r018",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r019",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r020",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r021",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r022",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r023",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r024",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r025",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r026",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r027",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r028",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r029",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r030",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r031",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r032",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r033",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r034",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r035",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r036",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r037",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r038",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r039",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r040",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r041",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r042",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r043",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const
