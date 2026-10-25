import type { TemplateVersion } from '@profer/shared'

export const T01T04_TEMPLATE: TemplateVersion = {
  "templateId": "T01-T04",
  "version": 1,
  "schemaVersion": 2,
  "name": "教材选用与课堂教学资料审查",
  "description": "本地研究模板 · 非校方正式模板。教材选用与课堂教学资料审查：基于 R02 原件逐条核验事实、证据和办理情形；所列材料包含后续权威记录，不代表初次提交均须上传。所有正式决定与未确认校本政策必须人工判断。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；政策 PARTIAL、全部正式决定需可信人员人工确认；研究 SRC 不是案卷 SourceRef。",
  "objectType": "custom",
  "displayName": {
    "template": "T01-T04 · 教材选用与课堂教学资料审查"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · 案卷/办理关联键·ID／Case",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F001 字段：案卷/办理关联键·ID／Case；P0 起；受信案卷 Owner → 案卷记录 ID；P1；未建案先创建业务引用；不可用任意客户端字符串假装真实案卷。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F001；原稿类型及阶段：F001；案卷/办理关联键·ID／Case；P0 起；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F002",
      "label": "F002 · 课程代码/权威标识·字符串／Course",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F002 字段：课程代码/权威标识·字符串／Course；P0–P1；教学任务/课程主数据 → 课程行 ID；P1；校端不可达 SOURCE_UNAVAILABLE；仅教师手填时待核，撞名 CONFLICT。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F002；原稿类型及阶段：F002；课程代码/权威标识·字符串／Course；P0–P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F003",
      "label": "F003 · 课程名称·字符串／Course",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F003 字段：课程名称·字符串／Course；P0–P1；课程主数据 → 课程行/大纲标题；P1；与 F002 不同源冲突时核代码和历史版本。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F003；原稿类型及阶段：F003；课程名称·字符串／Course；P0–P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F004",
      "label": "F004 · 学年学期及教材选用批次·结构／SelectionCase",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F004 字段：学年学期及教材选用批次·结构／SelectionCase；P0–P1；教务处当期正式通知+教学任务 → 文号/学期；P1；无当期通知 POLICY_UNCONFIRMED；不能复制旧截止。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F004；原稿类型及阶段：F004；学年学期及教材选用批次·结构／SelectionCase；P0–P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F005",
      "label": "F005 · 培养学段/身份类别·枚举／Course",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F005 字段：培养学段/身份类别·枚举／Course；P0；教务/研究生院课程主数据 → 学段字段；P1；未知则停本科规则外推 POLICY_UNCONFIRMED。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F005；原稿类型及阶段：F005；培养学段/身份类别·枚举／Course；P0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F006",
      "label": "F006 · 开课/课程归属学院·组织 ID／Course",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F006 字段：开课/课程归属学院·组织 ID／Course；P0；学校组织与开课记录 → 单位 ID；P1；多学院不同归属 CONFLICT；不可由上传者选择审批单位。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F006；原稿类型及阶段：F006；开课/课程归属学院·组织 ID／Course；P0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F007",
      "label": "F007 · 当期教学任务标识/状态、任务内教材指定信息·ID+状态+引用／TeachingTask",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F007 字段：当期教学任务标识/状态、任务内教材指定信息·ID+状态+引用／TeachingTask；P0–P1；教学任务书/可信教务记录 → 任务行、学期、“教材指定”栏；SRC-010 仅证明该批流程有此栏；P1；无任务记录 SOURCE_UNAVAILABLE 或人工核；任务指定与拟选教材不一致报 CONFLICT，两者都不自动构成选用批准。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F007；原稿类型及阶段：F007；当期教学任务标识/状态、任务内教材指定信息·ID+状态+引用／TeachingTask；P0–P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F008",
      "label": "F008 · 发起教师/团队成员受信身份·ID 集／Actor",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F008 字段：发起教师/团队成员受信身份·ID 集／Actor；P0–P1；人事/统一身份+任务关联 → 权威主体 ID；P2；单纯姓名/签名图 NEEDS_HUMAN_DECISION 核权。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F008；原稿类型及阶段：F008；发起教师/团队成员受信身份·ID 集／Actor；P0–P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F009",
      "label": "F009 · 发起角色（任课/团队/学院经办）·枚举／Actor",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F009 字段：发起角色（任课/团队/学院经办）·枚举／Actor；P1；任务角色及授权列表 → 岗位/团队记录；P2；无法证实角色，视无审批权；非教师申请资格待核。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F009；原稿类型及阶段：F009；发起角色（任课/团队/学院经办）·枚举／Actor；P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F010",
      "label": "F010 · 代理授权主体/范围/期限·结构／Delegation",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F010 字段：代理授权主体/范围/期限·结构／Delegation；P1 条件；组织授权、签发机关 → 委托记录；P2；无代理则 NOT_APPLICABLE；自称代办不采信。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F010；原稿类型及阶段：F010；代理授权主体/范围/期限·结构／Delegation；P1 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F011",
      "label": "F011 · 适用课程教学大纲标识/版次·ID+版本／Syllabus",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F011 字段：适用课程教学大纲标识/版次·ID+版本／Syllabus；P0–P1；归口学院审定大纲 → 文号/版次/页；P1；缺校本有效版 SOURCE_UNAVAILABLE；不能用旧课件替代。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F011；原稿类型及阶段：F011；适用课程教学大纲标识/版次·ID+版本／Syllabus；P0–P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F012",
      "label": "F012 · 候选教材/资料条目键·ID／MaterialItem",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F012 字段：候选教材/资料条目键·ID／MaterialItem；P1；受信案卷条目+书目/文件归属 → 行 ID；P1；首报按条目建立；多书不能混作一个“教材”。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F012；原稿类型及阶段：F012；候选教材/资料条目键·ID／MaterialItem；P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F013",
      "label": "F013 · 实际用途（指定主/辅/参考/不选/通常教学资料/教材化）·枚举／Usage",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F013 字段：实际用途（指定主/辅/参考/不选/通常教学资料/教材化）·枚举／Usage；P1；教师意向+主管分类确认 → 计划表行；P1；用途不明 POLICY_UNCONFIRMED，不能凭扩展名裁定。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F013；原稿类型及阶段：F013；实际用途（指定主/辅/参考/不选/通常教学资料/教材化）·枚举／Usage；P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F014",
      "label": "F014 · 载体类别（纸书/译本/影印/数字教材/课件/讲义等）·枚举／MaterialItem",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F014 字段：载体类别（纸书/译本/影印/数字教材/课件/讲义等）·枚举／MaterialItem；P1；原件与出版信息 → 题名页/文件首页；P1；有实物难分类则人工；确属不选教材时 NOT_APPLICABLE。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F014；原稿类型及阶段：F014；载体类别（纸书/译本/影印/数字教材/课件/讲义等）·枚举／MaterialItem；P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F015",
      "label": "F015 · 题名/教材名称·字符串／Bibliography",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F015 字段：题名/教材名称·字符串／Bibliography；P1 条件；题名页、版权页、出版目录 → 具体页；P0/P1；非书材料可用文件标题；书名冲突 CONFLICT。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F015；原稿类型及阶段：F015；题名/教材名称·字符串／Bibliography；P1 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F016",
      "label": "F016 · ISBN/书号·字符串／Bibliography",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F016 字段：ISBN/书号·字符串／Bibliography；P1 条件；版权页/出版社正版书目 → 具体行；P0；纸质出版物缺证明 NEEDS_MATERIAL 或目录源断开；自制教案 NOT_APPLICABLE。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F016；原稿类型及阶段：F016；ISBN/书号·字符串／Bibliography；P1 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F017",
      "label": "F017 · 作者/编者、出版社/出版机构·结构／Bibliography",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F017 字段：作者/编者、出版社/出版机构·结构／Bibliography；P1 条件；版权页/出版社记录 → 题名版权页；P0/P1；仅 OCR 无法识别 UNREADABLE；自编未出版不虚构出版社。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F017；原稿类型及阶段：F017；作者/编者、出版社/出版机构·结构／Bibliography；P1 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F018",
      "label": "F018 · 版次、出版年、印次及修订说明·结构／Edition",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F018 字段：版次、出版年、印次及修订说明·结构／Edition；P1 条件；版权页、电子版本声明 → 页/版本；P0/P1；版本不可比对 CONFLICT/待补；绝不从书名推断最新版。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F018；原稿类型及阶段：F018；版次、出版年、印次及修订说明·结构／Edition；P1 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F019",
      "label": "F019 · 境内/境外来源、语种、译本/影印标志·枚举组／Edition",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F019 字段：境内/境外来源、语种、译本/影印标志·枚举组／Edition；P1 条件；出版信息/原件/版权说明 → 版权页；P1；不能确定境外性质则 POLICY_UNCONFIRMED 并送教材主管。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F019；原稿类型及阶段：F019；境内/境外来源、语种、译本/影印标志·枚举组／Edition；P1 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F020",
      "label": "F020 · 内容存放位置/数字资源 URL·定位符／Content",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F020 字段：内容存放位置/数字资源 URL·定位符／Content；P1 条件；校方存储/原件或受信网页 → URI/页段；P2；失联 SOURCE_UNAVAILABLE；链接需要含访问时版本快照。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F020；原稿类型及阶段：F020；内容存放位置/数字资源 URL·定位符／Content；P1 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F021",
      "label": "F021 · 内容指纹、来源版本与 OCR 可读状态·结构／ContentVersion",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F021 字段：内容指纹、来源版本与 OCR 可读状态·结构／ContentVersion；P1 后每次变化；受信材料存储/处理日志 → hash+页范围；P2；不可读 UNREADABLE；新旧指纹不一致先锁定变更影响。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F021；原稿类型及阶段：F021；内容指纹、来源版本与 OCR 可读状态·结构／ContentVersion；P1 后每次变化；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F022",
      "label": "F022 · 使用课程/班级、章节与时间范围·集合／Usage",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F022 字段：使用课程/班级、章节与时间范围·集合／Usage；P1；教学任务+教师用途说明 → 班级/章节行；P1；权威教学任务不覆盖的班级 CONFLICT；范围未明确请求说明。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F022；原稿类型及阶段：F022；使用课程/班级、章节与时间范围·集合／Usage；P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F023",
      "label": "F023 · 教材与大纲适配/选用理由·文本／Rationale",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F023 字段：教材与大纲适配/选用理由·文本／Rationale；P1；任课教师/团队提交 → 申报段落；P1/P2；无说明可请求补充；理由是否充分保留人工。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F023；原稿类型及阶段：F023；教材与大纲适配/选用理由·文本／Rationale；P1；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F024",
      "label": "F024 · 不选用教材的具体理由·文本／NoTextbook",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F024 字段：不选用教材的具体理由·文本／NoTextbook；P1 条件；教师/团队 → 不选用申报行；P1；仅 SC-06 当前候选，未交则 NEEDS_MATERIAL；学校表单是否必填待核。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F024；原稿类型及阶段：F024；不选用教材的具体理由·文本／NoTextbook；P1 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F025",
      "label": "F025 · 马工程适配条件（真/假/未知）·三值／PolicyApplicability",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F025 字段：马工程适配条件（真/假/未知）·三值／PolicyApplicability；P1–P4；课程映射+教务主管认定 → 适用记录；P1；不可判定为 POLICY_UNCONFIRMED，非“假”。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F025；原稿类型及阶段：F025；马工程适配条件（真/假/未知）·三值／PolicyApplicability；P1–P4；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F026",
      "label": "F026 · 当期马工程目录版本/对应教材·结构／PolicyCatalog",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F026 字段：当期马工程目录版本/对应教材·结构／PolicyCatalog；P1–P4 条件；学校教务处/权威目录 → 目录版本、书目行；P0/P1；来源失联 SOURCE_UNAVAILABLE；旧目录不得硬裁定。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F026；原稿类型及阶段：F026；当期马工程目录版本/对应教材·结构／PolicyCatalog；P1–P4 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F027",
      "label": "F027 · 境内教材无法满足需要的说明·文本／ForeignJustification",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F027 字段：境内教材无法满足需要的说明·文本／ForeignJustification；P1 条件；任课教师提出、学院审查 → 论证段；P2；SC-04 缺说明 NEEDS_MATERIAL，实质必要性人工审。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F027；原稿类型及阶段：F027；境内教材无法满足需要的说明·文本／ForeignJustification；P1 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F028",
      "label": "F028 · 上次选用正式决定引用及版本·ID／PriorDecision",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F028 字段：上次选用正式决定引用及版本·ID／PriorDecision；P1/P7 条件；学校审批备案档案 → 决定/课程/学期/版次；P1/P2；若主张已批准却无法核，SOURCE_UNAVAILABLE；不默认已审。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F028；原稿类型及阶段：F028；上次选用正式决定引用及版本·ID／PriorDecision；P1/P7 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F029",
      "label": "F029 · 基层初审/普通课堂材料审核备案意见·结构／UnitReview",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F029 字段：基层初审/普通课堂材料审核备案意见·结构／UnitReview；P2 后生；基层组织记录 → 组织/时间/条目版本；P2；P1 尚未到达该阶段时不执行该规则；到责任阶段待人工，不能误记 NOT_APPLICABLE。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F029；原稿类型及阶段：F029；基层初审/普通课堂材料审核备案意见·结构／UnitReview；P2 后生；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F030",
      "label": "F030 · 境外教材专家指定和校内外身份·集合／ExpertAppointment",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F030 字段：境外教材专家指定和校内外身份·集合／ExpertAppointment；P3 后生；学院指定文件/专家名册 → 指定记录；P2；不能由教师自称指定；数量/外部身份冲突 CONFLICT。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F030；原稿类型及阶段：F030；境外教材专家指定和校内外身份·集合／ExpertAppointment；P3 后生；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F031",
      "label": "F031 · 境外教材专家书面审读结论·集合／ExpertReview",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F031 字段：境外教材专家书面审读结论·集合／ExpertReview；P3 后生；指定专家签发意见 → 每人意见版本；P2；P1 不缺；P3 未形成由学院待办，非教师补件。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F031；原稿类型及阶段：F031；境外教材专家书面审读结论·集合／ExpertReview；P3 后生；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F032",
      "label": "F032 · 学院党委政治审查意见·结构／CollegeReview",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F032 字段：学院党委政治审查意见·结构／CollegeReview；P4 后生；学院党组织受信记录 → 意见/版次；P2/P3；不由 AI 代判；签发不明 NEEDS_HUMAN_DECISION。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F032；原稿类型及阶段：F032；学院党委政治审查意见·结构／CollegeReview；P4 后生；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F033",
      "label": "F033 · 学院学术分委员会学术意见·结构／CollegeReview",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F033 字段：学院学术分委员会学术意见·结构／CollegeReview；P4 后生；学术分委员会受信记录 → 意见/版次；P2；单人批注不能替代集体意见。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F033；原稿类型及阶段：F033；学院学术分委员会学术意见·结构／CollegeReview；P4 后生；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F034",
      "label": "F034 · 学院集体审核会议/书面意见关联·ID／CollectiveReview",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F034 字段：学院集体审核会议/书面意见关联·ID／CollectiveReview；P4 后生；学院会议/归档文件 → 会议/意见记录；P2；无组织记录仍待学院决策。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F034；原稿类型及阶段：F034；学院集体审核会议/书面意见关联·ID／CollectiveReview；P4 后生；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F035",
      "label": "F035 · 学院党政负责人签署及职务验证·结构／Signature",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F035 字段：学院党政负责人签署及职务验证·结构／Signature；P4 后生；签发机关/组织任职档案 → 签署位置；P2；OCR 姓名无权威比对不得签核通过。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F035；原稿类型及阶段：F035；学院党政负责人签署及职务验证·结构／Signature；P4 后生；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F036",
      "label": "F036 · 选用/不选用计划表条目及导出版本·ID／SelectionPlan",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F036 字段：选用/不选用计划表条目及导出版本·ID／SelectionPlan；P4 后生；教务系统正式导出 → 表名/行/导出时间；P1/P2；教师首报不得强迫上传系统导出；归口学院待办。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F036；原稿类型及阶段：F036；选用/不选用计划表条目及导出版本·ID／SelectionPlan；P4 后生；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F037",
      "label": "F037 · 公示编号、内容、起讫及状态·结构／Notice",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F037 字段：公示编号、内容、起讫及状态·结构／Notice；P5 后生；教务处公示/校档案 → 原链接/文号；P0/P1；公示源失联 SOURCE_UNAVAILABLE，不推定结束/无异议。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F037；原稿类型及阶段：F037；公示编号、内容、起讫及状态·结构／Notice；P5 后生；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F038",
      "label": "F038 · 异议受理、处理及复核状态·结构／Objection",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F038 字段：异议受理、处理及复核状态·结构／Objection；P5/P7 条件；主管部门受理及处理档案 → 受理号；P2/P3；无可核“无异议”证明时 POLICY_UNCONFIRMED/待人工核。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F038；原稿类型及阶段：F038；异议受理、处理及复核状态·结构／Objection；P5/P7 条件；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F039",
      "label": "F039 · 校教材建设与选用委员会批准结果·结构／Decision",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F039 字段：校教材建设与选用委员会批准结果·结构／Decision；P6 后生；正式校级决定 → 文号/条目/版本；P1/P2；无源不作批准，NEEDS_HUMAN_DECISION。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F039；原稿类型及阶段：F039；校教材建设与选用委员会批准结果·结构／Decision；P6 后生；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F040",
      "label": "F040 · 校级备案归档记录·ID／Filing",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F040 字段：校级备案归档记录·ID／Filing；P6 后生；教务处/委员会备案 → 归档号；P1/P2；未取得档案时保持待核，不能假造“已备案”。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F040；原稿类型及阶段：F040；校级备案归档记录·ID／Filing；P6 后生；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F041",
      "label": "F041 · 新旧资料版本关联、受影响项·结构／Revision",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F041 字段：新旧资料版本关联、受影响项·结构／Revision；P1/P7 变更时；案卷存储+教师差异说明 → 版本对照行；P2；缺变更对象则先澄清，旧意见不迁移。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F041；原稿类型及阶段：F041；新旧资料版本关联、受影响项·结构／Revision；P1/P7 变更时；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F042",
      "label": "F042 · 撤回受理/重审/替换正式状态·结构／CaseTransition",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F042 字段：撤回受理/重审/替换正式状态·结构／CaseTransition；P7 后生；原有权机构决定/受理记录 → 文号/状态；P2/P3；教师愿望不等于机关受理或撤销；未知路径标 POLICY_UNCONFIRMED。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F042；原稿类型及阶段：F042；撤回受理/重审/替换正式状态·结构／CaseTransition；P7 后生；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F043",
      "label": "F043 · 研究生选用汇总条目/学院审核措辞·结构／GraduateSelectionRow",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F043 字段：研究生选用汇总条目/学院审核措辞·结构／GraduateSelectionRow；P1/P4 存在公开表时、P7 引用旧记录；研究生院发布表或有权课程管理档案 → 文档页/课程行/批次/发布版本；SRC-011；P1/P2；无当前表时 SOURCE_UNAVAILABLE 或批次未核 POLICY_UNCONFIRMED；“学院合格”不是最终校级批准。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F043；原稿类型及阶段：F043；研究生选用汇总条目/学院审核措辞·结构／GraduateSelectionRow；P1/P4 存在公开表时、P7 引用旧记录；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F044",
      "label": "F044 · 教学项目归属（普通本科/研究生/中外合作/继续教育等）·枚举＋受信归口／Program",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F044 字段：教学项目归属（普通本科/研究生/中外合作/继续教育等）·枚举＋受信归口／Program；P0；学校项目、学籍/培养与开课主数据 → 项目 ID/授权部门；SRC-011/012；P1；项目身份不能凭封面语种猜测；来源失联 SOURCE_UNAVAILABLE，不同归属冲突 CONFLICT。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F044；原稿类型及阶段：F044；教学项目归属（普通本科/研究生/中外合作/继续教育等）·枚举＋受信归口／Program；P0；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F045",
      "label": "F045 · 当前专门制度版本、适用范围与签发主体·结构／ApplicablePolicy",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F045 字段：当前专门制度版本、适用范围与签发主体·结构／ApplicablePolicy；P0–P7；学校规章库、教务处/研究生院/国际教育学院授权决定 → 文号/原件/施行和废止条款；P1/P2；完整制度不可核 POLICY_UNCONFIRMED；不得默认为普通本科审批链。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F045；原稿类型及阶段：F045；当前专门制度版本、适用范围与签发主体·结构／ApplicablePolicy；P0–P7；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F046",
      "label": "F046 · 课堂材料是否被正式指定作为教材使用·三值＋依据／UsageClassification",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F046 字段：课堂材料是否被正式指定作为教材使用·三值＋依据／UsageClassification；P1/P2，用途变更在 P7；任课计划/课程大纲＋学生使用方式＋有权学院教材主管认定 → 指定通知/流转记录；SRC-006 第32条；P1/P2；无法分类 POLICY_UNCONFIRMED，不能靠 PDF/PPT 后缀或收费与否单独判定。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F046；原稿类型及阶段：F046；课堂材料是否被正式指定作为教材使用·三值＋依据／UsageClassification；P1/P2，用途变更在 P7；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F047",
      "label": "F047 · 纸本/内容逻辑版本与扫描上传版本的区别·结构／ContentIdentity",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F047 字段：纸本/内容逻辑版本与扫描上传版本的区别·结构／ContentIdentity；P1/P7；权威书目版次、原件内容页特征/哈希、扫描 hash 及原件链 → 指纹映射；P2；单纯重扫描不必自动宣告教材改版；无法核实内容同一 CONFLICT/UNREADABLE。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F047；原稿类型及阶段：F047；纸本/内容逻辑版本与扫描上传版本的区别·结构／ContentIdentity；P1/P7；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F048",
      "label": "F048 · 课程过程资料清单、抽查与整改状态·结构／CourseAudit",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F048 字段：课程过程资料清单、抽查与整改状态·结构／CourseAudit；P2/P7 只在实际检查/课程周期结束时；基层教学组织/学院督导存档 → 清单号、检查日、目标材料版次、整改回执；SRC-002/013；P2；没有学院具体清单不得教师首报强制交 M030；本周期尚未触发则 NOT_STARTED_FUTURE。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F048；原稿类型及阶段：F048；课程过程资料清单、抽查与整改状态·结构／CourseAudit；P2/P7 只在实际检查/课程周期结束时；不自行猜测阈值或校方数据接口。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 核当期课程、任务与归口",
      "purpose": "教务处/学院；教学任务书或受信课程任务记录；P0–P1 当前必需事实；权威教学任务服务或正式任务书；F001–F007,F022；SRC-001/002/010；课程代码+学期+学院+任务号，若任务有“教材指定”栏须关联；系统失联 SOURCE_UNAVAILABLE，教师截图仅临时待核；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "教务处/学院；教学任务书或受信课程任务记录；P0–P1 当前必需事实；权威教学任务服务或正式任务书；F001–F007,F022；SRC-001/002/010"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "M002 · 核课程大纲与教材适配",
      "purpose": "课程归属学院；审定的教学大纲/课程主数据；P0–P1 当前必需事实；学院正式大纲档案（不强制教师上传）；F003,F011,F023；SRC-002 第 10–12 条；保留大纲版次/审定单位/页；拿不到权威版即 SOURCE_UNAVAILABLE，不能用课件替代；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "课程归属学院；审定的教学大纲/课程主数据；P0–P1 当前必需事实；学院正式大纲档案（不强制教师上传）；F003,F011,F023；SRC-002 第 10–12 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "M003 · 核提报/经办可信身份",
      "purpose": "人事、统一身份、学院；教学团队/委托授权记录；P0–P1 当前必需事实，代理才条件增补；组织核验的授权证明；F008–F010；SRC-001/002；本人 ID 和有效任务关联；自填姓名/扫描签名冲突 CONFLICT，不得授签权；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "人事、统一身份、学院；教学团队/委托授权记录；P0–P1 当前必需事实，代理才条件增补；组织核验的授权证明；F008–F010；SRC-001/002"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M004",
      "name": "M004 · 核具体书目出版身份",
      "purpose": "任课教师提供书目，出版社/馆藏权威事实可回查；题名/版权页及正版目录；P1 选用图书时条件必需；出版社有效目录或可核版权页；F012,F014–F019；SRC-001；精确题名、出版社、ISBN（适用时）、版次；OCR 不清 UNREADABLE，目录矛盾 CONFLICT；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "任课教师提供书目，出版社/馆藏权威事实可回查；题名/版权页及正版目录；P1 选用图书时条件必需；出版社有效目录或可核版权页；F012,F014–F019；SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M005",
      "name": "M005 · 核选用内容、资源范围与审读对象",
      "purpose": "教师/学院持有教材样本、目录、可读正版内容或数字教材访问快照；P1 条件必需（有拟用教材时需可审读对象；全本交付方式待校方）；有权访问的正式样本/存档替代重复上传，摘要不能替代有权审读；F012,F020–F022；SRC-001；内容指纹、页/章节/链接快照；不可读 UNREADABLE，涉密不得强制上传公开端；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "教师/学院持有教材样本、目录、可读正版内容或数字教材访问快照；P1 条件必需（有拟用教材时需可审读对象；全本交付方式待校方）；有权访问的正式样本/存档替代重复上传，摘要不能替代有权审读；F012,F020–F022；SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M006",
      "name": "M006 · 核选用用途与课程适配说明",
      "purpose": "任课教师/团队；选用提案/课程适配说明；P1 当前必要说明，具体表单字段待核；有权教务系统已提交的同义申报；F013,F022,F023；SRC-001/002；绑定课程和条目版次；无说明 NEEDS_MATERIAL 或表单规则未明 POLICY_UNCONFIRMED；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "任课教师/团队；选用提案/课程适配说明；P1 当前必要说明，具体表单字段待核；有权教务系统已提交的同义申报；F013,F022,F023；SRC-001/002"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M007",
      "name": "M007 · 核当期马工程目录和课程对应",
      "purpose": "教务处/上位授权机构；当期重点教材书目、课程匹配记录；P1–P4 条件必需，应由主管源提供；当前目录检索系统/主管确认，不接受教师自造名单；F025,F026；SRC-001；目录生效批次、版本、书目行；旧表不可当新目录，失联 SOURCE_UNAVAILABLE；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "教务处/上位授权机构；当期重点教材书目、课程匹配记录；P1–P4 条件必需，应由主管源提供；当前目录检索系统/主管确认，不接受教师自造名单；F025,F026；SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M008",
      "name": "M008 · 核既有选用审核与版本",
      "purpose": "学校教材选用批准/备案部门；旧批准档案；P1/P7 条件必需（主张“沿用已审”或改动已批对象）；正式决定记录回读，不要求申请人重复上传；F028,F039,F040；SRC-001/005；锁定旧课程/学期/版次；无权威记录不得复用，SOURCE_UNAVAILABLE；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "学校教材选用批准/备案部门；旧批准档案；P1/P7 条件必需（主张“沿用已审”或改动已批对象）；正式决定记录回读，不要求申请人重复上传；F028,F039,F040；SRC-001/005"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M009",
      "name": "M009 · 核境外教材必要性",
      "purpose": "任课教师/团队；境内材料不足及选用必要性说明；P1 境外条件必需；正式境外教材论证表中的同等说明（附件原体待核）；F019,F027；SRC-001 第 2 页；说明需对应译本/版次；缺说明 NEEDS_MATERIAL，充分性由学院/专家判断；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "任课教师/团队；境内材料不足及选用必要性说明；P1 境外条件必需；正式境外教材论证表中的同等说明（附件原体待核）；F019,F027；SRC-001 第 2 页"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M010",
      "name": "M010 · 核不选教材的申报意思",
      "purpose": "任课教师/团队；不选用教材申报信息与理由；P1 不选用路径条件必需；受信教务系统“不选用”记录；F013,F024；SRC-001 第 3 页；单一课程/批次；不得拿空白选用计划推定“不选用”；理由字段法定性待核；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "任课教师/团队；不选用教材申报信息与理由；P1 不选用路径条件必需；受信教务系统“不选用”记录；F013,F024；SRC-001 第 3 页"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M011",
      "name": "M011 · 核基层教学组织初审",
      "purpose": "基层教学组织负责人；初审意见/记录；P2 后续才产生；正式组织审查台账或盖章原件回核；F029；SRC-001；需列教材条目版本和机构；教师首报时仅标未来阶段未执行，到阶段待组织履职；非境外教材不需 M012/M013 才是 NOT_APPLICABLE；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "基层教学组织负责人；初审意见/记录；P2 后续才产生；正式组织审查台账或盖章原件回核；F029；SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M012",
      "name": "M012 · 核境外审读专家正式指定",
      "purpose": "归属学院；2 位专业专家指定记录、校外身份佐证；P3 境外路径后续才产生；学院聘请/指定和专家所属单位受信记录；F030；SRC-001；两名且至少一名校外属本科通知要求；人选与意见不一致 CONFLICT；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "归属学院；2 位专业专家指定记录、校外身份佐证；P3 境外路径后续才产生；学院聘请/指定和专家所属单位受信记录；F030；SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M013",
      "name": "M013 · 核境外专家书面审读",
      "purpose": "已指定专家/学院归档；独立书面意见；P3 境外路径后续才产生；学院正式保存的两份意见，不许 AI 审读摘要替代；F031；SRC-001；每份绑定专家、课程、材料版本；缺任一意见由学院待办，非教师 NEEDS_MATERIAL；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "已指定专家/学院归档；独立书面意见；P3 境外路径后续才产生；学院正式保存的两份意见，不许 AI 审读摘要替代；F031；SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M014",
      "name": "M014 · 核政治把关",
      "purpose": "学院党委/党总支；政治审核书面意见；P4 教材选用后续才产生；真实组织会议/签发档案；F032；SRC-001；签发/日期与所审版本绑定；不能从敏感内容 AI 评分替代；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "学院党委/党总支；政治审核书面意见；P4 教材选用后续才产生；真实组织会议/签发档案；F032；SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M015",
      "name": "M015 · 核学术把关",
      "purpose": "学院学术分委员会；学术审核意见；P4 教材选用后续才产生；委员会正式档案；F033；SRC-001；机构/对象及版本需一致；个人评语不是集体意见；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "学院学术分委员会；学术审核意见；P4 教材选用后续才产生；委员会正式档案；F033；SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M016",
      "name": "M016 · 核学院集体审核形成",
      "purpose": "学院；会议纪要/书面审核意见/审核计划联系；P4 后续才产生；学院形成的书面意见正式件；F034；SRC-001；会议/意见号、适用书目列表；缺组织记录待学院决定；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "学院；会议纪要/书面审核意见/审核计划联系；P4 后续才产生；学院形成的书面意见正式件；F034；SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M017",
      "name": "M017 · 核学院党政负责人签署",
      "purpose": "学院党政负责人/归档机构；签字盖章意见；P4 后续才产生；可回核的签发原件或可信电子签章；F035；SRC-001；签署人职位时效/印章/行版本；截图无认证则 NEEDS_HUMAN_DECISION；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "学院党政负责人/归档机构；签字盖章意见；P4 后续才产生；可回核的签发原件或可信电子签章；F035；SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M018",
      "name": "M018 · 核学院报送的教材计划",
      "purpose": "学院教务经办/教务处；系统导出的选用与不选用审核计划表；P4 后续才产生，选/不选按情形；教务系统已导出记录或院报送盖章件；F036,F004；SRC-001；区分两种表、批次、导出时间和行；首报不能强迫教师生成；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "学院教务经办/教务处；系统导出的选用与不选用审核计划表；P4 后续才产生，选/不选按情形；教务系统已导出记录或院报送盖章件；F036,F004；SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M019",
      "name": "M019 · 核教务处汇总公示",
      "purpose": "教务处；正式公示原文、附件和时间记录；P5 后续才产生；校方公示链接/归档文件；F037；SRC-001；公示列表必须指向本案条目/版次；页面失联 SOURCE_UNAVAILABLE；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "教务处；正式公示原文、附件和时间记录；P5 后续才产生；校方公示链接/归档文件；F037；SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M020",
      "name": "M020 · 核异议与处理",
      "purpose": "教务处/法定受理或复核机关；异议材料及处置记录；P5/P7 条件必需/后续才产生；有权机关受理台账、匿名化处理记录；F038,F042；SRC-001 公示节点；原件隐私 P2/P3，确认有无异议的权威状态；不能时间到即视为无异议；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "教务处/法定受理或复核机关；异议材料及处置记录；P5/P7 条件必需/后续才产生；有权机关受理台账、匿名化处理记录；F038,F042；SRC-001 公示节点"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M021",
      "name": "M021 · 核最终有权选用审批",
      "purpose": "校教材建设与选用委员会；正式批准/不批准决定；P6 后续才产生；受信校级审批决定/原签发回核；F039；SRC-001；课程、学期、版次及决定主体齐；未形成只显示待决定；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "校教材建设与选用委员会；正式批准/不批准决定；P6 后续才产生；受信校级审批决定/原签发回核；F039；SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M022",
      "name": "M022 · 核审批后备案",
      "purpose": "校级委员会/教务处档案；备案号/档案；P6 后续才产生；正式归档系统记录；F040；SRC-001；备案与批准同一对象版本；缺备案不能由系统虚构；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "校级委员会/教务处档案；备案号/档案；P6 后续才产生；正式归档系统记录；F040；SRC-001"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M023",
      "name": "M023 · 核通常课堂材料与用途",
      "purpose": "任课教师/课程组；讲义、教案、课件、教学计划/日历等；P1 课堂材料路径当前必需；教材化路径按适用；有效的校内教学平台原件或课程归档件；F012–F014,F020–F023；SRC-002 第 12 条；逐文档指纹/章节/大纲对应；无法读取 UNREADABLE，不要求教务处审核表首报；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "任课教师/课程组；讲义、教案、课件、教学计划/日历等；P1 课堂材料路径当前必需；教材化路径按适用；有效的校内教学平台原件或课程归档件；F012–F014,F020–F023；SRC-002 第 12 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M024",
      "name": "M024 · 核普通课堂材料组织审核备案",
      "purpose": "基层教学组织/学院；审查记录/备案账；P2 后续才产生；具体义务频次待校规；由组织持有的检查/备案档案；F029,F034；SRC-002 第 25 条；资料版次、机构和日期；不能照搬教材校级审批流程；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "基层教学组织/学院；审查记录/备案账；P2 后续才产生；具体义务频次待校规；由组织持有的检查/备案档案；F029,F034；SRC-002 第 25 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M025",
      "name": "M025 · 核补件、改版、撤回及受理",
      "purpose": "原提报人+受理机构；变更前后对照/补件说明、撤回意思、复核/重审决定；P7 条件必需，受理/决定子件后续才产生；原案变更记录及机构受理决定；F041,F042；SRC-001/002（仅依据版本流程背景，具体校规待核）；对受影响条目新建版本链；原件不删；未得校方受理时 POLICY_UNCONFIRMED；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "原提报人+受理机构；变更前后对照/补件说明、撤回意思、复核/重审决定；P7 条件必需，受理/决定子件后续才产生；原案变更记录及机构受理决定；F041,F042；SRC-001/002（仅依据版本流程背景，具体校规待核）"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M026",
      "name": "M026 · 核授权影印、翻译或数字传播的权利事实",
      "purpose": "出版社/权利人或学院；可核授权书/合法来源信息；P1 仅在声称授权/争议触发时条件取证；学校是否列为选用必交件待核；出版社可核授权标识、合同有效摘要；F017,F019,F020；SRC-001/005；权利文件限权，核期限与适用版次；无法核不等于行政不批准，由专业人员处理；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "出版社/权利人或学院；可核授权书/合法来源信息；P1 仅在声称授权/争议触发时条件取证；学校是否列为选用必交件待核；出版社可核授权标识、合同有效摘要；F017,F019,F020；SRC-001/005"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M027",
      "name": "M027 · 研究生当期选用表的公开行或主管台账",
      "purpose": "研究生院/培养单位；课程-书目-学院审核汇总及原记录；P1/P4/P7 仅在研究生情形、有适用批次发布时；非教师首报强制上传；官方表或受信课程教材台账；F002,F004,F016–F018,F043；R033；SRC-011；一行一课程/教材/年度、保存页码；公开“合格”仍是院级意见；无新批次 SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "研究生院/培养单位；课程-书目-学院审核汇总及原记录；P1/P4/P7 仅在研究生情形、有适用批次发布时；非教师首报强制上传；官方表或受信课程教材台账；F002,F004,F016–F018,F043；R033；SRC-011"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M028",
      "name": "M028 · 研究生教材有权选用决定/复核原档",
      "purpose": "研究生院/培养单位/实际授权选用机构；正式办理、审批、异议记录；只有校方确认有此程序并实际到阶段才取，绝非本科 P6 默认必件；授权机关正式记录回读；F039,F042,F043,F045；R034；SRC-006/011；保留目的、学段、课程、版次和签发方；学院意见不可推定为最终决定，源不开放 SOURCE_UNAVAILABLE；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "研究生院/培养单位/实际授权选用机构；正式办理、审批、异议记录；只有校方确认有此程序并实际到阶段才取，绝非本科 P6 默认必件；授权机关正式记录回读；F039,F042,F043,F045；R034；SRC-006/011"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M029",
      "name": "M029 · 中外合作/其他特殊项目现行教材办法原文与主管确认",
      "purpose": "国际教育学院、教务处及实际有权机构；2026 专门办法、适用项目、执行通知；P0 发现项目分支即由制度持有人取证；不是教师补件；学校正式规章库 PDF、签发机关确认；F044,F045,F046；R032,R036；SRC-012；当前仅有目录标题，条款不可核 POLICY_UNCONFIRMED；不得以历史校本本科通知填空；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "国际教育学院、教务处及实际有权机构；2026 专门办法、适用项目、执行通知；P0 发现项目分支即由制度持有人取证；不是教师补件；学校正式规章库 PDF、签发机关确认；F044,F045,F046；R032,R036；SRC-012"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M030",
      "name": "M030 · 课程教学过程材料清单、督导抽查及整改闭环",
      "purpose": "基层教学组织/学院/督导；周期材料清单、抽查报告、整改回执；P2/P7 在课程周期末或检查事件真实发生后形成，P1 不预缺；学校或学院正式归档条目；F021,F029,F048；R035；SRC-002/013；保留被检课件 M023@sourceVersion、检查时间、问题/回执；尚无各学院通行表单 POLICY_UNCONFIRMED；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 10,
      "requiredElements": [
        "基层教学组织/学院/督导；周期材料清单、抽查报告、整改回执；P2/P7 在课程周期末或检查事件真实发生后形成，P1 不预缺；学校或学院正式归档条目；F021,F029,F048；R035；SRC-002/013"
      ],
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "evidence-checks",
      "name": "R02 原稿规则逐条核验",
      "description": "依据原稿 T01-T04 §08 的全部独立 R 条目。触发未知不能当不适用；后续材料不视为起案缺件，SRC 仅为研究索引。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "R001 · P0 学段与本科路径适用性",
          "requirement": "R001 R001 P0 学段与本科路径适用性；SRC-001/002/004；F005；M001；A 课程学段映射 vs 课程性质；SRC-001 仅本科当批，研究生不得套用；T 本科→PASS_FACT（教务处）；F 非本科→本规则 NOT_APPLICABLE 并触发 SC-10 的 POLICY_UNCONFIRMED 路由待办（研究生院）；U 权威学段失联→SOURCE_UNAVAILABLE（教务/研究生院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R002",
          "title": "R002 · P0/P1 当期选用批次、有效通知与截止属性",
          "requirement": "R002 R002 P0/P1 当期选用批次、有效通知与截止属性；SRC-001/007/008；F004；M001,M018（后续表单仅到报送阶段比对）；A 当期教务通知文号/用途/学期/截止，2025 批次截止不外推；公选课开设截止≠教材选用截止；首报未形成 M018 不报缺；T 本科教材批次→已核对应批次事实 PASS_FACT；批次/截止不匹配 CONFLICT（教务处）；F 普通课堂日常资料→NOT_APPLICABLE；U 当前公告未得→POLICY_UNCONFIRMED（教务处）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R003",
          "title": "R003 · P0 课程、归属学院与教学任务对应",
          "requirement": "R003 R003 P0 课程、归属学院与教学任务对应；SRC-001/010；F002,F003,F006,F007,F022；M001；A 课程代码+学期+单位+教师/班级任务行；同名不同 ID 不合并；版本按该学期任务锁定；T 有任务→一致 PASS_FACT、不符 CONFLICT（教务处/学院）；F 非本校课程→NOT_APPLICABLE 并另行路由；U A 源失联→SOURCE_UNAVAILABLE（教学运行部门）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "R004 · P0/P1 提报教师及代理身份真实性",
          "requirement": "R004 R004 P0/P1 提报教师及代理身份真实性；SRC-001/010；F008–F010；M001,M003；A 身份会话+岗位/团队名单+委托范围/期限；D 自填姓名、印章图不得授权；无代办合法免委托；T 教师/代理申报→身份属实且代理有效 PASS_FACT、相抵 CONFLICT，授权真实性仍待核 NEEDS_HUMAN_DECISION（学院人事/教务）；F 仅代理支项无代理→该子项 NOT_APPLICABLE，教师身份主核仍执行；U 授权档不可取→SOURCE_UNAVAILABLE（学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "R005 · P0/P1 所依据教学大纲的正式版",
          "requirement": "R005 R005 P0/P1 所依据教学大纲的正式版；SRC-002；F003,F011,F023；M002；A 学院审定大纲版本/课程码与拟用课程同一；D 课件不可取代有效大纲；跨学期旧版不当然无效；T 需比对课程大纲→相符 PASS_FACT、冲突 CONFLICT（开课学院）；F 不涉及课程大纲的纯状态变更支项→NOT_APPLICABLE；U 无权威大纲→SOURCE_UNAVAILABLE（学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R006",
          "title": "R006 · P1 教学任务“教材指定”与拟用用途一致性",
          "requirement": "R006 R006 P1 教学任务“教材指定”与拟用用途一致性；SRC-001/010；F007,F012,F013,F022；M001,M006,M010；A 任务中的指定教材 vs C 教师拟用条目/否定选择；任务指定不是校级选用决定；字段若在另一批不存在不推定必填；T 本批有指定记录→一致 PASS_FACT、不符 CONFLICT（课程负责人/教务处）；F 无此字段且政策不要求→NOT_APPLICABLE；U 现批字段/效力未知→POLICY_UNCONFIRMED（教务处）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R007",
          "title": "R007 · P1 “不选用教材”明确申报及事实完整性",
          "requirement": "R007 R007 P1 “不选用教材”明确申报及事实完整性；SRC-001；F013,F024,F036；M010,M018；C 教师明确不选用意思 vs 后生 A 计划表行；不得以“没有上传 ISBN”推断不选；不评价理由是否充分；T 显式不选→意思可核 PASS_FACT、缺当期明确需交的说明 NEEDS_MATERIAL（教师）；理由是否准许另由基层/学院 R016/R019 节点裁量；F 实选教材→NOT_APPLICABLE；U 申报方式/理由栏不明→POLICY_UNCONFIRMED（学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "R008 · P1 书目、ISBN、版次、出版身份与使用条目",
          "requirement": "R008 R008 P1 书目、ISBN、版次、出版身份与使用条目；SRC-001；F012,F014–F019；M004；C 版权/题名页与正版目录逐字段匹配，A 计划表后生时回核；同标题不同版不可合并；自编无 ISBN 例外；T 正式出版书→一致 PASS_FACT、不符 CONFLICT、页不可读 UNREADABLE（教师/出版社/学院）；F 不选教材或纯课件无书目→NOT_APPLICABLE；U 是否为书籍不明→POLICY_UNCONFIRMED（学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "R009 · P1 审读对象正文/数字资源可定位和可读",
          "requirement": "R009 R009 P1 审读对象正文/数字资源可定位和可读；SRC-001/002；F012,F020,F021,F022；M005,M023；C 合法可读样本、章节、hash 与访问时数字快照；可用受信原件引用，不强迫全本公开上传；涉密另行授权；T 有拟审内容→可读且归属一致 PASS_FACT，缺件/不可读/版本冲突分别 NEEDS_MATERIAL/UNREADABLE/CONFLICT（教师/学院）；F 不选且无资料→NOT_APPLICABLE；U 来源受限不可取→SOURCE_UNAVAILABLE（持有机关）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "R010 · P1 选用理由、课程适配证据存在",
          "requirement": "R010 R010 P1 选用理由、课程适配证据存在；SRC-001/002；F011,F022,F023；M002,M006；A 大纲 vs C 章节/使用范围/教师说明，只核有无可供讨论的证据；难度适宜性等教学判断由基层人工；T 拟选用→理由和大纲对照证据存在 PASS_FACT，当期确需的说明缺 NEEDS_MATERIAL（教师）；适宜性评议交 R016/R018 的真人环节；F 纯状态动作→NOT_APPLICABLE；U 当期表单要求未知→POLICY_UNCONFIRMED（教务处）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "R011 · P1/P4 马工程课程映射及当前目录",
          "requirement": "R011 R011 P1/P4 马工程课程映射及当前目录；SRC-001；F004,F025,F026,F015–F018；M007,M004；A 当期目录+有权课程映射，逐本比版次；SRC-001 附 2025.10 目录仅可用于该批；不是 AI 看课程名称归类；T 适用马工程→匹配事实 PASS_FACT，目录与拟本冲突 CONFLICT（学院/教务处）；F 主管确认不适用→NOT_APPLICABLE；U 当期目录失联/适用性未知→SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED（教材主管）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "R012 · P1 境外/翻译/影印教材性质分类",
          "requirement": "R012 R012 P1 境外/翻译/影印教材性质分类；SRC-001；F014,F017–F019,F020；M004,M005；C 出版地、授权影印/翻译及正文组成 vs 当批境外定义；中文封面不能排除；权利文件另由 R031 核；T 证明境外性质→触发 R013–R015；分类事实 PASS_FACT（学院）；F 证实普通境内→境外专审分支 NOT_APPLICABLE；U 版权页缺/定义适用不明→UNREADABLE/POLICY_UNCONFIRMED（学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R013",
          "title": "R013 · P1 境外教材选用必要性说明存在",
          "requirement": "R013 R013 P1 境外教材选用必要性说明存在；SRC-001；F019,F027,F023；M009；C 境内教材不能满足的论证与特定译本/版次相绑定；必要性充分与否须专家/学院评议；T 境外→说明在案 PASS_FACT、确需说明却缺件 NEEDS_MATERIAL（教师）；是否充分由 R015/R019 对应专家/学院真人审读；F 境内→NOT_APPLICABLE；U 分类不清承接 R012 待核（学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R014",
          "title": "R014 · P3 境外专家指定、人数与校外身份",
          "requirement": "R014 R014 P3 境外专家指定、人数与校外身份；SRC-001；F030,F019；M012；B 学院指定两名相关专家（≥1 校外），校内外身份从任职/聘请单位回核；仅针对有直接依据的本科通知批次；T 境外且已到 P3→两名含校外真实 PASS_FACT、不足或冲突 CONFLICT/组织待办 NEEDS_HUMAN_DECISION（学院）；F 境内→NOT_APPLICABLE；U 专家名单源失联→SOURCE_UNAVAILABLE（学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "R015 · P3 境外专家书面审读意见及对象绑定",
          "requirement": "R015 R015 P3 境外专家书面审读意见及对象绑定；SRC-001；F019,F030,F031,F021；M012,M013,M005；B 两名指定专家各自签发意见，匹配同一待审版次；AI 政治/内容总结不可代签；T 境外且到 P3→书面记录可核 PASS_FACT、未形成 NEEDS_HUMAN_DECISION（学院指定专家）；F 非境外→NOT_APPLICABLE；U 签发真伪/版次不明→CONFLICT/SOURCE_UNAVAILABLE（学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R016",
          "title": "R016 · P2 基层教学组织初审真实性",
          "requirement": "R016 R016 P2 基层教学组织初审真实性；SRC-001；F006,F029,F021；M011,M005；B 本学院基层负责人组织的初审记录、对象版次；教师单方“已审”不采信；在 P1 not-run；T 本科教材且到 P2→初审事实可核 PASS_FACT、未办理 NEEDS_HUMAN_DECISION（基层）；F 非教材路径→NOT_APPLICABLE；U 组织记录不可回核→SOURCE_UNAVAILABLE（基层/学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "R017 · P4 学院党组织政治把关记录",
          "requirement": "R017 R017 P4 学院党组织政治把关记录；SRC-001；F032,F021,F006；M014,M005；B 党委/党总支正式意见对准当期版本；模型风险标签只能提示，不参与政治结论；学院机关有效性需回核；T 本科教材且到 P4→记录成立 PASS_FACT、未形成 NEEDS_HUMAN_DECISION（学院党委）；F 普通课件→NOT_APPLICABLE；U 签发无法认证→SOURCE_UNAVAILABLE/CONFLICT（学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "R018 · P4 学院学术分委员会学术审核记录",
          "requirement": "R018 R018 P4 学院学术分委员会学术审核记录；SRC-001；F033,F021；M015,M005；B 学术分委员会意见+条目版本，个人批注不能代委员会结论；学术评价留人工；T 本科教材且到 P4→记录对应 PASS_FACT、尚待形成 NEEDS_HUMAN_DECISION（学术分委员会）；F 普通课件→NOT_APPLICABLE；U 委员会权限失联→SOURCE_UNAVAILABLE（学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "R019 · P4 学院集体审核及书面汇总意见",
          "requirement": "R019 R019 P4 学院集体审核及书面汇总意见；SRC-001；F034,F032,F033；M014–M016；B 学院会议/书面意见串联政治、学术环节；跨页表内书目必须逐条对应，不能以单个教师签名替代集体审核；T 本科教材且到 P4→已形成有效关联 PASS_FACT、未形成 NEEDS_HUMAN_DECISION（学院）；F 纯课件→NOT_APPLICABLE；U 书面意见缺原签发回核→SOURCE_UNAVAILABLE（学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R020",
          "title": "R020 · P4 学院党政负责人签署身份和权限",
          "requirement": "R020 R020 P4 学院党政负责人签署身份和权限；SRC-001；F006,F035；M003,M017；A 任职/岗位有效期+B 原签发记录+版次/计划行，D 签名图片不足证明本人；T 报送学院意见→职务及签章可核 PASS_FACT、冒名/单位错 CONFLICT（学院组织/教务）；F 非院级报送→NOT_APPLICABLE；U 任职/真章无法回核→SOURCE_UNAVAILABLE（签发单位）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R021",
          "title": "R021 · P4 选用／不选用计划表与教材逐项归属",
          "requirement": "R021 R021 P4 选用／不选用计划表与教材逐项归属；SRC-001；F004,F012,F013,F036；M018,M004,M010；A 教务系统导出两类计划表，按课程批次行与 C 首报逐项比，导出版本受控；教师 P1 不执行；T 到学院报送→行/意向一致 PASS_FACT、差异 CONFLICT、组织尚未导出 NEEDS_HUMAN_DECISION（学院）；F 普通课件→NOT_APPLICABLE；U 导出原件失联→SOURCE_UNAVAILABLE（教务处）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "R022 · P5 教务处公示范围及对象/时点",
          "requirement": "R022 R022 P5 教务处公示范围及对象/时点；SRC-001；F037,F004,F012,F021；M019,M018；A 教务处正式公示链接/档案+起讫+列表行+同一版本；只核公示事实，公示≠批准；T 已报送待公示→可核本案 PASS_FACT、未公示 NEEDS_HUMAN_DECISION（教务处）；F 普通课件→NOT_APPLICABLE；U 公示页断链且档案取不到→SOURCE_UNAVAILABLE（教务处）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "R023 · P5/P7 公示异议及处理终了状态",
          "requirement": "R023 R023 P5/P7 公示异议及处理终了状态；SRC-001；F037,F038,F042；M019,M020；A 教务处受理/办理台账，不能以“过了公示结束日期”代替无异议；具体时限/复核程序未取得；T 处于公示/有异议→处理状态可核 PASS_FACT、待处理 NEEDS_HUMAN_DECISION（有权受理单位）；F 经主管确认无异议且无后续异议支项→NOT_APPLICABLE 于异议处理支项；U 状态源失联→SOURCE_UNAVAILABLE（教务处）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R024",
          "title": "R024 · P6 校教材建设与选用委员会真实决定",
          "requirement": "R024 R024 P6 校教材建设与选用委员会真实决定；SRC-001；F039,F004,F012,F021；M021,M019；A 委员会正式签发/可回核决议，绑定课程+学期+教材版本+目的；若决定“不批准”只记录真实决定，不等同事实核验失败；T 进入 P6→决议在案且签发真实 PASS_FACT、仍待决 NEEDS_HUMAN_DECISION（校委员会）；F 纯课件→NOT_APPLICABLE；U 决定档案失联→SOURCE_UNAVAILABLE（有权档案部门）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R025",
          "title": "R025 · P6 批准后备案与批准对象一致",
          "requirement": "R025 R025 P6 批准后备案与批准对象一致；SRC-001；F039,F040,F012；M021,M022；A 备案条目与已出具的委员会决定在课程/版次/批次上相同；若无决定不得单凭备案号认批准；T 有校级决定且备案环节到达→一致 PASS_FACT、版次不同 CONFLICT、待备案 NEEDS_HUMAN_DECISION（教务处/校委员会）；F 未到备案阶段/纯课件→未到不执行/纯课件 NOT_APPLICABLE；U 档案失联→SOURCE_UNAVAILABLE。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R026",
          "title": "R026 · P1/P2 普通课件/教案与大纲、用途及可读版对应",
          "requirement": "R026 R026 P1/P2 普通课件/教案与大纲、用途及可读版对应；SRC-002；F011–F014,F020–F023；M002,M023；A 审定大纲+C 课件原件的章节/版本/实际用途；不是以扩展名判教材；普通教案无需假设 ISBN；T 普通教学资料→版本与范围可核 PASS_FACT、无法读取 UNREADABLE、用途矛盾 CONFLICT（任课教师/基层）；F 纯教材选用另由 R009/010→NOT_APPLICABLE；U 用途不清→POLICY_UNCONFIRMED（学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R027",
          "title": "R027 · P2 普通课堂材料审核备案事实",
          "requirement": "R027 R027 P2 普通课堂材料审核备案事实；SRC-002；F029,F034,F021；M024,M023；B 基层/学院按其现行制度形成审核/备案记录，需绑定课件版本；校本规范证实制度要求但未给全校统一表头/频次；T 到组织实际审核节点→记录在案 PASS_FACT、待形成 NEEDS_HUMAN_DECISION（基层）；F 教材选用路径→NOT_APPLICABLE；U 学院办理要求/频次未核→POLICY_UNCONFIRMED（学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R028",
          "title": "R028 · P1/P7 已有正式决定的用途、版本和批次可复用性",
          "requirement": "R028 R028 P1/P7 已有正式决定的用途、版本和批次可复用性；SRC-001/003/005；F028,F039,F040,F012,F021；M008,M021,M022；A 旧决定的 decisionPurpose+course+semester+materialVersion 完整比对；拟出版教材的独立评审决定（SRC-003）或其他课程选用决定绝不等价；不得错误写成 R02 T01-T05；T 声称已审批/换版→旧决定事实存在且覆盖旧目标 PASS_FACT、目的/版本错 CONFLICT；当期是否免审另开教务处人工待办，不复用 PASS_FACT 为新批准；F 首次且无沿用主张→NOT_APPLICABLE；U 旧档案失联→SOURCE_UNAVAILABLE。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R029",
          "title": "R029 · P7 变更对象、依赖图和旧意见覆盖边界",
          "requirement": "R029 R029 P7 变更对象、依赖图和旧意见覆盖边界；SRC-001/002（版本约束为研究合同）；F012,F021,F031–F041；M004,M005,M013–M025（仅受影响引用）；A/B/C 比较旧新 hash、版次、章节和批注目标；旧意见历史有效性不被技术系统撤销，仅新版本未覆盖；重公示门槛无校本依据；T 内容/版次已变→依赖关系可核 PASS_FACT 并重算受影响 R，程序是否重走 NEEDS_HUMAN_DECISION（原审核主体）；F hash/语义对象一致→NOT_APPLICABLE 于重审分支；U 差异范围不可读→UNREADABLE/POLICY_UNCONFIRMED（学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R030",
          "title": "R030 · P7 撤回/复核请求与机关正式受理/决定分离",
          "requirement": "R030 R030 P7 撤回/复核请求与机关正式受理/决定分离；SRC-001（公示节点）；F001,F008–F010,F037–F042；M003,M020,M025；A 机构受理/复核结论 vs C 申请人撤回意思，分别版本记录；学校撤回、复议资格/时限暂无原文，不能技术撤销既有公示/批准；T 提交请求→收到申请事实 PASS_FACT，能否受理、撤销、复核 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION（原有权机关）；F 无请求→NOT_APPLICABLE；U 机关回执源失联→SOURCE_UNAVAILABLE（受理单位）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "R031 · P1 权利授权主张的可核来源",
          "requirement": "R031 R031 P1 权利授权主张的可核来源；SRC-001/005（仅版权/用途背景，非校本必交授权书条款）；F017,F019,F020；M026；C 出版社/权利人授权说明或合法公开目录核版次/期限/传播范围；数字平台访问受限需依法操作，不擅取敏感原文；T 对翻译/影印/传播合法授权提出具体主张或存在争议→事实可回核 PASS_FACT、证据冲突 CONFLICT、法律实质待权利及校方专业人员；F 无授权主张/争议→NOT_APPLICABLE；U 是否应交、何种授权有效未知→POLICY_UNCONFIRMED（教材主管/法务）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "R032 · P0 特殊项目是否需要独立选用制度",
          "requirement": "R032 R032 P0 特殊项目是否需要独立选用制度；SRC-012/006；F005,F044,F045；M001,M029；A 课程/项目主数据先于名称、语种、学校合作标识；2026 中外合作办法全文未核，不造部门链；T 中外合作/其他专门项目→项目归属事实成立 PASS_FACT，制度适用仍 POLICY_UNCONFIRMED（国际教育学院及有权教材主管）；F 确证普通课程→NOT_APPLICABLE；U 项目主数据失联→SOURCE_UNAVAILABLE（项目主管），不能默认普通本科。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R033",
          "title": "R033 · P1/P4/P7 研究生选用公开行和拟用书目同一性",
          "requirement": "R033 R033 P1/P4/P7 研究生选用公开行和拟用书目同一性；SRC-011；F002,F004,F012,F015–F018,F043；M004,M027；A 研究生院当学期公布的课程代码/教材类别/ISBN/版次/学院意见逐行对照；若是 2026 秋不得拿 2026 春列表自动覆盖；同一课程多行需逐条对应；T 研究生且有适用表行→书目事实一致 PASS_FACT、矛盾 CONFLICT（培养单位/研究生院），仅行事实匹配；F 本科/无此公示行的路径→NOT_APPLICABLE 于“公开表行比较”，不得推定不用审；U 当期列表失联 SOURCE_UNAVAILABLE 或是否须公示不明 POLICY_UNCONFIRMED（研究生院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R034",
          "title": "R034 · P7 研究生学院意见是否被误作最终授权决定",
          "requirement": "R034 R034 P7 研究生学院意见是否被误作最终授权决定；SRC-011/006；F039,F042,F043,F045；M027,M028；A 逐项对齐 decisionPurpose+issuer+course+term+itemVersion+officialOutcome；M027 的“学院审核意见合格”只为学院层事实，研究生完整签发链需校方补证；T 有人主张“已最终获批”→若仅有学院列则 NEEDS_HUMAN_DECISION 由研究生教材主管确认；不一致 CONFLICT，真实最终档案可核才 PASS_FACT；F 不主张最终审批→NOT_APPLICABLE；U 决定档案源失联→SOURCE_UNAVAILABLE。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R035",
          "title": "R035 · P2/P7 课程周期末资料清单和抽查整改对象绑定",
          "requirement": "R035 R035 P2/P7 课程周期末资料清单和抽查整改对象绑定；SRC-002/013 第25条；F021,F029,F048；M023,M024,M030；A/B 组织正式清单/抽查/整改意见绑定课程与被查课件版本；本校规范规定建立过程材料清单及学校抽查，但没有统一审查表号、频次；T 真实检查/周期结束且相关制度适用→证据对应 PASS_FACT、差异 CONFLICT、整改待真人确认 NEEDS_HUMAN_DECISION（基层/督导）；F 当前周期未到/未发生抽查→不执行未来支项；U 学院具体范围未核→POLICY_UNCONFIRMED（学院）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R036",
          "title": "R036 · P1/P2 教学资料的“教材化”用途分类事实",
          "requirement": "R036 R036 P1/P2 教学资料的“教材化”用途分类事实；SRC-002/006 第12、25条及国家办法第32条；F013,F014,F022,F046；M002,M006,M023,M029（特殊项目条件）；A/C 课程教学计划是否指定学生以其作为教材、章程实际用途、基层/教材主管确认；文件名、PPT/PDF 格式、是否收费均非单独定性依据；T 明确指定作为教材→用途事实 PASS_FACT 并触发相关选用程序是否适用的人工核定（教务处/学院）；F 明确普通演示资料→教材选用分支 NOT_APPLICABLE，仍可跑 R026/027；U 用途争议→POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION（教材主管）。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "R037",
          "title": "R037 · P7 重扫描与实质换版能否区分",
          "requirement": "R037 R037 P7 重扫描与实质换版能否区分；SRC-001/002（版本设计约束）；F018,F021,F041,F047；M004,M005,M023,M025；C 已核版权页/章页内容/逻辑版次与扫描文件指纹分别比较；既要记录新上传字节 hash，又要证明被审内容是否改变；T 发生重传→逻辑同一且可核 PASS_FACT（只重审此前不可读字段）、实质变化 PASS_FACT（明确变化事实，交 R029 的影响图）、相抵 CONFLICT；F 无重传→NOT_APPLICABLE；U 无法确定逻辑同一→UNREADABLE 或 NEEDS_HUMAN_DECISION（原审查主体），绝不自动延用旧意见。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "intake",
      "name": "建案与事项/材料归属定位（不代表校方受理）",
      "kind": "auto-check",
      "executorRole": "system",
      "nextStageId": "evidence-review",
      "workflowOwner": "local"
    },
    {
      "id": "evidence-review",
      "name": "原稿 R001 起各条独立事实核验与条件异常分流",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "intake",
      "nextStageId": "human-confirmation",
      "workflowOwner": "local"
    },
    {
      "id": "human-confirmation",
      "name": "现行政策、办理权限及正式决定仅交有权人员确认",
      "kind": "handoff",
      "executorRole": "teacher",
      "returnToStageId": "evidence-review",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "review-summary",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "missing-evidence",
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

export const r02Metadata = {
  "templateId": "T01-T04",
  "name": "教材选用与课堂教学资料审查",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T01-T04.md",
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/T01-T04.md",
  "sourceDocumentBytes": 146284,
  "sourceDocumentSha256": "902df6b9d551c734ea7a176c1d3ca800bed23cca47d194d60950d06244150ddb",
  "sourceHashBasis": "dispatch manifest SHA-256; exact original Git blob bytes plus one LF (LINE_ENDING_DRIFT_ONE_LF)",
  "reviewedDocumentSha256": "b92602270c193661f74a43d2dd3f2b1f64cf270ab7e1dfb81c7c27dace44e661",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyStatusRaw": "PARTIALLY_VERIFIED",
  "policyEvidenceStatus": "PARTIAL",
  "criteria": [
    {
      "sectionId": "evidence-checks",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "fieldIds": [
        "F005"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R001 P0 学段与本科路径适用性；SRC-001/002/004；F005；M001；A 课程学段映射 vs 课程性质；SRC-001 仅本科当批，研究生不得套用；T 本科→PASS_FACT（教务处）；F 非本科→本规则 NOT_APPLICABLE 并触发 SC-10 的 POLICY_UNCONFIRMED 路由待办（研究生院）；U 权威学段失联→SOURCE_UNAVAILABLE（教务/研究生院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001",
        "SRC-007",
        "SRC-008"
      ],
      "fieldIds": [
        "F004"
      ],
      "materialSlotIds": [
        "M001",
        "M018"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R002 P0/P1 当期选用批次、有效通知与截止属性；SRC-001/007/008；F004；M001,M018（后续表单仅到报送阶段比对）；A 当期教务通知文号/用途/学期/截止，2025 批次截止不外推；公选课开设截止≠教材选用截止；首报未形成 M018 不报缺；T 本科教材批次→已核对应批次事实 PASS_FACT；批次/截止不匹配 CONFLICT（教务处）；F 普通课堂日常资料→NOT_APPLICABLE；U 当前公告未得→POLICY_UNCONFIRMED（教务处）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F002",
        "F003",
        "F006",
        "F007",
        "F022"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R003 P0 课程、归属学院与教学任务对应；SRC-001/010；F002,F003,F006,F007,F022；M001；A 课程代码+学期+单位+教师/班级任务行；同名不同 ID 不合并；版本按该学期任务锁定；T 有任务→一致 PASS_FACT、不符 CONFLICT（教务处/学院）；F 非本校课程→NOT_APPLICABLE 并另行路由；U A 源失联→SOURCE_UNAVAILABLE（教学运行部门）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F008",
        "F009",
        "F010"
      ],
      "materialSlotIds": [
        "M001",
        "M003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R004 P0/P1 提报教师及代理身份真实性；SRC-001/010；F008–F010；M001,M003；A 身份会话+岗位/团队名单+委托范围/期限；D 自填姓名、印章图不得授权；无代办合法免委托；T 教师/代理申报→身份属实且代理有效 PASS_FACT、相抵 CONFLICT，授权真实性仍待核 NEEDS_HUMAN_DECISION（学院人事/教务）；F 仅代理支项无代理→该子项 NOT_APPLICABLE，教师身份主核仍执行；U 授权档不可取→SOURCE_UNAVAILABLE（学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F003",
        "F011",
        "F023"
      ],
      "materialSlotIds": [
        "M002"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R005 P0/P1 所依据教学大纲的正式版；SRC-002；F003,F011,F023；M002；A 学院审定大纲版本/课程码与拟用课程同一；D 课件不可取代有效大纲；跨学期旧版不当然无效；T 需比对课程大纲→相符 PASS_FACT、冲突 CONFLICT（开课学院）；F 不涉及课程大纲的纯状态变更支项→NOT_APPLICABLE；U 无权威大纲→SOURCE_UNAVAILABLE（学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001",
        "SRC-010"
      ],
      "fieldIds": [
        "F007",
        "F012",
        "F013",
        "F022"
      ],
      "materialSlotIds": [
        "M001",
        "M006",
        "M010"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R006 P1 教学任务“教材指定”与拟用用途一致性；SRC-001/010；F007,F012,F013,F022；M001,M006,M010；A 任务中的指定教材 vs C 教师拟用条目/否定选择；任务指定不是校级选用决定；字段若在另一批不存在不推定必填；T 本批有指定记录→一致 PASS_FACT、不符 CONFLICT（课程负责人/教务处）；F 无此字段且政策不要求→NOT_APPLICABLE；U 现批字段/效力未知→POLICY_UNCONFIRMED（教务处）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F013",
        "F024",
        "F036"
      ],
      "materialSlotIds": [
        "M010",
        "M018"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R007 P1 “不选用教材”明确申报及事实完整性；SRC-001；F013,F024,F036；M010,M018；C 教师明确不选用意思 vs 后生 A 计划表行；不得以“没有上传 ISBN”推断不选；不评价理由是否充分；T 显式不选→意思可核 PASS_FACT、缺当期明确需交的说明 NEEDS_MATERIAL（教师）；理由是否准许另由基层/学院 R016/R019 节点裁量；F 实选教材→NOT_APPLICABLE；U 申报方式/理由栏不明→POLICY_UNCONFIRMED（学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F012",
        "F014",
        "F015",
        "F016",
        "F017",
        "F018",
        "F019"
      ],
      "materialSlotIds": [
        "M004"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R008 P1 书目、ISBN、版次、出版身份与使用条目；SRC-001；F012,F014–F019；M004；C 版权/题名页与正版目录逐字段匹配，A 计划表后生时回核；同标题不同版不可合并；自编无 ISBN 例外；T 正式出版书→一致 PASS_FACT、不符 CONFLICT、页不可读 UNREADABLE（教师/出版社/学院）；F 不选教材或纯课件无书目→NOT_APPLICABLE；U 是否为书籍不明→POLICY_UNCONFIRMED（学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F012",
        "F020",
        "F021",
        "F022"
      ],
      "materialSlotIds": [
        "M005",
        "M023"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R009 P1 审读对象正文/数字资源可定位和可读；SRC-001/002；F012,F020,F021,F022；M005,M023；C 合法可读样本、章节、hash 与访问时数字快照；可用受信原件引用，不强迫全本公开上传；涉密另行授权；T 有拟审内容→可读且归属一致 PASS_FACT，缺件/不可读/版本冲突分别 NEEDS_MATERIAL/UNREADABLE/CONFLICT（教师/学院）；F 不选且无资料→NOT_APPLICABLE；U 来源受限不可取→SOURCE_UNAVAILABLE（持有机关）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F011",
        "F022",
        "F023"
      ],
      "materialSlotIds": [
        "M002",
        "M006"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R010 P1 选用理由、课程适配证据存在；SRC-001/002；F011,F022,F023；M002,M006；A 大纲 vs C 章节/使用范围/教师说明，只核有无可供讨论的证据；难度适宜性等教学判断由基层人工；T 拟选用→理由和大纲对照证据存在 PASS_FACT，当期确需的说明缺 NEEDS_MATERIAL（教师）；适宜性评议交 R016/R018 的真人环节；F 纯状态动作→NOT_APPLICABLE；U 当期表单要求未知→POLICY_UNCONFIRMED（教务处）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F004",
        "F015",
        "F016",
        "F017",
        "F018",
        "F025",
        "F026"
      ],
      "materialSlotIds": [
        "M004",
        "M007"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R011 P1/P4 马工程课程映射及当前目录；SRC-001；F004,F025,F026,F015–F018；M007,M004；A 当期目录+有权课程映射，逐本比版次；SRC-001 附 2025.10 目录仅可用于该批；不是 AI 看课程名称归类；T 适用马工程→匹配事实 PASS_FACT，目录与拟本冲突 CONFLICT（学院/教务处）；F 主管确认不适用→NOT_APPLICABLE；U 当期目录失联/适用性未知→SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED（教材主管）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F014",
        "F017",
        "F018",
        "F019",
        "F020"
      ],
      "materialSlotIds": [
        "M004",
        "M005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R012 P1 境外/翻译/影印教材性质分类；SRC-001；F014,F017–F019,F020；M004,M005；C 出版地、授权影印/翻译及正文组成 vs 当批境外定义；中文封面不能排除；权利文件另由 R031 核；T 证明境外性质→触发 R013–R015；分类事实 PASS_FACT（学院）；F 证实普通境内→境外专审分支 NOT_APPLICABLE；U 版权页缺/定义适用不明→UNREADABLE/POLICY_UNCONFIRMED（学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F019",
        "F023",
        "F027"
      ],
      "materialSlotIds": [
        "M009"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R013 P1 境外教材选用必要性说明存在；SRC-001；F019,F027,F023；M009；C 境内教材不能满足的论证与特定译本/版次相绑定；必要性充分与否须专家/学院评议；T 境外→说明在案 PASS_FACT、确需说明却缺件 NEEDS_MATERIAL（教师）；是否充分由 R015/R019 对应专家/学院真人审读；F 境内→NOT_APPLICABLE；U 分类不清承接 R012 待核（学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F019",
        "F030"
      ],
      "materialSlotIds": [
        "M012"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R014 P3 境外专家指定、人数与校外身份；SRC-001；F030,F019；M012；B 学院指定两名相关专家（≥1 校外），校内外身份从任职/聘请单位回核；仅针对有直接依据的本科通知批次；T 境外且已到 P3→两名含校外真实 PASS_FACT、不足或冲突 CONFLICT/组织待办 NEEDS_HUMAN_DECISION（学院）；F 境内→NOT_APPLICABLE；U 专家名单源失联→SOURCE_UNAVAILABLE（学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F019",
        "F021",
        "F030",
        "F031"
      ],
      "materialSlotIds": [
        "M005",
        "M012",
        "M013"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R015 P3 境外专家书面审读意见及对象绑定；SRC-001；F019,F030,F031,F021；M012,M013,M005；B 两名指定专家各自签发意见，匹配同一待审版次；AI 政治/内容总结不可代签；T 境外且到 P3→书面记录可核 PASS_FACT、未形成 NEEDS_HUMAN_DECISION（学院指定专家）；F 非境外→NOT_APPLICABLE；U 签发真伪/版次不明→CONFLICT/SOURCE_UNAVAILABLE（学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F006",
        "F021",
        "F029"
      ],
      "materialSlotIds": [
        "M005",
        "M011"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R016 P2 基层教学组织初审真实性；SRC-001；F006,F029,F021；M011,M005；B 本学院基层负责人组织的初审记录、对象版次；教师单方“已审”不采信；在 P1 not-run；T 本科教材且到 P2→初审事实可核 PASS_FACT、未办理 NEEDS_HUMAN_DECISION（基层）；F 非教材路径→NOT_APPLICABLE；U 组织记录不可回核→SOURCE_UNAVAILABLE（基层/学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F006",
        "F021",
        "F032"
      ],
      "materialSlotIds": [
        "M005",
        "M014"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R017 P4 学院党组织政治把关记录；SRC-001；F032,F021,F006；M014,M005；B 党委/党总支正式意见对准当期版本；模型风险标签只能提示，不参与政治结论；学院机关有效性需回核；T 本科教材且到 P4→记录成立 PASS_FACT、未形成 NEEDS_HUMAN_DECISION（学院党委）；F 普通课件→NOT_APPLICABLE；U 签发无法认证→SOURCE_UNAVAILABLE/CONFLICT（学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F021",
        "F033"
      ],
      "materialSlotIds": [
        "M005",
        "M015"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R018 P4 学院学术分委员会学术审核记录；SRC-001；F033,F021；M015,M005；B 学术分委员会意见+条目版本，个人批注不能代委员会结论；学术评价留人工；T 本科教材且到 P4→记录对应 PASS_FACT、尚待形成 NEEDS_HUMAN_DECISION（学术分委员会）；F 普通课件→NOT_APPLICABLE；U 委员会权限失联→SOURCE_UNAVAILABLE（学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F032",
        "F033",
        "F034"
      ],
      "materialSlotIds": [
        "M014",
        "M015",
        "M016"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R019 P4 学院集体审核及书面汇总意见；SRC-001；F034,F032,F033；M014–M016；B 学院会议/书面意见串联政治、学术环节；跨页表内书目必须逐条对应，不能以单个教师签名替代集体审核；T 本科教材且到 P4→已形成有效关联 PASS_FACT、未形成 NEEDS_HUMAN_DECISION（学院）；F 纯课件→NOT_APPLICABLE；U 书面意见缺原签发回核→SOURCE_UNAVAILABLE（学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F006",
        "F035"
      ],
      "materialSlotIds": [
        "M003",
        "M017"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R020 P4 学院党政负责人签署身份和权限；SRC-001；F006,F035；M003,M017；A 任职/岗位有效期+B 原签发记录+版次/计划行，D 签名图片不足证明本人；T 报送学院意见→职务及签章可核 PASS_FACT、冒名/单位错 CONFLICT（学院组织/教务）；F 非院级报送→NOT_APPLICABLE；U 任职/真章无法回核→SOURCE_UNAVAILABLE（签发单位）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F004",
        "F012",
        "F013",
        "F036"
      ],
      "materialSlotIds": [
        "M004",
        "M010",
        "M018"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R021 P4 选用／不选用计划表与教材逐项归属；SRC-001；F004,F012,F013,F036；M018,M004,M010；A 教务系统导出两类计划表，按课程批次行与 C 首报逐项比，导出版本受控；教师 P1 不执行；T 到学院报送→行/意向一致 PASS_FACT、差异 CONFLICT、组织尚未导出 NEEDS_HUMAN_DECISION（学院）；F 普通课件→NOT_APPLICABLE；U 导出原件失联→SOURCE_UNAVAILABLE（教务处）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F004",
        "F012",
        "F021",
        "F037"
      ],
      "materialSlotIds": [
        "M018",
        "M019"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R022 P5 教务处公示范围及对象/时点；SRC-001；F037,F004,F012,F021；M019,M018；A 教务处正式公示链接/档案+起讫+列表行+同一版本；只核公示事实，公示≠批准；T 已报送待公示→可核本案 PASS_FACT、未公示 NEEDS_HUMAN_DECISION（教务处）；F 普通课件→NOT_APPLICABLE；U 公示页断链且档案取不到→SOURCE_UNAVAILABLE（教务处）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F037",
        "F038",
        "F042"
      ],
      "materialSlotIds": [
        "M019",
        "M020"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R023 P5/P7 公示异议及处理终了状态；SRC-001；F037,F038,F042；M019,M020；A 教务处受理/办理台账，不能以“过了公示结束日期”代替无异议；具体时限/复核程序未取得；T 处于公示/有异议→处理状态可核 PASS_FACT、待处理 NEEDS_HUMAN_DECISION（有权受理单位）；F 经主管确认无异议且无后续异议支项→NOT_APPLICABLE 于异议处理支项；U 状态源失联→SOURCE_UNAVAILABLE（教务处）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F004",
        "F012",
        "F021",
        "F039"
      ],
      "materialSlotIds": [
        "M019",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R024 P6 校教材建设与选用委员会真实决定；SRC-001；F039,F004,F012,F021；M021,M019；A 委员会正式签发/可回核决议，绑定课程+学期+教材版本+目的；若决定“不批准”只记录真实决定，不等同事实核验失败；T 进入 P6→决议在案且签发真实 PASS_FACT、仍待决 NEEDS_HUMAN_DECISION（校委员会）；F 纯课件→NOT_APPLICABLE；U 决定档案失联→SOURCE_UNAVAILABLE（有权档案部门）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F012",
        "F039",
        "F040"
      ],
      "materialSlotIds": [
        "M021",
        "M022"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R025 P6 批准后备案与批准对象一致；SRC-001；F039,F040,F012；M021,M022；A 备案条目与已出具的委员会决定在课程/版次/批次上相同；若无决定不得单凭备案号认批准；T 有校级决定且备案环节到达→一致 PASS_FACT、版次不同 CONFLICT、待备案 NEEDS_HUMAN_DECISION（教务处/校委员会）；F 未到备案阶段/纯课件→未到不执行/纯课件 NOT_APPLICABLE；U 档案失联→SOURCE_UNAVAILABLE"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F011",
        "F012",
        "F013",
        "F014",
        "F020",
        "F021",
        "F022",
        "F023"
      ],
      "materialSlotIds": [
        "M002",
        "M023"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R026 P1/P2 普通课件/教案与大纲、用途及可读版对应；SRC-002；F011–F014,F020–F023；M002,M023；A 审定大纲+C 课件原件的章节/版本/实际用途；不是以扩展名判教材；普通教案无需假设 ISBN；T 普通教学资料→版本与范围可核 PASS_FACT、无法读取 UNREADABLE、用途矛盾 CONFLICT（任课教师/基层）；F 纯教材选用另由 R009/010→NOT_APPLICABLE；U 用途不清→POLICY_UNCONFIRMED（学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-002"
      ],
      "fieldIds": [
        "F021",
        "F029",
        "F034"
      ],
      "materialSlotIds": [
        "M023",
        "M024"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R027 P2 普通课堂材料审核备案事实；SRC-002；F029,F034,F021；M024,M023；B 基层/学院按其现行制度形成审核/备案记录，需绑定课件版本；校本规范证实制度要求但未给全校统一表头/频次；T 到组织实际审核节点→记录在案 PASS_FACT、待形成 NEEDS_HUMAN_DECISION（基层）；F 教材选用路径→NOT_APPLICABLE；U 学院办理要求/频次未核→POLICY_UNCONFIRMED（学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-001",
        "SRC-003",
        "SRC-005"
      ],
      "fieldIds": [
        "F012",
        "F021",
        "F028",
        "F039",
        "F040"
      ],
      "materialSlotIds": [
        "M008",
        "M021",
        "M022"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R028 P1/P7 已有正式决定的用途、版本和批次可复用性；SRC-001/003/005；F028,F039,F040,F012,F021；M008,M021,M022；A 旧决定的 decisionPurpose+course+semester+materialVersion 完整比对；拟出版教材的独立评审决定（SRC-003）或其他课程选用决定绝不等价；不得错误写成 R02 T01-T05；T 声称已审批/换版→旧决定事实存在且覆盖旧目标 PASS_FACT、目的/版本错 CONFLICT；当期是否免审另开教务处人工待办，不复用 PASS_FACT 为新批准；F 首次且无沿用主张→NOT_APPLICABLE；U 旧档案失联→SOURCE_UNAVAILABLE"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R029",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F012",
        "F021",
        "F031",
        "F032",
        "F033",
        "F034",
        "F035",
        "F036",
        "F037",
        "F038",
        "F039",
        "F040",
        "F041"
      ],
      "materialSlotIds": [
        "M004",
        "M005",
        "M013",
        "M014",
        "M015",
        "M016",
        "M017",
        "M018",
        "M019",
        "M020",
        "M021",
        "M022",
        "M023",
        "M024",
        "M025"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R029 P7 变更对象、依赖图和旧意见覆盖边界；SRC-001/002（版本约束为研究合同）；F012,F021,F031–F041；M004,M005,M013–M025（仅受影响引用）；A/B/C 比较旧新 hash、版次、章节和批注目标；旧意见历史有效性不被技术系统撤销，仅新版本未覆盖；重公示门槛无校本依据；T 内容/版次已变→依赖关系可核 PASS_FACT 并重算受影响 R，程序是否重走 NEEDS_HUMAN_DECISION（原审核主体）；F hash/语义对象一致→NOT_APPLICABLE 于重审分支；U 差异范围不可读→UNREADABLE/POLICY_UNCONFIRMED（学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R030",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F001",
        "F008",
        "F009",
        "F010",
        "F037",
        "F038",
        "F039",
        "F040",
        "F041",
        "F042"
      ],
      "materialSlotIds": [
        "M003",
        "M020",
        "M025"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R030 P7 撤回/复核请求与机关正式受理/决定分离；SRC-001（公示节点）；F001,F008–F010,F037–F042；M003,M020,M025；A 机构受理/复核结论 vs C 申请人撤回意思，分别版本记录；学校撤回、复议资格/时限暂无原文，不能技术撤销既有公示/批准；T 提交请求→收到申请事实 PASS_FACT，能否受理、撤销、复核 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION（原有权机关）；F 无请求→NOT_APPLICABLE；U 机关回执源失联→SOURCE_UNAVAILABLE（受理单位）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R031",
      "sourceIds": [
        "SRC-001",
        "SRC-005"
      ],
      "fieldIds": [
        "F017",
        "F019",
        "F020"
      ],
      "materialSlotIds": [
        "M026"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R031 P1 权利授权主张的可核来源；SRC-001/005（仅版权/用途背景，非校本必交授权书条款）；F017,F019,F020；M026；C 出版社/权利人授权说明或合法公开目录核版次/期限/传播范围；数字平台访问受限需依法操作，不擅取敏感原文；T 对翻译/影印/传播合法授权提出具体主张或存在争议→事实可回核 PASS_FACT、证据冲突 CONFLICT、法律实质待权利及校方专业人员；F 无授权主张/争议→NOT_APPLICABLE；U 是否应交、何种授权有效未知→POLICY_UNCONFIRMED（教材主管/法务）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R032",
      "sourceIds": [
        "SRC-006",
        "SRC-012"
      ],
      "fieldIds": [
        "F005",
        "F044",
        "F045"
      ],
      "materialSlotIds": [
        "M001",
        "M029"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R032 P0 特殊项目是否需要独立选用制度；SRC-012/006；F005,F044,F045；M001,M029；A 课程/项目主数据先于名称、语种、学校合作标识；2026 中外合作办法全文未核，不造部门链；T 中外合作/其他专门项目→项目归属事实成立 PASS_FACT，制度适用仍 POLICY_UNCONFIRMED（国际教育学院及有权教材主管）；F 确证普通课程→NOT_APPLICABLE；U 项目主数据失联→SOURCE_UNAVAILABLE（项目主管），不能默认普通本科"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R033",
      "sourceIds": [
        "SRC-011"
      ],
      "fieldIds": [
        "F002",
        "F004",
        "F012",
        "F015",
        "F016",
        "F017",
        "F018",
        "F043"
      ],
      "materialSlotIds": [
        "M004",
        "M027"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R033 P1/P4/P7 研究生选用公开行和拟用书目同一性；SRC-011；F002,F004,F012,F015–F018,F043；M004,M027；A 研究生院当学期公布的课程代码/教材类别/ISBN/版次/学院意见逐行对照；若是 2026 秋不得拿 2026 春列表自动覆盖；同一课程多行需逐条对应；T 研究生且有适用表行→书目事实一致 PASS_FACT、矛盾 CONFLICT（培养单位/研究生院），仅行事实匹配；F 本科/无此公示行的路径→NOT_APPLICABLE 于“公开表行比较”，不得推定不用审；U 当期列表失联 SOURCE_UNAVAILABLE 或是否须公示不明 POLICY_UNCONFIRMED（研究生院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R034",
      "sourceIds": [
        "SRC-006",
        "SRC-011"
      ],
      "fieldIds": [
        "F039",
        "F042",
        "F043",
        "F045"
      ],
      "materialSlotIds": [
        "M027",
        "M028"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R034 P7 研究生学院意见是否被误作最终授权决定；SRC-011/006；F039,F042,F043,F045；M027,M028；A 逐项对齐 decisionPurpose+issuer+course+term+itemVersion+officialOutcome；M027 的“学院审核意见合格”只为学院层事实，研究生完整签发链需校方补证；T 有人主张“已最终获批”→若仅有学院列则 NEEDS_HUMAN_DECISION 由研究生教材主管确认；不一致 CONFLICT，真实最终档案可核才 PASS_FACT；F 不主张最终审批→NOT_APPLICABLE；U 决定档案源失联→SOURCE_UNAVAILABLE"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R035",
      "sourceIds": [
        "SRC-002",
        "SRC-013"
      ],
      "fieldIds": [
        "F021",
        "F029",
        "F048"
      ],
      "materialSlotIds": [
        "M023",
        "M024",
        "M030"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R035 P2/P7 课程周期末资料清单和抽查整改对象绑定；SRC-002/013 第25条；F021,F029,F048；M023,M024,M030；A/B 组织正式清单/抽查/整改意见绑定课程与被查课件版本；本校规范规定建立过程材料清单及学校抽查，但没有统一审查表号、频次；T 真实检查/周期结束且相关制度适用→证据对应 PASS_FACT、差异 CONFLICT、整改待真人确认 NEEDS_HUMAN_DECISION（基层/督导）；F 当前周期未到/未发生抽查→不执行未来支项；U 学院具体范围未核→POLICY_UNCONFIRMED（学院）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R036",
      "sourceIds": [
        "SRC-002",
        "SRC-006"
      ],
      "fieldIds": [
        "F013",
        "F014",
        "F022",
        "F046"
      ],
      "materialSlotIds": [
        "M002",
        "M006",
        "M023",
        "M029"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R036 P1/P2 教学资料的“教材化”用途分类事实；SRC-002/006 第12、25条及国家办法第32条；F013,F014,F022,F046；M002,M006,M023,M029（特殊项目条件）；A/C 课程教学计划是否指定学生以其作为教材、章程实际用途、基层/教材主管确认；文件名、PPT/PDF 格式、是否收费均非单独定性依据；T 明确指定作为教材→用途事实 PASS_FACT 并触发相关选用程序是否适用的人工核定（教务处/学院）；F 明确普通演示资料→教材选用分支 NOT_APPLICABLE，仍可跑 R026/027；U 用途争议→POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION（教材主管）"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R037",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F018",
        "F021",
        "F041",
        "F047"
      ],
      "materialSlotIds": [
        "M004",
        "M005",
        "M023",
        "M025"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R037 P7 重扫描与实质换版能否区分；SRC-001/002（版本设计约束）；F018,F021,F041,F047；M004,M005,M023,M025；C 已核版权页/章页内容/逻辑版次与扫描文件指纹分别比较；既要记录新上传字节 hash，又要证明被审内容是否改变；T 发生重传→逻辑同一且可核 PASS_FACT（只重审此前不可读字段）、实质变化 PASS_FACT（明确变化事实，交 R029 的影响图）、相抵 CONFLICT；F 无重传→NOT_APPLICABLE；U 无法确定逻辑同一→UNREADABLE 或 NEEDS_HUMAN_DECISION（原审查主体），绝不自动延用旧意见"
    }
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "SRC-001；CDUT-VERIFIED／成都理工大学教务处；《关于开展2025-2026学年第二学期本科教材选用工作的通知》，教通字〔2025〕53号，PDF 第 1–4 页，尤见第 2–3 页“选用流程”；https://aao.cdut.edu.cn/__local/0/ED/56/CB90963982195FFAE2D567BE233_B542FB74_29258.pdf；文件落款 2025-11-18；批次报送截止 2025-12-26；未载持续性废止日期，属特定学期通知",
      "url": "https://aao.cdut.edu.cn/__local/0/ED/56/CB90963982195FFAE2D567BE233_B542FB74_29258.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-002",
      "title": "SRC-002；CDUT-VERIFIED／成都理工大学；《成都理工大学本科课程教学基本规范》，成理校教〔2022〕11号，第 9–14、17–18、25、43 条；学校学院公开《本科规章制度汇编》PDF 约第 19–25 页；https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf；2022-06-04 发布，规定自印发施行、废止 2018 版教师本科教学工作规范；2026 是否有后续修订待复核",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-003",
      "title": "SRC-003；CDUT-VERIFIED／成都理工大学教务处；《关于组织开展2026年拟出版教材评审（第一批）的通知》，第二部分及材料报送；https://aao.cdut.edu.cn/info/1171/6964.htm；2026-03-20 发布，本批材料报送截止 2026-04-15；无持续性废止信息",
      "url": "https://aao.cdut.edu.cn/info/1171/6964.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-004",
      "title": "SRC-004；CURRENTITY-UNKNOWN／成都理工大学（被正式通知引用）；《成都理工大学教材建设与管理办法》，成理校教〔2024〕18号；SRC-001 PDF 第1页、SRC-003 第1段援引；商学院规章制度目录 https://cc.cdut.edu.cn/xsgz/gzzd.htm 于 2025-03-10 列同名条目；文号确定为 2024；完整 PDF、附件、签发生效条款、2021/2018 替代关系没有读到",
      "url": "https://cc.cdut.edu.cn/xsgz/gzzd.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-005",
      "title": "SRC-005；CROSS-SCHOOL-REFERENCE／四川省教育厅制定、外校网页转载；《四川省普通高等学校教材管理实施细则》，川教〔2022〕67号转载第2、19–23、29–30条；https://www.cduestc.cn/jiaowuchu/init_3110100/detail/240801061434?from=3110122；转载页面 2022-07-29；转载文本称 2022-09-01 施行、有效期五年；截至 2026-10-23 尚未读到省厅原发件/修订公告",
      "url": "https://www.cduestc.cn/jiaowuchu/init_3110100/detail/240801061434?from=3110122",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-006",
      "title": "SRC-006；GENERAL-RESEARCH／教育部原发，普通高校全国适用；教材〔2019〕3号《普通高等学校教材管理办法》，原文入口 https://hudong.moe.gov.cn/srcsite/A26/moe_714/202001/t20200107_414578.html ；只用文内普通高校部分第18–25、29–33条；通知落款 2019-12-19，官网 2020-01-07 发布；第33条自印发之日起施行；本轮已直接打开官方全文，尚未发现可证明其整体失效的后续文本",
      "url": "https://hudong.moe.gov.cn/srcsite/A26/moe_714/202001/t20200107_414578.html",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-007",
      "title": "SRC-007；CURRENTITY-UNKNOWN／成都理工大学教务处；《关于2026-2027学年第一学期公共选修课申报的通知》，https://aao.cdut.edu.cn/info/1171/7023.htm ；搜索索引可见教材“凡选必审”且与本学期教材选用同期开展；2026-04-28，服务于 2026 秋季公选课开设申请；直接打开得到 412，附件及后续修改未核",
      "url": "https://aao.cdut.edu.cn/info/1171/7023.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-008",
      "title": "SRC-008；CURRENTITY-UNKNOWN／成都理工大学教务处；《关于开展2025-2026学年第一学期本科教材选用工作的通知》，https://aao.cdut.edu.cn/info/1171/6720.htm ；官方页面搜索全文可重现教师申报、基层初审、境外专家、学院集体审核、公示与校级审批；发文 2025-06-17；该批学院报送 2025-06-23；直接访问曾失败，附件3/4 字节未核",
      "url": "https://aao.cdut.edu.cn/info/1171/6720.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-009",
      "title": "SRC-009；CDUT-VERIFIED／成都理工大学；《关于印发〈成都理工大学教材建设和管理办法〉等文件的通知》，成理校教〔2018〕26号，含旧《教材选用与评价管理规定》，PDF 第 1–12 页；https://gra.cdut.edu.cn/1.pdf；2018-09-04；后续 2021、2024 教材制度已见正式援引，故只作历史比较，不作为现行规则",
      "url": "https://gra.cdut.edu.cn/1.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-010",
      "title": "SRC-010；CDUT-VERIFIED／成都理工大学教务处；《关于做好2025-2026学年第二学期教学任务安排及课表编排的工作通知》，教通字〔2025〕45号，PDF 第 1 页第一部分第 1–2 项；https://aao.cdut.edu.cn/__local/6/D0/6E/D73FB595B334A89DCC3AB9C55E8_B2D0E7C3_27504.pdf；2025-10-29，适用于该学期本科教学任务；无独立持续性施行/废止时间",
      "url": "https://aao.cdut.edu.cn/__local/6/D0/6E/D73FB595B334A89DCC3AB9C55E8_B2D0E7C3_27504.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-011",
      "title": "SRC-011；CDUT-VERIFIED／成都理工大学研究生院公开归档；《成都理工大学2025-2026学年第二学期研究生课程教材选用汇总表》；https://gra.cdut.edu.cn/__local/1/76/11/2D280C975243CC7633E6517EFD3_A6F8CA75_85C6B.pdf ，12 页，首表第1页；列有学院、课程代码、类别、ISBN、教材名、版次、出版社、学院审核意见；文面适用 2025–2026 春研究生课程；汇总表本身未列完整审批程序、发布日期、最终决定机关或公示异议规则",
      "url": "https://gra.cdut.edu.cn/__local/1/76/11/2D280C975243CC7633E6517EFD3_A6F8CA75_85C6B.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-012",
      "title": "SRC-012；CURRENTITY-UNKNOWN／成都理工大学国际教育学院；校内管理制度目录列《关于印发〈成都理工大学中外合作办学教材选用管理办法〉的通知》；https://cie.cdut.edu.cn/jyjx/zwhzbxgl/glzd.htm；目录显示 2026-06-05；通知正文、签发文号、施行/替代关系、项目覆盖及审批链未取得",
      "url": "https://cie.cdut.edu.cn/jyjx/zwhzbxgl/glzd.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-013",
      "title": "SRC-013；CDUT-VERIFIED／成都理工大学核技术与自动化工程学院公开编印；《本科教学管理文件汇编》（2022 年8月），https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf ，215 页；第19–25 PDF页为校本 2022《本科课程教学基本规范》，第 105–111 PDF 页为学院教师教学工作办法部分；2022 历史汇编，不代表学院 2026 版细则已核；校本课程规范的施行日期独由 SRC-002 确认",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = T01T04_TEMPLATE
