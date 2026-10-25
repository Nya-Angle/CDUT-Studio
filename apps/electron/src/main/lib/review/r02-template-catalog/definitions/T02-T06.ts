import type { TemplateVersion } from '@profer/shared'

/**
 * R02 T02-T06: 本地研究模板运行时定义。
 * SRC ID 仅表示研究来源，不是案卷 SourceRef。
 * 本批保留 draft 与人工复核门禁；共享注册/Plan-Run 接线由集成 Owner 负责。
 */
export const templateVersion: TemplateVersion = {
  "templateId": "T02-T06",
  "version": 1,
  "schemaVersion": 2,
  "name": "聘期考核与续聘资格审核",
  "description": "本地研究模板 · 非校方正式模板。政策证据状态：PARTIAL。仅用于材料完整性、事实归属与证据差异的本地预核；正式人事、师德、聘期、业绩等级或进修资格决定由经确认的有权人员人工作出。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T02-T06 根据 R02 研究交接稿转换；不是成都理工大学正式模板、正式制度或授权签批流程。政策版本未核实，不创建 PolicyVersion，所有自动通过均关闭。",
  "objectType": "person",
  "displayName": {
    "template": "聘期考核与续聘资格审核"
  },
  "fields": [
    {
      "key": "f001",
      "label": "案卷标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F001；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F001"
    },
    {
      "key": "f002",
      "label": "批次编号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F002；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F002"
    },
    {
      "key": "f003",
      "label": "政策版本与效力区间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F003；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F003"
    },
    {
      "key": "f004",
      "label": "受理/提交节点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F004；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F004"
    },
    {
      "key": "f005",
      "label": "可信教职工主键",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F005；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F005"
    },
    {
      "key": "f006",
      "label": "姓名及变更别名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F006；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F006"
    },
    {
      "key": "f007",
      "label": "用工/聘用关系类别",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F007；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F007"
    },
    {
      "key": "f008",
      "label": "所在单位/归属期间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F008；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F008"
    },
    {
      "key": "f009",
      "label": "受聘岗位类别/等级",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F009；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F009"
    },
    {
      "key": "f010",
      "label": "岗位聘期起止",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F010；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F010"
    },
    {
      "key": "f011",
      "label": "合同类别及期限",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F011；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F011"
    },
    {
      "key": "f012",
      "label": "合同签署及授权状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F012；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F012"
    },
    {
      "key": "f013",
      "label": "岗位任务书版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F013；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F013"
    },
    {
      "key": "f014",
      "label": "目标条目及适用期间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F014；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F014"
    },
    {
      "key": "f015",
      "label": "合同/岗位/任务变更链",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F015；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F015"
    },
    {
      "key": "f016",
      "label": "当前业务阶段",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F016；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F016"
    },
    {
      "key": "f017",
      "label": "本人续聘意愿",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F017；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F017"
    },
    {
      "key": "f018",
      "label": "本人述职与申报确认",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F018；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F018"
    },
    {
      "key": "f019",
      "label": "聘期内年度考核档次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F019；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F019"
    },
    {
      "key": "f020",
      "label": "履约/成果事实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F020；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F020"
    },
    {
      "key": "f021",
      "label": "成果所属人、岗位和期间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F021；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F021"
    },
    {
      "key": "f022",
      "label": "成果正式认定状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F022；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F022"
    },
    {
      "key": "f023",
      "label": "特殊聘用/考核情形",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F023；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F023"
    },
    {
      "key": "f024",
      "label": "外部权威结论引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F024；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F024"
    },
    {
      "key": "f025",
      "label": "经办及审批授权",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F025；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F025"
    },
    {
      "key": "f026",
      "label": "单位测评/考核建议",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F026；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F026"
    },
    {
      "key": "f027",
      "label": "聘期考核正式档次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F027；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F027"
    },
    {
      "key": "f028",
      "label": "结果告知/签收",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F028；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F028"
    },
    {
      "key": "f029",
      "label": "岗位是否继续存续",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F029；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F029"
    },
    {
      "key": "f030",
      "label": "校方续订意向/处置",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F030；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F030"
    },
    {
      "key": "f031",
      "label": "不合格特殊续聘主管审核",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F031；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F031"
    },
    {
      "key": "f032",
      "label": "续聘合同签署结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F032；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F032"
    },
    {
      "key": "f033",
      "label": "双岗位标记及对应责任",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F033；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F033"
    },
    {
      "key": "f034",
      "label": "距退休区间/权威退休安排",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F034；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F034"
    },
    {
      "key": "f035",
      "label": "依法获准离岗/外派期间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F035；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F035"
    },
    {
      "key": "f036",
      "label": "不能完成目标的原因与核实状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F036；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F036"
    },
    {
      "key": "f037",
      "label": "复核申诉受理与争点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F037；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F037"
    },
    {
      "key": "f038",
      "label": "正式复核/申诉结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F038；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F038"
    },
    {
      "key": "f039",
      "label": "撤回/更正请求与效力",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F039；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F039"
    },
    {
      "key": "f040",
      "label": "来源权威、取得路径和指纹",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F040；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F040"
    },
    {
      "key": "f041",
      "label": "材料可读性与覆盖范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F041；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F041"
    },
    {
      "key": "f042",
      "label": "替换/失效/再审关系",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F042；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F042"
    },
    {
      "key": "f043",
      "label": "截止规则的具体来源版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F043；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T06 / F043"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "本期考核组织通知、政策和批次依据",
      "purpose": "校级人事归口；正式通知、已生效办法/细则及获批单位实施方案；L0／当前必要的政策依据，不要求本人上传；人事处正式发文库/授权办理回执；F002–F004,F043；SRC-001–003/007/009/012；按文号、生效日期、适用类别及批次锁定；若缺为 POLICY_UNCONFIRMED，不可用 2019 PDF 冒充当期政策；页缺则向发文机关索完整件。来源材料槽 M001；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "校级人事归口；正式通知、已生效办法/细则及获批单位实施方案",
        "L0／当前必要的政策依据，不要求本人上传",
        "人事处正式发文库/授权办理回执；F002–F004,F043；SRC-001–003/007/009/012"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "人事关系与受聘岗位主档",
      "purpose": "人事处；人员-单位-岗位-等级-聘期权威记录/正式聘用决定；L1／当前必要的权威事实；经人事核验的正式聘任文件和回执；F005–F010,F023,F033；SRC-001/003/008；归属可信职工主键和岗位生效区间；不可按姓名合并；来源失联 SOURCE_UNAVAILABLE，文书不可读请人事核源。来源材料槽 M002；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "人事处；人员-单位-岗位-等级-聘期权威记录/正式聘用决定",
        "L1／当前必要的权威事实",
        "经人事核验的正式聘任文件和回执；F005–F010,F023,F033；SRC-001/003/008"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "当期有效聘用/劳动合同",
      "purpose": "人事处与受聘本人各持相应合同；签署合同/合法电子原件；L1／当前必要（存在合同的分支）；获授权的合同档案读取或人事核验摘要；F007,F011–F012；SRC-001 附件1/008；合同类别、双方、起止、有效变更各自成版本；与岗位期限不同不自动冲突不合格；缺核人事合同档案，页缺标 UNREADABLE。来源材料槽 M003；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "人事处与受聘本人各持相应合同；签署合同/合法电子原件",
        "L1／当前必要（存在合同的分支）",
        "获授权的合同档案读取或人事核验摘要；F007,F011–F012；SRC-001 附件1/008"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "本聘期岗位职责与工作任务书",
      "purpose": "原岗位责任单位/人事处及本人；任务书和签认页；L1／当前必要（已设任务）；正式任务台账或授权核验回执；F010,F013–F014；SRC-001 附件2（历史表式）/009 第18条；一段岗位对应一版或多版任务书，记录签署人、适用期；缺核原责任单位，旧三年表式不可替代新约定；不可读定位目标条。来源材料槽 M004；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "原岗位责任单位/人事处及本人；任务书和签认页",
        "L1／当前必要（已设任务）",
        "正式任务台账或授权核验回执；F010,F013–F014；SRC-001 附件2（历史表式）/009 第18条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "岗位、合同、任务调整证明",
      "purpose": "人事处/签发单位；转岗、晋级、任务变更批准、双方变更书；L1–L3／条件必要（D/C 等存在变更）；T02-T03 有效决定引用、合同变更档案；F008–F010,F015,F033；SRC-001 第11/13条（历史）/008；必须有原/新版本、签发者、生效日和受影响任务；无变更则 NOT_APPLICABLE，发生而缺证应人事核源；内容冲突 CONFLICT。来源材料槽 M005；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "人事处/签发单位；转岗、晋级、任务变更批准、双方变更书",
        "L1–L3／条件必要（D/C 等存在变更）",
        "T02-T03 有效决定引用、合同变更档案；F008–F010,F015,F033；SRC-001 第11/13条（历史）/008"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m006",
      "name": "聘期各年度正式考核记录",
      "purpose": "人事考核档案/原年度考核部门；按年度决定或签发结果；L2／当前必要的事实来源，仅对已结束年度；授权读取年度档案、经签发部门确认的结果引用；F019；SRC-008 第20–22条/009 第18、34条；每年度独立版本与状态，未结束年度不得虚构；缺年度向人事核源，未获取 SOURCE_UNAVAILABLE，不可读核原档。来源材料槽 M006；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "人事考核档案/原年度考核部门；按年度决定或签发结果",
        "L2／当前必要的事实来源，仅对已结束年度",
        "授权读取年度档案、经签发部门确认的结果引用；F019；SRC-008 第20–22条/009 第18、34条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m007",
      "name": "本人总结述职/事实确认",
      "purpose": "被考核者；实名述职、正式校本考核表（表式未取得）；L2／当前必要的陈述（进入个人述职阶段）；本人通过可信渠道的有确认痕迹的陈述；F018；SRC-009 第22条；归属本人、本聘期、提交版本；代理必须 M022；未述职提示办理而非直接不合格，不可读请本人补正。来源材料槽 M007；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "被考核者；实名述职、正式校本考核表（表式未取得）",
        "L2／当前必要的陈述（进入个人述职阶段）",
        "本人通过可信渠道的有确认痕迹的陈述；F018；SRC-009 第22条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "履约成果/工作实绩佐证",
      "purpose": "本人线索及教学/科研/管理原记录部门；工作量、项目、成果、服务记录；L2–L4／条件必要（声明某项履约事实时）；对应主管系统或原部门权威数据；F020–F021；SRC-001 第10条历史/009 第5、18条；一条事实按成果ID、人员、岗位、期间去重；没有主张的项目不强制空白附件；失联核原持有单位，不可读逐项标注。来源材料槽 M008；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "本人线索及教学/科研/管理原记录部门；工作量、项目、成果、服务记录",
        "L2–L4／条件必要（声明某项履约事实时）",
        "对应主管系统或原部门权威数据；F020–F021；SRC-001 第10条历史/009 第5、18条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "已正式认定的成果或邻接业务结论",
      "purpose": "教务、科研、研究生院、T02/G50 原签发单位；验收、认定、岗位调整等生效决定；L2–L6／条件必要（使用权威结论时）；原决定引用/编号与生效状态；F021–F022,F024；SRC-011、SRC-009 第27条；G50/T 路由待核；必须匹配人员与年度、仅认已生效事项；待验收不算；缺可 SOURCE_UNAVAILABLE，严禁自认定/以截图代替。来源材料槽 M009；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "教务、科研、研究生院、T02/G50 原签发单位；验收、认定、岗位调整等生效决定",
        "L2–L6／条件必要（使用权威结论时）",
        "原决定引用/编号与生效状态；F021–F022,F024；SRC-011、SRC-009 第27条；G50/T 路由待核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m010",
      "name": "近退休/特殊履约安排及理由记录",
      "purpose": "人事处/有权考核组织、本人必要说明；特殊安排、事实确认或核定回执；L1–L4／条件必要（F1/H 等触发）；仅核退休区间、工作安排和已认定理由的摘要；F023,F034,F036；SRC-007/008/009 第41条；最小化敏感事实，退休年龄/临界区间由人事核；没权威记录则 POLICY_UNCONFIRMED 或人工核，不要求全量健康档案。来源材料槽 M010；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "人事处/有权考核组织、本人必要说明；特殊安排、事实确认或核定回执",
        "L1–L4／条件必要（F1/H 等触发）",
        "仅核退休区间、工作安排和已认定理由的摘要；F023,F034,F036；SRC-007/008/009 第41条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "外派、产假、病休等期间性权威证明",
      "purpose": "人事/派出部门、请销假批准机关或依法有效证明持有人；L2–L4／条件必要（F1 触发）；授权单位出具的状态/期间核验摘要；F035–F036；SRC-009 第38–43条；只记所需期间及已获准状态；缺证向原机构核，不能只凭本人一句话判断正当理由；不可读优先保护隐私。来源材料槽 M011；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "人事/派出部门、请销假批准机关或依法有效证明持有人",
        "L2–L4／条件必要（F1 触发）",
        "授权单位出具的状态/期间核验摘要；F035–F036；SRC-009 第38–43条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "单位测评与聘期考核建议",
      "purpose": "真实考核工作组；测评、实绩分析与建议文书；L4 后续生成；正式会议/评议记录；F026；SRC-001 第9–10条历史/009 第22条；需考核组织真实授权与回避核查；L2 不得要求；无文书则待组织办理，扫描不可辨先向其核源。来源材料槽 M012；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "真实考核工作组；测评、实绩分析与建议文书",
        "L4 后续生成",
        "正式会议/评议记录；F026；SRC-001 第9–10条历史/009 第22条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "聘期考核档次正式决定",
      "purpose": "有权领导班子/主管机关组织人事部门；签发决定及必要审定记录；L5 后续生成；正式人事档案/签发回执；F027；SRC-008 第21–22条/009 第17、19、22条；人员、聘期、岗位、决定机关与时间明确；没有决定为 NEEDS_HUMAN_DECISION，不得由 AI 得分生成。来源材料槽 M013；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "有权领导班子/主管机关组织人事部门；签发决定及必要审定记录",
        "L5 后续生成",
        "正式人事档案/签发回执；F027；SRC-008 第21–22条/009 第17、19、22条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "结果告知与签收",
      "purpose": "人事部门/受评人员；书面告知和送达/确认回执；L5 后续生成；合法送达记录；F028；SRC-009 第17、36条（年度程序类比，校内聘期形式待核）；结果与送达时间分离；缺送达不推定复核期已过，不可读核送达机关。来源材料槽 M014；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "人事部门/受评人员；书面告知和送达/确认回执",
        "L5 后续生成",
        "合法送达记录；F028；SRC-009 第17、36条（年度程序类比，校内聘期形式待核）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "岗位存续与编制/岗位配置确认",
      "purpose": "学校人事岗位管理部门；当期岗位配置或存续决定；L6 续聘前条件必要，F2 可提前触发；权威岗位清单/人事处签发确认；F029；SRC-008 第6、10条/009 第32条；以续聘决策时点判断，不由旧合同推断；缺证 NEEDS_HUMAN_DECISION 向人事核查。来源材料槽 M015；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "学校人事岗位管理部门；当期岗位配置或存续决定",
        "L6 续聘前条件必要，F2 可提前触发",
        "权威岗位清单/人事处签发确认；F029；SRC-008 第6、10条/009 第32条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "双方续订意向及协商记录",
      "purpose": "本人及学校授权签约方；意向确认、协商记录；L6 续聘条件必要（本人可在 L2 先表达意愿）；可信身份确认与校方有权意见；F017,F030；SRC-001 附件1 第17条历史/009 第32条；区分单方意向和双方达成一致；一方未表态不可自动“不同意”；签署权限核 M022。来源材料槽 M016；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "本人及学校授权签约方；意向确认、协商记录",
        "L6 续聘条件必要（本人可在 L2 先表达意愿）",
        "可信身份确认与校方有权意见；F017,F030；SRC-001 附件1 第17条历史/009 第32条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "不合格特殊续订的主管机关审核",
      "purpose": "主管机关（部门）；正式例外审核决定；L6 后续生成，仅 H；原主管机关发文/系统权威回执；F031；SRC-009 第32条；L2 不可预交；若必需而尚无批准则 NEEDS_HUMAN_DECISION，不以学院意见替代。来源材料槽 M017；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "主管机关（部门）；正式例外审核决定",
        "L6 后续生成，仅 H",
        "原主管机关发文/系统权威回执；F031；SRC-009 第32条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "已签署续聘合同/有效续订凭证",
      "purpose": "学校法定代表人或合法代理与本人，分别保存；正式续订合同；L6–L7 后续生成；合法电子合同或纸质原件人事档案；F032；SRC-001 附件1（历史表式）/008/009；在双方完成法定签署前不存在；未签不等于失败，扫描不清向合同持有人核源。来源材料槽 M018；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "学校法定代表人或合法代理与本人，分别保存；正式续订合同",
        "L6–L7 后续生成",
        "合法电子合同或纸质原件人事档案；F032；SRC-001 附件1（历史表式）/008/009"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "复核/申诉申请与受理",
      "purpose": "本人及有权受理机关；复核申请、申诉/再申诉申请、争点、收件回执、受理/补正决定；L5–L7 条件必要，仅 I2/G 争议；正式接收记录；F037；SRC-008 第38条/009 第36条/016 第11–16条/017 第11–15条；与原决定及人员绑定，区分申请/收件/受理时间；通常须本人申请，SRC-016 第6条的特殊代申请情形另核；不自行认定逾期。来源材料槽 M019；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "本人及有权受理机关；复核申请、申诉/再申诉申请、争点、收件回执、受理/补正决定",
        "L5–L7 条件必要，仅 I2/G 争议",
        "正式接收记录；F037；SRC-008 第38条/009 第36条/016 第11–16条/017 第11–15条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "正式复核/申诉/再申诉结果",
      "purpose": "有权复核单位、申诉/再申诉受理机关；正式签发结论；L7 后续生成；原处理/受理机关权威决定及送达；F038；SRC-008 第37–39条/009 第36条/016 第18–28条/017 第26–32条；撤销/变更/维持/责令重作必须来自有权机关，新结论引用而非删除旧决定；未作出不能默认驳回。来源材料槽 M020；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "有权复核单位、申诉/再申诉受理机关；正式签发结论",
        "L7 后续生成",
        "原处理/受理机关权威决定及送达；F038；SRC-008 第37–39条/009 第36条/016 第18–28条/017 第26–32条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m021",
      "name": "补件更正/撤回请求及处理回执",
      "purpose": "本人或依法可提出对应申请者、受理经办；请求与处理记录；L2–L7 条件必要，仅 I1，若 I2 申诉撤回则关联 M019；本人真实提交及有权处置回执；F039；SRC-016 第17条/017 第16–17条只适用于复核、申诉/再申诉撤回；普通事实材料/续聘意愿撤回校本依据未获；一个请求一个事件版本；书面撤回申诉须受理机关处理，同一事由申诉终结后的重提限制不能忽略；不能把学校定档一键删掉。来源材料槽 M021；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "本人或依法可提出对应申请者、受理经办；请求与处理记录",
        "L2–L7 条件必要，仅 I1，若 I2 申诉撤回则关联 M019",
        "本人真实提交及有权处置回执；F039；SRC-016 第17条/017 第16–17条只适用于复核、申诉/再申诉撤回；普通事实材料/续聘意愿撤回校本依据未获"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "真实经办授权或代理证明",
      "purpose": "学校人事/单位管理者、本人授权方；角色授权及有效期；任何代办/签发时条件必要；Host/Main 身份与服务端授权名单，正式委托证明；F012,F025；SRC-001 第9、14条历史/008 第39条；代理人、机关、动作范围与有效期绑定；缺授权拒绝代办，OCR 的“批准人”不算身份。来源材料槽 M022；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "学校人事/单位管理者、本人授权方；角色授权及有效期",
        "任何代办/签发时条件必要",
        "Host/Main 身份与服务端授权名单，正式委托证明；F012,F025；SRC-001 第9、14条历史/008 第39条"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m023",
      "name": "来源、身份匹配与可读性核验记录",
      "purpose": "系统+获授权核源人；来源回执/定位符/解析状态；各阶段系统记录；授权原系统/经办核验痕迹；F001,F005,F008,F040–F041；SRC-001/008/009；每一份证据原件/页码/指纹独立记录；原系统失联 SOURCE_UNAVAILABLE，不可读 UNREADABLE，不可标记成已查真。来源材料槽 M023；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "系统+获授权核源人；来源回执/定位符/解析状态",
        "各阶段系统记录",
        "授权原系统/经办核验痕迹；F001,F005,F008,F040–F041；SRC-001/008/009"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m024",
      "name": "证据版本/替换与影响重审记录",
      "purpose": "Main 案卷/审核记录器；版本事件链与引用关系；各阶段系统记录；原附件哈希、受影响字段及检查结果版本；F016,F042；技术能力本轮未证明；覆盖原文只记追加的替代边，不擦旧事实/决定；换件后旧 PASS_FACT 失效并标重审待办。来源材料槽 M024；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "Main 案卷/审核记录器；版本事件链与引用关系",
        "各阶段系统记录",
        "原附件哈希、受影响字段及检查结果版本；F016,F042；技术能力本轮未证明"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m025",
      "name": "特殊人才、珠峰或专项聘用协议",
      "purpose": "人事人才部门及本人；签署特殊协议、任务及期限；E2 条件必要；原签约部门核验摘要/有效协议；F011,F013–F014,F023；SRC-005/007/018/019（报道和历史版本仅供查找协议）；协议当事人、岗位、任务、期限独立于一般聘书；先核签约日期、有效协议及其变更，缺优先向人才部门核源，无法判适用则 POLICY_UNCONFIRMED。来源材料槽 M025；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "人事人才部门及本人；签署特殊协议、任务及期限",
        "E2 条件必要",
        "原签约部门核验摘要/有效协议；F011,F013–F014,F023；SRC-005/007/018/019（报道和历史版本仅供查找协议）"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rule-checks",
      "name": "原件逐条规则核验",
      "description": "映射研究原件中 R001 至 R029 的全部规则。SRC 是研究来源索引，不是案卷材料 SourceRef。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "批次、适用办法与截止来源",
          "requirement": "研究规则 R001：\n规则／阶段；触发 T/F/U：R001 批次、适用办法与截止来源／L0；T=被真实通知纳入具体批次；F=人事确认未纳入；U=无名单或政策版本\nSRC／F／M：SRC-001/003/007/009/012；F002–F004,F043；M001,M023\n核验方法、时间效力、来源层级及例外：核文号、发布/施行/替代、适用岗位、批次、截止与时区；2019 历史三年和四年改革报道不能作为 2026 有效阈值，政策传闻不替代发文\n输出码和下一办理人：T 且完整仅 PASS_FACT（批次来源）；本轮实情 POLICY_UNCONFIRMED；权威名单断联 SOURCE_UNAVAILABLE；U→人事处政策负责人\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "可信人员主键与同名归属",
          "requirement": "研究规则 R002：\n规则／阶段；触发 T/F/U：R002 可信人员主键与同名归属／L0–L1；T=收到需归属到具体人的材料；F=与该案无关的外部材料；U=无法匹配人员\nSRC／F／M：SRC-004/008/009；F001,F005–F006,F040；M002,M023\n核验方法、时间效力、来源层级及例外：人事可信职工主键、实名会话、合同当事人/附件归属交叉比对；更名/曾用名要有权记录，OCR 姓名只做线索；在材料对应岗位期间核\n输出码和下一办理人：T 且一致 PASS_FACT（身份归属）；两套不同主键 CONFLICT，权威身份不可达 SOURCE_UNAVAILABLE；U→人事身份核验员，拒绝自动合案\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "用工类别与是否纳入本批",
          "requirement": "研究规则 R003：\n规则／阶段；触发 T/F/U：R003 用工类别与是否纳入本批／L0–L1；T=拟适用学校聘期考核；F=人事正式确认另属独立项目/劳务等权限；U=编制/代理/劳动合同性质未知\nSRC／F／M：SRC-001/008/009/010/014；F007,F011,F023；M001–M003,M025\n核验方法、时间效力、来源层级及例外：校对实际人事关系类别、岗位设置范围、2026 本批明示适用对象；编外公告仅为排除混同的批次反例，不作普遍豁免\n输出码和下一办理人：T 但当前办法不全 POLICY_UNCONFIRMED；F NOT_APPLICABLE 本案并依实际事项指向 T08-T03（项目续聘）或其他有权流程；U→人事用工管理者，不擅转案/拒绝\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "经办、代报和审批授权",
          "requirement": "研究规则 R004：\n规则／阶段；触发 T/F/U：R004 经办、代报和审批授权／L0–L7 按动作；T=发生代报/校方核源/正式签批；F=本人仅填自有陈述且无代报动作；U=代理范围不明\nSRC／F／M：SRC-001（历史组织）/008/009；F012,F025；M003,M022,M023\n核验方法、时间效力、来源层级及例外：Host/Main 实名身份×单位岗位×批次×人员×操作×授权有效期；纸面签名 OCR/Renderer approvedBy 不可信；签约/决定还要核有权签发机关\n输出码和下一办理人：T 授权已核仅 PASS_FACT（操作权限）；无授权不得执行操作 NEEDS_HUMAN_DECISION；授权记录不可达 SOURCE_UNAVAILABLE；U→人事授权管理员\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "岗位聘用事实和有效期间",
          "requirement": "研究规则 R005：\n规则／阶段；触发 T/F/U：R005 岗位聘用事实和有效期间／L1；T=人事确认有该岗位聘用；F=正式确定该案不存在此岗位；U=岗位身份/起止不明\nSRC／F／M：SRC-001（旧）/003/008；F008–F010,F033；M002,M023\n核验方法、时间效力、来源层级及例外：核正式岗位任命、类别、等级、任职单位及生效/终止日；分段覆盖具体聘期，职称证书不得替代岗位聘任，变更另 R008\n输出码和下一办理人：有效期间一致 PASS_FACT；两份有效任命相斥 CONFLICT；无法取人事台账 SOURCE_UNAVAILABLE；U→岗位管理人事\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "聘用合同类型、当事人和期限",
          "requirement": "研究规则 R006：\n规则／阶段；触发 T/F/U：R006 聘用合同类型、当事人和期限／L1；T=存在合同关系；F=人事确认不存在可适用合同关系；U=档案不明\nSRC／F／M：SRC-001（旧表式）/008/009；F007,F011–F012；M002,M003,M023\n核验方法、时间效力、来源层级及例外：校验合同双方、种类、签署页、开始结束与变更有效性；合同期与岗位聘期分别存储，单纯时长不等不构成造假；编外另核合同法源\n输出码和下一办理人：可核合同事实 PASS_FACT；对立合同版本 CONFLICT；合同档案失联 SOURCE_UNAVAILABLE；签署争议 NEEDS_HUMAN_DECISION→人事合同管理员\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "当前岗位任务书的有效版本",
          "requirement": "研究规则 R007：\n规则／阶段；触发 T/F/U：R007 当前岗位任务书的有效版本／L1–L3；T=本聘期有经确认目标；F=人事确认该岗位不设独立任务书；U=任务书状态不明\nSRC／F／M：SRC-001 附件2（历史）/009 第18–22条；F013–F014；M004,M023\n核验方法、时间效力、来源层级及例外：按任务条目记录对象、双方确认、签发、生效期间与旧版关联；仅比较其当期有效约定，不引用 2019 表中的分值作为现行标准\n输出码和下一办理人：有效约定身份和区间吻合 PASS_FACT；目标版本冲突 CONFLICT；缺组织方任务书 SOURCE_UNAVAILABLE；U→岗位任务管理部门\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "变岗、跨单位、任务调整分段",
          "requirement": "研究规则 R008：\n规则／阶段；触发 T/F/U：R008 变岗、跨单位、任务调整分段／L1–L4；T=存在正式变动/称变动；F=权威记录确认无变动；U=本人称调整而无审批记录\nSRC／F／M：SRC-001 第11/13条（旧）/008/009；F008–F010,F013–F015；M002,M004,M005,M024\n核验方法、时间效力、来源层级及例外：核旧/新岗位任务 ID、批准/双方调整、生效日及归属；期间有交叠/空档转人工，T02-T03 原批准只引用；不得用本人上传新页覆盖旧任务\n输出码和下一办理人：无变动 NOT_APPLICABLE；调整链清楚 PASS_FACT；交叉生效/双方正式版本冲突 CONFLICT；仅个人说法 NEEDS_HUMAN_DECISION→原签发单位和人事\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "双岗各自责任和成果分流",
          "requirement": "研究规则 R009：\n规则／阶段；触发 T/F/U：R009 双岗各自责任和成果分流／L1–L4；T=权威人事记录双岗位；F=确认仅单岗；U=兼职/双肩挑状态不明\nSRC／F／M：SRC-009 第39条；F009,F014,F020–F021,F033；M002,M004,M005,M008\n核验方法、时间效力、来源层级及例外：一人可有多岗位 episode，分别核任务/业绩归属和期间；同一成果可作为线索但不能在无校细则下双重积分；分数/分摊待核\n输出码和下一办理人：双岗事实 PASS_FACT，计量标准 POLICY_UNCONFIRMED；成果归属互斥 CONFLICT；U→人事双岗负责人与原成果部门\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "r010",
          "title": "本人述职真实性与聘期覆盖",
          "requirement": "研究规则 R010：\n规则／阶段；触发 T/F/U：R010 本人述职真实性与聘期覆盖／L2；T=进入个人述职环节；F=还在 L0/L1 或本期经校方确认不需述职；U=阶段/例外未核\nSRC／F／M：SRC-009 第18、22条；F016,F018；M001,M007,M022\n核验方法、时间效力、来源层级及例外：核可信本人确认、聘期标识、述职版本；合法代理单核授权；本人事实陈述≠成果正式认定；校本电子表式未取，不按缺签模板硬判\n输出码和下一办理人：完整已确认陈述 PASS_FACT；本人应提交尚未提交 NEEDS_MATERIAL；身份签署相斥 CONFLICT；U→本人/单位考核经办\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "已结束年度考核的正式记录",
          "requirement": "研究规则 R011：\n规则／阶段；触发 T/F/U：R011 已结束年度考核的正式记录／L2–L4；T=聘期包含已结束且校方依法考核的年度；F=年度未结束/依法不单独出结果；U=人事档案不全\nSRC／F／M：SRC-008 第20–22条/009 第18、34条；F019；M006,M023\n核验方法、时间效力、来源层级及例外：按年度、人员、效力版本校核原签发结论；不能把“未查到”读为不合格，不能把未结束年度列缺件；年度影响聘期的权重待现行校规\n输出码和下一办理人：可核年度 PASS_FACT（记录）；正式相反结果 CONFLICT；原签发系统不可达 SOURCE_UNAVAILABLE；U→年度考核档案管理员\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "履约事实、成果人员和岗位归属",
          "requirement": "研究规则 R012：\n规则／阶段；触发 T/F/U：R012 履约事实、成果人员和岗位归属／L2–L4；T=申报某条成果/工作量；F=没有主张该项成果；U=材料未能提取归属\nSRC／F／M：SRC-009 第5、18、22条/011；F020–F021；M004,M008,M023\n核验方法、时间效力、来源层级及例外：每项比对成果 ID、真实贡献人、岗位任务、起止、重复引用及相关页；同一成果的事实存在和准不准重复计分是两层；宣传稿只作线索\n输出码和下一办理人：原始事实一致 PASS_FACT；两人/两岗相斥 CONFLICT；原件辨不出 UNREADABLE；重复分值口径未知 POLICY_UNCONFIRMED→原成果部门/人事\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "r013",
          "title": "外部正式成果",
          "requirement": "研究规则 R013：\n规则／阶段；触发 T/F/U：R013 外部正式成果/邻接结论效力／L2–L6；T=履约引用验收/职称/岗位变动/外派等决定；F=只陈述过程不声称已获批准；U=原机关审批状态不明\nSRC／F／M：SRC-009 第27条/011；F021–F022,F024；M005,M009,M023\n核验方法、时间效力、来源层级及例外：校验正式决定 ID、签发机关、人员和有效时间、是否撤销/复核；G50/T02-T03/T02-T04/G05 只引用结论；SRC-011 的专项 30 分仅验收合格后可引用，绝非总考核合格线\n输出码和下一办理人：官方决定存在 PASS_FACT（引用效力）；仅初稿/待验收则不通过“已认定”事实并 NEEDS_HUMAN_DECISION 交原部门；原系统断联 SOURCE_UNAVAILABLE；U→原业务主管\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "特殊人才",
          "requirement": "研究规则 R014：\n规则／阶段；触发 T/F/U：R014 特殊人才/珠峰协议目标与期限／L1–L3；T=有正式特殊人才/专项目标协议；F=人事确认不属于特殊协议；U=身份标记或协议未核\nSRC／F／M：SRC-005/007/009/018/019；F011,F013–F014,F023；M003,M004,M025\n核验方法、时间效力、来源层级及例外：核协议与岗位/合同是否分立、约定任务期、本人和学校签认；核签约日适用 2022/2025 哪一版本及有无变更；报道/旧文件不能重写本人协议、不能推算特殊绩效线\n输出码和下一办理人：具体协议约定可核 PASS_FACT；适用标准 POLICY_UNCONFIRMED；档案失联 SOURCE_UNAVAILABLE；U→人才部门人事\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "退休临界与特殊政策适用",
          "requirement": "研究规则 R015：\n规则／阶段；触发 T/F/U：R015 退休临界与特殊政策适用／L1–L4；T=人事权威记录触发临退/过渡安排；F=确认不在任何适用特殊安排；U=退休安排未核\nSRC／F／M：SRC-007（改革报道）/008/009 第41条；F023,F034,F036；M002,M010\n核验方法、时间效力、来源层级及例外：仅从人事退休管理记录核法定安排/与聘期重叠；报道的区间不直接成为自动豁免或不聘条件；个人证件号不能自行决定法定退休年限\n输出码和下一办理人：临退事实 PASS_FACT、影响标准 POLICY_UNCONFIRMED；理由是否正当 NEEDS_HUMAN_DECISION→人事/考核组织\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "外派、病休、产假等期间和例外理由",
          "requirement": "研究规则 R016：\n规则／阶段；触发 T/F/U：R016 外派、病休、产假等期间和例外理由／L2–L4；T=有关期间与目标冲突；F=人事确认无期间性影响；U=请销假/派出记录未核\nSRC／F／M：SRC-008/009 第38–43条；F023,F035–F036；M010,M011,M023\n核验方法、时间效力、来源层级及例外：只核获准状态、时间交集与有权原机关说明；不读取诊断全文评价绩效；G05 的派出审批不在此重复做\n输出码和下一办理人：已批准期间 PASS_FACT（时间）；是否调整目标 NEEDS_HUMAN_DECISION/缺规则 POLICY_UNCONFIRMED；证据不可达 SOURCE_UNAVAILABLE；U→人事/派出部门\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "来源、可读性与签发层级",
          "requirement": "研究规则 R017：\n规则／阶段；触发 T/F/U：R017 来源、可读性与签发层级／每次取证；T=有文书或系统记录输入；F=该槽尚未到生成阶段；U=来源/页面定位丢失\nSRC／F／M：SRC-001/008/009（仅权威责任框架，解析属技术契约）；F040–F041；M023\n核验方法、时间效力、来源层级及例外：将原始来源/签发或核源回执、页码坐标、内容覆盖、指纹绑定目标；OCR/扫描真伪须追原签发者；一部分页损坏只影响依赖该页的 Check\n输出码和下一办理人：可信且可读 PASS_FACT（来源/可读）；已有文件文字不可辨 UNREADABLE；权威系统不可取 SOURCE_UNAVAILABLE；U→材料持有人/核源人员\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "材料版本替换与定向失效",
          "requirement": "研究规则 R018：\n规则／阶段；触发 T/F/U：R018 材料版本替换与定向失效／L2–L7；T=有材料新增、替换、撤销或外部结果修正；F=版本指纹/引用关系均未变；U=原版本链断裂\nSRC／F／M：SRC-008/009（仅留痕与权利框架，重审属技术契约）；F016,F040,F042；M005,M023,M024\n核验方法、时间效力、来源层级及例外：以 targetId + sourceVersion + dependencyFingerprint 追踪 M→F→R；只使依赖变更项的旧预审过期，必要时传播下游 R019–R029；绝不覆盖正式决定\n输出码和下一办理人：无变化本条 NOT_APPLICABLE；有变更则生成失效/重审任务，重算后各 R 自有结果；原链丢失 CONFLICT→Main 业务 Owner/原签发部门\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "单位测评和考核建议的权限",
          "requirement": "研究规则 R019：\n规则／阶段；触发 T/F/U：R019 单位测评和考核建议的权限／L4；T=已经进入组织测评、意见已形成；F=仍 L2/L3 未启动；U=评议已发生但签发/组织不明\nSRC／F／M：SRC-001 第9–10条（历史）/009 第22条；F025–F026；M012,M022\n核验方法、时间效力、证据层级及例外：核工作组授权、与本岗位聘期对应的评议记录、时间、回避提示及内容；建议并非最终档次，某单位意见不能覆盖其他岗位任务\n输出码和下一办理人：有效建议存在 PASS_FACT（建议存在）；未形成且阶段应形成 NEEDS_HUMAN_DECISION；授权冲突 CONFLICT；U→有权考核组织/人事\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "正式考核档次及其有权来源",
          "requirement": "研究规则 R020：\n规则／阶段；触发 T/F/U：R020 正式考核档次及其有权来源／L5；T=校方声称已正式定档；F=尚未进入 L5；U=仅有“拟合格/学院意见”\nSRC／F／M：SRC-004/008 第20–22条/009 第17–22条；F025,F027；M012,M013,M022\n核验方法、时间效力、证据层级及例外：核相应领导班子/主管部门权限、正式文号/人员/聘期/决议日期及生效状态；算法不计算或签发档次；未授权截图与单位意见均不能替代 M013\n输出码和下一办理人：权威结论确实存在 PASS_FACT（仅核决定存在/归属），不另给合格结论；未决 NEEDS_HUMAN_DECISION；签发互斥 CONFLICT→有权人事考核机关\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "结果告知、送达与法定起算",
          "requirement": "研究规则 R021：\n规则／阶段；触发 T/F/U：R021 结果告知、送达与法定起算／L5–L7；T=考核正式结果应通知当事人；F=尚无最终考核决定；U=决定已出但知悉/送达记录未知\nSRC／F／M：SRC-008 第38条/009 第17、36条/016 第12、25–26条；F028,F037；M013,M014,M019\n核验方法、时间效力、证据层级及例外：结果形成日、本人知道/应知日、收到复核决定日、申请和受理日分别存；SRC-016 对适用者一般为 30 日、正当理由可经批准延长；不可用 OCR 日期自动断言逾期，校内实际机构/特别法适用待核\n输出码和下一办理人：送达可核 PASS_FACT；回执无法取得 SOURCE_UNAVAILABLE；是否逾期/延期由有权机关判断 NEEDS_HUMAN_DECISION；U→人事告知者/复核受理者\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "续聘时岗位真实存续",
          "requirement": "研究规则 R022：\n规则／阶段；触发 T/F/U：R022 续聘时岗位真实存续／L6（F2 可前置）；T=有续聘意向且需核岗位；F=仅考核、不办理续聘；U=岗位置换/撤并尚未确定\nSRC／F／M：SRC-008 第6–10、21条/009 第32条；F009,F027,F029；M002,M005,M015\n核验方法、时间效力、证据层级及例外：仅用续聘决策时点人事岗位设置决定核是否存续；即使岗位不存在，合同处置/岗位调整仍属人事决定，不能自动解除\n输出码和下一办理人：存续事实 PASS_FACT；两个正式版本相斥 CONFLICT；无当前权威确认 SOURCE_UNAVAILABLE；U→人事岗位设置管理员\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "本人与学校双方续订意向",
          "requirement": "研究规则 R023：\n规则／阶段；触发 T/F/U：R023 本人与学校双方续订意向／L2/L6；T=确实拟续聘且已到双方协商阶段；F=当期明确只考核不续聘；U=一方意愿/有效授权未核\nSRC／F／M：SRC-001 附件1（旧）/008/009 第32条；F017,F025,F030；M016,M022\n核验方法、时间效力、证据层级及例外：本人真实意思表示和学校有权代表意见分别保存，按提出/变更时间判断；本人先表达意愿不产生学校同意；不能把双方“有意向”当签约完成\n输出码和下一办理人：双方表达事实 PASS_FACT（意向），是否续订 NEEDS_HUMAN_DECISION；权限有冲突 CONFLICT；U→本人、人事签约方\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "不合格后特殊续订的主管机关审批",
          "requirement": "研究规则 R024：\n规则／阶段；触发 T/F/U：R024 不合格后特殊续订的主管机关审批／L6；T=已有正式“不合格”而校方拟走特殊续订；F=不属该例外且正式档次其他；U=档次/特殊理由不清\nSRC／F／M：SRC-009 第21、32、36条；F027,F031,F036；M010,M013,M017\n核验方法、时间效力、证据层级及例外：依法校方集体研究、本人平等协商并报主管机关审核同意等程序；M017 只能决定后引入；本校办理窗口及具体“特殊情况”由有权机关核\n输出码和下一办理人：例外审定文书真伪通过仅 PASS_FACT（有权回执存在）；审批尚未作出 NEEDS_HUMAN_DECISION；特殊理由效力不明 POLICY_UNCONFIRMED；U→人事/主管机关\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "续订合同真实签署",
          "requirement": "研究规则 R025：\n规则／阶段；触发 T/F/U：R025 续订合同真实签署／L6–L7；T=相关有权主体声称续订已完成；F=仅有意向、尚未签约；U=合同档案不明\nSRC／F／M：SRC-001 附件1（旧）/008 第12–19条/009 第32条；F011–F012,F025,F032；M003,M018,M022\n核验方法、时间效力、证据层级及例外：双方合法签署、签署者授权、合同文本、期限与人事归档回执；岗位考核事实通过不自动生合同；未来 M018 不纳入 L2 缺件\n输出码和下一办理人：有效签署事实 PASS_FACT；未完成签署阶段性 NOT_APPLICABLE 并跟踪，真伪/权属争议 NEEDS_HUMAN_DECISION；U→人事合同管理员\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "正式复核",
          "requirement": "研究规则 R026：\n规则／阶段；触发 T/F/U：R026 正式复核/申诉/再申诉受理与结论／L5–L7；T=本人依法对可救济人事处理提出申请；F=无此申请且无救济待办；U=仅聊天投诉/收件未明\nSRC／F／M：SRC-008 第37–39条/009 第36条/016 第2、5–18、23–28条/017 第11–15、19、26–32条；F027–F028,F037–F038；M013,M014,M019,M020\n核验方法、时间效力、证据层级及例外：核原处理单位复核与主管机关/人事综合管理部门申诉的管辖、申请书与原决定、收件/受理、法律规定的补正/正当延长、独立正式结果；复核申诉通常由本人申请，特别代申请依 SRC-016 第6条；申诉期间原决定一般不停止执行\n输出码和下一办理人：申请/受理/决定分别核为 PASS_FACT（该事件）；程序是否受理或变更由有权机关 NEEDS_HUMAN_DECISION；原机关记录不可达 SOURCE_UNAVAILABLE；U→真实复核/申诉机关\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "本人补件、更正、意愿",
          "requirement": "研究规则 R027：\n规则／阶段；触发 T/F/U：R027 本人补件、更正、意愿/材料/申诉撤回的效力／L2–L7；T=收到可信对应权利人请求；F=未提出此类请求；U=截图自称撤回或代理身份不明\nSRC／F／M：SRC-008 第37–39条/009 第36条/016 第17条/017 第16–17条；F016,F039,F042；M019,M021,M022,M024\n核验方法、时间效力、证据层级及例外：普通材料和续聘意愿撤回须核校内办法（未知）；复核/申诉/再申诉在处理决定前依法可书面申请撤回，由受理机关审查/告知终结；SRC-017 第17条：申诉/再申诉因撤回终结后同一事由重提不予受理，不得将普通材料重提规则套入申诉\n输出码和下一办理人：请求确已收到 PASS_FACT（收件事实）；准撤/终结 NEEDS_HUMAN_DECISION，普通业务撤回政策 POLICY_UNCONFIRMED；身份冲突 CONFLICT；U→本人/有权受理者\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "各聘期目标条目履行事实及完成状态",
          "requirement": "研究规则 R028：\n规则／阶段；触发 T/F/U：R028 各聘期目标条目履行事实及完成状态／L3–L5；T=某份有效任务书有本期应评的目标条目；F=该条尚未到考核期或已被有效变更排除；U=目标版本/履约归属不明\nSRC／F／M：SRC-001 第10–12条（旧）/009 第18–22条/007（报道，仅找指标类型）；F010,F013–F015,F020–F022,F026；M001,M004,M005,M008,M009,M012,M023\n核验方法、时间效力、证据层级及例外：逐任务目标 taskItemId × episode × effectiveInterval，依据真实目标原文、签发的项目验收/教学工作量等认定逐条形成“已核到哪些履约事实/哪些尚需考核组织评价”；对“目标是否完成”的定性/定量综合应由有权组织认定。SRC-009 第20条的组合条件不等于机器自行认定完成\n输出码和下一办理人：对已签证的单项履约事实 PASS_FACT；目标文本不清 UNREADABLE，原机关记录断联 SOURCE_UNAVAILABLE，标准不明 POLICY_UNCONFIRMED，最终目标完成与质量评价 NEEDS_HUMAN_DECISION→单位工作组及人事归口\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "未完成目标的“正当理由”有权认定",
          "requirement": "研究规则 R029：\n规则／阶段；触发 T/F/U：R029 未完成目标的“正当理由”有权认定／L4–L5；T=有权机构认定存在未完成的聘期目标或本人提出有理由的异议；F=有权机构确认不存在未完成项且无正当理由争点；U=目标完成状态未形成\nSRC／F／M：SRC-009 第20–22、38–43条/016；F014,F019,F023,F026,F035–F036；M004,M006,M010–M012,M023\n核验方法、时间效力、证据层级及例外：区分“未达到原目标的事实”“请休假/外派等已确认期间”“理由是否正当”的裁量三件事；对适用人员 SRC-009 第21条只有在无正当理由未完成目标时才设应为不合格的法定要求。本人申辩与单位评价分别留证，隐私最小化\n输出码和下一办理人：期间和书面理由存在事实可 PASS_FACT；理由是否成立 NEEDS_HUMAN_DECISION，缺本期特殊折算规则 POLICY_UNCONFIRMED；U→有权考核组织、人事/派出记录部门，绝不模型判“无正当理由”\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
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
  "templateId": "T02-T06",
  "name": "聘期考核与续聘资格审核",
  "officialSchoolTemplate": false,
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T02-T06.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T02-T06.md",
  "sourceDocumentSha256": "44d7cab629b449cc39a509368c7390e6f675f62513d39caebefa4cc84c493977",
  "sourceOriginalGitBlobSha": "e4479c4285a04b975df758e80a93814e396e12cf",
  "sourceSnapshot": "2026-10-23",
  "researchAsOf": "2026-10-23",
  "researchEvidenceStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "authoringStatus": "RESEARCH_HANDOFF_READY",
  "fieldIds": [
    {
      "sourceId": "F001",
      "fieldKey": "f001",
      "label": "案卷标识"
    },
    {
      "sourceId": "F002",
      "fieldKey": "f002",
      "label": "批次编号"
    },
    {
      "sourceId": "F003",
      "fieldKey": "f003",
      "label": "政策版本与效力区间"
    },
    {
      "sourceId": "F004",
      "fieldKey": "f004",
      "label": "受理/提交节点"
    },
    {
      "sourceId": "F005",
      "fieldKey": "f005",
      "label": "可信教职工主键"
    },
    {
      "sourceId": "F006",
      "fieldKey": "f006",
      "label": "姓名及变更别名"
    },
    {
      "sourceId": "F007",
      "fieldKey": "f007",
      "label": "用工/聘用关系类别"
    },
    {
      "sourceId": "F008",
      "fieldKey": "f008",
      "label": "所在单位/归属期间"
    },
    {
      "sourceId": "F009",
      "fieldKey": "f009",
      "label": "受聘岗位类别/等级"
    },
    {
      "sourceId": "F010",
      "fieldKey": "f010",
      "label": "岗位聘期起止"
    },
    {
      "sourceId": "F011",
      "fieldKey": "f011",
      "label": "合同类别及期限"
    },
    {
      "sourceId": "F012",
      "fieldKey": "f012",
      "label": "合同签署及授权状态"
    },
    {
      "sourceId": "F013",
      "fieldKey": "f013",
      "label": "岗位任务书版本"
    },
    {
      "sourceId": "F014",
      "fieldKey": "f014",
      "label": "目标条目及适用期间"
    },
    {
      "sourceId": "F015",
      "fieldKey": "f015",
      "label": "合同/岗位/任务变更链"
    },
    {
      "sourceId": "F016",
      "fieldKey": "f016",
      "label": "当前业务阶段"
    },
    {
      "sourceId": "F017",
      "fieldKey": "f017",
      "label": "本人续聘意愿"
    },
    {
      "sourceId": "F018",
      "fieldKey": "f018",
      "label": "本人述职与申报确认"
    },
    {
      "sourceId": "F019",
      "fieldKey": "f019",
      "label": "聘期内年度考核档次"
    },
    {
      "sourceId": "F020",
      "fieldKey": "f020",
      "label": "履约/成果事实"
    },
    {
      "sourceId": "F021",
      "fieldKey": "f021",
      "label": "成果所属人、岗位和期间"
    },
    {
      "sourceId": "F022",
      "fieldKey": "f022",
      "label": "成果正式认定状态"
    },
    {
      "sourceId": "F023",
      "fieldKey": "f023",
      "label": "特殊聘用/考核情形"
    },
    {
      "sourceId": "F024",
      "fieldKey": "f024",
      "label": "外部权威结论引用"
    },
    {
      "sourceId": "F025",
      "fieldKey": "f025",
      "label": "经办及审批授权"
    },
    {
      "sourceId": "F026",
      "fieldKey": "f026",
      "label": "单位测评/考核建议"
    },
    {
      "sourceId": "F027",
      "fieldKey": "f027",
      "label": "聘期考核正式档次"
    },
    {
      "sourceId": "F028",
      "fieldKey": "f028",
      "label": "结果告知/签收"
    },
    {
      "sourceId": "F029",
      "fieldKey": "f029",
      "label": "岗位是否继续存续"
    },
    {
      "sourceId": "F030",
      "fieldKey": "f030",
      "label": "校方续订意向/处置"
    },
    {
      "sourceId": "F031",
      "fieldKey": "f031",
      "label": "不合格特殊续聘主管审核"
    },
    {
      "sourceId": "F032",
      "fieldKey": "f032",
      "label": "续聘合同签署结果"
    },
    {
      "sourceId": "F033",
      "fieldKey": "f033",
      "label": "双岗位标记及对应责任"
    },
    {
      "sourceId": "F034",
      "fieldKey": "f034",
      "label": "距退休区间/权威退休安排"
    },
    {
      "sourceId": "F035",
      "fieldKey": "f035",
      "label": "依法获准离岗/外派期间"
    },
    {
      "sourceId": "F036",
      "fieldKey": "f036",
      "label": "不能完成目标的原因与核实状态"
    },
    {
      "sourceId": "F037",
      "fieldKey": "f037",
      "label": "复核申诉受理与争点"
    },
    {
      "sourceId": "F038",
      "fieldKey": "f038",
      "label": "正式复核/申诉结论"
    },
    {
      "sourceId": "F039",
      "fieldKey": "f039",
      "label": "撤回/更正请求与效力"
    },
    {
      "sourceId": "F040",
      "fieldKey": "f040",
      "label": "来源权威、取得路径和指纹"
    },
    {
      "sourceId": "F041",
      "fieldKey": "f041",
      "label": "材料可读性与覆盖范围"
    },
    {
      "sourceId": "F042",
      "fieldKey": "f042",
      "label": "替换/失效/再审关系"
    },
    {
      "sourceId": "F043",
      "fieldKey": "f043",
      "label": "截止规则的具体来源版本"
    }
  ],
  "materialSlotIds": [
    {
      "sourceId": "M001",
      "slotId": "m001",
      "name": "本期考核组织通知、政策和批次依据"
    },
    {
      "sourceId": "M002",
      "slotId": "m002",
      "name": "人事关系与受聘岗位主档"
    },
    {
      "sourceId": "M003",
      "slotId": "m003",
      "name": "当期有效聘用/劳动合同"
    },
    {
      "sourceId": "M004",
      "slotId": "m004",
      "name": "本聘期岗位职责与工作任务书"
    },
    {
      "sourceId": "M005",
      "slotId": "m005",
      "name": "岗位、合同、任务调整证明"
    },
    {
      "sourceId": "M006",
      "slotId": "m006",
      "name": "聘期各年度正式考核记录"
    },
    {
      "sourceId": "M007",
      "slotId": "m007",
      "name": "本人总结述职/事实确认"
    },
    {
      "sourceId": "M008",
      "slotId": "m008",
      "name": "履约成果/工作实绩佐证"
    },
    {
      "sourceId": "M009",
      "slotId": "m009",
      "name": "已正式认定的成果或邻接业务结论"
    },
    {
      "sourceId": "M010",
      "slotId": "m010",
      "name": "近退休/特殊履约安排及理由记录"
    },
    {
      "sourceId": "M011",
      "slotId": "m011",
      "name": "外派、产假、病休等期间性权威证明"
    },
    {
      "sourceId": "M012",
      "slotId": "m012",
      "name": "单位测评与聘期考核建议"
    },
    {
      "sourceId": "M013",
      "slotId": "m013",
      "name": "聘期考核档次正式决定"
    },
    {
      "sourceId": "M014",
      "slotId": "m014",
      "name": "结果告知与签收"
    },
    {
      "sourceId": "M015",
      "slotId": "m015",
      "name": "岗位存续与编制/岗位配置确认"
    },
    {
      "sourceId": "M016",
      "slotId": "m016",
      "name": "双方续订意向及协商记录"
    },
    {
      "sourceId": "M017",
      "slotId": "m017",
      "name": "不合格特殊续订的主管机关审核"
    },
    {
      "sourceId": "M018",
      "slotId": "m018",
      "name": "已签署续聘合同/有效续订凭证"
    },
    {
      "sourceId": "M019",
      "slotId": "m019",
      "name": "复核/申诉申请与受理"
    },
    {
      "sourceId": "M020",
      "slotId": "m020",
      "name": "正式复核/申诉/再申诉结果"
    },
    {
      "sourceId": "M021",
      "slotId": "m021",
      "name": "补件更正/撤回请求及处理回执"
    },
    {
      "sourceId": "M022",
      "slotId": "m022",
      "name": "真实经办授权或代理证明"
    },
    {
      "sourceId": "M023",
      "slotId": "m023",
      "name": "来源、身份匹配与可读性核验记录"
    },
    {
      "sourceId": "M024",
      "slotId": "m024",
      "name": "证据版本/替换与影响重审记录"
    },
    {
      "sourceId": "M025",
      "slotId": "m025",
      "name": "特殊人才、珠峰或专项聘用协议"
    }
  ],
  "criteria": [
    {
      "sectionId": "rule-checks",
      "criterionId": "r001",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-007",
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r002",
      "srcIds": [
        "SRC-004",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r003",
      "srcIds": [
        "SRC-001",
        "SRC-008",
        "SRC-009",
        "SRC-010",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r004",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r005",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r006",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r007",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r008",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r009",
      "srcIds": [
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r010",
      "srcIds": [
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r011",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r012",
      "srcIds": [
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r013",
      "srcIds": [
        "SRC-009",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r014",
      "srcIds": [
        "SRC-005",
        "SRC-007",
        "SRC-009",
        "SRC-018",
        "SRC-019"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r015",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r016",
      "srcIds": [
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r017",
      "srcIds": [
        "SRC-001",
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r018",
      "srcIds": [
        "SRC-008",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r019",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r020",
      "srcIds": [
        "SRC-004",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r021",
      "srcIds": [
        "SRC-008",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r022",
      "srcIds": [
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r023",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r024",
      "srcIds": [
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r025",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r026",
      "srcIds": [
        "SRC-008",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r027",
      "srcIds": [
        "SRC-008",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r028",
      "srcIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r029",
      "srcIds": [
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
    "SRC-016",
    "SRC-017",
    "SRC-018",
    "SRC-019",
    "SRC-020"
  ]
} as const
