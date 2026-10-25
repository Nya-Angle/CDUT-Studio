import type { TemplateVersion } from '@profer/shared'

/**
 * R02 T02-T07: 本地研究模板运行时定义。
 * SRC ID 仅表示研究来源，不是案卷 SourceRef。
 * 本批保留 draft 与人工复核门禁；共享注册/Plan-Run 接线由集成 Owner 负责。
 */
export const templateVersion: TemplateVersion = {
  "templateId": "T02-T07",
  "version": 1,
  "schemaVersion": 2,
  "name": "个人教学、科研与社会服务业绩认定审核",
  "description": "本地研究模板 · 非校方正式模板。政策证据状态：PARTIAL。仅用于材料完整性、事实归属与证据差异的本地预核；正式人事、师德、聘期、业绩等级或进修资格决定由经确认的有权人员人工作出。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T02-T07 根据 R02 研究交接稿转换；不是成都理工大学正式模板、正式制度或授权签批流程。政策版本未核实，不创建 PolicyVersion，所有自动通过均关闭。",
  "objectType": "person",
  "displayName": {
    "template": "个人教学、科研与社会服务业绩认定审核"
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
      "displayHint": "R02 T02-T07 / F001"
    },
    {
      "key": "f002",
      "label": "本次使用目的",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F002；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F002"
    },
    {
      "key": "f003",
      "label": "申请人受控身份 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F003；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F003"
    },
    {
      "key": "f004",
      "label": "申请人姓名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F004；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F004"
    },
    {
      "key": "f005",
      "label": "申请时任聘身份与有效区间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F005；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F005"
    },
    {
      "key": "f006",
      "label": "申请时所属院系/校区",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F006；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F006"
    },
    {
      "key": "f007",
      "label": "代理关系/授权范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F007；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F007"
    },
    {
      "key": "f008",
      "label": "业绩一级领域",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F008；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F008"
    },
    {
      "key": "f009",
      "label": "成果子类",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F009；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F009"
    },
    {
      "key": "f010",
      "label": "成果发生/获批/完成时点",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F010；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F010"
    },
    {
      "key": "f011",
      "label": "同一成果实体的受控 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F011；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F011"
    },
    {
      "key": "f012",
      "label": "成果题名/项目名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F012；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F012"
    },
    {
      "key": "f013",
      "label": "外部唯一标识（DOI、专利号、项目号、ISBN 等）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F013；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F013"
    },
    {
      "key": "f014",
      "label": "颁发/发表/委托主体",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F014；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F014"
    },
    {
      "key": "f015",
      "label": "正式发文/出版/授权日期",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F015；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F015"
    },
    {
      "key": "f016",
      "label": "成果生命周期状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F016；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F016"
    },
    {
      "key": "f017",
      "label": "原件上的贡献者姓名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F017；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F017"
    },
    {
      "key": "f018",
      "label": "作者/参与人/指导教师排序",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F018；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F018"
    },
    {
      "key": "f019",
      "label": "贡献角色",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F019；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F019"
    },
    {
      "key": "f020",
      "label": "成果时点署名/承担单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F020；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F020"
    },
    {
      "key": "f021",
      "label": "其他作者/团队及各自顺序",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F021；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F021"
    },
    {
      "key": "f022",
      "label": "项目/课题/专题层级及负责人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F022；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F022"
    },
    {
      "key": "f023",
      "label": "合规核对所需到账/资助金额及口径",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F023；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F023"
    },
    {
      "key": "f024",
      "label": "出版物类型与检索级别/年度",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F024；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F024"
    },
    {
      "key": "f025",
      "label": "社会服务类型/对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F025；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F025"
    },
    {
      "key": "f026",
      "label": "服务完成、采纳、影响或会次事实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F026；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F026"
    },
    {
      "key": "f027",
      "label": "政策文号、版本、有效期与适用情形",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F027；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F027"
    },
    {
      "key": "f028",
      "label": "系统提出的候选类别/等级",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F028；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F028"
    },
    {
      "key": "f029",
      "label": "学校已有正式认定等级及适用用途",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F029；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F029"
    },
    {
      "key": "f030",
      "label": "成果主题库数据审核阶段/状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F030；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F030"
    },
    {
      "key": "f031",
      "label": "核验/决定人服务端可信角色",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F031；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F031"
    },
    {
      "key": "f032",
      "label": "材料版本、来源与校验值",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F032；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F032"
    },
    {
      "key": "f033",
      "label": "成果实体去重候选组",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F033；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F033"
    },
    {
      "key": "f034",
      "label": "新旧证据替代链",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F034；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F034"
    },
    {
      "key": "f035",
      "label": "撤回/补件/异议请求状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F035；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F035"
    },
    {
      "key": "f036",
      "label": "下游使用业务、目的与版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F036；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F036"
    },
    {
      "key": "f037",
      "label": "有来源的批次截止节点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F037；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F037"
    },
    {
      "key": "f038",
      "label": "正式决定的机构、签发依据与效力",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "来源字段 F038；按原研究字段说明抽取，仅保留核验所需信息；未知/冲突不得猜测。",
      "displayHint": "R02 T02-T07 / F038"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "真人及任聘关系",
      "purpose": "真人及任聘关系；学校 SSO/人事机构持有的实名与任聘有效期、所属组织记录；当前必需 P0；经授权查询，不要求默认上传身份证扫描件；人事部门出具的有效身份/任聘/院系确认，由有权人员录入核验；F003–F006 / SRC-004/009/014；人员受控 ID 与生效区间；源不可达 SOURCE_UNAVAILABLE，冲突人工复核；不可读 UNREADABLE。来源材料槽 M001；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "真人及任聘关系；学校 SSO/人事机构持有的实名与任聘有效期、所属组织记录",
        "当前必需 P0；经授权查询，不要求默认上传身份证扫描件",
        "人事部门出具的有效身份/任聘/院系确认，由有权人员录入核验"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "代理授权",
      "purpose": "代理授权；本人、授权单位持有的委托/业务授权记录；条件必需 P0，仅代理办理；学校正式代理系统权限与授权日志（如存在）；允许范围待校本确认；F007/F031 / SRC-004（只证明实名入口，代理制度未证）；绑定被代理人、代理人、期限和动作；缺则暂停代办，损则重验。来源材料槽 M002；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "代理授权；本人、授权单位持有的委托/业务授权记录",
        "条件必需 P0，仅代理办理",
        "学校正式代理系统权限与授权日志（如存在）；允许范围待校本确认"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "已有校内成果及审核事件",
      "purpose": "已有校内成果及审核事件；学校科研成果主题库/有权成果台账的只读记录；条件必需 P1–P2，只有已存在/可访问时直接引用；原始颁发机构可核验的成果凭据或学院人工确认；不强制重复上传已有事实；F011/F017–F021/F030–F033 / SRC-004/005；引源记录 ID、作者归属与审核阶段/版本；离线报 SOURCE_UNAVAILABLE，不制造二审通过。来源材料槽 M003；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "已有校内成果及审核事件；学校科研成果主题库/有权成果台账的只读记录",
        "条件必需 P1–P2，只有已存在/可访问时直接引用",
        "原始颁发机构可核验的成果凭据或学院人工确认；不强制重复上传已有事实"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m004",
      "name": "论文原始发表/署名事实",
      "purpose": "论文原始发表/署名事实；期刊出版社/作者持有的发表页、全文必要页、署名及单位信息；条件必需 P1，申报已发表论文；期刊正式在线页面、出版社可核验记录、校内完整可信条目；F010–F020/F024 / SRC-001/002/004；DOI/版次/日期/作者顺序+F032；缺则补当前材料，扫描损坏 UNREADABLE。来源材料槽 M004；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "论文原始发表/署名事实；期刊出版社/作者持有的发表页、全文必要页、署名及单位信息",
        "条件必需 P1，申报已发表论文",
        "期刊正式在线页面、出版社可核验记录、校内完整可信条目"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "期刊检索、收录分区或成果检索证明",
      "purpose": "期刊检索、收录分区或成果检索证明；数据库/检索机构持有；条件必需 P2–P3，仅政策需要检索等级或来源有争议时；机构授权的实时数据库核验/正式检索报告（SRC-004 称“如有”）；F013/F024/F027 / SRC-001/002/004；记录检索平台、查询日及适用年度；索引不可用 SOURCE_UNAVAILABLE，不得猜分区。来源材料槽 M005；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "期刊检索、收录分区或成果检索证明；数据库/检索机构持有",
        "条件必需 P2–P3，仅政策需要检索等级或来源有争议时",
        "机构授权的实时数据库核验/正式检索报告（SRC-004 称“如有”）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "知识产权授权事实",
      "purpose": "知识产权授权事实；授权机关/权利人持有的专利、软著、标准权利记录；条件必需 P1–P2，相关子类；主管登记平台有效记录、校内经核验知识产权台账；F009–F016/F019–F020 / SRC-001/004；证号+授权日期+权利/署名归属；缺授权不可提前认作已授权，损则重取。来源材料槽 M006；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "知识产权授权事实；授权机关/权利人持有的专利、软著、标准权利记录",
        "条件必需 P1–P2，相关子类",
        "主管登记平台有效记录、校内经核验知识产权台账"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "科研项目获批、层级和负责人",
      "purpose": "科研项目获批、层级和负责人；立项机关/学校项目主管持有的正式批文、任务书/合同；条件必需 P1，申报项目业绩；校内有权项目系统已核验的批准/任务书记录；F010–F023 / SRC-001/012；项目/课题/专题编号与人员版本；涉密不可入通用系统；缺则仅保留项目主张。来源材料槽 M007；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "科研项目获批、层级和负责人；立项机关/学校项目主管持有的正式批文、任务书/合同",
        "条件必需 P1，申报项目业绩",
        "校内有权项目系统已核验的批准/任务书记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "负责人或任务变更有权批件",
      "purpose": "负责人或任务变更有权批件；项目承担方/主管部门持有的签章说明与批准；后续才产生 P2/P6，实际发生变更才条件必需；SRC-012 允许的有权签章说明、主管机关批准记录；F016/F019/F022/F034 / SRC-012 第7、10条；绑定原任务书、变更生效时间与新旧负责人；无变更 NOT_APPLICABLE；缺时暂停新负责人主张。来源材料槽 M008；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "负责人或任务变更有权批件；项目承担方/主管部门持有的签章说明与批准",
        "后续才产生 P2/P6，实际发生变更才条件必需",
        "SRC-012 允许的有权签章说明、主管机关批准记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "经费到账或财政口径事实",
      "purpose": "经费到账或财政口径事实；学校财务处/项目受控台账持有；条件必需 P2–P3，分级确实依金额时；受控财务回执、经授权查询的入账记录；申请人自填预算不可替代；F022/F023/F027 / SRC-001/012；指向项目 ID、到账日期、币种和费用口径；缺/损转财务核对，禁止推算到账。来源材料槽 M009；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "经费到账或财政口径事实；学校财务处/项目受控台账持有",
        "条件必需 P2–P3，分级确实依金额时",
        "受控财务回执、经授权查询的入账记录；申请人自填预算不可替代"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "科研项目验收/结项事实",
      "purpose": "科研项目验收/结项事实；主管机关/项目主管部门持有；后续才产生 P3–P5，仅主张结题后成果时条件必需；具有同等效力的主管部门结项/综合评价结果；F016/F022/F029 / SRC-012 第30–33条；绑定项目任务及验收日期/状态；未到验收不当作材料缺失；缺已主张结果则待办。来源材料槽 M010；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "科研项目验收/结项事实；主管机关/项目主管部门持有",
        "后续才产生 P3–P5，仅主张结题后成果时条件必需",
        "具有同等效力的主管部门结项/综合评价结果"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "科技奖励及本人获奖排名",
      "purpose": "科技奖励及本人获奖排名；授奖机关/团队持有的正式文件和证书；条件必需 P1–P2，获奖类；授奖机关公告与正式持证/排名记录，经部门认可；F012–F021/F029 / SRC-001；奖项届次/奖级/获奖者排名/文号；证书名单冲突 CONFLICT。来源材料槽 M011；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "科技奖励及本人获奖排名；授奖机关/团队持有的正式文件和证书",
        "条件必需 P1–P2，获奖类",
        "授奖机关公告与正式持证/排名记录，经部门认可"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "专著/教材出版事实",
      "purpose": "专著/教材出版事实；出版社/作者持有的版权页、目录及署名页等；条件必需 P1–P2，著作或教材类；出版社权威 ISBN/版权元数据、校内认定书；F009–F020/F024 / SRC-001/002；版本、ISBN、第一/副主编与版权归属；缺不凭书名推断已出版。来源材料槽 M012；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "专著/教材出版事实；出版社/作者持有的版权页、目录及署名页等",
        "条件必需 P1–P2，著作或教材类",
        "出版社权威 ISBN/版权元数据、校内认定书"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "教改/课程等教育项目获批",
      "purpose": "教改/课程等教育项目获批；立项机关/教学归口持有的批准文件及名单；条件必需 P1，申报已获批项目；教务处/研究生院等有权项目管理记录（若可授权查询）；F008–F020/F027 / SRC-002/008/013；区分本科/研究生/留学生，批准年度与排名；缺证明仅为计划/申请中。来源材料槽 M013；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "教改/课程等教育项目获批；立项机关/教学归口持有的批准文件及名单",
        "条件必需 P1，申报已获批项目",
        "教务处/研究生院等有权项目管理记录（若可授权查询）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "教学项目验收或建成",
      "purpose": "教学项目验收或建成；教务归口/验收组织持有的验收表及正式结论；后续才产生 P3–P5，达到并主张验收时条件必需；有权验收系统记录/正式公示决定；F016/F027/F029 / SRC-002/013；和 M013 项目 ID 一致、版本与结果日期；未验收不能要求，缺已主张的结果转人工。来源材料槽 M014；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "教学项目验收或建成；教务归口/验收组织持有的验收表及正式结论",
        "后续才产生 P3–P5，达到并主张验收时条件必需",
        "有权验收系统记录/正式公示决定"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "课程建设/优质课程正式立项或遴选名单",
      "purpose": "课程建设/优质课程正式立项或遴选名单；教学管理部门持有；条件必需 P1/P3，课程建设类按获批/获评阶段分别触发；学校正式发布的立项/优质课程名单或受控记录；F009/F012/F016/F019/F029 / SRC-002/013；课程编号、负责人、建设批次、不同阶段独立版本；仅验收不自动推出 B2。来源材料槽 M015；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "课程建设/优质课程正式立项或遴选名单；教学管理部门持有",
        "条件必需 P1/P3，课程建设类按获批/获评阶段分别触发",
        "学校正式发布的立项/优质课程名单或受控记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "教学成果奖/教学竞赛奖正式凭据",
      "purpose": "教学成果奖/教学竞赛奖正式凭据；授奖部门/学院持有的获奖文件或证书；条件必需 P1–P2，获奖类；组织方正式公布带个人/团队名单的记录；F012–F021/F027 / SRC-002/010；奖项届次、年度、排序、奖级，奖次冲突待归口核对。来源材料槽 M016；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "教学成果奖/教学竞赛奖正式凭据；授奖部门/学院持有的获奖文件或证书",
        "条件必需 P1–P2，获奖类",
        "组织方正式公布带个人/团队名单的记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "教学指导/学生竞赛/学位论文指导排名",
      "purpose": "教学指导/学生竞赛/学位论文指导排名；学院、赛事/授予机关持有的名单、获奖或指导证明；条件必需 P1–P2，主张个人指导业绩时；颁奖公示/正式证书/学校教育教学权威记录；F017–F021/F029 / SRC-002；第一/第二指导者与作品同一性，非第一不可自行换排。来源材料槽 M017；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "教学指导/学生竞赛/学位论文指导排名；学院、赛事/授予机关持有的名单、获奖或指导证明",
        "条件必需 P1–P2，主张个人指导业绩时",
        "颁奖公示/正式证书/学校教育教学权威记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "社会服务委托/任务事实",
      "purpose": "社会服务委托/任务事实；委托方/学校持有的合同、任务书或活动通知；条件必需 P1，主张服务或合同事实；有权委托函、任务批件或校内服务项目档案；F010/F014/F020/F025 / SRC-001/006/007；任务编号、签约主体、时段/服务对象；合同只证委托，不证履行完成。来源材料槽 M018；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "社会服务委托/任务事实；委托方/学校持有的合同、任务书或活动通知",
        "条件必需 P1，主张服务或合同事实",
        "有权委托函、任务批件或校内服务项目档案"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "社会服务履行、采纳及直接证明",
      "purpose": "社会服务履行、采纳及直接证明；委托方、主管/组织单位持有的验收、采纳、会次、服务证明；后续才产生 P2–P3，主张已完成/被采纳/达到级别时条件必需；有权接收/使用机关证明、活动主办方直接原始记录；F016/F025/F026/F029 / SRC-001 附件社会服务表；保留活动/文号、直接证明与本人角色；缺不推定影响力，损则要求原机关可核副本。来源材料槽 M019；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "社会服务履行、采纳及直接证明；委托方、主管/组织单位持有的验收、采纳、会次、服务证明",
        "后续才产生 P2–P3，主张已完成/被采纳/达到级别时条件必需",
        "有权接收/使用机关证明、活动主办方直接原始记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "既有正式成果/等级认定决定",
      "purpose": "既有正式成果/等级认定决定；有权归口机构持有的签发/受控决定；条件必需 P3/P5，仅声称已有认定或复用 G50/S/T 结论时；真实可核源业务 record_id+权限状态；截图或导出 JSON 单独不够；F011/F027/F029/F031/F036/F038 / SRC-001/002（具体签发未知）；源 ID、签发机关、适用目的/时效/版本；缺则不承认既有等级但可继续事实审核。来源材料槽 M020；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "既有正式成果/等级认定决定；有权归口机构持有的签发/受控决定",
        "条件必需 P3/P5，仅声称已有认定或复用 G50/S/T 结论时",
        "真实可核源业务 record_id+权限状态；截图或导出 JSON 单独不够"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m021",
      "name": "校本政策与适用年度/批次快照",
      "purpose": "校本政策与适用年度/批次快照；学校机关公共原文，审核服务持有索引；当前必需 P0/P3，由审核方准备，不向本人索取；有权主管部门发布的有效解释函/修订版及正式公开文件；F008/F009/F027/F028/F037 / SRC-001/002/012/013；文号、发布/生效/废止及适用领域；镜像 SRC-002 现行性不明→POLICY_UNCONFIRMED。来源材料槽 M021；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "校本政策与适用年度/批次快照；学校机关公共原文，审核服务持有索引",
        "当前必需 P0/P3，由审核方准备，不向本人索取",
        "有权主管部门发布的有效解释函/修订版及正式公开文件"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "署名、归属和跨单位争议补证",
      "purpose": "署名、归属和跨单位争议补证；发文机关/出版社/人事部门/各署名人持有；条件必需 P2/P4，仅 F017–F021 有冲突；出版更正公告、正式单位证明、主管机关批准的调整凭据；F003/F005/F017–F022/F033 / SRC-004/005/012；原署名+修正来龙去脉，保留双方版本；缺送人工，勿让一人修改另一人署名。来源材料槽 M022；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "署名、归属和跨单位争议补证；发文机关/出版社/人事部门/各署名人持有",
        "条件必需 P2/P4，仅 F017–F021 有冲突",
        "出版更正公告、正式单位证明、主管机关批准的调整凭据"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m023",
      "name": "退回补正/撤回/异议与材料更正请求",
      "purpose": "退回补正/撤回/异议与材料更正请求；本人或授权平台持有的理由及被替换记录；条件必需 P6，发生改动/申诉才需；受控线上办理记录、签名书面更正请求；正式撤回格式待校定；F001/F032/F034/F035 / SRC-004/005（仅证明退回补正）；保留请求者、时间、原/新版本及范围；缺待补理由，权限未知则不执行撤销。来源材料槽 M023；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "退回补正/撤回/异议与材料更正请求；本人或授权平台持有的理由及被替换记录",
        "条件必需 P6，发生改动/申诉才需",
        "受控线上办理记录、签名书面更正请求；正式撤回格式待校定"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m024",
      "name": "本次正式人工认定、复核或撤销决定",
      "purpose": "本次正式人工认定、复核或撤销决定；有权机构持有的结论、签章与授权日志；后续才产生 P5/P6，不能在申请起始阶段要求；有同等效力的校方受控决定记录；谁最终签发待校核；F029/F031/F034/F038 / SRC-001/002/009（均不等于已证具体签发）；绑定作出决定的真实机构/日期/依据/源版本；未产生不是缺申请材料。来源材料槽 M024；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "本次正式人工认定、复核或撤销决定；有权机构持有的结论、签章与授权日志",
        "后续才产生 P5/P6，不能在申请起始阶段要求",
        "有同等效力的校方受控决定记录；谁最终签发待校核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m025",
      "name": "职称/聘期/岗位/奖励等下游引用回执",
      "purpose": "职称/聘期/岗位/奖励等下游引用回执；下游业务 Owner 持有；后续才产生 P5/P6，仅需追溯使用时；原下游业务系统的引用关系和回执，不以个人截图为唯一凭证；F002/F029/F036 / SRC-002/010/013；记录引用的业绩版本、使用目的及时间；缺不影响本案成果事实核验。来源材料槽 M025；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "职称/聘期/岗位/奖励等下游引用回执；下游业务 Owner 持有",
        "后续才产生 P5/P6，仅需追溯使用时",
        "原下游业务系统的引用关系和回执，不以个人截图为唯一凭证"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m026",
      "name": "当期批次截止或申报窗口通知",
      "purpose": "当期批次截止或申报窗口通知；学校相关主管部门持有；条件必需 P0/P1，事项有具体批次才需；学校最新权威通知、有效补充说明/延期公告；F002/F027/F037 / SRC-010/013（仅各自历史批次）；记录发布时间、批次、截止、变更版；来源失联不推断截止或受理资格。来源材料槽 M026；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "当期批次截止或申报窗口通知；学校相关主管部门持有",
        "条件必需 P0/P1，事项有具体批次才需",
        "学校最新权威通知、有效补充说明/延期公告"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m027",
      "name": "缺失论文手工补录信息表及辅助附件",
      "purpose": "缺失论文手工补录信息表及辅助附件；本人/网络与信息化处指引邮箱持有；条件必需 P1，主题库检索无数据且属于该补录路径；按学校指引：本人填报表、成果检索报告（如有）、扫描必要论文页/其他证明；已有库记录则不用；F011–F020/F024/F032 / SRC-004；每篇成果单独版本及署名归属；无表格无法走该人工补录路径，文件损坏需重新提供。来源材料槽 M027；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "缺失论文手工补录信息表及辅助附件；本人/网络与信息化处指引邮箱持有",
        "条件必需 P1，主题库检索无数据且属于该补录路径",
        "按学校指引：本人填报表、成果检索报告（如有）、扫描必要论文页/其他证明；已有库记录则不用"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m028",
      "name": "已经生效的科研诚信处理结论",
      "purpose": "已经生效的科研诚信处理结论；校学术道德/科研管理等法定校内机构持有；条件必需 P3/P5，只有权威结论已存在且依法允许核验时；受控的生效状态摘要/法定授权查询；不得上传调查卷宗；F003/F011/F029/F038 / SRC-009；S3 最小化只存处理状态、效力期限和来源；无有效记录≠AI证明“无不端”，不可读转机构核。来源材料槽 M028；材料缺失、不可读或权限不明时仅生成补件/人工核源待办，不据此自动拒绝。",
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
        "已经生效的科研诚信处理结论；校学术道德/科研管理等法定校内机构持有",
        "条件必需 P3/P5，只有权威结论已存在且依法允许核验时",
        "受控的生效状态摘要/法定授权查询；不得上传调查卷宗"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rule-checks",
      "name": "原件逐条规则核验",
      "description": "映射研究原件中 R001 至 R032 的全部规则。SRC 是研究来源索引，不是案卷材料 SourceRef。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "实名与任聘时点",
          "requirement": "研究规则 R001：\nR / 核验对象及阶段：R001 实名与任聘时点 P0\n触发 T / F / U：T 为某个人申报业绩（本人或经授权代理）；F 非个人业绩案；U 员工关系未取到\nSRC / F / M：SRC-004/014；F001/F003/F004/F005/F006；M001\n证据比较、时间/例外：服务端认证 ID 对人事任聘有效区间、当前单位；历史成果署名单位另走 R009，不以实名相同推资格；设计\n可能输出与下一角色：对应事实一致 PASS_FACT；两权威源冲突 CONFLICT；源失联 SOURCE_UNAVAILABLE；身份资格不明交人事 POLICY_UNCONFIRMED\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "代理权限",
          "requirement": "研究规则 R002：\nR / 核验对象及阶段：R002 代理权限 P0\n触发 T / F / U：T 有代理提交；F 本人操作；U 代理关系无法证实\nSRC / F / M：SRC-004（仅实名入口）；F003/F007/F031；M001/M002\n证据比较、时间/例外：对委托人/代办人/动作/有效期和后台授权；校本代办政策尚无完整依据，不能凭附件角色字段授权\n可能输出与下一角色：本人 NOT_APPLICABLE；代理证据吻合仅 PASS_FACT 核委托事实，操作范围未知 POLICY_UNCONFIRMED，送人事/系统授权管理员\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "申报目的与领域路由",
          "requirement": "研究规则 R003：\nR / 核验对象及阶段：R003 申报目的与领域路由 P0–P1\n触发 T / F / U：T 主张个人教学/科研/服务业绩；F 明确仅职称/聘任/津贴付款；U 目标用途未明确\nSRC / F / M：SRC-001/002/006–008；F002/F008/F009；M021\n证据比较、时间/例外：比较申报对象与领域成果分类；教育教学制度现行性不定仅可建议归口，不发等级\n可能输出与下一角色：域内事实 PASS_FACT；仅下游独立决定 NOT_APPLICABLE 并路由相邻 T；混合未明 POLICY_UNCONFIRMED 交业务受理人\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "年度政策、废止与过渡",
          "requirement": "研究规则 R004：\nR / 核验对象及阶段：R004 年度政策、废止与过渡 P0/P3\n触发 T / F / U：T 需引用成果等级/适用制度；F 只做不涉等级的原始事实核验；U 成果/认定日期、条款版本不明\nSRC / F / M：SRC-001/002/003/011；F010/F015/F027/F028；M021\n证据比较、时间/例外：比对原文文号、公布/生效/废止日期、成果发生与认定时间；2021 科研旧版已废止，历史过渡适用仍需授权解释；不得把教学镜像定为 2026 现行\n可能输出与下一角色：确认适用版本仅该政策事实 PASS_FACT；未证 POLICY_UNCONFIRMED →科发院/社科处/教学归口；不得旧版就高自动择优\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "当期批次与截止",
          "requirement": "研究规则 R005：\nR / 核验对象及阶段：R005 当期批次与截止 P0/P1/P4\n触发 T / F / U：T 有明确本次批次；F 该类业务不按批次办理且已获证明；U 不知有无批次或公告来源\nSRC / F / M：SRC-010/013（仅特定历史批次）；F002/F027/F037；M026/M021\n证据比较、时间/例外：对公告发布机关、批次、延期修订、适用成果和时区；非本批不使用 2025-12-24 节点；时限判断须现行校本授权\n可能输出与下一角色：相符 PASS_FACT；无依据 POLICY_UNCONFIRMED 或源失联 SOURCE_UNAVAILABLE；是否逾期受理交当期归口，绝不自动拒绝\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "当前证据可读与解析一致",
          "requirement": "研究规则 R006：\nR / 核验对象及阶段：R006 当前证据可读与解析一致 P1–P6\n触发 T / F / U：T 本阶段需读取某 M；F 未来阶段或非对应类别；U 尚不清楚当前是否需用\nSRC / F / M：SRC-004/005（上传/核验场景）；F011/F032；M001–M028（仅触发者）\n证据比较、时间/例外：校验实际字节/文件页、OCR 输出与原页定位；扫描失真不制造作者/编号；涉密只存授权指针；设计\n可能输出与下一角色：已可读 PASS_FACT；损坏 UNREADABLE →材料持有人；未取得 NEEDS_MATERIAL / SOURCE_UNAVAILABLE →对应持有人/数据管理员\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "出处、签发来源与证据版本",
          "requirement": "研究规则 R007：\nR / 核验对象及阶段：R007 出处、签发来源与证据版本 P1–P3\n触发 T / F / U：T 已提交/引用原件；F 该材料在本分支不使用；U 颁发机构或版本不可辨\nSRC / F / M：SRC-001/004/005；F011/F013–F016/F032；M003–M019/M021（实际子类）\n证据比较、时间/例外：比原件机构/登记记录、正式编号、日期、受控记录 ID 与哈希；截图/模型摘录仅可作线索；高低层源冲突不得静默覆盖；设计\n可能输出与下一角色：一致 PASS_FACT；可读权威源相反 CONFLICT →归口/颁发机构；信息不全 NEEDS_MATERIAL，失联 SOURCE_UNAVAILABLE\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "成果实体识别与同库重复",
          "requirement": "研究规则 R008：\nR / 核验对象及阶段：R008 成果实体识别与同库重复 P1–P3\n触发 T / F / U：T 候选相同 DOI/专利号/项目编号或同署名；F 已证实实体不同；U 编号缺失且相似度有疑义\nSRC / F / M：SRC-004/005；F011–F013/F033；M003 与该成果根证\n证据比较、时间/例外：比外部唯一号+类型+层级+关键日期；同源纸本/电子不自动算两个成果；未定先建候选重复组，不能硬合并 G06 源 ID；设计\n可能输出与下一角色：相同实体待归并 CONFLICT（事实归属）→数据 Owner；确证不重复 NOT_APPLICABLE；仅相似 NEEDS_HUMAN_DECISION →归口人员\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "r009",
          "title": "个人署名、排名、单位归属",
          "requirement": "研究规则 R009：\nR / 核验对象及阶段：R009 个人署名、排名、单位归属 P1–P2\n触发 T / F / U：T 主张某人成果贡献；F 无个人归属主张；U 同名/排名/转单位未判明\nSRC / F / M：SRC-004/005/012/014；F003/F005/F006/F017/F018/F019/F020/F021/F022；M001/M003/M004/M007/M011/M012/M016/M017/M022（按类别）\n证据比较、时间/例外：原件有序作者名单与受控人员 ID、成果当时单位/当前人事时点分别比；名单更正需原机关；不能凭中文同名或 OCR 推第一作者\n可能输出与下一角色：一致 PASS_FACT；来源互斥 CONFLICT →学院科研管理员+人事/原颁发机关；无权威归属 NEEDS_MATERIAL\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "科研成果主题库数据审核",
          "requirement": "研究规则 R010：\nR / 核验对象及阶段：R010 科研成果主题库数据审核 P1–P2\n触发 T / F / U：T 真实主题库记录存在；F 教学等未进入该库；U 接口或权限不明\nSRC / F / M：SRC-004/005；F011/F030/F031；M003\n证据比较、时间/例外：区分本人认领、学院初审、自然/社科二审事件和当前真实状态；审核时间及真实后台 Actor 可查；不把一级/二级数据通过换成分级签发\n可能输出与下一角色：数据状态吻合 PASS_FACT；库不可达 SOURCE_UNAVAILABLE；阶段不一致 CONFLICT →对应数据审核员；若需等级则另触发 R027，收到真实决定后才触发 R028\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "主题库漏项",
          "requirement": "研究规则 R011：\nR / 核验对象及阶段：R011 主题库漏项/退回补录 P1–P2/P6\n触发 T / F / U：T 经库检索确无项或有明确退回记录且类别支持补录；F 已有有效记录无退回；U 不能证实缺项/路径\nSRC / F / M：SRC-004/005；F011–F020/F030/F032/F035；M003/M004/M023/M027\n证据比较、时间/例外：核库检索版本、退回原因和学校补录所需表/论文页；仅适用指南列明的路径，已有库记录不强迫再填；修正送同一数据审核链\n可能输出与下一角色：事实充分 PASS_FACT；表缺 NEEDS_MATERIAL →本人；库不通 SOURCE_UNAVAILABLE →网信/学院；授权争议 POLICY_UNCONFIRMED\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "论文真实发表",
          "requirement": "研究规则 R012：\nR / 对象及阶段：R012 论文真实发表 P1–P2\n触发 T / F / U：T 已发表论文主张；F 非论文类别；U 在投/在线优先/正式刊出状态未定\nSRC / F / M：SRC-001/002/004；F009–F020/F024；M004\n证据比较、时间/例外：发行机构题名、DOI、见刊/在线日期、作者及署名单位，保存不同版本；不能以投稿通知作正式发表\n可能输出与下一角色：一致 PASS_FACT；缺发表根证 NEEDS_MATERIAL →本人/出版社；相反 DOI/名单 CONFLICT →学院和期刊\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "检索与分区年度事实",
          "requirement": "研究规则 R013：\nR / 对象及阶段：R013 检索与分区年度事实 P2–P3\n触发 T / F / U：T 适用政策确需分区/检索值；F 与该论文子类认定无关；U 适用年度/检索平台待核\nSRC / F / M：SRC-001/002/004；F013/F024/F027；M004/M005/M021\n证据比较、时间/例外：比检索源、查询日、正式检索年、对应论文；“如有”材料不得一律必交；动态分区不可拿当前值冒充历史值\n可能输出与下一角色：可核 PASS_FACT；源停服 SOURCE_UNAVAILABLE；年度政策未知 POLICY_UNCONFIRMED →归口成果科\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "知识产权授权阶段",
          "requirement": "研究规则 R014：\nR / 对象及阶段：R014 知识产权授权阶段 P1–P2\n触发 T / F / U：T 主张已授权专利/软著等；F 非权利成果；U 申请中还是授权中不明\nSRC / F / M：SRC-001/004；F009/F013–F020；M006\n证据比较、时间/例外：对登记机关、申请/授权号、权利人/发明人、授予日期及有效阶段；申请受理不能当已授权\n可能输出与下一角色：一致 PASS_FACT；仍在申请且主张授权 CONFLICT；证书未交 NEEDS_MATERIAL →权利人/科发院\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "科研项目获批及负责人层级",
          "requirement": "研究规则 R015：\nR / 对象及阶段：R015 科研项目获批及负责人层级 P1–P2\n触发 T / F / U：T 主张项目/课题/专题立项；F 非项目类；U 层级/批准状态不明\nSRC / F / M：SRC-001/012；F009–F022；M007\n证据比较、时间/例外：对正式批文/任务书的项目号、母子层级、承担单位、负责人、生效日；国家重点（重大）类型必须专门核任务书，涉密转线下\n可能输出与下一角色：相符 PASS_FACT；母项目/课题错配 CONFLICT →科发院项目管理；源不可查 SOURCE_UNAVAILABLE\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "国家重点项目变更真实性",
          "requirement": "研究规则 R016：\nR / 对象及阶段：R016 国家重点项目变更真实性 P2/P6\n触发 T / F / U：T 任务书责任人/任务发生变更；F 已证未变更；U 新旧说法不一致\nSRC / F / M：SRC-012 第7、10条；F016/F019/F022/F034；M007/M008\n证据比较、时间/例外：比原任务书、有权变更批件、签章机关、变更前后生效时间；仅国家重点（重大）项目用此专门口径\n可能输出与下一角色：无变更 NOT_APPLICABLE；批件相符 PASS_FACT；自称变更无有效批准 CONFLICT →项目主管人工\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "项目到账金额与计量口径",
          "requirement": "研究规则 R017：\nR / 对象及阶段：R017 项目到账金额与计量口径 P2–P3\n触发 T / F / U：T 当前有效类别明确要求金额；F 分级与金额无关；U 是否按合同额/到账额不明\nSRC / F / M：SRC-001/012；F022/F023/F027；M007/M009/M021\n证据比较、时间/例外：项目 ID 对受控财务流水、币种、到账日、可计金额及政策年度；预算、合同总额不自动等于到账；金额阈值不硬编码\n可能输出与下一角色：财务事实吻合 PASS_FACT；口径不明 POLICY_UNCONFIRMED →财务+科研归口；源不可取 SOURCE_UNAVAILABLE\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "科研结项",
          "requirement": "研究规则 R018：\nR / 对象及阶段：R018 科研结项/验收事实 P3–P5\n触发 T / F / U：T 已主张结项/验收通过且完成节点出现；F 执行期只申报立项；U 是否进入验收阶段不明\nSRC / F / M：SRC-012 第30–33条（仅适用专项）；F016/F022/F029；M007/M010\n证据比较、时间/例外：核主管验收结论与对应任务书、日期/状态；未到验收时不制造缺件；非国家重点项目须取其自身管理依据\n可能输出与下一角色：已结项 PASS_FACT；尚未形成结论 NOT_APPLICABLE（对执行期申报）；已声称结项却无当期凭据 NEEDS_MATERIAL →项目主管\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "科技奖励本人名次",
          "requirement": "研究规则 R019：\nR / 对象及阶段：R019 科技奖励本人名次 P1–P2\n触发 T / F / U：T 已获科技奖；F 非科技奖；U 名单或届次未证\nSRC / F / M：SRC-001；F012–F021；M011\n证据比较、时间/例外：奖励机关正式名单/证书比届次、等级、个人名次及团队实体；证书和公告两份有效记录相反不能按更高级取值\n可能输出与下一角色：一致 PASS_FACT；名单冲突 CONFLICT →授奖机关/科研归口；无源 NEEDS_MATERIAL\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "专著与教材出版",
          "requirement": "研究规则 R020：\nR / 对象及阶段：R020 专著与教材出版/作者贡献 P1–P2\n触发 T / F / U：T 已出版著作、教材；F 非出版物；U 合同签订但出版状态不清\nSRC / F / M：SRC-001/002；F009–F020/F024；M012\n证据比较、时间/例外：核 ISBN/版权页/出版社、版次、主编与参编顺序；同书多次印刷不自动算多项，分级仍受 R004\n可能输出与下一角色：事实相符 PASS_FACT；出版未证 NEEDS_MATERIAL →出版社/作者；教学分级 POLICY_UNCONFIRMED →教务归口\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "教改项目与课程获批",
          "requirement": "研究规则 R021：\nR / 对象及阶段：R021 教改项目与课程获批 P1–P2\n触发 T / F / U：T 主张学校/上级已批准教改、课程建设；F 只是申请或规划且不主张获批；U 名单批次不明\nSRC / F / M：SRC-002/008/013；F008–F020/F027；M013/M015\n证据比较、时间/例外：以批准机关正式立项/课程名单核项目名、负责人、批次、教育学段，申请书不能当批准文件；具体分级暂不采镜像硬阈值\n可能输出与下一角色：获批事实 PASS_FACT；只有申请未批准则“获批主张” CONFLICT；源失联 SOURCE_UNAVAILABLE →教学项目主管\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "教学验收与遴选阶段分离",
          "requirement": "研究规则 R022：\nR / 对象及阶段：R022 教学验收与遴选阶段分离 P3–P5\n触发 T / F / U：T 主张已验收或已获优质课程级别；F 只核建设期获批；U 验收/遴选状态不明\nSRC / F / M：SRC-002/013；F009/F016/F027/F029；M013/M014/M015\n证据比较、时间/例外：单独比建设立项、验收决定、优质课程评选三个事件及发布日期；第二批知识图谱课程聘期用途≠积分奖励；未来尚未验收不索 M014\n可能输出与下一角色：对已成事实 PASS_FACT；误把验收当优质课程 CONFLICT；分级需现行政策 POLICY_UNCONFIRMED →教学归口\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "教学竞赛、成果奖和指导排序",
          "requirement": "研究规则 R023：\nR / 对象及阶段：R023 教学竞赛、成果奖和指导排序 P1–P3\n触发 T / F / U：T 主张教师竞赛/教学奖/学生竞赛指导；F 非获奖/指导成果；U 奖项届次、指导角色不清\nSRC / F / M：SRC-002/010；F012–F021/F027/F033；M016/M017/M021\n证据比较、时间/例外：原始获奖公告对同年同项、本人指导名次；SRC-002 的最高一次线索仅待现行性核定，不据此全局自动扣除\n可能输出与下一角色：获奖事实 PASS_FACT；多人名单相反 CONFLICT；积分/重复阈值 POLICY_UNCONFIRMED →教务/对应教学主管\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "社会服务委托与本人角色",
          "requirement": "研究规则 R024：\nR / 对象及阶段：R024 社会服务委托与本人角色 P1–P2\n触发 T / F / U：T 已签社会服务合同/受托任务；F 纯论文等非服务；U 任务机关或合同主体不明\nSRC / F / M：SRC-001/006/007；F009/F010/F014/F019/F020/F025；M018\n证据比较、时间/例外：比有权委托函/合同对象、签约和服务区间、承担个人；合同仅证明委托，不是实际完成/影响力\n可能输出与下一角色：委托相符 PASS_FACT；签约主体不一致 CONFLICT →委托方+业务归口；合同尚无 NEEDS_MATERIAL\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "服务完成、采纳及直接证据",
          "requirement": "研究规则 R025：\nR / 对象及阶段：R025 服务完成、采纳及直接证据 P2–P4\n触发 T / F / U：T 主张活动已完成、成果已采纳或影响已发生；F 只核委托事实尚未执行；U 交付时间或影响级别不清\nSRC / F / M：SRC-001/007；F016/F025/F026/F029；M018/M019\n证据比较、时间/例外：将采纳机关、实际会次/成果、本人角色与前置任务匹配，保留证明日；仅服务合同不推定采纳，影响层级需要专业核定\n可能输出与下一角色：直接事实 PASS_FACT；主张已采纳无当前直证 NEEDS_MATERIAL；影响价值 NEEDS_HUMAN_DECISION →社科处/有权部门\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "跨类使用与重复计量",
          "requirement": "研究规则 R026：\nR / 对象及阶段：R026 跨类使用与重复计量 P2–P4\n触发 T / F / U：T 同实体跨研究/教学/服务或同年同项重复申报；F 已证不存在重复；U 实体同一性或类别口径不明\nSRC / F / M：SRC-001/002/004/005；F008/F011/F013/F017–F021/F027/F033；M003/M004/M016/M020/M021/M022（仅涉及项）\n证据比较、时间/例外：对实体、署名、年度、使用目的和条款逐一比；“署名认领一次”不是“只准在一项下游使用”；未拿到教学现行制度不执行就高/禁止重复结论\n可能输出与下一角色：事实重复嫌疑 CONFLICT →双归口；政策未知由 R027 另出 POLICY_UNCONFIRMED →解释机关；证实不同 NOT_APPLICABLE\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "r027",
          "title": "类别",
          "requirement": "研究规则 R027：\nR / 对象及阶段：R027 类别/等级候选适用性 P3–P4\n触发 T / F / U：T 需要给成果等级建议；F 仅核原始事实；U 分类解释/现行规则不明\nSRC / F / M：SRC-001/002/006–008；F008/F009/F010/F024/F027/F028；M005/M009/M019/M021 及所涉原件\n证据比较、时间/例外：按发生年度、适用学科、真实证据逐格比有权条款；F028 仅候选；特例、跨类、动态分区和教学镜像必须转人；不固定缺证的分级阈值\n可能输出与下一角色：可核条款条件 PASS_FACT（仅对候选映射）；未证 POLICY_UNCONFIRMED，涉裁量 NEEDS_HUMAN_DECISION →对应政策解释/认定部门\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "r028",
          "title": "已有或新签正式业绩认定真实性",
          "requirement": "研究规则 R028：\nR / 对象及阶段：R028 已有或新签正式业绩认定真实性 P3/P5/P6\n触发 T / F / U：T 声称已正式认定/已收到新决定；F 尚无正式决定、只申请事实预审；U 是否为有权签发不明\nSRC / F / M：SRC-001/002/004/005（归口职责/数据区别）；F029/F030/F031/F038；M003/M020/M024\n证据比较、时间/例外：比源决定 ID、签发机关、后台授权、时间、生效/撤销、版本、使用目的；主题库二审不是等级签发；无正式决定不产生 F029\n可能输出与下一角色：已有决定真伪被核实 PASS_FACT（不是本模板批准）；无决定 NOT_APPLICABLE；签发权限未知 NEEDS_HUMAN_DECISION →学校有权签发/复核机构\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "诚信有效结论",
          "requirement": "研究规则 R029：\nR / 对象及阶段：R029 诚信有效结论/涉密处理 P2–P5\n触发 T / F / U：T 收到依法可查询且已有效的诚信结论或确属涉密专项；F 本案确不涉及这些特殊处理；U 权限不明/涉密类别未定\nSRC / F / M：SRC-009/012；F003/F011/F022/F029/F032/F038；M007/M028\n证据比较、时间/例外：只取最低限度有效状态与所属成果，不传调查卷宗；涉密国家重点项目依专门线下程序；无检索权限≠查无不端，模型不得作诚信定性\n可能输出与下一角色：权威“状态存在”可 PASS_FACT；效力/处分适用要 NEEDS_HUMAN_DECISION →科研诚信/保密主管；源不可用 SOURCE_UNAVAILABLE\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "证据替换与定向失效",
          "requirement": "研究规则 R030：\nR / 对象及阶段：R030 证据替换与定向失效 P6\n触发 T / F / U：T 某 M 版本被合法替换；F 内容/源版本未变；U 原版本或替换者权限不明\nSRC / F / M：SRC-004/005（退回修改场景）；F001/F011/F031/F032/F034；M003/M023 与被替换 M\n证据比较、时间/例外：核 oldHash/newHash、来源、修订原因、证据→字段→R 依赖图；仅失效引用旧版的预核 R，保留审计事件；设计\n可能输出与下一角色：依赖可重算 PASS_FACT（对替换链完整性）；范围不明 CONFLICT →案件 Owner；不自动撤销 M020/M024\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "补正、撤回请求、异议复核资格",
          "requirement": "研究规则 R031：\nR / 对象及阶段：R031 补正、撤回请求、异议复核资格 P2/P6\n触发 T / F / U：T 申请人/有权机关发起退回补正、撤回或复核；F 尚无请求；U 发起人、期限或程序不明\nSRC / F / M：SRC-004/005（只证资料退回补正）；F001/F003/F031/F034/F035；M001/M002/M023/M020（已决定时）\n证据比较、时间/例外：比真实请求者、案卷版本、补正事项及学校正式程序；资料退回可接学校数据链，正式撤回/申诉时限和机关未知，不作自动生效决定\n可能输出与下一角色：可核请求事件 PASS_FACT；资格/正式撤销权限未证 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION →学校原归口或复核机关；不得删除历史决定\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "下游决定的受控引用",
          "requirement": "研究规则 R032：\nR / 对象及阶段：R032 下游决定的受控引用 P5/P6\n触发 T / F / U：T 真实下游职称/岗位/聘期/奖励事项要求引用；F 尚无下游引用；U 来源决定版本/用途不明\nSRC / F / M：SRC-002/010/013（用途线索）；F002/F011/F029/F036/F038；M020/M024/M025\n证据比较、时间/例外：核源决定 ID、可用目的、有效版本与实际下游引用回执；不能用 G50 代码标记或旧 run@rev 假冒学校决定；设计\n可能输出与下一角色：可靠引用事实 PASS_FACT；源决定缺失 SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION →原签发机关；下游独立决定交其业务 Owner\n\n安全门禁：此项仅用于本地研究模板中的事实/证据预核；不构成校方正式政策或决定。政策效力、适用身份、授权、阈值或例外未获现行权威来源确认时，必须标记 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION 并交有权人员人工复核；不得自动产生正式通过或拒绝。",
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
  "templateId": "T02-T07",
  "name": "个人教学、科研与社会服务业绩认定审核",
  "officialSchoolTemplate": false,
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T02-T07.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T02-T07.md",
  "sourceDocumentSha256": "9eada57916d9f4a9a22a7df57951072aac569f0dd9a79e3d2a90df1446d2b7f9",
  "sourceOriginalGitBlobSha": "0bfa9aa5e98d9d92528573408bef07cdf43c14a8",
  "sourceSnapshot": "2026-10-22",
  "researchAsOf": "2026-10-22",
  "researchEvidenceStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "authoringStatus": "ROUND3_DRAFT",
  "fieldIds": [
    {
      "sourceId": "F001",
      "fieldKey": "f001",
      "label": "案卷标识"
    },
    {
      "sourceId": "F002",
      "fieldKey": "f002",
      "label": "本次使用目的"
    },
    {
      "sourceId": "F003",
      "fieldKey": "f003",
      "label": "申请人受控身份 ID"
    },
    {
      "sourceId": "F004",
      "fieldKey": "f004",
      "label": "申请人姓名"
    },
    {
      "sourceId": "F005",
      "fieldKey": "f005",
      "label": "申请时任聘身份与有效区间"
    },
    {
      "sourceId": "F006",
      "fieldKey": "f006",
      "label": "申请时所属院系/校区"
    },
    {
      "sourceId": "F007",
      "fieldKey": "f007",
      "label": "代理关系/授权范围"
    },
    {
      "sourceId": "F008",
      "fieldKey": "f008",
      "label": "业绩一级领域"
    },
    {
      "sourceId": "F009",
      "fieldKey": "f009",
      "label": "成果子类"
    },
    {
      "sourceId": "F010",
      "fieldKey": "f010",
      "label": "成果发生/获批/完成时点"
    },
    {
      "sourceId": "F011",
      "fieldKey": "f011",
      "label": "同一成果实体的受控 ID"
    },
    {
      "sourceId": "F012",
      "fieldKey": "f012",
      "label": "成果题名/项目名"
    },
    {
      "sourceId": "F013",
      "fieldKey": "f013",
      "label": "外部唯一标识（DOI、专利号、项目号、ISBN 等）"
    },
    {
      "sourceId": "F014",
      "fieldKey": "f014",
      "label": "颁发/发表/委托主体"
    },
    {
      "sourceId": "F015",
      "fieldKey": "f015",
      "label": "正式发文/出版/授权日期"
    },
    {
      "sourceId": "F016",
      "fieldKey": "f016",
      "label": "成果生命周期状态"
    },
    {
      "sourceId": "F017",
      "fieldKey": "f017",
      "label": "原件上的贡献者姓名"
    },
    {
      "sourceId": "F018",
      "fieldKey": "f018",
      "label": "作者/参与人/指导教师排序"
    },
    {
      "sourceId": "F019",
      "fieldKey": "f019",
      "label": "贡献角色"
    },
    {
      "sourceId": "F020",
      "fieldKey": "f020",
      "label": "成果时点署名/承担单位"
    },
    {
      "sourceId": "F021",
      "fieldKey": "f021",
      "label": "其他作者/团队及各自顺序"
    },
    {
      "sourceId": "F022",
      "fieldKey": "f022",
      "label": "项目/课题/专题层级及负责人"
    },
    {
      "sourceId": "F023",
      "fieldKey": "f023",
      "label": "合规核对所需到账/资助金额及口径"
    },
    {
      "sourceId": "F024",
      "fieldKey": "f024",
      "label": "出版物类型与检索级别/年度"
    },
    {
      "sourceId": "F025",
      "fieldKey": "f025",
      "label": "社会服务类型/对象"
    },
    {
      "sourceId": "F026",
      "fieldKey": "f026",
      "label": "服务完成、采纳、影响或会次事实"
    },
    {
      "sourceId": "F027",
      "fieldKey": "f027",
      "label": "政策文号、版本、有效期与适用情形"
    },
    {
      "sourceId": "F028",
      "fieldKey": "f028",
      "label": "系统提出的候选类别/等级"
    },
    {
      "sourceId": "F029",
      "fieldKey": "f029",
      "label": "学校已有正式认定等级及适用用途"
    },
    {
      "sourceId": "F030",
      "fieldKey": "f030",
      "label": "成果主题库数据审核阶段/状态"
    },
    {
      "sourceId": "F031",
      "fieldKey": "f031",
      "label": "核验/决定人服务端可信角色"
    },
    {
      "sourceId": "F032",
      "fieldKey": "f032",
      "label": "材料版本、来源与校验值"
    },
    {
      "sourceId": "F033",
      "fieldKey": "f033",
      "label": "成果实体去重候选组"
    },
    {
      "sourceId": "F034",
      "fieldKey": "f034",
      "label": "新旧证据替代链"
    },
    {
      "sourceId": "F035",
      "fieldKey": "f035",
      "label": "撤回/补件/异议请求状态"
    },
    {
      "sourceId": "F036",
      "fieldKey": "f036",
      "label": "下游使用业务、目的与版本"
    },
    {
      "sourceId": "F037",
      "fieldKey": "f037",
      "label": "有来源的批次截止节点"
    },
    {
      "sourceId": "F038",
      "fieldKey": "f038",
      "label": "正式决定的机构、签发依据与效力"
    }
  ],
  "materialSlotIds": [
    {
      "sourceId": "M001",
      "slotId": "m001",
      "name": "真人及任聘关系"
    },
    {
      "sourceId": "M002",
      "slotId": "m002",
      "name": "代理授权"
    },
    {
      "sourceId": "M003",
      "slotId": "m003",
      "name": "已有校内成果及审核事件"
    },
    {
      "sourceId": "M004",
      "slotId": "m004",
      "name": "论文原始发表/署名事实"
    },
    {
      "sourceId": "M005",
      "slotId": "m005",
      "name": "期刊检索、收录分区或成果检索证明"
    },
    {
      "sourceId": "M006",
      "slotId": "m006",
      "name": "知识产权授权事实"
    },
    {
      "sourceId": "M007",
      "slotId": "m007",
      "name": "科研项目获批、层级和负责人"
    },
    {
      "sourceId": "M008",
      "slotId": "m008",
      "name": "负责人或任务变更有权批件"
    },
    {
      "sourceId": "M009",
      "slotId": "m009",
      "name": "经费到账或财政口径事实"
    },
    {
      "sourceId": "M010",
      "slotId": "m010",
      "name": "科研项目验收/结项事实"
    },
    {
      "sourceId": "M011",
      "slotId": "m011",
      "name": "科技奖励及本人获奖排名"
    },
    {
      "sourceId": "M012",
      "slotId": "m012",
      "name": "专著/教材出版事实"
    },
    {
      "sourceId": "M013",
      "slotId": "m013",
      "name": "教改/课程等教育项目获批"
    },
    {
      "sourceId": "M014",
      "slotId": "m014",
      "name": "教学项目验收或建成"
    },
    {
      "sourceId": "M015",
      "slotId": "m015",
      "name": "课程建设/优质课程正式立项或遴选名单"
    },
    {
      "sourceId": "M016",
      "slotId": "m016",
      "name": "教学成果奖/教学竞赛奖正式凭据"
    },
    {
      "sourceId": "M017",
      "slotId": "m017",
      "name": "教学指导/学生竞赛/学位论文指导排名"
    },
    {
      "sourceId": "M018",
      "slotId": "m018",
      "name": "社会服务委托/任务事实"
    },
    {
      "sourceId": "M019",
      "slotId": "m019",
      "name": "社会服务履行、采纳及直接证明"
    },
    {
      "sourceId": "M020",
      "slotId": "m020",
      "name": "既有正式成果/等级认定决定"
    },
    {
      "sourceId": "M021",
      "slotId": "m021",
      "name": "校本政策与适用年度/批次快照"
    },
    {
      "sourceId": "M022",
      "slotId": "m022",
      "name": "署名、归属和跨单位争议补证"
    },
    {
      "sourceId": "M023",
      "slotId": "m023",
      "name": "退回补正/撤回/异议与材料更正请求"
    },
    {
      "sourceId": "M024",
      "slotId": "m024",
      "name": "本次正式人工认定、复核或撤销决定"
    },
    {
      "sourceId": "M025",
      "slotId": "m025",
      "name": "职称/聘期/岗位/奖励等下游引用回执"
    },
    {
      "sourceId": "M026",
      "slotId": "m026",
      "name": "当期批次截止或申报窗口通知"
    },
    {
      "sourceId": "M027",
      "slotId": "m027",
      "name": "缺失论文手工补录信息表及辅助附件"
    },
    {
      "sourceId": "M028",
      "slotId": "m028",
      "name": "已经生效的科研诚信处理结论"
    }
  ],
  "criteria": [
    {
      "sectionId": "rule-checks",
      "criterionId": "r001",
      "srcIds": [
        "SRC-004",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r002",
      "srcIds": [
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-011"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r005",
      "srcIds": [
        "SRC-010",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r006",
      "srcIds": [
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r007",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r008",
      "srcIds": [
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r009",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-012",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r010",
      "srcIds": [
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r011",
      "srcIds": [
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r012",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r013",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r014",
      "srcIds": [
        "SRC-001",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r015",
      "srcIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r016",
      "srcIds": [
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r017",
      "srcIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r018",
      "srcIds": [
        "SRC-012"
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
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r021",
      "srcIds": [
        "SRC-002",
        "SRC-008",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r022",
      "srcIds": [
        "SRC-002",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r023",
      "srcIds": [
        "SRC-002",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r024",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r025",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r026",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r027",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r028",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r029",
      "srcIds": [
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r030",
      "srcIds": [
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r031",
      "srcIds": [
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rule-checks",
      "criterionId": "r032",
      "srcIds": [
        "SRC-002",
        "SRC-010",
        "SRC-013"
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
    "SRC-014"
  ]
} as const
