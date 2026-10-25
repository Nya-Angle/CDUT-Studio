import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "T05-T05",
  "version": 1,
  "schemaVersion": 2,
  "name": "教学成果奖与教学改革成果申报审核",
  "description": "本地研究模板 · 非校方正式模板。成都理工大学教学成果奖、教学改革成果参评或推荐申报的申请资格、事实证据和必要前置程序核验；含本科、研究生及校级、省级、国家级不同批次的同模板情形；不负责授奖、绩效或职称认定。政策证据状态为 PARTIAL；仅用于本地事实预审与问题提示，不代表校方授权，不生成学校远端回写或正式批准。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T05-T05 来自 R02 research-original；非校方正式模板，校内授权和现行政策尚未全部确认；SRC IDs 仅为研究来源，不是案卷 SourceRef。",
  "objectType": "project",
  "displayName": {
    "template": "T05-T05 · 教学成果奖与教学改革成果申报审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "批次·批次 ID/年度 S",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "L0 每次申报；原发文机关通知 M001 标题文号、来源版本；P0；无权威批次：POLICY_UNCONFIRMED，不得编造届别。"
    },
    {
      "key": "F002",
      "label": "批次·奖级 E（校/省/国家）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "L0；M001 正文奖级；申报表 M002 须一致；P0；与申请书冲突：CONFLICT。"
    },
    {
      "key": "F003",
      "label": "批次·教育类别 E（本科/研究生等以当届为准）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "L0/L1；M001/M002 类别栏；2026 双类别见 SRC-008；P0；未发布细类：POLICY_UNCONFIRMED。"
    },
    {
      "key": "F004",
      "label": "批次·规则版本与适用范围 R",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "L0 及每次 Run；M001 官方原文 URL、附件哈希、发布日期/效期；P1；来源失联 SOURCE_UNAVAILABLE；原文/现行不明 POLICY_UNCONFIRMED。"
    },
    {
      "key": "F005",
      "label": "批次·校内报送/省国期限 O(D,D,依据)",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "L0/L1 期限提示；M001 各发布机关独立条款，SRC-008 只证国家 2026 窗口；P1；缺校内期限显示“未知”，不得按国家窗口自动拒收。"
    },
    {
      "key": "F006",
      "label": "经办者·可信用户身份 R",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1/L2 有写入时；Host/Main 认证会话＋校内身份目录；不靠 M002 姓名；P2；无可信认证不签发/不代提交，转人工认证。"
    },
    {
      "key": "F007",
      "label": "申报主体·持有人/第一完成人/单位声明 O",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1；M002/M007 声明，单位/人员身份由校方台账或权威证明交叉核验；P2；声明可留；身份不匹配 CONFLICT。"
    },
    {
      "key": "F008",
      "label": "代理·授权范围、有效期、授权人 R",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "L1 仅代理人提交；有权主体签署 M011、受控授权记录；P2；代理却无授权：NEEDS_MATERIAL 或限制提交。"
    },
    {
      "key": "F009",
      "label": "成果·唯一身份、名称、别名 O",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1；M002 封面、M003；历史申报/教改项目只能辅助消歧；P1；名称空缺补证；同名不直接认重复违规。"
    },
    {
      "key": "F010",
      "label": "成果·教学问题与建设概述 S",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1 有成果叙述时；M003 正文段落；参考 SRC-013 历史结构；P1；无陈述待补；优劣由人工专家判断。"
    },
    {
      "key": "F011",
      "label": "成果·创新点及与既有成果关系 A",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1；M003 创新说明及 M006/M010 对照锚点；P1；描述不全 NEEDS_MATERIAL；创新性不自动评级。"
    },
    {
      "key": "F012",
      "label": "成果·推广成效主张及计量口径 A",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1 有定量或推广主张；M003/M005 统计主体、时间和原始出处；P1；夸大或不相符 CONFLICT；成效评价转人工。"
    },
    {
      "key": "F013",
      "label": "成果·项目/研究起始日期 D",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1 声明起始；M002/M003/M006；SRC-013 2022 填表说明作字段线索；P1；日期不明提示补证，不能用起始日充当实践开始。"
    },
    {
      "key": "F014",
      "label": "成果·实际教学实施日期 D",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "L1 证实实践；M004 教学方案实施批次及其原始记录；P1；无法确认实施日 NEEDS_MATERIAL；高影响时人工。"
    },
    {
      "key": "F015",
      "label": "成果·实践检验区间与截止时点 O(D,D)",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1/L2 适用国家或当届时限；M004 连续应用记录＋M001 对应规则；SRC-007 国家条例、SRC-017 省 2025 部分信息；P1；开始时间与立项时间混淆为 CONFLICT；时限未核不可硬拒。"
    },
    {
      "key": "F016",
      "label": "人员·完成人名单和声明顺序 A",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1 团队或当届有名单；M002/M007；SRC-013/014 2022 样本有该栏；P2；漏人/顺序冲突需原作者澄清，不由 OCR 重排。"
    },
    {
      "key": "F017",
      "label": "人员·逐人可信身份匹配 A(R)",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1/L2 团队；校方人员目录/经授权合作单位证明、M007，最小标识消歧；P2；重名、工号不合、校外匹配失败转人工；不因同名自动合并。"
    },
    {
      "key": "F018",
      "label": "人员·逐人贡献和时间区间 A(O)",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1/L2 团队；M007 各人贡献说明、M004/M005 任务记录；P2；声明与材料差异 CONFLICT；贡献大小人工审定。"
    },
    {
      "key": "F019",
      "label": "人员·知情、同意、签字状态 A(E)",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1 只在当届要求；签署可能 L2/L4；M008 有权人有效确认及版本签名；P2；未到签署节点 NOT_APPLICABLE；要求且未见才补件。"
    },
    {
      "key": "F020",
      "label": "完成单位·单位列表与顺序 A",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1；M002/M007/M009，单位法定/校内机构全称对照；P1；第一单位冲突需人工核实，不能由域名猜。"
    },
    {
      "key": "F021",
      "label": "完成单位·逐单位贡献与责任 A(O)",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1/L2 合作单位；M007/M009 合作原始任务/成果材料；P1；单位贡献证明不一致 CONFLICT。"
    },
    {
      "key": "F022",
      "label": "合作关系·牵头、归属、推荐路径 O",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1/L2 跨单位/校；M009 合作协议/授权和当届 M001；SRC-007 第 9 条；P2；牵头有争议 NEEDS_HUMAN_DECISION，不默认为 CDUT。"
    },
    {
      "key": "F023",
      "label": "成果·既有获奖及同成果申报历史 A(R)",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1 声明既有奖项；机关正式决定 M010，申报声明 M002 仅辅助；P1；仅搜索同名提示核对；“重复申报”不能无依据硬拒。"
    },
    {
      "key": "F024",
      "label": "证据·关联教改项目/课程/教材正式决定 A(R)",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1 如声明项目支撑；M006 原责任部门决定引用；SRC-015/016 项目管理例子；P1；不能取来源 SOURCE_UNAVAILABLE，不要求重复评项目。"
    },
    {
      "key": "F025",
      "label": "证据·材料槽、哈希、页码、业务对象/版本映射 A(O)",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "每次上传/替换；M002–M021 原件存储不可变映射、OCR 仅索引；P1；归属未定 CONFLICT；旧件保留且失效下游缓存结论。"
    },
    {
      "key": "F026",
      "label": "校内初核·学院/归口事实核验意见 R",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L2 有正式初核后；可信经办人签署 M012、来源与版本；P2；L1 尚未产生；L2 缺时核对授权和是否规定必需。"
    },
    {
      "key": "F027",
      "label": "校级·推荐/拟推荐有效决定 R",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L3 正式作出后；有权机构签发 M014；不可由 M013 评语替代；P1；L1/L2 不适用，待产生；签发权不清人工。"
    },
    {
      "key": "F028",
      "label": "公示/异议·公示与处置状态 O",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "L3/L5 发生时；M015/M020 公开范围内的公告和受理/处理记录；P3；不在公示期不强求；争议隐私最小展示。"
    },
    {
      "key": "F029",
      "label": "报送·受理单位/系统/提交授权 O",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L4；M001 当期通知＋真实校方报送授权 M014；P1；当期入口未知 POLICY_UNCONFIRMED；绝不模拟成功。"
    },
    {
      "key": "F030",
      "label": "报送·平台回执/受理号 R",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L4 实际发送后；M017 外部真实回执、状态检索；P1；尚未报送不缺；已报送查无来源 SOURCE_UNAVAILABLE。"
    },
    {
      "key": "F031",
      "label": "资格·有权机关资格核验结果 R",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L4/L5 权威形成后；M018 有权机关签发的审查结果；P3；不能由 PASS_FACT 充当；未发布不缺件。"
    },
    {
      "key": "F032",
      "label": "授奖·结果/文号/生效、撤销状态 O(R,D,E)",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L5/L6 有正式决定；M019 批准机关公开决定或受控正式档案；P1；仅新闻喜报不等于官方决定；效力未知人工核对。"
    },
    {
      "key": "F033",
      "label": "事件·补件/撤回/异议/复核及结论 A(O)",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L2–L5 发生即记录；M020 请求和有权决定分离、不可变时间线；P3；只有申请者请求时不得自动写“已受理/已撤销”。"
    },
    {
      "key": "F034",
      "label": "审计·当前阶段、关联 Run、冲突/重核清单 O",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "L0–L6 每次状态变化；可信 Case/Run/Decision 事件＋M021 差异清单；不接受前端状态写权；P1；无可追溯 Run SOURCE_UNAVAILABLE，不得将旧 run@rev 当真实审批。"
    },
    {
      "key": "F035",
      "label": "2026国家奖·完成人所在单位公示的对象版本、起止日及工作日计算 O",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L3/L4 正式对外推荐前；非初报；M022 单位有权公告与归档；SRC-020/021 三；本校公告发布权限另核；P2；非国家2026不适用；无可核公告归口核实，未到节点不缺；5工作日是国家该届要求但工作日口径、人审例外须谨慎。"
    },
    {
      "key": "F036",
      "label": "2026国家奖·类别化正式报送材料清单及提交版本 A(O)",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L4 已进入正式报送；M023 原平台清单、上传索引与 M002/M003/M005/M016；P1；L1草稿不强制纸质/盖章；本科和研究生材料形式不同，缺真正必要项才对有权经办报缺。"
    },
    {
      "key": "F037",
      "label": "2026国家奖·教材/视频条件材料与技术规格 O",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L4 若成果含教材或提交视频；M023 附件清单、受控媒体属性；SRC-020/021 八；P1；不含该媒介为 NOT_APPLICABLE；格式不可检时 UNREADABLE 或人工查证，不虚造普遍必交视频。"
    },
    {
      "key": "F038",
      "label": "2026国家奖·政治方向、师德师风资格把关结果引用 R",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L3/L4 经有权部门正式核查后；M024 受限决定记录、签发权限与版本；SRC-008/020/021；P3；不读取无关原始纪律档案；未有有权结果不得“合格”，不自动推断负面结论。"
    },
    {
      "key": "F039",
      "label": "评审程序·利益相关人员回避与保密授权记录 R",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "L3–L5 实际进入评审/推荐；M024 受控人员授权/回避记录；SRC-008、SRC-017；P3；仅有有权组织可作程序决定；未进入评议无缺件、不得公开内部评审名单。"
    },
    {
      "key": "F040",
      "label": "当届推荐单位·现任校领导牵头/第一完成人占比批量分子分母 O(N,N,口径)",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "L4 当期推荐批次形成清单后；M025 推荐单位权威汇总及人员身份时点；SRC-017/020/021；P2；2026本科“第一完成人”与研究生“主持”、四川2025“第一完成人”分别校准；这是推荐单位总体约束，单件无法独立判断，不向申请人索全部其他项目。"
    },
    {
      "key": "F041",
      "label": "2026国家奖·跨地区推荐路径法律事实、解释与报送机关 O",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L2/L4 跨校跨地区时；M001/M009/M014；SRC-007 第9条及 SRC-020/021 第三条；P1；本科/研究生附件路径文字差异若影响主管管辖，POLICY_UNCONFIRMED 并交有权推荐机关释明，不由模型选省份。"
    },
    {
      "key": "F042",
      "label": "四川2025省届·网报/纸质原件一致性与批次回执 O",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "L4 仅2025省级历史复核；M026 推荐单位网报与三份纸质原件交接记录；SRC-017 第六（三）；P1；本届已结束；2026或未来省级不可沿用纸质份数/2025-09-30截止。"
    },
    {
      "key": "F043",
      "label": "国家2026奖·拟申报奖等 E（特等/一等/二等/未指定）",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "L1/L4 当届申报阶段如已指明；M002/M023 申报主体声明与正式平台记录、SRC-020/021 该等级要求；P1；未指定不能借等级作实践4年刚性判断；特/一奖4年系“一般”要求，例外须人审；不擅自替申请人选等级。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "证明奖项批次和规则",
      "purpose": "证明奖项批次和规则；发布部门/归口方持有的通知、附件、申报表版本、补正/截止规定（原）；L0 现：系统/归口的规则前置，不向个人强制上传；可用同一机关可信公开网页和正式签发文书替代；F001–F005,F015,F029；SRC-007/008/012/017，校本通知待索；按批次/学段/发布日期存快照；失联 SOURCE_UNAVAILABLE，生效不明 POLICY_UNCONFIRMED，不能按旧届拒案。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明奖项批次和规则",
        "发布部门/归口方持有的通知、附件、申报表版本、补正/截止规定（原）",
        "L0 现：系统/归口的规则前置，不向个人强制上传",
        "可用同一机关可信公开网页和正式签发文书替代",
        "F001–F005,F015,F029"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "描述本次申报对象和自述",
      "purpose": "描述本次申报对象和自述；本人/团队持有的该类别当届申报表、电子原始表单（申）；L1 现：正式申报时最小申报意愿与成果身份；未发布专用表单时可用待审录入表暂存，不能称正式申报书；F002,F003,F007,F009,F013,F016,F020,F023；SRC-004/008/013/014；绑定成果+批次+申报主体；缺申报意愿 NEEDS_MATERIAL；扫描不清 UNREADABLE，不得从旧表伪造当届栏目。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "描述本次申报对象和自述",
        "本人/团队持有的该类别当届申报表、电子原始表单（申）",
        "L1 现：正式申报时最小申报意愿与成果身份",
        "未发布专用表单时可用待审录入表暂存，不能称正式申报书",
        "F002,F003,F007,F009,F013,F016,F020,F023"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "说明教学问题、改革措施、创新、总体成效",
      "purpose": "说明教学问题、改革措施、创新、总体成效；成果团队成果报告/总结书（申）；L1 条：当届要求或申报者已有实质陈述时；可用 M002 内相同完整栏目替代，不强迫重复上传；F009–F013；SRC-004/013/014；报告版本须同申报书；内容缺失先核 M002 是否覆盖；冲突 CONFLICT。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "说明教学问题、改革措施、创新、总体成效",
        "成果团队成果报告/总结书（申）",
        "L1 条：当届要求或申报者已有实质陈述时",
        "可用 M002 内相同完整栏目替代，不强迫重复上传",
        "F009–F013"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "证明方案实际实施而非仅立项",
      "purpose": "证明方案实际实施而非仅立项；教学运行单位/项目管理单位的课程实践、实施计划、教学运行或正式记录（原/申）；L1 现：申报人声称的实践必须至少有可定位证据，具体当届证明种类待定；可信单位记录可直引，不强制重复上传；F013–F015,F018；SRC-007/013/017；标具体课程/年级/实施期间与来源，个人信息脱敏；无事实支撑 NEEDS_MATERIAL，不清 UNREADABLE，日期自相矛盾 CONFLICT。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明方案实际实施而非仅立项",
        "教学运行单位/项目管理单位的课程实践、实施计划、教学运行或正式记录（原/申）",
        "L1 现：申报人声称的实践必须至少有可定位证据，具体当届证明种类待定",
        "可信单位记录可直引，不强制重复上传",
        "F013–F015,F018"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "验证推广应用或定量效果",
      "purpose": "验证推广应用或定量效果；应用单位/团队统计、课程效果、采用证明（原/申）；L1 条：声称采用量、增长率、推广应用等事实；原始系统报告/单位有效证明可替纸质函；专家质量评价仍人工；F011,F012,F015,F018；SRC-004/007/013；每一指标写明分母、期间、机构及版本；未主张该指标 NOT_APPLICABLE；只有宣传稿不能自动通过真实性。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "验证推广应用或定量效果",
        "应用单位/团队统计、课程效果、采用证明（原/申）",
        "L1 条：声称采用量、增长率、推广应用等事实",
        "原始系统报告/单位有效证明可替纸质函",
        "专家质量评价仍人工"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "证明历史项目/课程/教材已获独立审批",
      "purpose": "证明历史项目/课程/教材已获独立审批；T05-T02/T05-T03/T05-T04 业务 Owner的立项、变更、结题等决定（原）；L1 条：申报成果以某正式项目为支撑；可引用可信源记录/决定号，不额外逼上传同一 PDF；F011,F013,F024；SRC-004/015/016；源对象 ID、决定生效版本不变；无权限取回 SOURCE_UNAVAILABLE；待核不能重评项目是否合格。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明历史项目/课程/教材已获独立审批",
        "T05-T02/T05-T03/T05-T04 业务 Owner的立项、变更、结题等决定（原）",
        "L1 条：申报成果以某正式项目为支撑",
        "可引用可信源记录/决定号，不额外逼上传同一 PDF",
        "F011,F013,F024"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "明确完成人排序、贡献和完成单位",
      "purpose": "明确完成人排序、贡献和完成单位；团队/成果负责人贡献与人员单位表（申）；L1 现（多人团队）/条（单人且当届有规定）；M002 若逐人具备相同结构可替代单独表；F007,F016–F018,F020–F022；SRC-013/014；一人一稳定索引，与 M002 版本一致；遗漏成员 NEEDS_MATERIAL，排序不同 CONFLICT；同名需可信消歧。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "明确完成人排序、贡献和完成单位",
        "团队/成果负责人贡献与人员单位表（申）",
        "L1 现（多人团队）/条（单人且当届有规定）",
        "M002 若逐人具备相同结构可替代单独表",
        "F007,F016–F018,F020–F022"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "证明完成人本人知情、认可或特定承诺",
      "purpose": "证明完成人本人知情、认可或特定承诺；各完成人/法定授权人的签字、有效电子确认（原/申待核）；L1/L2/L4 条：看当届对签署阶段的规定；受控身份的有效电子签认可替扫描签字，若制度允许；F017–F019；SRC-013/014（历史签署实例），当届 SRC 待补；确认所签的申报版本、姓名与权限；尚未到规定时点不缺；签署版本旧 CONFLICT。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明完成人本人知情、认可或特定承诺",
        "各完成人/法定授权人的签字、有效电子确认（原/申待核）",
        "L1/L2/L4 条：看当届对签署阶段的规定",
        "受控身份的有效电子签认可替扫描签字，若制度允许",
        "F017–F019"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "证明跨校/跨学院的单位贡献、牵头、共同申报许可",
      "purpose": "证明跨校/跨学院的单位贡献、牵头、共同申报许可；合作单位/牵头方的协作协议、盖章确认、官方函（原/申待核）；L1/L2/L4 条：跨主体合作且当届要求时；授权校务合作台账或签署函可替上传；F020–F022；SRC-007/013；各单位签署版本和推荐辖区相符；一方持不同排序 CONFLICT，缺权属授权由有权部门裁决。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明跨校/跨学院的单位贡献、牵头、共同申报许可",
        "合作单位/牵头方的协作协议、盖章确认、官方函（原/申待核）",
        "L1/L2/L4 条：跨主体合作且当届要求时",
        "授权校务合作台账或签署函可替上传",
        "F020–F022"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "证明历史获奖、既有申报结果",
      "purpose": "证明历史获奖、既有申报结果；授奖机关/成果持有人的官方决定、证书、公开公告（原）；L1 条：申请人主张既往获奖或当届明确要求；优先引用授奖原机关决定及文号；F011,F023,F032；SRC-005/007/013；按旧奖项+年度独立存；新闻与申报书自述仅作线索；无法核验 SOURCE_UNAVAILABLE，相似奖项不自动判重复。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明历史获奖、既有申报结果",
        "授奖机关/成果持有人的官方决定、证书、公开公告（原）",
        "L1 条：申请人主张既往获奖或当届明确要求",
        "优先引用授奖原机关决定及文号",
        "F011,F023,F032"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "证明受托代理权限",
      "purpose": "证明受托代理权限；申请主体/委托者有效授权书或受控电子委托（原/申待核）；L1 条：经办者不是本人或法定代表者；已有可验证电子授权可替文件；F006–F008；SRC-007 主体原则；校本授权规则待核；关联具体成果、批次、操作、期限；无效/过期 NEEDS_HUMAN_DECISION，不能把前端选项作授权。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明受托代理权限",
        "申请主体/委托者有效授权书或受控电子委托（原/申待核）",
        "L1 条：经办者不是本人或法定代表者",
        "已有可验证电子授权可替文件",
        "F006–F008"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M012",
      "name": "记录学院/归口事实初核及补正",
      "purpose": "记录学院/归口事实初核及补正；被授权学院/教务处/研究生院记录（原）；L2 后：只有开展初核才产生；内控系统可信记录可替盖章扫描，不要求申请人反传；F025,F026,F034；SRC-001/002/004；绑定审阅的申请及材料版本；尚未审核 NOT_APPLICABLE；缺有权角色 NEEDS_HUMAN_DECISION。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "记录学院/归口事实初核及补正",
        "被授权学院/教务处/研究生院记录（原）",
        "L2 后：只有开展初核才产生",
        "内控系统可信记录可替盖章扫描，不要求申请人反传",
        "F025,F026,F034"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "记录专家评议和意见",
      "purpose": "记录专家评议和意见；有权组织的专家组记录（原）；L3 后；正式会议纪要/受控评审记录可替纸附件，不得初报索要；F025,F034；SRC-005 历史例、SRC-008 当届国家组织；记录涉密/内部意见 P3；签署/版本不清人工，不能用 AI 生成专家评语。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "记录专家评议和意见",
        "有权组织的专家组记录（原）",
        "L3 后",
        "正式会议纪要/受控评审记录可替纸附件，不得初报索要",
        "F025,F034"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "证明有权机关校内推荐决定",
      "purpose": "证明有权机关校内推荐决定；学校有权组织的签批、推荐函（原）；L3 后；有效校务决定记录可替盖章扫描；申请时没有 NOT_APPLICABLE；F027,F029；SRC-005/008，2026 校内签批链待补；强制校验签发权、决定号与成果版本；未经推荐不得标“已推荐”。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明有权机关校内推荐决定",
        "学校有权组织的签批、推荐函（原）",
        "L3 后",
        "有效校务决定记录可替盖章扫描",
        "申请时没有 NOT_APPLICABLE"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "证明拟推荐公示、申诉及处理",
      "purpose": "证明拟推荐公示、申诉及处理；发布/受理机关公告与裁决（原）；L3/L5 后，只有制度设置公示或发生异议才需；官方公告与受控案件回执可替；F027,F028,F033；SRC-005/007/008/018/019；保留公开脱敏版和内部原件双权限；被撤回公示须更新状态，旧公开页不是最终决定。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明拟推荐公示、申诉及处理",
        "发布/受理机关公告与裁决（原）",
        "L3/L5 后，只有制度设置公示或发生异议才需",
        "官方公告与受控案件回执可替",
        "F027,F028,F033"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M016",
      "name": "证明对外送审使用的正式签章版申请",
      "purpose": "证明对外送审使用的正式签章版申请；有权推荐单位存档（原）；L4 后：推荐选定并完成当届签章要求后；可信报送版系统快照可替；F019,F027,F029；SRC-008/013/014；关联最终申报文件哈希，不能将 L1 草稿当正式报送件；旧签章对应不同版本 CONFLICT。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明对外送审使用的正式签章版申请",
        "有权推荐单位存档（原）",
        "L4 后：推荐选定并完成当届签章要求后",
        "可信报送版系统快照可替",
        "F019,F027,F029"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "证明已对外真实提交",
      "purpose": "证明已对外真实提交；省/国家平台或被授权报送单位的受理回执（原）；L4 后：提交完成才生成；平台可验证流水号/回执优于截图；F029,F030；SRC-008（国家 2026 指定申报系统）；校验外部流水与最新文件版本；未提交不缺，系统故障 SOURCE_UNAVAILABLE。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明已对外真实提交",
        "省/国家平台或被授权报送单位的受理回执（原）",
        "L4 后：提交完成才生成",
        "平台可验证流水号/回执优于截图",
        "F029,F030"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "证明外部资格审查结果",
      "purpose": "证明外部资格审查结果；评审主管机关通知、受控审查记录（原）；L4/L5 后；可用该机关有效信息发布记录替复印件；F031；SRC-007/008/018/019；对当届类别/申请批次绑定；不可由本引擎代下资格结论；只有标题无具体名单不得给个案赋“通过”。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明外部资格审查结果",
        "评审主管机关通知、受控审查记录（原）",
        "L4/L5 后",
        "可用该机关有效信息发布记录替复印件",
        "F031"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M019",
      "name": "证明正式授奖/未获奖/撤销效力",
      "purpose": "证明正式授奖/未获奖/撤销效力；法定授奖机关批准文件或有权决定（原）；L5/L6 后；查原机关公布清单和生效文号，不要求申报人初报提供；F023,F032,F034；SRC-007/008/017；记录颁发、变更、撤销与生效状态；学院喜报仅辅助，不能替授奖机关决议。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明正式授奖/未获奖/撤销效力",
        "法定授奖机关批准文件或有权决定（原）",
        "L5/L6 后",
        "查原机关公布清单和生效文号，不要求申报人初报提供",
        "F023,F032,F034"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "证明撤回、补件申诉、署名异议、复核请求与处置分别存在",
      "purpose": "证明撤回、补件申诉、署名异议、复核请求与处置分别存在；请求人＋有权处理机关文件（原/申）；L1–L5 条：事件发生时；受控工单及签署答复可替 PDF；不能要求先提供未来裁决；F028,F033,F034；SRC-007 第 10 条、SRC-005 历史、当届校本规则待补；记录请求/受理/驳回/处理各自时间、主体、证据锚；无权回复或仅单方申述 NEEDS_HUMAN_DECISION。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "证明撤回、补件申诉、署名异议、复核请求与处置分别存在",
        "请求人＋有权处理机关文件（原/申）",
        "L1–L5 条：事件发生时",
        "受控工单及签署答复可替 PDF",
        "不能要求先提供未来裁决"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M021",
      "name": "说明新旧材料、人员、成果事实变更",
      "purpose": "说明新旧材料、人员、成果事实变更；申请主体及受控案卷系统的差异清单/替换记录（申+系统）；L1–L4 条：提交后修改或补正；系统自动差异 + 实际新原件为合法替代，不需额外人工写变更表（若当届另有规定例外）；F009,F014–F025,F034；SRC-013/014 作旧表结构例；校本修订规则待核；旧新均留哈希、影响集合、提交时间与审查主体；旧事实结论失效待重核，行政决定只能经有权程序更正。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "说明新旧材料、人员、成果事实变更",
        "申请主体及受控案卷系统的差异清单/替换记录（申+系统）",
        "L1–L4 条：提交后修改或补正",
        "系统自动差异 + 实际新原件为合法替代，不需额外人工写变更表（若当届另有规定例外）",
        "F009,F014–F025,F034"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M022",
      "name": "2026 国家本研奖单位公示事实",
      "purpose": "2026 国家本研奖单位公示事实；完成人所在单位/受控发布部门持有公告、起止日、成果版本及异议转交记录（原）；L3/L4 后：正式对外报送前必须确认；以可信网页快照、归口存档、公告发布/撤回记录核验；不得 L1 向申报人索未来公告；F028,F035,F033；SRC-008/020/021；对应具体成果和完成人所在单位、版本及起止日；目前尚未进入公示节点为 NOT_APPLICABLE；应已公示但权威记录失联 SOURCE_UNAVAILABLE；真实公告存在但不足5工作日转有权经办及期限解释人审，不能凭 OCR 日期擅判程序已通过。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "2026 国家本研奖单位公示事实",
        "完成人所在单位/受控发布部门持有公告、起止日、成果版本及异议转交记录（原）",
        "L3/L4 后：正式对外报送前必须确认",
        "以可信网页快照、归口存档、公告发布/撤回记录核验",
        "不得 L1 向申报人索未来公告"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M023",
      "name": "2026国家本研正式报送包清单与平台文件索引",
      "purpose": "2026国家本研正式报送包清单与平台文件索引；有权推荐单位/全国教师管理信息系统持有电子申报书、成果报告、效果证明、旁证、教材/视频条件件（原/申）；L4 后/条：本科表单与报告、效果材料及支撑PDF；研究生另含单位汇总表及表/报告PDF盖章扫描；教材/视频仅包含时按附件形式核；不提前让 L1 草稿交省国报送版；F036,F037,F025,F029；SRC-008/020/021；校验每一件来源哈希/媒体属性及报送版号；应有文件确无 NEEDS_MATERIAL 给推荐经办者，文件已到坏页 UNREADABLE，平台故障 SOURCE_UNAVAILABLE；勿假称客户端已支持视频转码。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "2026国家本研正式报送包清单与平台文件索引",
        "有权推荐单位/全国教师管理信息系统持有电子申报书、成果报告、效果证明、旁证、教材/视频条件件（原/申）",
        "L4 后/条：本科表单与报告、效果材料及支撑PDF",
        "研究生另含单位汇总表及表/报告PDF盖章扫描",
        "教材/视频仅包含时按附件形式核"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "2026国家奖政治/师德把关及评审回避保密记录",
      "purpose": "2026国家奖政治/师德把关及评审回避保密记录；仅有权考察/评审组织持有，含结论及受限签发依据（原）；L3–L5 后：真实组织执行该节点才生成；可信系统的最小结论引用替代原始涉敏档案，绝不由申报者事前上传纪律细节；F038,F039,F026,F034；SRC-008/020/021，省2025 SRC-017；按授权主体、签发时点及对应成果/人员绑定，P3 受限；来源失联 SOURCE_UNAVAILABLE，裁断与是否回避 NEEDS_HUMAN_DECISION，普通用户不得查看其他完成人敏感记录。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "2026国家奖政治/师德把关及评审回避保密记录",
        "仅有权考察/评审组织持有，含结论及受限签发依据（原）",
        "L3–L5 后：真实组织执行该节点才生成",
        "可信系统的最小结论引用替代原始涉敏档案，绝不由申报者事前上传纪律细节",
        "F038,F039,F026,F034"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "当届推荐单位批量校领导比例证明",
      "purpose": "当届推荐单位批量校领导比例证明；省/部推荐单位/校方合规汇总单位持有全推荐集合、分子/分母及口径说明（原）；L4 后/条：形成推荐清单时；受控聚合统计可替明细，不要求申请团队提交同批其他项目；F040,F027；SRC-017/020/021；来源必须同一推荐机关、奖类、批次；本科第一完成人/研究生主持分别算，省2025历史另算；未得汇总 SOURCE_UNAVAILABLE 或 NEEDS_HUMAN_DECISION，不凭一案否决。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "当届推荐单位批量校领导比例证明",
        "省/部推荐单位/校方合规汇总单位持有全推荐集合、分子/分母及口径说明（原）",
        "L4 后/条：形成推荐清单时",
        "受控聚合统计可替明细，不要求申请团队提交同批其他项目",
        "F040,F027"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M026",
      "name": "四川2025省奖正式网上提交与三份纸质原件收件一致性",
      "purpose": "四川2025省奖正式网上提交与三份纸质原件收件一致性；推荐单位及教育厅受理机构持有收件记录（原）；L4 后：仅2025四川省级批次历史验核；门户可信回执+交接单/收件记录，可替个人反复上传；不套用未来省级或国家2026；F042,F030,F025；SRC-017 第六（三）；核网报与纸质同成果、同内容版本、已过的2025-09-30期次；系统失联 SOURCE_UNAVAILABLE，可读两版不一致 CONFLICT；不能以旧届纸件条款阻断2026初报。。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "四川2025省奖正式网上提交与三份纸质原件收件一致性",
        "推荐单位及教育厅受理机构持有收件记录（原）",
        "L4 后：仅2025四川省级批次历史验核",
        "门户可信回执+交接单/收件记录，可替个人反复上传",
        "不套用未来省级或国家2026"
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
      "requiredAt": "decision",
      "maxCount": 9999,
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "rules-001-020",
      "name": "申报阶段的独立事实规则",
      "description": "来源章节：申报阶段的独立事实规则；保留原文规则编号、触发条件、证据来源和结果码。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "奖项申报目的路由",
          "requirement": "原文规则编号与阶段：R001 L0/L1 奖项申报目的路由。触发/例外条件：T=明确参评/推荐教学成果奖；F=纯项目立项/结题、社科奖、职称认定→转邻项；U=混合叙述需问目的；关联字段、材料与来源：SRC-007/011/015/016；F002,F009；M001,M002,M006；核验方法：以当事请求/奖项主办机构的事项对象比对，不凭标题关键词；E1/E3/E4，历史培育项目不能等于授奖申报；结果与下一办理角色：T=PASS_FACT 并留本案；F=NOT_APPLICABLE；U=NEEDS_HUMAN_DECISION→申请主体/归口路由人。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "批次规则来源及效力",
          "requirement": "原文规则编号与阶段：R002 L0/每次Run 批次规则来源及效力。触发/例外条件：T=存在拟适用批次；F=只是无届别的草稿意向；U=真伪/版本不可核；关联字段、材料与来源：SRC-001/002/007/008/012/017–021；F001,F004；M001；核验方法：校对机关、文号、学段、签发/实施/废止及附件版本；E1/E2，旧样本仅 E5；无法取校内通知不等于公告不存在；结果与下一办理角色：有效相符=PASS_FACT；仅草稿=NOT_APPLICABLE；缺现行校本=POLICY_UNCONFIRMED、URL 故障=SOURCE_UNAVAILABLE→归口教务处/研究生院。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "奖级和教育类别一致性",
          "requirement": "原文规则编号与阶段：R003 L0/L1 奖级和教育类别一致性。触发/例外条件：T=本届奖级/本科或研究生已选；F=未选批次的前期探索；U=公告类别缺失；关联字段、材料与来源：SRC-002/008/012/013/014/017/020/021；F002,F003；M001,M002；核验方法：比对奖项类别代码/名称与所选原始表单、教育对象，E1/E2/E4；2022 本研表不可替 2026；结果与下一办理角色：匹配=PASS_FACT，矛盾=CONFLICT，未到申报=NOT_APPLICABLE，当届细类未证=POLICY_UNCONFIRMED→申报者及归口人。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r004",
          "title": "/L4 报送截止归属",
          "requirement": "原文规则编号与阶段：R004 L0/L1/L4 报送截止归属。触发/例外条件：T=当届存在明确校内/外部截止；F=尚未到报送阶段；U=只有国家窗口、无 CDUT 截止；关联字段、材料与来源：SRC-004/005/008/017/020/021；F005,F034；M001,M017；核验方法：各机关规定分别保存，不以 2021/2025 日期代 2026；2026国家在线窗口5/29–7/10、省2025网报9/30分别仅属其当届；比较提交发生时间与同一受理层级的现行截止，E1/E2/E3；结果与下一办理角色：本层期限可证且在范围内=PASS_FACT；未进入节点=NOT_APPLICABLE；校内未知=POLICY_UNCONFIRMED，超期/是否准许补报交 NEEDS_HUMAN_DECISION→归口收件者。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "r005",
          "title": "–L4 真实操作人认证与动作权限",
          "requirement": "原文规则编号与阶段：R005 L1–L4 真实操作人认证与动作权限。触发/例外条件：T=有创建/修改/报送/决定写动作；F=只读阅览；U=账号或组织角色未可信解析；关联字段、材料与来源：SRC-001/002/007（业务主体，不提供技术鉴权规则）；F006,F034；M002,M011,M012；核验方法：对照 Host/Main 认证上下文、授权范围和动作时间，E3；本规则只检查本事项操作门槛，共通认证实现交 G50；Renderer 的 actorId/role 为 E6；结果与下一办理角色：匹配=PASS_FACT；只读=NOT_APPLICABLE；授权不明=NEEDS_HUMAN_DECISION，拒绝有效写入→身份/组织管理员。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "/L4 受托代送授权",
          "requirement": "原文规则编号与阶段：R006 L1/L2/L4 受托代送授权。触发/例外条件：T=F006 非本人/法定有权代表；F=本人提交且可核；U=组织代表关系未明；关联字段、材料与来源：SRC-007 第3/8条、SRC-013/014（历史表单）；F007,F008；M002,M011；核验方法：将委托人、目标成果+批次、权限、有效期与签署时点逐项对齐；电子授权只有制度允许才等价，E3/E4；结果与下一办理角色：全部匹配=PASS_FACT；本人=NOT_APPLICABLE；应交授权不存在=NEEDS_MATERIAL，代理资格裁量=NEEDS_HUMAN_DECISION→本人/授权管理人。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "成果持有人主体与校内归属声明",
          "requirement": "原文规则编号与阶段：R007 L1/L2 成果持有人主体与校内归属声明。触发/例外条件：T=当事人请求以某个人或单位报奖；F=仅代浏览/非本案；U=校外/学生或离职人身份适用性未证；关联字段、材料与来源：SRC-007 第3/8条、SRC-001/002；F007,F017；M002,M007；核验方法：E3 校方身份/单位原记录或获授权外方记录，对比 E4 声明；不得设本校在编等无来源门槛；结果与下一办理角色：主体事实一致=PASS_FACT；非本案=NOT_APPLICABLE；身份冲突=CONFLICT；是否可申报须人审=NEEDS_HUMAN_DECISION→归口人。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "r008",
          "title": "成果对象唯一归属与名称",
          "requirement": "原文规则编号与阶段：R008 L1 成果对象唯一归属与名称。触发/例外条件：T=有该批次申报意愿；F=尚未成案；U=同名而不能消歧；关联字段、材料与来源：SRC-007 第2条、SRC-013/014；F009,F025；M002,M003；核验方法：对齐申报书和报告名称、范围、成果身份/版本；同名跨届不自动并为违规，E4；可信登记存在则只读对照 E3；结果与下一办理角色：对应明确=PASS_FACT；尚未成案=NOT_APPLICABLE；缺标题=NEEDS_MATERIAL，不一致=CONFLICT→申报人/学院。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "r009",
          "title": "教学问题与改革措施陈述",
          "requirement": "原文规则编号与阶段：R009 L1 教学问题与改革措施陈述。触发/例外条件：T=该成果正式起草；F=仅收集选题意向；U=当届是否必须单列成果总结未证；关联字段、材料与来源：SRC-004/013/014（历史结构）、SRC-007 第2条；F010；M002,M003；核验方法：只校是否能从当届提交的任一合法载体定位“问题—措施”事实描述，E4，不评质量或强制 5000 字；结果与下一办理角色：可定位=PASS_FACT；非申报=NOT_APPLICABLE；陈述缺失且当前需要=NEEDS_MATERIAL；独立附件要求不明=POLICY_UNCONFIRMED→申报人/归口。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r010",
          "title": "创新点与既有成果关系",
          "requirement": "原文规则编号与阶段：R010 L1/L2 创新点与既有成果关系。触发/例外条件：T=主张有创新/区别于旧成果；F=未主张具体旧成果；U=是否属于原创贡献需专家认定；关联字段、材料与来源：SRC-007 第2/5条、SRC-013；F011,F023,F024；M003,M006,M010；核验方法：按创新点引用片段、旧项目/获奖的源决定、时间与成果归属比对；E3/E4；相似度只发线索，创新价值是专家裁量；结果与下一办理角色：来源关系匹配=PASS_FACT；未提旧成果部分=NOT_APPLICABLE；互相否定=CONFLICT；价值/重复资格=NEEDS_HUMAN_DECISION→专家/归口。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r011",
          "title": "实际实践开始与检验期",
          "requirement": "原文规则编号与阶段：R011 L1/L2 实际实践开始与检验期。触发/例外条件：T=正式申报并主张实践时间；F=不适用尚未公开的奖级；U=实际实施日或当届算法不明；关联字段、材料与来源：SRC-007 第5/12条、SRC-013 填写说明、SRC-017（2025省届全文）、SRC-020/021（2026国家本研）；F013–F015；M001,M002,M004,M006；核验方法：E3/E4 运行记录确定实施而非立项起始，检验至当届规则指定时点；国家条例 2 年以上仅在国家奖规范范围内，条件是否满足需证据与具体届别说明；旧表 E5 不作算法；结果与下一办理角色：时间可核=PASS_FACT 仅指日期事实；非该规则=NOT_APPLICABLE；证据缺=NEEDS_MATERIAL、日期抵触=CONFLICT、算法不明=POLICY_UNCONFIRMED、符合资格由有权者定→学院/归口。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r012",
          "title": "推广应用与定量成效出处",
          "requirement": "原文规则编号与阶段：R012 L1/L2 推广应用与定量成效出处。触发/例外条件：T=报告提出效果数字/应用单位；F=无此类具体主张；U=原始统计来源暂取不到；关联字段、材料与来源：SRC-004/007/013；F012,F015；M003,M004,M005；核验方法：逐数字对分母、统计期间、证据对应单位及范围，E3/E4；宣传报道只能辅助，教学影响大小专家评审；结果与下一办理角色：锚点与数字一致=PASS_FACT，未主张=NOT_APPLICABLE，无统计凭据=NEEDS_MATERIAL，冲突=CONFLICT，源系统故障=SOURCE_UNAVAILABLE→成果人/数据持有人。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r013",
          "title": "逐人身份匹配",
          "requirement": "原文规则编号与阶段：R013 L1/L2 逐人身份匹配。触发/例外条件：T=多人或本届需列主要完成人；F=真单人且当届无名单要求；U=重名/校外权限不足；关联字段、材料与来源：SRC-007 第3条、SRC-013/014；F016,F017；M002,M007,M008；核验方法：用稳定校内人事号或校外单位可信标识做最小必要匹配；OCR 姓名只作定位，E3/E4/E6 区分；不采集额外证件照片；结果与下一办理角色：对应无误=PASS_FACT；单人无需名单=NOT_APPLICABLE；同名无法确证=NEEDS_HUMAN_DECISION，两份可信身份矛盾=CONFLICT→团队/校外合作单位。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "完成人顺序与逐人贡献证据一致性",
          "requirement": "原文规则编号与阶段：R014 L1/L2 完成人顺序与逐人贡献证据一致性。触发/例外条件：T=多人报奖；F=非多人；U=具体排序标准/贡献权属争议；关联字段、材料与来源：SRC-007 第2/9/10条、SRC-013/014/020/021；F016,F018；M002,M004,M005,M007；核验方法：比较两份名单的稳定索引、位置、贡献时段及对应原始任务；E4 对照 E3，不由 AI 重新排名；国家2026本研附件明确主要完成人直接参加全过程、完成单位须作主要贡献；但校本人数上限、个体贡献多少由有权人判断；结果与下一办理角色：结构一致=PASS_FACT；单人=NOT_APPLICABLE；名单冲突=CONFLICT，缺贡献说明=NEEDS_MATERIAL，权属裁量=NEEDS_HUMAN_DECISION→团队、学院、有权机构。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r015",
          "title": "个人承诺/签署与具体版本匹配",
          "requirement": "原文规则编号与阶段：R015 L2/L4 个人承诺/签署与具体版本匹配。触发/例外条件：T=当届明示该阶段须签；F=尚未到签字节点或该届无要求；U=当届附件未得到；关联字段、材料与来源：SRC-008/013/014/020/021；F019,F025；M008,M016,M001；核验方法：核签署主体、可接受形式、签名对应申报版本和当时授权；E2/E3/E4，2026研究生附件明确正式申报书/报告需PDF盖章扫描，但这不等于全体团队签名在L1必交；2022样本不可定义2026个人签署时点；结果与下一办理角色：有效对应=PASS_FACT；未到节点=NOT_APPLICABLE；当届未知=POLICY_UNCONFIRMED；应签缺=NEEDS_MATERIAL、错版签名=CONFLICT→各完成人/归口签章者。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "完成单位排序及贡献声明",
          "requirement": "原文规则编号与阶段：R016 L1/L2 完成单位排序及贡献声明。触发/例外条件：T=至少一完成单位；F=纯个人尚未要求单位的草稿；U=合作单位身份真伪不明；关联字段、材料与来源：SRC-007 第3/9条、SRC-013/014；F020,F021；M002,M007,M009；核验方法：逐单位核全称、排名、事实贡献与被授权使用名称；E3/E4，本科历史三校案例不代表每届必须多单位；结果与下一办理角色：一致=PASS_FACT；不适用=NOT_APPLICABLE；单位顺序冲突=CONFLICT，权属不明=NEEDS_HUMAN_DECISION→学院/合作方。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r017",
          "title": "/L4 跨校牵头与法定推荐路径",
          "requirement": "原文规则编号与阶段：R017 L1/L2/L4 跨校牵头与法定推荐路径。触发/例外条件：T=跨省/跨部门联合或协作且涉及推荐渠道；F=本校单独完成无合作；U=牵头或参与关系争议；关联字段、材料与来源：SRC-007 第8/9条、SRC-013（历史多校样本）、SRC-020/021；F020–F022,F029；M001,M009,M014；核验方法：先核客观主持单位/人所在地及共同申请声明，再核当届报送机关；E1/E2/E3；研究生附件路径表述与条例第9条存在解释张力，应联动R034转有权机关；合作排序分歧也须人工解决；结果与下一办理角色：来源和路径相符=PASS_FACT；单独=NOT_APPLICABLE；授权缺失=NEEDS_MATERIAL；路径或权属争议=NEEDS_HUMAN_DECISION→CDUT 归口/省级受理机关。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r018",
          "title": "既获奖/同内容复报的权威记录",
          "requirement": "原文规则编号与阶段：R018 L1/L2 既获奖/同内容复报的权威记录。触发/例外条件：T=申报者主张曾获奖或发现同一成果候选；F=无此声明/线索；U=只有新闻或同名；关联字段、材料与来源：SRC-005/006/007/013/020/021；F023,F032；M002,M010,M019；核验方法：验证原授奖机关文号、项目名称、主体、年份、生效/撤销；E3 优先，国家2026本研附件有已获国家奖基本相同成果不得重复申报、特别创新例外；只核历史决定与内容锚点，不用喜报/同名判违规，例外交专家；结果与下一办理角色：既有记录可证=PASS_FACT；未触发=NOT_APPLICABLE；官方失联=SOURCE_UNAVAILABLE，是否构成不得再报由当届权威规则/人审判→归口。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r019",
          "title": "项目立项/结题等既有决定引用",
          "requirement": "原文规则编号与阶段：R019 L1/L2 项目立项/结题等既有决定引用。触发/例外条件：T=成果主张由教改项目、课程或教材建设支撑；F=未主张；U=原 Owner 记录无法获取；关联字段、材料与来源：SRC-004/015/016；F024；M003,M006；核验方法：只读比对 T05-T02/T03/T04 源决定号、成果/项目关系与有效版本；E3，不得再审批培育项目或把结题当授奖；结果与下一办理角色：决定引用匹配=PASS_FACT，不主张=NOT_APPLICABLE，失联=SOURCE_UNAVAILABLE，声明与源决定矛盾=CONFLICT→项目 Owner/成果申报人。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "–L5 证据归属、版本与定向重核",
          "requirement": "原文规则编号与阶段：R020 L1–L5 证据归属、版本与定向重核。触发/例外条件：T=收到/替换/复用任何 M 或发生相关审查；F=本次无新版本且依赖哈希不变；U=源版本或案卷归属缺失；关联字段、材料与来源：SRC-013/014（历史表结构）、SRC-007（真实决定边界），版本逻辑为技术模型非校本条款；F025,F034；M002–M021；核验方法：比对 caseId+awardBatch+achievementId+materialSlot+objectId+hash+sourceVersion；M021 描述差异、保留旧审计；通用不可读由 G50 检测后映射本案锚点；只重审依赖受影响版本的 R；结果与下一办理角色：稳定且一致=PASS_FACT；无变更=NOT_APPLICABLE；冲突=CONFLICT，原件不可读=UNREADABLE，权威源失联=SOURCE_UNAVAILABLE→申请人/证据持有人/案卷 Owner。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        }
      ]
    },
    {
      "id": "rules-021-028",
      "name": "后续有权决定及请求事件的引用核验",
      "description": "来源章节：后续有权决定及请求事件的引用核验；保留原文规则编号、触发条件、证据来源和结果码。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r021",
          "title": "学院/归口事实初核记录",
          "requirement": "原文规则编号与阶段：R021 L2 学院/归口事实初核记录。触发/例外条件：T=有受控初核或本届已经到规定初核节点；F=L0/L1 尚未形成；U=学校当届是否设置此节点不明；关联字段、材料与来源：SRC-001/002/004（历史分工）；F026,F034；M012；核验方法：校验真实经办、授权、事实审查对象和每个所核材料版本 E3；不从照片推组织意见；结果与下一办理角色：记录关联正确=PASS_FACT；未到=NOT_APPLICABLE；校本节点不明=POLICY_UNCONFIRMED，签批越权=NEEDS_HUMAN_DECISION→学院/归口。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r022",
          "title": "专家评议记录的存在与归属",
          "requirement": "原文规则编号与阶段：R022 L3 专家评议记录的存在与归属。触发/例外条件：T=本届设专家评审且已进入该环节；F=初报/未启动专家环节；U=专家组织权限不明；关联字段、材料与来源：SRC-005 历史、SRC-008 本届上位程序；F025,F034；M013；核验方法：只读专家组真实会议/评价记录、被评申报版本及权限 E3；专家优劣不进行程序化替代；结果与下一办理角色：有真实记录=PASS_FACT；尚未到=NOT_APPLICABLE；应有而未见=NEEDS_MATERIAL 仅对归口组织者；授权不明=NEEDS_HUMAN_DECISION→专家组织者/校归口。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "r023",
          "title": "学校有效推荐决定",
          "requirement": "原文规则编号与阶段：R023 L3 学校有效推荐决定。触发/例外条件：T=有权机构已作或已正式进入签批节点；F=初报/未遴选；U=2026 签发组织、权限未知；关联字段、材料与来源：SRC-005 历史例、SRC-007 第8条、SRC-008；F027,F034；M014；核验方法：校验决定唯一号、被推荐成果/批次、法定授权、签发与效力、对象版本 E2/E3；拟推荐公示或专家评语不可代替签批；结果与下一办理角色：真实决定匹配=PASS_FACT（不等于授奖）；未到=NOT_APPLICABLE；已到签批但尚未作决定=NEEDS_HUMAN_DECISION，原记录失联=SOURCE_UNAVAILABLE→学校有权签发机构。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "公示、权属异议和处理状态",
          "requirement": "原文规则编号与阶段：R024 L3/L5 公示、权属异议和处理状态。触发/例外条件：T=当届设公示或出现异议；F=未到公示或无此事件；U=异议与公示节点、权限不明；关联字段、材料与来源：SRC-005/007 第10条、SRC-008/018/019/020/021；F028,F033；M015,M020；核验方法：对照有权公示发布页、实际对象/批次和公布日期；请求与裁定分别追踪；E1/E3，2026国家附件资格审查公示90天、当届公示公告2026-10-13至2027-01-10，异议除权属还涉及实践时间与单位，要求实名书面证据；原条例第10条权属异议与单位先行公示5工作日须分开；结果与下一办理角色：公示事实/处置效力可证=PASS_FACT；未触发=NOT_APPLICABLE；公告不可取=SOURCE_UNAVAILABLE、处理/管辖争议=NEEDS_HUMAN_DECISION→发布或有权异议机关。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "对外签章报送及真实受理回执",
          "requirement": "原文规则编号与阶段：R025 L4 对外签章报送及真实受理回执。触发/例外条件：T=学校已授权并实际报送；F=还在校内申报/推荐；U=学校授权提交者或本届平台未证；关联字段、材料与来源：SRC-007 第8/9条、SRC-008/013/014/020/021；F029,F030；M001,M014,M016,M017；核验方法：对比有效校内推荐、对外版本哈希、签章人权限、外部平台流水和申报对象；E1/E2/E3，国家2026本科/研究生均经全国教师管理信息系统无需邮寄、研究生需单位汇总及PDF盖章扫描；截图不是平台受理；结果与下一办理角色：版本与流水对应=PASS_FACT；未报送=NOT_APPLICABLE；平台失联=SOURCE_UNAVAILABLE，签章越权=NEEDS_HUMAN_DECISION→报送单位/平台受理者。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "外部资格审查权威结果",
          "requirement": "原文规则编号与阶段：R026 L4/L5 外部资格审查权威结果。触发/例外条件：T=有机关正式审查/公示结果或进入该节点；F=外部未受理；U=只有公示标题未取具体项目名单；关联字段、材料与来源：SRC-007/008/018/019；F031,F028；M018,M015；核验方法：查省/教育部原表、项目身份、类目、审查结论/公布时间；E3，2026 教育部公示不等于最终授奖，未经附件定位不得判 CDUT 个案通过；结果与下一办理角色：对具体个案可确认的资格结果=PASS_FACT；未到=NOT_APPLICABLE；原名单取不到=SOURCE_UNAVAILABLE，结论归属歧义=NEEDS_HUMAN_DECISION→外部审查机关/归口。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "最终授奖与效力、对 T02 只读引用",
          "requirement": "原文规则编号与阶段：R027 L5/L6 最终授奖与效力、对 T02 只读引用。触发/例外条件：T=有权授奖机关发布正式决定；F=仍处推荐/资格公示；U=只有新闻喜报或证书截图；关联字段、材料与来源：SRC-006/007 第7/14/15条、SRC-008/017；F032,F023；M010,M019；核验方法：查授奖机关原正式批准文号、名单中的对象、有效/撤销版本 E3；学校喜报 E5 仅线索；向 T02 返回来源引用而不重复进行奖励、职称计分；结果与下一办理角色：真实效力匹配=PASS_FACT；未终局=NOT_APPLICABLE；原机关查不到=SOURCE_UNAVAILABLE，撤销/争议=NEEDS_HUMAN_DECISION→授奖机关/T02 引用方。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "–L5 补件、撤回、复核请求和正式处置",
          "requirement": "原文规则编号与阶段：R028 L1–L5 补件、撤回、复核请求和正式处置。触发/例外条件：T=任一当事人提出事件请求或有权人已处置；F=从未发生请求；U=申请人权限、期限、案由管辖不明；关联字段、材料与来源：SRC-007 第10/15条、SRC-005/008（阶段线索）；F006–F008,F033,F034；M011,M020,M021；核验方法：E3/E4 分别核请求者、目标成果+批次、所要求动作、受理/处理决定的签发者和发生时间；同一请求的受理、撤回生效、复核结论不可用一个布尔值压平；结果与下一办理角色：请求可追溯=PASS_FACT 仅请求事实；无事件=NOT_APPLICABLE；缺请求附件=NEEDS_MATERIAL，无权/期限不明=NEEDS_HUMAN_DECISION→申请主体/有权受理及复核机关。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-029-038",
      "name": "第四轮增补的届别专门规则",
      "description": "来源章节：第四轮增补的届别专门规则；保留原文规则编号、触发条件、证据来源和结果码。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r029",
          "title": "申报主体类别",
          "requirement": "原文规则编号与阶段：R029 L1/L2 申报主体类别。触发/例外条件：T=2026国家本研正式申报；F=非此届；U=机构性质或成员身份未证；关联字段、材料与来源：SRC-007/020/021；F001,F003,F007,F017；M001,M002,M007；核验方法：核受控个人/单位身份；两附件均准许依法设立的有关教育机构、教师及其他个人申报，排除党政机关及其工作人员；不擅设“CDUT在编”限制，也不因名称推定某单位机关性质。；结果与下一办理角色：对应事实成立 PASS_FACT；别届 NOT_APPLICABLE；身份失联 SOURCE_UNAVAILABLE；资格定性 NEEDS_HUMAN_DECISION→身份/归口机构。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r030",
          "title": "/L4 实践年限按拟奖等核验",
          "requirement": "原文规则编号与阶段：R030 L1/L2/L4 实践年限按拟奖等核验。触发/例外条件：T=2026国家本研，实践记录可定位；F=别届；U=实际实施起点/拟等级未证；关联字段、材料与来源：SRC-007第5条、SRC-020二（一）、SRC-021二（四）；F014,F015,F043；M001,M002,M004,M023；核验方法：起算自正式实施（含试行），不含研讨/制定；两类均规定2年以上，特/一奖一般不少于4年；不能把“一般”变成无例外硬拒。；结果与下一办理角色：日期满足 PASS_FACT；别届 NOT_APPLICABLE；缺实施证据 NEEDS_MATERIAL；日期矛盾 CONFLICT；时限未达/例外 NEEDS_HUMAN_DECISION→归口/资格机关。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r031",
          "title": "本单位对外报送前公示",
          "requirement": "原文规则编号与阶段：R031 L3/L4 本单位对外报送前公示。触发/例外条件：T=2026国家本研进入报送准备；F=L1或别届；U=公示机关/起止未证；关联字段、材料与来源：SRC-008五、SRC-020三、SRC-021三；F028,F035；M001,M022；核验方法：对具体成果版本、完成人所在单位、公告起止及至少5个工作日核对；不是教育部资格公示90天。签发效力须可信来源。；结果与下一办理角色：来源对应 PASS_FACT；未到 NOT_APPLICABLE；已公示记录失联 SOURCE_UNAVAILABLE；时长/权限争议 NEEDS_HUMAN_DECISION→发布单位/归口。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "正式报送包清单完整性",
          "requirement": "原文规则编号与阶段：R032 L4 正式报送包清单完整性。触发/例外条件：T=2026国家在线正式报送；F=初报草稿/别届；U=平台字段版本不可读；关联字段、材料与来源：SRC-008八、SRC-020八、SRC-021八；F036,F025；M001,M002,M003,M005,M016,M023；核验方法：本科核当届申报书、成果报告、应用效果证明、相应旁证PDF；研究生还核单位汇总表、申报书/报告盖章PDF扫描及效果旁证；均经全国教师管理信息系统，无需邮寄。；结果与下一办理角色：齐且同版 PASS_FACT；未到 NOT_APPLICABLE；必要件缺 NEEDS_MATERIAL→推荐经办；无法读 UNREADABLE，平台故障 SOURCE_UNAVAILABLE。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r033",
          "title": "教材/视频条件件规格",
          "requirement": "原文规则编号与阶段：R033 L4 教材/视频条件件规格。触发/例外条件：T=2026国家报送且含教材或视频；F=无此媒介；U=元数据缺失；关联字段、材料与来源：SRC-020八（二）3–4、SRC-021八（三）；F037；M023；核验方法：本科含教材须样书/教材电子文档；视频存在时限10分钟内，1920×1080/25P及以上、H.264/MP4、码流不低于5Mbps，研究生视频规格同类；以真实媒体属性/受控验收核对。；结果与下一办理角色：符合 PASS_FACT；无媒介 NOT_APPLICABLE；条件件缺 NEEDS_MATERIAL；无法解码 UNREADABLE；例外 NEEDS_HUMAN_DECISION→报送经办。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r034",
          "title": "跨地区联合推荐管辖",
          "requirement": "原文规则编号与阶段：R034 L2/L4 跨地区联合推荐管辖。触发/例外条件：T=跨地区/跨部门共同成果需确定机关；F=无跨区；U=主持/第一单位或解释缺失；关联字段、材料与来源：SRC-007第9条、SRC-020三、SRC-021三；F022,F029,F041；M001,M009,M014；核验方法：本科附件采用第一完成单位/第一完成人所在地，研究生附件采用成果完成单位/完成人所在地的不同字句；上位条例第9条规定主持单位/主持人所在地。保留冲突、请机关解释，不自动选省份。；结果与下一办理角色：管辖经权威确认 PASS_FACT；无跨区 NOT_APPLICABLE；解释未知 POLICY_UNCONFIRMED / NEEDS_HUMAN_DECISION→省级推荐机关。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "r035",
          "title": "推荐批次校领导成果占比",
          "requirement": "原文规则编号与阶段：R035 L4 推荐批次校领导成果占比。触发/例外条件：T=已形成2026国家本研/2025四川高教推荐总表；F=单件初报/别届；U=汇总分母未得；关联字段、材料与来源：SRC-017第三（一）、SRC-020四（二）、SRC-021四（二）；F040；M001,M025；核验方法：20%是推荐单位批量比例；2026本科与四川2025高教看现任校领导第一完成人，2026研究生看其主持成果；时点以申报时身份为准。不得要求单个教师提交同届其他项目明细。；结果与下一办理角色：权威汇总匹配 PASS_FACT；单件 NOT_APPLICABLE；总表失联 SOURCE_UNAVAILABLE；是否处理超比例 NEEDS_HUMAN_DECISION→推荐机关。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r036",
          "title": "政治/师德核查真实结论引用",
          "requirement": "原文规则编号与阶段：R036 L3/L4 政治/师德核查真实结论引用。触发/例外条件：T=2026国家奖进入有权资格把关；F=初报未到；U=审查机构授权不明；关联字段、材料与来源：SRC-008七（一）、SRC-020六、SRC-021六；F038；M024；核验方法：仅核有权主体、人员/成果版本与真实签发结论；不得读取或自动裁决私人敏感档案。；结果与下一办理角色：有效引用 PASS_FACT；未到 NOT_APPLICABLE；记录失联 SOURCE_UNAVAILABLE；尚待决定/越权 NEEDS_HUMAN_DECISION→有权考察机构。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r037",
          "title": "–L5 评审回避与保密程序记录",
          "requirement": "原文规则编号与阶段：R037 L3–L5 评审回避与保密程序记录。触发/例外条件：T=已有评审组织/潜在利益冲突；F=评审尚未开始；U=利益关联/组织权限无法核；关联字段、材料与来源：SRC-008七（二）、SRC-017六（二）；F039；M013,M024；核验方法：只读真实回避/保密授权及其对象时点，不能凭模型自行判定回避法律后果，不公开评审隐私。；结果与下一办理角色：程序记录对应 PASS_FACT；未到 NOT_APPLICABLE；记录失联 SOURCE_UNAVAILABLE；裁量 NEEDS_HUMAN_DECISION→有权评审/监督机构。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r038",
          "title": "四川2025网报与纸质材料一致性",
          "requirement": "原文规则编号与阶段：R038 L4 四川2025网报与纸质材料一致性。触发/例外条件：T=核历史2025四川省本研正式报送；F=其他届或L1；U=原收件证据失联；关联字段、材料与来源：SRC-017第六（三）；F042,F025,F030；M001,M016,M017,M026；核验方法：该届网络截止2025-09-30，教学类纸质原件每项一式三份，内容须与网报一致；核推荐单位和省厅原收件，不把省2025纸件要求套入国家2026无邮寄申报。；结果与下一办理角色：一致 PASS_FACT；别届 NOT_APPLICABLE；两版不同 CONFLICT；收件失联 SOURCE_UNAVAILABLE→原推荐单位。。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "policyRefs": [],
  "stages": [
    {
      "id": "intake",
      "name": "L0/L1 批次确认与申报起草",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "fact-review",
      "workflowOwner": "local"
    },
    {
      "id": "fact-review",
      "name": "L2 事实预审与补件",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "policy-review",
      "returnToStageId": "intake",
      "workflowOwner": "local"
    },
    {
      "id": "policy-review",
      "name": "L3/L4 授权、推荐、公示及报送事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "finalize",
      "returnToStageId": "fact-review",
      "workflowOwner": "local"
    },
    {
      "id": "finalize",
      "name": "有权人员人工复核与本地结果记录",
      "kind": "finalize",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "review-feedback",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "supplement-list",
      "kind": "supplement-list",
      "audience": "reviewer"
    },
    {
      "id": "local-review-ledger",
      "kind": "roster",
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
  "templateId": "T05-T05",
  "name": "教学成果奖与教学改革成果申报审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T05-T05.md",
  "sourceDocumentSha256": "fbf97722b82733c4214b7bd94c367477747a8ab86eb8806026c91138eb184712",
  "sourceOriginalBlobSha1": "5df75da9c62878fb1b0753ee2278d10c10b47c8d",
  "sourceManifestBytes": 151528,
  "sourceManifestSha256": "fbf97722b82733c4214b7bd94c367477747a8ab86eb8806026c91138eb184712",
  "sourceDocumentBytes": 151528,
  "sourceDisplayedBytes": 151527,
  "sourceIntegrityStatus": "MATCHED_MANIFEST",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23",
  "researchEvidenceStatus": "PARTIAL",
  "policyEvidenceStatus": "PARTIAL",
  "sourceIds": [
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
    "SRC-020",
    "SRC-021",
    "SRC-022"
  ],
  "criteria": [
    {
      "sectionId": "rules-001-020",
      "criterionId": "r001",
      "sourceIds": [
        "SRC-007",
        "SRC-011",
        "SRC-015",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r002",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007",
        "SRC-008",
        "SRC-012",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r003",
      "sourceIds": [
        "SRC-002",
        "SRC-008",
        "SRC-012",
        "SRC-013",
        "SRC-014",
        "SRC-017",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r004",
      "sourceIds": [
        "SRC-004",
        "SRC-005",
        "SRC-008",
        "SRC-017",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r005",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r006",
      "sourceIds": [
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r007",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r008",
      "sourceIds": [
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "VERIFIED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r009",
      "sourceIds": [
        "SRC-004",
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r010",
      "sourceIds": [
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r011",
      "sourceIds": [
        "SRC-007",
        "SRC-013",
        "SRC-017",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r012",
      "sourceIds": [
        "SRC-004",
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "VERIFIED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r013",
      "sourceIds": [
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r014",
      "sourceIds": [
        "SRC-007",
        "SRC-013",
        "SRC-014",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r015",
      "sourceIds": [
        "SRC-008",
        "SRC-013",
        "SRC-014",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r016",
      "sourceIds": [
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r017",
      "sourceIds": [
        "SRC-007",
        "SRC-013",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r018",
      "sourceIds": [
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-013",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r019",
      "sourceIds": [
        "SRC-004",
        "SRC-015",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-020",
      "criterionId": "r020",
      "sourceIds": [
        "SRC-007",
        "SRC-013",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-021-028",
      "criterionId": "r021",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-021-028",
      "criterionId": "r022",
      "sourceIds": [
        "SRC-005",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-021-028",
      "criterionId": "r023",
      "sourceIds": [
        "SRC-005",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-021-028",
      "criterionId": "r024",
      "sourceIds": [
        "SRC-005",
        "SRC-007",
        "SRC-008",
        "SRC-018",
        "SRC-019",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-021-028",
      "criterionId": "r025",
      "sourceIds": [
        "SRC-007",
        "SRC-008",
        "SRC-013",
        "SRC-014",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-021-028",
      "criterionId": "r026",
      "sourceIds": [
        "SRC-007",
        "SRC-008",
        "SRC-018",
        "SRC-019"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-021-028",
      "criterionId": "r027",
      "sourceIds": [
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-021-028",
      "criterionId": "r028",
      "sourceIds": [
        "SRC-005",
        "SRC-007",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-029-038",
      "criterionId": "r029",
      "sourceIds": [
        "SRC-007",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-029-038",
      "criterionId": "r030",
      "sourceIds": [
        "SRC-007",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-029-038",
      "criterionId": "r031",
      "sourceIds": [
        "SRC-008",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-029-038",
      "criterionId": "r032",
      "sourceIds": [
        "SRC-008",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "VERIFIED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-029-038",
      "criterionId": "r033",
      "sourceIds": [
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "VERIFIED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-029-038",
      "criterionId": "r034",
      "sourceIds": [
        "SRC-007",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "VERIFIED",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-029-038",
      "criterionId": "r035",
      "sourceIds": [
        "SRC-017",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-029-038",
      "criterionId": "r036",
      "sourceIds": [
        "SRC-008",
        "SRC-020",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-029-038",
      "criterionId": "r037",
      "sourceIds": [
        "SRC-008",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-029-038",
      "criterionId": "r038",
      "sourceIds": [
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    }
  ]
} as const
