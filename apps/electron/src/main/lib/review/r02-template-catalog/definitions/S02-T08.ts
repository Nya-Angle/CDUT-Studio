import type { TemplateVersion } from '@profer/shared'

/** R02 local research definition; it is not a school-issued or school-approved template. */
export const templateVersion: TemplateVersion = {
  "templateId": "S02-T08",
  "version": 1,
  "schemaVersion": 2,
  "name": "重修、补修资格及教学班调整审核",
  "description": "本地研究模板 · 非校方正式模板。本科2019年规章和2025—2026学年历史重修通知可核；2026年秋季规则及研究生规则现行性不完整。 仅用于事实预审、证据整理和人工待办；政策或权限未确认时不得自动批准或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；来源为当前集成分支研究原件 S02-T08.md。研究来源 SRC 仅是来源索引，不是案卷材料 SourceRef。",
  "objectType": "person",
  "displayName": {
    "template": "{{f003}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "UUID/案卷",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "原稿字段 F001；来源/阶段/隐私/缺失处置：P1–P7；服务端案卷事件 ID；仅技术定位 SRC-013；P1",
      "displayHint": "原稿字段编号 F001。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f002",
      "label": "ID/申请人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F002；来源/阶段/隐私/缺失处置：P0–P7；校方认证后端 student/graduate ID 与会话校验日志；SRC-001 §2；P3",
      "displayHint": "原稿字段编号 F002。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f003",
      "label": "结构体/申请人姓名、学号别名一致性",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F003；来源/阶段/隐私/缺失处置：P0/P2；身份服务当前别名表、学籍档案记录行；SRC-001 §2；P3",
      "displayHint": "原稿字段编号 F003。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f004",
      "label": "可选 ID/代理授权",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F004；来源/阶段/隐私/缺失处置：P1/P3；权威代理委托/受理规则和签发部门原件，现无统一校本依据；P3",
      "displayHint": "原稿字段编号 F004。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f005",
      "label": "枚举/本科、结业、硕士博士、留学生等",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F005；来源/阶段/隐私/缺失处置：P0/P2；学籍管理/研究生培养/国际部门身份记录；SRC-001 §2、009、011；P2",
      "displayHint": "原稿字段编号 F005。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f006",
      "label": "枚举/学籍状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F006；来源/阶段/隐私/缺失处置：P0/P2/P4；学籍系统状态与生效时间；SRC-001 §49、011；P2",
      "displayHint": "原稿字段编号 F006。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f007",
      "label": "日期区间/结业后规定年限",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F007；来源/阶段/隐私/缺失处置：C 的 P2；学籍档案、入学及结业日期、核准期限；SRC-001 §49；P2",
      "displayHint": "原稿字段编号 F007。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f008",
      "label": "结构体/所属学院专业培养点",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F008；来源/阶段/隐私/缺失处置：P0/P2；校方学籍/培养档案中的学院、专业、校区、管理机构；SRC-001、011；P2",
      "displayHint": "原稿字段编号 F008。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f009",
      "label": "ID/培养方案",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F009；来源/阶段/隐私/缺失处置：E/H/I 的 P2；学校生效培养方案版本、研究生培养计划存档；SRC-001 §18–19、010；P2",
      "displayHint": "原稿字段编号 F009。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f010",
      "label": "枚举/申请事项 A–J",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "原稿字段 F010；来源/阶段/隐私/缺失处置：P1；申请人明确选择＋服务端路由核对；派单 R02（非校规）；P1",
      "displayHint": "原稿字段编号 F010。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f011",
      "label": "学年学期/申请",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F011；来源/阶段/隐私/缺失处置：P1–P7；学校教学日历和正式班次学期号；SRC-002、003、005、016；P1",
      "displayHint": "原稿字段编号 F011。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f012",
      "label": "规则引用＋有效窗口/批次",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F012；来源/阶段/隐私/缺失处置：P0/P2/P4；当期教务处完整通知编号与原文位置；SRC-014 正文未核，002/003/005/016 仅历史；P0",
      "displayHint": "原稿字段编号 F012。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f013",
      "label": "带时区时间戳/申请版本",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "原稿字段 F013；来源/阶段/隐私/缺失处置：P1；服务端受理时间、校方提交回执；旧批次对照 SRC-002；P1",
      "displayHint": "原稿字段编号 F013。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f014",
      "label": "文本/学生申报事实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F014；来源/阶段/隐私/缺失处置：P1/P3；学生本人陈述或合法代理声明及修订记录；特殊申请参考 SRC-004 §16（时效未知）；P2",
      "displayHint": "原稿字段编号 F014。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f015",
      "label": "字符串/既修或欠修课程",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F015；来源/阶段/隐私/缺失处置：P1/P2；正式课程目录、成绩记录课程代码；SRC-001 §25–30；P1",
      "displayHint": "原稿字段编号 F015。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f016",
      "label": "枚举/课程类别、性质",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F016；来源/阶段/隐私/缺失处置：P2；培养方案、课程记录；SRC-001 §18–19、009、010；P1",
      "displayHint": "原稿字段编号 F016。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f017",
      "label": "精确十进制/原课与要求学分",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F017；来源/阶段/隐私/缺失处置：P2；正式课程/培养方案版本；SRC-001 §10–12、010；P1",
      "displayHint": "原稿字段编号 F017。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f018",
      "label": "结构体/原课成绩及有效版本",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F018；来源/阶段/隐私/缺失处置：A/B/C 的 P2，E 条件；正式成绩系统单课程行、记分标签；SRC-001 §25–30；P2",
      "displayHint": "原稿字段编号 F018。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f019",
      "label": "状态/补考、缓考、有无资格",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F019；来源/阶段/隐私/缺失处置：A 的 P2/P4；考务及成绩系统正式补考/缓考结论；SRC-001 §28、SRC-002；P2",
      "displayHint": "原稿字段编号 F019。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f020",
      "label": "可选决定引用/成绩复核",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F020；来源/阶段/隐私/缺失处置：P2/P7 条件；S02-T06 已生效结果及成绩系统生效版本；SRC-001 §25–30；P2",
      "displayHint": "原稿字段编号 F020。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f021",
      "label": "课程缺口清单/补修义务",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F021；来源/阶段/隐私/缺失处置：E/H 的 P2；生效培养方案、学籍变更决定和有权培养机构核定；SRC-001 §18–19、010；P2",
      "displayHint": "原稿字段编号 F021。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f022",
      "label": "决定引用/学籍或方案变更",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F022；来源/阶段/隐私/缺失处置：E/H/I 的 P2；S01-T02/T04/T07、S02-T04/T05 的生效结论+范围；SRC-001 §18–19；P2",
      "displayHint": "原稿字段编号 F022。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f023",
      "label": "枚举/原课在目标学期开设与否",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F023；来源/阶段/隐私/缺失处置：D 的 P2，A/B 条件；当期课程目录/开课单位确认；SRC-002、003；P1",
      "displayHint": "原稿字段编号 F023。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f024",
      "label": "字符串/拟替代课程",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F024；来源/阶段/隐私/缺失处置：D 的 P1/P2；申请人拟议代码及官方课程目录比对；SRC-002、003；P1",
      "displayHint": "原稿字段编号 F024。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f025",
      "label": "多方批准引用/停开重修替代",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F025；来源/阶段/隐私/缺失处置：D 的 P3；开课学院及课程负责人签批原件、适用范围；SRC-002、003；P2",
      "displayHint": "原稿字段编号 F025。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f026",
      "label": "关系版本/课程替代配置",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F026；来源/阶段/隐私/缺失处置：D 的 P4/P6；学院教务人员确认配置后的教务系统生效关系；SRC-003；P2",
      "displayHint": "原稿字段编号 F026。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f027",
      "label": "字符串/本次拟修课程",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F027；来源/阶段/隐私/缺失处置：P1/P2；当期正式课程目录+申请意愿；SRC-002、005、016；P1",
      "displayHint": "原稿字段编号 F027。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f028",
      "label": "字符串/教学班",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F028；来源/阶段/隐私/缺失处置：F/G 的 P1，其余 P4；当期排课/选课系统目标教学班 ID；SRC-005、016；P1",
      "displayHint": "原稿字段编号 F028。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f029",
      "label": "关系表/理论、实验等组件",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F029；来源/阶段/隐私/缺失处置：F/G 的 P2/P4，其他视开设要求；当期开课组件映射及学生实际选班记录；SRC-016 第（3）项为历史示例；P1",
      "displayHint": "原稿字段编号 F029。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f030",
      "label": "结构体/容量、停开/合班、限制",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F030；来源/阶段/隐私/缺失处置：P2/P4/P5；当期教务排课、开课学院公告、教务系统记录；SRC-005、016；P1",
      "displayHint": "原稿字段编号 F030。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f031",
      "label": "课程时段列表/个人课表",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F031；来源/阶段/隐私/缺失处置：F/G 的 P2/P5，其余 P5；当期官方个人选课结果与课表版本；SRC-003、005、016；P2",
      "displayHint": "原稿字段编号 F031。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f032",
      "label": "三态＋事件/考务冲突",
      "kind": "boolean",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F032；来源/阶段/隐私/缺失处置：P5 条件；教务/学院正式考试安排与个人考务记录；SRC-006、007；P2",
      "displayHint": "原稿字段编号 F032。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f033",
      "label": "状态/报名或选课",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F033；来源/阶段/隐私/缺失处置：A–D 的 P4；教务系统目标课程报名/选课原始事件；SRC-001 §28、002/003；P2",
      "displayHint": "原稿字段编号 F033。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f034",
      "label": "订单 ID＋到账状态/财务",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F034；来源/阶段/隐私/缺失处置：A–D 的 P4（实际触发缴费后）；财务系统交易、退款状态与对应教务订单；SRC-002、003；P2",
      "displayHint": "原稿字段编号 F034。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f035",
      "label": "枚举/课程最终有效选课",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F035；来源/阶段/隐私/缺失处置：P5/P6；官方个人选课名单、学期班次关系；SRC-004 §7、SRC-005、016；P2",
      "displayHint": "原稿字段编号 F035。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f036",
      "label": "事件/从原班到目标班迁移",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F036；来源/阶段/隐私/缺失处置：F/G 的 P4–P6；教务系统原班/新班两端状态＋操作记录；SRC-004、005、016；P2",
      "displayHint": "原稿字段编号 F036。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f037",
      "label": "课程结束的官方新考核记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F037；来源/阶段/隐私/缺失处置：P7 且课程考核后；学校成绩系统有效成绩行；SRC-001 §25–30、SRC-006；P2",
      "displayHint": "原稿字段编号 F037。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f038",
      "label": "学分归属/培养方案认定引用",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F038；来源/阶段/隐私/缺失处置：P7 且需要时；学校有权学分/毕业要求管理系统，S02-T04/T05 决定；SRC-001 §18–19、010；P2",
      "displayHint": "原稿字段编号 F038。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f039",
      "label": "类型＋时间＋理由/申请后置事件",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F039；来源/阶段/隐私/缺失处置：P1–P7 条件；本人经可信身份提交的撤回/纠错/复核事件；SRC-004 仅历史背景；P2",
      "displayHint": "原稿字段编号 F039。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f040",
      "label": "决定 ID＋机构/签批人/生效状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F040；来源/阶段/隐私/缺失处置：P3/P6/P7 条件；有权教务、培养或其他主管部门的真实签发记录；SRC-002、003、009；P2",
      "displayHint": "原稿字段编号 F040。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f041",
      "label": "版本元组/每一证据与政策",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "原稿字段 F041；来源/阶段/隐私/缺失处置：P2–P7；校方源版本/文件 hash/观察时间及不可变引用；技术 SRC-013；P1",
      "displayHint": "原稿字段编号 F041。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f042",
      "label": "关系/人-案-学期-课程-材料",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "原稿字段 F042；来源/阶段/隐私/缺失处置：P1–P7；服务端材料注册、原始文件与所属 source ID、替换链；技术 SRC-013；P2",
      "displayHint": "原稿字段编号 F042。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "校方身份平台的可信登录绑定 AUTH；不可得时校方有权身份/学籍部门核验 OFFICIAL，不是学生身份证照片",
      "purpose": "校方身份平台的可信登录绑定 AUTH；不可得时校方有权身份/学籍部门核验 OFFICIAL，不是学生身份证照片；A：P0；F002–F005、F041–F042；SRC-001、011；同一人多学号须可追溯映射；缺 S/H；不可读 U",
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
        "校方身份平台的可信登录绑定 AUTH；不可得时校方有权身份/学籍部门核验 OFFICIAL，不是学生身份证照片；A：P0；F002–F005、F041–F042；SRC-001、011；同一人多学号须可追溯映射；缺 S/H；不可读 U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "本人经认证的申请事件（课号、学期、情形、目标班如已知）及说明 CLAIM；有权代理需 M004，原始纸质签署可核时替代系统申报",
      "purpose": "本人经认证的申请事件（课号、学期、情形、目标班如已知）及说明 CLAIM；有权代理需 M004，原始纸质签署可核时替代系统申报；A：P1；F010–F015、F024、F027–F028；SRC-001、002、004；以申请版本和申报者身份签署；缺 N；不可读 U",
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
        "本人经认证的申请事件（课号、学期、情形、目标班如已知）及说明 CLAIM；有权代理需 M004，原始纸质签署可核时替代系统申报；A：P1；F010–F015、F024、F027–F028；SRC-001、002、004；以申请版本和申报者身份签署；缺 N；不可读 U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "学籍管理者 AUTH 或原部门盖章/核定记录 OFFICIAL；离校结业的结业档案同槽",
      "purpose": "学籍管理者 AUTH 或原部门盖章/核定记录 OFFICIAL；离校结业的结业档案同槽；A：P2；C 必查期限；F005–F009；SRC-001 §2、§49、SRC-011；读取申请目标学期的有效状态；缺 S/H，失联不得让截图代替；U",
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
        "学籍管理者 AUTH 或原部门盖章/核定记录 OFFICIAL；离校结业的结业档案同槽；A：P2；C 必查期限；F005–F009；SRC-001 §2、§49、SRC-011；读取申请目标学期的有效状态；缺 S/H，失联不得让截图代替；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "合法代理委托、本人确认或学校受理机构认可的授权记录 OFFICIAL；一般本人申报不需要",
      "purpose": "合法代理委托、本人确认或学校受理机构认可的授权记录 OFFICIAL；一般本人申报不需要；T：确有代理；F004、F002–F003；现行专项校规待核 P；委托授权含对象、期限、业务范围；缺 H/P；U",
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
        "合法代理委托、本人确认或学校受理机构认可的授权记录 OFFICIAL；一般本人申报不需要；T：确有代理；F004、F002–F003；现行专项校规待核 P；委托授权含对象、期限、业务范围；缺 H/P；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "培养方案归口部门生效方案版本及本人适用范围 AUTH/OFFICIAL",
      "purpose": "培养方案归口部门生效方案版本及本人适用范围 AUTH/OFFICIAL；T：E/H/I 和其他课程类别不明时 P2；F009、F016–F017、F021；SRC-001 §18–19、SRC-010；不同入学年级/专业方案不能混；缺 S/H；U",
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
        "培养方案归口部门生效方案版本及本人适用范围 AUTH/OFFICIAL；T：E/H/I 和其他课程类别不明时 P2；F009、F016–F017、F021；SRC-001 §18–19、SRC-010；不同入学年级/专业方案不能混；缺 S/H；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "成绩主管系统课程行 AUTH，或教务有权部门成绩证明 OFFICIAL；截图作提示不替代",
      "purpose": "成绩主管系统课程行 AUTH，或教务有权部门成绩证明 OFFICIAL；截图作提示不替代；T：A/B/C，以及 E 须比对既修状态时 P2；F015–F018、F020；SRC-001 §25–30；需成绩生效/复核版本；缺 S；未知不等于未通过；U",
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
        "成绩主管系统课程行 AUTH，或教务有权部门成绩证明 OFFICIAL；截图作提示不替代；T：A/B/C，以及 E 须比对既修状态时 P2；F015–F018、F020；SRC-001 §25–30；需成绩生效/复核版本；缺 S；未知不等于未通过；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "考务/成绩系统事件及结果 AUTH/OFFICIAL；如尚未发布应等待，不要求学生创造文件",
      "purpose": "考务/成绩系统事件及结果 AUTH/OFFICIAL；如尚未发布应等待，不要求学生创造文件；T：A 根据资格与考试进度 P2/P4；F019–F020；SRC-001 §28、SRC-002、SRC-006；有补考且尚未考试→L；已公布源失联→S；U",
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
        "考务/成绩系统事件及结果 AUTH/OFFICIAL；如尚未发布应等待，不要求学生创造文件；T：A 根据资格与考试进度 P2/P4；F019–F020；SRC-001 §28、SRC-002、SRC-006；有补考且尚未考试→L；已公布源失联→S；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "教务处当期原文、有效日期、附件和后续修订 OFFICIAL，可用经核原始页面代替纸件；非学生上传责任",
      "purpose": "教务处当期原文、有效日期、附件和后续修订 OFFICIAL，可用经核原始页面代替纸件；非学生上传责任；A：所有 P0/P2/P4；F011–F013；SRC-014（待核），002/003/005/016（仅历史）；必须匹配 2026–2027 秋而非旧期；现期缺 P；网页失联 S；U",
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
        "教务处当期原文、有效日期、附件和后续修订 OFFICIAL，可用经核原始页面代替纸件；非学生上传责任；A：所有 P0/P2/P4；F011–F013；SRC-014（待核），002/003/005/016（仅历史）；必须匹配 2026–2027 秋而非旧期；现期缺 P；网页失联 S；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "教务开课库或开课学院有权确认 AUTH/OFFICIAL；不得用相似课名证明同一课程",
      "purpose": "教务开课库或开课学院有权确认 AUTH/OFFICIAL；不得用相似课名证明同一课程；A：P2（申请可先按明确代码定位）；F015–F017、F023–F024、F027；SRC-002、003、005；课程代码、开课学期及目录版本一致；缺 S；U",
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
        "教务开课库或开课学院有权确认 AUTH/OFFICIAL；不得用相似课名证明同一课程；A：P2（申请可先按明确代码定位）；F015–F017、F023–F024、F027；SRC-002、003、005；课程代码、开课学期及目录版本一致；缺 S；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "教务排课、开课学院发布当期班次及限制 AUTH/OFFICIAL；截图仅线索",
      "purpose": "教务排课、开课学院发布当期班次及限制 AUTH/OFFICIAL；截图仅线索；T：F/G 的 P2，其余取得实际班次时 P4；F027–F030；SRC-005、016；同一教学班 ID，容量可能实时变；缺 S/H；U",
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
        "教务排课、开课学院发布当期班次及限制 AUTH/OFFICIAL；截图仅线索；T：F/G 的 P2，其余取得实际班次时 P4；F027–F030；SRC-005、016；同一教学班 ID，容量可能实时变；缺 S/H；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "教务系统本人当期选课记录 AUTH/OFFICIAL；无系统则教务签发结果",
      "purpose": "教务系统本人当期选课记录 AUTH/OFFICIAL；无系统则教务签发结果；T：F/G 的 P2，其他 P5；F028–F031、F035–F036；SRC-003、004、005、016；必须有 observedAt，停开合班后旧版失效；初始尚无课表→L；已选记录失联 S；U",
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
        "教务系统本人当期选课记录 AUTH/OFFICIAL；无系统则教务签发结果；T：F/G 的 P2，其他 P5；F028–F031、F035–F036；SRC-003、004、005、016；必须有 observedAt，停开合班后旧版失效；初始尚无课表→L；已选记录失联 S；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "正式课程结构、教学班对照表及对应本人选择 AUTH/OFFICIAL",
      "purpose": "正式课程结构、教学班对照表及对应本人选择 AUTH/OFFICIAL；T：有理论+实验课 F/G 的 P2/P4；F029–F030、F035；SRC-016（历史批次，现期需 M008）；两端组件同课同学期并且均按当期规则有效；缺 S/P；U",
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
        "正式课程结构、教学班对照表及对应本人选择 AUTH/OFFICIAL；T：有理论+实验课 F/G 的 P2/P4；F029–F030、F035；SRC-016（历史批次，现期需 M008）；两端组件同课同学期并且均按当期规则有效；缺 S/P；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "成绩主管部门或 S02-T06 原业务权威结果 AUTH/OFFICIAL；不能用未完申请替代",
      "purpose": "成绩主管部门或 S02-T06 原业务权威结果 AUTH/OFFICIAL；不能用未完申请替代；T：成绩争议真实存在时 P2/P7；F018–F020、F040；SRC-001、S02-T06 权威结论；未决待 H，生效后比对原课程和版本；缺 S/H；U",
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
        "成绩主管部门或 S02-T06 原业务权威结果 AUTH/OFFICIAL；不能用未完申请替代；T：成绩争议真实存在时 P2/P7；F018–F020、F040；SRC-001、S02-T06 权威结论；未决待 H，生效后比对原课程和版本；缺 S/H；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "主管部门由 S01-T02/T04/T07 等形成的正式记录 AUTH/OFFICIAL",
      "purpose": "主管部门由 S01-T02/T04/T07 等形成的正式记录 AUTH/OFFICIAL；T：E 或学籍变动 C/I 条件下 P2；F005–F009、F021–F022；SRC-001 §18–19、关联 S01 决定；有效时间不晚于本期，旧方案不能冒用；缺 S/H；U",
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
        "主管部门由 S01-T02/T04/T07 等形成的正式记录 AUTH/OFFICIAL；T：E 或学籍变动 C/I 条件下 P2；F005–F009、F021–F022；SRC-001 §18–19、关联 S01 决定；有效时间不晚于本期，旧方案不能冒用；缺 S/H；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "S02-T04/T05 等归口部门生效决定/培养单位核定要求 AUTH/OFFICIAL",
      "purpose": "S02-T04/T05 等归口部门生效决定/培养单位核定要求 AUTH/OFFICIAL；T：E/H 中课程缺口无法由原方案直证或有单独调整时 P2/P3；F009、F016–F017、F021–F022、F038；SRC-001 §18–19、SRC-010；不可因两门课学分一致推定认定；未作决定→H 非 P1 缺件；U",
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
        "S02-T04/T05 等归口部门生效决定/培养单位核定要求 AUTH/OFFICIAL；T：E/H 中课程缺口无法由原方案直证或有单独调整时 P2/P3；F009、F016–F017、F021–F022、F038；SRC-001 §18–19、SRC-010；不可因两门课学分一致推定认定；未作决定→H 非 P1 缺件；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "开课单位停课/停开通知及学生拟替代课申报；官方记录为 AUTH/OFFICIAL，拟议项 CLAIM",
      "purpose": "开课单位停课/停开通知及学生拟替代课申报；官方记录为 AUTH/OFFICIAL，拟议项 CLAIM；T：D 的 P1/P2；F023–F024、F027；SRC-002、003；原课与替代课需双代码，旧学期停开不等于本期；缺 S/N；U",
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
        "开课单位停课/停开通知及学生拟替代课申报；官方记录为 AUTH/OFFICIAL，拟议项 CLAIM；T：D 的 P1/P2；F023–F024、F027；SRC-002、003；原课与替代课需双代码，旧学期停开不等于本期；缺 S/N；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "开课学院和课程负责人真实签批记录 OFFICIAL，由有权校方审核并可回查",
      "purpose": "开课学院和课程负责人真实签批记录 OFFICIAL，由有权校方审核并可回查；L：D 触发后 P3；F024–F025、F040；SRC-002、003；两个有权签发主体与本期本课程绑定；申请首件没有此批准→L，不补件；审批阶段未出 H；U",
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
        "开课学院和课程负责人真实签批记录 OFFICIAL，由有权校方审核并可回查；L：D 触发后 P3；F024–F025、F040；SRC-002、003；两个有权签发主体与本期本课程绑定；申请首件没有此批准→L，不补件；审批阶段未出 H；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "学院教务员在教务系统建立并生效的课程关系 AUTH/OFFICIAL",
      "purpose": "学院教务员在教务系统建立并生效的课程关系 AUTH/OFFICIAL；L：D 批准后 P4/P6；F025–F027、F033、F040；SRC-003；关联 M017 的批准 ID/版本；未配置 L/H；不可读 U",
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
        "学院教务员在教务系统建立并生效的课程关系 AUTH/OFFICIAL；L：D 批准后 P4/P6；F025–F027、F033、F040；SRC-003；关联 M017 的批准 ID/版本；未配置 L/H；不可读 U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "本人申报的具体事由、目标班、情况说明 CLAIM；若校方有当期表单优先该正式表单",
      "purpose": "本人申报的具体事由、目标班、情况说明 CLAIM；若校方有当期表单优先该正式表单；T：G 的 P1/P3；F010–F014、F028、F039；SRC-004 §16（效力待核）、005、016；只有目标班意愿不足以取得例外资格；当期表单缺 P；申请说明缺 N；U",
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
        "本人申报的具体事由、目标班、情况说明 CLAIM；若校方有当期表单优先该正式表单；T：G 的 P1/P3；F010–F014、F028、F039；SRC-004 §16（效力待核）、005、016；只有目标班意愿不足以取得例外资格；当期表单缺 P；申请说明缺 N；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "当期有权教师/学院/教务机构签核与受理事件 OFFICIAL，角色次序待校方核",
      "purpose": "当期有权教师/学院/教务机构签核与受理事件 OFFICIAL，角色次序待校方核；L：G 进入 P3 后；F036、F040–F041；SRC-004（旧表）、SRC-005、016；需可验证 actor、机构、有效时间；P1 未出 L；到审批节点缺 H/P；U",
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
        "当期有权教师/学院/教务机构签核与受理事件 OFFICIAL，角色次序待校方核；L：G 进入 P3 后；F036、F040–F041；SRC-004（旧表）、SRC-005、016；需可验证 actor、机构、有效时间；P1 未出 L；到审批节点缺 H/P；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "原研究生培养部门保存的计划及批准/备案记录 AUTH/OFFICIAL",
      "purpose": "原研究生培养部门保存的计划及批准/备案记录 AUTH/OFFICIAL；T：H 的 P2/P3；批准可能为后续；F005、F009、F016、F021–F022、F040；SRC-009/010/017/018（后两者仅特定历史课程/时期）；先查计划版次及课程性质，未签批不得冒认；原表现行性 P；U",
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
        "原研究生培养部门保存的计划及批准/备案记录 AUTH/OFFICIAL；T：H 的 P2/P3；批准可能为后续；F005、F009、F016、F021–F022、F040；SRC-009/010/017/018（后两者仅特定历史课程/时期）；先查计划版次及课程性质，未签批不得冒认；原表现行性 P；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "相应学生管理机构/培养单位的正式计划与受理规则 AUTH/OFFICIAL",
      "purpose": "相应学生管理机构/培养单位的正式计划与受理规则 AUTH/OFFICIAL；T：I 的 P2；尚未成文的批准 L；F005–F009、F016、F021–F022；SRC-011，其他待查；非同一管理体系须单独核批；规则缺 P/H；U",
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
        "相应学生管理机构/培养单位的正式计划与受理规则 AUTH/OFFICIAL；T：I 的 P2；尚未成文的批准 L；F005–F009、F016、F021–F022；SRC-011，其他待查；非同一管理体系须单独核批；规则缺 P/H；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m023",
      "name": "有权教务报名系统订单和被选课号 AUTH/OFFICIAL，申请人操作截图仅提示",
      "purpose": "有权教务报名系统订单和被选课号 AUTH/OFFICIAL，申请人操作截图仅提示；L：A–D 完成 P4 操作后；F027–F028、F033、F041；SRC-001 §28、002、003；需同一人课程学期报名版本；未报 L；已声称报却源失联 S；U",
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
        "有权教务报名系统订单和被选课号 AUTH/OFFICIAL，申请人操作截图仅提示；L：A–D 完成 P4 操作后；F027–F028、F033、F041；SRC-001 §28、002、003；需同一人课程学期报名版本；未报 L；已声称报却源失联 S；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m024",
      "name": "财务部门正式订单及到账状态 AUTH/OFFICIAL，银行付款记录只供核差、非报名生效证明",
      "purpose": "财务部门正式订单及到账状态 AUTH/OFFICIAL，银行付款记录只供核差、非报名生效证明；L：须付款且 P4 发起交易后；F033–F034、F041；SRC-002、003；订单、申请人与课程及财务流水绑定；付款前 L；差异 C/H；U",
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
        "财务部门正式订单及到账状态 AUTH/OFFICIAL，银行付款记录只供核差、非报名生效证明；L：须付款且 P4 发起交易后；F033–F034、F041；SRC-002、003；订单、申请人与课程及财务流水绑定；付款前 L；差异 C/H；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m025",
      "name": "教务处最终选课生效名单或批次确认回执 AUTH/OFFICIAL",
      "purpose": "教务处最终选课生效名单或批次确认回执 AUTH/OFFICIAL；L：P4 成功并进入 P5/P6；F028–F031、F035–F036、F040；SRC-004、005、016；停开合班或变更后必须新版本；未形成 L；列表失联 S；U",
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
        "教务处最终选课生效名单或批次确认回执 AUTH/OFFICIAL；L：P4 成功并进入 P5/P6；F028–F031、F035–F036、F040；SRC-004、005、016；停开合班或变更后必须新版本；未形成 L；列表失联 S；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m026",
      "name": "考务部门及开课学院正式考试安排/缓考生效决定 AUTH/OFFICIAL",
      "purpose": "考务部门及开课学院正式考试安排/缓考生效决定 AUTH/OFFICIAL；L/T：P5 已排考或提出冲突后；F031–F032；SRC-006、007；缓考结论引用 S02-T01；同一人同课同考试场次；冲突只能提醒有权部门；未排 L，失联 S；U",
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
        "考务部门及开课学院正式考试安排/缓考生效决定 AUTH/OFFICIAL；L/T：P5 已排考或提出冲突后；F031–F032；SRC-006、007；缓考结论引用 S02-T01；同一人同课同考试场次；冲突只能提醒有权部门；未排 L，失联 S；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m027",
      "name": "本人有认证的后置申请 CLAIM；校方撤销/复核签发 OFFICIAL",
      "purpose": "本人有认证的后置申请 CLAIM；校方撤销/复核签发 OFFICIAL；T：P1–P7 申请确实发生后；回应 L；F039–F040、F041–F042；SRC-001、相关校本程序待核；撤回提交≠正式报名撤销；若申请未发生 L，已发生而无决定 H；U",
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
        "本人有认证的后置申请 CLAIM；校方撤销/复核签发 OFFICIAL；T：P1–P7 申请确实发生后；回应 L；F039–F040、F041–F042；SRC-001、相关校本程序待核；撤回提交≠正式报名撤销；若申请未发生 L，已发生而无决定 H；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m028",
      "name": "教务/研究生系统正式学期成绩、课程完成及学分处理，必要时引用 S02-T04/T05 决定 AUTH/OFFICIAL",
      "purpose": "教务/研究生系统正式学期成绩、课程完成及学分处理，必要时引用 S02-T04/T05 决定 AUTH/OFFICIAL；L：P7 考核/认定已生效后；F037–F038、F040；SRC-001 §25–30、SRC-010；不提前强索，不能由审核器改账；未发生 L、系统失联 S；U",
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
        "教务/研究生系统正式学期成绩、课程完成及学分处理，必要时引用 S02-T04/T05 决定 AUTH/OFFICIAL；L：P7 考核/认定已生效后；F037–F038、F040；SRC-001 §25–30、SRC-010；不提前强索，不能由审核器改账；未发生 L、系统失联 S；U"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m029",
      "name": "原案权威决定 ID、源机构及有效范围和撤销/替代关系 AUTH/OFFICIAL；G50 技术索引本身不构成政策材料",
      "purpose": "原案权威决定 ID、源机构及有效范围和撤销/替代关系 AUTH/OFFICIAL；G50 技术索引本身不构成政策材料；T：D/E/G/H/I/J 存在上游决定或复用时 P2/P7；F020、F022、F025–F026、F040–F042；SRC-013（仅技术）及原决定所属 SRC；核签发主体、同人同课同期限；旧案结果被替换则失效；缺 S/H；U",
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
        "原案权威决定 ID、源机构及有效范围和撤销/替代关系 AUTH/OFFICIAL；G50 技术索引本身不构成政策材料；T：D/E/G/H/I/J 存在上游决定或复用时 P2/P7；F020、F022、F025–F026、F040–F042；SRC-013（仅技术）及原决定所属 SRC；核签发主体、同人同课同期限；旧案结果被替换则失效；缺 S/H；U"
      ],
      "allowReuseAcrossSubjects": true
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
          "title": "核申请人是否与案卷主体一致",
          "requirement": "R001 P0–P7，全部；T 有真实申请；F 没有案卷→不适用；U 身份会话未知。核申请人是否与案卷主体一致；SRC-001 §2/§53；F001–F003、F042；M001/M003；服务端认证 subjectId ↔ 学籍部门账号、同名别名和材料登记，申请版本逐次核；学生截图仅 CLAIM；一致 PASS_FACT；两个不同主体 CONFLICT；认证源失联 SOURCE_UNAVAILABLE；身份责任岗位，严禁自动切换为其他人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "U 代理声明不清",
          "requirement": "R002 P1/P3，代理；T 代理提交；F 本人操作→NOT_APPLICABLE；U 代理声明不清；SRC-001 §2、SRC-004 §5（旧规不可作现行代理许可）；F002–F004、F039；M001/M002/M004；读代理授权范围、期限、本人确认与学校有效代理受理政策，纸质件可回访学校；授权可验证且范围适用 PASS_FACT（仅申报身份）；无校本授权细则或权限冲突 NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED；身份/受理部门。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "U 学段未知",
          "requirement": "R003 P0/P2，全部；T 已定位学段；F 非学校学生/此模板范围之外→路由而非拒绝；U 学段未知；SRC-001 §2/§7、SRC-011、SRC-019（研究生规章存在索引，非重修条款）；F005–F006、F008；M003/M022；以当期学籍状态、学段、学院及生效区间验证，可读正式档案优先；研究生具体资格不能由 SRC-019 索引推出；状态可核 PASS_FACT；身份失联 SOURCE_UNAVAILABLE；非普通本科转 H/I 分支，不套本科规则；学籍/研究生/国际主管。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "U 结业/期限未知",
          "requirement": "R004 P2，结业 C；T F006=结业；F 在籍其他情形→NOT_APPLICABLE；U 结业/期限未知；SRC-001 §8/§49；F006–F007、F011；M003/M006；校方结业日期、最长修业年限与目标修读期同源比较，不能用普通毕业生标签代替；在核准期间 PASS_FACT 仅期限事实；超过或处例外不明 NEEDS_HUMAN_DECISION；权限/期限源失联 SOURCE_UNAVAILABLE；学籍科，不决定换毕业证。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "U 政策原文未知",
          "requirement": "R005 P0/P2/P4，全部；T 指定目标学期；F 不存在申请学期→NEEDS_MATERIAL（需学生补定位）；U 政策原文未知；SRC-001 §12、SRC-002/003/005/014/016；F011–F013；M008；核学校本期公告标题、发布日期、附件、补充通知和适用群体；旧窗口只作版本对照；当期规则完整 PASS_FACT（仅政策定位）；2026 秋原件未取得 POLICY_UNCONFIRMED；由教务处/对应培养主管核定，绝不以 2026 春期限拒绝。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "U 修读类型不明",
          "requirement": "R006 P1，全部；T 有申报意愿；F 草稿尚未提交→NOT_APPLICABLE（正式受理检查）；U 修读类型不明；SRC-001 §28、SRC-004 §9/§16、SRC-006；F010、F014–F015、F027–F028、F042；M002/M009/M019；学生受信申请事件的修订版，按 A–J 分流；“补修”要检查适用培养计划，不拿词面做资格；明确课程/情形 PASS_FACT（仅意愿）；缺学生可提供资料 NEEDS_MATERIAL；涉及其他目的给路由待办；申请人/受理人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "U 课程代码不确定",
          "requirement": "R007 P2，全部；T 有原/拟课程；F J 仅处理旧案事件而无需新课→NOT_APPLICABLE；U 课程代码不确定；SRC-001 §10/§18、SRC-002/003；F015–F017、F027；M005/M006/M009；正式课程目录按“课程代码×学期×培养方案”而非课程中文名比对，原课学分与目标课独立存；代码一致/已定位 PASS_FACT；同名异码 CONFLICT；目录失联 SOURCE_UNAVAILABLE；开课学院教务人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "U 成绩性质未明",
          "requirement": "R008 P2，A/B/C；T 本科重修或结业重修；F 非此类→NOT_APPLICABLE；U 成绩性质未明；SRC-001 §25–§28/§30；F015、F018、F020；M006/M013；成绩系统当前有效修读行、成绩标签、考试类型和复核更正版本；截图仅线索；成绩事实 PASS_FACT（包括合格后自愿再次修读）；前后不一致 CONFLICT；待公布/失联 SOURCE_UNAVAILABLE；成绩主管，无预设及格阈值。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "U 补考资格/出分状态未知",
          "requirement": "R009 P2/P4，A；T 上次未通过/待补考；F B 已合格再修→NOT_APPLICABLE；U 补考资格/出分状态未知；SRC-001 §26–§28、SRC-002 第四部分；F018–F019；M006/M007；考务与成绩两源核“是否有补考资格、是否完成、成绩何时生效”；SRC-002 3 月 16 日顺序仅适用历史批次；已有结论 PASS_FACT（仅补考状态）；尚未举行 NOT_APPLICABLE 于结果节点并建等待事件；未出/冲突 SOURCE_UNAVAILABLE/CONFLICT；考务与成绩部门。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "U 尚未确认是否有生效记录",
          "requirement": "R010 P2/P7，成绩异议；T 已发起成绩复核或学校正式更正；F 无异议→NOT_APPLICABLE；U 尚未确认是否有生效记录；SRC-001 §25–§30、SRC-012（仅上位）；F018–F020、F040–F041；M006/M013/M029；S02-T06 结果必须具原决定 ID、同课程学期、已生效时间和替换旧成绩版本；生效一致 PASS_FACT；未决 NEEDS_HUMAN_DECISION，源失联 S；由成绩复核/成绩主管形成结论，本案不代改成绩。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "U 课程性质未知",
          "requirement": "R011 P2，E/H/I；T 按培养方案识别补修义务；F A/B 普通重修无方案变更→NOT_APPLICABLE；U 课程性质未知；SRC-001 §18–19、SRC-010（现行性未知）；F009、F016–F017、F021；M005/M015/M021/M022；比本人入学版本、已生效培养方案和有权部门核课程缺口；研究生补修学分单独属性；缺口可定位 PASS_FACT（不是授课/学分批准）；方案未生效 NEEDS_HUMAN_DECISION；研究生现行性不明 P；培养主管。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "U 决定状态未知",
          "requirement": "R012 P2/P3，E/H/I/复合；T 引用转专业、复学、降级或课程认定；F 无此变更→NOT_APPLICABLE；U 决定状态未知；SRC-001 §18–19、SRC-013（技术边界）；F005–F009、F021–F022、F040；M014/M015/M029；S01-T02/T04/T07、S02-T04/T05 仅按原授权目的匹配主体、专业、课程、决定生效/撤销和版本；上游生效 PASS_FACT（仅引用）；未决/范围不符 NEEDS_HUMAN_DECISION/CONFLICT；原案决定机构，不自行课程替代。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "U 无课程开设数据",
          "requirement": "R013 P2，D；T 原课停开或未列当期开课；F 正常开设→NOT_APPLICABLE 于替代分支；U 无课程开设数据；SRC-001 §28（二）、SRC-002/003；F015、F023；M009/M016；当期教学计划/开课单位原始停开记录，不以历年课程表空白推定停开；停开事实可核 PASS_FACT；旧期停开冒用 CONFLICT；校方源失联 SOURCE_UNAVAILABLE；开课学院。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "U 拟替代代码未知",
          "requirement": "R014 P1/P2，D；T 有拟替代课程；F 原课程开设不需替代→NOT_APPLICABLE；U 拟替代代码未知；SRC-002/003；F015、F023–F024、F027；M009/M016；拟议课程是申请人的 CLAIM，与官方课程目录核代码；不在本 R 断言学分等价；目标可定位 PASS_FACT；申请人未填 N；目标不存在或课程不符 H/C；学生与开课学院。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "U 触发前置未证实",
          "requirement": "R015 P3，D；T 已进入停开课程替代审批；F 非 D→NOT_APPLICABLE；U 触发前置未证实；SRC-002 第三部分、SRC-003；F024–F025、F040–F041；M016/M017/M029；开课学院＋课程负责人有权审批动作与本期原课/目标课版本匹配；必须向学校权威机构核验，不信图像签章；批准真实 PASS_FACT（只核签批存在）；审批尚未发生 NEEDS_HUMAN_DECISION，非 P1 缺件；开课学院/课程负责人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "U 批准状态未知",
          "requirement": "R016 P4/P6，D；T 已有符合 R015 的批准；F 尚未批准→NOT_APPLICABLE 于配置核查；U 批准状态未知；SRC-003 第四部分、SRC-002；F025–F027、F033、F041；M017/M018/M023；学院教务员录入的关系生效版本须绑定批准 ID、原课/新课、学期和申请人适用范围；配置生效 PASS_FACT；批准有而未配置 NEEDS_HUMAN_DECISION；关系反向/错期 CONFLICT；学院教务人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "U 目标不明确",
          "requirement": "R017 P2/P4，全部；T 有具体目标课；F J 仅撤回且不新选→NOT_APPLICABLE；U 目标不明确；SRC-001 §10–12、SRC-002/005/016；F011、F027；M002/M009；目标课课程代码、教学批次与学段许可范围独立匹配；正式开课库优先；课程匹配 PASS_FACT；学生未选课号 N；跨学段权限未证 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；开课学院。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "U 班次不可定位",
          "requirement": "R018 P2/P4，F/G 或已配班其他；T 有目标教学班；F 初申 A/B 尚未分班→NOT_APPLICABLE；U 班次不可定位；SRC-004（仅历史）、SRC-005/016；F028、F030–F031；M010/M011；教务系统同课不同班的班号、学期、当前开闭状态与学生资格；非同课班不可视为简单换班；班号对应 PASS_FACT；目标班不是同一课程 C/H；源失联 S；教务排课岗位。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "U 当前课程结构/政策不明",
          "requirement": "R019 P2/P4，带理论/实验课程；T 课程确含必须联选的组件；F 纯理论课→NOT_APPLICABLE；U 当前课程结构/政策不明；SRC-016 第（3）项（旧期），SRC-014；F012、F029、F035；M008/M012/M025；查当前规则与课程组件组 ID，理论、实验对应班的同源选课快照；只凭 2026 春旧通知不得判 2026 秋违规；当前规则与组匹配 PASS_FACT；一端缺失 CONFLICT（待学校确定影响）；当期要求未知 POLICY_UNCONFIRMED；开课学院/教务处。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "U 名额信息缺失",
          "requirement": "R020 P2/P4/P5，所有已定班；T 已选目标班；F 无班次或待分配→NOT_APPLICABLE；U 名额信息缺失；SRC-005/016（历史）、SRC-014（待核）；F028、F030、F035；M010/M025；当期停开/合班/容量/限制及 observedAt，不能以历史“满员”图作为本期事实；现状 PASS_FACT（不代表录取）；已停开需新班重审 H/C；名额源失联 S；是否可超额人工 H；开课/教务岗位。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "U 当前批次原文缺",
          "requirement": "R021 P0/P2/P4，窗口内 F/A–D；T 申请需按当期窗口办理；F P7 仅处理存量成绩→NOT_APPLICABLE；U 当前批次原文缺；SRC-001 §12、SRC-002/003/005/014/016；F011–F013、F033；M008/M023；服务端受理时间与同学期同修读类型正式通知时间比较；历史 2026 春/2025 秋日期只允许原批次；有当前生效窗口且在内 PASS_FACT；晚于时限也仅事实为“已越窗”，后续是否受理交 S02-T07/教务；本期正文无 P，不能硬拒。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "U 越窗性或制度不明",
          "requirement": "R022 P3，G；T 超窗且请求独立例外；F 正常窗口申请→NOT_APPLICABLE；U 越窗性或制度不明；SRC-001 §12、SRC-004 §16（旧规）、SRC-005/016；F012–F014、F028、F039–F040；M008/M019/M020/M029；先从 S02-T07 确定是否存在校本允许的例外和其生效决定，再查同人同班和真实签批；不让旧表推翻当期通知；仅核已生效例外可 PASS_FACT；未经批准 NEEDS_HUMAN_DECISION，制度不明 POLICY_UNCONFIRMED；S02-T07 有权岗位。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "U 课表信息不全",
          "requirement": "R023 P2/P5，F/G/已分班；T 目标班和本人当前课表均明确；F 尚未排课→NOT_APPLICABLE；U 课表信息不全；SRC-004 §15（旧规）、SRC-005/016；F028、F031、F035；M010/M011/M025；时段包含校区、周次、单双周、理论实验组件，官方最新课表和班次变更版本同源比较；无冲突 PASS_FACT（只核排课事实）；有冲突仍 NEEDS_HUMAN_DECISION 而非自动拒绝；源失联 S；教务/开课单位。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "U 考务记录不可得",
          "requirement": "R024 P5，需考核课程；T 已公布正式考试安排；F 未排考→NOT_APPLICABLE；U 考务记录不可得；SRC-001 §26（五）、SRC-006/007；F018–F019、F032、F037；M007/M026；官方课程考试场次 vs 同期本人安排；2019 本科办法第 26 条（五）明确补考、重修考试不得办理缓考，不能把普通缓考模板的许可泛化至本案；排考事实吻合 PASS_FACT；冲突 NEEDS_HUMAN_DECISION 交考务安排岗位；原考务/校规改变时复核，不在此自动批准缓考。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "U 研究生具体课程类型不明",
          "requirement": "R025 P2/P3，H；T 研究生课程重修或基础补修；F 普通本科→NOT_APPLICABLE；U 研究生具体课程类型不明；SRC-009/010/017/018/019（新规只见引用）；F005、F009、F016–F017、F021、F027、F040；M005/M021/M029；研究生正式本人培养计划、当前课程类别和培养单位批准的适用版本；2018 纸表与 2026 公共素养课索引不形成统一现行流程，先核成理校研〔2024〕29号适用条款；仅可核课程在计划及事实 PASS_FACT；关于重修次数、学分、费用、审批方式 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；研究生院/学院。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "U 管理归属未知",
          "requirement": "R026 P2/P3，I；T 非普通本科、留学生/合作/继续教育专项；F 普通本科→NOT_APPLICABLE；U 管理归属未知；SRC-001 §2、SRC-011；F005–F009、F016、F021–F022；M003/M005/M022/M029；按学生类别核正式培养管理归属及专项生效计划，不把“参照本科”解释为学校已设统一入口；管理体系可核 PASS_FACT；专项规则/权限缺 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；国际交流/合作及对应培养主管。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "U 无报名事件",
          "requirement": "R027 P4，A–D/H/I 实际发起报名后；T 已触发报名/选课行为；F 申请首件尚未报名→NOT_APPLICABLE；U 无报名事件；SRC-001 §28（一）、SRC-002/003、SRC-017/018（仅历史/索引）；F011、F027、F033；M008/M023；校方教务系统本期人×课×批次报名事件/状态；本科近年线上，研究生不能一律套同入口；有真实报名 PASS_FACT（尚不等于有效修读）；截图单方宣称与记录不符 C；源失联 S；教务/研究生培养部门。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "U 当前收费政策未知",
          "requirement": "R028 P4，历史通知指定应缴费的重修行为发生后；T 有该人本期同课程的应缴订单且付款行为已发生；F 不收费或尚未付款→NOT_APPLICABLE 于到账检查；U 当前收费政策未知；SRC-001 §28（一）、SRC-002/003；F011–F012、F033–F034；M008/M023/M024；财务到账＋订单与报名绑定，处理退款/冲正版本；申请人支付截图不是 AUTH。不推广收费至研究生/补修；到账可信 PASS_FACT（不是学校许可）；回执与财务不符 C；财务失联 S；是否收费及退费未知 P/H；财务处/教务。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "U 系统名册暂不可得",
          "requirement": "R029 P5/P6，最终选课已形成；T 教务系统声称已最终选课；F 初始申请/未选→NOT_APPLICABLE；U 系统名册暂不可得；SRC-001 §10、SRC-003/004/005/016；F028–F031、F033–F035；M011/M023/M024/M025；最终有权选课名单与课程/教学班、课程组件和当期规则绑定；有无付费必要性由当前政策决定；名单现有效 PASS_FACT（仅注册事实）；历史名单或已合班 CONFLICT，来源失联 S；开课学院/教务岗位。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "U 原/目标班版本缺",
          "requirement": "R030 P4–P6，F/G；T 教学班变更已经实际执行；F 仅提出请求还未变更→NOT_APPLICABLE；U 原/目标班版本缺；SRC-004/005/016（历史风险）；F028–F031、F035–F036；M010/M011/M020/M025；以本人当期原班→新班的官方变更事件及名册双边记录，匹配已签发的例外（若需）；可核 PASS_FACT；仅上传教师签条、未有教务生效事件则 NEEDS_HUMAN_DECISION；失联 S；教务排课/选课岗位。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "U 有权签发人不明",
          "requirement": "R031 P3/P6/P7，有学校审批业务；T 已有或须有行政批准、替代/例外/研究生计划决定；F 只需普通系统自主选课→NOT_APPLICABLE；U 有权签发人不明；SRC-002/003、SRC-004（当前不确定）、SRC-009/010/017；F025、F039–F040、F041；M017/M020/M021/M027/M029；服务端核签发 actor、在岗机构、审批权限、行为、适用案卷与时间；扫描签名仅线索；同一部门不能授权超出业务目的；有效签发引用 PASS_FACT（只说明可核决定存在）；未批准 NEEDS_HUMAN_DECISION；冒用角色 C；由原有权学校机构决定。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "U 请求身份/受理状态未知",
          "requirement": "R032 P1–P7，J 撤回/重新提交；T 学生提出撤回/更正；F 无请求→NOT_APPLICABLE；U 请求身份/受理状态未知；SRC-001 §10–12、SRC-004（仅历史）、SRC-002；F001–F002、F039–F042；M001/M002/M027；认准本人签署的撤回申请与校方已生效报名或付款分别比较；撤回案卷草稿与退费/退选是不同权利；仅可核撤回意愿 PASS_FACT；正式报名是否可撤销 NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED；校方原受理/财务部门。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "U 版本关系不明",
          "requirement": "R033 P2–P7，全部版本更新；T 新材料/可信记录/政策替换；F 无版本变化→NOT_APPLICABLE；U 版本关系不明；SRC-013（技术，不是校规）、SRC-001 §30；F001、F018–F020、F025–F026、F035、F041–F042；M006/M013/M017/M018/M025/M027；比 sourceVersion、materialVersion、政策生效区间和原 ruleId 输入依赖；旧观察标 superseded，针对受影响 R 重新核；变化链明确 PASS_FACT（仅重审轨迹）；不知旧版是否被撤销 H/C；技术业务 Owner 执行定向重新运行，禁止旧结论当前有效。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "U 引用生效性未知",
          "requirement": "R034 P2/P7，跨业务复用；T 存在 S01/S02/G50 其他案卷的权威决定；F 无上游依赖→NOT_APPLICABLE；U 引用生效性未知；SRC-001 §18–19、SRC-013（技术目录）；F020、F022、F025–F026、F040–F042；M013/M014/M015/M029；只读取原业务签发人、目的、主体/课程/学期与撤回/替代链；G50 共用证据不共享业务许可；可验证的引用 PASS_FACT；同名模板或作者草稿不成立 NEEDS_HUMAN_DECISION/CONFLICT；原业务 Owner。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r035",
          "title": "U 成绩记录缺",
          "requirement": "R035 P7，课程考核后；T 后续已有课程考核结果；F 尚未考核→NOT_APPLICABLE；U 成绩记录缺；SRC-001 §28（三）至（五）、§30，SRC-006；F018、F037、F041；M006/M028；官方课程期末成绩、原记录不改写；合格后修读用“再次修读”标签、降级重选未通过课程依 2019 第 28 条（五）另有正常记分；记分事实 PASS_FACT；标签与类型不符 C/H；学期未结束 L；成绩主管，不能由本案制造成绩。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r036",
          "title": "U 正式计划未知",
          "requirement": "R036 P7，补修/培养方案归属；T 课程完成后需要学分或培养要求归属；F 与本案无学分认定→NOT_APPLICABLE；U 正式计划未知；SRC-001 §18–19、SRC-010（现行未知）；F009、F016–F017、F021–F022、F038；M005/M015/M021/M028/M029；本人成绩+生效培养方案及 S02-T04/T05 认定决定共同核，研究生补修本科课不得由本科规则类推计分；已有效学校记账 PASS_FACT；尚未决定 NEEDS_HUMAN_DECISION；当前研究生学分政策缺 P；学分/培养主管。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r037",
          "title": "U 文件页无法读取",
          "requirement": "R037 P1–P7，有文件/扫描材料时；T 依赖 OCR/扫描件某字段；F 系统结构化数据充分且无需附件→NOT_APPLICABLE；U 文件页无法读取；SRC-013（技术仅操作证据）；F014–F015、F040–F042；M002/M004/M006/M017/M019/M020/M021/M022；必须存页码/区域/版本/文件 hash、读取得分，关键字段 OCR 不可读不改变真实源事实；文字清楚且真实性另核 PASS_FACT（仅可读）；不可读 UNREADABLE 指向具体页；学生或原文件签发人补清晰件。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r038",
          "title": "U 接口/授权/网络不可达",
          "requirement": "R038 P2–P7，所有校方权威记录；T 规则需要校方原始数据；F 当前纯意愿记录→NOT_APPLICABLE；U 接口/授权/网络不可达；SRC-001、SRC-002/003、SRC-008（科室线索）、SRC-013（技术）；F002、F005–F009、F018–F019、F023、F030、F033–F035、F041；M001/M003/M006/M007/M009/M010/M023/M024/M025；服务端权限/读源/记录生成状态分别判断：notCreated、unauthorized、notReachable、notFound、redacted，绝不默认为“学生缺材料”；校方授权读取完成 PASS_FACT；失联 SOURCE_UNAVAILABLE；尚未生成 NOT_APPLICABLE；来源部门提供校方签发替代。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r039",
          "title": "U 归属关系不完整",
          "requirement": "R039 P1–P7，多材料与复合案；T 本案附材料/复用决定；F 无证据仅草拟→NOT_APPLICABLE；U 归属关系不完整；SRC-013（技术边界）、SRC-001 §53/§57–58；F001–F003、F011、F015、F027、F040–F042；M001/M002/M003/M029；对 subject/term/originalCourse/targetCourse、文件版本和原决定 purpose+owner 做严格联结，P2/P3 隐私不外泄；旧文件覆盖时须保留来源但撤销当前效力；归属一致 PASS_FACT（仅证据绑定）；跨学生/跨期/错决定 CONFLICT；技术案卷 Owner 与原学校数据持有人共同核实。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r040",
          "title": "U 课程在主修/辅修方案中归属不明",
          "requirement": "R040 P2，C 及涉辅修的 A/E/I；T 已毕业或结业者申请返校修辅修学士学位课程；F 课程为主修且无辅修权利要求→NOT_APPLICABLE；U 课程在主修/辅修方案中归属不明；SRC-001 §49、§52（三）（2019 本科制度，后续效力待核）；F005–F007、F009、F016、F021；M003/M005/M009/M029；将权威学籍的主修毕业状态、毕业当时辅修完成情况、课程所属辅修方案和目标返校目的交叉比对；不得仅用“往届生”统称把辅修请求送进 C；审查 2019 文件现行性及是否存在学校新决定；归属、毕业时辅修未修满的事实可核 PASS_FACT，但不代表允许返校；SRC-001 §52（三）明确当时限制，提出返校重修/补授时给 NEEDS_HUMAN_DECISION 并路由 S02-T09/教务学籍主管；修订依据未得 POLICY_UNCONFIRMED；源不通 SOURCE_UNAVAILABLE。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "p0",
      "name": "P0 政策与身份定位",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "p1",
      "workflowOwner": "local"
    },
    {
      "id": "p1",
      "name": "P1 首次申请",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "p2",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "p2",
      "name": "P2 前置证据核验",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "p3",
      "workflowOwner": "local"
    },
    {
      "id": "p3",
      "name": "P3 条件性人工审批",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "p4",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "p4",
      "name": "P4 报名/选课/缴费或改班",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "p5",
      "workflowOwner": "local"
    },
    {
      "id": "p5",
      "name": "P5 开课确认/考试衔接",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "p6",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "p6",
      "name": "P6 学校办理结果",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "p7",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "p7",
      "name": "P7 结果变化/复核",
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
  "templateId": "S02-T08",
  "name": "重修、补修资格及教学班调整审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S02-T08.md",
  "sourceDocumentSha256": "e52593eb8d26abca361433a5e5300a0d4a5b283a7a7301b3137f80d83297db4d",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/S02-T08.md",
  "sourceOriginalSha256": "e52593eb8d26abca361433a5e5300a0d4a5b283a7a7301b3137f80d83297db4d",
  "sourceOriginalGitBlobSha": "e9242b81a47f7c3898f4e2e8c47e309a36a441fa",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23",
  "implementationAsOf": "2026-10-24",
  "researchStatus": "RESEARCH_HANDOFF_READY_POLICY_OPEN",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceSummary": "本科2019年规章和2025—2026学年历史重修通知可核；2026年秋季规则及研究生规则现行性不完整。",
  "relatedTemplateIds": [
    "S01-T02",
    "S01-T04",
    "S01-T07",
    "S02-T01",
    "S02-T02",
    "S02-T03",
    "S02-T04",
    "S02-T05",
    "S02-T06",
    "S02-T07",
    "S02-T09",
    "S02-T10",
    "T01-T08"
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "| SRC-001 CDUT-VERIFIED | 成都理工大学，《关于印发〈成都理工大学全日制普通本科学生学籍管理办法〉的通知》，成理校教〔2019〕18 号；[校信息公开原始 PDF](https://dbxb.cdut.edu.cn/__local/7/B6/E5/006AC04D88A214D1AD8B1F5E540_16B4A5B7_C543C.pdf) | 第 2 页第二条、第 4–5 页第十至十二条、第 6–7 页第十八、",
      "url": "https://dbxb.cdut.edu.cn/__local/7/B6/E5/006AC04D88A214D1AD8B1F5E540_16B4A5B7_C543C.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-002",
      "title": "| SRC-002 CDUT-VERIFIED | 成都理工大学教务处，《关于开展2025-2026学年第二学期课程重修报名的通知》；[教务处原始 PDF](https://aao.cdut.edu.cn/__local/E/93/20/F778804DAC7CF6C2F3C564F3BB4_3C9D3C55_2E21E.pdf)；[发布页](https://aao.cdut.edu.cn/info/1171/6931.htm) | P",
      "url": "https://aao.cdut.edu.cn/__local/E/93/20/F778804DAC7CF6C2F3C564F3BB4_3C9D3C55_2E21E.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-003",
      "title": "| SRC-003 CDUT-VERIFIED | 成都理工大学教务处，《关于开展2025-2026学年第一学期课程重修报名的通知》；[原始 PDF](https://aao.cdut.edu.cn/__local/8/76/19/661CBE9F35ADEEEF5F25F0DF67F_C1BEC8CB_37D12.pdf) | PDF 第 1–2 页：跟班重修、2025 秋季报名与缴费、符合年限的往届生、旧课程替代配置由学院教务员操作",
      "url": "https://aao.cdut.edu.cn/__local/8/76/19/661CBE9F35ADEEEF5F25F0DF67F_C1BEC8CB_37D12.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-004",
      "title": "| SRC-004 CURRENTITY-UNKNOWN | 成都理工大学，《成都理工大学学生选课管理办法》；[教务处原始 PDF](https://aao.cdut.edu.cn/__local/0/FD/0F/3135F978A388AEEF10442AC1944_5B5A90BC_39C55.pdf?e=.pdf) | PDF 第 1–4 页：第四、七至十六条；选课名单权威、正常补选、教学班停开、重修办理、非选课时段例外补退选及申",
      "url": "https://aao.cdut.edu.cn/__local/0/FD/0F/3135F978A388AEEF10442AC1944_5B5A90BC_39C55.pdf?e=.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-005",
      "title": "| SRC-005 CDUT-VERIFIED | 成都理工大学教务处，《关于2025-2026学年第一学期选课的通知》；[原始 PDF](https://aao.cdut.edu.cn/__local/6/67/EF/AAECEED75632BEE85A5022525E6_C666CA13_20EF1.pdf) | PDF 第 1–2 页：两轮选课时段、截止后原则不得补退选、停开/合班后的调整提示、必须核对系统结果、学费注册 | 20",
      "url": "https://aao.cdut.edu.cn/__local/6/67/EF/AAECEED75632BEE85A5022525E6_C666CA13_20EF1.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-006",
      "title": "| SRC-006 CDUT-VERIFIED | 成都理工大学教务处，《关于本学期〈现代化学基础I（2）〉……课程期末考试安排安排的通知》；[原始网页](https://aao.cdut.edu.cn/info/1171/6904.htm) | 网页正文考试安排：重修、补修学生一并参加，个人考试时间通过砚湖易办转教务系统查询 | 2025-12-16 发布；对应 2025 秋季期末考试；正文核验，不能推定所有补修都自动给学分 |",
      "url": "https://aao.cdut.edu.cn/info/1171/6904.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-007",
      "title": "| SRC-008 CURRENTITY-UNKNOWN | 成都理工大学教务处，《科室设置》；[教务处页面](https://aao.cdut.edu.cn/jgsz/kssz.htm) | 搜索索引显示教务科负责排课、选课、考试、成绩、课程重修组织与管理；学生学籍由学籍管理科负责 | 页面发布日期未见；尝试打开正文遭 412，此项仅机构职责检索线索，不据以判定具体人员签批授权；本科机构适用；页面正文未核 |",
      "url": "https://aao.cdut.edu.cn/__local/F/02/A6/0340BCDBCC4E8B384C66750E7B3_0949CB5E_42625.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-008",
      "title": "| SRC-008 CURRENTITY-UNKNOWN | 成都理工大学教务处，《科室设置》；[教务处页面](https://aao.cdut.edu.cn/jgsz/kssz.htm) | 搜索索引显示教务科负责排课、选课、考试、成绩、课程重修组织与管理；学生学籍由学籍管理科负责 | 页面发布日期未见；尝试打开正文遭 412，此项仅机构职责检索线索，不据以判定具体人员签批授权；本科机构适用；页面正文未核 |",
      "url": "https://aao.cdut.edu.cn/jgsz/kssz.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-009",
      "title": "| SRC-009 CURRENTITY-UNKNOWN | 成都理工大学核技术与自动化工程学院转载，《成都理工大学研究生课程建设及课程管理办法（暂行）》；[原始网页](https://cnae.cdut.edu.cn/info/1040/1425.htm) | 第二、三、十三、十八、二十二至二十六条：研究生补修课程类别、研究生院/学院两级分工、重修条件及次数、不同的调课程序 | 页面 2018-01-09；第二十六条称 2018-01",
      "url": "https://cnae.cdut.edu.cn/info/1040/1425.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-010",
      "title": "| SRC-010 CURRENTITY-UNKNOWN | 成都理工大学研究生院公开《研究生培养计划表》；[PDF](https://gra.cdut.edu.cn/__local/9/BC/D8/69F93B0F84BF88991B5055532D6_549DAACF_2072F.pdf?e=.pdf) | PDF 第 2–4 页“注意事项”及签字栏：跨专业/同等学力研究生补修本专业基础课，有的补修本科课程不计学分；导师、学院、研究",
      "url": "https://gra.cdut.edu.cn/__local/9/BC/D8/69F93B0F84BF88991B5055532D6_549DAACF_2072F.pdf?e=.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-011",
      "title": "| SRC-011 CDUT-VERIFIED | 成都理工大学，《成都理工大学外国留学生工作管理办法（试行）》，成理校发〔2021〕6 号；[学校信息公开 PDF](https://dbxb.cdut.edu.cn/__local/6/37/DF/840B45CE3BC21223D71BC59ED9B_9FF0318F_632B3.pdf) | 第 4 页第七条及第 7–9 页第二十至二十七条：留学生编班、选课、不同层次培养计划及国际",
      "url": "https://dbxb.cdut.edu.cn/__local/6/37/DF/840B45CE3BC21223D71BC59ED9B_9FF0318F_632B3.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-012",
      "title": "| SRC-012 GENERAL-RESEARCH | 教育部令第 41 号《普通高等学校学生管理规定》；[教育部官方全文](https://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201702/t20170216_296385.html)；[校内旧转载](https://math.cdut.edu.cn/info/1069/1636.htm) | 第十三条考核和不合格课程重修/补考由学校规定",
      "url": "https://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201702/t20170216_296385.html",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-013",
      "title": "| SRC-014 CURRENTITY-UNKNOWN | 成都理工大学教务处首页 https://aao.cdut.edu.cn/，公告标题《2026-2027学年第一学期选课的通知》 | 搜索索引首页显示 2026-06-26 发布的同名通知，未获取通知正文及附件，不能读取对应班次/时限 | 2026-06-26 为首页列表所示，不等同已读原件；当前目标学期的重要缺口；本科 |",
      "url": "https://aao.cdut.edu.cn/`，公告标题《2026-2027学年第一学期选课的通知》",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-014",
      "title": "| SRC-014 CURRENTITY-UNKNOWN | 成都理工大学教务处首页 https://aao.cdut.edu.cn/，公告标题《2026-2027学年第一学期选课的通知》 | 搜索索引首页显示 2026-06-26 发布的同名通知，未获取通知正文及附件，不能读取对应班次/时限 | 2026-06-26 为首页列表所示，不等同已读原件；当前目标学期的重要缺口；本科 |",
      "url": "https://aao.cdut.edu.cn/`，公告标题《2026-2027学年第一学期选课的通知》",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-015",
      "title": "| SRC-015 CROSS-SCHOOL-REFERENCE | 成都大学教务处，《关于开展2026-2027学年第一学期在校生及往届生重（补）修相关工作的通知》；[外校网页](https://jw.cdu.edu.cn/info/1043/12428.htm) | “重补修跟班或单开班、课程认定”的制度设计仅作为避免将“补修”误解为“补考”的术语对照 | 2026-09-10；成都大学不是成都理工大学，所有操作、时限、阈值、机构和",
      "url": "https://jw.cdu.edu.cn/info/1043/12428.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-016",
      "title": "| SRC-016 CDUT-VERIFIED | 成都理工大学教务处，《关于2025-2026学年第二学期选课的通知》；[教务处原始 PDF](https://aao.cdut.edu.cn/__local/2/88/2A/DD110F6D61AA7E588DF250D047D_669C38FD_20701.pdf) | PDF 第 1–2 页：2026 春季两轮选课及截止；含实验与理论课程须同时完整选对应教学班；选课后可能停开/合班",
      "url": "https://aao.cdut.edu.cn/__local/2/88/2A/DD110F6D61AA7E588DF250D047D_669C38FD_20701.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-017",
      "title": "| SRC-017 CDUT-VERIFIED | 成都理工大学研究生培养科，《关于2017-2018学年第二学期研究生申请课程重修的通知》；[研究生院原始 PDF](https://gra.cdut.edu.cn/__local/D/6D/12/D2FA40575D2EF2BA6BEE61618BD_B084E5B2_F926.pdf?e=.pdf) | PDF 第 1 页：研究生未及格/未达课程考核要求的重修申请表，学院研究生教务秘",
      "url": "https://gra.cdut.edu.cn/__local/D/6D/12/D2FA40575D2EF2BA6BEE61618BD_B084E5B2_F926.pdf?e=.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-018",
      "title": "| SRC-018 CURRENTITY-UNKNOWN | 成都理工大学研究生院，《关于2025-2026学年第二学期研究生公共素养课选课的通知》；[学校原始发布页](https://gra.cdut.edu.cn/info/1007/5752.htm) | 学校网页搜索索引显示 2026-03-16 发布，3 月 19–26 日学位与研究生系统选课，其中 2021–2025 级补选或重修公共素养课研究生参与；未能直接打开全文正文（H",
      "url": "https://gra.cdut.edu.cn/info/1007/5752.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-019",
      "title": "| SRC-019 CURRENTITY-UNKNOWN | 成都理工大学研究生院，《2025年秋季学期在校研究生学年注册工作的通知》；[研究生院原始发布页](https://gra.cdut.edu.cn/info/1011/5345.htm) | 网页搜索索引可读 2025-09-09 通知正文，明确引用《成都理工大学研究生学籍管理办法》成理校研〔2024〕29 号，要求研究生按学年注册，学院在学位与研究生系统核对；未取得 2024",
      "url": "https://gra.cdut.edu.cn/info/1011/5345.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
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
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r003",
      "sourceIds": [
        "SRC-001",
        "SRC-011",
        "SRC-019"
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
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r006",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r007",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r008",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r009",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r010",
      "sourceIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r011",
      "sourceIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r012",
      "sourceIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r013",
      "sourceIds": [
        "SRC-001",
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
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r016",
      "sourceIds": [
        "SRC-003",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r017",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r018",
      "sourceIds": [
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r019",
      "sourceIds": [
        "SRC-016",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r020",
      "sourceIds": [
        "SRC-005",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r021",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r022",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r023",
      "sourceIds": [
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r024",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r025",
      "sourceIds": [
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r026",
      "sourceIds": [
        "SRC-001",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r027",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r028",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r029",
      "sourceIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r030",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r031",
      "sourceIds": [
        "SRC-002",
        "SRC-004",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r032",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r033",
      "sourceIds": [
        "SRC-013",
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r034",
      "sourceIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r035",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r036",
      "sourceIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r037",
      "sourceIds": [
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r038",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-008",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r039",
      "sourceIds": [
        "SRC-013",
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
    }
  ]
} as const
