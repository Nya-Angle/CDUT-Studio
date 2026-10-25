import type { TemplateVersion } from '@profer/shared'

/** Generated from the R02 research handoff; policy gaps remain manual. */
export const template: TemplateVersion = {
  "templateId": "S04-T05",
  "version": 1,
  "schemaVersion": 2,
  "name": "延长住宿、退住及住宿资格终止核验",
  "description": "本地研究模板 · 非校方正式模板。延长住宿、退住及住宿资格终止核验；只做材料归属、可读性、版本一致性与待核事项整理。校本规则、权限与正式决定必须由有权人员人工确认。",
  "catalogKind": "builtin",
  "sourceNote": "R02_RESEARCH_TEMPLATE_NONOFFICIAL: 本地研究模板，非校方正式模板；SRC IDs 仅为研究来源索引，不是案卷材料 SourceRef。政策证据状态为 PARTIAL；所有未确认政策/权限/效力项均须人工复核。",
  "objectType": "person",
  "displayName": {
    "template": "{{F002}} · 延长住宿、退住及住宿资格终止核验"
  },
  "fields": [
    {
      "key": "F001",
      "label": "案卷 ID、操作事件 ID、版本序号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：案卷 ID、操作事件 ID、版本序号；X；M021；P0 全程；不可由上传文件改写；S1；string+event_ref+int／案卷事件；服务端案卷主键、事件日志与 M021 版本账；服务端生成失败→技术异常；绝不从上传件补造 ID。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F001；原稿字段合同：案卷 ID、操作事件 ID、版本序号；X；M021；P0 全程；不可由上传文件改写；S1；string+event_ref+int／案卷事件；服务端案卷主键、事件日志与 M021 版本账；服务端生成失败→技术异常；绝不从上传件补造 ID；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F002",
      "label": "被审学生的可信唯一身份键与姓名映射",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：被审学生的可信唯一身份键与姓名映射；S；M003；P0 必核；仅姓名同名不够；查不到主档为 SOURCE_UNAVAILABLE；S2；student_ref+string／被审学生；M003 学籍主键、合法姓名映射/历史身份变更键；学籍源失联 SOURCE_UNAVAILABLE；不同主键同名 CONFLICT。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F002；原稿字段合同：被审学生的可信唯一身份键与姓名映射；S；M003；P0 必核；仅姓名同名不够；查不到主档为 SOURCE_UNAVAILABLE；S2；student_ref+string／被审学生；M003 学籍主键、合法姓名映射/历史身份变更键；学籍源失联 SOURCE_UNAVAILABLE；不同主键同名 CONFLICT；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F003",
      "label": "实际上传/提交人及登录身份",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：实际上传/提交人及登录身份；X + M020；P0、P7；与学生本人可不同，不暗含代理权；S2；actor_ref／提交事件；可信会话主体、M020 授权人索引、签收日志；未登录/无代理校验不得执行正式动作；NEEDS_HUMAN_DECISION。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F003；原稿字段合同：实际上传/提交人及登录身份；X + M020；P0、P7；与学生本人可不同，不暗含代理权；S2；actor_ref／提交事件；可信会话主体、M020 授权人索引、签收日志；未登录/无代理校验不得执行正式动作；NEEDS_HUMAN_DECISION；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F004",
      "label": "校区（成都/宜宾及其他）、归口组织",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：校区（成都/宜宾及其他）、归口组织；H/S；M004、M011；P0；影响适用政策、办理角色和时间窗；S1；enum+org_ref／校区/申请对象；M004 房间所属校区、M011 政策适用地区；申报未写校区先澄清；两校区冲突 CONFLICT；权威源失联 SOURCE_UNAVAILABLE。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F004；原稿字段合同：校区（成都/宜宾及其他）、归口组织；H/S；M004、M011；P0；影响适用政策、办理角色和时间窗；S1；enum+org_ref／校区/申请对象；M004 房间所属校区、M011 政策适用地区；申报未写校区先澄清；两校区冲突 CONFLICT；权威源失联 SOURCE_UNAVAILABLE；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F005",
      "label": "学段、培养方式及研究生类型",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：学段、培养方式及研究生类型；S；M003；P0–P2；本科/专科/硕士/连读/国际/非全日制应保留原始类别，未知不自动拒绝；S2；enum+code／学生身份；M003 学段/培养类别原字段、有效学籍期；可信主档无法读→SOURCE_UNAVAILABLE；无现行类别规则→POLICY_UNCONFIRMED。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F005；原稿字段合同：学段、培养方式及研究生类型；S；M003；P0–P2；本科/专科/硕士/连读/国际/非全日制应保留原始类别，未知不自动拒绝；S2；enum+code／学生身份；M003 学段/培养类别原字段、有效学籍期；可信主档无法读→SOURCE_UNAVAILABLE；无现行类别规则→POLICY_UNCONFIRMED；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F006",
      "label": "学籍/毕业/休学/退学当前权威状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：学籍/毕业/休学/退学当前权威状态；S；M003、M005；P0/P2/P5；不得从学生证或自述推断生效；S2；enum+date_range／学籍状态；M003/M005 的变动决定号和生效日期；尚无生效决定不得擅填“退学/延期”；待学校原机关处理。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F006；原稿字段合同：学籍/毕业/休学/退学当前权威状态；S；M003、M005；P0/P2/P5；不得从学生证或自述推断生效；S2；enum+date_range／学籍状态；M003/M005 的变动决定号和生效日期；尚无生效决定不得擅填“退学/延期”；待学校原机关处理；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F007",
      "label": "一次住宿分配/床位占用关系键，关联楼栋房号/历史",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：一次住宿分配/床位占用关系键，关联楼栋房号/历史；H；M004；P0 全程；必须区分旧房/新房及不同时期；S2；assignment_ref／住寝关系；M004 原始分配键、楼栋/房号、入住区间；unassigned 是合法状态；房间权威不可取 SOURCE_UNAVAILABLE。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F007；原稿字段合同：一次住宿分配/床位占用关系键，关联楼栋房号/历史；H；M004；P0 全程；必须区分旧房/新房及不同时期；S2；assignment_ref／住寝关系；M004 原始分配键、楼栋/房号、入住区间；unassigned 是合法状态；房间权威不可取 SOURCE_UNAVAILABLE；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F008",
      "label": "宿管占用状态与最近更新时刻",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：宿管占用状态与最近更新时刻；H；M004、M015；P0/P6；不能用“欠费”代替宿管状态；S2；enum+timestamp／住寝占用；M004/M015 宿管占用状态更新事件；状态冲突 CONFLICT；接口失败 SOURCE_UNAVAILABLE。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F008；原稿字段合同：宿管占用状态与最近更新时刻；H；M004、M015；P0/P6；不能用“欠费”代替宿管状态；S2；enum+timestamp／住寝占用；M004/M015 宿管占用状态更新事件；状态冲突 CONFLICT；接口失败 SOURCE_UNAVAILABLE；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F009",
      "label": "操作类型：延住/恢复入住/中途退住/毕业退住/终止状态核验",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：操作类型：延住/恢复入住/中途退住/毕业退住/终止状态核验；A/H；M001、M021；P0；类型与主业务路由不一致则 CONFLICT；S1；enum／本次办理动作；M001 表头、M021 案卷登记动作；申请意图未明 NEEDS_MATERIAL 澄清；调寝转邻项。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F009；原稿字段合同：操作类型：延住/恢复入住/中途退住/毕业退住/终止状态核验；A/H；M001、M021；P0；类型与主业务路由不一致则 CONFLICT；S1；enum／本次办理动作；M001 表头、M021 案卷登记动作；申请意图未明 NEEDS_MATERIAL 澄清；调寝转邻项；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F010",
      "label": "申请/受理时间、时区和可信回执",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：申请/受理时间、时区和可信回执；X/C；M001、M007、M021；P1；系统时间优先，上传表单日期仅候选；S1；timestamp+receipt_ref／受理事件；M007 正式收件时刻、M021 服务端事件；上传表单日期不是收件日期；无收件应由学院核实。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F010；原稿字段合同：申请/受理时间、时区和可信回执；X/C；M001、M007、M021；P1；系统时间优先，上传表单日期仅候选；S1；timestamp+receipt_ref／受理事件；M007 正式收件时刻、M021 服务端事件；上传表单日期不是收件日期；无收件应由学院核实；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F011",
      "label": "学年、学期、毕业届别、年度批次",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：学年、学期、毕业届别、年度批次；S/P；M003、M011、M016；P0/P5；批次与校区共同决定适用范围；S1；term_ref+cohort／批次；M003 学年、M011 通知题头、M016 毕业届别；学年错配 CONFLICT；无当期通知 POLICY_UNCONFIRMED。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F011；原稿字段合同：学年、学期、毕业届别、年度批次；S/P；M003、M011、M016；P0/P5；批次与校区共同决定适用范围；S1；term_ref+cohort／批次；M003 学年、M011 通知题头、M016 毕业届别；学年错配 CONFLICT；无当期通知 POLICY_UNCONFIRMED；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F012",
      "label": "使用的校本 policy_profile 键与确认状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：使用的校本 policy_profile 键与确认状态；P；M011；P0 全程；缺现行版本标 POLICY_UNCONFIRMED；S0；policy_ref+enum／政策配置；M011 生效政策 ID、适用键及版本记录；当期规范不明 POLICY_UNCONFIRMED，停止时限硬判。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F012；原稿字段合同：使用的校本 policy_profile 键与确认状态；P；M011；P0 全程；缺现行版本标 POLICY_UNCONFIRMED；S0；policy_ref+enum／政策配置；M011 生效政策 ID、适用键及版本记录；当期规范不明 POLICY_UNCONFIRMED，停止时限硬判；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F013",
      "label": "申请理由、拟入住或拟退住安排（申请人陈述）",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：申请理由、拟入住或拟退住安排（申请人陈述）；A；M001；P1；文本事实不等于经审批的例外；S2；text+date_range?／申请主张；M001 理由栏、拟安排栏、页码；当前应填却空或字迹不清分别 NEEDS_MATERIAL/UNREADABLE。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F013；原稿字段合同：申请理由、拟入住或拟退住安排（申请人陈述）；A；M001；P1；文本事实不等于经审批的例外；S2；text+date_range?／申请主张；M001 理由栏、拟安排栏、页码；当前应填却空或字迹不清分别 NEEDS_MATERIAL/UNREADABLE；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F014",
      "label": "S04-T02 已生效外住/取消外住决定与时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：S04-T02 已生效外住/取消外住决定与时间；H/S；M006；SC-02/04，P2；未办理外住者不适用；S2；decision_ref+timestamp／外住邻项；M006 S04-T02 原业务决定 ID、状态和签发；非外住情形 NOT_APPLICABLE；权威不可查 SOURCE_UNAVAILABLE。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F014；原稿字段合同：S04-T02 已生效外住/取消外住决定与时间；H/S；M006；SC-02/04，P2；未办理外住者不适用；S2；decision_ref+timestamp／外住邻项；M006 S04-T02 原业务决定 ID、状态和签发；非外住情形 NOT_APPLICABLE；权威不可查 SOURCE_UNAVAILABLE；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F015",
      "label": "S01 学籍异动或延毕有效决定、起止时点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：S01 学籍异动或延毕有效决定、起止时点；S；M005；SC-01/04/08，P2/P5；只引用权威结果；S2；decision_ref+date_range／学籍邻项；M005 原机关文书页码/系统决定号；拟异动≠已生效；权威未决交学籍有权人。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F015；原稿字段合同：S01 学籍异动或延毕有效决定、起止时点；S；M005；SC-01/04/08，P2/P5；只引用权威结果；S2；decision_ref+date_range／学籍邻项；M005 原机关文书页码/系统决定号；拟异动≠已生效；权威未决交学籍有权人；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F016",
      "label": "学院审核、签章主体、意见及提交时刻",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：学院审核、签章主体、意见及提交时刻；C；M002、M007；延住 P2，退住按正式流程选用；表单章像非权威审批；S2；opinion_ref+timestamp／学院审核；M002/M007 个人行、签章/审批日志；P1 尚未发生 NOT_APPLICABLE；P2 真实缺本阶段审核才列学院待办。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F016；原稿字段合同：学院审核、签章主体、意见及提交时刻；C；M002、M007；延住 P2，退住按正式流程选用；表单章像非权威审批；S2；opinion_ref+timestamp／学院审核；M002/M007 个人行、签章/审批日志；P1 尚未发生 NOT_APPLICABLE；P2 真实缺本阶段审核才列学院待办；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F017",
      "label": "住宿申请表的申请对象、签字、填写项",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：住宿申请表的申请对象、签字、填写项；A/C；M001；申请 P1；不要求未来阶段中心批文；S2；structured_fields／申请表；M001 学生/动作/签名栏与页码；到 P1 应填项目缺 NEEDS_MATERIAL；文字看不清 UNREADABLE。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F017；原稿字段合同：住宿申请表的申请对象、签字、填写项；A/C；M001；申请 P1；不要求未来阶段中心批文；S2；structured_fields／申请表；M001 学生/动作/签名栏与页码；到 P1 应填项目缺 NEEDS_MATERIAL；文字看不清 UNREADABLE；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F018",
      "label": "楼寓有权住宿审批/备案决定及版本",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：楼寓有权住宿审批/备案决定及版本；H；M008；延住 P3 后才出现；是否批准只从学校正式记录得知；S2；decision_ref+version／住房正式决定；M008 校方审批/名单条目与编号；P1/P2 NOT_APPLICABLE；P3 接口断 SOURCE_UNAVAILABLE。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F018；原稿字段合同：楼寓有权住宿审批/备案决定及版本；H；M008；延住 P3 后才出现；是否批准只从学校正式记录得知；S2；decision_ref+version／住房正式决定；M008 校方审批/名单条目与编号；P1/P2 NOT_APPLICABLE；P3 接口断 SOURCE_UNAVAILABLE；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F019",
      "label": "审批批准的校区/床位/期限/附加条件",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：审批批准的校区/床位/期限/附加条件；H；M008；P3–P6；未知期限不可由模型补造；S2；campus+assignment+date_range／决定范围；M008 获批行、期限/附款原文；期限不见 SOURCE_UNAVAILABLE 或待原文；不能模型补填。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F019；原稿字段合同：审批批准的校区/床位/期限/附加条件；H；M008；P3–P6；未知期限不可由模型补造；S2；campus+assignment+date_range／决定范围；M008 获批行、期限/附款原文；期限不见 SOURCE_UNAVAILABLE 或待原文；不能模型补填；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F020",
      "label": "正式缴费通知、截止时刻与送达证明",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：正式缴费通知、截止时刻与送达证明；H/F；M009、M023；延住 P4；适用期和送达不明不得“自动放弃”；S2；notice_ref+timestamp／收费通知；M009/M023 通知原文、收件/送达日志；无当期通知或已否送达不明→POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F020；原稿字段合同：正式缴费通知、截止时刻与送达证明；H/F；M009、M023；延住 P4；适用期和送达不明不得“自动放弃”；S2；notice_ref+timestamp／收费通知；M009/M023 通知原文、收件/送达日志；无当期通知或已否送达不明→POLICY_UNCONFIRMED/NEEDS_HUMAN_DECISION；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F021",
      "label": "财务住宿费应缴/已生成状态与时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：财务住宿费应缴/已生成状态与时间；F；M009；P4；金额不由本模板核算；S3；charge_ref+enum+timestamp／财务应缴；M009 住宿收费单号、期间、费用类别；财务服务失联 SOURCE_UNAVAILABLE；学生无义务自建收费账。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F021；原稿字段合同：财务住宿费应缴/已生成状态与时间；F；M009；P4；金额不由本模板核算；S3；charge_ref+enum+timestamp／财务应缴；M009 住宿收费单号、期间、费用类别；财务服务失联 SOURCE_UNAVAILABLE；学生无义务自建收费账；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F022",
      "label": "该次住宿对应的实缴状态、入账时刻",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：该次住宿对应的实缴状态、入账时刻；F；M010；P4/P5；截图只作查询线索；S3；payment_ref+enum+timestamp／财务实缴；M010 入账流水与状态更新时点；截图与未入账时点错开先等待核账；确定同一时点冲突才 CONFLICT。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F022；原稿字段合同：该次住宿对应的实缴状态、入账时刻；F；M010；P4/P5；截图只作查询线索；S3；payment_ref+enum+timestamp／财务实缴；M010 入账流水与状态更新时点；截图与未入账时点错开先等待核账；确定同一时点冲突才 CONFLICT；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F023",
      "label": "房间钥匙/门禁介质移交与接收时间",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：房间钥匙/门禁介质移交与接收时间；D；M012；退宿 P5；申请阶段未发生=不适用；S2；handover_ref+timestamp／退房实物；M012 前台钥匙/卡签收号、签收栏；P1–P4 NOT_APPLICABLE；P5 实际应交未交→现场待办。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F023；原稿字段合同：房间钥匙/门禁介质移交与接收时间；D；M012；退宿 P5；申请阶段未发生=不适用；S2；handover_ref+timestamp／退房实物；M012 前台钥匙/卡签收号、签收栏；P1–P4 NOT_APPLICABLE；P5 实际应交未交→现场待办；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F024",
      "label": "室内公物与房间交验事实、异常",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：室内公物与房间交验事实、异常；D；M013；退宿 P5；破损责任/赔偿需有权处理；S2；inspection_ref+enum／公物交验；M013 公物/遗留物检查表位置及异常栏；P5 现场缺记录则前台核；损坏争议 NEEDS_HUMAN_DECISION。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F024；原稿字段合同：室内公物与房间交验事实、异常；D；M013；退宿 P5；破损责任/赔偿需有权处理；S2；inspection_ref+enum／公物交验；M013 公物/遗留物检查表位置及异常栏；P5 现场缺记录则前台核；损坏争议 NEEDS_HUMAN_DECISION；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F025",
      "label": "退寝室单/退宿单编号、签发者、关联房号",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：退寝室单/退宿单编号、签发者、关联房号；D/H；M014；退宿 P5；须和 F007 绑定，不能复用到新房；S2；receipt_ref+room_ref／退寝室单；M014 退宿单号、旧房号、签发章、页码；错房 CONFLICT；扫描难读 UNREADABLE；前台无台账 SOURCE_UNAVAILABLE。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F025；原稿字段合同：退寝室单/退宿单编号、签发者、关联房号；D/H；M014；退宿 P5；须和 F007 绑定，不能复用到新房；S2；receipt_ref+room_ref／退寝室单；M014 退宿单号、旧房号、签发章、页码；错房 CONFLICT；扫描难读 UNREADABLE；前台无台账 SOURCE_UNAVAILABLE；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F026",
      "label": "毕业数字离校系统的相关事项结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：毕业数字离校系统的相关事项结果；S/H；M016；毕业退宿 P5–P6；不同校区流程未知则不强求；S2；enum+event_ref／毕业离校；M016 数字离校系统宿舍子项/届别；本届未用平台 NOT_APPLICABLE；制度不明 POLICY_UNCONFIRMED。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F026；原稿字段合同：毕业数字离校系统的相关事项结果；S/H；M016；毕业退宿 P5–P6；不同校区流程未知则不强求；S2；enum+event_ref／毕业离校；M016 数字离校系统宿舍子项/届别；本届未用平台 NOT_APPLICABLE；制度不明 POLICY_UNCONFIRMED；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F027",
      "label": "中心/宿管最终入住或退宿台账处理状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：中心/宿管最终入住或退宿台账处理状态；H；M015；P5–P6；区别“已接收申请”和“已更新床位”；S2；enum+timestamp／宿管落账；M015 公寓后台状态事件、登记人员；交钥匙已收却未更新账 CONFLICT；不代写台账。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F027；原稿字段合同：中心/宿管最终入住或退宿台账处理状态；H；M015；P5–P6；区别“已接收申请”和“已更新床位”；S2；enum+timestamp／宿管落账；M015 公寓后台状态事件、登记人员；交钥匙已收却未更新账 CONFLICT；不代写台账；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F028",
      "label": "计划财务处对住宿收费变更的独立处理状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：计划财务处对住宿收费变更的独立处理状态；F；M017；P4/P6；不是本模板的正式退费裁决；S3；finance_decision_ref／独立费用处理；M017 核减/退款等财务原始处理号；没有财务动作 NOT_APPLICABLE；无接口 SOURCE_UNAVAILABLE。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F028；原稿字段合同：计划财务处对住宿收费变更的独立处理状态；F；M017；P4/P6；不是本模板的正式退费裁决；S3；finance_decision_ref／独立费用处理；M017 核减/退款等财务原始处理号；没有财务动作 NOT_APPLICABLE；无接口 SOURCE_UNAVAILABLE；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F029",
      "label": "撤回、补件、复核申请、主张及关联旧案 ID",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：撤回、补件、复核申请、主张及关联旧案 ID；A/X；M018；P1–P7 触发时；不可覆盖历史；S2；action_ref+enum／撤回/复核；M018 原案号、请求文本、递交回执；无请求 NOT_APPLICABLE；是否正式生效待有权受理员。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F029；原稿字段合同：撤回、补件、复核申请、主张及关联旧案 ID；A/X；M018；P1–P7 触发时；不可覆盖历史；S2；action_ref+enum／撤回/复核；M018 原案号、请求文本、递交回执；无请求 NOT_APPLICABLE；是否正式生效待有权受理员；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F030",
      "label": "涉住宿资格终止的正式文书、原因、送达和生效时点",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：涉住宿资格终止的正式文书、原因、送达和生效时点；H/其他有权机关；M023；SC-07/08，P6；无当前授权文件只能人工核；S3；formal_doc_ref+timestamp／终止文书；M023 正式决定号、签发单位、生效/送达栏；没有正式授权 POLICY_UNCONFIRMED，绝不编造终止结果。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F030；原稿字段合同：涉住宿资格终止的正式文书、原因、送达和生效时点；H/其他有权机关；M023；SC-07/08，P6；无当前授权文件只能人工核；S3；formal_doc_ref+timestamp／终止文书；M023 正式决定号、签发单位、生效/送达栏；没有正式授权 POLICY_UNCONFIRMED，绝不编造终止结果；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F031",
      "label": "适用规范版本、发布、生效、废止/替代、校区范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：适用规范版本、发布、生效、废止/替代、校区范围；P；M011；P0–P7；旧试行办法不能默认当前有效；S0；policy_versions[]／规范时效；M011 发布、生效、修订和适用页码；替代链不全 POLICY_UNCONFIRMED，不以抓取时间代生效。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F031；原稿字段合同：适用规范版本、发布、生效、废止/替代、校区范围；P；M011；P0–P7；旧试行办法不能默认当前有效；S0；policy_versions[]／规范时效；M011 发布、生效、修订和适用页码；替代链不全 POLICY_UNCONFIRMED，不以抓取时间代生效；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F032",
      "label": "代办授权人/被授权人、动作、期限、签发渠道",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：代办授权人/被授权人、动作、期限、签发渠道；S/X；M020；仅实际代理提交/撤回/复核时；未核代理规范则人工；S2；delegation_ref+scope／代理动作；M020 授权书/校内代理登记范围栏；无真实委托或许可不明→分别补件/政策确认；越权动作不执行。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F032；原稿字段合同：代办授权人/被授权人、动作、期限、签发渠道；S/X；M020；仅实际代理提交/撤回/复核时；未核代理规范则人工；S2；delegation_ref+scope／代理动作；M020 授权书/校内代理登记范围栏；无真实委托或许可不明→分别补件/政策确认；越权动作不执行；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F033",
      "label": "申请跨宿舍、跨校区、跨学年的重叠关系",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：申请跨宿舍、跨校区、跨学年的重叠关系；H/X；M004、M021；P0/P6；需关系键而非姓名匹配；S2；relation_ref[]／跨案关联；M004 多房关系键、M021 重叠事件日志；旧房/新房时段不一不算冲突；源失联不判占用。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F033；原稿字段合同：申请跨宿舍、跨校区、跨学年的重叠关系；H/X；M004、M021；P0/P6；需关系键而非姓名匹配；S2；relation_ref[]／跨案关联；M004 多房关系键、M021 重叠事件日志；旧房/新房时段不一不算冲突；源失联不判占用；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F034",
      "label": "材料版本、取代链与影响字段集合",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：材料版本、取代链与影响字段集合；X；M021；全程更新；原件哈希、页码和旧审查不删除；S1；version_ref+set<F_ref>／证据版本；M021 哈希、supersedes、更改字段映射；旧版丢失 SOURCE_UNAVAILABLE；保留旧 R 快照而非覆盖。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F034；原稿字段合同：材料版本、取代链与影响字段集合；X；M021；全程更新；原件哈希、页码和旧审查不删除；S1；version_ref+set<F_ref>／证据版本；M021 哈希、supersedes、更改字段映射；旧版丢失 SOURCE_UNAVAILABLE；保留旧 R 快照而非覆盖；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F035",
      "label": "证据出处、页/栏位、可信等级、签发角色与校验结果",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：证据出处、页/栏位、可信等级、签发角色与校验结果；X + 对应签发源；M001–M026；每条规则；OCR 章像/人工意见与权威数据分层；S1–S3；evidence_locator[]／每条规则证据；M001–M026 的文件页/坐标/表格行/签发和可信等级；缺原件可无法核源，不可读是 UNREADABLE；OCR 不是独立权威。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F035；原稿字段合同：证据出处、页/栏位、可信等级、签发角色与校验结果；X + 对应签发源；M001–M026；每条规则；OCR 章像/人工意见与权威数据分层；S1–S3；evidence_locator[]／每条规则证据；M001–M026 的文件页/坐标/表格行/签发和可信等级；缺原件可无法核源，不可读是 UNREADABLE；OCR 不是独立权威；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F036",
      "label": "特殊困难、缴费例外、延住例外的人工裁量请求",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：特殊困难、缴费例外、延住例外的人工裁量请求；A/C/H；M001、M011、M023；仅 SC-03/07 等；无授权标准→人工；S2/S3；text+request_ref／例外主张；M001 理由及附件位置，M023 若后续有正式答复；没有例外 NOT_APPLICABLE；请求真实但标准未知→人工。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F036；原稿字段合同：特殊困难、缴费例外、延住例外的人工裁量请求；A/C/H；M001、M011、M023；仅 SC-03/07 等；无授权标准→人工；S2/S3；text+request_ref／例外主张；M001 理由及附件位置，M023 若后续有正式答复；没有例外 NOT_APPLICABLE；请求真实但标准未知→人工；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F037",
      "label": "本次办理动作人员及当时有效授权范围",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：本次办理动作人员及当时有效授权范围；X + 学校授权目录；M007、M008、M015、M019、M023；每次受理、批准、撤回、复核、签收；Renderer 自报身份无效；S2；actor_authority_ref／正式动作权限；岗位目录、M007/M008/M015/M019/M023 签发源；Renderer 自述无效；无法验证时不记录正式决定。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F037；原稿字段合同：本次办理动作人员及当时有效授权范围；X + 学校授权目录；M007、M008、M015、M019、M023；每次受理、批准、撤回、复核、签收；Renderer 自报身份无效；S2；actor_authority_ref／正式动作权限；岗位目录、M007/M008/M015/M019/M023 签发源；Renderer 自述无效；无法验证时不记录正式决定；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F038",
      "label": "与本案关联的学校正式决定类型、签发日与效力",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：与本案关联的学校正式决定类型、签发日与效力；H/S；M005、M006、M008、M019、M022、M023；P3–P7；不把事实预审结果写成有效学校决定；S2/S3；decision_ref[]／正式权利事件；M005/M006/M008/M019/M022/M023 决定签发/效力；无决定记录保持未知/待有权人；与事实 PASS 分离。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F038；原稿字段合同：与本案关联的学校正式决定类型、签发日与效力；H/S；M005、M006、M008、M019、M022、M023；P3–P7；不把事实预审结果写成有效学校决定；S2/S3；decision_ref[]／正式权利事件；M005/M006/M008/M019/M022/M023 决定签发/效力；无决定记录保持未知/待有权人；与事实 PASS 分离；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F039",
      "label": "权威数据服务可用性、快照及最后更新时刻",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：权威数据服务可用性、快照及最后更新时刻；X + H/S/F/P；M003、M004、M011、M021；全程；服务故障为 SOURCE_UNAVAILABLE，与学生缺件分开；S1；source_health+timestamp／源可用性；学籍/宿管/财务/政策服务快照及错误码；服务不可达 SOURCE_UNAVAILABLE；不能向学生转嫁补系统截图。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F039；原稿字段合同：权威数据服务可用性、快照及最后更新时刻；X + H/S/F/P；M003、M004、M011、M021；全程；服务故障为 SOURCE_UNAVAILABLE，与学生缺件分开；S1；source_health+timestamp／源可用性；学籍/宿管/财务/政策服务快照及错误码；服务不可达 SOURCE_UNAVAILABLE；不能向学生转嫁补系统截图；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F040",
      "label": "当前案卷阶段、历史事件与办结/重开关联",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：当前案卷阶段、历史事件与办结/重开关联；X；M018、M019、M021；全程；每个阶段只检查已经应形成的材料；S1；enum+event_ref[]／流程阶段；M021 原始事件版本、M018/M019 复核事件；不能凭申请文本跳 P3/P5，历史状态完整保存。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F040；原稿字段合同：当前案卷阶段、历史事件与办结/重开关联；X；M018、M019、M021；全程；每个阶段只检查已经应形成的材料；S1；enum+event_ref[]／流程阶段；M021 原始事件版本、M018/M019 复核事件；不能凭申请文本跳 P3/P5，历史状态完整保存；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F041",
      "label": "已结算/已退或待退的费用类别和财务结果引用",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：已结算/已退或待退的费用类别和财务结果引用；F；M017；仅财务已处理/提出财务请求；区分住宿费与电费、不得以此得出退宿；S3；fee_type+finance_ref／费用类别；M017 财务费用类别、应退/已退处理号；非财务事项 NOT_APPLICABLE；未知收费标准由财务确认。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F041；原稿字段合同：已结算/已退或待退的费用类别和财务结果引用；F；M017；仅财务已处理/提出财务请求；区分住宿费与电费、不得以此得出退宿；S3；fee_type+finance_ref／费用类别；M017 财务费用类别、应退/已退处理号；非财务事项 NOT_APPLICABLE；未知收费标准由财务确认；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F042",
      "label": "国际学生科与楼寓之间的退宿/外住变更受理号、动作时间及状态",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：国际学生科与楼寓之间的退宿/外住变更受理号、动作时间及状态；国际学生科/H；M024；SC-10 涉国际生且正式登记阶段；不能以派出所《住宿登记表》直接标“学校已退房”；S2；office_receipt_ref+enum+timestamp／国际生住宿变更；M024 国际学生科正式受理号、校区宿管衔接记录；国际学生无此阶段 NOT_APPLICABLE；仅有公安登记/手册图片不得推定校方已退宿。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F042；原稿字段合同：国际学生科与楼寓之间的退宿/外住变更受理号、动作时间及状态；国际学生科/H；M024；SC-10 涉国际生且正式登记阶段；不能以派出所《住宿登记表》直接标“学校已退房”；S2；office_receipt_ref+enum+timestamp／国际生住宿变更；M024 国际学生科正式受理号、校区宿管衔接记录；国际学生无此阶段 NOT_APPLICABLE；仅有公安登记/手册图片不得推定校方已退宿；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    },
    {
      "key": "F043",
      "label": "国际学生校外实际居住的公安住宿登记表号、登记时刻及对应对象",
      "kind": "text",
      "required": false,
      "visibility": "internal",
      "scope": "case",
      "extractionHint": "原稿类型/对象与证据定位：国际学生校外实际居住的公安住宿登记表号、登记时刻及对应对象；学生申请/公安机关可核来源；M025；SC-10 中真实需外住及国际学生科按当期制度要求时；不表示宿舍钥匙已还；S3；police_registration_ref+timestamp／国际生校外居住登记；M025 《住宿登记表》公安登记号、学生身份、居住时点（最小化，不外显住址）；无此国际转外住分支 NOT_APPLICABLE；2025 年度以后强制条件待校方确认，登记证明不充当学校退宿结果。只提取候选事实；必须按指定材料/权威来源核验，未知或冲突不得猜测。",
      "displayHint": "研究字段 F043；原稿字段合同：国际学生校外实际居住的公安住宿登记表号、登记时刻及对应对象；学生申请/公安机关可核来源；M025；SC-10 中真实需外住及国际学生科按当期制度要求时；不表示宿舍钥匙已还；S3；police_registration_ref+timestamp／国际生校外居住登记；M025 《住宿登记表》公安登记号、学生身份、居住时点（最小化，不外显住址）；无此国际转外住分支 NOT_APPLICABLE；2025 年度以后强制条件待校方确认，登记证明不充当学校退宿结果；缺失、不可读、来源失联和政策不明须分开处理，不自动形成正式决定。"
    }
  ],
  "materialSlots": [
    {
      "id": "M001",
      "name": "住宿申请表/补充说明；表达延住/恢复入住请求",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 住宿申请表/补充说明；表达延住/恢复入住请求；P1 SC-01/02/03；学生向学院提交；线下纸表或校方当期认可电子原件，非申请者自制批准书；[SRC-001]；F009/F013/F017/F036",
      "requiredElements": [
        "住宿申请表/补充说明；表达延住/恢复入住请求"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M002",
      "name": "学院批量住宿申请汇总表；关联多名学生与各自申请",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 学院批量住宿申请汇总表；关联多名学生与各自申请；P2 当学院集中办理；学院系统/盖章汇总；单人非该批次不得强制上传整批其他学生信息；[SRC-001]；F016/F037",
      "requiredElements": [
        "学院批量住宿申请汇总表；关联多名学生与各自申请"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M003",
      "name": "学生学籍身份/培养类别可信底账",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 学生学籍身份/培养类别可信底账；P0–P2；教务/研究生等权威来源；接口不可用不强迫学生伪造替代截图；F002/F005/F006/F011/F039",
      "requiredElements": [
        "学生学籍身份/培养类别可信底账"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M004",
      "name": "宿舍分配、住寝状态和历史占用台账",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 宿舍分配、住寝状态和历史占用台账；P0–P6；楼寓中心/校区权威来源；若从未分配床位，应显式记录 unassigned 而非捏造房号；F004/F007/F008/F033/F039",
      "requiredElements": [
        "宿舍分配、住寝状态和历史占用台账"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M005",
      "name": "休学、退学、延期毕业等正式学籍异动决定",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 休学、退学、延期毕业等正式学籍异动决定；SC-01/04/08 对应决定发生后；S01 学籍有权源；“计划休学”不是已生效休学；[SRC-005]；F006/F015/F038",
      "requiredElements": [
        "休学、退学、延期毕业等正式学籍异动决定"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M006",
      "name": "已批准外住/取消外住正式记录",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 已批准外住/取消外住正式记录；SC-02/04/10；S04-T02 或国际学生科有权结果/备案；学生自述不证明取消完成；[SRC-001][SRC-011][SRC-014]；F014/F038/F042",
      "requiredElements": [
        "已批准外住/取消外住正式记录"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M007",
      "name": "学院对本次住宿申请的审核/转报意见及日志",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 学院对本次住宿申请的审核/转报意见及日志；延住 P2；学院签发记录，纸面章像须验签；[SRC-001]；F010/F016/F037",
      "requiredElements": [
        "学院对本次住宿申请的审核/转报意见及日志"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M008",
      "name": "楼寓/校区对本次住宿申请的核准名单、决定、备案版本",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 楼寓/校区对本次住宿申请的核准名单、决定、备案版本；延住 P3 之后；受权楼寓来源；P1/P2 不可作为缺件；[SRC-001]；F018/F019/F037/F038",
      "requiredElements": [
        "楼寓/校区对本次住宿申请的核准名单、决定、备案版本"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M009",
      "name": "住宿收费生成记录及正式缴费通知（含适用截止与送达）",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 住宿收费生成记录及正式缴费通知（含适用截止与送达）；延住 P4；财务及有权通知主体；申请人缴费截图不是通知；[SRC-001][SRC-005][SRC-013]；普通年度缴费通知不构成延住缴费截止；F020/F021",
      "requiredElements": [
        "住宿收费生成记录及正式缴费通知（含适用截止与送达）"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M010",
      "name": "真实缴费入账状态",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 真实缴费入账状态；延住 P4/P5；计划财务处权威支付台账，收款截图可作查询线索；[SRC-001][SRC-005][SRC-013]；到账延迟应考虑账务同步；F022",
      "requiredElements": [
        "真实缴费入账状态"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M011",
      "name": "适用校区、学段、年度的原始制度/当期通知",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 适用校区、学段、年度的原始制度/当期通知；P0 全程；学校政策库，按发布/生效/替代链校核；可能引用 [SRC-001][SRC-003][SRC-005][SRC-007][SRC-011][SRC-014][SRC-016]，不等于均现行；F004/F011/F012/F031/F039",
      "requiredElements": [
        "适用校区、学段、年度的原始制度/当期通知"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M012",
      "name": "钥匙、卡/遥控器等实物交接回执",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 钥匙、卡/遥控器等实物交接回执；退宿执行 P5；公寓前台或现场签收，具体物品要求由适用通知确定；[SRC-002][SRC-004]；F023",
      "requiredElements": [
        "钥匙、卡/遥控器等实物交接回执"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M013",
      "name": "公物/卫生/遗留物检查记录",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 公物/卫生/遗留物检查记录；退宿 P5；公寓现场验收；损坏赔偿另走有权程序；[SRC-002][SRC-003][SRC-004]；F024",
      "requiredElements": [
        "公物/卫生/遗留物检查记录"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M014",
      "name": "退寝室单/退宿单原件或权威登记",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 退寝室单/退宿单原件或权威登记；退宿 P5；由公寓按其真实流程签发，关联旧房号及操作者；[SRC-002]；F025/F035",
      "requiredElements": [
        "退寝室单/退宿单原件或权威登记"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M015",
      "name": "入住/退宿实际完成的宿管台账与回执",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 入住/退宿实际完成的宿管台账与回执；P5–P6；楼寓/校区宿管源；缺接入不得认定未办理，须 SOURCE_UNAVAILABLE；F008/F027/F037",
      "requiredElements": [
        "入住/退宿实际完成的宿管台账与回执"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M016",
      "name": "毕业离校系统事项/毕业身份权威记录",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 毕业离校系统事项/毕业身份权威记录；SC-05/10 P5–P6；当届校区有此流程才查；[SRC-002][SRC-003]；F011/F026",
      "requiredElements": [
        "毕业离校系统事项/毕业身份权威记录"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M017",
      "name": "财务收费核减、退款、电费余额处理结果",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 财务收费核减、退款、电费余额处理结果；P4/P6 存在财务处理时；计划财务处权威结果，不为退宿完成的必要前置；[SRC-005][SRC-008][SRC-010]；F028/F041",
      "requiredElements": [
        "财务收费核减、退款、电费余额处理结果"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M018",
      "name": "申请人撤回、补件或复核的提交记录及请求内容",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 申请人撤回、补件或复核的提交记录及请求内容；P1–P7 发生时；申请主体/受理回执；动作效力依校方制度/权限确定；F029/F040",
      "requiredElements": [
        "申请人撤回、补件或复核的提交记录及请求内容"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M019",
      "name": "有权部门对撤回/复核的受理、处理或决定及送达记录",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 有权部门对撤回/复核的受理、处理或决定及送达记录；P7 受理后；学校授权部门，不能由按钮直接生成；[SRC-006][SRC-007] 只支持一般程序边界；F029/F037/F038/F040",
      "requiredElements": [
        "有权部门对撤回/复核的受理、处理或决定及送达记录"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M020",
      "name": "合法委托/代理的授权范围及身份核验",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 合法委托/代理的授权范围及身份核验；代理提交、撤回、接收或申诉时条件使用；校本具体许可待查，不能默认父母/辅导员有全部权限；F003/F032/F037",
      "requiredElements": [
        "合法委托/代理的授权范围及身份核验"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M021",
      "name": "证据原件索引/版本/位置/可信验证日志",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 证据原件索引/版本/位置/可信验证日志；全程由系统与可核来源生成，含 SHA256、页/栏位、源 URI、提取版；OCR 是派生视图而非原件；F001/F009/F010/F033/F034/F035/F039/F040",
      "requiredElements": [
        "证据原件索引/版本/位置/可信验证日志"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M022",
      "name": "学校正式违纪处分决定及其生效/救济信息",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 学校正式违纪处分决定及其生效/救济信息；SC-08 处分成立后由有权源提供；国际学生另引 [SRC-012]；不能用违纪举报或宿管巡查图替代；[SRC-006][SRC-012]；F030/F038",
      "requiredElements": [
        "学校正式违纪处分决定及其生效/救济信息"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M023",
      "name": "经校方权限核实的限期腾退/取消住宿/不予续住等正式告知与决定",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 经校方权限核实的限期腾退/取消住宿/不予续住等正式告知与决定；SC-07/08 有效文书存在后；终止授权尚待核，不可由模型合成；[SRC-001][SRC-006] 不能单独证明统一终止程序；F020/F030/F036/F037/F038",
      "requiredElements": [
        "经校方权限核实的限期腾退/取消住宿/不予续住等正式告知与决定"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M024",
      "name": "国际学生科正式受理的校内退宿或校外住宿变更登记及其处理回执",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 国际学生科正式受理的校内退宿或校外住宿变更登记及其处理回执；SC-10 国际学生依学校真实流程办理 P2–P6 才出现；国际学生科/校区宿管持有；2025 指南仅证明其归口与外住登记，不证明有统一电子退宿单；[SRC-011][SRC-014]；F014/F037/F042",
      "requiredElements": [
        "国际学生科正式受理的校内退宿或校外住宿变更登记及其处理回执"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M025",
      "name": "国际学生转校外居住时公安机关出具的《住宿登记表》，仅证明校外实际住宿登记、为专项退宿申请提供一项凭证",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 国际学生转校外居住时公安机关出具的《住宿登记表》，仅证明校外实际住宿登记、为专项退宿申请提供一项凭证；SC-10 国际学生按适用 2025 及后续已核有效流程完成校外住所登记后才可能产生；由学生持有公安机关原件，不能替代国际学生科批复或公寓钥匙交验；[SRC-014]；F043/F035/F042",
      "requiredElements": [
        "国际学生转校外居住时公安机关出具的《住宿登记表》，仅证明校外实际住宿登记、为专项退宿申请提供一项凭证"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    },
    {
      "id": "M026",
      "name": "《未分配宿舍信息汇总表》及学院核准的未分配学生清单；证明待核学年无床位分配、支持财务取消预生成住宿费的独立归口",
      "purpose": "按研究稿核验材料用途与归属；不将文件存在等同于真实性或批准。 《未分配宿舍信息汇总表》及学院核准的未分配学生清单；证明待核学年无床位分配、支持财务取消预生成住宿费的独立归口；仅当前校区确有相应未分配名单/收费取消办理且进入学院向楼寓汇总及财务核减阶段后形成；学院持有当期签章纸本与电子名单，楼寓和财务各持转交/办理回执；[SRC-001]；不适用于实际中途退宿，不替代 M014；F007/F011/F021/F028/F041",
      "requiredElements": [
        "《未分配宿舍信息汇总表》及学院核准的未分配学生清单；证明待核学年无床位分配、支持财务取消预生成住宿费的独立归口"
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
      "maxCount": 9999,
      "requiredAt": "decision",
      "allowReuseAcrossSubjects": false
    }
  ],
  "sections": [
    {
      "id": "rules",
      "name": "研究稿事实核验与人工复核标准",
      "description": "每条 criterion 来自对应研究稿 R 规则；不是学校正式政策，不自动形成行政决定。",
      "order": 0,
      "required": true,
      "criteria": [
        {
          "id": "R001",
          "title": "主业务归属",
          "requirement": "P0；T=延住/独立退住/资格状态核验；F=纯调寝、纯外住批准、假期留宿或财务退款；U=需求动作不明；SRC-001/SRC-002；F009/F040；M001/M021；将申请主动作与 SC、相邻 S04-T02/T03 及财务动作比对；调寝旧房退宿单归主调寝案，不新作本模板决定；T 且归属清楚 PASS_FACT；F NOT_APPLICABLE 并路由；U NEEDS_MATERIAL 由申请人/学院澄清；两业务声称同一决定→CONFLICT，模板维护人。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R002",
          "title": "学生真实身份",
          "requirement": "P0 全情形；T=确定学生主体；F=纯政策资料未建个案；U=主键不明；SRC-001/SRC-007；F002/F003/F039；M003/M021；以学籍权威键匹配而非姓名、卡片照片或 Renderer 身份；只在授权快照时点核，国际/历史学籍需对应源；一致 PASS_FACT；两身份对同一凭证 CONFLICT→学籍管理者；主档不可用 SOURCE_UNAVAILABLE→系统管理员；不得给出“不具资格”。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R003",
          "title": "原宿舍/床位归属",
          "requirement": "P0–P6；T=存在当前/历史住寝关系待查；F=从未分配床位且仅申请首次入住；U=分配记录状态不明；SRC-001/SRC-002；F004/F007/F008；M004/M015；核学生、校区、楼栋床位、分配批次、有效时间交集；已退旧房不覆盖新房；无床位只核“未分配”，不虚构退宿单；匹配 PASS_FACT；错学生/错床位 CONFLICT→楼寓台账人员；通道失败 SOURCE_UNAVAILABLE；F NOT_APPLICABLE。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R004",
          "title": "校本政策版本适用",
          "requirement": "P0 全程；T=要用时限、材料、权责等规则；F=只做已归属原始证据的可读性检查；U=校区/学年/政策链不清；SRC-001/SRC-003/SRC-004/SRC-005/SRC-007/SRC-011/SRC-015/SRC-016；F004/F011/F012/F031/F039；M011；比对发布、生效、废止、适用学校办学主体、校区/学段/届别；2017/2022 旧试行文件效力待核；SRC-015 工程技术学院必排除、SRC-016 机电学院时间不推广全校；宜宾 2026 不能套成都 2027；当期明确且有效 PASS_FACT；校区/届别错配 CONFLICT→规则配置 Owner；无现行文本 POLICY_UNCONFIRMED→后勤/学工制度 Owner；F NOT_APPLICABLE。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R005",
          "title": "前置学籍身份及延毕事实",
          "requirement": "SC-01/04/08 P2/P5；T=业务依赖休学/退学/延毕/毕业结果；F=不依赖；U=有异动主张无正式结论；SRC-001/SRC-005；F005/F006/F015；M003/M005；只读取 S01/研究生院/教务处有效文书及 effective_at；拟申请延期非获准延期；历史冲突按源版本/更正链；权威结论与所述事实匹配 PASS_FACT；矛盾 CONFLICT→学籍部门；权威不可取 SOURCE_UNAVAILABLE；未形成决定 NEEDS_HUMAN_DECISION→学籍有权人。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R006",
          "title": "外住取消或获批触发",
          "requirement": "SC-02/04 P2/P5；T=自述因外住变更入宿/退宿；F=无外住关联；U=申请书声称取消但源不明；SRC-001；F014/F038；M006；引用 S04-T02 的校方批准/取消及有效期，学生自述不使原外住批准失效；不审其安全承诺；存在对应有效决定 PASS_FACT；主张与权威不符 CONFLICT→外住业务 Owner；无权威来源 SOURCE_UNAVAILABLE；尚待审批 NEEDS_HUMAN_DECISION。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R007",
          "title": "本次住宿申请表达完整性",
          "requirement": "SC-01/02/03 P1；T=正式要求学生发起延住/恢复入住申请；F=退宿或已有有效决定仅复核事实；U=无明确申请类型；SRC-001；F009/F013/F017；M001；核表名、申请学生、意图、申请时阶段性必需内容；仅采用当期认可表格，不臆造必填字段；手写/扫描无法读先 UNREADABLE；可核申请事实 PASS_FACT→学院受理；真实缺当前材料 NEEDS_MATERIAL→学生；源政策未确认必填 POLICY_UNCONFIRMED→学院/后勤。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R008",
          "title": "学院审核与汇总归属",
          "requirement": "SC-01/02/03 P2；T=材料已进入学院审核/转报；F=P1 尚未提交学院或退宿情形不要求；U=学院印章仅为照片；SRC-001；F010/F016/F037；M002/M007/M021；核该学生在批次中的唯一行、学院真实签章/授权记录、审核时点；批量汇总包含其他学生时最小化访问；表单影像盖章不代表可信学院账户；一致 PASS_FACT→楼寓中心；未提交但现阶段应有 NEEDS_MATERIAL→学院；角色/印章冲突 CONFLICT→学院核签人员。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R009",
          "title": "楼寓正式审批身份与决定",
          "requirement": "SC-01/02/03 P3 及以后；T=中心确已作决定；F=P1/P2 尚未审批；U=所谓“已批准”仅来自上传截图；SRC-001；F018/F037/F038；M008/M021；校验签发单位、岗位当时授权、申请与批准的 student+assignment+action 关联、决定版本；批准/驳回的具体内容如实引用，不由审核模型决定；决定确实可验证 PASS_FACT（只表示决定记录真实）→学院通知；冲突 CONFLICT→楼寓有权人；无通道 SOURCE_UNAVAILABLE；是否批准由原文决定字段表达，不能由 PASS 推断。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R010",
          "title": "核准住房期限与条件",
          "requirement": "SC-01/02/03 P3–P6；T=已有正式核准且需检查执行范围；F=无正式核准或纯退宿；U=期限/附款未获原件；SRC-001/SRC-005；F005/F019/F031/F036；M008/M011；校区/床位/起止与本次申请一致性；官网“硕士 3 学年、连读 4 学年”及超学制口径未经现行原规则确认，不设拒绝阈值；特别个案留人工；仅核已核准内容相符 PASS_FACT；错房/错期限 CONFLICT→中心；无校本现行配置 POLICY_UNCONFIRMED→制度 Owner；例外 NEEDS_HUMAN_DECISION→有权人。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R011",
          "title": "财务应缴项目已生成",
          "requirement": "延住 P4；T=有获批名单需生成住宿费；F=P1–P3 未批或纯退宿；U=仅有申请人截图；SRC-001/SRC-005；F018/F021；M008/M009；对比中心核准名单和财务收费记录的学生、学期、校区、费用种类；金额计算由财务系统决定；对应生成 PASS_FACT→财务/学院通知；错人或错项目 CONFLICT→财务；不可达 SOURCE_UNAVAILABLE；不以未生成推定中心未批准。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R012",
          "title": "缴费状态可核",
          "requirement": "延住 P4–P5；T=已经生成当次费用并进入缴费阶段；F=前置阶段/政策明确免缴或无需缴；U=只有银行/微信截图；SRC-001/SRC-005/SRC-013；F020/F022/F039；M009/M010；依财务入账而非支付页面截图，核该次应缴单、交易、入账、冲正及贷款抵扣周期；SRC-013 说明票据/贷款抵扣可能滞后，付款截图早于权威入账不是当然真冲突；已入账事实 PASS_FACT→公寓入住办理；同一费用及对账时点确不符 CONFLICT→财务核对；到账待处理 NEEDS_HUMAN_DECISION→财务；服务故障 SOURCE_UNAVAILABLE；F NOT_APPLICABLE。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R013",
          "title": "逾期未缴与资格效力隔离",
          "requirement": "SC-07 P4–P6；T=中心考虑未缴/逾期后续处置；F=费用未生成或无该适用条件；U=通知期限/送达缺失；SRC-001/SRC-005；F020/F022/F030；M009/M010/M023；逐核正式通知、本人适用截止、实际入账、补缴/缓缴或争议处理；不得单靠旧服务页“视为放弃”自动生效终止；客观日期/入账核清 PASS_FACT，资格是否放弃 NEEDS_HUMAN_DECISION→楼寓有权人；政策不明 POLICY_UNCONFIRMED；日期冲突 CONFLICT→财务+中心。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R014",
          "title": "许可入住的实际执行",
          "requirement": "SC-01/02/03 P5；T=已有正式核准、按流程可进入入住；F=P1–P4 尚未执行/仅退宿；U=公寓入住状态无法取；SRC-001；F018/F019/F022/F027；M008/M010/M015；比对获批床位、缴费确认（仅当现行规定要求）、公寓入住或续住台账；有例外通知走授权人工；可核实际入住 PASS_FACT→楼寓台账归档；批准但未入住不称“已完成”；台账/批准错配 CONFLICT→公寓；源失败 SOURCE_UNAVAILABLE。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R015",
          "title": "中途退宿的合法前置事件",
          "requirement": "SC-04 P2/P5；T=因休学、退学或校外住宿进入退宿；F=普通毕业退宿/单纯调寝；U=触发文件待生效；SRC-002/SRC-005/SRC-010；F006/F014/F015；M005/M006；依 S01/外住有权生效日期核对本次退宿原因；SRC-010 为财务事项特定路径，部分休学情形先退宿再办财务，不能反向要求财务退款完成才受理现场退宿；当期顺序待核；前置事实清楚 PASS_FACT→公寓现场受理；申请人说退学但官方未决 NEEDS_HUMAN_DECISION→学籍归口；不一致 CONFLICT。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R016",
          "title": "毕业退宿届别与通知",
          "requirement": "SC-05/10 P1/P5；T=按毕业届别组织退宿；F=非毕业退住；U=校区/当届通知不全；SRC-002/SRC-003/SRC-004/SRC-016；F004/F011/F026/F031；M011/M016；先核成都/宜宾与应届、批次，2026 宜宾窗口不得用于其他届校区；SRC-016 成都机电学院 6/5–22 离校系统与 6/22 公寓检查仅限该学院当届，不是全校退房截止；校区届别与适用当期通知匹配 PASS_FACT→公寓前台；误套批次 CONFLICT→校区业务 Owner；查不到通知 POLICY_UNCONFIRMED。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R017",
          "title": "钥匙与实物交还",
          "requirement": "SC-04/05/07/08 P5；T=已进入现场退宿；F=申请/审批尚未办理实物退宿；U=签收或物品清单不清；SRC-002/SRC-003/SRC-004；F007/F023；M012/M011；按当期要求核交还物品、时间、前台接收人及旧床位关联；不能套用 2024 宜宾全部物品清单；可核交接 PASS_FACT→前台；尚缺且现时应交 NEEDS_MATERIAL→学生/公寓；物品争议 NEEDS_HUMAN_DECISION→现场负责人；来源冲突 CONFLICT。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R018",
          "title": "公物/房间检查事实",
          "requirement": "SC-04/05/07/08 P5；T=现场应验收；F=尚未现场交验；U=检查记录未知；SRC-002/SRC-003/SRC-004；F024/F007；M013；核检查人员、房间、发现损坏/遗留物与验收时间；不自动判赔偿金额或过错；过期通知不强制附加未证实物品；已检查事实 PASS_FACT→公寓管理；确少当期记录 NEEDS_MATERIAL→前台；责任争议 NEEDS_HUMAN_DECISION，跨房间 CONFLICT。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R019",
          "title": "退寝室单归属与签发",
          "requirement": "SC-04/05/07/08 P5；T=已有退宿单或当前流程需签发；F=尚未交验/调寝主案仅引用；U=单据无法绑定；SRC-001/SRC-002；F007/F025/F035；M014/M021；核原房号、学生、开具时点、签发岗位、编号和现场凭证；同一单不可充当新房腾退，调寝由 S04-T03 主办；匹配 PASS_FACT→中心归档；错房/重复单 CONFLICT→公寓主管；影像不清 UNREADABLE；无签发渠道 SOURCE_UNAVAILABLE。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R020",
          "title": "毕业离校系统中的宿舍事项",
          "requirement": "SC-05/10 P5–P6；T=该届校区使用数字离校；F=无此平台的正式线下退宿；U=系统流程未确认；SRC-002/SRC-003；F026/F039；M016/M011；仅检查“公寓退宿”子项，不将数字离校其他未办事项误作住宿资格问题；旧成都指南不推定宜宾当届系统同构；相关子项可信 PASS_FACT→学院/校区办离校；系统记录冲突 CONFLICT；接入失败 SOURCE_UNAVAILABLE；现行平台未知 POLICY_UNCONFIRMED。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R021",
          "title": "宿管占用台账更新",
          "requirement": "SC-01/02/03/04/05/07/08 P5–P6；T=有已执行入住/退房需落账；F=仅申请意向；U=查不到权威台账；SRC-001/SRC-002；F008/F027/F040；M004/M015；对比现场办理时刻、中心登记和当前占用状态；允许合理流程滞后但需要标记待确认，不由模型代写系统台账；同一关系状态吻合 PASS_FACT→中心归档；前台已退而台账仍占用 CONFLICT→楼寓台账员；无权威源 SOURCE_UNAVAILABLE。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R022",
          "title": "住宿资格终止文书的存在与效力",
          "requirement": "SC-07/08 P6；T=外部有权源宣称终止/不予续住；F=正常延住或自愿退宿且无终止动作；U=仅系统逾期推断/巡查记录；SRC-001/SRC-006/SRC-007/SRC-009/SRC-012；F030/F031/F037/F038；M023/M011；核文书签发机关、权限、对象、校本依据、送达/生效、例外与救济；国内与国际学生纪律归口不同；目前未找到统一校本终止授权；原文存在仅可 PASS_FACT 记录“文书可核”，其法律适用/资格最终效力须 NEEDS_HUMAN_DECISION→校方有权人；政策未证实 POLICY_UNCONFIRMED；绝不自动终止。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R023",
          "title": "涉纪律处分的有效引用",
          "requirement": "SC-08 P5–P6；T=宿舍执行依赖已生效处分/腾退决定；F=纯自愿退宿；U=举报或口头通知；SRC-006/SRC-007/SRC-012；F015/F030/F038；M022/M023；核纪律处分决定及申辩、救济等记录；2017 国内、2022 国际处分试行规章时效待查；处分≠当然取消宿舍，须额外核专门授权；有效文书事实 PASS_FACT；处分是否触发资格终止 NEEDS_HUMAN_DECISION→学工/校区有权人；制度未定 POLICY_UNCONFIRMED。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R024",
          "title": "费用结算与退宿独立性",
          "requirement": "SC-02/03/04/05/07/08 P4/P6；T=发生住宿费生成取消/核减/退费/电费余额处理；F=未涉及财务调整；U=财务只留自报凭证；SRC-001/SRC-005/SRC-008/SRC-010/SRC-013；F028/F041/F007；M017/M004/M026；核财务自己的收费单、费用类别、学生、宿舍关联和处理状态；未分配宿舍须以楼寓分配源及学院正式未分配名单 M026 核无床位并由财务独立取消该项费用；住宿费、电费等类别不得混为一笔；旧 2017 算法未经当期校核不用于自动金额裁定；财务结算事实可核 PASS_FACT→财务归档；错账户/类别 CONFLICT→计划财务处；未能查询 SOURCE_UNAVAILABLE；绝不以 PASS 推断退宿完成。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R025",
          "title": "证据原件、OCR 与签发可信性",
          "requirement": "P0–P7；T=规则引用任一电子/扫描证据；F=纯源系统结构化已验真数据且无影像；U=原始字节/定位丢失；SRC-001/SRC-002/SRC-005/SRC-006；F034/F035/F039；M021/M001/M014；检哈希、文件版本、页/表格行、签章与发件方；OCR 提取错误不等于文书虚假；扫描糊可人工复扫，接口缺失另分类；原件可定位 PASS_FACT；不可辨读 UNREADABLE→提交人；不同版冲突 CONFLICT→材料归属人；权威验签需人工 NEEDS_HUMAN_DECISION。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R026",
          "title": "代办/代理动作授权",
          "requirement": "P0/P7；T=提交人并非被审学生且代执行需授权动作；F=学生可信本人操作；U=校方未公布代理许可；SRC-001/SRC-007/SRC-014；F003/F032/F037；M020/M021；比对代理身份、委托范围、动作、期限与学校当期许可；SRC-014 的 2025 国际新生注册不可代办不等于所有在校退宿不能委托；交纸件≠可代撤回/代申诉；未确认许可不能自动批；授权有效事实 PASS_FACT 仅支持此动作；文件缺 NEEDS_MATERIAL→代理提交人；许可不明 POLICY_UNCONFIRMED→归口；伪造角色 CONFLICT→授权管理员。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R027",
          "title": "同人/同房多案重叠",
          "requirement": "P0/P6；T=发现另一案/床位关系与本案时间或对象重合；F=无重叠；U=历史台账不可取；SRC-001/SRC-002；F001/F007/F033/F040；M004/M021；同一可信学生键、分配键、有效期间与动作键比对；纠正调寝旧房记录、不错误合并不同届案；真实重叠且无合理解释 CONFLICT→楼寓数据 Owner；不同房/不同时期正常 PASS_FACT；不可取 SOURCE_UNAVAILABLE；F NOT_APPLICABLE。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R028",
          "title": "撤回申请的效力边界",
          "requirement": "P1–P7；T=学生/合法代理提交撤回；F=没有撤回；U=是否可撤回或受理角色未确认；SRC-001/SRC-007；F029/F032/F037/F040；M018/M019/M020；核提交和接收时间、已否产生校方正式决定、权威受理记录；撤回意向≠正式撤销已批准住宿或自动解约；提交记录可核 PASS_FACT；是否生效 NEEDS_HUMAN_DECISION→有权受理员；代理不符 CONFLICT；无现行规则 POLICY_UNCONFIRMED。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R029",
          "title": "复核/申诉及再次办理",
          "requirement": "P7；T=学生对既有正式处理提出争议；F=无争议动作；U=救济通道、期限与权限未知；SRC-006/SRC-007/SRC-012；F029/F030/F037/F038；M018/M019/M023；核原决定号/送达/请求范围及所选有权渠道；只引用 G08-T03 的工单办理事实，不让通用诉求推翻住宿决定；国内/国际纪律申诉依各自专门规定；争议事实可核 PASS_FACT→申诉受理机关；是否受理/改变效力 NEEDS_HUMAN_DECISION；无校本时限 POLICY_UNCONFIRMED；不妄报逾期。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R030",
          "title": "补件/材料版本的定向重审",
          "requirement": "P1–P7；T=已存在新材料 supersedes 旧版或源数据事件变更；F=无变更；U=旧版缺失无法比较；SRC-001/SRC-002；F001/F034/F035/F040；M021/M018；按 materialSlot + subject + assignment + factId 求依赖 R 集合；保留旧结果及其旧版引用，只重审直系依赖和受其结果影响的下游规则，不重跑无关对象；版本链清楚 PASS_FACT（仅代表重审范围可核）→相关待办角色；版冲突 CONFLICT；缺旧本 SOURCE_UNAVAILABLE；不得涂改原有效决定。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        },
        {
          "id": "R031",
          "title": "特殊延住/超学制例外的有权裁量",
          "requirement": "SC-01/03/07 P2–P6；T=要求超过通常期限、缓缴或特殊困难例外；F=无例外请求；U=现行规则与决策者不明；SRC-001/SRC-005/SRC-009；F005/F012/F019/F020/F036/F037；M001/M005/M011/M023；记录申请理由与学籍/住宿史，不根据旧网页 3/4 学年、未缴费、请假或身体困难自动批准/拒绝；所需医学等敏感材料仅经现行程序确定；事实说明可核 PASS_FACT，实质例外一律 NEEDS_HUMAN_DECISION→有权住房决策者；政策/授权未知 POLICY_UNCONFIRMED→制度 Owner；不自动腾退。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R032",
          "title": "国际学生科住宿变更与公寓退宿衔接",
          "requirement": "SC-10 P2–P6；T=校内留学生拟退宿/转外住且国际学生科参与；F=国内学生或确定不存在该专项流程；U=当期表单和批准是否已办不明；SRC-011/SRC-014；F002/F005/F014/F025/F037/F042/F043；M003/M006/M014/M024/M025；核 2025 指南所述 M025 公安《住宿登记表》、国际学生科 M024 受理、旧床位与 M014 宿管执行的各自签发来源/时间先后；公安居住登记只证明校外居住，不等于国际学生科办理完毕或公寓退房；2025 指南不能创造 2026 自动清退程序；有权记录可核 PASS_FACT→国际学生科/楼寓；两部门记录冲突 CONFLICT→联合核实；当期政策未知 POLICY_UNCONFIRMED；源不可达 SOURCE_UNAVAILABLE；F NOT_APPLICABLE。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R033",
          "title": "财务退费/学籍异动的退宿关联凭证核验",
          "requirement": "SC-04/07 P4/P6；T=学生已进入财务退住宿费或休学费用结算分支；F=仅退宿、没有财务动作；U=当期财务所需附件与替代尚未知；SRC-005/SRC-010；F007/F014/F015/F028/F041；M005/M006/M014/M017；按 SRC-010 财务清单第 29 项区分：外住退住宿费关联有后勤签章的外住申请材料、休学财务业务关联已退宿手续；这是财务侧受理条件，不要求所有毕业生走同一路径，不算金额；传递与财务类别对应事实 PASS_FACT→财务受理；错材料/错业务 CONFLICT；当期现行性不明 POLICY_UNCONFIRMED；实际金额及退费是否批准 NEEDS_HUMAN_DECISION→财务有权人；F NOT_APPLICABLE。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "manual",
          "targetScope": "case"
        },
        {
          "id": "R034",
          "title": "未分配宿舍费用取消的事实转交",
          "requirement": "仅下一学年未分配床位且财务已预生成住宿费的独立收费取消分支 P4/P6；T=可信宿管无床位且学院开始名单转交；F=实际有住寝关系并办理退房、普通延住/退住或未形成该类收费；U=校区是否采用该服务、名单或费用源不可核；SRC-001；F007/F011/F021/F028/F041；M004/M026/M017；核同一校区/学年/学生主键在 M004 为未分配、M026 由学院真实签章与楼寓转交、M017 财务按同一收费单取消该项费用；官网 6 月底/9 月初只是资料报送提示，需核当期配置；学生 P1 不必交未来学院名单；不推断现金已退或退宿完成；名单转交事实、独立财务取消结果分别核 PASS_FACT→楼寓/财务各归档；无当前名单 NEEDS_MATERIAL→学院（仅已到汇总阶段）；权威接口失联 SOURCE_UNAVAILABLE→对应数据 Owner；校区/年度政策未知 POLICY_UNCONFIRMED→制度 Owner；错人/学年/收费单 CONFLICT→财务复核；F NOT_APPLICABLE，不得注销床位。本项仅作事实核验/审阅建议；政策、权限或效力未确认时必须待人工有权复核，不得自动形成正式通过或拒绝。",
          "execution": "semantic",
          "targetScope": "case"
        }
      ]
    }
  ],
  "policyVersionIds": [],
  "stages": [
    {
      "id": "p0",
      "name": "P0 事项发起/路由",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p1",
      "workflowOwner": "local"
    },
    {
      "id": "p1",
      "name": "P1 受理与表单准备",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p2",
      "workflowOwner": "local"
    },
    {
      "id": "p2",
      "name": "P2 学院事实审核",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p3",
      "workflowOwner": "local"
    },
    {
      "id": "p3",
      "name": "P3 楼寓中心/校区处理文书核验（不代办审批）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p4",
      "workflowOwner": "local"
    },
    {
      "id": "p4",
      "name": "P4 财务联动（独立事实核验，不作费用裁定）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p5",
      "workflowOwner": "local"
    },
    {
      "id": "p5",
      "name": "P5 实物入住/退住执行事实核验",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p6",
      "workflowOwner": "local"
    },
    {
      "id": "p6",
      "name": "P6 状态完成/资格终止事实核验（不自动终止）",
      "kind": "manual-review",
      "executorRole": "reviewer",
      "nextStageId": "p7",
      "workflowOwner": "local"
    },
    {
      "id": "p7",
      "name": "P7 补件/撤回/复核及后续处置（仅人工交接）",
      "kind": "manual-review",
      "executorRole": "teacher",
      "workflowOwner": "local"
    }
  ],
  "outputs": [
    {
      "id": "result-code-findings",
      "kind": "item-feedback",
      "audience": "reviewer"
    },
    {
      "id": "issue-and-todo-list",
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

/** SRC identifiers are research references, never case-material SourceRef values. */
export const r02Metadata = {
  "templateId": "S04-T05",
  "name": "延长住宿、退住及住宿资格终止核验",
  "sourceDocumentPath": "docs/design/review-agent/business-templates/R02/S04-T05.md",
  "sourceDocumentSha256": "11d3f45e402dbbe4feb387305e00b7d5bdd0ba60e39203cf57e818547b20eaa2",
  "officialSchoolTemplate": false,
  "researchDate": "2026-10-23",
  "policyEvidenceStatus": "PARTIAL",
  "originalResearchBlobSha": "de1a0317fb531f275e7a2691db2a63a23c8699ee",
  "manifestSha256WithOneTrailingLf": "f689956ee063bec254139275a9ad6d608a63860b1dd115dab8859ae5d8365333",
  "criteria": [
    {
      "sectionId": "rules",
      "criterionId": "R001",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R002",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R003",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R004",
      "srcIds": [
        "SRC-001",
        "SRC-003",
        "SRC-004",
        "SRC-005",
        "SRC-007",
        "SRC-011",
        "SRC-015",
        "SRC-016"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R005",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R006",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R007",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R008",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R009",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R010",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R011",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R012",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-013"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R013",
      "srcIds": [
        "SRC-001",
        "SRC-005"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R014",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R015",
      "srcIds": [
        "SRC-002",
        "SRC-005",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R016",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004",
        "SRC-016"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R017",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R018",
      "srcIds": [
        "SRC-002",
        "SRC-003",
        "SRC-004"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R019",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R020",
      "srcIds": [
        "SRC-002",
        "SRC-003"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R021",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R022",
      "srcIds": [
        "SRC-001",
        "SRC-006",
        "SRC-007",
        "SRC-009",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R023",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R024",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-008",
        "SRC-010",
        "SRC-013"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R025",
      "srcIds": [
        "SRC-001",
        "SRC-002",
        "SRC-005",
        "SRC-006"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R026",
      "srcIds": [
        "SRC-001",
        "SRC-007",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R027",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R028",
      "srcIds": [
        "SRC-001",
        "SRC-007"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R029",
      "srcIds": [
        "SRC-006",
        "SRC-007",
        "SRC-012"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R030",
      "srcIds": [
        "SRC-001",
        "SRC-002"
      ],
      "evidenceStatus": "PARTIAL"
    },
    {
      "sectionId": "rules",
      "criterionId": "R031",
      "srcIds": [
        "SRC-001",
        "SRC-005",
        "SRC-009"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R032",
      "srcIds": [
        "SRC-011",
        "SRC-014"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R033",
      "srcIds": [
        "SRC-005",
        "SRC-010"
      ],
      "evidenceStatus": "UNCONFIRMED"
    },
    {
      "sectionId": "rules",
      "criterionId": "R034",
      "srcIds": [
        "SRC-001"
      ],
      "evidenceStatus": "PARTIAL"
    }
  ],
  "resultCodes": [
    {
      "code": "PASS_FACT",
      "meaning": "已具备与该目标、校区、时段一致的可核事实证据。不等于批准延住、不等于可入住、不等于退宿手续全部完成、不等于资格终止或退款",
      "nextAction": "需要下一业务步骤时由当前经授权角色继续；单项可归档",
      "notEquivalentTo": ""
    },
    {
      "code": "NOT_APPLICABLE",
      "meaning": "情形确实不触发，或后续阶段尚未到达（如 P1 不要求退寝室单）。不得用于不知道是否适用的情况",
      "nextAction": "无补件；可附邻接模板路由",
      "notEquivalentTo": ""
    },
    {
      "code": "NEEDS_MATERIAL",
      "meaning": "本阶段应由申请人/学院/现场人员形成且允许补交的证据缺失；政策要求必须已证实",
      "nextAction": "精确列出材料槽、目的、可合法替代和提交角色；不可要求后续才形成的批准书",
      "notEquivalentTo": ""
    },
    {
      "code": "CONFLICT",
      "meaning": "两条已定位证据对于同一目标事实不一致，如旧房单据对应新房、财务到账与自述冲突",
      "nextAction": "两端证据引用、冲突字段、时间和对照记录交权威数据 Owner",
      "notEquivalentTo": ""
    },
    {
      "code": "UNREADABLE",
      "meaning": "现有文件可获取却因加密、损坏、扫描模糊、页缺失、OCR 不可靠无法辨读关键内容",
      "nextAction": "指向损坏页/区域由材料持有者重传或人工视觉读证；不能判材料虚假",
      "notEquivalentTo": ""
    },
    {
      "code": "SOURCE_UNAVAILABLE",
      "meaning": "权威底账、政策原件服务、授权验证接口不可连接/权限不足/无可核原件",
      "nextAction": "技术/校内数据接口 Owner 恢复或线下正式核实；不能转嫁为学生上传假截图",
      "notEquivalentTo": ""
    },
    {
      "code": "POLICY_UNCONFIRMED",
      "meaning": "找不到现行校本条款、授权、适用届别/时限、过渡规则；旧 2017 试行条文不足以决定本案",
      "nextAction": "后勤/学生处/校区制度 Owner 补确认；不要输出截止/不资格等硬结论",
      "notEquivalentTo": ""
    },
    {
      "code": "NEEDS_HUMAN_DECISION",
      "meaning": "事实可供研判但涉及例外、书面批复、终止、处分、正式撤回或复核等有权裁量",
      "nextAction": "推送有真实授权的学校决定人及审查材料；不可由模型签发",
      "notEquivalentTo": ""
    }
  ]
} as const

/** R02 质量集成统一读取口；保留原批次具名导出兼容性。 */
export const templateVersion = template
