import type { TemplateVersion } from '@profer/shared'

/** Generated from the reviewed R02 research source; this is not a school-issued template. */
export const template: TemplateVersion = {
  "templateId": "T04-T07",
  "version": 1,
  "schemaVersion": 2,
  "name": "公务接待事前审批与接待责任审核",
  "description": "本地研究模板 · 非校方正式模板。用于材料事实核验、风险提示和人工复核；不构成学校正式表单、制度或批准决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；政策适用、审批权限和最终决定必须由有权人员核验，不创建政策版本。",
  "objectType": "organization",
  "displayName": {
    "template": "{{caseTitle}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "案卷主键",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F001；F001 案卷主键 | ID | Case | A–G | Main真实建案事件 | Main Case ID/创建日志 | P0 | S，不能用用户编造ID"
    },
    {
      "key": "f002",
      "label": "计划版本号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F002；F002 计划版本号 | 版本号 | Case/Plan | A–G | Main版本账 | Case版本与M001/M009哈希 | P0 | S；禁止沿用旧核验"
    },
    {
      "key": "f003",
      "label": "案件阶段",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F003；F003 案件阶段 | 枚举 | Case | A–G | Main可信状态机 | 状态事件序列 | P0 | S；不允许由前端直接赋审批成功"
    },
    {
      "key": "f004",
      "label": "申请人校内身份ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F004；F004 申请人校内身份ID | ID | Actor | A/B/D/G | Host登录认证/校方账号体系 | 认证主体记录ID，不默认身份证扫描 | P2 | S/H；不信任Renderer自填"
    },
    {
      "key": "f005",
      "label": "申请人身份/代办类型",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F005；F005 申请人身份/代办类型 | 枚举 | Actor | A/G | 校方人员/岗位/代理目录 | M004角色字段及授权记录 | P1 | S/P；学生或外部人员独立申办资格未知"
    },
    {
      "key": "f006",
      "label": "申请人组织关系",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F006；F006 申请人组织关系 | 组织ID | Actor | A/D/G | 校方组织人员目录 | M004单位隶属及有效时点 | P1 | S/H；手写部门不足以授权"
    },
    {
      "key": "f007",
      "label": "代理授权引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F007；F007 代理授权引用 | 引用ID | Actor | A/D/G条件 | 单位可信委托/授权事件 | M004授权编号、范围和有效期 | P3 | 非代理NA；代理无凭据S/H"
    },
    {
      "key": "f008",
      "label": "主承办单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F008；F008 主承办单位 | 组织ID | Reception | A/B/D | M001经办主张，校方组织责任记录核实 | M001承办栏；M006主办确认 | P1 | N/C；争议H"
    },
    {
      "key": "f009",
      "label": "主承办责任岗位/人",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F009；F009 主承办责任岗位/人 | 角色引用 | Reception | B/D | 授权岗位目录/主办确认 | M004岗位记录或M006分工 | P1 | S/P；不得猜测负责人级别"
    },
    {
      "key": "f010",
      "label": "派出/来访单位",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F010；F010 派出/来访单位 | 名称+组织引用 | Reception/Letter | A/B | M002来函，核机构后可信 | M002落款/抬头；M005辅助 | P1 | H01缺件N；名称冲突C"
    },
    {
      "key": "f011",
      "label": "公务目的和必要性说明",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F011；F011 公务目的和必要性说明 | 文本 | Reception | A/B/D | M001申请陈述与M002公函比对 | M001事由段、M002正文页段 | P0或P3 | N/C；必要性最终H"
    },
    {
      "key": "f012",
      "label": "接待分类",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F012；F012 接待分类 | 枚举 | Reception | A/B/D | M001初报；M007权威归口决定 | M001分类栏/M007分类结论 | P0 | 混合或无依据P/H"
    },
    {
      "key": "f013",
      "label": "活动子类型",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F013；F013 活动子类型 | 枚举 | Reception | A/B | M001计划及M002活动描述 | 计划类别和公函事项段 | P0 | N；枚举边界P"
    },
    {
      "key": "f014",
      "label": "拟开始时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F014；F014 拟开始时间 | 时间 | Reception | A/B/G | M001计划与M002/M005行程核对 | 日期时间段，含时区 | P2 | N/C；不能倒填审批时间"
    },
    {
      "key": "f015",
      "label": "拟结束时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F015；F015 拟结束时间 | 时间 | Reception | A/B/G | M001计划与来函行程核对 | M001/M005时间段 | P2 | N/C；早于开始视C"
    },
    {
      "key": "f016",
      "label": "拟接待地点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F016；F016 拟接待地点 | 地点/文本 | Reception | A/B/G | M001计划、单位安排记录 | M001地点栏/M005行程 | P1/P3 | N/C；地点许可另路由"
    },
    {
      "key": "f017",
      "label": "证明文书类别",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F017；F017 证明文书类别 | 枚举 | Letter | A/B/C | M002派出公函或M003校方邀请原件 | 文书首页抬头/发文形式 | P0 | H01无公函N；H02邀请替代性P"
    },
    {
      "key": "f018",
      "label": "函件文号及发出日",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F018；F018 函件文号及发出日 | 文本+日期 | Letter | B/C | 经核实的M002/M003来源 | 文书头、落款、电子签发元数据 | P1 | 未标N/验真H；不得伪造号"
    },
    {
      "key": "f019",
      "label": "来访人员名单与单位/职务",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F019；F019 来访人员名单与单位/职务 | 受控列表 | Reception/Letter | A/B/C | M002正文/附件或M005公方名单 | 文书表格行、页码/坐标 | P2/P3 | 缺明细N或H；仅人数不等于姓名核实"
    },
    {
      "key": "f020",
      "label": "来访人数",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F020；F020 来访人数 | 非负整数 | Reception | A/B/G | 从F019可信有效人员计数；M002声明比对 | M002人数和名单行号 | P1 | N/C；不能按OCR行数盲算"
    },
    {
      "key": "f021",
      "label": "公务行程/活动议程",
      "kind": "rows",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F021；F021 公务行程/活动议程 | 区间列表 | Reception | B/C/G | M002/M005主行程，M001为计划 | 公函行程段/议程页 | P2/P3 | 缺失N；临时保密安排H"
    },
    {
      "key": "f022",
      "label": "拟陪同人员与单位",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F022；F022 拟陪同人员与单位 | 受控列表 | Plan | A/B/G | M001主张，承办单位确认记录 | M001陪同名单栏 | P2 | 尚未确定可N/待人工；不用身份证号"
    },
    {
      "key": "f023",
      "label": "拟陪同人数",
      "kind": "number",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F023；F023 拟陪同人数 | 非负整数 | Plan | A/B/G | F022计数/M001主张 | M001陪同人数栏 | P1 | N/C；校方报销数值仅提示不硬否决"
    },
    {
      "key": "f024",
      "label": "拟用餐/接待安排",
      "kind": "rows",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F024；F024 拟用餐/接待安排 | 结构化计划 | Plan | A/B/G条件 | M001拟议，校方方案确认 | M001用餐次数/安排段 | P1 | 未安排用餐NA；有安排但不明N/H"
    },
    {
      "key": "f025",
      "label": "经费来源/预算权威引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F025；F025 经费来源/预算权威引用 | 外部结果ID | DownstreamReference | B/D条件、F | G07或财务权威记录（若可取） | M016来源记录ID/有效状态 | P3 | 未触发NA；接口无S，非AI预算批准"
    },
    {
      "key": "f026",
      "label": "函件签发主体核验状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F026；F026 函件签发主体核验状态 | 枚举+证据ID | Letter | B/C/D | 派出单位可信核验渠道/M013 | M013核验回执、验章日志 | P3 | 未验H；接口不可达S"
    },
    {
      "key": "f027",
      "label": "材料归属/版本图",
      "kind": "rows",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F027；F027 材料归属/版本图 | 映射 | Case/Plan | A–G | Main材料账、哈希及替换链 | 每个M的slot/version/sourceVersion | P3 | S；禁止跨案混用"
    },
    {
      "key": "f028",
      "label": "联合承办单位及分工",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F028；F028 联合承办单位及分工 | 组织引用列表 | Reception | B/C/G条件 | M006正式协调/组织记录 | M006主协办分工与签发段 | P1 | 非联合NA；分歧C/H"
    },
    {
      "key": "f029",
      "label": "已有校方接待决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F029；F029 已有校方接待决定引用 | Decision ID | AuthorityDecision | D/G条件 | 已生效学校审批权威事件/M008 | M008审批ID和目标版本 | P3 | 未到D时NA；有旧批找不到S/H"
    },
    {
      "key": "f030",
      "label": "审批政策版本/授权配置",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F030；F030 审批政策版本/授权配置 | 政策引用 | AuthorityDecision | D | 校本现行办法与授权配置 | SRC-007/008确认后政策版本ID | P0 | 当前P，不得自动批准"
    },
    {
      "key": "f031",
      "label": "实际签批人身份/岗位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F031；F031 实际签批人身份/岗位 | 可信Actor ID | AuthorityDecision | D | Main服务端角色校验/学校签批平台 | M012签批事件、岗位授权快照 | P3 | D未产生NA；冒名C/H"
    },
    {
      "key": "f032",
      "label": "正式人工决定状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F032；F032 正式人工决定状态 | 枚举 | AuthorityDecision | D | M012学校权威决定事件 | 决定ID/结果字段 | P3 | D未产生NA；不以PASS_FACT代替"
    },
    {
      "key": "f033",
      "label": "正式签批时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F033；F033 正式签批时间 | 时间 | AuthorityDecision | D | M012不可篡改签批时间戳 | 审批流水/签章时间 | P3 | D未产生NA；事后晚于活动须H"
    },
    {
      "key": "f034",
      "label": "批示绑定的计划版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F034；F034 批示绑定的计划版本 | 版本指纹 | AuthorityDecision | D/G | Main冻结计划指纹+M012引用 | 决定targetVersion/证据摘要 | P3 | 不匹配C/H；旧批不自动覆盖新版"
    },
    {
      "key": "f035",
      "label": "变更原因与影响范围",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F035；F035 变更原因与影响范围 | 文本+字段差异 | ChangeRequest | G(H05) | M009经办说明，Main差异计算 | M009变更段、前后F引用 | P1/P3 | 非变更NA；未述原因N"
    },
    {
      "key": "f036",
      "label": "撤回/取消请求",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F036；F036 撤回/取消请求 | 请求ID+事由 | ChangeRequest | G(H06) | M010经可信Actor发出的请求 | M010请求流水和签发人 | P3 | 非撤回NA；权限不明H"
    },
    {
      "key": "f037",
      "label": "复核/争议请求",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F037；F037 复核/争议请求 | 请求ID+争点 | ChangeRequest | G(H07) | M011申请及校方受理记录（如有） | M011异议项、来源决定ID | P3 | 非复核NA；受理规则P/H"
    },
    {
      "key": "f038",
      "label": "事后实际接待清单引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F038；F038 事后实际接待清单引用 | 材料ID | DownstreamReference | E/F | M014真实事后接待清单及校方审签 | M014原件、签章页和记录ID | P2/P3 | A–D阶段NA；E后缺失N"
    },
    {
      "key": "f039",
      "label": "财务/G07权威处理结果引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F039；F039 财务/G07权威处理结果引用 | 外部Decision ID | DownstreamReference | F条件 | M016财务/业务Owner真实决定 | M016接口事件ID、适用范围 | P3 | 未到F为NA；无接口S，非本案批准"
    },
    {
      "key": "f040",
      "label": "预计接待费用（历史表字段）",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F040；F040 预计接待费用（历史表字段） | 金额+币种 | Plan | A/B/D条件 | M001申报人计划，仅按SRC-013历史原表发现；2026必填性未知 | M001预计费用栏/计划总额计算来源 | P1 | 未要求时NA；有计划但值缺N；禁止2014金额分档硬判"
    },
    {
      "key": "f041",
      "label": "拟结算方式（历史表字段）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F041；F041 拟结算方式（历史表字段） | 枚举+说明 | Plan | A/B/D条件 | M001计划与学校真实财务方式说明；当前表单必填性未核 | M001结算方式栏/选择证明 | P1/P3 | 未触发NA；不明N/P；本模板不裁定支付合法性"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 拟接待申请/活动计划：事由、时间、场所、承办、拟陪同",
      "purpose": "校内主承办经办人/组织者；结构化受理字段或真实草稿表单/方案（不假定官方表头已知）；当前必需：全部拟接待/变更情形；已有案复用最新版本；可信系统已保存同一案计划可直接引用，不强制再传 PDF；F001–F003、F008、F011–F016、F022–F025、F027、F040–F041；SRC-001/007/008/013（历史）；必须绑定caseId/计划版本/填报者；缺适用事实 N；扫描无效 U；与其他材料冲突 C",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 50,
      "requiredElements": [
        "拟接待申请/活动计划：事由、时间、场所、承办、拟陪同",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "M002 派出单位公务公函：来访公务目的、人员、行程、来源",
      "purpose": "来访人员派出单位；带签发线索的公函原件/电子公文、核验后的可信收文记录；当前必需：H01；H02是否必须取原件待政策判明；不适用时 NA；校方公文交换系统中已核实的同一公函可引用，不强迫重复上传；不能自行以邀请函当然替代；F010–F011、F014–F015、F017–F021、F026–F027；SRC-001/002/004/005/007；记录签发单位、文号、日期、收文ID、页码/哈希；缺件 N/P；不可读 U；验真不成 H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 50,
      "requiredElements": [
        "派出单位公务公函：来访公务目的、人员、行程、来源",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "M003 学校主动邀请依据：证明谁、为何邀请",
      "purpose": "校方有权发函机构；经证实的校方邀请函/正式邀请事件；条件必需：H02 校方主动邀请；可信发文系统原记录优先；经办人拟发未签函仅属草稿，不能视为已签正式函；F010–F018、F021、F027；SRC-001/002/007；绑定签发学校单位、版本和受邀团组；缺当前邀请依据 N；“免 M002”一律 P/H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 50,
      "requiredElements": [
        "学校主动邀请依据：证明谁、为何邀请",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 经办与代理组织授权记录：确认谁可办理/代办",
      "purpose": "学校人事/组织/统一认证及可授权单位；登录/岗位关系、授权委托或审批代理事件；条件必需的可信查取：全部涉及实际操作人；仅代理需要代理证明，非默认上传；校方权限服务查询即可；接口不存在则由授权机构人工验证，不要求上传身份证、劳动合同等无关材料；F004–F009、F031；SRC-003/007/008；记录授权主体、组织、范围、有效期及查询时点；身份源失联 S；权限不明 H/P",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 50,
      "requiredElements": [
        "经办与代理组织授权记录：确认谁可办理/代办",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 行程/人员名单补充：补足来函未载事项",
      "purpose": "派出单位或经授权承办单位；来访名单/议程附件、可信沟通回函；涉密名单另走授权路径；条件必需：M002/M003未足以支持人员/行程核对时；M002已有完整可信名单/行程则 NA；不能靠未经证实的经办人名单覆盖派出方名单；F019–F021、F014–F015、F027；SRC-001/005；与主函同caseId、发函版次、人员序号；缺 N；不可读 U；人数不一致 C",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 50,
      "requiredElements": [
        "行程/人员名单补充：补足来函未载事项",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 多单位组织责任确认：谁主办、谁协办",
      "purpose": "主承办和协办单位的有权负责人；正式协调纪要、主办确认或可信校务流转记录；条件必需：H04及H03主责争议；校方真实会务/公文记录可直接引用；各单位口述相互矛盾不算已确认；F008–F009、F028、F027；SRC-003/005/007；每条分工带单位ID、事件ID及有效版本；缺主责N/H；矛盾C",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 50,
      "requiredElements": [
        "多单位组织责任确认：谁主办、谁协办",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M007",
      "name": "M007 业务分类权威意见：区分公务/业务/外事/会议",
      "purpose": "有该事项分类权限的学校主管部门（待核）；主管归口真实分类意见/决定引用；条件必需：H08分类冲突；由有权人后续形成时才有记录；已有学校正式分类结论可引用，不得由 AI 或经办人单方面改名替代；F012、F025、F027；SRC-002/004/009；同活动版本和分类时点；未形成是 P/H，不得要求申请起案就上传“最终分类批示”",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "业务分类权威意见：区分公务/业务/外事/会议",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M008",
      "name": "M008 既有正式审批引用：变更/撤回/复核查原决定",
      "purpose": "学校真实审批机关/系统；有效旧接待决定原记录ID或可核凭证；条件必需：H05/H06/H07原先已经存在批示才引用；同案原决定已可查询，直接链接；扫描签名无法独立验真不作为权威替代；F029、F031–F034、F027；SRC-001/007/008；绑定原planVersion和审批时间；无既有决定 NA；称已批却查不到 S/H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 50,
      "requiredElements": [
        "既有正式审批引用：变更/撤回/复核查原决定",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M009",
      "name": "M009 变更申请与前后差异：说明受影响事实",
      "purpose": "经可信身份验证的原经办或授权继任人；结构化差异、变更说明、修订计划及新增来函；当前必需：H05；旧M001＋新版本计划的可审计差异可替代另造独立Word申请；但人工审批是否需专表未知；F002、F014–F028、F035；SRC-001/007/008；原版/新版均保留，字段diff和材料替换链；缺新事实N、变更不明H、无法读U",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 50,
      "requiredElements": [
        "变更申请与前后差异：说明受影响事实",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "M010 撤回/取消请求：谁提出、请求撤回什么",
      "purpose": "原申请人/受权承办单位；主动撤回事件、签署申请或校务流程记录；当前必需：H06；可信服务端撤回操作流水可代纸件；已批决定不因点“撤回”自动失效；F001–F003、F029、F036；SRC-007/008待核；记录requestId、actor、原决定ID、时间；无请求N；无权操作H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 50,
      "requiredElements": [
        "撤回/取消请求：谁提出、请求撤回什么",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "M011 复核/争议说明：明确争议对象与新证据",
      "purpose": "原承办单位或合格申请人（资格待校本确认）；书面复核请求、佐证材料或可信受理事件；当前必需：H07提出争议的事实；法定/校内复核程序未证实；若校方已有真实受理记录则引用；事后缺批仅需异常说明，无需伪造复核受理；F029、F034、F037；SRC-001/007/008；绑定争议决定或异常事件、提出时间；缺争点N；受理资格/时限P/H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 50,
      "requiredElements": [
        "复核/争议说明：明确争议对象与新证据",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M012",
      "name": "M012 学校正式事前审批决定：批准、否决及责任归属",
      "purpose": "校本有权审批岗位（具体级次未核）；正式审批表已签有效版或可信审批事件；后续才产生：D阶段，由学校审批人形成；A/B不可强索；系统签批/可核官方纸件可以作为不同载体，必须验证权限、目标版本、签批时间，不接受“章影即批准”；F029–F034、F030；SRC-001/007/008；决定ID+岗位+授权快照+targetVersion+签批时间；未到D为NA；来源不足S/P/H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "学校正式事前审批决定：批准、否决及责任归属",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 函件真实性核验回执：证明文书是否真实发出",
      "purpose": "文书签发机构、学校可信公文渠道/核验部门；公文交换记录、电子签名验签结果、人工电话复核留痕（如合法）；条件必需：来函疑点/需要验真时，不是所有申请默认上传；能从可信官方收文系统取得的记录可引用；OCR章印图不是合法验章替代；F017–F018、F026–F027；SRC-005/007；回执必须绑定文书哈希/文号及核验人；接口不可达S；矛盾C；疑点H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "submission",
      "maxCount": 50,
      "requiredElements": [
        "函件真实性核验回执：证明文书是否真实发出",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M014",
      "name": "M014 事后接待清单：证明实际参加和工作保障",
      "purpose": "承办单位、清单审批责任人；活动结束后清单、实际陪同、签字菜单（按校方报销指引）；后续才产生：E阶段，不是事前最低材料；若真实校方后续系统已有清单可引用；具体原件形式待核；F019–F024、F038；SRC-001/002/005/006；实际日期/人员/签字与原批示比对；E后缺N，扫描不清U，超计划C/H",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "事后接待清单：证明实际参加和工作保障",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M015",
      "name": "M015 实际票据与支付记录：费用事实",
      "purpose": "承办经办、财务/收款单位；发票、原始菜单、POS凭条/转账依据；后续才产生：F阶段 G07职责；合规财务电子票据或财务可信系统取数；T04-T07仅引用，不处理金额合法性；F025、F039；SRC-001/002/004/005/006/012；按接待活动/经费事项归属；事前NA；F阶段缺件由G07处理，非本案先决条件",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "实际票据与支付记录：费用事实",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M016",
      "name": "M016 财务/G07既有权威结论：避免重判预算、报销/支付",
      "purpose": "财务处或G07业务Owner；经费来源/报销/结算的真实决定ID；条件或后续：仅已形成相关财务结论且有必要引用时；可信系统带权限读取即可，不要求申请人上传财务系统截图；F025、F039；SRC-001/002/012、SRC-011仅技术线索；绑定具体费用与活动版本、决定状态；无此结论在A–D为NA；接口不可用S",
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text",
        "zip"
      ],
      "minCount": 0,
      "requiredAt": "decision",
      "maxCount": 50,
      "requiredElements": [
        "财务/G07既有权威结论：避免重判预算、报销/支付",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "rules",
      "name": "原件第 08 节审核规则",
      "description": "源自 T04-T07 原件第 08 节规则表；研究来源与案卷材料分离，未确认政策只生成语义提示或人工待办。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "案卷与计划版本完整性",
          "requirement": "规则：R001 案卷与计划版本完整性；列2：A–G；T=建案/更新/审查任何计划，F=仅查看外部历史摘要，U=Main案卷状态失联；列3：SRC-001、SRC-007；列4：F001–F003、F027；M001/M009；列5：有效为PASS_FACT；源失联SOURCE_UNAVAILABLE、交叉案/版本矛盾CONFLICT；转Main案卷Owner/经办人，不生成伪Run",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "校内经办人身份与单位",
          "requirement": "规则：R002 校内经办人身份与单位；列2：A/B/D/G；T=有人发起/提交动作，F=非交互系统归档检查，U=可信登录或组织身份无法确认；列3：SRC-003、SRC-007、SRC-008；列4：F004–F006；M004；列5：一致PASS_FACT；认证源失联SOURCE_UNAVAILABLE、申报与目录不一致CONFLICT、校内可办身份范围未知POLICY_UNCONFIRMED；转身份管理员/承办主管",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "代办及岗位授权范围",
          "requirement": "规则：R003 代办及岗位授权范围；列2：A/D/G；T=代办/签批/跨单位操作，F=亲自提交普通草稿且不代签，U=代理性质或当前授权政策不明；列3：SRC-003、SRC-007、SRC-008；列4：F004–F007、F009；M004；列5：有效范围内PASS_FACT；无记录且应有材料NEEDS_MATERIAL，目录中无权/假冒CONFLICT，代理可否成立无现行校本依据POLICY_UNCONFIRMED；转授权单位/校方审批管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "主承办责任归属",
          "requirement": "规则：R004 主承办责任归属；列2：A/B/D；T=拟有承办单位，F=明确仅外部引用记录，U=主协办关系尚未指定；列3：SRC-003、SRC-005、SRC-013（历史）；列4：F008–F009、F028；M001/M004/M006；列5：同版本一致PASS_FACT；争议CONFLICT、单位未说明当前责任NEEDS_MATERIAL、组织授权待核NEEDS_HUMAN_DECISION；转主承办主管/党政办公室有关岗位",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "公务／业务／外事／会议分类",
          "requirement": "规则：R005 公务／业务／外事／会议分类；列2：A/B/C/D；T=拟按国内公务接待申办，F=已有可信主管认定完全另类且已路由，U=混合/未知；列3：SRC-002、SRC-004、SRC-005、SRC-009；列4：F011–F013、F025；M001/M002/M003/M007/M016；列5：客观分类证据一致仅PASS_FACT；分类资料互斥CONFLICT，2018/2024相邻校本依据不可核POLICY_UNCONFIRMED，难作性质裁量NEEDS_HUMAN_DECISION；转校方归口分类岗位，必要时路由他模板",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "活动实质公务目的与私人用途风险",
          "requirement": "规则：R006 活动实质公务目的与私人用途风险；列2：A/B/C；T=拟公共资源接待，F=案件只读旧决定，U=事项未说明或无法取得派出内容；列3：SRC-004第22–23条、SRC-005第5–6条、SRC-013第19条（历史）；列4：F010–F011、F013；M001/M002/M003；列5：相互可证事实PASS_FACT；只写私人聚餐等范围明显矛盾CONFLICT并标高风险；事由无可补事实NEEDS_MATERIAL；“必要吗”NEEDS_HUMAN_DECISION；转承办主管/有权审核人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "公函／邀请函路径与适用资格",
          "requirement": "规则：R007 公函／邀请函路径与适用资格；列2：A/B/C；T=H01/H02或需证明公务派出，F=非国内公务已正确路由，U=邀请是否可代公函/特殊任务规则待核；列3：SRC-001、SRC-002、SRC-004第22条、SRC-005第7条、SRC-007、SRC-013第6条（历史）；列4：F010、F017–F018；M002/M003；列5：H01有可读有效函件可PASS_FACT（仅“存在”）；当前应提供却无函NEEDS_MATERIAL；H02邀请单独替代的合法性POLICY_UNCONFIRMED；转承办经办人/校方制度解释岗位，不得自动准许",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "函件签发真实性",
          "requirement": "规则：R008 函件签发真实性；列2：B/C/D；T=需核公函或邀请真实发出，F=相应文书未触发，U=收文渠道或验章条件未知；列3：SRC-005第7条、SRC-007、SRC-008；列4：F010、F017–F018、F026；M002/M003/M013；列5：已经权威验真PASS_FACT；章模糊UNREADABLE；官方查验源失联SOURCE_UNAVAILABLE；同文号多份不一致CONFLICT；须人工验章NEEDS_HUMAN_DECISION；转公文/承办验真责任人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "来访对象身份、名单与人数",
          "requirement": "规则：R009 来访对象身份、名单与人数；列2：A/B/C；T=需确认证明来访人员，F=明确取消活动且不再审人数，U=名单由派出方保密且未授权开放；列3：SRC-001、SRC-002、SRC-005第7条；列4：F010、F019–F020；M002/M005；列5：全部可定位一致PASS_FACT；名单缺NEEDS_MATERIAL；OCR栏不可读UNREADABLE；主函/附件矛盾CONFLICT；保密来源须校方处理NEEDS_HUMAN_DECISION；转经办/派出方核实人",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r010",
          "title": "接待时间与公务议程",
          "requirement": "规则：R010 接待时间与公务议程；列2：A/B/C/G；T=申请或变更活动日期/议程，F=仅E/F费用事项引用且无活动改动，U=保密行程不能读取；列3：SRC-005第5–7条、SRC-013第6条（历史）；列4：F014–F015、F021；M001/M002/M003/M005；列5：一致PASS_FACT；缺关键时间NEEDS_MATERIAL；扫描不可读UNREADABLE；变更与原函冲突CONFLICT；不可公开的行程NEEDS_HUMAN_DECISION；转承办/派出方",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "接待地点及活动范围一致性",
          "requirement": "规则：R011 接待地点及活动范围一致性；列2：A/B/C/G；T=拟安排地点，F=取消且无实际安排，U=地点由其他授权系统决定而不可见；列3：SRC-005第5–7条、SRC-013第6条（历史）；列4：F016、F021；M001/M005/M002；列5：一致PASS_FACT；未定可补地点NEEDS_MATERIAL；变更地点与公函安排不符CONFLICT；场地许可问题NEEDS_HUMAN_DECISION/路由相邻业务；转承办主管",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r012",
          "title": "拟陪同及工作餐安排事实",
          "requirement": "规则：R012 拟陪同及工作餐安排事实；列2：A/B/C/G；T=拟陪同或安排工作餐，F=无陪同/不安排用餐且可信确定，U=安排未定或校本阈值缺来源；列3：SRC-002、SRC-005第10条、SRC-007、SRC-013第10条（历史）、SRC-014（2025报销栏）；列4：F019–F020、F022–F024；M001/M002/M014（仅E阶段）；列5：数字事实相符PASS_FACT；名单与汇总冲突CONFLICT，未提交当前必需计划NEEDS_MATERIAL，超出历史/报销提示仅POLICY_UNCONFIRMED或NEEDS_HUMAN_DECISION；转承办主管/政策管理员；事后M014在A/B为NA",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "预计费用与拟结算方式的历史表字段",
          "requirement": "规则：R013 预计费用与拟结算方式的历史表字段；列2：A/B/D；T=经办自愿提供F040/041，或经核实的现行表明确启用；F=没有独立计划金额/方式核验目的且未提供，U=试图根据未取得的现行表确定“必填”或审批分档；列3：SRC-002、SRC-007、SRC-008、SRC-013（2014附件1）；列4：F024–F025、F040–F041；M001/M016（后者仅已存在时）；列5：自愿填报可核内部算术/选项事实PASS_FACT；未填可选字段NOT_APPLICABLE，不产生补件；需要判断现行必填性/金额分档时POLICY_UNCONFIRMED；支付许可由G07/财务决定，转校方表单保管人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "联合/重复接待的主办和活动唯一性",
          "requirement": "规则：R014 联合/重复接待的主办和活动唯一性；列2：B/C/G；T=H04或发现同团组同日期多个案，F=经证实互不相关，U=跨单位查重不可用；列3：SRC-003、SRC-005第7条、SRC-013第5条（历史）；列4：F001、F008、F010、F014、F019、F028；M001/M002/M006/M008；列5：已排除重复的事实PASS_FACT；重合而分工不明CONFLICT/NEEDS_HUMAN_DECISION；跨案源失联SOURCE_UNAVAILABLE；转主办单位/党政办公室，不自动合并正式批示",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "材料可读、归属与来源版本链",
          "requirement": "规则：R015 材料可读、归属与来源版本链；列2：A–G；T=材料支持任一在审规则，F=材料不属当前阶段或本案依赖，U=sourceVersion/归属缺失；列3：SRC-001、SRC-005、SRC-007；列4：F001–F002、F018–F019、F027；M001–M013；列5：有效PASS_FACT；实存不能解析UNREADABLE、来源记录不可查SOURCE_UNAVAILABLE、跨案借用/旧版覆盖CONFLICT；转材料Owner/经办补件，不得无声移植证据",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r016",
          "title": "现行校本政策与审批授权配置",
          "requirement": "规则：R016 现行校本政策与审批授权配置；列2：B/D/G；T=准备作正式决定、重批或撤销；F=纯材料整理尚未申请正式签批；U=2018现行原文/修订效力不清；列3：SRC-001、SRC-002、SRC-007、SRC-008、SRC-013（只读历史）；列4：F030、F040–F041；M001及仅在已签后核验时的M012；列5：未取得现行政策一律POLICY_UNCONFIRMED；待签时M012尚未形成不报缺件；校方有权制度解释后才可能具备验证基础，转党政办公室/制度管理员，阻断学校批准自动输出",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "正式签批人及行为权限",
          "requirement": "规则：R017 正式签批人及行为权限；列2：D/G；T=声称已有正式批准/驳回/撤销或准备写入决定，F=A–C尚未签批，U=可信签发身份/代理权限不可核；列3：SRC-003、SRC-007、SRC-008、SRC-013（历史）；列4：F004、F009、F030–F032；M004/M012/M008；列5：身份、权限、签发都可信才PASS_FACT（权限事实）；源失联SOURCE_UNAVAILABLE、冒名CONFLICT、政策未核POLICY_UNCONFIRMED、需有权签批NEEDS_HUMAN_DECISION；转学校真实有权审批人/Main Decision Owner",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "事前决定时间顺序与后补异常",
          "requirement": "规则：R018 事前决定时间顺序与后补异常；列2：D/E/G；T=存在审批事件、已接待或提出事后缺批，F=尚未进入D的正常待审案，U=可信活动实际时间/签批时间不可核；列3：SRC-001、SRC-005第7条、SRC-007、SRC-013第6条（历史）；列4：F003、F014–F015、F033、F038；M001/M012/M014/M011；列5：可信事前顺序PASS_FACT；签批晚于活动为CONFLICT并NEEDS_HUMAN_DECISION后续待办（分别按目标规则记录）；实际时间源不可达SOURCE_UNAVAILABLE；转主管校本有权人，不得追认伪装",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "决定所指计划版本及既有批准引用",
          "requirement": "规则：R019 决定所指计划版本及既有批准引用；列2：D/G；T=有真实旧/新决定需要用于当前活动，F=尚无任何已作决定，U=decisionId/targetVersion不能核；列3：SRC-001、SRC-007、SRC-008；列4：F002、F027、F029、F032、F034；M008/M012；列5：同版可比事实PASS_FACT；旧版与当前版不符CONFLICT，签批系统不可达SOURCE_UNAVAILABLE，需重新获批与否POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；转学校有权人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "事前变更差异和定向重审",
          "requirement": "规则：R020 事前变更差异和定向重审；列2：G(H05)；T=变更已提交或替换M影响事实，F=仅重命名文件而bytes/可信事实未变，U=新旧版本关系不明；列3：SRC-001、SRC-007、SRC-008；列4：F002、F014–F028、F027、F029、F034–F035；M009/M001/M002/M003/M005/M008；列5：差异可追溯PASS_FACT；缺修订说明NEEDS_MATERIAL、版本错配CONFLICT、旧结果STALE仅内部状态，重批门槛POLICY_UNCONFIRMED；转经办及有权人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "撤回/取消请求与生效范围",
          "requirement": "规则：R021 撤回/取消请求与生效范围；列2：G(H06)；T=收到可信撤回/取消请求，F=没有撤回意愿且案卷在正常流程，U=申请人可否撤销已批事项不明；列3：SRC-007、SRC-008、SRC-013（历史）；列4：F001–F006、F029、F036；M010/M004/M008；列5：请求身份可核PASS_FACT（仅请求有效）；申请事实缺失NEEDS_MATERIAL；超权限CONFLICT/NEEDS_HUMAN_DECISION；已批撤销效力POLICY_UNCONFIRMED；转原审批单位，不擦旧决定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "复核请求／事后缺批异常",
          "requirement": "规则：R022 复核请求／事后缺批异常；列2：G(H07)；T=明确要求复核、质疑原结论或发现活动已办无批，F=无争议且未触发异常，U=复核资格/期限/渠道不可核；列3：SRC-001、SRC-005第7条、SRC-007、SRC-008、SRC-013（历史）；列4：F003–F006、F014、F029、F033、F037；M011/M008/M012/M014；列5：争点可读且关联PASS_FACT（请求事实）；缺理由NEEDS_MATERIAL、旧决定不可查SOURCE_UNAVAILABLE、受理资格/期限POLICY_UNCONFIRMED、争议实质NEEDS_HUMAN_DECISION；转校方指定复核/监督责任人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "事后实际清单与批准计划差异",
          "requirement": "规则：R023 事后实际清单与批准计划差异；列2：E/F；T=接待实际结束且清单形成，F=A–D未发生或明确取消未执行，U=实际参加记录仅在受限档案中；列3：SRC-001、SRC-002、SRC-005第7条、SRC-013第7条及附件2（历史）；列4：F019–F024、F034、F038；M014/M001/M012；列5：一致PASS_FACT；E后确需记录但无清单NEEDS_MATERIAL、扫描模糊UNREADABLE、实际与批准不符CONFLICT；转承办单位与G07，不反改原签批",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "G07／G50／相邻业务权威结论只读引用",
          "requirement": "规则：R024 G07／G50／相邻业务权威结论只读引用；列2：B/D/E/F/G；T=实际声明存在外部决定或当前须消费它；F=此阶段/本案没有已产生且必要的外部决定；U=声明引用但真实权限或接口尚无法验证；列3：SRC-001、SRC-002、SRC-006、SRC-010、SRC-011、SRC-012；列4：F025、F039–F041；M015/M016/M008（都仅合法时点）；列5：已核目录只证明ID映射，仅权威决定引用一致才PASS_FACT；接口失联SOURCE_UNAVAILABLE、跨案/错权/错版本CONFLICT、真实授权证据未核时NEEDS_HUMAN_DECISION；不以“目录未读”再报政策未知，转对应业务Owner/G07",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "A",
      "name": "起案",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "B",
      "workflowOwner": "local"
    },
    {
      "id": "B",
      "name": "核验",
      "kind": "auto-check",
      "executorRole": "reviewer",
      "nextStageId": "C",
      "returnToStageId": "A",
      "workflowOwner": "local"
    },
    {
      "id": "C",
      "name": "补件/分类",
      "kind": "supplement-wait",
      "executorRole": "reviewer",
      "nextStageId": "D",
      "returnToStageId": "B",
      "workflowOwner": "local"
    },
    {
      "id": "D",
      "name": "审批（仅记录真实授权岗位作出的事前决定）",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "E",
      "returnToStageId": "C",
      "workflowOwner": "local"
    },
    {
      "id": "E",
      "name": "执行和清单（事后事实，不倒填事前批准）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "F",
      "returnToStageId": "D",
      "workflowOwner": "local"
    },
    {
      "id": "F",
      "name": "财务和审计（只读引用；不代审报销）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "E",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "fact-observations",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "review-issues",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "review-todos",
      "kind": "supplement-list",
      "audience": "teacher"
    },
    {
      "id": "external-decision-reference",
      "kind": "item-feedback",
      "audience": "teacher"
    },
    {
      "id": "finance-evidence-reference",
      "kind": "item-feedback",
      "audience": "reviewer"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

/** Source and policy-evidence metadata; SRC identifiers are research citations, never case SourceRefs. */
export const r02Metadata = {
  "templateId": "T04-T07",
  "name": "公务接待事前审批与接待责任审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T04-T07.md",
  "sourceDocumentSha256": "dd765f9831855988624812ffd04f0c2df83072afdf2e8289f184b629c236428e",
  "researchOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T04-T07.md",
  "researchOriginalBlobSha1": "a030e8393d4d51ccd4a683af84504089be9a47a0",
  "manifestBytes": 126069,
  "manifestSha256": "dd765f9831855988624812ffd04f0c2df83072afdf2e8289f184b629c236428e",
  "manifestSourceSnapshot": "2026-10-23（当前可访问的最新正式 MD）",
  "researchAsOf": "2026-10-23",
  "officialSchoolTemplate": false,
  "researchStatus": "REVIEWED_WITH_INTEGRATION_GUARD_OPEN",
  "policyEvidenceStatus": "PARTIAL",
  "sourceHashNormalization": "Reviewed copy is the current research blob plus one LF to match the manifest; the research-original blob is unchanged.",
  "fields": [
    {
      "fieldId": "F001",
      "key": "f001",
      "sourceLabel": "案卷主键",
      "scope": "case"
    },
    {
      "fieldId": "F002",
      "key": "f002",
      "sourceLabel": "计划版本号",
      "scope": "case"
    },
    {
      "fieldId": "F003",
      "key": "f003",
      "sourceLabel": "案件阶段",
      "scope": "case"
    },
    {
      "fieldId": "F004",
      "key": "f004",
      "sourceLabel": "申请人校内身份ID",
      "scope": "subject"
    },
    {
      "fieldId": "F005",
      "key": "f005",
      "sourceLabel": "申请人身份/代办类型",
      "scope": "subject"
    },
    {
      "fieldId": "F006",
      "key": "f006",
      "sourceLabel": "申请人组织关系",
      "scope": "subject"
    },
    {
      "fieldId": "F007",
      "key": "f007",
      "sourceLabel": "代理授权引用",
      "scope": "subject"
    },
    {
      "fieldId": "F008",
      "key": "f008",
      "sourceLabel": "主承办单位",
      "scope": "subject"
    },
    {
      "fieldId": "F009",
      "key": "f009",
      "sourceLabel": "主承办责任岗位/人",
      "scope": "subject"
    },
    {
      "fieldId": "F010",
      "key": "f010",
      "sourceLabel": "派出/来访单位",
      "scope": "subject"
    },
    {
      "fieldId": "F011",
      "key": "f011",
      "sourceLabel": "公务目的和必要性说明",
      "scope": "subject"
    },
    {
      "fieldId": "F012",
      "key": "f012",
      "sourceLabel": "接待分类",
      "scope": "subject"
    },
    {
      "fieldId": "F013",
      "key": "f013",
      "sourceLabel": "活动子类型",
      "scope": "subject"
    },
    {
      "fieldId": "F014",
      "key": "f014",
      "sourceLabel": "拟开始时间",
      "scope": "subject"
    },
    {
      "fieldId": "F015",
      "key": "f015",
      "sourceLabel": "拟结束时间",
      "scope": "subject"
    },
    {
      "fieldId": "F016",
      "key": "f016",
      "sourceLabel": "拟接待地点",
      "scope": "subject"
    },
    {
      "fieldId": "F017",
      "key": "f017",
      "sourceLabel": "证明文书类别",
      "scope": "subject"
    },
    {
      "fieldId": "F018",
      "key": "f018",
      "sourceLabel": "函件文号及发出日",
      "scope": "subject"
    },
    {
      "fieldId": "F019",
      "key": "f019",
      "sourceLabel": "来访人员名单与单位/职务",
      "scope": "subject"
    },
    {
      "fieldId": "F020",
      "key": "f020",
      "sourceLabel": "来访人数",
      "scope": "subject"
    },
    {
      "fieldId": "F021",
      "key": "f021",
      "sourceLabel": "公务行程/活动议程",
      "scope": "subject"
    },
    {
      "fieldId": "F022",
      "key": "f022",
      "sourceLabel": "拟陪同人员与单位",
      "scope": "subject"
    },
    {
      "fieldId": "F023",
      "key": "f023",
      "sourceLabel": "拟陪同人数",
      "scope": "subject"
    },
    {
      "fieldId": "F024",
      "key": "f024",
      "sourceLabel": "拟用餐/接待安排",
      "scope": "subject"
    },
    {
      "fieldId": "F025",
      "key": "f025",
      "sourceLabel": "经费来源/预算权威引用",
      "scope": "case"
    },
    {
      "fieldId": "F026",
      "key": "f026",
      "sourceLabel": "函件签发主体核验状态",
      "scope": "subject"
    },
    {
      "fieldId": "F027",
      "key": "f027",
      "sourceLabel": "材料归属/版本图",
      "scope": "case"
    },
    {
      "fieldId": "F028",
      "key": "f028",
      "sourceLabel": "联合承办单位及分工",
      "scope": "subject"
    },
    {
      "fieldId": "F029",
      "key": "f029",
      "sourceLabel": "已有校方接待决定引用",
      "scope": "case"
    },
    {
      "fieldId": "F030",
      "key": "f030",
      "sourceLabel": "审批政策版本/授权配置",
      "scope": "case"
    },
    {
      "fieldId": "F031",
      "key": "f031",
      "sourceLabel": "实际签批人身份/岗位",
      "scope": "case"
    },
    {
      "fieldId": "F032",
      "key": "f032",
      "sourceLabel": "正式人工决定状态",
      "scope": "case"
    },
    {
      "fieldId": "F033",
      "key": "f033",
      "sourceLabel": "正式签批时间",
      "scope": "case"
    },
    {
      "fieldId": "F034",
      "key": "f034",
      "sourceLabel": "批示绑定的计划版本",
      "scope": "case"
    },
    {
      "fieldId": "F035",
      "key": "f035",
      "sourceLabel": "变更原因与影响范围",
      "scope": "case"
    },
    {
      "fieldId": "F036",
      "key": "f036",
      "sourceLabel": "撤回/取消请求",
      "scope": "case"
    },
    {
      "fieldId": "F037",
      "key": "f037",
      "sourceLabel": "复核/争议请求",
      "scope": "case"
    },
    {
      "fieldId": "F038",
      "key": "f038",
      "sourceLabel": "事后实际接待清单引用",
      "scope": "case"
    },
    {
      "fieldId": "F039",
      "key": "f039",
      "sourceLabel": "财务/G07权威处理结果引用",
      "scope": "case"
    },
    {
      "fieldId": "F040",
      "key": "f040",
      "sourceLabel": "预计接待费用（历史表字段）",
      "scope": "subject"
    },
    {
      "fieldId": "F041",
      "key": "f041",
      "sourceLabel": "拟结算方式（历史表字段）",
      "scope": "subject"
    }
  ],
  "materials": [
    {
      "materialId": "M001",
      "name": "M001 拟接待申请/活动计划：事由、时间、场所、承办、拟陪同"
    },
    {
      "materialId": "M002",
      "name": "M002 派出单位公务公函：来访公务目的、人员、行程、来源"
    },
    {
      "materialId": "M003",
      "name": "M003 学校主动邀请依据：证明谁、为何邀请"
    },
    {
      "materialId": "M004",
      "name": "M004 经办与代理组织授权记录：确认谁可办理/代办"
    },
    {
      "materialId": "M005",
      "name": "M005 行程/人员名单补充：补足来函未载事项"
    },
    {
      "materialId": "M006",
      "name": "M006 多单位组织责任确认：谁主办、谁协办"
    },
    {
      "materialId": "M007",
      "name": "M007 业务分类权威意见：区分公务/业务/外事/会议"
    },
    {
      "materialId": "M008",
      "name": "M008 既有正式审批引用：变更/撤回/复核查原决定"
    },
    {
      "materialId": "M009",
      "name": "M009 变更申请与前后差异：说明受影响事实"
    },
    {
      "materialId": "M010",
      "name": "M010 撤回/取消请求：谁提出、请求撤回什么"
    },
    {
      "materialId": "M011",
      "name": "M011 复核/争议说明：明确争议对象与新证据"
    },
    {
      "materialId": "M012",
      "name": "M012 学校正式事前审批决定：批准、否决及责任归属"
    },
    {
      "materialId": "M013",
      "name": "M013 函件真实性核验回执：证明文书是否真实发出"
    },
    {
      "materialId": "M014",
      "name": "M014 事后接待清单：证明实际参加和工作保障"
    },
    {
      "materialId": "M015",
      "name": "M015 实际票据与支付记录：费用事实"
    },
    {
      "materialId": "M016",
      "name": "M016 财务/G07既有权威结论：避免重判预算、报销/支付"
    }
  ],
  "sources": [
    {
      "srcId": "SRC-001",
      "title": "成都理工大学财务处《事业经费-公务接待费报销事项标准流程》",
      "url": "https://jcc.cdut.edu.cn/info/1016/2199.htm",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-002",
      "title": "成都理工大学财务处（采购与招标管理中心）《成都理工大学财务报销应知应会手册》",
      "url": "https://jcc.cdut.edu.cn/__local/D/23/C5/05E72CFA4532D2A2946EBEBE258_FFC48E39_8EEE3.pdf",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-003",
      "title": "成都理工大学党政办公室《机构设置》",
      "url": "https://dbxb.cdut.edu.cn/jgsz.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-004",
      "title": "中共中央、国务院《党政机关厉行节约反对浪费条例》（2025 年修订），国家机关事务管理局转载新华社全文",
      "url": "https://www.ggj.gov.cn/xwzx/ggjxw/202505/t20250519_47741.htm",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-005",
      "title": "中共中央办公厅、国务院办公厅《党政机关国内公务接待管理规定》（2013年公布），共产党员网刊载新华社全文",
      "url": "https://www.12371.cn/2014/03/27/ARTI1395891819321795_all.shtml",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-006",
      "title": "成都理工大学财务处《成都理工大学“只跑一次”财务事项清单》",
      "url": "https://jcc.cdut.edu.cn/__local/8/A8/96/748E97CB5061A750C78C9A841EF_9631E851_E5400.pdf",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-007",
      "title": "成都理工大学（发文号成理党发〔2018〕38号）《成都理工大学国内公务接待管理办法》",
      "url": "https://jcc.cdut.edu.cn/content.jsp?urltype=news.NewsContentUrl&wbtreeid=1034&wbnewsid=2122",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-008",
      "title": "成都理工大学《公务接待审批表》《公务接待清单》",
      "url": "https://jcc.cdut.edu.cn/cwcnew/info/1036/1982.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-009",
      "title": "成都理工大学《国内业务接待管理办法》（成理校发〔2024〕27号）",
      "url": "https://jcc.cdut.edu.cn/cwzd/xxgzzd.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-010",
      "title": "R02项目编目组《ST-CANDIDATE-MASTER-CATALOG-R02.md》《ST-CATALOG-AUDIT-R02.md》及R02_144项完整进度质量台账.tsv",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-011",
      "title": "docs/design/review-agent/acceptance/d4-unified-r01/catalog.json（G50）",
      "url": "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-012",
      "title": "成都理工大学财务处《2026年度财务开账通知》",
      "url": "https://jcc.cdut.edu.cn/info/1012/2656.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-013",
      "title": "成都理工大学《公务接待审批表》《公务接待清单》",
      "url": "https://jcc.cdut.edu.cn/cwcnew/info/1036/1982.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-014",
      "title": "成都理工大学（发文号成理党发〔2018〕38号）《成都理工大学国内公务接待管理办法》",
      "url": "https://jcc.cdut.edu.cn/content.jsp?urltype=news.NewsContentUrl&wbtreeid=1034&wbnewsid=2122",
      "evidenceStatus": "PARTIAL"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules",
      "criterionId": "r001",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r002",
      "srcIds": [
        "SRC-003",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r003",
      "srcIds": [
        "SRC-003",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r004",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r005",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r006",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r007",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r008",
      "srcIds": [
        "SRC-005",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r009",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r010",
      "srcIds": [
        "SRC-005",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r011",
      "srcIds": [
        "SRC-005",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r012",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r013",
      "srcIds": [
        "SRC-002",
        "SRC-007",
        "SRC-008",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r014",
      "srcIds": [
        "SRC-003",
        "SRC-005",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r015",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r016",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-008",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r017",
      "srcIds": [
        "SRC-003",
        "SRC-007",
        "SRC-008",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r018",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r019",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r020",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r021",
      "srcIds": [
        "SRC-007",
        "SRC-008",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r022",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-007",
        "SRC-008",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r023",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r024",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006",
        "SRC-010",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    }
  ],
  "sourceStages": [
    {
      "id": "A",
      "name": "起案",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "B",
      "name": "核验",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "C",
      "name": "补件/分类",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "D",
      "name": "审批",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "E",
      "name": "执行和清单",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "F",
      "name": "财务和审计",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "G",
      "name": "变更/撤回/复核",
      "sourceSection": "03.1",
      "mainline": false,
      "optionalBranch": true
    }
  ],
  "stageModelNote": "TemplateVersion.stages 映射原件 §03.1 A–F 主线；G 变更/撤回/复核是原件定义的条件分支，记录于 r02Metadata.sourceStages，不能把它串成所有案件必经步骤。§11.1 的 WAIT_MATERIAL/WAIT_SOURCE/WAIT_POLICY/WAIT_HUMAN/DECISION_REFERENCED/FINANCE_EXTERNAL 是状态/事件，不是额外学校审批层级。D 阶段只引用真实、可验证的授权事前决定；F 只读财务证据，不代审报销。",
  "resultCodes": [
    {
      "code": "PASS_FACT",
      "meaning": "仅当前触发事实有可追溯、同版本且无冲突的证据支持；不代表接待必要性裁量或学校批准。"
    },
    {
      "code": "NOT_APPLICABLE",
      "meaning": "触发条件可信为假，或材料属于尚未到来的阶段；须记录理由。"
    },
    {
      "code": "NEEDS_MATERIAL",
      "meaning": "当前阶段确需且合法持有人可提供的材料缺失。"
    },
    {
      "code": "CONFLICT",
      "meaning": "同一业务对象/版本的可定位证据实质不一致。"
    },
    {
      "code": "UNREADABLE",
      "meaning": "材料已存在但所需字段无法可靠读取。"
    },
    {
      "code": "SOURCE_UNAVAILABLE",
      "meaning": "应由可信组织/签发源提供的记录无法获取或核验。"
    },
    {
      "code": "POLICY_UNCONFIRMED",
      "meaning": "校本现行规则、授权角色、阈值、例外或复核程序未被充分证实。"
    },
    {
      "code": "NEEDS_HUMAN_DECISION",
      "meaning": "接待必要性、主办责任、审批、例外、复核或撤销需由有权人员裁量。"
    }
  ],
  "outputContract": [
    {
      "id": "fact-observations",
      "sourceType": "resultCode/fact evidence",
      "sourceSection": "10.1/10.2",
      "runtimeKind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "review-issues",
      "sourceType": "issueId/affectedFieldIds/affectedMaterialIds",
      "sourceSection": "10.2",
      "runtimeKind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "review-todos",
      "sourceType": "todoId/nextActorRole/requiredAction",
      "sourceSection": "10.2/11.1",
      "runtimeKind": "supplement-list",
      "audience": "teacher"
    },
    {
      "id": "external-decision-reference",
      "sourceType": "M012/true authority decision reference",
      "sourceSection": "03.1/10.2/11.1",
      "runtimeKind": "item-feedback",
      "audience": "teacher",
      "readOnly": true
    },
    {
      "id": "finance-evidence-reference",
      "sourceType": "M015/M016/G07 finance record",
      "sourceSection": "03.1/10.2/11.1",
      "runtimeKind": "item-feedback",
      "audience": "reviewer",
      "readOnly": true
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
