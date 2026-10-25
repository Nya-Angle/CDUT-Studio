// Generated from the reviewed R02 research document. This is not a school-issued template.
import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "T06-T05",
  "version": 1,
  "schemaVersion": 2,
  "name": "研究生导师指导工作量与培养职责认定审核",
  "description": "研究生导师指导工作量与培养职责认定审核。本地研究模板 · 非校方正式模板；校本政策证据为部分核实，未知条件只生成事实核验和人工复核建议。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 研究稿用于本地辅助审查，不是校方正式模板、政策版本或授权决定。当前政策证据状态 PARTIAL；不得据此自动批准或拒绝。",
  "objectType": "person",
  "displayName": {
    "template": "研究生导师指导工作量与培养职责认定审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "案卷 ID／string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F001 案卷 ID／string；案卷；P0–P6；Main 唯一 CaseAggregate，关联 M001/M023–M027；内部技术主键；P1；无则阻止建立事实运行；不能用文件名替代"
    },
    {
      "key": "F002",
      "label": "考核年度/批次／string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F002 考核年度/批次／string；考核任务；P0/P6；培养单位当年 M001；SRC-001 第17条只确认年度机制；P1；当期无通知则 PU，不能自设日历年度规则"
    },
    {
      "key": "F003",
      "label": "统计起止／date-range",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F003 统计起止／date-range；考核任务；P0/P1/P6；M001 或现行 M020 规定的截止口径；P1；PU；不可把入学日期或上传日充当期间"
    },
    {
      "key": "F004",
      "label": "操作者可信 ID／string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F004 操作者可信 ID／string；提交/更正行为；P0/P2/P6；Main 认证会话 + M002，可与 F008 人员记录核对；P2；无身份禁止代办和签署；CO 待人工"
    },
    {
      "key": "F005",
      "label": "操作者角色与委托关系／enum+ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F005 操作者角色与委托关系／enum+ref；权限；P0/P2/P6；Main ACL、M002 受权链；学校委托制度待核；P2；权限未证为 HD；不可取 Renderer role"
    },
    {
      "key": "F006",
      "label": "招生学科所属培养单位 ID／string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F006 招生学科所属培养单位 ID／string；考核归口；P0–P4；校方组织/学位点配置 M004；SRC-001 第17条；P1；SU/CO；跨学院禁止静默任选"
    },
    {
      "key": "F007",
      "label": "学科/专业学位类别 ID／string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F007 学科/专业学位类别 ID／string；考核归口；P0/P1；校方招生学科/导师岗位记录 M003/M004；SRC-001 第10、17条；P1；CO，禁止仅凭材料中的院系名猜归口"
    },
    {
      "key": "F008",
      "label": "导师人员唯一 ID／string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F008 导师人员唯一 ID／string；导师；P1–P6；校内人员/导师岗位权威记录 M003；SRC-001；P2；NM/SU；同姓名不能替代"
    },
    {
      "key": "F009",
      "label": "导师姓名及历史别名／string[]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F009 导师姓名及历史别名／string[]；导师；P1/P2；M003 与实名权限 M002 比对；P2；身份不一致 CO，不以 OCR 姓名覆盖工号"
    },
    {
      "key": "F010",
      "label": "导师类别／enum",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F010 导师类别／enum；导师；P1/P2；博导、硕导、行业导师及团队角色 M003/M014；SRC-001 第2、8、19条；P1；PU/CO，不默认“行业=校内”"
    },
    {
      "key": "F011",
      "label": "聘任有效时间段／date-range",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F011 聘任有效时间段／date-range；导师岗位；P1；有权任职/聘任 M003/M014；SRC-001 第6–9、15条；P1；SU/CO；时间外不得推定有权指导"
    },
    {
      "key": "F012",
      "label": "岗位状态和生效事件／enum+ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F012 岗位状态和生效事件／enum+ref；导师岗位；P1/P6；T06-T01 权威决定 M003/M028；SRC-001 第15、16条；P2；SU；不得从导师自报“正常”判定"
    },
    {
      "key": "F013",
      "label": "年度招生资格只读引用／ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F013 年度招生资格只读引用／ref；邻接决定；P1/P6（必要时）；T06-T02 有权结果 M028；SRC-001 第10、17条；P1；NA/SU；不作为实际指导的充分条件"
    },
    {
      "key": "F014",
      "label": "研究生学号／string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F014 研究生学号／string；学生；P1/P2/P6；学籍权威记录 M005；SRC-005、SRC-009；P2；NM/SU；同名不能计入"
    },
    {
      "key": "F015",
      "label": "学生姓名／string",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F015 学生姓名／string；学生；P1/P2；学籍权威记录 M005；SRC-005；P2；CO；与学号不符停人工，不泄漏其他学生记录"
    },
    {
      "key": "F016",
      "label": "学位层次／enum",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F016 学位层次／enum；学生；P1；校方学籍主数据 M005；SRC-001 第2条；P2；SU/CO，硕/博不互套"
    },
    {
      "key": "F017",
      "label": "培养类型/项目／enum+ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F017 培养类型/项目／enum+ref；学生；P1/P2；校方培养方案/学籍 M005/M008；SRC-001 第4、19条；P2；SU；全/非全、学术/专业、专项另作口径维度，不能猜"
    },
    {
      "key": "F018",
      "label": "学籍状态有效期间／timeline",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F018 学籍状态有效期间／timeline；学生；P1/P6；学籍系统 M005/M018；SRC-005、SRC-009（具体规则待原文）；P2；SU/CO，不能用班级 Excel 宣布休学失效"
    },
    {
      "key": "F019",
      "label": "导学关系角色／enum",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F019 导学关系角色／enum；导师—学生关系；P1；师生双选/聘任 M006/M014/M015；SRC-001 第18、19条，SRC-010；P2；SU/CO，不假设唯一导师"
    },
    {
      "key": "F020",
      "label": "导学关系开始日／date",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F020 导学关系开始日／date；导学关系；P1/P6；有权关系事件 M006/M016；SRC-001 第18条；P2；SU/CO，不取表单填写日"
    },
    {
      "key": "F021",
      "label": "导学关系终止日／date?",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F021 导学关系终止日／date?；导学关系；P1/P6；有权变更或终止 M006/M016；SRC-001 第18条；P2；未终止可空；发生变更而无日期则 CO"
    },
    {
      "key": "F022",
      "label": "导学关系变更决定引用／ref?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F022 导学关系变更决定引用／ref?；关系变更；P1/P6；校方原始审批 M016；SRC-001 第18条；P2；仅 C/F 情形条件必需；无决定则不得改指导关系"
    },
    {
      "key": "F023",
      "label": "共同指导责任或比例主张／decimal?+ref",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F023 共同指导责任或比例主张／decimal?+ref；指导分工；P1/P2/P6；分工协议/学院口径 M015/M019/M020；SRC-001 第19条；P1；PU/HD；不得默认为均分或全额"
    },
    {
      "key": "F024",
      "label": "个人培养计划引用／ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F024 个人培养计划引用／ref；学生培养；P2；学校培养计划/导师确认 M008；SRC-001 第4条；P2；NM/SU；如已系统验证不再要求扫描件"
    },
    {
      "key": "F025",
      "label": "指导活动类型/日期/位置／record[]",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F025 指导活动类型/日期/位置／record[]；指导事实；P2；经核验活动记录 M009；SRC-001 第4、5条；P2；NM/UNREADABLE；无日志≠未履责，需按院级标准"
    },
    {
      "key": "F026",
      "label": "培养质量档案引用／ref[]",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F026 培养质量档案引用／ref[]；培养质量；P2/P3；学校档案 M010；SRC-001 第15条；P3；SU；不得从舆情/论文列表自行认定违规"
    },
    {
      "key": "F027",
      "label": "导师自评内容与版本／ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F027 导师自评内容与版本／ref；年度评价；P2/P3；导师本人 M007；SRC-001 第17条；P3；NM；正式提交期限取 M001"
    },
    {
      "key": "F028",
      "label": "教学督导评价引用／ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F028 教学督导评价引用／ref；综合评价；P3；有权督导评价 M011；SRC-001 第17条；P3；SU/NM；不要求在 P2 即提供"
    },
    {
      "key": "F029",
      "label": "同行评价引用／ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F029 同行评价引用／ref；综合评价；P3；有权同行评价 M012；SRC-001 第17条；P3；SU/NM；不得由 AI 代写"
    },
    {
      "key": "F030",
      "label": "学生评价引用／ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F030 学生评价引用／ref；综合评价；P3；有权学生评价 M013；SRC-001 第17条；P3；SU/NM；匿名身份与访问权限严格隔离"
    },
    {
      "key": "F031",
      "label": "原始指导人数/期间汇总／number+method",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F031 原始指导人数/期间汇总／number+method；事实统计；P2/P3；F014、F018–F021 衍生，核对 M005/M006/M009；SRC-001；P2；CO/SU；“统计数”无权威时不给通过"
    },
    {
      "key": "F032",
      "label": "工作量折算政策版本／ref?",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F032 工作量折算政策版本／ref?；学院口径；P3/P4/P6；经确认的当期 M020；SRC-001 不提供公式，SRC-007 不适用；P1；PU；无版本绝不自动折算"
    },
    {
      "key": "F033",
      "label": "核算工作量/单位／decimal?+unit",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F033 核算工作量/单位／decimal?+unit；工作量结果候选；P3/P4；F031 × F032 适用口径或有权单位 M021；P1；PU/HD；可空，不可用零代替未知"
    },
    {
      "key": "F034",
      "label": "培养单位年度考核结论／enum+ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F034 培养单位年度考核结论／enum+ref；正式决定；P4 后才产生；M021 有权原件；SRC-001 第17条；P3；HD，不能从 F033/材料齐全推得"
    },
    {
      "key": "F035",
      "label": "决定签发主体、时间、有效性／ref+date",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F035 决定签发主体、时间、有效性／ref+date；决定凭据；P4 后；M021 与可信权限验证；SRC-001 第17条，具体签字岗位待核；P3；SU/HD；签章图片不等于真实授权"
    },
    {
      "key": "F036",
      "label": "备案凭证、时间和版本／ref+date",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F036 备案凭证、时间和版本／ref+date；备案；P5 后才产生；M022；SRC-001 第17条；P3；SU；考核未备案与考核未形成区别标注"
    },
    {
      "key": "F037",
      "label": "被质疑的原结论引用／ref?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F037 被质疑的原结论引用／ref?；异议/追溯；P6；M021/M025；SRC-001 + 院级复核细则待核；P3；NA（无原决定）或 NM（声称有却缺）"
    },
    {
      "key": "F038",
      "label": "更正/撤回/异议理由和证据版本／ref[]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F038 更正/撤回/异议理由和证据版本／ref[]；变更请求；P6；M023–M027及本人的可信提交记录；P3；NM/CO；不得覆盖原始事实"
    },
    {
      "key": "F039",
      "label": "下游业务决定只读引用／ref[]",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F039 下游业务决定只读引用／ref[]；依赖追踪；P5/P6；M028，T06-T02/T06-T03/T05-T08 等有效决定；P2；NA/SU；不跨系统写回"
    },
    {
      "key": "F040",
      "label": "证据来源、定位及版本元组／object",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F040 证据来源、定位及版本元组／object；每个 F/M 都须有；P0–P6；sourceSystem、recordId、version、capturedAt、页/段/附件项、材料哈希、权威校验状态；P2/P3；缺来源则 SU；禁止产生无证据 PASS_FACT"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "年度任务与适用期间；培养单位",
      "purpose": "M001 年度任务与适用期间；培养单位；当年考核通知、院级方案；C@P0，全文尚未取得；有权单位确认的当期任务记录；F002/F003/F006/F032；SRC-001、SRC-004、SRC-010；归属年度+单位+发布版本；无通知 PU/HD，不虚构截止日；扫描不清 UNREADABLE",
      "requiredElements": [
        "当年考核通知、院级方案；C@P0，全文尚未取得",
        "有权单位确认的当期任务记录；F002/F003/F006/F032；SRC-001、SRC-004、SRC-010",
        "归属年度+单位+发布版本；无通知 PU/HD，不虚构截止日；扫描不清 UNREADABLE"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "操作者身份/委托；本人、学校身份管理",
      "purpose": "M002 操作者身份/委托；本人、学校身份管理；可信登录及委托授权事件；C@提交，代办 T；校内统一认证角色、有效委托原件；F004/F005/F008；SRC-001；认证链+委托有效期；缺信任禁止代签；委托图不可读转人工",
      "requiredElements": [
        "可信登录及委托授权事件；C@提交，代办 T",
        "校内统一认证角色、有效委托原件；F004/F005/F008；SRC-001",
        "认证链+委托有效期；缺信任禁止代签；委托图不可读转人工"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "导师岗位与状态；学校导师岗位管理方",
      "purpose": "M003 导师岗位与状态；学校导师岗位管理方；有效任职、聘任、停招/退出记录；C@P1；T06-T01 权威决定引用，不要求导师提供证书扫描件；F007–F013；SRC-001；导师 ID+有效期间+决定版本；无源 SU，冲突 CO",
      "requiredElements": [
        "有效任职、聘任、停招/退出记录；C@P1",
        "T06-T01 权威决定引用，不要求导师提供证书扫描件；F007–F013；SRC-001",
        "导师 ID+有效期间+决定版本；无源 SU，冲突 CO"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "招生学科/培养单位；校方组织管理",
      "purpose": "M004 招生学科/培养单位；校方组织管理；学位点/招生学科归口主记录；C@P0/P1；单位有权签认文件；F006/F007；SRC-001、SRC-006；组织代码+年度；跨学院不一致 CO/HD",
      "requiredElements": [
        "学位点/招生学科归口主记录；C@P0/P1",
        "单位有权签认文件；F006/F007；SRC-001、SRC-006",
        "组织代码+年度；跨学院不一致 CO/HD"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "学生身份与学籍；研究生学籍管理方",
      "purpose": "M005 学生身份与学籍；研究生学籍管理方；有权学籍清单/状态时间轴；C@P1；学位与研究生系统核真导出的签认清单（接口未证可用）；F014–F018；SRC-005、SRC-009；学号+状态生效版本；SU/CO，Excel 个人自传不得替代",
      "requiredElements": [
        "有权学籍清单/状态时间轴；C@P1",
        "学位与研究生系统核真导出的签认清单（接口未证可用）；F014–F018；SRC-005、SRC-009",
        "学号+状态生效版本；SU/CO，Excel 个人自传不得替代"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "导学关系名单；培养单位/学校关系管理",
      "purpose": "M006 导学关系名单；培养单位/学校关系管理；师生互选与主/共同导师关系事件；C@P1；有权主管单位签认的对应表；F008/F014/F019–F021；SRC-001 第18–19条、SRC-010；学号×导师 ID×角色×生效期；缺源 SU，双报 CO",
      "requiredElements": [
        "师生互选与主/共同导师关系事件；C@P1",
        "有权主管单位签认的对应表；F008/F014/F019–F021；SRC-001 第18–19条、SRC-010",
        "学号×导师 ID×角色×生效期；缺源 SU，双报 CO"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "导师自评；导师本人",
      "purpose": "M007 导师自评；导师本人；年度自评或正式指定表单；C@P2（仅当该年度考核启动）；本人校内提交记录；F027；SRC-001 第17条；本人 ID+年度+签署版本；NM/UNREADABLE；表式待 M001 确认",
      "requiredElements": [
        "年度自评或正式指定表单；C@P2（仅当该年度考核启动）",
        "本人校内提交记录；F027；SRC-001 第17条",
        "本人 ID+年度+签署版本；NM/UNREADABLE；表式待 M001 确认"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "个人培养计划；研究生培养系统/导师",
      "purpose": "M008 个人培养计划；研究生培养系统/导师；已确认培养方案/计划引用；T@P2（核对应履职责时）；学校计划审批事件，不强制上传 PDF；F017/F024；SRC-001 第4条；学号×计划版本；缺源 SU/NM，不先推定违规",
      "requiredElements": [
        "已确认培养方案/计划引用；T@P2（核对应履职责时）",
        "学校计划审批事件，不强制上传 PDF；F017/F024；SRC-001 第4条",
        "学号×计划版本；缺源 SU/NM，不先推定违规"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M009",
      "name": "指导活动记录；导师/学生/培养系统",
      "purpose": "M009 指导活动记录；导师/学生/培养系统；会议、计划指导、实践、论文指导日志等；T@P2；学校认可的过程记录与签认材料；F025/F031；SRC-001 第4–5条；学号×导师×日期×材料版本；难辨 UNREADABLE；无强制日志阈值",
      "requiredElements": [
        "会议、计划指导、实践、论文指导日志等；T@P2",
        "学校认可的过程记录与签认材料；F025/F031；SRC-001 第4–5条",
        "学号×导师×日期×材料版本；难辨 UNREADABLE；无强制日志阈值"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "培养质量档案；培养单位/研工部",
      "purpose": "M010 培养质量档案；培养单位/研工部；已生效中期淘汰、论文质量、学术规范等档案；T@P2/P3；学校质量档案结果只读引用；F026；SRC-001 第15条；具体学生/导师/决策版；SU，不从网上传言推断",
      "requiredElements": [
        "已生效中期淘汰、论文质量、学术规范等档案；T@P2/P3",
        "学校质量档案结果只读引用；F026；SRC-001 第15条",
        "具体学生/导师/决策版；SU，不从网上传言推断"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "教学督导评价；授权督导",
      "purpose": "M011 教学督导评价；授权督导；正式评价表或有权评价事件；L@P3；培养单位指定系统评价；F028；SRC-001 第17条；督导身份/期次/表版；未产生时 NOT_YET_CREATED，不当缺件",
      "requiredElements": [
        "正式评价表或有权评价事件；L@P3",
        "培养单位指定系统评价；F028；SRC-001 第17条",
        "督导身份/期次/表版；未产生时 NOT_YET_CREATED，不当缺件"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "同行评价；授权同行",
      "purpose": "M012 同行评价；授权同行；评价意见或院内综合评价记录；L@P3；有权同行评价系统记录；F029；SRC-001 第17条；评价人权限/期次/版；未产生待评，未知则 SU",
      "requiredElements": [
        "评价意见或院内综合评价记录；L@P3",
        "有权同行评价系统记录；F029；SRC-001 第17条",
        "评价人权限/期次/版；未产生待评，未知则 SU"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "研究生评价；授权学生评价渠道",
      "purpose": "M013 研究生评价；授权学生评价渠道；匿名或实名合法评价聚合；L@P3；培养单位认可的评价记录，不要求导师自行收集学生评价；F030；SRC-001 第17条；学生隐私 P3+评价渠道版；来源不可达 SU；禁止公开学生身份",
      "requiredElements": [
        "匿名或实名合法评价聚合；L@P3",
        "培养单位认可的评价记录，不要求导师自行收集学生评价；F030；SRC-001 第17条",
        "学生隐私 P3+评价渠道版；来源不可达 SU；禁止公开学生身份"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "行业导师聘任；分委会/研工部",
      "purpose": "M014 行业导师聘任；分委会/研工部；审定聘任与备案记录；T@P1（B/行业）；有权分委会原始决定；F010/F011/F019；SRC-001 第8条；行业导师+聘期+学科；无源 SU，不能用名片代替",
      "requiredElements": [
        "审定聘任与备案记录；T@P1（B/行业）",
        "有权分委会原始决定；F010/F011/F019；SRC-001 第8条",
        "行业导师+聘期+学科；无源 SU，不能用名片代替"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "联合指导分工；培养单位/导师组",
      "purpose": "M015 联合指导分工；培养单位/导师组；双导师职责、协作安排/责任分担凭据；T@P1/P2（B/E）；学校认可的导师组安排；F019/F023；SRC-001 第19条、SRC-010；学生×导师组×期间版；无比例规则则 PU，不默认均分",
      "requiredElements": [
        "双导师职责、协作安排/责任分担凭据；T@P1/P2（B/E）",
        "学校认可的导师组安排；F019/F023；SRC-001 第19条、SRC-010",
        "学生×导师组×期间版；无比例规则则 PU，不默认均分"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "师生关系变更决定；培养单位及学校有权机关",
      "purpose": "M016 师生关系变更决定；培养单位及学校有权机关；解除/重定导师的正式申请和批准记录；T@P1（C）；有权关系台账的审批事件；F020–F022；SRC-001 第18条、SRC-009待核；学号×旧新导师×批准/生效日；无生效证据 CO",
      "requiredElements": [
        "解除/重定导师的正式申请和批准记录；T@P1（C）",
        "有权关系台账的审批事件；F020–F022；SRC-001 第18条、SRC-009待核",
        "学号×旧新导师×批准/生效日；无生效证据 CO"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "接续培养交接；原/新导师及培养单位",
      "purpose": "M017 接续培养交接；原/新导师及培养单位；过渡期间学生安排、责任交接；T@变更发生后；有权单位签认的安排记录；F021/F022/F025；SRC-001 第15、18条；原/新导师与学生对象一一关联；未形成标后续，不能先交",
      "requiredElements": [
        "过渡期间学生安排、责任交接；T@变更发生后",
        "有权单位签认的安排记录；F021/F022/F025；SRC-001 第15、18条",
        "原/新导师与学生对象一一关联；未形成标后续，不能先交"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "学籍状态变更；学校学籍管理方",
      "purpose": "M018 学籍状态变更；学校学籍管理方；休/复学、退学、毕业等有权事件；T@P1（F）；校方学籍业务有效决定引用；F018/F020/F021；SRC-005、SRC-009；学号+决定生效日+状态版本；SU/CO",
      "requiredElements": [
        "休/复学、退学、毕业等有权事件；T@P1（F）",
        "校方学籍业务有效决定引用；F018/F020/F021；SRC-005、SRC-009",
        "学号+决定生效日+状态版本；SU/CO"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "跨单位归口确认；相关培养单位",
      "purpose": "M019 跨单位归口确认；相关培养单位；学科归属/跨院共导负责单位的有权文件；T@P1（E/B争议）；各方有权组织共同签认；F006/F007/F019/F023；SRC-001 第17条；单位×学位点×期间；无确认 HD/CO，禁止双算",
      "requiredElements": [
        "学科归属/跨院共导负责单位的有权文件；T@P1（E/B争议）",
        "各方有权组织共同签认；F006/F007/F019/F023；SRC-001 第17条",
        "单位×学位点×期间；无确认 HD/CO，禁止双算"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "工作量政策口径；学校/学院制度主管",
      "purpose": "M020 工作量政策口径；学校/学院制度主管；现行研究生导师折算/分担规则；T@P3/P4（请求量化）；有权机关核真制度正文与适用版本；F002/F003/F023/F032/F033；SRC-001、SRC-004、SRC-010，外校 SRC-012/013 仅为差异比较；机构+版本+施行期；目前未取得，PU；SRC-007、012、013 均不可替代",
      "requiredElements": [
        "现行研究生导师折算/分担规则；T@P3/P4（请求量化）",
        "有权机关核真制度正文与适用版本；F002/F003/F023/F032/F033；SRC-001、SRC-004、SRC-010，外校 SRC-012/013 仅为差异比较",
        "机构+版本+施行期；目前未取得，PU；SRC-007、012、013 均不可替代"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M021",
      "name": "正式年度考核结论；招生学科培养单位",
      "purpose": "M021 正式年度考核结论；招生学科培养单位；有权会议/签发结论原件；L@P4；学校正式决定系统或核真文书；F033–F035/F037；SRC-001 第17条；决定 ID+Actor+时点+证据版；未形成不得列初始缺件",
      "requiredElements": [
        "有权会议/签发结论原件；L@P4",
        "学校正式决定系统或核真文书；F033–F035/F037；SRC-001 第17条",
        "决定 ID+Actor+时点+证据版；未形成不得列初始缺件"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "考核结果备案；研工部/研究生院",
      "purpose": "M022 考核结果备案；研工部/研究生院；接收备案的回执或可核验记录；L@P5；备案登记系统记录；F036；SRC-001 第17条；考核决定 ID+备案版；未形成 NOT_YET_CREATED；来源失联 SU",
      "requiredElements": [
        "接收备案的回执或可核验记录；L@P5",
        "备案登记系统记录；F036；SRC-001 第17条",
        "考核决定 ID+备案版；未形成 NOT_YET_CREATED；来源失联 SU"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "事实补正/错报请求；原提交者",
      "purpose": "M023 事实补正/错报请求；原提交者；更正申请、错误定位与原字段引用；T@P2/P3/P6（G/J）；有权限的系统更正事件；F001/F038/F040；SRC-001（一般归口）；原值/新值/理由/版本关联；NM，不抹除旧版",
      "requiredElements": [
        "更正申请、错误定位与原字段引用；T@P2/P3/P6（G/J）",
        "有权限的系统更正事件；F001/F038/F040；SRC-001（一般归口）",
        "原值/新值/理由/版本关联；NM，不抹除旧版"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "撤回请求；原提交者",
      "purpose": "M024 撤回请求；原提交者；可信撤回意愿与原提交引用；T@P2/P3/P6（H）；已授权渠道的撤回请求，受理规则未核；F004/F005/F038；SRC-001（不规定撤回）；身份/请求时间/阶段；无规则 HD，不能显示正式撤回成功",
      "requiredElements": [
        "可信撤回意愿与原提交引用；T@P2/P3/P6（H）",
        "已授权渠道的撤回请求，受理规则未核；F004/F005/F038；SRC-001（不规定撤回）",
        "身份/请求时间/阶段；无规则 HD，不能显示正式撤回成功"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "异议申请；被考核导师",
      "purpose": "M025 异议申请；被考核导师；原结论、争点及本人授权主张；T@P6（I）；学校规定的异议渠道待核；F034/F037/F038；SRC-001、SRC-003（旧细则时效待核）；原决定 ID+争点；制度失效 PU/HD",
      "requiredElements": [
        "原结论、争点及本人授权主张；T@P6（I）",
        "学校规定的异议渠道待核；F034/F037/F038；SRC-001、SRC-003（旧细则时效待核）",
        "原决定 ID+争点；制度失效 PU/HD"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "新的证据版本；原持有人/学校权威系统",
      "purpose": "M026 新的证据版本；原持有人/学校权威系统；补件、追补记录或更新的有权记录；T@P2/P6（G/I/J）；同权责源的新版本/人工核真原件；F024–F031/F038/F040；相关原 SRC；不覆盖旧文件；缺失 NM、不可读 UNREADABLE、源不可达 SU",
      "requiredElements": [
        "补件、追补记录或更新的有权记录；T@P2/P6（G/I/J）",
        "同权责源的新版本/人工核真原件；F024–F031/F038/F040；相关原 SRC",
        "不覆盖旧文件；缺失 NM、不可读 UNREADABLE、源不可达 SU"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "正式复核/更正决定；有权复核单位待核",
      "purpose": "M027 正式复核/更正决定；有权复核单位待核；对原 M021 的复核或更正决定；L@P6；原有权程序或核验授权的上级决定；F034–F038；SRC-001（授权细节未给出）；新旧决定并存及生效日；未形成不要求上传；无权限 HD",
      "requiredElements": [
        "对原 M021 的复核或更正决定；L@P6",
        "原有权程序或核验授权的上级决定；F034–F038；SRC-001（授权细节未给出）",
        "新旧决定并存及生效日；未形成不要求上传；无权限 HD"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "邻接有效决定；T06/S/T 有权机构",
      "purpose": "M028 邻接有效决定；T06/S/T 有权机构；任职/停招/年度招生资格、下游业务决定引用；T@P1/P5/P6；T06-T01/T06-T02/T06-T03、S 学籍/学位、T05-T08 等有权原决定；F012/F013/F039；SRC-001、SRC-005；只读决定 ID+签发者+生效期+版本+所属人员；无源 SU、不可读 UNREADABLE，不在本模板代签",
      "requiredElements": [
        "任职/停招/年度招生资格、下游业务决定引用；T@P1/P5/P6",
        "T06-T01/T06-T02/T06-T03、S 学籍/学位、T05-T08 等有权原决定；F012/F013/F039；SRC-001、SRC-005",
        "只读决定 ID+签发者+生效期+版本+所属人员；无源 SU、不可读 UNREADABLE，不在本模板代签"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules-08-2",
      "name": "8.2 R001–R013：任务、身份、关系与分工",
      "description": "依据 T06-T05 原件第 08 节规则表；属于本地研究审查项，不等同学校正式政策规则。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "年度任务与期间",
          "requirement": "R001 年度任务与期间；P0；T：有当年培养单位考核任务；F：确认当期未启动；U：无当期通知；SRC-001第17条、SRC-004、SRC-010；F001–F003/F006/F040；M001；核原任务发布机关、年度、起止与版本；2024/2025 报告不能确定 2026 截止；不凭系统日期制造年度窗口；T 且权威完整 PASS_FACT；F NOT_APPLICABLE；U POLICY_UNCONFIRMED，公文失联 SOURCE_UNAVAILABLE，申请表错期 CONFLICT；培养单位考核组织者",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "可信提交/代办主体",
          "requirement": "R002 可信提交/代办主体；P0/P2/P6；T：存在用户提交、撤回、更正或异议动作；F：仅校方定期后台生成任务；U：提交者/代理权限不明；SRC-001第17条；F004/F005/F008/F040；M002；用 Main 会话身份与导师 ID、真实 ACL、委托有效期核验；Renderer 身份字段和签章图片不采信；代办有无学校依据待确认；T 鉴权充分仅 PASS_FACT（提交者身份）；F NOT_APPLICABLE 于无个人操作；U NEEDS_HUMAN_DECISION，身份源失联 SOURCE_UNAVAILABLE，伪造冲突 CONFLICT；Main 权限管理员/培养单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "导师唯一身份",
          "requirement": "R003 导师唯一身份；P1；T：需核某位导师的履职；F：无导师目标且任务不成立；U：ID 或姓名来源矛盾；SRC-001第2、6–9条；F008–F010/F040；M002/M003/M014；校方人员唯一 ID 与有权导师岗位/聘任表对照；姓名只作辅助；同名、曾用名不得自动并案；行业导师以聘任原记录核；匹配 PASS_FACT；F NEEDS_MATERIAL（补有效对象主键）；U CONFLICT，权威库失联 SOURCE_UNAVAILABLE，扫描无法辨读 UNREADABLE；导师岗位管理人员",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "任职与状态的期间有效性",
          "requirement": "R004 任职与状态的期间有效性；P1/P6；T：某段指导事实落入本案统计期；F：该段确在统计期外；U：聘任/停招/退出事件缺失；SRC-001第6–10、15–16、20条；F011–F013/F019–F021/F040；M003/M014/M028；校方聘任、培训上岗状态与 T06-T01/T06-T02 权威生效事件分开读；停招不自动抹去旧生指导；行业协议到期需核日期；本规则不作任职/停招处分；期间与身份事实 PASS_FACT；F NOT_APPLICABLE 于区间外片段；U SOURCE_UNAVAILABLE/CONFLICT，跨状态解释 NEEDS_HUMAN_DECISION；导师岗位有权机构、培养单位",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "考核归口机构",
          "requirement": "R005 考核归口机构；P0/P1/P4；T：已匹配导师招生学科所属培养单位；F：无本校对应学位点；U：跨院、跨学科归口不明；SRC-001第10、17条；F006/F007/F008/F040；M003/M004/M019；校方组织/招生学科年度有效台账与导师岗位关系比对；非招生所在工作部门不能天然替代考核组织；匹配 PASS_FACT；F NOT_APPLICABLE（非本校本事项）；U CONFLICT 或 SOURCE_UNAVAILABLE；归口裁量 NEEDS_HUMAN_DECISION；招生学科所属培养单位/研究生院解释",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R006",
          "title": "研究生身份与学段",
          "requirement": "R006 研究生身份与学段；P1；T：导师主张某个具体学生；F：无具体学生且只审非学生类履职事项；U：学生唯一标识不明；SRC-001第2、4条；SRC-005、009；F014–F017/F040；M005/M006；有权学籍学号、姓名、硕/博及培养类别同一记录交叉验证；OCR 姓名和自报 Excel 均属从证；避免跨学段套标准；有来源且一致 PASS_FACT；F NOT_APPLICABLE 于非逐生评价；U NEEDS_MATERIAL（声明缺学号）或 SOURCE_UNAVAILABLE（校方记录），相反信息 CONFLICT、不可读 UNREADABLE；学籍管理人员",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "学籍状态时间轴",
          "requirement": "R007 学籍状态时间轴；P1/P6；T：该生统计期内在校或有学籍变动；F：相关子期间经权威记录证实在核算范围外；U：状态事件或生效日未明；SRC-005、009；SRC-001第4条；F003/F014/F018/F040；M005/M018；学籍管理方有效事件、时间区间与 F003 交集；是否休学期间计量需另取 M020，不能由此判断指导工作量为零；学籍事实 PASS_FACT；F NOT_APPLICABLE 于被证实不相关区间；U SOURCE_UNAVAILABLE/CONFLICT；学籍校规影响计算 POLICY_UNCONFIRMED；研究生学籍有权单位",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "导学关系存在及角色",
          "requirement": "R008 导学关系存在及角色；P1；T：逐生、逐导师主张了指导关系；F：有权台账证实该关系不存在；U：师生关系主记录不可得或角色缺失；SRC-001第18–19条、SRC-010（院级实例）；F008/F014/F019–F021/F040；M005/M006；依合法导师—学生关系事件核身份、主/共同角色和有效期；多导师可合法共存，单一关系不存在不证明该导师未做过任何活动；T 一致 PASS_FACT；F 若与自报关系抵触则 CONFLICT，若无申报且确认不属该导师则 NOT_APPLICABLE；U SOURCE_UNAVAILABLE/CONFLICT；培养单位导学关系管理员",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "变更/解除/接续",
          "requirement": "R009 变更/解除/接续；P1/P6；T：统计期有导师变更事件；F：权威记录证实无变更；U：新旧导师填报冲突而缺正式事件；SRC-001第18条、SRC-009（未获原文）；F020–F022/F025/F040；M006/M016/M017；比较变更申请、学校实际批准、生效日和交接后记录；只引用 S/校方关系有权决定；先后片段不许双填为全年；交接 M017 不能申请一开始就要求；T 事件及日期可核 PASS_FACT；F NOT_APPLICABLE；U CONFLICT/SOURCE_UNAVAILABLE，审批规则未证 POLICY_UNCONFIRMED；导学关系有权单位、原/新导师",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "行业导师聘期与授权",
          "requirement": "R010 行业导师聘期与授权；P1；T：F010/F019 为行业导师；F：确认仅校内导师；U：聘任主体/合同效期未知；SRC-001第8、15条；F010/F011/F019/F040；M003/M014；核分委会审定聘任、备案及合同到期；行业导师名片或个人简历不等价；非行业情形不得索其聘任；T 核真 PASS_FACT；F NOT_APPLICABLE；U SOURCE_UNAVAILABLE，合同不可读 UNREADABLE，聘期矛盾 CONFLICT；分委会聘任/备案管理方",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "导师组责任分工",
          "requirement": "R011 导师组责任分工；P1/P2/P3；T：存在共同指导或分摊主张；F：有权关系证实不共导且无人主张分担；U：角色虽多但分工/比例规则不明；SRC-001第19条、SRC-010/011（项目事实）；F019/F023/F032/F040；M006/M015/M020；用同一学生/期间的已签分工与现行学院口径核事实与比例；校内/行业各 100% 未有依据不自动双计；分工事实来源一致 PASS_FACT（不等于比例批准）；F NOT_APPLICABLE；U POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；相抵触 CONFLICT；培养单位/现行口径主管",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "跨学科/跨院归口与不重复归属",
          "requirement": "R012 跨学科/跨院归口与不重复归属；P1/P3；T：相关导师/学生跨单位或两个单位申报同一关系；F：单一归口且无跨院事实；U：无法确认主责单位；SRC-001第10、17、19条；F006/F007/F019/F023/F031/F040；M004/M006/M019；招生学科所在培养单位年度归口与各院相同学生/导师/期间并行记录核对；绝不自行新增跨学院考核权；归口及事实一致 PASS_FACT；F NOT_APPLICABLE；U CONFLICT/SOURCE_UNAVAILABLE，单位协商未果 NEEDS_HUMAN_DECISION；相涉培养单位、研究生院",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R013",
          "title": "培养计划指导证据",
          "requirement": "R013 培养计划指导证据；P2；T：本年度应核具体学生培养计划履职事实；F：该情形无该项核验任务；U：计划审批记录未能确认；SRC-001第4–5条；F014/F024/F040；M008；学校培养计划版本、导师确认和有效期间交叉引用；新入学尚未形成后续计划不得抢先判缺；本规则不批准学生培养计划；具体行为可证 PASS_FACT；F NOT_APPLICABLE；U SOURCE_UNAVAILABLE/NEEDS_MATERIAL，扫描 UNREADABLE；是否达到职责质量标准 NEEDS_HUMAN_DECISION；培养过程管理人员、导师",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-3",
      "name": "8.3 R014–R020：实际履职、评价与计量边界",
      "description": "依据 T06-T05 原件第 08 节规则表；属于本地研究审查项，不等同学校正式政策规则。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "R014",
          "title": "逐次指导活动",
          "requirement": "R014 逐次指导活动；P2/P3；T：导师主张本年度具体指导行为；F：当前核验分项不涉及活动日志；U：活动是否属于核算项未知；SRC-001第4–5、17条、SRC-008；F003/F008/F014/F025/F040；M007/M009；活动时间、学生、导师、地点/成果和可核佐证逐项关联，有效期须与 F003/关系区间交集；没有院级“每月至少 N 次”原文不能判未达标；可证发生 PASS_FACT；F NOT_APPLICABLE；U POLICY_UNCONFIRMED（指标）或 NEEDS_MATERIAL（本应由本人提交的日志），不可读 UNREADABLE、互斥记录 CONFLICT；导师本人/培养单位事实核查员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "培养质量档案引用",
          "requirement": "R015 培养质量档案引用；P2/P3；T：存在有权已成型质量评价/处理记录；F：经主管机构确认该时段无相关记录；U：系统未知或仅有传闻；SRC-001第15、17条；F014/F026/F040；M010/M028；只读取与该导师、学生、期间有关的学校有效质量结论版本；违规、论文不合格、淘汰均由各有权事项决定，不能从舆情自判；引用真实有效 PASS_FACT；F NOT_APPLICABLE；U SOURCE_UNAVAILABLE，档案与身份不符 CONFLICT；是否影响年度等级 NEEDS_HUMAN_DECISION；质量档案有权管理方/培养单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "导师自我评价来源",
          "requirement": "R016 导师自我评价来源；P2/P3；T：进入 SRC-001 第17条年度综合考核自评阶段；F：仅 P0/P1 尚未进入自评；U：2026 表式及具体提交窗口不明；SRC-001第17条、SRC-004/010（实践）；F002/F027/F040；M001/M007；校验本人真实提交、版本、所属年度，陈述与 M005/M006/M009 的可证事实分开；自评不充当独立批准；真且提交身份、范围可核 PASS_FACT（自评存在）；F NOT_APPLICABLE 于前置阶段；U POLICY_UNCONFIRMED 或 NEEDS_MATERIAL，伪造授权 CONFLICT；导师本人/学院考核秘书",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "督导、同行、研究生评价来源",
          "requirement": "R017 督导、同行、研究生评价来源；P3/P4；T：年度综合评价阶段已启动；F：P0–P2 尚未进入 P3；U：评价是否生成/被合法汇集未知；SRC-001第17条；F028–F030/F035/F040；M011/M012/M013/M021；分别验证督导、同行、学生评价所属渠道、对象/年度、权限与完成时点；匿名学生意见仅可由授权平台提供聚合，不让导师主动索匿名材料；不自定权重；三方评价来源可核分别 PASS_FACT；F NOT_APPLICABLE 于前置阶段；U SOURCE_UNAVAILABLE/NEEDS_MATERIAL（本阶段应由组织者汇集），评价实质取舍 NEEDS_HUMAN_DECISION；培养单位考核组织者、授权评价人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "原始指导人数与期间去重",
          "requirement": "R018 原始指导人数与期间去重；P2/P3；T：存在逐生指导人数/期间统计主张；F：当期只核不涉及人数的行为证据；U：时间轴或关系角色不可信；SRC-001第17–19条；F003/F008/F014/F018–F023/F031/F040；M005/M006/M014–M019；以（导师ID、学生ID、关系角色、关系事件及有效区间）汇总可证事实行；姓名、招生名额、毕业学位点总人数不可代人数；跨单位/换导师标记重叠贡献待 R011/R012；原始事实行一致 PASS_FACT；F NOT_APPLICABLE；U SOURCE_UNAVAILABLE/CONFLICT；折算政策未知不影响报告“未经折算原始人数”；培养单位数据管理员",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R019",
          "title": "研究生指导工作量折算",
          "requirement": "R019 研究生指导工作量折算；P3/P4/P6；T：明确申请折算数量、标准学时或费用；F：仅作履职事实预审未申请量化；U：当期适用制度正文缺失；SRC-001第17条（只规定考核）、SRC-004/010（无公式）、SRC-007（本科反例）、SRC-012/013（外校差异，仅排除迁用）；F002/F003/F017/F023/F031–F033/F040；M001/M015/M020/M021；只有经校本政策主管核真的研究生适用版本、年份、单位、分担和例外才可算候选；外校毕业节点、学期学时与自动确认均不可迁用；无标准不把未知写零；真且公式/范围/源均可复算 PASS_FACT（计算候选非批准）；F NOT_APPLICABLE；U POLICY_UNCONFIRMED，争议 CONFLICT；有裁量 NEEDS_HUMAN_DECISION；学院考核/工作量口径主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "相邻授课工作量与指导工作量隔离",
          "requirement": "R020 相邻授课工作量与指导工作量隔离；P3/P5；T：同一活动同时计入导师指导与课程授课/绩效主张；F：不存在交叉计量主张；U：T05-T08 原决定或口径不明；SRC-001第5、17条；F025/F031–F033/F039/F040；M009/M020/M028；两个业务以原活动 ID、期间和校方定额类型对照；课程学时必须引用 T05-T08 有效原决定；不能在 T06-T05 重做课程授课工作量；原始引用不重复 PASS_FACT；F NOT_APPLICABLE；U SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED；重复主张 CONFLICT，是否合并绩效 NEEDS_HUMAN_DECISION；T05-T08 有权核算部门、培养单位",
          "execution": "manual",
          "targetScope": "group"
        }
      ]
    },
    {
      "id": "rules-08-4",
      "name": "8.4 R021–R026：正式结论、备案、修改、撤回与复核",
      "description": "依据 T06-T05 原件第 08 节规则表；属于本地研究审查项，不等同学校正式政策规则。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "R021",
          "title": "年度考核决定的可信签发",
          "requirement": "R021 年度考核决定的可信签发；P4/P6；T：培养单位声称正式结果已形成；F：仍处 P0–P3 无结果；U：签发组织、人员授权/结论效力不明；SRC-001第17条；F006/F008/F034/F035/F040；M002/M004/M021；核考核归口、学校有权签发、结论 ID、签发日、证据版本；校内具体审批岗位/印章制度未取得，不从图片或 Renderer Actor 判真；本规则仅读既有决定；来源及权责真实 PASS_FACT（决定存在且可引用）；F NOT_APPLICABLE 于未到 P4；U NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE；伪造来源 CONFLICT；不能输出“AI 已批准”；培养单位有权考核组织与签发人员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "考核结果报送备案",
          "requirement": "R022 考核结果报送备案；P5；T：R021 已有有效年度考核结论且到备案核验阶段；F：未形成年度考核，故无后置备案；U：备案回执或状态不明；SRC-001第17条；F034–F036/F040；M021/M022；以决定 ID、培养单位、年度、备案接受方与时间比对；备案是后续行为，不等于新审批；旧版备案不可充新版；有权备案来源可核 PASS_FACT；F NOT_APPLICABLE（阶段未到）；U SOURCE_UNAVAILABLE 或 NEEDS_MATERIAL（有权单位应报而尚无），不能自动推断已备案；研工部/研究生院备案经办及培养单位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "材料更正及影响定向重审",
          "requirement": "R023 材料更正及影响定向重审；P2/P3/P6；T：M023/M026 修改某原材料或权威源产生新版本；F：未发生换版；U：被替换对象/新旧关联缺失；SRC-001第15、17–18条（责任边界）；F001/F014/F025/F031/F038/F040；M009/M016/M021–M023/M026；记录旧/新版哈希、归属导师/学生、期间、关联 F 与依赖 R；失效原事实预审并重审受影响 R；已签 M021/M022 不自动撤销；版本关联可核 PASS_FACT（换版受理事实）；F NOT_APPLICABLE；U NEEDS_MATERIAL/CONFLICT；若涉及已签决定 NEEDS_HUMAN_DECISION；原证据持有人、培养单位事实核查员/签发机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "撤回请求真实性及权限",
          "requirement": "R024 撤回请求真实性及权限；P2/P3/P6；T：原提交者申请撤回；F：未申请；U：主体、撤回期限/效力不明；SRC-001第17条（不规定一般撤回权）；F001/F004/F005/F038/F040；M002/M024/M021；认证申请人与原提交链，核材料状态；未提交技术草稿可由本人停止，提交校方后的撤回须校本规定或有权人工受理；已签决定不能通过删除申请撤销；可信请求存在 PASS_FACT（仅请求）；F NOT_APPLICABLE；U POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION，冒用 CONFLICT；不得标“正式撤回成功”；原提交者/培养单位有权受理人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "异议、复核与更正决定的效力",
          "requirement": "R025 异议、复核与更正决定的效力；P6；T：导师对已签 M021 提异议或有权单位启动复核；F：无正式原决定或无人提异议；U：时限、机构、原件真实性不明；SRC-001第17、22条、SRC-003（现行待核）；F004/F005/F034–F038/F040；M002/M021/M025–M027；原决定及版保留，核异议人授权与争点；M027 是复核后产生不能初始必交；有权复核签发与生效事件另验；申诉天数及程序未知不自定；请求存在 PASS_FACT（非复核成功）；F NOT_APPLICABLE；U POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE；新旧决定冲突 CONFLICT；学校认可的复核/原考核机构（待确认）",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "下游招生/岗位/绩效决定只读影响追踪",
          "requirement": "R026 下游招生/岗位/绩效决定只读影响追踪；P5/P6；T：年度结果被 T06-T01/T02/T03、T05-T08、S 或绩效使用，且发生结论变化；F：无下游引用；U：已发决定版本或影响关系不明；SRC-001第10、16–17条；F012/F013/F034/F036/F039/F040；M021/M022/M027/M028；读取各事项有权决定 ID、效力期、所依赖本案结论版；事实更正只发影响提示/转办，不能在本案改招生名额、资格、学籍、授课工作量或财务付款；引用/影响事实可核 PASS_FACT；F NOT_APPLICABLE；U SOURCE_UNAVAILABLE/CONFLICT，是否改原决定 NEEDS_HUMAN_DECISION；相邻 T/S 业务权责机构与培养单位",
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
      "name": "P0 任务触发",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p1"
    },
    {
      "id": "p1",
      "name": "P1 主体/关系锁定",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p2"
    },
    {
      "id": "p2",
      "name": "P2 自评/事实汇集",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p3"
    },
    {
      "id": "p3",
      "name": "P3 评价/事实核对",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p4"
    },
    {
      "id": "p4",
      "name": "P4 人工年度考核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p5"
    },
    {
      "id": "p5",
      "name": "P5 备案/下游引用",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p6"
    },
    {
      "id": "p6",
      "name": "P6 补正/撤回/异议",
      "kind": "handoff",
      "executorRole": "reviewer",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "item-feedback",
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
  "batchId": "T06-A",
  "templateId": "T06-T05",
  "name": "研究生导师指导工作量与培养职责认定审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T06-T05.md",
  "sourceDocumentSha256": "9169cae4aab10a4ec714b8dbe875b064cb7cc89b078db4bed4aaa55f6dbc63f9",
  "sourceDocumentBytes": 138260,
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/T06-T05.md",
  "reviewedDocumentPatchApplied": false,
  "reviewedDocumentPatchSummary": "未做低歧义正文修订；保留原研究稿中的待确认门禁。",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "researchAsOf": "2026-10-23",
  "auditedAt": "2026-10-24",
  "criteria": [
    {
      "sectionId": "rules-08-2",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F001",
        "F002",
        "F003",
        "F006",
        "F040"
      ],
      "materialSlotIds": [
        "M001"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F004",
        "F005",
        "F008",
        "F040"
      ],
      "materialSlotIds": [
        "M002"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F008",
        "F009",
        "F010",
        "F040"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M014"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F011",
        "F012",
        "F013",
        "F019",
        "F020",
        "F021",
        "F040"
      ],
      "materialSlotIds": [
        "M003",
        "M014",
        "M028"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F006",
        "F007",
        "F008",
        "F040"
      ],
      "materialSlotIds": [
        "M003",
        "M004",
        "M019"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F014",
        "F015",
        "F016",
        "F017",
        "F040"
      ],
      "materialSlotIds": [
        "M005",
        "M006"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F003",
        "F014",
        "F018",
        "F040"
      ],
      "materialSlotIds": [
        "M005",
        "M018",
        "M020"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001",
        "SRC-010"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F008",
        "F014",
        "F019",
        "F020",
        "F021",
        "F040"
      ],
      "materialSlotIds": [
        "M005",
        "M006"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F020",
        "F021",
        "F022",
        "F025",
        "F040"
      ],
      "materialSlotIds": [
        "M006",
        "M016",
        "M017"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F010",
        "F011",
        "F019",
        "F040"
      ],
      "materialSlotIds": [
        "M003",
        "M014"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F019",
        "F023",
        "F032",
        "F040"
      ],
      "materialSlotIds": [
        "M006",
        "M015",
        "M020"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F006",
        "F007",
        "F019",
        "F023",
        "F031",
        "F040"
      ],
      "materialSlotIds": [
        "M004",
        "M006",
        "M019"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F014",
        "F024",
        "F040"
      ],
      "materialSlotIds": [
        "M008"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F003",
        "F008",
        "F014",
        "F025",
        "F040"
      ],
      "materialSlotIds": [
        "M007",
        "M009"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F014",
        "F026",
        "F040"
      ],
      "materialSlotIds": [
        "M010",
        "M028"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002",
        "F027",
        "F040"
      ],
      "materialSlotIds": [
        "M001",
        "M005",
        "M006",
        "M007",
        "M009"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F028",
        "F029",
        "F030",
        "F035",
        "F040"
      ],
      "materialSlotIds": [
        "M011",
        "M012",
        "M013",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R018",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F003",
        "F008",
        "F014",
        "F018",
        "F019",
        "F020",
        "F021",
        "F022",
        "F023",
        "F031",
        "F040"
      ],
      "materialSlotIds": [
        "M005",
        "M006",
        "M014",
        "M015",
        "M016",
        "M017",
        "M018",
        "M019"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-007",
        "SRC-010",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002",
        "F003",
        "F017",
        "F023",
        "F031",
        "F032",
        "F033",
        "F040"
      ],
      "materialSlotIds": [
        "M001",
        "M015",
        "M020",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F025",
        "F031",
        "F032",
        "F033",
        "F039",
        "F040"
      ],
      "materialSlotIds": [
        "M009",
        "M020",
        "M028"
      ]
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F006",
        "F008",
        "F034",
        "F035",
        "F040"
      ],
      "materialSlotIds": [
        "M002",
        "M004",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F034",
        "F035",
        "F036",
        "F040"
      ],
      "materialSlotIds": [
        "M021",
        "M022"
      ]
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F001",
        "F014",
        "F025",
        "F031",
        "F038",
        "F040"
      ],
      "materialSlotIds": [
        "M009",
        "M016",
        "M021",
        "M022",
        "M023",
        "M026"
      ]
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F001",
        "F004",
        "F005",
        "F038",
        "F040"
      ],
      "materialSlotIds": [
        "M002",
        "M021",
        "M024"
      ]
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F004",
        "F005",
        "F034",
        "F035",
        "F036",
        "F037",
        "F038",
        "F040"
      ],
      "materialSlotIds": [
        "M002",
        "M021",
        "M025",
        "M026",
        "M027"
      ]
    },
    {
      "sectionId": "rules-08-4",
      "criterionId": "R026",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F012",
        "F013",
        "F034",
        "F036",
        "F039",
        "F040"
      ],
      "materialSlotIds": [
        "M021",
        "M022",
        "M027",
        "M028"
      ]
    }
  ],
  "sources": [
    {
      "id": "SRC-001",
      "status": "CDUT-VERIFIED",
      "title": "成都理工大学、研究生院；[《成都理工大学研究生指导教师岗位管理办法》（成理校研〔2024〕23号）原件](https://energy.cdut.edu.cn/__local/9/AA/99/34CEDDCF9FF86FBE66A5E632631_3B5D2F7C_44101.pdf)（能源学院转载校发原 PDF）；第 2–5 条：对象/职责；第 8、10、15–19、21、22 条：行业导师、年度招生资格、培养质量档案、两级权限、年度考核、导学关系及施行/解释；PDF 第 ",
      "url": "https://energy.cdut.edu.cn/__local/9/AA/99/34CEDDCF9FF86FBE66A5E632631_3B5D2F7C_44101.pdf",
      "scope": "SRC-001 CDUT-VERIFIED；成都理工大学、研究生院；[《成都理工大学研究生指导教师岗位管理办法》（成理校研〔2024〕23号）原件](https://energy.cdut.edu.cn/__local/9/AA/99/34CEDDCF9FF86FBE66A5E632631_3B5D2F7C_44101.pdf)（能源学院转载校发原 PDF）；第 2–5 条：对象/职责；第 8、10、15–19、21、22 条：行业导师、年度招生资格、培养质量档案、两级权限、年度考核、导学关系及施行/解释；PDF 第 1–13 页正文；2024-04-18 印发，自印发日施行；明示废止成理校研〔2021〕19 号，冲突文件以本办法为准；本校博硕研究生导师适用；原文全文已核，未见后续取代公告，需持续查新"
    },
    {
      "id": "SRC-002",
      "status": "CDUT-VERIFIED",
      "title": "成都理工大学校长办公室；[《校长办公会通报》（校长办公会纪要〔2024〕10号）](https://dbxb.cdut.edu.cn/__local/A/20/E9/C7C001E21BDEEC81A8AF688EFE0_F1368739_13A3C.pdf)；第 1 页议题 5、6：审定导师岗位管理办法、研究生学籍管理办法修订",
      "url": "https://dbxb.cdut.edu.cn/__local/A/20/E9/C7C001E21BDEEC81A8AF688EFE0_F1368739_13A3C.pdf",
      "scope": "SRC-002 CDUT-VERIFIED；成都理工大学校长办公室；[《校长办公会通报》（校长办公会纪要〔2024〕10号）](https://dbxb.cdut.edu.cn/__local/A/20/E9/C7C001E21BDEEC81A8AF688EFE0_F1368739_13A3C.pdf)；第 1 页议题 5、6：审定导师岗位管理办法、研究生学籍管理办法修订；2024-04-05 通报，会议于 2024-04-03 举行；不另设生效/废止；只证实校本制度形成过程，非工作量计量规则；正文已核"
    },
    {
      "id": "SRC-003",
      "status": "CURRENTITY-UNKNOWN",
      "title": "成都理工大学传播科学与艺术学院；[《成都理工大学全面落实研究生导师立德树人职责实施细则（试行）》](https://ccsa.cdut.edu.cn/info/1033/4914.htm)；第 5 章第 5–7 条：师德考核、导师岗位履职评价的历史校本要求；官网搜索页可见正文片段",
      "url": "https://ccsa.cdut.edu.cn/info/1033/4914.htm",
      "scope": "SRC-003 CURRENTITY-UNKNOWN；成都理工大学传播科学与艺术学院；[《成都理工大学全面落实研究生导师立德树人职责实施细则（试行）》](https://ccsa.cdut.edu.cn/info/1033/4914.htm)；第 5 章第 5–7 条：师德考核、导师岗位履职评价的历史校本要求；官网搜索页可见正文片段；网页发布 2019-03-04；具体制度批准/生效日未见完整文号；2024 年办法冲突优先，是否仍并行待校方核实；本校导师适用范围线索，不据此设独立处罚/期限"
    },
    {
      "id": "SRC-004",
      "status": "CURRENTITY-UNKNOWN",
      "title": "成都理工大学研究生院所载某学位授权点 [2024 年学位与研究生教育质量报告 PDF](https://gra.cdut.edu.cn/__local/D/69/D5/7104C6BD7D9154AD3388B3A6B70_8DB688D1_F5567D.pdf)（数学科学学院相关段落）；“制度建设”段提及学院修订《研究生指导教师岗位考核办法（试行）》及其他导师制度；未取得所述学院办法正文/条款",
      "url": "https://gra.cdut.edu.cn/__local/D/69/D5/7104C6BD7D9154AD3388B3A6B70_8DB688D1_F5567D.pdf",
      "scope": "SRC-004 CURRENTITY-UNKNOWN；成都理工大学研究生院所载某学位授权点 [2024 年学位与研究生教育质量报告 PDF](https://gra.cdut.edu.cn/__local/D/69/D5/7104C6BD7D9154AD3388B3A6B70_8DB688D1_F5567D.pdf)（数学科学学院相关段落）；“制度建设”段提及学院修订《研究生指导教师岗位考核办法（试行）》及其他导师制度；未取得所述学院办法正文/条款；报告针对 2024 年，公开索引显示约 2025 年发布，精确封面发布日期待核；仅能证实院级口径可能存在，不能把其未公开阈值当作校级共通规则"
    },
    {
      "id": "SRC-005",
      "status": "CDUT-VERIFIED",
      "title": "成都理工大学研究生院；[《2025年秋季学期在校研究生学年注册工作的通知》](https://gra.cdut.edu.cn/info/1011/5345.htm)；“时间流程”第二部分：研究生管理系统“我的学籍/学期注册”、学院学位与研究生系统“学籍管理/学生注册管理”，院级核对及研究生院培养科报送",
      "url": "https://gra.cdut.edu.cn/info/1011/5345.htm",
      "scope": "SRC-005 CDUT-VERIFIED；成都理工大学研究生院；[《2025年秋季学期在校研究生学年注册工作的通知》](https://gra.cdut.edu.cn/info/1011/5345.htm)；“时间流程”第二部分：研究生管理系统“我的学籍/学期注册”、学院学位与研究生系统“学籍管理/学生注册管理”，院级核对及研究生院培养科报送；2025-09-09 通知，适用 2025 秋季注册，过期的批次安排不可用于 2026 年；证明学籍在校系统中存在权威核查链条，不证明导师工作量或完整导师—学生映射字段"
    },
    {
      "id": "SRC-006",
      "status": "CDUT-VERIFIED",
      "title": "成都理工大学环境与土木工程学院；[《研究生管理科》岗位职责](https://cece.cdut.edu.cn/info/1028/9592.htm)；“研究生教务管理”“研究生教学管理”职责，包括研究生学籍注册与信息管理、导师遴选协助；网页对应段落",
      "url": "https://cece.cdut.edu.cn/info/1028/9592.htm",
      "scope": "SRC-006 CDUT-VERIFIED；成都理工大学环境与土木工程学院；[《研究生管理科》岗位职责](https://cece.cdut.edu.cn/info/1028/9592.htm)；“研究生教务管理”“研究生教学管理”职责，包括研究生学籍注册与信息管理、导师遴选协助；网页对应段落；2026-03-05 发布；适用于该学院机构职责实例，不能推广成所有学院有权签发工作量认定；页面已核"
    },
    {
      "id": "SRC-007",
      "status": "CDUT-VERIFIED",
      "title": "成都理工大学环境与土木工程学院；[《环境与土木工程学院优秀本科生导师制实施办法（试行）》（环工学院〔2025〕8号）](https://cece.cdut.edu.cn/__local/E/2B/FC/CA0569CF08EC2649C1670E3E70C_3EA947EB_3E66F.pdf)；第 1 页适用范围，第 2 页第 6 条“优秀本科生导师工作量认定”",
      "url": "https://cece.cdut.edu.cn/__local/E/2B/FC/CA0569CF08EC2649C1670E3E70C_3EA947EB_3E66F.pdf",
      "scope": "SRC-007 CDUT-VERIFIED；成都理工大学环境与土木工程学院；[《环境与土木工程学院优秀本科生导师制实施办法（试行）》（环工学院〔2025〕8号）](https://cece.cdut.edu.cn/__local/E/2B/FC/CA0569CF08EC2649C1670E3E70C_3EA947EB_3E66F.pdf)；第 1 页适用范围，第 2 页第 6 条“优秀本科生导师工作量认定”；文号 2025，具体签发日/施行日期待核；仅适用于该院卓越班等优秀本科生；用于负面路由，严禁把每生每年 4 标准学时移入 T06-T05"
    },
    {
      "id": "SRC-008",
      "status": "GENERAL-RESEARCH",
      "title": "中华人民共和国教育部；[《教育部关于印发〈研究生导师指导行为准则〉的通知》（教研〔2020〕12号）](https://www.moe.gov.cn/srcsite/A22/s7065/202011/t20201111_499442.html)；准则“正确履行指导职责、精心尽力投入指导”等条目；学校 2024 年办法第 1 条亦将其列为依据",
      "url": "https://www.moe.gov.cn/srcsite/A22/s7065/202011/t20201111_499442.html",
      "scope": "SRC-008 GENERAL-RESEARCH；中华人民共和国教育部；[《教育部关于印发〈研究生导师指导行为准则〉的通知》（教研〔2020〕12号）](https://www.moe.gov.cn/srcsite/A22/s7065/202011/t20201111_499442.html)；准则“正确履行指导职责、精心尽力投入指导”等条目；学校 2024 年办法第 1 条亦将其列为依据；2020-11-11 公布；国家层面原始来源，研究生导师普遍适用；无校内学时折算标准；现行性未作国家法规库穷尽查新"
    },
    {
      "id": "SRC-009",
      "status": "CURRENTITY-UNKNOWN",
      "title": "成都理工大学研究生院；《成都理工大学研究生学籍管理办法》（成理校研〔2024〕29号）尚未取得公开原文；可检索的[2025 注册通知引证路径](https://gra.cdut.edu.cn/info/1011/5345.htm)；仅从 SRC-005 证实 2024 文号存在、用于 2025 注册；导师变更、生效时点、注册与学籍状态定义等具体条款不可引用",
      "url": "https://gra.cdut.edu.cn/info/1011/5345.htm",
      "scope": "SRC-009 CURRENTITY-UNKNOWN；成都理工大学研究生院；《成都理工大学研究生学籍管理办法》（成理校研〔2024〕29号）尚未取得公开原文；可检索的[2025 注册通知引证路径](https://gra.cdut.edu.cn/info/1011/5345.htm)；仅从 SRC-005 证实 2024 文号存在、用于 2025 注册；导师变更、生效时点、注册与学籍状态定义等具体条款不可引用；文号 2024；准确印发日/实施日/废止状态待取得原件；学校研究生学籍适用性有引证，正文未核；不能沿用成理校研〔2021〕13 号旧版导师变更条款"
    },
    {
      "id": "SRC-010",
      "status": "CDUT-VERIFIED",
      "title": "成都理工大学传播科学与艺术学院；[《成都理工大学新闻传播学学位点2024年度学位与研究生教育质量报告》](https://ccsa.cdut.edu.cn/info/1028/9142.htm)；“研究生导师立德树人职责落实情况”“质量保障制度建设”两段：学院采用双导师、双向选择并曾出台导师年度考核办法；官网正文段落",
      "url": "https://ccsa.cdut.edu.cn/info/1028/9142.htm",
      "scope": "SRC-010 CDUT-VERIFIED；成都理工大学传播科学与艺术学院；[《成都理工大学新闻传播学学位点2024年度学位与研究生教育质量报告》](https://ccsa.cdut.edu.cn/info/1028/9142.htm)；“研究生导师立德树人职责落实情况”“质量保障制度建设”两段：学院采用双导师、双向选择并曾出台导师年度考核办法；官网正文段落；2025-03-14 发布，描述 2024 学位点运行；仅该学院经验事实。未公开其考核办法全文、公式或现行批次通知，不能把报告视为全校具体程序依据；正文已核"
    },
    {
      "id": "SRC-011",
      "status": "CDUT-VERIFIED",
      "title": "成都理工大学研究生院；[《成都理工大学2026年硕士研究生招生章程》](https://gra.cdut.edu.cn/info/1074/5442.htm)；“卓越工程师学院”项目段：三年制、工学交替/分段育人、校企双导师联合指导；招生文件，不含导师个人学时换算公式",
      "url": "https://gra.cdut.edu.cn/info/1074/5442.htm",
      "scope": "SRC-011 CDUT-VERIFIED；成都理工大学研究生院；[《成都理工大学2026年硕士研究生招生章程》](https://gra.cdut.edu.cn/info/1074/5442.htm)；“卓越工程师学院”项目段：三年制、工学交替/分段育人、校企双导师联合指导；招生文件，不含导师个人学时换算公式；2025 年公布面向 2026 级招生；只证明此类型双导师项目真实存在，不证明统一适用于全部专业、个人计量分担比例或 2026 年度考核流程；2026-10-23 搜索索引复核"
    },
    {
      "id": "SRC-012",
      "status": "CROSS-SCHOOL-REFERENCE",
      "title": "东北农业大学研究生院/规范性文件库；[《导师指导研究生工作量核算标准》（东农研字〔2024〕23号）](https://gfxwj.neau.edu.cn/info/1007/1107.htm)；第 1–5 条区分校内/非全日制及导师组协商分配；第 6–10 条以毕业学生和科研工作量赋分并与考评挂钩",
      "url": "https://gfxwj.neau.edu.cn/info/1007/1107.htm",
      "scope": "SRC-012 CROSS-SCHOOL-REFERENCE；东北农业大学研究生院/规范性文件库；[《导师指导研究生工作量核算标准》（东农研字〔2024〕23号）](https://gfxwj.neau.edu.cn/info/1007/1107.htm)；第 1–5 条区分校内/非全日制及导师组协商分配；第 6–10 条以毕业学生和科研工作量赋分并与考评挂钩；2024 年起执行（该校原文第12条）；仅说明跨校模型存在明显差异，其赋分、毕业口径和分担机制对成都理工无效；2026-10-23 逐页文本核读"
    },
    {
      "id": "SRC-013",
      "status": "CROSS-SCHOOL-REFERENCE",
      "title": "东莞理工学院研究生院；[《关于核对2025年秋季学期研究生教育工作量的通知》（研究生院通〔2026〕1号）](https://yjs.dgut.edu.cn/info/1021/20936.htm)；第“一、计算方式（二）”区分本校独招硕士、联合培养硕士/博士；“二、工作程序”说明教师系统确认与学院签章报送，该校还有逾期自动确认机制",
      "url": "https://yjs.dgut.edu.cn/info/1021/20936.htm",
      "scope": "SRC-013 CROSS-SCHOOL-REFERENCE；东莞理工学院研究生院；[《关于核对2025年秋季学期研究生教育工作量的通知》（研究生院通〔2026〕1号）](https://yjs.dgut.edu.cn/info/1021/20936.htm)；第“一、计算方式（二）”区分本校独招硕士、联合培养硕士/博士；“二、工作程序”说明教师系统确认与学院签章报送，该校还有逾期自动确认机制；2026-01-06，特指该校 2025 秋季批次；任何学时值、学期边界、期限或逾期默认确认严禁移植为成都理工规则；2026-10-23 全文核读"
    },
    {
      "id": "SRC-014",
      "status": "GENERAL-RESEARCH",
      "title": "全国人大常委会通过，中央网信办转载；[《中华人民共和国个人信息保护法》](https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm)；第 5–9 条合法、必要、最小化及准确性；第 13 条处理合法性基础；第 28–30 条敏感个人信息保护",
      "url": "https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm",
      "scope": "SRC-014 GENERAL-RESEARCH；全国人大常委会通过，中央网信办转载；[《中华人民共和国个人信息保护法》](https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm)；第 5–9 条合法、必要、最小化及准确性；第 13 条处理合法性基础；第 28–30 条敏感个人信息保护；2021-08-20 通过、2021-11-01 施行；适用于本次产品设计的合法处理边界，不代表学校已授权访问真实学生记录；2026-10-23 核读官方全文"
    },
    {
      "id": "SRC-015",
      "status": "GENERAL-RESEARCH",
      "title": "全国人大常委会通过，教育部转载；[《中华人民共和国学位法》](https://www.moe.gov.cn/jyb_sjzl/sjzl_zcfg/zcfg_jyfl/202404/t20240426_1127804.html)；第一章学位管理及授予权配置、学位授予条件和程序、申诉/复核与质量监督相关条文；用于识别 S08 学位事项的独立权责",
      "url": "https://www.moe.gov.cn/jyb_sjzl/sjzl_zcfg/zcfg_jyfl/202404/t20240426_1127804.html",
      "scope": "SRC-015 GENERAL-RESEARCH；全国人大常委会通过，教育部转载；[《中华人民共和国学位法》](https://www.moe.gov.cn/jyb_sjzl/sjzl_zcfg/zcfg_jyfl/202404/t20240426_1127804.html)；第一章学位管理及授予权配置、学位授予条件和程序、申诉/复核与质量监督相关条文；用于识别 S08 学位事项的独立权责；2024-04-26 通过、2025-01-01 施行；不是导师指导工作量计算或本案年度考核权来源。本轮官网全文打开超时，以教育部法律索引/通过公告核验生效时间，细节不据本条作硬判"
    }
  ]
} as const
