import type { TemplateVersion } from '@profer/shared'

/**
 * R02 T02-T05: 本地研究模板运行时定义。
 * SRC ID 仅表示研究来源，不是案卷 SourceRef。
 * 本批保留 draft 与人工复核门禁；共享注册/Plan-Run 接线由集成 Owner 负责。
 */
export const templateVersion: TemplateVersion = {
  "templateId": "T02-T05",
  "version": 1,
  "schemaVersion": 2,
  "name": "教职工年度考核与师德考核关联事实审核",
  "description": "本地研究模板 · 非校方正式模板。政策证据状态：PARTIAL。仅用于材料完整性、事实归属与证据差异的本地预核；正式人事、师德、聘期、业绩等级或进修资格决定由经确认的有权人员人工作出。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T02-T05 根据 R02 研究交接稿转换；不是成都理工大学正式模板、正式制度或授权签批流程。政策版本未核实，不创建 PolicyVersion，所有自动通过均关闭。",
  "objectType": "person",
  "displayName": {
    "template": "教职工年度考核与师德考核关联事实审核"
  },
  "fields": [
    {
      "key": "f001",
      "label": "稳定人员键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F001；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F001"
    },
    {
      "key": "f002",
      "label": "姓名/曾用名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F002；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F002"
    },
    {
      "key": "f003",
      "label": "归属单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F003；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F003"
    },
    {
      "key": "f004",
      "label": "受聘岗位类别",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F004；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F004；枚举值来自研究原件",
      "options": [
        {
          "value": "教师",
          "label": "教师"
        },
        {
          "value": "辅导员",
          "label": "辅导员"
        },
        {
          "value": "其他专技",
          "label": "其他专技"
        },
        {
          "value": "管理",
          "label": "管理"
        },
        {
          "value": "工勤",
          "label": "工勤"
        },
        {
          "value": "待核",
          "label": "待核"
        }
      ]
    },
    {
      "key": "f005",
      "label": "人员聘用关系类别",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F005；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F005；枚举值来自研究原件",
      "options": [
        {
          "value": "事业编",
          "label": "事业编"
        },
        {
          "value": "人事代理",
          "label": "人事代理"
        },
        {
          "value": "其他合同",
          "label": "其他合同"
        },
        {
          "value": "返聘",
          "label": "返聘"
        },
        {
          "value": "其他",
          "label": "其他"
        },
        {
          "value": "待核",
          "label": "待核"
        }
      ]
    },
    {
      "key": "f006",
      "label": "特殊授权审核路线",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F006；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F006；枚举值来自研究原件",
      "options": [
        {
          "value": "一般",
          "label": "一般"
        },
        {
          "value": "领导干部专门路线",
          "label": "领导干部专门路线"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "f007",
      "label": "考核年度",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F007；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F007"
    },
    {
      "key": "f008",
      "label": "当期政策版本引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F008；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F008"
    },
    {
      "key": "f009",
      "label": "各阶段办理时间窗",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F009；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F009"
    },
    {
      "key": "f010",
      "label": "发起人可信主体标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F010；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F010"
    },
    {
      "key": "f011",
      "label": "代办授权范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F011；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F011"
    },
    {
      "key": "f012",
      "label": "任职服务区间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F012；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F012"
    },
    {
      "key": "f013",
      "label": "是否首次就业",
      "kind": "boolean",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F013；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F013"
    },
    {
      "key": "f014",
      "label": "既往任职区间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F014；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F014"
    },
    {
      "key": "f015",
      "label": "兼任岗位引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F015；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F015"
    },
    {
      "key": "f016",
      "label": "外派派驻记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F016；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F016"
    },
    {
      "key": "f017",
      "label": "请假类别",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F017；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F017；枚举值来自研究原件",
      "options": [
        {
          "value": "病",
          "label": "病"
        },
        {
          "value": "事",
          "label": "事"
        },
        {
          "value": "产",
          "label": "产"
        },
        {
          "value": "非派出培训",
          "label": "非派出培训"
        },
        {
          "value": "其他",
          "label": "其他"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "f018",
      "label": "已批准请假期间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F018；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F018"
    },
    {
      "key": "f019",
      "label": "岗位任务基准引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F019；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F019"
    },
    {
      "key": "f020",
      "label": "年度个人陈述引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F020；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F020"
    },
    {
      "key": "f021",
      "label": "考勤事实引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F021；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F021"
    },
    {
      "key": "f022",
      "label": "履职业绩事实引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F022；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F022"
    },
    {
      "key": "f023",
      "label": "外派接收单位意见引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F023；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F023"
    },
    {
      "key": "f024",
      "label": "既有师德结论状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F024；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F024；枚举值来自研究原件",
      "options": [
        {
          "value": "存在有效结论",
          "label": "存在有效结论"
        },
        {
          "value": "未有可引结论",
          "label": "未有可引结论"
        },
        {
          "value": "状态未知",
          "label": "状态未知"
        }
      ]
    },
    {
      "key": "f025",
      "label": "既有师德决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F025；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F025"
    },
    {
      "key": "f026",
      "label": "科研诚信正式决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F026；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F026"
    },
    {
      "key": "f027",
      "label": "调查程序阶段",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F027；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F027；枚举值来自研究原件",
      "options": [
        {
          "value": "未知",
          "label": "未知"
        },
        {
          "value": "已受理",
          "label": "已受理"
        },
        {
          "value": "正式立案",
          "label": "正式立案"
        },
        {
          "value": "调查中",
          "label": "调查中"
        },
        {
          "value": "结案",
          "label": "结案"
        }
      ]
    },
    {
      "key": "f028",
      "label": "受限调查记录引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F028；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F028"
    },
    {
      "key": "f029",
      "label": "单位评审授权证明",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F029；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F029"
    },
    {
      "key": "f030",
      "label": "单位评审建议引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F030；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F030"
    },
    {
      "key": "f031",
      "label": "年度考核正式决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F031；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F031"
    },
    {
      "key": "f032",
      "label": "年度考核档次",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F032；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F032；枚举值来自研究原件",
      "options": [
        {
          "value": "四档",
          "label": "四档"
        },
        {
          "value": "不定档",
          "label": "不定档"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ]
    },
    {
      "key": "f033",
      "label": "师德年度正式决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F033；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F033"
    },
    {
      "key": "f034",
      "label": "师德考核结论状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F034；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F034；枚举值来自研究原件",
      "options": [
        {
          "value": "校本待定义",
          "label": "校本待定义"
        }
      ]
    },
    {
      "key": "f035",
      "label": "决定生效时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F035；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F035"
    },
    {
      "key": "f036",
      "label": "决定签发权限证明",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F036；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F036"
    },
    {
      "key": "f037",
      "label": "结果送达记录引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F037；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F037"
    },
    {
      "key": "f038",
      "label": "异议/复核申请引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F038；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F038"
    },
    {
      "key": "f039",
      "label": "复核决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F039；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F039"
    },
    {
      "key": "f040",
      "label": "撤销替代效力链",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F040；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F040"
    },
    {
      "key": "f041",
      "label": "下游复用目的",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F041；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F041；枚举值来自研究原件",
      "options": [
        {
          "value": "职称",
          "label": "职称"
        },
        {
          "value": "聘期",
          "label": "聘期"
        },
        {
          "value": "其他经核目的",
          "label": "其他经核目的"
        }
      ]
    },
    {
      "key": "f042",
      "label": "下游复用授权引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F042；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F042"
    },
    {
      "key": "f043",
      "label": "可信 Actor 权限快照",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F043；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F043"
    },
    {
      "key": "f044",
      "label": "证据归属版本关系图",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F044；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T05 / F044"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "当期年度、适用对象、阶段期限、师德规则",
      "purpose": "当期年度、适用对象、阶段期限、师德规则；学校归口部门；校本工作通知、附表/制度版本、内部有效通知核验；A；学校政策库/受权经办核对，非个人上传；无通知不得硬判；F007–F009；SRC-001,011,012；文号+年度+生效版；未获得 POLICY_UNCONFIRMED，非“考核不合格”。来源材料槽 M001；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "当期年度、适用对象、阶段期限、师德规则；学校归口部门",
        "校本工作通知、附表/制度版本、内部有效通知核验",
        "A；学校政策库/受权经办核对，非个人上传；无通知不得硬判"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "员工身份、聘用/岗位类别、任职期间",
      "purpose": "员工身份、聘用/岗位类别、任职期间；HR/组织人事保管者；人事主档/聘任记录、受权档案摘录；A；可信主档或保管机构出具核对记录；不用再次索全套证件；F001–F006,F012,F013；SRC-001,009,012,013,015；人员键与有效区间；SRC-013 第5/16条只提供 2019 岗位适用界线，SRC-015 不含编外办法正文，当期考核身份制度仍须 M001；主档失联 SOURCE_UNAVAILABLE、错名 CONFLICT；扫描不可读 UNREADABLE。来源材料槽 M002；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "员工身份、聘用/岗位类别、任职期间；HR/组织人事保管者",
        "人事主档/聘任记录、受权档案摘录",
        "A；可信主档或保管机构出具核对记录；不用再次索全套证件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "申报/代办者真实权限",
      "purpose": "申报/代办者真实权限；HOST 与校方授权方；会话授权快照、代办书/授权名册；A；本人会话无需纸质代办书；代办才 C；F010,F011,F043；SRC-001,009,012；绑定 actor、对象、年度、有效期；授权缺失 NEEDS_HUMAN_DECISION，拒绝代决。来源材料槽 M003；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "requiredElements": [
        "申报/代办者真实权限；HOST 与校方授权方",
        "会话授权快照、代办书/授权名册",
        "A；本人会话无需纸质代办书；代办才 C"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "前单位任职时段、原单位履职事实",
      "purpose": "前单位任职时段、原单位履职事实；前单位 HR/本校档案；原单位出具的经历、档案/社保等经主管认可记录；C：非初次就业且涉及跨单位时间；允许合法档案佐证，不强要唯一格式；F014；SRC-009 第37条；发出单位、时间段与本校 M002 衔接；未到手 NEEDS_MATERIAL，冲突 CONFLICT。来源材料槽 M004；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "前单位任职时段、原单位履职事实；前单位 HR/本校档案",
        "原单位出具的经历、档案/社保等经主管认可记录",
        "C：非初次就业且涉及跨单位时间；允许合法档案佐证，不强要唯一格式"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "考核岗位责任、双岗位/调整生效",
      "purpose": "考核岗位责任、双岗位/调整生效；HR/岗位主管；岗位职责、聘任/兼岗任命、变更文书；A：一般岗位职责；双岗 C；可信人事主档可替代扫描件；F015,F019；SRC-001,009,013 第6/10/11条；每岗位独立版本/任务边界；SRC-013 2019 岗位管理非2026 年度考核标准，缺核定职责 SOURCE_UNAVAILABLE 或 NEEDS_MATERIAL。来源材料槽 M005；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "考核岗位责任、双岗位/调整生效；HR/岗位主管",
        "岗位职责、聘任/兼岗任命、变更文书",
        "A：一般岗位职责；双岗 C；可信人事主档可替代扫描件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "外派性质、派出授权、起止期间",
      "purpose": "外派性质、派出授权、起止期间；人事/外事/派出机构；挂职、援派、驻外、培训或创新创业批准记录；C：仅 D；G05/人事已有有效批准记录可引用，不重做外事审批；F016；SRC-009 第38条；派出令与接收单位对应；没有批准需人工核实，不能凭出国票据判断。来源材料槽 M006；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "外派性质、派出授权、起止期间；人事/外事/派出机构",
        "挂职、援派、驻外、培训或创新创业批准记录",
        "C：仅 D；G05/人事已有有效批准记录可引用，不重做外事审批"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m007",
      "name": "法定请假类别与批准期间",
      "purpose": "法定请假类别与批准期间；HR/考勤主管；假期批准摘要/销假记录，不含病历明细；C：仅 F；已有可信考勤/假期系统可直接核验；F017,F018；SRC-009 第41条；高敏感；只保留类别和期间，未核/不可读 NEEDS_MATERIAL/UNREADABLE，不索诊断。来源材料槽 M007；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "法定请假类别与批准期间；HR/考勤主管",
        "假期批准摘要/销假记录，不含病历明细",
        "C：仅 F；已有可信考勤/假期系统可直接核验"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "本人年度履职陈述",
      "purpose": "本人年度履职陈述；被考核人；个人年度总结或年度考核登记表（具体 CDUT 表样未取得）；A：进入 P1 后按适用制度；可信电子提交可替代纸件；F020；SRC-009 第17条,SRC-012；本人/代办主体、内容版本；未到提交节点不标缺；表样不明 POLICY_UNCONFIRMED。来源材料槽 M008；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "本人年度履职陈述；被考核人",
        "个人年度总结或年度考核登记表（具体 CDUT 表样未取得）",
        "A：进入 P1 后按适用制度；可信电子提交可替代纸件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "考勤与日常履职事实",
      "purpose": "勤与日常履职事实；考勤/部门主管；出勤汇总、工作检查/平时考核记录；C：确有对应核验项目时；能由主管提取则不让本人重传；F021；SRC-009 第5、24条；归属年度与统计窗口；失联 SOURCE_UNAVAILABLE，不可读 UNREADABLE。来源材料槽 M009；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "勤与日常履职事实；考勤/部门主管",
        "出勤汇总、工作检查/平时考核记录",
        "C：确有对应核验项目时；能由主管提取则不让本人重传"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "业绩/任务完成的来源事实",
      "purpose": "业绩/任务完成的来源事实；教学科研部门、学院；授课/科研/管理服务记录、正式绩效事实摘要；C：当岗位指标涉及；各源机构分别确认，非自述即为权威；F022；SRC-009 第5–8、17条；每来源独立 time range 与记录版本；权重未知 POLICY_UNCONFIRMED。来源材料槽 M010；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "业绩/任务完成的来源事实；教学科研部门、学院",
        "授课/科研/管理服务记录、正式绩效事实摘要",
        "C：当岗位指标涉及；各源机构分别确认，非自述即为权威"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "在外期间的履职评价",
      "purpose": "在外期间的履职评价；接收/派出单位；有权机构书面意见或经认证回执；C：D 且主考核依法需要；可用有效互认记录；F023；SRC-009 第38条；签发机构+人员+期间；缺件 NEEDS_MATERIAL，跨单位冲突人工确认。来源材料槽 M011；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "在外期间的履职评价；接收/派出单位",
        "有权机构书面意见或经认证回执",
        "C：D 且主考核依法需要；可用有效互认记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "已形成且可引用的师德结论/状态",
      "purpose": "已形成且可引用的师德结论/状态；党委教师工作部等有权保管者；有效年度师德结论引用，不是举报表；C：仅确有先期权威结论；没有已生成结论时不前置索取；F024,F025；SRC-002,003,008,011；凭结论号/有效状态+人员/年份；权限不足 NEEDS_HUMAN_DECISION，失联 SOURCE_UNAVAILABLE。来源材料槽 M012；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "已形成且可引用的师德结论/状态；党委教师工作部等有权保管者",
        "有效年度师德结论引用，不是举报表",
        "C：仅确有先期权威结论；没有已生成结论时不前置索取"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m013",
      "name": "科研诚信已正式认定的结论",
      "purpose": "科研诚信已正式认定的结论；科研诚信有权机关；经调查处理后的有效决定摘要；C：仅相关、已存在且合法可用；可读取源端决定引用；F026；SRC-006 第9、16、21–23条；不接收“论文举报=失信”；决定在复核则记状态，不作最终归责。来源材料槽 M013；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "科研诚信已正式认定的结论；科研诚信有权机关",
        "经调查处理后的有效决定摘要",
        "C：仅相关、已存在且合法可用；可读取源端决定引用"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m014",
      "name": "程序确实走到何阶段",
      "purpose": "程序确实走到何阶段；师德/纪检/调查机关；受限状态摘要或不可反推当事人的 opaque ref；C：只有具权 G；普通经办/本人不得被要求交原始投诉、调查笔录；F027,F028；SRC-008 第4–5项,SRC-009 第42条；限密记录，必须区分举报/立案/处理；权威状态不可核 NEEDS_HUMAN_DECISION。来源材料槽 M014；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "submission",
      "requiredElements": [
        "程序确实走到何阶段；师德/纪检/调查机关",
        "受限状态摘要或不可反推当事人的 opaque ref",
        "C：只有具权 G；普通经办/本人不得被要求交原始投诉、调查笔录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "单位考核组织确实作出建议",
      "purpose": "单位考核组织确实作出建议；授权评议组；测评、会议纪要、建议书/相应签发登记；L：P3 后才可能产生，P1 绝不强要；F029,F030；SRC-009 第16–17条,SRC-012；组员授权和会议版本绑定；无权签发 NEEDS_HUMAN_DECISION，不可读 UNREADABLE。来源材料槽 M015；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "requiredElements": [
        "单位考核组织确实作出建议；授权评议组",
        "测评、会议纪要、建议书/相应签发登记",
        "L：P3 后才可能产生，P1 绝不强要"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "年度正式档次及签发依据",
      "purpose": "年度正式档次及签发依据；学校有权考核机关；个人结果记录、审定文书/有权结果回执；L：决定已经作出后才核；2023/2024 公共纪要不能替代个人结果；F031,F032,F035,F036；SRC-004,005,009；人员/年份/发行机关/效力；无原件 SOURCE_UNAVAILABLE，不能从会议标题补造档次。来源材料槽 M016；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "requiredElements": [
        "年度正式档次及签发依据；学校有权考核机关",
        "个人结果记录、审定文书/有权结果回执",
        "L：决定已经作出后才核；2023/2024 公共纪要不能替代个人结果"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "师德年度有效结论及最终签发者",
      "purpose": "师德年度有效结论及最终签发者；师德结果有权机关；年度师德最终结果文书/权威登记回执；L：师德结论形成后，不能把 M016 或校务会“审议”当替代；F033–F036；SRC-004,005,008,011,012；单独结论号/年度/生效状态；签发权限未知 NEEDS_HUMAN_DECISION。来源材料槽 M017；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "requiredElements": [
        "师德年度有效结论及最终签发者；师德结果有权机关",
        "年度师德最终结果文书/权威登记回执",
        "L：师德结论形成后，不能把 M016 或校务会“审议”当替代"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "结果已告知本人及意见签署",
      "purpose": "结果已告知本人及意见签署；结果送达人/被考核人；书面告知、送达/签收和异议记录；L：结果形成并告知后；可用经校方认可的电子送达回执；F037；SRC-001 第70条,SRC-009 第17条；通知对象与时间准确；送达未完成是待生成，不是前期缺件。来源材料槽 M018；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "requiredElements": [
        "结果已告知本人及意见签署；结果送达人/被考核人",
        "书面告知、送达/签收和异议记录",
        "L：结果形成并告知后；可用经校方认可的电子送达回执"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "本人的事实异议、复核/申诉意愿",
      "purpose": "本人的事实异议、复核/申诉意愿；被考核人和有权受理机关；书面申请、合法证据附件、受理回执；C：确有复核/申诉；无须每个普通考核对象提交；F038；SRC-001,008,009 第36条；按原案/原决定绑定；期限不明 POLICY_UNCONFIRMED，不能 AI 拒收。来源材料槽 M019；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "requiredElements": [
        "本人的事实异议、复核/申诉意愿；被考核人和有权受理机关",
        "书面申请、合法证据附件、受理回执",
        "C：确有复核/申诉；无须每个普通考核对象提交"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "复核后的有效处理、更正或撤销",
      "purpose": "复核后的有效处理、更正或撤销；原决定/复核机关；有权复核、变更、撤销决定及关系说明；L：后续正式形成；本人复核申请不能替代；F039,F040；SRC-001,008,009；保留原结论和 supersedes/revokedAt；无权扫描“更正通知”不废旧决定。来源材料槽 M020；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "requiredElements": [
        "复核后的有效处理、更正或撤销；原决定/复核机关",
        "有权复核、变更、撤销决定及关系说明",
        "L：后续正式形成；本人复核申请不能替代"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "下游请求用途、字段授权及时间范围",
      "purpose": "下游请求用途、字段授权及时间范围；下游 Owner 与源机关；职称/聘期/导师岗位等调阅请求、源端授权或审计回执；C：发生真实跨业务引用时；依法授权的系统查询可替代重复纸件；F041,F042；SRC-003,007,009 第27条,014,016；与对象/年度/目的绑定；授权失效停止共享、原结论不变；导师岗位考核只依自己主管机关办理。来源材料槽 M021；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "requiredElements": [
        "下游请求用途、字段授权及时间范围；下游 Owner 与源机关",
        "职称/聘期/导师岗位等调阅请求、源端授权或审计回执",
        "C：发生真实跨业务引用时；依法授权的系统查询可替代重复纸件"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m022",
      "name": "文件与记录归属、版本、变更、技术审核依赖",
      "purpose": "文件与记录归属、版本、变更、技术审核依赖；本系统；来源登记、文件哈希、关联和技术运行审计；A：由系统安全记录生成，不要求被考核人交 JSON；F043,F044；SRC-001,009（管理责任背景，非哈希实现规范）；每次替换保留旧 ID/版本/影响分析；不明归属 CONFLICT，不自动篡改正式结果。来源材料槽 M022；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredAt": "decision",
      "requiredElements": [
        "文件与记录归属、版本、变更、技术审核依赖；本系统",
        "来源登记、文件哈希、关联和技术运行审计",
        "A：由系统安全记录生成，不要求被考核人交 JSON"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rule-checks",
      "name": "原件逐条规则核验",
      "description": "映射研究原件中 R001 至 R024 的全部规则。SRC 是研究来源索引，不是案卷材料 SourceRef。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "当期制度及年度",
          "requirement": "研究规则 R001：\n规则 / 可达阶段：R001 当期制度及年度，P0 起\nT／F／U 条件：T：归口部门提供对该年度和该身份有效的制度；F：无 F 分支；U：现行版本/适用范围不明\nSRC；F；M：SRC-001,009,011,012；F007–F009；M001\n比较、证据层级、期间与例外：核发文机关、文号、适用对象、年度、阶段日期与更替链；历史宣传和国家一般规定不能填补本校当期程序。M001 为校方源，不由个人上传\nT 情形可能结果 / 下一角色：PASS_FACT/POLICY_UNCONFIRMED/CONFLICT；人事归口政策负责人确认\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "发起者及代理权",
          "requirement": "研究规则 R002：\n规则 / 可达阶段：R002 发起者及代理权，P0–P6 每个写操作\nT／F／U 条件：T：Host 会话对应本人或明确授权的经办；F：可信本人亲办无须代理（仅代理子条件 NA）；U：授权对象/时效/角色不明\nSRC；F；M：SRC-001,009,012；F010,F011,F043；M003,M022\n比较、证据层级、期间与例外：actorId + roleScope + personKey/year + validAt + permissionVersion 全匹配；忽略 Renderer 的 actor/approved；本人亲办可用真实会话代纸质委托\nT 情形可能结果 / 下一角色：PASS_FACT/NEEDS_HUMAN_DECISION/CONFLICT；Host 安全门禁和人事授权管理员，失败禁止写入\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "人员主键与证据归属",
          "requirement": "研究规则 R003：\n规则 / 可达阶段：R003 人员主键与证据归属，P0–P6\nT／F／U 条件：T：材料归属当前人和年度；F：只有确证材料属于其他人时本材料对该人 NA，但错挂仍报冲突；U：同名/改名/跨单位无可信映射\nSRC；F；M：SRC-001,009；F001–F003,F044；M002,M008,M022\n比较、证据层级、期间与例外：核 personKey、曾用名、单位任职有效区间、文书对象及源哈希版本；OCR 姓名不等于唯一身份；含多主体材料须分拆对象\nT 情形可能结果 / 下一角色：PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE；HR 确认身份与源材料管理员更正关联\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "人员类别与考核权限",
          "requirement": "研究规则 R004：\n规则 / 可达阶段：R004 人员类别与考核权限，P0\nT／F／U 条件：T：人事来源证实身份/岗位适用当前考核路线；F：权威政策证实本分支不适用；U：领导、编外、返聘等范围不明\nSRC；F；M：SRC-001,009,012,013 第5/6/16条,015；F004–F006,F012；M001,M002\n比较、证据层级、期间与例外：按合同、岗位任命、年度内生效区间核对应制度；2019 岗位办法对编内“适用”、对人事代理岗位事项“可参照”，2025 编外规范仅有审定议题，两者都不能定义 2026 编外年度考核义务；国家一般规则也不能覆盖组织部门另管领导\nT 情形可能结果 / 下一角色：PASS_FACT/NOT_APPLICABLE/POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；组织人事/有权考核机关\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "首次就业",
          "requirement": "研究规则 R005：\n规则 / 可达阶段：R005 首次就业/调入前后期间，P1–P2（C）\nT／F／U 条件：T：年内首次聘用/跨单位且确需分段；F：HR 证实本年无该变动；U：是否首次就业或前单位时段不明\nSRC；F；M：SRC-009 第37条,SRC-012；F012–F014；M002,M004\n比较、证据层级、期间与例外：比较两单位任职日期交集/空档、首次就业依据；跨单位证明由原单位或档案提供；半数规则是否用于本身份须校本确认，不自动定档\nT 情形可能结果 / 下一角色：PASS_FACT/NEEDS_MATERIAL/SOURCE_UNAVAILABLE/CONFLICT/POLICY_UNCONFIRMED；现 HR 与前单位档案管理者\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "岗位职责与双岗来源",
          "requirement": "研究规则 R006：\n规则 / 可达阶段：R006 岗位职责与双岗来源，P1–P2（A/B/E）\nT／F／U 条件：T：单/双岗及其职责已有可信聘任；F：HR 确认无双岗时仅双岗支线 NA；U：仅本人自述双岗或职责版本不明\nSRC；F；M：SRC-001,009 第39条,SRC-012,013 第6/10/11条；F015,F019；M005\n比较、证据层级、期间与例外：核聘任有效日期、每岗位职责编号和年度调整；2019 岗位任务书仅作来源核实，双岗两种业绩分别归属，不能合成自定权重。单岗仍核基准职责\nT 情形可能结果 / 下一角色：PASS_FACT/NEEDS_MATERIAL/CONFLICT/POLICY_UNCONFIRMED；HR/岗位主管\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "外派或挂职批准事实",
          "requirement": "研究规则 R007：\n规则 / 可达阶段：R007 外派或挂职批准事实，P1–P2（D）\nT／F／U 条件：T：HR 已证实外派类型/期间；F：HR 证实无相应外派；U：旅行票据、外事截图但无人事批准\nSRC；F；M：SRC-009 第38条,SRC-012；F016；M006\n比较、证据层级、期间与例外：比较批准单位、派出/接收对象、区间及撤销记录；G05 出境批准只做其自身事实，不代替岗位考核或接收单位评价\nT 情形可能结果 / 下一角色：PASS_FACT/NEEDS_MATERIAL/CONFLICT/SOURCE_UNAVAILABLE；派出单位与 HR\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "请假种类、批准日和边界",
          "requirement": "研究规则 R008：\n规则 / 可达阶段：R008 请假种类、批准日和边界，P1–P2（F）\nT／F／U 条件：T：HR 确认病/事/产/培训等类别及时间；F：HR 证实本分支没有相关批准假期；U：类型/合法批准不明\nSRC；F；M：SRC-009 第41条,SRC-012；F017,F018；M007\n比较、证据层级、期间与例外：对照批准日、销假日、年度交集；只要类型和日期，不取病历；产假不能套病事假半数分支；天数和档次由适用校本制度+有权机关定\nT 情形可能结果 / 下一角色：PASS_FACT/UNREADABLE/CONFLICT/POLICY_UNCONFIRMED；HR/考勤主管\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "本人述职来源",
          "requirement": "研究规则 R009：\n规则 / 可达阶段：R009 本人述职来源，P1（A–G）\nT／F／U 条件：T：当期规则要求本人年度陈述且提交期已到；F：真实当期制度免除此类提交；U：表样/应交节点未核实\nSRC；F；M：SRC-009 第17条,SRC-012；F020；M008\n比较、证据层级、期间与例外：核人员主键、年度、真实提交或授权代办、文件主版本；自述是来源事实，不是“任务完成”或学校评定\nT 情形可能结果 / 下一角色：PASS_FACT/NEEDS_MATERIAL/UNREADABLE/POLICY_UNCONFIRMED；本人或有权代办补正\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "出勤",
          "requirement": "研究规则 R010：\n规则 / 可达阶段：R010 出勤/平时记录来源，P2\nT／F／U 条件：T：当期岗位确有应核出勤或平时记录；F：校本项目证实不要求该项；U：指标适用性不明\nSRC；F；M：SRC-009 第5、24条,SRC-012；F021；M009\n比较、证据层级、期间与例外：权威考勤/单位主管数据与年度、批准假期窗口匹配；存在请假不直接等于旷工，不由出勤分数自动定档\nT 情形可能结果 / 下一角色：PASS_FACT/SOURCE_UNAVAILABLE/CONFLICT/POLICY_UNCONFIRMED；考勤机关及单位人事\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "教学科研",
          "requirement": "研究规则 R011：\n规则 / 可达阶段：R011 教学科研/管理绩效来源，P2\nT／F／U 条件：T：岗位责任和当期评价项目已确定；F：该岗位经有权制度确认不适用某项；U：评价权重或门槛无校本依据\nSRC；F；M：SRC-001,009 第5–8、17条,SRC-012；F019,F022；M005,M010\n比较、证据层级、期间与例外：教学、科研、服务各源按职责、期间及签发机构对齐；只核“某记录是否存在且属本人”，不自动加总成绩、优秀比例或不合格档次\nT 情形可能结果 / 下一角色：PASS_FACT/SOURCE_UNAVAILABLE/CONFLICT/POLICY_UNCONFIRMED；业绩数据源与单位考核组\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "接收",
          "requirement": "研究规则 R012：\n规则 / 可达阶段：R012 接收/派出单位意见，P2（D）\nT／F／U 条件：T：有权机关确认外派情形须接收单位意见；F：无外派或有权规则不要求；U：哪个单位主评或认可范围不明\nSRC；F；M：SRC-009 第38条,SRC-012；F023；M006,M011\n比较、证据层级、期间与例外：核 issuer + personKey + assignmentPeriod，同源修订关系；接收意见不直接取代现单位考核建议\nT 情形可能结果 / 下一角色：PASS_FACT/NEEDS_MATERIAL/CONFLICT/NEEDS_HUMAN_DECISION；接收/派出机关核签\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "既有师德权威结论引用",
          "requirement": "研究规则 R013：\n规则 / 可达阶段：R013 既有师德权威结论引用，P2（仅已形成）\nT／F／U 条件：T：有权源确认存在可引用的既有师德文书；F：有权源确认当前没有可引用先期结论时该引用支线 NA；U：未能查询不代表“没有记录”\nSRC；F；M：SRC-002,003,008,011；F024,F025；M012\n比较、证据层级、期间与例外：校验对象、年度、种类、状态、签发与撤销；年度师德≠失范处理≠职称专项；最小披露，不传举报原卷\nT 情形可能结果 / 下一角色：PASS_FACT/SOURCE_UNAVAILABLE/CONFLICT/NEEDS_HUMAN_DECISION；党委教师工作部/师德保管机关\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "科研诚信已认定决定引用",
          "requirement": "研究规则 R014：\n规则 / 可达阶段：R014 科研诚信已认定决定引用，P2（G 或相关）\nT／F／U 条件：T：科研诚信机关确认有正式有效且获准引用的结论；F：权威确认无可引用相关决定；U：只有论文争议或举报、处理效力未明\nSRC；F；M：SRC-006 第9、16、21–23条；F026；M013\n比较、证据层级、期间与例外：按决定号、签发机关、人员/期间及复核状态比对；科研违规定性和是否影响年度由不同有权业务处理，不从关键词映射 F034\nT 情形可能结果 / 下一角色：PASS_FACT/SOURCE_UNAVAILABLE/CONFLICT/NEEDS_HUMAN_DECISION；科研诚信处理机关，必要时师德/人事归口\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "举报与正式调查程序状态",
          "requirement": "研究规则 R015：\n规则 / 可达阶段：R015 举报与正式调查程序状态，P2（G）\nT／F／U 条件：T：有权机关发出受限合法可用状态；F：已核只有普通投诉、并无适用的“正式立案”程序时第42条立案分支 NA；U：举报文本、匿名线索、未授权状态无法确认\nSRC；F；M：SRC-008 第4–5项,SRC-009 第42条；F027,F028；M014\n比较、证据层级、期间与例外：分清举报/受理/正式立案/待结案/处理生效；只有第42条法定前提及人员适用经有权确认才移交考核机关；受限 opaque ref 不暴露原文\nT 情形可能结果 / 下一角色：PASS_FACT/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION/CONFLICT；纪检/师德有权机关，年度处理交正式考核机关\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "单位建议的真实形成与授权",
          "requirement": "研究规则 R016：\n规则 / 可达阶段：R016 单位建议的真实形成与授权，P3\nT／F／U 条件：T：有会议和具权考核组建议；F：单位建议阶段尚未开始为 DEFERRED 而非 NA；U：组员权限或本校组织程序未知\nSRC；F；M：SRC-009 第16–17条,SRC-012；F029,F030；M003,M015\n比较、证据层级、期间与例外：比对授权名册版本、会议日期、评议对象及建议文本；建议不能填 F032 正式档次，会议证据更正需原组核签\nT 情形可能结果 / 下一角色：PASS_FACT/UNREADABLE/NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED；二级单位授权评议组/人事归口\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "年度正式结果的个人效力",
          "requirement": "研究规则 R017：\n规则 / 可达阶段：R017 年度正式结果的个人效力，P4（结果生成后）\nT／F／U 条件：T：有权机关确认 M016 已签发；F：尚未作出为 DEFERRED；U：会议议题/截图是否为个人生效决定不明\nSRC；F；M：SRC-004,005,009；F031,F032,F035,F036；M016\n比较、证据层级、期间与例外：核人员、年度、等级原字段、签发权、有效时点/替代链；公开会议通报仅证明历史议题，不能生成个人档次\nT 情形可能结果 / 下一角色：PASS_FACT/SOURCE_UNAVAILABLE/CONFLICT/NEEDS_HUMAN_DECISION；年度结果原签发机关\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "师德年度结果的独立终局效力",
          "requirement": "研究规则 R018：\n规则 / 可达阶段：R018 师德年度结果的独立终局效力，P4（师德链生成后）\nT／F／U 条件：T：师德有权机关确认 M017 最终签发；F：该人员类型经有权制度证明不走师德年度评价则 NA；U：仅有“审议”或未明终局机关\nSRC；F；M：SRC-004,005,008,011,012；F033–F036；M017\n比较、证据层级、期间与例外：核师德链自己的文号、等级原文字段、终局机关/生效，不得用 M016 或 SRC-005 的“审议”替代；等级编码未证不得自动解释\nT 情形可能结果 / 下一角色：PASS_FACT/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED；师德最终有权机关及人事归口\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "双结果引用一致性",
          "requirement": "研究规则 R019：\n规则 / 可达阶段：R019 双结果引用一致性，P4–P6（两链有状态后）\nT／F／U 条件：T：年度与师德两链至少有一项正式状态供核对；F：依法无师德链且无此关联目标时 NA；U：政策规定的先后及联动效果不明\nSRC；F；M：SRC-002,003,004,005,011；F024,F025,F031–F036；M012,M016,M017\n比较、证据层级、期间与例外：两文书分别对人/年/效力/版本；可展示“年度已决、师德待决定”，不可自动由一份补另一份，也不可据宣传文字倒推档次\nT 情形可能结果 / 下一角色：PASS_FACT/CONFLICT/POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；年度与师德源端各自核实\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "结果通知与送达事实",
          "requirement": "研究规则 R020：\n规则 / 可达阶段：R020 结果通知与送达事实，P5\nT／F／U 条件：T：某正式结果已进入规定告知阶段；F：该结果未生成为 DEFERRED；U：告知方式/时间条件未明确\nSRC；F；M：SRC-001 第70条,SRC-009 第17条,SRC-012；F037；M016,M017,M018\n比较、证据层级、期间与例外：核送达对象、渠道、时间及原决定版本；没有收件回执不自动推定对方认可；当前送达期限未核，保留待人工\nT 情形可能结果 / 下一角色：PASS_FACT/NEEDS_MATERIAL/CONFLICT/POLICY_UNCONFIRMED；正式送达经办/权利救济受理者\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "异议",
          "requirement": "研究规则 R021：\n规则 / 可达阶段：R021 异议/复核提交与受理事实，P5（H）\nT／F／U 条件：T：本人或法定代理实际提出相关请求；F：没有申请时该支线 NA；U：期限、代理权、受理类别/机关不明\nSRC；F；M：SRC-001,008,009 第36条,SRC-012；F037,F038；M018,M019\n比较、证据层级、期间与例外：按申请人、针对的源决定、递交时间、申请版本和有效受理回执核对；没有本校期限不得算法判逾期或剥夺申诉\nT 情形可能结果 / 下一角色：PASS_FACT/NEEDS_MATERIAL/CONFLICT/POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；有权受理/复核机关\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "复核结果与原决定更替关系",
          "requirement": "研究规则 R022：\n规则 / 可达阶段：R022 复核结果与原决定更替关系，P5–P6（H）\nT／F／U 条件：T：有权复核/原机关已作变更、维持或撤销文书；F：复核尚未决定为 DEFERRED；U：两机关意见冲突或替代范围不明\nSRC；F；M：SRC-001,008,009；F031,F033,F039,F040,F044；M016,M017,M020,M022\n比较、证据层级、期间与例外：核 originalRef + remedyRef + issuer + scope + validFrom + supersedes/revokedAt；“本人上传新 PDF”绝不自动撤销既有正式结果\nT 情形可能结果 / 下一角色：PASS_FACT/CONFLICT/SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；原签发机关与合法复核机关\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "下游共享的目的、身份与权限",
          "requirement": "研究规则 R023：\n规则 / 可达阶段：R023 下游共享的目的、身份与权限，P6（I）\nT／F／U 条件：T：有真实职称/聘期/导师等调用且源端授权该字段；F：无调用时 NA；U：授权有效性、源决定效力或用途未明\nSRC；F；M：SRC-003,007,009 第27条,014,016；F001,F031–F042；M016,M017,M020,M021\n比较、证据层级、期间与例外：匹配调用人、对象、年度、用途、最小字段、授权过期与源决定版本；职称专题会、聘期决定和导师岗位年度考核各由下游/相应主管机关形成；不共享原始投诉\nT 情形可能结果 / 下一角色：PASS_FACT/SOURCE_UNAVAILABLE/CONFLICT/NEEDS_HUMAN_DECISION；源结果管理机关和下游业务 Owner\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "文件可读性、版本与技术依赖",
          "requirement": "研究规则 R024：\n规则 / 可达阶段：R024 文件可读性、版本与技术依赖，P0–P6（横切）\nT／F／U 条件：T：某当前应核 M 已绑定来源版本；F：依法不适用的材料槽不执行；U：文件无归属/无法识别对应主体\nSRC；F；M：SRC-001,009（仅管理责任背景，非哈希算法依据）；F001,F007,F044；M001–M022\n比较、证据层级、期间与例外：先检可读性/页码/文件哈希、源版本、目标字段定位、被替代关系；OCR 未识别不等于材料缺失；仅撤销受影响技术结果、不更改行政决定\nT 情形可能结果 / 下一角色：PASS_FACT/UNREADABLE/CONFLICT/SOURCE_UNAVAILABLE；材料持有人/源机关和系统技术审核经办\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "intake",
      "name": "材料与身份初核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "fact-review",
      "workflowOwner": "local"
    },
    {
      "id": "fact-review",
      "name": "事实、证据与规则核对",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "final-review",
      "returnToStageId": "intake",
      "workflowOwner": "local"
    },
    {
      "id": "final-review",
      "name": "本地人工复核与结果整理",
      "kind": "finalize",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "review-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-actions",
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
  "templateId": "T02-T05",
  "name": "教职工年度考核与师德考核关联事实审核",
  "officialSchoolTemplate": false,
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T02-T05.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T02-T05.md",
  "sourceDocumentSha256": "5e134b0a38d4b3ec2a3eebe7a54155eb9a7deca3004adb8ab9bfd641c77e2e26",
  "sourceOriginalGitBlobSha": "5abf822b88712c13597e6eca5d35a1f9eee44c1c",
  "sourceSnapshot": "2026-10-23",
  "researchAsOf": "2026-10-23",
  "researchEvidenceStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "authoringStatus": "RESEARCH_HANDOFF_READY",
  "fieldIds": [
    {
      "sourceId": "F001",
      "fieldKey": "f001",
      "label": "稳定人员键"
    },
    {
      "sourceId": "F002",
      "fieldKey": "f002",
      "label": "姓名/曾用名"
    },
    {
      "sourceId": "F003",
      "fieldKey": "f003",
      "label": "归属单位"
    },
    {
      "sourceId": "F004",
      "fieldKey": "f004",
      "label": "受聘岗位类别"
    },
    {
      "sourceId": "F005",
      "fieldKey": "f005",
      "label": "人员聘用关系类别"
    },
    {
      "sourceId": "F006",
      "fieldKey": "f006",
      "label": "特殊授权审核路线"
    },
    {
      "sourceId": "F007",
      "fieldKey": "f007",
      "label": "考核年度"
    },
    {
      "sourceId": "F008",
      "fieldKey": "f008",
      "label": "当期政策版本引用"
    },
    {
      "sourceId": "F009",
      "fieldKey": "f009",
      "label": "各阶段办理时间窗"
    },
    {
      "sourceId": "F010",
      "fieldKey": "f010",
      "label": "发起人可信主体标识"
    },
    {
      "sourceId": "F011",
      "fieldKey": "f011",
      "label": "代办授权范围"
    },
    {
      "sourceId": "F012",
      "fieldKey": "f012",
      "label": "任职服务区间"
    },
    {
      "sourceId": "F013",
      "fieldKey": "f013",
      "label": "是否首次就业"
    },
    {
      "sourceId": "F014",
      "fieldKey": "f014",
      "label": "既往任职区间"
    },
    {
      "sourceId": "F015",
      "fieldKey": "f015",
      "label": "兼任岗位引用"
    },
    {
      "sourceId": "F016",
      "fieldKey": "f016",
      "label": "外派派驻记录"
    },
    {
      "sourceId": "F017",
      "fieldKey": "f017",
      "label": "请假类别"
    },
    {
      "sourceId": "F018",
      "fieldKey": "f018",
      "label": "已批准请假期间"
    },
    {
      "sourceId": "F019",
      "fieldKey": "f019",
      "label": "岗位任务基准引用"
    },
    {
      "sourceId": "F020",
      "fieldKey": "f020",
      "label": "年度个人陈述引用"
    },
    {
      "sourceId": "F021",
      "fieldKey": "f021",
      "label": "考勤事实引用"
    },
    {
      "sourceId": "F022",
      "fieldKey": "f022",
      "label": "履职业绩事实引用"
    },
    {
      "sourceId": "F023",
      "fieldKey": "f023",
      "label": "外派接收单位意见引用"
    },
    {
      "sourceId": "F024",
      "fieldKey": "f024",
      "label": "既有师德结论状态"
    },
    {
      "sourceId": "F025",
      "fieldKey": "f025",
      "label": "既有师德决定引用"
    },
    {
      "sourceId": "F026",
      "fieldKey": "f026",
      "label": "科研诚信正式决定引用"
    },
    {
      "sourceId": "F027",
      "fieldKey": "f027",
      "label": "调查程序阶段"
    },
    {
      "sourceId": "F028",
      "fieldKey": "f028",
      "label": "受限调查记录引用"
    },
    {
      "sourceId": "F029",
      "fieldKey": "f029",
      "label": "单位评审授权证明"
    },
    {
      "sourceId": "F030",
      "fieldKey": "f030",
      "label": "单位评审建议引用"
    },
    {
      "sourceId": "F031",
      "fieldKey": "f031",
      "label": "年度考核正式决定引用"
    },
    {
      "sourceId": "F032",
      "fieldKey": "f032",
      "label": "年度考核档次"
    },
    {
      "sourceId": "F033",
      "fieldKey": "f033",
      "label": "师德年度正式决定引用"
    },
    {
      "sourceId": "F034",
      "fieldKey": "f034",
      "label": "师德考核结论状态"
    },
    {
      "sourceId": "F035",
      "fieldKey": "f035",
      "label": "决定生效时间"
    },
    {
      "sourceId": "F036",
      "fieldKey": "f036",
      "label": "决定签发权限证明"
    },
    {
      "sourceId": "F037",
      "fieldKey": "f037",
      "label": "结果送达记录引用"
    },
    {
      "sourceId": "F038",
      "fieldKey": "f038",
      "label": "异议/复核申请引用"
    },
    {
      "sourceId": "F039",
      "fieldKey": "f039",
      "label": "复核决定引用"
    },
    {
      "sourceId": "F040",
      "fieldKey": "f040",
      "label": "撤销替代效力链"
    },
    {
      "sourceId": "F041",
      "fieldKey": "f041",
      "label": "下游复用目的"
    },
    {
      "sourceId": "F042",
      "fieldKey": "f042",
      "label": "下游复用授权引用"
    },
    {
      "sourceId": "F043",
      "fieldKey": "f043",
      "label": "可信 Actor 权限快照"
    },
    {
      "sourceId": "F044",
      "fieldKey": "f044",
      "label": "证据归属版本关系图"
    }
  ],
  "materialSlotIds": [
    {
      "sourceId": "M001",
      "slotId": "m001",
      "name": "当期年度、适用对象、阶段期限、师德规则"
    },
    {
      "sourceId": "M002",
      "slotId": "m002",
      "name": "员工身份、聘用/岗位类别、任职期间"
    },
    {
      "sourceId": "M003",
      "slotId": "m003",
      "name": "申报/代办者真实权限"
    },
    {
      "sourceId": "M004",
      "slotId": "m004",
      "name": "前单位任职时段、原单位履职事实"
    },
    {
      "sourceId": "M005",
      "slotId": "m005",
      "name": "考核岗位责任、双岗位/调整生效"
    },
    {
      "sourceId": "M006",
      "slotId": "m006",
      "name": "外派性质、派出授权、起止期间"
    },
    {
      "sourceId": "M007",
      "slotId": "m007",
      "name": "法定请假类别与批准期间"
    },
    {
      "sourceId": "M008",
      "slotId": "m008",
      "name": "本人年度履职陈述"
    },
    {
      "sourceId": "M009",
      "slotId": "m009",
      "name": "考勤与日常履职事实"
    },
    {
      "sourceId": "M010",
      "slotId": "m010",
      "name": "业绩/任务完成的来源事实"
    },
    {
      "sourceId": "M011",
      "slotId": "m011",
      "name": "在外期间的履职评价"
    },
    {
      "sourceId": "M012",
      "slotId": "m012",
      "name": "已形成且可引用的师德结论/状态"
    },
    {
      "sourceId": "M013",
      "slotId": "m013",
      "name": "科研诚信已正式认定的结论"
    },
    {
      "sourceId": "M014",
      "slotId": "m014",
      "name": "程序确实走到何阶段"
    },
    {
      "sourceId": "M015",
      "slotId": "m015",
      "name": "单位考核组织确实作出建议"
    },
    {
      "sourceId": "M016",
      "slotId": "m016",
      "name": "年度正式档次及签发依据"
    },
    {
      "sourceId": "M017",
      "slotId": "m017",
      "name": "师德年度有效结论及最终签发者"
    },
    {
      "sourceId": "M018",
      "slotId": "m018",
      "name": "结果已告知本人及意见签署"
    },
    {
      "sourceId": "M019",
      "slotId": "m019",
      "name": "本人的事实异议、复核/申诉意愿"
    },
    {
      "sourceId": "M020",
      "slotId": "m020",
      "name": "复核后的有效处理、更正或撤销"
    },
    {
      "sourceId": "M021",
      "slotId": "m021",
      "name": "下游请求用途、字段授权及时间范围"
    },
    {
      "sourceId": "M022",
      "slotId": "m022",
      "name": "文件与记录归属、版本、变更、技术审核依赖"
    }
  ],
  "criteria": [
    {
      "sectionId": "rule-checks",
      "criterionId": "r001",
      "srcIds": [
        "SRC-001",
        "SRC-009",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r002",
      "srcIds": [
        "SRC-001",
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r003",
      "srcIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r004",
      "srcIds": [
        "SRC-001",
        "SRC-009",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r005",
      "srcIds": [
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r006",
      "srcIds": [
        "SRC-001",
        "SRC-009",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r007",
      "srcIds": [
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r008",
      "srcIds": [
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r009",
      "srcIds": [
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r010",
      "srcIds": [
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r011",
      "srcIds": [
        "SRC-001",
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r012",
      "srcIds": [
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r013",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-008",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r014",
      "srcIds": [
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r015",
      "srcIds": [
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r016",
      "srcIds": [
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r017",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r018",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-008",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r019",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r020",
      "srcIds": [
        "SRC-001",
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r021",
      "srcIds": [
        "SRC-001",
        "SRC-008",
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r022",
      "srcIds": [
        "SRC-001",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r023",
      "srcIds": [
        "SRC-003",
        "SRC-007",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r024",
      "srcIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ],
  "sourceIndexIds": [
    "SRC-001",
    "SRC-002",
    "SRC-003",
    "SRC-004",
    "SRC-005",
    "SRC-006",
    "SRC-007",
    "SRC-008",
    "SRC-009",
    "SRC-010",
    "SRC-011",
    "SRC-012",
    "SRC-013",
    "SRC-014",
    "SRC-015",
    "SRC-016"
  ]
} as const
