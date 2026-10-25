import type { TemplateVersion } from '@profer/shared'

export const T01T05_TEMPLATE: TemplateVersion = {
  "templateId": "T01-T05",
  "version": 1,
  "schemaVersion": 2,
  "name": "试卷命题、试题保密与考试材料审核",
  "description": "本地研究模板 · 非校方正式模板。试卷命题、试题保密与考试材料审核：基于 R02 原件逐条核验事实、证据和办理情形；所列材料包含后续权威记录，不代表初次提交均须上传。未公开试题/答案/评分标准不得未经校方授权提交给外部 AI；人工先核动作级处理许可。所有正式决定与未确认校本政策必须人工判断。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；政策 PARTIAL、全部正式决定需可信人员人工确认；研究 SRC 不是案卷 SourceRef。",
  "objectType": "custom",
  "displayName": {
    "template": "T01-T05 · 试卷命题、试题保密与考试材料审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "F001 · 案卷不可变 ID（ID）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿 F001 字段：Case；P0→P7；内；流程设计；本地唯一 Case 主键与审计事件；P1；创建时生成；重复/冲突报 CONFLICT，非校级业务编号。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F001；原稿类型及阶段：F001 案卷不可变 ID（ID）；Case；P0→P7；内；流程设计；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F002",
      "label": "F002 · 考试事项类别及学段（ENUM）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F002 字段：Task；P0；教/院，SRC-001、005、015；M001 任务类别，学段归口表；P1；未知先 PU/人工路由；不得缺省本科。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F002；原稿类型及阶段：F002 考试事项类别及学段（ENUM）；Task；P0；教/院，SRC-001、005、015；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F003",
      "label": "F003 · 校区（ENUM）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F003 字段：Task；P0；教/院，SRC-014；M001 实际开课校区、M004；P1；不明确则 NM；校区岗位权限仍 PU。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F003；原稿类型及阶段：F003 校区（ENUM）；Task；P0；教/院，SRC-014；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F004",
      "label": "F004 · 开课/培养单位（ID）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F004 字段：Task；P0；教/院，SRC-001、005；M001 组织编码和签发单位；P1；NM；历史更名不得自动匹配。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F004；原稿类型及阶段：F004 开课/培养单位（ID）；Task；P0；教/院，SRC-001、005；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F005",
      "label": "F005 · 学年学期（STR）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F005 字段：Task；P0；教，SRC-001、002；M001 学期、M005 当期考试安排；P1；NM；不同学期不可合卷。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F005；原稿类型及阶段：F005 学年学期（STR）；Task；P0；教，SRC-001、002；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F006",
      "label": "F006 · 课程号（ID）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F006 字段：Task；P0；教，SRC-001；M001 正式课程编码；P1；NM；同名课程不能代替。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F006；原稿类型及阶段：F006 课程号（ID）；Task；P0；教，SRC-001；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F007",
      "label": "F007 · 课程全名（STR）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F007 字段：Task；P0；教，SRC-001；M001 课程主数据；P1；NM 或校方源纠错；OCR 不覆盖课程号。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F007；原稿类型及阶段：F007 课程全名（STR）；Task；P0；教，SRC-001；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F008",
      "label": "F008 · 教学任务/班级关联 ID（ID）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F008 字段：Task；P0；教，SRC-001 第 29 条；M001 教学班/授课任务主键；P2；NM；班次冲突为 CONFLICT。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F008；原稿类型及阶段：F008 教学任务/班级关联 ID（ID）；Task；P0；教，SRC-001 第 29 条；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F009",
      "label": "F009 · 考试批次唯一键（ID）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F009 字段：Batch；P0；教/院/考，SRC-002、003；M005 组织考试批次及场次编号；P2；NM；不得拿另一批次签批。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F009；原稿类型及阶段：F009 考试批次唯一键（ID）；Batch；P0；教/院/考，SRC-002、003；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F010",
      "label": "F010 · 正考/补缓/课程/博士综合/招生类型（ENUM）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F010 字段：Batch；P0；教/院，SRC-001、005、015；M001、M005 考核任务类别；P1；不明则 PU/路由；不给本科默认。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F010；原稿类型及阶段：F010 正考/补缓/课程/博士综合/招生类型（ENUM）；Batch；P0；教/院，SRC-001、005、015；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F011",
      "label": "F011 · 计划考试时段（DATE）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F011 字段：Batch；P0/P4；教/考，SRC-002、003；M005 正式排考事件/通知；P1；日期待排标 NA；临近开考人工确认。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F011；原稿类型及阶段：F011 计划考试时段（DATE）；Batch；P0/P4；教/考，SRC-002、003；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F012",
      "label": "F012 · 有效课程教学大纲版本（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F012 字段：Task；P0/P1；教/院，SRC-001 第 32 条；M002 受控/公开大纲文号和版本；P1；适用本科 P1 缺为 NM，内容争议 HD。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F012；原稿类型及阶段：F012 有效课程教学大纲版本（REF）；Task；P0/P1；教/院，SRC-001 第 32 条；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F013",
      "label": "F013 · 既定考核方式/方案版本（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F013 字段：Task；P0/P1；教/院，SRC-001；T01-T06 结论；M003 权威方案决定或其索引；P1；有变更争议 HD；不能自批考核调整。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F013；原稿类型及阶段：F013 既定考核方式/方案版本（REF）；Task；P0/P1；教/院，SRC-001；T01-T06 结论；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F014",
      "label": "F014 · 统一/分组命题组织模式（ENUM）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F014 字段：Task；P0/P1；教/院，SRC-001、013；M001 教学组织任务、M004；P1；不明 PU；不得擅派所有教师审卷。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F014；原稿类型及阶段：F014 统一/分组命题组织模式（ENUM）；Task；P0/P1；教/院，SRC-001、013；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F015",
      "label": "F015 · 经办人校方稳定主体 ID（ID）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F015 字段：ActorGrant；P0/P7；身（拟），SRC-001 职责；M004 实名令牌/校内认证事件；P2；未核身份停办 HD；姓名相同不算通过。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F015；原稿类型及阶段：F015 经办人校方稳定主体 ID（ID）；ActorGrant；P0/P7；身（拟），SRC-001 职责；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F016",
      "label": "F016 · 经办人授权范围与有效时间（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F016 字段：ActorGrant；P0/P7；身/教（拟），SRC-001、014；M004 岗位/委托关系快照；P2；缺真实授权 HD；过期/跨批次 CONFLICT。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F016；原稿类型及阶段：F016 经办人授权范围与有效时间（REF）；ActorGrant；P0/P7；身/教（拟），SRC-001、014；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F017",
      "label": "F017 · 命题人与审题岗位分工（SET）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F017 字段：ActorGrant；P1/P2；身/院（拟），SRC-001 第 32 条；M004 岗位与 M010 送审人；P2；不能推导签批权限则 HD。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F017；原稿类型及阶段：F017 命题人与审题岗位分工（SET）；ActorGrant；P1/P2；身/院（拟），SRC-001 第 32 条；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F018",
      "label": "F018 · 试卷套别、启用用途与内部组 ID（SET）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F018 字段：PaperSet；P1/P4；库/院，SRC-001；M010 安全封包索引、M006–M007；P2；套别不清 CONFLICT；不读取题目本体。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F018；原稿类型及阶段：F018 试卷套别、启用用途与内部组 ID（SET）；PaperSet；P1/P4；库/院，SRC-001；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F019",
      "label": "F019 · A 卷当前版本安全指纹（HASH）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F019 字段：PaperSet；P1→P4；库（拟），SRC-001；M006 校内卷库对象 ID/指纹；P2；该套需提交而无指纹 NM；源断 SU。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F019；原稿类型及阶段：F019 A 卷当前版本安全指纹（HASH）；PaperSet；P1→P4；库（拟），SRC-001；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F020",
      "label": "F020 · B 卷当前版本安全指纹（HASH）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F020 字段：PaperSet；P1→P4；库（拟），SRC-001；M007 校内卷库对象 ID/指纹；P2；同 F019；不可用正文外发替代。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F020；原稿类型及阶段：F020 B 卷当前版本安全指纹（HASH）；PaperSet；P1→P4；库（拟），SRC-001；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F021",
      "label": "F021 · 参考答案安全指纹及套别关联（HASH/SET）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F021 字段：PaperSet；P1→P4；库（拟），SRC-001；M008 受控答案引用与配套关系；P3；没有套别关联 NM/CONFLICT。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F021；原稿类型及阶段：F021 参考答案安全指纹及套别关联（HASH/SET）；PaperSet；P1→P4；库（拟），SRC-001；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F022",
      "label": "F022 · 评分标准安全指纹及套别关联（HASH/SET）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F022 字段：PaperSet；P1→P4；库（拟），SRC-001；M009 受控评分标准引用；P3；不可读 UR 仅由校内有权人员判。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F022；原稿类型及阶段：F022 评分标准安全指纹及套别关联（HASH/SET）；PaperSet；P1→P4；库（拟），SRC-001；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F023",
      "label": "F023 · 提交审题的版本组合 ID（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F023 字段：PaperSet/Review；P1/P2；库/院（拟），SRC-001；M010 清单记录 F018–F022；P2；不完整 NM；组合变更使旧审签不能复用。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F023；原稿类型及阶段：F023 提交审题的版本组合 ID（REF）；PaperSet/Review；P1/P2；库/院（拟），SRC-001；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F024",
      "label": "F024 · 人工审题意见与效力状态（ENUM）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F024 字段：Review；P2；审，SRC-001；院例 SRC-011；M011 正式签发意见/审核表；P2；未出结果为 HD；不填“默认通过”。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F024；原稿类型及阶段：F024 人工审题意见与效力状态（ENUM）；Review；P2；审，SRC-001；院例 SRC-011；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F025",
      "label": "F025 · 审题人稳定 ID、签发岗位（ID/REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F025 字段：Review；P2；身＋审（拟），SRC-001；M011 签名/电子签名验证，M004 授权；P2；只有签字图片 HD；授权不一致 CONFLICT。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F025；原稿类型及阶段：F025 审题人稳定 ID、签发岗位（ID/REF）；Review；P2；身＋审（拟），SRC-001；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F026",
      "label": "F026 · 审题形成时间和适用批次（DATE/REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F026 字段：Review；P2；审，SRC-001；M011 正式签发记录/版本号；P2；未签发则 HD；无时间不得跨版继承。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F026；原稿类型及阶段：F026 审题形成时间和适用批次（DATE/REF）；Review；P2；审，SRC-001；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F027",
      "label": "F027 · 退回修改/再次审核引用（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F027 字段：Review；P2/P7（条件）；审/院，SRC-011 院例；M012 退回意见、M011 新审签关联；P2；无退改时 NA；意见不可读 UR。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F027；原稿类型及阶段：F027 退回修改/再次审核引用（REF）；Review；P2/P7（条件）；审/院，SRC-011 院例；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F028",
      "label": "F028 · 教务备案号（ID）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F028 字段：Filing；P3；备，SRC-001 第 32 条；M013 备案回执/源系统事件；P1；托印前缺为 HD/NM，不能本地自造。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F028；原稿类型及阶段：F028 教务备案号（ID）；Filing；P3；备，SRC-001 第 32 条；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F029",
      "label": "F029 · 备案绑定的题卷版本组（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F029 字段：Filing；P3；备，SRC-001；M013 版本引用映射至 F023；P2；版本不一 CONFLICT，停止旧版托印。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F029；原稿类型及阶段：F029 备案绑定的题卷版本组（REF）；Filing；P3；备，SRC-001；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F030",
      "label": "F030 · 备案状态及生效时间（ENUM/DATE）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F030 字段：Filing；P3；备，SRC-001、002；M013 签发主体和状态事件；P1；不明 HD/SU，不得显示“已备案”。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F030；原稿类型及阶段：F030 备案状态及生效时间（ENUM/DATE）；Filing；P3；备，SRC-001、002；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F031",
      "label": "F031 · 印制申请/指令号（ID）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F031 字段：Print；P3/P4；印/院（拟），SRC-008、013；M014 签发申请单/印制工单；P2；有托印请求但无校方记录 NM；授权未知 PU。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F031；原稿类型及阶段：F031 印制申请/指令号（ID）；Print；P3/P4；印/院（拟），SRC-008、013；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F032",
      "label": "F032 · 指令要求的卷版、套别、份数（REF/INT）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F032 字段：Print；P3/P4；印/教（拟），SRC-008；M014 版组与打印份数（不含原文）；P2；不符 CONFLICT；份数阈值 PU。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F032；原稿类型及阶段：F032 指令要求的卷版、套别、份数（REF/INT）；Print；P3/P4；印/教（拟），SRC-008；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F033",
      "label": "F033 · 实际交付卷版和数量（REF/INT）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F033 字段：Print；P4；印，SRC-002、008；M015 印制点交付/验收记录；P2；尚未印为 NA，实收不足转 HD。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F033；原稿类型及阶段：F033 实际交付卷版和数量（REF/INT）；Print；P4；印，SRC-002、008；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F034",
      "label": "F034 · 封存袋/库位或受控容器号（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F034 字段：Custody；P4；考/印（拟），SRC-008、013；M016 台账、受控容器关联；P2；密封规则 PU，封号冲突 CONFLICT。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F034；原稿类型及阶段：F034 封存袋/库位或受控容器号（REF）；Custody；P4；考/印（拟），SRC-008、013；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F035",
      "label": "F035 · 出库/领用交接事件号（ID）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F035 字段：Custody；P4；考/印（拟），SRC-003、008；M017 原始领用/签收台账；P2；未交时 NA，已交却无记录 NM。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F035；原稿类型及阶段：F035 出库/领用交接事件号（ID）；Custody；P4；考/印（拟），SRC-003、008；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F036",
      "label": "F036 · 交方稳定身份与授权（ID/REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F036 字段：Custody；P4；身＋考（拟），SRC-008；M017 与 M004 交方身份验证；P2；姓名缺校验则 HD，冒名 CONFLICT。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F036；原稿类型及阶段：F036 交方稳定身份与授权（ID/REF）；Custody；P4；身＋考（拟），SRC-008；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F037",
      "label": "F037 · 收方稳定身份与授权（ID/REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F037 字段：Custody；P4；身＋考（拟），SRC-003、008；M017 与 M004 收方身份验证；P2；同 F036；监考身份应按当批查。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F037；原稿类型及阶段：F037 收方稳定身份与授权（ID/REF）；Custody；P4；身＋考（拟），SRC-003、008；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F038",
      "label": "F038 · 交接时间、套别、数量（DATE/SET/INT）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F038 字段：Custody；P4；考/印（拟），SRC-003、008；M017 两端核对后的签收项；P2；已发生但缺一方证明 HD，数量差 CONFLICT。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F038；原稿类型及阶段：F038 交接时间、套别、数量（DATE/SET/INT）；Custody；P4；考/印（拟），SRC-003、008；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F039",
      "label": "F039 · 开考/启用试卷事件（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F039 字段：Batch；P5；考，SRC-003；M018 考务日志/监考记录；P2；开考前 NA，启用卷与批准卷不同 CONFLICT。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F039；原稿类型及阶段：F039 开考/启用试卷事件（REF）；Batch；P5；考，SRC-003；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F040",
      "label": "F040 · 回收/退交事件与数量（REF/INT）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F040 字段：Custody；P5/P6；考/院（拟），SRC-001、003；M019 回收签收账目；P2；未到考后 NA；数量异常 HD。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F040；原稿类型及阶段：F040 回收/退交事件与数量（REF/INT）；Custody；P5/P6；考/院（拟），SRC-001、003；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F041",
      "label": "F041 · 印制、保密或卷别异常的事实引用（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F041 字段：Incident；P4/P5（条件）；考/院（拟），SRC-002、008；M020 最小化异常报告、时间/地点；P2；无事故 NA；疑似失泄密不得模型定性。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F041；原稿类型及阶段：F041 印制、保密或卷别异常的事实引用（REF）；Incident；P4/P5（条件）；考/院（拟），SRC-002、008；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F042",
      "label": "F042 · 有权事件处置决定引用（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F042 字段：Incident；P5/P7（条件）；决，SRC-008 待核；M021 正式结论的受控引用；P2；调查中为 HD，不能补写虚构结论。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F042；原稿类型及阶段：F042 有权事件处置决定引用（REF）；Incident；P5/P7（条件）；决，SRC-008 待核；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F043",
      "label": "F043 · 考后档案包/移交与保管索引（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F043 字段：Archive；P6；档/院，SRC-001 第 34–36 条、004；M024–M025 档案编号和核收日志；P2；考前 NA，考后缺按阶段 NM。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F043；原稿类型及阶段：F043 考后档案包/移交与保管索引（REF）；Archive；P6；档/院，SRC-001 第 34–36 条、004；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F044",
      "label": "F044 · 新旧版映射、变更原因、受影响清单（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F044 字段：Change；P2/P3/P7（条件）；库＋院（拟），SRC-001、011；M022、M023 变更单/旧新引用；P2；无修订 NA；无法界定影响则 HD。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F044；原稿类型及阶段：F044 新旧版映射、变更原因、受影响清单（REF）；Change；P2/P3/P7（条件）；库＋院（拟），SRC-001、011；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F045",
      "label": "F045 · 撤回/停办/复核请求及正式答复（REF）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F045 字段：Change；P7（条件）；申报人＋决（分源），制度待核；M026 请求与有权机关形成的答复；P2；无申请 NA；路径或身份不清 PU/HD。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F045；原稿类型及阶段：F045 撤回/停办/复核请求及正式答复（REF）；Change；P7（条件）；申报人＋决（分源），制度待核；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F046",
      "label": "F046 · 适用政策版本、状态和出处（SET）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F046 字段：Policy；每阶段复核；校方正式 SRC 与当期主管部门确认，SRC-001–015；04 节 SRC、适用判定日志/校内制度确认；P0；矛盾/失效 UNKNOWN→PU；检索失联 SU。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F046；原稿类型及阶段：F046 适用政策版本、状态和出处（SET）；Policy；每阶段复核；校方正式 SRC 与当期主管部门确认，SRC-001–015；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F047",
      "label": "F047 · 考核载体/实现形态（ENUM：PAPER/COMPUTER_BANK/ONLINE/ORAL/PRACTICAL/WORK/UNKNOWN）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F047 字段：AssessmentCarrier；P0–P1，变更时 P7；教务/学院的正式考核方案；SRC-001、003、006；M001/M003 考核形式、M027 受控考试配置/考核任务；P1；题库原文 P3；形态未证 POLICY_UNCONFIRMED；不得默认为纸卷，也不得凭“机考”自动免 A/B/审题。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F047；原稿类型及阶段：F047 考核载体/实现形态（ENUM：PAPER/COMPUTER_BANK/ONLINE/ORAL/PRACTICAL/WORK/UNKNOWN）；AssessmentCarrier；P0–P1，变更时 P7；教务/学院的正式考核方案；SRC-001、003、006；不自行猜测阈值或校方数据接口。"
    },
    {
      "key": "F048",
      "label": "F048 · 本次读取/传输/处理动作的学校许可（REF：目的、数据类别、系统/受托方、岗位、地域、时间、撤销状态）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "原稿 F048 字段：AccessGrant；每次含敏感数据动作之前；学校数据治理/考试/保密主管真实许可，SRC-017 仅法律边界；M028 学校权威许可事件/可核承诺范围和当前操作者；P2；触及原题为 P3；未获许可 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION 且不执行；已撤销 CONFLICT；源失联 SOURCE_UNAVAILABLE。核验需回溯有权来源，缺件/政策未知/后续阶段必须分别处理。",
      "displayHint": "R02 研究字段 F048；原稿类型及阶段：F048 本次读取/传输/处理动作的学校许可（REF：目的、数据类别、系统/受托方、岗位、地域、时间、撤销状态）；AccessGrant；每次含敏感数据动作之前；学校数据治理/考试/保密主管真实许可，SRC-017 仅法律边界；不自行猜测阈值或校方数据接口。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "M001 · 证明课程任务及学段、开课单位；教务/学院教学秘书",
      "purpose": "正式课程/教学班/任课任务记录；C(P0)；研究生分支仅分类用途；校方可验证的任务通知或经归口部门确认的任务清单；F002–F010、F014；SRC-001、002、005、015；按学期、课程、班、单位与签发时间归属；P1/P2；NM/UR/SU；姓名相同不能代课程主键；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "正式课程/教学班/任课任务记录；C(P0)；研究生分支仅分类用途；校方可验证的任务通知或经归口部门确认的任务清单；F002–F010、F014；SRC-001、002、005、015"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M002",
      "name": "M002 · 证明本科命题依据教学大纲；开课学院或教务",
      "purpose": "该课程现行授课版教学大纲；C(P0/P1)；学校备案/归口部门核验的教学大纲索引或批准版；F006、F007、F012；SRC-001 第 32 条；同课程同学期的版本与课程负责单位；元数据 P1，受限内容按校方定；NM/UR/SU；无法确认有效版为 PU；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "该课程现行授课版教学大纲；C(P0/P1)；学校备案/归口部门核验的教学大纲索引或批准版；F006、F007、F012；SRC-001 第 32 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M003",
      "name": "M003 · 证明既定考核方式与方案，不重做考核方式审批；教务/学院，或相邻 T01-T06 决定权威源",
      "purpose": "已生效考核安排、被批准的方案版本/变更决定；C(P0/P1)，存在变更时为 K(方案变更)；校方真实审签的方案、关联 T01-T06 权威有效决定摘要；F010、F013；SRC-001、002；相邻 T01-T06 仅路由；指向当前任务、学期、时间与版本；P1/P2；NM/UR/SU；方案有效性分歧 HD；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "已生效考核安排、被批准的方案版本/变更决定；C(P0/P1)，存在变更时为 K(方案变更)；校方真实审签的方案、关联 T01-T06 权威有效决定摘要；F010、F013；SRC-001、002；相邻 T01-T06 仅路由"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M004",
      "name": "M004 · 证明经办、命题、审核、备案与领退人员的真实岗位/委托权；校方人事身份授权/教务和学院",
      "purpose": "实名主体与课程任务、岗位权限、有效时段绑定的校内可信记录；C(P0 经办、P2 审核)，后续交接 L(P4)；校方有权主管部门核验的正式任命/委托或校内认证日志；F014–F017、F025、F036–F037；SRC-001、005、014；以主体稳定 ID、岗位、批次、授权起讫、签发机关归属；P2；无合法授权 HD，读取失败 UR、核验系统离线 SU；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "实名主体与课程任务、岗位权限、有效时段绑定的校内可信记录；C(P0 经办、P2 审核)，后续交接 L(P4)；校方有权主管部门核验的正式任命/委托或校内认证日志；F014–F017、F025、F036–F037；SRC-001、005、014"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M005",
      "name": "M005 · 证明考试批次和日期/用途；教务/学院考务",
      "purpose": "正式排考或当批补缓考任务通知；C(P0 批次已确定时)，时间未发布则 K(实际排考)；可信教务排考事件、院级经校方核实的当期考试任务单；F009–F011；SRC-002、003、014；与学年学期、校区、课程、场次、启用用途绑定；P1/P2；NM/UR/SU；日期待发布不得伪造截止；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "正式排考或当批补缓考任务通知；C(P0 批次已确定时)，时间未发布则 K(实际排考)；可信教务排考事件、院级经校方核实的当期考试任务单；F009–F011；SRC-002、003、014"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M006",
      "name": "M006 · 证明 A 卷被受控生成且可对版；命题人/校内卷库",
      "purpose": "P3 高敏原卷+安全索引，题目不作公开附件；C(P1)（本科学校要求 A/B）；有权人员在卷库验证的纸质密封卷及其编号/安全核验记录；F018–F019、F023；SRC-001 第 32 条；受控对象 ID/内容版次/用途；模型仅 P2 指纹，原卷 P3 不出域；无受控证据 NM，校内无法辨认 UR，卷库离线 SU；未获校方动作级许可不得向外部 AI 传送试题、答案或评分标准原文。",
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
        "P3 高敏原卷+安全索引，题目不作公开附件；C(P1)（本科学校要求 A/B）；有权人员在卷库验证的纸质密封卷及其编号/安全核验记录；F018–F019、F023；SRC-001 第 32 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M007",
      "name": "M007 · 证明 B 卷对应当前批次且版次独立；命题人/校内卷库",
      "purpose": "受控 B 卷原件及元数据；C(P1)（本科）；与 M006 相同层级的有权纸质核验/双卷对应签名；F018、F020、F023；SRC-001 第 32 条；B 卷独立版号、与 A 卷组关系；P3 原件不上传；NM/UR/SU；套别混淆 CONFLICT；未获校方动作级许可不得向外部 AI 传送试题、答案或评分标准原文。",
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
        "受控 B 卷原件及元数据；C(P1)（本科）；与 M006 相同层级的有权纸质核验/双卷对应签名；F018、F020、F023；SRC-001 第 32 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M008",
      "name": "M008 · 证明试卷各套参考答案已经准备；命题人/校内卷库",
      "purpose": "受控答案与卷套配对记录；C(P1)（本科）；校方有权内容审核人对封包中参考答案的存在及对应性签核；F021、F023；SRC-001 第 32 条；对应 A/B 卷版次、仅受控指纹/在场证明；P3；NM/UR/SU；模型不可比对答案内容；未获校方动作级许可不得向外部 AI 传送试题、答案或评分标准原文。",
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
        "受控答案与卷套配对记录；C(P1)（本科）；校方有权内容审核人对封包中参考答案的存在及对应性签核；F021、F023；SRC-001 第 32 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M009",
      "name": "M009 · 证明评分标准按套准备；命题人/校内卷库",
      "purpose": "受控评分细则及配对记录；C(P1)（本科）；校方审题人有权核定的标准存在性与版本索引；F022–F023；SRC-001 第 32 条；同题卷与参考答案版本组，原文 P3；模型只受控索引；NM/UR/SU；标准合理性 HD；未获校方动作级许可不得向外部 AI 传送试题、答案或评分标准原文。",
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
        "受控评分细则及配对记录；C(P1)（本科）；校方审题人有权核定的标准存在性与版本索引；F022–F023；SRC-001 第 32 条"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M010",
      "name": "M010 · 证明提交审核的是哪一整组版本；课程组/学院受理岗",
      "purpose": "安全封包清单、套别及 M006–M009 的对象指纹；C(P1 完稿送审)；已验证的校内送审登记和受控卷库版组交叉索引；F017–F023；SRC-001、011；不可变提交 ID、申请人、批次、时间；变更必须新建版组；NM/UR/SU；版号错配 CONFLICT；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "安全封包清单、套别及 M006–M009 的对象指纹；C(P1 完稿送审)；已验证的校内送审登记和受控卷库版组交叉索引；F017–F023；SRC-001、011"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M011",
      "name": "M011 · 证明有权内容审核意见；系（部）负责人或课程负责人",
      "purpose": "真实签发的审题意见/有权审核表；L(P2)，托印前 C(P3)；校内可验证电子审签事件或经核验的纸质原签；F023–F026、F027；SRC-001 第 32 条、011、013；明确签发人、授权岗位、所审版本组、意见时间；P2；未审 HD，已宣称签批却缺证明 NM，签字难辨 UR；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "真实签发的审题意见/有权审核表；L(P2)，托印前 C(P3)；校内可验证电子审签事件或经核验的纸质原签；F023–F026、F027；SRC-001 第 32 条、011、013"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M012",
      "name": "M012 · 证明退改要求或二次审题意见；原审题人/有权接续审核者",
      "purpose": "审题退回指令、新意见、关联旧决定；K(D：P2 退回触发)；在真实审批系统上的退回/再次审核事件；F024、F027、F044；SRC-001、011；原件只读、二次意见为新决定记录，旧新成链；P2；未发生 NA；触发后欠缺 NM/UR/SU；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "审题退回指令、新意见、关联旧决定；K(D：P2 退回触发)；在真实审批系统上的退回/再次审核事件；F024、F027、F044；SRC-001、011"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M013",
      "name": "M013 · 证明学校教务备案及其目标版本；教务处",
      "purpose": "校方备案号、审签状态、时间和引用卷组的权威回执；L(P3)，若已经进入托印为 C(P3→P4)；教务处有权人员校验的备案原始台账或正式受控回执；F023、F028–F030；SRC-001 第 32 条、002；必须绑定同批次、同题卷组及签发机关；P1/P2；没备案就 HD，不可用截屏的 approved=true 代替；UR/SU 独立记；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "校方备案号、审签状态、时间和引用卷组的权威回执；L(P3)，若已经进入托印为 C(P3→P4)；教务处有权人员校验的备案原始台账或正式受控回执；F023、F028–F030；SRC-001 第 32 条、002"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M014",
      "name": "M014 · 证明本批允许按特定版次申请制卷与印量；学院考务/印制主管",
      "purpose": "印制申请单、工单、签发指令；L(P3 托印)；正式印制台账中同一订单的经核验签发信息；F029、F031–F032；SRC-002、008、013；绑定 M013 目标版、份数、套别和发指令部门；P2；未申请 NA；已发印制任务而无源 NM；权限细则 PU；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "印制申请单、工单、签发指令；L(P3 托印)；正式印制台账中同一订单的经核验签发信息；F029、F031–F032；SRC-002、008、013"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M015",
      "name": "M015 · 证明实际印量、版本及接收情况；有权印制/验收人员",
      "purpose": "印制完工、核数/交付凭证；L(P4)；经校内核验的印制机构原始交付清单；F032–F033；SRC-002、008、009；记录订单及实物版次/数量、校内承接方；P2；未完工 NA；已完工欠记录 NM，差额 CONFLICT；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "印制完工、核数/交付凭证；L(P4)；经校内核验的印制机构原始交付清单；F032–F033；SRC-002、008、009"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M016",
      "name": "M016 · 证明封存与在管责任人的受控事实；学院/校区试卷保管方",
      "purpose": "封包、库位、在管台账，L(P4)；学校受控库内入库事件、可核验的原始封条与签收；F033–F034；SRC-002、008、013–014；容器号、时间、交入/保管主体；内容 P3/元数据 P2；无入库事件但声称已封存 NM；封存标准细节 PU；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "封包、库位、在管台账，L(P4)；学校受控库内入库事件、可核验的原始封条与签收；F033–F034；SRC-002、008、013–014"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M017",
      "name": "M017 · 证明领用/出库双向交接事实；印制方、考务/监考签收方",
      "purpose": "当批领卷与受控签收日志；L(P4 实际领用后)；已登记的学校考务系统交接事件/经签收原始领卷单；F035–F038；SRC-003、008、013；交方/收方、授权、套别、份数、时点与场次；P2；未领 NA；已领欠原始记录 NM；签方争议 HD/CONFLICT；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "当批领卷与受控签收日志；L(P4 实际领用后)；已登记的学校考务系统交接事件/经签收原始领卷单；F035–F038；SRC-003、008、013"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M018",
      "name": "M018 · 证明卷别实际启用及考务事实；监考/学校考务主管",
      "purpose": "开考日志、实际启用套别、考场事件；L(P5)；校方当批真实监考记录/受控考场日志；F009、F018、F039；SRC-003；按实际场次、启用版次、监考身份关联；P2；开考前 NA；启用卷与 M013/M014 版不符 CONFLICT；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "开考日志、实际启用套别、考场事件；L(P5)；校方当批真实监考记录/受控考场日志；F009、F018、F039；SRC-003"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M019",
      "name": "M019 · 证明用后回收/退交件数及责任；监考/学院或校区保管岗",
      "purpose": "回收签收、退交台账；L(P5/P6)；校方有权考务室真实收卷事件；F035、F038、F040；SRC-001、003、008；实收卷数量、交接时点、双方身份；P2；考前 NA，已回收而凭证不在 NM/UR/SU；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "回收签收、退交台账；L(P5/P6)；校方有权考务室真实收卷事件；F035、F038、F040；SRC-001、003、008"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M020",
      "name": "M020 · 证明发生了什么异常，非确定其罪责；最早发现者/考务主管",
      "purpose": "错卷、数量不符、破损、涉嫌泄密的最小事实报告；K(F：异常发生)；有权考务系统事件号和核实的最小安全元数据；F031–F042；SRC-002、003、008；受控事件号、发生时点、相关卷组；P2，禁止外传题目证据；未发生 NA；已发生不报 HD；材料不可读 UR；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "错卷、数量不符、破损、涉嫌泄密的最小事实报告；K(F：异常发生)；有权考务系统事件号和核实的最小安全元数据；F031–F042；SRC-002、003、008"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M021",
      "name": "M021 · 证明异常是否已有权威处置结论；校方事故/纪律主管",
      "purpose": "正式事件处理结论、恢复/禁止启用决定；L(P5/P7 处理后)；校方有权部门真实签发的决定与有效状态；F041–F042；SRC-008 待核、SRC-012 仅技术分工；独立事故案件号、签发机关、受影响卷组；P2；调查中 HD；不可凭模型认定“已解除风险”；SU/UR；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "正式事件处理结论、恢复/禁止启用决定；L(P5/P7 处理后)；校方有权部门真实签发的决定与有效状态；F041–F042；SRC-008 待核、SRC-012 仅技术分工"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M022",
      "name": "M022 · 证明更改原因及影响范围；命题人/课程负责人",
      "purpose": "新旧版差异安全摘要、修订理由与受影响标识；K(D/E：改卷、换卷、重印)；校内受控版库产生的正式修改记录或审题人签核差异说明；F019–F023、F027、F044；SRC-001、011；原版、新版指纹、变更操作者及变更时刻；P2 摘要/P3 差分不出域；未变 NA；变更不明 HD，无法读 UR；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "新旧版差异安全摘要、修订理由与受影响标识；K(D/E：改卷、换卷、重印)；校内受控版库产生的正式修改记录或审题人签核差异说明；F019–F023、F027、F044；SRC-001、011"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M023",
      "name": "M023 · 证明旧审核/备案/托印对应哪个原版本；原有权审核、教务/印制档案源",
      "purpose": "旧版审核意见、备案、工单的不可变索引；K(D/E/K/L：既有决定被影响)；各签发机关受控历史台账及有效原件；F023–F032、F044；SRC-001、008、011；旧记录保留不覆盖，记录新旧关联；P2；无历史决定时 NA；自述“以前通过”不足 HD；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "旧版审核意见、备案、工单的不可变索引；K(D/E/K/L：既有决定被影响)；各签发机关受控历史台账及有效原件；F023–F032、F044；SRC-001、008、011"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M024",
      "name": "M024 · 证明考后交存档案完整与责任；开课学院/宜宾校区档案保管",
      "purpose": "有权档案移交/接收目录、包索引、时间；L(P6)；有权档案库登记与接收核验凭据；F040、F043；SRC-001 第 34–36 条、004、014；按批次与责任人归属、接收与历史版号；P2；考前 NA；档案应交而缺 NM，源离线 SU；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "有权档案移交/接收目录、包索引、时间；L(P6)；有权档案库登记与接收核验凭据；F040、F043；SRC-001 第 34–36 条、004、014"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M025",
      "name": "M025 · 证明考核档案内容已形成，非命题前置；阅卷教师/学院档案室",
      "purpose": "考后试卷、答卷、阅卷/成绩/分析等受控档案包；L(P6)；校方档案系统的逐项存在性/受控审核记录；F008–F011、F039–F043；SRC-001 第 34–36 条、004；考后学生个人与试题材料，P2/P3；不向模型上传完整档案；考前 NA；到期缺依权责 NM，阅读权不足不提取原文；未获校方动作级许可不得向外部 AI 传送试题、答案或评分标准原文。",
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
        "考后试卷、答卷、阅卷/成绩/分析等受控档案包；L(P6)；校方档案系统的逐项存在性/受控审核记录；F008–F011、F039–F043；SRC-001 第 34–36 条、004"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M026",
      "name": "M026 · 证明撤回/停办/复核请求及真实答复；经核验请求人、原有权办理或复核机关",
      "purpose": "请求本体＋校方受理/有权回复分开留存；K(K/L/J：实际提出时)，答复为 L(P7 决定后)；由有权经办窗口核对的申请及决定存档；F015–F016、F023–F030、F044–F045；SRC-001、011，复核程序待核；请求人身份、请求时间、原决定及后续独立答复 ID；P2；无请求 NA；请求未授权 HD；路径未确认 PU，缺记录 NM；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "请求本体＋校方受理/有权回复分开留存；K(K/L/J：实际提出时)，答复为 L(P7 决定后)；由有权经办窗口核对的申请及决定存档；F015–F016、F023–F030、F044–F045；SRC-001、011，复核程序待核"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M027",
      "name": "M027 · 证明非纸卷命题与受控题组/考试配置之可审查性；开课学院、受控机考平台/课程组",
      "purpose": "机考题库版本、随机组卷配置及考试任务、口试题签/实践任务的受控元数据/有权人工验证记录；K(F047 非纸卷，P1 已送审)；校方正式批准的同等证据形态或本校主管部门在场核验结论，外校模式不可自行等效；F009、F013、F018、F023、F047；SRC-001、003、019（仅参考）；R030；任务/课程/学期/批次/题组或题签版与审题签发绑定；P3 原题不对外；未送审 NA；已送审缺源 NEEDS_MATERIAL，系统失联 SOURCE_UNAVAILABLE，等效许可不明 POLICY_UNCONFIRMED；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "机考题库版本、随机组卷配置及考试任务、口试题签/实践任务的受控元数据/有权人工验证记录；K(F047 非纸卷，P1 已送审)；校方正式批准的同等证据形态或本校主管部门在场核验结论，外校模式不可自行等效；F009、F013、F018、F023、F047；SRC-001、003、019（仅参考）；R030"
      ],
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M028",
      "name": "M028 · 证明特定 AI/第三方/校内程序对某类数据处理是否获校方许可；考试主管与数据治理/安全机构",
      "purpose": "真实权限清单/内部授权决定、委托处理安排、信息分类与撤销状态；K(任何敏感读取、外传、指纹生成或自动审查之前)；有权主管核实的正式受限许可声明，可为“拒绝/无许可”的可信记录；不能用上传者同意代替；F015–F016、F048；SRC-017；R031；必须绑定主体、目的、具体动作、受托方、数据类别和有效期；不能把许可全文作为公开附件；未获/未能确认授权 POLICY_UNCONFIRMED/人工停动作；记录不可读 UNREADABLE；可信源离线 SOURCE_UNAVAILABLE；权威来源记录可代替重复上传，后置材料不得于建案阶段强索。",
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
        "真实权限清单/内部授权决定、委托处理安排、信息分类与撤销状态；K(任何敏感读取、外传、指纹生成或自动审查之前)；有权主管核实的正式受限许可声明，可为“拒绝/无许可”的可信记录；不能用上传者同意代替；F015–F016、F048；SRC-017；R031"
      ],
      "allowReuseAcrossSubjects": true
    }
  ],
  "sections": [
    {
      "id": "evidence-checks",
      "name": "R02 原稿规则逐条核验",
      "description": "依据原稿 T01-T05 §08 的全部独立 R 条目。触发未知不能当不适用；后续材料不视为起案缺件，SRC 仅为研究索引。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "R001 · 学段、考试类别与专门事项分流",
          "requirement": "R001 R001 学段、考试类别与专门事项分流；T=可信任务证实本科课程；F=证实 H1/H2/H3 非本科课程；U=类别不明；SRC-001、005、015、018（国家考试排除）；F001–F002、F010；M001；L1/L2 查案卷关联及课程/培养/招生任务的当期类别；SRC-005 博士综合与 SRC-018 国家考试均不能被套入本科试卷授权链；T PASS_FACT→开课学院；F 后续本科 R 为 NOT_APPLICABLE 并路由；U POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE→归口机构。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R002",
          "title": "R002 · 课程、学期、教学班真实性",
          "requirement": "R002 R002 课程、学期、教学班真实性；T=本科任务存在；F=经证实非本科教学班事项；U=任务来源不明；SRC-001 第 29、32 条；F003–F008；M001；L1/L2 核课程编码、学期、班级 ID、开课单位及校区，按当批任务时点；同名不是同课；同键 PASS_FACT；错班 CONFLICT；缺当前任务 NEEDS_MATERIAL→教务任务管理员。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R003",
          "title": "R003 · 考试批次、用途和排考",
          "requirement": "R003 R003 考试批次、用途和排考；T=已建立正式考试批次；F=尚未排考且可信源确认此阶段未发生；U=来源不通/状态不明；SRC-001、002、003；F005、F008–F011；M001、M005；L1/L2 对照学期、课程、批次、用途及当批通知；2025 通知的时间要求不泛化到 2026；PASS_FACT；跨批 CONFLICT；不可查 SOURCE_UNAVAILABLE→学院考务。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R004",
          "title": "R004 · 命题所据教学大纲版本",
          "requirement": "R004 R004 命题所据教学大纲版本；T=本科课程考试进入命题（含非纸卷）；F=可信证实非本科课程；U=有效大纲未知；SRC-001 第 10、27、32 条；F006–F008、F012、F047；M001、M002、M003；L1/L2 查同课程同学期批准大纲/版本及考核形态；内容符合性仍由 R010 人审；有效版本事实 PASS_FACT；错版 CONFLICT；效力不明 POLICY_UNCONFIRMED→开课学院。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R005",
          "title": "R005 · 考核方案及变更权威引用",
          "requirement": "R005 R005 考核方案及变更权威引用；T=已有考核方案或有效 T01-T06 决定；F=无调整分支仅沿现有大纲；U=生效状态不明；SRC-001、002；F010、F013；M003；L1/L2 比批准主体、课程、学期、版次及生效日；不得重新批准考核方式；引用有效 PASS_FACT；冲突 CONFLICT；未经确定 NEEDS_HUMAN_DECISION→方案有权机关。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R006",
          "title": "R006 · 经办/命题人员的真实课程授权",
          "requirement": "R006 R006 经办/命题人员的真实课程授权；T=有人实际经办或接触试卷；F=未进入人员操作阶段；U=只有 Renderer role/签名图；SRC-001 第 32 条、014（属地线索）；F015–F017；M001、M004；L1 身份与授权历史快照核校方稳定主体、课程/批次、岗位、代理有效时段；不能凭姓名；真实授权 PASS_FACT；越权 CONFLICT，无法认证 NEEDS_HUMAN_DECISION→身份/开课学院。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "R007 · 统一命题的班组职责范围",
          "requirement": "R007 R007 统一命题的班组职责范围；T=权威任务指定统一命题；F=独立专业课命题；U=组织模式不明；SRC-001 第 32 条、013（院级线索）；F008–F009、F014、F017；M001、M004；L1/L2 比课程组授权覆盖的班与场次，在本学期有效；不能让任一任课教师自动审所有班；一致 PASS_FACT；跨班越权 CONFLICT；范围不明 NEEDS_HUMAN_DECISION→课程组负责人。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "R008 · A/B 卷存在性及套别绑定",
          "requirement": "R008 R008 A/B 卷存在性及套别绑定；T=本科纸质卷已完稿送审；F=仍在准备或经权威证明非本科；U=F047 为机考/口试等且A/B 等效要求未获当前校规确认；SRC-001 第 32 条；F018–F020、F023、F047；M006、M007、M010、M027（条件）；纸卷 L2 核 A/B 版次；非纸卷先经 R030 确认是否适用等效 A/B，不可凭“非纸卷”自动视为 NOT_APPLICABLE；纸卷同版 PASS_FACT；缺套 NEEDS_MATERIAL；混卷 CONFLICT；载体等效未明 POLICY_UNCONFIRMED→教务处。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "R009 · 答案和评分标准的逐套对应",
          "requirement": "R009 R009 答案和评分标准的逐套对应；T=本科纸卷送审；F=尚未送审或非本科；U=非纸卷答案/评分方案等效规范未知；SRC-001 第 32 条；F018、F021–F023、F047；M008、M009、M010、M027（条件）；纸卷逐套核 A/B 的答案与评分标准受控版号；非纸卷按 R030 等效规则另审评分标准，不能自动免除；对应 PASS_FACT；错套 CONFLICT；缺件 NEEDS_MATERIAL；载体不明 POLICY_UNCONFIRMED→命题人与审题人。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R010",
          "title": "R010 · 内容质量、A/B 相似率与大纲符合性的人审",
          "requirement": "R010 R010 内容质量、A/B 相似率与大纲符合性的人审；T=进入实质审题；F=尚未提交；U=院级阈值时效争议；SRC-001 第 32 条、007、013（院例未核）；F004、F012、F018–F024、F046；M002、M006–M009、M011；校级原文含 20% 要求，但院例 10% 的时效/范围未知；受控试题仅由校内有权人员按适用制度审读。L4 不得读取试题/自行计算重复率；无正式审读 NEEDS_HUMAN_DECISION；有权意见存在仅该事实 PASS_FACT；阈值适用不明 POLICY_UNCONFIRMED→课程负责人/教务处。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R011",
          "title": "R011 · 审题签发者身份、岗位和真实意见",
          "requirement": "R011 R011 审题签发者身份、岗位和真实意见；T=声称已有审题意见；F=尚未审题；U=只有上传签字图；SRC-001 第 32 条、011（院例）；F016–F017、F024–F026；M004、M011；L1/L2 核签发人岗位在签发时有该课程/批次审题权、审签状态、时间；不能把院表自动当备案；真实意见 PASS_FACT；越权 CONFLICT；仅图 NEEDS_HUMAN_DECISION→学院有权审核人。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R012",
          "title": "R012 · 审题意见是否绑定本次实际卷版",
          "requirement": "R012 R012 审题意见是否绑定本次实际卷版；T=已有意见要复用于当前卷；F=尚未审题；U=旧表没有可靠卷版 ID；SRC-001 第 32 条、011；F009、F018–F026；M010、M011；L1/L2 比提交组 F023 与签发目标、批次及时间；旧审签不继承给新卷；同版 PASS_FACT；异版 CONFLICT；不能对版 NEEDS_HUMAN_DECISION→签发审核人。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R013",
          "title": "R013 · 退改及二次审题的历史—新版链",
          "requirement": "R013 R013 退改及二次审题的历史—新版链；T=发生有权退改/修改；F=未发生；U=改动是否实质不明；SRC-001 第 32 条、011（院例）；F019–F027、F044；M011、M012、M022、M023；L2 排序原意见→变更单→新提交组→新签发；保留旧决定原貌，需重新备案与否依 SRC-008 人工核；新链事实 PASS_FACT；缺新版审签 NEEDS_HUMAN_DECISION；套用旧决定 CONFLICT→审题人。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R014",
          "title": "R014 · 教务处备案事实",
          "requirement": "R014 R014 教务处备案事实；T=已申请托印/声称备案；F=仍处命题/审题前阶段；U=是否备案不明；SRC-001 第 32 条、002；F024、F028–F030；M011、M013；L1 备案事件或 L2 校方原回执核机关、编号、状态、时间与任务；不凭本地 approved=true 或院表；已备案事实 PASS_FACT；未办 NEEDS_HUMAN_DECISION；自称已办无源 NEEDS_MATERIAL→教务处。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R015",
          "title": "R015 · 审题—备案—托印顺序与卷版一致",
          "requirement": "R015 R015 审题—备案—托印顺序与卷版一致；T=已进入备案/托印；F=尚未申请；U=事件时点/版号无法确认；SRC-001 第 32 条、002、008（细则缺）；F009、F023–F032；M010、M011、M013、M014；L1/L2 比审核卷组 F023、备案版 F029、工单版 F032 及先后签发时间；已知“审核→备案→托印”，但提前天数未知；同版顺序 PASS_FACT；异版/倒序 CONFLICT；授权不明 NEEDS_HUMAN_DECISION→教务处。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R016",
          "title": "R016 · 印制申请/工单真实及权限范围",
          "requirement": "R016 R016 印制申请/工单真实及权限范围；T=纸质卷存在印制申请/指令；F=尚未到印制或校方正式确定该考核载体不需纸卷印制；U=非纸卷是否应履行等效托印/备案程序不明；SRC-002、008（全文缺）、013（院例）；F029、F031–F032、F046–F047；M013、M014、M027（条件）；纸卷 L1/L2 核工单签发机关、备案、版次、份数；非纸卷先 R030 与教务确认适用制度；不拿无纸质工单直接判缺件或判免审；工单真实 PASS_FACT；执行许可 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→印制/考试平台主管。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R017",
          "title": "R017 · 实印版本与工单份数一致",
          "requirement": "R017 R017 实印版本与工单份数一致；T=已印毕/交付；F=尚未实际印毕；U=交付状态不明；SRC-002、008、009（采购非校规）；F031–F033；M014、M015；L2 印制交付原件按订单/套别/实数/卷版与当前工单比对；数差仅是事实，不定失泄密责任；时点以交付事件为准；一致 PASS_FACT；差异 CONFLICT→印制点与考务主管。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R018",
          "title": "R018 · 实物封存/入库和在管责任事实",
          "requirement": "R018 R018 实物封存/入库和在管责任事实；T=试卷已实际入库；F=未交付入库；U=库位状态不清；SRC-002、008、013–014（局部）；F033–F034；M015、M016；L2 对原始入库台账/容器号/保管人/接收时间；具体封签形式和人数未知，不凭设想硬判“封存合规”；入库事实 PASS_FACT；合法封存门槛 POLICY_UNCONFIRMED；缺凭证 NEEDS_MATERIAL→考务保管岗。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R019",
          "title": "R019 · 领卷双方真实授权和数量",
          "requirement": "R019 R019 领卷双方真实授权和数量；T=发生领卷/出库；F=尚未领取；U=是否领取未知；SRC-003、008、013（院级）；F035–F038；M004、M016、M017；L1 当班权限＋L2 两端交接原件，同场次/套别/数量/时点；SRC-003 的 20 分钟仅其通知批次，不作通例；可核 PASS_FACT；不符 CONFLICT；身份未核 NEEDS_HUMAN_DECISION→考务领退负责人。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "R020 · 实际启用卷与排考、备案版一致",
          "requirement": "R020 R020 实际启用卷与排考、备案版一致；T=考试已开考；F=未开考；U=实际卷别不明；SRC-001 第 29、32 条、003；F009–F011、F018、F029、F039；M005、M013、M018；L1/L2 考场启用记录比对考试批次、版次及此前备案；不能拿考后记录要求 P1 提前提交；同批同版 PASS_FACT；错卷 CONFLICT→考务主管及异常处置人。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R021",
          "title": "R021 · 考后交回数量与领用链一致",
          "requirement": "R021 R021 考后交回数量与领用链一致；T=已进入回收/退交；F=考试未结束；U=回收状态未知；SRC-001 第 34–36 条、003、008（细则缺）；F035、F038、F040；M017、M019；L2 按场次比领用与回收件数、双方/时间；差量不等于盗窃/泄密认定，校方处置规则另核；一致 PASS_FACT；差量 CONFLICT→学院考务保管岗位。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "R022 · 保密、错卷等异常事实与事故决定分离",
          "requirement": "R022 R022 保密、错卷等异常事实与事故决定分离；T=异常事实/泄题疑点出现；F=确认无此事件且有可信考务记录；U=是否异常无法核实；SRC-002、003、008（细则缺）、012（仅 G50 技术）；F041–F042；M020、M021；L2 仅核报告编号、时间、受影响卷版；有权事故/纪律机关签发 M021 才能引用结论。调查中 M021 尚未产生非缺件；未公开证据不出域；异常报告存在仅 PASS_FACT；责任/解除风险 NEEDS_HUMAN_DECISION；程序未知 POLICY_UNCONFIRMED→事故/保密主管。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R023",
          "title": "R023 · 考后档案目录、包及接收事实",
          "requirement": "R023 R023 考后档案目录、包及接收事实；T=考试/阅卷已结束且到归档节点；F=仍在考前/考试中；U=应交截止未知；SRC-001 第 34–36 条、004、014（校区线索）；F008–F011、F039–F043；M018、M019、M024、M025；L1/L2 核档案目录、受控包、课程/批次、接收签收与保管人；本科至少四年保管不授权系统自动销毁；归档事实 PASS_FACT；到期缺 NEEDS_MATERIAL；节点未知 POLICY_UNCONFIRMED→档案保管员。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R024",
          "title": "R024 · 备案/托印后变卷的旧结论失效范围",
          "requirement": "R024 R024 备案/托印后变卷的旧结论失效范围；T=审核/备案版次后发生卷、答案、标准或用途改变；F=有权证实仅补清晰载体不改目标版；U=改动性质不清；SRC-001 第 32 条、008（细则缺）、011（院例）；F018–F023、F027–F032、F044；M011、M013、M014、M022、M023；L2 比旧新受控指纹/签核变更说明；旧校方决定保留历史但不自动覆盖新卷。重新备案或托印程序依主管部门确定；变化被核实 PASS_FACT（仅变更事实），恢复路径 NEEDS_HUMAN_DECISION；旧签借用 CONFLICT→审题/教务/印制。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R025",
          "title": "R025 · 撤回/停办请求与执行权限",
          "requirement": "R025 R025 撤回/停办请求与执行权限；T=有权相关人提出请求；F=无请求；U=请求者是否有权或动作已执行状态不明；SRC-001、008（程序缺）、011（院例）；F015–F016、F031–F032、F044–F045；M004、M023、M026；L1/L2 核请求者、原审批/印制链及请求时间；已交卷不能点按钮删档；正式撤回权、机关、期限没有现行校本原文；请求存在仅 PASS_FACT；停办效力 POLICY_UNCONFIRMED＋需人工→原受理/教务/考务主管。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "R026 · 审题异议/复核请求与答复",
          "requirement": "R026 R026 审题异议/复核请求与答复；T=确有异议/复核请求；F=无请求；U=申请资格/复核程序未知；SRC-001、011（退改院例非复议权）；F015–F016、F023–F030、F044–F045；M011、M013、M023、M026；L1/L2 独立保存请求与原决定、目标版次及后续有权答复，不因复核自动废止原决定；正式层级/期限待确认；收件事实 PASS_FACT；合法程序 POLICY_UNCONFIRMED，实质结论 NEEDS_HUMAN_DECISION→有权复核机关。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R027",
          "title": "R027 · 校本/院系依据的效力和适用边界",
          "requirement": "R027 R027 校本/院系依据的效力和适用边界；T=拟按政策设硬事实或阈值；F=纯案卷索引无需政策阈值；U=生效/院校区/批次不明；SRC-001、006–008、010–011、013–016（016 历史表）；F002–F004、F012–F013、F046；M001、M002、M003；L0 分学校/学院/校区与新旧版本核实际适用；2022 校规 20%、旧院例 10% 差异须有权解释；2017 纸表与 2018 细则无当期效力核验不可硬套；适用事实可核 PASS_FACT；未知 POLICY_UNCONFIRMED→教务处/制度归口。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R028",
          "title": "R028 · 宜宾属地经办与校级备案是否各自有权",
          "requirement": "R028 R028 宜宾属地经办与校级备案是否各自有权；T=宜宾校区且进入备案/印制；F=其他校区；U=校区是否受委托备案未知；SRC-001 第 32 条、014；F003–F004、F016、F028–F031；M004、M013、M014；P0 仅核校区和 M004 角色；P3 才纳入 M013/M014。L1/L2 分别核校区考试组织/印制职责和学校教务处备案原权；岗位职责网站不是授权下放文；各自事实 PASS_FACT；下放不明 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→教务处＋宜宾教务工作部。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R029",
          "title": "R029 · R02/G50 已有决定只引用、不重决",
          "requirement": "R029 R029 R02/G50 已有决定只引用、不重决；T=人员任务/任课资格、方案、学生补缓考、成绩或独立 G04 安全许可需外部决定；F=无此依赖；U=决定源/权限不可证；SRC-001、002、012（G50 非法规）；F008–F010、F013、F016、F041–F042；M001、M003、M004、M005、M021；L1/L2 核签发机关、决定 ID、对象、效力时点；S02 不审卷、T06-T04 授任课资格、T01-T02 改教学任务、T01-T06 审考核方案；G04 未被证明拥有试题保密事故处理权，只有其真实独立安全决定可引用；权威引用 PASS_FACT；模型代签 CONFLICT；源失联 SOURCE_UNAVAILABLE→各真实签发 Owner。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R030",
          "title": "R030 · 机考/在线/口试/实践等非纸卷载体及等效命题证据分流",
          "requirement": "R030 R030 机考/在线/口试/实践等非纸卷载体及等效命题证据分流；T=F047 由权威任务证实非纸卷且进入 P1 送审；F=权威证实为纸质本科 A/B 卷或尚未到 P1；U=载体/等效规范不明；SRC-001 第 27、32 条、003、006、019（仅跨校启发）；F009、F013、F018、F023、F047；M001、M003、M027；校方考核方案确定形态，L2 核已授权配置/受控题库或题签版本、负责审题人及与考试批次关联；A/B 是否等效、电子封存流程需校方确定。只有纸卷才回到 R008–R009 的原版证据槽，不强制要求电子考试产生纸卷印制工单；载体事实可核 PASS_FACT（不代表免审）；缺 M027 NEEDS_MATERIAL；许可未知 POLICY_UNCONFIRMED→教务处/开课学院，非纸卷未必触发 R016–R019。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R031",
          "title": "R031 · 敏感试题/身份/考后数据的本次读取与第三方处理许可",
          "requirement": "R031 R031 敏感试题/身份/考后数据的本次读取与第三方处理许可；T=拟实际读取、传输、存储、自动分析受控内容/个人信息；F=仅公共政策公开资料研究或不触及受限数据；U=动作范围/授权源不明；SRC-001 第 32 条、008（校本细则缺）、017；F015–F016、F048；M004、M028；执行动作前 L1/L2 核批准目的、数据类别、操作者岗位、目的地、有效区间、撤销状态和可用技术环境。研究设计阶段仅说明门槛，不需要真实许可；真实运行未获授权绝不执行 P3 读取或外传。合法的校内人审可通过独立受控流程继续；有效许可仅许可事实 PASS_FACT；缺政策 POLICY_UNCONFIRMED/人工停动作，源失联 SOURCE_UNAVAILABLE，超范围 CONFLICT→学校数据治理＋考试保密主管。本项仅作事实检查与审阅建议；未确认校本政策、签批权限及敏感数据处理许可均需人工确认，不产生正式批准/拒绝。",
          "execution": "manual",
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
      "nextStageId": "sensitive-access-gate",
      "workflowOwner": "local"
    },
    {
      "id": "sensitive-access-gate",
      "name": "未公开试题、答案、评分标准的校方动作级授权人工闸门",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "intake",
      "nextStageId": "evidence-review",
      "workflowOwner": "local"
    },
    {
      "id": "evidence-review",
      "name": "原稿 R001 起各条独立事实核验与条件异常分流",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "returnToStageId": "sensitive-access-gate",
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
  "templateId": "T01-T05",
  "name": "试卷命题、试题保密与考试材料审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T01-T05.md",
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/T01-T05.md",
  "sourceDocumentBytes": 154535,
  "sourceDocumentSha256": "b854659562d557ebaa3797393705874951284c13e8b9145091ea508430ecdc9b",
  "sourceHashBasis": "dispatch manifest SHA-256; exact original Git blob bytes plus one LF (LINE_ENDING_DRIFT_ONE_LF)",
  "reviewedDocumentSha256": "e6cdc2af3e6cae8fa1430bfe72c53b30e3707b3324d2f8c7c9ae9dde651c9d85",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyStatusRaw": "PARTIALLY_VERIFIED：本科2022校规、2017历史规定与2025当期考务原文可核；2018试卷印制办法全文、2026当期通知及岗位权限/研究生现行性未闭合",
  "policyEvidenceStatus": "PARTIAL",
  "criteria": [
    {
      "sectionId": "evidence-checks",
      "criterionId": "R001",
      "sourceIds": [
        "SRC-001",
        "SRC-005",
        "SRC-015",
        "SRC-018"
      ],
      "fieldIds": [
        "F001",
        "F002",
        "F010"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R001 学段、考试类别与专门事项分流；T=可信任务证实本科课程；F=证实 H1/H2/H3 非本科课程；U=类别不明；SRC-001、005、015、018（国家考试排除）；F001–F002、F010；M001；L1/L2 查案卷关联及课程/培养/招生任务的当期类别；SRC-005 博士综合与 SRC-018 国家考试均不能被套入本科试卷授权链；T PASS_FACT→开课学院；F 后续本科 R 为 NOT_APPLICABLE 并路由；U POLICY_UNCONFIRMED/SOURCE_UNAVAILABLE→归口机构"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R002",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F003",
        "F004",
        "F005",
        "F006",
        "F007",
        "F008"
      ],
      "materialSlotIds": [
        "M001"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R002 课程、学期、教学班真实性；T=本科任务存在；F=经证实非本科教学班事项；U=任务来源不明；SRC-001 第 29、32 条；F003–F008；M001；L1/L2 核课程编码、学期、班级 ID、开课单位及校区，按当批任务时点；同名不是同课；同键 PASS_FACT；错班 CONFLICT；缺当前任务 NEEDS_MATERIAL→教务任务管理员"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R003",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003"
      ],
      "fieldIds": [
        "F005",
        "F008",
        "F009",
        "F010",
        "F011"
      ],
      "materialSlotIds": [
        "M001",
        "M005"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R003 考试批次、用途和排考；T=已建立正式考试批次；F=尚未排考且可信源确认此阶段未发生；U=来源不通/状态不明；SRC-001、002、003；F005、F008–F011；M001、M005；L1/L2 对照学期、课程、批次、用途及当批通知；2025 通知的时间要求不泛化到 2026；PASS_FACT；跨批 CONFLICT；不可查 SOURCE_UNAVAILABLE→学院考务"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R004",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F006",
        "F007",
        "F008",
        "F012",
        "F047"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R004 命题所据教学大纲版本；T=本科课程考试进入命题（含非纸卷）；F=可信证实非本科课程；U=有效大纲未知；SRC-001 第 10、27、32 条；F006–F008、F012、F047；M001、M002、M003；L1/L2 查同课程同学期批准大纲/版本及考核形态；内容符合性仍由 R010 人审；有效版本事实 PASS_FACT；错版 CONFLICT；效力不明 POLICY_UNCONFIRMED→开课学院"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R005",
      "sourceIds": [
        "SRC-001",
        "SRC-002"
      ],
      "fieldIds": [
        "F010",
        "F013"
      ],
      "materialSlotIds": [
        "M003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R005 考核方案及变更权威引用；T=已有考核方案或有效 T01-T06 决定；F=无调整分支仅沿现有大纲；U=生效状态不明；SRC-001、002；F010、F013；M003；L1/L2 比批准主体、课程、学期、版次及生效日；不得重新批准考核方式；引用有效 PASS_FACT；冲突 CONFLICT；未经确定 NEEDS_HUMAN_DECISION→方案有权机关"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R006",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F015",
        "F016",
        "F017"
      ],
      "materialSlotIds": [
        "M001",
        "M004"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R006 经办/命题人员的真实课程授权；T=有人实际经办或接触试卷；F=未进入人员操作阶段；U=只有 Renderer role/签名图；SRC-001 第 32 条、014（属地线索）；F015–F017；M001、M004；L1 身份与授权历史快照核校方稳定主体、课程/批次、岗位、代理有效时段；不能凭姓名；真实授权 PASS_FACT；越权 CONFLICT，无法认证 NEEDS_HUMAN_DECISION→身份/开课学院"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R007",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F008",
        "F009",
        "F014",
        "F017"
      ],
      "materialSlotIds": [
        "M001",
        "M004"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R007 统一命题的班组职责范围；T=权威任务指定统一命题；F=独立专业课命题；U=组织模式不明；SRC-001 第 32 条、013（院级线索）；F008–F009、F014、F017；M001、M004；L1/L2 比课程组授权覆盖的班与场次，在本学期有效；不能让任一任课教师自动审所有班；一致 PASS_FACT；跨班越权 CONFLICT；范围不明 NEEDS_HUMAN_DECISION→课程组负责人"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R008",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F018",
        "F019",
        "F020",
        "F023",
        "F047"
      ],
      "materialSlotIds": [
        "M006",
        "M007",
        "M010",
        "M027"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R008 A/B 卷存在性及套别绑定；T=本科纸质卷已完稿送审；F=仍在准备或经权威证明非本科；U=F047 为机考/口试等且A/B 等效要求未获当前校规确认；SRC-001 第 32 条；F018–F020、F023、F047；M006、M007、M010、M027（条件）；纸卷 L2 核 A/B 版次；非纸卷先经 R030 确认是否适用等效 A/B，不可凭“非纸卷”自动视为 NOT_APPLICABLE；纸卷同版 PASS_FACT；缺套 NEEDS_MATERIAL；混卷 CONFLICT；载体等效未明 POLICY_UNCONFIRMED→教务处"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R009",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F018",
        "F021",
        "F022",
        "F023",
        "F047"
      ],
      "materialSlotIds": [
        "M008",
        "M009",
        "M010",
        "M027"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R009 答案和评分标准的逐套对应；T=本科纸卷送审；F=尚未送审或非本科；U=非纸卷答案/评分方案等效规范未知；SRC-001 第 32 条；F018、F021–F023、F047；M008、M009、M010、M027（条件）；纸卷逐套核 A/B 的答案与评分标准受控版号；非纸卷按 R030 等效规则另审评分标准，不能自动免除；对应 PASS_FACT；错套 CONFLICT；缺件 NEEDS_MATERIAL；载体不明 POLICY_UNCONFIRMED→命题人与审题人"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R010",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F004",
        "F012",
        "F018",
        "F019",
        "F020",
        "F021",
        "F022",
        "F023",
        "F024",
        "F046"
      ],
      "materialSlotIds": [
        "M002",
        "M006",
        "M007",
        "M008",
        "M009",
        "M011"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R010 内容质量、A/B 相似率与大纲符合性的人审；T=进入实质审题；F=尚未提交；U=院级阈值时效争议；SRC-001 第 32 条、007、013（院例未核）；F004、F012、F018–F024、F046；M002、M006–M009、M011；校级原文含 20% 要求，但院例 10% 的时效/范围未知；受控试题仅由校内有权人员按适用制度审读。L4 不得读取试题/自行计算重复率；无正式审读 NEEDS_HUMAN_DECISION；有权意见存在仅该事实 PASS_FACT；阈值适用不明 POLICY_UNCONFIRMED→课程负责人/教务处"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R011",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F016",
        "F017",
        "F024",
        "F025",
        "F026"
      ],
      "materialSlotIds": [
        "M004",
        "M011"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R011 审题签发者身份、岗位和真实意见；T=声称已有审题意见；F=尚未审题；U=只有上传签字图；SRC-001 第 32 条、011（院例）；F016–F017、F024–F026；M004、M011；L1/L2 核签发人岗位在签发时有该课程/批次审题权、审签状态、时间；不能把院表自动当备案；真实意见 PASS_FACT；越权 CONFLICT；仅图 NEEDS_HUMAN_DECISION→学院有权审核人"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R012",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F009",
        "F018",
        "F019",
        "F020",
        "F021",
        "F022",
        "F023",
        "F024",
        "F025",
        "F026"
      ],
      "materialSlotIds": [
        "M010",
        "M011"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R012 审题意见是否绑定本次实际卷版；T=已有意见要复用于当前卷；F=尚未审题；U=旧表没有可靠卷版 ID；SRC-001 第 32 条、011；F009、F018–F026；M010、M011；L1/L2 比提交组 F023 与签发目标、批次及时间；旧审签不继承给新卷；同版 PASS_FACT；异版 CONFLICT；不能对版 NEEDS_HUMAN_DECISION→签发审核人"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R013",
      "sourceIds": [
        "SRC-001",
        "SRC-008"
      ],
      "fieldIds": [
        "F019",
        "F020",
        "F021",
        "F022",
        "F023",
        "F024",
        "F025",
        "F026",
        "F027",
        "F044"
      ],
      "materialSlotIds": [
        "M011",
        "M012",
        "M022",
        "M023"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R013 退改及二次审题的历史—新版链；T=发生有权退改/修改；F=未发生；U=改动是否实质不明；SRC-001 第 32 条、011（院例）；F019–F027、F044；M011、M012、M022、M023；L2 排序原意见→变更单→新提交组→新签发；保留旧决定原貌，需重新备案与否依 SRC-008 人工核；新链事实 PASS_FACT；缺新版审签 NEEDS_HUMAN_DECISION；套用旧决定 CONFLICT→审题人"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R014",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F024",
        "F028",
        "F029",
        "F030"
      ],
      "materialSlotIds": [
        "M011",
        "M013"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R014 教务处备案事实；T=已申请托印/声称备案；F=仍处命题/审题前阶段；U=是否备案不明；SRC-001 第 32 条、002；F024、F028–F030；M011、M013；L1 备案事件或 L2 校方原回执核机关、编号、状态、时间与任务；不凭本地 approved=true 或院表；已备案事实 PASS_FACT；未办 NEEDS_HUMAN_DECISION；自称已办无源 NEEDS_MATERIAL→教务处"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R015",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F009",
        "F023",
        "F024",
        "F025",
        "F026",
        "F027",
        "F028",
        "F029",
        "F030",
        "F031",
        "F032"
      ],
      "materialSlotIds": [
        "M010",
        "M011",
        "M013",
        "M014"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R015 审题—备案—托印顺序与卷版一致；T=已进入备案/托印；F=尚未申请；U=事件时点/版号无法确认；SRC-001 第 32 条、002、008（细则缺）；F009、F023–F032；M010、M011、M013、M014；L1/L2 比审核卷组 F023、备案版 F029、工单版 F032 及先后签发时间；已知“审核→备案→托印”，但提前天数未知；同版顺序 PASS_FACT；异版/倒序 CONFLICT；授权不明 NEEDS_HUMAN_DECISION→教务处"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R016",
      "sourceIds": [
        "SRC-002",
        "SRC-008"
      ],
      "fieldIds": [
        "F029",
        "F031",
        "F032",
        "F046",
        "F047"
      ],
      "materialSlotIds": [
        "M013",
        "M014",
        "M027"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R016 印制申请/工单真实及权限范围；T=纸质卷存在印制申请/指令；F=尚未到印制或校方正式确定该考核载体不需纸卷印制；U=非纸卷是否应履行等效托印/备案程序不明；SRC-002、008（全文缺）、013（院例）；F029、F031–F032、F046–F047；M013、M014、M027（条件）；纸卷 L1/L2 核工单签发机关、备案、版次、份数；非纸卷先 R030 与教务确认适用制度；不拿无纸质工单直接判缺件或判免审；工单真实 PASS_FACT；执行许可 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→印制/考试平台主管"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R017",
      "sourceIds": [
        "SRC-002",
        "SRC-008",
        "SRC-009"
      ],
      "fieldIds": [
        "F031",
        "F032",
        "F033"
      ],
      "materialSlotIds": [
        "M014",
        "M015"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R017 实印版本与工单份数一致；T=已印毕/交付；F=尚未实际印毕；U=交付状态不明；SRC-002、008、009（采购非校规）；F031–F033；M014、M015；L2 印制交付原件按订单/套别/实数/卷版与当前工单比对；数差仅是事实，不定失泄密责任；时点以交付事件为准；一致 PASS_FACT；差异 CONFLICT→印制点与考务主管"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R018",
      "sourceIds": [
        "SRC-002",
        "SRC-008",
        "SRC-013"
      ],
      "fieldIds": [
        "F033",
        "F034"
      ],
      "materialSlotIds": [
        "M015",
        "M016"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R018 实物封存/入库和在管责任事实；T=试卷已实际入库；F=未交付入库；U=库位状态不清；SRC-002、008、013–014（局部）；F033–F034；M015、M016；L2 对原始入库台账/容器号/保管人/接收时间；具体封签形式和人数未知，不凭设想硬判“封存合规”；入库事实 PASS_FACT；合法封存门槛 POLICY_UNCONFIRMED；缺凭证 NEEDS_MATERIAL→考务保管岗"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R019",
      "sourceIds": [
        "SRC-003",
        "SRC-008",
        "SRC-013"
      ],
      "fieldIds": [
        "F035",
        "F036",
        "F037",
        "F038"
      ],
      "materialSlotIds": [
        "M004",
        "M016",
        "M017"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R019 领卷双方真实授权和数量；T=发生领卷/出库；F=尚未领取；U=是否领取未知；SRC-003、008、013（院级）；F035–F038；M004、M016、M017；L1 当班权限＋L2 两端交接原件，同场次/套别/数量/时点；SRC-003 的 20 分钟仅其通知批次，不作通例；可核 PASS_FACT；不符 CONFLICT；身份未核 NEEDS_HUMAN_DECISION→考务领退负责人"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R020",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F009",
        "F010",
        "F011",
        "F018",
        "F029",
        "F039"
      ],
      "materialSlotIds": [
        "M005",
        "M013",
        "M018"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R020 实际启用卷与排考、备案版一致；T=考试已开考；F=未开考；U=实际卷别不明；SRC-001 第 29、32 条、003；F009–F011、F018、F029、F039；M005、M013、M018；L1/L2 考场启用记录比对考试批次、版次及此前备案；不能拿考后记录要求 P1 提前提交；同批同版 PASS_FACT；错卷 CONFLICT→考务主管及异常处置人"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R021",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F035",
        "F038",
        "F040"
      ],
      "materialSlotIds": [
        "M017",
        "M019"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R021 考后交回数量与领用链一致；T=已进入回收/退交；F=考试未结束；U=回收状态未知；SRC-001 第 34–36 条、003、008（细则缺）；F035、F038、F040；M017、M019；L2 按场次比领用与回收件数、双方/时间；差量不等于盗窃/泄密认定，校方处置规则另核；一致 PASS_FACT；差量 CONFLICT→学院考务保管岗位"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R022",
      "sourceIds": [
        "SRC-002",
        "SRC-003",
        "SRC-008"
      ],
      "fieldIds": [
        "F041",
        "F042"
      ],
      "materialSlotIds": [
        "M020",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R022 保密、错卷等异常事实与事故决定分离；T=异常事实/泄题疑点出现；F=确认无此事件且有可信考务记录；U=是否异常无法核实；SRC-002、003、008（细则缺）、012（仅 G50 技术）；F041–F042；M020、M021；L2 仅核报告编号、时间、受影响卷版；有权事故/纪律机关签发 M021 才能引用结论。调查中 M021 尚未产生非缺件；未公开证据不出域；异常报告存在仅 PASS_FACT；责任/解除风险 NEEDS_HUMAN_DECISION；程序未知 POLICY_UNCONFIRMED→事故/保密主管"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R023",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F008",
        "F009",
        "F010",
        "F011",
        "F039",
        "F040",
        "F041",
        "F042",
        "F043"
      ],
      "materialSlotIds": [
        "M018",
        "M019",
        "M024",
        "M025"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R023 考后档案目录、包及接收事实；T=考试/阅卷已结束且到归档节点；F=仍在考前/考试中；U=应交截止未知；SRC-001 第 34–36 条、004、014（校区线索）；F008–F011、F039–F043；M018、M019、M024、M025；L1/L2 核档案目录、受控包、课程/批次、接收签收与保管人；本科至少四年保管不授权系统自动销毁；归档事实 PASS_FACT；到期缺 NEEDS_MATERIAL；节点未知 POLICY_UNCONFIRMED→档案保管员"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R024",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F018",
        "F019",
        "F020",
        "F021",
        "F022",
        "F023",
        "F027",
        "F028",
        "F029",
        "F030",
        "F031",
        "F032",
        "F044"
      ],
      "materialSlotIds": [
        "M011",
        "M013",
        "M014",
        "M022",
        "M023"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R024 备案/托印后变卷的旧结论失效范围；T=审核/备案版次后发生卷、答案、标准或用途改变；F=有权证实仅补清晰载体不改目标版；U=改动性质不清；SRC-001 第 32 条、008（细则缺）、011（院例）；F018–F023、F027–F032、F044；M011、M013、M014、M022、M023；L2 比旧新受控指纹/签核变更说明；旧校方决定保留历史但不自动覆盖新卷。重新备案或托印程序依主管部门确定；变化被核实 PASS_FACT（仅变更事实），恢复路径 NEEDS_HUMAN_DECISION；旧签借用 CONFLICT→审题/教务/印制"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R025",
      "sourceIds": [
        "SRC-001",
        "SRC-008"
      ],
      "fieldIds": [
        "F015",
        "F016",
        "F031",
        "F032",
        "F044",
        "F045"
      ],
      "materialSlotIds": [
        "M004",
        "M023",
        "M026"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R025 撤回/停办请求与执行权限；T=有权相关人提出请求；F=无请求；U=请求者是否有权或动作已执行状态不明；SRC-001、008（程序缺）、011（院例）；F015–F016、F031–F032、F044–F045；M004、M023、M026；L1/L2 核请求者、原审批/印制链及请求时间；已交卷不能点按钮删档；正式撤回权、机关、期限没有现行校本原文；请求存在仅 PASS_FACT；停办效力 POLICY_UNCONFIRMED＋需人工→原受理/教务/考务主管"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R026",
      "sourceIds": [
        "SRC-001",
        "SRC-011"
      ],
      "fieldIds": [
        "F015",
        "F016",
        "F023",
        "F024",
        "F025",
        "F026",
        "F027",
        "F028",
        "F029",
        "F030",
        "F044",
        "F045"
      ],
      "materialSlotIds": [
        "M011",
        "M013",
        "M023",
        "M026"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R026 审题异议/复核请求与答复；T=确有异议/复核请求；F=无请求；U=申请资格/复核程序未知；SRC-001、011（退改院例非复议权）；F015–F016、F023–F030、F044–F045；M011、M013、M023、M026；L1/L2 独立保存请求与原决定、目标版次及后续有权答复，不因复核自动废止原决定；正式层级/期限待确认；收件事实 PASS_FACT；合法程序 POLICY_UNCONFIRMED，实质结论 NEEDS_HUMAN_DECISION→有权复核机关"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R027",
      "sourceIds": [
        "SRC-001",
        "SRC-006"
      ],
      "fieldIds": [
        "F002",
        "F003",
        "F004",
        "F012",
        "F013",
        "F046"
      ],
      "materialSlotIds": [
        "M001",
        "M002",
        "M003"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R027 校本/院系依据的效力和适用边界；T=拟按政策设硬事实或阈值；F=纯案卷索引无需政策阈值；U=生效/院校区/批次不明；SRC-001、006–008、010–011、013–016（016 历史表）；F002–F004、F012–F013、F046；M001、M002、M003；L0 分学校/学院/校区与新旧版本核实际适用；2022 校规 20%、旧院例 10% 差异须有权解释；2017 纸表与 2018 细则无当期效力核验不可硬套；适用事实可核 PASS_FACT；未知 POLICY_UNCONFIRMED→教务处/制度归口"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R028",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F003",
        "F004",
        "F016",
        "F028",
        "F029",
        "F030",
        "F031"
      ],
      "materialSlotIds": [
        "M004",
        "M013",
        "M014"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R028 宜宾属地经办与校级备案是否各自有权；T=宜宾校区且进入备案/印制；F=其他校区；U=校区是否受委托备案未知；SRC-001 第 32 条、014；F003–F004、F016、F028–F031；M004、M013、M014；P0 仅核校区和 M004 角色；P3 才纳入 M013/M014。L1/L2 分别核校区考试组织/印制职责和学校教务处备案原权；岗位职责网站不是授权下放文；各自事实 PASS_FACT；下放不明 POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION→教务处＋宜宾教务工作部"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R029",
      "sourceIds": [
        "SRC-001",
        "SRC-002",
        "SRC-012"
      ],
      "fieldIds": [
        "F008",
        "F009",
        "F010",
        "F013",
        "F016",
        "F041",
        "F042"
      ],
      "materialSlotIds": [
        "M001",
        "M003",
        "M004",
        "M005",
        "M021"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R029 R02/G50 已有决定只引用、不重决；T=人员任务/任课资格、方案、学生补缓考、成绩或独立 G04 安全许可需外部决定；F=无此依赖；U=决定源/权限不可证；SRC-001、002、012（G50 非法规）；F008–F010、F013、F016、F041–F042；M001、M003、M004、M005、M021；L1/L2 核签发机关、决定 ID、对象、效力时点；S02 不审卷、T06-T04 授任课资格、T01-T02 改教学任务、T01-T06 审考核方案；G04 未被证明拥有试题保密事故处理权，只有其真实独立安全决定可引用；权威引用 PASS_FACT；模型代签 CONFLICT；源失联 SOURCE_UNAVAILABLE→各真实签发 Owner"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R030",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F009",
        "F013",
        "F018",
        "F023",
        "F047"
      ],
      "materialSlotIds": [
        "M001",
        "M003",
        "M027"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R030 机考/在线/口试/实践等非纸卷载体及等效命题证据分流；T=F047 由权威任务证实非纸卷且进入 P1 送审；F=权威证实为纸质本科 A/B 卷或尚未到 P1；U=载体/等效规范不明；SRC-001 第 27、32 条、003、006、019（仅跨校启发）；F009、F013、F018、F023、F047；M001、M003、M027；校方考核方案确定形态，L2 核已授权配置/受控题库或题签版本、负责审题人及与考试批次关联；A/B 是否等效、电子封存流程需校方确定。只有纸卷才回到 R008–R009 的原版证据槽，不强制要求电子考试产生纸卷印制工单；载体事实可核 PASS_FACT（不代表免审）；缺 M027 NEEDS_MATERIAL；许可未知 POLICY_UNCONFIRMED→教务处/开课学院，非纸卷未必触发 R016–R019"
    },
    {
      "sectionId": "evidence-checks",
      "criterionId": "R031",
      "sourceIds": [
        "SRC-001"
      ],
      "fieldIds": [
        "F015",
        "F016",
        "F048"
      ],
      "materialSlotIds": [
        "M004",
        "M028"
      ],
      "evidenceStatus": "PARTIAL",
      "sourceText": "R031 敏感试题/身份/考后数据的本次读取与第三方处理许可；T=拟实际读取、传输、存储、自动分析受控内容/个人信息；F=仅公共政策公开资料研究或不触及受限数据；U=动作范围/授权源不明；SRC-001 第 32 条、008（校本细则缺）、017；F015–F016、F048；M004、M028；执行动作前 L1/L2 核批准目的、数据类别、操作者岗位、目的地、有效区间、撤销状态和可用技术环境。研究设计阶段仅说明门槛，不需要真实许可；真实运行未获授权绝不执行 P3 读取或外传。合法的校内人审可通过独立受控流程继续；有效许可仅许可事实 PASS_FACT；缺政策 POLICY_UNCONFIRMED/人工停动作，源失联 SOURCE_UNAVAILABLE，超范围 CONFLICT→学校数据治理＋考试保密主管"
    }
  ],
  "sources": [
    {
      "id": "SRC-001",
      "title": "SRC-001 CDUT-VERIFIED；成都理工大学；《成都理工大学本科课程教学基本规范》（成理校教〔2022〕11号），第 29、32、34–36、43–44 条；汇编 PDF 第 18–29 页（0 起计），原文印刷页 15–26；印发 2022-06-04；第 43 条自印发实施，废止的是 2018 年《教师本科教学工作规范》；本规范未查到废止通知，2025 考务通知仍援引；https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "url": "https://cnae.cdut.edu.cn/__local/B/CD/55/1347E45BA0243810CF9A9F4D250_EAEE3C55_77A641.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-002",
      "title": "SRC-002 CDUT-VERIFIED；成都理工大学教务处，《关于做好2024-2025学年第二学期期末课程考试工作安排及要求的通知》（教通字〔2025〕25号；具体标题按原公文内容概括），PDF 第 1–2 页，第二、四部分；2025-06-23；当期通知，非永久办法；无废止条文；https://www.aao.cdut.edu.cn/__local/A/A9/09/0D8AFAFE17938B772AAD0DE0803_19FDF450_3E3B5.pdf",
      "url": "https://www.aao.cdut.edu.cn/__local/A/A9/09/0D8AFAFE17938B772AAD0DE0803_19FDF450_3E3B5.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-003",
      "title": "SRC-003 CDUT-VERIFIED；成都理工大学教务处，教通字〔2025〕59号，2025-2026 学年第一学期期末课程考试工作安排（依正文），PDF 第 1–3 页，第二、四部分；2025-12-25；针对 2025-2026-1 考试批次；https://aao.cdut.edu.cn/__local/F/02/A6/0340BCDBCC4E8B384C66750E7B3_0949CB5E_42625.pdf",
      "url": "https://aao.cdut.edu.cn/__local/F/02/A6/0340BCDBCC4E8B384C66750E7B3_0949CB5E_42625.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-004",
      "title": "SRC-004 CDUT-VERIFIED；成都理工大学，《关于开展2025年秋季学期期中教学检查的通知》（成理校教〔2025〕23号），PDF 第 1–3 页，第一、二部分；2025-11-18；当期检查通知；https://jypjyddc.cdut.edu.cn/__local/0/0A/64/24C915DF5B5D47B13E97AA06829_E51F6669_25E2D.pdf",
      "url": "https://jypjyddc.cdut.edu.cn/__local/0/0A/64/24C915DF5B5D47B13E97AA06829_E51F6669_25E2D.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-005",
      "title": "SRC-005 CDUT-VERIFIED；成都理工大学，《研究生培养环节管理办法（试行）》（成理校研〔2021〕12号），PDF 第 1–4 页，第 2、4–8 条；2021-06-09；未见废止信息，2026 现行性继续询研究生院；https://energy.cdut.edu.cn/__local/B/66/CD/D11DA75E84C7FCDD25CBC557422_EF1ADD3A_555F8.pdf",
      "url": "https://energy.cdut.edu.cn/__local/B/66/CD/D11DA75E84C7FCDD25CBC557422_EF1ADD3A_555F8.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "PARTIAL"
    },
    {
      "id": "SRC-006",
      "title": "SRC-006 CURRENTITY-UNKNOWN；成都理工大学，《课程考核管理规定》（成理校教〔2017〕28号），学院 2022 汇编 PDF 第 58–67 页，第 7–10、19、31 条等；2017-12-05；2026 是否被整体/部分更新不明，2022 规范存在后发相近条款；同 SRC-001 PDF，文本约第 1144–1340 行",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-007",
      "title": "SRC-007 CURRENTITY-UNKNOWN；成都理工大学马克思主义学院，《马克思主义学院教学管理制度》，网页“试卷命题工作管理”“试卷收交、整理和归档”部分；网页搜索显示约 2017 年；未见生效/废止通知；https://marx.cdut.edu.cn/info/1053/1208.htm",
      "url": "https://marx.cdut.edu.cn/info/1053/1208.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-008",
      "title": "SRC-008 CURRENTITY-UNKNOWN；成都理工大学《试卷印制管理办法》（成理校教〔2018〕22号）/ 文中另称《试卷制作及管理办法》；由 SRC-002 第二、四部分及 SRC-006 第十条转引；2018 文号仅通过 2025 通知确认；原发文日、施行日、修订/废止均未知；原件 URL 未取得；实际检索：site:cdut.edu.cn \"成理校教〔2018〕22号\"、\"成都理工大学试卷制作及管理办法\"、教务处网站及 SRC-002 交叉查找",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-009",
      "title": "SRC-009 CURRENTITY-UNKNOWN；成都理工大学教务处，《成都理工大学印刷服务采购项目比选公告》，检索可见采购要求中“试卷印刷需满足学校保密要求”、运输印刷保管专人、保密承诺；搜索显示约 2024 年；具体公告时间、合同有效期/是否成交及现行采购范围待核；https://www.aao.cdut.edu.cn/__local/D/AF/23/7EE6014217C22464B2441AA4D50_0EF972A1_1F312.pdf",
      "url": "https://www.aao.cdut.edu.cn/__local/D/AF/23/7EE6014217C22464B2441AA4D50_0EF972A1_1F312.pdf",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-010",
      "title": "SRC-010 CURRENTITY-UNKNOWN；成都理工大学教务处首页，列示《关于做好2025-2026学年第二学期期末课程考试安排及监巡考…》；首页列表显示 2026-06-30；正式通知文号、正文、终止日未知；https://aao.cdut.edu.cn/ （“教务通知”栏目；搜索该精确题名/2026-06-30）",
      "url": "https://aao.cdut.edu.cn/",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-011",
      "title": "SRC-011 CURRENTITY-UNKNOWN；成都理工大学核技术与自动化工程学院，2021 年 1 月《课程质量评价实施细则》及附件《试卷考核内容审核表》，汇编 PDF 约第 141–150 页；文本落款 2021-01-01；2026 是否续行不明；同 SRC-001 PDF；原文约第 2780–2906、3000–3043 行",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-012",
      "title": "SRC-012 GENERAL-RESEARCH；GitHub Fuck-GH-Admin/cdut-studio-review-agent，D4 统一 G50 catalog.json，templateCount=50、authoritativeSchoolTemplate=false、publicationAllowed=false；技术参考固定 SHA 7b6cdc843d26e926c0c63b8c51a451ff3925cfad；不涉及法规生效/废止；https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json",
      "url": "https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/blob/7b6cdc843d26e926c0c63b8c51a451ff3925cfad/docs/design/review-agent/acceptance/d4-unified-r01/catalog.json",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-013",
      "title": "SRC-013 CURRENTITY-UNKNOWN；成都理工大学传播科学与艺术学院，《传播科学与艺术学院考务工作规范（试行）》，2023-02-22 公开网页，“命题”“制卷”小节；检索索引显示院内《成都理工大学课程试卷印制申请表》及 A/B 卷、参考答案、评分标准、系审核、学院考务管理员；网页日期 2023-02-22；试行文件生效、修订、废止及 2026 实际执行情况未知；https://ccsa.cdut.edu.cn/info/1034/1892.htm",
      "url": "https://ccsa.cdut.edu.cn/info/1034/1892.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-014",
      "title": "SRC-014 CURRENTITY-UNKNOWN；成都理工大学宜宾校区，《教务工作部部门职责》，2026-04-10，第一、三部分；索引描述课程考试组织（缓补/期中/期末）、试卷印制、档案管理；2026-04-10；岗位职责更新/废止不明；https://yb.cdut.edu.cn/info/1091/4509.htm",
      "url": "https://yb.cdut.edu.cn/info/1091/4509.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-015",
      "title": "SRC-015 CURRENTITY-UNKNOWN；成都理工大学、核技术与自动化工程学院转载《成都理工大学研究生课程建设及课程管理办法（暂行）》，2018-01-09 网页，第 19–22、26 条；索引显示任课教师依大纲命题、研究生公共学位课统一安排；网页发布日期 2018-01-09；第 26 条载明 2018 年 1 月施行并废止旧研究生课程文件；2026 是否被后续文件替代不明；https://cnae.cdut.edu.cn/info/1040/1425.htm",
      "url": "https://cnae.cdut.edu.cn/info/1040/1425.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-016",
      "title": "SRC-016 CURRENTITY-UNKNOWN；成都理工大学《课程试卷印制申请表》，2017《课程考核管理规定》后附表，旧候选版已指明汇编 PDF 0 基第 68 页 / PDF 第 69 页 / 页内印刷 65；旧版记录有教师填报、系部审核、教务处备案、学院教务科填写的栏目；随 2017 规章汇编留存，2026 是否仍为现用表格未知，可能已被新表/电子流程替换；同 SRC-001 PDF，目标 PDF 物理页 69；本轮网页截图请求超时，只作为旧候选可定位线索，未再次独立核到扫描表每一栏",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-017",
      "title": "SRC-017 GENERAL-RESEARCH；全国人大常委会《中华人民共和国个人信息保护法》，第 6、13、21、24、28、51、55 条等；国家网信办转载原文；2021-08-20 通过，2021-11-01 施行；本次核公开法条，若后续修订依现行官报；https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm",
      "url": "https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-018",
      "title": "SRC-018 GENERAL-RESEARCH；教育部《关于印发〈2016年普通高等学校招生全国统一考试考务工作规定〉的通知》，第 10 条援引国家教育考试保密规定；教育部原文；2016 年文件，当前是否修订另核；适用国家高考等其法定范围，非一般校内课程考试；https://www.moe.gov.cn/srcsite/A15/moe_776/s3258/201604/t20160411_237531.html",
      "url": "https://www.moe.gov.cn/srcsite/A15/moe_776/s3258/201604/t20160411_237531.html",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "id": "SRC-019",
      "title": "SRC-019 CROSS-SCHOOL-REFERENCE；湖南师范大学医学部公开《教务办管理规章制度》中的课程考核、命题审核与试卷管理片段，如第四十三至四十四条及后段第十二至十八条；该网页含不同年份、多套规章，必须按各原章归属辨别；该页汇编有 2014 年旧文及其他时期制度；当前完整效力与适用部门均非成都理工；只作结构启发；https://med.hunnu.edu.cn/info/1628/9977.htm",
      "url": "https://med.hunnu.edu.cn/info/1628/9977.htm",
      "sourceType": "research-source-index",
      "evidenceStatus": "UNCONFIRMED"
    }
  ],
  "securityGates": {
    "unissuedExamContentExternalTransfer": "DENY_UNTIL_SCHOOL_ACTION_AUTHORIZATION",
    "confidentialMaterialSlotIds": [
      "M006",
      "M007",
      "M008",
      "M009",
      "M025"
    ],
    "authorizationSlotId": "M028",
    "authorizationRuleId": "R031",
    "enforcementOwner": "V3 Main/ingestion integration; template metadata alone does not enforce network/AI egress"
  }
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = T01T05_TEMPLATE
