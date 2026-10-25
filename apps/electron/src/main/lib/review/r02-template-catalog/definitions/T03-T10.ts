import type { TemplateVersion } from '@profer/shared'

type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
type R02CriterionMetadata = { sectionId: string; criterionId: string; sourceRuleId: string; srcIds: string[]; evidenceStatus: R02EvidenceStatus; note: string }
type R02Metadata = { templateId: string; name: string; sourceDocumentPath: string; sourceOriginalPath: string; sourceDocumentSha256: string; sourceDocumentBytes: number; sourceBlobSha: string; sourceBranch: string; officialSchoolTemplate: false; researchStatus: string; sourcePolicyStatus: string; policyEvidenceStatus: R02EvidenceStatus; requiresPreUploadSecurityGate: true; secureIntakeEnforcedByTemplateVersion: false; requiredIntegrationGate: string; criteria: R02CriterionMetadata[] }

export const templateVersion: TemplateVersion = {
  "templateId": "T03-T10",
  "version": 1,
  "schemaVersion": 2,
  "name": "科研项目合同成果交付与履约目标核验",
  "description": "本地研究模板 · 非校方正式模板。用于科研项目合同成果交付与履约目标核验的事实与证据核对；政策证据状态为 PARTIAL，未经有权人员确认不得形成正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板由研究原件 docs/design/review-agent/business-templates/R02/research-original/T03-T10.md 转换；非成都理工大学校方正式模板，不代表学校授权或正式政策。研究依据可支持事实核验和材料对照，但校本授权、当期批次表单及具体项目适用条件并未全部核实。任何不确定政策均人工复核。 SRC 是研究来源索引，不是案卷材料 SourceRef。",
  "objectType": "project",
  "displayName": {
    "template": "科研项目合同成果交付与履约目标核验 · 本地研究核验"
  },
  "fields": [
    {
      "key": "f001",
      "label": "本次案卷/请求 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F001；F001；本次案卷/请求 ID；ID；Q；A–J；内部可信案卷事件 M004#request_id（自动生成）；P0；系统生成失败则不提交，不要求用户上传"
    },
    {
      "key": "f002",
      "label": "校内科研项目编号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F002；F002；校内科研项目编号；ID；P；A–J；T1 项目台账 M001#项目号；无接口以 M002 项目号核对；P1；找不到权威对应则停在待核项目，不跨案卷拼合"
    },
    {
      "key": "f003",
      "label": "项目类别/主管计划",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F003；F003；项目类别/主管计划；ENUM；P；A–J；T1 M001#类别；M002#任务书/合同性质；P1；不明置 POLICY_UNCONFIRMED，禁套专项期限"
    },
    {
      "key": "f004",
      "label": "所属教学科研单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F004；F004；所属教学科研单位；STR/ID；P；A–J；T1 M001#承担单位；P1；待部门核对，不据个人自填分配审核权"
    },
    {
      "key": "f005",
      "label": "登记项目负责人稳定身份",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F005；F005；登记项目负责人稳定身份；ID；P；A–J；T1 M001#负责人/主管备案；P1；不匹配则需人工核，不按姓名近似合并"
    },
    {
      "key": "f006",
      "label": "当前提交者可信身份",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F006；F006；当前提交者可信身份；ID；Q；A–J；可信认证事件 M004#auth_subject；P1；无法认证则不可执行写入/撤回/复核动作"
    },
    {
      "key": "f007",
      "label": "提交/代理资格与授权范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F007；F007；提交/代理资格与授权范围；ENUM/REF；Q；A–J；T1 项目关系或 M004#授权记录；必要时 M019；P2；权限未知只可代录草稿，不作有权提交/撤回"
    },
    {
      "key": "f008",
      "label": "合同相对方法定实体",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F008；F008；合同相对方法定实体；STR/ID；C；A–J；T1 合同原档 M002#当事方；P2；与回执/验收主体不同须标冲突，人工核"
    },
    {
      "key": "f009",
      "label": "合同/任务书编号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F009；F009；合同/任务书编号；ID；C；A–J；T1 M002#封面/备案号；P2；缺失不得对任意合同合并交付记录"
    },
    {
      "key": "f010",
      "label": "当期有效合同/任务书版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F010；F010；当期有效合同/任务书版本；REF；C；A–J；T1 M002#签署页/版本；M015#生效补充件；P2；不明则合同指标不可自动判定，需人工确认"
    },
    {
      "key": "f011",
      "label": "校方签约权限核验状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F011；F011；校方签约权限核验状态；ENUM；C；A–J；2026 授权原件待核，M002#签章与 M019#授权链；P2；不因可见公章认定有效，置 NEEDS_HUMAN_DECISION"
    },
    {
      "key": "f012",
      "label": "对应成果/指标条款定位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F012；F012；对应成果/指标条款定位；TXT；C/N；A–J；M003#合同页/章/条/附件表格单元；P2；找不到条款只提示来源不足，不自动补充义务"
    },
    {
      "key": "f013",
      "label": "本次履约节点标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F013；F013；本次履约节点标识；ID/REF；N；A–J；M003#阶段序号/条款映射；P1；节点无法定位则不得把多批材料混为一次验收"
    },
    {
      "key": "f014",
      "label": "节点类别（阶段/最终/分批等）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F014；F014；节点类别（阶段/最终/分批等）；ENUM；N；A–J；M003#节点约定；P1；未明则人工分类，不按材料标题推断"
    },
    {
      "key": "f015",
      "label": "约定成果类型/名称",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F015；F015；约定成果类型/名称；STR；N；A–J；M003#成果清单/附件；P2；不清楚要求则不判“交付完整”"
    },
    {
      "key": "f016",
      "label": "约定数量、单位或量化指标",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F016；F016；约定数量、单位或量化指标；DEC/TXT；N；A–J；M003#指标单元及单位；P2；无规定时记“未约定/未知”，不得填默认 100%"
    },
    {
      "key": "f017",
      "label": "质量/验收方法及标准",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F017；F017；质量/验收方法及标准；TXT/REF；N；A–J；M003#验收条款；有独立标准时 M009；P2；未核到则禁止自动判断技术合格"
    },
    {
      "key": "f018",
      "label": "合同约定交付/验收截止日期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F018；F018；合同约定交付/验收截止日期；DT/条件；N；A–J；M003#期限条款；生效变更另见 M015；P2；无约定/不明则“期限未知”，不硬设逾期"
    },
    {
      "key": "f019",
      "label": "适用校本/主管政策配置",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F019；F019；适用校本/主管政策配置；REF/ENUM；P；A–J；T1 主管计划、SRC-001–009 与 M001/M002；P0；版本未核时 POLICY_UNCONFIRMED，不能用外校制度"
    },
    {
      "key": "f020",
      "label": "实际交付批次标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F020；F020；实际交付批次标识；ID；D；B–G，有多批次时；M005#交付清单批次号；事件序列；P1；无法区分批次则只作总量主张，需补映射"
    },
    {
      "key": "f021",
      "label": "成果项 ID、名称与版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F021；F021；成果项 ID、名称与版本；REF；D；B–E；G 关联争议时；M005#清单行、M006#成果文件元数据；P2；成果与节点无法对应则 NEEDS_MATERIAL"
    },
    {
      "key": "f022",
      "label": "成果内容哈希/实际版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F022；F022；成果内容哈希/实际版本；HASH；D；B–E；版本更新时；M006#文件哈希、签名/原始版本索引；P2；不可读或无法比对时 UNREADABLE，不复用旧结论"
    },
    {
      "key": "f023",
      "label": "本批交付数量/单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F023；F023；本批交付数量/单位；DEC/TXT；D；B–E；M005#交付数量及计量单位；P2；不明不判完整，也不与 F016 隐式换算"
    },
    {
      "key": "f024",
      "label": "发出/送达发生时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F024；F024；发出/送达发生时间；DT；D；B/C；若声称已送达；M007#原始时间戳/物流轨迹；P2；无原始记录则不证明送达时间"
    },
    {
      "key": "f025",
      "label": "送达渠道及目的地",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F025；F025；送达渠道及目的地；ENUM/STR；D；B/C；若声称已送达；M007#邮件头/平台/物流/现场移交地点；P2；不能与合同约定收件方对照则人工核"
    },
    {
      "key": "f026",
      "label": "送达状态及证明范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F026；F026；送达状态及证明范围；ENUM；D；B/C；M007#投递、到达、签收等事件；P2；单方发送不升格为签收、验收"
    },
    {
      "key": "f027",
      "label": "实际收件人身份/单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F027；F027；实际收件人身份/单位；STR/ID；S；C/D；出现签收时；T2 M008#回执/签收人、M019#授权线索；P2；同名/单位歧义置 CONFLICT"
    },
    {
      "key": "f028",
      "label": "对方收件时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F028；F028；对方收件时间；DT；S；C/D；出现签收时；T2 M008#收件时间戳；P2；未生成签收不记缺件；声称已签收但无时点则待核"
    },
    {
      "key": "f029",
      "label": "签收覆盖的成果/批次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F029；F029；签收覆盖的成果/批次；REF；S；C/D；出现签收时；T2 M008#清单与范围，关联 F020/F021；P2；未列明范围不得覆盖所有成果"
    },
    {
      "key": "f030",
      "label": "收件人代表权限状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F030；F030；收件人代表权限状态；BOOL3/ENUM；S；C/D；有人代签时；M019#对方授权材料/可信验证；M008#回执；P2；未证实≠无权；保留未知，不据回执推验收"
    },
    {
      "key": "f031",
      "label": "验收/测试意见文书 ID 与版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F031；F031；验收/测试意见文书 ID 与版本；REF；A；D/J；仅形成后；T2/T1 M011#文号/记录号；M010#测试文书；P2；尚未形成是 NOT_APPLICABLE；声称验收通过而无文书则待证"
    },
    {
      "key": "f032",
      "label": "验收意见原文结论",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F032；F032；验收意见原文结论；ENUM/TXT；A；D/J；仅形成后；M011#正式结论原文；P2；不从“收到”或“已付款”推通过"
    },
    {
      "key": "f033",
      "label": "验收覆盖节点/成果/保留条件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F033；F033；验收覆盖节点/成果/保留条件；REF/TXT；A；D/J；仅形成后；M011#意见范围、附条件事项；P2；只认可覆盖项，其余状态未知"
    },
    {
      "key": "f034",
      "label": "验收意见签发主体与权限状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F034；F034；验收意见签发主体与权限状态；REF/BOOL3；A；D/J；仅形成后；M011#签署页、M019#授权、主管来源 M018；P2；权限未知需人工，不凭纸面职务直接通过"
    },
    {
      "key": "f035",
      "label": "拒收/异议/争议类型及文本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F035；F035；拒收/异议/争议类型及文本；ENUM/TXT；I；E/G/I；出现争议时；M012#异议原文、M017#复核问题；P2；“无记录”不可自动断定“无争议”"
    },
    {
      "key": "f036",
      "label": "整改说明与新旧成果链接",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F036；F036；整改说明与新旧成果链接；REF；I/D；E；M013#整改清单、M006#新成果哈希；P2；缺映射则受影响项不可重审、旧结论冻结"
    },
    {
      "key": "f037",
      "label": "变更/延期申请文书链接",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F037；F037；变更/延期申请文书链接；REF；X；F，提出申请后；M014#申请及提交时点；P2；只有申请时状态为待批，不改生效基线"
    },
    {
      "key": "f038",
      "label": "有权批准的补充合同/变更文书",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F038；F038；有权批准的补充合同/变更文书；REF；X/C；F；批复后；M015#批准/签署页、有效期；P2；未出现时不能视为生效或强制补件"
    },
    {
      "key": "f039",
      "label": "变更决定状态与生效时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F039；F039；变更决定状态与生效时间；ENUM/DT；X；F；决定后；M015#正式决定的状态/时间；P2；未核权限或生效时点则使用原基线并人工确认"
    },
    {
      "key": "f040",
      "label": "本模板撤回/停止申请请求",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F040；F040；本模板撤回/停止申请请求；REF/DT；Q；H；M016#可信用户动作日志/书面请求；P1；身份或对象不明拒绝自动撤回，保留草稿"
    },
    {
      "key": "f041",
      "label": "事实复核请求、理由及原版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F041；F041；事实复核请求、理由及原版本；REF/TXT；Q；I；M017#复核说明/对照证据；P2；缺原结论定位则先补证，不撤销既有决定"
    },
    {
      "key": "f042",
      "label": "邻接权威结论引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F042；F042；邻接权威结论引用；REF；Q；D/J；需要引用时；T1 M018#T03-T02/03/05/06/07、G06/G07 等决定；P2；来源失联则 SOURCE_UNAVAILABLE，不复制为本模板批准"
    },
    {
      "key": "f043",
      "label": "已作出的正式人工决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F043；F043；已作出的正式人工决定引用；REF/DT；Q；D/J；有决定后；T1 M021#决定机关、对象、版本、时间及效力；P2；尚未形成 NOT_APPLICABLE；只有陈述无文书需人工"
    },
    {
      "key": "f044",
      "label": "项目/材料保密与披露限制状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F044；F044；项目/材料保密与披露限制状态；ENUM；P/C；A–J，接收任何材料前；M001#定密/项目属性、M002#保密条款、M020#安全转办记录；P3；不能确定是否允许普通系统处理时先停内容提取，由有权部门核"
    },
    {
      "key": "f045",
      "label": "合同履约指标实际观测值、计量单位、方法、样本/条件、取值区间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F045；F045；合同履约指标实际观测值、计量单位、方法、样本/条件、取值区间；OBJECT/DEC；N/D；B/D/E；合同约定量化履约指标且主张已形成观测结果时；M010#报告测量单元或 M022#过程记录与原始数据索引，对照 M003#F016/F017；P2，涉密记录 P3 不入普通系统；无实际数据但当前已声明满足指标→NEEDS_MATERIAL；测量条件不可比→NEEDS_HUMAN_DECISION；未来才测试则 NOT_APPLICABLE"
    },
    {
      "key": "f046",
      "label": "期限义务类别及起算规则",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F046；F046；期限义务类别及起算规则；ENUM/REF；N；A–J；合同包含发送、有效交付、异议、验收或归档不同时间义务时；M003#逐条合同约定及 SRC-002 专项阶段、M015#生效变更；P2；不以 F018 一个日期混同“发出日”“到达日”“验收截止日”；未知交合同归口解释"
    },
    {
      "key": "f047",
      "label": "默示验收/异议期限条款、触发与反证情况",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F047；F047；默示验收/异议期限条款、触发与反证情况；OBJECT/BOOL3；N；D/G；只有本人主张默示验收或有权合同明确约定且期限已触发；M003#原合同条款、M007/M008#有效通知线、M012/M023#原始异议/完整记录；P2；无约定或尚未到阶段→NOT_APPLICABLE；资料不全/法效不明→NEEDS_HUMAN_DECISION，绝不从“未见邮件”自动验收"
    },
    {
      "key": "f048",
      "label": "依法依约可能起算的实际到达/有效交付事件及发生时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F048；F048；依法依约可能起算的实际到达/有效交付事件及发生时间；REF/DT/BOOL3；D；C/D/G；声称合同意义上的送达或依到达起算时；M003#接收地址/机制、M007#原始轨迹、M008#对方事件、M023#平台状态；P2；仅发送时间 F024、投递截图不能填“有效交付”；失联→SOURCE_UNAVAILABLE，有无效力争议→NEEDS_HUMAN_DECISION"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "项目管理权威底账",
      "purpose": "M001 项目管理权威底账：项目与负责人、单位、类别、保密属性；科发院/社科处/学院或计划主管；项目台账、正式立项/任务书登记；A–J C，优先可信查阅；正式项目批复加人工核验项目身份；F002–F005/F019/F044；SRC-001/002/003；绑定项目号、台账生效时点；无接口先取有权登记证明，不以申请者声明代替；断联 SOURCE_UNAVAILABLE，模糊 UNREADABLE",
      "requiredElements": [
        "项目管理权威底账",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m002",
      "name": "生效合同/任务书原档",
      "purpose": "M002 生效合同/任务书原档：合同主体、版本、签订和保密条款；学校合同归口/项目主管/相对方；签章合同、批复任务书及附件；A–J C（仅取适用版本）；合同归口可信电子原件或经核实副本；F002/F003/F008–F011/F044；SRC-002/005/006/008；归属 F002/F009/F010、签署日和页码；仅复印件且无法核版本为待人工，不以扫描公章推出授权；不可读 UNREADABLE",
      "requiredElements": [
        "生效合同/任务书原档",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m003",
      "name": "节点条款与指标映射",
      "purpose": "M003 节点条款与指标映射：明确本次应交什么、何时、何标准；由 M002 的约定页/附件引用形成的结构化摘录，不另造校表；A–J C；原合同条款的页、表、行直接引用，独立附件并入 M002；F012–F018；SRC-002/003/005/006；始终绑定有效合同版本与节点；抽取失败回到原文人工定位，未写明阈值不得补造；条款来源失联则 SOURCE_UNAVAILABLE",
      "requiredElements": [
        "节点条款与指标映射",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m004",
      "name": "可信申请/代办事件",
      "purpose": "M004 可信申请/代办事件：当前请求及角色；可信 Main/身份服务、项目正式授权人；会话认证与提交/代录事件；A–J C，系统形成不向用户索传；学校正式书面授权经人工核验，必要时 M019；F001/F006/F007；SRC-001/003（具体校内代理方式待核）；请求 ID、Actor 稳定 ID、权限范围、时间；不接受 Renderer 手填职务；身份未证仅草稿、不执行写入",
      "requiredElements": [
        "可信申请/代办事件",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m005",
      "name": "批次交付清单",
      "purpose": "M005 批次交付清单：对应节点、成果数与本批范围；项目负责人/有权经办；交付目录、清单或实际电子平台清单；B C，C/D/E/G T（涉及本批时）；原始平台提交记录逐件索引；F013/F020/F021/F023；SRC-004/005；逐行挂节点、批次、成果 ID/版本，保存旧清单；缺清单或关联不清 NEEDS_MATERIAL，不可读 UNREADABLE",
      "requiredElements": [
        "批次交付清单",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m006",
      "name": "交付成果及可核版本",
      "purpose": "M006 交付成果及可核版本：实际产物存在与内容版本；项目组/合同约定保管人；报告、软件、数据、样品交接登记等；B C，C/D/E/G T；保密成果仅授权元数据/线下核验记录；物理样品用签收及编号链核对，不能凭空要求上传实体；F021/F022/F036/F044；SRC-004/005；保存文件哈希/签名、版本、样品编号、项目/节点归属；不能读取 UNREADABLE，禁引用旧文件的旧 PASS_FACT",
      "requiredElements": [
        "交付成果及可核版本",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m007",
      "name": "发送/送达原始记录",
      "purpose": "M007 发送/送达原始记录：发生了发送、投递或到达何处；发件系统/项目组/邮递平台；原始邮件头、系统日志、快递凭据、现场移交记录；B T（声称已发）、C C（声称送达）；合同认可的其他可核渠道原始轨迹；F024–F026；SRC-005/006（具体合同约定优先）；关联接收地址、批次、事件时间和原始编号；截图单独不足证送达；缺据不作送达认定、不可读 UNREADABLE",
      "requiredElements": [
        "发送/送达原始记录",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m008",
      "name": "对方签收/回执",
      "purpose": "M008 对方签收/回执：对方实际收取的范围；合同相对方/其可信收件平台；邮件回执、盖章签收、平台接收记录；C T（主张对方收件时为 C），D/G T；A/B L；经证实的合同约定电子签收方式；F027–F030；SRC-005/006；逐项范围 F029 和签收人、时间；无件时不得称已签收；签收绝非质量验收，人员存疑追加 M019",
      "requiredElements": [
        "对方签收/回执",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m009",
      "name": "独立验收标准附件",
      "purpose": "M009 独立验收标准附件：另行约定检验方法或技术附件；合同签署双方/主管部门；技术协议、已纳入合同的标准附件；A/D T（合同指向外部文件才需）；合同完整内嵌标准可直接以 M003 代替；F017；SRC-002/005/006；绑定标准编号、版本、生效/引用条款；缺或旧版则 POLICY_UNCONFIRMED/NEEDS_MATERIAL；不自动拿现行国家标准替换合同约定",
      "requiredElements": [
        "独立验收标准附件",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m010",
      "name": "测试/质量佐证",
      "purpose": "M010 测试/质量佐证：测量或专家检测的事实；约定实验室/第三方/项目组；原始检测报告、实验记录、测试结果；D T（合同/主管要求时），B T（本阶段确需证明时）；合同认可的替代检测或主管原始测试记录；F017/F021/F022/F031；SRC-002/004/005；标样、设备条件、样品号与成果版本；未经授权机构报告不冒充正式验收，无法校准时 NEEDS_HUMAN_DECISION",
      "requiredElements": [
        "测试/质量佐证",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m011",
      "name": "正式技术验收意见",
      "purpose": "M011 正式技术验收意见：验收结论、范围和签发主体；相对方或按合同/计划有权评审主体；验收报告、正式意见/纪要；D T（声称已有验收结论时 C）、J T，A/B/C L；主管计划可信验收记录、合规电子签意见；F031–F034；SRC-002/005/006；文号、日期、签发身份、节点/批次及保留事项；尚未形成不缺件；只有项目组自评不得填“正式通过”",
      "requiredElements": [
        "正式技术验收意见",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m012",
      "name": "拒收/异议原文",
      "purpose": "M012 拒收/异议原文：对方针对何物提出何种异议；相对方/有权争议处理主体；拒收函、邮件、平台异议及原始记录；E/G C（有异议主张），I T；可验证原始通信或有权法务备案；F027/F029/F035；SRC-005/006；链接对应交付版本、发件人、接收日期；口头转述仅为线索，缺原文不自动断言对方无异议",
      "requiredElements": [
        "拒收/异议原文",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m013",
      "name": "整改与替代对照",
      "purpose": "M013 整改与替代对照：纠正了哪些交付项；项目负责人/授权经办；整改说明、新旧成果差异清单、新版本文件或样品索引；E C；平台版本对照与 M005/M006 的变更历史；F021/F022/F036；SRC-004/005；每个原成果 → 新成果/节点/新哈希；缺映射不清除旧问题，替换只触发受影响项重审",
      "requiredElements": [
        "整改与替代对照",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m014",
      "name": "变更/延期申请",
      "purpose": "M014 变更/延期申请：已申请但未必批准；项目负责人/科研管理归口；申请函、审批流程受理记录；F C（仅申请阶段）；可信主管系统的变更受理记录；F013/F018/F037；SRC-002/003/006；绑定变更前合同/节点、申请时间和申请人；申请本身不改生效截止日，缺则无“已申请”事实",
      "requiredElements": [
        "变更/延期申请",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m015",
      "name": "获批补充协议/变更决定",
      "purpose": "M015 获批补充协议/变更决定：生效内容与时点；合同双方/科研主管或项目主管；签署补充协议、正式批复；F L（获批后核，若主张已生效则 C）；可查主管系统的正式变更决定及附件；F010/F018/F038/F039；SRC-002/003/006/008；保留原基线和新基线及生效日、授权人；仅草签/口头同意不覆盖 M002/M003",
      "requiredElements": [
        "获批补充协议/变更决定",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m016",
      "name": "撤回/停止请求事件",
      "purpose": "M016 撤回/停止请求事件：谁对哪个申请作何请求；可信提交者/受理机构；可信按钮请求日志、经签名的书面请求；H C；经核验的有权代理人请求；F006/F007/F040；SRC-001/003（校本撤回机制仍未知）；指向具体案卷、材料版本和动作时间；授权未知阻止自动执行；撤回不删除已发交付或外部决定",
      "requiredElements": [
        "撤回/停止请求事件",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m017",
      "name": "事实复核/异议请求",
      "purpose": "M017 事实复核/异议请求：复核对象与新证据；受影响负责人/授权代理；带旧结论 ID 的复核申请、材料对照；I C；校内可信受理记录及新增指向特定 F/M 的证据；F006/F035/F041；SRC-004/005（校本申诉程序未核）；指向旧事实结果/决定和源版本；缺定位先补说明，复核不能直接撤销外部有权结论",
      "requiredElements": [
        "事实复核/异议请求",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m018",
      "name": "相邻权威结果引用",
      "purpose": "M018 相邻权威结果引用：已有前置合同、变更、中期、结题或归口结论；T03-T02/03/05/06/07、G06/G07 等原业务 owner；其权威 Decision/ref；D/F/J T；原业务正式决定/可核签章文件；F019/F034/F042；SRC-001/002/003/012（SRC-012 非政策）；引原业务 ID、决定版本、范围与时效，不能复制成 T03-T10 自己决定；断联 SOURCE_UNAVAILABLE",
      "requiredElements": [
        "相邻权威结果引用",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m019",
      "name": "多类签发授权链",
      "purpose": "M019 多类签发授权链：申请代理、合同签署、收件、验收人是否有权；校方党政办/合同归口、相对方授权主体或主管机构；当期授权书、名册及任命关系；A/C/D/F/G T（身份疑点或权限影响结论时）；由有权主体在线查证的有效权限记录；F007/F011/F030/F034；SRC-008/011（年度及范围未核）；授权有效起止、本人稳定标识、签署业务种类；不能沿用 2025 名册认定 2026，缺据 NEEDS_HUMAN_DECISION",
      "requiredElements": [
        "多类签发授权链",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m020",
      "name": "信息安全/涉密分流记录",
      "purpose": "M020 信息安全/涉密分流记录：是否允许进入普通预审；项目归口/保密责任人、可信安全检查；定密状态/披露限制及安全转办元数据；A–J S/C，所有材料入场前；M001 官方涉密标记与 M002 保密条款的安全人工查证；F044；SRC-002/004；只留分类状态、授权校验人与转办号；不可在普通系统保存 P3 正文；政策/权限不明立即停止内容提取",
      "requiredElements": [
        "信息安全/涉密分流记录",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m021",
      "name": "人工正式决定",
      "purpose": "M021 人工正式决定：已有正式审批/确认的对象及效力；校内有权归口或合同约定/主管验收机关；签发决定、电子公文/有权系统记录；D/J L（已形成且需引用时 T）；实际决定机关提供的可信文号/签章核验；F042/F043；SRC-001/002/003；来源决定 ID、签发人/机关、时间、适用节点及撤销/改签链；未形成 NOT_APPLICABLE，不能 AI 自行生成",
      "requiredElements": [
        "人工正式决定",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m022",
      "name": "履约过程原始记录",
      "purpose": "M022 履约过程原始记录：非单份成果文件的里程碑行为和实际观测指标；项目组/可信服务平台/合同约定第三方持有，服务时数、培训实施记录、研发实验日志、实际性能指标源记录；B/D/E T，只有当条款要求且当前主张有成果时为 C；可核平台逐条记录、经授权保密环境的核验元数据；F015–F017/F021/F045；SRC-002/004/005/014；必须有计量单位、原始采集时点、条件、样品/服务对象、节点与来源版本；不得把宣传报告表格当独立实测，涉密不上传正文",
      "requiredElements": [
        "履约过程原始记录",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "m023",
      "name": "相对方原始通知与异议事件簿",
      "purpose": "M023 相对方原始通知与异议事件簿：可验证的合同约定电子渠道履约通知和响应全貌；相对方授权通知平台/共同约定服务，送达/退回/异议/撤回/回执事件的带权限导出记录；C/D/G T，仅涉及有效送达、默示验收主张时条件追加；经双方确认的原始邮件头/完整往来及合同指定平台状态；F024–F030/F035/F047/F048；SRC-005/014，具体校本使用方式待 SRC-006/015；记载查询覆盖起止、访问主体与缺口；查询不到异议不等于没有异议，只要源不完整、频道未授权或无法证明完整就不得推出默示验收",
      "requiredElements": [
        "相对方原始通知与异议事件簿",
        "权威持有人/来源及适用阶段",
        "版本、归属、缺失与不可读状态"
      ],
      "acceptedKinds": [
        "pdf",
        "image",
        "office",
        "sheet",
        "text"
      ],
      "minCount": 0,
      "maxCount": 100,
      "requiredAt": "submission",
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "contract-baseline",
      "name": "项目、合同/任务书与授权基线",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "保密与普通系统准入",
          "requirement": "R001 A–J；保密与普通系统准入；T=接收任何案卷内容；F=仅查看无材料的公共帮助；U=项目定密或披露限制不可证；SRC-002/004；F044；M001/M002/M020#定密条目、保密条款/分流记录；先用有权安全记录比对项目与材料属性；必要时仅保留非涉密元数据，不预览 P3，约束持续至本版本所有处理；T 且允许处理→PASS_FACT（仅准入事实）；U→NEEDS_HUMAN_DECISION，先阻断提取；合同禁传即转安全渠道，不判材料缺件；下一角色保密/项目归口。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "项目/案卷稳定归属",
          "requirement": "R002 A–J；项目/案卷稳定归属；T=启动科研交付预审；F=非科研项目→R029；U=无法确定项目归属；SRC-001/003；F001–F005；M001/M004#项目号、负责人、请求 ID；校方稳定项目 ID、单位、类别与案卷键精确对应；T1 优先，正式立项证明需人工核；以请求时项目关系为准；一一对应→PASS_FACT；项目号冲突→CONFLICT，U→SOURCE_UNAVAILABLE 或 NEEDS_MATERIAL；下一角色项目负责人/科研归口。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "经办/提交/撤回权限前置身份",
          "requirement": "R003 A–J；经办/提交/撤回权限前置身份；T=任何有权写入动作；F=只读公开查看；U=当前认证或代理范围不能核；SRC-001/003/013（013 仅目录）；F005–F007/F001；M001/M004/M019#可信认证、委托范围；服务端可信 Actor 对照项目关系、时效和委托事项；不接纳 Renderer 自填 teacher/姓名相似/2020 空白委托书；已证对应动作权限→PASS_FACT；U→NEEDS_HUMAN_DECISION，允许代录草稿但阻断正式提交/撤回，下一角色校方身份/科研管理人。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "适用计划与政策版",
          "requirement": "R004 A–J；适用计划与政策版；T=选定项目/节点；F=确无专门计划时仅按适用合同与有效通则；U=类别、现行性或主管归口不明；SRC-001/002/003/005/006/007/010；F003/F019；M001/M002/M003#项目类别/任务书；将立项批复与制度适用对象、施行时间逐项匹配；SRC-007 历史版、SRC-010 外校表格不得成为成都理工大学现行阈值；适用范围可证→PASS_FACT；U→POLICY_UNCONFIRMED，不得将“无专门计划”判成政策缺失；下一角色科研归口核制度版本。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "履约依据主体与原档",
          "requirement": "R005 A–J；履约依据主体与原档；T=以合同/任务书为基线；F=无此类依据则不进入本模板、转 R029；U=编号/相对方/原件有效性不明；SRC-002/005/006；F008–F010；M002#当事方、签署页、附件、归档号；T1 正式合同/批复与相对方实体、编号和适用版本对应；T3 扫描不能单凭图像认定合同效力；归属与原件一致→PASS_FACT；冲突 CONFLICT，U→NEEDS_MATERIAL/NEEDS_HUMAN_DECISION，下一角色合同/科研归口。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "学校签约代表有权性",
          "requirement": "R006 A–J；学校签约代表有权性；T=合同签署效力影响本次节点；F=依法无需学校签约代表的主管任务书分支；U=当期签署授权链缺失；SRC-008/011；F011/F009/F010；M002/M019#签章、日期、年度授权；签署日/签署类别/代表授权有效起止相匹配；2025 名册不证明 2026 授权，学校与相对方签发权不可互换；已证签署事实和授权范围→PASS_FACT；U→NEEDS_HUMAN_DECISION，下一角色党政办/合同归口；缺正文不能先认无权。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "约定节点与目标定位",
          "requirement": "R007 A–J；约定节点与目标定位；T=本次针对某节点；F=节点不属本合同→R029 或 NOT_APPLICABLE；U=合同条款无法定界；SRC-002/003/005/006；F012–F018；M002/M003#页条、技术附件、时间条款；按 F010 生效版本逐条提取名称、指标、单位、起算、验收方法，F016/F017/F018 未约定则明确“无约定”，不得填默认值；条款/未约定事实可追溯→PASS_FACT；U→NEEDS_MATERIAL/POLICY_UNCONFIRMED 或人工合同解释，下一角色负责人/合同归口。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "外部标准是否合同一部分",
          "requirement": "R008 A/D；外部标准是否合同一部分；T=F017 正式指向独立技术标准/附件；F=条款内完整约定或无此标准；U=引用标准版本未知；SRC-002/005/006；F012/F017；M003/M009#引用条与标准版本；比对合同具体编号、生效版与附件；不自动拿最新国标或 AI 生成的技术阈值替换签约约定；有证可定位→PASS_FACT；F→NOT_APPLICABLE；U→POLICY_UNCONFIRMED/NEEDS_MATERIAL，下一角色合同/技术负责人。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "delivery-acceptance",
      "name": "交付、签收、验收与异议事实",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r009",
          "title": "B–G",
          "requirement": "R009 B–G；交付成果版本与批次归属；T=申报已形成交付成果；F=A/H/I 无成果新主张；U=节点/批次无法定位；SRC-004/005；F013/F020–F022；M005/M006#行、文件哈希/样品号；项目/合同/节点/批次/成果 ID+版本/哈希闭环，T3 原件供事实核对，涉密元数据 M020；逐件归属→PASS_FACT；U→CONFLICT/NEEDS_MATERIAL，下一角色项目经办及负责人；旧批次文件不自动复用。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "B–E",
          "requirement": "R010 B–E；本批数量与合同指标口径；T=F016 定义可比较的数量、单位/子目标；F=合同无该数量要求；U=单位换算/计量口径未知；SRC-005/006；F016/F023/F013/F020；M003/M005/M006#合同数量及交付明细；同节点、同成果类别与单位比对，分批仅核本批声明，不把分批少于总量判未履行；单位换算只用有依据的对应关系；数量登记与清单一致→PASS_FACT（不表示总合同完成）；F→NOT_APPLICABLE；U→NEEDS_HUMAN_DECISION/CONFLICT，下一角色负责人/合同归口。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "约定期限与实际发送时刻",
          "requirement": "R011 B/C；约定期限与实际发送时刻；T=主张已发且期限可定位；F=未发/合同无时间条款（日期比较不适用）；U=条件期限起算不明；SRC-002/005/006；F018/F024；M003/M007/M015#期限/原始时间戳/变更；取事件发生当时有效合同，按原约定时区与工作日/条件事件比较；只报告早/同日/晚客观差异；时间证据与基线可核→PASS_FACT（不判违约）；U→POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION，下一角色合同/科研归口。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r012",
          "title": "送达渠道及轨迹",
          "requirement": "R012 B/C；送达渠道及轨迹；T=主张已发/已送达；F=成果仅形成未发送；U=渠道/终点不明；SRC-005/006；F024–F026/F008；M002/M003/M007#收件约定、原始邮件/日志/物流；区分发送、投递、到达、拒收事件和约定地址；截图、发件箱不等于对方签收；与原始记录一致→PASS_FACT（限定发送或到达范围）；U→NEEDS_MATERIAL/CONFLICT，下一角色经办/合同归口。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "C/D/G",
          "requirement": "R013 C/D/G；对方签收存在及覆盖；T=声称对方已收或该阶段真实回执已生成；F=尚无签收主张/后续未发生；U=回执无法归属具体批次；SRC-005/006；F027–F029/F020/F021；M005/M007/M008#回执人、时点、清单；T2 对方原始凭证优先，逐项核身份/时间/范围；部分签收只对相应节点、批次有效；签收事实可核→PASS_FACT（绝非验收）；F→NOT_APPLICABLE；U→CONFLICT/NEEDS_MATERIAL，下一角色项目组/合同相对方。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "C/D/G",
          "requirement": "R014 C/D/G；收件人授权范围；T=确有代收/签收并以其作为有权交接凭证；F=无签收动作；U=收件人是否代表相对方不明；SRC-005/006；F008/F027/F030；M002/M008/M019#收件身份/对方委托；区分自然人同名、公司更名、授权日期和合同收件范围；M008 签名本身不证验收权；收件资格可核→PASS_FACT；U→NEEDS_HUMAN_DECISION，下一角色合同相对方有权代表/校方合同归口。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "技术检测佐证与成果版本",
          "requirement": "R015 D；技术检测佐证与成果版本；T=合同/主管明确需测试且结果已产生或声称完成；F=不要求测试或尚未进入检测阶段；U=测试是否为验收必要条件未知；SRC-002/004/005；F017/F021/F022/F031；M006/M009/M010#样本/报告/标准引用；T2/T1 正式检验记录与成果哈希、样本编号、检验日期、方法版本一一对应；算法仅核映射，不自行鉴定合格；报告与样本可核→PASS_FACT（不认证技术指标）；U→POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION，下一角色技术专家/有权检测机构。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "验收文书的存在、版本与范围",
          "requirement": "R016 D/J；验收文书的存在、版本与范围；T=声称已有合同/主管验收意见；F=仍为拟验收、意见尚未形成；U=意见是收件回执还是验收不清；SRC-002/005/006；F031–F033/F013/F020/F021；M005/M006/M011#文号/结论原文/覆盖清单；逐节点和成果验证文书号、签发日、意见原文和保留事项；不将 M008 回执或 M010 自测自动升级；文书与覆盖范围可核→PASS_FACT（只证文书存在与原文）；U→CONFLICT/NEEDS_HUMAN_DECISION，下一角色相对方/专项验收归口。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "验收意见有权签发",
          "requirement": "R017 D/J；验收意见有权签发；T=需引用 M011 作正式验收意见；F=尚无正式验收文书；U=签发机构/代表是否有权不明；SRC-002/005/006；F034/F031；M011/M019#落款、授权/主管记录；比较验收行为在合同/任务书约定范围及签发日授权；校内合同签约名册不能证明对方验收权；签发链可证→PASS_FACT；U→NEEDS_HUMAN_DECISION，下一角色合同相对方/主管验收机构。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "E/G/I",
          "requirement": "R018 E/G/I；拒收、异议及保留意见；T=有对方拒收/争议声明；F=不存在已知异议声明且不对“无争议”作保证；U=口头转述/发件真实性存疑；SRC-005/006；F035/F029/F032/F033；M008/M011/M012#异议原文及范围；保留双方原文、发件身份和针对的批次/版本，判断“有异议声明”事实，不裁判异议是否成立；声明和范围可核→PASS_FACT；U→NEEDS_MATERIAL/CONFLICT，下一角色合同归口/法务或约定争议机关。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "整改与新旧成果映射",
          "requirement": "R019 E；整改与新旧成果映射；T=确有补件、复交或整改版本替换；F=没有替换而仅提出一般询问；U=旧/新材料版本关系不清；SRC-004/005/006；F021/F022/F035/F036；M005/M006/M012/M013#原项、替换项及差异；原哈希→新哈希/样品编号、节点范围、一对一或明确多对多映射；保存历史；新文书只重核受影响 R；变更链完整→PASS_FACT（不表示整改合格）；U→CONFLICT/NEEDS_MATERIAL，下一角色项目负责人/审核人员。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "change-and-decisions",
      "name": "变更、撤回、复核与权威决定",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r020",
          "title": "变更/延期申请已提出",
          "requirement": "R020 F；变更/延期申请已提出；T=项目负责人声称已申请；F=没有申请；U=申请归属/受理状态不明；SRC-002/003/006；F037/F013/F018；M014#申请号/提出时间；申请 ID、原合同节点、经办人及递交时间相对应；T3 申请不等于主管受理或同意；申请存在→PASS_FACT；U→NEEDS_MATERIAL，下一角色 T03-T05 原变更业务/科研归口。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "变更/延期已批准并生效",
          "requirement": "R021 F；变更/延期已批准并生效；T=声称指标/期限已合法改变；F=仅提出申请，尚无决定（不要求 M015）；U=批文权限/生效日未知；SRC-002/003/006；F010/F018/F038/F039/F042；M002/M014/M015/M018#原基线、正式批准；原 T03-T05/主管决定 ID、合同双方有权签署、覆盖节点和有效日对应；不得用 M014 替 M015，事件日需用对应版本；有权生效决定可核→PASS_FACT（只证变更已形成）；U→NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE，下一角色原变更业务 owner。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r022",
          "title": "撤回/停止请求权限和效力",
          "requirement": "R022 H；撤回/停止请求权限和效力；T=已提出撤回本预审；F=未提出；U=申请人资格、正式撤回规则/状态未核；SRC-001/003/013（目录不能证明程序）；F001/F006/F007/F040；M004/M016/M019#原案卷与可信动作；可信身份与可撤回对象/状态核对；只撤回本模板待处理请求，已送达/外部签发事实保留；撤回请求真实→PASS_FACT（不表示获准撤回）；U→POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION，下一角色校方实际受理人。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "复核/申诉事实请求",
          "requirement": "R023 I；复核/申诉事实请求；T=明确针对原 R/版本提出事实异议；F=没有请求；U=受理资格或原结果定位不明；SRC-004/005/013（无正式复核依据）；F006/F007/F035/F041；M004/M012/M017#旧结论/新证据；可信身份、原 ruleId/sourceVersion、异议理由、新证据定位，不能用本模板直接撤销正式对方验收；申请与指向可核→PASS_FACT；U→NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED，下一角色原决定归口/校方实际受理人。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "D/F/J",
          "requirement": "R024 D/F/J；邻接权威结论可引用性；T=复用已存在 T03/G06/G07 等正式记录；F=原业务尚无决定；U=原 owner 来源不可达/效力不明；SRC-001/002/003/012（012 仅技术）；F019/F042；M018#原业务、对象、决议/版本；按 DecisionID + owner + 案卷/合同/节点范围 + 源版本 + 签发效力只读引用；G50 仅可复用解析而非批准；引用可追溯→PASS_FACT（不重复决定）；U→SOURCE_UNAVAILABLE/NEEDS_HUMAN_DECISION，下一角色原业务 owner。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "学校/合同有权人工决定存在性",
          "requirement": "R025 D/J；学校/合同有权人工决定存在性；T=声称已有正式有权决定；F=尚未作出；U=决定主体/效力存疑；SRC-001/002/003/005；F043/F042；M021/M018#决定文书、状态与范围；T1/T2 原始编号、签发时间、权限、适用节点与生效/撤销链核对；不是模型写出 APPROVED；文书存在与效力范围可核→PASS_FACT（引用原决定）；U→NEEDS_HUMAN_DECISION/SOURCE_UNAVAILABLE，下一角色真正有权决定机关。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "B–J",
          "requirement": "R026 B–J；冲突材料与主从版本；T=同对象出现两份无法同时成立的核心记录；F=尚无冲突证据；U=任一记录真伪/版本不明；SRC-004/005；F010/F020–F022/F029/F033；M002/M005/M006/M008/M011#原文与链；权威层级、签署权限、时间与覆盖节点逐点比较；不可按上传先后/OCR 置信度多数投票覆盖；T→CONFLICT（并列原文）；F→NOT_APPLICABLE；U→NEEDS_HUMAN_DECISION/UNREADABLE，下一角色负责人及科研/合同归口。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "B/D/J",
          "requirement": "R027 B/D/J；同成果跨项目或重复验收复用；T=同一成果 ID/哈希被多个项目/节点主张；F=无交叉主张；U=是否合同许可共用未知；SRC-004/005；F002/F013/F021/F022/F042；M001/M005/M006/M018#多项目来源链；比较真实协议/主管任务书约束、研究成果版本和签发范围；不能“同 hash 即违规”，也不能重复声明验收；可如实登记共用事实→PASS_FACT；U→NEEDS_HUMAN_DECISION，下一角色科研诚信/项目归口，不能自动做失信处分。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "特殊批次/跨制度时效",
          "requirement": "R028 A–J；特殊批次/跨制度时效；T=用户试图引用特定计划、2026-07 申报、学院内部归档或过期政策作为当前硬门槛；F=无需该特殊政策；U=通知附件/适用批次未核；SRC-002/006/007/009/010/016；F003/F019/F018/F046；M001/M002/M003#计划、通知和期限；核发布主体、适用项目类型、学院、办理事项、受理批次、生效/截止时点；外校 SRC-010 与历史 SRC-007 不作校本依据，SRC-016 的学院内归档 15 工作日不作合同交付义务；特殊适用事实核清→PASS_FACT（仅适用性）；U→POLICY_UNCONFIRMED；不适用→NOT_APPLICABLE，下一角色科发院/合同归口/特定学院合同联络员。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "邻接路由/无权决定边界",
          "requirement": "R029 A–J；邻接路由/无权决定边界；T=本案包含合同订立、结题、经费、采购、成果处分、争议或非科研合同请求；F=纯本 ID 履约证据事实；U=归口或权限边界不明；SRC-001/002/004/005/012；F003/F019/F042/F044；M001/M002/M018/M020#业务目的与原 owner；从申请目的、合同类别、权威决定 owner 和涉密属性分类；分离 T03-T02/03/05/06/07、G06/G07、T04/T07 与 G50 技术能力；需移交时记录事实并输出 NEEDS_HUMAN_DECISION/权威引用（非本模板批准）；F→NOT_APPLICABLE；U→POLICY_UNCONFIRMED，下一角色相应原业务 owner。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "metrics-and-edge-cases",
      "name": "量化履约、有效到达与特殊期限",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "r030",
          "title": "B/D/E",
          "requirement": "R030 B/D/E；量化履约指标实测证据的可比性；T=节点目标有明确量化口径且本阶段声称实测完成；F=无该指标、尚未到测量阶段或无完成主张；U=计量单位/条件/误差和采集权限不明；SRC-002/004/005/014；F013/F016/F017/F021/F022/F045；M003/M006/M009/M010/M022#条款、样本、原始数据与测试条件；同有效合同版和具体成果版本逐项核项目、单位、采样日期、样本、设备/方法、目标数与观察值；不能以 OCR 表述自动证明真实性或标准合格，保留数值差异、量测不确定度和真实数据源；有独立可追踪且口径一致的观测事实→PASS_FACT（仅“观测值与约定目标的数字关系可列明”）；证据缺→NEEDS_MATERIAL，数据冲突→CONFLICT；U→NEEDS_HUMAN_DECISION，下一角色项目组原始记录持有人、合同归口/技术专家。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "C/D/G",
          "requirement": "R031 C/D/G；合同认可的实际到达/有效交付事件；T=声称已按合同送达或期限以到达起算；F=仅登记待发、明确没有有效交付主张；U=合同指定渠道、到达状态/时间或有效通知规则不明；SRC-005/006/014/015；F018/F024–F026/F028/F046/F048；M002/M003/M007/M008/M023#渠道条款与双方原始事件；区分发送、投递、可证到达、对方签收和合同有效交付；将 F048 绑定原合同版、收件目的地、双方事件和时区；法律效力解释留人工，未生成签收意见不提前索取；原始事件与合同指定渠道的一致性可核→PASS_FACT（仅事件事实）；截图代替到达或多源矛盾→CONFLICT，证据缺→NEEDS_MATERIAL；U→NEEDS_HUMAN_DECISION/POLICY_UNCONFIRMED，下一角色相对方渠道管理员、合同/法务归口。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "以沉默/超期无异议主张默示验收的法效前置条件",
          "requirement": "R032 D/G；以沉默/超期无异议主张默示验收的法效前置条件；T=申请人明确主张“无异议故通过”，且引用合同中的该条款；F=无该主张、合同明示不适用或尚未起算；U=条款真伪、完整渠道记录、适用法律或异议收取时间不明；SRC-005/006/014/015；F010/F017/F018/F035/F046–F048；M002/M003/M007/M008/M012/M023#约定、送达、异议窗口；逐字定位生效合同条款及起算事件，列明约定期间、节假日/时区和渠道覆盖；对异议记录只能查已验证时间段，不能从“未搜索到”证明无异议。全证据具备仍仅可登记条件事实；条款与通知时间链存在→PASS_FACT（不得写验收通过），法效/期限解释和否定性事实证明不足→NEEDS_HUMAN_DECISION，源故障→SOURCE_UNAVAILABLE，已见有效异议与“无异议”主张矛盾→CONFLICT；下一角色合同相对方有权验收主体及校方法务。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "分批成果验收范围是否可汇总为整个节点",
          "requirement": "R033 D/J；分批成果验收范围是否可汇总为整个节点；T=一个节点存在多批/部分签收验收且申请方声称整体完成；F=仅单批事实检查且无总完成主张；U=多批成果映射、数量单位或验收覆盖范围不明；SRC-002/004/005/014；F013/F016/F020–F023/F029/F033/F045；M003/M005/M006/M008/M011/M022#各批索引与有权意见；构造同一版本合同下“约定目标→交付行→签收行→验收意见行”的覆盖矩阵；重叠项只计一次，分批有不同单位/技术阶段不得硬合计；保留未覆盖项与保留意见；矩阵逐格证据完整→PASS_FACT（只证覆盖矩阵，不授予最终履约决定）；范围相斥→CONFLICT，映射缺→NEEDS_MATERIAL，U→NEEDS_HUMAN_DECISION；下一角色负责人、相对方验收主体和 T03-T07 原结题 owner。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "签收、验收文书与交付版本的反常时序",
          "requirement": "R034 D/G；签收、验收文书与交付版本的反常时序；T=一份文书被引用为针对某批成果的已签收/验收；F=不存在该引用或仍待未来文书；U=原签署时间/补记性质/版本签发历史不明；SRC-004/005/014；F022/F024/F028/F031/F033/F048；M006/M007/M008/M011/M023#文件哈希、签发记录与通知线；比对验收意见实际指向的成果版本、签署时刻、对应批次是否已经形成与送达；遇“验收早于成果形成”“回执指向另一版”保留原文并排查补记/预验收等合法例外，不自动推定伪造；无反常且关联可核→PASS_FACT（只证时间序可核）；不可同时成立→CONFLICT，U→NEEDS_HUMAN_DECISION/UNREADABLE；下一角色相对方文书签发人、校方合同/科研归口。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "intake-gate",
      "name": "材料登记、适用范围与安全门禁",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "fact-review",
      "workflowOwner": "local"
    },
    {
      "id": "fact-review",
      "name": "项目事实、材料版本与证据覆盖核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "intake-gate",
      "nextStageId": "authorized-review",
      "workflowOwner": "local"
    },
    {
      "id": "authorized-review",
      "name": "有权人员人工复核与待确认结论",
      "kind": "manual-review",
      "executorRole": "teacher",
      "returnToStageId": "fact-review",
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
      "id": "follow-up-tasks",
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

export const r02Metadata: R02Metadata = {
  "templateId": "T03-T10",
  "name": "科研项目合同成果交付与履约目标核验",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T03-T10.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T03-T10.md",
  "sourceDocumentSha256": "7f9ad86a4e9ced81e1767472387a2b71f52b954f1ee792f625a6efc5969e226b",
  "sourceDocumentBytes": 145442,
  "sourceBlobSha": "d35b8097f30fef84434f3492f8afbcdb99082efb",
  "sourceBranch": "feat/v3-r02-template-library@150acfe761cb7ad0424a2ca009fd57f12dbfddfd",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "sourcePolicyStatus": "\"PARTIALLY_VERIFIED; HORIZONTAL_CONTRACT_PRIMARY_TEXT_PENDING; INDEPENDENT_APPROVAL_NOT_ESTABLISHED\"",
  "policyEvidenceStatus": "PARTIAL",
  "requiresPreUploadSecurityGate": true,
  "secureIntakeEnforcedByTemplateVersion": false,
  "requiredIntegrationGate": "共享 Main/文件导入路径必须在文件选择、落盘、OCR/解析及模型调用前核验保密属性与获准环境；未知/拒绝时不得数字化受理。该门禁属于集成 Owner 所有权，不在本批文件内。",
  "criteria": [
    {
      "sectionId": "contract-baseline",
      "criterionId": "r001",
      "sourceRuleId": "R001",
      "srcIds": [
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "contract-baseline",
      "criterionId": "r002",
      "sourceRuleId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-003"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "contract-baseline",
      "criterionId": "r003",
      "sourceRuleId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-013"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "contract-baseline",
      "criterionId": "r004",
      "sourceRuleId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "contract-baseline",
      "criterionId": "r005",
      "sourceRuleId": "R005",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "contract-baseline",
      "criterionId": "r006",
      "sourceRuleId": "R006",
      "srcIds": [
        "SRC-008",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "contract-baseline",
      "criterionId": "r007",
      "sourceRuleId": "R007",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "contract-baseline",
      "criterionId": "r008",
      "sourceRuleId": "R008",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "delivery-acceptance",
      "criterionId": "r009",
      "sourceRuleId": "R009",
      "srcIds": [
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "delivery-acceptance",
      "criterionId": "r010",
      "sourceRuleId": "R010",
      "srcIds": [
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "delivery-acceptance",
      "criterionId": "r011",
      "sourceRuleId": "R011",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "delivery-acceptance",
      "criterionId": "r012",
      "sourceRuleId": "R012",
      "srcIds": [
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "delivery-acceptance",
      "criterionId": "r013",
      "sourceRuleId": "R013",
      "srcIds": [
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "delivery-acceptance",
      "criterionId": "r014",
      "sourceRuleId": "R014",
      "srcIds": [
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "delivery-acceptance",
      "criterionId": "r015",
      "sourceRuleId": "R015",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "delivery-acceptance",
      "criterionId": "r016",
      "sourceRuleId": "R016",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "delivery-acceptance",
      "criterionId": "r017",
      "sourceRuleId": "R017",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "delivery-acceptance",
      "criterionId": "r018",
      "sourceRuleId": "R018",
      "srcIds": [
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "delivery-acceptance",
      "criterionId": "r019",
      "sourceRuleId": "R019",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "change-and-decisions",
      "criterionId": "r020",
      "sourceRuleId": "R020",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "change-and-decisions",
      "criterionId": "r021",
      "sourceRuleId": "R021",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "change-and-decisions",
      "criterionId": "r022",
      "sourceRuleId": "R022",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-013"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "change-and-decisions",
      "criterionId": "r023",
      "sourceRuleId": "R023",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "change-and-decisions",
      "criterionId": "r024",
      "sourceRuleId": "R024",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "change-and-decisions",
      "criterionId": "r025",
      "sourceRuleId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "change-and-decisions",
      "criterionId": "r026",
      "sourceRuleId": "R026",
      "srcIds": [
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "change-and-decisions",
      "criterionId": "r027",
      "sourceRuleId": "R027",
      "srcIds": [
        "SRC-004",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "change-and-decisions",
      "criterionId": "r028",
      "sourceRuleId": "R028",
      "srcIds": [
        "SRC-002",
        "SRC-006",
        "SRC-007",
        "SRC-009",
        "SRC-010",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "change-and-decisions",
      "criterionId": "r029",
      "sourceRuleId": "R029",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "metrics-and-edge-cases",
      "criterionId": "r030",
      "sourceRuleId": "R030",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "metrics-and-edge-cases",
      "criterionId": "r031",
      "sourceRuleId": "R031",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-014",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "metrics-and-edge-cases",
      "criterionId": "r032",
      "sourceRuleId": "R032",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-014",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "metrics-and-edge-cases",
      "criterionId": "r033",
      "sourceRuleId": "R033",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "metrics-and-edge-cases",
      "criterionId": "r034",
      "sourceRuleId": "R034",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-014"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    }
  ]
}

export default templateVersion
