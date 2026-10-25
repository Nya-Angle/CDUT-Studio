import type { TemplateVersion } from '@profer/shared'

/** R02 local research definition; it is not a school-issued or school-approved template. */
export const templateVersion: TemplateVersion = {
  "templateId": "S02-T10",
  "version": 1,
  "schemaVersion": 2,
  "name": "学生体质健康测试免测、缓测与补测资格审核",
  "description": "本地研究模板 · 非校方正式模板。教育部2014年国家标准及2025年校内体测历史公告可核；2026年校内免测、缓测、补测流程、授权链和健康信息保留规则未确认。 仅用于事实预审、证据整理和人工待办；政策或权限未确认时不得自动批准或拒绝。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；来源为当前集成分支研究原件 S02-T10.md。研究来源 SRC 仅是来源索引，不是案卷材料 SourceRef。",
  "objectType": "person",
  "displayName": {
    "template": "{{f003}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "UUID/ID",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F001；来源/阶段/隐私/缺失处置：Case；A，C；Case权威聚合/建案回执；M003关联元数据；P1",
      "displayHint": "原稿字段编号 F001。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f002",
      "label": "不透明ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F002；来源/阶段/隐私/缺失处置：Student；A，C；学籍或可信学生目录；M001；P2",
      "displayHint": "原稿字段编号 F002。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f003",
      "label": "字符串",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F003；来源/阶段/隐私/缺失处置：Student；A，C；学籍登记姓名；M001；M004交叉；P2",
      "displayHint": "原稿字段编号 F003。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f004",
      "label": "认证主体ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F004；来源/阶段/隐私/缺失处置：Actor；A，C；Host可信登录会话；操作日志、M003；P2",
      "displayHint": "原稿字段编号 F004。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f005",
      "label": "授权ID/可空",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F005；来源/阶段/隐私/缺失处置：Actor；B，K；学校授权/代办服务；M021；P2",
      "displayHint": "原稿字段编号 F005。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f006",
      "label": "枚举",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F006；来源/阶段/隐私/缺失处置：Student；A，C；学籍权威登记；M001；P2",
      "displayHint": "原稿字段编号 F006。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f007",
      "label": "枚举",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F007；来源/阶段/隐私/缺失处置：Student；A，C；学籍权威登记；M001；P2",
      "displayHint": "原稿字段编号 F007。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f008",
      "label": "字符串/枚举",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F008；来源/阶段/隐私/缺失处置：Student；A，C；学籍和当期公告；M001/M002；P2",
      "displayHint": "原稿字段编号 F008。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f009",
      "label": "YYYY-YYYY",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F009；来源/阶段/隐私/缺失处置：TestTask；A，C；体测任务/官方通知；M002/M006；P1",
      "displayHint": "原稿字段编号 F009。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f010",
      "label": "ID/可空",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F010；来源/阶段/隐私/缺失处置：TestTask；A，C；体测主管系统；M006；P1",
      "displayHint": "原稿字段编号 F010。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f011",
      "label": "C01–C09",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F011；来源/阶段/隐私/缺失处置：Request；A，C；本人申请意图+核验数据；M003；P1",
      "displayHint": "原稿字段编号 F011。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f012",
      "label": "时间戳",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F012；来源/阶段/隐私/缺失处置：Request；B，C；系统接收/登记回执；M003；P1",
      "displayHint": "原稿字段编号 F012。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f013",
      "label": "文本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F013；来源/阶段/隐私/缺失处置：Request；B，C；本人陈述；M003；P2/P3",
      "displayHint": "原稿字段编号 F013。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f014",
      "label": "枚举/未知",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F014；来源/阶段/隐私/缺失处置：Request；B，K；本人陈述/专业结论；M003/M004；P3",
      "displayHint": "原稿字段编号 F014。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f015",
      "label": "项目列表/可空",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F015；来源/阶段/隐私/缺失处置：TestTask；B，K；本人申明+体测任务；M003/M006；P1",
      "displayHint": "原稿字段编号 F015。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f016",
      "label": "来源+版本ID",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F016；来源/阶段/隐私/缺失处置：Policy；A，C；校方当期正式通知；M002、SRC-001仅历史参照；P0",
      "displayHint": "原稿字段编号 F016。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f017",
      "label": "时间区间/可空",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F017；来源/阶段/隐私/缺失处置：Policy；A/E，U；当期政策/系统窗口；M002；P0",
      "displayHint": "原稿字段编号 F017。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f018",
      "label": "姓名/证号映射",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F018；来源/阶段/隐私/缺失处置：MedicalEvidence；C，K；医院原件与学籍交叉；M004；P3",
      "displayHint": "原稿字段编号 F018。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f019",
      "label": "机构信息",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F019；来源/阶段/隐私/缺失处置：MedicalEvidence；C，K；医疗文书印章/可核验渠道；M004；P3",
      "displayHint": "原稿字段编号 F019。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f020",
      "label": "日期",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F020；来源/阶段/隐私/缺失处置：MedicalEvidence；C，K；医疗文书原件；M004；P3",
      "displayHint": "原稿字段编号 F020。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f021",
      "label": "时间范围/可空",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F021；来源/阶段/隐私/缺失处置：MedicalEvidence；C，K；医疗证明文字、医师核对；M004/M005；P3",
      "displayHint": "原稿字段编号 F021。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f022",
      "label": "受限结构化文本",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F022；来源/阶段/隐私/缺失处置：MedicalEvidence；C，K；医疗机构原始证明；M004/M005；P3",
      "displayHint": "原稿字段编号 F022。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f023",
      "label": "未核/已核/冲突",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F023；来源/阶段/隐私/缺失处置：MedicalEvidence；C/E，K；医院/校医院真伪核验；M004/M008；P3",
      "displayHint": "原稿字段编号 F023。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f024",
      "label": "回执ID/可空",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F024；来源/阶段/隐私/缺失处置：MedicalReview；E，L；校医院真实回执；M008；P3",
      "displayHint": "原稿字段编号 F024。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f025",
      "label": "结论+范围/可空",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F025；来源/阶段/隐私/缺失处置：MedicalReview；E，L；校医院真实签发；M008；P3",
      "displayHint": "原稿字段编号 F025。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f026",
      "label": "授权主体ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F026；来源/阶段/隐私/缺失处置：SchoolReview；E，L；校方审批系统、岗位授权；M009；P2",
      "displayHint": "原稿字段编号 F026。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f027",
      "label": "ID+状态+版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F027；来源/阶段/隐私/缺失处置：SchoolReview；E/F，L；校方核准记录；M009；P2/P3",
      "displayHint": "原稿字段编号 F027。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f028",
      "label": "事件ID/状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F028；来源/阶段/隐私/缺失处置：SchoolReview；F，L；体测系统操作日志；M010；P2",
      "displayHint": "原稿字段编号 F028。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f029",
      "label": "记录ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F029；来源/阶段/隐私/缺失处置：TestResult；A/E，K；体测系统；M006/M011；P2",
      "displayHint": "原稿字段编号 F029。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f030",
      "label": "分值/等级/可空",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F030；来源/阶段/隐私/缺失处置：TestResult；A/E，K；体测系统成绩；M011；P2",
      "displayHint": "原稿字段编号 F030。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f031",
      "label": "测试/更新时点",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F031；来源/阶段/隐私/缺失处置：TestResult；A/E，K；体测系统时间戳；M011；P2",
      "displayHint": "原稿字段编号 F031。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f032",
      "label": "缓测决定ID/状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F032；来源/阶段/隐私/缺失处置：TestResult；E，K；官方缓测记录；M012；P2",
      "displayHint": "原稿字段编号 F032。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f033",
      "label": "排期/资格回执ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F033；来源/阶段/隐私/缺失处置：TestTask；E/F，L；体育/体测主管系统；M013；P2",
      "displayHint": "原稿字段编号 F033。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f034",
      "label": "历史年度+状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F034；来源/阶段/隐私/缺失处置：TestResult；A/E，K；历史体测记录；M014；P2",
      "displayHint": "原稿字段编号 F034。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f035",
      "label": "现场记录ID/可空",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F035；来源/阶段/隐私/缺失处置：TestTask；现场，K；现场工作人员/医务人员；M015；P3",
      "displayHint": "原稿字段编号 F035。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f036",
      "label": "补件/修改/撤回",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F036；来源/阶段/隐私/缺失处置：Change；G，K；经认证意向与官方受理；M016；P2",
      "displayHint": "原稿字段编号 F036。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f037",
      "label": "旧版本ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F037；来源/阶段/隐私/缺失处置：Change；G，K；案卷版本档；M017；P1/P2",
      "displayHint": "原稿字段编号 F037。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f038",
      "label": "决定/成绩ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F038；来源/阶段/隐私/缺失处置：Appeal；G，K；被争议权威记录；M018；P2",
      "displayHint": "原稿字段编号 F038。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f039",
      "label": "文本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F039；来源/阶段/隐私/缺失处置：Appeal；G，K；本人异议陈述；M019；P2/P3",
      "displayHint": "原稿字段编号 F039。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f040",
      "label": "结果ID/可空",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F040；来源/阶段/隐私/缺失处置：Appeal；G，L；有权复核机构；M020；P2",
      "displayHint": "原稿字段编号 F040。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f041",
      "label": "外部业务决定ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F041；来源/阶段/隐私/缺失处置：Dependency；C/E，K；G50/S/T权威输出；M022；P2/P3",
      "displayHint": "原稿字段编号 F041。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f042",
      "label": "sha256+修订序号",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": true,
      "extractionHint": "原稿字段 F042；来源/阶段/隐私/缺失处置：Evidence；B/G，C；不可变文件存储/受控上传；每份 M003–M022 元数据；P1",
      "displayHint": "原稿字段编号 F042。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f043",
      "label": "可达/不可达/滞后",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F043；来源/阶段/隐私/缺失处置：Evidence；C/E，C；来源查询日志；各 M 的来源状态；P1",
      "displayHint": "原稿字段编号 F043。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f044",
      "label": "时间戳/可空",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F044；来源/阶段/隐私/缺失处置：SchoolReview；E/F，L；签署决定/校方系统；M009；P2",
      "displayHint": "原稿字段编号 F044。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    },
    {
      "key": "f045",
      "label": "机关/时限配置/未知",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "readOnly": false,
      "extractionHint": "原稿字段 F045；来源/阶段/隐私/缺失处置：Policy；G，U；当期校方申诉规定；M002/M018；P0",
      "displayHint": "原稿字段编号 F045。缺失、未知与 false 必须区分；学生自报或前端传值不得自动升级为校方权威事实。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "权威学籍快照/认证关联",
      "purpose": "权威学籍快照/认证关联；C：所有情形身份核验；不是身份证复印件必传；可信学籍查询回执或有权工作人员核实；F002–F008；SRC-002；指定本人、查询时点、学籍版；系统不可达 SOURCE_UNAVAILABLE，姓名冲突 CONFLICT；不强制学生重复上传",
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
        "权威学籍快照/认证关联；C：所有情形身份核验；不是身份证复印件必传；可信学籍查询回执或有权工作人员核实；F002–F008；SRC-002；指定本人、查询时点、学籍版；系统不可达 SOURCE_UNAVAILABLE，姓名冲突 CONFLICT；不强制学生重复上传"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "当期有发布日期/适用范围的官方公告或内部授权制度",
      "purpose": "当期有发布日期/适用范围的官方公告或内部授权制度；C/U：判断是否有窗口；2026本校版本尚未取得；主管部门正式书面答复/校内权威通知；F008–F010/F016/F017/F045；SRC-001/004/005；绑定发布者、版本、年度；只找到2025内容为 POLICY_UNCONFIRMED，不得要求学生上传政策",
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
        "当期有发布日期/适用范围的官方公告或内部授权制度；C/U：判断是否有窗口；2026本校版本尚未取得；主管部门正式书面答复/校内权威通知；F008–F010/F016/F017/F045；SRC-001/004/005；绑定发布者、版本、年度；只找到2025内容为 POLICY_UNCONFIRMED，不得要求学生上传政策"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "表单/体适能APP受理记录或受控线下登记",
      "purpose": "表单/体适能APP受理记录或受控线下登记；C：申请型C01/C02/C07/C08；C03–C05如无需再申请，则可由系统资格事件代替；官方系统操作回执；F001/F004/F011–F015/F036/F042；SRC-001/005；同人同学年同意向版本；草稿未正式提交不可声称已受理；不可读/缺关键意向则 NEEDS_MATERIAL",
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
        "表单/体适能APP受理记录或受控线下登记；C：申请型C01/C02/C07/C08；C03–C05如无需再申请，则可由系统资格事件代替；官方系统操作回执；F001/F004/F011–F015/F036/F042；SRC-001/005；同人同学年同意向版本；草稿未正式提交不可声称已受理；不可读/缺关键意向则 NEEDS_MATERIAL"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "原件/清晰电子签章文书、可回查医疗证明",
      "purpose": "原件/清晰电子签章文书、可回查医疗证明；K：C01；C02/C06是否强制另需校本规则；不对C03–C05强制；校医院能依法核实的医疗回执/等效医疗证明（具体等效条件U）；F003/F014/F018–F023/F042；SRC-001/005/006；对应本人、签发日期、健康限制与申请年度；缺失 NEEDS_MATERIAL（限已确认需要的C01），不可读 UNREADABLE，来源真假不明需人工",
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
        "原件/清晰电子签章文书、可回查医疗证明；K：C01；C02/C06是否强制另需校本规则；不对C03–C05强制；校医院能依法核实的医疗回执/等效医疗证明（具体等效条件U）；F003/F014/F018–F023/F042；SRC-001/005/006；对应本人、签发日期、健康限制与申请年度；缺失 NEEDS_MATERIAL（限已确认需要的C01），不可读 UNREADABLE，来源真假不明需人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "病历、检查报告、必要摘录",
      "purpose": "病历、检查报告、必要摘录；K/U：只有当校医院或本校明示需要、且最小必要时；医疗机构出具的必要结论/校医院核验代替全量病历；F021/F022/F023；SRC-001/006；多页顺序、诊断对应与版本须保留；无校本依据不得要求每人提交完整病历；不清可要求针对页",
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
        "病历、检查报告、必要摘录；K/U：只有当校医院或本校明示需要、且最小必要时；医疗机构出具的必要结论/校医院核验代替全量病历；F021/F022/F023；SRC-001/006；多页顺序、诊断对应与版本须保留；无校本依据不得要求每人提交完整病历；不清可要求针对页"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "测试任务/预约/现场签到的权威记录",
      "purpose": "测试任务/预约/现场签到的权威记录；C：需定位批次的C01–C06；某些后续场次可尚未产生；有权工作人员的年度任务回执；F009/F010/F015/F029；SRC-001/003；绑定年度、项目、班级/批次；查询不可达 SOURCE_UNAVAILABLE，不以报名截图自动确认",
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
        "测试任务/预约/现场签到的权威记录；C：需定位批次的C01–C06；某些后续场次可尚未产生；有权工作人员的年度任务回执；F009/F010/F015/F029；SRC-001/003；绑定年度、项目、班级/批次；查询不可达 SOURCE_UNAVAILABLE，不以报名截图自动确认"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "学校正式表单/已在APP结构化填写的等效记录",
      "purpose": "学校正式表单/已在APP结构化填写的等效记录；K/U：需取得本校表单/等效规定后才能要求；当期校方认定的APP电子记录；F011–F015/F022；SRC-004/006/009；国家样表非成都理工大学专用表；缺本校表不能退回学生；若本校确要求且缺件再 NEEDS_MATERIAL",
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
        "学校正式表单/已在APP结构化填写的等效记录；K/U：需取得本校表单/等效规定后才能要求；当期校方认定的APP电子记录；F011–F015/F022；SRC-004/006/009；国家样表非成都理工大学专用表；缺本校表不能退回学生；若本校确要求且缺件再 NEEDS_MATERIAL"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "机构签发决定/受控回执",
      "purpose": "机构签发决定/受控回执；L：C01经医学审核后；并非申请时必填；校医院真签章或可信核验结果；F023–F025；SRC-001；校医院人员、签发时间、申请材料版本；尚未审核“待审核”，来源失联 SOURCE_UNAVAILABLE，拒收无效学生自拟件",
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
        "机构签发决定/受控回执；L：C01经医学审核后；并非申请时必填；校医院真签章或可信核验结果；F023–F025；SRC-001；校医院人员、签发时间、申请材料版本；尚未审核“待审核”，来源失联 SOURCE_UNAVAILABLE，拒收无效学生自拟件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "签发决定/官方审批日志",
      "purpose": "签发决定/官方审批日志；L：C01、C02、特殊补测等实际需审批时；官方授权审批操作/签章回执；F026/F027/F044；SRC-003/005/006；记录签发身份、权限、批准范围与有效年度；未核准 NEEDS_HUMAN_DECISION，不得系统自动填“通过”",
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
        "签发决定/官方审批日志；L：C01、C02、特殊补测等实际需审批时；官方授权审批操作/签章回执；F026/F027/F044；SRC-003/005/006；记录签发身份、权限、批准范围与有效年度；未核准 NEEDS_HUMAN_DECISION，不得系统自动填“通过”"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "权威系统确认日志",
      "purpose": "权威系统确认日志；L：核准后可能出现；不等于 M009；有权部门核实的系统状态证明；F028；SRC-001；绑定对应决定和系统账户、操作时间；未同步与拒绝需区分，缺失 SOURCE_UNAVAILABLE",
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
        "权威系统确认日志；L：核准后可能出现；不等于 M009；有权部门核实的系统状态证明；F028；SRC-001；绑定对应决定和系统账户、操作时间；未同步与拒绝需区分，缺失 SOURCE_UNAVAILABLE"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "官方测评记录与同步时间",
      "purpose": "官方测评记录与同步时间；K/C：C03的关键事实；C08涉及成绩时；体测中心出具可验证的成绩回执；F029–F031；SRC-001/006；同人同年同项目；缺分数不可单靠学生截图赋不及格，可能处于数据延迟",
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
        "官方测评记录与同步时间；K/C：C03的关键事实；C08涉及成绩时；体测中心出具可验证的成绩回执；F029–F031；SRC-001/006；同人同年同项目；缺分数不可单靠学生截图赋不及格，可能处于数据延迟"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "缓测登记/有权决定记录",
      "purpose": "缓测登记/有权决定记录；K/C：C04转补测的前置状态；C02的后续 L；真实缓测批准或确认回执；F032；SRC-001/005；关联原申请及有效年度；只有本人声称缓测时 CONFLICT/待核，不自动授予补测",
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
        "缓测登记/有权决定记录；K/C：C04转补测的前置状态；C02的后续 L；真实缓测批准或确认回执；F032；SRC-001/005；关联原申请及有效年度；只有本人声称缓测时 CONFLICT/待核，不自动授予补测"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "官方补测名单/预约/通知",
      "purpose": "官方补测名单/预约/通知；L：C03–C05决定/排期后；有权体测中心受理回执；F017/F033；SRC-001/006；绑定学年、补测轮次、地点时间；不在初次申请强索，排期未发布则等待官方",
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
        "官方补测名单/预约/通知；L：C03–C05决定/排期后；有权体测中心受理回执；F017/F033；SRC-001/006；绑定学年、补测轮次、地点时间；不在初次申请强索，排期未发布则等待官方"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "历史记录、年度映射/缺项状态",
      "purpose": "历史记录、年度映射/缺项状态；K/C：C05；有权工作人员查验的历史年度证明；F009/F034；SRC-001；身份、原学年与实际补测学年两键并存；无后台记录不得因学生回忆直接确认",
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
        "历史记录、年度映射/缺项状态；K/C：C05；有权工作人员查验的历史年度证明；F009/F034；SRC-001；身份、原学年与实际补测学年两键并存；无后台记录不得因学生回忆直接确认"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "事件登记或后补官方证明",
      "purpose": "事件登记或后补官方证明；K/L：C06事件发生后可产生，不是中止动作的前提；现场工作人员事实确认/可核回执；F035；SRC-001 Q3；含时刻、项目、现场人、学生；危急事件先停测，事后记录缺失转人工，不要求继续跑完",
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
        "事件登记或后补官方证明；K/L：C06事件发生后可产生，不是中止动作的前提；现场工作人员事实确认/可核回执；F035；SRC-001 Q3；含时刻、项目、现场人、学生；危急事件先停测，事后记录缺失转人工，不要求继续跑完"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "新提交版本和理由",
      "purpose": "新提交版本和理由；K/C：C07；经授权、留痕的原系统变更意向；F004/F036/F042；SRC-002仅一般程序背景；指向原案及新旧材料；学校是否接受撤回未知；不能删旧版与假称生效",
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
        "新提交版本和理由；K/C：C07；经授权、留痕的原系统变更意向；F004/F036/F042；SRC-002仅一般程序背景；指向原案及新旧材料；学校是否接受撤回未知；不能删旧版与假称生效"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "不可变审查快照",
      "purpose": "不可变审查快照；K/C：C07及涉及材料替换的复审；原案权威版本历史；F001/F037/F042；无单独校本SRC（设计约束）；必须保持可追溯、标旧结论失效范围；丢失版本阻断覆盖写、人工恢复",
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
        "不可变审查快照；K/C：C07及涉及材料替换的复审；原案权威版本历史；F001/F037/F042；无单独校本SRC（设计约束）；必须保持可追溯、标旧结论失效范围；丢失版本阻断覆盖写、人工恢复"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "正式决定书或有效官方状态",
      "purpose": "正式决定书或有效官方状态；K/C：C08；官方系统记录及可核验回执；F027/F030/F038；SRC-002；争议对象、时点、签发人确切；只有截图且不可核验则提示来源问题",
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
        "正式决定书或有效官方状态；K/C：C08；官方系统记录及可核验回执；F027/F030/F038；SRC-002；争议对象、时点、签发人确切；只有截图且不可核验则提示来源问题"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "意向/申请文本及现有证明",
      "purpose": "意向/申请文本及现有证明；K/C：C08；有权校方受理的表单或实名登记；F039/F045；SRC-002第59条仅一般框架；记录是否已受理和申请时点；不能把本地提交等同学校复核立案",
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
        "意向/申请文本及现有证明；K/C：C08；有权校方受理的表单或实名登记；F039/F045；SRC-002第59条仅一般框架；记录是否已受理和申请时点；不能把本地提交等同学校复核立案"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "决定或复核回执",
      "purpose": "决定或复核回执；L：C08进入正式程序并结束后；可核验校方签发件；F040；SRC-002；必须带机关、时间、对象与决定版本；未产生不得要求首次上传",
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
        "决定或复核回执；L：C08进入正式程序并结束后；可核验校方签发件；F040；SRC-002；必须带机关、时间、对象与决定版本；未产生不得要求首次上传"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "授权系统记录、有效委托证明",
      "purpose": "授权系统记录、有效委托证明；K：仅非本人代理时；校方认可的代理权限核验；F004/F005；目前无体测专项SRC；委托人、代理人、范围、时间；无权不得代提交，不能将自传授权书直接当校方确认",
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
        "授权系统记录、有效委托证明；K：仅非本人代理时；校方认可的代理权限核验；F004/F005；目前无体测专项SRC；委托人、代理人、范围、时间；无权不得代提交，不能将自传授权书直接当校方确认"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "课程保健课、学籍变化、正式复核等记录",
      "purpose": "课程保健课、学籍变化、正式复核等记录；K：必要时作前置事实，不是C01–C06通用必传；具有签发权限的原业务记录；F041；SRC-002/008；需校验决策对象、人员、学年、版本；G50目录未取得，不得推定同目的互认；缺则按具体依赖人工",
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
        "课程保健课、学籍变化、正式复核等记录；K：必要时作前置事实，不是C01–C06通用必传；具有签发权限的原业务记录；F041；SRC-002/008；需校验决策对象、人员、学年、版本；G50目录未取得，不得推定同目的互认；缺则按具体依赖人工"
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
          "title": "国家体质测试对象路由",
          "requirement": "R001 国家体质测试对象路由；A；T 请求针对《标准》测试C01–C09；F 明确只涉及体育课程/招生/普通考试；U 名称含混；对比真实测试任务、请求目的、课程决定对象；不得按“体育免修”模糊匹配；年度内核；SRC-001/SRC-002/SRC-005；F009/F011/F013/F015；M003/M006/M022；T→PASS_FACT进入本案事实核查；F→NOT_APPLICABLE并建议邻接路由；U→NEEDS_HUMAN_DECISION，体育主管/路由人员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "学生身份、学段、在籍与任务对象",
          "requirement": "R002 学生身份、学段、在籍与任务对象；A/C；T可信学籍匹配当年对象；F权威记录证实非该学生/不在适用范围；U学籍无法查询/政策学段不清；学籍主数据优于自填姓名；不同校区/学段只按被核实的当期范围判；合法更名须权威映射；SRC-001/SRC-002/SRC-005；F002/F003/F006/F007/F008/F009；M001/M002；T→PASS_FACT；F→身份冲突为CONFLICT或明确不属对象为NOT_APPLICABLE；U→SOURCE_UNAVAILABLE或POLICY_UNCONFIRMED，学籍管理员/体育主管。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "本人操作与真实代理权",
          "requirement": "R003 本人操作与真实代理权；A/B/G；T可信认证本人或权限内有效代理；F非本人且无有效授权；U认证/授权来源失联；Host/Main真实登录态和授权范围优于前端 role/上传委托截图；按提交时授权有效期；SRC-001/SRC-002（体测专项代理未核）；F002/F004/F005/F012；M003/M021；T→PASS_FACT；F→NEEDS_HUMAN_DECISION且阻断代提交；U→SOURCE_UNAVAILABLE，可信身份服务/校方授权管理员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "当期年度、项目和批次可定位",
          "requirement": "R004 当期年度、项目和批次可定位；A/C；T官方体测任务关联本人、年度、项目；F记录显示其他年度/对象；U任务尚未发布或接口不可达；M006优于用户预约截图，记录版本与时区；某些后续补测场次尚未形成可为正常时序；SRC-001/SRC-003/SRC-005；F009/F010/F015/F029/F043；M001/M006；T→PASS_FACT；F→CONFLICT；U→SOURCE_UNAVAILABLE（已存在源不可达）/NEEDS_HUMAN_DECISION（未来待排），体育/体测管理员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "当前政策、窗口、适用对象及来源效力",
          "requirement": "R005 当前政策、窗口、适用对象及来源效力；A/E/G；T有同校同学年/校区正式有效规定；F只有2025公告或外校表单；U本校新规尚未取得/版次不明；核公布者、文号、适用年、发布日期、生效/废止与公告时间段；SRC-010仅否定迁移，不能供本校配置；2025不能判2026逾期；SRC-001/SRC-004/SRC-005/SRC-007/SRC-010；F007/F008/F009/F016/F017/F043/F045；M002；T→PASS_FACT（仅政策可用事实）；F/U→POLICY_UNCONFIRMED，体育主管/政策维护人员；不自动否决申请。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "申请意向、请求类别及真实提交时点",
          "requirement": "R006 申请意向、请求类别及真实提交时点；B/C；T当前情形确需申请且有明确本人意向/受理回执；FC03–C05由系统自动名单办理、经核无另填义务；U应提交的内容缺失/是否需申请未知；F012正式收件时间由受理系统赋值；草稿时间不是学校收件；只问必要事实，不生成诊断；SRC-001/SRC-005；F001/F011/F012/F013/F014/F015/F042；M003；T→PASS_FACT；F→NOT_APPLICABLE；U→明确需学生陈述但缺时NEEDS_MATERIAL、政策未知时POLICY_UNCONFIRMED，学生/受理岗。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "免测核心医学证明是否具备、可读取",
          "requirement": "R007 免测核心医学证明是否具备、可读取；B/C，C01；TC01且已提交完整可读M004；F非C01且校本规则不要求证明；UC01缺件或文件损坏/字迹不可辨、2026材料义务不明；校医院可合法调取等效回执则不重复上传；C02/C06证明是否必需不得由模型指定；2025医院证明要求不能单独形成2026退件依据；SRC-001/SRC-005/SRC-006；F014/F018/F020/F022/F042；M003/M004；T→PASS_FACT（仅收到可读件）；F→NOT_APPLICABLE；U→当期确认必交而缺件NEEDS_MATERIAL、已有但不可读UNREADABLE、当期义务未知POLICY_UNCONFIRMED，学生/校医院/政策Owner。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "医学材料同人归属与目标学年/项目",
          "requirement": "R008 医学材料同人归属与目标学年/项目；C，健康分支；T证明对象和体测任务有可信对应；F权威身份与证明对应另一人/年度；U曾用名/部分身份信息无法确认；M001为本人权威主记录，M004是医学原件；不得裸姓名或 OCR 模糊匹配；医学敏感字段仅最小比对；SRC-001/SRC-005；F002/F003/F009/F015/F018；M001/M004/M006；T→PASS_FACT；F→CONFLICT；U→NEEDS_HUMAN_DECISION，学籍管理与校医院授权核验员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "医学证明的签发日、限制时段与申请时点",
          "requirement": "R009 医学证明的签发日、限制时段与申请时点；C；T有明确可读时段且与目标期间事实对应；F证明与目标期间明确不重叠；U未写清时效/本校有效期门槛未知；比较F020/F021与F009/F017，但不虚构“X日内诊断”；真实疾病适格由医务人员判断；SRC-001/SRC-005/SRC-006；F009/F017/F020/F021/F022；M002/M004/M005；T→PASS_FACT（时间对应事实）；F→CONFLICT并请医务核实；U→NEEDS_HUMAN_DECISION或政策门槛不明POLICY_UNCONFIRMED，校医院/体育主管。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "医疗证明来源真实性和医学适宜性",
          "requirement": "R010 医疗证明来源真实性和医学适宜性；C/E；T校医院通过有权方式核实签发机构和相关医学事实；F医学权威认定证明不实/不适用；U仅有图片或OCR、未鉴真；核医疗单位、签章/回执、范围及医务审查，医学判断不能由模板或非医务人员做；医院资质等级需本校政策；SRC-001/SRC-005/SRC-006；F019/F022/F023/F024；M004/M005/M008；T→PASS_FACT（只核已存在的医务核验）；F→CONFLICT并人工处理；U→NEEDS_HUMAN_DECISION，校医院；源失联SOURCE_UNAVAILABLE。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "附加病历、样表及单项/全项条件",
          "requirement": "R011 附加病历、样表及单项/全项条件；C，条件K；T取得2026本校明确要求，且该人触发特定M005/M007；F无此要求或与申请无关；U只有国家样表或外校清单；先做最小数据必要性核实；M007不能因国家样表存在就变强制；单项免测与全项免测不得自行推定；SRC-001/SRC-004/SRC-006/SRC-009/SRC-010；F014/F015/F021/F022/F016；M002/M005/M007；T→材料齐可核PASS_FACT、确需但缺NEEDS_MATERIAL；F→NOT_APPLICABLE；U→POLICY_UNCONFIRMED，体育主管/校医院。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "校医院医学审核签发的独立性",
          "requirement": "R012 校医院医学审核签发的独立性；E，L；T免测医学审核阶段已发生且真实回执绑定申请证据版；F未进入医学审核阶段；U应已审核但无法见权威回执；M008是校医院独立行为，不能把医院原件M004或学生上传的“医院通过”截图替代；核真实签发人、时点、关联版本；SRC-001/SRC-005；F023/F024/F025/F042；M004/M008；T→PASS_FACT（已核回执事实）；F→NOT_APPLICABLE（仍处早期）；U→SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION，校医院。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "体育主管/体测审批的授权与决定",
          "requirement": "R013 体育主管/体测审批的授权与决定；E，L；T已进入有权决定阶段且校方真实签发决定与目标一致；F还处受理/医学审查或该子类型不需独立书面批准；U签发岗位、权限链或决定效力无法核实；比较M009岗位授权、签发人、学生、年、事项、申请证据版本、生效时点；2014国家原则与2025管理员操作需核权限边界；SRC-001/SRC-003/SRC-005/SRC-006；F026/F027/F044/F042；M008/M009；T→PASS_FACT（仅已存在正式决定的真实性，不新批准）；F→NOT_APPLICABLE；U→NEEDS_HUMAN_DECISION（待校方作决定）或SOURCE_UNAVAILABLE，体育主管授权审批岗。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "体测系统确认与正式决定一致",
          "requirement": "R014 体测系统确认与正式决定一致；F，L；T存在应同步的有效决定且操作日志同人同年同范围；F尚未进入同步或本分支无需系统确认；U已决定但日志不存在/系统失联；M010只证同步，不倒推M009授权；不将“未同步”解释为“拒绝”；校验时间序列和决定ID；SRC-001/SRC-003；F027/F028/F044/F043；M009/M010；T→PASS_FACT；F→NOT_APPLICABLE；U→SOURCE_UNAVAILABLE并待管理员核对，体测系统管理员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "原始成绩来源、本人学年/项目归属",
          "requirement": "R015 原始成绩来源、本人学年/项目归属；A/C，C03；TC03且官方测评成绩可追溯；F非不及格补测分支；U无正式成绩或仅截图/同步滞后；M011为权威记录，读取分数、评定等级、更新时间，不改变数据；电子同步滞后须标源状态；SRC-001/SRC-006；F009/F010/F029/F030/F031/F043；M006/M011；T→PASS_FACT；F→NOT_APPLICABLE；U→SOURCE_UNAVAILABLE，体测成绩管理员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "当学年未通过是否触发补测条件",
          "requirement": "R016 当学年未通过是否触发补测条件；C/E，C03；T官方原始结果按适用政策显示该年不合格；F权威记录明确已合格；U分数/政策等级适用不明；优先采用有权体测系统的官方合格标识；上位“一次补测”不得替代当期具体安排；避免客户端自行以不确定阈值换算；SRC-001/SRC-004/SRC-006；F009/F016/F017/F030/F031；M002/M011；T→PASS_FACT（资格触发事实）；F→NOT_APPLICABLE于C03，疑义转成绩权威更正；U→POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE，体测中心。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "已准缓测的原状态和有效期",
          "requirement": "R017 已准缓测的原状态和有效期；C/E，C04；TC04且权威缓测记录有效、同人同年；F没有缓测资格但仅本人自称；U后台记录无法读取；先查M012原审批/状态；初次C02尚未产生M012时本规则不触发，绝不要求重新证明病情；SRC-001/SRC-005；F009/F010/F032/F043；M002/M012；T→PASS_FACT；F→CONFLICT并转原办理机关核实；U→SOURCE_UNAVAILABLE，体测主管部门。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "历史缺测事实、原学年与补测学年映射",
          "requirement": "R018 历史缺测事实、原学年与补测学年映射；C/E，C05；T经权威历史记录证实且该年度存在相应办理范围；F原年已有成绩或学年不符；U历史库失联/只有2025毕业季旧政策；原年度F034与补测执行年度F009双键；2025大四补大二/大三只是该年场景，不能用于2026任意年度；SRC-001/SRC-002；F002/F009/F016/F017/F034/F043；M001/M002/M014；T→PASS_FACT（历史事实及适用依据均真）；F→CONFLICT；U→SOURCE_UNAVAILABLE或POLICY_UNCONFIRMED，体测档案管理员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "官方补测名单/场次的真实性",
          "requirement": "R019 官方补测名单/场次的真实性；E/F，L，C03–C05；T已公布/签发名单且真实同人同年同轮次；F资格尚在审核或排期未生成；U声称已排期但官方源不可达；排期属主管机关后续产物，不能从成绩自动生成有效考位；比对原状态、项目、地点和场次版本；SRC-001/SRC-006；F009/F010/F017/F033/F043；M006/M011/M012/M013/M014（按C03/04/05选相应原事实）；T→PASS_FACT（排期存在事实）；F→NOT_APPLICABLE于前阶段；U→SOURCE_UNAVAILABLE或待排NEEDS_HUMAN_DECISION，体育/体测管理员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "现场不适中止及事后记录",
          "requirement": "R020 现场不适中止及事后记录；现场→C/G，C06；T发生不适或紧急情况须先安全中止；F没有现场异常且仅普通申请；U事后事件记录不明；立即停止并寻求现场医护，不等待任何M；安全处置后核对时间、测试项目、实际人员记录M015；是否转缓测须另由有权校方决定；SRC-001/SRC-005；F009/F010/F014/F035；M006/M015；T→即时停止并由现场医护处置，待真实事件记录确认时本条PASS_FACT；记录仍待医学核定时本条NEEDS_HUMAN_DECISION；F→NOT_APPLICABLE；U→NEEDS_HUMAN_DECISION，现场工作人员/医护；每次仅输出其中一个码。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "旧案定位与重复申请识别",
          "requirement": "R021 旧案定位与重复申请识别；B/G；T新旧同一学生、学年、目的且版本关系可定；F不涉及旧案；U同条件疑似重复但旧案找不到；不以同名合并；比case_id、请求时间、版本及旧案目标；重复可为新一次合法申请，不能自动认定违规；SRC-001/SRC-002（程序背景，具体重复规则未证）；F001/F002/F009/F011/F012/F037/F042；M003/M017；T→PASS_FACT（版本关系事实）；F→NOT_APPLICABLE；U→SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION，案卷管理员/体育受理岗。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "补件/更正/撤回的提出人与请求归属",
          "requirement": "R022 补件/更正/撤回的提出人与请求归属；G，C07；T本人或核权代理对明确原案发起变更意向；F无变更行为；U操作者不可信或撤回生效规则未知；M016只证明“提出请求”，不构成校方接受撤回；已生效决定须经原有权单位处理，不可客户侧删除；SRC-001/SRC-002（专项撤回未知）；F001/F004/F005/F036/F037/F042；M016/M017/M021；T→PASS_FACT（意向已登记）；F→NOT_APPLICABLE；U→授权不明NEEDS_HUMAN_DECISION、撤回是否可办POLICY_UNCONFIRMED，学生/校方受理岗。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "证据更换后依赖结论失效与定向重审",
          "requirement": "R023 证据更换后依赖结论失效与定向重审；D/G；T替换/更正了有版本的被引用M/F；F仅界面展示更改而证据源未变；U旧材料版本或依赖快照丢失；原散列、签发、旧规则运行记录不可覆盖；只置受影响规则STALE并重跑；若M008/M009引用旧版，只请求原签发者决定是否重开，不撤销正式决定；SRC-001/SRC-002（版本管理设计而非校规）；F001/F037/F042/F027；M004/M008/M009/M016/M017；T→完成失效标记事实PASS_FACT，正式决定变化仍NEEDS_HUMAN_DECISION；F→NOT_APPLICABLE；U→SOURCE_UNAVAILABLE，案卷维护/校医院/体育审批岗。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "异议目标、性质、申请人及受理路径",
          "requirement": "R024 异议目标、性质、申请人及受理路径；G，C08；T指向可核正式体测决定/官方成绩并有异议理由；F争议的只是普通课程成绩/其他业务；U真实目标记录缺失或体测专项渠道未知；SRC-002第59条为一般申诉线索，不导入课程成绩复核期限；按被争议决定类型把成绩更正交原数据Owner，不自称申诉机关；SRC-002/SRC-005；F002/F004/F038/F039/F045/F043；M001/M018/M019/M022；T→PASS_FACT（异议意向完整）；F→NOT_APPLICABLE转邻接业务；U→SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED，有权体测受理/学校申诉机构待核。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "复核结果的真实签发、效力和后续同步",
          "requirement": "R025 复核结果的真实签发、效力和后续同步；G→F，L；T有权机关已正式给出与原争议同目标的复核结果；F尚无正式受理/决定阶段；U仅口头结论、回执无法核；查签发人、机关、对象、时间、原决定版本；不能自动撤销旧决定或自行改分，必要时向体测系统发待办；SRC-002/SRC-003（专项渠道未知）；F027/F038/F040/F044；M018/M019/M020；T→PASS_FACT（外部结论存在）；F→NOT_APPLICABLE于未结阶段；U→SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION，正式复核机关及体测管理员。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "G50/S/T前置决定的只读引用与去重",
          "requirement": "R026 G50/S/T前置决定的只读引用与去重；A/C/G；T确有某邻接授权结果与该案相关且签发可核；F无相关依赖或只持课程保健课批准且试图替代体测资格；UG50目录/外部结果无法取得；校验原目的、原签发人、学生年、有效版；SRC-008未取得导致G50逐项范围不可确认；SRC-007/SRC-010外校流程也不得作本校授权；SRC-002/SRC-007/SRC-008/SRC-010；F002/F009/F016/F041/F043；M001/M002/M022；T→PASS_FACT（只读引用），不是免测批准；F→NOT_APPLICABLE；U→SOURCE_UNAVAILABLE（结果不可达）/POLICY_UNCONFIRMED（去重边界），目录维护/外部业务Owner。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "官方结果目标范围、决定效力与旧年复用",
          "requirement": "R027 官方结果目标范围、决定效力与旧年复用；E/F；T真实有效核准/拒绝绑定正确学生、学年、申请目的、项目/范围与版本；F只是未产生正式决定；U有记录但对象/年/范围不吻合或部分免测无本校规则；M009是决定权威源；拒绝/批准由原件表达，模板只报告“已收到什么”而不创设结果；历史批准绝不自动展期，改变范围须原机关作决定；SRC-001/SRC-003/SRC-005；F002/F009/F015/F026/F027/F044/F042；M001/M002/M009/M010；T→PASS_FACT（决定事实，需另字段呈现原决定态）；F→NOT_APPLICABLE于前阶段；U→错对象CONFLICT、部分免测政策不明POLICY_UNCONFIRMED或权限不清NEEDS_HUMAN_DECISION，体育主管授权审批岗。本条为本地研究检查；政策、适用范围或权限未确认时只输出事实预审/待确认/人工复核，不得形成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "a",
      "name": "A 目标识别",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "b",
      "workflowOwner": "local"
    },
    {
      "id": "b",
      "name": "B 申请/登记",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "c",
      "workflowOwner": "local"
    },
    {
      "id": "c",
      "name": "C 初核和授权核验",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "d",
      "workflowOwner": "local"
    },
    {
      "id": "d",
      "name": "D 补证与冲突处理",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "e",
      "workflowOwner": "local"
    },
    {
      "id": "e",
      "name": "E 正式决定/排期",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "f",
      "workflowOwner": "local"
    },
    {
      "id": "f",
      "name": "F 同步与归档",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "g",
      "workflowOwner": "local"
    },
    {
      "id": "g",
      "name": "G 后续变更与争议",
      "kind": "manual-review",
      "executorRole": "reviewer",
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
  "templateId": "S02-T10",
  "name": "学生体质健康测试免测、缓测与补测资格审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S02-T10.md",
  "sourceDocumentSha256": "a4d62bbc73d7ed8229b5497762e3a825b98fcccd0a57f77f28aaed65c6cadd31",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/S02-T10.md",
  "sourceOriginalSha256": "a4d62bbc73d7ed8229b5497762e3a825b98fcccd0a57f77f28aaed65c6cadd31",
  "sourceOriginalGitBlobSha": "98ce5fd43b5b85d458ede2e77fc578e79129582c",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23",
  "implementationAsOf": "2026-10-24",
  "researchStatus": "RESEARCH_HANDOFF_READY_POLICY_OPEN",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceSummary": "教育部2014年国家标准及2025年校内体测历史公告可核；2026年校内免测、缓测、补测流程、授权链和健康信息保留规则未确认。",
  "relatedTemplateIds": [
    "S02-T01",
    "S02-T03",
    "S02-T04",
    "S02-T06"
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "| SRC-001 | 成都理工大学体育学院；《【成理体测进行时】@所有成理人，这份体测指南请查收！》；https://tyxy.cdut.edu.cn/info/1062/3973.htm | 正文免测说明、体测安排表、Q3–Q7；2025-11-06；2025秋季公告，非长期生效制度 | CDUT-VERIFIED；2025全校体测相关学生；正文经搜索引擎完整索引核对，网站直链返回412；2026适用性未知 |",
      "url": "https://tyxy.cdut.edu.cn/info/1062/3973.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-002",
      "title": "| SRC-002 | 成都理工大学；《关于印发〈成都理工大学全日制普通本科学生学籍管理办法〉的通知》（成理校教〔2019〕18号）；https://dbxb.cdut.edu.cn/__local/7/B6/E5/006AC04D88A214D1AD8B1F5E540_16B4A5B7_C543C.pdf | PDF页1通知及页2第2条、页5–6第16/19条、页10第29条、页15第48条、页18第59–62条；2019-12-31",
      "url": "https://dbxb.cdut.edu.cn/__local/7/B6/E5/006AC04D88A214D1AD8B1F5E540_16B4A5B7_C543C.pdf",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-003",
      "title": "| SRC-003 | 成都理工大学体育学院；《学院简介》；https://tyxy.cdut.edu.cn/xygk/xyjj.htm | 网页“学院承担全校……大学生体质健康测试”等职责；页面发布时间、生效/废止未标 | CDUT-VERIFIED；机构职责背景，不作个人审批授权；检索索引可核对，网页直读失败；组织分工更新需确认 |",
      "url": "https://tyxy.cdut.edu.cn/xygk/xyjj.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-004",
      "title": "| SRC-004 | 中华人民共和国教育部；《教育部关于印发〈国家学生体质健康标准（2014年修订）〉的通知》（教体艺〔2014〕5号）；https://www.moe.gov.cn/jyb_xxgk/xxgk/neirong/fenlei/sxml_twyjy/twyjy_tyws/tyws_xgzc/201407/t20140708_171692.html | 正文发布通知和原标准DOC附件入口；落款2014-07-07，网页20",
      "url": "https://www.moe.gov.cn/jyb_xxgk/xxgk/neirong/fenlei/sxml_twyjy/twyjy_tyws/tyws_xgzc/201407/t20140708_171692.html",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-005",
      "title": "| SRC-005 | 中华人民共和国教育部；《教育部关于印发〈学生体质健康监测评价办法〉等三个文件的通知》（教体艺〔2014〕3号）；https://www.moe.gov.cn/srcsite/A17/s7059/201404/t20140428_168528.html | 附《学生体质健康监测评价办法》第3、5–7条；2014-04-28；未发现明确废止条款 | GENERAL-RESEARCH；各级各类学校；公开全文检索核对，截",
      "url": "https://www.moe.gov.cn/srcsite/A17/s7059/201404/t20140428_168528.html",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-006",
      "title": "| SRC-004 | 中华人民共和国教育部；《教育部关于印发〈国家学生体质健康标准（2014年修订）〉的通知》（教体艺〔2014〕5号）；https://www.moe.gov.cn/jyb_xxgk/xxgk/neirong/fenlei/sxml_twyjy/twyjy_tyws/tyws_xgzc/201407/t20140708_171692.html | 正文发布通知和原标准DOC附件入口；落款2014-07-07，网页20",
      "url": "https://www.moe.gov.cn/jyb_xxgk/xxgk/neirong/fenlei/sxml_twyjy/twyjy_tyws/tyws_xgzc/201407/t20140708_171692.html",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-007",
      "title": "| SRC-007 | 重庆大学体育学院；《关于重庆大学2014年〈国家学生体质健康标准（2014年修订）〉测试工作的通知》；https://sports.cqu.edu.cn/info/1279/7600.htm | 免测段落；2014年测试通知；阶段性，不在成都理工大学生效 | CROSS-SCHOOL-REFERENCE；只用于说明其他学校的“校医院/所在学院/体育部门”流程不得照搬；公开检索核对 |",
      "url": "https://sports.cqu.edu.cn/info/1279/7600.htm",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-008",
      "title": "| SRC-009 | 教育部学生体质健康网（国家学生体质健康标准数据管理系统相关网站）；首页“免予执行《国家学生体质健康标准》申请表（样表）”入口；https://www.csh.moe.edu.cn/ | 首页工具/表格入口；网页未标该项发布日期、生效/废止时间；2026-10-22可检索到入口，直连返回420、原样表附件未取得 | GENERAL-RESEARCH；全国标准层面的样表存在性线索，不能视为成都理工大学必须下载、盖章提",
      "url": "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json",
      "evidenceStatus": "CURRENTITY_UNKNOWN"
    },
    {
      "id": "SRC-009",
      "title": "| SRC-009 | 教育部学生体质健康网（国家学生体质健康标准数据管理系统相关网站）；首页“免予执行《国家学生体质健康标准》申请表（样表）”入口；https://www.csh.moe.edu.cn/ | 首页工具/表格入口；网页未标该项发布日期、生效/废止时间；2026-10-22可检索到入口，直连返回420、原样表附件未取得 | GENERAL-RESEARCH；全国标准层面的样表存在性线索，不能视为成都理工大学必须下载、盖章提",
      "url": "https://www.csh.moe.edu.cn/",
      "evidenceStatus": "CROSS_SCHOOL_REFERENCE"
    },
    {
      "id": "SRC-010",
      "title": "| SRC-010 | 西南财经大学体育学院/体测中心；《关于开展2026年本科生〈国家学生体质健康标准〉测试工作的通知》；https://tyxy.swufe.edu.cn/info/1082/10261.htm | 正文第七部分及其他办理说明、2026年免测/缓测要求；2026-09-30；为2026年该校测试周期通知，非成都理工大学制度 | CROSS-SCHOOL-REFERENCE；原文可直接读取；用于反例：虽同用“体适能AP",
      "url": "https://tyxy.swufe.edu.cn/info/1082/10261.htm",
      "evidenceStatus": "CROSS_SCHOOL_REFERENCE"
    },
    {
      "id": "SRC-011",
      "title": "| SRC-011 | 教育部等五部门；《关于实施学生体质强健计划的意见》（教体艺〔2025〕1号）；https://www.moe.gov.cn/srcsite/A17/moe_938/s3273/202511/t20251119_1420840.html | 2025-11-19官方发布页；政策框架与学校体育改革，不含成都理工大学免缓补测具体操作窗口 | GENERAL-RESEARCH；2026-10-23检索官方结果可见，直开超",
      "url": "https://www.moe.gov.cn/srcsite/A17/moe_938/s3273/202511/t20251119_1420840.html",
      "evidenceStatus": "GENERAL_RESEARCH"
    },
    {
      "id": "SRC-012",
      "title": "| SRC-012 | 教育部；《关于全面推进健康学校建设的指导意见》（教体艺〔2026〕3号）；https://www.moe.gov.cn/srcsite/A17/moe_943/moe_946/202602/t20260227_1429365.html | 2026-02-26发文、官方公开页；提出大学生体质提升等政策方向，但不规定本校免缓补测签发链与材料 | GENERAL-RESEARCH；2026-10-23官方搜索结果可见",
      "url": "https://www.moe.gov.cn/srcsite/A17/moe_943/moe_946/202602/t20260227_1429365.html",
      "evidenceStatus": "GENERAL_RESEARCH"
    },
    {
      "id": "SRC-013",
      "title": "| SRC-013 | 教育部/国家学生体质健康标准数据管理系统政策栏目；https://www.csh.moe.edu.cn/wtzx/zcwj/index.html | 2026-10-23检索显示2014修订标准及2025秋季数据上报说明；非完整现行法规数据库 | GENERAL-RESEARCH；检索未发现2025/2026替代版标准，这是有界检索阴性结果，不能证明不存在新标准 |",
      "url": "https://www.csh.moe.edu.cn/wtzx/zcwj/index.html",
      "evidenceStatus": "GENERAL_RESEARCH"
    }
  ],
  "criteria": [
    {
      "sectionId": "research-criteria",
      "criterionId": "r001",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r002",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r003",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r004",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r005",
      "sourceIds": [
        "SRC-010",
        "SRC-001",
        "SRC-004",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r006",
      "sourceIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r007",
      "sourceIds": [
        "SRC-001",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r008",
      "sourceIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r009",
      "sourceIds": [
        "SRC-001",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r010",
      "sourceIds": [
        "SRC-001",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r011",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-006",
        "SRC-009",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r012",
      "sourceIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r013",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r014",
      "sourceIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r015",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r016",
      "sourceIds": [
        "SRC-001",
        "SRC-004",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r017",
      "sourceIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r018",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r019",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r020",
      "sourceIds": [
        "SRC-001",
        "SRC-005"
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
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r023",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r024",
      "sourceIds": [
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r025",
      "sourceIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r026",
      "sourceIds": [
        "SRC-008",
        "SRC-007",
        "SRC-010",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "research-criteria",
      "criterionId": "r027",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const
