import type { TemplateVersion } from '@profer/shared'

/** Local R02 research implementation. Not an official CDUT template. */
export const templateVersion: TemplateVersion = {
  "templateId": "T07-T01",
  "version": 1,
  "schemaVersion": 2,
  "name": "部门公文、请示、决议与发文核稿审批",
  "description": "本地研究模板 · 非校方正式模板。部门公文、请示、决议与发文核稿审批的事实预审、证据缺口识别和人工复核辅助；政策证据状态为 PARTIAL，校方最终签发/批准/用印/上线等决定必须由真实有权人员在权威流程中完成。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 源研究稿为非成都理工大学官方模板；源文件 docs/design/review-agent/business-templates/R02/T07-T01.md，SHA-256 5f07eca65a4d556874b76345e304a42f667bdf627bbfb43ad9aa08a136f1978b。研究来源与学校现行授权并不等同；未经核实的政策与权限必须人工复核。",
  "objectType": "document",
  "displayName": {
    "template": "T07-T01 · {{f001}}"
  },
  "fields": [
    {
      "key": "f001",
      "label": "001 · 案卷号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F001；源定义：string 案卷号／Case；A 建案后；可信案件后台生成；M005:caseId，非申报人填报；P1；无案卷号阻止内部关联并报 H；不造校级 OA 编号。"
    },
    {
      "key": "f002",
      "label": "002 · 学校 OA/来文流程引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F002；源定义：string? 学校 OA/来文流程引用／OfficeFlow；B—F 有真实流转时；真实 OA 或经核验纸质收文号；M005:流程记录；P1；A 时 NA；声称已流转而源失联 S；不得自编。"
    },
    {
      "key": "f003",
      "label": "003 · 实际经办可信 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F003；源定义：string 实际经办可信 ID／Actor；A、X；经授权统一身份认证/任职事实；M004:身份回执；P2；不能确认 H；与署名不符 C；不凭 Renderer。"
    },
    {
      "key": "f004",
      "label": "004 · 主办单位权威标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F004；源定义：string 主办单位权威标识／Unit；A—F；学校组织/人员任职权威信息；M004:所属单位；P1/P2；不能确认 H；与拟发单位不符 C。"
    },
    {
      "key": "f005",
      "label": "005 · 代理/委托授权范围及有效期",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F005；源定义：object? 代理/委托授权范围及有效期／Delegation；A 或 X 代办时；校方授权凭据或纸质待人工核；M004:授权页；P2；非代办 NA；代办无有效授权 H，禁止自称领导。"
    },
    {
      "key": "f006",
      "label": "006 · 拟发文名义",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F006；源定义：string 拟发文名义／DocumentDraftVersion；A；文稿落款/版头 M001:首页及署名；与组织权威表核对；P1；当前缺 N；机构标识冲突 C；能否用此名义发文 P/H。"
    },
    {
      "key": "f007",
      "label": "007 · 文种（请示/报告/决议/通知等）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F007；源定义：enum 文种（请示/报告/决议/通知等）／Document；A；M001:标题/正文/落款，作者申报并经核稿；P1；缺或混用 N/C；自动仅提示文种疑点。"
    },
    {
      "key": "f008",
      "label": "008 · 办理子型 H01—H08",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F008；源定义：enum 办理子型 H01—H08／Case；A、X；主办方用途与稿件内容 M001:办理目的；P1；无法路由 H；交叉情形可复合标记，仍同一 ID。"
    },
    {
      "key": "f009",
      "label": "009 · 主送/抄送对象",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F009；源定义：list<org> 主送/抄送对象／Document；A；M001:主送/抄送栏；组织名仅作可核对文本；P1；当前适用但缺 N；是否有权发给该对象 H。"
    },
    {
      "key": "f010",
      "label": "010 · 文稿标题/事项摘要",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F010；源定义：string 文稿标题/事项摘要／Document；A；M001:标题行；P1；缺 N、无法识别 U；与申请目的矛盾 C。"
    },
    {
      "key": "f011",
      "label": "011 · 当前草稿指纹与版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F011；源定义：hash+version 当前草稿指纹与版本／DocumentDraftVersion；A，X 变更后；本案保存文件时计算，M001:文件指纹/版本链；P1；无法固定版本 H；替换必须使依赖旧版结论待重审。"
    },
    {
      "key": "f012",
      "label": "012 · 草稿形成/提交时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F012；源定义：dateTime? 草稿形成/提交时间／DocumentDraftVersion；A；文件可验证创建/受理信息 M001:来源属性，来源自报不作签批时间；P1；无可信时间可记未知，不独立判失败；仅当办理期限依赖它时 H；不要据操作系统时间冒充成文日期。"
    },
    {
      "key": "f013",
      "label": "013 · 法规/校本依据引用",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F013；源定义：list<ref> 法规/校本依据引用／Basis；A，有引用时；M002:依据目录及原文定位，可信来源见 SRC；P1；未引用且不要求时 NA；引用却无可核原文 N/S/P。"
    },
    {
      "key": "f014",
      "label": "014 · 附件清单及版本",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F014；源定义：list<attachmentRef> 附件清单及版本／Document；A，有附件时；M003:附件说明/真实附件；P1—P2；声称有但未交 N，页不可读 U，不要求不存在附件。"
    },
    {
      "key": "f015",
      "label": "015 · 关键事实主张及证据映射",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F015；源定义：list<claim↔evidence> 关键事实主张及证据映射／Claim；A 或补件后；M002:主张对应原始出处/页，正文仍为待核陈述；P1—P2；缺证 N；证据相反 C；不得以模型确信度代证。"
    },
    {
      "key": "f016",
      "label": "016 · 涉密/受限风险状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F016；源定义：enum 涉密/受限风险状态／SecurityGate；A0；学校许可的安全筛查回执 M014:风险状态（无需正文入系统）；P3；未知即 H 并先止普通上传；不可将空当无密。"
    },
    {
      "key": "f017",
      "label": "017 · 有权定密/解密决定引用",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F017；源定义：object? 有权定密/解密决定引用／Classification；A0 后如需；有权定密责任人/合规系统 M014:决定回执；P3；不涉密 NA；疑似涉密且无决定 H；来源失联 S，禁止非涉密上传。"
    },
    {
      "key": "f018",
      "label": "018 · 会议类别/议事主体",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F018；源定义：enum? 会议类别/议事主体／MeetingProposal；A，H04；申报议题 M006:会议类别，与 SRC-003 类别核对；P1；非 H04 NA；H04 无法判定需 N/P。"
    },
    {
      "key": "f019",
      "label": "019 · 会议议题/会前报送引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F019；源定义：string? 会议议题/会前报送引用／MeetingProposal；A—C，H04；M006:议题表/报送登记，已受理则读会议系统；P1；会前初稿可尚无受理号；声称已受理无证 S/H。"
    },
    {
      "key": "f020",
      "label": "020 · 上游或早前有效决定 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F020；源定义：decisionRef? 上游或早前有效决定 ID／ExternalDecision；A 有“已批准”主张时；原有权机关/相邻业务 Owner，M007:正式记录；P1—P2；未主张已有批复 NA；声称已有却缺 N/S；与对象不符 C。"
    },
    {
      "key": "f021",
      "label": "021 · 涉及/联署单位及职责范围",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F021；源定义：list<unit> 涉及/联署单位及职责范围／Consultation；A，H05；M008:主办方列明的会办单位和职能依据；P1；H05 未列 N；单位是否有权联合 H/P。"
    },
    {
      "key": "f022",
      "label": "022 · 协商状态（未开始/进行/一致/分歧）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F022；源定义：enum 协商状态（未开始/进行/一致/分歧）／Consultation；B，H05；真正会签状态 M008:流转意见，非前端标签；P1；A 时未开始为正常；B 后源失联 S，分歧 C/H。"
    },
    {
      "key": "f023",
      "label": "023 · 会签意见、不同意见处理记录",
      "kind": "multi",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F023；源定义：list<eventRef> 会签意见、不同意见处理记录／Consultation；B—C，H05；相关部门签批事件 M008:会签正文/时间/单位；P1—P2；尚未发生 NA；声称会签完成却无有效记录 N/S。"
    },
    {
      "key": "f024",
      "label": "024 · 主办部门审核",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F024；源定义：eventRef? 主办部门审核／DepartmentReview；B 后；部门授权系统/人工原件 M009:签署意见/时间；P2；A 时 NA；已声称部门审核却无法核身份 H/S。"
    },
    {
      "key": "f025",
      "label": "025 · 法治/合规审查",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F025；源定义：eventRef? 法治/合规审查／LegalReview；C，条件触发；校法治办公室或法定业务机构记录 M010:审查结论；P2；未确定适用 P/H；未触发 NA；声称已通过无来源 S。"
    },
    {
      "key": "f026",
      "label": "026 · 校党政办公室核稿/送签",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F026；源定义：eventRef? 校党政办公室核稿/送签／OfficeReview；C 后，校级发文；归口秘书部门可信 OA/纸面记录 M011:核稿事件；P2；非校级待判 P；未走到 C 为 NA；已走完而不见记录 S/H。"
    },
    {
      "key": "f027",
      "label": "027 · 会议表决/审议/审定事实",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F027；源定义：decisionRef? 会议表决/审议/审定事实／MeetingDecision；D，H04；真实会议记录、正式纪要 M012:议题/结论；P2—P3；会前 NA；“审议”不能自动标成“审定”，缺证 S/H。"
    },
    {
      "key": "f028",
      "label": "028 · 文件签发事件与适用稿本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F028；源定义：eventRef? 文件签发事件与适用稿本／SignatureEvent；D 后；签发系统/原签批纸面 M013:签发记录及稿本版本；P2；D 前 NA；签发旧版本不覆盖新稿，C/H。"
    },
    {
      "key": "f029",
      "label": "029 · 签发人可信身份及授权范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F029；源定义：string? 签发人可信身份及授权范围／SignatureEvent；D 后；学校任职/授权记录与 M013 签批主体联合核验；P2；OCR 人名不足以认权；缺授权 H/P。"
    },
    {
      "key": "f030",
      "label": "030 · 签批完整日期/事件时间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F030；源定义：dateTime? 签批完整日期/事件时间／SignatureEvent；D 后；M013:签发时间/签章记录；P2；未签 NA；缺可信日期 N/H；不得用上传时间代替。"
    },
    {
      "key": "f031",
      "label": "031 · 正式发文字号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F031；源定义：string? 正式发文字号／IssueRegister；E；学校/有权部门正式发文登记 M015:文号栏；P1；E 前 NA；自填暂定文号不通过权威事实审查。"
    },
    {
      "key": "f032",
      "label": "032 · 最终核发稿本指纹",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F032；源定义：hash+version? 最终核发稿本指纹／IssueRegister；E；M015:核发版本 与签批稿本对应；P1；未到 E 为 NA；签后改稿且未复审 C/H。"
    },
    {
      "key": "f033",
      "label": "033 · 用印/电子章事件及权限",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F033；源定义：eventRef? 用印/电子章事件及权限／SealEvent；E，确需用印时；机要科或校方授权用印系统 M016:批准及实际用印；P2；不要求盖章时 NA；所需用印未知 P；伪造/不一致 C/H。"
    },
    {
      "key": "f034",
      "label": "034 · 送印、核发、分发/送达记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F034；源定义：eventRef? 送印、核发、分发/送达记录／DeliveryEvent；E 后；校方实际核发/签收记录 M017:分送范围及时间；P1—P2；E 前 NA；已声称发布却来源失联 S。"
    },
    {
      "key": "f035",
      "label": "035 · 档案归集、移交或归档登记",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F035；源定义：eventRef? 档案归集、移交或归档登记／ArchiveEvent；F；档案馆/主办单位合规归档 M018:归档索引；P1—P2；F 前 NA；2018 规范现行性未知时 P。"
    },
    {
      "key": "f036",
      "label": "036 · 补件/退修/撤稿/撤销/复核类型",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F036；源定义：enum? 补件/退修/撤稿/撤销/复核类型／ChangeRequest；X；原案有权发起人的要求 M019:请求类型；P1；无 X 时 NA；已发文不得把撤销误标普通撤稿。"
    },
    {
      "key": "f037",
      "label": "037 · 变更所针对的原稿版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F037；源定义：hash+caseRef? 变更所针对的原稿版本／ChangeRequest；X；本案版本链 M019:原稿ID/目标版本；P1；找不到原版 H，禁止覆盖旧案证据。"
    },
    {
      "key": "f038",
      "label": "038 · 有权撤销/废止/重新签发决定",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F038；源定义：eventRef? 有权撤销/废止/重新签发决定／FormalDisposition；X，已发文时；原发文/上级有权机关正式记录 M019:撤销或废止决定；P2；普通撤稿 NA；已宣称撤销无来源 S/H。"
    },
    {
      "key": "f039",
      "label": "039 · 事实异议及复核处理结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F039；源定义：eventRef? 事实异议及复核处理结果／ReviewObjection；X；有权复核方记录 M019:异议、答复、日期；P2；无复核 NA；申报人单方意见不等于复核通过。"
    },
    {
      "key": "f040",
      "label": "040 · 上游决定状态/有效区间/撤回标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F040；源定义：enum+period 上游决定状态/有效区间/撤回标识／ExternalDecision；A—F，引用 F020 时；原业务 Owner/上级机关 M007:决定状态/适用对象/生效或撤销记录；P1—P2；无引用 NA；失联 S；已撤销/过期冲突 C/H。"
    },
    {
      "key": "f041",
      "label": "041 · 上级来文/交办指令及承接事项",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F041；源定义：ref? 上级来文/交办指令及承接事项／IncomingInstruction；A，H02声称承接来文时；校内机要/收文可信登记或上级真实原件 M020:来文号/发文机关/要求事项；P1—P3；无来文主张 NA；声称有而无凭证 N，收文源断联 S；涉密先 A0。"
    },
    {
      "key": "f042",
      "label": "042 · 来文载明截止节点及适用对象",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F042；源定义：dateTime?+sourceRef 来文载明截止节点及适用对象／IncomingInstruction；A—E，F041 有明确期限时；M020:明确截止语句/页/原发文机构 与实际受理/答复事件；P1—P2；来文未设期限 NA；有期限但字段不可读 U；政策时限来源不明 P，绝不自拟统一天数。"
    },
    {
      "key": "f043",
      "label": "043 · 本次请示/报告送报与受理事件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F043；源定义：ref+state+version+time? 本次请示/报告送报与受理事件／OutgoingSubmission；B—D，已实际提交或声称送达时；M021:本次出站登记、受文机关签收/受理回执、办理流水；只采信合法取回的 T0 或核验 T1；P1—P2；尚在草稿 A 则 NA；声称送达而无回执 N；权威受理源断联 S；受文机关/稿本不符 C；流程权限不明 P/H。"
    },
    {
      "key": "f044",
      "label": "044 · 本次请示后形成的有权答复/批示及适用原请示",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "研究字段 F044；源定义：decisionRef+status+scope+time? 本次请示后形成的有权答复/批示及适用原请示／IncomingReply；D 后确有答复或声称已答复时；M022:上级/校内有权方的正式回复、批示、批复或退办事件，对照 F043 和原请示版本；待决定状态可为 pending；P2—P3；未到答复阶段 NA；有回执不等于答复；声称批准无可信原件 N/S；答复拒绝/部分同意不可改写为全面同意 C；效力交有权方 H。"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "001 · 主文稿",
      "purpose": "来源研究材料槽 M001。M001 主文稿：证明何文、何事项、拟由谁发往何处；持有人为主办单位；可读 DOCX/PDF/经许可的草稿文件；在案的原稿及标题、主送、拟发主体、正文、落款；A C，H07 禁止普通系统正文上传；合法替代为本校授权公文系统只读文稿或校内人工当面核稿，不接受口述替代全文；F006—F012；SRC-001、002、005；每次上传唯一指纹/版本、主办单位归属；缺 N，损坏 U；新版不继承旧版核稿/签发。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M001 主文稿：证明何文、何事项、拟由谁发往何处",
        "持有人为主办单位",
        "可读 DOCX/PDF/经许可的草稿文件",
        "在案的原稿及标题、主送、拟发主体、正文、落款"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "002 · 事实与依据",
      "purpose": "来源研究材料槽 M002。M002 事实与依据：证实文稿中的具体事实/政策引用；持有人为主办部门或外部权威机关；上位通知、当期校本规章、统计原始资料及“主张→页/段/数据”的对照索引；A Q（文中引用、事实被用作理由时）；权威系统可读记录、正式公开来源或经校方认可的原件为合法替代；F013、F015；SRC-001、005，具体依据要附各自 SRC；每条主张绑定文稿版本及原件版本；缺 N、不可读 U、网页失联 S、依据时效 P、内容反证 C。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M002 事实与依据：证实文稿中的具体事实/政策引用",
        "持有人为主办部门或外部权威机关",
        "上位通知、当期校本规章、统计原始资料及“主张→页/段/数据”的对照索引",
        "A Q（文中引用、事实被用作理由时）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "003 · 附件及清单",
      "purpose": "来源研究材料槽 M003。M003 附件及清单：证明正文声明的附件实际存在且匹配；持有人为起草单位；附件目录、文件/图表、原始证明；只接受相应来源的合法内容；A Q（正文列附件或审核事实依赖附件）；校方权威业务系统原附件可只读替代，不重复上传；F014；SRC-005 第 9、20 条参照；每附件独立 ID/版本、文件名与正文引用位置；缺 N、损坏 U、混入他案 C。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M003 附件及清单：证明正文声明的附件实际存在且匹配",
        "持有人为起草单位",
        "附件目录、文件/图表、原始证明",
        "只接受相应来源的合法内容"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "004 · 申请人、所属部门和代办授权",
      "purpose": "来源研究材料槽 M004。M004 申请人、所属部门和代办授权：证明代表哪个单位申报；持有学校认证/组织/授权部门；可信认证及任职/部门关系记录；代理时有期限/事项范围的授权记录；A C，优先从校方可信系统取，不要求反复上传证件；无接口时仅由学校权责人员人工核身份/授权；F003—F005；SRC-001、002；绑定提交事件与有效期；匹配失败 C，来源失联 S，代理权不明 H；不得把 OCR 签名升格为授权。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M004 申请人、所属部门和代办授权：证明代表哪个单位申报",
        "持有学校认证/组织/授权部门",
        "可信认证及任职/部门关系记录",
        "代理时有期限/事项范围的授权记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "005 · 案卷及 OA 流程引用",
      "purpose": "来源研究材料槽 M005。M005 案卷及 OA 流程引用：证明何时提交与真实流转；持有案件后台/校方 OA；受理事件、案卷 ID、真实 OA 流程/纸面收文登记；A 建案后及 B—F L/C；系统自行产生/授权读取，不得要求初次提交前已有受理流水；F001、F002；SRC-002；绑定本案和操作版本；已声称提交但找不到流程 S/H；不能把客户端伪造的 run 字符串作行政流水。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M005 案卷及 OA 流程引用：证明何时提交与真实流转",
        "持有案件后台/校方 OA",
        "受理事件、案卷 ID、真实 OA 流程/纸面收文登记",
        "A 建案后及 B—F L/C"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "006 · 会议议题及会前材料",
      "purpose": "来源研究材料槽 M006。M006 会议议题及会前材料：证明进入哪类议事程序；持有议题主办单位/会议组织者；会议议题申请、议程草案、会前已存在的支持材料、真实议题报送登记；H04 A Q（需要会议议事时）；会议组织系统或其受理凭证可替代；不得前置要会后纪要；F018、F019；SRC-003 第 4—6、9 条；对应会议类别/拟审事项；未受理的议题号 NA，声称已报送却缺来源 S/H，错议题 C。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M006 会议议题及会前材料：证明进入哪类议事程序",
        "持有议题主办单位/会议组织者",
        "会议议题申请、议程草案、会前已存在的支持材料、真实议题报送登记",
        "H04 A Q（需要会议议事时）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "007 · 先前上级/相邻业务决定",
      "purpose": "来源研究材料槽 M007。M007 先前上级/相邻业务决定：证明“已批准”等主张；持有原业务 Owner、上级机关；正式批复、有效会议决议、权威审批事件及当前状态/适用区间；A Q：仅当文稿声称此前已批准、需援引上游结论；若本次请示尚待批准则当前 NA；可授权只读替代上传；F020、F040；SRC-001、004、005，及待核 SRC-010—012；以决定 ID+原业务对象+版本/有效期绑定；失联 S、未获决定不伪造、对象或状态矛盾 C。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M007 先前上级/相邻业务决定：证明“已批准”等主张",
        "持有原业务 Owner、上级机关",
        "正式批复、有效会议决议、权威审批事件及当前状态/适用区间",
        "A Q：仅当文稿声称此前已批准、需援引上游结论"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "008 · 协商及联合行文证据",
      "purpose": "来源研究材料槽 M008。M008 协商及联合行文证据：证明涉及单位与真实意见；持有主办和会办单位各自；A 时职权/会办单位清单；B 后各单位原始会签、分歧意见与协调记录；H05 A 职责清单 Q，B—C 会签结果 L（届时条件必需）；可从校方会签流转系统取；未经认证群聊不等价正式会签；F021—F023；SRC-001、005 第 17、19、22 条参照；每意见绑定单位、签批人、版本、时间；已声称会签但缺 N/S，意见冲突 C/H。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M008 协商及联合行文证据：证明涉及单位与真实意见",
        "持有主办和会办单位各自",
        "A 时职权/会办单位清单",
        "B 后各单位原始会签、分歧意见与协调记录"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "009 · 部门审核",
      "purpose": "来源研究材料槽 M009。M009 部门审核：证明部门已实际核稿；持有主办单位及其主管；部门审核事件/真实审批单/经核验纸质意见；B L；进入 C 且学校规则要求部门审签时才 Q；校内 OA 可取则不要求扫描件；F024；SRC-001、002，具体顺序待校本证；绑定签批人有效角色与稿本；无授权 H，已完成但记录不可读 U/来源失联 S。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M009 部门审核：证明部门已实际核稿",
        "持有主办单位及其主管",
        "部门审核事件/真实审批单/经核验纸质意见",
        "B L"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "010 · 法治/合规审查",
      "purpose": "来源研究材料槽 M010。M010 法治/合规审查：证明在有要求时完成合法性审查；持有法治工作办公室或特定归口；有权审查意见及结论，非经办人自写“法务已过”；C L/Q（规范性文件/重大涉法等经适用规则或有权方确认触发）；经授权读原审查记录为替代；F025；SRC-001，具体触发阈值未证；关联文稿具体版本与所审法问题；是否触发未知 P/H，不一律判缺。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M010 法治/合规审查：证明在有要求时完成合法性审查",
        "持有法治工作办公室或特定归口",
        "有权审查意见及结论，非经办人自写“法务已过”",
        "C L/Q（规范性文件/重大涉法等经适用规则或有权方确认触发）"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "011 · 校党政办公室核稿/送签",
      "purpose": "来源研究材料槽 M011。M011 校党政办公室核稿/送签：证明校级文稿经过归口审查；持有秘书一/二科；校党政办公室正式核稿、退修和送签事件；校级 H01/H03/H04/H05 进入 C 后 L/Q；从原 OA 取或人工查原件，不能用截图冒认；F026；SRC-001；逐次核稿绑定稿本指纹；A 缺失 NA，声称“核稿通过”但主体不明 H/C。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M011 校党政办公室核稿/送签：证明校级文稿经过归口审查",
        "持有秘书一/二科",
        "校党政办公室正式核稿、退修和送签事件",
        "校级 H01/H03/H04/H05 进入 C 后 L/Q"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "012 · 会议记录/有权议事决定",
      "purpose": "来源研究材料槽 M012。M012 会议记录/有权议事决定：证明会后实际结论；持有有权会议组织机构；正式纪要、会议决定原文及适用议题，不把会议计划当结论；H04 在 D 后 L/Q；可信会议系统、经核验的正式纪要为替代；F027；SRC-003、004；绑定会议届次、议题与措辞；“审议”不自动变“审定”；会前不缺，已声称通过却无来源 S/H。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M012 会议记录/有权议事决定：证明会后实际结论",
        "持有有权会议组织机构",
        "正式纪要、会议决定原文及适用议题，不把会议计划当结论",
        "H04 在 D 后 L/Q"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "013 · 发文签批记录",
      "purpose": "来源研究材料槽 M013。M013 发文签批记录：证明谁对哪版稿件何时签发；持有有权负责人及秘书机构；权威签发意见、姓名、完整日期、适用稿本的 OA/纸面签发事件；D 后 L/Q；授权系统可读或签发原件人工核验；不是首次申请所需；F028—F030；SRC-001、005 第 22 条参照；若签发绑定旧稿而当前为新稿，旧签批不可沿用；不一致 C/H、仅 OCR 签名 H。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M013 发文签批记录：证明谁对哪版稿件何时签发",
        "持有有权负责人及秘书机构",
        "权威签发意见、姓名、完整日期、适用稿本的 OA/纸面签发事件",
        "D 后 L/Q"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "014 · 上传前安全状态/定密决定",
      "purpose": "来源研究材料槽 M014。M014 上传前安全状态/定密决定：防止涉密资料误入；持有保密工作办公室及有权定密责任人；最小合规风险回执；需定密时由有权渠道保留原决定，普通系统不持全文；A0 C（只要导入材料需安全准入）；疑似涉密时决定在保密系统 Q，不得上传原密级全文做替代；F016、F017；SRC-001、006；仅安全许可范围内保存可引用状态；无决定 H 且停止普通导入，失联 S，不当作“无密”。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M014 上传前安全状态/定密决定：防止涉密资料误入",
        "持有保密工作办公室及有权定密责任人",
        "最小合规风险回执",
        "需定密时由有权渠道保留原决定，普通系统不持全文"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "015 · 签后正式发文登记/最终稿",
      "purpose": "来源研究材料槽 M015。M015 签后正式发文登记/最终稿：证明文号和核发稿本；持有学校或有权部门发文登记机构；正式发文字号、签后复核、最终定稿文件及版本指纹；E L/Q（此后适用），绝不在 A 阶段要求；授权原发文系统可替代经办人上传；F031、F032；SRC-001、005 第 25 条参照，SRC-009 待证；绑定签发稿与核发稿；擅改正文 C/H，缺文号不代表初稿不合格。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M015 签后正式发文登记/最终稿：证明文号和核发稿本",
        "持有学校或有权部门发文登记机构",
        "正式发文字号、签后复核、最终定稿文件及版本指纹",
        "E L/Q（此后适用），绝不在 A 阶段要求"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "016 · 印章/电子签章记录",
      "purpose": "来源研究材料槽 M016。M016 印章/电子签章记录：证明有权实际用印；持有校党政办公室机要科或被授权部门；用印批准事件、印章种类、用印对象和实际签章记录；不是抽象“章图”；E L/Q（实际需用印才触发）；OA 用印记录或有权用印登记替代截图；F033；SRC-001、008（附件细则未核）；绑定文件版本、用印对象和时间；是否必用章 P，没走 E 则 NA，伪造签章 C/H。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M016 印章/电子签章记录：证明有权实际用印",
        "持有校党政办公室机要科或被授权部门",
        "用印批准事件、印章种类、用印对象和实际签章记录",
        "不是抽象“章图”"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "017 · 印制、核发、分发或送达记录",
      "purpose": "来源研究材料槽 M017。M017 印制、核发、分发或送达记录：证明文件正式送出；持有发文机构/收件机关；分送名单、核发批次、电子分发/签收事件；E 后 L/Q；发文系统的真实送达/登记数据可替代重复上传；F034；SRC-001、005 第 25—26 条参照；精确绑定正式文号和核发版本；声称已发却无证 S/H；涉密传递单独保密渠道。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M017 印制、核发、分发或送达记录：证明文件正式送出",
        "持有发文机构/收件机关",
        "分送名单、核发批次、电子分发/签收事件",
        "E 后 L/Q"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "018 · 归档/移交",
      "purpose": "来源研究材料槽 M018。M018 归档/移交：证明最终文件与档案处理；持有主办单位档案员/档案馆；归档目录、移交清单、档号与接收事件；F L/Q；档案管理系统只读引用为替代；具体期限待现行档案制度；F035；SRC-007（现行性未知）、SRC-005 参照；关联正式版本和全套办理链；过早要求 NA，无法确定保管期限 P/H。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M018 归档/移交：证明最终文件与档案处理",
        "持有主办单位档案员/档案馆",
        "归档目录、移交清单、档号与接收事件",
        "F L/Q"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "019 · 补件、变更、撤回、正式撤销/异议复核",
      "purpose": "来源研究材料槽 M019。M019 补件、变更、撤回、正式撤销/异议复核：证明变动对象与权责处理；持有原发起方和后续有权办理人；版本变更请求、补件说明、撤回申请、复核意见；已发文撤销/废止须有权决定；X Q；原案真实办理记录/有权主体结果可替代上传；若无 X 则 NA；F036—F039；SRC-005 第 21、25、33 条参照，SRC-007 待核；绑定原案及旧/新稿指纹、发生阶段和申请人；无原版本 H、旧结果残留 C，撤回申请不是已撤销的证明。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M019 补件、变更、撤回、正式撤销/异议复核：证明变动对象与权责处理",
        "持有原发起方和后续有权办理人",
        "版本变更请求、补件说明、撤回申请、复核意见",
        "已发文撤销/废止须有权决定"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "020 · 上级来文/交办及具体办理期限",
      "purpose": "来源研究材料槽 M020。M020 上级来文/交办及具体办理期限：证明回复所依据的真实指令和期限；持有上级发文机关或学校机要收文机构；正式来文原件、受理登记、真实交办事项及期限段落；涉密载体只留合规渠道许可状态；H02 A Q（确有上级来文/交办主张时）；有授权只读收文索引可代上传，非所有报告必需；F041、F042；SRC-001、005 第24条参照、SRC-002；绑定来文机关/文号/收文时间/本案与具体截止语句；缺 N、扫描不清 U、权威源失联 S；若限期未证，不据推测天数拒收。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M020 上级来文/交办及具体办理期限：证明回复所依据的真实指令和期限",
        "持有上级发文机关或学校机要收文机构",
        "正式来文原件、受理登记、真实交办事项及期限段落",
        "涉密载体只留合规渠道许可状态"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "021 · 本次请示/签报/报告实际送报与受理",
      "purpose": "来源研究材料槽 M021。M021 本次请示/签报/报告实际送报与受理：证明“稿件已送到哪个机构、对方是否受理”；持有人为校办/受文机关/业务流程持有者；可信 OA 出站事件、正式送达/收文登记、纸面受理凭据；含对象、受理阶段、提交稿本的 ID/指纹；原系统合法只读取代申请人截图；H01 或实际需要向上级报送的 H02，在 B—D 实际送报后 L/Q；A 草稿 NA；不能预设必有学校 OA API；F002、F043；SRC-001、002、005 第23—24条参照；对方签收不等于同意，原请示 v1 和送达 v2 不匹配 C；收文源失联 S，上传回执不可读 U，未发生送报不让其“已受理”。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M021 本次请示/签报/报告实际送报与受理：证明“稿件已送到哪个机构、对方是否受理”",
        "持有人为校办/受文机关/业务流程持有者",
        "可信 OA 出站事件、正式送达/收文登记、纸面受理凭据",
        "含对象、受理阶段、提交稿本的 ID/指纹"
      ],
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "022 · 对本次请示的有权后续答复",
      "purpose": "来源研究材料槽 M022。M022 对本次请示的有权后续答复：证明批复、批示、退办及其范围；持有真正的决定机关/流程持有者；有权学校机构或上级机关的批复/办理意见原始事件、正式函件或核验原件；能表示不同意、部分同意、退回和未决定；不能用申请稿或 R 的输出替代；H01 D 后真实形成答复或稿称已经批复时 L/Q；尚在请求阶段 NA；与 M007 以前已有决定明确不同；F044、F043、F020（后续确被新文件援引时）；SRC-001、005 第23—24条参照、SRC-014；绑定答复机关、权限依据、原请示 ID/版本、答复结论及范围、日期、撤销状态；源失联 S、效力未知 H/P、与引用文本不符 C；OCR“同意”非决定。。仅按源模板的办理情形和阶段触发；权威校内记录可在授权后只读核验替代上传，不要求申请人在初次提交时预交后置材料。",
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
      "maxCount": 9007199254740991,
      "requiredElements": [
        "M022 对本次请示的有权后续答复：证明批复、批示、退办及其范围",
        "持有真正的决定机关/流程持有者",
        "有权学校机构或上级机关的批复/办理意见原始事件、正式函件或核验原件",
        "能表示不同意、部分同意、退回和未决定"
      ],
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "draft-evidence",
      "name": "稿件、身份与证据入口",
      "description": "按原研究稿规则章节分组；用于本地研究预审，不构成校方审批流程或正式授权。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "A0 安全准入",
          "requirement": "源研究规则 R001。真＝校方认可可进普通系统的最小安全状态；假＝已确认应走涉密渠道；未知＝疑似涉密或未获许可。三者均需 A0 判定，不能 NA 省略。；SRC-001/006；F016,F017；M014。；只验授权状态回执/有效期间与当前导入对象，T0 或保密部门人工确认；普通系统不读密文。；真且来源有效 PASS_FACT；假/未知 NEEDS_HUMAN_DECISION 并停止导入；保密回执源失联 SOURCE_UNAVAILABLE 且仍停止；下一角色保密办/有权定密责任人。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "A/X 经办身份与单位归属",
          "requirement": "源研究规则 R002。真＝以单位名义提交；假＝非单位公文申请则不路由本模板；未知＝身份/权限待证。；SRC-001/002；F003,F004；M004。；T0 认证主体＋当前组织关系，对照 A/X 操作人、单位和委托期间；T2 自填不认权。；真且一致 PASS_FACT；可信身份相反 CONFLICT；认证源失联 SOURCE_UNAVAILABLE；资格政策不明 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；下一角色单位管理员/人事授权管理者。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "A/X 代理授权",
          "requirement": "源研究规则 R003。真＝实际经办人与应代表负责人不同且以代理名义行事；假＝本人/本单位适格直接办理；未知＝存在代办但授权方式未证。；SRC-001/002（机构与认证线索，不证明代理细则）；F003—F005；M004。；授权人、受托人、事项范围、单位、有效期及撤销状态逐项对照；T0 或人工核 T1。；假 NOT_APPLICABLE；真有效 PASS_FACT，无授权凭据 NEEDS_MATERIAL、授权不覆盖 CONFLICT；规则不明 POLICY_UNCONFIRMED 并转有权授权部门；不以 OCR 姓名替代。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "A—F 案卷/OA 流程引用",
          "requirement": "源研究规则 R004。真＝案卷已建立或声称正在学校 OA 流转；假＝尚在 A0 未建案；未知＝声称已办理但无法确认真实源。；SRC-002；F001,F002；M005。；对照 CaseAggregate 案卷 ID、真实 OA 流程/纸面登记的持有人、时间、案件版本；本案系统记录不能假充学校 OA。；真且对应 PASS_FACT；尚未建案 NOT_APPLICABLE；本地无 ID 给案件 Owner NEEDS_HUMAN_DECISION，OA 访问失败 SOURCE_UNAVAILABLE；不要求申请人先上传流水号。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "A 路由与行文名义",
          "requirement": "源研究规则 R005。真＝拟正式请示、报告、决议或发文；假＝普通协同通知、合同实质审批等其他目的；未知＝“正式公文”属性或部门发文资格不明。；SRC-001/002/005；F004,F006,F008；M001,M004。；以稿件名义/目的对学校机构职责核对；T2 可证明起草意图，是否有权用校级/部门名义必须 T0/人工。；真且用途对应 PASS_FACT（仅路由事实）；假 NOT_APPLICABLE 并转相邻事项；名义不符 CONFLICT；部门权限未证 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；下一角色主办单位/校办。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "A 文种",
          "requirement": "源研究规则 R006。真＝拟作为正式公文；假＝非正式公文协同；未知＝文种不能辨识。；SRC-001/005（上位参照）/009（格式未核）；F007,F008,F010；M001。；比较标题、主送、正文请求/报告语气及拟选文种，T2 文本可核内部一致性；是否允许特定文种由校办人工审定。；内部一致 PASS_FACT；请示/报告含义冲突 CONFLICT；文件不可读 UNREADABLE；校本强制文种标准未证 POLICY_UNCONFIRMED；假 NOT_APPLICABLE；下一角色起草人/文秘核稿人。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "A 行文对象与发文主体",
          "requirement": "源研究规则 R007。真＝文件具有收受对象/抄送及拟发主体；假＝经证实该文种无主送要求；未知＝主送要求或权限待判。；SRC-001/005；F006,F009；M001,M004。；主送、抄送、落款与正式组织名称核对；T2 只验稿内一致性，发给谁的法定权限需学校授权源。；一致 PASS_FACT；与可信单位名称矛盾 CONFLICT；当前应写而缺 NEEDS_MATERIAL；是否必须主送不明 POLICY_UNCONFIRMED；假 NOT_APPLICABLE；下一角色主办单位/校办。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "A 标题与事项事实一致",
          "requirement": "源研究规则 R008。真＝已给可读草稿；假＝H07 非涉密系统不准读稿；未知＝文稿有文件但读取异常。；SRC-001/005；F010,F015；M001,M002（有事实引用时）。；标题—正文—拟表达事项互相比对，同一草稿版本定位段落；T2 内容可作冲突提示，不代替事实决定。；一致 PASS_FACT；题文冲突 CONFLICT；当前无正文 NEEDS_MATERIAL，损坏 UNREADABLE；假停止内容检查并 NOT_APPLICABLE（案件另由 R001 阻断）；下一角色起草人。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "A/X 草稿时间、版本和指纹",
          "requirement": "源研究规则 R009。真＝当前草稿入案或发生替换；假＝H07 全文不得进普通系统；未知＝来源属性/文件版本无法确定。；SRC-002/005；F011,F012；M001。；保存时固定 hash、版本、原主办单位、替换来源；T2 自称“成文日期”不当可信签发日期，F012 非强制。；固定成功 PASS_FACT；无法固定对象版本 NEEDS_HUMAN_DECISION；源文件坏 UNREADABLE；F012 未证但不影响文本版本则留 unknown 不独立判缺；假 NOT_APPLICABLE；下一角色案卷 Owner/起草人。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "A—E 引用事实及政策依据",
          "requirement": "源研究规则 R010。真＝正文明确引用事实、数据、法规或校本制度；假＝无这类外部事实引用；未知＝存在引用但原文来源/效力未明。；SRC-001/005；F013,F015；M002；所引用政策必须补真实 SRC。；精确对照引述原文、页段、适用单位/期间、文件现行性与稿本版本；T0 权威原件优于 T2 摘录。；逐项对应 PASS_FACT；引用相反 CONFLICT，原文缺 NEEDS_MATERIAL，打不开 UNREADABLE/SOURCE_UNAVAILABLE，政策现行性不明 POLICY_UNCONFIRMED；假 NOT_APPLICABLE；下一角色主办方/政策归口。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "A—E 声称附件与实物对应",
          "requirement": "源研究规则 R011。真＝正文/目录列有附件或某主张依赖附件；假＝没有附件也无需附件；未知＝清单不清或附件损坏。；SRC-005 第9、20条参照；F014,F015；M001,M003。；附件标题、数量、页/数据、引用段落与各附件版本逐项匹配；T2 附件需可读，权威属性另核。；一致 PASS_FACT；声明但未交 NEEDS_MATERIAL，有件不可读 UNREADABLE，附件属另一案 CONFLICT；假 NOT_APPLICABLE；下一角色主办方。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "A—F 已存在的上级或邻接业务决定",
          "requirement": "源研究规则 R012。真＝稿件明确声称“此前已批准/审定”；假＝只是申请今后批准；未知＝声称有决议而找不到权威状态。；SRC-001/003/004/005；F020,F040；M007。；按决定 ID 比对象、发文机关、原事由、有效期、撤销状态和具体措辞，T0 或核验 T1；不由文稿补造决定。；相符 PASS_FACT（仅引用事实）；正式决定与稿件相反 CONFLICT，凭据缺 NEEDS_MATERIAL，原源断联 SOURCE_UNAVAILABLE，效力判断待人 NEEDS_HUMAN_DECISION；假 NOT_APPLICABLE；下一角色原业务 Owner/有权机关。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "A—E 来文/交办指令及期限",
          "requirement": "源研究规则 R013。真＝H02 声称承接上级来文/明确办结期限；假＝自主报告且无来文期限；未知＝来文真实性/截止语句不清。；SRC-001/002/005 第24条参照；F041,F042；M020。；比上级原发文号、收文登记、交办事项、原文限期、收件/报送时间与目标本案；T0 收文事件/人工核 T1，禁止自设统一天数。；真且对应 PASS_FACT（只验证文字和时间事实）；逾期处置由有权机关判断 NEEDS_HUMAN_DECISION；凭据缺 NEEDS_MATERIAL、来源断联 SOURCE_UNAVAILABLE、文字不清 UNREADABLE、两种期限相矛盾 CONFLICT；假 NOT_APPLICABLE；下一角色机要/承办单位。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "A—D 会议议题/会前材料",
          "requirement": "源研究规则 R014。真＝H04 涉特定议事机构与议题；假＝非会议来源；未知＝会议类别/议题号不能确认。；SRC-003/004；F018,F019；M006。；比会议类型、议题事项、会前报送和真实受理阶段；T2 议题草案不等于 T0 受理，更不等于后续 M012。；会前事实对应 PASS_FACT；议题材料缺 NEEDS_MATERIAL、已声称受理却源断 SOURCE_UNAVAILABLE、错议题 CONFLICT、议事授权不明 POLICY_UNCONFIRMED；假 NOT_APPLICABLE；下一角色会议组织者。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "review-and-issuance",
      "name": "会签、核稿与正式发文前置事实",
      "description": "按原研究稿规则章节分组；用于本地研究预审，不构成校方审批流程或正式授权。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r015",
          "title": "A 联合/会办单位清单",
          "requirement": "源研究规则 R015。真＝文件涉及其他单位职权或拟联合行文；假＝确认单一单位事项；未知＝是否需要会办的校本阈值未证。；SRC-001/005 第17、19条参照；F021；M001,M008（职责清单）。；比稿中职权陈述与各单位职能，T2 列名仅为提请；真实联署资格需 T0/人工。；职责清单一致 PASS_FACT；缺应有单位说明 NEEDS_MATERIAL；联署资格不明 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；假 NOT_APPLICABLE；下一角色主办/会办单位。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "B—C 各方协商、会签及分歧",
          "requirement": "源研究规则 R016。真＝H05 已进入应协商/会签阶段或声称“各方已同意”；假＝单一单位或会签尚未发生；未知＝各方意见真实性/要求未知。；SRC-001/005 第19—22条参照；F022,F023；M008（会签子事件）。；按会办单位、真实签批人/时间、稿本版本对照 T0 事件，保留异议原文；T2 群聊不算正式会签。；证据相符 PASS_FACT；明确分歧 CONFLICT，已声称完成却凭据缺 NEEDS_MATERIAL，源断 SOURCE_UNAVAILABLE，需要会签与否未证 POLICY_UNCONFIRMED；假 NOT_APPLICABLE；下一角色会办/协调机构。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "B—C 部门事实审阅",
          "requirement": "源研究规则 R017。真＝部门初核已发生或到经证实应审阶段；假＝仍在 A 拟稿；未知＝部门内签批程序/授权未证。；SRC-001/002；F024；M009。；核审核意见 T0/T1、负责人任职授权及对应稿本版本；不得把起草人自评当负责人审签。；同一版本有权审阅 PASS_FACT；声称通过缺件 NEEDS_MATERIAL，主体错 CONFLICT，源断 SOURCE_UNAVAILABLE，层级未证 POLICY_UNCONFIRMED；假 NOT_APPLICABLE；下一角色部门办公室。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "C 条件性合法合规审查",
          "requirement": "源研究规则 R018。真＝有权制度/部门确认属重大涉法或重要规范性文件；假＝明确不触发；未知＝触发阈值/归口未知。；SRC-001；F025；M010。；查真实法核意见、对象与稿本版本、法治工作办公室职能；T0/T1；SRC-001 证明职责不证明所有公文均必法核。；真且有效 PASS_FACT；已触发却缺意见 NEEDS_MATERIAL；不同稿本 CONFLICT；政策阈值未知 POLICY_UNCONFIRMED；假 NOT_APPLICABLE；下一角色法治办公室/有权归口。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "C 校级归口核稿和送签",
          "requirement": "源研究规则 R019。真＝以学校党委/行政名义且已进入校办核稿阶段；假＝尚未到 C 或经证实非校级事项；未知＝部门名义是否要校办核稿未证。；SRC-001；F026；M011。；校办秘书部门真实核稿/退修/送签事件绑定文稿指纹，T0/T1；不能把签发提前为核稿。；真且相符 PASS_FACT；声称核稿完成但记录缺 NEEDS_MATERIAL、记录源断 SOURCE_UNAVAILABLE、稿本不符 CONFLICT；部门适用不明 POLICY_UNCONFIRMED；假 NOT_APPLICABLE；下一角色校办秘书科。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "D 会议实际决定",
          "requirement": "源研究规则 R020。真＝H04 会后稿件或正文声称会议已经形成结论；假＝会议前/非会议事项；未知＝议题已开会但决定效力不清。；SRC-003/004；F018,F019,F027；M006,M012。；查权威会议纪要/记录的议题、届次、审议/审定动词、权限与日期；T0 或核验 T1；议题草案非决定。；对应原结论 PASS_FACT（仅引用忠实）；“审议”写成“审定” CONFLICT，源断 SOURCE_UNAVAILABLE，会议效力需人判 NEEDS_HUMAN_DECISION；会前 NOT_APPLICABLE；下一角色会议秘书/有权议事机构。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "D 签发人授权、签批事件与版本",
          "requirement": "源研究规则 R021。真＝文稿已到签发阶段或声称签发；假＝尚在 A—C 未签；未知＝签发权限/真实事件未确认。；SRC-001/005 第22、25条参照；F028,F029,F030；M013,M004。；对照签发者 T0 任职/授权、签批事件、完整日期与当时稿本 hash；OCR 签名或截图最多 T2。；完整真实事件 PASS_FACT（仅签批事实）；旧稿签字指向新稿 CONFLICT；有签批声明无原始记录 NEEDS_MATERIAL/SOURCE_UNAVAILABLE；权限未证 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；假 NOT_APPLICABLE；下一角色校办/有权签发人。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "E 正式文号与签后定稿",
          "requirement": "源研究规则 R022。真＝已经签后编号/核发；假＝A—D 未办理正式编号；未知＝发文系统或部门是否有编号权未证。；SRC-001/005 第25条参照/009 待核；F031,F032,F011；M015,M013。；比正式文号登记机关、成文时间、签发稿和核发稿 hash；T0；暂定文号与文件名不算权威编号。；真且对应 PASS_FACT；签后改稿 CONFLICT、原登记无法读取 SOURCE_UNAVAILABLE、部门规则未证 POLICY_UNCONFIRMED；假 NOT_APPLICABLE；下一角色编号/发文登记机构。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "E 需要用印时的真实用印",
          "requirement": "源研究规则 R023。真＝有权流程确认本文件需要用印且进入 E；假＝尚未到 E 或确认不需用印；未知＝用印细则/章种/权限未知。；SRC-001/008 待原表；F033；M016。；比印章主管、用印批准事件、文件具体版本、章种与实际执行日志，T0/T1；章图片无证明力。；真且可验 PASS_FACT；声称已用印无记录 NEEDS_MATERIAL/SOURCE_UNAVAILABLE，章与文稿不符 CONFLICT；细则未知 POLICY_UNCONFIRMED；假 NOT_APPLICABLE；下一角色机要科/授权印章管理员。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "E 核发、分发和送达",
          "requirement": "源研究规则 R024。真＝正式核发/分送已发生或声称已发生；假＝尚未签发/核发；未知＝是否有真实分发渠道。；SRC-001/005 第25—26条参照；F034,F031,F032；M017,M015。；依 T0 发文系统/签收记录比文号、收件范围、发出时间与核发稿本；涉密转机要渠道。；对应 PASS_FACT；已宣称发布而无登记 NEEDS_MATERIAL、源断 SOURCE_UNAVAILABLE、分发对象冲突 CONFLICT；假 NOT_APPLICABLE；下一角色发文/机要人员。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "F 归档事实与阶段期限",
          "requirement": "源研究规则 R025。真＝已进入有权认定的归档阶段；假＝E 前尚未办结；未知＝现行归档规范/年度类别适用边界不明。；SRC-007 试行旧规现行性未知，SRC-013 2026年度通知部分事实可核；F035；M018。；比归档索引、移交和接收日期及正式版本；T0/T1；仅当确认确属2025年形成的文书类材料才引用 SRC-013 的2026-06-30 期限，OA电子公文则按其另载随办随归要求；年度通知不代替2024档案规程细则。；已归档事实可核 PASS_FACT；声称已归档但记录缺 NEEDS_MATERIAL/SOURCE_UNAVAILABLE；时限或保管期限适用争议 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；假 NOT_APPLICABLE；下一角色档案馆/单位档案员。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "lifecycle-and-recheck",
      "name": "生命周期、补件与复核",
      "description": "按原研究稿规则章节分组；用于本地研究预审，不构成校方审批流程或正式授权。",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r026",
          "title": "X 补件/改稿/撤回申请指向原案",
          "requirement": "源研究规则 R026。真＝有人提出修改、补件、撤回或重提；假＝没有异动；未知＝提交者或目标版本不明。；SRC-005 第21、25条参照/007 待核；F001,F011,F036,F037；M019,M005,M001（改稿才有）。；核原案 ID、原稿指纹、申请者权限与新旧版本顺序；T0 案件事件与 T1 原单；只证明“提出请求”，不证明获准撤销。；指向正确 PASS_FACT；版本找不到 NEEDS_HUMAN_DECISION，目标错 CONFLICT，申请原件缺 NEEDS_MATERIAL；假 NOT_APPLICABLE；下一角色案卷 Owner/原流程办理人。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "X 有权撤销、废止及复核结论",
          "requirement": "源研究规则 R027。真＝已正式声称撤销/废止/复核结果；假＝只有请求尚未决定；未知＝决定人或权限未证。；SRC-001/005 第27、33条参照/007 待核；F038,F039；M019。；将正式处置 T0/T1 的作出机关、权限、对象文号、时间与原决定比对；事实预审申诉不替代行政复核。；核实到有效事件 PASS_FACT（仅存在事实）；有请求未决定 NOT_APPLICABLE（最终决定检查）、宣称已撤销但无原始记录 NEEDS_MATERIAL/SOURCE_UNAVAILABLE，权限不明 NEEDS_HUMAN_DECISION；下一角色原发文机关/有权复核人。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "X/任意阶段 替换材料的依赖失效",
          "requirement": "源研究规则 R028。真＝M001/M002/M003/M007/M008/M009—M022 的某一源版本被替换或决定效力被撤销；假＝源指纹/效力及依赖未变；未知＝旧源缺失不能建链。；SRC-005 第21、25条参照；F011,F014,F015,F028,F032,F037,F043,F044（触发时）；M001,M003,M013,M015,M019,M021,M022 及受影响 M。；按材料 ID、具体子事件、主张定位、F/M/SRC 版本依赖图求重审闭包；保留旧审计轨迹；签后变更交有权签发者复审；已受理的请示新版不自动继承旧答复。；新版依赖重建事实 PASS_FACT；旧签批或旧批复沿用到新稿 CONFLICT，版本链断 NEEDS_HUMAN_DECISION；无变更 NOT_APPLICABLE；下一角色案卷 Owner/原签批或受文机关。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "A—X 相邻 G50/S/T 决定复用与去重",
          "requirement": "源研究规则 R029。真＝本公文援引合同/科研/采购/个人用印/公开等业务结论；假＝没有跨业务引用；未知＝原业务 Owner/模板映射未证。；SRC-010/011 已核项目目录、SRC-012 运行 JSON 待核；F020,F040；M007。；只读核原 Owner 已形成决定的 ID、对象、版本、效力和撤销记录，不创建另一个实体批准；项目目录仅定路由，不作为校本政策。；可验证引用 PASS_FACT（不代表本模板重新批准）；原决定与稿相反 CONFLICT、源断 SOURCE_UNAVAILABLE；运行时映射未知 POLICY_UNCONFIRMED，须目录治理人工复核；假 NOT_APPLICABLE；下一角色原业务 Owner/目录集成负责人。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r030",
          "title": "B—D 本次请示/报告送报受理事实",
          "requirement": "源研究规则 R030。真＝申报人声称“已送报/被受理”或可信系统显示送报；假＝尚在 A 草稿或无向上报送情形；未知＝接收机构、流程权限或实际送达状态不明。；SRC-001/002、SRC-005 第23—24条参照；F002,F011,F043；M001,M005,M021。；核出站记录、受文机关真实签收/受理、对应同一事项、原稿版本、提交时间和是否退办；将“发送成功”“签收”“受理”“同意”区分为不同状态。T0 或有权人员核验 T1，截图 T2 不直接判受理。；对应可信 PASS_FACT（仅送达/受理事实）；假 NOT_APPLICABLE；当前应有回执缺 NEEDS_MATERIAL、源失联 SOURCE_UNAVAILABLE、不可读 UNREADABLE、对方/版本不符 CONFLICT、受理范围/渠道不明 POLICY_UNCONFIRMED 或 NEEDS_HUMAN_DECISION；下一角色校办机要/受文机关或其收文管理员。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "D—X 本次请示答复与原请示的效力/表述对应",
          "requirement": "源研究规则 R031。真＝有权回复已形成或公文声称“本请示已获批准/被退回”；假＝仍是待批请求或未声称有答复；未知＝原机关权限、批准范围、复核/撤销状态未证。；SRC-001、SRC-005 第8/23/24条参照、SRC-014；F020,F040（未来被引用时）、F043,F044；M001,M021,M022。；用原请求对象/版本和实际受理链定位有权答复；逐项比批复“同意/不予同意/部分同意/另行研究”、限制条件、期限、决定日期及最新撤销状态；M007 只指本次前即已存在的上游决定，本次新答复为 M022。原机关权限判断只能由其可信资料与人工核实。；权威答复和引用相符 PASS_FACT（仅证有该事实）；假 NOT_APPLICABLE（待批保留独立业务待办）；声称获批但无原件 NEEDS_MATERIAL、原答复源失联 SOURCE_UNAVAILABLE、扫描不可读 UNREADABLE、范围/结论相反 CONFLICT、权限/效力未核 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；下一角色原受理机关/有权审批人。。执行边界：仅形成可追溯事实预审、风险提示或待办；校内政策适用/现行性/权限未知时必须人工复核，禁止由此生成正式批准或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "local-intake",
      "name": "A0/A：本地材料登记与安全门禁（研究阶段映射，不是校方 OA 节点）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "local-fact-review"
    },
    {
      "id": "local-fact-review",
      "name": "B/C：本地事实、依据和程序预审（不生成签发或会签决定）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "local-human-gate",
      "returnToStageId": "local-intake"
    },
    {
      "id": "local-human-gate",
      "name": "D/E/F/X：人工复核与交接（校方签发、印发、归档另走权威流程）",
      "kind": "finalize",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "local-fact-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "local-supplement-todos",
      "kind": "supplement-list",
      "audience": "reviewer"
    },
    {
      "id": "local-human-handoff",
      "kind": "item-feedback",
      "audience": "teacher"
    }
  ],
  "autoPassPolicy": {
    "enabled": false
  },
  "status": "draft",
  "createdAt": "2026-10-24T00:00:00.000Z"
}

/** Research-source traceability only; SRC IDs are not case SourceRef values. */
export const r02Metadata = {
  "templateId": "T07-T01",
  "name": "部门公文、请示、决议与发文核稿审批",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T07-T01.md",
  "sourceDocumentSha256": "5f07eca65a4d556874b76345e304a42f667bdf627bbfb43ad9aa08a136f1978b",
  "sourceDocumentBytes": 146804,
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T07-T01.md",
  "officialSchoolTemplate": false,
  "researchAsOf": "2026-10-23",
  "reviewedAt": "2026-10-24",
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
    "SRC-017"
  ],
  "fieldIds": [
    "F001",
    "F002",
    "F003",
    "F004",
    "F005",
    "F006",
    "F007",
    "F008",
    "F009",
    "F010",
    "F011",
    "F012",
    "F013",
    "F014",
    "F015",
    "F016",
    "F017",
    "F018",
    "F019",
    "F020",
    "F021",
    "F022",
    "F023",
    "F024",
    "F025",
    "F026",
    "F027",
    "F028",
    "F029",
    "F030",
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
    "F041",
    "F042",
    "F043",
    "F044"
  ],
  "materialSlotIds": [
    "M001",
    "M002",
    "M003",
    "M004",
    "M005",
    "M006",
    "M007",
    "M008",
    "M009",
    "M010",
    "M011",
    "M012",
    "M013",
    "M014",
    "M015",
    "M016",
    "M017",
    "M018",
    "M019",
    "M020",
    "M021",
    "M022"
  ],
  "criteria": [
    {
      "sectionId": "draft-evidence",
      "criterionId": "r001",
      "srcIds": [
        "SRC-001",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "draft-evidence",
      "criterionId": "r002",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "draft-evidence",
      "criterionId": "r003",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "draft-evidence",
      "criterionId": "r004",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "draft-evidence",
      "criterionId": "r005",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "draft-evidence",
      "criterionId": "r006",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "draft-evidence",
      "criterionId": "r007",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "draft-evidence",
      "criterionId": "r008",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "draft-evidence",
      "criterionId": "r009",
      "srcIds": [
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "draft-evidence",
      "criterionId": "r010",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "draft-evidence",
      "criterionId": "r011",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "draft-evidence",
      "criterionId": "r012",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "draft-evidence",
      "criterionId": "r013",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "draft-evidence",
      "criterionId": "r014",
      "srcIds": [
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-and-issuance",
      "criterionId": "r015",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-and-issuance",
      "criterionId": "r016",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-and-issuance",
      "criterionId": "r017",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-and-issuance",
      "criterionId": "r018",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-and-issuance",
      "criterionId": "r019",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-and-issuance",
      "criterionId": "r020",
      "srcIds": [
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-and-issuance",
      "criterionId": "r021",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-and-issuance",
      "criterionId": "r022",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-and-issuance",
      "criterionId": "r023",
      "srcIds": [
        "SRC-001",
        "SRC-008"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-and-issuance",
      "criterionId": "r024",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "review-and-issuance",
      "criterionId": "r025",
      "srcIds": [
        "SRC-007",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "lifecycle-and-recheck",
      "criterionId": "r026",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "lifecycle-and-recheck",
      "criterionId": "r027",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "lifecycle-and-recheck",
      "criterionId": "r028",
      "srcIds": [
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "lifecycle-and-recheck",
      "criterionId": "r029",
      "srcIds": [
        "SRC-010",
        "SRC-011",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "lifecycle-and-recheck",
      "criterionId": "r030",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "lifecycle-and-recheck",
      "criterionId": "r031",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED"
    }
  ]
} as const
