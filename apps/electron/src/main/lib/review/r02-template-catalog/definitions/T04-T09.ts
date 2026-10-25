import type { TemplateVersion } from '@profer/shared'

/** Generated from the reviewed R02 research source; this is not a school-issued template. */
export const template: TemplateVersion = {
  "templateId": "T04-T09",
  "version": 1,
  "schemaVersion": 2,
  "name": "校舍维修、装修与小型建设工程立项审核",
  "description": "本地研究模板 · 非校方正式模板。用于材料事实核验、风险提示和人工复核；不构成学校正式表单、制度或批准决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；政策适用、审批权限和最终决定必须由有权人员核验，不创建政策版本。",
  "objectType": "project",
  "displayName": {
    "template": "{{caseTitle}}"
  },
  "fields": [
    {
      "key": "id",
      "label": "案卷标识 id",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F001；F001 | 案卷标识 id | Case / P0–P1 | V3 案卷唯一写入端，非报建纸张 | 案卷元信息 | L1 | 无标识不得写入；系统生成，不索申报人"
    },
    {
      "key": "f002",
      "label": "模板标识 enum=T04-T09",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F002；F002 | 模板标识 enum=T04-T09 | Case / P0 | R02 派单固定 | 冻结业务身份 | L0 | 配置错误拦截人工修正，不借用户材料补"
    },
    {
      "key": "f003",
      "label": "办理情形 enum A–H/I1–I4",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F003；F003 | 办理情形 enum A–H/I1–I4 | Case / P0–P2 | 事实＋归口人工分类，SRC-001/004/013 | 需求/报修/报建路由记录 | L1 | P/H；未知不乱分新模板"
    },
    {
      "key": "f004",
      "label": "生命周期阶段 enum P0–P7",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F004；F004 | 生命周期阶段 enum P0–P7 | Case / 全程 | 唯一业务工作流 Owner | 案卷事件与版本 | L1 | 来源失联 U；不同系统阶段不直接互盖"
    },
    {
      "key": "f005",
      "label": "申报单位编号与名称 ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F005；F005 | 申报单位编号与名称 ref | ApplicantUnit / P1、P2 | 校内组织名录/有效负责人证明，SRC-001/013 | M001 表头、M003 使用单位记录 | L1 | N/U；不得只信自由文本"
    },
    {
      "key": "f006",
      "label": "报告者身份类别 enum 师生/教职工/住户/其他/未知",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F006；F006 | 报告者身份类别 enum 师生/教职工/住户/其他/未知 | Actor / P0 条件 | 报修渠道可信会话或报告记录，SRC-004 | M011 报修人字段 | L2 | 个人身份不阻断单位申请；NA 对无个人报修情形"
    },
    {
      "key": "f007",
      "label": "经办人可信身份/委托 ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F007；F007 | 经办人可信身份/委托 ref | Actor / P2 | 主进程或校内认证＋单位授权文件，SRC-001/013 | M015 授权记录/可信会话 | L2 | U/H；Renderer 自报姓名不可生效"
    },
    {
      "key": "f008",
      "label": "单位主要负责人核签身份 ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F008；F008 | 单位主要负责人核签身份 ref | Actor / P2 | 校内组织负责人任职及正式签章验证，SRC-001 | M001 核签页、M006 盖章/签名定位 | L2 | N/U/H；只识别印影不能证明真伪"
    },
    {
      "key": "f009",
      "label": "资产管理责任人 ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F009；F009 | 资产管理责任人 ref | Actor/SiteAsset / P1 | 单位资产管理岗位台账，SRC-013 第十/二十一条 | M003 国资/单位管理记录 | L2 | U/H；不可代 F008 的核签人"
    },
    {
      "key": "f010",
      "label": "资产编码/公房标识 id?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F010；F010 | 资产编码/公房标识 id? | SiteAsset / P1 | 国资处公房/土地或在建工程记录，SRC-013 | M003 资产条目主键 | L1 | U；无接口不要求申请者手填内部主键"
    },
    {
      "key": "f011",
      "label": "校区、楼栋、建筑名 text/ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F011；F011 | 校区、楼栋、建筑名 text/ref | SiteAsset / P0–P1 | 国资公房名录＋现场，SRC-001/013 | M002 地点、M003 标识、M004 照片定位 | L1 | N/U；同名不同房须人工消歧"
    },
    {
      "key": "f012",
      "label": "房间、道路、区域点位 text/ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F012；F012 | 房间、道路、区域点位 text/ref | SiteAsset / P0–P1 | 工单/项目申报位置＋现场勘查，SRC-001/004 | M002/M004/M011 的具体点位 | L1–L3 | N；涉及敏感设施只在受控范围记录"
    },
    {
      "key": "f013",
      "label": "房屋使用/管理责任 status/ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F013；F013 | 房屋使用/管理责任 status/ref | SiteAsset / P1 | 国资处记录、单位移交/授权，SRC-013 | M003 资产使用/移交栏 | L1 | U/CONFLICT/H；不能由申请单位单方宣告"
    },
    {
      "key": "f014",
      "label": "工程性质 enum 修缮/装修/配套/新建/扩建/结构/其他",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F014；F014 | 工程性质 enum 修缮/装修/配套/新建/扩建/结构/其他 | RepairProject / P1 | SRC-001 2025 范围＋规建技术分类 | M002 工程内容、M005 初步范围 | L1 | P/H；新建扩建先不判入维修政策"
    },
    {
      "key": "f015",
      "label": "拟实施工程范围与地点版本 text/ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F015；F015 | 拟实施工程范围与地点版本 text/ref | RepairProject / P1 | 单位说明、规建后续核定，SRC-001 | M002、M005 标明部位和构造 | L1–L3 | N；图纸/清单不必在 P1 最终定版"
    },
    {
      "key": "f016",
      "label": "现状问题/安全紧迫度 text/enum/boolean?",
      "kind": "boolean",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F016；F016 | 现状问题/安全紧迫度 text/enum/boolean? | RepairProject / P0、P1 | 现场工单、勘查与有权安全评价，SRC-001/004/013 | M004/M011/M013 的时间点 | L3 | H；风险未知不得自动标“无风险”"
    },
    {
      "key": "f017",
      "label": "修缮事由与预期效益 text",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F017；F017 | 修缮事由与预期效益 text | RepairProject / P1 | 使用单位说明，SRC-001 | M001 相关栏（栏目未实见）、M002 需求说明 | L1 | N；可由正式申报表内嵌免重传"
    },
    {
      "key": "f018",
      "label": "单项估算金额 money?",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F018；F018 | 单项估算金额 money? | RepairProject / P1–P2 | 单位测算/规建造价专业确认，SRC-001 | M007 估算与计算依据 | L1–L3 | N 或专业待估 H；金额不可与设备总价混用"
    },
    {
      "key": "f019",
      "label": "拟资金来源/经费归口 enum/ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F019；F019 | 拟资金来源/经费归口 enum/ref | RepairProject / P1–P4 | 财务/经费归口权威记录，SRC-001/014 | M007 资金说明、M016 批次预算 | L3 | U/P；申请人可填“拟”，不能写“已批”"
    },
    {
      "key": "f020",
      "label": "申报年度/计划批次 ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F020；F020 | 申报年度/计划批次 ref | PolicyBatch / P1–P2 | 当期归口通知，SRC-001（2025 仅历史）、SRC-014（项目库活动） | M014 政策批次版本与发布日期 | L0 | P；无 2026 通知不得套 2025"
    },
    {
      "key": "f021",
      "label": "适用政策原文版本与效力 ref/status",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F021；F021 | 适用政策原文版本与效力 ref/status | PolicyBatch / P2 | 校发正式制度＋当期通知，SRC-001/005/012 | M014 原文、条目、施行/废止 | L0 | P；无法取来源另标 U"
    },
    {
      "key": "f022",
      "label": "当期报送截止 dateTime?",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F022；F022 | 当期报送截止 dateTime? | PolicyBatch / P2 | 当年通知，SRC-001 2025 截止 | M014 截止段 | L0 | P/NA；不得把历史截止应用到 2026"
    },
    {
      "key": "f023",
      "label": "可信提交/签收时间 dateTime?",
      "kind": "date",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F023；F023 | 可信提交/签收时间 dateTime? | Case / P2 | 校内受理回执/可信系统事件；SRC-001 纸质递交 | M001 递交记录或 M015 受理凭证 | L1 | U；设备本机时间不是收件时间"
    },
    {
      "key": "f024",
      "label": "申请单位负责人签章真实性 status",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F024；F024 | 申请单位负责人签章真实性 status | EvidenceSet / P2 | 可信电子签批/校方人工验签，SRC-001 | M001/M006 实际签章区域 | L2 | N/U/H；影像有章仅记“可见”"
    },
    {
      "key": "f025",
      "label": "可用工程图纸和工程量清单表达 boolean?",
      "kind": "boolean",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F025；F025 | 可用工程图纸和工程量清单表达 boolean? | RepairProject / P1–P3 | 规建专业核实，SRC-001 2025 入口 | M005 初步工程范围、后续 M017 | L1 | P/H；初报不强要采购前定稿"
    },
    {
      "key": "f026",
      "label": "当年金额论证触发结果 boolean?/status",
      "kind": "boolean",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F026；F026 | 当年金额论证触发结果 boolean?/status | PolicyBatch/RepairProject / P2 | 年度阈值＋F018，SRC-001 仅 2025 >50 万 | M014 阈值条款、M007 估算 | L1 | P；未知不可直接 TRUE/FALSE"
    },
    {
      "key": "f027",
      "label": "论证材料关联及有效性 status/ref",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F027；F027 | 论证材料关联及有效性 status/ref | EvidenceSet / P2 条件 | 单位/专业机构论证，SRC-001 历史批次 | M008 论证报告页 | L1–L3 | F026 真则 N；假 NA；未知 P"
    },
    {
      "key": "f028",
      "label": "大型设备/安装环境依赖 boolean?/ref",
      "kind": "boolean",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F028；F028 | 大型设备/安装环境依赖 boolean?/ref | RepairProject / P1 | 设备需求单位＋规建，SRC-001 | M009 设备条件说明/项目引用 | L1 | 不明 H；真时路由采购，不新造单独批准"
    },
    {
      "key": "f029",
      "label": "网络/消防/家具/绿化等复合项 ref[]",
      "kind": "multi",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F029；F029 | 网络/消防/家具/绿化等复合项 ref[] | RepairProject / P1 | 专业归口和单位清单，SRC-001/013 | M010 分项与部门对应关系 | L1–L3 | 真则 N；各专业结果后补"
    },
    {
      "key": "f030",
      "label": "既有报修工单 ref?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F030；F030 | 既有报修工单 ref? | Case/RepairProject / P0 条件 | 后勤工单/责任单位转报，SRC-004 | M011 工单主键、勘查记录 | L2 | U/NA；不可要求无工单者伪造"
    },
    {
      "key": "f031",
      "label": "往年申报/未实施项目 ref?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "原件字段 F031；F031 | 往年申报/未实施项目 ref? | RepairProject / P1 条件 | 规建历史项目记录，SRC-002 | M012 旧报建件及状态 | L1–L3 | U/P；无可信结果须人工核对去重"
    },
    {
      "key": "f032",
      "label": "适用年度项目库/正式预算决定 ref/status?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F032；F032 | 适用年度项目库/正式预算决定 ref/status? | ExternalDecisionRef / P4 | 财务正式预算项目记录；SRC-014 仅证明 2026 年答辩过程 | M016 单项预算批文/权威记录 | L3 | U/H；不能由新闻推“通过”"
    },
    {
      "key": "f033",
      "label": "政府采购前正式图纸清单确认 ref?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F033；F033 | 政府采购前正式图纸清单确认 ref? | ExternalDecisionRef / P4–P6 | 规建会同使用单位确认，SRC-001 | M017 图纸/工程量清单版本与核签 | L1–L3 | 未到阶段 NA；后续缺失才 N"
    },
    {
      "key": "f034",
      "label": "采购计划/合同关联 ref?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F034；F034 | 采购计划/合同关联 ref? | ExternalDecisionRef / P6 | 采招中心权威决定，SRC-007 | M018 采购计划、合同对应编号 | L3 | P2 不适用；已有只读引用，G50/T04 邻接"
    },
    {
      "key": "f035",
      "label": "学校正式立项/不予立项决定 ref/status?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F035；F035 | 学校正式立项/不予立项决定 ref/status? | ExternalDecisionRef / P5 | 现行授权机关可信签批/会议决定，SRC-005/009 仅旁证 | M019 决定编号、签发主体、生效/所指版本 | L3 | H/U；无决定不得自动标批准"
    },
    {
      "key": "f036",
      "label": "补件、变更、撤回、复核请求/版本 enum/ref",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F036；F036 | 补件、变更、撤回、复核请求/版本 enum/ref | Action/EvidenceSet / P3/P7 | 单位正式意向/接收机构受理记录，SRC-001；程序未证 | M020/M021/M022、关联 F001/F035 | L2–L3 | P/H；旧版结论不得继续冒充当前结论"
    },
    {
      "key": "f037",
      "label": "投资主管部门立项类基本建设适用性 boolean?/enum",
      "kind": "boolean",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F037；F037 | 投资主管部门立项类基本建设适用性 boolean?/enum | RepairProject/PolicyBatch / P1→P4 | 规建技术定性＋省级法规适用核验，SRC-016 第 2–4 条 | M002/M005/M014、必要时 M023 | L1 | P/H；规模小不自动为假，有争议不按维修金额门槛定性"
    },
    {
      "key": "f038",
      "label": "基建规划/储备库权威项目引用 ref?",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "原件字段 F038；F038 | 基建规划/储备库权威项目引用 ref? | ExternalDecisionRef / P4、H 条件 | 校方规划建设部门权威库、教育厅规划批复，SRC-016/017 | M023 规划与储备库项目 ID/有效期 | L3 | H 类已确认适用后查 U/H；P1 或非 H 类 NA，不能强迫普通申请人提供省级规划批复"
    },
    {
      "key": "f039",
      "label": "基建项目校内集体决策与省教育厅申报阶段 ref/status?",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F039；F039 | 基建项目校内集体决策与省教育厅申报阶段 ref/status? | ExternalDecisionRef / P4–P5、H 条件 | 校党委会/校长办公会权威文件及规建/教育厅签收结果，SRC-016 第 11–12 条 | M024 含决策、请示、论证、安全分析及真实受理信息 | L3 | 尚未进入省教育厅申报 NA/H；不能拿会议新闻代决策原文，申请主体是否符合省规由省/校归口核"
    },
    {
      "key": "f040",
      "label": "省教育厅与投资主管部门分别作出的批准/核准 ref[]/status",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F040；F040 | 省教育厅与投资主管部门分别作出的批准/核准 ref[]/status | ExternalDecisionRef / P5–P6、H 条件 | 省教育厅、相应投资主管部门实际权威决定，SRC-016 第 11–13 条 | M025 各自独立 issuer/decisionId/effectiveAt/projectScope | L3 | 申请前阶段 NA；有文书但权限/对象不清 H/U；省教育厅批复不自动代表投资立项通过"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 当期《立项维修工程报建申请表》",
      "purpose": "当期《立项维修工程报建申请表》，使用单位持有；带单位工程申报事实及负责人核签，2025 表单存在但正文未取得；可信归口收件登记/校内电子报建原件可代重复上传；没有接口不能宣称存在；F005、F008、F015、F017、F020、F023、F024；SRC-001、012；绑定申报批次＋一项目一版；不能用 2025 表替 2026 有效表；缺 N/P、扫描不清 UNREADABLE，盖章真伪 H",
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
        "当期《立项维修工程报建申请表》",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "M002 P/P1，C 可内嵌 M001",
      "purpose": "需求和报修事由说明，使用单位提供；文本说明部位、问题、改善目标、工程主要内容；当期 M001 对应栏完整可直接复用；已有正式单位需求单可替代单独说明；F011、F012、F014–F017；SRC-001、013；归申请单位、每改范围升版；缺重点事实 N，描述无法定位 NEEDS_MATERIAL，文本不可读 UNREADABLE",
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
        "P/P1，C 可内嵌 M001",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "M003 房屋/资产使用权与管理责任记录",
      "purpose": "房屋/资产使用权与管理责任记录，国资处/资产使用单位持有；公房/在建工程台账、移交记录；优先校内权威国资记录/有效委托；不能要求申请人重复打印可信系统台账；F005、F009–F013；SRC-013 第九、十、四十八条；绑定资产 ID、单位和有效时点；无法访问 U，权属不合 CONFLICT/H，复印件模糊 UNREADABLE",
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
        "房屋/资产使用权与管理责任记录",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "M004 现场照片、勘查和现状证据",
      "purpose": "现场照片、勘查和现状证据，报修者、使用单位或有权勘查人员提供；有时间与部位的可信工单照片/现场检查记录可替代再次拍照；敏感安全细节受控；F011、F012、F016；SRC-001、004、013；绑定具体点位及拍摄/勘查时间；安全风险需人工鉴定；缺现场证明 N/H，看不清 UNREADABLE",
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
        "现场照片、勘查和现状证据",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "M005 P/P1–P3",
      "purpose": "初步工程范围/示意、清单可表达性证明，使用单位与规建处；可先文字分部或草图，后技术完善；P1 可由足以描述地点与工作内容的说明替代“终版施工图”；P4 另建 M017 载采购前签认定稿，不把 M005 视为 P4 已批准图纸；F014、F015、F025；SRC-001；绑定工程部位/版本，初稿不伪装已确认图纸；必要性待确认 P/H，无法辨识 UNREADABLE",
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
        "P/P1–P3",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "M006 C/P2，A",
      "purpose": "单位负责人签名、公章或可信电子核签记录，申报单位/校内签章系统；通常位于 M001 内；M001 含已验证核签就只作同槽引用；有权电子签批回执可替代图片，不接受经办人自称代签；F005、F008、F024；SRC-001、012；绑定组织/签发人/授权期/报建版本；视觉缺失 N，真伪未证 H/U，印章糊 UNREADABLE",
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
        "C/P2，A",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M007",
      "name": "M007 P/P1，C 视当期",
      "purpose": "单项工程估算与测算依据，使用单位先拟、规建工程造价专业核实；预算明细/造价说明；可信归口预算库或已有测算文件可引用；不把设备和网络全部混入“单项工程”；F018、F019、F026；SRC-001、014；绑定工程范围、币种元与测算日期；仅拟估算不得标已批；缺 N/H，金额互异 CONFLICT",
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
        "P/P1，C 视当期",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M008",
      "name": "M008 超过该批次论证门槛的报告与详细施工内容",
      "purpose": "超过该批次论证门槛的报告与详细施工内容，使用单位/专业论证人员持有；2025 年度明确“超过 50 万”要求；经核验的同项目论证结论可只读引用；F018、F026、F027；SRC-001；仅 F026=true 且政策适用才必需；阈值未知 P，缺 N，页缺 UNREADABLE；不可将 2025 阈值当 2026 规则",
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
        "超过该批次论证门槛的报告与详细施工内容",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M009",
      "name": "M009 设备安装环境/项目依赖证明",
      "purpose": "设备安装环境/项目依赖证明，仪器设备需求单位或采购归口提供；采购需求说明、场地与水电条件；已有 T04-T01 设备采购需求的可信引用优先；不要求采购成功合同；F014、F028；SRC-001、013；绑定设备需求版本和同一场地，不复制供应商决定；真而缺 N/U，不明确 H",
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
        "设备安装环境/项目依赖证明",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M010",
      "name": "M010 混合工程分项与专业责任清单",
      "purpose": "混合工程分项与专业责任清单，牵头使用单位及相关部门；工程/网络/消防/家具/绿化分项和接口；可信已有部门协调纪要/分项采购需求可复用，不要求全部专业批复提前出齐；F015、F019、F029；SRC-001、013；分项版本同主项目关联；漏一个必需专业 N，职责争议 CONFLICT/H，电子材料糊 UNREADABLE",
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
        "混合工程分项与专业责任清单",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M011",
      "name": "M011 零星维修工单/勘查转介记录",
      "purpose": "零星维修工单/勘查转介记录，后勤或相应责任单位持有；问题、地点、图片、工单进度；可信“成理智慧后勤”等记录 ID/办结记录可代截图；不默认技术接口已接通；F006、F011、F012、F016、F030；SRC-004；工单和正式项目不同对象，需显式 link；无法调取 U；未产生工单 NA；图像模糊 UNREADABLE",
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
        "零星维修工单/勘查转介记录",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "M012 往年报建件及“未实施”状态",
      "purpose": "往年报建件及“未实施”状态，规建归口持有；旧编号、状态、位置、预算和范围；规建正式历史案卷查询结果可代重新上传旧 PDF；不能凭申请者口述认定未实施；F015、F018、F031；SRC-002、013；历史状态保留原年份，不能将旧批准沿用新范围；无法取得 U/H，两案冲突 CONFLICT",
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
        "往年报建件及“未实施”状态",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "M013 突发安全风险/紧急处置记录",
      "purpose": "突发安全风险/紧急处置记录，现场管理责任方、后勤/保卫或工程专业持有；事故险情、勘查、措施；经授权的现场检查/应急处置记录可替代个人“情况说明”；不是自动越权开工许可；F016、F030；SRC-002、004、013；高敏 L3；紧迫事件不等待扫描文件而延误安全上报；缺 H（先人工处置），录入后校验版本",
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
        "突发安全风险/紧急处置记录",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "M014 当期校发制度/年度报建通知全文",
      "purpose": "当期校发制度/年度报建通知全文，校办/规建或制度库持有；含实施期、范围、阈值、截止；可信校方原始发文链接/公告全文及数字签发信息直接引用；不让申请人上传政策副本；F020、F021、F022、F026；SRC-001、005、012；必须与本案年度一致；2026 缺原文 P，公开网址不可访问 U，过期版本不能自动生效",
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
        "当期校发制度/年度报建通知全文",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M015",
      "name": "M015 组织授权、收件回执和可信经办记录",
      "purpose": "组织授权、收件回执和可信经办记录，校内组织/人事/工程收件端持有；校内登录声明需与实际授权绑定；纸质交接回执可作为线下替代；F005、F007、F008、F023；SRC-001、013；授权期与受理时点必须覆盖提交日；无法认证 U/H，无纸质单也不得编造电子回执",
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
        "组织授权、收件回执和可信经办记录",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "M016 正式预算、项目库或资金安排记录",
      "purpose": "正式预算、项目库或资金安排记录，财务/经费归口持有；仅正式批文或内部可核单项项目记录生效；可信 G07/财务决定 ID 只读引用；2026 年公开答辩新闻不是本项材料；F019、F032；SRC-001、014；绑定项目库年度、单位、项目版本；未批不得缺件惩罚初报；来源失联 U，决定权 H",
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
        "正式预算、项目库或资金安排记录",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M017",
      "name": "M017 L/P4–P6",
      "purpose": "政府采购前经确认的设计图纸、工程量清单，规建/使用单位技术对接人持有；经可信归口确认版本的电子工程文件可直接引用；初报 M005 不能冒充终稿；F015、F025、F033；SRC-001；绑定专业签认时间、图纸/清单版本及同一工程；后续未到阶段 NA，缺 N，图纸不可读 UNREADABLE",
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
        "L/P4–P6",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M018",
      "name": "M018 采购计划、采购方式或合同关联",
      "purpose": "采购计划、采购方式或合同关联，采招部门持有；项目 ID、分包、采购记录；可引用 T04-T01/T02/T03/G50 权威结果，不复制供应商结论；F034；SRC-001、007；由原流程 Owner 签发，只读引用；P2 NA；P6 查不到 U，供应商与工程版本冲突 CONFLICT",
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
        "采购计划、采购方式或合同关联",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M019",
      "name": "M019 正式立项/不同意立项/调整决定",
      "purpose": "正式立项/不同意立项/调整决定，有权校级会议或校内授权机构持有；文号/对象/生效时间；有签发权限的校内审批记录 ID 可替扫描件；会议新闻和聊天“同意”不能替代；F035；SRC-005、009、013；决定必须绑定申请版本与权限范围；未作决定 NEEDS_HUMAN_DECISION，不能作为 P1/P2 缺件",
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
        "正式立项/不同意立项/调整决定",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "M020 T/P3/P7",
      "purpose": "补件或修改说明及受理记录，原申报单位与收件端持有；变更字段、原因、版本和旧结论影响；系统可信变更事件能代单独“说明书”；替换文件须有 supersedes 指向旧 M 版本；F004、F015、F018、F036；SRC-001、013；只作请求/事实变更不自动改正式批准；缺原因 N，旧结论需标失效，模糊 UNREADABLE",
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
        "T/P3/P7",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "M021 撤回或复核申请/争点",
      "purpose": "撤回或复核申请/争点，原申报单位或依法有权主体持有；有授权的书面申请与受理凭据；已核校内复核/撤回流程记录可替纸质；未证存在接口时线下受理；F007、F035、F036；SRC-005、009、013；学校制度未查明，先 P/H；不因用户删除 M001 视为撤回，必须保留旧决定引用",
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
        "撤回或复核申请/争点",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M022",
      "name": "M022 撤回处置/复核终局或阶段性正式处理记录",
      "purpose": "撤回处置/复核终局或阶段性正式处理记录，实际有权机关持有；复核意见/决定编号及其效力；可信有权签发决定 ID，原案引用且不得复制成新立项决定；F035、F036；SRC-005、009、013；只能在有权机关出具后产生；先前缺席不是申请缺件；来源失联 U、不认可签发权 H",
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
        "撤回处置/复核终局或阶段性正式处理记录",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M023",
      "name": "M023 A/L/P4（仅 H 类基建）",
      "purpose": "五年基本建设规划批复、项目储备库及当年项目选择记录；规划建设部门/教育厅权威来源持有；可信校内基建储备库 ID 和上级规划批复引用；项目库新闻不替代个案立项；普通 P1 维修不要求；F037、F038；SRC-016 第 10 条、SRC-017 第 8/10 条；绑定规划期、项目 ID、建设规模与批复版本；阶段未到 NA，源不可取 U，项目不在库由规建/省级机关判断而不自动拒绝",
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
        "A/L/P4（仅 H 类基建）",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M024",
      "name": "M024 L/P4–P5（仅达到省级申报阶段的 H 类）",
      "purpose": "学校基建项目省教育厅申报包；校方规建/党委办公室、校长办公室及有权签发机关持有：请示、一年内有效的学校党委会和校长办公会集体决策文件、论证报告、建设安全条件和设施综合分析；以校内可信决策记录/报送系统回执引用，不从公开“会议通报”推断每案已集体同意；小型维修内部预审 P1/P2 不应索这些省级文件；F037、F039；SRC-016 第 11–12 条；绑定项目、单位、决策范围、签发日与报送版本；已进入正式省级申报且确定义务才 N，未进入 NA，原文不可调 U，权限/完整性有疑 H",
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
        "L/P4–P5（仅达到省级申报阶段的 H 类）",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M025",
      "name": "M025 L/P5–P6（仅适用 H 类、由外机关后出）",
      "purpose": "四川省教育厅的项目批复与投资主管部门的审批/核准决定（分别两项原签发记录），学校基建/外机关持有；可信省级/投资主管部门电子文书及受理回执 ID 引用，核批准范围、资金模式、时间、建设规模；不能上传一个截图后视为两个批复；F037、F040、F035；SRC-016 第 11–13 条；两种文书分别 issuer/version 与项目 digest；未走到 P5 NA，单项缺批/在办 NEEDS_HUMAN_DECISION，来源不可取 U，伪造/错项目 CONFLICT",
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
        "L/P5–P6（仅适用 H 类、由外机关后出）",
        "核对来源、归属、版本与可读性；制度或权限不明时转人工复核"
      ],
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "rules",
      "name": "原件第 08 节审核规则",
      "description": "源自 T04-T09 原件第 08 节规则表；研究来源与案卷材料分离，未确认政策只生成语义提示或人工待办。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "案卷唯一身份和当前阶段",
          "requirement": "规则：R001 案卷唯一身份和当前阶段；列2：P0–P7：T=同一项目绑定一个可信案卷且阶段事件连贯；F=不同项目/编号被错误合并；U=可信案卷来源未得；列3：F001/F002/F003/F004；M020（仅有变更时）；SRC-001/013（项目边界）；列4：比对 Case 主端唯一标识、模板固定 ID、项目与操作事件版本；内部数据事实以可信主进程 E1 为准，不从用户文件生成 Case ID。多情形可在一案切换，不擅造第二立项；列5：T:PASS_FACT / F:CONFLICT / U:SOURCE_UNAVAILABLE；由 Case Owner 查案卷写入与映射；不得把旧 Run 当新版审核",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "个人报修与单位立项身份分流",
          "requirement": "规则：R002 个人报修与单位立项身份分流；列2：P0–P2：T=仅个人报修或已有后勤工单；F=明确系单位正式项目申报；U=报告人与单位申请关系未明；列3：F003/F005/F006/F030；M011/M001（按阶段择一）；SRC-001/004/013；列4：以工单 E1、单位 M001 E2 与事实目的区分；师生学段不产生项目批准资格；P0 不问正式签章；列5：T:PASS_FACT（报修路由事实） / F:NOT_APPLICABLE（报修专属分支） / U:NEEDS_HUMAN_DECISION；后勤/使用单位确认，不能用个人账号签报建",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "工程地址与资产点位同一性",
          "requirement": "规则：R003 工程地址与资产点位同一性；列2：P0–P3：T=工程可明确指向同一校区楼栋/房号/区域；F=明确不同地点；U=同名建筑或无稳定点位；列3：F010/F011/F012/F015；M002/M003/M004；SRC-001/013；列4：E1 国资标识、使用单位 E2、现场 E3 三源按拍摄/资产有效时点比对；一楼多房不得只靠文本同名合并；无资产编码时允许人工定位；列5：T:PASS_FACT / F:CONFLICT / U:NEEDS_MATERIAL（缺地点说明）或 SOURCE_UNAVAILABLE（国资来源不可达）；国资处/规建处消歧",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r004",
          "title": "申报单位与实际管理权",
          "requirement": "规则：R004 申报单位与实际管理权；列2：P1–P3：T=申报单位对该公房/设施有使用或受托管理资格；F=国资记录确证为别单位且无有效授权；U=移交或授权仍待核；列3：F005/F009/F010/F013；M003/M015；SRC-001/013；列4：查 E1 国资和组织有效期，受理时点必须落在移交授权期内；临时借用/共用场地交有权单位认定，不能单方改台账；列5：T:PASS_FACT / F:CONFLICT / U:SOURCE_UNAVAILABLE 或 NEEDS_HUMAN_DECISION；国资处核权，规建决定入口可否受理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "工程性质与维修通道分类",
          "requirement": "规则：R005 工程性质与维修通道分类；列2：P1–P2：T=经规建认定为校舍维修/装修等；F=明确非工程物资服务；U=小型新扩建、用途改变或结构属性不明；列3：F003/F014/F015/F025；M002/M005；SRC-001/013/015；列4：2025 类别只能历史比照；E2 描述结合规建 E1 专业分类，不能由文件名“小修”决定；非工程路由 T04-T01 等；列5：T:PASS_FACT（性质事实） / F:NOT_APPLICABLE（维修入口） / U:POLICY_UNCONFIRMED＋NEEDS_HUMAN_DECISION 分不同检查节点；规建分类",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "紧急危险报告和应急升级",
          "requirement": "规则：R006 紧急危险报告和应急升级；列2：P0–P1：T=现场有可疑安全险情；F=专业判断无紧急处置需求；U=风险无法判断；列3：F004/F011/F012/F016/F030；M004/M011/M013；SRC-002/004/013；列4：立即移交后勤/保卫/规建 E1 专业值守；个人照片 E3 仅定位、不做结构/消防结论。是否绕过 2026 申报窗口未证；不等待完整 M013 耽误报告；列5：T:NEEDS_HUMAN_DECISION / F:NOT_APPLICABLE / U:NEEDS_HUMAN_DECISION；安全主管实时处置，事后补事件证据；禁止 AI 发开工指令",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "项目问题、事由与预期改善事实",
          "requirement": "规则：R007 项目问题、事由与预期改善事实；列2：P1–P3：T=单位说清何处何问题与预计改善；F=明确与本项目无关；U=只有“装修一下”等泛称；列3：F014/F015/F016/F017；M002/M001（正式阶段）；SRC-001；列4：比对 E2 申请内容与 E3 照片/勘查，有效版本限本项目；技术必要性属于 E1 规建判断而非 AI；列5：T:PASS_FACT（陈述完整） / F:CONFLICT（明显不对应） / U:NEEDS_MATERIAL；使用单位补具体范围，规建复核必要性",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "当期申报批次/政策原文适用性",
          "requirement": "规则：R008 当期申报批次/政策原文适用性；列2：P1–P3：T=取得覆盖项目、资金、年度及类型的现行 E0 原文；F=明确只取得过期年度文件；U=查无可确认的当期文本；列3：F020/F021/F022；M014；SRC-001/005/012/015；列4：校本正式制度＋当期通知联立校对发布日期、生效废止与批次；2025/2024 限其年度。官网附件 412 不能推定表内栏位；列5：T:PASS_FACT（政策身份已核） / F:POLICY_UNCONFIRMED / U:POLICY_UNCONFIRMED；规建/校办提供版本，2026 默认 U",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "年度入围估算门槛的适用判断",
          "requirement": "规则：R009 年度入围估算门槛的适用判断；列2：P2：T=R008 已 PASS 且当期有效规定有明确门槛；F=现行制度明示该类不设该门槛；U=当期阈值/计量口径未知；列3：F018/F020/F021/F026；M007/M014；SRC-001；列4：仅 2025 SRC-001 的“≥5 万元”可作历史回放；当年工程分项估算 E2 和 E0 原文双条件匹配；跨年一律不硬拒绝；列5：T:PASS_FACT（仅金额/条款比较事实） / F:NOT_APPLICABLE / U:POLICY_UNCONFIRMED；规建/财务核该年度，门槛不满足也交人工决定受理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "报送窗口与可信收件时点",
          "requirement": "规则：R010 报送窗口与可信收件时点；列2：P2：T=适用 E0 的截止与 E1 签收回执均可比；F=当期明确无固定窗口；U=2026 截止或真实签收时间不明；列3：F020/F021/F022/F023；M014/M015/M001（回执）；SRC-001；列4：比 receivedAt 与当期截止，时区为北京时间；2025 的 2024-10-11 17:00 只历史使用。本机时间、上传时间不等于受理时间；列5：T:PASS_FACT（时间关系事实，逾期仍需机关判断） / F:NOT_APPLICABLE / U:POLICY_UNCONFIRMED 或 SOURCE_UNAVAILABLE；规建收件端，例外走人工",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "当前正式申请表与同一项目归属",
          "requirement": "规则：R011 当前正式申请表与同一项目归属；列2：P2：T=当期有效政策要求正式单位提交 M001；F=仍 P0/P1 或该事项被确认为无需独立报建；U=当期是否要求此表未证；列3：F005/F015/F017/F020/F023；M001/M002；SRC-001/012；列4：E2 申报表标题、项目、批次与收件凭据 E1 对照；2025 一事一表仅历史有效；完整内嵌说明不重复要求 M002；列5：T:PASS_FACT（内容齐且可读）或 NEEDS_MATERIAL（确应有而无） / F:NOT_APPLICABLE / U:POLICY_UNCONFIRMED；单位补表，规建确认版本",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "代理经办权限和主体唯一对应",
          "requirement": "规则：R012 代理经办权限和主体唯一对应；列2：P2/P3/P7：T=授权经办人凭可信组织身份办理对应项目；F=确非受托经办且本人无权；U=只有 Renderer 身份或委托期未知；列3：F005/F007/F008/F023；M015/M001；SRC-001/013；列4：E1 组织岗位＋可核授权起止与 E1 收件时间比较；E2 签名截图不足；机关主动操作无需强迫申请人上传同一组织名录；列5：T:PASS_FACT / F:NEEDS_HUMAN_DECISION / U:SOURCE_UNAVAILABLE 或 NEEDS_HUMAN_DECISION；组织/申报单位人工核身份，不能赋审批权",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "单位负责人核签与公章可信性",
          "requirement": "规则：R013 单位负责人核签与公章可信性；列2：P2：T=当期有效政策要求负责人核签/盖章；F=该类正式申报经证无需此签章；U=年度签章条款不明；列3：F005/F008/F024；M001/M006/M015；SRC-001/012；列4：2025 通知明确负责人签章；核组织任期、签章时间、签报项目版本，E2 清晰扫描仅证明“可见”，不证明印章有效；列5：T:PASS_FACT（完成可信验证）、NEEDS_MATERIAL（无必需签章）或 NEEDS_HUMAN_DECISION（真伪未证） / F:NOT_APPLICABLE / U:POLICY_UNCONFIRMED；校办/单位负责人核实",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "工程范围的图纸清单可表达性",
          "requirement": "规则：R014 工程范围的图纸清单可表达性；列2：P1–P3：T=专业能以地点、工程部位和工程量合理界定；F=明确非工程可表达事项；U=需专业勘查后才能分类；列3：F014/F015/F025；M002/M005；SRC-001；列4：2025 的工程报建入口要求，P1 使用 E2 示意/文字，E1 规建专业意见优先；M017 是 P4 终稿，不能提前索；列5：T:PASS_FACT（描述与类型） / F:NOT_APPLICABLE（该年度工程报建） / U:NEEDS_HUMAN_DECISION；规建技术经办，缺地点/部位 NEEDS_MATERIAL",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "工程单项估算与资金属性区分",
          "requirement": "规则：R015 工程单项估算与资金属性区分；列2：P1–P3：T=有本工程估算及说明且与范围一致；F=估算证实属于另一采购/工程；U=尚待造价测算；列3：F018/F019/F025；M007/M002；SRC-001/014；列4：E2 单项工程估算与 E1 专业造价对照；设备费用单列，P1 拟资金不升格为 M016 已批资金；阶段需算价时才求精确；列5：T:PASS_FACT（估算事实） / F:CONFLICT / U:NEEDS_MATERIAL 或 NEEDS_HUMAN_DECISION；规建造价/财务各查职责内部分",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "当期论证阈值和报告义务",
          "requirement": "规则：R016 当期论证阈值和报告义务；列2：P2：T=当期 E0 明确触发且本工程金额越阈；F=当期规则明确未触发；U=2026 门槛或费用组成未定；列3：F018/F020/F021/F026/F027；M007/M008/M014；SRC-001；列4：2025 严格 >50 万历史实例，不取 ≥；算工程项目而非仪器总价；E0 条款与 E2/E1 估算同批次。无 E0 不得因缺 M008 拒收；列5：T:PASS_FACT（已交有效 M008）或 NEEDS_MATERIAL / F:NOT_APPLICABLE / U:POLICY_UNCONFIRMED，金额冲突 CONFLICT；规建/专业论证人",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "大型设备安装场地依赖关系",
          "requirement": "规则：R017 大型设备安装场地依赖关系；列2：P1–P2：T=修缮仅为新设备安装/使用环境配套；F=经核独立工程且不依赖设备；U=依赖条件未确认；列3：F014/F015/F028；M009/M002；SRC-001/013；列4：对照 E1 已有设备需求 T04-T01 与 E2 场地水电要求、版本与地点；2025 要随设备一起报计划，2026 仍待核。不强制单独 M001；列5：T:PASS_FACT（关联事实） / F:NOT_APPLICABLE / U:NEEDS_HUMAN_DECISION；设备使用单位与采购归口会办，关联记录不可得则 SOURCE_UNAVAILABLE",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "混合专业分项与相应责任",
          "requirement": "规则：R018 混合专业分项与相应责任；列2：P1–P4：T=含消防/弱电/网络/家具/绿化等多专业；F=证实纯工程无此分项；U=分项、管辖不清；列3：F015/F019/F029；M010/M002；SRC-001/013；列4：E2 分项清单逐项对应原部门 E1 意见/采购需求；建设部分仅立项事实，专业许可/采购批准由各 Owner 出具，2025 同报条件不可跨年硬判；列5：T:PASS_FACT（分项事实完整）或 NEEDS_MATERIAL / F:NOT_APPLICABLE / U:CONFLICT/NEEDS_HUMAN_DECISION；专业归口与规建协调",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "往年未实施案的真实状态",
          "requirement": "规则：R019 往年未实施案的真实状态；列2：P1–P2：T=提出往年项目续报且 E1 记为未实施；F=明确首次申报；U=旧案状态失联或续报规则不明；列3：F015/F018/F020/F031；M012/M002/M007；SRC-002/013；列4：比旧项目 ID、地点、范围、预算、实际实施状态；2024 通知允许特定续报，2026 资格必须 E0 复核；旧同意不自动续效；列5：T:PASS_FACT（旧案未实施事实）＋另检查现行性 / F:NOT_APPLICABLE / U:SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED；规建历史计划管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "重复零星报修/重复项目/拆分疑点",
          "requirement": "规则：R020 重复零星报修/重复项目/拆分疑点；列2：P1–P3：T=同一位置范围跨 M001/M011/M012 有可比重复；F=有权记录证实不同工程；U=工单或历史案不可达；列3：F001/F010/F011/F012/F015/F031；M001/M011/M012；SRC-001/002/004；列4：E1 工单/旧项目与 E2 申报逐工作内容、期间、预算对比；SRC-001 指出不必重复在零星维修申报；疑似拆分不能仅凭相似文字认违规；列5：T:CONFLICT（待核重叠） / F:PASS_FACT（无重复事实） / U:SOURCE_UNAVAILABLE；后勤/规建合并核实",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "小型新建/扩建的独立审批边界",
          "requirement": "规则：R021 小型新建/扩建的独立审批边界；列2：P1：T=项目实质属于新建、扩建、结构/规划用途调整；F=规建确证为常规维修；U=性质未鉴定；列3：F014/F015/F021/F025/F037；M002/M003/M014；SRC-013/015/016/017；列4：省级 SRC-016/017 已给投资主管立项类基建定义与程序，但 SRC-015 校本全文和本项目是否应走省级支路仍待规建认定；不能虚设“金额很小所以免批”，进一步由 R033 分支核法源；列5：T:NEEDS_HUMAN_DECISION（规建定性） / F:NOT_APPLICABLE / U:POLICY_UNCONFIRMED；规建与有权建设审批归口",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "正式受理事实与受理回执",
          "requirement": "规则：R022 正式受理事实与受理回执；列2：P2/P3：T=工程科或当期指定机关可信确认收到本项目当次材料；F=正式阶段经核尚未递交；U=收件日志失联；列3：F004/F005/F020/F023；M001/M015；SRC-001；列4：以 E1 纸质签收/校内记录优先；上传到本工具不等于学校正式受理；2025 历史收件科室需核新批次部门；列5：T:PASS_FACT（已收件事实） / F:NEEDS_MATERIAL（需正式送件而未送） / U:SOURCE_UNAVAILABLE；归口收件人确认，不擅设受理状态",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "预算/项目库的真实决定有无",
          "requirement": "规则：R023 预算/项目库的真实决定有无；列2：P4：T=取得指向该项目的财务正式预算决定；F=仅在申报/答辩阶段且无正式决定；U=财务原始记录不可达；列3：F019/F032；M016/M007；SRC-001/014；列4：E1 财务批文 ID、年度、金额、版本及生效时点比对；SRC-014 新闻不能作单项批复；未到 P4 本规则 NOT_APPLICABLE；列5：T:PASS_FACT（预算文书事实） / F:NEEDS_HUMAN_DECISION（资金未定） / U:SOURCE_UNAVAILABLE；财务/G07 Owner，非 T04-T09 批资金",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "采购前图纸清单正式确认",
          "requirement": "规则：R024 采购前图纸清单正式确认；列2：P4–P6：T=已进入预算下达后的采购前确认；F=仍在 P0–P3；U=签认步骤/文件出处无法核；列3：F015/F025/F033；M005/M017；SRC-001；列4：E1 规建和使用单位签认的 M017 版本覆盖对应工程 M005；确认不等于竣工验收；需比签认时间与采购启动时间；列5：T:PASS_FACT（签认事实）或 NEEDS_MATERIAL / F:NOT_APPLICABLE / U:SOURCE_UNAVAILABLE；规建技术归口，不抢采购决定",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "采购计划和合同只读承接",
          "requirement": "规则：R025 采购计划和合同只读承接；列2：P6：T=外部采招正式计划/合同存在；F=尚未进入采购；U=已有主张但原机关无法核对；列3：F034/F015；M018/M017；SRC-001/006/007；列4：E1 T04-T01/T02/T03 真实 ID/签发部门/工程版本，比图纸与预算归属；采购计划不是立项批准或工程验收；列5：T:PASS_FACT（已有关联事实） / F:NOT_APPLICABLE / U:SOURCE_UNAVAILABLE；采招 Owner 处理采购，T04-T09 仅消费引用",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "有权正式立项决定的存在与真伪",
          "requirement": "规则：R026 有权正式立项决定的存在与真伪；列2：P5：T=存在权限、项目范围、版本及生效时间均可核的正式决定；F=查明确无决定、仍待议；U=决定/权限表不可核；列3：F005/F007/F008/F035；M019/M015；SRC-005/009/013；列4：E1 校方原决定＋当期 E0 分级授权交叉校验；会议信息报道只是审议事实，不代表同意。2020 办法未得，审批层级未知；列5：T:PASS_FACT（决定凭证存在且可信的事实） / F:NEEDS_HUMAN_DECISION / U:SOURCE_UNAVAILABLE 或 POLICY_UNCONFIRMED；真正审批机关落正式决定，模型不写 APPROVED",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "外部决定的工程版本与权限范围",
          "requirement": "规则：R027 外部决定的工程版本与权限范围；列2：P5–P7：T=预算/立项/采购分别绑定正确项目、年度、版本、签发域；F=编号真但属于别项目或旧范围；U=任一必要绑定缺失；列3：F001/F015/F032/F033/F034/F035；M016/M017/M018/M019；SRC-001/005/006/009/014；列4：E1 公文/审批回执按 issuer、decisionId、authorityScope、effectiveAt 与工程版 digest 匹配；旧批准不能覆盖改造后的新地点；列5：T:PASS_FACT（仅引用可消费） / F:CONFLICT / U:SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；原决定 Owner 复核，T04-T09 不重新签发",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "补件请求与定向更正的来源",
          "requirement": "规则：R028 补件请求与定向更正的来源；列2：P3/P7：T=有明确受影响 M/问题与可信受理事件；F=没有补件/变更请求；U=请求来自未授权用户或无目标版本；列3：F001/F004/F007/F036；M020/M001（若受影响）；SRC-001/013；列4：以 E1 受理记录关联 E2 补充件、ruleId、slotId、旧版→新版；受理时限未证，P1 不强令出 P5 签批；仅受影响 R 失效；列5：T:PASS_FACT（变更事件事实） / F:NOT_APPLICABLE / U:NEEDS_HUMAN_DECISION；申报单位和归口收件人确认，再定向重审",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "关键字段/工程范围版本变化",
          "requirement": "规则：R029 关键字段/工程范围版本变化；列2：P2–P7：T=位置、工程范围、估算或设备依赖发生有归属的新版本；F=版本校验确定未变；U=只有替换文件但无可比归属/时间；列3：F005/F010/F015/F018/F028/F029/F036；M002/M003/M005/M007/M009/M010/M020；SRC-001/013；列4：E1 变更事件与 E2 新附件 supersedes、digest、same project 绑定；重审最小依赖集合见 11.3；若已有 M019，原决定只能由原 Owner 处理变更效力；列5：T:PASS_FACT（变更识别）＋旧观察标 STALE_RECHECK_REQUIRED / F:NOT_APPLICABLE / U:CONFLICT；规建核变更，Case Owner 只标记重审",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "撤回意思表示、主体与时点",
          "requirement": "规则：R030 撤回意思表示、主体与时点；列2：P2–P7：T=有原单位获授权的撤回申请；F=仅删除文件/个人撤销工单而无立项撤回；U=权限、可撤回阶段或在建状态未知；列3：F004/F005/F007/F035/F036；M021/M015/M019（有旧决定才引用）；SRC-001/005/009/013；列4：E2 撤回书和 E1 身份/收件验证；必须另核校本可撤回条款及原决定效力；不能覆盖案卷或消除已施工安全责任；列5：T:PASS_FACT（请求事实）＋NEEDS_HUMAN_DECISION（另节点处置） / F:NOT_APPLICABLE / U:POLICY_UNCONFIRMED；规建/原有权机关受理，不自动撤销",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "复核请求的原决定与争点绑定",
          "requirement": "规则：R031 复核请求的原决定与争点绑定；列2：P3/P5/P7：T=有争点、原处置及可核利害主体；F=无复核请求；U=期限/管辖/申请资格未查；列3：F005/F007/F035/F036；M021/M019（或可信不受理决定）；SRC-005/009/013；列4：E1 原决定＋E2 争点/证据版本，适用校本救济条款 E0 尚未得；任何申请不自动赋复核受理资格；列5：T:PASS_FACT（争议请求事实）＋NEEDS_HUMAN_DECISION（独立） / F:NOT_APPLICABLE / U:POLICY_UNCONFIRMED；校方正式复核渠道确定受理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "撤回/复核正式处理结果引用",
          "requirement": "规则：R032 撤回/复核正式处理结果引用；列2：P7：T=已产生并按当期正式授权核验的处理文书；F=尚未出处理结论；U=原决定签发权、版本、效力无法核；列3：F004/F035/F036；M021/M022/M019；SRC-005/009/013；列4：E1 处理文号、issuer、权限、受理案与原案版本关联；2020 办法全文及校本救济条款未得时，即便收到纸质 M022，也不得仅凭印章图像将 T 置真；M022 后出，申请时不可强索；列5：T:PASS_FACT（仅权威处理文书可核事实） / F:NEEDS_HUMAN_DECISION（待校方作出） / U:SOURCE_UNAVAILABLE/POLICY_UNCONFIRMED；原决定或被授权复核机关确认效力",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "省级基建适用性分类",
          "requirement": "规则：R033 省级基建适用性分类；列2：P1→P4，H 类：T=经专业核实为投资主管部门立项的固定资产投资新/改/扩建项目；F=确系不属该法定义的年度维修/零星工单；U=性质或资金/立项类型仍不明；列3：F014/F015/F021/F037；M002/M005/M014；SRC-015/016/017；列4：以 SRC-016 第 2–4 条法源与规建 E1 技术分类比对；项目金额、用户命名“装修”或“很小”均不单独决定是否属基建，校本 SRC-015 仍待正式全文；列5：T:PASS_FACT（基建类别可核，进入 R034–036 条件分支） / F:NOT_APPLICABLE（仅省级基建支路） / U:POLICY_UNCONFIRMED 或 NEEDS_HUMAN_DECISION；校园规划与建设处与省教育厅有关业务部门作最终适用判断",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "基建规划与储备库关联",
          "requirement": "规则：R034 基建规划与储备库关联；列2：P4、F037=true：T=有同项目规划批复/储备记录且版本、位置、建设规模相容；F=项目未进入省级基建规划核验阶段；U=库与规划批复不可得或变动后效力不清；列3：F037/F038/F015；M023/M002；SRC-016 第 10 条、SRC-017 第 8/10 条；列4：比权威规划批复、库项目 ID、规划期、项目范围 digest，公开项目库答辩新闻 SRC-014 不代替批复，当前 P1 不预索；列5：T:PASS_FACT（仅关联事实） / F:NOT_APPLICABLE / U:SOURCE_UNAVAILABLE 或 NEEDS_HUMAN_DECISION；校方规建/省教育厅核规划与项目选择权",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r035",
          "title": "基建向省教育厅正式申报包事实",
          "requirement": "规则：R035 基建向省教育厅正式申报包事实；列2：P4–P5、F037=true 且确已进入省级申报：T=正式申报包及学校集体决策等当前要求已形成；F=仍在校内酝酿/年度维修阶段；U=集体决策原文、签发日期、真实申报状态未明；列3：F037/F039/F005/F015；M024/M015；SRC-016 第 11–12 条；列4：必须区分校党委会和校长办公会的个案有效决策原件与公开会议摘要；校级会议决策文件在省级申报时按上位法检查一年内有效，不能在 P1 过早报缺；列5：T:PASS_FACT（文件齐备/签发事实，不是省级批准）或已进入阶段确缺时 NEEDS_MATERIAL / F:NOT_APPLICABLE / U:SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION；校办/规建确认，教育厅决定是否受理",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r036",
          "title": "省教育厅与投资主管部门外部决定不混同",
          "requirement": "规则：R036 省教育厅与投资主管部门外部决定不混同；列2：P5–P6、F037=true 且已到外部审核阶段：T=分别具备指向同一项目版本的教育厅批复与投资主管部门审批/核准；F=尚未进入外部决定阶段；U=只有一个批准、签发权未知或存在错项目记录；列3：F037/F039/F040/F015；M024/M025/M019；SRC-016 第 11–13 条；列4：对两份权威 E1 记录分别验证 issuer、documentNumber、approvalScope、effectiveAt、fundingMode、version；2023 法规不是本校个人批准书，学校内部 M019 也不替代外部决定；列5：T:PASS_FACT（已有外部文书的事实，不签发新批复） / F:NOT_APPLICABLE / U:SOURCE_UNAVAILABLE、CONFLICT 或 NEEDS_HUMAN_DECISION；省教育厅与法定投资主管部门各自签发，规建只读承接",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "P0",
      "name": "发现/报修（紧急安全风险转人工）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P1",
      "workflowOwner": "local"
    },
    {
      "id": "P1",
      "name": "单位需求预备（归属、范围、必要性和估算）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P2",
      "returnToStageId": "P0",
      "workflowOwner": "local"
    },
    {
      "id": "P2",
      "name": "正式申报/受理（仅当前年度规则确认后）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P3",
      "returnToStageId": "P1",
      "workflowOwner": "local"
    },
    {
      "id": "P3",
      "name": "补件/事实核验（只请求当前阶段必需材料）",
      "kind": "supplement-wait",
      "executorRole": "reviewer",
      "nextStageId": "P4",
      "returnToStageId": "P2",
      "workflowOwner": "local"
    },
    {
      "id": "P4",
      "name": "技术与预算/项目库衔接（专业意见只读引用）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "P5",
      "returnToStageId": "P3",
      "workflowOwner": "local"
    },
    {
      "id": "P5",
      "name": "有权人工决定/回填（只记录真实决定）",
      "kind": "manual-review",
      "executorRole": "teacher",
      "nextStageId": "P6",
      "returnToStageId": "P4",
      "workflowOwner": "local"
    },
    {
      "id": "P6",
      "name": "后续关联（非立项必备；采购/施工/验收独立）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "P5",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "review-observations",
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
      "id": "change-impact-history",
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
  "templateId": "T04-T09",
  "name": "校舍维修、装修与小型建设工程立项审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T04-T09.md",
  "sourceDocumentSha256": "87b125596d024b127376e5fda8de84127ff5e0073a5b75972e7f1b015912db25",
  "researchOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T04-T09.md",
  "researchOriginalBlobSha1": "0ed34dcc3dbabcb1ae856437f62b5d0ae5fbdb77",
  "manifestBytes": 154708,
  "manifestSha256": "87b125596d024b127376e5fda8de84127ff5e0073a5b75972e7f1b015912db25",
  "manifestSourceSnapshot": "2026-10-23（当前可访问的最新正式 MD）",
  "researchAsOf": "2026-10-23",
  "officialSchoolTemplate": false,
  "researchStatus": "REVIEWED_WITH_INTEGRATION_GUARD_OPEN",
  "policyEvidenceStatus": "PARTIAL",
  "sourceHashNormalization": "Reviewed copy is the current research blob plus one LF to match the manifest; the research-original blob is unchanged.",
  "fields": [
    {
      "fieldId": "F001",
      "key": "id",
      "sourceLabel": "案卷标识 id",
      "scope": "case"
    },
    {
      "fieldId": "F002",
      "key": "f002",
      "sourceLabel": "模板标识 enum=T04-T09",
      "scope": "case"
    },
    {
      "fieldId": "F003",
      "key": "f003",
      "sourceLabel": "办理情形 enum A–H/I1–I4",
      "scope": "case"
    },
    {
      "fieldId": "F004",
      "key": "f004",
      "sourceLabel": "生命周期阶段 enum P0–P7",
      "scope": "case"
    },
    {
      "fieldId": "F005",
      "key": "f005",
      "sourceLabel": "申报单位编号与名称 ref",
      "scope": "subject"
    },
    {
      "fieldId": "F006",
      "key": "f006",
      "sourceLabel": "报告者身份类别 enum 师生/教职工/住户/其他/未知",
      "scope": "subject"
    },
    {
      "fieldId": "F007",
      "key": "f007",
      "sourceLabel": "经办人可信身份/委托 ref",
      "scope": "subject"
    },
    {
      "fieldId": "F008",
      "key": "f008",
      "sourceLabel": "单位主要负责人核签身份 ref",
      "scope": "subject"
    },
    {
      "fieldId": "F009",
      "key": "f009",
      "sourceLabel": "资产管理责任人 ref",
      "scope": "subject"
    },
    {
      "fieldId": "F010",
      "key": "f010",
      "sourceLabel": "资产编码/公房标识 id?",
      "scope": "subject"
    },
    {
      "fieldId": "F011",
      "key": "f011",
      "sourceLabel": "校区、楼栋、建筑名 text/ref",
      "scope": "subject"
    },
    {
      "fieldId": "F012",
      "key": "f012",
      "sourceLabel": "房间、道路、区域点位 text/ref",
      "scope": "subject"
    },
    {
      "fieldId": "F013",
      "key": "f013",
      "sourceLabel": "房屋使用/管理责任 status/ref",
      "scope": "subject"
    },
    {
      "fieldId": "F014",
      "key": "f014",
      "sourceLabel": "工程性质 enum 修缮/装修/配套/新建/扩建/结构/其他",
      "scope": "subject"
    },
    {
      "fieldId": "F015",
      "key": "f015",
      "sourceLabel": "拟实施工程范围与地点版本 text/ref",
      "scope": "subject"
    },
    {
      "fieldId": "F016",
      "key": "f016",
      "sourceLabel": "现状问题/安全紧迫度 text/enum/boolean?",
      "scope": "subject"
    },
    {
      "fieldId": "F017",
      "key": "f017",
      "sourceLabel": "修缮事由与预期效益 text",
      "scope": "subject"
    },
    {
      "fieldId": "F018",
      "key": "f018",
      "sourceLabel": "单项估算金额 money?",
      "scope": "subject"
    },
    {
      "fieldId": "F019",
      "key": "f019",
      "sourceLabel": "拟资金来源/经费归口 enum/ref",
      "scope": "subject"
    },
    {
      "fieldId": "F020",
      "key": "f020",
      "sourceLabel": "申报年度/计划批次 ref",
      "scope": "case"
    },
    {
      "fieldId": "F021",
      "key": "f021",
      "sourceLabel": "适用政策原文版本与效力 ref/status",
      "scope": "case"
    },
    {
      "fieldId": "F022",
      "key": "f022",
      "sourceLabel": "当期报送截止 dateTime?",
      "scope": "case"
    },
    {
      "fieldId": "F023",
      "key": "f023",
      "sourceLabel": "可信提交/签收时间 dateTime?",
      "scope": "case"
    },
    {
      "fieldId": "F024",
      "key": "f024",
      "sourceLabel": "申请单位负责人签章真实性 status",
      "scope": "case"
    },
    {
      "fieldId": "F025",
      "key": "f025",
      "sourceLabel": "可用工程图纸和工程量清单表达 boolean?",
      "scope": "subject"
    },
    {
      "fieldId": "F026",
      "key": "f026",
      "sourceLabel": "当年金额论证触发结果 boolean?/status",
      "scope": "case"
    },
    {
      "fieldId": "F027",
      "key": "f027",
      "sourceLabel": "论证材料关联及有效性 status/ref",
      "scope": "case"
    },
    {
      "fieldId": "F028",
      "key": "f028",
      "sourceLabel": "大型设备/安装环境依赖 boolean?/ref",
      "scope": "subject"
    },
    {
      "fieldId": "F029",
      "key": "f029",
      "sourceLabel": "网络/消防/家具/绿化等复合项 ref[]",
      "scope": "subject"
    },
    {
      "fieldId": "F030",
      "key": "f030",
      "sourceLabel": "既有报修工单 ref?",
      "scope": "case"
    },
    {
      "fieldId": "F031",
      "key": "f031",
      "sourceLabel": "往年申报/未实施项目 ref?",
      "scope": "subject"
    },
    {
      "fieldId": "F032",
      "key": "f032",
      "sourceLabel": "适用年度项目库/正式预算决定 ref/status?",
      "scope": "case"
    },
    {
      "fieldId": "F033",
      "key": "f033",
      "sourceLabel": "政府采购前正式图纸清单确认 ref?",
      "scope": "case"
    },
    {
      "fieldId": "F034",
      "key": "f034",
      "sourceLabel": "采购计划/合同关联 ref?",
      "scope": "case"
    },
    {
      "fieldId": "F035",
      "key": "f035",
      "sourceLabel": "学校正式立项/不予立项决定 ref/status?",
      "scope": "case"
    },
    {
      "fieldId": "F036",
      "key": "f036",
      "sourceLabel": "补件、变更、撤回、复核请求/版本 enum/ref",
      "scope": "case"
    },
    {
      "fieldId": "F037",
      "key": "f037",
      "sourceLabel": "投资主管部门立项类基本建设适用性 boolean?/enum",
      "scope": "case"
    },
    {
      "fieldId": "F038",
      "key": "f038",
      "sourceLabel": "基建规划/储备库权威项目引用 ref?",
      "scope": "case"
    },
    {
      "fieldId": "F039",
      "key": "f039",
      "sourceLabel": "基建项目校内集体决策与省教育厅申报阶段 ref/status?",
      "scope": "case"
    },
    {
      "fieldId": "F040",
      "key": "f040",
      "sourceLabel": "省教育厅与投资主管部门分别作出的批准/核准 ref[]/status",
      "scope": "case"
    }
  ],
  "materials": [
    {
      "materialId": "M001",
      "name": "M001 当期《立项维修工程报建申请表》"
    },
    {
      "materialId": "M002",
      "name": "M002 P/P1，C 可内嵌 M001"
    },
    {
      "materialId": "M003",
      "name": "M003 房屋/资产使用权与管理责任记录"
    },
    {
      "materialId": "M004",
      "name": "M004 现场照片、勘查和现状证据"
    },
    {
      "materialId": "M005",
      "name": "M005 P/P1–P3"
    },
    {
      "materialId": "M006",
      "name": "M006 C/P2，A"
    },
    {
      "materialId": "M007",
      "name": "M007 P/P1，C 视当期"
    },
    {
      "materialId": "M008",
      "name": "M008 超过该批次论证门槛的报告与详细施工内容"
    },
    {
      "materialId": "M009",
      "name": "M009 设备安装环境/项目依赖证明"
    },
    {
      "materialId": "M010",
      "name": "M010 混合工程分项与专业责任清单"
    },
    {
      "materialId": "M011",
      "name": "M011 零星维修工单/勘查转介记录"
    },
    {
      "materialId": "M012",
      "name": "M012 往年报建件及“未实施”状态"
    },
    {
      "materialId": "M013",
      "name": "M013 突发安全风险/紧急处置记录"
    },
    {
      "materialId": "M014",
      "name": "M014 当期校发制度/年度报建通知全文"
    },
    {
      "materialId": "M015",
      "name": "M015 组织授权、收件回执和可信经办记录"
    },
    {
      "materialId": "M016",
      "name": "M016 正式预算、项目库或资金安排记录"
    },
    {
      "materialId": "M017",
      "name": "M017 L/P4–P6"
    },
    {
      "materialId": "M018",
      "name": "M018 采购计划、采购方式或合同关联"
    },
    {
      "materialId": "M019",
      "name": "M019 正式立项/不同意立项/调整决定"
    },
    {
      "materialId": "M020",
      "name": "M020 T/P3/P7"
    },
    {
      "materialId": "M021",
      "name": "M021 撤回或复核申请/争点"
    },
    {
      "materialId": "M022",
      "name": "M022 撤回处置/复核终局或阶段性正式处理记录"
    },
    {
      "materialId": "M023",
      "name": "M023 A/L/P4（仅 H 类基建）"
    },
    {
      "materialId": "M024",
      "name": "M024 L/P4–P5（仅达到省级申报阶段的 H 类）"
    },
    {
      "materialId": "M025",
      "name": "M025 L/P5–P6（仅适用 H 类、由外机关后出）"
    }
  ],
  "sources": [
    {
      "srcId": "SRC-001",
      "title": "《关于报送2025年度立项维修工程计划的通知》",
      "url": "https://news.cdut.edu.cn/info/1005/47979.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-002",
      "title": "《关于报送2024年立项维修工程计划的通知》",
      "url": "https://news.cdut.edu.cn/info/1005/46152.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-003",
      "title": "《部门简介》",
      "url": "https://gjc.cdut.edu.cn/bmgk/bmjj.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-004",
      "title": "《楼寓服务》“零星维修报修”服务事项及《零星维修》",
      "url": "https://clhq.cdut.edu.cn/fwdt1/lyfw.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-005",
      "title": "《校长办公会通报》校长办公会纪要〔2020〕28号",
      "url": "https://dbxb.cdut.edu.cn/__local/E/C1/E8/3748EB0C4C1C131C60C0FC66371_B2E04EC2_13433.pdf",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-006",
      "title": "《成都理工大学采购验收管理办法》（成理校发〔2023〕11号）",
      "url": "https://gz.cdut.edu.cn/__local/2/CC/13/647DE095C814922158068435485_A6347BE6_67024.pdf",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-007",
      "title": "《关于开展2025年度采购工作的通知》",
      "url": "https://cg.cdut.edu.cn/info/1008/4398.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-008",
      "title": "《关于〈成都理工大学采购管理办法（试行）〉的补充说明》",
      "url": "https://cg.cdut.edu.cn/info/1008/3280.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-009",
      "title": "《校长办公会通报》校长办公会纪要〔2025〕2号",
      "url": "https://dbxb.cdut.edu.cn/__local/C/D9/81/4E84870A46244D8C4732F45B432_5EB6DD05_26BF8.pdf",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-010",
      "title": "《四川省省属高校基本建设管理办法》（川教〔2015〕37号）",
      "url": "https://sjc.cdut.edu.cn/info/1084/1058.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-011",
      "title": "《关于暑期校园施工期间道路交通组织调整的公告》",
      "url": "https://news.cdut.edu.cn/info/1005/55068.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-012",
      "title": "《立项维修工程报建申请表》2025 年通知所附 DOCX",
      "url": "https://news.cdut.edu.cn/system/_content/download.jsp?owner=1464571441&urltype=news.DownloadAttachUrl&wbfileid=14923832",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-013",
      "title": "《成都理工大学国有资产管理办法》（成理校发〔2021〕19号）",
      "url": "https://gz.cdut.edu.cn/__local/7/BF/5C/359363FECC36DD8F19D78A72F13_250F0B0E_72048.pdf",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-014",
      "title": "《学校召开2026年项目库申报答辩暨收入与预算规划委员会会议》",
      "url": "https://jcc.cdut.edu.cn/info/1014/2651.htm",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-015",
      "title": "《成都理工大学基本建设管理办法》",
      "url": "https://gjc.cdut.edu.cn/info/1017/1850.htm",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "srcId": "SRC-016",
      "title": "《四川省省属高校基本建设管理办法》（川教〔2015〕37号）",
      "url": "https://sjc.cdut.edu.cn/info/1084/1058.htm",
      "evidenceStatus": "PARTIAL"
    },
    {
      "srcId": "SRC-017",
      "title": "原始模板来源 SRC-017",
      "url": "https://www.ncvcct.edu.cn/fzghc/2026_05/27_15/content-27347.html",
      "evidenceStatus": "PARTIAL"
    }
  ],
  "criteria": [
    {
      "sectionId": "rules",
      "criterionId": "r001",
      "srcIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r002",
      "srcIds": [
        "SRC-001",
        "SRC-004",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r003",
      "srcIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r004",
      "srcIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r005",
      "srcIds": [
        "SRC-001",
        "SRC-013",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r006",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r007",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r008",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-012",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r009",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r010",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r011",
      "srcIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r012",
      "srcIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r013",
      "srcIds": [
        "SRC-001",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r014",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r015",
      "srcIds": [
        "SRC-001",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r016",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r017",
      "srcIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r018",
      "srcIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r019",
      "srcIds": [
        "SRC-002",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r020",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r021",
      "srcIds": [
        "SRC-013",
        "SRC-015",
        "SRC-016",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r022",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r023",
      "srcIds": [
        "SRC-001",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r024",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r025",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r026",
      "srcIds": [
        "SRC-005",
        "SRC-009",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r027",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-006",
        "SRC-009",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r028",
      "srcIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r029",
      "srcIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r030",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-009",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r031",
      "srcIds": [
        "SRC-005",
        "SRC-009",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r032",
      "srcIds": [
        "SRC-005",
        "SRC-009",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r033",
      "srcIds": [
        "SRC-015",
        "SRC-016",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r034",
      "srcIds": [
        "SRC-016",
        "SRC-017",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": false
    },
    {
      "sectionId": "rules",
      "criterionId": "r035",
      "srcIds": [
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    },
    {
      "sectionId": "rules",
      "criterionId": "r036",
      "srcIds": [
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL",
      "policyDependent": true
    }
  ],
  "sourceStages": [
    {
      "id": "P0",
      "name": "发现/报修",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "P1",
      "name": "单位需求预备",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "P2",
      "name": "正式申报/受理",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "P3",
      "name": "补件/事实核验",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "P4",
      "name": "技术与预算/项目库衔接",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "P5",
      "name": "有权人工决定/回填",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "P6",
      "name": "后续关联（非立项必备）",
      "sourceSection": "03.1",
      "mainline": true
    },
    {
      "id": "P7",
      "name": "后置补件/变更/撤回/复核",
      "sourceSection": "03.1",
      "mainline": false,
      "optionalBranch": true
    }
  ],
  "stageModelNote": "TemplateVersion.stages 映射原件 §03.1 P0–P6 主线。P7 是条件触发的后置补件/变更/撤回/复核分支，保存在 r02Metadata.sourceStages；不得把它当作所有项目必经步骤。P5 仅记录真实有权决定；P6 只读关联采购/施工/验收/审计/支付后续证据，不批准立项或开工。紧急安全风险 P0 立即人工分流，不等待年度申报材料。",
  "resultCodes": [
    {
      "code": "PASS_FACT",
      "meaning": "当前项目/批次/来源版本上的指定事实有权威证据支持且无冲突；绝非学校立项通过。"
    },
    {
      "code": "NOT_APPLICABLE",
      "meaning": "触发条件明确为假，或材料属于尚未到来的阶段；记录原因。"
    },
    {
      "code": "NEEDS_MATERIAL",
      "meaning": "当前阶段适用且必需的事实材料缺失。"
    },
    {
      "code": "CONFLICT",
      "meaning": "同项目、同口径、相容时点上的有效证据存在关键相反值或错误关联。"
    },
    {
      "code": "UNREADABLE",
      "meaning": "已提交文件可定位，但打不开、缺关键页或扫描模糊，无法可靠提取事实。"
    },
    {
      "code": "SOURCE_UNAVAILABLE",
      "meaning": "应由校方持有人/权威系统提供的记录暂不可获取。"
    },
    {
      "code": "POLICY_UNCONFIRMED",
      "meaning": "适用年度、工程类型、权限或期限的现行政策版本不确定。"
    },
    {
      "code": "NEEDS_HUMAN_DECISION",
      "meaning": "技术必要性、安全处置、权限真伪、审批或变更/复核需要有权人员决定。"
    }
  ],
  "outputContract": [
    {
      "id": "review-observations",
      "sourceType": "ReviewObservation",
      "sourceSection": "10.2",
      "runtimeKind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "review-issues",
      "sourceType": "ReviewIssue",
      "sourceSection": "10.2",
      "runtimeKind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "review-todos",
      "sourceType": "ReviewTodo",
      "sourceSection": "10.2",
      "runtimeKind": "supplement-list",
      "audience": "teacher"
    },
    {
      "id": "external-decision-reference",
      "sourceType": "ExternalDecisionRef",
      "sourceSection": "10.2",
      "runtimeKind": "item-feedback",
      "audience": "teacher",
      "readOnly": true
    },
    {
      "id": "change-impact-history",
      "sourceType": "ChangeImpact",
      "sourceSection": "10.2",
      "runtimeKind": "item-feedback",
      "audience": "reviewer",
      "readOnly": true
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
