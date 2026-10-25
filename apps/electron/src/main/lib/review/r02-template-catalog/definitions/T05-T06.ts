import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "T05-T06",
  "version": 1,
  "schemaVersion": 2,
  "name": "专业、学科建设及评估申报材料审核",
  "description": "本地研究模板 · 非校方正式模板。成都理工大学专业、学科建设及评估申报材料的校内事实预审；不代替任何校内外授权机关的审议、评审、备案或批准。政策证据状态为 PARTIAL；仅用于本地事实预审与问题提示，不代表校方授权，不生成学校远端回写或正式批准。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: T05-T06 来自 R02 research-original；非校方正式模板，校内授权和现行政策尚未全部确认；SRC IDs 仅为研究来源，不是案卷 SourceRef。",
  "objectType": "organization",
  "displayName": {
    "template": "T05-T06 · 专业、学科建设及评估申报材料审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "scenario 枚举·ReviewCase",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "A；批次任务与经办分类，M001 标题/正文和 M004 首段；P1；无法区分赛道→POLICY_UNCONFIRMED，不得默认最宽或最严"
    },
    {
      "key": "F002",
      "label": "batch_id 字符串·BatchPolicy",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "A；归口批次通知/号，M001 页眉、来源 URL；P1；无官方批次→仅草案建档，不允许自动合格"
    },
    {
      "key": "F003",
      "label": "policy_version 字符串/哈希·BatchPolicy",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "A；发布机关原文及附件，M001、M007 标准封面/修订日期；P0/P1；仅历史版→POLICY_UNCONFIRMED；源失联→SOURCE_UNAVAILABLE"
    },
    {
      "key": "F004",
      "label": "deadline 时间/阶段枚举·BatchPolicy",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "A 条件；当期公告 M001 截止条款；2025 例 SRC-017/020 不可沿用；P0；不知道→空值+待归口确认，不生成逾期违规"
    },
    {
      "key": "F005",
      "label": "institution_id 机构码·ReviewCase",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "A；正式学校主体信息/学校组织主数据、M002；P1；与对外表单校名不一致→CONFLICT"
    },
    {
      "key": "F006",
      "label": "origin_unit_id 机构码·Target",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B；学校当前院系组织关系、M002 或可信签发证明；P1；院系改名/合并→人工核历史归属"
    },
    {
      "key": "F007",
      "label": "operator_uid 不透明用户 ID·ActorGrant",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B/E；可信登录与操作审计/授权凭证 M002，不信 OCR 自报姓名；P2；未可信鉴权→阻断正式签批，事实材料可待审"
    },
    {
      "key": "F008",
      "label": "delegation_ref 文件/授权记录 ID·ActorGrant",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "B/E 条件；校内授委托 M002 的签发号、代理范围/时限；P2；非代理记 NOT_APPLICABLE；冒名/过期→人工确认"
    },
    {
      "key": "F009",
      "label": "target_kind 枚举·Target",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "A/B；M001 类别、M003 正式目录/项目指南；P0；不属于本模板→路由复核，禁止自行扩目的"
    },
    {
      "key": "F010",
      "label": "target_name 字符串·Target",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B；M003 官方名称与 M004/11/18/20/21 表头；P0/P1；别名不自动视同；需代码或官方更名链"
    },
    {
      "key": "F011",
      "label": "target_code 字符串·Target",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B；M003 当年专业/学科目录、学科代码及对象清单；P1；代码缺失不猜测；停用代码标 CONFLICT 待核"
    },
    {
      "key": "F012",
      "label": "education_level 枚举·Target",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B 条件；本科/学科层级由 M003 官方目录或权威记录决定；P1；与专业/学科类别不符→CONFLICT，非个人学籍阶段"
    },
    {
      "key": "F013",
      "label": "action_subtype 枚举·ReviewCase",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "A/B；M001 申报范围及 M004 调整/新设/认证/监测说明；P1；旧批次类型代新批次→POLICY_UNCONFIRMED"
    },
    {
      "key": "F014",
      "label": "target_official_status 枚举/日期·Target",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B；正式批准/备案或状态快照 M003、M032；P1；“拟设”不等于“已设”；无权威结果则未知"
    },
    {
      "key": "F015",
      "label": "standard_version 字符串/附件哈希·BatchPolicy",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "A/B 条件；M007、协会正式标准/当批指南，SRC-016/018；P0；过渡期版本冲突→本批授权/协会确认，不按上传时间选择"
    },
    {
      "key": "F016",
      "label": "accreditation_cycle 周期 ID/日期·Target",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "A 条件；M015 正式认证结果的起止日；P1；首次申请 NOT_APPLICABLE；年度/再认证无结果→需权威核"
    },
    {
      "key": "F017",
      "label": "accreditation_result 结构化结论·ExternalRecord",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "A 条件或 F；M015/M027 协会通知或名单，官方页/文号；P1；会议进度不可替代正式结果，缺→SOURCE_UNAVAILABLE/待核"
    },
    {
      "key": "F018",
      "label": "indicator_framework 版本引用·BatchPolicy",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "A/B 条件；M001/M007 当轮指标、口径页；P1；旧第五轮/旧监测口径→POLICY_UNCONFIRMED"
    },
    {
      "key": "F019",
      "label": "indicator_code 字符串·IndicatorClaim",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B 条件；M007 规则表行/字段 ID；指标包 M018/M020；P1；无确定指标体系不按同名字段硬比"
    },
    {
      "key": "F020",
      "label": "measurement_period 日期区间·IndicatorClaim",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B 条件；M006 源查询条件、M007 指标注释；P1；时段不一致→CONFLICT，不得自动补齐样本"
    },
    {
      "key": "F021",
      "label": "source_department 机构码·IndicatorClaim",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B 条件；M006 业务主数据/部门回执落款、SRC-006；P1；来源院系未知→NEEDS_MATERIAL/原归口核验"
    },
    {
      "key": "F022",
      "label": "source_record_ref 记录号/URI·IndicatorClaim",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B 条件；M006 原始台账行/审计 ID/证明页；不假设接口；P2/P3；原记录失联→SOURCE_UNAVAILABLE，不让 AI 编造"
    },
    {
      "key": "F023",
      "label": "indicator_value 数字/文本·IndicatorClaim",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B 条件；M006 来源值与 M004、M018、M020 文本页格；P1–P3；单位/口径不明不能做数值结论；差异→CONFLICT"
    },
    {
      "key": "F024",
      "label": "measurement_unit 字符串·IndicatorClaim",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B 条件；M007 单位定义、M006 原统计单位；P1；缺单位先补口径，不擅自万元与元换算后判违规"
    },
    {
      "key": "F025",
      "label": "attribution_scope 对象集合/比例·IndicatorClaim",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B 条件；M008 学科/院系归属确认、M006 原归属字段；P2；两单位重复计入同成果→CONFLICT 待权责部门决定"
    },
    {
      "key": "F026",
      "label": "joint_owner_ack 授权记录引用·IndicatorClaim",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "C 条件；M008 多部门签发/共享数据职责记录；P2；单院数据不触发；多人争议不得自动裁断"
    },
    {
      "key": "F027",
      "label": "narrative_claim 文本·ReviewCase",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "B；M004/M011/M013/M018/M020/M021 段落；P1；事实缺证链接→NEEDS_MATERIAL，评价性判断→人工"
    },
    {
      "key": "F028",
      "label": "evidence_manifest 结构化索引·EvidenceItem",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B；M005 清单中的材料 ID→页码/表格→指标映射；P1/P2；丢映射仅针对该项缺证；不把全案判拒"
    },
    {
      "key": "F029",
      "label": "draft_revision 递增版本号·ReviewCase",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "B 起；M004/M005 版本元数据和可信操作审计；P1；同名不同内容先分叉；禁止静默覆盖"
    },
    {
      "key": "F030",
      "label": "artifact_hash 哈希·EvidenceItem",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B 起；M005 每文件校验码/原始二进制校验；P1；无校验不可声称“同一版”；留版本争议待核"
    },
    {
      "key": "F031",
      "label": "source_checked_at 时间戳·IndicatorClaim",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B/C；M006 导出/签发时间与校核审计；P1；过期多久算无效无统一阈值，转当批配置"
    },
    {
      "key": "F032",
      "label": "unit_confirmation 签发记录引用·ReviewCase",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "C 条件；M023 学院/建设单位正式确认、签发者权限；P2；B 阶段尚未要求；缺校本必经规定仅待确认"
    },
    {
      "key": "F033",
      "label": "department_confirmation 签发记录引用·IndicatorClaim",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "C 条件；M022 教务/学科/统计/人事等各源部门意见；P2；每部门只对其掌握的事实负责；不同意见 CONFLICT"
    },
    {
      "key": "F034",
      "label": "expert_opinion_ref 文书引用·ReviewCase",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "C 条件；M024 当次专家纪要/评审意见及被评版本；P2；没有证据要求专家论证时 NOT_APPLICABLE"
    },
    {
      "key": "F035",
      "label": "school_decision_ref 文书引用·InternalDecision",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "E 条件；M025 有权校方决定/真实签章/会议号；P2；未签发时不可填“通过”；签章无授权→人工决断"
    },
    {
      "key": "F036",
      "label": "external_submission_ref 交易/回执 ID·InternalDecision",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "E 之后；M026 正式报送凭据及相应哈希；P1/P2；未对外提交时不要求；录入号不证明审批结果"
    },
    {
      "key": "F037",
      "label": "external_acceptance_ref 回执/时间·ExternalRecord",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "F 条件；M027 官方受理/补正通知；P1/P2；无受理仅显示未知，不能把上传成功当受理"
    },
    {
      "key": "F038",
      "label": "external_result_ref 决定文号/状态·ExternalRecord",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "F/G 条件；M027 正式认证/评估/备案/审批结果；P1/P2；仅引用机关决定，禁止 AI 自动评等/批准"
    },
    {
      "key": "F039",
      "label": "revision_reason_and_base 说明与旧版本引用·RevisionAction",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "D 触发；M028 补件单及 M005 旧版文件位置；P1/P2；没有补件则 NOT_APPLICABLE；改已审定版须重新授权"
    },
    {
      "key": "F040",
      "label": "review_request_ref 请求号/送达日·RevisionAction",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "D/F 条件；M030 本人/学校授权提出异议及所针对通知；P2；认证申诉期限只按现行核准的 SRC-021；不自造校内复议"
    },
    {
      "key": "F041",
      "label": "withdrawal_request_ref 请求号/状态·RevisionAction",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "D/E/F 条件；M029 撤回申请与原机构正式处理回执；P2；提出撤回不等于生效；逾期/可否撤回转人工"
    },
    {
      "key": "F042",
      "label": "disclosure_class 枚举及公开范围·EvidenceItem",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "B 起；M031 校内信息分类/书面授权及来源敏感度；P3；无对外公开授权默认限内；禁止泄露学生/专家材料"
    },
    {
      "key": "F043",
      "label": "predeclaration_ref 预申报平台号/发展规划关联及日期·Target",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B，仅拟新设本科专业；M033 学校发展规划中的专业条目和当次受权预申报存根；SRC-024 第四项；P1；原则上一年预报但存在排除/例外，缺当批准用或豁免依据→POLICY_UNCONFIRMED，不机械拒绝"
    },
    {
      "key": "F044",
      "label": "school_review_body 枚举及审议记录号·InternalDecision",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "E，拟新设本科专业；M025 学校党委会或校长办公会的真实审议原件与 M004/M009 冻结版本；SRC-024 第五项；P2；B/C 尚未举行→NOT_APPLICABLE；E 无可信决定→NEEDS_HUMAN_DECISION，扫描章非签发认证"
    },
    {
      "key": "F045",
      "label": "school_publication_window {url,start,end,timezone,hash}·PublicationRecord",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "E，拟新设本科专业；M034 校官网公示及可信发布时间与附件快照；SRC-024 第五项；P1；E 阶段确已公示却不能核时长→SOURCE_UNAVAILABLE/待核；B/C 尚未公示不能报缺件"
    },
    {
      "key": "F046",
      "label": "withdrawal_consultation_ref 意见征集、公示及处理记录引用·ReviewCase",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "case",
      "extractionHint": "C/E，专业撤销；M035 校内向相关单位征求意见、公示及原件发布证明；SRC-024 第八项；P1/P2；未到相应阶段→NA；外部/校本异议处理期限未知→人工裁定，不能借新设五天规则"
    },
    {
      "key": "F047",
      "label": "institution_condition_status 结构体·SchoolStatus",
      "kind": "text",
      "required": false,
      "visibility": "public",
      "scope": "subject",
      "extractionHint": "B/E，拟新增专业，官方状态可得时；M036 学校整体本科教学合格评估结果、基础办学条件达标状态及整改结果的有权来源；SRC-024 第十一项；P1；无权威正式结果→SOURCE_UNAVAILABLE，不得从一则新闻或指标自报推出暂停增设"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "当批事项、规则与期限",
      "purpose": "当批事项、规则与期限；归口部门/外部发布机关；当前必需·A：有权主体当批通知、附件、适用类别与指标说明；官方信息优先获取；官方可验证通知或签发正式函；F001–F004、F009、F013；SRC-001/002/013/017/020（历史批次须降级）；签发机关+发布时点+附件版；无当批正本→POLICY_UNCONFIRMED，原 URL 失联→SOURCE_UNAVAILABLE，扫描不可读→UNREADABLE。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "当批事项、规则与期限",
        "归口部门/外部发布机关",
        "当前必需·A：有权主体当批通知、附件、适用类别与指标说明",
        "官方信息优先获取",
        "官方可验证通知或签发正式函"
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
      "name": "学校、院系和经办/代理授权",
      "purpose": "学校、院系和经办/代理授权；学校组织与身份授权方；当前必需·B，经办/正式动作 E 再验：可信组织关系、经办岗位、代理委托；正式授权记录/校内有权管理员签发可核证明；F005–F008、F032、F035；SRC-001/002/005/015；绑定任职起止、权限范围、对象；伪造 actor/失效代理→NEEDS_HUMAN_DECISION，源无接口请求人工核。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "学校、院系和经办/代理授权",
        "学校组织与身份授权方",
        "当前必需·B，经办/正式动作 E 再验：可信组织关系、经办岗位、代理委托",
        "正式授权记录/校内有权管理员签发可核证明",
        "F005–F008、F032、F035"
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
      "id": "M003",
      "name": "专业、学科与项目真实对象状态",
      "purpose": "专业、学科与项目真实对象状态；教务/学科归口及国家目录；当前必需·B：当年专业目录、编码、正式既有状态或项目清单（优先由校级取源）；正式目录快照/备案公告/授权机关决定；F009–F014；SRC-001/002/011/013/014；目录年份+对象代码+源机关；代码歧义 CONFLICT，旧码需沿革凭证，不强制重新上传官网文件。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "专业、学科与项目真实对象状态",
        "教务/学科归口及国家目录",
        "当前必需·B：当年专业目录、编码、正式既有状态或项目清单（优先由校级取源）",
        "正式目录快照/备案公告/授权机关决定",
        "F009–F014"
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
      "id": "M004",
      "name": "本次申请的业务叙述与目标",
      "purpose": "本次申请的业务叙述与目标；院系/建设单位；当前必需·B：拟报专业/学科/项目申请草稿或带责任人说明；当批电子表单的草稿记录；F010、F013、F027、F029；SRC-005/006/007/015；明确“拟申报”状态、作者和稿次；缺草稿 NEEDS_MATERIAL；不可读 UNREADABLE。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "本次申请的业务叙述与目标",
        "院系/建设单位",
        "当前必需·B：拟报专业/学科/项目申请草稿或带责任人说明",
        "当批电子表单的草稿记录",
        "F010、F013、F027、F029"
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
      "name": "逐主张证据地图",
      "purpose": "逐主张证据地图；院系材料责任人；当前必需·B（有证据主张时）：材料索引、指标→源→页格定位、哈希/版本清单；有版本号的官方业务包清单；F027–F030、F042；SRC-003（历史实践）、005/015；按文件/指标标所有者，替换时保留旧 hash；缺某行仅该主张缺证，不将整包批准/否决。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "逐主张证据地图",
        "院系材料责任人",
        "当前必需·B（有证据主张时）：材料索引、指标→源→页格定位、哈希/版本清单",
        "有版本号的官方业务包清单",
        "F027–F030、F042"
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
      "name": "指标原始数据真实性",
      "purpose": "指标原始数据真实性；统计、人事、教务、科研、学科等数据拥有部门；条件必需·B：只有当前叙述或指标需要数值时，取正式业务台账/可核对导出页格；等证明力部门签发统计证明、带查询口径的只读记录；F020–F025、F031；SRC-006/010；源部门、期间、查询条件、记录号各自保留；源故障 SOURCE_UNAVAILABLE，模糊 OCR UNREADABLE，值冲突 CONFLICT。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "指标原始数据真实性",
        "统计、人事、教务、科研、学科等数据拥有部门",
        "条件必需·B：只有当前叙述或指标需要数值时，取正式业务台账/可核对导出页格",
        "等证明力部门签发统计证明、带查询口径的只读记录",
        "F020–F025、F031"
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
      "name": "指标定义与适用标准",
      "purpose": "指标定义与适用标准；外部发布者或校级批次归口；条件必需·A/B：该情形正式指标说明、专业认证标准版本/附件；可校验的发布页与标准 PDF 原件；F003、F015、F018、F019、F024；SRC-010/016/018；绑定轮次和过渡版；仅旧版或版本未核 POLICY_UNCONFIRMED，不能依据 2020 年第五轮自动退件。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "指标定义与适用标准",
        "外部发布者或校级批次归口",
        "条件必需·A/B：该情形正式指标说明、专业认证标准版本/附件",
        "可校验的发布页与标准 PDF 原件",
        "F003、F015、F018、F019、F024"
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
      "id": "M008",
      "name": "跨院系数据归属及共同引用的责任分工",
      "purpose": "跨院系数据归属及共同引用的责任分工；涉及的每个源单位和归口部门；条件必需·B/C：同成果涉及多学科、多学院或口径拆分时的确认链；可证明各单位确认的原系统归属字段/校级归属仲裁记录；F021、F025、F026；SRC-006/010；每单位分别签名绑定统计年和指标；意见冲突转 CONFLICT，AI 不分配归属比例。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "跨院系数据归属及共同引用的责任分工",
        "涉及的每个源单位和归口部门",
        "条件必需·B/C：同成果涉及多学科、多学院或口径拆分时的确认链",
        "可证明各单位确认的原系统归属字段/校级归属仲裁记录",
        "F021、F025、F026"
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
      "name": "本科专业新设/调整的必要性及建设可行性",
      "purpose": "本科专业新设/调整的必要性及建设可行性；申报学院；条件必需·SCN-BK-SET B：按本年指南适用的论证/调整建议文本；当批相应专业设置电子申报稿；F010–F014、F027；SRC-001/011/012/013；拟新设/拟撤/调整分版本，不把第三方转载作为必然清单；无当批表单先 POLICY_UNCONFIRMED。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "本科专业新设/调整的必要性及建设可行性",
        "申报学院",
        "条件必需·SCN-BK-SET B：按本年指南适用的论证/调整建议文本",
        "当批相应专业设置电子申报稿",
        "F010–F014、F027"
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
      "name": "专业影响、师资条件、培养资源等事实佐证",
      "purpose": "专业影响、师资条件、培养资源等事实佐证；拥有相关数据的学校部门；条件必需·SCN-BK-SET B/C：本年通知确有对应指标且申请人主张了相关事实；校内经验证已有数据/已批准培养方案权威引用（T05 邻项）；F020–F025、F027；SRC-001/011/013；仅取所需统计口径；缺源记录 SOURCE_UNAVAILABLE/NEEDS_MATERIAL，不重审教师职称。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "专业影响、师资条件、培养资源等事实佐证",
        "拥有相关数据的学校部门",
        "条件必需·SCN-BK-SET B/C：本年通知确有对应指标且申请人主张了相关事实",
        "校内经验证已有数据/已批准培养方案权威引用（T05 邻项）",
        "F020–F025、F027"
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
      "id": "M011",
      "name": "工程认证首次/重新申请",
      "purpose": "工程认证首次/重新申请；专业所属学校，院系负责起草；当前必需·SCN-BK-ACC/A 的 B：当批正式申请书及学校后续报送时的盖章版本；协会正式申请系统的草稿/经校方签发申请书；F009–F017、F027；SRC-017/018；2025 版仅该年实例；院系阶段不要求已盖章 E 版，正式报送时才核 M025/M026。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "工程认证首次/重新申请",
        "专业所属学校，院系负责起草",
        "当前必需·SCN-BK-ACC/A 的 B：当批正式申请书及学校后续报送时的盖章版本",
        "协会正式申请系统的草稿/经校方签发申请书",
        "F009–F017、F027"
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
      "id": "M012",
      "name": "工程认证进入自评阶段的前置受理",
      "purpose": "工程认证进入自评阶段的前置受理；认证协会；后续产生·首次申报 F 受理后、转自评 B 才需：正式受理通知；协会平台权威受理状态记录；F016、F037；SRC-017/018；必须与专业代码、年份、轮次一致；尚未受理不能当缺件；无权威通知不得伪造受理。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "工程认证进入自评阶段的前置受理",
        "认证协会",
        "后续产生·首次申报 F 受理后、转自评 B 才需：正式受理通知",
        "协会平台权威受理状态记录",
        "F016、F037"
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
      "id": "M013",
      "name": "已受理专业自评报告",
      "purpose": "已受理专业自评报告；学校/专业工作组；条件必需·SCN-BK-ACC/S 的 B/C：按该次标准的自评文本；已报协会版本/校内冻结自评稿；F015、F027–F030；SRC-005/015/016/018；同一轮标准/报告版；首次申请 B 阶段不必交；报告不可读仅该槽 UNREADABLE。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "已受理专业自评报告",
        "学校/专业工作组",
        "条件必需·SCN-BK-ACC/S 的 B/C：按该次标准的自评文本",
        "已报协会版本/校内冻结自评稿",
        "F015、F027–F030"
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
      "id": "M014",
      "name": "自评主张对应的课程、培养和毕业要求原始档案",
      "purpose": "自评主张对应的课程、培养和毕业要求原始档案；教务、课程组、质量保证责任单位；条件必需·SCN-BK-ACC/S 的 B/C：被本次报告引用、已有且当批要求的具体原件；正式教务存档与既有 T05-T01/T01 授权结论的只读引用；F020–F028；SRC-005/015/018/019；保留课程年度、目录及权限；不得把课程业务审核纳入本模板重新审批，不能无差别收全校学生明细。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "自评主张对应的课程、培养和毕业要求原始档案",
        "教务、课程组、质量保证责任单位",
        "条件必需·SCN-BK-ACC/S 的 B/C：被本次报告引用、已有且当批要求的具体原件",
        "正式教务存档与既有 T05-T01/T01 授权结论的只读引用",
        "F020–F028"
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
      "id": "M015",
      "name": "工程认证已存在的正式结论及有效期",
      "purpose": "工程认证已存在的正式结论及有效期；认证协会/学校归口；当前必需·SCN-BK-ACC/M、R 的 A：有效结论、有效期和上轮待改进事项；协会正式认证名单/通知及可核文件；F016、F017、F038；SRC-018/019/020；专业代码/周期一一绑定；只见学院“推进会”不得视为已认证。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "工程认证已存在的正式结论及有效期",
        "认证协会/学校归口",
        "当前必需·SCN-BK-ACC/M、R 的 A：有效结论、有效期和上轮待改进事项",
        "协会正式认证名单/通知及可核文件",
        "F016、F017、F038"
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
      "name": "有效期内年度持续改进原始材料",
      "purpose": "有效期内年度持续改进原始材料；专业已有教学档案持有人；条件必需·SCN-BK-ACC/M 当年 B：本年度已产生的评价、修订、报告与报备目录；校内已有教学档案、协会系统登记或可访问归档引用；F016、F020、F027、F028；SRC-019/020；不另造年度总结、不要求全部课程/所有学生扫描；本年实际材料不完整按当轮要求核，不以旧年度文件充当。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "有效期内年度持续改进原始材料",
        "专业已有教学档案持有人",
        "条件必需·SCN-BK-ACC/M 当年 B：本年度已产生的评价、修订、报告与报备目录",
        "校内已有教学档案、协会系统登记或可访问归档引用",
        "F016、F020、F027、F028"
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
      "id": "M017",
      "name": "认证有效期第三年中期持续改进报告",
      "purpose": "认证有效期第三年中期持续改进报告；专业/学校；后续产生·仅周期到第三年 B/E 才需：中期报告与改进证据汇总；协会系统正式提交版/学校已有归档；F016、F017、F027、F036；SRC-018/019/020；周期、提交年绑定；首年/次年/未认证不适用；2025 窗口不可借用为 2026 硬截止。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "认证有效期第三年中期持续改进报告",
        "专业/学校",
        "后续产生·仅周期到第三年 B/E 才需：中期报告与改进证据汇总",
        "协会系统正式提交版/学校已有归档",
        "F016、F017、F027、F036"
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
      "name": "当轮学科评估申报表及数据包",
      "purpose": "当轮学科评估申报表及数据包；学科建设办公室/学科单位；条件必需·SCN-DISC-EVAL 的 B：本轮通知给定的表、指标与基础事实；评估机关正式系统中的可核草稿/报送存根；F009–F014、F018–F028；SRC-002/010；第五轮历史表只供设计参考，现轮未确认→POLICY_UNCONFIRMED；不得推测评分。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "当轮学科评估申报表及数据包",
        "学科建设办公室/学科单位",
        "条件必需·SCN-DISC-EVAL 的 B：本轮通知给定的表、指标与基础事实",
        "评估机关正式系统中的可核草稿/报送存根",
        "F009–F014、F018–F028"
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
      "name": "学科成果、人员、平台等来源证明",
      "purpose": "学科成果、人员、平台等来源证明；数据对应的学科/科研/人事等部门；条件必需·SCN-DISC-EVAL B：仅申报指标真实要求且主张已作出时使用；权威成果认定/人事/科研台账及邻接模板的正式结论索引；F019–F026；SRC-010/008；一成果多学科必须 M008；不能由论文 PDF 自动判定学科得分或教师聘任。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "学科成果、人员、平台等来源证明",
        "数据对应的学科/科研/人事等部门",
        "条件必需·SCN-DISC-EVAL B：仅申报指标真实要求且主张已作出时使用",
        "权威成果认定/人事/科研台账及邻接模板的正式结论索引",
        "F019–F026"
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
      "name": "“双一流”监测当年任务及填报草案",
      "purpose": "“双一流”监测当年任务及填报草案；校学科归口、建设单位和职能部门；条件必需·SCN-DISC-MON 的 B：年度指标任务书及数据表；校级正式指标分解表、监测平台可核草稿；F018–F028；SRC-006；2023 年度历史模板不可覆盖当年；无正式年度方案 POLICY_UNCONFIRMED。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "“双一流”监测当年任务及填报草案",
        "校学科归口、建设单位和职能部门",
        "条件必需·SCN-DISC-MON 的 B：年度指标任务书及数据表",
        "校级正式指标分解表、监测平台可核草稿",
        "F018–F028"
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
      "id": "M021",
      "name": "学科建设专项/交叉平台申报论证稿",
      "purpose": "学科建设专项/交叉平台申报论证稿；项目责任单位；条件必需·SCN-DISC-BUILD 的 B：目标、资源、计划与经费来源事实（当批规定）；批次正式项目书、学校存档的既有资源证明；F010–F014、F023–F028；SRC-007；2024 专题论证非通用门槛；预算数值不等于批准支出，财务权责另行路由。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "学科建设专项/交叉平台申报论证稿",
        "项目责任单位",
        "条件必需·SCN-DISC-BUILD 的 B：目标、资源、计划与经费来源事实（当批规定）",
        "批次正式项目书、学校存档的既有资源证明",
        "F010–F014、F023–F028"
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
      "name": "来源职能部门数据核验意见",
      "purpose": "来源职能部门数据核验意见；数据原持有人；后续产生·C 且本批有核验环节才需：数值、归属、周期确认；正式部门确认记录/来源系统签发状态；F021–F026、F031、F033；SRC-001/002/006；多部门分别签名，签错对象/版本 CONFLICT；B 初稿无此意见正常。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "来源职能部门数据核验意见",
        "数据原持有人",
        "后续产生·C 且本批有核验环节才需：数值、归属、周期确认",
        "正式部门确认记录/来源系统签发状态",
        "F021–F026、F031、F033"
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
      "id": "M023",
      "name": "院系/建设单位材料确认",
      "purpose": "院系/建设单位材料确认；本次院系有权负责人；后续产生·C 且批次要求时：该版整体真实性与范围确认；正式校内业务审批流/纸本有效确认记录；F006–F008、F029–F032；SRC-005/015；绑定被确认哈希；仅 OCR 姓名、代理失效为 NEEDS_HUMAN_DECISION。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "院系/建设单位材料确认",
        "本次院系有权负责人",
        "后续产生·C 且批次要求时：该版整体真实性与范围确认",
        "正式校内业务审批流/纸本有效确认记录",
        "F006–F008、F029–F032"
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
      "id": "M024",
      "name": "专家论证纪要或评价意见",
      "purpose": "专家论证纪要或评价意见；受委任专家组和归口部门；后续产生·C 且发生正式专家程序时；有组织者、人员、时间、对象、版次的正式会议/论证记录；F029、F034；SRC-007（单次实例）；会议未举行或本批无此程序 NOT_APPLICABLE；AI 不能代写已签发的专家意见。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "专家论证纪要或评价意见",
        "受委任专家组和归口部门",
        "后续产生·C 且发生正式专家程序时",
        "有组织者、人员、时间、对象、版次的正式会议/论证记录",
        "F029、F034"
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
      "name": "学校正式审定/授权对外申报决定",
      "purpose": "学校正式审定/授权对外申报决定；学校有权机关；后续产生·E 对外报送前按程序取得：真实决议/签批/签章及批准报送范围；官方签批流程记录或学校合法有效公文；F007/008/029/030/035/044；SRC-003（历史专项）/017（2025 申请实例）/024（拟新设专业上位会议要求）；原决定绑定特定包；拟新设专业须符合 SRC-024 的党委会或校长办公会审议，但学校实际会议与签章资格仍未核；不得把该会次套入所有事项。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "学校正式审定/授权对外申报决定",
        "学校有权机关",
        "后续产生·E 对外报送前按程序取得：真实决议/签批/签章及批准报送范围",
        "官方签批流程记录或学校合法有效公文",
        "F007/008/029/030/035/044"
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
      "id": "M026",
      "name": "本校对外提交的真实版本凭证",
      "purpose": "本校对外提交的真实版本凭证；受权报送人及官方平台；后续产生·E 提交完成后：时间、操作者、平台交易号、报送版哈希；正式系统回执/不可改档案；F029、F030、F036；SRC-017/020（历史平台实例）；校内完成≠外部受理；跨版本提交需 CONFLICT 待人工核。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "本校对外提交的真实版本凭证",
        "受权报送人及官方平台",
        "后续产生·E 提交完成后：时间、操作者、平台交易号、报送版哈希",
        "正式系统回执/不可改档案",
        "F029、F030、F036"
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
      "id": "M027",
      "name": "外部受理、补正、评估/认证、批准备案结果",
      "purpose": "外部受理、补正、评估/认证、批准备案结果；外部有权机关；后续产生·F/G：官方通知、回执、公告、专家反馈、结果文号；可验证官方系统/公文链接；F017、F037、F038；SRC-010/014/018/021；结果类型与申报事项匹配；外部源故障 SOURCE_UNAVAILABLE，不能把未出现当“未通过”。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "外部受理、补正、评估/认证、批准备案结果",
        "外部有权机关",
        "后续产生·F/G：官方通知、回执、公告、专家反馈、结果文号",
        "可验证官方系统/公文链接",
        "F017、F037、F038"
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
      "id": "M028",
      "name": "补件/纠错申请及替代证据",
      "purpose": "补件/纠错申请及替代证据；原申报经办/源部门；条件必需·D 确实发起变更后：问题号、旧版、新版、改因及受影响指标；同权责主体正式修订记录/校内受理补正记录；F020–F030、F039；SRC-018（外部自评可补正）；同一材料换件触发旧版本事实结论失效，保留审计；无请求不必交。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "补件/纠错申请及替代证据",
        "原申报经办/源部门",
        "条件必需·D 确实发起变更后：问题号、旧版、新版、改因及受影响指标",
        "同权责主体正式修订记录/校内受理补正记录",
        "F020–F030、F039"
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
      "id": "M029",
      "name": "撤回/重报请求及其日后处理记录",
      "purpose": "撤回/重报请求及其日后处理记录；有权提出人、原受理机关；条件必需·D/E/F 真提出时：初次只需申请及原申报号，正式处理回执为后续产生；正式签发的撤回函、业务系统状态/新申报号；F007、F008、F036、F041；SRC-011/017/018（仅线索）；“申请撤回”与“批准撤回”分字段分版本；各批次能否撤回未证实，不可自动作废。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "撤回/重报请求及其日后处理记录",
        "有权提出人、原受理机关",
        "条件必需·D/E/F 真提出时：初次只需申请及原申报号，正式处理回执为后续产生",
        "正式签发的撤回函、业务系统状态/新申报号",
        "F007、F008、F036、F041"
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
      "id": "M030",
      "name": "复核或认证仲裁请求",
      "purpose": "复核或认证仲裁请求；学校受权人及原决定机关；条件必需·F/G 收到可争议通知并决定提出时：通知、送达日、具体争议、书面授权及支持证据；有权学校盖章申诉及认证协会监事会正式受理/其他机关该批复核凭证；F007、F008、F038、F040；SRC-010/018/021；认证 2020 试行 30 日须先核现行适用；与校内补件/学生申诉不是同一复核程序。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "复核或认证仲裁请求",
        "学校受权人及原决定机关",
        "条件必需·F/G 收到可争议通知并决定提出时：通知、送达日、具体争议、书面授权及支持证据",
        "有权学校盖章申诉及认证协会监事会正式受理/其他机关该批复核凭证",
        "F007、F008、F038、F040"
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
      "id": "M031",
      "name": "涉敏指标的访问/对外披露授权与脱敏规则",
      "purpose": "涉敏指标的访问/对外披露授权与脱敏规则；校内资料权责及保密职能；条件必需·B/E 涉敏或对外公示时；校级正式分类/授权、脱敏后的最小统计原件；F022、F023、F027、F042；SRC-003/021；任何未核对外授权视为校内限用；公开样本/专家保密意见不得从应用导出。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "涉敏指标的访问/对外披露授权与脱敏规则",
        "校内资料权责及保密职能",
        "条件必需·B/E 涉敏或对外公示时",
        "校级正式分类/授权、脱敏后的最小统计原件",
        "F022、F023、F027、F042"
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
      "id": "M032",
      "name": "学位授予资格的外部权威批准结论（仅引用）",
      "purpose": "学位授予资格的外部权威批准结论（仅引用）；国务院学位委员会及相关授权机关；条件必需·确实主张既有正式授权结果时，其原决定为本 ID 外部既成记录、不是本 ID 申请材料或审批动作；主管机关正式名单、文号/学校档案；F009–F014、F038；SRC-008/014；只有正本能证明资格；新闻“团队申报”不等于授权，缺时 SOURCE_UNAVAILABLE/待核，不从本 ID 推导批准。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "学位授予资格的外部权威批准结论（仅引用）",
        "国务院学位委员会及相关授权机关",
        "条件必需·确实主张既有正式授权结果时，其原决定为本 ID 外部既成记录、不是本 ID 申请材料或审批动作",
        "主管机关正式名单、文号/学校档案",
        "F009–F014、F038"
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
      "id": "M033",
      "name": "新设本科专业预申报/发展规划来源",
      "purpose": "新设本科专业预申报/发展规划来源；教务专业建设归口、受权报送人；条件必需·SCN-BK-SET/N B：学校现成发展规划专业条目、先期官方平台预申报存根；不是让学院重造公文；官方平台记录/校规划相应版本/有权机关豁免说明；F043、F009–F013；SRC-024 第四项；固定年度、申请专业和预申报号。上位“原则上”与类型例外必须保留；有无豁免由归口/当批决定，未知 POLICY_UNCONFIRMED。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "新设本科专业预申报/发展规划来源",
        "教务专业建设归口、受权报送人",
        "条件必需·SCN-BK-SET/N B：学校现成发展规划专业条目、先期官方平台预申报存根",
        "不是让学院重造公文",
        "官方平台记录/校规划相应版本/有权机关豁免说明"
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
      "id": "M034",
      "name": "拟新设专业校官网公示事实",
      "purpose": "拟新设专业校官网公示事实；校官网管理及教务归口；后续产生·E：真实学校会议审议通过后/按法定校内发布程序实施的公示，包括发布/截止时戳、拟报专业/论证附件快照；学校官网原页面及被确认的网页归档，F045/035/029/030，SRC-024 第五项；同一来源强于转载截图；原网址、时区、起止时戳、内容哈希和实际工作日日历；全国最低五工作日可核，日历/页面记录不可得时不造日期。B/C 不得缺件。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "拟新设专业校官网公示事实",
        "校官网管理及教务归口",
        "后续产生·E：真实学校会议审议通过后/按法定校内发布程序实施的公示，包括发布/截止时戳、拟报专业/论证附件快照",
        "学校官网原页面及被确认的网页归档，F045/035/029/030，SRC-024 第五项",
        "同一来源强于转载截图"
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
      "id": "M035",
      "name": "专业撤销校内征求意见、公示资料",
      "purpose": "专业撤销校内征求意见、公示资料；教务归口与校官网持有者；后续产生·SCN-BK-SET/C 的撤销子型 C/E；征求意见通知、回复处理记录、校官网公示、涉及对象及原专业状态；有权部门校内记录与官网存档；F046、F014、F029/030；SRC-024 第八项；只对撤销触发，不把五工作日新设时长套给撤销；缺院系实事证明时具体定位意见来源，仍须校级确认异议处理。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "专业撤销校内征求意见、公示资料",
        "教务归口与校官网持有者",
        "后续产生·SCN-BK-SET/C 的撤销子型 C/E",
        "征求意见通知、回复处理记录、校官网公示、涉及对象及原专业状态",
        "有权部门校内记录与官网存档"
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
      "id": "M036",
      "name": "学校是否受上位暂停增设约束的官方状态",
      "purpose": "学校是否受上位暂停增设约束的官方状态；教育行政/质量评估/办学条件数据持有部门；条件必需·SCN-BK-SET/N B/E：正式本科教学合格评估状态、基本办学条件指标达标/整改解除的权威快照；由校级源主动提供或合法证明；教育行政机关或学校有权职能部门可核验状态；F047、F005、F002；SRC-024 第十一项；不是学院申报附件；未知源状态→SOURCE_UNAVAILABLE 或政策核对待办；只读结果，不由 AI 对高校资格自行作行政结论。该材料槽按原文适用情形触发；minCount=0，不据此强制要求申请人重复上传系统/归口部门已有记录；是否必需按当批授权人工确认。",
      "requiredElements": [
        "学校是否受上位暂停增设约束的官方状态",
        "教育行政/质量评估/办学条件数据持有部门",
        "条件必需·SCN-BK-SET/N B/E：正式本科教学合格评估状态、基本办学条件指标达标/整改解除的权威快照",
        "由校级源主动提供或合法证明",
        "教育行政机关或学校有权职能部门可核验状态"
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
      "id": "rules-001-015",
      "name": "通用事实和证据核验",
      "description": "来源章节：通用事实和证据核验；保留原文规则编号、触发条件、证据来源和结果码。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "批次政策真伪·A",
          "requirement": "原文规则编号与阶段：R001 批次政策真伪·A。触发/例外条件：真：创建/切换申报批次；假：仅查看已有历史档案则 NA；未知：不知批次所属年份/发布机关；关联字段、材料与来源：F001–F004；M001；SRC-001、SRC-002、SRC-013、SRC-017、SRC-020、SRC-022。以 L0 发布机关正本核发号、事项、对象、适用期、附件哈希与任务对照；2025 历史通知不可充 2026 新批次；核验与结果：正本与建档字段吻合 PASS_FACT；混批/旧版 POLICY_UNCONFIRMED，两份正式通知相冲 CONFLICT；官网无法取回 SOURCE_UNAVAILABLE。下一：教务处或学科归口核政策。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "唯一事项和模板路由·A/B",
          "requirement": "原文规则编号与阶段：R002 唯一事项和模板路由·A/B。触发/例外条件：真：当前申请旨在专业/学科建设或评估材料事实预审；假：T01/T02/S02/其他 T05 或学位授予资格决定→NOT_APPLICABLE 并路由；未知：对象不明；关联字段、材料与来源：F001、F009、F012、F013；M001、M003、M004；SRC-001、SRC-002、SRC-003、SRC-014。对事项决定对象、身份层次与正式通知任务比对，不按表单标题相似度匹配；核验与结果：目标一致 PASS_FACT；边界模糊 NEEDS_HUMAN_DECISION 交目录 Owner；不可生成学位授予点审批。路由引用已存在权威结论，不新增模板。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "经办可信身份·B/E",
          "requirement": "原文规则编号与阶段：R003 经办可信身份·B/E。触发/例外条件：真：发生经办上传、部门确认、正式签批等动作；假：纯只读政策检索 NA；未知：账号来源不明；关联字段、材料与来源：F005–F007；M002；SRC-001、SRC-002、SRC-005、SRC-015。校方身份会话 uid + unit + action_time 与可信审计比；只验对应动作时点，不信 Renderer actor/OCR 自称；核验与结果：可信且动作权限匹配 PASS_FACT（身份事实）；未鉴权/越权 NEEDS_HUMAN_DECISION，不同主体冲突 CONFLICT。下一：学校身份及授权管理员。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "代理权限及签发范围·B/E",
          "requirement": "原文规则编号与阶段：R004 代理权限及签发范围·B/E。触发/例外条件：真：委托代理参与该次动作；假：本人且岗位授权可核则 NA；未知：代理性质/受托主体不明；关联字段、材料与来源：F006–F008、F035；M002、M025；SRC-001、SRC-002、SRC-017。L0/L2 委托起止、事项、单位和可执行动作逐项比对，不由文件内姓名推断代理权限；核验与结果：范围与时间一致 PASS_FACT；过期、越范围或真实性无法认定 NEEDS_HUMAN_DECISION；双方授权冲突 CONFLICT。下一：委托签发机关。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "申报对象代码与官方状态·B",
          "requirement": "原文规则编号与阶段：R005 申报对象代码与官方状态·B。触发/例外条件：真：有确定专业/学科或项目对象；假：纯通用政策咨询 NA；未知：对象代码缺失；关联字段、材料与来源：F009–F012、F014；M003、M004、M032；SRC-001、SRC-002、SRC-011、SRC-013、SRC-014、SRC-022。按对应年度官方专业/学科目录、备案/授权决定对名称、代码、学段及拟设/已设状态逐项核；变更使用正式沿革；核验与结果：官方记录吻合 PASS_FACT；名称/代码/已设状态矛盾 CONFLICT；索引无正文 SOURCE_UNAVAILABLE；目录过时 POLICY_UNCONFIRMED。下一：教务/学科归口。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r006",
          "title": "申报动作类别允许性·A/B",
          "requirement": "原文规则编号与阶段：R006 申报动作类别允许性·A/B。触发/例外条件：真：本批申请新设、撤销、认证、监测或建设专项某子类型；假：不存在该类申请 NA；未知：当批清单没有取得；关联字段、材料与来源：F001、F002、F009、F013；M001、M003、M004；SRC-001、SRC-007、SRC-011、SRC-013、SRC-017。只比较本轮允许动作类别和对象层级，不按往年单独案例推广；核验与结果：列在本批范围 PASS_FACT（类别事实）；不在范围但正式通知明确则 CONFLICT 并归口裁定，通知未读 POLICY_UNCONFIRMED。下一：批次归口。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r007",
          "title": "标准/指标版本效力·A/B",
          "requirement": "原文规则编号与阶段：R007 标准/指标版本效力·A/B。触发/例外条件：真：规则引用专业认证标准或学科指标；假：无指标型主张 NA；未知：未取得本次标准版本；关联字段、材料与来源：F003、F015、F018；M001、M007；SRC-010、SRC-016、SRC-018、SRC-019、SRC-020。对批准生效期、过渡期、专业补充标准与本次申报口径；2024 认证标准有过渡安排，不能按文档生成日决定版本；核验与结果：版本明确适用 PASS_FACT；两版与本轮通知冲突 CONFLICT，仅有旧轮规则 POLICY_UNCONFIRMED。下一：政策归口/协会确认。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "单个指标定义与统计口径·B",
          "requirement": "原文规则编号与阶段：R008 单个指标定义与统计口径·B。触发/例外条件：真：当前 IndicatorClaim 属于本次有效指标；假：未提出且未要求该指标 NA；未知：指标清单缺失；关联字段、材料与来源：F018–F020、F023、F024；M006、M007、M018、M020；SRC-006、SRC-010、SRC-016、SRC-019。比较指标 ID、分子分母、单位、统计起止/截止；不默认“教师人数”各版本同义；核验与结果：口径匹配 PASS_FACT；已有正式定义与本次填报字段不一致 CONFLICT；无最新定义 POLICY_UNCONFIRMED。下一：指标发布方和源数据部门。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r009",
          "title": "原始数据源、责任与时间·B",
          "requirement": "原文规则编号与阶段：R009 原始数据源、责任与时间·B。触发/例外条件：真：某量化或事实性指标被主张；假：纯文本无可客观取数项 NA；未知：源记录所在部门不明确；关联字段、材料与来源：F020–F022、F031；M005、M006、M019；SRC-001、SRC-002、SRC-006、SRC-010。按 L1/L2 源记录号、持有部门、查询时间、统计期间和原件页格核实；不得凭摘要或模型生成数据来源；核验与结果：完整可追溯 PASS_FACT；应由院系提供的源索引漏填 NEEDS_MATERIAL；学校系统不可查 SOURCE_UNAVAILABLE。下一：源部门数据管理员。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r010",
          "title": "指标数值及单位一一对应·B/C",
          "requirement": "原文规则编号与阶段：R010 指标数值及单位一一对应·B/C。触发/例外条件：真：申请草稿、数据表和权威源同时主张同指标值；假：该主张不是数值/无需比对 NA；未知：值或单位 OCR 不可辨；关联字段、材料与来源：F019–F024、F027；M004、M006、M007、M018、M020；SRC-006、SRC-010。固定指标 ID、区间、单位、归属后对报告页格与 L1/L2 源值等值比较，货币/比例换算必须有原口径依据；核验与结果：同口径相同 PASS_FACT；有效数据不等 CONFLICT；报表损坏 UNREADABLE；缺真实源 SOURCE_UNAVAILABLE。下一：源部门和建设单位联合核对。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r011",
          "title": "多单位成果归属与重复计入·B/C",
          "requirement": "原文规则编号与阶段：R011 多单位成果归属与重复计入·B/C。触发/例外条件：真：一成果跨学院/跨学科、或两份申报复用；假：源唯一归属无争议 NA；未知：项目/成果唯一号缺失；关联字段、材料与来源：F021、F022、F025、F026；M006、M008、M019、M020；SRC-006、SRC-008、SRC-010。原成果 ID、统计期、归属协议和各方确认分别对齐，既有科研/人事资格只引用权威结论；核验与结果：已有明确归属及允许复用 PASS_FACT；多方有效主张冲突 CONFLICT；如何拆分与计分 NEEDS_HUMAN_DECISION。下一：源单位、校级学科归属裁定者。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "r012",
          "title": "陈述与证据映射·B",
          "requirement": "原文规则编号与阶段：R012 陈述与证据映射·B。触发/例外条件：真：F027 有客观主张；假：纯评价性未来目标无可证实事实 NA；未知：无法定位原文主张；关联字段、材料与来源：F027–F030；M004、M005、M009、M011、M013、M018、M020、M021；SRC-003（旧专项）/005/015。逐条建立“主张句→本案 M→页格→F 来源→哈希”，不能以泛泛材料齐全代替事实对应；核验与结果：对应充分 PASS_FACT；现阶段应有佐证但没有 NEEDS_MATERIAL；源文不可读 UNREADABLE。下一：院系材料负责人。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r013",
          "title": "文件可读性结果的本案归属·B/G",
          "requirement": "原文规则编号与阶段：R013 文件可读性结果的本案归属·B/G。触发/例外条件：真：该 M 已有可验证解析/人工取证结果；假：仅官方记录 ID、无需上传文件 NA；未知：读取凭证或版本不可得；关联字段、材料与来源：F028–F030；M004–M036 中实际提交且属于本阶段的文件；SRC-003、SRC-005、SRC-015（材料实例）、SRC-023（技术边界）。只读取真实文件解析组件/人工取证产生的文件 hash、页码和异常位置，固定 sourceVersion；G50 的 50 套业务候选目录不是 OCR 服务，公共阅读能力接口尚未验证；核验与结果：读出且归属/哈希匹配 PASS_FACT；文件损坏 UNREADABLE；唯一可信读取渠道不可达 SOURCE_UNAVAILABLE，不可直接当材料缺失。下一：材料持有者/基础读取责任人；不得重复造“第二套”读取结论。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "r014",
          "title": "文件主从版本/签发一致·B–G",
          "requirement": "原文规则编号与阶段：R014 文件主从版本/签发一致·B–G。触发/例外条件：真：文件改动、签发确认或对外报送后仍被引用；假：首次未签发草稿无版本争议 NA；未知：哈希或旧版关系无法确定；关联字段、材料与来源：F028–F031、F035、F036、F039、F044–F046；M005、M022–M028、M034、M035（后两者仅特定本科专业及相应阶段）；SRC-003、SRC-017、SRC-018、SRC-024。固定 target+batch+version+hash，确认/公示/报送仅比对对应冻结稿；保存原始文件不删除历史；核验与结果：版本链吻合 PASS_FACT；被签的是 H1 却交 H2 →CONFLICT 并冻结该签批引用；是否需重新签批 NEEDS_HUMAN_DECISION。下一：原签发者/归口报送人。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "证据涉敏/披露权·B/E/F",
          "requirement": "原文规则编号与阶段：R015 证据涉敏/披露权·B/E/F。触发/例外条件：真：含学生学业、未公开专家意见、涉敏科研或拟公开附件；假：已公开、不含限制内容且允许复用 NA；未知：无法获取单位分类决定；关联字段、材料与来源：F021–F023、F027、F042；M006、M014、M019、M031；SRC-003（历史）/018/019/021。仅判断是否有该批有权披露凭证和最小必要范围，不臆造校本保密等级；核验与结果：已获该范围授权 PASS_FACT（授权存在）；拟外发而未核授权 NEEDS_HUMAN_DECISION；读不到分类依据 SOURCE_UNAVAILABLE。下一：数据拥有部门/保密机构；默认校内受控。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        }
      ]
    },
    {
      "id": "rules-016-027",
      "name": "专业、学科各办理情形独立事实",
      "description": "来源章节：专业、学科各办理情形独立事实；保留原文规则编号、触发条件、证据来源和结果码。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r016",
          "title": "本科专业新设/调整事实包·B/C",
          "requirement": "原文规则编号与阶段：R016 本科专业新设/调整事实包·B/C。触发/例外条件：真：SCN-BK-SET/N/C 已正式启动；假：非设置申报 NA；未知：年度类别/预备案口径未核；关联字段、材料与来源：F009–F014、F020–F030；M003、M004、M009、M010；SRC-001/013/024/025。核拟设、调整、原状态、影响对象、既有资源与申请表互相对应；2026 目录收录不等于 CDUT 该专业已批，B/C 尚未要求 E 的公示或会议证明；核验与结果：源事实自洽 PASS_FACT；冲突 CONFLICT；2026 强制表单未证 POLICY_UNCONFIRMED。下一：教务专业建设负责人；R039–R043 分别承担法定前置程序，不在此重复审批。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r017",
          "title": "工程认证初申请基础条件事实·A/B",
          "requirement": "原文规则编号与阶段：R017 工程认证初申请基础条件事实·A/B。触发/例外条件：真：SCN-BK-ACC/A/再次申请且正式申请对象为工科专业；假：非工程认证 NA；未知：本批接受专业范围未核；关联字段、材料与来源：F009–F017、F020–F024；M001、M003、M006、M007、M011；SRC-016、SRC-017、SRC-018。核专业是否依法设立、毕业届次/授予学位及当批接受范围等已存在来源事实；2025 三届毕业生等条件仅在适用通知/规范经确认后启用为硬门槛；核验与结果：基础事实符合已核该轮条件 PASS_FACT；毕业事实矛盾 CONFLICT，当批规则或门槛未知 POLICY_UNCONFIRMED。下一：教务处/认证协会；AI 不决定协会受理。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r018",
          "title": "工程认证正式申请书阶段·B/E",
          "requirement": "原文规则编号与阶段：R018 工程认证正式申请书阶段·B/E。触发/例外条件：真：SCN-BK-ACC/A 已准备本轮申请书；假：仅受理后自评/年度维持 NA；未知：申请书版式未定；关联字段、材料与来源：F003、F015、F027–F030、F035、F036；M011、M025、M026；SRC-017、SRC-018。B 只核草稿对应本批申请书和实证字段；E 对正式提交版核学校真实盖章及哈希，2025 DOCX 不默认 2026 通用；核验与结果：B 草稿事实齐全 PASS_FACT；当前应有申请稿缺 NEEDS_MATERIAL；正式送出无授权 NEEDS_HUMAN_DECISION；当批格式不明 POLICY_UNCONFIRMED。下一：院系起草/教务报送人。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r019",
          "title": "工程认证受理前后门槛·F→B",
          "requirement": "原文规则编号与阶段：R019 工程认证受理前后门槛·F→B。触发/例外条件：真：SCN-BK-ACC/S 称已获协会受理；假：仍在首次申请阶段则该 R NA；未知：官方受理号查询不到；关联字段、材料与来源：F016、F017、F037；M012、M027；SRC-017、SRC-018。以协会 L0 受理通知的学校、专业代码、轮次和日期匹配，先有受理才进入自评；核验与结果：真凭证一致 PASS_FACT；学校自称已受理而官方相反 CONFLICT；官网失联 SOURCE_UNAVAILABLE。下一：协会平台受权报送人。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "已受理自评与佐证范围·B/C/E",
          "requirement": "原文规则编号与阶段：R020 已受理自评与佐证范围·B/C/E。触发/例外条件：真：SCN-BK-ACC/S 且 R019 受理经验证；假：仅初次申请/未受理 NA；未知：受理和标准版其中之一未知；关联字段、材料与来源：F015、F020–F030；M007、M012、M013、M014；SRC-005、SRC-015、SRC-016、SRC-018。逐段核自评报告的指标引用、现有课程/评价原件及当批标准；不对教学内容给认证分数；核验与结果：对应自洽 PASS_FACT；已有自评稿缺源 NEEDS_MATERIAL，口径矛盾 CONFLICT；未核标准 POLICY_UNCONFIRMED。下一：专业组与教务质量部门。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "既有认证结果及周期核实·A/F",
          "requirement": "原文规则编号与阶段：R021 既有认证结果及周期核实·A/F。触发/例外条件：真：SCN-BK-ACC/M/R 声称在有效期内、需延续或争议已有结果；假：首申无既有结果 NA；未知：名单/起止日不明；关联字段、材料与来源：F016、F017、F038；M015、M027；SRC-018、SRC-019、SRC-020。只读协会发布的认证结果、专业代码、起止日、有条件结论及上一轮问题，不由新闻推断获认证；核验与结果：L0 结果吻合 PASS_FACT；与自称结果冲突 CONFLICT；官方源失联 SOURCE_UNAVAILABLE。下一：协会结果核验员/教务归口。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r022",
          "title": "认证有效期年度改进已有原始材料·B/E",
          "requirement": "原文规则编号与阶段：R022 认证有效期年度改进已有原始材料·B/E。触发/例外条件：真：R021 确定专业处当年有效期且发生年度报备；假：未获认证/不是年度报备 NA；未知：2026 年年度要求或周期不明；关联字段、材料与来源：F016、F017、F020、F027–F030；M014、M015、M016、M026；SRC-019、SRC-020。按当年已评价课程和档案目录核实已有修订、评价原始文档及版本；不另造年度总结，不全量强收学生档案；核验与结果：现有归档事实可追溯 PASS_FACT；当批真正需要的已有材料缺 NEEDS_MATERIAL；2025 年份不能作为 2026 窗口→POLICY_UNCONFIRMED。下一：专业组档案负责人。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r023",
          "title": "第三年中期报告专属触发·B/E",
          "requirement": "原文规则编号与阶段：R023 第三年中期报告专属触发·B/E。触发/例外条件：真：R021 官方周期确认处第三年且当批要求提交中期；假：非第三年或尚未获认证→NOT_APPLICABLE；未知：有效期起点不明；关联字段、材料与来源：F016、F017、F027、F036；M015、M017、M026；SRC-018、SRC-019、SRC-020。用官方有效期对阶段而非申请年份，核已有年度材料汇总、中期报告及后续官方报送版；核验与结果：已提交对应真实报告 PASS_FACT；第三年 B 需要的稿缺 NEEDS_MATERIAL；当前批次期限无依据 POLICY_UNCONFIRMED。下一：专业组/教务归口。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r024",
          "title": "再认证、重大变化的既有事实·A/B",
          "requirement": "原文规则编号与阶段：R024 再认证、重大变化的既有事实·A/B。触发/例外条件：真：认证续期或发生课程/师资/设施重大变化并正式申请重认证；假：正常年度改进 NA；未知：重大变化条件/续期窗口不明确；关联字段、材料与来源：F013、F015–F017、F027、F039；M004、M011、M014、M015、M028；SRC-018、SRC-019、SRC-021。旧认证结果与变化事项、源数据、申请周期对比；由协会判断是否需要重新认证；核验与结果：变化事实和既有记录吻合 PASS_FACT；需否重认证及期限不明→NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED。下一：教务/协会，不自动中止认证。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r025",
          "title": "学科评估申报指标与原始归属·B/C",
          "requirement": "原文规则编号与阶段：R025 学科评估申报指标与原始归属·B/C。触发/例外条件：真：SCN-DISC-EVAL 有正式新一轮参评任务；假：非学科评估 NA；未知：仅拿到 2020 第五轮材料；关联字段、材料与来源：F009–F014、F018–F031；M003、M006、M007、M008、M018、M019；SRC-002、SRC-008、SRC-010。核当轮一级学科对象、时间口径、成果来源、归属和申报表；不自动评分也不从第五轮外推下一轮；核验与结果：已明确当轮指标且事实一致 PASS_FACT；源争议 CONFLICT；轮次不明必 POLICY_UNCONFIRMED。下一：学科建设办公室和源部门。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "group"
        },
        {
          "id": "r026",
          "title": "“双一流”年度监测口径与分工·A/B/C",
          "requirement": "原文规则编号与阶段：R026 “双一流”年度监测口径与分工·A/B/C。触发/例外条件：真：SCN-DISC-MON 当年度监测任务已建；假：学科专项/学科评估 NA；未知：只有 2023 年度案例；关联字段、材料与来源：F002、F003、F018–F031；M001、M006、M007、M008、M020；SRC-002、SRC-006。逐任务指标码→建设单位→各职能部门源数据→最终填报版，按同一监测年度核；不把历史工作会当 2026 通知；核验与结果：对照一致 PASS_FACT；两个主管部门指标冲突 CONFLICT；当年无正式指标 POLICY_UNCONFIRMED。下一：学科办/相关职能部门。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "subject"
        },
        {
          "id": "r027",
          "title": "学科专项/交叉平台论证材料事实·B/C",
          "requirement": "原文规则编号与阶段：R027 学科专项/交叉平台论证材料事实·B/C。触发/例外条件：真：SCN-DISC-BUILD 且有本年建设项目申报；假：非该项目 NA；未知：经费专项是否开放未知；关联字段、材料与来源：F009–F014、F020–F030；M001、M006、M021、M024；SRC-002、SRC-007。核项目名称、资源、资金来源、拟建目标与已有记录、专家程序是否本次通知真的要求；核验与结果：事实可证 PASS_FACT；项目资源数据冲突 CONFLICT；是否专家论证未知 POLICY_UNCONFIRMED。下一：学科归口与项目资金权责人，不能批准预算/采购。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "group"
        }
      ]
    },
    {
      "id": "rules-028-038",
      "name": "权责、后继决定及异议事实",
      "description": "来源章节：权责、后继决定及异议事实；保留原文规则编号、触发条件、证据来源和结果码。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r028",
          "title": "来源职能部门确认的事实·C",
          "requirement": "原文规则编号与阶段：R028 来源职能部门确认的事实·C。触发/例外条件：真：该批存在对应指标且需源部门确认；假：无当批确认要求 NA；未知：签发部门与权责不明；关联字段、材料与来源：F021–F026、F031、F033；M002、M006、M022；SRC-001、SRC-002、SRC-006。对签发机关实际掌握的字段、确认时间、哈希和业务对象；跨部门不相互代签；核验与结果：有权签发且针对本版 PASS_FACT；无签名但应有 NEEDS_MATERIAL；越权 NEEDS_HUMAN_DECISION。下一：数据原持有部门。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "院系/建设单位确认的事实·C",
          "requirement": "原文规则编号与阶段：R029 院系/建设单位确认的事实·C。触发/例外条件：真：按当批设置院系确认节点；假：未要求该程序 NA；未知：上会/签批前置顺序不明；关联字段、材料与来源：F006–F008、F029、F030、F032；M002、M005、M023；SRC-003（历史）/005/015。核责任单位、该版核验和签发时点；原扫描章无可信身份证据则不足；核验与结果：确认存在且版次匹配 PASS_FACT；要求已核却缺 NEEDS_MATERIAL；伪造角色 NEEDS_HUMAN_DECISION。下一：院系有权负责人/校级授权管理员。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r030",
          "title": "专家论证是否真实发生·C",
          "requirement": "原文规则编号与阶段：R030 专家论证是否真实发生·C。触发/例外条件：真：该实际批次依法规/通知要求或已举行专家论证；假：未触发或本批无此程序 NA；未知：仅见 SRC-007 2024 专题；关联字段、材料与来源：F029、F030、F034；M021、M024；SRC-003（历史）/007。核专家组被任命、会议时间、评议对象与签发纪要的版本；专家专业判断不由 AI 填充；核验与结果：纪要对应 PASS_FACT；未举行且尚未达到该阶段 NOT_APPLICABLE；必须举行却缺 NEEDS_MATERIAL；专家是否同意 NEEDS_HUMAN_DECISION。下一：归口组织者。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r031",
          "title": "校方正式同意报送决定的真实性·E",
          "requirement": "原文规则编号与阶段：R031 校方正式同意报送决定的真实性·E。触发/例外条件：真：计划对外提交，或申请称已获校方签批；假：B/C 尚未进入学校决定 NA；未知：当批审批机关/授权链缺；关联字段、材料与来源：F007、F008、F029、F030、F035；M002、M023、M024、M025；SRC-001/002/003（历史）/017/024。核签发主体、动作权限、稿件哈希、会议号/签章；拟新设专业另由 R040 核 SRC-024 指定的两类学校会议之一，不推断其他事项的会次；核验与结果：真签批且同版 PASS_FACT（存在性）；谁有权同意、是否准予不得 AI 判，缺授权 NEEDS_HUMAN_DECISION；H1≠H2 CONFLICT。下一：学校实际有权机关。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "对外提交的身份与版本·E",
          "requirement": "原文规则编号与阶段：R032 对外提交的身份与版本·E。触发/例外条件：真：学校自称已向外部正式提交；假：只准备申报 NA；未知：外部平台账号/递交凭证无法核；关联字段、材料与来源：F007、F008、F029、F030、F035、F036；M002、M025、M026；SRC-017、SRC-020。以官方平台收件/递交号、授权登录和已冻结文件 hash 核对，2025 申请系统只证明历史平台模式；核验与结果：正式提交版一致 PASS_FACT（提交事实）；账号/版次不符 CONFLICT/需授权人工；源不可得 SOURCE_UNAVAILABLE。下一：受权报送人。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "外部受理/补正状态的真实性·F",
          "requirement": "原文规则编号与阶段：R033 外部受理/补正状态的真实性·F。触发/例外条件：真：机关已向该申报给受理/补正通知；假：仅本地提交无受理消息 NA；未知：权威通知不可获取；关联字段、材料与来源：F036、F037；M012、M026、M027；SRC-010（旧轮）/017/018。按机关 L0 回执的专业/学科代码、年份、申请号、送达时点核对；不得把“上传成功”自动视为受理；核验与结果：官方通知吻合 PASS_FACT（受理事实）；学校自述与正式通知冲突 CONFLICT；失联 SOURCE_UNAVAILABLE。下一：外部平台受权经办人。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "外部评估、认证或备案结果来源·F/G",
          "requirement": "原文规则编号与阶段：R034 外部评估、认证或备案结果来源·F/G。触发/例外条件：真：有权外部机关已正式发布结论；假：仍评估中或未有结果 NA；未知：仅新闻/二次转载；关联字段、材料与来源：F014、F017、F038；M015、M027、M032；SRC-010、SRC-014、SRC-018、SRC-021、SRC-022。只验证文号、目标代码、结果时间、官方可查版本与申请批次；区分被受理、专家建议、学校意见及最后发布；核验与结果：权威原始结果存在且归属吻合 PASS_FACT（引用）；只有会议新闻不得填结果→SOURCE_UNAVAILABLE/待核；效力/解释 NEEDS_HUMAN_DECISION。下一：该结果发布机关。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r035",
          "title": "补件与版本传播事实·D/C/E/F",
          "requirement": "原文规则编号与阶段：R035 补件与版本传播事实·D/C/E/F。触发/例外条件：真：当前案件已被补件、源数据/报告替换；假：无改动 NA；未知：缺旧稿或替换关系；关联字段、材料与来源：F020–F030、F039、F043–F046；M005、M006、M008、M013、M018、M020、M028、M033–M035（按对象及阶段触发）；SRC-005、SRC-006、SRC-018、SRC-024。按更改前后主张→字段→证据 hash 依赖图仅重算受影响 R；如已校级签批、已完成校级公示或外部送出，不得自动迁移审批、公示或撤销其效力；核验与结果：影响边已识别 PASS_FACT（版本事实）；丢旧版/签批错配 CONFLICT，需重新签批/公示与否 NEEDS_HUMAN_DECISION。下一：源单位、原签发人和报送人。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r036",
          "title": "撤回/重报请求与生效状态·D/E/F",
          "requirement": "原文规则编号与阶段：R036 撤回/重报请求与生效状态·D/E/F。触发/例外条件：真：有权人提交撤回、重报或作废请求；假：未提出 NA；未知：本批可撤回/窗口不明；关联字段、材料与来源：F007、F008、F036、F039、F041；M002、M026、M027、M029；SRC-011、SRC-017、SRC-018。分别核“请求已发”“原机关是否正式受理/同意”“旧提交记录是否仍有效”，外部状态以原机关为准；核验与结果：请求存在 PASS_FACT（请求事实）不代表已撤回；是否可撤/已生效需原机关 NEEDS_HUMAN_DECISION；未有窗口规则 POLICY_UNCONFIRMED。下一：原受理机关/归口。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r037",
          "title": "异议复核/认证申诉的适格性和状态·F/G",
          "requirement": "原文规则编号与阶段：R037 异议复核/认证申诉的适格性和状态·F/G。触发/例外条件：真：取得可异议的正式结果，学校有意复核；假：未有结果/没有提出复核 NA；未知：申诉受理规则或送达日不明；关联字段、材料与来源：F007、F008、F037、F038、F040；M002、M027、M030；SRC-010、SRC-018、SRC-021。仅工程认证可引用协会试行监督仲裁规定的“学校/书面/时限”，启用 30 日门槛前核 2020 试行规则是否仍现行；其他评估单独查本批制度；核验与结果：事实一致 PASS_FACT（请求材料）；过期是否受理、异议是否成立均 NEEDS_HUMAN_DECISION；规则失效/未知 POLICY_UNCONFIRMED。下一：学校有权申诉人、外部监事会/对应复核机关。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r038",
          "title": "学位授予资格只读引用的独立权力·B/F",
          "requirement": "原文规则编号与阶段：R038 学位授予资格只读引用的独立权力·B/F。触发/例外条件：真：申报学科材料引用某博士/硕士学位授权既有结果；假：无该授权主张 NA；未知：申报进度/资格真假不明；关联字段、材料与来源：F009–F014、F027、F038；M008、M019、M032；SRC-008、SRC-014。逐文号、授权专业/学位点类别、决定日期比对国务院学位委员会正式结果；新闻“团队申报”仅历史背景；核验与结果：正式授权结果被正确引用 PASS_FACT（存在性）；仅自述获批/仅申报新闻 SOURCE_UNAVAILABLE；授权变更争议 NEEDS_HUMAN_DECISION。下一：学位管理归口与国务院学位委员会；绝不在本 ID 授予资格。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-039-043",
      "name": "第四轮补全：本科专业设置上位专属程序",
      "description": "来源章节：第四轮补全：本科专业设置上位专属程序；保留原文规则编号、触发条件、证据来源和结果码。",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "r039",
          "title": "新设专业预申报可追溯性·B",
          "requirement": "原文规则编号与阶段：R039 新设专业预申报可追溯性·B。触发/例外条件：真：拟增设普通本科专业且不属 SRC-024 明确排除的中外合作办学、第二学士学位等；假：非新设/明确排除则 NA；未知：当批是否有特殊豁免或路径不明；关联字段、材料与来源：F001/002/009–013/043；M001/003/009/033；SRC-024 第四项、SRC-013（仅 2025 例）、SRC-025。匹配学校规划条目、预报年度、专业代码、预申报回执及正式申报链；不得将“原则上提前一年”当绝对门槛；核验与结果：预报记录真实一致 PASS_FACT；缺校级来源 SOURCE_UNAVAILABLE；当批豁免不明 POLICY_UNCONFIRMED，是否批准例外 NEEDS_HUMAN_DECISION；下一：教务专业建设归口。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r040",
          "title": "拟设专业校级审议记录与提交版匹配·E",
          "requirement": "原文规则编号与阶段：R040 拟设专业校级审议记录与提交版匹配·E。触发/例外条件：真：拟新增专业进入正式校内审议或准备对外提交；假：仅 B/C 草稿、学科评估/认证 NA；未知：审议尚未举行还是记录无权取证；关联字段、材料与来源：F029/030/035/044；M004/009/025；SRC-024 第五项。核学校党委会或校长办公会之一的真实会议记录与拟新设对象、申请书/论证报告哈希，审议结论只由有权会议签发；不推导学院办公会已满足上位条件；核验与结果：权威记录及版本确证 PASS_FACT（程序存在）；E 阶段机关尚未签发 NEEDS_HUMAN_DECISION，源失联 SOURCE_UNAVAILABLE，H1/H2 不符 CONFLICT；下一：学校原会议/签发机关。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "r041",
          "title": "拟新设专业官网公示及最低时长·E",
          "requirement": "原文规则编号与阶段：R041 拟新设专业官网公示及最低时长·E。触发/例外条件：真：拟新设专业已到官网公示环节，或自称完成可对外申报；假：尚在 B/C 草稿或非新设 NA；未知：公示日期/版次无法核；关联字段、材料与来源：F010/011/029/030/045；M004/009/034；SRC-024 第五项。以学校官网可核原文查对象、拟设申请材料/论证报告、发布时间、结束时间及工作日日历，门槛不少于五工作日；第三方截图仅线索；核验与结果：同版且满时长 PASS_FACT（公示事实）；实际仅3日却申报声明5日→CONFLICT（两份主张不一致）；已证不足但无人谎报则 NEEDS_HUMAN_DECISION 且记录短少事实，不自动批准；日期源失联 SOURCE_UNAVAILABLE。下一：教务、官网及政策核验人。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r042",
          "title": "专业撤销校内征询与公示事实·C/E",
          "requirement": "原文规则编号与阶段：R042 专业撤销校内征询与公示事实·C/E。触发/例外条件：真：SCN-BK-SET/C 且子型为撤销并进入校内征求意见/公示阶段；假：新设/更名/停招或未到此阶段 NA；未知：撤销与停招混称；关联字段、材料与来源：F013/014/029/030/046；M003/009/035；SRC-024 第八项。核校内征求意见与官网公示记录对应同一原专业及版本，不得套 R041 的五工作日门槛；核验与结果：有可信程序原件 PASS_FACT（存在性）；意见冲突 CONFLICT、无法取得机关公示 SOURCE_UNAVAILABLE；异议如何处置 NEEDS_HUMAN_DECISION。下一：学校教务/原征询组织者。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r043",
          "title": "暂停增设适用状态核对·B/E",
          "requirement": "原文规则编号与阶段：R043 暂停增设适用状态核对·B/E。触发/例外条件：真：拟新增专业且需对照上位办学条件限制；假：非增设专业 NA；未知：学校最近正式评估/整改与条件状态不可得；关联字段、材料与来源：F002/005/009/047；M001/003/036；SRC-024 第十一项。只引用有权机关出具的本科教学合格评估不通过/暂缓通过、基础条件不达标及其整改解除时间，对动作时点做一致性核查；核验与结果：有权记录证明不存在所述限制时 PASS_FACT（状态核查）；出现已证实限制则输出 NEEDS_HUMAN_DECISION 由归口依法处理，冲突 CONFLICT、源失联 SOURCE_UNAVAILABLE；下一：学校质量保障/主管教育机关，不由 AI 作增设批准或处罚。政策/权限/来源现行性未核实、证据不可访问、版本不匹配或结论涉及有权机关时，必须标记待确认并转人工复核；本项仅为本地事实预审，不得自动形成学校正式通过或拒绝。",
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
      "name": "A 事项与批次识别",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "fact-review",
      "workflowOwner": "local"
    },
    {
      "id": "fact-review",
      "name": "B/C 事实与材料核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "policy-review",
      "returnToStageId": "intake",
      "workflowOwner": "local"
    },
    {
      "id": "policy-review",
      "name": "D–G 权责、后继决定及异议事实核验",
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
  "templateId": "T05-T06",
  "name": "专业、学科建设及评估申报材料审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T05-T06.md",
  "sourceDocumentSha256": "40e9ce072f5d413e6928951455463b7fa4172669643fc1f3b881fb3413cb0675",
  "sourceOriginalBlobSha1": "cbab0a228db7d27004a2dab2ad2299359abea189",
  "sourceManifestBytes": 172727,
  "sourceManifestSha256": "40e9ce072f5d413e6928951455463b7fa4172669643fc1f3b881fb3413cb0675",
  "sourceDocumentBytes": 172727,
  "sourceDisplayedBytes": 172726,
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
    "SRC-022",
    "SRC-023",
    "SRC-024",
    "SRC-025"
  ],
  "criteria": [
    {
      "sectionId": "rules-001-015",
      "criterionId": "r001",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-013",
        "SRC-017",
        "SRC-020",
        "SRC-022"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-015",
      "criterionId": "r002",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-015",
      "criterionId": "r003",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-015",
      "criterionId": "r004",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-015",
      "criterionId": "r005",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-011",
        "SRC-013",
        "SRC-014",
        "SRC-022"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-015",
      "criterionId": "r006",
      "sourceIds": [
        "SRC-001",
        "SRC-007",
        "SRC-011",
        "SRC-013",
        "SRC-017"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-015",
      "criterionId": "r007",
      "sourceIds": [
        "SRC-010",
        "SRC-016",
        "SRC-018",
        "SRC-019",
        "SRC-020"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-015",
      "criterionId": "r008",
      "sourceIds": [
        "SRC-006",
        "SRC-010",
        "SRC-016",
        "SRC-019"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-015",
      "criterionId": "r009",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-015",
      "criterionId": "r010",
      "sourceIds": [
        "SRC-006",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-015",
      "criterionId": "r011",
      "sourceIds": [
        "SRC-006",
        "SRC-008",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-015",
      "criterionId": "r012",
      "sourceIds": [
        "SRC-003",
        "SRC-005",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-015",
      "criterionId": "r013",
      "sourceIds": [
        "SRC-003",
        "SRC-005",
        "SRC-015",
        "SRC-023"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-015",
      "criterionId": "r014",
      "sourceIds": [
        "SRC-003",
        "SRC-017",
        "SRC-018",
        "SRC-024"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-001-015",
      "criterionId": "r015",
      "sourceIds": [
        "SRC-003",
        "SRC-018",
        "SRC-019",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-016-027",
      "criterionId": "r016",
      "sourceIds": [
        "SRC-001",
        "SRC-013",
        "SRC-024",
        "SRC-025"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-016-027",
      "criterionId": "r017",
      "sourceIds": [
        "SRC-016",
        "SRC-017",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-016-027",
      "criterionId": "r018",
      "sourceIds": [
        "SRC-017",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-016-027",
      "criterionId": "r019",
      "sourceIds": [
        "SRC-017",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-016-027",
      "criterionId": "r020",
      "sourceIds": [
        "SRC-005",
        "SRC-015",
        "SRC-016",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-016-027",
      "criterionId": "r021",
      "sourceIds": [
        "SRC-018",
        "SRC-019",
        "SRC-020"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-016-027",
      "criterionId": "r022",
      "sourceIds": [
        "SRC-019",
        "SRC-020"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-016-027",
      "criterionId": "r023",
      "sourceIds": [
        "SRC-018",
        "SRC-019",
        "SRC-020"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-016-027",
      "criterionId": "r024",
      "sourceIds": [
        "SRC-018",
        "SRC-019",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-016-027",
      "criterionId": "r025",
      "sourceIds": [
        "SRC-002",
        "SRC-008",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-016-027",
      "criterionId": "r026",
      "sourceIds": [
        "SRC-002",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-016-027",
      "criterionId": "r027",
      "sourceIds": [
        "SRC-002",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-028-038",
      "criterionId": "r028",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-028-038",
      "criterionId": "r029",
      "sourceIds": [
        "SRC-003",
        "SRC-005",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-028-038",
      "criterionId": "r030",
      "sourceIds": [
        "SRC-003",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-028-038",
      "criterionId": "r031",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-024"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-028-038",
      "criterionId": "r032",
      "sourceIds": [
        "SRC-017",
        "SRC-020"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-028-038",
      "criterionId": "r033",
      "sourceIds": [
        "SRC-010",
        "SRC-017",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-028-038",
      "criterionId": "r034",
      "sourceIds": [
        "SRC-010",
        "SRC-014",
        "SRC-018",
        "SRC-021",
        "SRC-022"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-028-038",
      "criterionId": "r035",
      "sourceIds": [
        "SRC-005",
        "SRC-006",
        "SRC-018",
        "SRC-024"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-028-038",
      "criterionId": "r036",
      "sourceIds": [
        "SRC-011",
        "SRC-017",
        "SRC-018"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-028-038",
      "criterionId": "r037",
      "sourceIds": [
        "SRC-010",
        "SRC-018",
        "SRC-021"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-028-038",
      "criterionId": "r038",
      "sourceIds": [
        "SRC-008",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-039-043",
      "criterionId": "r039",
      "sourceIds": [
        "SRC-013",
        "SRC-024",
        "SRC-025"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-039-043",
      "criterionId": "r040",
      "sourceIds": [
        "SRC-024"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-039-043",
      "criterionId": "r041",
      "sourceIds": [
        "SRC-024"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-039-043",
      "criterionId": "r042",
      "sourceIds": [
        "SRC-024"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    },
    {
      "sectionId": "rules-039-043",
      "criterionId": "r043",
      "sourceIds": [
        "SRC-024"
      ],
      "evidenceStatus": "PARTIAL",
      "evidenceNote": "SRC IDs are research-source references, not case material SourceRef; this evidence status does not create a PolicyVersion or confer school authority."
    }
  ]
} as const
