import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "T02-T11",
  "version": 1,
  "schemaVersion": 2,
  "name": "教职工事假、病假等劳动人事请销假审核",
  "description": "本地研究模板 · 非校方正式模板。基于 R02 研究原件形成的事实预审与人工复核候选，不代表成都理工大学现行制度、授权或正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T02-T11 的研究稿并非校方正式模板；校本政策现行性、适用身份和最终审批权限须由有权人员核实。",
  "objectType": "person",
  "displayName": {
    "template": "{{title}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "请假事件 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F001；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F001 请假事件 ID | ID / CASE | 建案后全程 | CASE 可信创建记录 | P1 | 尚未建案 NR；不能用户自赋 |"
    },
    {
      "key": "f002",
      "label": "请假人主体 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F002；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F002 请假人主体 ID | ID / PERSON | 进入任一分支 | HR/认证绑定记录，M002#人员唯一标识 | P2 | SU；不得以同名推定 |"
    },
    {
      "key": "f003",
      "label": "人员姓名",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F003；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F003 人员姓名 | TEXT / PERSON | 首次与材料比对 | M002#现用姓名，M001#自报姓名仅佐证 | P1 | SU/CF；姓名不构成唯一键 |"
    },
    {
      "key": "f004",
      "label": "聘用/劳动关系类别",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F004；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F004 聘用/劳动关系类别 | ENUM / PERSON | 申请与特殊路由 | M002#关系类型及聘用主体 | P2 | SU/PU；不能从教工证推断 |"
    },
    {
      "key": "f005",
      "label": "受管单位与组织 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F005；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F005 受管单位与组织 ID | ID / PERSON | 路由、返岗 | M002#当前单位及历史变更 | P2 | SU/CF；合并部门按有效期判断 |"
    },
    {
      "key": "f006",
      "label": "关系生效区间",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F006；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F006 关系生效区间 | INTERVAL / PERSON | 路由、跨期申请 | M002#关系起止和状态 | P2 | SU；跨区间送 HU |"
    },
    {
      "key": "f007",
      "label": "干部/特殊管理标签",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F007；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F007 干部/特殊管理标签 | ENUM / PERSON | 情形 I 或其他触发 | M002#岗位/干部记录 + M015#权限覆盖 | P2 | SU/PU；不得 OCR 自证 |"
    },
    {
      "key": "f008",
      "label": "实际提交者 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F008；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F008 实际提交者 ID | ID / APPLICATION | 每次提交 | AUTH/Host 可信会话与 M001#发起人 | P2 | SU；Renderer actor 不可信 |"
    },
    {
      "key": "f009",
      "label": "提交关系",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F009；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F009 提交关系 | ENUM / APPLICATION | 本人或代理提交 | F002 与 F008 对比，条件 M005 | P2 | 不一致时 HU，缺授权 NM/PU |"
    },
    {
      "key": "f010",
      "label": "本次动作类别",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F010；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F010 本次动作类别 | ENUM / APPLICATION | 每次阶段操作 | M001/M009/M010/M012#操作意图 + CASE | P1 | NM；不得自动写为已批准 |"
    },
    {
      "key": "f011",
      "label": "请求假别",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F011；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F011 请求假别 | ENUM / APPLICATION | 初请、续/改期 | M001#假别或 M009#更正假别 | P2 | NM；假别映射 PU |"
    },
    {
      "key": "f012",
      "label": "原因最小摘要",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F012；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F012 原因最小摘要 | TEXT / APPLICATION | 初请、必要变更 | M001#申请理由；病情不要求诊断全文 | P2 | NM；过度敏感需遮蔽 |"
    },
    {
      "key": "f013",
      "label": "拟休假起点",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F013；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F013 拟休假起点 | DATETIME / APPLICATION | 初请/续改 | M001/M009#拟起时间 | P1 | NM/CF；时间粒度 PU |"
    },
    {
      "key": "f014",
      "label": "拟休假终点",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F014；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F014 拟休假终点 | DATETIME / APPLICATION | 初请/续改 | M001/M009#拟止时间 | P1 | NM/CF；不替代返岗时间 |"
    },
    {
      "key": "f015",
      "label": "计算假期量",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F015；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F015 计算假期量 | DECIMAL+UNIT / APPLICATION | 日期计算可用后 | CASE 对 F013/F014 与 M015#日历规则派生 | P2 | PU 时保留未知；不得自动判超限 |"
    },
    {
      "key": "f016",
      "label": "申请提交时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F016；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F016 申请提交时间 | DATETIME / APPLICATION | 每次正式提交 | CASE/可信接收时间，M001#收件回执 | P1 | SU；照片元数据不是收件时间 |"
    },
    {
      "key": "f017",
      "label": "适用政策版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F017；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F017 适用政策版本 | REF / DECISION | 选路由、正式审核 | M015#生效文件、适用组织/人员范围 | P0 | PU/SU；不能默认旧规则 |"
    },
    {
      "key": "f018",
      "label": "工作交接安排引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F018；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F018 工作交接安排引用 | REF / APPLICATION | 校本要求时 | M006#交接安排/有权单位确认 | P2 | 条件不明 PU；已要求且缺 NM |"
    },
    {
      "key": "f019",
      "label": "医疗证明签发机构",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F019；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F019 医疗证明签发机构 | TEXT / EVIDENCE | 已出具病假材料后 | M003#机构名称及签发信息 | P3 | 条件未知 PU；已要求不可读 UR |"
    },
    {
      "key": "f020",
      "label": "医疗证明出具日",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F020；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F020 医疗证明出具日 | DATE / EVIDENCE | 已出具病假材料后 | M003#出具日 | P3 | NR/UR/CF，不能倒填 |"
    },
    {
      "key": "f021",
      "label": "医疗证明指向人员",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F021；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F021 医疗证明指向人员 | TEXT/ID / EVIDENCE | 医证与本人匹配 | M003#就诊者标识，对 F002/F003 | P3 | CF/HU；不能公开病历全文 |"
    },
    {
      "key": "f022",
      "label": "医疗建议休息期间",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F022；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F022 医疗建议休息期间 | INTERVAL / EVIDENCE | 医证出具后 | M003#休息建议起止/时长 | P3 | NR/UR/PU；需医疗专家判断时 HU |"
    },
    {
      "key": "f023",
      "label": "医证安全引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F023；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F023 医证安全引用 | SECURE_REF / EVIDENCE | 医证被合法接收时 | M003#受控文件 ID 与版次 | P3 | NR/SU；不得输出明文 URL |"
    },
    {
      "key": "f024",
      "label": "紧急通知证据引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F024；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F024 紧急通知证据引用 | REF / EVIDENCE | C 情形发生通知后 | M004#通知时间/接收方/渠道记录 | P2 | NR、或按校规 NM/PU |"
    },
    {
      "key": "f025",
      "label": "代理授权证据引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F025；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F025 代理授权证据引用 | REF / EVIDENCE | 代理实际代办时 | M005#授权人/事项/期间/受托人 | P2 | 代理无授权 NM/HU，规则 PU |"
    },
    {
      "key": "f026",
      "label": "原申请版本引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F026；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F026 原申请版本引用 | REF / APPLICATION | D/E/F/G 关联既存事由 | CASE 历史、M007#所关联申请 | P2 | SU/CF；不能猜同名案卷 |"
    },
    {
      "key": "f027",
      "label": "原正式批准引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F027；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F027 原正式批准引用 | REF / DECISION | 已批假变更、销假等 | M007#有效决定 ID、签发人和时间 | P2 | 尚无批准 NR；应有而失联 SU |"
    },
    {
      "key": "f028",
      "label": "原批准区间",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F028；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F028 原批准区间 | INTERVAL / DECISION | 已批准后 | M007#批准起止，不以 F013/F014 替代 | P2 | NR/SU/CF |"
    },
    {
      "key": "f029",
      "label": "本次变更/撤销理由",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F029；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F029 本次变更/撤销理由 | TEXT / APPLICATION | D/F | M009#本次请求和更正说明 | P2 | NM；理由实体审查 HU |"
    },
    {
      "key": "f030",
      "label": "补件问题与版本引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F030；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F030 补件问题与版本引用 | REF / APPLICATION | E 及补件重审 | M008#问题 ID、旧/新材料 ID 与提交时间 | P2 | 仅问题产生后需要；缺 NM/SU |"
    },
    {
      "key": "f031",
      "label": "撤回意图及效力状态",
      "kind": "enum",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F031；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F031 撤回意图及效力状态 | ENUM / APPLICATION | F | M009#本人撤回意图；M007#有权变更决定另记 | P2 | NM/HU；意图不等于决议生效 |"
    },
    {
      "key": "f032",
      "label": "实际返岗时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F032；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F032 实际返岗时间 | DATETIME / APPLICATION | G 返岗后 | M010#本人返岗声明/考勤事实 | P2 | NR/CF；不能取 F014 充数 |"
    },
    {
      "key": "f033",
      "label": "返岗核验记录引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F033；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F033 返岗核验记录引用 | REF / DECISION | G 单位核验后 | M010#ATT/单位查核结论 | P2 | 未核验 NR；应有而缺 SU |"
    },
    {
      "key": "f034",
      "label": "正式销假结果引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F034；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F034 正式销假结果引用 | REF / DECISION | G 有权销假之后 | M011#真实销假审批/备案结果 | P2 | NR/SU；本模板不自产 |"
    },
    {
      "key": "f035",
      "label": "被争议权威决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F035；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F035 被争议权威决定引用 | REF / REVIEW | H 已有决定后 | M013#被争议决定及通知 | P2 | 未有对象 NR；失联 SU |"
    },
    {
      "key": "f036",
      "label": "复核/异议请求摘要",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F036；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F036 复核/异议请求摘要 | TEXT / REVIEW | H 提出请求时 | M012#申诉请求、理由与范围 | P2 | NM；不可推定复核成功 |"
    },
    {
      "key": "f037",
      "label": "复核请求接收时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F037；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F037 复核请求接收时间 | DATETIME / REVIEW | H 受理后 | M012#可信收件回执 | P2 | 未受理 NR；记录失联 SU |"
    },
    {
      "key": "f038",
      "label": "外部权威结论关联",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F038；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F038 外部权威结论关联 | REF_LIST / LINK | 需与 G05/T01/T02-T05 交接时 | M014#外部系统决定 ID、范围、有效版次 | P2 | 非本案需要 NR；应有而不可查 SU |"
    },
    {
      "key": "f039",
      "label": "有权签发角色快照",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "研究字段 F039；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F039 有权签发角色快照 | REF / DECISION | 提交正式审批/复核动作时 | M015#组织权限/代理授权在行为时的快照 | P2 | SU/PU，绝不从 UI 自报 |"
    },
    {
      "key": "f040",
      "label": "材料来源与版本指纹",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F040；按原件可定位事实抽取，不补造缺失值。SRC 仅为研究来源索引，不得伪装为案卷 SourceRef。原始定义：| F040 材料来源与版本指纹 | HASH+REF / EVIDENCE | 每份材料入案与替换 | CASE#来源标识、归属、版本、哈希、采集时间 | P2（医证随 P3） | 缺则 HU/CF，禁止沿用旧结论 |"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "本次申请声明",
      "purpose": "证明本人请求的假别、事由、日期、操作者；申请人/校方受理端；本次阶段当前需有；在线申请及提交回执，或经学校人工收件核实的纸质申请；受控口头/电话通知仅 C 情形先用 M004，能否补书面依政策；F008/F010–F016，SRC-001/002/006；归属申请人及申请版；缺 NM，不可读 UR；无可信收件时间 SU",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "requiredElements": [
        "本次申请声明与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "人事关系权威记录",
      "purpose": "证明此人身份、任职单位和关系有效期；学校人事/组织管理方；**当前必要的权威核验，不是本人必须上传材料**；人事名册、聘用关系记录、干部管理信息；学校人事有权人员线下查验并留可审计证明；本人上传合同仅线索，不直接替代权威结论；F002–F007，SRC-003/006；归属学校权威人员档案版次；失联 SU，歧义 CF；不要求重复扫描全档",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "人事关系权威记录与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "病假医疗证明",
      "purpose": "证明医证属于本人及建议休息期间；医疗机构签发、本人持有；B/C/D 中**医证已产生且校规确实要求时条件必需**；具体证明级别、格式、期限均未知；对校规准许的等效医疗证明可人工核实，电子验真仅在确有官方渠道时；F019–F023，SRC-001/007，SRC-009 仅外校反例；归属就诊人，P3 隔离存储；未到出证 NR，政策不明 PU，缺 NM，不可读 UR；不需要完整病历作默认替代",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "病假医疗证明与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "紧急通知记录",
      "purpose": "证明急症下已通知的时间与对象；本人/联系人/接收单位；C 情形联系发生后条件产生；可信电话、值班、服务工单或单位核验记录；人工核实的联系纪要可作为待审线索，不自动代表准假；F024，SRC-001/006；归属通知事件；未发生 NR，记录失联 SU，内容冲突 CF",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "紧急通知记录与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "代理授权记录",
      "purpose": "证明提交者与请假人不同的合法授权；授权人/受托人/学校有权人员；仅实际代理且学校制度允许时条件必需；有授权事项与期间的可信记录；急症无法授权等例外交有权人事人工核定，不能由亲属关系自动替代；F009/F025，SRC-001/007；归属代理事件与有效期；缺 NM/PU，签名真实性不明 HU",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "代理授权记录与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "工作安排/交接记录",
      "purpose": "证明岗位交接或教学安排已由相应权责部门处理；所在单位；若校规要求时，通常离岗前产生；内部交接意见或工作安排结果；T01/其他有权系统真实安排结论引用可替代普通附件；F018/F038，SRC-001/006；归属责任单位/版本；未规定 PU，已要求缺 NM/SU",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "工作安排/交接记录与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "正式请假/变更决定",
      "purpose": "证明原假期已由有权人员批准或变更；学校 OA/批准机关；**审批完成以后才产生**；权威事件、批准区间、签发角色与时间；有权单位对线下纸质原件核查并可信登记；扫描“同意”不能自动等价；F026–F028/F031，SRC-001/002/006；归属具体决定 ID/生效版本；未来 NR，失联 SU，疑似签批 HU",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "正式请假/变更决定与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "补件问题与补交版本",
      "purpose": "定位缺口、旧版及新证据；审核岗位发问题、申请人补件；E 情形问题提出及补交后才产生；待办/退回记录+被替换材料版本；经核验的纸质补交及问题清单；F030/F040，SRC-002/007；归属问题 ID 与旧/新材料链；缺 NM/SU，不可读 UR，版本交错 CF",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "补件问题与补交版本与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "更正/续假/撤回请求",
      "purpose": "证明本次改变意愿，不证明正式批准失效；当事人；D/F 发起时当前产生；申请请求、修改理由、拟日期和收件回执；允许的线下正式申请经人工录入；F010/F013/F014/F029/F031，SRC-001/006；归属新的申请版本；缺 NM，不可读 UR；不得覆写 M007",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "更正/续假/撤回请求与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "返岗事实与单位核验",
      "purpose": "证明实际返岗、校内考勤或负责人核实；本人/单位；G **实际返岗后**才出现；本人返岗声明和可信考勤/单位记录；现场报到记录经单位核验可取代尚不可接入的考勤接口；F032/F033，SRC-001/006；归属返岗事件与考勤版；未来 NR，失联 SU，日期矛盾 CF",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "返岗事实与单位核验与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "销假正式结果",
      "purpose": "证明有权销假、确认或备案；学校实际责任岗位；G 的**销假完成后**产生，不是初请件；真实流程决定/备案回执；经授权的线下销假登记核验后引用；F034，SRC-001/002；归属销假决定版本；未来 NR，失联 SU；不能凭返岗声明自造",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "销假正式结果与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "复核/异议请求",
      "purpose": "证明当事人提出何种救济请求及何时受理；本人/有权收件机关；H 发起时产生；请求、范围、可信收件回执；书面申诉经正式受理部门核验；F036/F037，SRC-003/006；归属争议程序 ID；未受理 NR，申请缺 NM，时间失联 SU",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "复核/异议请求与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "被争议决定",
      "purpose": "明确申诉对象及通知情况；原批准/人事决定机关；H 前已有的正式决定；权威决定及告知记录；校方档案/OA 可核验的原件，无法联网时人工查核；F035，SRC-003/006；归属原案件/决定，不被申诉覆写；不存在 NR，失联 SU，错案 CF",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "被争议决定与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "相邻 G/S/T 权威结果",
      "purpose": "只关联公务外出、调课、考核、考勤、薪酬等外部已有效决定；各业务权责主体；相关业务产生之后按需要引用；权威结果 ID、范围及状态；原系统不可用时由有权业务部门人工确认；F038/F018，SRC-005/006/008；归属外部决定 ID 和生效版；非需要 NR，失联 SU，冲突 CF",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "相邻 G/S/T 权威结果与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "当前政策与权限依据",
      "purpose": "确认谁可批何种身份、假别、期限及如何销假；学校人事/组织/法规授权发布者；**路由当前必须核明的校本规范性依据**，并非向教职工索要；现行制度、授权目录、生效区间、签批权限；人事处有权人员按现行文件线下核验、记录文号及适用条款；不能用外校政策替代；F007/F015/F017/F039，SRC-001/003/006；归属校本有效政策版本；目前正文未得 PU，失联 SU，生效区间冲突 CF",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "decision",
      "requiredElements": [
        "当前政策与权限依据与本次事项/人员的对应关系",
        "来源、形成日期/版本与真实形成阶段",
        "可回指的原件位置或权威记录；无法核实时转人工"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "fact-review",
      "name": "事实与权限核验",
      "description": "对应研究原件第 08 节的事实核验规则；所有结果只供本地人工审阅，不替代校方决定。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "R001 案卷与证据归属｜所有入案/替换",
          "requirement": "**R001 案卷与证据归属**｜所有入案/替换；T=新建、引用或替换了一个有来源的材料；F=无材料操作；U=事件/来源状态不可信；SRC-002/007；F001/F040；M001/M008；比较 CASE、归属人、槽类型、版本、指纹和入案时间；可信 CASE L0，上传 L2；更名文件不能改变来源，跨案重用须明确合法授权；一致 `PASS_FACT`，错案/指纹变更 `CONFLICT`，文件不可读 `UNREADABLE`；U=`SOURCE_UNAVAILABLE`，至案卷经办/可信数据管理员。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "R002 请假人同一性｜首次申报及人员变化",
          "requirement": "**R002 请假人同一性**｜首次申报及人员变化；T=待定位请假人；F=纯技术重放、无人事主体动作；U=权威人事身份无法核查；SRC-003/006/007；F002/F003/F008；M001/M002；优先 HR 主体键和有效关系 L0，再比 M001 自述 L2；同名、曾用名、证件脱敏差异不推定冒名，行为时点为准；一致 `PASS_FACT`，真实不匹配 `CONFLICT`，U=`SOURCE_UNAVAILABLE`；下一角色人事身份核验岗。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "R003 聘用身份及归口｜A–H + I",
          "requirement": "**R003 聘用身份及归口**｜A–H + I；T=需要确定本校是否有权批假；F=已由有权机构确认非本校管理、仅关联结果；U=适用人员或组织权限未知；SRC-001/003/006；F004–F007/F017；M002/M015；按请假日期覆盖的劳动/人事关系、生效单位与特殊干部标签核对；HR L0、现行政策 L0/L1；项目用工不从教师邮箱推断；明确适用可 `PASS_FACT`，关系数据互斥 `CONFLICT`；U=`POLICY_UNCONFIRMED` 或源失联 `SOURCE_UNAVAILABLE`；人事处/合同管理有权岗。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "R004 动作、主体与收件时点｜申请/改期/撤回/返岗/异议",
          "requirement": "**R004 动作、主体与收件时点**｜申请/改期/撤回/返岗/异议；T=提交了阶段动作；F=尚无任何提交；U=真实收件状态未知；SRC-001/002；F008/F010/F016；M001/M009/M010/M012；可信认证人和收件事件 L0，对照申请动作 L2；照片时间、草稿保存不等于正式提交；返岗声明不能当作初请；意图与记录一致 `PASS_FACT`，已要求的动作请求不存在 `NEEDS_MATERIAL`，时序矛盾 `CONFLICT`；U=`SOURCE_UNAVAILABLE`，到受理经办。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "R005 假别与最小事由｜A/B/D，J 仅路由",
          "requirement": "**R005 假别与最小事由**｜A/B/D，J 仅路由；T=发起请假/变更假别；F=仅复核旧决定或销假；U=假别是否属于本模板无法确定；SRC-001/006；F010–F012；M001/M009/M015；比对当前版本自报假别与理由摘要，保留原文定位；不要求病名，不自行合并“等”字下的其他假；申请 L2、政策 L0/L1；声明完整 `PASS_FACT`，缺当前声明 `NEEDS_MATERIAL`；U=`POLICY_UNCONFIRMED`，到人事政策确认岗。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "R006 拟假期间及天数口径｜初请/续改",
          "requirement": "**R006 拟假期间及天数口径**｜初请/续改；T=有拟休假起止；F=纯撤回/复核无新日期；U=日期不全或日历口径无效；SRC-001/006；F013–F015；M001/M009/M015；同版日期排序、时间区间与时区；日期事实可 L2，工作日、跨节假日、半天及累计算法必须由现行校规 L0/L1 提供；跨期是 HU 非自动旷工；自洽的起止 `PASS_FACT`（**不含天数合法性**），反向/矛盾 `CONFLICT`，当前日期缺 `NEEDS_MATERIAL`；U 的天数门槛 `POLICY_UNCONFIRMED`，到政策岗。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "R007 政策现行性与权限版本｜所有正式路由",
          "requirement": "**R007 政策现行性与权限版本**｜所有正式路由；T=准备按制度送交有权审批/销假/复核；F=只作文书读写/资料收集；U=拿不到现行校本正文/授权快照；SRC-001/003/006；F007/F017/F039；M015/M002；校本政策文号、生效区间、适用人员/假别、角色授权时间两两比对；政策 L0/L1，网站目录不是规定正文；禁用 SRC-009 门槛；有效且覆盖 `PASS_FACT`（仅权限事实），冲突 `CONFLICT`，U=`POLICY_UNCONFIRMED` 或 `SOURCE_UNAVAILABLE`，到人事政策与授权管理岗；此门禁不允许默认通过。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "R008 工作交接/教学安排｜A/B/D 有岗位衔接要求时",
          "requirement": "**R008 工作交接/教学安排**｜A/B/D 有岗位衔接要求时；T=经现行规则确认须交接；F=权威规则确认本次无要求；U=校本要求或权威记录未知；SRC-001/006；F018/F038；M006/M014/M015；核对有权单位/教务真正签发的交接、调课结果 L0/L1 与本次假期重合性；不把待办建议当调课批准；有效安排 `PASS_FACT`，已证实必交但缺 `NEEDS_MATERIAL`（单位责任源失联则 `SOURCE_UNAVAILABLE`）；U=`POLICY_UNCONFIRMED`，到所在单位与教务归口。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "R009 医证来源、签发日与受控引用｜B/C/D 已获医证后",
          "requirement": "**R009 医证来源、签发日与受控引用**｜B/C/D 已获医证后；T=已提供 M003 且合法受理；F=非病假或医证尚未生成；U=现行医证要求/来源无法核查；SRC-001/007（SRC-009 **仅反例**）；F019/F020/F023/F040；M003/M015；检查签发机构、日期、文件版本、合法来源及受控访问；医疗机构原始记录 L1、上传 L2；签发日在申请后不自动判假；可核字段 `PASS_FACT`，不可读 `UNREADABLE`，相互矛盾 `CONFLICT`；U=`POLICY_UNCONFIRMED` 或 `SOURCE_UNAVAILABLE`，到专门医疗材料核验岗。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "R010 医证人员归属｜B/C/D 医证已出现",
          "requirement": "**R010 医证人员归属**｜B/C/D 医证已出现；T=M003 载有人名/就诊身份；F=非病假或未到证据阶段；U=合法身份匹配依据缺失；SRC-007；F002/F003/F021；M002/M003；限 P3 授权比对可信 HR ID 与医疗身份标识，允许有权人员处理曾用名/号码掩码；绝不单凭同名认定；一致 `PASS_FACT`，实质冲突 `CONFLICT`；U=`SOURCE_UNAVAILABLE` 或 `NEEDS_HUMAN_DECISION`，到人事+隐私授权核验者。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "R011 医嘱与申请期间关系｜B/C/D 医嘱已形成",
          "requirement": "**R011 医嘱与申请期间关系**｜B/C/D 医嘱已形成；T=M003 有已读的休息建议；F=非病假/医证未来；U=医嘱无法识别或时间粒度不明；SRC-001/007；F013/F014/F022；M001/M003/M009；按每个版本计算交集与差集，提供冲突区间，不判疾病真假及超期是否获准；申请 L2、医疗证明 L1/L2；未来签发证明不得报缺；区间事实一致 `PASS_FACT`，不一致 `CONFLICT`，不可读 `UNREADABLE`；U 的政策性适格 `POLICY_UNCONFIRMED`，到医证/人事人工岗。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "R012 急症通知的事件真实性｜C",
          "requirement": "**R012 急症通知的事件真实性**｜C；T=当事人声称发生紧急通知；F=正常本人事前申请；U=是否应/能先口头通知未知；SRC-001/006；F024/F016；M004/M001/M015；查通知发生时刻、被通知单位/渠道与可信收件记录 L0/L1；微信截图只作线索，急症补办时限依校规；通知事实一致 `PASS_FACT`，相互冲突 `CONFLICT`，当期必须通知且缺证才 `NEEDS_MATERIAL`；U=`POLICY_UNCONFIRMED`，到单位值班/人事岗。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "R013 代理资格及期间｜C 或其他代理",
          "requirement": "**R013 代理资格及期间**｜C 或其他代理；T=实际提交者不等于请假人；F=可信主体一致且无代办；U=提交者/授权来源不明；SRC-001/007；F008/F009/F025；M002/M005；可信认证/授权源 L0 对照事项、授权人、代理人、时段，病重不能签名时需有权例外判定；亲属关系不是当然授权；合法代办事实 `PASS_FACT`，授权与行为冲突 `CONFLICT`，已证实应交授权而未交 `NEEDS_MATERIAL`；U=`POLICY_UNCONFIRMED`/`NEEDS_HUMAN_DECISION`，到人事授权岗。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "R014 原请假与有效批准关联｜D/F/G/H 有原案时",
          "requirement": "**R014 原请假与有效批准关联**｜D/F/G/H 有原案时；T=操作引用原事件/批准；F=真正首次初请；U=原记录是否已生效或可访问不明；SRC-001/002/006；F001/F026–F028；M001/M007/M009；对照原案号、所批准的申请版本、决定 ID、批准期间和签发时间 L0/L1；未批时 F027/F028 为 NR；截图 L3 不生效；真实关联 `PASS_FACT`，错案 `CONFLICT`，应有决定但来源失联 `SOURCE_UNAVAILABLE`；U 留人工查档，绝不伪造原批准。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "R015 续假、改期或假别更正｜D",
          "requirement": "**R015 续假、改期或假别更正**｜D；T=提出 M009 新版本；F=纯初请、补件未提出变更；U=现行重批/累计口径未知；SRC-001/006；F010/F011/F013/F014/F026/F029；M001/M009/M007/M015；比对新旧请求与原批准两条时间线 L2/L0；新申请不覆盖旧批准，更改理由为声明不是裁量结论；跨年累计规则待取证；新请求版本自洽 `PASS_FACT`，新旧数据归属混淆 `CONFLICT`，新请求缺 `NEEDS_MATERIAL`；U=`POLICY_UNCONFIRMED`，到原有权审批岗。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "R016 补件与主从版本有效性｜E/任一材料替换",
          "requirement": "**R016 补件与主从版本有效性**｜E/任一材料替换；T=发生补件/更换源版本；F=没有材料版本变更；U=原/新指纹或问题归属无法取得；SRC-002/007；F030/F040；M008 和被替换的 M001–M015 对应槽；对照问题 ID、目标 R、旧/新版、签发/采集时间；旧事实预审结果仅对旧快照有效，批准的效力仍由决定机关决定；新来源不同不允许静默合并；完整链路 `PASS_FACT`，版本错配 `CONFLICT`，新文件不可读 `UNREADABLE`；U=`SOURCE_UNAVAILABLE`，到案卷材料经办。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "R017 撤回申请与既有决定隔离｜F",
          "requirement": "**R017 撤回申请与既有决定隔离**｜F；T=当事人提出撤回/请求撤销；F=仅续假未提出撤回；U=原批准状态或校本可撤回条件未知；SRC-001/006；F026/F027/F031；M009/M007/M015；以当前撤回请求 L2 和原决定 L0 分账；若仅待审请求，撤回是否立即生效待流程核；若已批，必须有权变更决定，不能据按钮删批假；意图一致 `PASS_FACT`（仅意图）；无有效请求 `NEEDS_MATERIAL`，状态不一致 `CONFLICT`；U=`POLICY_UNCONFIRMED`/`NEEDS_HUMAN_DECISION`，到原有权审批岗。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "R018 返岗日期与单位核实｜G",
          "requirement": "**R018 返岗日期与单位核实**｜G；T=实际返岗/单位核验事件出现；F=仍处获准假期间、未返岗；U=考勤或单位事实不可得；SRC-001/006；F028/F032/F033；M007/M010；以现场返岗/受控考勤 L0/L1 对照已批准区间 L0；申请终点 F014 不等于返岗；打卡差异不可直接定义旷工；日期可核 `PASS_FACT`，材料内互斥 `CONFLICT`，不可读 `UNREADABLE`；U=`SOURCE_UNAVAILABLE`，到单位考勤/人事岗。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "R019 正式销假结果真实性｜G 后续",
          "requirement": "**R019 正式销假结果真实性**｜G 后续；T=校方声称已完成销假/备案；F=未进入销假决定阶段；U=权限或正式记录无法确定；SRC-001/002/006；F033/F034/F039；M010/M011/M015；仅可信销假事件 L0 或有权线下登记 L1；核对决定人、时间、绑定原批准与返岗事实，普通“打卡”非销假决定；引用真实结果 `PASS_FACT`（**非本模板批准**），伪造或错案 `CONFLICT`；U=`SOURCE_UNAVAILABLE`/`POLICY_UNCONFIRMED`，到有权销假岗。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "R020 异议对象、请求与收件｜H",
          "requirement": "**R020 异议对象、请求与收件**｜H；T=本人就既有决定提出救济；F=无异议请求；U=专门渠道、期限或接收事实不明；SRC-003/006；F035–F037；M012/M013/M015；按被争议决定 ID/通知、申诉请求版本和可信受理回执 L0/L1 比对；F037 仅在收件后出现；不得用本模板复判工资、考核与处分；关联一致 `PASS_FACT`，对象错位 `CONFLICT`，请求缺 `NEEDS_MATERIAL`；U=`POLICY_UNCONFIRMED`/`SOURCE_UNAVAILABLE`，到校方实际救济受理机构。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "R021 其他业务有权结论的引用｜G05/T01/T02-T05 等",
          "requirement": "**R021 其他业务有权结论的引用**｜G05/T01/T02-T05 等；T=本案与外部已生效结果存在关联；F=本案无跨业务关联；U=外部授权或生效版本不可证；SRC-005/006/008；F018/F038；M014/M006；只比外部事件 ID、签发方、人员、期间、效力及必要字段 L0/L1；不读取他业务草稿、不作因公与私人请假互相批准；可核引用 `PASS_FACT`，真实权威期间冲突 `CONFLICT`；U=`SOURCE_UNAVAILABLE`，到两个业务各自有权岗位。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "R022 正式决定身份与权限守卫｜任何决定写入/更新",
          "requirement": "**R022 正式决定身份与权限守卫**｜任何决定写入/更新；T=有人提出或导入准假、变更、销假、复核结论；F=仅事实预审/普通申请；U=真实签发人或权限链不明；SRC-001/002/006；F002/F017/F027/F034/F039；M002/M007/M011/M015；对照可信 Host/Main 认证、当时职位/权限、案卷版本、决定动作与校本生效依据 L0/L1；Renderer actor/上传扫描公章一概 L3；可验证决定**仅可引用** `PASS_FACT`，伪造/越权证据 `CONFLICT`，无法核权限 `SOURCE_UNAVAILABLE`/`POLICY_UNCONFIRMED`；到校方有权决定机关，V3 预审不写决定。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "R023 医疗最小必要及权限｜病假资料访问/下游共享",
          "requirement": "**R023 医疗最小必要及权限**｜病假资料访问/下游共享；T=收集、解析、展示或向外转送 P3 数据；F=本阶段无医疗个人信息处理；U=处理目的或访问授权未确认；SRC-007；F012/F019–F023/F040；M003/M014；核查合法处理基础、目的、字段范围、可见角色、访问日志与保留策略；诊断全文默认不得向单位普通经办、薪酬/考核或 G50 传播；合规最小化事实可 `PASS_FACT`，无权披露或跨人归属 `CONFLICT` 并立即限制访问；U=`NEEDS_HUMAN_DECISION`/`POLICY_UNCONFIRMED`，到网信/法务+人事隐私岗。SRC 是研究证据索引，不是案卷 SourceRef。校本政策、适用身份、授权或法律效果未确认时保持待确认并交有权人员人工复核；不得自动正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "L0",
      "name": "建案/身份定位",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L1",
      "workflowOwner": "local"
    },
    {
      "id": "L1",
      "name": "申请与材料预审",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L2",
      "workflowOwner": "local"
    },
    {
      "id": "L2",
      "name": "单位核验与有权审批",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L3",
      "workflowOwner": "local"
    },
    {
      "id": "L3",
      "name": "在假期间变更",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L4",
      "workflowOwner": "local"
    },
    {
      "id": "L4",
      "name": "返岗与销假",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "L5",
      "workflowOwner": "local"
    },
    {
      "id": "L5",
      "name": "后续关联与争议",
      "kind": "handoff",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "fact-review-report",
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
  "templateId": "T02-T11",
  "name": "教职工事假、病假等劳动人事请销假审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T02-T11.md",
  "sourceDocumentBytes": 116439,
  "sourceDocumentSha256": "a16f173d337541564272e4c6651d79418e5c221b2210978297f873e7ac69cc37",
  "sourceIntegrityVerifiedAgainstManifest": true,
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-22（当前可访问的最新正式 MD）",
  "researchStatus": "ROUND3_DRAFT",
  "policyEvidenceStatus": "PARTIAL",
  "policyEvidenceSummary": "人事处服务指南条目可检索，但请销假流程正文、现行制度、审批权限、假别门槛及病假隐私安排未完整核实。",
  "workflowOwner": "local",
  "fields": [
    {
      "fieldId": "F001",
      "key": "f001",
      "label": "请假事件 ID"
    },
    {
      "fieldId": "F002",
      "key": "f002",
      "label": "请假人主体 ID"
    },
    {
      "fieldId": "F003",
      "key": "f003",
      "label": "人员姓名"
    },
    {
      "fieldId": "F004",
      "key": "f004",
      "label": "聘用/劳动关系类别"
    },
    {
      "fieldId": "F005",
      "key": "f005",
      "label": "受管单位与组织 ID"
    },
    {
      "fieldId": "F006",
      "key": "f006",
      "label": "关系生效区间"
    },
    {
      "fieldId": "F007",
      "key": "f007",
      "label": "干部/特殊管理标签"
    },
    {
      "fieldId": "F008",
      "key": "f008",
      "label": "实际提交者 ID"
    },
    {
      "fieldId": "F009",
      "key": "f009",
      "label": "提交关系"
    },
    {
      "fieldId": "F010",
      "key": "f010",
      "label": "本次动作类别"
    },
    {
      "fieldId": "F011",
      "key": "f011",
      "label": "请求假别"
    },
    {
      "fieldId": "F012",
      "key": "f012",
      "label": "原因最小摘要"
    },
    {
      "fieldId": "F013",
      "key": "f013",
      "label": "拟休假起点"
    },
    {
      "fieldId": "F014",
      "key": "f014",
      "label": "拟休假终点"
    },
    {
      "fieldId": "F015",
      "key": "f015",
      "label": "计算假期量"
    },
    {
      "fieldId": "F016",
      "key": "f016",
      "label": "申请提交时间"
    },
    {
      "fieldId": "F017",
      "key": "f017",
      "label": "适用政策版本"
    },
    {
      "fieldId": "F018",
      "key": "f018",
      "label": "工作交接安排引用"
    },
    {
      "fieldId": "F019",
      "key": "f019",
      "label": "医疗证明签发机构"
    },
    {
      "fieldId": "F020",
      "key": "f020",
      "label": "医疗证明出具日"
    },
    {
      "fieldId": "F021",
      "key": "f021",
      "label": "医疗证明指向人员"
    },
    {
      "fieldId": "F022",
      "key": "f022",
      "label": "医疗建议休息期间"
    },
    {
      "fieldId": "F023",
      "key": "f023",
      "label": "医证安全引用"
    },
    {
      "fieldId": "F024",
      "key": "f024",
      "label": "紧急通知证据引用"
    },
    {
      "fieldId": "F025",
      "key": "f025",
      "label": "代理授权证据引用"
    },
    {
      "fieldId": "F026",
      "key": "f026",
      "label": "原申请版本引用"
    },
    {
      "fieldId": "F027",
      "key": "f027",
      "label": "原正式批准引用"
    },
    {
      "fieldId": "F028",
      "key": "f028",
      "label": "原批准区间"
    },
    {
      "fieldId": "F029",
      "key": "f029",
      "label": "本次变更/撤销理由"
    },
    {
      "fieldId": "F030",
      "key": "f030",
      "label": "补件问题与版本引用"
    },
    {
      "fieldId": "F031",
      "key": "f031",
      "label": "撤回意图及效力状态"
    },
    {
      "fieldId": "F032",
      "key": "f032",
      "label": "实际返岗时间"
    },
    {
      "fieldId": "F033",
      "key": "f033",
      "label": "返岗核验记录引用"
    },
    {
      "fieldId": "F034",
      "key": "f034",
      "label": "正式销假结果引用"
    },
    {
      "fieldId": "F035",
      "key": "f035",
      "label": "被争议权威决定引用"
    },
    {
      "fieldId": "F036",
      "key": "f036",
      "label": "复核/异议请求摘要"
    },
    {
      "fieldId": "F037",
      "key": "f037",
      "label": "复核请求接收时间"
    },
    {
      "fieldId": "F038",
      "key": "f038",
      "label": "外部权威结论关联"
    },
    {
      "fieldId": "F039",
      "key": "f039",
      "label": "有权签发角色快照"
    },
    {
      "fieldId": "F040",
      "key": "f040",
      "label": "材料来源与版本指纹"
    }
  ],
  "materialSlots": [
    {
      "materialId": "M001",
      "slotId": "M001",
      "name": "本次申请声明"
    },
    {
      "materialId": "M002",
      "slotId": "M002",
      "name": "人事关系权威记录"
    },
    {
      "materialId": "M003",
      "slotId": "M003",
      "name": "病假医疗证明"
    },
    {
      "materialId": "M004",
      "slotId": "M004",
      "name": "紧急通知记录"
    },
    {
      "materialId": "M005",
      "slotId": "M005",
      "name": "代理授权记录"
    },
    {
      "materialId": "M006",
      "slotId": "M006",
      "name": "工作安排/交接记录"
    },
    {
      "materialId": "M007",
      "slotId": "M007",
      "name": "正式请假/变更决定"
    },
    {
      "materialId": "M008",
      "slotId": "M008",
      "name": "补件问题与补交版本"
    },
    {
      "materialId": "M009",
      "slotId": "M009",
      "name": "更正/续假/撤回请求"
    },
    {
      "materialId": "M010",
      "slotId": "M010",
      "name": "返岗事实与单位核验"
    },
    {
      "materialId": "M011",
      "slotId": "M011",
      "name": "销假正式结果"
    },
    {
      "materialId": "M012",
      "slotId": "M012",
      "name": "复核/异议请求"
    },
    {
      "materialId": "M013",
      "slotId": "M013",
      "name": "被争议决定"
    },
    {
      "materialId": "M014",
      "slotId": "M014",
      "name": "相邻 G/S/T 权威结果"
    },
    {
      "materialId": "M015",
      "slotId": "M015",
      "name": "当前政策与权限依据"
    }
  ],
  "sources": [
    {
      "srcId": "SRC-001",
      "evidenceStatus": "verified",
      "url": null
    },
    {
      "srcId": "SRC-002",
      "evidenceStatus": "verified",
      "url": null
    },
    {
      "srcId": "SRC-003",
      "evidenceStatus": "partial",
      "url": null
    },
    {
      "srcId": "SRC-004",
      "evidenceStatus": "partial",
      "url": null
    },
    {
      "srcId": "SRC-005",
      "evidenceStatus": "partial",
      "url": null
    },
    {
      "srcId": "SRC-006",
      "evidenceStatus": "verified",
      "url": null
    },
    {
      "srcId": "SRC-007",
      "evidenceStatus": "verified",
      "url": null
    },
    {
      "srcId": "SRC-008",
      "evidenceStatus": "verified",
      "url": null
    },
    {
      "srcId": "SRC-009",
      "evidenceStatus": "unconfirmed",
      "url": null
    }
  ],
  "criteria": [
    {
      "sectionId": "fact-review",
      "criterionId": "R001",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R002",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R010",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R016",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R018",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R020",
      "srcIds": [
        "SRC-003"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R021",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "partial"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "verified"
    },
    {
      "sectionId": "fact-review",
      "criterionId": "R023",
      "srcIds": [
        "SRC-007"
      ],
      "evidenceStatus": "verified"
    }
  ],
  "safetyConstraints": {
    "autoPassEnabled": false,
    "policyVersionIds": [],
    "finalDecision": "manual-authorized-person-only",
    "sourceIndexIdsAreNotCaseSourceRefs": true,
    "unknownPolicyEffect": "needs-confirmation"
  }
} as const
