import type { TemplateVersion } from '@profer/shared'

/** Generated from the R02 research handoff; policy gaps remain manual. */
export const template: TemplateVersion = {
  "templateId": "S04-T07",
  "version": 1,
  "schemaVersion": 2,
  "name": "学生处分解除、撤销和影响期满资格核验",
  "description": "本地研究模板 · 非校方正式模板。学生处分解除、撤销和影响期满资格核验；只做材料归属、可读性、版本一致性与待核事项整理。校本规则、权限与正式决定必须由有权人员人工确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；SRC IDs 仅为研究来源索引，不是案卷材料 SourceRef。政策证据状态为 PARTIAL；所有未确认政策/权限/效力项均须人工复核。",
  "objectType": "person",
  "displayName": {
    "template": "{{F002}} · 学生处分解除、撤销和影响期满资格核验"
  },
  "fields": [
    {
      "key": "F001",
      "label": "认证操作人 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：string／申请主体；P0—P7；学校可信认证或人工核验；治理约束；M001；L2；未核身份不得进行个人信息访问；string／申请主体；P0—P7；学校可信认证或人工核验；治理约束；M001；L2；未核身份不得进行个人信息访问。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F001；原稿字段合同：string／申请主体；P0—P7；学校可信认证或人工核验；治理约束；M001；L2；未核身份不得进行个人信息访问；string／申请主体；P0—P7；学校可信认证或人工核验；治理约束；M001；L2；未核身份不得进行个人信息访问；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F002",
      "label": "操作人与学生关系",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "options": [
        {
          "value": "本人",
          "label": "本人"
        },
        {
          "value": "代理",
          "label": "代理"
        },
        {
          "value": "学校工作人员",
          "label": "学校工作人员"
        },
        {
          "value": "未知",
          "label": "未知"
        }
      ],
      "extractionHint": "原稿类型/对象与证据定位：enum（本人／代理／学校工作人员／未知）／申请主体；P0—P1；可信权限记录、申请陈述核对；M001,M003；L2；未知不授予代办权限；enum（本人／代理／学校工作人员／未知）／申请主体；P0—P1；可信权限记录、申请陈述核对；M001,M003；L2；未知不授予代办权限。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F002；原稿字段合同：enum（本人／代理／学校工作人员／未知）／申请主体；P0—P1；可信权限记录、申请陈述核对；M001,M003；L2；未知不授予代办权限；enum（本人／代理／学校工作人员／未知）／申请主体；P0—P1；可信权限记录、申请陈述核对；M001,M003；L2；未知不授予代办权限；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F003",
      "label": "代理授权核验引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：reference／授权；P0—P1、P7；有权部门核验；校本代理细则未知 SRC-008；M003；L3；本人申请不适用；代理缺失暂停代理办理；reference／授权；P0—P1、P7；有权部门核验；校本代理细则未知 SRC-008；M003；L3；本人申请不适用；代理缺失暂停代理办理。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F003；原稿字段合同：reference／授权；P0—P1、P7；有权部门核验；校本代理细则未知 SRC-008；M003；L3；本人申请不适用；代理缺失暂停代理办理；reference／授权；P0—P1、P7；有权部门核验；校本代理细则未知 SRC-008；M003；L3；本人申请不适用；代理缺失暂停代理办理；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F004",
      "label": "学校学生唯一身份键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：string／被处分学生；P0—P7；可信学籍／留学生记录，SRC-001,003；M002；L2；不能以 OCR 学号独立确认；string／被处分学生；P0—P7；可信学籍／留学生记录，SRC-001,003；M002；L2；不能以 OCR 学号独立确认。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F004；原稿字段合同：string／被处分学生；P0—P7；可信学籍／留学生记录，SRC-001,003；M002；L2；不能以 OCR 学号独立确认；string／被处分学生；P0—P7；可信学籍／留学生记录，SRC-001,003；M002；L2；不能以 OCR 学号独立确认；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F005",
      "label": "学生校方标准姓名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：string／被处分学生；P0—P7；学校身份记录与必要变更证明；M002；L2；同名/曾用名待人工核，禁止模糊强配；string／被处分学生；P0—P7；学校身份记录与必要变更证明；M002；L2；同名/曾用名待人工核，禁止模糊强配。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F005；原稿字段合同：string／被处分学生；P0—P7；学校身份记录与必要变更证明；M002；L2；同名/曾用名待人工核，禁止模糊强配；string／被处分学生；P0—P7；学校身份记录与必要变更证明；M002；L2；同名/曾用名待人工核，禁止模糊强配；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F006",
      "label": "身份制度类别",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "options": [
        {
          "value": "普通学历",
          "label": "普通学历"
        },
        {
          "value": "来华留学生",
          "label": "来华留学生"
        },
        {
          "value": "港澳台侨",
          "label": "港澳台侨"
        },
        {
          "value": "离校",
          "label": "离校"
        },
        {
          "value": "不明",
          "label": "不明"
        }
      ],
      "extractionHint": "原稿类型/对象与证据定位：enum（普通学历／来华留学生／港澳台侨／离校／不明）／学生；P0；校方学籍及注册类型；SRC-001,003,004；M002；L2；不明即 POLICY_UNCONFIRMED；enum（普通学历／来华留学生／港澳台侨／离校／不明）／学生；P0；校方学籍及注册类型；SRC-001,003,004；M002；L2；不明即 POLICY_UNCONFIRMED。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F006；原稿字段合同：enum（普通学历／来华留学生／港澳台侨／离校／不明）／学生；P0；校方学籍及注册类型；SRC-001,003,004；M002；L2；不明即 POLICY_UNCONFIRMED；enum（普通学历／来华留学生／港澳台侨／离校／不明）／学生；P0；校方学籍及注册类型；SRC-001,003,004；M002；L2；不明即 POLICY_UNCONFIRMED；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F007",
      "label": "学段／培养类别",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "options": [
        {
          "value": "专科",
          "label": "专科"
        },
        {
          "value": "本科",
          "label": "本科"
        },
        {
          "value": "硕士",
          "label": "硕士"
        },
        {
          "value": "博士",
          "label": "博士"
        },
        {
          "value": "预科",
          "label": "预科"
        },
        {
          "value": "语言",
          "label": "语言"
        },
        {
          "value": "进修",
          "label": "进修"
        },
        {
          "value": "交换",
          "label": "交换"
        },
        {
          "value": "其它",
          "label": "其它"
        }
      ],
      "extractionHint": "原稿类型/对象与证据定位：enum（专科／本科／硕士／博士／预科／语言／进修／交换／其它）／学生；P0；校方记录；SRC-001,003；M002；L2；无法识别不得套用普通生期限；enum（专科／本科／硕士／博士／预科／语言／进修／交换／其它）／学生；P0；校方记录；SRC-001,003；M002；L2；无法识别不得套用普通生期限。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F007；原稿字段合同：enum（专科／本科／硕士／博士／预科／语言／进修／交换／其它）／学生；P0；校方记录；SRC-001,003；M002；L2；无法识别不得套用普通生期限；enum（专科／本科／硕士／博士／预科／语言／进修／交换／其它）／学生；P0；校方记录；SRC-001,003；M002；L2；无法识别不得套用普通生期限；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F008",
      "label": "所属学院／培养单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：string+unit_id／学生；P0—P4；校方在案所属关系与变更史；M002；L2；学院变更需确认当前考察责任主体；string+unit_id／学生；P0—P4；校方在案所属关系与变更史；M002；L2；学院变更需确认当前考察责任主体。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F008；原稿字段合同：string+unit_id／学生；P0—P4；校方在案所属关系与变更史；M002；L2；学院变更需确认当前考察责任主体；string+unit_id／学生；P0—P4；校方在案所属关系与变更史；M002；L2；学院变更需确认当前考察责任主体；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F009",
      "label": "在读／休退毕业等身份状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：enum+date_range／学生；P0,P2,P7；学籍／留学生部门有权记录；M002,M008；L2；状态不明人工核对是否受理；enum+date_range／学生；P0,P2,P7；学籍／留学生部门有权记录；M002,M008；L2；状态不明人工核对是否受理。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F009；原稿字段合同：enum+date_range／学生；P0,P2,P7；学籍／留学生部门有权记录；M002,M008；L2；状态不明人工核对是否受理；enum+date_range／学生；P0,P2,P7；学籍／留学生部门有权记录；M002,M008；L2；状态不明人工核对是否受理；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F010",
      "label": "处分权威记录键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：string／原处分；P1—P7；学校原处分台账或正式文书；SRC-001,003；M004,M005；L3；无匹配时先调档，不凭申请新造处分；string／原处分；P1—P7；学校原处分台账或正式文书；SRC-001,003；M004,M005；L3；无匹配时先调档，不凭申请新造处分。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F010；原稿字段合同：string／原处分；P1—P7；学校原处分台账或正式文书；SRC-001,003；M004,M005；L3；无匹配时先调档，不凭申请新造处分；string／原处分；P1—P7；学校原处分台账或正式文书；SRC-001,003；M004,M005；L3；无匹配时先调档，不凭申请新造处分；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F011",
      "label": "原处分决定文号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：string／原处分；P1—P7；正式处分决定书；SRC-001 第 36 条；M004；L3；文号缺可用权威记录定位，不能凭文号猜测；string／原处分；P1—P7；正式处分决定书；SRC-001 第 36 条；M004；L3；文号缺可用权威记录定位，不能凭文号猜测。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F011；原稿字段合同：string／原处分；P1—P7；正式处分决定书；SRC-001 第 36 条；M004；L3；文号缺可用权威记录定位，不能凭文号猜测；string／原处分；P1—P7；正式处分决定书；SRC-001 第 36 条；M004；L3；文号缺可用权威记录定位，不能凭文号猜测；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F012",
      "label": "决定书上的受处分人键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：string／原处分；P1—P7；正式文书与可信校方关联；M004；L3；与 F004 不同则 CONFLICT；string／原处分；P1—P7；正式文书与可信校方关联；M004；L3；与 F004 不同则 CONFLICT。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F012；原稿字段合同：string／原处分；P1—P7；正式文书与可信校方关联；M004；L3；与 F004 不同则 CONFLICT；string／原处分；P1—P7；正式文书与可信校方关联；M004；L3；与 F004 不同则 CONFLICT；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F013",
      "label": "处分种类",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "options": [
        {
          "value": "警告",
          "label": "警告"
        },
        {
          "value": "严重警告",
          "label": "严重警告"
        },
        {
          "value": "记过",
          "label": "记过"
        },
        {
          "value": "留校察看",
          "label": "留校察看"
        },
        {
          "value": "开除学籍",
          "label": "开除学籍"
        }
      ],
      "extractionHint": "原稿类型/对象与证据定位：enum（警告／严重警告／记过／留校察看／开除学籍）／原处分；P1—P7；处分决定书，SRC-001,003,005；M004,M005；L3；不能按上传者描述自行定级；enum（警告／严重警告／记过／留校察看／开除学籍）／原处分；P1—P7；处分决定书，SRC-001,003,005；M004,M005；L3；不能按上传者描述自行定级。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F013；原稿字段合同：enum（警告／严重警告／记过／留校察看／开除学籍）／原处分；P1—P7；处分决定书，SRC-001,003,005；M004,M005；L3；不能按上传者描述自行定级；enum（警告／严重警告／记过／留校察看／开除学籍）／原处分；P1—P7；处分决定书，SRC-001,003,005；M004,M005；L3；不能按上传者描述自行定级；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F014",
      "label": "处分决定落款日期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：date／原处分；P2—P7；正式决定书 SRC-001,003；M004；L3；缺日期只提示，不推算时限；date／原处分；P2—P7；正式决定书 SRC-001,003；M004；L3；缺日期只提示，不推算时限。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F014；原稿字段合同：date／原处分；P2—P7；正式决定书 SRC-001,003；M004；L3；缺日期只提示，不推算时限；date／原处分；P2—P7；正式决定书 SRC-001,003；M004；L3；缺日期只提示，不推算时限；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F015",
      "label": "处分送达日期／证据",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：date+ref／原处分；P2—P7；送达记录，SRC-001 第 37 条；M004,M005；L3；起算与救济关联不明，暂停时间结论；date+ref／原处分；P2—P7；送达记录，SRC-001 第 37 条；M004,M005；L3；起算与救济关联不明，暂停时间结论。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F015；原稿字段合同：date+ref／原处分；P2—P7；送达记录，SRC-001 第 37 条；M004,M005；L3；起算与救济关联不明，暂停时间结论；date+ref／原处分；P2—P7；送达记录，SRC-001 第 37 条；M004,M005；L3；起算与救济关联不明，暂停时间结论；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F016",
      "label": "决定有效起算日",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：date+policy_basis／原处分；P2—P7；决定载明及现行有效校规 SRC-007；M004,M019；L3；与落款／送达不强行画等号；date+policy_basis／原处分；P2—P7；决定载明及现行有效校规 SRC-007；M004,M019；L3；与落款／送达不强行画等号。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F016；原稿字段合同：date+policy_basis／原处分；P2—P7；决定载明及现行有效校规 SRC-007；M004,M019；L3；与落款／送达不强行画等号；date+policy_basis／原处分；P2—P7；决定载明及现行有效校规 SRC-007；M004,M019；L3；与落款／送达不强行画等号；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F017",
      "label": "原处分出文机构",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：unit_id+ref／原处分；P1—P7；校级正式决定、归口核验 SRC-001,003；M004；L1；出文身份未核时不能认定文书有效；unit_id+ref／原处分；P1—P7；校级正式决定、归口核验 SRC-001,003；M004；L1；出文身份未核时不能认定文书有效。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F017；原稿字段合同：unit_id+ref／原处分；P1—P7；校级正式决定、归口核验 SRC-001,003；M004；L1；出文身份未核时不能认定文书有效；unit_id+ref／原处分；P1—P7；校级正式决定、归口核验 SRC-001,003；M004；L1；出文身份未核时不能认定文书有效；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F018",
      "label": "原处分当前权威状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：enum+as_of／处分状态；P2—P7；校方处分记录／档案核对；M005；L3；不以 OCR 或学院列表覆盖；enum+as_of／处分状态；P2—P7；校方处分记录／档案核对；M005；L3；不以 OCR 或学院列表覆盖。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F018；原稿字段合同：enum+as_of／处分状态；P2—P7；校方处分记录／档案核对；M005；L3；不以 OCR 或学院列表覆盖；enum+as_of／处分状态；P2—P7；校方处分记录／档案核对；M005；L3；不以 OCR 或学院列表覆盖；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F019",
      "label": "原处分适用政策版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：policy_ref／政策；P0,P2—P5；正式发文及过渡规则 SRC-001,002,003,007；M019；L0；普通生未知为 POLICY_UNCONFIRMED；policy_ref／政策；P0,P2—P5；正式发文及过渡规则 SRC-001,002,003,007；M019；L0；普通生未知为 POLICY_UNCONFIRMED。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F019；原稿字段合同：policy_ref／政策；P0,P2—P5；正式发文及过渡规则 SRC-001,002,003,007；M019；L0；普通生未知为 POLICY_UNCONFIRMED；policy_ref／政策；P0,P2—P5；正式发文及过渡规则 SRC-001,002,003,007；M019；L0；普通生未知为 POLICY_UNCONFIRMED；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F020",
      "label": "正式休复学区间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：interval[]／处分期间；P2,P4；学籍决定，不是病假说明 SRC-001,003；M008；L2；仅有休学线索时按条件待核，不能推延长日数；interval[]／处分期间；P2,P4；学籍决定，不是病假说明 SRC-001,003；M008；L2；仅有休学线索时按条件待核，不能推延长日数。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F020；原稿字段合同：interval[]／处分期间；P2,P4；学籍决定，不是病假说明 SRC-001,003；M008；L2；仅有休学线索时按条件待核，不能推延长日数；interval[]／处分期间；P2,P4；学籍决定，不是病假说明 SRC-001,003；M008；L2；仅有休学线索时按条件待核，不能推延长日数；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F021",
      "label": "后续处分决定关联",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：reference[]／处分链；P2—P7；各原处分权威决定；M005,M009；L3；发现冲突按不同处分分别定位；reference[]／处分链；P2—P7；各原处分权威决定；M005,M009；L3；发现冲突按不同处分分别定位。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F021；原稿字段合同：reference[]／处分链；P2—P7；各原处分权威决定；M005,M009；L3；发现冲突按不同处分分别定位；reference[]／处分链；P2—P7；各原处分权威决定；M005,M009；L3；发现冲突按不同处分分别定位；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F022",
      "label": "变更／延长决定关联",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：reference[]／处分链；P2—P7；学校更正、变更、延长正式文书；M005,M010；L3；自述存在但无权威件时待核；reference[]／处分链；P2—P7；学校更正、变更、延长正式文书；M005,M010；L3；自述存在但无权威件时待核。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F022；原稿字段合同：reference[]／处分链；P2—P7；学校更正、变更、延长正式文书；M005,M010；L3；自述存在但无权威件时待核；reference[]／处分链；P2—P7；学校更正、变更、延长正式文书；M005,M010；L3；自述存在但无权威件时待核；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F023",
      "label": "解释性候选届满日",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：date；null／时限计算派生值；P2,P4；F013,F016,F019—F022；不是正式期限判定；M004,M008—M010,M019；L3；政策不明输出 null，不将日期当学校批准；date；null／时限计算派生值；P2,P4；F013,F016,F019—F022；不是正式期限判定；M004,M008—M010,M019；L3；政策不明输出 null，不将日期当学校批准。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F023；原稿字段合同：date；null／时限计算派生值；P2,P4；F013,F016,F019—F022；不是正式期限判定；M004,M008—M010,M019；L3；政策不明输出 null，不将日期当学校批准；date；null／时限计算派生值；P2,P4；F013,F016,F019—F022；不是正式期限判定；M004,M008—M010,M019；L3；政策不明输出 null，不将日期当学校批准；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F024",
      "label": "请求类型",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "options": [
        {
          "value": "期满",
          "label": "期满"
        },
        {
          "value": "提前",
          "label": "提前"
        },
        {
          "value": "状态核对",
          "label": "状态核对"
        },
        {
          "value": "申诉转介",
          "label": "申诉转介"
        }
      ],
      "extractionHint": "原稿类型/对象与证据定位：enum（期满／提前／状态核对／申诉转介）／申请；P1—P7；本人申请陈述；校本表单 SRC-008 待核；M006,M015；L2；无法区分则请申请人明确目的；enum（期满／提前／状态核对／申诉转介）／申请；P1—P7；本人申请陈述；校本表单 SRC-008 待核；M006,M015；L2；无法区分则请申请人明确目的。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F024；原稿字段合同：enum（期满／提前／状态核对／申诉转介）／申请；P1—P7；本人申请陈述；校本表单 SRC-008 待核；M006,M015；L2；无法区分则请申请人明确目的；enum（期满／提前／状态核对／申诉转介）／申请；P1—P7；本人申请陈述；校本表单 SRC-008 待核；M006,M015；L2；无法区分则请申请人明确目的；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F025",
      "label": "申请或查档请求接收时点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：datetime／申请；P1；实际受理记录，不假设线上系统；M006；L1；未知不作逾期判断；datetime／申请；P1；实际受理记录，不假设线上系统；M006；L1；未知不作逾期判断。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F025；原稿字段合同：datetime／申请；P1；实际受理记录，不假设线上系统；M006；L1；未知不作逾期判断；datetime／申请；P1；实际受理记录，不假设线上系统；M006；L1；未知不作逾期判断；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F026",
      "label": "申请事实与理由",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：text／申请；P1,P3；申请本人陈述；SRC-001,003；M006；L3；缺则询问目的，不代写悔过事实；text／申请；P1,P3；申请本人陈述；SRC-001,003；M006；L3；缺则询问目的，不代写悔过事实。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F026；原稿字段合同：text／申请；P1,P3；申请本人陈述；SRC-001,003；M006；L3；缺则询问目的，不代写悔过事实；text／申请；P1,P3；申请本人陈述；SRC-001,003；M006；L3；缺则询问目的，不代写悔过事实；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F027",
      "label": "突出表现证据索引",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：reference[]／提前解除；P1—P4；原始奖项／志愿服务／学院记录等，标准未证；M007；L3；B 情形缺则 NEEDS_MATERIAL 或人工核实；reference[]／提前解除；P1—P4；原始奖项／志愿服务／学院记录等，标准未证；M007；L3；B 情形缺则 NEEDS_MATERIAL 或人工核实。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F027；原稿字段合同：reference[]／提前解除；P1—P4；原始奖项／志愿服务／学院记录等，标准未证；M007；L3；B 情形缺则 NEEDS_MATERIAL 或人工核实；reference[]／提前解除；P1—P4；原始奖项／志愿服务／学院记录等，标准未证；M007；L3；B 情形缺则 NEEDS_MATERIAL 或人工核实；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F028",
      "label": "撤回请求及时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：datetime+state／申请状态；P1—P5；当事人请求、校方是否接受尚未核 SRC-008；M006；L2；未经有权受理不得推定申请已撤销；datetime+state／申请状态；P1—P5；当事人请求、校方是否接受尚未核 SRC-008；M006；L2；未经有权受理不得推定申请已撤销。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F028；原稿字段合同：datetime+state／申请状态；P1—P5；当事人请求、校方是否接受尚未核 SRC-008；M006；L2；未经有权受理不得推定申请已撤销；datetime+state／申请状态；P1—P5；当事人请求、校方是否接受尚未核 SRC-008；M006；L2；未经有权受理不得推定申请已撤销；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F029",
      "label": "处分期学院考察记载",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：record+author／学院考察；P3—P5；学院有权记录；SRC-001,003 第 7 条；M011；L3；P1 不必需；到 P3 无记录时交学院；record+author／学院考察；P3—P5；学院有权记录；SRC-001,003 第 7 条；M011；L3；P1 不必需；到 P3 无记录时交学院。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F029；原稿字段合同：record+author／学院考察；P3—P5；学院有权记录；SRC-001,003 第 7 条；M011；L3；P1 不必需；到 P3 无记录时交学院；record+author／学院考察；P3—P5；学院有权记录；SRC-001,003 第 7 条；M011；L3；P1 不必需；到 P3 无记录时交学院；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F030",
      "label": "学院解除审核意见",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：enum+reason／学院审核；P4—P5；学院签署的审核记录 SRC-001,003；M012；L3；P1 后置，不据材料缺失否决；enum+reason／学院审核；P4—P5；学院签署的审核记录 SRC-001,003；M012；L3；P1 后置，不据材料缺失否决。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F030；原稿字段合同：enum+reason／学院审核；P4—P5；学院签署的审核记录 SRC-001,003；M012；L3；P1 后置，不据材料缺失否决；enum+reason／学院审核；P4—P5；学院签署的审核记录 SRC-001,003；M012；L3；P1 后置，不据材料缺失否决；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F031",
      "label": "学院审核者可信身份",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：actor_ref／学院审核；P4—P5；校方组织授权会话，不取 Renderer 字段；M012；L2；未核授权不承认正式学院意见；actor_ref／学院审核；P4—P5；校方组织授权会话，不取 Renderer 字段；M012；L2；未核授权不承认正式学院意见。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F031；原稿字段合同：actor_ref／学院审核；P4—P5；校方组织授权会话，不取 Renderer 字段；M012；L2；未核授权不承认正式学院意见；actor_ref／学院审核；P4—P5；校方组织授权会话，不取 Renderer 字段；M012；L2；未核授权不承认正式学院意见；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F032",
      "label": "学校正式解除文书引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：document_ref／学校决定；P5—P7；学校有权机关签发 SRC-001,003；M013；L3；P1 后置；没有则只能说“尚无解除决定证据”；document_ref／学校决定；P5—P7；学校有权机关签发 SRC-001,003；M013；L3；P1 后置；没有则只能说“尚无解除决定证据”。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F032；原稿字段合同：document_ref／学校决定；P5—P7；学校有权机关签发 SRC-001,003；M013；L3；P1 后置；没有则只能说“尚无解除决定证据”；document_ref／学校决定；P5—P7；学校有权机关签发 SRC-001,003；M013；L3；P1 后置；没有则只能说“尚无解除决定证据”；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F033",
      "label": "学校决定签发机关／授权人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：unit+actor_ref／学校决定；P5—P7；权威签发／授权链 SRC-007,008 待核；M013；L2；仅印章图片不足以验证；unit+actor_ref／学校决定；P5—P7；权威签发／授权链 SRC-007,008 待核；M013；L2；仅印章图片不足以验证。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F033；原稿字段合同：unit+actor_ref／学校决定；P5—P7；权威签发／授权链 SRC-007,008 待核；M013；L2；仅印章图片不足以验证；unit+actor_ref／学校决定；P5—P7；权威签发／授权链 SRC-007,008 待核；M013；L2；仅印章图片不足以验证；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F034",
      "label": "解除决定载明生效日",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：date；null／学校决定；P5—P7；正式解除文书、规则待核；M013；L3；不取上传文件时间代替生效日；date；null／学校决定；P5—P7；正式解除文书、规则待核；M013；L3；不取上传文件时间代替生效日。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F034；原稿字段合同：date；null／学校决定；P5—P7；正式解除文书、规则待核；M013；L3；不取上传文件时间代替生效日；date；null／学校决定；P5—P7；正式解除文书、规则待核；M013；L3；不取上传文件时间代替生效日；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F035",
      "label": "正式送达记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：reference／送达；P6—P7；学校实际送达或归档记录；M014；L3；P1 后置，缺时查校方，不擅改决定效力；reference／送达；P6—P7；学校实际送达或归档记录；M014；L3；P1 后置，缺时查校方，不擅改决定效力。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F035；原稿字段合同：reference／送达；P6—P7；学校实际送达或归档记录；M014；L3；P1 后置，缺时查校方，不擅改决定效力；reference／送达；P6—P7；学校实际送达或归档记录；M014；L3；P1 后置，缺时查校方，不擅改决定效力；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F036",
      "label": "归档位置与版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：archive_ref+version／档案；P6—P7；学校档案 Owner，SRC-004,005；M018；L3；P1 后置，不因未归档证明推定决定无效；archive_ref+version／档案；P6—P7；学校档案 Owner，SRC-004,005；M018；L3；P1 后置，不因未归档证明推定决定无效。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F036；原稿字段合同：archive_ref+version／档案；P6—P7；学校档案 Owner，SRC-004,005；M018；L3；P1 后置，不因未归档证明推定决定无效；archive_ref+version／档案；P6—P7；学校档案 Owner，SRC-004,005；M018；L3；P1 后置，不因未归档证明推定决定无效；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F037",
      "label": "原处分申诉请求引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：appeal_ref／独立申诉；P1,P7；学生申诉书及有权受理记录 SRC-005,006；M015；L3；未核校本时限人工转介，不当作解除申请；appeal_ref／独立申诉；P1,P7；学生申诉书及有权受理记录 SRC-005,006；M015；L3；未核校本时限人工转介，不当作解除申请。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F037；原稿字段合同：appeal_ref／独立申诉；P1,P7；学生申诉书及有权受理记录 SRC-005,006；M015；L3；未核校本时限人工转介，不当作解除申请；appeal_ref／独立申诉；P1,P7；学生申诉书及有权受理记录 SRC-005,006；M015；L3；未核校本时限人工转介，不当作解除申请；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F038",
      "label": "申诉复查意见引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：document_ref／独立申诉；P5—P7；申诉处理机关意见，SRC-005,006；M016；L3；意见并非正式撤销决定，不覆盖 F018；document_ref／独立申诉；P5—P7；申诉处理机关意见，SRC-005,006；M016；L3；意见并非正式撤销决定，不覆盖 F018。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F038；原稿字段合同：document_ref／独立申诉；P5—P7；申诉处理机关意见，SRC-005,006；M016；L3；意见并非正式撤销决定，不覆盖 F018；document_ref／独立申诉；P5—P7；申诉处理机关意见，SRC-005,006；M016；L3；意见并非正式撤销决定，不覆盖 F018；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F039",
      "label": "有效撤销／变更文书引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：document_ref／救济结果；P5—P7；学校有权重新决定或主管机关文书 SRC-005；M017；L3；未找到有效文书不得宣告原处分撤销；document_ref／救济结果；P5—P7；学校有权重新决定或主管机关文书 SRC-005；M017；L3；未找到有效文书不得宣告原处分撤销。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F039；原稿字段合同：document_ref／救济结果；P5—P7；学校有权重新决定或主管机关文书 SRC-005；M017；L3；未找到有效文书不得宣告原处分撤销；document_ref／救济结果；P5—P7；学校有权重新决定或主管机关文书 SRC-005；M017；L3；未找到有效文书不得宣告原处分撤销；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F040",
      "label": "撤销／变更决定的生效时点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：date+authority／救济结果；P5—P7；F039 所指正式文书与相应规则；M017；L3；不按申诉受理日推定生效；date+authority／救济结果；P5—P7；F039 所指正式文书与相应规则；M017；L3；不按申诉受理日推定生效。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F040；原稿字段合同：date+authority／救济结果；P5—P7；F039 所指正式文书与相应规则；M017；L3；不按申诉受理日推定生效；date+authority／救济结果；P5—P7；F039 所指正式文书与相应规则；M017；L3；不按申诉受理日推定生效；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F041",
      "label": "权威状态更正记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：record+owner／状态核验；P7；处分／档案权属部门后置处理；M005,M020；L3；无权更正时只给冲突待办；record+owner／状态核验；P7；处分／档案权属部门后置处理；M005,M020；L3；无权更正时只给冲突待办。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F041；原稿字段合同：record+owner／状态核验；P7；处分／档案权属部门后置处理；M005,M020；L3；无权更正时只给冲突待办；record+owner／状态核验；P7；处分／档案权属部门后置处理；M005,M020；L3；无权更正时只给冲突待办；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F042",
      "label": "材料版本、归属与替换链",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：material_ref[]／证据链；P1—P7；材料接收及权威档案的来源记录；M001—M020；L3；版本或归属断链则相关核验失效；material_ref[]／证据链；P1—P7；材料接收及权威档案的来源记录；M001—M020；L3；版本或归属断链则相关核验失效。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F042；原稿字段合同：material_ref[]／证据链；P1—P7；材料接收及权威档案的来源记录；M001—M020；L3；版本或归属断链则相关核验失效；material_ref[]／证据链；P1—P7；材料接收及权威档案的来源记录；M001—M020；L3；版本或归属断链则相关核验失效；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F043",
      "label": "适用政策快照标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：version_id+as_of／政策；P0—P7；正式校本发文、过渡信息 SRC-002,007；M019；L0；缺则政策门禁阻断硬阈值计算；version_id+as_of／政策；P0—P7；正式校本发文、过渡信息 SRC-002,007；M019；L0；缺则政策门禁阻断硬阈值计算。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F043；原稿字段合同：version_id+as_of／政策；P0—P7；正式校本发文、过渡信息 SRC-002,007；M019；L0；缺则政策门禁阻断硬阈值计算；version_id+as_of／政策；P0—P7；正式校本发文、过渡信息 SRC-002,007；M019；L0；缺则政策门禁阻断硬阈值计算；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F044",
      "label": "跨材料冲突待办引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：issue_ref[]／核验问题；P2—P7；原始证据比对与人工核对；M004,M005,M020；L3；未闭环前不能写入肯定的权威状态；issue_ref[]／核验问题；P2—P7；原始证据比对与人工核对；M004,M005,M020；L3；未闭环前不能写入肯定的权威状态。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F044；原稿字段合同：issue_ref[]／核验问题；P2—P7；原始证据比对与人工核对；M004,M005,M020；L3；未闭环前不能写入肯定的权威状态；issue_ref[]／核验问题；P2—P7；原始证据比对与人工核对；M004,M005,M020；L3；未闭环前不能写入肯定的权威状态；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F045",
      "label": "来源可访问及可读状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：enum+timestamp／证据来源；P0—P7；原始文件／权威取数过程；M001—M020；L1；不可读=UNREADABLE；源失联=SOURCE_UNAVAILABLE；enum+timestamp／证据来源；P0—P7；原始文件／权威取数过程；M001—M020；L1；不可读=UNREADABLE；源失联=SOURCE_UNAVAILABLE。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F045；原稿字段合同：enum+timestamp／证据来源；P0—P7；原始文件／权威取数过程；M001—M020；L1；不可读=UNREADABLE；源失联=SOURCE_UNAVAILABLE；enum+timestamp／证据来源；P0—P7；原始文件／权威取数过程；M001—M020；L1；不可读=UNREADABLE；源失联=SOURCE_UNAVAILABLE；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "申请操作人可信身份",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 证明是谁启动办理；校方认证/有权核验人；已验证会话或线下身份核验记录；非截图自证；当前必需 P0；线下有权部门身份核验可替代未开通接口；代办另须 M003；F001,F002,F042,F045；SRC-001,003 的本人申请要求；绑定会话或核验凭证、操作人，不等于被处分人；缺：仅可展示非个人化指引；不可读/失联：停止读取私密处分资料并人工核身",
      "requiredElements": [
        "申请操作人可信身份"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "学生校方身份、学段与在校状态",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 确立处分对象及适用分支；学籍/国际学生归口；权威学籍或注册记录、学院核对文书；当前必需 P0—P2；经权属部门盖章/可验正式证明；不能仅用学生证照或姓名；F004—F009,F042,F045；SRC-001,003,004；以学校主体 ID、有效期和院系归属标版本；缺：身份／学段待核；不可读 UNREADABLE；权威源失联 SOURCE_UNAVAILABLE，不强迫重复上传",
      "requiredElements": [
        "学生校方身份、学段与在校状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "合法代办与调档授权",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 证明代理关系和范围；申请人/授权机关；学校认可授权记录、有效委托或特别授权；条件必需：F002=代理，P0/P7；授权方式/监护人代办范围无校本原文，需部门确认；本人无需；F002,F003,F042；SRC-008 待核；关联申请人、被处分人、操作范围、起止和撤销版本；缺则暂停代理操作，不能据手写授权照片认定权限",
      "requiredElements": [
        "合法代办与调档授权"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "原处分正式决定及定位证据",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 定位处分、类型、对象、日期、文号；处分归口及当事人；学校正式决定书/权威档案；学生持有副本只作线索；当前必需的原案事实 P1—P2；可用学校台账、档案核验证明定位；不能要求学生重复持有原件；F010—F017,F023,F042—F045；SRC-001,003,005；sanction_id 为主键，区分主决定及后来更正；保留原件版本；找不到先调档 SOURCE_UNAVAILABLE；扫描模糊 UNREADABLE；不造原处分或自动驳件",
      "requiredElements": [
        "原处分正式决定及定位证据"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "原处分及相关决定当前权威状态",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 核是否仍有效/已解除/变更及其关联；处分台账 Owner；有授权权威登记、档案状态核对记录；当前必需的核验事实 P2，E 必需 P1；无接口可凭主管部门查询／正式文书核对；学生截图非等价；F010,F013,F018,F021,F022,F041,F042,F045；SRC-001,003,005；与 M004 的同一处分键和读数时间绑定；状态源失联先挂起；与文书冲突发 CONFLICT，不取任一方便值",
      "requiredElements": [
        "原处分及相关决定当前权威状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "解除／状态核查申请陈述",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 明确本人请求种类与理由；申请学生；本人提交的申请表或书面/校方确认的提交记录；现用表单未见；当前必需：A/B/C/D/H 的解除申请 P1；E/I 可由 M020／查档请求替代；可采用学校接受的方式；是否必须使用纸表、签字字段待 SRC-008；F024—F026,F028,F042；SRC-001,003,008；申请版本独立于处分文书；撤回或补充是新事件；缺主张请明确目的；格式不可读补可读件；不得代填学院/学校后续栏",
      "requiredElements": [
        "解除／状态核查申请陈述"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "突出表现等提前解除理由证据",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 证实确有被主张的表现事实；学生/学院/活动归口；原始获奖、活动、表现或官方记录及可验副本；条件必需 B，P1—P3；可信获奖/活动登记可替代学生上传；校本何谓“突出”未确认；F027,F042,F045；SRC-001,003,007；每条证明有发行单位、主体、时点、真实性及处分关联；缺可补事实；不让 AI 评价“够突出”；扫描不可读定向补件",
      "requiredElements": [
        "突出表现等提前解除理由证据"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "休学／复学正式记录",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 核查处分期间休学事实和区间；学籍 Owner；休复学决定/校方状态记录；条件必需 C 或发现休学线索，P2；可信学籍结论可替代申请人上传；病假单只可作线索；F009,F020,F023,F042；SRC-001,003,007；区间含权威生效日期，关联本校学生，跨处分期可多段；缺/源失联暂不折算期限；不可读标 UNREADABLE",
      "requiredElements": [
        "休学／复学正式记录"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "后续新增处分决定",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 判断是否确为另一项处分；处分归口；各独立处分决定或权威台账；条件必需 D 或权威记录提示多处分，P2；以权属部门正式决定关联，不强迫学生逐项重传；F021,F042；SRC-001,003,005；每项独立 sanction_id，不可当作 M004 的覆盖新版；缺时仅暂停合并结论；多个处分不可用最晚日期直接代算",
      "requiredElements": [
        "后续新增处分决定"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "原处分变更／延长／更正文书",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 识别有权调整同一处分效力；处分归口；正式变更决定与其生效证明；条件必需 D 或版本链存在，P2；校方权威档案证明可替代副本，学生说明不能代替决定；F022,F023,F042；SRC-001,003,005,007；supersedes 指向原处分版本；独立于新处分 M009；缺则标冲突；不可读/失联不得推定延长或变更有效",
      "requiredElements": [
        "原处分变更／延长／更正文书"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "学院处分期考察记录",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 支持学校对表现的审查；所在学院；学院实际形成的考察/核查记录；后续才产生 P3；已有旧考察可引用；不得让申请人预交不存在的学院公章；形式待现用指南；F029,F042；SRC-001,003 第 7 条；学院、考察期间、被处分人、原处分键和签署版本；到 P3 无记录转学院待办，不把 P1 申请定为不齐",
      "requiredElements": [
        "学院处分期考察记录"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "学院审核意见与授权",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 证明学院是否完成规定审核；学院；正式学院审核结果与可信签署日志；后续才产生 P4；学校认可的纸签或有权审批记录；Renderer 自报老师不替代；F030,F031,F042；SRC-001,003,007；必须绑定本申请版本、原处分及真实学院角色；P1 无须；P4 未签走人工；签署不可信标冲突",
      "requiredElements": [
        "学院审核意见与授权"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "学校正式解除处分决定",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 区别材料核查与学校批准；学校有权机关；正式解除决定/有权登记；后续才产生 P5；但 E 情形为既有当前事实；由有权学校出文，学生副本须校验；2025 授权具体层级未知；F032—F034,F042；SRC-001,003,005,007；决定 ID、签发主体、原处分键、政策、签发及生效时点；P1 不可要求；E 缺时只能核查“主张已解除”，不得承认已批准",
      "requiredElements": [
        "学校正式解除处分决定"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "决定送达／签收证明",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 核决定是否按程序送达；学校送达部门、学生；送达回执/档案登记；后续才产生 P6；适用的邮寄、留置、公告等方式依校本和上位规则核实；F035,F042；SRC-001,003,005；关联 M013 具体版本、受领人及日期；P1 不缺；P6 缺转送达 Owner，不自动否定处分解除",
      "requiredElements": [
        "决定送达／签收证明"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "原处分申诉书／受理线索",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 将“请求撤销原处分”交正确救济路径；申诉人、申诉受理机构；书面申诉及实际接收记录（不是解除申请表）；条件必需 F 请求进入申诉阶段；学校准许的提交渠道待 SRC-006；已有原案号可检索；F024,F037,F042；SRC-003,005,006；申诉案件号独立于解除申请 ID；连接原处分；缺时协助明确申诉请求；不可读请补可读件，超期由有权机构判断",
      "requiredElements": [
        "原处分申诉书／受理线索"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "学生申诉复查意见",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 记录复查建议及程序状态；申诉处理机构；正式复查意见／告知；后续才产生 F 外部救济阶段；不得用普通学院意见代替；必须与 M017 区分；F038,F042；SRC-005,006；指向申诉案和原处分；建议版本不可覆盖原处分；只有申诉提出尚无意见不算本模板缺件；不可读/失联转申诉机构",
      "requiredElements": [
        "学生申诉复查意见"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "原处分撤销／变更的最终有效决定",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 核对是否真正改变原处分；有权学校机关／教育主管机关；学校重新作出的决定或主管部门有效处理文书；后续才产生 F；若主张已有撤销则当前核验必需；申诉复查建议 M016 本身不得替代最终文书；F039,F040,F042；SRC-005,006；对应原处分 ID、签发主体及生效时点，可能有再作决定版本；无有效文书不判撤销；失联/不可读不得乐观认定",
      "requiredElements": [
        "原处分撤销／变更的最终有效决定"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "处分、解除及归档记录",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 验证文书保存及历史状态；档案 Owner；学校文书档案、学生本人档案登记/权威证明；后续才产生 P6；I 历史查询时为当前记录；可由档案馆依法出具核查证明，不强迫离校学生掌握档案；F036,F042；SRC-004,005；记录存档位置、归属和历次文书版本；不得抹除原处分；P1 不必需；I 若档案失联作来源不可用，保护隐私并人工查档",
      "requiredElements": [
        "处分、解除及归档记录"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "现行与历史政策文书／配置快照",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 决定适用规范、过渡与起算规则；校方法规 Owner；2017/2022 原文、2025 修订全文、有效期及过渡签发；当前必需的政策核验 P0/P2，非学生上传物；需正式校方发文；SRC-002 会议通报不替代全文；F016,F019,F023,F043,F045；SRC-001—SRC-007；政策版本、发布／施行／废止时间和适用人群不可缺；2025 文本未知标 POLICY_UNCONFIRMED；源失联标 SOURCE_UNAVAILABLE，不编阈值",
      "requiredElements": [
        "现行与历史政策文书／配置快照"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "状态差异核查请求／纠错记录",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 说明已解除却未更新、历史查档差异；学生/权属部门；核查申请、差异对照、部门处理记录；当前条件必需 E；I 仅遇差异时；校方书面查询或状态核对单可替代截图；正式更正后追加权威记录；F041,F044,F042；SRC-001,003,005；具体处分 ID、两端来源版本、请求人权限与更正 Owner；无正式解除 M013 时只能受理“核对主张”；不可读/源失联暂停更正",
      "requiredElements": [
        "状态差异核查请求／纠错记录"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules",
      "name": "研究稿事实核验与人工复核标准",
      "description": "每条 criterion 来自对应研究稿 R 规则；不是学校正式政策，不自动形成行政决定。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "操作人真实身份 P0—P7",
          "requirement": "真：可信认证/线下核身身份明确；假：操作人冒用或与可信会话矛盾；未知：未核或服务不可取；SRC-001,003；F001,F002,F045；M001；对学校登录签名/有权核身记录和当前访问时点；A/B 优先，Renderer 的身份字段是 D；假 CONFLICT、未知 NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE；身份/权限管理人。未真前禁止读 L3。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "代理办理授权 P0,P1,P7",
          "requirement": "真：F002=代理且授权范围、时点/对象均有效；假：明确无权；未知：授权范围或校本代办规则不明；本人分支不触发；SRC-001,003,008；F002,F003,F004；M001,M003；校方认可的授权与在校/离校调档权限分开核；A/B 认证；不得仅据代理签字照片；本人 NOT_APPLICABLE；无权 CONFLICT/暂停访问；校本形式不明 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；授权部门。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "被处分学生唯一身份 P0—P2",
          "requirement": "真：学生权威键、姓名/曾用名可关联原处分对象；假：有权记录确认为不同人；未知：学籍键缺、同名或旧名映射未证；SRC-001,003,004；F004,F005,F008,F012；M002,M004；A/B 级学籍与原处分双方键比对；跨院转专业/更名需看时间有效映射，不能字符串模糊匹配；假 CONFLICT；未知 SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；学籍 Owner 与处分归口。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "身份制度和学段分支 P0,P2",
          "requirement": "真：可证普通学历、来华留学生或其它特定制度身份；假：证实为教职工自身处分/非学生事项；未知：港澳台侨、身份转换或学段归属不明；SRC-001,003,004,005,007；F006—F009,F019,F043；M002,M019；依所审处分发生时身份及申请/核验时身份、制度适用日期分别判，不将 H 当普通 A；当前校规效力须验证；教职工 NOT_APPLICABLE；身份制度不明 POLICY_UNCONFIRMED；学校身份/法规 Owner。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "原处分正式决定与唯一定位 P1—P2",
          "requirement": "真：能唯一确定处分键、决定书及其权威来源；假：文号与他案关联/文书伪造线索；未知：只持截图、编号缺或档案待查；SRC-001,003,005；F010,F011,F012,F014,F017,F042；M004,M005；A 原件、B 归档副本优先；核文号/对象/签发机关/决定版本，旧文件不与后处分混合；假 CONFLICT；未知 SOURCE_UNAVAILABLE/NEEDS_MATERIAL（仅持有人资料）；原处分归口/档案 Owner。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "处分类型与常规解除适用 P1—P2",
          "requirement": "真：正式决定属非开除处分，符合进入解除事实核验的类型；假：正式决定为开除学籍，或类型与陈述矛盾；未知：处分种类不明；SRC-001,003,005；F010,F013,F018,F024；M004,M005；用有效原处分文书与台账核类型；开除仅就“正常期满解除”不适用，保留 F 申诉分流；开除 NOT_APPLICABLE 并转申诉说明；矛盾 CONFLICT；原处分归口。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "原处分权威状态与版本链 P2,P7",
          "requirement": "真：当前效力与正式决定链/时间截面一致；假：台账与有效决定冲突；未知：当前状态不可取得；SRC-001,003,005；F010,F018,F021,F022,F041,F042；M004,M005,M009,M010；各 sanction_id 独立；A/B 级文书、登记要带 as_of，不可用旧客户端观察记录充当当前效力；矛盾 CONFLICT，不可取 SOURCE_UNAVAILABLE；处分状态 Owner。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "处分适用政策与过渡版本 P0,P2,P4",
          "requirement": "真：校方有效发文、适用人群、生效/废止、旧案过渡有权确认；假：引用的是被正式废止版本或外校规则；未知：2025 修订正式全文/适用日期未得；SRC-001,002,003,004,005,007,012；F006,F007,F019,F043；M019；政策 A 级正式校本发文，会议“修订”通报≠已施行；2006 重发网页≠现行；H 的 2022 后修也需查；过时/跨校 CONFLICT（来源适用错误），时效未知 POLICY_UNCONFIRMED；学生工作/国际学生法规 Owner。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "起算、届满提示与时限适用 P2,P4",
          "requirement": "真：F014—F016 可从原决定、送达及已核政策定位，且法定候选日计算有完整参数；假：落款/送达/生效起算互相冲突；未知：期限版本、过渡规则或起算条款未核；SRC-001,002,003,005,007；F013—F016,F019,F020,F023,F043；M004,M005,M008,M019；比较法定起算口径而非“上传日+6/9/12个月”；F023 为解释性候选，不代表正式解除；跨 2025 时点须人工核定；日期冲突 CONFLICT；政策不明 POLICY_UNCONFIRMED；已齐仍由学校 NEEDS_HUMAN_DECISION；处分归口/法规 Owner。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "处分期正式休复学区间 P2,P4",
          "requirement": "真：权威学籍休复学区间及与处分期间交集可核；假：请假条冒充休学或区间互相冲突；未知：学籍源失联；无休学条件不触发；SRC-001,003,007；F009,F020,F023；M002,M008,M019；A/B 学籍决定核 effective_from/to 和是否多段重叠；是否延长以及算法仍由现行规则核定；未触发 NOT_APPLICABLE；假 CONFLICT；失联 SOURCE_UNAVAILABLE；学籍 Owner，计期法规 Owner。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "后续独立处分关联 P2,P4",
          "requirement": "真：新增处分能独立定位学生、处分键与时序；假：不同处分被当作同一版本；未知：收到多处分线索但无权威决定；单处分不触发；SRC-001,003,005,007；F010,F021,F042；M004,M005,M009；A/B 正式新增处分、文号及生效时序逐项比对；不能凭最晚日期“自动合并期限”；未触发 NOT_APPLICABLE；错绑 CONFLICT；源失联 SOURCE_UNAVAILABLE；各处分归口。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "原处分更正、延长与变更 P2,P4",
          "requirement": "真：有权机关文书能以 supersedes 关联原处分及生效时间；假：将学生陈述/新处分误作变更；未知：权威变更文书待调；无此事件不触发；SRC-001,003,005,007；F010,F022,F023,F042；M004,M005,M010；A/B 正式文书、签发机构、版本和有效期核对；变更后的具体期满算法需现行规范；未触发 NOT_APPLICABLE；冲突 CONFLICT；失联 SOURCE_UNAVAILABLE；处分归口/法规 Owner。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "解除或查档申请主张 P1—P3",
          "requirement": "真：F024/F026 指明解除/提前/查档及关联原处分；假：主张的是原处分不服须转 F，不可当解除申请；未知：内容不可读或当前申请未提交；SRC-001,003,008；F024—F026,F042,F045；M004,M006,M015,M020；本人可持 C 级申请陈述，核收件日期和独立申请版本；形式/期限因现用表缺失不可硬拒；原案争议分流 NOT_APPLICABLE（解除链）；可补缺 NEEDS_MATERIAL；表单硬要求 POLICY_UNCONFIRMED；申请人/受理部门。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "申请撤回及重提事实 P1—P5",
          "requirement": "真：可信当事人提出撤回，受理机关已记录处理结果；假：撤回者无权/材料冒名；未知：是否可撤、何时生效、机构是否接受未核；未撤回不触发；SRC-001,003,008；F001,F002,F025,F028,F042；M001,M003(代理),M006；撤回请求与学校是否接受两个独立事件；保存时间、申请版本和处理人；已有校级有效决定不因请求逆转；未触发 NOT_APPLICABLE；身份冲突 CONFLICT；接受权限不明 NEEDS_HUMAN_DECISION；受理部门。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "提前解除表现事实 P1—P4",
          "requirement": "真：主张的奖项/表现证据由有权来源证实；假：证明归属、时间、真实性冲突；未知：必要事实材料缺；非提前分支不触发；SRC-001,003,007,008；F024,F027,F029；M006,M007,M011；C 级证书需核 A/B 原始登记；只核“事件存在”，突出程度、可否提前是行政裁量；非提前 NOT_APPLICABLE；证据缺 NEEDS_MATERIAL；裁量 NEEDS_HUMAN_DECISION；活动 Owner/学院/学校。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "学院处分期考察事实 P3—P4",
          "requirement": "真：有权学院考察涵盖本学生、本处分和对应期间；假：考察写错处分或考察机构无权；未知：P3 后未形成/未取到；P1 后置；SRC-001,003,007；F008,F010,F029,F042；M002,M004,M011；A/B 学院正式记录核考察区间、制作者及版本；学院变化时核机构承接；不能由申请人预造；P1 NOT_APPLICABLE；P3 应办 NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE；学院考察 Owner。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "学院审核意见及身份 P4—P5",
          "requirement": "真：学院真实审核人、有权岗位、意见与当前申请/处分版本一致；假：Renderer 自报 teacher 或错案签名；未知：尚未审核/角色授权未见；P1 后置；SRC-001,003,007,008；F008,F010,F030,F031,F042；M002,M004,M012；A/B 审核日志或可验正式签件；意见不等于校批；若学校授权不明需身份 Owner 复核；P1 NOT_APPLICABLE；错签 CONFLICT；无真实授权 NEEDS_HUMAN_DECISION；学院/人事授权 Owner。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "学校正式解除决定的真实性与权限 P5—P7",
          "requirement": "真：已存在的正式文书与原处分、学生、授权签发人/机构一致；假：只有学院通过/印章图或签发权不符；未知：学校尚未决定或权威链不可访问；P1 后置；SRC-001,003,005,007,008；F004,F010,F030,F032,F033,F042；M004,M012,M013；A/B 正式学校决定、授权日志与文号逐项对；AI 无签发权限；2025 后具体校级授权仍待核；P1 NOT_APPLICABLE；待学校作决定 NEEDS_HUMAN_DECISION；签发矛盾 CONFLICT；有权学校机关。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "解除正式生效时点 P5—P7",
          "requirement": "真：已核有效校方解除文书明确适用原处分及有效日期；假：把学院审核/文件上传时间当生效；未知：生效日或适用规则不明；P1 后置；SRC-001,003,005,007；F010,F032—F034,F043；M004,M013,M019；与文书签署、送达、适用政策分别记录，绝不互相替代；法效由有权人确认后才能供下游引用；P1 NOT_APPLICABLE；日期冲突 CONFLICT；制度未知 POLICY_UNCONFIRMED；学校签发/法规 Owner。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "决定送达事实 P6—P7",
          "requirement": "真：所核决定有权送达记录可关联接收人和时间；假：误把其它决定回执挂入；未知：未送达/回执未取到；P1—P5 未进入送达不触发；SRC-001,003,005；F032,F035,F042；M013,M014；A/B 送达回执或有权登记；送达形式和对生效的影响以正式制度为准；未触发 NOT_APPLICABLE；错绑 CONFLICT；来源缺 SOURCE_UNAVAILABLE；送达 Owner。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "归档与原处分留痕 P6—P7",
          "requirement": "真：档案真实完整记录原处分及后续解除/撤销版本；假：错档或错误抹除原处分；未知：档案暂未取得；初次申请 P1 不触发；SRC-001,003,004,005；F010,F036,F042；M004,M013,M017,M018；A/B 学校文书档案/本人档案核同一处分和版本；档案事实不自行决定批准效力；P1 NOT_APPLICABLE；错档 CONFLICT；失联 SOURCE_UNAVAILABLE；档案 Owner。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "原处分申诉请求分流 P1,P7",
          "requirement": "真：F037 是对原处分不服，已定位原处分及真实受理记录；假：用解除申请替代申诉或处分申诉与资格复核混同；未知：校本时限/受理路径未取得；未申诉不触发；SRC-003,005,006；F010,F015,F024,F037；M004,M015；教育部令第 41 号令第 60—64 条仅作上位路径和时限提示；个案送达、补救和校本程序由申诉机关判断；未触发 NOT_APPLICABLE；文本缺 NEEDS_MATERIAL；具体时效 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；申诉机关。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "申诉复查意见状态 P5—P7／F",
          "requirement": "真：有权申诉机构复查意见已核身份、案号和性质；假：把建议意见当有效撤销文书；未知：尚未形成/失联；未走申诉不触发；SRC-003,005,006；F037,F038,F042；M015,M016；A/B 复查意见，独立于 M017；建议性复查意见不能写 F039；未触发 NOT_APPLICABLE；意见与原案错绑 CONFLICT；是否后续变更 NEEDS_HUMAN_DECISION；申诉机关。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "原处分撤销/变更有效终局文书 P5—P7／F",
          "requirement": "真：有权学校再决定或主管机关有效文书核到具体原处分与生效时点；假：只有 M016 建议或印章截图；未知：终局文书未形成/不可取；仅要求期满解除不触发；SRC-003,005,006；F010,F018,F039,F040,F042；M004,M005,M016,M017；A/B 终局法律文书，须有真实签发权、版本和生效信息；不得由本模板自行重审、撤销原处分；未触发 NOT_APPLICABLE；未决定 NEEDS_HUMAN_DECISION；错绑 CONFLICT；申诉再决定/主管机关。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "权威状态更正、材料版本及读取有效性 P1—P7",
          "requirement": "真：材料可读、来源可用、归属及版本链有效；有更正时以正式决定为凭据并由权属者修改；假：替换后旧结果继续使用、版本错绑或无权改档；未知：权威源不可取/材料不可读；SRC-001,003,004,005,007；F018,F032,F039,F041,F042,F043,F044,F045；M001—M020（按具体依赖），E 的 M005,M013,M020 必查；每个问题含 material_id/version/source_version/owner；A/B 文书与 C/D 提取值分层；核更正前后版本，不全案无差别重跑；后置更正由权属方执行；旧值 CONFLICT/待重核；不可读 UNREADABLE；源失联 SOURCE_UNAVAILABLE；权威状态 Owner/受影响 R 的责任人。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
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
      "name": "P0 身份、处分对象与政策版本定位",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p1",
      "workflowOwner": "local"
    },
    {
      "id": "p1",
      "name": "P1 解除/查档申请与原处分定位",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p2",
      "workflowOwner": "local"
    },
    {
      "id": "p2",
      "name": "P2 处分期、学籍区间与版本链事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p3",
      "workflowOwner": "local"
    },
    {
      "id": "p3",
      "name": "P3 处分期考察与补充事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p4",
      "workflowOwner": "local"
    },
    {
      "id": "p4",
      "name": "P4 学院审核意见与归口复核事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p5",
      "workflowOwner": "local"
    },
    {
      "id": "p5",
      "name": "P5 学校解除决定文书核验（本地不签发）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p6",
      "workflowOwner": "local"
    },
    {
      "id": "p6",
      "name": "P6 决定送达、档案与状态更正事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p7",
      "workflowOwner": "local"
    },
    {
      "id": "p7",
      "name": "P7 申诉撤销/变更结果引用与后续交接",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "result-code-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "issue-and-todo-list",
      "kind": "supplement-list",
      "audience": "reviewer"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

/** SRC identifiers are research references, never case-material SourceRef values. */
export const r02Metadata = {
  "templateId": "S04-T07",
  "name": "学生处分解除、撤销和影响期满资格核验",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S04-T07.md",
  "sourceDocumentSha256": "1854d9193278a4f8ca1cb6780d51eecefff2a712c97adb74aa290f4578b42d9e",
  "officialSchoolTemplate": false,
  "researchDate": "2026-10-23",
  "policyEvidenceStatus": "PARTIAL",
  "originalResearchBlobSha": "d22ba4510ead88e549bb55afc388b73ff3913122",
  "manifestSha256WithOneTrailingLf": "5686d8ea07b8d6f8fa44d5d68d7d8d2763848a4e3bf93c8f930be14316fb498f",
  "criteria": [
    {
      "sectionId": "rules",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R018",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R022",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R023",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R024",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ],
  "resultCodes": [
    {
      "code": "PASS_FACT",
      "meaning": "当前适用的某个单独事实获可读、可溯源、版本匹配且授权允许读取的证据证实；允许验证“确有不批准决定”这一文件事实",
      "nextAction": "保留事实和引用，传下一阶段待办/人工审查",
      "notEquivalentTo": "解除资格充分、学校已批准、申诉成功"
    },
    {
      "code": "NOT_APPLICABLE",
      "meaning": "此规则在本申请类别或当前阶段未触发；或有权确定常规解除分支不适用（例如开除学籍）",
      "nextAction": "可有分流提示；不要求无关或后置材料",
      "notEquivalentTo": "自动否决所有其它合法救济路径"
    },
    {
      "code": "NEEDS_MATERIAL",
      "meaning": "已触发且已到使用阶段、持有人能够依法提供的必要事实证据缺失；排除未来才生成及权威系统失联",
      "nextAction": "指明 M、事实、合法替代与补证 Owner；仅重核关联 R",
      "notEquivalentTo": "学生必须上传所有校内已有记录"
    },
    {
      "code": "CONFLICT",
      "meaning": "不同材料、受信任记录、主体键、授权身份或版本链存在不可自动消解的相互矛盾或可证伪关联",
      "nextAction": "锁定争议字段、双方引用和权属核对人员；暂停受影响事实的正向输出",
      "notEquivalentTo": "以模型置信度选胜者，或视为学生违纪新事实"
    },
    {
      "code": "UNREADABLE",
      "meaning": "已有材料，但关键页/字段因扫描、损坏、解密、OCR 不确定等无法可靠解读",
      "nextAction": "指材料 ID、页码/区域、可读替代；持有人/档案 Owner 重取",
      "notEquivalentTo": "“未上传文件”，也不意味着内容为假"
    },
    {
      "code": "SOURCE_UNAVAILABLE",
      "meaning": "本应由学校或官方权威来源提供的数据暂不可访问、权限不足、接口不存在/失联、无法调档",
      "nextAction": "转权威数据 Owner、记录失败时间与重试/人工调档渠道",
      "notEquivalentTo": "申请人缺件或权威事实不存在"
    },
    {
      "code": "POLICY_UNCONFIRMED",
      "meaning": "适用制度版本、效力、跨期过渡、具体时限或校本授权规则缺当前有效权威依据",
      "nextAction": "交制度解释/业务 Owner 补现行 SRC；可继续无关客观核验",
      "notEquivalentTo": "套用旧版或外校阈值后得出“合格/不合格”"
    },
    {
      "code": "NEEDS_HUMAN_DECISION",
      "meaning": "事实具备或尚待权威裁量，但最终处分解除、提前例外、受理撤回、申诉纠正、校级审批或更正操作属有权主体",
      "nextAction": "形成有权办理待办，等待真实身份、授权及正式结果",
      "notEquivalentTo": "模型或 Renderer 自己成为有权决定者"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
