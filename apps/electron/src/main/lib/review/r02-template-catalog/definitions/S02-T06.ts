import type { TemplateVersion } from '@profer/shared'

/** R02 local research definition; it is not a school-issued or school-approved template. */
export const templateVersion: TemplateVersion = {
  "templateId": "S02-T06",
  "version": 1,
  "schemaVersion": 2,
  "name": "学生发起的成绩复核、复核后异议及复议申请审核",
  "description": "本地研究模板 · 非校方正式模板。本科成绩复核存在2019年校本依据，但现行修订、研究生普通课程复核及普通成绩答复是否属于正式申诉决定均未排他核验。 仅用于事实预审、证据整理和人工待办；政策或权限未确认时不得自动批准或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；来源为当前集成分支研究原件 S02-T06.md。研究来源 SRC 仅是来源索引，不是案卷材料 SourceRef。",
  "objectType": "person",
  "displayName": {
    "template": "{{f003}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "争议案卷 ID（ID）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "原稿字段 F001；来源/阶段/隐私/缺失处置：Case／P0-P1；系统生成、Main 端写入的不可变 ID，绑定申请/证据版；P1",
      "displayHint": "原稿字段编号 F001。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f002",
      "label": "真实申请人学号/身份键（ID）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F002；来源/阶段/隐私/缺失处置：Case／P1；学籍权威源或经校方核验的本人材料；不得信任渲染端自报（SRC-001、014）；P2",
      "displayHint": "原稿字段编号 F002。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f003",
      "label": "姓名及学校身份快照（TEXT）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F003；来源/阶段/隐私/缺失处置：Case／P1；学籍记录、历史名字更改授权记录；非学生手改文本（SRC-001、014）；P2",
      "displayHint": "原稿字段编号 F003。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f004",
      "label": "学段/学籍有效状态（ENUM）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F004；来源/阶段/隐私/缺失处置：Case／P0-P1；学校本科/研究生学籍权威快照及有效日（SRC-001 §2、005）；P2",
      "displayHint": "原稿字段编号 F004。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f005",
      "label": "代理主体与授权效力（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F005；来源/阶段/隐私/缺失处置：Application／代理时P1/P4/P5；校方已认可的委托/监护/代办核验记录；制度尚未取得（SRC-007 待核）；P3",
      "displayHint": "原稿字段编号 F005。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f006",
      "label": "学院/项目/培养类型（ENUM/TEXT）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F006；来源/阶段/隐私/缺失处置：Case／P0；权威学籍及当期培养归属（SRC-001 §2、005）；P2",
      "displayHint": "原稿字段编号 F006。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f007",
      "label": "唯一开课实例及修读记录（ID/REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F007；来源/阶段/隐私/缺失处置：Grade／P0；校方选课/开课/考核记录中学生×教学班×学期的真实键（SRC-001、013）；P2",
      "displayHint": "原稿字段编号 F007。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f008",
      "label": "课程代码与显示名称（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F008；来源/阶段/隐私/缺失处置：Grade／P0；校内课程目录/教学计划，关联 F007（SRC-013）；P1",
      "displayHint": "原稿字段编号 F008。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f009",
      "label": "学期/考核批次/成绩公布批次（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F009；来源/阶段/隐私/缺失处置：Grade／P0；成绩权威发布及学期、正常/补考/重修标识（SRC-001、013）；P2",
      "displayHint": "原稿字段编号 F009。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f010",
      "label": "考核类型与评定口径（ENUM）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F010；来源/阶段/隐私/缺失处置：Grade／P0-P2；官方开课/考试安排及大纲适用版本（SRC-013 §§27–33）；P2",
      "displayHint": "原稿字段编号 F010。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f011",
      "label": "已公布成绩值及历史版（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F011；来源/阶段/隐私/缺失处置：Grade／P0；教务权威成绩发布快照/经校方核验的成绩证明，含来源时间（SRC-001、016）；P2",
      "displayHint": "原稿字段编号 F011。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f012",
      "label": "成绩正式公布时间/时区（TIME）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F012；来源/阶段/隐私/缺失处置：Grade／P0-P1；成绩发布日志、正式公告、校方可证的公布节点（SRC-001 §25）；P2",
      "displayHint": "原稿字段编号 F012。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f013",
      "label": "申请提交时间、方式与接收凭据（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F013；来源/阶段/隐私/缺失处置：Application／P1；校方接收记录/有收讫标记纸件或已核验提交凭据（SRC-001、002、003待核）；P2",
      "displayHint": "原稿字段编号 F013。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f014",
      "label": "学生争议要点与请求（TEXT）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F014；来源/阶段/隐私/缺失处置：Application／P1；鉴权本人书面申请/陈述页，逐段证据定位（SRC-001、002）；P2",
      "displayHint": "原稿字段编号 F014。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f015",
      "label": "当期开课大纲/构成比例版本（REF）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F015；来源/阶段/隐私/缺失处置：Evidence／P2；课程大纲由开课单位持有，适用授课周期及审批版（SRC-013 §§22、30）；P1",
      "displayHint": "原稿字段编号 F015。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f016",
      "label": "平时/实验/期末等分项成绩（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F016；来源/阶段/隐私/缺失处置：Evidence／P2；任课教师/教学部的评分记载、过程性成绩公告与课程规则（SRC-013 §§30–31、38）；P3",
      "displayHint": "原稿字段编号 F016。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f017",
      "label": "试卷/作业及评阅档案引用（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F017；来源/阶段/隐私/缺失处置：Evidence／P2；开课学院受权保管人及原评阅记录定位（SRC-013 §§33–36）；P3",
      "displayHint": "原稿字段编号 F017。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f018",
      "label": "评分材料保管/提供人的已核角色（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F018；来源/阶段/隐私/缺失处置：Evidence／P2；学院受权档案保管名册/调卷登记（SRC-013 §36）；P1",
      "displayHint": "原稿字段编号 F018。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f019",
      "label": "申请表单版本与签署事实（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F019；来源/阶段/隐私/缺失处置：Application／P1；SRC-002 官网页/原件及实际校方纸件验收记录；具体栏位未读；P2",
      "displayHint": "原稿字段编号 F019。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f020",
      "label": "校方受理状态/回执（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F020；来源/阶段/隐私/缺失处置：Review／P2 后；教务处受理登记及校方签发回执，SRC-003 正文待核；P2",
      "displayHint": "原稿字段编号 F020。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f021",
      "label": "补件通知、可补项和提交批次（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F021；来源/阶段/隐私/缺失处置：Revision／通知后PX；实际校方通知/学生后续提交凭据（SRC-003 细则待核）；P2",
      "displayHint": "原稿字段编号 F021。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f022",
      "label": "撤回请求、主体与时刻（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F022；来源/阶段/隐私/缺失处置：Revision／撤回时PX；鉴权学生真实请求及机构受理/效力确认；P2",
      "displayHint": "原稿字段编号 F022。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f023",
      "label": "复核承办/签发人可信授权（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F023；来源/阶段/隐私/缺失处置：Review／P2-P3；校方实际任命/授权和受控公文签发链（SRC-001、003 待核）；P1",
      "displayHint": "原稿字段编号 F023。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f024",
      "label": "初次复核答复/结论原文（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F024；来源/阶段/隐私/缺失处置：Review／P3 后；学校真实复核文件、编号/印章及校内来源（SRC-003待核）；P2",
      "displayHint": "原稿字段编号 F024。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f025",
      "label": "答复送达/通知时间和方式（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F025；来源/阶段/隐私/缺失处置：Review／P3 后；有权部门送达/查收可核记录（SRC-003、007 待核）；P2",
      "displayHint": "原稿字段编号 F025。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f026",
      "label": "教师补录/更正业务的权威引用（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F026；来源/阶段/隐私/缺失处置：Correction／触发时P3；另行成绩补录更正流程经校方正式批准的编号（SRC-013 §35）；P2",
      "displayHint": "原稿字段编号 F026。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f027",
      "label": "当前正式成绩与变更版本链（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F027；来源/阶段/隐私/缺失处置：Grade／变更后P3；学校成绩权威记载、前后值、时间与对应 F026（SRC-013 §35）；P2",
      "displayHint": "原稿字段编号 F027。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f028",
      "label": "复核后异议及新增证据说明（TEXT）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F028；来源/阶段/隐私/缺失处置：Application／P4；申请人对 F024 的另次陈述/送达凭据（SRC-007待核）；P2",
      "displayHint": "原稿字段编号 F028。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f029",
      "label": "正式处理/处分决定的类型/原文（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "原稿字段 F029；来源/阶段/隐私/缺失处置：Appeal／P5 前；学校实际正式决定、文号、授权印章与适用制度（SRC-001 §59、008、009）；P3",
      "displayHint": "原稿字段编号 F029。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f030",
      "label": "正式申诉请求、提交与接收时刻（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F030；来源/阶段/隐私/缺失处置：Appeal／P5；学生书面申诉及校内申诉机构真实接收记录（SRC-007待核、009）；P3",
      "displayHint": "原稿字段编号 F030。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f031",
      "label": "申诉委员会复查意见/送达（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F031；来源/阶段/隐私/缺失处置：Appeal／复查后P5；合法组成的委员会正式复查文书/送达（SRC-008、009）；P3",
      "displayHint": "原稿字段编号 F031。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f032",
      "label": "有权机关重新决定/生效情况（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F032；来源/阶段/隐私/缺失处置：Appeal／后续P5；学校依适用程序重新签发的处理决定（SRC-009）；P3",
      "displayHint": "原稿字段编号 F032。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f033",
      "label": "外部救济回执及机关文书（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F033；来源/阶段/隐私/缺失处置：External／P6；省级教育行政部门或依法有权机关真实回执/决定（SRC-009）；P3",
      "displayHint": "原稿字段编号 F033。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f034",
      "label": "每件证据归属/指纹/取证时间（HASH/STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F034；来源/阶段/隐私/缺失处置：Evidence／上传及调取时；系统保存的文件指纹、持有人、提交主体、所关联学生/课程/版本；P2",
      "displayHint": "原稿字段编号 F034。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f035",
      "label": "适用规则来源版本/时效状态（STRUCT）",
      "kind": "object",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F035；来源/阶段/隐私/缺失处置：Policy／各阶段；SRC-001…016、校方正式新规、适用学段及生效时间（SRC-001、005、007、013、015）；P0",
      "displayHint": "原稿字段编号 F035。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f036",
      "label": "G50/S/T 及权威决定引用（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F036；来源/阶段/隐私/缺失处置：LinkedDecision／触发时；外部案卷签发者、决议标识、效力与本人的归属（SRC-011未取得原文件）；P2",
      "displayHint": "原稿字段编号 F036。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "本人确实提出特定课程成绩复核",
      "purpose": "本人确实提出特定课程成绩复核；学生；书面申请/校方受理的电子等效申请；P1 初期当前；电子形式效力待核；SRC-002 正式申请表或机构认可的等效书面件；F002–F003、F007–F009、F013–F014、F019；SRC-001、002、003待核",
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
        "本人确实提出特定课程成绩复核；学生；书面申请/校方受理的电子等效申请；P1 初期当前；电子形式效力待核；SRC-002 正式申请表或机构认可的等效书面件；F002–F003、F007–F009、F013–F014、F019；SRC-001、002、003待核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "本人身份与学籍/学段可核",
      "purpose": "本人身份与学籍/学段可核；学校；学籍权威记录及鉴权主体；P1 当前核验，非申请人必传；学校核验的线下身份记录；无依据不强要身份证影印；F002–F006；SRC-001、005、014",
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
        "本人身份与学籍/学段可核；学校；学籍权威记录及鉴权主体；P1 当前核验，非申请人必传；学校核验的线下身份记录；无依据不强要身份证影印；F002–F006；SRC-001、005、014"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "确为该开课实例修读/有考核记录",
      "purpose": "确为该开课实例修读/有考核记录；学校；选课/修课/开课记录；P1 当前核验，非申请人必传；校方签发的对应修读记录，经校方复核；F007–F010；SRC-001、013",
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
        "确为该开课实例修读/有考核记录；学校；选课/修课/开课记录；P1 当前核验，非申请人必传；校方签发的对应修读记录，经校方复核；F007–F010；SRC-001、013"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "被申诉的是已公布的具体成绩及公布时点",
      "purpose": "被申诉的是已公布的具体成绩及公布时点；学校；成绩公布原版、发布日志；P1 当前核验，非申请人必传；经核验的有章成绩证明/校方历史数据；截图仅线索；F009、F011–F012；SRC-001、013、016",
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
        "被申诉的是已公布的具体成绩及公布时点；学校；成绩公布原版、发布日志；P1 当前核验，非申请人必传；经核验的有章成绩证明/校方历史数据；截图仅线索；F009、F011–F012；SRC-001、013、016"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "解释异议具体内容及请求",
      "purpose": "解释异议具体内容及请求；学生；M001 内理由栏/另附说明；P1 初期当前，允许与 M001 合一；鉴权学生补充说明，形式由校方认定；F014；SRC-001、002",
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
        "解释异议具体内容及请求；学生；M001 内理由栏/另附说明；P1 初期当前，允许与 M001 合一；鉴权学生补充说明，形式由校方认定；F014；SRC-001、002"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "支撑特定异议事实的学生现有证据",
      "purpose": "支撑特定异议事实的学生现有证据；学生；已持有的作业批注、成绩截图等；条件：学生主动主张并持有时；不得一概强制；后续校方调取的原始评分证据 M009/010；F014、F016–F017、F034；SRC-013",
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
        "支撑特定异议事实的学生现有证据；学生；已持有的作业批注、成绩截图等；条件：学生主动主张并持有时；不得一概强制；后续校方调取的原始评分证据 M009/010；F014、F016–F017、F034；SRC-013"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "核实由他人代交的授权关系",
      "purpose": "核实由他人代交的授权关系；学生/代理人与学校；校方接受的授权文件/验证记录；条件：C11 代理时；有效形式未核；经核准现场授权/其他受理机关认可手段；F002、F005、F013；SRC-007待核",
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
        "核实由他人代交的授权关系；学生/代理人与学校；校方接受的授权文件/验证记录；条件：C11 代理时；有效形式未核；经核准现场授权/其他受理机关认可手段；F002、F005、F013；SRC-007待核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "确定当期成绩计算和评价标准",
      "purpose": "确定当期成绩计算和评价标准；学校开课单位；对应版本教学大纲/评定说明；P2 校方后续调取；校方确认的课程标准归档版；F007、F010、F015；SRC-013 §§22、27、30",
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
        "确定当期成绩计算和评价标准；学校开课单位；对应版本教学大纲/评定说明；P2 校方后续调取；校方确认的课程标准归档版；F007、F010、F015；SRC-013 §§22、27、30"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "核对分项成绩、过程性考评及总评构成",
      "purpose": "核对分项成绩、过程性考评及总评构成；任课教师/教学部；原评分登记及过程性记录；P2 校方后续调取；学院授权提供的原始成绩单/归档扫描件；F011、F015–F018；SRC-013 §§30–34、38",
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
        "核对分项成绩、过程性考评及总评构成；任课教师/教学部；原评分登记及过程性记录；P2 校方后续调取；学院授权提供的原始成绩单/归档扫描件；F011、F015–F018；SRC-013 §§30–34、38"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "核对试卷、作业及评阅事实",
      "purpose": "核对试卷、作业及评阅事实；开课学院指定保管人；原卷/答题记录/评阅档案；P2 争议相关时条件调取；经校方认证的原件扫描及保管登记；F016–F018、F034；SRC-013 §§33–36",
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
        "核对试卷、作业及评阅事实；开课学院指定保管人；原卷/答题记录/评阅档案；P2 争议相关时条件调取；经校方认证的原件扫描及保管登记；F016–F018、F034；SRC-013 §§33–36"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "证明校方接件/受理而非仅提交",
      "purpose": "证明校方接件/受理而非仅提交；教务处/相应受理机关；收讫/受理记录；P2 受理后才产生；有校方可核登记号和收讫标识的凭据；F013、F020、F023；SRC-001、003待核",
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
        "证明校方接件/受理而非仅提交；教务处/相应受理机关；收讫/受理记录；P2 受理后才产生；有校方可核登记号和收讫标识的凭据；F013、F020、F023；SRC-001、003待核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "追踪补件告知与学生补交",
      "purpose": "追踪补件告知与学生补交；校方及学生；补正通知/回复材料；PX 接到补件通知后条件必需；校方认可的同渠道补交及留痕；F013–F014、F021、F034；SRC-003待核",
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
        "追踪补件告知与学生补交；校方及学生；补正通知/回复材料；PX 接到补件通知后条件必需；校方认可的同渠道补交及留痕；F013–F014、F021、F034；SRC-003待核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "支撑承办人的核查过程与权限",
      "purpose": "支撑承办人的核查过程与权限；学校复核承办单位；核查意见、调卷/签审痕迹；P2 核查后校方生成；经授权的内部复核记录引用；F016–F018、F023–F024；SRC-001、003、013",
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
        "支撑承办人的核查过程与权限；学校复核承办单位；核查意见、调卷/签审痕迹；P2 核查后校方生成；经授权的内部复核记录引用；F016–F018、F023–F024；SRC-001、003、013"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "证明正式初次复核答复是什么",
      "purpose": "证明正式初次复核答复是什么；学校有权受理/答复单位；正式回复文件；P3 结果形成后才产生；学校可核验的结果登记/原件；F023–F024；SRC-003待核、013",
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
        "证明正式初次复核答复是什么；学校有权受理/答复单位；正式回复文件；P3 结果形成后才产生；学校可核验的结果登记/原件；F023–F024；SRC-003待核、013"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "确定结果已合法通知及时间",
      "purpose": "确定结果已合法通知及时间；学校；正式送达/查收记录；P3 通知后才产生；经有权机关认可的接收凭据；F024–F025；SRC-007待核、009",
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
        "确定结果已合法通知及时间；学校；正式送达/查收记录；P3 通知后才产生；经有权机关认可的接收凭据；F024–F025；SRC-007待核、009"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "验证更正成绩有另外的权限程序",
      "purpose": "验证更正成绩有另外的权限程序；教师业务有权审批机关；正式补录/更正批准链；P3 确有更正时条件出现；授权部门可核电子批准编号及审批版本；F023、F026–F027；SRC-013 §35、006待核",
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
        "验证更正成绩有另外的权限程序；教师业务有权审批机关；正式补录/更正批准链；P3 确有更正时条件出现；授权部门可核电子批准编号及审批版本；F023、F026–F027；SRC-013 §35、006待核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "确认权威成绩已经发生正式变动",
      "purpose": "确认权威成绩已经发生正式变动；学校成绩权威源；原版/现版及变更日志；P3 更正生效后条件出现；学校有章更正证明并核对源记录；F011、F026–F027；SRC-013 §35、016",
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
        "确认权威成绩已经发生正式变动；学校成绩权威源；原版/现版及变更日志；P3 更正生效后条件出现；学校有章更正证明并核对源记录；F011、F026–F027；SRC-013 §35、016"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "核对学生在复核后提出的新增异议",
      "purpose": "核对学生在复核后提出的新增异议；学生；后续书面异议和新增证据；P4 学生提出时当前；学校认可的等效书面/记录；F024–F025、F028、F034；SRC-003、007待核",
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
        "核对学生在复核后提出的新增异议；学生；后续书面异议和新增证据；P4 学生提出时当前；学校认可的等效书面/记录；F024–F025、F028、F034；SRC-003、007待核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "区分是否真有可正式申诉的处理/处分决定",
      "purpose": "区分是否真有可正式申诉的处理/处分决定；学校；正式处理/处分决定原件及送达；P5 条件先决，普通成绩复核不默认存在；学校已核验的处理决定权威引用；F025、F029、F035；SRC-001 §59、005 §44、008、009",
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
        "区分是否真有可正式申诉的处理/处分决定；学校；正式处理/处分决定原件及送达；P5 条件先决，普通成绩复核不默认存在；学校已核验的处理决定权威引用；F025、F029、F035；SRC-001 §59、005 §44、008、009"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "证明学生正式申诉的意愿、时限和接收",
      "purpose": "证明学生正式申诉的意愿、时限和接收；学生与申诉受理机关；书面申诉/收讫；P5 确认适用后当前；现行校本制度认可的书面等效提交；F002、F029–F030、F035；SRC-007待核、009",
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
        "证明学生正式申诉的意愿、时限和接收；学生与申诉受理机关；书面申诉/收讫；P5 确认适用后当前；现行校本制度认可的书面等效提交；F002、F029–F030、F035；SRC-007待核、009"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "证明校内委员会真实复查意见",
      "purpose": "证明校内委员会真实复查意见；学生申诉处理委员会；复查文件/送达；P5 委员会作出后才产生；校方申诉机构权威文书库引用；F030–F031；SRC-008、009、007待核",
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
        "证明校内委员会真实复查意见；学生申诉处理委员会；复查文件/送达；P5 委员会作出后才产生；校方申诉机构权威文书库引用；F030–F031；SRC-008、009、007待核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "证明有权机关是否重新作决定",
      "purpose": "证明有权机关是否重新作决定；原/依法有权的校方决定机关；新正式决定；P5 重新决定后才产生；校方真实生效文书与其送达记录；F029、F031–F032；SRC-009",
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
        "证明有权机关是否重新作决定；原/依法有权的校方决定机关；新正式决定；P5 重新决定后才产生；校方真实生效文书与其送达记录；F029、F031–F032；SRC-009"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m023",
      "name": "记录合法外部救济及实际结果",
      "purpose": "记录合法外部救济及实际结果；省级教育行政部门等；外部受理回执/决定；P6 条件后续；有权外部机构可核公文；F031–F033；SRC-009",
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
        "记录合法外部救济及实际结果；省级教育行政部门等；外部受理回执/决定；P6 条件后续；有权外部机构可核公文；F031–F033；SRC-009"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m024",
      "name": "核对撤回由谁提出及机构处理效力",
      "purpose": "核对撤回由谁提出及机构处理效力；学生及学校；撤回声明/受理回执；PX 触发时条件必需；校方认可的经身份验证电子撤回；F002、F022、F034；SRC-003、007待核",
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
        "核对撤回由谁提出及机构处理效力；学生及学校；撤回声明/受理回执；PX 触发时条件必需；校方认可的经身份验证电子撤回；F002、F022、F034；SRC-003、007待核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m025",
      "name": "复用而不重做其他业务有权决定",
      "purpose": "复用而不重做其他业务有权决定；G50/S/T 或学校另案有权机关；已签发决定引用；C14 或相邻事实触发时条件；可核签发主体、案卷/版次和效力的校内决定；F026、F029、F034–F036；SRC-011未取、013",
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
        "复用而不重做其他业务有权决定；G50/S/T 或学校另案有权机关；已签发决定引用；C14 或相邻事实触发时条件；可核签发主体、案卷/版次和效力的校内决定；F026、F029、F034–F036；SRC-011未取、013"
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
          "title": "在校课程成绩由学生发起的争议",
          "requirement": "R001 P0/P1，C01–C14；对象是“在校课程成绩由学生发起的争议”；SRC-001、010、013；F002、F004、F007、F010；M001、M002、M003；对人员与考试类别、诉求主体做双重路由；T=PASS_FACT；F=教师主动更正/研招初试等 NOT_APPLICABLE；U=NEEDS_HUMAN_DECISION；E0/E1；以争议所属考试年度/课程开课批次定性，年度研招通知不可移植；不确定申请性质不能硬排除；学籍/教务分流人员；错误路由交该业务权威入口。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "M002、M004",
          "requirement": "R002 P0–P6；本学段/时段确有适用且有效的政策版本；SRC-001、004、005、007、009、012、013、015；F004、F006、F035；M002、M004；按学校、学段、业务种类、生效/废止、公布年份匹配；T=PASS_FACT；F=存在明确不同适用范围=NOT_APPLICABLE（仅对该规则分支）；U=POLICY_UNCONFIRMED；E1，旧 2017 学籍规章已被 2019 版废止，2018 研究生课程办法不能冒充已确认的 2026 版；新规冲突请法规归口确认；教务处政策管理员/研究生院规则归口、校方人工核定。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "M001、M002",
          "requirement": "R003 P1/P4/P5；提交主体是与可信学籍同一的本人；SRC-001、005、014；F002、F003、F013、F034；M001、M002；比较认证主体、学号/姓名历史版、申请签署与归属；T=PASS_FACT；F=确有另人或多个身份不一致=CONFLICT；U=学校身份源断连=SOURCE_UNAVAILABLE；E0>E3>E4；曾用名/更改学籍键不简单判他人，未经认证 Renderer 声明不能代替本人；学籍管理人员/身份核验员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "M002、M007",
          "requirement": "R004 P1/P4/P5，仅 C11；代理行为具备按有效制度认可的授权；SRC-001、007（待核）；F002、F005、F013、F035；M002、M007；核代理人、被代理人、授权事项/时效与校方核验；T=获校方认可后PASS_FACT；F=确实无授权=NEEDS_HUMAN_DECISION；U=代理适用制度或证明形式未核=POLICY_UNCONFIRMED；E0/E3；C01 本人亲办则 NOT_APPLICABLE；未成年身份或辅导员代交不得默示合法代理；学生本人、教务处/申诉机构的受理人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "M002",
          "requirement": "R005 P0/P1，所申述学段和在籍/已离校身份与本事项适用条件对应；SRC-001 §2、005、015（待核）；F004、F006、F035；M002；校方学籍快照和资格时点、项目性质对齐；T=本科核心或经核准参照范围PASS_FACT；F=确已超出当前适用规则=NEEDS_HUMAN_DECISION；U=来源断连SOURCE_UNAVAILABLE，专门规则不明POLICY_UNCONFIRMED；E0/E1，专科/来华生/离校/研究生不硬套本科 10 工作日；不以毕业自动取消复核请求；学籍管理/教务处或研究生培养归口人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "M003、M004",
          "requirement": "R006 P0/P1/P2，课程、教学班、学生修读和考核批次可唯一匹配；SRC-001、013；F007–F010、F034；M003、M004；比对 student×offering×term×assessmentAttempt；T=PASS_FACT；F=跨学期或补考/重修错配=CONFLICT；U=开课修读权威源断连=SOURCE_UNAVAILABLE；E0>E3；同名课程、成绩截图或无 ID 材料不允许合并；若学校只有纸档由授权人核对；开课学院教务员/教务成绩管理人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "M003、M004",
          "requirement": "R007 P0/P1，争议对象的正式课程成绩已公布；SRC-001 §§24–25、013；F009–F011；M003、M004；比对公布批次和当期成绩权威快照；T=PASS_FACT；F=明确仅为教师暂存草稿=NEEDS_HUMAN_DECISION（尚未形成通常初次复核起点）；U=SOURCE_UNAVAILABLE；E0；考试完成/教师上传并不自动等于正式公布；特殊成绩类别待校方确定；教务成绩管理人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "M004、M006、M017",
          "requirement": "R008 P0–P3，已公布成绩值和目标版本真实且一致；SRC-001、013、016；F009、F011、F027、F034；M004、M006、M017；同一课程批次的正式公布版/现版/学生截图三方核对；T=PASS_FACT；F=同源有效版冲突=CONFLICT；U=SOURCE_UNAVAILABLE；E0>E3/E4；学生截图只能指向争议，不能覆盖校方更正现版；历史值不可删；教务成绩管理及原记录维护人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "M004",
          "requirement": "R009 P0/P1，正式成绩公布时间及起算事件可信；SRC-001 §25、013；F009、F012、F034；M004；校方发布公告、发布时间证明与开课批次对齐；T=PASS_FACT；F=不同权威时间互相矛盾=CONFLICT；U=SOURCE_UNAVAILABLE；E0/E1，禁止以考试日期、教师上传日期、学生截图日期代替；公布后再变更的起算问题待核；教务成绩管理人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "M001",
          "requirement": "R010 P1，学生针对本课程确有书面申请；SRC-001 §25、002、003待核；F002、F007、F013、F014、F019；M001；读本人申请、诉求、课程归属及是否有效提交；T=PASS_FACT；F=可确定未提交当前应有申请=NEEDS_MATERIAL；U=存在附件但无法读=UNREADABLE；E3，经校方接收记录核真实性；电子等效形式须经校方确认，不额外要求后来才产生的签章；学生补填/教务处受理人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "M001、M005、M018（P4才）",
          "requirement": "R011 P1/P4，争议事实和请求可以定位至特定课程/成绩事项；SRC-001、002；F007–F011、F014、F028；M001、M005、M018（P4才）；文本说明与开课实例和争议类别关联；T=PASS_FACT；F=只有“我不满意”且缺可定位对象=NEEDS_MATERIAL；U=文本不可读UNREADABLE；E3，M001 和 M005 可同一申请表；学生不必自行认定教师错误或评分结果；学生补充具体争点/教务处登记人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "M001",
          "requirement": "R012 P1，申请表的实际版本和签署形式获校方接受；SRC-002、003（流程待核）；F013、F019、F035；M001；对照校本可读取表单正文及学校实际受理标识；T=学校核准格式PASS_FACT；F=学校认定格式不符NEEDS_HUMAN_DECISION；U=2018 附件内部未查POLICY_UNCONFIRMED；E1/E3；不能从网页标题推断必须辅导员或教师先签名；已有合法电子书面申请不重复索纸件；教务处表单归口管理员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "M001、M011（仅产生后）",
          "requirement": "R013 P1，提交时刻/渠道有可信原始凭据；SRC-001、002、003待核；F013、F034；M001、M011（仅产生后）；比对校方接收日志/已核纸件收讫和申请版本；T=PASS_FACT；F=两份收讫时间不同CONFLICT；U=校方接收源暂不可调SOURCE_UNAVAILABLE；E0/E2>E3；不要求学生 P1 自带未来 P2 的受理回执；纸件缺记录时人工寻档；教务处接件人员/档案管理员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "M001、M004",
          "requirement": "R014 P1，首次本科申请期限可按现行规则核算；SRC-001 §25、004、003待核；F004、F012–F013、F035；M001、M004；先核本科学段、成绩公布、接收时刻、节假日，再对“10工作日、节假日顺延”核时差；T=证实在限期内PASS_FACT；F=证实迟交NEEDS_HUMAN_DECISION；U=规则新修/校历未知POLICY_UNCONFIRMED，事实时刻不可调SOURCE_UNAVAILABLE；E1/E0；特殊生、补考/重修、逾期例外另核，不用算法拒收；与正式申诉 10 日严分；教务处负责时限复核的有权人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "M001、M006、M010（触发者）",
          "requirement": "R015 P1–P6，仅已有附件；文件可在许可范围内可靠读取；SRC-002、013；F014、F017、F034；M001、M006、M010（触发者）；区分原件可打开/OCR 残缺/页丢失；T=必需信息可读PASS_FACT；F=确有字节但无法辨读UNREADABLE；U=根本取不到已有文件SOURCE_UNAVAILABLE；E3/E2，OCR 置信度不能使低清签章自动变真；尚未产生的 P3/P5 文件 NOT_APPLICABLE；文件持有人或校方授权档案调取人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "M001、M006、M009（按阶段）",
          "requirement": "R016 P1–P6；每项材料属于本学生、本开课实例及本次版本；SRC-001、013；F002–F003、F007–F010、F034；M001、M006、M009（按阶段）；校验申报者/成绩对象、评阅页归属、文件指纹及时序；T=PASS_FACT；F=错人/错课/旧页覆盖新版=CONFLICT；U=无可核归属 NEEDS_HUMAN_DECISION；E0/E2>E3；他人成绩禁止向申请人曝光；同源换版只重算受影响规则；证据管理员/教务成绩管理人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "M008、M003",
          "requirement": "R017 P2，争议课程评分口径有对应授课周期的有效大纲；SRC-013 §§22、27、30；F007、F010、F015；M008、M003；校验课程、授课周期、学院存档版本和构成比例；T=PASS_FACT；F=拿错学期的大纲=CONFLICT；U=校内大纲失联SOURCE_UNAVAILABLE；E1/E2；课程改革后的大纲不能追溯覆盖旧批次；AI 不自创构成比例；开课学院课程负责人/教务档案保管人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "M008、M009",
          "requirement": "R018 P2，分项成绩及汇总计算能与当期大纲和原始记录一致；SRC-013 §§30–31、34、38；F011、F015–F016、F034；M008、M009；由有权人员确认课程规定权重、评分制和原始数值后复算客观加权/登记一致性；T=算式与记录一致PASS_FACT；F=计算值或登记冲突CONFLICT；U=原始评分表不可调SOURCE_UNAVAILABLE；E1/E2，四舍五入规则/特殊评分制度无现行说明则POLICY_UNCONFIRMED；不就主观学术得分自动改分；任课教师/教学部、教务处复核承办人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "M009、M010",
          "requirement": "R019 P2，争议涉及试卷/作业时原始评阅档案与本人考核对应；SRC-013 §§33–36；F007、F017、F034；M009、M010；对档案包、学生编号、科目/批次、卷面页与评分签注比对；T=归属完整PASS_FACT；F=混卷或缺页版本矛盾CONFLICT；U=档案源未找到SOURCE_UNAVAILABLE；E2，超最低四年保存期限不表示学生必须自交原卷或权益自然灭失；阅卷尺度争议只能人工学术核查；开课学院指定档案管理员及依法授权阅卷复核人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "M009、M010、M013（后续出现）",
          "requirement": "R020 P2，提供档案/核查事实的人员有真实对应岗位及权限；SRC-013 §§33–36、014；F018、F023、F034；M009、M010、M013（后续出现）；核学院保管职责、调阅授权、复核任务委派；T=授权已核PASS_FACT；F=无权者冒签NEEDS_HUMAN_DECISION；U=权限凭据不可调SOURCE_UNAVAILABLE；E0/E1；学院保管人、任课教师不自动成为复核结果签发人；Renderer role 字段无凭据；学院负责人/教务处权限管理员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "M001、M011",
          "requirement": "R021 P2，学生申请已由合法机构接收与受理且状态可证；SRC-001 §25、003待核、014；F013、F020、F023；M001、M011；区分“学生已递交”“校方收讫”“正式受理”三个不同回执/标记；T=实际相应状态可证PASS_FACT；F=材料只有客户端‘受理成功’CONFLICT；U=校方受理记录未能调取SOURCE_UNAVAILABLE；E0/E2>E4；P1 尚未产生 M011 则本规则 NOT_APPLICABLE，不能倒逼用户上传；教务处实际受理人员/人工档案核验员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "PX（校方已有补件通知），学生针对明确缺口完成了该版补件",
          "requirement": "R022 PX（校方已有补件通知），学生针对明确缺口完成了该版补件；SRC-002、003待核；F013–F014、F019、F021、F034；M001、M005、M012；对照真实补件通知的对象、要求、修订版和当前附件；T=已补可核PASS_FACT；F=确实缺当前应交申请事实NEEDS_MATERIAL；U=补件不可读UNREADABLE/通知源断连SOURCE_UNAVAILABLE；E2/E3；补件时限、逾期效力无校本证据=POLICY_UNCONFIRMED；未收到通知不虚报缺件；学生补件/教务处经办人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "M011、M013、M014（结果形成后）",
          "requirement": "R023 P2/P3，复核经办与答复签发权限有真实授权链；SRC-001、003待核、013、014；F018、F023–F024；M011、M013、M014（结果形成后）；比对职位职责、受理委派、单位签发记录及当期授权；T=有权链匹配PASS_FACT；F=教师或未知人越权签发NEEDS_HUMAN_DECISION；U=细则/授权记录未取得POLICY_UNCONFIRMED；E0/E1；教务处为申请接收机构并不证明具体个人有最终改分权；教务处授权管理人/学校有权签发机关。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "M011、M013、M014",
          "requirement": "R024 P3，真实初次复核答复已由有权机构作出且与争议案对应；SRC-001、003待核；F001、F007、F023–F024、F034；M011、M013、M014；核案卷/开课/学生、答复正文、签发机关、文号和签发时刻；T=真实且相符PASS_FACT；F=聊天截图伪作正式答复=CONFLICT；U=应有权威答复源暂不可调SOURCE_UNAVAILABLE；E0/E1；仅师生沟通/AI 评分建议不能生成 P3 正式答复；本规则在 P1/P2 NOT_APPLICABLE；校方正式复核答复签发人/教务处核验人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "M014、M015",
          "requirement": "R025 P3/P4，初次复核答复实际完成通知/送达且时间可信；SRC-003、007待核、009（范围条件）；F024–F025、F028–F030；M014、M015；核结果版本、真实送达方式/对象/时间，区分“学生自行转发截图”；T=PASS_FACT；F=多个权威送达版本冲突CONFLICT；U=送达记录失联SOURCE_UNAVAILABLE；E0/E1；普通复核答复的救济起算需校本规则，不直接套正式处分送达时钟；有权答复/送达机关、教务处复核经办人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "M006、M016、M025（若外部案）",
          "requirement": "R026 P3 或 C12 外部教师业务，已正式提交成绩的补录/更正确经另行有权程序授权；SRC-006待核、013 §35；F011、F023、F026–F027、F036；M006、M016、M025（若外部案）；比对更正业务 ID、审批机关、签发、被改课程与原正式成绩版；T=批准真实PASS_FACT；F=仅教师微信同意/未授权改分NEEDS_HUMAN_DECISION；U=程序细则或签发人授权未知POLICY_UNCONFIRMED；E0/E1>E4；本模板只能引用外部正式改分，教师更正申请本身 NOT_APPLICABLE 于学生首提；教师成绩更正程序的有权审批人/教务成绩管理人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "M004、M016、M017",
          "requirement": "R027 P3，变更后的正式成绩及其历史链接已在学校权威源实际成立；SRC-013 §35、016；F011、F026–F027、F034；M004、M016、M017；对照更正批准、正式成绩前后版、写入时间、关联批次；T=版本链一致PASS_FACT；F=申请说明已更改但权威成绩未变=CONFLICT；U=权威成绩无法调取SOURCE_UNAVAILABLE；E0；无真正批准/入库时 不能用老师草稿分数替代正式现版；审计旧成绩不删除；教务成绩系统实际授权维护者。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "M005、M014、M015、M018",
          "requirement": "R028 P4，学生在真实初核答复之后提出了可辨识的新异议事实；SRC-001、003、007待核；F013–F014、F024–F025、F028、F035；M005、M014、M015、M018；比对前次答复及本次新增事实、提交时序和学生身份；T=已提出该异议PASS_FACT；F=证明其实是尚未答复的首次补件NEEDS_HUMAN_DECISION（重路由）；U=申请材料不可读UNREADABLE或原答复不可调SOURCE_UNAVAILABLE；E0/E1/E3；本规则只证明异议存在与归属，受理渠道与独立复议授权由 R038 核验；教务处接收登记人/证据核验人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "M019、M014（用于区分普通答复）",
          "requirement": "R029 P5 的进入门禁：确有属于适用申诉范围的学校正式处理/处分决定；SRC-001 §59、005 §44、007待核、008–009、012；F004、F029、F035；M019、M014（用于区分普通答复）；核正式决定性质、出具学校机关、对象、法定告知和校本范围；T=权威核定性质后PASS_FACT；F=仅普通成绩复核答复且未能证明属于该范围NOT_APPLICABLE（只对 P5）/返回 P4 待核；U=性质有争议NEEDS_HUMAN_DECISION或细则缺POLICY_UNCONFIRMED；E0/E1；第 41 号令不能把任意教师回复升级为“学校处理或处分决定”；学生申诉处理委员会有权受理人员/学校法规审核人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "M019、M020",
          "requirement": "R030 P5 且 R029 已确认，正式申诉起算和时限可据有效规范核验；SRC-007待核、008–009；F025、F029–F030、F035；M019、M020；核决定书实际送达、申诉接收、上位“10日”及真实校本补充规定；T=在规定期限内PASS_FACT；F=可信证据显示迟交NEEDS_HUMAN_DECISION；U=效力/起算依据未核POLICY_UNCONFIRMED；E0/E1；不能套 P1 的 10工作日；逾期例外、送达异议交法定机关裁量；申诉机构有权收件人员/学校法规人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "M019、M020",
          "requirement": "R031 P5，学生正式书面申诉和校内有权机构接收事实可区分；SRC-007待核、009；F002、F029–F030、F034；M019、M020；查申诉请求与原决定编号、本人签署、接收日志；T=已提交/收件事实PASS_FACT；F=当前确无书面申诉=NEEDS_MATERIAL；U=申诉接收源失联SOURCE_UNAVAILABLE；E0/E3；书面申诉已交并不等于委员会受理/复查通过；M021 后续才形成；学生补申诉资料/申诉处理委员会秘书或核验人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "M020、M021",
          "requirement": "R032 P5（委员会工作后），复查意见系有权委员会真实文书且语义明确；SRC-007待核、008–009；F029–F031、F034；M020、M021；核委员会主体与签发、意见正文、是否只是建议另行决定；T=复查意见真实PASS_FACT；F=无权机关“替代复查”CONFLICT；U=记录不可调SOURCE_UNAVAILABLE；E0/E1；意见可能要求学校另行研究，不自行生效成为新成绩/新处理决定；P5 初申 NOT_APPLICABLE；学生申诉处理委员会及学校文书核验人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "M019、M021、M022",
          "requirement": "R033 P5（存在重新决定后），是否确由有权学校机关另发有效新决定；SRC-007待核、009；F029、F031–F032；M019、M021、M022；对复查意见与新决定分别验文号、签发人、对象、送达/生效；T=新的权威决定可证PASS_FACT；F=仅有委员会建议却标为“已改分/已撤销”CONFLICT；U=尚未形成NOT_APPLICABLE，应有但失联SOURCE_UNAVAILABLE；E0/E1；决定的法律效力及是否需要成绩更正另由对应机关确认；原作决定/依法有权重新作决定的学校机关。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "M021、M023",
          "requirement": "R034 P6 条件成立后，校外救济有真实受理/结果并与前序复查关联；SRC-009；F031–F033、F035；M021、M023；核省级教育行政部门或其他法定有权机关回执、文号、前序决定对应及时间；T=PASS_FACT；F=本地系统编造省级“复议成功”CONFLICT；U=外部源无法核验SOURCE_UNAVAILABLE；E0/E1；没有进入合法 P6 不触发；外部决定效力与起诉/其他救济方式由有权机关解释；外部真实决定机关的核验人员/校内负责接收的法规人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r035",
          "title": "PX（撤回表达已发生），撤回确为本人请求事实",
          "requirement": "R035 PX（撤回表达已发生），撤回确为本人请求事实；SRC-003、007待核；F002、F013、F022、F034–F035；M001、M024；核真正请求者、针对申请版与撤回收到时刻；T=本人请求事实PASS_FACT；F=冒名撤回CONFLICT；U=文件不可读UNREADABLE/权威身份失联SOURCE_UNAVAILABLE；E0/E3；本规则不判断撤回的法律效果，后者单独由 R039 核；学生本人/原受理机关收件人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r036",
          "title": "PX→P1/P4（重提），新申请版与旧案原结论及撤回版本关联正确",
          "requirement": "R036 PX→P1/P4（重提），新申请版与旧案原结论及撤回版本关联正确；SRC-001、003、007待核；F001、F013–F014、F022、F024、F034–F035；M001、M005、M014（若既有）、M024（若曾撤回）；对比同一争议主键、applicationRevision 与当前主张、旧申请/答复/撤回事件；T=版本链可核PASS_FACT；F=新附件覆盖旧签发结论CONFLICT；U=是否允许重提/次数期限POLICY_UNCONFIRMED；E0/E2/E3；再次提交不产生自动受理权；若只是补件则继续 PX，不创建新模板/新授权对象；原受理机关/学籍或申诉业务分流人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r037",
          "title": "M004、M016（条件）、M025",
          "requirement": "R037 P0–P6，确有 G50/S/T 或教师更正外部有权决定可供只读引用；SRC-011待取、001、013；F009–F011、F026、F029、F034、F036；M004、M016（条件）、M025；核跨模板决定 ID、签发主体、所属课程、被授权事项及有效版本；T=可核外部结论PASS_FACT；F=两个流程就同一原授权对象互相冒签CONFLICT；U=目录/决定源未获取POLICY_UNCONFIRMED或SOURCE_UNAVAILABLE；E0/E1；不同模板可核各自不同事实，但课程替代/缓考/处分/成绩更正的决定只在原授权 Owner 处作出，本模板绝不二次批准；G50/S/T 原有权签发者、集成目录 Owner、教务成绩引用人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r038",
          "title": "M014、M015、M018",
          "requirement": "R038 P4，针对普通成绩答复的继续复核渠道及独立复议权限有有效校本原文；SRC-003、007待核、008–009；F024–F025、F028、F035；M014、M015、M018；对照最新指南、申诉办法和实际决定类型核渠道/次数/期限/签发机关；T=明确授权该渠道PASS_FACT（仅渠道事实）；F=原文明确不适用此渠道NOT_APPLICABLE（该渠道）；U=未取原文POLICY_UNCONFIRMED；E1，高影响事项不能以外校惯例或上传的“复议成功”图片取代学校授权；普通答复不默认变正式处理决定；教务处制度归口/学校法规人员、真正有权渠道办理人。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r039",
          "title": "PX（已有真实撤回请求），学校依法确认撤回的法律/办理效力",
          "requirement": "R039 PX（已有真实撤回请求），学校依法确认撤回的法律/办理效力；SRC-003、007待核；F020、F022、F024、F034–F035；M011（若已受理）、M014（若已有答复）、M024；核申请阶段、原受理/签发机关、正式撤回确认及此前生效事件；T=权威机构确认效力PASS_FACT；F=学校拒绝或不同意此阶段撤回NEEDS_HUMAN_DECISION（记录真实答复）；U=规则不明POLICY_UNCONFIRMED、确认源失联SOURCE_UNAVAILABLE；E0/E1；请求不等于生效，已签发复核答复、成绩更正和处分历史只能由原有权机关按有效规范处理；原受理机关的有权经办/签发者。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
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
      "name": "P0 已公布",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "p1",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
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
      "name": "P2 校方受理与调取",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "p3",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "p3",
      "name": "P3 复核答复与可能更正",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "p4",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "p4",
      "name": "P4 复核后异议",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "p5",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "p5",
      "name": "P5 正式申诉/复查（条件）",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "p6",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "p6",
      "name": "P6 校外救济（条件）",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "px",
      "workflowOwner": "local",
      "skippableReason": "原稿将此情形标记为条件性/后续/跨阶段节点；此处仅为本地审查路由，不代表学校官方流程。"
    },
    {
      "id": "px",
      "name": "PX 补件/撤回/材料换版",
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
  "templateId": "S02-T06",
  "name": "学生发起的成绩复核、复核后异议及复议申请审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S02-T06.md",
  "sourceDocumentSha256": "705b707776df7a1feb306798b2ae593d21f8e89f198c77d657beb974cc26334c",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/S02-T06.md",
  "sourceOriginalSha256": "705b707776df7a1feb306798b2ae593d21f8e89f198c77d657beb974cc26334c",
  "sourceOriginalGitBlobSha": "d497308ad5e305cdfea703b2a7e10ef682d8a92f",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23",
  "implementationAsOf": "2026-10-24",
  "researchStatus": "RESEARCH_HANDOFF_READY_POLICY_OPEN",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceSummary": "本科成绩复核存在2019年校本依据，但现行修订、研究生普通课程复核及普通成绩答复是否属于正式申诉决定均未排他核验。",
  "relatedTemplateIds": [
    "S02-T01",
    "S02-T02",
    "S02-T03",
    "S02-T04",
    "S02-T05",
    "S02-T07",
    "S02-T08",
    "S02-T09",
    "S02-T10",
    "T01-T07",
    "T01-T08"
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "- 机构/标题：成都理工大学，《关于印发〈成都理工大学全日制普通本科学生学籍管理办法〉的通知》（成理校教〔2019〕18 号）及所附办法。",
      "url": "https://dbxb.cdut.edu.cn/__local/7/B6/E5/006AC04D88A214D1AD8B1F5E540_16B4A5B7_C543C.pdf",
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "id": "SRC-002",
      "title": "- 机构/标题：成都理工大学教务处，《[成绩]成都理工大学本专科学生成绩复核申请表》。",
      "url": "https://aao.cdut.edu.cn/info/1183/1489.htm",
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "id": "SRC-003",
      "title": "- 机构/标题：成都理工大学教务处首页“办事指南”栏目，《期末考试课程成绩复核的申请流程》。",
      "url": "https://aao.cdut.edu.cn/",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-004",
      "title": "- 机构/标题：成都理工大学教务处，教通字〔2026〕12 号，关于 2026 年延后进行毕业资格审查的文件。",
      "url": "https://aao.cdut.edu.cn/__local/1/51/2F/3AB8246C20E2DE116D38A24555F_41374FA6_6EC93.pdf",
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "id": "SRC-005",
      "title": "- 机构/标题：成都理工大学，《关于印发〈成都理工大学研究生学籍管理办法〉的通知》（成理校研〔2021〕13 号）。",
      "url": "https://dbxb.cdut.edu.cn/xxgkwz/info/1032/2549.htm",
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "id": "SRC-006",
      "title": "- 机构/标题：成都理工大学研究生院，《成都理工大学研究生课程成绩更正申请表》。",
      "url": "https://gra.cdut.edu.cn/search.jsp?currentnum=34&newskeycode2=&searchScope=0&wbtreeid=1001",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-007",
      "title": "- 机构/标题：成都理工大学，《成都理工大学学生申诉管理办法》；相关校内 PDF 指向成理校发〔2022〕24 号。",
      "url": "https://math.cdut.edu.cn/txgz/gzzd.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-008",
      "title": "- 机构/标题：成都理工大学，《成都理工大学章程》。",
      "url": "https://www.cdut.edu.cn/info/1366/7658.htm",
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "id": "SRC-009",
      "title": "- 机构/标题：教育部，《普通高等学校学生管理规定》（中华人民共和国教育部令第 41 号）。",
      "url": "https://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201702/t20170216_296385.html",
      "evidenceStatus": "GENERAL_RESEARCH"
    },
    {
      "id": "SRC-010",
      "title": "- 机构/标题：成都理工大学党委研究生工作部（研究生院），《成都理工大学关于2026年全国硕士研究生招生考试初试成绩查询和申请复核的通知》。",
      "url": "https://gra.cdut.edu.cn/info/1074/5693.htm",
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "id": "SRC-011",
      "title": "- 机构/标题：项目 R02 ST-CANDIDATE-MASTER-CATALOG-R02.md 与 ST-CATALOG-AUDIT-R02.md（已取得原件）；另有指定技术资料 Fuck-GH-Admin/cdut-studio-review-agent @ 7b6cdc843d26e926c0c63b8c51a451ff3925cfad 中 docs/design/review-agent/acceptance/d4-unifi",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-012",
      "title": "- 机构/标题：成都理工大学，《关于印发〈成都理工大学来华留学生违纪处分办法（试行）〉的通知》及附件。",
      "url": "https://dbxb.cdut.edu.cn/__local/6/CA/AE/792887D38D428A566BA2CA803D8_0118ABB5_764DA.pdf",
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "id": "SRC-013",
      "title": "- 机构/标题：成都理工大学，《成都理工大学本科课程教学基本规范》（成理校教〔2022〕11 号），由机电工程学院官网完整转载。",
      "url": "https://mee.cdut.edu.cn/info/1117/1944.htm",
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "id": "SRC-014",
      "title": "- 机构/标题：成都理工大学教务处，《科室设置》。",
      "url": "https://aao.cdut.edu.cn/jgsz/kssz.htm",
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "id": "SRC-015",
      "title": "- 机构/标题：成都理工大学，《成都理工大学研究生课程建设及课程管理办法（暂行）》；2026 年校内文书另援引《成都理工大学研究生课程教学管理办法》。",
      "url": "https://cnae.cdut.edu.cn/info/1040/1425.htm；新规标题线索：https://cnae.cdut.edu.cn/info/1062/3859.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-016",
      "title": "- 机构/标题：成都理工大学教务处，《教务处印章用印流程及时间》（包含自助成绩/学籍证明办理说明）。",
      "url": "https://aao.cdut.edu.cn/info/1224/3633.htm",
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
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r002",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r003",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r004",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r005",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r006",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r007",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r008",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r009",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r010",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r011",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r012",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r013",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r014",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r015",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r016",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r017",
      "sourceIds": [
        "SRC-013"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r018",
      "sourceIds": [
        "SRC-013"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r019",
      "sourceIds": [
        "SRC-013"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r020",
      "sourceIds": [
        "SRC-013"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r021",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r022",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r023",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r024",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r025",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r026",
      "sourceIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r027",
      "sourceIds": [
        "SRC-013"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r028",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r029",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r030",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r031",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r032",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r033",
      "sourceIds": [
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r034",
      "sourceIds": [
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r035",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r036",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "CONTENT_VERIFIED"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r037",
      "sourceIds": [
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r038",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r039",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const
