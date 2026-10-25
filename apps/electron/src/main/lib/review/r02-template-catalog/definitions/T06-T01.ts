// Generated from the reviewed R02 research document. This is not a school-issued template.
import type { TemplateVersion } from '@profer/shared'

export const templateVersion: TemplateVersion = {
  "templateId": "T06-T01",
  "version": 1,
  "schemaVersion": 2,
  "name": "研究生导师资格遴选、复审、状态变更与停招恢复审核",
  "description": "研究生导师资格遴选、复审、状态变更与停招恢复审核。本地研究模板 · 非校方正式模板；校本政策证据为部分核实，未知条件只生成事实核验和人工复核建议。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 研究稿用于本地辅助审查，不是校方正式模板、政策版本或授权决定。当前政策证据状态 PARTIAL；不得据此自动批准或拒绝。",
  "objectType": "person",
  "displayName": {
    "template": "研究生导师资格遴选、复审、状态变更与停招恢复审核"
  },
  "fields": [
    {
      "key": "F001",
      "label": "案卷唯一号：字符串",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "F001；案卷唯一号：字符串；CASE/P0；系；M030；L1；人审（重号或关联错误）"
    },
    {
      "key": "F002",
      "label": "自然人唯一身份主键：不可直接显示的标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F002；自然人唯一身份主键：不可直接显示的标识；PERSON/P0；人、学；M002/M004；L3；查/冲；不得用姓名替代"
    },
    {
      "key": "F003",
      "label": "姓名及曾用名：字符串集合",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F003；姓名及曾用名：字符串集合；PERSON/P0；人；M002；L2；查/冲；同名需核 F002"
    },
    {
      "key": "F004",
      "label": "所属培养单位/合作单位：机构标识",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F004；所属培养单位/合作单位：机构标识；PERSON/P0；人、学；M003/M013；L1；查；双归属人审"
    },
    {
      "key": "F005",
      "label": "身份类别：在职/外聘/名誉兼职/调离",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F005；身份类别：在职/外聘/名誉兼职/调离；PERSON/P0；人、学；M002/M003/M013；L2；查/人审"
    },
    {
      "key": "F006",
      "label": "在岗、调离和聘用状态：带有效期枚举",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F006；在岗、调离和聘用状态：带有效期枚举；PERSON/P0、P7；人；M003；L2；查/冲"
    },
    {
      "key": "F007",
      "label": "导师层次与类别：硕/博/专业行业等",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F007；导师层次与类别：硕/博/专业行业等；SCOPE/P0；学；M004/M005；L1；查/策"
    },
    {
      "key": "F008",
      "label": "所属学位点、一级学科/专业领域代码",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F008；所属学位点、一级学科/专业领域代码；SCOPE/P0；学；M004/M005；L1；查/冲"
    },
    {
      "key": "F009",
      "label": "办理情形 A—H2/I：枚举",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F009；办理情形 A—H2/I：枚举；CASE/P0；系＋承办确认；M030；L1；人审（路由未知）"
    },
    {
      "key": "F010",
      "label": "申请年度/批次与接收节点：期间、时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F010；申请年度/批次与接收节点：期间、时间；APPLICATION/P0；校、学；M031；L1；策；不能借往年期限"
    },
    {
      "key": "F011",
      "label": "校级/学院政策版本、生效区间：来源引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F011；校级/学院政策版本、生效区间：来源引用；CASE/P0；学；M005/M031；L1；策（无现行文本）"
    },
    {
      "key": "F012",
      "label": "申请意愿、情形、本人确认：文本/时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F012；申请意愿、情形、本人确认：文本/时间；APPLICATION/P1；自，经机构受理；M001/M012/M028；L2；补（本人发起时）；机关触发后"
    },
    {
      "key": "F013",
      "label": "代办人身份及授权边界：签署权限对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F013；代办人身份及授权边界：签署权限对象；APPLICATION/P1；自＋校验证；M014/M032；L3；代理时补/人审，否则后"
    },
    {
      "key": "F014",
      "label": "学历学位、颁授信息：凭证引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F014；学历学位、颁授信息：凭证引用；FACT/P1—P2；人/校核；M006；L2；按适用条件补/查"
    },
    {
      "key": "F015",
      "label": "职称、岗位聘任类别：枚举及期限",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F015；职称、岗位聘任类别：枚举及期限；FACT/P1—P2；人；M003/M006；L2；查/策"
    },
    {
      "key": "F016",
      "label": "研究方向、学科对应：文本/学科码",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F016；研究方向、学科对应：文本/学科码；FACT/P1—P2；自＋学核；M007；L1；按申请分支补/策"
    },
    {
      "key": "F017",
      "label": "科研项目类型、负责人和期间：权威引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F017；科研项目类型、负责人和期间：权威引用；FACT/P2；科；M008；L2；查/冲/策"
    },
    {
      "key": "F018",
      "label": "可用经费口径及核算时点：金额/说明",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F018；可用经费口径及核算时点：金额/说明；FACT/P2；科；M009；L2；查/策；不自造阈值"
    },
    {
      "key": "F019",
      "label": "论文成果、知识产权等归属及认定：集合",
      "kind": "object",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F019；论文成果、知识产权等归属及认定：集合；FACT/P2；科；M010；L2；查/冲/策"
    },
    {
      "key": "F020",
      "label": "授课、研究生指导或实践指导经历：时段/证明",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F020；授课、研究生指导或实践指导经历：时段/证明；FACT/P2；校/科；M007；L2；按分支补/查"
    },
    {
      "key": "F021",
      "label": "师德与研究诚信有效结论：文号/密级",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F021；师德与研究诚信有效结论：文号/密级；FACT/P2、P7；人/校调查归口；M011/M023；L3；查/人审；不凭传闻认定"
    },
    {
      "key": "F022",
      "label": "指导质量、纪律、健康履职的已核事实：事件引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F022；指导质量、纪律、健康履职的已核事实：事件引用；FACT/P6—P7；校、学；M022/M023；L3；查/人审；病情只取合法必要结论"
    },
    {
      "key": "F023",
      "label": "原资格及各学位点状态：枚举/效期",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F023；原资格及各学位点状态：枚举/效期；STATUS/P0、P6；学；M004/M019；L2；查/冲；无原决定不得复岗"
    },
    {
      "key": "F024",
      "label": "行业合作/导师聘任协议范围：合同引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F024；行业合作/导师聘任协议范围：合同引用；PERSON/P1、P7；人/校；M013；L2；C/D1 条件必需；查/补"
    },
    {
      "key": "F025",
      "label": "聘约或合作失效/调离时间：日期",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F025；聘约或合作失效/调离时间：日期；PERSON/P0、P7；人；M003/M013；L2；查/冲"
    },
    {
      "key": "F026",
      "label": "申请提交/撤回时间与渠道：事件时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F026；申请提交/撤回时间与渠道：事件时间；APPLICATION/P1；校、系；M001/M012/M028/M030；L1；查；提交时间争议人审"
    },
    {
      "key": "F027",
      "label": "承办与职能部门核验意见：签署记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F027；承办与职能部门核验意见：签署记录；FACT/P2；校、科；M015；L1；后；P2 到期查/人审"
    },
    {
      "key": "F028",
      "label": "学位分委员会/专家意见：表决记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F028；学位分委员会/专家意见：表决记录；DECISION/P3；会；M016；L2；后；P3 到期人审"
    },
    {
      "key": "F029",
      "label": "会议成员、人数、合法表决：机构/数值",
      "kind": "number",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F029；会议成员、人数、合法表决：机构/数值；DECISION/P3；会；M016/M032；L2；后/策/人审；不猜法定人数"
    },
    {
      "key": "F030",
      "label": "公示开始结束与适用期限：时间区间",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F030；公示开始结束与适用期限：时间区间；DECISION/P4；校；M017；L0（公示范围内）；后/策"
    },
    {
      "key": "F031",
      "label": "异议事实、处理结论及送达：受限记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F031；异议事实、处理结论及送达：受限记录；DECISION/P4/P8；校、会；M018/M028；L3；无异议则后；有异议人审"
    },
    {
      "key": "F032",
      "label": "生效审批/聘任主体、文号、日期：决定引用",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F032；生效审批/聘任主体、文号、日期：决定引用；DECISION/P5；学、会；M019/M032；L1；后；未经核签不可批准"
    },
    {
      "key": "F033",
      "label": "岗位资格当前状态与生效/截止日期：枚举",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F033；岗位资格当前状态与生效/截止日期：枚举；STATUS/P5/P7/P8；学及对应生效决定；M004/M019/M025/M026/M029；L2；查/冲；不可由自报写入"
    },
    {
      "key": "F034",
      "label": "备案机关、时间和回执：机构事件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F034；备案机关、时间和回执：机构事件；DECISION/P5/P7；学；M020/M025/M026；L1；后；备案≠批准"
    },
    {
      "key": "F035",
      "label": "上岗导师培训完成时间/结论：权威引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F035；上岗导师培训完成时间/结论：权威引用；FACT/P6/上岗前；学；M021；L2；后/查；勿反向否定岗位资格"
    },
    {
      "key": "F036",
      "label": "年度招生资格结论：外部决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F036；年度招生资格结论：外部决定引用；LINK/P6—P7；邻（T06-T02）；M024；L2；查；未取得不得臆造不通过"
    },
    {
      "key": "F037",
      "label": "招生名额、限招：外部决定引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F037；招生名额、限招：外部决定引用；LINK/P6；邻（T06-T03）；M024；L2；查；只做背景引用"
    },
    {
      "key": "F038",
      "label": "暂停事由及已核触发日期：事件引用",
      "kind": "date",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F038；暂停事由及已核触发日期：事件引用；STATUS/P7；校、邻；M023/M024；L3；查/人审；疑点≠正式停招"
    },
    {
      "key": "F039",
      "label": "取消资格提案/复核/批准链：三段签署",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F039；取消资格提案/复核/批准链：三段签署；DECISION/P7；会、学；M026/M032；L3；后；缺任一环不可生效"
    },
    {
      "key": "F040",
      "label": "恢复、更正或重新申请的请求与理由：文本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F040；恢复、更正或重新申请的请求与理由：文本；APPLICATION/P8；自/校受理；M028；L2；本人申请时补，机关启动时后"
    },
    {
      "key": "F041",
      "label": "有权机关的更正/解除/重新批准：引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F041；有权机关的更正/解除/重新批准：引用；DECISION/P8；会、学；M029/M019；L2；后/人审；权限未明确策"
    },
    {
      "key": "F042",
      "label": "材料版本、归属、哈希及替代链：结构数据",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F042；材料版本、归属、哈希及替代链：结构数据；AUDIT/全阶段；系＋校证据源；M030；L1；冲/人审；旧结论失效重审"
    },
    {
      "key": "F043",
      "label": "操作者身份、真实授权、签发权限：权限记录",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F043；操作者身份、真实授权、签发权限：权限记录；AUDIT/全阶段；校、会；M032/M030；L3；人审；客户端角色永不采信"
    },
    {
      "key": "F044",
      "label": "存量受指导学生交接安排：保密记录引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F044；存量受指导学生交接安排：保密记录引用；LINK/P7—P8；学、邻（S08）；M027；L3；后/查；不得替 S08 更改导师"
    },
    {
      "key": "F045",
      "label": "补件、撤回、异议、复核事件链：类型/版本/时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "subject",
      "extractionHint": "F045；补件、撤回、异议、复核事件链：类型/版本/时间；AUDIT/P1—P8；系、校；M018/M028/M030；L2；无事件为后；有争议人审"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "新增硕导申请及本人声明；本人、受理学院；2018 校级“新增硕士学位研究生指导教师审核登记表”或当期核定表",
      "purpose": "M001；新增硕导申请及本人声明；本人、受理学院；2018 校级“新增硕士学位研究生指导教师审核登记表”或当期核定表；A P1 当；其他要求此表时条；当期校方认可的电子申报记录或分类表；F012/F026；002/003；v：申请本人+学位点；真缺补，格式政策未知策；不可读重交可核副本",
      "requiredElements": [
        "新增硕导申请及本人声明；本人、受理学院；2018 校级“新增硕士学位研究生指导教师审核登记表”或当期核定表",
        "A P1 当；其他要求此表时条",
        "当期校方认可的电子申报记录或分类表",
        "F012/F026；002/003",
        "v：申请本人+学位点；真缺补，格式政策未知策；不可读重交可核副本"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "主体唯一身份、职工/合作身份；人事、学院、合作单位的身份记录",
      "purpose": "M002；主体唯一身份、职工/合作身份；人事、学院、合作单位的身份记录；P0 当+内；合法授权的人事主数据核验函、学校认同的校外合作身份登记；F002/F003/F005；001/002；v：自然人非姓名；源不可达查，冲突人审；证件扫描优先避免重复",
      "requiredElements": [
        "主体唯一身份、职工/合作身份；人事、学院、合作单位的身份记录",
        "P0 当+内",
        "合法授权的人事主数据核验函、学校认同的校外合作身份登记",
        "F002/F003/F005；001/002",
        "v：自然人非姓名；源不可达查，冲突人审；证件扫描优先避免重复"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "在岗、职称聘任、调离/退休/合同有效期；人事部门",
      "purpose": "M003；在岗、职称聘任、调离/退休/合同有效期；人事部门；P0/P7 条+内；有效人事证明、单位盖章聘任/调动文书；F004/F006/F015/F025；001/002；v：人员岗位及生效区间；缺先查、受理前政策未明策",
      "requiredElements": [
        "在岗、职称聘任、调离/退休/合同有效期；人事部门",
        "P0/P7 条+内",
        "有效人事证明、单位盖章聘任/调动文书",
        "F004/F006/F015/F025；001/002",
        "v：人员岗位及生效区间；缺先查、受理前政策未明策"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "已任资格与原学位点/层次、停招现状；研究生管理权威台账",
      "purpose": "M004；已任资格与原学位点/层次、停招现状；研究生管理权威台账；P0 当+内；正式聘任/批准决定与后续变更文书可组成完整状态链；F007/F008/F023/F033；001；v：导师唯一人+层次+学位点；源无查，不凭自述认定",
      "requiredElements": [
        "已任资格与原学位点/层次、停招现状；研究生管理权威台账",
        "P0 当+内",
        "正式聘任/批准决定与后续变更文书可组成完整状态链",
        "F007/F008/F023/F033；001",
        "v：导师唯一人+层次+学位点；源无查，不凭自述认定"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "适用校规、学院学位点细则与授权版本；研究生院/培养单位制度库",
      "purpose": "M005；适用校规、学院学位点细则与授权版本；研究生院/培养单位制度库；P0 当+内；能核发文机关、发文号、效期的当期纸本或盖章扫描；F007/F008/F011；001/002/003/010；v：批次/学位点/制度生效日；缺策，旧政策不得默认续用",
      "requiredElements": [
        "适用校规、学院学位点细则与授权版本；研究生院/培养单位制度库",
        "P0 当+内",
        "能核发文机关、发文号、效期的当期纸本或盖章扫描",
        "F007/F008/F011；001/002/003/010",
        "v：批次/学位点/制度生效日；缺策，旧政策不得默认续用"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M006",
      "name": "学位、学历、职称等资格事实；本人线索、人事/颁证机构核验",
      "purpose": "M006；学位、学历、职称等资格事实；本人线索、人事/颁证机构核验；新增 P1—P2 条；有权颁证机关可验证记录或经校方采信的人事核实函；F014/F015；002/003/010；v：本人与证照编号；缺补或先查；外国学位等口径策",
      "requiredElements": [
        "学位、学历、职称等资格事实；本人线索、人事/颁证机构核验",
        "新增 P1—P2 条",
        "有权颁证机关可验证记录或经校方采信的人事核实函",
        "F014/F015；002/003/010",
        "v：本人与证照编号；缺补或先查；外国学位等口径策"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "指导经历、课程/研究方向、实践能力；本人、学院/教务部门",
      "purpose": "M007；指导经历、课程/研究方向、实践能力；本人、学院/教务部门；新增 P1—P2 条；经院系/教务核定的履历、教学工作量或实践基地记录；F016/F020；002/003/010；v：人+学科+时期；不足可补，跨校经历需真实性核验",
      "requiredElements": [
        "指导经历、课程/研究方向、实践能力；本人、学院/教务部门",
        "新增 P1—P2 条",
        "经院系/教务核定的履历、教学工作量或实践基地记录",
        "F016/F020；002/003/010",
        "v：人+学科+时期；不足可补，跨校经历需真实性核验"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "在研项目、负责人、研究方向事实；科研管理部门",
      "purpose": "M008；在研项目、负责人、研究方向事实；科研管理部门；新增 P2 条+内；学校科研部门核对函、原项目主管部门权威台账；F017；002/003；v：项目编号+本人角色+考核期；来源断查，争议冲",
      "requiredElements": [
        "在研项目、负责人、研究方向事实；科研管理部门",
        "新增 P2 条+内",
        "学校科研部门核对函、原项目主管部门权威台账",
        "F017；002/003",
        "v：项目编号+本人角色+考核期；来源断查，争议冲"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "经费余额/可支配属性及统计时点；科研/财务部门",
      "purpose": "M009；经费余额/可支配属性及统计时点；科研/财务部门；新增 P2 条+内；双方职能部门联合核验的正式资金证明；F018；002/003；v：项目/账户/时点；缺查，口径未知策；私人银行流水不默认等价",
      "requiredElements": [
        "经费余额/可支配属性及统计时点；科研/财务部门",
        "新增 P2 条+内",
        "双方职能部门联合核验的正式资金证明",
        "F018；002/003",
        "v：项目/账户/时点；缺查，口径未知策；私人银行流水不默认等价"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "论文、专利、奖励等成果归属/等级事实；科研部门/认定机构",
      "purpose": "M010；论文、专利、奖励等成果归属/等级事实；科研部门/认定机构；新增 P2 条+内；可溯源数据库记录+校内有权认定函；F019；002/003/010；v：成果唯一号、署名、申报年；缺查/补，归属争议冲",
      "requiredElements": [
        "论文、专利、奖励等成果归属/等级事实；科研部门/认定机构",
        "新增 P2 条+内",
        "可溯源数据库记录+校内有权认定函",
        "F019；002/003/010",
        "v：成果唯一号、署名、申报年；缺查/补，归属争议冲"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "师德师风、学术诚信或培养负面事实的正式有效结论；归口人事/调查机关",
      "purpose": "M011；师德师风、学术诚信或培养负面事实的正式有效结论；归口人事/调查机关；当期要求 P2 条+内；P7 条+内；权威部门仅提供可公开核验的有效结论及限制说明；F021/F022；001；v：人+处分/结论有效期，L3；不可取得查/人审；传闻不能替代",
      "requiredElements": [
        "师德师风、学术诚信或培养负面事实的正式有效结论；归口人事/调查机关",
        "当期要求 P2 条+内；P7 条+内",
        "权威部门仅提供可公开核验的有效结论及限制说明",
        "F021/F022；001",
        "v：人+处分/结论有效期，L3；不可取得查/人审；传闻不能替代"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "博导新增或直接认定申报意愿和资格简况；本人/学院",
      "purpose": "M012；博导新增或直接认定申报意愿和资格简况；本人/学院；B1/B2 P1 条（仅当期准用时当）；当年学校发布的新类别表或经确认的线上申报单；F012/F026；004/010/011/016；v：本人+博士点+渠道；2023 表名只作样式线索；无 2026 表策",
      "requiredElements": [
        "博导新增或直接认定申报意愿和资格简况；本人/学院",
        "B1/B2 P1 条（仅当期准用时当）",
        "当年学校发布的新类别表或经确认的线上申报单",
        "F012/F026；004/010/011/016",
        "v：本人+博士点+渠道；2023 表名只作样式线索；无 2026 表策"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "行业导师合作协议、聘书和终止时点；培养单位、合作单位",
      "purpose": "M013；行业导师合作协议、聘书和终止时点；培养单位、合作单位；C/D1 P0—P2 条；P7 到期条；经双方有权机关确认的合同台账或有效聘书；F004/F005/F024/F025；001 第8、9、15条；v：聘用双方/期限/岗位；无协议查/补，超期不得沿用旧聘任",
      "requiredElements": [
        "行业导师合作协议、聘书和终止时点；培养单位、合作单位",
        "C/D1 P0—P2 条；P7 到期条",
        "经双方有权机关确认的合同台账或有效聘书",
        "F004/F005/F024/F025；001 第8、9、15条",
        "v：聘用双方/期限/岗位；无协议查/补，超期不得沿用旧聘任"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "代理人是否有代办、撤回授权；本人及校内授权机构",
      "purpose": "M014；代理人是否有代办、撤回授权；本人及校内授权机构；仅代办 P1 条；校方认可可核的委托书及被代理人身份核验；F013/F043；001（制度未规定细表）；v：委托人/代理人/权限/时段，L3；缺补，签章真伪人审",
      "requiredElements": [
        "代理人是否有代办、撤回授权；本人及校内授权机构",
        "仅代办 P1 条",
        "校方认可可核的委托书及被代理人身份核验",
        "F013/F043；001（制度未规定细表）",
        "v：委托人/代理人/权限/时段，L3；缺补，签章真伪人审"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "资格、科研项目等材料核查与学院受理意见；学院/科研职能部门",
      "purpose": "M015；资格、科研项目等材料核查与学院受理意见；学院/科研职能部门；P2 后+内；有权部门可验证的电子核验事件或核查函；F017/F027；002/003/004；v：核验人/组织/所引材料版次；P1 不缺，P2 未形成后/查",
      "requiredElements": [
        "资格、科研项目等材料核查与学院受理意见；学院/科研职能部门",
        "P2 后+内",
        "有权部门可验证的电子核验事件或核查函",
        "F017/F027；002/003/004",
        "v：核验人/组织/所引材料版次；P1 不缺，P2 未形成后/查"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "分委员会审议、票决及适用 quorum 的凭证；分委员会秘书及委员会",
      "purpose": "M016；分委员会审议、票决及适用 quorum 的凭证；分委员会秘书及委员会；P3 后+内；有权机构会议纪要、认证电子投票记录；F028/F029；001/002/003/005/006；v：会议号/届次/成员/方案；未开会后，签发不明人审",
      "requiredElements": [
        "分委员会审议、票决及适用 quorum 的凭证；分委员会秘书及委员会",
        "P3 后+内",
        "有权机构会议纪要、认证电子投票记录",
        "F028/F029；001/002/003/005/006",
        "v：会议号/届次/成员/方案；未开会后，签发不明人审"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "对应当期公示信息及起止/范围；获授权公示机构",
      "purpose": "M017；对应当期公示信息及起止/范围；获授权公示机构；P4 后+内；官方网站历史存证、校方盖章公示及留档；F030；002/003/004/005；v：名单/期次/公示权限；非本情形无需、未公示前后；期限策",
      "requiredElements": [
        "对应当期公示信息及起止/范围；获授权公示机构",
        "P4 后+内",
        "官方网站历史存证、校方盖章公示及留档",
        "F030；002/003/004/005",
        "v：名单/期次/公示权限；非本情形无需、未公示前后；期限策"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "正式异议、调查意见、处理与送达；有权受理机关",
      "purpose": "M018；正式异议、调查意见、处理与送达；有权受理机关；P4/P8 有异议时条+内；校方有权部门可核办结记录和接收回执；F031/F045；001/002/003（申诉授权尚未证实）；v：事项/投诉人隔离/时间；无异议不缺；有案不能凭传闻结案",
      "requiredElements": [
        "正式异议、调查意见、处理与送达；有权受理机关",
        "P4/P8 有异议时条+内",
        "校方有权部门可核办结记录和接收回执",
        "F031/F045；001/002/003（申诉授权尚未证实）",
        "v：事项/投诉人隔离/时间；无异议不缺；有案不能凭传闻结案"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "资格任命、增列、聘任或不批准的有效决定；相应有权机关",
      "purpose": "M019；资格任命、增列、聘任或不批准的有效决定；相应有权机关；P5 后+内；H2 重申请后；真实签发机关可核的决定/电子批复与正式资格台账；F023/F032/F033/F041；001/002/006/010；v：人+层次+学位点+决定机关；公示/推荐不替，未决定后",
      "requiredElements": [
        "资格任命、增列、聘任或不批准的有效决定；相应有权机关",
        "P5 后+内；H2 重申请后",
        "真实签发机关可核的决定/电子批复与正式资格台账",
        "F023/F032/F033/F041；001/002/006/010",
        "v：人+层次+学位点+决定机关；公示/推荐不替，未决定后"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "办理备案与入册凭证；研究生院/研工部/学院（以制度为准）",
      "purpose": "M020；办理备案与入册凭证；研究生院/研工部/学院（以制度为准）；P5/P7 后+内；归口办公室确认的备案编号、存档收据；F034；001/002/006；v：决定文号/备案期次；未形成后；备案与批准不得互换",
      "requiredElements": [
        "办理备案与入册凭证；研究生院/研工部/学院（以制度为准）",
        "P5/P7 后+内",
        "归口办公室确认的备案编号、存档收据",
        "F034；001/002/006",
        "v：决定文号/备案期次；未形成后；备案与批准不得互换"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M021",
      "name": "首次获资格导师培训结论；培训主管部门",
      "purpose": "M021；首次获资格导师培训结论；培训主管部门；获资格后、上岗前条+内；正式培训管理记录或经授课机构核发证明；F035；001 第20条；v：人+批次+合格时间；初申请 P1 后；培训未知查",
      "requiredElements": [
        "首次获资格导师培训结论；培训主管部门",
        "获资格后、上岗前条+内",
        "正式培训管理记录或经授课机构核发证明",
        "F035；001 第20条",
        "v：人+批次+合格时间；初申请 P1 后；培训未知查"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "导师年度岗位履职考核及阶段性复审事实；培养单位",
      "purpose": "M022；导师年度岗位履职考核及阶段性复审事实；培养单位；E P6 当+内；其他触发条；经培养单位批准的真实考核结论及基础记录；F022/F027；001 第17条；v：人+年度+学位点；缺查，不得凭年度招生资格代替",
      "requiredElements": [
        "导师年度岗位履职考核及阶段性复审事实；培养单位",
        "E P6 当+内；其他触发条",
        "经培养单位批准的真实考核结论及基础记录",
        "F022/F027；001 第17条",
        "v：人+年度+学位点；缺查，不得凭年度招生资格代替"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "可能触发暂停/取消的行政事实与调查结论；有权调查/人事/培养单位",
      "purpose": "M023；可能触发暂停/取消的行政事实与调查结论；有权调查/人事/培养单位；F/G P7 当+内；H1 P8 条；有权机关已核且可以合法使用的处理决定/事实说明；F021/F022/F038；001 第15—16条；v：人+事件+起止+结论效期，L3；缺查/人审，不作自动处分",
      "requiredElements": [
        "可能触发暂停/取消的行政事实与调查结论；有权调查/人事/培养单位",
        "F/G P7 当+内；H1 P8 条",
        "有权机关已核且可以合法使用的处理决定/事实说明",
        "F021/F022/F038；001 第15—16条",
        "v：人+事件+起止+结论效期，L3；缺查/人审，不作自动处分"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "招生资格与指标的分别编号外部引用；T06-T02/T06-T03 归口",
      "purpose": "M024；招生资格与指标的分别编号外部引用；T06-T02/T06-T03 归口；E/F/I P6—P7 条+内；由各归口机关分别核签的年度决定或只读结果；F036/F037/F038；001 第10—14条/015；v：人+学科+招生年+各自决定；源无查，不能并成资格结论",
      "requiredElements": [
        "招生资格与指标的分别编号外部引用；T06-T02/T06-T03 归口",
        "E/F/I P6—P7 条+内",
        "由各归口机关分别核签的年度决定或只读结果",
        "F036/F037/F038；001 第10—14条/015",
        "v：人+学科+招生年+各自决定；源无查，不能并成资格结论"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "暂停上岗招生讨论决定与备案；培养单位、研工部/研究生院",
      "purpose": "M025；暂停上岗招生讨论决定与备案；培养单位、研工部/研究生院；F P7 后+内；H1 P8 原决定当；真实有权会议正式决议加归口备案引用；F033/F034/F038；001 第15—16条；v：人+层次+学科+生效日；事实负面≠已暂停，无文书人审",
      "requiredElements": [
        "暂停上岗招生讨论决定与备案；培养单位、研工部/研究生院",
        "F P7 后+内；H1 P8 原决定当",
        "真实有权会议正式决议加归口备案引用",
        "F033/F034/F038；001 第15—16条",
        "v：人+层次+学科+生效日；事实负面≠已暂停，无文书人审"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "取消岗位资格完整审批链：分委员会意见→校学位办复核→主席/副主席批准；各权责机关",
      "purpose": "M026；取消岗位资格完整审批链：分委员会意见→校学位办复核→主席/副主席批准；各权责机关；G P7 后+内；H2 P0 既存决定当；可核各环节原始文书与最终批准，缺一不能默补；F033/F039；001 第16条；v：各机关/节点/日期；缺任一环人审，不能替为暂停决定",
      "requiredElements": [
        "取消岗位资格完整审批链：分委员会意见→校学位办复核→主席/副主席批准；各权责机关",
        "G P7 后+内；H2 P0 既存决定当",
        "可核各环节原始文书与最终批准，缺一不能默补",
        "F033/F039；001 第16条",
        "v：各机关/节点/日期；缺任一环人审，不能替为暂停决定"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M027",
      "name": "停招/离岗后已有研究生培养安排的权威引用；培养单位/S08",
      "purpose": "M027；停招/离岗后已有研究生培养安排的权威引用；培养单位/S08；D2/F/G P7 后+内，确有在读生则条；正式培养单位安排或 S08 业务决定只读引用；F044；001 第18条；v：学生标识脱敏+决定期，L3；源无查，不在本案转改导师",
      "requiredElements": [
        "停招/离岗后已有研究生培养安排的权威引用；培养单位/S08",
        "D2/F/G P7 后+内，确有在读生则条",
        "正式培养单位安排或 S08 业务决定只读引用",
        "F044；001 第18条",
        "v：学生标识脱敏+决定期，L3；源无查，不在本案转改导师"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M028",
      "name": "撤回、复核、状态纠正/恢复或重新申请的书面请求与理由；本人或有权单位",
      "purpose": "M028；撤回、复核、状态纠正/恢复或重新申请的书面请求与理由；本人或有权单位；H1/H2 P8 当；D2 条；有异议/撤回时条；校方正式受理申请、签收的书面函及授权电子请求；F012/F040/F045；001/015（后者不作岗位权限）；v：原案决定号+诉求+接收机关；本人发起未提交补，受理期限策",
      "requiredElements": [
        "撤回、复核、状态纠正/恢复或重新申请的书面请求与理由；本人或有权单位",
        "H1/H2 P8 当；D2 条；有异议/撤回时条",
        "校方正式受理申请、签收的书面函及授权电子请求",
        "F012/F040/F045；001/015（后者不作岗位权限）",
        "v：原案决定号+诉求+接收机关；本人发起未提交补，受理期限策"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M029",
      "name": "生效更正/解除暂停/新决定的权威记录；实际有权机关",
      "purpose": "M029；生效更正/解除暂停/新决定的权威记录；实际有权机关；H1 P8 后+内；H2 P5 后，其他纠正条；按现行确认权限签发的修正决定及状态台账；F033/F041；001（恢复权限不明）；v：被修正决定及生效日；P8 前后，权限未证策/人审",
      "requiredElements": [
        "生效更正/解除暂停/新决定的权威记录；实际有权机关",
        "H1 P8 后+内；H2 P5 后，其他纠正条",
        "按现行确认权限签发的修正决定及状态台账",
        "F033/F041；001（恢复权限不明）",
        "v：被修正决定及生效日；P8 前后，权限未证策/人审"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M030",
      "name": "案卷源材料清单、版本/哈希、替代和审计链；本案系统与校内档案部门",
      "purpose": "M030；案卷源材料清单、版本/哈希、替代和审计链；本案系统与校内档案部门；P0—P8 当+内；含合法时间戳和原件位置的校方档案/审计导出；F001/F009/F026/F042/F043/F045；013（技术线索）；v：案件+材料 owner+版次；旧文件保留但失去当前效力；断链冲",
      "requiredElements": [
        "案卷源材料清单、版本/哈希、替代和审计链；本案系统与校内档案部门",
        "P0—P8 当+内",
        "含合法时间戳和原件位置的校方档案/审计导出",
        "F001/F009/F026/F042/F043/F045；013（技术线索）",
        "v：案件+材料 owner+版次；旧文件保留但失去当前效力；断链冲"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M031",
      "name": "当期受理通知、截止时间、模板和官方受理方式；研究生院/学院",
      "purpose": "M031；当期受理通知、截止时间、模板和官方受理方式；研究生院/学院；P0 当+内（未公布时政策待核）；当期机构确认通知或官方网站原始公告及附件；F010/F011；004/005/010/012/016；v：学位点+批次+发文日期；2023/25 旧通知非 2026 通知，缺策",
      "requiredElements": [
        "当期受理通知、截止时间、模板和官方受理方式；研究生院/学院",
        "P0 当+内（未公布时政策待核）",
        "当期机构确认通知或官方网站原始公告及附件",
        "F010/F011；004/005/010/012/016",
        "v：学位点+批次+发文日期；2023/25 旧通知非 2026 通知，缺策"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": true
    },
    {
      "id": "M032",
      "name": "委员会/审议机关及部门核验人授权名录与签发权限；校院组织人事或任命机关",
      "purpose": "M032；委员会/审议机关及部门核验人授权名录与签发权限；校院组织人事或任命机关；P1—P8 需验权时条+内；P3/P5/P7/P8 尤其关键；官方任命公告、可验数字授权目录及签发权限记录；F013/F029/F032/F039/F043；001/006；v：机关+届次+任期+权限；核不实人审，不因 OCR 有头衔而信任",
      "requiredElements": [
        "委员会/审议机关及部门核验人授权名录与签发权限；校院组织人事或任命机关",
        "P1—P8 需验权时条+内；P3/P5/P7/P8 尤其关键",
        "官方任命公告、可验数字授权目录及签发权限记录",
        "F013/F029/F032/F039/F043；001/006",
        "v：机关+届次+任期+权限；核不实人审，不因 OCR 有头衔而信任"
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
      "maxCount": 100,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules-08-2",
      "name": "08.2 立案、申请与资格事实规则（R001—R016）",
      "description": "依据 T06-T01 原件第 08 节规则表；属于本地研究审查项，不等同学校正式政策规则。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "主体唯一识别",
          "requirement": "R001 P0 主体唯一识别；T=建立/引用个人案；F=纯制度配置不涉及个人；U=身份归属不明→NEEDS_HUMAN_DECISION；SRC-001；F002/F003/F042；M002/M030；比对人事/校方唯一主键、曾用名和提交人，按事件时点核归属；人/学 胜于自报；身份与证据同源 PASS_FACT；同名异人/编号冲突 CONFLICT；权威源断交人事/学院核实，不能按姓名合并",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "资格维度与原状态",
          "requirement": "R002 P0 资格维度与原状态；T=新增、复审或状态变更；F=非导师岗位业务；U=硕博/学位点归属不明→POLICY_UNCONFIRMED；SRC-001；F007/F008/F023/F033；M004/M005；按人×层次×学位点×有效期还原学资格链，区分岗位、年度招生和指标；资格维度一致 PASS_FACT；不一致 CONFLICT→研究生院；从无原批准不推定已有资格",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "当期规范匹配",
          "requirement": "R003 P0 当期规范匹配；T=需判断本次事项政策/期限；F=只进行历史证据查询；U=适用版本未明→POLICY_UNCONFIRMED；SRC-001/002/003/004/010/011；F008/F010/F011；M005/M031；比对校规效期、学院/点授权、硕博类别、申报批次与文号，按当期原文，不跨院套用；版本完整可核 PASS_FACT；2025 博导新规、2026 通知缺失→POLICY_UNCONFIRMED，交研工部/学院政策管理员",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "事项路由及既存状态",
          "requirement": "R004 P0 事项路由及既存状态；T=判定 A—H2 或 I；F=已进入经确认同一情形；U=原资格/撤销状态缺失→NEEDS_HUMAN_DECISION；SRC-001/015；F005/F007/F009/F023/F036；M004/M024/M030；用生效决定和本次请求判新增、存续、暂停、取消、恢复、招生邻接；学/邻分维度；路由正确 PASS_FACT；年度招生资格当成岗位批准→CONFLICT，交学院承办/相邻归口纠正",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "本人意愿与代办权限",
          "requirement": "R005 P1 本人意愿与代办权限；T=本人或代理提交/撤回；F=机关依职权主动触发；U=代理关系未证→NEEDS_HUMAN_DECISION；SRC-001/002/004（代办细则未证）；F012/F013/F026/F043；M001/M012/M014/M030；对照受理记录、本人确认与授权范围/有效日；委托文件须身份核签，客户端 Actor 不可信；本人/授权事实可信 PASS_FACT；授权缺件 NEEDS_MATERIAL，真伪疑问交校方身份管理；机关触发无须伪造本人申请",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "申请表和实际受理节点",
          "requirement": "R006 P1 申请表和实际受理节点；T=A/B1/B2 或需分类申请表；F=F/G 机关启动、无申请表分支；U=当前表单及期限未证→POLICY_UNCONFIRMED；SRC-002/003/004/010/016；F009/F010/F012/F026；M001/M012/M031；申请书版本与学位点、提交时间比对当期学院公告；2023/2025 历史附件不作 2026 固定表；合法表式、时点可核 PASS_FACT；真缺表 NEEDS_MATERIAL，迟延争议交受理学院而非自动拒绝",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "—P2 岗位/外聘身份",
          "requirement": "R007 P0—P2 岗位/外聘身份；T=身份影响对应硕、博、行业或调离分支；F=与身份无关的存量记录查询；U=任职效力未知→SOURCE_UNAVAILABLE；SRC-001/002；F004/F005/F006/F015/F025；M002/M003/M013；比对人事聘任/外单位合同与申请日或状态发生日，按人有效时段，不从姓名称谓推测；身份事实吻合 PASS_FACT；过期或跨单位冲突 CONFLICT；交人事/合作管理部门，是否符合例外仍人工判",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R008",
          "title": "学位职称核证",
          "requirement": "R008 P2 学位职称核证；T=对应当期遴选细则要求；F=阶段尚未到或此类不需；U=是否必需/门槛未知→POLICY_UNCONFIRMED；SRC-002/003/010；F014/F015；M003/M006/M005；颁证/人事权威值与生效细则逐项对照，证件属于同一 F002，毕业/聘任时间落在评估期；原始身份学历事实可信 PASS_FACT；阈值不足作 finding=false＋NEEDS_HUMAN_DECISION交有权学院，不硬编年龄/职称",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R009",
          "title": "学科与指导能力",
          "requirement": "R009 P2 学科与指导能力；T=初次遴选/重新遴选需核；F=仅暂停决定备案；U=分学科学术条件未证→POLICY_UNCONFIRMED；SRC-001/002/003/010；F016/F020/F008；M007/M005；学科码、研究方向、指导/教学经验证据按申请时段与适用授权点对照；学/校核，外校经历只做待查；方向/经历事实一致 PASS_FACT；评价“足以胜任”仍 NEEDS_HUMAN_DECISION交分委员会",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "在研项目真实性与归属",
          "requirement": "R010 P2 在研项目真实性与归属；T=当期方案引用项目条件；F=仅人员状态核查；U=项目类别/期间门槛未知→POLICY_UNCONFIRMED；SRC-002/003/010；F017；M005/M008/M015；按项目编号、负责人、角色、评估期与校科研归口记录比较，申请人清单只是索引；权威项目事实可核 PASS_FACT；项目归属冲突 CONFLICT交科研管理，不能采纳截图更高等级",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "科研经费口径与时点",
          "requirement": "R011 P2 科研经费口径与时点；T=当期细则要求可用经费；F=不涉及经费分支；U=经费认定口径或阈值未知→POLICY_UNCONFIRMED；SRC-002/003/010；F018/F017；M005/M008/M009；科研/财务核余额、支配权、课题归属及政策统计日；不跨批次移用，禁私人流水代权威核算；核对后的金额事实 PASS_FACT；不同结算口径 CONFLICT交科研/财务；不自行得出达标结论",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "研究成果及署名归属",
          "requirement": "R012 P2 研究成果及署名归属；T=细则要求成果条件；F=事项未涉及成果；U=成果类别/认可期不明→POLICY_UNCONFIRMED；SRC-002/003/010；F019/F042；M005/M010/M030；按论文/专利唯一号、作者排序、时限及科研部门有权认定比对，固定材料哈希；成果归属事实可核 PASS_FACT；署名错/版本替换 CONFLICT或定向重审，交科研机构，不补造数量阈值",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R013",
          "title": "/P7 有效师德与培养质量结论",
          "requirement": "R013 P2/P7 有效师德与培养质量结论；T=政策要求或出现已正式处理事件；F=无触发/禁止泛查健康；U=处罚是否生效/合法访问不明→NEEDS_HUMAN_DECISION；SRC-001/009；F021/F022；M011/M023；只核有权人事、学术规范、学位质量机构的生效结论及适用期、处分边界；L3 最小披露；有效处理事实可核 PASS_FACT；匿名举报不算处分，负面裁量交授权调查机关；源禁访 SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "—P3 博导新增与直接认定分支",
          "requirement": "R014 P1—P3 博导新增与直接认定分支；T=B1/B2；F=其他硕导/行业分支；U=2025 增列新规全文未取→POLICY_UNCONFIRMED；SRC-004/005/010/011/016；F009/F011/F012/F014/F015；M005/M012/M031；对 2025 新增/直接认定条款、当年表单、适用学科/人才身份查原文；2023 表名仅供溯源；原始分支资格证据可核 PASS_FACT；当前仍缺新规，交研究生院；不能以旧表宣告“免审直接获批”",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "—P7 行业/兼职协议有效性",
          "requirement": "R015 P0—P7 行业/兼职协议有效性；T=C/D1/D2 或合作、调离事实发生；F=普通校内在职申请；U=合作权限/合同条件不明→POLICY_UNCONFIRMED；SRC-001；F004/F005/F023/F024/F025；M003/M004/M013/M028；合同双方签发、类型、期限及续签生效期核对人/校，调离续导依真实分委员会意见（后续形成）；协议事实核准 PASS_FACT；过期不能自动续聘，是否继续指导交分委员会，校外协议不取代 M019",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "机构事实核验闭合",
          "requirement": "R016 P2 机构事实核验闭合；T=已送学院/有权部门核验；F=P0/P1 尚未提交核验；U=核验责任部门/权限未知→NEEDS_HUMAN_DECISION；SRC-001/002/003/004；F017/F018/F019/F027/F043；M008/M009/M010/M015/M032；比对核验机关、签署人、核查时间、所引材料各版本，校/科核实意见高于承办口述；核查记录真实 PASS_FACT；签署无权/核版不一致 CONFLICT交学院、科研/教务部门重核",
          "execution": "manual",
          "targetScope": "case"
        }
      ]
    },
    {
      "id": "rules-08-3",
      "name": "08.3 审议、资格状态与复核规则（R017—R032）",
      "description": "依据 T06-T01 原件第 08 节规则表；属于本地研究审查项，不等同学校正式政策规则。",
      "order": 1,
      "required": true,
      "criteria": [
        {
          "id": "R017",
          "title": "学位分委员会有效审议",
          "requirement": "R017 P3 学位分委员会有效审议；T=真实会议/表决已发生；F=P3 尚未来临；U=表决比例或签署授权无法证明→POLICY_UNCONFIRMED；SRC-001/002/003/005/006/010；F028/F029/F043；M016/M032；核任命届次、委员数、记录签章、表决对象和适用本点规则；历史学院 quorum 不全校套用；审议发生与意见可核 PASS_FACT；票决真伪争议交分委员会/学位办 NEEDS_HUMAN_DECISION；推荐不是校批",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "公示与异议程序",
          "requirement": "R018 P4 公示与异议程序；T=适用类别进入公示或有正式异议；F=公示阶段未到/制度不要求；U=公告期间与异议时限不明→POLICY_UNCONFIRMED；SRC-002/003/004/005/010；F030/F031/F045；M017/M018/M031；核院校公告原件、开始结束时间、名单范围、实名异议受理及处理时点；2025 年三日仅历史例；公示事实可核 PASS_FACT；异议未办完→NEEDS_HUMAN_DECISION交公示机关，不默认视为“无异议”",
          "execution": "manual",
          "targetScope": "group"
        },
        {
          "id": "R019",
          "title": "任职资格正式决定来源与权限",
          "requirement": "R019 P5 任职资格正式决定来源与权限；T=宣称岗位已批准/未批准；F=P5 尚未作决定；U=当期批准链不明→POLICY_UNCONFIRMED；SRC-001/002/006/010；F023/F032/F033/F043；M004/M016/M019/M032；核决定原机关、文号、签署人、层次学位点及生效时间，与分委员会权限和校级后续链对应；会/学为权威；仅能输出“有效决定记录存在”之 PASS_FACT，不由本模板生成批准；公示/备案冒充批准→CONFLICT交有权机关",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "/P7 正式备案及入册",
          "requirement": "R020 P5/P7 正式备案及入册；T=按该决定制度应备案且已到节点；F=决定未发生或无此法定备案；U=备案机关未核→POLICY_UNCONFIRMED；SRC-001/002/006；F023/F033/F034；M019/M020/M025/M026；核决定文号与备案回执、相应主体、时间，学台账与原决定对照，不能倒置先后；备案事实可核 PASS_FACT；缺校方回执 SOURCE_UNAVAILABLE交研工部/研究生院；备案不使未批准事项获批",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "后至上岗前 导师培训",
          "requirement": "R021 P5 后至上岗前 导师培训；T=首次获我校导师资格、需要上岗指导；F=存量导师无新培训触发；U=培训要求/结论无法确认→SOURCE_UNAVAILABLE；SRC-001 第20条；F023/F035；M019/M021；核培训主管部门记录、人和学段、合格时间与拟上岗时间，学培训台账优先；培训已完成事实 PASS_FACT；尚未办理时送培训待办，不倒推岗位资格被取消，不能自动批准招生",
          "execution": "manual",
          "targetScope": "subject"
        },
        {
          "id": "R022",
          "title": "导师岗位年度履职考核",
          "requirement": "R022 P6 导师岗位年度履职考核；T=年度岗位考核窗口/资格事实复审正式启动；F=初任申请尚未进入履职期；U=单独“资格复审”制度未知→POLICY_UNCONFIRMED；SRC-001 第17条；F022/F023/F027；M004/M022；用培养单位年度考核结果与导师资格范围/学年匹配；校/学签署真实，独立招生资格不等价；年度考核结论存在 PASS_FACT；不良事实的处理交培养单位人工，非岗位自动撤销；无当期机关结果 SOURCE_UNAVAILABLE",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "/P7 外部年度招生资格结论",
          "requirement": "R023 P6/P7 外部年度招生资格结论；T=需判断未通过年招资格触发事实；F=与年招无关的首任资格；U=外部结论不能核→SOURCE_UNAVAILABLE；SRC-001 第10、15条/015；F023/F036/F038；M004/M024；核 T06-T02 原机关、年份、层次、学科、人和生效状态，只读其唯一已批准/不通过结论；外部结论客观存在 PASS_FACT；未通过仅通知培养单位考虑 R024—R025，不能写成岗位已停招",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "暂停/取消触发事实分类",
          "requirement": "R024 P7 暂停/取消触发事实分类；T=出现有权核定的健康、质量、纪律/年招失败等线索；F=无正式触发事件；U=调查未终结或事实性质不明→NEEDS_HUMAN_DECISION；SRC-001 第15—16条/015；F021/F022/F036/F038；M011/M023/M024；比对事件主体、学科层次、已生效负面结论与通知时点，分辨“暂停上岗招生”和“取消资格”适用事实，L3 限权；可核触发事实 PASS_FACT；是否构成严重或应暂停/取消由培养单位/校有权机关裁量；传闻不作不利决定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "暂停上岗招生决定链",
          "requirement": "R025 P7 暂停上岗招生决定链；T=培养单位已讨论并作暂停决定；F=仅有负面事实、尚未作会商决定；U=权责会议真实性不明→NEEDS_HUMAN_DECISION；SRC-001 第15—16条；F033/F034/F038/F043；M023/M025/M032；核培养单位讨论记录、签署权限、所涉层次/学科、决定生效日及向研工部/研院备案；会/学证据胜过文字状态；真实暂停决定链存在 PASS_FACT；仅有 T06-T02 失败或系统标“停招”不能生成此决定；交培养单位及研究生院",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "取消导师资格批准链",
          "requirement": "R026 P7 取消导师资格批准链；T=分委员会正式提出取消并进入审批；F=仅暂停分支；U=取消批准权/原机关无法核→NEEDS_HUMAN_DECISION；SRC-001 第15—16条；F021/F022/F033/F039/F043；M023/M026/M032；顺序查分委员会处理意见→校学位办复核→主席/副主席批准；每段签发主体、文号、时间、同一人学位点；三段可信完整仅可报告 PASS_FACT（有权决定已存在）；少一段/伪身份不写取消状态，交校学位办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "/P8 存量学生衔接",
          "requirement": "R027 P7/P8 存量学生衔接；T=导师离岗/停招/取消且仍有在读研究生；F=无存量学生/安排阶段未到；U=在读关系不可核→SOURCE_UNAVAILABLE；SRC-001 第18条；F023/F033/F044；M004/M025/M026/M027；核学生原导师关系和培养单位安排/ S08 正式决定时点，最小必要 L3 数据；不由本模板改学籍；权威交接事实存在 PASS_FACT；尚待安排→NEEDS_HUMAN_DECISION交培养单位/S08，非向申请人索要未来决定",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "暂停后更正/解除前置核验",
          "requirement": "R028 P8 暂停后更正/解除前置核验；T=持有效岗位暂停决定请求解除/纠正；F=从未暂停、仅年招资格受限；U=解除权限/时限无原规章→POLICY_UNCONFIRMED；SRC-001/015；F023/F033/F038/F040/F041；M004/M023/M025/M028/M029；核原 M025 有效性、请求对象、后续已核事实，待取得岗位复岗机关规则后才核 M029；招生恢复文书非岗位解除；原暂停与诉求事实可核 PASS_FACT；解除资格状态必须等待真正有权决定，交原培养单位/研究生院核政策",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "/P0—P5 取消后重新遴选资格前置",
          "requirement": "R029 P8/P0—P5 取消后重新遴选资格前置；T=已取消岗位资格者重申请；F=普通初次申请/原暂停未取消；U=三年起算点/例外未证→POLICY_UNCONFIRMED；SRC-001 第15条（四）/002/010；F010/F011/F023/F033/F039/F040；M001/M005/M012/M026/M028/M031；只按取消生效决定的时间及校级现行文本核“三年”原则，重新走本学段有效遴选，不沿用旧批次申请表；取消事实和期间核对 PASS_FACT；即便满三年也不是恢复或通过，学院/有权机关审新案",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "—P8 补件、撤回、复核/异议请求可追溯",
          "requirement": "R030 P1—P8 补件、撤回、复核/异议请求可追溯；T=确有相关请求或异议；F=未发生这类事件；U=受理权限/截止日无当期依据→POLICY_UNCONFIRMED；SRC-001/002/003/015（不得错用论文申诉期）；F012/F026/F031/F040/F045；M001/M018/M028/M030；核本人/授权签署、提交接收时间、原决定引用、送达、响应机关；按请求当时的授权制度，事件不可物理抹除；请求真实性可核 PASS_FACT；能否撤回/复核须有权机关受理/驳回，交学院/研究生院，不产生自动撤销",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "全阶段 证据版本与依赖失效",
          "requirement": "R031 全阶段 证据版本与依赖失效；T=材料替换、来源结论更新、修正文书；F=证据指纹未变化；U=旧版哈希或归属链断→CONFLICT；SRC-001/013（技术线索非政策）；F001/F002/F011/F019/F027/F042/F045；M010/M015/M030；比对 old/new materialId+owner+version+hash+sourceVersion，仅找引用被替换项的 R；不动未依赖的事实；变更链完整 PASS_FACT并定向重审；旧 PASS_FACT 标 SUPERSEDED（这是时效标签不是第九结果码）；正式决定只开人工复核待办",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "/P6 邻接年招、跨学科与指标路由",
          "requirement": "R032 P0/P6 邻接年招、跨学科与指标路由；T=跨学科、退休特例、招生资格或名额事项；F=纯岗位首次遴选；U=邻接结果权限/关联业务不明→POLICY_UNCONFIRMED；SRC-001 第10—14条/014；F008/F023/F036/F037；M004/M005/M024；对照 T06-T02 年度资格与 T06-T03 招生指标独立机关、年度及学科，按原归口只读引用；路由一致 PASS_FACT；本案不审批年招或指标，交相邻模板和实际有权机构",
          "execution": "manual",
          "targetScope": "group"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "p0",
      "name": "P0 识别与路由",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p1"
    },
    {
      "id": "p1",
      "name": "P1 提交或触发",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p2"
    },
    {
      "id": "p2",
      "name": "P2 专业事实核验/补件",
      "kind": "supplement-wait",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p3"
    },
    {
      "id": "p3",
      "name": "P3 学术审议",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p4"
    },
    {
      "id": "p4",
      "name": "P4 公示/异议",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p5"
    },
    {
      "id": "p5",
      "name": "P5 正式决定、备案",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p6"
    },
    {
      "id": "p6",
      "name": "P6 存续考核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p7"
    },
    {
      "id": "p7",
      "name": "P7 不利状态处理",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "workflowOwner": "local",
      "nextStageId": "p8"
    },
    {
      "id": "p8",
      "name": "P8 复核、纠正、恢复/重新遴选",
      "kind": "handoff",
      "executorRole": "reviewer",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "item-feedback",
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
  "batchId": "T06-A",
  "templateId": "T06-T01",
  "name": "研究生导师资格遴选、复审、状态变更与停招恢复审核",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/research-original/T06-T01.md",
  "sourceDocumentSha256": "dff4f5b170b1864c06de64e7569d18cbe8cdb43179bad739743e0dd816be39f2",
  "sourceDocumentBytes": 131421,
  "reviewedDocumentPath": "docs/design/review-agent/business-templates/R02/T06-T01.md",
  "reviewedDocumentPatchApplied": false,
  "reviewedDocumentPatchSummary": "未做低歧义正文修订；保留原研究稿中的待确认门禁。",
  "officialSchoolTemplate": false,
  "researchStatus": "RESEARCH_HANDOFF_READY",
  "policyEvidenceStatus": "PARTIAL",
  "researchAsOf": "2026-10-23",
  "auditedAt": "2026-10-24",
  "criteria": [
    {
      "sectionId": "rules-08-2",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F002",
        "F003",
        "F042"
      ],
      "materialSlotIds": [
        "M002",
        "M030"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F007",
        "F008",
        "F023",
        "F033"
      ],
      "materialSlotIds": [
        "M004",
        "M005"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-010",
        "SRC-011"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F008",
        "F010",
        "F011"
      ],
      "materialSlotIds": [
        "M005",
        "M031"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-015"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F005",
        "F007",
        "F009",
        "F023",
        "F036"
      ],
      "materialSlotIds": [
        "M004",
        "M024",
        "M030"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-004"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F012",
        "F013",
        "F026",
        "F043"
      ],
      "materialSlotIds": [
        "M001",
        "M012",
        "M014",
        "M030"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R006",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-010",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F009",
        "F010",
        "F012",
        "F026"
      ],
      "materialSlotIds": [
        "M001",
        "M012",
        "M031"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F004",
        "F005",
        "F006",
        "F015",
        "F025"
      ],
      "materialSlotIds": [
        "M002",
        "M003",
        "M013"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R008",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F002",
        "F014",
        "F015"
      ],
      "materialSlotIds": [
        "M003",
        "M005",
        "M006"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F008",
        "F016",
        "F020"
      ],
      "materialSlotIds": [
        "M005",
        "M007"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R010",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F017"
      ],
      "materialSlotIds": [
        "M005",
        "M008",
        "M015"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R011",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F017",
        "F018"
      ],
      "materialSlotIds": [
        "M005",
        "M008",
        "M009"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R012",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F019",
        "F042"
      ],
      "materialSlotIds": [
        "M005",
        "M010",
        "M030"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-009"
      ],
      "evidenceStatus": "PARTIAL",
      "fieldIds": [
        "F021",
        "F022"
      ],
      "materialSlotIds": [
        "M011",
        "M023"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R014",
      "srcIds": [
        "SRC-004",
        "SRC-005",
        "SRC-010",
        "SRC-011",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F009",
        "F011",
        "F012",
        "F014",
        "F015"
      ],
      "materialSlotIds": [
        "M005",
        "M012",
        "M031"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R015",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F004",
        "F005",
        "F023",
        "F024",
        "F025"
      ],
      "materialSlotIds": [
        "M003",
        "M004",
        "M013",
        "M019",
        "M028"
      ]
    },
    {
      "sectionId": "rules-08-2",
      "criterionId": "R016",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F017",
        "F018",
        "F019",
        "F027",
        "F043"
      ],
      "materialSlotIds": [
        "M008",
        "M009",
        "M010",
        "M015",
        "M032"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R017",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-005",
        "SRC-006",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F028",
        "F029",
        "F043"
      ],
      "materialSlotIds": [
        "M016",
        "M032"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R018",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F030",
        "F031",
        "F045"
      ],
      "materialSlotIds": [
        "M017",
        "M018",
        "M031"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F023",
        "F032",
        "F033",
        "F043"
      ],
      "materialSlotIds": [
        "M004",
        "M016",
        "M019",
        "M032"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R020",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-006"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F023",
        "F033",
        "F034"
      ],
      "materialSlotIds": [
        "M019",
        "M020",
        "M025",
        "M026"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F023",
        "F035"
      ],
      "materialSlotIds": [
        "M019",
        "M021"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F022",
        "F023",
        "F027"
      ],
      "materialSlotIds": [
        "M004",
        "M022"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R023",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F023",
        "F036",
        "F038"
      ],
      "materialSlotIds": [
        "M004",
        "M024"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F021",
        "F022",
        "F036",
        "F038"
      ],
      "materialSlotIds": [
        "M011",
        "M023",
        "M024"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F033",
        "F034",
        "F038",
        "F043"
      ],
      "materialSlotIds": [
        "M023",
        "M025",
        "M032"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R026",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F021",
        "F022",
        "F033",
        "F039",
        "F043"
      ],
      "materialSlotIds": [
        "M023",
        "M026",
        "M032"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R027",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "VERIFIED",
      "fieldIds": [
        "F023",
        "F033",
        "F044"
      ],
      "materialSlotIds": [
        "M004",
        "M025",
        "M026",
        "M027"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F023",
        "F033",
        "F038",
        "F040",
        "F041"
      ],
      "materialSlotIds": [
        "M004",
        "M023",
        "M025",
        "M028",
        "M029"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R029",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F010",
        "F011",
        "F023",
        "F033",
        "F039",
        "F040"
      ],
      "materialSlotIds": [
        "M001",
        "M005",
        "M012",
        "M026",
        "M028",
        "M031"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-003",
        "SRC-015"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F012",
        "F026",
        "F031",
        "F040",
        "F045"
      ],
      "materialSlotIds": [
        "M001",
        "M018",
        "M028",
        "M030"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F001",
        "F002",
        "F011",
        "F019",
        "F027",
        "F042",
        "F045"
      ],
      "materialSlotIds": [
        "M010",
        "M015",
        "M030"
      ]
    },
    {
      "sectionId": "rules-08-3",
      "criterionId": "R032",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED",
      "fieldIds": [
        "F008",
        "F023",
        "F036",
        "F037"
      ],
      "materialSlotIds": [
        "M004",
        "M005",
        "M024"
      ]
    }
  ],
  "sources": [
    {
      "id": "SRC-001",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED｜成都理工大学、党委研工部/研究生院；《关于印发〈成都理工大学研究生指导教师岗位管理办法〉的通知》，成理校研〔2024〕23 号；PDF 印刷页 1—14，正文第 1—22 条，重点第 3、6—10、15—17、20—22 条。https://energy.cdut.edu.cn/__local/9/AA/99/34CEDDCF9FF86FBE66A5E632631_3B5D2F7C_44101.pdf",
      "url": "https://energy.cdut.edu.cn/__local/9/AA/99/34CEDDCF9FF86FBE66A5E632631_3B5D2F7C_44101.pdf；2024-04-03",
      "scope": "SRC-001；CDUT-VERIFIED｜成都理工大学、党委研工部/研究生院；《关于印发〈成都理工大学研究生指导教师岗位管理办法〉的通知》，成理校研〔2024〕23 号；PDF 印刷页 1—14，正文第 1—22 条，重点第 3、6—10、15—17、20—22 条。https://energy.cdut.edu.cn/__local/9/AA/99/34CEDDCF9FF86FBE66A5E632631_3B5D2F7C_44101.pdf；2024-04-03 校长办公会审定，2024-04-18 印发并施行；明确废止成理校研〔2021〕19 号，与本办法冲突旧规则以本办法为准。校级适用硕、博导师及特定行业导师。2026-10-22 核对 14 页可解析正文；尚无确认此后未被全部替代的校方书面证明。"
    },
    {
      "id": "SRC-002",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED｜成都理工大学、研究生院；《成都理工大学硕士研究生指导教师遴选办法》，成理校研〔2018〕10 号；PDF 页 1—4，申请条件、程序和其他。https://energy.cdut.edu.cn/__local/C/B5/D8/F57B5C817F458E15EF31F77DFC6_0940B332_327EC.pdf",
      "url": "https://energy.cdut.edu.cn/__local/C/B5/D8/F57B5C817F458E15EF31F77DFC6_0940B332_327EC.pdf；2018-10-12",
      "scope": "SRC-002；CDUT-VERIFIED｜成都理工大学、研究生院；《成都理工大学硕士研究生指导教师遴选办法》，成理校研〔2018〕10 号；PDF 页 1—4，申请条件、程序和其他。https://energy.cdut.edu.cn/__local/C/B5/D8/F57B5C817F458E15EF31F77DFC6_0940B332_327EC.pdf；2018-10-12 印发并施行，废止 2006〔8〕。2024 校级办法第七条仍明确引用；只限硕导，具体条件需联用学院细则并作冲突处理。2026-10-22 已核全文。"
    },
    {
      "id": "SRC-003",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED｜成都理工大学能源学院；《能源学院遴选硕士研究生指导教师实施办法（试行）》，能源学院〔2024〕1 号；PDF 第 1—2 页（条件及程序）。https://energy.cdut.edu.cn/__local/2/DD/B7/70C91BBB7BD161622653ABB6372_BAA35DC3_2F849.pdf",
      "url": "https://energy.cdut.edu.cn/__local/2/DD/B7/70C91BBB7BD161622653ABB6372_BAA35DC3_2F849.pdf；2024-09-12",
      "scope": "SRC-003；CDUT-VERIFIED｜成都理工大学能源学院；《能源学院遴选硕士研究生指导教师实施办法（试行）》，能源学院〔2024〕1 号；PDF 第 1—2 页（条件及程序）。https://energy.cdut.edu.cn/__local/2/DD/B7/70C91BBB7BD161622653ABB6372_BAA35DC3_2F849.pdf；2024-09-12 印发，学院网站 2025-04-29 挂载；同时引用 SRC-001、002。仅能源学院对应学位点适用；具体 55 岁、经费及成果等门槛不得外推，也需核是否后续修改。2026-10-22 已核全文。"
    },
    {
      "id": "SRC-004",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED｜成都理工大学生态环境学院；《2025年环境科学与工程学术博士学位、资源与环境专业学位博士生导师遴选工作方案》；正文“新增博士生导师遴选条件”“工作程序及时间安排”，附当期表单包链接。https://sthjxy.cdut.edu.cn/info/1013/3868.htm",
      "url": "https://sthjxy.cdut.edu.cn/info/1013/3868.htm；学院署名",
      "scope": "SRC-004；CDUT-VERIFIED｜成都理工大学生态环境学院；《2025年环境科学与工程学术博士学位、资源与环境专业学位博士生导师遴选工作方案》；正文“新增博士生导师遴选条件”“工作程序及时间安排”，附当期表单包链接。https://sthjxy.cdut.edu.cn/info/1013/3868.htm；学院署名 2025-10-21、网页 2025-10-23；只证明 2025 批次及该两个博士点规则。官方搜索可取较完整正文，页面实时打开受限；2025 新校级规则全文未取得，不能据此推广全校条件。2026-10-22 检索核对。"
    },
    {
      "id": "SRC-005",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED｜成都理工大学生态环境学院；《生态环境学院2025年博士生导师遴选名单公示》；正文。https://sthjxy.cdut.edu.cn/info/1013/3878.htm",
      "url": "https://sthjxy.cdut.edu.cn/info/1013/3878.htm；2025-11-03",
      "scope": "SRC-005；CDUT-VERIFIED｜成都理工大学生态环境学院；《生态环境学院2025年博士生导师遴选名单公示》；正文。https://sthjxy.cdut.edu.cn/info/1013/3878.htm；2025-11-03 发布，公示 2025-11-03 至 11-05，称依据成理校研〔2025〕27 号；证实“个人申请→学院分委员会初评推荐→公示”，不证明公示名单最终全部取得导师资格。2026-10-22 从官方正文索引核对。"
    },
    {
      "id": "SRC-006",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED｜成都理工大学文法学院（纪检监察学院）；《文法学院（纪检监察学院）成立第六届学位评定分委员会公告》，正文分委员会职责第（6）项。https://wfxy.cdut.edu.cn/info/1077/2984.htm",
      "url": "https://wfxy.cdut.edu.cn/info/1077/2984.htm；2025-05-15",
      "scope": "SRC-006；CDUT-VERIFIED｜成都理工大学文法学院（纪检监察学院）；《文法学院（纪检监察学院）成立第六届学位评定分委员会公告》，正文分委员会职责第（6）项。https://wfxy.cdut.edu.cn/info/1077/2984.htm；2025-05-15 发布，引用校学位评定委员会章程成理校发〔2025〕23 号，明确其学院分委员会审批硕导资格后报研工部/研究生院备案；仅证实该学院组织实践和职权，不代表其他学院成员或程序。2026-10-22 完整正文已核。"
    },
    {
      "id": "SRC-007",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED｜成都理工大学党政办公室；《校长办公会纪要〔2025〕16 号》（网页索引标题与 PDF 首页可能错配，以 PDF 正文为准），PDF 第 1 页“审定博士导师增列办法”事项。https://dbxb.cdut.edu.cn/__local/4/D3/B4/D990E9F4ED77354BA8E41329F13_46B56453_275D1.pdf",
      "url": "https://dbxb.cdut.edu.cn/__local/4/D3/B4/D990E9F4ED77354BA8E41329F13_46B56453_275D1.pdf；2025-07-09",
      "scope": "SRC-007；CDUT-VERIFIED｜成都理工大学党政办公室；《校长办公会纪要〔2025〕16 号》（网页索引标题与 PDF 首页可能错配，以 PDF 正文为准），PDF 第 1 页“审定博士导师增列办法”事项。https://dbxb.cdut.edu.cn/__local/4/D3/B4/D990E9F4ED77354BA8E41329F13_46B56453_275D1.pdf；2025-07-09 开会，2025-07-11 纪要；只证明审议/审定议题，不能替代 2025 新制度全文。2026-10-22 校网 PDF 索引正文核对。"
    },
    {
      "id": "SRC-008",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED｜成都理工大学党委研工部/研究生院；《成都理工大学2023年博士生指导教师遴选初审名单公示》，PDF 第 1 页。https://gra.cdut.edu.cn/__local/5/D7/C5/334195A8684D88F656F70F1CEEE_EA3DD132_3C1B2.pdf",
      "url": "https://gra.cdut.edu.cn/__local/5/D7/C5/334195A8684D88F656F70F1CEEE_EA3DD132_3C1B2.pdf；2023-11-24",
      "scope": "SRC-008；CDUT-VERIFIED｜成都理工大学党委研工部/研究生院；《成都理工大学2023年博士生指导教师遴选初审名单公示》，PDF 第 1 页。https://gra.cdut.edu.cn/__local/5/D7/C5/334195A8684D88F656F70F1CEEE_EA3DD132_3C1B2.pdf；2023-11-24 发布，按成理校研〔2023〕270 号开展“个人申请→学院审核推荐→学校复核→专家评审→初审公示”。仅作为2023 历史流程事实，2025 新规出现后不得作为 2026 终局要求。2026-10-22 核实。"
    },
    {
      "id": "SRC-009",
      "status": "GENERAL-RESEARCH",
      "title": "GENERAL-RESEARCH｜全国人大常委会立法；教育部官方法规库；《中华人民共和国学位法》第三十二条、第四十五条。https://www.moe.gov.cn/jyb_sjzl/sjzl_zcfg/zcfg_jyfl/202404/t20240426_1127804.html",
      "url": "https://www.moe.gov.cn/jyb_sjzl/sjzl_zcfg/zcfg_jyfl/202404/t20240426_1127804.html；2024-04-26",
      "scope": "SRC-009；GENERAL-RESEARCH｜全国人大常委会立法；教育部官方法规库；《中华人民共和国学位法》第三十二条、第四十五条。https://www.moe.gov.cn/jyb_sjzl/sjzl_zcfg/zcfg_jyfl/202404/t20240426_1127804.html；2024-04-26 通过、2025-01-01 施行；2026-10-23 在教育部官方检索全文核第32条“遴选、考核、监督和动态调整”；直接打开超时，官方搜索文本核验，非下载全文。不规定成都理工表单、阈值或机构签批权。"
    },
    {
      "id": "SRC-010",
      "status": "CURRENTITY-UNKNOWN",
      "title": "CURRENTITY-UNKNOWN｜成都理工大学（待取得）；2025 版《成都理工大学博士研究生指导教师增列办法》，学院公示称成理校研〔2025〕27 号、方案正文有“成理研〔2025〕27号”写法差异；指向 SRC-004、005，原始制度全文及附件未取得。检索路径：校党政办制度公开站、研究生院通知、生态环境学院 2025-10-23 公告附件。",
      "scope": "SRC-010；CURRENTITY-UNKNOWN｜成都理工大学（待取得）；2025 版《成都理工大学博士研究生指导教师增列办法》，学院公示称成理校研〔2025〕27 号、方案正文有“成理研〔2025〕27号”写法差异；指向 SRC-004、005，原始制度全文及附件未取得。检索路径：校党政办制度公开站、研究生院通知、生态环境学院 2025-10-23 公告附件。；2025-07-09 已由校长办公会审定相关议题 [SRC-007]；确切发文日、生效日、与 2023 版废止关系、博导直接认定及终审角色待确认。不得填入 2026 硬阈值。"
    },
    {
      "id": "SRC-011",
      "status": "CURRENTITY-UNKNOWN",
      "title": "CURRENTITY-UNKNOWN｜成都理工大学（待取得）；2023 版《成都理工大学博士研究生指导教师增列办法》（成理校研〔2023〕270号）；由 SRC-001 第六条与 SRC-008 指名，但制度本体尚未取得。检索路径：研究生院文件制度、学院博士增列通知附件。",
      "scope": "SRC-011；CURRENTITY-UNKNOWN｜成都理工大学（待取得）；2023 版《成都理工大学博士研究生指导教师增列办法》（成理校研〔2023〕270号）；由 SRC-001 第六条与 SRC-008 指名，但制度本体尚未取得。检索路径：研究生院文件制度、学院博士增列通知附件。；至少在 2023—2024 文件中被引用；2025 新规出现后当前效力/过渡批次未知，不能直接应用旧版条件。"
    },
    {
      "id": "SRC-012",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED（仅公示事实）｜成都理工大学物理学院；《物理学院关于新增硕士研究生导师的公示》，https://cop.cdut.edu.cn/info/1637/5728.htm",
      "url": "https://cop.cdut.edu.cn/info/1637/5728.htm；2026-05-08",
      "scope": "SRC-012；CDUT-VERIFIED（仅公示事实）｜成都理工大学物理学院；《物理学院关于新增硕士研究生导师的公示》，https://cop.cdut.edu.cn/info/1637/5728.htm；2026-05-08 发布，公示至 2026-05-11；官方搜索提取完整公告主体，引用 2018 校级办法和物理学院《试行》办法，称本人申请、分委员会表决、拟增列 8 人；2026-10-23 页面直开受限，附表和该学院细则全文未核，公示不是最终任职决定。"
    },
    {
      "id": "SRC-013",
      "status": "CURRENTITY-UNKNOWN",
      "title": "CURRENTITY-UNKNOWN（技术原件未得）｜技术仓库（非政策源）；Fuck-GH-Admin/cdut-studio-review-agent，固定 SHA 7b6cdc843d26e926c0c63b8c51a451ff3925cfad，docs/design/review-agent/acceptance/d4-unified-r01/catalog.json（G50）。原始 raw 地址在 2026-10-23 返回 DisabledError。",
      "scope": "SRC-013；CURRENTITY-UNKNOWN（技术原件未得）｜技术仓库（非政策源）；Fuck-GH-Admin/cdut-studio-review-agent，固定 SHA 7b6cdc843d26e926c0c63b8c51a451ff3925cfad，docs/design/review-agent/acceptance/d4-unified-r01/catalog.json（G50）。原始 raw 地址在 2026-10-23 返回 DisabledError。；R02 目录审计原件 [SRC-014] 已核部分 G50 家族/编号映射，不能因此宣称已读技术 catalog.json 的全部 50 项及其可执行规则。G50 设计逻辑只能引用审计文件明确记载的范围，避免虚构“已复用”检查。"
    },
    {
      "id": "SRC-014",
      "status": "GENERAL-RESEARCH",
      "title": "GENERAL-RESEARCH（本项目目录事实，非校本政策）｜R02 项目研究总账；CDUT-ST-R02-Partial-Integration-20261023-FINAL.zip 中 00_R02原始范围与规范/ST-CANDIDATE-MASTER-CATALOG-R02.md、ST-CATALOG-AUDIT-R02.md 和 R02_144项完整进度质量台账.tsv 的本 ID 行；属于用户文件库里已校验 ZIP。",
      "scope": "SRC-014；GENERAL-RESEARCH（本项目目录事实，非校本政策）｜R02 项目研究总账；CDUT-ST-R02-Partial-Integration-20261023-FINAL.zip 中 00_R02原始范围与规范/ST-CANDIDATE-MASTER-CATALOG-R02.md、ST-CATALOG-AUDIT-R02.md 和 R02_144项完整进度质量台账.tsv 的本 ID 行；属于用户文件库里已校验 ZIP。；2026-10-23 实读完整目录及本 ID 台账行：S72/T72/G50、T06-T01 原映射 T06-T01＋T06-T02＋T06-T08；T06-T02 年招资格、T06-T03 指标、T06-T04 任课、T06-T05 工作量；S08-T01 学生导师变更。目录划界有效，不属于成都理工正式行政制度。"
    },
    {
      "id": "SRC-015",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED｜成都理工大学、党委研工部/研究生院；现行已查的新版本《成都理工大学研究生学位论文评阅实施办法》，成理校研〔2024〕41 号，PDF 印刷页 1—20，正文第 12 条（三）及第 19 条。https://energy.cdut.edu.cn/__local/2/E4/72/CEA8B4F56BF6B55F199D43D6BE7_A5B0F6F4_5056D.pdf",
      "url": "https://energy.cdut.edu.cn/__local/2/E4/72/CEA8B4F56BF6B55F199D43D6BE7_A5B0F6F4_5056D.pdf；2024-06-18",
      "scope": "SRC-015；CDUT-VERIFIED｜成都理工大学、党委研工部/研究生院；现行已查的新版本《成都理工大学研究生学位论文评阅实施办法》，成理校研〔2024〕41 号，PDF 印刷页 1—20，正文第 12 条（三）及第 19 条。https://energy.cdut.edu.cn/__local/2/E4/72/CEA8B4F56BF6B55F199D43D6BE7_A5B0F6F4_5056D.pdf；2024-06-18 印发、2024-09-01 施行并明文废止成理校研〔2023〕6 号；2026-10-23 已开 20 页原始 PDF。第12条（三）：同一层次连续两年因论文未通过扣减招生指标者，暂停相应层次招生资格一年；期满书面申请、分委员会同意、研工部/研究生院审批方可恢复。属于 T06-T02，不是 T06-T01 岗位状态通用解除规则。2024 后是否另有替代尚无校方连续效力证明。"
    },
    {
      "id": "SRC-016",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED（历史事实）｜成都理工大学管理科学学院；《管理科学学院关于开展2023年度博士生指导教师遴选工作的通知》；正文及附件名称“直接认定资格简况表”“新增遴选资格简况表”“汇总表”。https://cim.cdut.edu.cn/info/1098/4084.htm",
      "url": "https://cim.cdut.edu.cn/info/1098/4084.htm；2023-10-23",
      "scope": "SRC-016；CDUT-VERIFIED（历史事实）｜成都理工大学管理科学学院；《管理科学学院关于开展2023年度博士生指导教师遴选工作的通知》；正文及附件名称“直接认定资格简况表”“新增遴选资格简况表”“汇总表”。https://cim.cdut.edu.cn/info/1098/4084.htm；2023-10-23 发布；2026-10-23 官方搜索可核历史通知及附件名称，未读取附件内容。不能证明 2025/2026 仍有直接认定类别或同样条件。"
    },
    {
      "id": "SRC-017",
      "status": "GENERAL-RESEARCH",
      "title": "GENERAL-RESEARCH｜中华人民共和国教育部；《教育部关于加强博士生导师岗位管理的若干意见》，教研〔2020〕11 号；重点“健全选聘制度、强化岗位培训、完善考核”等。https://www.moe.gov.cn/srcsite/A22/s7065/202009/t20200927_491838.html",
      "url": "https://www.moe.gov.cn/srcsite/A22/s7065/202009/t20200927_491838.html；2020-09",
      "scope": "SRC-017；GENERAL-RESEARCH｜中华人民共和国教育部；《教育部关于加强博士生导师岗位管理的若干意见》，教研〔2020〕11 号；重点“健全选聘制度、强化岗位培训、完善考核”等。https://www.moe.gov.cn/srcsite/A22/s7065/202009/t20200927_491838.html；2020-09 公开；2026-10-23 教育部官方搜索全文可核核心要求，直接打开超时。要求评价政治素质、师德、学术、育人、指导经历和培养条件，反对简单唯论文/经费；不代替成都理工博士硬门槛、议事规则。"
    },
    {
      "id": "SRC-018",
      "status": "GENERAL-RESEARCH",
      "title": "GENERAL-RESEARCH｜中华人民共和国教育部；《教育部关于印发〈研究生导师指导行为准则〉的通知》，教研〔2020〕12 号；正文导师指导行为底线及失范责任。https://www.moe.gov.cn/srcsite/A22/s7065/202011/t20201111_499442.html",
      "url": "https://www.moe.gov.cn/srcsite/A22/s7065/202011/t20201111_499442.html；2020-11-04",
      "scope": "SRC-018；GENERAL-RESEARCH｜中华人民共和国教育部；《教育部关于印发〈研究生导师指导行为准则〉的通知》，教研〔2020〕12 号；正文导师指导行为底线及失范责任。https://www.moe.gov.cn/srcsite/A22/s7065/202011/t20201111_499442.html；2020-11-04 发文；2026-10-23 教育部官方搜索核基本内容，页面跳转循环。可用于师德/指导行为框架，不让 AI 直接认定举报属实或自行实施处罚。"
    },
    {
      "id": "SRC-019",
      "status": "CDUT-VERIFIED",
      "title": "CDUT-VERIFIED（仅教育培训事实）｜成都理工大学环境与土木工程学院；《环境与土木工程学院2025-2026学年下半年研究生导师培训》。https://cece.cdut.edu.cn/info/1003/9831.htm",
      "url": "https://cece.cdut.edu.cn/info/1003/9831.htm；学院新闻记录",
      "scope": "SRC-019；CDUT-VERIFIED（仅教育培训事实）｜成都理工大学环境与土木工程学院；《环境与土木工程学院2025-2026学年下半年研究生导师培训》。https://cece.cdut.edu.cn/info/1003/9831.htm；学院新闻记录 2026-03-18 对在岗导师、特别是近年来新晋导师开展培训；2026-10-23 官方检索文字核对。说明培训实际发生，不证明每位个案导师已通过准入培训，准入条件仍以 SRC-001 第20条和学校培训名册 M021 为准。"
    }
  ]
} as const
