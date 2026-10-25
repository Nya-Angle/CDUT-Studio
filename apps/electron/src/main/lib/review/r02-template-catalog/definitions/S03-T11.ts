import type { TemplateVersion } from '@profer/shared'

/** 本地研究模板；不代表学校已发布或授权。 */
export const S03T11: TemplateVersion = {
  "templateId": "S03-T11",
  "version": 1,
  "schemaVersion": 2,
  "name": "学费减免与专项经济资助资格审核",
  "description": "学费减免与专项经济资助资格审核。本地研究模板 · 非校方正式模板。仅供事实核验和人工复核建议；不得代替校本制度或正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 来源 docs/design/review-agent/business-templates/R02/research-original/S03-T11.md；非校方正式模板。政策证据 PARTIAL；当期校本授权和最终决定未确认，不创建政策版本，不作学校远端回写。",
  "objectType": "person",
  "displayName": {
    "template": "{{f001}} · 学费减免与专项经济资助资格审核"
  },
  "fields": [
    {
      "key": "f001",
      "label": "申请唯一标识（F001）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f002",
      "label": "申请版本（F002）",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f003",
      "label": "受益人学号/可信学生引用（F003）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f004",
      "label": "法定姓名（F004）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f005",
      "label": "实际递交者可信 Actor（F005）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f006",
      "label": "代理关系及授权结果（F006）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "f007",
      "label": "合法联系渠道（F007）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f008",
      "label": "学历学段（F008）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f009",
      "label": "现时学籍状态（F009）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f010",
      "label": "所属学院/专业（F010）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f011",
      "label": "校区及负责单位（F011）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f012",
      "label": "入学年级/培养类型（F012）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f013",
      "label": "申请事项子类型（F013）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f014",
      "label": "正式项目及批次标识（F014）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f015",
      "label": "资金性质及决定目的（F015）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f016",
      "label": "政策来源及具体版本（F016）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f017",
      "label": "政策适用期间/对象口径（F017）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f018",
      "label": "申请提交时间（F018）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f019",
      "label": "当前办理阶段（F019）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f020",
      "label": "申请理由/本人真实性声明（F020）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f021",
      "label": "已作出困难认定决定引用（F021）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f022",
      "label": "困难认定有效期间及等级（F022）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f023",
      "label": "特殊政策身份类型（F023）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f024",
      "label": "特殊身份原始证明引用（F024）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f025",
      "label": "特殊身份效期/签发主体（F025）",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f026",
      "label": "历史入学/特资适用证明（F026）",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f027",
      "label": "学费所属学年/费用项目（F027）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f028",
      "label": "应缴学费（F028）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f029",
      "label": "实缴学费（F029）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f030",
      "label": "缓缴及缴费状态（F030）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f031",
      "label": "国家助学贷款事实（F031）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f032",
      "label": "其他奖助/专项资金记录（F032）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f033",
      "label": "既有学费减免记录（F033）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f034",
      "label": "跨项目重叠事实及待裁量项（F034）",
      "kind": "enum",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f035",
      "label": "申请人希望减免/资助额度（F035）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f036",
      "label": "正式核定额度（F036）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "f037",
      "label": "当前材料清单及版本（F037）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f038",
      "label": "每份材料来源和原文定位（F038）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f039",
      "label": "跨来源冲突清单（F039）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f040",
      "label": "当前缺件及责任人（F040）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f041",
      "label": "补件通知及截止（F041）",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "f042",
      "label": "补交材料接收及核验（F042）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f043",
      "label": "更正原因/指向旧版本（F043）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f044",
      "label": "原生效决定引用（F044）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f045",
      "label": "撤回请求及提出时间（F045）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "f046",
      "label": "复核请求、争点及时间（F046）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "f047",
      "label": "审批/复核岗位授权校验（F047）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "f048",
      "label": "有权人员正式意见与时点（F048）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f049",
      "label": "正式决定原件与效力（F049）",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case"
    },
    {
      "key": "f050",
      "label": "学费冲抵/入账记录（F050）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f051",
      "label": "退款/资金支付记录（F051）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f052",
      "label": "补件/政策修订受影响字段集（F052）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    },
    {
      "key": "f053",
      "label": "审计链与原 Run 绑定（F053）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "申请意愿、子类型、本人声明",
      "purpose": "学生本人/可信代理；当期官方表单如有，或可审查的申请说明与受理记录；P1 **当期必需**；可结构化线上声明但不宣称有校方在线入口；F003/F005/F007/F013/F018/F020/F035；SRC-001/002/003；申请人×批次×版本；缺 NM，损坏 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "学生本人/可信代理；当期官方表单如有，或可审查的申请说明与受理记录；P1 **当期必需**；可结构化线上声明但不宣称有校方在线入口；F003/F005/F007/F013/F018/F020/F035；SRC-001/002/003；申请人×批次×版本；缺 NM，损坏 UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M002",
      "name": "学籍与学生身份权威信息",
      "purpose": "学籍主管部门；在校状态/学号/姓名/学段/入学年份/学院校区记录；P2 **当期必需**（无需学生重复上传）；有接口直接查；无接口用主管部门验证的在校证明，证件仅辅助；F003/F004/F008–F012/F026；SRC-002/004/008；学籍生效日及查询版；无接口 SU，内容冲突 CF",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "学籍主管部门；在校状态/学号/姓名/学段/入学年份/学院校区记录；P2 **当期必需**（无需学生重复上传）；有接口直接查；无接口用主管部门验证的在校证明，证件仅辅助；F003/F004/F008–F012/F026；SRC-002/004/008；学籍生效日及查询版；无接口 SU，内容冲突 CF"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M003",
      "name": "授权代交证据",
      "purpose": "委托学生/代理；经允许的书面/电子授权及身份匹配；代理 P1/P8 **条件必需**；可信校方代理授权系统（如真实存在）替代；F005/F006；现行形式未核 SRC-004；代理人和被代理人双归属；缺 NM/NH，不可读 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "委托学生/代理；经允许的书面/电子授权及身份匹配；代理 P1/P8 **条件必需**；可信校方代理授权系统（如真实存在）替代；F005/F006；现行形式未核 SRC-004；代理人和被代理人双归属；缺 NM/NH，不可读 UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M004",
      "name": "当前校本学费减免制度与申报通知",
      "purpose": "学校正式发布部门；有效政策原文、版本、项目说明；P0/P3 **当期必需（机构提供）**；校方可核盖章原件/正式政策库；F013–F017；SRC-001/002/003/012；项目/学段/批次/效期；找不到 SU/PC，不可读 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "学校正式发布部门；有效政策原文、版本、项目说明；P0/P3 **当期必需（机构提供）**；校方可核盖章原件/正式政策库；F013–F017；SRC-001/002/003/012；项目/学段/批次/效期；找不到 SU/PC，不可读 UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M005",
      "name": "应缴/实缴/缓缴学费账",
      "purpose": "学校财务系统/财务主管人员；指定学年学费台账；P4 **当期必需（机构取得）**；盖章财务核验或可验真系统记录；个人缴费截图仅证据线索；F027–F030/F033；SRC-005；受益人×费用期间×账务版；SU/CF/UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "学校财务系统/财务主管人员；指定学年学费台账；P4 **当期必需（机构取得）**；盖章财务核验或可验真系统记录；个人缴费截图仅证据线索；F027–F030/F033；SRC-005；受益人×费用期间×账务版；SU/CF/UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M006",
      "name": "已生效困难认定结果",
      "purpose": "S03-T06 认定权威单位；决定/等级及有效年度；政策要求时 P3 **条件必需**；已授权可访问的校方认定系统记录替代上传；F021/F022；SRC-004/006/007/008；原决定人×学年×版本；SU/PC，不得在本案重新认定",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "S03-T06 认定权威单位；决定/等级及有效年度；政策要求时 P3 **条件必需**；已授权可访问的校方认定系统记录替代上传；F021/F022；SRC-004/006/007/008；原决定人×学年×版本；SU/PC，不得在本案重新认定"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M007",
      "name": "孤儿身份与必要的家庭困难事实",
      "purpose": "原出证/认定机关；可验真的孤儿/监护状态材料；声称且适用政策时 P3 **条件必需**；权威政府/学校核验记录可替代复印件；F023–F025；SRC-003（仅历史线索）；证明受益人和效期；缺 NM，模糊 UNREADABLE，真实性 NH",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "原出证/认定机关；可验真的孤儿/监护状态材料；声称且适用政策时 P3 **条件必需**；权威政府/学校核验记录可替代复印件；F023–F025；SRC-003（仅历史线索）；证明受益人和效期；缺 NM，模糊 UNREADABLE，真实性 NH"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M008",
      "name": "烈士子女身份",
      "purpose": "有权出具/确认部门；身份关系证明；条件 P3；可验证正式身份记录替代；F023–F025；SRC-003（历史）；受益人/出证机关；NM/UNREADABLE/NH",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "有权出具/确认部门；身份关系证明；条件 P3；可验证正式身份记录替代；F023–F025；SRC-003（历史）；受益人/出证机关；NM/UNREADABLE/NH"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M009",
      "name": "优抚家庭子女身份",
      "purpose": "有权确认部门；优抚关系、亲属身份链；条件 P3；可验证正式记录替代；F023–F025；SRC-003（历史）；家庭关系版本/适用期间；NM/UNREADABLE/NH",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "有权确认部门；优抚关系、亲属身份链；条件 P3；可验证正式记录替代；F023–F025；SRC-003（历史）；家庭关系版本/适用期间；NM/UNREADABLE/NH"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M010",
      "name": "当期政策列明的其他特殊身份",
      "purpose": "指定外部出证机关；项目明确要求的证明；项目有规定时 P3 **条件必需**；项目指定权威查询记录；F023–F025；SRC-002/016（细则未得）；不凭经验扩大身份证明范围；PC 优先，无法取得 SU",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "指定外部出证机关；项目明确要求的证明；项目有规定时 P3 **条件必需**；项目指定权威查询记录；F023–F025；SRC-002/016（细则未得）；不凭经验扩大身份证明范围；PC 优先，无法取得 SU"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M011",
      "name": "已享受其他奖助及专项资助决定",
      "purpose": "S03-T07/T10 或其他原主管部门；正式受助清单/决定；需要查交叉时 P4 **条件必需**；直接引用原权威记录；F032/F034；SRC-002/011；原项目/人员/期间/状态/版；SU/CF",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "S03-T07/T10 或其他原主管部门；正式受助清单/决定；需要查交叉时 P4 **条件必需**；直接引用原权威记录；F032/F034；SRC-002/011；原项目/人员/期间/状态/版；SU/CF"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M012",
      "name": "国家助学贷款正式记录",
      "purpose": "S03-T08/经办机构；贷款合同/回执及已用学费事实；存在贷款或交叉时 P4 **条件必需**；可验真贷款和学校资助核查数据；F031/F034；SRC-002；人/贷款合同/期间；SU/CF/UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "S03-T08/经办机构；贷款合同/回执及已用学费事实；存在贷款或交叉时 P4 **条件必需**；可验真贷款和学校资助核查数据；F031/F034；SRC-002；人/贷款合同/期间；SU/CF/UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M013",
      "name": "家庭特殊经济困难补充事实",
      "purpose": "本人、外部主管部门；重大变故说明及公告明确要求的证明；**仅校本政策要求** P3 条件必需；可信困难认定决定 M006 能覆盖则不另索取；F020/F021/F023；SRC-002/003/011；极敏感、只收目的必要部分；不具清单 PC，缺 NM",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "本人、外部主管部门；重大变故说明及公告明确要求的证明；**仅校本政策要求** P3 条件必需；可信困难认定决定 M006 能覆盖则不另索取；F020/F021/F023；SRC-002/003/011；极敏感、只收目的必要部分；不具清单 PC，缺 NM"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M014",
      "name": "历史专项入学/受助资格记录",
      "purpose": "学籍部门/专项主管部门；历史入学区间与既有专项申报状态；C06 P3 **条件必需**；可信官方历史名册，关联 M002；F012/F014/F026；SRC-009；受益人×历史批次；无权威名单 SU，不可读 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "学籍部门/专项主管部门；历史入学区间与既有专项申报状态；C06 P3 **条件必需**；可信官方历史名册，关联 M002；F012/F014/F026；SRC-009；受益人×历史批次；无权威名单 SU，不可读 UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M015",
      "name": "以前正式学费减免决定",
      "purpose": "原减免有权单位/财务；批准决定、效期、履行状态；C02/C08/C13/C15 **条件必需**；原正式决定电子档及账目，不是上期申请草稿；F033/F044；SRC-002/005；原案/学年/版本；未申办 NA，已主张无源 SU",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "原减免有权单位/财务；批准决定、效期、履行状态；C02/C08/C13/C15 **条件必需**；原正式决定电子档及账目，不是上期申请草稿；F033/F044；SRC-002/005；原案/学年/版本；未申办 NA，已主张无源 SU"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M016",
      "name": "某一专项资金独立公告/申报指南",
      "purpose": "专项政策发布机关；项目号、对象、年度、审批权；C06/C07 P0/P3 **条件必需**；经校方核验的正式项目库/公告原件；F014–F017/F026；SRC-009（部分）/002；批次/生效期限；全文未核 PC/SU，不可读 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "专项政策发布机关；项目号、对象、年度、审批权；C06/C07 P0/P3 **条件必需**；经校方核验的正式项目库/公告原件；F014–F017/F026；SRC-009（部分）/002；批次/生效期限；全文未核 PC/SU，不可读 UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M017",
      "name": "被更正或替换的旧材料原件",
      "purpose": "原持有人及本案存档；旧文件、旧 OCR、旧审核引用；C10/P8 **条件必需（存档持有）**；不可被新版覆盖；F002/F037/F038/F043/F052；SRC-004；原案旧版本和替换链；缺 NH，不让学生重新提供学校已收原件",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "原持有人及本案存档；旧文件、旧 OCR、旧审核引用；C10/P8 **条件必需（存档持有）**；不可被新版覆盖；F002/F037/F038/F043/F052；SRC-004；原案旧版本和替换链；缺 NH，不让学生重新提供学校已收原件"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M018",
      "name": "更正后的原件/主管部门核正",
      "purpose": "申请人或原发证机关；更名、学籍、金额等更正证明；C10/P5/P8 **条件必需**；原主管部门已更新的 L2 记录；F003/F004/F028/F043/F052；SRC-004/005；新版 supersedes 旧版；NM/SU/UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "申请人或原发证机关；更名、学籍、金额等更正证明；C10/P5/P8 **条件必需**；原主管部门已更新的 L2 记录；F003/F004/F028/F043/F052；SRC-004/005；新版 supersedes 旧版；NM/SU/UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M019",
      "name": "正式补件通知及项目缺口",
      "purpose": "学院/资助中心经授权经办；清单、通知日期和可证时限；**P5 后续产生**，只在发通知时；可验证学校内部通知；F040/F041；SRC-004（职责，仅非具体期限）；发出部门及版本；未发 WAIT，自造期限 PC",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "学院/资助中心经授权经办；清单、通知日期和可证时限；**P5 后续产生**，只在发通知时；可验证学校内部通知；F040/F041；SRC-004（职责，仅非具体期限）；发出部门及版本；未发 WAIT，自造期限 PC"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M020",
      "name": "补件提交及接收凭据",
      "purpose": "申请人/经授权代办与收件部门；新版证据、收件号；**补件发生后才产生**；经收件确认/可信传输记录；F037/F038/F042；SRC-004；具体 M 槽+旧新版+收件时间；未提交 WAIT，损坏 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "申请人/经授权代办与收件部门；新版证据、收件号；**补件发生后才产生**；经收件确认/可信传输记录；F037/F038/F042；SRC-004；具体 M 槽+旧新版+收件时间；未提交 WAIT，损坏 UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M021",
      "name": "撤回申请书/可信请求",
      "purpose": "本人/授权代理；撤回范围、原因、时间、身份校验；C12 P1/P8 **条件必需**；可验真的校内受理记录；F005/F006/F045；SRC-004（投诉职责，不等于撤回细则）；撤回目标申请或决定义务明确；NM/NH，未提出 NA",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "本人/授权代理；撤回范围、原因、时间、身份校验；C12 P1/P8 **条件必需**；可验真的校内受理记录；F005/F006/F045；SRC-004（投诉职责，不等于撤回细则）；撤回目标申请或决定义务明确；NM/NH，未提出 NA"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M022",
      "name": "异议/复核请求及争点",
      "purpose": "本人/授权代理；目标问题、说明、证据；C13 P8 **条件必需**；经学校受理的电子/书面请求；F046；SRC-004（具体复核规程待查）；目标案/决定号+时点；NM/NH，不可读 UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "本人/授权代理；目标问题、说明、证据；C13 P8 **条件必需**；经学校受理的电子/书面请求；F046；SRC-004（具体复核规程待查）；目标案/决定号+时点；NM/NH，不可读 UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M023",
      "name": "原先正式决定或有权审核意见",
      "purpose": "原决定者；目标文书或可验真回复；已有决定的撤回复核 **条件必需**；学校自身决定库，学生不必重复上传；F044/F046/F049；SRC-004；原版本/效力；若原文不存在 SU，不能伪造否决件",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "原决定者；目标文书或可验真回复；已有决定的撤回复核 **条件必需**；学校自身决定库，学生不必重复上传；F044/F046/F049；SRC-004；原版本/效力；若原文不存在 SU，不能伪造否决件"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M024",
      "name": "学院初审意见/签署记录",
      "purpose": "如当期规定需要，由学院授权人员签发；**P5 后续产生**，是否必经未知；真实校方审批流/纸质档；F019/F037/F053；SRC-003/004 只证学院有参与其他资助；谁签、职务、签章、时间；P1 WAIT，校规无依据 PC",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "如当期规定需要，由学院授权人员签发；**P5 后续产生**，是否必经未知；真实校方审批流/纸质档；F019/F037/F053；SRC-003/004 只证学院有参与其他资助；谁签、职务、签章、时间；P1 WAIT，校规无依据 PC"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M025",
      "name": "财务处学费事实确认函/回写",
      "purpose": "经授权财务人员；费用期间、金额、缓缴/减免核对；**P4 后续核得**，有 M005 可信台账可替代；财务可信接口 M005 替代；F027–F030/F033；SRC-005；财务单位/版本；未返回 SU，不逼学生上传",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "经授权财务人员；费用期间、金额、缓缴/减免核对；**P4 后续核得**，有 M005 可信台账可替代；财务可信接口 M005 替代；F027–F030/F033；SRC-005；财务单位/版本；未返回 SU，不逼学生上传"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M026",
      "name": "学生资助中心审核/推荐意见",
      "purpose": "如当期流程要求，由资助中心授权岗位签发；**P5 后续产生**，是否必经未知；经验证学校流程记录；F019/F037/F053；SRC-004；经办人/岗位/日期；P1 WAIT，不能冒充最终批准",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "如当期流程要求，由资助中心授权岗位签发；**P5 后续产生**，是否必经未知；经验证学校流程记录；F019/F037/F053；SRC-004；经办人/岗位/日期；P1 WAIT，不能冒充最终批准"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M027",
      "name": "具有权限的正式学费减免/专项决定",
      "purpose": "学校或其他依法有权的审批人；有文号/有效签章/额度口径；**P6 后续产生**；可核真实性的正式决定文书；F036/F047–F049；SRC-001/002/004（具体权限未证实）；决定对象、项目、学年、签署版；之前 WAIT，权限未证 NH",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "学校或其他依法有权的审批人；有文号/有效签章/额度口径；**P6 后续产生**；可核真实性的正式决定文书；F036/F047–F049；SRC-001/002/004（具体权限未证实）；决定对象、项目、学年、签署版；之前 WAIT，权限未证 NH"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M028",
      "name": "财务冲抵或学费核销回执",
      "purpose": "财务处授权系统；会计处理和费用项目；**P7 后续产生**；可信财务账务核销记录；F050；SRC-005；学年/科目/决定关联；尚未入账 WAIT，记录失联 SU",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "财务处授权系统；会计处理和费用项目；**P7 后续产生**；可信财务账务核销记录；F050；SRC-005；学年/科目/决定关联；尚未入账 WAIT，记录失联 SU"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M029",
      "name": "退费/实际拨付凭据",
      "purpose": "学校财务/付款渠道；退费或资助款支付记录；**P7 后续产生**，仅确有此执行方式；财务与银行可验记录交叉核对；F051；SRC-005；受款人和支付批次高度敏感；尚未发生 WAIT，不应强制",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "学校财务/付款渠道；退费或资助款支付记录；**P7 后续产生**，仅确有此执行方式；财务与银行可验记录交叉核对；F051；SRC-005；受款人和支付批次高度敏感；尚未发生 WAIT，不应强制"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M030",
      "name": "正式复核/申诉处理决定",
      "purpose": "学校实际有权复核主体；正式复核文书；**P8 后续产生**，在受理后；具权限、目标原决定及日期的可验记录；F047–F049；SRC-004，权限待核；复核目标/版本；未受理 WAIT，无法联系 SU",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "学校实际有权复核主体；正式复核文书；**P8 后续产生**，在受理后；具权限、目标原决定及日期的可验记录；F047–F049；SRC-004，权限待核；复核目标/版本；未受理 WAIT，无法联系 SU"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "decision"
    },
    {
      "id": "M031",
      "name": "外部专项身份或财政项目资格确认",
      "purpose": "特别资助主管机关；如历史专项的原始资格/名单；C06/C07 P3 **条件必需**；可核验原权威名单/由主管部门确认，不能凭扶贫手册外观直接定案；F026；SRC-009；受益人/批次/期间；SU/PC/UNREADABLE",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "特别资助主管机关；如历史专项的原始资格/名单；C06/C07 P3 **条件必需**；可核验原权威名单/由主管部门确认，不能凭扶贫手册外观直接定案；F026；SRC-009；受益人/批次/期间；SU/PC/UNREADABLE"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M032",
      "name": "政策时效及审批权限核验记录",
      "purpose": "校本政策持有人/法定签批管理单位；发布、生效、废止、批次、授权链；P3/P6 条件触发；**机构负责**；已公布正式文书 M004/M016 足以确认则不用另出纸；F016/F017/F047；SRC-002/004/009/012；政策版+主管部门；未知 PC/NH，不能改写旧政策",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "校本政策持有人/法定签批管理单位；发布、生效、废止、批次、授权链；P3/P6 条件触发；**机构负责**；已公布正式文书 M004/M016 足以确认则不用另出纸；F016/F017/F047；SRC-002/004/009/012；政策版+主管部门；未知 PC/NH，不能改写旧政策"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    },
    {
      "id": "M033",
      "name": "逐证据验真、冲突与再审日志",
      "purpose": "可信 Host/Main 与有权核验人员；材料归属、哈希、索引坐标、人工动作；P1–P8 **后续随操作形成**；技术可信事件链/校方签署意见的关联，不属于申请人材料；F002/F018/F037–F040/F052/F053；SRC-004、技术边界；追加式版本；日志失联 SU/NH，不生成伪审批",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 20,
      "requiredElements": [
        "可信 Host/Main 与有权核验人员；材料归属、哈希、索引坐标、人工动作；P1–P8 **后续随操作形成**；技术可信事件链/校方签署意见的关联，不属于申请人材料；F002/F018/F037–F040/F052/F053；SRC-004、技术边界；追加式版本；日志失联 SU/NH，不生成伪审批"
      ],
      "allowReuseAcrossSubjects": false,
      "requiredAt": "submission"
    }
  ],
  "sections": [
    {
      "id": "rules-08-2",
      "name": "独立事实规则（38 项，连续）",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "P0 B 业务属于本决定目的",
          "requirement": "原文核验项：P0 B 业务属于本决定目的。执行摘要：R001 P0 B 业务属于本决定目的 | 比较 F013 主张与有效项目 F015 的决定对象，核是否仅为缓缴、兵役专款或奖助/临时救助；L0+校方项目原文，不按名称相似合并 | SRC-002/005/010/011/017 → F013/F015/F019 → M001/M004/M016 | T=PASS_FACT→资助经办分流；F=NOT_APPLICABLE→对应 G/S/T 主体；U=POLICY_UNCONFIRMED→资助中心确认项目归属。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "P1 D 申请意愿与受益对象明确",
          "requirement": "原文核验项：P1 D 申请意愿与受益对象明确。执行摘要：R002 P1 D 申请意愿与受益对象明确 | 校对 M001 是否包含可读申请人、对象、项目/阶段与请求事实，受理版附 F001/F018；L0 证明申请意愿而非资格 | SRC-001/002 → F001/F003/F007/F018/F020 → M001/M033 | T=PASS_FACT→收件岗；F=NEEDS_MATERIAL→申请人补明确诉求；U=UNREADABLE→收件岗提供可读录入途径。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "P1/P8 D 递交者身份可信",
          "requirement": "原文核验项：P1/P8 D 递交者身份可信。执行摘要：R003 P1/P8 D 递交者身份可信 | Host/Main 重新鉴别登录者并绑定 F005 与提交时刻，不依赖 Renderer 传入 actorId；查可核日志，不能用文件签名代替可信登录 | SRC-004/020 → F005/F018/F053 → M001/M033 | T=PASS_FACT→收件岗；F=CONFLICT→账号持有人/安全审核岗；U=NEEDS_HUMAN_DECISION→受信任身份核验岗，不签批。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "P1/P8 D/P-LOCK 存在代理且具权限",
          "requirement": "原文核验项：P1/P8 D/P-LOCK 存在代理且具权限。执行摘要：R004 P1/P8 D/P-LOCK 存在代理且具权限 | 若 F005≠F003 且主张代办，核 M003 的授权范围、时点和本人对应关系，形式由校本流程确认；L1→有权人工核验 | SRC-004/020 → F003/F005/F006 → M001/M003/M033 | T=PASS_FACT→收件岗；F=无代理请求时 NOT_APPLICABLE，确认为无授权代办则 NEEDS_HUMAN_DECISION→受理岗；U=证据欠缺 NEEDS_MATERIAL→代理/申请人，校规授权形式未知则 POLICY_UNCONFIRMED→归口。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "P2 D 学号、姓名与附件为同一人",
          "requirement": "原文核验项：P2 D 学号、姓名与附件为同一人。执行摘要：R005 P2 D 学号、姓名与附件为同一人 | 以学籍 L2 学号映射核 L0/L1 受益人，核更名记录、证件页及生效日期，不仅比姓名字符串 | SRC-002/004 → F003/F004/F037–F039 → M001/M002/M007–M010/M018 | T=PASS_FACT→学籍事实审查人；F=CONFLICT→学籍部门/原发证方；U=源不在 SOURCE_UNAVAILABLE→学籍部门，附件模糊 UNREADABLE→持有人。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "P2 B/P-LOCK 在校状态与学段可证",
          "requirement": "原文核验项：P2 B/P-LOCK 在校状态与学段可证。执行摘要：R006 P2 B/P-LOCK 在校状态与学段可证 | 查 M002 在申请所属日期的学段、学籍、学院、校区、培养形式；只核事实，不独断其政策资格 | SRC-002/008/017/019 → F008–F012 → M002 | T=PASS_FACT→资助中心；F=学籍有权记录明确不符 CONFLICT→学籍主管确认；U=SOURCE_UNAVAILABLE→学籍主管，不写“已退学”。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "P0/P3 P-LOCK 有正式项目/资金批次",
          "requirement": "原文核验项：P0/P3 P-LOCK 有正式项目/资金批次。执行摘要：R007 P0/P3 P-LOCK 有正式项目/资金批次 | 比对 M004/M016 原件的发布机关、项目编号、资金用途、对象和当期批次；不存在可证公告不能由模板名创造项目 | SRC-002/009/012/017 → F013–F016 → M004/M016/M032 | T=PASS_FACT（仅项目存在）→政策负责人；F=明确其他决定目的 NOT_APPLICABLE→相邻业务；U=POLICY_UNCONFIRMED→学校发布单位取原文。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "P3/P6 P-LOCK 政策版本与时效有效",
          "requirement": "原文核验项：P3/P6 P-LOCK 政策版本与时效有效。执行摘要：R008 P3/P6 P-LOCK 政策版本与时效有效 | 核政策原文、发布/生效/废止、更正公告、费用期和受理时点；2024 新生说明、2025 特资、外校资料无当期代用效力 | SRC-001/002/003/009/012/014 → F014/F016–F018 → M004/M016/M032 | T=PASS_FACT（仅确认适用版本）→政策审核岗；F=有权机关明确废止或不适用 NEEDS_HUMAN_DECISION→政策岗说明；U=POLICY_UNCONFIRMED→政策岗，原文失联另在 R023 标源失联。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "P3 P-LOCK 学段/校区/培养形式在当期对象内",
          "requirement": "原文核验项：P3 P-LOCK 学段/校区/培养形式在当期对象内。执行摘要：R009 P3 P-LOCK 学段/校区/培养形式在当期对象内 | 在 M004/M016 的现行适用条款查 F008/F011/F012，不把本科概述的沉默当研究生排除 | SRC-002/003/017/019 → F008/F011/F012/F017 → M002/M004/M016 | T=PASS_FACT（事实匹配）→资助岗；F=有明确现行排除条款 NEEDS_HUMAN_DECISION→有权审核岗确认适用；U=POLICY_UNCONFIRMED→本科/研究生相应归口。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "P1/P3 P-LOCK 申请时点落在真实窗口",
          "requirement": "原文核验项：P1/P3 P-LOCK 申请时点落在真实窗口。执行摘要：R010 P1/P3 P-LOCK 申请时点落在真实窗口 | 仅当公告明列收件开始/截止、时区和例外时，用可信 F018 比 F017；缓缴/兵役日期禁止挪用 | SRC-002/005/009/010/017 → F014/F017/F018 → M001/M004/M016/M033 | T=PASS_FACT→受理岗；F=明确越窗 NEEDS_HUMAN_DECISION→有权受理岗核例外，不自动拒绝；U=POLICY_UNCONFIRMED→政策负责人。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "P3 P-LOCK 当期项目要求困难认定",
          "requirement": "原文核验项：P3 P-LOCK 当期项目要求困难认定。执行摘要：R011 P3 P-LOCK 当期项目要求困难认定 | 先从校规判 M006 是否为条件，再引用 S03-T06 实际决定、等级/有效学年；需要而无源须由原决定主体核查 | SRC-002/004/006–008/019 → F020–F022 → M004/M006/M013 | T=要求且有效 PASS_FACT→资助岗；F=项目无此要求 NOT_APPLICABLE→下一项；U=要求未知 POLICY_UNCONFIRMED→政策岗，权威结果失联 SOURCE_UNAVAILABLE→S03-T06。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "P3 P-LOCK 特定政策身份被主张且有当期依据",
          "requirement": "原文核验项：P3 P-LOCK 特定政策身份被主张且有当期依据。执行摘要：R012 P3 P-LOCK 特定政策身份被主张且有当期依据 | 对孤儿/烈士子女/优抚/其他身份分别用 M007/M008/M009/M010，核项目是否列该身份；不因 2024 示例自动设硬门槛 | SRC-002/003 → F020/F023/F024 → M001/M004/M007–M010 | T=身份项目明确且证据可核 PASS_FACT→身份核验岗；F=未主张或项目不要求 NOT_APPLICABLE→下项；U=材料缺 NEEDS_MATERIAL→申请人，政策是否接受 POLICY_UNCONFIRMED→政策岗。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "P3 D/P-LOCK 身份证明出具方、人与有效期一致",
          "requirement": "原文核验项：P3 D/P-LOCK 身份证明出具方、人与有效期一致。执行摘要：R013 P3 D/P-LOCK 身份证明出具方、人与有效期一致 | 逐 M007–M010 核签发机关、当事人、亲属链、页码和更正/失效记录；OCR 只是 L1，不能创设身份 | SRC-003/020 → F003/F004/F023–F025/F038 → M007/M008/M009/M010/M018/M033 | T=PASS_FACT（凭证可证）→原身份主管；F=可信同效证据相反 CONFLICT→出证机关；U=图像不清 UNREADABLE→持有人，验真源无法访问 SOURCE_UNAVAILABLE→出证机关。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "P3 P-LOCK 历史特殊资金项目批次及入学范围匹配",
          "requirement": "原文核验项：P3 P-LOCK 历史特殊资金项目批次及入学范围匹配。执行摘要：R014 P3 P-LOCK 历史特殊资金项目批次及入学范围匹配 | 仅在 C06 项目确归本 ID 后核 2016–2020 等公告所限批次、来源政府名单及实际申报窗口；先辨明省级财政专项和受助名单签发权，不外推旧金额 | SRC-009/021 → F012/F014/F017/F026 → M002/M014/M016/M031 | T=真实原公告、资格与时点均核实 PASS_FACT（仅事实）→专项主管；F=明确不属该历史专项 NOT_APPLICABLE→其他合适项目；U=POLICY_UNCONFIRMED→取得专项全文和主管权限，名单失联另记 R023。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "P4 B 学费账主体、项目、学年可定位",
          "requirement": "原文核验项：P4 B 学费账主体、项目、学年可定位。执行摘要：R015 P4 B 学费账主体、项目、学年可定位 | 从财务 L2 明确学费科目而非住宿费/医保；一人×学年×科目；同名截图不能改账 | SRC-005/013 → F027/F028/F029/F030 → M005/M025 | T=PASS_FACT→财务核对岗；F=费用归属相冲 CONFLICT→财务；U=SOURCE_UNAVAILABLE→财务，截图不清走 R022。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "P4 D/P-LOCK 学生申报金额与学费权威事实可解释",
          "requirement": "原文核验项：P4 D/P-LOCK 学生申报金额与学费权威事实可解释。执行摘要：R016 P4 D/P-LOCK 学生申报金额与学费权威事实可解释 | 对比 F035 的“请求”与 F028/F029 L2 数字，允许合理差异说明；F036 不得从请求金额生成 | SRC-002/005 → F027–F029/F035/F036 → M001/M005/M025 | T=口径清楚 PASS_FACT（不计算减免）→财务；F=两份权威同期间数额冲突 CONFLICT→财务；U=SOURCE_UNAVAILABLE→财务，额度政策未知另进 R029。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "P4 B 缓缴与减免分别记账",
          "requirement": "原文核验项：P4 B 缓缴与减免分别记账。执行摘要：R017 P4 B 缓缴与减免分别记账 | 查 M005 的缓缴、应缴、已减免项目，确认仅延期并未免除时不改写收费主账 | SRC-003/005 → F027–F030/F033 → M005/M025 | T=确有缓缴 PASS_FACT（仅缓缴事实）→财务；F=未缓缴 NOT_APPLICABLE→正常账；U=SOURCE_UNAVAILABLE→财务。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "P4 D 学费贷款记录与本案相交",
          "requirement": "原文核验项：P4 D 学费贷款记录与本案相交。执行摘要：R018 P4 D 学费贷款记录与本案相交 | 将原 S03-T08/银行 L2 决定按人、年度、费用用途、状态比对；贷款不是资助减免批准 | SRC-002/013/017 → F027/F031/F034 → M005/M012 | T=交叉存在 PASS_FACT（仅发现事实）→贷款归口与财务；F=已证实无交叉 NOT_APPLICABLE→下项；U=SOURCE_UNAVAILABLE→原贷款持有人。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "P4 D 奖助/临时救助与本案重叠",
          "requirement": "原文核验项：P4 D 奖助/临时救助与本案重叠。执行摘要：R019 P4 D 奖助/临时救助与本案重叠 | 原 S03-T07/T10 或其他 L3 决定必须同人、期间、资金用途、状态对照；项目记录没有不能自造冲突 | SRC-002/011/018 → F027/F032/F034 → M005/M011 | T=存在关联 PASS_FACT（仅记录重叠）→原项目和资助中心；F=可信查无重叠 NOT_APPLICABLE→下项；U=SOURCE_UNAVAILABLE→原项目持有人。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "P4 D 既有学费减免在同一学年/费用项生效",
          "requirement": "原文核验项：P4 D 既有学费减免在同一学年/费用项生效。执行摘要：R020 P4 D 既有学费减免在同一学年/费用项生效 | 校验 M015 真正 L3 决定及财务执行，不把上一年度申请/预审当生效决定 | SRC-002/005/010 → F027/F033/F044 → M005/M015/M023 | T=有生效历史 PASS_FACT（只为交叉核账）→财务；F=原官方撤销/不同期间 NOT_APPLICABLE→下项；U=SOURCE_UNAVAILABLE→原批准单位。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "P4/P6 P-LOCK 是否有可证互斥/限额的现行规则",
          "requirement": "原文核验项：P4/P6 P-LOCK 是否有可证互斥/限额的现行规则。执行摘要：R021 P4/P6 P-LOCK 是否有可证互斥/限额的现行规则 | 当 R018–R020 有交叉时，比对同人同科目同期间且读取该专项最新互斥条款；不得预设所有资助不能并存 | SRC-002/009/010/013/018 → F027/F031–F034/F036 → M004/M005/M011/M012/M015/M016/M032 | T=确有适用互斥条款及完整事实 NEEDS_HUMAN_DECISION→有权决定者量化处理；F=经核仅不同目的 PASS_FACT（非批准）→资助岗；U=POLICY_UNCONFIRMED→政策岗，来源失联由对应 R 记录。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "P1–P8 D 证据本体可读可定位",
          "requirement": "原文核验项：P1–P8 D 证据本体可读可定位。执行摘要：R022 P1–P8 D 证据本体可读可定位 | 检查真实文件页、表格单元、OCR 坐标、是否截页和多人混编，引用 M033；自动识别置信不足不能填事实 | SRC-020 → F037/F038/F039 → M001/M007–M010/M017/M018/M020/M022/M023/M033 | T=可读 PASS_FACT（仅可读）→事实复核人；F=UNREADABLE→材料持有者/扫描岗；U=文件字节未取得 SOURCE_UNAVAILABLE→源持有人。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "P0–P8 D 所需权威来源是否可取得",
          "requirement": "原文核验项：P0–P8 D 所需权威来源是否可取得。执行摘要：R023 P0–P8 D 所需权威来源是否可取得 | 对 L2 学籍/财务/困难决定、校规与授权验证逐个记录可访问状态，区分原件失联与没有当期规则 | SRC-004/005/006/009/012/015/016 → F016/F021/F027/F037/F038/F047 → M002/M004/M005/M006/M011/M012/M016/M025/M031/M032 | T=可取得 PASS_FACT（仅源可用）→事实岗；F=SOURCE_UNAVAILABLE→原持有人联系/人工验真；U=不知是否存在政策源 POLICY_UNCONFIRMED→政策岗。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "P1–P8 D 当前阶段材料槽应出现且未缺",
          "requirement": "原文核验项：P1–P8 D 当前阶段材料槽应出现且未缺。执行摘要：R024 P1–P8 D 当前阶段材料槽应出现且未缺 | 按 07.4 C01–C15 与 P 阶段检查当前需要的 M；M024–M030 未到阶段一律 WAIT，绝不计缺 | SRC-002/004 → F019/F037/F040 → M001–M033 | T=当前必需且缺 NEEDS_MATERIAL→该 M 持有人（机构资料由机构取）；F=当前必需且已到位则 PASS_FACT→事实岗，若条件不触发/未来尚未生成则 NOT_APPLICABLE（内部 WAIT）；U=需不需要由校规决定 POLICY_UNCONFIRMED→政策岗。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "P5/P8 D 旧材料被有来源的新版本合法替换",
          "requirement": "原文核验项：P5/P8 D 旧材料被有来源的新版本合法替换。执行摘要：R025 P5/P8 D 旧材料被有来源的新版本合法替换 | 以 M017/M018 的 supersedes、主体、范围和哈希核 F052 依赖图；旧 PASS_FACT 失效，只重审受影响 R；L3 旧决定不自动撤销 | SRC-004/020 → F002/F037–F039/F043/F052/F053 → M017/M018/M033 | T=替换链成立 NEEDS_HUMAN_DECISION（待定向重审）→原事实岗；F=仅新增无替换 NOT_APPLICABLE→保留旧评价；U=链不明 CONFLICT→证据管理岗。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "P5 D/P-LOCK 合法补件通知及对应回执",
          "requirement": "原文核验项：P5 D/P-LOCK 合法补件通知及对应回执。执行摘要：R026 P5 D/P-LOCK 合法补件通知及对应回执 | 经授权人员生成 M019 才有 F041，申请人回复才有 M020；期限只能来自有效文书，重新收件要绑定 M 槽与版本 | SRC-004/020 → F018/F019/F040–F042 → M019/M020/M033 | T=通知/回复均可核 PASS_FACT→原审核岗；F=尚未发通知/未到补件阶段 NOT_APPLICABLE（内部 WAIT）→不催未来件；U=正式要求已生效、确需申请人提交而未交 NEEDS_MATERIAL→申请人，回执原源失联 SOURCE_UNAVAILABLE→经办岗，期限规则不明 POLICY_UNCONFIRMED→政策岗。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "P5 P-LOCK 真实学院/资助中心初审环节已发生",
          "requirement": "原文核验项：P5 P-LOCK 真实学院/资助中心初审环节已发生。执行摘要：R027 P5 P-LOCK 真实学院/资助中心初审环节已发生 | 仅当校本规定有初审/推荐环节才校验 M024/M026 的岗位、意见与时点；二者不是终审 | SRC-003/004 → F010/F019/F037/F053 → M024/M026/M033 | T=正式中间意见已核 PASS_FACT→下一级经办；F=政策未要求该环节 NOT_APPLICABLE→跳过；U=环节是否必经 POLICY_UNCONFIRMED→政策岗，签署可疑 NEEDS_HUMAN_DECISION→审签管理岗。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "P6/P8 P-LOCK 真实决定/复核人当次被授权",
          "requirement": "原文核验项：P6/P8 P-LOCK 真实决定/复核人当次被授权。执行摘要：R028 P6/P8 P-LOCK 真实决定/复核人当次被授权 | Host/Main 可信会话与当期授权原件核 F047，校方岗位/项目/批次/决定类型逐项绑定；前端角色标签不可信 | SRC-004/020 → F005/F019/F047/F048/F053 → M027/M030/M032/M033 | T=授权有效 PASS_FACT（仅权限）→有权签发人；F=明显越权 NEEDS_HUMAN_DECISION→单位权限管理员阻断；U=POLICY_UNCONFIRMED→提供授权依据，禁止 L3 写入。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "P6 P-LOCK 正式决定真实且金额有来源",
          "requirement": "原文核验项：P6 P-LOCK 正式决定真实且金额有来源。执行摘要：R029 P6 P-LOCK 正式决定真实且金额有来源 | 先确认 R028，再检 M027 正文签章、对象、项目、学年、有效期、F036 金额及当期校本标准与财务核账；签名截图/AI 结果不能代替 L3 | SRC-001/002/004/005 → F014/F016/F027/F028/F036/F044/F047–F049 → M004/M005/M025/M027/M032/M033 | T=真实 L3 已有 PASS_FACT（表明**已核对决定存在**，UI 决定栏单独显示校方原文）→财务；F=只有预审/推荐而无正式决定 NEEDS_HUMAN_DECISION→校方有权决定者；U=签发或额度依据不明 POLICY_UNCONFIRMED→政策/权限岗。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "P7 D 有权财务已对正式决定执行冲抵",
          "requirement": "原文核验项：P7 D 有权财务已对正式决定执行冲抵。执行摘要：R030 P7 D 有权财务已对正式决定执行冲抵 | 必须先有 M027 有效决定，再查 M028 真实账务项目、科目、日期、与 F049 对应；不能从“批准”推断执行 | SRC-005/020 → F027/F036/F049/F050 → M005/M027/M028/M033 | T=入账可证 PASS_FACT（只核执行）→通知归档岗；F=有可信账显示待处理 NEEDS_HUMAN_DECISION→财务待办；U=接口断开 SOURCE_UNAVAILABLE→财务，P6 未完成则 NOT_APPLICABLE。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "P7 D 本项目确需退款/发款并已执行",
          "requirement": "原文核验项：P7 D 本项目确需退款/发款并已执行。执行摘要：R031 P7 D 本项目确需退款/发款并已执行 | 只有 M027 指定退款/拨付方式时核 M029 收款人、支付流水、金额和期间；财务冲抵与现金支付是不同事件 | SRC-005/020 → F036/F049/F050/F051 → M027/M028/M029/M033 | T=款项核实 PASS_FACT（仅执行）→归档经办；F=正式决定不涉及付款 NOT_APPLICABLE→归档；U=应支付但来源不可得 SOURCE_UNAVAILABLE→财务，尚未发生 NEEDS_HUMAN_DECISION→财务催办。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "P8 P-LOCK 正式复核决定真实且指向正确旧决定",
          "requirement": "原文核验项：P8 P-LOCK 正式复核决定真实且指向正确旧决定。执行摘要：R032 P8 P-LOCK 正式复核决定真实且指向正确旧决定 | 校对 M030 对 M023/F044 的对象、争点、权限、版本、效力与新旧决定关系；不可用新 OCR 直接覆写旧 L3 | SRC-004/020 → F003/F044/F046–F049/F053 → M022/M023/M030/M032/M033 | T=复核 L3 可验 PASS_FACT（只核存在）→原决定管理岗/财务按效力后续执行；F=尚无复核正式结论 NEEDS_HUMAN_DECISION→复核岗；U=签署/程序不明 POLICY_UNCONFIRMED→学校正式复核归口。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R033",
          "title": "P1/P8 P-LOCK 撤回请求真实并正确指向原案",
          "requirement": "原文核验项：P1/P8 P-LOCK 撤回请求真实并正确指向原案。执行摘要：R033 P1/P8 P-LOCK 撤回请求真实并正确指向原案 | 校验 M021 提出者 F005/F006、受益人 F003、目标阶段及是否已有 M023；提出请求≠原批准即消灭 | SRC-004/020 → F001/F003/F005/F006/F019/F044/F045 → M003/M021/M023/M033 | T=请求可验 NEEDS_HUMAN_DECISION→有权受理/撤回处理岗；F=从未提出 NOT_APPLICABLE→原流程；U=目标/授权不清 NEEDS_MATERIAL→提出者，处理权限无据 POLICY_UNCONFIRMED→校方。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R034",
          "title": "P8 P-LOCK 复核申请真实且争点关联有效旧案",
          "requirement": "原文核验项：P8 P-LOCK 复核申请真实且争点关联有效旧案。执行摘要：R034 P8 P-LOCK 复核申请真实且争点关联有效旧案 | M022 目标必须是当前申请的真实初审意见/正式决定 M023；期限/渠道由校本法规决定，不从外校或他项借用 | SRC-004/014/020 → F001/F003/F005/F006/F044/F046 → M003/M022/M023/M033 | T=请求要素可核 NEEDS_HUMAN_DECISION→指定复核受理岗；F=未申诉 NOT_APPLICABLE→原流程；U=原决定不可得 SOURCE_UNAVAILABLE→原决定单位，程序未知 POLICY_UNCONFIRMED→政策岗。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R035",
          "title": "P3/P8 P-LOCK 政策修订是否改变本次适用",
          "requirement": "原文核验项：P3/P8 P-LOCK 政策修订是否改变本次适用。执行摘要：R035 P3/P8 P-LOCK 政策修订是否改变本次适用 | 比较旧新 M004/M016、适用日期与是否明示追溯/过渡，规则源更新使所有引用该政策的 R 失效重评，但**不自动撤销既有 L3** | SRC-002/003/009/012/017 → F002/F014/F016–F018/F044/F052 → M004/M016/M017/M032/M033 | T=新旧适用关系可核 NEEDS_HUMAN_DECISION→政策/决定岗确认处理；F=仅不同项目/期间 NOT_APPLICABLE→保留旧政策评估；U=POLICY_UNCONFIRMED→校本政策持有人。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R036",
          "title": "P1–P8 G/D 隐私访问目的及权限合规",
          "requirement": "原文核验项：P1–P8 G/D 隐私访问目的及权限合规。执行摘要：R036 P1–P8 G/D 隐私访问目的及权限合规 | 对家庭状况、孤儿/优抚/贷款/银行账等敏感数据限制用途、角色、可见字段和导出，留操作审计；不把原件散发给非归口人员 | SRC-020 → F003–F007/F020–F026/F031–F034/F037/F053 → M003/M006–M013/M021/M022/M029/M033 | T=目的授权/最小可见可证 PASS_FACT（安全控制）→有权限角色；F=未授权访问 NEEDS_HUMAN_DECISION→安全负责人拒绝访问；U=授权映射不明 POLICY_UNCONFIRMED→数据责任人确认。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R037",
          "title": "P1–P8 D 案卷/Run/证据审计闭环真实",
          "requirement": "原文核验项：P1–P8 D 案卷/Run/证据审计闭环真实。执行摘要：R037 P1–P8 D 案卷/Run/证据审计闭环真实 | 逐件核 caseId、真实 Run id、规则目标、Plan 指纹、M 版本及操作人；未运行记录“未运行”，旧 run@rev 不得充真 Run | SRC-015/016/020 → F001/F002/F018/F019/F037–F040/F052/F053 → M017/M018/M019/M020/M027/M030/M033 | T=审计链完整 PASS_FACT（仅技术记录）→案卷管理岗；F=检测跨案/伪 ID CONFLICT→技术 Owner 修复；U=技术原件无从取 SOURCE_UNAVAILABLE→技术负责人，不向用户伪称可执行。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R038",
          "title": "P0/P3/P6 P-LOCK G50/S/T 复用的是相应权威决定",
          "requirement": "原文核验项：P0/P3/P6 P-LOCK G50/S/T 复用的是相应权威决定。执行摘要：R038 P0/P3/P6 P-LOCK G50/S/T 复用的是相应权威决定 | 对入参核 sourceTemplateId/decisionId/authority/subject/period/version/effectiveState；既有模板只出其本体决定，S03-T11 不二次批准 | SRC-002/004/010/015/016/019 → F003/F013–F017/F021/F031–F034/F044/F049 → M002/M006/M011/M012/M015/M016/M023/M031/M033 | T=原 L2/L3 可验 PASS_FACT（仅复用）→本案事实岗；F=目标不同 NOT_APPLICABLE→相邻 Owner；U=目录/旧决定不可取得 SOURCE_UNAVAILABLE→原 Owner，目录授权边界未知 POLICY_UNCONFIRMED→集成 Owner。政策/权限/期限未知或冲突时必须转人工复核，不得形成正式资格结论。",
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
      "name": "申请登记、身份与范围核验",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "evidence-review",
      "workflowOwner": "local"
    },
    {
      "id": "evidence-review",
      "name": "材料、事实与来源核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "intake",
      "nextStageId": "policy-confirmation",
      "workflowOwner": "local"
    },
    {
      "id": "policy-confirmation",
      "name": "当期政策、适用范围与权限人工确认",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "evidence-review",
      "nextStageId": "final-decision",
      "workflowOwner": "local"
    },
    {
      "id": "final-decision",
      "name": "有权人员人工决定与结果记录",
      "kind": "finalize",
      "executorRole": "teacher",
      "returnToStageId": "evidence-review",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "fact-review-summary",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-list",
      "kind": "supplement-list",
      "audience": "student"
    },
    {
      "id": "human-decision-record",
      "kind": "approval",
      "audience": "teacher"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

/** SRC 为研究来源索引，不是案卷 SourceRef。 */
export const r02Metadata = {
  "templateId": "S03-T11",
  "name": "学费减免与专项经济资助资格审核",
  "version": "1.0",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/S03-T11.md",
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/S03-T11.md",
  "sourceGitBlobSha": "ac48aea097d6dff162200c1324353807a5ae393f",
  "sourceDocumentSha256": "79df5f9fc2d830f3ad87fae77fc036d622deb93ce1237ebeac2ff3598aa92649",
  "sourceManifestBytes": 149986,
  "sourceManifestSha256": "545e3a7dcbd68e7bdd2ab45af1e59e1af28df7ed6bf5348c02e6831c36cf231a",
  "officialSchoolTemplate": false,
  "researchDate": "2026-10-24",
  "policyEvidenceStatus": "PARTIAL",
  "workflowOwner": "local",
  "sourceEvidence": [
    {
      "sourceId": "SRC-001",
      "title": "全国人大制定，教育部公布：《中华人民共和国高等教育法》（2018 修正）",
      "evidenceStatus": "PARTIAL",
      "url": "https://www.moe.gov.cn/jyb_sjzl/sjzl_zcfg/zcfg_jyfl/202204/t20220421_620257.html"
    },
    {
      "sourceId": "SRC-002",
      "title": "成都理工大学学生资助管理科：《国家资助 助你飞翔——成都理工大学2025年本专科学生资助政策简介》",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1032/3429.htm"
    },
    {
      "sourceId": "SRC-003",
      "title": "成都理工大学党委学生工作部（处）：《致2024级家庭经济困难本科生的一封信》",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1046/2208.htm"
    },
    {
      "sourceId": "SRC-004",
      "title": "成都理工大学学生处：《机构设置》",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/bmgk/jgsz.htm"
    },
    {
      "sourceId": "SRC-005",
      "title": "成都理工大学财务处：《成都理工大学在校生2026-2027学年缴费通知》",
      "evidenceStatus": "PARTIAL",
      "url": "https://jcc.cdut.edu.cn/info/1012/2724.htm"
    },
    {
      "sourceId": "SRC-006",
      "title": "成都理工大学学生处资助政策栏目：《成都理工大学家庭经济困难学生认定申请表》",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://xsc.cdut.edu.cn/zzgl/zzzc.htm"
    },
    {
      "sourceId": "SRC-007",
      "title": "成都理工大学学生处：《成都理工大学家庭经济困难学生认定实施办法》",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://xsc.cdut.edu.cn/info/1032/1715.htm"
    },
    {
      "sourceId": "SRC-008",
      "title": "成都理工大学机电工程学院：《关于开展2024-2025学年本科生家庭经济困难学生认定工作的通知》",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://mee.cdut.edu.cn/info/1049/2981.htm"
    },
    {
      "sourceId": "SRC-009",
      "title": "成都理工大学学生处资助政策栏目：《关于2025年秋季学期脱贫户（原建档立卡贫困户）本专科学生特别资助在线补申请有关事项的公告》",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://xsc.cdut.edu.cn/zzgl/zzzc.htm"
    },
    {
      "sourceId": "SRC-010",
      "title": "成都理工大学学生资助管理中心：《关于开展2025-2026学年春季学期服兵役学生国家教育资助申请的通知》",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1046/4052.htm"
    },
    {
      "sourceId": "SRC-011",
      "title": "成都理工大学学生处资助政策栏目：《关于印发〈成都理工大学学生困难补助实施办法〉的通知》（成理校学〔2024〕7号）",
      "evidenceStatus": "UNCONFIRMED",
      "url": "https://xsc.cdut.edu.cn/zzgl/zzzc.htm"
    },
    {
      "sourceId": "SRC-012",
      "title": "成都理工大学信息公开网：《学生奖学金、助学金、学费减免、助学贷款、勤工俭学的申请与管理规定》",
      "evidenceStatus": "PARTIAL",
      "url": "https://dbxb.cdut.edu.cn/xxgkwz/info/1005/1042.htm"
    },
    {
      "sourceId": "SRC-013",
      "title": "财政部等五部门：《学生资助资金管理办法》（财教〔2021〕310号）",
      "evidenceStatus": "PARTIAL",
      "url": "https://jsz.mof.gov.cn/zhengcefagui/202111/P020211122608404296245.pdf"
    },
    {
      "sourceId": "SRC-014",
      "title": "成都大学学生处：《成都大学关于开展2025-2026学年家庭经济困难学生学费减免工作的通知》",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdu.edu.cn/zzzx/info/1002/2237.htm"
    },
    {
      "sourceId": "SRC-015",
      "title": "技术仓库 G50：docs/design/review-agent/acceptance/d4-unified-r01/catalog.json",
      "evidenceStatus": "PARTIAL",
      "url": "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json"
    },
    {
      "sourceId": "SRC-016",
      "title": "R02 原始目录 ST-CANDIDATE-MASTER-CATALOG-R02.md、拆并审计 ST-CATALOG-AUDIT-R02.md、RESEARCH-TO-BUSINESS-MD-PROMPTS-R02.md",
      "evidenceStatus": "PARTIAL"
    },
    {
      "sourceId": "SRC-017",
      "title": "成都理工大学撰稿、中国研究生招生信息网发布：《成都理工大学研究生资助政策简介》",
      "evidenceStatus": "PARTIAL",
      "url": "https://yz.chsi.com.cn/kyzx/yxzc/202507/20250710/2293394566.html"
    },
    {
      "sourceId": "SRC-018",
      "title": "成都理工大学物理学院：《关于做好物理学院2025年本科生国家奖助学金评审工作通知》",
      "evidenceStatus": "PARTIAL",
      "url": "https://cop.cdut.edu.cn/info/1637/5500.htm"
    },
    {
      "sourceId": "SRC-019",
      "title": "成都理工大学学生资助管理中心：《成都理工大学2024-2025学年研究生无固定工资收入拟认定名单及研究生家庭经济困难拟认定名单公示》",
      "evidenceStatus": "PARTIAL",
      "url": "https://xsc.cdut.edu.cn/info/1046/2310.htm"
    },
    {
      "sourceId": "SRC-020",
      "title": "全国人大常委会通过、中央网信办公布：《中华人民共和国个人信息保护法》",
      "evidenceStatus": "PARTIAL",
      "url": "https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm"
    },
    {
      "sourceId": "SRC-021",
      "title": "四川省学生资助管理中心：《关于2023年秋季学期脱贫户（原建档立卡贫困户）本专科和技工院校学生特别资助在线办理有关事项的公告》",
      "evidenceStatus": "PARTIAL",
      "url": "https://www.scxszz.cn/pros_wjdc/s/cms/scxszz/single/2023/09/19/23091914335785511278"
    },
    {
      "sourceId": "SRC-022",
      "title": "教育部等部门：《关于调整完善国家助学贷款有关政策的通知》",
      "evidenceStatus": "PARTIAL",
      "url": "https://www.moe.gov.cn/jyb_xxgk/moe_1777/moe_1779/202411/t20241104_1160686.html"
    },
    {
      "sourceId": "SRC-023",
      "title": "教育部办公厅：《关于切实做好2025年秋季学期高校学生资助工作的通知》",
      "evidenceStatus": "PARTIAL",
      "url": "https://www.moe.gov.cn/srcsite/A05/s7505/202511/t20251118_1420660.html"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules-08-2",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-020"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R029",
      "sourceIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R030",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R031",
      "sourceIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R032",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R033",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R034",
      "sourceIds": [
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R035",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R036",
      "sourceIds": [
        "SRC-020"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R037",
      "sourceIds": [
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R038",
      "sourceIds": [
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ],
  "limitations": [
    "SRC-* 是研究来源索引，不是案卷 SourceRef。",
    "政策/权限/当期批次未知时只转人工复核，不自动批准或拒绝。",
    "保持 draft；共享注册与 Plan/Run 接线由集成 Owner 负责。"
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = S03T11
