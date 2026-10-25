import type { TemplateVersion } from '@profer/shared'

type R02EvidenceStatus = 'VERIFIED' | 'PARTIAL' | 'UNCONFIRMED'
type R02CriterionMetadata = { sectionId: string; criterionId: string; sourceRuleId: string; srcIds: string[]; evidenceStatus: R02EvidenceStatus; note: string }
type R02Metadata = { templateId: string; name: string; sourceDocumentPath: string; sourceOriginalPath: string; sourceDocumentSha256: string; sourceDocumentBytes: number; sourceBlobSha: string; sourceBranch: string; officialSchoolTemplate: false; researchStatus: string; sourcePolicyStatus: string; policyEvidenceStatus: R02EvidenceStatus; requiresPreUploadSecurityGate: true; secureIntakeEnforcedByTemplateVersion: false; requiredIntegrationGate: string; criteria: R02CriterionMetadata[] }

export const templateVersion: TemplateVersion = {
  "templateId": "T03-T06",
  "version": 1,
  "schemaVersion": 2,
  "name": "科研项目年度进度与中期检查审核",
  "description": "本地研究模板 · 非校方正式模板。用于科研项目年度进度与中期检查审核的事实与证据核对；政策证据状态为 PARTIAL，未经有权人员确认不得形成正式决定。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本模板由研究原件 docs/design/review-agent/business-templates/R02/research-original/T03-T06.md 转换；非成都理工大学校方正式模板，不代表学校授权或正式政策。研究依据可支持事实核验和材料对照，但校本授权、当期批次表单及具体项目适用条件并未全部核实。任何不确定政策均人工复核。 SRC 是研究来源索引，不是案卷材料 SourceRef。",
  "objectType": "project",
  "displayName": {
    "template": "科研项目年度进度与中期检查审核 · 本地研究核验"
  },
  "fields": [
    {
      "key": "f001",
      "label": "资助渠道",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F001；F001 资助渠道；枚举／Project；T；资助批复与科研管理备案；M001、M004；P1；SU；无法路由则 PU"
    },
    {
      "key": "f002",
      "label": "专项类别/年度批次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F002；F002 专项类别/年度批次；字符串组合／Project；T；批次清单、任务书、资助系统；M001、M002、M004；P1；PU；不能用金额推断类别"
    },
    {
      "key": "f003",
      "label": "正式项目编号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F003；F003 正式项目编号；字符串／Project；T/B；批复、资助管理系统唯一号；M001；P1；SU；同号不同渠道 CN"
    },
    {
      "key": "f004",
      "label": "项目—课题—专题父子链",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F004；F004 项目—课题—专题父子链；关联 ID／Project；B；批准任务书与分工；M001、M002、M013；P1；NM/SU；不能凭文件标题确定主体"
    },
    {
      "key": "f005",
      "label": "学校承担地位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F005；F005 学校承担地位；枚举／Project；T/B；项目任务书/参与协议/批准记录；M001、M002、M013；P1；HC；牵头与参与矛盾 CN"
    },
    {
      "key": "f006",
      "label": "在研/变更/结题状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F006；F006 在研/变更/结题状态；枚举＋时间／Project；T；资助方项目台账、备案历史；M001、M003；P1；SU；不能根据预计结题日认定已结题"
    },
    {
      "key": "f007",
      "label": "负责人可信主体 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F007；F007 负责人可信主体 ID；受信任主体键／Project；B/S；正式任命/批复和后台可信身份；M001、M003、M005；P2；HC；表单姓名不作认证"
    },
    {
      "key": "f008",
      "label": "承担单位与归口部门",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F008；F008 承担单位与归口部门；机构 ID／Project；B/S；批复/单位备案/资助系统；M001、M002、M013；P1；CN/HC；不得推定学院代审权限"
    },
    {
      "key": "f009",
      "label": "代办人及授权范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F009；F009 代办人及授权范围；主体键＋授权范围／ReviewEvent；S（仅代理）；主进程认证、组织方授权、有效委托书；M005、M014；P2；HC；无授权时禁止签发与代替 PI"
    },
    {
      "key": "f010",
      "label": "核准计划基线版次/哈希",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F010；F010 核准计划基线版次/哈希；版本引用／PlanBaseline；B/D；有权签发任务书、批准计划；M002、M003；P1；SU/NM；未批草案不能作为基线"
    },
    {
      "key": "f011",
      "label": "核准任务指标/节点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F011；F011 核准任务指标/节点；结构化清单／PlanBaseline；B/D/E；生效计划或任务合同条目；M002；P1；NM/SU；不得自造硬指标"
    },
    {
      "key": "f012",
      "label": "已批准变更引用及生效日",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F012；F012 已批准变更引用及生效日；列表／PlanBaseline；B/D（有变化）；主管组织方正式批准变更；M003；P1/P2；没有变更时 NOT_APPLICABLE；声称变更但无批准 NM/HC"
    },
    {
      "key": "f013",
      "label": "本次报告覆盖周期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F013；F013 本次报告覆盖周期；起止日期／ReportingObligation；T/D；当期通知、资助系统报告节点；M004、M006；P1；PU；项目自然年度不必然等于报告周期"
    },
    {
      "key": "f014",
      "label": "报告类型/检查方式",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F014；F014 报告类型/检查方式；枚举／ReportingObligation；T；当期通知及项目任务安排；M004、M017；P1；PU；年度、自查、专家中期不能混同"
    },
    {
      "key": "f015",
      "label": "触发通知编号/期限/批次序号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F015；F015 触发通知编号/期限/批次序号；来源键＋日期／ReportingObligation；T/S；官网通知、系统任务、当期清单；M004；P0/P1；PU；没有依据不自动计逾期"
    },
    {
      "key": "f016",
      "label": "当前进展报告版次/哈希",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F016；F016 当前进展报告版次/哈希；版本键／ReportRevision；D/S/X；官方系统报表或被锁定的负责人工作版；M006、M016；P1/P2；NM（确有提交义务）；读不出则 UNREADABLE"
    },
    {
      "key": "f017",
      "label": "重要研究进展与量化描述",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F017；F017 重要研究进展与量化描述；文本＋引用／ReportRevision；D/S；负责人在官方报告录入内容；M006、M007；P1/P2；NM；内容质量只转 HC，不自动评级"
    },
    {
      "key": "f018",
      "label": "存在问题/处置/偏离原因",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F018；F018 存在问题/处置/偏离原因；文本／ReportRevision；D/S；官方进展报告相应栏目、说明附件；M006、M010；P1/P2；该栏目必需时 NM；是否“无问题”由负责人确认"
    },
    {
      "key": "f019",
      "label": "下阶段计划",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F019；F019 下阶段计划；文本＋节点关联／ReportRevision；D/S；负责人报告/阶段实施方案；M006；P1；依专项表单必填性判 NM/PU"
    },
    {
      "key": "f020",
      "label": "阶段成果唯一索引",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F020；F020 阶段成果唯一索引；项目成果键集合／EvidenceItem；D/S（申报成果时）；成果原文 DOI/专利号/校成果库；M008；P0/P1/P2；未主张成果可空；主张但不能定位 NM/SU"
    },
    {
      "key": "f021",
      "label": "成果作者及实际贡献",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F021；F021 成果作者及实际贡献；参与者列表／EvidenceItem；D/S（引用成果时）；论文/专利/数据署名、确认记录；M008；P2；署名不匹配 CN；学术贡献由 HC"
    },
    {
      "key": "f022",
      "label": "成果形成/发表/接受日期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F022；F022 成果形成/发表/接受日期；日期枚举／EvidenceItem；D/S（引用成果时）；出版/专利/成果原始时间戳；M008；P0/P1；无日期 NM；跨报告期但有特殊说明转 HC"
    },
    {
      "key": "f023",
      "label": "资助标注及项目归属",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F023；F023 资助标注及项目归属；号段/证据链接／EvidenceItem；D/S（引用成果时）；成果全文资助信息与项目号；M008；P0/P1；报告自述与原文矛盾 CN，不自动剔除或纠正"
    },
    {
      "key": "f024",
      "label": "成果—任务指标映射",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原件字段 F024；F024 成果—任务指标映射；多对多关联／EvidenceItem；D/E；负责人索引＋获批里程碑/独立佐证；M002、M007、M008；P1/P2；缺映射 NM；完成程度须 HC"
    },
    {
      "key": "f025",
      "label": "阶段经费执行概况引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F025；F025 阶段经费执行概况引用；汇总＋数据源键／EvidenceItem；D/E（通知要求时）；财务部门核准汇总/资助系统；M011；P2；条件未触发 NOT_APPLICABLE；已触发而无权威汇总 SU/NM"
    },
    {
      "key": "f026",
      "label": "校内报送/审核事件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F026；F026 校内报送/审核事件；来源事件 ID＋签发主体＋时间／ReviewEvent；S；可信科发院/项目管理系统审计；M014；P2；无外部回执不自报“校审已完成”；SU"
    },
    {
      "key": "f027",
      "label": "资助方正式接收/审核状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F027；F027 资助方正式接收/审核状态；枚举＋事件键／ReviewEvent；S/O；资助方信息系统/正式回执；M015；P1/P2；SU；本地提示“已上传”不得转正式受理"
    },
    {
      "key": "f028",
      "label": "退回原因与责任方",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F028；F028 退回原因与责任方；文本＋发送者键／ReviewEvent；X；外部系统退回通知/受理单位正式通知；M015；P1/P2；无退回事件则不适用；自述退回 CN/HC"
    },
    {
      "key": "f029",
      "label": "返修提交版次与前驱链",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F029；F029 返修提交版次与前驱链；版本引用／ReportRevision；X；官方返修版本、审计日志、内容哈希；M006、M016；P1/P2；不得覆盖旧版；链丢失 SU/HC"
    },
    {
      "key": "f030",
      "label": "中期评审安排/组织单位",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F030；F030 中期评审安排/组织单位；组织方＋形式＋日期／ReviewEvent；E（仅正式安排后）；有权组织方通知、项目清单/议程；M004、M017；P1/P2；尚未安排即 NOT_APPLICABLE，不提前缺件"
    },
    {
      "key": "f031",
      "label": "专家意见、签发成员及时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F031；F031 专家意见、签发成员及时间；结构化引用／ReviewEvent；O（评审后）；有权组织方保存的专家记录；M018；P2；无评审不适用；已评审但无官方记录 SU"
    },
    {
      "key": "f032",
      "label": "正式评估结论/分档",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F032；F032 正式评估结论/分档；枚举＋原文／OfficialDecision；O（正式形成后）；主管机关/正式受权单位决定；M019；P1/P2；仅专家投票不得充官方决定；HC/SU"
    },
    {
      "key": "f033",
      "label": "决定机关、签发者、效力与时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F033；F033 决定机关、签发者、效力与时间；源键＋机构＋时间／OfficialDecision；O；有权主管方盖章文书/系统终审；M019；P1/P2；签发权限未证 HC；旧结论与新决定冲突 CN"
    },
    {
      "key": "f034",
      "label": "整改/补证正式要求与期限",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F034；F034 整改/补证正式要求与期限；问题项＋时限／Rectification；Z（官方通知后）；正式整改通知/评审反馈；M020；P1/P2；没有通知不适用；期限不明 PU"
    },
    {
      "key": "f035",
      "label": "整改材料版次与问题项映射",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F035；F035 整改材料版次与问题项映射；版本键＋关联／Rectification；Z（整改进行中）；承担单位整改报告及原始佐证；M021；P1/P2；到当前应报节点却缺时 NM；效果交 HC"
    },
    {
      "key": "f036",
      "label": "项目保密与处理通道标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F036；F036 项目保密与处理通道标识；级别标记＋允许通道／Project；T，持续；保密部门登记、任务书限制条款；M002、M023；P3；未定级但疑涉密先隔离 HC；禁止原件在线流转"
    },
    {
      "key": "f037",
      "label": "适用政策版本与效力区间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F037；F037 适用政策版本与效力区间；SRC 键＋适用范围／ReportingObligation；T/B；官方政策正文、有效期、过渡文件；M004、SRC-001–SRC-015；P0；PU；旧规与新规不自动合并，SRC-010/014/015 只作技术目录"
    },
    {
      "key": "f038",
      "label": "证据归属/哈希/继承失效链",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F038；F038 证据归属/哈希/继承失效链；版本 DAG＋索引／EvidenceItem；所有阶段；案卷哈希审计、原始文件版本与权威系统链接；M001–M024；P1/P2；来源断链 SU；替换后旧事实重审，旧正式决定不自动撤销"
    },
    {
      "key": "f039",
      "label": "项目核准起止日与执行期限",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F039；F039 项目核准起止日与执行期限；日期/期限／Project；T/B；批准任务书及有效延期；M002、M003；P1；SU；不从今日日期反推“执行期过半”"
    },
    {
      "key": "f040",
      "label": "省级项目财政支持额及核定口径",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F040；F040 省级项目财政支持额及核定口径；金额币种＋口径／Project；T（仅省特定分流）；立项/财政批复与批次正式清单；M001、M004、M011；P2；缺口径 PU；正好 100 万且通知交叉须 HC"
    },
    {
      "key": "f041",
      "label": "中期意见实际送达/收到日",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F041；F041 中期意见实际送达/收到日；时点＋送达回执／ReviewEvent；O（省级中期意见到达后）；有权评估组织现场反馈/官方系统可核回执；M019、M024；P2；未发生 O 阶段 N/A；声称收到但无来源 SU；起算争议 HC"
    },
    {
      "key": "f042",
      "label": "复评整改申请时点与累计次数",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F042；F042 复评整改申请时点与累计次数；申请 ID＋时间＋整数／Rectification；Z（提出异议时）；项目牵头单位有效申请、官方系统受理历史；M024；P2；未申请 N/A；申请与官方版本不符 CN，历史次数不可核 SU"
    },
    {
      "key": "f043",
      "label": "复评申请受理/处理状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原件字段 F043；F043 复评申请受理/处理状态；状态枚举＋事件来源／ReviewEvent；Z（实际提出请求后）；省科技厅管理处室可信回执或适用渠道的正式受理机构；M024、M022；P1/P2；已申请未获得受理回执 SU/HC；不能推断已经批准整改或复评"
    }
  ],
  "materialSlots": [
    {
      "id": "m001",
      "name": "正式立项批复、资助系统项目台账",
      "purpose": "M001 正式立项批复、资助系统项目台账；资助方/科发院持有；证明项目号、渠道、资助类型、状态、负责人；当期基线必需；资助方只读可信项目记录或带来源的校内归档副本，不要求重复上传；F001–F008、F040；SRC-001、002、005、006、012；绑定项目号/渠道/签发日；系统不可达 SU，自述与批复不一致 CN，扫描不可读 UNREADABLE",
      "requiredElements": [
        "正式立项批复、资助系统项目台账",
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
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m002",
      "name": "已批准项目计划/任务书/任务合同及指标附件",
      "purpose": "M002 已批准项目计划/任务书/任务合同及指标附件；资助方、牵头单位/科发院持有；为进展及里程碑核对提供正式基线；当期基线必需；上游有权档案中的有效计划记录及版本链接；可核签原件副本；F002、F004、F005、F008、F010、F011、F024、F036、F039；SRC-001、005、006、008；锁签发方、有效日和哈希；无有效版本 SU/NM，疑涉密转受控通道，读取失败 UNREADABLE",
      "requiredElements": [
        "已批准项目计划/任务书/任务合同及指标附件",
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
      "name": "正式计划/人员/延期等批准变更",
      "purpose": "M003 正式计划/人员/延期等批准变更；资助方或主管归口持有；仅证明已经获批的调整和生效时间；条件必需（声称有变更时）；受信任变更记录、批准文号；个人变更说明不构成替代；F006、F007、F010、F012、F039；SRC-001、005、006；版本链指向 M002；未改不适用；主张已改但无决定 NM/HC；版本相斥 CN",
      "requiredElements": [
        "正式计划/人员/延期等批准变更",
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
      "name": "当年度填报通知/名单/检查批次与专门政策",
      "purpose": "M004 当年度填报通知/名单/检查批次与专门政策；组织方、科发院持有；核定本期是否触发、截止、表单类别与检查主体；当期路由必需；原单位官网/正式系统任务通知/审核可验证电子公文；无需项目负责人上传网页截图；F001、F002、F013–F015、F030、F037、F040；SRC-002、004、007、008、012；源机构+年度+附件名单序号+时间戳；附件缺失标 PU/SU，政策原站失联 SU，不可读 UNREADABLE",
      "requiredElements": [
        "当年度填报通知/名单/检查批次与专门政策",
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
      "name": "代理授权/身份与项目责任人关联记录",
      "purpose": "M005 代理授权/身份与项目责任人关联记录；后端认证/组织方持有；只在授权秘书、课题协作员代办时证明代理范围；条件必需；可信 SSO/人员管理与项目授权关系，若系统合法支持；否则正式书面授权人工核定；F007、F009；SRC-001、002；最小化身份字段、权限到期日；无授权 HC，证件 OCR 不冒充认证，过期 CN",
      "requiredElements": [
        "代理授权/身份与项目责任人关联记录",
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
      "name": "当期正式进展报告或锁定草稿",
      "purpose": "M006 当期正式进展报告或锁定草稿；负责人、基金 ISIS/专用项目系统持有；研究进展、问题、阶段计划、成果引用；确认应报后当期必需；对应官方系统报告版次；离线工作版仅用于预核，不等于正式报送；F013、F016–F019、F029；SRC-002、004、005、006、007；绑定项目+年度+系统报表 ID+哈希；未提交区分草稿，确需提交且无报告 NM，页缺失 UNREADABLE",
      "requiredElements": [
        "当期正式进展报告或锁定草稿",
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
      "name": "技术进展原始佐证/指标测评材料",
      "purpose": "M007 技术进展原始佐证/指标测评材料；负责人、实验平台/牵头方持有；为报告所声称已完成里程碑提供证据；条件必需（指标或通知要求时）；可信实验/第三方测评原始记录、可核成果报告引用；可只报索引；F017、F024；SRC-001、006、007、012；绑定每个指标、版本、采集人；未主张不强索全部实验资料；主张却无可核证据 NM/HC，涉密隔离",
      "requiredElements": [
        "技术进展原始佐证/指标测评材料",
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
      "name": "阶段成果原文、DOI/专利号/成果库记录",
      "purpose": "M008 阶段成果原文、DOI/专利号/成果库记录；成果来源系统、作者持有；校验形成时间、贡献、成果归属与基金资助标注；条件必需（报告列了成果时）；出版商/专利登记/校成果系统的可信记录，公开成果优先链接，不强制重复上传 PDF；F020–F024；SRC-002、005、007；成果 ID+项目号+发表版/接受版；难辨归属 CN/HC，不可读 UNREADABLE；不得把跨年度自动视为造假",
      "requiredElements": [
        "阶段成果原文、DOI/专利号/成果库记录",
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
      "name": "图表/公式等报告附录与正文索引",
      "purpose": "M009 图表/公式等报告附录与正文索引；负责人、报告系统持有；2025 国自然通知明确图公式放附件并在正文索引；条件必需（该批次使用图公式时）；同一报告的官方附件/系统内可解析索引；F016、F017、F038；SRC-002；与 M006 相同报告版；引用失链 NM/CN，图片公式不能读取 UNREADABLE",
      "requiredElements": [
        "图表/公式等报告附录与正文索引",
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
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "m010",
      "name": "问题、原因和拟采取措施的附加说明",
      "purpose": "M010 问题、原因和拟采取措施的附加说明；负责人持有；补足特定渠道要求的偏离及原因；条件必需（报告正文无法覆盖，或上级要求时）；M006 正文相应栏可完全替代；不额外逼交独立说明纸；F018；SRC-002、007、012；与当前 M006 同期同项目；要求时缺 NM，自述“已获批准”须对照 M003",
      "requiredElements": [
        "问题、原因和拟采取措施的附加说明",
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
      "name": "财务部门核准的阶段经费执行汇总/资金到位表",
      "purpose": "M011 财务部门核准的阶段经费执行汇总/资金到位表；财务处/资助系统持有；中期检查要求的汇总事实，非票据核销；条件必需（当期规定明确要求时）；财务已核汇总或有权系统只读数据，经 G07/财务部门决定直接引用；F025、F040；SRC-001、008、012；限权，仅留汇总及凭证索引；无权威数据 SU/NM，账务争议转财务，禁止处理日常报销",
      "requiredElements": [
        "财务部门核准的阶段经费执行汇总/资金到位表",
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
      "name": "省级 2026 指定类别自查报告（附件2/3/4）及表内清单",
      "purpose": "M012 省级 2026 指定类别自查报告（附件2/3/4）及表内清单；项目承担单位持有；在 D1/D2 中按省厅项目类型提交自查，条件必需（已列批次且启动自查）；官方四川省科技管理信息系统同版电子表或原承办方收件，须核对应附件模板；F013–F019、F024、F025；SRC-008、012；类型/批次/纸电同版一致，附件原件待取得；错模板 CN/PU，确需却缺 NM，读不了 UNREADABLE",
      "requiredElements": [
        "省级 2026 指定类别自查报告（附件2/3/4）及表内清单",
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
      "name": "参与课题/专题分工、履约汇总或牵头方请求",
      "purpose": "M013 参与课题/专题分工、履约汇总或牵头方请求；牵头单位及 CDUT 责任组持有；界定本校只是部分报告还是牵头整项目；条件必需（F 情形）；获批合作分工/任务书子附件、牵头方正式报送通知；F004、F005、F008；SRC-001、006；子任务 ID 与主项目 ID 联动；没记录 SU/HC，不得拿本校子任务签章代替主项目意见",
      "requiredElements": [
        "参与课题/专题分工、履约汇总或牵头方请求",
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
      "name": "可信校内预核、送审、签发操作记录",
      "purpose": "M014 可信校内预核、送审、签发操作记录；科发院/单位后台持有；证明校内谁在何时以何权限做了哪一步；后续产生（真实操作发生后）；校内受权后台审计事件，若无可信系统则受权公文签收记录；F009、F026；SRC-001、002；身份后台鉴真，和本地工作版分离；无授权人记录 SU/HC，前端“已审”截图不可替代",
      "requiredElements": [
        "可信校内预核、送审、签发操作记录",
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
      "name": "上级系统受理/审核状态/退回原因和回执",
      "purpose": "M015 上级系统受理/审核状态/退回原因和回执；基金委/专业机构/省系统持有；证实已报、退回修改或官方阶段状态；后续产生（外部实际受理后）；可信官方系统回执、签章通知、核验原网页状态；F027、F028；SRC-002、004、006、012；记录官方受理 ID+时间+渠道+状态；申请人文字不算，断联 SU，冲突 CN",
      "requiredElements": [
        "上级系统受理/审核状态/退回原因和回执",
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
      "name": "返修报告 v2+及差异对照",
      "purpose": "M016 返修报告 v2+及差异对照；负责人/报告系统持有；仅在已有退回或主动生成新工作版时证明修订；条件必需（X 情形）；官方报告新版和系统修改记录；本地审计差异只能作草稿辅助；F016、F029、F038；SRC-002、004；必带 supersedes_version，原 v1 不删除；缺版本链 SU/CN，实际需补正却缺 NM",
      "requiredElements": [
        "返修报告 v2+及差异对照",
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
      "name": "正式中期检查安排、会议/现场通知及评审组织信息",
      "purpose": "M017 正式中期检查安排、会议/现场通知及评审组织信息；有权组织方持有；核定是否进入 E 阶段、由谁评审；后续产生/条件必需（正式组织安排后）；组织方签发通知/系统任务或本项目在官方附件名单中；F014、F030；SRC-003、006、007、012；明确所涉项目/检查组；学校新闻不可替代名单；尚未组织不作缺件，安排不可核 SU",
      "requiredElements": [
        "正式中期检查安排、会议/现场通知及评审组织信息",
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
      "name": "专家真实评阅意见及会议记录",
      "purpose": "M018 专家真实评阅意见及会议记录；正式组织方持有；保存专业评阅过程事实，后续产生（专家实际评阅后）；机构归档带签发人的专家意见/系统评阅记录；私人 PPT 不算；F031；SRC-003、007、008、012；专家、权限、会议 ID 与项目绑定；缺正式记录 SU，不得以 AI 生成；意见不等于行政决定",
      "requiredElements": [
        "专家真实评阅意见及会议记录",
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
      "name": "有权组织方正式审核/评估结论与处置文件",
      "purpose": "M019 有权组织方正式审核/评估结论与处置文件；基金委、专业机构、省厅或获授权校方持有；证明可公开声称的有效结果；后续产生（O 阶段）；官方终审状态、正式决定文号/签章电子公文，可核原件；F032、F033；SRC-002、004、005、006、008、012；绑定批准主体、项目、决定时间与效力范围；无官方记录 SU/HC，不得用 PASS_FACT 填“通过”",
      "requiredElements": [
        "有权组织方正式审核/评估结论与处置文件",
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
      "name": "整改或补正正式通知、问题编号、截止要求",
      "purpose": "M020 整改或补正正式通知、问题编号、截止要求；组织方持有；形成整改义务起点；后续产生（组织方确认问题之后）；上游正式书面反馈/可信信息系统通知；F034；SRC-008、012；决定 ID→问题 ID→要求；未知期限 PU，未发通知不适用，不能自造整改天数",
      "requiredElements": [
        "整改或补正正式通知、问题编号、截止要求",
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
      "name": "按问题项提交的整改报告和新增证明",
      "purpose": "M021 按问题项提交的整改报告和新增证明；项目负责人/承担单位持有；说明哪些问题已响应与哪些材料更新；条件必需（已正式要求整改且到本阶段）；对应官方整改栏/受理版及有效新增佐证；F035、F038；SRC-008、012；每个整改项指向 M020，保留旧版及新证；逾节点缺 NM，完成实质须 HC",
      "requiredElements": [
        "按问题项提交的整改报告和新增证明",
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
      "name": "再评估/复核正式结果、申复核受理及反馈",
      "purpose": "M022 再评估/复核正式结果、申复核受理及反馈；组织方持有；仅记录有权机关复核结果；后续产生（渠道确有该程序且已形成后）；官网/正式系统复核回执与决定；不能由申请人自行声明；F032、F033、F034；SRC-008、012；与 M019、M020 因果及结果范围绑定；无正式再评估不适用，制度不确定 PU",
      "requiredElements": [
        "再评估/复核正式结果、申复核受理及反馈",
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
      "name": "涉密标记、可用传递渠道及保密办接管回执",
      "purpose": "M023 涉密标记、可用传递渠道及保密办接管回执；受权保密部门持有；仅证明不能在普通系统处理与接管去向；条件必需（K 情形）；保密部门确认的非密元数据和线下工单号；不接受密件替代；F036、F038；SRC-001、004；仅存不涉密引用和受控编号；疑涉密时暂停处理 HC，文件不可读不尝试破解/上传",
      "requiredElements": [
        "涉密标记、可用传递渠道及保密办接管回执",
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
      "id": "m024",
      "name": "中期评估整改/二次评估申请及官方受理回执",
      "purpose": "M024 中期评估整改/二次评估申请及官方受理回执；项目牵头单位、四川省科技厅管理处室或对应有权主体持有；仅在正式评估结果送达后，牵头方确实提出异议或整改申请时证实请求时点、次数、权限及是否受理；不是初次报送必需件；申请方可签发的正式请求与受理方官方状态必须双轨保存；可以用主管系统事件直接满足，截图只作线索；F041–F043、F034、F038；SRC-008 第11–12条、SRC-012；绑定项目、M019 原结果/反馈时间、申请人及受理流水；未请求 N/A，有申请无官方回执 SU/HC，无法读 UNREADABLE，超时仅提示不自动驳回",
      "requiredElements": [
        "中期评估整改/二次评估申请及官方受理回执",
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
      "id": "project-baseline",
      "name": "项目身份、义务与适用基线",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "r001",
          "title": "科研进度事项归口",
          "requirement": "R001 科研进度事项归口；T；T=请求核年度/中期科研进度；F=明确为教学/学生训练或一般合同→N/A 转邻接；U=项目归口不明→PU；SRC-001、002、006、010；F001、F002、F014；M001、M004；项目资助渠道/审核目的对照正式立项与 R02 固定范围；吻合 PASS_FACT，渠道不一致 CONFLICT；以项目原始批复 A0/A1；G50 SRC-010 仅技术去重，绝不放行；科发院科研管理归口/路由管理员。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r002",
          "title": "项目号、资助方及报告案身份",
          "requirement": "R002 项目号、资助方及报告案身份；T/B；T=有报送或调查事项；F=未创建案件→N/A；U=项目台账不可取→SU；SRC-001、005、006；F001、F003、F004、F038；M001、M002；同渠道项目号、批复单位、层级逐项匹配；相符 PASS_FACT，同名异项目/不同项目号 CONFLICT；实际应有批复但未取得 NM；有权批复 A0 优于封面 A2；不得以申请人姓名作主键；项目负责人补线索、科发院核台账。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r003",
          "title": "本期报告或中期义务是否存在",
          "requirement": "R003 本期报告或中期义务是否存在；T；T=通知/任务书具体项目与周期命中；F=有权清单或规则明确免除→N/A；U=名单、范围不明→PU；SRC-002、004、005、006、007、008、012、013；F002、F006、F013–F015、F037；M001、M002、M004；比项目类型（面上/重点/重大/专项/省重大）、期间、批准任务与官方当期任务，命中 PASS_FACT；只“搜不到”不可 N/A；SRC-013 的国自然重点中期由基金委组织，不把申报复审套到在研；省级具体清单仍待核；基金委或科发院相应归口、专业机构/省厅项目管理处室。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r004",
          "title": "政策生效、废止、业务与地域边界",
          "requirement": "R004 政策生效、废止、业务与地域边界；T；T=拟据某政策判断本案；F=只整理无规范比对的原始事实→N/A；U=过渡或真实适用范围不明→PU；SRC-001–015（SRC-009历史、SRC-010技术、SRC-011外校、SRC-014/015目录不能作政策）；F001、F002、F037；M002、M004；核签发机关、条号、现行期、项目渠道、2026四川省新旧衔接；范围一致 PASS_FACT，外校/旧规假充校规 CONFLICT；SRC-008 第37条已在省属机构全文核到，仍缺省厅签章原件与具体合同；对“真实执行”的适用不得推断；科发院制度Owner、主管资助机构。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r005",
          "title": "项目—课题—专题地位与承担范围",
          "requirement": "R005 项目—课题—专题地位与承担范围；B；T=学校参与或牵头的项目；F=无我校责任→N/A；U=层级链断裂→SU；SRC-001 第5–7条、006；F004、F005、F008；M001、M002、M013；按任务书父子键、组织方和学校承担分工比对；吻合 PASS_FACT，把参加方写牵头 CONFLICT；经批准分工 A0/A1 优于报告自填 A2；子任务只核本校范围；科发院重大项目办、牵头项目单位。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r006",
          "title": "备案项目责任人身份",
          "requirement": "R006 备案项目责任人身份；B/S；T=负责人提交/签承诺；F=本阶段没有本人操作→N/A；U=实名主体不可验证→HC；SRC-001、002、004；F003、F007、F008；M001、M003、M005；后端认证主体 ID 对比按时点生效的负责人/正式更替记录；匹配 PASS_FACT，不符 CONFLICT；A0/A1 与后台信任链；Renderer 教师字段、姓名、上传证件照不可信；科发院项目岗位、身份管理员。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r007",
          "title": "代理提交、核查和签发权",
          "requirement": "R007 代理提交、核查和签发权；S/X/Z；T=实际由代理人操作；F=负责人本人操作→N/A；U=授权有效性不明→HC；SRC-001、002；F007、F009、F026；M005、M014；比对本人身份、授权范围、到期日、操作种类和项目；均允许 PASS_FACT，越权 CONFLICT，委托件当前必需缺 NM；授权 A0/A1 不能由签章图片推定；院系协助不必然享有外部报送权；科发院授权岗、可信后台管理员。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r008",
          "title": "项目在研与检查时点",
          "requirement": "R008 项目在研与检查时点；T/B；T=当期义务已确认；F=可信记录明确已完结且无存续义务→N/A；U=真实状态断联→SU；SRC-001、005–007；F006、F013、F039；M001、M002、M003；取状态历史与报告周期交集；相符 PASS_FACT，状态记录相斥为 CONFLICT，若仅结题年度义务规定未知则本独立检查 POLICY_UNCONFIRMED；不以计划预计结束日替代正式结题；延期有自身批准生效日；资助系统管理员/科发院。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r009",
          "title": "生效任务计划和指标基线",
          "requirement": "R009 生效任务计划和指标基线；B/D；T=需核里程碑或任务书进度；F=当前仅核路由→N/A；U=批准基线版本未明→SU；SRC-001、005、006；F010、F011、F024、F039；M002、M003；逐指标锁有效任务书版本、哈希与报告期；吻合 PASS_FACT，以申请草稿改指标 CONFLICT，现需基线却缺 NM；原批准版及随后正式调整 A0/A1 优于自拟方案 A2；项目归口、项目负责人补档。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r010",
          "title": "计划/负责人/期限调整是否真正批准",
          "requirement": "R010 计划/负责人/期限调整是否真正批准；B/D；T=报告声称调整或有 M003；F=无调整主张→N/A；U=审批状态未核→HC；SRC-001 第10–11条、005 第26–30条、006；F007、F010–F012、F039；M002、M003、M006；比对变更签发者、生效日、所改指标与当前基线；有效一致 PASS_FACT，仅有申请无批准 NEEDS_HUMAN_DECISION 并外部路由，矛盾 CONFLICT；批准 A0/A1，未批变更说明 A2；不得本模板批准延期/终止；科发院/相应 T03 变更归口、资助方。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r011",
          "title": "本期期间、截止与版本绑定",
          "requirement": "R011 本期期间、截止与版本绑定；T/S；T=有明确报告义务；F=权威确认本期不适用→N/A；U=起算或附件名单不详→PU；SRC-002、004、007、012；F013–F015、F016、F039；M002、M004、M006；当期名单周期、系统节点、报表实际区间逐项核；匹配 PASS_FACT，日期不符 CONFLICT；逾期只作事实提示不自动拒绝；校方 2026-01-05、基金委 2026-01-15 限 2025 国自然批次；其他年份不继承；项目负责人、科发院负责相应批次人员。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "evidence-check",
      "name": "报告、成果与材料事实核验",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "r012",
          "title": "应报主报告存在及归属版本",
          "requirement": "R012 应报主报告存在及归属版本；D/S；T=本期需进展报告；F=当前不要求独立报告→N/A；U=本期表单义务未证→PU；SRC-002、004、005、007、012；F003、F013、F016、F038；M004、M006、M012；查项目号、周期、受理系统/工作版号、页数/哈希；齐且相符 PASS_FACT，已确定应报而缺 NM，有件无法抽取 UNREADABLE；工作版 A2≠资助方受理 A0；省级自查 M012 由 R019 专门核，避免重复强制；负责人补报告、材料处理员。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r013",
          "title": "报告研究进展、问题与后续安排栏目",
          "requirement": "R013 报告研究进展、问题与后续安排栏目；D/S；T=对应正式表单要求这些栏目；F=明确不要求某栏目→N/A；U=模板未读到→PU；SRC-002、007、012；F017–F019；M006、M010、M012；逐栏目查原文是否存在、是否引用对应报告期；可读且齐 PASS_FACT，必需栏空缺 NM，事实不一致 CONFLICT，内容质量 HC 另交专家；2025 国自然以 SRC-002 提纲为例；M010 可由报告正文合法替代，无单独纸件要求；负责人补栏、科发院或组织方形式核查。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r014",
          "title": "国自然正文与附图/公式索引",
          "requirement": "R014 国自然正文与附图/公式索引；D/S；T=适用 SRC-002 批次且正文引图公式；F=无此引用/其他专项未规定→N/A；U=正文索引或附件版本不可识别→UNREADABLE；SRC-002；F016、F017、F038；M006、M009；逐条正文页码/图表号对照同版本附件，吻合 PASS_FACT，引用缺附录 NM、同名不同版 CONFLICT；仅 2025 国自然校通知；不能推成全渠道图表格式；负责人/材料补件岗位。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r015",
          "title": "所列成果身份与时间",
          "requirement": "R015 所列成果身份与时间；D/S；T=报告声明阶段成果；F=没有声明该成果→N/A；U=数据库断联→SU；SRC-002、005、007；F020–F022；M006、M008；DOI/专利号/原始发表时间与报告成果列表和周期对应；一致 PASS_FACT，无法定位原件 NM/SU，跨期且解释矛盾 CONFLICT；2025 国自然“2025 成果”为该通知范围，延期收录例外需人工读说明；不推及其他资助类型；负责人补出处、科发院成果岗。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r016",
          "title": "资助标注、参与贡献及项目归属",
          "requirement": "R016 资助标注、参与贡献及项目归属；D/S；T=以成果证明该项目进度；F=没有成果主张→N/A；U=贡献或多项目归属无法核→HC；SRC-002、005、007；F003、F020–F024；M001、M006、M008；对照成果原文资助号、署名/贡献、有效项目号；一致 PASS_FACT，互相不一致 CONFLICT；权属争议另转 G06；DOI/专利证据 A0/A1 对自述 A2；多个项目共用成果不自动判违规；项目负责人、科发院成果岗/G06。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r017",
          "title": "任务里程碑与阶段佐证映射",
          "requirement": "R017 任务里程碑与阶段佐证映射；D/E；T=任务书要求检查阶段目标；F=仅办理提交回执不评完成→N/A；U=批准基线来源失联→SU；指标制度未明→PU；SRC-001、005–007、012；F010、F011、F017、F024；M002、M006、M007、M008；建指标→进展段落→原始佐证对应链；链完备 PASS_FACT 仅意为证据对应，缺现需佐证 NM，数据不一致 CONFLICT；另对专业完成度的单独 target 返回 HC；A0 任务书、A1 检测记录、A2 负责人说明；材料可核不代表科学效果优劣；负责人补证、正式专家/主管方裁量。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r018",
          "title": "财务阶段概况引用（不核报销）",
          "requirement": "R018 财务阶段概况引用（不核报销）；D/E；T=本批明确要求资金到位/执行汇总；F=未要求财务汇总→N/A；U=该类别是否必需未核→PU；SRC-001、008、012；F025、F040；M004、M011、M012；受权财务汇总项目号、期间与报告附表金额核同源；一致 PASS_FACT，应有无件 NM，核定数冲突 CONFLICT；A0/A1 财务专业源优于票据 OCR；不判断发票真伪或资金合规；财务处/G07 归口人员；本案仅收权威引用。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r019",
          "title": "四川 2026 农资环自查范围/表单",
          "requirement": "R019 四川 2026 农资环自查范围/表单；T/D；T=项目列入 SRC-012 2026 特定项目清单；F=有权名单明确不在内→N/A；U=附件1–4未取得→PU；SRC-008、012；F002、F014、F015、F016、F037；M001、M004、M012；按项目类别选择相应附件 2/3/4，再核自查报告项目号与表单版；已核一致 PASS_FACT，确定需要后无报告 NM，模板不符 CONFLICT；省厅原站/项目清单/表单尚缺，不能仅凭二手转载冻结；A0/A1；省厅/推荐单位、科发院省级科研岗。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r020",
          "title": "四川 2026 检查与省厅评估组织分流",
          "requirement": "R020 四川 2026 检查与省厅评估组织分流；T/E；T=属于已通知的省级中期项目；F=其他渠道→N/A；U=分派单位/金额口径未知→PU；SRC-008、012；F014、F015、F030、F039、F040；M001、M004、M011、M017；先按附件1项目序号及承办单位核查，再比年限/财政额；一致 PASS_FACT；恰好 100 万交叉或自主验收权未明 HC；绝不单靠 >=100 万 自动选省厅；SRC-012 对等号两边均含的疑义待主管解释；省厅项目处室、推荐单位/校科研管理者。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r021",
          "title": "参与单位/子任务局部报告",
          "requirement": "R021 参与单位/子任务局部报告；B/S；T=学校仅为课题/专题/参与单位；F=牵头身份已确证→N/A；U=分工/牵头指令不明→SU；SRC-001 第6条、006；F004、F005、F008、F024；M002、M006、M013；对照批准分工与报送责任、局部指标/主项目标识；相符 PASS_FACT，误装整项目决定 CONFLICT；牵头方任务书 A0/A1，局部总结 A2；只核 CDUT 责任，不签项目级意见；参与课题负责人、牵头单位项目管理员。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "authority-events",
      "name": "送审、退回、中期评估与有权反馈",
      "order": 2,
      "required": true,
      "criteria": [
        {
          "id": "r022",
          "title": "中期评审安排和组织主体",
          "requirement": "R022 中期评审安排和组织主体；E；T=本项目有正式检查安排；F=只有年度报告或未排入检查→N/A；U=只有新闻或无本项目通知→PU；SRC-003、006、007、008、012、013；F014、F030；M004、M017；组织方权能、项目编号、检查节点、人员/形式与官方通知一致 PASS_FACT；冒认检查主体 CONFLICT；国自然重点项目 SRC-013 第28条并非面上普适中期；新闻 SRC-003 不证明具体项目被列入；科发院项目岗、基金委/专业机构/省厅正式组织方。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r023",
          "title": "学校内部预核/送审事件",
          "requirement": "R023 学校内部预核/送审事件；S；T=校内确实发生送审/确认；F=尚未送审→N/A；U=后台授权日志不可取→SU；SRC-001、002；F007、F009、F026；M005、M014；后台真实操作人、权限、项目/周期与时间戳核验；一致 PASS_FACT，伪造“校审通过” CONFLICT；A0/A1 校内授权审计记录；不能由用户截图创建组织签发事件；科发院校内归口审核人、可信系统管理员。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r024",
          "title": "上级接收/审核/退回状态",
          "requirement": "R024 上级接收/审核/退回状态；S/O；T=官方系统已有报送或处理事件；F=仅工作草稿无外部报送→N/A；U=上级系统不可达→SU；SRC-002、004、005、006；F016、F027、F028；M006、M015；系统事件号、项目号、报告版本、官方状态与时间核对；可追溯 PASS_FACT，本地显示和上级相斥 CONFLICT；国自然“基金委已审核”仅表示官方状态，不代表本地分析批准；A0/A1；科发院基金科/对应专业机构。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r025",
          "title": "退回原因到返修材料映射",
          "requirement": "R025 退回原因到返修材料映射；X；T=有正式退回 M015；F=无退回仅主动修草稿→N/A；U=官方退回与版本关系失联→SU；SRC-002、004；F016、F028、F029、F038；M006、M010、M015、M016；对每个退回问题标原版、修订版、对应补证和新提交状态；映射相符 PASS_FACT，应补而缺 NM，版次链错 CONFLICT；国自然退回可核，其他渠道期限未知 PU；原版不可覆盖、重报不等于终审；项目负责人/科发院原退回操作岗。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r026",
          "title": "未报草稿取消与重建",
          "requirement": "R026 未报草稿取消与重建；D/X；T=当前记录只有未提交草稿；F=已有正式受理→N/A 并交 R027；U=是否已报不明→SU；SRC-002（反向界定正式报送）、001；F003、F007、F016、F038；M001、M006、M015；校验草稿所有者与状态，锁定旧版、生成作废事件；符合则 PASS_FACT（仅本地工作版终结），身份冲突 CONFLICT；本地版本审计 A1；无资格将此动作称“学校同意撤回”；草稿所有人、可信案卷管理员。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r027",
          "title": "已报报告申请退回/更正",
          "requirement": "R027 已报报告申请退回/更正；X；T=有上级受理记录且提交者申请更正；F=未报草稿→N/A；U=该渠道能否撤回/更正未核→PU；SRC-002、004、008；F007、F009、F027–F029；M005、M014、M015、M016；对申请人权限、原上级记录、官方同意退回/开放修改、后续版本核对；均证实 PASS_FACT，无正式同意只标 HC 待办；SRC-002 仅证国自然联系基金科退回；其他渠道不能照搬；旧已发决定不撤销；科发院基金与人才科/资助方受理机构。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r028",
          "title": "专家真实意见与正式处理分离",
          "requirement": "R028 专家真实意见与正式处理分离；O；T=评审确已开展；F=未评审或仅年度进展→N/A；U=意见原件不可取→SU；原件可取但签发权限争议→HC；SRC-003、006、007、008、012；F030、F031；M017、M018；意见记录关联会议、受聘专家、签署与对应项目，符合 PASS_FACT（只代表专家意见有迹可循）；冒签 CONFLICT；意见 A0/A1；AI 自动“优秀”与汇报 PPT 不构成意见，更不构成正式决定；正式组织方/专家秘书处、科发院归档岗。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r029",
          "title": "有权中期管理处置决定的签发与效力",
          "requirement": "R029 有权中期管理处置决定的签发与效力；O；T=声明本项目已有有权机构管理处置决定；F=尚未形成处置→N/A；U=签发权限不明→HC，原始决定失联→SU；SRC-006、008第13条、012、013；F003、F032、F033、F038；M001、M019；核管理处置的项目号、批准机关、集体决定与授权签发、签发时间、效力范围；真实可引 PASS_FACT，两个相反决定 CONFLICT；专家意见和评估分档由 R028 核实、送达由 R036 核；省第13条管理处置不是第11条专家当场反馈，也不是财务拨款决定；省厅/基金委/获授权组织方，科发院仅归档。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "follow-up-security",
      "name": "整改、版本、涉密与跨模板边界",
      "order": 3,
      "required": true,
      "criteria": [
        {
          "id": "r030",
          "title": "整改要求与时点是否来自有权事件",
          "requirement": "R030 整改要求与时点是否来自有权事件；O/Z；T=官方反馈/通知已具体提出整改义务；F=无此义务→N/A；U=规定/送达尚未核→PU，正式通知失联→SU；SRC-008 第11–13条、SRC-012具体批次；F032–F034、F041；M019、M020；比正式评估意见/整改通知 ID、问题号、权限、送达及期限，均可核 PASS_FACT；无正式要求不可自造督办；省级中期主动申请整改/二次评估另见 R036；不能拿省规第24条“结题验收60日整改”冒充本阶段；省厅有权项目管理处室/推荐单位、科研归口。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r031",
          "title": "整改报告逐问题响应",
          "requirement": "R031 整改报告逐问题响应；Z；T=已生效整改要求或 R036 证实合法复评整改请求进入材料提交阶段；F=无整改/复评义务→N/A；U=该阶段要求或可受理性未核→PU；SRC-008 第12条、SRC-012；F024、F034、F035、F038、F042、F043；M020、M021、M024；每项旧问题 ID→整改措施→新增证据和版本；对应完整 PASS_FACT（仅形式），现需提交却缺 NM，效果 HC；对省级中期，30日整改须以真实反馈/受理及主管解释确定起算；不拿结题验收时限套入；项目牵头单位与省厅正式评审组织方。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r032",
          "title": "二次评估/复核的正式反馈与历史关系",
          "requirement": "R032 二次评估/复核的正式反馈与历史关系；Z/O；T=有权机关确实已形成二次评估结论；F=未申请或尚未形成结果→N/A（仅此结果存在性）；U=已受理但原件失联→SU，是否有复评机制未证→PU；SRC-008 第12–13条、SRC-012；F032–F034、F041–F043；M019、M020、M022、M024；对比 M024 申请/受理、旧反馈 M019、新 M022 项目、签发者及效力时点，可证 PASS_FACT；互斥正式结论 CONFLICT；仅记录有权二次评估结果，不改旧决定或自动变更项目资金；四川省第28条项目撤销申诉30日属于另一对象，不能混作中期复评；省厅管理处室/决定机构、科发院归档。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r033",
          "title": "涉密和受限资料处理门禁",
          "requirement": "R033 涉密和受限资料处理门禁；T，贯穿；T=保密标记或合理涉密风险；F=合法核定非密→N/A（此保密转办项）；U=密级权限未明→HC 并隔离；SRC-001 第9条、004；F003、F036、F038；M002、M023；只比对合法非密标记和受控接管号；已交受权渠道 PASS_FACT 仅指转办完成，不得送普通 OCR；违规上传 CONFLICT；密件本体不成为一般系统 M 证据，P3 暂停；不能用“可读”判可外传；科发院保密责任岗/原资助方保密机构。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r034",
          "title": "材料版本替换与定向失效",
          "requirement": "R034 材料版本替换与定向失效；全部阶段；T=同案任一 M 的有效版次变化；F=无版本变化→N/A；U=来源版本链不可核→SU；SRC-001、002、005、012；F010、F016、F024、F029、F038；M002、M003、M006、M008、M009、M014–M016、M019；按 rule→F/M dependency 与 project/period/planVersion 计算受影响 R，旧事实检查标失效、新版重跑后 PASS_FACT（仅处理一致性）；错案覆盖 CONFLICT；保留所有旧哈希与 ReviewRun 引用；旧官方 M019 不因新上传而自动撤销；可信案卷所有者/负责人、受影响事实预核人。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "r035",
          "title": "跨 G50 与相邻 T/S 权威结论引用",
          "requirement": "R035 跨 G50 与相邻 T/S 权威结论引用；B/D/E；T=本案使用立项、伦理、财务、采购/合同领域事实；F=无需跨领域证据→N/A；U=原决定不可核→HC，目录冲突未定→PU；SRC-001、010、014、015（后3项仅技术范围，非政策）；F005、F012、F023–F025、F036、F037；M001–M003、M008、M011、M023；只读引用原权责方 decisionId + issuer + scope + version + sourceCaseId，证实同对象 PASS_FACT，跨权限冒认 CONFLICT；G06/G07/T04/T07 的决定绝不升级为科研中期 F032；R02 原件已读但 G50 全部源码规则未逐条审计；相邻模板 Owner、科发院及有权部门。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "r036",
          "title": "四川省中期异议整改申请与受理时效",
          "requirement": "R036 四川省中期异议整改申请与受理时效；O/Z；T=省级中期专家结果已送达且项目牵头单位拟申请一次整改复评；F=无该行为或其他项目渠道→N/A；U=规程本项目适用性未明→PU；反馈送达源断联→SU；申请人/受理权限有争议→HC；SRC-008 第11–12、37条、SRC-012；F003、F032、F041–F043；M004、M019、M024；比对收到日、牵头申请资格、申请时间/次数、官方受理流水；一致 PASS_FACT（只证申请/受理程序事实）；本阶段明确需要申请件而缺 NEEDS_MATERIAL，已有申请但权威回执失联 SOURCE_UNAVAILABLE；省2026第12条为反馈后10工作日内申请整改、限1次、30日内整改提交；30日起算、节假日与批次特殊安排人工核；不自动驳回逾期，不套用结题第24条60日整改或撤销第28条30日申诉；项目牵头单位、省厅项目管理处室/有权受理者。【安全门禁】若项目或材料疑涉密，必须在文件选择、落盘、解析和模型调用前由可信安全门禁确认获准处理环境；未知/拒绝时不得上传或继续自动处理。 该项只生成事实核验提示/待确认事项，不代表学校正式通过、拒绝、验收或定密决定。",
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
  "templateId": "T03-T06",
  "name": "科研项目年度进度与中期检查审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/T03-T06.md",
  "sourceOriginalPath": "docs/design/review-agent/business-templates/R02/research-original/T03-T06.md",
  "sourceDocumentSha256": "878ac025aaca65a7a6627c0cdc525e35fc7c0b622c652c49f6c9a955cab97459",
  "sourceDocumentBytes": 169588,
  "sourceBlobSha": "5d064a9b093852fad8af615dcdf944492cc7d92f",
  "sourceBranch": "feat/v3-r02-template-library@150acfe761cb7ad0424a2ca009fd57f12dbfddfd",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "sourcePolicyStatus": "\"PARTIALLY_VERIFIED｜校本重点（重大）项目 PDF 与年度报告通知已核；四川省2026规程有省属机构转载全文，省厅原站与在办项目适用待核；校设 AI 基金规则/真实签批未取得\"",
  "policyEvidenceStatus": "PARTIAL",
  "requiresPreUploadSecurityGate": true,
  "secureIntakeEnforcedByTemplateVersion": false,
  "requiredIntegrationGate": "共享 Main/文件导入路径必须在文件选择、落盘、OCR/解析及模型调用前核验保密属性与获准环境；未知/拒绝时不得数字化受理。该门禁属于集成 Owner 所有权，不在本批文件内。",
  "criteria": [
    {
      "sectionId": "project-baseline",
      "criterionId": "r001",
      "sourceRuleId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006",
        "SRC-010"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r002",
      "sourceRuleId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r003",
      "sourceRuleId": "R003",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r004",
      "sourceRuleId": "R004",
      "srcIds": [
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
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r005",
      "sourceRuleId": "R005",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r006",
      "sourceRuleId": "R006",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r007",
      "sourceRuleId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r008",
      "sourceRuleId": "R008",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r009",
      "sourceRuleId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r010",
      "sourceRuleId": "R010",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "project-baseline",
      "criterionId": "r011",
      "sourceRuleId": "R011",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-007",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-check",
      "criterionId": "r012",
      "sourceRuleId": "R012",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-check",
      "criterionId": "r013",
      "sourceRuleId": "R013",
      "srcIds": [
        "SRC-002",
        "SRC-007",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-check",
      "criterionId": "r014",
      "sourceRuleId": "R014",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-check",
      "criterionId": "r015",
      "sourceRuleId": "R015",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-check",
      "criterionId": "r016",
      "sourceRuleId": "R016",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-check",
      "criterionId": "r017",
      "sourceRuleId": "R017",
      "srcIds": [
        "SRC-005",
        "SRC-006",
        "SRC-007"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-check",
      "criterionId": "r018",
      "sourceRuleId": "R018",
      "srcIds": [
        "SRC-001",
        "SRC-008",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-check",
      "criterionId": "r019",
      "sourceRuleId": "R019",
      "srcIds": [
        "SRC-008",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-check",
      "criterionId": "r020",
      "sourceRuleId": "R020",
      "srcIds": [
        "SRC-008",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "evidence-check",
      "criterionId": "r021",
      "sourceRuleId": "R021",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-events",
      "criterionId": "r022",
      "sourceRuleId": "R022",
      "srcIds": [
        "SRC-003",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-012",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-events",
      "criterionId": "r023",
      "sourceRuleId": "R023",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-events",
      "criterionId": "r024",
      "sourceRuleId": "R024",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-events",
      "criterionId": "r025",
      "sourceRuleId": "R025",
      "srcIds": [
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-events",
      "criterionId": "r026",
      "sourceRuleId": "R026",
      "srcIds": [
        "SRC-002"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-events",
      "criterionId": "r027",
      "sourceRuleId": "R027",
      "srcIds": [
        "SRC-002",
        "SRC-004",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-events",
      "criterionId": "r028",
      "sourceRuleId": "R028",
      "srcIds": [
        "SRC-003",
        "SRC-006",
        "SRC-007",
        "SRC-008",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "authority-events",
      "criterionId": "r029",
      "sourceRuleId": "R029",
      "srcIds": [
        "SRC-006",
        "SRC-008"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "follow-up-security",
      "criterionId": "r030",
      "sourceRuleId": "R030",
      "srcIds": [
        "SRC-008",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "follow-up-security",
      "criterionId": "r031",
      "sourceRuleId": "R031",
      "srcIds": [
        "SRC-008",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "follow-up-security",
      "criterionId": "r032",
      "sourceRuleId": "R032",
      "srcIds": [
        "SRC-008",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "follow-up-security",
      "criterionId": "r033",
      "sourceRuleId": "R033",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "follow-up-security",
      "criterionId": "r034",
      "sourceRuleId": "R034",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "follow-up-security",
      "criterionId": "r035",
      "sourceRuleId": "R035",
      "srcIds": [
        "SRC-001",
        "SRC-010",
        "SRC-014",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    },
    {
      "sectionId": "follow-up-security",
      "criterionId": "r036",
      "sourceRuleId": "R036",
      "srcIds": [
        "SRC-008",
        "SRC-012"
      ],
      "evidenceStatus": "PARTIAL",
      "note": "SRC 为研究来源索引，不是案卷材料 SourceRef；来源状态不等于学校授权或政策确认。"
    }
  ]
}

export default templateVersion
